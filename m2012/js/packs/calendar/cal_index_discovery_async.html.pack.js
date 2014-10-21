//new Calendar({date2StringPattern:'yyyy年MM月dd日',id:'currentDate',year:2013,month:8,callback:function(date){console.log(date);}});
/******************************* **************************************************************
 暴露日历,构建当月所有天的日期,以及下一个月，上一个月，年的选择
 ***********************************************************************************************/
; (function ($, _, M139, top) {

    var CommonAPI = new M2012.Calendar.CommonAPI();
    var CalendarModel = M2012.Calendar.CalendarInfo;
    var $CUtils = M2012.Calendar.CommonAPI.Utils;
    //标签类
    M139.namespace('M2012.Calendar.CalendarView', function (params) {

        var y = params.year, m = params.month, d = params.day;
        this.enableHistday = params.enableHistday ? params.enableHistday : true; //历史天是否可以选择
        if (params.target) {
            this.elInput = params.target; //防止没有唯一ID的情况.直接传入jQuery对象
        } else if (params.id) {
            this.elInput = $("#" + params.id);
        } else {
            throw new Error('create M2012.Calendar.CalendarView error, container is empty.');
        }



        this.callback = params.callback || function () { };
        this.beforeShow = params.beforeShow || function () { };

        this.yearListCount = 10; //年份列表的列表个数
        this.date2StringPattern = params.date2StringPattern || "yyyy年MM月dd";
        this.returnType = params.returnType || 0; //显示类型：0为公历（2010-03-03）,1为农历（农历三月初三）
        this.dateNLStringPattern = { Y: 1, M: 1, D: 1 }; //农历日期的格式化字符串
        this.patternDelimiter = "-";
        this.showSelectDayColor = true;
        this.objCalendarApi = CommonAPI;
        //初始化事件
        this.render();
        this.bindEvent();

    });

    var CalendarView = M2012.Calendar.CalendarView;
    CalendarView.prototype = {
        render: function () {

            var vhtml = ['<div id="__calendarPanel" class="calendarPanel" style="display:none;">',
							'<iframe src="" name="__calendarIframe" id="__calendarIframe" calss="calendarIframe" width="300px" height="300px" scrolling="no" frameborder="0"><\/iframe>',
							'<div id="divCalendarForm" calss="divCalendarForm" style="position:absolute;left:0px;top:0px;" width="300px" height="300px" scrolling="no" ><\/div>',
						'<\/div>'].join("");

            $(vhtml).appendTo(document.body);
        },
        hideAllPop: function (callback) {

            callback && callback();
            this.hide();
        },
        getRealDate: function (control) {

            var val = control.attr('realDate') || new Date();
            return $CUtils.$Date.toDate(val);
        },
        //事件绑定
        bindEvent: function () {
            var _self = this;
            this.elInput.bind('click', function (e) {
                _self.beforeShow(e);
                _self.date = _self.getRealDate(_self.elInput);
                _self.draw(_self.date.getMonth());
                _self.show(_self.elInput);
                $CUtils.$Event.stopBubble();
            });
            this.elInput.bind('keyup', function (e) { $(this).css('color', ''); _self.attr('realDate', ''); return _self.goInputDate(e); });
            $(document).bind('click', function (e) {
                _self.hideAllPop();
            });
        },
        goInputDate: function (evt) {
            var e = getEventObject(evt);
            var element = e.srcElement ? e.srcElement : e.target;
            var k = e.keyCode ? e.keyCode : e.which;
            var result = this.objCalendarApi.checkDateStr(element.value);
            if (result) {
                element.realDate = new Date(result.year, result.month, result.date).format("yyyy-MM-dd");
                _self.draw();
                _self.show(element);
            }
            else {
                element.style.color = 'red';
            }
        },
        draw: function (month) {
            var curCalendar = this;
            var _cs = [];
            _cs[_cs.length] = '<form id="__calendarForm" name="__calendarForm" method="post">';
            _cs[_cs.length] = '<style>';
            _cs[_cs.length] = '/*设置左边距为0  *{margin:0;padding:0}*/';
            _cs[_cs.length] = '/*日历 表格*/  .calendarTable{font-size:12px;} .calendarTable tr{height:25px;} .calendarTable tr th{width:40px;height:30px;margin:0;padding:0}';
            _cs[_cs.length] = '/*日历头*/   .calendarTitle{background-color:#DBDBDB;width:300px;text-align:center;}';
            _cs[_cs.length] = '/*上一年，下一年，上一月，下一月*/ #goPrevYear , #goNextYear, #goPrevMonth  ,#goNextMonth{color:#333;font-size:13px;cursor:pointer;margin-left:10px;text-decoration:underline}';
            _cs[_cs.length] = '/*农历年份*/ #spanNL{color:black;}';
            _cs[_cs.length] = '/*年份选择列表*/ #divYearList{position:absolute;z-index:999999;width:80px;background-color:#dbdbdb;}';
            _cs[_cs.length] = ' #divYearList li{list-style:none; font-weight:normal; width:40px;text-align:center; float:left;cursor:pointer}';
            _cs[_cs.length] = ' #divYearList .divYearListCur{font-weight:bold}';
            _cs[_cs.length] = ' #divYearList .mouseOutLiStyle{font-weight:normal}  #divYearList .mouseOverLiStyle{font-weight:bold}';
            _cs[_cs.length] = '.mouseOutLiStyle{font-weight:normal} .mouseOverLiStyle{font-weight:bold}';
            _cs[_cs.length] = '/*标题栏的年份样式*/   .spanCurYear{border:0px;	width:30px;background-color:#DBDBDB;cursor:pointer;margin-left:10px;text-decoration:underline}';
            _cs[_cs.length] = '/*标题栏的年份选择时的样式*/   .spanCurYearFocus{border:1px;background-color:white;width:30px;margin-left:10px;}';
            _cs[_cs.length] = '/*月份选择列表*/ #divMonthList{position:absolute;font-weight:normal;width:50px;background-color:#dbdbdb;} #divMonthList li{list-style:none;width:25px;float:left;cursor:pointer;} .divMonthListCur{font-weight:bold}';
            _cs[_cs.length] = '/*标题栏的月份样式*/   .spanCurMonth{border:0px;width:15px;background-color:#DBDBDB;cursor:pointer;text-decoration:underline}';
            _cs[_cs.length] = '/*标题栏的月份选择时的样式*/  .spanCurMonthFocus{border:1px;background-color:white;width:15px;}';
            _cs[_cs.length] = '/*下边按钮*/   .footerButton{width:280px;height:20px;white-space:nowrap;font-size:12px;cursor:pointer;color:#333;margin-right:15px}';
            _cs[_cs.length] = '/*时间小于当天时的样式*/   .histdayStyle{background-color:#CCCCCC;}';
            _cs[_cs.length] = '/*当天样式 */   .todayStyle{background-color:#ffc;margin:0;padding:0}';
            _cs[_cs.length] = '/*当前样式 */   .currStyle{background-color:#fcc;margin:0;padding:0}';
            _cs[_cs.length] = '/*鼠标移上去的样式*/   .mouseOverStyle{background-color:#e8e8e8;text-align:center;color:#FFF;cursor:pointer;margin:0;padding:0}';
            _cs[_cs.length] = '/*鼠标移出的样式*/  .mouseOutStyle{background-color:#fff;padding:0px;margin:0px;}';
            _cs[_cs.length] = '/*选择天的样式*/   .selectedDayStyle{background-color:#e8e8e8;padding:0px;margin:0px;}';
            _cs[_cs.length] = '/*空白日期的样式*/   .blankStyle{background-color:#fff;font-size:10px;padding:0px;margin:0px;}';
            _cs[_cs.length] = ' .week{height:20px;}  .week th{height:20px;padding:0px;margin:0px; background:#fff; border-bottom:1px solid #ccc}.calendarTable td div{ color:#666}.calendarTable td b{ caption-side:#333; font-size:14px}';
            _cs[_cs.length] = '<\/style>';
            _cs[_cs.length] = '<table id="__calendarTable" class="calendarTable" width="300px"  border="0" cellpadding="3" cellspacing="1" align="center">';
            _cs[_cs.length] = '<tr>';
            _cs[_cs.length] = '<th colspan="9" class="calendarTitle" align="center" >';
            _cs[_cs.length] = '<div style="white-space:nowrap;align:center;width:290px;"><span id="goPrevYear" name="goPrevYear" title="上一年" >&lt;&lt;<\/span><span name="goPrevMonth" title="上一月" id="goPrevMonth" >&lt;<\/span>';
            _cs[_cs.length] = '<span id="spanCurYear" class="spanCurYear" title="点击选择年份"><\/span>年';
            _cs[_cs.length] = '<span><ul id="divYearList" style="display:none;">';
            _cs[_cs.length] = '<\/ul><\/span>';
            //月份列表
            _cs[_cs.length] = '<span id="spanCurMonth" class="spanCurMonth" title="点击选择月份"><\/span>月';
            _cs[_cs.length] = '<span><ul id="divMonthList" style="display:none">';
            for (var i = 1; i <= 12; i++) {
                if (i < 10)
                    _cs[_cs.length] = '<li id="monthLi'
                            + String(i)
                            + '" onmouseover="if(this.className!=\'divMonthListCur\') this.className=\'mouseOverLiStyle\';" onmouseout="if(this.className!=\'divMonthListCur\')this.className=\'mouseOutLiStyle\';">0'
                            + String(i) + '<\/li>';
                else
                    _cs[_cs.length] = '<li id="monthLi'
                            + String(i)
                            + '" onmouseover="if(this.className!=\'divMonthListCur\') this.className=\'mouseOverLiStyle\';" onmouseout="if(this.className!=\'divMonthListCur\')this.className=\'mouseOutLiStyle\';">'
                            + String(i) + '<\/li>';
            }
            _cs[_cs.length] = '<\/ul></span>';
            _cs[_cs.length] = '&nbsp;&nbsp;<span id="spanNL"><\/span>';
            _cs[_cs.length] = '<span name="goNextMonth" title="下一月" id="goNextMonth">&gt;<\/span><span name="goNextYear"  title="下一年" id="goNextYear"  >&gt;&gt;<\/span></div><\/th>';
            _cs[_cs.length] = '<\/tr>';
            _cs[_cs.length] = '<tr style="display:none"><th colspan="7"><select name="yearSelect" id="yearSelect"><\/select><select name="monthSelect" id="monthSelect"><\/select><\/th><\/tr>'
            _cs[_cs.length] = '<tr style="height:25px;" class="week">';
            for (var i = 0; i < 7; i++) {
                _cs[_cs.length] = '<th style="height:25px;">';
                _cs[_cs.length] = CommonAPI.nStr1[i];
                _cs[_cs.length] = '<\/th>';
            }
            _cs[_cs.length] = '<\/tr>';
            for (var i = 0; i < 6; i++) {
                _cs[_cs.length] = '<tr align="center">';
                for (var j = 0; j < 7; j++) {
                    _cs[_cs.length] = '<td style="height:36px;">&nbsp;<\/td>';
                }
                _cs[_cs.length] = '<\/tr>';
            }
            _cs[_cs.length] = ' <tr>';
            _cs[_cs.length] = '  <th colspan="7" align="right" style="height:20px;"><div name="selectTodayButton" id="selectTodayButton" class="footerButton" title="跳转到今天">[ 今天 ]<\/div><\/th>';
            _cs[_cs.length] = ' <\/tr>';
            _cs[_cs.length] = '<\/table>';
            _cs[_cs.length] = '<\/form>';
            this.iframe = window;
            this.form = document.getElementById("__calendarForm");
            this.panel = document.getElementById("__calendarPanel");
            document.getElementById("divCalendarForm").innerHTML = _cs.join("");
            document.getElementById("divCalendarForm").onclick = function () {
                try {
                    curCalendar.hideYearsTable();
                    curCalendar.hideMonthsTable();
                } catch (e) {
                }
                $CUtils.$Event.stopEvent();
            }
            var month = curCalendar.date.getMonth();
            if (month < 9)
                this.iframe.document.getElementById("spanCurMonth").innerHTML = "0"
                        + String(month + 1);
            else
                this.iframe.document.getElementById("spanCurMonth").innerHTML = String(month
                        + 1);
            //添加相关事件
            for (var i = 1; i <= 12; i++) {
                this.iframe.document.getElementById('monthLi' + String(i)).onclick = function () {
                    curCalendar.selectMonth(this);
                }
            }

            var doc = this.iframe.document;
            doc.getElementById('spanCurYear').onclick = function () {
                curCalendar.showYearsTable(this);
                $CUtils.$Event.stopEvent();
            }
            doc.getElementById('spanCurMonth').onclick = function () {
                curCalendar.showMonthsTable(this);
                $CUtils.$Event.stopEvent();
            }
            doc.getElementById('goPrevYear').onclick = function () {
                curCalendar.goPrevYear(this);
            }
            doc.getElementById('goNextYear').onclick = function () {
                curCalendar.goNextYear(this);
            }
            doc.getElementById('goPrevMonth').onclick = function () {
                curCalendar.goPrevMonth(this);
            }
            doc.getElementById('goNextMonth').onclick = function () {
                curCalendar.goNextMonth(this);
            }
            doc.getElementById('yearSelect').onchange = function () {
                curCalendar.update(this);
            }
            doc.getElementById('monthSelect').onchange = function () {
                curCalendar.update(this);
            }
            document.getElementById("__calendarPanel").onclick = function () {
                curCalendar.hideYearsTable(this);
                curCalendar.hideMonthsTable(this);
                $CUtils.$Event.stopEvent();
            }
            doc.getElementById('selectTodayButton').onclick = function () {
                curCalendar.goToday(this);
            }

        },
        showYearsTable: function (e) {
            this.hideMonthsTable();
            var divYears = this.iframe.document.getElementById('divYearList');
            var xy = this.getAbsPoint(e);
            divYears.style.left = "70px";
            divYears.style.top = "19px";
            e.className = "spanCurYearFocus";
            divYears.style.display = "";
            this.showFlag = true;
        },
        goToday: function () {
            this.date = new Date();
            this.changeSelect();
            this.bindData();
        },
        showMonthsTable: function (e) {
            this.hideYearsTable();
            var divMonths = this.iframe.document.getElementById('divMonthList');
            var xy = this.getAbsPoint(e);
            divMonths.style.left = "110px";
            divMonths.style.top = "19px";
            e.className = "spanCurMonthFocus";
            divMonths.style.display = "";
            this.showFlag = true;
            this.day = "-";

        },
        hideMonthsTable: function () {
            this.iframe.document.getElementById('divMonthList').style.display = "none";
            this.iframe.document.getElementById('spanCurMonth').className = "spanCurMonth";
        },
        goPrevYear: function () {
            if (this.year <= this.beginYear) {
                return;
            }
            this.year--;
            this.date = new Date(this.year, this.month, 1);
            this.changeSelect();
            this.bindData();

        },
        goNextYear: function () {
            if (this.year >= this.endYear - 1) {
                return;
            }
            this.year++;
            this.date = new Date(this.year, this.month, 1);
            this.changeSelect();
            this.bindData();
        },
        goPrevMonth: function () {
            if (this.year <= this.beginYear && this.month < 1) {
                return false;
            }
            if (this.month == 0) {
                this.year--;
                this.month = 11;
            } else
                this.month--;
            this.date = new Date(this.year, this.month, 1);

            this.changeSelect();
            this.bindData();
        },
        update: function () {
            this.date = new Date(this.year, this.month, 1);
            this.startYearList = parseInt(this.year / this.yearListCount)
                    * this.yearListCount;
            this.changeSelect();
            this.bindData();
        },
        goNextMonth: function () {
            if (this.year >= (this.endYear - 1) && this.month == 11) {
                return;
            }
            if (this.month == 11) {
                this.year++;
                this.month = 0;
            } else
                this.month++;
            this.date = new Date(this.year, this.month, 1);
            this.changeSelect();
            this.bindData();
        },
        goPrevYearPage: function () {
            this.showFlag = true;
            if (this.startYearList <= this.beginYear) return false;
            if (this.startYearList - this.yearListCount < this.beginYear)
                this.startYearList = this.beginYear;
            else
                this.startYearList -= this.yearListCount;
            this.year = this.startYearList;
            this.date = new Date(this.year, this.month, 1);
            this.changeSelect();
            $CUtils.$Event.stopEvent();
        },
        goNextYearPage: function () {
            this.showFlag = true;
            if (this.startYearList >= this.endYear - this.yearListCount) return false;
            this.startYearList += this.yearListCount;
            this.year = this.startYearList;
            this.date = new Date(this.year, this.month, 1);
            this.changeSelect();
            $CUtils.$Event.stopEvent();
        },
        changeSelect: function () {
            var spanCurYear = this.iframe.document.getElementById('spanCurYear');
            var spanCurMonth = this.iframe.document.getElementById('spanCurMonth');
            spanCurYear.innerHTML = this.date.getFullYear();
            var showMonth = this.date.getMonth() + 1;
            spanCurMonth.innerHTML = showMonth > 9
                    ? (String(showMonth))
                    : ('0' + showMonth);
            var beginYear = this.startYearList;
            this.changeStartYearList();
            //绑定年份列表，判断结束年份
            var endYear = beginYear + this.yearListCount;
            if (beginYear + this.yearListCount > this.endYear) {
                endYear = this.endYear;
            }
            for (var i = beginYear; i < endYear; i++) {
                if (this.iframe.document.getElementById('yearLi' + String(i))) {
                    if (this.date.getFullYear() == i)
                        this.iframe.document.getElementById('yearLi' + String(i)).className = "divYearListCur";
                    else
                        this.iframe.document.getElementById('yearLi' + String(i)).className = "";
                }
            }
            //绑定月份列表
            for (var i = 1; i <= 12; i++) {
                if (this.iframe.document.getElementById('monthLi' + String(i))) {
                    if (this.date.getMonth() == i - 1)
                        this.iframe.document.getElementById('monthLi' + String(i)).className = "divMonthListCur";
                    else
                        this.iframe.document.getElementById('monthLi' + String(i)).className = "";
                }
            }
        },
        hideYearsTable: function () {
            this.iframe.document.getElementById('divYearList').style.display = "none";
            this.iframe.document.getElementById('spanCurYear').className = "spanCurYear";
        },
        getIsGTcurrentTime: function (today, date, day) {
            var flag = false;
            var gtYear = date.getFullYear() > today.getFullYear();//年大于本身
            var eqY = date.getFullYear() == today.getFullYear();
            var eqYgtMonth = eqY && date.getMonth() > today.getMonth();//月大于本身
            var eqYeqMgtDate = eqY && date.getMonth() == today.getMonth() && date > today.getDate();
            if (gtYear || eqYgtMonth || eqYeqMgtDate) {
                flag = true;
            }
            return flag;
        },
        hide: function () {
            this.panel && (this.panel.style.display = "none");
        },
        show: function (dateControl) {
            if (this.panel.style.display != "none") {
                this.panel.style.display = "none";
            }
            if (!dateControl) {
                throw new Error("arguments[0] is necessary!")
            }
            this.dateControl = dateControl;
            popuControl = dateControl;
            this.popuControl = popuControl;
            var realDate = dateControl.attr('realDate');
            if (dateControl.length > 0 && typeof (dateControl.val()) != "undefined") {
                if (realDate)
                    this.date = new Date($CUtils.$Date.toDate(realDate,
                            this.patternDelimiter, this.string2DatePattern));
                else
                    this.date = new Date($CUtils.$Date.toDate(dateControl.val(),
                            this.patternDelimiter, this.string2DatePattern));
                if (!this.date.getFullYear()) {
                    this.date = new Date();
                } //当输入内容错误时，默认当前日期
                this.year = this.date.getFullYear();
                this.month = this.date.getMonth();
            } else {
                this.year = this.date.getFullYear();
                this.month = this.date.getMonth();
            }
            this.changeSelect();
            this.bindData();
            this.setPosition();

        },
        getInputControlVal: function (dateControl) {

            var value = $Date.format("yyyy-MM-dd", this.date);;//dateControl.value.replace(/年|月|日/g, '-').replace(/-$/, "");

            return value;

        },
        bindData: function () {
            var calendar = this;
            var dateArray = this.getMonthViewDateArray(this.date.getFullYear(),
                    this.date.getMonth());
            var tds = $("#divCalendarForm td");

            var oCal = new CalendarModel(this.date.getFullYear(), this.date.getMonth(),
                    this.date.getDate(), this.callback, this.params);

            this.iframe.document.getElementById('spanNL').innerHTML = oCal.CY
                    + "年[ "
                    + String(CommonAPI.Animals[(this.date.getFullYear() - 4) % 12])
                    + "年]";
            this.startYearList = parseInt(this.date.getFullYear()
                    / this.yearListCount)
                    * this.yearListCount; //年份翻页的开始年份
            var today = new Date();
            var inputStrDate = this.getInputControlVal(calendar.dateControl);
            for (var i = 0; i < tds.length; i++) {

                tds[i].onclick = null;
                tds[i].onmouseover = null;
                tds[i].onmouseout = null;
                tds[i].title = "";
                tds[i].id = this.date.getFullYear() + "-"
                        + (this.date.getMonth() + 1) + "-" + dateArray[i];
                tds[i].innerHTML = "&nbsp;";
                tds[i].day = dateArray[i] || "";

                if (dateArray[i] && parseInt(tds[i].day) > 0) {
                    //设置显示文本
                    var trDate = $CUtils.$Date.toDate(tds[i].id, "-");

                    var festival = '';
                    if (oCal.showNL)//是否需要显示农历
                    {
                        //只能年份在1901至2049时才显示农历   
                        if (this.year > 1900 && this.year < 2050) {
                            var index = parseInt(tds[i].day) - 1;

                            if (oCal[dateArray[i] - 1]) {
                                var isLeapStr = oCal[dateArray[i] - 1].isLeap == true
                                        ? "闰"
                                        : "";
                                if (oCal[index].solarTerms == ''
                                        && oCal[index].solarFestival == ''
                                        && oCal[index].lunarFestival == '')
                                    festival = '';
                                else {
                                    festival = oCal[index].solarTerms;
                                    if (oCal[index].solarFestival != '')
                                        festival = festival
                                                + oCal[index].solarFestival;
                                    if (this.objCalendarApi
                                            .trim(oCal[index].lunarFestival) != '')
                                        festival = festival
                                                + oCal[index].lunarFestival;
                                }
                                if (festival.length > 4) {
                                    tds[i].innerHTML = '<div>' + tds[i].day
                                            + "</div><div>" + festival.substr(0, 2)
                                            + '..</div>';
                                    if (!oCal.showInfo)
                                        tds[i].title = festival;
                                } else {
                                    if (festival == '') //判断农历节气是否为空，不为空则显示节气信息，否则显示农历
                                    {
                                        if (oCal[index].lDay == 1)
                                            tds[i].innerHTML = "<div>"
                                                    + tds[i].day
                                                    + "</div><div>"
                                                    + oCal[index].lMonth
                                                    + '月'
                                                    + (this.objCalendarApi
                                                            .monthDays(
                                                                    oCal[index].lYear,
                                                                    oCal[index].lMonth) == 29
                                                            ? '小'
                                                            : '大' + "</label>");
                                        else
                                            tds[i].innerHTML = "<div>"
                                                    + tds[i].day
                                                    + "</div><div>"
                                                    + this.objCalendarApi
                                                            .cDay(oCal[dateArray[i]
                                                                    - 1].lDay)
                                                    + "</div>";

                                        if (!oCal.showInfo)
                                            tds[i].title = "农历"
                                                    + isLeapStr
                                                    + ((CommonAPI.nStr1[oCal[dateArray[i]
                                                            - 1].lMonth] + "月") == "一月"
                                                            ? "正月"
                                                            : (CommonAPI.nStr1[oCal[dateArray[i]
                                                                    - 1].lMonth] + "月"))
                                                    + this.objCalendarApi
                                                            .cDay(oCal[dateArray[i]
                                                                    - 1].lDay);
                                    } else {
                                        tds[i].innerHTML = "<div>" + tds[i].day
                                                + "</div><div>" + festival
                                                + "</div>";
                                        if (!oCal.showInfo)
                                            tds[i].title = festival;
                                    }
                                }
                                tds[i].nlValue = ""; //返回显示的农历日期
                                tds[i].realNlDate = ''; //实际农历日期，用数字表示
                                if (oCal.dateNLStringPattern.Y != undefined
                                        && oCal.dateNLStringPattern.Y == 1) {
                                    tds[i].nlValue += String(oCal[dateArray[i] - 1].lYear)
                                            + "年";
                                    tds[i].realNlDate = String(oCal[dateArray[i]
                                            - 1].lYear);
                                }
                                if (oCal.dateNLStringPattern.M != undefined
                                        && oCal.dateNLStringPattern.M == 1) {
                                    var nlMonth = CommonAPI.nStr1[oCal[dateArray[i]
                                            - 1].lMonth]
                                            + "月";
                                    if (nlMonth == "一月")
                                        nlMonth = "正月";
                                    tds[i].nlValue += isLeapStr + nlMonth;
                                    tds[i].realNlDate += oCal[dateArray[i] - 1].lMonth < 10
                                            ? ("0" + oCal[dateArray[i] - 1].lMonth)
                                            : String(oCal[dateArray[i] - 1].lMonth);
                                }
                                if (oCal.dateNLStringPattern.D != undefined
                                        && oCal.dateNLStringPattern.D == 1) {
                                    tds[i].nlValue += this.objCalendarApi
                                            .cDay(oCal[dateArray[i] - 1].lDay);
                                    tds[i].realNlDate += oCal[dateArray[i] - 1].lDay < 10
                                            ? ("0" + oCal[dateArray[i] - 1].lDay)
                                            : String(oCal[dateArray[i] - 1].lDay);
                                }
                                if (tds[i].realNlDate.length > 0
                                        && oCal[dateArray[i] - 1].isLeap == true)//闰月,在后边加*标识
                                    tds[i].realNlDate += "*";
                            }
                        } else {
                            tds[i].innerHTML = tds[i].day;
                        }
                    } else {
                        tds[i].innerHTML = tds[i].day;
                        tds[i].title = String(calendar.date.getFullYear())
                                + calendar.patternDelimiter
                                + String(calendar.date.getMonth() + 1)
                                + calendar.patternDelimiter + String(tds[i].day);
                    }

                    var flag = this.getIsGTcurrentTime(today, calendar.date,
                            dateArray[i]);


                    //如果历史日期设置为不可选择，则只有时间大于等于当天时间才添加选择事件
                    if (flag || oCal.enableHistday) {
                        if (calendar.date.getFullYear() == today.getFullYear()
                                && calendar.date.getMonth() == today.getMonth()
                                && today.getDate() == dateArray[i]) {
                            tds[i].className = "todayStyle";
                            this.nlToday = tds[i].nlValue; //保存当天的农历
                            this.realNlToday = tds[i].realNlDate; //保存当天的农历
                        } else {
                            tds[i].className = "mouseOutStyle";

                        }

                        tds[i].onclick = function () {
                            if (calendar.dateControl) {
                                calendar.day = this.firstChild.innerText;
                                calendar.date = new Date(calendar.date
                                                .getFullYear(), calendar.date
                                                .getMonth(),
                                        $(this.firstChild).text());
                                var realDate = $Date.format("yyyy-MM-dd", calendar.date);
                                calendar.dateControl.attr('realDate', realDate);
                                if (calendar.returnType != 0) {//显示农历,返回农历显示及农历数字表示 
                                    calendar.dateControl.value = this.nlValue;
                                    calendar.dateControl.realNlDate = this.realNlDate;
                                } else {
                                    calendar.dateControl.value = $Date.format(calendar.date2StringPattern, calendar.date);
                                }
                            }
                            calendar.hide();
                            calendar.dateControl.css('color', "");
                            if (typeof (calendar.callback) == "function") {
                                calendar.callback(calendar.date, CommonAPI.createDateObj(calendar.date)); //调用回调方法
                            }
                        }
                    } else {
                        tds[i].className = "histdayStyle";
                    }
                    var dateStr =
                            $CUtils.$Date.toString(new Date(calendar.date.getFullYear(),
                            calendar.date.getMonth(), tds[i].day), "yyyy-MM-dd");

                    if (inputStrDate == dateStr
                            || calendar.dateControl.attr('realDate') == dateStr) {
                        if (calendar.showSelectDayColor == true)
                            tds[i].className = "selectedDayStyle";
                    }
                    //单元格的鼠标移入事件
                    tds[i].onmouseover = function () {
                        this.className = 'mouseOverStyle';
                    };
                    //单元格的鼠标移出事件
                    tds[i].onmouseout = function () {
                        var today = new Date();
                        //当天样式
                        if (today.getFullYear() == calendar.date.getFullYear()
                                && today.getMonth() == calendar.date.getMonth()
                                && today.getDate() == parseInt(this.day)) {
                            this.className = "todayStyle";
                        } else {
                            var dateStr = $Date.format("yyyy-MM-dd", new Date(calendar.date
                                            .getFullYear(), calendar.date
                                            .getMonth(), this.day));
                            if (calendar.dateControl.value == dateStr
                                    || calendar.dateControl.attr('realDate') == dateStr) {

                                this.className = calendar.showSelectDayColor == true
                                        ? "selectedDayStyle"
                                        : "mouseOutStyle";
                            } else if (oCal.enableHistday
                                    || (calendar.date.getFullYear() > today
                                            .getFullYear()
                                            || (calendar.date.getFullYear() == today
                                                    .getFullYear() && calendar.date
                                                    .getMonth() > today.getMonth()) || (calendar.date
                                            .getFullYear() == today.getFullYear()
                                            && calendar.date.getMonth() == today
                                                    .getMonth() && parseInt(this.day) >= today
                                            .getDate()))) {
                                this.className = "mouseOutStyle";
                            } else {
                                this.className = "histdayStyle";
                            }
                        }
                    }
                } else {
                    tds[i].className = "blankStyle";
                }
            }
        },
        changeStartYearList: function () {
            var curCalendar = this;
            //年份列表
            var beginYear = parseInt(this.date.getFullYear() / this.yearListCount)
                    * this.yearListCount;
            //年份列表小于开始年份
            if (beginYear < this.beginYear) {
                beginYear = this.beginYear;
            }
            var endYear = beginYear + this.yearListCount;
            //年份列表不能大于结束年份
            if (endYear > this.endYear) {
                endYear = this.endYear;
            }
            var yearsList = this.iframe.document.getElementById('divYearList');
            yearsList.innerHTML = "";

            for (var i = beginYear; i < endYear; i++) {
                yearsList.innerHTML += '<li id="yearLi'
                        + String(i)
                        + '"  onmouseover="if(this.className!=\'divYearListCur\') this.className=\'mouseOverLiStyle\';" onmouseout="if(this.className!=\'divYearListCur\')this.className=\'mouseOutLiStyle\';">'
                        + String(i) + '</li>';
            }
            yearsList.innerHTML += '<li id="goPrevYearPage" title="上一页" >&lt;&lt;&nbsp;</li><li id="goNextYearPage" title="下一页">&nbsp;&gt;&gt;</li>';
            //年份下拉列表事件
            for (var i = beginYear; i < endYear; i++) {
                this.iframe.document.getElementById('yearLi' + String(i)).onclick = function () {
                    curCalendar.selectYear(this);
                }
                if (this.date.getFullYear() == i) {
                    this.iframe.document.getElementById('yearLi' + String(i)).className = "divYearListCur";
                } else {
                    this.iframe.document.getElementById('yearLi' + String(i)).className = "mouseOutLiStyle";
                }
            }
            //年份翻页事件
            this.iframe.document.getElementById('goPrevYearPage').onclick = function () {
                curCalendar.goPrevYearPage(this);
            }
            this.iframe.document.getElementById('goNextYearPage').onclick = function () {
                curCalendar.goNextYearPage(this);
            }
        },
        getMonthViewDateArray: function (y, m) {
            var dateArray = new Array(42);
            var dayOfFirstDate = new Date(y, m, 1).getDay();
            var dateCountOfMonth = new Date(y, m + 1, 0).getDate();
            for (var i = 0; i < dateCountOfMonth; i++) {
                dateArray[i + dayOfFirstDate] = i + 1;
            }
            return dateArray;
        },
        selectYear: function (e) {
            this.year = parseInt(e.innerHTML);
            this.hideYearsTable();
            this.changeSelect();
            this.update(e);
        },
        selectMonth: function (e) {
            this.month = parseInt(e.innerHTML - 1);
            this.hideMonthsTable();
            this.changeSelect();
            this.update(e);

        },
        setPosition: function () {
            var offset = $(this.dateControl).offset();
            this.panel.style.top = offset.top + $(this.dateControl).height() + 1
                    + "px";
            this.panel.style.left = offset.left + "px";
            this.panel.style.display = "";
        },
        getAbsPoint: function (e) {
            var x = e.offsetLeft;
            var y = e.offsetTop;
            while (e = e.offsetParent) {
                x += e.offsetLeft;
                y += e.offsetTop;
            }
            return {
                "x": x,
                "y": y
            };
        }
    }


})(jQuery, _, M139, window._top || window.top);



﻿
; (function (jQuery, _, M139, top) {
    var className = "M2012.Calendar.Popup.BabyTemplet.Model";
    M139.namespace(className, Backbone.Model.extend({
        defaults:{
            defautParam: {
                comeFrom: 0,
                calendarType: 10,
                beforeType: 2, //天 <=== 这个不会动
                labelId: 10,
                color: "#319eff",
                enable: 1,
                recEmail: (top.$User.getDefaultSender() || ""), //补充接收邮箱
                sendInterval: 0,
                week: "0000000",
                specialType: 2,
                inviteInfo: []
            },
            listData: [
                {
                    index:1,
                    afterDays: 0,
                    afterMonths: 0,
                    afterYears: 0,
                    timeTip: '出生24小时',
                    title: "注射乙型肝炎疫苗第一针，预防乙型病毒性肝炎; 注射卡介苗，预防结核病",
                    desc: ['<li><i class="i-point"></i>注射乙型肝炎疫苗第一针，预防乙型病毒性肝炎</li>',
 						   '<li><i class="i-point"></i>注射卡介苗，预防结核病</li>'].join('')
                },
                {
                    index: 2,
                    afterDays: 0,
                    afterMonths: 1,
                    afterYears: 0,
                    timeTip: '宝宝1个月大',
                    title: "注射乙型肝炎疫苗第二针，预防乙型病毒性肝炎",
                    desc: '<li><i class="i-point"></i>注射乙型肝炎疫苗第二针，预防乙型病毒性肝炎</li>'
                },
                {
                    index: 3,
                    afterDays: 0,
                    afterMonths: 2,
                    afterYears: 0,
                    timeTip: '宝宝2个月大',
                    title: "口服脊髓灰质炎糖丸第一粒，预防脊髓灰质炎（小儿麻痹症）",
                    desc: '<li><i class="i-point"></i>口服脊髓灰质炎糖丸第一粒，预防脊髓灰质炎（小儿麻痹症）</li>'
                },
                {
                    index: 4,
                    afterDays: 0,
                    afterMonths: 3,
                    afterYears: 0,
                    timeTip: '宝宝3个月大',
                    title: "卡介苗复查，检查卡介苗接种效果; 口服脊髓灰质炎糖丸第二粒，预防脊髓灰质炎（小儿麻痹症）; 注射百白破疫苗第一针，预防百日咳、白喉、破伤风",
                    desc: ['<li><i class="i-point"></i>卡介苗复查，检查卡介苗接种效果</li>',
 						   '<li><i class="i-point"></i>口服脊髓灰质炎糖丸第二粒，预防脊髓灰质炎（小儿麻痹症）</li>',
                           '<li><i class="i-point"></i>注射百白破疫苗第一针，预防百日咳、白喉、破伤风</li>'].join('')
                },
                {
                    index: 5,
                    afterDays: 0,
                    afterMonths: 4,
                    afterYears: 0,
                    timeTip: '宝宝4个月大',
                    title: "口服脊髓灰质炎糖丸第三粒，预防脊髓灰质炎（小儿麻痹症）; 注射百白破疫苗第二针，预防百日咳、白喉、破伤风",
                    desc: ['<li><i class="i-point"></i>口服脊髓灰质炎糖丸第三粒，预防脊髓灰质炎（小儿麻痹症）</li>',
 						   '<li><i class="i-point"></i>注射百白破疫苗第二针，预防百日咳、白喉、破伤风</li>'].join('')
                },
                {
                    index: 6,
                    afterDays: 0,
                    afterMonths: 5,
                    afterYears: 0,
                    timeTip: '宝宝5个月大',
                    title: "注射百白破疫苗第三针，预防百日咳、白喉、破伤风",
                    desc: '<li><i class="i-point"></i>注射百白破疫苗第三针，预防百日咳、白喉、破伤风</li>'
                },
                {
                    index:7,
                    afterDays: 0,
                    afterMonths: 6,
                    afterYears: 0,
                    timeTip: '宝宝6个月大',
                    title: "注射乙型肝炎疫苗第三针，预防乙型病毒性型肝炎",
                    desc: '<li><i class="i-point"></i>注射乙型肝炎疫苗第三针，预防乙型病毒性型肝炎</li>'
                },
                {
                    index: 8,
                    afterDays: 0,
                    afterMonths: 8,
                    afterYears: 0,
                    timeTip: '宝宝8个月大',
                    title: "注射麻疹疫苗，预防麻疹",
                    desc: '<li><i class="i-point"></i>注射麻疹疫苗，预防麻疹</li>'
                },
                {
                    index: 9,
                    afterDays: 0,
                    afterMonths: 6,
                    afterYears: 1,
                    timeTip: '宝宝1岁半至2岁',
                    title: "注射百白破疫苗加强针，预防百日咳、白喉、破伤风; 口服脊髓灰质炎加强糖丸，预防小儿麻痹症",
                    desc: ['<li><i class="i-point"></i>注射百白破疫苗加强针，预防百日咳、白喉、破伤风</li>',
 						   '<li><i class="i-point"></i>口服脊髓灰质炎加强糖丸，预防小儿麻痹症</li>'].join('')
                },
                {
                    index: 10,
                    afterDays: 0,
                    afterMonths: 0,
                    afterYears: 4,
                    timeTip: '宝宝4岁',
                    title: "口服脊髓灰质炎加强糖丸，预防小儿麻痹症",
                    desc: '<li><i class="i-point"></i>口服脊髓灰质炎加强糖丸，预防小儿麻痹症</li>'
                },
                {
                    index: 11,
                    afterDays: 0,
                    afterMonths: 0,
                    afterYears: 7,
                    timeTip: '宝宝7岁',
                    title: "注射麻疹疫苗加强针，预防麻疹; 注射白破二联疫苗加强针，预防白喉、破伤风",
                    desc: ['<li><i class="i-point"></i>注射麻疹疫苗加强针，预防麻疹</li>',
 						   '<li><i class="i-point"></i>注射白破二联疫苗加强针，预防白喉、破伤风</li>'].join('')
                }
            ]
        },
        initialize: function (options) {
            //this.callAPI = M2012.Calendar.CalendarView.callAPI;
            this.master = options.master;
            this.set({
                //默认选项
                validImg: '',
                beforeTime: 1, //提前一天
                recMyEmail: 0,
                recMySms: 1
            });
        },
        request: function (fnName, data, fnSuccess, fnError) {
            var _this = this;
            data = $.extend(data, _this.get("defautParam"));
/**
            this.callAPI(funcName, data,
                function (response, json) { //success
                    if (typeof callback == 'function') {
                        callback(response);
                    }
                }, function (code, json) { //onfail, eg. code or resultcode incorrect
                    _this.trigger("onfail");
                    if (typeof onfail == 'function') {
                        onfail(json);
                    }
                }, function () { //onfail, eg. response is null or empty
                    _this.trigger("onerror");
                    if (typeof onerror == 'function') {
                        onerror();
                    }
                });*/
            //获得主控API实例
            this.master.trigger(this.master.EVENTS.REQUIRE_API, {
                success: function (api) {
                    if (api[fnName] && typeof api[fnName] === 'function'){
                        api[fnName]({
                            data : data,
                            success : function(detail, text) {
                                fnSuccess && fnSuccess(detail, text);
                            },
                            error : function (detail) {
                                fnError && fnError(detail);
                            }
                        });
                    }
                }
            });
        },
        batchAddCalendar: function (params,onsuccess,onerror) {
            this.request("batchAddCalendar", params, onsuccess, onerror);
        },
        addBabyData: function (onsuccess, onfail, onerror) {
            var _this = this;

            //拼接自定义参数
            var params = {
                beforeTime: _this.get("beforeTime"),
                recMyEmail: _this.get("recMyEmail"),
                recMySms: _this.get("recMySms"),
                validImg: _this.get("validImg")
            };
            var babyName = _this.get("name");

            var extInfos = [];
            var selectItems = _this.get("items");
            $.each(selectItems, function (i, item) {
                var dateStr = M139.Date.format("yyyy-MM-dd", item.nextDate);
                extInfos.push({
                    title: item.title,
                    site: '',
                    content: babyName,
                    dateDesc: '',
                    dateFlag: dateStr,
                    endDateFlag: dateStr,
                    startTime: "0800",
                    endTime: "1000"
                })
            });

            params = $.extend(params, { extInfos: extInfos });
            //end

            _this.batchAddCalendar(params, onsuccess, onfail, onerror);
        }
    }));
})(jQuery, _, M139, window._top || window.top);
﻿

(function (jQuery, _, M139, top) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;

    //#region MainView
    M139.namespace('M2012.Calendar.Popup.BabyTemplet.View', superClass.extend({
        configData:{
            SUCC_TIP:"添加成功"
        },
        /**
         * 宝宝防疫模板
         * @example
         * new M2012.Calendar.Popup.BabyTemplet.View();
         *
         *
         */
        initialize: function (options) {
            var _this = this;
            options = $.extend({}, options);
            _this.options = options;
            _this.model = new M2012.Calendar.Popup.BabyTemplet.Model(options);

            _this.render();
            _this.initEvents();
        },
        render: function () {
            var _this=this;
            var step1 = new M2012.Calendar.Popup.BabyTemplet.Step1.View({
                callback: function (data) { _this.step1Callback(data); }
            });
        },
        initEvents: function () {
            var _this = this;
            var model = this.model;

            model.on("change:step2", function () {
                new M2012.Calendar.Popup.BabyTemplet.Step2.View({
                    model: model,
                    callback: function (data) { _this.step2Callback(data); }
                });
            });
        },
        step1Callback: function (data) {
            var _this = this;
            var model = _this.model;
            if (data) {
                model.set("name", data.name);
                model.set("birthday", data.birthday);
                model.trigger("change:step2");
            }
        },
        step2Callback: function (data) {
            var _this = this;
            top.M139.UI.TipMessage.show(_this.configData.SUCC_TIP, { delay: 3000 });

            //TODO 迟早会在四大视图加上去的
            //M139.Calendar.trigger("reload");
        }
    }));
    //#endregion

    //#region Step1View
    M139.namespace('M2012.Calendar.Popup.BabyTemplet.Step1.View', superClass.extend({
        template: {
            MAIN: ['<div class="repeattips-box">',
 					    '<p class="lightGray pt_20">0-7岁宝宝防疫接种提醒 , 帮您呵护宝宝健康成长...</p>',
 					    '<div class="pt_10 repeattips-bottom clearfix">',
                            '<span>宝宝姓名：</span>',
                            '<div class="fl">',
                                '<div id="{cid}_nameTip" class="tips meet-tips hide">',
                                    '<div class="tips-text">宝宝姓名不能为空</div>',
                                    '<div class="tipsBottom diamond"></div>',
                                '</div>',
                                '<div id="{cid}_maxTip" class="tips meet-tips hide">',
                                    '<div class="tips-text">宝宝姓名不能超过{maxTitleLen}个字</div>',
                                    '<div class="tipsBottom diamond"></div>',
                                '</div>',
                                '<input id="{cid}_name" type="text" name="" class="iText w228" />',
                            '</div>',
                        '</div>',
 					    '<div class="pt_10 repeattips-bottom clearfix">',
                            '<span>出生日期：</span>',
                            '<div id="{cid}_datepicker" class="dropDown w238">',
                                '<a class="dropDownA" href="javascript:void(0);"><i class="i_triangle_d"></i></a>',
                                '<div id="{cid}_dateTip" class="tips meet-tips hide">',
                                    '<div class="tips-text">宝宝防疫，只适合提供给1-7岁的宝宝做参考，您的宝宝已超过该岁数范围，请重新设置</div>',
                                    '<div class="tipsBottom diamond"></div>',
                                '</div>',
                                '<div id="{cid}_birthday" class="dropDownText">2014-1-31</div>',
                            '</div>',
                        '</div>',
                    '</div>'].join("")
        },
        configData:{
            MAX_TITLE_LEN: 20,
            dialogTitle: "宝宝防疫提醒"
        },
        /**
         * 宝宝防疫模板
         * @example
         * new M2012.Calendar.Popup.BabyTemplet.Step1.View({
         *     name:"小宝宝",
         *     birthday: new Date(),
         *     callback:function(data){
         *         console.log(data); //{name:'小宝宝',birthday: Date}
         *     }
         * });
         */
        initialize: function (options) {
            var _this = this;
            options = $.extend({ name: '', birthday: new Date(), callback: $.noop }, options);
            _this.options = options;
            _this.render();
            _this.initEvents();
        },
        render: function () {
            var _this = this,
                options = _this.options,
                dialog = _this.dialog;

            var html = $T.format(_this.template.MAIN, { cid: _this.cid, maxTitleLen: _this.configData.MAX_TITLE_LEN });
            _this.dialog = $Msg.showHTML(html, function (e) {
                e.cancel = true;
                _this.onNextClick(e);
            }, function () {
                //_this.onCancelClick(); //暂不需要取消的回调
            }, {
                dialogTitle: _this.configData.dialogTitle,
                buttons: ["下一步", "取消"],
                onClose: function (e) {
                    _this.datePicker && _this.datePicker.hide();
                }
            });

            //#region 填充数据
            if (options.name) {
                _this.findElement("name").val(options.name);
            }

            var birthday = options.birthday;
            _this.setBirthday(birthday);
            //#endregion
        },
        initEvents:function(){
            var _this = this,
                dialog = _this.dialog;

            _this.birthdayContainer = _this.findElement("datepicker");
            _this.dateTip = _this.findElement("dateTip");
            _this.nameTip = _this.findElement("nameTip");
            _this.maxTip = _this.findElement("maxTip");

            _this.birthdayContainer.unbind("click").bind("click", function () {
                var date = _this.options.birthday;
                _this.datePicker = new M2012.Calendar.CalendarView({
                    date2StringPattern: 'yyyy-MM-dd',
                    id: _this.cid + '_datepicker',
                    year: date.getFullYear(),
                    month: date.getMonth(),
                    day: date.getDay(),
                    callback: function (date) {
                        var checkDate = new Date(date.getTime());
                        checkDate.setFullYear(checkDate.getFullYear() + 7); //最多可以设置7年的提醒
                        if (checkDate < new Date) {
                            _this.dateTip.removeClass("hide");
                            return;
                        }
                        _this.setBirthday(date);
                    }
                });
            });

            dialog.$el.unbind("click").bind("click", function () {
                _this.dateTip.addClass("hide");
                _this.nameTip.addClass("hide");
                _this.maxTip.addClass("hide");
            });

            _this.input = _this.findElement("name");
            _this.input.unbind("keyup").bind("keyup", function () {
                var text = $(this).val();
                if (text.length > _this.configData.MAX_TITLE_LEN) {
                    $(this).val(text.substr(0, _this.configData.MAX_TITLE_LEN));
                    _this.maxTip.removeClass("hide");

                    //定时隐藏
                    if (_this.timer) { clearTimeout(_this.timer); _this.timer = null; } //防止重复
                    _this.timer=setTimeout(function () {
                        _this.maxTip.addClass("hide");
                    },3000)
                }
            })

            _this.dateTip.css("margin-top", "-50px"); //修正一下位置
        },
        onNextClick: function (e) {
            var _this = this;
            var babyName = _this.findElement("name").val().replace(/\s/g,'');
            if (!!babyName) {
                e.cancel = false;
                _this.options.callback({ name: babyName, birthday: _this.options.birthday });
                _this.dialog.close();
            } else {
                _this.showEmptyTip();
            }
        },
        onCancelClick: function () {
            this.options.callback();
        },
        showEmptyTip: function () {
            var _this=this;
            var tip = _this.findElement("nameTip"); //#cid_nameTip
            tip.removeClass("hide");

            var txtInput = _this.findElement("name");
            txtInput.unbind("focus").bind("focus", function () {
                tip.addClass("hide");
                txtInput.unbind("focus");
            });
        },
        setBirthday: function (date) {
            var _this = this;
            if (date && $.type(date) == 'date') {
                _this.findElement("birthday").html(M139.Date.format("yyyy-MM-dd", date));
                _this.options.birthday = date;
            }
        },
        findElement: function (name) {
            var _this = this;
            var ctl = _this.dialog.$el.find("#" + _this.cid + "_" + name); //#cid_name
            return ctl;
        }
    }));
    //#endregion

    //#region Step2View
    M139.namespace('M2012.Calendar.Popup.BabyTemplet.Step2.View', superClass.extend({
        template:{
            MAIN: ['<div class="repeattips-box">',
                        '<div class="pt_10 repeattips-bottom clearfix">',
                            '<span>宝宝：</span>',
                            //name
                            '<span class="repeattipsCon">{name}</span>',
                            '<span>生日：</span>',
                            //birthday
                            '<span>{birthday}</span>',
                        '</div>',
                        '<div class="pt_10 repeattips-bottom clearfix">',
                            '<span>提醒：</span>',
                            '<div id="{cid}_beforeday" class="dropDown w108">',
                                '<a class="dropDownA" href="javascript:void(0);"><i class="i_triangle_d"></i></a>',
                                '<div class="dropDownText">提前一天</div>',
                            '</div>',
                            '<div id="{cid}_type" class="dropDown w108">',
                                '<a class="dropDownA" href="javascript:void(0);"><i class="i_triangle_d"></i></a>',
                                '<div class="dropDownText">免费短信提醒</div>',
                            '</div>',
                        '</div>',
                        '<p class="lightGray pt_20">国家规定0-7岁儿童的基础免疫接种项目,仅做参考，详情请咨询当地保健部门。</p>',
                        '<div class="boxIframeTableScroll mt_10">',
                            '<table class="boxIframeTable">',
                                '<thead>',
                                    '<tr>',
                                        '<th width="18">',
                                            //请至少勾选一项
                                            '<div id="{cid}_checkboxTip" style="left:16px;top:90px; _width:90px;" class="tips hide">',
						                        '<div class="tips-text">请至少勾选一项</div>',
						                        '<div class="tipsBottom  diamond"></div>',
					                        '</div>',
                                            '<input id="{cid}_selectall" type="checkbox">',
                                        '</th>',
                                        '<th width="88">时间</th>',
                                        '<th width="271 ">疫苗</th>',
                                    '</tr>',
                                '</thead>',
                                '<tbody>',
                                    //tbody
                                    '{tbody}',
                                '</tbody>',
                            '</table>',
                        '</div>',
                        '<div id="{cid}_captcha" class="pt_10 repeattips-bottom clearfix hide"></div>',
                    '</div>'].join(""),
            TR: ['<tr>',
 					'<td><input type="checkbox" data-index="{index}" class="item_checkbox {className}" {attrName}></td>',
 					'<td class="{className}">{nextDate}{nextTime}</td>',
 					'<td class="{className}">',
 						'<ul class="boxIframeTableList">',
 							'{desc}',
 						'</ul>',
 					'</td>',
 				'</tr>'].join("")
        },
        configData:{
            beforeTypes: [
                {
                    type: 1,
                    text: '提前一天'
                }
            ],
            remindTypes: [
                {
                    type: 1,
                    text: '免费短信提醒'
                }
            ],
            listType: {
                checkable: {
                    attrName: "",
                    className:"selectable"
                },
                uncheckable: {
                    attrName: "disabled",
                    className: "whiteGray"
                }
            },
            errorCode: {
                IDENTITY: 910,
                OVER_LIMIT:911
            },
            messages: {
                OVER_LIMIT: "您添加太频繁了，请稍后再试"
            },
            dialogTitle: '宝宝防疫提醒'
        },
        /**
         * 宝宝防疫模板
         * @example
         * new M2012.Calendar.Popup.BabyTemplet.Step2.View({
         *     model:model, //M2012.Calendar.Popup.BabyTemplet.Model
         *     callback:function(data){
         *         console.log(data); //{name:'小宝宝',birthday: Date}
         *     }
         * });
         */
        initialize: function (options) {
            var _this = this;
            options = $.extend({}, options);
            if (options.model) {
                _this.model = options.model;
                _this.callback = options.callback || $.noop;
                _this.selectItems = {};
                _this.render();
                _this.initEvents();
            } else {
                //参数错误，不显示弹窗
            }
        },
        render: function () {
            var _this = this;
            
            _this.dialog = $Msg.showHTML(_this.getHtml(), function (e) {
                _this.onSaveClick(e);
            }, function () {
                _this.closeControl();
            }, {
                dialogTitle: _this.configData.dialogTitle,
                buttons: ["保存", "取消"],
                width: "530px",
                onClose: function (e) {
                    _this.closeControl();
                }
            })
        },
        initEvents: function () {
            var _this = this,
                model = _this.model,
                dialog = _this.dialog;

            //提前时间下拉菜单
            dialog.dropmenuDays = _this.getElement("beforeday");
            var dayItems = [];
            var dayText="零一二三四五六七八九十"
            for (var i = 1; i < 11; i++) {
                dayItems.push({
                    text: "提前" + dayText.substr(i, 1) + "天",
                    beforeTime: i
                });
            }

            dialog.dropmenuDays.off("click").on("click", function () {
                _this.dayMenu=new M2012.Calendar.View.CalendarPopMenu().create({
                    width: dialog.dropmenuDays.width(), //去掉padding的2px 
                    items: dayItems,
                    dockElement: dialog.dropmenuDays,
                    onItemClick: function (data) {
                        //
                        _this.model.set("beforeTime", data.beforeTime);
                        dialog.dropmenuDays.find(".dropDownText").html(data.text);
                    }
                });
            });
            //end

            //提醒类型下拉
            dialog.dropmenuTypes = _this.getElement("type");
            dialog.dropmenuTypes.off("click").on("click", function () {
                _this.typeMenu = new M2012.Calendar.View.CalendarPopMenu().create({
                    width: dialog.dropmenuTypes.width(), //去掉padding的2px 
                    items: [
                        {
                            text: '免费邮件提醒',
                            config: {
                                recMyEmail: 1,
                                recMySms: 0
                            }
                        },
                        {
                            text: '免费短信提醒',
                            config: {
                                recMyEmail: 0,
                                recMySms: 1
                            }
                        }
                    ],
                    dockElement: dialog.dropmenuTypes,
                    onItemClick: function (data) {
                        var config = data.config;
                        for (var key in config) {
                            _this.model.set(key, config[key]);
                        }
                        dialog.dropmenuTypes.find(".dropDownText").html(data.text);
                    }
                });
            });
            //end


            //宝宝防疫 列表
            dialog.checkboxTip = _this.getElement("checkboxTip");
            dialog.selectAll = _this.getElement("selectall");

            dialog.checkbox = dialog.$el.find("input.selectable"); //可选择的checkbox
            dialog.selectAll.unbind("click").bind("click", function () {
                var checked = !!$(this).attr("checked");
                dialog.checkbox.attr("checked", checked);

                _this.selectItems = []; //清空选中的列表
                if (checked) {
                    //全选
                    _this.selectItems = _.clone(_this.itemsData);
                }
            });

            dialog.checkbox.unbind("click").bind("click", function () {
                var checked = $(this).attr("checked");
                var index = $(this).data('index');
                if (!!checked) {
                    _this.selectItems[index] = _this.itemsData[index];
                } else {
                    delete _this.selectItems[index];
                }
            });

            dialog.$el.unbind("click").bind("click", function () {
                dialog.checkboxTip.addClass("hide");
            });
            //end

            dialog.captchaContainer = _this.getElement("captcha");

            try {
                //至少看到标题栏，这样起码可以关掉弹窗
                setTimeout(function () {
                    var top = parseInt(dialog.$el.css("top"));
                    if (top < 0) {
                        dialog.$el.css("top", 5);
                    }
                }, 150);
            } catch (e) { }
        },
        getHtml:function(){
            var _this = this,
                model = _this.model,
                listType = _this.configData.listType,
                TR = _this.template.TR;

            var name = model.get("name");
            var birthday = model.get("birthday");
            var listData = model.get("listData");

            var listHtml = '';
            var dateNow = new Date();
            var itemsData = {};
            for (var i = 0, len = listData.length; i < len; i++) {
                var item = listData[i];

                //判断是否已经过期
                var tmpDate = new Date(birthday.getTime());
                tmpDate.setDate(tmpDate.getDate() + item.afterDays);
                tmpDate.setMonth(tmpDate.getMonth() + item.afterMonths);
                tmpDate.setFullYear(tmpDate.getFullYear() + item.afterYears);
                //end

                item.nextDate = tmpDate;
                var obj = listType.checkable;
                if (tmpDate <= dateNow) { //过去的时间，不给选
                    obj = listType.uncheckable;
                } else {
                    //可选择的,将数据保存下来,以便全选时直接赋值,减少遍历
                    itemsData[item.index] = $.extend({}, item);
                }

                listHtml += $T.format(TR, {
                    attrName: obj.attrName,
                    className: obj.className,
                    nextDate: M139.Date.format("yyyy年MM月dd日", item.nextDate),
                    index: item.index,
                    nextTime: item.timeTip || '',
                    desc: item.desc || ''
                });
            }
            _this.itemsData = itemsData;

            var html = $T.format(_this.template.MAIN, {
                cid: _this.cid,
                name: $T.Html.encode(name),
                birthday: M139.Date.format("yyyy-MM-dd", birthday),
                tbody: listHtml
            });
            return html;
        },
        onSaveClick: function (e) {
            e.cancel = true;

            var _this = this;
            if (_this.busy) return;

            _this.busy = true;
            if (_.keys(_this.selectItems).length > 0) {
                if (_this.validation) {
                    var code = _this.captcha && _this.captcha.getData();
                    if (code) {
                        _this.model.set("validImg", code); //有填写验证码
                    } else {
                        _this.captcha.show({ refresh: true });
                    }
                }
                _this.model.set("items", _this.selectItems);
                _this.model.addBabyData(function (data, json) {
                    //保存成功,显示Tip和刷新数据
                    _this.busy = false;

                    _this.callback(json);

                    // 添加行为日志
                    window.$Cal && window.$Cal.capi.addBehavior("calendar_addbabyact_success");
                    _this.dialog.close();
                }, function (code,json) {
                    //主要用于判断是否要显示验证码
                    _this.busy = false;

                    var errorCode = _this.configData.errorCode;
                    switch (code) {
                        case errorCode.IDENTITY:
                            if (!_this.captcha) {
                                _this.captcha = new M2012.Calendar.UI.Captcha.View({
                                    target: _this.dialog.captchaContainer
                                });
                                _this.validation = true;
                            } else {
                                _this.captcha.show();
                            }
                            break;
                        case errorCode.OVER_LIMIT:
                            $Msg.alert(_this.configData.messages.OVER_LIMIT);
                            break;
                        default:
                            break;
                    }
                })
            } else {
                //显示提示
                _this.dialog.checkboxTip.removeClass("hide");
            }
        },
        closeControl:function(){
            var _this = this;
            _this.dayMenu && _this.dayMenu.remove && _this.dayMenu.remove();
            _this.typeMenu && _this.typeMenu.remove && _this.typeMenu.remove();
        },
        getElement: function (name) {
            var _this = this,
                cid = _this.cid;
            var elem = _this.dialog.$el.find("#" + cid + "_" + name);
            return elem;
        }
    }));
    //#endregion

    window.$Cal.on("show:AddBaby", function () {
        new M2012.Calendar.Popup.BabyTemplet.View({
            master : window.$Cal
        });
    });

})(jQuery, _, M139, window._top || window.top);
﻿; (function ($) {
    $.extend({
        'focus': function (con) {
            var $container = $('#index_b_hero'),
                $imgs = $container.find('li'),
//                $leftBtn = $container.find('a.prev'),
//                $rightBtn = $container.find('a.next'),
                $leftBtn = $('#prev'),
                $rightBtn = $('#next'),
                config = {
                    interval: con && con.interval || 5000,
                    animateTime: con && con.animateTime || 500,
                    direction: con && (con.direction === 'right'),
                    _imgLen: $imgs.length
                },
                i = 0,
                getNextIndex = function (y) { return i + y >= config._imgLen ? i + y - config._imgLen : i + y; },
                getPrevIndex = function (y) { return i - y < 0 ? config._imgLen + i - y : i - y; },
                silde = function (d) {
                    $imgs.eq((d ? getPrevIndex(2) : getNextIndex(2))).css('left', (d ? '-1524px' : '1524px'))
                    $imgs.animate({
                        'left': (d ? '+' : '-') + '=762px'
                    }, config.animateTime);
                    i = d ? getPrevIndex(1) : getNextIndex(1);
                },
                s = setInterval(function () { silde(config.direction); }, config.interval);

            var len=$imgs.size();
            if (len == 1) {
                //只有一个,不滚动
                clearInterval(s);
                $leftBtn.hide(); //产品说只有一张图片就不要切换按钮了
                $rightBtn.hide();
                return;
            } else if (len == 2) {
                //只有2个,又要求可以左右滚动,必然在某一侧存在空白切换,所以补充到4个,这样就不存在问题
                var html = $imgs.parent().html(); //获取ul中的所有2个li元素
                $imgs.parent().append(html); //加到ul里面
                $imgs = $container.find("li");

                config["_imgLen"] = $imgs.length; //修正长度
            }

            $imgs.eq(i).css('left', 0).end().eq(i + 1).css('left', '762px').end().eq(i - 1).css('left', '-762px');
            /*$container.find('.hero-wrap').add($leftBtn).add($rightBtn).hover(function () { clearInterval(s); }, function () { s = setInterval(function () { silde(config.direction); }, config.interval); });*/
            $container.hover(function () {
                clearInterval(s);
            }, function () {
                s = setInterval(function () {
                    silde(config.direction);
                }, config.interval);
            });
            $leftBtn.click(function () {
                if ($(':animated').length === 0) {
                    silde(false);
                }
            });
            $rightBtn.click(function () {
                if ($(':animated').length === 0) {
                    silde(true);
                }
            });
        }
    });
}(jQuery));

; (function (jQuery, _, M139, top) {
    var _class = "M2012.Calendar.Model.Square",
        commonAPI = new M2012.Calendar.CommonAPI();
    M139.namespace(_class, Backbone.Model.extend({
        defaults: {
            keys: []
        },
        initialize: function (options) {
            this.master = options.master;
        },
        clear: function () {
        },
        callAPI : function(fnName, data, fnSuccess, fnError) {
            commonAPI.callAPI({
                data : data,
                fnName : fnName,
                master : this.master
            }, fnSuccess, fnError);
        },
        /**
         * 订阅公共日历
         * @param data {Object} 订阅内容的对象
         * @param fnSuccess {Function} 回掉函数
         * @param fnError {Function} 回掉函数
         */
        subscribeCalendar: function (data, fnSuccess, fnError) {
            this.callAPI("subscribeLabel", data, fnSuccess, fnError);
        },
        /**
         * 退订公共日历
         * @param data {Object} 订阅内容的对象(如果传入的data为number，则自动完成对象转换)
         * @param fnSuccess {Function} 回掉函数
         * @param fnError {Function} 回掉函数
         */
        unsubscribeCalendar: function (data, fnSuccess, fnError) {
            if (typeof data == 'number') {
                data = { labelId: data };
            }
            this.callAPI("cancelSubscribeLabel", data, fnSuccess, fnError);
        },
        /**
         * 获取用户的日历
         * @param data {Object} 订阅内容的对象
         * @param fnSuccess {Function} 回掉函数
         * @param fnError {Function} 回掉函数
         */
        getLabels: function (data, fnSuccess, fnError) {
            this.callAPI("getLabels", data, fnSuccess, fnError);
        },
        /**
         * 获取用户的日历
         * @param data 传递的参数
         * @param fnSuccess {Function} 回掉函数
         * @param fnError 调用接口出错时的处理函数
         */
        getUnitFile: function (data, fnSuccess, fnError) {
            this.callAPI("getUnifiedPositionContent", data, fnSuccess, fnError);
        },
        /**
         * 获取日历分类列表
         */
        getSeriesList : function (data, fnSuccess, fnError) {
            this.callAPI("getAllLabelTypes", data, fnSuccess, fnError);
        },
        /**
         * 获取各分类下的相应的活动
         */
        getCalendarBySeriesId : function (data, fnSuccess, fnError) {
            this.callAPI("getLabelsByType", data, fnSuccess, fnError);
        }
    }));
})(jQuery, _, M139, window._top || window.top);

(function ($, _, M139, top) {
    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.Square";
    var constant = M2012.Calendar.Constant;

    function topmsg() {
        top.M139.UI.TipMessage.show.apply(top.M139.UI.TipMessage, arguments);
    }
    function hidemsg() {
        top.M139.UI.TipMessage.hide.apply(top.M139.UI.TipMessage, arguments);
    }

    M139.namespace(_class, superClass.extend({
        template: {
            main: [
                '<div class="bgPadding">',
                    '<div class="createTop tabTitle">',
                        '<h2>发现广场<a class="back" href="javascript:;" id="toMonth">&lt;&lt;返回</a></h2>',
                        //'<a href="#" class="createTop_btn">日历管理</a>',
                    '</div>',
                '</div>',
                '<div id="squareBox" style="overflow-y: auto; position: relative;">',
                    '<div class="squareMain" >',
                        '<div class="" id="index_b_hero">',
                            '<div style="">',
                                '<div class="nav" id="nav">',
                                    '<ul id="navUl"></ul>',
                                    '<a href="javascript:;" id="prev" class="icon prev"></a>',
                                    '<a href="javascript:;" id="next" class="icon next"></a>',
                                '</div>',
                            '</div>',
                        '</div>',

                        '<div class="scheduleRssListColumn">',
                            '<ul class="moveRecommend clearfix" id="recommand"></ul>',
                            '<div class="matchShow clearfix" id="matchShow">',
                                '<div class="matchBox" id="lifeBox"></div>',
                                '<div class="matchBox" id="otherBox"></div>',
                                /**
                                '<div class="matchBox life" id="lifeBox">',
                                    '<div class=""></div>',
                                '</div>',
                                '<div class="matchBox" id="otherBox">',
                                    '<div class="everMach" id="show_1"></div>',
                                    '<div class="everMach" id="show_1"></div>',
                                    '<div class="everMach mt_10" id="show_1"></div>',
                                    '<div class="everMach mt_10" id="show_1"></div>',
                                '</div>',*/
                            '</div>',
                        '</div>',
                    '</div>',
                '</div>'].join(''),
            series: [
                '<div class="{className}" id="calendartype_{cid}">',
                    '<h2><span><a><img src="{imgPath}"></a>{typeName}</span></h2>',
                    '<ul></ul>',
                '</div>'
            ].join(''),
            calendar: [
                '<li>',
                    '<span>·</span><em labelid="{labelId}" color="{color}" style="cursor:pointer;">{labelName}</em>',
                    '<a limit="1" labelid="{labelId}" color="{color}" isubcribe="{isubcribe}" href="javascript:;" class="{className}" data-labelname="{labelName}">{text}</a> ', '',
                '</li>'
            ].join(''),

            tipPop: '<div class="tips" style="bottom: 35px;z-index: 2;right: 0; style:;"><div class="tips-text"><i class="i_ok_min mr_5"></i>{text}</div><span class="tipsBottom diamond" style="right:25px; left:auto;"></span></div>'
        },
        _typesConfig: [
            { name: '赛事', tag: 'race', sortIcon: 'i_match' },
            { name: '影视', tag: 'film', sortIcon: 'i_movie' },
            { name: '校园', tag: 'school', sortIcon: 'i_school' },
            { name: '品牌', tag: 'mall', sortIcon: 'i_shopping' },
            { name: '生活', tag: 'life', sortIcon: 'i_life' }

        ],
        _subBtsStyle: [//阅按钮样式控制
            'greSmalBtn', 'blackBtn',   //推荐
            'graySmalBtn', 'unsuBtn',   //分类
            'greBigBtn', 'blackBigBtn blackBtn'     //焦点图
        ],
        _subBtsTxt: ['订 阅', '退 订'], //订阅按钮样式
        _searchUrl: "search.html?from={from}&sid={sid}&search={search}",
        _UnifileId: {        //统一资源请求ID配置
            navUl: 'web_067',
            recommand: 'web_068'
            //lifeBox:'web_069',
            //otherBox:'web_070'
        },
        MESSAGES: {
            LOTTERY_TITLE: "订阅成功"
        },
        configData: {
            types: {
                BABY_TYPE: 1 //宝宝防疫
            }
        },
        initialize: function (options) {
            var _this = this,
                master = options.master,
                EVENTS = master.EVENTS;

            _this.options = options;
            _this.seriesIdArr = []; // 保存所有分类ID,包括赛事，影视，生活，校园，品牌等等
            _this.master = master;

            function oncreated(args) {
                if (args.name === "discovery") {
                    master.unbind(EVENTS.VIEW_CREATED, oncreated);
                    // 加载CSS文件,只加载一次
                    M2012.Calendar.CommonAPI.loadCssFile('module/schedule/square.css');
                    _this.model = new M2012.Calendar.Model.Square(options); //用来保存数据
                    if ($.isFunction(args.onshow)) {
                        args.onshow();
                    }
                }
            }

            master.bind(EVENTS.VIEW_CREATED, oncreated);

            //本页显示时，需要加载对应的CSS
            master.bind(EVENTS.VIEW_SHOW, function (param) {
                if (param.name === "discovery") {
                    param.container.empty();
                    param.container.html(_this.template.main);
                    _this.seriesIdArr = []; // 清空上一次保存的类型ID,防止叠加
                    _this.keepElements();
                    _this.getLabels();
                    _this.fillCalendars(); // 调用后台接口获取到的所有日历数据(新增)
                    _this.adjustHeight();
                    //记录行为日志
                    if (window.isCaiyun) {
                        _this.master.capi.addBehavior("cal_caiyun_discovery_load");
                    }
                    
                }
            });
        },
        keepElements: function () {
            var _this = this;
            _this.lifeBox = $('#lifeBox');
            _this.otherBox = $('#otherBox');
            _this.toMangLabel = $('#toMangLabel');
            _this.toMonth = $('#toMonth');
            _this.squareBox = $('#squareBox');
            _this.recommand = $('#recommand');
            _this.navUl = $('#navUl');

        },
        initEvents: function () {
            var _this = this;
            var containerHeight = _this.squareBox.height(); // 容器的高度
            $(window).resize(function () {
                _this.adjustHeight();
            });
            //焦点图
            $.focus({ direction: 'right' });

            //返回日历主页跳转
            _this.toMonth.click(function () {
               // _this.master.set({ view_filter_flag: 'mylabel' });
                _this.master.trigger("master:navigate", { path: "mainview" });
            });

            // "日历管理"链接跳转
            _this.toMangLabel.click(function () {
                _this.master.trigger('master:navigate', { path: "mod/labelmgr" }); // 跳转到管理页面
            });

            /*=============判断哪些日历已经订阅(begin)===============*/
            // 最顶层日历(大图片)
            $('#navUl li a[labelid]').each(function (i) {
                var curCalId = $(this).attr('labelid');
                var isSubcribe = _this.isSubcribe(_this.subLabels, parseInt(curCalId));
                if (isSubcribe) {     //判断是否订阅显示不同的按钮
                    $(this).attr('isubcribe', '1');
                } else {
                    $(this).attr('isubcribe', '0');
                }
            });

            // 中间区域日历(中间几个小图片日历)
            $('#recommand li a[labelid]').each(function (i) {
                var me = $(this);
                var curCalId = me.attr('labelid');
                var isSubcribe = _this.isSubcribe(_this.subLabels, parseInt(curCalId));

                me.closest("li").find("img").css({ cursor: "pointer" });
                if (isSubcribe) {     //判断是否订阅显示不同的按钮
                    me.removeClass(_this._subBtsStyle[0]).addClass(_this._subBtsStyle[1]).attr('isubcribe', '1').html(_this._subBtsTxt[1]);
                } else {
                    me.removeClass(_this._subBtsStyle[1]).addClass(_this._subBtsStyle[0]).attr('isubcribe', '0').html(_this._subBtsTxt[0]);
                }

            });

            $(document).off("mousedown"); // 先移除掉document上的事件,防止触发多次
            // 新增推荐模块(页面中部区域的几张小图片)的点击事件,除"宝宝防疫"之外
            // 使用事件代理,除开"订阅按钮"的其他位置都需要能弹出窗口,recommand这个id不能改变
            // 使用代理防止动态添加的元素绑定不上事件
            $(document).on("mousedown", function (e) {
                var target = e.srcElement || e.target,
                    tagName = target.tagName.toLowerCase(),
                    element; // 目标元素

                if (e.which !== 1) {
                    // 右键点击不处理
                    return;
                }

                // 推荐列表(四张小图片)
                if (tagName !== "a" && $(target).closest("#recommand li").length) {
                    element = $(target).closest("li").find("a");
                    if (!$(element).data("type")) { // 除"宝宝防疫"之外
                        top.$Evocation.openSubsCalendar({
                            labelId: $(element).attr("labelid") || 0,
                            isOffical: true,
                            containerHeight: containerHeight,
                            subscribe: function () {
                                // 订阅成功回调
                                _this.updateStatus({
                                    labelId: $(element).attr('labelid') || 0,
                                    status: "0",
                                    element: element
                                });

                                //通知主控，新订阅了公共日历。
                                _this.master.trigger(_this.master.EVENTS.LABEL_ADDED, {
                                    seqNo: $(element).attr('labelid') || 0,
                                    color: $(element).attr('color'),
                                    isShare: 0,
                                    isSaveMenuStatus: true  // 增加配置项,保持左侧菜单栏的状态
                                });
                            },
                            unsubscribe: function () {
                                // 退订成功回调
                                _this.updateStatus({
                                    labelId: $(element).attr('labelid') || 0,
                                    status: "1",
                                    element: element
                                });

                                //通知主控，退订了公共日历。
                                _this.master.trigger(_this.master.EVENTS.LABEL_REMOVE, {
                                    seqNo: $(element).attr('labelid') || 0,
                                    isSaveMenuStatus: true  // 增加配置项,保持左侧菜单栏的状态
                                });
                            }
                        });
                    }
                }

                // 最顶上的广告图片
                if ($(target).closest("#navUl").length) {
                    var dataType = $(target).data("type"); //暂定data-type=1为宝宝防疫
                    if (dataType == _this.configData.types.BABY_TYPE) {
                        $Cal.trigger("show:AddBaby");
                    } else {
                        element = $(target).closest("li").find("a");
                        var labelId = $(element).attr("labelid") || 0
                        top.$Evocation.openSubsCalendar({ // 此处不需要传递element
                            labelId: $(element).attr("labelid") || 0,
                            isOffical: true,
                            containerHeight: containerHeight,
                            subscribe: function () {
                                //通知主控，新订阅了公共日历。
                                _this.master.trigger(_this.master.EVENTS.LABEL_ADDED, {
                                    seqNo: labelId,
                                    color: $(target).attr('color'),
                                    isShare: 0,
                                    isSaveMenuStatus: true  // 增加配置项,保持左侧菜单栏的状态
                                });
                            },
                            unsubscribe: function () {
                                //通知主控，退订了公共日历。
                                _this.master.trigger(_this.master.EVENTS.LABEL_REMOVE, {
                                    seqNo: labelId,
                                    isSaveMenuStatus: true  // 增加配置项,保持左侧菜单栏的状态
                                });
                            }
                        });
                    }
                }

                // 页面最底部,专门针对otherBox下的文本元素<em></em>
                if (tagName === 'em' && ($(target).closest("#otherBox li").length || $(target).closest("#lifeBox li").length)) {
                    element = $(target).next(); // 需要更新的dom节点
                    // showSubBtn属性为true时表示已经订阅,false表示还未订阅
                    top.$Evocation.openSubsCalendar({
                        labelId: $(target).attr('labelid') || 0,
                        isOffical: true,
                        containerHeight: containerHeight,
                        subscribe: function () {
                            // 订阅成功回调
                            _this.updateStatus({
                                labelId: $(target).attr('labelid') || 0,
                                status: "0",
                                element: element
                            });

                            //通知主控，新订阅了公共日历。
                            _this.master.trigger(_this.master.EVENTS.LABEL_ADDED, {
                                seqNo: $(target).attr('labelid') || 0,
                                color: $(target).attr('color'),
                                isShare: 0,
                                isSaveMenuStatus: true  // 增加配置项,保持左侧菜单栏的状态
                            });
                        },
                        unsubscribe: function () {
                            // 退订成功回调
                            _this.updateStatus({
                                labelId: $(target).attr('labelid') || 0,
                                status: "1",
                                element: element
                            });

                            //通知主控，退订了公共日历。
                            _this.master.trigger(_this.master.EVENTS.LABEL_REMOVE, {
                                seqNo: $(target).attr('labelid') || 0,
                                isSaveMenuStatus: true  // 增加配置项,保持左侧菜单栏的状态
                            });
                        }
                    });
                }

                // 保留之前的逻辑
                // 专门针对lifeBox,otherBox的超链接<a></a>以及recommand下四张小图片的"订阅"按钮
                if (tagName === 'a' && ($(target).closest("#lifeBox li").length || $(target).closest("#otherBox li").length || $(target).closest("#recommand li").length)) {
                    // 点击宝宝防疫时的处理,暂定data-type=1为宝宝防疫
                    if ($(target).data("type") == _this.configData.types.BABY_TYPE) {
                        $Cal.trigger("show:AddBaby");
                        return;
                    }

                    var $subEle = $(target);
                    var labelId = $subEle.attr("labelid"),
                        color = $subEle.attr("color"),
                        labelName = $subEle.data("labelname"),
                        isSubcribe = $subEle.attr('isubcribe'),
                        _isSubscribeAction = ('0' === isSubcribe);

                    if ($subEle.attr('limit') == 1 || $subEle.parent().attr('limit')) {
                        $subEle.attr('limit', '0');

                        if (_isSubscribeAction) {    //订阅
                            topmsg('正在订阅...');
                            _this.model.subscribeCalendar({
                                comeFrom: 0,
                                labelId: labelId,
                                color: color || "#0000ff"

                            }, function (response) {
                                _this.onsubscribe(response, { seqNo: Number(labelId), color: color, labelName: labelName, button: $subEle });

                            }, function () {
                                topmsg('系统繁忙，请稍后重试', { delay: 3000 });

                            });

                        } else {

                            topmsg('正在退订...');
                            _this.model.unsubscribeCalendar({
                                comeFrom: 0,
                                labelId: labelId

                            }, function (response) {
                                if (response["code"] === "FS_UNKNOW") {
                                    // 已经退订的情况, 直接刷新界面
                                    M139.UI.TipMessage.show('操作失败，请稍后重试', { delay: 3000, className: "msgRed" });
                                    _this.master.trigger(_this.master.EVENTS.NAVIGATE, { path: "view/update" });
                                    return;
                                }

                                _this.oncancel(response, { seqNo: Number(labelId), color: color, labelName: labelName, button: $subEle });

                            }, function () {
                                topmsg('系统繁忙，请稍后重试', { delay: 3000 });
                            });
                        }
                    }
                }
            });
        },

        //订阅成功回调函数
        onsubscribe: function (result, args) {
            var _this = this;
            var $subEle = args.button;

            var htmTip = $T.format(_this.template.tipPop, { text: '订阅成功！' });

            _this.subLabels.push(args.seqNo);
            _this.awardDialog(result);

            topmsg('订阅成功', { delay: 3000 });
            if ($subEle.parents('#navUl').length > 0) {
                $subEle.attr('isubcribe', '1');
                setTimeout(function () {
                    $subEle.removeClass(_this._subBtsStyle[4]).addClass(_this._subBtsStyle[5]).html(_this._subBtsTxt[1]);
                    $subEle.attr('limit', '1');
                }, 1500);

            } else if ($subEle.parents('#recommand').length > 0) {
                $subEle.parents('li').find('img').after(htmTip);
                $subEle.attr('isubcribe', '1');
                setTimeout(function () {
                    $subEle.parents('li').find('.tips').hide();
                    $subEle.removeClass(_this._subBtsStyle[0]).addClass(_this._subBtsStyle[1]).html(_this._subBtsTxt[1]);
                    $subEle.attr('limit', '1');
                }, 1500);

            } else {
                $subEle.attr('isubcribe', '1');
                setTimeout(function () {
                    $subEle.removeClass(_this._subBtsStyle[2]);
                    $subEle.addClass(_this._subBtsStyle[3]).html(_this._subBtsTxt[1]);
                    $subEle.attr('limit', '1');
                }, 1500)
            }

            //通知主控，新订阅了公共日历。
            var master = window.$Cal;
            master.trigger(master.EVENTS.LABEL_ADDED, {
                seqNo: args.seqNo,
                labelName: args.labelName,
                color: args.color,
                isShare: 0,
                isSaveMenuStatus: true  // 增加配置项,保持左侧菜单栏的状态
            });
        },

        //退阅成功回调函数
        oncancel: function (result, args) {
            var _this = this;
            var $subEle = args.button;

            for (var i = 0, l = _this.subLabels.length; i < l; i++) {
                if (_this.subLabels[i] == args.seqNo) {
                    _this.subLabels.splice(i, 1);
                }
            }

            var htmTip = $T.format(_this.template.tipPop, { text: '退订成功！' });
            topmsg('退订成功', { delay: 3000 });

            if ($subEle.parents('#navUl').length > 0) {
                $subEle.attr('isubcribe', '0');
                setTimeout(function () {
                    $subEle.removeClass(_this._subBtsStyle[5]).addClass(_this._subBtsStyle[4]).html(_this._subBtsTxt[0]);
                    $subEle.attr('limit', '1');
                }, 1500);
            } else if ($subEle.parents('#recommand').length > 0) {
                $subEle.parents('li').find('img').after(htmTip);
                $subEle.attr('isubcribe', '0');
                setTimeout(function () {
                    $subEle.parents('li').find('.tips').hide();
                    $subEle.removeClass(_this._subBtsStyle[1]).addClass(_this._subBtsStyle[0]).html(_this._subBtsTxt[0]);
                    $subEle.attr('limit', '1');
                }, 1500);

            } else {
                $subEle.attr('isubcribe', '0');
                setTimeout(function () {
                    $subEle.removeClass(_this._subBtsStyle[3]).addClass(_this._subBtsStyle[2]);
                    $subEle.html(_this._subBtsTxt[0]);
                    $subEle.attr('limit', '1');
                }, 1500)
            }

            //通知主控，退订了公共日历。
            var master = window.$Cal;
            master.trigger(master.EVENTS.LABEL_REMOVE, {
                seqNo: args.seqNo,
                labelName: args.labelName,
                isSaveMenuStatus: true  // 增加配置项,保持左侧菜单栏的状态
            });
        },

        /**
         * 弹出窗口中订阅,或退订成功时,需要调用回调函数更新日历广场页面中的状态
         * @param obj 包括labelId, status, element
         * labelId : 日历活动ID
         * status : "0"表示订阅成功, "1"退订成功 // todo
         * element : 需要改变状态的dom节点
         */
        updateStatus: function (obj) {
            var _this = this,
                labelId = obj.labelId,
                status = obj.status,
                $subEle = obj.element;

            if (status === "0") {
                _this.subLabels.push(parseInt(labelId));
                if ($subEle.parents('#navUl').length > 0) {
                    $subEle.removeClass(_this._subBtsStyle[4]).addClass(_this._subBtsStyle[5]).html(_this._subBtsTxt[1]);
                } else if ($subEle.parents('#recommand').length > 0) {
                    $subEle.parents('li').find('.tips').hide();
                    $subEle.removeClass(_this._subBtsStyle[0]).addClass(_this._subBtsStyle[1]).html(_this._subBtsTxt[1]);
                } else {
                    $subEle.removeClass(_this._subBtsStyle[2]);
                    $subEle.addClass(_this._subBtsStyle[3]).html(_this._subBtsTxt[1]);
                }
                $subEle.attr('isubcribe', '1');
                $subEle.attr('limit', '1');
            } else {
                for (var i = 0, l = _this.subLabels.length; i < l; i++) {
                    if (_this.subLabels[i] == labelId) {
                        _this.subLabels.splice(i, 1);
                    }
                }

                if ($subEle.parents('#navUl').length > 0) {
                    $subEle.removeClass(_this._subBtsStyle[5]).addClass(_this._subBtsStyle[4]).html(_this._subBtsTxt[0]);
                } else if ($subEle.parents('#recommand').length > 0) {
                    $subEle.parents('li').find('.tips').hide();
                    $subEle.removeClass(_this._subBtsStyle[1]).addClass(_this._subBtsStyle[0]).html(_this._subBtsTxt[0]);
                } else {
                    $subEle.removeClass(_this._subBtsStyle[3]).addClass(_this._subBtsStyle[2]);
                    $subEle.html(_this._subBtsTxt[0]);
                }
                $subEle.attr('isubcribe', '0');
                $subEle.attr('limit', '1');
            }
        },
        adjustHeight: function () {
            var cHeight = document.body.clientHeight;
            var h = cHeight - 45;
            this.squareBox.css({ height: h });
        },

        getUnitFile: function () { // 通过公共接口提取的数据,包括推荐和主广告
            var self = this;
            var fileIds = [];
            for (var key in self._UnifileId) {
                fileIds.push(self._UnifileId[key]);
            }

            // IE6下顶层几个大图片会出现加载不出来的问题
            self.navUl.offset({
                top: 53,
                left: 210
            });

            self.model.getUnitFile({ positionCodes: fileIds.join(',') }, function (response) {
                var data = response["var"];
                if (data) {
                    var isRenderEnd = false;
                    for (var a = 0, b = fileIds.length; a < b; a++) {
                        if (a == (b - 1)) {
                            isRenderEnd = true;
                            //self.isUnitFileRenderComplete = true;
                        }
                        for (var key in self._UnifileId) {
                            if (fileIds[a] == self._UnifileId[key]) {
                                // data[fileIds[a]] : 表示数组, 该数组中只有一个元素
                                data[fileIds[a]] && data[fileIds[a]][0].content && $(data[fileIds[a]][0].content).appendTo($('#' + key));    //将获取的html字符串填充到页面
                            }
                        }
                    }
                    if (isRenderEnd) {    //保证数据填充到页面后再注册事件
                        self.initEvents();
                    }
                }
            });
        },
        fillCalendars: function () { // 后台接口提供的分类日历列表数据
            var self = this;
            self.model.getSeriesList({ comeFrom: 0 }, function (detail, text) {
                try {
                    detail["var"] && self.renderAllSeries(detail, self.renderAllCalendars); // 填充所有的大类别之后在填充类别下的所有日历,注意顺序
                } catch (e) {
                    // 循环遍历,保证某个请求异常时不阻塞
                }
            }, function () {
                console.log("fnFail");
            }, function () {
                console.log("fnError");
            });
        },
        /**
         * 根据不同的类别ID,将类别下的所有日历填充到相应位置内
         * @param detail
         * @param fn 回调函数
         */
        renderAllSeries: function (detail, fn) {
            var tableData = detail["var"].table,
                tableDataArr = [].slice.call(tableData),
                otherBoxArr = [],
                lifeBoxArr = [];

            for (var i = 0, len = tableDataArr.length; i < len; i++) {
                var typeName = tableDataArr[i].typeName || "",
                    seriesId = tableDataArr[i].seqNo || 0,
                    imgPath = tableDataArr[i].path,
                    className = '',
                    html = '';

                if (i < 2) { // 前面两个类别区域显示在第一排
                    className = "everMach";
                } else if (i < len - 1) { // 从第三个开始,需要增加间距样式,每一排显示俩个类别区域
                    className = "everMach mt_10";
                } else if (i == len - 1) {
                    className = ""; // 生活类别区域(暂时默认它为数组的最后一个),特殊处理放在最右侧
                }
                html = $T.format(this.template.series, {
                    className: className,
                    typeName: typeName,
                    cid: seriesId,
                    imgPath: imgPath
                });
                this.seriesIdArr.push(seriesId); // 保存
                if (i == len - 1) {
                    lifeBoxArr.push(html); // 生活类别区域(暂时默认它为数组的最后一个)
                } else {
                    otherBoxArr.push(html); // 除生活类别外的其他类别区域
                }
            }
            this.otherBox.html(otherBoxArr.join(""));
            this.lifeBox.addClass("life").html(lifeBoxArr.join(""));
            fn && typeof fn === 'function' && fn.call(this);
        },
        renderAllCalendars: function () {
            var self = this;
            for (var i = 0; i < self.seriesIdArr.length; i++) {
                var typeID = self.seriesIdArr[i],
                    divID = "calendartype_" + typeID,
                    pageSize = 4; // 默认每个类别下显示前面三条数据

                // 循环调用接口,根据类别ID获取类别下的所有日历并填充,这里的ID号需要传递
                // 不然divID会被循环的最后一个值覆盖
                (function (id) {
                    if (parseInt(id.split("_")[1]) === self.seriesIdArr.length) {
                        // 如果是生活区域(默认为数组的最后一条数据),则显示前8条数据
                        pageSize = 10;
                    }

                    self.model.getCalendarBySeriesId({
                        comeFrom: 0,
                        seqNo: typeID,
                        pageSize: pageSize,
                        pageIndex: 1
                    }, function (data, text) {
                        data["var"] && self.renderCalendars.call(self, data, id); // 填充所有日历
                    }, function () {
                        console.log('fnFail');
                    }, function () {
                        console.log('fnError');
                    });
                })(divID);
            }
        },
        renderCalendars: function (data, id) {
            var ulEl = $("#" + id).find("ul");

            var tableData = data["var"] && data["var"].table,
                tableDataArr = [].slice.call(tableData),
                liArr = [],
                html = '';

            for (var i = 0, len = tableDataArr.length; i < len; i++) {
                var labelName = tableDataArr[i].labelName || "",
                    labelId = tableDataArr[i].seqNo || 0,
                    color = tableDataArr[i].color,
                    isSubscribe = tableDataArr[i].isSubscribed,                // todo 确定是否订阅?????
                    className = (isSubscribe === constant.subscribeStatus.isSubscribed) ? this._subBtsStyle[3] : this._subBtsStyle[2],
                    text = (isSubscribe === constant.subscribeStatus.isSubscribed) ? this._subBtsTxt[1] : this._subBtsTxt[0];

                html = $T.format(this.template.calendar, {
                    labelName: labelName,
                    labelId: labelId,
                    color: color,
                    isubcribe: isSubscribe,
                    className: className,
                    text: text
                });

                liArr.push(html);
            }

            ulEl.html(liArr.join(""));
        },
        getLabels: function () {
            topmsg('正在加载中...');
            var _this = this;
            _this.model.getLabels({
                comeFrom: 0,
                actionType: 0
            }, function (response) {
                hidemsg();
                if (response["var"]) {
                    _this.allLabels = response["var"];
                    _this.subLabels = [];
                    for (var i = 0, l = _this.allLabels['subscribedLabels'].length; i < l; i++) {
                        _this.subLabels.push(_this.allLabels['subscribedLabels'][i].seqNo);
                    }
                    _this.getUnitFile();    //统一位置管理

                }
            }, function (detail) {
                //console.log(detail);
            });
        },
        //判断是否订阅
        isSubcribe: function (subIds, curId) {
            return _.contains(subIds, curId);       //underscore方法：查找一个元素是否在数组中
        },

        //订阅中奖弹框
        awardDialog: function (response) {
            var _this = this;
            if (response && response.awardFlag) {
                var lotteryKeys = {
                    1: "draw",
                    2: "pay",
                    3: "luckyone"
                };

                //key存在时才显示中奖弹窗
                var type = lotteryKeys[response.awardFlag];
                if (type) {
                    new M2012.Calendar.Lottery.View({
                        type: type,
                        title: _this.MESSAGES.LOTTERY_TITLE
                    }).render();
                }
            }
        }
    }));

    $(function () {
        new M2012.Calendar.View.Square({
            master: window.$Cal
        });
    });
})(jQuery, _, M139, window._top || window.top);



