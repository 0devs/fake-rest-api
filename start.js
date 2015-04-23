'use strict';


var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var serveStatic = require('serve-static');

var _ = require('lodash');

module.exports = function (config) {
    var logger = require('log4js').getLogger();
    var app = express();

    app.use('/', serveStatic(__dirname + '/public'));

    app.disable('x-powered-by');

    app.use(morgan('combined'));

    var builder = require('./src/api/builder');
    var Projects = require('./src/api/projects');
    var Locations = require('./src/api/locations');

    var models = require('./src/api/models').memory;

    app.use(cookieParser());
    app.use(bodyParser.json({limit: '1024kb'}));

    var defaultConfig = require(__dirname + '/config.json');

    config = _.merge(defaultConfig, config);

    var ProjectsApi = new Projects.Api(config, logger);
    builder('/api/projects', app, logger, ProjectsApi, Projects);

    var LocationsApi = new Locations.Api(config, logger, new models.locations());
    builder('/api/locations', app, logger, LocationsApi, Locations);

    var backup = require('./src/api/backup');

    var restore = backup.restore(config, logger, function (err, json) {
        if (err) {
            logger.error(err);
            return;
        }

        if (json && json.locations && json.locations.result) {
            json.locations.result.forEach(function (location) {

                LocationsApi.create(location, function (err, data) {

                    if (err) {
                        logger.error(err);
                        return;
                    }

                    logger.info('restore ' + data.method + ' ' + data.url);
                });
            });

            logger.info('restore from backup complete');
        }
    });

// init interval backup
    backup.backup(config, logger);

    var port = config.port;

    var headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Cache-Control'
    };

    app.get('/api/config', function (req, res) {
        res.writeHead(200, headers);
        res.write(JSON.stringify(config));
        res.end();
    });

    app.all('/fake/*', function (req, res) {

        var path = req.path.replace(/\/fake/, '');

        if (req.method == 'OPTIONS') {
            res.writeHead(200, headers);
            res.write('{"options": true}');
            res.end();
            return;
        }

        LocationsApi.findByMethodAndPath(req.method, path, function (err, location) {
            if (err) {
                res.writeHead(515, headers);
                res.write('{"error":"no_such_fake_location"}');
                res.end();
                return;
            }

            res.writeHead(location.status, headers);
            res.write(location.response);
            res.end();
        });
    });

    app.use(function (req, res) {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.write('{"error": "not_found"}');
        res.end();
    });

    app.listen(port);

    logger.info('started on port ' + port);
};