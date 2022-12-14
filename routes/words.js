const express = require('express');
const { promptLogin, isLoggedIn, isAuthorisedToView, isOwner } = require('../middleware');
const router = express.Router();
const { Word, Wordlist } = require("../models/wordSchema");
const { DictWord } = require('../models/dictionaryWord');
const { User } = require('../models/user');
const { body, validationResult } = require('express-validator');

router.route('/')
    .post(isLoggedIn, async (req, res) => {
        const wordToPush = {};
        for (list of Object.keys(req.body)) {
            wordToPush[list] = Object.keys(req.body[list]);
        }
        // console.log(wordToPush);

        const wordInDB = await Word.create(wordToPush);
        // console.log("word saved into DB: ", wordInDB);

        const user = await User.findById(res.locals.currentUser._id);
        // console.log(user);
        if (!(user.lists.length)) {
            // console.log("creating defauult list")
            user.lists.push(await Wordlist.create({ name: "Unlisted", owner: user._id }))
            await user.save();
        }

        const unlistedList = await Wordlist.findOne({ owner: user._id, name: 'Unlisted' });
        unlistedList.words.push(wordInDB._id);
        wordInDB.lists.push(unlistedList._id);
        unlistedList.save();
        wordInDB.save();
        // console.log(defaultList);
        req.flash('success', "Word added.");
        res.redirect('/search');
    })
    .delete(isLoggedIn, isOwner, async (req, res) => {
        const { listID, selectedCells: wordIDString } = req.body;
        // console.log(req.body);
        const wordIDArray = wordIDString.split(',');
        // return res.send(indexArray);

        // console.log('index arr is: ', indexArray);
        // also remove listref from word
        // deleted.refs[] contains IDs of words that are being deleted
        // if a word is deleted from DB (ie no refs to it), it will be saved in deleted.words[]
        let deleted = { listID, refs: [], words: [] };
        const getList = await Wordlist.findById(listID);

        for (const wordID of wordIDArray) {
            // find Word in db, remove listref from it
            const word = await Word.findById(wordID);
            deleted.refs.push(wordID);
            word.lists.splice(word.lists.indexOf(getList._id), 1);
            // if no listrefs left, delete the word 
            if (!(word.lists.length)) {
                deleted.words.push(word);
                await word.remove();
            }
            else
                await word.save();
            // then remove wordref from list
            // console.log('getList obj', getList);
            getList.words.splice(getList.words.indexOf(wordID), 1);

        };

        // console.log('deleted is: ', deleted);
        getList.save();
        return res.send(deleted);
    })

router.get('/add', promptLogin, (req, res) => {
    res.render('add', { title: 'Add word' });
})

// delete if not needed
router.route('/:wordid')
    .get(async (req, res, next) => {
        const { wordid } = req.params;
        try {
            const data = await Word.findById(wordid)
            res.send(data);
        } catch (error) {
            console.log("Za error is: ", error);
            next(error);
        }
    })


router.route('/lists/:listID')
    .get(async (req, res) => {
        const { listID } = req.params;
        const getList = await Wordlist.findById(listID).populate('words');
        // console.log('is authorised: ', res.locals.currentUser._id.equals(getList.owner))
        if (getList.public || (res.locals.currentUser && res.locals.currentUser._id.equals(getList.owner))) {
            res.send(getList);
        }
        else {
            res.status(403).send("Not Authorised to view list");
        }
    })

router.post('/search', body('query').escape(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { query } = req.body;
    // console.log("search query is: ", query);

    let results;
    // console.log('query is: ', query);
    if (query.match(/[a-z]/i))
        results = await DictWord.find({ meaning: { $elemMatch: { $elemMatch: { $in: [query] } } } });
    else {
        // readingSearch = await DictWord.find({ reading: { $elemMatch: { $elemMatch: { $in: [query] } } } });
        // kanjiSearch = await DictWord.find({ kanji: { $elemMatch: { $elemMatch: { $in: [query] } } } });
        let [readingSearch, kanjiSearch] = await Promise.all([
            DictWord.find({ reading: { $elemMatch: { $elemMatch: { $in: [query] } } } }),
            DictWord.find({ kanji: { $elemMatch: { $elemMatch: { $in: [query] } } } })
        ])
        results = readingSearch.concat(kanjiSearch);
    }
    // console.log(results);
    res.send({ query, results });
})


module.exports = router;
