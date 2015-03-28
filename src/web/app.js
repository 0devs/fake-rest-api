var Vue = require('vue');

//Vue.config.debug = true

var Form = require('./form');

var _ = require('lodash');

Promise = require('bluebird');

var Projects = require('./components/projects');

var config = require('./config');

var logger = require('loglevel');
logger.enableAll();

$(document).ready(function () {

    var p = new Projects.List(config.api.projects, logger);
    p.$mount('._body');


});
