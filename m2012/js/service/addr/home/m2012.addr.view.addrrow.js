
(function ($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.AddrRow";
    if (window.ADDR_I18N) {
        var PageMsg = ADDR_I18N[ADDR_I18N.LocalName].home;
    }

    //这个视图会出现非常多实例，所以从基本视图承继，以提高性能
    M.namespace(_class, BackboneView.extend({

        name: _class,

        el: "body",

        logger: new M139.Logger({ name: _class }),

        initialize: function (options) {
            var _this = this;

            _this.initEvents();
            _this.render();
            superClass.prototype.initialize.apply(_this, arguments);
        },

        initEvents: function () {
            var _this = this;
        },

        render: function() {

        }

    }));

})(jQuery, _, M139);
