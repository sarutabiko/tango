const mongoose = require('mongoose');


const DictWordSchema = new mongoose.Schema({
    _id: {
        type: Number,
    },
    reading: [{
        type: [String],
        required: true,
    }],
    meaning: [{
        type: [String],
        required: true,
    }],
    kanji: [{
        type: [String],
        required: true,
    }],

});


const DictWord = mongoose.model('DictWord', DictWordSchema);
module.exports = { DictWord };