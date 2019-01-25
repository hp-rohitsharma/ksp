const userService = require('../services/user');
const User = require('../models/user');

exports.getByUserName = function (request, response) {
    let userName = extractUserName(request);
    userService.getByUserName(userName, function (error, result) {
        if (error) {
            response.write(JSON.stringify(error));
        } else {
            if (result.length > 0) {
                response.write(JSON.stringify(result[0]));
            } else {
                response.write(JSON.stringify({ displayName: userName }));
            }
        }
        response.end();
    });
};

exports.getAllUsers = function (request, response) {
    userService.getAll(function (error, result) {
        if (error) {
            console.error('Error while getting all users');
            response.write(JSON.stringify(error));
        } else {
            response.write(JSON.stringify(result));
        }
        response.end();
    });
};

exports.save = function (request, response) {
    
    let userName = extractUserName(request);    
    userService.getByUserName(userName, function (error, result) {
        if (error) {
            response.write(JSON.stringify(error));
            response.end();
        } else {
            if (result.length > 0) {
                let id = result[0]._id;
                let user = request.body;
                user.userName = userName;   
                userService.update(id, user, function (error, result) {
                    if (error) {
                        response.write(JSON.stringify(error));
                    } else {
                        response.write(JSON.stringify(result));
                    }
                    response.end();
                });
            } else {
                let user = new User(request.body);
                user.userName = userName;   
                userService.save(user, function (error, result) {
                    if (error) {
                        response.write(JSON.stringify(error));
                    } else {
                        response.write(JSON.stringify(result));
                    }
                    response.end();
                });
            }
        }
    });
};

function extractUserName(request) {
    let userName = request.connection.user;
    if (userName.indexOf('\\') >= 0) {
        userName = userName.substring(userName.indexOf('\\') + 1);
    }
    return userName;
}