const mongoose = require('../mongo');

var directorySchema = mongoose.Schema({
    
    infoMap: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },

    hierarchyMap: {
        type: Map,
        of: String
    }
});

var Directory = mongoose.model('directory', directorySchema);

module.exports = Directory;