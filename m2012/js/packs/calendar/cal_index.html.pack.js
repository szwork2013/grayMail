; (function ($, _, M139, top) {

    M139.namespace("M2012.Calendar.Constant", {

        //接口请求来源 0 标示来自web
        comeFrom: 0,
        //接口请求来源 8 标示来自内嵌版
        caiyunComeFrom : 8,

        defaultLabelId:10, //我的日历ID

        //接口返回的通用错误码
        codes: {
            S_OK: "S_OK",
            UNKNOW: "FS_UNKNOW",
            TIMEOUT: "FS_SESSION_ERROR"
        },

        FIFA_WORLD_CUP_ID: 8587, //2014巴西世界杯日历ID

        //活动类型
        scheduleTypes: {
            OWNER: 0, //自己创建的
            INVITE: 1, //邀请的
            SHARE: 2, //共享的
            SUBSCRIBE: 3 //订阅的
        },

        calendarTypes: {
            lunar: 20,
            calendar: 10
        },

        //日历类型
        specialType: {
            general: 0,      //普通日历
            birth: 1,        //生日
            baby: 2,         //宝宝防疫
            countDown: 3     //倒数日
        },

        //假日类型,用于左下角显示"假","班"用的
        holidayTypes: {
            "restday": 1, //1嘛,就是多一天假
            "normal": 0,
            "workday": -1 //-1,就是少一天holiday咯
        },

        activityType: {
            //自己的活动
            myself: 0,
            //邀请下的活动
            invited: 1,
            //共享下的活动
            shared: 2,
            //订阅下的活动
            subscribed: 3,
            //群活动
            group: 4
        },

        //不同活动类型对应小图标Class
        activilyIconType: {
            99: 'birthIcon',
            birthday: 'birthIcon',
            1: 'springIcon',     //指定运营账号创建日历下的活动
            4: 'baskIcon',
            5: 'footIcon',
            clock: "i-clocks",
            black_clock: "i-clock",
            unaccepted: "i_message", //未接受消息
            0: '' //特殊标记为0时,没图标样式
        },

        //提醒类型
        remindBeforeType: {
            "0": '分钟',
            "1": "小时",
            "2": "天",
            "3": "周",
            "4": "月"
        },

        //提醒方式
        remindSmsEmailType: {
            '11': '免费短信和邮件提醒',
            '10': '免费短信提醒',
            '01': '邮件提醒',
            '1': '邮件提醒'
        },

        activilyTxtColor: {
            blackColor: '#000',        //生日活动文字颜色
            unSystem: '#fff'
        },
        LEFT_SIDEBAR_WIDTH: 170,  // 用于订阅日历详情
        subscribeStatus: { // 是否订阅,0表示未订阅
            isSubscribed: 1,
            noSubscribed: 0
        },

        /**
         * 活动背景颜色对应的特效样式
         */
        activilyColors: {

            "#a2da79": "userGreen",
            "#a5a5f0": "userPurple",
            "#fcc44d": "userYellow",
            "#f399d5": "userPink",
            "#93cbee": "userDarkblue",
            "#ef7f7f": "userRed",
            "#afbecf": "userGray",
            "#7fdada": "userDarkgreen",
            "#5eabf3": "userBlue",
            "#ffb089": "userOrange",
            "#e3f4d7": "adminGreen",
            "#e4e4fa": "adminPurple",
            "#feedc9": "adminYellow",
            "#fbe0f2": "adminPink",
            "#deeffa": "adminDarkblue",
            "#fad8d8": "adminRed",
            "#e7ebf1": "adminGray",
            "#d8f4f4": "adminDarkgreen",
            "#cee6fb": "adminBlue",
            "#ffe7db": "adminOrange",
            "#6699ff": "userPurple_old",
            "#319eff": "userBlue_old",
            "#58a8b4": "userlightgreen_old",
            "#009898": "userDarkgreen_old",
            "#51b749": "userGreen_old",
            "#ff9966": "userOrange_old",
            "#cc9999": "userBrown_old",
            "#cc0000": "userRed_old",
            "#cc99cc": "userPink_old",
            "#b5bfca": "userGray_old",
            "#f9d8e1": "adminLightpink"   //生日提醒活动
        },

        /**
         * 日历视图类型
         */
        calViewTypes: {
            //月视图
            MONTH: 0,
            //日视图
            DAY: 1,
            //列表视图
            LIST: 2
        },

        //提醒时间间隔
        //0分, 1时, 2天, 3周,4月
        remindTimesEnum: {
            "不提醒": 0, '准点提醒': 0, '5分钟': 0, '10分钟': 0, '15分钟': 0, '30分钟': 0, '1小时': 1, '2小时': 1, '3小时': 1, '6小时': 1, '12小时': 1,

            '1天': 2, '2天': 2, '3天': 2, '4天': 2, '5天': 2, '6天': 2, '7天': 2
        },

        //提醒接收方式
        remindSmsEmailTypes: {
            email: { text: '邮件', value: '01' },
            freeSms: { text: '免费短信', value: '10' }
        },
        // 按日，周，月，年提醒模板
        scheduleTempMap: {
            dayTemp: 'dayTemp',
            weekTemp: 'weekTemp',
            monthTemp: 'monthTemp',
            yearTemp: 'yearTemp'
        },
        // 输入字符宽度的限制
        lengthConfig: {
            inputLength: 100,   // 输入框字符不超过100
            label_detailLength: 200 // 创建,编辑日历的日历说明中,描述字段的长度不超过200个字符
        },

        //日视图相关配置
        dayViewConf: {
            //行高
            lineHeight: 21,
            //最大显示活动条数
            maxCount: 5,
            moreCalWidth: 36 //16
        },
        // 接口响应错误代码
        errorCode: {
            //需验证码
            IDENTITY: 910,
            //频率过快
            OVER_LIMIT: 911
        },
        IDENTIFY_CODES: {
            IS_NEED_IDETIFY: 910,//需要验证码
            MORE_M30_STOP: 911,//一分钟加30次，禁止
            ERROR_INPUT_IDETIFY: 912,//验证码输入出错
            ERROR_BLACK_LIST: 913,//在黑名单中
            ERROR_OUT_DATE: 914,//验证码过期
            SESSION_TIMEOUT: 900//SESSION超时
        },
        Common_Config : { // 可以共用的一些配置
            Max_Labels_Sum : 10,  // 最多可以快捷创建的日历数目
            Shortcut_setTime_Height : "23px" // 架构调整后的设置时间控件的高度,加这个配置是考虑兼容性的问题(暂时在快捷创建活动中有用到)
        },
        Discovery_Config : { // 日历广场中用到的一些配置
            IS_SAVE_CALENDARMENU_STATUS : "isSaveMenuStatus"   // 是否需要保持"日历菜单"的状态:"展开"/"伸缩"
        },
        LeftMenu_Config : {// 左侧菜单栏中用到的一些配置
            IS_SAVE_CALENDARMENU_STATUS : "isSaveMenuStatus",   // 是否需要保持"日历菜单"的状态:"展开"/"伸缩"
            IS_OPEN_STATUS : "isOpenStatus",  // 日历菜单的状态:"展开"/"伸缩"
            ICON_RIGHT : "t_globalRight", // 向右小箭头样式
            ICON_DOWN : "t_globalDown",   // 向下小箭头样式
            INASIDE_BUG : 'inAsideBug'    // 修复IE6下左侧菜单栏遮挡日月视图的问题
        },
        Invited_Activity_Status : { // 邀请活动持有的四种状态
            0 : "未回复",
            1 : "已接受",
            2 : "已谢绝",
            3 : "已删除"
        }
    });

})(jQuery, _, M139, window._top || window.top);
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
﻿/**
 * 主视图管理器
 * Created by lizy on 14-4-1.
 */

(function ($, _, M139, top) {

    //{ #region 模板变量

    var container = $("#pnlView");
    var viewCache = {};
    viewCache['main'] = $("#viewpage_main");

    var tplPage = [
        '<div id="viewpage_$name$" class="js_viewpage">',
            '<div id="divTable" class="table_content" style="height:700px">',
                '<div id="divWaiting">',
                    '<div class="bg-cover"></div>',
                    '<div class="noflashtips inboxloading loading-pop" id="">',
                        '<!--[if lte ie 7]><i></i><![endif]-->',
                        '<img src="../../images/global/load.gif" alt="" style="vertical-align:middle">正在载入中，请稍候.....',
                    '</div>',
                '</div>',
            '</div>',
        '</div>'].join("");

    var tplFrame = '<iframe scrolling="auto" class="cal-iframe" name="calpage" frameborder="no" width="100%" id="cal_page_$name$" ></iframe>'; //onload="cal_page_$name$_loaded"

    var mapPagePack = {
        'main': { type: 'view' },
        'discovery': { type: 'module', url: '/calendar/cal_index_discovery_async.html.pack.js' },
        'subsc_act': { type: 'module', url: '/calendar/cal_special_activity_async.html.pack.js' },
        'invite_share_act': { type: 'module', url: '/calendar/cal_special_activity_async.html.pack.js' },
        'detail': { type: 'module', useContact: true, url: '/calendar/cal_edit_activity_async.html.pack.js' },
        'search': { type: 'module', url: '/calendar/cal_index_search_async.html.pack.js' },
        'message': { type: 'module', url: '/calendar/cal_index_message_async.html.pack.js' },
        'labelmgr': { type: 'module', url: '/calendar/cal_labelmanage.html.pack.js' },
        'label': { type: 'module', useContact: true, url: '/calendar/cal_edit_label.html.pack.js' },    // 编辑,创建日历
        'sharelabel': { type: 'module', url: '/calendar/cal_edit_sharelabel.html.pack.js' },    // 编辑共享日历
        'grouplabel': { type: 'module', useContact: true, url: '/calendar/cal_grouplabel.html.pack.js' },
        "groupactivity": { type: 'module', useContact: true, url: '/calendar/cal_index_groupactivity_async.html.pack.js' }
    };

    var _class = "M2012.Calendar.View.ViewManager";
    /**
     * 视图管理器
     */
    M139.namespace(_class, function (args) {
        var master = args && args.master || window.$Cal;
        this.logger = new M139.Logger({ name: _class });

        /**
      * 获取视图配置信息
      * @param name
      * @param args
      * @returns {boolean}
      */
        this.getPackView = function (name, args) {
            var pack = mapPagePack[name];
            if (_.isUndefined(pack)) {
                this.logger.error('page not found', name);
                return null;
            }
            return pack;
        };

        /**
        * 显示缓存中的视图
        * @param name
        * @param args
        * @returns {boolean}
        */
        this.showInCache = function (name, args) {
            var self = this;
            var EVENTS = master.EVENTS;
            var viewObj = viewCache[name];
            var isCache = !!viewObj;
            args = args || {};

            if (isCache) {

                var type = viewObj.data("type");
                var isPage = type == "page";
                if (viewObj.is(":visible") && !isPage) { //iframe刷新一下,否则可能会保留原先的数据
                    master.trigger(EVENTS.VIEW_SHOW, { name: name, container: viewObj, status: 'change:args', args: args });
                    return true;
                }
                container.find('.js_viewpage').hide();
                viewObj.show();

                if (isPage) {
                    //如果是内嵌页，兼容旧有逻辑，通过url传递参数
                    var url = viewObj.data("url");
                    var param = $.extend(args, { r: Math.random() }); //加个随机数，强制刷
                    url = $Url.makeUrl(url, param);
                    var frame = viewObj.find("iframe");
                    frame.attr('src', url);
                    master.trigger(EVENTS.VIEW_SHOW, { name: name, container: viewObj, status: 'change:src', args: args });

                } else {
                    master.trigger(EVENTS.VIEW_SHOW, { name: name, container: viewObj, status: 'change:visible', args: args });
                }
            }

            return isCache;
        };

        this.show = function (name, args) {
            var self = this;
            var view = self.getPackView(name, args);

            if (!view) {
                return;
            }

            //如果视图已经被创建则取缓存视图展示
            if (self.showInCache(name, args)) {
                return;
            }

            var EVENTS = master.EVENTS;
            var url = "", param = {};
            var newPage = $(tplPage.replace('$name$', name));

            args = args || {};        

            //以下是创建新的视图
            (function (func) {
                //判断当前视图依赖的Js文件是否已经被加载
                //因为一个打包的js文件中可能存在多个视图
                //对于这种情况我们只要判断有一个视图存在则说明该Js已经被加载过
                if (self.isJsResLoaded(name)) {
                    func();
                    return;
                }
                var map = mapPagePack[name];
                master.loadJsResAsync({
                    id: name,
                    url: map.url,
                    useContact: map.useContact,
                    onload: function () {
                        func();
                    }
                });

            })(function () {
                //隐藏所有展示的视图
                container.find('.js_viewpage').hide();
                //将新创建的视图容器DIV添加到页面中并存储
                container.append(newPage);
                viewCache[name] = newPage;

                var EVENTS = master.EVENTS;
                var pageContainer = container.find('#viewpage_' + name);

                //通知页面该视图已经被创建
                master.trigger(EVENTS.VIEW_CREATED, {
                    name: name,
                    container: pageContainer,
                    params: args.params || {}, //新加的传递参数,查看订阅日历活动时需要传递参数
                    onshow: function () {
                        master.trigger(EVENTS.VIEW_SHOW, {
                            name: name,
                            container: pageContainer,
                            args: args
                        });
                    }
                });
            });

        };

        /**
         *  判断视图对应的脚本资源是否已经加载
         *  @param {String}  name //视图名称
        **/
        this.isJsResLoaded = function (name) {
            var self = this;
            var url = mapPagePack[name].url;
            //遍历所有已经创建的视图
            //如果其视图依赖的js和当前视图依赖的js一致
            //说明该js已经加载，无需继续加载
            for (var view in viewCache) {
                if (mapPagePack[view].url === url)
                    return true;
            }
            return false;
        }

    });

})(jQuery, _, M139, window._top || window.top);

﻿(function ($, _, M139, top) {

    var _class = "M2012.Calendar.Router";
    M139.namespace(_class, Backbone.Router.extend({

        logger: new M139.Logger({ name: _class }),

        routes: {
            //http://localhost/#/mod/month-0/2014/3/3
            //http://localhost/#/mod/discovery-1
            //http://localhost/#/mod/activity-30

            "mod/:view-:state-:type": "loadView",
            "mod/:view-:label/:year/:month/:day": "renderView",

            "mainview": "backmainview", //不论状态，只要显示主视图
            "mainview/refresh": "refreshmainview", //主视图保持状态重载一次,只需要刷新日月列表视图时用到该方法
            "view/update": "updateview", // 左侧导航栏中快捷添加活动,需要改变主区域时用到(主区域包括主视图和非主视图)
            "mainview/:view": "mainView", //不传年月日,给toolbar里面的年月日按钮用

            "mod/:view": "pageView",

            //通过:view来区分页面，统一参数接入,统一简洁处理参数,优化过程逻辑 [其实可以把page也放到json字符串里面]
            //参数统一通过json字符串传递,可使用CommonAPI.Utils.convertToUrlParams方法格式化json
            //添加活动 #mod/detail/{action:"add","id":randomId} /* 带数据的添加活动 */
            //添加活动 #mod/detail/   /* 全新创建,如果需要刷新,参考上面的方法,加个随机数即可 */
            "mod/:view/*params": "pageView",
            //视图返回
            "view/back": "back"
        },

        //用于记录历史路径访问路径，记录最近10条记录
        _histories: [],

        initialize: function (options) {
            var self = this;
            Backbone.Router.prototype.initialize.apply(self, arguments);
            self.master = options.master;
            self.viewmanager = new M2012.Calendar.View.ViewManager({
                master: self.master
            });
        },

        /**
         * 导航到指定视图
         */
        navigateTo: function (path, args) {
            var self = this;
            //不记录视图刷新、更新和回退等路由信息
            if (!/\/(update|back)$/.test(path)) {
                self._histories.push(path);
                //只保留最新的10个路由访问记录
                if (self._histories.length > 10)
                    self._histories.splice(0, self._histories.length - 10);
            }
            self.navigate(path, args);
        },

        loadView: function (view, state, type) {
            var self = this;
            var master = self.master;
            var manager = self.viewmanager;
            var EVENTS = master.EVENTS;
            type = Number(type);

            // self.logger.debug("loadView|view=%s|state=%s|type=%s", view, state, type);

            self.master.set({
                includeTypes: [type],
                curr_view_name: view,
                curr_view_state: state
            });

            //隐藏所有的活动弹出层
            master.trigger(EVENTS.HIDE_ACTIVITY_POPS);

            if (view === "month") { //兼容跳回月视图的返回
                self.mainView(view);
                return;
            }

            manager.show(view, {
                params: {
                    state: state,
                    type: type
                }
            });

            // 如果非主视图,定义标记符,lichao新增
            self.master.set("view_location", {
                isMainView: false, // 表示是否为主视图的标记,为true表示是当前页面是主视图
                view: view,
                state: state,
                type: type
            });

        },

        mainView: function (view) {
            var self = this;
            var master = self.master;
            var manager = self.viewmanager;
            var EVENTS = master.EVENTS;

            master.trigger(EVENTS.HIDE_ACTIVITY_POPS); //隐藏所有的活动弹出层

            if (view === "render" || view == "back") {
                view = master.get("view_range_flag");
            }

            //调用视图管理器显示相应的视图
            manager.show('main', {
                subview: view
            });
        },

        /**
         * 不指定状态与视图类型，只是回到主视图最后的状态
         */
        backmainview: function () {
            var self = this;
            self.viewmanager.show("main", {
                subview: self.master.get("view_range_flag"),
                silent: true //该参数会传递到具体视图中的show事件中，可以根据该参数决定是否要刷新视图,silent为true表示无需重新刷新视图
            });
        },

        refreshmainview: function () {
            var self = this;
            self.viewmanager.show("main", {
                subview: self.master.get("view_range_flag")
            });
        },
        /**
         * 左侧菜单栏中,如果做了任何操作,需要刷新主页面时,会调用该方法
         * 分三种情况1:当前视图为主视图 2.当前视图非主视图,为新的DIV界面 3.当前视图为iframe界面
         */
        updateview: function () {
            var self = this,
                viewObj = self.master.get("view_location"),
                master = self.master,
                manager = self.viewmanager,
                events = master.EVENTS;
            if (viewObj) {
                if (viewObj.isFramePage) {
                    // 表示从老的页面迁移过来没做任何修改的页面,iframe界面
                    manager.show(viewObj.view, $.extend(viewObj.params, { r: Math.random() }));
                    return;
                }

                if (viewObj.isMainView) {
                    // 表示主视图(包括日,周,月,列表视图)
                    manager.show('main', {
                        subview: viewObj.view
                    });
                } else {
                    // 表示当前页面非主视图,比如查看,等等
                    var view = viewObj.view;

                    manager.show(view, {
                        params: {
                            state: viewObj.state,
                            type: viewObj.type
                        }
                    });

                }
            }
        },
        renderView: function (view, label, year, month, day) {
            var self = this;
            var master = self.master;
            var manager = self.viewmanager;
            var EVENTS = master.EVENTS;

            //简单容错
            label = label || master.get("labels").join(",");
            year = year || master.get("year");
            month = month || master.get("month");
            day = day || master.get("day");

            //self.logger.debug("renderView|view=%s|label=%s|%s-%s-%s", view, label, year, month, day);

            //隐藏所有的活动弹出层
            master.trigger(EVENTS.HIDE_ACTIVITY_POPS);

            //label没变，只是日期或者视图变化
            if (label !== "0") {
                var labels = label.split(',');
                master.set({
                    year: Number(year),
                    month: Number(month),
                    day: Number(day),
                    labels: labels
                });
                return;
            }

            if (view === "month") { //兼容跳回月视图的返回

                var viewParam = {
                    year: year,
                    month: month,
                    day: day
                };

                master.set(viewParam, { silent: false });
                self.mainView(view);
                return;
            }

            //调用视图管理器显示相应的视图
            manager.show(view, {
                label: label,
                year: year,
                month: month,
                day: day
            });

        },


        pageView: function (view, params) {
            var self = this;
            var master = self.master;
            var manager = self.viewmanager;
            var EVENTS = master.EVENTS;

            try {
                //尝试解码,但是传递进来的却没有编码.所以加try.否则搜索%1这样的内容会报错
                params = decodeURIComponent(params || '');
            } catch (e) { }

            //self.logger.debug("pageView|view=%s|param=%s", view, params);

            //隐藏所有的活动弹出层
            master.trigger(EVENTS.HIDE_ACTIVITY_POPS);
            params = params && M2012.Calendar.CommonAPI.Utils.convertBackUrlParams(params) || {};
            // lichao新增,如果是老页面的话,标记isFramePage为true
            master.set("view_location", { isFramePage: true, params: params, view: view }); // 老页面标志符,传递了isFramePage,就需要传递params
            manager.show(view, $.extend(params, { r: Math.random() })); //产品要求刷新页面,加个随机数
        },

        /**
         * 返回
         */
        back: function (view, params) {
            var self = this;

            if (!self._histories.length)
                return;

            //再移除当前视图所对应路由
            var currPath = self._histories.pop();
            //上一路由
            var path = self._histories.pop();
            //判断与当前路由相邻的路由是否重复，重复则移除
            //todo这个放在路由进来或回退时处理都可以，需要思考下哪里处理更好，目前先放这里
            while (true) {
                if (currPath !== path)
                    break;
                if (self._histories.length == 0)
                    break;
                path = self._histories.pop();
            }

            //导航到上级路由
            self.navigateTo(path, { replace: true, trigger: true, isBack: true });
        }
    }));

})(jQuery, _, M139, window._top || window.top);

;
(function ($, _, M139, top) {

    var superClass = M139.Model.ModelBase;

    /**
     *
     * @type {String}
     * @private
     */
    var _class = "M2012.Calendar.Model.API";
    M139.namespace(_class, M139.Model.ModelBase.extend({

        name: _class,
        defaults: {},
        EVENTS: {},

        initialize: function () {
            superClass.prototype.initialize.apply(this, arguments);
            var _this = this;
        },

        request: function (api, options) {
            function success(result) {
                if (result.status == 200) {
                    if (_.isFunction(options.success)) {
                        options.success.call(options, result.responseData, result.responseText);
                    }
                } else {
                    if (_.isFunction(options.error)) {
                        options.error.apply(options, arguments);
                    }
                }
            }

            var _options = _.extend({
                error: function (err) {
                    if (_.isFunction(options.error)) {
                        options.error.apply(options, arguments);
                    }
                }
            }, options);

            top.$RM.call(api, $.extend(options.data, {
                comeFrom: top.isCaiyun ?
                    M2012.Calendar.Constant.caiyunComeFrom :
                    M2012.Calendar.Constant.comeFrom
            }), success, _options);
        },

        //#region 标签管理

        //新建标签
        addLabel: function (args) {
            this.request("calendar:addLabel", args);
        },
        //修改标签
        updateLabel: function (args) {
            this.request("calendar:updateLabel", args);
        },
        //删除标签
        deleteLabel: function (args) {
            this.request("calendar:deleteLabel", args);
        },
        //取消标签共享
        deleteLabelShare: function (args) {
            if (typeof data == 'string') data = { labelId: data };
            this.request("calendar:deleteLabelShare", args);
        },
        //取消标签共享
        setLabelUpdateNotify: function (args) {
            this.request("calendar:setLabelUpdateNotify", args);
        },

        //订阅者设置活动变更通知方式
        setSubLabelUpdateNotify: function (args) {
            this.request("calendar:setSubLabelUpdateNotify", args);
        },
        //根据主键查询用户标签
        getLabelById: function (args) {
            if (typeof data == 'string') data = { labelId: data };
            this.request("calendar:getLabelById", args);
        },
        //查询用户标签列表
        getLabels: function (args) {
            if (typeof data == 'string') data = { actionType: data };
            this.request("calendar:getLabels", args);
        },
        //处理日历共享请求
        processShareLabelInfo: function (args) {
            this.request("calendar:processShareLabelInfo", args);
        },
        //#endregion

        //#region 日程管理

        //初始化信息
        initCalendar: function (args) {
            this.request("calendar:initCalendar", args);
        },
        //添加活动
        addCalendar: function (args) {
            this.request("calendar:addCalendar", args);
        },
        //更新活动
        updateCalendar: function (args) {
            this.request("calendar:updateCalendar", args);
        },
        //被邀请人设置个性化提醒时间
        setCalendarRemind: function (args) {
            this.request("calendar:setCalendarRemind", args);
        },
        //批量添加生日提醒
        addBirthdayCalendar: function (args) {
            this.request("calendar:addBirthdayCalendar", args);
        },
        //删除/取消日程
        delCalendar: function (args) {
            this.request("calendar:delCalendar", args);
        },
        //日程列表查询
        getCalendarListView: function (args) {
            this.request("calendar:getCalendarListView", args);
        },
        //日程视图查询
        /**
         * @param args {Object} 请求参数
         * @param args.data {Object} 需要Post到服务器的参数
         * @param args.success {Function} 需要Post到服务器的参数
         * @param args.error {Function} 需要Post到服务器的参数
         * @param args.data.startDate {String} 开始时间,如2013-11-01
         * @param args.data.endDate {String} 可选参数,结束时间,如2013-11-30
         * @param args.data.includeLabels {String} 可选参数,包含的日历Id,多个实用逗号分割
         * @param args.data.includeTypes {String} 可选参数,包含类型Id,多个使用逗号分割
         * @param args.data.maxCount {Int} 可选参数,每天活动详情的最大的数量
         */
        getCalendarView: function (args) {
            this.request("calendar:getCalendarView", args);
        },
        //日程详细信息查询
        getCalendar: function (args) {
            this.request("calendar:getCalendar", args);
        },
        //查询日程总数
        getCalendarCount: function (callback) {
            this.request("calendar:getCalendarCount", {}, callback);
        },

        getDefaultWeather: function (args) {

            this.request("weather:getDefaultWeather", args);
        },

        //取消邀请关系(即关闭)活动
        cancelInvited: function (args) {
            this.request("calendar:cancelInvitedInfo", args);
        },

        //更新邀请信息状态
        updateInviteStatus: function (args) {
            this.request("calendar:updateInviteStatus", args);
        },

        //附件上传地址获取
        getNormalUploadUrl: function (args) {
            if (typeof data == 'string') data = { returnUrl: data };
            this.request("calendar:getNormalUploadUrl", args);
        },
        //附件下载地址获取
        getDownloadUrl: function (args) {
            if (typeof data == 'string') data = { fileId: data };
            this.request("calendar:getDownloadUrl", args);
        },
        //附件上传（由服务器去下载附件的情况）
        uploadFile: function (args) {
            if (typeof data == 'string') data = { downloadUrls: data };
            this.request("calendar:uploadFile", args);
        },
        //添加邮件待处理日程
        addMailCalendar: function (args) {
            this.request("calendar:addMailCalendar", args);
        },
        //更新邮件待处理日程
        updateMailCalendar: function (args) {
            this.request("calendar:updateMailCalendar", args);
        },
        //邮件待处理日程查询
        getMailCalendar: function (args) {
            if (typeof data == 'string') data = { labelId: data };
            this.request("calendar:getMailCalendar", args);
        },
        //邮件待处理删除/取消日程
        delMailCalendar: function (args) {
            this.request("calendar:delMailCalendar", args);
        },

        /**
         * 获取某天的黄历详情
         */
        getHuangliData: function (args) {
            args.onrouter = function (route) {
                route.addRouter("calendar", ["calendar:getHuangliData"]);
            };
            this.request("calendar:getHuangliData", args);
        },

        shareCalendar: function (args) {
            args = args || {};
            this.request("calendar:shareCalendar", args);
        },

        //#endregion

        //#region 黑白名单

        //新增黑白名单
        addBlackWhiteItem: function (args) {
            this.request("calendar:addBlackWhiteItem", args);
        },
        //删除黑白名单
        delBlackWhiteItem: function (args) {
            if (typeof data == 'string') data = { uin: data };
            this.request("calendar:delBlackWhiteItem", args);
        },
        //获取黑白名单项
        getBlackWhiteItem: function (args) {
            if (typeof data == 'string') data = { uin: data };
            this.request("calendar:getBlackWhiteItem", args);
        },
        //获取黑白名单列表
        getBlackWhiteList: function (args) {
            this.request("calendar:getBlackWhiteList", args);
        },

        //#endregion

        //#region 消息盒子

        //获取消息盒子未读数量
        getMessageCount: function (args) {
            this.request("calendar:getMessageCount", args);
        },
        /**
          * 获取消息盒子列表
          * @param args {Object} 请求参数
          * @param args.pageIndex {Int} 页数,默认为1
          * @param args.pageSize {Int} 每页数量
          * @param args.type {Int} 消息类型: 1表示邀请,2表示共享
          * @param args.success {Function} 成功请求接口后的回调(包括code!='S_OK')
          * @param args.error {Function} 接口请求失败时的回调
          */
        getMessageList: function (args) {
            this.request("calendar:getMessageList", args);
        },
        /**
         * 查看消息（根据消息ID获取消息实体） 
         * @param args.data {Int} 消息ID
         * @param args.success {Function} 成功请求接口后的回调(包括code!='S_OK')
         * @param args.error {Function} 接口请求失败时的回调
         */
        getMessageById: function (args) {
            args = args || {};
            if (typeof args.data == 'number') args.data = { messageId: args.data };
            this.request("calendar:getMessageById", args);
        },
        /**
         * 删除消息 
         * @param args.data {Object,Int,Array} 消息ID
         * @param args.success {Function} 成功请求接口后的回调(包括code!='S_OK')
         * @param args.error {Function} 接口请求失败时的回调
         */
        delMessage: function (args) {
            args = args || {};
            if (typeof args.data == 'number') args.data = { seqno: args.data };
            else if (args.data instanceof Array) {
                //TODO,数组拼接之后会变成string，接口要求为int
                //MARK: 后台不管XML的标签属性,统一转成string然后按需转换成对应类型
                args.data = { seqno: args.data.join(",") };
            }
            this.request("calendar:delMessage", args);
        },

        //#endregion

        //#region 公共日历

        /**
         * 订阅公共日历
         * 用于: 搜索页面
         * @param data {Object} 订阅内容的对象
         * @param data.labelId {Int} 公共日历ID
         * @param data.color {String} 公共日历颜色（用户自定义）
         * @param success {Function} 回调函数
         * @param error {Function} 失败的回调函数
         */
        subscribeLabel: function (args) {
            this.request("calendar:subscribeLabel", args);
        },
        /**
         * 退订公共日历
         * 用于: 搜索页面
         * @param data {Int/Object} 参数
         * @param success {Function} 回调函数
         * @param error {Function} 失败的回调函数
         */
        cancelSubscribeLabel: function (args) {
            if (typeof data == 'number') data = { labelId: data };
            this.request("calendar:cancelSubscribeLabel", args);
        },
        /**
         * 搜索公共日历
         * 用于: 搜索页面
         * @param data {String/Object} 需要搜索的关键字
         * @param success {Function} 回调函数
         * @param error {Function} 失败的回调函数
         */
        searchPublicLabel: function (args) {
            if (typeof data == 'string') {
                data = { searchText: data };
            }
            this.request("calendar:searchPublicLabel", args);
        },
        /**
         * 获取指定日历下的所有活动信息
         * @param args  需要传递给接口的参数以及回调函数
         */
        getCalendarList: function (args) {
            this.request("calendar:getCalendarList", args);
        },
        /**
         * 获取日历广场中所有的日历分类
         * @param args  需要传递给接口的参数以及回调函数
         */
        getAllLabelTypes: function (args) {
            this.request("calendar:getAllLabelTypes", args);
        },
        /**
         * 批量添加日历
         * @param args  需要传递给接口的参数以及回调函数
         */
        batchAddCalendar: function (args) {
            this.request("calendar:batchAddCalendar", args);
        },
        /**
         * 根据日历分类ID获取分类下的所有日历
         * @param args  需要传递给接口的参数以及回调函数
         */
        getLabelsByType: function (args) {
            this.request("calendar:getLabelsByType", args);
        },
        /**
         * 复制"订阅日历"下的所有活动到我的日历下
         * @param args  需要传递给接口的参数以及回调函数
         */
        copyCalendar: function (args) {
            this.request("calendar:copyCalendar", args);
        },
        /**
         * 从公共接口中获取日历广场中的数据
         * @param args
         */
        getUnifiedPositionContent: function (args) {
            this.request("unified:getUnifiedPositionContent", args);
        },
        /**
         * 获取单个已发布的日历
         * @param args
         */
        getPublishedLabelByOper: function (args) {
            this.request("calendar:getPublishedLabelByOper", args);
        },
        /**
         * 查询某个订阅日历下的所有活动,替换之前的getCalendarList接口
         * @param args
         */
        getCalendarsByLabel: function (args) {
            this.request("calendar:getCalendarsByLabel", args);
        },
        /**
         * 查询群组日历活动列表信息
         * @param args
         */
        getGroupCalendarList: function (args) {
            this.request("calendar:getGroupCalendarList", args);
        },
        /**
         * 添加群日历
         * @param args
         */
        addGroupLabel: function (args) {
            this.request("calendar:addGroupLabel", args);
        }
        //#endregion
    }));

    M2012.Calendar.API = new M2012.Calendar.Model.API();

})(jQuery, _, M139, window._top || window.top);

﻿
/**
 * 139邮箱SDK行为上报兼容
 * 目前作为自定义事件的行为兼容上报
 * 
 * examples:
 * M2012.Calendar.Analytics.sendEvent('load',{api:'load_main_data'});
 * 
 * //点击事件上报
 * M2012.Calendar.Analytics.sendClick(e); //一般在jqElem.click(function(e){})方法中
 */
; (function ($, _, M139, top) {
    //兼容
    if (!window._udata) {
        window._udata = {
            sendClick: function () { },
            sendEvent: function () { }
        }
    }

    var className = 'M2012.Calendar.Analytics';
    M139.namespace(className, Backbone.Model.extend({
        name: className,
        sendEvent: function (name, value) {
            _udata.sendEvent(name, value);
        },
        sendClick: function (e) {
            _udata.sendClick(e);
        }
    }));

    var analytics = new M2012.Calendar.Analytics();

    //扩展到实例
    $.extend(M2012.Calendar.Analytics, {
        sendEvent: analytics.sendEvent,
        sendClick: analytics.sendClick
    })
})(jQuery, _, M139, window._top || window.top);
﻿
(function ($, _, M139, top) {
    var className = "M2012.Calendar.HolidayInfo";
    var holidayTypes = M2012.Calendar.Constant.holidayTypes,
        commonApi = M2012.Calendar.CommonAPI.getInstance();

    M139.namespace(className, Backbone.Model.extend({
        name: className,
        defaults: {
            "restday": { //法定方法时间
                "2014": [
                    "0101", "0131",
                    "0201", "0202", "0203", "0204", "0205", "0206",
                    "0405", "0406", "0407",
                    "0501", "0502", "0503", "0531",
                    "0601", "0602",
                    "0906", "0907", "0908",
                    "1001", "1002", "1003", "1004", "1005", "1006", "1007"
                ],
                "2015": []
            },
            "workday": { //法定调休时间
                "2014": [
                    "0126",
                    "0208",
                    "0504",
                    "0928",
                    "1011"
                ],
                "2015": []
            },
            holiday: {}
        },
        initialize: function (options) {
            this._mergeHoliday(); //合并法定的放假和调休日期,获取哈希对象并保存到自身attributes的holiday中
        },
        _mergeHoliday: function () {
            var _this = this,
                restday = _this.get("restday"),
                workday = _this.get("workday"),
                holiday = {},
                restdayList, key;

            //反转,即获取 {20140101:restday}这样的对象
            holiday = $.extend(holiday, _this._reverse(restday, holidayTypes.restday));
            holiday = $.extend(holiday, _this._reverse(workday, holidayTypes.workday));

            _this.set("holiday", holiday);
        },
        _reverse: function (days, type) {
            var key, holiday = {};

            for (var year in days) {
                dayList = days[year];
                $.each(dayList, function (i, item) {
                    key = year + item;
                    holiday[key] = type;
                });
            }

            return holiday;
        },
        getHolidayType: function (year, month, day) {
            var _this = this,
                holiday = _this.get("holiday"),
                date = commonApi.padding(year, 4) + commonApi.padding(month, 2) + commonApi.padding(day, 2),
                result;

            //获取日期类型
            result = holiday[date];
            if (_.isUndefined(result)) {
                result = holidayTypes.normal;
            }

            return result;
        }
    }));


    //#region 单一实例,直接调用
    var holidayInfo = M2012.Calendar.HolidayInfo;
    var instance = new holidayInfo();

    $.extend(M2012.Calendar.HolidayInfo, {
        getInstance: function () {
            return instance;
        }
    });
    //#endregion

})(jQuery, _, M139, window._top || window.top);
﻿;(function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var currentClass = "M2012.Calendar.View.Component";

    M139.namespace(currentClass, superClass.extend({

        initialize: function (options) {
            this.wrapinput = null;
            this.isEdit = options.isEdit || 1,//1编辑 -1只读
            this.render();
        },

        /**
         * 初始化界面
         */
        render: function () {
            var template = $T.Utils.format(this._template, {
                cid: this.cid,
                title: this.title,
                titleName: this.titleName
            });

            $(template).appendTo(this.wrap);
            this.kepElements();

            this.initEvents();
        },
        /**
         * 添加事件
         */
        initEvents: function () {

        },


        /**
         * 保存dom节点
         */
        kepElements: function () {

        },
        /**
         * 更新数据
         * @param val
         */
        setData: function (val) {

            this.obj = val;
        },
        /**
         * 绑定数据
         * @param obj
         */
        bindData: function (obj) {
            this.setData(obj);
            this.oldVal = obj;
        },
        isChanged: function () {

            return this.oldVal !== this.getData()
        },
        setReadOnly: function () {
            $("#" + this.cid + '_ControlReadEl').show();
        },
        /**
         * 验证
         */
        validate: function () {

        },
        getMessage: function () {

            this.trigger('message');

            return this.message;
        },
        setMessage: function (message) {
            this.message = message;
        },
        /**
         * 获取数据
         * @return {*}
         */
        getData: function () {
            return this.obj;
        },
        /**
         * 获取模板
         * @return {String}
         */
        getTemplate: function () {
            return "";
        },
        /**
         * 显示
         */
        show: function () {
        },
        /**
         * 隐藏
         */
        hide: function () {
        },
        _requireTemplate: '<span class="red f_st" title="必填项" >*</span>',
        _template: ''
    }));

})(jQuery, _, M139, window._top || window.top);
﻿; (function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.ValidateTip";

    M139.namespace(_class, superClass.extend({

        defaults: {

            //目标元素
            //需要在其上显示提示信息的$(dom)
            target: null,

            //提示内容
            content: "",

            //提示框的默认宽度
            width: 80
        },

        //当前控件
        curentEl: null,


        /**
         *  消息弹出提醒控件
         *  @param {Object} args.target 消息框弹出是参考的元素(DOM对象)
         *  @param {Sting} args.content  消息内容
         *  @param {Int} args.width 弹出框宽度
        **/
        initialize: function (args) {
            var self = this;

            if (!args)
                args = {};

            if (args.target)
                self.target = args.target;

            if (args.content)
                self.content = args.content;

            if (args.width && $.isNumeric(args.width))
                self.width = args.width;

            self.render();

            self.initEvents();
        },

        initEvents: function () {

            this.curentEl.bind('blur', function () {
                M2012.Calendar.View.ValidateTip.hide();
            });
        },

        render: function () {

            var self = this;

            var html = $T.format(self.template, {
                cid: self.cid,
                content: self.content,
                width: self.width
            });

            self.curentEl = $(html).appendTo($(document.body));
        },

        /**
         * 更新提示内容
         */
        updateContent: function (content) {

            $('#' + this.cid + '_content').html(content);
        },

        setPositon: function (el) {

            var self = this;

            if (!el) return;

            var offset = $(el).offset();
            var left = offset.left;

            var height = self.curentEl.height();
            var top = offset.top - height - 15;
            self.curentEl.css({ left: left, top: top });
            self.curentEl.focus();
        },

        template: [
            "<div id=\"{cid}_wrap\" class=\"tips\" tabindex=\"0\" hidefocus=\"true\" style=\"position:absolute;outline:none;left:20px;top:-1000px;width:{width}px;display:'';z-index:9999;\">",
                "<div class=\"tips-text\"  id=\"{cid}_content\">{content}</div>",
			    "<div class=\"tipsBottom  diamond\" style=\"left:10px\"></div>",
           "</div>"
        ].join("")
    }, {

        /**
         * 显示控件外观
         * 此方法供外部调用
         */
        /**
         *  消息弹出提醒控件 此方法供外部调用
         *  @param {Object} target 消息框弹出是参考的元素(DOM对象)
         *  @param {Sting} text  消息内容
         *  @param {Boolean} isAutoHide 是否自动消失
        **/
        show: function (text, target, isAutoHide) {
            var self = this;
            if (!window.$Cal_Validate_Tip) {
                window.$Cal_Validate_Tip = new M2012.Calendar.View.ValidateTip({});
            }

            var control = $Cal_Validate_Tip;
            //更新界面内容
            control.updateContent(text);
            //设置位置
            control.setPositon(target);
            if (isAutoHide) {
                setTimeout(function () {
                    M2012.Calendar.View.ValidateTip.hide();
                }, 5000);//5s消失
            }
        },

        /**
         * 显示控件外观
         * 此方法供外部调用
         */
        hide: function () {
            if (!window.$Cal_Validate_Tip) {
                window.$Cal_Validate_Tip = new M2012.Calendar.View.ValidateTip({});
            }
            window.$Cal_Validate_Tip.curentEl.css({ left: '-1000px' });
        }
    }));


})(jQuery, _, M139, window._top || window.top)
﻿; (function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.TimePicker";

    /**
	 * 时间选择器
	 * 选择指定日期的时和分
     * 使用方法如下：
     *  new M2012.Calendar.View.TimePicker({
     *    container: $("#timer"),
     *    onChange: function (args) {
     *        //args : {time: time}
     *     }
     *  });
     */
    M139.namespace(_class, superClass.extend({

        name: _class,

        //当前视图对象的容器(父元素) $(dom)
        container: null,

        //当前控件对象
        currentEl: null,

        //数据模型
        model: null,

        //回调函数
        //供调用方使用，主要是用于实时获取数据
        onChange: null,

        /**
         * args:{
         *      @param {Object} container  //父容器,jQuery对象
         *      @param {String} time       //指定的时间， 可选
         *      @param {Function} onChange //选项改变后的回调
         *   }
        **/
        initialize: function (args) {

            var self = this;

            if (!args)
                args = {};

            var time = null;
            if (args.time)
                time = args.time;

            self.model = new M2012.Calendar.Model.TimePicker({ time: time });

            self.container = args.container ? args.container : $(document.body);
            self.width = args.width;  // 外部容器的宽度(timer的宽度)
            //回调函数
            self.onChange = function (a) {
                args.onChange && args.onChange(a);
            };

            self.render();
            self.initEvents();
        },

        /**
         * 添加事件
       */
        initEvents: function () {

            var self = this;
            var readonlyEl = self.getElement("ControlReadEl");

            self.model.on("change:time", function (args) {
                readonlyEl.text(self.model.get("time"));
            });

            //注册事件监控模型数据变化
            self.model.on(self.model.EVENTS.DATA_CHANGE, function (args) {
                self.onChange && self.onChange(args);
            });

            //初始化是调用一次该方法，
            //主要是先向调用视图传递默认数据
            self.onChange && self.onChange({ time: self.model.get("time") });
        },

        /**
         * 初始化界面
         */
        render: function () {

            var self = this;

            var html = $T.format(self.template, {
                cid: self.cid
            });

            self.currentEl = $(html).appendTo(self.container);

            //初始化下拉列表
            self.setMenuItems();
            //初始化时先默认设置下只读状态下的时间显示文本
            self.getElement("ControlReadEl").text(self.model.get("time"));
        },

        //初始化下拉列表
        setMenuItems: function () {

            var self = this;
            var timer = self.getElement("timer");

            var time = self.model.get("time");
            var item = self.model.get("timeItems")[time];
            var options = {
                container: timer,
                menuItems: self.model.getMenuItems(),
                selectedIndex: item ? item.index : 0,
                width: 80,
                maxHeight: 150
            };

            //创建一个下拉菜单
            self.timeMenu = new M2012.Calendar.View.CalendarDropMenu().create(options);
            self.timeMenu.on("change", function (item) {
                self.model.set({
                    hour: item.data.hour,
                    minute: item.data.minute,
                    time: item.data.time
                });
            });
        },

        getElement: function (id) {

            var self = this;

            id = $T.format("#{cid}_{id}", {
                cid: self.cid,
                id: id
            });

            return $(id);
        },

        setReadOnly: function () {
            var self = this;

            self.currentEl && this.currentEl.hide();
            self.getElement("ControlReadEl").show();
        },

        /**
         * 显示
         */
        show: function () {

            var self = this;

            if (self.currentEl) {
                self.currentEl.show();
            }
        },

        /**
         * 隐藏
         */
        hide: function () {

            var self = this;

            if (self.currentEl) {
                self.currentEl.hide();
            }
        },

        template: ['<div class="clearfix fl hankA">',
				        '<div id="{cid}_timer">',
					    '</div>',
					    '<div id="{cid}_ControlReadEl" style="display:none;top: 0px; height:30px; z-index:1000; " class="blackbanner"></div>',
				    '</div>'].join("")

    }));


    (function () {

        var base = M139.Model.ModelBase;
        var current = "M2012.Calendar.Model.TimePicker";

        var capi = new M2012.Calendar.CommonAPI();

        M139.namespace(current, base.extend({

            name: current,

            defaults: {
                //时间的字符串形式 如："0605"
                time: "",

                //时间项数据
                timeItems: null,

                //分钟间隔
                // Minutes: [0, 15, 30, 45],

                //是否设置了默认时间
                hasDefaultTime: false
            },

            EVENTS: {

                //监控数据变化
                DATA_CHANGE: "timepicker#data_change"
            },


            Minutes: [0, 15, 30, 45],

            initialize: function (args) {

                var self = this;
                args = args || {};

                if (args.time) {
                    self.set({ time: args.time });
                    self.hasDefaultTime = true;
                }

                base.prototype.initialize.apply(self, arguments);

                self.initEvents();
                self.initData();
            },

            initEvents: function () {

                var self = this;

                self.on("change:time", function () {

                    self.trigger(self.EVENTS.DATA_CHANGE, {
                        time: self.get("time")
                    });
                });
            },

            //初始化数据
            initData: function () {
                var self = this;

                //初始化选项
                self.setItems();

                var time = self.get("time");
                var cacheItems = self.get("timeItems");


                if (!time) {
                    //取当前时间加半小时
                    var date = window.ISOPEN_CAIYUN ? new Date() : M139.Date.getServerTime();
                    date.setMinutes(date.getMinutes() + 30);
                    var hh = capi.padding(date.getHours(), 2);
                    var mm = capi.padding(date.getMinutes(), 2);
                    time = hh + mm;
                    self.set({ time: time });
                }

                var selectedItem = cacheItems[time];

                if (!selectedItem) {
                    self.set({ time: self.fixTime(time) });
                }
            },

            //修正时间，确保时间在选项内
            fixTime: function (time) {

                time = capi.fixHourTime(time) || "";

                var self = this;
                var h = 0, m = 0;
                var value = time.split(":");

                if (value.length == 2) {
                    h = parseInt(value[0]);
                    m = parseInt(value[1]);
                }

                //获取时间间隔
                var value = self.Minutes[1];

                if ((m % value) != 0) {
                    m = value * (Math.floor(m / value) + 2);

                } else {
                    //无初始值的要取下一个有效时间点
                    if (!self.hasDefaultTime) {
                        m += value;
                    }
                }

                if (m > self.Minutes[self.Minutes.length - 1]) {
                    m = 0;
                    h += 1;
                }

                if (h > 23) {
                    h = 0;
                }

                return capi.padding(h, 2) + capi.padding(m, 2);

            },

            //设置数据源选项
            setItems: function () {

                var self = this;

                var items = self.get("timeItems");
                if (items == null) {

                    items = {};
                    var index = 0;

                    for (var hour = 0; hour < 24; hour++) {

                        for (var i = 0 ; i < self.Minutes.length; i++) {

                            var minute = self.Minutes[i];
                            var hh = capi.padding(hour, 2);
                            var mm = capi.padding(minute, 2);

                            var item = {
                                text: hh + ":" + mm,
                                data: {
                                    hour: hour,
                                    minute: minute,
                                    time: hh + mm
                                }
                            };

                            items[item.data.time] = {
                                index: index,
                                item: item
                            };

                            index++;
                        }
                    }
                }

                self.set({ timeItems: items });
            },

            //获取下拉列表选项
            getMenuItems: function () {
                var self = this;
                var timeItems = self.get("timeItems");

                if (timeItems) {
                    var items = new Array(100);
                    var value = null;
                    var count = 0;

                    for (var key in timeItems) {
                        value = timeItems[key];
                        if (value.item) {
                            items[value.index] = value.item;
                            count++;
                        }
                    }

                    return items.slice(0, count);
                }

                return [];
            }

        }));

    })();


})(jQuery, _, M139, window._top || window.top);
﻿; (function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.Reminder";

    M139.namespace(_class, superClass.extend({

        name: _class,

        //当前视图对象的容器(父元素) $(dom)
        container: null,

        //当前控件对象
        currentEl: null,
        //提醒类型选择区域容器
        typeEl: null,
        //时间间隔选择区域容器
        timeEl:null,

        model: null,

        //回调函数
        //供调用方使用，主要是用于实时获取数据
        onChange: null,

        /**
         *  提醒控件
         *  @param {Object}    container           //当前控件的父容元素(jQuery对象)
         *  @param {Number}    args.beforeTime     //提前时间(可选)
         *  @param {Number}    args.beforeType     //提前时间类型(可选)
         *  @param {Number}    args.recMySms       //是否短信提醒(可选)  1: 是 0: 否
         *  @param {Number}    args.recMyEmail     //是邮件信提醒(可选)  1: 是 0: 否
         *  @param {Number}    args.enable         //是否提醒标示(可选) 1: 提醒 0: 不提醒
         *  @param {Function}  onChange            //数据发生变化后的回调函数，数据驱动调用方
        **/
        initialize: function (args) {
            var self = this;

            args = args || {};
            self.container = args.container ? args.container : $(document.body);
            //回调函数
            self.onChange = function (a) {
                args.onChange && args.onChange(a);
            }
            self.model = new M2012.Calendar.Model.Reminder(args);

            self.initEvents();
            self.render();

            self.setMenuItems();
        },

        initEvents: function () {
            var self = this;

            //model数据变化后通知UI呈现
            self.model.on("change", function () {

                if (self.model.hasChanged("enable")) {
                    self.getElement("remind_type").toggleClass("hide");
                }
                if (self.timer) {
                    window.clearTimeout(self.timer);
                }
                //延迟一下,可以缓解多个值变更时触发多次,造成请求多次的问题
                self.timer = window.setTimeout(function () {
                    self.onChange(self.getData());
                }, 0xff);
            });

            // 初始化时调用一次该方法，
            // 主要是先向调用方传递默认数据
            self.onChange(self.getData());
        },

        setStyle: function () {

        },

        render: function () {
            var self = this;

            var html = $T.format(self.template, {
                cid: self.cid
            });
            self.currentEl = $(html).appendTo(self.container);
            //类型区域DOM对象
            self.typeEl = self.getElement("remind_type");
            self.typeEl.removeClass("hide");
            if (self.model.get("enable") == 0) {
                self.typeEl.addClass("hide");
            }
            //时间区域DOM对象
            self.timeEl = self.getElement("remind_time");
          
        },

        /**
         * 设置下拉列表弹出层
         */
        setMenuItems: function () {

            var self = this;
            //设置间隔时间下拉列表 
            //数据项以 "15-0"的形式做键值去初始化下拉选项
            var enable = self.model.get("enable");
            var beforeTime = self.model.get("beforeTime");
            var beforeType = self.model.get("beforeType");

            //不提醒时特殊处理
            if (enable == 0) {
                beforeTime = -1;
                beforeType = 0;
            }
            var key = beforeTime + "-" + beforeType;
            var item = self.model.get("remindTimeItems")[key];
            var options = {
                container: self.timeEl,
                menuItems: self.model.getRemindTimeMenuItems(),
                selectedIndex: item ? item.index : 0,
                width: 124,
                maxHeight: 100
            };
            //创建一个选择时间间隔的下拉菜单
            self.timeComp = new M2012.Calendar.View.CalendarDropMenu().create(options);
            self.timeComp.on("change", function (item) {
                var beforeTime = item.data.beforeTime;
                var enable = 1;

                //如果提前时间为-1，说明是不提醒
                if (beforeTime == -1) {
                    enable = 0;
                }
                self.model.set({
                    beforeTime: beforeTime,
                    beforeType: item.data.beforeType,
                    enable: enable
                });
            });


            //设置提醒接收类型
            key = self.model.get("remindType");
            var type = self.model.get("remindTypeItems")[key];

            options = {
                container: self.typeEl,
                menuItems: self.model.getRemindTypeMenuItems(),
                selectedIndex: type ? type.index : 0,
                width: 80,
                maxHeight: 50
            };
            //创建一个选择时间间隔的下拉菜单
            self.typeComp = new M2012.Calendar.View.CalendarDropMenu().create(options);
            self.typeComp.on("change", function (item) {
                self.model.set({
                    remindType: item.value
                });
            });
        },

        /**
        *  获取id以{cid}开头的html元素
        *  @return {Object}   
       **/
        getElement: function (id) {
            var self = this;

            id = $T.format("#{cid}_{id}", {
                cid: self.cid,
                id: id
            });
            return $(id);
        },

        /**
         *  设置控制，一般用在初始化控件数据时
         *  @param {Number}   args.beforeTime  //提前时间
         *  @param {Number}   args.beforeType  //提前时间类型
         *  @param {Number}   args.recMySms    //是否短信提醒 1： 是，0：否
         *  @param {Number}   args.recMyEmail  //是否邮件提醒 1： 是，0：否
         *  @param {Number}   args.enable      //是否提醒 1： 是，0：否
         */
        setData: function (args) {
            if (!args)
                return;

            var self = this;
            self.model.setData(args);

            // 还原每个控件的选择状态
            var data = self.model.getData();
            //当不提醒时需要特殊处理下
            if (data.enable == 0) {
                data.beforeTime = -1;
                data.beforeType = 0;
                self.getElement("remind_type").addClass("hide");
            }
            //还原提醒时间选择控件选项
            var value = data.beforeTime + "-" + data.beforeType;
            self.timeComp && self.timeComp.setSelectedValue(value);

            //还原提醒类型选择控件选项
            self.typeComp && self.typeComp.setSelectedValue(data.remindType);

        },

        /**
         *  手动获取提醒数据
         *  @return {Object}   
        **/
        getData: function () {
            return this.model.getData();
        },

        template: [
            '<div class=" dropDown-tips" id="{cid}_remind_time" >',
            '</div>',
			'<div class=" dropDown-ymtime  ml_10" id="{cid}_remind_type">',
            '</div>'
        ].join("")
    }));

    (function () {

        var base = M139.Model.ModelBase;
        var current = "M2012.Calendar.Model.Reminder";

        M139.namespace(current, base.extend({

            name: current,

            defaults: {

                //提醒时间间隔列表项
                remindTimeItems: null,

                //提醒接收方式列表项
                remindTypeItems: null,

                //提前时间
                //默认提前15分钟
                beforeTime: 15,

                //提前类型(0分, 1时, 2天, 3周, 4月 )
                // 默认为分钟
                beforeType: 0,

                //提醒接收类型
                //默认为邮件提醒
                remindType: "01",

                //是否提醒(默认提醒)
                enable: 1
            },

            /**
             *  提醒信息模型数据
             *  @param {Number}    args.beforeTime     //提前时间(可选)
             *  @param {Number}    args.beforeType     //提前时间类型(可选)
             *  @param {Boolean}   args.recMySms       //是否短信提醒(可选)
             *  @param {Boolean}   args.recMyEmail     //是邮件信提醒(可选)
             *  @param {Number}    args.enable         //是否提醒标示(可选) 1: 提醒 0: 不提醒
            **/
            initialize: function (args) {
                var self = this;

                if (!args)
                    args = {};

                self.setData(args);
                base.prototype.initialize.apply(self, arguments);

                //设置选项下拉列表数据
                self.setRemindTimeItems();
                self.setRemindTypeItems();
            },

            //设置提醒间隔列表选项
            setRemindTimeItems: function () {

                var self = this;
                var items = self.get("remindTimeItems");
                var index = 0;
                if (items == null) {

                    items = {};
                    var data = M2012.Calendar.Constant.remindTimesEnum;

                    for (var key in data) {

                        var value = data[key];
                        var item = {
                            data: { beforeType: value }
                        };
                        var match = key.match(/^\d+/);

                        if (match && match.length > 0) {
                            item.text = "提前" + key;
                            item.data.beforeTime = Number(match[0]);

                        } else {//不提前
                            item.text = key;
                            item.data.beforeTime = -1;

                            if (key == "准点提醒") { //没办法用最简单的办法改,配置没问题,算法有问题,不具备扩展能力,只能判断了
                                item.data.beforeTime = 0;
                            }
                        }
                        //给选项增加一个value值主要是为了以后便于通过下拉列表的setSelectedValue方法还原
                        item.value = item.data.beforeTime + "-" + item.data.beforeType;
                        items[item.value] = { index: index, item: item };

                        index++;
                    }

                    self.set({ remindTimeItems: items });
                }
            },

            //获取提醒时间间隔列表项
            getRemindTimeMenuItems: function () {

                var self = this;
                var timeItems = self.get("remindTimeItems");

                if (timeItems) {
                    var items = new Array(100);
                    var value = null;
                    var count = 0;

                    for (var key in timeItems) {
                        value = timeItems[key];
                        if (value.item) {
                            items[value.index] = value.item;
                            count++;
                        }
                    }

                    return items.slice(0, count);
                }

                return [];

            },

            //设置提醒接收方式列表选项
            setRemindTypeItems: function () {

                var self = this;
                var items = self.get("remindTypeItems");
                var index = 0;

                if (items == null) {
                    items = {};
                    var data = M2012.Calendar.Constant.remindSmsEmailTypes;

                    for (var key in data) {

                        var value = data[key];
                        var item = {
                            value: value.value,
                            text: value.text
                        };
                        items[value.value] = { index: index, item: item };
                        index++;
                    }
                    self.set({ remindTypeItems: items });
                }
            },

            /**
             *  获取提醒接收类型间隔列表项
            */
            getRemindTypeMenuItems: function () {
                var self = this;
                var typeItems = self.get("remindTypeItems");

                if (typeItems) {
                    var items = new Array(100);
                    var value = null;
                    var count = 0;

                    for (var key in typeItems) {
                        value = typeItems[key];
                        if (value.item) {
                            items[value.index] = value.item;
                            count++;
                        }
                    }
                    return items.slice(0, count);
                }
                return [];
            },

            /**
             *  设置控制，一般用在初始化控件数据时
             *  @param {Number}   args.beforeTime  //提前时间
             *  @param {Number}   args.beforeType  //提前时间类型
             *  @param {Number}   args.recMySms    //是否短信提醒 1： 是，0：否
             *  @param {Number}   args.recMyEmail  //是否邮件提醒 1： 是，0：否
             *  @param {Number}   args.enable      //是否提醒 1： 是，0：否
             */
            setData: function (args) {
                var self = this;
                var data = {};

                if (!args)
                    return;

                if (_.isNumber(args.beforeTime)) {
                    data.beforeTime = args.beforeTime;
                }
                if (_.isNumber(args.beforeType)) {
                    data.beforeType = args.beforeType;
                }
                //初始化提醒类型
                var remindTypes = M2012.Calendar.Constant.remindSmsEmailTypes;
                var type = remindTypes.email.value;
                if (args.recMySms === 1) {
                    type = remindTypes.freeSms.value;
                }
                data.remindType = type;
                if (_.isNumber(args.enable)) {
                    data.enable = args.enable;
                    //当不提醒时需要设置下提醒时间
                    if (data.enable == 0) {
                        data.beforeTime = -1;
                        data.beforeType = 0;
                    }
                }
                for (var key in data) {
                    if (_.has(self.attributes, key)) {
                        var value = {};
                        value[key] = data[key];
                        self.set(value, { silent: true });
                    }
                }
            },


            /**
             *  获取控件值
             */
            getData: function () {
                var _this = this;
                var enable = _this.get("enable");
                var remindType = _this.get("remindType");
                remindType = _this.padding(Number(remindType), 2);

                return {
                    recMySms: Number(remindType.slice(0, 1)),
                    recMyEmail: Number(remindType.slice(1)),
                    beforeTime: enable == 0 ? 15 : _this.get("beforeTime"),
                    beforeType: _this.get("beforeType"),
                    remindType: remindType,
                    enable: enable
                };
            },

            padding: function (i, len) {
                len = (len || 2) - (1 + Math.floor(Math.log(i | 1) / Math.LN10 + 10e-16));
                return new Array(len + 1).join("0") + i;
            }

        }));

    })();

})(jQuery, _, M139, window._top || window.top);
﻿/**
 *视图组件 textare框
 */
;(function ($, _, M139, top) {

    var Component = M2012.Calendar.View.Component;
    var Validate = M2012.Calendar.View.ValidateTip;

    M139.namespace("M2012.Calendar.View.TextArea", Component.extend({

        initialize: function (options) {

            this.name = options.name || 'content';
            this.titleName = options.titleName || '内容'
            this.maxLength = options.maxLength || 500;
            this.wrap = $("#" + options.wrap);
            this.require = options.require || false;
            this.render();
            this.kepElements();
            this.initEvents();
        },

        render: function () {
            var template = $T.Utils.format(this._template, {
                cid: this.cid,
                title: this.title,
                totalCount: this.maxLength,
                curCount: 0,
                require: this.require ? this._requireTemplate : "",
                titleName: this.titleName,
                cid: this.cid
            });
            $(template).appendTo(this.wrap);
        },

        kepElements: function () {
            this.textareaEl = $("#" + this.cid + '_content_textarea');
            this.statEl = $("#" + this.cid + '_stat');
        },
        changeHander: function (e) {
            var val = $(e.target).val();
            var objMsg = this.validate(val);
            if (objMsg.isOk) {
                this.statEl.text(val.length + "/500");
            } else {
                val = val.substr(0, this.maxLength);
                this.textareaEl.val(val);
                this.statEl.text("500/500");
                Validate.show(objMsg.msg, e.target);

            }
            this.setData(val);//截取500个字符

        },
        initEvents: function () {
            var self = this;
            this.textareaEl.bind('keyup', function (e) {
                self.changeHander.call(self, e);
            });
            this.textareaEl.bind('keydown', function (e) {
                self.changeHander.call(self, e);
            });
            this.textareaEl.bind('change', function (e) {
                self.changeHander.call(self, e);
            });
        },
        validate: function (val, isShow) {
            var objMsg = null;
            if (val.length > this.maxLength) {
                objMsg = { isOk: false, msg: '不能超过' + this.maxLength + '个字符' };
            } else if (isShow && this.require && val == '') {
                objMsg = { isOk: false, msg: this.titleName + '不能为空' };
                Validate.show(objMsg.msg, this.textareaEl);
            } else {
                objMsg = { isOk: true };
            }

            return objMsg;
        },
        setData: function (val) {

            this.obj = val;
        },
        bindData: function (val, type) {
            val = val || "";
            //ie6显示不出来处理
            //this.textareaEl.val(val.substr(0, this.maxLength)).hide().show();
            this.textareaEl.val(val).hide().show(); //全部显示，然后通过出发keyup来截取(因为val里面有\r\n，长度是4，实际是换行符，长度为1)
            if (type == -1) {//只读处理
                this.setReadOnly();
            }
            this.setData(val);
            //this.statEl.text(val.length + "/500");
            this.oldVal = val;

            this.textareaEl.trigger('keyup');
        },
        getData: function () {
            return $.trim(this.obj);

        },
        show: function () {

        },
        hide: function () {

        },

        _template: ['<div id="{cid}_wrap_input">',
        			 	'<label class="label">{titleName}：{require}</label>',
                     	 '<div class="element">',
	                        	'<div class="tagarea-div">',
	                        		'<textarea id="{cid}_content_textarea" class="iText tagarea"/>',
	                        		'<span class="tagarea-num gray" id="{cid}_stat">{curCount}/{totalCount}</span>',
	                        	'</div>',
                       	'</div>',
                       	 '<div id="{cid}_ControlReadEl" style="display:none;top: 0px; height:100px; z-index:1000; " class="blackbanner"></div>',
                 '</div>'].join("")

    }));
})(jQuery, _, M139, window._top || window.top);

﻿/**
 *公共的验证码组件
 */
; (function ($, _, M139, top) {
    var Component = M2012.Calendar.View.Component;
    var Validate = M2012.Calendar.View.ValidateTip;
    var Constant = M2012.Calendar.Constant;
    var $CUtils = M2012.Calendar.CommonAPI.Utils;
    var commonAPI = new M2012.Calendar.CommonAPI();

    M139.namespace("M2012.Calendar.View.Identify", Component.extend({

        initialize: function (options) {
            this.name = options.name || 'title';
            this.outer = options.outer || document.body;
            this.titleName = options.titleName || '验证码'
            this.render($("#" + options.wrap));

            this.onChange = _.isFunction(options.onChange) ? function (val) {
                options.onChange(val);
            } : this.onChange;

        },

        render: function (wrap) {
            var template = $T.Utils.format(this._template, {
                cid: this.cid,
                title: this.title,
                name: this.name,
                titleName: this.titleName
            });

            $(template).appendTo(wrap);

            this.kepElements();

            this.initEvents();

            this.hide();
        },

        onChange: function (val) {

        },

        handerError: function (errorCode) {

            var retVal = false;
            if (errorCode === Constant.IDENTIFY_CODES.IS_NEED_IDETIFY) {
                this.show();
                //Validate.show('请输入验证码',this.inputEl);
                this.inputEl.focus();
                retVal = true;
            } else if (errorCode === Constant.IDENTIFY_CODES.MORE_M30_STOP) {//输入了30次

                $Msg.alert("添加次数太频繁，请稍后再试");
                retVal = true;
                this.hide();
            } else if (errorCode === Constant.IDENTIFY_CODES.ERROR_INPUT_IDETIFY) {
                this.show();
                Validate.show('验证码输入错误', this.inputEl);
                retVal = true;

            } else if (errorCode === Constant.IDENTIFY_CODES.ERROR_OUT_DATE) {
                this.show();
                Validate.show('验证码已过期', this.inputEl);
                retVal = true;
            } else if (errorCode === Constant.IDENTIFY_CODES.ERROR_BLACK_LIST) {
                $Msg.alert("操作次数太频繁，您已经被列入黑名单...");
                retVal = true;
                this.hide();
            }
            return retVal;

        },
        changeImgUrl: function () {


            var url = this.imgEl.attr("src");
            if (url) {
                url += "&rnd=" + Math.random();

                this.imgEl.attr("src", url);
            }

        },
        kepElements: function () {

            this.wrap = $("#" + this.cid + '_wrap');
            this.inputEl = this.wrap.find("#" + this.cid + '_input');
            this.imgEl = this.wrap.find("#" + this.cid + '_img');
            this.validateImgEl = this.wrap.find("#" + this.cid + '_validateImg');
        },

        validate: function (val) {

            if (this.isVisible()) {
                if (this.getData() == '') {
                    $CUtils.adjustScrollToBottom(this.outer);
                    Validate.show('请输入验证码', this.inputEl);
                    return false;
                } else {
                    return true;
                }
            }
            return true;

        },

        isVisible: function () {
            return this.wrap.css('display') == 'none' ? false : true;
           // return this.wrap.is(":visible");
        },
        initEvents: function () {

            var self = this;

            this.wrap.find("#" + this.cid + "_changeImg").bind('click', function () {

                self.changeImgUrl();
                return false;//IE6下阻止事件
            });

            this.wrap.find("#" + this.cid + "_img").bind('click', function () {

                self.changeImgUrl();
                return false;

            });

            this.inputEl.change(function () {
                self.onChange($.trim(this.value));
            });

            $(document).bind('click', function (e) {

                var target = $(e.target);
                var id = target.attr("id");
                if (id == self.cid + '_validateImg' || id === self.cid + '_input') {
                    self.validateImgEl.show();
                } else {
                    self.validateImgEl.hide();
                }

            });

        },

        setData: function (obj) {
            this.obj = obj;
        },
        bindData: function (val, type) {

        },
        getData: function () {
            var val = this.inputEl.val();
            return $.trim(val);
        },
        show: function () {
            var self = this;

            commonAPI.callAPI({
                data: null,
                fnName: "initCalendar"
            }, function (data, json) {
                if (data["var"] && data["var"].imageUrl) {
                    self.imgEl.attr("src", data["var"].imageUrl);
                }
            }, function () {
                // 返回异常时的处理
            });

            $CUtils.adjustScrollToBottom(this.outer);
            this.changeImgUrl();
            this.wrap.show();
           // this.validateImgEl.show().css('bottom', this.getValidateImgHeight());
            //this.validateImgEl.show();

            this.imgEl.on("imgload", function () {
                self.validateImgEl.show();
                //图片加载完成之后调整高度
                //self.validateImgEl.css('bottom', self.getValidateImgHeight());
            });
        },
        getValidateImgHeight: function () {
            //return this.validateImgEl.outerHeight(true) + 20 + 8*2 + 10*2;
            return this.validateImgEl.outerHeight(true) + this.inputEl.outerHeight(true) + 5;
        },
        hide: function () {

            this.wrap.hide();
            this.validateImgEl.show();
            this.inputEl.val("");
        },
        getSelector: function (id) {
            return "#" + this.cid + id;
        },
        /**
        _template: ['<div id="{cid}_wrap" style="position:absolute;">',
        				'<label class="label">验证码：</label>',
						'<div class="element" style="height:20px;">',
							'<input type="text" id="{cid}_input" class="iText" value="">',
							'<div id="{cid}_validateImg" tabIndex=-1 class="validate-tip imgInfo mt_5 " >',
								'<img  id="{cid}_img" src="" title="点击更换验证码" style="cursor:pointer;" alt="图片验证码" onload="$(this).trigger(\'imgload\');">',
								'<p style="color: #666; width: 200px;">',
									'图中显示的图案是什么？将你认为正确答案前的<span class="c_ff6600">字母或数字</span>填入框中（不分大小写',
									'<a id="{cid}_changeImg" href="javascript:void(0);">看不清，换一张</a>',
								'</p>',
							'</div>',
						'</div>',
				 	'</div>'].join(""),*/

        _template: ['<div id="{cid}_wrap" class="repeattips-bottom clearfix">',
                       '<span class="numFour label">验证码：</span>',
                       '<div class="fl">',
                           '<input type="text" name="" id="{cid}_input" class="iText" value="">',
                       '</div>',
                       '<div class="verificationBox" id="{cid}_validateImg" tabIndex="-1" style="z-index: 9999">',
                           '<p class="verificationBoxImg">',
                               '<img src="" alt="图片验证码" title="点击更换验证码" id="{cid}_img" onload="$(this).trigger(\'imgload\');">',
                            '</p>',
                           '<p class="verificationBoxInfo">图中显示的图案是什么?将你认为正确答案前的<span>字母或数字</span>填入框中（不分大小写）</p>',
                           '<a id="{cid}_changeImg" href="#" class="verificationBoxBtn">看不清，换一张</a>',
                       '</div>',
                    '</div>'].join("")
    }));
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
﻿; (function ($, _, M139, top) {
    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.DayPicker";

    M139.namespace(_class, superClass.extend({

        name: _class,
        //视图数据模型
        model: null,
        //视图主控
        master: null,
        //控件父容器
        container: null,

        currentEl: null,

        inputEl: null,

        /*  时间改变后的触发事件
         *  @param {Boolean}  args.setLunar   //是否农历(可选)
        **/
        onChange: function (date) {

        },

        /**
         *  时间选择控件
         *  若要中途改变该控件的部分值，可以使用setData方法
         *  @param {Object}   args.master     //日历视图主控
         *  @param {Object}   args.container  //父容器,jQuery对象
         *  @param {Date}     args.date       //指定的时间(可选)
         *  @param {Boolean}  args.isLunar   //是否农历(可选)
         *  @param {Function} args.onChange   //数据改变后的回调
        **/
        initialize: function (args) {

            var self = this;

            args = args || {};
            self.master = args.master;

            if (args.container) {
                self.container = args.container;
            }

            self.onChange = function (date) {
                args.onChange && args.onChange(date);
            }

            self.model = new M2012.Calendar.Model.DayPicker(args);

            self.render();
            self.initEvents();
        },

        /**
         * 注册事件
         */
        initEvents: function () {

            var self = this;

            //设置时间输入区域点击事件
            self.inputEl = self.currentEl.find("input").click(function (e) {
                var me = $(this);
                $Event.stopEvent(e);
                me.addClass("ses");
            });
            $(document).click(function (e) {
                if (e.target != self.inputEl.get(0)) {
                    if (self.inputEl.hasClass("ses")) {
                        self.inputEl.removeClass("ses");
                    }
                }
            });

            //注册时间实时更新数据到前端展示
            self.model.on("change", function () {
                if (self.model.hasChanged("date")) {
                    self.initControls();
                    self.onChange(self.model.get("date"));
                }
                else if (self.model.hasChanged("isLunar")) {
                    self.inputEl.val(self.model.getDateString());
                }
            });
            self.initControls();
            //触发一下事件以在初始化时展示数据到前端
            self.onChange(self.model.get("date"));
        },

        /**
         * 初始化页面控件值
         */
        initControls: function () {
            var self = this;
            var date = self.model.get("date");
            self.inputEl.attr("realdate", $Date.format("yyyy-MM-dd", date));
            self.inputEl.val(self.model.getDateString());
        },

        /**
         * 呈现视图
         */
        render: function () {
            var self = this;
            self.$el.remove();
            var html = $T.format(self.template, {
                cid: self.cid
            });
            self.currentEl = $(html).appendTo(self.container);

            //绑定时间选择器
            var date = self.model.get("date");
            new M2012.Calendar.View.CalenderChoose({
                date2StringPattern: 'yyyy-MM-dd',
                id: self.cid + '_date_input',
                year: date.getFullYear(),
                month: date.getMonth(),
                day: date.getDate(),
                callback: function (date) {
                    self.model.setDate(date);
                }
            });
        },

        /**
         * 设置页面
         */
        setData: function (args) {
            var self = this;
            self.model.setData(args);
            self.initControls();
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

        /**
         * 视图模板
         */
        template: [
            '<span class=" textTimeOther_day">',
                '<input type="text" name="" id="{cid}_date_input" value="" readonly="readonly" >',
            '</span>'
        ].join("")

    }));

    (function () {

        var base = M139.Model.ModelBase;
        var current = "M2012.Calendar.Model.DayPicker";

        M139.namespace(current, base.extend({

            name: current,

            master: null,

            defaults: {
                //时间对象
                date: new Date(),
                //是否农历
                isLunar: false
            },

            /**
              *  构造函数
              *  @param {Object} args.master     //日历视图主控
              *  @param {Date} args.date         //指定的时间(可选)
             **/
            initialize: function (args) {
                var self = this;

                args = args || {};
                self.master = args.master;
                var capi = self.master.capi;

                if (!args.date) {
                    args.date = capi.getCurrentServerTime();
                }
                self.set({
                    date: args.date
                }, { silent: true });
            },

            /**
             * 获取日期的字符串形式
             */
            getDateString: function () {
                var self = this;
                var date = self.get("date");

                if (self.get("isLunar")) {
                    var obj = self.master.capi.createDateObj(date);
                    return obj.ldate;
                }
                return $Date.format("yyyy-MM-dd", date);
            },

            /**
            * 设置指定的日期时间
            */
            setDate: function (d) {
                var self = this;
                var date = self.get("date");

                if (!date || !d)
                    return;

                if (date.getFullYear() != d.getFullYear()
                    || date.getMonth() != d.getMonth()
                    || date.getDate() != d.getDate()) {

                    self.set({ date: d });
                }
            },

            /**
            *  设置控制，一般用在初始化控件数据时
            */
            setData: function (args) {
                var self = this;
                if (!args)
                    return;

                for (var key in args) {
                    if (_.has(self.attributes, key)) {
                        var value = {};
                        value[key] = args[key];
                        self.set(value, { silent: true });
                    }
                }
            }
        }

        ));

    })();
})(jQuery, _, M139, window._top || window.top);
﻿; (function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.DaytimePicker";

    M139.namespace(_class, superClass.extend({

        name: _class,

        //当前视图对象的容器(父元素) $(dom)
        container: null,

        //数据模型
        model: null,

        master: null,

        //回调函数
        //供调用方使用，主要是用于实时获取数据
        onChange: null,

        /**
         *  日期选择控件
         *  @param {Object}   args.container    //父容器,jQuery对象
         *  @param {Date}     args.datetime     //指定的时间， 可选
         *  @param {Function} args.onChange     //选项改变后的回调
        **/
        initialize: function (args) {

            var self = this;

            if (!args)
                args = {};

            self.master = args.master || window.$Cal;

            if (args.container)
                self.container = args.container;

            self.model = new M2012.Calendar.Model.DaytimePicker(args);

            //回调函数
            self.onChange = function (a) {
                args.onChange && args.onChange(a);
            };

            self.initEvents();
            self.render();
        },

        /**
         * 添加事件
       */
        initEvents: function () {

            var self = this;

            //注册事件实时通知页面是否显示农历
            self.model.on("change", function () {
                if (self.model.hasChanged("datetime")) {
                    var datetime = self.model.get("datetime");
                    self.onChange({ datetime: datetime });
                }
                    //是否显示农历标识发生变化
                else if (self.model.hasChanged("isLunar")) {

                    //农历显示
                    var b = self.model.get("isLunar");
                    self.dayControl && self.dayControl.setData({ isLunar: b });
                }
                    //全天事件需要隐藏时分选择部分
                else if (self.model.hasChanged("isFullDayEvent")) {

                    if (!self.timeControl)
                        return;
                    if (self.model.get("isFullDayEvent")) {
                        self.timeControl.currentEl.addClass("hide");
                        return;
                    }
                    self.timeControl.currentEl.removeClass("hide");
                }

            });

            //注册一个初始化控件数据的事件
            self.on(self.master.EVENTS.INIT, function (args) {
                self.setData(args);
            });
        },
        /**
         * 初始化子控件值
        **/
        initControls: function () {

            var self = this;
            var datetime = self.model.get("datetime");
            //设置日期控件值
            self.dayControl && self.dayControl.setData({
                date: datetime
            });
            //设置时间控件值
            self.timeControl && self.timeControl.setData({
                time: $Date.format("hhmm", datetime)
            },true);
        },

        /**
         * 初始化界面
         */
        render: function () {

            var self = this;

            self.$el.remove();
            //添加日期选择空间
            self.dayControl = new M2012.Calendar.View.DayPicker({
                master: self.master,
                container: self.container,
                onChange: function (date) {
                    if (_.isDate(date)) {
                        var dt = self.model.get("datetime");
                        var hour = 0, minute = 0;
                        if (_.isDate(dt)) {
                            hour = dt.getHours();
                            minute = dt.getMinutes();
                        }

                        //更新model中的数据
                        self.model.set({
                            datetime: self.getResetDate(date, hour, minute)
                        });
                    }
                }
            });
            //添加小时分钟选择控件
            self.timeControl = new M2012.Calendar.View.TimeSelector({
                master: self.master,
                container: self.container,
                onChange: function (time) {
                    if (time != null) {
                        if (_.isNumber(time.hour) && _.isNumber(time.minute)) {
                            var dt = self.model.get("datetime");
                            //更新model中的数据
                            self.model.set({
                                datetime: self.getResetDate(dt, time.hour, time.minute)
                            });
                        }
                    }
                }
            });

        },

        /**
         *  获取重置后的时间
         *  @param {Date}     dayPart    //用以获取日期部分的时间
         *  @param {Number}   hour       //小时
         *  @param {Number}   minute     //分钟
        */
        getResetDate: function (dayPart, hour, minute) {
            var self = this;
            var date = new Date();

            if (!dayPart) {
                dayPart = new Date();
            }
            date.setFullYear(dayPart.getFullYear());
            date.setMonth(dayPart.getMonth());
            date.setDate(dayPart.getDate());
            date.setHours(Number(hour));
            date.setMinutes(Number(minute));

            return date;
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

        /**
         * 设置控件模型值，目前限定只能设置全天事件、是否农历等标示
         *  @param {Boolean} args.isFullDayEvent //是否全天事件 可选
         *  @param {Boolean} args.isLunar        //是否农历， 可选
         */
        setData: function (args) {
            if (!args)
                return;

            var self = this;

            if (_.isBoolean(args.isFullDayEvent))
                self.model.set({ isFullDayEvent: args.isFullDayEvent });

            if (_.isBoolean(args.isLunar))
                self.model.set({ isLunar: args.isLunar });

            if (_.isDate(args.datetime)) {
                self.model.setData({ datetime: args.datetime });
                //如果有传递过来的时间值，则需要再初始化一遍时间控件
                self.initControls();
            }
        }

    }));


    (function () {

        var base = M139.Model.ModelBase;
        var current = "M2012.Calendar.Model.DaytimePicker";
        var capi = new M2012.Calendar.CommonAPI();

        M139.namespace(current, base.extend({

            name: current,

            defaults: {
                //是否全天事件
                isFullDayEvent: false,
                //是否农历
                isLunar: false,
                //时间(Date类型)
                datetime: new Date()
            },

            master: null,

            EVENTS: {

                //监控数据变化
                DATA_CHANGE: "timepicker#data_change"
            },

            initialize: function (args) {

                var self = this;
                args = args || {};

                var date = args.datetime;
                self.master = args.master;
                var capi = self.master.capi;

                if (!_.isDate(args.datetime))
                    args.datetime = capi.getCurrentServerTime();

                self.setData(args);

                base.prototype.initialize.apply(self, arguments);

            },

            /**
             * 设置model的属性值
             */
            setData: function (args) {
                var self = this;
                if (!args)
                    return;

                for (var key in args) {
                    if (_.has(self.attributes, key)) {
                        var value = args[key];
                        if (typeof value == typeof self.get(key)) {
                            var data = {};
                            data[key] = value;
                        }
                        self.set(data, { silent: true });
                    }
                }
            }


        }));

    })();


})(jQuery, _, M139, window._top || window.top);
﻿/**
 * 显示日历列表的控件
 */
; (function (jQuery, _, M139, top) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    //具有特殊性，取名为LabelMenu2
    M139.namespace('M2012.Calendar.View.LabelMenu', superClass.extend({
        template: {
            MAIN: ['<div class="dropDown dropDown-mytag" style="width:{width};">',
                        '<div class="dropDownA" href="javascript:void(0)"><i class="i_triangle_d"></i></div>',
                        '<div class="dropDownText" style="height:23px;">',
                            '<span style="background-color:{color};" class="ad-tagt"></span>',
                            '<span class="tagText" title="{labelName}">{labelName}</span>',
                        '</div>',
                    '</div>'].join(""),
            ITEM: ['<span style="background-color:{color};" class="ad-tagt"></span>',
                   '<span class="tagText" style="display:inline;">{labelName}</span>'].join(""),

            DEFAULT_COLOR: "#58a8b4",
            DEFAULT_NAME: "模板日历",
            DEFAULT_LABELID: 10,

            MENU_WIDTH: "226px;"
        },
        configs: {
            filterLabels: [6, 8] //6：生日，8：宝宝防疫
        },

        master: null,
        /**
         *
         * new M2012.Calendar.View.LabelMenu({
         *     target: $(document.body),
         *     labels:{},
         *     labelId: 10001
         * })
         */
        initialize: function (options) {
            var _this = this;
            /**
            options = $.extend({
                labelId: 10,
                labelName: _this.template.DEFAULT_NAME,
                color: _this.template.DEFAULT_COLOR
            }, options);*/

            _this.model = new Backbone.Model();
            _this.options = options || {};
            _this.container = options.container || options.target;
            _this.master = options.master || window.$Cal;
            if (!_this.options.labels) {
                _this.options.labels = _this.master.getUserLabels();
            }
            // 数据改变触发事件
            if (options.onChange) {
                _this.onChange = function (e) {
                    options.onChange(e);
                };
            }

            //_this.labelId = options.labelId || _this.template.DEFAULT_LABELID;

            /**
            if (!options.labels) {
                //如果labels为空，则主动加载.原则上要求传递，否则会出现重复加载的情形
                var model2 = new M2012.Calendar.Popup.Meeting.Model();
                model2.getLabels(function (result) {
                    _this.model.set("labels", result);
                    _this.render();
                    _this.initEvents();
                });
                return;
            }*/

            //检测数据变化实时通知调用方
            _this.model.on("change:data", function (args) {
                _this.onChange(_this.model.get("data"));
            });

            _this.model.set("labels", options.labels);
            _this.render(options);
            _this.initEvents();
        },

        /**
         * 数据改变触发事件
         */
        onChange: function (e) {

        },

        render: function (options) {
            var _this = this;
            var itemsArr = [],
                hashItems = {};
            var data = options.labels;

            $(data).each(function (i, item) {
                var itemData = {
                    labelId: item.seqNo,
                    color: item.color,
                    labelName: item.labelName
                };
                if (i == 0) {
                    // 保存新添加的日历,默认返回数组的第一个为刚刚加的日历
                    _this.model.set("data", itemData);
                }

                var html = $T.format(_this.template.ITEM, {
                    color: itemData.color,
                    labelName: $T.Html.encode(item.labelName)
                });

                var subItem = {
                    html: html,
                    data: itemData
                };

                itemsArr.push(subItem);
                hashItems[item.seqNo] = subItem;
            });

            this.model.set({ "items": itemsArr, "hashItems": hashItems });
            var width = options.width || this.template.MENU_WIDTH;
            _this.model.set("width", width);
            var html = $T.format(_this.template.MAIN, {
                color: this.model.get("data").color,
                labelName: $T.Html.encode(this.model.get("data").labelName),
                width: width
            });

            _this.container.html(html);
        },
        initEvents: function () {
            var _this = this;
            var items = _this.model.get("items");
            var width = _this.model.get("width");
            _this.container.off('click').on("click", function () {
                new M2012.Calendar.View.CalendarPopMenu().create({
                    maxHeight: 200,
                    width: width, //去掉padding的2px
                    items: items,
                    dockElement: _this.container,
                    customClass: "menuPop-sd",
                    onItemClick: function (e) {
                        _this.onItemClick(e);
                    }
                });
            });
        },
        onItemClick: function (e) {
            var _this = this;
            _this.model.set("data", e.data);
            _this.container.find(".dropDownText").html(e.html);
        },
        getData: function () {
            return this.model.get("data");
        },
        setData: function (labelId) {
            var _this = this,
                hashItems = _this.model.get("hashItems"),
                data = hashItems[labelId];

            if (data) {
                _this.onItemClick(data);
            }
        },
        setIndex: function (index) {
            var _this = this;
            var items = _this.model.get('items') || [];
            var item = items[index] || items[0];

            if (item) { //items[0]也可能是undefined
                _this.setData(item.seqNo);
            }
        }
    }));


})(jQuery, _, M139, window._top || window.top);

(function ($, _, M139, top) {

    var _super = Backbone.View;
    var _class = "M2012.Calendar.View.AboutToday";
    var CHG_HEIGHT = "leftmenu#change:height";

    M139.namespace(_class, _super.extend({

        name: _class,

        el: "#pnlToday",
        template: null,
        isCollapsed: true,

        logger: new M139.Logger({ name: _class }),

        events: {
            "click": "expand",
            "mouseover": "highlight",
            "mouseout": "normal"
        },

        /**
         * 左上角今日黄历、吉凶宜忌的视图
         * @param {Object} options
         */
        initialize: function (options) {
            var _this = this;
            _super.prototype.initialize.apply(_this, arguments);
            _this.master = options.master;

            _this.bindData();
            _this.initEvents();
            _this.render(_this.model);
        },

        initEvents: function () {
            var _this = this;
            var master = _this.master;
            var EVENTS = master.EVENTS;

            _this.template = _.template($("#tplToday").html());
            _this.templateExt = _.template($("#tplTodayInfo").html());

            _this.$el = $(_this.el);
            _this.$elToday = _this.$el.find("#pnlDayInfo");
            //_this.$elInfo = _this.$el.find("#pnlExtInfo");
            _this.$elInfo = $("#lunarTips");

            _this.model.on("change", function () {
                _this.render.apply(_this, arguments);
            });

            //视图选中，日期数据变更
            master.on("change:year change:month change:day", function (model) {
                var curr = _this.model.toJSON();
                var change = model.toJSON();
                if (curr.today != change.day || curr.year != change.year || curr.month != change.month) {
                    _this.fetch.apply(_this, arguments);
                }
            });

            master.trigger(EVENTS.CAL_DATA_INIT, {
                success: function (result) {
                    var initData = result['var'];
                    var lunar = initData['huangli'];
                    if (_.isUndefined(lunar)) {
                        _this.logger.error("某日黄历 查宜忌详情失败 接口数据异常", initData);
                        return;
                    }

                    lunar.id = lunar.dayId;
                    _this.model.set(lunar);
                    _this.lunars.add(lunar);

                    //chongSha: "冲鼠[正冲丙子]煞北",
                    //ganzhi: "甲午年 丁卯月 壬午日",
                    //gongli: "2014-03-12",
                    //ji: "结婚 开工 安葬",
                    //pengZu: "壬不汲水更难提防 午不苫盖屋主更张",
                    //taishen: "仓库碓外西北",
                    //yi: "订婚 开光 求医 治病 动土 上梁 搬家 入宅"
                },
                error: function (err) {
                    if (err && err.code == "FS_SESSION_ERROR") {
                        top.$App.trigger("change:sessionOut", {}, true); //会话过期
                    }
                }
            });

            _this.$el.hover(function() {
                // 当鼠标进入黄历区域
                //do something
                _this.$elInfo.show();
            },function() {
                // 鼠标离开黄历区域时
                _this.hideTip();
            });
        },

        bindData: function (data) {
            var _this = this;
            var master = _this.master;

            var capi = master.capi;
            var now = capi.Today;
            var defaults = _this.calcLunar(now);

            $.extend(defaults, {
                hidden: _this.isCollapsed,
                yi: "黄道吉日",
                ji: "百无禁忌",

                dutygod: "平",
                taishen: "正南",

                chongSha: "冲* 煞*",
                pengZu: "破家治病主必安康"
            });

            _this.lunars = new Backbone.Collection();
            _this.model = new Backbone.Model(defaults);
        },

        /**
         * 根据日历实例计算出农历干支信息
         * @param date
         * @returns {{gongli: (*|format|format|String|格式化后的日期|格式化后的字符串或null), weekday: (*|format|format|String|格式化后的日期|格式化后的字符串或null), today: (*|number), month: number, year: number, aYear: (*|aYear), bYear: string, bMonth: string, bDay: string, cMonth: (*|cMonth|cMonth|cMonth), cDay: (*|cDay|cDay|cDay|cDay|Function)}}
         */
        calcLunar: function (date) {
            var _this = this;
            var master = _this.master;
            var capi = master.capi;
            var calObj = capi.createDateObj(date);

            return {
                gongli: $Date.format("yyyy-MM-dd", date),
                weekday: $Date.format("星期w", date),
                today: date.getDate(),
                month: date.getMonth()+1,
                year: date.getFullYear(),

                aYear: calObj.aYear,

                ganzhiYear: calObj.bYear + '年',
                ganzhiMonth: calObj.bMonth + '月',
                ganzhiDay: calObj.bDay + '日',

                cMonth: calObj.cMonth,
                cDay: calObj.cDay
            };
        },

        render: function (model) {
            var data = model.toJSON();
            // 渲染黄历主体模板
            this.$elToday.html(this.template(data));
            // 渲染黄历详情模板
            this.$elInfo.html(this.templateExt(data));
            return this;
        },

        /**
         * 鼠标进入黄历区域,增加"高亮显示"样式
         */
        highlight: function () {
            this.$el.addClass("focus");
        },

        /**
         * 鼠标离开黄历显示区域,移除"高亮显示"样式
         */
        normal: function () {
            this.$el.removeClass("focus");
        },

        /**
         * 隐藏黄历详情提示区域
         * @param e
         */
        hideTip : function(e) {
            this.$elInfo.hide();
        },

        /**
         * 展开老黄历神位与冲煞
         * 显示黄历详情提示区域
         */
        expand: function () {
            var _this = this;
            _this.$elInfo.show();
            _this.master.capi.addBehavior("calendar_huangli_click");
        },

        fetch: function (master) {
            var _this = this;

            var EVENTS = master.EVENTS;
            var masterData = master.toJSON();
            var mDate = new Date(masterData.year, masterData.month - 1, masterData.day, 9);

            //这里先用前端的数据，显示今日日期的农历信息。然后同时请求服务端的详情。
            var caldata = _this.calcLunar(mDate);
            var mDayId = Math.floor(mDate.getTime() / 86400000);

            //获取本地缓存，如果有就直接返回
            var cache = _this.lunars.get(mDayId);

            $.extend(caldata, cache ? cache.toJSON() : {
                yi: "……",
                ji: "……",
                taishen: "……",
                chongSha: "……",
                pengZu: "……"
            });

            _this.model.set(caldata);
            _this.logger.debug("今日黄历 查询宜忌详情...", caldata);

            if (cache) {
                return;
            }

            //获得主控API实例
            master.trigger(EVENTS.REQUIRE_API, {
                success: function (api) {
                    var year = Number(masterData.year);
                    var month = Number(masterData.month);
                    var day = Number(masterData.day);

                    var startDate = year + '-' + month + '-1'; //2014-12-1
                    var endDate = ((month > 11 ? 1 : 0) + year) + '-' + (month > 11 ? 1 : month + 1) + '-1'; //2015-1-1

                    //获取农历的宜忌
                    api.getHuangliData({
                        data: {
                            comeFrom: 0,
                            startDate: startDate,
                            endDate: endDate
                        },
                        success: function (result) {
                            if (result.code == "S_OK") {
                                var viewData = result['var'];
                                if (!_.isArray(viewData)) {
                                    _this.logger.error("某日黄历 查宜忌详情失败 接口数据异常", viewData);
                                    return;
                                }

                                for (var i = 0; i < viewData.length; i++) {
                                    viewData[i].id = viewData[i].dayId;
                                    delete viewData[i].dayId;

                                    if (viewData[i].id == mDayId) {
                                        _this.model.set(viewData[i]);
                                    }

                                    _this.lunars.add(viewData);
                                }
                            } else {
                                _this.logger.error("某日黄历 查宜忌详情失败 ERROR", result);
                            }
                        },
                        error: function () { }
                    });
                }
            });
        }
    }));

})(jQuery, _, M139, window._top || window.top);

/// <reference path="component/m2012.calendar.calendarview.js" />
;
(function ($, _, M139, top) {

    var _super = M139.Model.ModelBase;
    var _class = "M2012.Calendar.Model.Master";
    var commonApi = new M2012.Calendar.CommonAPI(),
        utils = M2012.Calendar.CommonAPI.Utils;

    M139.namespace(_class, _super.extend({

        name: _class,

        defaults: {

            // 视图控制量：标签的勾选类型， 日历菜单 mylabel | 生日提醒 birth | 订阅日历 subscribe
            view_filter_flag: 'mylabel',

            // 视图控制量：主视图的时段形态， 月视图 month | 今明后-列表 list | 单日 day
            view_range_flag: 'month',

            //定位当前视图，主要用于记录当前展示具体视图
            view_location: "",

            sid: $Url.queryString("sid"),

            //详细日历编辑数据，用于详细创建、编辑日历时的数据传递
            edit_label_data: null,

            //详细活动编辑数据，用于详细创建、编辑活动时的数据传递
            edit_detail_data: null,

            //活动任务编号
            //此字段主要是用于外部模块调用日历创建活动的标示
            add_activity_task: null,

            //日历主视图是否首次加载完成
            first_load_completed: false,

            msg_changed_flag: false, //未读消息数变动

            contact_res_Loaded: false //是否已经加载了通讯录相关脚本资源
        },

        capi: commonApi,

        EVENTS: {
            REDIRECT: "master#linkshow:redirect",
            LOAD_MODULE: "master#linkshow:loadmodule",
            //刷新当前主视图，只是刷新数据并不呈现该视图
            REFRESH_VIEW_MAIN: "master#currentmainview:reload",
            //月视图显示更多
            LOAD_MONTH_MORELIST: "master#month_morelist:load",
            //初始化控件值
            INIT: "master#component:init",

            //添加日历
            ADD_LABEL: "master#label:add",
            EDIT_LABEL: "master#label:edit",
            //展示发现广场
            SHOW_DISCOVERY: "master#iscovery:show",

            CAL_DATA_INIT: "master:initdata",
            NAVIGATE: "master:navigate",
            REQUIRE_API: "master:requireapi",

            VIEW_CREATED: "master:viewcreated",
            VIEW_SHOW: "master:viewshow",
            TOGGLELABEL: 'master:togglelabel',

            //隐藏所有的活动弹出层
            HIDE_ACTIVITY_POPS: "activity:hideactivitypop",
            LOAD_ACTIVITY_VIEW: "activity:view",
            VIEW_POP_ACTIVILY: "activity:popview", //活动冒泡预览
            ADD_POP_ACTIVILY: "activity:popadd",
            ADD_ACTIVITY: "activity:add",
            EDIT_ACTIVITY: "activity:edit",
            SHARE_ACTIVITY: "activity:share",

            EDIT_GROUP_ACTIVITY: "activity:editgroup",

            LABEL_INIT: "label:init",
            LABEL_ADDED: "label:add",
            LABEL_CHANGE: "label:edit",
            LABEL_REMOVE: "label:remove",

            MSG_RECEVIE: "master:msgreceive",

            SEARCH_POPUP: "search:popup",

            //黑白名单弹窗
            BLACKLIST_POPUP: "blacklist:popup",
            WHITELIST_POPUP: "whitelist:popup"
        },

        initialize: function (options) {
            _super.prototype.initialize.apply(this, arguments);

            var _this = this;
            _this.api = M2012.Calendar.API;
            //系统常量
            _this.CONST = M2012.Calendar.Constant;

            //注册非冲突写法
            M2012.Calendar.Model.getInstance = function (args) {
                if (args && _.isFunction(args.callback)) {
                    args.callback(_this);
                }
            };

            _this.bindRouter(options);
            _this.bindEvent(options);
            _this.bindData(options);
            _this.render();
        },

        bindRouter: function (options) {
            var _this = this;
            var EVENTS = _this.EVENTS;

            //路由注册
            var addrRouter = new M2012.Calendar.Router({
                master: _this
            });

            _this.on(EVENTS.NAVIGATE, function (args) {
                var newFragment = (args.path || '').replace(/^[#\/]/, '');
                if (Backbone.history.fragment === newFragment) {
                    // 新增判断,如果前后两次路由的path一样,则要重启history,否则路由匹配的事件不会再触发
                    _this.logger.debug("-------The newFragment not change, history need restart!!!!-------");
                    Backbone.history.stop();
                    //(M139.Browser.getVersion() <= 7 && M139.Browser.is.ie) ? Backbone.history.start({ iframesrc: '../blank.html' }) : Backbone.history.start();
                    Backbone.history.start({ iframesrc: '../blank.html' });
                }
                addrRouter.navigateTo(args.path, { replace: true, trigger: true });

            });

            //路由导航的示例
            //master.trigger("navigate", {
            //    path: "mod/month-0/2014/3/8"
            //})

            //跳转路由完成实例后，启动历史记录。
            /**
            if (M139.Browser.getVersion() <= 7 && M139.Browser.is.ie) {
                Backbone.history.start({ iframesrc: '../blank.html' });
            } else {
                Backbone.history.start({ iframesrc: '../blank.html' });
                //Backbone.history.start();
            }*/

            Backbone.history.start({ iframesrc: '../blank.html' });
        },

        bindData: function (options) {
            var _this = this;

            var now = _this.capi.Today;
            _this.set({ year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() }, { silent: true });
            _this.logger.debug("init now %s", now);
        },

        bindEvent: function () {
            var _this = this;
            var EVENTS = _this.EVENTS;

            $(window).on('unload', function () {
                _this.dispose();
            });

            //此事件主要用于监听左侧日历标签筛选
            _this.on("change:view_filter_flag", function (master, value) {
                var STYPE = _this.CONST.specialType;
                var shouldLoadView = false;
                _this.set({
                    includeTypes: value === "birth" ? [STYPE.birth] : []
                });
                //如果是群日历
                // 1、显示添加群活动按钮
                // 2、列表视图变成时间轴视图
                if (value == "group") {
                    var view = master.get("view_location").view;
                    //当主视图为列表视图而当前选择的日历标签为群日历时
                    //需要导航到月视图
                    if (view == "list")
                        shouldLoadView = true;

                    //左侧顶部创建活动按钮切换
                    $("#createGroupBtn").removeClass("hide");
                    $("#createBtn").addClass("hide");
                    //时间轴、列表视图切换
                    $(".js_item_list").addClass("hide");
                    $(".js_item_timeline").removeClass("hide");

                } else {
                    var view = master.get("view_location").view;
                    //当主视图为时间轴而当前选择的日历标签不为群日历时
                    //需要导航到月视图
                    if (view == "timeline")
                        shouldLoadView = true;

                    //左侧顶部创建活动按钮切换
                    $("#createGroupBtn").addClass("hide");
                    $("#createBtn").removeClass("hide");
                    //时间轴、列表视图切换
                    $(".js_item_list").removeClass("hide");
                    $(".js_item_timeline").addClass("hide");
                }
                if (shouldLoadView)
                    master.trigger(master.EVENTS.NAVIGATE, { path: "mainview/month" });
            });

            //当前年月日变化触发
            _this.on("change:year change:month change:labels", function () {

                if (_this.changeTimer) {
                    window.clearTimeout(_this.changeTimer);
                }
                _this.changeTimer = window.setTimeout(function () {

                    //当前视图不为主视图时我们采取刷新隐藏在背后的主视图
                    //这样主要是解决从从视图返回到主视图后的数据呈不现一致问题
                    _this.trigger(_this.EVENTS.REFRESH_VIEW_MAIN);

                }, 0xff);

            });

            //主视图首次加载完毕后需要判断是否有外部调用
            //然后导向指定的视图
            _this.on("change:first_load_completed", function () {
                _this.redirect();
            });

            //获得主控API实例
            _this.on(EVENTS.REQUIRE_API, function (args) {
                if (_.isFunction(args.success)) {
                    args.success(_this.api);
                }
            });

            //加载日历初始化数据，并缓存
            _this.on(EVENTS.CAL_DATA_INIT, function (args) {
                if (_.isUndefined(args)) {
                    args = {};
                }

                if (!args.isRefresh) {
                    var initData = _this.get("initData");
                    if (initData) {
                        return args.success(initData);
                    }
                }

                _this.api.initCalendar({
                    data: {},
                    success: function (result) {
                        if (result.code == "S_OK") {
                            _this.set({ initData: result['var'] }, { silent: true });

                            args.success(result);
                        } else {
                            if (_.isFunction(args.error)) {
                                args.error(result);
                            }
                        }
                    },
                    error: function () { }
                });
            });

            //当前视图不为主视图时我们才去刷新隐藏在背后的主视图
            //这样主要是保证从其他视图返回到主视图后的数据呈现一致
            _this.on(_this.EVENTS.REFRESH_VIEW_MAIN, function () {
                if (!_this.isMainView()) {
                    var viewModel = $.grep(_this.mainview.views.models, function (model, i) {
                        return model.get("id") == _this.get("view_range_flag");
                    });
                    if (viewModel && viewModel.length > 0) {
                        _this.trigger(_this.EVENTS.VIEW_SHOW, {
                            name: "mainview",
                            container: viewModel[0].get("container"),
                            args: { subview: viewModel[0].get("id") }
                        });
                    }
                }

            });


            //在第一次加载日历标签时，静默存储checklabels为，真实的日历标签
            _this.on("change:labelData", function (model, value, changes) {
                var labels = _this.get("labels");

                var arr1 = _.map(value.sysLabels, function (i) {
                    i.isSystemLabel = true;
                    return i;
                });

                arr1 = arr1.concat(_.map(value.userLabels, function (i) {
                    i.isUserLabel = true;
                    return i;
                }));

                arr1 = arr1.concat(_.map(value.shareLabels, function (i) {
                    i.isShareLabel = true;
                    return i;
                }));

                var arr2 = arr1.concat(_.map(value.subscribedLabels, function (i) {
                    i.isSubscribe = true;
                    return i;
                }));
                var arr3 = _.map(value.groupLabels, function (i) {
                    i.isGroup = true;
                    return i;
                })

                arr2 = arr2.concat(arr3);

                arr1 = _.map(arr1, function (i) {
                    return i.seqNo;
                });
                arr3 = _.map(arr3, function (i) {
                    return i.seqNo;
                });

                var isGroup = _this.get("view_filter_flag") === "group";
                var checkLabels = isGroup ? arr3 : arr1;
                //建立日历标签的数组，注意服务端返回的，每个数组元素属性不一样。
                //注意：labelArray是实体组，checklabels 是序列ID数组
                _this.set({
                    labelArray: arr2,
                    checklabels: checkLabels,
                    mychecklabels: _.clone(checkLabels)
                }, { silent: true });
                _this.trigger(EVENTS.LABEL_INIT, { checklabels: checkLabels });
            });

            /**
             *  快捷查看活动详情
             *  @param {Number} args.seqNo   活动Id
             *  @param {Number} args.type    活动类型
             *  @param {Number} args.target  目标源，主要用于定位弹出框位置，鼠标事件对象event为空时该参数不应为空 (可选)
             *  @param {Object} args.event   事件数据，当其值不为空时优先以鼠标坐标定位  (可选)
             *  @param {Object} args.rect    目标源坐标信息，有时候无法获取到准确的信息所以需要传入  (可选)
             *  @param {Object} args.callback 弹出框和页面通信的回调函数
             */
            _this.on(EVENTS.VIEW_POP_ACTIVILY, function (args) {
                args = args || {};

                _this.getCalendar({
                    seqNo: args.seqNo,
                    type: args.type,
                    success: function (data) {
                        var func = function () {
                            //打开详情展示框
                            new M2012.Calendar.View.ActivityDetailPopup({
                                target: args.target,
                                event: args.event,
                                rect: args.rect,
                                master: _this,
                                data: data,
                                callback: args.callback
                            }).show();
                            args.success && args.success(data);
                        };
                        if (!_.isUndefined(M2012.Calendar.View.ActivityDetailPopup)) {
                            func();
                            return;
                        }
                        M139.core.utilCreateScriptTag({
                            id: "viewActivityPopPack",
                            src: top.getDomain('resource') + '/m2012/js/packs/calendar/cal_pop_activity_async.html.pack.js',
                            charset: "utf-8"
                        }, function () {
                            func();
                        });
                    },
                    error: function (msg) {
                        var msg = "操作失败，请稍后再试";
                        args.error && args.error(msg);
                        _this.logger.error(msg);
                    }
                });

            });


            /**
             *  日历视图上快捷添加动详情
             *  @param {Object} args.target   //触发源和事件源，用于定位弹出框位置 (target、event两参数至少要一项)
             *  @param {Object} args.event    //触发事件携带数据，如果该参数存在，则弹出框以鼠标位置定位。
             *  @param {Object} args.date     //指定创建活动的日期
             *  @param {Object} args.time     //指定创建活动的时分
             *  @param {Object} args.isFullDayEvent //是否是全天活动
             *  @param {Object} args.master   //视图主控
             *  @param {Object} args.callback //弹出框和调用方的通信回调函数             
             */
            _this.on(EVENTS.ADD_POP_ACTIVILY, function (args) {
                _this.capi.addBehavior("calendar_addmonthpopact_click");

                //如果当前是在群日历视图添加活动
                //则需要判断是否存在自己创建的群日历标签
                //如果自己没有创建过标签，则需要引导至新增群日历视图
                if (_this.get("view_filter_flag") === "group") {
                    var groupLabels = _this.getGroupLabels(true);
                    if (!groupLabels || !groupLabels.length) {
                        _this.trigger(EVENTS.NAVIGATE, { path: "mod/grouplabel" });
                        return;
                    }
                }
                if (_.isUndefined(M2012.Calendar.View.ActivityAddPopup)) {
                    M139.core.utilCreateScriptTag({
                        id: "addPopActivitypack",
                        src: top.getDomain('resource') + '/m2012/js/packs/calendar/cal_pop_activity_async.html.pack.js',
                        charset: "utf-8"
                    }, function () {
                        new M2012.Calendar.View.ActivityAddPopup(args).show();
                    });
                    return;
                }
                new M2012.Calendar.View.ActivityAddPopup(args).show();
            });

            /**
             *  创建日历标签
            **/
            _this.on(EVENTS.ADD_LABEL, function (data) {
                _this.trigger(EVENTS.EDIT_LABEL, data);
            });

            /**
             * 编辑日历标签
             * @param {Number} args.labelId     //日历ID
             * @param {Boolean} args.isShared   //是否共享日历
             * @param {Boolean} args.isSubscribed //是否共享日历
             * @param {Boolean} args.isGroup 群组日历
            **/
            _this.on(EVENTS.EDIT_LABEL, function (data) {
                //数据存入
                data = data || {};
                var path = "mod/label";
                //如果是共享日历则跳转到共享日历编辑视图
                if (!_.isUndefined(data.isShared) && data.isShared) {
                    path = "mod/sharelabel";
                    delete data.isShared;
                }
                //如果是订阅日历则也跳转到共享日历编辑视图
                if (!_.isUndefined(data.isSubscribed) && data.isSubscribed) {
                    path = "mod/sharelabel";
                    delete data.isSubscribed;
                }
                if (!_.isUndefined(data.isGroup) && data.isGroup) {
                    path = "mod/grouplabel";
                    delete data.isGroup;
                }
                //将字符串形式的数字转换成数字
                if (data.labelId && !_.isNumber(data.labelId)) {
                    data.labelId = Number(data.labelId);
                }
                _this.set({ "edit_label_data": data });
                _this.trigger(EVENTS.NAVIGATE, { path: path });
            });

            /**
             * 打开创建活动详情页,数据结构同活动信息实体
             * @param {Number} args.seqNo   //活动ID
             * @param {String} args.title   //活动标题
             * @param {Date}   args.dStart 开始日期，格式为 yyyy-MM-dd
             * @param {Int}    args.beforeTime 提前的时间单位，如15
             * @param {Int}    args.beforeType {Int} 提前的时间类型，如0 表示分钟,详见接口文档
             * @param {String Or Date} startTime 开始时间，如果是字符串形式格式为 yyyy-MM-dd hh:mm
             * @param {String Or Date} 结束时间，如果是字符串形式格式为 yyyy-MM-dd hh:mm
             */
            _this.on(EVENTS.ADD_ACTIVITY, function (data) {
                _this.trigger(EVENTS.EDIT_ACTIVITY, data);
            });

            /**
             * 打开编辑活动详情页
             * @param {Object} data        //参数对象
             * @param {Int}    data.seqNo  //活动Id,必填
             * @param {Int}    data.type   //类型：
             */
            _this.on(EVENTS.EDIT_ACTIVITY, function (data) {
                data = data || {};
                //将字符串形式的数字转换成数字
                if (data.seqNo && !_.isNumber(data.seqNo)) {
                    data.seqNo = Number(data.seqNo);
                }
                //数据存入
                _this.set({ "edit_detail_data": data });
                var path = "mod/detail";
                //邀请、共享或订阅活动处理
                if (data && data.type) {
                    //邀请、共享活动
                    if ((data.type === 1 || data.type === 2))
                        path = "mod/invite_share_act";
                        //订阅活动
                    else if (data.type == 3)
                        path = "mod/subsc_act";
                    else if (data.type == 4) {
                        _this.trigger(EVENTS.EDIT_GROUP_ACTIVITY, data);
                        return;
                    }
                }
                _this.trigger(EVENTS.NAVIGATE, {
                    path: path
                });
            });

            /**
             * 如果需要编辑某条群活动,只需要传入seqNo即可
             * @param seqNo {Int} 需要编辑的群活动ID
             * 
             * 如果是快捷创建的详细编辑
             * @param title {String} 群活动主题
             * @param dtStart {String} 开始时间,注意格式
             * @param dtEnd {String} 结束时间, 如果传递了开始时间,必须传入结束时间,可以是一样的值
             * @param enable {Boolean} 是否提醒,固定是短信提醒
             */
            _this.on(EVENTS.EDIT_GROUP_ACTIVITY, function (data) {
                //数据存入
                _this.set({ "edit_group_data": data });
                var path = "mod/groupactivity";

                _this.trigger(EVENTS.NAVIGATE, {
                    path: path
                });
            });

            _this.on(EVENTS.SEARCH_POPUP, function (data) {
                if (_.isUndefined(M2012.Calendar.View) || _.isUndefined(M2012.Calendar.View.Search)) {
                    M139.core.utilCreateScriptTag({     //异步加载处理日历tip中接受和拒绝的message model
                        scriptId: "m139_calendar_search_dialog_js",
                        src: "/m2012/js/packs/calendar/cal_index_async.html.pack.js"
                    }, function () {
                        new M2012.Calendar.View.Dialog.Search();
                    });
                } else {
                    new M2012.Calendar.View.Dialog.Search();
                }
            });

            //日历黑白名单
            _this.on(EVENTS.WHITELIST_POPUP, function () {

                //TODO 有没有统一的命名空间和js对应的config啊,每次都要这样load
                if (_.isUndefined(M2012.Calendar.View) || _.isUndefined(M2012.Calendar.View.BlackWhiteList)) {
                    _this.loadJsResAsync({
                        id: "labelpop",
                        url: "/calendar/cal_index_addLabel_async.html.pack.js",
                        useContact: true,
                        onload: function () {
                            new M2012.Calendar.View.BlackWhiteList({ master: window.$Cal });
                        }
                    });

                } else {
                    new M2012.Calendar.View.BlackWhiteList({ master: window.$Cal });
                }
            });

            /**
             * 分享活动,快速唤起发邮件弹框
             */
            var tplShare = $("#tplShare").html(), //模板在cal_index.html页面中
                template = _.template(tplShare);
            _this.on(EVENTS.SHARE_ACTIVITY, function (data) {
                //加上开始时间格式化后的字符串
                var item = $.extend(_.clone(data), { dateTitle: $Date.format("yyyy年MM月dd日", $Date.parse(data.dtStart) || new Date()) });
                top.$Evocation.create({
                    type: 1, //邮件
                    subject: "139邮箱日历分享：" + item.title, //主题,填到input,不需要编码
                    content: template(item), //内容
                    isEdit: false, //不可编辑
                    showZoomSize: false, //不显示放大缩小
                    beforeSend: function (info, evoModel) { //覆盖掉发送按钮功能
                        //调用自己的发件接口
                        _this.api.shareCalendar({
                            data: {
                                seqNo: data.seqNo,
                                to: info.email
                            },
                            success: function (responseData, responseText) {
                                if (responseData && responseData.code == "S_OK") { //为什么写的到处是S_OK呢?
                                    evoModel && evoModel.letterSuccess && evoModel.letterSuccess();
                                } else {
                                    top.M139.UI.TipMessage.hide(); //先关掉其他的,否则可能因为delay不一致,导致显示问题
                                    top.M139.UI.TipMessage.show("发送失败，请稍后重试", { delay: 2000, className: "msgRed" });
                                    _this.logger.error(responseText);
                                }
                            }
                        });

                        return false;
                    }
                });
            });

            //统一位置的搜索
            top.$App.off("calendarSearch").on("calendarSearch", function (data) {
                data = data || {};
                var EVENTS = _this.EVENTS;
                if (!!data.keyword) {
                    _this.trigger(EVENTS.NAVIGATE, {
                        path: 'mod/search/search-' + encodeURIComponent(data.keyword)
                    });
                }
            });

        },

        render: function () {
            var _this = this;
            //加载黄历
            new M2012.Calendar.View.AboutToday({
                master: _this
            });
        },

        /**
         * 判断当前时视图是不是在主视图
         */
        isMainView: function () {
            var _this = this;
            var viewObj = _this.get("view_location");

            return viewObj && viewObj.isMainView;
        },

        /**
         *  异步加载脚本资源
         *  @param {String}    args.id          //资源名称
         *  @param {String}    args.url         //脚本资源地址
         *  @param {String}    args.useContact  //是否使用通讯录相关业务
         *  @param {Function}  args.onload      //脚本加载成功后的处理函数
       **/
        loadJsResAsync: function (args) {
            var _this = this;
            args = args || {};

            (function (func) {
                //如果需要加载通讯录脚本则优先加载该脚本
                if (args.useContact && !_this.get("contact_res_Loaded")) {
                    M139.core.utilCreateScriptTag({
                        id: "add_contactcomp_pack",
                        src: top.getDomain('resource') + '/m2012/js/packs/calendar/cal_contactcomp.html.pack.js?sid=' + top.sid,
                        charset: "utf-8"
                    }, function () {
                        //设置通讯录资源已经加载标示
                        _this.set({ contact_res_Loaded: true });
                        func();
                    });
                    return;
                }
                func();

            })(function () {
                //异步下载js
                //todo 该方法在IE6下异步加载GZIP压缩过的JS会出现无法执行的情况，需要和运维协商修改服务器配置，
                M139.core.utilCreateScriptTag({
                    id: "add_" + args.id + "_pack",
                    src: top.getDomain('resource') + '/m2012/js/packs' + args.url + '?sid=' + top.sid,
                    charset: "utf-8"
                }, function () {
                    args.onload && args.onload();
                });
            });

        },

        /**
         * 获取用户的所有标签列表
        */
        getUserLabels: function () {
            var self = this;
            var labels = self.get("labelData");
            var defaultLables = {
                isSystemLabel: true,
                labelName: "我的日历",
                color: "#319eff",
                seqNo: 10
            };
            if (labels) {
                var sysLabels = _.isArray(labels.sysLabels) ? labels.sysLabels : [];
                var userLabels = _.isArray(labels.userLabels) ? labels.userLabels : [];
                var value = [].concat(sysLabels, userLabels);

                if (value.length > 0)
                    return value;
            }
            return [defaultLables];
        },

        /**
         * 获取群日历标签列表
         * @param {Boolean}  isOwner  //是否是自己创建的日历
         */
        getGroupLabels: function (isOwner) {
            var self = this;
            var labels = self.get("labelData") || {};
            if (!labels.groupLabels || !labels.groupLabels.length)
                return null;

            if (isOwner)
                return _.filter(labels.groupLabels, function (label) {
                    return label.isOwner == 1;
                });

            return labels.groupLabels;
        },

        /**
         * 判断一个日历是否是共享日历
         * @param {Number}  labelId  //日历ID
        **/
        isShareLabel: function (labelId) {
            var self = this;
            var data = self.get("labelData") || {};
            data = (data.userLabels || []).concat(data.groupLabels || []);
            var label = $.grep(data, function (n, i) {
                return n.seqNo == labelId;
            })
            if (label.length && (label[0].isShare || label[0].isGroup)) {
                return true;
            }
            return false;
        },

        /**
         * 获取活动详情
        */
        getCalendar: function (args) {
            var _this = this;
            _this.trigger(_this.EVENTS.REQUIRE_API, {
                success: function (api) {
                    api.getCalendar({
                        data: {
                            seqNo: args.seqNo,
                            type: args.type
                        },
                        success: function (result) {
                            if (result.code == "S_OK") {
                                args.success && args.success(result["var"]);
                            } else {
                                var msg = "获取活动详情失败 ERROR!";
                                args.error && args.error(msg);
                                _this.logger.error(msg, result);
                            }
                        },
                        error: function (e) {
                            var msg = "获取活动详情失败 ERROR";
                            args.error && args.error(msg + "：" + e);
                            _this.logger.error(msg);
                        }
                    });
                }
            });
        },

        /**
         * 页面重定向
         * 公开日历部分功能供其他模块调用
         * 调用方式： $App.show(key); key配置在全局变量window.LinkConfig中
        */
        redirect: function () {
            var _this = this;
            var EVENTS = _this.EVENTS;
            var value = $Url.queryString("redirect");
            var taskId = $Url.queryString("taskId");

            if (!value)
                return;

            //将任务id存储起来以便在对应模块处理
            if (taskId) {
                _this.set({
                    add_activity_task: {
                        name: value,
                        taskId: taskId
                    }
                });
            }

            switch (value) {
                case "addlabel":
                    _this.trigger(EVENTS.ADD_LABEL);
                    break;
                case "addact":
                    //活动id，为0则表示添加全新的活动
                    var seqNo = Number($Url.queryString("seqno"));
                    //标示当前添加活动的类型
                    //year:按年、month按月、day:按日 week:按周
                    var type = $Url.queryString("type") || "";
                    var pn = /^day|week|month|year$/i;
                    if (!pn.test(type)) {
                        if (!!seqNo) {
                            _this.trigger(EVENTS.EDIT_ACTIVITY, {
                                seqNo: seqNo,
                                type: 0
                            });
                        } else {
                            _this.trigger(EVENTS.ADD_ACTIVITY, {
                                title: decodeURI($Url.queryString("title") || ""),
                                content: decodeURI($Url.queryString("content") || "")
                            });
                        }
                        return;
                    }
                    var TEMPLATES = M2012.Calendar.Constant.scheduleTempMap;
                    var scheduleTemp = "";
                    switch (type.toLowerCase()) {
                        case "day":
                            scheduleTemp = TEMPLATES.dayTemp;
                            break;
                        case "week":
                            scheduleTemp = TEMPLATES.weekTemp;
                            break;
                        case "month":
                            scheduleTemp = TEMPLATES.monthTemp;
                            break;
                        case "year":
                            scheduleTemp = TEMPLATES.yearTemp;
                            break;
                    }
                    if (scheduleTemp) {
                        new M2012.Calendar.View.Popup.FastSchedule({
                            master: _this,
                            scheduleTemp: scheduleTemp
                        });
                    }
                    break;
                case "msg":
                    _this.trigger(EVENTS.NAVIGATE, { path: "mod/message" });
                    break;
                case "search":
                    var key = $Url.queryString("search");
                    top.$App.trigger("calendarSearch", { keyword: key });
                    break;
                case "discovery":
                    _this.trigger(EVENTS.SHOW_DISCOVERY);
                    break;
                case "labelmgr":
                    _this.trigger(EVENTS.NAVIGATE, { path: "mod/labelmgr" });
                    break;
                case "actview":
                    var id = Number($Url.queryString("id")),
                        isOwner = Number($Url.queryString('isowner')),
                        type = Number($Url.queryString("type"));

                    switch (type) {
                        case 1: // 邀请的活动
                        case 2: // 共享的活动
                        case 3: // 订阅的活动
                            //由于群组日历会修改type.所以123的类型先trigger
                            _this.trigger(EVENTS.EDIT_ACTIVITY, {
                                seqNo: id || 0,
                                type: type
                            });
                            break;
                        case 4: // 群组活动
                            if (!isOwner) {
                                type = 2; //如果是群组活动,并且非自己创建的,则跟共享的编辑页面相同
                            }

                            _this.trigger(EVENTS.EDIT_ACTIVITY, {
                                seqNo: id || 0,
                                type: type
                            });

                            break;
                        default:
                            break;
                    }

                    //if (type == 1) {
                    //    // 邀请的活动
                    //    _this.trigger(EVENTS.EDIT_ACTIVITY, {
                    //        seqNo: id || 0,
                    //        type: 1
                    //    });
                    //} else if (type == 2) {
                    //    // 共享的活动
                    //    _this.trigger(EVENTS.EDIT_ACTIVITY, {
                    //        seqNo: id || 0,
                    //        type: 2
                    //    });
                    //} else if (type == 3) {
                    //    // 订阅的活动                      
                    //    _this.trigger(EVENTS.EDIT_ACTIVITY, {
                    //        seqNo: id || 0,
                    //        type: 3
                    //    });
                    //}
                    break;
                case "addbirthact": // 从外部直接打开生日提醒快捷创建
                    new M2012.Calendar.Popup.View.Birthday({ master: _this });
                    break;
                case "viewlabel": // 从邮件中直接点击查看共享日历的链接
                    var labelId = $Url.queryString("id");
                    var isGroup = Number($Url.queryString('isgroup'));

                    if (!!isGroup) {
                        //群组日历跳转过来的,走共享日历流程,虽然于下面相同,但是保留分支,因为...分分钟需求会变
                        _this.trigger(EVENTS.EDIT_LABEL, {
                            labelId: labelId,
                            isShared: true //走共享日历分支
                        });
                    } else {
                        _this.trigger(EVENTS.EDIT_LABEL, {
                            labelId: labelId,
                            isShared: true
                        });
                    }
                    break;
            }
        },

        /**
         * 根据标签序列号，查询单个标签
         * @param seqNo
         * @returns {*}
         */
        getLabelBySeqNo: function (seqNo) {
            var _this = this;
            var labels = _this.get('labelArray');
            if (!labels.length) {
                return null;
            }
            for (var i = labels.length; i--;) {
                if (labels[i].seqNo == seqNo) {
                    return _.clone(labels[i]);
                }
            }
            return null;
        }
        , dispose: function () {

        }
    }));

    $(function () {
        window.$Cal = new M2012.Calendar.Model.Master();
    });

})(jQuery, _, M139, window._top || window.top);


(function ($, _, M139, top) {

    var _super = Backbone.View;
    var CHG_HEIGHT = "leftmenu#change:height";

    //左侧导航栏 - 各日历菜单
    var _class = "M2012.Calendar.View.LeftMenu";
    var Validate = M2012.Calendar.View.ValidateTip;
    var constant = M2012.Calendar.Constant,
        maxLabelsSum = constant.Common_Config.Max_Labels_Sum,
        rightIcon = constant.LeftMenu_Config.ICON_RIGHT,
        downIcon = constant.LeftMenu_Config.ICON_DOWN;

    M139.namespace(_class, _super.extend({

        name: _class,

        el: "#pnlLeftMenu",
        custom_visible: 1, // 页面初始加载完成时, 我的日历列表展开
        logger: new M139.Logger({ name: _class }),
        labelTypes: {
            SYSTEM: 'sys',
            USER: 'user',
            SHARE: 'share',
            GROUP: 'group'
        },

        initialize: function (options) {
            var _this = this;
            _super.prototype.initialize.apply(_this, arguments);

            _this.master = options.master;
            _this.pnlMenu = $(_this.el);
            _this.btnCreate = $("#btnCreate");
            _this.btnGroupCreate = $("#btnGroupCreate");
            _this.bottomDiscovery = $("#bottom_discovery");
            _this.btnExtend = _this.pnlMenu.find("#btnExtend");

            _this.template = _.template($("#tplLeftMenu").html());

            _this.render();
            _this.initEvents();

            return _this;
        },

        initEvents: function () {
            var _this = this;

            var master = _this.master;
            var common = master.capi;
            var EVENTS = master.EVENTS;
            var labelTypes = _this.labelTypes;
            var SCROLL = "menuScroll";
            var interval;

            var pnlLeftBar = $("#pnlLeftBar"),
                bigMenu = pnlLeftBar.children(":last"), // 除开包含"创建按钮"区域以外的区域
                pnlLeftMenu = $("#pnlLeftMenu"),// 左侧栏分割线以下的区域
                bottomHeightPixel = 5, // 最下面黄色区域的高度,暂时定为5像素
                bottom_discovery = $("#bottom_discovery"); // 出现滚动条之后要显示的发现广场元素

            function showscroll() {
                var normal_discovery = $("#normal_discovery"); // 正常情况下(未出现滚动条)显示的发现广场元素
                var isShowBigScroll = false, // 是否显示外层滚动条
                    bigScrollTop = bigMenu.scrollTop() || 0, // 表示如果最外层DIV中有滚动条,滚动条滚动的距离
                    bodyHeight = $("body").height(),
                    pnlLeftMenuTop = pnlLeftMenu.offset().top, // pnlLeftMenu距离顶部document的距离,保存起来(因为在360浏览器下会出现兼容性问题)
                    menuLabelsHeight = _this.menulabels ? _this.menulabels.height() : 24; // IE6中会出现_this.menulabels为undefined的情况
                pnlLeftBar.height(bodyHeight); // 先设置左侧导航栏的高度
                bottom_discovery.hide(); // 默认先隐藏固定在底部的发现广场DOM
                normal_discovery.show(); // 默认显示正常位置的发现广场DOM

                if (bigScrollTop + pnlLeftMenuTop + menuLabelsHeight + bottomHeightPixel >= bodyHeight) {
                    // 显示最外层的滚动条
                    isShowBigScroll = true;
                }

                if (!isShowBigScroll) {
                    // 只显示内部滚动条
                    pnlLeftMenu[0].style.position = 'relative';
                    pnlLeftMenu[0].style.overflowY = 'auto';
                    pnlLeftMenu[0].style.overflowX = ''; //隐藏横向滚动条
                    bigMenu[0].style.overflowY = '';
                    bigMenu[0].style.position = '';
                    bigMenu[0].style.height = '';
                    // 不断resize窗口,pnlLeftMenu.offset().top这个值在"360浏览器"下会出现变化,
                    // 出现变化原因: 上述if中的某行代码引发
                    // 解决方法: 暂时将这个值先保存到变量(pnlLeftMenuTop)中,防止值变化出现的兼容性问题
                    var leftMenuHeight = bodyHeight - pnlLeftMenuTop - bottomHeightPixel;
                    pnlLeftMenu.height(leftMenuHeight);//滚动条容器高度

                    if (pnlLeftMenu[0].scrollHeight > pnlLeftMenu.height()) {
                        // 出现滚动条, 则将发现广场固定在左侧栏底部, 并改变pnlLeftMenu的高度
                        pnlLeftMenu.height(leftMenuHeight - bottom_discovery.height());
                        bottom_discovery.show();
                        normal_discovery.hide();
                    }
                } else {
                    // 显示外部滚动条
                    pnlLeftMenu[0].style.position = 'relative';
                    pnlLeftMenu[0].style.overflowY = '';
                    pnlLeftMenu[0].style.height = '';
                    bigMenu[0].style.overflowY = 'auto';
                    bigMenu[0].style.position = 'relative';

                }

                /**调整外层DIV的高度*/
                var top = bigMenu.offset().top; // bigMenu距离document的高度
                if ($B.is.ie && $B.getVersion() <= 8) {
                    // IE,360浏览器
                    bigMenu.height(bodyHeight - top - bottomHeightPixel - 2); // ie8及以下浏览器多减2
                } else {
                    bigMenu.height(bodyHeight - top - bottomHeightPixel);
                }
            }

            // 函数节流,防止频发触发
            $(window).resize(function () {
                // 这里设置成间隔50ms之后在触发
                clearTimeout(interval);
                interval = setTimeout(showscroll, 50);
            });

            master.on(CHG_HEIGHT, function () {
                showscroll();
                // 保存"日历"展开状态,在日历广场中"订阅"或"退订"日历时,不需要对左侧栏中日历的状态进行改变
                _this.master.set(constant.LeftMenu_Config.IS_OPEN_STATUS, _this.lstCustom.is(":visible"));
            });

            master.on("change:view_location", function () {
                var view = master.get("view_location").view;
                // 修复IE6中左侧栏占用了月视图位置的问题,以及滚动鼠标,左侧栏消失
                if (M139.Browser.getVersion() <= 6) {
                    pnlLeftBar.hasClass(constant.LeftMenu_Config.INASIDE_BUG) && pnlLeftBar.removeClass(constant.LeftMenu_Config.INASIDE_BUG);
                    if (view == 'month' || view == 'day') {
                        !pnlLeftBar.hasClass(constant.LeftMenu_Config.INASIDE_BUG) && pnlLeftBar.addClass(constant.LeftMenu_Config.INASIDE_BUG);
                    }
                }
                //展示时间轴视图时隐藏顶部操作栏的时间前后切换区域
                if (view == "timeline") {
                    $("#dvdayChoose").addClass("hide");
                } else {
                    $("#dvdayChoose").removeClass("hide");
                }
            });

            master.on("changeNavColor", function (param) {
                var cmdEl = $(_this.el).find('[data-cmd = "' + param.cmd + '"]'),
                    menuItems = $("#pnlLeftMenu a.js_menu_labels");

                if (cmdEl.length) {
                    menuItems && menuItems.removeClass("on");
                    cmdEl.addClass("on");
                }
            });

            _this.btnCreate.click(function () {
                // 记录行为日志
                master.capi.addBehavior("calendar_createactBtn_click");
                master.trigger('master:navigate', { path: "mod/detail-0-0" });
            });
            //添加群活动
            _this.btnGroupCreate.click(function (e) {
                master.capi.addBehavior("calendar_createactBtn_click");
                var groupLabels = master.getGroupLabels(true);
                //判断是否有群日历
                if (groupLabels && groupLabels.length > 0) {
                    master.trigger('master:navigate', { path: "mod/groupactivity" });
                    return;
                }
                master.trigger('master:navigate', { path: "mod/grouplabel" });
            });

            _this.pnlMenu.click(function (e) {
                var source = common.parent(e.target, function (el) { return !_.isEmpty($(el).data('cmd')) });
                if (source === null) return;

                source = $(source);
                var cmd = source.data("cmd");
                if (_.isEmpty(cmd)) {
                    return;
                }

                var menuitems = $("#pnlLeftMenu a.js_menu_labels");
                var seqNo = Number(source.closest("a").data("seqno")) || Number(source.data("seqno"));
                var type = source.closest("a").data("type") || source.data("type");
                _this.logger.debug('左导航菜单点选：cmd=%s', cmd, e.clientX);

                switch (cmd) {
                    case "filterdefault":
                        // 全选操作
                        master.capi.addBehavior("calendar_calendardroplist_click");

                        var li = $(source).closest("li"), // 最近的父亲节点
                            allLabels = li.find("ul [data-cmd='filterlabel']"),
                            labelsNoArr = [],
                            icon = li.find("a[data-cmd='expand']");

                        master.trigger("clearAll", function () {
                            $(allLabels).each(function () {
                                // 所有的日历处于勾选状态(全选)
                                $(this).removeClass("ok").addClass("ok");
                                // 保存所有处于勾选状态的日历seqNo
                                labelsNoArr.push($(this).closest("a").data("seqno"));
                            });
                            source.addClass("on");
                        });

                        // 替换判断_this.custom_visible
                        if (e.clientX < 27 || icon.hasClass(rightIcon)) {
                            _this.toggleMenu(icon, li.find("ul"));
                            _this.logger.debug('菜单左端，折叠我的日历');
                        }

                        // 触发事件, 调用后台接口根据不同的seqNo重新渲染界面
                        if (type === 'subscribe') {
                            master.set({
                                checklabels: labelsNoArr,
                                view_filter_flag: 'subscribe',
                                grouplabels: _.clone([]),
                                subscribedlabels: _.clone(labelsNoArr),
                                mychecklabels: _.clone([]) // 清空存放日历下ID的数组
                            });
                        } else if (type === 'group') {
                            master.capi.addBehavior("cal_leftmenu_group_click");
                            master.set({
                                checklabels: labelsNoArr,
                                view_filter_flag: 'group',
                                grouplabels: _.clone(labelsNoArr),
                                subscribedlabels: _.clone([]),
                                mychecklabels: _.clone([]) // 清空存放日历下ID的数组
                            });
                        } else {
                            master.set({
                                checklabels: labelsNoArr,
                                view_filter_flag: 'mylabel',
                                grouplabels: _.clone([]),
                                mychecklabels: _.clone(labelsNoArr),
                                subscribedlabels: _.clone([])  // 清空存放订阅日历ID的数组
                            });
                        }

                        if (!master.get("view_location").isMainView) {
                            // 统一下, 当前视图是主视图时, 不需要刷新
                            master.trigger(master.EVENTS.NAVIGATE, { path: "mainview/refresh" });
                        }
                        break;
                    case "expand":
                        master.capi.addBehavior("calendar_calendardroplist_click");
                        _this.logger.debug('收缩/展开');
                        _this.toggleMenu(source, source.closest("li").find("ul"));
                        e.stopPropagation();
                        break;

                    case "loaddiscovery":
                        master.trigger(EVENTS.SHOW_DISCOVERY);
                        break;

                    case "filterbirth":
                        master.capi.addBehavior("calendar_leftbarbirthday_click");
                        _this.logger.debug('生日提醒');
                        menuitems.removeClass("on");
                        source.addClass("on");
                        master.set({ view_filter_flag: 'birth' });
                        if (!master.isMainView()) {
                            master.trigger(master.EVENTS.NAVIGATE, {
                                path: "mainview/refresh"
                            });
                        }
                        break;

                    case "filterlabel": // 点击小颜色块时
                        _this.logger.debug('筛选%s标签日历, %s', seqNo, type);
                        var _args = { label: seqNo };

                        //我的日历、共享日历是多选
                        _args.group = true;

                        _args.success = function () {
                            if (!source.is("i")) {
                                // 色块必须是I标签
                                return;
                            }

                            master.trigger("clearAll", function () {
                                var checkedlabels = master.get("checklabels");

                                // 根据保存的日历ID(订阅的或我的日历下的)回填勾选样式
                                for (var i = 0; i < checkedlabels.length; i++) {
                                    source.closest("ul").find("a[data-seqno = '" + checkedlabels[i] + "']").find("i").addClass("ok");
                                }
                                // 将当前栏目选中样式
                                source.closest("ul").closest("li").find(".js_menu_labels").addClass("on");
                            });
                        };

                        master.trigger('master:togglelabel', _args);
                        if (!master.isMainView()) {
                            master.trigger(master.EVENTS.NAVIGATE, {
                                path: "mainview/refresh"
                            });
                        }
                        break;
                    case "choicelabel": // 点击色块右侧区域时
                        master.trigger("clearAll", function () {
                            source.closest("ul").closest("li").find(".js_menu_labels").addClass("on");
                            source.closest('li').find('i[data-cmd="filterlabel"]').removeClass("ok").addClass("ok"); // 选中当前色块
                        });

                        if (type === 'subscribe') { // 针对"订阅日历"栏目下面的日历
                            master.set({
                                checklabels: [seqNo],
                                view_filter_flag: 'subscribe',
                                subscribedlabels: _.clone([seqNo])
                            });
                        }
                        else if (type === 'group') {
                            master.set({
                                checklabels: [seqNo],
                                view_filter_flag: 'group',
                                grouplabels: _.clone([seqNo])
                            });
                        }
                        else {
                            // 针对"日历"栏目下面的日历
                            master.set({
                                checklabels: [seqNo],
                                view_filter_flag: 'mylabel',
                                mychecklabels: _.clone([seqNo])
                            });
                        }

                        if (!master.isMainView()) {
                            master.trigger(master.EVENTS.NAVIGATE, {
                                path: "mainview/refresh"
                            });
                        }
                        break;
                    case "addcalendar":
                        _this.logger.debug('打开新建日历对话框');
                        master.capi.addBehavior("calendar_leftbaraddlabel_click");

                        var data = _this.master.get("labelData");
                        if (data && data.userLabels.length >= maxLabelsSum) {
                            Validate.show("最多创建" + maxLabelsSum + "个自定义日历", _this.createLabelsBtn);
                            setTimeout(function () {
                                Validate.hide();
                            }, 2000);
                            return;
                        }
                        // 异步加载
                        if (_.isUndefined(M2012.Calendar.View.CalendarAddPopup)) {
                            master.loadJsResAsync({
                                id: "labelpop",
                                url: "/calendar/cal_index_addLabel_async.html.pack.js",
                                useContact: true,
                                onload: function () {
                                    new M2012.Calendar.View.CalendarAddPopup({});
                                }
                            });

                        } else {
                            new M2012.Calendar.View.CalendarAddPopup({});
                        }

                        break;

                    case "labelmgr": //打开日历管理页
                        master.trigger(EVENTS.NAVIGATE, { path: "mod/labelmgr" });
                        e.stopPropagation(); //停止冒泡,否则就进入到日历广场了
                        break;
                    case "addgrouplabel":
                        menuitems.removeClass("on");
                        source.addClass("on");
                        master.set({ view_filter_flag: 'group' });
                        master.trigger(EVENTS.NAVIGATE, { path: "mod/grouplabel" });
                        e.stopPropagation();
                        break;
                    case "editlabel": //日历右侧的小编辑按钮
                        master.capi.addBehavior("cal_leftmenu_edit_label");
                        switch (type) {
                            case labelTypes.USER:
                                master.trigger(EVENTS.EDIT_LABEL, { labelId: seqNo });
                                break;
                            case labelTypes.GROUP:
                                var isOwner = Number(source.data('isowner') || '');
                                if (!!isOwner) {
                                    //如果是自己创建的群日历,则跳转到编辑
                                    master.trigger(EVENTS.EDIT_LABEL, { labelId: seqNo, isGroup: true });
                                    break;
                                }

                                //非自己创建的,暂时跳转到编辑日历页面
                                //master.trigger(EVENTS.EDIT_LABEL, { labelId: seqNo, isGroup: true });
                                //break;
                            case labelTypes.SHARE:
                                master.trigger(EVENTS.EDIT_LABEL, { labelId: seqNo, isShared: true });
                            case labelTypes.SYSTEM:
                            default:
                                break;
                        }
                        e.stopPropagation(); //阻止冒泡,否则就会变成点击日历分类了
                        break;
                }
                return false;
            });

            // 当发现广场固定在左侧栏底部时, 需绑定事件
            _this.bottomDiscovery.unbind("click").bind("click", function () {
                master.trigger(EVENTS.SHOW_DISCOVERY);
            });

            //视图中发生日历标签切换时，监听的函数
            master.bind(EVENTS.TOGGLELABEL, function (args) {
                args = args || {};
                $.extend(args, {
                    isSaveMenuStatus: true,
                    isOpenStatus: true
                })
                _this.togglelabel(args);
            });

            //发生标签添加的刷新左栏
            master.bind(EVENTS.LABEL_ADDED, function (args) {
                _this.label.add(args, _this);
            });

            //发生标签变更的刷新左栏
            master.bind(EVENTS.LABEL_CHANGE, function (args) {
                _this.label.mod(args, _this);
            });

            //发生标签删除的刷新左栏
            master.bind(EVENTS.LABEL_REMOVE, function (args) {
                _this.label.del(args, _this);
            });

            //进入发现广场
            master.bind(EVENTS.SHOW_DISCOVERY, function (args) {
                master.capi.addBehavior("calendar_leftbardiscovery_click");
                _this.logger.debug('载入日历广场');
                if (master.get("view_location").view === 'discovery') {
                    return; // 如果已经加载了日历广场界面, 直接返回, 不需要重复加载
                }

                $("#pnlLeftMenu a.js_menu_labels").removeClass("on");
                // 点击日历广场前, 先保存当前的视图,filterdefault中要用到
                //master.set('isMainViewBefore', !!master.get("view_location").isMainView);
                master.trigger(EVENTS.NAVIGATE, { path: "mod/discovery-0-0" });
            });

            // 去除所有颜色块的勾选按钮
            master.on("clearAll", function (fn) {
                var pnlLeftMenu = $("#pnlLeftMenu");
                pnlLeftMenu.find("i[data-cmd='filterlabel']").removeClass("ok");
                pnlLeftMenu.find("a.js_menu_labels").removeClass("on");

                _.isFunction(fn) && fn();
            });
        },

        /**
         * 勾/取消左栏标签
         * @param args
         * @returns {void}
         */
        togglelabel: function (args) {
            var _this = this;
            var master = _this.master;
            var seqNo = args.label;

            var labelInfo = master.getLabelBySeqNo(seqNo);
            if (!labelInfo) {
                _this.logger.info('seqNo notfound');
                return
            }

            //获取我的日历的勾选状态，再操作后，同步到checklabels
            var bak = master.get("mychecklabels");
            var checklabels = _.clone(bak);
            if (labelInfo.isSubscribe) {
                checklabels = _.clone(master.get("subscribedlabels") || []); // 已经选中的订阅日历ID
            } else if (labelInfo.isGroup) {
                checklabels = _.clone(master.get("grouplabels") || []); // 已经选中的群日历ID

            }

            var idx = _.indexOf(checklabels, seqNo);
            if (idx > -1) {
                //查到，就是走去勾的操作
                checklabels.splice(idx, 1);
            } else {
                //否则就是勾上某个日历
                checklabels.push(seqNo);
            }

            // mychecklabels: 因为选择订阅标签也是设置checklabels，则需要这个变量存放，我的日历的勾选状态
            if (labelInfo.isSubscribe) {
                master.set({
                    checklabels: checklabels,
                    view_filter_flag: 'subscribe',
                    mychecklabels: _.clone([]), // 将保存我的日历下面的日历ID集合清空
                    subscribedlabels: _.clone(checklabels),
                    grouplabels: _.clone([])
                });
            }
                //群日历
            else if (labelInfo.isGroup) {
                master.set({
                    checklabels: checklabels,
                    view_filter_flag: 'group',
                    mychecklabels: _.clone([]), // 将保存我的日历下面的日历ID集合清空
                    subscribedlabels: _.clone([]),
                    grouplabels: _.clone(checklabels) // 将保存我的日历下面的日历ID集合清空
                });
            } else {
                master.set({
                    checklabels: checklabels,
                    view_filter_flag: 'mylabel',
                    mychecklabels: _.clone(checklabels), // 将保存订阅日历下面的日历ID集合清空
                    subscribedlabels: _.clone([]),
                    grouplabels: _.clone([])
                });
            }

            _this.logger.debug("活动视图按标签筛选 %s", checklabels.join(','));
            if (args.success) { args.success(); }
        },

        //标签的CURD响应
        label: {
            add: function (args, _this) {
                //                添加日历时 args =>
                //                color: "#58a8b4"
                //                isShare: 1
                //                labelName: "12"
                //                labelShareInfo: Array[0]
                //                seqNo: "4770"

                _this.render(args);
            },
            mod: function (args, _this) {
                _this.render(args);
            },
            del: function (args, _this) {
                _this.render(args);
            }
        },

        /**
         * 导航菜单切换，包括: "我的日历" 和 "订阅日历"
         * @param ico 图标对象
         * @param lst 图标关联的列表对象
         */
        toggleMenu: function (ico, lst) {
            var _this = this;

            // 切换"向右"或"向左"的小箭头
            ico.hasClass(downIcon) ? ico.removeClass(downIcon).addClass(rightIcon) : ico.removeClass(rightIcon).addClass(downIcon);
            // "展开"或"伸缩"列表
            // 使用toggle,解决360浏览器下展开/收缩日历时出现"重影"的问题
            lst.toggle();

            setTimeout(function () {
                // 调用showScroll方法, 改变左侧栏的高度
                _this.master.trigger(CHG_HEIGHT);
            }, 0xff);
        },

        //导航菜单全部收起
        closeMenu: function () {
            var _this = this;
            var isVisible = _this.custom_visible;

            var icoCustom = _this.icoCustom;
            var lstCustom = _this.lstCustom;

            //群组显示中，切换菜单则是收起群组菜单，展开发现广场
            if (isVisible === 1) {
                icoCustom.removeClass(downIcon).addClass(rightIcon);
                lstCustom.slideUp();
            }

            _this.custom_visible = 0;

            setTimeout(function () {
                _this.master.trigger(CHG_HEIGHT);
            }, 0xff);
        },

        //导航菜单打开指定那个
        openMenu: function (type, callback) {
            var _this = this;
            var isVisible = _this.custom_visible;
            if (isVisible !== 0) {
                return;
            }

            _this.custom_visible = type == 'custom' ? -1 : 1;
            _this.toggleMenu(_this.icoCustom, _this.lstCustom);
            callback();
        },

        /**
         *  当菜单呈现完成后
         *   @param {Object} args.onrender  左侧菜单加载完成后的回调函数
         */
        onrender: function (args) {
            var _this = this;
            _this.icoCustom = _this.pnlMenu.find("#lable_switch_custom");
            _this.lstCustom = _this.pnlMenu.find("#lable_list_custom");
            _this.icoDiscovery = _this.pnlMenu.find("#lable_switch_share");
            _this.lstDiscovery = _this.pnlMenu.find("#lable_list_share");
            _this.createLabelsBtn = _this.pnlMenu.find("[data-cmd='addcalendar']"); // 快捷创建日历的"+"号
            _this.menulabels = _this.pnlMenu.find("#menu_labels");
            _this.btnEdit = _this.pnlMenu.find('i[name="edit"]');

            // 如果参数中配置有"saveStatus"为true,说明需要保持菜单的原始状态,会自动调用fixMenuStatus方法
            // 注意在_this.master.trigger(CHG_HEIGHT)之前调用,不然master中保存的状态会被覆盖掉
            args && args[constant.LeftMenu_Config.IS_SAVE_CALENDARMENU_STATUS] && _this.fixMenuStatus(_this.master.get(constant.LeftMenu_Config.IS_OPEN_STATUS));

            _this.master.trigger(CHG_HEIGHT);
            if (args && args.onrender) {
                args.onrender();
            }
        },

        /**
         * 是否需要维持持左侧栏日历菜单的展开/伸缩状态
         * 暂时在公共日历中点击"订阅"或"退订"按钮有这种需求,之前操作后,左侧日历菜单固定在展开状态
         * @param isOpenStatus master中保存的菜单状态:true为展开,false为伸缩
         * @returns {*}
         */
        fixMenuStatus: function (isOpenStatus) {
            var _this = this;
            if (!isOpenStatus) { // 只需要考虑master的菜单状态为"伸缩"的时候,因为render方法中菜单默认就是展开的
                _this.icoCustom.removeClass(downIcon).addClass(rightIcon);
                _this.lstCustom.hide();
            }
        },

        render: function (args) {
            var _this = this;
            var master = _this.master;
            var EVENTS = master.EVENTS;

            master.trigger(EVENTS.REQUIRE_API, {
                success: function (api) {
                    api.getLabels({
                        data: { comeFrom: 0, actionType: 0 },
                        success: function (result) {
                            if (result.code == "S_OK") {
                                var viewData = result['var'];
                                _this.master.set({ labelData: viewData });
                                _this.pnlMenu.html(_this.template(viewData));
                                //是群日历的话要选择群日历标签
                                if (master.get("view_filter_flag") === "group") {
                                    master.trigger("clearAll", function () {
                                        var groupEl = $("#lable_list_group");
                                        groupEl.parent().find("a[data-cmd='filterdefault']").addClass("on");
                                        groupEl.find("i[data-cmd='filterlabel']").each(function () {
                                            // 所有的日历处于勾选状态(全选)
                                            $(this).removeClass("ok").addClass("ok");                                          
                                        });                                    
                                    });                                
                                }
                                _this.onrender(args);
                            } else if (result.code == "FS_SESSION_ERROR") {
                                //会话过期
                                top.$App.trigger("change:sessionOut", {}, true);
                            } else {
                            }
                        },
                        error: function () { }
                    });
                }
            });

            return _this;
        }
    }));

    $(function () {
        new M2012.Calendar.View.LeftMenu({
            master: window.$Cal
        });
    });

})(jQuery, _, M139, window._top || window.top);


(function ($, _, M139, top) {

    var _super = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.SceneMenu";

    M139.namespace(_class, M139.View.ViewBase.extend({

        name: _class,

        el: "#pnlSceneMenu",

        logger: new M139.Logger({ name: _class }),

        defaults: [
            { cmd: 1, name: "会议邀请", ico: "meetIcon" }
            , { cmd: 2, name: "生日提醒", ico: "birthIcon" }
            , { cmd: 3, name: "按日提醒", ico: "dayIcon" }
            , { cmd: 4, name: "按周提醒", ico: "weekIcon" }
            , { cmd: 5, name: "按月提醒", ico: "monthIcon" }
            , { cmd: 6, name: "按年提醒", ico: "yearIcon" }
            , { cmd: 7, name: "倒计时", ico: "desIcon" }
        ],

        initialize: function (options) {
            var _this = this;

            _this.master = options.master;
            _this.btnCreate = _this.$el.find("#btnCreate");
            _this.btnExtend = _this.$el.find("#btnExtend");
            _this.pnlMenu = _this.$el.find("#pnlMenu");
            _this.template = _.template(_this.pnlMenu.find("script").html());

            _this.initEvents();
            _this.render();
            return _super.prototype.initialize.apply(_this, arguments);
        },

        hideMenu: function () {
            this.pnlMenu.hide();
        },

        initEvents: function () {
            var _this = this;
            _this.btnExtend.click(function (e) {
                //加一个标示，标示是点击打开了菜单
                _this.isMenuOpening = true;
                // 点击左侧栏创建按钮中的下拉图标,要记录行为日志
                _this.master.capi.addBehavior("calendar_addactbtndroplist_click");
                _this.pnlMenu.show();
               // e.stopPropagation();
            });

            $(document).click(function (e) {
                //当是打开菜单的点击时我们不处理
                if (!_this.isMenuOpening)
                    _this.pnlMenu.hide();
                _this.isMenuOpening = false;
            });

            _this.on("print", function () {
                _this.pnlMenu.html(_this.template(_this.defaults));

                _this.pnlMenu.find("a").click(function (e) {
                    var cmdValue = $(e.target).data("cmd");
                    var template = '',
                        TEMPLATES = M2012.Calendar.Constant.scheduleTempMap;
                    switch (cmdValue) {
                        case 1:
                            //会议邀请
                            var labelData = _this.master.get("labelData") || {};
                            var userlabels = [].concat(labelData["sysLabels"], labelData["userLabels"]);
                            _this.master.capi.addBehavior("calendar_addmeetingact_click");
                            if (_.isUndefined(M2012.Calendar.View.Meeting)) {
                                _this.master.loadJsResAsync({
                                    id: "labelpop",
                                    url: "/calendar/cal_index_addLabel_async.html.pack.js",
                                    useContact: true,
                                    onload: function () {
                                        new M2012.Calendar.View.Meeting({
                                            master: _this.master,
                                            labels: userlabels
                                        });
                                    }
                                });

                            } else {
                                new M2012.Calendar.View.Meeting({
                                    master: _this.master,
                                    labels: userlabels
                                });
                            }

                            break;
                        case 2:
                            //生日提醒
                            _this.master.capi.addBehavior("calendar_addbirthdayact_click");
                            new M2012.Calendar.Popup.View.Birthday({ master: _this.master });
                            break;
                        case 3:
                            //每日
                            _this.master.capi.addBehavior("calendar_adddayact_click");
                            new M2012.Calendar.View.Popup.FastSchedule({
                                master: window.$Cal,
                                scheduleTemp: TEMPLATES.dayTemp
                            });
                            break;
                        case 4:
                            //每周
                            _this.master.capi.addBehavior("calendar_addweekact_click");
                            new M2012.Calendar.View.Popup.FastSchedule({
                                master: window.$Cal,
                                scheduleTemp: TEMPLATES.weekTemp
                            });
                            break;
                        case 5:
                            //每月
                            _this.master.capi.addBehavior("calendar_addmonthact_click");
                            new M2012.Calendar.View.Popup.FastSchedule({
                                master: window.$Cal,
                                scheduleTemp: TEMPLATES.monthTemp
                            });
                            break;
                        case 6:
                            //每年
                            _this.master.capi.addBehavior("calendar_addyearact_click");
                            new M2012.Calendar.View.Popup.FastSchedule({
                                master: window.$Cal,
                                scheduleTemp: TEMPLATES.yearTemp
                            });
                            break;
                        case 7:
                            //倒计时
                            _this.master.capi.addBehavior("calendar_addcountdownact_click");
                            new M2012.Calendar.Popup.View.Countdown({ master: _this.master });
                            break;
                        default:
                            if (!!template) {
                                new M2012.Calendar.View.Popup.FastSchedule({
                                    master: _this.master,
                                    scheduleTemp: template
                                });
                            }
                            break;
                    }
                    _this.logger.debug('场景菜单点选：cmd=%s', cmdValue);
                });

                // 当鼠标移除下拉菜单区域时,弹窗应该关闭
                _this.pnlMenu.hover(function () {
                    // 鼠标进入事件
                }, function () {
                    _this.pnlMenu.hide();
                    // 鼠标移出事件
                });
            });
        }
    }));

    $(function () {
        new M2012.Calendar.View.SceneMenu({
            master: window.$Cal
        });
    });

})(jQuery, _, M139, window._top || window.top);

﻿/******************************* **************************************************************
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

﻿

/**
* @fileOverview 月的日历控件 Model 层
* 对外暴露 M2012.Calendar.MonthInfo
* @example
    //获取 2013 年 5月的数据
    var obj = new M2012.Calendar.MonthInfo(2013, 5);
    console.dir(obj);
*/
(function ($, _, M139, top) {

    var CalendarInfo = M2012.Calendar.CalendarInfo;

    var CalendarInfo = M2012.Calendar.CalendarInfo;
    var holidayInfo = M2012.Calendar.HolidayInfo.getInstance();


    function getLunarText(n) {
        n = parseInt(n);
        if (n < 1 || n > 30) {
            throw new Error('参数 n 取值为 1-30');
        }

        var a = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
        var mod = n % 10;

        return n <= 10 ? '初' + a[n] :  //1-10
            n <= 19 ? '十' + a[mod] :   //n: 11-19; mod: 1-9
            n == 20 ? '二十' :          //n: 20
            n <= 29 ? '廿' + a[mod] :   //n: 21-29; mod: 1-9
            '卅'                        //n: 30
    }

    function getMonthText(n) {
        var a = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
        return a[n] + '月';
    }

    function getLastDayNums(week) {
        return ['日', '一', '二', '三', '四', '五', '六'].join("").indexOf(week);
    }

    function getNextDayNums(week) {

        return 6 - getLastDayNums(week);
    }

    function getLastCalendarInfo(year, month, day, params, difDays) {

        if (month === -1) {
            month = 11;
            --year;
        }
        var calendarInfo = new CalendarInfo(year, month, day, params);
        var days = {}; newObj = null;
        for (var i = difDays; i > 0; i--) {
            newObj = calendarInfo[calendarInfo.length - i];
            days[getLastDayNums(newObj.week)] = newObj;
        }
        return days;

    }

    function getNextCalendarInfo(year, month, day, params, difDays) {
        if (month === 12) {
            month = 0;
            ++year;
        }
        var calendarInfo = new CalendarInfo(year, month, day, params);
        var days = {}; newObj = null;
        for (var i = 0 ; i < difDays; i++) {
            newObj = calendarInfo[i];
            days[getLastDayNums(newObj.week)] = calendarInfo[i];
        }
        return days;
    }
    function getMyCalendar(item) {

        return {
            year: item.sYear,   //公历的年份，4位数
            month: item.sMonth, //公历的月份，从 1 开始
            day: item.sDay,     //公历的日份，从 1 开始

            festival: (item.solarFestival || item.lunarFestival), //节日，如 "清明节"

            lunar: //农历信息
            {
                year: item.lYear,   //农历的年份
                month: item.lMonth, //农历的月份 1-12
                day: item.lDay,     //农历的日份 0-28,29,30
                text: getLunarText(item.lDay)     //农历的中文描述，如 "廿二"
            },

            date: M139.Date.format("yyyy-MM-dd", new Date(item.sYear, item.sMonth - 1, item.sDay)),
            lunarText: getLunarText(item.lDay),   //农历的中文描述，如 "廿二"



            weekday: new Date(item.sYear, item.sMonth - 1, item.sDay).getDay(), //周日到周六：0-6
            weekdayText: '周' + item.week,   //周几的中文描述

            //加班调休类型:-1:法定调班; 0:普通日期; 1:法定假日
            holidayType: holidayInfo.getHolidayType(item.sYear, item.sMonth, item.sDay),
            lunarMonth: getLunarMonth(item.lDay, item.lMonth)
        }
    }

    //如果是每月的第一天,则返回"二月"这样的字符串,否则返回undefined
    function getLunarMonth(day, month) {
        var result;
        if (day == 1) {
            result = getMonthText(month);
        }
        return result;
    }


    //以下周处理函数，暂时先迁移，以后再优化
    function padLeft(array, totalLength, paddingItem) {
        var delta = totalLength - array.length; //要填充的数目

        if (delta <= 0) {
            return array.slice(-delta); //-delta为正数
        }

        var a = [];
        for (var i = 0; i < delta; i++) {
            a.push(paddingItem);
        }

        a = a.concat(array);

        return a;
    }

    function padRight(array, totalLength, paddingItem) {
        var delta = totalLength - array.length;

        if (delta <= 0) {
            return array.slice(0, totalLength);
        }
        var a = array.slice(0); //克隆一份

        for (var i = 0; i < delta; i++) {
            a.push(paddingItem);
        }
        return a;
    }

    function group(array, size, isPadRight) {
        var groups = slide(array, size, size);

        if (isPadRight === true) {
            groups[groups.length - 1] = array.slice(-size); //右对齐最后一组
        }

        return groups;
    }

    function slide(array, windowSize, stepSize) {
        if (windowSize >= array.length) //只够创建一组
        {
            return [array];
        }

        stepSize = stepSize || 1;

        var groups = [];

        for (var i = 0, len = array.length; i < len; i = i + stepSize) {
            var end = i + windowSize;

            groups.push(array.slice(i, end));

            if (end >= len) {
                break; //已达到最后一组
            }
        }

        return groups;
    }




    M139.namespace("M2012.Calendar.MonthInfo", function (year, month, day, params) {
        if (typeof year == 'string') //处理 MonthInfo('2013-05-11', params) 这种情况
        {
            var date = year;
            var dt = $Date.parse(date);
            params = month;             //附加参数
            day = dt.getDate();         //日
            month = dt.getMonth() + 1;  //月
            year = dt.getFullYear();    //年
        }
        else if (year instanceof Date) //处理 MonthInfo( new Date(), params) 这种
        {
            var dt = year;
            params = month;             //附加参数
            day = dt.getDate();         //日
            month = dt.getMonth() + 1;  //月
            year = dt.getFullYear();    //年
        }



        var obj = new CalendarInfo(year, month - 1, day, params); //这里的月份偏差-1

        //上个月取几天
        var lastDays = getLastDayNums(obj[0]['week']);
        var nextDays = getNextDayNums(obj[obj.length - 1]['week']);



        var objLast = getLastCalendarInfo(year, month - 1 - 1, day, params, lastDays); //这里的月份偏差-2
        var objNext = getNextCalendarInfo(year, month, day, params, nextDays); //这里的月份偏差0

        //月视图中,第一天和最后一天的字符串记录,比如2014-06-29和2014-08-02
        var firstMonthViewDay, lastMonthViewDay;
        //end

        var exports =
        {
            length: obj.length,
            year: year,
            month: month,
            extend: function (obj) {
                for (var key in obj) {
                    exports[key] = obj[key];
                }
            }
        };

        exports.extend(
        {
            //增加一个迭代方法
            each: function (fn) {
                fn = fn || function () { };

                var len = exports.length;
                for (var i = 0; i < len; i++) {
                    fn(exports[i], i);
                }
            },

            //增加一个map方法
            map: function (fn) {
                fn = fn || function () { };
                var a = [];
                var len = exports.length;
                for (var i = 0; i < len; i++) {
                    var value = fn(exports[i], i);
                    if (value === null) {
                        continue;
                    }

                    a.push(value);
                }

                return a;
            }
        });





        var todayString = M139.Date.format('yyyy-MM-dd', new Date());

        for (var i = 0; i < obj.length; i++) {
            var item = obj[i];

            exports[i] = getMyCalendar(item);


            $.extend(exports[i],
            {
                isToday: exports[i].date == todayString

            });


        }




        //添加些字段
        exports.extend(
        {
            firstWeekday: exports[0].weekday,                  //本月的第一天的星期几
            lastWeekday: exports[exports.length - 1].weekday,  //本月的最后一天的星期几
            firstDate: exports[0].date,
            lastDate: exports[exports.length - 1].date,

            //收集节日到一个专门的数组
            festivals: exports.map(function (item, index) {
                return item.festival ? item : null;
            })
        });

        //按周
        var weeks = (function () {
            var total0 = exports.firstWeekday + exports.length; //补上第一周开始所没有的那几天的总天数
            var total1 = total0 + 6 - exports.lastWeekday;      //补上最后一周末尾所没有的那几天的总天数

            var value = Array.prototype.slice.call(exports, 0); //解析成数组
            value = padLeft(value, total0, null); //第一周开始所没有的那几天，填 null
            value = padRight(value, total1, null);//最后一周末尾所没有的那几天，填 null

            return group(value, 7).valueOf();  //按 7天/组 进行分组         
        })();
        $.each(weeks, function (index, week) {
            var isFirstWeek = (index == 0);                 //当前周是否为第一周
            var isLastWeek = (index == weeks.length - 1);   //当前周是否为最后一周
            $.each(week, function (i, day) {


                if (!day) //排除那些填充进来的 否当前月 这里进行相关处理没有的
                {
                    if (index === 0) {
                        var firstObj = getMyCalendar(objLast[i]);
                        if (i <= lastDays) {
                            week[i] = $.extend(//i是代表星期
                                 {
                                     schedules: {},
                                     isFirstWeek: false,
                                     isLast: true
                                 }, firstObj);
                            //getMyCalendar(objLast[i]));
                        }

                        if (i === 0) { //第一天
                            firstMonthViewDay = firstObj.date;
                        }

                    } else if (index === weeks.length - 1) {
                        var lastObj = getMyCalendar(objNext[i]);
                        week[i] = $.extend(
                                 {
                                     schedules: {},
                                     isFirstWeek: false,
                                     isNext: true
                                 }, lastObj);
                        //getMyCalendar(objNext[i]));

                        lastMonthViewDay = lastObj.date;
                    }
                } else {

                    day.isFirstWeek = isFirstWeek;
                    day.isLastWeek = isLastWeek;

                    //第一天和最后一天为空的容错, 这2个判断,仔细想想就明白了
                    if (!firstMonthViewDay) {
                        firstMonthViewDay = day.date;
                    }

                    if (!lastMonthViewDay) {
                        if (isLastWeek && (i == week.length - 1)) { //最后一周的最后一天
                            lastMonthViewDay = day.date;
                        }
                    }
                    //end
                }
            });

        });

        //添加字段，下面的不要跟上面的合并，因为下面的用到上面的字段，而 for in 中不一定按我们写的顺序的
        exports.extend(
        {
            //按周进行分组，得到一个二维数组
            weeks: weeks,

            firstMonthViewDay: firstMonthViewDay,
            lastMonthViewDay: lastMonthViewDay
        });



        //增加一个以日期作为键的索引记录
        exports.each(function (item, index) {
            exports[item.date] = item;         //公历
            exports[item.lunarText] = item;    //农历
        });

        return exports;
    });


})(jQuery, _, M139, window._top || window.top);






﻿; (function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.Popup.Direction";

    var master = window.$Cal;

    /*
      弹出框
      1、识别方向
      2、鼠标点击元素处定位
    */
    M139.namespace(_class, superClass.extend({

        name: _class,

        el: "body",

        defaults: {

            //目标元素 $(dom)
            srcElement: null,

            //目标元素位置和尺寸
            srcRect: null,

            //弹窗事件参数
            eventArgs: null,

            //弹出框对象
            popElement: null,

            //回调函数
            callback: null
        },

        /** 弹出框基类
         * @param {Object}   args.target   // 目标对象 与下面的 args.event至少有一个存在 (可选)
         * @param {Object}   args.event    // 事件源，如果该对象不为空，那么定位优先以鼠标定位 (可选)
         * @param {Object}   args.rect     // 目标对象的方位坐标，便于精确定位弹出层位置 (可选)
         * @param {Function} args.callback // 窗口向主页面传递信息的回调函数 (可选)
         */
        initialize: function (args) {

            args = args || {};

            var self = this;

            self.eventArgs = args.event || null;
            self.srcElement = args.target;
            self.srcRect = args.rect || null;

            //目标元素
            if (!self.srcElement) {
                self.srcElement = self.eventArgs ? self.eventArgs.target : null;
            }
            if (!self.srcElement)
                self.srcElement = $(document.body);

            //回调函数
            self.callback = function (options) {
                args.callback && args.callback(options);
            }

            var bclose = self._initEvents();
            if (bclose) {
                self.render();
            }
        },

        _initEvents: function () {

            var views = M2012.Calendar.View.Popup.Direction.viewsStack || [];
            var bclose = true;

            //检测同类型的弹出框是否可以关闭
            //只有其他框都能关闭才能展示新的窗口
            for (var i = 0; i < views.length; i++) {

                var view = views[i];

                //是否可以关闭当前窗口
                bclose = view.onClose();
                if (!bclose)
                    break;

                //当确认关闭后才关闭该视图
                views.splice(i, 1);
                i--;
                view.popElement.remove();
            }
            return bclose;
        },
        /*
         需要子类去实现的方法
         --begin------------
        */

        /** 
         * 设置弹出层内容区域内容
         * @param {Object}   el   //容器元素JQuery对象    
        **/
        setContent: function (el) {

            throw 'This method is not implemented: "setContent"';
        },

        /** 
        * 设置弹出层链接区域内容
        * @param {Object}   el   //容器元素JQuery对象    
       **/
        setLink: function (el) {

            //   throw 'This method is not implemented: "setLink"';
        },

        setShare: function (el) {
            //活动分享
        },

        /** 
         * 设置弹出层操作按钮区域内容
         * @param {Object}   el   //容器元素JQuery对象    
        **/
        setOptions: function (el) {

            throw 'This method is not implemented: "setOptions"';
        },

        //当框关闭时触发事件
        onClose: function () {
            return true;
        },
        /*
         需要子类去实现的方法
         --end------------
        */

        show: function () {

            var self = this;
            if (self.popElement) {
                self.popElement.show();
                self.setPosition();
            }
        },

        /**
         *  隐藏当前弹出层
         *  @param {Object} args.silent  //是否触发关闭窗口时的检测，为true标示不检测（可选）
         *  @param {Object} args.ignore  //是否忽略弹出层之上的层，为true标示不关注该窗口上的其他弹出层（可选）
         */
        hide: function (args) {
            args = args || {};

            var self = this;

            var shouldClose = true;

            if (!args.silent)
                shouldClose = self.onClose();

            if (!_.isBoolean(args.ignore))
                args.ignore = false;

            if (shouldClose) {
                //关闭缓存的该视图对象
                var views = M2012.Calendar.View.Popup.Direction.viewsStack;

                for (var i = 0; i < views.length; i++) {
                    if (views[i] == self) {

                        views.splice(i, 1);
                        i--;
                    }
                }

                //点击一下页面，用以隐藏弹出框中的下拉列表弹出层
                if (!args.ignore) {
                    $(document.body).click();
                }

                //如果存在定时器则应相应关闭
                if (self.intervalId) {
                    window.clearInterval(self.intervalId);
                }

                self.popElement.remove();
            }

            // 清除定时器
            M2012.Calendar.CommonAPI.clearTimeout();
            return shouldClose;
        },

        /*
         * 显示关闭按钮
        */
        showCloseBtn: function () {
            var self = this;
            self.popElement.find("a.i_u_close").show();
        },

        /*
         * 设置弹出框位置
        */
        setPosition: function () {
            var self = this;
            var useMousePos = false;

            var popRect = {
                height: self.popElement.height(),
                width: self.popElement.width()
            };

            //获取目标元素的坐标及尺寸
            var srcRect = $.extend({
                height: self.srcElement.height(),
                width: self.srcElement.width()
            }, self.srcElement.offset());

            //如果通过元素获取的位置为0，则看看参数有没有传递过来明确的坐标值
            if (self.srcRect) {
                $.extend(srcRect, self.srcRect);
            }

            //如果能获取到鼠标事件信息
            //则取当前鼠标点击处坐标
            if (self.eventArgs) {
                $.extend(srcRect, {
                    top: self.eventArgs.clientY,
                    left: self.eventArgs.clientX,
                    width: 0,
                    height: 0
                });
                useMousePos = true;
            }

            var docRect = {
                height: document.body.clientHeight,
                width: document.body.clientWidth
            };

            //计算弹出框离底部和顶部的高度
            //距离底部高度
            var dbh = docRect.height - (srcRect.top + srcRect.height + popRect.height);
            //距离顶部高度
            var dth = srcRect.top - popRect.height;
            //获取弹出框方向
            var tbflag = (dbh < 0 && dth > 0) ? 2 : 1;

            //计算弹出框离左边和右边的距离
            //离左边的宽度
            var dlw = srcRect.left + srcRect.width - popRect.width;
            //距离右边的宽度
            var drw = docRect.width - (srcRect.left + popRect.width);
            var lrflag = (dlw > 0 && drw < 0) ? 8 : 4;

            var position = null;
            var offsetX = 0;
            var offsetY = 0;
            switch (tbflag | lrflag) {
                case 5: //箭头上方向靠右边
                    position = {
                        className: "",
                        top: srcRect.top + srcRect.height,
                        left: srcRect.left
                    };
                    offsetX = -18;
                    offsetY = 8;
                    break;
                case 6: //箭头下方向靠右边
                    position = {
                        className: "form-addtag-new-lb",
                        top: srcRect.top - popRect.height,
                        left: srcRect.left
                    };
                    offsetX = -18;
                    offsetY = -8;
                    break;
                case 9: //箭头上方向靠左边
                    position = {
                        className: "form-addtag-new-rt",
                        top: srcRect.top + srcRect.height,
                        left: srcRect.left + (useMousePos ? srcRect.width : 34) - popRect.width//当不以鼠标作为参照物时改成30像素是为了使弹出框不能太靠左，箭头刚好指向日期
                    };
                    offsetX = 18;
                    offsetY = 8;
                    break;
                case 10: //箭头下方向靠左边
                    position = {
                        className: "form-addtag-new-rb",
                        top: srcRect.top - popRect.height,
                        left: srcRect.left + (useMousePos ? srcRect.width : 34) - popRect.width
                    };
                    offsetX = 18;
                    offsetY = -8;
                    break;
            }

            if (position.className) {
                self.popElement.addClass(position.className);
            }
            if (!useMousePos) {
                offsetX = 0;
                offsetY = 0;
            }

            self.popElement.css({
                left: position.left + offsetX + 'px',
                top: position.top + offsetY + 'px'
            });
        },

        /**
         *  实时调整弹出框的位置
         */
        adjustPosition: function () {
            var self = this;
            //获取目标元素的位置信息
            var offset = self.srcElement.offset();
            var offsetCurrent = null;
            var y = 0;
            var x = 0;

            var bodyEl = $(document.body);

            self.intervalId = window.setInterval(function () {
                //如果参考元素被删除或隐藏了，则需要同时移除当前弹出框
                //但如果同时整个页面被隐藏了，说明切换到别的模块了，此时不能移除弹出框
                if (!self.srcElement || self.srcElement.length == 0 ||
                   (self.srcElement.is(":hidden") && bodyEl.is(":visible"))) {
                    self.hide({ silent: true, ignore: true });
                    return;
                }

                //元素隐藏时无需求计算高度
                if (self.srcElement.is(":hidden"))
                    return;

                offsetCurrent = self.srcElement.offset();
                y = offsetCurrent.top - offset.top;
                x = offsetCurrent.left - offset.left;

                if (y != 0 || x != 0) {
                    var offsetEl = self.popElement.offset();
                    self.popElement.css({
                        left: (offsetEl.left + x) + 'px',
                        top: (offsetEl.top + y) + 'px'
                    });
                    offset = offsetCurrent;
                }
            }, 500);
        },

        render: function () {

            var self = this;
            var cid = self.cid;

            var html = $T.format(self.TEMPLATE, { cid: self.cid });
            self.popElement = $(html).appendTo(self.el).click(function (e) {
                if (self.stopEvent) {
                    M139.Event.stopEvent(e);
                }
            });
            //设置关闭按钮点击功能
            self.popElement.find("a.i_u_close").click(function (e) {
                self.hide({ silent: true });
            });

            //设置弹出框正文内容
            self.setContent(self.getElement("text_area"));

            //分享按钮,所有浮层都有,即使没有的,也可以在下面setLink中hide掉
            self.setShare(self.getElement("link_text"));

            //设置弹出框链接区域
            self.setLink(self.getElement("link_text"));

            //设置弹出框操作按钮
            self.setOptions(self.getElement("opt_button"));

            //定位弹出框位置
            self.setPosition();

            //实时调整弹出框位置
            self.adjustPosition();
            //存储该视图
            M2012.Calendar.View.Popup.Direction.viewsStack.push(self);

        },

        getElement: function (id) {
            var self = this;
            id = $T.format("#{cid}_{id}", {
                cid: self.cid,
                id: id
            });
            return $(id);
        },

        /**
         * 显示操作按钮的遮罩层
         */
        showMask: function () {
            this.getElement("mask").removeClass("hide");
        },

        /**
         * 隐藏操作按钮的遮罩层
         */
        hideMask: function () {
            this.getElement("mask").addClass("hide");
        },

        TEMPLATE:
            ['<div class="tips tips-shcdule form-addtag-tips form-addtag-new"  name="pop_cal_direction" style="top:100px;left:100px;" >',
                '<div class="tips-text">',
                    '<a href="javascript:void(0)" class="i_u_close" title="关闭" style="display:none;"></a>',
                    '<div id="{cid}_text_area" class="tips-text-div">',
                    '</div>',
                    '<div class="boxIframeBtn" style="position:relative;overflow:hidden;">',
                        '<div id="{cid}_mask" style="position:absolute; top:0px; height:40px; z-index:1000;" class="blackbanner hide"></div>',
                        '<span id="{cid}_link_text" class="bibText">',
                        '</span>',
                        '<span id="{cid}_opt_button" class="bibBtn">',
                        '</span>',
                    '</div>',
                '</div>',
                '<div class="tipsTop diamond"></div>',
            '</div>'].join("")
    }, {

        //弹出框视图栈
        viewsStack: [],

        /*
         尝试关闭所弹出框
         返回true时标示可以关闭当前界面上所有弹出框
        */
        tryClose: function () {
            var views = M2012.Calendar.View.Popup.Direction.viewsStack;
            if (views.length == 0)
                return true;

            for (var i = 0; i < views.length; i++) {
                if (!views[i].onClose())
                    return false;
            }

            return true;
        }
    }));

    $(function () {

        window.setTimeout(function () {
            var master = window.$Cal;
            master.on(master.EVENTS.HIDE_ACTIVITY_POPS, function (args) {
                var views = M2012.Calendar.View.Popup.Direction.viewsStack;
                var silent = true;
                if (args && _.isBoolean(args.silent))
                    silent = args.silent;

                while (views.length > 0) {
                    if (!views[0].hide({ silent: silent }))
                        break;
                }
            });
        }, 10);

    });



})(jQuery, _, M139, window._top || window.top);
﻿; (function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var _class = 'M2012.Calendar.View.CalenderChoose';
    var CommonAPI =  M2012.Calendar.CommonAPI;

    M139.namespace(_class, function (params) {

        var y = params.year, m = params.month, d = params.day;
        this.enableHistday = params.enableHistday ? params.enableHistday : true; //历史天是否可以选择
        this.elInput = $("#" + params.id);



        this.callback = params.callback || function () { };

        this.yearListCount = 10; //年份列表的列表个数
        this.date2StringPattern = params.date2StringPattern || "yyyy年MM月dd";
        this.returnType = params.returnType || 0; //显示类型：0为公历（2010-03-03）,1为农历（农历三月初三）
        this.dateNLStringPattern = { Y: 1, M: 1, D: 1 }; //农历日期的格式化字符串
        this.patternDelimiter = "-";
        this.showSelectDayColor = true;
        this.objCalendarApi = new  CommonAPI();
        //初始化事件
        this.render();
        this.bindEvent();


    });

    M2012.Calendar.View.CalenderChoose.prototype = {
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
            return CommonAPI.Utils.$Date.toDate(val);
        },
        //事件绑定
        bindEvent: function () {
            var _self = this;
            this.elInput.bind('click', function (e) {
                _self.date = _self.getRealDate(_self.elInput);
                _self.draw(_self.date.getMonth());
                _self.show(_self.elInput);
                M139.Event.stopEvent(e);
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
                _cs[_cs.length] = curCalendar.objCalendarApi.nStr1[i];
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
            document.getElementById("divCalendarForm").onclick = function (e) {
                try {
                    curCalendar.hideYearsTable();
                    curCalendar.hideMonthsTable();
                } catch (e) {
                }
                M139.Event.stopEvent(e);
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
            doc.getElementById('spanCurYear').onclick = function (e) {
                curCalendar.showYearsTable(this);
                M139.Event.stopEvent(e);
            };
            doc.getElementById('spanCurMonth').onclick = function (e) {
                curCalendar.showMonthsTable(this);
                M139.Event.stopEvent(e);
            };
            doc.getElementById('goPrevYear').onclick = function () {
                curCalendar.goPrevYear(this);
            };
            doc.getElementById('goNextYear').onclick = function () {
                curCalendar.goNextYear(this);
            };
            doc.getElementById('goPrevMonth').onclick = function () {
                curCalendar.goPrevMonth(this);
            };
            doc.getElementById('goNextMonth').onclick = function () {
                curCalendar.goNextMonth(this);
            };
            doc.getElementById('yearSelect').onchange = function () {
                curCalendar.update(this);
            };
            doc.getElementById('monthSelect').onchange = function () {
                curCalendar.update(this);
            };
            document.getElementById("__calendarPanel").onclick = function (e) {
                curCalendar.hideYearsTable(this);
                curCalendar.hideMonthsTable(this);
                M139.Event.stopEvent(e);
            };
            doc.getElementById('selectTodayButton').onclick = function () {
                curCalendar.goToday(this);
            };
            $("#__calendarPanel").hover(function() {
                // 鼠标移入处理,handler
            },function() {
               // 鼠标移出时关闭弹窗
               curCalendar.hide();
            });
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
            M139.Event.stopEvent();
        },
        goNextYearPage: function () {
            this.showFlag = true;
            if (this.startYearList >= this.endYear - this.yearListCount) return false;
            this.startYearList += this.yearListCount;
            this.year = this.startYearList;
            this.date = new Date(this.year, this.month, 1);
            this.changeSelect();
            M139.Event.stopEvent();
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
                    this.date = new Date(CommonAPI.Utils.$Date.toDate(realDate,
                            this.patternDelimiter, this.string2DatePattern));
                else
                    this.date = new Date(CommonAPI.Utils.$Date.toDate(dateControl.val(),
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

            var oCal = new M2012.Calendar.CalendarInfo(this.date.getFullYear(), this.date.getMonth(),
                    this.date.getDate(), this.callback, this.params);

            this.iframe.document.getElementById('spanNL').innerHTML = oCal.CY
                    + "年[ "
                    + String(calendar.objCalendarApi.Animals[(this.date.getFullYear() - 4) % 12])
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
                    var trDate = CommonAPI.Utils.$Date.toDate(tds[i].id, "-");

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
                                                    + ((calendar.objCalendarApi.nStr1[oCal[dateArray[i]
                                                            - 1].lMonth] + "月") == "一月"
                                                            ? "正月"
                                                            : (calendar.objCalendarApi.nStr1[oCal[dateArray[i]
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
                                    var nlMonth = calendar.objCalendarApi.nStr1[oCal[dateArray[i]
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
                                calendar.callback(calendar.date, calendar.objCalendarApi.createDateObj(calendar.date)); //调用回调方法
                            }
                        }
                    } else {
                        tds[i].className = "histdayStyle";
                    }
                    var dateStr =
                        $Date.format("yyyy-MM-dd", new Date(calendar.date.getFullYear(),
                            calendar.date.getMonth(), tds[i].day));

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
﻿(function ($, _, M139, top) {

    var superClass = M139.Model.ModelBase;
    var className = "M2012.Calendar.Model.TopNaviBar";

    M139.namespace(className, superClass.extend({

        name: className,

        master: null,

        defaults: {

            // 视图类型
            // 0:月视图 1:日视图 2：列表
            type: 0
        },

        initialize: function (args) {

            var self = this;

            args = args || {};
            self.master = args.master;
            var now = self.master.capi.getCurrentServerTime();

            //视图类型
            //1: 月视图 2:日视图 3:列表视图
            if (args.type) {
                self.set({ type: args.type });
            }
        },

        /**
         * 设置日历全局时间
        */
        setDate: function (date, options) {
            var self = this;
            self.master.set({
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
                navi: options  //是否通过日期选择器选择触发,目前用在列表中
            });

            self.master.trigger("change:navi"); //多次点击同一功能时,不会触发change事件
        },

        /**
         * 获取未读消息数
         */
        getMsgCount: function () {
            var self = this;
            var EVENTS = self.master.EVENTS;

            self.master.trigger(EVENTS.REQUIRE_API, {
                success: function (api) {
                    api.getMessageCount({
                        data: { comeFrom: 0, type: 0 },
                        success: function (result) {
                            if (result.code === "S_OK") {
                                var data = result['var'];
                                var count = data && data.count > 0 ? data.count : 0;
                                self.master.trigger(EVENTS.MSG_RECEVIE, {
                                    count: count
                                });
                            }
                        }
                    });
                }
            });
        }
    }));

}(jQuery, _, M139, window._top || window.top));

; (function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.TopNaviBar";

    M139.namespace(_class, superClass.extend({

        name: _class,

        el: "#dvdayChoose",

        logger: new M139.Logger({ name: _class }),

        model: null,

        master: null,
        //当前模块
        module: null,

        initialize: function (args) {
            var self = this;

            self.master = args.master;

            //绑定视图模型
            self.model = new M2012.Calendar.Model.TopNaviBar({
                master: self.master
            });

            self.render();

            //先呈现默认工具栏
            var type = self.model.get("type").toString();
            self.module = self.getModule(type);
            self.module.render.call(self);

            self.initEvents();

            return superClass.prototype.initialize.apply(self, arguments);
        },

        initEvents: function () {
            var self = this;
            var master = self.master;
            var EVENTS = master.EVENTS;

            self.panel = $("#pnlNaviBar");
            self.panel.find("a[nav]").click(function () {
                var nav = $(this).attr("nav");

                var key = "";
                if (nav.indexOf("/day") > -1) {
                    key = "calendar_dayviewitem_click";

                } else if (nav.indexOf("/month") > -1) {
                    key = "calendar_monthviewitem_click";

                } else if (nav.indexOf("/list") > -1) {
                    key = "calendar_listviewitem_click";

                } else if (nav.indexOf("/message") > -1) {
                    key = "calendar_messagebox_click";
                }

                if (key.length > 0) {
                    master.capi.addBehavior(key);
                }

                master.trigger(master.EVENTS.NAVIGATE, {
                    path: nav
                });
            });

            self.on("print", function () {
                //self.logger.debug("printing..."); //启动
            });

            var constant = self.master.CONST;

            //视图类型发送变化时重新渲染UI
            self.model.on("change:type", function (args) {
                var type = self.model.get("type").toString();
                self.module = self.getModule(type);
                self.module.render.call(self);
            });

            self.master.on("change:year change:month change:day", function () {
                var monthChanged = false;
                var dayChanged = false;

                //判断月份有没有改变
                if (self.master.hasChanged("year") || self.master.hasChanged("month")) {
                    monthChanged = true;
                    dayChanged = true;
                }
                    //判断天是否发生变化
                else if (self.master.hasChanged("day")) {
                    dayChanged = true;
                }
                if (self.outimer) {
                    window.clearTimeout(self.outimer);
                }
                self.outimer = window.setTimeout(function () {

                    if (monthChanged) {
                        monthChanged = false;
                    }
                    if (dayChanged) {
                        dayChanged = false;
                    }

                    //隐藏所有的活动弹出层
                    //   self.master.trigger(EVENTS.HIDE_ACTIVITY_POPS);
                    //重新呈现日期描述信息
                    self.module.render.call(self);
                });

            });

            //日历前翻
            self.getElement("prev").click(function () {
                self.master.capi.addBehavior("calendar_chooseprevdate_click");
                //隐藏所有的活动弹出层
                self.master.trigger(self.master.EVENTS.HIDE_ACTIVITY_POPS);
                self.module.prev.call(self);
            });

            //日历后翻
            self.getElement("next").click(function () {
                self.master.capi.addBehavior("calendar_choosenextdate_click");
                //隐藏所有的活动弹出层
                self.master.trigger(self.master.EVENTS.HIDE_ACTIVITY_POPS);
                self.module.next.call(self);
            });

            //当月、今天
            self.getElement("date_current").click(function () {
                self.master.capi.addBehavior("calendar_choosetoday_click");
                //隐藏所有的活动弹出层
                self.master.trigger(self.master.EVENTS.HIDE_ACTIVITY_POPS);
                self.module.current.call(self);
            });

            //主视图切换处理函数
            self.master.on('mainview:change', function (args) {
                self.panel.find("#ulViewItems li").removeClass('focus')
                    .filter(".js_item_" + args.view).addClass('focus');

                var type = {
                    month: 0,
                    day: 1,
                    list: 2,
                    timeline: 2
                }[args.view];

                if (_.isNumber(type)) {
                    self.model.set({ type: type });
                }
            });

            //监听视图显示事件以刷新消息条数
            self.master.on(self.master.EVENTS.VIEW_SHOW, function (args) {
                if (args.name == "main") {
                    //此处标示人为处理过消息，需要重新获取消息状态
                    if (self.master.get("msg_changed_flag") === true) {
                        //刷新消息
                        self.model.getMsgCount();
                        self.master.set({
                            msg_changed_flag: false
                        }, { silent: true });
                    }
                }
            });

            //显示消息提醒
            self.master.on(EVENTS.MSG_RECEVIE, function (args) {
                var count = args.count;
                var msgEl = $("#newmsgcount");
                var iconEl = $("#newmsgicon");
                if (count > 0) {
                    if (count > 99)
                        count = "99+";

                    msgEl.text(count).show();
                    iconEl.removeClass("i-setupB").addClass("i-setupB2");
                } else {
                    msgEl.hide();
                    iconEl.removeClass("i-setupB2").addClass("i-setupB");
                }
            });

            //查询未读消息数
            self.model.getMsgCount();

            if (!window.ISOPEN_CAIYUN) {
                var allTypes = { EVENT: 0, LABEL: 1 }; //活动类型是0，日历类型是1
                top.$App.on("calendar:refresh", function (data) {
                    data = data || {};
                    if (data.type == allTypes.LABEL && (data.whitelist || data.accept)) {
                        //需要刷新左侧日历列表
                    }
                    //刷新活动列表
                    //刷新消息
                    self.model.getMsgCount();
                });
            }
        },

        //初始化管理菜单
        initMgrPop: function () {
            var self = this;
            var hasOptionMenu = false;
            var optionEl = $("#menuOption");
            //#region 菜单项,抽出取出来,方便通过配置控制显示的项目
            var master = self.master,
                EVENTS = master.EVENTS,
                menuItems = [];


            //日历管理
            menuItems.push(
                {
                    text: "日历管理",
                    onClick: function () {
                        master.capi.addBehavior("calendar_managelabel_click");
                        master.trigger(EVENTS.NAVIGATE, { path: "mod/labelmgr" });
                    }
                });

            //日历黑白名单管理
            menuItems.push(
                {
                    text: "日历黑白名单管理",
                    onClick: function () {
                        master.capi.addBehavior("calendar_blackwhite_click");
                        master.trigger(EVENTS.WHITELIST_POPUP);
                    }
                });
            //#endregion

            optionEl.click(function () {
                if (hasOptionMenu) {
                    self.menuOption.show();
                    return;
                }

                var position = optionEl.offset();

                self.menuOption = new M2012.Calendar.View.CalendarPopMenu().create({
                    top: position.top + 28,
                    left: position.left + 30,
                    items: menuItems
                });
            });
        },

        render: function () {
            var self = this;

            self.initMgrPop();

            var html = $T.format(self.template, { cid: self.cid });
            $(html).appendTo(self.$el);

        },

        /**
         * 获取页面元素
         * id为{cid}_name 格式的
         */
        getElement: function (id) {
            var self = this;
            id = $T.format("#{cid}_{id}", {
                cid: self.cid,
                id: id
            });
            return $(id);
        },

        /**
         * 获取模块信息
         */
        getModule: function (view) {
            var self = this;
            var type = self.model.get("type");

            type = type.toString();
            return self.Modules[type];
        },

        Modules: {
            //月
            "0": {
                // 呈现月信息
                render: function () {
                    var self = this;
                    var date = new Date(
                      self.master.get("year"),
                      self.master.get("month") - 1,
                      self.master.get("day"));
                    var text = $Date.format("yyyy年MM月", date);

                    self.getElement("choose_day").hide();
                    self.getElement("choose_month")
                        .text(text)
                        .attr("realdate", $Date.format("yyyy-MM-dd", date))
                        .show();

                    self.getElement("date_current").text("今日");
                    //初始化日期选择控件
                    self.module.setCalendar.call(self);
                },

                //上一日期
                prev: function () {
                    var self = this;
                    var now = self.master.capi.getCurrentServerTime();
                    var date = new Date(
                        self.master.get("year"),
                        self.master.get("month") - 2, 1);
                    //如果是当月则日期取当天
                    if (now.getFullYear() == date.getFullYear() && now.getMonth() == date.getMonth()) {
                        date.setDate(now.getDate());
                    }
                    self.model.setDate(date);
                },

                //下一日期
                next: function () {
                    var self = this;
                    var now = self.master.capi.getCurrentServerTime();
                    var date = new Date(self.master.get("year"), self.master.get("month"), 1);
                    //如果是当月则日期取当天
                    if (now.getFullYear() == date.getFullYear() && now.getMonth() == date.getMonth()) {
                        date.setDate(now.getDate());
                    }
                    self.model.setDate(date);
                },

                //当月
                current: function () {
                    var self = this;
                    var now = self.master.capi.getCurrentServerTime();
                    self.model.setDate(now);
                },

                //设置日历选择器
                setCalendar: function () {
                    var self = this;

                    if (!self.monthCalendarComp) {
                        var date = new Date(
                            self.master.get("year"),
                            self.master.get("month") - 1,
                            self.master.get("day"));

                        self.monthCalendarComp = new M2012.Calendar.View.CalenderChoose({
                            date2StringPattern: 'yyyy年MM月',
                            id: self.cid + '_choose_month',
                            year: date.getFullYear(),
                            month: date.getMonth(),
                            day: date.getDate(),
                            callback: function () {
                                self.master.capi.addBehavior("calendar_choosedate_click");
                                self.model.setDate(arguments[0]);
                            }
                        });
                    }
                }

            },

            "1": {

                //呈现日信息
                render: function () {

                    var self = this;
                    self.Modules[2].render.call(self);
                },

                //上一日期
                prev: function () {
                    var self = this;
                    self.Modules[2].prev.call(self, 1);
                },

                //下一日期
                next: function () {
                    var self = this;
                    self.Modules[2].next.call(self, 1);
                },

                //当天
                current: function () {
                    var self = this;
                    self.Modules[2].current.call(self);
                },

                setCalendar: function () {

                    var self = this;
                    self.Modules[2].setCalendar.call(self);
                }

            },
            //列表
            "2": {

                //呈现日信息
                render: function () {
                    var self = this;
                    var date = new Date(
                        self.master.get("year"),
                        self.master.get("month") - 1,
                        self.master.get("day"));
                    var text = $Date.format("yyyy年MM月dd日", date);
                    self.getElement("choose_month").hide();
                    self.getElement("choose_day")
                        .text(text)
                        //此属性用于日历选择器定位数据
                        .attr("realdate", $Date.format("yyyy-MM-dd", date))
                        .show();
                    self.getElement("date_current").text("今日");

                    //初始化日期选择控件
                    self.module.setCalendar.call(self);
                },

                //上一日期
                prev: function (step) {
                    step = step || 7;
                    var self = this;
                    var date = new Date(
                    self.master.get("year"),
                    self.master.get("month") - 1,
                    self.master.get("day") - step);

                    self.model.setDate(date, { action: 'prev' });

                },
                //下一日期
                next: function (step) {
                    step = step || 7;
                    var self = this;
                    var date = new Date(
                        self.master.get("year"),
                        self.master.get("month") - 1,
                        self.master.get("day") + step);

                    self.model.setDate(date, { action: 'next' });
                },

                //当天
                current: function () {

                    var self = this;
                    var now = self.master.capi.getCurrentServerTime();
                    self.model.setDate(now, { action: 'now' });
                },

                //获取日历选择器
                setCalendar: function () {
                    var self = this;

                    if (!self.dayCalendarComp) {

                        var date = new Date(
                            self.master.get("year"),
                            self.master.get("month") - 1,
                            self.master.get("day"));

                        self.dayCalendarComp = new M2012.Calendar.View.CalenderChoose({
                            date2StringPattern: 'yyyy年MM月dd月',
                            id: self.cid + '_choose_day',
                            year: date.getFullYear(),
                            month: date.getMonth(),
                            day: date.getDate(),
                            callback: function () {
                                self.master.capi.addBehavior("calendar_choosedate_click");
                                self.model.setDate(arguments[0], { action: 'select' });
                            }
                        });
                    }
                }
            }
        },

        template: [
            '<a href="javascript:void(0)" id="{cid}_prev" class="createTop_pre"></a>',
 			'<a class="t-c-a" id="{cid}_choose_month" href="javascript:void(0);">2014年01月</a>',
            '<a style="display:none;" class="t-c-a" id="{cid}_choose_day" href="javascript:void(0);">2014年01月01日</a>',
 			'<a href="javascript:void(0)" id="{cid}_next" class="createTop_next"></a>',
 			'<a class="t-c-a" id="{cid}_date_current" href="javascript:void(0);">本月</a>'].join("")
    }));



})(jQuery, _, M139, window._top || window.top);

﻿; (function ($, _, M139, top) {

    var superClass = M139.Model.ModelBase;
    var _class = "M2012.Calendar.Model.MoreList";

    M139.namespace(_class, superClass.extend({

        name: _class,

        defaults: {
            //日期
            date: null,

            //小时
            hour: null,

            //标签
            labels: null,

            //特殊类型
            types: null,

            //缓存从服务器下载的数据
            cacheData: null
        },

        master: null,

        initialize: function (args) {
            var self = this;

            if (!args)
                args = {};

            if (args.master)
                self.master = args.master;

            if (!args.date)
                self.set({ date: args.date });

            if (args.labels)
                self.set({ labels: args.labels });

            if (args.types)
                self.set({ types: args.types });

            superClass.prototype.initialize.apply(self, arguments);
        },


        /**
         *  查询服务器获取数据
         */
        fetch: function (fnSuccess, fnError) {
            var self = this;
            var BIRTH = 1;
            var date = $Date.format("yyyy-MM-dd", self.get("date"));
            var specialTypes = self.get("types") || [];
            var _labels = self.master.get("checklabels") || [];
            var param = {
                includeLabels: "",
                includeTypes: ""
            };

            if (_.isArray(specialTypes) && !_.isEmpty(specialTypes)
                && _.every(specialTypes, function (i) { return i == BIRTH })) {

                param.includeTypes = specialTypes.join(",");

                //3. 标签只有一个，并且不是 我的日历 的系统标签ID，场景是左下方订阅日历，删除元素，适应后台接口
            } else if (_labels.length === 1 && _.indexOf(_labels, "10") < 0) {
                param.includeLabels = _labels.join(",");

                //4. 正常情况，则有两个参数向后传
            } else {
                param.includeLabels = _labels.join(",");
                param.includeTypes = specialTypes.join(",");
            }
            if (param.includeLabels == "") {
                delete param.includeLabels;
            }
            //特殊类型为空或0时无需传该参数至接口
            if (param.includeTypes == "" || param.includeTypes == "0") {
                delete param.includeTypes;
            }

            self.master.trigger(self.master.EVENTS.REQUIRE_API, {

                success: function (api) {
                    api.getCalendarView({
                        data: $.extend(param, {
                            startDate: date,
                            endDate: date,  //结束时间
                            // maxCount: 0
                            actionType: 2
                        }),
                        success: function (result) {
                            if (result.code == "S_OK") {
                                if (fnSuccess) {
                                    var data = self.filterData(result);
                                    //缓存数据
                                    self.set({ cacheData: data });
                                    fnSuccess(data);
                                }
                            } else {
                                fnError && fnError(result);
                            }
                        },
                        error: function (e) {
                            fnError && fnError(e);
                        }

                    });
                }
            });
        },

        /**
         * 判断是否在月视图
         */
        isMonthView: function () {
            var self = this;
            return !_.isNumber(self.get("hour"));
        },

        /**
         *  处理获取到的数据，按日期筛选合并数据
         */
        filterData: function (result) {

            var self = this;
            var capi = self.master.capi;

            //日程记录对照表
            var table = {};
            $.each(result["table"], function (key, item) {
                //增加开始时间和结束时间的 Date 类型实例
                table[key] = $.extend(item,
                {
                    beginDateTime: $Date.parse(item.dtStart),
                    scheduleId: item.seqNo,
                    title: item.title || '无标题'
                });
            });

            var date = $Date.format("yyyy-MM-dd", self.get("date"));
            var data = result["var"][date] || [];

            //根据 id 去查 result.table 里的记录，然后合并到每天的 info 数组里
            data['info'] = $.map(data['info'] || [], function (item, index) {
                return $.extend(table[item], { scheduleId: item.seqNo });
            });

            //排序数据
            var value = $.map(data["info"], function (item, index) {
                return $.extend({}, item, {
                    titleText: $T.Html.encode(item.title)
                });
            }).sort(function (a, b) {
                //去掉日期部分(或让日期部分一样)，只比较时间部分
                return (a.beginDateTime.getTime() % 86400000) - (b.beginDateTime.getTime() % 86400000);
            });

            //过滤指定时间内数据
            if (!self.isMonthView()) {
                var hour = self.get("hour");
                var startTime = hour + "";
                var endTime = "";

                //全天事件
                if (hour == 100) {
                    startTime = "800";
                    endTime = "2359";

                } else if (hour == 0) {
                    startTime = "0";
                }

                value = $.grep(value, function (item) {
                    if (hour == 100) {
                        return item.allDay == 1;                         
                    }
                    var itemTime = item.startTime + "";
                    if (itemTime.length > 2) {
                        itemTime = itemTime.substring(0, itemTime.length - 2);
                    }
                    return itemTime == startTime;
                });
            }
            return value;
        },

        getPageData: function (pageNo, pageSize) {
            var self = this;

            var data = self.get("cacheData");
            var isMsgMode = !!self.get("msgMode")
            var value = null;
            //获取第一页数据时前三条需要增加分隔符
            if (pageNo == 0) {

                var length = data.length - pageSize;
                value = [].concat(data.slice(0, 3))
                if (!isMsgMode) { //非日历消息中的更多情况,就加虚横线
                    value = value.concat([false]);          // +1
                }
                if (length <= 0) {
                    value = value.concat(data.slice(3));
                } else {
                    value = value.concat(data.slice(3, pageSize));
                }
            } else {
                var length = data.length - pageNo * pageSize;
                if (length <= 0) {
                    value = data.slice(pageNo * pageSize);
                } else {
                    value = data.slice(pageNo * pageSize, (pageNo + 1) * pageSize);
                }
            }
            return value;
        },

        /**
         * 日历消息专用
         */
        getTimeRangeStr: function () {
            var data = this.get("data") || [];
            var desc = '';
            var sortByStart, sortByEnd, date, startTime, endTime;

            //补位方法
            function padding(str, len) {
                if (str && str.length >= len) return str; //原本就足够长

                return (new Array(len + 1).join('0') + (str || '')).slice(-len);
            }

            //把 2014-08-26 转成 08月26日
            function toDate(str) {
                var arr = str && str.split('-');
                var date = ''

                if (arr && arr.length == 3) {
                    date = arr[1] + "月" + arr[2] + "日";
                }
                return date;
            }

            //把 530 转成 05:30
            function toTime(str) {
                str = padding(str, 4);
                return str.slice(0, 2) + ":" + str.slice(2, 4); //好变态
            }

            if (data.length > 0) {
                sortByStart = _.sortBy(data, function (item) {
                    return Number(item.startTime);
                });

                sortByEnd = _.sortBy(data, function (item) {
                    return Number(item.endTime);
                });

                date = toDate(data[0].startDate);
                startTime = toTime(sortByStart[0].startTime);
                endTime = toTime(sortByEnd[0].endTime);

                desc = date + startTime + '-' + endTime;
            }

            return desc;
        }

    }));

})(jQuery, _, M139, window._top || window.top)
﻿; (function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var master = window.$Cal;
    var _class = "M2012.Calendar.View.MoreList";

    M139.namespace(_class, superClass.extend({

        name: _class,

        model: null,

        master: null,

        //分页控件
        pager: null,

        /**
         * 显示更多活动列表
         * @param {Date} args.date 指定日期
         * @param {Number} args.hour 指定时间
         * @param {Array} args.labes 标签类型
         * @param {Array} args.types 特殊类型
         * @param {Object} args.master 主控制器
         * @param {Function} args.onRemove 删除某条活动时的回调
         */
        initialize: function (args) {

            var self = this;

            args = args || {};

            if (args.master)
                self.master = args.master;

            //当前日期
            var date = args.date;
            if (!_.isDate(date)) {
                date = self.master.capi.getCurrentServerTime();
            }

            var hour = null;
            if (typeof args.hour != "undefined") {
                hour = args.hour;
            }

            superClass.prototype.initialize.apply(self, arguments);

            //创建视图模型对象
            self.model = new M2012.Calendar.Model.MoreList({
                master: self.master,
                date: date,
                hour: hour,
                labels: args.labels ? args.labels : null,
                types: args.types ? args.types : null,
                data: args.data
            });

            self.container = args.container;
            self.onRemove = args.onRemove;

            self.render();
        },

        initEvents: function () {

            var self = this;

            //点击上一页触发事件
            self.getElement("pageprev").click(function (e) {

                self.pager.prev.call(self);
            });

            //点击下一页触发事件
            self.getElement("pagenext").click(function (e) {

                self.pager.next.call(self);
            });

        },

        render: function () {
            var self = this;
            //把backbone本身创建的Div移除掉
            //因为本次视图不是添加在此div内
            self.$el.remove();
            var date = self.model.get("date");
            var hour = self.model.get("hour");
            var data = self.model.get("data");
            var key = M2012.Calendar.View.MoreList.getKey(date, hour);

            //获取当前日期详细信息以供界面展示          
            var dayInfo = (new M2012.Calendar.MonthInfo(date))[$Date.format("yyyy-MM-dd", date)];
            var container = $('#div_more_' + key);
            var day = self.container ? '' : dayInfo.day;
            var lunarTitle = self.container ? self.model.getTimeRangeStr() : dayInfo.lunarText;
            var totalClass = self.container ? 'hide' : '';
            var html = $T.format(self.template.ui, {
                cid: self.cid,
                day: day,
                lunarTitle: lunarTitle,
                totalClass: totalClass
            });

            if (self.container) {
                self.currentEl = $(html).css('left', '-1000px'); //飘出屏幕, 否则会看到闪动
                $(document.body).append(self.currentEl);
            } else {
                //先清空内部元素在创建浮出层
                container.empty();
                self.currentEl = $(html).appendTo(container);
                self.container = container;
            }

            //日视图下不显示日历信息
            if (!self.model.isMonthView()) {
                self.getElement("total").siblings().hide();
            }

            //修饰视图样式
            self.setViewStyle(dayInfo);
            self.initEvents();

            var waitEl = self.getElement("waitting");

            if (data) {
                self.model.set({
                    'cacheData': data,
                    'msgMode': true //日历消息中的更多模式
                });
                if (data.length > 0) {
                    //初始化分页控件
                    self.pager = new M2012.Calendar.MoreList.Pager({
                        recordCount: data.length,
                        render: self.renderPage
                    });
                    self.getElement("total").text($T.format("共{total}个活动", { total: data.length }));
                    //呈现页数据
                    self.renderPage();

                    setTimeout(function () {
                        M139.Dom.dockElement(self.container, self.currentEl, { direction: 'upDown' });
                    }, 0); //延迟,否则计算有点小问题
                }
                waitEl.addClass("hide");
            } else {
                //获取服务端数据并显示分页数据
                self.model.fetch(function (data) {
                    var data = data || [];
                    if (data.length > 0) {
                        //初始化分页控件
                        self.pager = new M2012.Calendar.MoreList.Pager({
                            recordCount: data.length,
                            render: self.renderPage
                        });
                        self.getElement("total").text($T.format("共{total}个活动", { total: data.length }));
                        //呈现页数据
                        self.renderPage();
                    }
                    waitEl.addClass("hide");
                }, function () {
                    waitEl.addClass("hide");
                });
            }
        },

        //显示分页数据
        renderPage: function () {
            var self = this;
            if (!self.pager)
                return;

            var container = self.getElement("ul").empty();
            //设置前一页的按钮样式
            var className = "disabledFirst";
            var pageEl = self.getElement("pageprev");
            if (self.pager.isFirst())
                pageEl.addClass(className);
            else {
                pageEl.removeClass(className);
            }
            //设置后一页的按钮样式
            className = "disabledLast";
            pageEl = self.getElement("pagenext");
            if (self.pager.isLast()) {
                pageEl.addClass(className);

            } else {
                pageEl.removeClass(className);
            }
            if (self.pager.isFirst()) {
                container.height("auto");
            }

            //设置分页页码描述信息
            var desc = $T.format("{pageNo}/{pageCount}", {
                pageNo: self.pager.recordCount == 0 ? 0 : self.pager.pageNo + 1,
                pageCount: self.pager.pageCount
            })
            self.getElement("pagedesc").text(desc);

            var data = self.model.getPageData(self.pager.pageNo, self.pager.pageSize);

            var html = [];
            $.map(data, function (item, index) {
                //产生一条分隔符虚线
                if (item === false) {
                    html.push("<li class='month_notes_separate'></li>");
                    return true;
                }
                //item= null时，填空的li以占位
                if (item === null) {
                    html.push("<li></li>");
                    return true;
                }
                //填充正常的数据项
                html.push($T.format(self.template.li, self.fixItemData(item)));
            });

            container.html(html.join(""));

            container.find("li[type]").click(function (event) {
                var me = $(this);
                var id = me.attr("scheduleId");
                var type = me.attr("type");

                self.master.trigger(self.master.EVENTS.VIEW_POP_ACTIVILY, {
                    seqNo: id,
                    type: type,
                    // event: event,
                    target: me,
                    //回调函数
                    callback: function (args) {
                        if (self.onRemove) { //内部传入了回调,就不再跳转了
                            self.onRemove(args);
                            return;
                        }

                        //刷新月视图
                        self.master.trigger(self.master.EVENTS.NAVIGATE, {
                            path: "mainview/refresh"
                        });
                    },
                    error: function (e) {
                        top.M139.UI.TipMessage.show('操作失败，请稍后再试！', {
                            delay: 2000,
                            className: "msgRed"
                        });
                    }
                });
            });

            //第一页数据加载后需要设定div高度，这样在翻页后高度才不会上下抖动
            if (self.pager.isFirst()) {
                window.setTimeout(function () {
                    container.height(container.height());
                }, 0xff);
            }
        },

        fixItemData: function (item) {

            var self = this;
            var capi = self.master.capi;
            var constant = self.master.CONST;

            //计算开始时间
            var start = capi.fixHourTime(item.startTime);
            var end = capi.fixHourTime(item.endTime);
            var begin = capi.isFullDayEvent(start, end) ? "" : start + " ";

            var isMsg = "none";
            var isBirth = "none";
            var txtColor = item.forecolor || "";
            var displayIcon = "";
            var title = item.titleText || item.title;

            if (item.enable == 1) {
                displayIcon = "clock";
            }

            //只有是被邀请的未处理的活动才显示消息ICON
            if (item.isInvitedCalendar && item.status == 0) {

                isMsg = 'block';
                if (item.specialType == constant.specialType.birth) {

                    title = item.titleText + "生日";
                    txtColor = constant.activilyTxtColor.blackColor;
                }
            }
                //该条是生日活动（这是创建者）
            else if (item.specialType == constant.specialType.birth) {

                displayIcon = "";
                isBirth = "block";
                title = item.titleText + "生日";
                txtColor = constant.activilyTxtColor.blackColor;
                // displayIcon = "99";

            } else if (item.operationFlag) {

                displayIcon = item.operationFlag;
                txtColor = constant.activilyTxtColor.blackColor;
            }

            var scheduleType = "";
            //自己的活动
            if (!item.isInvitedCalendar && !item.isSharedCalendar && !item.isSubCalendar) {
                scheduleType = constant.activityType.myself;

            } else if (item.isInvitedCalendar) {
                scheduleType = constant.activityType.invited;

            } else if (item.isSharedCalendar) {
                scheduleType = constant.activityType.shared;

            } else if (item.isSubCalendar) {
                scheduleType = constant.activityType.subscribed;
            }
            var className = "";
            var backColor = item.color || '#6699ff';
            if (item.color) {
                var className = self.master.CONST.activilyColors[item.color] || "";
                if (className) {
                    backColor = "";
                }
            }

            return {
                titleText: begin + title,
                date: $Date.format("yyyy-MM-dd", self.model.get("date")),
                isMsg: isMsg,
                isBirth: isBirth,
                txtColor: txtColor,
                className: className,
                icontype: displayIcon ? constant.activilyIconType[displayIcon] : "",
                scheduleType: scheduleType,
                color: backColor,
                scheduleId: item.scheduleId || item.seqNo || item.seqno
            };

        },

        /**
         *  获取页面元素对象
         *  针对那些以cid作为id的元素
         */
        getElement: function (id) {
            var self = this;
            id = $T.format("#{cid}_{id}", {
                cid: self.cid,
                id: id
            });
            return $(id, self.currentEl);
        },

        /**
         * 设置视图样式
         */
        setViewStyle: function (dayInfo) {
            var self = this;
            if (!self.model.isMonthView()) {
                var event = M139.Event.getEvent();
                if (event) {
                    var offset = top.$App.getBodyHeight() - $(frameElement).offset().top - event.clientY - 300;
                    if (offset < 0) {
                        self.currentEl.css({ top: offset });
                    }
                }
                self.currentEl.css({ left: -self.currentEl.width() });
                return;
            }
            //增加行样式
            if (dayInfo.isFirstWeek) {//第一行
                self.currentEl.addClass("registerLayerTop");

            } else if (dayInfo.isLastWeek)//最后一行
                self.currentEl.addClass("registerLayerBtm");

            //增加列样式
            if (dayInfo.weekday == 0) { //第一列               
                self.currentEl.addClass("registerLayerLeft");

            } else if (dayInfo.weekday == 6) { //最后一列
                self.currentEl.addClass("registerLayerRight");
            }

            //修补：最后一列的非最后一行，要加多一个样式
            if (dayInfo.weekday == 6 && !dayInfo.isLastWeek)
                self.currentEl.addClass("registerlayerleftAuto");
        },

        hide: function () {
            this.currentEl.remove();
        },

        template: {
            ui: [
                '<div class="register_more" style="cursor: default;">',
                    '<p class="clearfix">',
                        '<span class="fr">',
                            '<em class="fl" id="{cid}_pagedesc">0/0</em>',
                            '<span>',
                                '<a href="javascript:" title="上一页" ',
                                 'class="prevPage disabledFirst" id="{cid}_pageprev" >',
                                '</a>',
                                '<a href="javascript:" title="下一页"',
                                    'class="nextPage disabledLast" ',
                                    'id="{cid}_pagenext" ></a>',
                            '</span>',
                        '</span>',
                        '<span class="adTagTile">',
                            '<b>{day}</b><span>{lunarTitle}</span><em id="{cid}_total" class="{totalClass}">(共0个活动)</em>',
                        '</span>',
                    '</p>',
                    '<div style="text-align:center" id="{cid}_waitting"><img src="../../images/global/load.gif" alt=""></div>',
                    '<ul id="{cid}_ul" class="notes show">',
                    '</ul>',
                '</div>'].join(""),

            li: [
                '<li type="{scheduleType}" scheduleId="{scheduleId}" class="{className}" style="background-color:{color};cursor: pointer; ">',
                    '<a type="{scheduleType}" href="javascript:void(0)" title="{titleText}" style="color:{txtColor}">',
                        '<i class="{icontype} IconPosion"></i>{titleText}',
                    '</a>',
                    '<a style="display:{isMsg};" class="noteMessage" href="javascript:;"><i class="i_message"></i></a>',
                '</li>'].join("")
        }

    }, {


        //缓存添加到页面的"更多活动"视图
        CacheViews: {},

        /**
         * 隐藏所有的更多活动浮层
         */
        hide: function (timeout) {
            var view = M2012.Calendar.View.MoreList;

            for (var key in view.CacheViews) {

                var id = "#div_more_" + key;
                $(id).hide().parent().css({ 'z-index': 1 }); //降低 parenNode 的 z-index
            }

            if (view.lastView) {
                view.lastView.hide();
                view.lastView = null;
            }
        },

        /**
         * 显示更多活动浮层
         * @param {Date} args.date 指定日期
         * @param {Number} args.hour 指定时间
         * @param {Array} args.labes 标签类型
         * @param {Array} args.types 特殊类型
         * @param {Object} args.master 主控制器
         * @param {Function} args.onRemove 删除某条活动时的回调(目前用于日历消息)
         */
        show: function (args) {

            var view = M2012.Calendar.View.MoreList;
            var key = view.getKey(args.date, args.hour);
            //先隐藏所有
            view.hide(500);
            if (!view.CacheViews[key]) {
                view.CacheViews[key] = true;
            }

            setTimeout(function () { //先触发document.click
                view.lastView = new M2012.Calendar.View.MoreList(args);
                //显示浮层
                $('#div_more_' + key).removeClass('hide')
                    .fadeIn(500)
                    .click(function (event) {
                        event.stopPropagation();

                    }).parent().css({ 'z-index': 2 }); //提升 parentNode 的 z-index

                //为什么这样绑定阻止冒泡?????? siht!!!
                view.lastView.currentEl.click(function (event) {
                    event.stopPropagation();
                });
            }, 100);
        },

        /**
         * 根据指定时间获取对应的元素KEY
        */
        getKey: function (date, hour) {
            var key = $Date.format("yyyy-MM-dd", date);
            if (_.isNumber(hour)) {
                key += "_" + hour;
            }
            return key;
        }

    }));

    $(function () {

        window.setTimeout(function () {
            var master = window.$Cal;
            master.on(master.EVENTS.HIDE_ACTIVITY_POPS, function () {
                var view = M2012.Calendar.View.MoreList;
                view.hide(500);
            });
        }, 10);

    });

    var view = M2012.Calendar.View.MoreList;

    //点击页面后隐藏所有的更多活动浮层
    $(document.body).click(function (e) {
        view.hide(500);
    });

    //分页控件
    M139.namespace("M2012.Calendar.MoreList.Pager", function (args) {

        var self = this;
        //当前页面
        self.pageNo = 0;
        //每页显示条数
        self.pageSize = 10;
        //页数
        self.pageCount = 0;

        args = args || {};

        //记录条数
        self.recordCount = 0;
        if (args.recordCount) {
            self.recordCount = args.recordCount;
        }

        //计算页数
        self.pageCount = (self.recordCount - self.recordCount % self.pageSize) / self.pageSize;
        if (self.recordCount % self.pageSize > 0) {
            self.pageCount += 1;
        }

        //呈现界面
        self.render = function () {
            //此处的this指向view
            args.render && args.render.call(this);
        };

        //上一页
        self.prev = function () {
            if (self.pageNo > 0) {
                //页面减1
                self.pageNo--;
                self.render.call(this);
            }
        }

        //下一页
        self.next = function () {
            if (self.pageNo < (self.pageCount - 1)) {
                //页面加1
                self.pageNo++;
                self.render.call(this);
            }
        }

        //是否第一页
        self.isFirst = function () {
            return self.pageNo == 0;
        }

        //是否最后一页
        self.isLast = function () {
            if (self.pageCount === 0)
                return true;
            if (self.pageNo === (self.pageCount - 1))
                return true;
            return false;
        }

    });

})(jQuery, _, M139, window._top || window.top);
; (function ($, _, M139, top) {
    var superClass = M139.Model.ModelBase;
    var _class = "M2012.Calendar.Model.Month";

    M139.namespace(_class, superClass.extend({

        name: _class,

        logger: new M139.Logger({ name: _class }),

        defaults: {
            //当月是否有活动数据
            hasData: false,
            //当月日历信息
            mCalendar: null,
            days: [],
            //显示条数
            showCount: 3
        },

        viewName: "month",

        cacheData: [],
        //天气预报数据
        weatherData: [],

        master: null,

        EVENTS: {
            LOAD_MONTH_VIEW: "month#monthview:load",
            LOAD_VIEW_DATA: "month#viewdata:load",
            CHECK_MONTH_DAY: "month#monthday:check"
        },

        TIPS: {
            OPERATE_ERROR: "操作失败，请稍后再试",
            LOAD_DATA_ERROR: "获取月活动信息失败: getCalendarView"
        },

        initialize: function (args) {
            var self = this;

            self.master = args.master;
            superClass.prototype.initialize.apply(this, arguments);

            //重新获取当月的日期信息
            self.set({
                mCalendar: new M2012.Calendar.MonthInfo(
                    self.master.get("year"),
                    self.master.get("month"),
                    self.master.get("day"))
            });
            self.set({ days: self.getDays() });

            self.initEvents();
        },

        /**
         *  注册页面事件   
        **/
        initEvents: function () {
            var self = this;
            var monthChanged = false;
            var dayChanged = false;
            var filterChanged = false;

            self.master.on("change:year change:month change:day change:checklabels change:includeTypes", function (model, val) {
                //确保当前视图为月视图
                if (self.master.get("view_location").view != self.viewName)
                    return;

                //判断月份有没有改变
                if (model.hasChanged("year") || model.hasChanged("month")) {
                    monthChanged = true;
                }
                    //判断活动过滤条件是否发生变化   
                else if (model.hasChanged("checklabels") || model.hasChanged("includeTypes")) {
                    filterChanged = true;
                }
                    //判断天是否发生变化
                else if (model.hasChanged("day")) {
                    dayChanged = true;
                }

                if (self.outimer) {
                    window.clearTimeout(self.outimer);
                }
                //延迟一下,可以缓解多个值变更时触发多次,造成请求多次的问题
                self.outimer = window.setTimeout(function () {
                    if (monthChanged) {
                        //重新获取当月的日期信息
                        self.set({
                            mCalendar: new M2012.Calendar.MonthInfo(
                                self.master.get("year"),
                                self.master.get("month"),
                                self.master.get("day"))
                        });
                        self.set({ days: self.getDays() });
                        self.trigger(self.EVENTS.LOAD_MONTH_VIEW);
                        monthChanged = false;
                        //如果月份都改变了那么意味着必须要重新加载活动数据
                        filterChanged = true;
                        //月份变了同样需要重新选择一天
                        dayChanged = true;
                    }
                    if (dayChanged) {
                        self.trigger(self.EVENTS.CHECK_MONTH_DAY);
                        dayChanged = false;
                    }
                    if (filterChanged) {
                        self.trigger(self.EVENTS.LOAD_VIEW_DATA);
                        filterChanged = false;
                    }
                }, 0xff);
            });
        },

        //过滤出指定日程信息
        fiterData: function (fn) {
            var self = this;
            var capi = self.master.capi;
            var data = self.cacheData;
            var showCount = self.get("showCount");
            var result = [];

            $.each(self.get("days"), function (index, day) {
                var obj = $.extend({}, day);
                var value = data[obj.date] || {};
                var list = value.info || [];

                //先排好序，再截取
                list = list.sort(function (a, b) {
                    //让日期部分一样，只比较时间部分
                    return (a.beginDateTime.getTime() % 86400000) - (b.beginDateTime.getTime() % 86400000);
                });

                obj.activities = $.map(list.slice(0, showCount), function (item, index) {
                    return $.extend({}, item, {
                        index: index
                    });
                });

                //增加一个字段，指示是否有更多
                obj.activities.isMore = list.length > 3;
                obj.activities.total = list.length - 3;

                //设置一个值，指示本月是否有活动数据(只需要设置一次)
                if (list.length > 0) {
                    self.set({ hasData: true });
                }
                result.push(obj);
            });

            fn && fn(result);
        },

        /**
         *  从服务端获取数据   
        **/
        fetch: function (fnSuccess, fnError) {
            var self = this;
            var mCalendar = self.get("mCalendar");
            var _labels = self.master.get("checklabels") || [];
            var specialTypes = self.master.get("includeTypes") || [];
            var BIRTH = 1;

            var param = {
                maxCount: self.get("showCount"),
                includeTypes: "",
                includeLabels: "",
                startDate: mCalendar.firstMonthViewDay,
                endDate: mCalendar.lastMonthViewDay
            };

            //specialTypes存在的时候，不传includeLabels，只传送includeTypes
            if (_.isArray(specialTypes) && !_.isEmpty(specialTypes)
                   && _.every(specialTypes, function (i) { return i == BIRTH })) {

                param.includeTypes = specialTypes.join(",");

            }
                //没有选中标签时无需请求后台
            else if (_labels.length === 0) {
                self.set({ hasData: false });
                self.cacheData = [];
                self.fiterData(fnSuccess(null));
                return;

            } else {
                param.includeLabels = _labels.join(",");
            }

            //特殊类型为空或0时无需传该参数至接口
            if (param.includeTypes == "" || param.includeTypes == "0") {
                delete param.includeTypes;
            }

            //调用接口查询日程记录
            self.getCalendarView(param, function (data, json) {
                self.cacheData = data;
                self.fiterData(fnSuccess);
            }, function (e) {

                fnError && fnError(e);
            });
        },

        /**
         *  获取日程视图
        **/
        getCalendarView: function (param, fnSuccess, fnError) {

            var self = this;
            var capi = self.master.capi;

            self.master.trigger(self.master.EVENTS.REQUIRE_API, {

                success: function (api) {

                    api.getCalendarView({
                        data: $.extend({
                            comeFrom: 0,  //请求来源：0:139邮箱标准版, 1:139邮箱酷版
                            startDate: "",//开始时间
                            endDate: "",  //结束时间
                            maxCount: self.get("showCount")//每天节点需要返回的数据条数，默认不填返回所有。比如说月视图，每天返回3条数据
                        }, param),

                        success: function (result) {
                            if (result.code == "S_OK") {
                                //日程记录对照表
                                var table = {};
                                $.each(result["table"], function (key, item) {
                                    //增加开始时间和结束时间的 Date 类型实例
                                    table[key] = $.extend(item,
                                    {
                                        beginDateTime: $Date.parse(item.dtStart),
                                        scheduleId: item.seqNo,
                                        title: item.title || '无标题'
                                    });
                                });

                                var data = result["var"];

                                $.each(data, function (key, day) {
                                    //根据 id 去查 result.table 里的记录，然后合并到每天的 info 数组里
                                    day['info'] = $.map(day['info'] || [], function (item, index) {
                                        return $.extend(table[item], {
                                            scheduleId: item.seqNo
                                        });
                                    });
                                });

                                fnSuccess && fnSuccess(data, result);

                            } else {

                                fnError && fnError(result);
                            }
                        },
                        error: function (e) {

                            fnError && fnError(e);
                        }
                    });
                }

            });
        },

        /**
         *  获取当月天数
        **/
        getDays: function () {
            var self = this;
            var days = [];
            var mCalendar = self.get("mCalendar");

            if (mCalendar && mCalendar.weeks && mCalendar.weeks.length > 0) {
                $.each(mCalendar.weeks, function () {
                    $.each(this, function () {
                        days.push(this);
                    });
                });
            }

            return days;
        },

        /**
         *  获取指定日期在当天中的索引位置
        **/
        getDayIndex: function (date) {
            var self = this;
            var value = -1;

            if (_.isDate(date)) {
                date = $Date.format("yyyy-MM-dd", date);
            }

            $.each(self.get("days"), function (index, day) {
                if (day.date == date) {
                    value = index;
                    return false;
                }
            });
            return value;
        }

    }));

})(jQuery, _, M139, window._top || window.top);
; (function ($, _, M139, top) {
    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.Month";

    M139.namespace(_class, superClass.extend({

        name: _class,

        logger: new M139.Logger({ name: _class }),

        //日历视图主控
        master: null,

        //当前视图模型
        model: null,

        //当前视图名称
        viewName: "month",

        //月视图容器jQuery对象
        container: null,

        //日历单元格
        tabCells: null,

        //当月的周数
        weekCount: 4,

        messages: {
            LOADING: "正在加载中..."
        },

        /**
         * 月视图构造函数
         * @param {Object} master 视图主控对象
         * @param {Object} container 月视图容器
        **/
        initialize: function (args) {
            var self = this;

            args = args || {};
            self.master = args.master;
            superClass.prototype.initialize.apply(self, arguments);
            //删除当前视图默认生成的父容器
            self.$el.remove();

            //注册页面创建事件
            //视图首次创建时触发
            self.master.bind(self.master.EVENTS.VIEW_CREATED, function (args) {
                if (args.name === self.viewName) {
                    self.master.unbind(self.master.EVENTS.VIEW_CREATED, arguments.callee);
                    self.container = args.container;
                    //初始化model
                    self.model = new M2012.Calendar.Model.Month({
                        master: self.master
                    });
                    self.render();
                    if ($.isFunction(args.onshow)) {
                        args.onshow();
                    }
                    self.initEvents();
                    self.setViewEvents();
                    //页面大小改变时重新计算月视图单元格大小
                    $(window).resize(function () {
                        self.adjustHeight();
                    });
                }
            });

            //注册视图展示时触发事件
            //每次切换视图时都会触发，所以需要通过data.args.subview来判断是不是切换到了当前视图
            //data.args.silent 表示是否忽略刷新视图数据，如果silent为ture则无需重新加载视图数据
            self.master.bind(self.master.EVENTS.VIEW_SHOW, function (data) {

                if (data && data.args && !data.args.silent && data.args.subview == self.viewName) {
                    //选中当前月当天
                    self.model.trigger(self.model.EVENTS.CHECK_MONTH_DAY);
                    //只有当服务器端获取到了日历标签数据后我们才显示视图活动数据
                    if (self.master.get("labelData")) {
                        //初始化页面数据
                        self.model.trigger(self.model.EVENTS.LOAD_VIEW_DATA);
                        //记录行为日志
                        if (window.isCaiyun) {
                            self.master.capi.addBehavior("cal_caiyun_monthview_load");
                            return;
                        }
                        self.master.capi.addBehavior("calendar_monthview_load");
                    }
                }
            });
        },

        /**
         *  注册页面事件   
        **/
        initEvents: function () {
            var self = this;

            //呈现月视图表格
            self.model.on(self.model.EVENTS.LOAD_MONTH_VIEW, function () {
                self.render();
            });

            //加载活动数据
            self.model.on(self.model.EVENTS.LOAD_VIEW_DATA, function () {
                // fix: 切换左侧视图栏时,弹窗的活动窗口无法关闭的问题
                self.master.trigger(self.master.EVENTS.HIDE_ACTIVITY_POPS);
                //能加载数据说明主视图已经加载完毕
                self.master.set({
                    first_load_completed: true
                });
                self.fillData();

                //接口自定义事件上报
                M2012.Calendar.Analytics.sendEvent('load', { api: 'load_view_data' });
            });

            //选中当前选择日期
            self.model.on(self.model.EVENTS.CHECK_MONTH_DAY, function (args) {
                self.checkDay(args);
            });

            self.master.on(self.master.EVENTS.HIDE_ACTIVITY_POPS, function () {
                // 切换左侧菜单时也关闭弹出的TIP
                M139.UI.Popup.close();
            });

        },

        /**
         * 设置月视图点击事件
         */
        setViewEvents: function () {
            var self = this;
            self.container.click(function (e) {
                //自定义点击事件上报
                M2012.Calendar.Analytics.sendClick(e);

                var target = $(e.target);
                var command = target.data('cmd');
                var element = null;
                var chkclass = "onCheck";
                var hoverclass = "onHover";
                //日历单元格
                var cellEl = null;

                if (command) {
                    if (target[0].tagName == "TD")
                        cellEl = target;
                } else {
                    var el = self.parent(target[0], 'A');
                    if (el) {
                        target = $(el);
                        command = target.data('cmd');
                    }
                }
                if (!command || !cellEl) {
                    var el = self.parent(target[0], 'TD');
                    if (el) {
                        var cmd = $(el).data('cmd');
                        if (cmd) {
                            cellEl = $(el);
                            if (!command) {
                                command = cmd;
                                target = $(el);
                            }
                        }
                    }
                }
                //判断是否可以执行命令
                if (command) {
                    //是否是活动查看或查看更多活动操作
                    var isLink = (target[0].tagName == "A");
                    //不是点击超链接的情况下需要隐藏所有弹出层
                    if (!isLink) {
                        self.master.trigger(self.master.EVENTS.HIDE_ACTIVITY_POPS, {
                            silent: false
                        });
                    }
                    if (isLink || (cellEl && cellEl.hasClass(chkclass))) { // 活动添加
                        if (!self.hasLocked(target)) {
                            var handles = self.handlers();
                            var func = handles[command];
                            if (func) {
                                func.call(self, target, e, $.extend({
                                    height: target.height(),
                                    width: target.width()
                                }, target.offset()));
                            }
                        }
                    }
                }

                ////设置单元格选中
                if (cellEl) {
                    if (!cellEl.hasClass(chkclass)) {
                        self.master.set({
                            year: cellEl.data("year")
                        });
                        self.master.set({
                            month: cellEl.data("month")
                        });
                        self.master.set({
                            day: cellEl.data("day")
                        });
                    }
                }

            });
        },

        /**
         * 获取指定标签的父元素
         */
        parent: function (el, tagName) {
            tagName = tagName.toUpperCase();
            var element = el;
            for (var i = 0xFF; i--;) {
                if (element == null || "#document" === element.nodeName)
                    return null;

                if (element.nodeName === tagName)
                    break;

                element = element.parentNode;
            }
            return element;
        },

        /**
       * 限制元素的点击频率
       */
        hasLocked: function (target) {
            var key = "locked";
            if (target.attr(key) == "1") {
                return true;
            }

            target.attr(key, "1");

            window.setTimeout(function () {
                target.attr(key, "");

            }, 1500);

            return false;
        },

        handlers: function () {

            var self = this;

            return {
                addschedule: function (element, eventArgs) {
                    var date = self.master.capi.parse(element.data("date"));

                    //公共日历则不让添加活动
                    if (self.master.get("view_filter_flag") === "subscribe") {
                        M139.UI.Popup.close();
                        var popupTip = M139.UI.Popup.create({
                            target: element,
                            content: '此为公共日历，不能创建活动',
                            direction: 'up',
                            noClose: true
                        });
                        popupTip.render();

                        if (M139.UI.Popup.calendarPopupTimer) {
                            window.clearTimeout(M139.UI.Popup.calendarPopupTimer);
                        }
                        M139.UI.Popup.calendarPopupTimer = setTimeout(function () {
                            popupTip && popupTip.close();
                        }, 3000);
                        window.setTimeout(function () {
                            $(document.body).click(function () {
                                popupTip && popupTip.close();
                            });
                        }, 0xff);

                        return;
                    }

                    //弹出添加窗口
                    self.master.trigger(self.master.EVENTS.ADD_POP_ACTIVILY, {
                        //触发源和事件源
                        //用于定位弹出框位置
                        target: element,
                        //  event: eventArgs,
                        //指定日期
                        date: date,
                        //主控制器
                        master: self.master,
                        //保存成功后的回调处理
                        callback: function () {
                            //刷新月视图
                            self.master.trigger(self.master.EVENTS.NAVIGATE, {
                                path: "mainview/refresh"
                            });
                        }
                    });

                },

                showschedule: function (element, event, srcRect) {

                    //先尝试关闭所有弹出框
                    if (!M2012.Calendar.View.Popup.Direction.tryClose()) {
                        return;
                    }

                    var date = element.data('date'),
                        id = element.data('id'),
                        type = element.data('type');

                    //判断下是否是当月的活动
                    //非当月的活动本次不展示
                    var dt = self.master.capi.parse(date);
                    if (dt) {
                        if (dt.getFullYear() != self.master.get("year") ||
                            dt.getMonth() != self.master.get("month") - 1) {
                            return;
                        }
                    }

                    self.master.trigger(self.master.EVENTS.VIEW_POP_ACTIVILY, {
                        seqNo: id,
                        type: type,
                        //  event: event,
                        target: element,
                        rect: srcRect,
                        //回调函数
                        callback: function (args) {
                            //刷新月视图
                            self.master.trigger(self.master.EVENTS.NAVIGATE, {
                                path: "mainview/refresh"
                            });
                        },
                        error: function (e) {
                            top.M139.UI.TipMessage.show('操作失败，请稍后再试！', {
                                delay: 2000,
                                className: "msgRed"
                            });
                        }
                    });
                },

                showmore: function (ele, event) {

                    //防止触发body的click事件
                    M139.Event.stopEvent(event);
                    var date = ele.data('date');
                    var td = ele.parents('td');
                    td.siblings('td').removeClass('p_relative');
                    ele.parents('.j_weekrow').siblings('.j_weekrow').find('td').removeClass('p_relative');
                    //兼容360下显示更多浮层层级问题
                    td.addClass('p_relative').css('z-index', '3');
                    //隐藏所有弹出层
                    self.master.trigger(self.master.EVENTS.HIDE_ACTIVITY_POPS);
                    var date = self.master.capi.parse(date);

                    M2012.Calendar.View.MoreList.show({
                        date: date,
                        master: self.master,
                        labels: self.master.get("checklabels") || [],
                        types: self.master.get("includeTypes") || []
                    });
                }
            };
        },

        /**
        * 自适应月视图高度
        */
        adjustHeight: function () {
            var self = this;
            var offset = 2, itemHeight = 0;
            var height = document.body.clientHeight - self.container.offset().top;
            var tabHeight = height - $("#divTableHead").height();

            //IE下莫名其妙的会出现负值
            if (height < 0 || tabHeight < 0) {
                return;
            }

            //如果有当月有活动数据，则限制最小高度，
            //以保证能显示每个日历下的最多4个活动
            if (self.model.get("hasData")) {

                //获取一个参考活动元素
                var items = $("li[name='view-activily-items']");
                if (items.length > 0) {
                    //日历方格的最小高度必须为maxcount +2 个，
                    //一个是为了保留一个活动身位的空白
                    //另一个是日期显示占据了一定高度
                    itemHeight = (items.get(0).offsetHeight + 1) * (self.model.get("showCount") + 2);
                }
            }
            //计算日历方格的高度
            var newHeight = Math.floor(tabHeight / self.weekCount) - offset;
            if (itemHeight > 0 && newHeight < itemHeight) {
                newHeight = itemHeight;
            }

            self.container.find(".tabCell").each(function (n) {
                $(this).height(newHeight);
            });

            self.container.height(height);
        },

        /**
         *  呈现视图
        **/
        render: function () {
            var self = this;

            //绘画月视图日历表格
            self.drawTable();
            self.drawTabCells();

            //设置单元格鼠标滑动样式 
            self.tabCells.hover(function () {
                var me = $(this);
                if (!me.hasClass("onCheck")) {
                    me.addClass("onHover");
                }
            }, function () {
                $(this).removeClass("onHover");
            });

            //自适应月视图高度
            self.adjustHeight();

            //显示天气预报
            window.setTimeout(function () {
                self.showWeather();
            }, 0x10);
        },

        /**
         * 绘画月历表格
         */
        drawTable: function () {
            var self = this;
            var container = self.container;
            var html = [];
            //清空容器内所有内容
            self.container.empty();

            for (var i = 6; i--;) {
                html.unshift('</tr></tbody></table></div>');
                for (var j = 7; j--;) {
                    var klass = (j == 6 || j == 0) ? 'holiday' : ''; //klass读音class, 周六日显示灰色底色
                    html.splice(0, 0, '<td data-cmd="addschedule" id="daycell_', i * 7 + j, '" class="' + klass + '">',
                      '<div class="tabCell p-relative" onselectstart="return false;" style="-moz-user-select:none;">',
                      '<div class="math_date">',
                      '<p class="date">',
                      '<span class="titleFr"></span>',
                      '<b></b>',
                      '<span id="lunar"></span>',
                      '</p>',
                      '<ul id="ul_action" class="notes show"></ul>',
                      '</div>',
                      '<div class="j_div_more hide"></div>',
                      '</div>',
                      '</td>');
                }
                html.unshift('<div class="j_weekrow"><table class="calender"><tbody><tr style="border:solid 1px #ffffff;">');
            }

            html.splice(0, 0, [
					    '<div class="caml_table" name="dv_calendar_view_Container">',
						    '<div id="divTableHead">',
						        '<table class="calender" role="grid">',
							        '<thead>',
							            '<tr>',
								            '<th>星期日</th>',
								            '<th>星期一</th>',
								            '<th>星期二</th>',
								            '<th>星期三</th>',
								            '<th>星期四</th>',
								            '<th>星期五</th>',
								            '<th>星期六</th>',
							            '</tr>',
							        '</thead>',
						        '</table>',
						    '</div>',
						    '<div id="divMain" class="cal_m_content">',
                                '<div id="divTable" class="table_content">'//,
                                    //'<div id="divWaiting" class="hide">',
                                    //    '<div class="bg-cover"></div>',
                                    //    '<div class="noflashtips inboxloading loading-pop" id="">',
                                    //        '<!--[if lte ie 7]><i></i><![endif]-->',
                                    //        '<img src="../../images/global/load.gif" alt="" style="vertical-align:middle">正在载入中，请稍候......',
                                    //    '</div>',
                                    //'</div>'
            ].join(""));
            html.push(['</div></div></div>'].join(""));
            container.append(html.join(''));
        },

        /**
         * 绘画月历单元格
         */
        drawTabCells: function () {
            var self = this;
            var mCalendar = self.model.get("mCalendar");
            var holidayTypes = self.master.CONST.holidayTypes;
            var nowDate = self.master.capi.getCurrentServerTime();

            nowDate = $Date.format("yyyy-MM-dd", nowDate);

            //隐藏当月多余的周日期
            var rows = self.container.find(".j_weekrow");
            self.weekCount = mCalendar.weeks.length;
            $.each([4, 5], function (i, n) {
                if (n >= self.weekCount)
                    rows.eq(n).addClass("hide");
            });

            self.tabCells = self.container.find("td");
            $.each(self.model.get("days"), function (i, item) {
                var tabCell = self.tabCells.eq(i)
                tabCell.data("index", i);
                tabCell.data("day", item.day);
                tabCell.data("month", item.month);
                tabCell.data("year", item.year);
                tabCell.data("date", item.date);

                //当前日历是今天
                if (nowDate == item.date) {
                    tabCell.addClass("today").addClass("onCheck");
                }

                //显示节假日放假安排
                var holidayEl = tabCell.find(".j_div_more").attr("id", "div_more_" + item.date).parent();
                switch (item.holidayType) {
                    case holidayTypes.restday:
                        holidayEl.append(self.template.restDay);
                        break;
                    case holidayTypes.workday:
                        holidayEl.append(self.template.workDay);
                        break;
                }

                //显示日期、节日、节气信息
                var text = item.festival || item.lunarMonth || item.lunarText;
                var lunarEl = tabCell.find("#lunar").html(text);
                var dayTextEl = tabCell.find(".date > b");
                dayTextEl.html(item.day)
                //产品要求,节日颜色突出显示
                if (item.festival && !(item.isLast || item.isNext)) {//张总要求说:啪啦啪啦啪啦啪啦啪啦...我说:好
                    lunarEl.addClass("color_vacation");
                    dayTextEl.addClass("color_vacation");
                }

                //不是当月的活动日期显示样式需要暗淡一点
                if (item.isLast || item.isNext) {
                    dayTextEl.addClass("lastGray");
                }

            });

        },

        /**
         *  初始化页面数据
        **/
        fillData: function () {
            var self = this;
            //var waitEl = $("#divWaiting").removeClass("hide");
            top.M139.UI.TipMessage.show(self.messages.LOADING);
            var hasData = false;

            //先清空掉视图上的所有活动
            self.clear();

            self.model.fetch(function (data) {

                if (data && data.length > 0) {
                    $.each(data, function (index, item) {
                        //要处理这里的活动项，是当天全部的项，而列表只显示3项
                        var activities = item.activities;
                        var showCount = self.model.get("showCount");
                        if (activities.length > showCount) {
                            activities = _.first(item.activities, showCount);
                        }

                        if (activities.length == 0)
                            return true;

                        $.each(activities, function (_index, _item) {
                            var icontype = "";
                            var txtColor = "";

                            _item.visible = 'none';
                            if (_item.enable == 1) {
                                icontype = self.master.CONST.activilyIconType.clock;
                            }

                            //只有是被邀请的未处理的活动才显示消息ICON
                            if (_item.isInvitedCalendar && _item.status == 0) {
                                _item.visible = 'block';
                                if (_item.specialType == self.master.CONST.specialType.birth) {

                                    txtColor = self.master.CONST.activilyTxtColor.blackColor;
                                }
                            }
                                //该条是生日活动
                            else if (_item.specialType == self.master.CONST.specialType.birth) {
                                //生日提醒不显示闹钟
                                icontype = "";
                                txtColor = self.master.CONST.activilyTxtColor.blackColor;

                            } else if (_item.operationFlag) {

                                icontype = self.master.CONST.activilyIconType[_item.operationFlag];
                                txtColor = self.master.CONST.activilyTxtColor.blackColor;
                            }

                            _item.icon = icontype;
                            _item.date = item.date;
                            _item.forecolor = txtColor;
                            _item.backColor = _item.color;

                            if (_item.backColor) {
                                var className = self.master.CONST.activilyColors[_item.backColor] || "";
                                _item.className = className;
                                if (className) {
                                    _item.backColor = "";
                                }
                            }

                            //获取活动类型
                            var type = "";
                            if (_item.isInvitedCalendar) {
                                type = self.master.CONST.activityType.invited;

                            } else if (_item.isSharedCalendar) {
                                type = self.master.CONST.activityType.shared;

                            } else if (_item.isSubCalendar) {
                                type = self.master.CONST.activityType.subscribed;
                            } else {  //自己的活动
                                type = self.master.CONST.activityType.myself;
                            }

                            _item.scheduleType = type;
                        });


                        //添加活动至视图上
                        var cell = self.tabCells.eq(index);
                        var template = _.template(self.template.activily);
                        cell.find('#ul_action').html(template(activities));
                        cell.find('.titleFr').children('a').remove();
                        if (item.activities.isMore) {
                            cell.find('.titleFr').prepend($T.format(self.template.hasmore, {
                                date: item.date,
                                day: item.day,
                                month: item.month,
                                year: item.year,
                                total: item.activities.total
                            }));
                        }
                    });

                }

                //隐藏加载中提示
                //waitEl.addClass("hide");
                top.M139.UI.TipMessage.hide();
                //自适应月视图高度
                self.adjustHeight();

            }, function (e) {
                //隐藏加载中提示
                //waitEl.addClass("hide");
                top.M139.UI.TipMessage.hide();
                if (e && e.code == "FS_SESSION_ERROR") {
                    //会话过期
                    top.$App.trigger("change:sessionOut", {}, true);
                }
                top.M139.UI.TipMessage.show(self.model.TIPS.OPERATE_ERROR, {
                    delay: 5000,
                    className: "msgRed"
                });

                self.logger.error(self.model.TIPS.LOAD_DATA_ERROR, e);
            });
        },

        /**
         *  选中指定日期
        **/
        checkDay: function (args) {

            var self = this;
            var chkclass = "onCheck";
            var hoverclass = "onHover";
            var cellEl = args && args.el ? args.el : null;

            if (!cellEl) {
                var date = new Date(self.master.get("year"),
                    self.master.get("month") - 1,
                    self.master.get("day"));
                cellEl = $("#div_more_" + $Date.format("yyyy-MM-dd", date)).parent().parent();
            }
            self.container.find("td." + chkclass).removeClass(chkclass);
            cellEl.removeClass(hoverclass).addClass(chkclass);
        },

        /**
         * 显示天气提醒
         */
        showWeather: function () {
            var self = this;
            var data = {
                isShowWeather: false,
                days: []
            };
            //SiteConfig.hideWeather=true时不显示,可以方便清理config.js中的配置
            if (!window.ISOPEN_CAIYUN) {
                var now = self.master.capi.getCurrentServerTime();
                var mCalendar = self.model.get("mCalendar");
                var serverYear = now.getFullYear(),
                    serverMonth = now.getMonth(),
                    serverDay = now.getDate();

                //只显示3天天气预报
                for (var i = 0; i < 3; i++) {
                    var day = new Date(serverYear, serverMonth, serverDay + i);
                    //if (day.getFullYear() == mCalendar.year && (day.getMonth() + 1) == mCalendar.month) {
                    //计算跨月的日期
                    var tmpDate = new Date(serverYear, serverMonth, serverDay + i);
                    data.days.push({
                        c: self.model.getDayIndex(tmpDate),
                        i: i
                    });
                    data.isShowWeather = true;
                    //}
                }
            }
            //加载天气预报信息tab_calendar_Container
            self.tabCells.find('.titleFr').children('i').remove();
            if (data.isShowWeather) {
                $.each(data.days, function (i, e) {
                    var offset = e.c;
                    if (offset < 0) return; //匹配不到会返回-1

                    var bar = self.tabCells.eq(offset).find('.titleFr');
                    bar.children('i').remove();

                    bar.append($T.format(self.template.weather, {
                        target: "daycell_" + offset, //用于插入天气详情元素
                        index: e.i
                    }));
                });
                new M2012.Calendar.View.Weather({ master: self.master });
            }
        },

        /**
       * 清空视图中的活动
       */
        clear: function () {
            //移除活动
            $("li[name='view-activily-items']").remove();
            //移除更多标记
            $("a[name='view-activily-more']").remove();
            //隐藏更多活动弹出层, id以"div_more_"开头的div, 修复IE6中弹出层不会隐藏的问题
            $('div[id^=div_more_]').empty();
        },

        template: {
            // 活动信息模板
            activily: ['<% _.each(obj, function(i){ %>',
                 '<li name="view-activily-items" class="<%= i.className %>" style="background-color:<%= i.backColor %>;cursor: pointer; " data-cmd="showschedule" data-type="<%= i.scheduleType %>" data-id="<%= i.seqNo %>" data-date="<%= i.date %>">',
                     '<a href="javascript:void(0);" title="<%= _.escape(i.title) %>" style="color:<%= i.forecolor %>" data-cmd="showschedule" data-type="<%= i.scheduleType %>" data-id="<%= i.seqNo %>" data-date="<%= i.date %>">',
                        '<i class="<%= i.icon %> IconPosion"></i><%= _.escape(i.title) %><%= i.specialType == 1 ? "生日":"" %>',
                    '</a>',
                    '<a style="display:<%= i.visible %>;" data-cmd="showschedule" data-type="<%= i.scheduleType %>" data-id="<%= i.seqNo %>" data-date="<%= i.date %>" class="noteMessage" href="javascript:void(0);"><i class="i_message"></i></a>',
                 '</li>',
             '<% }) %>'].join(""),

            // 查看更多活动
            hasmore: '<a href="javascript:void(0);" name="view-activily-more" class="grN" title="查看更多" data-cmd="showmore" data-date="{date}" data-day="{day}" data-month="{month}" data-year="{item.year}" >{total}</a>',

            // 天气预报
            weather: '<i style="display:none;" rel="{index}" after-item="{target}" tag-for="weather"></i>',

            //休息日,调休日,不写成css的类选择器了.拼接更耗性能
            restDay: '<span class="i_c_vacation"></span>',
            workDay: '<span class="i_c_work"></span>'
        }

    }));


})(jQuery, _, M139, window._top || window.top);
﻿;(function ($, _, M139, top) {

    var superClass = M139.Model.ModelBase;
    var _class = "M2012.Calendar.Model.Weather";

    M139.namespace(_class, superClass.extend({

        name: _class,

        EVENTS: {
            LOAD_WEATHER_ERROR: "获取天气信息失败，请稍后再试！"
        },

        logger: new M139.Logger({ name: _class }),

        defaults: {
            master: null
        },
        initialize: function (args) {

            args = args || {};
            this.master = args.master;

        },

        //获取天气预报信息
        getDefaultWeather: function (fnSuccess, fnError) {

            var self = this;
            self.master.trigger(self.master.EVENTS.REQUIRE_API, {

                success: function (api) {

                    api.getDefaultWeather({
                        data: {},
                        success: function (result) {
                            if (result.code == "S_OK") {
                                fnSuccess && fnSuccess(result["var"]);

                            } else {
                                var msg = self.EVENTS.LOAD_WEATHER_ERROR;

                                fnError && fnError(msg);
                                self.logger.error(msg, result);
                            }
                        },
                        error: function (e) {

                            fnError && fnError(self.EVENTS.LOAD_WEATHER_ERROR);
                        }
                    });
                }

            });
        
        }
    }));


})(jQuery, _, M139, window._top || window.top);
﻿; (function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.Weather";

    M139.namespace(_class, superClass.extend({
        STATUS: {
            SUCCESS: "S_OK"
        },

        initialize: function (options) {

            var _this = this;
            options = options || {};

            _this.master = options.master;
            _this.model = new M2012.Calendar.Model.Weather({
                master: _this.master
            });

            _this.initEvents();
            _this.render();
        },
        initEvents: function () {
            var _this = this;
            $(_this.elements).unbind("mouseover mouseout")
                .bind("mouseover", function (event) {
                    if (event.target.tagName.toLowerCase() == "i" && !!($(event.target).attr("tag-for"))) {
                        _this.onCommand(event);
                    }
                }).bind("mouseout", function (event) {
                    _this.hideWeatherDetail();
                });
        },
        render: function () {
            var _this = this;
            if (!$(_this.elements)) return;

            if (window.weatherData) {
                _this.showWeather(window.weatherData);
            } else {
                _this.model.getDefaultWeather(function (data) {
                    window && (window.weatherData = data);
                    _this.showWeather(data);
                })
            }
        },

        showWeather: function (data) {
            var _this = this;
            if (data) {
                var weathers = data.weather;
                if (weathers && weathers.length > 0) {
                    for (var i = 0, len = weathers.length; i < len; i++) {
                        var weatherInfo = weathers[i];
                        if (weatherInfo.pic0) {
                            var item = $(_this.elements + "[rel='" + i + "']");//$("i[tag-for='weather'][rel='0']")
                            item.addClass(_this.weatherClass + weatherInfo.pic0);
                            item.attr({
                                execCmd: "showWeatherDetail",
                                date: weatherInfo.date,
                                pic0: weatherInfo.pic0,
                                pic1: weatherInfo.pic1,
                                weather: weatherInfo.weather,
                                temper: weatherInfo.temper,
                                wind: weatherInfo.wind
                            });
                            item.show();
                        }
                    }
                }
            }
        },

        onCommand: function (event) {
            var _this = this;
            var container = $(event.target);
            var data = {
                event: event,
                id: _this.weatherTipsName,
                target: container,
                index: container.attr("rel"),
                after: container.attr("after-item"),
                date: container.attr("date"),
                pic0: container.attr("pic0"),
                pic1: container.attr("pic1"),
                weather: container.attr("weather"),
                temper: container.attr("temper"),
                wind: container.attr("wind")
            };
            var command = _this[container.attr("execcmd")];
            command && command(data, _this);
        },

        showWeatherDetail: function (data, _this) {
            _this.hideWeatherDetail();

            var template = _this.template.weatherTips;
            var afterItem = $("#" + data.after).find('#ul_action');
            afterItem.after($T.format(template, data));

            //计算一下箭头位置
            var div = $("#" + _this.weatherTipsName);
            var divHeight = div.outerHeight(),
                winHeight = $(document.body).height() - 45,//去掉toolbar的高度
                offset = data.target.offset().top;
            var className = "tips_top",
                top = 0;
            if (offset + divHeight > winHeight && offset >= divHeight) {
                var heightMod = (data.index == 0) ? 0 : 4; //今天的边框有4px的位移.
                className = "tips_bottom";
                top = top - (divHeight + 10 + heightMod);
                div.css("top", top);
            }
            div.closest("td").addClass("onMousOver"); //
            div.find("span").addClass(className);
            div.show();
        },
        hideWeatherDetail: function () {
            var item = $("#" + this.weatherTipsName);
            item.closest("td").removeClass("onMousOver");
            item.remove();
        },

        elements: "i[tag-for='weather']",
        weatherTipsName: "calendar_month_weather_detail",
        weatherClass: "weaBig",

        template: {
            weatherTips: ['<div id="{id}" class="weathertips" style="display:none;z-index:99;">',
                            '<h2>{date}</h2>',
                            '<p>{temper}</p>',
                            '<p>{weather}</p>',
                            '<p>{wind}</p>',
                            '<i class="wea{pic0}"></i>',
                            '<span class="diomTips"></span>',
                        '</div>'].join("")
        }
    }

        ));

})(jQuery, _, M139, window._top || window.top);

(function ($, _, M139, top) {

    var className = "M2012.Calendar.View.MainView";

    /**
     * 日历月/列表等三大视图
    **/
    M139.namespace(className, Backbone.View.extend({

        name: className,
        el: "#viewpage_main",
        logger: new M139.Logger({ name: className }),

        /**
         * 添加一个视图，需要在这里注册包地址，并且在视图包中自启动并，监听 VIEW_CREATED, 完成视图填充后回调 args.onshow();
         */
        viewmap: {
            day: { url: '/calendar/cal_index_dayview_async.html.pack.js' },
            list: { url: '/calendar/cal_index_listview_async.html.pack.js' },
            timeline: { url: '/calendar/cal_view_timeline.html.pack.js' }
        },

        /**
         * 构造函数      
        **/
        initialize: function (options) {
            Backbone.View.prototype.initialize.apply(this, arguments);

            var self = this;

            //控制器
            self.master = options.master;
            self.initEvents(self.master);

            //先拉起月视图
            var monthdiv = self.$el.find("#subview_content_month");
            $.extend(options, {
                container: monthdiv
            });
            self.views = new Backbone.Collection();
            self.monthView = new M2012.Calendar.View.Month(options);
            self.createView({
                view: "month"
            }, monthdiv);
            self.toolView = new M2012.Calendar.View.TopNaviBar(options);

            return self;
        },


        initEvents: function (master) {
            var self = this;
            var EVENTS = master.EVENTS;

            //监听日历标签加载初始化后，刷新月视图，可以用于添加日历标签后，刷新主视图
            master.on(EVENTS.LABEL_INIT, function () {
                master.off(EVENTS.LABEL_INIT, arguments.callee);
                var dat = master.toJSON();
                var viewflag = dat.view_range_flag;
                //刷新日视图
                if (dat.view_range_flag == "month") {
                    self.master.trigger(self.master.EVENTS.NAVIGATE, {
                        path: "mainview/month"
                    });
                }
            });

            //响应视图显示逻辑
            master.on(EVENTS.VIEW_SHOW, function (viewInfo) { //{ name: name, container: viewObj, args: args });
                if (viewInfo.name === 'main') {
                    //self.logger.debug('mainview showing...', viewInfo);
                    var subview = viewInfo.args.subview;

                    var model = self.master.toJSON();
                    var param = {
                        view: subview, // month|day|list
                        year: model.year,
                        month: model.month,
                        day: model.day
                    };

                    // lichao修改,如果设置了view_range_flag属性,则表示进入了主视图界面
                    self.master.set("view_location", { isMainView: true, view: subview }); // 为true表示是当前页面是主视图
                    //更新视图（日月表）控制量
                    self.master.set({ view_range_flag: subview });

                    if (viewInfo.status === "change:args" || viewInfo.status === "change:visible") {
                        self.master.trigger('mainview:change', param);
                    }
                }
            });

            //主视图切换处理函数 args.view: "month" | "day" | "list"
            master.on('mainview:change', function (args) {

                //从视图缓存集中获取视图，如果没有则异步加载
                var viewInfo = self.views.get(args.view);

                if (viewInfo) {
                    self.render(args);

                } else {
                    var url = self.viewmap[args.view].url;
                    var loadArgs = {
                        id: "mainview_" + args.view + "_pack",
                        src: top.getDomain('resource') + '/m2012/js/packs' + url + '?sid=' + top.sid
                    };
                    M139.core.utilCreateScriptTag(loadArgs, function () {
                        var el = $('<div id="subview_content_'
                            + args.view + '" class="ad-list-div js_subviewpage"></div>');
                        $('#viewpage_main').append(el);

                        self.createView(args, el);
                    });
                }
            });
        },

        createView: function (args, container) {
            var self = this;
            var master = self.master;
            var EVENTS = master.EVENTS;
            master.trigger(EVENTS.VIEW_CREATED, {
                name: args.view,
                container: container,
                params: {},
                onshow: function (showargs) {
                    var newView = new Backbone.Model({
                        id: args.view,
                        instance: self.monthView,
                        visible: true,
                        container: container
                    });
                    self.views.add(newView);
                    self.render(args);
                }
            });

            master.trigger(EVENTS.VIEW_SHOW, {
                name: "mainview",
                container: container,
                args: { subview: args.view }
            });
        },



        //呈现视图
        render: function (args) {
            var self = this;
            //self.logger.debug(args);
            self.views.each(function (i) {
                i.set({ visible: false });
                i.get('container').hide();
            });

            var currView = self.views.get(args.view);
            currView.get('container').show();
            //self.logger.debug(args.view, '视图切换中');
        }
    }));

    $(function () {
        window.$Cal.mainview = new M2012.Calendar.View.MainView({
            master: window.$Cal
        });
    });

}(jQuery, _, M139, window._top || window.top));

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

(function (jQuery, _, M139, top) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase,
        commonAPI = new M2012.Calendar.CommonAPI(),
        _class = "M2012.Calendar.View.DateTimePicker2";
    //不具公用性,暂时先叫DateTimePicker2
    M139.namespace(_class, superClass.extend({
        template: {
            MAIN: ['<div class="element">',
                        '<div id="{cid}_tips" data-type="tips" class="tips meet-tips" style="display:none;">',
                            '<div class="tips-text">开始时间不能晚于结束时间</div>',
                            '<div class="tipsBottom diamond" style="left:10px;"></div>',
                        '</div>',
                        '<div id="{cid}_date" class="dropDown fl" style="width:124px;">',//为了正确显示闰xx月，长度加大
                            //'<div class="dropDownA" href="javascript:void(0)">',
                            //    '<i class="i_triangle_d"></i>',
                            //'</div>',
                            '<div id="{cid}_date_text" class="dropDownText" style="text-align:center; padding-left: 0px;">{date}</div>',
                        '</div>',
                        '<div id="{cid}_time" class="fl" style="width:80px;">',
                            //'<div class="dropDownA" href="javascript:void(0)">',
                            //    '<i class="i_triangle_d"></i>',
                            //'</div>',
                            //'<div id="{cid}_time_text" class="dropDownText">{time}</div>',
                        '</div>',
                    '</div>'].join(""),

            TIPS: "开始时间不能晚于结束时间"
        },
        configs: {
            calendarTypes: {
                calendar: 10, //公历
                lunar: 20 //农历
            }
        },

        /**
         * 时间组件，只能选择一个时间
         * new M2012.Calendar.UI.DateTimePicker2.View({
         *     target:$("#id"),
         *     offset:1, //通过after计算后的第一个时间的选项11:15-->12:30
         *     date:new Date(2014,0,1), //2014-01-01 00:00:00 ,
         *     fullday:true, //全天，不显示时间
         *     lunar:true, //农历
         *     onSelected:function(item){
         *         console.log(item); //{date:"2014-01-02",time:"08:00",datetime:date} //date为一个Date对象
         *     }
         * });
         */
        initialize: function (options) {
            var _this = this;

            _this.options = options || {};
            _this.target = options.container || options.target;
            _this.offset = $.isNumeric(options.offset) ? options.offset : 0;
            _this.onSelected = options.onSelected;
            var date = options.date || new Date();

            _this.model = new Backbone.Model();
            _this.model.set({
                "date": date,
                "fullday": options.fullday || false,
                "lunar": options.lunar || false
            });

            _this.render();
            _this.initEvents();
        },
        render: function () {
            var _this = this;

            var html = $T.format(_this.template.MAIN, {
                cid: _this.cid,
                date: '',
                time: ''
            });

            _this.target.html(html);
        },
        initEvents: function () {
            var _this = this;
            var model = _this.model;
            var date = _this.model.get("date");
            var $container = _this.target;

            //一堆容器
            _this.dateContainer = $container.find(_this.getSelector("_date"));
            _this.dateText = $container.find(_this.getSelector("_date_text"));
            _this.timeContainer = $container.find(_this.getSelector("_time"));
            _this.timeText = $container.find(_this.getSelector("_time_text"));
            _this.tips = $container.find(_this.getSelector("_tips"));

            _this.dateContainer.bind("click", function () {
                _this.dateText.css({
                    "background-color": "#2757EC", //不调用新组件,不会用
                    "color": "#fff"
                });
            });

            $(document.body).click(function () {
                _this.dateText && _this.dateText.css({
                    "background-color": "",
                    "color": ""
                })
            });

            //日期选择
            _this.datePicker = new M2012.Calendar.CalendarView({
                date2StringPattern: 'yyyy-MM-dd',
                id: this.cid + '_date',
                year: date.getFullYear(),
                month: date.getMonth(),
                day: date.getDay(),
                callback: function (date) {
                    _this.onDateSelect(date);
                    $(document.body).trigger("click");
                }
            });

            //时间选择
            //var timeItems = _this.getTimeItems();
            //_this.timeContainer.on("click", function () {
            //    M2012.UI.PopMenu.create({
            //        maxHeight: 150,
            //        width: _this.timeContainer.width(), //去掉padding的2px
            //        items: timeItems.data,
            //        dockElement: _this.timeContainer,
            //        //customClass: "menuPop-sd",
            //        onItemClick: function (item) {
            //            _this.onTimeSelect(item);
            //        }
            //    });
            //});

            _this.timeSelector = new M2012.Calendar.View.TimeSelector({
                container: _this.timeContainer,
                onChange: function (data) {
                    _this.onTimeSelect(data);
                }
            });

            //#region 事件监听

            model.on("change:date", function () {
                var str = model.get("date");
                var isLunar = model.get("lunar");

                //计算农历
                var dateObj = model.get("dateObj");
                var tmp = new Date(dateObj.date.getTime());
                var obj = commonAPI.createDateObj(tmp);
                //保存农历的日期
                _this.model.set("lunarDate", {
                    isLeap: obj.isLeap,
                    year: obj.lYear,
                    month: obj.lMonth,
                    day: obj.lDay
                });

                if (isLunar) {
                    //显示农历字符串
                    //var lunarMonth = (obj.isLeap ? "闰" : "") + obj.cMonth; //是否闰月
                    //str = obj.lYear + "年" + lunarMonth + obj.cDay; //2013年腊月十五

                    //非常奇怪.突然又有了"闰"字
                    str = obj.lYear + "年" + obj.cMonth + obj.cDay; //2014年闰九月十五
                }
                _this.dateText.html(str);
            }).on("change:time", function () {
                var item = model.get("time");
                _this.timeText.html(item.text);
            }).on("change:lunar", function () {
                model.trigger("change:date");
            });

            if (_this.onSelected) {
                //有回调才监听
                model.on("onselect", function () {
                    _this.onSelected(_this.getData());
                });
            }

            //初始化
            var initDate = _this.getClosestDate(date);
            _this.onDateSelect(initDate.datetime, { silent: true });
            _this.timeSelector.setData({ hour: initDate.hour, minute: initDate.minute });
            setTimeout(function () {
                model.trigger("onselect"); //通知到主view
            }, 0xff);
            //#endregion
        },
        getSelector: function (id) {
            return "#" + this.cid + id;
        },
        getElement: function (id) {
            return this.target.find(this.getSelector(id));
        },
        getTimeItems: function () {
            var _this = this;

            var itemList = [], itemMap = {};
            var minutes = [0, 15, 30, 45]; //只可选择15分钟的间隔
            var len = minutes.length;
            for (var i = 0; i < 24; i++) {
                for (var j = 0; j < len; j++) {
                    var minute = minutes[j];
                    var text = _this.padding(i) + ":" + _this.padding(minute); //10:30
                    var item = {
                        text: text,
                        data: {
                            str: text.replace(":", ""), //1030 这样的字符串
                            hour: i,
                            minute: minute
                        }
                    };
                    itemMap[text] = item;
                    itemList.push(item);
                }
            }

            return {
                data: itemList,
                dataMap: itemMap //用来根据00:00获取到对应的对象
            };
        },
        getClosestDate: function (date) {
            /** 
             * 用来计算最近的一个可以选择的时间点
             * var date1=new Date(2013,11,25,12,01,00); //2013-12-25 12:01:00
             * getClosestTime(date1); //{date:"2013-12-25",time:"13:00",date:date1}
             *
             * var date2=new Date(2013,11,25,23,45,00); //2013-12-25 23:45:00
             * getClosestTime(date2); //{date:"2013-12-26",time:"00:30",date:date2}
             */
            var _this = this;
            date = date || new Date();

            var iMinute = (date.getMinutes() + 30) / 60; //默认往后计算30分钟
            var hour = date.getHours() + Math.ceil(iMinute);
            var minute = ((iMinute * 10) % 10) > 5 ? 0 : 30;
            if (_this.offset) minute += parseInt(_this.offset) * 30;
            date.setHours(hour);
            date.setMinutes(minute);

            var hour = _this.padding(date.getHours()),
                minute = _this.padding(date.getMinutes());

            return {
                date: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
                time: hour + ":" + minute,
                hour: hour,
                minute: minute,
                datetime: date
            };
        },
        padding: function (n, m) {
            //补位
            var len = (m || 2) - (1 + Math.floor(Math.log(n | 1) / Math.LN10 + 10e-16));
            return new Array(len + 1).join("0") + n;
        },
        onDateSelect: function (date, options) {
            var model = this.model;
            model.set("dateObj", {
                year: date.getFullYear(),
                month: date.getMonth(),
                day: date.getDate(),
                date: new Date(date.getTime())
            });
            model.set("date", M139.Date.format("yyyy-MM-dd", date));

            if (!options || !(options.silent == true)) {
                model.trigger("onselect"); //触发选择回调
            }
        },
        onTimeSelect: function (item, options) {
            var model = this.model;
            model.set("time", item);

            if (!options || !(options.silent == true)) {
                model.trigger("onselect"); //触发选择回调
            }
        },
        setType: function (options) {
            //是否全天时间,目前在用的options.fullday:false
            var _this = this;
            options = options || {};

            if ($.type(options.fullday) == 'boolean') {
                if (options.fullday == true) {
                    _this.timeContainer.hide();
                } else {
                    _this.timeContainer.show();
                }
                _this.model.set("fullday", options.fullday);
            }

            if ($.type(options.lunar) == 'boolean') {
                _this.model.set("lunar", options.lunar);//会转向触发change:date事件
            }
        },
        getData: function () {
            var model = this.model;
            var calTypes = this.configs.calendarTypes;
            var datestr = model.get("date"),
                dateObj = model.get("dateObj"),
                time = model.get("time"),
                lunar=model.get("lunarDate");
            var calendarType = model.get("lunar") ? calTypes.lunar : calTypes.calendar; //农历还是公历
            var sdatetime = datestr + " " + time.text + ":00";
            
            return {
                calendarType: calendarType, //int,20
                date: datestr,//string,2013-12-31
                time: time.text.replace(":", ""),//string,1030
                datetime: M139.Date.parse(sdatetime), //Date,之前的时间不对
                lunar: lunar, //object:{year:xxx,month:xxx,day:xxx}
                sdatetime: sdatetime //s表示string  2013-12-31 03:34:00
            };
        },
        showTip: function () {
            var _this = this;
            _this.tips.show();

            setTimeout(function () {
                _this.hideTip();
            }, 3000);
        },
        hideTip: function () {
            this.tips.hide();
        }
    }));
})(jQuery, _, M139, window._top || window.top);
﻿
; (function (jQuery, _, M139, top) {
    var $ = jQuery;
    var interval,
        commonAPI = new M2012.Calendar.CommonAPI();

    M139.namespace("M2012.Calendar.Popup.Model.Countdown", Backbone.Model.extend({
        defaults: {
            defaultParams: {
                sendInterval: 0,
                comeFrom: 0,
                week: "0000000",
                specialType : 3,  // 倒数日标记
                calendarType : 10, // 默认为农历
                labelId : 10  // 活动默认属于"我的日历"
            }
        },
        initialize: function (options) {
            this.master = options.master;
        },
        getCurrentServerTime : function () {
            // 实时获取服务器的当前系统时间
            return M2012.Calendar.CommonAPI.getCurrentServerTime();
        },
        clearTimeout : function () {
            // 退出界面时清除定时器
            M2012.Calendar.CommonAPI.clearTimeout();
        },
        calculateCountdown : function(datetime, callback) {
            // 改变设置时间时,倒计时时间也应该改变
            M2012.Calendar.CommonAPI.calculateCountdown(datetime, callback);
        },
        callAPI: function (funcName, data, fnSuccess, fnError) {
            commonAPI.callAPI({
                data : data,
                fnName : funcName,
                master : this.master
            }, fnSuccess, fnError);
        },
        addCalendar: function (data, fnSuccess, fnError) {
            data = $.extend(data, this.get("defaultParams")); //默认数据
            this.callAPI("addCalendar", data, fnSuccess, fnError);
        },
        transform : function (remindObj) {
            return commonAPI.transform(remindObj);
        },
        /**
         * 根据服务器端返回的异常码从公共API中获取对应的异常信息
         * @param errorCode
         * @returns {*}
         */
        getUnknownExceptionInfo : function (errorCode) {
            return commonAPI.getUnknownExceptionInfo(errorCode);
        }
    }));
})(jQuery, _, M139, window._top || window.top);
﻿
(function (jQuery, _, M139, top) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    //var ScheduleTransform = M2012.CalendarReminder.Schedule.Transform;
    var Constant = M2012.Calendar.Constant;
    var $Utils = M2012.Calendar.CommonAPI.Utils;
    var commonAPI = M2012.Calendar.CommonAPI.getInstance();
    var Validate = M2012.Calendar.View.ValidateTip;
    M139.namespace('M2012.Calendar.Popup.View.Countdown', superClass.extend({
        template: {
            MAIN: [
            '<div class="repeattips-box clearfix">',
                        '<div id="{cid}_titleMaxTip" style="left:20px;top:10px; display: none;" class="tips">',
                            '<div class="tips-text">不能超过100个字</div>',
                            '<div class="tipsBottom  diamond"></div>',
                        '</div>',
                        '<div id="{cid}_titleEmptyTip" style="display: none; top:10px;" class="tips">',
                            '<div class="tips-text">主题不能为空</div>',
                            '<div class="tipsBottom  diamond"></div>',
                        '</div>',
                        '<div class="repeattips-area">',
                            '<textarea id="{cid}_remind_content" class="meetarea gray" style="overflow:auto;">',
                                //'还信用卡还有多少天?发工资还有多少天?离节日放假还有多少天?宝宝出生还有多少天?试下倒数日,给您想要的信息',
                                '即将到来的重要日子...',
                            '</textarea>',
                        '</div>',

                '<div class="pt_10 clearfix">',
                    '<label class="fl numFour" style="height:22px;line-height: 22px;">设置时间：</label>',
                //{cid}_start_time
                    '<div id="{cid}_set_time" class="element"></div>',
                '</div>',
                '<div class="pt_10 repeattips-bottom clearfix">',
                    '<span class="label numFour">距今还有：</span>',
                //{cid}_start_time
                    '<span id="{cid}_count_downtime">',
                    '</span>',
                '</div>  ',
                '<div class="pt_10 repeattips-bottom clearfix">',
                    '<span class="label numFour">提醒：</span>',
                    //{cid}_remind
                    '<div id="{cid}_remind" class="element"> ',
                    '</div>',
                '</div>  ',
                '<div class="pt_10 repeattips-bottom clearfix">',
                    '<div id="{cid}_indentity"></div>',
                '</div>',
                '</div>',
                //{cid}_invite_div
                '<div id="{cid}_invite_div" style="display:none;" class="tips meetform-tips">',
                '<div class="tips-text">',
                '<div class="addpeowidth">',
                '<div class="p_relative" style="z-index:3;">',
                //{cid}_invite_input_container
                '<div id="{cid}_invite_input_container"></div>',
                '</div>',
                //{cid}_select_addr
                '<a id="{cid}_select_addr_link" href="javascript:void(0);" title="选择联系人" class="i_peo"></a>',
                //{cid}_invite_input
                //'<input id="{cid}_invite_input" class="iText" style="width:468px;" type="text" />',
                '</div>',
                //{cid}_invite_list_container
                '<div id="{cid}_invite_list_container"></div>',
                //{cid}_msg_content //使用短信通知参与人，会产生短信费用。
                '<p>',
                '<p>使用短信通知参与人，会产生短信费用。<br>',
                '<span id="{cid}_msg_content"></span>',
                '</p>',
                '</p>',
                '</div>',
                '<div class="tipsTop diamond"></div>',
                '</div>',
                '</div>'].join(""),

            dialogTitle: "倒计时"
        },
        showMaskContent : '<div style="position:absolute; top:0px; height:30px; width:100%; z-index:1000;" class="blackbanner"></div>',
        configs: {
            MAX_TITLE_LEN: 100,
            MAX_COMMENT_LEN: 100,
            MAX_LOCATION_LEN:100,

            ERRORCODE: {
                FILTER_TITLE_RUBBISH: 126,
                FILTER_CONTENT_RUBBISH: 108,
                NEED_IDENTIFY: 910, //需要图片验证码
                FREQUENCY_LIMIT: 911 //频率超限
            },
            MAX_ADDR_SELECT:20
        },
        initialize: function (options) {
            var _this = this;

            _this.options = options || {};
            _this.model = new M2012.Calendar.Popup.Model.Countdown(options);
            _this.master = options.master;
            _this.remindType = options.master.CONST.remindSmsEmailTypes;
            _this.render();
            _this.initEvents();
        },
        render: function () {
            var _this = this;

            var html = $T.format(_this.template.MAIN, {
                cid: _this.cid,
                titleMaxLen: _this.configs.MAX_TITLE_LEN,
                commentMaxLen: _this.configs.MAX_COMMENT_LEN,
                locationMaxLen: _this.configs.MAX_LOCATION_LEN
            });

            _this.dialog = $Msg.showHTML(html, function (e) {
                // 点击确定按钮
                e.cancel = true;

                if (_this.validateTopicContent() &&  _this.validateSetTime()) {
                    var param = _this.wrapParam();

                    // 显示遮罩层
                    $(_this.showMaskContent).insertBefore(_this.dialog.btnEl.children(":first"));
                    _this.model.addCalendar(param, function(detail, json) {
                        if (detail.code == 'FS_UNKNOW') {
                            var info = _this.model.getUnknownExceptionInfo(detail.errorCode);
                            info ? $Msg.alert(info) : _this.error(detail); // 无信息返回,暂时认为要输入验证码
                            _this.dialog.btnEl.children(":first").remove();
                            return;
                        }

                        // 创建成功之后的处理
                        top.M139.UI.TipMessage.show('创建成功', { delay: 3000 });
                        _this.dialog.close();
                        _this.master.capi.addBehavior("calendar_addcountdownact_success"); // 行为日志ID
                        _this.master.trigger(_this.master.EVENTS.NAVIGATE, { path: "view/update" });
                    }, function (json){
                        top.M139.UI.TipMessage.show('创建失败', { delay: 3000 });
                        _this.dialog.btnEl.children(":first").remove();
                    });
                }
            },
            {
                name:"popup_countdown_view",
                width: "550px",
                dialogTitle: _this.template.dialogTitle,
                buttons: ['保存', '取消'],
                onClose: function () {
                    // 关闭"弹出窗"窗口时需要清除定时器
                    _this.model.clearTimeout();
                    // TODO 此处dialog中的任务元素都可以,但不能是$(document),不然在IE下会有问题
                    // TODO 关联JS,m139.out.dom.js中的bindAutoHide方法
                    $(_this.dialog.el).click();
                }
            });
        },
        initEvents: function () {
            var _this = this;
            var options = _this.options;
            var dialog = _this.dialog;
            var $dialogEl = dialog.$el;

            // 保存dom节点
            dialog.setTimeContainer = $dialogEl.find(_this.getSelector("_set_time"));
            dialog.countdowntimeDiv = $dialogEl.find(_this.getSelector("_count_downtime"));
            dialog.remindContainer = $dialogEl.find(_this.getSelector("_remind"));
            dialog.indentityContainer = $dialogEl.find(_this.getSelector("_indentity"));
            dialog.remindContentDom = $dialogEl.find(_this.getSelector("_remind_content"));
            dialog.titleMaxTip = $dialogEl.find(_this.getSelector("_titleMaxTip"));
            dialog.titleEmptyTip = $dialogEl.find(_this.getSelector("_titleEmptyTip"));
            dialog.btnEl = $dialogEl.find("div .boxIframeBtn").css("position", "relative");

            // 动态显示倒计时时间
            _this.callback = function (param) {
                // 没有过期
                if (!param.expired) {
                    var content = "",
                        days = param.days,
                        hours = param.hours,
                        minutes = param.minutes;

                    if (days > 0) {
                        content = days + "天 ";
                    }

                    if (hours >  0) {
                        content = content + hours + "时 ";
                    }

                    content = content + minutes + "分";
                    dialog.countdowntimeDiv.html(content);
                }
            };

            _this.initial = true; // 表示是否是第一次打开窗口

            // 创建新的时间选择控件
            this.setDateTime = new M2012.Calendar.View.DaytimePicker({
                master: _this.master,
                container: dialog.setTimeContainer,
                onChange: function (obj) {
                    _this.model.set("setTimeObj", obj);
                    // 首次打开"倒计时"弹出窗口时需调用
                    if (_this.initial) {
                        _this.updateCountdown();
                    }
                }
            });

            // 调整设置时间的高度
            dialog.setTimeContainer.children().css({
                height: Constant.Common_Config.Shortcut_setTime_Height,
                lineHeight : Constant.Common_Config.Shortcut_setTime_Height
            }).find("input").addClass("mt_0");

            // 设置时间改变, 倒计时时间也相应改变, 且需重新设置initial值
            _this.model.on("change:setTimeObj", function () {
                _this.initial = false;
                _this.model.clearTimeout();
                _this.updateCountdown();
            });

            // 提醒自己
            _this.remind = new M2012.Calendar.View.Reminder({
                container: dialog.remindContainer
            });

            // 去掉提醒控件后的多余节点,只保留"邮件","短信"的下拉框选项
            if (dialog.remindContainer) {
                dialog.remindContainer.children(":first").remove();
                _this.remind.getElement && _this.remind.getElement("remind_type").removeClass("ml_10");
            }

            // 验证码
            _this.identify = new M2012.Calendar.View.Identify({
                wrap: this.cid + '_indentity',
                name: 'indentity',
                titleName: '验证码'
            });

            // 提醒主题添加"focus"事件
            dialog.remindContentDom.on("focus", function() {
                _this.dialog.titleEmptyTip.hide();
                if ($(this).val() === this.defaultValue) {
                    $(this).val("");
                }
            });

            // 提醒主题添加"blur"事件
            dialog.remindContentDom.on("blur", function(){
                if ($(this).val() === '') {
                    $(this).val(this.defaultValue);
                }
            });

            // 验证不超过100个字符
            dialog.remindContentDom.bind("keyup keydown change",function(){
                var dialog = _this.dialog;
                var remindContentDomValue = dialog.remindContentDom.val(),
                    contentLen = remindContentDomValue.length;

                if(contentLen > 100){
                    dialog.titleMaxTip.show();
                    dialog.remindContentDom.val(remindContentDomValue.substr(0, 100));
                    M139.Dom.flashElement(dialog.remindContentDom.selector);
                }
        });

            // 修改问题单号1988,保持提示信息风格统一
            $(document).bind('click', function(){
                _this.dialog.titleMaxTip.hide();
                _this.dialog.titleEmptyTip.hide();
            });

            try {
                // 至少看到标题栏，这样起码可以关掉弹窗
                setTimeout(function () {
                    var top = parseInt($dialogEl.css("top"));
                    if (top < 0) {
                        $dialogEl.css("top", 5);
                    }
                }, 150);
            } catch (e) { }
        },
        validateTopicContent : function () {
            var dialog = this.dialog;
            var remindContentDomValue = $.trim(dialog.remindContentDom.val());
            // 验证主题内容,1: 不为空, 2: 不超过100字符
            if (remindContentDomValue === dialog.remindContentDom.get(0).defaultValue) {
                dialog.titleEmptyTip.show();
                M139.Dom.flashElement(dialog.remindContentDom.selector);
                return false;
            }

            if (remindContentDomValue.length > 100) {
                dialog.titleMaxTip.show();
                M139.Dom.flashElement(dialog.remindContentDom.selector);
                return false;
            }
            return true;
        },
        validateSetTime : function () {
            // 首次打开"倒计时"弹出窗口或直接点击"保存"按钮时不需要进行验证
            if (this.initial) {
                return true;
            }

            // 验证时间,1:设置事件比当前系统时间早, 2:设置事件比当前时间晚5年
            var datetime =  this.model.get("setTimeObj").datetime,
                currentTime = this.model.getCurrentServerTime();
                //tipDom = this.dialog.$el.find(this.setDateTime.getSelector("_tips")),
                //tipContentDom = tipDom.children().first(); // 找到设置时间的tip节点

            // 修改提示信息框的样式,修改问题单号1987
            //tipDom.css({
              //  "margin-top" : "0px",
             //   "top" : "-22px",
              //  "left" : "60px"
           // });

            // 与当前时间对比，是否早于当前时间
            if (currentTime > datetime) {
                Validate.show("时间已过期,不能设置为倒数日", this.dialog.setTimeContainer);
                //M139.Dom.flashElement(this.dialog.setTimeContainer.selector);
                return false;
            }

            // 与当前时间对比,是否超过5年
            if (datetime.getFullYear() - currentTime.getFullYear() > 5) {
               // tipContentDom.html("时间太久远了");
                Validate.show("时间太久远了", this.dialog.setTimeContainer);
                //this.setDateTime.showTip();
                //M139.Dom.flashElement(this.dialog.setTimeContainer.selector);
                return false;
            }

            //this.setDateTime.hideTip();
            return true;
        },
        wrapParam : function () { // 封装需要传递的参数
            var _this = this,
                topic = _this.dialog.remindContentDom.val(),
                setTime = $Date.format("yyyy-MM-dd hh:mm:ss", this.model.get("setTimeObj").datetime),
                remindObj = {
                    beforeType : 0,
                    beforeTime : 0,
                    recMyEmail : _this.remind.model.get("remindType") == _this.remindType.email.value ? 1 : 0,
                    recMySms : _this.remind.model.get("remindType") == _this.remindType.freeSms.value ? 1 : 0,
                    recEmail: _this.master.capi.getUserEmail(),
                    recMobile: _this.master.capi.getUserMobile(),
                    enable : 1
                },
                param = {
                    title : $.trim(topic),
                    content : "",
                    color : "#2757EC",
                    //dateFlag : setTimeObj.date,
                    //endDateFlag: setTimeObj.date,
                    //startTime: setTimeObj.time,
                    //endTime: setTimeObj.time,
                    dtStart : setTime,
                    dtEnd : setTime,
                    validImg : _this.identify.getData() // 验证码
                };
            // 添加提醒设置的属性
            param = $.extend(param, _this.model.transform(remindObj));
            return param;
        },
        // 错误处理 TODO 是否需要传递data参数
        error : function (detail) {
            this.accessIdentify(detail);
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
        },
        updateCountdown : function () {
            if (this.validateSetTime()) {
                // 验证通过,表示设置时间合法
                var obj = this.model.get("setTimeObj");
                if (this.model.calculateCountdown) {
                    this.model.calculateCountdown(obj.datetime, this.callback);
                }
            }
        },
        getSelector: function (id) {
            return "#" + this.cid + id;
        }
    }));
})(jQuery, _, M139, window._top || window.top);

; (function (jQuery, _, M139, top) {
    var commonAPI = new M2012.Calendar.CommonAPI();
    M139.namespace('M2012.Calendar.Popup.Model.Birthday', Backbone.Model.extend({
        defaults: {
            keys: []
        },
        initialize: function (options) {
            this.master = options.master;
        },
        clear: function () {
            var _this = this;
            _this.attributes = _this.defaults;
        },
        /**
         * 调用公共的API接口
         * @param funcName
         * @param data
         * @param fnSuccess
         * @param fnError
         */
        callAPI: function (funcName, data, fnSuccess, fnError) {
            data.comeFrom = 0; // 写死先，后续调用配置
            commonAPI.callAPI({
                data : data,
                fnName : funcName,
                master : this.master
            }, fnSuccess, fnError);
        },
        /**
         * 添加生日活动
         * @param data {Object} 创建生日参数
         * @param fnSuccess
         * @param fnError
         */
        addCalendar: function (data, fnSuccess, fnError) {
            this.callAPI("addCalendar", data, fnSuccess, fnError);
        }
    }));
})(jQuery, _, M139, window._top || window.top);
﻿;(function ($, _, M139, top) {
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

﻿/**
 *左键弹出组件
 */
;(function ($, _, M139, top) {
    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.MenuMgr";

   // CalendarReminder.createClass('MenuMgr', {
    M139.namespace(_class, superClass.extend({

    }, {
        menus: {},
        r: function (name, menu) {

            if (!this.menus[name]) {
                this.menus[name] = menu;
            }

        },
        ur: function (name) {
            if (this.menus[name]) {
                this.menus[name] = null;
            }
        },
        closeExcept: function (cid) {
            var menus = this.menus, cid = null;
            for (var item in menus) {
                if (menus[item].cid !== cid) {
                    menus[item].hide();
                }
            }
        }
    }));


})(jQuery, _, M139, window._top || window.top);
﻿/**
 *左键弹出组件
 */
;(function ($, _, M139, top) {
    var MenuMgr = M2012.Calendar.View.MenuMgr;
    var superClass = M139.View.ViewBase;
    //var superClass = M139.Model.ModelBase;
    var _class = "M2012.Calendar.View.PopMenu";
    var $CUtils = M2012.Calendar.CommonAPI.Utils;
    M139.namespace(_class, superClass.extend({
        _item: ['<li class="{checkClass}" index="{index}">',
            '<a href="javascript:void(0);" index="{index}" isMore="{isMore}" name="{cid}">',
            '<span isMore="{isMore}" index="{index}" class="text" name ="{cid}">{iconHtml}',
            '<span isMore="{isMore}" index="{index}" class="tagText"  name="{cid}" >{text}</span>',
            '</span>{iconMore}',
            '</a>',
            '</li>'].join(''),
        _iconHtml:'<span name="{id}" index="{index}" style="background-color:{bgColor};" class="ad-tagt" ><i index="{index}" class="duig"></i></span>',
        _createItmeHtml:'<span class="ad-tagt"><i class="{scheduleIcon}"></i></span>',
        _lineHtml:'<li class="line"></li>',
        _iconMore:'<i class="i_triangle_h" id="{cid}_more"></i>',
        _template : [ '<div class="menuPop shadow menuPop-sd"  id="{cid}_remindPopMenu" style="z-index:10001;display:none;width:{width};height:{height};{overflow}">',
            '<ul>{items}</ul>',
            '</div>'].join(""),
        initialize: function (options) {

            //元素Id、方便回传
            this.docElementId = options.docElement || null;

            this.docElement = typeof this.docElementId == 'string' ? document.getElementById(this.docElementId) : this.docElementId;

            //数据源
            this.dataSource = options.dataSource || [];

            //回调函数
            this.callback = options.callback || null;

            //长与宽度
            this.width = options.width || '200px';
            this.height = options.height || "";
            this.direction = options.direction || 'auto'; //用于强制显示的方向，提供down和up参数
            this.overflow = options.noflow ? "" : "overflow-y:auto;";
	        this.isHasItemIcon = options.isHasItemIcon || false;

            this.render(this.dataSource);
            this.initEvents();

            MenuMgr.r(this.cid, this);
        },

        render: function (data) {
            var menuItemArray = this.buildMenuItems(data);
            var template = $T.Utils.format(this._template, {
                cid: this.cid, items: menuItemArray.join(""),
                width: this.width, height: this.height, overflow: this.overflow
            });

            $(template).appendTo(document.body);

            this.popEl = $("#" + this.cid + '_remindPopMenu');
        },

        rebuild: function(data) {
            this.dataSource = data;
            var menuItemArray = this.buildMenuItems(data);
            this.popEl.find('ul').html(menuItemArray.join(''));
        },

        buildMenuItems: function (data) {
            var len = data.length;
            var tplCurr,
                buff = [],
                param = {},
                iconHtml = null,
                iconMoreHtml = null,
                tplItem = this._item,
                tplLine = this._lineHtml;

            for (var i = 0 ; i < len; i++) {
                param = $.extend({
                    id: this.cid + "_" + i
                }, data[i]);

                if (param.isSplit) {//分隔线
                    tplCurr = tplLine;
                } else {
                    tplCurr = tplItem;
                }

                if (param.bgColor) {
                    iconHtml = $T.Utils.format(this._iconHtml, {
                        index: i,
                        id: param.id,
                        bgColor: param.bgColor
                    });
                }else if(this.isHasItemIcon){
                    iconHtml = $T.Utils.format(this._createItmeHtml,{
                        scheduleIcon:param.scheduleIcon
                    });
                } else {
                    iconHtml = "";
                }
                iconMoreHtml = param.isMore ? this._iconMore : "";
                iconMoreHtml = $T.Utils.format(iconMoreHtml, { cid: this.cid });
                buff.push($T.Utils.format(tplCurr, $.extend(param, {
                    iconHtml: iconHtml,
                    iconMore: iconMoreHtml,
                    index: i,
                    checkClass: (param.isCheck ? 'sel' : ''),
                    cid: this.cid
                })));
                param = {};
            }

            return buff;
        },

        setDocElementId: function (docElementId) {
            this.docElementId = docElementId;
        },

        getCheckedItems: function () {

            var lis = $(".sel", this.popEl), index = 0;
            var dataSource = [];
            for (var i = 0, len = lis.length; i < len; i++) {

                index = $(lis[i]).attr('index');
                dataSource.push(this.dataSource[index]);
            }
            return dataSource;
        },
        /**
		 * 查看显示位置与浏览器高度，确定向下或向上显示
		 */
        show: function (options) {

            options = options || {};
            isClosed = options.isClosed;
            //关闭其它菜单
            if (!isClosed) {
                MenuMgr.closeExcept(this.cid);
            }
            //点击其它区域关闭菜单
            $CUtils.$Event.stopBubble();
            var left = 0, xtop = 0;
            if (options.left && options.top) {
                left = options.left;
                top = options.top;
            } else {
                //显示当前
                var offset = $(this.docElement).offset();
                xtop = offset.top + $(this.docElement).height() + 1;
                var menuHeight = $(this.popEl).height();
                var menuWidth = $(this.popEl).width();
                left = offset.left + "px";
                var clientWidth = $(document.body).width();
                if (menuWidth < offset.left && offset.left + menuWidth > clientWidth) {
                    left = offset.left - (menuWidth - $(this.docElement).width() - 10); //10px 做微调
                }

                var clientHeight = window.document.body.clientHeight
                //if(menuHeight + xtop > clientHeight){
                //	xtop = xtop - menuHeight - $(this.docElement).height()-10;
                //}

                var xreverse = xtop - menuHeight - $(this.docElement).height() - 10;
                //显示方向,暂时仅提供down和up选项
                var direction = options.direction || this.direction;
                switch (direction) {
                    case 'down':
                        break;
                    case 'up':
                        xtop = xreverse;
                        break;
                    default:
                        if (menuHeight + xtop > clientHeight) {
                            xtop = xreverse;
                        }
                        break;
                }

                xtop += 'px';
                if (!window.ISOPEN_CAIYUN) {
                    var outEl = top.$('#calendar');		//这里不加top无法找到该元素
                    var totalHeight = outEl && outEl.height();
                    var popElH;
                    if(outEl && parseInt(xtop)+menuHeight > totalHeight){   //高度没有超过限制的就不需要加滚动条了
                        popElH = (totalHeight-parseInt(xtop) - 65)+'px';
                        this.popEl.css({ left: left, top: xtop, height:popElH,'overflow-y':'scroll'}).show();
                    }else{
                        this.popEl.css({ left: left, top: xtop}).show();
                    }
                }else{
                    var defaultH = 400; //定义出现滚动条时的高度
                    if(parseInt(xtop)+menuHeight > defaultH){
                        this.popEl.css({ left: left, top: xtop, height:defaultH+'px','overflow-y':'scroll'}).show();
                    }else{
                        this.popEl.css({ left: left, top: xtop, height:'auto'}).show();
                    }
                }


            }

        },
        destroy: function () {

            this.hide();

        },
        setPosition: function (obj) {

            this.popEl.css({ left: obj.left, top: obj.top });
        },

        hide: function () {

            this.popEl.hide();
        },

        /**
		 * 获取数据项
		 */
        getItemDataByIndex: function (index) {


            return this.dataSource[index];

        },

        renderChild: function (el) {

            var index = el.attr("index");
            var id = el.attr("name") + "_more";
            var children = this.getModel().get('children') || [];
            var child = new M2012.Calendar.View.PopMenu({
                docElement: $("#" + id),
                dataSource: this.dataSource[index]['dataSource'],
                noflow: true,
                callback: this.callback.bind(this),
                height: 'auto',
                width: '200px'
            });
            el.attr('cid', child.cid);
            el.attr('render', true);
            children.push({ cid: child.cid, instance: child });
            this.getModel().set('children', children);
        },
        getChild: function (cid) {
            var children = this.getModel().get('children') || [];
            for (var i = 0; i < children.length; i++) {
                if (children[i].cid == cid) {
                    return children[i];
                }
            }
            return null;
        },
        hideAllChild: function () {

            var children = this.getModel().get('children') || [];
            for (var i = 0; i < children.length; i++) {
                children[i].instance.hide();
            }

        },
        getModel : function () {
            if (!this.model) {
                this.model = new Backbone.Model();
            }
            return this.model;
        },
        unbind: function () {
            $(this.docElement).unbind("click");
        },
        initEvents: function () {

            var self = this;

            $(this.docElement).bind('click', function () {
                // 暂时按周月年提醒中使用到该JS
                self.show();
            }).hover(function() {
            },function() {
            });

            $(this.popEl).bind('click', function (e) {

                var index = $(e.target).attr('index');
                var isMore = $(e.target).attr('isMore');

                var data = self.getItemDataByIndex(index);


                if (self.callback) {
                    self.callback(data, self.docElementId, $("ul>li", this)[index]);
                }
                $CUtils.$Event.stopBubble();
                if (data && !data.clickNoHide) { //ul也会有click事件
                    if (!isMore) {
                        self.hide();
                    }
                }


            });

            $(this.popEl).bind('mouseover', function (e) {
                var target = $(e.target);
                var isMore = target.attr('isMore');
                var isRender = target.attr('render');
                var children = self.getModel().get('children') || [];
                if (isMore) {

                    if (!isRender) {
                        self.renderChild(target);
                    }
                    //显示
                    var cid = target.attr('cid');
                    var child = self.getChild(cid);
                    child && child.instance.show({ isClosed: true });

                } else {//隐藏显示的菜单

                    self.hideAllChild();


                }




            });

            $(document).bind('click', function () {
                self.hide();
            });

            $(this.popEl).hover(function() {
            },function(e) {
                self.hide();
            });
        }

    }));
})(jQuery, _, M139, window._top || window.top);
﻿/**
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

﻿;
(function ($, _, M139, top) {

    var superClass = M139.Model.ModelBase,
        _class = "M2012.Calendar.Model.Popup.FastSchedule",
        commonAPI = new M2012.Calendar.CommonAPI();

    M139.namespace(_class, superClass.extend({
        initialize: function (options) {
            this.master = options.master;
        },
        /**
         * @param obj 包括需要传递给接口的参数,回调函数名称,以及master
         * @param fnSuccess
         * @param fnError
         */
        addCalendar : function (obj, fnSuccess, fnError) {
            var param = {
                data : $.extend({ validImg: "", dateDesc: "", calendarType: 11 }, obj)
            };

            $.extend(param, {
                master : this.master,
                fnName : "addCalendar"
            });
            commonAPI.callAPI(param, fnSuccess, fnError);
        },
        /**
         * 根据不同的粒度,记录不同的行为日志
         * @param scheduleTemp 粒度:每年,每月,每周,每日
         */
        addBehaviour : function (scheduleTemp) {
            var templates = M2012.Calendar.Constant.scheduleTempMap;
            if (scheduleTemp  == templates.dayTemp) {
                this.master.capi.addBehavior("calendar_adddayact_success");
            }else if (scheduleTemp  == templates.weekTemp) {
                this.master.capi.addBehavior("calendar_addweekact_success");
            }else if (scheduleTemp  == templates.monthTemp) {
                this.master.capi.addBehavior("calendar_addmonthact_success");
            }else if (scheduleTemp  == templates.yearTemp) {
                this.master.capi.addBehavior("calendar_addyearact_success");
            }
        }
    }));

})(jQuery, _, M139, window._top || window.top);

﻿;(function ($, _, M139, top) {
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
