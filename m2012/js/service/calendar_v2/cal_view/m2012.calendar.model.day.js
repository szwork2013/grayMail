
; (function ($, _, M139, top) {

    var superClass = M139.Model.ModelBase;
    var _class = "M2012.Calendar.Model.Day";

    M139.namespace(_class, superClass.extend({

        master: null,

        EVENTS: {

            MAX_COUNT: 3,
            //加载视图数据
            LOAD_VIEW_DATA: "day#load_view_data"
        },

        initialize: function (args) {
            var self = this;
            args = args || {};

            self.master = args.master;
        },

        getData: function (fnSuccess, fnError) {

            var self = this;
            var capi = self.master.capi;

            var date = $Date.format("yyyy-MM-dd", new Date(
                self.master.get("year"),
                self.master.get("month") - 1,
                self.master.get("day"))
                );

            var param = {
                maxCount: self.EVENTS.MAX_COUNT,
                startDate: date,
                endDate: date,
                actionType: 2
            };
            var BIRTH = 1;
            var specialTypes = self.master.get("includeTypes");
            var _labels = self.master.get("checklabels");
            //2. specialTypes存在的时候，不传includeLabels，只传送 lncludeTypes
            if (_.isArray(specialTypes) && !_.isEmpty(specialTypes)
               && _.every(specialTypes, function (i) { return i == BIRTH })) {
                param.includeTypes = specialTypes.join(",");

                //3. 标签只有一个，并且不是 我的日历 的系统标签ID，场景是左下方订阅日历，删除元素，适应后台接口
            } else if (_labels.length === 1 && _.indexOf(_labels, "10") < 0) {
                param.includeLabels = _labels.join(",");

            } else {
                param.includeLabels = _labels.join(",");
            }

            //特殊类型为空或0时无需传该参数至接口
            if (param.includeTypes == "" || param.includeTypes == "0") {
                delete param.includeTypes;
            }

            self.master.trigger(self.master.EVENTS.REQUIRE_API, {

                success: function (api) {
                    api.getCalendarView({
                        data: param,
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

                                fnSuccess && fnSuccess(self.filterData(data));

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
        *  过滤数据
        */
        filterData: function (result) {
            var self = this;
            result = result || {};
            var utils = M2012.Calendar.CommonAPI.Utils;
            var capi = self.master.capi;


            var table = {};
            for (var key in result) {

                var value = result[key].info;
                if (value && value.length > 0) {
                    for (var i = 0; i < value.length; i++) {
                        var item = value[i];
                        var date = self.master.capi.parse(key);
                        var lunar = new capi.Lunar(date);

                        $.extend(item, {
                            sTime: utils.fixTimeToHour(item.startTime),
                            eTime: utils.fixTimeToHour(item.endTime),
                            title: $T.Html.encode(item.title || "无标题"),
                            enable: item.enable || 0,
                            cDay: capi.cDay(lunar.day),
                            day: date.getDate()
                        });

                        var hour = self.getHour(item.sTime, item.allDay);
                        if (!table[hour]) {
                            table[hour] = [];
                        }

                        table[hour].push(item);
                    }
                }

            }

            return table;
        },

        /**
         * 获取当前时间的小时数
         */
        getHour: function (strhm, isAllDay) {
            var hm = null;
            if (isAllDay) {
                return 100;
            }
            hm = strhm.split(":");
            return hm[0];
        },



        /**
         * 获取当前小时时间信息
         */
        getCurrentHour: function () {
            var now = window.ISOPEN_CAIYUN ? new Date() : M139.Date.getServerTime();
            return {
                hour: now.getHours(),
                week: now.getDay(),
                min: now.getMinutes(),
                curDateStr: $Date.format('yyyy-MM-dd', now)
            };
        }


    }));

})(jQuery, _, M139, window._top || window.top);