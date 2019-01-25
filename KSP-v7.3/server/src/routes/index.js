const indexController = require('../controllers/index');

module.exports = function(express, upload) {
	
	express.post('/index', upload.single('file'), function (request, response) {
		indexController.index(request, response);		
	});

	express.get('/index/search/:text', function (request, response) {
		indexController.search(request, response);		
	});

	express.put('/index', function (request, response) {
		indexController.update(request, response);		
	});

	express.put('/index/:id', function (request, response) {
		indexController.reIndex(request, response);		
	});

	express.delete('/index', function (request, response) {
		indexController.delete(request, response);		
	});

	express.get('/index/suggestions/:text', function (request, response) {
		indexController.suggestions(request, response);		
	});

}
