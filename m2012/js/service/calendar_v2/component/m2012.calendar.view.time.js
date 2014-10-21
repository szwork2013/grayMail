/**
 *视图组件 时间
 */
;(function ($, _, M139, top) {
    var LUNAR_TYPE = 20;
    var Component = M2012.Calendar.View.Component;
    //var Calendar = M2012.Calendar.CalendarView;
    var Constant = M2012.Calendar.Constant;
    var $CUtils = M2012.Calendar.CommonAPI.Utils;
    var PopMenuComponent = M2012.Calendar.View.PopMenu;
    var api = new M2012.Calendar.CommonAPI();
    var Validate = M2012.Calendar.View.ValidateTip;
    //var CommonAPI = M2012.Calendar.Calendar.CommonAPI;
    //var ScheduleTransform = CalendarReminder.Schedule.Transform;

    M139.namespace("M2012.Calendar.View.Time", Component.extend({

        initialize: function (options) {

            this.name = options.name || 'title';
            this.titleName = options.titleName || '时间';
            this.type = options.type || Constant.DetailSchedule;
            this.wrap = $("#" + options.wrap);
            this.render();
            this.kepElements();
            if (options.isShowCurDate) {
                $("#" + this.cid + '_curDate', this.wrap).show();
            } else {
                $("#" + this.cid + '_curDate', this.wrap).hide();
            }
            if (options.isShowLunar == false) {
                $("#pnl_lunar", this.wrap).hide();
            }
            this.initComponent();
            //是否显示日期选择组件
            options.calender && this.initCalendar();
            this.initEvents();
            this.adjustPosition();
        },
        adjustPosition : function () { // 由于架构调整前后的DOM结构不一致,导致需要做一些处理,最好还是改结构
            // 某些特殊情况下可能需要调整某些控件的位置
            var spanEl = this.startTimeEl.children(":first");

            // 会被repeating-bottom样式影响到,增加这段代码,不然设置时间会被隐藏一部分
            spanEl.removeClass("ml_5").css({
                height : Constant.Common_Config.Shortcut_setTime_Height,
                lineHeight : Constant.Common_Config.Shortcut_setTime_Height
            }).find("input").addClass("mt_0");
        },
        render: function () {
            var template = $T.Utils.format(this._template, {
                title: this.title,
                titleName: this.titleName,
                cid: this.cid,
                display: this.type == -1 ? 'none' : ''
            });
            $(template).appendTo(this.wrap);
        },
        /**
         * 获取用动态cid生成id标示的HTML元素JQUERY对象
         */
        getElement: function (id) {

            var self = this;

            id = $T.format("#{cid}_{id}", {
                cid: self.cid,
                id: id
            });

            return $(id);
        },
        initComponent: function () {
            var that = this;
            //开始时间
            var timeSource = $CUtils.createPopMenuObjParams(this.times, 'time');

            /**
             this.startTimePop = new PopMenuComponent({
                docElement: this.cid + "_startTime",
                dataSource: timeSource,
                callback: function () {
                    //this.popMenubackhander.bind(this) IE8不支持此操作
                    that.popMenubackhander.apply(that, [].slice.call(arguments));
                },
                height: '150px',
                width: '90px'
            });*/

            this.startTimePop = new M2012.Calendar.View.TimeSelector({
                master: window.$Cal,
                container: this.getElement("startTime"),
                onChange: function (obj) {
                    that.popMenubackhander(obj, that.cid + "_startTime", "time");
                }
            });

            //结束时间
            this.endTimePop = new PopMenuComponent({
                docElement: this.cid + "_endTime",
                dataSource: timeSource,
                callback: function () {
                    that.popMenubackhander.apply(that, [].slice.call(arguments));
                },
                height: '150px',
                width: '90px'
            });

            if (this.type === Constant.ShortCutSchedule) {
                return;
            }

            var intervalSource = $CUtils.createPopMenuObjParams(this.repeatTypes, '');
            ///提醒类型
            this.sendIntervalPop = new PopMenuComponent({
                docElement: this.cid + "_sendInterval",
                dataSource: intervalSource,
                callback: function () {
                    that.popMenubackhander.apply(that, [].slice.call(arguments));
                },
                height: 'auto',
                width: '90px'
            });
            var dateMonthSource = $CUtils.createPopMenuObjParams(this.everyMonth, 'year');
            ///开始月
            if (this.type != -1) {
                this.startDateMonthPop = new PopMenuComponent({
                    docElement: this.cid + "_startDateMonth",
                    dataSource: dateMonthSource,
                    callback: function () {
                        that.popMenubackhander.apply(that, [].slice.call(arguments));
                    },
                    height: '150px',
                    width: '80px'
                });

                //结束月
                this.endDateMonthPop = new PopMenuComponent({
                    docElement: this.cid + "_endDateMonth",
                    dataSource: dateMonthSource,
                    callback: function () {
                        that.popMenubackhander.apply(that, [].slice.call(arguments));
                    },
                    height: '150px',
                    width: '80px'
                });

                var dateDaySource = $CUtils.createPopMenuObjParams(this.everyDay, 'month');
                //日
                this.startDateDayPop = new PopMenuComponent({
                    docElement: this.cid + "_startDateDay",
                    dataSource: dateDaySource,
                    callback: function () {
                        that.popMenubackhander.apply(that, [].slice.call(arguments));
                    },
                    height: '150px',
                    width: '80px'
                });

                this.endDateDayPop = new PopMenuComponent({
                    docElement: this.cid + "_endDateDay",
                    dataSource: dateDaySource,
                    callback: function () {
                        that.popMenubackhander.apply(that, [].slice.call(arguments));
                    },
                    height: '150px',
                    width: '80px'
                });
            }
        },

        initCalendar: function () {
            var self = this;

            this.startCalendar = new Calendar({
                date2StringPattern: 'yyyy年MM月dd日',
                id: this.cid + '_startDate',
                callback: function (date, ldate) {
                    self.updateDate({ name: 'startDate', date: ldate });
                }
            });

            this.endCalendar = new Calendar({
                date2StringPattern: 'yyyy年MM月dd日',
                id: this.cid + '_endDate',
                callback: function (date, ldate) {
                    self.updateDate({ name: 'endDate', date: ldate });
                }
            });
        },

        kepElements: function () {

            this.startTimeInput = $("#" + this.cid + '_startTime_input');
            this.endTimeInput = $("#" + this.cid + '_endTime_input');
            this.startTimeEl = $("#" + this.cid + '_startTime');
            this.endTimeEl = $("#" + this.cid + '_endTime');
            this.zhiTagEl = $("#" + this.cid + '_zhiTag');
            this.weekwrapEl = $("#" + this.cid + '_week_wrap');
            this.startDateDayEl = $("#" + this.cid + '_startDateDay');

            //如果是快捷日程，则没有相关日期与时间
            if (this.type === Constant.ShortCutSchedule) {
                return;
            }

            this.sendIntervalEl = $("#" + this.cid + '_sendInterval');
            this.checksendIntervalEl = $("#" + this.cid + '_checksendInterval');
            this.checkallDayEl = $("#" + this.cid + '_checkallDay');
            this.sendIntervalInput = $("#" + this.cid + '_sendInterval_input');
            this.allDayBoxEl = $("#" + this.cid + '_allDayBox');
            this.repeatBoxEl = $("#" + this.cid + '_repeatBox');

            this.startDateEl = $("#" + this.cid + '_startDate');
            this.startDateMonthEl = $("#" + this.cid + '_startDateMonth');
            this.endDateEl = $("#" + this.cid + '_endDate');
            this.endDateMonthEl = $("#" + this.cid + '_endDateMonth');
            this.endDateDayEl = $("#" + this.cid + '_endDateDay');
            this.lstartDateEl = $("#" + this.cid + '_lstartDate');
            this.lendDateEl = $("#" + this.cid + '_lendDate');

            this.descEl = $("#" + this.cid + '_desc');
        },

        initEvents: function () {
            var self = this;
            self.wrap.bind('click', function (e) {
                var event = e || window.event,
                    targt = event.srcElement || event.target,
                    name = $(targt).attr("name");
                if (name) {
                    self.dispatchHander(name, e);
                }
            });
        },

        setText: function($el, text) {
            $el.find('.dropDownText').text(text);
        },

        get$el: function (id) {
            return $('#' + this.cid + '_' + id);
        },

        freshMonthDayPop: function () {
            var self = this;
            var isLunar = self.isLunar();
            var obj = self.getData();

            //处理重复情况下的月份与日期菜单
            var sMonthArray = [], eMonthArray = [], sDayArray = [], eDayArray = [];
            if (isLunar) {
                var i, dayOfMonth = 30;

                //开始农历月
                for (i = 1; i <= 12; i++) {
                    sMonthArray.push({ text: api.cyclicalz(i, 'm'), val: i });
                }

                //开始农历日
                for (i = 1; i <= dayOfMonth; i++) {
                    sDayArray.push({ text: api.cDay(i), val: i });
                }

                //结束农历月
                for (i = Number(obj.startDateMonth); i <= 12; i++) {
                    eMonthArray.push({ text: api.cyclicalz(i, 'm'), val: i });
                }

                //结束农历日，按年重复且同一个月时
                if ( obj.sendInterval == 5 || (obj.sendInterval == 6 && Number(obj.startDateMonth) == Number(obj.endDateMonth)) ) {
                    for (i = Number(obj.startDateDay); i <= dayOfMonth; i++) {
                        eDayArray.push({ text: api.cDay(i), val: i });
                    }
                }

            } else {
                sMonthArray = $CUtils.createPopMenuObjParams(self.everyMonth, 'month'); //开始月列表修正

                var param = $.extend({}, self.everyMonth);
                param.start = Number(obj.startDateMonth);
                eMonthArray = $CUtils.createPopMenuObjParams(param, 'month'); //结束月列表修正，回开始月开始到年底

                //农历切换回公历时，需要同时修正开始/结束的月列表与日列表
                param = $.extend({}, self.everyDay);
                param.end = api.solarMonth[Number(obj.startDateMonth)-1];
                sDayArray = $CUtils.createPopMenuObjParams(param, 'month');

                param = $.extend({}, self.everyDay);
                param.start = Number(obj.startDateDay);
                param.end = api.solarMonth[Number(obj.endDateMonth)-1];
                eDayArray = $CUtils.createPopMenuObjParams(param, 'month');
            }

            self.startDateMonthPop.rebuild(sMonthArray);
            self.endDateMonthPop.rebuild(eMonthArray);

            self.startDateDayPop.rebuild(sDayArray);
            self.endDateDayPop.rebuild(eDayArray);
        },

        //总的事件分发
        dispatchHander: function (name, event) {

            var self = this;
            var funName = name.replace(self.cid + "_", '');
            var obj = self.getData();

            if (funName) {
                if (funName == 'cbx_lunar') {

                    var isLunar = !!event.target.checked;
                    self.setIsLunar(isLunar);

                    //根据时间，得到农历日期文本
                    var sDate = api.createDateObj($CUtils.$Date.toDate(obj.startDate));
                    var eDate = api.createDateObj($CUtils.$Date.toDate(obj.endDate));

                    var sCalendar = self.startCalendar;
                    var eCalendar = self.endCalendar;

                    var showText;
                    //处理不重复日期显示

                    if (isLunar) {
                        //从公历切换回农历时，如果是31日，则需要修正到 三十
                        var _sday = Number(obj.startDateDay);
                        if (_sday > 30) {
                            _sday = 30;
                            self.setMyObj({ name: 'startDateDay', val: $CUtils.transeform2str(_sday) });
                        }

                        var _eday = Number(obj.endDateDay);
                        if (_eday > 30) {
                            _eday = 30;
                            self.setMyObj({ name: 'endDateDay', val: $CUtils.transeform2str(_eday) });
                        }

                        //取开始时间的公历年份，加上每年的重复月份 变成当年的月日完整公历日期，再转成农历月日
                        var slDate = api.createDateObj(new Date(sDate.sYear, Number(obj.startDateMonth)-1, _sday));
                        var elDate = api.createDateObj(new Date(sDate.sYear, Number(obj.endDateMonth)-1, _eday));

                        showText = {
                            type: 1,
                            date: { start: sDate.ldate, end: eDate.ldate },
                            repeat: {
                                start: { month: slDate.cMonth, day: slDate.cDay },
                                end: { month: elDate.cMonth, day: elDate.cDay }
                            }
                        };

                        if (slDate.isLeap) {
                            //闰月时，降到正常月份
                            showText.repeat.start.month = api.cyclicalz(slDate.lMonth, 'm');
                            self.setMyObj({ name: 'startDateMonth', val: $CUtils.transeform2str(slDate.lMonth) }); //先改开始月，避免validate时，从闰月提前一个月，导致结束月在开始月之前
                        }

                        if (elDate.isLeap) {
                            showText.repeat.end.month = api.cyclicalz(elDate.lMonth, 'm');
                        }

                        self.setMyObj({
                            startDateMonth: $CUtils.transeform2str(slDate.lMonth),
                            endDateMonth: $CUtils.transeform2str(elDate.lMonth),
                            startDateDay: $CUtils.transeform2str(slDate.lDay),
                            endDateDay: $CUtils.transeform2str(elDate.lDay)
                        });

                        obj = self.getData();

                        //$CUtils.log('重复状态下选定农历', obj);

                    } else {

                        //得到农历当天的年份
                        var now = new api.Lunar(new Date());
                        //现在是农历腊月(一般在公历1月)，但选择的开始月却又在新农历年的正月及以后
                        //则需要将now.year++
                        if (Number(obj.startDateMonth) < 12 && now.year < new Date().getFullYear()) {
                            now.year =  new Date().getFullYear();
                        }

                        var _sday1 = api.Solar({
                            year: now.year,
                            month: Number(obj.startDateMonth),
                            day: Number(obj.startDateDay)
                        });

                        var _eday1 = api.Solar({
                            year: now.year,
                            month: Number(obj.endDateMonth),
                            day: Number(obj.endDateDay)
                        });

                        self.setMyObj({
                            startDateMonth: $CUtils.transeform2str(_sday1.month),
                            endDateMonth: $CUtils.transeform2str(_eday1.month),
                            startDateDay: $CUtils.transeform2str(_sday1.day),
                            endDateDay: $CUtils.transeform2str(_eday1.day)
                        });

                        obj = self.getData();

                        showText = {
                            type: 0,
                            date: { start: sDate.date, end: eDate.date },
                            repeat: {
                                start: fixSolarMonth(obj.startDateMonth, obj.startDateDay, 'startDateDay'),
                                end: fixSolarMonth(obj.endDateMonth, obj.endDateDay, 'endDateDay')
                            }
                        };

                        //$CUtils.log('重复状态下选定公历', obj);
                    }

                    //提醒区间
                    self.setText(sCalendar.elInput, showText.date.start);
                    self.setText(eCalendar.elInput, showText.date.end);

                    sCalendar.returnType = showText.type;
                    eCalendar.returnType = showText.type;

                    //处理重复情况下的日期显示
                    self.setText(self.startDateMonthEl, showText.repeat.start.month);
                    self.setText(self.endDateMonthEl, showText.repeat.end.month);

                    self.setText(self.startDateDayEl, showText.repeat.start.day);
                    self.setText(self.endDateDayEl, showText.repeat.end.day);

                    //处理重复情况下的月份与日期菜单
                    self.freshMonthDayPop();
                }

                if (funName.indexOf('Pop') > 0) {
                    this[funName] && this[funName].show();

                } else if (funName.indexOf('check') >= 0) {

                    if (funName === 'checkallDayEvent') {//全天单击事件
                        isSendInterval = this.obj.sendInterval;
                        var checked = $("input[name=" + this.cid + "_" + funName + "]").attr("checked");
                        if (checked == 'checked') {
                            this.showAllDayUi(checked, isSendInterval);
                            this.setTimeMyObj({ startTime: '0800', endTime: '2359' });
                        } else {
                            this.showSendInterval(isSendInterval);
                            var startTime = this.startTimeInput.text().replace(":", "");
                            var endTime = this.endTimeInput.text().replace(":", "");
                            if (startTime == "0800" && endTime == "2359") {
                                var stf = ScheduleTransform.transform();
                                startTime = stf.time.startTime.replace(":", "");
                                endTime = stf.time.endTime.replace(":", "");
                            }
                            var sTime = $CUtils.fixTimeToHour(startTime);//2359 ==》23:59
                            var eTime = $CUtils.fixTimeToHour(endTime);
                            this.setStartAndEndTime({ startTime: sTime, endTime: eTime });
                            this.setTimeMyObj({ startTime: startTime, endTime: endTime });
                        }
                    } else if (funName.indexOf('week') >= 0) {//每周的单击
                        var pos = funName.replace('check', "").split("_")[1];
                        var weeks = this.obj.week.split("");
                        var checked = $("input[name=" + this.cid + "_" + funName + "]").attr("checked");
                        var val = checked === 'checked' ? "1" : "0";
                        weeks[pos] = val;
                        this.setMyObj({ name: 'week', val: weeks.join("") });
                    }
                }
            }


            function fixSolarMonth(Month, Day, key) {
                var month = Number(Month);
                var day = Number(Day);

                var lastDayThisMonth = api.solarMonth[month-1];

                if (day > lastDayThisMonth) {
                    day = lastDayThisMonth;
                    self.setMyObj({ name: key, val: $CUtils.transeform2str(day) });
                }

                month = $CUtils.transeform2str(month) + '月';
                day = $CUtils.transeform2str(day) + '日';

                return { month: month, day: day };
            }
        },

        //全天显示
        showAllDayUi: function (checked, isSendInterval) {
            if (isSendInterval === 0) {//0 没有重重复的全天事件
                this.showMyDateUI();
            } else if (isSendInterval === 3) {//每天,全天事件
                this.hideAllTimeUI();
            } else if (isSendInterval === 4) {//每周,全天事件
                this.showAllWeekUI();
            } else if (isSendInterval === 5) {//每月,全天事件
                this.showMonthAllEventUI();
            } else if (isSendInterval === 6) {//每年,全天事件
                this.showYearAllEventUI();
            }
        },

        //快捷日程中使用
        setCurDate: function (text) {
            $("#" + this.cid + '_curDate', this.wrap).text(text);
        },

        setStartEndTimeUI: function (startTime, endTime) {
            if (this.isFullDayEvent(startTime, endTime)) {
                this.hideTimeUI();
                this.hideZhiTag();
            } else {
                this.showTimeUI();
                this.showZhiTag();
            }
        },
        updateDate: function (obj) {
            var _this = this;
            var name = obj.name;
            var ldate = obj.date;
            _this.setMyObj({ name: name, val: ldate.date });
            _this['l' + name + 'El'].html(this.getLNStr({ ldate: ldate }));

            _this.setText(_this[name + 'El'],
                _this.isLunar() ?  ldate.lYear + '年' + ldate.cMonth + ldate.cDay : ldate.date
            )
        },

        setIsLunar: function (isLunar) {
            this.setMyObj({ name: 'calendarType', val: isLunar ? 20 : 10 });
        },

        isLunar: function () {
            return this.getData()['calendarType'] === 20;
        },

        //统一处理下拉框
        // style 取值方式:老的方式是通过date.val取值,新的控件通过date.time
        // 使用style来区分
        popMenubackhander: function (data, elId, style) {
            $("#" + elId + "_input").text(data.text);
            var prop = elId.replace(this.cid + "_", "");
            var isLunar = this.isLunar();
            var _data = this.getData();

            if (elId.indexOf("sendInterval") >= 0) {

                var checked = $("input[name=" + this.cid + "_checkallDayEvent]").attr("checked");

                if (checked == 'checked') {
                    this.showAllDayUi(checked, data.val);
                    this.setTimeMyObj({ startTime: '0800', endTime: '2359' });
                } else {
                    this.showSendInterval(data.val);
                    var startTime = this.startTimeInput.text().replace(":", "");
                    var endTime = this.endTimeInput.text().replace(":", "");
                    this.setTimeMyObj({ startTime: startTime, endTime: endTime });
                }

            } else if (prop == 'startDateMonth') {

                //结束月份向开始月份靠近
                var dateArray = [], maxStartDay = 30;
                if (this.isLunar()) {
                    //农历情况下结束月与开始月的天数均无法定量，则取一样的大月天数30日
                    for (var i = 1; i <= maxStartDay; i++) {
                        dateArray.push({ text: api.cDay(i), val: i });
                    }
                } else {
                    //重建“开始月”的日期下拉列表
                    var param1 = $.extend({}, this.everyDay);
                    param1.end = api.solarMonth[Number(data.val)-1];
                    maxStartDay = param1.end;
                    dateArray = $CUtils.createPopMenuObjParams(param1, 'month');

                    //重建“结束月”的日期下拉列表
                    var param2 = $.extend({}, this.everyMonth);
                    param2.start = Number(data.val);
                    var monthArray = $CUtils.createPopMenuObjParams(param2, 'month'); //结束月的天数修正
                    this.endDateMonthPop.rebuild(monthArray);
                }

                this.startDateDayPop.rebuild(dateArray);

                //公历，如果上次选择了月底，但新选月份，月底无31日，则修正回正确的30/28
                if (!this.isLunar() && Number(_data.startDateDay) > maxStartDay) {
                    this.setMyObj({ name: 'startDateDay', val: $CUtils.transeform2str(maxStartDay + '') });
                    this.setText(this.startDateDayEl, $CUtils.transeform2str(maxStartDay) + '日');
                }

                //动态调整结束月份，需要把结束月修正到开始月或更晚
                if  (Number(_data.endDateMonth) < Number(data.val)) {
                    this.setMyObj({ name: 'endDateMonth', val: $CUtils.transeform2str(data.val) });

                    var monthText = '';
                    if (this.isLunar()) {
                        monthText = api.cyclicalz(data.val, 'm');
                    } else {
                        monthText = $CUtils.transeform2str(data.val) + '月';
                    }
                    this.setText(this.endDateMonthEl, monthText); //结束月修正
                }

                //结束月的农历月份隐藏
                if (this.isLunar()) {
                    var monthArray = [];
                    for (var i = data.val; i <= 12; i++) {
                        monthArray.push({ text: api.cyclicalz(i, 'm'), val: i });
                    }
                    this.endDateMonthPop.rebuild(monthArray);
                } else {
                    //结束月的公历天数修正
                    param = $.extend({}, this.everyDay);
                    param.end = api.solarMonth[Number(data.val)-1];
                    dateArray = $CUtils.createPopMenuObjParams(param, 'month');
                    this.endDateDayPop.rebuild(dateArray);
                }

            } else if (prop == 'endDateMonth') {

                if (this.isLunar()) {
                    var dayArray = [];
                    for (var i = 1; i <= 30; i++) {
                        dayArray.push({ text: api.cDay(i), val: i });
                    }
                    this.startDateDayPop.rebuild(dayArray);
                    this.endDateDayPop.rebuild(dayArray);
                    this.setMyObj({ name: prop, val: data.val });
                    return;
                }

                //结束月的天数：按月重复时，从开始日列出，按年重复时，开始结束在同月份时，才从开始日列出
                var param = $.extend({}, this.everyDay);
                //$CUtils.log(_data.sendInterval, _data.startDateMonth, data.val);
                if (_data.sendInterval == 5 || (_data.sendInterval == 6 && Number(_data.startDateMonth) == Number(data.val)) ) {
                    param.start = Number(_data.startDateDay);
                }
                param.end = api.solarMonth[Number(data.val)-1];

                var dateArray = $CUtils.createPopMenuObjParams(param, 'month');
                this.endDateDayPop.rebuild(dateArray);

                if (Number(_data.endDateDay) > param.end) {
                    this.setMyObj({ name: 'endDateDay', val: $CUtils.transeform2str(param.end) });
                    this.setText(this.endDateDayEl, param.end + '日');
                }

            } else if (prop == 'startDateDay') {
                //$CUtils.log('重复选择日的下拉框', data, elId, prop, _data);

                //如果每月重复时，修正结束日到开始日当天及以后，但如果是每年重复，则需要看月份是否是均在本月
                var MONTHLY = 5, YEARLY = 6;

                if (_data.sendInterval == MONTHLY) {

                    var newStartDay = Number(data.val);
                    var endDay = Number(_data.endDateDay);

                    if (newStartDay > endDay) {
                        //$CUtils.log('结束日早于开始日，结束日将修正到开始日', endDay, newStartDay);
                        this.setMyObj({ name: 'endDateDay', val: $CUtils.transeform2str(newStartDay) });
                        endDay = isLunar ? api.cDay(newStartDay) : $CUtils.transeform2str(newStartDay) + '日';
                        this.setText(this.endDateDayEl, endDay);
                    }

                    //重建“结束月”的日期下拉列表
                    var dateArray2 = [];
                    if (isLunar) {
                        //农历情况下结束月与开始月的天数均无法定量，则取一样的大月天数30日
                        for (var i = newStartDay; i <= 30; i++) {
                            dateArray2.push({ text: api.cDay(i), val: i });
                        }
                    } else {
                        param = $.extend({}, this.everyDay);
                        param.start = newStartDay;
                        dateArray2 = $CUtils.createPopMenuObjParams(param, 'month'); //结束月的天数修正
                    }
                    this.endDateDayPop.rebuild(dateArray2);

                } else if (_data.sendInterval == YEARLY) {
                    var newStartDay = Number(data.val);
                    var endDay = Number(_data.endDateDay);

                    var startMonth = Number(_data.startDateMonth);
                    var endMonth = Number(_data.endDateMonth);

                    if (newStartDay > endDay && startMonth == endMonth) {
                        //$CUtils.log('结束日早于开始日，结束日将修正到开始日', endDay, newStartDay);
                        this.setMyObj({ name: 'endDateDay', val: $CUtils.transeform2str(newStartDay) });
                        endDay = isLunar ? api.cDay(newStartDay) : $CUtils.transeform2str(newStartDay) + '日';
                        this.setText(this.endDateDayEl, endDay);
                    }

                    if (startMonth != endMonth) {
                        this.setMyObj({ name: prop, val: data.val });
                        return;
                    }

                    //重建“结束月”的日期下拉列表
                    var dateArray2 = [];
                    if (isLunar) {
                        //农历情况下结束月与开始月的天数均无法定量，则取一样的大月天数30日
                        for (var i = newStartDay; i <= 30; i++) {
                            dateArray2.push({ text: api.cDay(i), val: i });
                        }
                    } else {
                        param = $.extend({}, this.everyDay);
                        param.start = newStartDay;
                        param.end = api.solarMonth[endMonth-1];
                        dateArray2 = $CUtils.createPopMenuObjParams(param, 'month'); //结束月的天数修正
                    }
                    this.endDateDayPop.rebuild(dateArray2);
                }
            } else if (prop == 'endDateDay') {
                data.val = $CUtils.transeform2str(data.val);
                //$CUtils.log('点选了结束日列表', data.val);
            }

            // 根据style的不同,设置obj对象
            // 原先的style代表<li>元素
            if (style && style === 'time') {
                this.setMyObj({ name: prop, val: data.time });
            }else{
                this.setMyObj({ name: prop, val: data.val});
            }
        },

        //修正某月下没有的天数，如2月没有30,31号时就不提供给用户选择
        fixDaysByMonth: function(){
            var self = this;
            var dateArray = [];
            //如果没有data时默认为当前月：如快捷创建——按月重复活动模板
            var data = {};
            var month = new Date().getMonth()+1;
            data.val = month>10 ? month : '0'+month;
            month = month>10 ? month+'月' : '0'+month+'月';
            data.text = month;
            //重建“开始月”的日期下拉列表
            var param = $.extend({}, self.everyDay);
            param.end = api.solarMonth[Number(data.val)-1];
            dateArray = $CUtils.createPopMenuObjParams(param, 'month');
            self.startDateDayPop.rebuild(dateArray);
        },

        setMyObj: function (obj) {
            var that = this;

            if (!this.obj) {
                this.obj = {};
            }

            if ('undefined' === typeof obj.name) {
                $.extend(this.obj, obj);
            } else {
                this.obj[obj.name] = obj.val;
            }

            //修改批注
            this.setDescText(this.obj.startTime, this.obj.endTime, this.obj.sendInterval);

            //验证
            setTimeout(function(){
                //that.validate();
            },1000);

            that.validate();

        },
        setTimeMyObj: function (obj) {

            for (var i in obj) {

                this.obj[i] = obj[i];
            }

            this.setDescText(this.obj.startTime, this.obj.endTime, this.obj.sendInterval);
        },
        /**
         * 绑定数据
         * @param obj
         * @param type
         */
        bindData: function (obj, type) {
//            if (obj) {
//                var isrepeat = obj.sendInterval != 0;//0表示不重复
//
//                if (isrepeat) {
//                    //重复活动,将结束世界处理为开始时间。后台有做兼容
//                    //以解决重复活动编辑为不重复活动时，结束时间是开始时间+10年
//                    obj.endDate = obj.startDate;
//                }
//            }

            var self = this;
            self.setData(obj);
            self.startTimeInput.text(obj.startTime);
            self.endTimeInput.text(obj.endTime);

            if (self.type === Constant.ShortCutSchedule) {
                return;
            }

            var sendInterval = obj.sendInterval;
            self.sendIntervalInput.text(self.getReaptName(sendInterval));

            var _isLunar = obj.calendarType == LUNAR_TYPE;
            self.setIsLunar(_isLunar);
            self.get$el('cbx_lunar').attr('checked', _isLunar);

            var startDateText = obj.startDate;
            var endDateText = obj.endDate;

            var startMonthText = obj.startDateMonth + '月';
            var endMonthText = obj.endDateMonth + '月';

            var startDayText = obj.startDateDay + '日';
            var endDayText = obj.endDateDay + '日';

            if (_isLunar) {
                var tail = ' 00:00:00';
                var startDate = M139.Date.parse(startDateText + tail);
                var endDate = M139.Date.parse(endDateText + tail);
                self.setMyObj({ name: 'realStartDate', val: startDate });
                self.setMyObj({ name: 'realEndDate', val: endDate });

                var lsDate = new api.Lunar(startDate); //农历
                var leDate = new api.Lunar(endDate); //农历

                startDateText = lsDate.year + '年' + (lsDate.isLeap?'闰':'') + api.cyclicalz(lsDate.month, 'm') + api.cDay(lsDate.day);
                endDateText = leDate.year + '年' + (leDate.isLeap?'闰':'') + api.cyclicalz(leDate.month, 'm') + api.cDay(leDate.day);

                startMonthText = api.cyclicalz(Number(obj.startDateMonth), 'm');
                endMonthText = api.cyclicalz(Number(obj.endDateMonth), 'm');

                startDayText = api.cDay(Number(obj.startDateDay));
                endDayText = api.cDay(Number(obj.endDateDay));
            }

            self.startDateEl.attr('realdate', obj.startDate);
            self.endDateEl.attr('realdate', obj.endDate);

            self.setText(self.startDateEl, startDateText);
            self.setText(self.endDateEl, endDateText);

            self.setText(self.startDateMonthEl, startMonthText);
            self.setText(self.endDateMonthEl, endMonthText);

            self.setText(self.startDateDayEl, startDayText);
            self.setText(self.endDateDayEl, endDayText);

            self.freshMonthDayPop();

            self.bindWeekData(obj.week);
            var isFullTime = self.isFullDayEvent(obj.startTime, obj.endTime);
            self.checkallDayEl.attr("checked", isFullTime);
            self.setDescText(obj.startTime, obj.endTime, sendInterval);
            //根据6种状态来判断
            //0、不重复事件，3、重复天，4重复周，5重复月，6重复年
            switch (sendInterval) {

                case 0:

                    this.showSendInterval(0);
                    this.showLunarUI();
                    if (isFullTime) {//有time为全天事件
                        this.hideTimeUI();
                    }
                    break;
                case 3:
                    this.showSendInterval(3);
                    if (isFullTime) {//有time为全天事件
                        this.hideTimeUI();
                        this.hideZhiTag();
                    }
                    this.hideLunarUI();
                    break;
                case 4:
                    this.showSendInterval(4);
                    if (isFullTime) {//有time为全天事件
                        this.hideTimeUI();
                        this.hideZhiTag();
                    }
                    this.hideLunarUI();
                    break;
                case 5:
                    this.showSendInterval(5);
                    this.showLunarUI();
                    if (isFullTime) {//有time为全天事件
                        this.hideTimeUI();
                    }
                    break;
                case 6:
                    this.showLunarUI();
                    this.showSendInterval(6);
                    if (isFullTime) {//有time为全天事件
                        this.hideTimeUI();
                    }
                    break;

            }
            if (type == -1) {
                this.setReadOnly();
            }
            this.oldVal = $.extend({}, obj);
        },
        setReadOnly: function () {
            var height, self = this;
            height = self.wrap.parent().height();
            self.get$el('ControlReadEl').css('height', height).show();
        },

        isChanged: function () {
            var newData = this.getData();
            var oldData = this.oldVal;
            var retFlag = false;
            if (oldData.sendInterval == newData.sendInterval) {//判断每一个字段是否相等
                for (var item in oldData) {
                    if (oldData[item] !== newData[item]) {
                        retFlag = true;
                        break;
                    }
                }
            } else {
                retFlag = true;
            }
            return retFlag;
        },
        //验证
        validate: function (objData) {

            var data = this.getData();

            var sendInterval = data.sendInterval;
            var curTime = $Date.format('yyyy-MM-dd hh:mm', new Date());
            var sTime = $CUtils.fixTimeToHour(data.startTime);
            var eTime = $CUtils.fixTimeToHour(data.endTime);
            var startTime = data.startDate + " " + sTime;
            var endTime = data.endDate + " " + eTime;
            var retVal = { isOk: true, el: null, msg: [] };

            switch (sendInterval) {

                case 0://不重重的要做校验

                    retVal.el = this.type == Constant.DetailSchedule ? this.cid + '_startDate' : this.cid + '_startTime_input';
                    //1 结束时间不能晚于开始时间 2 开始时间不能早于今天
                    if (!objData && startTime <= curTime) {//当没法有勾选时，在保存时起作用
                        retVal.msg.push('开始时间早于当前时间,会无法下发当天之前的提醒通知');
                        //retVal.isOk = true;
                    }
                    if (startTime > endTime) {
                        retVal.msg.push('开始时间不能晚于结束时间 ');
                        retVal.isOk = false;
                    }
                    break;

                case 3: //每天
                case 4:  //每周
                    if (sTime > eTime) {
                        retVal.msg.push('开始时间不能晚于结束时间 ');
                        retVal.el = this.cid + '_startTime_input';
                        retVal.isOk = false;
                    }
                    if (sendInterval == 4) {
                        if (data.week.indexOf(1) === -1) {
                            retVal.el = this.cid + '_week_wrap';
                            retVal.isOk = false;
                            retVal.msg.push("请至少选择每周中的一天");
                        }
                    }
                    break;
                case 5:  //每月
                    retVal.el = this.cid + '_startDateDay';
                    if (data.startDateDay > data.endDateDay) {
                        retVal.msg.push('开始日不能晚于结束日');
                        retVal.isOk = false;

                    }else if ((data.startDateDay >= data.endDateDay) && (sTime > eTime)) {
                        retVal.msg.push('开始时间不能晚于结束时间 ');
                        retVal.isOk = false;
                    }
                    break;
                case 6: //每年
                    retVal.el = this.cid + '_startDateMonth';
                    if (data.startDateMonth > data.endDateMonth) {
                        retVal.msg.push('开始月不能晚于结束月 ');
                        retVal.isOk = false;

                    } else if ((data.startDateMonth == data.endDateMonth) && (data.startDateDay > data.endDateDay)) {   //如果开始月份和结束月份相同则要判断日期
                        retVal.msg.push('开始日不能晚于结束日 ');
                        retVal.isOk = false;
                    } else if ((data.startDateMonth >= data.endDateMonth) && (data.startDateDay >= data.endDateDay) && (sTime > eTime)) {
                        retVal.msg.push('开始时间不能晚于结束时间 ');
                        retVal.isOk = false;
                    }
                    break;

            }

            if (retVal.msg.length > 0) {
                Validate.show(retVal.msg.join("</br>"), $("#" + retVal.el));
            }
            return retVal.isOk;

        },
        isFullDayEvent: function (startTime, endTimd) {

            return startTime === '08:00' && endTimd === '23:59';
        },

        /**
         * 将农历转成后台需要的格式 { lYear: 2012, lMonth: 12, lDay: 20 } => "2012-12-20"
         * @param {CommonAPI.calElement} calEle 日历单天项目
         * @return {String} 返回 "2012-12-20"
         */
        beautyLunarDate: function (calEle) {
            return [calEle.lYear, $CUtils.transeform2str(calEle.lMonth), $CUtils.transeform2str(calEle.lDay)].join('-');
        },

        setData: function (obj) {
            this.obj = obj;
        },
        getData: function () {

            var self = this;
            var obj = $.extend({}, self.obj);

            //修改返回数据 是否是全天数据
            if (self.checkallDayEl && self.checkallDayEl.attr("checked") === 'checked') {//全天事件
                obj.startTime = "08:00";
                obj.endTime = "23:59";
            }

            //如果按每天重复，则改成公历
            if (obj.sendInterval == 3) {
                obj.calendarType = 10;
            }

            if (obj.calendarType == 20) {
                var sDate = api.createDateObj($CUtils.$Date.toDate(obj.startDate));
                var eDate = api.createDateObj($CUtils.$Date.toDate(obj.endDate));

                obj.startLunarDate = self.beautyLunarDate(sDate);
                obj.endLunarDate = self.beautyLunarDate(eDate);
            }
            return obj;
        },
        //暂不实现
        show: function () {

        },
        //暂不实现
        hide: function () {


        },
        getTimeDesc: function (Time) {
            var retVal = null;
            var intTime = parseInt(Time);
            if (intTime >= 6 && intTime < 12) {
                retVal = "上午"
            } else if (intTime >= 12 && intTime < 13) {
                retVal = "中午"
            } else if (intTime >= 13 && intTime < 18) {
                retVal = "下午"
            } else if (intTime >= 18 && intTime < 22) {
                retVal = "晚上"
            } else if (intTime >= 22 && intTime < 24) {
                retVal = "深夜"
            } else if (intTime >= 0 && intTime < 6) {
                retVal = "凌晨"
            }
            return retVal + Time;
        },

        setDescText: function (startTime, endTime, sendInterval) {
            if (!sendInterval) {
                this.descEl.text('');
                this.obj['dateDescript'] = '';
                return;
            }

            var self = this;
            var desc = null;
            var obj = this.obj;
            var isLunar = self.isLunar();

            var sTime = $CUtils.fixTimeToHour(startTime);//2359 ==》23:59
            var eTime = $CUtils.fixTimeToHour(endTime);
            sTime = this.getTimeDesc(sTime);
            eTime = this.getTimeDesc(eTime);

            var startDay = isLunar ? api.cDay(Number(obj.startDateDay)) : obj.startDateDay + '日';
            var endDay = isLunar ? api.cDay(Number(obj.endDateDay)) : obj.endDateDay + '日';

            var week = null, arrayWeek = [];
            switch (sendInterval) {
                case 4://每周
                    week = obj.week;
                    if (week.indexOf("1") < 0) {
                        desc = "";
                    } else {
                        week.replace(/1/g, function (a, index) { // todo important
                            arrayWeek.push($CUtils.dayWeekStr(index));
                        });

                        desc = "每周" + arrayWeek.join("、");

                        if (!this.isAllDay()) {
                            desc += sTime + "到" + "" + eTime;
                        }
                    }
                    break;

                case 3://每天
                    desc = "每天";
                    if (!this.isAllDay()) {
                        desc += sTime + "到" + eTime;
                    }

                    break;

                case 5: { //每月
                    if (obj.startDateDay == obj.endDateDay) {
                        desc = startDay + (self.isAllDay() ? '' : sTime + "到" + eTime);
                    } else if (self.isAllDay()) {
                        desc = startDay + "到" + endDay;
                    } else {
                        desc = startDay + sTime + "到" + endDay + eTime;
                    }

                    desc = '每月' + desc;
                    break;
                }
                case 6: { //年
                    var startMonth = isLunar ? api.cyclicalz(Number(obj.startDateMonth), 'm') : obj.startDateMonth + '月';
                    var endMonth = isLunar ? api.cyclicalz(Number(obj.endDateMonth), 'm') : obj.endDateMonth + '月';

                    if (obj.startDateDay == obj.endDateDay && obj.startDateMonth == obj.endDateMonth) {
                        desc = startMonth + startDay + (self.isAllDay() ? '' : sTime + "到" + eTime);
                    } else if (self.isAllDay()) {
                        desc = startMonth + startDay + "到" + endMonth + endDay;
                    } else {
                        desc = startMonth + startDay + sTime + "到" + endMonth + endDay + eTime;
                    }

                    desc = '每年' + desc;
                    break;
                }
            }

            if (this.descEl) {
                //判断是否是全局事件
                if (sendInterval != 0) {
                    this.descEl.text(desc);
                } else {
                    this.descEl.text('')
                }
                this.obj['dateDescript'] = desc;
            }
        },
        isAllDay: function () {
            return this.checkallDayEl && this.checkallDayEl.attr("checked") === 'checked';
        },
        bindWeekData: function (week) {
            var weekEl = null;
            for (var i = 0; i < 7; i++) {
                weekEl = this.weekwrapEl.find('input[name=' + this.cid + '_checkweek_' + i + ']');
                weekEl.attr('checked', week.charAt(i) === '1');
            }

        },
        showSendInterval: function (val) {
            this.showZhiTag();
            switch (val) {

                case 4://每周
                    this.hideDateUI();
                    this.hideDateDayUI();
                    this.weekwrapEl.show();
                    this.hideDateMonthUI();
                    this.showTimeUI();
                    this.hideLunarUI();
                    break;

                case 3://每天
                    this.hideDateUI();
                    this.hideDateDayUI();
                    this.weekwrapEl.hide();
                    this.hideDateMonthUI();
                    this.showTimeUI();
                    this.hideLunarUI();
                    break;

                case 5: //每月
                    this.hideDateUI();
                    this.hideDateMonthUI();
                    this.weekwrapEl.hide();
                    this.showDateDayUI();
                    this.showTimeUI();
                    this.showLunarUI();
                    break;
                case 0: //不重复
                    this.hideDateMonthUI();
                    this.hideDateDayUI();
                    this.weekwrapEl.hide();
                    this.showDateUI();
                    this.showTimeUI();
                    this.showLunarUI();
                    break;
                case 6: //年
                    this.hideDateUI();
                    this.showDateDayUI();
                    this.weekwrapEl.hide();
                    this.showDateMonthUI();
                    this.showTimeUI();
                    this.showLunarUI();
                    break;
            }
        },
        showMonthAllEventUI: function () {
            this.showDateDayUI();
            this.hideTimeUI();
            this.hideDateUI();
            this.showZhiTag();
            this.hideDateMonthUI();
            this.weekwrapEl.hide();
        },
        showYearAllEventUI: function () {
            this.showZhiTag();
            this.showDateDayUI();
            this.showDateMonthUI();
            this.hideTimeUI();
            this.hideDateUI();
            this.weekwrapEl.hide();
        },
        showZhiTag: function () {
            this.zhiTagEl.show();
        },
        hideZhiTag: function () {
            this.zhiTagEl.hide();
        },
        hideAllTimeUI: function () {
            this.hideDateUI();
            this.hideDateMonthUI();
            this.hideDateDayUI();
            this.hideTimeUI();
            this.hideZhiTag();
            this.weekwrapEl.hide();
        },
        showAllWeekUI: function () {

            this.hideAllTimeUI();
            this.weekwrapEl.show();
        },
        showMyDateUI: function () {
            this.showDateUI();
            this.hideDateMonthUI();
            this.hideDateDayUI();
            this.hideTimeUI();
            this.weekwrapEl.hide();
        },
        showDateDayUI: function () {
            this.startDateDayEl.show();
            this.endDateDayEl.show();
        },
        hideDateDayUI: function () {

            this.startDateDayEl.hide();
            this.endDateDayEl.hide();
        },

        //农历选项的显示与隐藏
        showLunarUI: function () {
            $('#pnl_lunar').show();
        },
        hideLunarUI: function () {
            $('#pnl_lunar').hide();
        },

        showDateMonthUI: function () {
            this.startDateMonthEl.show();
            this.endDateMonthEl.show();
        },
        hideDateMonthUI: function () {

            this.startDateMonthEl.hide();
            this.endDateMonthEl.hide();
        },
        hideDateUI: function () {
            this.startDateEl.hide();//
            this.lstartDateEl.hide();
            this.endDateEl.hide();
            this.lendDateEl.hide();
        },

        showDateUI: function () {
            this.startDateEl.show();//
            this.lstartDateEl.show();
            this.endDateEl.show();
            this.lendDateEl.show();
        },
        showTimeUI: function () {
            this.startTimeEl.show();
            this.endTimeEl.show();
        },
        hideTimeUI: function () {

            this.startTimeEl.hide();
            this.endTimeEl.hide();
        },
        getLNStr: function (obj) {
            var ldate = null;
            if (obj.ldate) {

                ldate = obj.ldate;
            } else if (obj.date) {

                ldate = api.createDateObj(obj.date);
            } else {
                ldate = api.createDateObj(new Date());
            }
            //四·农历二月十六
            return ldate.week + '·农历' + ldate.cMonth + ldate.cDay;
        },
        getReaptName: function (num) {
            var repeatTypes = this.repeatTypes;
            for (var item in repeatTypes) {

                if (repeatTypes[item] === num) {
                    return item
                }
            }
            return 'null';
        },
        //设置时间组件中的 起始时间和结束时间如：17:30 至 18:30_20130813_XX
        setStartAndEndTime: function (obj) {
            this.startTimeInput.text(obj.startTime);
            this.endTimeInput.text(obj.endTime);
        },
        //0分, 1时, 2天, 3周,4月
        remindTimes: {
            '5分钟': 0, '10分钟': 0, '15分钟': 0, '30分钟': 0, '1小时': 1, '2小时': 1, '3小时': 1, '6小时': 1, '12小时': 1,

            '1天': 2, '2天': 2, '3天': 2, '4天': 2, '5天': 2, '6天': 2, '7天': 2
        },

        everyDay: { start: 1, end: 31, tail: '日' },

        everyMonth: { start: 1, end: 12, tail: '月' },

        repeatTypes: { '不重复': 0, '每天': 3, '每周': 4, '每月': 5, '每年': 6 },

        times: { start: 0, end: 23 },

        _template: ['<label class="label">{titleName}：</label>',

            '<div class="element">',
            '<span class="fl mr_10" id="{cid}_curDate"></span>',
            '<div class="clearfix">',
            '<div class="dropDown dropDown-ymday"  style="display: {display};" realDate="2012-03-20" id="{cid}_startDate">',
            '<a class="dropDownA" href="javascript:void(0);">',
            '<i class="i_triangle_d"></i>',
            '</a>',
            '<div class="dropDownText">2012-03-20</div>',
            '</div>',
            '<div class="dropDown dropDown-ymdate "  id="{cid}_startDateMonth"  style="display: {display};">',
            '<a class="dropDownA" href="javascript:void(0);" name="{cid}_startDateMonthPop" >',
            '<i class="i_triangle_d" name="{cid}_startDateMonthPop"></i>',
            '</a>',
            '<div class="dropDownText"  id="{cid}_startDateMonth_input">1月</div>',
            '</div>',
            '<div class="dropDown dropDown-ymdate"   id="{cid}_startDateDay"  style="display: {display};">',
            '<a class="dropDownA" href="javascript:void(0);" name="{cid}_startDateDayPop" >',
            '<i class="i_triangle_d" name="{cid}_startDateDayPop"></i>',
            '</a>',
            '<div class="dropDownText"  id="{cid}_startDateDay_input" >2日</div>',
            '</div>',
            '<div class="dropDown dropDown-ymtime" id="{cid}_startTime" style="border:none;width:82px;">',
        /**
         '<a class="dropDownA" href="javascript:void(0);" name="{cid}_startTimePop">',
         '<i class="i_triangle_d" name="{cid}_startTimePop"></i>',
         '</a>',
         '<div class="dropDownText" id="{cid}_startTime_input">09:30</div>',*/
            '</div>',
            '<span class="fl ml_5 mr_5" id="{cid}_zhiTag">至</span>',
            '<div class="dropDown dropDown-ymday" realDate="2012-03-14" id="{cid}_endDate" style="display: {display};">',
            '<a class="dropDownA" href="javascript:void(0);">',
            '<i class="i_triangle_d"></i>',
            '</a>',
            '<div class="dropDownText">2012-03-20</div>',
            '</div>',
            '<div class="dropDown dropDown-ymdate"  id="{cid}_endDateMonth" style="display: none;" style="display: {display};">',
            '<a class="dropDownA" href="javascript:void(0);"  name="{cid}_endDateMonthPop" >',
            '<i class="i_triangle_d" name="{cid}_endDateMonthPop" ></i>',
            '</a>',
            '<div class="dropDownText" id="{cid}_endDateMonth_input">3月</div>',
            '</div>',

            '<div class="dropDown dropDown-ymdate"  id="{cid}_endDateDay"  style="display: none;" style="display: {display};">',
            '<a class="dropDownA" href="javascript:void(0);"  name="{cid}_endDateDayPop">',
            '<i class="i_triangle_d" name="{cid}_endDateDayPop"></i>',
            '</a>',
            '<div class="dropDownText" id="{cid}_endDateDay_input">3日</div>',
            '</div>',
            '<div class="dropDown dropDown-ymtime" id="{cid}_endTime">',
            '<a class="dropDownA" href="javascript:void(0);" name="{cid}_endTimePop">',
            '<i class="i_triangle_d" name="{cid}_endTimePop"></i>',
            '</a>',
            '<div class="dropDownText" id="{cid}_endTime_input">10:30</div>',
            '</div>',
            '</div>',

            '<div id="pnl_lunar" class="pt_10 " style="display: block;">',
            '<input type="checkbox" class="mr_5" id="{cid}_cbx_lunar" name="{cid}_cbx_lunar">',
            '<label for="{cid}_cbx_lunar">农历</label>',
            '</div>',

            '<div class="pt_10 " id="{cid}_allDayBox" style="display: {display};">',
            '<input type="checkbox" class="mr_5" id="{cid}_checkallDay" name="{cid}_checkallDayEvent">',
            '<label for="{cid}_checkallDay">全天事件</label>',
            '<span class="gray">(持续一整天的事项，下发提醒时间以当天上午8点为基准)</span>',
            '</div>',
            '<div class="pt_10 clearfix" id="{cid}_repeatBox" style="display: {display};">',
            '<span class="fl mr_5">',
            '<label for="">重复事件</label>',
            '</span>',
            '<div class="dropDown dropDown-ymtime"  id="{cid}_sendInterval">',
            '<a class="dropDownA" href="javascript:void(0);" name="{cid}_sendIntervalPop" >',
            '<i class="i_triangle_d" name="{cid}_sendIntervalPop"></i>',
            '</a>',
            '<div class="dropDownText" id="{cid}_sendInterval_input"></div>',
            '</div>',
            '<span class="fl ml_5 mr_5" id="{cid}_desc"></span>',
            '</div>',
            '<div class="add-moth-check" id="{cid}_week_wrap" style="display: {display};">',
            '<input type="checkbox" name="{cid}_checkweek_1" id="{cid}_checkweek_1"  class="mr_5">',
            '<label for="{cid}_checkweek_1" class="mr_10">周一</label>',
            '<input type="checkbox"  name="{cid}_checkweek_2" id="{cid}_checkweek_2"  class="mr_5">',
            '<label for="{cid}_checkweek_2" class="mr_10">周二</label>',
            '<input type="checkbox" name="{cid}_checkweek_3" id="{cid}_checkweek_3"  class="mr_5">',
            '<label for="{cid}_checkweek_3" class="mr_10">周三</label>',
            '<input type="checkbox" name="{cid}_checkweek_4" id="{cid}_checkweek_4"  value="" class="mr_5">',
            '<label for="{cid}_checkweek_4" class="mr_10">周四</label>',
            '<input type="checkbox" name="{cid}_checkweek_5" id="{cid}_checkweek_5"   class="mr_5">',
            '<label for="{cid}_checkweek_5" class="mr_10">周五</label>',
            '<input type="checkbox" name="{cid}_checkweek_6" id="{cid}_checkweek_6"  class="mr_5">',
            '<label for="{cid}_checkweek_6" class="mr_10">周六</label>',
            '<input type="checkbox" name="{cid}_checkweek_0" id="{cid}_checkweek_0"  class="mr_5">',
            '<label for="{cid}_checkweek_0" class="mr_10">周日</label>',
            '</div>',
            '<div id="{cid}_ControlReadEl" style="display:none;top: 0px; height:100px; z-index:1000; " class="blackbanner"></div>',
            '</div>'].join("")
    }));
})(jQuery, _, M139, window._top || window.top);
