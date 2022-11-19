const mongoose = require('mongoose');

const word = new mongoose.Schema({
    word: {
        type: String
    },
    reading: {
        type: String
    },
    english: {
        type: [String]
    }
});

const wordlist = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    words: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Word'
        }
    ],
})

const Word = mongoose.model('Word', word);
const Wordlist = mongoose.model('Wordlist', wordlist);
module.exports = { Word, Wordlist };


