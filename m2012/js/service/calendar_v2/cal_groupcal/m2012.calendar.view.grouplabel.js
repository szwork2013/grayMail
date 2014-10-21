
; (function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var className = "M2012.Calendar.View.GroupLabel";

    M139.namespace(className, superClass.extend({

        name: className,
        //当前视图名称
        viewName: "grouplabel",
        //视图的父容器
        container: null,
        logger: new M139.Logger({ name: className }),
        //日历视图主控
        master: null,
        //活动数据模型
        model: null,
        //活动项（活动控件集合）
        actItems: [],
        //活动最大条数
        actItemsLimit: 10,
        /**
         * 添加、编辑活动详情
         * 要创建（编辑）详细活动请通过master调用：
           @example 
             创建： self.master.trigger(self.master.EVENTS.ADD_LABEL);
             编辑： self.master.trigger(self.master.EVENTS.EDIT_LABEL,{seqNo:12345,type:0});
         */
        initialize: function (args) {
            var self = this;
            args = args || {};
            self.master = args.master;

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
                if (args.name === self.viewName) {
                    self.master.capi.addBehavior("cal_add_group_label_click");
                    self.container.empty();
                    self.model = new M2012.Calendar.Model.GroupLabel({
                        master: self.master
                    });
                    self.actItems = [];
                    self.initEvents();
                    self.render();
                    // 初始化页面数据
                    self.initData();
                }
            });
        },

        /**
         * 初始化页面数据
        **/
        initData: function () {
            var self = this;
            self.model.trigger(self.model.EVENTS.DATA_INIT);
        },

        /**
         * 注册事件监听
        **/
        initEvents: function () {
            var self = this;

            //监控model数据变化实时同步数据到UI
            self.model.on("change", function () {

                //导航标题显示 添加日历、编辑日历
                if (self.model.hasChanged("isEditMode")) {

                    var TIPS = self.model.TIPS;
                    var value = self.model.get("isEditMode");
                    if (value) {
                        self.getElement("page_title").text(TIPS.EDIT_LABEL_TITLE);
                        //编辑模式下才显示删除操作按钮
                        self.getElement("btnDel").removeClass("hide");
                        //编辑模式展示编辑信息录入区域
                        self.getElement("editLableArea").removeClass("hide");
                        self.getElement("addLableArea").addClass("hide");
                        return;
                    }
                    self.getElement("page_title").text(TIPS.ADD_LABEL_TITLE);
                    self.getElement("btnDel").addClass("hide");
                    //新增模式展示新增信息录入区域
                    self.getElement("addLableArea").removeClass("hide");
                    self.getElement("editLableArea").addClass("hide");

                }
                    //监控日历标签名称变化
                else if (self.model.hasChanged("labelName")) {
                    var value = self.model.get("labelName");
                    var currentEl = self.getElement("labelName").val(value);

                    setTimeout(function () {
                        currentEl.trigger("change");
                        currentEl.trigger("blur");
                    }, 50);
                }
                    //监控颜色值变化
                else if (self.model.hasChanged("color")) {
                    var value = self.model.get("color");
                    self.colorComp && self.colorComp.trigger("init", {
                        color: value
                    });
                }
                    //监测共享人信息变化
                else if (self.model.hasChanged("labelShareInfo")) {
                    var value = self.model.get("labelShareInfo");
                    var data = null;

                    if (value && value.length > 0) {
                        data = self.model.transShare2Contact(value);
                    }
                    // 显示参与人列表
                    var template = _.template(self.template.UserItem);
                    self.getElement("editLableArea").html(template(data));
                }
                    //判断活动项条数是否已满（10个）
                else if (self.model.hasChanged("calendarIsOver")) {
                    if (self.model.get("calendarIsOver")) {
                        self.getElement("btnAddMore").addClass("hide");
                        return;
                    }
                    self.getElement("btnAddMore").removeClass("hide");
                }
            });

            // 获取活动项数据
            self.model.on(self.model.EVENTS.GET_ACTIVITY_DATA, function (args) {
                if (self.actItems.length > 0) {
                    var items = [];
                    for (var i = 0; i < self.actItems.length; i++) {
                        var item = self.actItems[i].getData();
                        //判断活动是否验证失败
                        if (!item.validate) {
                            var el = self.actItems[i].$el;
                            var container = self.getElement("maincontent");
                            var scrollTop = container.scrollTop() - 50; //去掉顶部和日历下拉的高度
                            container.animate({ "scrollTop": scrollTop + el.offset().top }, 100); //滚起!!!
                            args && args.onVaild(false);
                            return;
                        }
                        if (item.data) {
                            //需要扩展下参数值，需求规定是整点提醒
                            items.push($.extend(item.data, {
                                beforeTime: 0,
                                beforeType: 0
                            }));
                        }
                    }
                    //验证成功后才将数据提交到后端
                    self.model.set({ calendars: items }, { silent: true });
                }
                args && args.onVaild(true);
            });

            // 监控数据校验结果并实时呈现错误信息
            self.model.on(self.model.EVENTS.VALIDATE_FAILED, function (args) {
                if (!args || !args.target || !args.message)
                    return;

                var targetEl = null;
                switch (args.target) {
                    //验证主题
                    case "labelName": targetEl = self.getElement("labelName");
                        break;
                        //验证共享人
                    case "labelShareInfo":
                        targetEl = self.getElement("contactArea");
                        break;
                        //看是否超过允许添加的最大自定义标签数
                    case "labelLimit":
                        top.$Msg.alert(args.message, { icon: "warn" });
                        break;
                }
                if (targetEl && targetEl.length > 0) {
                    //将滚动条滚动到顶部
                    // if (targetEl.offset().top < 0) {
                    self.getElement("maincontent")[0].scrollTop = 0;
                    //}
                    window.setTimeout(function () {
                        M2012.Calendar.View.ValidateTip.show(args.message, targetEl);
                    }, 100);
                }

            });

            //监控操作提示信息
            self.model.on(self.model.EVENTS.TIP_SHOW, function (args) {
                if (!args) {
                    top.M139.UI.TipMessage.hide();
                    return;
                }
                var params = args.params || {};
                top.M139.UI.TipMessage.show(args.message, params);
            });

        },

        /**
         *  设置页面Html元素事件
         **/
        initPageEvent: function () {
            var self = this;
            //日历名称、说明内容变化实时同步到model
            $.each([self.getElement("labelName")], function () {
                var el = this;
                //控件值发生变化后传递到后端
                el.change(function () {
                    var data = {};
                    var key = this.id.split("_")[1];
                    data[key] = $.trim(this.value);
                    self.model.set(data, {
                        validate: false,//日历名称需要校验是否重复
                        target: key
                    });
                });

                //增加实时检测字数功能
                self.checkInputWords(el, Number(el.attr("maxlength")) - 2);
            });

            //返回
            self.getElement("back").click(function (e) {
                $(document.body).click();
                self.goBack(false);
            });

            self.getElement("btnAddMore").click(function (e) {
                self.master.capi.addBehavior("cal_group_addmore_activity_click");
                self.addActItem();
            });

            //保存
            self.getElement("btnSave").click(function (e) {
                self.save(true);
            });

            //删除
            self.getElement("btnDel").click(function (e) {
                self.deleteLabel();
            });

            //取消
            self.getElement("btnCancel").click(function (e) {
                self.goBack(false);
            });
        },

        /**
         *  添加一个活动项
        **/
        addActItem: function () {
            var self = this;
            var item = new M2012.Calendar.View.GroupActivityItem({
                container: self.getElement("activityArea")
            });
            item.on("change:close", function (cid) {
                for (var i = 0; i < self.actItems.length; i++) {
                    if (self.actItems[i].cid === cid) {
                        self.actItems.splice(i, 1);
                        break;
                    }
                }
                //更新活动超限标记
                self.model.set({ calendarIsOver: false });
            })
            self.actItems.push(item);
            //更新活动超限标记
            self.model.set({ calendarIsOver: self.actItems.length >= self.actItemsLimit });
            self.adjustHeight();
        },

        /**
         *  呈现视图
        **/
        render: function () {
            var self = this;
            var html = $T.format(self.template.Content, {
                cid: self.cid
            });

            $(html).appendTo(self.container);

            //添加日历选择控件
            self.colorComp = new M2012.Calendar.View.ColorMenu({
                container: self.getElement("labelArea"),
                onChange: function (args) {
                    if (args && args.color) {
                        self.model.set({
                            color: args.color
                        }, { silent: true });
                    }
                }
            });
            ////联系人选择控件
            self.contactComp = new M2012.Calendar.View.Contact({
                container: self.getElement("contactArea"),
                master: self.master,
                showTitle: false,
                showFreeInfo: false,
                isOnly139: true,
                placeHolder: self.model.TIPS.CONTACT_PLACEHOLDER,
                width: 602

            }).on("change", function (args) {
                var data = null;
                if (args && args.length > 0) {
                    data = self.model.transContact2Share(args);
                }
                self.model.set({
                    labelShareInfo: data
                }, { silent: true });
            });

            //添加一个活动项
            self.addActItem();

            //验证码控件
            self.identifyComp = new M2012.Calendar.View.Identify({
                wrap: self.cid + '_identity',
                name: 'identity',
                titleName: '验证码',
                onChange: function (val) {
                    self.model.set({
                        validImg: val || ""
                    }, { silent: true });
                }
            });
            self.identifyComp.inputEl.width(114);
            self.identifyComp.validateImgEl.width("auto");

            //设置页面元素相关事件
            self.initPageEvent();

            M139.Dom.setTextAreaAdaptive(self.getElement("labelName"), {
                placeholder: self.model.TIPS.LABEL_NAME_PLACEHOLDER,
                defaultheight: "20px",
                defaultcolor: "#000000"
            });

        },

        /**
         * 设置页面高度
        **/
        adjustHeight: function () {
            var self = this;
            var container = self.getElement("maincontent");
            var bodyHeight = $("body").height();
            var top = container.offset().top;
            container[0].style.overflowY = 'auto';
            container.height(bodyHeight - top);
        },

        /**
         * 实时检测输入字符长度
         * @param {jQuery Object}  inputEl     //输入框元素
         * @param {Number}         maxLength   //允许输入字符的最大长度
        **/
        checkInputWords: function (inputEl, maxLength) {
            var self = this;
            inputEl.unbind("keyup parse").bind("keyup parse", function (e) {
                var value = $.trim(inputEl.val());
                if (value.length > maxLength) {
                    inputEl.val(value.slice(0, maxLength));
                    var key = inputEl.attr("id").split("_")[1];

                    //更新数据到model
                    var data = {};
                    data[key] = $.trim(inputEl.val());
                    self.model.set(data, {
                        silent: true,
                        validate: false
                    });

                    //界面展示tips提示
                    self.model.trigger(self.model.EVENTS.VALIDATE_FAILED, {
                        target: key,
                        message: $T.format(self.model.TIPS.MAX_LENGTH, [maxLength])
                    });
                }
            });
        },

        /**
         *  提交数据到服务器
       **/
        save: function (validate) {
            var self = this;
            //判断自定义标签个数是否超限
            var labelLimit = self.model.get("labelLimit");
            var userLables = self.master.get("labelData") || {};
            userLables = userLables.userLabels || [];
            if (userLables.length > labelLimit) {
                self.model.trigger(self.model.EVENTS.VALIDATE_FAILED, {
                    target: "labelLimit",
                    message: $T.format(self.model.TIPS.USER_LABEL_LIMIT, [labelLimit])
                });
                return;
            }

            self.model.set({ isNotify: 0 }, {
                silent: true
            });
            //编辑活动
            if (self.model.get("isEditMode")) {
                //发送活动更新通知
                if (self.model.get("hasDefShareInfo")) {
                    top.$Msg.confirm(self.model.TIPS.SHARE_NOTIFY, function () {
                        self.model.set({
                            isNotify: 1
                        }, { silent: true });
                        self.saveData(validate);
                    }, function () {
                        self.saveData(validate);
                    }, { buttons: ["是", "否"] });
                    return;
                }
            }

            //新增活动
            self.saveData(validate);
        },

        /**
        * 保存数据到服务端
        * @param {Boolean}  validate     //是否验证输入数据
       **/
        saveData: function (validate) {
            var self = this;
            var mask = self.getElement("mask");
            //先遮挡住操作按钮
            mask.removeClass("hide");
            self.model.save(function () {
                top.M139.UI.TipMessage.show(self.model.TIPS.OPERATE_SUCCESS, {
                    delay: 3000
                });
                mask.addClass("hide");

                //如果是外部模块调用我们日历
                //则添加成功后需要通知对方
                var taskId = self.model.get("taskId");
                if (taskId) {
                    top.$App.trigger(self.model.EVENTS.ADD_GROUPLABEL_SUCCESS, {
                        taskId: taskId
                    });
                }
                //刷新左侧列表
                self.master.trigger(self.master.EVENTS.LABEL_CHANGE, {
                    onrender: function () {
                        self.goBack(true);
                    }
                });

            }, function (msg, result) {
                msg = msg || self.model.EVENTS.OPERATE_ERROR;
                var identify = false;

                //先检测下错误是否与验证码相关
                if (result && result.errorCode) {
                    //如果与验证码相关
                    if (self.identifyComp.handerError(result.errorCode)) {
                        self.showIdentify(self.identifyComp.isVisible());
                        identify = true;
                    }
                }
                if (!identify) {
                    msg = self.master.capi.getUnknownExceptionInfo(result.errorCode);
                    msg = msg || self.model.TIPS.OPERATE_ERROR;
                    top.M139.UI.TipMessage.show(msg, {
                        delay: 3000,
                        className: "msgRed"
                    });
                }
                mask.addClass("hide");

            }, function () {
                mask.addClass("hide");

            }, validate);
        },

        /**
       *  删除数据
      **/
        deleteLabel: function () {
            var self = this;
            var mask = self.getElement("mask");
            var dialogEl = top.$Msg.showHTML(self.template.DeleteInfo, function () {
                var isNotify = dialogEl.$el.find("input[name='isNotify']").attr("checked") ? 1 : 0;
                self.model.deleteLabel({
                    isNotify: isNotify
                }, function () {
                    top.M139.UI.TipMessage.show(self.model.TIPS.DELETE_SUCCESS, {
                        delay: 3000
                    });
                    //刷新左侧列表
                    self.master.trigger(self.master.EVENTS.LABEL_CHANGE, {
                        onrender: function () {
                            self.goBack(true);
                        }
                    });
                }, function () {
                    top.M139.UI.TipMessage.show(self.model.TIPS.OPERATE_ERROR, {
                        delay: 3000,
                        className: "msgRed"
                    });
                    mask.addClass("hide");
                });
            }, {
                dialogTitle: "删除日历",
                buttons: ["确定", "取消"]
            });

        },

        /**
         * 返回
         */
        goBack: function (isRefresh) {
            var self = this;
            var master = self.master;
            master.trigger(master.EVENTS.NAVIGATE, {
                path: "view/back"
            }, { isRefresh: isRefresh });
        },

        /**
       *  显示验证码
       */
        showIdentify: function (visible) {
            var self = this;
            var el = self.getElement("identity");
            //如果前后状态一致则无需调整弹出框位置
            if (el.is(":visible") == visible) {
                return;
            }
            visible ? el.show() : el.hide();
        },

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
            Content: ['<div class="outArticle">',
             '<div class="outArticleMain" style="margin:0px;">',
                 '<div class="createCon">',
                    '<div class="bgPadding">',
                        '<div class="createTop tabTitle">',
                            '<h2><span id="{cid}_page_title">创建群日历</span><a href="javascript:void(0);" id="{cid}_back" class="back">&lt;&lt;返回</a></h2>',
                        '</div>',
                    '</div>',
                    '<div class="createUl" id="{cid}_maincontent">',
                        '<div class="createChoose clearfix">',
						    '<div style="width:600px;" class="dropDown dropDown-mytag" id="{cid}_labelArea">',
                                '<div class="dropDownText">',
						            '<input type="text" class="text" maxlength="32" id="{cid}_labelName">',
							    '</div>',
                            '</div>',
                            '<div id="{cid}_addLableArea">',
                                '<div class="addPeopleNew" id="{cid}_contactArea">',
                                '</div>',
                                '<div id="{cid}_activityArea">',
                                '</div>',
                                '<a class="btnNormal btnNormalNew" href="javascript:void(0);" id="{cid}_btnAddMore" >',
                                    '<span>+ 添加更多活动</span>',
                                '</a>',
                            '</div>',
                            '<div id="{cid}_editLableArea" class="hide">',
                            '</div>',
                            '<div id="{cid}_identity" style="display:none;height:20px;">',
							'</div>',
                        '</div>',
                        '<div class="createChoose_mt" style="position:relative">',
                            '<div id="{cid}_mask" style="position:absolute; top:0px; height:43px; z-index:1000;" class="blackbanner hide"></div>',
                            '<a href="javascript:void(0);" class="btnSetG" hidefocus id="{cid}_btnSave" role="button"><span>保 存</span></a>',
                            '<a href="javascript:void(0);" class="btnSet  ml_5 hide" hidefocus id="{cid}_btnDel" role="button"><span>删 除</span></a>',
                            '<a href="javascript:void(0);" class="btnSet ml_5" hidefocus id="{cid}_btnCancel" role="button"><span>取 消</span></a>',
                        '</div>',
                    '</div>',
                '</div>',
             '</div>    ',
         '</div>'].join(""),
            UserItem: [
                '<table class="createTableList createTableListOther mt_10" style="width:602px;">',
                    '<thead>',
                        '<tr>',
                            '<th width="500" class="createThFirst">群组成员</th>',
                            '<th class="tac">状态 </th>',
				        '</tr>',
				    '</thead>',
				    '<tbody>',
                        '<% _.each(obj, function(i){ %>',
					    '<tr>',
						    '<td class="createThFirst"><%-i.recEmail%></td>',
						    '<td class="tac green"><%=i.statusDesc%></td>',
					    '</tr>',
                        '<% }) %>',
			        '</tbody>',
			    '</table>'].join(""),
            DeleteInfo: [
                '<div class="norTips">',
                    '<span class="norTipsIco">',
                        '<i class="i_warn"></i>',
                    '</span>',
                    '<dl class="norTipsContent">',
                        '<dt class="norTipsLine">您确认删除该日历吗？<br />此操作会使成员无法查看日历下的所有活动</dt>',
                        '<dd class="norTipsLine  mt_10"><input type="checkbox" name="isNotify" /><label for="">&nbsp;同时向群成员发送群日历取消通知</label></dd>',
                    '</dl>',
                '</div>'
            ].join("")
        }

    }));

    $(function () {
        var activity = new M2012.Calendar.View.GroupLabel({
            master: window.$Cal
        });
    });

})(jQuery, _, M139, window._top || window.top);
