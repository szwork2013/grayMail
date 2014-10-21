;
(function ($, _, M139, top) {

    var superClass = M139.Model.ModelBase,
        _class = "M2012.Calendar.Model.TimeLine",
        commonAPI = new M2012.Calendar.CommonAPI();

    M139.namespace(_class, superClass.extend({
        name: _class,
        container: {},
        defaults: {
            data: [], //所有列表数据
            monthList: [], //列表的月列表, 用于查找和当前时间最近的月份
            current: {} //当前展示视图数据
        },

        EVENTS: {
            CANCEL_INVITE_ERROR: "取消邀请活动失败,请重试!",
            DELETE_ERROR: "删除活动失败,请重试!",
            CANCEL_ERROR: "取消活动失败,请重试!",
            OPERATE_ERROR: "操作失败，请稍后再试!"
        },

        initialize: function (options) {
           
            this.master = options.master;
        },

        bindEvent: function () {
            var _this = this;
            var EVENTS = _this.EVENTS;
        },
        
        validate: function (attributes) {
            
        },
        getGroupCalendarList: function(options) {
            var self = this;

            self.master.api.getGroupCalendarList({
                data: {
                    startDate: options.startDate,
                    pageSize: options.pageSize,
                    includeLabels: options.includeLabels
                },
                success: function (result) {
                    if(options.success){
                        result = result || {};
                        options.success(result["var"] || []);
                    }                    
                },
                error: function (data) {
                    if(options.error){
                        options.error(data);
                    }                    
                }
            });
        },
        /*
        取消活动
          
              seqNo: 0,
              fnSuccess: Function,
              fnError:Function     
        */
        cancelInvited: function (seqNo, fnSuccess, fnError) {

            var self = this;
            self.master.trigger(self.master.EVENTS.REQUIRE_API, {

                success: function (api) {

                    api.cancelInvited({
                        data: { seqNos: seqNo },
                        success: function (result) {
                            if (result.code == "S_OK") {
                                fnSuccess && fnSuccess(result["var"]);

                            } else {
                                var msg = self.EVENTS.CANCEL_INVITE_ERROR;

                                fnError && fnError(msg);
                                self.logger.error(msg, result);
                            }
                        },
                        error: function (e) {

                            fnError && fnError(self.EVENTS.CANCEL_INVITE_ERROR);
                        }
                    });
                }

            });
        },
          /*
          删除日程
          args = {
                seqNos: 0,    //日程ID 多个以逗号隔开
                isNotify: args.isNotify, //操作类型 0：删除 1：取消              
            };
        */
        delCalendar: function (args, fnSuccess, fnError) {

            if ($.isArray(args.seqNos))
                args.seqNos = args.seqNos.join(",");

            args = $.extend({
                seqNos: 0,
                actionType: 0 //操作类型 0：删除 1：取消
            }, args);

            var self = this;
            self.master.trigger(self.master.EVENTS.REQUIRE_API, {

                success: function (api) {

                    api.delCalendar({
                        data: {
                            seqNos: args.seqNos,
                            actionType: args.actionType,
                            isNotify: args.isNotify
                        },
                        success: function (result) {
                            if (result.code == "S_OK") {
                                fnSuccess && fnSuccess(result["var"]);

                            } else {
                                var msg = self.EVENTS.DELETE_ERROR;

                                fnError && fnError(msg);
                                self.logger.error(msg, result);
                            }
                        },
                        error: function (e) {

                            fnError && fnError(self.EVENTS.DELETE_ERROR);
                        }
                    });
                }

            });
        }
        
        
    }));

})(jQuery, _, M139, window._top || window.top);


; (function ($, _, M139, top) {

    var activity = null;
    var superClass = M139.View.ViewBase;
    var className = "M2012.Calendar.View.TimeLine";

    M139.namespace(className, superClass.extend({

        name: className,

        //当前视图名称
        viewName: "timeline",

        //视图的父容器
        container: null,

        logger: null,

        //日历视图主控
        master: null,

        //活动数据模型
        model: null,

        //滚轴动画执行时间
        SCROLL_TIME: 200,

        ELEMENT: {
            WIDTH: 400,
            HEIGHT: 150
        },

        STATE: {
            EMPTY: 'empty',
            DEFAULT: 'timeLine'
        },

        PARAMETER: {
            PAGE_SIZE: 200,
            START_DATE: '2010-01-01'
        },

        menuMap: {},

        monthMap: {},

        /**
         * 添加、编辑活动详情
         * 要创建（编辑）详细活动请通过master调用：
           @example 
             创建： self.master.trigger(self.master.EVENTS.ADD_ACTIVITY);
             编辑： self.master.trigger(self.master.EVENTS.EDIT_ACTIVITY,{seqNo:12345,type:0});
         */
        initialize: function (args) {
            var self = this;
            args = args || {};
            self.master = args.master;
            self.menu = args.menu;
            self.month = args.month;
            self.activity = args.activity;
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
                if (args.args.subview === self.viewName) {
                    self.master.capi.addBehavior("cal_navibar_timeline_click");
                    self.container.empty();
                    self.model = new M2012.Calendar.Model.TimeLine({
                        master: self.master
                    });
                    self.initEvents();
                    self.render();
                    // 初始化页面数据
                    // self.initData();
                }
            });
        },

        /**
         * 注册事件监听
        **/
        initEvents: function () {
            var self = this;

            self.model.on('change:data', function () {
                //清空html
                self.ui.menu.empty();
                self.ui.wrap.find('.wrap-container').empty();

                self.createMenuHtml();
                self.createActivityHtml();
            });

            self.model.on('change:monthList', function () {
                self.getNearMonth();
            });

            self.model.on('change:state', function () {
                var state = this.get('state');

                self[state].render.call(self);
            });

            self.model.on('change:current', function () {
                var data = this.get('current');

                if (self.currentYear && self.currentYear != self.menuMap[data.year]) {
                    self.currentYear.removeMonth();
                }

                self.currentYear = self.menuMap[data.year];
                self.menuMap[data.year].setMonth(data.month);
            });
            
            self.master.on("change:checklabels change:includeTypes", function (model, val) {
                //确保当前视图为月视图
                if (self.master.get("view_location").view != self.viewName)
                    return;
                
                self.model.clear({silent: true});
                self.container.empty();                
                self.render();
            });
        },

        /**
         *  设置页面Html元素事件
         **/
        initPageEvent: function () {
            var self = this;

            $(window).resize(function () {
                self.ui.wrap.css(self.getHeightAndWidth());
            });

            self.ui.wrap.scroll(function () {
                self.scroll();
            });
        },

        /**
         *  呈现视图
        **/
        render: function () {
            var self = this;
            var html = $T.format(self.template.Content, {
                cid: self.cid
            });

            self.showLoad();
            $(html).appendTo(self.container);

            this.ui = {};
            this.ui.wrap = self.container.find('#wrap');
            this.ui.menu = self.container.find('#menu');


            //设置页面元素相关事件
            self.initPageEvent();
            self.ui.wrap.css(self.getHeightAndWidth());
            self.model.set({ state: self.STATE.DEFAULT });
            //self.createData();
        },
        /**
         * 设置页面高度
        **/
        adjustHeight: function () {
            var self = this;
            var container = self.container;
            var bodyHeight = $("body").height();
            var top = container.offset().top;
            container[0].style.overflowY = 'auto';
            container.height(bodyHeight - top);
        },
        /**
         * 滚动条触发事件  
        **/
        scroll: function () {
            var data = null;
            var offset = this.ui.wrap.offset();
            var scrollTop = this.ui.wrap.scrollTop();

            var min = offset.top;
            var max = this.ELEMENT.HEIGHT * 2 + min;

            //虽然性能很搓, 但是为了实现各种滚, 也只能这样了
            for (var m in this.monthMap) {
                var current = this.monthMap[m];
                var start = current.getElement().offset().top;
                var end = start + this.ELEMENT.HEIGHT - min;

                if (start >= min && end < max) {
                    data = current;
                    break;
                }
            }

            if (data) {
                this.model.set({
                    current: {
                        year: data.year,
                        month: data.month
                    }
                });
            }
        },
        /**
         * 初始化时,获取页面的高宽
        **/
        getHeightAndWidth: function () {
            var offset = this.ui.wrap.offset();
            var width = $(window).width();
            var height = $(window).height();

            var obj = {
                height: height - offset.top,
                width: width - offset.left
            };

            return obj;
        },
        /**
         *  滚动动画
        **/
        scrollTop: function (year, month) {
            var scrollTop = 0;
            var wrap = this.ui.wrap;
            var element = this.getMonthObj(year, month).getElement();
            var offset = element.offset();

            scrollTop = wrap.scrollTop() + offset.top - wrap.offset().top;
            this.ui.wrap.animate({ scrollTop: scrollTop }, this.SCROLL_TIME);
        },
        /**
         * 根据年月, 获取ID
        **/
        getMonthId: function (year, month) {
            return year + '-' + month
        },
        /**
         * 根据年月,获取指定月对象
        **/
        getMonthObj: function (year, month) {
            var id = this.getMonthId(year, month);

            return this.monthMap[id] || {};
        },
        /**
         * 根据年月获取拼装的数据, 如201409
        **/
        getYearMonthMap: function (year, month) {
            if (parseInt(month) < 10) {
                month = "0" + month;
            }

            return parseInt(year.toString() + month.toString());
        },
        //获取离当前时间最近的年和月
        getNearMonth: function () {
            var data = this.model.get('monthList');
            data = data.sort(function (a, b) { return a - b });

            var now = top.M139.Date.getServerTime();
            var year = now.getFullYear();
            var month = now.getMonth() + 1;

            var nowNumber = this.getYearMonthMap(year, month);
            var index = _.sortedIndex(data, nowNumber);
            var current = data[index] ? data[index] : data[data.length - 1];
            current = current.toString();

            var options = {
                year: Number(current.substring(0, 4)),
                month: Number(current.substring(4, 6))
            };

            this.model.set({ current: options }, {silent: true});
            this.model.trigger('change:current');
            this.scrollTop(options.year, options.month);
        },
        showLoad: function () {
            top.M139.UI.TipMessage.show('数据加载中...');
        },
        hideLoad: function () {
            top.M139.UI.TipMessage.hide();
        },
        /**
         * 创建左侧年月导航菜单
        **/
        createMenuHtml: function () {
            var self = this;
            var data = this.model.get('data');

            for (var i = 0; i < data.length; i++) {
                var options = {
                    year: data[i].year,
                    month: data[i].month,
                    master: self.master
                };

                options.onChange = function (year, month) {
                    self.scrollTop(year, month);
                    self.model.set({ current: { year: year, month: month } });
                };

                options.onRemove = function (year) {
                    var isEmpty = true;

                    delete self.menuMap[year];

                    for (var m in self.menuMap) {
                        if (self.menuMap[m]) {
                            isEmpty = false;
                            break;
                        }
                    }

                    if (isEmpty) {
                        self.model.set({ state: self.STATE.EMPTY });
                    }
                }

                var year = new this.menu(options);

                this.menuMap[data[i].year] = year;
                this.ui.menu.append(year.getElement());
            }
        },
        /**
         * 创建右侧月视图和活动视图
        **/
        createActivityHtml: function () {
            var self = this;
            var data = this.model.get('data');
            var len = data.length;

            for (var i = 0; i < len; i++) {
                var year = data[i];
                var monthData = year.month;

                for (var j = 0; j < monthData.length; j++) {
                    var options = {
                        year: year.year,
                        model: self.model,
                        master: self.master,
                        activity: self.activity,
                        month: monthData[j].month,
                        calendars: monthData[j].calendars,
                        id: this.getMonthId(year.year, monthData[j].month)
                    };

                    options.onRemove = function () {
                        delete self.monthMap[this.id];
                        self.menuMap[this.year].remove(this.month);
                        self.scroll();
                    };

                    var month = new self.month(options);
                    self.monthMap[month.id] = month;
                    self.ui.wrap.find('.wrap-container').append(month.getElement());
                }
            }
        },
        /**
         * 接口数据进行数据转换,转换完成开始渲染UI
        **/
        formatData: function (data) {
            var self = this;
            var newData = new Array();
            var monthList = new Array();

            var createActivity = function (data) {
                var list = [];
                var len = data.length;

                for (var i = 0; i < len; i++) {
                    var date = M139.Date.parse(data[i].dtStart);

                    data[i].id = data[i].seqNo;
                    data[i].isReady = !data[i].isOwner;
                    data[i].year = date.getFullYear();
                    data[i].month = date.getMonth() + 1;
                    data[i].day = date.getDate();
                    data[i].time = $Date.format('hh:mm', date);
                    data[i].week = $Date.getChineseWeekDay(date);
                    data[i].remind = self.getRemind(data[i]);

                    list.push(data[i]);
                }

                return list;
            }

            for (var i = 0; i < data.length; i++) {
                var datas = data[i].datas;
                var year = { year: data[i].year, month: [] };

                for (var j = 0; j < datas.length; j++) {
                    var map = this.getYearMonthMap(year.year, datas[j].month);
                    datas[j].calendars = createActivity(datas[j].calendars);

                    monthList.push(map);
                    year.month.push(datas[j]);
                }

                newData.push(year);
            }

            this.model.set({ data: newData }, {silent: true});
            this.model.set({ monthList: monthList }, {silent: true});
            
            this.model.trigger('change:data');
            this.model.trigger('change:monthList');
        },
        getRemind: function (data) {

            var self = this;    
            var value = "";

            if (!data.enable)
                return value;

            var master = self.master;
            var constant = master.CONST;
            var before = data.beforeTime + constant.remindBeforeType[data.beforeType];

            var type = "" + data.recMySms + data.recMyEmail;
            type = (type == "01" || type == "11") ? "1" : type;

            var remindType = constant.remindSmsEmailType[type];
            var smsmobile = remindType ? "," + remindType : "";

            //是否已经取消
            if (data.beforeTime == 0 && data.enable) //任务邮件         
                value = '准点提醒' + smsmobile;
            else
                value = data.enable ? ("提前" + before + smsmobile) : "";

            return value;
        },
        /**
         * 无活动时, 引导
        **/
        empty: {
            render: function () {
                var template = this.template.Empty;
                this.ui.wrap.html(template);
            }
        },
        /**
         * 时间轴初始化
        **/
        timeLine: {
            render: function () {
                var self = this;
                var labels = this.master.attributes.checklabels;
                var options = {
                    startDate: this.PARAMETER.START_DATE,
                    pageSize: this.PARAMETER.PAGE_SIZE                    
                };

                if(labels && labels.length > 0){
                    options.includeLabels = labels.join(',');
                }

                options.success = function (result) {
                    self.hideLoad();

                    if (result.length == 0) {
                        self.model.set({ state: self.STATE.EMPTY });
                        return;
                    }

                    self.formatData(result);
                };

                options.error = function (result) {
                    self.hideLoad();
                    top.M139.UI.TipMessage.show('操作失败，请稍后再试！', {
                        delay: 3000,
                        className: "msgRed"
                    });
                };

                this.model.getGroupCalendarList(options);
            }
        },
        /*
        createData: function() {
            var data = [];
            var monthMap = [];          

            var createActivity = function(year, month){
                var list = [];
                var len = Math.floor((Math.random() * 9) +1);
                for(var i = 0; i < len; i++){
                    var item = {
                        id: 'activity_' + i,
                        year: year,
                        month: month,
                        day: Math.floor((Math.random() * 31) +1),
                        week: '周三',
                        title: '短信准点提醒',
                        content: '驱动在公共盘里有，打印机在A区最遥远的角落里，复印机打印机一体的大块头驱动在公共盘里有，打印机在A区最...',
                        color: 'red',
                        time: '23:12',
                        isReady: i % 2 == 0 ? false : false
                    };

                    list.push(item);
                }

                return list;
            };

            for(var i= 2016; i >= 2009; i--){
                var year = {year: i, month: []};

                for(var j = 12 ; j > 0; j--){
                    var month = {};
                        month.month = j;
                        month.defaultMoth = j == 12;
                        month.calendars = createActivity(i, j);
                    var map = this.getYearMonthMap(i, j);

                    monthMap.push(map);
                    year.month.push(month);
                }

                data.push(year);
            }

            this.model.set({data: data});
            this.model.set({monthList: monthMap});
        },*/
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
            Content: '<div class="createCon">\
                                <div class="createListBox">\
                                    <div style="overflow-y: auto;" id="wrap">\
                                        <ul class="createListBox_ul wrap-container"></ul>\
                                    </div>\
                                    <div class="createList_menuTime">\
                                        <ul id="menu"></ul>\
                                    </div>\
                                </div>\
                           </div>',
            Empty: '<img src="/m2012/images/module/schedule/calendar_01.png" alt="" title="" class="createListBox_wu" />'
        }
    }));

    M139.namespace('M2012.Calendar.View.TimeLine.Menu', superClass.extend({
        name: 'M2012.Calendar.View.TimeLine.Menu',
        initialize: function (options) {

            this.year = options.year;
            this.month = options.month;
            this.onRemove = options.onRemove;
            this.onChange = options.onChange;

            this.master = options.master;

            this.render();
        },
        render: function () {

            this.ui = {};
            this.ui.wrap = $(this.template.year.format(this.year));
            this.initEvents();
        },
        initEvents: function () {
            var self = this;

            this.ui.wrap.click(function () {
                var array = _.pluck(self.month, 'month');
                var month = Math.max.apply(Math, array);
                self.onChange(self.year, month);
            });
        },
        createMonth: function () {
            var self = this;
            var month = this.month;
            var len = month.length;
            var html = $('<ul></ul>');

            this.element = {};

            for (var i = 0; i < len; i++) {
                var item = $(this.template.month.format(month[i].month, i));

                html.append(item);
                this.element[month[i].month] = item;
            }

            this.ui.month = html
            this.ui.wrap.append(html);

            this.ui.month.click(function () {
                return false;
            });

            this.ui.month.find('li').click(function () {
                var index = $(this).data('index');
                self.onChange(self.year, month[index].month);
            });
        },
        setMonth: function (month) {
            if (!this.ui.month) {
                this.createMonth();
            }

            month = parseInt(month);
            this.ui.month.find('.ons').removeClass('ons');
            this.element[month].find('span').addClass('ons');
        },
        remove: function (month) {
            //删除dom
            if (this.element && this.element[month]) {
                this.element[month].remove();
                delete this.element[month];
            }

            //删除自身数据
            for (var i = 0; i < this.month.length; i++) {
                if (this.month[i].month == month) {
                    this.month.splice(i, 1);
                    break;
                }
            }

            //删除年份
            if (this.month.length == 0) {
                this.ui.wrap.remove();
                this.onRemove(this.year);
            }
        },
        removeMonth: function () {
            if (this.ui.month) {
                this.ui.month.remove();
                this.ui.month = null;
            }
        },
        getElement: function () {
            return this.ui.wrap;
        },
        template: {
            year: '<li><span>{0}</span></li>',
            month: '<li data-index="{1}"><span>{0}月</span></li>'
        }
    }));

    M139.namespace('M2012.Calendar.View.TimeLine.Month', superClass.extend({
        name: 'M2012.Calendar.View.TimeLine.Month',
        TYPE: 2,
        initialize: function (options) {

            this.id = options.id;
            this.year = options.year;
            this.month = options.month;
            this.onRemove = options.onRemove;
            this.calendars = options.calendars;
            this.number = parseInt([this.year, this.month].join(''));

            this.model = options.model;
            this.master = options.master;
            this.activity = options.activity;

            this.render();
        },
        render: function () {

            this.ui = {};
            this.ui.wrap = $(_.template(this.template, { id: this.id, month: this.month }));
            this.ui.container = this.ui.wrap.find('.activity-container');

            this.element = [];
            this.initActivity();
        },
        initActivity: function () {
            var self = this;
            var data = this.calendars;
            var len = data.length;

            for (var i = 0; i < len; i++) {
                var options = {
                    index: i,
                    data: data[i],
                    id: data[i].id,
                    model: self.model,
                    master: self.master,
                    isReady: data[i].isReady
                };

                options.onView = function (param) {
                   // param.type = this.TYPE;
                    this.master.trigger(this.master.EVENTS.EDIT_ACTIVITY, param);
                };

                options.onUpdate = function (param) {
                    this.master.trigger(this.master.EVENTS.EDIT_GROUP_ACTIVITY, param);
                };

                options.onRemove = function (param) {
                    self.remove(param.id);
                };

                this.element[i] = new this.activity(options);
                this.append(this.element[i]);
            }
        },
        remove: function (id) {
            for (var i = 0; i < this.element.length; i++) {
                if (this.element[i].id == id) {
                    this.element.splice(i, 1);
                    break;
                }
            }

            if (this.element.length == 0) {
                this.ui.wrap.remove();
                this.onRemove(this);
            }
        },
        append: function (activity) {
            var element = activity.getElement();

            element.addClass(this.id);
            this.ui.container.append(element);
        },
        getElement: function () {
            return this.ui.wrap;
        },
        template: '<li class="createListBox_li" id="<%=id%>">\
                        <strong class="createListBox_li_time"><%=month%>月份</strong>\
                        <span class="i_icoTime"></span>\
                        <ul class="createListBox_li_ul activity-container clearfix">\
                        </ul>\
                    </li>'
    }));

    M139.namespace('M2012.Calendar.View.TimeLine.Activity', superClass.extend({
        name: 'M2012.Calendar.View.TimeLine.Activity',

        CONTENT_MAX: 70,

        MAX_HEIGHT: 53,

        TIP: {
            CONFIRM_INVITED_UPDATE: "您希望向现有邀请对象发送更新吗?",
            OPERATE_ERROR: "操作失败，请稍后再试！"
        },

        initialize: function (options) {

            this.id = options.id;
            this.data = options.data;
            this.index = options.index;
            this.model = options.model;
            this.isReady = options.isReady;

            this.onView = options.onView;
            this.onRemove = options.onRemove;
            this.onUpdate = options.onUpdate;
            this.master = options.master;

            this.setContent();
            this.render();
        },
        render: function () {

            this.ui = {};
            this.ui.wrap = $(_.template(this.template, this.data));
            this.ui.actionView = this.ui.wrap.find('.action-view');
            this.ui.actionEdit = this.ui.wrap.find('.action-edit');

            this.initEvents();

            if (this.isReady) {
                this.ui.actionEdit.remove();
            } else {
                this.ui.actionView.remove();
            }

            if(this.data.remind.length == 0){
                this.ui.wrap.find('.activity-remind').hide();
            }

            this.setContentHeight();
        },
        setContent: function () {
            var master = this.master;
            var title = this.data.title;

            if (title.length > this.CONTENT_MAX) {
                title = master.capi.substrAsByte(title, this.CONTENT_MAX) + '...';
            }
                        
            this.data.title = M139.Text.Html.encode(title);
        },
        setContentHeight: function () {
            var content = this.ui.wrap.find('.activity-content');
            var height = content.height();

            if (height > this.MAX_HEIGHT) {
                content.height(this.MAX_HEIGHT);
            }
        },
        initEvents: function () {
            var self = this;
            var wrap = this.ui.wrap;

            wrap.find('.btn-edit').click(function () {
                self.onUpdate({
                    seqNo: self.data.seqNo,
                    title: self.data.title,
                    dtStart: self.data.dtStart,
                    dtEnd: self.data.dtEnd,
                    enable: self.data.enable,
                });
            });

            wrap.find('.btn-remove').click(function () {
                self.remove({
                    id: self.id,
                    seqNo: self.id
                });
            });

            wrap.find('.btn-view').click(function () {
                self.onView({
                    seqNo: self.data.seqNo,
                    title: self.data.title,
                    dtStart: self.data.dtStart,
                    dtEnd: self.data.dtEnd,
                    enable: self.data.enable,
                    type: self.data.isOwner ? 4 : 2//如果是自己创建的活动就去编辑，否则只能查看
                });
            });
        },
        getElement: function () {
            return this.ui.wrap;
        },
        remove: function (param) {
            var self = this;

            top.$Msg.confirm('确定要删除该条活动吗?', function () {
                //查看日程类型
                var data = {
                    seqNos: param.seqNo,
                    isNotify: 0
                };

                self.model.delCalendar(data, function () {
                    top.M139.UI.TipMessage.show('操作成功', { delay: 3000 });
                    self.ui.wrap.fadeOut(300, function () {
                        self.ui.wrap.remove();
                        self.onRemove(param);
                    });
                }, function () {
                    self.onFail();
                });

            });
        },
        /**
         *  操作失败后的统一处理  
         */
        onFail: function () {

            var self = this;

            top.M139.UI.TipMessage.show(self.TIP.OPERATE_ERROR, {
                delay: 3000,
                className: "msgRed"
            });
        },
        template: '<li class="clearfix">\
                        <div class="createList_time" style="background-color:<%=color%>;"><strong><%=month%></strong>月<strong><%=day%></strong>日 <p><%=time%>  <%=week%></p></div>\
                        <div class="createList_info">\
                            <p class="activity-content"><%=title%></p>\
                            <span class="createList_infoA activity-remind">提醒:<%=remind%></span>\
                            <div class="createList_info_btn action-view"><a class="btnTb btn-view" href="javascript:"><span>查看</span></a></div>\
                            <div class="createList_info_btn action-edit"><a class="btnTb btn-edit" href="javascript:"><span>编辑</span></a><a class="btnTb btn-remove" href="javascript:"><span>删除</span></a></div>\
                        </div>\
                    </li>'
    }));


    $(function () {
        var menu = M2012.Calendar.View.TimeLine.Menu;
        var month = M2012.Calendar.View.TimeLine.Month;
        var activity = M2012.Calendar.View.TimeLine.Activity;

        var timeLine = new M2012.Calendar.View.TimeLine({
            master: window.$Cal,
            menu: menu,
            month: month,
            activity: activity
        });
    });


})(jQuery, _, M139, window._top || window.top);



