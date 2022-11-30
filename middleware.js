const { Wordlist } = require("./models/wordSchema");

module.exports.promptLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.locals.message = 'You must be logged in to do that.';
        return next();
    }
    next();
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', "You must be logged in.");
        return res.redirect('/auth');
    }
    next();
}

// Both of these middle are used to check if a user is authorised to view/modify Wordlists
// Words will be managed wihtout user input
module.exports.isAuthorisedToView = async (req, res, next) => {
    const { listID } = req.body;
    try {
        const wordlist = await Wordlist.findById(listID).populate('owner');
        if (wordlist.public) {
            res.locals.wordlist = wordlist;
            return next();
        }
        else if (res.locals.currentUser._id.equals(wordlist.owner)) {
            res.locals.wordlist = wordlist;
            return next();
        }
        else
            res.status(403).send("You don't have the right");
    } catch (error) {
        next(error);
    }

}

module.exports.isOwner = async (req, res, next) => {
    console.log('in isOwner: ', req.body);
    const { listID } = req.body;
    try {
        const wordlist = await Wordlist.findById(listID);
        if (res.locals.currentUser._id.equals(wordlist.owner)) {
            res.locals.wordlist = wordlist;
            return next();
        }
        else
            res.status(403).send("You don't have the right");
    } catch (error) {
        next(error);
    }

}