
; (function (jQuery, _, M139, top) {
    var $ = jQuery;
    M139.namespace("M2012.Calendar.Model.Meeting", Backbone.Model.extend({
        defaults: {
            defaultParams: {
                sendInterval: 0,
                comeFrom: 0,
                //calendarType: 10,
                week: "0000000"
            },
            defaultLabelId: 10, //我的日历
            beforeTypes: {
                "0": 1,             //提前为分钟
                "1": 60,            //提前为小时
                "2": 60 * 24,       //提前为天
                "3": 60 * 24 * 7    //提前为周
            },
            calendarType: {
                calendar: 10, //公历
                lunar: 20 //农历
            },
            datePattens: {
                NORMAL: "{yyyy}-{MM}-{dd}",
                EVERY_YEAR: "{MM}{dd}",
                EVERY_MONTH: "{dd}",

                //另一种传数字的方式
                "0": "{yyyy}-{MM}-{dd}",
                "1": "{MM}{dd}",
                "2": "{dd}"
            }
        },
        initialize: function (options) {
            this.api = M2012.Calendar.API;
            this.master = options.master;
        },
        callAPI: function (funcName, options) {
            this.api.request(funcName, options);
        },
        getLabels: function (callback) {
            var _this = this;
            var params = { actionType: 0 };
            callback = callback || $.noop;

            this.callAPI("calendar:getLabels", {
                data: params,
                success: function (result) {
                    _this.set("labels", result);

                    callback(result);
                },
                error: function () {
                    callback();
                }
            });
        },
        addCalendar: function (data, callback, onfail, onerror) {
            var params = this.get("defaultParams")//默认数据
            data = $.extend(data, params);

            this.callAPI("calendar:addCalendar", {
                data: data,
                success: function (data, json) {
                    if (data.code != "S_OK") {
                        onfail && onfail(data);
                    } else {
                        callback && callback(data, json);
                    }
                },
                error: onerror
            });
        },
        initCalendar: function (callback) {
            this.callAPI("calendar:initCalendar", {
                data: {},
                success: function (result) {
                    var data = result["var"] || {};
                    callback(data);
                },
                error: function () { callback(); }
            });
        },

        joinDate: function (obj, type) {
            var allPattens = this.get("datePattens");
            var patten = allPattens[type] || allPattens[0]; //为空则默认为NORMAL
            var commonApi = this.master.capi;
            return $T.format(patten, {
                yyyy: commonApi.padding(obj.year, 4),
                MM: commonApi.padding(obj.month, 2),
                dd: commonApi.padding(obj.day, 2)
            });
        }
    }));
})(jQuery, _, M139, window._top || window.top);