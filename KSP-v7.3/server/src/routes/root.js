module.exports = function(express, upload) {
	
	express.get('/', function (request, response) {
		response.sendFile( "index.html", { root: './webapp/' });
	});

	// load routes
	//require('./blog')(express);
	//require('./doc')(express, upload);
	require('./document')(express, upload);
	require('./user')(express);
	require('./directory')(express);
	require('./index')(express, upload);
	require('./feedback')(express);
	//require('./comment')(express);
}
