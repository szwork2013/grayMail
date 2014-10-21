
; (function ($, _, M139, top) {
    var master = window.$Cal,
        EVENTS = master.EVENTS;
    var className = 'M2012.Calendar.Model.GroupActivity';

    M139.namespace(className, Backbone.Model.extend({
        name: className,
        defaults: {
            views: [],
            editMode: false,

            defaultParams: {
                recMySms: 1,
                recMyEmail: 0,
                beforeTime: 0,
                beforeType: 0,
                sendInterval: 0,
                calendarType: 10,
                content: '',
                site: ''
            }
        },
        initialize: function () {

        },
        /**
         * 将view添加到model中
         * 并对view的close事件进行监听
         */
        addView: function (view) {
            var _this = this;
            var views = _this.get('views');
            var maxView = _this.get('maxView');

            view.on('change:close', function (cid) {
                $.each(views, function (i, item) {
                    if (item.cid == cid) {
                        views.splice(i, 1);
                        return false;
                    }
                });

                var showAddMore = views.length < maxView;
                _this.trigger('change:showaddmore', { show: showAddMore });
            });

            views.push(view);

            var showAddMore = views.length < maxView; //不够最大限制个数,就显示添加更多
            _this.trigger('change:showaddmore', { show: showAddMore });
        },
        getCalendar: function (success, error) {
            var _this = this;
            var params = { seqNo: _this.get('seqNo') };
            //var type = _this.get('type');
            //if (type) { params['type'] = type; } //一个活动有好多类型.所以类型特殊的,要加上type

            master.api.getCalendar({
                data: params,
                success: success,
                error: error
            });
        },
        delCalendar: function (params, success) {
            var _this = this;
            var seqNo = _this.get('seqNo');

            params = params || {};
            params['seqNos'] = seqNo;
            params['isNotify'] = Number(!!params.isNotify);

            master.api.delCalendar({
                data: params,
                success: success,
                error: function () { _this.apiError();}
            })
        },
        /**
         * 编辑活动
         */
        updateCalendar: function (callback) {
            var _this = this;
            var origin = _this.get('data');
            var view = _this.get('views')[0];
            var modDate = view.getData();
            var params = {
                seqNo: origin.seqNo,
                labelId: _this.get('labelId') || origin.labelId,
                recMySms: origin.recMySms,
                recMyEmail: origin.recMyEmail,
                calendarType: origin.calendarType,
                beforeTime: origin.beforeTime,
                beforeType: origin.beforeType,
                sendInterval: origin.sendInterval,
                week: origin.week,
                content: origin.content,
                //untilDate: origin.untilDate,
                allDay: origin.allDay,
                specialType: origin.specialType
            };

            if (modDate.validate) {
                //构造完整数据
                params = $.extend(params, modDate.data);

                _this.trigger('comfirm:notify', {
                    callback: function (isNotify) {
                        params['isNotify'] = isNotify;
                        _this.trigger('change:loading'); //显示遮罩层
                        master.api.updateCalendar({
                            data: params,
                            success: callback,
                            error: function () { _this.apiError(); }
                        });
                    }
                });
            }
        },
        /**
         * 批量添加活动
         */
        addGroupLabel: function (callback) {
            var _this = this;
            var views = _this.get('views');
            var validated = true;
            var arr = [];
            var params = {};

            //构建活动数组
            $.each(views, function (i, item) {
                var tmp = item.getData();
                var data = {};
                if (tmp.validate) {
                    data = $.extend({}, _this.get('defaultParams'), tmp.data);
                    arr.push(data);
                } else {
                    //校验不通过.break
                    validated = false;
                    _this.trigger('error:validate', { el: item.$el }); //通知到界面, 滚
                    return false;
                }
            });

            if (validated) { //如果全部通过校验,则提交到后台
                _this.trigger('comfirm:notify', {
                    callback: function (isNotify) {
                        params = $.extend({
                            labelId: _this.get('labelId'),
                            isNotify: isNotify,
                            isGroup: 1
                        }, {
                            calendars: arr
                        });

                        _this.trigger('change:loading'); //显示遮罩层
                        master.api.addGroupLabel({
                            data: params,
                            success: callback,
                            error: function () { _this.apiError(); }
                        });
                    }
                });
            }
        },
        apiError: function () {
            this.trigger('api:error');
        }
    }));

})(jQuery, _, M139, (window._top || window.top));