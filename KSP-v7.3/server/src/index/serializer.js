const fs = require('fs');

const CACHE_LOCATION = './index_cache';
const PREFIX = '_';

function generateUniqueFileName() {
	return PREFIX + new Date().getTime() + Math.floor(Math.random() * 1000000000000000);
}

exports.saveAsyncByName = function (object, fileName, callback) {
    let json = JSON.stringify(object);
    saveAsync(json, fileName, callback);
}

exports.saveAsync = function (object, callback) {
    let json = JSON.stringify(object);
    let fileName = generateUniqueFileName();
    saveAsync(json, fileName, callback);
}

exports.saveSync = function (object, callback) {
    let json = JSON.stringify(object);
    let fileName = generateUniqueFileName();
    saveSync(json, fileName, callback);
}

exports.getSync = function (fileName) {
    return JSON.parse(fs.readFileSync(CACHE_LOCATION + '/' + fileName, 'utf8'));
}

exports.getAsync = function (fileName, callback) {
    fs.readFile(CACHE_LOCATION + '/' + fileName, 'utf8', function (error, data) {
        if (error) {
            callback(error, null);
        } else {           
            callback(error, data);            
        }
    });
}

exports.updateAsync = function (object, fileName, callback) {
   // this.delete(fileName);
	let json = JSON.stringify(object);
    saveAsync(json, fileName, callback);
}

exports.updateSync = function (object, fileName, callback) {
   // this.delete(fileName);
	let json = JSON.stringify(object);
    saveSync(json, fileName, callback);
}

exports.delete = function (fileName, callback) {
    fs.unlink(CACHE_LOCATION + '/' + fileName, callback);
}

function saveAsync(json, fileName, callback) {
    let dir = CACHE_LOCATION + '/' + fileName;   
	fs.writeFile(dir, json, function(error) {
		if(error) {
			console.error(error);
			callback(null, error);
		}
		callback(fileName);
	}); 
}

function saveSync(json, fileName, callback) {
    let dir = CACHE_LOCATION + '/' + fileName;   
    fs.writeFileSync(dir, json);
    callback(fileName);
}
