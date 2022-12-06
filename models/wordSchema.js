const mongoose = require('mongoose');
const { User } = require('./user');

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

wordlist.virtual('length').get(function () {
    return this.words.length;
})

wordlist.post('save', async function (doc) {
    console.log("ownder id is: ", doc.owner._id);

    const getOwner = await User.findById(doc.owner._id).populate('lists');
    let wordN = 0;
    for (const list of getOwner.lists)
        wordN += list.length;
    getOwner.listCount = getOwner.lists.length;
    getOwner.wordCount = wordN;
    getOwner.save();
})

const Word = mongoose.model('Word', word);
const Wordlist = mongoose.model('Wordlist', wordlist);
module.exports = { Word, Wordlist };



