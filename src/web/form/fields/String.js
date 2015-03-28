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

        if (that.validateRules && !_.isEmpty(that.validateRules) && !_.isEmpty(that.value)) {

            var valid = true;

            _.each(that.validateRules, function (rule) {
                if (rule.json) {
                    var isJSON = that.isJSON(that.value);

                    if (!isJSON) {
                        that.errors.push('must be valid JSON');
                    }


                    valid =  isJSON && valid;
                }
            });

            resolve(valid);
        }

        resolve(true);
    });
};

FieldString.prototype.isJSON = function (value) {
    try {
        JSON.parse(value);
        return true;
    } catch (e) {
        return false;
    }
};

