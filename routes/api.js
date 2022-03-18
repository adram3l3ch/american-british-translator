'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
	const translator = new Translator();

	app.route('/api/translate').post((req, res) => {
		const { locale, text } = req.body;
		const same = 'Everything looks good to me!';
		if (text === undefined || locale === undefined) {
			res.json({ error: 'Required field(s) missing' });
			return;
		}
		if (text === '') {
			res.json({ error: 'No text to translate' });
			return;
		}

		if (locale === 'american-to-british') {
			text === translator.americanToBritish(text)
				? res.json({ text, translation: same })
				: res.json({ text, translation: translator.americanToBritish(text) });
		} else if (locale === 'british-to-american') {
			text === translator.britishToAmerican(text)
				? res.json({ text, translation: same })
				: res.json({ text, translation: translator.britishToAmerican(text) });
		} else {
			res.json({ error: 'Invalid value for locale field' });
		}
	});
};
