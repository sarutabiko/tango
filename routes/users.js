const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require("../models/user");


router.get('/register', (req, res) => {
    res.render('users/registerPage', { title: "Register" });
})

router.get('/login', (req, res) => {
    res.render('users/loginPage', { title: "Log in" });
})

router.get('/logout', (req, res) => {
    req.logOut(function (err) {
        if (err) { return next(err); }
        req.flash('success', "Logged out");
        res.redirect('/');
    });
})

router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.flash('success', 'Registered successfully. Welcome to 単語！')
        console.log(registeredUser);
        res.redirect('/search');
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register');
    }
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: false }), async (req, res) => {
    // req.flash('success', 'Welcome back');
    // const redirectUrl = req.session.returnTo || '/';
    // delete req.session.returnTo;
    if (req.user)
        res.send(true);
    else
        res.send(false);
});

module.exports = router;