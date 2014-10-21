;(function ($, _, M139, top) {
    var superClass = M139.View.ViewBase,
        Validate = M2012.Calendar.View.ValidateTip,
        //dateComponent = M2012.Calendar.CalendarView,
        dateComponent = M2012.Calendar.View.DayPicker,
        Constant = M2012.Calendar.Constant,
        $Utils = M2012.Calendar.CommonAPI.Utils,
        remindComponent = M2012.Calendar.View.Reminder,
        commonAPI = M2012.Calendar.CommonAPI.getInstance(),
        textareaComponent = M2012.Calendar.View.TextArea,
        remindType = M2012.Calendar.Constant.remindSmsEmailTypes;

    M139.namespace('M2012.Calendar.Popup.View.Birthday', superClass.extend({

        _template:[
            '<ul class="form birthday-form">',
            '<li class="formLine">',
                        '<div id="{cid}_name">',
                            '<label class="label">姓　 名：<span title="必填项" class="red f_st">*</span></label>',
                            '<div><input type="text" value="" class="iText iText-addzt" id="{cid}_input"></div>',
                        '</div>',
                    '</li>',
                    '<li class="formLine">',
                       '<label class="label">生　　日：</label>',
                        '<div class="element">',
                            '<div id="{cid}_dateComponent"></div>',
                            '<div class="mt_5 ie6Margin_left">',
                                '<input id="lunarCal" type="checkbox"> 农历',
                            '</div>',
                        '</div>',
                    '</li>',
                    '<li class="formLine">',
                        '<label class="label">提醒自己：</label>',
                        '<div id="{cid}_remind"></div>',
                    '</li>',
                    '<li class="formLine">',
                        '<div id="{cid}_textarea"></div>',
                    '</div>',
                    '<li class="formLine">',
                        '<div id="{cid}_indentity"></div>',
                    '</div>',
            '</li>',
            '</ul>'].join(''),
        showMaskContent : '<div style="position:absolute; top:0px; height:37px; width:100%; z-index:1000;" class="blackbanner"></div>',
        dialogTitle:'生日提醒',
        errorCode: {
            FILTER_TITLE_RUBBISH: 126,
            FILTER_CONTENT_RUBBISH: 108,
            NEED_IDENTIFY: 910, //需要图片验证码
            FREQUENCY_LIMIT: 911 //频率超限
        },

        message: {
            126: "添加的内容含敏感词，请重新输",
            108: "添加的内容含敏感词，请重新输",
            910: "您添加太频繁了，请稍后再试", //暂时先不提示验证码
            911: "您添加太频繁了，请稍后再试"
        },
        initialize: function (options) {
            var self = this;
            self.model = new M2012.Calendar.Popup.Model.Birthday(options);
            self.master = options.master;
            self.render();
            self.initEvents();
        },
        keepElements: function(){
            var self = this;
            self.birthDateEl = $("#birthDate");
            self.inputPersonNameEl = $('#'+self.cid+'_input');
            self.textareaEl = $('#'+self.cid+'_textarea');
            self.lunarEl = $('#lunarCal');
            self.container = $("#" + self.cid+"_dateComponent");
            self.btnEl = self.birthPop.$el.find("div .boxIframeBtn").css("position", "relative");
        },
        initEvents:function(){
            var self = this;
            //生日弹窗对象
            var $birthPopEl =self.birthPop.$el;

            //初始化日期
            var todayDate = new Date();
            var nowDate = $Date.format("yyyy-MM-dd", todayDate);
            self.birthDateEl.html(nowDate);
            //self.setDateComponent(todayDate);     //防止用户不点击日期选择时提交获取不到日期值

            //初始化日期选择控件
            self.initDateComponent();

            self.initUIComponent();

            //农历点击事件
            self.lunarEl.bind('click',function(){
                //var dateObj = commonAPI.createDateObj(self.chooseDateOrig);

                //self.chooseLunar(dateObj);      //将日期转换为农历
                //self.calculateDate(dateObj);    //将农历日期转为数字如：腊月初一:1201,方便提交
                var data = {
                    isLunar: $(this).is(":checked")
                };
                self.model.set("isLunar", data.isLunar);
                self.dateComponent && self.dateComponent.setData(data);
            });

            // 给输入框绑定keyup事件
            self.inputPersonNameEl.on("keyup keydown",function(e) {
                var value = $.trim($(e.currentTarget).val()),
                    limitLength = Constant.lengthConfig.inputLength;
                if (value.length > limitLength) {
                    Validate.show("不能超过" + limitLength + "个字", self.inputPersonNameEl);
                    $(e.currentTarget).val(value.substr(0, limitLength));
                }
            });

            //可视区域被缩小到小于弹框高度后，无法关闭问题
            try {
                setTimeout(function(){
                    var birthPopTop = parseInt($birthPopEl.css('top'));
                    birthPopTop<0?$birthPopEl.css('top','5px'):'';
                },200);
            } catch (e) { }

        },
        initDateComponent: function(){
            var self = this;

            /**
            new dateComponent({
                date2StringPattern: 'yyyy年MM月dd日',
                id: self.cid+"_dateComponent",//绑定的元素
                year: "2014",
                month: "1",
                day: "2",
                callback: function (date) {
                    self.setDateComponent(date);
                }
            });*/
            self.dateComponent = new dateComponent({
                master: self.master,
                container: self.container,
                onChange: function (date) {
                    self.setDateComponent(date);
                    //self.model.set("timeObj")
                }
            });
            self.container.children(":first").width("148px"); // 调整设置时间的宽度

            // 验证码
            self.identify = new M2012.Calendar.View.Identify({
                wrap: this.cid + '_indentity',
                name: 'indentity',
                titleName: '验证码'
            });

        },
        setDateComponent: function(date){
            /**
            var self = this;
            if (typeof (date) != "string") {
                self.chooseDate = $Date.format("yyyy-MM-dd", date)
            }
            //备用(包含有农历，节日等描述的对象)：
            var dateObj = commonAPI.createDateObj(date);
            self.chooseDateOrig = date;
            self.chooseLunar(dateObj);
            self.calculateDate(dateObj);*/
            var self = this;
            self.chooseDateOrig = date;
            self.model.set("isLunar", self.lunarEl.is(":checked"));
            self.model.set("datetime", $Date.format("yyyy-MM-dd", date));
        },
        initUIComponent: function(){
            var self = this;

            self.remindComponent = new remindComponent({
                beforeTime : 3, //提醒时间,默认为提前3天
                beforeType : 2, // 提醒类型0：分钟；1：小时；2：天；3：周；4：月
                container: self.birthPop.$el.find("#" + self.cid + "_remind"),
                onChange : function (args) {

                    self.model.set("remindObj", args);
                }
            });
            self.remindComponent.getElement("remind_time").children(":first").width("148px"); // 调整提醒时间控件的宽度
            //textarea组件
            new textareaComponent({
                wrap: self.cid + '_textarea',
                name: 'remark',
                titleName: '备　　注'
            });

        },
        render: function () {
            var self = this;
            var template = $T.Utils.format(self._template, {
                cid: this.cid
            });
           self.birthPop = $Msg.showHTML(template,
                function (e) {
                    self.onConfirmClick(e);
                },
                function (e) {
                    // 取消
                    $(document).click();
                    $(document.body).click();
                },
                {
                    width: '480px',
                    dialogTitle: self.dialogTitle,
                    buttons: ['保存', '取消']
                });
            self.keepElements();
        },
        //保存事件
        onConfirmClick: function(e){
            e.cancel = true;    //防止点击确定的时候下发提醒校验弹框显示出来生日弹框就消失了
            var self = this;
            var remindObj = self.model.get("remindObj");
            var personNameValue = $.trim(self.inputPersonNameEl.val());
            var remark = self.textareaEl.find('textarea').val();
            if (!personNameValue) {
                Validate.show('请输入姓名', self.inputPersonNameEl);
                return;
            }
            var remindData =   {
                beforeType : remindObj.beforeType,
                beforeTime : remindObj.beforeTime,
                recMyEmail : remindObj.remindType== remindType.email.value ? 1 : 0,
                recMySms : remindObj.remindType == remindType.freeSms.value ? 1 : 0,
                recEmail: commonAPI.getUserEmail(),
                recMobile: commonAPI.getUserMobile(),
                enable : remindObj.enable
            };

            var data = {
                labelId: 10,
                validImg: self.identify.getData() || '',
                //beforeTime: remindObj.beforeTime,
                //beforeType: remindObj.beforeType,
                //recMySms: remindObj.recMySms,
                //recMyEmail: remindObj.recMyEmail,
                //enable: remindObj.checkRemind,
                //startTime: "0800",  //生日默认是全天事件
                //endTime: "2359",
                //dateFlag: self.dateFlag,
                //endDateFlag: self.endDateFlag,
                dtStart : this.model.get("datetime") + " " + "08:00:00", // 当天早上8点提醒
                dtEnd : this.model.get("datetime") + " " + "08:00:00",   // 结束时间由23:59:00修改成08:00:00,如果是全天事件则传00:00:00
                calendarType: this.model.get("isLunar") ? 20 : 10,       //时间类型10：公历；20：农历
                sendInterval: 6,        //重复类型：0不重复, 3天, 4周,5月,6年
                title: personNameValue,
                expend: $Date.format("yyyy-MM-dd", self.chooseDateOrig),    //生日新增必填字段（生日日期，格式：2014-02-19）
                specialType: Constant.specialType.birth,
                content: remark
            };

            data = $.extend(data, commonAPI.transform(remindData));

            if(data.enable){   //选中了提醒，要做下发提醒校验
                if(self.isCanRemind(data)){
                    $Msg.confirm('提醒时间早于当前时间,会无法下发当天之前的提醒通知',function(){
                        self.submit(data, e);
                    });
                }else{
                     self.submit(data, e);
                }
            }else{
                self.submit(data, e);
            }
        },

        //下发提醒校验
        isCanRemind: function(remindObj){
            var self = this;
            var curDate = new Date(),
                curMonth = curDate.getMonth()+ 1,
                curYear = curDate.getFullYear();
            var dateObj = commonAPI.createDateObj(self.chooseDateOrig);
            var chooseMonth = dateObj.sMonth,
                chooseYear = dateObj.sYear;
            if(chooseMonth>curMonth){   //因为生日是按月份过得，所以说只要设置的月份大于当前月份，肯定都是可以提醒的
                return false;
            }else{
                var scheduleDate = dateObj.date.split('-');
                var startTime = 800;        //创建生日默认是全天事件，起始时间是8点：800
                //计算当前生日日期距离当前日期的毫秒数
                var distance = new Date(parseInt(scheduleDate[0]), (parseInt(scheduleDate[1],10)-1), parseInt(scheduleDate[2],10), Math.floor(parseInt(startTime,10)/100), parseInt(startTime,10)%100).getTime() - (new Date().getTime());
                //再计算提醒时间的毫秒数
                var remindTime =(remindObj.beforeTime) * 6e4;   //一分钟等于那么多秒

                if(remindObj.beforeType == 1){    //小时
                    remindTime *=60;
                }else if(remindObj.beforeType == 2){
                    remindTime *=1440;      //1440=60*24

                }
                remindTime>distance? isRemind=true:isRemind=false;
                return isRemind;
            }
        },
        //提交生日数据
        submit : function(data, e){
            var self = this;   // currentBtn = e.event.currentTarget;

            // 先显示遮罩层,隐藏"确定","取消"按钮所在的容器
            $(self.showMaskContent).insertBefore(self.btnEl.children(":first"));
            self.model.addCalendar(data, function (detail, text) {
                if (detail.code == 'FS_UNKNOW') {
                    // 1.有异常信息,则使用弹出窗的方式给予提示,没有则默认为需要输入验证码
                    // 2.将遮罩层去掉
                    var info = self.master.capi.getUnknownExceptionInfo(detail.errorCode);
                    info ? $Msg.alert(info) : self.accessIdentify(detail);
                    $(self.btnEl).children(":first").remove();
                    return;
                }

                /**-----------------------------创建成功之后要做的事情----------------------------**/
                // 1.tip提示用户"创建成功",并关闭弹出窗口
                // 2.添加行为日志
                // 3.需要刷新主视图,且主视图上只显示"生日提醒"的活动
                // 4.定位到左侧导航"生日提醒"的导航链接,设置背景色
                // 5.其他的需求,与其他项目组模块有关系
                top.M139.UI.TipMessage.show('创建成功', { delay: 3000 });
                self.birthPop.close();
                self.master.capi.addBehavior("calendar_addbirthdayact_success");
                self.master.trigger("changeNavColor", { cmd : "filterbirth"});
                self.master.trigger(self.master.EVENTS.NAVIGATE, { path: "view/update" });
                self.master.set({ view_filter_flag: 'birth' });

                top.$App && top.$App.trigger("addBirActivitySuccess");
            }, function(json){
                // 接口异常返回时所做的处理
                var code = json && json.errorCode;
                var msgList = self.message;
                var msg = msgList[code];
                if (msg) {
                    $Msg.alert(msg);
                }
            });
        },
        //将农历转换为对应的数字如：那月初二为1202
        calculateDate:function(date){
            var self = this;
            if(self.isLunar){   //为真表示农历
                self.dateFlag = self.toTwoFix(date.lMonth)+self.toTwoFix(date.lDay);
                self.endDateFlag = self.dateFlag;
            }else{  //阳历
                self.dateFlag = self.toTwoFix(date.sMonth)+self.toTwoFix(date.sDay);
                self.endDateFlag = self.dateFlag;
            }
        },

        //农历复选框点击事件
        chooseLunar:function(dateObj){
            var self = this;
            var isLunar = self.lunarEl.attr('checked');
            if(isLunar){
                self.isLunar = true;
                self.birthDateEl.html(dateObj.ldate);
            }else{
                self.isLunar = false;
                self.birthDateEl.html(dateObj.date);
            }
        },
        toTwoFix:function(num){     //把个位数的月份转为两位数如：1月1日->0101
            return num < 10 ? '0' + num : '' + num;
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
        }
    }));
})(jQuery, _, M139, window._top || window.top);