module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.locals.message = 'You must be logged in to do that.';
        return next();
    }
    next();
}
