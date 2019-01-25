const feedbackController = require('../controllers/feedback');

module.exports = function (express, upload) {

	express.post('/feedback', function (request, response) {
		feedbackController.save(request, response);
	});

}
