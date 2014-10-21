/**
 * 右下角弹出calendarview
 * @example
 * M139.UI.TipCalendarView.show();
 */
M139.core.namespace("M139.UI.TipCalendarView", Backbone.View.extend({
    initialize: function (options) {

    }
}));

(function(jQuery,_,M139, M2012, CalendarReminder){
    jQuery.extend(M139.UI.TipCalendarView, {
        title:'日历消息',
        msgType:{   //0代表活动消息   1代表日历消息
            0:{
                type:0,
                topic:'活动主题',
                inviteOrShare:'活动邀请',
                timeOrDes: '活动时间',
                funcName: "updateInviteStatus"
            },
            1:{
                type:1,
                topic:'日历名称',
                inviteOrShare:'日历共享',
                timeOrDes: '日历说明',
                funcName: "processShareLabelInfo"
            }
        },
        messages: {
            "0": "已接受",
            "1": "已谢绝",
            onerror: "操作失败"
        },
        curCalendarMsgId: 0,    //pns推送当前日历消息的ID
        tipCalendarFile: false,     //是否加载了日历JS
        isSubmiting: false, //是否正在提交中。。
        curMsgObj: {},
        /**
         *开启日历提醒
         */


        receiveCalendar: function (msgObj) {
            var self = this;
            self.curMsgObj = msgObj;
            self.curCalendarMsgId = msgObj.id;
            var content = M139.UI.TipCalendarView.buildCalendarTipHtml(msgObj);
            $BTips.isCalendarTip = true;    //用作当邮件tips冲掉日历消息时判断上一个tips是否是日历
            //加入到队列中
            $BTips.addTask({
                title:this.title,
                content:content,
                timeout:20000
            });

            //刷新内容
            top.$App.trigger("calendar:refresh", {
                type: msgObj.type,
                whitelist: !!msgObj.isWhite
            });
        },

        buildCalendarTipHtml: function(msgObj){
            var curMsgType = msgObj.type;    //0代表活动消息，1代表日历消息
            var actOrCal = this.msgType[curMsgType];
            var msgParam = {
                        fromName: $T.Html.encode(msgObj.fromName),
                            type: actOrCal.inviteOrShare,
                            name: actOrCal.topic,
                    topicContent: $T.Html.encode(msgObj.title),
                       timeOrDes: actOrCal.timeOrDes,
                      isShowBtns: msgObj.isWhite?'none':'block' ,    //0不在白名单，1代表在白名单
                 dateDescription: curMsgType? $T.Html.encode(msgObj.content) : $T.Html.encode(msgObj.dateDescription),
                     //acceptClick: "M139.UI.TipCalendarView.acceptMsg(0)",
                    //confuseClick: "M139.UI.TipCalendarView.confuseMsg(1)"
                     acceptClick: "M139.UI.TipCalendarView.exec(0)",
                    confuseClick: "M139.UI.TipCalendarView.exec(1)"

            };
            return  top.$T.Utils.format(M139.UI.TipCalendarView._template, msgParam);
        },


        //#region 重写,收拢入口和出口,方便广播消息
        exec: function (status) {
            //status:0表示接受，1表示拒绝
            var _this = this;
            var type = _this.curMsgObj.type;

            if (_this.isSubmiting) {
                return;
            }          
            if (_this.tipCalendarFile) {
                _this.isSubmiting = true;
                var obj = _this.msgType[type];
                if (obj) {
                    _this.handler(obj.funcName, status);
                } else {
                    //类型错误，不处理
                    _this.isSubmiting = false;
                }
            } else {
                //第一次肯定是这里，需要加载接口处理的js
                _this.loadJsAsync(function () {
                    _this.exec(status); //回调自己
                });
            }
          
        },
        loadJsAsync: function (callback) {
            var _this = this;
            if (_.isUndefined(CalendarReminder) || _.isUndefined(CalendarReminder.Message.Mode)) {
                M139.core.utilCreateScriptTag({     //异步加载处理日历tip中接受和拒绝的message model
                    scriptId: "tip_calendar_msg",
                    src: "/m2012/js/packs/tip.calendar.msg.html.pack.js"
                }, function () {
                    _this.tipCalendarFile = M2012.CalendarReminder.Message.Mode;
                    callback && callback();
                });
            } else {
                callback && callback();
            }
        },
        handler:function(funcName,status){
            var _this = this;
            var msgs = _this.messages;
            var callAPI = _this.tipCalendarFile[funcName];
            callAPI({ seqNos: _this.curCalendarMsgId, actionType: status },
                function () {     //处理成功回调
                    $BTips.hide();
                    M139.UI.TipMessage.show(msgs[status], { delay: 3000 });

                    _this.isSubmiting = false;
                    _this.spreadMessage(status); //广播 接受/拒绝 成功的消息
                }, function () {   //处理失败回调
                    M139.UI.TipMessage.show(msgs.onerror, { delay: 3000, className: 'msgRed' });
                    _this.isSubmiting = false;
                });
        },
        spreadMessage: function (isReject) {
            //刷新内容
            var msgType = this.curMsgObj;
            top.$App.trigger("calendar:refresh", {
                type: msgType.type, //0,活动； 1,日历
                whitelist: !!msgType.isWhite,
                accept: isReject == 0 //是否接受 0是接受，1是拒绝
            });
        },
        //#endregion


        //#region 保留旧代码
        /*
        //点击 接受 按钮操作
        acceptMsg: function(acceptOrConfBtn){
            var self = this;
            var msgType = self.curMsgObj.type;
            if(self.tipCalendarFile){
                if(msgType == self.msgType[0].type){    //活动消息
                    self.acceptInviteStatus();
                }else if(msgType == self.msgType[1].type){  //日历消息
                    self.acceptShareStatus();
                }
                return;
            }
            self.isLoadCalendarMode(acceptOrConfBtn);
        },

        //点击 拒绝 按钮操作
        confuseMsg: function(acceptOrConfBtn){
            var self = this;
            var msgType = self.curMsgObj.type;
            if(self.tipCalendarFile){

                if(msgType == self.msgType[0].type){
                    self.confuseInviteStatus();         //调用活动邀请消息拒绝处理接口
                }else if(msgType == self.msgType[1].type){
                    self.confuseShareStatus();           //调用日历共享消息拒绝处理接口
                }
                return;
            }
            self.isLoadCalendarMode(acceptOrConfBtn);
        },

        //调用 活动邀请消息接受处理接口
        acceptInviteStatus: function(){
            var self = this;
                self.tipCalendarFile.updateInviteStatus({seqNos:self.curCalendarMsgId,actionType:0},
                    function(){     //处理成功回调
                        $BTips.hide();
                        M139.UI.TipMessage.show('已接受', {delay : 3000});
                    },function(){   //处理失败回调
                        M139.UI.TipMessage.show('操作失败', {delay : 3000, className:'msgRed'});
                });
        },

        //调用 活动邀请消息拒绝处理接口
        confuseInviteStatus: function(){
            var self = this;
            self.tipCalendarFile.updateInviteStatus({seqNos:self.curCalendarMsgId,actionType:1},
                function(){     //处理成功回调
                    $BTips.hide();
                    M139.UI.TipMessage.show('已谢绝', {delay : 3000});
                },function(){   //处理失败回调
                    M139.UI.TipMessage.show('操作失败', {delay : 3000, className:'msgRed'});
                });
        },

        //调用日历共享消息接受处理接口
        acceptShareStatus: function(){
            var self = this;
            self.tipCalendarFile.processShareLabelInfo({seqNos:self.curCalendarMsgId,actionType:0},
                function(){     //处理成功回调
                    $BTips.hide();
                    M139.UI.TipMessage.show('已接受', {delay : 3000});
                },function(){   //处理失败回调
                    M139.UI.TipMessage.show('操作失败', {delay : 3000, className:'msgRed'});
                });
        },

        //调用日历共享消息拒绝处理接口
        confuseShareStatus: function(){
            var self = this;
            self.tipCalendarFile.processShareLabelInfo({seqNos:self.curCalendarMsgId,actionType:1},
                function(){     //处理成功回调
                    $BTips.hide();
                    M139.UI.TipMessage.show('已谢绝', {delay : 3000});
                },function(){   //处理失败回调
                    M139.UI.TipMessage.show('操作失败', {delay : 3000, className:'msgRed'});
                });
        },

        initTipCalendMsg: function(acceptOrConfBtn){
            var self = this;
            var msgType = self.curMsgObj.type;
            if (!self.tipCalendarFile) {
                self.tipCalendarFile = M2012.CalendarReminder.Message.Mode;
            }
            if(acceptOrConfBtn == 0){                   //点击的接受按钮
                if(msgType == self.msgType[0].type){    //调用活动邀请消息接受处理接口
                    self.acceptInviteStatus();
                }else if(msgType == self.msgType[1].type){
                    self.acceptShareStatus();           //调用共享日历消息接受处理接口
                }
            }else if(acceptOrConfBtn == 1){              //点击的是拒绝按钮
                if(msgType == self.msgType[0].type){
                    self.confuseInviteStatus();         //调用活动邀请消息拒绝处理接口
                }else if(msgType == self.msgType[1].type){
                    self.confuseShareStatus();           //调用日历共享消息拒绝处理接口
                }
            }
        },

        isLoadCalendarMode: function(acceptOrConfBtn){
            var self = this;
            if (_.isUndefined(CalendarReminder)||_.isUndefined(CalendarReminder.Message.Mode)) {
                M139.core.utilCreateScriptTag({     //异步加载处理日历tip中接受和拒绝的message model
                    scriptId: "tip_calendar_msg",
                    src: "/m2012/js/packs/tip.calendar.msg.html.pack.js"
                }, function() {
                    self.initTipCalendMsg(acceptOrConfBtn);
                });
            } else {
                self.initTipCalendMsg(acceptOrConfBtn);
            }
        },
        //*/
        //#endregion

        _template:[ '<div class="imgInfo imgInfo-rb">',
                        '<p>{fromName}给您发来{type}</p>',
                        '<dl class="scheduleRightBottomTips">',
                           '<dd><span>{name}：</span>{topicContent}</dd>',
                            '<dd title="{dateDescription}"><span>{timeOrDes}：</span>{dateDescription}</dd>',
                        '</dl>',
                    '</div>',
                    '<div class="boxIframeBtn" style="display: {isShowBtns}">',
                        '<p class="imgInfo-rb-page" style="float:left; display: none;">',
                            '<a href="javascript:;" class="pre"></a>',
                            '<span>1/5</span>',
                            '<a href="javascript:;" class="next"></a>',
                        '</p>',
                        '<span class="bibText gray"></span>',
                        '<span class="bibBtn">',
                            '<a href="javascript:{acceptClick};" class="btnSure" id="accept"><span>接 受</span></a>',
                            '<a href="javascript:{confuseClick};" class="btnNormal" style="margin-left: 5px;"><span>拒 绝</span></a>',
//                            '<a href="javascript:;" class="ml_10">查看详情</a>',
                        '</span>',
                    '</div>'].join("")
    });

})(jQuery, _, M139, M2012,  M2012.CalendarReminder);