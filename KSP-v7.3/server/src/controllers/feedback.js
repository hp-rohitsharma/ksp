const fs = require('fs');

exports.save = function (request, response) {
    let feedback = JSON.stringify(request.body);
    let userName = request.connection.user;
    let path = './feedbacks/' + new Date().getTime() + getRandom()+'_'+userName;
    fs.writeFile(path, feedback, function (error) {
        if(error)
            console.error(error);
    });
    response.end();
};

function getRandom() {
    return Math.floor(Math.random() * 10000);
}