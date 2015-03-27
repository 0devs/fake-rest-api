var _ = require('lodash');
var Promise = require('bluebird');
var FieldAbstract = require('./Abstract');

module.exports = FieldCollection;


function FieldCollection(name, attrs) {
    FieldAbstract.call(this, name, attrs);
}

Collection.prototype = _.create(FieldAbstract.prototype, {
    constructor: Collection
});
