;
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