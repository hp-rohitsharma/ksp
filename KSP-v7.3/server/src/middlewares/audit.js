module.exports = function(express) {
    
    // logging for audit
	express.use(function (req, res, next) {
       // console.log(req); TODO
        next();      
    });
}
