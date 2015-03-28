var send = function (res, data, status) {
    if (!status) {
        status = 200;
    }

    var headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Cache-Control'
    };

    res.writeHead(status, headers);

    res.write(JSON.stringify(data));

    res.end();
};

var createCallback = function(Bundle, res) {
    return function (err, result) {
        var data;

        if (err) {
            if (err instanceof Bundle.Error) {

                data = {
                    error: err.message
                };

                if (err.hasErrors()) {
                    data.list = err.getErrors();
                }

                send(res, data, 400);

            } else {
                logger.error(err);

                data = {
                    error: 'server_error'
                };

                send(res, data, 500);
            }

            return;
        }

        send(res, {result: result});
    };
};

module.exports = function (location, app, logger, api, Bundle) {

    if (api.get) {
        app.get(location + '/:id', function (req, res) {
            api.get(req.params.id, createCallback(Bundle, res));
        });
    }

    if (api.find) {
        app.get(location, function (req, res) {
            api.find(req.params, createCallback(Bundle, res));
        });
    }

    if (api.create) {
        app.post(location, function (req, res) {
            api.create(req.body, createCallback(Bundle, res));
        });
    }

    if (api.update) {
        app.post(location + '/:id', function (req, res) {
            api.update(req.body, createCallback(Bundle, res));
        });
    }

    if (api.delete) {
        app.delete(location + '/:id', function (req, res) {
            api.create(req.params.id, createCallback(Bundle, res));
        });
    }

    if (api.schema) {
        app.options(location + '/schema', function(req, res) {
            api.schema(req.body, createCallback(Bundle, res));
        });
    }

    app.options(location, function(req, res) {
        send(res, {'ok': true}, 200);
    });
};