var _ = require('lodash');
var Promise = require('bluebird');
var FieldAbstract = require('./Abstract');

module.exports = FieldString;

function FieldString(name, attrs) {
    FieldAbstract.call(this, name, attrs);
}

FieldString.prototype = _.create(FieldAbstract.prototype, {
    constructor: 'FieldString'
});


FieldString.prototype.validate = function () {
    var that = this;

    this.errors = [];

    return new Promise(function (resolve, reject) {

        if (that.required && _.isEmpty(that.value)) {
            that.errors.push('Required');
            resolve(false);
            return;
        }

        if (that.validateRules && !_.isEmpty(that.value)) {

            var valid = false;

            _.each(that.validateRules, function (rule) {
                //
            });

            resolve(valid);
        }

        resolve(true);
    });
};

