module.exports = {
    List: List
};

var config = require('../../config');

var Project = require('../../services/projects');

var AddForm = require('./form');

var Vue = require('vue');

function List(config, logger) {

    var list = {

        template: require('./templates/list.html'),

        data: function () {
            return {
                projects: [],
                formVisible: false
            }
        },

        components: {
            form: new AddForm()
        },

        created: function () {
            this._locationsApi = new Project.Service(config);
        },

        ready: function () {
            var that = this;
            this.refreshLocations();
        },

        methods: {
            showAddForm: function () {
                this.$set('formVisible', true);
            },

            hideAddForm: function() {
                this.$set('formVisible', false);
            },

            getLocationsApi: function () {
                return this._locationsApi;
            },

            refreshLocations: function () {
                var that = this;

                this._locationsApi.find({}, function (err, data) {
                    if (err) {
                        logger.error(err);
                        return;
                    }

                    that.$set('projects', data.result);
                });
            },

            addLocation: function(data) {
                this.projects.push(data);
            }

        }
    };

    return new Vue(list);
}


