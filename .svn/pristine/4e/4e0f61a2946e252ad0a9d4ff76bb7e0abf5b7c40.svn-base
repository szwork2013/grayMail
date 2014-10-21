;
(function ($, _, M139, top) {

    var superClass = M139.Model.ModelBase;
    var className = "M2012.Calendar.Model.GroupLabel";

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
            //变更时，是否需要通知共享关系人日历更改  0：否  1：是
            isNotify: false,
            //共享用户信息
            labelShareInfo: null,
            //是否默认有共享联系人信息（用于编辑情况下）
            hasDefShareInfo: false,
            //验证码
            validImg: "",
            //任务id，外部模块调用凭证
            taskId: null,
            //准许自定义的日历标签个数
            labelLimit: 10,
            //活动数据
            calendars: [],
            //活动项是否已满
            calendarIsOver: false,
            //验证活动数据项
            validActData: true
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
            ADD_GROUPLABEL_SUCCESS: "addGroupLabelSuccess",
            GET_ACTIVITY_DATA: "label#getActivityData"
        },

        TIPS: {
            OPERATE_ERROR: "操作失败，请稍后再试",
            OPERATE_SUCCESS: "操作成功",
            DATA_LOADING: "正在加载中...",
            DATA_LOAD_ERROR: "数据加载失败，请稍后再试",
            ADD_LABEL_TITLE: "创建群日历",
            EDIT_LABEL_TITLE: "编辑群日历",
            MAX_LENGTH: "不能超过{0}个字符",
            LABELNAME_EMPTY: "日历名称不能为空",
            LABEL_NAME_EXIST: "此日历名已存在",
            USER_LABEL_LIMIT: "您的自定义群日历已经达到了{0}个，不能再添加",
            DELETE_ERROR: "删除日历失败,请重试!",
            SHARE_NOTIFY: "您希望向现有参与对象发送更新吗?",
            DELETE_CONFIRM: "确定要删除该条日历吗?",
            DELETE_SUCCESS: "删除成功",
            SHAREINFO_EMPTY: "请添加参与人",
            LABEL_NAME_PLACEHOLDER: "输入日历名称",
            CONTACT_PLACEHOLDER: "添加参与人"
        },

        /**
         *  新增群日历
         *  @param {Object} args.master //视图主控
        */
        initialize: function (args) {
            var self = this;
            args = args || {};
            self.master = args.master;

            self.initEvents()
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
                self.master.set({ edit_label_data: null });

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

                //以下为创建日历模式
                if (window.isCaiyun) {
                    self.master.capi.addBehavior("cal_caiyun_addlabel_load");
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

            data = data || {};
            for (var key in data) {
                silent = false;

                if (key == "shareInfo") {
                    //过滤掉自己
                    var info = $.grep(data[key], function (n, i) {
                        return n.shareType > -1
                    });
                    //设置是否有默认联系人标示
                    self.set({
                        hasDefShareInfo: info && info.length > 0
                    }, { silent: true });
                    //转换联系人信息
                    var transData = self.transShareInfo(info);
                    key = "labelShareInfo";
                    data[key] = transData;
                }

                if (!_.has(self.attributes, key))
                    continue;

                var value = {};
                value[key] = data[key];

                //此处对数据类型做限定，从类型上判断数据的有效性
                if (typeof self.get(key) === typeof value[key]) {
                    //更新model键值，不触发验证
                    self.set(value, {
                        validate: false
                    });
                }
            }

            self.isLoadSuccess = true;
        },

        /**
         * 获取处理后的数据
        **/
        getData: function () {
            var self = this;
            return {
                labelId: self.get("seqNo"),
                labelName: self.get("labelName"),
                color: self.get("color"),
                labelShareInfo: self.get("labelShareInfo") || [],
                calendars: self.get("calendars"),
                isShare: self.get("hasDefShareInfo") ? 1 : 0,
                isNotify: self.get("isNotify"),
                validImg: self.get("validImg")
            };
        },

        /**
         * 将联系人信息转换成共享人信息
         * @param {Array}  args  //联系人信息列表        
        **/
        transContact2Share: function (args) {
            if (!args || !args.length)
                return null;

            return $.map(args, function (n) {
                return {
                    shareUin: n.inviterUin,
                    shareType: n.shareType,
                    smsNotify: n.smsNotify,
                    emailNotify: n.emailNotify,
                    status: n.status
                };
            });
        },

        /**
         * 将共享人信息转换成联系人信息
         * @param {Array}  args  //联系人信息列表        
        **/
        transShare2Contact: function (args) {
            if (!args || !args.length)
                return null;
            var self = this;
            return $.map(args, function (n) {
                return {
                    inviterUin: n.shareUin,
                    recMobile: "",
                    recEmail: n.shareUin,
                    smsNotify: n.smsNotify,
                    emailNotify: n.emailNotify,
                    statusDesc: self.getStatusDesc(n.status)
                };
            });
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
         * 将查询到的共享人信息转换成需要的共享人信息
         * @param {Array}  args  //共享人信息列表        
        **/
        transShareInfo: function (args) {
            if (!args || !args.length)
                return null;
            var self = this;
            return $.map(args, function (n) {
                //先取默认邮箱地址
                var email = n.defaultEmail;
                if (!email) {
                    email = n.shareTrueName || "";
                    var domain = self.master.capi.getEmailDomain();;
                    if (email.indexOf(domain) < 0)
                        email += "@" + domain;
                }
                return {
                    shareUin: email,
                    recEmail: email,
                    shareType: n.shareType,
                    smsNotify: n.smsNotify,
                    emailNotify: n.emailNotify,
                    status: n.status
                };
            });

        },

        /**
         * 验证数据的有效性       
        **/
        validate: function (attrs, args) {
            var self = this;
            var data = attrs;

            args = args || {};
            //判断是否需要验证
            if (!args.validate)
                return null;

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

            //验证日历标签名称有效性
            var key = "labelName";
            if (_.has(data, key)) {
                var value = data[key] || "";
                if (value.length == 0)
                    return getResult(key, self.TIPS.LABELNAME_EMPTY);

                var maxLength = 30;
                if (value.length > maxLength)
                    return getResult(key, $T.format(self.TIPS.MAX_LENGTH, [maxLength]));

                var userLables = self.master.get("labelData") || {};
                userLables = userLables.userLabels || [];
                var samelabel = _.find(userLables, function (label) {
                    return label.labelName === value
                        && label.seqNo !== self.get("seqNo");
                });
                // 只有当日历标签ID不相等时才认为是日历重名
                if (samelabel) {
                    return getResult(key, self.TIPS.LABEL_NAME_EXIST);
                }
            }

            //验证共享联系人
            key = "labelShareInfo";
            if (!self.get("isEditMode") && _.has(data, key) && _.isEmpty(data[key])) {
                return getResult(key, self.TIPS.SHAREINFO_EMPTY);
            }

            return null;
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
        * @param {Boolean} validate    是否需要检查数据的合法性
        */
        save: function (fnSuccess, fnError, fnFail, validate) {
            var self = this;

            //数据加载失败情况下不让提交数据
            if (!self.isLoadSuccess) {
                fnFail && fnFail();
                return;
            }

            (function (func) {
                //检查数据的有效性
                if (validate) {
                    if (!self.isValid()) {
                        fnFail && fnFail();
                        return;
                    }
                    //添加模式时需要验证添加的活动
                    if (!self.get("isEditMode")) {
                        //检测活动项数据是否合法
                        self.trigger(self.EVENTS.GET_ACTIVITY_DATA, {
                            onVaild: function (isVaild) {
                                if (!isVaild) {
                                    fnFail && fnFail();
                                    return;
                                }
                                func();
                            }
                        });
                        return;
                    }
                }
                //当不需要验证数据时直接提交数据
                func();

            })(function () {
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
                        if (self.get("isEditMode")) {
                            api.updateLabel(options);
                            return;
                        }
                        api.addGroupLabel(options);
                    }
                });
            });

        },

        /**
         * 删除日历标签
         * @param {Number}   args.isNotify   //是否通知
         * @param {Function} fnSuccess       //执行成功后的处理函数
         * @param {Function} fnError         //执行失败后的处理函数
         * @param {Function} fnFail          //验证失败后的处理函数
        */
        deleteLabel: function (args, fnSuccess, fnError, fnFail) {
            var self = this;
            var data = $.extend({
                labelId: self.get("seqNo"),
                isDelAllCals: 1 //删除标签时，是否删除该标签下的所有日程：0:不删除, 1:删除
            }, args);

            self.master.trigger(self.master.EVENTS.REQUIRE_API, {
                success: function (api) {
                    api.deleteLabel({
                        data: data,
                        success: function (result) {
                            if (result.code == "S_OK") {
                                fnSuccess && fnSuccess(result["var"]);

                            } else {
                                fnError && fnError(self.TIPS.OPERATE_ERROR);
                                self.logger.error("删除日历标签失败", result);
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
        }


    }));

})(jQuery, _, M139, window._top || window.top);
