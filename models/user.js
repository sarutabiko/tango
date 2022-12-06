const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// const { Wordlist } = require('./wordSchema');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    lists: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Wordlist'
        }
    ],
    wordCount: {
        type: Number,
        default: 0
    },
    listCount: {
        type: Number,
        default: 0
    }
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);
module.exports = { User };