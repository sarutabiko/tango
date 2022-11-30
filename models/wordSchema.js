const mongoose = require('mongoose');

const word = new mongoose.Schema({
    Kanji: {
        type: [String]
    },
    Reading: {
        type: [String]
    },
    Meaning: {
        type: [String]
    },
    lists: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Wordlist'
        }
    ]
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
        ref: 'User',
        required: true
    }
})

const Word = mongoose.model('Word', word);
const Wordlist = mongoose.model('Wordlist', wordlist);
module.exports = { Word, Wordlist };


