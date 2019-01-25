const webSocketServer = require('../websocket-server');

exports.publish = function (message) {
    webSocketServer.publish(message);
};
