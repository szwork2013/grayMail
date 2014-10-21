;
(function ($, _, M139, top) {

    var superClass = M139.Model.ModelBase,
        _class = "M2012.Calendar.Model.Popup.FastSchedule",
        commonAPI = new M2012.Calendar.CommonAPI();

    M139.namespace(_class, superClass.extend({
        initialize: function (options) {
            this.master = options.master;
        },
        /**
         * @param obj 包括需要传递给接口的参数,回调函数名称,以及master
         * @param fnSuccess
         * @param fnError
         */
        addCalendar : function (obj, fnSuccess, fnError) {
            var param = {
                data : $.extend({ validImg: "", dateDesc: "", calendarType: 11 }, obj)
            };

            $.extend(param, {
                master : this.master,
                fnName : "addCalendar"
            });
            commonAPI.callAPI(param, fnSuccess, fnError);
        },
        /**
         * 根据不同的粒度,记录不同的行为日志
         * @param scheduleTemp 粒度:每年,每月,每周,每日
         */
        addBehaviour : function (scheduleTemp) {
            var templates = M2012.Calendar.Constant.scheduleTempMap;
            if (scheduleTemp  == templates.dayTemp) {
                this.master.capi.addBehavior("calendar_adddayact_success");
            }else if (scheduleTemp  == templates.weekTemp) {
                this.master.capi.addBehavior("calendar_addweekact_success");
            }else if (scheduleTemp  == templates.monthTemp) {
                this.master.capi.addBehavior("calendar_addmonthact_success");
            }else if (scheduleTemp  == templates.yearTemp) {
                this.master.capi.addBehavior("calendar_addyearact_success");
            }
        }
    }));

})(jQuery, _, M139, window._top || window.top);
