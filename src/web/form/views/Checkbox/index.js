var _ = require('lodash');
var ViewAbstract = require('../Abstract');


module.exports = ViewCheckbox;

function ViewCheckbox() {
    ViewAbstract.call(this);
    this.template = require('./checkbox.html');
}

ViewCheckbox.prototype = _.create(ViewAbstract.prototype, {
    constructor: ViewCheckbox
});
