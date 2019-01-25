const spawn = require('threads').spawn;

const thread = spawn(function (params, done) {

    const PDFParser = require("pdf2json");
    const fs = require('fs');

    let pdfParser = new PDFParser(this, 1);

    pdfParser.on("pdfParser_dataError", function (error) {
        done({
            status: "failed",
            message: error
        });
    });

    pdfParser.on("pdfParser_dataReady", function (pdfData) {
        let pdfString = pdfParser.getRawTextContent();
        pdfString = pdfString.replace(/\s+/g,' ').trim();

        fs.appendFile(params.textFile, pdfString, function (error) {
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

    pdfParser.loadPDF(params.pdfFile);
});


let listenersRegistered = false;

exports.extractTextToFile = function (pdfFile, textFile, key, callback) {

    if (!listenersRegistered) {
        thread
            .on('done', function (response) {
                callback(response);
            })
            .on('error', function (error) {
                console.error('Worker errored:', error);
                callback(null, error);
            })
            .on('exit', function () {
                console.log('Worker has been terminated.');
            });

        listenersRegistered = true;
    }

    thread.send({ pdfFile: pdfFile, textFile: textFile, key: key });
}