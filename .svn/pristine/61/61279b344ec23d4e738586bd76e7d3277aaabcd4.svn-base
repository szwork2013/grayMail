/******************************* **************************************************************
 返回阴历控件 (y年,m+1月)
 
 对外暴露 M2012.Calendar.CalendarInfo
 
 ***********************************************************************************************/
;
(function ($, _, M139, top) {

    var CommonAPI = new M2012.Calendar.CommonAPI();

    M139.namespace("M2012.Calendar.CalendarInfo", function (y, m, d, params) {

        //农历只能显示1901至2050年，超过该范围就只显示公历
        this.beginYear = 1900;
        this.endYear = 2050;
        this.date = new Date(y, m, 1);
        this.day = d;
        this.year = y;
        this.month = m;
        this.enableHistday = true; //历史天是否可以选择
        this.showNL = true; //是否需要显示农历
        this.yearListCount = 10; //年份列表的列表个数
        this.showFlag = false; //标志是否需要显示选择年月的层;默认不显示
        this.showCalandarFlag = false; //标志是否需要显示日历层;默认不显示
        this.showInfo = false; //是否显示浮动信息层
        this.returnType = 0; //显示类型：0为公历（2010-03-03）,1为农历（农历三月初三）
        this.dateNLStringPattern =
        {
            Y: 1,
            M: 1,
            D: 1
        }; //农历日期的格式化字符串
        this.date2StringPattern = "yyyy-MM-dd";
        this.patternDelimiter = "-";
        this.showSelectDayColor = true;
        this.objCalendarApi = CommonAPI;

        //取用户配置参数
        if (params) {
            this.params = params;
            if (this.params.beginYear != null) {
                this.beginYear = params.beginYear;
            }
            if (this.params.endYear != null) {
                this.endYear = params.endYear;
            }
            if (this.params.showNL != null) {
                this.showNL = params.showNL;
            }
            if (this.params.enableHistday != null) {
                this.enableHistday = params.enableHistday;
            }
            if (this.params.showInfo != null) {
                this.showInfo = params.showInfo;
            }
            if (this.params.yearListCount != null) {
                this.yearListCount = params.yearListCount;
            }
            if (this.params.returnType != null) {
                this.returnType = params.returnType;
            }
            if (this.params.date2StringPattern != null) {
                this.date2StringPattern = params.date2StringPattern;
            }
            if (this.params.dateNLStringPattern != null) {
                this.dateNLStringPattern = params.dateNLStringPattern;
            }
            if (this.params.showSelectDayColor != null) {
                this.showSelectDayColor = params.showSelectDayColor;
            }
            if (this.params.addPropertyFun != null) {
                this.addPropertyFun = params.addPropertyFun;
            }
            if (this.params.data != null) {
                this.data = params.data;
            }
            if (this.params.table != null) {
                this.table = params.table;
            }
        }
        var sDObj, lDObj, lY, lM, lD = 1, lL, lX = 0, tmp1, tmp2, tmp3;
        var cY, cM, cD; //年柱,月柱,日柱
        var lDPOS = new Array(3);
        var n = 0;
        var firstLM = 0;
        sDObj = new Date(y, m, 1, 0, 0, 0, 0); //当月一日日期
        this.length = this.objCalendarApi.solarDays(y, m); //公历当月天数
        this.firstWeek = sDObj.getDay(); //公历当月1日星期几
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
                sDObj = new Date(y, m, i + 1); //当月一日日期
                lDObj = new this.objCalendarApi.Lunar(sDObj); //农历
                lY = lDObj.year; //农历年
                lM = lDObj.month; //农历月
                lD = lDObj.day; //农历日
                lL = lDObj.isLeap; //农历是否闰月
                lX = lL ? this.objCalendarApi.leapDays(lY) : this.objCalendarApi.monthDays(lY, lM); //农历当月最后一天
                if (n == 0)
                    firstLM = lM;
                lDPOS[n++] = i - lD + 1;
            }
            //依节气调整二月分的年柱, 以立春为界
            if (m == 1 && (i + 1) == term2)
                cY = this.objCalendarApi.cyclical(y - 1900 + 36);
            //依节气月柱, 以「节」为界
            if ((i + 1) == firstNode)
                cM = this.objCalendarApi.cyclical((y - 1900) * 12 + m + 13);
            //日柱
            cD = this.objCalendarApi.cyclical(dayCyclical + i);
            this[i] = new this.objCalendarApi.calElement(y, m + 1, i + 1, CommonAPI.nStr1[(i + this.firstWeek) % 7], lY, lM, lD++, lL, this.objCalendarApi.cyclical(lDObj.yearCyl), this.objCalendarApi.cyclical(lDObj.monCyl), this.objCalendarApi.cyclical(lDObj.dayCyl++))
            //添加注入新的数据
            this.addPropertyFun && this.addPropertyFun(i, this[i], this.data, this.table);
        }
        this.lY = lY;
        //节气
        tmp1 = this.objCalendarApi.sTerm(y, m * 2) - 1;
        tmp2 = this.objCalendarApi.sTerm(y, m * 2 + 1) - 1;
        this[tmp1].solarTerms = CommonAPI.solarTerm[m * 2];
        this[tmp2].solarTerms = CommonAPI.solarTerm[m * 2 + 1];
        if (m == 3)
            this[tmp1].color = 'red'; //清明颜色
        //阳历节日
        for (var i = 0; i < CommonAPI.sFtv.length; i++)
            // for (i in CommonAPI.sFtv) 
        {
            if (CommonAPI.sFtv[i].match(/^(\d{2})(\d{2})([\s\*])(.+)$/)) {
                if (Number(RegExp.$1) == (m + 1)) {
                    this[Number(RegExp.$2) - 1].solarFestival += RegExp.$4 + ' '
                    if (RegExp.$3 == '*')
                        this[Number(RegExp.$2) - 1].color = 'red'
                }
            }
        }
        //月周节日
        for (var i = 0; i < CommonAPI.wFtv.length; i++)
            // for (i in CommonAPI.wFtv) 
            if (CommonAPI.wFtv[i].match(/^(\d{2})(\d)(\d)([\s\*])(.+)$/))
                if (Number(RegExp.$1) == (m + 1)) {
                    tmp1 = Number(RegExp.$2)
                    tmp2 = Number(RegExp.$3)
                    this[((this.firstWeek > tmp2) ? 7 : 0) + 7 * (tmp1 - 1) + tmp2 -
                    this.firstWeek].solarFestival += RegExp.$5 + ' '
                }

        //农历节日
        var lmf = this[0].lMonth; //当月第一天农历月份
        var lme = this[this.length - 1].lMonth; //当月最后一天农历月份
        for (var i = 0; i < CommonAPI.lFtv.length; i++)
            // for (i in CommonAPI.lFtv) 
        {
            if (CommonAPI.lFtv[i].match(/^(\d{2})(.{2})([\s\*])(.+)$/)) {
                tmp1 = Number(RegExp.$1); //农历节日月份
                tmp2 = Number(RegExp.$2); //农历节日当日
                if (tmp1 < lmf)
                    continue;
                if (tmp1 > lme)
                    break;
                for (var j = 0, len = this.length; j < len; j++) {
                    if (tmp1 == this[j].lMonth && tmp2 == this[j].lDay) {
                        this[j].lunarFestival += RegExp.$4 + ' ';
                        if (RegExp.$3 == '*') {
                            this[j].color = 'red';
                        }
                    }
                }
            }
        }
        //今日
        if (y == this.objCalendarApi.tY && m == this.objCalendarApi.tM) {
            this[this.objCalendarApi.tD - 1].isToday = true;
        }

    });

})(jQuery, _, M139, window._top || window.top);
