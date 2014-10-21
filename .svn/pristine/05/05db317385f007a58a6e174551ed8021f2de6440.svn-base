
(function (jQuery, _, M139, top) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    //var ScheduleTransform = M2012.CalendarReminder.Schedule.Transform;
    var Constant = M2012.Calendar.Constant;
    var $Utils = M2012.Calendar.CommonAPI.Utils;
    var commonAPI = M2012.Calendar.CommonAPI.getInstance();
    var Validate = M2012.Calendar.View.ValidateTip;
    M139.namespace('M2012.Calendar.Popup.View.Countdown', superClass.extend({
        template: {
            MAIN: [
            '<div class="repeattips-box clearfix">',
                        '<div id="{cid}_titleMaxTip" style="left:20px;top:10px; display: none;" class="tips">',
                            '<div class="tips-text">不能超过100个字</div>',
                            '<div class="tipsBottom  diamond"></div>',
                        '</div>',
                        '<div id="{cid}_titleEmptyTip" style="display: none; top:10px;" class="tips">',
                            '<div class="tips-text">主题不能为空</div>',
                            '<div class="tipsBottom  diamond"></div>',
                        '</div>',
                        '<div class="repeattips-area">',
                            '<textarea id="{cid}_remind_content" class="meetarea gray" style="overflow:auto;">',
                                //'还信用卡还有多少天?发工资还有多少天?离节日放假还有多少天?宝宝出生还有多少天?试下倒数日,给您想要的信息',
                                '即将到来的重要日子...',
                            '</textarea>',
                        '</div>',

                '<div class="pt_10 clearfix">',
                    '<label class="fl numFour" style="height:22px;line-height: 22px;">设置时间：</label>',
                //{cid}_start_time
                    '<div id="{cid}_set_time" class="element"></div>',
                '</div>',
                '<div class="pt_10 repeattips-bottom clearfix">',
                    '<span class="label numFour">距今还有：</span>',
                //{cid}_start_time
                    '<span id="{cid}_count_downtime">',
                    '</span>',
                '</div>  ',
                '<div class="pt_10 repeattips-bottom clearfix">',
                    '<span class="label numFour">提醒：</span>',
                    //{cid}_remind
                    '<div id="{cid}_remind" class="element"> ',
                    '</div>',
                '</div>  ',
                '<div class="pt_10 repeattips-bottom clearfix">',
                    '<div id="{cid}_indentity"></div>',
                '</div>',
                '</div>',
                //{cid}_invite_div
                '<div id="{cid}_invite_div" style="display:none;" class="tips meetform-tips">',
                '<div class="tips-text">',
                '<div class="addpeowidth">',
                '<div class="p_relative" style="z-index:3;">',
                //{cid}_invite_input_container
                '<div id="{cid}_invite_input_container"></div>',
                '</div>',
                //{cid}_select_addr
                '<a id="{cid}_select_addr_link" href="javascript:void(0);" title="选择联系人" class="i_peo"></a>',
                //{cid}_invite_input
                //'<input id="{cid}_invite_input" class="iText" style="width:468px;" type="text" />',
                '</div>',
                //{cid}_invite_list_container
                '<div id="{cid}_invite_list_container"></div>',
                //{cid}_msg_content //使用短信通知参与人，会产生短信费用。
                '<p>',
                '<p>使用短信通知参与人，会产生短信费用。<br>',
                '<span id="{cid}_msg_content"></span>',
                '</p>',
                '</p>',
                '</div>',
                '<div class="tipsTop diamond"></div>',
                '</div>',
                '</div>'].join(""),

            dialogTitle: "倒计时"
        },
        showMaskContent : '<div style="position:absolute; top:0px; height:30px; width:100%; z-index:1000;" class="blackbanner"></div>',
        configs: {
            MAX_TITLE_LEN: 100,
            MAX_COMMENT_LEN: 100,
            MAX_LOCATION_LEN:100,

            ERRORCODE: {
                FILTER_TITLE_RUBBISH: 126,
                FILTER_CONTENT_RUBBISH: 108,
                NEED_IDENTIFY: 910, //需要图片验证码
                FREQUENCY_LIMIT: 911 //频率超限
            },
            MAX_ADDR_SELECT:20
        },
        initialize: function (options) {
            var _this = this;

            _this.options = options || {};
            _this.model = new M2012.Calendar.Popup.Model.Countdown(options);
            _this.master = options.master;
            _this.remindType = options.master.CONST.remindSmsEmailTypes;
            _this.render();
            _this.initEvents();
        },
        render: function () {
            var _this = this;

            var html = $T.format(_this.template.MAIN, {
                cid: _this.cid,
                titleMaxLen: _this.configs.MAX_TITLE_LEN,
                commentMaxLen: _this.configs.MAX_COMMENT_LEN,
                locationMaxLen: _this.configs.MAX_LOCATION_LEN
            });

            _this.dialog = $Msg.showHTML(html, function (e) {
                // 点击确定按钮
                e.cancel = true;

                if (_this.validateTopicContent() &&  _this.validateSetTime()) {
                    var param = _this.wrapParam();

                    // 显示遮罩层
                    $(_this.showMaskContent).insertBefore(_this.dialog.btnEl.children(":first"));
                    _this.model.addCalendar(param, function(detail, json) {
                        if (detail.code == 'FS_UNKNOW') {
                            var info = _this.model.getUnknownExceptionInfo(detail.errorCode);
                            info ? $Msg.alert(info) : _this.error(detail); // 无信息返回,暂时认为要输入验证码
                            _this.dialog.btnEl.children(":first").remove();
                            return;
                        }

                        // 创建成功之后的处理
                        top.M139.UI.TipMessage.show('创建成功', { delay: 3000 });
                        _this.dialog.close();
                        _this.master.capi.addBehavior("calendar_addcountdownact_success"); // 行为日志ID
                        _this.master.trigger(_this.master.EVENTS.NAVIGATE, { path: "view/update" });
                    }, function (json){
                        top.M139.UI.TipMessage.show('创建失败', { delay: 3000 });
                        _this.dialog.btnEl.children(":first").remove();
                    });
                }
            },
            {
                name:"popup_countdown_view",
                width: "550px",
                dialogTitle: _this.template.dialogTitle,
                buttons: ['保存', '取消'],
                onClose: function () {
                    // 关闭"弹出窗"窗口时需要清除定时器
                    _this.model.clearTimeout();
                    // TODO 此处dialog中的任务元素都可以,但不能是$(document),不然在IE下会有问题
                    // TODO 关联JS,m139.out.dom.js中的bindAutoHide方法
                    $(_this.dialog.el).click();
                }
            });
        },
        initEvents: function () {
            var _this = this;
            var options = _this.options;
            var dialog = _this.dialog;
            var $dialogEl = dialog.$el;

            // 保存dom节点
            dialog.setTimeContainer = $dialogEl.find(_this.getSelector("_set_time"));
            dialog.countdowntimeDiv = $dialogEl.find(_this.getSelector("_count_downtime"));
            dialog.remindContainer = $dialogEl.find(_this.getSelector("_remind"));
            dialog.indentityContainer = $dialogEl.find(_this.getSelector("_indentity"));
            dialog.remindContentDom = $dialogEl.find(_this.getSelector("_remind_content"));
            dialog.titleMaxTip = $dialogEl.find(_this.getSelector("_titleMaxTip"));
            dialog.titleEmptyTip = $dialogEl.find(_this.getSelector("_titleEmptyTip"));
            dialog.btnEl = $dialogEl.find("div .boxIframeBtn").css("position", "relative");

            // 动态显示倒计时时间
            _this.callback = function (param) {
                // 没有过期
                if (!param.expired) {
                    var content = "",
                        days = param.days,
                        hours = param.hours,
                        minutes = param.minutes;

                    if (days > 0) {
                        content = days + "天 ";
                    }

                    if (hours >  0) {
                        content = content + hours + "时 ";
                    }

                    content = content + minutes + "分";
                    dialog.countdowntimeDiv.html(content);
                }
            };

            _this.initial = true; // 表示是否是第一次打开窗口

            // 创建新的时间选择控件
            this.setDateTime = new M2012.Calendar.View.DaytimePicker({
                master: _this.master,
                container: dialog.setTimeContainer,
                onChange: function (obj) {
                    _this.model.set("setTimeObj", obj);
                    // 首次打开"倒计时"弹出窗口时需调用
                    if (_this.initial) {
                        _this.updateCountdown();
                    }
                }
            });

            // 调整设置时间的高度
            dialog.setTimeContainer.children().css({
                height: Constant.Common_Config.Shortcut_setTime_Height,
                lineHeight : Constant.Common_Config.Shortcut_setTime_Height
            }).find("input").addClass("mt_0");

            // 设置时间改变, 倒计时时间也相应改变, 且需重新设置initial值
            _this.model.on("change:setTimeObj", function () {
                _this.initial = false;
                _this.model.clearTimeout();
                _this.updateCountdown();
            });

            // 提醒自己
            _this.remind = new M2012.Calendar.View.Reminder({
                container: dialog.remindContainer
            });

            // 去掉提醒控件后的多余节点,只保留"邮件","短信"的下拉框选项
            if (dialog.remindContainer) {
                dialog.remindContainer.children(":first").remove();
                _this.remind.getElement && _this.remind.getElement("remind_type").removeClass("ml_10");
            }

            // 验证码
            _this.identify = new M2012.Calendar.View.Identify({
                wrap: this.cid + '_indentity',
                name: 'indentity',
                titleName: '验证码'
            });

            // 提醒主题添加"focus"事件
            dialog.remindContentDom.on("focus", function() {
                _this.dialog.titleEmptyTip.hide();
                if ($(this).val() === this.defaultValue) {
                    $(this).val("");
                }
            });

            // 提醒主题添加"blur"事件
            dialog.remindContentDom.on("blur", function(){
                if ($(this).val() === '') {
                    $(this).val(this.defaultValue);
                }
            });

            // 验证不超过100个字符
            dialog.remindContentDom.bind("keyup keydown change",function(){
                var dialog = _this.dialog;
                var remindContentDomValue = dialog.remindContentDom.val(),
                    contentLen = remindContentDomValue.length;

                if(contentLen > 100){
                    dialog.titleMaxTip.show();
                    dialog.remindContentDom.val(remindContentDomValue.substr(0, 100));
                    M139.Dom.flashElement(dialog.remindContentDom.selector);
                }
        });

            // 修改问题单号1988,保持提示信息风格统一
            $(document).bind('click', function(){
                _this.dialog.titleMaxTip.hide();
                _this.dialog.titleEmptyTip.hide();
            });

            try {
                // 至少看到标题栏，这样起码可以关掉弹窗
                setTimeout(function () {
                    var top = parseInt($dialogEl.css("top"));
                    if (top < 0) {
                        $dialogEl.css("top", 5);
                    }
                }, 150);
            } catch (e) { }
        },
        validateTopicContent : function () {
            var dialog = this.dialog;
            var remindContentDomValue = $.trim(dialog.remindContentDom.val());
            // 验证主题内容,1: 不为空, 2: 不超过100字符
            if (remindContentDomValue === dialog.remindContentDom.get(0).defaultValue) {
                dialog.titleEmptyTip.show();
                M139.Dom.flashElement(dialog.remindContentDom.selector);
                return false;
            }

            if (remindContentDomValue.length > 100) {
                dialog.titleMaxTip.show();
                M139.Dom.flashElement(dialog.remindContentDom.selector);
                return false;
            }
            return true;
        },
        validateSetTime : function () {
            // 首次打开"倒计时"弹出窗口或直接点击"保存"按钮时不需要进行验证
            if (this.initial) {
                return true;
            }

            // 验证时间,1:设置事件比当前系统时间早, 2:设置事件比当前时间晚5年
            var datetime =  this.model.get("setTimeObj").datetime,
                currentTime = this.model.getCurrentServerTime();
                //tipDom = this.dialog.$el.find(this.setDateTime.getSelector("_tips")),
                //tipContentDom = tipDom.children().first(); // 找到设置时间的tip节点

            // 修改提示信息框的样式,修改问题单号1987
            //tipDom.css({
              //  "margin-top" : "0px",
             //   "top" : "-22px",
              //  "left" : "60px"
           // });

            // 与当前时间对比，是否早于当前时间
            if (currentTime > datetime) {
                Validate.show("时间已过期,不能设置为倒数日", this.dialog.setTimeContainer);
                //M139.Dom.flashElement(this.dialog.setTimeContainer.selector);
                return false;
            }

            // 与当前时间对比,是否超过5年
            if (datetime.getFullYear() - currentTime.getFullYear() > 5) {
               // tipContentDom.html("时间太久远了");
                Validate.show("时间太久远了", this.dialog.setTimeContainer);
                //this.setDateTime.showTip();
                //M139.Dom.flashElement(this.dialog.setTimeContainer.selector);
                return false;
            }

            //this.setDateTime.hideTip();
            return true;
        },
        wrapParam : function () { // 封装需要传递的参数
            var _this = this,
                topic = _this.dialog.remindContentDom.val(),
                setTime = $Date.format("yyyy-MM-dd hh:mm:ss", this.model.get("setTimeObj").datetime),
                remindObj = {
                    beforeType : 0,
                    beforeTime : 0,
                    recMyEmail : _this.remind.model.get("remindType") == _this.remindType.email.value ? 1 : 0,
                    recMySms : _this.remind.model.get("remindType") == _this.remindType.freeSms.value ? 1 : 0,
                    recEmail: _this.master.capi.getUserEmail(),
                    recMobile: _this.master.capi.getUserMobile(),
                    enable : 1
                },
                param = {
                    title : $.trim(topic),
                    content : "",
                    color : "#2757EC",
                    //dateFlag : setTimeObj.date,
                    //endDateFlag: setTimeObj.date,
                    //startTime: setTimeObj.time,
                    //endTime: setTimeObj.time,
                    dtStart : setTime,
                    dtEnd : setTime,
                    validImg : _this.identify.getData() // 验证码
                };
            // 添加提醒设置的属性
            param = $.extend(param, _this.model.transform(remindObj));
            return param;
        },
        // 错误处理 TODO 是否需要传递data参数
        error : function (detail) {
            this.accessIdentify(detail);
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
        updateCountdown : function () {
            if (this.validateSetTime()) {
                // 验证通过,表示设置时间合法
                var obj = this.model.get("setTimeObj");
                if (this.model.calculateCountdown) {
                    this.model.calculateCountdown(obj.datetime, this.callback);
                }
            }
        },
        getSelector: function (id) {
            return "#" + this.cid + id;
        }
    }));
})(jQuery, _, M139, window._top || window.top);