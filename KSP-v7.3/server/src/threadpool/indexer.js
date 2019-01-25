const spawn = require('threads').spawn;

const thread = spawn(function (params, done) {

    const engine = require(params.__dirname + '/../index/engine');

    engine.index(params.textFile, params.key, null, function (error, _root) {
        if (error) {
            done({
                status: "failed",
                message: error,
                textFile: params.textFile,
                key: params.key
            });
        } else {
            done({
                status: "success",
                textFile: params.textFile,
                key: params.key
            });
        }
    });
});

let listenersRegistered = false;
let indexingInProgress = false;
let indexingRequests = [];
let currentCallback;

exports.index = function (textFile, key, metadata, callback) {

    if (!listenersRegistered) {
        thread
            .on('done', function (response) {
                console.log(response);
                currentCallback(response);
                indexingInProgress = false;
                next();
            })
            .on('error', function (error) {
                console.error('Worker errored:', error);
                currentCallback(null, error);
                indexingInProgress = false;
                next();
            })
            .on('exit', function () {
                console.log('Worker has been terminated.');
                indexingInProgress = false;
            });

        listenersRegistered = true;
    }

    function next() {
        let request = dequeue();
        console.log('Pending indexing requests in queue ' + indexingRequests.length);
        if (request) {
            currentCallback = request.callback;
            indexingInProgress = true;
            thread.send(request);
        }
    }

    if (indexingInProgress) {
        console.log('Adding indexing request to queue.');
        console.log('Pending indexing requests in queue ' + indexingRequests.length);
        enqueue({ textFile: textFile, key: key, __dirname: __dirname, callback: callback });
    } else {
        indexingInProgress = true;
        currentCallback = callback;
        thread.send({ textFile: textFile, key: key, __dirname: __dirname });
    }
}

function enqueue(request) {
    indexingRequests.push(request);
}

function dequeue() {
    return indexingRequests.pop();
}