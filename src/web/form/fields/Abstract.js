var _ = require('lodash');
var Promise = require('bluebird');


module.exports = FieldAbstract;


function FieldAbstract(name, attrs) {
    this.name = name;

    this.value = attrs.default;

    this.errors = [];

    this.attrs = attrs;

    this.title = attrs.title;

    this.enabled = true;

    this.required = attrs.required || false;

    this.validateRules = attrs.validate;
}

FieldAbstract.prototype.value = null;

FieldAbstract.prototype.setValue = function (value) {
    this.value = value;
};

FieldAbstract.prototype.getValue = function () {
    return this.value;
};

FieldAbstract.prototype.validate = function () {
    return new Promise(function (resolve) {
        resolve(true);
    });
};

FieldAbstract.prototype.isEnabled = function () {
    return this.enabled;
};

FieldAbstract.prototype.setEnabled = function (enabled) {
    this.enabled = Boolean(enabled);
};
