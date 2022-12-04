if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const mongoose = require('mongoose');
const { DictWord } = require('./models/dictionaryWord');

// mongo connection
const dbURL = process.env.DB_URL;
// const dbURL = 'mongodb://127.0.0.1:27017/tango'
main()
    .then(() => {
        console.log("Database Connection Successful!!!");
    })
    .catch(
        err => { console.log("Ooops error!!!"); console.log(err); });

async function main() {
    console.log('dbURL is: ', dbURL);
    await mongoose.connect(dbURL);
}


const toUpload = require("./MongoReadyDict.json");

for (let i = 0; i < 15; i++) {
    const chunk = toUpload.slice(i * 5, (i + 1) * 5);
    DictWord.insertMany(chunk)
        .then(
            function (res) {
                console.log("Innserted chunk#: ", i + 1);
                // console.log(res);
            }
        )
        .catch(e => console.log(e));
}

const uploadChunk = async function (chunk, n) {
    await DictWord.insertMany(chunk)
        .then(
            function (res) {
                console.log("Uploaded chunk#: ", n + 1);
                // console.log(res);
            }
        )
        .catch(e => console.log(e));
};

const dictSize = toUpload.length;

const batchUpload = async function () {
    let index = 0;
    while ((index + 5) < dictSize) {
        const chunk = toUpload.slice(index, (index + 5));
        await uploadChunk(chunk, index / 5);
        index += 5;
    }

    console.log("Uploading final chunk!!");
    const chunk = toUpload.slice(index, dictSize);
    await uploadChunk(chunk, index / 5);

    console.log("All done")
}

batchUpload();
