
; (function (jQuery, _, M139, top) {
    var _class = "M2012.Calendar.Model.Square",
        commonAPI = new M2012.Calendar.CommonAPI();
    M139.namespace(_class, Backbone.Model.extend({
        defaults: {
            keys: []
        },
        initialize: function (options) {
            this.master = options.master;
        },
        clear: function () {
        },
        callAPI : function(fnName, data, fnSuccess, fnError) {
            commonAPI.callAPI({
                data : data,
                fnName : fnName,
                master : this.master
            }, fnSuccess, fnError);
        },
        /**
         * 订阅公共日历
         * @param data {Object} 订阅内容的对象
         * @param fnSuccess {Function} 回掉函数
         * @param fnError {Function} 回掉函数
         */
        subscribeCalendar: function (data, fnSuccess, fnError) {
            this.callAPI("subscribeLabel", data, fnSuccess, fnError);
        },
        /**
         * 退订公共日历
         * @param data {Object} 订阅内容的对象(如果传入的data为number，则自动完成对象转换)
         * @param fnSuccess {Function} 回掉函数
         * @param fnError {Function} 回掉函数
         */
        unsubscribeCalendar: function (data, fnSuccess, fnError) {
            if (typeof data == 'number') {
                data = { labelId: data };
            }
            this.callAPI("cancelSubscribeLabel", data, fnSuccess, fnError);
        },
        /**
         * 获取用户的日历
         * @param data {Object} 订阅内容的对象
         * @param fnSuccess {Function} 回掉函数
         * @param fnError {Function} 回掉函数
         */
        getLabels: function (data, fnSuccess, fnError) {
            this.callAPI("getLabels", data, fnSuccess, fnError);
        },
        /**
         * 获取用户的日历
         * @param data 传递的参数
         * @param fnSuccess {Function} 回掉函数
         * @param fnError 调用接口出错时的处理函数
         */
        getUnitFile: function (data, fnSuccess, fnError) {
            this.callAPI("getUnifiedPositionContent", data, fnSuccess, fnError);
        },
        /**
         * 获取日历分类列表
         */
        getSeriesList : function (data, fnSuccess, fnError) {
            this.callAPI("getAllLabelTypes", data, fnSuccess, fnError);
        },
        /**
         * 获取各分类下的相应的活动
         */
        getCalendarBySeriesId : function (data, fnSuccess, fnError) {
            this.callAPI("getLabelsByType", data, fnSuccess, fnError);
        }
    }));
})(jQuery, _, M139, window._top || window.top);