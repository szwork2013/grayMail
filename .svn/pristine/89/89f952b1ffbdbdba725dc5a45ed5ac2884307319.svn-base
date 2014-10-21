; (function ($, _, M139) {

    var _super = M139.Model.ModelBase;
    var _class = "M2012.Disk.Model.Master";

    M139.namespace(_class, _super.extend({

        name: _class,
        defaults: {
            //列表视图展示方式
            // 1：列表 2：缩略图 3：时间轴
            list_view_type: 2
        },
        EVENTS: {
            VIEW_CREATED: "disk#view_created",
            VIEW_SHOW: "disk#view_show",
            NAVIGATE: "disk#navigate",
            MAINVIEW_SHOW: "disk#mainview_show",
            INIT: "disk#init",
            CHANGE: "disk#change",
            TIP_SHOW: "tip#show",
            TIP_HIDE: "tip#hide"
        },

        //视图管理对象
        viewMgr: null,
        //常用处理方法
        common: null,

        initialize: function (args) {
            var self = this;
            //初始化视图管理对象
            self.viewMgr = new M2012.Disk.View.ViewManager({ master: self });
            self.common = new M2012.Disk.Common();
            self.commApi = new M2012.Disk.CommApi();
            self.initEvents();
            return _super.prototype.initialize.apply(self, arguments);
        },

        initEvents: function () {
            var self = this;
            //首先创建并加载主视图
            self.on(self.EVENTS.MAINVIEW_SHOW, function (args) {
                self.viewMgr.createView("main");
            });
            //顶部显示提示信息
            self.on(self.EVENTS.TIP_SHOW, function (args) {
                if (!args)
                    return;

                var params = args.params || {};
                top.M139.UI.TipMessage.show(args.message, params);
            });
            //顶部提示信息隐藏
            self.on(self.EVENTS.TIP_HIDE, function (args) {
                top.M139.UI.TipMessage.hide();
            });


        }
    }));

    $(function () {
        window.$Disk = new M2012.Disk.Model.Master();
    });

})(jQuery, _, M139);