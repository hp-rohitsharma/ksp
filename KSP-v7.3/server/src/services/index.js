const fs = require('fs');
const pdf_text_extractor = require('../threadpool/pdf-text-extract');
const htmlToText = require('html-to-text');
const indexer = require('../threadpool/indexer');
const engine = require('../index/engine');
const websocket = require('./websocket');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;


var cheerio = require("cheerio");

const documentService = require('./document');

exports.search = function (text, callback) {

    Promise.resolve().then(() => {
        return engine.search(text);
    }).then((result) => {
        callback(null, result);
    }, (error) => {
        console.error('Error while searching text ' + text);
        callback(error);
    });

};

exports.index = function (file, metadata) {
    textExtractor(file, metadata, (textFile, key) => {
        index(textFile, key);
    });
};

function textExtractor(file, metadata, callback) {
    if (metadata.type === 'application/pdf') {
        let key = metadata._id;
        let textFile = './text-files/' + key + '.txt';
        console.log('key before ' + key);

        pdf_text_extractor.extractTextToFile(file, textFile, key, (response, error) => {
            if (error || response.status === 'failed') {
                console.error('indexing failed');
                console.error('error');
            } else {
                console.log('key after ' + response.key);
                callback(response.textFile, response.key);
            }
        });

    } else if (metadata.type === 'text/html') {
        let key = metadata._id;
        let textFile = './text-files/' + key + '.txt';

        var $ = cheerio.load(fs.readFileSync(file));           
        let text = $.text();
        text = text.replace(/\s+/g,' ').trim();
        //console.log(text);
        fs.appendFile(textFile, text, (error) => {
            if (error) {
                console.error(error);
                throw error;
            } else {
                callback(textFile, key);
            }
        });       
    }
}

function index(textFile, key) {
    indexer.index(textFile, key, null, (response, error) => {
        if (error || response.status === 'failed') {
            console.error('Indexing failed');
            console.error(error);
            console.error(response);
        } else {
            //deleteTxtFile(response.textFile);
            engine.refreshCache();
            console.log('Document indexed sucessfully ' + response.key);
            documentService.update(key, { indexed: true }, function (error, result) {
                if (error) {
                    console.error('Error while updating document');
                    console.error(error);
                } else {                    
                    console.log('Publishing indexing message');
                    websocket.publish({
                        type: 'index',
                        message: {
                            status: 'indexing_completed',
                            key: response.key
                        }
                    });
                    console.log('Indexing message published');
                }
            });
        }
    });
};

function deleteTxtFile(textFile) {
    fs.unlink(textFile, (error) => {
        if (error)
            console.error(error);
    });
};

exports.update = function (file, metadata) {

    engine.delete(metadata._id);
    console.log('Deleted old keys... Now adding new indexes');
    textExtractor(file, metadata, (textFile, key) => {
        index(textFile, key);
    });

};

exports.suggestions = function (text, callback) {

    Promise.resolve().then(() => {
        return engine.suggestions(text);
    }).then((result) => {
        callback(null, result);
    }, (error) => {
        console.error('Error while retrieving suggestions for text ' + text);
        callback(error);
    });

};


