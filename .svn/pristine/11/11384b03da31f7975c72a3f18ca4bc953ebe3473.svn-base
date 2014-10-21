; (function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.DaytimePicker";

    M139.namespace(_class, superClass.extend({

        name: _class,

        //当前视图对象的容器(父元素) $(dom)
        container: null,

        //数据模型
        model: null,

        master: null,

        //回调函数
        //供调用方使用，主要是用于实时获取数据
        onChange: null,

        /**
         *  日期选择控件
         *  @param {Object}   args.container    //父容器,jQuery对象
         *  @param {Date}     args.datetime     //指定的时间， 可选
         *  @param {Function} args.onChange     //选项改变后的回调
        **/
        initialize: function (args) {

            var self = this;

            if (!args)
                args = {};

            self.master = args.master || window.$Cal;

            if (args.container)
                self.container = args.container;

            self.model = new M2012.Calendar.Model.DaytimePicker(args);

            //回调函数
            self.onChange = function (a) {
                args.onChange && args.onChange(a);
            };

            self.initEvents();
            self.render();
        },

        /**
         * 添加事件
       */
        initEvents: function () {

            var self = this;

            //注册事件实时通知页面是否显示农历
            self.model.on("change", function () {
                if (self.model.hasChanged("datetime")) {
                    var datetime = self.model.get("datetime");
                    self.onChange({ datetime: datetime });
                }
                    //是否显示农历标识发生变化
                else if (self.model.hasChanged("isLunar")) {

                    //农历显示
                    var b = self.model.get("isLunar");
                    self.dayControl && self.dayControl.setData({ isLunar: b });
                }
                    //全天事件需要隐藏时分选择部分
                else if (self.model.hasChanged("isFullDayEvent")) {

                    if (!self.timeControl)
                        return;
                    if (self.model.get("isFullDayEvent")) {
                        self.timeControl.currentEl.addClass("hide");
                        return;
                    }
                    self.timeControl.currentEl.removeClass("hide");
                }

            });

            //注册一个初始化控件数据的事件
            self.on(self.master.EVENTS.INIT, function (args) {
                self.setData(args);
            });
        },
        /**
         * 初始化子控件值
        **/
        initControls: function () {

            var self = this;
            var datetime = self.model.get("datetime");
            //设置日期控件值
            self.dayControl && self.dayControl.setData({
                date: datetime
            });
            //设置时间控件值
            self.timeControl && self.timeControl.setData({
                time: $Date.format("hhmm", datetime)
            },true);
        },

        /**
         * 初始化界面
         */
        render: function () {

            var self = this;

            self.$el.remove();
            //添加日期选择空间
            self.dayControl = new M2012.Calendar.View.DayPicker({
                master: self.master,
                container: self.container,
                onChange: function (date) {
                    if (_.isDate(date)) {
                        var dt = self.model.get("datetime");
                        var hour = 0, minute = 0;
                        if (_.isDate(dt)) {
                            hour = dt.getHours();
                            minute = dt.getMinutes();
                        }

                        //更新model中的数据
                        self.model.set({
                            datetime: self.getResetDate(date, hour, minute)
                        });
                    }
                }
            });
            //添加小时分钟选择控件
            self.timeControl = new M2012.Calendar.View.TimeSelector({
                master: self.master,
                container: self.container,
                onChange: function (time) {
                    if (time != null) {
                        if (_.isNumber(time.hour) && _.isNumber(time.minute)) {
                            var dt = self.model.get("datetime");
                            //更新model中的数据
                            self.model.set({
                                datetime: self.getResetDate(dt, time.hour, time.minute)
                            });
                        }
                    }
                }
            });

        },

        /**
         *  获取重置后的时间
         *  @param {Date}     dayPart    //用以获取日期部分的时间
         *  @param {Number}   hour       //小时
         *  @param {Number}   minute     //分钟
        */
        getResetDate: function (dayPart, hour, minute) {
            var self = this;
            var date = new Date();

            if (!dayPart) {
                dayPart = new Date();
            }
            date.setFullYear(dayPart.getFullYear());
            date.setMonth(dayPart.getMonth());
            date.setDate(dayPart.getDate());
            date.setHours(Number(hour));
            date.setMinutes(Number(minute));

            return date;
        },

        /**
         * 获取用动态cid生成id标示的HTML元素JQUERY对象
         */
        getElement: function (id) {

            var self = this;

            id = $T.format("#{cid}_{id}", {
                cid: self.cid,
                id: id
            });

            return $(id);
        },

        /**
         * 设置控件模型值，目前限定只能设置全天事件、是否农历等标示
         *  @param {Boolean} args.isFullDayEvent //是否全天事件 可选
         *  @param {Boolean} args.isLunar        //是否农历， 可选
         */
        setData: function (args) {
            if (!args)
                return;

            var self = this;

            if (_.isBoolean(args.isFullDayEvent))
                self.model.set({ isFullDayEvent: args.isFullDayEvent });

            if (_.isBoolean(args.isLunar))
                self.model.set({ isLunar: args.isLunar });

            if (_.isDate(args.datetime)) {
                self.model.setData({ datetime: args.datetime });
                //如果有传递过来的时间值，则需要再初始化一遍时间控件
                self.initControls();
            }
        }

    }));


    (function () {

        var base = M139.Model.ModelBase;
        var current = "M2012.Calendar.Model.DaytimePicker";
        var capi = new M2012.Calendar.CommonAPI();

        M139.namespace(current, base.extend({

            name: current,

            defaults: {
                //是否全天事件
                isFullDayEvent: false,
                //是否农历
                isLunar: false,
                //时间(Date类型)
                datetime: new Date()
            },

            master: null,

            EVENTS: {

                //监控数据变化
                DATA_CHANGE: "timepicker#data_change"
            },

            initialize: function (args) {

                var self = this;
                args = args || {};

                var date = args.datetime;
                self.master = args.master;
                var capi = self.master.capi;

                if (!_.isDate(args.datetime))
                    args.datetime = capi.getCurrentServerTime();

                self.setData(args);

                base.prototype.initialize.apply(self, arguments);

            },

            /**
             * 设置model的属性值
             */
            setData: function (args) {
                var self = this;
                if (!args)
                    return;

                for (var key in args) {
                    if (_.has(self.attributes, key)) {
                        var value = args[key];
                        if (typeof value == typeof self.get(key)) {
                            var data = {};
                            data[key] = value;
                        }
                        self.set(data, { silent: true });
                    }
                }
            }


        }));

    })();


})(jQuery, _, M139, window._top || window.top);