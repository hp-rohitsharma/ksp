const userController = require('../controllers/user');

module.exports = function(express) {
	
	express.get('/user', function (request, response) {
		userController.getByUserName(request, response);		
	});

	express.get('/users', function (request, response) {
		userController.getAllUsers(request, response);		
	});

	express.post('/user', function (request, response) {
		userController.save(request, response);		
	});
}
