;
(function ($, _, M139, top) {
    var _super = M139.View.ViewBase,
        _class = "M2012.Calendar.Popup.View.Activity",
        commonAPI = M2012.Calendar.CommonAPI.getInstance(),
        Validate = M2012.Calendar.View.ValidateTip,
        Constant = M2012.Calendar.Constant,
        $Utils = M2012.Calendar.CommonAPI.Utils,
        remindType = M2012.Calendar.Constant.remindSmsEmailTypes;
    M139.namespace(_class, _super.extend({
        name: _class,
        template: {
            activity: [
                 '<div class="repeattips-box repeattips-boxOther">',
                     '<div class="norTips">',
                         '<span class="norTipsIco"><i class="i_ok"></i></span>',
                         '<div class="norTipsContent"><p class="norTipsLine">创建日历成功！赶快创建活动吧。</p></div>',
                     '</div>',
                     '<div class="tips-text-div">',
                         '<form class="form-addtag">',
                             '<fieldset>',
                                  '<legend class="hide">添加日程</legend>',
                                  '<ul class="form">',
                                      '<li class="formLine">',
                                          '<input type="text" value="记下你准备做的事" class="iText iText-addzt gray" id="{cid}_activityName">',
                                      '</li>',
                                      '<li class="formLine"><label class="label">时间：</label>',
                                          '<div id="{cid}_dateComponent" class="element"></div>',
                                      '</li>',
                                      '<li class="formLine"><label class="label">日历：</label>',
                                          '<div id="{cid}_label_container" class="element"></div>',
                                      '</li>',
                                      '<li class="formLine"><label class="label">提醒：</label>',
                                          '<div id="{cid}_remind" class="element">',
                                      '</li>',
                                      '<li class="formLine">',
                                           '<div id="{cid}_indentity"></div>',
                                      '</li>',
                                  '</ul>',
                             '</fieldset>',
                         '</form>',
                     '</div>',
                 '</div>'
            ].join(""),
            DialogTitle: "创建活动"
        },
        showMaskContent : '<div style="position:absolute; top:0px; height:37px; width:100%; z-index:1000;" class="blackbanner"></div>',
        config : {
            MAX_ADDR_SELECT: 20,
            MSG_INVITE_MAX: '邀请人数已达到上限 {max} 人',
            DEFAULT_ACTIVITYNAME : "default_activityName"
        },
        logger : new top.M139.Logger({
            name : "M2012.Calendar.View.MyCalendar"
        }),
        initialize: function (options) {
            var that = this;
            options = options || {};
            this.master = options.master;
            this.labelId = options.labelId;
            this.render(options);
            // 设置作用域,必须使用,不然无法通过backbone的方式绑定事件
            this.$el = this.dialog.$el;
            this.model = new M2012.Calendar.Popup.Model.Activity(options);
            this.defineElement();
            this.initUIComponent();
            this.saveInitValue();
            this.bindEvent();

            this.model.getLabels({comeFrom : 0, actionType : 0}, function (detail, text) {
                that.labelComponent = new M2012.Calendar.View.LabelMenu({
                    target: that.labelContainerEl,
                    labels: detail['var'].userLabels
                });
                that.labelComponent.setData(that.labelId); // 回填刚创建的日历
            },function (detail) {
                console.error && console.error("Call detail getLabels: " + detail);
            })
        },
        defineElement : function () {
            var dialog = this.$el;
            this.tipDomEl = dialog.find("#" + this.cid + "_tip");
            this.labelNameEl = dialog.find("#" + this.cid + "_labelName");
            this.labelContainerEl = dialog.find("#" + this.cid + "_label_container");
            this.remindContainterEl = dialog.find("#" + this.cid + "_remind");
            this.dateContainterEl = dialog.find("#" + this.cid + "_dateComponent");
            this.activityNameEl = dialog.find("#" + this.cid + "_activityName");
            this.btnEl = dialog.find("div .boxIframeBtn").css("position", "relative");
        },
        /**
         * 1.给"添加参与人"的图标绑定点击事件
         * 2.给document绑定点击事件,关闭颜色选择器弹出窗口
         */
        bindEvent : function () {
            var that = this;
            // 提醒主题添加"focus"事件
            this.activityNameEl.bind("focus", function() {
                if ($.trim($(this).val()) === this.defaultValue) {
                    $(this).val("");
                }
            }).bind("blur", function () {
                if (!$.trim($(this).val())) {
                    $(this).val(this.defaultValue);
                }
            }).bind("keyup keydown change", function () {
                var activityName = $.trim($(this).val()),
                    maxLength = M2012.Calendar.Constant.lengthConfig.inputLength;
                if (activityName.length > maxLength) {
                    Validate.show('仅能输入' + maxLength + '个字', $(this));
                    $(this).val(activityName.substr(0, maxLength));
                }
            });
        },
        render : function () {
            var that = this,
                template = $T.format(that.template.activity, {
                    cid: that.cid
                });
            that.dialog = $Msg.showHTML(template,
                function(e){
                    e.cancel = true;
                    $(document.body).click(); // 点保存之前，先关闭掉弹出的窗口
                    that.submit(e);
                },{
                    name:"popup_createActivity_view",
                    width: "323px",
                    dialogTitle: that.template.DialogTitle,
                    buttons: ['保存', '取消'],
                    onClose : function () {
                        $(that.dialog.el).click();
                    }
                }
            );
        },
        initUIComponent : function () {
            var that = this;
            // 提醒插件
            this.remindComponent = new M2012.Calendar.View.Reminder({
                container: this.remindContainterEl,
                onChange : function (args) {
                    that.model.set("remindObj", args);
                }
            });
            // 调整提醒插件中元素的宽度,与UE原型页面上的保持一致
            this.remindComponent.getElement("remind_type").children(":first").css("width","92px");

            // 时间插件
            /**
            this.dateComponent = new M2012.Calendar.View.DateTimePicker2({
                container: this.dateContainterEl,
                onSelected : function (dateObj) {
                    console.log(dateObj);
                    that.model.set("dateObj", dateObj);
                }
            });*/
                // 创建新的时间选择控件
            this.dateComponent = new M2012.Calendar.View.DaytimePicker({
                master: that.master,
                container: this.dateContainterEl,
                onChange: function (obj) {
                    that.model.set("dateObj", obj);
                }
            });

            // 调整时间插件中元素的宽度,与UE原型页面上的保持一致
            //this.dateComponent.dayControl.getElement("date_input").css("width", "134px");
            this.dateContainterEl.children(":last").width("95px");
            // 验证码插件
            // 验证码
            this.identify = new M2012.Calendar.View.Identify({
                wrap: this.cid + '_indentity',
                name: 'indentity',
                titleName: '验证码'
            });
            // 调整验证码控件的位置
            $(this.identify.getSelector("_input")).css("width", "90px");
            $(this.identify.getSelector("_wrap")).children(":first").removeClass("label");
        },
        saveInitValue : function () {
            // 保存默认的活动值
           this.model.set(this.config.DEFAULT_ACTIVITYNAME, this.activityNameEl.get(0).defaultValue);
        },
        //处理验证码
        accessIdentify: function (detail) {
            if (this.identify) {
                if ($Utils.getObjValue(detail.errorCode, Constant.IDENTIFY_CODES)) {
                    this.identify.handerError(detail.errorCode);
                } else {
                    this.identify.hide();
                }
            }
        },
        /**
         * 两个功能
         * 1.校验数据 2.调后台接口
         */
        save : function () {
        },
        cancel : function () {
            this.dialog.close();
        },
        hideTip : function () {
            this.tipDomEl.hide();
        },
        wrapParam : function () { // 封装需要传递的参数
            var setTime = $Date.format("yyyy-MM-dd hh:mm:ss", this.model.get("dateObj").datetime),// 时间数据
                labelObj = this.labelComponent ? this.labelComponent.getData() : {}; // 我的日历数据
            var remindObj = this.model.get("remindObj");
            var remindData =   {
                beforeType : remindObj.beforeType,
                beforeTime : remindObj.beforeTime,
                recMyEmail : remindObj.remindType== remindType.email.value ? 1 : 0,
                recMySms : remindObj.remindType == remindType.freeSms.value ? 1 : 0,
                recEmail: commonAPI.getUserEmail(),
                recMobile: commonAPI.getUserMobile(),
                enable : remindObj.enable
            };

            var param = {
                comeFrom : 0,
                /**
                dateFlag : dateObj.date,
                endDateFlag: dateObj.date,
                startTime: dateObj.time,
                endTime: dateObj.time,*/
                dtStart : setTime,
                dtEnd : setTime,
                calendarType : dateObj.calendarType,
                title : $.trim(this.activityNameEl.val()),
                validImg : this.identify.getData() || '' // 验证码
            };

            return $.extend(param, commonAPI.transform(remindData), labelObj);
        },
        submit : function (e) {
            var that = this;

            if (this.validate()) {
                var param = this.wrapParam();

                $(that.showMaskContent).insertBefore(that.btnEl.children(":first"));
                this.model.addCalendar(param, function (detail, text) {
                    if (detail.code == 'S_OK') {
                        top.M139.UI.TipMessage.show('创建成功', { delay: 3000 });
                        that.cancel(); // 关闭
                        that.master.trigger(that.master.EVENTS.NAVIGATE, { path: "view/update" });
                    }else {
                        if (detail.errorCode === 999) { // 999的错误为异常错误, 直接报错给用户
                            top.M139.UI.TipMessage.show('创建失败', { className : "msgRed", delay: 3000 });
                            $(that.btnEl).children(":first").remove(); // 将遮罩层去掉
                            return;
                        }
                        var info = commonAPI.getUnknownExceptionInfo(detail.errorCode);
                        info ? $Msg.alert(info) : that.accessIdentify(detail); // 无信息返回,暂时认为要输入验证码
                        $(that.btnEl).children(":first").remove();// 将遮罩层去掉
                    }
                }, function() {
                    console.error("submit failure");
                });
            }
        },
        validate : function () { // 校验数据
            var self = this,
                activityName = $.trim(self.activityNameEl.val());
            if (activityName === self.model.get(self.config.DEFAULT_ACTIVITYNAME)) {
                Validate.show('主题不能为空', self.activityNameEl);
                return false;
            }

            return true;
        }
    }));
})(jQuery, _, M139, window._top || window.top);
