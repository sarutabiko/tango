const express = require('express');
const passport = require('passport');
const router = express.Router();
const { User } = require("../models/user");
const { Wordlist } = require('../models/wordSchema');
const mongoose = require('mongoose');

router.route('/auth')
    .get((req, res) => {
        if (res.locals.currentUser)
            res.redirect(`user/${res.locals.currentUser.username}`)
        else {
            console.log(res.locals.currentUser)
            res.render('user/fullAuthPage', { title: "Log in" });
        }
    })
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: false }), async (req, res) => {
        // req.flash('success', 'Welcome back');
        // const redirectUrl = req.session.returnTo || '/';
        // delete req.session.returnTo;
        if (req.user) {
            req.flash('success', "Successfully logged in.");
            res.redirect('/');
        }
    });

router.route('/user/:username')
    .get(async (req, res) => {
        const { username } = req.params;
        console.log("current user: ", res.locals.currentUser);
        let getLists = [];
        const getUser = await User.findOne({ username }).populate('lists');
        if (res.locals.currentUser && res.locals.currentUser.username === username) {
            getLists = await Wordlist.find({ owner: new mongoose.Types.ObjectId(res.locals.currentUser._id) }).populate('words');
        }
        else {
            getLists = await Wordlist.find({ owner: new mongoose.Types.ObjectId(getUser._id), public: true }).populate('words');
        }
        getUser.totalWords = 0;
        getUser.lists.forEach(list => { getUser.totalWords += list.words.length });
        console.log("getLists: ", getLists);
        // console.log("ggetUser: ", getUser);
        res.render('user/profile', { title: `${username}'s profile`, getUser, getLists })
    })

router.route('/user/:username/lists')
    .get(async (req, res) => {
        const { username } = req.params;
        let lists;
        if (res.locals.currentUser && currentUser === username) {
            lists = await Wordlist.find({ owner: currentUser._id });
        }
        else {
            // lists = await Wordlist.find({ owner: username, public: true })
        }
        if (lists.length)
            res.send(lists);
        else
            res.status(404).send("Couldn't get lists");
    })

router.get('/logout', (req, res) => {
    req.logOut(function (err) {
        if (err) { return next(err); }
        req.flash('alert', "Logged out");
        res.redirect('back');
    });
})

router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err)
                return next(e);
            req.flash('success', 'Registered successfully. Welcome to 単語！');
            // console.log("registerUser returned: ", registeredUser);
            res.status(200);
            res.send("Registered successfully. Welcome to 単語！");
        })
    } catch (err) {
        req.flash('error', err.message);
        console.log("Caught error reads: ", err.message)
        res.status(409);
        res.send(err.message);
        // throw new ExpressError(404, 'Page Not Found');
        // res.redirect('/auth');
    }
})

module.exports = router;