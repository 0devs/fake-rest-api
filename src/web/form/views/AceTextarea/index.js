var _ = require('lodash');
var ViewAbstract = require('../Abstract');

module.exports = ViewAceTextarea;

function ViewAceTextarea() {
    ViewAbstract.call(this);
    this.template = require('./aceTextarea.html');
}

ViewAceTextarea.prototype = _.create(ViewAbstract.prototype, {
    constructor: ViewAceTextarea
});



