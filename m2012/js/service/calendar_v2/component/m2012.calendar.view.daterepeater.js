; (function ($, _, M139, top) {
    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.DateRepeater";

    M139.namespace(_class, superClass.extend({

        name: _class,
        //视图数据模型
        model: null,
        //视图主控
        master: null,
        //控件父容器
        container: null,
        /*时间改变后的触发事件
         *  @param {Object}   args   //通知到调用方的数据
         */
        onChange: function (args) {

        },
        defaults: {
            width: 124
        },

        /**
         *  @param {Object}   args.master       //日历视图主控
         *  @param {Object}   args.container    //父容器,jQuery对象
         *  @param {Number}   args.sendInterval //重复类型(可选)
         *  @param {Number}   args.width        //控件宽度(可选)
         *  @param {Function} args.onChange     //数据改变后的回调
        **/
        initialize: function (args) {

            var self = this;

            args = args || {};
            self.master = args.master;
            if (args.container) {
                self.container = args.container;
            }
            if (_.isNumber(args.width)) {
                self.width = args.width;
            }
            self.onChange = function (data) {
                args.onChange && args.onChange(data);
            }
            self.model = new M2012.Calendar.Model.DateRepeater(args);

            self.render();
            self.initEvents();
        },

        //注册事件
        initEvents: function () {
            var self = this;

            //监控数据变化，实时通知调用方
            self.model.on("change:sendInterval", function () {
                var value = self.model.get("sendInterval");
                self.onChange({
                    sendInterval: value
                });
            });
            //首次加载触发一次以确保调用方能获取到初始数据
            self.onChange({
                sendInterval: self.model.get("sendInterval")
            });
        },

        //呈现视图
        render: function () {          
            var self = this;
            var sendInterval = self.model.get("sendInterval");
            var menuItems = self.model.get("dataItems");
            var item = menuItems[sendInterval];
            var options = {
                container: self.container,
                menuItems: self.model.getMenuItems(),
                selectedIndex: item ? item.index : 0,
                width: self.width,
                maxHeight: 150
            };

            //删除backbone自动创建的div
            self.$el.remove();

            //创建一个下拉菜单
            self.intervalMenu = new M2012.Calendar.View.CalendarDropMenu().create(options);
            self.intervalMenu.on("change", function (item) {
                self.model.set({
                    sendInterval: item.data.sendInterval
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

        /**
         * 设置控件值
         *  @param {Int}   args.sendInterval   //重复类型
         */
        setData: function (args) {
            var self = this;
            var data = {};
            if (!args)
                return;

            if (args.sendInterval) {
                var value = args.sendInterval;
                data.sendInterval = value;
                self.intervalMenu.setSelectedValue(value);
            }
            self.model.setData(data);
        }
    }));

    (function () {

        var base = M139.Model.ModelBase;
        var current = "M2012.Calendar.Model.DateRepeater";

        M139.namespace(current, base.extend({

            name: current,

            master: null,

            defaults: {
                //重复类型
                //0不重复, 3天, 4周,5月,6年
                sendInterval: 0,
                //数据选择项
                dataItems: {}
            },

            /**
             *  重复项数据配置
            **/
            INTERVAL_CONF: [
                {
                    text: "不重复", value: 0
                }, {
                    text: "每天", value: 3
                }, {
                    text: "每周", value: 4
                }, {
                    text: "每月", value: 5
                }, {
                    text: "每年", value: 6
                }
            ],

            /**
              *  构造函数
              *  @param {Object} args.master     //日历视图主控
              *  @param {Number} args.sendInterval   //重复类型(可选)
             **/
            initialize: function (args) {
                var self = this;

                args = args || {};
                self.master = args.master;

                var capi = self.master.capi;

                if (_.isNumber(args.sendInterval)) {
                    self.set({
                        sendInterval: args.sendInterval
                    });
                }
                self.setMenuItems();
            },

            /**
             * 设置控件下拉选项的列表值
            **/
            setMenuItems: function () {
                var self = this;
                var conf = self.INTERVAL_CONF;
                var items = {};

                for (var i = 0, length = conf.length ; i < length; i++) {
                    var val = conf[i];
                    var item = {
                        text: val.text,
                        value: val.value,
                        data: { sendInterval: val.value }
                    };
                    items[val.value] = {
                        index: i,
                        item: item
                    };
                }
                self.set({ dataItems: items });
            },

            //获取下拉列表选项
            getMenuItems: function () {
                var self = this;
                var dataItems = self.get("dataItems");

                if (dataItems) {
                    var items = new Array(100);
                    var value = null;
                    var count = 0;

                    for (var key in dataItems) {
                        value = dataItems[key];
                        if (value.item) {
                            items[value.index] = value.item;
                            count++;
                        }
                    }
                    return items.slice(0, count);
                }
                return [];
            },

            /**
             * 设置控件值
             * @param {Object} args //要设置值的json格式
            **/
            setData: function (args) {
                var self = this;
                if (!args)
                    return;

                for (var key in args) {
                    if (_.has(self.attributes, key)) {
                        var value = {};
                        value[key] = args[key];
                        self.set(value, { silent: true });
                    }
                }
            }
        }));

    })();
})(jQuery, _, M139, window._top || window.top);