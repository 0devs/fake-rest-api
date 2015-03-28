'use strict';

module.exports = ProjectsApi;

var ApiError = require('./Error');

var moment = require('moment');
var joi = require('joi');

var schema = require('./schema');


function ProjectsApi(config, logger) {
    this._config = config;
    this._logger = logger;

    this._id = 0;

    this._projects = [];

    this._index = {
        id: {},

        // unique name
        name: []
    }
}


ProjectsApi.prototype._generateId = function() {
    this._id = this._id + 1;
    return this._id.toString();
};

ProjectsApi.prototype.validate = function(project, callback) {

    joi.validate(project, schema, {
        abortEarly: false,
        convert:true
        //stripUnknown: true
    }, function(err, result) {

        if (err) {

            if (err && err.name == 'ValidationError') {
                var e = new ApiError(err);
                e.message = 'invalid_data';
                callback(e);
            } else {
                callback(err);
            }
            return;
        }

        callback(null, result);
    });
};

ProjectsApi.prototype.get = function(id, callback) {
    if (!this._index.id[id]) {
        callback(new ApiError('not_found'));
        return;
    }

    callback(null, this._index.id[id]);
};


ProjectsApi.prototype.find = function(id, callback) {
    callback(null, this._projects);
};


ProjectsApi.prototype.create = function(data, callback) {
    var that = this;

    data.creation_date = moment().unix();

    this.validate(data, function(err, project) {

        if (err) {
            callback(err);
            return;
        }

        if (that._index.name.indexOf(project.url) > -1) {
            var e = new ApiError();
            e.message = 'duplicate_url';
            callback(e);
            return;
        }

        project.id = that._generateId();

        that._projects.push(project);

        that._index.id[project.id] = project;
        that._index.name.push(project.url);

        callback(null, project);
    });
};
