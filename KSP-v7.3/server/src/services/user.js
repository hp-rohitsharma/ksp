const User = require('../models/user');
const websocket = require('./websocket');

exports.getByUserName = function (userName, callback) {
    User.find({ userName: userName }, callback);
};

exports.save = function (user, callback) {
    user.save((error, result) => {
        callback(error, result);
        websocket.publish({
            type: 'user-added',
            message: user
        });
    });
};

exports.update = function (id, user, callback) {
    User.updateOne({ _id: id }, user, (error, result) => {
        callback(error, result);
        websocket.publish({
            type: 'user-updated',
            message: user
        });
    });
};

exports.getAll = function (callback) {
    User.find({}, callback);
};