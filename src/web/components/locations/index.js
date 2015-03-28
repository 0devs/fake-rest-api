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
                type: 'http',
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

                    that.$set('locations', data.result);
                });
            },

            addLocation: function(data) {
                this.locations.push(data);
            },

            doResponse: function(location) {

                var method = location.method.toLowerCase();

                if (method == 'delete') {
                    method = 'del';
                }

                var url = config.fake.base + location.url;

                var that = this;

                request[method](url)
                    .end(function(err, res) {
                        if (err) {
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


            }

        }
    };

    return new Vue(list);
}


