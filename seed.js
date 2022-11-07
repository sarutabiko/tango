const mongoose = require('mongoose');
const { Word } = require('./models/wordSchema');

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
    word: "単語",
    reading: "たんご",
    english: ["word", "vocabulary"]
});

(async function () { await w1.save(); })();

const genkiV1 = [{
    word: "ano",
    reading: "ano",
    english: "um..."
},
{
    word: "今",
    reading: "いま",
    english: "now"
}, {
    word: "えいご",
    reading: "えいご",
    english: "English (language)"
}];

Word.insertMany(genkiV1)
    .then(res => console.log(res))
    .catch(e => console.log(e));