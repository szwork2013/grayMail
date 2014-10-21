
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
