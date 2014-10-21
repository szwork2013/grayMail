; (function ($, _, M139, top) {
    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.DayPicker";

    M139.namespace(_class, superClass.extend({

        name: _class,
        //视图数据模型
        model: null,
        //视图主控
        master: null,
        //控件父容器
        container: null,

        currentEl: null,

        inputEl: null,

        /*  时间改变后的触发事件
         *  @param {Boolean}  args.setLunar   //是否农历(可选)
        **/
        onChange: function (date) {

        },

        /**
         *  时间选择控件
         *  若要中途改变该控件的部分值，可以使用setData方法
         *  @param {Object}   args.master     //日历视图主控
         *  @param {Object}   args.container  //父容器,jQuery对象
         *  @param {Date}     args.date       //指定的时间(可选)
         *  @param {Boolean}  args.isLunar   //是否农历(可选)
         *  @param {Function} args.onChange   //数据改变后的回调
        **/
        initialize: function (args) {

            var self = this;

            args = args || {};
            self.master = args.master;

            if (args.container) {
                self.container = args.container;
            }

            self.onChange = function (date) {
                args.onChange && args.onChange(date);
            }

            self.model = new M2012.Calendar.Model.DayPicker(args);

            self.render();
            self.initEvents();
        },

        /**
         * 注册事件
         */
        initEvents: function () {

            var self = this;

            //设置时间输入区域点击事件
            self.inputEl = self.currentEl.find("input").click(function (e) {
                var me = $(this);
                $Event.stopEvent(e);
                me.addClass("ses");
            });
            $(document).click(function (e) {
                if (e.target != self.inputEl.get(0)) {
                    if (self.inputEl.hasClass("ses")) {
                        self.inputEl.removeClass("ses");
                    }
                }
            });

            //注册时间实时更新数据到前端展示
            self.model.on("change", function () {
                if (self.model.hasChanged("date")) {
                    self.initControls();
                    self.onChange(self.model.get("date"));
                }
                else if (self.model.hasChanged("isLunar")) {
                    self.inputEl.val(self.model.getDateString());
                }
            });
            self.initControls();
            //触发一下事件以在初始化时展示数据到前端
            self.onChange(self.model.get("date"));
        },

        /**
         * 初始化页面控件值
         */
        initControls: function () {
            var self = this;
            var date = self.model.get("date");
            self.inputEl.attr("realdate", $Date.format("yyyy-MM-dd", date));
            self.inputEl.val(self.model.getDateString());
        },

        /**
         * 呈现视图
         */
        render: function () {
            var self = this;
            self.$el.remove();
            var html = $T.format(self.template, {
                cid: self.cid
            });
            self.currentEl = $(html).appendTo(self.container);

            //绑定时间选择器
            var date = self.model.get("date");
            new M2012.Calendar.View.CalenderChoose({
                date2StringPattern: 'yyyy-MM-dd',
                id: self.cid + '_date_input',
                year: date.getFullYear(),
                month: date.getMonth(),
                day: date.getDate(),
                callback: function (date) {
                    self.model.setDate(date);
                }
            });
        },

        /**
         * 设置页面
         */
        setData: function (args) {
            var self = this;
            self.model.setData(args);
            self.initControls();
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
         * 视图模板
         */
        template: [
            '<span class=" textTimeOther_day">',
                '<input type="text" name="" id="{cid}_date_input" value="" readonly="readonly" >',
            '</span>'
        ].join("")

    }));

    (function () {

        var base = M139.Model.ModelBase;
        var current = "M2012.Calendar.Model.DayPicker";

        M139.namespace(current, base.extend({

            name: current,

            master: null,

            defaults: {
                //时间对象
                date: new Date(),
                //是否农历
                isLunar: false
            },

            /**
              *  构造函数
              *  @param {Object} args.master     //日历视图主控
              *  @param {Date} args.date         //指定的时间(可选)
             **/
            initialize: function (args) {
                var self = this;

                args = args || {};
                self.master = args.master;
                var capi = self.master.capi;

                if (!args.date) {
                    args.date = capi.getCurrentServerTime();
                }
                self.set({
                    date: args.date
                }, { silent: true });
            },

            /**
             * 获取日期的字符串形式
             */
            getDateString: function () {
                var self = this;
                var date = self.get("date");

                if (self.get("isLunar")) {
                    var obj = self.master.capi.createDateObj(date);
                    return obj.ldate;
                }
                return $Date.format("yyyy-MM-dd", date);
            },

            /**
            * 设置指定的日期时间
            */
            setDate: function (d) {
                var self = this;
                var date = self.get("date");

                if (!date || !d)
                    return;

                if (date.getFullYear() != d.getFullYear()
                    || date.getMonth() != d.getMonth()
                    || date.getDate() != d.getDate()) {

                    self.set({ date: d });
                }
            },

            /**
            *  设置控制，一般用在初始化控件数据时
            */
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
        }

        ));

    })();
})(jQuery, _, M139, window._top || window.top);