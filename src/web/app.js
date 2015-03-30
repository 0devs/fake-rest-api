var Vue = require('vue');

//Vue.config.debug = true

var Form = require('./form');

var _ = require('lodash');

Promise = require('bluebird');

var Projects = require('./components/projects');
var Locations = require('./components/locations');

var config = require('./config');

var logger = require('loglevel');
logger.enableAll();

$(document).ready(function () {

    var p = new Locations.List(config, logger);
    p.$mount('._body');

    var textareas = document.querySelectorAll('.codemirror');
    var codemirrors = [];
    for (var i = 0, j = textareas.length; i < j; i++) {
        codemirrors.push(CodeMirror(function(e) {
            textareas[i].parentNode.replaceChild(e, textareas[i]);
        }, {
            value: textareas[i].value,
            lineNumbers: true,
            json: true
        }));
    }

});
