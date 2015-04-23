'use strict';

module.exports = LocationsApi;

var ApiError = require('./Error');

var moment = require('moment');
var joi = require('joi');
var convert = require('joi-to-json-schema');

var _ = require('lodash');

var schema = require('./schema');


function LocationsApi(config, logger, model) {
    this._config = config;
    this._logger = logger;
    this._model = model;
}

LocationsApi.prototype.validate = function (project, callback) {

    joi.validate(project, schema, {
        abortEarly: false,
        convert: true
        //stripUnknown: true
    }, function (err, result) {

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

LocationsApi.prototype.get = function (id, callback) {

    var location = this._model.get(id, function (err, data) {

        // todo err process

        if (!data) {
            callback(new ApiError('not_found'));
            return;
        }

        callback(null, data);
    });
};

LocationsApi.prototype.findByMethodAndPath = function (method, path, callback) {
    this._model.find({method: method, path: path}, function (err, data) {

        // todo err process

        if (!data) {
            callback(new ApiError('not_found'));
            return;
        }

        callback(null, data);
    });
};

LocationsApi.prototype.find = function (params, callback) {

    this._model.find(params, function (err, data) {

        // todo err process

        callback(null, data);
    });
};


LocationsApi.prototype.create = function (data, callback) {
    var that = this;

    data.creation_date = moment().toISOString();

    delete data.modification_date;

    this.validate(data, function (err, location) {

        if (err) {
            callback(err);
            return;
        }

        that._model.create(location, function (err, data) {

            if (err) {
                var e;

                switch (err.message) {
                    case 'duplicate_url':
                        e = new ApiError('duplicate_url', [{message: 'url already exists'}]);
                        break;

                    case 'invalid_data':
                        e = new ApiError('invalid_data', [{message: 'response must be valid JSON'}]);
                        break;

                    default:
                        // todo log error
                        e = new ApiError('server_error');
                        break;
                }

                callback(e);
                return;
            }
        });

        callback(null, location);
    });
};

LocationsApi.prototype.update = function (updateData, callback) {
    delete updateData.modification_date;

    var that = this;

    if (!updateData.id) {
        callback(new ApiError('invalid_data', [{message: 'no id'}]));
        return;
    }

    this._model.get(updateData.id, function (err, location) {

        // todo err process

        if (!location) {
            callback(new ApiError('not_found', [{message: 'such location not found'}]));
            return;
        }

        ['status', 'response'].forEach(function (name) {
            if (updateData[name]) {

                if (name == 'response') {
                    try {
                        var obj = JSON.parse(updateData[name]);
                        updateData[name] = JSON.stringify(obj, null, '    ');

                    } catch (e) {
                        callback(new ApiError('invalid_data', [{message: 'response must be valid JSON'}]));
                        return;
                    }
                }

                location[name] = updateData[name];
            }
        });

        that._model.update(location, function (err, result) {
            callback(null, location);
        });
    });
};

LocationsApi.prototype.schema = function (data, callback) {
    callback(null, convert(schema));
};
