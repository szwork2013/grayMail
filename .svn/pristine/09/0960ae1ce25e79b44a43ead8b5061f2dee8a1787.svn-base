
(function ($, _, M139, top) {
    var master = window.$Cal,
        EVENTS = master.EVENTS;
    var className = 'M2012.Calendar.Model.GroupActivityItem';

    M139.namespace(className, Backbone.Model.extend({
        defaults: {
            title: '',
            enable: 0,
            isrange: false,

            params: {
                calendarType: 10,
                recMyEmail: 0,
                recMySms: 1, //默认为短信提醒,具体是否提醒,由参数enable决定
                beforeTime: 0,
                beforeType: 0,
                sendInterval: 0,
                content: '',
                site: ''
            },

            //是否隐藏关闭按钮
            hideClose: false

            /*
            ///s表示start,开始时间
            startyear: 1990,
            startmonth: 1,
            startday: 1,
            starthour: 0,
            startminute: 0,

            ///e表示end,结束时间
            endyear: 1990,
            endmonth: 1,
            endday: 1,
            endhour: 0,
            endminute:0

            startdatestr:'xxxx年xx月xx日 周x',
            enddatestr:'xxxx年xx月xx日 周x'
            //*/
        },
        initData: function (params) {
            params = params || {};

            var now = new Date();
            var isrange = params.dtStart != params.dtEnd; //开始和结束不一样,则表示勾选了结束时间
            var startDate, endDate;

            //初始化,做数据转换
            var data = {
                title: params.title || '',
                enable: Number(!!params.enable), //容错,防止enable=undefined
                isrange: isrange, //结束时间标记
                hideClose: !!params.hideClose
            };

            //保存数据
            this.set(data);

            //初始化开始和结束时间
            if (typeof params.dtStart === 'string') {
                //start
                startDate = M139.Date.parse(params.dtStart || '') || now;
                this.setDateTime('start', startDate);

                //end
                endDate = isrange ? M139.Date.parse(params.dtEnd || '') : startDate;
                this.setDateTime('end', endDate);
            }
        },
        /**
         * 初始化年月日时分
         */
        setDateTime: function (type, date) {
            var _this = this;

            _this.setDate(type, date);
            _this.setTime(type, {
                hour: date.getHours(),
                minute: date.getMinutes()
            }, { silent: false });
        },
        /**
         * 初始化年月日
         */
        setDate: function (type, date) {
            var data = {};
            var desc = {};

            data[type + 'year'] = date.getFullYear();
            data[type + 'month'] = date.getMonth() + 1; //数据保留实际的月份: 1-12
            data[type + 'day'] = date.getDate();

            desc[type + 'datestr'] = M139.Date.format('yyyy年MM月dd日 周w', date);

            this.set(data, { silent: true });
            this.set(desc); //通知时间变了,显示选择的时间
        },
        /**
         * 初始化时分
         */
        setTime: function (type, data, options) {
            var time = {};
            time[type + 'hour'] = data.hour;
            time[type + 'minute'] = data.minute;

            this.set(time, { silent: true });

            if (options && options.silent === false) {
                this.trigger('change:' + type + 'time'); //触发 starttime或者endtime的变化
            }
        },
        getData: function () {
            var _this = this;
            var padding = master.capi.padding;

            //获取日期字符串
            function getdatestr(type) {
                return $T.format('{yyyy}-{MM}-{dd} {HH}:{mm}:00', {
                    yyyy: _this.get(type + 'year'),
                    MM: padding(_this.get(type + 'month'), 2),
                    dd: padding(_this.get(type + 'day'), 2),
                    HH: padding(_this.get(type + 'hour'), 2),
                    mm: padding(_this.get(type + 'minute'), 2)
                });
            }

            var title = _this.get('title');
            var dtStart = getdatestr('start');
            var dtEnd = _this.get('isrange') ? getdatestr('end') : dtStart; //如果勾选了结束时间,就获取设置的时间.
            var enable = _this.get('enable');

            //可填充或者设置的项
            var custom = {
                title: title,
                dtStart: dtStart,
                dtEnd: dtEnd,
                enable: Number(enable),
                recMyEmail: 0,
                recMySms: 1
            };

            var validate = _this.checkData(custom); //是否校验通过

            return {
                validate: validate,
                data: validate ? custom : undefined //校验通过才返回
            };
        },
        checkData: function (data) {
            var _this = this;

            //检查title
            if (!data.title.replace(/\s/gi, '')) {
                _this.trigger('error', { type: 'title' });
                return false;
            }

            //检查开始和结束时间
            var start = M139.Date.parse(data.dtStart).getTime();
            var end = M139.Date.parse(data.dtEnd).getTime();
            if (start - end > 0) {
                _this.trigger('error', { type: 'date' });
                return false;
            }

            return true;
        }
    }));
})(jQuery, _, M139, (window._top || window.top));