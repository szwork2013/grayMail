/**
 * @fileOverview 定义时间日期操作相关的常用方法的静态类
 */

(function (M139) {
    /**
    *定义DOM操作相关的常用方法的静态类，缩写为$D
    *@namespace
    *@name M139.Date
    */
    M139.Date =
    /**@lends M139.Date */
    {
        /**
        *解析文本为日期对象，目前只支持yyyy-MM-dd hh:mm:ss的写法，解析失败返回null
        *@param {String|Number} 要解析的时间文本,"yyyy-MM-dd hh:mm:ss"格式，或者是秒数
        *@returns {Date}
        *@example
        $Date.parse("2012-10-10 10:10:10");
        */
        parse: function (str) {
            if (/^\d{10}$/.test(str)) {
                return new Date(str * 1000);
            } else if (/^\d{13}$/.test(str)) {
                return new Date(str * 1);
            }

            str = str.trim();
            var reg = /^(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
            var m = str.match(reg);
            if (m) {
                var year = m[1];
                var month = parseInt(m[2] - 1, 10);
                var day = parseInt(m[3], 10);
                var hour = parseInt(m[4], 10);
                var minutes = parseInt(m[5], 10);
                var seconds = parseInt(m[6], 10);
                return new Date(year, month, day, hour, minutes, seconds);
            } else {
                return null;
            }
        },
        /**
        *格式化时间文本
        *@param {Date} text 要格式化的文本
        *@param {String} date 时间对象
        *@returns {String}
        @example
        $Date.format("现在是yyyy年MM月dd日 hh点mm分ss秒，星期w",new Date());
        y 表示年份
        M 大写M表示月份
        d 表示几号
        h 表示小时
        m 表示分
        s 表示秒
        w 表示星期几
        */
        format: function (text, date) {
            /*
            var o = {
                "M+": date.getMonth() + 1, //month
                "d+": date.getDate(),    //day
                "h+": date.getHours(),   //hour
                "m+": date.getMinutes(), //minute
                "s+": date.getSeconds(), //second
                "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
                "S": date.getMilliseconds(), //millisecond
                "w": "日一二三四五六".charAt(date.getDay())
            };
            text = text.replace(/y{4}/, date.getFullYear())
            .replace(/y{2}/, date.getFullYear().toString().substring(2))
            for (var k in o) {
                var reg = new RegExp(k);
                text = text.replace(reg, match);
            }
            function match(m) {
                return m.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length);
            }
            return text;
            */
            var reg = /yyyy|yy|M+|d+|h+|m+|s+|q+|S|w/g;
            text = text.replace(reg, function (pattern) {
                var result;
                switch (pattern) {
                    case "yyyy":
                        result = date.getFullYear();
                        break;
                    case "yy":
                        result = date.getFullYear().toString().substring(2);
                        break;
                    case "M":
                    case "MM":
                        result = date.getMonth() + 1;
                        break;
                    case "dd":
                    case "d":
                        result = date.getDate();
                        break;
                    case "hh":
                    case "h":
                        result = date.getHours();
                        break;
                    case "mm":
                    case "m":
                        result = date.getMinutes();
                        break;
                    case "ss":
                    case "s":
                        result = date.getSeconds();
                        break;
                    case "q":
                        result = Math.floor((date.getMonth() + 3) / 3);
                        break;
                    case "S":
                        result = date.getMilliseconds();
                        break;
                    case "w":
                        result = "日一二三四五六".charAt(date.getDay());
                        break;
                    default:
                        result = "";
                        break;
                }
                if (pattern.length == 2 && result.toString().length == 1) {
                    result = "0" + result;
                }
                return result;
            });
            return text;
        },
        /**
        *返回date2比date1大了几天（不是十分准确，可能有1天的偏差）
        *@param {Date} endDate 开始时间
        *@param {Date} endDate 结束时间
        *@returns {Number}
        */
        getDaysPass: function (startDate, endDate) {
            var t = endDate.getTime() - startDate.getTime();//相差毫秒
            var day = Math.round(t / 1000 / 60 / 60 / 24);
            if (day == 0 || day == 1) {
                day = startDate.getDate() == endDate.getDate() ? 0 : 1;
            }
            return day;
        },

        /**
        *判断两个日期是否同一天
        *@returns {Boolean}
        */
        isSameDay:function(date1,date2){
            return date1.getDate() == date2.getDate() && date1.getMonth() == date2.getMonth() && date1.getFullYear() == date2.getFullYear();
        },

        /**
        *返回一个服务器时间（M39.HttpClient对象在与后台通讯的时候取得的Http头里的服务端时间）
        */
        getServerTime: function () {
            var d = new Date();
            var diffTime = (top.M139 && top.M139._ClientDiffTime_) || M139._ClientDiffTime_;
            if (diffTime) {
                //如果M139.HttpClient已通过ajax请求获取过服务器与客户端的时间差
                return new Date(d.getTime() - diffTime);
            }
            return d;
        },

        /**
        *比较时间，获得人性化的时间差描述：刚刚，几分钟前，几小时前
        @param {Date} date 要转化的时间
        @param {Date} now 可选参数，当前时间，默认取客户端时间
        *@returns {String}
        *@example
        var text = $Date.getFriendlyString(letter.sendDate);
        */
        getFriendlyString: function (date, now) {
            if (!date) return "";
            if (typeof date == "number") date = new Date(date * 1000);
            now = now || new Date();
            var result;
            //今天的邮件
            var t = now.getTime() - date.getTime(); 	//相差毫秒
            if (t < 0) {
                result = this.format("yyyy-M-dd", date);
            }
            else if (date.getYear() == now.getYear() && date.getMonth() == now.getMonth() && date.getDate() == now.getDate()) {
                var minutes = Math.round(t / 1000 / 60);
                if (minutes == 0) {
                    result = "刚刚";
                } else if (minutes > 0 && minutes < 60) {
                    result = minutes + "分钟前";
                } else {
                    result = Math.floor(minutes / 60) + "小时前";
                }
            } else if (date.getYear() == new Date().getYear()) {
                result = this.format("M-dd(w)", date);
            } else {
                result = this.format("yyyy-M-dd(w)", date);
            }
            return result;
        },
        /**
        * 根据当前时间返回：凌晨、早上、中午、晚上、深夜
        */
        getHelloString: function (date) {
            date = date || new Date();
            var hour = date.getHours();
            var map = {
                "0": "凌晨",
                "1": "上午",
                "2": "中午",
                "3": "下午",
                "4": "晚上",
                "5": "深夜"
            };
            //0点-3点深夜 3点-6点凌晨 6点-11点上午 11点-13点中午……
            var hoursList = "555000111112233333344444";
            var index = hoursList.charAt(hour);
            return map[index];
        },
        /**
         *得到指定时间月份的天数
         *@param {Date} date 可选参数，判断的时间，缺省为当前时间
         *@returns {Number}
        */
        getDaysOfMonth: function (date) {
            if (!date) date = new Date();
            var isLeapYear = this.isLeapYear(date.getFullYear());
            return [31, (isLeapYear ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][date.getMonth()];
        },
        /**
         *得到指定时间是否闰年
         *@param {Date|Number} date 可选参数，判断的时间，缺省为当前时间
         *@returns {Boolean}
        */
        isLeapYear: function (date) {
            if (!date) date = new Date();
            if (date.getFullYear) date = date.getFullYear();
            return (date % 400 == 0 || (date % 4 == 0 && date % 100 != 0));
        },
        //获得星期几
        WEEKDAYS: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
        /**
         *得到指定时间是星期几（中文）
         *@param {Date} date 可选参数，判断的时间，缺省为当前时间
         *@returns {String}
        */
        getChineseWeekDay: function (date) {
            if (!date) date = new Date();
            return this.WEEKDAYS[date.getDay()];
        },

        /**
         *获得指定时间月份的1号是星期几（日历用）
         *@param {Date} date 可选参数，判断的时间，缺省为当前时间
         *@returns {Number}
        */
        getFirstWeekDayOfMonth:function(date){
            date = date ? new Date(date) : new Date();
            date.setDate(1);
            return date.getDay();
        },

        /**
         *获得指定月份一共有几个星期
         *@param {Date} date 可选参数，判断的时间，缺省为当前时间
         *@returns {Number}
        */
        getWeeksOfMonth:function(date){
            if (!date) date = new Date();
            var firstWeekDay = this.getFirstWeekDayOfMonth(date);
            var days = this.getDaysOfMonth(date);
            return Math.ceil((days + (6 - firstWeekDay)) / 7);
        },
        
        // 获取本周一的日期对象
        getThisMonday : function() {
			var nowDate = new Date();
			return new Date(nowDate.getTime() - (nowDate.getDay() - 1) * 86400000);
		},
        
        /**
         *获得距离本周一n天的日期对象
         *@param {n} 距离本周一的天数
         *@returns {Date}
         * example 获取本周天的日期对象:getWeekDateByDays(6)
         * 			
        */
        getWeekDateByDays : function(n){
        	if(!n){
        		n = 0;
        	}
			var weekFirstDay = this.getThisMonday();
			return new Date((weekFirstDay.getTime() / 1000 + n * 86400) * 1000);
        },
        
        /**
         *获得距离指定日期n天的日期对象
         *@param date 指定日期对象 
         *@param {n} 距离指定日期的天数
         *@returns {Date}
         * example 获取明天的日期对象:getDateByDays(new Date(), 1)
         * 			
        */
        getDateByDays : function(date ,n) {
        	if(!date){
        		date = new Date();
        	}
			return new Date(date.getTime() + n * 86400000);
		},
		/**
         *获得毫秒数对应的时间对象
         *@param ms {int} 毫秒数 
         *@returns {Object} {date ： date, hour : hour, minute : minute, second : second}
        */
		getTimeObj : function (ms) {
		   var ss = 1000;
		   var mi = ss * 60;
		   var hh = mi * 60;
		   var dd = hh * 24;
		   var day = parseInt(ms / dd);
		   var hour = parseInt((ms - day * dd) / hh);
		   var minute = parseInt((ms - day * dd - hour * hh) / mi);
		   var second = parseInt((ms - day * dd - hour * hh - minute * mi) / ss);
		   //var milliSecond = ms - day * dd - hour * hh - minute * mi - second * ss;
		   var strDay = day < 10 ? "0" + day : "" + day;
		   var strHour = hour < 10 ? "0" + hour : "" + hour;
		   var strMinute = minute < 10 ? "0" + minute : "" + minute;
		   var strSecond = second < 10 ? "0" + second : "" + second;
		   //var strMilliSecond = milliSecond < 10 ? "0" + milliSecond : "" + milliSecond;
		   //strMilliSecond = milliSecond < 100 ? "0" + strMilliSecond : "" + strMilliSecond;
		   var timeObj = {};
		   timeObj.date = strDay;
		   timeObj.hour = strHour;
		   timeObj.minute = strMinute;
		   timeObj.second = strSecond;
		   return timeObj;
		}
    }

    //兼容老版本接口
    Date.prototype.format = function(template){
        return M139.Date.format(template,this);
    }

    //定义缩写
    $Date = M139.Date;

})(M139);