const mongoose = require('mongoose');
const { Word, Wordlist } = require('./models/wordSchema');

// mongo connection
main()
    .then(() => {
        console.log("Connection Open!!!");
    })
    .catch(
        err => { console.log("Ooops error!!!"); console.log(err); });

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/tango');
}


const w1 = new Word({
    Kanji: ["単語"],
    reading: ["たんご"],
    english: ["word", "vocabulary"]
});

(async function () { await w1.save(); })();

const genkiV1 = [{
    Kanji: [],
    Reading: ["あの"],
    Meaning: ["um..."]
},
{
    Kanji: ["今"],
    Reading: ["いま"],
    Meaning: ["now"]
}, {
    Kanji: [],
    Reading: ["えいご"],
    Meaning: ["English (language)"]
}];

Word.insertMany(genkiV1)
    .then(
        function (res) {
            const newlist = new Wordlist({ 'name': 'genkiEx' });
            res.forEach(w => newlist.words.push(w._id));
            newlist.public = true;
            newlist.save();
        }
    )
    .catch(e => console.log(e));

