var _ = require('lodash');
var Promise = require('bluebird');
var FieldAbstract = require('./Abstract');

module.exports = FieldNumber;

function FieldNumber(name, attrs) {
    FieldAbstract.call(this, name, attrs);
}

FieldNumber.prototype = _.create(FieldAbstract.prototype, {
    constructor: 'FieldNumber'
});


FieldNumber.prototype.validate = function () {
    var that = this;

    this.errors = [];

    return new Promise(function (resolve, reject) {

        if (that.required && _.isEmpty(that.value)) {
            that.errors.push('Required');
            resolve(false);
            return;
        }

        if (that.validateRules && !_.isEmpty(that.validateRules) && !_.isEmpty(that.value)) {

            var valid = true;

            _.each(that.validateRules, function (rule) {
                if (rule.integer) {

                    var isInteger = false;

                    if (Number(that.value) == that.value && that.value % 1 === 0) {
                        isInteger = true;
                    } else {
                        that.errors.push('must be Integer');
                    }

                    valid =  isInteger && valid;
                }
            });

            resolve(valid);
        }

        resolve(true);
    });
};
