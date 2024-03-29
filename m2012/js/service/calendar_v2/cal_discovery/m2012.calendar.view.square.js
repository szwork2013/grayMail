
(function ($, _, M139, top) {
    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.Square";
    var constant = M2012.Calendar.Constant;

    function topmsg() {
        top.M139.UI.TipMessage.show.apply(top.M139.UI.TipMessage, arguments);
    }
    function hidemsg() {
        top.M139.UI.TipMessage.hide.apply(top.M139.UI.TipMessage, arguments);
    }

    M139.namespace(_class, superClass.extend({
        template: {
            main: [
                '<div class="bgPadding">',
                    '<div class="createTop tabTitle">',
                        '<h2>发现广场<a class="back" href="javascript:;" id="toMonth">&lt;&lt;返回</a></h2>',
                        //'<a href="#" class="createTop_btn">日历管理</a>',
                    '</div>',
                '</div>',
                '<div id="squareBox" style="overflow-y: auto; position: relative;">',
                    '<div class="squareMain" >',
                        '<div class="" id="index_b_hero">',
                            '<div style="">',
                                '<div class="nav" id="nav">',
                                    '<ul id="navUl"></ul>',
                                    '<a href="javascript:;" id="prev" class="icon prev"></a>',
                                    '<a href="javascript:;" id="next" class="icon next"></a>',
                                '</div>',
                            '</div>',
                        '</div>',

                        '<div class="scheduleRssListColumn">',
                            '<ul class="moveRecommend clearfix" id="recommand"></ul>',
                            '<div class="matchShow clearfix" id="matchShow">',
                                '<div class="matchBox" id="lifeBox"></div>',
                                '<div class="matchBox" id="otherBox"></div>',
                                /**
                                '<div class="matchBox life" id="lifeBox">',
                                    '<div class=""></div>',
                                '</div>',
                                '<div class="matchBox" id="otherBox">',
                                    '<div class="everMach" id="show_1"></div>',
                                    '<div class="everMach" id="show_1"></div>',
                                    '<div class="everMach mt_10" id="show_1"></div>',
                                    '<div class="everMach mt_10" id="show_1"></div>',
                                '</div>',*/
                            '</div>',
                        '</div>',
                    '</div>',
                '</div>'].join(''),
            series: [
                '<div class="{className}" id="calendartype_{cid}">',
                    '<h2><span><a><img src="{imgPath}"></a>{typeName}</span></h2>',
                    '<ul></ul>',
                '</div>'
            ].join(''),
            calendar: [
                '<li>',
                    '<span>·</span><em labelid="{labelId}" color="{color}" style="cursor:pointer;">{labelName}</em>',
                    '<a limit="1" labelid="{labelId}" color="{color}" isubcribe="{isubcribe}" href="javascript:;" class="{className}" data-labelname="{labelName}">{text}</a> ', '',
                '</li>'
            ].join(''),

            tipPop: '<div class="tips" style="bottom: 35px;z-index: 2;right: 0; style:;"><div class="tips-text"><i class="i_ok_min mr_5"></i>{text}</div><span class="tipsBottom diamond" style="right:25px; left:auto;"></span></div>'
        },
        _typesConfig: [
            { name: '赛事', tag: 'race', sortIcon: 'i_match' },
            { name: '影视', tag: 'film', sortIcon: 'i_movie' },
            { name: '校园', tag: 'school', sortIcon: 'i_school' },
            { name: '品牌', tag: 'mall', sortIcon: 'i_shopping' },
            { name: '生活', tag: 'life', sortIcon: 'i_life' }

        ],
        _subBtsStyle: [//阅按钮样式控制
            'greSmalBtn', 'blackBtn',   //推荐
            'graySmalBtn', 'unsuBtn',   //分类
            'greBigBtn', 'blackBigBtn blackBtn'     //焦点图
        ],
        _subBtsTxt: ['订 阅', '退 订'], //订阅按钮样式
        _searchUrl: "search.html?from={from}&sid={sid}&search={search}",
        _UnifileId: {        //统一资源请求ID配置
            navUl: 'web_067',
            recommand: 'web_068'
            //lifeBox:'web_069',
            //otherBox:'web_070'
        },
        MESSAGES: {
            LOTTERY_TITLE: "订阅成功"
        },
        configData: {
            types: {
                BABY_TYPE: 1 //宝宝防疫
            }
        },
        initialize: function (options) {
            var _this = this,
                master = options.master,
                EVENTS = master.EVENTS;

            _this.options = options;
            _this.seriesIdArr = []; // 保存所有分类ID,包括赛事，影视，生活，校园，品牌等等
            _this.master = master;

            function oncreated(args) {
                if (args.name === "discovery") {
                    master.unbind(EVENTS.VIEW_CREATED, oncreated);
                    // 加载CSS文件,只加载一次
                    M2012.Calendar.CommonAPI.loadCssFile('module/schedule/square.css');
                    _this.model = new M2012.Calendar.Model.Square(options); //用来保存数据
                    if ($.isFunction(args.onshow)) {
                        args.onshow();
                    }
                }
            }

            master.bind(EVENTS.VIEW_CREATED, oncreated);

            //本页显示时，需要加载对应的CSS
            master.bind(EVENTS.VIEW_SHOW, function (param) {
                if (param.name === "discovery") {
                    param.container.empty();
                    param.container.html(_this.template.main);
                    _this.seriesIdArr = []; // 清空上一次保存的类型ID,防止叠加
                    _this.keepElements();
                    _this.getLabels();
                    _this.fillCalendars(); // 调用后台接口获取到的所有日历数据(新增)
                    _this.adjustHeight();
                    //记录行为日志
                    if (window.isCaiyun) {
                        _this.master.capi.addBehavior("cal_caiyun_discovery_load");
                    }
                    
                }
            });
        },
        keepElements: function () {
            var _this = this;
            _this.lifeBox = $('#lifeBox');
            _this.otherBox = $('#otherBox');
            _this.toMangLabel = $('#toMangLabel');
            _this.toMonth = $('#toMonth');
            _this.squareBox = $('#squareBox');
            _this.recommand = $('#recommand');
            _this.navUl = $('#navUl');

        },
        initEvents: function () {
            var _this = this;
            var containerHeight = _this.squareBox.height(); // 容器的高度
            $(window).resize(function () {
                _this.adjustHeight();
            });
            //焦点图
            $.focus({ direction: 'right' });

            //返回日历主页跳转
            _this.toMonth.click(function () {
               // _this.master.set({ view_filter_flag: 'mylabel' });
                _this.master.trigger("master:navigate", { path: "mainview" });
            });

            // "日历管理"链接跳转
            _this.toMangLabel.click(function () {
                _this.master.trigger('master:navigate', { path: "mod/labelmgr" }); // 跳转到管理页面
            });

            /*=============判断哪些日历已经订阅(begin)===============*/
            // 最顶层日历(大图片)
            $('#navUl li a[labelid]').each(function (i) {
                var curCalId = $(this).attr('labelid');
                var isSubcribe = _this.isSubcribe(_this.subLabels, parseInt(curCalId));
                if (isSubcribe) {     //判断是否订阅显示不同的按钮
                    $(this).attr('isubcribe', '1');
                } else {
                    $(this).attr('isubcribe', '0');
                }
            });

            // 中间区域日历(中间几个小图片日历)
            $('#recommand li a[labelid]').each(function (i) {
                var me = $(this);
                var curCalId = me.attr('labelid');
                var isSubcribe = _this.isSubcribe(_this.subLabels, parseInt(curCalId));

                me.closest("li").find("img").css({ cursor: "pointer" });
                if (isSubcribe) {     //判断是否订阅显示不同的按钮
                    me.removeClass(_this._subBtsStyle[0]).addClass(_this._subBtsStyle[1]).attr('isubcribe', '1').html(_this._subBtsTxt[1]);
                } else {
                    me.removeClass(_this._subBtsStyle[1]).addClass(_this._subBtsStyle[0]).attr('isubcribe', '0').html(_this._subBtsTxt[0]);
                }

            });

            $(document).off("mousedown"); // 先移除掉document上的事件,防止触发多次
            // 新增推荐模块(页面中部区域的几张小图片)的点击事件,除"宝宝防疫"之外
            // 使用事件代理,除开"订阅按钮"的其他位置都需要能弹出窗口,recommand这个id不能改变
            // 使用代理防止动态添加的元素绑定不上事件
            $(document).on("mousedown", function (e) {
                var target = e.srcElement || e.target,
                    tagName = target.tagName.toLowerCase(),
                    element; // 目标元素

                if (e.which !== 1) {
                    // 右键点击不处理
                    return;
                }

                // 推荐列表(四张小图片)
                if (tagName !== "a" && $(target).closest("#recommand li").length) {
                    element = $(target).closest("li").find("a");
                    if (!$(element).data("type")) { // 除"宝宝防疫"之外
                        top.$Evocation.openSubsCalendar({
                            labelId: $(element).attr("labelid") || 0,
                            isOffical: true,
                            containerHeight: containerHeight,
                            subscribe: function () {
                                // 订阅成功回调
                                _this.updateStatus({
                                    labelId: $(element).attr('labelid') || 0,
                                    status: "0",
                                    element: element
                                });

                                //通知主控，新订阅了公共日历。
                                _this.master.trigger(_this.master.EVENTS.LABEL_ADDED, {
                                    seqNo: $(element).attr('labelid') || 0,
                                    color: $(element).attr('color'),
                                    isShare: 0,
                                    isSaveMenuStatus: true  // 增加配置项,保持左侧菜单栏的状态
                                });
                            },
                            unsubscribe: function () {
                                // 退订成功回调
                                _this.updateStatus({
                                    labelId: $(element).attr('labelid') || 0,
                                    status: "1",
                                    element: element
                                });

                                //通知主控，退订了公共日历。
                                _this.master.trigger(_this.master.EVENTS.LABEL_REMOVE, {
                                    seqNo: $(element).attr('labelid') || 0,
                                    isSaveMenuStatus: true  // 增加配置项,保持左侧菜单栏的状态
                                });
                            }
                        });
                    }
                }

                // 最顶上的广告图片
                if ($(target).closest("#navUl").length) {
                    var dataType = $(target).data("type"); //暂定data-type=1为宝宝防疫
                    if (dataType == _this.configData.types.BABY_TYPE) {
                        $Cal.trigger("show:AddBaby");
                    } else {
                        element = $(target).closest("li").find("a");
                        var labelId = $(element).attr("labelid") || 0
                        top.$Evocation.openSubsCalendar({ // 此处不需要传递element
                            labelId: $(element).attr("labelid") || 0,
                            isOffical: true,
                            containerHeight: containerHeight,
                            subscribe: function () {
                                //通知主控，新订阅了公共日历。
                                _this.master.trigger(_this.master.EVENTS.LABEL_ADDED, {
                                    seqNo: labelId,
                                    color: $(target).attr('color'),
                                    isShare: 0,
                                    isSaveMenuStatus: true  // 增加配置项,保持左侧菜单栏的状态
                                });
                            },
                            unsubscribe: function () {
                                //通知主控，退订了公共日历。
                                _this.master.trigger(_this.master.EVENTS.LABEL_REMOVE, {
                                    seqNo: labelId,
                                    isSaveMenuStatus: true  // 增加配置项,保持左侧菜单栏的状态
                                });
                            }
                        });
                    }
                }

                // 页面最底部,专门针对otherBox下的文本元素<em></em>
                if (tagName === 'em' && ($(target).closest("#otherBox li").length || $(target).closest("#lifeBox li").length)) {
                    element = $(target).next(); // 需要更新的dom节点
                    // showSubBtn属性为true时表示已经订阅,false表示还未订阅
                    top.$Evocation.openSubsCalendar({
                        labelId: $(target).attr('labelid') || 0,
                        isOffical: true,
                        containerHeight: containerHeight,
                        subscribe: function () {
                            // 订阅成功回调
                            _this.updateStatus({
                                labelId: $(target).attr('labelid') || 0,
                                status: "0",
                                element: element
                            });

                            //通知主控，新订阅了公共日历。
                            _this.master.trigger(_this.master.EVENTS.LABEL_ADDED, {
                                seqNo: $(target).attr('labelid') || 0,
                                color: $(target).attr('color'),
                                isShare: 0,
                                isSaveMenuStatus: true  // 增加配置项,保持左侧菜单栏的状态
                            });
                        },
                        unsubscribe: function () {
                            // 退订成功回调
                            _this.updateStatus({
                                labelId: $(target).attr('labelid') || 0,
                                status: "1",
                                element: element
                            });

                            //通知主控，退订了公共日历。
                            _this.master.trigger(_this.master.EVENTS.LABEL_REMOVE, {
                                seqNo: $(target).attr('labelid') || 0,
                                isSaveMenuStatus: true  // 增加配置项,保持左侧菜单栏的状态
                            });
                        }
                    });
                }

                // 保留之前的逻辑
                // 专门针对lifeBox,otherBox的超链接<a></a>以及recommand下四张小图片的"订阅"按钮
                if (tagName === 'a' && ($(target).closest("#lifeBox li").length || $(target).closest("#otherBox li").length || $(target).closest("#recommand li").length)) {
                    // 点击宝宝防疫时的处理,暂定data-type=1为宝宝防疫
                    if ($(target).data("type") == _this.configData.types.BABY_TYPE) {
                        $Cal.trigger("show:AddBaby");
                        return;
                    }

                    var $subEle = $(target);
                    var labelId = $subEle.attr("labelid"),
                        color = $subEle.attr("color"),
                        labelName = $subEle.data("labelname"),
                        isSubcribe = $subEle.attr('isubcribe'),
                        _isSubscribeAction = ('0' === isSubcribe);

                    if ($subEle.attr('limit') == 1 || $subEle.parent().attr('limit')) {
                        $subEle.attr('limit', '0');

                        if (_isSubscribeAction) {    //订阅
                            topmsg('正在订阅...');
                            _this.model.subscribeCalendar({
                                comeFrom: 0,
                                labelId: labelId,
                                color: color || "#0000ff"

                            }, function (response) {
                                _this.onsubscribe(response, { seqNo: Number(labelId), color: color, labelName: labelName, button: $subEle });

                            }, function () {
                                topmsg('系统繁忙，请稍后重试', { delay: 3000 });

                            });

                        } else {

                            topmsg('正在退订...');
                            _this.model.unsubscribeCalendar({
                                comeFrom: 0,
                                labelId: labelId

                            }, function (response) {
                                if (response["code"] === "FS_UNKNOW") {
                                    // 已经退订的情况, 直接刷新界面
                                    M139.UI.TipMessage.show('操作失败，请稍后重试', { delay: 3000, className: "msgRed" });
                                    _this.master.trigger(_this.master.EVENTS.NAVIGATE, { path: "view/update" });
                                    return;
                                }

                                _this.oncancel(response, { seqNo: Number(labelId), color: color, labelName: labelName, button: $subEle });

                            }, function () {
                                topmsg('系统繁忙，请稍后重试', { delay: 3000 });
                            });
                        }
                    }
                }
            });
        },

        //订阅成功回调函数
        onsubscribe: function (result, args) {
            var _this = this;
            var $subEle = args.button;

            var htmTip = $T.format(_this.template.tipPop, { text: '订阅成功！' });

            _this.subLabels.push(args.seqNo);
            _this.awardDialog(result);

            topmsg('订阅成功', { delay: 3000 });
            if ($subEle.parents('#navUl').length > 0) {
                $subEle.attr('isubcribe', '1');
                setTimeout(function () {
                    $subEle.removeClass(_this._subBtsStyle[4]).addClass(_this._subBtsStyle[5]).html(_this._subBtsTxt[1]);
                    $subEle.attr('limit', '1');
                }, 1500);

            } else if ($subEle.parents('#recommand').length > 0) {
                $subEle.parents('li').find('img').after(htmTip);
                $subEle.attr('isubcribe', '1');
                setTimeout(function () {
                    $subEle.parents('li').find('.tips').hide();
                    $subEle.removeClass(_this._subBtsStyle[0]).addClass(_this._subBtsStyle[1]).html(_this._subBtsTxt[1]);
                    $subEle.attr('limit', '1');
                }, 1500);

            } else {
                $subEle.attr('isubcribe', '1');
                setTimeout(function () {
                    $subEle.removeClass(_this._subBtsStyle[2]);
                    $subEle.addClass(_this._subBtsStyle[3]).html(_this._subBtsTxt[1]);
                    $subEle.attr('limit', '1');
                }, 1500)
            }

            //通知主控，新订阅了公共日历。
            var master = window.$Cal;
            master.trigger(master.EVENTS.LABEL_ADDED, {
                seqNo: args.seqNo,
                labelName: args.labelName,
                color: args.color,
                isShare: 0,
                isSaveMenuStatus: true  // 增加配置项,保持左侧菜单栏的状态
            });
        },

        //退阅成功回调函数
        oncancel: function (result, args) {
            var _this = this;
            var $subEle = args.button;

            for (var i = 0, l = _this.subLabels.length; i < l; i++) {
                if (_this.subLabels[i] == args.seqNo) {
                    _this.subLabels.splice(i, 1);
                }
            }

            var htmTip = $T.format(_this.template.tipPop, { text: '退订成功！' });
            topmsg('退订成功', { delay: 3000 });

            if ($subEle.parents('#navUl').length > 0) {
                $subEle.attr('isubcribe', '0');
                setTimeout(function () {
                    $subEle.removeClass(_this._subBtsStyle[5]).addClass(_this._subBtsStyle[4]).html(_this._subBtsTxt[0]);
                    $subEle.attr('limit', '1');
                }, 1500);
            } else if ($subEle.parents('#recommand').length > 0) {
                $subEle.parents('li').find('img').after(htmTip);
                $subEle.attr('isubcribe', '0');
                setTimeout(function () {
                    $subEle.parents('li').find('.tips').hide();
                    $subEle.removeClass(_this._subBtsStyle[1]).addClass(_this._subBtsStyle[0]).html(_this._subBtsTxt[0]);
                    $subEle.attr('limit', '1');
                }, 1500);

            } else {
                $subEle.attr('isubcribe', '0');
                setTimeout(function () {
                    $subEle.removeClass(_this._subBtsStyle[3]).addClass(_this._subBtsStyle[2]);
                    $subEle.html(_this._subBtsTxt[0]);
                    $subEle.attr('limit', '1');
                }, 1500)
            }

            //通知主控，退订了公共日历。
            var master = window.$Cal;
            master.trigger(master.EVENTS.LABEL_REMOVE, {
                seqNo: args.seqNo,
                labelName: args.labelName,
                isSaveMenuStatus: true  // 增加配置项,保持左侧菜单栏的状态
            });
        },

        /**
         * 弹出窗口中订阅,或退订成功时,需要调用回调函数更新日历广场页面中的状态
         * @param obj 包括labelId, status, element
         * labelId : 日历活动ID
         * status : "0"表示订阅成功, "1"退订成功 // todo
         * element : 需要改变状态的dom节点
         */
        updateStatus: function (obj) {
            var _this = this,
                labelId = obj.labelId,
                status = obj.status,
                $subEle = obj.element;

            if (status === "0") {
                _this.subLabels.push(parseInt(labelId));
                if ($subEle.parents('#navUl').length > 0) {
                    $subEle.removeClass(_this._subBtsStyle[4]).addClass(_this._subBtsStyle[5]).html(_this._subBtsTxt[1]);
                } else if ($subEle.parents('#recommand').length > 0) {
                    $subEle.parents('li').find('.tips').hide();
                    $subEle.removeClass(_this._subBtsStyle[0]).addClass(_this._subBtsStyle[1]).html(_this._subBtsTxt[1]);
                } else {
                    $subEle.removeClass(_this._subBtsStyle[2]);
                    $subEle.addClass(_this._subBtsStyle[3]).html(_this._subBtsTxt[1]);
                }
                $subEle.attr('isubcribe', '1');
                $subEle.attr('limit', '1');
            } else {
                for (var i = 0, l = _this.subLabels.length; i < l; i++) {
                    if (_this.subLabels[i] == labelId) {
                        _this.subLabels.splice(i, 1);
                    }
                }

                if ($subEle.parents('#navUl').length > 0) {
                    $subEle.removeClass(_this._subBtsStyle[5]).addClass(_this._subBtsStyle[4]).html(_this._subBtsTxt[0]);
                } else if ($subEle.parents('#recommand').length > 0) {
                    $subEle.parents('li').find('.tips').hide();
                    $subEle.removeClass(_this._subBtsStyle[1]).addClass(_this._subBtsStyle[0]).html(_this._subBtsTxt[0]);
                } else {
                    $subEle.removeClass(_this._subBtsStyle[3]).addClass(_this._subBtsStyle[2]);
                    $subEle.html(_this._subBtsTxt[0]);
                }
                $subEle.attr('isubcribe', '0');
                $subEle.attr('limit', '1');
            }
        },
        adjustHeight: function () {
            var cHeight = document.body.clientHeight;
            var h = cHeight - 45;
            this.squareBox.css({ height: h });
        },

        getUnitFile: function () { // 通过公共接口提取的数据,包括推荐和主广告
            var self = this;
            var fileIds = [];
            for (var key in self._UnifileId) {
                fileIds.push(self._UnifileId[key]);
            }

            // IE6下顶层几个大图片会出现加载不出来的问题
            self.navUl.offset({
                top: 53,
                left: 210
            });

            self.model.getUnitFile({ positionCodes: fileIds.join(',') }, function (response) {
                var data = response["var"];
                if (data) {
                    var isRenderEnd = false;
                    for (var a = 0, b = fileIds.length; a < b; a++) {
                        if (a == (b - 1)) {
                            isRenderEnd = true;
                            //self.isUnitFileRenderComplete = true;
                        }
                        for (var key in self._UnifileId) {
                            if (fileIds[a] == self._UnifileId[key]) {
                                // data[fileIds[a]] : 表示数组, 该数组中只有一个元素
                                data[fileIds[a]] && data[fileIds[a]][0].content && $(data[fileIds[a]][0].content).appendTo($('#' + key));    //将获取的html字符串填充到页面
                            }
                        }
                    }
                    if (isRenderEnd) {    //保证数据填充到页面后再注册事件
                        self.initEvents();
                    }
                }
            });
        },
        fillCalendars: function () { // 后台接口提供的分类日历列表数据
            var self = this;
            self.model.getSeriesList({ comeFrom: 0 }, function (detail, text) {
                try {
                    detail["var"] && self.renderAllSeries(detail, self.renderAllCalendars); // 填充所有的大类别之后在填充类别下的所有日历,注意顺序
                } catch (e) {
                    // 循环遍历,保证某个请求异常时不阻塞
                }
            }, function () {
                console.log("fnFail");
            }, function () {
                console.log("fnError");
            });
        },
        /**
         * 根据不同的类别ID,将类别下的所有日历填充到相应位置内
         * @param detail
         * @param fn 回调函数
         */
        renderAllSeries: function (detail, fn) {
            var tableData = detail["var"].table,
                tableDataArr = [].slice.call(tableData),
                otherBoxArr = [],
                lifeBoxArr = [];

            for (var i = 0, len = tableDataArr.length; i < len; i++) {
                var typeName = tableDataArr[i].typeName || "",
                    seriesId = tableDataArr[i].seqNo || 0,
                    imgPath = tableDataArr[i].path,
                    className = '',
                    html = '';

                if (i < 2) { // 前面两个类别区域显示在第一排
                    className = "everMach";
                } else if (i < len - 1) { // 从第三个开始,需要增加间距样式,每一排显示俩个类别区域
                    className = "everMach mt_10";
                } else if (i == len - 1) {
                    className = ""; // 生活类别区域(暂时默认它为数组的最后一个),特殊处理放在最右侧
                }
                html = $T.format(this.template.series, {
                    className: className,
                    typeName: typeName,
                    cid: seriesId,
                    imgPath: imgPath
                });
                this.seriesIdArr.push(seriesId); // 保存
                if (i == len - 1) {
                    lifeBoxArr.push(html); // 生活类别区域(暂时默认它为数组的最后一个)
                } else {
                    otherBoxArr.push(html); // 除生活类别外的其他类别区域
                }
            }
            this.otherBox.html(otherBoxArr.join(""));
            this.lifeBox.addClass("life").html(lifeBoxArr.join(""));
            fn && typeof fn === 'function' && fn.call(this);
        },
        renderAllCalendars: function () {
            var self = this;
            for (var i = 0; i < self.seriesIdArr.length; i++) {
                var typeID = self.seriesIdArr[i],
                    divID = "calendartype_" + typeID,
                    pageSize = 4; // 默认每个类别下显示前面三条数据

                // 循环调用接口,根据类别ID获取类别下的所有日历并填充,这里的ID号需要传递
                // 不然divID会被循环的最后一个值覆盖
                (function (id) {
                    if (parseInt(id.split("_")[1]) === self.seriesIdArr.length) {
                        // 如果是生活区域(默认为数组的最后一条数据),则显示前8条数据
                        pageSize = 10;
                    }

                    self.model.getCalendarBySeriesId({
                        comeFrom: 0,
                        seqNo: typeID,
                        pageSize: pageSize,
                        pageIndex: 1
                    }, function (data, text) {
                        data["var"] && self.renderCalendars.call(self, data, id); // 填充所有日历
                    }, function () {
                        console.log('fnFail');
                    }, function () {
                        console.log('fnError');
                    });
                })(divID);
            }
        },
        renderCalendars: function (data, id) {
            var ulEl = $("#" + id).find("ul");

            var tableData = data["var"] && data["var"].table,
                tableDataArr = [].slice.call(tableData),
                liArr = [],
                html = '';

            for (var i = 0, len = tableDataArr.length; i < len; i++) {
                var labelName = tableDataArr[i].labelName || "",
                    labelId = tableDataArr[i].seqNo || 0,
                    color = tableDataArr[i].color,
                    isSubscribe = tableDataArr[i].isSubscribed,                // todo 确定是否订阅?????
                    className = (isSubscribe === constant.subscribeStatus.isSubscribed) ? this._subBtsStyle[3] : this._subBtsStyle[2],
                    text = (isSubscribe === constant.subscribeStatus.isSubscribed) ? this._subBtsTxt[1] : this._subBtsTxt[0];

                html = $T.format(this.template.calendar, {
                    labelName: labelName,
                    labelId: labelId,
                    color: color,
                    isubcribe: isSubscribe,
                    className: className,
                    text: text
                });

                liArr.push(html);
            }

            ulEl.html(liArr.join(""));
        },
        getLabels: function () {
            topmsg('正在加载中...');
            var _this = this;
            _this.model.getLabels({
                comeFrom: 0,
                actionType: 0
            }, function (response) {
                hidemsg();
                if (response["var"]) {
                    _this.allLabels = response["var"];
                    _this.subLabels = [];
                    for (var i = 0, l = _this.allLabels['subscribedLabels'].length; i < l; i++) {
                        _this.subLabels.push(_this.allLabels['subscribedLabels'][i].seqNo);
                    }
                    _this.getUnitFile();    //统一位置管理

                }
            }, function (detail) {
                //console.log(detail);
            });
        },
        //判断是否订阅
        isSubcribe: function (subIds, curId) {
            return _.contains(subIds, curId);       //underscore方法：查找一个元素是否在数组中
        },

        //订阅中奖弹框
        awardDialog: function (response) {
            var _this = this;
            if (response && response.awardFlag) {
                var lotteryKeys = {
                    1: "draw",
                    2: "pay",
                    3: "luckyone"
                };

                //key存在时才显示中奖弹窗
                var type = lotteryKeys[response.awardFlag];
                if (type) {
                    new M2012.Calendar.Lottery.View({
                        type: type,
                        title: _this.MESSAGES.LOTTERY_TITLE
                    }).render();
                }
            }
        }
    }));

    $(function () {
        new M2012.Calendar.View.Square({
            master: window.$Cal
        });
    });
})(jQuery, _, M139, window._top || window.top);


