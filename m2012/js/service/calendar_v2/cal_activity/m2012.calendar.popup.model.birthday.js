
; (function (jQuery, _, M139, top) {
    var commonAPI = new M2012.Calendar.CommonAPI();
    M139.namespace('M2012.Calendar.Popup.Model.Birthday', Backbone.Model.extend({
        defaults: {
            keys: []
        },
        initialize: function (options) {
            this.master = options.master;
        },
        clear: function () {
            var _this = this;
            _this.attributes = _this.defaults;
        },
        /**
         * 调用公共的API接口
         * @param funcName
         * @param data
         * @param fnSuccess
         * @param fnError
         */
        callAPI: function (funcName, data, fnSuccess, fnError) {
            data.comeFrom = 0; // 写死先，后续调用配置
            commonAPI.callAPI({
                data : data,
                fnName : funcName,
                master : this.master
            }, fnSuccess, fnError);
        },
        /**
         * 添加生日活动
         * @param data {Object} 创建生日参数
         * @param fnSuccess
         * @param fnError
         */
        addCalendar: function (data, fnSuccess, fnError) {
            this.callAPI("addCalendar", data, fnSuccess, fnError);
        }
    }));
})(jQuery, _, M139, window._top || window.top);