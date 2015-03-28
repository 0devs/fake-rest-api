module.exports = {
    Service: ProjectService
};

var request = require('superagent');


function ProjectService(config, logger) {

    this._config = config;
    this._logger = logger;

}


ProjectService.prototype.find = function(params, callback) {

    request.get(this._config.base)
        .end(function(err, res) {

            if (err) {
                callback(err);
                return;
            }

            callback(null, res.body);
        });
};

ProjectService.prototype.create = function(data, callback) {
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