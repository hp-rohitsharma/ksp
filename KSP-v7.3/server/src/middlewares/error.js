module.exports = function (express) {

	express.use(function (error, request, response, next) {
		console.error(error);
		response.status(500);
		response.setHeader('Content-Type', 'application/json');
		response.json({ error: 'Failed to process request', message: error });
	});
}

