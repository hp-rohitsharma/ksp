const directoryController = require('../controllers/directory');

module.exports = function(express) {
	
	express.get('/directory', function (request, response) {
		directoryController.get(request, response);		
	});

	express.post('/directory', function (request, response) {
		directoryController.add(request, response);		
	});

	express.put('/directory', function (request, response) {
		directoryController.update(request, response);		
	});

	express.delete('/directory/:id', function (request, response) {
		directoryController.delete(request, response);		
	});

}
