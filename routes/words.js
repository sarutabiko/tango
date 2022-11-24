const express = require('express');
const { isLoggedIn, isAuthorised } = require('../middleware');
const router = express.Router();
const { Word, Wordlist } = require("../models/wordSchema");


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


module.exports = router;
