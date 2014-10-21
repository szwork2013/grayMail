
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
