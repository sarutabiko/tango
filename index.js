const express = require("express");
const path = require("path");
const methodOverride = require("method-override");

const ejsMate = require("ejs-mate");

const app = express();
app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

const mongoose = require('mongoose');
const { Word } = require('./models/wordSchema');

// mongo connection
main()
    .then(() => {
        console.log("Connection Open!!!");
    })
    .catch(
        err => { console.log("Ooops error!!!"); console.log(err); });

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/tango');
}

//express route handling

app.listen(3333, '0.0.0.0', () => {
    console.log("App is listening on 3333 port.");
})


app.get('/', (req, res) => {
    res.render('index', { title: ": one, simple" });
})

app.get('/add', (req, res) => {
    res.render('add', { title: "単語 | tango | たんご" });
})

app.use((err, req, res, next) => {
    console.log("Something went wrong!");
    console.log(err);
    next(err);
})