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