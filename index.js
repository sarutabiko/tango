const express = require("express");
const path = require("path");
const methodOverride = require("method-override");

const ejsMate = require("ejs-mate");

const mongoose = require('mongoose');
// const { Word } = require('./models/wordSchema');

const session = require("express-session");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const authRoutes = require('./routes/auth');
const wordRoutes = require('./routes/words');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');

const ExpressError = require('./utils/ExpressError');
const { isLoggedIn } = require('./middleware');
// mongo connection
main()
    .then(() => {
        console.log("Database Connection Successful!!!");
    })
    .catch(
        err => { console.log("Ooops error!!!"); console.log(err); });

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/tango');
}

//express route handling

const app = express();

app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());


const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: 'strict'
    }
}
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.alert = req.flash('alert');
    res.locals.message = '';
    // console.log("req.session is: ", req.session);
    console.log("res.locals is: ", res.locals);
    next();
})
app.listen(3333, '0.0.0.0', () => {
    console.log("App is listening on 3333 port.");
})

app.get('/', (req, res) => {
    res.render('index', { title: "単語" });
})

app.use('/', authRoutes);
app.use('/word', wordRoutes);

app.get('/search', (req, res) => {
    res.render('search', { title: "Search" });
})

app.get('/add', isLoggedIn, (req, res) => {
    res.render('add', { title: 'Add word' });
})
app.post('/add', isLoggedIn, (req, res) => {
    console.log(req.body);
    res.send(req.body);
})

app.post('/', isLoggedIn, (req, res) => {
    res.render('index', { title: '' })
})


app.use((err, req, res, next) => {
    console.log("Something went wrong!");
    console.log(err);
    if (!(err.statusCode))
        err.statusCode = 500;
    if (!err.message)
        err.message = "Oh no. Something went wrong."
    res.status(err.statusCode).render('error', { err, title: "Error" });
})