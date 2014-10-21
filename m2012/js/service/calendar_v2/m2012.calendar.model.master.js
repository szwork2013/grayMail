/// <reference path="component/m2012.calendar.calendarview.js" />
;
(function ($, _, M139, top) {

    var _super = M139.Model.ModelBase;
    var _class = "M2012.Calendar.Model.Master";
    var commonApi = new M2012.Calendar.CommonAPI(),
        utils = M2012.Calendar.CommonAPI.Utils;

    M139.namespace(_class, _super.extend({

        name: _class,

        defaults: {

            // 视图控制量：标签的勾选类型， 日历菜单 mylabel | 生日提醒 birth | 订阅日历 subscribe
            view_filter_flag: 'mylabel',

            // 视图控制量：主视图的时段形态， 月视图 month | 今明后-列表 list | 单日 day
            view_range_flag: 'month',

            //定位当前视图，主要用于记录当前展示具体视图
            view_location: "",

            sid: $Url.queryString("sid"),

            //详细日历编辑数据，用于详细创建、编辑日历时的数据传递
            edit_label_data: null,

            //详细活动编辑数据，用于详细创建、编辑活动时的数据传递
            edit_detail_data: null,

            //活动任务编号
            //此字段主要是用于外部模块调用日历创建活动的标示
            add_activity_task: null,

            //日历主视图是否首次加载完成
            first_load_completed: false,

            msg_changed_flag: false, //未读消息数变动

            contact_res_Loaded: false //是否已经加载了通讯录相关脚本资源
        },

        capi: commonApi,

        EVENTS: {
            REDIRECT: "master#linkshow:redirect",
            LOAD_MODULE: "master#linkshow:loadmodule",
            //刷新当前主视图，只是刷新数据并不呈现该视图
            REFRESH_VIEW_MAIN: "master#currentmainview:reload",
            //月视图显示更多
            LOAD_MONTH_MORELIST: "master#month_morelist:load",
            //初始化控件值
            INIT: "master#component:init",

            //添加日历
            ADD_LABEL: "master#label:add",
            EDIT_LABEL: "master#label:edit",
            //展示发现广场
            SHOW_DISCOVERY: "master#iscovery:show",

            CAL_DATA_INIT: "master:initdata",
            NAVIGATE: "master:navigate",
            REQUIRE_API: "master:requireapi",

            VIEW_CREATED: "master:viewcreated",
            VIEW_SHOW: "master:viewshow",
            TOGGLELABEL: 'master:togglelabel',

            //隐藏所有的活动弹出层
            HIDE_ACTIVITY_POPS: "activity:hideactivitypop",
            LOAD_ACTIVITY_VIEW: "activity:view",
            VIEW_POP_ACTIVILY: "activity:popview", //活动冒泡预览
            ADD_POP_ACTIVILY: "activity:popadd",
            ADD_ACTIVITY: "activity:add",
            EDIT_ACTIVITY: "activity:edit",
            SHARE_ACTIVITY: "activity:share",

            EDIT_GROUP_ACTIVITY: "activity:editgroup",

            LABEL_INIT: "label:init",
            LABEL_ADDED: "label:add",
            LABEL_CHANGE: "label:edit",
            LABEL_REMOVE: "label:remove",

            MSG_RECEVIE: "master:msgreceive",

            SEARCH_POPUP: "search:popup",

            //黑白名单弹窗
            BLACKLIST_POPUP: "blacklist:popup",
            WHITELIST_POPUP: "whitelist:popup"
        },

        initialize: function (options) {
            _super.prototype.initialize.apply(this, arguments);

            var _this = this;
            _this.api = M2012.Calendar.API;
            //系统常量
            _this.CONST = M2012.Calendar.Constant;

            //注册非冲突写法
            M2012.Calendar.Model.getInstance = function (args) {
                if (args && _.isFunction(args.callback)) {
                    args.callback(_this);
                }
            };

            _this.bindRouter(options);
            _this.bindEvent(options);
            _this.bindData(options);
            _this.render();
        },

        bindRouter: function (options) {
            var _this = this;
            var EVENTS = _this.EVENTS;

            //路由注册
            var addrRouter = new M2012.Calendar.Router({
                master: _this
            });

            _this.on(EVENTS.NAVIGATE, function (args) {
                var newFragment = (args.path || '').replace(/^[#\/]/, '');
                if (Backbone.history.fragment === newFragment) {
                    // 新增判断,如果前后两次路由的path一样,则要重启history,否则路由匹配的事件不会再触发
                    _this.logger.debug("-------The newFragment not change, history need restart!!!!-------");
                    Backbone.history.stop();
                    //(M139.Browser.getVersion() <= 7 && M139.Browser.is.ie) ? Backbone.history.start({ iframesrc: '../blank.html' }) : Backbone.history.start();
                    Backbone.history.start({ iframesrc: '../blank.html' });
                }
                addrRouter.navigateTo(args.path, { replace: true, trigger: true });

            });

            //路由导航的示例
            //master.trigger("navigate", {
            //    path: "mod/month-0/2014/3/8"
            //})

            //跳转路由完成实例后，启动历史记录。
            /**
            if (M139.Browser.getVersion() <= 7 && M139.Browser.is.ie) {
                Backbone.history.start({ iframesrc: '../blank.html' });
            } else {
                Backbone.history.start({ iframesrc: '../blank.html' });
                //Backbone.history.start();
            }*/

            Backbone.history.start({ iframesrc: '../blank.html' });
        },

        bindData: function (options) {
            var _this = this;

            var now = _this.capi.Today;
            _this.set({ year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() }, { silent: true });
            _this.logger.debug("init now %s", now);
        },

        bindEvent: function () {
            var _this = this;
            var EVENTS = _this.EVENTS;

            $(window).on('unload', function () {
                _this.dispose();
            });

            //此事件主要用于监听左侧日历标签筛选
            _this.on("change:view_filter_flag", function (master, value) {
                var STYPE = _this.CONST.specialType;
                var shouldLoadView = false;
                _this.set({
                    includeTypes: value === "birth" ? [STYPE.birth] : []
                });
                //如果是群日历
                // 1、显示添加群活动按钮
                // 2、列表视图变成时间轴视图
                if (value == "group") {
                    var view = master.get("view_location").view;
                    //当主视图为列表视图而当前选择的日历标签为群日历时
                    //需要导航到月视图
                    if (view == "list")
                        shouldLoadView = true;

                    //左侧顶部创建活动按钮切换
                    $("#createGroupBtn").removeClass("hide");
                    $("#createBtn").addClass("hide");
                    //时间轴、列表视图切换
                    $(".js_item_list").addClass("hide");
                    $(".js_item_timeline").removeClass("hide");

                } else {
                    var view = master.get("view_location").view;
                    //当主视图为时间轴而当前选择的日历标签不为群日历时
                    //需要导航到月视图
                    if (view == "timeline")
                        shouldLoadView = true;

                    //左侧顶部创建活动按钮切换
                    $("#createGroupBtn").addClass("hide");
                    $("#createBtn").removeClass("hide");
                    //时间轴、列表视图切换
                    $(".js_item_list").removeClass("hide");
                    $(".js_item_timeline").addClass("hide");
                }
                if (shouldLoadView)
                    master.trigger(master.EVENTS.NAVIGATE, { path: "mainview/month" });
            });

            //当前年月日变化触发
            _this.on("change:year change:month change:labels", function () {

                if (_this.changeTimer) {
                    window.clearTimeout(_this.changeTimer);
                }
                _this.changeTimer = window.setTimeout(function () {

                    //当前视图不为主视图时我们采取刷新隐藏在背后的主视图
                    //这样主要是解决从从视图返回到主视图后的数据呈不现一致问题
                    _this.trigger(_this.EVENTS.REFRESH_VIEW_MAIN);

                }, 0xff);

            });

            //主视图首次加载完毕后需要判断是否有外部调用
            //然后导向指定的视图
            _this.on("change:first_load_completed", function () {
                _this.redirect();
            });

            //获得主控API实例
            _this.on(EVENTS.REQUIRE_API, function (args) {
                if (_.isFunction(args.success)) {
                    args.success(_this.api);
                }
            });

            //加载日历初始化数据，并缓存
            _this.on(EVENTS.CAL_DATA_INIT, function (args) {
                if (_.isUndefined(args)) {
                    args = {};
                }

                if (!args.isRefresh) {
                    var initData = _this.get("initData");
                    if (initData) {
                        return args.success(initData);
                    }
                }

                _this.api.initCalendar({
                    data: {},
                    success: function (result) {
                        if (result.code == "S_OK") {
                            _this.set({ initData: result['var'] }, { silent: true });

                            args.success(result);
                        } else {
                            if (_.isFunction(args.error)) {
                                args.error(result);
                            }
                        }
                    },
                    error: function () { }
                });
            });

            //当前视图不为主视图时我们才去刷新隐藏在背后的主视图
            //这样主要是保证从其他视图返回到主视图后的数据呈现一致
            _this.on(_this.EVENTS.REFRESH_VIEW_MAIN, function () {
                if (!_this.isMainView()) {
                    var viewModel = $.grep(_this.mainview.views.models, function (model, i) {
                        return model.get("id") == _this.get("view_range_flag");
                    });
                    if (viewModel && viewModel.length > 0) {
                        _this.trigger(_this.EVENTS.VIEW_SHOW, {
                            name: "mainview",
                            container: viewModel[0].get("container"),
                            args: { subview: viewModel[0].get("id") }
                        });
                    }
                }

            });


            //在第一次加载日历标签时，静默存储checklabels为，真实的日历标签
            _this.on("change:labelData", function (model, value, changes) {
                var labels = _this.get("labels");

                var arr1 = _.map(value.sysLabels, function (i) {
                    i.isSystemLabel = true;
                    return i;
                });

                arr1 = arr1.concat(_.map(value.userLabels, function (i) {
                    i.isUserLabel = true;
                    return i;
                }));

                arr1 = arr1.concat(_.map(value.shareLabels, function (i) {
                    i.isShareLabel = true;
                    return i;
                }));

                var arr2 = arr1.concat(_.map(value.subscribedLabels, function (i) {
                    i.isSubscribe = true;
                    return i;
                }));
                var arr3 = _.map(value.groupLabels, function (i) {
                    i.isGroup = true;
                    return i;
                })

                arr2 = arr2.concat(arr3);

                arr1 = _.map(arr1, function (i) {
                    return i.seqNo;
                });
                arr3 = _.map(arr3, function (i) {
                    return i.seqNo;
                });

                var isGroup = _this.get("view_filter_flag") === "group";
                var checkLabels = isGroup ? arr3 : arr1;
                //建立日历标签的数组，注意服务端返回的，每个数组元素属性不一样。
                //注意：labelArray是实体组，checklabels 是序列ID数组
                _this.set({
                    labelArray: arr2,
                    checklabels: checkLabels,
                    mychecklabels: _.clone(checkLabels)
                }, { silent: true });
                _this.trigger(EVENTS.LABEL_INIT, { checklabels: checkLabels });
            });

            /**
             *  快捷查看活动详情
             *  @param {Number} args.seqNo   活动Id
             *  @param {Number} args.type    活动类型
             *  @param {Number} args.target  目标源，主要用于定位弹出框位置，鼠标事件对象event为空时该参数不应为空 (可选)
             *  @param {Object} args.event   事件数据，当其值不为空时优先以鼠标坐标定位  (可选)
             *  @param {Object} args.rect    目标源坐标信息，有时候无法获取到准确的信息所以需要传入  (可选)
             *  @param {Object} args.callback 弹出框和页面通信的回调函数
             */
            _this.on(EVENTS.VIEW_POP_ACTIVILY, function (args) {
                args = args || {};

                _this.getCalendar({
                    seqNo: args.seqNo,
                    type: args.type,
                    success: function (data) {
                        var func = function () {
                            //打开详情展示框
                            new M2012.Calendar.View.ActivityDetailPopup({
                                target: args.target,
                                event: args.event,
                                rect: args.rect,
                                master: _this,
                                data: data,
                                callback: args.callback
                            }).show();
                            args.success && args.success(data);
                        };
                        if (!_.isUndefined(M2012.Calendar.View.ActivityDetailPopup)) {
                            func();
                            return;
                        }
                        M139.core.utilCreateScriptTag({
                            id: "viewActivityPopPack",
                            src: top.getDomain('resource') + '/m2012/js/packs/calendar/cal_pop_activity_async.html.pack.js',
                            charset: "utf-8"
                        }, function () {
                            func();
                        });
                    },
                    error: function (msg) {
                        var msg = "操作失败，请稍后再试";
                        args.error && args.error(msg);
                        _this.logger.error(msg);
                    }
                });

            });


            /**
             *  日历视图上快捷添加动详情
             *  @param {Object} args.target   //触发源和事件源，用于定位弹出框位置 (target、event两参数至少要一项)
             *  @param {Object} args.event    //触发事件携带数据，如果该参数存在，则弹出框以鼠标位置定位。
             *  @param {Object} args.date     //指定创建活动的日期
             *  @param {Object} args.time     //指定创建活动的时分
             *  @param {Object} args.isFullDayEvent //是否是全天活动
             *  @param {Object} args.master   //视图主控
             *  @param {Object} args.callback //弹出框和调用方的通信回调函数             
             */
            _this.on(EVENTS.ADD_POP_ACTIVILY, function (args) {
                _this.capi.addBehavior("calendar_addmonthpopact_click");

                //如果当前是在群日历视图添加活动
                //则需要判断是否存在自己创建的群日历标签
                //如果自己没有创建过标签，则需要引导至新增群日历视图
                if (_this.get("view_filter_flag") === "group") {
                    var groupLabels = _this.getGroupLabels(true);
                    if (!groupLabels || !groupLabels.length) {
                        _this.trigger(EVENTS.NAVIGATE, { path: "mod/grouplabel" });
                        return;
                    }
                }
                if (_.isUndefined(M2012.Calendar.View.ActivityAddPopup)) {
                    M139.core.utilCreateScriptTag({
                        id: "addPopActivitypack",
                        src: top.getDomain('resource') + '/m2012/js/packs/calendar/cal_pop_activity_async.html.pack.js',
                        charset: "utf-8"
                    }, function () {
                        new M2012.Calendar.View.ActivityAddPopup(args).show();
                    });
                    return;
                }
                new M2012.Calendar.View.ActivityAddPopup(args).show();
            });

            /**
             *  创建日历标签
            **/
            _this.on(EVENTS.ADD_LABEL, function (data) {
                _this.trigger(EVENTS.EDIT_LABEL, data);
            });

            /**
             * 编辑日历标签
             * @param {Number} args.labelId     //日历ID
             * @param {Boolean} args.isShared   //是否共享日历
             * @param {Boolean} args.isSubscribed //是否共享日历
             * @param {Boolean} args.isGroup 群组日历
            **/
            _this.on(EVENTS.EDIT_LABEL, function (data) {
                //数据存入
                data = data || {};
                var path = "mod/label";
                //如果是共享日历则跳转到共享日历编辑视图
                if (!_.isUndefined(data.isShared) && data.isShared) {
                    path = "mod/sharelabel";
                    delete data.isShared;
                }
                //如果是订阅日历则也跳转到共享日历编辑视图
                if (!_.isUndefined(data.isSubscribed) && data.isSubscribed) {
                    path = "mod/sharelabel";
                    delete data.isSubscribed;
                }
                if (!_.isUndefined(data.isGroup) && data.isGroup) {
                    path = "mod/grouplabel";
                    delete data.isGroup;
                }
                //将字符串形式的数字转换成数字
                if (data.labelId && !_.isNumber(data.labelId)) {
                    data.labelId = Number(data.labelId);
                }
                _this.set({ "edit_label_data": data });
                _this.trigger(EVENTS.NAVIGATE, { path: path });
            });

            /**
             * 打开创建活动详情页,数据结构同活动信息实体
             * @param {Number} args.seqNo   //活动ID
             * @param {String} args.title   //活动标题
             * @param {Date}   args.dStart 开始日期，格式为 yyyy-MM-dd
             * @param {Int}    args.beforeTime 提前的时间单位，如15
             * @param {Int}    args.beforeType {Int} 提前的时间类型，如0 表示分钟,详见接口文档
             * @param {String Or Date} startTime 开始时间，如果是字符串形式格式为 yyyy-MM-dd hh:mm
             * @param {String Or Date} 结束时间，如果是字符串形式格式为 yyyy-MM-dd hh:mm
             */
            _this.on(EVENTS.ADD_ACTIVITY, function (data) {
                _this.trigger(EVENTS.EDIT_ACTIVITY, data);
            });

            /**
             * 打开编辑活动详情页
             * @param {Object} data        //参数对象
             * @param {Int}    data.seqNo  //活动Id,必填
             * @param {Int}    data.type   //类型：
             */
            _this.on(EVENTS.EDIT_ACTIVITY, function (data) {
                data = data || {};
                //将字符串形式的数字转换成数字
                if (data.seqNo && !_.isNumber(data.seqNo)) {
                    data.seqNo = Number(data.seqNo);
                }
                //数据存入
                _this.set({ "edit_detail_data": data });
                var path = "mod/detail";
                //邀请、共享或订阅活动处理
                if (data && data.type) {
                    //邀请、共享活动
                    if ((data.type === 1 || data.type === 2))
                        path = "mod/invite_share_act";
                        //订阅活动
                    else if (data.type == 3)
                        path = "mod/subsc_act";
                    else if (data.type == 4) {
                        _this.trigger(EVENTS.EDIT_GROUP_ACTIVITY, data);
                        return;
                    }
                }
                _this.trigger(EVENTS.NAVIGATE, {
                    path: path
                });
            });

            /**
             * 如果需要编辑某条群活动,只需要传入seqNo即可
             * @param seqNo {Int} 需要编辑的群活动ID
             * 
             * 如果是快捷创建的详细编辑
             * @param title {String} 群活动主题
             * @param dtStart {String} 开始时间,注意格式
             * @param dtEnd {String} 结束时间, 如果传递了开始时间,必须传入结束时间,可以是一样的值
             * @param enable {Boolean} 是否提醒,固定是短信提醒
             */
            _this.on(EVENTS.EDIT_GROUP_ACTIVITY, function (data) {
                //数据存入
                _this.set({ "edit_group_data": data });
                var path = "mod/groupactivity";

                _this.trigger(EVENTS.NAVIGATE, {
                    path: path
                });
            });

            _this.on(EVENTS.SEARCH_POPUP, function (data) {
                if (_.isUndefined(M2012.Calendar.View) || _.isUndefined(M2012.Calendar.View.Search)) {
                    M139.core.utilCreateScriptTag({     //异步加载处理日历tip中接受和拒绝的message model
                        scriptId: "m139_calendar_search_dialog_js",
                        src: "/m2012/js/packs/calendar/cal_index_async.html.pack.js"
                    }, function () {
                        new M2012.Calendar.View.Dialog.Search();
                    });
                } else {
                    new M2012.Calendar.View.Dialog.Search();
                }
            });

            //日历黑白名单
            _this.on(EVENTS.WHITELIST_POPUP, function () {

                //TODO 有没有统一的命名空间和js对应的config啊,每次都要这样load
                if (_.isUndefined(M2012.Calendar.View) || _.isUndefined(M2012.Calendar.View.BlackWhiteList)) {
                    _this.loadJsResAsync({
                        id: "labelpop",
                        url: "/calendar/cal_index_addLabel_async.html.pack.js",
                        useContact: true,
                        onload: function () {
                            new M2012.Calendar.View.BlackWhiteList({ master: window.$Cal });
                        }
                    });

                } else {
                    new M2012.Calendar.View.BlackWhiteList({ master: window.$Cal });
                }
            });

            /**
             * 分享活动,快速唤起发邮件弹框
             */
            var tplShare = $("#tplShare").html(), //模板在cal_index.html页面中
                template = _.template(tplShare);
            _this.on(EVENTS.SHARE_ACTIVITY, function (data) {
                //加上开始时间格式化后的字符串
                var item = $.extend(_.clone(data), { dateTitle: $Date.format("yyyy年MM月dd日", $Date.parse(data.dtStart) || new Date()) });
                top.$Evocation.create({
                    type: 1, //邮件
                    subject: "139邮箱日历分享：" + item.title, //主题,填到input,不需要编码
                    content: template(item), //内容
                    isEdit: false, //不可编辑
                    showZoomSize: false, //不显示放大缩小
                    beforeSend: function (info, evoModel) { //覆盖掉发送按钮功能
                        //调用自己的发件接口
                        _this.api.shareCalendar({
                            data: {
                                seqNo: data.seqNo,
                                to: info.email
                            },
                            success: function (responseData, responseText) {
                                if (responseData && responseData.code == "S_OK") { //为什么写的到处是S_OK呢?
                                    evoModel && evoModel.letterSuccess && evoModel.letterSuccess();
                                } else {
                                    top.M139.UI.TipMessage.hide(); //先关掉其他的,否则可能因为delay不一致,导致显示问题
                                    top.M139.UI.TipMessage.show("发送失败，请稍后重试", { delay: 2000, className: "msgRed" });
                                    _this.logger.error(responseText);
                                }
                            }
                        });

                        return false;
                    }
                });
            });

            //统一位置的搜索
            top.$App.off("calendarSearch").on("calendarSearch", function (data) {
                data = data || {};
                var EVENTS = _this.EVENTS;
                if (!!data.keyword) {
                    _this.trigger(EVENTS.NAVIGATE, {
                        path: 'mod/search/search-' + encodeURIComponent(data.keyword)
                    });
                }
            });

        },

        render: function () {
            var _this = this;
            //加载黄历
            new M2012.Calendar.View.AboutToday({
                master: _this
            });
        },

        /**
         * 判断当前时视图是不是在主视图
         */
        isMainView: function () {
            var _this = this;
            var viewObj = _this.get("view_location");

            return viewObj && viewObj.isMainView;
        },

        /**
         *  异步加载脚本资源
         *  @param {String}    args.id          //资源名称
         *  @param {String}    args.url         //脚本资源地址
         *  @param {String}    args.useContact  //是否使用通讯录相关业务
         *  @param {Function}  args.onload      //脚本加载成功后的处理函数
       **/
        loadJsResAsync: function (args) {
            var _this = this;
            args = args || {};

            (function (func) {
                //如果需要加载通讯录脚本则优先加载该脚本
                if (args.useContact && !_this.get("contact_res_Loaded")) {
                    M139.core.utilCreateScriptTag({
                        id: "add_contactcomp_pack",
                        src: top.getDomain('resource') + '/m2012/js/packs/calendar/cal_contactcomp.html.pack.js?sid=' + top.sid,
                        charset: "utf-8"
                    }, function () {
                        //设置通讯录资源已经加载标示
                        _this.set({ contact_res_Loaded: true });
                        func();
                    });
                    return;
                }
                func();

            })(function () {
                //异步下载js
                //todo 该方法在IE6下异步加载GZIP压缩过的JS会出现无法执行的情况，需要和运维协商修改服务器配置，
                M139.core.utilCreateScriptTag({
                    id: "add_" + args.id + "_pack",
                    src: top.getDomain('resource') + '/m2012/js/packs' + args.url + '?sid=' + top.sid,
                    charset: "utf-8"
                }, function () {
                    args.onload && args.onload();
                });
            });

        },

        /**
         * 获取用户的所有标签列表
        */
        getUserLabels: function () {
            var self = this;
            var labels = self.get("labelData");
            var defaultLables = {
                isSystemLabel: true,
                labelName: "我的日历",
                color: "#319eff",
                seqNo: 10
            };
            if (labels) {
                var sysLabels = _.isArray(labels.sysLabels) ? labels.sysLabels : [];
                var userLabels = _.isArray(labels.userLabels) ? labels.userLabels : [];
                var value = [].concat(sysLabels, userLabels);

                if (value.length > 0)
                    return value;
            }
            return [defaultLables];
        },

        /**
         * 获取群日历标签列表
         * @param {Boolean}  isOwner  //是否是自己创建的日历
         */
        getGroupLabels: function (isOwner) {
            var self = this;
            var labels = self.get("labelData") || {};
            if (!labels.groupLabels || !labels.groupLabels.length)
                return null;

            if (isOwner)
                return _.filter(labels.groupLabels, function (label) {
                    return label.isOwner == 1;
                });

            return labels.groupLabels;
        },

        /**
         * 判断一个日历是否是共享日历
         * @param {Number}  labelId  //日历ID
        **/
        isShareLabel: function (labelId) {
            var self = this;
            var data = self.get("labelData") || {};
            data = (data.userLabels || []).concat(data.groupLabels || []);
            var label = $.grep(data, function (n, i) {
                return n.seqNo == labelId;
            })
            if (label.length && (label[0].isShare || label[0].isGroup)) {
                return true;
            }
            return false;
        },

        /**
         * 获取活动详情
        */
        getCalendar: function (args) {
            var _this = this;
            _this.trigger(_this.EVENTS.REQUIRE_API, {
                success: function (api) {
                    api.getCalendar({
                        data: {
                            seqNo: args.seqNo,
                            type: args.type
                        },
                        success: function (result) {
                            if (result.code == "S_OK") {
                                args.success && args.success(result["var"]);
                            } else {
                                var msg = "获取活动详情失败 ERROR!";
                                args.error && args.error(msg);
                                _this.logger.error(msg, result);
                            }
                        },
                        error: function (e) {
                            var msg = "获取活动详情失败 ERROR";
                            args.error && args.error(msg + "：" + e);
                            _this.logger.error(msg);
                        }
                    });
                }
            });
        },

        /**
         * 页面重定向
         * 公开日历部分功能供其他模块调用
         * 调用方式： $App.show(key); key配置在全局变量window.LinkConfig中
        */
        redirect: function () {
            var _this = this;
            var EVENTS = _this.EVENTS;
            var value = $Url.queryString("redirect");
            var taskId = $Url.queryString("taskId");

            if (!value)
                return;

            //将任务id存储起来以便在对应模块处理
            if (taskId) {
                _this.set({
                    add_activity_task: {
                        name: value,
                        taskId: taskId
                    }
                });
            }

            switch (value) {
                case "addlabel":
                    _this.trigger(EVENTS.ADD_LABEL);
                    break;
                case "addact":
                    //活动id，为0则表示添加全新的活动
                    var seqNo = Number($Url.queryString("seqno"));
                    //标示当前添加活动的类型
                    //year:按年、month按月、day:按日 week:按周
                    var type = $Url.queryString("type") || "";
                    var pn = /^day|week|month|year$/i;
                    if (!pn.test(type)) {
                        if (!!seqNo) {
                            _this.trigger(EVENTS.EDIT_ACTIVITY, {
                                seqNo: seqNo,
                                type: 0
                            });
                        } else {
                            _this.trigger(EVENTS.ADD_ACTIVITY, {
                                title: decodeURI($Url.queryString("title") || ""),
                                content: decodeURI($Url.queryString("content") || "")
                            });
                        }
                        return;
                    }
                    var TEMPLATES = M2012.Calendar.Constant.scheduleTempMap;
                    var scheduleTemp = "";
                    switch (type.toLowerCase()) {
                        case "day":
                            scheduleTemp = TEMPLATES.dayTemp;
                            break;
                        case "week":
                            scheduleTemp = TEMPLATES.weekTemp;
                            break;
                        case "month":
                            scheduleTemp = TEMPLATES.monthTemp;
                            break;
                        case "year":
                            scheduleTemp = TEMPLATES.yearTemp;
                            break;
                    }
                    if (scheduleTemp) {
                        new M2012.Calendar.View.Popup.FastSchedule({
                            master: _this,
                            scheduleTemp: scheduleTemp
                        });
                    }
                    break;
                case "msg":
                    _this.trigger(EVENTS.NAVIGATE, { path: "mod/message" });
                    break;
                case "search":
                    var key = $Url.queryString("search");
                    top.$App.trigger("calendarSearch", { keyword: key });
                    break;
                case "discovery":
                    _this.trigger(EVENTS.SHOW_DISCOVERY);
                    break;
                case "labelmgr":
                    _this.trigger(EVENTS.NAVIGATE, { path: "mod/labelmgr" });
                    break;
                case "actview":
                    var id = Number($Url.queryString("id")),
                        isOwner = Number($Url.queryString('isowner')),
                        type = Number($Url.queryString("type"));

                    switch (type) {
                        case 1: // 邀请的活动
                        case 2: // 共享的活动
                        case 3: // 订阅的活动
                            //由于群组日历会修改type.所以123的类型先trigger
                            _this.trigger(EVENTS.EDIT_ACTIVITY, {
                                seqNo: id || 0,
                                type: type
                            });
                            break;
                        case 4: // 群组活动
                            if (!isOwner) {
                                type = 2; //如果是群组活动,并且非自己创建的,则跟共享的编辑页面相同
                            }

                            _this.trigger(EVENTS.EDIT_ACTIVITY, {
                                seqNo: id || 0,
                                type: type
                            });

                            break;
                        default:
                            break;
                    }

                    //if (type == 1) {
                    //    // 邀请的活动
                    //    _this.trigger(EVENTS.EDIT_ACTIVITY, {
                    //        seqNo: id || 0,
                    //        type: 1
                    //    });
                    //} else if (type == 2) {
                    //    // 共享的活动
                    //    _this.trigger(EVENTS.EDIT_ACTIVITY, {
                    //        seqNo: id || 0,
                    //        type: 2
                    //    });
                    //} else if (type == 3) {
                    //    // 订阅的活动                      
                    //    _this.trigger(EVENTS.EDIT_ACTIVITY, {
                    //        seqNo: id || 0,
                    //        type: 3
                    //    });
                    //}
                    break;
                case "addbirthact": // 从外部直接打开生日提醒快捷创建
                    new M2012.Calendar.Popup.View.Birthday({ master: _this });
                    break;
                case "viewlabel": // 从邮件中直接点击查看共享日历的链接
                    var labelId = $Url.queryString("id");
                    var isGroup = Number($Url.queryString('isgroup'));

                    if (!!isGroup) {
                        //群组日历跳转过来的,走共享日历流程,虽然于下面相同,但是保留分支,因为...分分钟需求会变
                        _this.trigger(EVENTS.EDIT_LABEL, {
                            labelId: labelId,
                            isShared: true //走共享日历分支
                        });
                    } else {
                        _this.trigger(EVENTS.EDIT_LABEL, {
                            labelId: labelId,
                            isShared: true
                        });
                    }
                    break;
            }
        },

        /**
         * 根据标签序列号，查询单个标签
         * @param seqNo
         * @returns {*}
         */
        getLabelBySeqNo: function (seqNo) {
            var _this = this;
            var labels = _this.get('labelArray');
            if (!labels.length) {
                return null;
            }
            for (var i = labels.length; i--;) {
                if (labels[i].seqNo == seqNo) {
                    return _.clone(labels[i]);
                }
            }
            return null;
        }
        , dispose: function () {

        }
    }));

    $(function () {
        window.$Cal = new M2012.Calendar.Model.Master();
    });

})(jQuery, _, M139, window._top || window.top);
