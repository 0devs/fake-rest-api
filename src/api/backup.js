var request = require('superagent');
var fs = require('fs');
var moment = require('moment');

module.exports = {
    backup: init,
    restore: restore
};


function backup(config, logger) {

    request.get(config.api.locations.base)
        .end(function(err, res) {
            if (err) {
                logger.error(err);
                return;
            }

            if (res && res.body) {

                var data = {
                    locations: res.body
                };

                var backup = JSON.stringify(data);

                fs.writeFile(config.backup.path + 'backup.json', backup, function(err, data) {
                    if (err) {
                        logger.error(err);
                        return;
                    }

                    logger.info('locations backup to ' + config.backup.path + 'backup.json');
                });

                //var backupFile = config.backup.path + moment().toISOString() + '.json';
                //
                //fs.writeFile(backupFile, backup, function(err, data) {
                //    if (err) {
                //        logger.error(err);
                //        return;
                //    }
                //
                //    logger.info('locations backup to ' + config.backup.path + backupFile);
                //});
            }
        });
}

function restore(config, logger, callback) {

    var path = config.backup.path + 'backup.json';

    if (!fs.existsSync(path)) {
        loggger.info('no backup');
        return;
    }

    fs.readFile(path, function(err, data) {

        if (err) {
            logger.error(err);
            callback(err);
            return;
        }

        try {
            var json = JSON.parse(data);
        } catch (e) {
            logger.error(e);
            callback(err);
            return;
        }

        callback(null, json);
    });
}

function init(config, logger) {

    setInterval(function() {
        backup(config, logger);
    }, config.backup.interval);


}