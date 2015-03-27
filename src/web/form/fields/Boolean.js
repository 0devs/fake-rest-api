var _ = require('lodash');
var Promise = require('bluebird');
var FieldAbstract = require('./Abstract');

module.exports = FieldBoolean;

function FieldBoolean(name, attrs) {
    FieldAbstract.call(this, name, attrs);
    this.value = this.attrs.default || false;
}

FieldBoolean.prototype = _.create(FieldAbstract.prototype, {
    constructor: FieldBoolean
});

