var Vue = require('vue');

var Form = require('./form');

var _ = require('lodash');

Promise = require('bluebird');

$(document).ready(function () {

    var schema = {
        title: {
            title: 'Title',
            type: 'String',
            view: 'Input',
            validate: [],
            required: true
        }
    };

    var values = {
        title: ''
    };

    var formFactory = new Form.Factory(schema, values);

    var form = new Form.Form('body', require('./templates/form.html'));

    var fields = formFactory.getFields();

    form.setFields(fields);
    form.setComponents(formFactory.getComponents());

    form.setFormData({
        valid: false,
        result: null
    });

    new Vue(form);
});
