module.exports = {
    List: List
};

var config = require('../../config');

var Locations = require('../../services/locations');

var AddForm = require('./form');

var Vue = require('vue');

var request = require('superagent');

function List(config, logger) {

    var list = {

        template: require('./templates/list.html'),

        data: function () {
            return {
                locations: [],
                formVisible: false,
                base: config.fake.base,
                type: 'curl',
                request: '',
                response: ''
            }
        },

        components: {
            form: new AddForm()
        },

        created: function () {
            this._locationsApi = new Locations.Service(config.api.locations);
        },

        ready: function () {
            var that = this;
            this.refreshLocations();
        },

        methods: {
            showAddForm: function () {
                this.$set('formVisible', true);
                this.$.form.changeType('create');
                this.$.form.enable();
            },

            hideAddForm: function () {
                this.$set('formVisible', false);
                this.$.form.changeType('create');
                this.refreshLocations();
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

                    that.$set('locations', data.result);
                });
            },

            addLocation: function (data) {
                this.locations.push(data);
            },

            showEditForm: function(vm) {
                vm.$parent.$set('formVisible', true);
                vm.$parent.$.form.changeType('update', vm.id);
                vm.$parent.$.form.$set('fields.url.value', vm.url);
                vm.$parent.$.form.$set('fields.method.value', vm.method);
                vm.$parent.$.form.$set('fields.status.value', vm.status);
                vm.$parent.$.form.$set('fields.response.value', vm.response);
                vm.$parent.$.form.disable();
            },

            doResponse: function (location) {

                var method = location.method.toLowerCase();

                if (method == 'delete') {
                    method = 'del';
                }

                var url = config.fake.base + location.url;

                var that = this;

                request[method](url)
                    .end(function (err, res) {
                        if (err && !res) {
                            console.log(err);
                            return;
                        }

                        //that.$set('modal.title', location.method + ' ' + url);
                        //that.$set('response', JSON.stringify(res.body));

                        $('body').find('.highlight').html(JSON.stringify(res.body, null, '    '));

                        $('body').find('.highlight').each(function (i, e) {
                            hljs.highlightBlock(e);
                        });

                        $('#response').modal('show');
                    });
            },

            setHttp: function () {
                this.$set('type', 'http');
            },

            setCurl: function () {
                this.$set('type', 'curl');
            }

        }
    };

    return new Vue(list);
}


