const mongoose = require('mongoose');


const HaikuSchema = new mongoose.Schema({
    haikuJapanese: {
        type: String,
    },
    haikuEnglish: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});


const Haiku = mongoose.model('Haiku', HaikuSchema);
module.exports = { Haiku };