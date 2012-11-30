'use strict';
var local = true,
    application,
    express = require('express'),//3.0.0rc2
    fs = require('fs'),
    jade = require('jade'),//0.27.0
	flash = require('connect-flash'),//0.1.0
	browserify = require('browserify'), //1.14.5
    url = local ? 'mongodb://localhost/philatopedia' : "mongodb://nodejitsu:9149931d667e323b3c0b16653335f61b@alex.mongohq.com:10021/nodejitsudb229917654737",
    routes = require('./routes'),
    config = require('./config'),
    app = module.exports = express();
config.configure(app, express, flash, browserify);
routes.initialize(app);
application = app.listen(3333);
if (local) {
    console.log('Express service listening on port %d, environment: %s', application.address().port, app.settings.env);
}