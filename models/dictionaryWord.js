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

module.exports = mongoose.model('DictWord', DictWordSchema);