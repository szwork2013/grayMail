;
(function ($, _, M139, top) {

    var lunardaycache = {};
    var interval;
    var basePath = 'M2012.Calendar';
    /**
     * 日历常用API
     * @param {} date
     * 对外暴露 M2012.Calendar.CommonAPI
     */
    M139.namespace("M2012.Calendar.CommonAPI", function (date) {

        var me = this;

        if (date) {
            me.Today = date;
        } else {
            var now = new Date();
            try {
                if (top.M139 && top.M139._ClientDiffTime_) {
                    now.setTime(now.getTime() - top.M139._ClientDiffTime_);
                }
            } catch (e) {
                now = new Date();
            }
            me.Today = now;
        }

        this.tY = me.Today.getFullYear();
        this.tM = me.Today.getMonth();
        this.tD = me.Today.getDate();
        this.daycache = {}; //每农历年的天数

        /* 返回农历 y年的总天数 */
        this.lYearDays = function (y) {
            if (lunardaycache[y]) return lunardaycache[y];

            var i, sum = 348;
            for (i = 0x8000; i > 0x8; i >>= 1)
                sum += (me.lunarInfo[y - 1900] & i) ? 1 : 0;
            sum = (sum + me.leapDays(y));
            lunardaycache[y] = sum;

            return sum;
        };

        /* 返回农历 y年闰月的天数 */
        this.leapDays = function (y) {
            if (me.leapMonth(y))
                return ((me.lunarInfo[y - 1900] & 0x10000) ? 30 : 29);
            else
                return (0);
        };

        /* 返回农历 y年闰哪个月 1-12 , 没闰返回 0 */
        this.leapMonth = function (y) {
            return (me.lunarInfo[y - 1900] & 0xf);
        };

        /* 返回农历 y年m月的总天数 */
        this.monthDays = function (y, m) {
            return ((me.lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29);
        }

        /* 
         *算出农历
         *该类属性有 .year .month .day .isLeap
         */
        this.Lunar = function (objDate) {
            objDate = objDate ? objDate : this.Today;
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
                if (leap > 0 && i == (leap + 1) && this.isLeap == false) {
                    --i;
                    this.isLeap = true;
                    temp = me.leapDays(this.year);
                }
                else {
                    temp = me.monthDays(this.year, i);
                }

                //解除闰月
                if (this.isLeap == true && i == (leap + 1))
                    this.isLeap = false

                offset -= temp
                if (this.isLeap == false)
                    this.monCyl++
            }

            if (offset == 0 && leap > 0 && i == leap + 1)
                if (this.isLeap) {
                    this.isLeap = false;
                }
                else {
                    this.isLeap = true;
                    --i;
                    --this.monCyl;
                }

            if (offset < 0) {
                offset += temp;
                --i;
                --this.monCyl;
            }

            this.month = i
            this.day = offset + 1
        };

        /* 返回公历 y年某m+1月的天数 */
        this.solarDays = function (y, m) {
            y = y ? y : this.tY;
            //m = m ? m : this.tM; //<---坑
            m = (typeof m == 'number') ? m : this.tM;
            if (m == 1)
                return (((y % 4 == 0) && (y % 100 != 0) || (y % 400 == 0)) ? 29 : 28);
            else
                return (me.solarMonth[m]);
        };

        /* 传入 offset 返回干支, 0=甲子 */
        this.cyclical = function (num) {
            return (me.Gan[num % 10] + me.Zhi[num % 12]);
        };

        this.cyclicalz = function (num, type) {
            if (type == 'm') {
                return ['零', '正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'][num] + '月';
            } else {
                var year = num.toString();
                return year + '年';
            }
        }
        /* 阴历属性 */
        this.calElement = function (sYear, sMonth, sDay, week, lYear, lMonth, lDay, isLeap, cYear, cMonth, cDay) {
            this.isToday = false;
            this.sYear = sYear; //公元年4位数字
            this.sMonth = sMonth; //公元月数字
            this.sDay = sDay; //公元日数字
            this.week = week; //星期, 1个中文
            //公历合并
            this.date = new Date(this.sYear, this.sMonth - 1, this.sDay).format("yyyy-MM-dd");
            this.ldate = cYear + cMonth + cDay;
            //农历
            this.lYear = lYear; //公元年4位数字
            this.lMonth = lMonth; //农历月数字
            this.lDay = lDay; //农历日数字
            this.isLeap = isLeap; //是否为农历闰月?
            //八字
            this.cYear = cYear; //年柱, 2个中文
            this.cMonth = (isLeap ? '闰' : '') + cMonth; //月柱, 2个中文
            this.cDay = cDay; //日柱, 2个中文
            this.color = '';
            this.lunarFestival = ''; //农历节日
            this.solarFestival = ''; //公历节日
            this.solarTerms = ''; //节气
            this.lDate = new Date(this.lYear, this.lMonth - 1, this.lDay).format("yyyy-MM-dd");; //公历年月日
        };

        /* 某年的第n个节气为几日(从0小寒起算) */
        this.sTerm = function (y, n) {
            var offDate = new Date((31556925974.7 * (y - 1900) +
            me.sTermInfo[n] *
            60000) +
            Date.UTC(1900, 0, 6, 2, 5));
            return (offDate.getUTCDate());
        };

        /* 返回该年的复活节(春分后第一次满月周后的第一主日) */
        this.easter = function (y) {
            var term2 = sTerm(y, 5); //取得春分日期
            var dayTerm2 = new Date(Date.UTC(y, 2, term2, 0, 0, 0, 0)); //取得春分的公历日期控件(春分一定出现在3月)
            var lDayTerm2 = new this.Lunar(dayTerm2); //取得取得春分农历
            if (lDayTerm2.day < 15) //取得下个月圆的相差天数
                var lMlen = 15 - lDayTerm2.day;
            else
                var lMlen = (lDayTerm2.isLeap ? leapDays(y) : monthDays(y, lDayTerm2.month)) -
                lDayTerm2.day +
                15;
            //一天等于 1000*60*60*24 = 86400000 毫秒
            var l15 = new Date(dayTerm2.getTime() + 86400000 * lMlen); //求出第一次月圆为公历几日
            var dayEaster = new Date(l15.getTime() +
            86400000 *
            (7 - l15.getUTCDay())); //求出下个周日
            this.m = dayEaster.getUTCMonth();
            this.d = dayEaster.getUTCDate();
        };

        //返回干支经年法
        this.getGZ = function (year) {
            return me.Gan[parseInt(String(year).substr(String(year).length - 1, 1))] +
            me.Zhi[(year % 12)];
        };

        /* 中文日期 */
        this.cDay = function (d) {
            var s;
            switch (d) {
                case 10:
                    s = '初十';
                    break;
                case 20:
                    s = '廿十';
                    break;
                case 30:
                    s = '三十';
                    break;
                default:
                    s = me.nStr2[Math.floor(d / 10)];
                    s += me.nStr1[d % 10];
            }
            return (s);
        };

        this.trim = function (str) {
            return str.replace("/(^\s*)|(\s*$)/g", "")
        };

        //根据公历日期返回农历显示
        this.getNLStrValueByDate = function (date) {
            date = date ? date : this.Today;
            var myCalendar = new selector(date.getFullYear(), date.getMonth(), date.getDate());
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
                        this.returnNlStr = myCalendar[dateArray[i] - 1].lYear + "年" +
                        me.nStr1[myCalendar[dateArray[i] - 1].lMonth] +
                        "月" +
                        me.cDay(myCalendar[dateArray[i] - 1].lDay);
                        var y = String(myCalendar[dateArray[i] - 1].lYear);
                        var m = myCalendar[dateArray[i] - 1].lMonth < 10 ? ("0" + myCalendar[dateArray[i] - 1].lMonth) : String(myCalendar[dateArray[i] - 1].lMonth);
                        var d = myCalendar[dateArray[i] - 1].lDay < 10 ? ("0" + myCalendar[dateArray[i] - 1].lDay) : String(myCalendar[dateArray[i] - 1].lDay);
                        this.returnNlNum = y + m + d;
                        break;
                    }
                }
            }
            return this;
        };

        this.checkDateStr = function (val) {
            var reg = /^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/;
            var reg2 = /^(\d{4})(\d{2})(\d{2})$/;
            var match = val.match(reg) || val.match(reg2);
            if (!match)
                return false;
            var year = parseInt(match[1], 10);
            var month = parseInt(match[2], 10);
            var date = parseInt(match[3], 10);
            var d = new Date();
            d.setDate(1);
            d.setFullYear(year);
            if (d.getFullYear() != year)
                return false;
            d.setMonth(month - 1);
            if (d.getMonth() != month - 1)
                return false;
            d.setDate(date);
            if (d.getDate() != date)
                return false;
            return {
                year: year,
                month: month - 1,
                date: date
            };
        };
    });

    var CommonAPI = M2012.Calendar.CommonAPI;

    // 年柱生肖
    CommonAPI.prototype.symbolic = function (yearOffset) {
        return this.Animals[yearOffset % 12];
    };

    //日期转农历
    CommonAPI.prototype.createDateObj = function (date) {
        var commonAPI = new CommonAPI();
        var lDObj = new commonAPI.Lunar(date);
        //var lDObj = this.Lunar(date);
        var lY = lDObj.year; //农历年
        var lM = lDObj.month; //农历月
        var lD = Math.floor(lDObj.day); //农历日
        var lL = lDObj.isLeap; //农历是否闰月

        dateObj = new commonAPI.calElement(date.getFullYear(), date.getMonth() + 1, date.getDate(),
                    this.nStr1[date.getDay()], lY, lM, lD++, lL,
                    commonAPI.cyclicalz(lY, 'y'),
                    commonAPI.cyclicalz(lM, 'm'), commonAPI.cDay(Math.floor(lDObj.day)));

        //计算生肖八字
        dateObj.aYear = this.symbolic(lDObj.yearCyl); //生肖年
        dateObj.bYear = commonAPI.cyclical(Math.floor(lDObj.yearCyl)); //干支年
        dateObj.bMonth = commonAPI.cyclical(Math.floor(lDObj.monCyl) - 1); //干支月
        dateObj.bDay = commonAPI.cyclical(Math.floor(lDObj.dayCyl));

        return dateObj;
    };

    CommonAPI.prototype.lunarInfo = [
        0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950,
        0x16554, 0x056a0, 0x09ad0, 0x055d2, 0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250,
        0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, 0x04970, 0x0a4b0,
        0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
        0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0,
        0x1c8d7, 0x0c950, 0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0,
        0x092d0, 0x0d2b2, 0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0,
        0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50,
        0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
        0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540,
        0x0b6a0, 0x195a6, 0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50,
        0x06d40, 0x0af46, 0x0ab60, 0x09570, 0x04af5, 0x04970, 0x064b0, 0x074a3,
        0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, 0x0c960, 0x0d954,
        0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
        0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176,
        0x052b0, 0x0a930, 0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6,
        0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, 0x05aa0, 0x076a3, 0x096d0, 0x04bd7,
        0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, 0x0b5a0, 0x056d0,
        0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
        0x14b63
    ];

    //阳历月天数
    CommonAPI.prototype.solarMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    CommonAPI.prototype.Gan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
    CommonAPI.prototype.Zhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
    CommonAPI.prototype.Animals = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];

    CommonAPI.prototype.solarTerm = [
        "小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满",
        "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降",
        "立冬", "小雪", "大雪", "冬至"
    ];

    CommonAPI.prototype.sTermInfo = [0, 21208, 42467, 63836, 85337, 107014, 128867,
        150921, 173149, 195551, 218072, 240693, 263343, 285989,
        308563, 331033, 353350, 375494, 397447,
        419210, 440795, 462224, 483532, 504758];

    CommonAPI.prototype.nStr1 = ['日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
    CommonAPI.prototype.nStr2 = ['初', '十', '廿', '三', '□'];

    /* 国历节日 *表示放假日 */
    CommonAPI.prototype.sFtv = [
        "0101 元旦节",
        "0214 情人节",
        "0308 妇女节",
        "0312 植树节",
        "0401 愚人节",
        "0501 劳动节",
        "0504 青年节",
        "0512 护士节",
        "0601 儿童节",
        "0701 建党节",
        "0801 建军节",
        "0910 教师节",
        "1001 国庆节",
        "1031 万圣节",
        "1108 记者节",
        "1111 光棍节",
        "1225 圣诞节"
    ];

    /*农历节日 *表示放假日*/
    CommonAPI.prototype.lFtv = [
        "0101 春节",
        "0115 元宵节",
        "0505 端午节",
        "0707 七夕节",
        "0715 中元节",
        "0815 中秋节",
        "0909 重阳节",
        "1208 腊八节",
        "1230 除夕"
    ];

    /* 某月的第几个星期几 */
    CommonAPI.prototype.wFtv = [
        //"0150 世界麻风日", //一月的最后一个星期日（月倒数第一个星期日）
        "0520 母亲节",
        "0630 父亲节",
        "1144 感恩节"
    ];

    CommonAPI.prototype.padding = function (i, len) {
        len = (len || 2) - (1 + Math.floor(Math.log(i | 1) / Math.LN10 + 10e-16));
        return new Array(len + 1).join("0") + i;
    };

    //将 '0405' 正常化成 '04:05:00'
    CommonAPI.prototype.normalize = function (time) {
        return (time < 1000 ? '0' : '') + Math.floor(time / 100) + (time % 100 < 10 ? ':0' : ':') + time % 100 + ':00'
    };

    //将 "0405" 转换成 "04:05"
    CommonAPI.prototype.fixHourTime = function (time) {

        time += "";
        if (!time) return "";

        if (time.indexOf(":") > 0) return time;

        time = (function (n, m) {
            var len = (m || 2) - (1 + Math.floor(Math.log(n | 1) / Math.LN10 + 10e-16));
            return new Array(len + 1).join("0") + n;
        })(time, 4);

        var len = time.length;
        return $T.format("{0}:{1}", [time.substr(len - 4, 2), time.substr(len - 2)]);
    };

    /**
     * 将时间的时分部分转换成数字表现形式
     * 如： new Date() --> 800或1450
     * @param {Date}   date    //待转换的时间数据
     */
    CommonAPI.prototype.getTimeNumberFormat = function (date) {
        if (!_.isDate(date))
            return 0;

        var time = $Date.format("hhmm", date);
        return Number(time);
    };

    CommonAPI.prototype.getHour = function (strhm, endstrHM) {
        var hm = null;
        if (this.isFullDayEvent(strhm, endstrHM)) {
            return 100;
        } else {
            hm = strhm.split(":");
            return hm[0];
        }
    },

    CommonAPI.prototype.getMinType = function (time) {

        var times = time.split(':');
        var min = times[1];
        var retValue = 0;
        if (min) {
            if (min > '30') {

                retValue = 3;

            } else if (min === '30') {

                retValue = 2

            } else if (times[1] === '00') {

                retValue = 1;

            } else {

                retValue = 0;
            }
        }
        return retValue;
    },

    //是否全天事件
    CommonAPI.prototype.isFullDayEvent = function (startTime, endTimd) {
        return startTime === '08:00' && endTimd === '23:59';
    };

    /**
      * 计算正确的全天事件时间
      * 全天事件的时间区段为：从开始时间的0时0分0秒到结束时间下一天的0时0分0秒
      * @param {Date} startTime         开始时间
      * @param {Date} endTime           结束时间
      * @param {Boolean} isFullDayEvent 是否全天事件
      * @return {Object}
      */
    CommonAPI.prototype.getFullDayDate = function (startTime, endTime, isFullDayEvent) {
        if (!_.isBoolean(isFullDayEvent)) {
            isFullDayEvent = true;
        }

        if (!(isFullDayEvent && _.isDate(startTime) && _.isDate(endTime)))
            return {
                startTime: startTime,
                endTime: endTime
            }

        return {
            startTime: new Date(
                 startTime.getFullYear(),
                 startTime.getMonth(),
                 startTime.getDate()),
            endTime: new Date(
                endTime.getFullYear(),
                endTime.getMonth(),
                endTime.getDate() + 1)
        }
    }

    // 获取元素尺寸
    CommonAPI.prototype.getElementSize = function (el) {
        el = $(el);
        return {
            height: el.innerHeight(),
            width: el.innerWidth()
        }
    };

    //转换'2013-01-01'或者'20130101'的字符串为时间对象
    CommonAPI.prototype.parse = function (str) {
        var reg = /^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/;
        var reg2 = /^(\d{4})(\d{2})(\d{2})$/;
        var match = str.match(reg) || str.match(reg2);
        if (!match)
            return null;
        var year = parseInt(match[1], 10);
        var month = parseInt(match[2] - 1, 10);
        var day = parseInt(match[3], 10);
        var date = new Date(year, month, day);

        return date;
    };

    CommonAPI.prototype.analyzeType = function (calendar) {
        var types = M2012.Calendar.Constant.scheduleTypes;

        var type = calendar.isInvitedCalendar ? types.INVITE : //邀请的
            calendar.isSharedCalendar ? types.SHARE : //共享的
            calendar.isSubCalendar ? types.SUBSCRIBE : //订阅的
            types.OWNER; //自己的
        return type;
    };
    /**
     * 调用公共的API
     * @param obj fnName:接口名称  master: master对象 data: 传递的参数
     * @param fnSuccess 调用接口成功时的回调函数
     * @param fnError 调用接口失败时的回调函数
     */
    CommonAPI.prototype.callAPI = function (obj, fnSuccess, fnError) {
        obj.master = (obj.master ? obj.master : window.$Cal);
        obj.master && obj.master.trigger(obj.master.EVENTS.REQUIRE_API, {
            success: function (api) {
                if (api[obj.fnName] && _.isFunction(api[obj.fnName])) {
                    api[obj.fnName]({
                        data: obj.data || {},
                        success: function (detail, text) {
                            if (console && console.log) {
                                console.log('Call success,fnName: ' + obj.fnName);
                            }
                            fnSuccess && _.isFunction(fnSuccess) && fnSuccess(detail, text);
                        },
                        error: function (detail) {
                            if (console && console.error) {
                                console.error('Call error,fnName: ' + obj.fnName);
                            }
                            fnError && _.isFunction(fnError) && fnError(detail);
                        }
                    });
                }
            }
        });
    };

    //获取指定标签的父元素
    CommonAPI.prototype.parent = function (el, compare) {
        compare = compare || (function () { });
        var element = el;
        for (var i = 0xFF; i--;) {
            if (element == null || "#document" === element.nodeName) {
                return null;
            } else if (compare(element)) {
                break;
            } else {
                element = element.parentNode;
            }
        }
        return element;
    };

    // 转化时间 800-->8:00 0800-->08:00
    CommonAPI.prototype.transformTime = function (str) {
        if (!!str && str.toString().indexOf(":") > 0) return str; //如果有冒号,则表示原本就是时间格式,管他格式对不对

        function padding(n, m) {
            var len = (m || 2) - (1 + Math.floor(Math.log(n | 1) / Math.LN10 + 10e-16));
            return new Array(len + 1).join("0") + n;
        }

        var result;
        if (typeof str !== 'number' && typeof str !== 'string') {
            return "00:00";
        }

        str = padding(Number(str) || 0, 4); //先补齐4位

        str = str + "";
        result = (str.length === 3) ? "0" + str.substring(0, 1) + ":" + str.substring(1) : str.substring(0, 2) + ":" + str.substring(2);
        return result;
    };

    /**
    * 获取当前用户的手机号码
    */
    CommonAPI.prototype.getUserMobile = function () {
        if (window.ISOPEN_CAIYUN) {
            return "";
        }
        return top.$User.getShortUid() || "";
    };

    /**
     * 获取当前用户的默认收件地址
     */
    CommonAPI.prototype.getUserEmail = function () {
        if (window.ISOPEN_CAIYUN) {
            return "";
        }
        return top.$User.getDefaultSender() || "";
    };

    // 从老的$Util里面迁移过来
    CommonAPI.Utils = {
        $Date: {

            //字符转成日期2012-10-11,"-"
            toDate: function (str, delimiter, pattern) {

                if (str instanceof Date) {
                    return str;
                }

                delimiter = delimiter || "-";
                pattern = pattern || "ymd";
                var a = str.split(delimiter);
                var y = parseInt(a[pattern.indexOf("y")], 10);
                //remember to change this next century ;)
                if (y.toString().length <= 2)
                    y += 2000;
                if (isNaN(y))
                    y = new Date().getFullYear();
                var m = parseInt(a[pattern.indexOf("m")], 10) - 1;
                var d = parseInt(a[pattern.indexOf("d")], 10);
                if (isNaN(d))
                    d = 1;
                return new Date(y, m, d);

            },
            parse: function (str) {
                if (/^\d{10}$/.test(str)) {
                    return new Date(str * 1000);
                } else if (/^\d{13}$/.test(str)) {
                    return new Date(str * 1);
                }

                //str = str.trim();
                var reg = /^(\d{4})-(\d{1,2})-(\d{1,2})(\W+(\d{1,2}):(\d{1,2})(:(\d{1,2}))?)?$/;
                var m = str.match(reg);
                if (m) {
                    var year = m[1];
                    var month = parseInt(m[2] - 1, 10);
                    var day = parseInt(m[3], 10);
                    if (m[5] == undefined || m[5] == "") { //无时分秒
                        return new Date(year, month, day);
                    } else {
                        var hour = parseInt(m[5], 10);
                        var minutes = parseInt(m[6], 10);
                        var seconds = 0;
                        if (m[8]) {
                            parseInt(m[8], 10);
                        }
                        return new Date(year, month, day, hour, minutes, seconds);
                    }
                } else {
                    return null;
                }
            }
        },
        $Event: {
            stopBubble: function () {
                var evt = this.getEvent();
                if (evt && evt.stopPropagation) {
                    evt.stopPropagation();
                } else {
                    if (evt) {
                        evt.cancelBubble = true;
                    }
                }
            },
            getEvent: function () {
                if (document.all)
                    return window.event;
                func = this.getEvent.caller;
                while (func != null) {
                    var arg0 = func.arguments[0];
                    if (arg0) {
                        if ((arg0.constructor == Event || arg0.constructor == MouseEvent)
                            || (typeof (arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
                            return arg0;
                        }
                    }
                    func = func.caller;
                }
                return null;
            },
            getEventObject: function () {
                if (window.event)
                    return window.event;
                else {
                    fun = this.getEventObject.caller;
                    while (fun != null) {
                        arg0 = fun.arguments[0];
                        if (arg0)
                            return fun.arguments[0];
                        fun = fun.caller;
                    }
                }
                return null;
            },
            stopEvent: function (e) {
                if (!e) {
                    e = this.getEvent();
                }
                if (e) {
                    if (e.stopPropagation) {
                        e.stopPropagation();
                        e.preventDefault();
                    } else {
                        e.cancelBubble = true;
                        e.returnValue = false;
                    }
                }
            }
        },
        convertToUrlParams: function (params) {
            //convertToUrlParams({a:1,b:2})==>"a-1/b-2"
            //注意: 有bug,转换的对象的键字符串中,不能有"-",如不允许{"a-b-c":1}
            //只支持单层对象模式,即{a:1,b:2}形势,不支持{a:{b:1}}
            var arr = [];
            for (var key in params) {
                arr.push(key + "-" + params[key] || ''); //可能有BUG,undefined无法在url中体现转换成空
            }
            return arr.join("/");
        },
        convertBackUrlParams: function (urlpath) {
            //将上面转换后的字符串还原成obj
            urlpath = urlpath || '';
            var arr = urlpath.split("/"),
                obj = {};
            var i, len = arr.length;

            for (i = 0; i < len; i++) {
                var str = arr[i];
                if (str) {
                    var para = str.split("-");
                    obj[para.shift()] = para.join("-"); //防止value的内容中也有 "-"
                }
            }
            return obj;
        },
        /**
         *构建菜单数据结构
         * @param obj
         * @param type
         * @return {Array}
         */
        createPopMenuObjParams: function (obj, type) {

            var objParam = [], val = null, temp = null;
            if (obj instanceof Array) {
                for (var i = 0; i < obj.length; i++) {
                    objParam.push({ text: obj[i], val: i });
                }
            } else if (obj instanceof Object) {
                if (type === 'time') {
                    var step = 15; //时间间隔15分钟
                    for (var i = obj.start; i <= obj.end; i++) {
                        temp = this.transeform2str(i);
                        //objParam.push({ text: temp + ":00", val: "" + i + '00' });
                        //objParam.push({ text: temp + ":30", val: "" + i + '30' });
                        for (var j = 0; j < 4; j++) {
                            var minute = this.transeform2str(step * j);
                            objParam.push({ text: temp + ":" + minute, val: "" + i + minute });
                        }
                    }
                } else if (type === 'month' || type === 'year') {
                    for (var i = obj.start; i <= obj.end; i++) {
                        val = this.transeform2str(i);
                        objParam.push({ text: val + obj.tail, val: val });
                    }
                } else {
                    for (var item in obj) {
                        objParam.push({ text: item, val: obj[item] });
                    }

                }

            }
            return objParam;
        },
        /**
         * 数据转换
         * @param str
         * @return {String}
         */
        transeform2str: function (str) {
            str = "" + str;
            return str.length === 1 ? ("0" + str) : str;
        },

        /**
         * 将时间字符串转换成时间格式
         * 如：2359 --> 23:59
         */
        fixTimeToHour: function (showTime) {
            //借用邮箱中的补位方法
            function padding(n, m) {
                var len = (m || 2) - (1 + Math.floor(Math.log(n | 1) / Math.LN10 + 10e-16));
                return new Array(len + 1).join("0") + n;
            }

            showTime += "";
            if (!showTime) return "";
            if (showTime.indexOf(":") > 0) return showTime;

            showTime = padding(showTime, 4);
            var len = showTime.length; //padding("0530",4)="00530"
            return showTime.substr(len - 4, 2) + ':' + showTime.substr(len - 2);
        },
        dayWeekStr: function (day) { // 按周提醒有使用到
            return ['日', '一', '二', '三', '四', '五', '六'][day];
        },
        getObjValue: function (value, obj, propName) { // 验证码图片需要用到,从老代码迁移过来
            for (var item in obj) {
                if (obj[item] === value) {
                    return item;
                }
            }
            return '';
        },
        adjustScrollToBottom: function (divList) { // 验证码图片需要用到,从老代码迁移过来
            try {
                var divList = document.getElementById(divList);
                if (divList) {
                    divList.scrollTop = divList.scrollHeight;
                }
            } catch (e) {
            }
        }
    };

    /**
     * 转化提醒控件,对remind的数据进行转化
     */
    CommonAPI.prototype.transform = function (remindObj) {
        var myObj = {
            beforeTime: remindObj.beforeTime,
            beforeType: remindObj.beforeType,
            recMyEmail: remindObj.enable === 1 ? remindObj.recMyEmail : 0, // 如果选中提前(按钮),则
            recMySms: remindObj.enable === 1 ? remindObj.recMySms : 0, // 如果选中提前(按钮),则
            enable: remindObj.enable,
            recEmail: remindObj.recEmail,
            recMobile: remindObj.recMobile
        };
        if (myObj.recMyEmail != 0) {// 只需要传递邮箱号码
            delete myObj.recMobile;
        }

        if (myObj.recMySms != 0) { // 只需要传递电话号码
            delete myObj.recEmail;
        }

        if (myObj.enable == 0) { // 不需要提醒
            delete myObj.recEmail;
            delete myObj.recMobile;
        }
        return myObj;
    };

    /**
     * 获取当前时间
    **/
    CommonAPI.prototype.getCurrentServerTime = function () {
        return CommonAPI.getCurrentServerTime();
    }

    CommonAPI.getCurrentServerTime = function () {
        // 获取服务器当前系统时间(彩云版直接取客户端时间)
        return window.ISOPEN_CAIYUN ? new Date() : M139.Date.getServerTime();
    };

    /**
     * 获取移除秒数后的时间
     * @param {Date} time  要处理的时间
     * @return {Date} 
    **/
    CommonAPI.prototype.getNoSecondTime = function (time) {

        if (!_.isDate(time))
            return time;

        return new Date(
            time.getFullYear(),
            time.getMonth(),
            time.getDate(),
            time.getHours(),
            time.getMinutes());
    };
    /**
     * 页面上选择的时间与当前系统时间之间的差值
     */
    CommonAPI.calculateCountdown = function (datetime, callback) {
        // 计算设置事件与当前时间相差的时间
        // datetime: 页面上设置的时间, callback: 回调函数用来实时显示倒计时
        var leftSecond = parseInt((datetime.getTime() - CommonAPI.getCurrentServerTime().getTime()) / 1000);
        var that = this;
        if (leftSecond > 0) {
            // 计算相差的天,时,分,秒
            var days = parseInt(leftSecond / 3600 / 24),
                hours = parseInt((leftSecond / 3600) % 24),
                minutes = parseInt((leftSecond / 60) % 60),
                seconds = parseInt(leftSecond % 60);

            callback && _.isFunction(callback) && callback({
                expired: false, //是否过期标记
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds
            });

            interval && clearTimeout(interval);
            interval = setTimeout(function () {
                CommonAPI.calculateCountdown(datetime, callback);
            }, 1000);
        } else {
            interval && clearTimeout(interval); // 如果倒计时已经过期,不再重复计算
            callback({
                expired: true
            });
        }
    };

    /**
     * 清除定时器(暂时倒计时功能在使用)
     */
    CommonAPI.clearTimeout = function () {
        interval && clearTimeout(interval);
    };

    // 创建一个类并添加到 M2012.Calendar 命名空间下
    CommonAPI.createClass = function (className, instances, statics) {
        var fullname = basePath + '.' + className;
        if (typeof instances == 'function') //传进来的是函数，则调用它并取其返回值
        {
            instances = instances();
        }

        var Class = Backbone.Model.extend(instances); //创建一个类
        Class.fullname = fullname; //添加一个全名称的静态成员

        //处理静态成员
        if (typeof statics == 'function') //传进来的是函数，则调用它并取其返回值
        {
            statics = statics(Class); //把创建出来的类通过参数传给调用方，方便调用方引用
        }

        $.extend(Class, statics); //把静态成员扩展上去
        M139.namespace(fullname, Class);

        return Class;
    };

    /**
     *  比较时间大小
     *  结果：
        1: 前者大于后者
        0：前者等于后者
        -1：前者小于后者
     */
    CommonAPI.prototype.compareTime = function (first, second) {

        var result = 1;

        var ftime = first.getTime();
        var stime = second.getTime();

        if (ftime == stime)
            return 0;

        else if (ftime > stime)
            return 1;

        else return -1;
    };

    /**
     *  比较时间大小,除去时间的秒数
     *  结果：
        1: 前者大于后者
        0：前者等于后者
        -1：前者小于后者
     */
    CommonAPI.prototype.compareTimeNoSecond = function (first, second) {
        first = this.getNoSecondTime(first);
        second = this.getNoSecondTime(second);
        return this.compareTime(first, second);
    }

    /**
   *  比较日期大小
   *  结果：
      1: 前者大于后者
      0：前者等于后者
      -1：前者小于后者
   */
    CommonAPI.prototype.compareDate = function (first, second) {

        first = new Date(first.getFullYear(), first.getMonth(), first.getDate());
        second = new Date(second.getFullYear(), second.getMonth(), second.getDate());

        return this.compareTime(first, second);
    };
    /**
     * 异步加载CSS样式文件
     * @param cssFile
     */
    CommonAPI.loadCssFile = function (cssFile) {
        var path = "/m2012/css/" + cssFile,
            cssTag = document.getElementById('loadCss'),
            head = document.getElementsByTagName('head').item(0);
        if (cssTag) head.removeChild(cssTag);

        var css = document.createElement('link');
        css.href = path;
        css.rel = 'stylesheet';
        css.type = 'text/css';
        css.id = 'loadCss';
        head.appendChild(css);
    };

    /**
     * 处理公共的未知类错误
     * errorCode : 服务器端返回的错误码
     */
    CommonAPI.prototype.getUnknownExceptionInfo = function (errorCode) {
        var msg = "";
        switch (errorCode) {
            case 1:
                msg = "保存失败，同名标签已存在!";
                break;
            case 4:
                msg = "您输入的邮箱地址错误或不是139邮箱地址";
                break;
            case 5:
                msg = "添加的日历个数已经超过10个";
                break;
            case 7:
                msg = "日历不能共享给自己";
                break;
            case 15:
                msg = "此作者名已被占用，请输入其他作者名";
                break;
            case 17:
                msg = "日历名称已经存在";
                break;
            case 108:
                msg = "添加的内容含敏感词，请重新输入";
                break;
            case 126:
                msg = "添加的内容含敏感词，请重新输入";
                break;
            case 911:
                msg = "您添加太频繁了，请稍后再试";
                break;
            default:
                msg = "";
                console && console.log('errorcode: ' + errorCode);
                break;
        }

        return msg;
    };

    //获取开始与结束时间
    // 从老的transform的代码中迁移过来
    CommonAPI.prototype.getTime = function (startTime, endTime) {

        var sTime = null, eTime = null;
        //var date = $Date.parse("2012-10-11 00:59:11");//test
        var date = new Date();
        //
        var min = date.getMinutes();
        var hour = date.getHours();


        //下面需要优化
        var startHour = hour;
        if (hour < 21) {
            startHour = hour + 1;
        } else {
            startHour = hour;
        }

        if (!startTime) {
            if (hour < 21) {
                if (min >= 30) {
                    min = "30";
                } else {
                    min = "00";
                }
            } else {
                if (min >= 30) {
                    min = "00";
                    startHour = hour + 1;
                } else {
                    min = "30";
                }
            }
            startHour = startHour > 23 ? 23 : startHour;
            sTime = '' + startHour + min;
        } else {
            sTime = startTime;
        }

        if (!endTime) {
            var endHour = startHour + 1;
            endHour = endHour > 23 ? 23 : endHour;

            if (startHour == 23) {
                min = "30";
            }
            eTime = '' + endHour + min;
        } else {
            eTime = endTime;
        }


        return {
            startTime: M2012.Calendar.CommonAPI.Utils.fixTimeToHour(sTime),
            endTime: M2012.Calendar.CommonAPI.Utils.fixTimeToHour(eTime)
        }
    };

    /**
     * 添加行为日志
     * 本次重构建议用统一的XML配置方式进行key调用
     */
    CommonAPI.prototype.addBehavior = function (key) {

        if (!key) {
            throw "behavior argument is empty";
        }


        if (!window.ISOPEN_CAIYUN) {
            if (typeof key != "string") {
                //仅提示,不报错,有一些特殊场景可能会用到,自己遵循使用key来上报即可
                top.$App.logger.info("behavior argument is not string");
            }
            top.M139.Logger.logBehavior(key);
        }
    };

    /**
     * @param {String}  s //要剪切的字符串;
     * @param {Number}  length //要剪切的字节长度，中文长度为2;
     * @param {Boolean}  suffix //是否携带省略号;
     */
    CommonAPI.prototype.substrAsByte = function (s, length, suffix) {

        if (!s)
            return "";

        var pn = /[^\x00-\xff]/i;
        var chars = [];
        var counts = 0;
        var c = '';
        for (var i = 0; i < s.length; i++) {
            c = s.substr(i, 1);
            counts += pn.test(c) ? 2 : 1;
            chars.push(c);
            if (counts >= length) {
                if (suffix)
                    chars.push("...");
                break;
            }
        }

        return chars.join("");
    }

    //单实例
    var _this = this;
    M2012.Calendar.CommonAPI.getInstance = function () {
        if (!_this.commonApi) {
            _this.commonApi = new M2012.Calendar.CommonAPI(); //实例化到M139下面,目前所有的类都有显式传入M139
        }

        return _this.commonApi;
    };

    /**
     * 拼接完整的时间字段:"2014-04-25 00:00:00",满足最新的需求
     * @param date  "2010-12-12"
     * @param setTime 设置时间
     */
    CommonAPI.prototype.getCompleteTime = function (date, setTime) {
        return date + " " + setTime + ":00";
    };

    /**
     * 获取当前用户的邮件地址域
    **/
    CommonAPI.prototype.getEmailDomain = function () {
        var email = top.$User.getDefaultSender();
        if (email)
            return top.$Email.getDomain(email);
        return "139.com";
    }
})(jQuery, _, M139, window._top || window.top);
﻿
; (function ($, _, M139, top) {

    var commonApi = M2012.Calendar.CommonAPI.getInstance();

    var className = "M2012.Calendar.View.TimeSelector";

    //#region 菜单数组,计算一次并缓存,防止多次new实例的时候都要计算
    var hourItems = (function () {
        var coll = [], i;
        for (i = 0; i < 24; i++) {
            coll.push({
                text: commonApi.padding(i, 2),
                data: i //number
            });
        }
        return coll;
    })();
    var minuteItems = (function () {
        var coll = [], i;
        for (i = 0; i < 6; i++) {
            var num = i * 10;
            coll.push({
                text: commonApi.padding(num, 2),
                data: num
            });
        }
        return coll;
    })();
    //#endregion

    M139.namespace(className, Backbone.View.extend({
        name: className,
        configData: {
            initData: {

            },
            hour: {
                name: "hour",
                max: 23,
                width: 65,
                height: "145px",
                items: _.clone(hourItems)
            },
            minute: {
                name: "minute",
                max: 59,
                width: 50, //没有滚动条,不需要这么宽
                height: "auto",
                items: _.clone(minuteItems)
            }
        },
        template: {
            MAIN: '<span class="textTimeOther ml_5"><input name="hour" type="text" value="00" maxlength="2"> : <input name="minute" type="text" value="00" maxlength="2"></span>',
            MAIN2: '<div class="createInput_right"><input name="hour" type="text" value="00" maxlength="2">:<input name="minute" type="text" value="00" maxlength="2"></div>',
            selectedClass: 'ses'
        },
        /*
         * 时间组件
         * var timeSelector = new M2012.Calendar.View.TimeSelector({
         *     container:$("#divId"), //需要展示的容器,必选参数
         *     hour:'08',   //时间,可选参数,传入hour和minute,优先选择此选项
         *     minute:'00',
         *     //time:"0800", //时间,可选参数,可以直接把时间传递进来
         *     onChange:callback, //时间变化时触发的回调,可选参数
         *     style:'MAIN2', //MAIN2的样式,大写,对照template中的key
         *     action: 'append', //是html还是append
         * 
         *     width:"140px" //超哥要求的
         * });
         * 
         * 有2中方法获取数据,第一种是上面的传递onChange方法实时监听,第二种是调用getData方法
         * var data = timeSelector.getData();
         */
        initialize: function (options) {
            options = options || {};
            var _this = this;
            _this.options = options;
            _this.container = options.container;
            if (!_this.container) {
                return;
            }

            _this.model = new Backbone.Model(_this.configData.initData);

            _this.render();
            _this.bindEvents();
            _this._initData();
        },
        render: function () {
            var _this = this,
                width = _this.options.width;

            //  _this.container.html(_this.template.MAIN);
            var dom = _this.template.MAIN;
            var style = _this.options['style'];
            if (!!style && _this.template[style]) {
                dom = _this.template[style]
            }

            _this.currentEl = $(dom).appendTo(_this.container);

            if (undefined !== width) {
                _this.currentEl.css("width", width);
            }

            _this.input = _this.currentEl.find("input");
            _this.hour = _this.currentEl.find("input[name='hour']");
            _this.minute = _this.currentEl.find("input[name='minute']");
        },
        bindEvents: function () {
            var _this = this,
                model = _this.model;

            _this.input.off("blur click").on("blur", function () {
                var input = $(this),
                    name = input.attr("name");
                if (!!name) {
                    _this.onBlur(name); //更新数据
                }
            }).on("click", function () {
                var input = $(this),
                    name = input.attr("name"),
                    data = _this.configData[name],
                    items = (data && data.items) || [];
                var menu;

                input.addClass(_this.template.selectedClass);//选中后的样式背景色

                if (data && items.length > 0) {
                    menu = new M2012.Calendar.View.CalendarPopMenu().create({
                        dockElement: input,
                        //direction:'down'
                        items: items,
                        width: data.width,
                        maxHeight: data.height,
                        onItemClick: function (item) {
                            var num = item.data;
                            input.val(commonApi.padding(num, 2));
                            model.set(name, num);
                        }
                    });

                    //输入时,移除menu
                    input.on("keydown", function () {
                        input.off("keydown");
                        menu && menu.remove && menu.remove();
                    });
                }
                input.select();
            });

            //可能存在需求,在变更时触发回调
            model.on("change:hour change:minute", function () {
                if (_this.timer) {
                    window.clearTimeout(_this.timer);
                }
                //延迟一下,可以缓解多个值变更时触发多次,造成请求多次的问题
                self.timer = window.setTimeout(function () {
                    var callback = _this.options.onChange;
                    if (_.isFunction(callback)) {
                        callback(_this.getData());
                    }
                }, 0x64);

            });
        },
        _initData: function (options, silent) {
            var _this = this;

            options = options || _this.options;

            var hour = options.hour,
                minute = options.minute,
                time = options.time;

            if (typeof hour == 'number' && typeof minute == 'number') { //不能用!!hour和!!minute,因为可以为0
                //优先选取传递的hour和minute
                hour = Number(hour);
                minute = Number(minute);
            } else if (!!time) {
                //其次选取传递的time信息,如果time有唔,如2500,则会出bug,如果是abcd这样的time,会被Number成0
                time = commonApi.padding(Number(time), 4);
                hour = Number(time.slice(0, 2));
                minute = Number(time.slice(2, 4));
            } else {
                //未传递时间,根据产品需求,获取最近的一个可选择的时间点
                var data = _this.closestDate();
                hour = data.hour;
                minute = data.minute;
            }

            //显示
            _this.hour.val(commonApi.padding(hour, 2));
            _this.minute.val(commonApi.padding(minute, 2));

            _this.model.set({ hour: hour, minute: minute }, { silent: true }); //不触发,防止初始化的时候触发2次
            if (!silent) {
                _this.model.trigger("change:hour"); //因为上面没触发,这里触发一次回调
            }
        },
        setData: function (data, silent) {
            if (typeof silent == undefined) silent = true;
            this._initData(data, !!silent); //透传,公开setData,不公开_initData
        },
        closestDate: function (date) {
            //根据产品需求,获取最近的一个可选取的时间点
            var _this = this;
            date = (date && new Date(date)) || new Date(); //clone or new 

            var hour = date.getHours(),
                minute = date.getMinutes();
            hour += Math.ceil(minute / 60);
            minute = Math.floor(minute / 30) * 30;

            return {
                hour: hour % 24, //跨天的,要清零.如24点,要变成0点
                minute: minute
            };
        },
        onBlur: function (type) {
            //param type accept: hour/minute
            var _this = this;
            var input = _this[type],
                val = input.val(),
                max = _this.configData[type] && _this.configData[type].max;

            var number = val;
            if (/[^0-9]/.test(val)) {
                //如果有英文字符
                val = _this.model.get(type); //还原
                number = val;
            }

            if (Number(number) > Number(max)) { //大于最大可选择的数字
                number = max;
            }

            number = Number(number); //转成数字,以防止前面太多的0
            input.val(commonApi.padding(number, 2)); //可能是个位数

            _this.model.set(type, number);
            input.removeClass(_this.template.selectedClass);
        },
        getData: function () {
            var _this = this;
            //获取数据
            var hour = _this.model.get("hour"),
                minute = _this.model.get("minute"),
                shour = commonApi.padding(hour, 2),
                sminute = commonApi.padding(minute, 2);

            return {
                hour: hour,
                minute: minute,
                time: shour + sminute,
                text: shour + ":" + sminute
            };
        },
        hide: function () {
            //this.currentEl.find(".textTimeOther").addClass("hide");
            this.currentEl.addClass("hide");
        },
        show: function () {
            //this.currentEl.find(".textTimeOther").removeClass("hide");
            this.currentEl.removeClass("hide");
        }
    }));

    ////#region 使用方法,测试用
    //$(function () {
    //    setTimeout(function () {
    //        new M2012.Calendar.View.TimeSelector({
    //            container: $("#ul_action"),
    //            hour: 9,
    //            minute: 38,
    //            onChange: function (data) {
    //                console.log("%s 触发时间变化", new Date().getTime(), data);
    //            }
    //        });
    //    },1000);
    //});
    ////#endregion

})(jQuery, _, M139, window._top || window.top);
﻿/**
 *当鼠标移出下拉菜单区域时,左键弹出组件关闭
 *不修改父类公共的组件,使用继承覆盖的方式
 */
;(function ($, _, M139, top) {
    var superClass = M2012.UI.PopMenu;
    var _class = "M2012.Calendar.View.CalendarPopMenu";//我的地盘
    M139.namespace(_class, superClass.extend({
        initialize: function (options) {
        },
        create : function (options) {
            var menu = M2012.UI.PopMenu.create(options);
            this.initEvents(menu);
        },
        initEvents: function(menu) {
            $(menu.el).hover(function() {
            },function() {
                // 移出事件
                menu.remove();
            });
        }
    }));
})(jQuery, _, M139, window._top || window.top);

/**公共的提醒方式组件**/
(function ($, _, M139, top) {
    var superClass = M2012.UI.DropMenu;
    var _class = "M2012.Calendar.View.CalendarDropMenu";//我的地盘
    M139.namespace(_class, superClass.extend({
        initialize: function (options) {
        },
        create : function (options) {
            // create方法中调用了M2012.UI.PopMenu.create(options)
            var that = M2012.UI.DropMenu.create(options);
            this.initEvents(that);
            return that;
        },
        initEvents: function(that) {
            // 父类方法中点击图标之后,menu对象才会赋值
            that.$el.click(function(){
                $(that.menu.el).hover(function() {
                },function() {
                    // 移出事件,that.menu表示popmenu
                    that.menu.remove();
                });
            });
        }
    }));
})(jQuery, _, M139, window._top || window.top);

;
(function ($, _, M139, top) {
    var _super = M139.Model.ModelBase,
        _class = "M2012.Calendar.Model.CalendarDetail",
        common = new M2012.Calendar.CommonAPI(),
        api = top.M139.RichMail.API;

    M139.namespace(_class, _super.extend({
        name: _class,
        defaults: {
            //{"startDate":"2014-03-09","excludeType":"2","pageIndex":1,"pageSize":20,"comeFrom":1}
            defaultParams: {
                comeFrom: 0 //todo
            }
        },
        TIP_MSGS: {
            "isNotEmpty": "日历名称不能为空",
            "maxLength": "不能超过30个字"
        },
        initialize: function (options) {
            this.master = options.master;
        },
        /**
         * 每次调用set方法时,都会调用此方法,如果验证通过,则返回false
         * @param param
         * @returns {*}
         */
        validate: function (param) {
            var data = param.labelName;
            if (data) {
                if (data.isValidateNotEmpty && !data.value && data.value === "") {
                    return this.TIP_MSGS["isNotEmpty"];
                }

                if (data.isValidateLength && data.value && data.value.length > 30) {
                    return this.TIP_MSGS["maxLength"];
                }
            }
            return false;
        },
        getCurrentServerTime: function () {
            // 获取服务器当前系统时间(彩云版直接取客户端时间)
            return window.ISOPEN_CAIYUN ? new Date() : M139.Date.getServerTime();
        },
        /**
         * 获取活动时间 如:08:00-09:00
         * @param startTime 活动开始时间
         * @param endTime 活动结束时间
         */
        getTimePeriod: function (startTime, endTime) {
            //开始时间和结束时间一样则显示一个就行
            if (startTime == endTime) {
                return common.transformTime(startTime);
            }
            return common.transformTime(startTime) + "-" + common.transformTime(endTime);
        },
        /**
         * 转化时间,如将2012年3月23日转化成2013-3-23
         * @returns {string}
         */
        getFormatServerTime: function () {
            var result = this.getCurrentServerTime().toLocaleDateString().replace(/[\u4E00-\u9FA5]/g, "-");
            return result.substring(0, result.length - 1);
        },
        callAPI: function (fnName, data, fnSuccess, fnError) {
/**
            commonAPI.callAPI({
                data: data,
                fnName: fnName,
                master: this.master
            }, fnSuccess, fnError);*/

            api && _.isFunction(api.call) && api.call("calendar:" + fnName, data, function(response) {
                fnSuccess && fnSuccess(response["responseData"]);
            }, fnError);

            /**top.$RM.call("calendar:" + fnName, data, fnSuccess, fnError);*/
        },
        /**
         * 获取日历下的所有活动
         * @param data
         * @param fnSuccess
         * @param fnError
         */
        getCalendarsByLabel: function (data, fnSuccess, fnError) {
            data = $.extend(this.get("defaultParams"), data); //默认数据
            this.callAPI("getCalendarsByLabel", data, fnSuccess, fnError);
        },

        /**
         * 获取指定日历的详细信息
         * @param data
         * @param fnSuccess
         * @param fnError
        */
        getLabelById: function (data, fnSuccess, fnError) {
            data = $.extend({ comeFrom: 0 }, data); //默认数据
            this.callAPI("getLabelById", data, fnSuccess, fnError)
        },

        /**
         * 调用订阅接口
         */
        subcribeLabel: function (data, fnSuccess, fnError) {
            this.callAPI("subscribeLabel", data, fnSuccess, fnError);
        },
        /**
         * 调用退订接口
         */
        unSubscribeLabel: function (data, fnSuccess, fnError) {
            this.callAPI("cancelSubscribeLabel", data, fnSuccess, fnError);
        },
        /**
         * 调用接口获取订阅人数,星号等级等信息
         */
        getPublishedLabelByOper: function (data, fnSuccess, fnError) {
            this.callAPI("getPublishedLabelByOper", data, fnSuccess, fnError);
        },
        getElementSize : function (el) {
            return common.getElementSize(el);
        },
        transformTime : function (time) {
            return common.transformTime(time);
        }
    }));
})(jQuery, _, M139, window._top || window.top);

;
(function ($, _, M139, top) {
    var _super = M139.View.ViewBase,
        _class = "M2012.Calendar.View.CalendarDetail";

    M139.namespace(_class, _super.extend({
        name: _class,
        LEFT_SIDEBAR_WIDTH: 170,  // 用于订阅日历详情
        template: {
            MAIN: [
                '<div id="{cid}_outer" class="tips delmailTips createWindow" style="width:600px;z-index:5001;position: absolute;">',
                    '<a id="{cid}_delmailTipsClose" href="javascript:void(0)"><i class="i_u_close"></i></a>',
                    '<div class="tips-text">',
                        '<div class="norTips" style="padding : 24px;">',
                            '<div class="createWindowInfo">',//images\module\calendar_reminder
                                 '<div class="clearfix">',
                                     //'<a href="#"><img title="" alt="aaa" src="../../images/module/calendar2.0/pic_01.jpg"></a>',
                                     '<div class="createWindowNmae" id="{cid}_subscribeInfo">',
                                         '<h2 id="{cid}_labelName">订阅活动</h2>',
                                         '<div class="clearfix">',
                                             '<em id="{cid}_publishInfo">',
                                                  '<span>发布</span> | 人 ',
                                                  '<span>订阅</span>',
                                             '</em>',
                                             '<span class="starFive" >',
                                                 '<span class="starbg"></span>',
                                                 '<span id="{cid}_level" class="starNum"></span>',
                                             '</span>',
                                         '</div>',
                                         /**
                                         '<div class="timeToRemind" id="{cid}_remaind_sms" style="display:none">',
								            '<input type="checkbox" id="{cid}_check_sms" checked><label for="{cid}_check_sms">免费短信提醒</label>',
								            '<p>前一天12：00下发提醒</p>',
							            '</div>',*/
                                         '<div class="timeToRemindOne" id="{cid}_remaind_sms" style="display:none">',
                                             '<div class="fl mt_3">',
                                                 '<input type="checkbox" id="{cid}_check_sms"><label for="{cid}_check_sms">设置提醒</label>',
                                             '</div>',
                                             '<div style="width:80px;display:none;" class="dropDown-ymtime ml_10" id="{cid}_remind_type"></div>',
                                             '<div class="dropDown-ymtime mt_5" style="display:none;" id="{cid}_remind_time"></div>',
                                             '<div class="dropDown-ymtime mt_5" id="{cid}_time" style="margin-left:7px;display:none;"></div>',
                                         '</div>',
                                     '</div>',
                                 '</div>',
                                 '<p>该日历有以下活动，你可以订阅整个日历。</p>',
                                 '<table class="createTableList mt_10" role="grid">',
                                    '<thead>',
                                        '<tr>',
                                            '<th>时间</th>',
                                            '<th>活动</th>',
                                        '</tr>',
                                    '</thead>',
                                 '</table>',
                                 '<div class="createWindowScroll createWindow_scroll" id="{cid}_contentArea">',
                                     '<table class="createTableList" role=grid>',
                                         '<tbody></tbody>',
                                         '<tfoot style="display:none;"><tr><td colspan="2"></td></tr></tfoot>',
                                     '</table>',
                                 '</div>',
                            '</div>',
                        '</div>',
                        '<div class="delmailTipsBtn" style="asdasdoverflow:hidden;">',
                            '<div style="TOP: -35px; RIGHT: 20px;display:none;" class="tips" id="{cid}_tips">',
                                '<div class="tips-text"><i class="i_ok_min"></i><span></span></div>', //订阅成功
                                '<div class="tipsBottom diamond"></div>',
                            '</div>',
                            '<div id="{cid}_btn_mask" style="position:absolute; top:0px; height:30px; top:10px; z-index:1000;" class="blackbanner hide"></div>',
                            '<a class="btnSetG" role=button href="javascript:;" id="{cid}_btn_subscribe"><span>订 阅</span></a>',
                            '<a class="btnSetG" role=button href="javascript:;" id="{cid}_btn_save" style="display:none;"><span>保 存</span></a>',
                            '<a class="btnSet" role=button href="javascript:;" id="{cid}_btn_unSubscribe" style="display:none;"><span>退 订</span></a>',
                            '<a class="btnSet" role=button href="javascript:;" id="{cid}_btn_cancel"><span>取 消</span></a>',
                        '</div>',
                    '</div>',
                '</div>'].join(""),
            DETAIL: ['<tr>',
                            '<td colSpan="2">',
                                '<div class="createTableBox">',
                                    '<div class="createTableTop clearfix">',
                                        '<div class="createTableOne"><i class="i-cHide"></i>{timePeriod}</div>',
                                        '<div class="createTablTwo">{title}</div>',
                                    '</div>',
                                    '<ul class="createTableCon hide">',
                                        '<li class="clearfix" style="display : {isShowContent}">',
                                            '<span>内容：</span>',
                                            '<div class="createTableInfo" style="word-wrap:break-word; word-break:break-all;">{content}</div>',
                                        '</li>',
                                        '<li style="display : {isShowSite}">',
                                            '<span>地点：</span>',
                                            '<div class="createTableInfo">{site}</div>',
                                        '</li>',
                                        '<li class="createTableNo" style="display : {isShowNo}">无更多信息 </li>',
                                    '</ul>',
                                '</div>',
                            '</td>',
                        '</tr>'
            ].join(""),
            ELEMENTS: '<tr><td class="tbBg" colSpan="2">{calendarTime}</td></tr>',//2014年01月17日,
            LIMIT_SECONDS: 3000, // "订阅"或"退订"提示信息在间隔时间后消失
            PAGE_SIZE: 20
        },
        logger: new top.M139.Logger({
            name: "M2012.Calendar.View.CalendarDetail"
        }),
        initialize: function (options) {
            options = options || {};
            var that = this;

            this.model = new M2012.Calendar.Model.CalendarDetail(options);

            this.labelId = Number(options.labelId) || 0; // 日历ID
            this.count = 0; // 计数器，用于记录已经填充的数据条数
            this.pageIndex = 2; // 默认值,默认从第二页开始,如果有多页的话
            this.containerHeight = $(top.document.body).height();
            this.wrap = options.wrap || top.window.document.body;
            this.subscribeFn = options.subscribe || $.noop; //订阅成功的回调
            this.unsubscribeFn = options.unsubscribe || $.noop; //退订成功后的回调
            this.createDetailWindow();

            this.defineElement();
            this.setPosition();// 设置弹出窗口的位置
            this.fillSubscribeInfo(); // 填充弹出窗口顶部的订阅信息
            //this.setPosition();// 设置弹出窗口的位置
            this.showMask();
            this.initEvent(); // 给tfoot绑定事件

            // 设置this.$el,绑定事件
            this.$el = this.outerEl;

            // 初始值,从第一页开始查询
            this.getCalendarsByLabel({
                pageIndex: 1,
                //includeLabels: this.labelId,
                labelId: this.labelId,
                //startDate : this.model.getFormatServerTime(),
                pageSize: this.template.PAGE_SIZE
            });
            $(top.window).resize(function () {
                that.setPosition();
            });

            var remindTypeElement = that.getElement("remind_type"),
                timeElement = that.getElement("remind_time"),
                timeSelectorElement = that.getElement("time"),
                typeItems = [{text : '邮件', value : '01'}, {text : '免费短信', value : '10'}];

            // 创建一个选择时间间隔的下拉菜单
            that.typeComp = new M2012.Calendar.View.CalendarDropMenu().create({
                container: remindTypeElement,
                menuItems: typeItems,
                selectedIndex: 0,
                width: 80,
                maxHeight: 50
            });

            // 设置默认值,提醒方式为邮件提醒
            that.model.set({
                remindType: "01"
            }, {silent: true});

            that.typeComp.on("change", function (item) {
                that.model.set({
                    remindType: item.value
                }, {silent: true});
            });

            var timeItems = [{
                data : {
                    beforeType : 2,
                    beforeTime : 0
                },
                text : '同一天',
                value : '0-2'
            },{
                data : {
                    beforeType : 2,
                    beforeTime : 1
                },
                text : '前一天',
                value : '1-2'
            }, {
                data : {
                    beforeType : 2,
                    beforeTime : 2
                },
                text : '前二天',
                value : '2-2'
            }, {
                data : {
                    beforeType : 2,
                    beforeTime : 3
                },
                text : '前三天',
                value : '3-2'
            }];

            that.timeComp = new M2012.Calendar.View.CalendarDropMenu().create({
                container: timeElement,
                menuItems: timeItems,
                selectedIndex: 1, // 默认选中"前一天"
                width: 75,
                maxHeight: 100
            });

            // 设置默认值, 间隔为同一天
            // beforeType : 提前类型(0分, 1时, 2天, 3周, 4月 )
            that.model.set({
                time: "0-2"
            }, {silent: true});

            that.timeComp.on("change", function (item) {
                that.model.set({time : item.data.beforeTime + "-" + item.data.beforeType}, {silent: true});
            });

            // 创建新的时间选择控件
            that.timer = new M2012.Calendar.View.TimeSelector({
                container: timeSelectorElement,
                time: '0800',
                onChange: function (data) {
                    that.model.set({
                        timeSelector: data.time || ""
                    }, {silent: true});
                }
            });
            // 是否是订阅的公共日历
            that.model.set("isPublish", !!options.isOffical);
        },
        /**
         * 填充表格数据
         * @param detail
         */
        render: function (detail) {
            var that = this,
                data = detail["var"] ? detail["var"].table : {},
                arr = [],
                allCount = detail["var"] ? detail["var"].count : 0,
                calendars = _.groupBy(data, 'startDate'); //按活动的startDate属性进行分组

            // 遍历
            if (calendars && data) {
                for (var calendar in calendars) {
                    if (calendars.hasOwnProperty(calendar)) {
                        var dateListArr = [].slice.call(calendars[calendar]); // 每天的活动
                        // 添加活动信息
                        arr.push($T.format(that.template.ELEMENTS, { calendarTime: calendar }));
                        if (that.old_startDate && that.old_startDate === calendar) {
                            // 如果本页的活动属于上一页最后一条记录(时间)的活动,则不重复创建记录,直接在之前的记录基础上添加
                            arr = [];
                        }

                        if (dateListArr instanceof Array) {
                            for (var i = 0, len = dateListArr.length; i < len; i++) {
                                var calendarInfo = dateListArr[i];
                                // 添加活动详情信息
                                calendarInfo && arr.push($T.format(that.template.DETAIL, that.isShowElement(calendarInfo)));
                                that.count++;
                            }
                        }
                    }

                    // 保存当前页最后一条记录的startDate
                    // 判断点击下一页的活动是否属于上一页最后一条记录(时间)的活动
                    that.old_startDate = calendar;
                }
            }

            // 记录条数超过当页显示条数并且不超过总条数时才会显示tfoot
            // 刚好总条数等于20
            //(that.count !== allCount && that.count + 1 > that.template.PAGE_SIZE) && (((that.count <= allCount) ? that.footTdEl.html("显示更多内容") : that.footTdEl.html("以显示全部内容")) && that.footEl.show());
            //(allCount > that.template.PAGE_SIZE) && (((that.count <= allCount) ? that.footTdEl.html("显示更多内容") : that.footTdEl.html("以显示全部内容")) && that.footEl.show());

            that.showFootContent(allCount);
            $(arr.join("")).appendTo($(that.bodyEl));
        },

        /**
         * 渲染表格foot
         */
        showFootContent: function (allCount) {
            var that = this;

            if (allCount > that.template.PAGE_SIZE) { //超过一页
                if (that.count < allCount) { // 没有查找到最后
                    that.footTdEl.html("显示更多内容");
                    that.footEl.css("cursor", "pointer");
                } else if (that.count === allCount) {
                    that.footTdEl.html("已经显示全部内容");
                    that.footEl.unbind("click").css("cursor", "default");
                }

                that.footEl.show(); // 防止重复绑定
            }
        },
        getCalendarsByLabel: function (data) {
            var that = this;

            that.model.getCalendarsByLabel(data,
                function (detail, text) {
                    that.render(detail);
                    that.bindEvent();
                }, function () {
                    console.log('fnError');
                });
        },
        /**
         * 初始化时就可以绑定
         */
        initEvent: function () {
            var that = this;

            that.unSubscribeBtnEl.click(function () {
                that.unSubscribe();
            });

            that.subscribeBtnEl.click(function () {
                that.subscribe({
                    needNotify : true  // 是否需要通知主控做一些事情(后台发布的订阅日历只需要"保存"), 用来区分
                });
            });

            that.getElement("delmailTipsClose").click(function () {
                that.cancel();
            });

            that.saveBtnEl.click(function (e) {
                that.subscribe();
            });

            that.cancelBtnEl.click(function () {
                that.cancel();
            });

            that.footEl.bind("click", function (e) {
                that.getCalendarsByLabel({
                    pageIndex: that.pageIndex++,
                    //startDate : that.model.getFormatServerTime(),
                    pageSize: that.template.PAGE_SIZE
                });
            });

            that.smsCheckboxEl.click(function() {
                // 复选框按钮绑定事件
                that.model.set("enable", $(this).is(":checked"));
            });

            that.model.on("change", function () {
                if (that.model.hasChanged("enable")) {
                    var enable = that.model.get("enable");

                    // 设置提醒按钮是否选中
                    that.smsCheckboxEl.attr("checked", enable);

                    // 如果enable为true时, 显示设置条件
                    enable ? that.remindSms.children().show() : that.remindSms.children().not(":first").hide();
                }

                if (that.model.hasChanged("isPublish")) {
                    var isPublish = that.model.get("isPublish");
                    // 是否显示设置提醒时间
                    isPublish && that.remindSms.show();
                }

                if (that.model.hasChanged("remindType")) {
                    var remindValue = that.model.get("remindType");
                    // 是短信提醒还是邮件提醒, 01 : 邮件提醒  10: 免费短信提醒
                    that.typeComp && that.typeComp.setSelectedValue(remindValue);
                }

                if (that.model.hasChanged("timeSelector")) {
                    // 设置提醒时间控件的内容
                    var timeSelector = that.model.get("timeSelector");
                    that.timer && that.timer.setData({
                        time : timeSelector
                    });
                }

                if (that.model.hasChanged("time")) {
                    var time = that.model.get("time");
                    that.timeComp && that.timeComp.setSelectedValue(time);
                }

                if (that.model.hasChanged("isShowSaveBtn")) {
                    var isShowSaveBtn = that.model.get("isShowSaveBtn");
                    if (isShowSaveBtn) {
                        // 如果是"已经订阅的后台发布日历", 则显示保存按钮, 隐藏取消按钮
                        that.saveBtnEl.show();
                        that.unSubscribeBtnEl.show();
                        that.cancelBtnEl.hide();
                        that.subscribeBtnEl.hide();
                    }else{
                        // "还未订阅的日历"
                        that.saveBtnEl.hide();
                        that.unSubscribeBtnEl.hide();
                        that.subscribeBtnEl.show();
                        that.cancelBtnEl.show();
                    }
                }
            });
        },
        /**
         * 给整个td绑定点击事件,提供伸缩的功能
         * 在成功回调之后才绑定
         */
        bindEvent: function () {
            var that = this,
                recordsEl = this.outerEl.find("table tbody tr td").not(".tbBg");
            recordsEl.unbind("click").bind("click", function (e) {
                that.toggleDetailContent(e);
            });
        },

        /**
         * 根据title,content的值判断如何显示详情,当title,content都为空时,显示"无更多信息"
         * @param calendar
         * @returns {{content: (*|html.content|obj.content|content|objItem.content|data.content), site: (*|obj.site|window.LinkConfig.mobileWeibo.site|data.account.site|data.sign.site|data.editLockPass.site), title: (*|obj.title|title|html.title|jQuery.title|template.title), isShowContent: string, isShowSite: string, isShowNo: string}}
         */
        isShowElement: function (calendar) {
            return {
                content: calendar.content,
                site: calendar.site,
                title: calendar.title,
                timePeriod: this.model.getTimePeriod(calendar.startTime, calendar.endTime),
                isShowContent: !!calendar.content ? "" : "none",
                isShowSite: !!calendar.site ? "" : "none",
                isShowNo: !(!!calendar.content || !!calendar.site) ? "" : "none"// 只有content,site都为空时才显示
            };
        },
        getElement: function (id) {
            var that = this;
            id = $T.format("#{cid}_{id}", {
                cid: that.cid,
                id: id
            });
            return $(id, top.document);
        },
        defineElement: function () {
            this.outerEl = this.getElement("outer");
            this.unSubscribeBtnEl = this.getElement("btn_unSubscribe");
            this.subscribeBtnEl = this.getElement("btn_subscribe");
            this.saveBtnEl = this.getElement("btn_save");
            this.cancelBtnEl = this.getElement("btn_cancel");
            this.smsCheckboxEl = this.getElement("check_sms");
            this.btn_mask = this.getElement("btn_mask");
            //  this.btn_mask.height(this.btn_mask.parent().height());
            // 内容显示区域
            this.contentAreaEl = this.outerEl.find("#" + this.cid + "_contentArea");

            this.tipsEl = this.outerEl.find("#" + this.cid + "_tips");
            this.bodyEl = this.contentAreaEl.find("table tbody"); // 不能在outerEl查找,在360和搜狗浏览器下会查找出多个元素
            this.footEl = this.contentAreaEl.find("table tfoot"); // 不能在outerEl查找,在360和搜狗浏览器下会查找出多个元素
            this.footTdEl = this.footEl.find("td");

            // 页面顶部的订阅信息节点
            this.publishInfoEl = this.outerEl.find("#" + this.cid + "_publishInfo");
            this.labelNameEl = this.outerEl.find("#" + this.cid + "_labelName");
            this.levelEl = this.outerEl.find("#" + this.cid + "_level");
            this.remindSms = this.outerEl.find("#" + this.cid + "_remaind_sms");

            // 操作失败时的提示信息
            this.fnFailure = function () {
                top.M139.UI.TipMessage.show("操作失败，请重试", {
                    delay: 3000,
                    className: "msgRed"
                });
            };
        },
        showMask: function () { // 显示遮罩层
            var zIndex = this.outerEl.css("z-index") - 1;
            this.mask = top.M2012.UI.DialogBase.showMask({
                zIndex: zIndex
            });
            //this.outerEl.css("visibility", "");
        },
        hideMask: function () { // 隐藏遮罩层
            this.mask && this.mask.hide();
        },
        adjustContentHeight: function () { // 调整内容区域的高度(cid_contentArea)
            if (this.outerEl.height() > this.containerHeight) { // 如果窗口的高度都超过了容器的高度,则按比例调整内容区域的高度
                var height = this.contentAreaEl.height() * (this.containerHeight / this.outerEl.height());
                this.contentAreaEl.height(Math.floor(height));
            }
        },
        createDetailWindow: function () { // 创建显示详情的整体弹出窗
            var that = this,
                template = $T.format(that.template.MAIN, {
                    cid: that.cid
                });

            $(template).appendTo(this.wrap);
        },
        fillSubscribeInfo: function () { // 调用后台接口获取顶部订阅信息并填充
            var that = this;

            // 如果调用接口报异常(官方发布的公开日历), 直接取默认值
            that.model.getPublishedLabelByOper({ comeFrom: 0, seqNo: that.labelId },
                function (detail, text) {
                    var data = detail["var"];
                    if (data) {
                        // 填充订阅活动弹出窗顶部订阅信息
                        that.labelNameEl.text(data.labelName || '订阅活动');
                        that.publishInfoEl.html(data.author + " <span>发布</span> | " + (data.totalSubCount || 0) + "人 <span>订阅</span>");
                        that.levelEl.css("width", (data.activity || 0) * 15);

                        // 填充订阅信息, 如果未订阅, 显示默认后台配置的订阅信息
                        that.model.getLabelById({ labelId: that.labelId },
                            function (response) {
                                if (response["code"] === 'FS_UNKNOW') {
                                    that.model.set({
                                        enable : (parseInt(data.enable) == 1),
                                        remindType : parseInt(data.recMyEmail) ? "01" : "10",
                                        time : data.beforeTime + "-" + data.beforeType,
                                        timeSelector : (data.sendMsgTime || "08:00").replace(":", ""),
                                        isShowSaveBtn : false,
                                        color : data.color // 颜色值, 订阅时需作为参数传递
                                    });

                                    return;
                                }

                                if (response["code"] === 'S_OK') {
                                    /**
                                    var result = (response && response["var"]) || {};
                                    that.model.set({
                                        enable : (parseInt(result.enable) == 1),
                                        remindType : parseInt(result.recMyEmail) ? "01" : "10",
                                        time : result.beforeTime + "-" + result.beforeType,
                                        timeSelector : (result.sendMsgTime || "08:00").replace(":", ""), // 默认为0800
                                        isShowSaveBtn : !!result.isSubscribed && !!that.model.get("isPublish"),
                                        color : result.color // 颜色值, 订阅时需作为参数传递
                                    });*/
                                    var result = (response && response["var"]) || {};
                                    var remindType;

                                    // 如果接口中返回的recMyEmail或recMySms都为0, 则前端给它一个默认值(邮件提醒)
                                    if (parseInt(result.recMyEmail) + parseInt(result.recMySms)) {
                                        // 正常的逻辑
                                        remindType = parseInt(result.recMyEmail) ? "01" : "10";
                                    } else {
                                        // 返回值都为0时的逻辑
                                        remindType = "01";
                                    }

                                    that.model.set({
                                        enable: (parseInt(result.enable) == 1),
                                        remindType: remindType,
                                        time: result.beforeTime + "-" + (result.beforeType || 2), // beforeType默认为2, 防止可能为0的情况出现
                                        timeSelector: (result.sendMsgTime || "08:00").replace(":", ""), // 默认为0800
                                        isShowSaveBtn: !!result.isSubscribed && !!that.model.get("isPublish"),
                                        color: result.color // 颜色值, 订阅时需作为参数传递
                                    });
                                }
                            });
                    }
                }, function () {
                    console.log('fnError');
                }
            );
        },
        setPosition: function () { // 计算弹出窗口的显示位置("居中显示")
            this.adjustContentHeight();
            var clientHeight = top.document.body.clientHeight;
            var clientWidth = top.document.body.clientWidth - this.LEFT_SIDEBAR_WIDTH;
            var selfSize = this.model.getElementSize(this.outerEl);

            this.outerEl.css({
                top: clientHeight / 2 - selfSize.height / 2,
                left: clientWidth / 2 - selfSize.width / 2
            });

        },
        /**
         * 点击"订阅"按钮则按钮变成"退订"
         * 点击"退订"按钮则按钮变成"订阅"
         */
        subscribe: function (param) {
            var that = this;
            // 调用后台接口
            var obj = {
                comeFrom: 0,
                color: that.model.get("color"),
                labelId: that.labelId
            };

            // 后台发布的公共日历需要增加提醒信息设置
            if (that.model.get("isPublish")) {
                $.extend(obj, {
                    enable : that.smsCheckboxEl.is(":checked") ? 1 : 0,
                    beforeType : parseInt(that.model.get("time").split("-")[1]), // 提前类型(0分, 1时, 2天, 3周, 4月 )
                    beforeTime : parseInt(that.model.get("time").split("-")[0]),
                    recMySms : that.model.get("remindType") == "10" ? 1 : 0,
                    recMyEmail : that.model.get("remindType") == "01" ? 1 : 0,
                    sendMsgTime : that.model.transformTime(that.model.get("timeSelector"))
                });
            }

            //显示操作按钮遮罩层
            that.btn_mask.removeClass("hide");
            // 记录操作日志
            that.recordOperateLog();

            that.model.subcribeLabel(obj,
                function (response) {
                    if (response["code"] === "FS_UNKNOW") {
                        that.fnFailure();
                        //隐藏操作按钮遮罩层
                        that.btn_mask.addClass("hide");
                        return;
                    }

                    // 如果点击的是"订阅"按钮, 则要更新左侧的订阅日历列表
                    // 如果点击的是"保存"按钮, 则不需要更新, needNotify用来区分这个
                    if (param && param.needNotify) {
                        _.isFunction(that.subscribeFn) && that.subscribeFn(response);
                        top.M139.UI.TipMessage.show("订阅成功", { delay: 3000 });
                    }

                    // 隐藏操作按钮遮罩层
                    that.btn_mask.addClass("hide");
                    top.M139.UI.TipMessage.show("保存成功", { delay: 3000 });
                    that.cancel();
                }, function () {
                    that.fnFailure();
                    //隐藏操作按钮遮罩层
                    that.btn_mask.addClass("hide");
                }, function () {
                    that.fnFailure();
                    //隐藏操作按钮遮罩层
                    that.btn_mask.addClass("hide");
                }
            );
        },
        recordOperateLog : function () {
            var that = this;
            that.model.get("remindType") == "10" ? top.BH("calendar_square_smsremind") :
                top.BH("calendar_square_emailremind");
        },
        /**
         * 退订操作
         */
        unSubscribe: function () {
            var that = this;
            var obj = {
                comeFrom: 0,
                labelId: this.labelId
            };

            //显示操作按钮遮罩层
            that.btn_mask.removeClass("hide");

            that.model.unSubscribeLabel(obj,
                function (response) {
                    if (response["code"] == "FS_UNKNOW") {
                        // 如果出现异常, 重新刷新界面
                        //that.master.trigger(that.master.EVENTS.NAVIGATE, { path: "view/update" });
                        return;
                    }

                    _.isFunction(that.unsubscribeFn) && that.unsubscribeFn(response);
                    //  that.showTips();
                    top.M139.UI.TipMessage.show("退订成功", { delay: 3000 });
                    //隐藏操作按钮遮罩层
                    that.btn_mask.addClass("hide");
                    that.cancel();

                }, function () {
                    that.fnFailure();
                    //隐藏操作按钮遮罩层
                    that.btn_mask.addClass("hide");
                }, function () {
                    that.fnFailure();
                    //隐藏操作按钮遮罩层
                    that.btn_mask.addClass("hide");
                }
            );
        },
        cancel: function () {
            this.outerEl.remove();
            this.hideMask();
        },
        validate: function (element) {
            var target = element.target || event.srcElement,
                value = $(target).val();
            // 只需要验证长度
            this.setModel(value, false, true);
            $(target).val(value.substr(0, 30));
        },

        setModel: function (value, isValidateNotEmpty, isValidateLength) {

        },
        wrapParam: function () { // 封装需要传递的参数

        },
        /**
         * 做两件事情
         * 1: 展示或隐藏详细内容 2: 改变图标
         * @param e 图标元素
         */
        toggleDetailContent: function (e) {
            var target = e.srcElement || e.target,
                $tableBox = $(target).closest(".createTableBox"),
                $ul = $tableBox.find("ul"),
                $img = $tableBox.find("i"); // TODO 或许有更好的办法
            $ul.hasClass("hide") ? $ul.removeClass("hide") : $ul.addClass("hide");
            $img.hasClass("i-cShow") ? $img.removeClass("i-cShow").addClass("i-cHide") : $img.removeClass("i-cHide").addClass("i-cShow");
        }
    }));

})(jQuery, _, M139, window._top || window.top);

