; (function ($, _, M139, top) {

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