//var Vue = require('vue');
//Vue.config.debug = true;

var request = require('superagent');

var Form = require('./form');

var _ = require('lodash');

Promise = require('bluebird');

var Projects = require('./components/projects');
var Locations = require('./components/locations');

var logger = require('loglevel');
logger.enableAll();

request.get('/api/config')
    .end(function(err, res) {

        if (err) {
            logger.error(err);
            return;
        }

        var config = res.body;

        $(document).ready(function () {

            var p = new Locations.List(config, logger);
            p.$mount('._body');

            var editor = ace.edit($('.ace_editor')[0]);

            var toggleFullscreen = function() {
                $('.ace_editor').toggleClass('fullscreen');
                editor.resize();
                return false;
            };

            $('a.fullscreen').click(toggleFullscreen);
            $(document).keyup(function(e) {
                if (e.keyCode === 27) {
                    toggleFullscreen();
                }
            });
        });

    });

