
; (function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.TopNaviBar";

    M139.namespace(_class, superClass.extend({

        name: _class,

        el: "#dvdayChoose",

        logger: new M139.Logger({ name: _class }),

        model: null,

        master: null,
        //当前模块
        module: null,

        initialize: function (args) {
            var self = this;

            self.master = args.master;

            //绑定视图模型
            self.model = new M2012.Calendar.Model.TopNaviBar({
                master: self.master
            });

            self.render();

            //先呈现默认工具栏
            var type = self.model.get("type").toString();
            self.module = self.getModule(type);
            self.module.render.call(self);

            self.initEvents();

            return superClass.prototype.initialize.apply(self, arguments);
        },

        initEvents: function () {
            var self = this;
            var master = self.master;
            var EVENTS = master.EVENTS;

            self.panel = $("#pnlNaviBar");
            self.panel.find("a[nav]").click(function () {
                var nav = $(this).attr("nav");

                var key = "";
                if (nav.indexOf("/day") > -1) {
                    key = "calendar_dayviewitem_click";

                } else if (nav.indexOf("/month") > -1) {
                    key = "calendar_monthviewitem_click";

                } else if (nav.indexOf("/list") > -1) {
                    key = "calendar_listviewitem_click";

                } else if (nav.indexOf("/message") > -1) {
                    key = "calendar_messagebox_click";
                }

                if (key.length > 0) {
                    master.capi.addBehavior(key);
                }

                master.trigger(master.EVENTS.NAVIGATE, {
                    path: nav
                });
            });

            self.on("print", function () {
                //self.logger.debug("printing..."); //启动
            });

            var constant = self.master.CONST;

            //视图类型发送变化时重新渲染UI
            self.model.on("change:type", function (args) {
                var type = self.model.get("type").toString();
                self.module = self.getModule(type);
                self.module.render.call(self);
            });

            self.master.on("change:year change:month change:day", function () {
                var monthChanged = false;
                var dayChanged = false;

                //判断月份有没有改变
                if (self.master.hasChanged("year") || self.master.hasChanged("month")) {
                    monthChanged = true;
                    dayChanged = true;
                }
                    //判断天是否发生变化
                else if (self.master.hasChanged("day")) {
                    dayChanged = true;
                }
                if (self.outimer) {
                    window.clearTimeout(self.outimer);
                }
                self.outimer = window.setTimeout(function () {

                    if (monthChanged) {
                        monthChanged = false;
                    }
                    if (dayChanged) {
                        dayChanged = false;
                    }

                    //隐藏所有的活动弹出层
                    //   self.master.trigger(EVENTS.HIDE_ACTIVITY_POPS);
                    //重新呈现日期描述信息
                    self.module.render.call(self);
                });

            });

            //日历前翻
            self.getElement("prev").click(function () {
                self.master.capi.addBehavior("calendar_chooseprevdate_click");
                //隐藏所有的活动弹出层
                self.master.trigger(self.master.EVENTS.HIDE_ACTIVITY_POPS);
                self.module.prev.call(self);
            });

            //日历后翻
            self.getElement("next").click(function () {
                self.master.capi.addBehavior("calendar_choosenextdate_click");
                //隐藏所有的活动弹出层
                self.master.trigger(self.master.EVENTS.HIDE_ACTIVITY_POPS);
                self.module.next.call(self);
            });

            //当月、今天
            self.getElement("date_current").click(function () {
                self.master.capi.addBehavior("calendar_choosetoday_click");
                //隐藏所有的活动弹出层
                self.master.trigger(self.master.EVENTS.HIDE_ACTIVITY_POPS);
                self.module.current.call(self);
            });

            //主视图切换处理函数
            self.master.on('mainview:change', function (args) {
                self.panel.find("#ulViewItems li").removeClass('focus')
                    .filter(".js_item_" + args.view).addClass('focus');

                var type = {
                    month: 0,
                    day: 1,
                    list: 2,
                    timeline: 2
                }[args.view];

                if (_.isNumber(type)) {
                    self.model.set({ type: type });
                }
            });

            //监听视图显示事件以刷新消息条数
            self.master.on(self.master.EVENTS.VIEW_SHOW, function (args) {
                if (args.name == "main") {
                    //此处标示人为处理过消息，需要重新获取消息状态
                    if (self.master.get("msg_changed_flag") === true) {
                        //刷新消息
                        self.model.getMsgCount();
                        self.master.set({
                            msg_changed_flag: false
                        }, { silent: true });
                    }
                }
            });

            //显示消息提醒
            self.master.on(EVENTS.MSG_RECEVIE, function (args) {
                var count = args.count;
                var msgEl = $("#newmsgcount");
                var iconEl = $("#newmsgicon");
                if (count > 0) {
                    if (count > 99)
                        count = "99+";

                    msgEl.text(count).show();
                    iconEl.removeClass("i-setupB").addClass("i-setupB2");
                } else {
                    msgEl.hide();
                    iconEl.removeClass("i-setupB2").addClass("i-setupB");
                }
            });

            //查询未读消息数
            self.model.getMsgCount();

            if (!window.ISOPEN_CAIYUN) {
                var allTypes = { EVENT: 0, LABEL: 1 }; //活动类型是0，日历类型是1
                top.$App.on("calendar:refresh", function (data) {
                    data = data || {};
                    if (data.type == allTypes.LABEL && (data.whitelist || data.accept)) {
                        //需要刷新左侧日历列表
                    }
                    //刷新活动列表
                    //刷新消息
                    self.model.getMsgCount();
                });
            }
        },

        //初始化管理菜单
        initMgrPop: function () {
            var self = this;
            var hasOptionMenu = false;
            var optionEl = $("#menuOption");
            //#region 菜单项,抽出取出来,方便通过配置控制显示的项目
            var master = self.master,
                EVENTS = master.EVENTS,
                menuItems = [];


            //日历管理
            menuItems.push(
                {
                    text: "日历管理",
                    onClick: function () {
                        master.capi.addBehavior("calendar_managelabel_click");
                        master.trigger(EVENTS.NAVIGATE, { path: "mod/labelmgr" });
                    }
                });

            //日历黑白名单管理
            menuItems.push(
                {
                    text: "日历黑白名单管理",
                    onClick: function () {
                        master.capi.addBehavior("calendar_blackwhite_click");
                        master.trigger(EVENTS.WHITELIST_POPUP);
                    }
                });
            //#endregion

            optionEl.click(function () {
                if (hasOptionMenu) {
                    self.menuOption.show();
                    return;
                }

                var position = optionEl.offset();

                self.menuOption = new M2012.Calendar.View.CalendarPopMenu().create({
                    top: position.top + 28,
                    left: position.left + 30,
                    items: menuItems
                });
            });
        },

        render: function () {
            var self = this;

            self.initMgrPop();

            var html = $T.format(self.template, { cid: self.cid });
            $(html).appendTo(self.$el);

        },

        /**
         * 获取页面元素
         * id为{cid}_name 格式的
         */
        getElement: function (id) {
            var self = this;
            id = $T.format("#{cid}_{id}", {
                cid: self.cid,
                id: id
            });
            return $(id);
        },

        /**
         * 获取模块信息
         */
        getModule: function (view) {
            var self = this;
            var type = self.model.get("type");

            type = type.toString();
            return self.Modules[type];
        },

        Modules: {
            //月
            "0": {
                // 呈现月信息
                render: function () {
                    var self = this;
                    var date = new Date(
                      self.master.get("year"),
                      self.master.get("month") - 1,
                      self.master.get("day"));
                    var text = $Date.format("yyyy年MM月", date);

                    self.getElement("choose_day").hide();
                    self.getElement("choose_month")
                        .text(text)
                        .attr("realdate", $Date.format("yyyy-MM-dd", date))
                        .show();

                    self.getElement("date_current").text("今日");
                    //初始化日期选择控件
                    self.module.setCalendar.call(self);
                },

                //上一日期
                prev: function () {
                    var self = this;
                    var now = self.master.capi.getCurrentServerTime();
                    var date = new Date(
                        self.master.get("year"),
                        self.master.get("month") - 2, 1);
                    //如果是当月则日期取当天
                    if (now.getFullYear() == date.getFullYear() && now.getMonth() == date.getMonth()) {
                        date.setDate(now.getDate());
                    }
                    self.model.setDate(date);
                },

                //下一日期
                next: function () {
                    var self = this;
                    var now = self.master.capi.getCurrentServerTime();
                    var date = new Date(self.master.get("year"), self.master.get("month"), 1);
                    //如果是当月则日期取当天
                    if (now.getFullYear() == date.getFullYear() && now.getMonth() == date.getMonth()) {
                        date.setDate(now.getDate());
                    }
                    self.model.setDate(date);
                },

                //当月
                current: function () {
                    var self = this;
                    var now = self.master.capi.getCurrentServerTime();
                    self.model.setDate(now);
                },

                //设置日历选择器
                setCalendar: function () {
                    var self = this;

                    if (!self.monthCalendarComp) {
                        var date = new Date(
                            self.master.get("year"),
                            self.master.get("month") - 1,
                            self.master.get("day"));

                        self.monthCalendarComp = new M2012.Calendar.View.CalenderChoose({
                            date2StringPattern: 'yyyy年MM月',
                            id: self.cid + '_choose_month',
                            year: date.getFullYear(),
                            month: date.getMonth(),
                            day: date.getDate(),
                            callback: function () {
                                self.master.capi.addBehavior("calendar_choosedate_click");
                                self.model.setDate(arguments[0]);
                            }
                        });
                    }
                }

            },

            "1": {

                //呈现日信息
                render: function () {

                    var self = this;
                    self.Modules[2].render.call(self);
                },

                //上一日期
                prev: function () {
                    var self = this;
                    self.Modules[2].prev.call(self, 1);
                },

                //下一日期
                next: function () {
                    var self = this;
                    self.Modules[2].next.call(self, 1);
                },

                //当天
                current: function () {
                    var self = this;
                    self.Modules[2].current.call(self);
                },

                setCalendar: function () {

                    var self = this;
                    self.Modules[2].setCalendar.call(self);
                }

            },
            //列表
            "2": {

                //呈现日信息
                render: function () {
                    var self = this;
                    var date = new Date(
                        self.master.get("year"),
                        self.master.get("month") - 1,
                        self.master.get("day"));
                    var text = $Date.format("yyyy年MM月dd日", date);
                    self.getElement("choose_month").hide();
                    self.getElement("choose_day")
                        .text(text)
                        //此属性用于日历选择器定位数据
                        .attr("realdate", $Date.format("yyyy-MM-dd", date))
                        .show();
                    self.getElement("date_current").text("今日");

                    //初始化日期选择控件
                    self.module.setCalendar.call(self);
                },

                //上一日期
                prev: function (step) {
                    step = step || 7;
                    var self = this;
                    var date = new Date(
                    self.master.get("year"),
                    self.master.get("month") - 1,
                    self.master.get("day") - step);

                    self.model.setDate(date, { action: 'prev' });

                },
                //下一日期
                next: function (step) {
                    step = step || 7;
                    var self = this;
                    var date = new Date(
                        self.master.get("year"),
                        self.master.get("month") - 1,
                        self.master.get("day") + step);

                    self.model.setDate(date, { action: 'next' });
                },

                //当天
                current: function () {

                    var self = this;
                    var now = self.master.capi.getCurrentServerTime();
                    self.model.setDate(now, { action: 'now' });
                },

                //获取日历选择器
                setCalendar: function () {
                    var self = this;

                    if (!self.dayCalendarComp) {

                        var date = new Date(
                            self.master.get("year"),
                            self.master.get("month") - 1,
                            self.master.get("day"));

                        self.dayCalendarComp = new M2012.Calendar.View.CalenderChoose({
                            date2StringPattern: 'yyyy年MM月dd月',
                            id: self.cid + '_choose_day',
                            year: date.getFullYear(),
                            month: date.getMonth(),
                            day: date.getDate(),
                            callback: function () {
                                self.master.capi.addBehavior("calendar_choosedate_click");
                                self.model.setDate(arguments[0], { action: 'select' });
                            }
                        });
                    }
                }
            }
        },

        template: [
            '<a href="javascript:void(0)" id="{cid}_prev" class="createTop_pre"></a>',
 			'<a class="t-c-a" id="{cid}_choose_month" href="javascript:void(0);">2014年01月</a>',
            '<a style="display:none;" class="t-c-a" id="{cid}_choose_day" href="javascript:void(0);">2014年01月01日</a>',
 			'<a href="javascript:void(0)" id="{cid}_next" class="createTop_next"></a>',
 			'<a class="t-c-a" id="{cid}_date_current" href="javascript:void(0);">本月</a>'].join("")
    }));



})(jQuery, _, M139, window._top || window.top);
