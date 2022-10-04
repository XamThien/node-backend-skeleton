var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser')
const compression = require('compression');
var process = require('process');

var constants = require('./app/common/constants.js');
var loggger = require('./app/utils/logger');
var app = express();
var dotenv = require("dotenv")
dotenv.config()
// Compress all HTTP responses
app.use(compression());

process.on('SIGINT', function onSigint() {
  app.shutdown();
});

process.on('SIGTERM', function onSigterm() {
  app.shutdown();
});

app.shutdown = function () {
  // clean up your resources and exit
  process.exit();
};

app.use(logger('dev'));

// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true,parameterLimit: 50000 }));
app.use(function(error, req, res, next) {
	console.log(error);
	res.sendStatus(400);
});

app.all('/*', [require('./middlewares/normal')]);



app.use('/', require('./routes'));

// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
	var err = new Error(constants.ERROR_404);
	err.status = 404;
	next();
});

// Start the server
app.set('port', process.env.PORT || constants.SERVER_PORT);

var server = app.listen(app.get('port'), function() {
	loggger.info('Express server listening on port ' + server.address().port);
});
