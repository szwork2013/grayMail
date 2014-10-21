
(function ($, _, M139, top) {

    var _super = Backbone.View;
    var CHG_HEIGHT = "leftmenu#change:height";

    //左侧导航栏 - 各日历菜单
    var _class = "M2012.Calendar.View.LeftMenu";
    var Validate = M2012.Calendar.View.ValidateTip;
    var constant = M2012.Calendar.Constant,
        maxLabelsSum = constant.Common_Config.Max_Labels_Sum,
        rightIcon = constant.LeftMenu_Config.ICON_RIGHT,
        downIcon = constant.LeftMenu_Config.ICON_DOWN;

    M139.namespace(_class, _super.extend({

        name: _class,

        el: "#pnlLeftMenu",
        custom_visible: 1, // 页面初始加载完成时, 我的日历列表展开
        logger: new M139.Logger({ name: _class }),
        labelTypes: {
            SYSTEM: 'sys',
            USER: 'user',
            SHARE: 'share',
            GROUP: 'group'
        },

        initialize: function (options) {
            var _this = this;
            _super.prototype.initialize.apply(_this, arguments);

            _this.master = options.master;
            _this.pnlMenu = $(_this.el);
            _this.btnCreate = $("#btnCreate");
            _this.btnGroupCreate = $("#btnGroupCreate");
            _this.bottomDiscovery = $("#bottom_discovery");
            _this.btnExtend = _this.pnlMenu.find("#btnExtend");

            _this.template = _.template($("#tplLeftMenu").html());

            _this.render();
            _this.initEvents();

            return _this;
        },

        initEvents: function () {
            var _this = this;

            var master = _this.master;
            var common = master.capi;
            var EVENTS = master.EVENTS;
            var labelTypes = _this.labelTypes;
            var SCROLL = "menuScroll";
            var interval;

            var pnlLeftBar = $("#pnlLeftBar"),
                bigMenu = pnlLeftBar.children(":last"), // 除开包含"创建按钮"区域以外的区域
                pnlLeftMenu = $("#pnlLeftMenu"),// 左侧栏分割线以下的区域
                bottomHeightPixel = 5, // 最下面黄色区域的高度,暂时定为5像素
                bottom_discovery = $("#bottom_discovery"); // 出现滚动条之后要显示的发现广场元素

            function showscroll() {
                var normal_discovery = $("#normal_discovery"); // 正常情况下(未出现滚动条)显示的发现广场元素
                var isShowBigScroll = false, // 是否显示外层滚动条
                    bigScrollTop = bigMenu.scrollTop() || 0, // 表示如果最外层DIV中有滚动条,滚动条滚动的距离
                    bodyHeight = $("body").height(),
                    pnlLeftMenuTop = pnlLeftMenu.offset().top, // pnlLeftMenu距离顶部document的距离,保存起来(因为在360浏览器下会出现兼容性问题)
                    menuLabelsHeight = _this.menulabels ? _this.menulabels.height() : 24; // IE6中会出现_this.menulabels为undefined的情况
                pnlLeftBar.height(bodyHeight); // 先设置左侧导航栏的高度
                bottom_discovery.hide(); // 默认先隐藏固定在底部的发现广场DOM
                normal_discovery.show(); // 默认显示正常位置的发现广场DOM

                if (bigScrollTop + pnlLeftMenuTop + menuLabelsHeight + bottomHeightPixel >= bodyHeight) {
                    // 显示最外层的滚动条
                    isShowBigScroll = true;
                }

                if (!isShowBigScroll) {
                    // 只显示内部滚动条
                    pnlLeftMenu[0].style.position = 'relative';
                    pnlLeftMenu[0].style.overflowY = 'auto';
                    pnlLeftMenu[0].style.overflowX = ''; //隐藏横向滚动条
                    bigMenu[0].style.overflowY = '';
                    bigMenu[0].style.position = '';
                    bigMenu[0].style.height = '';
                    // 不断resize窗口,pnlLeftMenu.offset().top这个值在"360浏览器"下会出现变化,
                    // 出现变化原因: 上述if中的某行代码引发
                    // 解决方法: 暂时将这个值先保存到变量(pnlLeftMenuTop)中,防止值变化出现的兼容性问题
                    var leftMenuHeight = bodyHeight - pnlLeftMenuTop - bottomHeightPixel;
                    pnlLeftMenu.height(leftMenuHeight);//滚动条容器高度

                    if (pnlLeftMenu[0].scrollHeight > pnlLeftMenu.height()) {
                        // 出现滚动条, 则将发现广场固定在左侧栏底部, 并改变pnlLeftMenu的高度
                        pnlLeftMenu.height(leftMenuHeight - bottom_discovery.height());
                        bottom_discovery.show();
                        normal_discovery.hide();
                    }
                } else {
                    // 显示外部滚动条
                    pnlLeftMenu[0].style.position = 'relative';
                    pnlLeftMenu[0].style.overflowY = '';
                    pnlLeftMenu[0].style.height = '';
                    bigMenu[0].style.overflowY = 'auto';
                    bigMenu[0].style.position = 'relative';

                }

                /**调整外层DIV的高度*/
                var top = bigMenu.offset().top; // bigMenu距离document的高度
                if ($B.is.ie && $B.getVersion() <= 8) {
                    // IE,360浏览器
                    bigMenu.height(bodyHeight - top - bottomHeightPixel - 2); // ie8及以下浏览器多减2
                } else {
                    bigMenu.height(bodyHeight - top - bottomHeightPixel);
                }
            }

            // 函数节流,防止频发触发
            $(window).resize(function () {
                // 这里设置成间隔50ms之后在触发
                clearTimeout(interval);
                interval = setTimeout(showscroll, 50);
            });

            master.on(CHG_HEIGHT, function () {
                showscroll();
                // 保存"日历"展开状态,在日历广场中"订阅"或"退订"日历时,不需要对左侧栏中日历的状态进行改变
                _this.master.set(constant.LeftMenu_Config.IS_OPEN_STATUS, _this.lstCustom.is(":visible"));
            });

            master.on("change:view_location", function () {
                var view = master.get("view_location").view;
                // 修复IE6中左侧栏占用了月视图位置的问题,以及滚动鼠标,左侧栏消失
                if (M139.Browser.getVersion() <= 6) {
                    pnlLeftBar.hasClass(constant.LeftMenu_Config.INASIDE_BUG) && pnlLeftBar.removeClass(constant.LeftMenu_Config.INASIDE_BUG);
                    if (view == 'month' || view == 'day') {
                        !pnlLeftBar.hasClass(constant.LeftMenu_Config.INASIDE_BUG) && pnlLeftBar.addClass(constant.LeftMenu_Config.INASIDE_BUG);
                    }
                }
                //展示时间轴视图时隐藏顶部操作栏的时间前后切换区域
                if (view == "timeline") {
                    $("#dvdayChoose").addClass("hide");
                } else {
                    $("#dvdayChoose").removeClass("hide");
                }
            });

            master.on("changeNavColor", function (param) {
                var cmdEl = $(_this.el).find('[data-cmd = "' + param.cmd + '"]'),
                    menuItems = $("#pnlLeftMenu a.js_menu_labels");

                if (cmdEl.length) {
                    menuItems && menuItems.removeClass("on");
                    cmdEl.addClass("on");
                }
            });

            _this.btnCreate.click(function () {
                // 记录行为日志
                master.capi.addBehavior("calendar_createactBtn_click");
                master.trigger('master:navigate', { path: "mod/detail-0-0" });
            });
            //添加群活动
            _this.btnGroupCreate.click(function (e) {
                master.capi.addBehavior("calendar_createactBtn_click");
                var groupLabels = master.getGroupLabels(true);
                //判断是否有群日历
                if (groupLabels && groupLabels.length > 0) {
                    master.trigger('master:navigate', { path: "mod/groupactivity" });
                    return;
                }
                master.trigger('master:navigate', { path: "mod/grouplabel" });
            });

            _this.pnlMenu.click(function (e) {
                var source = common.parent(e.target, function (el) { return !_.isEmpty($(el).data('cmd')) });
                if (source === null) return;

                source = $(source);
                var cmd = source.data("cmd");
                if (_.isEmpty(cmd)) {
                    return;
                }

                var menuitems = $("#pnlLeftMenu a.js_menu_labels");
                var seqNo = Number(source.closest("a").data("seqno")) || Number(source.data("seqno"));
                var type = source.closest("a").data("type") || source.data("type");
                _this.logger.debug('左导航菜单点选：cmd=%s', cmd, e.clientX);

                switch (cmd) {
                    case "filterdefault":
                        // 全选操作
                        master.capi.addBehavior("calendar_calendardroplist_click");

                        var li = $(source).closest("li"), // 最近的父亲节点
                            allLabels = li.find("ul [data-cmd='filterlabel']"),
                            labelsNoArr = [],
                            icon = li.find("a[data-cmd='expand']");

                        master.trigger("clearAll", function () {
                            $(allLabels).each(function () {
                                // 所有的日历处于勾选状态(全选)
                                $(this).removeClass("ok").addClass("ok");
                                // 保存所有处于勾选状态的日历seqNo
                                labelsNoArr.push($(this).closest("a").data("seqno"));
                            });
                            source.addClass("on");
                        });

                        // 替换判断_this.custom_visible
                        if (e.clientX < 27 || icon.hasClass(rightIcon)) {
                            _this.toggleMenu(icon, li.find("ul"));
                            _this.logger.debug('菜单左端，折叠我的日历');
                        }

                        // 触发事件, 调用后台接口根据不同的seqNo重新渲染界面
                        if (type === 'subscribe') {
                            master.set({
                                checklabels: labelsNoArr,
                                view_filter_flag: 'subscribe',
                                grouplabels: _.clone([]),
                                subscribedlabels: _.clone(labelsNoArr),
                                mychecklabels: _.clone([]) // 清空存放日历下ID的数组
                            });
                        } else if (type === 'group') {
                            master.capi.addBehavior("cal_leftmenu_group_click");
                            master.set({
                                checklabels: labelsNoArr,
                                view_filter_flag: 'group',
                                grouplabels: _.clone(labelsNoArr),
                                subscribedlabels: _.clone([]),
                                mychecklabels: _.clone([]) // 清空存放日历下ID的数组
                            });
                        } else {
                            master.set({
                                checklabels: labelsNoArr,
                                view_filter_flag: 'mylabel',
                                grouplabels: _.clone([]),
                                mychecklabels: _.clone(labelsNoArr),
                                subscribedlabels: _.clone([])  // 清空存放订阅日历ID的数组
                            });
                        }

                        if (!master.get("view_location").isMainView) {
                            // 统一下, 当前视图是主视图时, 不需要刷新
                            master.trigger(master.EVENTS.NAVIGATE, { path: "mainview/refresh" });
                        }
                        break;
                    case "expand":
                        master.capi.addBehavior("calendar_calendardroplist_click");
                        _this.logger.debug('收缩/展开');
                        _this.toggleMenu(source, source.closest("li").find("ul"));
                        e.stopPropagation();
                        break;

                    case "loaddiscovery":
                        master.trigger(EVENTS.SHOW_DISCOVERY);
                        break;

                    case "filterbirth":
                        master.capi.addBehavior("calendar_leftbarbirthday_click");
                        _this.logger.debug('生日提醒');
                        menuitems.removeClass("on");
                        source.addClass("on");
                        master.set({ view_filter_flag: 'birth' });
                        if (!master.isMainView()) {
                            master.trigger(master.EVENTS.NAVIGATE, {
                                path: "mainview/refresh"
                            });
                        }
                        break;

                    case "filterlabel": // 点击小颜色块时
                        _this.logger.debug('筛选%s标签日历, %s', seqNo, type);
                        var _args = { label: seqNo };

                        //我的日历、共享日历是多选
                        _args.group = true;

                        _args.success = function () {
                            if (!source.is("i")) {
                                // 色块必须是I标签
                                return;
                            }

                            master.trigger("clearAll", function () {
                                var checkedlabels = master.get("checklabels");

                                // 根据保存的日历ID(订阅的或我的日历下的)回填勾选样式
                                for (var i = 0; i < checkedlabels.length; i++) {
                                    source.closest("ul").find("a[data-seqno = '" + checkedlabels[i] + "']").find("i").addClass("ok");
                                }
                                // 将当前栏目选中样式
                                source.closest("ul").closest("li").find(".js_menu_labels").addClass("on");
                            });
                        };

                        master.trigger('master:togglelabel', _args);
                        if (!master.isMainView()) {
                            master.trigger(master.EVENTS.NAVIGATE, {
                                path: "mainview/refresh"
                            });
                        }
                        break;
                    case "choicelabel": // 点击色块右侧区域时
                        master.trigger("clearAll", function () {
                            source.closest("ul").closest("li").find(".js_menu_labels").addClass("on");
                            source.closest('li').find('i[data-cmd="filterlabel"]').removeClass("ok").addClass("ok"); // 选中当前色块
                        });

                        if (type === 'subscribe') { // 针对"订阅日历"栏目下面的日历
                            master.set({
                                checklabels: [seqNo],
                                view_filter_flag: 'subscribe',
                                subscribedlabels: _.clone([seqNo])
                            });
                        }
                        else if (type === 'group') {
                            master.set({
                                checklabels: [seqNo],
                                view_filter_flag: 'group',
                                grouplabels: _.clone([seqNo])
                            });
                        }
                        else {
                            // 针对"日历"栏目下面的日历
                            master.set({
                                checklabels: [seqNo],
                                view_filter_flag: 'mylabel',
                                mychecklabels: _.clone([seqNo])
                            });
                        }

                        if (!master.isMainView()) {
                            master.trigger(master.EVENTS.NAVIGATE, {
                                path: "mainview/refresh"
                            });
                        }
                        break;
                    case "addcalendar":
                        _this.logger.debug('打开新建日历对话框');
                        master.capi.addBehavior("calendar_leftbaraddlabel_click");

                        var data = _this.master.get("labelData");
                        if (data && data.userLabels.length >= maxLabelsSum) {
                            Validate.show("最多创建" + maxLabelsSum + "个自定义日历", _this.createLabelsBtn);
                            setTimeout(function () {
                                Validate.hide();
                            }, 2000);
                            return;
                        }
                        // 异步加载
                        if (_.isUndefined(M2012.Calendar.View.CalendarAddPopup)) {
                            master.loadJsResAsync({
                                id: "labelpop",
                                url: "/calendar/cal_index_addLabel_async.html.pack.js",
                                useContact: true,
                                onload: function () {
                                    new M2012.Calendar.View.CalendarAddPopup({});
                                }
                            });

                        } else {
                            new M2012.Calendar.View.CalendarAddPopup({});
                        }

                        break;

                    case "labelmgr": //打开日历管理页
                        master.trigger(EVENTS.NAVIGATE, { path: "mod/labelmgr" });
                        e.stopPropagation(); //停止冒泡,否则就进入到日历广场了
                        break;
                    case "addgrouplabel":
                        menuitems.removeClass("on");
                        source.addClass("on");
                        master.set({ view_filter_flag: 'group' });
                        master.trigger(EVENTS.NAVIGATE, { path: "mod/grouplabel" });
                        e.stopPropagation();
                        break;
                    case "editlabel": //日历右侧的小编辑按钮
                        master.capi.addBehavior("cal_leftmenu_edit_label");
                        switch (type) {
                            case labelTypes.USER:
                                master.trigger(EVENTS.EDIT_LABEL, { labelId: seqNo });
                                break;
                            case labelTypes.GROUP:
                                var isOwner = Number(source.data('isowner') || '');
                                if (!!isOwner) {
                                    //如果是自己创建的群日历,则跳转到编辑
                                    master.trigger(EVENTS.EDIT_LABEL, { labelId: seqNo, isGroup: true });
                                    break;
                                }

                                //非自己创建的,暂时跳转到编辑日历页面
                                //master.trigger(EVENTS.EDIT_LABEL, { labelId: seqNo, isGroup: true });
                                //break;
                            case labelTypes.SHARE:
                                master.trigger(EVENTS.EDIT_LABEL, { labelId: seqNo, isShared: true });
                            case labelTypes.SYSTEM:
                            default:
                                break;
                        }
                        e.stopPropagation(); //阻止冒泡,否则就会变成点击日历分类了
                        break;
                }
                return false;
            });

            // 当发现广场固定在左侧栏底部时, 需绑定事件
            _this.bottomDiscovery.unbind("click").bind("click", function () {
                master.trigger(EVENTS.SHOW_DISCOVERY);
            });

            //视图中发生日历标签切换时，监听的函数
            master.bind(EVENTS.TOGGLELABEL, function (args) {
                args = args || {};
                $.extend(args, {
                    isSaveMenuStatus: true,
                    isOpenStatus: true
                })
                _this.togglelabel(args);
            });

            //发生标签添加的刷新左栏
            master.bind(EVENTS.LABEL_ADDED, function (args) {
                _this.label.add(args, _this);
            });

            //发生标签变更的刷新左栏
            master.bind(EVENTS.LABEL_CHANGE, function (args) {
                _this.label.mod(args, _this);
            });

            //发生标签删除的刷新左栏
            master.bind(EVENTS.LABEL_REMOVE, function (args) {
                _this.label.del(args, _this);
            });

            //进入发现广场
            master.bind(EVENTS.SHOW_DISCOVERY, function (args) {
                master.capi.addBehavior("calendar_leftbardiscovery_click");
                _this.logger.debug('载入日历广场');
                if (master.get("view_location").view === 'discovery') {
                    return; // 如果已经加载了日历广场界面, 直接返回, 不需要重复加载
                }

                $("#pnlLeftMenu a.js_menu_labels").removeClass("on");
                // 点击日历广场前, 先保存当前的视图,filterdefault中要用到
                //master.set('isMainViewBefore', !!master.get("view_location").isMainView);
                master.trigger(EVENTS.NAVIGATE, { path: "mod/discovery-0-0" });
            });

            // 去除所有颜色块的勾选按钮
            master.on("clearAll", function (fn) {
                var pnlLeftMenu = $("#pnlLeftMenu");
                pnlLeftMenu.find("i[data-cmd='filterlabel']").removeClass("ok");
                pnlLeftMenu.find("a.js_menu_labels").removeClass("on");

                _.isFunction(fn) && fn();
            });
        },

        /**
         * 勾/取消左栏标签
         * @param args
         * @returns {void}
         */
        togglelabel: function (args) {
            var _this = this;
            var master = _this.master;
            var seqNo = args.label;

            var labelInfo = master.getLabelBySeqNo(seqNo);
            if (!labelInfo) {
                _this.logger.info('seqNo notfound');
                return
            }

            //获取我的日历的勾选状态，再操作后，同步到checklabels
            var bak = master.get("mychecklabels");
            var checklabels = _.clone(bak);
            if (labelInfo.isSubscribe) {
                checklabels = _.clone(master.get("subscribedlabels") || []); // 已经选中的订阅日历ID
            } else if (labelInfo.isGroup) {
                checklabels = _.clone(master.get("grouplabels") || []); // 已经选中的群日历ID

            }

            var idx = _.indexOf(checklabels, seqNo);
            if (idx > -1) {
                //查到，就是走去勾的操作
                checklabels.splice(idx, 1);
            } else {
                //否则就是勾上某个日历
                checklabels.push(seqNo);
            }

            // mychecklabels: 因为选择订阅标签也是设置checklabels，则需要这个变量存放，我的日历的勾选状态
            if (labelInfo.isSubscribe) {
                master.set({
                    checklabels: checklabels,
                    view_filter_flag: 'subscribe',
                    mychecklabels: _.clone([]), // 将保存我的日历下面的日历ID集合清空
                    subscribedlabels: _.clone(checklabels),
                    grouplabels: _.clone([])
                });
            }
                //群日历
            else if (labelInfo.isGroup) {
                master.set({
                    checklabels: checklabels,
                    view_filter_flag: 'group',
                    mychecklabels: _.clone([]), // 将保存我的日历下面的日历ID集合清空
                    subscribedlabels: _.clone([]),
                    grouplabels: _.clone(checklabels) // 将保存我的日历下面的日历ID集合清空
                });
            } else {
                master.set({
                    checklabels: checklabels,
                    view_filter_flag: 'mylabel',
                    mychecklabels: _.clone(checklabels), // 将保存订阅日历下面的日历ID集合清空
                    subscribedlabels: _.clone([]),
                    grouplabels: _.clone([])
                });
            }

            _this.logger.debug("活动视图按标签筛选 %s", checklabels.join(','));
            if (args.success) { args.success(); }
        },

        //标签的CURD响应
        label: {
            add: function (args, _this) {
                //                添加日历时 args =>
                //                color: "#58a8b4"
                //                isShare: 1
                //                labelName: "12"
                //                labelShareInfo: Array[0]
                //                seqNo: "4770"

                _this.render(args);
            },
            mod: function (args, _this) {
                _this.render(args);
            },
            del: function (args, _this) {
                _this.render(args);
            }
        },

        /**
         * 导航菜单切换，包括: "我的日历" 和 "订阅日历"
         * @param ico 图标对象
         * @param lst 图标关联的列表对象
         */
        toggleMenu: function (ico, lst) {
            var _this = this;

            // 切换"向右"或"向左"的小箭头
            ico.hasClass(downIcon) ? ico.removeClass(downIcon).addClass(rightIcon) : ico.removeClass(rightIcon).addClass(downIcon);
            // "展开"或"伸缩"列表
            // 使用toggle,解决360浏览器下展开/收缩日历时出现"重影"的问题
            lst.toggle();

            setTimeout(function () {
                // 调用showScroll方法, 改变左侧栏的高度
                _this.master.trigger(CHG_HEIGHT);
            }, 0xff);
        },

        //导航菜单全部收起
        closeMenu: function () {
            var _this = this;
            var isVisible = _this.custom_visible;

            var icoCustom = _this.icoCustom;
            var lstCustom = _this.lstCustom;

            //群组显示中，切换菜单则是收起群组菜单，展开发现广场
            if (isVisible === 1) {
                icoCustom.removeClass(downIcon).addClass(rightIcon);
                lstCustom.slideUp();
            }

            _this.custom_visible = 0;

            setTimeout(function () {
                _this.master.trigger(CHG_HEIGHT);
            }, 0xff);
        },

        //导航菜单打开指定那个
        openMenu: function (type, callback) {
            var _this = this;
            var isVisible = _this.custom_visible;
            if (isVisible !== 0) {
                return;
            }

            _this.custom_visible = type == 'custom' ? -1 : 1;
            _this.toggleMenu(_this.icoCustom, _this.lstCustom);
            callback();
        },

        /**
         *  当菜单呈现完成后
         *   @param {Object} args.onrender  左侧菜单加载完成后的回调函数
         */
        onrender: function (args) {
            var _this = this;
            _this.icoCustom = _this.pnlMenu.find("#lable_switch_custom");
            _this.lstCustom = _this.pnlMenu.find("#lable_list_custom");
            _this.icoDiscovery = _this.pnlMenu.find("#lable_switch_share");
            _this.lstDiscovery = _this.pnlMenu.find("#lable_list_share");
            _this.createLabelsBtn = _this.pnlMenu.find("[data-cmd='addcalendar']"); // 快捷创建日历的"+"号
            _this.menulabels = _this.pnlMenu.find("#menu_labels");
            _this.btnEdit = _this.pnlMenu.find('i[name="edit"]');

            // 如果参数中配置有"saveStatus"为true,说明需要保持菜单的原始状态,会自动调用fixMenuStatus方法
            // 注意在_this.master.trigger(CHG_HEIGHT)之前调用,不然master中保存的状态会被覆盖掉
            args && args[constant.LeftMenu_Config.IS_SAVE_CALENDARMENU_STATUS] && _this.fixMenuStatus(_this.master.get(constant.LeftMenu_Config.IS_OPEN_STATUS));

            _this.master.trigger(CHG_HEIGHT);
            if (args && args.onrender) {
                args.onrender();
            }
        },

        /**
         * 是否需要维持持左侧栏日历菜单的展开/伸缩状态
         * 暂时在公共日历中点击"订阅"或"退订"按钮有这种需求,之前操作后,左侧日历菜单固定在展开状态
         * @param isOpenStatus master中保存的菜单状态:true为展开,false为伸缩
         * @returns {*}
         */
        fixMenuStatus: function (isOpenStatus) {
            var _this = this;
            if (!isOpenStatus) { // 只需要考虑master的菜单状态为"伸缩"的时候,因为render方法中菜单默认就是展开的
                _this.icoCustom.removeClass(downIcon).addClass(rightIcon);
                _this.lstCustom.hide();
            }
        },

        render: function (args) {
            var _this = this;
            var master = _this.master;
            var EVENTS = master.EVENTS;

            master.trigger(EVENTS.REQUIRE_API, {
                success: function (api) {
                    api.getLabels({
                        data: { comeFrom: 0, actionType: 0 },
                        success: function (result) {
                            if (result.code == "S_OK") {
                                var viewData = result['var'];
                                _this.master.set({ labelData: viewData });
                                _this.pnlMenu.html(_this.template(viewData));
                                //是群日历的话要选择群日历标签
                                if (master.get("view_filter_flag") === "group") {
                                    master.trigger("clearAll", function () {
                                        var groupEl = $("#lable_list_group");
                                        groupEl.parent().find("a[data-cmd='filterdefault']").addClass("on");
                                        groupEl.find("i[data-cmd='filterlabel']").each(function () {
                                            // 所有的日历处于勾选状态(全选)
                                            $(this).removeClass("ok").addClass("ok");                                          
                                        });                                    
                                    });                                
                                }
                                _this.onrender(args);
                            } else if (result.code == "FS_SESSION_ERROR") {
                                //会话过期
                                top.$App.trigger("change:sessionOut", {}, true);
                            } else {
                            }
                        },
                        error: function () { }
                    });
                }
            });

            return _this;
        }
    }));

    $(function () {
        new M2012.Calendar.View.LeftMenu({
            master: window.$Cal
        });
    });

})(jQuery, _, M139, window._top || window.top);
