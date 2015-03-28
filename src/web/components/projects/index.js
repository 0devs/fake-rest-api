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
            this._projectsApi = new Project.Service(config);
        },

        ready: function () {
            var that = this;
            this.refreshProjects();
        },

        methods: {
            showAddForm: function () {
                this.formVisible = true;
            },

            hideAddForm: function() {
                this.formVisible = false;
            },

            getProjectsApi: function () {
                return this._projectsApi;
            },

            refreshProjects: function () {
                var that = this;

                this._projectsApi.find({}, function (err, data) {
                    if (err) {
                        logger.error(err);
                        return;
                    }

                    that.$set('projects', data.result);
                });
            },

            addProject: function(data) {
                this.projects.push(data);
            }

        }
    };

    return new Vue(list);
}


