/**
 * @Author: zhangjia
 * @Date:   2014-09-18 17:22
 * @Last Modified by:   anchen
 * @Last Modified time: 2014-10-21 16:30:40
 */
;(function(jQuery, _, M139){
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    /**
     * 邀请会议
     */
    M139.namespace('M2012.activityInvite.View',superClass.extend(
        /**
         *@lends M2012.activityInvite.View.prototype
         */
        {
            name: 'M2012.activityInvite.View',
            el:"body",
            events: {
                "click #inviteMore" : 'showAddressBookDialog',
                "click #cancelInviteBtn": "cancelInvite"//底部取消会议邀请
            },
            initialize: function(options) {
                this.model = options.model;
                this.maxSenders = top.$User.getMaxSend();
                this.render();
                this.initializeDate();
                this.createEmailInput(); //创建邮件地址富文本框
                this.initEvents();
                this.currentRichInput = null;
                return superClass.prototype.initialize.apply(this, arguments);
            },

            initEvents: function() {
                var self = this;
                self.registerMouseEvent();
                self.regCloseTabEvent();
                self.createCalander();
                self.createTimer();
                self.isEndTimeChecked();
                self.isAddToCalendarChecked();
                self.isChinaMobileUserCheck();
                self.isSMSRemindChecked();
                self.handleMSPlaceholder();

                // 监控数据校验结果并实时呈现错误信息
                self.model.on(self.model.EVENTS.VALIDATE_FAILED, function (args) {
                    if (!args || !args.target || !args.message)
                        return;
                    var targetEl = null;

                    switch (args.target) {
                        //验证主题
                        case "title": targetEl = $("#activityTitle");
                            break;
                        //验证备注
                        case "dtStart": targetEl = $("#startTxtCalendar");
                            break;
                        case "dtEnd": targetEl = $("#endTxtCalendar");
                            break;

                    }

                    if (targetEl && targetEl.length > 0) {

                        targetEl.focus();
                        window.setTimeout(function(){
                            M2012.Calendar.View.ValidateTip.Bottom.show(args.message, targetEl);
                        },100);
                    }

                });
            },
            // 注册隐藏右侧通讯录面板鼠标事件
            registerMouseEvent : function(){
                $("#switchSider").toggle(function(event){

                    $(this).attr('title', '显示右边栏');
                    $("#writeWrap").addClass("writeMainOff");
                },function(event){
                    $(this).attr('title', '隐藏右边栏');
                    $("#writeWrap").removeClass("writeMainOff");
                });
            },
            // 初始化定时时间 todo 重复操作
            initializeDate : function(date){
                var self = this;
                // 初始化时间
                var now = date || self.getDefaultDate();
                var date = $Date.format("yyyy年MM月dd日 周w", now);
                var time = self.getFullTime(now.getHours())+ ':' + self.getFullTime(now.getMinutes());
                $("#startTxtCalendar > div:eq(0)").html(date);
                $("#startDateFormat").html($Date.format("yyyy-MM-dd", now));
                $("#endTxtCalendar > div:eq(0)").html(date);
                $("#startHourText").html(self.getFullTime(now.getHours()));
                $("#endHourText").html(self.getFullTime(now.getHours()));
                $("#startMiniuteText").html(self.getFullTime(now.getMinutes()));
                $("#endMiniuteText").html(self.getFullTime(now.getMinutes()));
                $("#endDateFormat").html($Date.format("yyyy-MM-dd", now));


            },
            getDefaultDate: function (){
                var now = new Date();
                var now = new Date();
                return new Date(now.getTime() + 30 * 60 * 1000);
            },

            getFullTime:function (time){
                return time >= 10?time:('0'+time);
            },
            // 创建定时器组件 todo 重复操作
            createCalander : function(){
                var self = this;
                var startCalendarPicker = this.calendarPicker = M2012.UI.Picker.Calendar.create({
                    bindInput: $("#startTxtCalendar")[0],
                    value: new Date(),
                    stopPassDate: true
                });
                var startText = $("#startTxtCalendar > div:eq(0)");
                startCalendarPicker.on("select", function (e) {
                    BH({key:"compose_activity_datetime"});
                    var calendar = e.value.format("yyyy年MM月dd日 周w");
                    startText.html(calendar);
                    $("#startDateFormat").html(e.value.format("yyyy-MM-dd"));
                    self.model.set({dtStart:self.getStartDateTime()});

                });
                var endCalendarPicker = this.calendarPicker = M2012.UI.Picker.Calendar.create({
                    bindInput: $("#endTxtCalendar")[0],
                    value: new Date(),
                    stopPassDate: true
                });
                var endText = $("#endTxtCalendar > div:eq(0)");
                endCalendarPicker.on("select", function (e) {
                    BH({key:"compose_activity_datetime"});
                    var calendar = e.value.format("yyyy年MM月dd日 周w");
                    endText.html(calendar);
                    $("#endDateFormat").html(e.value.format("yyyy-MM-dd"));
                    self.model.set({dtEnd:self.getEndDateTime()});
                    //console.log('change_date:'+self.model.get("dtEnd"));
                });

            },
            // 创建时间组件(开始时间和结束时间) todo DOM重复操作
            createTimer : function(){
                var self = this;
                var startHourItems = self._getMenuItems(0, 23, 'startHourText');
                var startHourMenu = M2012.UI.PopMenu.createWhenClick({
                    target : $('#startHourMenu')[0],
                    width : 70,
                    maxHeight : 170,
                    items : startHourItems,
                    top : "200px",
                    left : "200px",
                    onItemClick : function(item){
                        BH({key:"compose_activity_datetime"});
                        self.model.set({dtStart:self.getStartDateTime()});

                    }
                });
                var startMiniuteItems = self._getMenuItems(0, 59, 'startMiniuteText');
                M2012.UI.PopMenu.createWhenClick({
                    target : $("#startMiniuteMenu")[0],
                    width : 70,
                    maxHeight : 170,
                    items : startMiniuteItems,
                    top : "200px",
                    left : "200px",
                    onItemClick : function(item){
                        BH({key:"compose_activity_datetime"});
                        self.model.set({dtStart:self.getStartDateTime()});

                    }
                });
                //结束时间
                var endHourItems = self._getMenuItems(0, 23, 'endHourText');
                var endHourMenu = M2012.UI.PopMenu.createWhenClick({
                    target : $('#endHourMenu')[0],
                    width : 70,
                    maxHeight : 170,
                    items : endHourItems,
                    top : "200px",
                    left : "200px",
                    onItemClick : function(item){
                        BH({key:"compose_activity_datetime"});
                        self.model.set({dtEnd:self.getEndDateTime()});
                        //console.log('change_hour:'+self.model.get("dtEnd"));

                    }
                });
                var endMiniuteItems = self._getMenuItems(0, 59, 'endMiniuteText');
                M2012.UI.PopMenu.createWhenClick({
                    target : $("#endMiniuteMenu")[0],
                    width : 70,
                    maxHeight : 170,
                    items : endMiniuteItems,
                    top : "200px",
                    left : "200px",
                    onItemClick : function(item){
                        BH({key:"compose_activity_datetime"});
                        self.model.set({dtEnd:self.getEndDateTime()});
                        
                    }
                });
            },
            //结束时间标签事件处理
            isEndTimeChecked: function() {
                var el = $("#endTimeCheck"),self = this;
                el.change(function(){
                    if ( el.is(':checked') ){
                        $(".endTimeDiv").show();
                        self.model.set({
                            useEndTime:!self.model.get('useEndTime')
                        });
                        self.model.set({
                            dtEnd:self.getEndDateTime()
                        });
                        //console.log(self.model.get("dtEnd"));

                    } else {
                        $(".endTimeDiv").hide();
                        self.model.set({useEndTime:false});
                        self.model.set({
                            dtEnd:''
                        });
                    }
                });
            },
            //是否选择添加到自己的日历
            isAddToCalendarChecked: function() {
                var el = $("#addToCalendar"),self = this;
                el.change(function(){
                    if ( el.is(':checked') ){
                        self.model.set({
                            isAddToCalendar:true
                        });
                    } else {
                        self.model.set({isAddToCalendar:false});
                    }
                });
            },
            //得到会议开始的时间
            getStartDateTime : function() {
                var self = this;
                var date = $("#startDateFormat").html();
                var time = $("#startHourText").html()+ ':' + $("#startMiniuteText").html();
                return (date + ' '+time+':00');
            },
            //得到会议结束的时间
            getEndDateTime : function() {
                var self = this;
                var date = $("#endDateFormat").html();
                var time = $("#endHourText").html()+ ':' + $("#endMiniuteText").html();
                return (date + ' '+time+':00');
            },
            //是否短信通知
            isSMSRemindChecked: function() {
                var self = this, el = $("#isSMSRemind");
                el.change(function(){
                    if ( el.is(':checked') ){
                        var textTip = '请您在'+self.model.get("dtStart")+'参加会议：'+self.model.get('title');
                        el.next().next().removeAttr("disabled").val(textTip);
                        self.model.set({remindBySms:1});
                    } else {
                        el.next().next().val("").attr("disabled","disabled");
                        self.model.set({remindBySms:0});
                    }
                })
            },
            //是否内部用户
            isChinaMobileUserCheck: function() {
                var self = this;
                if (!top.$User.isChinaMobileUser()){
                    $("#isSMSRemind").attr("disabled","disabled");
                }
            },
            initPageEvents: function() {
                var self = this;
                //主题、地点、内容变化实时同步到model
                $.each([$("#activityTitle"), $("#activityAddr"), $("#activityContent")], function () {
                    var el = this;
                    //控件值发生变化后传递到后端
                    el.change(function () {
                        var data = {};
                        var key = this.name;

                        data[key] = $.trim(this.value);
                        //console.log(data);
                        self.model.set(data, {
                            validate: false,
                            target: key
                        });
                    });

                    //增加实时检测字数功能
                    self.checkInputWords(el, Number(el.attr("maxlength") - 3));
                });
                //初始化开始时间和结束时间
                var now = self.getDefaultDate();
                var date = $Date.format("yyyy-MM-dd", now);
                var time = self.getFullTime(now.getHours())+ ':' + self.getFullTime(now.getMinutes());
                self.model.set({dtStart:date+' '+time+":00"});
                self.model.set({dtEnd:date+' '+time+":00"});
                //保存
                $("#sendInviteBtn").click(function () {
                    BH({key:"compose_activity_send"});
                    self.model.set({isFromSendBtn:true});
                    self.save(true);
                });
            },
            //渲染视图
            render: function() {
                var self = this;
                //初始化右侧联系人
                new M2012.UI.Widget.Contacts.View({
                    container: document.getElementById("divAddressList"),
                    filter: "email",
                    width: "auto"
                }).on("select",function(e){
                        var addr = e.isGroup ? e.value.join(";") : e.value;
                        self.addMailToRichIput(addr).focus();
                        var data = null;
                        if (e && e.value) {
                            data = e.value;
                        }
                        self.model.set({ inviteInfo: data }, {
                            silent: true
                        });
                    });

                self.initPageEvents();
            },


            /**
             * 获得时/分菜单项
             */
            _getMenuItems : function(begin, end, id){
                var self = this;
                var items = [];
                for(var i = begin;i <= end;i++){
                    var text = '';
                    if(i < 10){
                        text = '0' + i;
                    }else{
                        text = i + '';
                    }
                    var item = {
                        text : text,
                        onClick : function() {
                            $("#"+id).html(this.text);
                            self.targetText = this.text;
                            // todo 第二个popMenu从dom移除后，会将第一个popMenu的bindautohide属性置为'0'，导致第一个popMenu不响应全局单击事件
                            // $("div.sTipsSetTime").attr('bindautohide', '1');
                        }
                    }
                    items.push(item);
                }
                return items;
            },

            //创建邮件地址输入框
            createEmailInput: function() {
                var self = this;
                self.toRichInput = M2012.UI.RichInput.create({
                    container:document.getElementById("emailAddrInput"),
                    maxSend : self.maxSenders,
                    type:"email",
                    tipPlace: "bottom"
                }).render();
                self.toRichInput.setTipText('联系人');
                self.toRichInput.on("focus",function(){
                    self.currentRichInput = this;
                });
                self.toRichInput.on("itemchange",function(){
                    if(self.toRichInput.hasItem()) {
                        self.model.set({hasEmailItems:true});
                    } else {
                        self.model.set({hasEmailItems:false});
                    }
                });
            },

            //添加邮箱至成员输入框
            addMailToRichIput: function(addr) {
                if (!this.currentRichInput){
                    this.currentRichInput = this.toRichInput;
                }
                this.currentRichInput.insertItem(addr);
                return this.currentRichInput;
            },

            // 验证收件人（会议成员）
            checkInputAddr : function() {
                var self = this,
                    isContinue = true;
                if (!self.toRichInput.hasItem()) {
                    window.scrollTo(0,0);
                    // 弹出框提示
                    self.toRichInput.showEmptyTips(self.model.TIPS.RECIVER_NOT);
                    self.toRichInput.focus();
                    isContinue = false;
                }
                var richInput = null;
                if (self.toRichInput.getErrorText()) {
                    richInput = self.toRichInput;
                }

                if(richInput){
                    richInput.showErrorTips(self.model.TIPS.RECEIVER_ERROR);
                    self.toRichInput.focus();
                    isContinue = false;
                }
                return isContinue;
            },

            //联系人选择（弹框）
            showAddressBookDialog : function(event){
                var self = this;
                var target = event.target;
                //self._setCurrentRichInput(target);
                var view = top.M2012.UI.Dialog.AddressBook.create({
                    filter:"email",
                    items:'just test',
                    comefrom:"activity_invite"
                });
                view.on("select",function(e){
                    self.addMailToRichIput(e.value.join(";")).focus();
                });
                view.on("cancel",function(){
                    //alert("取消了");
                });
            },

            //截取value字符串前len个字节，一个汉字为2字节
            getCutCode: function(value, len) {
                var count = 0;
                for (var i = 0; i<value.length; i++) {
                    var codeByte = (value.charAt(i).charCodeAt(0)>255)?2:1;
                    count = count + codeByte;
                    if (count >= len) {
                        return value.slice(0, i+1) ;
                        break;
                    }
                }
            },
            /** 实时监控输入框数据
             * @param {jQuery Object}  inputEl     //输入框元素
             * @param {Number}         maxLength   //允许输入字符的最大长度
             **/
            checkInputWords: function (inputEl, maxLength) {
                var self = this;
                inputEl.unbind("keyup parse").bind("keyup parse", function (e) {
                    var value = $.trim(inputEl.val());
                    if ($TextUtils.getBytes(value) > maxLength) {

                        inputEl.val(self.getCutCode(value,maxLength));

                        var key = inputEl.attr("id");

                        //更新数据到model
                        var data = {};
                        data[key] = $.trim(inputEl.val());
                        self.model.set(data, {
                            silent: true,
                            validate: false
                        });
                    }
                });
            },
            //对邀请的成员信息过滤
            getValidateReiciver: function(inviteArr){
                var self = this;
                var arr = [];
                for (var i = 0;i<inviteArr.length;i++){
                    arr.push({
                        inviteAuth: 2,
                        inviterUin : inviteArr[i].addr,
                        recMobile : inviteArr[i].addr,
                        recEmail : inviteArr[i].addr,
                        smsNotify : 0,
                        emailNotify : 1
                    });
                }

                return arr;
            },

            //修复IE下的placeholder问题
            handleMSPlaceholder: function(){
                var self = this;
                if(!self.placeholderSupport()){   // 判断浏览器是否支持 placeholder
                    $('[placeholder]').focus(function() {
                        var input = $(this);
                        if (input.val() == input.attr('placeholder')) {
                            input.val('');
                            input.css('color','#000');
                        }
                    }).blur(function() {
                        var input = $(this);
                        if (input.val() == '' || input.val() == input.attr('placeholder')) {
                            input.css('color','#999');
                            input.val(input.attr('placeholder'));
                        }
                    }).blur();
                }
            },

            placeholderSupport:function () {
                return 'placeholder' in document.createElement('input');
            },
            //取消会议邀请
            cancelInvite : function(){
                var self = this;
                var isEdited = self.model.compare();
                if (!isEdited || window.confirm(self.model.TIPS['CANCEL_INVITE'])) {
                    BH({key:"compose_activity_cancel"});
                    top.$App.close();
                }

            },

            // 注册关闭会议邀请标签页事件
            regCloseTabEvent : function(){
                var self = this;
                top.$App.on("closeTab", self.closeActivityTabCallback);
            },

            // 关闭会议邀请标签页回调
            closeActivityTabCallback : function(args){
                var self = this;
                if(!top || !top.$App){
                    return;
                }

                if (top.$App.getCurrentTab().name.indexOf('activityInvite') != -1) {
                    aiView.model.active();
                }

                if(args.name && args.name === aiView.model.tabName){
                    var isEdited = aiView.model.compare();
                    if(isEdited){
                        if(window.confirm(aiView.model.TIPS['CANCEL_INVITE'])){
                            BH({key:"compose_activity_cancel"});
                            top.M139.UI.TipMessage.hide();
                            args.cancel = false;
                            top.$App.off("closeTab", aiView.closeTabCallback);
                        }else{
                            args.cancel = true;
                        }
                    }else{
                        top.M139.UI.TipMessage.hide();
                        args.cancel = false;
                        top.$App.off("closeTab", aiView.closeTabCallback);
                    }
                }
            },
            /**
             *  提交数据
             **/
            save: function (validate) {
                var self = this;

                if(window.isAttachUploading()) {
                    top.$Msg.alert("附件上传尚未完成，请稍后发送！");
                    return;
                }

                if (!self.model.isValid()) {
                    return;
                }

                if(!self.checkInputAddr()){
                    //console.log('收件人验证未通过！');
                    return;
                } else {
                    self.model.set({to:self.currentRichInput.getValidationItems().join(',')})
                    self.model.set({inviteInfo:self.getValidateReiciver(self.currentRichInput.getItems())})
                }


                if (window.filesToSend.length == 0) {
                    //新增会议邀请
                    self.saveData(validate);
                } else {
                    getSendLink(function (fileLink) {   //获取超大附件链接后再发送
                        self.model.set("fileLink", fileLink);
                        //console.log(fileLink);
                        self.saveData(validate);
                    });
                }
            },

            /**
             * 保存数据到服务端
             * @param {Boolean}  validate     //是否验证输入数据
             **/
            saveData: function (validate) {
                var self = this;
                var mask = $("#maskDiv");
                //遮挡住操作按钮
                mask.removeClass("hide");

                self.model.saveToServer(function () {
                    top.M139.UI.TipMessage.show(self.model.TIPS.OPERATE_SUCCESS, {
                        delay: 3000
                    });
                    mask.addClass("hide");
                    top.M139.UI.TipMessage.show("会议邀请已发送", {
                        delay: 3000
                    });
                    top.$App.close();

                }, function (msg, result) {
                    msg = msg || self.model.TIPS.OPERATE_ERROR;
                    top.M139.UI.TipMessage.show(msg, {
                        delay: 3000,
                        className: "msgRed"
                    });
                    mask.addClass("hide");
                }, function () {
                    mask.addClass("hide");
                }, validate);
            }

        })
    );

})(jQuery, _, M139);