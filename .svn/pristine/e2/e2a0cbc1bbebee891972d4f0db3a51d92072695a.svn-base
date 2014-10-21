(function ($, _, M139, top) {

    var superClass = M139.Model.ModelBase;
    var className = "M2012.Calendar.Model.TopNaviBar";

    M139.namespace(className, superClass.extend({

        name: className,

        master: null,

        defaults: {

            // 视图类型
            // 0:月视图 1:日视图 2：列表
            type: 0
        },

        initialize: function (args) {

            var self = this;

            args = args || {};
            self.master = args.master;
            var now = self.master.capi.getCurrentServerTime();

            //视图类型
            //1: 月视图 2:日视图 3:列表视图
            if (args.type) {
                self.set({ type: args.type });
            }
        },

        /**
         * 设置日历全局时间
        */
        setDate: function (date, options) {
            var self = this;
            self.master.set({
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
                navi: options  //是否通过日期选择器选择触发,目前用在列表中
            });

            self.master.trigger("change:navi"); //多次点击同一功能时,不会触发change事件
        },

        /**
         * 获取未读消息数
         */
        getMsgCount: function () {
            var self = this;
            var EVENTS = self.master.EVENTS;

            self.master.trigger(EVENTS.REQUIRE_API, {
                success: function (api) {
                    api.getMessageCount({
                        data: { comeFrom: 0, type: 0 },
                        success: function (result) {
                            if (result.code === "S_OK") {
                                var data = result['var'];
                                var count = data && data.count > 0 ? data.count : 0;
                                self.master.trigger(EVENTS.MSG_RECEVIE, {
                                    count: count
                                });
                            }
                        }
                    });
                }
            });
        }
    }));

}(jQuery, _, M139, window._top || window.top));