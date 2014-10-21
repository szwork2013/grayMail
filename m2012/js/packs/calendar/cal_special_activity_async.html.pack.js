;
(function ($, _, M139, top) {

    var superClass = M139.Model.ModelBase,
        _class = "M2012.Calendar.Model.SubscActivity",
        commonAPI = new M2012.Calendar.CommonAPI();


    M139.namespace(_class, superClass.extend({
        name: _class,
        container: {},
        defaults: {},
        EVENTS: {
            REDIRECT: "master#linkshow:redirect",
            LOAD_MODULE: "master#linkshow:loadmodule",
            FETCH: 'master#linkshow:fetch',
            FETCHFAIL: 'master#linkshow:fetchfail'
        },

        initialize: function (options) {
            //superClass.prototype.initialize.apply(this, arguments);

            //var _this = this;
            //_this.bindEvent();

            //最好做成点群组后，再加载群组的功能代码与模块
            //_this.modParty = new M2012.Addr.Model.Master();
            this.master = options.master;
        },

        bindEvent: function () {
            var _this = this;
            var EVENTS = _this.EVENTS;

            _this.on("all", function (eventName, args) {
                var event = {};
                isMatch = eventName.match(/(\w+)#(\w+):(\w+)/);
                if (isMatch && isMatch.length > 3) {
                    //["home#linkshow:maybeknown", "home", "linkshow", "maybeknown"]
                    event.name = isMatch[0];
                    event.module = isMatch[1];
                    event.func = isMatch[2];
                    event.action = isMatch[3];

                    if (EVENTS[event.name]) {
                        _this.trigger(event.name, event);
                    }
                }
            });
            //Backbone.Router
        },

        validate: function (attributes) {

        },
        /**
         * @param obj 包括需要传递给接口的参数,回调函数名称,以及master
         * @param fnSuccess
         * @param fnError
         */
        getCalendar: function (obj, fnSuccess, fnError) {
            var _this = this;
            $.extend(obj, {
                master: this.master,
                fnName: "getCalendar"
            });
            commonAPI.callAPI(obj, function (responseData, responseText) {
                var data = !!responseData && responseData["var"];
                _this.set("data", data);
                typeof fnSuccess === 'function' && fnSuccess(responseData, responseText);
            }, fnError);
        },
        /**
         * 复制活动到我的日历
         * @param obj
         * @param fnSuccess
         * @param fnError
         */
        copyCalendar: function (obj, fnSuccess, fnError) {
            $.extend(obj, {
                master: this.master,
                fnName: "copyCalendar"
            });
            commonAPI.callAPI(obj, fnSuccess, fnError);
        }
    }));

})(jQuery, _, M139, window._top || window.top);

﻿;
(function ($, _, M139, top) {

    var superClass = M139.View.ViewBase,
        _class = "M2012.Calendar.View.SubscActivity";
    var commonAPI = new M2012.Calendar.CommonAPI();
    var $CUtils = M2012.Calendar.CommonAPI.Utils;
    var Constant = M2012.Calendar.Constant;

    M139.namespace(_class, superClass.extend({
        template: {
            main: [
                '<div id="{cid}_outer">',
                    '<div class="bgPadding">',
                        '<div class="createTop tabTitle">',
                            '<h2>查看活动<a class="back" href="javascript:;" id="{cid}_back">&lt;&lt;返回</a></h2>',
                        '</div>',
                    '</div>',
                    '<div class="createUl">',
                        '<form>',
                            '<fieldset class="boxIframeText">',
                                '<legend class="hide">查看活动</legend>',
                                '<ul class="form">',
                                    '<li class="formLine">',
                                        '<label class="label">主题：</label>',
                                        '<div class="element">{title}</div>',
                                    '</li>',
                                    '<li class="formLine">',
                                        '<label class="label">时间：</label>',
                                        '<div class="element">{timeDescription}</div>',
                                    '</li>',
                                '</ul>',
                                '<ul class="form">',
                                    '<li class="formLine">',
                                        '<label class="label">地点：</label>',
                                        '<div class="element">{site}</div>',
                                    '</li>',
                                    '<li class="formLine">',
                                        '<label class="label">内容：</label>',
                                        '<div class="element">{remark}</div>',
                                    '</li>',
                /**
                                       '<li class="formLine" style="display:none;">',
                                            '<div class="repeattips-bottom clearfix"><span class="numFour">验证码：</span><div class="fl"><input type="text" name="" class="iText "></div>',
                                                '<div class="verificationBox" style="display:none;">',
                                                    '<p class="verificationBoxImg"><img src="../../images/module/schedule/img_01.jpg" alt="" title=""></p>',
                                                        '<p class="verificationBoxInfo">图中显示的图案是什么?将你认为正确答案前的<span>字母或数字</span>填入框中（不分大小写）</p>',
                                                        '<a href="javascript:void(0)" class="verificationBoxBtn">看不清，换一张</a>',
                                                    '</div>',
                                                '</div>',
                                            '</li>',*/
                                       '<li class="formLine">',
                                            '<div class="pt_10" id="indentityComponent"></div>',
                                       '</li>',
                                       '</ul>',
                                            '<div class="mt_20 p_relative">',
                                                '<a role="button" hidefocus="" class="btnSetG" href="javascript:;" id="{cid}_copyCalBtn"><span>添加到"我的日历"</span></a>',
                                                '<a role="button" id="{cid}_share" hidefocus="" class="btnSet ml_5" href="javascript:void(0);"><span>分 享</span></a>',
                                                '<div role="tooltip" style="left:0px;top:-32px;display:none;" id="{cid}_tips" class="tips">',
                                                    '<div class="tips-text"><i class="i-ok mr_5"></i>添加成功，默认提前15分钟提醒</div>',
                                                    '<div class="tipsBottom  diamond" style="left:10px;"></div>',
                                                '</div>',
                                            '</div>',
                                            //'<div class="mt_20" style="display:none;">',
                                               // '<a role="button" hidefocus="" class="btnSet btnTbGray" href="javascript:void(0)"><span>添加到“我的日历”</span></a>',
                                            //'</div>',
                                        '</fieldset>',
                                    '</form>',
                        '</div>',
                    '</div>'
            ].join('')
        },
        logger: new M139.Logger({ name: _class }),
        //当前视图名称
        viewName: "subsc_act",

        /**
         *  订阅活动详情查看
         */
        initialize: function (options) {
            var that = this;
            this.master = options.master;
            var EVENTS = that.master.EVENTS;

            function oncreated(args) {
                // 第一次进入页面的时候调用
                if (args.name === that.viewName) {
                    that.master.unbind(that.master.EVENTS.VIEW_CREATED, oncreated);
                    that.model = new M2012.Calendar.Model.SubscActivity(options); //用来保存数据
                    that.container = args.container; // 第一次保存container的值
                   // that.renderData(args, that.initTemplate);

                    if ($.isFunction(args.onshow)) {
                        args.onshow();
                    }
                }
            }

            // todo 暂时先这样
            that.master.bind(EVENTS.VIEW_SHOW, function (params) {
                // 如果params中存在name并且args,就认为它是第二次触发
                if (params && params.name === that.viewName && params.args) {

                    that.renderData({ container: that.container }, that.initTemplate);
                }
            });

            that.master.bind(that.master.EVENTS.VIEW_CREATED, oncreated);
        },
        /**
         * 调用getCalendar接口获取初始化数据
         * 参数包括:comeFrom,seqNo,type
         */
        renderData: function (args, fn) {
            var that = this;
            var data = that.master.get("edit_detail_data");
            //清空提交过来的数据
            that.master.set({ edit_detail_data: null });
            var param = { // todo 构造的假数据
                data: {
                    comeFrom: 0,
                    seqNo: data ? data.seqNo : 0,
                    type: 3 // 表示订阅活动
                }
            };


            that.model.getCalendar(param, function (detail, text) {
                fn && typeof fn === 'function' && fn.call(that, args.container, detail);
            }, function (detail) {
                console.error(detail);
            });
        },
        initIdentifyComponent: function () {
            this.identifyComponent = new M2012.Calendar.View.Identify({
                wrap: 'indentityComponent',
                name: 'indentity',
                titleName: '验证码'
            });
        },
        adjustIdentifyComponent: function () {
            var self = this;
            //self.identifyComponent.inputEl.parent().css({position:'absolute', top:0, left:'48px'});
        },
        handlerError: function (detail) {
            var self = this;
            self.adjustIdentifyComponent();
            self.indentityEl.show();
            if ($CUtils.getObjValue(detail.errorCode, Constant.IDENTIFY_CODES)) {
                self.identifyComponent.handerError(detail.errorCode);
            }
        },
        /**
         * 做了三件事情
         * 1.使用初始化时调用接口返回的数据进行模板渲染 2.保存calendarId 3.保存dom节点 4.初始化事件
         * @param container
         * @param obj
         */
        initTemplate: function (container, obj) {
            var data = obj["var"],
                html = "";
            if (data) {
                html = $T.format(this.template.main, {
                    cid: this.cid,
                    title: $.trim(data.title) || '(无)',
                    timeDescription: $.trim(data.dateDescript) || '(无)',
                    site: $.trim(data.site) || '(无)',
                    remark: $.trim(data.content) || '(无)'
                });

                this.model.set("calendarId", data.seqNo); // 保存活动ID,调用复制活动接口的时候需要用到此参数
            }
            container.empty().html(html); // 回显数据
            this.initIdentifyComponent(); // 初始化验证码
            this.defineElements(); // 渲染完成之后调用
            this.initEvents();
        },
        initEvents: function () {
            var that = this;
            this.copy_BtnEl.click(function () {
                that.copyCalendar(); // 点击"添加"按钮时所做的处理
            });

            this.backLinkEl.click(function () {
                that.master.trigger(that.master.EVENTS.NAVIGATE, {
                    path: "view/back"
                });// 点击"返回"链接时所做的处理
            });

            that.shareEl.off("click").on("click", function () {
                top.BH("calendar_subscribe_clickshare"); //点击查看订阅日历活动页面的“分享”人数、次数
                var data = that.model.get("data");
                if (!!data) { //保险点,校验下
                    that.master.trigger(that.master.EVENTS.SHARE_ACTIVITY, data);
                }
            });
        },
        defineElements: function () {
            this.outerEl = $("#" + this.cid + "_outer");
            this.copy_BtnEl = $("#" + this.cid + "_copyCalBtn");
            this.tipsEl = $("#" + this.cid + "_tips");
            this.backLinkEl = $("#" + this.cid + "_back");
            this.indentityEl = $("#indentityComponent");
            this.shareEl = $("#" + this.cid + "_share");
        },
        /**
         * 点击"添加按钮"时的处理
         */
        copyCalendar: function () {
            var param = {
                data: {
                    comeFrom: 0,
                    calendarId: this.model.get("calendarId"),
                    validImg: this.identifyComponent.getData()
                }
            },
            that = this;

            this.model.copyCalendar(param, function (detail, text) {
                // 添加成功后,按钮置灰,显示提示信息,并且提示气泡四秒后消失
                if (detail["code"] == "S_OK") {
                    that.tipsEl.show();
                    that.copy_BtnEl.addClass("btnTbGray").unbind("click");
                    setTimeout(function () {
                        that.tipsEl.hide()
                    }, 4000);
                } else {
                    var info = commonAPI.getUnknownExceptionInfo(detail.errorCode);
                    info ? $Msg.alert(info) : that.handlerError(detail);
                }
            }, function (detail) {
                console.log('error detail');
            });
        }
    }));

    $(function () {
        new M2012.Calendar.View.SubscActivity({
            master: window.$Cal
        });
    });
})(jQuery, _, M139, window._top || window.top);

﻿;
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

﻿
; (function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var className = "M2012.Calendar.View.InviteActivity";

    M139.namespace(className, superClass.extend({
        name: className,
        //当前视图名称
        viewName: "invite_share_act",
        //视图的父容器
        container: null,
        logger: new M139.Logger({ name: className }),
        //日历视图主控
        master: null,
        //活动数据模型
        model: null,
        /**
         * 编辑邀请、共享活动详情
         * 要创建（编辑）详细活动请通过master调用：
           @example 
             编辑： self.master.trigger(self.master.EVENTS.EDIT_ACTIVITY,{
                         seqNo: seqNo,
                         type: 1
                   });
        **/
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
                    self.model = new M2012.Calendar.Model.InviteActivity({
                        master: self.master,
                        args: args
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
                //监控活动类型
                if (self.model.hasChanged("type")) {
                    if (self.model.get("type") === 1) {
                        self.getElement("btnDel").removeClass("hide");
                        return;
                    }
                    self.getElement("btnDel").addClass("hide");
                }
                else if (self.model.hasChanged("isGroup")) {
                    if (self.model.get("isGroup")) {
                        self.getElement("labelTitle").text(self.model.TIPS.GROUP_LABEL_TITLE);
                        self.getElement("actTitle").text(self.model.TIPS.GROUP_ACT_TITLE);
                        self.getElement("btnShare").addClass("hide");
                    }
                }
                    //监控日历颜色值
                else if (self.model.hasChanged("color")) {
                    var value = self.model.get("color");
                    self.getElement("labelColor").css({
                        "background-color": $T.Html.encode(value)
                    });
                }
                    //监控日历标签名称变化
                else if (self.model.hasChanged("labelName")) {
                    var value = self.model.get("labelName");
                    value = $T.Html.encode(value);
                    self.getElement("labelName").html(value);
                }
                    //监控活动标题信息变化
                else if (self.model.hasChanged("title")) {
                    var value = self.model.get("title");
                    value = $T.Html.encode(value || self.model.TIPS.DEF_VALUE);
                    self.getElement("title").html(value);
                }
                    //监控活动备注信息变化
                else if (self.model.hasChanged("content")) {
                    var value = self.model.get("content");
                    if (!value) {
                        self.getElement("content").closest("li").addClass("hide");
                        return;
                    }
                    value = $T.Html.encode(value);
                    self.getElement("content").html(value).closest("li").removeClass("hide");
                }
                    //监控活动地点值变化
                else if (self.model.hasChanged("site")) {
                    var value = self.model.get("site");
                    if (!value) {
                        self.getElement("site").closest("li").addClass("hide");
                        return;
                    }
                    value = $T.Html.encode(value);
                    self.getElement("site").html(value).closest("li").removeClass("hide");                 
                }
                    //监控活动时间描述信息变化
                else if (self.model.hasChanged("dateDescript")) {
                    var value = self.model.get("dateDescript");
                    value = $T.Html.encode(value);
                    self.getElement("date").html(value);
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
                    //监控邀请信息发起人变化
                else if (self.model.hasChanged("trueName")) {
                    var value = self.model.get("trueName");
                    value = $T.Html.encode(value);
                    self.getElement("owner").html(value);
                }
                    //监控邀请人信息变化
                else if (self.model.hasChanged("inviteInfo")) {
                    var value = self.model.getInviteInfo();
                    if (value && value.length > 0) {
                        var template = _.template(self.template.tabInvite);
                        self.getElement("inviteInfo").html(template(value));
                        self.getElement("reminder_area").removeClass("noLine");
                        self.getElement("invite_area").removeClass("hide");
                        return;
                    }
                    self.getElement("invite_area").addClass("hide");
                    self.getElement("reminder_area").addClass("noLine");
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
                self.cancelInvited();
            });
            //退订
            self.getElement("btnShare").click(function (e) {
                self.share();
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

            //设置页面元素相关事件
            self.initPageEvent();

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
            //编辑活动
            //验证数据合法性
            if (!self.model.validate()) {
                top.$Msg.confirm(self.model.TIPS.SESSION_ERROR, function () {
                    self.saveData();
                });
                return;
            }
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
        cancelInvited: function () {
            var self = this;
            var mask = self.getElement("mask");

            top.$Msg.confirm(self.model.TIPS.DELETE_CONFIRM, function () {
                mask.removeClass("hide");
                self.model.cancelInvited(
                    function () {
                        top.M139.UI.TipMessage.show(self.model.TIPS.DELETE_SUCCESS, {
                            delay: 3000
                        });
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
                dialogTitle: "删除活动",
                buttons: ["确定", "取消"]
            });
        },

        /**
         * 分享活动
         */
        share: function () {
            var self = this;

            var data = self.model.getShareData();
            var bhKey = "calendar_invite_clickshare";
            if (self.model.get("type") === 2)
                bhKey = "calendar_share_clickshare";

            if (!self.model.isLoadSuccess)
                return;

            self.master.capi.addBehavior(bhKey);
            self.master.trigger(self.master.EVENTS.SHARE_ACTIVITY, data);
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
            el.parent().removeClass("hide");
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
                            '<h2><span id="{cid}_page_title">编辑活动</span><a href="javascript:void(0);" id="{cid}_back" class="back">&lt;&lt;返回</a></h2>',
                        '</div>',
                    '</div>',
                    '<div class="createUl" id="{cid}_maincontent">',
                        '<form>',
                            '<fieldset class="boxIframeText">',
                             '<legend class="hide">编辑活动</legend>',
                            '<ul class="form">',
                               '<li class="mt_10 clearfix formLine">',
                                  '<label class="label" id="{cid}_labelTitle">所属日历：</label>',
                                    '<div class="element">',
                                        '<span id="{cid}_labelColor" class="ad-tagt"></span>',
                                        '<span id="{cid}_labelName"></span>',
                                    '</div>',
                                '</li>',
                                '<li class="mt_10 clearfix formLine">',
                                    '<label class="label" id="{cid}_actTitle">标题：</label>',
                                    '<div class="element">',
                                        '<span id="{cid}_title" ></span>',
                                    '</div>',
                                '</li>',
                                '<li class="mt_10 clearfix formLine hide">',
                                    '<label class="label">内容：</label>',
                                    '<div class="element">',
                                        '<span id="{cid}_content" ></span>',
                                    '</div>',
                                '</li>',
                                '<li class="formLine mt_10 hide">',
                                    '<label class="label">地点：</label>',
                                    '<div class="element">',
                                        '<span id="{cid}_site" ></span>',
                                    '</div>',
                                '</li>',
                            '</ul>',
                            '<ul class="form" id="{cid}_reminder_area">',
                                '<li class="formLine">',
                                    '<label class="label">时间：</label>',
                                    '<div class="element">',
                                        '<span id="{cid}_date"/>',
								    '</div>',
                                '</li>',
                                '<li class="formLine">',
                                    '<label class="label">提醒自己：</label>',
                                    '<div class="element" id="{cid}_reminder">',
                                    '</div>',
                                '</li>',
                            '</ul>',
                            '<ul class="form noLine hide" id="{cid}_invite_area">',
                                '<li class="formLine">',
                                    '<label class="label"> 发起人：</label>',
                                    '<div class="element" id="{cid}_owner">',
                                    '</div>',
                                '</li>',
                                '<li class="formLine">',
                                    '<label class="label">参与人：</label>',
                                    '<div class="element" id="{cid}_inviteInfo">',
                                    '</div>',
                                '</li>',
                            '</ul>',
                            '<ul class="form noLine hide">',
                                '<li class="formLine" id="{cid}_identity" style="display:none;height:20px;">',
							    '</li>',
                            '</ul>',
                            '<div class="createBottom" style="position:relative">',
                                '<div id="{cid}_mask" style="position:absolute; top:0px; height:43px; z-index:1000;" class="blackbanner hide"></div>',
                                '<a href="javascript:void(0);" class="btnSetG" hidefocus id="{cid}_btnSave" role="button"><span>保 存</span></a>',
                                '<a href="javascript:void(0);" class="btnSet ml_5" hidefocus id="{cid}_btnDel" role="button"><span>删 除</span></a>',
                                '<a href="javascript:void(0);" class="btnSet ml_5" hidefocus id="{cid}_btnShare" role="button"><span>分 享</span></a>',
                                '<a href="javascript:void(0);" class="btnSet ml_5" hidefocus id="{cid}_btnCancel" role="button"><span>取 消</span></a>',
                            '</div>',
                            '</fieldset> ',
                        '</form>',
                    '</div>',
                '</div>',
             '</div>    ',
         '</div>'].join(""),

            tabInvite: [
                '<table class="detailTabList" border="0" style="width:400px;">',
                    '<tbody>',
                        '<% _.each(obj, function(i){ %>',
                        '<tr>',
                            '<td><%-i.name%></td>',
                            '<td align="right"><%=i.statusDesc%></td>',
                        '</tr>',
                        '<% }) %>',
                    '</tbody>',
                '</table>'
            ].join("")
        }

    }));

    $(function () {
        var activity = new M2012.Calendar.View.InviteActivity({
            master: window.$Cal
        });
    });

})(jQuery, _, M139, window._top || window.top);

