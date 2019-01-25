const mongoose = require('../mongo');

const userSchema = mongoose.Schema({
    displayName: {
        type: String
    },
    userName: {
        type: String,
        unique: true
    },
    email: {
        type: String
    },
    isAuthor: {
        type: Boolean,
        default: true
    },
    updated: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;