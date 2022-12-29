const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Haiku } = require("../models/haiku");
const { promptLogin, isLoggedIn, isAuthorisedToView } = require('../middleware');


router.route('/')
    .get(async (req, res, next) => {
        res.send("Its just the beginning")
    });

router.route('/add')
    .get(async (req, res, next) => {
        res.render('haiku', { title: 'Haiku' })
    });

module.exports = router;
