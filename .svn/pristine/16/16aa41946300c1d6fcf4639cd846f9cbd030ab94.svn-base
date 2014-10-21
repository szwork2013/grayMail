
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