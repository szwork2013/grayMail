;
(function ($, _, M139, top) {
    var _super = M139.Model.ModelBase,
        _class = "M2012.Calendar.Model.CalendarDetail",
        common = new M2012.Calendar.CommonAPI(),
        api = top.M139.RichMail.API;

    M139.namespace(_class, _super.extend({
        name: _class,
        defaults: {
            //{"startDate":"2014-03-09","excludeType":"2","pageIndex":1,"pageSize":20,"comeFrom":1}
            defaultParams: {
                comeFrom: 0 //todo
            }
        },
        TIP_MSGS: {
            "isNotEmpty": "日历名称不能为空",
            "maxLength": "不能超过30个字"
        },
        initialize: function (options) {
            this.master = options.master;
        },
        /**
         * 每次调用set方法时,都会调用此方法,如果验证通过,则返回false
         * @param param
         * @returns {*}
         */
        validate: function (param) {
            var data = param.labelName;
            if (data) {
                if (data.isValidateNotEmpty && !data.value && data.value === "") {
                    return this.TIP_MSGS["isNotEmpty"];
                }

                if (data.isValidateLength && data.value && data.value.length > 30) {
                    return this.TIP_MSGS["maxLength"];
                }
            }
            return false;
        },
        getCurrentServerTime: function () {
            // 获取服务器当前系统时间(彩云版直接取客户端时间)
            return window.ISOPEN_CAIYUN ? new Date() : M139.Date.getServerTime();
        },
        /**
         * 获取活动时间 如:08:00-09:00
         * @param startTime 活动开始时间
         * @param endTime 活动结束时间
         */
        getTimePeriod: function (startTime, endTime) {
            //开始时间和结束时间一样则显示一个就行
            if (startTime == endTime) {
                return common.transformTime(startTime);
            }
            return common.transformTime(startTime) + "-" + common.transformTime(endTime);
        },
        /**
         * 转化时间,如将2012年3月23日转化成2013-3-23
         * @returns {string}
         */
        getFormatServerTime: function () {
            var result = this.getCurrentServerTime().toLocaleDateString().replace(/[\u4E00-\u9FA5]/g, "-");
            return result.substring(0, result.length - 1);
        },
        callAPI: function (fnName, data, fnSuccess, fnError) {
/**
            commonAPI.callAPI({
                data: data,
                fnName: fnName,
                master: this.master
            }, fnSuccess, fnError);*/

            api && _.isFunction(api.call) && api.call("calendar:" + fnName, data, function(response) {
                fnSuccess && fnSuccess(response["responseData"]);
            }, fnError);

            /**top.$RM.call("calendar:" + fnName, data, fnSuccess, fnError);*/
        },
        /**
         * 获取日历下的所有活动
         * @param data
         * @param fnSuccess
         * @param fnError
         */
        getCalendarsByLabel: function (data, fnSuccess, fnError) {
            data = $.extend(this.get("defaultParams"), data); //默认数据
            this.callAPI("getCalendarsByLabel", data, fnSuccess, fnError);
        },

        /**
         * 获取指定日历的详细信息
         * @param data
         * @param fnSuccess
         * @param fnError
        */
        getLabelById: function (data, fnSuccess, fnError) {
            data = $.extend({ comeFrom: 0 }, data); //默认数据
            this.callAPI("getLabelById", data, fnSuccess, fnError)
        },

        /**
         * 调用订阅接口
         */
        subcribeLabel: function (data, fnSuccess, fnError) {
            this.callAPI("subscribeLabel", data, fnSuccess, fnError);
        },
        /**
         * 调用退订接口
         */
        unSubscribeLabel: function (data, fnSuccess, fnError) {
            this.callAPI("cancelSubscribeLabel", data, fnSuccess, fnError);
        },
        /**
         * 调用接口获取订阅人数,星号等级等信息
         */
        getPublishedLabelByOper: function (data, fnSuccess, fnError) {
            this.callAPI("getPublishedLabelByOper", data, fnSuccess, fnError);
        },
        getElementSize : function (el) {
            return common.getElementSize(el);
        },
        transformTime : function (time) {
            return common.transformTime(time);
        }
    }));
})(jQuery, _, M139, window._top || window.top);
