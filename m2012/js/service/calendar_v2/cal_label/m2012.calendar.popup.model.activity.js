;
(function ($, _, M139, top) {
    var _super = M139.Model.ModelBase,
        _class = "M2012.Calendar.Popup.Model.Activity", //M2012.Calendar.Model
        commonAPI = new M2012.Calendar.CommonAPI();

    M139.namespace(_class, _super.extend({
        name: _class,
        TIP_MSGS:{
            "isNotEmpty": "日历名称不能为空",
            "maxLength": "不能超过30个字"
        },
        initialize: function (options) {
            this.master = options.master;
        },
        /**
         * 直接使用新模板创建日历时需要调用的接口
         * @param data  调用接口需要传递的参数
         * @param fnSuccess 调用接口成功时的回调函数
         * @param fnError 调用接口异常时的回调函数(如网路异常问题)
         */
        getLabels: function (data, fnSuccess, fnError) {
            commonAPI.callAPI({
                data : data,
                fnName : "getLabels",
                master : this.master
            }, fnSuccess, fnError);
        },

        /**
         * 添加活动
         * @param data
         * @param fnSuccess
         * @param fnError
         */
        addCalendar : function (data, fnSuccess, fnError) {
            commonAPI.callAPI({
                data : data,
                fnName : "addCalendar",
                master : this.master
            }, fnSuccess, fnError);
        }
    }));
})(jQuery, _, M139, window._top || window.top);
