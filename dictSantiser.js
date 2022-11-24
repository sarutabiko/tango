const fs = require('fs');

//slightly modified and readable JMdict_e.json
const jmdict = require("./my_jmdict.json");

const modifiedObj = [];

jmdict.forEach(entry => {
    const toPush = {};

    toPush._id = parseInt(entry._id);
    toPush.reading = [];
    entry.reading.forEach(r => toPush.reading.push(r.reb));
    toPush.meaning = [];
    entry.sense.forEach(s => toPush.meaning.push(s.gloss));
    toPush.kanji = [];
    if (entry.kanji)
        entry.kanji.forEach(k => toPush.kanji.push(k.keb));

    modifiedObj.push(toPush);
});

const sanitised = [];

const isObj = o => o?.constructor === Object;
const isArr = o => o?.constructor === Array;
const isStr = o => o?.constructor === String;

const parseMeaning = function (X) {
    if (isObj(X))
        return X._;
    else if (isArr(X)) { const tempArr = []; X.forEach(x => tempArr.push(parseMeaning(x))); return tempArr; }
    else if (isStr(X))
        return X;
}

modifiedObj.forEach(obj => {
    const tempArr = [];
    // console.log("new ", obj);
    obj.meaning.forEach(o => {
        const output = parseMeaning(o);
        if (isArr(output))
            tempArr.push(output);
        else
            tempArr.push([output]);
    });
    sanitised.push({
        _id: obj._id,
        reading: obj.reading,
        kanji: obj.kanji,
        meaning: tempArr
    })
});

fs.writeFile('MongoReadyDict.json', JSON.stringify(sanitised, null, 2), 'utf8', (e) => {
    console.log("Written to MongoReadyDict.json");
    if (e)
        console.log(e);
});