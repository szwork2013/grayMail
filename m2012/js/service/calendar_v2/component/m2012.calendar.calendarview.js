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


