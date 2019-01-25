const mongoose = require('../mongo');

var indexSchema = mongoose.Schema({
    _root: {
        type: mongoose.Schema.Types.Mixed       
    },
    updated: {
        type: Date,
        default: Date.now
    }
});

var Index = mongoose.model('Index', indexSchema);

module.exports = Index;