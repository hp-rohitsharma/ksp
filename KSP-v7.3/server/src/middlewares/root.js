module.exports = function(express) {
    
	// load filters : order matters
	require('./cors')(express);
    require('./authentication')(express); 
	require('./audit')(express);
	require('./error')(express); //  must be last

}
