var Fields = require('./fields');
var Views = require('./views');
var _ = require('lodash');

module.exports = {
    Factory: FormFactory,
    Form: Form,
    Fields: Fields,
    Views: Views
};


function FormFactory(schema, values) {
    this.schema = schema;
    this.values = values;

    this.fields = {};
    this.components = {};

    var that = this;

    _.each(schema, function (field, name) {

        if (field.type && Fields[field.type]) {
            that.fields[name] = new Fields[field.type](name, field);


            if (that.values[name]) {
                that.fields[name].setValue(that.values[name]);
            }

        }

        if (field.view && Views[field.view]) {
            that.components[name] = new Views[field.view](field);
        }
    });
}

FormFactory.prototype.getFields = function () {
    return this.fields;
};

FormFactory.prototype.getComponents = function () {
    return this.components;
};


function Form(el, template) {
    this.el = el;
    this.template = template;;
}

Form.prototype.template = null;

Form.prototype.data = {
    fields: {},
    form: {}
};

Form.prototype.components = {};

Form.prototype.setFields = function (fields) {
    this.data.fields = fields;
};

Form.prototype.setFormData = function (data) {
    this.data.form = data;
};

Form.prototype.setComponents = function (components) {
    this.components = components;
};

Form.prototype.methods = {

    getValue: function () {
        var result = {};

        _.each(this.$data.fields, function (field, name) {
            if (field instanceof Fields.Abstract && field.isEnabled()) {
                result[name] = field.getValue();
            }
        });

        return result;
    },

    validate: function (callback) {

        // проверяем поля
        var promises = {};

        _.each(this.$data.fields, function (field, name) {
            if (field instanceof Fields.Abstract && field.isEnabled()) {
                promises[name] = field.validate();
            }
        });

        Promise.props(promises)
            .then(function (data) {
                var valid = true;

                _.each(data, function (val) {
                    valid = valid && val;
                });

                callback(null, valid);
            }).catch(function (error) {
                callback(error);
            });
    }
};

Form.prototype.extend = function (obj) {
    _.merge(this, obj);
};

