var _ = require('lodash');

module.exports = ViewAbstract;

function ViewAbstract() {
    this.template = null;

    this.data = {};
}

ViewAbstract.prototype.data = null;

ViewAbstract.prototype.setValue = function (value) {
    this.data.value = value;
};