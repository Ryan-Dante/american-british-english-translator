'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {

  let text, locale;

  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      text = req.body.text;
      locale = req.body.locale;
      if (text === '') {
        res.json({ error: 'No text to translate' });
      } else {
        if (!text || !locale) {
          res.json({ error: 'Required field(s) missing' });
        } else if (locale !== 'american-to-british' && locale !== 'british-to-american') {
          res.json({ error: 'Invalid value for locale field' });
        } else {
          const translation = translator.translate(text, locale);
          if (translation === text) {
            res.json({ text: text, translation: 'Everything looks good to me!' });
          } else {
            res.json({ text: text, translation: translation });
          }
        }
      }
    });
};
