var webSocketServer = require('websocket').server;

var clients = [];

exports.publish = function (message) {

    clients.forEach(function (client) {
        client.sendUTF(JSON.stringify(message));
    });
}

exports.init = function (httpServer) {
    console.log('Registering websocket listener');
    /**
     * WebSocket server
     */
    var wsServer = new webSocketServer({
        // WebSocket server is tied to a HTTP server. WebSocket
        // request is just an enhanced HTTP request. For more info 
        // http://tools.ietf.org/html/rfc6455#page-6
        httpServer: httpServer
    });

    // This callback function is called every time someone
    // tries to connect to the WebSocket server
    wsServer.on('request', function (request) {
      //  console.log((new Date()) + ' Connection from origin '
       //     + request.origin + '.');
        // accept connection - you should check 'request.origin' to
        // make sure that client is connecting from your website
        // (http://en.wikipedia.org/wiki/Same_origin_policy)
        var connection = request.accept(null, request.origin);

        // we need to know client index to remove them on 'close' event
        console.log('request received: ' + connection.remoteAddress);
        var index = clients.push(connection) - 1;
       // console.log((new Date()) + ' Connection accepted.');

        // user sent some message
        connection.on('message', function (message) {
            console.log('message received '+message);
            //connection.sendUTF(JSON.stringify({ type: 'color', data: userColor }));            
        });

        // user disconnected
        connection.on('close', function () {
            console.log('closing connection: ' + connection.remoteAddress);
           // console.log((new Date()) + " Peer "
            //    + connection.remoteAddress + " disconnected.");
            // remove user from the list of connected clients
            clients.splice(index, 1);
        });
    });

}
