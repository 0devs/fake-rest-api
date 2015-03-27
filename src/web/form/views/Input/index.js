var _ = require('lodash');
var ViewAbstract = require('../Abstract');

module.exports = ViewInput;

function ViewInput() {
    ViewAbstract.call(this);
    this.template = require('./input.html');
}

ViewInput.prototype = _.create(ViewAbstract.prototype, {
    constructor: ViewInput
});