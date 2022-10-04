var common = require('../app/common/commonFunction');
var {TABLE_NAME} = require("../config/tablename");
var _ = require("lodash")
const logger = require("../app/utils/logger")

module.exports = async function(req, res, next) {
    // CORS headers
	res.header('Access-Control-Allow-Origin', '*'); // restrict it to the required domain
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	// Set custom headers for CORS
	res.header(
		'Access-Control-Allow-Headers',
		'Content-type,Accept,X-Access-Token,X-Key'
	);
	if (req.method === 'OPTIONS') {
		res.status(200).end();
	} else {
        try {
            // any here
            next();
        } catch (error) {
            res.status(403);
            res.json({
                status : "KO",
                message: error.message
            });
            return;
        }
        
	}

};
