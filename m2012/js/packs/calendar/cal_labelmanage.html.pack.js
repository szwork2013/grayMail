; (function ($, _, M139, top) {
    var className = "M2012.Calendar.Model.LabelManage";

    M139.namespace(className, Backbone.Model.extend({
        name: className,
        logger: new M139.Logger({ name: className }),
        //枚举集合
        Types: {
            0: 'allLabels',
            1: 'sysLabels',
            2: 'userLabels',
            3: 'shareLabels',
            4: 'subscribedLabels',
            5: 'groupLabels',

            all: 0,
            system: 1,
            user: 2,
            shared: 3,
            subscribe: 4,
            group: 5
        },
        /**
         *  详细活动编辑
         *  @param {Object} args.master //视图主控
         */
        initialize: function (args) {
            var that = this;
            that.master = args.master;
        },

        callAPI: function (fnName, data, fnSuccess, fnError) {
            var that = this;
            that.master.capi.callAPI({
                data: data,
                fnName: fnName
            }, fnSuccess, fnError);
        },
        /**
         * 调用后台接口获取日历数据
         * @param data
         * @param fnSuccess
         * @param fnError
         */
        getLabels: function (data, fnSuccess, fnError) {
            var that = this;
            var param = { comeFrom: 0, actionType: 0 } || data;
            this.callAPI("getLabels", param, function (response) {
                if (response.code === 'S_OK') {
                    var data = that.wrapLabels(response["var"]);
                    !$.isEmptyObject(data) && _.isFunction(fnSuccess) && fnSuccess(data);
                }
            }, fnError);
        },
        /**
         * 删除别人共享给自己的日历
         * @param param
         * @param fnSuccess
         * @param fnError
         */
        deleteLabelShare: function (param, fnSuccess, fnError) {
            this.callAPI("deleteLabelShare", param, fnSuccess, fnError);
        },
        /**
         * 删除自己创建的日历
         * @param param
         * @param fnSuccess
         * @param fnError
         */
        deleteLabel: function (param, fnSuccess, fnError) {
            param = $.extend({
                comeFrom: 0,
                isDelAllCals: 0   //删除标签时，是否删除该标签下的所有日程：0:不删除, 1:删除
            }, param);
            this.callAPI("deleteLabel", param, fnSuccess, fnError);
        },
        /**
        * 删除群日历
        * @param param
        * @param fnSuccess
        * @param fnError
        */
        deleteGroupLable: function (param, fnSuccess, fnError) {
            param = param || {};
            if (param.isOwner) {
                delete param.isOwner;
                this.callAPI("deleteLabel", param, fnSuccess, fnError);
                return;
            }
            this.callAPI("deleteLabelShare", param, fnSuccess, fnError);
        },
        /**
         * 退订"订阅日历"下的日历
         * @param param
         * @param fnSuccess
         * @param fnError
         */
        cancelSubscribeLabel: function (param, fnSuccess, fnError) {
            param = $.extend({ comeFrom: 0 }, param);
            this.callAPI("cancelSubscribeLabel", param, fnSuccess, fnError);
        },
        /**
         * @param data  接口返回的数据
         * @param typeName key
         * @returns {*|Array}
         */
        getListByType: function (data, typeName) {
            var that = this,
                intKey = that.Types[typeName],
                strKey = that.Types[intKey];
            return data[strKey] || [];
        },
        /**
         * 将从接口返回的数据进一步封装
         * 封装之后的数据用于界面展示
         * @param result
         * @returns {*}
         */
        wrapLabels: function (result) {
            if (!result) {
                // 如果接口返回数据为空, 直接返回
                return {};
            }

            var that = this,
                shared = that.getListByType(result, "shared"),
                subscribe = that.getListByType(result, "subscribe"),
                system = that.getListByType(result, "system"),
                group = that.getListByType(result, "group"),
                user = that.getListByType(result, "user");

            // 转换数据类型, 增加isBeShared字段, 标记该日历是"别人共享给自己的"
            _.each(shared, function (item) {
                $.extend(item, { isBeShared: true });
            });

            // 增加一个虚拟的类型： 所有标签，方便处理
            result['allLabels'] = [].concat(user, system, shared, subscribe);

            // 转换数据类型
            _.each(result['allLabels'], function (item) {
                $.extend(item,
                    {
                        labelId: Number(item.seqNo || item.labelId),
                        labelName: $T.Html.encode(item.labelName) // 防止XSS攻击
                    });
            });

            // 新增需求, 共享的日历归类到"我的日历"下面
            user = user.concat(shared);
            return {
                'all': result['allLabels'],
                'user': user,
                'shared': shared,
                'subscribe': subscribe,
                'system': system,
                'group': group
            };
        }
    }));
})(jQuery, _, M139, window._top || window.top);

; (function ($, _, M139, top) {
    var className = "M2012.Calendar.View.LabelManage";

    M139.namespace(className, Backbone.View.extend({
        name: className,
        //当前视图名称
        viewName: "labelmgr",
        logger: new M139.Logger({ name: className }),

        /**
         * 展示日历管理界面
           @example
         */
        initialize: function (args) {
            var self = this;

            // 定义主控和日历管理界面管理器
            self.master = args.master;
            self.model = new M2012.Calendar.Model.LabelManage({ master: self.master });

            // 视图首次加载时触发
            self.master.bind(self.master.EVENTS.VIEW_CREATED, function (args) {
                if (args.name === self.viewName) {
                    self.master.unbind(self.master.EVENTS.VIEW_CREATED);
                    self.container = args.container;
                    if ($.isFunction(args.onshow)) {
                        args.onshow();
                        $(window).resize(function () {
                            // 动态调整页面的高度
                            self.adjustHeight();
                        });
                    }
                }
            });

            self.master.bind(self.master.EVENTS.VIEW_SHOW, function (args) {
                if (args.name === self.viewName) {
                    self.container.empty();
                    self.render();
                }
            });
        },
        /**
         * 注册事件监听
        **/
        initEvents: function () {
            var that = this;

            // 绑定返回事件
            that.getElement("addBack").click(function () {
                that.master.trigger("master:navigate", { path: "mainview/refresh" });
                return false;
            });

            // "创建日历"按钮绑定事件
            that.getElement("newLabel").click(function () {
                that.master.trigger(that.master.EVENTS.ADD_LABEL);
                that.master.capi.addBehavior("calendar_manager_createlabel_click");
                return false;
            });


            // 绑定事件, 如果某类型下的日历数目超过1, 则显示该日历列表中的表格, 否则隐藏
            // TODO 为何不能直接调用show,hide方法,很奇怪??
            that.handlerLists(function (id) {
                that.off(id + "LabelNum").on(id + "LabelNum", function (length) {
                    var target = that.getElement(id).closest("div");
                    length ? target.removeClass("hide") : target.addClass("hide");
                });
            });

            // "我的日历"下的总活动数
            that.off("updateCalendarCount").on("updateCalendarCount", function (count) {
                that.calendarCount.text(count);
            });
        },
        initElements: function () {
            var that = this;
            // 页面加载时创建
            // "我的日历"和"订阅日历"所在的表格对象
            that.userbody = that.getElement("user").find("tbody");
            that.subscribebody = that.getElement("subscribe").find("tbody");
            that.groupbody = that.getElement("group").find("tbody");

            that.calendarCount = that.getElement("calendarCount");
        },
        /**
         * 根据表格ID的后缀获取要显示数据的列表并对其进行操作
         * TODO 也可以使用正则表达式匹配id
         * 如id为"view49_user"匹配后的结果为"user"
         * @param fn 回调函数,将匹配后的结果作为参数传入
         */
        handlerLists: function (fn) {
            var that = this;
            $.each(that.container.find("table"), function () {
                var id = $(this).attr("id");
                if (id && id.indexOf("_") != -1) {
                    _.isFunction(fn) && fn(id.split("_")[1]);
                }
            });
        },
        // 渲染视图
        render: function () {
            var that = this;
            top.M139.UI.TipMessage.show('正在加载中...');
            // 先展示界面邹型
            that.container.html($T.format(that.template.Content, { cid: that.cid }));

            that.initElements();
            that.initEvents();

            // 获取接口数据渲染界面
            that.model.getLabels({}, function (data) {
                // 先填充"我的日历下"的活动总数
                that.trigger("updateCalendarCount", data["system"] && (data["system"][0]["calendarCount"] || 0));

                that.handlerLists(function (id) {
                    console.log(data);
                    var view = {};
                    // 不同的日历由不同的集合分别存储
                    try {
                        switch (id) {
                            case 'user':
                                // 处理"我的日历"下的所有日历
                                that.userCollection = new Backbone.Collection();
                                // 当向集合中添加数据的时候触发
                                that.listenTo(that.userCollection, 'add', function (model) {
                                    view = new M2012.Calendar.View.User({
                                        model: model,
                                        manage: that
                                    });
                                    // 填充"我的日历"下的日历模板
                                    !$.isEmptyObject(view) && that.userbody.append(view.render().el);
                                });
                                // 触发绑定的"add"事件
                                that.userCollection.add(data[id] || []);
                                break;
                            case 'subscribe':
                                // 处理"订阅日历"下的所有日历
                                that.subscribeCollection = new Backbone.Collection();
                                // 当向集合中添加数据的时候触发
                                that.listenTo(that.subscribeCollection, 'add', function (model) {
                                    view = new M2012.Calendar.View.Subscribe({
                                        model: model,
                                        manage: that
                                    });
                                    // 填充"订阅日历"下的日历模板
                                    !$.isEmptyObject(view) && that.subscribebody.append(view.render().el);
                                });
                                // 触发绑定的"add"事件
                                that.subscribeCollection.add(data[id] || []);
                                // 触发initEvents中绑定的事件
                                that.trigger(id + "LabelNum", that.subscribeCollection.length);
                                break;
                            case 'group': // other label
                                // 处理"群组日历"下的所有日历
                                that.groupCollection = new Backbone.Collection();
                                // 当向集合中添加数据的时候触发
                                that.listenTo(that.groupCollection, 'add', function (model) {
                                    view = new M2012.Calendar.View.Group({
                                        model: model,
                                        manage: that
                                    });
                                    // 填充"订阅日历"下的日历模板
                                    !$.isEmptyObject(view) && that.groupbody.append(view.render().el);
                                });
                                // 触发绑定的"add"事件
                                that.groupCollection.add(data[id] || []);
                                // 触发initEvents中绑定的事件
                                that.trigger(id + "LabelNum", that.groupCollection.length);
                                break;
                            default:
                        }
                    } catch (e) {
                        top.M139.UI.TipMessage.show('数据加载出错, 请重新加载。', {
                            delay: 3000,
                            className: "msgRed"
                        });
                        console.error && console.error(e);
                    }
                });

                // 调整页面高度
                that.adjustHeight();

                // 界面加载完成隐藏加载信息
                top.M139.UI.TipMessage.hide();
            }, function () {
                // exception handle
            });
        },
        /**
         * 调整页面高度
        **/
        adjustHeight: function () {
            var that = this,
                container = that.getElement("container"),
                top = container.offset().top;
            container[0].style.overflowY = 'auto';
            container.height($("body").height() - top - 10); // TODO -10
        },
        /**
         * 获取页面元素
         * id为{cid}_name 格式的页面元素
         * id中不需要带cid_
        **/
        getElement: function (id) {
            var that = this;
            id = $T.format("#{cid}_{id}", {
                cid: that.cid,
                id: id
            });
            return $(id);
        },
        template: {
            Content: ['<div class="" id="{cid}_outer">',
                //<!-- 顶部导航显示区 -->
                '<div class="tab tab-schedule bgMargin">',
                    '<div class="createTop tabTitle">',
                        '<h2>',
                            '<span>管理日历</span><a class="back" id="{cid}_addBack" href="javascript:;">&lt;&lt;返回</a>',
                        '</h2>',
                    '</div>',
                '</div>',
                //<!-- 主视图区域 -->
                '<div id="{cid}_container" class="ad-list-div">',
                    '<div id="" class="bgPadding_left">',
                        //<!-- 创建日历按钮 -->
                        '<div class="mt_20">',
                            '<a href="javascript:;" id="{cid}_newLabel" class="btnSet btnsetTag">',
                                '<span>创建日历</span>',
                            '</a>',
                        '</div>',
                        //<!-- "我的日历"数据列表显示区域 -->
                        '<div>',
            '<p class="fw_b mt_20 fz_14">日历</p>',
            '<table class="systemwjj" id="{cid}_user">',
                '<thead>',
                    '<tr>',
                        '<th class="td1">日历名称</th>',
                        '<th class="td2">日历下的活动数</th>',
                        '<th class="td4">操作</th>',
                    '</tr>',
                '</thead>',
                '<tbody>',
                    '<tr>',
                        '<td class="td1">',
                            '<div title="我的日历" class="mangCalTit clearfix">',
                                '<span style="background-color:#319eff" class="ad-tagt"></span>',
                                '<span class="ad-tagtCon">我的日历</span>',
                                //'<a href="javascript:;" class="ml_10">',
                                '<i title="仅自己可见" class="i_secret ml_10"></i>',
                                //'</a>',
                            '</div>',
                        '</td>',
                        '<td class="td2" id="{cid}_calendarCount"></td>',
                        '<td class="td4"></td>',
                    '</tr>',
                '</tbody>',
            '</table>',
            '</div>',
            //<!-- "群组"数据列表显示区域, 默认隐藏 -->
            '<div class="hide">',
                '<p class="fw_b mt_20 fz_14">群日历</p>',
                '<table class="systemwjj" id="{cid}_group">',
                    '<thead>',
                        '<tr>',
                            '<th class="td1">日历名称</th>',
                            '<th class="td2">日历下的活动数</th>',
                            '<th class="td4">操作</th>',
                        '</tr>',
                    '</thead>',
                    '<tbody></tbody>',
                '</table>',
            '</div>',
            //<!-- "订阅日历"数据列表显示区域, 默认隐藏 -->
            '<div class="hide">',
                '<p class="fw_b mt_20 fz_14">订阅日历</p>',
                '<table class="systemwjj" id="{cid}_subscribe">',
                    '<thead>',
                        '<tr>',
                            '<th class="td1">日历名称</th>',
                            '<th class="td2">日历下的活动数</th>',
                            '<th class="td4">操作</th>',
                        '</tr>',
                    '</thead>',
                    '<tbody></tbody>',
                '</table>',
            '</div>',
            '</div>',
            '</div>',
            '</div>'
            ].join("")
        }
    }));

    $(function () {
        new M2012.Calendar.View.LabelManage({
            master: window.$Cal
        });
    });
})(jQuery, _, M139, window._top || window.top);

/*****************************  日历模板  *********************************************/
/**
 * 暂时只要显示两种
 * 1. 我的日历: "包括自己创建的"和"别人共享给自己的"
 * 2. 订阅日历: "包括后台发布的"和"个人公开的"
 */

// "我的日历"模板
(function ($, _, M139, top) {
    var className = "M2012.Calendar.View.User";

    M139.namespace(className, Backbone.View.extend({
        name: className,
        logger: new M139.Logger({ name: className }),
        tagName: "tr",
        template: [
                '<td class="td1">',
                    '<div class="mangCalTit clearfix" title="<%-labelName %>">',
                        '<span class="ad-tagt mt_2" style="background-color:<%-color %>;"></span>',
                        '<span class="ad-tagtCon"><%-labelName %></span>',
                        '<%=icon %>',
                    '</div>',
                '</td>',
                '<td class="td2"><%-calendarCount %></td>',
                '<td class="td4">',
                    '<a href="javascript:;" id="user_edit">编辑</a>',
                    '<span class="gray"> | </span>',
                    '<a href="javascript:;" id="user_delete">删除</a>',
                '</td>'
        ].join(""),
        events: {
            "click #user_delete": "destroy",
            "click #user_edit": "edit",
            "click #user_public": "popDetailInfo",
            "click #user_share": "popDetailInfo",
            "click #user_both_public": "popDetailInfo",
            "click #user_both_share": "popDetailInfo"
        },
        initialize: function (args) {
            this.manage = args.manage;
            this.master = this.manage.master;

            // 操作需要用到的数据
            this.mymodel = this.model.toJSON();
            this.isBeShared = !!this.mymodel.isBeShared;
            this.labelId = this.mymodel.labelId;
            this.isPublic = !!this.mymodel.isPublic;
            this.isShare = !!this.mymodel.isShare;

            // 设置icon
            this.model.set("icon", this.getIcon());

            // model.destroy时触发事件
            this.listenTo(this.model, 'destroy', this.remove);
        },
        // render view
        render: function () {
            var that = this,
                template = _.template(that.template);
            that.$el.html(template(that.model.toJSON()));
            return that;
        },
        // remove the element
        /**
         * 删除分两种情况
         * 1. 自己创建的日历
         * 2. 别人共享给自己的日历
         */
        destroy: function () {
            var that = this,
                labelId = that.labelId,
                isPublic = that.isPublic,
                isShare = that.isShare,
                isBeShared = that.isBeShared;

            // 删除操作成功之后的回调函数
            var fnSuccess = function () {
                top.M139.UI.TipMessage.show('删除成功', { delay: 3000 });
                // 删除日历之后,需要通知master更新左侧视图
                that.master.trigger(that.master.EVENTS.LABEL_REMOVE, { seqNo: labelId });
                // 清除表格中的数据
                that.model.destroy();
            };

            // 删除操作失败之后的回调函数
            var fnError = function () {
                top.M139.UI.TipMessage.show('系统繁忙，请稍后重试', { delay: 3000, className: "msgRed" });
            };

            if (isBeShared) {
                // 别人共享给自己的
                top.$Msg.confirm("是否删除此共享日历？", function () {
                    that.manage.model.deleteLabelShare({
                        labelId: labelId,
                        comeFrom: 0
                    }, function (response) {
                        if (response.code === "S_OK") {
                            fnSuccess && fnSuccess();
                            return;
                        }
                        fnError && fnError();
                    }, function () {
                        fnError && fnError();
                    });
                }, { icon: "warn" });
                return;
            }

            // 自己创建的日历, 分为"共享给别人的日历" 或 "公开的日历" 或 "两者兼有"
            if (isPublic || isShare) {
                // 如果是"共享给别人的" 或者 是"公开的日历"
                var pubCalDelMsg = [
                    '<div class="norTips">',
                        '<span class="norTipsIco">',
                            '<i class="i_warn"></i>',
                        '</span>',
                        '<dl class="norTipsContent">',
                            isPublic && isShare ? '<dt class="norTipsLine">您确认删除这个已公开、已共享的日历吗？</dt>' : isPublic ? '<dt class="norTipsLine">您确认删除这个已公开的日历吗？</dt>' : isShare ? '<dt class="norTipsLine">您确认删除这个已共享的日历吗？</dt>' : '确定删除吗？',
                            isPublic && isShare ? '<dt class="norTipsLine">此操作会使其他用户无法查看日历下的所有活动。</dt>' : isPublic ? '<dt class="norTipsLine">此操作会使已订阅的用户无法查看日历下的所有活动。</dt>' : isShare ? '<dt class="norTipsLine">此操作会使已共享的用户无法查看日历下的所有活动</dt>' : '',
                            isPublic && isShare ? '<dd class="norTipsLine  mt_10"><input type="checkbox" name="isNotify" /><label for="">&nbsp;同时向日历共享人员发送共享取消通知</label></dd>' : isShare ? '<dd class="norTipsLine  mt_10"><input type="checkbox" name="isNotify" />&nbsp;同时向日历共享人员发送共享取消通知</dd>' : '',
                        '</dl>',
                    '</div>'
                ].join('');
                var showDialog = top.$Msg.showHTML(pubCalDelMsg, function () {
                    var isNotify = showDialog.$el.find("input[name='isNotify']").attr('checked') ? 1 : 0;
                    that.manage.model.deleteLabel({
                        labelId: labelId,
                        isNotify: isNotify,
                        isDelAllCals: 1
                    }, function (response) {
                        if (response.code === "S_OK") {
                            fnSuccess && fnSuccess();
                            return;
                        }
                        fnError && fnError();
                    }, function () {
                        // failure
                        fnError && fnError();
                    })
                }, {
                    dialogTitle: "删除日历",
                    buttons: ["确定", "取消"]
                });
            } else {
                // 如果两者兼有
                top.$Msg.confirm('确定删除吗？', function () {
                    that.manage.model.deleteLabel({
                        labelId: labelId,
                        isNotify: 0,
                        isDelAllCals: 1 //20140901, 产品说全部删除
                    }, function (response) {
                        if (response.code === "S_OK") {
                            fnSuccess && fnSuccess();
                            return;
                        }
                        fnError && fnError();
                    }, function () {
                        fnError && fnError();
                    })
                }, {
                    dialogTitle: "删除日历",
                    icon: "i_warn"
                });
            }
        },
        // edit
        edit: function () {
            var that = this,
                param = {
                    labelId: that.labelId
                };

            if (that.isBeShared) {
                // 表示别人共享给我的日历, 需要传递"isShared"标记
                $.extend(param, { isShared: true });
            }

            that.master.trigger(that.master.EVENTS.EDIT_LABEL, param);

        },
        getIcon: function () {
            var isPublic = this.isPublic,
                isShare = this.isShare,
                isBeShared = this.isBeShared;

            if (isPublic && isShare) {
                return '<a id="user_both_public" href="javascript:;" isShare="true" class="status1"><i class="i_share ml_10" title="指定联系人可见"></i></a>'
                    + '<a id="user_both_share" href="javascript:;" isPublic="true" class="status2"><i class="i_public ml_10" title="所有人可见"></i></a>';
            } else if (isPublic) {
                return '<a id="user_public" href="javascript:;" isPublic="true"><i class="i_public ml_10" title="所有人可见"></i></a>';
            } else if (isShare) {
                return '<a id="user_share" href="javascript:;" isShare="true"><i class="i_share ml_10" title="指定联系人可见"></i></a>';
            } else if (isBeShared) {
                // 别人共享给自己的
                return "";
            } else {
                // 私密日历
                return '<i class="i_secret ml_10" title="仅自己可见"></i>';
            }
        },
        // 点击图标时触发事件
        popDetailInfo: function (e) {
            var clickShare = $(e.currentTarget).attr("isShare"),  //点击的是共享图标
                clickPublic = $(e.currentTarget).attr("isPublic"),  //点击的是公开图标
                shareAcceptCount = Number(this.mymodel.shareAcceptCount),
                shareRefuseCount = Number(this.mymodel.shareRefuseCount),
                shareNoFeedbackCount = Number(this.mymodel.shareNoFeedbackCount),
                subscribeCount = Number(this.mymodel.subscribeCount),
                shareTotalCount = shareAcceptCount + shareRefuseCount + shareNoFeedbackCount;

            var popSharedHtml = [
                '<div class="norTipsContent">此日历已共享给' + shareTotalCount + '人，其中：</div>',
                '<div class="norTipsContent">' + shareAcceptCount + ' 人已接受</div>',
                '<div class="norTipsContent">' + shareRefuseCount + ' 人已谢绝</div>',
                '<div class="norTipsContent">' + shareNoFeedbackCount + ' 人未处理</div>',
                '<div class="diamond tipsTop" name="popup_arrow" style="left: 25px;"></div>'
            ].join('');
            var popPublicHtml = ['<div class="norTipsContent">此公开日历已有人' + subscribeCount + '人订阅</div>'].join('');
            M139.UI.Popup.close('shareOrPublicPop');    //保证有且只显示一个弹出框
            M139.UI.Popup.create({
                name: 'shareOrPublicPop',
                width: 230,
                target: $(e.currentTarget),
                buttons: [{
                    text: "关闭",
                    cssClass: "btnNormal",
                    click: function () {
                        M139.UI.Popup.close('shareOrPublicPop');
                    }
                }],
                content: clickShare ? popSharedHtml : (clickPublic ? popPublicHtml : '')
            }).render();
        }
    }));
})(jQuery, _, M139, window._top || window.top);

// "订阅日历"模板
(function ($, _, M139, top) {
    var className = "M2012.Calendar.View.Subscribe";

    M139.namespace(className, Backbone.View.extend({
        name: className,
        logger: new M139.Logger({ name: className }),
        tagName: "tr",
        template: ['<td class="td1">',
                        '<div class="mangCalTit clearfix" title="<%-labelName %>">',
                            '<span class="ad-tagt mt_2" style="background-color:<%-color %>;"></span>',
                            '<span class="ad-tagtCon"><%-labelName %></span>',
                        '</div>',
                     '</td>',
                     '<td class="td2"><%-calendarCount %></td>',
                     '<td class="td4">',
                         '<a href="javascript:;" id="subscribe_set">设置</a>',
                         '<span class="gray"> | </span>',
                         '<a href="javascript:;" id="subscribe_unsubscribe">退订</a>',
                     '</td>'
        ].join(""),
        events: {
            "click #subscribe_set": "set",
            "click #subscribe_unsubscribe": "unSubscribe"
        },
        initialize: function (args) {
            this.manage = args.manage;
            this.master = this.manage.master;
            // model.destroy时触发事件
            this.listenTo(this.model, 'destroy', this.remove);
        },
        // render view
        render: function () {
            var that = this,
                template = _.template(that.template);
            that.$el.html(template(that.model.toJSON()));
            return that;
        },
        set: function () {
            var that = this,
                model = that.model.toJSON(),
                isOffical = model.isOffical,
                labelId = model.labelId;
            if (isOffical) {
                // 后台发布的日历, 直接弹出日历详情框
                top.$Evocation.openSubsCalendar({
                    labelId: labelId,
                    containerHeight: that.manage.getElement("container").height(), // 弹出窗口的高度跟外层窗口的高度有关系
                    isOffical: true,
                    subscribe: function () {
                        // "保存"订阅信息成功之后的回调
                    },
                    unsubscribe: function () {
                        // 退订成功后的回调,清除表格中的数据
                        // 更新左侧栏数据
                        that.master.trigger(that.master.EVENTS.LABEL_REMOVE, { seqNo: labelId });
                        // 更新表格数据
                        that.model.destroy();
                        // 如果数目为0, 则将整个表格隐藏
                        that.manage.trigger("subscribeLabelNum", that.manage.subscribeCollection.length);
                    }
                });
            } else {
                // 好友发布的公共日历, 跳转到查看日历页面
                that.master.trigger(that.master.EVENTS.EDIT_LABEL, {
                    labelId: labelId,
                    isSubscribed: true
                });
            }
        },
        // edit
        unSubscribe: function () {
            var that = this,
                labelId = that.model.toJSON().labelId;
            top.$Msg.confirm('退订后您将不能查看该日历中的活动，你是否确定退订？', function () {
                that.manage.model.cancelSubscribeLabel({
                    labelId: labelId
                }, function (response) {
                    if (response.code === 'S_OK') {
                        // success
                        top.M139.UI.TipMessage.show('退订成功', { delay: 3000 });
                        // 更新左侧栏数据
                        that.master.trigger(that.master.EVENTS.LABEL_REMOVE, { seqNo: labelId });
                        // 更新表格数据
                        that.model.destroy();
                        // 如果数目为0, 则将整个表格隐藏
                        that.manage.trigger("subscribeLabelNum", that.manage.subscribeCollection.length);
                        return;
                    }
                    top.M139.UI.TipMessage.show('操作失败，请稍后重试', { delay: 3000, className: "msgRed" });

                }, function () {
                    // failure
                    // 如果退订已经退订的日历, 重新刷新界面
                    that.master.trigger(that.master.EVENTS.NAVIGATE, { path: "view/update" });
                    top.M139.UI.TipMessage.show('操作失败，请稍后重试', { delay: 3000, className: "msgRed" });
                });
            },
                {
                    dialogTitle: "退订日历",
                    icon: "warn"
                });
        }

    }));
})(jQuery, _, M139, window._top || window.top);

// "qunzu日历"模板
(function ($, _, M139, top) {
    var className = "M2012.Calendar.View.Group";

    M139.namespace(className, Backbone.View.extend({
        name: className,
        logger: new M139.Logger({ name: className }),
        tagName: "tr",
        template: ['<td class="td1">',
                        '<div class="mangCalTit clearfix" title="<%-labelName %>">',
                            '<span class="ad-tagt mt_2" style="background-color:<%-color %>;"></span>',
                            '<span class="ad-tagtCon"><%-labelName %></span>',
                        '</div>',
                     '</td>',
                     '<td class="td2"><%-calendarCount %></td>',
                     '<td class="td4">',
                         '<a href="javascript:;" id="group_edit">编辑</a>',
                         '<span class="gray"> | </span>',
                         '<a href="javascript:;" id="group_delete">删除</a>',
                     '</td>'
        ].join(""),
        templateDelete: '<dt class="norTipsLine">您确认删除该日历吗？<br />此操作会使成员无法查看日历下的所有活动</dt><dd class="norTipsLine"> <input id="cal_del_group_label" type="checkbox" name=""> <label for="cal_del_group_label">同时向群成员发送群日历取消通知</label></dd>',
        events: {
            "click #group_edit": "edit",
            "click #group_delete": "destroy"
        },
        initialize: function (args) {
            this.manage = args.manage;
            this.master = this.manage.master;
            // model.destroy时触发事件
            this.listenTo(this.model, 'destroy', this.remove);
        },
        // render view
        render: function () {
            var that = this,
                template = _.template(that.template);
            that.$el.html(template(that.model.toJSON()));
            return that;
        },
        // remove the element
        /**
         * 删除自己创建的日历
         */
        destroy: function () {
            var that = this,
                labelId = that.model.get("seqNo");

            // 删除操作成功之后的回调函数
            var fnSuccess = function () {
                top.M139.UI.TipMessage.show('删除成功', { delay: 3000 });
                // 清除表格中的数据
                that.model.destroy();
                // 删除日历之后,需要通知master更新左侧视图
                that.master.trigger(that.master.EVENTS.LABEL_REMOVE, { seqNo: labelId });
                // 如果数目为0, 则将整个表格隐藏
                that.manage.trigger("groupLabelNum", that.manage.groupCollection.length);
            };

            // 删除操作失败之后的回调函数
            var fnError = function () {
                top.M139.UI.TipMessage.show('系统繁忙，请稍后重试', { delay: 3000, className: "msgRed" });
            };

            var isOwner = that.model.get("isOwner");
            var msg = '确定删除吗？';
            if (isOwner) {
                //自己创建的群日历
                msg = that.templateDelete;
            }

            var msgDialog = top.$Msg.confirm(msg, function () {
                var isNotify = Number(!!msgDialog.$el.find('#cal_del_group_label').attr('checked')); //1,通知  0,不通知

                that.manage.model.deleteGroupLable({
                    labelId: labelId,
                    isNotify: isNotify,
                    isOwner: isOwner,
                    isDelAllCals: 1 //20140901, 产品说全部删除
                }, function (response) {
                    if (response.code === "S_OK") {
                        fnSuccess && fnSuccess();
                        return;
                    }
                    fnError && fnError();
                }, function () {
                    fnError && fnError();
                })
            }, {
                dialogTitle: "删除日历",
                isHtml: true,
                icon: "i_warn"
            });

            //// 如果两者兼有
            //top.$Msg.confirm('确定删除吗？', function () {
            //    that.manage.model.deleteGroupLable({
            //        labelId: labelId,
            //        isNotify: 0,
            //        isOwner: that.model.get("isOwner"),
            //        isDelAllCals: 1 //20140901, 产品说全部删除
            //    }, function (response) {
            //        if (response.code === "S_OK") {
            //            fnSuccess && fnSuccess();
            //            return;
            //        }
            //        fnError && fnError();
            //    }, function () {
            //        fnError && fnError();
            //    })
            //}, {
            //    dialogTitle: "删除日历",
            //    icon: "i_warn"
            //});
        },
        // edit
        edit: function () {
            var that = this,
                param = { labelId: that.model.get("seqNo") };
            if (that.model.get("isOwner")) {
                param.isGroup = true;
            } else {
                //对于不是自己创建的日历走共享流程
                param.isShared = true;
            }
            that.master.trigger(that.master.EVENTS.EDIT_LABEL, param);
        }

    }));
})(jQuery, _, M139, window._top || window.top);
