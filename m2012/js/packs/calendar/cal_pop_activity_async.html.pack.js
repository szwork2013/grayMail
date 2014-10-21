; (function ($, _, M139, top) {

    var superclass = M139.Model.ModelBase;
    var _class = "M2012.Calendar.Model.ActivityAddPopup";
    var specialTypes = M2012.Calendar.Constant.specialType;

    /**
     * 快捷添加活动
     */
    M139.namespace(_class, superclass.extend({
        name: _class,
        //主控制器
        master: null,
        logger: new M139.Logger({ name: _class }),
        defaults: {
            //当前日期
            date: new Date(),
            //选择的时钟分钟
            time: "",
            //主题
            title: "",
            //标签Id集合
            labelId: 10,
            //特殊类型
            specialType: 0,
            //是否提醒
            enable: 1,
            //提醒提前时间
            beforeTime: 15,
            //提醒提前时间类型
            beforeType: 0,
            //提醒方式
            remindType: "",
            //验证码
            validImg: "",
            //是否全天事件
            isFullDayEvent: false,
            //是否群活动
            isGroup: false,
            //是否通知参与人
            isNotify: 0,
            //1:自己的活动 1:邀请下的活动 2:共享下的活动 3:订阅下的活动  4:群活动
            type: 0,
            //重复类型
            sendInterval: 0,
            //日历类型:10,公历,20,农历
            calendarType: 10,

            //日历的每年重复类型
            birthInterval: 6,
            birthRemindType: { //生日.默认提前3天
                beforeTime: 3,
                beforeType: 2
            },
            titleLen: 100, //普通活动的主题长度
            birthTitleLen: 20 //生日的主题长度
        },

        EVENTS: {
            //输入标题信息有误
            INPUT_TEXT_ERROR: "popadd#input_text_error"
        },

        TIPS: {
            OPERATE_ERROR: "操作失败，请稍后再试",
            SESSION_ERROR: "提醒时间早于当前时间,会无法下发当天之前的提醒通知",
            TITLE_MAX_LENGTH: "不能超过{0}个字符",
            TITLE_ERROR: "主题不能为空",
            DEFAULT_TITLE: "记下你准备做的事...",
            DEFAULT_BIRTH_TITLE: "谁的生日在这天",
            SHARE_NOTIFY_CONFIRM: "您可以发送通知，告知参与人您安排了新的活动"
        },

        initialize: function (args) {
            var self = this;
            args = args || {};
            args.params = args.params || {};
            self.master = args.master;
            self.initData(args.params);
        },

        initData: function (args) {
            var self = this;

            self.processDate(args);

            if (_.isDate(args.date))
                self.set({ date: args.date });

            //全天事件
            self.set({
                isFullDayEvent: args.isFullDayEvent ? true : false
            });
            //时间的小时分钟部分
            if (args.time)
                self.set({ time: args.time });

            self.set({
                labels: self.master.get("checklabels")
            });
            self.set({
                specialType: self.master.get("includeTypes")
            });
            //判断是否是群活动
            if (self.master.get("view_filter_flag") === "group") {
                self.set({
                    isGroup: true,
                    type: self.master.CONST.activityType.group
                });

            }
            //默认提醒
            var enable = 1;
            if (self.isDateExpired() && !self.isBirthday())
                enable = 0;
            self.set({ enable: enable });
        },

        /**
         * 处理产品需求，计算时间
         */
        processDate: function (args) {
            //根据产品新需求处理时间内容
            if (!!args) {
                //如果传入了时分部分，则以传入的时分为准
                if (args.time)
                    return;

                var inDate = args.date || new Date(),
                    today = new Date(),
                    tomorrow;

                inDate.setMilliseconds(0); //可能存在毫秒级别的差距
                //设置成今天凌晨00:00:00
                today.setHours(0);
                today.setMinutes(0);
                today.setSeconds(0);
                today.setMilliseconds(0);
                tomorrow = new Date(today);
                tomorrow.setHours(24); //明天,+24h

                if ((inDate - today) < 0) {
                    //创建昨天之前的活动,设置成全天
                    args.isFullDayEvent = true;
                } else if (inDate >= tomorrow) { //因为是从00:00:00 000开始的,所以明天开始的要用>=
                    //创建明天之后的,默认8点
                    args.time = "0800";
                }
            }
        },

        /**
         * 当前日期是否已经过期
         */
        isDateExpired: function () {
            var self = this;
            var date = self.getSelectedTime();
            var now = self.master.capi.getCurrentServerTime();

            date = self.master.capi.getNoSecondTime(date);
            now = self.master.capi.getNoSecondTime(now);
            //比较指定日期和当前日期的大小
            return self.master.capi.compareDate(date, now) == -1;
        },

        checkData: function () {
            var self = this;
            var value = { result: true, msg: "" };
            var maxLength = self.isBirthday() ? self.get("birthTitleLen") : self.get("titleLen");
            var placeholder = self.getDefaultTitle();
            var title = $.trim(self.get("title").replace(placeholder, ""));

            if (title.length == 0) {
                value.msg = self.TIPS.TITLE_ERROR;
                value.result = false;
                self.trigger(self.EVENTS.INPUT_TEXT_ERROR, value);
                return value;
            }
            if (title.length > maxLength) {
                value.msg = $T.format(self.TIPS.TITLE_MAX_LENGTH, [maxLength]);
                value.result = false;
                self.trigger(self.EVENTS.INPUT_TEXT_ERROR, value);
                return value;
            }

            //当前时间
            var now = self.master.capi.getCurrentServerTime();
            // 如果当前选择的日期已经过期或不提醒
            // 则不显示时间过期警告框(2014/03/17领导张总新需求)
            if (!self.isDateExpired() && self.get("enable") == 1) {
                var time = self.getReminderTime(),
                    specialType = self.get("specialType"),
                    specialType = specialType && specialType[0]; //神,怎么是数组

                if (time <= now && specialType !== specialTypes.birth) {
                    value.msg = self.TIPS.SESSION_ERROR;
                }
            }
            return value;
        },

        //获取默认的提示语,有普通和生日2种
        getDefaultTitle: function () {
            var _this = this;
            var isBirth = _this.isBirthday();
            var placeholder = _this.TIPS.DEFAULT_TITLE;
            if (isBirth) {
                placeholder = _this.TIPS.DEFAULT_BIRTH_TITLE;
            }
            return placeholder;
        },

        /**
         * 获取实际提醒时间
         */
        getReminderTime: function () {
            var self = this;
            var time = self.getSelectedTime();
            var difDay = 0;
            var beforeTime = self.get("beforeTime");

            switch (self.get("beforeType")) {
                case 0://分钟
                    difDay = beforeTime / (24 * 60); break;
                case 1://小时
                    difDay = beforeTime / 24; break;
                case 2://天
                    difDay = beforeTime; break;
            }
            //实际提醒的时间
            return $Date.getDateByDays(time, difDay * -1);
        },

        /**
        * 获取要提交的数据
        Native
        */
        /**
         * 获取要提交的数据
         * @param {Boolean}  args.isNative   //是否获取原生数据，对于全天事件是有对时间做处理的，isNative = ture 表示不对时间做处理（可选）
        **/
        getData: function (args) {
            var self = this;
            var data = { content: "" };
            args = args || {};

            //提醒方式常量
            var remindType = self.master.CONST.remindSmsEmailTypes;
            var isFullDayEvent = self.get("isFullDayEvent");
            var startTime = self.getSelectedTime();
            var labelId = self.get("labelId");
            var fullDayFlag = !(!!args.isNative) && isFullDayEvent;
            var time = self.master.capi.getFullDayDate(startTime, startTime, fullDayFlag);
            //如果是群活动的话
            //默认是整点免费短信提醒
            if (self.get("isGroup")) {
                self.set({
                    beforeTime: 0,
                    remindType: remindType.freeSms.value
                });
            }
            $.extend(data, {
                type: self.get("type"),
                calendarType: self.get("calendarType"),
                title: self.get("title"),
                //当有多个标签的话，默认为我的日历标签:10
                labelId: labelId ? labelId : self.master.CONST.defaultLabelId,
                allDay: isFullDayEvent ? 1 : 0,
                beforeTime: self.get("beforeTime"),
                beforeType: self.get("beforeType"),
                sendInterval: self.get("sendInterval"),
                enable: self.get("enable"),
                recMyEmail: self.get("remindType") == remindType.email.value ? 1 : 0,
                recMySms: self.get("remindType") == remindType.freeSms.value ? 1 : 0,
                recEmail: self.master.capi.getUserEmail(),
                recMobile: self.master.capi.getUserMobile(),
                dtStart: $Date.format("yyyy-MM-dd hh:mm:ss", time.startTime),
                dtEnd: $Date.format("yyyy-MM-dd hh:mm:ss", time.endTime),
                validImg: self.get("validImg"),
                expend: $Date.format("yyyy-MM-dd", time.startTime), // 快捷创建生日提醒活动新增
                isNotify: self.get("isNotify")
            });

            //特殊类型
            var type = self.get("specialType");
            if (type && type.length > 0) {
                $.extend(data, { specialType: type[0] });
            }
            return data;
        },

        //是否创建生日事件
        isBirthday: function () {
            var st = this.get("specialType") || [];
            return st[0] == M2012.Calendar.Constant.specialType.birth;
        },

        getDate: function () {
            var _this = this,
                isBirth = _this.isBirthday(),
                date = _this.get("date"),
                dateStr;

            if (isBirth) {
                var commonApi = _this.master.capi;
                var lunar = commonApi.createDateObj(date);
                dateStr = commonApi.padding(lunar.lMonth, 2) + commonApi.padding(lunar.lDay, 2);
            } else {
                dateStr = $Date.format("yyyy-MM-dd", date);
            }
            return dateStr;
        },

        /*
         * 获取当前选择的完整时间
        **/
        getSelectedTime: function () {
            var self = this;
            var date = self.get("date");
            var time = self.get("time");
            time = self.master.capi.fixHourTime(time);
            if (time && time.indexOf(":" > -1)) {
                date.setHours(Number(time.split(":")[0]));
                date.setMinutes(Number(time.split(":")[1]));
            }
            return date;
        },

        /**
         * 提交数据到服务器保存
         * @param {Function} fnSuccess  执行成功后的处理函数
         * @param {Function} fnError    执行失败后的处理函数
         */
        save: function (fnSuccess, fnError) {
            var self = this;
            var data = self.getData();
            var constant = self.master.CONST;

            self.master.trigger(self.master.EVENTS.REQUIRE_API, {
                success: function (api) {
                    api.addCalendar({
                        data: data,
                        success: function (result) {
                            if (result.code == "S_OK") {
                                fnSuccess && fnSuccess(result["var"]);

                            } else {

                                var msg = self.TIPS.OPERATE_ERROR;
                                fnError && fnError(msg, result);
                                self.logger.error("快捷添加活动失败！");
                            }
                        },
                        error: function (e) {

                            fnError && fnError(self.TIPS.OPERATE_ERROR);
                        }
                    });
                }

            });
        }
    })
    );

})(jQuery, _, M139, window._top || window.top)
﻿;
(function ($, _, M139, top) {

    var superclass = M2012.Calendar.View.Popup.Direction;
    var calendarTypes = M2012.Calendar.Constant.calendarTypes;
    var _class = "M2012.Calendar.View.ActivityAddPopup";

    /**
     *  快捷添加活动
     *  参数args：{
     *           //触发源和事件源
     *            //用于定位弹出框位置
     *            target: element,
     *            event: eventArgs,
     *            //标签
     *            labels: self.model.get("labels"),
     *            //特殊类型
     *            type: self.model.get("specialTypes"),
     *            //指定日期
     *            date: $Date.parse(date),
     *            //主控制器
     *            master: self.master,
     *            //保存成功后的回调处理
     *            callback: function () {}
     *     }
     */
    M139.namespace(_class, superclass.extend({

        name: _class,

        logger: new M139.Logger({
            name: _class
        }),

        master: null,

        model: null,

        //添加完成后的回调处理
        callback: null,

        isFullDayEvent: false,

        initialize: function (args) {
            var self = this;

            if (!args)
                args = {};

            //主控制器
            self.master = args.master;
            //活动添加成功后的处理方法
            //供调用方使用
            self.callback = function () {
                args.callback && args.callback();
            }
            self.model = new M2012.Calendar.Model.ActivityAddPopup({
                params: args,
                master: self.master
            });
            superclass.prototype.initialize.apply(self, arguments);
            self.initEvents();
        },

        //注册事件
        initEvents: function () {
            var self = this;
            var titleEl = self.getElement("txtTitle").focus(function () {
                var me = $(this);
                if (me.val() == self.model.getDefaultTitle()) {
                    me.val("").css({
                        color: "#000000"
                    });
                }
            });

            var maxLength = self.isBirthday() ?
                self.model.get("birthTitleLen") : self.model.get("titleLen");
            titleEl.unbind("keyup parse").bind("keyup parse", function (e) {
                self.checkTitleLen($(this), maxLength);
            });

            //标题信息输入有误
            self.model.on(self.model.EVENTS.INPUT_TEXT_ERROR, function (args) {
                M2012.Calendar.View.ValidateTip.show(args.msg, titleEl, true);
            });
        },

        checkTitleLen: function (input, maxlength) {
            //这货应该收敛到公共里面才好吧...
            var _this = this,
                text = input.val(),
                len = text.length,
                model = _this.model;

            if (len >= maxlength) {
                input.val(text.slice(0, maxlength));
                model.trigger(model.EVENTS.INPUT_TEXT_ERROR, {
                    msg: $T.format(model.TIPS.TITLE_MAX_LENGTH, [maxlength])
                });
            }
        },

        //添加弹出正文内容
        setContent: function (el) {
            var self = this;
            var calendarDate = M139.Date.format("yyyy年MM月dd日 星期w", self.model.get("date"));
            el.append($T.format(self.template.FORM, {
                cid: self.cid,
                date: calendarDate
            }));
            self.model.set("calendarDate", calendarDate); //缓存,方便后面勾选农历

            //主题输入框光标离开则存贮其输入值
            self.getElement("txtTitle")
                .val(self.model.getDefaultTitle())
                .css({ color: "#999999" })
                .blur(function (e) {
                    self.model.set({ title: this.value });
                });

            //创建新的时间选择控件
            var timer = new M2012.Calendar.View.TimeSelector({
                container: self.getElement("time"),
                time: self.model.get("time"),
                onChange: function (data) {
                    self.model.set({
                        time: data.time || ""
                    });
                }
            });

            //全天事件不用选时间
            if (self.model.get("isFullDayEvent")) {
                timer.hide();
            }

            var labels = self.master.getUserLabels();
            //处理群活动
            if (self.model.get("isGroup")) {
                self.getElement("reminderArea").addClass("hide");
                labels = self.master.getGroupLabels(true);
            }

            //添加日历选择控件
            //群活动和普通活动取不同的日历类型        
            self.labelComp = new M2012.Calendar.View.LabelMenu({
                target: self.getElement("label"),
                labels: labels,
                width: "222px",
                onChange: function (args) {
                    if (args && args.labelId) {
                        self.model.set({
                            labelId: args.labelId
                        });
                    }
                }
            });

            // 创建提醒方式控件
            self.reminder = new M2012.Calendar.View.Reminder({
                container: self.getElement("reminder"),
                enable: self.model.get("enable"),
                onChange: function (args) {
                    self.model.set({
                        beforeTime: args.beforeTime || 0,
                        beforeType: args.beforeType || 0,
                        remindType: args.remindType || "",
                        enable: args.enable
                    });
                }
            });

            // 验证码
            self.identifyComp = new M2012.Calendar.View.Identify({
                wrap: self.cid + '_identity',
                name: 'identity',
                titleName: '验证码',
                onChange: function (val) {
                    self.model.set({
                        validImg: val || ""
                    });
                }
            });
            self.identifyComp.inputEl.width(114);
            self.identifyComp.validateImgEl.width("auto");

            self.setBirthContent(); //检测是否生日并设置
        },

        isBirthday: function () {
            return this.model.isBirthday();
        },
        setBirthContent: function () {
            var _this = this,
                model = _this.model,
                commonApi = _this.master.capi;

            var isBirth = _this.isBirthday(); //生日
            if (isBirth) {
                _this.getElement("time").addClass("hide");
                _this.getElement("chklunar").removeClass("hide");
                _this.getElement("calendar").addClass("hide");

                var chkContainer = _this.getElement("chklunar");
                chkContainer.removeClass("hide"); //显示农历勾选
                chkContainer.find("input[type='checkbox']").off("click").on("click", function (e) {
                    //勾选或者取消农历的话,要修改展示
                    var checked = !!$(this).attr("checked"),
                        calendarType = model.get("calendarType");

                    //虽然不常用.但是缓存一下
                    var date, lunar, dateText = '';
                    if (checked) {
                        dateText = model.get("lunarDate");
                        if (!dateText) {
                            date = model.get("date");
                            lunar = commonApi.createDateObj(date);
                            dateText = lunar.ldate + " 星期" + lunar.week;
                            model.set("luanrDate", dateText);
                        }
                        calendarType = calendarTypes.lunar;
                    } else {
                        dateText = model.get("calendarDate"); //已经在setContent中保存了
                        calendarType = calendarTypes.calendar;
                    }
                    _this.getElement("timer_date").html(dateText);

                    _this.model.set({
                        calendarType: calendarType
                    });

                    e.stopPropagation(); //好像哪里又绑定了其他时间,阻止冒泡
                });

                var remindType = _this.model.get("birthRemindType");
                _this.reminder.setData(remindType);

                _this.model.set($.extend({
                    labelId: M2012.Calendar.Constant.defaultLabelId, //生日.默认搞成10,生日目前只能在我的日历下创建活动
                    sendInterval: model.get("birthInterval"),
                    isFullDayEvent: true
                }, remindType));
            }
        },

        //操作按钮
        setOptions: function (el) {
            var self = this;

            el.append($T.format(self.template.OPTIONS, {
                cid: self.cid
            }));

            self.getElement("save_button").click(function (e) {
                var validate = self.model.checkData();
                //验证没有通过   
                if (!validate.result)
                    return;

                var me = $(this);
                //通过但是需要确认的信息
                if (validate.msg != "") {
                    top.$Msg.confirm(validate.msg, function () {
                        self.saveValue();
                    });
                } else {
                    self.saveValue();
                }

            });

            self.getElement("cancel_button").click(function (e) {
                self.hide({
                    silent: true
                });
            });
        },

        /**
         *  保存活动至服务器
         */
        saveValue: function () {
            var self = this;
            var constant = self.master.CONST;

            //提交前先默认设置不提醒参与人
            self.model.set({ isNotify: 0 }, { silent: true });
            //显示遮罩层
            self.showMask();

            (function (func) {

                var labelId = self.model.get("labelId");
                //判断是否是共享、群日历
                if (self.master.isShareLabel(labelId)) {
                    top.$Msg.confirm(self.model.TIPS.SHARE_NOTIFY_CONFIRM, function () {
                        self.model.set({
                            isNotify: 1
                        }, { silent: true });
                        func();
                    }, function () {
                        func();
                    }, {
                        buttons: ["发送", "不发送"],
                        onClose: function () {
                            self.hideMask();
                        }
                    });
                    return;
                }
                //非共享日历直接提交后台
                func();

            })(function () {

                //提交数据到服务器
                self.model.save(function () {
                    top.M139.UI.TipMessage.show('添加成功', {
                        delay: 3000
                    });
                    self.master.trigger(self.master.EVENTS.LABEL_CHANGE, {
                        onrender: function () {
                            if (self.isBirthday()) {
                                // 如果点击左侧"生日提醒"菜单,在视图中添加快捷生日活动后,左侧筛选选中背景色应定位在"生日提醒"
                                self.master.trigger("changeNavColor", { cmd: "filterbirth" });
                            }
                            self.callback();
                        }
                    });

                    self.hide({ silent: true });
                    self.hideMask();

                }, function (msg, result) {
                    msg = msg || self.model.TIPS.OPERATE_ERROR;
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
                    self.hideMask();
                });
            });

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
            //重新设置下位置
            self.setPosition();
        },

        //关闭前检测
        //防止其他窗口在打开前关闭当前窗口
        onClose: function () {
            var self = this;
            var title = self.model.get("title");

            //如果用户有输入标题信息
            if (self.model.get("title")) {

                self.getElement("txtTitle").focus();
                return false;
            }

            return true;
        },

        /**
         * 增加编辑链接
         */
        setLink: function (el) {
            var self = this;

            if (self.isBirthday()) {
                el.remove(); //生日的不显示
                return;
            }

            $(this.template.LINK).appendTo(el).click(function (e) {
                var data = self.model.getData({
                    isNative: true
                });
                self.master.trigger(self.master.EVENTS.ADD_ACTIVITY, data);
            });

        },

        template: {

            FORM: ['<form class="form-addtag">',
                '<fieldset>',
                '<legend class="hide">添加日程</legend>',
                '<ul class="form">',
                '<li class="formLine">',
                '<input type="text" id="{cid}_txtTitle" class="iText iText-addzt" >',
                '</li>',
                '<li class="formLine">',
                '<label class="label">时间：</label>',
                '<div class="hankA element" id="{cid}_timer">',
                '<span class="fl form-addtag-time" id="{cid}_timer_date" style="width:137px;">{date}</span>',
                '<div id="{cid}_time"></div>',
                '<span id="{cid}_chklunar" class="textTimeLunar hide"><input type="checkbox" name="{cid}_chkbox"><label for="{cid}_chkbox">农历</label></span>',
                '</div>',
                '</li>',
                '<li id="{cid}_calendar" class="formLine">',
                '<label class="label">日历：</label>',
                '<div class="hankA element" id="{cid}_label">',
                '</div>',
                '</li>',
                '<li class="formLine" id="{cid}_reminderArea">',
                '<label class="label">提醒：</label>',
                '<div class="hankA element" id="{cid}_reminder">',
                '</div>',
                '</li>',
                '<li class="formLine" id="{cid}_identity" style="display:none;height:20px;">',
                '</li>',
                '</ul>',
                '</fieldset>',
                '</form>'
            ].join(""),

            OPTIONS: [
                '<a href="javascript:;" class="btnG" hidefocus role="button" id="{cid}_save_button">',
                '<span>保 存</span>',
                '</a> ',
                '<a href="javascript:;" class="btnTb" hidefocus role="button" id="{cid}_cancel_button">',
                '<span>取 消</span>',
                '</a>'
            ].join(""),

            LINK: '<a href="javascript:void(0)" title="">详细编辑</a>'
        }
    }));

})(jQuery, _, M139, window._top || window.top);
﻿; (function ($, _, M139, top) {

    var superClass = M139.Model.ModelBase;
    var _class = "M2012.Calendar.Model.ActivityDetailPopup";


    M139.namespace(_class, superClass.extend({

        name: _class,

        defaults: {
            //活动数据
            data: null
        },

        EVENTS: {
            CANCEL_INVITE_ERROR: "取消邀请活动失败,请重试!",
            DELETE_ERROR: "删除活动失败,请重试!",
            CANCEL_ERROR: "取消活动失败,请重试!",
            OPERATE_ERROR: "操作失败，请稍后再试!"
        },

        logger: new M139.Logger({ name: _class }),

        master: null,

        initialize: function (args) {

            var self = this;
            args = args || {};

            self.data = args.data;
            self.master = args.master;
        },

        //查询活动数据
        fetch: function (args) {

            var self = this;

            self.master.api.getCalendar({
                data: {
                    seqNo: self.seqNo,
                    type: self.type
                },
                success: function (data) {
                    self.set({ "data": data });
                    args.success && args.success();
                },
                error: function (data) {
                    args.error && args.error.call(data);
                }
            });
        },

        /*
        取消活动
          
              seqNo: 0,
              fnSuccess: Function,
              fnError:Function     
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
        },

        /*
          删除日程
          args = {
                seqNos: 0,    //日程ID 多个以逗号隔开
                isNotify: args.isNotify, //操作类型 0：删除 1：取消              
            };
        */
        delCalendar: function (args, fnSuccess, fnError) {

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
                        },
                        error: function (e) {

                            fnError && fnError(self.EVENTS.DELETE_ERROR);
                        }
                    });
                }

            });
        },

        /*
          更新邀请状态
         args = {
                  seqNos: 0, 
                  actionType: 0
                }
        */
        updateInviteStatus: function (args, fnSuccess, fnError) {

            var self = this;

            var data = $.extend({
                actionType: 0,    //0:接受； 1：拒绝
                refuseResion: ''
            }, args)

            self.master.trigger(self.master.EVENTS.REQUIRE_API, {

                success: function (api) {

                    api.updateInviteStatus({
                        data: data,
                        success: function (result) {
                            if (result.code == "S_OK") {
                                fnSuccess && fnSuccess(result["var"]);

                            } else {
                                var msg = self.EVENTS.OPERATE_ERROR;

                                fnError && fnError(msg);
                                self.logger.error(msg, result);
                            }
                        },
                        error: function (e) {

                            fnError && fnError(self.EVENTS.OPERATE_ERROR);
                        }
                    });
                }

            });

        }


    }));

})(jQuery, _, M139, window._top || window.top);
﻿
; (function ($, _, M139, top) {

    var superclass = M2012.Calendar.View.Popup.Direction;
    var _class = "M2012.Calendar.View.ActivityDetailPopup";
    var CommonAPI = M2012.Calendar.CommonAPI;

    M139.namespace(_class, superclass.extend({

        name: _class,

        logger: new M139.Logger({ name: _class }),

        stopEvent: true,

        master: null,

        //显示内容子容器对象
        subContainer: null,

        templates: {
            SHARE: '<a title="通过邮件分享该活动" href="javascript:void(0);">分享</a>',
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
        },

        /**
         *args = {
         *          target: $(dom),  //目标元素，参照元素
         *          event: event,      // 事件对象
         *          rect: {left:0,top:0,height:0,width:0} //目标元素坐标(可选)
         *          master: self.master,   // 视图主控
         *          data: data,            // 详情数据
         *          callback: Function     //刷新父页面
         *      };
         *
        */
        initialize: function (args) {

            var self = this;
            args = args || {};

            var data = args.data || null;
            self.master = args.master || null;

            self.callback = function () {
                args.callback && args.callback();
            };

            self.model = new M2012.Calendar.Model.ActivityDetailPopup({
                data: data,
                master: self.master
            });
            self.initData();
            superclass.prototype.initialize.apply(self, arguments);

        },


        initData: function () {

            var self = this;
            var data = self.model.get("data");

            if (data) {
                var args = {
                    cid: self.cid,
                    container: self,
                    master: self.master
                };
                //邀请未处理
                if (data.isInvitedCalendar) {
                    self.subContainer = data.status ?
                        //已处理
                        new M2012.Calendar.Detail.Popup.InviteAccepted(args)
                        //未处理
                       : new M2012.Calendar.Detail.Popup.InviteUnAccepted(args);
                    data.type = self.master.CONST.activityType.invited;
                }
                    //群活动
                else if (data.isGroup) {
                    self.subContainer = new M2012.Calendar.Detail.Popup.Group(args);
                    //是自己创建的活动
                    data.type = data.isOwner ? self.master.CONST.activityType.group
                        : self.master.CONST.activityType.shared;
                }
                    //订阅
                else if (data.isSubCalendar) {
                    self.subContainer = new M2012.Calendar.Detail.Popup.Subscribed(args);
                    data.type = self.master.CONST.activityType.subscribed;
                }
                    // 共享
                else if (data.isSharedCalendar) {
                    self.subContainer = new M2012.Calendar.Detail.Popup.Shared(args);
                    data.type = self.master.CONST.activityType.shared;
                }
                    //普通日历活动
                else {
                    self.subContainer = new M2012.Calendar.Detail.Popup.Myself(args);
                    data.type = self.master.CONST.activityType.myself;
                }
            }
        },

        //添加弹出正文内容
        setContent: function (el) {
            var self = this;
            self.subContainer && self.subContainer.setContent(el);
        },

        //操作按钮
        setOptions: function (el) {
            var self = this;
            self.subContainer && self.subContainer.setOptions(el);
        },

        setLink: function (el) {
            var self = this;
            self.subContainer && self.subContainer.setLink(el);
        },

        setShare: function (el) {
            // 分享,因为继承,所以在公共里面搞
            var _this = this;
            var data = _this.model.get("data");
            var UN_ACCEPT = 0; //邀请,未接受态
            var templates = _this.templates;

            //除生日外,其他都需要显示分享
            _this.lastshare = undefined;
            if (data.specialType !== M2012.Calendar.Constant.specialType.birth) {
                if (data.status == UN_ACCEPT) return; //未接受的不处理
                var share = el.append(templates.SHARE || '');
                share.bind("click", function (e) {
                    top.BH("calendar_view_clickshare");
                    var clickTime = new Date(),
                        lastTime = !!_this.lastshare ? _this.lastshare : new Date(1900); //第一次,允许点击.否则打开就立马点击分享.时间差会很小
                    if (clickTime - lastTime > 1000) { //点击之后1s内点击无效,主要防止第一次的loadjs延迟
                        _this.lastshare = clickTime;
                        _this.master.trigger(_this.master.EVENTS.SHARE_ACTIVITY, data);
                    }
                    e.stopPropagation();
                });
            }
        }

    }));

    //活动信息基类
    (function () {

        var base = M139.View.ViewBase;
        var current = "M2012.Calendar.Detail.Popup.Base";
        M139.namespace(current, base.extend({

            name: current,

            defaults: {
                cid: 0,
                data: null
            },

            //父容器
            container: null,

            //主控
            master: null,

            Events: {
                CONFIRM_INVITED_UPDATE: "您希望向现有邀请对象发送更新吗?",
                OPERATE_ERROR: "操作失败，请稍后再试！"
            },

            initialize: function (args) {
                var self = this;

                self.cid = args.cid;
                //detail页面view对象实例
                self.container = args.container;
                self.master = args.master;
                self.data = self.container.model.get("data") || {};

                base.prototype.initialize.apply(self, arguments);
            },

            setTableContent: function () {

                var self = this;
                var el = self.getElement("table");

                var ownerInviter = self.getOwnerInviter();
                var hashTab = {

                    //主题
                    title: (function () {
                        var value = $.trim(self.data.title);
                        value = self.data.title || "(无)";
                        return self.master.capi.substrAsByte(value, 40, true);

                    })(),

                    //内容
                    content: (function () {
                        var value = $.trim(self.data.content);
                        return self.master.capi.substrAsByte(value, 36, true);
                    })(),

                    //地址
                    site: (function () {
                        var value = $.trim(self.data.site);
                        return self.master.capi.substrAsByte(value, 36, true);
                    })(),

                    //时间描述
                    dateDescript: $.trim(self.data.dateDescript),

                    //提醒
                    remind: self.getRemind(),

                    //发起人
                    sponsor: ownerInviter['invited'].length > 0 ? ownerInviter['owner'].join(",") : "",

                    //邀请状态
                    invitedstatus: ownerInviter['invitedstatus'],

                    //邀请人
                    invited: ownerInviter['invited'].join(","),

                    //日历所有人
                    owner: self.data.owner || "",

                    //共享人
                    share: self.data.share || "",

                    //导入通讯录设置好友生日的好友邮箱
                    friendEmail: self.data.extInfo ? self.data.extInfo.email : "",

                    //导入通讯录设置好友生日的手机号
                    friendMobile: self.data.extInfo ? self.data.extInfo.mobile : ""
                }

                //生日提醒
                if (self.data.specialType == M2012.Calendar.Constant.specialType.birth) {

                    $.extend(hashTab, {
                        //生日主题
                        birthTitle: self.data.title ? self.data.title + "生日" : "",
                        //生日时间
                        birthday: self.data.dateDescript || "",
                        //生日备注
                        birthRemark: self.data.content || "",
                        //提醒类型
                        birthRemind: self.getRemind()
                    });
                }

                for (var key in hashTab) {
                    var el = self.getElement(key);
                    var value;

                    value = $T.Html.encode(hashTab[key]);
                    if (self.data.specialType == M2012.Calendar.Constant.specialType.countDown) {
                        if (key == 'remind') {
                            // 倒计时的提醒方式,当过期时,提示"已经过期",self.getElement('remind').html()返回值为"（该提醒已过期）",否则返回""
                            value = value + self.getElement('remind').html();
                        }
                    }

                    if (value) {
                        el.html(value);
                    } else {
                        el.parent().hide();
                    }
                }

                if (self.data['sponsor'] || self.data['owner']
                    || self.data['inviter'] || self.data['share']) {

                    el.addClass('tips-shcdule-detail');
                } else {

                    el.removeClass('tips-shcdule-detail');
                }
            },

            //设置详情标题信息
            setTitle: function () {

                var self = this;
                var value = "";
                if (self.data.color) {
                    value = $TextUtils.htmlEncode(self.data.color);
                    self.getElement("tagClass").css('background-color', value);
                }

                if (self.data.title) {
                    //value = $TextUtils.htmlEncode(self.data.title);
                    //self.getElement("title").attr('title', value);

                    var title = self.data.title.replace(/\'/i, "\\\'").replace(/\"/i, '\\\"');
                    self.getElement("title").attr('title', self.data.title);
                }

                if (self.data.dateDescript) {
                    value = $TextUtils.htmlEncode(self.data.dateDescript);
                    self.getElement("dateDescript").attr('title', value);
                }
            },

            //获取邀请信息
            getOwnerInviter: function () {
                var self = this;
                var result = { owner: [], invited: [], invitedstatus: '' };
                var data = self.data;

                var inviteInfos = data['inviteInfo'];

                if (inviteInfos) {

                    var accepted = 0, rejected = 0, unhandler = 0;
                    var allstatus = [0, 0, 0];//对应顺序:未处理,已接受,已拒绝
                    for (var i = 0; i < inviteInfos.length; i++) {

                        if (inviteInfos[i].inviteAuth === -1) {

                            result.owner.push(data.trueName);
                        } else {
                            var status = inviteInfos[i].status; //0:未处理，1:已处理，2:已拒绝
                            allstatus[status] += 1; //累计
                            if (inviteInfos[i].status != 2) {//拒绝的过滤掉

                                result.invited.push(inviteInfos[i].inviterTrueName);
                            }
                        }
                    }
                    if (parseInt(allstatus.join(""), 10) > 0) { //未邀请别人时，内容为空，默认不显示
                        result.invitedstatus = $T.format("{accept}人已接受，{reject}人已谢绝，{unhandler}人未处理", {
                            accept: allstatus[1],
                            reject: allstatus[2],
                            unhandler: allstatus[0]
                        });
                    }
                }

                return result;
            },

            /**
             * 获取提醒信息描述
             * 如："提前15分钟,邮件提醒"
             */
            getRemind: function () {

                var self = this;
                var data = self.data;
                var value = "";

                if (!data.enable)
                    return value;

                var master = self.container.master;
                var constant = master.CONST;
                var before = data.beforeTime + constant.remindBeforeType[data.beforeType];

                var type = "" + data.recMySms + data.recMyEmail;
                type = (type == "01" || type == "11") ? "1" : type;

                var remindType = constant.remindSmsEmailType[type];
                var smsmobile = remindType ? "," + remindType : "";

                //是否已经取消
                if (data.beforeTime == 0 && data.enable) //任务邮件         
                    value = '准点提醒' + smsmobile;
                else
                    value = data.enable ? ("提前" + before + smsmobile) : "";

                return value;

            },

            /**
             * 获取Dom元素
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
             * 设置内容
             */
            setContent: function (el) {
                this.setTitle();
                this.setTableContent();
            },

            /**
             * 设置操作
             */
            setOptions: function el() { },

            setLink: function (el) { },

            /**
            * 编辑
            */
            onEdit: function () {
                var self = this;
                var args = {
                    seqNo: self.data.seqNo,
                    type: self.data.type
                };

                //触发事件编辑
                self.master.trigger(self.master.EVENTS.EDIT_ACTIVITY, args);
                // 隐藏弹出框
                self.container.hide({ silent: true, ignore: true });
            },

            /**
             * 取消
             */
            onCancel: function () {
                this.container.hide({ silent: true, ignore: true });
            },

            /**
             * 发贺卡
             */
            sendCard: function (data) {
                var self = this;
                var email, domain = "139.com";
                //添加行为日志
                self.master.capi.addBehavior("calendar_sendcard_click");

                var postcardId = top.SiteConfig.calendarPostcard;
                var friendAddr = " ";  //从通讯录导入生日提醒获取的邮件地址
                if (data.emailAddress) {
                    email = data.emailAddress;
                    if (!$Email.isEmailAddr(email)) { //不是邮箱给加上后缀
                        email = email + "@" + top.SiteConfig.mailDomain; //已经判断过window.isCaiyun 了
                    }
                    friendAddr = email;
                }
                top.$App.show("greetingcard", "&email=" + friendAddr + "&materialId=" + postcardId);     //materialId是跳转到指定的某一张生日贺卡
            },

            /**
             *  操作失败后的统一处理  
             */
            onFail: function () {
                var self = this;
                top.M139.UI.TipMessage.show(self.Events.OPERATE_ERROR, {
                    delay: 3000,
                    className: "msgRed"
                });
                //隐藏操作按钮遮罩层
                self.container.hideMask();
            },

            /**
             * 是否应该向用户发送通知
            **/
            shouldNotify: function () {
                var self = this;
                var inviteInfo = self.data.inviteInfo;
                var value = false;

                if (inviteInfo && inviteInfo.length > 0) {
                    var filter = $.grep(inviteInfo, function (n, i) {
                        return n.inviteAuth !== -1;
                    });
                    if (filter.length > 0)
                        value = true;
                }

                if (!value) {
                    var labelId = self.data.labelId;
                    value = self.master.isShareLabel(labelId);
                }
                return value;
            },

            //删除
            onDelete: function (el) {
                var self = this;
                var checkboxEl = null;
                var dialogEl = top.$Msg.showHTML(self.container.templates.DeleteConfirm, function () {
                    //显示操作按钮遮罩层
                    self.container.showMask();
                    //查看日程类型
                    //邀请类日程
                    if (self.data.isInvitedCalendar) {
                        self.container.model.cancelInvited(self.data.seqNo, function () {
                            top.M139.UI.TipMessage.show('删除成功', { delay: 3000 });
                            self.onRemove({ seqNo: self.data.seqNo });
                        }, function () {
                            self.onFail();
                        });
                        return;
                    }
                    var isNotify = checkboxEl.attr("checked") ? 1 : 0;
                    var data = {
                        seqNos: self.data.seqNo,
                        isNotify: isNotify
                    };
                    self.container.model.delCalendar(data, function () {
                        top.M139.UI.TipMessage.show('操作成功', { delay: 3000 });
                        self.onRemove({ seqNo: self.data.seqNo });
                    }, function () {
                        self.onFail();
                    });

                }, function () {
                    self.container.hideMask();
                }, {
                    dialogTitle: "删除活动",
                    buttons: ["确定", "取消"]
                });
                checkboxEl = dialogEl.$el.find("input[name='isNotify']");
                if (self.shouldNotify()) {
                    checkboxEl.parent().removeClass("hide");
                }
            },

            //接受
            onAccept: function (el) {

                var self = this;
                //显示操作按钮遮罩层
                self.container.showMask();

                self.container.model.updateInviteStatus({
                    seqNos: self.data.seqNo,
                    actionType: 0

                }, function () {
                    top.M139.UI.TipMessage.show('已接受', { delay: 3000 });
                    self.onRemove({ seqNo: self.data.seqNo });

                }, function () {
                    self.onFail();
                });
            },

            //谢绝
            onConfuse: function (el) {
                var self = this;
                $Msg.confirm('确定谢绝该活动吗?', function () { // 提示窗口,防止误操作
                    self.container.model.updateInviteStatus({
                        seqNos: self.data.seqNo,
                        actionType: 1

                    }, function () {
                        top.M139.UI.TipMessage.show('已谢绝', { delay: 3000 });
                        self.onRemove({ seqNo: self.data.seqNo });

                    }, function () {
                        self.onFail();
                    });
                });
            },

            /**
             * 当有活动被移除时的处理
             */
            onRemove: function (args) {
                var self = this;
                self.container.hide({ silent: true, ignore: true });
                self.container.callback(args);
            }

        }));
    })();

    //邀请的未处理活动
    (function () {

        // 邀请的未处理活动
        // args: { container: Object, cid : String}
        var base = M2012.Calendar.Detail.Popup.Base;
        var current = "M2012.Calendar.Detail.Popup.InviteUnAccepted";

        M139.namespace(current, base.extend({

            name: current,

            initialize: function (args) {
                var self = this;
                base.prototype.initialize.apply(self, arguments);
            },

            //初始化页面元素事件
            initEvents: function () {

            },

            //设置内容
            setContent: function (el) {
                var self = this;

                el.append($T.format(self.template.content, {
                    cid: self.cid,
                    title: $TextUtils.htmlEncode(self.data.title || ""),
                    date: $TextUtils.htmlEncode(self.data.dateDescript || ""),
                    subject: self.data.trueName ? ($TextUtils.htmlEncode(self.data.trueName + "给您发来活动邀请")) : ""
                }));
            },

            //设置操作
            setOptions: function (el) {
                var self = this;

                el.append($T.format(self.template.buttons, { cid: self.cid }));
                //接受
                self.getElement("btn_accept").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.onAccept($(this));
                });
                // 拒绝
                self.getElement("btn_confuse").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.onConfuse($(this));
                });

                self.container.showCloseBtn();
            },

            template: {

                content: [
                    '<div class="divtext">',
                        '<span id="{cid}_invitedsubject" >{subject}</span>',
                    '</div>',
                    '<table class="tips-shcdule-table">',
                        '<tbody>',
                            '<tr>',
                                '<td class="td1 td1_w gray">活动主题：</td>',
                                '<td>{title}</td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1 td1_w gray">活动时间：</td>',
                                '<td>{date}</td>',
                            '</tr>',
                            '</tbody>',
                    '</table>'
                ].join(""),

                buttons: [
                    '<a href="javascript:;" class="btnG" hidefocus role="button" id="{cid}_btn_accept">',
                        '<span>接 受</span>',
                    '</a> ',
                    '<a href="javascript:;" class="btnTb" hidefocus role="button" id="{cid}_btn_confuse">',
                        '<span>谢 绝</span>',
                    '</a>'
                ].join("")

            }
        }

       ));


    })();

    //邀请的已处理活动
    (function () {

        // 邀请的已处理活动
        // args: { container: Object, cid : String}
        var base = M2012.Calendar.Detail.Popup.Base;
        var current = "M2012.Calendar.Detail.Popup.InviteAccepted";

        M139.namespace(current, base.extend({

            name: current,

            initialize: function (args) {
                var self = this;
                base.prototype.initialize.apply(self, arguments);
            },

            setContent: function (el) {
                var self = this;

                el.append($T.format(self.template.content, { cid: self.cid }));
                //如果是生日提醒
                if (self.data.specialType == M2012.Calendar.Constant.specialType.birth) {

                    self.getElement("table").hide();
                    self.getElement("userScheTit").hide();

                    //显示生日相关内容
                    self.getElement("birthScheTit").show();
                    self.getElement("birthTable").show();
                }

                //填充数据
                base.prototype.setContent.apply(self, arguments);
            },

            setOptions: function (el) {
                var self = this;
                el.append($T.format(self.template.buttons, { cid: self.cid }));

                //编辑
                self.getElement("edit").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.master.trigger(self.master.EVENTS.EDIT_ACTIVITY, {
                        seqNo: self.data.seqNo || 0,
                        type: 1
                    });
                });

                //删除
                self.getElement("del").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.onDelete($(this));
                });

                //取消
                self.getElement("cancel").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.onCancel($(this));
                });
            },

            setLink: function (el) {
                var self = this;
                //生日提醒发贺卡
                if (self.data.specialType == M2012.Calendar.Constant.specialType.birth) {
                    if (!window.isCaiyun) {
                        var html = $T.format(self.template.sendCard, { cid: self.cid });
                        $(html).appendTo(el).click(function (e) {
                            M139.Event.stopEvent(e);
                            self.sendCard(self.data);
                        });
                    }
                }
            },

            template: {
                content: [
                   '<div class="divtext" id="{cid}_userScheTit">', //userScheTitEl
                        '<span class="ad-tagt" id="{cid}_tagClass"></span>',//colorEl
                        '<span id="{cid}_title" ></span>',//titleEl
                        '<span id="{cid}_invitedsubject" ></span>',
                    '</div>',
                     '<div class="divtext" id="{cid}_birthScheTit" style="display:none;">',
                        '<i class="birthIcon mr_10" style="top:0; *top:-2px"></i>',
                        '<span id="{cid}_birthTitle"></span>',
                    '</div>',
                     //生日活动弹框内容start
                    '<table class="tips-shcdule-table" id="{cid}_birthTable" style="display:none;">',
                        '<tbody>',
                            '<tr>',
                                '<td class="td1">生日：</td>',
                                '<td id="{cid}_birthday"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">备注：</td>',
                                '<td id="{cid}_birthRemark"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">提醒：</td>',
                                '<td id="{cid}_birthRemind"></td>',
                            '</tr>',
                        '</tbody>',
                    '</table>',
                    '<table class="tips-shcdule-table" id="{cid}_table">',//tableEl
                        '<tbody>',
                            '<tr>',
                                '<td class="td1">备注：</td>',
                                '<td id="{cid}_content"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">地点：</td>',
                                '<td id="{cid}_site"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">时间：</td>',
                                '<td id="{cid}_dateDescript"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">提醒：</td>',
                                '<td id="{cid}_remind"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">发起人：</td>',
                                '<td id="{cid}_sponsor"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">邀请人：</td>',
                                '<td id="{cid}_invitedstatus"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">日历所有人：</td>',
                                '<td id="{cid}_owner"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">共享人：</td>',
                                '<td id="{cid}_share"></td>',
                            '</tr>',
                        '</tbody>',
                    '</table>'
                ].join(""),

                sendCard: '<a href="javascript:void(0)" id="{cid}_sendCard">发祝福</a>',

                buttons: [
                        '<a href="javascript:void(0)" id="{cid}_edit" class="btnTb">',
                            '<span>编 辑</span>',
                        '</a> ',
                        '<a bh="calendar_remider-del" href="javascript:void(0)" id="{cid}_del" class="btnTb">',
                            '<span>删 除</span>',
                        '</a> ',
                        '<a href="javascript:void(0)" id="{cid}_cancel" class="btnTb">',
                            '<span>取 消</span>',
                        '</a>'
                ].join("")
            }

        }));

    })();

    //共享的活动
    (function () {

        // 共享的活动
        var base = M2012.Calendar.Detail.Popup.Base;
        var current = "M2012.Calendar.Detail.Popup.Shared";

        M139.namespace(current, base.extend({

            name: current,

            initialize: function (args) {
                var self = this;
                base.prototype.initialize.apply(self, arguments);
            },

            //设置内容
            setContent: function (el) {
                var self = this;
                el.append($T.format(self.template.content, { cid: self.cid }));

                //如果是生日提醒
                if (self.data.specialType == M2012.Calendar.Constant.specialType.birth) {

                    self.getElement("table").hide();
                    self.getElement("userScheTit").hide();

                    //显示生日相关内容
                    self.getElement("birthScheTit").show();
                    self.getElement("birthTable").show();
                }
                //订阅者不显示邀请信息
                self.getElement("invitedstatus").parent().hide();

                //调用基类方法填充数据
                base.prototype.setContent.apply(self, arguments);
            },

            //设置操作
            setOptions: function (el) {
                var self = this,
                    seqNo = self.data.seqNo || 0;
                el.append($T.format(self.template.buttons, { cid: self.cid }));
                self.getElement("view").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.master.trigger(self.master.EVENTS.EDIT_ACTIVITY, {
                        seqNo: seqNo,
                        type: 2
                    });
                });

                //取消
                self.getElement("cancel").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.onCancel();
                });
            },

            setLink: function (el) {
                var self = this;
                //生日提醒发贺卡
                if (self.data.specialType == M2012.Calendar.Constant.specialType.birth) {
                    if (!window.isCaiyun) {
                        var html = $T.format(self.template.sendCard, { cid: self.cid });
                        $(html).appendTo(el).click(function (e) {
                            M139.Event.stopEvent(e);
                            self.sendCard(self.data);
                        });
                    }
                }
            },

            template: {
                content: [
                   '<div class="divtext" id="{cid}_userScheTit">', //userScheTitEl
                        '<span class="ad-tagt" id="{cid}_tagClass"></span>',//colorEl
                        '<span id="{cid}_title" ></span>',//titleEl
                    '</div>',
                    '<table class="tips-shcdule-table" id="{cid}_table">',//tableEl
                        '<tbody>',
                            '<tr>',
                                '<td class="td1">备注：</td>',
                                '<td id="{cid}_content"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">地点：</td>',
                                '<td id="{cid}_site"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">时间：</td>',
                                '<td id="{cid}_dateDescript"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">提醒：</td>',
                                '<td id="{cid}_remind"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">发起人：</td>',
                                '<td id="{cid}_sponsor"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">邀请人：</td>',
                                '<td id="{cid}_invitedstatus"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">日历所有人：</td>',
                                '<td id="{cid}_owner"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">共享人：</td>',
                                '<td id="{cid}_share"></td>',
                            '</tr>',
                        '</tbody>',
                    '</table>'
                ].join(""),

                buttons: [
                        '<a href="javascript:void(0)" id="{cid}_view" class="btnTb">',
                            '<span>查 看</span>',
                        '</a> ',
                        '<a href="javascript:void(0)" id="{cid}_cancel" class="btnTb">',
                            '<span>取 消</span>',
                        '</a>'
                ].join("")
            }

        }));

    })();

    //订阅类型活动
    (function () {

        //订阅
        var base = M2012.Calendar.Detail.Popup.Shared;
        var current = "M2012.Calendar.Detail.Popup.Subscribed";

        M139.namespace(current, base.extend({

            name: current,

            initialize: function (args) {
                var self = this;
                base.prototype.initialize.apply(self, arguments);
            },
            setContent: function (el) {
                var self = this;

                //调用基类方法呈现内容
                base.prototype.setContent.apply(self, arguments);
                //订阅的日历不显示提醒信息
                self.getElement("remind").parent().hide();
            },
            setOptions: function (el) {
                var self = this,
                    seqNo = self.data.seqNo;

                el.append($T.format(self.template.buttons, { cid: self.cid }));

                // 查看已经订阅的活动,覆盖父类的setOptions方法
                self.getElement("view").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.master.trigger(self.master.EVENTS.EDIT_ACTIVITY, {
                        seqNo: seqNo,
                        type: 3
                    });
                });

                //取消
                self.getElement("cancel").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.onCancel();
                });
            }

        }));

    })();

    //订阅类型活动
    (function () {

        //订阅
        var base = M2012.Calendar.Detail.Popup.Shared;
        var current = "M2012.Calendar.Detail.Popup.Group";

        M139.namespace(current, base.extend({

            name: current,

            initialize: function (args) {
                var self = this;
                base.prototype.initialize.apply(self, arguments);
            },
            setContent: function (el) {
                var self = this;
                //调用基类方法呈现内容
                base.prototype.setContent.apply(self, arguments);
            },
            setOptions: function (el) {
                var self = this,
                    seqNo = self.data.seqNo;

                el.append($T.format(self.OperateHtml, { cid: self.cid }));

                //是自己创建的群活动需要重新设置下类型，走编辑群活动流程
                if (self.data.isOwner) {
                    self.getElement("edit").removeClass("hide");
                    self.getElement("del").removeClass("hide");
                    self.getElement("view").addClass("hide");
                }

                //删除
                self.getElement("edit").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.onEdit();
                });
                //删除
                self.getElement("del").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.onDelete();
                });

                // 查看已经订阅的活动,覆盖父类的setOptions方法
                self.getElement("view").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.onEdit();
                });

                //取消
                self.getElement("cancel").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.onCancel();
                });
            },
            OperateHtml: [
              '<a href="javascript:void(0)" id="{cid}_edit" class="btnTb hide">',
                  '<span>编 辑</span>',
              '</a> ',
              '<a bh="calendar_remider-del" href="javascript:void(0)" id="{cid}_del" class="btnTb hide">',
                  '<span>删 除</span>',
              '</a> ',
              '<a href="javascript:void(0)" id="{cid}_view" class="btnTb">',
                  '<span>查 看</span>',
              '</a> ',
              '<a href="javascript:void(0)" id="{cid}_cancel" class="btnTb">',
                  '<span>取 消</span>',
              '</a>'
            ].join("")
        }));

    })();

    (function () {

        // 我的日历下活动
        var base = M2012.Calendar.Detail.Popup.Base;
        var current = "M2012.Calendar.Detail.Popup.Myself";

        M139.namespace(current, base.extend({

            name: current,

            initialize: function (args) {
                var self = this;
                base.prototype.initialize.apply(self, arguments);
            },

            //设置内容
            setContent: function (el) {
                var self = this;

                el.append($T.format(self.template.content, { cid: self.cid }));
                //如果是生日提醒
                if (self.data.specialType == M2012.Calendar.Constant.specialType.birth) {

                    self.getElement("table").hide();
                    self.getElement("userScheTit").hide();

                    //显示生日相关内容
                    self.getElement("birthScheTit").show();
                    self.getElement("birthTable").show();
                }
                if (self.data.specialType == M2012.Calendar.Constant.specialType.countDown) {
                    // 倒计时
                    var srcData = self.data,
                        startDate = srcData.startDate,
                        startTime = srcData.startTime,
                        beginTime = (startTime.length < 4) ? "0" + startTime : startTime, // "800"转换成"0800"的情况
                        datetime = new Date(startDate.replace(/-/g, "/") + " " + beginTime.substring(0, 2) + ":" + beginTime.substring(2)),
                        remindContent = self.getElement("remind").html();

                    // 提醒默认不显示
                    //self.contentEl.parent().hide();
                    // TODO 编辑功能未完成,暂时先屏蔽
                    //self.editEl.hide();
                    M2012.Calendar.CommonAPI.calculateCountdown(datetime, function (param) {
                        if (param.expired) {
                            // 过期显示"该提醒已过期"
                            self.getElement("remind").html("<span style='color: #DE0202;'>（该提醒已过期）</span>");
                        } else {
                            // 未过期时正常显示倒计时
                            var html = "";
                            html = html + "<em>距今还有</em>"
                                + "<i>" + param.days + "</i>"
                                + "<span>天</span>"
                                + "<i>" + param.hours + "</i>"
                                + "<span>时</span>"
                                + "<i>" + param.minutes + "</i>"
                                + "<span class='last'>分</span>";
                            //self.getElement("remind").html(remindContent);
                            self.getElement("countdowntable").find("div").html(html);
                            self.getElement("countdowntable").show();
                        }
                    });
                }

                //调用基类方法填充数据
                base.prototype.setContent.apply(self, arguments);
            },

            //设置操作
            setOptions: function (el) {
                var self = this;

                el.append($T.format(self.template.buttons, {
                    cid: self.cid
                }));
                //编辑
                self.getElement("edit").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.onEdit();
                });
                //删除
                self.getElement("del").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.onDelete($(this));
                });
                //取消
                self.getElement("cancel").click(function (e) {
                    M139.Event.stopEvent(e);
                    self.onCancel();
                });
            },

            setLink: function (el) {
                var self = this;
                //生日提醒发贺卡
                if (self.data.specialType == M2012.Calendar.Constant.specialType.birth) {
                    if (!window.isCaiyun) {
                        var html = $T.format(self.template.sendCard, { cid: self.cid });
                        $(html).appendTo(el).click(function (e) {
                            M139.Event.stopEvent(e);
                            self.sendCard(self.data);
                        });
                    }
                }
            },

            template: {
                content: [
                   '<div class="divtext" id="{cid}_userScheTit">', //userScheTitEl
                        '<span class="ad-tagt" id="{cid}_tagClass"></span>',//colorEl
                        '<span id="{cid}_title" ></span>',//titleEl
                        '<span id="{cid}_invitedsubject" ></span>',
                    '</div>',
                     '<div class="divtext" id="{cid}_birthScheTit" style="display:none;">',
                        '<i class="birthIcon mr_10" style="top:0; *top:-2px"></i>',
                        '<span id="{cid}_birthTitle"></span>',
                    '</div>',
                     //生日活动弹框内容start
                    '<table class="tips-shcdule-table" id="{cid}_birthTable" style="display:none;">',
                        '<tbody>',
                            '<tr>',
                                '<td class="td1">生日：</td>',
                                '<td id="{cid}_birthday"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">备注：</td>',
                                '<td id="{cid}_birthRemark"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">提醒：</td>',
                                '<td id="{cid}_birthRemind"></td>',
                            '</tr>',
                        '</tbody>',
                    '</table>',
                    '<table class="tips-shcdule-table" id="{cid}_table">',//tableEl
                        '<tbody>',
                            '<tr>',
                                '<td class="td1">备注：</td>',
                                '<td id="{cid}_content"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">地点：</td>',
                                '<td id="{cid}_site"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">时间：</td>',
                                '<td id="{cid}_dateDescript"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">提醒：</td>',
                                '<td id="{cid}_remind"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">发起人：</td>',
                                '<td id="{cid}_sponsor"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">邀请人：</td>',
                                '<td id="{cid}_invitedstatus"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">日历所有人：</td>',
                                '<td id="{cid}_owner"></td>',
                            '</tr>',
                            '<tr>',
                                '<td class="td1">共享人：</td>',
                                '<td id="{cid}_share"></td>',
                            '</tr>',
                        '</tbody>',
                    '</table>',
                    /* 倒计时活动的显示视图,默认隐藏 */
                    '<table style="width:320px;display:none;" id="{cid}_countdowntable">',
                        '<tbody>',
                            '<tr><td>',
                                '<div class="norTipsTime clearfix"></div>',
                            '</td></tr>',
                        '</tbody>',
                    '</table>'
                ].join(""),

                sendCard: '<a href="javascript:void(0)" id="{cid}_sendCard">发祝福</a>',

                buttons: [
                        '<a href="javascript:void(0)" id="{cid}_edit" class="btnTb">',
                            '<span>编 辑</span>',
                        '</a> ',
                        '<a bh="calendar_remider-del" href="javascript:void(0)" id="{cid}_del" class="btnTb">',
                            '<span>删 除</span>',
                        '</a> ',
                        '<a href="javascript:void(0)" id="{cid}_cancel" class="btnTb">',
                            '<span>取 消</span>',
                        '</a>'
                ].join("")
            }

        }));

    })();

})(jQuery, _, M139, window._top || window.top);

