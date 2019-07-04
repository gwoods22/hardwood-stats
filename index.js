const puppeteer = require('puppeteer');
const start = Date.now();
(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto('http://zone4.ca/results.asp?id=9382&cat=all');

	// Radical  Serious Gnarly  Crnkd Fun Sprockids
	// 12       15      18      21    24  27
	const trailDataID = 18;

	const baseSelector =
		'body > div:nth-child(18) > div > div > table:nth-child(';
	const trailSelector =
		baseSelector +
		(trailDataID - 1) +
		') > tbody > tr > td:nth-child(1) > font';
	const lengthSelector = baseSelector + trailDataID + ') > tbody';
	const rowSelector = lengthSelector + ' > tr:nth-child(';

	let initialData = await page.evaluate(
		lengthSelector,
		(trailSelector) => {
			return {
				listLength: document.querySelector(lengthSelector).children.length,
				trailname: document.querySelector(trailSelector).innerText,
			};
		},
		lengthSelector,
		trailSelector
	);

	let initialData = await page.evaluate(
		lengthSelector,
		(trailSelector) => {
			return {
				listLength: document.querySelector(lengthSelector).children.length,
				trailname: document.querySelector(trailSelector).innerText,
			};
		},
		lengthSelector,
		trailSelector
	);

	let initialData = await page.evaluate(
		lengthSelector,
		(trailSelector) => {
			return {
				listLength: document.querySelector(lengthSelector).children.length,
				trailname: document.querySelector(trailSelector).innerText,
			};
		},
		lengthSelector,
		trailSelector
	);

	console.log('\n\n' + initialData.trailname.split(/k\s/)[0] + 'km');
	console.log(
		'-------------------------------------------------------------------------------------------------'
	);
	console.log(
		'| Name\t\t\t| Bib\t| Sex\t| Age\t\t| Course\t| Time\t\t| Points|'
	);

	console.log(
		'-------------------------------------------------------------------------------------------------'
	);
	let i = 2;
	// start at 2 because nth-child starts at 1 and 1 is the heading
	// end at + 1 for same reason
	while (i < initialData.listLength + 1) {
		let result = await page.evaluate(
			(rowSelector, i) => {
				return (resultObj = {
					name: document.querySelector(rowSelector + i + ') > td:nth-child(3)')
						.innerText,
					bib: document.querySelector(rowSelector + i + ') > td:nth-child(2)')
						.innerText,
					category: document.querySelector(
						rowSelector + i + ') > td:nth-child(4)'
					).innerText,
					time: document.querySelector(rowSelector + i + ') > td:nth-child(6)')
						.innerText,
					points: document.querySelector(
						rowSelector + i + ') > td:nth-child(8)'
					).innerText,
				});
			},
			rowSelector,
			i
		);

		let {name, bib, category, time, points} = result;
		let race = category.split(/\s/)[0];
		let sex = category.split(/\s/)[1];
		let age = category.split(/\s/)[2];

		if (name.length <= 12) {
			if (time === '***') {
				console.log(
					'|',
					name,
					'\t\t|',
					bib,
					'\t|',
					sex,
					'\t|',
					age,
					'\t|',
					race,
					'\t|',
					time
				);
			} else {
				console.log(
					'|',
					name,
					'\t\t|',
					bib,
					'\t|',
					sex,
					'\t|',
					age,
					'\t|',
					race,
					'\t|',
					time,
					'\t|',
					points
				);
			}
		} else {
			if (time === '***') {
				console.log(
					'|',
					name,
					'\t|',
					bib,
					'\t|',
					sex,
					'\t|',
					age,
					'\t|',
					race,
					'\t|',
					time
				);
			} else {
				console.log(
					'|',
					name,
					'\t|',
					bib,
					'\t|',
					sex,
					'\t|',
					age,
					'\t|',
					race,
					'\t|',
					time,
					'\t|',
					points
				);
			}
		}

		i++;
	}
	console.log(
		'-------------------------------------------------------------------------------------------------\n'
	);

	await browser.close();
	const end = Date.now();
	const diff = new Date();
	diff.setTime(end.getTime() - start.getTime());
	console.log(`Operation took ${diff.getMilliseconds() / 1000} seconds`);
})();
