; (function ($, _, M139, top) {
    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.DateRepeater";

    M139.namespace(_class, superClass.extend({

        name: _class,
        //视图数据模型
        model: null,
        //视图主控
        master: null,
        //控件父容器
        container: null,
        /*时间改变后的触发事件
         *  @param {Object}   args   //通知到调用方的数据
         */
        onChange: function (args) {

        },
        defaults: {
            width: 124
        },

        /**
         *  @param {Object}   args.master       //日历视图主控
         *  @param {Object}   args.container    //父容器,jQuery对象
         *  @param {Number}   args.sendInterval //重复类型(可选)
         *  @param {Number}   args.width        //控件宽度(可选)
         *  @param {Function} args.onChange     //数据改变后的回调
        **/
        initialize: function (args) {

            var self = this;

            args = args || {};
            self.master = args.master;
            if (args.container) {
                self.container = args.container;
            }
            if (_.isNumber(args.width)) {
                self.width = args.width;
            }
            self.onChange = function (data) {
                args.onChange && args.onChange(data);
            }
            self.model = new M2012.Calendar.Model.DateRepeater(args);

            self.render();
            self.initEvents();
        },

        //注册事件
        initEvents: function () {
            var self = this;

            //监控数据变化，实时通知调用方
            self.model.on("change:sendInterval", function () {
                var value = self.model.get("sendInterval");
                self.onChange({
                    sendInterval: value
                });
            });
            //首次加载触发一次以确保调用方能获取到初始数据
            self.onChange({
                sendInterval: self.model.get("sendInterval")
            });
        },

        //呈现视图
        render: function () {          
            var self = this;
            var sendInterval = self.model.get("sendInterval");
            var menuItems = self.model.get("dataItems");
            var item = menuItems[sendInterval];
            var options = {
                container: self.container,
                menuItems: self.model.getMenuItems(),
                selectedIndex: item ? item.index : 0,
                width: self.width,
                maxHeight: 150
            };

            //删除backbone自动创建的div
            self.$el.remove();

            //创建一个下拉菜单
            self.intervalMenu = new M2012.Calendar.View.CalendarDropMenu().create(options);
            self.intervalMenu.on("change", function (item) {
                self.model.set({
                    sendInterval: item.data.sendInterval
                });
            });
        },

        getElement: function (id) {
            var self = this;

            id = $T.format("#{cid}_{id}", {
                cid: self.cid,
                id: id
            });
            return $(id);
        },

        /**
         * 设置控件值
         *  @param {Int}   args.sendInterval   //重复类型
         */
        setData: function (args) {
            var self = this;
            var data = {};
            if (!args)
                return;

            if (args.sendInterval) {
                var value = args.sendInterval;
                data.sendInterval = value;
                self.intervalMenu.setSelectedValue(value);
            }
            self.model.setData(data);
        }
    }));

    (function () {

        var base = M139.Model.ModelBase;
        var current = "M2012.Calendar.Model.DateRepeater";

        M139.namespace(current, base.extend({

            name: current,

            master: null,

            defaults: {
                //重复类型
                //0不重复, 3天, 4周,5月,6年
                sendInterval: 0,
                //数据选择项
                dataItems: {}
            },

            /**
             *  重复项数据配置
            **/
            INTERVAL_CONF: [
                {
                    text: "不重复", value: 0
                }, {
                    text: "每天", value: 3
                }, {
                    text: "每周", value: 4
                }, {
                    text: "每月", value: 5
                }, {
                    text: "每年", value: 6
                }
            ],

            /**
              *  构造函数
              *  @param {Object} args.master     //日历视图主控
              *  @param {Number} args.sendInterval   //重复类型(可选)
             **/
            initialize: function (args) {
                var self = this;

                args = args || {};
                self.master = args.master;

                var capi = self.master.capi;

                if (_.isNumber(args.sendInterval)) {
                    self.set({
                        sendInterval: args.sendInterval
                    });
                }
                self.setMenuItems();
            },

            /**
             * 设置控件下拉选项的列表值
            **/
            setMenuItems: function () {
                var self = this;
                var conf = self.INTERVAL_CONF;
                var items = {};

                for (var i = 0, length = conf.length ; i < length; i++) {
                    var val = conf[i];
                    var item = {
                        text: val.text,
                        value: val.value,
                        data: { sendInterval: val.value }
                    };
                    items[val.value] = {
                        index: i,
                        item: item
                    };
                }
                self.set({ dataItems: items });
            },

            //获取下拉列表选项
            getMenuItems: function () {
                var self = this;
                var dataItems = self.get("dataItems");

                if (dataItems) {
                    var items = new Array(100);
                    var value = null;
                    var count = 0;

                    for (var key in dataItems) {
                        value = dataItems[key];
                        if (value.item) {
                            items[value.index] = value.item;
                            count++;
                        }
                    }
                    return items.slice(0, count);
                }
                return [];
            },

            /**
             * 设置控件值
             * @param {Object} args //要设置值的json格式
            **/
            setData: function (args) {
                var self = this;
                if (!args)
                    return;

                for (var key in args) {
                    if (_.has(self.attributes, key)) {
                        var value = {};
                        value[key] = args[key];
                        self.set(value, { silent: true });
                    }
                }
            }
        }));

    })();
})(jQuery, _, M139, window._top || window.top);
﻿; (function ($, _, M139, top) {
    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.DateWeekPicker";

    M139.namespace(_class, superClass.extend({

        name: _class,
        //视图数据模型
        model: null,
        //视图主控
        master: null,
        //控件父容器
        container: null,

        currentEl: null,

        /**
         *  数据改变后的触发事件
         *  @param {Object}   data   //同步到调用方的数据
        **/
        onChange: function (data) { },

        /**
         *  周选择控件
         *  @param {Object}   args.master     //日历视图主控
         *  @param {Object}   args.container  //父容器,jQuery对象
         *  @param {Date}     args.week       //星期数据(可选)
         *  @param {Function} args.onChange   //数据改变后的回调
        **/
        initialize: function (args) {

            var self = this;

            args = args || {};
            self.master = args.master;

            if (args.container) {
                self.container = args.container;
            }
            self.onChange = function (data) {
                args.onChange && args.onChange(data);
            }

            self.model = new M2012.Calendar.Model.DateWeekPicker(args);

            self.render();
            self.initEvents();
        },

        //注册事件
        initEvents: function () {
            var self = this;

            //监控数据变化，实时通知调用方
            self.model.on("change:week", function () {
                self.WeekChanged();
            });

            //首次加载触发一次以确保调用方能获取到初始数据
            self.WeekChanged();
        },

        /**
         *  周选择控件
         *  @param {Object}   silent          //是否保持沉默，为false则触发onChange事件通知调用方
         *  @param {Function} args.onChange   //数据改变后的回调
        **/
        WeekChanged: function (silent) {         
            var self = this;
            var week = self.model.get("week");
            var chkBoxs = self.container.find("input[type='checkbox']");

            if (!week || week.length != 7)
                return;
            if (!silent) {
                self.onChange({ week: week });
            }
            var weeks = week.split("");
            chkBoxs.each(function (i) {
                this.checked = (weeks[i] == "1");
            });
        },

        //呈现视图
        render: function () {
            var self = this;
            //删除backbone自动创建的div
            self.$el.remove();
            var html = [];
            var weeks = self.model.get("WEEK_CONF");

            for (var i = 0; i < weeks.length; i++) {
                html.push($T.format(self.template, {
                    cid: self.cid,
                    index: i,
                    week: weeks[i]
                }));
            }
            $(html.join("")).appendTo(self.container);

            //点击星期选择区域设置用户选择的周信息
            self.container.unbind().click(function (e) {

                window.setTimeout(function () {
                    var data = [0, 0, 0, 0, 0, 0, 0];
                    var length = data.length;
                    self.container.find("input[type='checkbox']").each(function (i) {

                        if (i >= length) return;
                        if (this.checked)
                            data[i] = 1;

                    });
                    self.model.set({ week: data.join("") });
                }, 100);

            });
        },

        /**
         *  设置周控件值
         *  @param {Object}   args.week     //周数据集合
        **/
        setData: function (args) {
            if (!args)
                return;

            var self = this;
            var data = {};
            if (args.week && args.week.length == 7) {
                data.week = args.week;              
            }
            self.model.setData(data);
            self.WeekChanged(true);
        },

        getElement: function (id) {
            var self = this;
            id = $T.format("#{cid}_{id}", {
                cid: self.cid,
                id: id
            });
            return $(id);
        },

        //视图模板
        template: [
            '<input type="checkbox" class="mr_5" id="{cid}_checkweek_{index}" value="{index}" name="{cid}_checkweek">',
            '<label class="mr_10" for="{cid}_checkweek_{index}">{week}</label>'
        ].join("")

    }));

    (function () {

        var base = M139.Model.ModelBase;
        var current = "M2012.Calendar.Model.DateWeekPicker";

        M139.namespace(current, base.extend({

            name: current,

            master: null,

            defaults: {

                //设置一个星期的那几天循环
                //如：0101110   表示周一、三、四、五
                week: "",

                WEEK_CONF: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
            },

            /**
              *  构造函数
              *  @param {Object}   args.master   //日历视图主控
              *  @param {Date}     args.week     //星期数据(可选)
             **/
            initialize: function (args) {
                var self = this;

                args = args || {};
                self.master = args.master;

                if (args.week) {
                    self.set({
                        week: args.week
                    });
                }
            },

            /**
             * 设置控件值
             * @param {Object} args //要设置值的json格式
            **/
            setData: function (args) {
                var self = this;
                if (!args)
                    return;

                for (var key in args) {
                    if (_.has(self.attributes, key)) {
                        var value = {};
                        value[key] = args[key];
                        self.set(value, { silent: true });
                    }
                }
            }
        }));

    })();
})(jQuery, _, M139, window._top || window.top);
﻿;
(function ($, _, M139, top) {

    var superClass = M139.Model.ModelBase;
    var className = "M2012.Calendar.Model.Activity";

    M139.namespace(className, Backbone.Model.extend({
        name: className,
        defaults: {
            //是否有结束时间信息
            useEndTime: false,
            //是否有地点信息
            useSite: false,
            //是否有备注信息
            useContent: false,
            //提醒信息是否改变
            reminderChanged: false,
            //是否是处于编辑模式
            //true:编辑模式 false:添加模式
            isEditMode: false,

            seqNo: 0,
            //活动所属日历
            labelId: 10,
            //日历类型
            // 10：公历 20：农历
            calendarType: 10,
            //日程是否启用提醒  
            //0：否  1：是
            enable: 1,
            //提醒提前时间
            beforeTime: 15,
            //提醒提前类别
            //0分, 1时, 2天, 3周,4月
            beforeType: 0,
            //重复类型  
            //0不重复, 3天, 4周,5月,6年
            sendInterval: 0,
            //用户输入的验证码
            validImg: "",
            //活动内容
            content: "",
            //标题
            title: "",
            //地点
            site: "",
            //开始时间
            dtStart: new Date(),
            //结束时间
            dtEnd: new Date(),
            //按周循环
            //如：0101110   表示周一、三、四、五
            week: "",
            //全天事件
            //0：否 1：是
            allDay: 0,
            //是否是短信提醒   0：否 1：是
            recMySms: 0,
            //是否是邮件提醒   0：否   1：是
            recMyEmail: 1,
            //活动提醒接收的手机号
            recMobile: "",
            //活动提醒接收的邮箱地点
            recEmail: "",
            //特殊类型
            specialType: 0,
            //邀请信息
            inviteInfo: null,
            //默认是否有邀请人信息
            hasDefInviteInfo: false,
            //是否是邀请信息
            isInvitedCalendar: 0,
            //是否向用户发送更新通知
            isNotify: 0,
            //验证码
            validImg: "",

            //任务id，外部模块调用凭证
            taskId: null
        },

        //是否初始化成功
        isLoadSuccess: false,

        logger: new M139.Logger({ name: className }),

        master: null,

        EVENTS: {
            //验证失败
            VALIDATE_FAILED: "activity#validate:failed",
            DATA_INIT: "activity#data:init",
            TIP_SHOW: "activity#tip:show:",
            ADD_CAL_SUCCESS: "addCalendarSuccess"
        },

        TIPS: {
            OPERATE_ERROR: "操作失败，请稍后再试",
            OPERATE_SUCCESS: "操作成功",
            DATA_LOADING: "正在加载中...",
            DATA_LOAD_ERROR: "数据加载失败，请稍后再试",
            SESSION_ERROR: "提醒时间早于当前时间,会无法下发当天之前的提醒通知",
            STARTTIME_INVALID: "开始时间不能晚于结束时间",
            MAX_LENGTH: "不能超过{0}个字符",
            TITLE_ERROR: "主题不能为空",
            NO_WEEK: "请至少选择每周中的一天",
            ADD_ACT_TITLE: "创建活动",
            EDIT_ACT_TITLE: "编辑活动",
            ADD_SITE: "添加地点",
            DEL_SITE: "删除地点",
            ADD_CONTENT: "添加备注",
            DEL_CONTENT: "删除备注",
            DELETE_ERROR: "删除活动失败,请重试!",
            CANCEL_INVITE_ERROR: "取消邀请活动失败,请重试!",
            ADD_ACT_NOTIFY: "您可以发送通知，告知参与人您安排了新的活动",
            UPDATE_ACT_NOTIFY: "您可以发送通知，告知参与人您更新了活动",
            DELETE_CONFIRM: "确定要删除该条活动吗?",
            DELETE_SUCCESS: "删除成功"
        },

        /**
         *  详细活动编辑
         *  @param {Object} args.master //视图主控
        */
        initialize: function (args) {
            var self = this;
            args = args || {};
            self.master = args.master;

            self.initEvents();
        },

        /**
         *  添加监听事件
         */
        initEvents: function () {
            var self = this;

            //监听事件用以初始化页面数据
            self.on(self.EVENTS.DATA_INIT, function () {
                var data = self.master.get("edit_detail_data") || {};
                //清空提交过来的数据
                self.master.set({ edit_detail_data: null });

                //编辑活动模式
                if (_.isNumber(data.seqNo) && data.seqNo > 0 && _.isNumber(data.type)) {

                    //界面顶部展示数据加载中 
                    self.trigger(self.EVENTS.TIP_SHOW, { message: self.TIPS.DATA_LOADING });

                    //设置当前页面为编辑模式
                    self.set({ isEditMode: true });

                    //编辑模式需要获取服务端数据
                    self.fetch(data.seqNo, data.type,
                        function (result) {
                            self.initData(result);
                            self.trigger(self.EVENTS.TIP_SHOW);

                        }, function () {
                            self.isLoadSuccess = false;
                            self.trigger(self.EVENTS.TIP_SHOW, {
                                message: self.TIPS.DATA_LOAD_ERROR,
                                params: {
                                    delay: 3000,
                                    className: "msgRed"
                                }
                            });
                        }
                    );
                    return;
                }

                //以下为创建活动模式
                if (window.isCaiyun) {
                    self.master.capi.addBehavior("cal_caiyun_addact_load");
                }

                //先判断下是否是外部模块过来新增活动详情
                var task = self.master.get("add_activity_task");
                if (task && task.name == "addact" && task.taskId) {
                    self.set({ taskId: task.taskId });
                    //清空活动信息
                    self.master.set({
                        add_activity_task: null
                    });
                }

                //data中没有指定开始时间表示是创建全新活动，此时需要根据业务规则对时间进行处理
                //对于过去的日期显示为全天事件并且提醒方式默认为不提醒
                //对于之后的日期默认为当天8:00
                if (!_.has(data, "dtStart")) {
                    var selectedDate = new Date(self.master.get("year"),
                        self.master.get("month") - 1, self.master.get("day"));
                    var currentDate = self.master.capi.getCurrentServerTime();
                    var compare = self.master.capi.compareDate(currentDate, selectedDate);
                    switch (compare) {
                        //选择的时间早于当前时间
                        case 1:
                            $.extend(data, {
                                allDay: 1,
                                enable: 0,
                                dtStart: selectedDate,
                                dtEnd: selectedDate
                            });                         
                            break;
                            //今天以后的时间
                        case -1:
                            var value = selectedDate.setHours(8);
                            $.extend(data, {
                                dtStart: value,
                                dtEnd: value
                            });                         
                            break;
                    }
                }

                self.initData(data);
            });

            //验证失败后的处理
            //该事件是backbone自己的验证事件，只需要定制即可
            self.on("invalid", function (model, error) {
                if (error && _.isObject(error)) {
                    for (var key in error) {
                        self.trigger(self.EVENTS.VALIDATE_FAILED, {
                            target: key,
                            message: error[key]
                        });
                        break;
                    }
                }
            });
        },

        /**
         *  填充model数据
         *  @param {Object}   data     //活动数据
         */
        initData: function (data) {
            var self = this;
            //提醒信息变更标示
            var reminderChanged = false;
            var silent = false;

            //是否显示地点
            if (data.site)
                self.set({ useSite: true });

            //是否有备注信息
            if (data.content)
                self.set({ useContent: true });

            for (var key in data) {
                silent = false;

                if (!_.has(self.attributes, key))
                    continue;

                var value = {};
                value[key] = data[key];

                if (key == "dtStart" || key == "dtEnd") {
                    if (!_.isDate(value[key]))
                        value[key] = $Date.parse(value[key]);

                    if (!_.isDate(value[key]))
                        continue;

                    //编辑模式下对于全天事件需要处理下结束时间，结束时间需要减一天
                    if (self.get("isEditMode") && data["allDay"] == 1 && key == "dtEnd")
                        value[key].setDate(value[key].getDate() - 1);

                } else if (key == "enable" || key == "beforeTime" || key == "beforeType"
                    || key == "recMySms" || key == "recMyEmail") {
                    silent = true;
                    //判断提醒信息是否变更
                    reminderChanged = true;

                } else if (key == "inviteInfo") {
                    var info = null;
                    //去掉自己
                    if (value[key] && value[key].length > 0) {
                        info = $.grep(value[key], function (n, i) {
                            return n.inviteAuth > -1
                        });
                    }
                    value[key] = info;
                    self.set({
                        hasDefInviteInfo: info && info.length > 0
                    }, { silent: true });

                }
                //此处对数据类型做限定，从类型上判断数据的有效性
                if (typeof self.get(key) === typeof value[key]) {
                    //更新model键值，不触发验证
                    self.set(value, {
                        silent: silent,
                        validate: false
                    });
                }
            }

            //是否显示结束日期
            //只有当结束时间不等于开始时间时才让显示结束时间
            //目前没有很好的办法判断用户是否有勾选结束时间，暂时用该方式处理
            if (self.master.capi.compareTimeNoSecond(self.get("dtStart"), self.get("dtEnd")) != 0) {
                self.set({ useEndTime: true });
            }

            //设置提醒信息变更标记
            self.set({ reminderChanged: reminderChanged });

            self.isLoadSuccess = true;
        },

        /**
         * 获取处理后的数据
        **/
        getData: function () {
            var self = this;
            //计算开始、结束时间
            var isFullDay = (self.get("allDay") === 1);
            var startTime = self.get("dtStart");
            var endTime = self.get("dtEnd");
            var labelId = self.get("labelId");

            //若没有填写结束时间则取开始时间
            if (!self.get("useEndTime"))
                endTime = startTime;

            var time = self.master.capi.getFullDayDate(startTime, endTime, isFullDay);

            return {
                labelId: labelId ? labelId : self.master.CONST.defaultLabelId,
                seqNo: self.get("seqNo"),
                recMySms: self.get("recMySms"),
                recMyEmail: self.get("recMyEmail"),
                calendarType: self.get("calendarType"),
                beforeTime: self.get("beforeTime"),
                beforeType: self.get("beforeType"),
                sendInterval: self.get("sendInterval"),
                week: self.get("sendInterval") == 4 ? self.get("week") : "",
                title: self.get("title"),
                site: self.get("useSite") ? self.get("site") : "",
                content: self.get("useContent") ? self.get("content") : "",
                dtStart: $Date.format("yyyy-MM-dd hh:mm:ss", time.startTime),
                dtEnd: $Date.format("yyyy-MM-dd hh:mm:ss", time.endTime),
                allDay: self.get("allDay"),
                recMobile: self.get("recMobile"),
                recEmail: self.get("recEmail"),
                enable: self.get("enable"),
                validImg: self.get("validImg"),
                isNotify: self.get("isNotify"),
                inviteInfo: self.get("inviteInfo")
            };
        },

        /**
         * 验证数据的有效性       
        **/
        validate: function (attrs, args) {
            var self = this;
            var data = attrs;

            args = args || {};
            //判断是否需要验证
            if (!args.validate) {
                return;
            }

            //如果存在target，那说明我们只针对具体字段做校验
            if (args && args.target) {
                var key = args.target;
                var obj = {};
                obj[key] = attrs[key];
                data = obj;
            }

            //该方法用于获取返回的错误信息
            var getResult = function (target, message) {
                //校验错误后backbone不会将错误数据set到model中，所以此处需要偷偷的设置进去,
                //以便于后续提交时能统一校验model数据
                if (args.target == target) {
                    var obj = {};
                    obj[target] = attrs[target];
                    self.set(obj, { silent: true });
                }
                var value = {};
                value[target] = message;
                return value;
            }

            //验证主题内容有效性
            var key = "title";
            if (_.has(data, key)) {
                if (data.title.length == 0) {
                    return getResult(key, self.TIPS.TITLE_ERROR);
                }
                if (data.title.length > 100) {
                    return getResult(key, $T.format(self.TIPS.MAX_LENGTH, [100]));
                }
            }

            //验证地点内容有效性
            key = "site";
            if (_.has(data, key) && data.site.length > 100) {
                return getResult(key, $T.format(self.TIPS.MAX_LENGTH, [100]));
            }

            //验证备注内容有效性
            key = "content";
            if (_.has(data, key) && data.content.length > 500) {
                return getResult(key, $T.format(self.TIPS.MAX_LENGTH, [500]));
            }

            //验证开始时间
            key = "dtStart";
            if (_.has(data, key) && attrs.useEndTime) {
                var startTime = data.dtStart;
                if (!_.isDate(startTime))
                    startTime = $Date.parse(startTime);

                //当不显示结束时间时结束时间是以开始时间来作参考
                //故此时肯定不会比开始时间小，所以只有显示结束时间时才需要做以下检测
                if (attrs.useEndTime) {
                    //时间去掉秒数然后再比较
                    if (self.master.capi.compareTimeNoSecond(startTime, attrs.dtEnd) === 1) {
                        return getResult(key, self.TIPS.STARTTIME_INVALID);
                    }
                }
            }

            //验证结束时间
            key = "dtEnd";
            if (_.has(data, key) && attrs.useEndTime) {
                var endTime = data.dtEnd;
                if (!_.isDate(endTime))
                    endTime = $Date.parse(endTime);

                //时间去掉秒数然后再比较
                if (self.master.capi.compareTimeNoSecond(attrs.dtStart, endTime) === 1) {
                    return getResult(key, self.TIPS.STARTTIME_INVALID);
                }
            }

            //如果选择了周重复，则需要选择周信息
            key = "sendInterval";
            if (_.has(data, key)) {
                if (data.sendInterval == 4) {
                    var week = attrs.week || "";
                    if (week.length != 7 || week.indexOf("1") < 0) {
                        return getResult(key, self.TIPS.NO_WEEK);
                    }
                }
            }

            //验证提前提醒时间是否过期
            key = "enable";
            if (_.has(data, key)) {
                //当前设置为不提醒是则无需验证
                if (data.enable === 1) {
                    var time = self.getReminderTime();
                    var now = new Date();
                    if (time <= now) {
                        return getResult(key, self.TIPS.SESSION_ERROR);
                    }
                }
            }
        },

        /**
         * 当前日期是否已经过期
         */
        isDateExpired: function () {

            var self = this;
            var date = self.get("dtStart");
            var now = self.master.capi.getCurrentServerTime();

            date = self.master.capi.getNoSecondTime(date);
            now = self.master.capi.getNoSecondTime(now);

            //比较指定日期和当前日期的大小
            return self.master.capi.compareDate(date, now) === -1;
        },

        /**
        * 获取实际提醒时间
        */
        getReminderTime: function () {
            var self = this;
            var time = self.get("dtStart");
            var difDay = 0;
            var beforeTime = self.get("beforeTime");

            switch (self.get("beforeType")) {
                //分钟
                case 0:
                    difDay = beforeTime / (24 * 60); break;
                    //小时
                case 1:
                    difDay = beforeTime / 24; break;
                    //天
                case 2:
                    difDay = beforeTime; break;
            }

            //实际提醒的时间
            return $Date.getDateByDays(time, difDay * -1);
        },

        /**
        *  查询活动数据
        *  @param {Number}     seqNo        //活动ID
        *  @param {Number}     type         //活动类型
        *  @param {Function}   fnSuccess    //成功后的执行
        *  @param {Function}   fnError      //失败后的执行
        */
        fetch: function (seqNo, type, fnSuccess, fnError) {
            var self = this;
            self.master.api.getCalendar({
                data: {
                    seqNo: seqNo,
                    type: type
                },
                success: function (result) {
                    fnSuccess && fnSuccess(result["var"]);
                },
                error: function (data) {
                    fnError && fnError(data);
                }
            });
        },

        /**
         * 是否通知用户
         * 共享日历的下的活动活动邀请了参与人的活动都需要通知提醒
        **/
        shouldNotify: function () {
            var self = this;
            var value = self.get("hasDefInviteInfo");
            if (!value) {
                var labelId = self.get("labelId");
                value = self.master.isShareLabel(labelId);
            }
            return value;
        },

        /**
        * 提交数据到服务器保存
        * @param {Function} fnSuccess  执行成功后的处理函数
        * @param {Function} fnError    执行失败后的处理函数
        * @param {Function} fnFail     验证失败后的处理函数
        * @param {Boolean} validate    是否需要检查数据的合法性
        */
        save: function (fnSuccess, fnError, fnFail, validate) {
            var self = this;

            //数据加载失败情况下不让提交数据
            if (!self.isLoadSuccess) {
                fnFail && fnFail();
                return;
            }

            //检查数据的有效性
            if (validate) {
                if (!self.isValid()) {
                    fnFail && fnFail();
                    return;
                }
            }

            var options = {
                data: self.getData(),
                success: function (result) {
                    if (result.code == "S_OK") {
                        fnSuccess && fnSuccess(result["var"]);
                        return;
                    }
                    var msg = self.TIPS.OPERATE_ERROR;
                    fnError && fnError(msg, result);
                    self.logger.error("编辑活动失败！");
                },
                error: function (e) {
                    fnError && fnError(self.TIPS.OPERATE_ERROR);
                }
            };

            //提交数据
            self.master.trigger(self.master.EVENTS.REQUIRE_API, {
                success: function (api) {
                    if (self.get("isEditMode")) {
                        api.updateCalendar(options);
                        return;
                    }
                    api.addCalendar(options);
                }
            });
        },

        /**
         * 删除日历
         * @param {Array|Int} args.seqNos     删除的活动ID列表
         * @param {Array|Int} args.isNotify   是否通知
         * @param {Function} fnSuccess        执行成功后的处理函数
         * @param {Function} fnError          执行失败后的处理函数
         * @param {Function} fnFail           验证失败后的处理函数
        */
        delCalendar: function (args, fnSuccess, fnError, fnFail) {

            if ($.isArray(args.seqNos))
                args.seqNos = args.seqNos.join(",");

            args = $.extend({
                seqNos: 0,
                actionType: 0 //操作类型 0：删除 1：取消
            }, args);

            var self = this;
            self.master.trigger(self.master.EVENTS.REQUIRE_API, {
                success: function (api) {
                    api.delCalendar({
                        data: {
                            seqNos: args.seqNos,
                            actionType: args.actionType,
                            isNotify: args.isNotify
                        },
                        success: function (result) {
                            if (result.code == "S_OK") {
                                fnSuccess && fnSuccess(result["var"]);

                            } else {
                                var msg = self.EVENTS.DELETE_ERROR;

                                fnError && fnError(msg);
                                self.logger.error(msg, result);
                            }
                            fnFail && fnFail();
                        },
                        error: function (e) {
                            fnFail && fnFail();
                            fnError && fnError(self.EVENTS.DELETE_ERROR);
                        }
                    });
                }

            });
        },

        /**
         * 取消活动
         * @param {Array|Int} args.seqNo     活动ID
         * @param {Function} fnSuccess    执行成功后的处理函数
         * @param {Function} fnError      执行失败后的处理函数
         * @param {Function} fnFail       验证失败后的处理函数
         */
        cancelInvited: function (seqNo, fnSuccess, fnError) {
            var self = this;

            self.master.trigger(self.master.EVENTS.REQUIRE_API, {
                success: function (api) {
                    api.cancelInvited({
                        data: { seqNos: seqNo },
                        success: function (result) {
                            if (result.code == "S_OK") {
                                fnSuccess && fnSuccess(result["var"]);

                            } else {
                                var msg = self.EVENTS.CANCEL_INVITE_ERROR;
                                fnError && fnError(msg);
                                self.logger.error(msg, result);
                            }
                        },
                        error: function (e) {
                            fnError && fnError(self.EVENTS.CANCEL_INVITE_ERROR);
                        }
                    });
                }
            });
        }
    }));

})(jQuery, _, M139, window._top || window.top);


; (function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var className = "M2012.Calendar.View.Activity";

    M139.namespace(className, superClass.extend({

        name: className,

        //当前视图名称
        viewName: "detail",

        //视图的父容器
        container: null,

        logger: new M139.Logger({ name: className }),

        //日历视图主控
        master: null,

        //活动数据模型
        model: null,

        /**
         * 添加、编辑活动详情
         * 要创建（编辑）详细活动请通过master调用：
           @example 
             创建： self.master.trigger(self.master.EVENTS.ADD_ACTIVITY);
             编辑： self.master.trigger(self.master.EVENTS.EDIT_ACTIVITY,{seqNo:12345,type:0});
         */
        initialize: function (args) {
            var self = this;
            args = args || {};
            self.master = args.master;

            superClass.prototype.initialize.apply(self, arguments);

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
                    self.model = new M2012.Calendar.Model.Activity({
                        master: self.master
                    });
                    self.initEvents();
                    self.render();
                    // 初始化页面数据
                    self.initData();
                    // 行为统计ID
                    self.master.capi.addBehavior("calendar_load_createcalendar"); // 行为日志ID
                }
            });
        },

        /**
         * 初始化页面数据
        **/
        initData: function () {
            var self = this;
            self.model.trigger(self.model.EVENTS.DATA_INIT);
        },

        /**
         * 注册事件监听
        **/
        initEvents: function () {
            var self = this;

            //监控model数据变化实时同步数据到UI
            self.model.on("change", function () {

                //导航标题显示 添加活动、编辑活动
                if (self.model.hasChanged("isEditMode")) {

                    var TIPS = self.model.TIPS;
                    var value = self.model.get("isEditMode");
                    if (value) {
                        //编辑模式下才显示删除操作按钮
                        self.getElement("btnDel").removeClass("hide");
                        self.getElement("page_title").text(TIPS.EDIT_ACT_TITLE);
                    } else {
                        self.getElement("btnDel").addClass("hide");
                        self.getElement("page_title").text(TIPS.ADD_ACT_TITLE);
                    }

                    //编辑模式下需要显示联系人邀请状态信息
                    self.contactComp && self.contactComp.setData({
                        showStatus: value
                    });
                }
                    //监控日历标签变化
                else if (self.model.hasChanged("labelId")) {

                    var value = self.model.get("labelId");
                    self.labelComp && self.labelComp.setData(value);
                }
                    //监控主题变化
                else if (self.model.hasChanged("title")) {

                    var value = self.model.get("title");
                    self.getElement("title").val(value);
                }
                    //监控地点变化
                else if (self.model.hasChanged("site")) {

                    var value = self.model.get("site");
                    var element = self.getElement("site").val(value);

                    //内容变了,触发一下,让textarea的高度自适应,不够友好,需要手工触发
                    setTimeout(function () {
                        element.trigger("change");
                        element.trigger("blur");
                    }, 50);
                }
                    //监控备注变化
                else if (self.model.hasChanged("content")) {

                    var value = self.model.get("content");
                    var element = self.getElement("content").val(value);

                    setTimeout(function () {
                        element.trigger("change");
                        element.trigger("blur");
                    }, 50);
                }
                    //开始时间
                else if (self.model.hasChanged("dtStart")) {

                    var value = self.model.get("dtStart");
                    self.dtStartComp && self.dtStartComp.setData({
                        datetime: value
                    });
                }
                    //结束时间
                else if (self.model.hasChanged("dtEnd")) {

                    var value = self.model.get("dtEnd");
                    self.dtEndComp && self.dtEndComp.setData({
                        datetime: value
                    });
                }
                    //监控是否全天事件状态
                else if (self.model.hasChanged("allDay")) {

                    var value = self.model.get("allDay") == 1;
                    var data = { isFullDayEvent: value };

                    self.dtStartComp && self.dtStartComp.setData(data);
                    self.dtEndComp && self.dtEndComp.setData(data);
                    //改变全天复选框选中状态
                    self.getElement("check_allday").get(0).checked = value;
                }
                    //监控农历显示状态
                else if (self.model.hasChanged("calendarType")) {

                    var isLunar = self.model.get("calendarType") === 20;
                    var data = { isLunar: isLunar };

                    self.dtStartComp && self.dtStartComp.setData(data);
                    self.dtEndComp && self.dtEndComp.setData(data);
                    //改变显示农历复选框状态
                    self.getElement("check_lunar").get(0).checked = isLunar;
                }
                    //监控显示结束时间状态
                else if (self.model.hasChanged("useEndTime")) {

                    var value = self.model.get("useEndTime");
                    var container = self.getElement("endtime_area");
                    self.getElement("check_endtime").get(0).checked = value;
                    if (value) {
                        container.removeClass("hide");
                        return;
                    }
                    container.addClass("hide");
                }
                    //监控重复类型变化
                else if (self.model.hasChanged("sendInterval")) {

                    var value = self.model.get("sendInterval");
                    var container = self.getElement("week").parent();
                    self.intervalComp && self.intervalComp.setData({
                        sendInterval: value
                    });
                    //当选择的类型是每周重复时，显示周信息选择控件
                    if (value === 4) {
                        container.removeClass("hide");
                        return;
                    }
                    container.addClass("hide");
                }

                    //监控提醒信息变化
                else if (self.model.hasChanged("reminderChanged")) {

                    self.reminderComp && self.reminderComp.setData({
                        beforeTime: self.model.get("beforeTime"),
                        beforeType: self.model.get("beforeType"),
                        recMySms: self.model.get("recMySms"),
                        recMyEmail: self.model.get("recMyEmail"),
                        enable: self.model.get("enable")
                    });
                }
                    //监控周信息变化
                else if (self.model.hasChanged("week")) {

                    var value = self.model.get("week");
                    self.weekComp && self.weekComp.setData({
                        week: value
                    });
                }
                    //监测邀请人信息变化
                else if (self.model.hasChanged("inviteInfo")) {

                    var value = self.model.get("inviteInfo");
                    self.contactComp && self.contactComp.setData({
                        contacts: value
                    });
                }
                    //监控是否显示添加地点输入框
                else if (self.model.hasChanged("useSite")) {

                    var TIPS = self.model.TIPS;
                    var text = TIPS.ADD_SITE;
                    var container = self.getElement("site").parent().parent();

                    if (self.model.get("useSite")) {
                        text = TIPS.DEL_SITE;
                        container.removeClass("hide");
                    } else {
                        container.addClass("hide");
                    }
                    self.getElement("btnSite").text(text);
                }
                    //监控是否显示添加备注输入框
                else if (self.model.hasChanged("useContent")) {

                    var TIPS = self.model.TIPS;
                    var text = TIPS.ADD_CONTENT;
                    var container = self.getElement("content").parent().parent();
                    if (self.model.get("useContent")) {
                        text = TIPS.DEL_CONTENT;
                        container.removeClass("hide");
                    } else {
                        container.addClass("hide");
                    }
                    self.getElement("btnContent").text(text);
                }
            });

            // 监控数据校验结果并实时呈现错误信息
            self.model.on(self.model.EVENTS.VALIDATE_FAILED, function (args) {

                if (!args || !args.target || !args.message)
                    return;

                var targetEl = null;
                switch (args.target) {
                    //验证主题
                    case "title": targetEl = self.getElement("title");
                        break;
                        //验证地点
                    case "site": targetEl = self.getElement("site");
                        break;
                        //验证备注
                    case "content":
                        targetEl = self.getElement("content");
                        break;
                        //验证时间
                    case "dtStart":
                        targetEl = self.getElement("starttime");
                        break;
                    case "dtEnd":
                        targetEl = self.getElement("starttime");
                        break;
                        //验证周重复后是否选择了周的某几天
                    case "sendInterval":
                        targetEl = self.getElement("week");
                        break;
                        //验证提前后的时间是否过期
                    case "enable":
                        $Msg.confirm(args.message, function () {
                            self.save(false);
                        });
                        break;
                }
                if (targetEl && targetEl.length > 0) {
                    //将滚动条滚动到顶部
                    if (targetEl.offset().top < 0) {
                        self.getElement("maincontent")[0].scrollTop = 0;
                    }
                    window.setTimeout(function () {
                        M2012.Calendar.View.ValidateTip.show(args.message, targetEl);
                    }, 100);
                }

            });

            //监控操作提示信息
            self.model.on(self.model.EVENTS.TIP_SHOW, function (args) {
                if (!args) {
                    top.M139.UI.TipMessage.hide();
                    return;
                }
                var params = args.params || {};
                top.M139.UI.TipMessage.show(args.message, params);
            });

        },

        /**
         *  设置页面Html元素事件
         **/
        initPageEvent: function () {
            var self = this;
            //主题、地点、备注 内容变化实时同步到model
            $.each([self.getElement("title"), self.getElement("site"), self.getElement("content")], function () {
                var el = this;

                //控件值发生变化后传递到后端
                el.change(function () {
                    var data = {};
                    var key = this.id.split("_")[1];

                    data[key] = $.trim(this.value);
                    self.model.set(data, {
                        validate: false,
                        target: key
                    });
                });

                //增加实时检测字数功能
                self.checkInputWords(el, Number(el.attr("maxlength")) - 2);
            });

            //返回
            self.getElement("back").click(function (e) {
                $(document.body).click();
                self.goBack(false);
            });

            // 添加(删除)地点
            self.getElement("btnSite").click(function (e) {
                self.model.set({
                    useSite: !self.model.get("useSite")
                });
                self.model.set({
                    site: ""
                });
            });

            //添加(删除)备注
            self.getElement("btnContent").click(function (e) {
                self.model.set({
                    useContent: !self.model.get("useContent")
                });
                self.model.set({
                    content: ""
                });
            });

            //点击全天、显示农历、显示结束时间等选择项
            self.getElement("check_area").click(function (e) {
                window.setTimeout(function () {
                    self.model.set({
                        allDay: self.getElement("check_allday")[0].checked ? 1 : 0,
                        calendarType: self.getElement("check_lunar")[0].checked ? 20 : 10,
                        useEndTime: self.getElement("check_endtime")[0].checked
                    });
                }, 100);
            });

            //保存
            self.getElement("btnSave").click(function (e) {
                self.save(true);
            });

            self.getElement("btnDel").click(function (e) {
                self.del();
            });

            //取消
            self.getElement("btnCancel").click(function (e) {
                self.goBack(false);
            });
        },

        /**
         *  呈现视图
        **/
        render: function () {
            var self = this;
            var html = $T.format(self.template.Content, {
                cid: self.cid
            });

            $(html).appendTo(self.container);

            //添加日历选择控件
            self.labelComp = new M2012.Calendar.View.LabelMenu({
                target: self.getElement("label"),
                master: self.master,
                width: "498px",
                onChange: function (args) {
                    if (args && args.labelId) {
                        self.model.set({ labelId: args.labelId }, {
                            silent: true
                        });
                    }
                }
            });

            //添加开始时间控件
            self.dtStartComp = new M2012.Calendar.View.DaytimePicker({
                master: self.master,
                container: self.getElement("starttime"),
                onChange: function (args) {
                    if (args && _.isDate(args.datetime)) {
                        self.model.set({ dtStart: args.datetime }, {
                            validate: true,
                            target: "dtStart"
                        });
                    }
                }
            });

            //添加结束时间控件
            self.dtEndComp = new M2012.Calendar.View.DaytimePicker({
                master: self.master,
                container: self.getElement("endtime"),
                onChange: function (args) {
                    if (args && _.isDate(args.datetime)) {
                        self.model.set({ dtEnd: args.datetime }, {
                            validate: true,
                            target: "dtEnd"
                        })
                    }
                }
            });

            //添加重复类型选择控件
            self.intervalComp = new M2012.Calendar.View.DateRepeater({
                master: self.master,
                container: self.getElement("sendinterval"),
                width: 124,
                onChange: function (args) {
                    if (args && _.isNumber(args.sendInterval)) {
                        self.model.set({
                            sendInterval: args.sendInterval
                        });
                    }
                }
            });

            //添加星期选择控件
            self.weekComp = new M2012.Calendar.View.DateWeekPicker({
                master: self.master,
                container: self.getElement("week"),
                onChange: function (args) {
                    if (args && args.week && args.week.length == 7) {
                        self.model.set({ week: args.week }, {
                            silent: true
                        });
                    }
                }
            });

            //添加提醒方式控件
            self.reminderComp = new M2012.Calendar.View.Reminder({
                container: self.getElement("reminder"),
                onChange: function (args) {
                    self.model.set({
                        beforeTime: args.beforeTime || 0,
                        beforeType: args.beforeType || 0,
                        recMySms: args.recMySms || 0,
                        recMyEmail: args.recMyEmail || 0,
                        enable: args.enable
                    }, { silent: true });
                }
            });

            self.reminderComp.timeEl.width(126);
            self.reminderComp.typeEl.removeClass("ml_10").addClass("ml_5");

            //验证码控件
            self.identifyComp = new M2012.Calendar.View.Identify({
                wrap: self.cid + '_identity',
                name: 'identity',
                titleName: '验证码',
                onChange: function (val) {
                    self.model.set({
                        validImg: val || ""
                    }, { silent: true });
                }
            });
            self.identifyComp.inputEl.width(114);
            self.identifyComp.validateImgEl.width("auto");

            //联系人选择控件
            self.contactComp = new M2012.Calendar.View.Contact({
                master: self.master,
                container: self.getElement("contact")
            }).on("change", function (args) {
                var data = null;
                if (args && args.length > 0) {
                    data = args;
                }
                self.model.set({ inviteInfo: data }, {
                    silent: true
                });
            });

            //设置页面元素相关事件
            self.initPageEvent();

            M139.Dom.setTextAreaAdaptive(self.getElement("title"), {
                //maxrows: 10,
                placeholder: '记下你准备做的事，最多输入100字',
                defaultheight: "35px",
                defaultcolor: "#333" //placeholder的颜色会比较浅,主要是为了在低版本的浏览器中实现placeholder功能
            });

            M139.Dom.setTextAreaAdaptive(self.getElement("site"), {
                //maxrows: 4,
                placeholder: '活动准备在哪里举行，最多输入100字',
                //defaultheight:"25px",
                defaultcolor: "#333"
            });

            M139.Dom.setTextAreaAdaptive(self.getElement("content"), {
                //maxrows: 4,
                placeholder: '添加点备注吧，最多输入500字',
                defaultheight: "50px",
                defaultcolor: "#333"
            });

            self.adjustHeight();
        },

        /**
         * 设置页面高度
        **/
        adjustHeight: function () {
            var self = this;
            var container = self.getElement("maincontent");
            var bodyHeight = $("body").height();
            var top = container.offset().top;
            container[0].style.overflowY = 'auto';
            container.height(bodyHeight - top);
        },

        /**
         * 实时检测输入字符长度
         * @param {jQuery Object}  inputEl     //输入框元素
         * @param {Number}         maxLength   //允许输入字符的最大长度
        **/
        checkInputWords: function (inputEl, maxLength) {
            var self = this;
            inputEl.unbind("keyup parse").bind("keyup parse", function (e) {
                var value = $.trim(inputEl.val());
                if (value.length > maxLength) {
                    inputEl.val(value.slice(0, maxLength));
                    var key = inputEl.attr("id").split("_")[1];

                    //更新数据到model
                    var data = {};
                    data[key] = $.trim(inputEl.val());
                    self.model.set(data, {
                        silent: true,
                        validate: false
                    });

                    //界面展示tips提示
                    self.model.trigger(self.model.EVENTS.VALIDATE_FAILED, {
                        target: key,
                        message: $T.format(self.model.TIPS.MAX_LENGTH, [maxLength])
                    });
                }
            });
        },

        /**
         *  提交数据到服务器
       **/
        save: function (validate) {
            var self = this;

            //对于无需验证的提交，我们也不需提示用户发送消息通知通知邀请参与人
            if (!validate) {
                self.saveData(validate);
                return;
            }
            self.model.set({ isNotify: 0 }, {
                silent: true
            });

            //编辑活动
            if (self.model.get("isEditMode")) {
                if (self.model.shouldNotify()) {
                    top.$Msg.confirm(self.model.TIPS.UPDATE_ACT_NOTIFY, function () {
                        self.model.set({ isNotify: 1 }, {
                            silent: true
                        });
                        self.saveData(validate);
                    }, function () {
                        self.saveData(validate);
                    }, { buttons: ["发送", "不发送"] });
                    return;
                }
            }

            //新增活动
            if (self.model.shouldNotify()) {
                top.$Msg.confirm(self.model.TIPS.ADD_ACT_NOTIFY, function () {
                    self.model.set({ isNotify: 1 }, {
                        silent: true
                    });
                    self.saveData(validate);
                }, function () {
                    self.saveData(validate);
                }, { buttons: ["发送", "不发送"] });
                return;
            }
            //新增活动
            self.saveData(validate);
        },

        /**
        * 保存数据到服务端
        * @param {Boolean}  validate     //是否验证输入数据
       **/
        saveData: function (validate) {
            var self = this;
            var mask = self.getElement("mask");
            //先遮挡住操作按钮
            mask.removeClass("hide");
            self.model.save(function () {
                top.M139.UI.TipMessage.show(self.model.TIPS.OPERATE_SUCCESS, {
                    delay: 3000
                });
                mask.addClass("hide");

                //如果是外部模块调用我们日历
                //则添加成功后需要通知对方
                var taskId = self.model.get("taskId");
                if (taskId) {
                    top.$App.trigger(self.model.EVENTS.ADD_CAL_SUCCESS, {
                        taskId: taskId
                    });
                }
                self.goBack(true);

            }, function (msg, result) {
                msg = msg || self.model.EVENTS.OPERATE_ERROR;
                var identify = false;

                //先检测下错误是否与验证码相关
                if (result && result.errorCode) {
                    //如果与验证码相关
                    if (self.identifyComp.handerError(result.errorCode)) {
                        self.showIdentify(self.identifyComp.isVisible());
                        identify = true;
                    }
                }
                if (!identify) {
                    msg = self.master.capi.getUnknownExceptionInfo(result.errorCode);
                    msg = msg || self.model.TIPS.OPERATE_ERROR;
                    top.M139.UI.TipMessage.show(msg, {
                        delay: 3000,
                        className: "msgRed"
                    });
                }
                mask.addClass("hide");

            }, function () {
                mask.addClass("hide");

            }, validate);
        },



        /**
         *  删除数据
        **/
        del: function () {
            var self = this;
            var mask = self.getElement("mask");
            var checkboxEl = null;
            var dialogEl = top.$Msg.showHTML(self.template.DeleteConfirm, function () {
                //获取是否通知标示
                var isNotify = checkboxEl.attr("checked") ? 1 : 0;
                var seqNo = self.model.get("seqNo");
                var fn = {
                    fnSuccess: function () {
                        top.M139.UI.TipMessage.show(self.model.TIPS.DELETE_SUCCESS, { delay: 3000 });
                        self.goBack(true);
                    },
                    fnError: function () {
                        mask.addClass("hide");
                    }
                };

                //邀请类日程
                if (self.model.get("isInvitedCalendar")) {
                    self.model.cancelInvited(
                        seqNo,
                        fn.fnSuccess,
                        fn.fnError
                    );
                    return;
                }

                //删除活动
                self.model.delCalendar({
                    seqNos: seqNo,
                    isNotify: isNotify
                },
               fn.fnSuccess,
               fn.fnError);
            }, function () {
                mask.addClass("hide");
            }, {
                dialogTitle: "删除活动",
                buttons: ["确定", "取消"]
            });
            checkboxEl = dialogEl.$el.find("input[name='isNotify']");            
            if (self.model.shouldNotify()) {
                checkboxEl.parent().removeClass("hide");
            }

        },

        /**
         * 返回
         */
        goBack: function (isRefresh) {
            var self = this;

            self.master.trigger("master:navigate", {
                path: "mainview"
            });
            if (isRefresh) {
                self.master.trigger("master:navigate", {
                    path: "mainview/refresh"
                });
            }
        },

        /**
       *  显示验证码
       */
        showIdentify: function (visible) {
            var self = this;
            var el = self.getElement("identity");
            //如果前后状态一致则无需调整弹出框位置
            if (el.is(":visible") == visible) {
                return;
            }
            visible ? el.show() : el.hide();
        },


        /**
         * 获取页面元素
         * id为{cid}_name 格式的页面元素
         * id中不需要带cid_
        **/
        getElement: function (id) {
            var self = this;
            id = $T.format("#{cid}_{id}", {
                cid: self.cid,
                id: id
            });
            return $(id);
        },

        template: {
            Content: ['<div class="outArticle">',
             '<div class="outArticleMain" style="margin:0px;">',
                 '<div class="createCon">',
                    '<div class="bgPadding">',
                        '<div class="createTop tabTitle">',
                            '<h2><span id="{cid}_page_title">创建活动</span><a href="javascript:void(0);" id="{cid}_back" class="back">&lt;&lt;返回</a></h2>',
                        '</div>',
                    '</div>',
                    '<div class="createUl" id="{cid}_maincontent">',
                        '<form>	',
                            '<fieldset class="boxIframeText">',
                             '<legend class="hide">创建活动</legend>',
                            '<ul class="form">',
                                '<li class="clearfix" id="{cid}_label">',
                                '</li>',
                                '<li class="mt_10 clearfix formLine">',
                                    '<div class="tagarea-div">',
                                        '<textarea style="display: inline; height:35px; width:488px;" maxlength="102" id="{cid}_title" class="iText tagarea"></textarea>',
                                    '</div>',
                                '</li>',
                                '<li class="formLine hide mt_10" >',
                                    '<label class="label">备注：</label>',
                                    '<div class="element">',
                                        '<textarea class="iText" id="{cid}_content" maxlength="502" style="width:403px;"></textarea>',
                                    '</div>',
                                '</li>',
                                '<li class="formLine hide">',
                                    '<label class="label">地点：</label>',
                                    '<div class="element">',
                                        '<textarea id="{cid}_site" maxlength="102" class="iText" style="width:403px;"></textarea>',
                                    '</div>',
                                '</li>',
                                '<li class="clearfix" id="{cid}_set_area">',
                                    '<a href="javascript:void(0);" id="{cid}_btnContent">添加备注</a>',
                                    '<a href="javascript:void(0);" id="{cid}_btnSite" class="ml_10">添加地点</a>',
                                '</li>',
                                '<li class="formLine mt_15">',
                                    '<label class="label">开始时间：</label>',
                                    '<div class="element" id= "{cid}_starttime">',
                                    '</div>',
                                '</li>',
                                '<li class="formLine hide" id="{cid}_endtime_area" >',
                                    '<label class="label">结束时间：</label>',
                                    '<div class="element" id= "{cid}_endtime">',
                                    '</div>',
                                '</li>',
                                '<li class="formLine">',
                                    '<label class="label">&nbsp;</label>',
                                    '<div class="element" id="{cid}_check_area">',
                                        '<input type="checkbox" class="mr_5" id="{cid}_check_endtime" name="{cid}_check_date"><label class="mr_10" for="{cid}_check_endtime">结束时间</label>',
                                        '<input type="checkbox" class="mr_5" id="{cid}_check_allday" name="{cid}_check_date"><label class="mr_10" for="{cid}_check_allday">全天</label>',
                                        '<input type="checkbox" class="mr_5" id="{cid}_check_lunar" name="{cid}_check_date"><label class="mr_10" for="{cid}_check_lunar">农历</label>',
                                    '</div>',
                                '</li>',
                                '<li class="formLine">',
                                   '<label class="label">重复：</label>',
                                   '<div class="element" id="{cid}_sendinterval">',
                                   '</div>',
                                '</li>',
                                 '<li class="formLine hide">',
                                    '<label class="label">&nbsp;</label>',
                                     '<div class="element" id="{cid}_week">',
                                    '</div>',
                                '</li>',
                                '<li class="formLine">',
                                    '<label class="label">提醒：</label>',
                                    '<div class="element" id="{cid}_reminder">',
                                    '</div>',
                                '</li>',
                                '<li class="clearfix">',
                                '</li>',
                                '<li class="formLine" id="{cid}_contact">',
                                '</li>',
                                '<li class="formLine" id="{cid}_identity" style="display:none;height:20px;">',
                                '</li>',
                            '</ul>',
                            '<div class="createBottom" style="position:relative">',
                                '<div id="{cid}_mask" style="position:absolute; top:0px; height:43px; z-index:1000;" class="blackbanner hide"></div>',
                                '<a href="javascript:void(0);" class="btnSetG" hidefocus id="{cid}_btnSave" role="button"><span>保 存</span></a>',
                                '<a href="javascript:void(0);" class="btnSet  ml_5 hide" hidefocus id="{cid}_btnDel" role="button"><span>删 除</span></a>',
                                '<a href="javascript:void(0);" class="btnSet ml_5" hidefocus id="{cid}_btnCancel" role="button"><span>取 消</span></a>',
                            '</div>',
                            '</fieldset> ',
                        '</form>',
                    '</div>',
                '</div>',
             '</div>    ',
         '</div>'].join(""),
            DeleteConfirm: [
                '<div class="norTips">',
                    '<span class="norTipsIco"><i class="i_warn"></i></span>',
                    '<dl class="norTipsContent">',
                        '<dt class="norTipsLine">确定删除活动？</dt>',
                        '<dd class="norTipsLine mt_10 hide">',
                            '<input type="checkbox" name="isNotify">&nbsp;发送通知，告知参与人您删除了活动',
                        '</dd>',
                    '</dl>',
                '</div>'].join("")
        }

    }));

    $(function () {
        var activity = new M2012.Calendar.View.Activity({
            master: window.$Cal
        });
    });

})(jQuery, _, M139, window._top || window.top);

