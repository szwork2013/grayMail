;(function ($, _, M139, top) {
    var superClass = M139.View.ViewBase;
    //var superView = CalendarReminder.Schedule.View;
    var commonAPI = M2012.Calendar.CommonAPI.getInstance();

    var timeComponet = M2012.Calendar.View.Time;
    var Constant = M2012.Calendar.Constant;
    //var Transform = CalendarReminder.Schedule.Transform;
    var Transform = null;
    var $CUtils = M2012.Calendar.CommonAPI.Utils;
    var remindComponet = M2012.Calendar.View.Reminder;
    var IdentifyComponet = M2012.Calendar.View.Identify;

    M139.namespace('M2012.Calendar.View.Popup.FastSchedule', superClass.extend({
        _template:[
                    '<div class="repeattips-box">',
                       ' <div id="{cid}_titleMaxTip" style="left:20px;top:10px; display: none;" class="tips">',
                            '<div class="tips-text">不能超过100个字</div>',
                            '<div class="tipsBottom  diamond"></div>',
                        '</div>',
                        ' <div id="{cid}_titleEmptyTip" style="display: none; top:10px;" class="tips">',
                            '<div class="tips-text">主题不能为空</div>',
                            '<div class="tipsBottom  diamond"></div>',
                        '</div>',
                        '<div class="repeattips-area">',
                            '<textarea class="gray" id="{cid}_title" style="overflow: hidden;">{defaultTxt}</textarea>',
                        '</div>',
                        '<div class="pt_20 repeattips-bottom clearfix"><label id="{cid}_pageRepeatTxt" class="fl" style="line-height:25px;">{pageRepeatTxt}</label>',
                            '<div id="{cid}_time" class="fl"></div>',
                             '<div id="{cid}_remind" class="fl"></div>',
                        '</div>',
                        '<div class="pt_10" id="{cid}_indentity"></div>',

                    '</div>'
        ].join(""),
        showMaskContent : '<div style="position:absolute; top:0px; height:36px; width:100%; z-index:1000;" class="blackbanner"></div>',
        defaultTag:{
            titleMaxLen: 100,
            titleMaxTxt:'仅支持输入100个字符'
        },
//        isValidateWeek:true,        //按周创建模板的时候是否需要验证时间组件如：弹出对话框后直接点击"编辑详情活动"就不需要了
        errorCode: {
            FILTER_TITLE_RUBBISH: 126,
            FILTER_CONTENT_RUBBISH: 108,
            NEED_IDENTIFY: 910, //需要图片验证码
            FREQUENCY_LIMIT: 911 //频率超限
        },

        dialogTitle:{
            dayTemp: '按日提醒',
            weekTemp: '按周提醒',
            monthTemp: '按月提醒',
            yearTemp: '按年提醒'
        },

        defaultTxt:{
            dayTemp: '一天精彩立即开始...',
            weekTemp: '每周要事及时提醒...',
            monthTemp: '生活账单随时掌握...',
            yearTemp: '重要日子不容错过...'
        },
        pageRepeatTxt:{
            dayTemp: '每天：',
            monthTemp: '每月：',
            yearTemp: '每年：'
        },
        sendInterval:{
            dayTemp: 3,
            weekTemp: 4,
            monthTemp: 5,
            yearTemp: 6
        },
        errorCode: {
            sensitive: 126, //含有敏感词
            needIdentify: 910 //需要图片验证码
        },
        message: {
            126: "添加的内容含敏感词，请重新输",
            108: "添加的内容含敏感词，请重新输",
            910: "您添加太频繁了，请稍后再试", //暂时先不提示验证码
            911: "您添加太频繁了，请稍后再试"
        },
        initialize: function (options) {
            var self = this;
            self.master = options.master;
            self.pageType = options.pageType;
            self.scheduleTemp = options.scheduleTemp;
            self.model = new M2012.Calendar.Model.Popup.FastSchedule(options);

            self.render(); // 弹出创建活动的窗口
            self.keepElements();
            self.initComponent();
            self.initEvents();
        },
        render:function(){
            var self = this;

            var difTemVal = self.getValByTempSort();
            var html = $T.format(self._template, {
                         cid: self.cid,
                  defaultTxt: difTemVal.defaultTxt,
               pageRepeatTxt: difTemVal.pageRepeatTxt
            });
            self.dialog = $Msg.showHTML(html,function (e) {
//                    e.cancel = true; //点击确定时不关闭，等回调完成时再处理
                self.onConfirmClick(e);
            },
            function (e) {
                //取消
                $(document.body).click();
            },
            {
                width: '480px',
                dialogTitle: difTemVal.dialogTitle,
                buttons: ['保存', '取消'],
                bottomTip:'<span class="bibText" style="padding-top:1px;"><a id="toEditSche" href="javascript:(0)">编辑详细活动</a></span>'
            });
        },
        keepElements: function(){
            var self = this;
            self.timeEl = $('#'+self.cid+'_time');
            self.remindEl = $('#'+self.cid+'_remind');
            self.titleEl = $('#'+self.cid+'_title');
            self.indentityEl = $('#'+self.cid+'_indentity');
            self.titleMaxTipEl = $('#'+self.cid+'_titleMaxTip');
            self.titleEmptyTipEl = $('#'+self.cid+'_titleEmptyTip');
            self.toEditScheEl = $('#toEditSche');
            self.remindEl = self.dialog.$el.find("#" + self.cid + '_remind');
            self.btnEl = self.dialog.$el.find("div .boxIframeBtn").css("position", "relative");
        },
        initComponent: function(){
            var self = this;
            self.timeComponet = new timeComponet({
                wrap: self.cid + '_time',
                name: 'time',
                calender: false,
                isShowCurDate: false,
                isShowLunar:false,
                type: 2,//-1：快捷日常；1：详情日程，而这个都不属于
                titleName: ''
            });

            self.remindComponet = new remindComponet({
                container: self.remindEl,
                onChange : function (args) {

                }
            });
            // 去掉提醒控件后的多余节点,只保留"邮件","短信"的下拉框选项
            if (self.remindEl){
                self.remindEl.children(":first").remove();
                //self.remindEl.children().children().not(":last").remove();
                self.remindComponet.getElement("remind_type").removeClass("ml_10");
            }

            self.identifyComponet = new IdentifyComponet({
                wrap: self.cid + '_indentity',
                name: 'indentity',
                titleName: '验证码'
            });

            self.handerComponetByTemp();
        },
        initEvents: function(){
            var self = this;
            //主题元素聚焦和失焦事件
            self.titleEl.bind('focus',function(){
                var titleVal = self.titleEl.val();
                if(titleVal == self.defaultTxt[self.scheduleTemp]){
                    self.titleEl.val('');
                    self.titleEl.removeClass();
                }
            });

            self.titleEl.bind('blur',function(){
                var titleVal = self.titleEl.val();
                if($.trim(titleVal) == '' || titleVal == self.defaultTxt[self.scheduleTemp]){
                    self.titleEl.val(self.defaultTxt[self.scheduleTemp]);
                    self.titleEl.addClass('gray');
                }
            });

            self.titleEl.bind('keyup keydown change',function(){
                self.validateMaxTitle();
            });

            $(document).bind('click', function(){
                self.titleMaxTipEl.hide();
                self.titleEmptyTipEl.hide();
            });

            //点击 编辑详细活动
            self.toEditScheEl.bind('click', function(){
                var resDataObj = {}, key;
                //var remindObj = self.remindComponet.getData();
                var timeObj = self.timeComponet.getData();
                //很奇怪第一次用getDate取不到time组件值，所以取初始化time组件的值
                var startTime = timeObj.startTime? timeObj.startTime : commonAPI.getTime().startTime.replace(':', '');
                //if(self.scheduleTemp == Constant.scheduleTempMap.weekTemp){
                   // resDataObj = self.getDifferDataByTemp({isValidateWeek:1});
               // }else{
                   // resDataObj = self.getDifferDataByTemp();
               // }
                resDataObj = self.getDifferDataByTemp();

                var titleVal = self.titleEl.val();
                if(titleVal == self.defaultTxt[self.scheduleTemp]){
                    titleVal = '';
                }
                var dtStart = commonAPI.getCompleteTime(resDataObj.dateFlag, commonAPI.transformTime(startTime));
                //var url = "add_schedule.html?from=" + self.pageType;
                var data = {
                    title:titleVal,
                    beforeTime: 0,
                    beforeType: 0,
                    recMySms: self.remindComponet.model.get("remindType") == Constant.remindSmsEmailTypes.freeSms.value ? 1 : 0,
                    recMyEmail: self.remindComponet.model.get("remindType") == Constant.remindSmsEmailTypes.email.value ? 1 : 0,
                    sendInterval: self.sendInterval[self.scheduleTemp],        //重复类型：0不重复, 3天, 4周,5月,6年
                    //dateFlag: resDataObj.dateFlag,
                    //endDateFlag: resDataObj.dateFlag,
                    //startTime: startTime,   //按天提醒 开始时间和结束时间一样滴
                    //endTime: startTime,
                    dtStart : dtStart,
                    dtEnd : dtStart,
                    week : timeObj.week   // 按周提醒时用到
                };

                if (window.ISOPEN_CAIYUN) {
                    //url += "&" + $Url.urlEncodeObj(data);
                } else {
                    //var MainApp = new M139.PageApplication({ name: 'ScheduleView' });
                    //key = MainApp.setStorage(data);
                    //console.log(MainApp);
                    //url = MainApp.inputDataToUrl(url, { data: data });
                }
               // console.log(data);
                // 传个特殊值
                self.master.trigger(self.master.EVENTS.EDIT_ACTIVITY, data);
                //CalendarReminder.Url.redirect(url);
            });

            if($B.is.ie && $B.getVersion() == 6){       //IE6模板弹窗样式问题纠正
                self.timeEl.find('.clearfix').removeClass();
            }
        },
        onConfirmClick: function(e){
            e.cancel = true;
            var self = this;
            //self.sureBtn = self.dialog.$el.find('.bibBtn .YesButton');      //弹出框确定按钮
            //self.sureBtn.hide();
            $(self.showMaskContent).insertBefore(self.btnEl.children(":first"));
            //校验主题输入是否合法
            var titleVal = self.titleEl.val();
            if($.trim(titleVal) == '' || titleVal == self.defaultTxt[self.scheduleTemp]){
                //self.sureBtn.show();
                self.btnEl.children(":first").remove();
                self.titleEmptyTipEl.show();
                M139.Dom.flashElement(self.titleEl.selector);
                return ;
            }
            var timeObj = self.timeComponet.getData();
            //很奇怪第一次用getDate取不到time组件值，所以取初始化time组件的值
            var startTime = timeObj.startTime? timeObj.startTime : commonAPI.getTime().startTime.replace(':', '');
            // TODO ,按周提醒为何取不到默认值,obj的startTime会被week覆盖，求解?
            //var remindObj = self.remindComponet.getData();
            var resDataObj = self.getDifferDataByTemp({isAdd : true});
            if(!resDataObj) {
                self.btnEl.children(":first").remove();
                return ;
            }

            var validImgVal = self.identifyComponet.getData();
            var dtStart = commonAPI.getCompleteTime(resDataObj.dateFlag, commonAPI.transformTime(startTime));

            // TODO 验证码的功能还需完善
            var data = {
                labelId: 10,
                validImg: validImgVal || '',
                beforeTime: 0,
                beforeType: 0,
                recMySms: self.remindComponet.model.get("remindType") == Constant.remindSmsEmailTypes.freeSms.value ? 1 : 0,
                recMyEmail: self.remindComponet.model.get("remindType") == Constant.remindSmsEmailTypes.email.value ? 1 : 0,
                enable: self.remindComponet.model.get("enable"),
                //startTime: startTime,   //按天提醒 开始时间和结束时间一样滴
                //endTime: startTime,
                // dateFlag: resDataObj.dateFlag,
                // endDateFlag: resDataObj.dateFlag,
                dtStart : dtStart,
                dtEnd : dtStart,
                calendarType: 10,       //时间类型10：公历；20：农历
                sendInterval: self.sendInterval[self.scheduleTemp],        //重复类型：0不重复, 3天, 4周,5月,6年
                title: titleVal,
                content: '',
                week: timeObj.week
            };

            // 显示遮罩层
            self.model.addCalendar(data,
                function (detail, text) {
                    if (detail["code"] == "S_OK") {
                        /**-----------------------------创建成功之后要做的事情----------------------------**/
                        // 1.tip提示用户"创建成功",并关闭弹出窗口
                        // 2.添加行为日志
                        // 3.需要刷新主视图
                        top.M139.UI.TipMessage.show('创建成功', { delay: 3000 });
                        self.dialog.close();
                        self.model.addBehaviour(self.scheduleTemp);
                        self.master.trigger(self.master.EVENTS.NAVIGATE, { path: "view/update" });
                    }else {
                        // 1.处理异常信息或验证码
                        // 2.去掉遮罩层
                        var info = commonAPI.getUnknownExceptionInfo(detail.errorCode);
                        info ? $Msg.alert(info) : self.handlerError(detail);
                        self.btnEl.children(":first").remove();
                    }
                },function (detail) { // 请求失败回调
                    self.btnEl.children(":first").remove();
                    if(detail && detail.errorCode == self.errorCode.sensitive){//含有敏感词
                        $Msg.alert(self.message[detail.errorCode]);
                    }
                }
            );
        },
        handlerError : function (detail) {
            var self = this;
            self.indentityEl.show();
            if ($CUtils.getObjValue(detail.errorCode, Constant.IDENTIFY_CODES)) {
                self.identifyComponet.handerError(detail.errorCode);
            }
        },
        getDifferDataByTemp: function(options){
            var self = this;
            var resultData = {};
            //var curDate = new Date();
            var curDate = commonAPI.getCurrentServerTime();
            var getDay = self.toTwoFix(curDate.getDate());
            var getMonth = self.toTwoFix(curDate.getMonth()+1);
            var timeObj = self.timeComponet.getData();
            if(self.scheduleTemp == Constant.scheduleTempMap.dayTemp){
                resultData.dateFlag = $Date.format("yyyy-MM-dd", curDate);
            }else if(self.scheduleTemp == Constant.scheduleTempMap.weekTemp){
                //if(!options){
                if(options && options.isAdd && !self.timeComponet.validate()){  // 点击"保存"时需要对周控件进行校验
                    return null;
                }

                if (timeObj.week.indexOf("1") == -1) {
                    // 表示没选星期,直接点击"编辑"跳转,默认应该传入当前系统时间
                    resultData.dateFlag = $Date.format("yyyy-MM-dd", curDate);
                    return resultData;
                }

                //resultData.dateFlag = timeObj.week;
                // 校验通过,或不需要校验(isValidateWeek == 1)时走的流程
                if (parseInt(timeObj.week.charAt(curDate.getDay()))) {
                     // 选择的某天正好包含当天的情况,则以当前系统时间作为开始时间
                     resultData.dateFlag = $Date.format("yyyy-MM-dd", curDate);
                }else{
                    // 不包含当天,就找到离当前时间最近的日期
                    var firstIndex = timeObj.week.indexOf("1"), // firstIndex为0时表示,选择了周日
                        weekIndex = curDate.getDay(),
                        secondIndex = timeObj.week.indexOf("1", weekIndex),
                        differ;  // 与最近的日期相差几天

                    if (secondIndex != -1) { // secondIndex为-1时表示从当天的下一天开始到周六都未选
                        // 表示当天的下一天到周六的至少一天被勾选,需校正firstIndex,应该从第2个1的位置开始算起
                        firstIndex = secondIndex;
                    }

                    if (firstIndex - weekIndex < 0) {
                        // 开始时间要推算到下周,如当天周三: 选择的是周一,1 - 3 + 7
                        differ = firstIndex - weekIndex + 7;
                    }else{
                        // 开始时间在本周,如当天周三,选择的是周四,4 - 3
                        differ = firstIndex - weekIndex;
                    }
                    // 将开始时间设置成differ天之后的时间
                    resultData.dateFlag = $Date.format("yyyy-MM-dd", new Date(curDate.getTime() + differ * 24*60*60*1000));
                }
               // }else if(options && options.isValidateWeek == 1){ // 编辑时不需要校验
                    //resultData.dateFlag = timeObj.week;
              //  }
            }else if(self.scheduleTemp == Constant.scheduleTempMap.monthTemp){
                //resultData.dateFlag = timeObj.startDateDay? timeObj.startDateDay: getDay;
                // 当前月份 + 选择的日 ,拼接成"2010-01-05"的形式
                var ddString = timeObj.startDateDay? timeObj.startDateDay: getDay;
                resultData.dateFlag = $Date.format("yyyy-MM-" + ddString, curDate);
            }else if(self.scheduleTemp == Constant.scheduleTempMap.yearTemp){
                getDay = timeObj.startDateDay ? timeObj.startDateDay:getDay;
                var ddMMString = timeObj.startDateMonth ? timeObj.startDateMonth + "-" + getDay : getMonth + "-" + getDay;
                //resultData.dateFlag = timeObj.startDateMonth?timeObj.startDateMonth+getDay:getMonth+getDay;
                resultData.dateFlag = curDate.getFullYear() + "-" + ddMMString;
            }
            return resultData;
        },
        //根据不同的模板类型获取不同模板配置值
        getValByTempSort: function(){
            var self = this;
            var resultObj = {};
            resultObj.dialogTitle = self.dialogTitle[self.scheduleTemp];
            resultObj.defaultTxt = self.defaultTxt[self.scheduleTemp];
            resultObj.pageRepeatTxt = self.pageRepeatTxt[self.scheduleTemp];
            return resultObj;
        },

        validateMaxTitle: function(){
            var self = this;
            var titleVal = self.titleEl.val();
            var titleLen = self.titleEl.val().length;
            if(titleLen > self.defaultTag.titleMaxLen){
                self.titleMaxTipEl.show();
                self.titleEl.val(titleVal.substr(0, self.defaultTag.titleMaxLen));
                M139.Dom.flashElement(self.titleEl.selector);
            }
        },

        //根据不同的活动模板设置不同的组件显示
        handerComponetByTemp: function(){
            var self = this;
            self.setRemindWidth();
            var getDay = new Date().getDate();
            var getMonth = self.toTwoFix(new Date().getMonth()+1);

            if(self.scheduleTemp == Constant.scheduleTempMap.dayTemp){
                self.dayTimeComponet();
                self.dayRemindComponet();
                self.dayIdentifyComponet();
                self.timeComponet.weekwrapEl.hide();
                self.timeComponet.startDateDayEl.hide();
                self.timeComponet.startDateMonthEl.hide();

            }else if(self.scheduleTemp == Constant.scheduleTempMap.weekTemp){
                //初始化按周重复的时候，默认选中当天日期是周几
//                var curGetDay = self.getWeek();
                if($B.is.ie && $B.getVersion() == 6){       //IE6模板弹窗样式问题纠正
                    self.timeComponet.weekwrapEl.css({clear:'both'});
                }
                self.timeComponet.setData({ week: '0000000', sendInterval: 4 });
                self.dayTimeComponet();
                self.timeComponet.startDateDayEl.hide();
                self.timeComponet.startDateMonthEl.hide();
                self.dayRemindComponet();
                self.timeComponet.weekwrapEl.show().removeClass('add-moth-check').addClass('pt_10 clearfix');
                self.remindEl.css({position:'absolute', display:'block',top:'20px', left:'100px'});
//                self.remindComponet.smsEamilEl.css({position:'absolute', top:'-53px', left:'100px'});
                self.dayIdentifyComponet();

            }else if(self.scheduleTemp == Constant.scheduleTempMap.monthTemp){
                self.dayTimeComponet();
                self.timeComponet.weekwrapEl.hide();
                self.timeComponet.startDateMonthEl.hide();
                self.timeComponet.startDateDayEl.show();
                self.dayRemindComponet();
                self.timeComponet.setText(self.timeComponet.startDateDayEl, getDay+'日');
                self.dayIdentifyComponet();

            }else if(self.scheduleTemp == Constant.scheduleTempMap.yearTemp){
                self.dayTimeComponet();
                self.dayRemindComponet();
                self.timeComponet.fixDaysByMonth();
                self.timeComponet.weekwrapEl.hide();
                self.timeComponet.setText(self.timeComponet.startDateMonthEl, getMonth+'月');
                self.timeComponet.setText(self.timeComponet.startDateDayEl, getDay+'日');
                self.dayIdentifyComponet();
            }
        },
        getWeek: function(){
            var curDate = new Date();
            var week = '0000000'.split('');
            var nowDay = curDate.getDay();
            week[nowDay] = '1';
            return week.join('');

        },
        //隐藏时间组件一堆不需要显示的东东和初始化时间
        //日视图的时间组件
        dayTimeComponet: function(){
            var self = this;
            self.timeEl.find('.label').hide();
            self.timeComponet.setStartAndEndTime(commonAPI.getTime());
            self.timeComponet.startTimeEl.removeClass('dropDown-ymtime');
            self.timeComponet.startDateEl.hide();
            self.timeComponet.allDayBoxEl.hide();
            self.timeComponet.repeatBoxEl.hide();
            self.timeComponet.endDateEl.hide();
            self.timeComponet.endTimeEl.hide();
            self.timeComponet.zhiTagEl.hide();

        },
        //日视图的提醒组件
        dayRemindComponet: function(){
            var self = this;
            self.remindEl.find('label').hide();
           // TODO  还需校验
            //self.remindComponet.smsEamilEl.removeClass('dropDown-tips ml_10');
            //self.remindComponet.checkRemind.hide();
            //self.remindComponet.beforeTime.hide();
            var initRemindTime = {
                beforeTime: 0,  //提醒时间
                beforeType: 0,  //提醒类型0：分钟；1：小时；2：天；3：周；4：月
                checkRemind: 1, //是否提醒checkbox
                recMyEmail: 1,  //邮件提醒
                recMySms: 0
            };
            // todo 还需校验

            //self.remindComponet.bindData(initRemindTime);
        },
        //日视图的验证码组件
        dayIdentifyComponet: function(){
            var self = this;
            //self.identifyComponet.inputEl.parent().css({position:'absolute', top:0, left:'48px'});
        },
        setRemindWidth: function(){
            var self = this;
            // todo 还需校验
            //self.remindComponet.smsEamilEl.removeAttr('style');
        },
        toTwoFix:function(num){     //把个位数的月份转为两位数如：1月1日->0101
            return num < 10 ? '0' + num : '' + num;
        }
    }));
})(jQuery, _, M139, window._top || window.top);