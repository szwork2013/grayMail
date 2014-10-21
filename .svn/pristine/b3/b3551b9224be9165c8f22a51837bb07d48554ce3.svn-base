
(function ($, _, M139, top) {

    var master = window.$Cal,
        EVENTS = master.EVENTS;
    var className = "M2012.Calendar.View.Message";

    M139.namespace(className, Backbone.View.extend({
        name: className,
        viewName: "message",
        templates: {
            MAIN: ['<div class="sd-content">',
                     '<div class="bgPadding">',
                        '<div class="createTop tabTitle">',
                            '<h2>日历消息<a id="goback" href="javascript:void(0);" class="back">&lt;&lt;返回</a></h2>',
                        '</div>',
                     '</div>',
                     '<div id="naviBar" class="bgMargin" style="">',
                         '<div class="tab setTab">',
                             '<div class="tabTitle">',
                                 '<ul id="tabs">',
                                     '<li id="lnkInvite" class="on">',
                                        '<a href="javascript:" hidefocus="1"><span>活动邀请</span></a>',
                                        '<em id="inviteUnreadNum" class="newboxNav_num hide"></em>',
                                     '</li>',
                                     '<li id="lnkShare" class="">',
                                        '<a href="javascript:" hidefocus="1"><span>日历共享</span></a>',
                                        '<em id="shareUnreadNum" class="newboxNav_num hide"></em>',
                                     '</li>',
                                 '</ul>',
                                 '<div id="pagerContainer"></div>',
                             '</div>',
                         '</div>',
                     '</div>',
                     '<div class="ad-list-div">',
                         '<div id="msgList" class="pl_10 pr_10 pt_10"></div>',
                     '</div>',
                     '<div class="mt_20"></div>',
                 '</div>'].join(""),
            NO_MSG: '<div class="noindexbody"><div class="empty_btn">暂无消息</div></div>'
        },
        msgTypes: {
            ALL: 0, //所有,用于获取未读数量
            INVITE: 1,
            SHARE: 2
        },
        messages: {
            LOADING: '正在加载中...',
            ERROR: '操作失败'
        },
        dataKeys: {
            "1": "inviteUnread",
            "2": "shareUnread"
        },
        status: {
            OK: "S_OK"
        },
        initialize: function (options) {
            var _this = this,
                TYPES = _this.msgTypes;

            _this.master = master;
            _this.model = new M2012.Calendar.Model.Message({ master: _this.master });

            _this.master.on(EVENTS.VIEW_CREATED, function (args) {
                if (args.name == _this.viewName) {
                    _this.render(args);
                    //触发显示,即VIEW_SHOW
                    if (typeof args.onshow === 'function') {
                        args.onshow();
                    }
                }
            }).on(EVENTS.VIEW_SHOW, function (args) {
                if (args && args.name == _this.viewName) {
                    if (!args.type) args.type = 1; //compatible

                    _this.model.set("currentType", null); //clear
                    _this.renderView(args);
                    _this.renderMsgCount(TYPES.ALL); //消息的未读数量
                    _this.hide = false; //显示状态,主要作用在下面else部分
                } else {
                    //在切换到其他页面时,就处理逻辑,切换回来时,就不会有一闪而过的旧数据
                    if (_this.hide === undefined || _this.hide) return;

                    if (!_this.hide) {
                        _this.clear();
                        _this.hide = true;
                    }
                }
            });
        },
        /**
         * 渲染日历消息的主视图
         */
        render: function (options) {
            var _this = this;

            _this.container = options.container;
            _this.container.html(_this.templates.MAIN);

            _this.goback = $("#goback", _this.container);
            _this.tabs = $("#tabs li", _this.container);
            _this.lnkInvite = $("#lnkInvite", _this.container);
            _this.lnkShare = $("#lnkShare", _this.container);
            _this.inviteUnread = $("#inviteUnreadNum", _this.container);
            _this.shareUnread = $("#shareUnreadNum", _this.container);
            _this.pager = $("#pagerContainer", _this.container);
            _this.content = $(".ad-list-div", _this.container);
            _this.msgList = $("#msgList", _this.container);

            _this.initEvents();
        },
        initEvents: function (options) {
            var _this = this,
                model = _this.model,
                TYPES = _this.msgTypes;

            //返回
            _this.goback.on('click', function () {
                _this.master.trigger(EVENTS.NAVIGATE, { path: "mainview" });
            });

            //点击邀请消息
            _this.lnkInvite.on("click", function () {
                var currentType = _this.model.get("currentType");
                if (currentType == TYPES.INVITE) return; //就是当前类型,暂时不刷新了

                _this.renderView({ type: TYPES.INVITE });
            });

            //点击共享消息
            _this.lnkShare.on('click', function () {
                var currentType = _this.model.get("currentType");
                if (currentType == TYPES.SHARE) return;

                _this.renderView({ type: TYPES.SHARE });
            });

            //未读的消息数量显示
            _this.model.on("change:inviteUnread", function () {
                var count = model.get("inviteUnread");
                if (count <= 0) {
                    _this.inviteUnread.html('').addClass("hide");
                } else {
                    count = count > 99 ? "99+" : count;
                    _this.inviteUnread.html(count);
                    _this.inviteUnread.removeClass("hide");
                }

                master.set({ msg_changed_flag: true }); //标记未读数量变更,返回后自动刷新
            }).on("change:shareUnread", function () {
                var count = model.get("shareUnread");
                if (count <= 0) {
                    _this.shareUnread.html('').addClass("hide");
                } else {
                    count = count > 99 ? "99+" : count;
                    _this.shareUnread.html(count);
                    _this.shareUnread.removeClass("hide");
                }

                master.set({ msg_changed_flag: true });
            }).on("change:currentType", function () {
                var type = model.get("currentType");

                _this.tabs.removeClass("on");
                if (type == TYPES.SHARE) {
                    _this.lnkShare.addClass("on"); //如果是共享
                } else {
                    _this.lnkInvite.addClass("on"); //否则默认邀请
                }
            }).on("change:msgCount", function () {
                var type = model.get("currentType");
                _this.renderMsgCount(TYPES.ALL); //未读数量变更
            }).on("event:refresh", function (data) {
                //删除消息时,重新渲染列表(主要是翻页逻辑)
                var type = model.get("currentType"),
                    pageIndex = model.get("pageIndex"),
                    pageSize = model.get("pageSize");
                _this.renderView({
                    type: type,
                    pageIndex: pageIndex,
                    pageSize: pageSize
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
            this.msgList.html(""); //清空旧的数据
            this.renderMsgList(options);
        },
        renderMsgCount: function (type) {
            var _this = this;
            //异步加载未读数量
            _this.model.getMessageCount(type, function (data) {
                var code = data && data.code,
                    obj = data && data["var"];

                if (code != _this.status.OK) return;

                _this.model.set({
                    inviteUnread: obj["inviteCount"] || 0,
                    shareUnread: obj["shareCount"] || 0
                });
            }, function (data) {
                _this.model.set(dataType, 0); //获取未读数错误,不影响功能,置零
            });
        },
        renderPager: function (pageIndex, pageSize, itemCount) {
            var _this = this,
                currentType = _this.model.get("currentType");
            var pages = Math.ceil(itemCount / pageSize);//总页数

            _this.pager.html(""); //清空

            //总条数＜每页最大数量 ,不需要分页
            if (pageSize >= itemCount) {
                return;
            }

            //需要分页
            var pager = M2012.UI.PageTurning.create({
                pageIndex: pageIndex,
                pageCount: pages,
                styleTemplate: 2,
                container: _this.pager
            });

            pager.on("pagechange", function (pageIndex) {
                _this.model.set({ pageIndex: pageIndex, pageSize: pageSize }); //记录页数,删除消息后可以渲染对应数据
                _this.renderView({ type: currentType, pageIndex: pageIndex });
            });
        },
        renderMsgList: function (options) {
            options = options || {};
            var _this = this,
                STATUS = _this.status,
                TYPES = _this.msgTypes,
                MESSAGES = _this.messages,
                currentType = _this.model.get("currentType"),
                type = options.type == TYPES.SHARE ? TYPES.SHARE : TYPES.INVITE; //非共享,统一显示邀请

            var params = {
                type: type,
                pageIndex: options.pageIndex || 1,
                pageSize: options.pageSize || 10
            };

            top.M139.UI.TipMessage.show(MESSAGES.LOADING);

            //加载消息列表
            _this.model.getMessageList(params, function (data) {
                var code = data && data.code,
                    obj = (data && data["var"]) || {},
                    items, count, unread, lastPage,
                    i, len, item;

                top.M139.UI.TipMessage.hide();

                //this.msgList.html(""); //接口返回再次清理.测试线接口太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太慢了........
                if (code == STATUS.OK) {
                    items = obj.table || [];
                    count = obj.count || 0;
                    unread = obj.unreadCount || 0;

                    if (items && items.length > 0) {
                        //显示消息列表.对应功能由MessageItem内部处理
                        for (i = 0, len = items.length; i < len; i++) {
                            item = items[i];
                            item.model = _this.model; //把model传递进去,有一些交互
                            item.container = _this.msgList;
                            new M2012.Calendar.View.MessageItem(item);
                        }
                    } else {
                        if (params.pageIndex > 1) {
                            //分页中某页数据删除完了,就判断跳转
                            lastPage = Math.ceil(count / params.pageSize);
                            _this.renderView({
                                type: params.type,
                                pageIndex: lastPage, //最后一页
                                pageSize: params.pageSize,
                                force: true
                            });
                        } else {
                            _this.msgList.html(_this.templates.NO_MSG);
                        }
                    }

                    _this.model.set("currentType", type); //记录当前打开的标签
                    _this.model.set(_this.dataKeys[type], unread); //刷新未读数

                    //渲染分页
                    if (currentType != type || options.force) {
                        _this.renderPager(params.pageIndex, params.pageSize, count);
                    }
                } else {
                    _this.errorTip();
                }
            }, function (data) {
                _this.errorTip();
            });
        },
        clear: function () {
            var _this = this;

            _this.model.set({ inviteUnread: 0, shareUnread: 0, currentType: _this.msgTypes.INVITE }); //消息数,标签页
            _this.pager.html(""); //分页
            _this.msgList.html(""); //消息列表
        },
        errorTip: function (msg) {
            top.M139.UI.TipMessage.show(this.messages.ERROR);
        }
    }));

    //initialize
    new M2012.Calendar.View.Message({ master: master });

})(jQuery, _, M139, window._top || window.top);