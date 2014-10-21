;
(function ($, _, M139, top) {

    var superClass = M139.Model.ModelBase,
        _class = "M2012.Calendar.Model.SubscActivity",
        commonAPI = new M2012.Calendar.CommonAPI();


    M139.namespace(_class, superClass.extend({
        name: _class,
        container: {},
        defaults: {},
        EVENTS: {
            REDIRECT: "master#linkshow:redirect",
            LOAD_MODULE: "master#linkshow:loadmodule",
            FETCH: 'master#linkshow:fetch',
            FETCHFAIL: 'master#linkshow:fetchfail'
        },

        initialize: function (options) {
            //superClass.prototype.initialize.apply(this, arguments);

            //var _this = this;
            //_this.bindEvent();

            //最好做成点群组后，再加载群组的功能代码与模块
            //_this.modParty = new M2012.Addr.Model.Master();
            this.master = options.master;
        },

        bindEvent: function () {
            var _this = this;
            var EVENTS = _this.EVENTS;

            _this.on("all", function (eventName, args) {
                var event = {};
                isMatch = eventName.match(/(\w+)#(\w+):(\w+)/);
                if (isMatch && isMatch.length > 3) {
                    //["home#linkshow:maybeknown", "home", "linkshow", "maybeknown"]
                    event.name = isMatch[0];
                    event.module = isMatch[1];
                    event.func = isMatch[2];
                    event.action = isMatch[3];

                    if (EVENTS[event.name]) {
                        _this.trigger(event.name, event);
                    }
                }
            });
            //Backbone.Router
        },

        validate: function (attributes) {

        },
        /**
         * @param obj 包括需要传递给接口的参数,回调函数名称,以及master
         * @param fnSuccess
         * @param fnError
         */
        getCalendar: function (obj, fnSuccess, fnError) {
            var _this = this;
            $.extend(obj, {
                master: this.master,
                fnName: "getCalendar"
            });
            commonAPI.callAPI(obj, function (responseData, responseText) {
                var data = !!responseData && responseData["var"];
                _this.set("data", data);
                typeof fnSuccess === 'function' && fnSuccess(responseData, responseText);
            }, fnError);
        },
        /**
         * 复制活动到我的日历
         * @param obj
         * @param fnSuccess
         * @param fnError
         */
        copyCalendar: function (obj, fnSuccess, fnError) {
            $.extend(obj, {
                master: this.master,
                fnName: "copyCalendar"
            });
            commonAPI.callAPI(obj, fnSuccess, fnError);
        }
    }));

})(jQuery, _, M139, window._top || window.top);
