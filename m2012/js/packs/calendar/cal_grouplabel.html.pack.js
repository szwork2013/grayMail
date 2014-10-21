; (function ($, _, M139, top) {
    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.ColorMenu";

    M139.namespace(_class, superClass.extend({

        name: _class,
        //视图数据模型
        model: null,
        //视图主控
        master: null,
        //控件父容器
        container: null,
        currentEl: null,
        //数据变更触发事件
        onChange: function (date) { },

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
            self.container = args.container;

            self.onChange = function (date) {
                args.onChange && args.onChange(date);
            }

            self.model = new M2012.Calendar.Model.ColorMenu(args);
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
            self.getElement("currColor").css({
                "background-color": self.model.get("color")
            });
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
            var html = $T.format(self.template.main, { cid: self.cid });
            self.$el.remove();
            self.container.prepend(html);

            var clickFunc = function (e) {
                self.colorComp = new M2012.Calendar.View.CalendarPopMenu().create({
                    dockElement: self.getElement("colorArea"),
                    items: self.getColorItems(),
                    customClass: "menuPop-sd",
                    width: 45,
                    onItemClick: function (e) {
                        console.log(e);
                        self.model.set({
                            color: e.data.color
                        });
                    }
                });
            };
            //点击选中日历颜色
            self.getElement("checkmenu").click(clickFunc); 
            self.getElement("colorArea").click(clickFunc);

        },

        /**
         * 获取颜色下拉列表绑定数据
        **/
        getColorItems: function () {
            var self = this;
            var items = [];
            var colors = self.model.COLORS;
            for (var i = 0; i < colors.length; i++) {
                items.push({
                    html: $T.format(self.template.item, {
                        color: $T.Html.encode(colors[i])
                    }),
                    data: { color: colors[i] }
                });
            }
            return items;
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
        template: {
            main: [
               '<div class="dropDownA" href="javascript:void(0);" id="{cid}_checkmenu">',
                    '<i class="i_triangle_d"></i>',
                '</div>',
                '<a href="javascript:void(0);" class="dropDownA dropDownB" id="{cid}_colorArea">',
                    '<span class="theme-i" id="{cid}_currColor" ></span>',
                '</a>'
            ].join(""),
            item: '<span style="background-color:{color};" class="theme-i"></span>'
        }

    }));

    (function () {

        var base = M139.Model.ModelBase;
        var current = "M2012.Calendar.Model.ColorMenu";

        M139.namespace(current, base.extend({

            name: current,
            master: null,
            defaults: {
                //当前选择的颜色值
                color: "#90cf61",
                //颜色配置项
                colorItems: null,
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
﻿
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
﻿/**
 * 日历群组创建活动视图类
 * dependencies:
 *     M2012.Calendar.View.TimeSelector
 *     M2012.Calendar.CalendarView
 */
(function ($, _, M139, top) {

    var master = window.$Cal,
        EVENTS = master.EVENTS;
    var className = 'M2012.Calendar.View.GroupActivityItem';

    M139.namespace(className, Backbone.View.extend({
        name: className,
        configs: {
            messages: {
                DEFAULT_TIP: '你的活动安排是...',

                TITLE_EMPTY: '主题不能为空',
                DATE_ERROR: '开始时间不能晚于结束时间',

                MAX_LENGTH_TIP: '不能超过{count}个字'
            },
            types: {
                START: 'start',
                END: 'end',

                //错误的类型
                TITLE: 'title',
                DATE: 'date'
            },

            MAX_LENGTH: 100
        },
        events: {
            "click #close": "closeView",
            "click input[name=chkendtime]": "toggleEndTime",
            "click input[name=chkremind]": "remindMe"
        },
        templates: {
            MAIN: ['<div id="view_{cid}" class="tips" style="width:552px;">',
                         '<a id="close" href="javascript:void(0);" class="delmailTipsClose">',
                             '<i class="i_u_close"></i>',
                         '</a>',
                         '<div class="tips-text">',
                             '<textarea id="input" class="createInput" style="height:60px;"></textarea>',
                             '<div class="createInput_time clearfix">',
                                 '<div id="startview" class="createInput_Choose clearfix">',
                                     '<div id="startdate" class="createInput_left">',
                                         '<i class="i-createTime"></i>',
                                         '<span id="startdatestr"></span>',//2014年08月30日 周三
                                     '</div>',
                                 '</div>',
                                 '<span id="split" class="createInput_time_span hide">-</span>',
                                 '<div id="endview" class="createInput_Choose clearfix hide">',
                                     '<div id="enddate" class="createInput_left">',
                                         '<i class="i-createTime"></i>',
                                         '<span id="enddatestr"></span>', //2014年08月30日 周三
                                     '</div>',
                                 '</div>',
                                 '<input id="chkendtime_{cid}" name="chkendtime" type="checkbox" class="checkbox">',
                                 '<label class="checkbox_label" for="chkendtime_{cid}">结束时间</label>',
                             '</div>',
                             '<div class="createInput_btn clearfix">',
                                 '<input id="chkremind_{cid}" name="chkremind" type="checkbox" class="checkbox">',
                                 '<label class="checkbox_label" for="chkremind_{cid}">免费短信提醒<span class="gray">（准点提醒自己）</span></label>',
                             '</div>',
                         '</div>',
                     '</div>'].join("")
        },
        /**
         * 快速创建群组活动
         * @param container {Object} jQuery对象
         * @param target {Object} 同上,优先获取container
         * @param title {String} 默认标题,一般用于编辑
         * @param dtStart {String} 开始时间,格式为 yyyy-MM-dd HH:mm:ss
         * @param dtEnd {String} 结束事件,格式同上
         * @param enable {Boolean} 是否提醒(跟接口一致,不取名叫isRemind了)
         * @param hideClose {Bollean} 是否显示关闭按钮
         */
        initialize: function (options) {
            var _this = this;
            options = options || {};

            _this.options = options;

            if (options.container || options.target) {
                _this.model = new M2012.Calendar.Model.GroupActivityItem();
                _this.container = options.container || options.target;

                _this.render();
                _this.initEvents();

                //初始化数据
                var enable = typeof options.enable === 'undefined' ? true : !!options.enable;
                _this.model.initData({
                    title: options.title,
                    dtStart: options.dtStart,
                    dtEnd: options.dtEnd,
                    enable: enable,
                    hideClose: !!options.hideClose
                });
            } else {
                throw new Error('initialize ' + _this.name + ' fail,container is empty.');
            }
        },
        render: function () {
            var _this = this;
            var types = _this.configs.types;
            var html = $T.format(_this.templates.MAIN, {
                cid: _this.cid
            });
            var el = $(html);
            var now = new Date();

            _this.container.append(el);

            //开始的时间选择
            _this.startdatePicker = new M2012.Calendar.CalendarView({
                target: el.find('#startdate'),
                year: now.getFullYear(),
                month: now.getMonth(),
                day: now.getDay(),
                callback: function (date) {
                    //将选择的date设置到model
                    _this.model.setDate(types.START, date);
                },
                beforeShow: function () {
                    $(document.body).trigger('click');
                }
            });
            _this.startTime = new M2012.Calendar.View.TimeSelector({
                container: el.find('#startview'),
                style: 'MAIN2',
                onChange: function (data) {
                    _this.model.setTime(types.START, data);
                }
            });

            //结束的时间选择
            _this.enddatePicker = new M2012.Calendar.CalendarView({
                target: el.find('#enddate'),
                year: now.getFullYear(),
                month: now.getMonth(),
                day: now.getDay(),
                callback: function (date) {
                    _this.model.setDate(types.END, date);
                },
                beforeShow: function () {
                    //MOD, 日期选择器阻止了冒泡,导致其他下拉菜单无法关闭
                    $(document.body).trigger('click');
                }
            });
            _this.endTime = new M2012.Calendar.View.TimeSelector({
                container: el.find('#endview'),
                style: 'MAIN2',
                onChange: function (data) {
                    _this.model.setTime(types.END, data);
                }
            });

            //重设元素和事件绑定
            _this.setElement(el[0]);
        },
        initEvents: function () {
            var _this = this;
            var model = _this.model;
            var $el = _this.$el;
            var types = _this.configs.types;
            var messages = _this.configs.messages;
            var now = new Date();

            //dom元素
            var textareaEl = $el.find('#input');
            var splitEl = $el.find("#split");
            var startviewEl = $el.find("#startview");
            var endviewEl = $el.find("#endview");
            var remindEl = $el.find('input[name=chkendtime]'); //范围小,性能损耗不大
            var enableEl = $el.find("input[name=chkremind]");
            var startdateEl = $el.find('#startdatestr');
            var enddateEl = $el.find('#enddatestr');
            var closeEl = $el.find("#close");

            //输入框自适应高度
            M139.Dom.setPlaceholder(textareaEl, {
                placeholder: messages.DEFAULT_TIP,
                defaultcolor: '#000'
            });

            //model数据变动时的通知,主要用于初始化,所以在设置的时候要silent
            var maxLen = _this.configs.MAX_LENGTH,
                maxTip = $T.format(messages.MAX_LENGTH_TIP, { count: maxLen });
            textareaEl.on('blur', function (e) {
                var text = $(this).val();
                if (text == messages.DEFAULT_TIP) { //没写内容,方法自动触发了placeholder事件
                    text = '';
                }

                model.set({ "title": text }, { "silent": true });
            }).on('keydown paste', function (e) {
                if (e.altKey || e.shiftKey || e.ctrlKey) return;

                setTimeout(function () {
                    //让键盘事件先触发,防止按删除退格等N种按键的时候造成问题
                    var text = textareaEl.val() || '';
                    if (text.length > maxLen) {
                        textareaEl.val(text.substr(0, maxLen));
                        M2012.Calendar.View.ValidateTip.show(maxTip, textareaEl[0]);
                    }
                }, 100);
            });

            model.on('change:title', function () {
                textareaEl.val(model.get('title'));
            }).on('change:isrange', function () {
                var isrange = model.get('isrange');
                var func = isrange ? 'removeClass' : 'addClass';

                //显示或者隐藏结束时间
                splitEl[func]('hide');
                endviewEl[func]('hide');

                if (isrange) {
                    remindEl.attr('checked', true);
                } else {
                    remindEl.removeAttr('checked');
                }
            }).on('change:enable', function (e) {
                //是否提醒,用于初始化
                var isEnable = model.get('enable');
                if (isEnable) {
                    enableEl.attr('checked', true);
                } else {
                    enableEl.removeAttr('checked');
                }
            }).on('change:startdatestr', function () {
                startdateEl.html(model.get('startdatestr'));
            }).on('change:enddatestr', function () {
                enddateEl.html(model.get('enddatestr'));
            }).on('change:starttime', function () {
                //回设时间选择
                _this.startTime.setData({
                    hour: model.get('starthour'),
                    minute: model.get('startminute')
                }, false);
            }).on('change:endtime', function () {
                _this.endTime.setData({
                    hour: model.get('endhour'),
                    minute: model.get('endminute')
                }, false);
            }).on('change:hideClose', function () {
                if (model.get('hideClose')) {
                    closeEl.remove();
                }
            });

            //TODO 2种错误类型,一种是标题没填,一种是结束时间比开始时间小
            model.on('error', function (data) {
                var target, content;
                switch (data.type) {
                    case types.TITLE:
                        target = textareaEl[0];
                        content = messages.TITLE_EMPTY;
                        break;
                    case types.DATE:
                        target = startdateEl[0];
                        content = messages.DATE_ERROR;
                        break;
                    default:
                        return;
                }

                setTimeout(function () {
                    M2012.Calendar.View.ValidateTip.show(content, target);
                }, 550); //延迟,让所有的click事件冒泡完成
                return;

                M139.UI.Popup.create({
                    name: "hello",
                    icon: "i_ok_min",
                    containerClass: "nothing",
                    noClose: true,
                    autoHide: true,
                    direction: "up",
                    target: target,
                    content: content
                }).render();
            });

            //初始化默认的开始/结束时间
            model.setDate(types.START, now);
            model.setDate(types.END, now);
        },
        closeView: function () {
            var _this = this;
            _this.trigger('change:close', _this.cid); //关闭事件
            _this.$el.slideUp("fast", function () {
                _this.$el.remove();
            });
         
        },
        toggleEndTime: function (e) {
            this.model.set({ "isrange": e.target.checked }); //是否时间区间,如果是,就有结束时间
        },
        remindMe: function (e) {
            var enable = Number(e.target.checked);

            this.model.set({ "enable": enable }, { 'silent': true });
        },
        getData: function () {
            //不对外公开model.通过方法透传
            return this.model.getData();
        }
    }));

})(jQuery, _, M139, (window._top || window.top));
﻿;
(function ($, _, M139, top) {

    var superClass = M139.Model.ModelBase;
    var className = "M2012.Calendar.Model.GroupLabel";

    M139.namespace(className, Backbone.Model.extend({
        name: className,
        defaults: {
            //是否是处于编辑模式
            //true:编辑模式 false:添加模式
            isEditMode: false,
            //日历标签信息流水号
            seqNo: 0,
            //日历标签名称
            labelName: "",
            //标签颜色 采用#RGB的十六进制描述
            color: "",
            //变更时，是否需要通知共享关系人日历更改  0：否  1：是
            isNotify: false,
            //共享用户信息
            labelShareInfo: null,
            //是否默认有共享联系人信息（用于编辑情况下）
            hasDefShareInfo: false,
            //验证码
            validImg: "",
            //任务id，外部模块调用凭证
            taskId: null,
            //准许自定义的日历标签个数
            labelLimit: 10,
            //活动数据
            calendars: [],
            //活动项是否已满
            calendarIsOver: false,
            //验证活动数据项
            validActData: true
        },

        //是否初始化成功
        isLoadSuccess: false,

        logger: new M139.Logger({ name: className }),

        master: null,

        EVENTS: {
            //验证失败
            VALIDATE_FAILED: "label#validate:failed",
            DATA_INIT: "label#data:init",
            TIP_SHOW: "label#tip:show:",
            ADD_GROUPLABEL_SUCCESS: "addGroupLabelSuccess",
            GET_ACTIVITY_DATA: "label#getActivityData"
        },

        TIPS: {
            OPERATE_ERROR: "操作失败，请稍后再试",
            OPERATE_SUCCESS: "操作成功",
            DATA_LOADING: "正在加载中...",
            DATA_LOAD_ERROR: "数据加载失败，请稍后再试",
            ADD_LABEL_TITLE: "创建群日历",
            EDIT_LABEL_TITLE: "编辑群日历",
            MAX_LENGTH: "不能超过{0}个字符",
            LABELNAME_EMPTY: "日历名称不能为空",
            LABEL_NAME_EXIST: "此日历名已存在",
            USER_LABEL_LIMIT: "您的自定义群日历已经达到了{0}个，不能再添加",
            DELETE_ERROR: "删除日历失败,请重试!",
            SHARE_NOTIFY: "您希望向现有参与对象发送更新吗?",
            DELETE_CONFIRM: "确定要删除该条日历吗?",
            DELETE_SUCCESS: "删除成功",
            SHAREINFO_EMPTY: "请添加参与人",
            LABEL_NAME_PLACEHOLDER: "输入日历名称",
            CONTACT_PLACEHOLDER: "添加参与人"
        },

        /**
         *  新增群日历
         *  @param {Object} args.master //视图主控
        */
        initialize: function (args) {
            var self = this;
            args = args || {};
            self.master = args.master;

            self.initEvents()
        },

        /**
         *  添加监听事件
         */
        initEvents: function () {
            var self = this;

            //监听事件用以初始化页面数据
            self.on(self.EVENTS.DATA_INIT, function () {
                var data = self.master.get("edit_label_data");
                //清空提交过来的数据
                self.master.set({ edit_label_data: null });

                //编辑活动模式
                if (data && _.isNumber(data.labelId) && data.labelId > 0) {

                    //界面顶部展示数据加载中 
                    self.trigger(self.EVENTS.TIP_SHOW, { message: self.TIPS.DATA_LOADING });

                    //设置当前页面为编辑模式
                    self.set({ isEditMode: true });

                    //编辑模式需要获取服务端数据
                    self.fetch(data.labelId,
                        function (result) {
                            self.initData(result);
                            self.trigger(self.EVENTS.TIP_SHOW);

                        }, function () {
                            self.isLoadSuccess = false;
                            self.trigger(self.EVENTS.TIP_SHOW, {
                                message: self.TIPS.DATA_LOAD_ERROR,
                                params: {
                                    delay: 3000,
                                    className: "msgRed"
                                }
                            });
                        }
                    );
                    return;
                }

                //以下为创建日历模式
                if (window.isCaiyun) {
                    self.master.capi.addBehavior("cal_caiyun_addlabel_load");
                }

                self.initData(data);
            });

            //验证失败后的处理
            //该事件是backbone自己的验证事件，只需要定制即可
            self.on("invalid", function (model, error) {
                if (error && _.isObject(error)) {
                    for (var key in error) {
                        self.trigger(self.EVENTS.VALIDATE_FAILED, {
                            target: key,
                            message: error[key]
                        });
                        break;
                    }
                }
            });
        },

        /**
         *  填充model数据
         *  @param {Object}   data     //活动数据
         */
        initData: function (data) {
            var self = this;

            data = data || {};
            for (var key in data) {
                silent = false;

                if (key == "shareInfo") {
                    //过滤掉自己
                    var info = $.grep(data[key], function (n, i) {
                        return n.shareType > -1
                    });
                    //设置是否有默认联系人标示
                    self.set({
                        hasDefShareInfo: info && info.length > 0
                    }, { silent: true });
                    //转换联系人信息
                    var transData = self.transShareInfo(info);
                    key = "labelShareInfo";
                    data[key] = transData;
                }

                if (!_.has(self.attributes, key))
                    continue;

                var value = {};
                value[key] = data[key];

                //此处对数据类型做限定，从类型上判断数据的有效性
                if (typeof self.get(key) === typeof value[key]) {
                    //更新model键值，不触发验证
                    self.set(value, {
                        validate: false
                    });
                }
            }

            self.isLoadSuccess = true;
        },

        /**
         * 获取处理后的数据
        **/
        getData: function () {
            var self = this;
            return {
                labelId: self.get("seqNo"),
                labelName: self.get("labelName"),
                color: self.get("color"),
                labelShareInfo: self.get("labelShareInfo") || [],
                calendars: self.get("calendars"),
                isShare: self.get("hasDefShareInfo") ? 1 : 0,
                isNotify: self.get("isNotify"),
                validImg: self.get("validImg")
            };
        },

        /**
         * 将联系人信息转换成共享人信息
         * @param {Array}  args  //联系人信息列表        
        **/
        transContact2Share: function (args) {
            if (!args || !args.length)
                return null;

            return $.map(args, function (n) {
                return {
                    shareUin: n.inviterUin,
                    shareType: n.shareType,
                    smsNotify: n.smsNotify,
                    emailNotify: n.emailNotify,
                    status: n.status
                };
            });
        },

        /**
         * 将共享人信息转换成联系人信息
         * @param {Array}  args  //联系人信息列表        
        **/
        transShare2Contact: function (args) {
            if (!args || !args.length)
                return null;
            var self = this;
            return $.map(args, function (n) {
                return {
                    inviterUin: n.shareUin,
                    recMobile: "",
                    recEmail: n.shareUin,
                    smsNotify: n.smsNotify,
                    emailNotify: n.emailNotify,
                    statusDesc: self.getStatusDesc(n.status)
                };
            });
        },

        /**
        * 根据邀请状态值获取状态信息
        * @param {Number} status   //邀请状态
       **/
        getStatusDesc: function (status) {
            switch (status) {
                case 0:
                    return "未回复";
                case 1:
                    return "已接受";
                case 2:
                    return "已谢绝";
                case 3:
                    return "已删除";
                default:
                    return "未回复";
            }
        },

        /**
         * 将查询到的共享人信息转换成需要的共享人信息
         * @param {Array}  args  //共享人信息列表        
        **/
        transShareInfo: function (args) {
            if (!args || !args.length)
                return null;
            var self = this;
            return $.map(args, function (n) {
                //先取默认邮箱地址
                var email = n.defaultEmail;
                if (!email) {
                    email = n.shareTrueName || "";
                    var domain = self.master.capi.getEmailDomain();;
                    if (email.indexOf(domain) < 0)
                        email += "@" + domain;
                }
                return {
                    shareUin: email,
                    recEmail: email,
                    shareType: n.shareType,
                    smsNotify: n.smsNotify,
                    emailNotify: n.emailNotify,
                    status: n.status
                };
            });

        },

        /**
         * 验证数据的有效性       
        **/
        validate: function (attrs, args) {
            var self = this;
            var data = attrs;

            args = args || {};
            //判断是否需要验证
            if (!args.validate)
                return null;

            //如果存在target，那说明我们只针对具体字段做校验
            if (args && args.target) {
                var key = args.target;
                var obj = {};
                obj[key] = attrs[key];
                data = obj;
            }

            //该方法用于获取返回的错误信息
            var getResult = function (target, message) {
                //校验错误后backbone不会将错误数据set到model中，所以此处需要偷偷的设置进去,
                //以便于后续提交时能统一校验model数据
                if (args.target == target) {
                    var obj = {};
                    obj[target] = attrs[target];
                    self.set(obj, { silent: true });
                }
                var value = {};
                value[target] = message;
                return value;
            }

            //验证日历标签名称有效性
            var key = "labelName";
            if (_.has(data, key)) {
                var value = data[key] || "";
                if (value.length == 0)
                    return getResult(key, self.TIPS.LABELNAME_EMPTY);

                var maxLength = 30;
                if (value.length > maxLength)
                    return getResult(key, $T.format(self.TIPS.MAX_LENGTH, [maxLength]));

                var userLables = self.master.get("labelData") || {};
                userLables = userLables.userLabels || [];
                var samelabel = _.find(userLables, function (label) {
                    return label.labelName === value
                        && label.seqNo !== self.get("seqNo");
                });
                // 只有当日历标签ID不相等时才认为是日历重名
                if (samelabel) {
                    return getResult(key, self.TIPS.LABEL_NAME_EXIST);
                }
            }

            //验证共享联系人
            key = "labelShareInfo";
            if (!self.get("isEditMode") && _.has(data, key) && _.isEmpty(data[key])) {
                return getResult(key, self.TIPS.SHAREINFO_EMPTY);
            }

            return null;
        },

        /**
        *  查询活动数据
        *  @param {Number}     labelId        //日历标签ID
        *  @param {Function}   fnSuccess    //成功后的执行
        *  @param {Function}   fnError      //失败后的执行
        */
        fetch: function (labelId, fnSuccess, fnError) {
            var self = this;

            self.master.api.getLabelById({
                data: {
                    labelId: labelId
                },
                success: function (result) {
                    fnSuccess && fnSuccess(result["var"]);
                },
                error: function (data) {
                    fnError && fnError(data);
                }
            });
        },

        /**
        * 提交数据到服务器保存
        * @param {Function} fnSuccess  执行成功后的处理函数
        * @param {Function} fnError    执行失败后的处理函数
        * @param {Function} fnFail     验证失败后的处理函数
        * @param {Boolean} validate    是否需要检查数据的合法性
        */
        save: function (fnSuccess, fnError, fnFail, validate) {
            var self = this;

            //数据加载失败情况下不让提交数据
            if (!self.isLoadSuccess) {
                fnFail && fnFail();
                return;
            }

            (function (func) {
                //检查数据的有效性
                if (validate) {
                    if (!self.isValid()) {
                        fnFail && fnFail();
                        return;
                    }
                    //添加模式时需要验证添加的活动
                    if (!self.get("isEditMode")) {
                        //检测活动项数据是否合法
                        self.trigger(self.EVENTS.GET_ACTIVITY_DATA, {
                            onVaild: function (isVaild) {
                                if (!isVaild) {
                                    fnFail && fnFail();
                                    return;
                                }
                                func();
                            }
                        });
                        return;
                    }
                }
                //当不需要验证数据时直接提交数据
                func();

            })(function () {
                var options = {
                    data: self.getData(),
                    success: function (result) {
                        if (result.code == "S_OK") {
                            fnSuccess && fnSuccess(result["var"]);
                            return;
                        }
                        var msg = self.TIPS.OPERATE_ERROR;
                        fnError && fnError(msg, result);
                        self.logger.error("编辑日历失败！");
                    },
                    error: function (e) {
                        fnError && fnError(self.TIPS.OPERATE_ERROR);
                    }
                };
                //提交数据
                self.master.trigger(self.master.EVENTS.REQUIRE_API, {
                    success: function (api) {
                        if (self.get("isEditMode")) {
                            api.updateLabel(options);
                            return;
                        }
                        api.addGroupLabel(options);
                    }
                });
            });

        },

        /**
         * 删除日历标签
         * @param {Number}   args.isNotify   //是否通知
         * @param {Function} fnSuccess       //执行成功后的处理函数
         * @param {Function} fnError         //执行失败后的处理函数
         * @param {Function} fnFail          //验证失败后的处理函数
        */
        deleteLabel: function (args, fnSuccess, fnError, fnFail) {
            var self = this;
            var data = $.extend({
                labelId: self.get("seqNo"),
                isDelAllCals: 1 //删除标签时，是否删除该标签下的所有日程：0:不删除, 1:删除
            }, args);

            self.master.trigger(self.master.EVENTS.REQUIRE_API, {
                success: function (api) {
                    api.deleteLabel({
                        data: data,
                        success: function (result) {
                            if (result.code == "S_OK") {
                                fnSuccess && fnSuccess(result["var"]);

                            } else {
                                fnError && fnError(self.TIPS.OPERATE_ERROR);
                                self.logger.error("删除日历标签失败", result);
                            }
                            fnFail && fnFail();
                        },
                        error: function (e) {
                            fnFail && fnFail();
                            fnError && fnError(self.TIPS.OPERATE_ERROR);
                        }
                    });
                }

            });
        }


    }));

})(jQuery, _, M139, window._top || window.top);

﻿
; (function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var className = "M2012.Calendar.View.GroupLabel";

    M139.namespace(className, superClass.extend({

        name: className,
        //当前视图名称
        viewName: "grouplabel",
        //视图的父容器
        container: null,
        logger: new M139.Logger({ name: className }),
        //日历视图主控
        master: null,
        //活动数据模型
        model: null,
        //活动项（活动控件集合）
        actItems: [],
        //活动最大条数
        actItemsLimit: 10,
        /**
         * 添加、编辑活动详情
         * 要创建（编辑）详细活动请通过master调用：
           @example 
             创建： self.master.trigger(self.master.EVENTS.ADD_LABEL);
             编辑： self.master.trigger(self.master.EVENTS.EDIT_LABEL,{seqNo:12345,type:0});
         */
        initialize: function (args) {
            var self = this;
            args = args || {};
            self.master = args.master;

            superClass.prototype.initialize.apply(self, arguments);

            //注册页面创建事件
            //视图首次创建时触发
            self.master.bind(self.master.EVENTS.VIEW_CREATED, function (args) {
                if (args.name === self.viewName) {
                    self.master.unbind(self.master.EVENTS.VIEW_CREATED, arguments.callee);
                    self.container = args.container;

                    if ($.isFunction(args.onshow)) {
                        args.onshow();
                        $(window).resize(function () {
                            self.adjustHeight();
                        });
                    }
                }
            });

            //注册视图展示时触发事件
            //每次切换视图时都会触发，所以需要通过args.name来判断是不是切换到了当前视图
            self.master.bind(self.master.EVENTS.VIEW_SHOW, function (args) {
                if (args.name === self.viewName) {
                    self.master.capi.addBehavior("cal_add_group_label_click");
                    self.container.empty();
                    self.model = new M2012.Calendar.Model.GroupLabel({
                        master: self.master
                    });
                    self.actItems = [];
                    self.initEvents();
                    self.render();
                    // 初始化页面数据
                    self.initData();
                }
            });
        },

        /**
         * 初始化页面数据
        **/
        initData: function () {
            var self = this;
            self.model.trigger(self.model.EVENTS.DATA_INIT);
        },

        /**
         * 注册事件监听
        **/
        initEvents: function () {
            var self = this;

            //监控model数据变化实时同步数据到UI
            self.model.on("change", function () {

                //导航标题显示 添加日历、编辑日历
                if (self.model.hasChanged("isEditMode")) {

                    var TIPS = self.model.TIPS;
                    var value = self.model.get("isEditMode");
                    if (value) {
                        self.getElement("page_title").text(TIPS.EDIT_LABEL_TITLE);
                        //编辑模式下才显示删除操作按钮
                        self.getElement("btnDel").removeClass("hide");
                        //编辑模式展示编辑信息录入区域
                        self.getElement("editLableArea").removeClass("hide");
                        self.getElement("addLableArea").addClass("hide");
                        return;
                    }
                    self.getElement("page_title").text(TIPS.ADD_LABEL_TITLE);
                    self.getElement("btnDel").addClass("hide");
                    //新增模式展示新增信息录入区域
                    self.getElement("addLableArea").removeClass("hide");
                    self.getElement("editLableArea").addClass("hide");

                }
                    //监控日历标签名称变化
                else if (self.model.hasChanged("labelName")) {
                    var value = self.model.get("labelName");
                    var currentEl = self.getElement("labelName").val(value);

                    setTimeout(function () {
                        currentEl.trigger("change");
                        currentEl.trigger("blur");
                    }, 50);
                }
                    //监控颜色值变化
                else if (self.model.hasChanged("color")) {
                    var value = self.model.get("color");
                    self.colorComp && self.colorComp.trigger("init", {
                        color: value
                    });
                }
                    //监测共享人信息变化
                else if (self.model.hasChanged("labelShareInfo")) {
                    var value = self.model.get("labelShareInfo");
                    var data = null;

                    if (value && value.length > 0) {
                        data = self.model.transShare2Contact(value);
                    }
                    // 显示参与人列表
                    var template = _.template(self.template.UserItem);
                    self.getElement("editLableArea").html(template(data));
                }
                    //判断活动项条数是否已满（10个）
                else if (self.model.hasChanged("calendarIsOver")) {
                    if (self.model.get("calendarIsOver")) {
                        self.getElement("btnAddMore").addClass("hide");
                        return;
                    }
                    self.getElement("btnAddMore").removeClass("hide");
                }
            });

            // 获取活动项数据
            self.model.on(self.model.EVENTS.GET_ACTIVITY_DATA, function (args) {
                if (self.actItems.length > 0) {
                    var items = [];
                    for (var i = 0; i < self.actItems.length; i++) {
                        var item = self.actItems[i].getData();
                        //判断活动是否验证失败
                        if (!item.validate) {
                            var el = self.actItems[i].$el;
                            var container = self.getElement("maincontent");
                            var scrollTop = container.scrollTop() - 50; //去掉顶部和日历下拉的高度
                            container.animate({ "scrollTop": scrollTop + el.offset().top }, 100); //滚起!!!
                            args && args.onVaild(false);
                            return;
                        }
                        if (item.data) {
                            //需要扩展下参数值，需求规定是整点提醒
                            items.push($.extend(item.data, {
                                beforeTime: 0,
                                beforeType: 0
                            }));
                        }
                    }
                    //验证成功后才将数据提交到后端
                    self.model.set({ calendars: items }, { silent: true });
                }
                args && args.onVaild(true);
            });

            // 监控数据校验结果并实时呈现错误信息
            self.model.on(self.model.EVENTS.VALIDATE_FAILED, function (args) {
                if (!args || !args.target || !args.message)
                    return;

                var targetEl = null;
                switch (args.target) {
                    //验证主题
                    case "labelName": targetEl = self.getElement("labelName");
                        break;
                        //验证共享人
                    case "labelShareInfo":
                        targetEl = self.getElement("contactArea");
                        break;
                        //看是否超过允许添加的最大自定义标签数
                    case "labelLimit":
                        top.$Msg.alert(args.message, { icon: "warn" });
                        break;
                }
                if (targetEl && targetEl.length > 0) {
                    //将滚动条滚动到顶部
                    // if (targetEl.offset().top < 0) {
                    self.getElement("maincontent")[0].scrollTop = 0;
                    //}
                    window.setTimeout(function () {
                        M2012.Calendar.View.ValidateTip.show(args.message, targetEl);
                    }, 100);
                }

            });

            //监控操作提示信息
            self.model.on(self.model.EVENTS.TIP_SHOW, function (args) {
                if (!args) {
                    top.M139.UI.TipMessage.hide();
                    return;
                }
                var params = args.params || {};
                top.M139.UI.TipMessage.show(args.message, params);
            });

        },

        /**
         *  设置页面Html元素事件
         **/
        initPageEvent: function () {
            var self = this;
            //日历名称、说明内容变化实时同步到model
            $.each([self.getElement("labelName")], function () {
                var el = this;
                //控件值发生变化后传递到后端
                el.change(function () {
                    var data = {};
                    var key = this.id.split("_")[1];
                    data[key] = $.trim(this.value);
                    self.model.set(data, {
                        validate: false,//日历名称需要校验是否重复
                        target: key
                    });
                });

                //增加实时检测字数功能
                self.checkInputWords(el, Number(el.attr("maxlength")) - 2);
            });

            //返回
            self.getElement("back").click(function (e) {
                $(document.body).click();
                self.goBack(false);
            });

            self.getElement("btnAddMore").click(function (e) {
                self.master.capi.addBehavior("cal_group_addmore_activity_click");
                self.addActItem();
            });

            //保存
            self.getElement("btnSave").click(function (e) {
                self.save(true);
            });

            //删除
            self.getElement("btnDel").click(function (e) {
                self.deleteLabel();
            });

            //取消
            self.getElement("btnCancel").click(function (e) {
                self.goBack(false);
            });
        },

        /**
         *  添加一个活动项
        **/
        addActItem: function () {
            var self = this;
            var item = new M2012.Calendar.View.GroupActivityItem({
                container: self.getElement("activityArea")
            });
            item.on("change:close", function (cid) {
                for (var i = 0; i < self.actItems.length; i++) {
                    if (self.actItems[i].cid === cid) {
                        self.actItems.splice(i, 1);
                        break;
                    }
                }
                //更新活动超限标记
                self.model.set({ calendarIsOver: false });
            })
            self.actItems.push(item);
            //更新活动超限标记
            self.model.set({ calendarIsOver: self.actItems.length >= self.actItemsLimit });
            self.adjustHeight();
        },

        /**
         *  呈现视图
        **/
        render: function () {
            var self = this;
            var html = $T.format(self.template.Content, {
                cid: self.cid
            });

            $(html).appendTo(self.container);

            //添加日历选择控件
            self.colorComp = new M2012.Calendar.View.ColorMenu({
                container: self.getElement("labelArea"),
                onChange: function (args) {
                    if (args && args.color) {
                        self.model.set({
                            color: args.color
                        }, { silent: true });
                    }
                }
            });
            ////联系人选择控件
            self.contactComp = new M2012.Calendar.View.Contact({
                container: self.getElement("contactArea"),
                master: self.master,
                showTitle: false,
                showFreeInfo: false,
                isOnly139: true,
                placeHolder: self.model.TIPS.CONTACT_PLACEHOLDER,
                width: 602

            }).on("change", function (args) {
                var data = null;
                if (args && args.length > 0) {
                    data = self.model.transContact2Share(args);
                }
                self.model.set({
                    labelShareInfo: data
                }, { silent: true });
            });

            //添加一个活动项
            self.addActItem();

            //验证码控件
            self.identifyComp = new M2012.Calendar.View.Identify({
                wrap: self.cid + '_identity',
                name: 'identity',
                titleName: '验证码',
                onChange: function (val) {
                    self.model.set({
                        validImg: val || ""
                    }, { silent: true });
                }
            });
            self.identifyComp.inputEl.width(114);
            self.identifyComp.validateImgEl.width("auto");

            //设置页面元素相关事件
            self.initPageEvent();

            M139.Dom.setTextAreaAdaptive(self.getElement("labelName"), {
                placeholder: self.model.TIPS.LABEL_NAME_PLACEHOLDER,
                defaultheight: "20px",
                defaultcolor: "#000000"
            });

        },

        /**
         * 设置页面高度
        **/
        adjustHeight: function () {
            var self = this;
            var container = self.getElement("maincontent");
            var bodyHeight = $("body").height();
            var top = container.offset().top;
            container[0].style.overflowY = 'auto';
            container.height(bodyHeight - top);
        },

        /**
         * 实时检测输入字符长度
         * @param {jQuery Object}  inputEl     //输入框元素
         * @param {Number}         maxLength   //允许输入字符的最大长度
        **/
        checkInputWords: function (inputEl, maxLength) {
            var self = this;
            inputEl.unbind("keyup parse").bind("keyup parse", function (e) {
                var value = $.trim(inputEl.val());
                if (value.length > maxLength) {
                    inputEl.val(value.slice(0, maxLength));
                    var key = inputEl.attr("id").split("_")[1];

                    //更新数据到model
                    var data = {};
                    data[key] = $.trim(inputEl.val());
                    self.model.set(data, {
                        silent: true,
                        validate: false
                    });

                    //界面展示tips提示
                    self.model.trigger(self.model.EVENTS.VALIDATE_FAILED, {
                        target: key,
                        message: $T.format(self.model.TIPS.MAX_LENGTH, [maxLength])
                    });
                }
            });
        },

        /**
         *  提交数据到服务器
       **/
        save: function (validate) {
            var self = this;
            //判断自定义标签个数是否超限
            var labelLimit = self.model.get("labelLimit");
            var userLables = self.master.get("labelData") || {};
            userLables = userLables.userLabels || [];
            if (userLables.length > labelLimit) {
                self.model.trigger(self.model.EVENTS.VALIDATE_FAILED, {
                    target: "labelLimit",
                    message: $T.format(self.model.TIPS.USER_LABEL_LIMIT, [labelLimit])
                });
                return;
            }

            self.model.set({ isNotify: 0 }, {
                silent: true
            });
            //编辑活动
            if (self.model.get("isEditMode")) {
                //发送活动更新通知
                if (self.model.get("hasDefShareInfo")) {
                    top.$Msg.confirm(self.model.TIPS.SHARE_NOTIFY, function () {
                        self.model.set({
                            isNotify: 1
                        }, { silent: true });
                        self.saveData(validate);
                    }, function () {
                        self.saveData(validate);
                    }, { buttons: ["是", "否"] });
                    return;
                }
            }

            //新增活动
            self.saveData(validate);
        },

        /**
        * 保存数据到服务端
        * @param {Boolean}  validate     //是否验证输入数据
       **/
        saveData: function (validate) {
            var self = this;
            var mask = self.getElement("mask");
            //先遮挡住操作按钮
            mask.removeClass("hide");
            self.model.save(function () {
                top.M139.UI.TipMessage.show(self.model.TIPS.OPERATE_SUCCESS, {
                    delay: 3000
                });
                mask.addClass("hide");

                //如果是外部模块调用我们日历
                //则添加成功后需要通知对方
                var taskId = self.model.get("taskId");
                if (taskId) {
                    top.$App.trigger(self.model.EVENTS.ADD_GROUPLABEL_SUCCESS, {
                        taskId: taskId
                    });
                }
                //刷新左侧列表
                self.master.trigger(self.master.EVENTS.LABEL_CHANGE, {
                    onrender: function () {
                        self.goBack(true);
                    }
                });

            }, function (msg, result) {
                msg = msg || self.model.EVENTS.OPERATE_ERROR;
                var identify = false;

                //先检测下错误是否与验证码相关
                if (result && result.errorCode) {
                    //如果与验证码相关
                    if (self.identifyComp.handerError(result.errorCode)) {
                        self.showIdentify(self.identifyComp.isVisible());
                        identify = true;
                    }
                }
                if (!identify) {
                    msg = self.master.capi.getUnknownExceptionInfo(result.errorCode);
                    msg = msg || self.model.TIPS.OPERATE_ERROR;
                    top.M139.UI.TipMessage.show(msg, {
                        delay: 3000,
                        className: "msgRed"
                    });
                }
                mask.addClass("hide");

            }, function () {
                mask.addClass("hide");

            }, validate);
        },

        /**
       *  删除数据
      **/
        deleteLabel: function () {
            var self = this;
            var mask = self.getElement("mask");
            var dialogEl = top.$Msg.showHTML(self.template.DeleteInfo, function () {
                var isNotify = dialogEl.$el.find("input[name='isNotify']").attr("checked") ? 1 : 0;
                self.model.deleteLabel({
                    isNotify: isNotify
                }, function () {
                    top.M139.UI.TipMessage.show(self.model.TIPS.DELETE_SUCCESS, {
                        delay: 3000
                    });
                    //刷新左侧列表
                    self.master.trigger(self.master.EVENTS.LABEL_CHANGE, {
                        onrender: function () {
                            self.goBack(true);
                        }
                    });
                }, function () {
                    top.M139.UI.TipMessage.show(self.model.TIPS.OPERATE_ERROR, {
                        delay: 3000,
                        className: "msgRed"
                    });
                    mask.addClass("hide");
                });
            }, {
                dialogTitle: "删除日历",
                buttons: ["确定", "取消"]
            });

        },

        /**
         * 返回
         */
        goBack: function (isRefresh) {
            var self = this;
            var master = self.master;
            master.trigger(master.EVENTS.NAVIGATE, {
                path: "view/back"
            }, { isRefresh: isRefresh });
        },

        /**
       *  显示验证码
       */
        showIdentify: function (visible) {
            var self = this;
            var el = self.getElement("identity");
            //如果前后状态一致则无需调整弹出框位置
            if (el.is(":visible") == visible) {
                return;
            }
            visible ? el.show() : el.hide();
        },

        /**
         * 获取页面元素
         * id为{cid}_name 格式的页面元素
         * id中不需要带cid_
        **/
        getElement: function (id) {
            var self = this;
            id = $T.format("#{cid}_{id}", {
                cid: self.cid,
                id: id
            });
            return $(id);
        },

        template: {
            Content: ['<div class="outArticle">',
             '<div class="outArticleMain" style="margin:0px;">',
                 '<div class="createCon">',
                    '<div class="bgPadding">',
                        '<div class="createTop tabTitle">',
                            '<h2><span id="{cid}_page_title">创建群日历</span><a href="javascript:void(0);" id="{cid}_back" class="back">&lt;&lt;返回</a></h2>',
                        '</div>',
                    '</div>',
                    '<div class="createUl" id="{cid}_maincontent">',
                        '<div class="createChoose clearfix">',
						    '<div style="width:600px;" class="dropDown dropDown-mytag" id="{cid}_labelArea">',
                                '<div class="dropDownText">',
						            '<input type="text" class="text" maxlength="32" id="{cid}_labelName">',
							    '</div>',
                            '</div>',
                            '<div id="{cid}_addLableArea">',
                                '<div class="addPeopleNew" id="{cid}_contactArea">',
                                '</div>',
                                '<div id="{cid}_activityArea">',
                                '</div>',
                                '<a class="btnNormal btnNormalNew" href="javascript:void(0);" id="{cid}_btnAddMore" >',
                                    '<span>+ 添加更多活动</span>',
                                '</a>',
                            '</div>',
                            '<div id="{cid}_editLableArea" class="hide">',
                            '</div>',
                            '<div id="{cid}_identity" style="display:none;height:20px;">',
							'</div>',
                        '</div>',
                        '<div class="createChoose_mt" style="position:relative">',
                            '<div id="{cid}_mask" style="position:absolute; top:0px; height:43px; z-index:1000;" class="blackbanner hide"></div>',
                            '<a href="javascript:void(0);" class="btnSetG" hidefocus id="{cid}_btnSave" role="button"><span>保 存</span></a>',
                            '<a href="javascript:void(0);" class="btnSet  ml_5 hide" hidefocus id="{cid}_btnDel" role="button"><span>删 除</span></a>',
                            '<a href="javascript:void(0);" class="btnSet ml_5" hidefocus id="{cid}_btnCancel" role="button"><span>取 消</span></a>',
                        '</div>',
                    '</div>',
                '</div>',
             '</div>    ',
         '</div>'].join(""),
            UserItem: [
                '<table class="createTableList createTableListOther mt_10" style="width:602px;">',
                    '<thead>',
                        '<tr>',
                            '<th width="500" class="createThFirst">群组成员</th>',
                            '<th class="tac">状态 </th>',
				        '</tr>',
				    '</thead>',
				    '<tbody>',
                        '<% _.each(obj, function(i){ %>',
					    '<tr>',
						    '<td class="createThFirst"><%-i.recEmail%></td>',
						    '<td class="tac green"><%=i.statusDesc%></td>',
					    '</tr>',
                        '<% }) %>',
			        '</tbody>',
			    '</table>'].join(""),
            DeleteInfo: [
                '<div class="norTips">',
                    '<span class="norTipsIco">',
                        '<i class="i_warn"></i>',
                    '</span>',
                    '<dl class="norTipsContent">',
                        '<dt class="norTipsLine">您确认删除该日历吗？<br />此操作会使成员无法查看日历下的所有活动</dt>',
                        '<dd class="norTipsLine  mt_10"><input type="checkbox" name="isNotify" /><label for="">&nbsp;同时向群成员发送群日历取消通知</label></dd>',
                    '</dl>',
                '</div>'
            ].join("")
        }

    }));

    $(function () {
        var activity = new M2012.Calendar.View.GroupLabel({
            master: window.$Cal
        });
    });

})(jQuery, _, M139, window._top || window.top);

