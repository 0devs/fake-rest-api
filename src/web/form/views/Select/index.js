var _ = require('lodash');
var ViewAbstract = require('../Abstract');

module.exports = ViewSelect;


function ViewSelect() {
    ViewAbstract.call(this);
    this.template = require('./select.html');
}

ViewSelect.prototype = _.create(ViewAbstract.prototype, {
    constructor: ViewSelect
});