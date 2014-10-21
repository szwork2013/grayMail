
//兼容IE，Firefox返回Event
function getEventObject() {
    if (window.event)
        return window.event;
    else {
        fun = getEventObject.caller;
        while (fun != null) {
            arg0 = fun.arguments[0];
            if (arg0)
                return fun.arguments[0];
            fun = fun.caller;
        }
    }
    return null;
}

/*
string对象转换为时间对象
*/
String.prototype.toDate = function(delimiter, pattern) {
    delimiter = delimiter || "-";
    pattern = pattern || "ymd";
    var a = this.split(delimiter);
    var y = parseInt(a[pattern.indexOf("y")], 10);
    //remember to change this next century ;)
    if (y.toString().length <= 2) y += 2000;
    if (isNaN(y)) y = new Date().getFullYear();
    var m = parseInt(a[pattern.indexOf("m")], 10) - 1;
    var d = parseInt(a[pattern.indexOf("d")], 10);
    if (isNaN(d)) d = 1;
    return new Date(y, m, d);
};
/*
格式化时间对象
*/
Date.prototype.format = function(style) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),      //day
        "h+": this.getHours(),     //hour
        "m+": this.getMinutes(),   //minute
        "s+": this.getSeconds(),   //second
        "w+": "\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".charAt(this.getDay()),   //week
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(style)) {
        style = style.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(style)) {
            style = style.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return style;
};


var richinfo = richinfo ? richinfo : {}
richinfo.email = richinfo.email ? richinfo.email : {}
richinfo.email.calendar = richinfo.email.calendar ? richinfo.email.calendar : {}

richinfo.email.calendar.commonApi = function() {
    me = this;
    this.Today = new Date();
    this.tY = me.Today.getFullYear();
    this.tM = me.Today.getMonth();
    this.tD = me.Today.getDate();

    this.lunarInfo = new Array(
        0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
        0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
        0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
        0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
        0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
        0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
        0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
        0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
        0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
        0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
        0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
        0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
        0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
        0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
        0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
        0x14b63);
    this.solarMonth = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    this.Gan = new Array("甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸");
    this.Zhi = new Array("子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥");
    this.Animals = new Array("鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪");
    this.solarTerm = new Array("小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至");
    this.sTermInfo = new Array(0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758);
    this.nStr1 = new Array('日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二');
    this.nStr2 = new Array('初', '十', '廿', '卅', '□');

    /* 国历节日 *表示放假日 */
    this.sFtv = new Array("0101 元旦节", "0214 情人节", "0308 妇女节", "0312 植树节", "0401 愚人节", "0501 劳动节", "0504 青年节", "0512 护士节", "0601 儿童节", "0701 建党节", "0801 建军节", "0910 教师节", "1001 国庆节", "1031 万圣节", "1108 记者节", "1111 光棍节", "1225 圣诞节");

    /*农历节日 *表示放假日*/
    this.lFtv = new Array("0101 春节", "0115 元宵节", "0505 端午节", "0707 七夕节", "0715 中元节", "0815 中秋节", "0909 重阳节", "1208 腊八节", "1230 除夕");

    /* 某月的第几个星期几 */
    this.wFtv = new Array(
    //"0150 世界麻风日", //一月的最后一个星期日（月倒数第一个星期日）
        "0520 母亲节",
        "0630 父亲节",
        "1144 感恩节");

    /* 返回农历 y年的总天数 */
    this.lYearDays = function(y) {
        var i, sum = 348;
        for (i = 0x8000; i > 0x8; i >>= 1) sum += (me.lunarInfo[y - 1900] & i) ? 1 : 0;
        return (sum + me.leapDays(y));
    }

    /* 返回农历 y年闰月的天数 */
    this.leapDays = function(y) {
        if (me.leapMonth(y)) return ((me.lunarInfo[y - 1900] & 0x10000) ? 30 : 29);
        else return (0);
    }

    /* 返回农历 y年闰哪个月 1-12 , 没闰返回 0 */
    this.leapMonth = function(y) {
        return (me.lunarInfo[y - 1900] & 0xf);
    }

    /* 返回农历 y年m月的总天数 */
    this.monthDays = function(y, m) {
        return ((me.lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29);
    }

    /* 
    算出农历
    该类属性有 .year .month .day .isLeap
    */
    this.Lunar = function(objDate) {
        var i, leap = 0, temp = 0
        var baseDate = new Date(1900, 0, 31)
        var offset = (objDate - baseDate) / 86400000

        this.dayCyl = offset + 40
        this.monCyl = 14

        for (i = 1900; i < 2050 && offset > 0; i++) {
            temp = me.lYearDays(i)
            offset -= temp
            this.monCyl += 12
        }

        if (offset < 0) {
            offset += temp;
            i--;
            this.monCyl -= 12
        }

        this.year = i
        this.yearCyl = i - 1864

        leap = me.leapMonth(i) //闰哪个月
        this.isLeap = false

        for (i = 1; i < 13 && offset > 0; i++) {
            //闰月
            if (leap > 0 && i == (leap + 1) && this.isLeap == false)
            { --i; this.isLeap = true; temp = me.leapDays(this.year); }
            else
            { temp = me.monthDays(this.year, i); }

            //解除闰月
            if (this.isLeap == true && i == (leap + 1)) this.isLeap = false

            offset -= temp
            if (this.isLeap == false) this.monCyl++
        }

        if (offset == 0 && leap > 0 && i == leap + 1)
            if (this.isLeap)
        { this.isLeap = false; }
        else
        { this.isLeap = true; --i; --this.monCyl; }

        if (offset < 0) { offset += temp; --i; --this.monCyl; }

        this.month = i
        this.day = offset + 1
    }

    /* 返回公历 y年某m+1月的天数 */
    this.solarDays = function(y, m) {
        if (m == 1)
            return (((y % 4 == 0) && (y % 100 != 0) || (y % 400 == 0)) ? 29 : 28);
        else
            return (me.solarMonth[m]);
    }

    /* 传入 offset 返回干支, 0=甲子 */
    this.cyclical = function(num) {
        return (me.Gan[num % 10] + me.Zhi[num % 12]);
    }

    /* 阴历属性 */
    this.calElement = function(sYear, sMonth, sDay, week, lYear, lMonth, lDay, isLeap, cYear, cMonth, cDay) {
        this.isToday = false;
        this.sYear = sYear;   //公元年4位数字
        this.sMonth = sMonth;  //公元月数字
        this.sDay = sDay;    //公元日数字
        this.week = week;    //星期, 1个中文
        //农历
        this.lYear = lYear;   //公元年4位数字
        this.lMonth = lMonth;  //农历月数字
        this.lDay = lDay;    //农历日数字
        this.isLeap = isLeap;  //是否为农历闰月?
        //八字
        this.cYear = cYear;   //年柱, 2个中文
        this.cMonth = cMonth;  //月柱, 2个中文
        this.cDay = cDay;    //日柱, 2个中文
        this.color = '';
        this.lunarFestival = ''; //农历节日
        this.solarFestival = ''; //公历节日
        this.solarTerms = ''; //节气
    }

    /* 某年的第n个节气为几日(从0小寒起算) */
    this.sTerm = function(y, n) {
        var offDate = new Date((31556925974.7 * (y - 1900) + me.sTermInfo[n] * 60000) + Date.UTC(1900, 0, 6, 2, 5));
        return (offDate.getUTCDate());
    }

    /* 返回该年的复活节(春分后第一次满月周后的第一主日) */
    this.easter = function(y) {
        var term2 = sTerm(y, 5); //取得春分日期
        var dayTerm2 = new Date(Date.UTC(y, 2, term2, 0, 0, 0, 0)); //取得春分的公历日期控件(春分一定出现在3月)
        var lDayTerm2 = new me.Lunar(dayTerm2); //取得取得春分农历
        if (lDayTerm2.day < 15) //取得下个月圆的相差天数
            var lMlen = 15 - lDayTerm2.day;
        else
            var lMlen = (lDayTerm2.isLeap ? leapDays(y) : monthDays(y, lDayTerm2.month)) - lDayTerm2.day + 15;
        //一天等于 1000*60*60*24 = 86400000 毫秒
        var l15 = new Date(dayTerm2.getTime() + 86400000 * lMlen); //求出第一次月圆为公历几日
        var dayEaster = new Date(l15.getTime() + 86400000 * (7 - l15.getUTCDay())); //求出下个周日
        this.m = dayEaster.getUTCMonth();
        this.d = dayEaster.getUTCDate();
    }
    //返回干支经年法
    this.getGZ = function(year) {
        return me.Gan[parseInt(String(year).substr(String(year).length - 1, 1))] + Zhi[(year % 12)];
    }

    /* 中文日期 */
    this.cDay = function(d) {
        var s;
        switch (d) {
            case 10:
                s = '初十'; break;
            case 20:
                s = '二十'; break;
                break;
            case 30:
                s = '三十'; break;
                break;
            default:
                s = me.nStr2[Math.floor(d / 10)];
                s += me.nStr1[d % 10];
        }
        return (s);
    }
    this.trim = function(str) {
        return str.replace("/(^\s*)|(\s*$)/g", "")
    }

    //根据公历日期返回农历显示
    this.getNLStrValueByDate = function(date) {
        var myCalendar = new richinfo.email.calendar.selector(date.getFullYear(), date.getMonth());
        var dateArray = myCalendar.getMonthViewDateArray(date.getFullYear(), date.getMonth());
        this.returnNlStr = "";
        this.returnNlNum = 0;
        if (date.getFullYear() < 1901 || date.getFullYear() >= 2050) {
            this.returnNlStr = "年份必需在1901-2049之间";
            return;
        }
        for (var i = 0; i < 42; i++) {
            day = dateArray[i] || "";

            if (dateArray[i] && parseInt(day) > 0) {
                if (parseInt(day) == date.getDate()) {
                    this.returnNlStr = myCalendar[dateArray[i] - 1].lYear + "年" + me.nStr1[myCalendar[dateArray[i] - 1].lMonth] + "月" + me.cDay(myCalendar[dateArray[i] - 1].lDay);
                    var y = String(myCalendar[dateArray[i] - 1].lYear);
                    var m = myCalendar[dateArray[i] - 1].lMonth < 10 ? ("0" + myCalendar[dateArray[i] - 1].lMonth) : String(myCalendar[dateArray[i] - 1].lMonth);
                    var d = myCalendar[dateArray[i] - 1].lDay < 10 ? ("0" + myCalendar[dateArray[i] - 1].lDay) : String(myCalendar[dateArray[i] - 1].lDay);
                    this.returnNlNum = y + m + d;
                    break;
                }
            }
        }
        return this;
    }
    this.checkDateStr = function(val) {
        var reg = /^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/;
        var reg2 = /^(\d{4})(\d{2})(\d{2})$/;
        var match = val.match(reg) || val.match(reg2);
        if (!match) return false;
        var year = parseInt(match[1], 10);
        var month = parseInt(match[2], 10);
        var date = parseInt(match[3], 10);
        var d = new Date();
        d.setDate(1);
        d.setFullYear(year);
        if (d.getFullYear() != year) return false;
        d.setMonth(month - 1);
        if (d.getMonth() != month - 1) return false;
        d.setDate(date);
        if (d.getDate() != date) return false;
        return { year: year, month: month - 1, date: date };
    }
};



richinfo.email.calendar.selector = richinfo.email.calendar.selector ? richinfo.email.calendar.selector : {}
/* 
返回阴历控件 (y年,m+1月) 
*/
richinfo.email.calendar.selector = function(y, m, callBackFunc, params) {

    //农历只能显示1901至2050年，超过该范围就只显示公历
    this.beginYear = 1900;
    this.endYear = 2050;
    this.date = new Date(y, m, 1);
    this.year = y;
    this.month = m;
    this.enableHistday = true; //历史天是否可以选择
    this.showNL = true; //是否需要显示农历	
    this.yearListCount = 10; //年份列表的列表个数
    this.showFlag = false; //标志是否需要显示选择年月的层;默认不显示
    this.showCalandarFlag = false; //标志是否需要显示日历层;默认不显示
    this.showInfo = false; //是否显示浮动信息层
    this.returnType = 0; //显示类型：0为公历（2010-03-03）,1为农历（农历三月初三）
    this.dateNLStringPattern = { Y: 1, M: 1, D: 1 }; //农历日期的格式化字符串
    this.date2StringPattern = "yyyy-MM-dd";
    this.patternDelimiter = "-";
    this.showSelectDayColor = true;
    this.objCalendarApi = new richinfo.email.calendar.commonApi();
    if (callBackFunc)
        this.callBackFunc = callBackFunc;
    //取用户配置参数
    if (params) {
        this.params = params;
        if (this.params.beginYear != null) { this.beginYear = params.beginYear; }
        if (this.params.endYear != null) { this.endYear = params.endYear; }
        if (this.params.showNL != null) { this.showNL = params.showNL; }
        if (this.params.enableHistday != null) { this.enableHistday = params.enableHistday; }
        if (this.params.showInfo != null) { this.showInfo = params.showInfo; }
        if (this.params.yearListCount != null) { this.yearListCount = params.yearListCount; }
        if (this.params.returnType != null) { this.returnType = params.returnType; }
        if (this.params.date2StringPattern != null) { this.date2StringPattern = params.date2StringPattern; }
        if (this.params.dateNLStringPattern != null) { this.dateNLStringPattern = params.dateNLStringPattern; }
        if (this.params.showSelectDayColor != null) { this.showSelectDayColor = params.showSelectDayColor; }
    }
    var sDObj, lDObj, lY, lM, lD = 1, lL, lX = 0, tmp1, tmp2, tmp3;
    var cY, cM, cD; //年柱,月柱,日柱
    var lDPOS = new Array(3);
    var n = 0;
    var firstLM = 0;
    sDObj = new Date(y, m, 1, 0, 0, 0, 0);    //当月一日日期
    this.length = this.objCalendarApi.solarDays(y, m);    //公历当月天数
    this.firstWeek = sDObj.getDay();    //公历当月1日星期几

    this.CY = this.objCalendarApi.cyclical(this.date.getFullYear() - 1900 + 36);
    var term2 = this.objCalendarApi.sTerm(y, 2); //立春日期
    //月柱 1900年1月小寒以前为 丙子月(60进制12)
    var firstNode = this.objCalendarApi.sTerm(y, m * 2) //返回当月「节」为几日开始
    cM = this.objCalendarApi.cyclical((y - 1900) * 12 + m + 12);
    //当月一日与 1900/1/1 相差天数
    //1900/1/1与 1970/1/1 相差25567日, 1900/1/1 日柱为甲戌日(60进制10)
    var dayCyclical = Date.UTC(y, m, 1, 0, 0, 0, 0) / 86400000 + 25567 + 10;
    for (var i = 0; i < this.length; i++) {
        if (lD > lX) {
            sDObj = new Date(y, m, i + 1);    //当月一日日期
            lDObj = new this.objCalendarApi.Lunar(sDObj);     //农历
            lY = lDObj.year;           //农历年
            lM = lDObj.month;          //农历月
            lD = lDObj.day;            //农历日
            lL = lDObj.isLeap;         //农历是否闰月
            lX = lL ? this.objCalendarApi.leapDays(lY) : this.objCalendarApi.monthDays(lY, lM); //农历当月最后一天
            if (n == 0) firstLM = lM;
            lDPOS[n++] = i - lD + 1;
        }
        //依节气调整二月分的年柱, 以立春为界
        if (m == 1 && (i + 1) == term2) cY = this.objCalendarApi.cyclical(y - 1900 + 36);
        //依节气月柱, 以「节」为界
        if ((i + 1) == firstNode) cM = this.objCalendarApi.cyclical((y - 1900) * 12 + m + 13);
        //日柱
        cD = this.objCalendarApi.cyclical(dayCyclical + i);
        this[i] = new this.objCalendarApi.calElement(y, m + 1, i + 1, this.objCalendarApi.nStr1[(i + this.firstWeek) % 7], lY, lM, lD++, lL, this.objCalendarApi.cyclical(lDObj.yearCyl), this.objCalendarApi.cyclical(lDObj.monCyl), this.objCalendarApi.cyclical(lDObj.dayCyl++))
    }
    this.lY = lY;
    //节气
    tmp1 = this.objCalendarApi.sTerm(y, m * 2) - 1;
    tmp2 = this.objCalendarApi.sTerm(y, m * 2 + 1) - 1;
    this[tmp1].solarTerms = this.objCalendarApi.solarTerm[m * 2];
    this[tmp2].solarTerms = this.objCalendarApi.solarTerm[m * 2 + 1];
    if (m == 3) this[tmp1].color = 'red'; //清明颜色
    //阳历节日
    for (i in this.objCalendarApi.sFtv)
        if (this.objCalendarApi.sFtv[i].match(/^(\d{2})(\d{2})([\s\*])(.+)$/))
        if (Number(RegExp.$1) == (m + 1)) {
        this[Number(RegExp.$2) - 1].solarFestival += RegExp.$4 + ' '
        if (RegExp.$3 == '*') this[Number(RegExp.$2) - 1].color = 'red'
    }

    //月周节日
    for (i in this.objCalendarApi.wFtv)
        if (this.objCalendarApi.wFtv[i].match(/^(\d{2})(\d)(\d)([\s\*])(.+)$/))
        if (Number(RegExp.$1) == (m + 1)) {
        tmp1 = Number(RegExp.$2)
        tmp2 = Number(RegExp.$3)
        this[((this.firstWeek > tmp2) ? 7 : 0) + 7 * (tmp1 - 1) + tmp2 - this.firstWeek].solarFestival += RegExp.$5 + ' '
    }

    //农历节日
    var lmf = this[0].lMonth; //当月第一天农历月份
    var lme = this[this.length - 1].lMonth; //当月最后一天农历月份
    for (i in this.objCalendarApi.lFtv) {
        if (this.objCalendarApi.lFtv[i].match(/^(\d{2})(.{2})([\s\*])(.+)$/)) {
            tmp1 = Number(RegExp.$1); //农历节日月份
            tmp2 = Number(RegExp.$2); //农历节日当日
            if (tmp1 < lmf) continue;
            if (tmp1 > lme) break;
            for (var j = 0, len = this.length; j < len; j++) {
                if (tmp1 == this[j].lMonth && tmp2 == this[j].lDay) {
                    this[j].lunarFestival += RegExp.$4 + ' ';
                    if (RegExp.$3 == '*') { this[j].color = 'red'; }
                }
            }
        }
    }
    //今日
    if (y == this.objCalendarApi.tY && m == this.objCalendarApi.tM) this[this.objCalendarApi.tD - 1].isToday = true;
} //calendar End
//输出基本格式
richinfo.email.calendar.selector.prototype.draw = function() {

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
            _cs[_cs.length] = '<li id="monthLi' + String(i) + '" onmouseover="if(this.className!=\'divMonthListCur\') this.className=\'mouseOverLiStyle\';" onmouseout="if(this.className!=\'divMonthListCur\')this.className=\'mouseOutLiStyle\';">0' + String(i) + '<\/li>';
        else
            _cs[_cs.length] = '<li id="monthLi' + String(i) + '" onmouseover="if(this.className!=\'divMonthListCur\') this.className=\'mouseOverLiStyle\';" onmouseout="if(this.className!=\'divMonthListCur\')this.className=\'mouseOutLiStyle\';">' + String(i) + '<\/li>';
    }
    _cs[_cs.length] = '<\/ul></span>';
    _cs[_cs.length] = '&nbsp;&nbsp;<span id="spanNL"><\/span>';
    _cs[_cs.length] = '<span name="goNextMonth" title="下一月" id="goNextMonth">&gt;<\/span><span name="goNextYear"  title="下一年" id="goNextYear"  >&gt;&gt;<\/span></div><\/th>';
    _cs[_cs.length] = '<\/tr>';
    _cs[_cs.length] = '<tr style="display:none"><th colspan="7"><select name="yearSelect" id="yearSelect"><\/select><select name="monthSelect" id="monthSelect"><\/select><\/th><\/tr>'
    _cs[_cs.length] = '<tr style="height:25px;" class="week">';
    for (var i = 0; i < 7; i++) {
        _cs[_cs.length] = '<th style="height:25px;">';
        _cs[_cs.length] = this.objCalendarApi.nStr1[i];
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
    document.getElementById("divCalendarForm").onclick = function() { try { curCalendar.hideYearsTable(); curCalendar.hideMonthsTable(); } catch (e) { } Utils.stopEvent(); }
    var month = curCalendar.date.getMonth();
    if (month < 9)
        this.iframe.document.getElementById("spanCurMonth").innerHTML = "0" + String(month + 1);
    else
        this.iframe.document.getElementById("spanCurMonth").innerHTML = String(month + 1);
    //添加相关事件
    for (var i = 1; i <= 12; i++) {
        this.iframe.document.getElementById('monthLi' + String(i)).onclick = function() { curCalendar.selectMonth(this); }
    }
    this.iframe.document.getElementById('spanCurYear').onclick = function() { curCalendar.showYearsTable(this); Utils.stopEvent(); }
    this.iframe.document.getElementById('spanCurMonth').onclick = function() { curCalendar.showMonthsTable(this); Utils.stopEvent(); }
    this.iframe.document.getElementById('goPrevYear').onclick = function() { curCalendar.goPrevYear(this); }
    this.iframe.document.getElementById('goNextYear').onclick = function() { curCalendar.goNextYear(this); }
    this.iframe.document.getElementById('goPrevMonth').onclick = function() { curCalendar.goPrevMonth(this); }
    this.iframe.document.getElementById('goNextMonth').onclick = function() { curCalendar.goNextMonth(this); }
    this.iframe.document.getElementById('yearSelect').onchange = function() { curCalendar.update(this); }
    this.iframe.document.getElementById('monthSelect').onchange = function() { curCalendar.update(this); }
    document.getElementById("__calendarPanel").onclick = function() { curCalendar.hideYearsTable(this); curCalendar.hideMonthsTable(this); Utils.stopEvent(); }
    //this.iframe.document.onclick=function (e) {if(curCalendar.showFlag){curCalendar.showFlag=false;curCalendar.update(this);return;}curCalendar.hideYearsTable(this);curCalendar.hideMonthsTable(this);};
    this.iframe.document.getElementById('selectTodayButton').onclick = function() { curCalendar.goToday(this); }
    //window.document.onclick=function(){if(!curCalendar.showCalandarFlag){curCalendar.showCalandarFlag=true;return;}curCalendar.hide(this);}
    //window.onresize=function(){if(curCalendar.panel.style.display== "") curCalendar.setPosition(this);}//重新定位
}
richinfo.email.calendar.selector.prototype.setPosition = function(e) {
    //	var xy = this.getAbsPoint(this.dateControl);
    //	this.panel.style.left = xy.x + "px";
    //	this.panel.style.top = (xy.y + this.dateControl.offsetHeight)+1 + "px";
    //	this.panel.style.display= "";
    var offset = $(this.dateControl).offset();
    this.panel.style.top = offset.top + $(this.dateControl).height() + 1 + "px";
    this.panel.style.left = offset.left + "px";
    this.panel.style.display = "";
};
/*
更新控件显示
*/
richinfo.email.calendar.selector.prototype.update = function(e) {
    this.date = new Date(this.year, this.month, 1);
    this.startYearList = parseInt(this.year / this.yearListCount) * this.yearListCount;
    this.changeSelect();
    this.bindData();
};

/*
控件的数据绑定
*/
richinfo.email.calendar.selector.prototype.bindData = function() {
    var calendar = this;
    var dateArray = this.getMonthViewDateArray(this.date.getFullYear(), this.date.getMonth());
    var tds = $("#divCalendarForm td");
    var oCal = new richinfo.email.calendar.selector(this.date.getFullYear(), this.date.getMonth(), this.callBackFunc, this.params);
    this.iframe.document.getElementById('spanNL').innerHTML = oCal.CY + "年[ " + String(this.objCalendarApi.Animals[(this.date.getFullYear() - 4) % 12]) + "年]";
    this.startYearList = parseInt(this.date.getFullYear() / this.yearListCount) * this.yearListCount; //年份翻页的开始年份

    for (var i = 0; i < tds.length; i++) {
        tds[i].onclick = null;
        tds[i].onmouseover = null;
        tds[i].onmouseout = null;
        tds[i].title = "";
        tds[i].innerHTML = "&nbsp;";
        tds[i].day = dateArray[i] || "";

        if (dateArray[i] && parseInt(tds[i].day) > 0) {
            //设置显示文本
            var festival = '';
            if (oCal.showNL)//是否需要显示农历
            {
                //只能年份在1901至2049时才显示农历   
                if (this.year > 1900 && this.year < 2050) {
                    var index = parseInt(tds[i].day) - 1;
                    var isLeapStr = oCal[dateArray[i] - 1].isLeap == true ? "闰" : "";
                    if (oCal[index].solarTerms == '' && oCal[index].solarFestival == '' && oCal[index].lunarFestival == '')
                        festival = '';
                    else {
                        festival = oCal[index].solarTerms;
                        if (oCal[index].solarFestival != '') festival = festival + oCal[index].solarFestival;
                        if (this.objCalendarApi.trim(oCal[index].lunarFestival) != '') festival = festival + oCal[index].lunarFestival;
                    }
                    if (festival.length > 4) {
                        tds[i].innerHTML = '<div>' + tds[i].day + "</div><div>" + festival.substr(0, 2) + '..</div>';
                        if (!oCal.showInfo) tds[i].title = festival;
                    }
                    else {
                        if (festival == '') //判断农历节气是否为空，不为空则显示节气信息，否则显示农历
                        {
                            if (oCal[index].lDay == 1)
                                tds[i].innerHTML = "<div>" + tds[i].day + "</div><div>" + oCal[index].lMonth + '月' + (this.objCalendarApi.monthDays(oCal[index].lYear, oCal[index].lMonth) == 29 ? '小' : '大' + "</label>");
                            else
                                tds[i].innerHTML = "<div>" + tds[i].day + "</div><div>" + this.objCalendarApi.cDay(oCal[dateArray[i] - 1].lDay) + "</div>";

                            if (!oCal.showInfo)
                                tds[i].title = "农历" + isLeapStr + ((this.objCalendarApi.nStr1[oCal[dateArray[i] - 1].lMonth] + "月") == "一月" ? "正月" : (this.objCalendarApi.nStr1[oCal[dateArray[i] - 1].lMonth] + "月")) + this.objCalendarApi.cDay(oCal[dateArray[i] - 1].lDay);
                        }
                        else {
                            tds[i].innerHTML = "<div>" + tds[i].day + "</div><div>" + festival + "</div>";
                            if (!oCal.showInfo) tds[i].title = festival;
                        }
                    }
                    tds[i].nlValue = ""; //返回显示的农历日期
                    tds[i].realNlDate = ''; //实际农历日期，用数字表示
                    if (oCal.dateNLStringPattern.Y != undefined && oCal.dateNLStringPattern.Y == 1) {
                        tds[i].nlValue += String(oCal[dateArray[i] - 1].lYear) + "年";
                        tds[i].realNlDate = String(oCal[dateArray[i] - 1].lYear);
                    }
                    if (oCal.dateNLStringPattern.M != undefined && oCal.dateNLStringPattern.M == 1) {
                        var nlMonth = this.objCalendarApi.nStr1[oCal[dateArray[i] - 1].lMonth] + "月";
                        if (nlMonth == "一月")
                            nlMonth = "正月";
                        tds[i].nlValue += isLeapStr + nlMonth;
                        tds[i].realNlDate += oCal[dateArray[i] - 1].lMonth < 10 ? ("0" + oCal[dateArray[i] - 1].lMonth) : String(oCal[dateArray[i] - 1].lMonth);
                    }
                    if (oCal.dateNLStringPattern.D != undefined && oCal.dateNLStringPattern.D == 1) {
                        tds[i].nlValue += this.objCalendarApi.cDay(oCal[dateArray[i] - 1].lDay);
                        tds[i].realNlDate += oCal[dateArray[i] - 1].lDay < 10 ? ("0" + oCal[dateArray[i] - 1].lDay) : String(oCal[dateArray[i] - 1].lDay);
                    }
                    if (tds[i].realNlDate.length > 0 && oCal[dateArray[i] - 1].isLeap == true)//闰月,在后边加*标识
                        tds[i].realNlDate += "*";

                }
                else {
                    tds[i].innerHTML = tds[i].day;
                }
            }
            else {
                tds[i].innerHTML = tds[i].day;
                tds[i].title = String(calendar.date.getFullYear()) + calendar.patternDelimiter + String(calendar.date.getMonth() + 1) + calendar.patternDelimiter + String(tds[i].day);
            }

            var today = new Date();
            var flag = false; // 标志时间是否大于当天
            if (calendar.date.getFullYear() > today.getFullYear() || (calendar.date.getFullYear() == today.getFullYear() && calendar.date.getMonth() > today.getMonth()) || (calendar.date.getFullYear() == today.getFullYear() && calendar.date.getMonth() == today.getMonth() && dateArray[i] >= today.getDate())) {
                flag = true;
            }
            //如果历史日期设置为不可选择，则只有时间大于等于当天时间才添加选择事件
            if (flag || oCal.enableHistday) {
                if (calendar.date.getFullYear() == today.getFullYear() && calendar.date.getMonth() == today.getMonth() && dateArray[i] == today.getDate()) {
                    tds[i].className = "todayStyle";
                    this.nlToday = tds[i].nlValue; //保存当天的农历
                    this.realNlToday = tds[i].realNlDate; //保存当天的农历
                }
                else {
                    tds[i].className = "mouseOutStyle";
                }

                tds[i].onclick = function() {
                    if (calendar.dateControl) {
                        var realDate = new Date(calendar.date.getFullYear(), calendar.date.getMonth(), this.day).format("yyyy-MM-dd");
                        calendar.dateControl.realDate = realDate;
                        if (calendar.returnType != 0)//显示农历,返回农历显示及农历数字表示
                        {
                            calendar.dateControl.value = this.nlValue;
                            calendar.dateControl.realNlDate = this.realNlDate;
                        }
                        else
                            calendar.dateControl.value = new Date(calendar.date.getFullYear(), calendar.date.getMonth(), this.day).format(calendar.date2StringPattern);
                    }
                    calendar.hide();
                    calendar.dateControl.style.color = "";
                    if (typeof (calendar.callBackFunc) == "function")
                        calendar.callBackFunc(calendar); //调用回调方法
                }
            }
            else {
                tds[i].className = "histdayStyle";
            }
            var dateStr = String(new Date(calendar.date.getFullYear(), calendar.date.getMonth(), tds[i].day).format("yyyy-MM-dd"));
            if (calendar.dateControl.value == dateStr || calendar.dateControl.realDate == dateStr) {
                if (calendar.showSelectDayColor == true)
                    tds[i].className = "selectedDayStyle";
            }
            //单元格的鼠标移入事件
            tds[i].onmouseover = function() {
                this.className = 'mouseOverStyle';
            };
            //单元格的鼠标移出事件
            tds[i].onmouseout = function() {
                var today = new Date();
                //当天样式
                if (today.getFullYear() == calendar.date.getFullYear() && today.getMonth() == calendar.date.getMonth() && today.getDate() == parseInt(this.day)) {
                    this.className = "todayStyle";
                }
                else {
                    var dateStr = String(new Date(calendar.date.getFullYear(), calendar.date.getMonth(), this.day).format("yyyy-MM-dd"));
                    if (calendar.dateControl.value == dateStr || calendar.dateControl.realDate == dateStr) {

                        this.className = calendar.showSelectDayColor == true ? "selectedDayStyle" : "mouseOutStyle";
                    }
                    else if (oCal.enableHistday || (calendar.date.getFullYear() > today.getFullYear() || (calendar.date.getFullYear() == today.getFullYear() && calendar.date.getMonth() > today.getMonth()) || (calendar.date.getFullYear() == today.getFullYear() && calendar.date.getMonth() == today.getMonth() && parseInt(this.day) >= today.getDate()))) {
                        this.className = "mouseOutStyle";
                    }
                    else {
                        this.className = "histdayStyle";
                    }
                }
            }
        }
        else {
            tds[i].className = "blankStyle";
        }
    }
};

/*
选择年份
*/
richinfo.email.calendar.selector.prototype.selectYear = function(e) {
    this.year = parseInt(e.innerHTML);
    this.hideYearsTable();
    this.changeSelect();
    this.update(e);
};
/*
选择月份
*/
richinfo.email.calendar.selector.prototype.selectMonth = function(e) {
    this.month = parseInt(e.innerHTML - 1);
    this.hideMonthsTable();
    this.changeSelect();
    this.update(e);
};
/*
显示年份下拉列表
*/
richinfo.email.calendar.selector.prototype.showYearsTable = function(e) {
    this.hideMonthsTable();
    var divYears = this.iframe.document.getElementById('divYearList');
    var xy = this.getAbsPoint(e);
    divYears.style.left = "70px";
    divYears.style.top = "25px";
    e.className = "spanCurYearFocus";
    divYears.style.display = "";
    this.showFlag = true;
};
/*
隐藏年份下拉列表
*/
richinfo.email.calendar.selector.prototype.hideYearsTable = function(e) {
    this.iframe.document.getElementById('divYearList').style.display = "none";
    this.iframe.document.getElementById('spanCurYear').className = "spanCurYear";
}

/*
显示月份下拉列表
*/
richinfo.email.calendar.selector.prototype.showMonthsTable = function(e) {
    this.hideYearsTable();
    var divMonths = this.iframe.document.getElementById('divMonthList');
    var xy = this.getAbsPoint(e);
    divMonths.style.left = "110px";
    divMonths.style.top = "25px";
    e.className = "spanCurMonthFocus";
    divMonths.style.display = "";
    this.showFlag = true;
};
/*
隐藏年份下拉列表
*/
richinfo.email.calendar.selector.prototype.hideMonthsTable = function(e) {
    this.iframe.document.getElementById('divMonthList').style.display = "none";
    this.iframe.document.getElementById('spanCurMonth').className = "spanCurMonth";
}

/*
改变年份列表的列表项
*/
richinfo.email.calendar.selector.prototype.changeStartYearList = function() {
    var curCalendar = this;
    //年份列表
    var beginYear = parseInt(this.date.getFullYear() / this.yearListCount) * this.yearListCount;
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
        yearsList.innerHTML += '<li id="yearLi' + String(i) + '"  onmouseover="if(this.className!=\'divYearListCur\') this.className=\'mouseOverLiStyle\';" onmouseout="if(this.className!=\'divYearListCur\')this.className=\'mouseOutLiStyle\';">' + String(i) + '</li>';
    }
    yearsList.innerHTML += '<li id="goPrevYearPage" title="上一页" >&lt;&lt;&nbsp;</li><li id="goNextYearPage" title="下一页">&nbsp;&gt;&gt;</li>';
    //年份下拉列表事件
    for (var i = beginYear; i < endYear; i++) {
        this.iframe.document.getElementById('yearLi' + String(i)).onclick = function() { curCalendar.selectYear(this); }
        if (this.date.getFullYear() == i) {
            this.iframe.document.getElementById('yearLi' + String(i)).className = "divYearListCur";
        }
        else {
            this.iframe.document.getElementById('yearLi' + String(i)).className = "mouseOutLiStyle";
        }
    }
    //年份翻页事件
    this.iframe.document.getElementById('goPrevYearPage').onclick = function() { curCalendar.goPrevYearPage(this); }
    this.iframe.document.getElementById('goNextYearPage').onclick = function() { curCalendar.goNextYearPage(this); }
};
/*
年份列表上一页事件
*/
richinfo.email.calendar.selector.prototype.goPrevYearPage = function(e) {
    this.showFlag = true;
    if (this.startYearList <= this.beginYear) return false;
    if (this.startYearList - this.yearListCount < this.beginYear)
        this.startYearList = this.beginYear;
    else
        this.startYearList -= this.yearListCount;
    this.year = this.startYearList;
    this.date = new Date(this.year, this.month, 1);
    this.changeSelect();
    Utils.stopEvent();
};
/*
年份列表下一页事件
*/
richinfo.email.calendar.selector.prototype.goNextYearPage = function(e) {
    this.showFlag = true;
    if (this.startYearList >= this.endYear - this.yearListCount) return false;
    this.startYearList += this.yearListCount;
    this.year = this.startYearList;
    this.date = new Date(this.year, this.month, 1);
    this.changeSelect();
    Utils.stopEvent();
};
/*
上一年事件
*/
richinfo.email.calendar.selector.prototype.goPrevYear = function(e) {
    if (this.year <= this.beginYear) { return; }
    this.year--;
    this.date = new Date(this.year, this.month, 1);
    this.changeSelect();
    this.bindData();
};
/*
下一年事件
*/
richinfo.email.calendar.selector.prototype.goNextYear = function(e) {
    if (this.year >= this.endYear - 1) { return; }
    this.year++;
    this.date = new Date(this.year, this.month, 1);
    this.changeSelect();
    this.bindData();
};
/*
选择今天事件
*/
richinfo.email.calendar.selector.prototype.goToday = function(e) {
    this.date = top.UserData.ServerDateTime;
    this.changeSelect();
    this.bindData();
};
/*
上一月事件
*/
richinfo.email.calendar.selector.prototype.goPrevMonth = function(e) {
    if (this.year <= this.beginYear && this.month < 1) {
        return false;
    }
    if (this.month == 0) {
        this.year--;
        this.month = 11;
    }
    else
        this.month--;
    this.date = new Date(this.year, this.month, 1);

    this.changeSelect();
    this.bindData();
};
/*
下一月事件
*/
richinfo.email.calendar.selector.prototype.goNextMonth = function(e) {
    if (this.year >= (this.endYear - 1) && this.month == 11) { return; }
    if (this.month == 11) {
        this.year++;
        this.month = 0;
    }
    else
        this.month++;
    this.date = new Date(this.year, this.month, 1);
    this.changeSelect();
    this.bindData();
};
/*
更新年月的下列选择项和当前选择年月值
*/
richinfo.email.calendar.selector.prototype.changeSelect = function() {
    var spanCurYear = this.iframe.document.getElementById('spanCurYear');
    var spanCurMonth = this.iframe.document.getElementById('spanCurMonth');
    spanCurYear.innerHTML = this.date.getFullYear();
    var showMonth = this.date.getMonth() + 1;
    spanCurMonth.innerHTML = showMonth > 9 ? (String(showMonth)) : ('0' + showMonth);
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

};
/*
返回年份数据数组
*/
richinfo.email.calendar.selector.prototype.getMonthViewDateArray = function(y, m) {
    var dateArray = new Array(42);
    var dayOfFirstDate = new Date(y, m, 1).getDay();
    var dateCountOfMonth = new Date(y, m + 1, 0).getDate();
    for (var i = 0; i < dateCountOfMonth; i++) {
        dateArray[i + dayOfFirstDate] = i + 1;
    }
    return dateArray;
};
/*
显示日历
*/
richinfo.email.calendar.selector.prototype.show = function(dateControl, popuControl) {
    if (this.panel.style.display != "none") {
        this.panel.style.display = "none";
    }
    if (!dateControl) {
        throw new Error("arguments[0] is necessary!")
    }
    this.dateControl = dateControl;
    popuControl = popuControl || dateControl;
    this.popuControl = popuControl;
    this.draw();
    if (dateControl.length > 0 && typeof (dateControl.value) != "undefined") {
        if (dateControl.realDate)
            this.date = new Date(dateControl.realDate.toDate(this.patternDelimiter, this.string2DatePattern));
        else
            this.date = new Date(dateControl.value.toDate(this.patternDelimiter, this.string2DatePattern));
        if (!this.date.getFullYear()) { this.date = new Date(); } //当输入内容错误时，默认当前日期
        this.year = this.date.getFullYear();
        this.month = this.date.getMonth();
    }
    else {
        this.year = this.date.getFullYear();
        this.month = this.date.getMonth();
    }
    this.changeSelect();
    this.bindData();
    this.setPosition();
};
richinfo.email.calendar.selector.prototype.hide = function() {
    document.getElementById("calendarPanel").style.display = "none";
}
/*
隐藏日历
*/
richinfo.email.calendar.selector.prototype.hide = function() {
    this.panel.style.display = "none";
};
/*
扩展getElementById方法
*/
richinfo.email.calendar.selector.prototype.getElementById = function(id, object) {
    object = object || document;
    return document.getElementById ? object.getElementById(id) : document.all(id);
};
/*
扩展getElementsByTagName方法
*/
richinfo.email.calendar.selector.prototype.getElementsByTagName = function(tagName, object) {
    object = object || document;
    return document.getElementsByTagName ? object.getElementsByTagName(tagName) : document.all.tags(tagName);
};
/*
返回定位坐标
*/
richinfo.email.calendar.selector.prototype.getAbsPoint = function(e) {

    var x = e.offsetLeft;
    var y = e.offsetTop;
    while (e = e.offsetParent) {
        x += e.offsetLeft;
        y += e.offsetTop;
    }

    return { "x": x, "y": y };
};

richinfo.email.calendar.selector.prototype.getInnerHTML = function(oCal, dateArray, tds, i) {
    var index = parseInt(tds[i].day) - 1;
    if (oCal[index].solarTerms == '' && oCal[index].solarFestival == '' && oCal[index].lunarFestival == '')
        festival = '';
    else
        festival = oCal[index].solarTerms + ' ' + oCal[index].solarFestival + ' ' + oCal[index].lunarFestival;
    if (oCal[index].lDay == 1)
        return tds[i].day + "<br>" + (oCal[index].isLeap ? '闰' : '') + oCal[index].lMonth + '月' + (monthDays(oCal[index].lYear, oCal[index].lMonth) == 29 ? '小' : '大');
    else
        return tds[i].day + "<br>" + (festival == '' ? cDay(oCal[dateArray[i] - 1].lDay) : festival);
}

//跳转至输入的时间
richinfo.email.calendar.selector.prototype.goInputDate = function(evt) {
    var e = getEventObject(evt);
    var element = e.srcElement ? e.srcElement : e.target;
    var k = e.keyCode ? e.keyCode : e.which;
    var result = this.objCalendarApi.checkDateStr(element.value);
    if (result) {
        element.realDate = new Date(result.year, result.month, result.date).format("yyyy-MM-dd");
        var calendar = new richinfo.email.calendar.selector(result.year, result.month);
        calendar.draw();
        calendar.show(element);
    }
    else {
        element.style.color = 'red';
    }
}

//write控件html代码
document.writeln('<style>');
document.writeln('/*整个日历DIV*/ .calendarPanel{position:absolute;z-index:10000;border:1px solid #ccc;width:300px;height:310px;background-color:#fff;padding:0px;}');
document.writeln('/*日历 Iframe*/ .calendarIframe{position:absolute;z-index:10001;height:310px;width:300px;}');
document.writeln('</style>');
document.writeln('<div id="__calendarPanel" class="calendarPanel" style="display:none;">');
document.writeln('<iframe src="" name="__calendarIframe" id="__calendarIframe" calss="calendarIframe" width="300px" height="300px" scrolling="no" frameborder="0"><\/iframe>');
document.writeln('<div id="divCalendarForm" calss="divCalendarForm" style="position:absolute;left:0px;top:0px;" width="300px" height="300px" scrolling="no" ><\/div>');
document.writeln('<\/div>');
document.close();


var objSelector;
//调用控件,dateControl为显示日期的对象,callBackFunc为回调方法（没有时可传null）,params为一些可配置参数，详见richinfo.email.calendar.selector类
function showMyCalendar(dateControl, callBackFunc, params) {
    this.showCalandarFlag = true;
    var date = new Date();
    if (dateControl.realDate != undefined) {
        date = new Date(dateControl.realDate.replace("-", "/").replace("-", "/"));
    }
    objSelector = new richinfo.email.calendar.selector(date.getFullYear(), date.getMonth(), callBackFunc, params);
    objSelector.draw();
    if (params && params.popuControl != null)//指定了弹出控件
    {
        objSelector.show(dateControl, params.popuControl);
    }
    else
        objSelector.show(dateControl);

    //添加对象的onkeyup事件,当修改值并正确时，跳转到指定日期
    dateControl.onkeyup = function(e) { this.style.color = ''; this.realDate = null; return objSelector.goInputDate(e); };
    //Utils.stopEvent();
}


