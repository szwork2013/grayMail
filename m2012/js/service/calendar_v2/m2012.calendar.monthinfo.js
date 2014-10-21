

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





