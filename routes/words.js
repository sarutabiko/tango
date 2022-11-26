const express = require('express');
const { promptLogin, isLoggedIn, isAuthorised } = require('../middleware');
const router = express.Router();
const { Word, Wordlist } = require("../models/wordSchema");
const { DictWord } = require('../models/dictionaryWord');
const { User } = require('../models/user');

router.get('/add', promptLogin, (req, res) => {
    res.render('add', { title: 'Add word' });
})
router.post('/add', isLoggedIn, async (req, res) => {
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
        console.log("creating defauult list")
        user.lists.push(await Wordlist.create({ name: "Default", owner: user._id }))
    }
    await user.save();

    const defaultList = await Wordlist.findOne({ owner: user._id, name: 'Default' });
    defaultList.words.push(wordInDB._id);
    defaultList.save();
    // console.log(defaultList);
    req.flash('success', "Word added.");
    res.redirect('/search');
})

router.get('/:wordid', async (req, res, next) => {
    const { wordid } = req.params;
    try {
        const data = await Word.findById(wordid)
        res.send(data);
    } catch (error) {
        console.log("Za error is: ", error);
        next(error);
    }
})

router.get('/:user/:listID',
    isLoggedIn,
    isAuthorised,
    async (req, res, next) => {
        res.send(res.locals.wordlist);
    })

router.post('/search', async (req, res) => {
    const { query } = req.body;
    // console.log("search query is: ", query);
    const results = await DictWord.find({ meaning: { $elemMatch: { $elemMatch: { $in: [query] } } } });
    // console.log(results);
    res.send(results);
})


module.exports = router;
