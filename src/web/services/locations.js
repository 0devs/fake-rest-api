module.exports = {
    Service: LocationService
};

var request = require('superagent');


function LocationService(config, logger) {

    this._config = config;
    this._logger = logger;

}


LocationService.prototype.find = function(params, callback) {

    request.get(this._config.base)
        .end(function(err, res) {

            if (err) {
                callback(err);
                return;
            }

            callback(null, res.body);
        });
};

LocationService.prototype.create = function(data, callback) {
    request.post(this._config.base)
        .send(data)
        .end(function (err, res) {
            if (err) {
                callback(err);
                return;
            }

            callback(null, res.body);
        });
};

LocationService.prototype.update = function(data, callback) {

    request.post(this._config.base + '/' + data.id)
        .send(data)
        .end(function(err, res) {
            if (err) {
                callback(err);
                return;
            }

            callback(null, res.body);
        });
};