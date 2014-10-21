;
(function ($, _, M139, top) {

    var superClass = M139.Model.ModelBase;
    var className = "M2012.Calendar.Model.InviteActivity";

    M139.namespace(className, Backbone.Model.extend({
        name: className,
        defaults: {
            //true:编辑模式 false:添加模式
            isEditMode: false,
            //提醒信息是否发生改变
            reminderChanged: false,
            //活动序列号
            seqNo: 0,
            //活动类型 1：邀请的活动，2：共享的活动
            type: 1,
            //所属日历颜色
            color: "",
            //日历标签名称
            labelName: "",
            //日程是否启用提醒  
            //0：否  1：是
            enable: 1,
            //提醒提前时间
            beforeTime: 15,
            //提醒提前类别
            //0分, 1时, 2天, 3周,4月
            beforeType: 0,
            //用户输入的验证码
            validImg: "",
            //活动内容
            content: "",
            //标题
            title: "（无）",
            //地点
            site: "",
            //是否群日历
            isGroup: 0,
            //开始时间
            dtStart: new Date(),
            //时间描述
            dateDescript: "",
            //邀请活动发起人姓名
            trueName: "",
            //邀请信息
            inviteInfo: null,
            //验证码
            validImg: "",
            //任务ID，外部模块调用凭证
            taskId: null
        },

        //是否初始化成功
        isLoadSuccess: false,

        logger: new M139.Logger({ name: className }),

        master: null,

        EVENTS: {
            //验证失败
            VALIDATE_FAILED: "label#validate:failed",
            DATA_INIT: "label#data:init",
            TIP_SHOW: "label#tip:show:",
            ADD_LABEL_SUCCESS: "addLabelSuccess"
        },

        TIPS: {
            OPERATE_ERROR: "操作失败，请稍后再试",
            OPERATE_SUCCESS: "操作成功",
            DATA_LOADING: "正在加载中...",
            DATA_LOAD_ERROR: "数据加载失败，请稍后再试",
            MAX_LENGTH: "不能超过{0}个字符",
            LABELNAME_EMPTY: "日历名称不能为空",
            DELETE_ERROR: "删除活动失败,请重试!",
            DELETE_CONFIRM: "确定要删除该条活动吗?",
            DELETE_SUCCESS: "删除成功",
            DEF_VALUE: "（无）",
            SESSION_ERROR: "提醒时间早于当前时间,会无法下发当天之前的提醒通知",
            GROUP_LABEL_TITLE: "群日历：",
            GROUP_ACT_TITLE: "主题："
        },

        /**
         *  详细活动编辑
         *  @param {Object} args.master //视图主控
        */
        initialize: function (args) {
            var self = this;
            var data = {};
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
                var data = self.master.get("edit_detail_data");
                //清空提交过来的数据
                self.master.set({ edit_detail_data: null });

                //编辑活动模式
                if (data && _.isNumber(data.seqNo) && data.seqNo > 0 && _.isNumber(data.type)) {

                    //界面顶部展示数据加载中 
                    self.trigger(self.EVENTS.TIP_SHOW, {
                        message: self.TIPS.DATA_LOADING
                    });

                    //设置当前页面为编辑模式
                    self.set({ isEditMode: true });

                    //编辑模式需要获取服务端数据
                    self.fetch(data.seqNo, data.type, function (result) {
                        $.extend(result, {
                            type: data.type
                        });
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

                self.initData(data);
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

            data = data || {};

            for (var key in data) {
                silent = false;

                if (!_.has(self.attributes, key))
                    continue;

                var value = {};
                value[key] = data[key];
                //字符串的话需要过滤掉首尾空格
                if (typeof value[key] === "string")
                    value[key] = $.trim(value[key]);

                if (key == "dtStart") {
                    if (!_.isDate(value[key]))
                        value[key] = $Date.parse(value[key]);

                    if (!_.isDate(value[key]))
                        continue;

                }
                else if (key == "enable" || key == "beforeTime" || key == "beforeType"
                      || key == "recMySms" || key == "recMyEmail") {
                    silent = true;
                    //判断提醒信息是否变更
                    reminderChanged = true;

                }
                else if (key == "inviteInfo") {
                    var info = null;
                    //去掉自己
                    if (value[key] && value[key].length > 0) {
                        info = $.grep(value[key], function (n, i) {
                            return n.inviteAuth > -1
                        });
                    }
                    value[key] = info;
                }

                //此处对数据类型做限定，从类型上判断数据的有效性
                if (typeof self.get(key) === typeof value[key]) {
                    //更新model键值
                    self.set(value, { silent: silent });
                }
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
            return {
                seqNo: self.get("seqNo"),
                type: self.get("type"),
                recMySms: self.get("recMySms"),
                recMyEmail: self.get("recMyEmail"),
                beforeTime: self.get("beforeTime"),
                beforeType: self.get("beforeType"),
                sendInterval: self.get("sendInterval"),
                enable: self.get("enable"),
                validImg: self.get("validImg")
            };
        },

        /**
         * 获取处理后的数据
        **/
        getShareData: function () {
            var self = this;
            return {
                seqNo: self.get("seqNo"),
                title: self.get("title"),
                content: self.get("content"),
                site: self.get("site"),
                dtStart: self.get("dtStart").toString(),
                dateDescript: self.get("dateDescript")
            };
        },

        /**
         * 获取邀请人信息
        **/
        getInviteInfo: function () {
            var self = this;
            var value = self.get("inviteInfo") || [];

            if (value.length > 0) {
                return $.map(value, function (n) {
                    return {
                        statusDesc: self.getStatusDesc(n.status),
                        name: n.inviterTrueName || n.recEmail
                    }
                })
            }
            return null;
        },

        /**
        * 根据邀请状态值获取状态信息
        * @param {Number} status   //邀请状态
       **/
        getStatusDesc: function (status) {
            switch (status) {
                case 0:
                    return "未回复";
                case 1:
                    return "已接受";
                case 2:
                    return "已谢绝";
                case 3:
                    return "已删除";
                default:
                    return "未回复";
            }
        },

        /**
         * 获取实际提醒时间
        **/
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
         * 验证信息提交是的数据合法性
        **/
        validate: function () {
            var self = this;

            //当前设置为不提醒是则无需验证
            if (self.get("enable") === 1) {
                var time = self.getReminderTime();
                var now = new Date();
                return time > now;
            }
            return false;
        },


        /**
         *  查询活动数据
         *  @param {Number}     seqNo        //活动ID
         *  @param {Number}     type         //活动类型
         *  @param {Function}   fnSuccess    //成功后的执行
         *  @param {Function}   fnError      //失败后的执行
        **/
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
        * 提交数据到服务器保存
        * @param {Function} fnSuccess  执行成功后的处理函数
        * @param {Function} fnError    执行失败后的处理函数
        * @param {Function} fnFail     验证失败后的处理函数
        */
        save: function (fnSuccess, fnError, fnFail) {
            var self = this;

            //数据加载失败情况下不让提交数据
            if (!self.isLoadSuccess) {
                fnFail && fnFail();
                return;
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
                    self.logger.error("编辑日历失败！");
                },
                error: function (e) {
                    fnError && fnError(self.TIPS.OPERATE_ERROR);
                }
            };

            //提交数据
            self.master.trigger(self.master.EVENTS.REQUIRE_API, {
                success: function (api) {
                    api.setCalendarRemind(options);
                }
            });
        },

        /**
         * 删除活动
         * @param {Function} fnSuccess    //执行成功后的处理函数
         * @param {Function} fnError      //执行失败后的处理函数
         * @param {Function} fnFail       //验证失败后的处理函数
        */
        cancelInvited: function (fnSuccess, fnError, fnFail) {
            var self = this;
            self.master.trigger(self.master.EVENTS.REQUIRE_API, {
                success: function (api) {
                    api.cancelInvited({
                        data: {
                            seqNos: self.get("seqNo")
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
         * @param {Function} fnSuccess  //执行成功后的处理函数
         * @param {Function} fnError    //执行失败后的处理函数
         * @param {Function} fnFail     //验证失败后的处理函数
         */
        cancelSubscribeLabel: function (fnSuccess, fnError) {
            var self = this;

            self.master.trigger(self.master.EVENTS.REQUIRE_API, {
                success: function (api) {
                    api.cancelSubscribeLabel({
                        data: {
                            labelId: self.get("seqNo")
                        },
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
