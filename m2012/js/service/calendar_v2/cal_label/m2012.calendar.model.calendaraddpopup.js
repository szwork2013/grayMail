;
(function ($, _, M139, top) {
    var _super = M139.Model.ModelBase,
        _class = "M2012.Calendar.Model.CalendarAddPopup",
        commonAPI = new M2012.Calendar.CommonAPI();

    M139.namespace(_class, _super.extend({
        name: _class,
        defaults: {
            defaultParams: {
                comeFrom : 0,
                labelId : 0,
                description : '',   //标签描述
                isPublic : 0
            }
        },
        TIP_MSGS:{
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
                if(data.isValidateNotEmpty && !data.value && data.value === "") {
                    return this.TIP_MSGS["isNotEmpty"];
                }

                if (data.isValidateLength && data.value && data.value.length > 30) {
                    return this.TIP_MSGS["maxLength"];
                }
            }
            return false;
        },
        /**
         * 直接使用新模板创建日历时需要调用的接口
         * @param data  调用接口需要传递的参数
         * @param fnSuccess 调用接口成功时的回调函数
         * @param fnError 调用接口异常时的回调函数(如网路异常问题)
         */
        addLabel: function (data, fnSuccess, fnError) {
            data = $.extend(data, this.get("defaultParams")); //默认数据
            commonAPI.callAPI({
                data : data,
                fnName : "addLabel",
                master : this.master
            }, fnSuccess, fnError);
        },
        /**
         * @param data
         * @param fnSuccess
         * @param fnError
         */
        getLabels : function (data, fnSuccess, fnError){
            commonAPI.callAPI({
                data : data,
                fnName : "getLabels",
                master : this.master
            }, fnSuccess, fnError);
        },
        /**
         * 判断页面输入的名称是否已经存在
         * @param labelNameArr  用户已经创建的日历集合
         * @param labelName 页面上输入的日历名称
         */
        isLabelNameExist : function (labelNameArr, labelName) {
            labelNameArr = [].slice.call(labelNameArr);
            if (labelNameArr instanceof Array) {
                for (var i = 0, len = labelNameArr.length; i < len; i++) {
                    if (labelNameArr[i].labelName && labelNameArr[i].labelName === labelName) {
                        return true;
                    }
                }
            }
            return false;
        },
        /**
         * 判断用户已经创建的日历是否达到最大数
         */
        isExtendMax : function (length) {
            return (length === 10);
        }
    }));
})(jQuery, _, M139, window._top || window.top);
