; (function ($, _, M139, top) {
    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.Color";

    M139.namespace(_class, superClass.extend({

        name: _class,
        //视图数据模型
        model: null,
        //视图主控
        master: null,
        //控件父容器
        container: null,
        currentEl: null,
        /*  时间改变后的触发事件
         *  @param {Boolean}  args.setLunar   //是否农历(可选)
        **/
        onChange: function (date) {

        },

        /**
         *  颜色选择控件       
         *  @param {Object}   args.master     //日历视图主控
         *  @param {Object}   args.container  //父容器,jQuery对象
         *  @param {Date}     args.color      //指定的颜色值(可选)
         *  @param {Boolean}  args.isEnabled  //是否农历(可选)
         *  @param {Function} args.onChange   //数据改变后的回调(还可以注册控件的change事件)
        **/
        initialize: function (args) {
            var self = this;

            args = args || {};
            self.master = args.master;
            if (args.container)
                self.container = args.container;

            self.onChange = function (date) {
                args.onChange && args.onChange(date);
            }

            self.model = new M2012.Calendar.Model.Color(args);
            self.initEvents();
            self.render();
            self.initControls();
            self.notifyChanged();
        },

        /**
         * 注册事件
         */
        initEvents: function () {
            var self = this;
            //注册model数据改变事件
            self.model.on("change", function () {
                if (self.model.hasChanged("color")) {
                    self.initControls();
                    self.notifyChanged();
                }
            });
            //注册初始化空间数据事件
            self.on("init", function (args) {
                self.setData(args);
            })
        },

        /**
         * 初始化页面控件值
         */
        initControls: function () {
            var self = this;
            var color = self.model.get("color");
            var exp = $T.format("i[col='{0}']", [color]);
            self.container.find("i[col]").removeClass("focus");
            self.container.find(exp).addClass("focus");
        },

        /**
         * 通知调用方数据发生了改变
         */
        notifyChanged: function () {
            var self = this;
            var args = {
                color: self.model.get("color")
            };
            self.onChange(args);
            self.trigger("change", args);
        },

        /**
         * 呈现视图
         */
        render: function () {
            var self = this;
            var template = _.template(self.template);
            var html = template(self.model.COLORS);
            self.$el.remove();
            self.currentEl = $(html).appendTo(self.container);

            //注册页面颜色项点击事件
            self.container.find("i").click(function (e) {
                if (!self.model.get("isEnabled"))
                    return;
                var me = $(this);
                var color = $T.Html.decode(me.attr("col"));
                self.model.set({ color: color });
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
            '<% _.each(obj, function(color){ %>',
            '<i class="i-green" col="<%-color%>" href="javascript:void(0)" style="background-color:<%-color%>;">',
            '</i>',
            '<% }) %>'
        ].join("")

    }));

    (function () {

        var base = M139.Model.ModelBase;
        var current = "M2012.Calendar.Model.Color";

        M139.namespace(current, base.extend({

            name: current,
            master: null,
            defaults: {
                //当前选择的颜色值
                color: "#90cf61",
                //控件是否可用
                isEnabled: true
            },

            COLORS: [
                "#90cf61",
                "#a5a5f0",
                "#f2b73a",
                "#ea8fcc",
                "#80bce1",
                "#ef7f7f",
                "#9eb4cd",
                "#69d1d1",
                "#5eabf3",
                "#ffa77c"
            ],

            /**
              *  构造函数
              *  @param {Object} args.master     //日历视图主控
              *  @param {Date} args.date         //指定的时间(可选)
             **/
            initialize: function (args) {
                var self = this;
                args = args || {};
                self.master = args.master;

                //判断颜色值是否合法
                if (!_.isUndefined(args.color)
                    && !self.isColor(args.color))
                    delete args.color;

                self.setData(args);
            },

            /**
             * 判断指定的颜色值是否是有效的RGB值
             * @param {String} color  //颜色RGB值
            */
            isColor: function (color) {
                var pn = /^#[0-9a-fA-F]{6}$/;
                if (!color)
                    return false;

                return pn.test(color);
            },

            /**
            *  设置控制，一般用在初始化控件数据时
            */
            setData: function (args) {
                var self = this;
                if (!args)
                    return;

                //如果设置的颜色不在默认颜色列表中，则不更新
                if (args.color && !_.contains(self.COLORS, args.color))
                    delete args.color;

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