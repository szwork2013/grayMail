;
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
