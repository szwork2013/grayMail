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
;
(function ($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.PersonInfo";
    M.namespace(_class, M.Model.ModelBase.extend({

        name: _class,
        defaults: {
            state: '', //当前页面状态,
            isShowMore: false, //控制非基础字段显示
            contacts: {}, //联系人信息, 格式化后的数据体
            ImageUrl: '', //头像
            ImagePath: '',//头像显示路径
            AddrFirstName : "", //用户姓名
            AddrNickName : "", //用户昵称
            UserSex : 0, //用户性别
            BirDay : "", //出生日期(YYYY-MM-DD)
            StartCode : '', //星座
            BloodCode : "", //血型
            Marriage : 0, //婚姻状况 0是不填，未婚为2
            StreetCode : '', //居住地

            FamilyEmail : '', //邮箱
            HomeAddress : '', //通讯地址
            ZipCode : '', //邮编
            MobilePhone : '', //手机
            FamilyPhone : '', //电话
            //  GetPrivacySettings:'',//飞信号码 GetPrivacySettings接口
            OtherIm : '', //飞信号
            OICQ : '', //QQ
            MSN : '', //MSN
            PersonalWeb : '', //个人主页

            CPName : '', //公司名称
            UserJob : '', //职务
            BusinessEmail : '', //商务邮箱
            BusinessMobile : '', //商务手机
            BusinessPhone : '', //公司固话
            CPAddress : '', //公司地址
            CPZipCode : '', //公司邮编
            CompanyWeb : '', //公司主页

            Character : '', //我的性格
            FavoPeople : '', //欣赏的人
            MakeFriend : '', //我想结交
            Brief : '', //我的简介
            FavoBook : '', //喜欢的书
            FavoMusic : '', //喜欢的音乐
            FavoMovie : '', //喜欢的电影
            FavoTv : '', //喜欢的电视
            FavoSport : '', //喜欢的运动
            FavoGame : '' //喜欢的游戏
        },
        TIPS: {
            DATE_GT_CURRENT: '生日不能大于当前日期',
            MOBILE_ERROR: '手机号码格式不正确，请输入3-20位数字',
            EMAIL_ERROR: '电子邮箱格式不正确。应如zhangsan@139.com，长度6-90位',
            MAX_TIP: '保存失败，联系人数量已达上限',
            PHONE_ERROR: '常用固话格式不正确，请输入3-30位数字、-',
            FEIXIN_ERROR: '飞信号格式不正确，请输入6-9位数字',
            BUSSINESS_EMAIL_ERROR: '商务邮箱格式不正确。应如zhangsan@139.com，长度6-90位',
            BUSSINESS_MOBLIE_ERROR: '商务手机格式不正确，请输入3-20位数字',
            CP_PHONE_ERROR: '公司固话格式不正确，请输入3-30位数字、-',
            FAX_ERROR: '传真号码话格式不正确，请输入3-30位数字、-',
            ZIPCODE_ERROR: '邮编格式不正确，请输入3-10位字母、数字、-或空格',
            CP_ZIPCODE_ERROR: '公司邮编格式不正确，请输入3-10位字母、数字、-或空格',
            QQ_ERROR: 'QQ格式不正确，请输入5-11位数字',
            PHOTO_FAIL: '头像上传失败，请上传gif、jpg、jpeg、bmp、png格式的图片',
            PHOTO_MAX: '头像上传失败，请上传大小在10MB以内的图片',
            SAVE_SUCCESS: '保存成功'            
        },
        SEX: {
           MALE: '男',
           WOMAN: '女',
           PRIVARY: '保密'
        },
        MARRIAGE: {
            EMPTY: '',
            MARRIED: '已婚',
            DISCOVERTURE: '未婚'
        },
        isMobile: /^[\d]{3,20}$/,
        isPhone: /^[\d-]{3,30}$/,
        isZipCode:  /^[a-zA-Z0-9-\s]{3,10}$/,
        isFeixin:  /^[\d]{6,9}$/,
        isQQ:  /^[\d]{5,11}$/,
        isEmail:  /^[0-9a-zA-Z_][_.0-9a-zA-Z-]{0,31}@([0-9a-zA-Z][0-9a-zA-Z-]{0,30}\.){1,4}[a-zA-Z]{2,4}$/,
        initialize: function (options) {
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
            
            key = 'FamilyEmail';
            if (_.has(data, key)) {
                if (data.FamilyEmail.length > 0 && !self.isEmail.test(data.FamilyEmail)) {
                    return getResult(key, self.TIPS.EMAIL_ERROR);
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

            key = 'ZipCode';
            if (_.has(data, key)) {
                if (data.ZipCode.length > 0 && !self.isZipCode.test(data.ZipCode)) {
                    return getResult(key, self.TIPS.ZIPCODE_ERROR);
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

            key = 'OICQ';
            if (_.has(data, key)) {
                if (data.OICQ.length > 0 && !self.isQQ.test(data.OICQ)) {
                    return getResult(key, self.TIPS.QQ_ERROR);
                }
            }
        },
        modifyUserInfo : function (options) {
            var This = this;
            top.M2012.Contacts.getModel().modifyUserInfo(options.data, function (result) {
                if(result.ResultCode == "0"){
                    options.success(result);
                }else{
                    options.error(result);
                }
            });
        },
        getDataSource : function (options) {
            top.M2012.Contacts.getModel().getUserInfo({refresh: true}, function (result) {
                var userInfo = {};
                if (result.code === 'S_OK') {
                    userInfo = result['var'];
                    options.success(userInfo);
                } else {
                    options.error(result);
                    top.console.log("M2012.Contacts.getModel().getUserInfo 获取用户信息失败！result.code:" + result.code);
                }
            });

        },
        getContacts: function(callback){
            var _this = this;
            var options = {};
            var contacts = {
                firstInfo: {
                    ImageUrl: '',
                    ImagePath: '',
                    AddrFirstName: ''
                },
                baseInfo: {
                    FamilyEmail: {key: '电子邮箱', value: ''},
                    BusinessEmail: {key: '商务邮箱', value: ''},
                    MobilePhone: {key: '手机号码', value: ''},
                    BusinessMobile: {key: '商务手机', value: ''}, 
                    BirDay: {key: '生日', value:''}                    
                },
                otherInfo: {
                    AddrNickName: {key: '昵称', value: ''},
                    SexText: {key: '性别', value:''},
                    FamilyPhone: {key: '常用固话', value: ''} ,
                    BusinessPhone: {key: '公司固话', value: ''},
                    BusinessFax: {key: '传真号码', value: ''},
                    HomeAddress: {key: '家庭地址', value: ''},
                    CPAddress: {key: '公司地址', value: ''},
                    CPName: {key: '公司名称', value: ''},
                    UserJob: {key: '职务', value: ''},
                    ZipCode: {key: '家庭邮编', value: ''},
                    CPZipCode: {key: '公司邮编', value: ''},
                    OtherIm: {key: '飞信号', value: ''},
                    OICQ : {key: 'QQ', value: ''},
                    MSN : {key: 'MSN', value: ''},
                    PersonalWeb : {key: '个人主页', value: ''},
                    CompanyWeb : {key: '公司主页', value: ''},
                    StartCode : {key: '星座', value: ''}, 
                    BloodCode : {key: '血型', value: ''}, 
                    MarriageText : {key: '婚姻状况', value: ''},
                    StreetCode : {key: '居住地', value: ''},
                    Character : {key: '我的性格', value: ''},
                    FavoPeople : {key: '欣赏的人', value: ''},
                    MakeFriend : {key: '我想结交', value: ''},
                    Brief : {key: '我的简介', value: ''},
                    FavoBook : {key: '喜欢的书', value: ''},
                    FavoMusic : {key: '喜欢的音乐', value: ''},
                    FavoMovie : {key: '喜欢的电影', value: ''},
                    FavoTv : {key: '喜欢的电视', value: ''},
                    FavoSport : {key: '喜欢的运动', value: ''},
                    FavoGame : {key: '喜欢的游戏', value: ''}
                },
                moreInfo: {
                   UserSex: {key: '性别', value: ''},
                   Marriage: {key: '婚姻状况', value: ''}
                }
            };

            options.success = function(e){
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

                for(var key in firstInfo){
                    if(data[key] && data[key].length){
                       firstInfo[key] =  data[key];
                    } 
                }

                contacts.firstInfo = firstInfo;
                contacts.baseInfo = baseInfo;
                contacts.moreInfo = moreInfo;
                contacts.otherInfo = otherInfo;
                _this.set({contacts: contacts});
                _this.set(_this.getInfo(), {silent: true});

                if(callback){
                    callback(contacts);
                }
            };

            options.error = function(result) {
                switch(result.ResultCode){
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

                _this.set({contacts: contacts});
                callback(contacts);
            };
            
            this.getDataSource(options);            
        },
        format: function(data){
            switch(data.UserSex){
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
                    data.UserSex = '';
                    break;
            }

            switch(data.Marriage){
                case '1':
                    data.MarriageText = this.MARRIAGE.MARRIED;
                    break;
                case '2':
                    data.MarriageText = this.MARRIAGE.DISCOVERTURE;
                    break;
                default:
                    data.Marriage = '0';
                    data.MarriageText = this.MARRIAGE.EMPTY;                    
                    break;
            }

            return this.fixPhoto(data);
        },
        getInfo: function() {
            var obj = {};
            var info = this.get('contacts');

            obj.ImageUrl = info.firstInfo.ImageUrl;
            obj.ImagePath = info.firstInfo.ImagePath;
            obj.AddrFirstName = info.firstInfo.AddrFirstName;

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

            //是否取model里面的新值,编辑时会用到    
            for(var key in info){
                var value = this.get(key) || '';
                info[key] = $.trim(value);
            }

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
        }
    }));

})(jQuery, _, M139);

;(function ($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.PersonInfo";  
    M.namespace(_class, M.View.ViewBase.extend({

        name: _class,

        el: "#main-from",

        events:{},

        STATE: {
            EDIT: 'edit',
            READY: 'ready'
        },

        //展开隐藏项需要配置class
        ACTION: {
            FamilyEmail: 'o-email',
            BusinessEmail: 'o-email',
            MobilePhone: 'o-moblie',
            BusinessMobile: 'o-moblie', 
            FamilyPhone: 'o-phone',
            BusinessPhone: 'o-phone',
            BusinessFax: 'o-phone',
            HomeAddress: 'o-address',
            CPAddress: 'o-address',
            ZipCode: 'o-code',
            CPZipCode: 'o-code',
            OtherIm: 'o-im',
            OICQ: 'o-im',
            MSN: 'o-im',
            PersonalWeb: 'o-im',
            CompanyWeb: 'o-im',
            Character: 'o-more',
            FavoPeople: 'o-more',
            MakeFriend: 'o-more',
            Brief: 'o-more',
            FavoBook: 'o-more',
            FavoMusic: 'o-more',
            FavoMovie: 'o-more',
            FavoTv: 'o-more',
            FavoSport: 'o-more',
            FavoGame: 'o-more'
        },


        TIP: {
            TITLE_EDIT: '编辑个人资料',
            TITLE_READY: '查看个人资料',
            SUCCESS : "保存成功",
            FAILURE : "保存失败"
        },

        template: '',

        logger: new M139.Logger({ name: _class }),

        initialize: function (options) {
            var _this = this;
            _this.kit = options.kit;
            _this.model = options.model;
            _this.master = options.master;
            _this.contactsModel = top.M2012.Contacts.getModel();

            _this.initUI();
            _this.initEvents();
            _this.render();
            superClass.prototype.initialize.apply(_this, arguments);
        },
        initUI: function(){

            this.ui = {};
            this.ui.el = this.$el;
            this.ui.body = $('body');

            //容器
            this.ui.tool = this.$el.find('#tool');
            this.ui.title = this.$el.find('#title');
            this.ui.main = this.$el.find('#main-content');            
            this.ui.mainBody = this.$el.find('#main-body');
            this.ui.mainButton = this.$el.find('#main-button');

            //按钮
            this.ui.btnEdit = $('#tool-edit');
            this.ui.btnBack = this.$el.find('#btn-back');
            this.ui.btnSave = this.$el.find('#btn-save');
            this.ui.btnCancel= this.$el.find('#btn-cancel');

            //模版
            this.ui.tempEdit = $('#temp-edit');
            this.ui.tempReady = $('#temp-ready');
            this.ui.tempLoad = $('#temp-load');
        },
        initEvents: function () {
            var _this = this;
            var ui = this.ui;

            //当状态发生改变时,进行初始化
            this.model.on('change:state',function(){
                var state = this.get('state');
                _this[state].render.call(_this);
            });

            this.model.on('change:isShowMore', function(){
                //控制非基础字段显示隐藏                
               if(this.get('isShowMore')){
                    ui.main.find('#contacts-more').show();
                    ui.main.find('#btn-more').parent().hide();
                    ui.main.find('#contacts-more li.default').show();
                }else{
                    ui.main.find('#contacts-more').hide();
                    ui.main.find('#btn-more').parent().show();
                }
            });

            this.model.on('invalid', function(model, error){
                for(var key in error){
                    var input = _this.byName(key);
                    var tops =  input.offset().top;
                    var min = ui.main.offset().top;
                    var max = ui.main.height() + min;
                    if(tops < min || tops > max){
                        ui.main.scrollTop(tops + 20);
                    }
                    _this.kit.showTip(error[key], input, {delay: 3000});    
                }                
            });

            ui.btnBack.click(function(){
                var state = _this.model.get('state');
                _this[state].back.call(_this);
            });

            ui.btnCancel.click(function(){
                var state = _this.model.get('state');
                _this[state].back.call(_this);
                top.BH('addr_basicInfo_cancel');
            });

            ui.btnSave.click(function(){
                //统一验证
                if(_this.model.isValid()){
                    var state = _this.model.get('state');                    
                    _this[state].update.call(_this);
                }

                top.BH('addr_basicInfo_save');
            });

            ui.btnEdit.click(function(){
                top.BH('addr_basicInfo_edit');
                _this.model.set({state: _this.STATE.EDIT});
            });

            $(window).resize(function () {
                var marginTop = 11;
                var headHeight = _this.$el.find('.main-rows').height() * 2;
                var winHeight = $(window).height() - headHeight - marginTop;
                
                ui.main.css({ height: winHeight });
            });

            $(window).resize();
        },
        render: function () {
            this.model.set({state: this.STATE.READY});
        },
        regMainEvent: function(){
            var _this = this;
            var ui = this.ui;

            //自动截手机号为邮箱
            ui.main.find('#MobilePhone').change(function(e){
                //手机号支持分隔符“-”,输入手机号 自动填充移动手机邮箱时过滤掉手机号分隔符10.9
                var email = ui.main.find('#FamilyEmail');
                var mobile = e.target.value.replace(/\D/g, "");
                var domain = top.mailDomain || top.coremailDomain;
                var isFix = ($Mobile.isMobile(mobile) && email.val().trim().length);

                if (isFix) {
                    email.val(mobile + "@" + domain); 
                }
            });

            //自动截手机帐号为手机号
            ui.main.find("#FamilyEmail").change(function(e){
                var mobile = ui.main.find("#MobilePhone");
                var email = top.Utils.parseSingleEmail(e.target.value);
                var isFix = ( email != null 
                    && $Mobile.isMobile(email.name)
                    && mobile.val().trim().length);

                if (isFix) {
                    mobile.val(email.name);
                }
            });

            ui.main.find('input[type=text],textarea').blur(function(){
                var obj = {};
                var name = $(this).attr('name');
                var value = $(this).val().trim();

                obj[name] = value;
                _this.model.set(obj, {validate: true, target: name});
            });

            ui.main.find('input[type=text]').focus(function(){
                var name = $(this).attr('name');
                _this.kit.hideTip(name);
            });

            ui.main.find('input[name=UserSex]').click(function(){
                _this.model.set({UserSex: this.value});
            });

            ui.main.find('#btn-more').click(function(){
                _this.model.set({isShowMore: true}, {silent: true});
                _this.model.trigger('change:isShowMore');
                top.BH('addr_basicInfo_more');
            });

            ui.main.find('.btn-create').click(function(){
                var selector = 'li.{0}:hidden';
                var key = $(this).data('key');
                var clas = _this.ACTION[key];
                var element = ui.main.find(selector.format(clas));
                var len = element.length;

                if( len > 0){
                    element.eq(0).show();
                    if(--len <= 0){
                        $(this).hide();
                    }
                }
            });

            ui.main.find('.btn-remove').click(function(){
                var obj = {};
                var selector = 'li.{0}';
                var key = $(this).data('key');
                var clas = _this.ACTION[key];
                var element = ui.main.find(selector.format(clas));
                var len = element.length;

                //清空对象的数据
                obj[key] = '';
                _this.model.set(obj);

                //ui操作
                $(this).closest('li').hide();
                $(this).closest('li').find('input').val('');
                element.eq(0).find('.btn-create').show();
            });

            ui.main.find('#btn-file').click(function(){
                top.BH('addr_basicInfo_upload');
            });
        },
        regWidget: function(){
            var _this = this;
                _this.widget = {};

            //初始化头像组件    
            var upLoad = {
                serialId: 0,
                image: $('#face'),
                upLoadFile: $('#btn-file'),
                callback: function(result) {
                    _this.model.set({ImageUrl: result.imagePath});
                    _this.model.set({ImagePath: result.imagePath});
                    top.BH('addr_basicInfo_uploadSuccess');
                }
            };
            this.widget.ImageUrl = new M2012.Addr.ImageUpload(upLoad);    

             //初始化日期组件
            var birDay = {
                button: $('#btn-calender'),
                callback: function(date) {
                    var strDate = date.format('yyyy-MM-dd');
                    _this.ui.main.find('#BirDay').val(strDate);
                    _this.model.set({BirDay: strDate}, {validate: true, target: 'BirDay'}); 
                }
            };
            this.widget.birDay = new M2012.Addr.View.CalenderChoose(birDay);
        },
        startCodeMenu : function () {
                var _this = this;
                var defaultText = this.model.get('StartCode');

                var menuItems = [{
                        text : "--",
                        value : ""
                    }, {
                        text : "白羊座",
                        value : "白羊座"
                    }, {
                        text : "金牛座",
                        value : "金牛座"
                    }, {
                        text : "双子座",
                        value : "双子座"
                    }, {
                        text : "巨蟹座",
                        value : "巨蟹座"
                    }, {
                        text : "狮子座",
                        value : "狮子座"
                    }, {
                        text : "处女座",
                        value : "处女座"
                    }, {
                        text : "天秤座",
                        value : "天秤座"
                    }, {
                        text : "天蝎座",
                        value : "天蝎座"
                    }, {
                        text : "射手座",
                        value : "射手座"
                    }, {
                        text : "摩羯座",
                        value : "摩羯座"
                    }, {
                        text : "水瓶座",
                        value : "水瓶座"
                    }, {
                        text : "双鱼座",
                        value : "双鱼座"
                    }
                ];

                var dropMenu = M2012.UI.DropMenu.create({
                    defaultText: defaultText || "--",
                    menuItems: menuItems,
                    container: $('#start-code')
                }).on("change", function (e) {
                    _this.model.set("StartCode", e.value);
                });

                dropMenu.$el.width(138);
        },
        bloodCodeMenu : function () {
            var _this = this;
            var defaultText = this.model.get('BloodCode');

            var items = [{
                    text : "-- ",
                    value : ""
                }, {
                    text : "A型 ",
                    value : "A型"
                }, {
                    text : "B型 ",
                    value : "B型"
                }, {
                    text : "AB型 ",
                    value : "AB型"
                }, {
                    text : "O型 ",
                    value : "O型"
                }
            ];

            var dropMenu = M2012.UI.DropMenu.create({
                    defaultText : defaultText || "--",
                    menuItems : items,
                    container : $('#blood-code')
                }).on("change", function (e) {
                    _this.model.set("BloodCode", e.value);
                });

                dropMenu.$el.width(138);

        },
        marriageMenu : function () {
            var _this = this;
            var defaulttext = "";
            var value = this.model.get('Marriage');

            var itmes = [{
                    text : "--",
                    value : "0"
                }, {
                    text : "已婚 ",
                    value : "1"
                }, {
                    text : "未婚 ",
                    value : "2"
                }
            ];
            
            var dropMenu = M2012.UI.DropMenu.create({
                    defaultText : "--",
                    menuItems : itmes,
                    container : $('#marriage')
                }).on("change", function (e) {
                    _this.model.set("Marriage", e.value);
                });

            dropMenu.$el.width(138);    
            dropMenu.setSelectedValue(value);            
        },
        initAction: function() {
            var _this = this;
            var ui = this.ui;
            var showAll = true; //非基础字段全部有值
            var hideAll = true; //非基础字段全部为空

            //便利可扩展字段, 判断是否可继续扩展
            ui.main.find('.btn-create').each(function(index, dom){
                var isHide = true;
                var key = $(this).data('key');
                var clas = 'li.{0}:gt(0)'.format(_this.ACTION[key]);

                ui.main.find(clas).each(function(num){
                    if($(this).data('value').length <= 0){
                        isHide = false;
                        $(this).hide();
                    }else{
                        $(this).show();
                    }
                });

                if(isHide){
                    $(this).hide();
                }
            });

            //便利非基础字段,有值就显示, 为空就隐藏
            ui.main.find('#contacts-more li').each(function(){
                var value = $.trim($(this).data('value'));

                if(value.length > 0){
                    $(this).show();
                    if($(this).hasClass('default')){
                        hideAll = false;
                    }
                }else{
                    $(this).hide();
                    if($(this).hasClass('default')){
                        showAll = false;
                    }
                }
            });

            //两种特殊情况, 1.全部为空, 2.全部有值
            if(hideAll){
                _this.model.set({isShowMore: false}, {silent: true});
                _this.model.trigger('change:isShowMore');
            }

            if(showAll){
                _this.model.set({isShowMore: true}, {silent: true});
                _this.model.trigger('change:isShowMore');
            }
 
        },        
        byName: function(name){
            return this.ui.main.find('input[name=' + name + ']');
        },
        back: function() {
            this.master.trigger(this.master.EVENTS.LOAD_MAIN);
        },
        edit: {
            render: function() {
                var _this = this;
                this.ui.tool.hide();
                this.ui.mainButton.show();
                this.ui.title.text(this.TIP.TITLE_EDIT);

                this.model.getContacts(function(contacts){
                    var info = _this.model.getInfo();
                    var html = _this.ui.tempEdit.html();
                    var template = _.template(html, info);

                    _this.ui.mainBody.html(template);

                    //事件和组件注册
                    _this.regWidget();
                    _this.initAction();
                    _this.regMainEvent();

                    //初始化星座,血型,婚姻
                    _this.startCodeMenu();
                    _this.bloodCodeMenu();
                    _this.marriageMenu();

                    $(window).resize();
                });

                top.BH('addr_basicInfo_loadEdit');
            },
            update: function() {
                var _this = this;
                var options = {};
                    options.data = this.model.getInfoByWrite();

                options.success = function() {
                    _this.model.set({state: _this.STATE.READY});
                    top.M139.UI.TipMessage.show(_this.TIP.SUCCESS, { delay: 2000});
                    top.BH('addr_basicInfo_EditSuccess');
                };

                options.error = function() {
                    top.M139.UI.TipMessage.show(_this.TIP.FAILURE, { delay: 2000, className: 'msgRed'});
                };

                this.model.modifyUserInfo(options);
            },
            back: function() {
                this.model.set({state: this.STATE.READY});
            }
        },
        ready: {
            render: function() {
                var _this = this;
                this.ui.tool.show();                
                this.ui.mainButton.hide();
                this.ui.title.text(this.TIP.TITLE_READY);

                this.model.getContacts(function(contacts){
                    var html = _this.ui.tempReady.html();
                    var template = _.template(html, contacts);

                     _this.ui.mainBody.html(template);
                     _this.model.set(_this.model.getInfo(), {silent: true});
                });

                top.BH('addr_basicInfo_loadReady');
            },
            update: function() {

            },
            back: function() {
                this.back();
            }
        }
    }));
    
    $(function(){
        var kit = new M2012.Addr.View.Kit();
        var model = new M2012.Addr.Model.PersonInfo();
        var view = new M2012.Addr.View.PersonInfo({model: model, master: top.$Addr, kit: kit});        
    });

})(jQuery, _, M139);
