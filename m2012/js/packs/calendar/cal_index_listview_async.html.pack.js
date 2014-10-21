
//$Cal.trigger($Cal.EVENTS.VIEW_CREATED,{name:"list",container:$("#viewpage_list")});

(function ($, _, M139, top) {
    var className = 'M2012.Calendar.Model.List';
    M139.namespace(className, Backbone.Model.extend({
        name: className,
        defaults: {
            viewName: 'list',
            ready: false, //是否启用

            //列表显示的区间
            datefrom: null,
            dateto: null,

            //任务列表,用于解决用户重复点击pre/next按钮后数据的顺序问题(异步接口,你懂的)
            taskList: [],
            taskObj: {},

            types: {
                pre: -1, //往前翻
                next: 1 //往后翻
            },

            interval: 6, //时间间隔,如开始时间为2013-01-01,则结束时间需要加6天,为2013-01-07
            maxCount: 0 //最大数量,为0则表示获取所有
        },
        EVENTS: {
            NAVI_CHANGE: 'change:navi',
            INIT: 'init',
            VIEW_SHOW: 'change:viewshow',
            STATUS_LOADING: 'status:loading',
            STATUS_LOADED: 'status:loaded',
            DATA_LOADED: 'event:dataloaded',
            ERROR: 'change:error',
            REQ_DONE: 'done',
            NAVIBAR_CAL_SELECT: 'select',
            NAVIBAR_CLICK_NOW: 'now' //很特殊,需要判断今天的时间(以及结束时间)是否在datefrom和dateto之间,否则需要重新计算范围请求接口
        },
        initialize: function (options) {
            var _this = this;

            _this.logger = new M139.Logger({ name: className });
            _this.master = options.master;
            _this.api = _this.master.api;
            _this.commonApi = _this.master.capi;

            _this.bindEvents();
        },
        bindEvents: function () {
            var _this = this,
                master = _this.master,
                EVENTS = _this.EVENTS;
            var viewName = _this.get("viewName");

            //master.on("change:year change:month change:day change:checklabels change:includeTypes", function (model, value) {
            //    if (master.get("view_location").view == viewName) {
            //        //_this.trigger("status:loading");//遮罩层

            //        if (_this.timer) clearTimeout(_this.timer);
            //        //延迟一下,可以缓解多个值变更时触发多次,造成请求多次的问题
            //        _this.timer = setTimeout(function () {
            //            _this.onDataChange();
            //        }, 0xff);
            //    }
            //});

            //日历勾选,类型如生日提醒
            master.on('change:checklabels change:includeTypes', function () {
                if (master.get("view_location").view == viewName) {
                    _this.trigger(EVENTS.STATUS_LOADING);//遮罩层

                    if (_this.timer) clearTimeout(_this.timer);
                    //延迟一下,可以缓解多个值变更时触发多次,造成请求多次的问题
                    _this.timer = setTimeout(function () {
                        _this.onDataChange({ refresh: true });
                    }, 0xff);
                }
            });

            //通过点击事件来触发,不再监听时间的变化
            master.on(EVENTS.NAVI_CHANGE, function (model, value) {
                if (master.get("view_location").view == viewName) {
                    var navi = master.get('navi'),
                        action = navi && navi.action,
                        refresh = false;

                    _this.trigger(EVENTS.STATUS_LOADING);//遮罩层,为了更快的显示出来

                    //如果是从日历选择器选择的日期或者点击今日,重置时间范围,并且要刷列表
                    if (action == EVENTS.NAVIBAR_CAL_SELECT || action == EVENTS.NAVIBAR_CLICK_NOW) {
                        _this.set({ datefrom: null, dateto: null }, { silent: true });
                        refresh = true;
                    }
                    _this.onDataChange({ refresh: refresh });
                }
            });

            //视图切换
            master.on(master.EVENTS.VIEW_SHOW, function (data) {
                if (master.get("view_location").view == viewName) {
                    _this.trigger(EVENTS.VIEW_SHOW); //清空视图
                    _this.trigger(EVENTS.STATUS_LOADING);//遮罩层
                    _this.set({ datefrom: null, dateto: null }, { silent: true }); //试图切换,不保留之前的日期范围
                    _this.onDataChange({ refresh: true });
                } else {
                    //切换到其他试图,是不是需要把taskList清空呢????????
                }
            });

            _this.on(EVENTS.INIT, function () {
                _this.trigger("status:loading");//遮罩层,为了更快的显示出来
                _this.onDataChange({ refresh: true });
            });

            var taskList = _this.get('taskList'),
                taskObj = _this.get('taskObj');
            _this.on(_this.EVENTS.REQ_DONE, function (taskId) {
                var topTask = taskList[0], obj;

                if (taskId == topTask) {
                    while (taskList.length > 0) { //防止任务2比任务1还先完成
                        topTask = taskList.shift(); //移除任务
                        obj = taskObj[topTask];

                        if (obj) {
                            _this.processData(obj.data, obj.action, obj.refresh);
                        } else {
                            taskList.unshift(topTask); //压回堆栈
                            break;
                        }
                    }
                }

                if (taskList.length == 0) {
                    //隐藏loading层
                    _this.trigger(EVENTS.STATUS_LOADED);
                }
            });
        },
        onDataChange: function (options) {
            var _this = this,
                master = _this.master,
                EVENTS = _this.EVENTS,
                refresh = !!(options && options.refresh); //是否需要刷新列表视图,还是直接append操作

            var interval = _this.get("interval"),
                maxCount = _this.get("maxCount"),
                datefrom = _this.get('datefrom'),
                dateto = _this.get('dateto'),
                taskList = _this.get('taskList'),
                taskObj = _this.get('taskObj'),
                types = _this.get('types'),
                includeLabels = master.get("checklabels") || [], //includeLabels
                includeTypes = master.get("includeTypes") || [];


            // 4. 特殊情况：如果labels为空[]时，则直接回调空数据，不必请求服务端
            if (includeLabels.length === 0) {
                _this.processData([]);
                return;
            }

            var year = master.get("year"),
                month = master.get("month") - 1, //master中存的月份是1-12,所以需要减一
                day = master.get("day"),
                startDate = new Date(year, month, day),
                endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + interval),
                loadData = false, type;

            //keep date region
            if (datefrom > startDate || dateto < endDate) { //判断是否需要加载数据
                loadData = true;
            }

            if (datefrom == null || startDate < datefrom) {
                datefrom = startDate;
                type = types.pre; //往前翻页
            }

            if (dateto == null || endDate > dateto) {
                dateto = endDate;
                type = types.next; //往后翻页
            }

            _this.set({ datefrom: datefrom, dateto: dateto }, { silent: true }); //save region
            //end

            //没强制刷新,并且经过判断日期确定无需刷新列表
            if (!refresh && !loadData) {
                _this.trigger(EVENTS.REQ_DONE); //不请求,直接触发完成事件,用来判断是否要隐藏loading浮层
                return; //不需要加载数据,直接返回
            }

            if (refresh) {
                //如果需要刷新渲染,则根据时间范围选择
                //(不需要渲染的,就根据选择的时间,然后+7天作为时间段获取)
                startDate = datefrom;
                endDate = dateto;
            }
            //组装参数
            var data = {
                "startDate": M139.Date.format("yyyy-MM-dd", startDate),
                "endDate": M139.Date.format("yyyy-MM-dd", endDate),
                "includeLabels": includeLabels.join(","),
                //"includeTypes": includeTypes.join(","),
                "maxCount": maxCount
            };

            includeTypes = includeTypes.join(",");
            if (includeTypes !== "0") { //后台要求,为0时不传递
                $.extend(data, {
                    "includeTypes": includeTypes
                })
            }

            taskList.push(data.startDate); //startDate作为任务的taskId
            _this.api.getCalendarView({
                "data": data,
                "success": function (responseData) {
                    responseData = $.extend({}, responseData);
                    if (responseData.code == M2012.Calendar.Constant.codes.S_OK) {
                        taskObj[data.startDate] = {
                            data: responseData, //数据
                            action: type, //操作
                            refresh: refresh
                        };
                        _this.trigger(EVENTS.REQ_DONE, data.startDate); //触发接口完成事件,内部处理队列
                    } else {
                        responseData = responseData || {};
                        console.log("%c[API ERROR][CODE = %s][errorCode = %s]", 'color:red', responseData.code, responseData.errorCode);
                        //TODO 错误处理

                    }
                },
                "error": function () {

                }
            });
        },
        processData: function (responseData, action, refresh) { //3个参数,不用obj了
            var _this = this,
                commonApi = _this.commonApi,
                EVENTS = _this.EVENTS;

            var table = responseData["table"],
                obj = responseData["var"];

            var data = {},
                map = {};
            //遍历var数据,根据seqNo从table中获取详情
            for (var day in obj) {
                var info = obj[day].info || [],
                    arr = [];
                for (var i = 0, len = info.length; i < len; i++) {
                    var seqNo = info[i];
                    var item = table[seqNo];

                    //不进行多次的Date转换,直接获取并判断拼接字符串,优化性能
                    item["time"] = _this.getActivityTime(item);
                    //end

                    arr.push(item); //供显示
                    map[seqNo] = item; //供索引,popup用
                }
                var str = M139.Date.format("MM月dd日(w)", commonApi.parse(day)); //2013-01-01===>01月01日(六)

                var sortedArr = _.sortBy(arr, function (subitem) {
                    return subitem.startTime;
                });

                data[str] = sortedArr;
            }

            //保存
            _this.set({ "map": map, "data": data }, { silent: true });
            _this.trigger(EVENTS.DATA_LOADED, { data: data, action: action, refresh: refresh }); //监听data对象的变动
            _this.trigger(EVENTS.STATUS_LOADED); //隐藏遮罩层
        },
        getActivityTime: function (item) {
            var _this = this,
                startDate = _this.getActivityDate(item.dtStart, item),
                endDate = _this.getActivityDate(item.dtEnd, item);
            var time = _this.getTimeRange(startDate, endDate, item.allDay);
            return time;
        },
        getActivityDate: function (str, item) {
            var _this = this,
                commonApi = this.commonApi,
                str = (str && str.trim()) || '',
                item = item || {}; //item单纯是为了出错时,上报用的

            var reg = /\d{1,2}:\d{1,2}/; //只匹配第一个
            var m = str.match(reg);
            var result = "00:00"; //commonApi.fixHourTime方法sb了.所以要给一个默认的值
            if (m) {
                result = m[0];
            } else {
                var errInfo = ["时间格式错误", str, item.seqNo].join("|");
                _this.logger.error("时间格式错误|" + str);
            }
            return result;
        },
        getTimeRange: function (start, end, allDay) {
            //获取诸如 08:30-09:30 这样的时间字符串
            var time = '',
                commonApi = this.commonApi;

            start = commonApi.fixHourTime(start);
            end = commonApi.fixHourTime(end);
            if (allDay == 1) {
                time = '全天';
            } else if (start === end) {
                time = start;
            } else {
                time = start + "-" + end;
            }
            return time;
        }
    }));
})(jQuery, _, M139, window._top || window.top);
﻿
(function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var _className = "M2012.Calendar.View.List";

    M139.namespace(_className, superClass.extend({
        name: _className,
        viewName: 'list',
        template: {
            TABLE: ['<table class="newlist-tab" role="grid">',
                        '<thead>',
                            '<tr>',
                                '<th class="td1 fw_b">{datestr}</th>', //今天 02月27日(四)
                                '<th></th>',
                                '<th class="td2"></th>',
                            '</tr>',
                        '</thead>',
                        '<tbody>',
                            '{tbody}',
                        '</tbody>',
                    '</table>'].join(""),
            TR: ['<tr data-id="{seqNo}" data-cmd="{cmd}" data-type="{type}">',
                    '<td class="td1">{time}</td>',
                    '<td>',
                        '<div class="textb">',
                        '<span class="ad-tagt" style="background-color:{color}; border-color:#63CFCE;"></span>',
                        '<span class="textB_con">{title}</span>',
                        '</div>',
                    '</td>',
                    '<td class="td2">',
                        '<i class="i-clock IconPosion {iconClass}"></i>',
                    '</td>',
                    '</tr>'].join(""),
            EMPTY: '<div id="list_empty" class="empty_btn">你今天还没有活动，<a href="javascript:void(0);" title="">马上创建活动</a></div>',
            LOADING: '<div class="" id="divWaiting"><div class="bg-cover"></div><div class="noflashtips inboxloading loading-pop"><!--[if lte ie 7]><i></i><![endif]--><img style="vertical-align:middle" alt="" src="/m2012/images/global/load.gif">正在载入中，请稍候......</div></div>'
        },
        types: {
            replace: 0, //替换所有内容
            before: -1, //在内容之前添加
            after: 1  //在内容之后添加
        },
        messages:{
            LOADING: "正在加载中..."
        },
        initialize: function (options) {
            var _this = this;

            _this.master = options.master;
            superClass.prototype.initialize.apply(_this, arguments);

            _this.initEvents();
        },
        initEvents: function () {
            //此方法仅用于初始化
            var _this = this,
                master = _this.master,
                EVENTS = master.EVENTS;

            master.on(EVENTS.VIEW_CREATED, function (data) {
                if (_this.viewName === data.name) {
                    //渲染
                    _this.container = data.container;
                    _this.container.css({
                        "overflow-y": "auto",
                        "overflow-x": "hidden",
                        "position": "relative"
                    });
                    _this.resize();
                    _this.model = new M2012.Calendar.Model.List({ master: master });

                    _this.bindEvents();

                    if (_.isFunction(data.onshow)) {
                        data.onshow();
                    }
                }
            }).on(EVENTS.VIEW_SHOW, function (data) {
                if (_this.viewName === data.name) {
                    if (data && data.args && !data.args.silent && data.args.subview === _this.viewName) {
                        _this.container.scrollTop(0);
                        _this.render();
                    }
                }
            });

            $(window).resize(function () {
                _this.resize();
            });
        },
        resize: function () {
            var _this = this,
                container = _this.container;
            if (container) {
                if (!!container.data('onload')) return; //数据加载中,不调整滚动条,加载完会自动设置为auto

                if (_this.resizeTimer) clearTimeout(_this.resizeTimer);

                _this.resizeTimer = setTimeout(function () {
                    container.height($(document.body).height() - $("#pnlNaviBar").height());
                    container.css({ "overflow-y": "auto" });
                }, 250);
            }
        },
        render: function () {
            //this.model.trigger("init");
        },
        bindEvents: function () {
            var _this = this,
                model = _this.model,
                EVENTS = model.EVENTS,
                master = _this.master,
                container = _this.container;

            model.on(EVENTS.DATA_LOADED, function (obj) {
                //数据变动,触发界面渲染
                _this.renderList(obj);
            }).on(EVENTS.ERROR, function () {
                //错误
                var msg = model.get("errMsg") || ''; //TODO 按照实际情况显示提示语
                if (!!msg) {
                    top.M139.UI.TipMessage.show(msg, {
                        delay: 3000,
                        className: "msgRed"
                    });
                }
            }).on(EVENTS.VIEW_SHOW, function () {
                container.empty();
            });

            //遮罩层单独一行

            model.on(EVENTS.STATUS_LOADING, function () {
                top.M139.UI.TipMessage.show(_this.messages.LOADING);

                //以下代码暂时不删除,防止领导又........你懂的
                //var div = container.find("#divWaiting");
                //if (div.size() == 0) {
                //    div = container.append(_this.template.LOADING);
                //}
            }).on(EVENTS.STATUS_LOADED, function () {
                top.M139.UI.TipMessage.hide();

                //同上
                ////不能放在dataloaded,因为可能只是任务列表中的某个任务完成了
                //_this.container.find('#divWaiting').remove();
                //_this.container.css({ "overflow-y": "auto" });
                //_this.container.data("onload", false);
            });
            //end

            _this.container.off("click").on("click", function (e) {
                _this.onElemClick(e);
            });
        },
        onElemClick: function (e) {
            var _this = this,
                master = this.master,
                elem = $(e.target),
                tbody = elem.closest("tbody");

            var tagName = e.target.tagName,
                EVENTS = master.EVENTS;

            master.trigger(EVENTS.HIDE_ACTIVITY_POPS);

            if (tbody.size() > 0) { //表头是thread.所以找不到tbody
                var tr = elem.closest("tr");
                var cmd = tr.data("cmd"),
                    id = tr.data("id"),
                    type = tr.data("type");
                var map = this.model.get("map"),
                    item = map[id];

                //显示详情弹窗
                master.trigger(EVENTS.VIEW_POP_ACTIVILY, {
                    seqNo: id,
                    type: type,
                    target: elem,
                    event: e,
                    callback: function () {
                        _this.logger.log("[schdule deleted]");
                        _this.model.trigger("init");
                    }
                });
            } else if (tagName && tagName.toLowerCase() == 'a') {
                //列表为空时,会有一个链接
                master.trigger(EVENTS.ADD_ACTIVITY);
            }
        },
        renderList: function (obj) {
            var _this = this,
                model = _this.model,
                types = _this.types,
                type = types.replace,
                tables, html = [];

            var data = obj.data || model.get("data");
            if (typeof obj.action !== 'undefined') { //action表示navibar点击: -1:pre, 1: next
                type = obj.action > 0 ? types.after : types.before; //是否添加在后面
            }
            if (obj.refresh) {
                type = types.replace;
            }

            if (_.keys(data).length == 0) { //没活动,显示添加
                if (type == types.replace) {
                    html.push(_this.template.EMPTY);
                }
            } else {
                _this.container.find('#list_empty').remove(); //删除 无活动时添加活动的div
                for (var day in data) {
                    html.push(_this.getListHtml(day, data[day]));
                }
            }

            var dom = html.join('');
            tables = _this.container.find('table');
            switch (type) {
                case types.before: //添加在前面
                    if (tables.size() > 0) {
                        tables.eq(0).before(dom);
                        break;
                    }
                    //没table,触发default
                case types.after: //添加在后面
                    _this.container.append(dom);
                    break;
                default: //直接覆盖
                    _this.container.html(dom);
                    break;
            }
        },
        getListHtml: function (day, data) {
            var _this = this,
                model = _this.model,
                commonApi = _this.master.capi,
                tplTable = _this.template.TABLE,
                tplTr = _this.template.TR;
            var icons = M2012.Calendar.Constant.activilyIconType;

            var tbody = [];

            for (var i = 0, len = data.length; i < len; i++) {
                var item = data[i];

                var iconClass = _this.getActityIcon(item); //TODO 特殊图标

                var tr = $T.format(tplTr, {
                    "seqNo": item.seqNo,
                    "cmd": 'showPopup',
                    "type": commonApi.analyzeType(item), //获取类型，如共享，邀请，自主创建等
                    //"time": model.getTimeRange(item.startTime, item.endTime),
                    "time": item.time,
                    "color": item.color,
                    "title": $T.Html.encode(item.title),
                    "iconClass": iconClass //enable是字符串
                });

                tbody.push(tr);
            }

            var html = $T.format(tplTable, {
                "datestr": day,
                "tbody": tbody.join('')
            });
            return html;
        },
        getActityIcon: function (data) { //TODO 获取活动的类型图标,需要抽取到公共方法中去
            var _this = this,
                activytyIcons = M2012.Calendar.Constant.activilyIconType,
                types = M2012.Calendar.Constant.specialType;

            var specialType = data.specialType,
                operationFlag = data.operationFlag,
                status = data.status,
                isenable = !!parseInt(data["enable"]); //enable是字符串
            var icon = '';

            //产品需求
            switch (specialType) {
                case types.birth://生日提醒
                    icon = activytyIcons.birthday;
                    break;
                case types.baby: //宝宝防疫
                case types.countDown: //倒数日
                    icon = activytyIcons.black_clock;
                    break;
                case types.general:
                    var tempIcon = activytyIcons[operationFlag];
                    if (!!tempIcon) {
                        icon = tempIcon; //存在特殊标记位
                    } else {
                        //不满足以上特殊标记
                        if (!status) {
                            //邀请消息.未接受
                            icon = activytyIcons.unaccepted;
                        } else {
                            if (isenable) {
                                icon = activytyIcons.black_clock;
                            } else {
                                icon = 'hide';
                            }
                        }
                    }
                    break;
                default:
                    icon = 'hide';
                    break;
            }

            return icon;
        },
        showTipMessage: function (msg, delay, colorClass) {
            var _this = this,
                options = {
                    delay: delay,
                    className: colorClass
                };

            top.M139.UI.TipMessage.show(msg, options);
        }
    }));

    $(function () {
        window.listView = new M2012.Calendar.View.List({ master: window.$Cal });
    });

})(jQuery, _, M139, window._top || window.top);

