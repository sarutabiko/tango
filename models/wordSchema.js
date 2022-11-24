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
    public: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Word = mongoose.model('Word', word);
const Wordlist = mongoose.model('Wordlist', wordlist);
module.exports = { Word, Wordlist };


