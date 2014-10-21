/**
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