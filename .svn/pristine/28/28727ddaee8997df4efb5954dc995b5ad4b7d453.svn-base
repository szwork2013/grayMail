
(function ($, _, M139, top) {

    var master = window.$Cal,
        EVENTS = master.EVENTS;
    var className = "M2012.Calendar.View.EditGroupActivity";

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
                         '<p class="createChoose_mt">',
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
                         '</p>',
                     '</div>',
                 '</div>'].join("")
        },
        configs: {
            maxView: 10, //产品暂定最多可以创建10个
            types: {
                CREATE: 0,
                EDIT: 1
            },
            messages: {
                LOADING: '正在加载中...',
                ERROR: '操作失败',

                MAX_VIEW_TIP: '最多同时添加10个活动',

                CREATE_TITLE: '创建活动',
                EDIT_TITLE: '编辑活动'
            },
            status: {
                OK: "S_OK"
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

            _this.model = new M2012.Calendar.Model.EditGroupActivity();

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
            _this.content.css('overflow-y', 'auto');

            _this.initEvents();
        },
        initEvents: function (options) {
            var _this = this;
            var model = _this.model;
            var status = _this.configs.status;
            var views = model.get('views');

            _this.goback.on('click', function () {
                _this.master.trigger(EVENTS.NAVIGATE, { path: "mainview" });
            });

            $(document.body).click(function () {
                //醉了.也没办法了...
                _this.maxtip.hide();
            });

            _this.addbutton.on('click', function () {
                var view = new M2012.Calendar.View.GroupActivityItem({
                    container: _this.listView
                });

                model.addView(view); //添加到model中,并监听close事件
            });

            _this.submitEl.on('click', function (e) {
                var editMode = model.get('editMode');
                var func = editMode ? 'updateCalendar' : 'addGroupLabel'; //调用更新或者批量添加接口,数据都在model中组装

                model[func](function (responseData) {
                    responseData = responseData || {};
                    var code = responseData.code;
                    if (code == status.OK) {
                        _this.hideTip();
                        _this.master.trigger(EVENTS.NAVIGATE, { path: "mainview/refresh" });
                    } else {
                        //TODO 异常处理
                    }
                });
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

            model.on('api:error', function () {
                _this.errorTip();
            });

            model.on('error:validate', function (obj) {
                var el = obj.el;

                var scrollTop = _this.content.scrollTop() - 50; //去掉顶部和日历下拉的高度
                _this.content.animate({ "scrollTop": scrollTop + el.offset().top }, 100); //滚起!!!
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

            var data = master.get('edit_group_data') || {}; //编辑状态会传入参数
            master.set('edit_group_data'); //使用完成清空,解决下次进来时,只是单纯的创建

            //日历下拉菜单
            var menuContainer = $("#labelMenu", _this.container);
            menuContainer.html('');
            var groupLabels = _.clone(_this.master.getGroupLabels(true));

            _this.label = new M2012.Calendar.View.LabelMenu({
                target: menuContainer,
                labels: groupLabels,
                width: "600px",
                onChange: function (args) {
                    _this.model.set('labelId', args.labelId);
                }
            });

            _this.listView.html(''); //清空之前的显示
            _this.model.set({
                "views": [],
                "maxView": _this.configs.maxView,
                "editMode": false
            }); //清理所有view

            //是否编辑模式
            if (data.seqNo) {
                _this.deleteEl.removeClass('hide');

                _this.model.set({
                    "editMode": true,
                    "seqNo": data.seqNo
                });
            } else {
                _this.deleteEl.addClass('hide');

                var args = {
                    container: _this.listView,
                    hideClose: true //第一个不允许删除
                };

                //编辑的字段
                if (data.title) args['title'] = data.title;
                if (data.dtStart) args['dtStart'] = data.dtStart;
                if (data.dtEnd) args['dtEnd'] = data.dtEnd;
                if (typeof data.enable == 'boolean') args['enable'] = data.enable;

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
    new M2012.Calendar.View.EditGroupActivity({ master: master });

})(jQuery, _, M139, window._top || window.top);