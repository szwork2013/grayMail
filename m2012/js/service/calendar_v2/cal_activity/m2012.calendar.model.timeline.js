;
(function ($, _, M139, top) {

    var superClass = M139.Model.ModelBase,
        _class = "M2012.Calendar.Model.TimeLine",
        commonAPI = new M2012.Calendar.CommonAPI();

    M139.namespace(_class, superClass.extend({
        name: _class,
        container: {},
        defaults: {
            data: [], //所有列表数据
            monthList: [], //列表的月列表, 用于查找和当前时间最近的月份
            current: {} //当前展示视图数据
        },

        EVENTS: {
            CANCEL_INVITE_ERROR: "取消邀请活动失败,请重试!",
            DELETE_ERROR: "删除活动失败,请重试!",
            CANCEL_ERROR: "取消活动失败,请重试!",
            OPERATE_ERROR: "操作失败，请稍后再试!"
        },

        initialize: function (options) {
           
            this.master = options.master;
        },

        bindEvent: function () {
            var _this = this;
            var EVENTS = _this.EVENTS;
        },
        
        validate: function (attributes) {
            
        },
        getGroupCalendarList: function(options) {
            var self = this;

            self.master.api.getGroupCalendarList({
                data: {
                    startDate: options.startDate,
                    pageSize: options.pageSize,
                    includeLabels: options.includeLabels
                },
                success: function (result) {
                    if(options.success){
                        result = result || {};
                        options.success(result["var"] || []);
                    }                    
                },
                error: function (data) {
                    if(options.error){
                        options.error(data);
                    }                    
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
        }
        
        
    }));

})(jQuery, _, M139, window._top || window.top);
