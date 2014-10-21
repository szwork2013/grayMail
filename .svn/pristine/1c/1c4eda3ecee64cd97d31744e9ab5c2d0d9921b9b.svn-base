
; (function (jQuery, _, M139, top) {
    var $ = jQuery;
    var interval,
        commonAPI = new M2012.Calendar.CommonAPI();

    M139.namespace("M2012.Calendar.Popup.Model.Countdown", Backbone.Model.extend({
        defaults: {
            defaultParams: {
                sendInterval: 0,
                comeFrom: 0,
                week: "0000000",
                specialType : 3,  // 倒数日标记
                calendarType : 10, // 默认为农历
                labelId : 10  // 活动默认属于"我的日历"
            }
        },
        initialize: function (options) {
            this.master = options.master;
        },
        getCurrentServerTime : function () {
            // 实时获取服务器的当前系统时间
            return M2012.Calendar.CommonAPI.getCurrentServerTime();
        },
        clearTimeout : function () {
            // 退出界面时清除定时器
            M2012.Calendar.CommonAPI.clearTimeout();
        },
        calculateCountdown : function(datetime, callback) {
            // 改变设置时间时,倒计时时间也应该改变
            M2012.Calendar.CommonAPI.calculateCountdown(datetime, callback);
        },
        callAPI: function (funcName, data, fnSuccess, fnError) {
            commonAPI.callAPI({
                data : data,
                fnName : funcName,
                master : this.master
            }, fnSuccess, fnError);
        },
        addCalendar: function (data, fnSuccess, fnError) {
            data = $.extend(data, this.get("defaultParams")); //默认数据
            this.callAPI("addCalendar", data, fnSuccess, fnError);
        },
        transform : function (remindObj) {
            return commonAPI.transform(remindObj);
        },
        /**
         * 根据服务器端返回的异常码从公共API中获取对应的异常信息
         * @param errorCode
         * @returns {*}
         */
        getUnknownExceptionInfo : function (errorCode) {
            return commonAPI.getUnknownExceptionInfo(errorCode);
        }
    }));
})(jQuery, _, M139, window._top || window.top);