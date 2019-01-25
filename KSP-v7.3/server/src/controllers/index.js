const indexService = require('../services/index');
const documentService = require('../services/document');

exports.index = function (request, response) {

    const textFile = request.file.path;
    const metadata = JSON.parse(request.body.metadata);

    indexService.index(textFile, metadata, function (error, result) {
        if (error) {
            console.error('Error while indexing text ' + text);
            console.error('Error while indexing key ' + key);
            response.write(JSON.stringify(error));
        } else {
            response.write(JSON.stringify(result));
        }
        response.end();
    });

};

exports.reIndex = function (request, response) {

    const id = request.params.id;
    documentServicedocumentService.getById(id, function (error, result) {
        if (error) {
            console.error('Error while retrieving data from db for id  ' + id);
            response.write(JSON.stringify(error));
        } else {
            if (result) {
                indexService.update(result.location, result);
            } else {
                console.log('No document found with id ' + id);
            }
        }
        response.end();
    });
};

exports.search = function (request, response) {

    const text = request.params.text;

    indexService.search(text, function (error, result) {
        if (error) {
            console.error('Error while searching text ' + text);
            response.write(JSON.stringify(error));
        } else {
            response.write(JSON.stringify(result));
        }
        response.end();
    });

};

exports.update = function (request, response) {

    const text = request.body.text;
    const key = request.body.key;

    indexService.update(text, key, function (error, result) {
        if (error) {
            console.error('Error while updating index text ' + text);
            console.error('Error while updating index key ' + key);
            response.write(JSON.stringify(error));
        } else {
            response.write(JSON.stringify(result));
        }
        response.end();
    });

};

exports.delete = function (request, response) {

    const key = request.body.key;

    indexService.delete(key, function (error, result) {
        if (error) {
            console.error('Error while deleting index with key ' + key);
            response.write(JSON.stringify(error));
        } else {
            response.write(JSON.stringify(result));
        }
        response.end();
    });

};

exports.suggestions = function (request, response) {

    const text = request.params.text;

    indexService.suggestions(text, function (error, result) {
        if (error) {
            console.error('Error while getting suiggestions for text ' + text);
            response.write(JSON.stringify(error));
        } else {
            response.write(JSON.stringify(result));
        }
        response.end();
    });

};

