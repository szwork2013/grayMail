/// <reference path='../../libs.js' />
M139.namespace('M139.Dom.AddrFloatModel', {
    AddrFloatModel: Backbone.Model.extend({
        defaults: {
            'SearchKey': '',
            'Groups': [],
            'SearchResult': [],
            'Controller': {}
        },
        clear: function () {
            this.destroy();
        },
        Action: function (name, option) {
            this.Controller[name + 'Atcion'](option);
        }
    }),
    AddrFloatSerachResultModel: Backbone.Model.extend({
        defaults: {
            'SearchResult': [],
            'Controller': {}
        },
        clear: function () {
            this.destroy();
        },
        Action: function (name, option) {
            this.Controller[name + 'Atcion'](option);
        }
    }),
    AddrFloatGroupModel: Backbone.Model.extend({
        defaults: {
            'GroupName': '',
            'GroupId': ''
        },
        clear: function () {
            this.destroy();
        },
        Action: function (name, option) {
            this.Controller[name + 'Atcion'](option);
        }
    }),
    AddrSelectedModel: Backbone.Model.extend({
        defaults: {
            'Selected': []
        },
        clear: function () {
            this.destroy();
        },
        Action: function (name, option) {
            this.Controller[name + 'Atcion'](option);
        }
    })
});


