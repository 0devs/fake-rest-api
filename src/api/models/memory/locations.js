module.exports = LocationModel;

var moment = require('moment');
var _ = require('lodash');

/**
 *
 * @constructor
 */
function LocationModel() {

    this._id = 0;

    this._locations = [];

    this._index = {
        id: {},

        // unique name
        url: [],

        method_url_location: {}
    }

};

/**
 *
 * @returns {string}
 * @private
 */
LocationModel.prototype._generateId = function () {
    this._id = this._id + 1;
    return this._id.toString();
};

/**
 *
 * @param id
 * @param callback
 */
LocationModel.prototype.get = function (id, callback) {

    if (!this._index.id[id]) {
        callback(null, null);
        return;
    }

    callback(null, _.cloneDeep(this._index.id[id]));
};

/**
 *
 * @param params
 * @param callback
 */
LocationModel.prototype.find = function (params, callback) {

    if (!params) {

        // todo return all

    }

    if (params.method && params.path) {
        var key = params.method + '_' + params.path;

        if (!this._index.method_url_location[key]) {
            callback(null, null);
            return;
        }

        callback(null, this._index.method_url_location[key]);
        return;
    }

    callback(null, this._locations);
};

/**
 *
 * @param location
 * @param callback
 */
LocationModel.prototype.create = function (location, callback) {

    // todo check data object

    location.creation_date = moment().toISOString();

    delete location.modification_date;

    var indexKey = location.method + '_' + location.url;

    if (this._index.url.indexOf(indexKey) > -1) {
        var e = new Error('duplicate_url');
        callback(e);
        return;
    }

    try {
        var obj = JSON.parse(location.response);
        location.response = JSON.stringify(obj, null, '    ');

    } catch (e) {
        callback(new Error('invalid_data'));
        return;
    }

    location.id = this._generateId();

    this._locations.push(location);

    this._index.id[location.id] = location;
    this._index.url.push(indexKey);
    this._index.method_url_location[indexKey] = location;
};

/**
 *
 * @param data
 * @param callback
 */
LocationModel.prototype.update = function (data, callback) {

    // todo check id and data

    var that = this;

    var location = _.cloneDeep(data);

    delete location.modification_date;

    location['modification_date'] = moment().toISOString();

    _.each(location, function (value, name) {
        that._index.id[location.id][name] = value;
    });

    callback(null, true);
};



