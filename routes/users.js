const express = require('express');
const router = express.Router();
const User = require("../models/user");


router.get('/register', (req, res) => {
    res.render('users/register', { title: "Register" });
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
module.exports = router;