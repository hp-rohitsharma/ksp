const documentController = require('../controllers/document');

module.exports = function (express, upload) {

	express.get('/documents/document/:id', function (request, response) {
		documentController.getById(request, response);
	});

	express.get('/documents', function (request, response) {
		documentController.getAll(request, response);
	});

	express.post('/documents/document', upload.single('file'), function (request, response) {
		documentController.save(request, response);
	});

	express.put('/documents/document/:id', upload.single('file'), function (request, response) {
		documentController.update(request, response);
	});

	express.delete('/documents/document/:id', function (request, response) {
		documentController.remove(request, response);
	});

	express.get('/documents/document/download/:id', function (request, response) {
		documentController.download(request, response);
	});
}
