'use strict';

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var logger = require('log4js').getLogger();
var app = express();
app.disable('x-powered-by');

app.use(morgan('combined'));

var builder = require('./builder');
var Projects = require('./projects');
var Locations = require('./locations');


app.use(cookieParser());
app.use(bodyParser.json({limit: '1024kb'}));

var config = {};

var ProjectsApi = new Projects.Api(config, logger);
builder('/api/projects', app, logger, ProjectsApi, Projects);

var LocationsApi = new Locations.Api(config, logger);
builder('/api/locations', app, logger, LocationsApi, Locations);

var port = 8080;

app.all('/fake/*', function(req, res) {

    var path = req.path.replace(/\/fake/, '');

    var headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Cache-Control'
    };

    if (req.method == 'OPTIONS') {
        res.writeHead(200, headers);
        res.write('{"options": true}');
        res.end();
        return;
    }

    LocationsApi.findByMethodAndPath(req.method, path, function(err, location) {
        if (err) {
            res.writeHead(515, headers);
            res.write('{"error":"no_such_fake_location"}');
            res.end();
            return;
        }

        res.writeHead(200, headers);
        res.write(location.response);
        res.end();
    });




    //var r = {
    //    path: req.path,
    //    query: req.query,
    //    method: req.method
    //};
    //
    //
    //
    //res.write(JSON.stringify(r));
    //res.end();
});

app.use(function(req, res) {
    res.writeHead(404, {'Content-Type': 'application/json'});
    res.write('{"error": "not_found"}');
    res.end();
});

app.listen(port);

logger.info('started on port ' + port);



