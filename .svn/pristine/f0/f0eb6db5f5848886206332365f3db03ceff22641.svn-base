(function ($, _, M139, top) {

    var _class = "M2012.Calendar.Router";
    M139.namespace(_class, Backbone.Router.extend({

        logger: new M139.Logger({ name: _class }),

        routes: {
            //http://localhost/#/mod/month-0/2014/3/3
            //http://localhost/#/mod/discovery-1
            //http://localhost/#/mod/activity-30

            "mod/:view-:state-:type": "loadView",
            "mod/:view-:label/:year/:month/:day": "renderView",

            "mainview": "backmainview", //不论状态，只要显示主视图
            "mainview/refresh": "refreshmainview", //主视图保持状态重载一次,只需要刷新日月列表视图时用到该方法
            "view/update": "updateview", // 左侧导航栏中快捷添加活动,需要改变主区域时用到(主区域包括主视图和非主视图)
            "mainview/:view": "mainView", //不传年月日,给toolbar里面的年月日按钮用

            "mod/:view": "pageView",

            //通过:view来区分页面，统一参数接入,统一简洁处理参数,优化过程逻辑 [其实可以把page也放到json字符串里面]
            //参数统一通过json字符串传递,可使用CommonAPI.Utils.convertToUrlParams方法格式化json
            //添加活动 #mod/detail/{action:"add","id":randomId} /* 带数据的添加活动 */
            //添加活动 #mod/detail/   /* 全新创建,如果需要刷新,参考上面的方法,加个随机数即可 */
            "mod/:view/*params": "pageView",
            //视图返回
            "view/back": "back"
        },

        //用于记录历史路径访问路径，记录最近10条记录
        _histories: [],

        initialize: function (options) {
            var self = this;
            Backbone.Router.prototype.initialize.apply(self, arguments);
            self.master = options.master;
            self.viewmanager = new M2012.Calendar.View.ViewManager({
                master: self.master
            });
        },

        /**
         * 导航到指定视图
         */
        navigateTo: function (path, args) {
            var self = this;
            //不记录视图刷新、更新和回退等路由信息
            if (!/\/(update|back)$/.test(path)) {
                self._histories.push(path);
                //只保留最新的10个路由访问记录
                if (self._histories.length > 10)
                    self._histories.splice(0, self._histories.length - 10);
            }
            self.navigate(path, args);
        },

        loadView: function (view, state, type) {
            var self = this;
            var master = self.master;
            var manager = self.viewmanager;
            var EVENTS = master.EVENTS;
            type = Number(type);

            // self.logger.debug("loadView|view=%s|state=%s|type=%s", view, state, type);

            self.master.set({
                includeTypes: [type],
                curr_view_name: view,
                curr_view_state: state
            });

            //隐藏所有的活动弹出层
            master.trigger(EVENTS.HIDE_ACTIVITY_POPS);

            if (view === "month") { //兼容跳回月视图的返回
                self.mainView(view);
                return;
            }

            manager.show(view, {
                params: {
                    state: state,
                    type: type
                }
            });

            // 如果非主视图,定义标记符,lichao新增
            self.master.set("view_location", {
                isMainView: false, // 表示是否为主视图的标记,为true表示是当前页面是主视图
                view: view,
                state: state,
                type: type
            });

        },

        mainView: function (view) {
            var self = this;
            var master = self.master;
            var manager = self.viewmanager;
            var EVENTS = master.EVENTS;

            master.trigger(EVENTS.HIDE_ACTIVITY_POPS); //隐藏所有的活动弹出层

            if (view === "render" || view == "back") {
                view = master.get("view_range_flag");
            }

            //调用视图管理器显示相应的视图
            manager.show('main', {
                subview: view
            });
        },

        /**
         * 不指定状态与视图类型，只是回到主视图最后的状态
         */
        backmainview: function () {
            var self = this;
            self.viewmanager.show("main", {
                subview: self.master.get("view_range_flag"),
                silent: true //该参数会传递到具体视图中的show事件中，可以根据该参数决定是否要刷新视图,silent为true表示无需重新刷新视图
            });
        },

        refreshmainview: function () {
            var self = this;
            self.viewmanager.show("main", {
                subview: self.master.get("view_range_flag")
            });
        },
        /**
         * 左侧菜单栏中,如果做了任何操作,需要刷新主页面时,会调用该方法
         * 分三种情况1:当前视图为主视图 2.当前视图非主视图,为新的DIV界面 3.当前视图为iframe界面
         */
        updateview: function () {
            var self = this,
                viewObj = self.master.get("view_location"),
                master = self.master,
                manager = self.viewmanager,
                events = master.EVENTS;
            if (viewObj) {
                if (viewObj.isFramePage) {
                    // 表示从老的页面迁移过来没做任何修改的页面,iframe界面
                    manager.show(viewObj.view, $.extend(viewObj.params, { r: Math.random() }));
                    return;
                }

                if (viewObj.isMainView) {
                    // 表示主视图(包括日,周,月,列表视图)
                    manager.show('main', {
                        subview: viewObj.view
                    });
                } else {
                    // 表示当前页面非主视图,比如查看,等等
                    var view = viewObj.view;

                    manager.show(view, {
                        params: {
                            state: viewObj.state,
                            type: viewObj.type
                        }
                    });

                }
            }
        },
        renderView: function (view, label, year, month, day) {
            var self = this;
            var master = self.master;
            var manager = self.viewmanager;
            var EVENTS = master.EVENTS;

            //简单容错
            label = label || master.get("labels").join(",");
            year = year || master.get("year");
            month = month || master.get("month");
            day = day || master.get("day");

            //self.logger.debug("renderView|view=%s|label=%s|%s-%s-%s", view, label, year, month, day);

            //隐藏所有的活动弹出层
            master.trigger(EVENTS.HIDE_ACTIVITY_POPS);

            //label没变，只是日期或者视图变化
            if (label !== "0") {
                var labels = label.split(',');
                master.set({
                    year: Number(year),
                    month: Number(month),
                    day: Number(day),
                    labels: labels
                });
                return;
            }

            if (view === "month") { //兼容跳回月视图的返回

                var viewParam = {
                    year: year,
                    month: month,
                    day: day
                };

                master.set(viewParam, { silent: false });
                self.mainView(view);
                return;
            }

            //调用视图管理器显示相应的视图
            manager.show(view, {
                label: label,
                year: year,
                month: month,
                day: day
            });

        },


        pageView: function (view, params) {
            var self = this;
            var master = self.master;
            var manager = self.viewmanager;
            var EVENTS = master.EVENTS;

            try {
                //尝试解码,但是传递进来的却没有编码.所以加try.否则搜索%1这样的内容会报错
                params = decodeURIComponent(params || '');
            } catch (e) { }

            //self.logger.debug("pageView|view=%s|param=%s", view, params);

            //隐藏所有的活动弹出层
            master.trigger(EVENTS.HIDE_ACTIVITY_POPS);
            params = params && M2012.Calendar.CommonAPI.Utils.convertBackUrlParams(params) || {};
            // lichao新增,如果是老页面的话,标记isFramePage为true
            master.set("view_location", { isFramePage: true, params: params, view: view }); // 老页面标志符,传递了isFramePage,就需要传递params
            manager.show(view, $.extend(params, { r: Math.random() })); //产品要求刷新页面,加个随机数
        },

        /**
         * 返回
         */
        back: function (view, params) {
            var self = this;

            if (!self._histories.length)
                return;

            //再移除当前视图所对应路由
            var currPath = self._histories.pop();
            //上一路由
            var path = self._histories.pop();
            //判断与当前路由相邻的路由是否重复，重复则移除
            //todo这个放在路由进来或回退时处理都可以，需要思考下哪里处理更好，目前先放这里
            while (true) {
                if (currPath !== path)
                    break;
                if (self._histories.length == 0)
                    break;
                path = self._histories.pop();
            }

            //导航到上级路由
            self.navigateTo(path, { replace: true, trigger: true, isBack: true });
        }
    }));

})(jQuery, _, M139, window._top || window.top);
