; (function ($, _, M139, top) {
    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.Color";

    M139.namespace(_class, superClass.extend({

        name: _class,
        //视图数据模型
        model: null,
        //视图主控
        master: null,
        //控件父容器
        container: null,
        currentEl: null,
        /*  时间改变后的触发事件
         *  @param {Boolean}  args.setLunar   //是否农历(可选)
        **/
        onChange: function (date) {

        },

        /**
         *  颜色选择控件       
         *  @param {Object}   args.master     //日历视图主控
         *  @param {Object}   args.container  //父容器,jQuery对象
         *  @param {Date}     args.color      //指定的颜色值(可选)
         *  @param {Boolean}  args.isEnabled  //是否农历(可选)
         *  @param {Function} args.onChange   //数据改变后的回调(还可以注册控件的change事件)
        **/
        initialize: function (args) {
            var self = this;

            args = args || {};
            self.master = args.master;
            if (args.container)
                self.container = args.container;

            self.onChange = function (date) {
                args.onChange && args.onChange(date);
            }

            self.model = new M2012.Calendar.Model.Color(args);
            self.initEvents();
            self.render();
            self.initControls();
            self.notifyChanged();
        },

        /**
         * 注册事件
         */
        initEvents: function () {
            var self = this;
            //注册model数据改变事件
            self.model.on("change", function () {
                if (self.model.hasChanged("color")) {
                    self.initControls();
                    self.notifyChanged();
                }
            });
            //注册初始化空间数据事件
            self.on("init", function (args) {
                self.setData(args);
            })
        },

        /**
         * 初始化页面控件值
         */
        initControls: function () {
            var self = this;
            var color = self.model.get("color");
            var exp = $T.format("i[col='{0}']", [color]);
            self.container.find("i[col]").removeClass("focus");
            self.container.find(exp).addClass("focus");
        },

        /**
         * 通知调用方数据发生了改变
         */
        notifyChanged: function () {
            var self = this;
            var args = {
                color: self.model.get("color")
            };
            self.onChange(args);
            self.trigger("change", args);
        },

        /**
         * 呈现视图
         */
        render: function () {
            var self = this;
            var template = _.template(self.template);
            var html = template(self.model.COLORS);
            self.$el.remove();
            self.currentEl = $(html).appendTo(self.container);

            //注册页面颜色项点击事件
            self.container.find("i").click(function (e) {
                if (!self.model.get("isEnabled"))
                    return;
                var me = $(this);
                var color = $T.Html.decode(me.attr("col"));
                self.model.set({ color: color });
            });
        },

        /**
         * 设置页面
         */
        setData: function (args) {
            var self = this;
            self.model.setData(args);
            self.initControls();
        },

        /**
         * 获取用动态cid生成id标示的HTML元素JQUERY对象
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
         * 视图模板
         */
        template: [
            '<% _.each(obj, function(color){ %>',
            '<i class="i-green" col="<%-color%>" href="javascript:void(0)" style="background-color:<%-color%>;">',
            '</i>',
            '<% }) %>'
        ].join("")

    }));

    (function () {

        var base = M139.Model.ModelBase;
        var current = "M2012.Calendar.Model.Color";

        M139.namespace(current, base.extend({

            name: current,
            master: null,
            defaults: {
                //当前选择的颜色值
                color: "#90cf61",
                //控件是否可用
                isEnabled: true
            },

            COLORS: [
                "#90cf61",
                "#a5a5f0",
                "#f2b73a",
                "#ea8fcc",
                "#80bce1",
                "#ef7f7f",
                "#9eb4cd",
                "#69d1d1",
                "#5eabf3",
                "#ffa77c"
            ],

            /**
              *  构造函数
              *  @param {Object} args.master     //日历视图主控
              *  @param {Date} args.date         //指定的时间(可选)
             **/
            initialize: function (args) {
                var self = this;
                args = args || {};
                self.master = args.master;

                //判断颜色值是否合法
                if (!_.isUndefined(args.color)
                    && !self.isColor(args.color))
                    delete args.color;

                self.setData(args);
            },

            /**
             * 判断指定的颜色值是否是有效的RGB值
             * @param {String} color  //颜色RGB值
            */
            isColor: function (color) {
                var pn = /^#[0-9a-fA-F]{6}$/;
                if (!color)
                    return false;

                return pn.test(color);
            },

            /**
            *  设置控制，一般用在初始化控件数据时
            */
            setData: function (args) {
                var self = this;
                if (!args)
                    return;

                //如果设置的颜色不在默认颜色列表中，则不更新
                if (args.color && !_.contains(self.COLORS, args.color))
                    delete args.color;

                for (var key in args) {
                    if (_.has(self.attributes, key)) {
                        var value = {};
                        value[key] = args[key];
                        self.set(value, { silent: true });
                    }
                }
            }
        }

        ));

    })();
})(jQuery, _, M139, window._top || window.top);
﻿;
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

﻿
; (function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var className = "M2012.Calendar.View.ShareLabel";

    M139.namespace(className, superClass.extend({

        name: className,

        //当前视图名称
        viewName: "sharelabel",

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
             创建： self.master.trigger(self.master.EVENTS.ADD_LABEL);
             编辑： self.master.trigger(self.master.EVENTS.EDIT_LABEL,{seqNo:12345,type:0});
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
                    self.model = new M2012.Calendar.Model.ShareLabel({
                        master: self.master
                    });
                    self.initEvents();
                    self.render();
                    // 初始化页面数据
                    self.initData();
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
                //导航标题显示 添加日历、编辑日历
                if (self.model.hasChanged("isEditMode")) {
                    var TIPS = self.model.TIPS;
                    var value = self.model.get("isEditMode");
                    if (value) {
                        self.getElement("page_title").text(TIPS.EDIT_LABEL_TITLE);
                        return;
                    }
                    self.getElement("page_title").text(TIPS.ADD_LABEL_TITLE);
                }
                    //如果是群日历要显示群日历的提醒设置方式
                else if (self.model.hasChanged("isGroup")) {
                    if (self.model.get("isGroup") == 1) {
                        self.getElement("remaindArea").removeClass("hide");
                        self.getElement("remaindTabArea").addClass("hide");
                        self.getElement("btnDel").removeClass("hide");
                        return;
                    }
                    self.getElement("remaindArea").removeClass("hide");
                    self.getElement("remaindTabArea").addClass("hide");
                }
                    //是否共享日历
                else if (self.model.hasChanged("isShare")) {
                    //共享日历才显示删除按钮
                    if (self.model.get("isShare") == 1) {
                        self.getElement("btnDel").removeClass("hide");
                    }
                }
                    //是否订阅日历
                else if (self.model.hasChanged("isSubscribed")) {
                    //共享日历才显示删除按钮
                    if (self.model.get("isSubscribed") == 1) {
                        self.getElement("btnSubscribe").removeClass("hide");
                    }
                }
                    //监控日历标签名称变化
                else if (self.model.hasChanged("labelName")) {
                    var value = self.model.get("labelName");
                    var currentEl = self.getElement("labelName").val(value);
                    setTimeout(function () {
                        currentEl.trigger("change");
                        currentEl.trigger("blur");
                    }, 50);
                }
                    //监控日历描述信息变化
                else if (self.model.hasChanged("description")) {
                    var value = self.model.get("description");
                    var descEl = self.getElement("description").val(value);
                    setTimeout(function () {
                        descEl.trigger("change");
                        descEl.trigger("blur");
                    }, 50);
                }

                    //监控颜色值变化
                else if (self.model.hasChanged("color")) {
                    var value = self.model.get("color");
                    self.colorComp && self.colorComp.trigger("init", {
                        color: value
                    });
                }
                    //监控日历作者信息变化
                else if (self.model.hasChanged("trueName")) {
                    var value = self.model.get("trueName");
                    self.getElement("trueName").text($T.Html.encode(value));
                }
                    //监控日历下有新活动变更通过邮件提醒标示变化
                else if (self.model.hasChanged("updateEmailNotify")) {
                    var key = "updateEmailNotify";
                    var value = self.model.get(key) ? true : false;
                    self.getElement(key)[0].checked = value;
                }
                    //监控日历下有新活动变更通过短信提醒标示变化
                else if (self.model.hasChanged("updateSmsNotify")) {
                    var key = "updateSmsNotify";
                    var value = self.model.get(key) ? true : false;
                    self.getElement(key)[0].checked = value;
                }
                    //监控日历下有新活动创建通过邮件提醒标示变化
                else if (self.model.hasChanged("newCalendarEmailNotify")) {
                    var key = "newCalendarEmailNotify";
                    var value = self.model.get(key) ? true : false;
                    self.getElement(key)[0].checked = value;
                }
                    //监控日历下有新活动创建通过短信提醒标示变化
                else if (self.model.hasChanged("newCalendarSmsNotify")) {
                    var key = "newCalendarSmsNotify";
                    var value = self.model.get(key) ? true : false;
                    self.getElement(key)[0].checked = value;
                }
                    //监控日历下有新活动被删除通过邮件提醒标示变化
                else if (self.model.hasChanged("deleteCalendarEmailNotify")) {
                    var key = "deleteCalendarEmailNotify";
                    var value = self.model.get(key) ? true : false;
                    self.getElement(key)[0].checked = value;
                }
                    //监控日历下有活动被删除通过短信提醒标示变化
                else if (self.model.hasChanged("deleteCalendarSmsNotify")) {
                    var key = "deleteCalendarSmsNotify";
                    var value = self.model.get(key) ? true : false;
                    self.getElement(key)[0].checked = value;
                }
                    //监控日历下有新活动被更新通过邮件提醒标示变化
                else if (self.model.hasChanged("updateCalendarEmailNotify")) {
                    var key = "updateCalendarEmailNotify";
                    var value = self.model.get(key) ? true : false;
                    self.getElement(key)[0].checked = value;
                }
                    //监控日历下有活动被更新通过短信提醒标示变化
                else if (self.model.hasChanged("updateCalendarSmsNotify")) {
                    var key = "updateCalendarSmsNotify";
                    var value = self.model.get(key) ? true : false;
                    self.getElement(key)[0].checked = value;
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
            //页面中所有的checkbox状态发生改变后都通知到后台
            self.container.find("input[type='checkbox']").change(function (e) {
                var me = this;
                var data = {};
                var key = me.id.split("_")[1];
                data[key] = me.checked ? 1 : 0;
                self.model.set(data, {
                    silent: true
                });
            });

            //返回
            self.getElement("back").click(function (e) {
                $(document.body).click();
                self.goBack(false);
            });

            //保存
            self.getElement("btnSave").click(function (e) {
                self.save(true);
            });
            //删除
            self.getElement("btnDel").click(function (e) {
                self.deleteLabel();
            });
            //退订
            self.getElement("btnSubscribe").click(function (e) {
                self.cancelSubscribe();
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
            self.colorComp = new M2012.Calendar.View.Color({
                container: self.getElement("color"),
                isEnabled: false
            });

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



            //设置页面元素相关事件
            self.initPageEvent();

            var inputEl = self.getElement("labelName");
            inputEl.attr("disabled", "disabled");

            inputEl = self.getElement("description");
            inputEl.attr("disabled", "disabled");

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
         *  提交数据到服务器
       **/
        save: function () {
            var self = this;

            self.model.set({ isNotify: 0 }, {
                silent: true
            });
            //编辑活动
            if (self.model.get("isEditMode")) {
                //发送活动更新通知
                if (self.model.get("hasDefShareInfo")) {
                    var msg = self.model.TIPS.SHARE_NOTIFY;
                    if (self.model.get("isGroup") == 1) {
                        msg = self.model.TIPS.GROUP_NOTIFY;
                    }
                    top.$Msg.confirm(msg, function () {
                        self.model.set({
                            isNotify: 1
                        }, { silent: true });
                        self.saveData();
                    }, function () {
                        self.saveData();
                    }, { buttons: ["是", "否"] });
                    return;
                }
            }

            //新增活动
            self.saveData();
        },

        /**
        * 保存数据到服务端
       **/
        saveData: function () {
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
                //刷新左侧列表
                //self.master.trigger(self.master.EVENTS.LABEL_CHANGE);
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

            });
        },

        /**
         *  删除数据
        **/
        deleteLabel: function () {
            var self = this;
            var mask = self.getElement("mask");

            top.$Msg.confirm(self.model.TIPS.DELETE_CONFIRM, function () {
                mask.removeClass("hide");
                self.model.deleteLabelShare(
                    function () {
                        top.M139.UI.TipMessage.show(self.model.TIPS.DELETE_SUCCESS, {
                            delay: 3000
                        });
                        //刷新左侧列表
                        self.master.trigger(self.master.EVENTS.LABEL_CHANGE);
                        self.goBack(true);
                    }, function () {
                        top.M139.UI.TipMessage.show(self.model.TIPS.OPERATE_ERROR, {
                            delay: 3000,
                            className: "msgRed"
                        });
                        mask.addClass("hide");
                    }, function () {
                        mask.addClass("hide");
                    });
            }, {
                dialogTitle: "删除日历",
                buttons: ["确定", "取消"]
            });
        },

        /**
         * 取消订阅日历
        **/
        cancelSubscribe: function () {
            var self = this;
            var mask = self.getElement("mask");

            top.$Msg.confirm(self.model.TIPS.CANCEL_SUBSCRIBE_CONFIRM, function () {
                mask.removeClass("hide");
                self.model.cancelSubscribeLabel(
                    function () {
                        top.M139.UI.TipMessage.show(self.model.TIPS.CANCEL_SUBSCRIBE_SUCCESS, {
                            delay: 3000
                        });
                        //刷新左侧列表
                        self.master.trigger(self.master.EVENTS.LABEL_CHANGE);
                        self.goBack(true);
                    },
                   function () {
                       top.M139.UI.TipMessage.show(self.model.TIPS.OPERATE_ERROR, {
                           delay: 3000,
                           className: "msgRed"
                       });
                       mask.addClass("hide");
                   },
                   function () {
                       mask.addClass("hide");
                   });
            }, {
                dialogTitle: "退订日历",
                icon: "warn"
            });
        },

        /**
         * 返回
         */
        goBack: function (isRefresh) {
            var self = this;
            var master = self.master;
            master.trigger(master.EVENTS.NAVIGATE, {
                path: "view/back"
            }, { isRefresh: isRefresh });
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
                            '<h2><span id="{cid}_page_title">创建日历</span><a href="javascript:void(0);" id="{cid}_back" class="back">&lt;&lt;返回</a></h2>',
                        '</div>',
                    '</div>',
                    '<div class="createUl" id="{cid}_maincontent">',
                        '<form>',
                            '<fieldset class="boxIframeText">',
                             '<legend class="hide">创建日历</legend>',
                            '<ul class="form">',
                               '<li class="mt_10 clearfix formLine">',
                                  '<label class="label">日历名称：</label>',
                                    '<div class="element">',
                                        '<input class="iText" id="{cid}_labelName" maxlength="32" />',
                                    '</div>',
                                '</li>',
                                '<li class="mt_10 clearfix formLine">',
                                  '<label class="label">创建人：</label>',
                                    '<div class="element">',
                                        '<span id="{cid}_trueName" ></span>',
                                    '</div>',
                                '</li>',
                                '<li class="formLine mt_10" >',
                                    '<label class="label">日历说明：</label>',
                                    '<div class="element">',
                                        '<textarea class="iText tagarea" id="{cid}_description" maxlength="202" />',
                                    '</div>',
                                '</li>',
                                '<li class="formLine">',
                                    '<label class="label">日历颜色：</label>',
                                    '<div class="element">',
                                        '<div class="createTableInfo" id="{cid}_color">',
                                        '</div>',
                                        '<p class="gray">(设置自定义日历颜色，帮您区分不同日历的活动)</p>',
                                    '</div>',
                                '</li>',
                                '<li class="formLine hide" id="{cid}_remaindArea">',
                                    '<label class="label">提醒设置：</label>',
                                    '<div class="element">',
                                        '<div class="createTableInfo" id="{cid}_remainder">',
                                            '<input type="checkbox" id="{cid}_updateEmailNotify">',
                                            '<label class="mr_10" for="{cid}_updateEmailNotify">邮件</label>',
                                            '<input type="checkbox" id="{cid}_updateSmsNotify">',
                                            '<label class="mr_10" for="{cid}_updateSmsNotify">短信</label>',
                                        '</div>',
                                        '<p class="gray">(新增、删除、编辑活动时提醒方式)</p>',
                                    '</div>',
                                '</li>',
                                '<li class="formLine hide" id="{cid}_remaindTabArea">',
                                    '<label class="label">&nbsp;</label>',
                                    '<div class="element">',
                                        '<p class="mt_20" style="width:450px;">当您的联系人在此日历下新增、修改、删除任意活动时，选择希望提醒自己的方式</p>',
                                        '<table class="systemwjj2" id="{cid}_calNotify" >',
                                            '<thead>',
                                                '<tr>',
                                                    '<th class="td1">&nbsp;</th>',
                                                    '<th class="td2">通过邮件提醒</th>',
                                                    '<th class="td3">通过短信提醒</th>',
                                                '</tr>',
                                            '</thead>',
                                            '<tbody>',
                                                '<tr>',
                                                    '<td class="td1">该日历下有新活动创建</td>',
                                                    '<td class="td2">',
                                                        '<input type="checkbox" id="{cid}_newCalendarEmailNotify">',
                                                    '</td>',
                                                    '<td class="td3">',
                                                        '<input type="checkbox" id="{cid}_newCalendarSmsNotify">',
                                                    '</td>',
                                                '</tr>',
                                                '<tr>',
                                                    '<td class="td1">该日历下有活动被删除</td>',
                                                    '<td class="td2">',
                                                        '<input type="checkbox" id="{cid}_deleteCalendarEmailNotify">',
                                                    '</td>',
                                                    '<td class="td3">',
                                                        '<input type="checkbox" id="{cid}_deleteCalendarSmsNotify">',
                                                    '</td>',
                                                '</tr>',
                                                '<tr>',
                                                    '<td class="td1">该日历下有活动被修改</td>',
                                                    '<td class="td2">',
                                                        '<input type="checkbox" id="{cid}_updateCalendarEmailNotify">',
                                                    '</td>',
                                                    '<td class="td3">',
                                                        '<input type="checkbox" id="{cid}_updateCalendarSmsNotify">',
                                                    '</td>',
                                                '</tr>',
                                            '</tbody>',
                                        '</table>',
                                    '</div>',
                                '</li>',
                                '<li class="formLine" id="{cid}_identity" style="display:none;height:20px;">',
							    '</li>',
                            '</ul>',
                            '<div class="createBottom" style="position:relative">',
                                '<div id="{cid}_mask" style="position:absolute; top:0px; height:43px; z-index:1000;" class="blackbanner hide"></div>',
                                '<a href="javascript:void(0);" class="btnSetG" hidefocus id="{cid}_btnSave" role="button"><span>保 存</span></a>',
                                '<a href="javascript:void(0);" class="btnSet  ml_5 hide" hidefocus id="{cid}_btnDel" role="button"><span>删 除</span></a>',
                                '<a href="javascript:void(0);" class="btnSet  ml_5 hide" hidefocus id="{cid}_btnSubscribe" role="button"><span>退 订</span></a>',
                                '<a href="javascript:void(0);" class="btnSet ml_5" hidefocus id="{cid}_btnCancel" role="button"><span>取 消</span></a>',
                            '</div>',
                            '</fieldset> ',
                        '</form>',
                    '</div>',
                '</div>',
             '</div>    ',
         '</div>'].join("")
        }

    }));

    $(function () {
        var activity = new M2012.Calendar.View.ShareLabel({
            master: window.$Cal
        });
    });

})(jQuery, _, M139, window._top || window.top);

