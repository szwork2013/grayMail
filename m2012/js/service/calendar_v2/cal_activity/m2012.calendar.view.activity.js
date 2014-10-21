
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
