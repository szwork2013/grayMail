; (function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.TimePicker";

    /**
	 * 时间选择器
	 * 选择指定日期的时和分
     * 使用方法如下：
     *  new M2012.Calendar.View.TimePicker({
     *    container: $("#timer"),
     *    onChange: function (args) {
     *        //args : {time: time}
     *     }
     *  });
     */
    M139.namespace(_class, superClass.extend({

        name: _class,

        //当前视图对象的容器(父元素) $(dom)
        container: null,

        //当前控件对象
        currentEl: null,

        //数据模型
        model: null,

        //回调函数
        //供调用方使用，主要是用于实时获取数据
        onChange: null,

        /**
         * args:{
         *      @param {Object} container  //父容器,jQuery对象
         *      @param {String} time       //指定的时间， 可选
         *      @param {Function} onChange //选项改变后的回调
         *   }
        **/
        initialize: function (args) {

            var self = this;

            if (!args)
                args = {};

            var time = null;
            if (args.time)
                time = args.time;

            self.model = new M2012.Calendar.Model.TimePicker({ time: time });

            self.container = args.container ? args.container : $(document.body);
            self.width = args.width;  // 外部容器的宽度(timer的宽度)
            //回调函数
            self.onChange = function (a) {
                args.onChange && args.onChange(a);
            };

            self.render();
            self.initEvents();
        },

        /**
         * 添加事件
       */
        initEvents: function () {

            var self = this;
            var readonlyEl = self.getElement("ControlReadEl");

            self.model.on("change:time", function (args) {
                readonlyEl.text(self.model.get("time"));
            });

            //注册事件监控模型数据变化
            self.model.on(self.model.EVENTS.DATA_CHANGE, function (args) {
                self.onChange && self.onChange(args);
            });

            //初始化是调用一次该方法，
            //主要是先向调用视图传递默认数据
            self.onChange && self.onChange({ time: self.model.get("time") });
        },

        /**
         * 初始化界面
         */
        render: function () {

            var self = this;

            var html = $T.format(self.template, {
                cid: self.cid
            });

            self.currentEl = $(html).appendTo(self.container);

            //初始化下拉列表
            self.setMenuItems();
            //初始化时先默认设置下只读状态下的时间显示文本
            self.getElement("ControlReadEl").text(self.model.get("time"));
        },

        //初始化下拉列表
        setMenuItems: function () {

            var self = this;
            var timer = self.getElement("timer");

            var time = self.model.get("time");
            var item = self.model.get("timeItems")[time];
            var options = {
                container: timer,
                menuItems: self.model.getMenuItems(),
                selectedIndex: item ? item.index : 0,
                width: 80,
                maxHeight: 150
            };

            //创建一个下拉菜单
            self.timeMenu = new M2012.Calendar.View.CalendarDropMenu().create(options);
            self.timeMenu.on("change", function (item) {
                self.model.set({
                    hour: item.data.hour,
                    minute: item.data.minute,
                    time: item.data.time
                });
            });
        },

        getElement: function (id) {

            var self = this;

            id = $T.format("#{cid}_{id}", {
                cid: self.cid,
                id: id
            });

            return $(id);
        },

        setReadOnly: function () {
            var self = this;

            self.currentEl && this.currentEl.hide();
            self.getElement("ControlReadEl").show();
        },

        /**
         * 显示
         */
        show: function () {

            var self = this;

            if (self.currentEl) {
                self.currentEl.show();
            }
        },

        /**
         * 隐藏
         */
        hide: function () {

            var self = this;

            if (self.currentEl) {
                self.currentEl.hide();
            }
        },

        template: ['<div class="clearfix fl hankA">',
				        '<div id="{cid}_timer">',
					    '</div>',
					    '<div id="{cid}_ControlReadEl" style="display:none;top: 0px; height:30px; z-index:1000; " class="blackbanner"></div>',
				    '</div>'].join("")

    }));


    (function () {

        var base = M139.Model.ModelBase;
        var current = "M2012.Calendar.Model.TimePicker";

        var capi = new M2012.Calendar.CommonAPI();

        M139.namespace(current, base.extend({

            name: current,

            defaults: {
                //时间的字符串形式 如："0605"
                time: "",

                //时间项数据
                timeItems: null,

                //分钟间隔
                // Minutes: [0, 15, 30, 45],

                //是否设置了默认时间
                hasDefaultTime: false
            },

            EVENTS: {

                //监控数据变化
                DATA_CHANGE: "timepicker#data_change"
            },


            Minutes: [0, 15, 30, 45],

            initialize: function (args) {

                var self = this;
                args = args || {};

                if (args.time) {
                    self.set({ time: args.time });
                    self.hasDefaultTime = true;
                }

                base.prototype.initialize.apply(self, arguments);

                self.initEvents();
                self.initData();
            },

            initEvents: function () {

                var self = this;

                self.on("change:time", function () {

                    self.trigger(self.EVENTS.DATA_CHANGE, {
                        time: self.get("time")
                    });
                });
            },

            //初始化数据
            initData: function () {
                var self = this;

                //初始化选项
                self.setItems();

                var time = self.get("time");
                var cacheItems = self.get("timeItems");


                if (!time) {
                    //取当前时间加半小时
                    var date = window.ISOPEN_CAIYUN ? new Date() : M139.Date.getServerTime();
                    date.setMinutes(date.getMinutes() + 30);
                    var hh = capi.padding(date.getHours(), 2);
                    var mm = capi.padding(date.getMinutes(), 2);
                    time = hh + mm;
                    self.set({ time: time });
                }

                var selectedItem = cacheItems[time];

                if (!selectedItem) {
                    self.set({ time: self.fixTime(time) });
                }
            },

            //修正时间，确保时间在选项内
            fixTime: function (time) {

                time = capi.fixHourTime(time) || "";

                var self = this;
                var h = 0, m = 0;
                var value = time.split(":");

                if (value.length == 2) {
                    h = parseInt(value[0]);
                    m = parseInt(value[1]);
                }

                //获取时间间隔
                var value = self.Minutes[1];

                if ((m % value) != 0) {
                    m = value * (Math.floor(m / value) + 2);

                } else {
                    //无初始值的要取下一个有效时间点
                    if (!self.hasDefaultTime) {
                        m += value;
                    }
                }

                if (m > self.Minutes[self.Minutes.length - 1]) {
                    m = 0;
                    h += 1;
                }

                if (h > 23) {
                    h = 0;
                }

                return capi.padding(h, 2) + capi.padding(m, 2);

            },

            //设置数据源选项
            setItems: function () {

                var self = this;

                var items = self.get("timeItems");
                if (items == null) {

                    items = {};
                    var index = 0;

                    for (var hour = 0; hour < 24; hour++) {

                        for (var i = 0 ; i < self.Minutes.length; i++) {

                            var minute = self.Minutes[i];
                            var hh = capi.padding(hour, 2);
                            var mm = capi.padding(minute, 2);

                            var item = {
                                text: hh + ":" + mm,
                                data: {
                                    hour: hour,
                                    minute: minute,
                                    time: hh + mm
                                }
                            };

                            items[item.data.time] = {
                                index: index,
                                item: item
                            };

                            index++;
                        }
                    }
                }

                self.set({ timeItems: items });
            },

            //获取下拉列表选项
            getMenuItems: function () {
                var self = this;
                var timeItems = self.get("timeItems");

                if (timeItems) {
                    var items = new Array(100);
                    var value = null;
                    var count = 0;

                    for (var key in timeItems) {
                        value = timeItems[key];
                        if (value.item) {
                            items[value.index] = value.item;
                            count++;
                        }
                    }

                    return items.slice(0, count);
                }

                return [];
            }

        }));

    })();


})(jQuery, _, M139, window._top || window.top);