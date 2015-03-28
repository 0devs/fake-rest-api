var Form = require('../../form');

var Vue = require('vue');

module.exports = ProjectForm;


function ProjectForm(values) {
    if (!values) {
        values = {
            url: ''
        };
    }

    var schema = {
        url: {
            title: 'Url',
            type: 'String',
            view: 'Input',
            validate: [],
            required: true
        }
    };

    var formFactory = new Form.Factory(schema, values);

    var form = new Form.Form(null, require('./templates/form.html'));

    var fields = formFactory.getFields();

    form.setFields(fields);
    form.setComponents(formFactory.getComponents());

    form.setFormData({
        valid: false,
        result: null
    });

    form.addMethods({
        save: function () {

            this.validate(function (err, valid) {

                if (valid) {
                    var that = this;

                    this.$parent.getProjectsApi().create(this.getValue(), function(err, data) {

                        if (err) {
                            console.log(err);
                            return;
                        }

                        that.$parent.addProject(data.result);
                        that.clear();
                        that.$parent.hideAddForm();
                    });
                }
            });
        },

        cancel: function () {
            this.$parent.hideAddForm();
        }

    });

    return form;
}



