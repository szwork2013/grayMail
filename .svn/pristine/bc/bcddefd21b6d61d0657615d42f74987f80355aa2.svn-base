/**
* @fileOverview 任务邮件提醒视图/单例
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    
    /**
    * @namespace 
    * 邮件列表页、读信页任务邮件提醒
    */   
         
    M139.namespace('M2012.Remind.View', superClass.extend({

        /**
        *@lends M2012.Remind.View.prototype
        */

    el:"",
    
    template:{

        dropMenuNew: [  '<div id="remindDropMenu" class="gtasks-new-box tips tipsNoshadow" style="width:318px;position:absolute;z-index:9999">',
                            '<div class="tipsRight  diamond" style="right:-11px"></div>',
                            '<div class="gtasks-boxiframebox">',
                                '<div class="gtasks-boxIframebox-minwarp">',
                                    '<h3 class="grasks-boxIframebox-title" id="remind_time"><strong>处理此任务</strong></h3>',                       
                                    '<p class="grasks-boxIframebox-title-min" id="remind_sms" style="display:none"><strong>短信提醒时间：</strong><span name="smsremindtime"></span></p>',                                    
                                    '<p class="grasks-boxIframebox-title-min" id="remind_content" style="display:none"><strong>短信提醒内容：</strong><span name="smscontent"></span></p>',
                                '</div>',
                                '<div class="grasks-boxIframebox-btnwarp"><a class="btn" href="javascript:" name="finish">标记完成</a></div>',
                            '</div>',
                            '<div class="boxIframeBtn">',
                                '<span class="bibText"></span>',
                                '<span class="bibBtn">',
                                    '<a class="btnNormal" href="javascript:void(0)" name="edit"><span>修改</span></a>&nbsp;',
                                    '<a class="btnNormal" href="javascript:void(0)" name="cancel"><span>取消任务</span></a>',
                                '</span>',
                            '</div>',
                        '</div>'].join(""),
        item:['<li>',
                '<a href="javascript:;" id="{id}" title="{text}">',
                    '<span class="text">{text}</span>',
                '</a>',
             '</li>'].join(''),

        /** 下拉菜单 */
        menuList:{
            'add':['addtask','addremind'],
            'update':['finish','addremind','canceltask'], //添加
            'hasremind':['finish','updateremind','cancelremind','canceltask'], //修改
            'finish':['addtaskagain','addremindagain','canceltask'] //完成
        },
        
        /** 下拉菜单 联通、电信和无手机号码用户 */
        otherMenuList:{
            'add':['addtask'],
            'update':['finish','canceltask'], 
            'hasremind':['finish','canceltask'], //修改
            'finish':['addtaskagain','canceltask'] 
        },

        popTips:['<span id="taskPopTips" class="msg msgYellow" style="{1}">处理时间：<span class="c_ff6600">{0}</span></span>'].join(''),
        tips:{
            'addtasksucc': '添加待办任务成功',
            'addremindsucc':'添加待办任务成功',
            'updateremindsucc':'待办任务修改成功',
            'markfinishsucc':'待办任务标记完成',
            'canceltasksucc': '待办任务取消成功',
            'cancelremindsucc':'待办任务取消成功',
            'fail': '待办任务标记失败，请重试',
            'evocationSuccess':'添加待办任务成功'
        }
    },
    
    initialize: function(options){
        var self = this;
        this.model = new M2012.Remind.Model();
        this.initData = options;
        this.initEvent();
        $App.on('evocationRemind', function (option) {
            self.remindContent = option.content || '请输入提醒内容';
            self.popType = option.type;
            self.showEditor(option);
        })
        return superClass.prototype.initialize.apply(this, arguments);
    },
    
    showTips:function(msgKey,options){
        var msg = this.template.tips[msgKey];
        var defaults = {
            prior:true,
            delay:3000
        };
        options = $.extend(defaults,options);
        M139.UI.TipMessage.show(msg,options);
    },

    showFailTips:function(){
        var self = this;
        M139.UI.TipMessage.show(self.template.tips.fail,{
            colour:'msgRed',
            delay:3000
        });
    },
    
    refreshTaskCount: function(todoCount,totalCount){
        var folder = appView.getView('folder');
        folder.refreshTaskCount(todoCount,totalCount);
    },
    
    /** 显示编辑框 */
    showEditor:function(options){
        var self = this;
        if(!this.dialog){
            this.dialog =  $Msg.open({
                url:'/m2012/html/mailremind.html?sid=' + top.sid,
                dialogTitle:options.title,
                width:486,
                height: $B.is.ie && $B.getVersion() < 8 ? 166 : 163,
                onclose:function(){
                    self.dialog = null;
                }
            });
        }
        options.callback && options.callback();
    },
    
    changeTaskIcon:function(status,taskDate){
        if ($App.getCurrentTab().name.indexOf('readmail_')>-1) {
            var _el = $('#'+$App.getCurrentTab().name).find('a[name=mailtask]');
            var span = _el;
        } else {
            var _el = this.el.find('a[name=mailtask]');
            var span = _el.find('span');
        }
        
        var curStatus = span.attr('status');
        var css = {
            'add' : 'i_tx_n',
            'update' : 'i_tx_nb', 
            'finish' : 'i_tx_ng'
        };
        var iClassMap = { //样式
            'add':'i_cDo',
            'update':'i_cDon',
            'finish':'i_cDoy'
        };
        if ($App.getCurrentTab().name.indexOf('readmail_') == -1) {
            _el.removeClass(css[curStatus]).addClass(css[status]);
        } else {
            //var itag = _el.find('i'); //读信页已去掉i标签
            _el.removeClass(iClassMap[curStatus]).addClass(iClassMap[status]);
        }
        span.attr('status',status).attr('taskdate',taskDate);
    },
    
    /** 添加任务 */
    addTask:function(callback){
        var self = this;
        self.model.setTask({
            requestData : {
                value: 1
            },
            success : function(){
                self.changeTaskIcon('update',self.model.get('taskDate'));
                callback && callback();
                $App.trigger("showMailbox", { comefrom: "commandCallback" });
                $App.trigger("refreshSplitView");//刷新分栏
                $App.clearTabCache("readmail_" + self.model.get('mid'));
            },
            error : function(){
                self.showFailTips();
            }
        });
    },

    /** 取消任务 */
    cancelTask:function(callback){
        var self = this;
        var taskDate = self.model.get('taskDate');
        //if(taskDate && taskDate > 0){
            this.model.deleteRemind({ //同时删除日程提醒
                success : function(){
                    setTask();
                },
                error : function(){
                    self.showFailTips();
                }
            });
        //}else{
            //setTask();
        //}
        
        function setTask(){
            self.model.setTask({
                requestData : {
                    value: 0, 
                    time: 0
                },
                success : function(){
                    self.model.set({'taskDate':0});
                    self.changeTaskIcon('add',0);
                    callback && callback();
                    $App.trigger("showMailbox", { comefrom: "commandCallback" });
                    $App.trigger("refreshSplitView");//刷新分栏
                    $App.clearTabCache("readmail_" + self.model.get('mid'));
                },
                error : function(){
                    self.showFailTips();
                }
            });
        }
    },
    
    /** 添加提醒 */
    addRemind:function(){
        var self = this;
        this.model.set("recMySms",0);
        this.model.set("recMyCanl",0);
        self.showEditor({title:'待办任务'});
    },

    /** 修改提醒 */
    updateRemind:function(){
        var self = this;
        self.model.getRemind({
            requestData : {},
            success: function (data) {
                var recMySms = data.isSaveSms || 0;
                var recMyCanl = data.isSaveCalendar || 0;
                self.model.set("recMySms",recMySms);
                self.model.set("recMyCanl",recMyCanl);
                self.remindContent = data.smsContent;
                self.showEditor({title:'修改任务'});
            },
            error : function(){
                self.showFailTips();
            }
        });
    },

    /** 取消提醒 */
    cancelRemind:function(){
        var self = this;
        this.model.deleteRemind({
            success : function(){
                self.model.setTask({
                    requestData : {
                        value: 1, 
                        time: 0
                    },
                    success : function(){
                        self.model.set({taskDate:0});
                        self.changeTaskIcon('update',0);
                        top.BH('cancel_remindtaskmail_ok');
                        self.showTips('cancelremindsucc');
                        $App.trigger("refreshSplitView");//刷新分栏
                        $App.clearTabCache("readmail_" + self.model.get('mid'));
                    },
                    error : function(){
                        self.showFailTips();
                    }
                });
            },
            error : function(){
                self.showFailTips();
            }
        });
    },
    
    /** 标记已完成 */
    markFinish:function(){
        var self = this;
        var taskDate = self.model.get('taskDate');
        if(taskDate > 0){
            var data=this.model.get("calendarData");
            data.title=data.content;
            data.enable=0;
            this.model.editRemind({"requestData":data});
            
            self.model.deleteRemind({ //同时删除日程提醒
                success : function(){
                    setTask();
                },
                error : function(){
                    self.showFailTips();
                }
            });
        }else{
            setTask();
        }
        function setTask(){
            self.model.setTask({
                requestData : {
                    value: 2, 
                    time: 0
                },
                success : function(){
                    self.model.set({taskDate:0});
                    self.changeTaskIcon('finish',0);
                    top.BH('markfinish_ok');
                    $App.trigger("showMailbox", { comefrom: "commandCallback" });
                    $App.trigger("refreshSplitView");//刷新分栏
                    $App.clearTabCache("readmail_" + self.model.get('mid'));
                    self.refreshTaskCount(-1,0);
                    self.showTips('markfinishsucc');
                    // 触发会话邮件待办图标及DOM属性（status/taskDate/class）更新
                    $App.trigger('covMailRemindRender', {taskFlag: 2, taskDate: 0, mid: self.model.get('mid')})
                },
                error : function(){
                    self.showFailTips();
                }
            });
        }
    },
    
    /** 下拉菜单 */
    showDropMenu: function () {

        var self = this,
            $el = this.el,
            temp = this.template.dropMenuNew,
            itemTemp = this.template.item,
            status = this.model.get('status'),
            itemsHtml = [],
            html = temp;
  
        if (status == "add") {
            // 因为所有实例共用一个model所以先清除
            this.model.set('smsTime', null);
            this.doCommand("add");
            return; 
        }


        if($('#remindDropMenu').length==0){
            $('body').append(html);
        }

        if (status == "finish") {
  
            $("#remind_time").html("已处理此任务");
            $("#remindDropMenu [name=finish]").remove();
            $("#remindDropMenu [name=sp_line]").remove();
            $("#remindDropMenu [name=edit]").remove();

            self.setDropMenuPosition();
            self.itemEvent();
            return;
                
        }
        this.model.getRemind({
            requestData: {},
            success: function (data) {

                self.model.set("calendarData",data);

                // 因为所有实例共用一个model所以先清除
                self.model.set('smsTime', null);

                if (data) {

                    //补零
                    // var timeSpan = data.startTime;
                    // if (data.startTime.length == 1) { timeSpan = "000" + data.startTime; }
                    // if (data.startTime.length == 2) { timeSpan = "00" + data.startTime; }
                    // if(data.startTime.length==3){timeSpan="0"+data.startTime;}
                    // timeSpan=timeSpan.substr(0,2)+":"+timeSpan.substr(2);

                    var remindDate = data.dateFlag;
                    if (!remindDate) {
                        remindDate = self.model.get('taskDate');
                        remindDate = remindDate ? new Date(remindDate * 1000).format("yyyy-MM-dd") : '';
                    }
                    $("#remind_time").html((remindDate ? remindDate : '') + "&nbsp;处理此任务");

                    // 设置model中taskDate
                    // 不再从日历接口获取taskDate，直接从邮件列表取（没有勾选日历接口不会反悔dateFlag）
                    /*if (data.dateFlag) {
                        var dealTime = new Date(data.dateFlag+" "+timeSpan+":00");
                        self.model.set("taskDate",Math.round(dealTime.getTime()/1000));
                    }*/

                    // 处理短信提示内容
                    if (data.smsSendTime) {
                        var enableSms=data.isSaveSms;
                        self.model.set('smsTime', data.smsSendTime);
                        $("#remind_sms [name=smsremindtime]").text(data.smsSendTime)
                        $("#remind_sms").css("display", enableSms ? "block" : "none");
                        $("#remind_content").css("display", enableSms ? "block" : "none");                    
                        $("#remind_content [name=smscontent]").html(M139.Text.Html.encode(data.smsContent));
                    }                    
                }

                self.setDropMenuPosition();
                self.itemEvent();
            },
            error: function () {
                self.showFailTips();
            }
        });
    },
    
    setDropMenuPosition: function(){
        var offset = this.getIcoOffset();
        var top = offset.top - 10;
        var left = offset.left - 342;
        
        var remindDropMenuEl = $('#remindDropMenu');
        var menuHeight = remindDropMenuEl.height();
        var bodyHeight = $('body').height();
        
        if((top + menuHeight) > bodyHeight){
            top = top - menuHeight + 25;
            remindDropMenuEl.find('.diamond').css('top', menuHeight - 18);
        }

        remindDropMenuEl.css({top:top,left:left}).show();
    },
    
    /** 关闭菜单 */
    closeDropMenu:function(){
        $('#remindDropMenu').remove();
    },
    
    dropMenuEvent:function(){
        var self = this;
        var $el = this.el;
        
        $('#remindDropMenu').hover(function(){
            if(self.timer) clearTimeout(self.timer);
        },function(){
            self.timer = setTimeout(function(){
                self.closeDropMenu();
            },1000);
        });
        
        $D.bindAutoHide({
            action: "click",
            element: $('#remindDropMenu')[0],
            stopEvent: true,
            callback: function () {
               $(this.element).remove();
            }
        });        
    },

    doCommand:function(name){
        var self=this;
        switch (name) {
            case "add":
                this.addRemind(function(){
                    top.BH('add_taskmail_ok'); //快捷添加待办任务成功 
                    self.refreshTaskCount(1,1);
                    self.showTips('addtasksucc');
                }); //点亮图标，下拉 添加提醒
                break;
            case "edit":
                this.updateRemind();
                if (top.$App.isReadSessionMail()) {
                    top.BH('cMail_tab_changeTask');
                } else {
                    top.BH('task_edit');  
                }
                break;
            case "cancel":
                if (top.$App.isReadSessionMail()) {
                    top.BH('cMail_tab_cancelTask');
                }
                this.cancelTask(function(){
                    self.showTips('canceltasksucc');
                   
                    var status = self.model.get('status');
                    if(status == 'finish'){
                        top.BH('task_cancel_complete'); //对已完成邮件取消任务邮件 取消待办任务
                        self.refreshTaskCount(0,-1);
                    }else{
                        top.BH('task_cancel'); //取消待办任务成功
                        self.refreshTaskCount(-1,-1);
                    }

                    // 触发会话邮件待办图标及DOM属性（status/taskDate/class）更新
                    $App.trigger('covMailRemindRender', {taskFlag: 0, taskDate: 0, mid: self.model.get('mid')})
                });
                //this.cancelRemind();
                break;
            case "finish":
                this.markFinish();
                top.$App.isReadSessionMail() ? BH('cMail_tab_finishTask') : BH("task_complete");                
                break;
        }
    },
    
    itemEvent: function () {
        
        var self = this;
        var $el = this.el;
 
        $('#remindDropMenu a').unbind('click').click(function(){
            var name = $(this).attr('name');
            
            self.doCommand(name);
            self.closeDropMenu();
        });
    },

    getIcoOffset:function(){
        return this.el.find('a[name=mailtask]').offset();
    },

    /** 处理时间提示 time 毫秒*/
    getPopTipsHtml:function(time){
        var t = time ? time : null;
        t = t ? new Date(t) : new Date();
        t = t.format('yyyy-MM-dd hh:mm');
        var temp = this.template.popTips;
        var icoPosition = this.getIcoOffset();
        var style = "z-index:999;position:absolute;left:{0}px;top:{1}px;";
        style = $T.Utils.format(style,[icoPosition.left - 210,icoPosition.top]);
        return $T.Utils.format(temp,[t,style]);
    },

    /** 定义事件 */
    addEvent:function($el){
        $('#taskPopTips').remove();
        var self = this;
        var $el = $el || $("#div_maillist");
        
        //点击图标
        $el.find("a[name=mailtask]").unbind('click').click(function(e){
                top.$App.isReadSessionMail() && top.BH('cMail_tab_remind');
                self.startEvent($(this));
                self.menuEvent(); //下拉菜单
        });
    },

    /** 入口事件 */
    startEvent:function(el){ //a
        var self = this;
        // 读信页调整功能icons结构，直接把任务相关数据绑定在el（a标签）上
        var span = el.find('span').length ? el.find('span') : el;
        var mid = span.attr("mid");
        var status = span.attr('status');
        var taskDate = span.attr('taskDate');
        
        if(status == 'add'){ //由于后台随机给邮件添加了taskDate，做测试数据
            taskDate = 0;
        }
        
        if(status == 'update' && taskDate > 0){
            status = 'hasremind';
        }
        
        var thisel = el.parent(); //div
        this.model.set({
            mid:mid,
            status:status,
            taskDate:taskDate,
            listData:self.getMailData(span),
            el:thisel
        });
        this.el = thisel;
    },
    
    getMailData:function(spanel){
        var data = $App.getMailDataByMid(spanel.attr('mid'));
        if(!data){
            data = {
                from: spanel.attr('from'),
                sendDate: spanel.attr('senddate'),
                subject: spanel.attr('subject')
            };
        }
        return data;
    },

    /** 下拉事件 */
    menuEvent:function(){
        BH("task_click");
        this.showDropMenu();
        this.dropMenuEvent();
    },
    
    /** 组装输出数据 */
    getRenderData:function(){
        var data = {
            listData:this.model.get('listData'),
            status:this.model.get('status'),
            mid:this.model.get('mid'),
            fid: this.model.get('fid'),
            recMySms:this.model.get("recMySms"),
            recMyCanl: this.model.get("recMyCanl"),
            dealTime:this.model.get('taskDate') * 1000,
            smsTime: this.model.get('smsTime')
        };
        if(this.remindContent){
            data.content = this.remindContent;
            this.remindContent = null;
            data.type = this.popType;
            this.popType = null;
        }
        return data;
    },
    
    /** 保存提醒内容 */
    saveRemind: function(data){
        
        var self = this;
        if(self.waiting) return;
        self.waiting = true;

        var smstime = data.smsTime;
        var t = $Date.parse(data.time); //毫秒
        var date = new Date(t);
        var dateFlag = date.format('yyyy-MM-dd');
        var endDateFlag = date.setDate(date.getDate() + 1);
        var taskDate = parseInt(t.getTime()/1000); //秒

        endDateFlag = new Date(endDateFlag).format('yyyy-MM-dd');
        self.model.set({taskDate:taskDate});

        var options = {
            requestData : {
                startTime : '0000',
                endTime : '0000',
                content : data.content,
                title : data.subject.length > 100 ? data.subject.substring(0,100) : data.subject ,
                dateFlag : dateFlag,
                endDateFlag : endDateFlag,
                dateDesc : date.format('yyyy年MM月dd日 hh:mm'),
                smsSendTime: smstime ? new Date(smstime).format('yyyy-MM-dd hh:mm:ss') : 0,
                isSaveCalendar: data.isSaveCalendar,
                isSaveSms: data.isSaveSms
            },
            success: function () {
                if (data.type == "evocationRemind") { //如果是从非邮件发出的提醒就直接退出
                    self.showTips('evocationSuccess');
                    if (self.dialog) {
                        self.dialog.close();
                        self.dialog = null;
                    }
                } else {
                    self.addTask(function () {
                        var status = data.status;
                        if (status == 'add') {
                            top.BH('add1_remindtaskmail_ok'); //灰图标 添加待办提醒成功
                            self.refreshTaskCount(1, 1);
                            self.showTips('addremindsucc');
                        } else if (status == 'update') {
                            top.BH('add2_remindtaskmail_ok'); //亮图标 下拉框点击添加待办提醒成功
                            self.showTips('addremindsucc');
                        } else if (status == 'hasremind') {
                            top.BH('update_remindtaskmail_ok'); //亮图标 下拉框点击修改待办提醒成功
                            self.showTips('updateremindsucc');
                        } else if (status == 'finish') {
                            top.BH('addagain_remindtaskmail_ok'); //完成图标 下拉框点击重新添加待办提醒成功
                            self.refreshTaskCount(1, 1);
                            self.showTips('addremindsucc');
                        }
                        if (self.dialog) {
                            self.dialog.close();
                            self.dialog = null;
                        }
                        // 触发会话邮件待办图标及DOM属性（status/taskDate/class）更新
                        $App.trigger('covMailRemindRender', {taskFlag: 1, taskDate: taskDate, mid: self.model.get('mid')})
                    });
                }
                self.waiting = false;
            },
            error : function(){
                $Msg.alert('日程提交失败，请稍后再试');
                self.waiting = false;
            }
        };
        var d=options.requestData;
        if(data.sms){
            d["beforeTime"]=0;
            d["beforeType"]=0;
            d["recMySms"]=1;
            d["recMyEmail"]=0;
            d["enable"]=1;
        }else{
            d["recMyEmail"]=0;
            d["recMySms"]=0;
            d["enable"]=0; //禁用提醒功能
        }
        
        var status = this.model.get('status');
        if(status == 'hasremind'){
            self.model.editRemind(options);
        }else{
            self.model.addRemind(options);
        }
    },

    tipCalendarView: false,

    initEvent:function(){
        var self = this;

        function _initCalendView(p) {
            if (!self.tipCalendarView) {
//                self.tipCalendarView = new M139.UI.TipCalendarView();
                self.tipCalendarView = M139.UI.TipCalendarView;     //没有new
            }
            self.tipCalendarView.receiveCalendar(p);
        }

        top.$App.on('saveMailRemind',function(data){ //保存
            self.saveRemind(data);
        }).on('cancelMailRemind',function(data){ //取消
            if(self.dialog){
                self.dialog.close();
                self.dialog = null;
            }
        }).on('remindPageLoaded',function(){ //输出
            setTimeout(function(){
                top.$App.trigger('remindRender',self.getRenderData());
            },500);
        }).on("newCalendarMsg", function(p) {

            if (self.tipCalendarView) {
                self.tipCalendarView.receiveCalendar(p);
                return;
            }

            if (_.isUndefined(M139.UI.TipCalendarView)) {
                M139.core.utilCreateScriptTag({     //异步加载显示日历的tip view
                     scriptId: "tip_calendarview",
                     src: "/m2012/js/prod/tips/m2012.ui.tip.calendarview.js"
                }, function() {
                    _initCalendView(p);
                });
            } else {
                _initCalendView(p);
            }
        });
    }

}));

        
})(jQuery, _, M139);    


