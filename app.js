/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , pdf = require('./routes/pdf')
  , http = require('http')
  , path = require('path')
  , async = require('async');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function() {
  console.log('Using development settings.');
  app.use(express.errorHandler());
});

app.configure('production', function() {
  console.log('Using production settings.');
});

function init() {
    app.get('/', routes.index);
    app.get('/generate', pdf.generatePdf);

  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });
}

app.configure('development', function() {
    console.log('Initlializing...');
    init();
    console.log('Initlialized');
});