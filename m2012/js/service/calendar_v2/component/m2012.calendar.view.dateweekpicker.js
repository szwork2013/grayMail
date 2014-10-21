; (function ($, _, M139, top) {
    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.DateWeekPicker";

    M139.namespace(_class, superClass.extend({

        name: _class,
        //视图数据模型
        model: null,
        //视图主控
        master: null,
        //控件父容器
        container: null,

        currentEl: null,

        /**
         *  数据改变后的触发事件
         *  @param {Object}   data   //同步到调用方的数据
        **/
        onChange: function (data) { },

        /**
         *  周选择控件
         *  @param {Object}   args.master     //日历视图主控
         *  @param {Object}   args.container  //父容器,jQuery对象
         *  @param {Date}     args.week       //星期数据(可选)
         *  @param {Function} args.onChange   //数据改变后的回调
        **/
        initialize: function (args) {

            var self = this;

            args = args || {};
            self.master = args.master;

            if (args.container) {
                self.container = args.container;
            }
            self.onChange = function (data) {
                args.onChange && args.onChange(data);
            }

            self.model = new M2012.Calendar.Model.DateWeekPicker(args);

            self.render();
            self.initEvents();
        },

        //注册事件
        initEvents: function () {
            var self = this;

            //监控数据变化，实时通知调用方
            self.model.on("change:week", function () {
                self.WeekChanged();
            });

            //首次加载触发一次以确保调用方能获取到初始数据
            self.WeekChanged();
        },

        /**
         *  周选择控件
         *  @param {Object}   silent          //是否保持沉默，为false则触发onChange事件通知调用方
         *  @param {Function} args.onChange   //数据改变后的回调
        **/
        WeekChanged: function (silent) {         
            var self = this;
            var week = self.model.get("week");
            var chkBoxs = self.container.find("input[type='checkbox']");

            if (!week || week.length != 7)
                return;
            if (!silent) {
                self.onChange({ week: week });
            }
            var weeks = week.split("");
            chkBoxs.each(function (i) {
                this.checked = (weeks[i] == "1");
            });
        },

        //呈现视图
        render: function () {
            var self = this;
            //删除backbone自动创建的div
            self.$el.remove();
            var html = [];
            var weeks = self.model.get("WEEK_CONF");

            for (var i = 0; i < weeks.length; i++) {
                html.push($T.format(self.template, {
                    cid: self.cid,
                    index: i,
                    week: weeks[i]
                }));
            }
            $(html.join("")).appendTo(self.container);

            //点击星期选择区域设置用户选择的周信息
            self.container.unbind().click(function (e) {

                window.setTimeout(function () {
                    var data = [0, 0, 0, 0, 0, 0, 0];
                    var length = data.length;
                    self.container.find("input[type='checkbox']").each(function (i) {

                        if (i >= length) return;
                        if (this.checked)
                            data[i] = 1;

                    });
                    self.model.set({ week: data.join("") });
                }, 100);

            });
        },

        /**
         *  设置周控件值
         *  @param {Object}   args.week     //周数据集合
        **/
        setData: function (args) {
            if (!args)
                return;

            var self = this;
            var data = {};
            if (args.week && args.week.length == 7) {
                data.week = args.week;              
            }
            self.model.setData(data);
            self.WeekChanged(true);
        },

        getElement: function (id) {
            var self = this;
            id = $T.format("#{cid}_{id}", {
                cid: self.cid,
                id: id
            });
            return $(id);
        },

        //视图模板
        template: [
            '<input type="checkbox" class="mr_5" id="{cid}_checkweek_{index}" value="{index}" name="{cid}_checkweek">',
            '<label class="mr_10" for="{cid}_checkweek_{index}">{week}</label>'
        ].join("")

    }));

    (function () {

        var base = M139.Model.ModelBase;
        var current = "M2012.Calendar.Model.DateWeekPicker";

        M139.namespace(current, base.extend({

            name: current,

            master: null,

            defaults: {

                //设置一个星期的那几天循环
                //如：0101110   表示周一、三、四、五
                week: "",

                WEEK_CONF: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
            },

            /**
              *  构造函数
              *  @param {Object}   args.master   //日历视图主控
              *  @param {Date}     args.week     //星期数据(可选)
             **/
            initialize: function (args) {
                var self = this;

                args = args || {};
                self.master = args.master;

                if (args.week) {
                    self.set({
                        week: args.week
                    });
                }
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