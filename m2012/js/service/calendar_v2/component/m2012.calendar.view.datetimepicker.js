
/**
 * 日期选择器
 * 其中:各重复类型继承自BaseView
 * 公共方法:
 * view.update({islunar:true}); //设置为农历
 * view.getData(); //获取设置后的对象值
 */
(function (jQuery, _, M139, top) {
    var $ = jQuery;
    //var commonApi=window.$Cal.capi;
    var commonApi = new M2012.Calendar.CommonAPI();
    var superClass = M139.View.ViewBase;
    var CalendarView = M2012.Calendar.CalendarView; //老的日期选择组件

    //#region M2012.Calendar.View.UI.DateTimePicker
    M139.namespace('M2012.Calendar.View.UI.DateTimePicker', superClass.extend({
        initialize: function (options) {

        },
        render: function () {

        },
        update: function () {

        },
        getData: function () {

        }
    }));
    //#endregion

    //#region M2012.Calendar.Model.UI.DateTimePicker
    M139.namespace('M2012.Calendar.Model.UI.DateTimePicker', Backbone.Model.extend({
        defaults: {
            //基础值,以下参数,所有以l开头的内容,都是表示农历数据
            calendarType: 10,
            //date: new Date(),
            //time: "0800", //默认时间

            adjust:false, //保留设置项,如果提供的时间,小于最小可设置的时间,自动将时间调整为最小的可设置时间

            //设置项
            islunar: false,
            isfullday: false,

            //默认配置
            _calendarTypes: { 0: 10, 1: 20 }, //公农历对应的calendarType
            _maxDays: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], //每个月最大的天数,用于每年重复时选择
            _lmaxDays:30,
            _minuteData: [0, 15, 30, 45], //分钟选项

            _months: {
                0: { //公历
                    arr: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],//原始数组
                    data: [], //保存可供日历下拉列表菜单实用的数组
                    map: {} //保存可快速索引下拉菜单位置的对象
                },
                1: { //农历
                    arr: ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"],
                    data: [],
                    map: {}
                }
            },
            _days: {
                0: { //公历
                    arr: (function () { //00-31的字符串数组
                        var list = [];
                        for (var i = 0; i <= 31; i++) {
                            list.push(commonApi.padding(i, 2));
                        }
                        return list;
                    })(),
                    data: [], //保存可供日历下拉列表菜单实用的数组
                    map: {} //保存可快速索引下拉菜单位置的对象
                },
                1: { //农历
                    arr: ['-', '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                        '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', //不要用廿十,  廿就是二十
                        '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'],
                    data: [],
                    map: {}
                }
            },
            _weeks:['一','二','三','四','五','六','日'],

            //内部对象
            _monthMap: {},
            _dayMap: {},
            _timeMap: {}
        },
        initialize: function (options) {
            var _this = this;

            var time = _this.splitTime(options);

            _this.set(time, { silent: true });
            _this.bindEvents();
        },
        bindEvents: function () {
            var _this = this;
            _this.on("change:islunar", function () {
                var islunar = _this.get("islunar");
                var type = _this.get("_calendarTypes")[0 + islunar];
                _this.set("calendarType", type)
            });
        },
        splitTime: function (options) {
            //从参数中获取时间部分的值
            var time = options.time;

            //顺便对字符串内容容错,不对数据容错
            var hour = Math.floor(parseInt(time, 10) / 100), //取时间部分,超过24,不做容错
                minute = parseInt(time.substr(time.length - 2, 2), 10), //获取分钟部分,并转换成数值,超过60,不做容错
                time = commonApi.padding(hour, 2) + commonApi.padding(minute, 2); //不直接取time了

            return {
                hour: hour,
                minute: minute,
                time: time
            };
        },
        getMonthList: function () {
            var _this = this,
                islunar = _this.get("islunar");
            var obj = _this.get("_months"),
                months = obj[0 + !!islunar]; //获取公历或者农历的对象, 0+true=1

            //设置最早的月份
            var after = _this.get("after") || {};
            var start = after.month || 0;
            //end

            if (months.data.length == 0) {
                var arr = months.arr;
                var index = 0;
                for (var i = start, len = arr.length; i < len; i++) {
                    var key = arr[i]; //"01"或"正" 等字符串
                    months.data.push({
                        text: key + "月",
                        data: {
                            index:index,
                            month: i //1月 = 0
                        }
                    });
                    months.map[i] = index; //记录月份所在位置

                    index++;
                }
            }

            _this.set("_monthMap", months.map);
            return months.data;
        },
        getDayList: function () {
            var _this = this,
                islunar = _this.get("islunar");
            var dayObj = _this.get("_days"),
                days = dayObj[0 + !!islunar];

            //#region 创建对象
            var arr = days.arr;
            var text = !!islunar ? "" : "日";

            //#region 计算可以选择的天数范围
            var index = 0, //索引位置
                after = _this.get("after") || {},
                month = _this.get("month");
            var start = (month <= after.month) ? //判断选中的月份是否是允许选择的最小月份
                        after.day : 1;
            //#endregion

            days.data = [], days.map = {}; //重置
            for (var i = start, len = arr.length; i < len; i++) {
                var key = arr[i];

                days.data.push({
                    text: key + text,
                    data: {
                        index: index,
                        day: i //1月 = 0
                    }
                });
                days.map[i] = index;

                index++;
            }
            //#endregion

            _this.set("_dayMap", days.map);
            return days.data;
        },
        getTimeList: function () {
            var _this = this,
                minuteList = _this.get("_minuteData"),
                len = minuteList.length;
            var index = 0,
                list = [],
                _timeMap = {};

            for (var hour = 0; hour < 24; hour++) {
                for (var i = 0; i < len; i++) {
                    var minute = minuteList[i];
                    var hh = commonApi.padding(hour, 2),
                        mm = commonApi.padding(minute, 2);
                    var item = {
                        text: hh + ":" + mm,
                        data: {
                            hour: hour,
                            minute: minute,
                            time: hh + mm
                        }
                    };

                    //加到显示列表
                    list.push(item);

                    //加到索引列表
                    _timeMap[hh + mm] = {
                        index: index,
                        item: item
                    };

                    index++;
                }
            }

            _this.set("_timeMap", _timeMap);
            return list;
        },
        getMonthText: function (month) {
            //传入月份,返回诸如"01月"和"正月"的月份字符串
            var _this = this,
                islunar = _this.get("islunar"),
                months = _this.get("_months");
            var data = months[0 + !!islunar],
                arr = data.arr,
                today = new Date();
            var text = (arr[month] || arr[today.getMonth()]) + "月"; //没传月份默认返回当前月
            return text;
        },
        getDayText: function (day) {
            var _this = this,
                islunar = _this.get("islunar"),
                days = _this.get("_days")[0 + !!islunar],
                arr = days.arr,
                today = new Date();
            var dayText = islunar ? '' : '日';
            
            var text = arr[day || today.getDate()] + dayText;
            return text;
        }
    }));
    //#endregion

    //#region M2012.Calendar.View.UI.DateTimePicker.BaseView
    M139.namespace('M2012.Calendar.View.UI.DateTimePicker.BaseView', superClass.extend({
        template: ['<div class="fl" data-type="date"></div>',
                    '<div class="fl" data-type="month"></div>',
                    '<div class="fl" data-type="day"></div>',
                    '<div class="fl" data-type="time"></div>'].join(""),
        initialize: function (options) {
            var _this = this;
            //默认值
            options = $.extend({
                isfullday: false,
                islunar: false,
                time: _this.getTime(options.timeType || 'closest') //获取默认时间,closest表示最接近的一个时间点
            }, options);

            _this.container = options.container;
            if (!_this.container) {
                throw new Error("供组件显示的容器不允许为空: parameter undefined"); //参数不全
            }
            else {
                _this.container.html(_this.template);
                _this.$el = _this.container;
            }

            _this.model = new M2012.Calendar.Model.UI.DateTimePicker(options);

            //渲染
            _this.render();
            _this.bindEvents();
            return _this;
        },
        render: function () {
            //override
        },
        bindEvents: function () {
            //override 事件绑定
        },
        getData: function () {
            //获取数据,根据各类中配置的returnData数据返回
            var _this = this;
            var arr = _this.returnData || [];
            var returnValue = {};
            for (var i = arr.length - 1; i >= 0; i--) {
                var key = arr[i];
                returnValue[key] = _this.model.get(key);
            }

            return returnValue;
        },
        getTime:function(type){
            var date = new Date(),
                step=15, minutes = 60, hours = 24, //步长,每小时的分钟数,每天的小时数
                totalMinutes;
            var time = '';

            switch (type) {
                case 'closest':
                    //往后计算,间隔最少一个step单位,如现在时间为14:40,则下一个可选的时间为15:00  (需要根据产品需求调整)
                    totalMinutes = date.getHours() * minutes + Math.ceil((date.getMinutes() + step) / step) * step;
                    //注:以下计算,在23:45--23:59之间时有bug,因为需要联动日期选择器往后加一天,目前不处理
                    time = commonApi.padding(Math.floor(totalMinutes / minutes) % hours) + commonApi.padding(totalMinutes % minutes); 
                    break;
                default:
                    time = '0800'
                    break;
            }

            return time;
        },
        createDateDropMenu: function () {
            //在对应位置,创建下拉组件,并绑定点击事件和回调
            var _this = this;

            //通过组件创建一个显示的壳,点击功能自行绑定.
            var date = _this.model.get("date"),
                elemId = _this.cid + "_date",
                container = _this.getContainer("date");

            container.addClass("mr_10"); //间距
            container.attr("id", elemId);

            _this.DateDropMenu = new M2012.Calendar.View.CalendarDropMenu().create({
                defaultText: M139.Date.format("yyyy-MM-dd", date),
                container: container,
                width: "130px" //长度足以显示公农历
            });
            _this.DateDropMenu.container = container; //保存起来,方便后续用
            _this.DateDropMenu.disable(); //年月日选择的,不需要触发下拉

            //#region 日历选择器
            if (_this.datePicker) {
                _this.datePicker.hide();
                _this.datePicker = null;
            }
            _this.datePicker = new CalendarView({
                date2StringPattern: 'yyyy-MM-dd',
                id: elemId,
                callback: function (date, dateObj) {
                    //将所有数据保存下来,方便其他地方用
                    _this.model.set({
                        "date": date,
                        "year": date.getFullYear(),
                        "month": date.getMonth(),
                        "day": date.getDate(),
                        "lyear": dateObj.lyear,
                        "lmonth": dateObj.lmonth,
                        "lday": dateObj.lday
                    }, { silent: true });
                    var text = _this.model.get("islunar") ? dateObj.ldate : dateObj.date;
                    _this.DateDropMenu.setText(text);
                }
            });
            //#endregion
        },
        createMonthDropMenu: function () {
            var _this = this;

            var container = _this.getContainer("month"),
                monthItems = _this.model.getMonthList();

            container.addClass("mr_10"); //间距

            var options = {
                container: container,
                menuItems: monthItems,
                width: '75px'
            };

            //#region 获取默认值或者选项
            var islunar = _this.model.get("islunar"),
                month = (islunar ? _this.model.get("lmonth") : _this.model.get("month")) || 0; //获取月份,好像没意义,都是一个值
            var monthMap = _this.model.get("_monthMap"),
                index = monthMap[month]; //月份所在的位置index
            if (typeof (index) == "number") {
                options = $.extend(options, { selectedIndex: index });
            } else {
                var text = _this.model.getMonthText(month);
                options = $.extend(options, { defaultText: text });
            }
            //#endregion

            _this.MonthDropMenu = new M2012.Calendar.View.CalendarDropMenu().create(options);

            //变量存储及事件回调
            _this.MonthDropMenu.container = container;
            _this.MonthDropMenu.on("change", function (item) {
                var month = item.data.month;

                //显示月,则表示选中了每年重复,公农历统一
                _this.model.set({
                    "month": month,
                    "lmonth": month
                });
            });
        },
        createDayDropMenu: function () {
            var _this = this;
            var container = _this.getContainer("day"),
                dayItems = _this.model.getDayList();

            container.addClass("mr_10"); //间距

            var options = {
                container: container,
                menuItems: dayItems,
                width: '75px'
            };

            //#region 显示默认
            var day = _this.model.get("day");
            var text = _this.model.getDayText(day);
            options = $.extend(options, { defaultText: text });
            //#endregion

            _this.DayDropMenu = new M2012.Calendar.View.CalendarDropMenu().create(options);

            _this.DayDropMenu.container = container;
            _this.DayDropMenu.on("change", function (item) {
                var day = item.data.day;
                _this.model.set({
                    "day": day,
                    "lday": day
                });
            });
        },
        createTimeDropMenu: function () {
            var _this = this,
                model = _this.model;

            var container = _this.getContainer("time"),
                timeItems = model.getTimeList();

            var options = {
                container: container,
                menuItems: timeItems,
                width: '75px'
            };

            //#region 默认的显示项
            var time = model.get("time"),
                timeObj = model.get("_timeMap"),
                item = timeObj[time], //从索引里面找选项位置
                index = (item && item.index) || 0;

            if (!item) {
                //传入的时间不在下拉列表中,则手工设置显示内容
                time = commonApi.padding(model.get("hour"), 2) + ":" + commonApi.padding(model.get("minute"), 2); //08:00
                options = $.extend(options, { defaultText: time });
            } else {
                options = $.extend(options, { selectedIndex: index });
            }
            //#endregion

            _this.TimeDropMenu = new M2012.Calendar.View.CalendarDropMenu().create(options);

            _this.TimeDropMenu.container = container;
            _this.TimeDropMenu.on("change", function (item) {
                _this.model.set({
                    hour: item.data.hour,
                    minute: item.data.minute,
                    time: item.data.time
                }, { silent: true });
            });
        },
        getContainer: function (name) {
            var _this = this;
            var container = _this.$el.find('[data-type="' + name + '"]');
            return container;
        },
        update: function (params) {
            var _this = this;
            _this.model.set(params);
        }
    }));
    //#endregion


    //-----------------------------------------------
    //   以下选择器都是单个的,需要联动需要自己处理
    //-----------------------------------------------

    var baseView = M2012.Calendar.View.UI.DateTimePicker.BaseView;

    //#region M2012.Calendar.View.UI.DateTimePicker.Date
    M139.namespace('M2012.Calendar.View.UI.DateTimePicker.Date', baseView.extend({
        returnData: ['calendarType', 'islunar', 'isfullday', 'datestr', 'ldatestr', 'ldate', 'date',
                    'time', 'year', 'lyear', 'month', 'lmonth', 'day', 'lday', 'hour', 'minute'],
        viewType: 'date',
        /**
        new M2012.Calendar.View.UI.DateTimePicker.Date({
            container:$("#divId"), //jq elem
            date:'2012-11-11', //字符串或Date对象,只接受公历时间.如果islunar为true,则自动将该公历时间转成农历
            time:'0830',
            islunar:false,
            isfullday:false
        });
        */
        initialize: function (options) {
            var _this = this;

            var defaults = _this.getDefaultData(options);
            //return baseView.prototype.initialize.call(_this, defaults); //统一用apply吧...
            return baseView.prototype.initialize.apply(_this, [defaults]);
        },
        getDefaultData: function (options) {

            //#region 日期部分
            var date = new Date();
            var type = $.type(options.date);
            switch (type) {
                case 'date':
                    date = options.date;
                    break;
                case 'string':
                    var obj = commonApi.checkDateStr(options.date);
                    if (obj) {
                        date = new Date(obj.year, obj.month, obj.date);
                    }
                    break;
                default:
                    break;
            }

            var ldate = commonApi.createDateObj(date);
            //#endregion

            return {
                container: options.container,
                islunar: options.islunar,
                isfullday: options.isfullday,
                date: date,
                year: date.getFullYear(),
                month: date.getMonth(),
                day: date.getDate(),
                lyear: ldate.lYear,
                lmonth: ldate.lMonth,
                lday: ldate.lDay,
                time: options.time
            };
        },
        render: function () {
            var _this = this;
            _this.createDateDropMenu();
            _this.createTimeDropMenu();
        },
        bindEvents: function () {
            var _this = this,
                model = _this.model;

            var dateMenu = _this.DateDropMenu,
                timeMenu = _this.TimeDropMenu;

            //#region 内部事件监听
            model.on("change:islunar", function () {
                var islunar = model.get("islunar"),
                    date = model.get("date"),
                    dateObj = commonApi.createDateObj(date),
                    text = islunar ? dateObj.ldate : dateObj.date;

                model.set({
                    "datestr": "" + dateObj.sYear + "-" + commonApi.padding(dateObj.sMonth, 2) + "-" + commonApi.padding(dateObj.sDay, 2), //2014-01-01
                    "ldatestr": "" + dateObj.lYear + "-" + commonApi.padding(dateObj.lMonth, 2) + "-" + commonApi.padding(dateObj.lDay, 2), //2013-12-01
                    "ldate": dateObj.ldate
                });

                dateMenu.setText(text);
            }).on("change:isfullday", function () {
                var isfullday = model.get("isfullday"),
                    funcName = isfullday ? "addClass" : "removeClass";

                timeMenu.container[funcName]("hide"); //addClass or removeClass
            });
            //#endregion

            //#region 通知到外部事件
            var returnKeys = _this.returnData;
            model.on("change:date", function () {
                _this.trigger("change", _this.getData());
            });
            //#endregion

            //初始化
            model.trigger("change:islunar").trigger("change:isfullday");
        }
    }));
    //#endregion

    //#region M2012.Calendar.View.UI.DateTimePicker.PerYear
    M139.namespace('M2012.Calendar.View.UI.DateTimePicker.PerYear', baseView.extend({
        returnData: ['calendarType', 'islunar', 'isfullday', 'month', 'lmonth', 'day', 'lday', 'time','hour','minute'],
        /**
        new M2012.Calendar.View.UI.DateTimePicker.PerYear({
            container:$("#divId"), //jq elem
            date:'0201', //表示每年的2月1日
            time:'0800',
            islunar:false,
            isfullday:false
        });
        */
        initialize: function (options) {
            var _this = this;

            var defaults = _this.getDefaultData(options);
            return baseView.prototype.initialize.apply(_this, [defaults]);
        },
        getDefaultData: function (options) {
            var _this = this;

            var date = options.date;
            var today = new Date();
            var month = Math.floor(parseInt(date, 10) / 100) - 1 || today.getMonth(), //月份用0-11表示.要减一,
                day = parseInt(date.substr(date.length - 2, 2), 10) || today.getDate();

            var data = {
                container: options.container,
                islunar: options.islunar,
                isfullday: options.isfullday,
                after: options.after || { month: 0, day: 1 }, //只可以选xx月xx日之后的
                date: date,
                month: month,
                day: day,
                lmonth: month,
                lday: day,
                time: options.time
            };
            return data;
        },
        render: function () {
            var _this = this;

            _this.createMonthDropMenu();
            _this.createDayDropMenu();
            _this.createTimeDropMenu();
        },
        bindEvents: function () {
            var _this = this,
                model = _this.model;

            model.off("change:islunar").off("change:month");
            
            model.on("change:islunar", function () {
                _this.render(); //日月变了重新渲染
                _this.bindEvents();
            }).on("change:month", function () {
                var month = model.get("month"),
                    after = model.get("after"),
                    last = model.previous("month"); //选择之前的月份
                month = Math.min(month, last);
                if (month <= after.month) {
                    console.log("rebuild day dropmenu");
                    _this.createDayDropMenu();
                }
            })
        },
        getData: function () {
            var obj = baseView.prototype.getData.apply(this);
            var islunar = obj.islunar,
                month = islunar ? obj.lmonth : obj.month,
                day = islunar ? obj.lday : obj.day;

            //按需返回
            var data = {
                calendarType: obj.calendarType,
                islunar: islunar,
                isfullday: obj.isfullday,
                month: month,
                day: day,
                time: obj.time,
                hour: obj.hour,
                minute:obj.minute,
                date: commonApi.padding((month + 1), 2) + commonApi.padding(day, 2) //0311
            }

            return data;
        }
    }));
    //#endregion

    //#region M2012.Calendar.View.UI.DateTimePicker.PerMonth
    M139.namespace('M2012.Calendar.View.UI.DateTimePicker.PerMonth', baseView.extend({
        returnData: ['calendarType', 'islunar', 'isfullday', 'date', 'day', 'lday', 'time', 'hour', 'minute'],
        /**
         * 显示每月选项
         * new M2012.Calendar.View.UI.DateTimePicker.PerMonth({
         *     container:$("#divId"),
         *     date:"12", //每月12号或每月农历十二,由islunar决定
         *     time:"0830", //时间
         *     islunar:false, //是否农历
         *     isfullday:false //是否全天
         * });
         */
        initialize: function (options) {
            var _this = this;

            var defaults = _this.getDefaultData(options)
            baseView.prototype.initialize.apply(_this, [defaults]);
        },
        getDefaultData: function (options) {
            var _this = this;

            var date = options.date,
                day = parseInt(date, 10);
            if (!day) day = new Date().getDate();

            var data = {
                container: options.container,
                islunar: options.islunar,
                isfullday: options.isfullday,
                date:commonApi.padding(day,2),
                day: day,
                lday: day,
                time: options.time
            };

            return data;
        },
        render: function () {
            var _this = this;
            _this.createDayDropMenu();
            _this.createTimeDropMenu();
        },
        bindEvents: function () {
            var _this = this;
            _this.model.on("change:islunar", function () {
                _this.render(); //
            });
        },
        getData: function () {
            var _this = this;
            var obj = baseView.prototype.getData.apply(_this);
            var data = {
                calendarType: obj.calendarType,
                islunar: obj.islunar,
                isfullday: obj.isfullday,
                date: obj.date,
                day: obj.islunar ? obj.day : obj.lday,
                time: obj.time,
                hour: obj.hour,
                minute: obj.minute
            };

            return data;
        }
    }));
    //#endregion

    //#region M2012.Calendar.View.UI.DateTimePicker.PerWeek
    M139.namespace('M2012.Calendar.View.UI.DateTimePicker.PerWeek', baseView.extend({
        returnData: ['calendarType', 'islunar', 'isfullday', 'week', 'time', 'hour', 'minute'],
        weekTemplate: ['<input type="checkbox" data-index="{index}" class="mr_5" id="{cid}_checkweek_{index}" name="{cid}_checkweek_{index}" {checked}>',
                    '<label class="mr_10" for="{cid}_checkweek_{index}">周{text}</label>'].join(""),
        /**
         * var perWeeks=new M2012.Calendar.View.UI.DateTimePicker.PerWeek({
         *     container:$("#div1"), //用于显示时间,必须
         *     container2:$("#div2"), //用于显示星期,必须
         *     date:"00000001", //周一至周日顺序,1表示选中
         *     time:"0830",
         *     islunar: false, //没意义
         *     isfullday: false //是否全天
         * });
         */
        initialize: function (options) {
            var _this = this;

            var defaults = _this.getDefaultData(options);
            _this.container2 = defaults.container2; //只适用于每月
            baseView.prototype.initialize.apply(_this, [defaults]);
        },
        getDefaultData:function(options){
            var _this = this,
                date = options.date || "0000000",
                week = [];

            $.each(date, function (i, item) { week.push(parseInt(item)); }); //字符串转成数组

            var data = {
                container: options.container, //用来显示时间
                container2: options.container2, //用来星期选择组件,星期比较特殊,需要2个容器来显示
                islunar: options.islunar,
                isfullday: options.isfullday,
                week: week,
                time: options.time
            }
            return data;
        },
        render: function () {
            var _this = this;

            _this.createWeekSelector();
            _this.createTimeDropMenu();
        },
        createWeekSelector: function () {
            //这个方法具有特殊性
            var _this = this,
                model=_this.model;
            var domTemplate = _this.weekTemplate,
                weeksText = model.get("_weeks"),
                week = model.get("week");
            var html = [];
            for (var i = 0, len = weeksText.length; i < len; i++) {
                var item = $T.format(domTemplate, {
                    index: i,
                    cid: _this.cid,
                    text: weeksText[i],
                    checked: !!week[i] ? "checked" : ""
                });
                html.push(item);
            }
            
            //事件绑定
            _this.container2.html(html.join(""));
            _this.container2.find('input[type="checkbox"]').bind("click", function () {
                var input = $(this);
                var ischecked = !!input.attr("checked"),
                    index = input.data("index");
                var week = model.get("week");
                week[index] = 0 + ischecked;
                model.set('week', week);
            });
        },
        getData: function () {
            var _this = this;
            var obj = baseView.prototype.getData.apply(_this);
            var week = obj.week.join(""); //将数组转成字符串
            obj = $.extend(obj, { week: week });
            return obj;
        }
    }));
    //#endregion

    //#region M2012.Calendar.View.UI.DateTimePicker.PerDay
    M139.namespace('M2012.Calendar.View.UI.DateTimePicker.PerDay', baseView.extend({
        returnData: ['calendarType', 'islunar', 'isfullday', 'time', 'hour', 'minute'],
        /**
         * 注: 每天重复没有date入参
         * var perWeeks=new M2012.Calendar.View.UI.DateTimePicker.PerWeek({
         *     container:$("#div1"), //jq object
         *     time:"0830",
         *     islunar: false, //没意义
         *     isfullday: false //是否全天
         * });
         */
        initialize: function (options) {
            var _this = this;
            
            var defaults = _this.getDefaultData(options);
            baseView.prototype.initialize.apply(_this, [defaults]); 
        },
        getDefaultData: function (options) {
            var _this = this;
            var data = {
                container: options.container,
                islunar: options.islunar,
                isfullday: options.isfullday,
                time: options.time
            };

            return data;
        },
        render:function(){
            var _this = this;

            _this.createTimeDropMenu();
        }
    }));
    //#endregion
})(jQuery, _, M139, window._top || window.top);