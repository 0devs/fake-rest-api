var _ = require('lodash');
var ViewAbstract = require('../Abstract');

module.exports = ViewTextarea;

function ViewTextarea() {
    ViewAbstract.call(this);
    this.template = require('./textarea.html');
}

ViewTextarea.prototype = _.create(ViewAbstract.prototype, {
    constructor: ViewTextarea
});



