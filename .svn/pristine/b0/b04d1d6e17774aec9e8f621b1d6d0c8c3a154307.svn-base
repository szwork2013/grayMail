; (function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.Reminder";

    M139.namespace(_class, superClass.extend({

        name: _class,

        //当前视图对象的容器(父元素) $(dom)
        container: null,

        //当前控件对象
        currentEl: null,
        //提醒类型选择区域容器
        typeEl: null,
        //时间间隔选择区域容器
        timeEl:null,

        model: null,

        //回调函数
        //供调用方使用，主要是用于实时获取数据
        onChange: null,

        /**
         *  提醒控件
         *  @param {Object}    container           //当前控件的父容元素(jQuery对象)
         *  @param {Number}    args.beforeTime     //提前时间(可选)
         *  @param {Number}    args.beforeType     //提前时间类型(可选)
         *  @param {Number}    args.recMySms       //是否短信提醒(可选)  1: 是 0: 否
         *  @param {Number}    args.recMyEmail     //是邮件信提醒(可选)  1: 是 0: 否
         *  @param {Number}    args.enable         //是否提醒标示(可选) 1: 提醒 0: 不提醒
         *  @param {Function}  onChange            //数据发生变化后的回调函数，数据驱动调用方
        **/
        initialize: function (args) {
            var self = this;

            args = args || {};
            self.container = args.container ? args.container : $(document.body);
            //回调函数
            self.onChange = function (a) {
                args.onChange && args.onChange(a);
            }
            self.model = new M2012.Calendar.Model.Reminder(args);

            self.initEvents();
            self.render();

            self.setMenuItems();
        },

        initEvents: function () {
            var self = this;

            //model数据变化后通知UI呈现
            self.model.on("change", function () {

                if (self.model.hasChanged("enable")) {
                    self.getElement("remind_type").toggleClass("hide");
                }
                if (self.timer) {
                    window.clearTimeout(self.timer);
                }
                //延迟一下,可以缓解多个值变更时触发多次,造成请求多次的问题
                self.timer = window.setTimeout(function () {
                    self.onChange(self.getData());
                }, 0xff);
            });

            // 初始化时调用一次该方法，
            // 主要是先向调用方传递默认数据
            self.onChange(self.getData());
        },

        setStyle: function () {

        },

        render: function () {
            var self = this;

            var html = $T.format(self.template, {
                cid: self.cid
            });
            self.currentEl = $(html).appendTo(self.container);
            //类型区域DOM对象
            self.typeEl = self.getElement("remind_type");
            self.typeEl.removeClass("hide");
            if (self.model.get("enable") == 0) {
                self.typeEl.addClass("hide");
            }
            //时间区域DOM对象
            self.timeEl = self.getElement("remind_time");
          
        },

        /**
         * 设置下拉列表弹出层
         */
        setMenuItems: function () {

            var self = this;
            //设置间隔时间下拉列表 
            //数据项以 "15-0"的形式做键值去初始化下拉选项
            var enable = self.model.get("enable");
            var beforeTime = self.model.get("beforeTime");
            var beforeType = self.model.get("beforeType");

            //不提醒时特殊处理
            if (enable == 0) {
                beforeTime = -1;
                beforeType = 0;
            }
            var key = beforeTime + "-" + beforeType;
            var item = self.model.get("remindTimeItems")[key];
            var options = {
                container: self.timeEl,
                menuItems: self.model.getRemindTimeMenuItems(),
                selectedIndex: item ? item.index : 0,
                width: 124,
                maxHeight: 100
            };
            //创建一个选择时间间隔的下拉菜单
            self.timeComp = new M2012.Calendar.View.CalendarDropMenu().create(options);
            self.timeComp.on("change", function (item) {
                var beforeTime = item.data.beforeTime;
                var enable = 1;

                //如果提前时间为-1，说明是不提醒
                if (beforeTime == -1) {
                    enable = 0;
                }
                self.model.set({
                    beforeTime: beforeTime,
                    beforeType: item.data.beforeType,
                    enable: enable
                });
            });


            //设置提醒接收类型
            key = self.model.get("remindType");
            var type = self.model.get("remindTypeItems")[key];

            options = {
                container: self.typeEl,
                menuItems: self.model.getRemindTypeMenuItems(),
                selectedIndex: type ? type.index : 0,
                width: 80,
                maxHeight: 50
            };
            //创建一个选择时间间隔的下拉菜单
            self.typeComp = new M2012.Calendar.View.CalendarDropMenu().create(options);
            self.typeComp.on("change", function (item) {
                self.model.set({
                    remindType: item.value
                });
            });
        },

        /**
        *  获取id以{cid}开头的html元素
        *  @return {Object}   
       **/
        getElement: function (id) {
            var self = this;

            id = $T.format("#{cid}_{id}", {
                cid: self.cid,
                id: id
            });
            return $(id);
        },

        /**
         *  设置控制，一般用在初始化控件数据时
         *  @param {Number}   args.beforeTime  //提前时间
         *  @param {Number}   args.beforeType  //提前时间类型
         *  @param {Number}   args.recMySms    //是否短信提醒 1： 是，0：否
         *  @param {Number}   args.recMyEmail  //是否邮件提醒 1： 是，0：否
         *  @param {Number}   args.enable      //是否提醒 1： 是，0：否
         */
        setData: function (args) {
            if (!args)
                return;

            var self = this;
            self.model.setData(args);

            // 还原每个控件的选择状态
            var data = self.model.getData();
            //当不提醒时需要特殊处理下
            if (data.enable == 0) {
                data.beforeTime = -1;
                data.beforeType = 0;
                self.getElement("remind_type").addClass("hide");
            }
            //还原提醒时间选择控件选项
            var value = data.beforeTime + "-" + data.beforeType;
            self.timeComp && self.timeComp.setSelectedValue(value);

            //还原提醒类型选择控件选项
            self.typeComp && self.typeComp.setSelectedValue(data.remindType);

        },

        /**
         *  手动获取提醒数据
         *  @return {Object}   
        **/
        getData: function () {
            return this.model.getData();
        },

        template: [
            '<div class=" dropDown-tips" id="{cid}_remind_time" >',
            '</div>',
			'<div class=" dropDown-ymtime  ml_10" id="{cid}_remind_type">',
            '</div>'
        ].join("")
    }));

    (function () {

        var base = M139.Model.ModelBase;
        var current = "M2012.Calendar.Model.Reminder";

        M139.namespace(current, base.extend({

            name: current,

            defaults: {

                //提醒时间间隔列表项
                remindTimeItems: null,

                //提醒接收方式列表项
                remindTypeItems: null,

                //提前时间
                //默认提前15分钟
                beforeTime: 15,

                //提前类型(0分, 1时, 2天, 3周, 4月 )
                // 默认为分钟
                beforeType: 0,

                //提醒接收类型
                //默认为邮件提醒
                remindType: "01",

                //是否提醒(默认提醒)
                enable: 1
            },

            /**
             *  提醒信息模型数据
             *  @param {Number}    args.beforeTime     //提前时间(可选)
             *  @param {Number}    args.beforeType     //提前时间类型(可选)
             *  @param {Boolean}   args.recMySms       //是否短信提醒(可选)
             *  @param {Boolean}   args.recMyEmail     //是邮件信提醒(可选)
             *  @param {Number}    args.enable         //是否提醒标示(可选) 1: 提醒 0: 不提醒
            **/
            initialize: function (args) {
                var self = this;

                if (!args)
                    args = {};

                self.setData(args);
                base.prototype.initialize.apply(self, arguments);

                //设置选项下拉列表数据
                self.setRemindTimeItems();
                self.setRemindTypeItems();
            },

            //设置提醒间隔列表选项
            setRemindTimeItems: function () {

                var self = this;
                var items = self.get("remindTimeItems");
                var index = 0;
                if (items == null) {

                    items = {};
                    var data = M2012.Calendar.Constant.remindTimesEnum;

                    for (var key in data) {

                        var value = data[key];
                        var item = {
                            data: { beforeType: value }
                        };
                        var match = key.match(/^\d+/);

                        if (match && match.length > 0) {
                            item.text = "提前" + key;
                            item.data.beforeTime = Number(match[0]);

                        } else {//不提前
                            item.text = key;
                            item.data.beforeTime = -1;

                            if (key == "准点提醒") { //没办法用最简单的办法改,配置没问题,算法有问题,不具备扩展能力,只能判断了
                                item.data.beforeTime = 0;
                            }
                        }
                        //给选项增加一个value值主要是为了以后便于通过下拉列表的setSelectedValue方法还原
                        item.value = item.data.beforeTime + "-" + item.data.beforeType;
                        items[item.value] = { index: index, item: item };

                        index++;
                    }

                    self.set({ remindTimeItems: items });
                }
            },

            //获取提醒时间间隔列表项
            getRemindTimeMenuItems: function () {

                var self = this;
                var timeItems = self.get("remindTimeItems");

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

            },

            //设置提醒接收方式列表选项
            setRemindTypeItems: function () {

                var self = this;
                var items = self.get("remindTypeItems");
                var index = 0;

                if (items == null) {
                    items = {};
                    var data = M2012.Calendar.Constant.remindSmsEmailTypes;

                    for (var key in data) {

                        var value = data[key];
                        var item = {
                            value: value.value,
                            text: value.text
                        };
                        items[value.value] = { index: index, item: item };
                        index++;
                    }
                    self.set({ remindTypeItems: items });
                }
            },

            /**
             *  获取提醒接收类型间隔列表项
            */
            getRemindTypeMenuItems: function () {
                var self = this;
                var typeItems = self.get("remindTypeItems");

                if (typeItems) {
                    var items = new Array(100);
                    var value = null;
                    var count = 0;

                    for (var key in typeItems) {
                        value = typeItems[key];
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
             *  设置控制，一般用在初始化控件数据时
             *  @param {Number}   args.beforeTime  //提前时间
             *  @param {Number}   args.beforeType  //提前时间类型
             *  @param {Number}   args.recMySms    //是否短信提醒 1： 是，0：否
             *  @param {Number}   args.recMyEmail  //是否邮件提醒 1： 是，0：否
             *  @param {Number}   args.enable      //是否提醒 1： 是，0：否
             */
            setData: function (args) {
                var self = this;
                var data = {};

                if (!args)
                    return;

                if (_.isNumber(args.beforeTime)) {
                    data.beforeTime = args.beforeTime;
                }
                if (_.isNumber(args.beforeType)) {
                    data.beforeType = args.beforeType;
                }
                //初始化提醒类型
                var remindTypes = M2012.Calendar.Constant.remindSmsEmailTypes;
                var type = remindTypes.email.value;
                if (args.recMySms === 1) {
                    type = remindTypes.freeSms.value;
                }
                data.remindType = type;
                if (_.isNumber(args.enable)) {
                    data.enable = args.enable;
                    //当不提醒时需要设置下提醒时间
                    if (data.enable == 0) {
                        data.beforeTime = -1;
                        data.beforeType = 0;
                    }
                }
                for (var key in data) {
                    if (_.has(self.attributes, key)) {
                        var value = {};
                        value[key] = data[key];
                        self.set(value, { silent: true });
                    }
                }
            },


            /**
             *  获取控件值
             */
            getData: function () {
                var _this = this;
                var enable = _this.get("enable");
                var remindType = _this.get("remindType");
                remindType = _this.padding(Number(remindType), 2);

                return {
                    recMySms: Number(remindType.slice(0, 1)),
                    recMyEmail: Number(remindType.slice(1)),
                    beforeTime: enable == 0 ? 15 : _this.get("beforeTime"),
                    beforeType: _this.get("beforeType"),
                    remindType: remindType,
                    enable: enable
                };
            },

            padding: function (i, len) {
                len = (len || 2) - (1 + Math.floor(Math.log(i | 1) / Math.LN10 + 10e-16));
                return new Array(len + 1).join("0") + i;
            }

        }));

    })();

})(jQuery, _, M139, window._top || window.top);