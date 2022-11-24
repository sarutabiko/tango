const { Wordlist } = require("./models/wordSchema");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.locals.message = 'You must be logged in to do that.';
        return next();
    }
    next();
}

module.exports.isAuthorised = async (req, res, next) => {
    const { listID } = req.params;
    try {
        const wordlist = await Wordlist.findById(listID).populate('owner');
        if (wordlist.public) {
            res.locals.wordlist = wordlist;
            return next();
        }
        else if (wordlist.owner == currentUser._id) {
            res.locals.wordlist = wordlist;
            return next();
        }
        else
            res.status(403).send("You don't have the right");
    } catch (error) {
        next(error);
    }

}
