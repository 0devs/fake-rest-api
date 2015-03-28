'use strict';

module.exports = ApiError;

var _ = require('lodash');

function ApiError(message, errors)  {
    if (message instanceof Error && message.name == 'ValidationError') {
        this.message = message;
        this.errors = message.details;
    } else {
        this.message = message;
        this.errors = errors;
    }
}

ApiError.prototype = _.create(Error.prototype, {
    'constructor': ApiError
});

ApiError.prototype.getErrors = function() {
    return this.errors;
};

ApiError.prototype.hasErrors = function() {
    return (this.errors) ? true : false;
};