const puppeteer = require('puppeteer');

const moment = require('moment');

var { getResults } = require('./results');

const url = 'https://zone4.ca/?search=Hardwood%20Wed%20MTB%20Races';

// Firebase stuff
// https://firebase.google.com/docs/firestore/security/rules-structure?authuser=0

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url);

	const lengthSelector = '#searchresults > ul';
	const raceSelector = lengthSelector.concat(' > li:nth-child(');

	let i = 1;
	let length = await page.evaluate((lengthSelector) => {
		return {
			base: document.querySelector(lengthSelector).childElementCount
		};
	}, lengthSelector);

	// while (i < length) {
	while (i < 3) {
		let result = await page.evaluate(
			(raceSelector, i) => {
				return (resultObj = {
					date: document.querySelector(raceSelector + i + ') .date').innerText,
					link: document
						.querySelector(raceSelector + i + ') .name')
						.getAttribute('href')
				});
			},
			raceSelector,
			i
		);

		let resultData = await getResults(result.link);

		console.log('\n\n\n\n\n------------------------------');
		console.log(
			'| Results from ',
			moment(result.date).format('MMM DD, YYYY'),
			'|'
		);
		console.log('------------------------------');
		console.log(resultData);

		i++;
	}

	await browser.close();
})();
