const Document = require('../models/document');
const websocket = require('./websocket');

exports.getById = function (id, callback) {
    Document.findById(id, callback);
};

exports.save = function (document, callback) {
    document.save((error, result) => {
        callback(error, result);
        websocket.publish({
            type: 'save',
            message: document
        });
    });
};

exports.update = function (id, document, callback) {
    Document.updateOne({ _id: id }, document, (error, result) => {
        callback(error, result);
        websocket.publish({
            type: 'update',
            message: document
        });
    });
};

exports.getAll = function (callback) {
    Document.find({}, callback);
};

exports.remove = function (id, callback) {
    Document.remove({ _id: id }, (error, result) => {
        callback(error, result);
        websocket.publish({
            type: 'remove',
            message: id
        });
    });
};
