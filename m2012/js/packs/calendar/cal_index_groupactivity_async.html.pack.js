
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
﻿
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
﻿
(function ($, _, M139, top) {

    var master = window.$Cal,
        EVENTS = master.EVENTS;
    var className = "M2012.Calendar.View.GroupActivity";

    M139.namespace(className, Backbone.View.extend({
        name: className,
        viewName: "groupactivity",
        templates: {
            MAIN: ['<div class="sd-content">',
                     '<div class="bgPadding">',
                        '<div class="createTop tabTitle">',
                            '<h2><span id="title">{title}</span><a id="goback" href="javascript:void(0);" class="back">&lt;&lt;返回</a></h2>',
                        '</div>',
                     '</div>',
                     '<div class="createUl">',
                         '<div class="createChoose clearfix">',
 						    '<div id="labelMenu" style="width:600px;"></div>', //日历下拉菜单容器
                            '<div id="listView"></div>', //活动列表容器
                            '<div class="p_relative" style="z-index:300;">',
                                '<div id="groupmaxtip" class="tipsOther" style="left:260px; top:-15px; z-index:1000; display:none;"><div class="tips-text">最多同时添加10个活动</div><div class="tipsBottom diamond"></div></div>',
                                '<a id="addMore" class="btnNormal btnNormalNew" href="javascript:"><span>+ 添加更多活动</span></a>',
                            '</div>',
                         '</div>',
                         '<div class="createChoose_mt" style="position:relative">',
                             '<div id="mask" style="position:absolute; top:0px; height:43px; z-index:1000;" class="blackbanner hide"></div>',
                             '<a id="btnsave" role="button" hidefocus="" class="btnSetG" href="javascript:;">',
                                 '<span>',
                                     '保 存',
                                 '</span>',
                             '</a>',
                             '<a id="btndelete" role="button" hidefocus="" class="btnSet ml_5 hide" href="javascript:;">',
                                 '<span>',
                                     '删 除',
                                 '</span>',
                             '</a>',
                             '<a id="btncancel" role="button" hidefocus="" class="btnSet ml_5" href="javascript:;">',
                                 '<span>',
                                     '取 消',
                                 '</span>',
                             '</a>',
                         '</div>',
                     '</div>',
                 '</div>'].join(""),
            DELETE_TIP: '确定删除活动吗？<dd class="norTipsLine"> <input id="cal_del_group_activity" type="checkbox" name=""> <label for="cal_del_group_activity">发送通知，告知参与人您删除了活动</label></dd>'
        },
        configs: {
            maxView: 10, //产品暂定最多可以创建10个
            types: {
                CREATE: 0,
                EDIT: 1,

                ISNOTIFY_YES: 1,
                ISNOTIFY_NO: 0
            },
            messages: {
                LOADING: '正在加载中...',
                ERROR: '操作失败',

                MAX_VIEW_TIP: '最多同时添加10个活动',

                CONFIRM_TITLE: '发送通知',
                CREATE_TIP: '发送通知，告知参与人您安排了新的活动',
                EDIT_TIP: '发送通知，告知群成员您更新了新活动',

                DELETE_TITLE: '删除群活动',
                DELETE_TOP_TIP: '删除活动中',

                CREATE_TITLE: '创建活动',
                EDIT_TITLE: '编辑活动'
            },
            status: {
                OK: "S_OK"
            },
            codes: {
                DEFAULT_ERROR: '操作失败，请稍后再试',
                126: "添加的内容含敏感词，请重新输入",
                108: "添加的内容含敏感词，请重新输入",
                910: "您添加太频繁了，请稍后再试", //暂时先不提示验证码
                911: "您添加太频繁了，请稍后再试"
            }
        },
        initialize: function (options) {
            var _this = this,
                TYPES = _this.configs.types;

            _this.master = master;

            _this.master.on(EVENTS.VIEW_CREATED, function (args) {
                if (args.name == _this.viewName) {
                    _this.render(args);
                    //触发显示,即VIEW_SHOW
                    if (typeof args.onshow === 'function') {
                        args.onshow();
                    }
                }
            }).on(EVENTS.VIEW_SHOW, function (args) { //isEdit表示编辑模式
                if (args && args.name == _this.viewName) {
                    _this.master.capi.addBehavior("cal_add_group_activity_click");
                    _this.renderView(args); //根据传入参数,显示对应内容
                }
            });
        },
        /**
         * 渲染日历消息的主视图
         */
        render: function (options) {
            var _this = this;
            var configs = _this.configs;
            var types = configs.types;
            var messages = configs.messages;
            var html = $T.format(_this.templates.MAIN, { title: messages.CREATE_TITLE });

            _this.model = new M2012.Calendar.Model.GroupActivity();

            _this.container = options.container;
            _this.container.html(html);

            _this.header = $(".bgPadding", _this.container);
            _this.title = $("#title", _this.container);
            _this.content = $(".createUl", _this.container);
            _this.maxtip = $("#groupmaxtip", _this.container);
            _this.listView = $("#listView", _this.container);
            _this.addbutton = $("#addMore", _this.container);
            _this.submitEl = $("#btnsave", _this.container);
            _this.deleteEl = $("#btndelete", _this.container); //默认是hide
            _this.cancelEl = $("#btncancel", _this.container);
            _this.goback = $(".#goback", _this.container);
            _this.mask = $("#mask", _this.container);
            _this.content.css('overflow-y', 'auto');

            _this.initEvents();
        },
        initEvents: function (options) {
            var _this = this;
            var model = _this.model;
            var configs = _this.configs;
            var status = configs.status;
            var messages = configs.messages;
            var types = configs.types;
            var codes = configs.codes;
            var views = model.get('views');

            _this.goback.on('click', function () {
                _this.master.trigger(EVENTS.NAVIGATE, { path: "mainview" });
            });

            $(document.body).click(function () {
                //醉了.也没办法了...
                _this.maxtip.hide();
            });

            _this.addbutton.on('click', function () {
                _this.master.capi.addBehavior("cal_group_addmore_activity_click");
                var view = new M2012.Calendar.View.GroupActivityItem({
                    container: _this.listView
                });

                model.addView(view); //添加到model中,并监听close事件
            });

            _this.submitEl.on('click', function (e) {
                var editMode = model.get('editMode');
                var func = editMode ? 'updateCalendar' : 'addGroupLabel'; //调用更新或者批量添加接口,数据都在model中组装

                model[func](function (responseData) {
                    _this.mask.addClass('hide');
                    responseData = responseData || {};
                    var code = responseData.code;
                    if (code == status.OK) {
                        _this.hideTip();
                        _this.master.trigger(EVENTS.NAVIGATE, { path: "mainview/refresh" });
                    } else {
                        //异常处理
                        var message = codes[code]; //如果有,则表示出现了频率限制或者敏感词
                        if (!message) {
                            message = codes.DEFAULT_ERROR;
                        }

                        top.M139.UI.TipMessage.error(message, { delay: 3000 });
                    }
                });
            });

            //删除活动
            function deleteActivity(isNotify) {
                _this.mask.removeClass('hide');
                top.M139.UI.TipMessage.show(_this.configs.messages.DELETE_TOP_TIP);
                model.delCalendar({ isNotify: isNotify }, function (responseData) {
                    var code = responseData && responseData.code;
                    if (code == status.OK) {
                        _this.mask.addClass('hide');
                        _this.hideTip();
                        _this.master.trigger(EVENTS.NAVIGATE, { path: "mainview/refresh" });
                    } else {
                        _this.errorTip();
                    }
                });
            }
            _this.deleteEl.on('click', function () {
                var seqNo = model.get('seqNo');
                var msgDialog;
                if (seqNo) {
                    msgDialog = top.$Msg.confirm(_this.templates.DELETE_TIP, function (e) {
                        var ischecked = msgDialog.$el.find('#cal_del_group_activity').attr('checked');
                        deleteActivity(!!ischecked);
                    }, {
                        dialogTitle: messages.DELETE_TITLE,
                        icon: 'warn',
                        isHtml: true
                    });
                }
            });

            _this.cancelEl.on('click', function () {
                _this.master.trigger(EVENTS.NAVIGATE, { path: "mainview" });
            });

            //编辑模式,请求接口获取活动数据并渲染
            model.on('change:editMode', function () {
                var editMode = model.get('editMode');
                if (editMode) {
                    top.M139.UI.TipMessage.show(_this.configs.messages.LOADING);
                    model.getCalendar(function (responseData) {
                        //从服务端获取数据并填充
                        var code = responseData && responseData.code;
                        var data = responseData && responseData['var'];
                        if (code == status.OK) {
                            model.set('data', data);

                            _this.hideTip(); //获取数据成功就隐藏提示

                            _this.label.setData(data.labelId); //设置日历
                            var view = new M2012.Calendar.View.GroupActivityItem({
                                container: _this.listView,
                                dtStart: data.dtStart,
                                dtEnd: data.dtEnd,
                                enable: data.enable,
                                title: data.title,
                                hideClose: true //不显示关闭的X
                            });

                            model.addView(view); //添加到model中,并监听close事件
                        } else {
                            _this.errorTip();
                        }
                    }, function () {
                        _this.errorTip();
                    });
                }
            });

            //检测是否需要显示添加更多活动按钮
            model.on('change:showaddmore', function (data) {
                var editMode = model.get('editMode');

                if (editMode) {
                    _this.addbutton.addClass('hide');
                } else {
                    if (data.show) {
                        _this.addbutton.removeClass('hide');
                    } else {
                        _this.addbutton.addClass('hide');
                    }
                }
            });

            //统一错误提示语
            model.on('api:error', function () {
                _this.mask.addClass('hide');
                _this.errorTip();
            });

            //活动校验失败,定位到对应的活动view,以便显示tip
            model.on('error:validate', function (obj) {
                var el = obj.el;

                var scrollTop = _this.content.scrollTop() - 50; //去掉顶部和日历下拉的高度
                _this.content.animate({ "scrollTop": scrollTop + el.offset().top }, 100); //滚起!!!
            });

            model.on('change:loading', function () {
                _this.mask.removeClass('hide');
            });

            //提交数据时,询问是否通知参与人
            model.on('comfirm:notify', function (data) {
                var editMode = model.get('editMode');
                var tips = editMode ? messages.EDIT_TIP : messages.CREATE_TIP; //创建or修改

                callback = (data && data.callback) || $.noop;
                top.$Msg.confirm(tips, function () {
                    callback(types.ISNOTIFY_YES); //点击了确定
                }, function () {
                    callback(types.ISNOTIFY_NO); //点击了取消
                }, {
                    dialogTitle: messages.CONFIRM_TITLE,
                    icon: 'warn'
                });
            });

            //Auto resize
            var hGoback = $(".bgPadding", _this.container).height(),
                hTab = $("#naviBar", _this.container).height(),
                timer;
            $(window).on('resize', function () {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }

                timer = setTimeout(function () {
                    var hWin = $(window).height();
                    _this.content.height(hWin - hGoback - hTab); //如果计算不正确,就直接减掉80,除非UI调整
                }, 150);
            });

            $(window).trigger("resize");
        },
        /**
         * 渲染日历消息逻辑的主入口
         */
        renderView: function (options) {
            var _this = this;
            var messages = _this.configs.messages;

            var data = master.get('edit_group_data') || {}; //编辑状态会传入参数
            master.set('edit_group_data'); //使用完成清空,解决下次进来时,只是单纯的创建

            //日历下拉菜单
            var menuContainer = $("#labelMenu", _this.container);
            menuContainer.html('');

            _this.mask.addClass('hide'); //按钮区的遮罩层(频率限制用)

            var groupLabels = _.clone(_this.master.getGroupLabels(true));

            _this.label = new M2012.Calendar.View.LabelMenu({
                target: menuContainer,
                labels: groupLabels,
                width: "600px",
                onChange: function (args) {
                    _this.model.set('labelId', args.labelId);
                }
            });

            //设置选中的日历
            if (data.labelId) {
                _this.label.setData(data.labelId);
            }

            _this.listView.html(''); //清空之前的显示
            _this.model.set({
                "views": [],
                "maxView": _this.configs.maxView,
                "editMode": false,
                "type": undefined
            }); //清理所有view

            //是否编辑模式
            if (data.seqNo) {
                _this.title.html(messages.EDIT_TITLE);

                _this.deleteEl.removeClass('hide');

                _this.model.set({
                    "editMode": true,
                    "seqNo": data.seqNo,
                    "type": data.type
                });
            } else {
                _this.title.html(messages.CREATE_TITLE);
                _this.deleteEl.addClass('hide');

                var args = {
                    container: _this.listView,
                    hideClose: true //第一个不允许删除
                };

                //编辑的字段
                if (data.title) args['title'] = data.title;
                if (data.dtStart) args['dtStart'] = data.dtStart;
                if (data.dtEnd) args['dtEnd'] = data.dtEnd;
                if (typeof data.enable == 'number') args['enable'] = data.enable;

                var view = new M2012.Calendar.View.GroupActivityItem(args);

                _this.model.addView(view);

            }
        },
        hideTip: function () {
            top.M139.UI.TipMessage.hide();
        },
        errorTip: function () {
            top.M139.UI.TipMessage.warn(_this.configs.messages.ERROR, { delay: 3000 });
        }
    }));

    //initialize
    new M2012.Calendar.View.GroupActivity({ master: master });

})(jQuery, _, M139, window._top || window.top);
