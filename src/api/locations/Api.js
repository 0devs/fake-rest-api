'use strict';

module.exports = LocationsApi;

var ApiError = require('./Error');

var moment = require('moment');
var joi = require('joi');
var convert = require('joi-to-json-schema');

var _ = require('lodash');

var schema = require('./schema');


function LocationsApi(config, logger) {
    this._config = config;
    this._logger = logger;

    this._id = 0;

    this._locations = [];

    this._index = {
        id: {},

        // unique name
        url: [],

        method_url_location: {}
    }
}


LocationsApi.prototype._generateId = function () {
    this._id = this._id + 1;
    return this._id.toString();
};

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

LocationsApi.prototype.findByMethodAndPath = function (method, path, callback) {
    var key = method + '_' + path;

    if (!this._index.method_url_location[key]) {
        callback(new ApiError('not_found'));
        return;
    }

    callback(null, this._index.method_url_location[key]);
};

LocationsApi.prototype.get = function (id, callback) {
    if (!this._index.id[id]) {
        callback(new ApiError('not_found'));
        return;
    }

    callback(null, this._index.id[id]);
};


LocationsApi.prototype.find = function (id, callback) {
    callback(null, this._locations);
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

        var indexKey = location.method + '_' + location.url;

        if (that._index.url.indexOf(indexKey) > -1) {
            var e = new ApiError('duplicate_url', [{message: 'url already exists'}]);
            callback(e);
            return;
        }

        try {
            var obj = JSON.parse(location.response);
            location.response = JSON.stringify(obj, null, '    ');

        } catch (e) {
            callback(new ApiError('invalid_data', [{message: 'response must be valid JSON'}]));
            return;
        }

        location.id = that._generateId();

        that._locations.push(location);

        that._index.id[location.id] = location;
        that._index.url.push(indexKey);
        that._index.method_url_location[indexKey] = location;

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

    if (!that._index.id[updateData.id]) {
        callback(new ApiError('not_found', [{message: 'such location not found'}]));
        return;
    }

    var data = that._index.id[updateData.id];

    ['response'].forEach(function (name) {
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

            data[name] = updateData[name];
        }
    });

    data['modification_date'] = moment().toISOString();

    callback(null, data);
};

LocationsApi.prototype.schema = function (data, callback) {
    callback(null, convert(schema));
};
