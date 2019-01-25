const Directory = require('../models/directory');

exports.get = function (callback) {
    Directory.find({}, callback);
};

exports.delete = function (directory, callback) {
    directory.save(callback);
};

exports.add = function (directory, callback) {
    directory.save(callback);
};

exports.update = function (directory, callback) {
    directory.save(callback);
};