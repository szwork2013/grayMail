;
(function ($, _, M139, top) {

    var superClass = M139.Model.ModelBase;
    var className = "M2012.Calendar.Model.ShareLabel";

    M139.namespace(className, Backbone.Model.extend({
        name: className,
        defaults: {
            //是否是处于编辑模式
            //true:编辑模式 false:添加模式
            isEditMode: false,
            //日历标签信息流水号
            seqNo: 0,
            //日历标签名称
            labelName: "",
            //标签颜色 采用#RGB的十六进制描述
            color: "",
            //标签描述
            description: "",
            //是否共享此标签
            isShare: -1,
            //是否公开此日历
            isPublic: 0,
            //是否共享日历
            isSubscribed: -1,
            //是否群日历
            isGroup: -1,
            //变更时，是否需要通知共享关系人日历更改  0：否  1：是
            isNotify: 0,
            //发布日历时的作者名称  
            author: "",
            //共享用户信息
            labelShareInfo: null,
            //真实名称
            trueName: "",
            //验证码
            validImg: "",
            //当前操作者的用户UIN
            operatorUin: 0,
            //活动变更是否短信通知 0：否 1：是
            updateSmsNotify: 0,
            //活动变更是否邮件通知 0：否 1：是
            updateEmailNotify: 0,
            //日历下有新活动创建通过邮件提醒
            newCalendarEmailNotify: 0,
            //日历下有新活动创建通过短信提醒
            newCalendarSmsNotify: 0,
            //日历下有活动删除通过邮件提醒
            deleteCalendarEmailNotify: 0,
            //日历下有活动删除通过短信提醒
            deleteCalendarSmsNotify: 0,
            //日历下有活动更新通过邮件提醒
            updateCalendarEmailNotify: 0,
            //日历下有活动更新通过短信提醒
            updateCalendarSmsNotify: 0,
            //任务id，外部模块调用凭证
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
            ADD_LABEL_TITLE: "创建日历",
            EDIT_LABEL_TITLE: "编辑日历",
            MAX_LENGTH: "不能超过{0}个字符",
            LABELNAME_EMPTY: "日历名称不能为空",
            AUTHOR_EMPTY: "要公开此日历，请输入日历作者信息",
            DELETE_ERROR: "删除日历失败,请重试!",
            SHARE_NOTIFY: "您希望向现有共享对象发送更新吗?",
            GROUP_NOTIFY: "您希望向现有参与对象发送更新吗?",
            DELETE_CONFIRM: "是否删除此日历?",
            DELETE_SUCCESS: "删除成功",
            CANCEL_SUBSCRIBE_CONFIRM: "退订后您将不能查看该日历中的活动，你确定退订吗？",
            CANCEL_SUBSCRIBE_SUCCESS: "退订成功"
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
                var data = self.master.get("edit_label_data");
                //清空提交过来的数据
                self.master.set({
                    edit_label_data: null
                }, { silent: true });

                //编辑活动模式
                if (data && _.isNumber(data.labelId) && data.labelId > 0) {

                    //界面顶部展示数据加载中 
                    self.trigger(self.EVENTS.TIP_SHOW, { message: self.TIPS.DATA_LOADING });

                    //设置当前页面为编辑模式
                    self.set({ isEditMode: true });

                    //编辑模式需要获取服务端数据
                    self.fetch(data.labelId,
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

                self.initData(data);
            });
        },

        /**
         *  填充model数据
         *  @param {Object}   data     //活动数据
         */
        initData: function (data) {
            var self = this;

            data = data || {};

            for (var key in data) {
                silent = false;

                if (!_.has(self.attributes, key))
                    continue;

                var value = {};
                value[key] = data[key];


                //此处对数据类型做限定，从类型上判断数据的有效性
                if (typeof self.get(key) === typeof value[key]) {
                    //更新model键值，不触发验证
                    self.set(value);
                }
            }
            //共享日历需要对数据进行特殊处理
            if (self.isShareOrGroup())
                self.adapterData(data);

            self.isLoadSuccess = true;
        },

        /**
         * 是否是共享日历或群日历
        **/
        isShareOrGroup: function () {
            var self = this;
            return (self.get("isShare") == 1 ||
                self.get("isGroup")) == 1 && !self.get("isSubscribed");
        },

        /**
          * 当为订阅模式需要特殊处理下消息通知标示
         **/
        adapterData: function (data) {
            var self = this;
            if (!data.operatorUin)
                return;
            if (!data.shareInfo || !data.shareInfo.length)
                return;

            var info = $.grep(data.shareInfo, function (n, i) {
                return n.shareUin == data.operatorUin;
            });

            if (info.length == 0)
                return;

            info = info[0];
            var obj = {};
            obj.newCalendarEmailNotify = info.newCalendarEmailNotify || 0;
            obj.newCalendarSmsNotify = info.newCalendarSmsNotify || 0;
            obj.deleteCalendarEmailNotify = info.deleteCalendarEmailNotify || 0;
            obj.deleteCalendarSmsNotify = info.deleteCalendarSmsNotify || 0;
            obj.updateCalendarEmailNotify = info.updateCalendarEmailNotify || 0;
            obj.updateCalendarSmsNotify = info.updateCalendarSmsNotify || 0;
            //新的字段，主要是简化上述6个提醒方式设置，目前只用于共享流程
            obj.updateSmsNotify = info.updateSmsNotify || 0;
            obj.updateEmailNotify = info.updateEmailNotify || 0;

            for (var key in obj) {
                var value = {};
                value[key] = obj[key];
                //此处对数据类型做限定，从类型上判断数据的有效性
                if (typeof self.get(key) === typeof value[key]) {
                    //更新model键值
                    self.set(value);
                }
            }
        },

        /**
         * 获取处理后的数据
        **/
        getData: function () {
            var self = this;
            return {
                labelId: self.get("seqNo"),
                newCalendarEmailNotify: self.get("newCalendarEmailNotify"),
                newCalendarSmsNotify: self.get("newCalendarSmsNotify"),
                //日历下有活动删除通过邮件提醒
                deleteCalendarEmailNotify: self.get("deleteCalendarEmailNotify"),
                //日历下有活动删除通过短信提醒
                deleteCalendarSmsNotify: self.get("deleteCalendarSmsNotify"),
                //日历下有活动更新通过邮件提醒
                updateCalendarEmailNotify: self.get("updateCalendarEmailNotify"),
                //日历下有活动更新通过短信提
                updateCalendarSmsNotify: self.get("updateCalendarSmsNotify"),
                updateSmsNotify: self.get("updateSmsNotify"),
                updateEmailNotify: self.get("updateEmailNotify"),
                validImg: self.get("validImg")
            };
        },

        /**
        *  查询活动数据
        *  @param {Number}     labelId        //日历标签ID
        *  @param {Function}   fnSuccess    //成功后的执行
        *  @param {Function}   fnError      //失败后的执行
        */
        fetch: function (labelId, fnSuccess, fnError) {
            var self = this;
            self.master.api.getLabelById({
                data: {
                    labelId: labelId
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
                    if (self.isShareOrGroup()) {
                        api.setLabelUpdateNotify(options);
                        return;
                    }
                    //设置订阅日历设置
                    api.setSubLabelUpdateNotify(options);
                }
            });
        },

        /**
         * 删除日历
         * @param {Function} fnSuccess    //执行成功后的处理函数
         * @param {Function} fnError      //执行失败后的处理函数
         * @param {Function} fnFail       //验证失败后的处理函数
        */
        deleteLabelShare: function (fnSuccess, fnError, fnFail) {
            var self = this;
            self.master.trigger(self.master.EVENTS.REQUIRE_API, {
                success: function (api) {
                    api.deleteLabelShare({
                        data: {
                            labelId: self.get("seqNo")
                        },
                        success: function (result) {
                            if (result.code == "S_OK") {
                                fnSuccess && fnSuccess(result["var"]);

                            } else {
                                fnError && fnError(self.TIPS.OPERATE_ERROR);
                                self.logger.error("删除日历失败", result);
                            }
                            fnFail && fnFail();
                        },
                        error: function (e) {
                            fnFail && fnFail();
                            fnError && fnError(self.TIPS.OPERATE_ERROR);
                        }
                    });
                }

            });
        },

        /**
         * 取消订阅该日历
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
                                fnError && fnError(self.TIPS.OPERATE_ERROR);
                                self.logger.error("取消订阅日历失败", result);
                            }
                        },
                        error: function (e) {
                            fnError && fnError(self.TIPS.OPERATE_ERROR);
                        }
                    });
                }
            });
        }
    }));

})(jQuery, _, M139, window._top || window.top);
