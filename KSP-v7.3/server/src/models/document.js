const mongoose = require('../mongo');

var documentSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    folderId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['text/plain', 'application/pdf', 'text/html'],
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    indexed: {
        type: Boolean,
        required: true
    }
});

var Document = mongoose.model('Document', documentSchema);

module.exports = Document;