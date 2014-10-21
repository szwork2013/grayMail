/**
 * 没什么用的model....
 */
; (function (jQuery, _, M139, top) {
    M139.namespace('M2012.Calendar.Model.Search', Backbone.Model.extend({
        defaults: {
            keys: []
        },
        initialize: function () {
            this.API = M2012.Calendar.API;
        },
        clear: function () {
            var _this = this;
            _this.attributes = _this.defaults;
        },

        /**
         * 订阅公共日历
         * @param data {Object} 订阅内容的对象
         * @param data.labelId {Int} 公共日历ID
         * @param data.color {String} 公共日历颜色（用户自定义）
         * @param callback {Function} 回掉函数
         */
        subscribeLabel: function (data, callback, onerror) {
            this.API.subscribeLabel({
                data: data,
                success: callback,
                error: onerror
            });
        },
        /**
         * 退订公共日历
         * @param labelId {Int} 公共日历ID
         * @param callback {Function} 回掉函数
         */
        cancelSubscribeLabel: function (labelId, callback, onerror) {
            this.API.cancelSubscribeLabel({
                data: { labelId: labelId },
                success: callback,
                error: onerror
            });
        },
        /**
         * 搜索公共日历
         * @param data.searchText {String} 搜索关键字
         * @param data.pageIndex {Int} 页码
         * @param data.pageSize {Int} 每页显示数量
         * @param callback {Function} 回掉函数
         */
        searchPublicLabel: function (data, callback, onerror) {
            this.API.searchPublicLabel({
                data: data,
                success: callback,
                error: onerror
            });
        }
    }));
})(jQuery, _, M139, window._top || window.top);