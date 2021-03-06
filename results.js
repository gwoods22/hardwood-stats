const puppeteer = require('puppeteer');

// const url = process.argv[2]
// 	? process.argv[2].concat('&cat=all')
// 	: 'http://zone4.ca/results.asp?id=9392&cat=all';

module.exports = {
	getResults: async function(url) {
		// (async () => {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.goto(url);

		// Radical  Serious Gnarly  Crnkd Fun Sprockids
		// 12       15      18      21    24  27
		let trailDataID = 12;

		let output = '';

		while (trailDataID < 28) {
			const baseSelector =
				'body > div:nth-child(18) > div > div > table:nth-child(';
			const trailNameSelector =
				baseSelector +
				(trailDataID - 1) +
				') > tbody > tr > td:nth-child(1) > font';
			const racersSelector = baseSelector + trailDataID + ') > tbody';
			const rowSelector = racersSelector + ' > tr:nth-child(';

			let initialData = await page.evaluate(
				(racersSelector, trailNameSelector) => {
					return {
						numRacers: document.querySelector(racersSelector).children.length,
						trailname: document.querySelector(trailNameSelector).innerText
					};
				},
				racersSelector,
				trailNameSelector
			);

			output = output.concat(
				'\n' + initialData.trailname.split(/k\s/)[0] + 'km\n'
			);
			output = output.concat(
				'-----------------------------------------------------------------------------------------------------------------\n'
			);
			output = output.concat(
				'| Place\t| Name\t\t\t| Bib\t| Sex\t| Age\t\t\t| Course\t| Time\t\t| Points|\n'
			);

			output = output.concat(
				'-----------------------------------------------------------------------------------------------------------------\n'
			);
			let i = 2;
			// start at 2 because nth-child starts at 1 and 1 is the heading
			// end at + 1 for same reason
			while (i < initialData.numRacers + 1) {
				let result = await page.evaluate(
					(rowSelector, i) => {
						return (resultObj = {
							place:
								document.querySelector(rowSelector + i + ') > td:nth-child(6)')
									.innerText === '***'
									? 'DNF'
									: i - 1,
							name: document.querySelector(
								rowSelector + i + ') > td:nth-child(3)'
							).innerText,
							bib: document.querySelector(
								rowSelector + i + ') > td:nth-child(2)'
							).innerText,
							category: document.querySelector(
								rowSelector + i + ') > td:nth-child(4)'
							).innerText,
							time: document.querySelector(
								rowSelector + i + ') > td:nth-child(6)'
							).innerText,
							points: document.querySelector(
								rowSelector + i + ') > td:nth-child(8)'
							).innerText
						});
					},
					rowSelector,
					i
				);

				let { place, name, bib, category, time, points } = result;
				let race = category.split(/\s/)[0];
				let sex = category.split(/\s/)[1];
				let age = category.split(/\s/)[2];

				let outputData = `| ${place} \t| ${name} ${
					name.length <= 12 ? '\t\t' : '\t'
				}| ${bib} \t| ${sex} \t| ${age} ${
					age.length <= 3 ? '\t\t' : '\t'
				} \t| ${race} \t| ${time} ${time === '***' ? '' : ` \t| ${points}`}`;

				output = output.concat(outputData, '\n');

				i++;
			}
			trailDataID += 3;
		}
		output = output = output.concat(
			'-----------------------------------------------------------------------------------------------------------------\n'
		);
		if (process.argv[2]) {
			output = output.concat('prop passed into url');
		} else {
			output = output.concat('default url used');
		}

		await browser.close();

		return output;
		// })();
	}
};
