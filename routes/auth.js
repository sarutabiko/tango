const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require("../models/user");

router.route('/auth')
    .get((req, res) => {
        res.render('auth/fullAuthPage', { title: "Log in" });
    })
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: false }), async (req, res) => {
        // req.flash('success', 'Welcome back');
        // const redirectUrl = req.session.returnTo || '/';
        // delete req.session.returnTo;
        if (req.user) {
            req.flash('success', "Successfully logged in.");
            res.send(true);
        }
    });

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
        console.log("registerUser returned: ", registeredUser);
        res.status(200);
        res.send('Registered successfully. Welcome to 単語！');
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