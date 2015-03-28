'use strict';

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var logger = require('log4js').getLogger();
var app = express();

app.use(morgan('combined'));

var builder = require('./builder');
var Projects = require('./projects');


app.use(cookieParser());
app.use(bodyParser.json());

var config = {};

var ProjectsApi = new Projects.Api(config, logger);
builder('/api/projects', app, logger, ProjectsApi, Projects);

var port = 8080;

app.use(function(req, res) {
    res.writeHead(404, {'Content-Type': 'application/json'});
    res.write('{"error": "not_found"}');
    res.end();
});

app.listen(port);

logger.info('started on port ' + port);



