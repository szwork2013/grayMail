
(function ($, _, M139, top) {

    var className = "M2012.Calendar.Model.Message";
    M139.namespace(className, Backbone.Model.extend({
        name: className,
        defaults: {
            pageIndex: 1,
            pageSize: 10,
            type: 1
        },
        initialize: function () {
            this.API = M2012.Calendar.API;
        },
        getMessageList: function (options, success, error) {
            //compatible
            var pageIndex = this.get("pageIndex"),
                pageSize = this.get("pageSize"),
                type = this.get("type");
            options = $.extend(
                {
                    pageIndex: pageIndex,
                    pageSize: pageSize,
                    type: type
                }, options);

            this.API.getMessageList({
                data: options,
                success: success,
                error: error
            });
        },
        getMessageById: function (messageId, success, error) {
            messageId = messageId || 0;

            this.API.getMessageById({
                data: { messageId: messageId },
                success: success,
                error: error
            });
        },
        delMessage: function (seqno, success, error) {
            seqno = seqno || 0;

            this.API.delMessage({
                data: { seqno: seqno },
                success: success,
                error: error
            });
        },
        getMessageCount: function (type, success, error) {
            var data = { type: type };

            this.API.getMessageCount({
                data: data,
                success: success,
                error: error
            });
        },
        /**
         接受或者拒绝邀请
         @param options.actionType {Int} 操作类型：0：接受操作 1：拒绝操作
         @param options.seqNos {String} 邀请的活动id，多个用逗号隔开
         @param options.refuseResion {String} 非必须,如果是拒绝的操作，填写拒绝的原因
         */
        updateInviteStatus: function (options, success, error) {
            this.API.updateInviteStatus({
                data: options,
                success: success,
                error: error
            });
        },
        /**
         接受或者拒绝日历共享
         @param options.actionType {Int} 操作类型：0：接受操作 1：拒绝操作
         @param options.seqNos {String} 共享的日历id，多个用逗号隔开
         @param options.refuseResion {String} 非必须,如果是拒绝的操作，填写拒绝的原因
         */
        processShareLabelInfo: function (options, success, error) {
            this.API.processShareLabelInfo({
                data: options,
                success: success,
                error: error
            });
        },
        addBlackWhiteItem: function (options, success, error) {
            this.API.addBlackWhiteItem({
                data: options,
                success: success,
                error: error
            });
        }
    }));
})(jQuery, _, M139, window._top || window.top);