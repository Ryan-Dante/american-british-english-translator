const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
    translate(text, locale) {
        let translation = text;
        let replacement = '';

        if (locale === 'american-to-british') {
            translation = this.americanToBritish(text);
        } else {
            translation = this.britishToAmerican(text);
        }
        return translation;
    }

    americanToBritish(text) {
        let translation = text;

        for (let key in americanOnly) {
            const regex = new RegExp(`\\b${key}\\b`, 'gi');
            translation = translation.replace(regex, `<span class="highlight">${americanOnly[key]}</span>`);
        }

        for (let key in americanToBritishSpelling) {
            const regex = new RegExp(`\\b${key}\\b`, 'gi');
            translation = translation.replace(regex, `<span class="highlight">${americanToBritishSpelling[key]}</span>`);
        }

        for (let key in americanToBritishTitles) {
            const escapedKey = key.replace('.', '\\.');
            const regex = new RegExp(`(\\s|^)(${escapedKey})(\\s|$)`, 'gi');
        
            translation = translation.replace(regex, (match, spaceBefore, title, spaceAfter) => {
                const replacement = `<span class="highlight">${title.charAt(0).toUpperCase() + title.slice(1, -1)}</span>`; // Exclude the last character (the period)
                return `${spaceBefore}${replacement}${spaceAfter}`;
            });
        }
        
        // Trim trailing spaces at the end of the translation
        translation = translation.trim();

        const timeRegex = /([0-9]{1,2}):([0-9]{2})/g;
        translation = translation.replace(timeRegex, (match, p1, p2) => {
            return `<span class="highlight">${p1}.${p2}</span>`;
        });

        return translation;
    }

    britishToAmerican(text) {
        let translation = text;

        const britishKeys = Object.keys(britishOnly).sort((a, b) => b.length - a.length);

        for (let key of britishKeys) {
        const regex = new RegExp(`\\b${key}\\b`, 'gi');
        translation = translation.replace(regex, `<span class="highlight">${britishOnly[key]}</span>`);
        }

        for (let key in americanToBritishSpelling) {
            const regex = new RegExp(`\\b${americanToBritishSpelling[key]}\\b`, 'gi');
            translation = translation.replace(regex, `<span class="highlight">${key}</span>`);
        }

        for (let key in americanToBritishTitles) {
            const regex = new RegExp(`\\b${americanToBritishTitles[key]}\\b`, 'gi');
            translation = translation.replace(regex, (match) => {
            const replacement = key[0].toUpperCase() + key.slice(1);
            return `<span class="highlight">${replacement}</span>`;
            });
        }

        const timeRegex = /([0-9]{1,2}).([0-9]{2})/g;
        translation = translation.replace(timeRegex, (match, p1, p2) => {
            return `<span class="highlight">${p1}:${p2}</span>`;
        });

        return translation;
    }
}

module.exports = Translator;