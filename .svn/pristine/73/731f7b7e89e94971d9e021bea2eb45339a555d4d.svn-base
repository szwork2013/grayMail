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