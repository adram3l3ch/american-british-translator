const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests', () => {
	test('Translation with text and locale fields: POST request to /api/translate', done => {
		chai.request(server)
			.post('/api/translate')
			.send({
				locale: 'american-to-british',
				text: 'The parking lot was full.',
			})
			.end((err, res) => {
				assert.deepEqual(res.body, {
					text: 'The parking lot was full.',
					translation: 'The <span class="highlight">car park</span> was full.',
				});
				done();
			});
	});

	test('Translation with text and invalid locale field: POST request to /api/translate', done => {
		chai.request(server)
			.post('/api/translate')
			.send({
				locale: 'chinese-to-british',
				text: 'The parking lot was full.',
			})
			.end((err, res) => {
				assert.deepEqual(res.body, { error: 'Invalid value for locale field' });
				done();
			});
	});

	test('Translation with missing text field: POST request to /api/translate', done => {
		chai.request(server)
			.post('/api/translate')
			.send({
				locale: 'american-to-british',
			})
			.end((err, res) => {
				assert.deepEqual(res.body, { error: 'Required field(s) missing' });
				done();
			});
	});

	test('Translation with missing locale field: POST request to /api/translate', done => {
		chai.request(server)
			.post('/api/translate')
			.send({
				text: 'The parking lot was full.',
			})
			.end((err, res) => {
				assert.deepEqual(res.body, { error: 'Required field(s) missing' });
				done();
			});
	});

	test('Translation with empty text: POST request to /api/translate', done => {
		chai.request(server)
			.post('/api/translate')
			.send({
				locale: 'american-to-british',
				text: '',
			})
			.end((err, res) => {
				assert.deepEqual(res.body, { error: 'No text to translate' });
				done();
			});
	});

	test('Translation with text that needs no translation: POST request to /api/translate', done => {
		chai.request(server)
			.post('/api/translate')
			.send({
				locale: 'american-to-british',
				text: 'Hello peter',
			})
			.end((err, res) => {
				assert.deepEqual(res.body, {
					text: 'Hello peter',
					translation: 'Everything looks good to me!',
				});
				done();
			});
	});
});
