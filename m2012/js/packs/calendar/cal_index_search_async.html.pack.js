/**
 * 没什么用的model....
 */
; (function (jQuery, _, M139, top) {
    M139.namespace('M2012.Calendar.Model.Search', Backbone.Model.extend({
        defaults: {
            keys: []
        },
        initialize: function () {
            this.API = M2012.Calendar.API;
        },
        clear: function () {
            var _this = this;
            _this.attributes = _this.defaults;
        },

        /**
         * 订阅公共日历
         * @param data {Object} 订阅内容的对象
         * @param data.labelId {Int} 公共日历ID
         * @param data.color {String} 公共日历颜色（用户自定义）
         * @param callback {Function} 回掉函数
         */
        subscribeLabel: function (data, callback, onerror) {
            this.API.subscribeLabel({
                data: data,
                success: callback,
                error: onerror
            });
        },
        /**
         * 退订公共日历
         * @param labelId {Int} 公共日历ID
         * @param callback {Function} 回掉函数
         */
        cancelSubscribeLabel: function (labelId, callback, onerror) {
            this.API.cancelSubscribeLabel({
                data: { labelId: labelId },
                success: callback,
                error: onerror
            });
        },
        /**
         * 搜索公共日历
         * @param data.searchText {String} 搜索关键字
         * @param data.pageIndex {Int} 页码
         * @param data.pageSize {Int} 每页显示数量
         * @param callback {Function} 回掉函数
         */
        searchPublicLabel: function (data, callback, onerror) {
            this.API.searchPublicLabel({
                data: data,
                success: callback,
                error: onerror
            });
        }
    }));
})(jQuery, _, M139, window._top || window.top);
﻿
/**
 * 搜索公共日历页面相关js
 * 其中包含：
 * M2012.Calendar.Search.View
 * M2012.Calendar.SearchResult.View
 */


//TODO 接入 href="#mod/search/123"

var _top = top;

(function (jQuery, _, M139, top) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var master = window.$Cal,
        EVENTS = master.EVENTS;

    M139.namespace('M2012.Calendar.View.Search', superClass.extend({

        TEMPLATE: ['<div id="calendar_search" class="sd-content">',
                     '<div id="searchTab" class="tab tab-schedule bgMargin">',
                       '<div class="createTop tabTitle">',
                         '<h2>',
                           '<span>搜索公开的日历</span><a href="javascript:void(0);" id="goback" class="back">&lt;&lt;返回</a>',
                         '</h2>',
                       '</div>',
                     '</div>',
                     '<div id="searchMain" class="createUl" style="overflow-y: auto;">',
                       '<div class="seacrh-sch">',
                         '<p class="pb_10">请输入日历名称、作者名称或者邮箱地址进行搜索。</p>',
                         '<div class="p_relative">',
                           '<div>',
                             '<input type="text" maxlength="36" class="iText" id="txtSearch">',
                             '<a href="javascript:" class="btnSet" id="btnSearch">',
                               '<span>搜索</span>',
                             '</a>',
                           '</div>',
                           '<div style="left:0px;top:-26px; background-color: #fff; display:none;" class="tips write-tips" id="searchTip">',
                             '<div class="tips-text">搜索内容不能为空</div>',
                             '<div class="tipsBottom diamond" style="background-color:#fff;"></div>',
                           '</div>',
                         '</div>',
                       '</div>',
                       '<div class="seacrh-sch seacrh-schb" id="resultPanel" style="display: none;">',
                         '<p id="pSearchTip"></p>',
                         '<table class="systemwjj searchtab" id="tbList">',
                           '<thead>',
                             '<tr>',
                               '<th class="td1"></th>',
                               '<th class="td2">日历名称</th>',
                               '<th class="td3">日历作者</th>',
                               '<th class="td4"></th>',
                             '</tr>',
                           '</thead>',
                           '<tbody id="tbResult"></tbody>',
                         '</table>',
                       '</div>',
                     '</div>',
                   '</div>'].join(""),
        Dom: {
            TAB: "#searchTab",
            MAIN: "#searchMain",
            PANEL: "#resultPanel",
            INPUT: "#txtSearch",
            BUTTON: "#btnSearch",
            EMPTY_TIPS: "#searchTip",
            TABLE_LIST: "#tbList",
            RESULT_TIPS: "#pSearchTip",
            GOBACK: "#goback"
        },
        MESSAGES: {
            RESULT: "搜索结果：共搜索到 {count} 个公开日历（搜索“<span class='fw'>{keyWord}</span>”），您可以订阅搜索到的日历",
            SEARCH_ONFAIL: "查询失败",
            SEARCH_ONERROR: "查询失败",

            SEARCHING: "搜索中..."
        },
        APISTATUS: {
            OK: "S_OK",
            ERROR: "999",

            SEARCH_ERROR: "ERROR"
        },
        MAX_WORD_LENGTH: 36,
        viewName: "search",

        initialize: function (options) {
            var _this = this;
            options = options || {};

            //初始化搜索内容
            _this.master = options.master;
            _this.search = "";

            //此方法仅用于初始化
            var master = _this.master,
                EVENTS = master.EVENTS;

            //创建搜索页的div
            master.on(EVENTS.VIEW_CREATED, function (data) {
                _this.initEvents(data);
            });

            //触发搜索
            master.on(EVENTS.VIEW_SHOW, function (data) { //create时的参数由URL带过来
                _this.search = (data.args && data.args.search) || '';
                _this.render();
            });
        },
        initEvents: function (data) {
            var _this = this;
            var domId = _this.Dom;

            if (_this.viewName === data.name) {
                _this.container = data.container;
                _this.container.html(_this.TEMPLATE);

                //保存页面对象
                var domId = _this.Dom;
                _this.tab = $(domId.TAB, _this.container);
                _this.main = $(domId.MAIN, _this.container);
                _this.resultPanel = $(domId.PANEL, _this.container);
                _this.input = $(domId.INPUT, _this.container);
                _this.button = $(domId.BUTTON, _this.container);
                _this.tips = $(domId.EMPTY_TIPS, _this.container);
                _this.table = $(domId.TABLE_LIST, _this.container);
                _this.resultTip = $(domId.RESULT_TIPS, _this.container);
                _this.goback = $(domId.GOBACK, _this.container);

                //结果列表
                _this.view = new M2012.Calendar.View.SearchResult();
                _this.model = new M2012.Calendar.Model.Search();


                //region 绑定事件
                //顶部返回
                _this.goback.on("click", function () {
                    _this.master.trigger(EVENTS.NAVIGATE, { path: "mainview" });
                });

                //输入框的回车监听
                _this.input.bind("keyup", function (e) {
                    if (e.keyCode == 13) {
                        _this.button.trigger("click");
                    }
                });

                //点击搜索
                _this.button.bind("click", function () {
                    _this.resultPanel.show(); //显示结果面板

                    var text = _this.input.val();
                    if (text.replace(/\s/gi, '') == '') {
                        _this.showInputTip();
                        return;
                    }

                    _top.M139.UI.TipMessage.show(_this.MESSAGES.SEARCHING);
                    _this.searchCalendar(text);
                });

                //调整窗口大小
                $(window).on("resize", function () {
                    var mainHeight = $(document.body).height() - _this.tab.height();
                    _this.main.height(mainHeight);
                });

                _this.input.focus(); //默认聚焦到输入框
                //endregion

                if (data.onshow) {
                    data.onshow(); //fire EVENTS.VIEW_SHOW
                }
            }
        },
        render: function () {
            var _this = this;
            var searchText = _this.search || '';
            _this.input.val(searchText);
            if (searchText) {
                _this.button.trigger("click"); //搜索
            }
        },
        showInputTip: function () {
            var _this = this;

            _this.tips.show();
            _this.input.focus();
            $D.flashElement(_this.input);

            if (_this.timer) clearTimeout(_this.timer);
            _this.timer = setTimeout(function () {
                _this.tips.hide();
            }, 3000);
        },
        searchCalendar: function (keyWord) {
            var _this = this;
            var model = _this.model;

            keyWord = keyWord.substring(0, _this.MAX_WORD_LENGTH);

            _this.model.searchPublicLabel({
                searchText: keyWord //内部会处理,不需要encode
            }, function (result) {
                _top.M139.UI.TipMessage.hide();

                if (result.code == _this.APISTATUS.OK) {
                    var data = result["var"];
                    //结果提示语
                    var tip = $T.format(_this.MESSAGES.RESULT, {
                        count: data.count,
                        keyWord: $T.Html.encode(keyWord)
                    });
                    _this.resultTip.html(tip);

                    //隐藏结果列表
                    if (data.count <= 0) {
                        _this.table.hide();
                    } else {
                        _this.table.show();
                    }

                    //绑定结果列表数据
                    _this.view.render(data.table);
                } else {
                    _this.onSearchError();
                }
            }, function () {
                _this.onSearchError();
            });
        },
        onSearchError: function () {
            var _this = this;

            _top.M139.UI.TipMessage.show(_this.MESSAGES.SEARCH_ONFAIL, { delay: 1500 });

            var tip = $T.format(_this.MESSAGES.RESULT, {
                count: 0,
                keyWord: $T.Html.encode(keyWord)
            });
            _this.resultTip.html(tip);

            _this.table.hide();
            _this.view.render(null, _this.APISTATUS.SEARCH_ERROR);
        }

    }));

    $(function () {
        jQuery.fx.off = false;//M139关闭了特效
        window.searchView = new M2012.Calendar.View.Search({
            master: window.$Cal
        });
    });
})(jQuery, _, M139, window._top || window.top);

(function (jQuery, _, M139, top) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var master = window.$Cal,
        EVENTS = master.EVENTS;
    var CommonAPI = M2012.Calendar.CommonAPI.getInstance();
    var FIFA_ID = master.CONST.FIFA_WORLD_CUP_ID;

    M139.namespace('M2012.Calendar.View.SearchResult', superClass.extend({
        el: "#tbResult",
        TEMPLATE: {
            TR: ['<tr id="label_item_{id}">',
                    '<td class="td1">',
                        '<a labelId="{id}" cmd="showdetail" parentid="label_item_{id}" isexpend="0" issys="{issys}" href="javascript:void(0);" class="i-s-add" rel="detail"></a>',
                    '</td>',
                    '<td class="td2">',
                        '<span class="ad-tagt" style="background-color: {color};"></span>',
                        '{subject}',
                    '</td>',
                    '<td class="td3">{author}{isOfficial}</td>',
                    '<td class="td4">',
                        '<a href="javascript:void(0);" class="{style}" cmd="subscribe" labelId="{id}" rel="subscribe">{statusText}</a>',
                    '</td>',
                '</tr>',
                '<tr id="label_item_detail_{id}" class="searchtab-info" style="display:none;">',
 					'<td colspan="4">',
 						'<p>说明：{content}</p>',
 						//'<div id="label_item_color_{id}"></div>',
 					'</td>',
 				'</tr>'].join(""),
            DEFAULT: ['<tr class="searchtab-info">',
 					    '<td colspan="4">',
 						    '<div class="ta_c">{text}</div>',
 					    '</td>',
 				    '</tr>'].join(""),
            SUBSCRIBED: '<span id="{id}"><i class="i_ok_min"></i> 订阅成功</span>',
            OFFICIAL: '<span style="color:Red;">（官方）</span>'
        },
        STATUS: {
            MANAGE: { TEXT: "编辑日历", CLASS: "", INDEX: 0 },
            SUBSCRIBE: { TEXT: "订阅+", CLASS: "sch-arss", INDEX: 1 },
            UNSUBSCRIBE: { TEXT: "退订", CLASS: "", INDEX: 2 },

            SEARCH_ERROR: "ERROR"
        },
        APISTATUS: {
            OK: "S_OK",
            ERROR: "999"
        },
        KEYMAP: {
            MANAGE: "MANAGE",
            SUBSCRIBE: "SUBSCRIBE",
            UNSUBSCRIBE: "UNSUBSCRIBE"
        },
        MESSAGES: {
            SUBSCRIBE_ERR: "订阅日历 “{calendar}” 失败",
            UNSUBSCRIBE_ERR: "退订日历 “{calendar}” 失败",
            UNSUBSCRIBE_TIP: "退订后您将不能查看该日历中的活动，你确定退订吗？",
            SUBSCRIBE_TITLE: "订阅日历",
            UNSUBSCRIBE_TITLE: "退订日历",

            EMPTY: "搜索结果为空",
            SEARCH_ERR: "查询公共日历失败，请重试",

            LOTTERY_TITLE: "订阅成功"
        },
        SysLabelFlag: "1", //运营等系统日历标记

        initialize: function (options) {
            var _this = this;
            options = options || { target: $("#tbResult") }

            _this.target = options.target;
            _this.model = new M2012.Calendar.Model.Search(); //用来保存数据

            if (options.data instanceof Array) {
                _this.render(options.data);
            }
        },
        initEvents: function () {
            var _this = this;
            var allStatus = _this.STATUS;

            _this.target.off("click").on("click", function (event) {
                //TODO 处理连续点击的情形
                _this.onCommand(event);
            });
        },
        /**
         * 显示查询结果
         * @parm data {Array} 结果对象
         * @param status {String} 可选，在查询失败时，根据状态显示不同结果列表
         */
        render: function (data, status) {
            var _this = this;

            if (status) {
                _this.target.html($T.format(_this.TEMPLATE.DEFAULT, { text: _this.MESSAGES.SEARCH_ERR }));
            } else {
                _this.target.html(_this.getHtmlList(data));
                _this.initEvents();
            }
        },
        onCommand: function (event) {
            var _this = this;
            if (event.target.tagName == "A") {
                var container = $(event.target);
                var command = container.attr("cmd");
                if (command) {
                    _this.execCommand["on" + command](container, _this);
                }
            }
        },
        execCommand: {
            onshowdetail: function (container, _this) {
                var model = _this.model;
                var calendarId = container.attr("labelId");
                var info = model.get(calendarId);
                var isexpend = info.isexpend;
                var detail = $("#label_item_detail_" + calendarId);
                if (isexpend == false) {
                    //未展开，执行展开操作
                    detail.show();
                    container.attr({ "class": "i-s-jian" });
                    info.isexpend = true; //已展开
                }
                else {
                    detail.hide();
                    container.attr({ "class": "i-s-add" });
                    info.isexpend = false; //已关闭
                }
            },
            onsubscribe: function (container, _this) {
                var model = _this.model;
                var calendarId = container.attr("labelId");
                var info = model.get(calendarId);
                if (!_this.frequencyLimit(calendarId)) return; //检查频率

                _this.execSubscribe[info.statusKey](container, _this); //细分执行内容
            }
        },
        execSubscribe: {
            MANAGE: function (container, _this) {
                //跳转
                var labelId = container.attr("labelId");

                //触发master事件，跳转到管理页面
                master.trigger(EVENTS.EDIT_LABEL, { labelId: Number(labelId) });
                return false;
            },
            SUBSCRIBE: function (container, _this) {
                var model = _this.model;
                var calendarId = container.attr("labelId");
                var info = model.get(calendarId);

                var color = info.isexpend ? info.selectedcolor : info.color;//选择的颜色

                var errMsg = $T.format(_this.MESSAGES.SUBSCRIBE_ERR, {
                    calendar: $T.Html.encode(info.labelName)
                });

                if (!!info.isOfficial) { // 后台发布的日历需要弹窗
                    _this.showPopup(_this, container, { labelId: calendarId, color: color, showSubscribe: true });
                    return;
                }

                //执行订阅
                _this.model.subscribeLabel({
                    labelId: parseInt(calendarId), //Int
                    color: color //String
                }, function (response) {
                    var code = response && response.code;
                    if (code == _this.APISTATUS.OK) {
                        info.statusKey = _this.KEYMAP.UNSUBSCRIBE;
                        //左侧显示的颜色也相应修改
                        info.color = color;

                        //处理订阅完成的流程
                        var spanId = "s_subscribed_" + calendarId;
                        var span = $T.format(_this.TEMPLATE.SUBSCRIBED, {
                            id: spanId
                        });
                        container.after(span);
                        container.hide();

                        setTimeout(function () {
                            $("#" + spanId).fadeOut(1000, function () {
                                container.removeAttr("class").html(_this.STATUS.UNSUBSCRIBE.TEXT).show();
                                _this.initEvents(); //因为click绑定在tbody上，无法off掉单个dom的click
                            });
                        }, 1500); //延迟显示退订

                        //通知主控，新订阅了公共日历。
                        master.trigger(master.EVENTS.LABEL_ADDED, {
                            seqNo: info.seqno,
                            labelName: info.labelName,
                            color: color, //用户可自定义颜色,用自定义的
                            isShare: 0
                        });

                        CommonAPI.addBehavior({ actionId: 104515, thingId: 6, moduleId: 19 });
                    } else {
                        //接口未返回预期结果
                        if (response && response.errorCode == '10') return; //已经订阅
                        _top.$Msg.alert(errMsg, {
                            dialogTitle: _this.MESSAGES.SUBSCRIBE_TITLE,
                            icon: 'warn'
                        });
                    }
                }, function (params, response) {
                    _top.M139.UI.TipMessage.show(errMsg, { delay: 3000, className: "msgRed" });
                });
            },
            UNSUBSCRIBE: function (container, _this) {
                var model = _this.model;
                var calendarId = container.attr("labelId");
                var info = model.get(calendarId);

                var errMsg = $T.format(_this.MESSAGES.UNSUBSCRIBE_ERR, {
                    calendar: $T.Html.encode(info.labelName)
                });

                _top.$Msg.confirm(_this.MESSAGES.UNSUBSCRIBE_TIP, function () {
                    //执行取消订阅
                    model.cancelSubscribeLabel(parseInt(calendarId),
                        function (response) {
                            var code = response && response.code;
                            if (code == _this.APISTATUS.OK) {
                                //完成取消订阅的逻辑
                                info.statusKey = _this.KEYMAP.SUBSCRIBE; //标记为可订阅
                                //处理订阅完成的流程
                                var subscribe = _this.STATUS.SUBSCRIBE;
                                container.html(subscribe.TEXT).attr("class", subscribe.CLASS);

                                //通知主控，退阅了公共日历。
                                master.trigger(master.EVENTS.LABEL_REMOVE, {
                                    seqNo: info.seqno,
                                    labelName: info.labelName
                                });
                            } else {
                                //接口未返回预期结果
                                if (response && response.errorCode == '11') return; //不存在订阅关系

                                _top.$Msg.alert(errMsg, {
                                    dialogTitle: _this.MESSAGES.UNSUBSCRIBE_TITLE,
                                    icon: 'warn'
                                });
                            }
                        }, function (params, response) {
                            _top.M139.UI.TipMessage.show(errMsg, { delay: 3000, className: "msgRed" });
                        });
                }, {
                    dialogTitle: _this.MESSAGES.UNSUBSCRIBE_TITLE,
                    icon: 'warn'
                });
            },
            convertToUrlParams: function (params) {
                //convertToUrlParams({a:1,b:2})==>"a-1/b-2"
                //注意: 有bug,转换的对象的键字符串中,不能有"-",如不允许{"a-b-c":1}
                //只支持单层对象模式,即{a:1,b:2}形势,不支持{a:{b:1}}
                var arr = [];
                for (var key in params) {
                    arr.push(key + "-" + params[key] || ''); //可能有BUG,undefined无法在url中体现转换成空
                }
                return arr.join("/");
            }
        },
        showPopup: function (_this, container, options) {
            //2014世界杯订阅
            top.$Evocation.openSubsCalendar({
                labelId: options.labelId,
                color: options.color,
                containerHeight: $(".ad-list-div").height() || 400,
                element: container,
                showSubBtn: options.showSubscribe, //是否显示订阅按钮
                isOffical: true,
                subscribe: function (data) {
                    //订阅成功后的回调,为毛要?因为可以退订,退订完又可以订阅
                    _this.changeButtonStatus(_this, container, options.labelId, true);
                },
                unsubscribe: function (data) {
                    //退订成功后的回调
                    _this.changeButtonStatus(_this, container, options.labelId, false);
                }
            });
        },
        changeButtonStatus: function (_this, container, labelId, issubscribe) {
            var text = _this.STATUS.SUBSCRIBE.TEXT;
            var info = _this.model.get(labelId);
            if (!issubscribe) { //如果是退订,则需要给按钮加上样式,并且修改为"订阅"2个字
                info.statusKey = _this.KEYMAP.SUBSCRIBE;
                container.attr("class", _this.STATUS.SUBSCRIBE.CLASS).html(text).show();
            } else {
                info.statusKey = _this.KEYMAP.UNSUBSCRIBE;
                text = _this.STATUS.UNSUBSCRIBE.TEXT;
                container.removeAttr("class").html(text).show();
            }

            _this.initEvents(); //因为click绑定在tbody上，无法off掉单个dom的click
        },
        closeDetail: function (calendarId) {
            //#region 关闭展示详情
            var linkId = $T.format("#label_item_{id} a[cmd='showdetail']", { id: calendarId });
            $(linkId).trigger("click");
            //#endregion
        },
        frequencyLimit: function (calendarId) {
            var _this = this;
            _this.clickedItems = _this.clickedItems || {};

            if (_this.clickedItems[calendarId]) { //已点击
                return false;
            }

            _this.clickedItems[calendarId] = true; //仅保存
            setTimeout(function () {
                delete _this.clickedItems[calendarId];
            }, 1000);//一秒一次
            return true;
        },
        getHtmlList: function (data) {
            var _this = this;
            var tr = _this.TEMPLATE.TR;
            var allStatus = _this.STATUS;
            var officialSpan = _this.TEMPLATE.OFFICIAL;
            var html = '';

            _this.model.clear();

            //拼接
            if (data.length > 0) {
                for (var i = 0, len = data.length; i < len; i++) {
                    var tmp = data[i];
                    tmp.isexpend = false; //未展开（初始化）
                    tmp.selectedcolor = tmp.color; //选中颜色

                    var key = _this.getStatus(tmp.isOwner, tmp.isSubscripted); //后端写错单词，说不改了
                    tmp.statusKey = key;

                    var status = allStatus[key];
                    tmp.operationFlag = tmp.operationFlag || -1; //容错
                    var isSysFlag = (tmp.operationFlag <= 0) ? "none" : _this.SysLabelFlag; //0:非运营日历
                    html += $T.format(tr, {
                        id: tmp.seqno,
                        color: tmp.color,
                        subject: $T.Html.encode(tmp.labelName),
                        author: $T.Html.encode(tmp.author),
                        isOfficial: (!!tmp.isOfficial) ? officialSpan : "",
                        style: status.CLASS,
                        status: key,
                        statusText: status.TEXT,
                        issys: isSysFlag,
                        content: $T.Html.encode(tmp.description)
                    });

                    _this.model.set(tmp.seqno, tmp); //保存数据
                }
            } else {
                html = $T.format(_this.TEMPLATE.DEFAULT, { text: _this.MESSAGES.EMPTY });
            }

            return html;
        },
        getStatus: function (isOwner, isSubscribed) {
            /*
             * isOwner: 1-自己的，2-别人的
             * isSubscribed: 1-已订阅，0-未订阅
             */
            var allStatus = this.STATUS;
            var keyMap = this.KEYMAP;
            /**
            * MANAGE=0: 管理日历
            * SUBSCRIBE=1: 订阅
            * UNSUBSCRIBE=2: 退订
            * SUCCESS=-1: 订阅成功*
            */
            return isOwner == '1' ? keyMap.MANAGE :
                (isSubscribed == '0' ? keyMap.SUBSCRIBE : keyMap.UNSUBSCRIBE);
        }
    }));
})(jQuery, _, M139, window._top || window.top);
