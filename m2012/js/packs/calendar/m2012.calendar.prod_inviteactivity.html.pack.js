
/**
 * 拒绝原因
 * @param target {HTMLElement} 需要弹窗的对象,会将html模板添加到对象后面
 * @param onSubmit {Function} 点击确定时的回调,会传入谢绝原因字符串
 * 
 * examples:
 * new RefusePopup({
 *     target:document.getElementById(''),
 *     onSubmit:function(reason){
 *         alert(reason);
 *     }
 * });
 */
; (function ($) {
    function RefusePopup(options) {
        var _this = this;
        _this.options = options;
        _this.callback = options.onSubmit || $.noop;
        _this.all = $("a", document);
        _this.target = $(options.target);
        _this.$el = $(_this.template);
        _this.textarea = _this.$el.find('textarea');
        _this.submit = _this.$el.find('#submit');
        _this.cancel = _this.$el.find('#cancel');

        _this.target.after(_this.$el);

        //计算偏移
        var offset = _this.target.offset();
        var currentTop = offset.top - _this.$el.height() - 10; //稍微偏上
        _this.$el.css('top', currentTop);

        //事件绑定
        bindEvents();

        //关闭浮层
        function closePopup() {
            _this.$el.remove();
        }

        function bindEvents() {
            //页面内点击隐藏浮层
            $(document.body).on('click', function (e) {
                closePopup();
            });

            //在浮层内点击取消事件冒泡
            _this.$el.on('click', function (e) {
                e.stopPropagation(); //阻止冒泡
            });

            //点击确定,回调
            _this.submit.on('click', function (e) {
                var reason = _this.textarea.val();
                reason = reason == _this.placeholderText ? '' : reason; //去掉默认的placeholder
                _this.callback(reason);
                closePopup();
            });

            //点击取消
            _this.cancel.on('click', function () {
                closePopup();
            });

            //给按钮绑定事件
            _this.all.on('click', function () {
                closePopup();
            });

            //设置最大输入长度
            try { top.M139.Dom.setTextBoxMaxLength(_this.textarea, _this.maxLength); } catch (e) { }

            //placeholder
            if (isSupportPlaceholder()) {
                _this.textarea.attr('placeholder', _this.placeholderText).css('color', _this.normalColor);
            } else {
                _this.textarea.on('focus', function (e) {
                    var input = $(this);
                    var text = input.val();
                    if (text == _this.placeholderText) {
                        input.val('').css('color', _this.normalColor);
                    }
                }).on('blur', function (e) {
                    var input = $(this);
                    var text = input.val();

                    if (text.replace(/\s/gi, '') == '') {
                        input.val(_this.placeholderText).css('color', _this.placeholderColor);
                    }
                });

                setTimeout(function () {
                    _this.textarea.trigger('blur');
                }, 0xff);
            }
        }

        function isSupportPlaceholder() {
            return 'placeholder' in document.createElement('input');
        }
    }

    RefusePopup.prototype.placeholderText = '谢绝原因（50个字）';
    RefusePopup.prototype.maxLength = 50; //最大输入长度
    RefusePopup.prototype.normalColor = '#000';
    RefusePopup.prototype.placeholderColor = '#999';
    RefusePopup.prototype.template = ['<div style="z-index: 1001; width: 342px; top: -155px; left: 53px; position:absolute;background: #FEFEFE;border:1px solid #cecece;padding:3px 6px; color:#666; -moz-box-shadow:0 0 5px #cecece; -webkit-box-shadow:0 0 5px #cecece; box-shadow:0 0 5px #cecece; -moz-border-radius:3px; -webkit-border-radius:3px; border-radius:3px; padding:0; margin:0;">',
                     '<div style=" margin:0; padding:0;">',
                         '<div style="padding:10px 10px 5px 10px; margin:0; background-color:#fafafa; -moz-border-radius:3px 3px 0 0; -webkit-border-radius:3px 3px 0 0;  border-radius:3px 3px 0 0;">',
                             '<div style="overflow:hidden;zoom:1; margin:0; padding:0;">',
                                 '<div style="overflow:hidden;zoom:1; margin:0; padding:0;">',
                                     '<textarea style="font:12px/1.5 \'Microsoft YaHei\',Verdana,\'Simsun\';border:1px solid #c5c5c5;border-top-color:#c6c6c6;border-right-color:#dadada;border-bottom-color:#dadada;padding:4px 5px;height:15px; width: 310px;height: 70px;margin: 8px 0; resize:none; overflow:auto; color:#999;">',
                                         '',
                                     '</textarea>',
                                 '</div>',
                             '</div>',
                         '</div>',
                         '<div style="border-top:1px solid #e8e8e8;text-align:right;height:24px;background-color:#fff;position:relative;padding:6px; margin:0; -moz-border-radius:0 0 3px 3px; -webkit-border-radius:0 0 3px 3px; border-radius:0 0 3px 3px;">',
                             '<a id="submit" href="javascript:void(0)" style="height:24px; line-height:24px; color:#fff; background:#00BE16;  background: -moz-gradient(linear, 0 0, 0 100%, from(#00C417), to(#00B615)); background: -webkit-gradient(linear, 0 0, 0 100%, from(#00C417), to(#00B615));  background: linear-gradient(#00C417 0%,#00B615 100%); display:inline-block;cursor:pointer;padding:0 0 0 12px; margin:0; overflow:hidden;vertical-align:middle; _background:#00BE16; text-decoration:none;">',
                                 '<span style=" font:12px/1.5 \'Microsoft YaHei\',Verdana,\'Simsun\'; height:24px; line-height:24px; color:#fff; display:inline-block;padding:0 12px 0 0; margin:0;overflow:visible;text-align:center;vertical-align:top;white-space:nowrap;">',
                                     '确 定',
                                 '</span>',
                             '</a>',
                             '<a id="cancel" style="height:22px; line-height:22px; border:1px solid #e2e2e2; color:#666 !important; background:#F9F9F9; background: -moz-gradient(linear, 0 0, 0 100%, from(#FFFFFF), to(#F4F4F4)); background: -webkit-gradient(linear, 0 0, 0 100%, from(#FFFFFF), to(#F4F4F4));  background: linear-gradient(#FFFFFF 0%,#F4F4F4 100%); display:inline-block;cursor:pointer;height:22px;padding:0 0 0 12px;overflow:hidden;vertical-align:middle; margin:0 0 0 5px; text-decoration:none;"',
                             'href="javascript:void(0)">',
                                 '<span style="font:12px/1.5 \'Microsoft YaHei\',Verdana,\'Simsun\';  display:inline-block;line-height:24px;padding:0 12px 0 0;overflow:visible;text-align:center;vertical-align:top;white-space:nowrap;">',
                                     '取 消',
                                 '</span>',
                             '</a>',
                         '</div>',
                     '</div>',
                 '</div>'].join("");

    window.RefusePopup = RefusePopup; //污染window
})(window.jQuery || top.jQuery)

﻿/**
 * 查看活动相关的通知邮件时需加载的JS
 * 活动包括: 邀请的活动, 自己创建的活动，共享的活动，订阅的活动
 * 订阅邮件的聚合邮件也在此JS中处理
 */
var inviteObj = (function () {
    var api = top.M139.RichMail.API;
    var calendarInfo = {
        calendarInitialMsg: $("#calendarInviteOp", document),  // 初始包含"接收","取消"按钮的容器
        calendarId: $("#calendarInviteOp", document).attr("calendarid"),  // 活动id
        operateNode: $("#calendarInviteOp>tbody", document).children(":last"), // 被操作的节点, 直属于tbody下面的最后一个tr元素
        template: { // 包含接受，拒绝，取消的模板
            accept: [
                '<tr>',
                    '<td>您已成功接受，<a style="color:#1a75ca; text-decoration:none;" href="javascript:;">去日历查看该活动</a></td>',
                    '<td style="text-align:right; line-height:24px;">',
                        '<a style="text-decoration:none; color:#799ecf;" href="javascript:;" onclick="top.$App && top.$App.show(' + "'calendar'" + ');top.BH(' + "'calendar_invite_view139_click'" + ');">来自139邮箱日历</a>',
                    '</td>',
                '</tr>'
            ].join(""),
            refuse: [
                '<tr>',
                    '<td>您已成功谢绝</td>',
                    '<td style="text-align:right; line-height:24px;">',
                        '<a style="text-decoration:none; color:#799ecf;" href="javascript:;" onclick="top.$App && top.$App.show(' + "'calendar'" + ');top.BH(' + "'calendar_invite_view139_click'" + ');">来自139邮箱日历</a>',
                    '</td>',
                '</tr>'
            ].join(""),
            cancel: [
                '<tr>',
                    '<td>此活动已被取消</td>',
                    '<td style="text-align:right; line-height:24px;">',
                        '<a style="text-decoration:none; color:#799ecf;" href="javascript:;" onclick="top.$App && top.$App.show(' + "'calendar'" + ');top.BH(' + "'calendar_invite_view139_click'" + ');">来自139邮箱日历</a>',
                    '</td>',
                '</tr>'
            ].join("")
        }
    };

    // 修正calendarid,如果calendarid不存在(div元素上没有calendarid属性),直接从超链接的href上获取
    try {
        if (!calendarInfo.calendarId) {
            var hrefEl = calendarInfo.calendarInitialMsg.find("a");
            if (hrefEl && hrefEl.length > 0) {
                var calendarId = Number(top.$Url.queryString("calendarId", hrefEl.get(0).href));
                if (calendarId) {
                    calendarInfo.calendarId = calendarId;
                }
            }
        }
    } catch (e) {

    }

    /**
     * 从超链接当中提取指定的字段信息
     * @param hrefEl 包含字段信息的超链接元素
     * @param key 指定的字段
     */
    function extractInfo(hrefEl, key) {
        var result;
        if (hrefEl && hrefEl.length) {
            result = top.$Url && top.$Url.queryString(key, hrefEl.get(0).href);
        }
        return result;
    }

    /**
     * 获取活动的初始状态
     * @param fnSuccess
     * @param fnError
     * @param calendarId 活动ID
     * @param type 活动类型
     */
    function getCalendar(fnSuccess, fnError, calendarId, type) {
        var param = {
            comeFrom: 0,
            seqNo: calendarId ? calendarId : calendarInfo.calendarId,// 从页面带过来的活动ID
            type: type || 1
        };

        if (api && typeof api.call === 'function') {
            api.call("calendar:getCalendar", param, fnSuccess, fnError);
        }
    }

    /**
     * 拒绝或接受邀请的活动
     * @param actionType // 0:接受； 1：拒绝
     * @param fnSuccess // 调用接口成功后所做的操作
     * @param fnError
     */
    function operateCalendar(params, fnSuccess, fnError) {
        var param = {
            comeFrom: 0,
            seqNos: calendarInfo.calendarId, // 从页面带过来的活动ID
            actionType: params.actionType,    //0:接受； 1：拒绝
            refuseResion: params.refuseResion || '',
            type: 'email'
        };

        if (api && typeof api.call === 'function') {
            api.call("calendar:updateInviteStatus", param, fnSuccess, fnError);
        }
    }

    /**
     * 替换节点之后, 需要重新获取操作节点
     * @returns {*}
     */
    function getOperateNode() {
        return calendarInfo.calendarInitialMsg.find("tbody tr:last");
    }

    /**
     * 获取当前邀请活动的状态,根据不同的状态显示不同的展示界面
     */
    function getCalendarStatus() {
        function accept() {
            // 替换成接收活动的模板
            calendarInfo.operateNode.replaceWith(calendarInfo.template.accept);

            // 替换节点之后, 重新通过getOperateNode方法获取操作节点
            getOperateNode().children(":first").find("a").unbind("click").click(function () {
                top.$App && top.$App.show("calendar_act_view", {
                    id: calendarInfo.calendarId,
                    type: 1
                });
                top.BH && top.BH("calendar_invite_viewcalendar_click"); //行为上报
                return false; // 阻止超链接跳转
            }).css({ cursor: "pointer" });
        }

        function refuse() {
            // 替换成拒绝活动的模板
            calendarInfo.operateNode.replaceWith(calendarInfo.template.refuse);
        }

        function cancel() {
            // 替换成取消活动的模板
            calendarInfo.operateNode.replaceWith(calendarInfo.template.cancel);
        }

        /**
         * 遍历inviteInfo数组,如果resultObj.operatorUin与数组元素对象的inviterUin相等
         * 则该元素的status即为要获取的值
         * @param resultObj
         */
        function getStatus(resultObj) {
            var operatorUin = resultObj.operatorUin,
                inviteInfoArr = [].slice.call(resultObj.inviteInfo),
                status; // 默认值直接从返回值获取
            for (var i = 0; i < inviteInfoArr.length; i++) {
                if (inviteInfoArr[i].inviterUin == operatorUin) {
                    status = inviteInfoArr[i].status;
                    break;
                }
            }

            return status;
        }

        getCalendar(function (res) {
            var response = res.responseData;
            if (!response.code) {
                return;
            }

            if (response.code == 'S_OK') {
                // 只处理返回正确报文的情况
                var status = getStatus(response["var"]);
                if (status == 0) { // 未处理状态
                    calendarInfo.calendarInitialMsg.show();
                } else if (status == 1) { //接收
                    accept();
                } else if (status == 2) { //拒绝
                    refuse();
                }
                return;
            }

            if (response.code == 'FS_UNKNOW') {
                // 活动已经被邀请者删除,则表示该活动已经取消, 这里如果返回错误的返回码，就认为该活动已经取消
                cancel();
            }
        }, function () {
            // call interface exception::
            calendarInfo.calendarInitialMsg.show(); // 调用接口发生异常时显示初始状态
        });
    }

    function initEvents() {
        calendarInfo.operateNode.children(":first").find("a:eq(0)").unbind().click(function () {// "接收"邀请活动时的操作
            // todo 是否需要做延迟处理,防止用户重复点击??
            operateCalendar({ actionType: 0 }, function (response) {
                if (response.responseData.code == "S_OK") {
                    getCalendarStatus();
                }
            }, function () {
                // Exception doNothing
            });
            return false;// 阻止超链接跳转
        });

        calendarInfo.operateNode.children(":first").find("a:eq(1)").unbind().click(function () { // "谢绝"邀请活动时的操作
            // todo 是否需要做延迟处理,防止用户重复点击??
            new RefusePopup({
                target: $(this),
                onSubmit: function (reason) {
                    operateCalendar({ actionType: 1, refuseResion: reason }, function (response) {
                        if (response.responseData.code == "S_OK") {
                            getCalendarStatus();
                        }
                    }, function () {
                        // Exception doNothing
                    });
                }
            });
            return false;// 阻止超链接跳转
        });

        // 点击""来自139邮箱日历"链接
        calendarInfo.operateNode.children(":last").find("a").unbind().click(function () { // "来自139邮箱日历"
            top.$App && top.$App.show('calendar');
            return false;
        });
    }

    /** ================针对查看活动模板(针对所有类型的活动) =============*/
    function initCalendarEvents(calendars) {
        $.each(calendars, function () {
            var children = $(this).find("tbody tr");

            if (children.length > 1) {
                // 查看该活动链接, 包括自己创建的活动, 共享的活动
                $(this).find("tbody tr:first").find("a").unbind().click(function () {
                    var calendarId = Number(top.$Url.queryString("calendarId", this.href)),
                        type = Number(top.$Url.queryString("type", this.href));
                    handlerCalendar(calendarId, type);
                    top.BH && top.BH("calendar_invite_viewcalendar_click"); //行为上报
                    return false;
                });

                // 到139邮箱查看的链接
                $(this).find("tbody tr:last").find("a").unbind().click(function () {
                    top.$App && top.$App.show("calendar");
                    top.BH && top.BH("calendar_invite_view139_click"); //行为上报
                    return false;
                });
                return;
            }

            if (children.length == 1) {
                // 给"查看该活动"链接添加处理事件, 专门针对"订阅邮件"的"聚合邮件"活动
                $(this).find("tbody tr:first").find("a").unbind().click(function () {
                    var calendarId = Number(top.$Url.queryString("calendarId", this.href)),
                        type = Number(top.$Url.queryString("type", this.href));
                    handlerCalendar(calendarId, type);
                    top.BH && top.BH("calendar_invite_viewcalendar_click"); //行为上报
                    return false;
                });
            }

        });

        function handlerCalendar(calendarId, type) {
            getCalendar(function (res) {
                var response = res.responseData;
                if (!response.code) {
                    return;
                }

                if (response.code == 'S_OK') {
                    var data = response['var'] || {};
                    var isOwner = data.isOwner || 0;
                    if (type == 0) {
                        // 0 : 自己创建的提醒活动
                        top.$App && top.$App.show("addcalendar", {
                            seqno: calendarId,
                            type: type
                        });
                    } else {
                        // 除自己设置的活动之外的所有活动
                        // 1: 邀请的活动  2: 共享的活动 3: 订阅的活动
                        top.$App && top.$App.show("calendar_act_view", {
                            id: calendarId,
                            isowner: isOwner,
                            type: type
                        });
                    }
                    return;
                }

                if (response.code == 'FS_UNKNOW') {
                    // 活动已经被邀请者删除,则表示该活动已经取消, 这里如果返回错误的返回码，就认为该活动已经取消
                    top.$App && top.$App.show("calendar");
                }
            }, function () {

            }, calendarId, type);
        }
    }

    function init() {
        var calendars = calendarInfo.calendarInitialMsg.parents("body").find("table #calendarInviteOp"),
            firstCalendar = calendars.get(0),// 先拿到第一个table元素, 可能有多个(比如说聚合邮件)
            aLink = $(firstCalendar).find("a"); // 查看table元素中的所有超链接元素

        // 如果超链接(aLink)数超过2(这里等于3), 则说明它是普通邀请活动的邮件模板
        if (aLink.length > 2) {
            // 普通的邀请活动的邮件
            initEvents();
            // 初始化时就需要调用一次接口
            getCalendarStatus();
            return;
        }

        // 如果超链接(aLink)数小于等于2, 则有两种情况
        // 1: 聚合邮件, aLink等于1,  只有查看活动的超链接
        // 2: 非聚合邮件, aLink等于2, 包含查看活动和查看139日历两个链接
        initCalendarEvents(calendars);
    }

    return {
        work: init
    };
})();

