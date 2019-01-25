const directoryService = require('../services/directory');
const Directory = require('../models/directory');

exports.get = function (request, response) {
    directoryService.get(function (error, result) {
        if (error) {
            console.error('Error while getting directory data');
            response.write(JSON.stringify(error));
        } else {
            if (result.length > 0) {
                response.write(JSON.stringify(result[0]));
            } else {
                response.write(JSON.stringify({}));
            }
        }
        response.end();
    });
};

exports.add = function (request, response) {
    directoryService.get(function (error, result) {
        if (error) {
            console.error('Error while getting directory data for update');
            response.write(JSON.stringify(error));
            response.end();
        } else {
            let directory;
            if (result.length == 0) {
                directory = new Directory({
                    hierarchyMap: {},
                    infoMap: {}
                });
            } else {
                directory = new Directory(result[0]);
            }

            let newFolder = request.body;
            directory.infoMap.set(newFolder.id, newFolder);
            directory.hierarchyMap.set(newFolder.id, newFolder.parentId);

            directoryService.add(directory, function (error, result) {
                if (error) {
                    console.error('Error while updating directory data');
                    console.error(error);
                    response.write(JSON.stringify(error));
                } else {
                    response.write(JSON.stringify(result));
                }
                response.end();
            });
        }       
    });
};

exports.delete = function (request, response) {

    directoryService.get(function (error, result) {
        if (error) {
            console.error('Error while getting directory data for delete');
            console.error(error);
            response.write(JSON.stringify(error));
        } else {
            let directory;
            if (result.length == 0) {
                directory = new Directory({
                    hierarchyMap: {},
                    infoMap: {}
                });
            } else {
                directory = new Directory(result[0]);
            }
            // delete entries from map
            let folderId = request.params.id;
            directory.infoMap.delete(folderId);
            directory.hierarchyMap.delete(folderId);

            directoryService.add(directory, function (error, result) {
                if (error) {
                    console.error('Error while adding directory data');
                    console.error(error);
                    response.write(JSON.stringify(error));
                } else {
                    response.write(JSON.stringify(result));
                }
            });
        }
        response.end();
    });
};

exports.update = function (request, response) {

    directoryService.get(function (error, result) {
        if (error) {
            console.error('Error while getting directory data for update');
            console.error(error);
            response.write(JSON.stringify(error));
        } else {
            let directory;
            if (result.length == 0) {
                directory = new Directory({
                    hierarchyMap: {},
                    infoMap: {}
                });
            } else {
                directory = new Directory(result[0]);
            }

            // update entries from map
            let folderToUpdate = request.body;
            directory.infoMap.set(folderToUpdate.id, folderToUpdate);
            directory.hierarchyMap.set(folderToUpdate.id, folderToUpdate.parentId);

            directoryService.add(directory, function (error, result) {
                if (error) {
                    console.error('Error while adding directory data');
                    console.error(error);
                    response.write(JSON.stringify(error));
                } else {
                    response.write(JSON.stringify(result));
                }
            });
        }
        response.end();
    });
};


