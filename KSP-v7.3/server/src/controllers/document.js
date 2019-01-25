const fs = require('fs');
const documentService = require('../services/document');
const Document = require('../models/document');
const indexService = require('../services/index');

exports.getById = function (request, response) {
    const id = request.params.id;
    documentService.getById(id, function (error, result) {
        if (error) {
            console.error('Error while retrieving data from db for id  ' + id);
            response.write(JSON.stringify(error));
        } else {
            response.write(JSON.stringify(result));
        }
        response.end();
    });
};

exports.save = function (request, response) {

    saveToRepository(request.file.path, function (repositoryLocationOfFile) {
        if (repositoryLocationOfFile) {
            let document = new Document(JSON.parse(request.body.metadata));
            document.location = repositoryLocationOfFile;
            document.indexed = false;
            documentService.save(document, function (error, result) {
                if (error) {
                    console.error('Error while saving document to database');
                    console.error(document);
                    response.write(JSON.stringify(error));
                } else {
                    indexService.index(repositoryLocationOfFile, result);
                    response.write(JSON.stringify(result));
                }
                response.end();
            });
        } else {
            console.error('Error while saving document to filesystem');
            response.end();
        }
    });
};

exports.update = function (request, response) {

    const id = request.params.id;

    documentService.getById(id, function (error, result) {
        if (error) {
            console.error('Error while retrieving data from db for id  ' + id);
            response.write(JSON.stringify(error));
            response.end();
        } else {
            updateInRepository(result.location, request.file.path, function (repositoryLocationOfFile) {
                if (repositoryLocationOfFile) {
                    let document = JSON.parse(request.body.metadata);
                    document.location = repositoryLocationOfFile;
                    document.indexed = false;

                    documentService.update(id, document, function (error) {
                        if (error) {
                            console.error('Error while updating document');
                            console.error(document);
                            response.write(JSON.stringify(error));
                        } else {
                            indexService.index(repositoryLocationOfFile, result);
                            response.write(JSON.stringify(result));
                        }
                        response.end();
                    });
                } else {
                    console.error('Error while saving document to filesystem');
                    response.write(JSON.stringify({ 'error': 'Error while saving document to filesystem:' + id}));
                    response.end();
                }
            });
        }        
    });
};

exports.getAll = function (request, response) {
    documentService.getAll(function (error, result) {
        if (error) {
            console.error('Error while getting all documents');
            response.write(JSON.stringify(error));
        } else {
            response.write(JSON.stringify(result));
        }
        response.end();
    });
};

exports.remove = function (request, response) {
    documentService.remove(request.params.id, function (error, result) {
        if (error) {
            console.error('Error while removing document from database for id ' + request.params.id);
            response.write(JSON.stringify(error));
        } else {
            response.write(JSON.stringify(result));
        }
        response.end();
    });
};

exports.download = function (request, response) {
    const id = request.params.id;
    documentService.getById(id, function (error, result) {
        if (error) {
            console.error('Error while retrieving data from db for id  ' + id);
            response.write(JSON.stringify(error));
            response.end();
        } else {
            response.download(result.location);
        }
    });
};

function saveToRepository(filePath, callback) {

    let repositoryPath = './repository/' + new Date().getTime() + getRandom();

    var readStream = fs.createReadStream(filePath);
    var writeStream = fs.createWriteStream(repositoryPath);

    readStream.on('error', function (error) {
        console.error('Error while reading ' + filePath);
        console.error(error);
        callback();
    });
    writeStream.on('error', function (error) {
        console.error('Error while writing to ' + repositoryPath);
        console.error(error);
        callback();
    });

    readStream.on('close', function () {
        fs.unlink(filePath, function () {
            console.log(filePath + ' delete sucessfully');
        });
        callback(repositoryPath);
    });

    readStream.pipe(writeStream);

    function getRandom() {
        return Math.floor(Math.random() * 1000000000000);
    }
};

function updateInRepository(oldRepofile, newTempFile, callback) {

    let repositoryPath = oldRepofile;

    var readStream = fs.createReadStream(newTempFile);
    var writeStream = fs.createWriteStream(repositoryPath);

    readStream.on('error', function (error) {
        console.error('Error while reading ' + newTempFile);
        console.error(error);
        callback();
    });
    writeStream.on('error', function (error) {
        console.error('Error while writing to ' + repositoryPath);
        console.error(error);
        callback();
    });

    readStream.on('close', function () {
        fs.unlink(newTempFile, function () {
            console.log(newTempFile + ' delete sucessfully');
        });
        callback(repositoryPath);
    });

    readStream.pipe(writeStream);
};
