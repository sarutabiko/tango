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

const Word = mongoose.model('Word', word);
module.exports = { Word };


