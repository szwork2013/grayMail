/******************************* **************************************************************
 通讯录头像上传组件
 2014.08.04
 AeroJin 
 ***********************************************************************************************/
;
(function ($, _, M139) {
    M139.namespace("M2012.Addr.ImageUpload", function (options) {
        var _this = this;

        this.image = options.image;
        this.serialId = options.serialId || 0;
        this.callback = options.callback;
        this.upLoadFile = options.upLoadFile;
        this.funName = options.funName || 'myPicture';

        this.TIP = {
			PICUPLOAD_ERROR :"图像格式不符合规范!",
			SUCCESS : "您的头像已保存",
			FIAL : "您的头像保存失败"
        };

        this.init = function() {
            this.ui = {};
            this.ui.body = $('body');
            this.ui.file = this.upLoadFile;
            this.ui.parent = this.ui.file.parent();
            this.ui.form = $('<form id="frmUpload" name="frmUpload" method="post" enctype="multipart/form-data" action="" target="ifrmReturnInfo"></form>');
            this.ui.iframe = $('<iframe id="ifrmReturnInfo" name="ifrmReturnInfo" scrolling="no" height="0" width="0" frameborder="0" src="empty.html"></iframe>');

            this.ui.file.attr('name', 'fileUpload');
            this.ui.form.attr("action", this.getUploadUrl());
            this.ui.body.append(this.ui.form);
            this.ui.body.append(this.ui.iframe);
            this.regEvent();
        };

        this.regEvent = function() {
        	var _this = this;

        	window[this.funName] = function(result) {
        		var code = result.code || "";
				var msg = result.msg || "";
				
				if (code == "S_OK") {
					var url = '{0}?rd={1}'.format(msg, Math.random());	
					var imageUrl = (new top.M2012.Contacts.ContactsInfo({ImageUrl: url})).ImageUrl;
					
					if(_this.image){
						_this.image.attr('src', imageUrl);
					}

					if(_this.callback){
						_this.callback({imagePath: msg, imageUrl: imageUrl});
					}
					
					_this.ui.parent.append(_this.ui.file);
					top.M139.UI.TipMessage.show(_this.TIP.SUCCESS,{ delay : 2000});
				} else {
                    _this.ui.parent.append(_this.ui.file);
					top.M139.UI.TipMessage.show(msg,{ delay : 2000, className: 'msgYellow'});
				}
        	};

        	this.ui.file.change(function(){
        		var fileName = $(this).val();

        		if(_this.check(fileName)){
        			_this.ui.form.append(_this.ui.file);
        			_this.ui.form.submit();
        		}
        	});
        };

        this.check = function(fileName) {
        	if (!/\.(?:jpg|jpeg|gif|png|bmp)$/i.test(fileName)) {
				top.M139.UI.TipMessage.show(this.TIP.PICUPLOAD_ERROR,{delay: 2000, className: 'msgYellow'});
				this.ui.form.reset();
				return false;
			}

			return true;
        };

        //获取上传地址，测试环境与生产环境不同
        this.getUploadUrl = function() {
        	if(!this.url){
	        	var domain = document.domain == "10086.cn" ? top.getDomain("rebuildDomain") : '';
	        	this.url = "{0}/bmail/s?func=contact:uploadImage&sid={1}&serialId={2}&type=1&callback={3}";
	        	this.url = this.url.format(domain, top.sid, this.serialId, this.funName);
	        }

			return this.url;
        };

        this.init();
    });
})(jQuery, _, M139);
﻿;
(function ($, _, M139) {

    var lunardaycache = {};
    var interval;    
    /**
     * 日历常用API
     * @param {} date
     * 对外暴露 M2012.Addr.CommonAPI
     */
    M139.namespace("M2012.Addr.CommonAPI", function (date) {

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

    var CommonAPI = M2012.Addr.CommonAPI;

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
        }       
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
     * 清除定时器(暂时倒计时功能在使用)
     */
    CommonAPI.clearTimeout = function () {
        interval && clearTimeout(interval);
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
    

    //单实例
    var _this = this;
    M2012.Addr.CommonAPI.getInstance = function () {
        if (!_this.commonApi) {
            _this.commonApi = new M2012.Addr.CommonAPI(); //实例化到M139下面,目前所有的类都有显式传入M139
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
})(jQuery, _, M139);

/******************************* **************************************************************
 返回阴历控件 (y年,m+1月)
 
 对外暴露 M2012.Calendar.CalendarInfo
 
 ***********************************************************************************************/
;
(function ($, _, M139) {

    var CommonAPI = new M2012.Addr.CommonAPI();

    M139.namespace("M2012.Addr.CalendarInfo", function (y, m, d, params) {

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

})(jQuery, _, M139);


; (function ($, _, M139) {

    var superClass = M139.View.ViewBase;
    var _class = 'M2012.Addr.View.CalenderChoose';
    var CommonAPI =  M2012.Addr.CommonAPI;

    M139.namespace(_class, function (params) {

        var y = params.year, m = params.month, d = params.day;
        this.enableHistday = params.enableHistday ? params.enableHistday : true; //历史天是否可以选择
        this.elInput = params.button || $("#" + params.id);



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

    M2012.Addr.View.CalenderChoose.prototype = {
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

            $("#__calendarPanel").mouseenter(function(){
                // 鼠标移入处理,handler                
                if(curCalendar.timer){
                    clearTimeout(curCalendar.timer);                    
                }
            });

            
            $("#__calendarPanel").mouseleave(function(){
                // 鼠标移出时关闭弹窗
                if(curCalendar.timer){
                    clearTimeout(curCalendar.timer);                    
                }
                
                curCalendar.timer = setTimeout(function(){ 
                    curCalendar.hide();
                }, 300);                
            });

            /*
            $("#__calendarPanel").hover(function() {
                // 鼠标移入处理,handler
                if(curCalendar.timer){
                    clearTimeout(curCalendar.timer);
                }
            },function() {
               // 鼠标移出时关闭弹窗
                curCalendar.timer = setTimeout(function(){ 
                    //urCalendar.hide(); 
                }, 150);
            });
            */
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

            var oCal = new M2012.Addr.CalendarInfo(this.date.getFullYear(), this.date.getMonth(),
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

})(jQuery, _, M139);
/******************************* **************************************************************
 通讯录联系人详情页, 组控件
 2014.07.22
 AeroJin 
 ***********************************************************************************************/
;
(function ($, _, M139) {
    M139.namespace("M2012.Addr.GroupWidget", function (options) {
       
       var _this = this;
       this.width = options.width;
       this.group = options.group || [];
       this.isTopMenu = options.isTopMenu;
       this.groupMap = this.group.join(',');
       this.container = options.container || $('body');
       this.callback = options.callback || function(){};
       this.onChange = options.onChange || function(){};
       this.onRemove = options.onRemove || function(){};

       this.template = {
            list: '<li class="clearfix" data-value="<%=value%>">\
                    <span><%=html%></span>\
                    <a href="javascript:void(0)" class="closeMin btn-close"></a>\
                </li>',
            listBox: '<ul class="boxIframeAddr_list clearfix  pb_0" style="display:none;"></ul>'
        };

        this.init = function(){

            this.ui = {};
            this.ui.container = this.container;            
            this.ui.listBox = $(this.template.listBox);

            //存放选中组数据
            this.items = {};
            this.menuItems = [];

            //注册组件,绑定事件, 设置默认值
            this.regMenu();
            this.regEvent();
            this.setDefault();

            //填充UI
            this.ui.container.append(this.ui.listBox);
        };

        this.regMenu = function() {
            var model = top.M2012.Contacts.getModel();
            var data = model.getGroupList();
            var DropMenu = this.isTopMenu ? top.M2012.UI.DropMenu : M2012.UI.DropMenu;

            this.menuItems = [{
                value: '',
                html: '选择分组'
            }];

            for(var i = 0; i < data.length; i++){
                var item = {
                    value: data[i].id,
                    html: M139.Text.Html.encode(data[i].name)
                };

                this.menuItems.push(item);
            }

            this.dropMenu = DropMenu.create({
                selectedIndex: 0,
                menuItems : this.menuItems,
                container : this.ui.container
            });

            if(this.width){
                this.dropMenu.$el.width(this.width);
            }
        };

        this.regEvent = function() {
            this.dropMenu.on("change", function (e) {
                _this.add(e);
            });

            this.ui.listBox.delegate('a.btn-close', 'click', function() {
                var li = $(this).parent();
                var value = li.data('value');

                _this.remove(value, li);                
            });
        };

        this.setDefault = function() {
            if(this.groupMap.length > 0){
                for(var i = 1; i < this.menuItems.length; i++){
                    var items = this.menuItems[i];
                    if(this.groupMap.indexOf(items.value) > -1 && items.value.length > 0){
                        this.add(items);
                    }
                }
            }
        };

        this.add = function(e) {
            if(e.value.length > 0 && !this.items[e.value]){
                var template = _.template(this.template.list, e);

                this.items[e.value] = e;
                this.ui.listBox.append(template); 

                if(this.callback){
                    this.callback(this.getData().groups, e);
                }

                this.ui.listBox.show();
            }

            this.onChange(e);
            this.dropMenu.setSelectedIndex(0);
        };

        this.remove = function(id, li) {
            var item = this.items[id];

            if(item){
                li.remove();                
                delete this.items[id];

                if(this.callback){
                    this.callback(this.getData().groups, item);
                }
            }

            if(this.getData().groups.length <= 0){
                this.ui.listBox.hide();
            }

            this.onRemove(item || {});
        };

        this.getData = function(){
            var data = {
                groups: []
            };

            for(var key in this.items){
                data.groups.push(this.items[key].value);
            }

            return data;
        };       
       
       this.init();
    });

})(jQuery, _, M139);

/******************************* **************************************************************
 通讯录联系人详情页, 省, 市,县无限级联动
 2014.07.28
 AeroJin 
 ***********************************************************************************************/
 ;
 (function ($, _, M139) {
    M139.namespace("M2012.Addr.Address", function (options) {

        var _this = this;

        this.container = options.container;
        this.dropWidth = options.dropWidth || 135;
        this.inputWidth = options.inputWidth || 268;
        this.defValue = options.defValue ? options.defValue : '__';

        this.callback = options.callback;

        this.TIP = { CITY: '城市'};

        this.result = {};
        this.result.provCode = options.provCode || '';
        this.result.cityCode = options.cityCode || '';
        this.result.address = options.address || '';     

        this.ui = {};        
        this.ui.container = $('<div class="addAddrCon"></div>');
        this.ui.input = $('<input type="text" class="iText mt_10" maxlength="50">');        

        this.init = function(){
            this.format();
            this.regDrop();
            this.regEvent();

            /*设置初始值*/
            this.ui.input.val(this.result.address);
            this.change(this.defValue, this.provDrop, this.result.provCode);
            this.change(this.provDrop.getSelectedItem().id, this.cityDrop, this.result.cityCode);

            /*填充UI*/
            this.container.html('');
            this.ui.input.width(this.inputWidth);
            this.ui.container.append(this.provDrop.$el);
            this.ui.container.append(this.cityDrop.$el);
            this.ui.container.append(this.ui.input);            
            this.ui.container.appendTo(this.container);
            
        };

        this.regDrop = function(){
            this.provOptions = {            
                maxHeight: 200,
                menuItems: [],
                container: $('<div></div>')
            };

            this.cityOptions = {            
                maxHeight: 200,
                menuItems: [],
                container: $('<div></div>')
            };

            this.cityDrop = M2012.UI.DropMenu.create(this.cityOptions);
            this.provDrop = M2012.UI.DropMenu.create(this.provOptions);

            this.provDrop.$el.width(this.dropWidth).addClass('fl');
            this.cityDrop.$el.width(this.dropWidth).addClass('fl ml_5');
        };

        this.regEvent = function(){        
            this.provDrop.on('change', function(item){          
                this.menu.remove();
                _this.cityDrop.setSelectedIndex(0);
                _this.change(item.id, _this.cityDrop);

                _this.result.provCode = item.text;
                _this.result.cityCode = _this.cityDrop.getSelectedItem().text;

                if(_this.callback){
                    _this.callback(_this.result);
                }
            });

            this.cityDrop.on('change', function(item){
                this.menu.remove();
                _this.result.cityCode = item.text;

                if(_this.callback){
                    _this.callback(_this.result);
                }          
            });

            this.ui.input.blur(function(){
                _this.result.address = $(this).val();

                if(_this.callback){
                    _this.callback(_this.result);
                }
            });
        };

        this.change = function(pid, dropMenu, value){          
            var data = this.data[pid];
            var len = data.length;        
            var menuItems = dropMenu.options.menuItems;
            var index = pid == this.defValue ? len - 1 : 0;

            while(menuItems.length){
                menuItems.pop();
            }

            for(var i = 0; i < len; i++){
                dropMenu.addItem(data[i]);
            }

            if(value){
                dropMenu.setSelectedText(value);
            }else{
                dropMenu.setSelectedIndex(index);
            }
        };

        this.format = function(prev, current){
            this.data = {};
            var provLen = ProvinceArray.length;
            var cityLen = CityArray.length;

            for(var i = 0; i < provLen; i++){
                var parent = ProvinceArray[i];

                this.insertData({
                    id: parent[1],
                    text: parent[0],
                    value: parent[1],
                    other: parent[2],
                    pid: this.defValue                
                });
            };

           for(var j = 0; j < cityLen; j++){              
                var child = CityArray[j];

                this.insertData({
                  id: child[2],
                  text: child[0],
                  value: child[2],
                  pid: child[1],
                  other: child[3]
                });
            }

            this.insertData({
               id: '-1',
               text: this.TIP.CITY,
               value: '-1',
               pid: '-1',
               other: '86'             
            });

        };

        this.insertData = function(data){
            if(!this.data[data.pid]){
                this.data[data.pid] = [];
            }

            this.data[data.pid].push(data);
        };

        this.init();
    });
})(jQuery, _, M139);


//省份数组
var ProvinceArray=[['其他','0','86'],['北京','11','86'],['天津','12','86'],['河北','13','86'],['山西','14','86'],['内蒙古','15','86'],
                   ['辽宁','21','86'],['吉林','22','86'],['黑龙江','23','86'],['上海','31','86'],['江苏','32','86'],['浙江','33','86'],
                   ['安徽','34','86'],['福建','35','86'],['江西','36','86'],['山东','37','86'],['河南','41','86'],['湖北','42','86'],
                   ['湖南','43','86'],['广东','44','86'],['广西','45','86'],['海南','46','86'],['重庆','50','86'],['四川','51','86'],
                   ['贵州','52','86'],['云南','53','86'],['西藏','54','86'],['陕西','61','86'],['甘肃','62','86'],['青海','63','86'],
                   ['宁夏','64','86'],['新疆','65','86'],['省份','-1','86']];
//城市数组
var CityArray=[['其他','0','0','86'],
['北京','11','110000','86'],['东城区','11','110100','86'],['西城区','11','110200','86'],['崇文区','11','110300','86'],['宣武区','11','110400','86'],
['朝阳区','11','110500','86'],['海淀区','11','110600','86'],['丰台区','11','110700','86'],['石景山区','11','110800','86'],
['顺义区','11','110900','86'],['昌平区','11','111000','86'],['门头沟区','11','111100','86'],['通州区','11','111200','86'],['房山区','11','111300','86'],
['大兴区','11','111400','86'],['延庆县','11','111500','86'],['怀柔区','11','111600','86'],['平谷区','11','111700','86'],
['天津','12','120000','86'],
['石家庄','13','130100','86'],['唐山','13','130200','86'],['秦皇岛','13','130300','86'],['邯郸','13','130400','86'],['邢台','13','130500','86'],
['保定','13','130600','86'],['张家口','13','130700','86'],['承德','13','130800','86'],['沧州','13','130900','86'],['廊坊','13','131000','86'],['衡水','13','131100','86'],
['太原','14','140100','86'],['大同','14','140200','86'],['阳泉','14','140300','86'],['长治','14','140400','86'],['晋城','14','140500','86'],
['朔州','14','140600','86'],['忻州','14','142200','86'],['吕梁','14','142300','86'],['晋中','14','142400','86'],['临汾','14','142600','86'],['运城','14','142700','86'],
['呼和浩特','15','150100','86'],['包头','15','150200','86'],['乌海','15','150300','86'],['赤峰','15','150400','86'],['通辽','15','150500','86'],
['呼伦贝尔','15','152100','86'],['兴安盟','15','152200','86'],['乌兰浩特','15','152201','86'],['锡林郭勒','15','152500','86'],
['乌兰察布','15','152600','86'],['鄂尔多斯','15','152700','86'],['巴彦淖尔','15','152800','86'],['阿拉善','15','152900','86'],
['沈阳','21','210100','86'],['大连','21','210200','86'],['鞍山','21','210300','86'],['抚顺','21','210400','86'],['本溪','21','210500','86'],
['丹东','21','210600','86'],['锦州','21','210700','86'],['营口','21','210800','86'],['阜新','21','210900','86'],['辽阳','21','211000','86'],
['盘锦','21','211100','86'],['铁岭','21','211200','86'],['朝阳','21','211300','86'],['葫芦岛','21','211400','86'],
['长春','22','220100','86'],['吉林','22','220200','86'],['四平','22','220300','86'],['辽源','22','220400','86'],['通化','22','220500','86'],
['白山','22','220600','86'],['松原','22','220700','86'],['白城','22','220800','86'],['延边','22','222400','86'],
['哈尔滨','23','230100','86'],['齐齐哈尔','23','230200','86'],['鸡西','23','230300','86'],['鹤岗','23','230400','86'],['双鸭山','23','230500','86'],
['大庆','23','230600','86'],['伊春','23','230700','86'],['佳木斯','23','230800','86'],['七台河','23','230900','86'],['牡丹江','23','231000','86'],
['黑河','23','231100','86'],['绥化','23','232300','86'],['大兴安岭','23','232700','86'],
['上海','31','310000','86'],
['南京','32','320100','86'],['无锡','32','320200','86'],['徐州','32','320300','86'],['常州','32','320400','86'],['苏州','32','320500','86'],
['南通','32','320600','86'],['连云港','32','320700','86'],['淮安','32','320800','86'],['宿迁','32','320900','86'],['盐城','32','321000','86'],
['扬州','32','321100','86'],['泰州','32','321200','86'],['镇江','32','321300','86'],
['杭州','33','330100','86'],['宁波','33','330200','86'],['温州','33','330300','86'],['嘉兴','33','330400','86'],['湖州','33','330500','86'],
['绍兴','33','330600','86'],['金华','33','330700','86'],['永康','33','330784','86'],['衢州','33','330800','86'],['舟山','33','330900','86'],
['台州','33','331000','86'],['丽水','33','332500','86'],
['合肥','34','340100','86'],['芜湖','34','340200','86'],['蚌埠','34','340300','86'],['淮南','34','340400','86'],['马鞍山','34','340500','86'],
['淮北','34','340600','86'],['铜陵','34','340700','86'],['安庆','34','340800','86'],['黄山','34','341000','86'],['滁州','34','341100','86'],
['阜阳','34','341200','86'],['亳州','34','341300','86'],['宿州','34','342200','86'],['六安','34','342400','86'],['宣城','34','342500','86'],
['巢湖','34','342600','86'],['池州','34','342900','86'],
['福州','35','350100','86'],['厦门','35','350200','86'],['莆田','35','350300','86'],['三明','35','350400','86'],['泉州','35','350500','86'],
['南安','35','350583','86'],['漳州','35','350600','86'],['南平','35','350700','86'],['龙岩','35','350800','86'],['宁德','35','352200','86'],
['南昌','36','360100','86'],['景德镇','36','360200','86'],['萍乡','36','360300','86'],['九江','36','360400','86'],['新余','36','360500','86'],
['鹰潭','36','360600','86'],['赣州','36','362100','86'],['宜春','36','362200','86'],['上饶','36','362300','86'],['吉安','36','362400','86'],['抚州','36','362500','86'],
['济南','37','370100','86'],['青岛','37','370200','86'],['淄博','37','370300','86'],['枣庄','37','370400','86'],['东营','37','370500','86'],
['烟台','37','370600','86'],['潍坊','37','370700','86'],['济宁','37','370800','86'],['泰安','37','370900','86'],['威海','37','371000','86'],
['日照','37','371100','86'],['莱芜','37','371200','86'],['滨州','37','372300','86'],['德州','37','372400','86'],['聊城','37','372500','86'],
['临沂','37','372800','86'],['菏泽','37','372900','86'],
['郑州','41','410100','86'],['开封','41','410200','86'],['洛阳','41','410300','86'],['平顶山','41','410400','86'],['安阳','41','410500','86'],
['鹤壁','41','410600','86'],['新乡','41','410700','86'],['焦作','41','410800','86'],['濮阳','41','410900','86'],['许昌','41','411000','86'],
['漯河','41','411100','86'],['三门峡','41','411200','86'],['济源','41','411300','86'],['南阳','41','411400','86'],['商丘','41','412300','86'],
['周口','41','412700','86'],['驻马店','41','412800','86'],['信阳','41','413000','86'],
['武汉','42','420100','86'],['黄石','42','420200','86'],['十堰','42','420300','86'],['宜昌','42','420500','86'],['襄樊','42','420600','86'],
['鄂州','42','420700','86'],['荆门','42','420800','86'],['孝感','42','420900','86'],['黄冈','42','421000','86'],['荆州','42','421100','86'],
['天门','42','421200','86'],['仙桃','42','421300','86'],['潜江','42','421400','86'],['随州','42','421500','86'],['咸宁','42','422300','86'],['恩施','42','422800','86'],
['长沙','43','430100','86'],['株洲','43','430200','86'],['湘潭','43','430300','86'],['衡阳','43','430400','86'],['邵阳','43','430500','86'],
['岳阳','43','430600','86'],['常德','43','430700','86'],['张家界','43','430800','86'],['益阳','43','430900','86'],['郴州','43','431000','86'],
['永州','43','431100','86'],['怀化','43','431200','86'],['娄底','43','431300','86'],['湘西','43','433100','86'],
['广州','44','440100','86'],['韶关','44','440200','86'],['深圳','44','440300','86'],['珠海','44','440400','86'],['汕头','44','440500','86'],
['佛山','44','440600','86'],['江门','44','440700','86'],['湛江','44','440800','86'],['茂名','44','440900','86'],['肇庆','44','441200','86'],
['惠州','44','441300','86'],['梅州','44','441400','86'],['汕尾','44','441500','86'],['河源','44','441600','86'],['阳江','44','441700','86'],
['清远','44','441800','86'],['东莞','44','441900','86'],['中山','44','442000','86'],['云浮','44','442100','86'],['潮州','44','445100','86'],['揭阳','44','445200','86'],
['南宁','45','450100','86'],['柳州','45','450200','86'],['桂林','45','450300','86'],['梧州','45','450400','86'],['北海','45','450500','86'],
['防城港','45','450600','86'],['贵港','45','450700','86'],['玉林','45','450800','86'],['钦州','45','450900','86'],['崇左','45','452100','86'],
['来宾','45','452200','86'],['贺州','45','452400','86'],['百色','45','452600','86'],['河池','45','452700','86'],
['海口','46','460100','86'],['三亚','46','460200','86'],['儋州','46','460300','86'],
['重庆','50','500000','86'],
['成都','51','510100','86'],['自贡','51','510300','86'],['攀枝花','51','510400','86'],['泸州','51','510500','86'],['德阳','51','510600','86'],
['绵阳','51','510700','86'],['广元','51','510800','86'],['遂宁','51','510900','86'],['内江','51','511000','86'],['乐山','51','511100','86'],
['南充','51','511300','86'],['广安','51','511500','86'],['眉山','51','512100','86'],['宜宾','51','512500','86'],['达州','51','513000','86'],
['雅安','51','513100','86'],['阿坝','51','513200','86'],['甘孜','51','513300','86'],['凉山','51','513400','86'],['巴中','51','513700','86'],['资阳','51','513800','86'],
['贵阳','52','520100','86'],['六盘水','52','520200','86'],['遵义','52','522100','86'],['铜仁','52','522200','86'],['黔西南','52','522300','86'],
['毕节','52','522400','86'],['安顺','52','522500','86'],['黔东南','52','522600','86'],['黔南','52','522700','86'],
['昆明','53','530100','86'],['昭通','53','532100','86'],['曲靖','53','532200','86'],['楚雄','53','532300','86'],['玉溪','53','532400','86'],
['红河','53','532500','86'],['文山','53','532600','86'],['思茅','53','532700','86'],['西双版纳','53','532800','86'],['大理','53','532900','86'],
['保山','53','533000','86'],['德宏','53','533100','86'],['丽江','53','533200','86'],['怒江','53','533300','86'],['迪庆','53','533400','86'],['临沧','53','533500','86'],
['拉萨','54','540100','86'],['昌都','54','542100','86'],['山南','54','542200','86'],['日喀则','54','542300','86'],['那曲','54','542400','86'],
['阿里','54','542500','86'],['林芝','54','542600','86'],
['西安','61','610100','86'],['铜川','61','610200','86'],['宝鸡','61','610300','86'],['咸阳','61','610400','86'],['渭南','61','612100','86'],
['汉中','61','612300','86'],['安康','61','612400','86'],['商洛','61','612500','86'],['延安','61','612600','86'],['榆林','61','612700','86'],
['兰州','62','620100','86'],['嘉峪关','62','620200','86'],['金昌','62','620300','86'],['白银','62','620400','86'],['天水','62','620500','86'],
['酒泉','62','622100','86'],['张掖','62','622200','86'],['武威','62','622300','86'],['定西','62','622400','86'],['陇南','62','622600','86'],
['平凉','62','622700','86'],['庆阳','62','622800','86'],['临夏','62','622900','86'],['甘南','62','623000','86'],
['西宁','63','630100','86'],['海东','63','632100','86'],['海北','63','632200','86'],['黄南','63','632300','86'],['海南','63','632500','86'],
['果洛','63','632600','86'],['玉树','63','632700','86'],['海西','63','632800','86'],
['银川','64','640100','86'],['石嘴山','64','640200','86'],['吴忠','64','642100','86'],['固原','64','642200','86'],['中卫','64','642300','86'],
['乌鲁木齐','65','650100','86'],['克拉玛依','65','650200','86'],['石河子','65','650300','86'],['阿拉尔','65','650400','86'],['图木舒克','65','650500','86'],
['五家渠','65','650600','86'],['吐鲁番','65','652100','86'],['哈密','65','652200','86'],['昌吉','65','652300','86'],['博尔塔拉','65','652700','86'],
['巴音郭楞蒙','65','652800','86'],['阿克苏','65','652900','86'],['克州','65','653000','86'],['喀什','65','653100','86'],['和田','65','653200','86'],
['伊犁','65','654100','86'],['塔城','65','654200','86'],['阿勒泰','65','654300','86']];
(function ($, _, M) {

    //通讯录公共组件类
    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Kit";  
    M.namespace(_class, M.View.ViewBase.extend({

        name: _class,

        el: "body",

        TIP: {},

        template: {
            tip: '<div class="tipsOther tip_{0}" tabindex="0" hidefocus="true" style="position: absolute; outline: none; left: 141px; top: 81px; z-index: 9999;">\
                        <div class="tips-text content_{0}">{1}</div>\
                        <div class="tipsBottom  diamond" style="left:10px"></div>\
                </div>'
        },

        logger: new M139.Logger({ name: _class }),

        initialize: function (options) {
            var _this = this;           
            
            this.initUI();
            superClass.prototype.initialize.apply(_this, arguments);
        },
        initUI: function(){

            this.ui = {};
            this.ui.el = this.$el;
        },
        initEvents: function () {
            var _this = this;
        },
        render: function () {
              
        },
        showTip: function(text, dom, options){
            var _this = this;
            var height = 30;
            var offset = dom.offset();
            var sTop = offset.top - height;
            var template = this.template.tip;
            
            if(this.delay){
                clearTimeout(this.delay);
            }

            if(!this.tip){
                this.tip = $(template.format(this.cid, text));
                this.$el.append(this.tip);
            }

            if(options && options.delay){
                this.delay = setTimeout(function(){
                    _this.hideTip();
                }, options.delay);
            }
            
            this.tip.find('.content_' + this.cid).text(text);
            this.tip.css({left: offset.left, top: sTop}).show();
            return this.tip;
        },
        hideTip: function() {
            this.$el.find('.tip_' + this.cid).hide();
        }

        
    }));
})(jQuery, _, M139);

;(function ($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.ContactsSingle";
    M.namespace(_class, M.Model.ModelBase.extend({

        name: _class,

        defaults: {
            contacts: null, //联系人信息, 格式化后的数据体
            AddGroupName: '', //新增组名
            AddrFirstName : "", //用户姓名            
            UserSex : '', //用户性别
            BirDay : "", //出生日期(YYYY-MM-DD)
            GroupId: '', //分组
            FamilyEmail : '', //邮箱
            HomeAddress : '', //家庭地址
            MobilePhone : '', //手机
            FamilyPhone : '', //电话
            ProvCode: '', //省份
            CityCode: '', //城市            
            OtherIm : '', //飞信号
            SerialId: '', //联系人ID
            CPName : '', //公司名称                        
            UserJob : '', //职务
            BusinessEmail : '', //商务邮箱
            BusinessMobile : '', //商务手机
            BusinessPhone : '', //公司固话
            BusinessFax: '', //公司传真
            CPProvCode: '', //省份
            CPCityCode: '', //城市
            CPAddress : '', //公司地址
            CPZipCode : '', //公司邮编
            Memo: '', //备注
            ImageUrl: '', //头像
            ImagePath: '', //头像
            name: '' //姓名   
        },
        TIPS: {
            DATE_GT_CURRENT: '生日不能大于当前日期',
            INPUT_NAME: '请输入姓名',
            MOBILE_AND_EMAIL: '电子邮箱和手机号码，请至少填写一项',
            MOBILE_ERROR: '手机号码格式不正确，请输入3-20位数字',
            EMAIL_ERROR: '电子邮箱格式不正确。应如zhangsan@139.com，长度6-90位',
            MAX_TIP: '保存失败，联系人数量已达上限',
            PHONE_ERROR: '常用固话格式不正确，请输入3-30位数字、-',
            FEIXIN_ERROR: '飞信号格式不正确，请输入6-9位数字',
            BUSSINESS_EMAIL_ERROR: '商务邮箱格式不正确。应如zhangsan@139.com，长度6-90位',
            BUSSINESS_MOBLIE_ERROR: '商务手机格式不正确，请输入3-20位数字',
            CP_PHONE_ERROR: '公司固话格式不正确，请输入3-30位数字、-',
            FAX_ERROR: '传真号码话格式不正确，请输入3-30位数字、-',
            CP_ZIPCODE_ERROR: '公司邮编格式不正确，请输入3-10位字母、数字、-或空格',
            PHOTO_FAIL: '头像上传失败，请上传gif、jpg、jpeg、bmp、png格式的图片',
            PHOTO_MAX: '头像上传失败，请上传大小在10MB以内的图片',
            CREATE_SUCCESS: '新建成功',
            SAVE_SUCCESS: '保存成功'            
        },

        SEX: {
           MALE: '男',
           WOMAN: '女',
           PRIVARY: '保密'
        },

        isMobile: /^[\d]{3,20}$/,
        isPhone: /^[\d-]{3,30}$/,
        isZipCode:  /^[a-zA-Z0-9-\s]{3,10}$/,
        isFeixin:  /^[\d]{6,9}$/,
        isEmail:  /^[0-9a-zA-Z_][_.0-9a-zA-Z-]{0,31}@([0-9a-zA-Z][0-9a-zA-Z-]{0,30}\.){1,4}[a-zA-Z]{2,4}$/,

        initialize: function (options) {

            this.contactsModel = top.M2012.Contacts.getModel();
            superClass.prototype.initialize.apply(this, arguments);
        },
        validate: function(attrs, args) {
            var self = this;
            var data = attrs;

            args = args || {};
            //判断是否需要验证
            if (!args.validate) {
                return;
            }

            //如果存在target，那说明我们只针对具体字段做校验
            if (args && args.target) {
                var key = args.target;
                var obj = {};
                obj[key] = attrs[key];
                data = obj;
            }

            //该方法用于获取返回的错误信息
            var getResult = function (target, message) {
                //校验错误后backbone不会将错误数据set到model中，所以此处需要偷偷的设置进去,
                //以便于后续提交时能统一校验model数据
                if (args.target == target) {
                    var obj = {};
                    obj[target] = attrs[target];
                    self.set(obj, { silent: true });
                }
                
                var value = {};
                value[target] = message;
                return value;
            }

            //验证姓名内容有效性
            var key = 'AddrFirstName';
            if (_.has(data, key)) {
                if (data.AddrFirstName.length == 0) {
                    return getResult(key, self.TIPS.INPUT_NAME);
                }

                //这里设置name
                this.set({name: data.AddrFirstName});
            }
            
            key = 'FamilyEmail';
            if (_.has(data, key)) {
                if (data.FamilyEmail.length > 0 && !self.isEmail.test(data.FamilyEmail)) {
                    return getResult(key, self.TIPS.EMAIL_ERROR);
                }else if(data.FamilyEmail.length == 0 && this.get('MobilePhone').length == 0){
                    return getResult(key, self.TIPS.MOBILE_AND_EMAIL);
                }
            }

            key = 'BusinessEmail';
            if (_.has(data, key)) {
                if (data.BusinessEmail.length > 0 && !self.isEmail.test(data.BusinessEmail)) {
                    return getResult(key, self.TIPS.BUSSINESS_EMAIL_ERROR);
                }
            }

            key = 'MobilePhone';
            if (_.has(data, key)) {
                if (data.MobilePhone.length > 0 && !self.isMobile.test(data.MobilePhone)) {
                    return getResult(key, self.TIPS.MOBILE_ERROR);
                }else if(this.get('FamilyEmail').length == 0 && data.MobilePhone.length == 0){
                    return getResult(key, self.TIPS.MOBILE_AND_EMAIL);
                }
            }

            key = 'BusinessMobile';
            if (_.has(data, key)) {
                if (data.BusinessMobile.length > 0 && !self.isMobile.test(data.BusinessMobile)) {
                    return getResult(key, self.TIPS.BUSSINESS_MOBLIE_ERROR);
                }
            }

            key = 'BirDay';
            if (_.has(data, key)) {
                if (data.BirDay.length > 0 && top.M139.Date.getDaysPass(M139.Date.getServerTime(), new Date(data.BirDay)) > 0) {
                    return getResult(key, self.TIPS.DATE_GT_CURRENT);
                }
            }

            key = 'FamilyPhone';
            if (_.has(data, key)) {
                if (data.FamilyPhone.length > 0 && !self.isPhone.test(data.FamilyPhone)) {
                    return getResult(key, self.TIPS.PHONE_ERROR);
                }
            }

            key = 'BusinessPhone';
            if (_.has(data, key)) {
                if (data.BusinessPhone.length > 0 && !self.isPhone.test(data.BusinessPhone)) {
                    return getResult(key, self.TIPS.CP_PHONE_ERROR);
                }
            }

            key = 'BusinessFax';
            if (_.has(data, key)) {
                if (data.BusinessFax.length > 0 && !self.isPhone.test(data.BusinessFax)) {
                    return getResult(key, self.TIPS.FAX_ERROR);
                }
            }

            key = 'CPZipCode';
            if (_.has(data, key)) {
                if (data.CPZipCode.length > 0 && !self.isZipCode.test(data.CPZipCode)) {
                    return getResult(key, self.TIPS.CP_ZIPCODE_ERROR);
                }
            }


            key = 'OtherIm';
            if (_.has(data, key)) {
                if (data.OtherIm.length > 0 && !self.isFeixin.test(data.OtherIm)) {
                    return getResult(key, self.TIPS.FEIXIN_ERROR);
                }
            }
        },
        getContactsInfoById: function(options){
            top.M2012.Contacts.API.getContactsInfoById(options.serialId, function(result){
                if(result.success){
                    options.success(result.contactsInfo)
                }else{
                    options.error(result);
                }
            }, options);
        },
        getContacts: function(args){
            var _this = this;
            var contacts = new top.M2012.Contacts.ContactsInfo();
            args.contacts = args.contacts ? args.contacts : contacts;

            var contacts = {
                firstInfo: {
                    Name: '',
                    ImageUrl: '',
                    ImagePath: ''
                },
                baseInfo: {
                    FamilyEmail: {key: '电子邮箱', value: ''},
                    BusinessEmail: {key: '商务邮箱', value: ''},
                    MobilePhone: {key: '手机号码', value: ''},
                    BusinessMobile: {key: '商务手机', value: ''}, 
                    BirDay: {key: '生日', value:''},
                    GroupName: {key: '分组',value:''}
                },
                otherInfo: {
                    AddGroupName: {key: '新组', value: ''},
                    SexText: {key: '性别', value:''},
                    FamilyPhone: {key: '常用固话', value: ''} ,
                    BusinessPhone: {key: '公司固话', value: ''},
                    BusinessFax: {key: '传真号码', value: ''},
                    FamilyAddress: {key: '家庭地址', value: ''},
                    CompanyAddress: {key: '公司地址', value: ''},
                    CPName: {key: '公司名称', value: ''},
                    UserJob: {key: '职务', value: ''},
                    CPZipCode: {key: '公司邮编', value: ''},
                    OtherIm: {key: '飞信号', value: ''},
                    Memo: {key: '备注', value: ''}
                },
                moreInfo: {
                   ProvCode: {key: '省份', value: ''},
                   CityCode: {key: '城市', value: ''},
                   HomeAddress: {key: '家庭地址', value: ''},
                   CPProvCode: {key: '省份', value: ''},
                   CPCityCode: {key: '城市', value: ''},
                   CPAddress: {key: '公司地址', value: ''},
                   UserSex: {key: '性别', value: ''},
                   GroupId: {key: '分组', value: ''},
                   SerialId: {key: 'ID', value: ''}
                }
            };

            var success = function(e){
                var data = _this.format(e);
                var firstInfo = contacts.firstInfo;
                var baseInfo = contacts.baseInfo;
                var moreInfo = contacts.moreInfo;
                var otherInfo = contacts.otherInfo;

                for(var key in otherInfo){
                    if(data[key] && data[key].length){
                       otherInfo[key].value =  data[key];
                    }                    
                }

                for(var key in moreInfo){
                    if(data[key] && data[key].length){
                       moreInfo[key].value =  data[key];
                    } 
                }

                for(var key in baseInfo){
                    if(data[key] && data[key].length){
                       baseInfo[key].value =  data[key];
                    } 
                }

                firstInfo.Name = data.Name;
                firstInfo.ImageUrl = data.ImageUrl;
                firstInfo.ImagePath = data.ImagePath;                

                contacts.firstInfo = firstInfo;
                contacts.baseInfo = baseInfo;
                contacts.moreInfo = moreInfo;
                contacts.otherInfo = otherInfo;
                
                _this.set({contacts: contacts});
                _this.set(_this.getInfo(), {silent: true});

                if(args.callback){
                    args.callback(contacts);
                }
            };

            success(args.contacts);         
        },
        getContactsById: function(args){
            var _this = this;
            var options = {
                serialId: args.serialId
            };

            options.success = function(e){
                if(e){
                    args.contacts = e;
                    _this.getContacts(args);
                }
            };

            options.error = function(e){
                switch(e.ResultCode){
                    case '214':
                    case '215':
                    case '216':
                    case '217':
                    case '218':{
                        top.$App.showSessionOutDialog();
                        break;
                    }
                    default: {
                        top.M139.UI.TipMessage.show(e.msg, {delay: 1000, className: 'msgRed'});
                    }
                }
            };

            this.set({serialId: options.serialId});
            this.getContactsInfoById(options);
        },
        format: function(data){
            var GroupName = [];
            var FamilyAddress = [];
            var CompanyAddress = [];
            var sex = data.UserSex ? data.UserSex : '';
            var gMap = data.GroupId ? data.GroupId.split(',') : [];
            var fMap = ['ProvCode', 'CityCode', 'HomeAddress'];
            var cMap = ['CPProvCode', 'CPCityCode', 'CPAddress'];

            for(var i = 0; i < fMap.length; i++){
                var fk = fMap[i];
                if(data[fk] && data[fk].length){
                    FamilyAddress.push(data[fk]);
                }
            }

            for(var j = 0; j < cMap.length; j++){
                var ck = cMap[j];
                if(data[ck] && data[ck].length){
                    CompanyAddress.push(data[ck]);
                }
            }

            for(var k = 0; k < gMap.length; k++){
                var group = this.contactsModel.getGroupById(gMap[k]);

                if(group){//防止分组被删除引发错误
                    GroupName.push(group.name || group.GroupName);
                }
            }

            switch(sex){
                case "0":
                    data.SexText = this.SEX.MALE;
                    break;
                case "1": 
                    data.SexText = this.SEX.WOMAN;
                    break;
                case "2": 
                    data.SexText = this.SEX.PRIVARY;
                    break;
                default:
                    data.SexText = '';
                    break;
            }

            
            data.Name = data.name;
            data.GroupName = GroupName;
            data.FamilyAddress = FamilyAddress.join(' ');
            data.CompanyAddress = CompanyAddress.join(' ');

            return this.fixPhoto(data);
        },
        getInfo: function() {
            var obj = {};
            var info = this.get('contacts');

            obj.name = info.firstInfo.Name;
            obj.AddrFirstName = info.firstInfo.Name;
            obj.ImageUrl = info.firstInfo.ImageUrl;
            obj.ImagePath = info.firstInfo.ImagePath;

            for(var key in info.baseInfo){
                obj[key] = info.baseInfo[key].value;
            }
            
            for(var key in info.otherInfo){
                obj[key] = info.otherInfo[key].value;
            }

            for(var key in info.moreInfo){
                obj[key] = info.moreInfo[key].value;
            }

            return obj;
        },
        getInfoByReady: function() { 
            var obj = {};
            var info = this.get('contacts');

            obj.name = M139.Text.Html.encode(info.firstInfo.Name);
            obj.AddrFirstName = M139.Text.Html.encode(info.firstInfo.Name);
            obj.ImageUrl = info.firstInfo.ImageUrl;
            obj.ImagePath = info.firstInfo.ImagePath;

            for(var key in info.baseInfo){
                obj[key] = M139.Text.Html.encode(info.baseInfo[key].value);
            }
            
            for(var key in info.otherInfo){
                obj[key] = M139.Text.Html.encode(info.otherInfo[key].value);
            }

            for(var key in info.moreInfo){
                obj[key] = M139.Text.Html.encode(info.moreInfo[key].value);
            }           

            return obj;
        },
        getInfoByWrite: function() {
            var info = this.getInfo();
            
            for(var key in info){
                var value = this.get(key) || '';
                info[key] = $.trim(value);
            }

            var image = info.ImageUrl || '';

            //防止imageurl带有?, 后台会检测xxs, 需要重置ImageUrl,
            if(image.indexOf('?') > -1){
                info.ImageUrl = image.substring(0, image.indexOf('?'));
            }

            //剔除为空的groupid, 例如这样的数据 '7010415012,,5155159146', 后台会检测的
            var group = (info.GroupId || '').split(',');

            for(var i = 0; i < group.length; i++){
                if($.trim(group[i]).length <= 0){
                    group.splice(i, 1);
                }
            }

            info.GroupId = group.join(',');
            info.ImageUrl = info.ImagePath || info.ImageUrl;


            return info;
        },
        fixPhoto: function (data) {
            var baseUrl = this.getPhotoUploadedAddr();
            var defPhoto = top.$App.getResourcePath() + "/images/face.png";
            var sysImgPath = ["/upload/photo/system/nopic.jpg", "/upload/photo/nopic.jpg"];

            if (data.ImageUrl && data.ImageUrl.length > 0) {
                if (data.ImageUrl.indexOf("http://") == 0) {
                    return data;
                }
                data.ImagePath = data.ImageUrl;
                //  var path = this.ImagePath.toLowerCase(); 不能转大小写
                var path = data.ImagePath;
                if (path == sysImgPath[0] || path == sysImgPath[1] || path == "") {
                    data.ImageUrl = defPhoto;
                }else{
                //    this.ImageUrl = baseUrl + "&path=" + encodeURIComponent(path);不需要编码
                    data.ImageUrl = baseUrl + path + "?rd=" + Math.random();
                }
            } else {
                data.ImageUrl = defPhoto;
                data.ImagePath = "/upload/photo/nopic.jpg";
            }

            return data;
        },
        getPhotoUploadedAddr: function() {
                var tmpurl = location.host;
                var url2 = "";
                if (tmpurl.indexOf("10086.cn") > -1 && top.$User.isGrayUser()) {
                    url2 = "http://image0.139cm.com";
                } else if(tmpurl.indexOf("10086.cn") > -1 && !top.$User.isGrayUser()) {
                    url2 = "http://images.139cm.com";
                } else if (tmpurl.indexOf("10086ts") > -1) {
                    url2 = "http://g2.mail.10086ts.cn";
                }else if(tmpurl.indexOf("10086rd") > -1){
                    url2 = "http://static.rd139cm.com";
                }
                return url2 ;
        },
        onReady: function(isReadySuccess) {

        }
    }));

})(jQuery, _, M139);
