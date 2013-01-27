/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path');

var app = module.exports = express();

app.configure(function(){
    app.set('port', process.env.PORT);
	app.use(express.logger('dev'));
	app.use(express.errorHandler());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(app.router);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
