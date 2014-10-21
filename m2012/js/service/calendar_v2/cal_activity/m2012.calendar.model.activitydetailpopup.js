; (function ($, _, M139, top) {

    var superClass = M139.Model.ModelBase;
    var _class = "M2012.Calendar.Model.ActivityDetailPopup";


    M139.namespace(_class, superClass.extend({

        name: _class,

        defaults: {
            //活动数据
            data: null
        },

        EVENTS: {
            CANCEL_INVITE_ERROR: "取消邀请活动失败,请重试!",
            DELETE_ERROR: "删除活动失败,请重试!",
            CANCEL_ERROR: "取消活动失败,请重试!",
            OPERATE_ERROR: "操作失败，请稍后再试!"
        },

        logger: new M139.Logger({ name: _class }),

        master: null,

        initialize: function (args) {

            var self = this;
            args = args || {};

            self.data = args.data;
            self.master = args.master;
        },

        //查询活动数据
        fetch: function (args) {

            var self = this;

            self.master.api.getCalendar({
                data: {
                    seqNo: self.seqNo,
                    type: self.type
                },
                success: function (data) {
                    self.set({ "data": data });
                    args.success && args.success();
                },
                error: function (data) {
                    args.error && args.error.call(data);
                }
            });
        },

        /*
        取消活动
          
              seqNo: 0,
              fnSuccess: Function,
              fnError:Function     
        */
        cancelInvited: function (seqNo, fnSuccess, fnError) {

            var self = this;
            self.master.trigger(self.master.EVENTS.REQUIRE_API, {

                success: function (api) {

                    api.cancelInvited({
                        data: { seqNos: seqNo },
                        success: function (result) {
                            if (result.code == "S_OK") {
                                fnSuccess && fnSuccess(result["var"]);

                            } else {
                                var msg = self.EVENTS.CANCEL_INVITE_ERROR;

                                fnError && fnError(msg);
                                self.logger.error(msg, result);
                            }
                        },
                        error: function (e) {

                            fnError && fnError(self.EVENTS.CANCEL_INVITE_ERROR);
                        }
                    });
                }

            });
        },

        /*
          删除日程
          args = {
                seqNos: 0,    //日程ID 多个以逗号隔开
                isNotify: args.isNotify, //操作类型 0：删除 1：取消              
            };
        */
        delCalendar: function (args, fnSuccess, fnError) {

            if ($.isArray(args.seqNos))
                args.seqNos = args.seqNos.join(",");

            args = $.extend({
                seqNos: 0,
                actionType: 0 //操作类型 0：删除 1：取消
            }, args);

            var self = this;
            self.master.trigger(self.master.EVENTS.REQUIRE_API, {

                success: function (api) {

                    api.delCalendar({
                        data: {
                            seqNos: args.seqNos,
                            actionType: args.actionType,
                            isNotify: args.isNotify
                        },
                        success: function (result) {
                            if (result.code == "S_OK") {
                                fnSuccess && fnSuccess(result["var"]);

                            } else {
                                var msg = self.EVENTS.DELETE_ERROR;

                                fnError && fnError(msg);
                                self.logger.error(msg, result);
                            }
                        },
                        error: function (e) {

                            fnError && fnError(self.EVENTS.DELETE_ERROR);
                        }
                    });
                }

            });
        },

        /*
          更新邀请状态
         args = {
                  seqNos: 0, 
                  actionType: 0
                }
        */
        updateInviteStatus: function (args, fnSuccess, fnError) {

            var self = this;

            var data = $.extend({
                actionType: 0,    //0:接受； 1：拒绝
                refuseResion: ''
            }, args)

            self.master.trigger(self.master.EVENTS.REQUIRE_API, {

                success: function (api) {

                    api.updateInviteStatus({
                        data: data,
                        success: function (result) {
                            if (result.code == "S_OK") {
                                fnSuccess && fnSuccess(result["var"]);

                            } else {
                                var msg = self.EVENTS.OPERATE_ERROR;

                                fnError && fnError(msg);
                                self.logger.error(msg, result);
                            }
                        },
                        error: function (e) {

                            fnError && fnError(self.EVENTS.OPERATE_ERROR);
                        }
                    });
                }

            });

        }


    }));

})(jQuery, _, M139, window._top || window.top);