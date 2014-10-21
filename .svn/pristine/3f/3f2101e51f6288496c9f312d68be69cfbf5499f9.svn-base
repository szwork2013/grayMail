
(function ($, _, M139, top) {

    var className = "M2012.Calendar.View.MainView";

    /**
     * 日历月/列表等三大视图
    **/
    M139.namespace(className, Backbone.View.extend({

        name: className,
        el: "#viewpage_main",
        logger: new M139.Logger({ name: className }),

        /**
         * 添加一个视图，需要在这里注册包地址，并且在视图包中自启动并，监听 VIEW_CREATED, 完成视图填充后回调 args.onshow();
         */
        viewmap: {
            day: { url: '/calendar/cal_index_dayview_async.html.pack.js' },
            list: { url: '/calendar/cal_index_listview_async.html.pack.js' },
            timeline: { url: '/calendar/cal_view_timeline.html.pack.js' }
        },

        /**
         * 构造函数      
        **/
        initialize: function (options) {
            Backbone.View.prototype.initialize.apply(this, arguments);

            var self = this;

            //控制器
            self.master = options.master;
            self.initEvents(self.master);

            //先拉起月视图
            var monthdiv = self.$el.find("#subview_content_month");
            $.extend(options, {
                container: monthdiv
            });
            self.views = new Backbone.Collection();
            self.monthView = new M2012.Calendar.View.Month(options);
            self.createView({
                view: "month"
            }, monthdiv);
            self.toolView = new M2012.Calendar.View.TopNaviBar(options);

            return self;
        },


        initEvents: function (master) {
            var self = this;
            var EVENTS = master.EVENTS;

            //监听日历标签加载初始化后，刷新月视图，可以用于添加日历标签后，刷新主视图
            master.on(EVENTS.LABEL_INIT, function () {
                master.off(EVENTS.LABEL_INIT, arguments.callee);
                var dat = master.toJSON();
                var viewflag = dat.view_range_flag;
                //刷新日视图
                if (dat.view_range_flag == "month") {
                    self.master.trigger(self.master.EVENTS.NAVIGATE, {
                        path: "mainview/month"
                    });
                }
            });

            //响应视图显示逻辑
            master.on(EVENTS.VIEW_SHOW, function (viewInfo) { //{ name: name, container: viewObj, args: args });
                if (viewInfo.name === 'main') {
                    //self.logger.debug('mainview showing...', viewInfo);
                    var subview = viewInfo.args.subview;

                    var model = self.master.toJSON();
                    var param = {
                        view: subview, // month|day|list
                        year: model.year,
                        month: model.month,
                        day: model.day
                    };

                    // lichao修改,如果设置了view_range_flag属性,则表示进入了主视图界面
                    self.master.set("view_location", { isMainView: true, view: subview }); // 为true表示是当前页面是主视图
                    //更新视图（日月表）控制量
                    self.master.set({ view_range_flag: subview });

                    if (viewInfo.status === "change:args" || viewInfo.status === "change:visible") {
                        self.master.trigger('mainview:change', param);
                    }
                }
            });

            //主视图切换处理函数 args.view: "month" | "day" | "list"
            master.on('mainview:change', function (args) {

                //从视图缓存集中获取视图，如果没有则异步加载
                var viewInfo = self.views.get(args.view);

                if (viewInfo) {
                    self.render(args);

                } else {
                    var url = self.viewmap[args.view].url;
                    var loadArgs = {
                        id: "mainview_" + args.view + "_pack",
                        src: top.getDomain('resource') + '/m2012/js/packs' + url + '?sid=' + top.sid
                    };
                    M139.core.utilCreateScriptTag(loadArgs, function () {
                        var el = $('<div id="subview_content_'
                            + args.view + '" class="ad-list-div js_subviewpage"></div>');
                        $('#viewpage_main').append(el);

                        self.createView(args, el);
                    });
                }
            });
        },

        createView: function (args, container) {
            var self = this;
            var master = self.master;
            var EVENTS = master.EVENTS;
            master.trigger(EVENTS.VIEW_CREATED, {
                name: args.view,
                container: container,
                params: {},
                onshow: function (showargs) {
                    var newView = new Backbone.Model({
                        id: args.view,
                        instance: self.monthView,
                        visible: true,
                        container: container
                    });
                    self.views.add(newView);
                    self.render(args);
                }
            });

            master.trigger(EVENTS.VIEW_SHOW, {
                name: "mainview",
                container: container,
                args: { subview: args.view }
            });
        },



        //呈现视图
        render: function (args) {
            var self = this;
            //self.logger.debug(args);
            self.views.each(function (i) {
                i.set({ visible: false });
                i.get('container').hide();
            });

            var currView = self.views.get(args.view);
            currView.get('container').show();
            //self.logger.debug(args.view, '视图切换中');
        }
    }));

    $(function () {
        window.$Cal.mainview = new M2012.Calendar.View.MainView({
            master: window.$Cal
        });
    });

}(jQuery, _, M139, window._top || window.top));
