const express = require('express');
const passport = require('passport');
const router = express.Router();
const { User } = require("../models/user");
const { Wordlist, Word } = require('../models/wordSchema');
const mongoose = require('mongoose');
const { promptLogin, isLoggedIn, isAuthorisedToView } = require('../middleware');


router.route('/auth')
    // .get((req, res) => {
    //     // if (res.locals.currentUser)
    //     // res.redirect(`user/${res.locals.currentUser.username}`)
    //     // else {
    //     res.render('user/fullAuthPage', { title: "Log in" });
    //     // }
    // })
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: false, failureMessage: true }), async (req, res) => {
        // req.flash('success', 'Welcome back');
        // const redirectUrl = req.session.returnTo || '/';
        // delete req.session.returnTo;
        if (req.user) {
            // req.flash('success', "Successfully logged in.");
            res.status(200).send('Successfully logged in.');
        }
        else
            console.log('OHHHHNOOOO');
    });

router.route('/user/:username')
    .get(async (req, res, next) => {
        const { username } = req.params;
        // console.log("current user: ", res.locals.currentUser);
        let getLists = [];
        try {
            const getUser = await User.findOne({ username }).populate('lists');

            if (!getUser) {
                const err = new Error("User not found")
                err.statusCode = 404;
                throw err;
            }

            let loggedIn = res.locals.currentUser ? res.locals.currentUser : false;

            if (loggedIn)
                loggedIn = await User.findOne({ username: res.locals.currentUser.username }).populate('lists');

            if (loggedIn && loggedIn.username === username) {
                loggedIn.self = true;
                getLists = await Wordlist.find({ owner: new mongoose.Types.ObjectId(res.locals.currentUser._id) }).populate('words');
            }
            else {
                getLists = await Wordlist.find({ owner: new mongoose.Types.ObjectId(getUser._id), public: true }).populate('words');
            }
            getUser.totalWords = 0;
            getUser.lists.forEach(list => { getUser.totalWords += list.words.length });
            // console.log("getLists: ", getLists);
            // console.log("ggetUser: ", getUser);
            res.render('user/profile', { title: `${username}'s profile`, getUser, getLists, loggedIn })
        } catch (error) {
            next(error);
        }


    })
    // will add words to a list, and remove words from defaultList
    .post(
        isLoggedIn,
        async (req, res) => {
            const { selectedCells: wordIDString, toListID, fromListID } = req.body;
            const wordIDArray = wordIDString.split(',');
            // console.log("req.obdy is: ", req.body);

            const listToInsert = await Wordlist.findById(toListID);
            const listFrom = await Wordlist.findById(fromListID);
            let moveWord = false;
            if (listFrom.name == 'Unlisted')
                moveWord = true;
            // console.log("listToInsert is: ", listToInsert)
            // console.log("defaultList is: ", defaultList)

            for (const wordID of wordIDArray) {
                listToInsert.words.push(wordID);
                const wordDB = await Word.findById(wordID);
                wordDB.lists.push(toListID);
                if (moveWord) {
                    listFrom.words.splice(listFrom.words.indexOf(wordID), 1);
                    wordDB.lists.splice(wordDB.lists.indexOf(fromListID), 1);
                }
                await wordDB.save();
            }
            await listToInsert.save();
            if (moveWord)
                await listFrom.save();

            res.send({ listToInsert, listFrom, wordIDArray });
        })

router.route('/user/:username/lists')
    .get(async (req, res) => {
        const { username } = req.params;
        let lists;
        if (res.locals.currentUser && res.locals.currentUser.username === username) {
            lists = await Wordlist.find({ owner: currentUser._id });
        }
        else {
            lists = await Wordlist.find({ owner: username, public: true })
        }
        if (lists.length)
            res.send(lists);
        else
            res.status(404).send("Couldn't get lists");
    })
    .post(isLoggedIn, async (req, res) => {
        // console.log(req.body);
        const { name } = req.body;
        const user = await User.findById(res.locals.currentUser._id);
        const newList = await Wordlist.create({ name: name, owner: res.locals.currentUser._id });
        user.lists.push(newList._id)
        user.save();
        console.log("newList created: ", newList);
        res.send(newList);
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
    }
})


module.exports = router;