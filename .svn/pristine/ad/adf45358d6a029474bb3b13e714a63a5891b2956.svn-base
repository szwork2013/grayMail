

/**
 * 会议邀请合并在 cal_index_addLabel_async.html.pack.js 中
 * 因为添加日历的第二步,也有添加活动.也有通讯录联想等,减少js合并以及引用 
 */

(function (jQuery, _, M139, top) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Calendar.View.Meeting', superClass.extend({
        template: {
            MAIN: ['<div>',
                     '<div>',
                        '<div class="meetSendscro">',
                         '<div class="meetSend">',
                             '<form>',
                             '<fieldset>',
                                 '<legend class="hide">表单作用</legend>',
                                 '<ul class="form meetsend-form">',
                                     //{cid}_select_label
                                     '<li id="{cid}_label_container" class="formLine">',
                                     '</li>',
                                     '<li class="formLine">',
                                         '<label class="label">会议主题：</label>',
                                         '<div class="element">',
                                             //{cid}_title_empty_tip
                                             '<div id="{cid}_title_empty_tip" class="tips meet-tips" style="display:none;">',
                                                 '<div class="tips-text">会议主题不能为空</div>',
                                                 '<div class="tipsBottom diamond"></div>',
                                             '</div>',
                                             //{cid}_title_input
                                             '<input id="{cid}_title_input" maxlength="{titleMaxLen}" class="iText" type="text">',
                                         '</div>',
                                     '</li>',
                                     '<li class="formLine">',
                                         '<label class="label">会议内容：</label>',
                                         '<div class="element">',
                                             //{cid}_content_over_tip
                                             '<div id="{cid}_content_over_tip" class="tips meet-tips" style="display:none;">',
                                                 '<div class="tips-text">会议内容不能超过500个字</div>',
                                                 '<div class="tipsBottom diamond"></div>',
                                             '</div>',
                                             //{cid}_content_input
                                             '<textarea id="{cid}_content_input" class="iText tagarea"></textarea>',
                                         '</div>',
                                     '</li>',
                                     '<li class="formLine">',
                                         '<label class="label">会议地点：</label>',
                                         '<div class="element">',
                                             //{cid}_pos_over_tip
                                             '<div id="{cid}_pos_over_tip" class="tips meet-tips" style="display:none;">',
                                                 '<div class="tips-text">会议地点不能超过100个字</div>',
                                                 '<div class="tipsBottom diamond"></div>',
                                             '</div>',
                                             //{cid}_location_input
                                             '<input id="{cid}_location_input" maxlength="{locationMaxLen}" class="iText" type="text">',
                                         '</div>',
                                     '</li>  ',
                                     '<li class="formLine">',
                                         '<label class="label">开始时间：</label>',
                                         //{cid}_start_time
                                         '<div id="{cid}_start_time" class="element">',
                                         '</div>',
                                     '</li>  ',
                                     '<li class="formLine">',
                                         '<label class="label">结束时间：</label>',
                                         //{cid}_end_time
                                         '<div id="{cid}_end_time" class="element">',
                                         '</div>',
                                     '</li>',
                                     '<li class="formLine">',
                                         '<label class="label">&nbsp;</label>',
                                         '<div class="element">',
                                            //{cid}_all_day
                                            '<input id="{cid}_all_day" type="checkbox"><label for="{cid}_all_day" class="ml_5 mr_10">全天</label>',
                                            //{cid}_lunar_day
                                            '<input id="{cid}_lunar_day" type="checkbox"><label for="{cid}_lunar_day" class="ml_5">农历</label>',
                                         '</div>',
                                     '</li>  ',
                                     '<li class="formLine">',
                                         '<label class="label">提醒自己：</label>',
                                         //{cid}_remind
                                         '<div id="{cid}_remind" class="element"> ',
                                         '</div>',
                                     '</li>  ',
                                     '<li class="formLine">',
                                         //{cid}_btnAddInvite
                                         '<p><a id="{cid}_btnAddInvite" href="javascript:void(0)">+添加其他参与人</a><span class="gray ml_5">该活动除了您在会议日历下共享的参与人外，还可以添加其他参与人</span></p>',
                                     '</li>',
                                 '</ul>',
                             '</fieldset>',
                         '</form>',
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
                         '</div>',
                      '</div>',
                      //按钮区域
                      '<div class="boxIframeBtn">',
                         '<span class="bibText"></span>',
                         '<span class="bibBtn">',
                             //{cid}_loading
                             '<span id="{cid}_loading" class="spanImg hide" style="margin-right:20px"><img src="/m2012/images/global/load.gif" alt="加载中..." title="加载中,请稍候..."></span>',
                             //{cid}_submit
                             '<a id="{cid}_submit" href="javascript:void(0)" class="btnSure"><span>确 定</span></a> ',
                             //{cid}_submit_and_send
 					         '<a id="{cid}_submit_and_send" href="javascript:void(0)" style="position:relative; top:3px\0;" class="ml_10">',
   						        '<i class="i_m_n" style="height:14px\0;"></i>',
                                '<span class="ml_5">确定并发送会议材料</span>',
                             '</a>',
                         '</span>',
                     '</div>',
                    '</div>'].join(""),

            dialogTitle: "创建会议邀请"
        },
        keyMap: {
            ENTER: 13,
            SEMICOLON: ($.browser.mozilla || $.browser.opera) ? 59 : 186, //分号
            COMMA: 188 //逗号
        },
        configs: {
            MAX_TITLE_LEN: 100,
            MAX_COMMENT_LEN: 500,
            MAX_LOCATION_LEN:100,

            ERRORCODE: {
                FILTER_TITLE_RUBBISH: 126,
                FILTER_CONTENT_RUBBISH: 108,
                NEED_IDENTIFY: 910, //需要图片验证码
                FREQUENCY_LIMIT: 911 //频率超限
            },

            MESSAGES: {
                126: "添加的内容含敏感词，请重新输入",
                108: "添加的内容含敏感词，请重新输入",
                910: "您添加太频繁了，请稍后再试", //暂时先不提示验证码
                911: "您添加太频繁了，请稍后再试",

                BEFORE_TIME_NOW: "开始时间早于当前时间,会无法下发当天之前的提醒通知",

                MSG_INVITE_MAX: '邀请人数已达到上限 {max} 人',

                TITLE_OVER_LENGTH: "不能超过100个字符",
                TITLE_EMPTY: '会议主题不能为空'
            },

            MAX_ADDR_SELECT:20
        },
        initialize: function (options) {
            var _this = this;

            _this.options = options || {};
            _this.master = options.master || window.$Cal;
            _this.model = new M2012.Calendar.Model.Meeting({ master: _this.master });

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

            _this.dialog = $Msg.showHTML(html, {
                name:"calendar_popup_addmeeting_view",
                width: "550px",
                dialogTitle: _this.template.dialogTitle,
                onClose: function () {
                    _this.invites.hideSuggest();
                    if (_this.options && _this.options.updateLabel == true) {
                        _this.refreshView();
                    }
                }
            });
        },
        initEvents: function () {
            var _this = this;
            var options = _this.options;
            var dialog = _this.dialog;
            var $dialogEl = dialog.$el;
            var config = _this.configs;

            //保存一堆自己都记不住的dom
            //#region 
            dialog.mainContainer = $dialogEl.find(".meetSendscro");
            dialog.labelContainer = $dialogEl.find(_this.getSelector("_label_container"));
            dialog.titleTip = $dialogEl.find(_this.getSelector("_title_empty_tip"));
            dialog.titleInput = $dialogEl.find(_this.getSelector("_title_input"));
            dialog.contentTip = $dialogEl.find(_this.getSelector("_content_over_tip"));
            dialog.contentInput = $dialogEl.find(_this.getSelector("_content_input"));
            dialog.locationTip = $dialogEl.find(_this.getSelector("_pos_over_tip"));
            dialog.locationInput = $dialogEl.find(_this.getSelector("_location_input"));
            dialog.startTimeContainer = $dialogEl.find(_this.getSelector("_start_time"));
            dialog.endTimeContainer = $dialogEl.find(_this.getSelector("_end_time"));
            dialog.cbAllDay = $dialogEl.find(_this.getSelector("_all_day"));
            dialog.cbLunarDay = $dialogEl.find(_this.getSelector("_lunar_day"));
            dialog.remindContainer = $dialogEl.find(_this.getSelector("_remind"));
            dialog.btnAddInvite = $dialogEl.find(_this.getSelector("_btnAddInvite"));
            dialog.inviteDiv = $dialogEl.find(_this.getSelector("_invite_div"));
            dialog.inviteTip = $dialogEl.find(_this.getSelector("_invite_tips"));
            //dialog.inviteInput = $dialogEl.find(_this.getSelector("_invite_input"));
            dialog.inviteInputContainer = $dialogEl.find(_this.getSelector("_invite_input_container"));
            dialog.linkSelectAddr = $dialogEl.find(_this.getSelector("_select_addr_link"));
            dialog.inviteListContainer = $dialogEl.find(_this.getSelector("_invite_list_container"));
            dialog.msgContainer = $dialogEl.find(_this.getSelector("_msg_content"));
            dialog.loading = $dialogEl.find(_this.getSelector("_loading"));
            dialog.btnSubmit = $dialogEl.find(_this.getSelector("_submit"));
            dialog.btnSubmitAndSend = $dialogEl.find(_this.getSelector("_submit_and_send"));
            
            //#endregion

            //#region 渲染对应组件

            dialog.titleInput.on("focus", function () {
                dialog.titleTip.hide();
            }).on("keyup", function () {
                var len = $(this).val().length;
                if (len == config.MAX_TITLE_LEN) {
                    dialog.titleTip.find(".tips-text").html(_this.configs.MESSAGES.TITLE_OVER_LENGTH);
                    dialog.titleTip.show();

                    //定时隐藏
                    if (dialog.titleTimer) clearTimeout(dialog.titleTimer);
                    dialog.titleTimer = setTimeout(function () {
                        dialog.titleTip.hide();
                    }, 2500);
                }
            });

            dialog.contentInput.on("keyup keydown", function () {
                //TODO 迟早会重构,先用CP+CV的方法搞定
                var text = $(this).val();
                if (text.length > config.MAX_COMMENT_LEN) {
                    dialog.contentTip.show();
                    $(this).val(text.substr(0, config.MAX_COMMENT_LEN));
                    //定时隐藏
                    if (dialog.contentTimer) clearTimeout(dialog.contentTimer);
                    dialog.contentTimer = setTimeout(function () {
                        dialog.contentTip.hide();
                    }, 2500);
                }
            });
            dialog.locationInput.on("keyup", function () {
                var text = $(this).val();
                if (text.length >= config.MAX_LOCATION_LEN) {
                    $(this).val(text.substring(0, config.MAX_LOCATION_LEN));
                    dialog.locationTip.show();

                    //定时隐藏
                    if (dialog.locationTimer) clearTimeout(dialog.locationTimer);
                    dialog.locationTimer = setTimeout(function () {
                        dialog.locationTip.hide();
                    }, 2500);
                }
            });

            //日历选择
            _this.label = new M2012.Calendar.View.LabelMenu({
                target: dialog.labelContainer,
                labels: options.labels,
                labelId: options.labelId,
                width: "466px"
            });

            //开始时间
            _this.startDateTime = new M2012.Calendar.View.DateTimePicker2({
                container: dialog.startTimeContainer,
                onSelected: function (obj) {
                    _this.model.set("startTimeObj", obj);
                }
            });

            //结束时间
            _this.endDateTime = new M2012.Calendar.View.DateTimePicker2({
                container: dialog.endTimeContainer,
                offset: 1, //再下一个30分钟的选项
                onSelected: function (obj) {
                    _this.model.set("endTimeObj", obj);
                }
            });

            //用来显示开始时间和结束时间的提示语
            _this.model.on("change:startTimeObj", function () {
                _this.checkTime();
            }).on("change:endTimeObj", function () {
                _this.checkTime();
            });

            //全天
            dialog.cbAllDay.on("click", function () {
                var fullday = $(this).attr("checked") ? true : false;
                var options = { fullday: fullday };
                _this.startDateTime.setType(options);
                _this.endDateTime.setType(options);
            });

            //农历
            dialog.cbLunarDay.on("click", function () {
                var lunar = $(this).attr("checked") ? true : false;
                var options = { lunar: lunar };
                _this.startDateTime.setType(options);
                _this.endDateTime.setType(options);
            });

            //提醒自己
            _this.remind = new M2012.Calendar.View.Reminder({
                container: dialog.remindContainer
            });

            //强DOM侵入,产品提的体验问题,只能改了
            var remind = $(dialog.remindContainer.selector);
            remind.find(".dropDown-tips").css({ "width": "131px" });
            remind.find(".dropDown-ymtime").removeClass("ml_10");
            //end

            //#endregion

            //#region 一堆组件的监听事件

            _this.model.set("isAddInvite", false); //默认不显示 添加其他参与人
            dialog.btnAddInvite.on("click", function () {
                var isshow = _this.model.get("isAddInvite");
                _this.model.set("isAddInvite", !isshow);
                if (isshow) {
                    //隐藏
                    dialog.inviteDiv.slideUp();
                } else {
                    //显示
                    dialog.inviteDiv.slideDown(250);
                    
                    //setTimeout(function () {
                    //    //滚动到最下面，如果比获取initCalendar接口快的话就不是最下面
                    //    dialog.mainContainer.scrollTop(dialog.mainContainer[0].scrollHeight + 50);
                    //    _this.invites.addrInput.focus();
                    //}, 500);

                    //请求短信接口
                    _this.getMsgFeeTip();

                    setTimeout(function () {
                        dialog.mainContainer.animate({ "scrollTop": 1000 }, function () {
                            _this.invites.addrInput.focus();
                        });
                    }, 0);
                }
            });

            //同时邀请别人
            _this.invites = new M2012.Calendar.UI.Invite.View({
                target: dialog.inviteListContainer,
                input: dialog.inviteInputContainer
            });

            //打开通讯录选择联系人
            if (window.ISOPEN_CAIYUN) {
                dialog.linkSelectAddr.remove();
            } else {
                var max = _this.configs.MAX_ADDR_SELECT;
                dialog.linkSelectAddr.on("click", function () {
                    var selectedAddr = _this.invites.getData();
                    var maxAddrCount = max - (selectedAddr.length || 0); //最大的可选数量
                    var addrView = top.M2012.UI.Dialog.AddressBook.create({
                        filter: "email",
                        //items: _this.invites.getEmails(),
                        maxCount: maxAddrCount
                    }).on("select", function (e) {
                        var items = e.value;
                        _this.invites.addData(items); //添加到列表中
                    }).on("additemmax", function () {
                        top.$Msg.alert($T.format(_this.configs.MESSAGES.MSG_INVITE_MAX, {
                            max: max
                        }));
                    });
                });
            }

            dialog.btnSubmit.on("click", function (e) {
                _this.onSubmitClick();
            });
            
            //如果是彩云，没的发邮件
            if (window.ISOPEN_CAIYUN) {
                dialog.btnSubmitAndSend.remove();
            } else {
                dialog.btnSubmitAndSend.on("click", function (e) {
                    _this.onSubmitClick({ sendMail: true });
                });
            }

            //#endregion

            try {
                //至少看到标题栏，这样起码可以关掉弹窗
                setTimeout(function () {
                    var top = parseInt($dialogEl.css("top"));
                    if (top < 0) {
                        $dialogEl.css("top", 5);
                    }
                }, 150);
            } catch (e) { }
        },
        getMsgFeeTip: function () {
            var _this = this;
            var feeData = _this.model.get("fee");
            if (!feeData) {
                _this.model.initCalendar(function (data) {
                    _this.model.set("fee", data);
                    _this.dialog.msgContainer.html(data.freeInfo);
                });
            }
        },
        checkTime: function () {
            var _this = this;
            var startDate = _this.model.get("startTimeObj") || {},
                endDate = _this.model.get("endTimeObj") || {};

            var isshow = false;
            //简单点用字符串比
            if ((endDate.date < startDate.date) || //结束日期小于开始日期
                (endDate.date == startDate.date && endDate.time < startDate.time)) { //日期相同，时间不同
                isshow = true;
            }

            if (isshow) {
                _this.startDateTime.showTip();
            } else {
                _this.startDateTime.hideTip();
            }
            return isshow;
        },
        isTimeBefore:function(params){
            var _this = this;
            var startDate = _this.model.get("startTimeObj");

            if (!params.enable) return false; //没勾选提醒

            //#region 以下计算提前时间
            var date = new Date(startDate.datetime.getTime()); //复制，不修改原来的
            var beforeType = params.beforeType,
                beforeTime = params.beforeTime;
            var beforeMinutes = 0; //提前的时间,全部折算回分钟
            var beforeTypeData = _this.model.get("beforeTypes"); //数据原型
            if (beforeTypeData[beforeType]) {
                beforeMinutes = beforeTime * beforeTypeData[beforeType]; //折算回提前多少分钟
            }
            beforeMinutes = date.getMinutes() - beforeMinutes; //实际的提前时间
            date.setMinutes(beforeMinutes);
            //#endregion

            if (date <= new Date()) {
                return true;
            }
            return false;
        },
        getSelector: function (id) {
            return "#" + this.cid + id;
        },
        onSubmitClick: function (options) {
            var _this = this;
            options = options || {};

            //if (_this.busy) {
            //    _this.alert = top.$Msg.alert("处理中，请稍候...");
            //    return;
            //}

            var dialog = _this.dialog;
            var title = dialog.titleInput.val();

            if ($.trim(title) == "") {
                _this.dialog.mainContainer.animate({ "scrollTop": 0 });
                _this.dialog.titleTip.find(".tips-text").html(_this.configs.MESSAGES.TITLE_EMPTY);
                _this.dialog.titleTip.show();
                M139.Dom.flashElement(dialog.titleInput.selector);
                setTimeout(function () {
                    _this.dialog.titleTip.hide();
                }, 3000);
                return;
            }

            var calTypes = _this.model.get("calendarType");

            //获取对象或者dom的值
            var labelObj = _this.label.getData();
            var content = dialog.contentInput.val(),
                location = dialog.locationInput.val();
            var startDateObj = _this.startDateTime.getData(),
                endDateObj = _this.endDateTime.getData();
            var fullday = dialog.cbAllDay.attr("checked") ? true : false;
            var calendarType = dialog.cbLunarDay.attr("checked") ? calTypes.lunar : calTypes.calendar;
            var remindObj = _this.remind.getData();
            var invites = [];
            if (_this.model.get("isAddInvite")) {
                invites = _this.invites.getData();
            }

            //拼参数
            var params = {
                calendarType: calendarType, //日历类型

                title: title.substr(0, _this.configs.MAX_TITLE_LEN),
                content: content.substr(0, _this.configs.MAX_COMMENT_LEN),
                site: location.substr(0, _this.configs.MAX_LOCATION_LEN),

                labelId: labelObj.labelId,
                color: labelObj.color,

                beforeTime: remindObj.beforeTime,
                beforeType: remindObj.beforeType,
                recMyEmail: remindObj.recMyEmail,
                recMySms: remindObj.recMySms,
                enable: remindObj.enable,

                //dateFlag: startDateObj.date,
                //endDateFlag: endDateObj.date,
                //startTime: startDateObj.time,
                //endTime: endDateObj.time,

                dtStart: startDateObj.sdatetime,
                dtEnd: endDateObj.sdatetime,
                untilDate: endDateObj.date,
                allDay: 0,

                inviteInfo: invites
            };

            //全天事件，修正时间
            if (fullday) {
                var enddate = new Date(endDateObj.datetime.getTime());
                enddate.setDate(enddate.getDate() + 1); //全天.日期加1

                $.extend(params, {
                    //startTime: "0800",
                    //endTime: "2359",
                    dtStart: startDateObj.date + " 00:00:00",
                    dtEnd: M139.Date.format("yyyy-MM-dd", enddate) + " 00:00:00",
                    allDay: 1
                });
            }

            var isTimeAllow = _this.checkTime();
            if (isTimeAllow) return; //时间区间选择不正确

            if (_this.isTimeBefore(params)) { //比当前时间早，提示
                top.$Msg.confirm(_this.configs.MESSAGES.BEFORE_TIME_NOW, function () {
                    _this.addMeetingEvent(params, options.sendMail);
                });
                return;
            }

            //if (calendarType == calTypes.lunar) {
            //    //农历，换成农历的时间。
            //    //WARN: 此段要放在isTimeBefore时间比较之后，因为比较时间是用的公历
            //    var startDate = _this.model.joinDate(startDateObj.lunar),
            //        endDate = _this.model.joinDate(endDateObj.lunar);

            //    params = $.extend(params, {
            //        dateFlag: startDate,
            //        endDateFlag: endDate
            //    });
            //}

            //为解决闰月的问题，加上公历的真实时间
            params = $.extend(params, {
                realDate: startDateObj.date,
                realEndDate: endDateObj.date
            });

            _this.addMeetingEvent(params, options.sendMail);
        },
        toggleLoading:function(){
            var dialog=this.dialog,
                btnSubmit=dialog.btnSubmit,
                btnSubmitAndSend=dialog.btnSubmitAndSend,
                loading=dialog.loading;

            btnSubmit.toggleClass("hide");
            btnSubmitAndSend.toggleClass("hide");
            loading.toggleClass("hide");
        },
        addMeetingEvent: function (params, isSendMail) {
            var _this=this;

            _this.toggleLoading();

            _this.model.addCalendar(params, function (result) {
                //_this.alert && _this.alert.close();

                if (isSendMail == true) {
                    var emails = _.map(params.inviteInfo, function (item) {
                        return item.email || item.recEmail || item.inviterUin; //随便找一个有邮箱的
                    });

                    top.$App.show("compose", null, {
                        inputData: {
                            receiver: emails,
                            subject: params.title,
                            content: '附上“' + $T.Html.encode(params.title) + '”的会议材料，请查收附件！'
                        }
                    });

                    _this.dialog.close();

                    _this.refreshView();
                    return false;
                }

                _this.dialog.close();
                _this.refreshView();
                //BH('calendar_addinvite_succeed');
                _this.master && _this.master.capi.addBehavior("calendar_addinviteact_success"); // 行为日志ID
                return false;
            }, function (json) {
                var code = json && json.errorCode;
                var msgList = _this.configs.MESSAGES;

                var msg = msgList[code];

                if (msg) {
                    top.$Msg.alert(msg);
                }
                //_this.busy = false;

                _this.toggleLoading();
            }, function () {
                //_this.busy = false;
                _this.toggleLoading();
            });
        },
        refreshView: function () {
            //$Cal && $Cal.trigger($Cal.EVENTS.NAVIGATE, { path: "mainview/refresh" });
            //M2012.Calendar.CommonAPI.getInstance().updateMainView();
            top.M139.UI.TipMessage.show("创建成功", { delay: 3000 });
			$Cal && $Cal.trigger("master:navigate", { path: "view/update" });
        }
    }));
})(jQuery, _, M139, window._top || window.top);