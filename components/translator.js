const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require('./american-to-british-titles.js');
const britishOnly = require('./british-only.js');

class Translator {
	britishToAmericanSpelling(word) {
		const index = Object.values(americanToBritishSpelling).indexOf(word);
		return index < 0
			? word
			: this.wrapInSpan(Object.entries(americanToBritishSpelling)[index][0]);
	}

	britishToAmericanTitle(word) {
		const index = Object.values(americanToBritishTitles).indexOf(word);
		return index < 0
			? word
			: this.wrapInSpan(Object.entries(americanToBritishTitles)[index][0]);
	}

	wrapInSpan(word) {
		return `<span class="highlight">${word}</span>`;
	}

	britishTime(string) {
		if (/\d{1,2}:\d\d/.test(string)) {
			let index = string.match(/\d{1,2}:\d\d/).index;
			string = /\d\d.\d\d/.test(string)
				? string.slice(0, index) +
				  this.wrapInSpan(
						string.slice(index, index + 2) + '.' + string.slice(index + 3, index + 5)
				  ) +
				  string.slice(index + 5)
				: string.slice(0, index) +
				  this.wrapInSpan(
						string.slice(index, index + 1) + '.' + string.slice(index + 2, index + 4)
				  ) +
				  string.slice(index + 4);
		}
		return string;
	}

	americanTime(string) {
		if (/\d{1,2}.\d\d/.test(string)) {
			let index = string.match(/\d{1,2}.\d\d/).index;
			string = /\d\d.\d\d/.test(string)
				? string.slice(0, index) +
				  this.wrapInSpan(
						string.slice(index, index + 2) + ':' + string.slice(index + 3, index + 5)
				  ) +
				  string.slice(index + 5)
				: string.slice(0, index) +
				  this.wrapInSpan(
						string.slice(index, index + 1) + ':' + string.slice(index + 2, index + 4)
				  ) +
				  string.slice(index + 4);
		}
		return string;
	}

	translateWord(string, dict) {
		Object.keys(dict).map(word => {
			const regExp1 = new RegExp(`${word} `, 'i');
			const regExp2 = new RegExp(` ${word} `, 'ig');
			const regExp3 = new RegExp(` ${word}`, 'i');
			if (string.match(regExp1)?.index === 0)
				string = string.replace(regExp1, `${this.wrapInSpan(dict[word])} `);
			string = string.replace(regExp2, ` ${this.wrapInSpan(dict[word])} `);
			if (string.match(regExp3)?.index === string.length - word.length - 1)
				string = string.replace(regExp3, ` ${this.wrapInSpan(dict[word])}`);
		});
		return string;
	}

	fullStopHandler(string) {
		let dot = false;
		if (string.at(-1) === '.') {
			string = string.slice(0, -1);
			dot = true;
		}
		return {
			string,
			handleDot(wordArray) {
				let result;
				if (dot) result = wordArray.join(' ') + '.';
				else result = wordArray.join(' ');
				return result[0] === '<'
					? result.slice(0, 24) + result[24].toUpperCase() + result.slice(25)
					: result[0].toUpperCase() + result.slice(1);
			},
		};
	}

	britishToAmerican(british) {
		british = this.americanTime(british);
		const { string, handleDot } = this.fullStopHandler(british);
		british = this.translateWord(string, britishOnly);
		const wordArray = british.split(' ');
		const spellingCorrectedArray = wordArray.map(word => this.britishToAmericanSpelling(word));
		const titleCorrectedArray = spellingCorrectedArray.map(word =>
			this.britishToAmericanTitle(word)
		);
		return handleDot(titleCorrectedArray);
	}

	americanToBritish(american) {
		american = this.britishTime(american);
		const { string, handleDot } = this.fullStopHandler(american);
		american = this.translateWord(string, americanOnly);
		const wordArray = american.split(' ');
		const spellingCorrectedArray = wordArray.map(word =>
			americanToBritishSpelling[word]
				? this.wrapInSpan(americanToBritishSpelling[word])
				: word
		);
		const titleCorrectedArray = spellingCorrectedArray.map(word =>
			americanToBritishTitles[word] ? this.wrapInSpan(americanToBritishTitles[word]) : word
		);
		return handleDot(titleCorrectedArray);
	}
}

const a = new Translator();
a.britishToAmerican('Tea time is usually around 4 or 4.30.');

module.exports = Translator;
