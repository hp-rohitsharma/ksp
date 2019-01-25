var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');

var path = require('path');
var config = require('./configs/server');

var app = express();
app.use(bodyParser.json());
app.use(express.static(path.join('./', config.server.webapp)));
var upload = multer({ dest: 'uploads/' });

if (!fs.existsSync('repository')){
   fs.mkdirSync('repository');
}
if (!fs.existsSync('index_cache')){
  fs.mkdirSync('index_cache');
}
if (!fs.existsSync('text-files')){
fs.mkdirSync('text-files');
}
if (!fs.existsSync('webapp')){
  fs.mkdirSync('webapp');
}
if (!fs.existsSync('feedbacks')){
  fs.mkdirSync('feedbacks');
}

// For http
var httpServer = http.createServer(app);
httpServer.listen(config.server.port);

// For https
//var privateKey = fs.readFileSync('certificates/key.pem', 'utf8');
//var certificate = fs.readFileSync('certificates/cert.pem', 'utf8');
//var credentials = { key: privateKey, cert: certificate };
//var httpsServer = https.createServer(credentials, app);
//httpsServer.listen(8443);

//Web socket support
require('./websocket-server').init(httpServer);
// LOAD custom modules : order matters
require('./middlewares/root')(app);
require('./routes/root')(app, upload);
require('./mongo');