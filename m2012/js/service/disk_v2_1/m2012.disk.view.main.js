; (function ($, _, M139) {

    var superClass = M139.View.ViewBase;
    var _class = "M2012.Disk.View.Main";

    M139.namespace(_class, superClass.extend({

        name: _class,
        //当前视图名称
        viewName: "main",

        logger: new M139.Logger({ name: _class }),
        //视图主控
        master: null,
        //视图对应数据模型
        model: null,
        //当前视图父容器
        container: null,

        initialize: function (args) {
            var self = this;

            superClass.prototype.initialize.apply(self, arguments);
            self.master = args.master;
            self.initEvents();

            //注册页面创建事件
            //视图首次创建时触发
            self.master.bind(self.master.EVENTS.VIEW_CREATED, function (args) {
                if (args.name === self.viewName) {
                    self.master.unbind(self.master.EVENTS.VIEW_CREATED, arguments.callee);
                    self.container = args.container;

                    if ($.isFunction(args.onshow)) {
                        args.onshow();
                        $(window).resize(function () {
                            self.adjustHeight();
                        });
                    }
                }
            });

            //注册视图展示时触发事件
            //每次切换视图时都会触发，所以需要通过args.name来判断是不是切换到了当前视图
            self.master.bind(self.master.EVENTS.VIEW_SHOW, function (args) {
                if (args.name === self.viewName) {
                    self.container.empty();
                    self.model = new M2012.Disk.Model.Main({
                        master: self.master
                    });
                    self.initEvents();
                    self.render();
                    // 初始化页面数据
                    self.initData();
                }
            });
        },

        initEvents: function () {

        },

        initData: function () {

        },
        render: function () {
            var self = this;
            self.master.trigger(self.master.EVENTS.NAVIGATE, {
                path: "main/recycle"
            });
        },

        adjustHeight: function () { }

    }));

    $(function () {
        var master = window.$Disk;
        new M2012.Disk.View.Main({ master: master });
        //显示主视图
        master.trigger(master.EVENTS.MAINVIEW_SHOW);
    });

})(jQuery, _, M139);