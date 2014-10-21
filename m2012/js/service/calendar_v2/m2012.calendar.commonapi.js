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