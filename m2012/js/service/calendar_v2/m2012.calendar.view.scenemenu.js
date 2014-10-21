
(function ($, _, M139, top) {

    var _super = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.SceneMenu";

    M139.namespace(_class, M139.View.ViewBase.extend({

        name: _class,

        el: "#pnlSceneMenu",

        logger: new M139.Logger({ name: _class }),

        defaults: [
            { cmd: 1, name: "会议邀请", ico: "meetIcon" }
            , { cmd: 2, name: "生日提醒", ico: "birthIcon" }
            , { cmd: 3, name: "按日提醒", ico: "dayIcon" }
            , { cmd: 4, name: "按周提醒", ico: "weekIcon" }
            , { cmd: 5, name: "按月提醒", ico: "monthIcon" }
            , { cmd: 6, name: "按年提醒", ico: "yearIcon" }
            , { cmd: 7, name: "倒计时", ico: "desIcon" }
        ],

        initialize: function (options) {
            var _this = this;

            _this.master = options.master;
            _this.btnCreate = _this.$el.find("#btnCreate");
            _this.btnExtend = _this.$el.find("#btnExtend");
            _this.pnlMenu = _this.$el.find("#pnlMenu");
            _this.template = _.template(_this.pnlMenu.find("script").html());

            _this.initEvents();
            _this.render();
            return _super.prototype.initialize.apply(_this, arguments);
        },

        hideMenu: function () {
            this.pnlMenu.hide();
        },

        initEvents: function () {
            var _this = this;
            _this.btnExtend.click(function (e) {
                //加一个标示，标示是点击打开了菜单
                _this.isMenuOpening = true;
                // 点击左侧栏创建按钮中的下拉图标,要记录行为日志
                _this.master.capi.addBehavior("calendar_addactbtndroplist_click");
                _this.pnlMenu.show();
               // e.stopPropagation();
            });

            $(document).click(function (e) {
                //当是打开菜单的点击时我们不处理
                if (!_this.isMenuOpening)
                    _this.pnlMenu.hide();
                _this.isMenuOpening = false;
            });

            _this.on("print", function () {
                _this.pnlMenu.html(_this.template(_this.defaults));

                _this.pnlMenu.find("a").click(function (e) {
                    var cmdValue = $(e.target).data("cmd");
                    var template = '',
                        TEMPLATES = M2012.Calendar.Constant.scheduleTempMap;
                    switch (cmdValue) {
                        case 1:
                            //会议邀请
                            var labelData = _this.master.get("labelData") || {};
                            var userlabels = [].concat(labelData["sysLabels"], labelData["userLabels"]);
                            _this.master.capi.addBehavior("calendar_addmeetingact_click");
                            if (_.isUndefined(M2012.Calendar.View.Meeting)) {
                                _this.master.loadJsResAsync({
                                    id: "labelpop",
                                    url: "/calendar/cal_index_addLabel_async.html.pack.js",
                                    useContact: true,
                                    onload: function () {
                                        new M2012.Calendar.View.Meeting({
                                            master: _this.master,
                                            labels: userlabels
                                        });
                                    }
                                });

                            } else {
                                new M2012.Calendar.View.Meeting({
                                    master: _this.master,
                                    labels: userlabels
                                });
                            }

                            break;
                        case 2:
                            //生日提醒
                            _this.master.capi.addBehavior("calendar_addbirthdayact_click");
                            new M2012.Calendar.Popup.View.Birthday({ master: _this.master });
                            break;
                        case 3:
                            //每日
                            _this.master.capi.addBehavior("calendar_adddayact_click");
                            new M2012.Calendar.View.Popup.FastSchedule({
                                master: window.$Cal,
                                scheduleTemp: TEMPLATES.dayTemp
                            });
                            break;
                        case 4:
                            //每周
                            _this.master.capi.addBehavior("calendar_addweekact_click");
                            new M2012.Calendar.View.Popup.FastSchedule({
                                master: window.$Cal,
                                scheduleTemp: TEMPLATES.weekTemp
                            });
                            break;
                        case 5:
                            //每月
                            _this.master.capi.addBehavior("calendar_addmonthact_click");
                            new M2012.Calendar.View.Popup.FastSchedule({
                                master: window.$Cal,
                                scheduleTemp: TEMPLATES.monthTemp
                            });
                            break;
                        case 6:
                            //每年
                            _this.master.capi.addBehavior("calendar_addyearact_click");
                            new M2012.Calendar.View.Popup.FastSchedule({
                                master: window.$Cal,
                                scheduleTemp: TEMPLATES.yearTemp
                            });
                            break;
                        case 7:
                            //倒计时
                            _this.master.capi.addBehavior("calendar_addcountdownact_click");
                            new M2012.Calendar.Popup.View.Countdown({ master: _this.master });
                            break;
                        default:
                            if (!!template) {
                                new M2012.Calendar.View.Popup.FastSchedule({
                                    master: _this.master,
                                    scheduleTemp: template
                                });
                            }
                            break;
                    }
                    _this.logger.debug('场景菜单点选：cmd=%s', cmdValue);
                });

                // 当鼠标移除下拉菜单区域时,弹窗应该关闭
                _this.pnlMenu.hover(function () {
                    // 鼠标进入事件
                }, function () {
                    _this.pnlMenu.hide();
                    // 鼠标移出事件
                });
            });
        }
    }));

    $(function () {
        new M2012.Calendar.View.SceneMenu({
            master: window.$Cal
        });
    });

})(jQuery, _, M139, window._top || window.top);
