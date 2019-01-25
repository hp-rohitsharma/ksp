var mongoose = require('mongoose');
var config = require('./configs/database');

mongoose.set('bufferCommands', false);

mongoose.connect(config.mongo.url, function (error) {
    if (error) {
        console.error('Error while connecting mongoDB at ' + config.mongo.url);
        console.error(error);
        throw error;
    } else {
        console.log('Database Connected Successfully ' + config.mongo.url);
    }
});

module.exports = mongoose;
