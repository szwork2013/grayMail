
; (function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var className = "M2012.Calendar.View.Label";

    M139.namespace(className, superClass.extend({

        name: className,
        //当前视图名称
        viewName: "label",
        //视图的父容器
        container: null,
        logger: new M139.Logger({ name: className }),
        //日历视图主控
        master: null,
        //活动数据模型
        model: null,
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
                    self.container.empty();
                    self.model = new M2012.Calendar.Model.Label({
                        master: self.master
                    });
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
                        //编辑模式下才显示删除操作按钮
                        self.getElement("btnDel").removeClass("hide");
                        self.getElement("page_title").text(TIPS.EDIT_LABEL_TITLE);
                    } else {
                        self.getElement("btnDel").addClass("hide");
                        self.getElement("page_title").text(TIPS.ADD_LABEL_TITLE);
                    }

                    //编辑模式下需要显示联系人邀请状态信息
                    self.contactComp && self.contactComp.setData({
                        showStatus: value
                    });
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
                    //监控日历描述信息变化
                else if (self.model.hasChanged("description")) {
                    var value = self.model.get("description");
                    var currentEl = self.getElement("description").val(value);

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
                    //监控日历作者信息变化
                else if (self.model.hasChanged("author")) {
                    var value = self.model.get("author");
                    var currentEl = self.getElement("author").val(value);

                    setTimeout(function () {
                        currentEl.trigger("change");
                        currentEl.trigger("blur");
                    }, 50);
                }
                    //监控是否共享日历标示变化
                else if (self.model.hasChanged("isShare")) {
                    var value = self.model.get("isShare") ? true : false;
                    self.getElement("checkShare")[0].checked = value;

                    if (value) {
                        self.getElement("shareArea").removeClass("hide");
                        return;
                    }
                    self.getElement("shareArea").addClass("hide");
                }
                    //监控是否公开日历标示变化
                else if (self.model.hasChanged("isPublic")) {
                    var value = self.model.get("isPublic") ? true : false;
                    self.getElement("checkPublic")[0].checked = value;

                    if (value) {
                        self.getElement("authorArea").removeClass("hide");
                        return;
                    }
                    self.getElement("authorArea").addClass("hide");
                }
                    //监测共享人信息变化
                else if (self.model.hasChanged("labelShareInfo")) {
                    var value = self.model.get("labelShareInfo");
                    var data = null;

                    if (value && value.length > 0) {
                        data = self.model.transShare2Contact(value);
                    }
                    self.contactComp && self.contactComp.setData({
                        contacts: data
                    });
                }
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
                        //验证地点
                    case "description": targetEl = self.getElement("description");
                        break;
                        //验证作者信息
                    case "author":
                        targetEl = self.getElement("author");
                        break;
                        //验证共享人
                    case "labelShareInfo":
                        targetEl = self.getElement("shareInfo");
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
            $.each([self.getElement("labelName"),
                self.getElement("description"), self.getElement("author")], function () {
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

            //共享日历选项
            self.getElement("checkShare").click(function (e) {
                self.model.set({
                    isShare: this.checked ? 1 : 0
                });
            });
            //公开日历选项
            self.getElement("checkPublic").click(function (e) {
                self.model.set({
                    isPublic: this.checked ? 1 : 0
                });
            });

            //保存
            self.getElement("btnSave").click(function (e) {
                self.save(true);
            });

            self.getElement("btnDel").click(function (e) {
                self.deleteLabel();
            });

            //取消
            self.getElement("btnCancel").click(function (e) {
                self.goBack(false);
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

            $(html).appendTo(self.container);

            //添加日历选择控件
            self.colorComp = new M2012.Calendar.View.Color({
                container: self.getElement("color"),
                onChange: function (args) {
                    if (args && args.color) {
                        self.model.set({
                            color: args.color
                        }, { silent: true });
                    }
                }
            });

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

            //联系人选择控件
            self.contactComp = new M2012.Calendar.View.Contact({
                master: self.master,
                showTitle: false,
                isOnly139: true,
                width: 400,
                container: self.getElement("shareInfo")
            }).on("change", function (args) {
                var data = null;
                if (args && args.length > 0) {
                    data = self.model.transContact2Share(args);
                }
                self.model.set({
                    labelShareInfo: data
                }, { silent: true });
            });

            //设置页面元素相关事件
            self.initPageEvent();

            M139.Dom.setTextAreaAdaptive(self.getElement("labelName"), {
                placeholder: self.model.TIPS.LABEL_NAME_PLACEHOLDER,
                defaultheight: "20px",
                defaultcolor: "#333"
            });

            M139.Dom.setTextAreaAdaptive(self.getElement("description"), {
                placeholder: self.model.TIPS.LABEL_DESC_PLACEHOLDER,
                defaultheight: "50px",
                defaultcolor: "#333"
            });
            M139.Dom.setTextAreaAdaptive(self.getElement("author"), {
                placeholder: self.model.TIPS.LABEL_AUTHOR_PLACEHOLDER,
                defaultheight: "20px",
                defaultcolor: "#333"
            });
            self.adjustHeight();
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
                    top.$App.trigger(self.model.EVENTS.ADD_CAL_SUCCESS, {
                        taskId: taskId
                    });
                }
                //刷新左侧列表
                self.master.trigger(self.master.EVENTS.LABEL_CHANGE);
                self.goBack(true);

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
            var isShare = self.model.get("isShare");
            var isPublic = self.model.get("isPublic");
            var html = [
                '<div class="norTips">',
                    '<span class="norTipsIco">',
                        '<i class="i_warn"></i>',
                    '</span>',
                    '<dl class="norTipsContent">',
                    isShare && isPublic ? '<dt class="norTipsLine">您确认删除这个已公开、已共享的日历吗？</dt>' : isPublic ? '<dt class="norTipsLine">您确认删除这个已公开的日历吗？</dt>' : isShare ? '<dt class="norTipsLine">您确认删除这个已共享的日历吗？</dt>' : '确定删除吗？',
                    isShare && isPublic ? '<dt class="norTipsLine">此操作会使其他用户无法查看日历下的所有活动。</dt>' : isPublic ? '<dt class="norTipsLine">此操作会使已订阅的用户无法查看日历下的所有活动。</dt>' : isShare ? '<dt class="norTipsLine">此操作会使已共享的用户无法查看日历下的所有活动</dt>' : '',
                    isShare && isPublic ? '<dd class="norTipsLine  mt_10"><input type="checkbox" name="isNotify" /><label for="">&nbsp;同时向日历共享人员发送共享取消通知</label></dd>' : isShare ? '<dd class="norTipsLine  mt_10"><input type="checkbox" name="isNotify" />&nbsp;同时向日历共享人员发送共享取消通知</dd>' : '',
                    '</dl>',
                '</div>'].join("");
            var dialogEl = top.$Msg.showHTML(html, function () {
                var isNotify = dialogEl.$el.find("input[name='isNotify']").attr("checked") ? 1 : 0;
                self.model.deleteLabel({
                    isNotify: isNotify
                }, function () {
                    top.M139.UI.TipMessage.show(self.model.TIPS.DELETE_SUCCESS, {
                        delay: 3000
                    });
                    //刷新左侧列表
                    self.master.trigger(self.master.EVENTS.LABEL_CHANGE);
                    self.goBack(true);
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
                            '<h2><span id="{cid}_page_title">创建日历</span><a href="javascript:void(0);" id="{cid}_back" class="back">&lt;&lt;返回</a></h2>',
                        '</div>',
                    '</div>',
                    '<div class="createUl" id="{cid}_maincontent">',
                        '<form>	',
                            '<fieldset class="boxIframeText">',
                             '<legend class="hide">创建日历</legend>',
                            '<ul class="form">',
                               '<li class="mt_10 clearfix formLine">',
                                  '<label class="label">日历名称：</label>',
                                    '<div class="element">',
                                        '<input class="iText" id="{cid}_labelName" maxlength="32" />',
                                    '</div>',
                                '</li>',
                                '<li class="formLine mt_10" >',
                                    '<label class="label">日历说明：</label>',
                                    '<div class="element">',
                                        '<textarea class="iText" id="{cid}_description" maxlength="202" />',
                                    '</div>',
                                '</li>',
                                '<li class="formLine">',
                                    '<label class="label">日历颜色：</label>',
                                    '<div class="element">',
                                        '<div class="createTableInfo" id="{cid}_color">',
                                        '</div>',
                                        '<p class="gray">(设置自定义日历颜色，帮您区分不同日历的活动)</p>',
                                    '</div>',
                                '</li>',
                            '</ul>',
                            '<ul class="form">',
                                '<li class="formLine">',
                                    '<label class="label">&nbsp;</label>',
                                    '<span class="fl mr_10">',
                                        '<input type="checkbox" id="{cid}_checkShare" class="mr_5">',
                                        '<label for="{cid}_checkShare">共享此日历</label>',
                                    '</span>',
                                   '<span class="gray ml_10 fl">(共享日历后，您在该日历下创建的活动也将共享到参与人)</span>',
                                '</li>',
                                '<li class="formLine hide" id="{cid}_shareArea">',
                                   '<label class="label">添加参与人：</label>',
                                   '<div class="element" id="{cid}_shareInfo">',
								   '</div>',
                                '</li>',
                            '</ul>',
                            '<ul class="form">',
                                 '<li class="formLine">',
                                    '<label class="label">&nbsp;</label>',
                                    '<div class="element">',
                                        '<span class="fl mr_10">',
                                            '<input type="checkbox" id="{cid}_checkPublic" class="mr_5">',
                                            '<label for="{cid}_checkPublic">公开此日历</label>',
                                        '</span>',
                                        '<span class="gray ml_10 fl">(公开的日历可以被其他用户通过日历，名称、作者名称或者邮箱地址搜索并订阅)</span>',
                                    '</div>',
                                '</li>',
                                '<li class="formLine hide" id="{cid}_authorArea">',
                                    '<label class="label">日历作者：</label>',
                                    '<div class="element">',
                                        '<input type="text" id="{cid}_author" class="iText" maxlength="38" />',
								    '</div>',
                                '</li>',
                                '<li class="formLine" id="{cid}_identity" style="display:none;height:20px;">',
							    '</li>',
                            '</ul>',
                            '<div class="createBottom" style="position:relative">',
                                '<div id="{cid}_mask" style="position:absolute; top:0px; height:43px; z-index:1000;" class="blackbanner hide"></div>',
                                '<a href="javascript:void(0);" class="btnSetG" hidefocus id="{cid}_btnSave" role="button"><span>保 存</span></a>',
                                '<a href="javascript:void(0);" class="btnSet  ml_5 hide" hidefocus id="{cid}_btnDel" role="button"><span>删 除</span></a>',
                                '<a href="javascript:void(0);" class="btnSet ml_5" hidefocus id="{cid}_btnCancel" role="button"><span>取 消</span></a>',
                            '</div>',
                            '</fieldset> ',
                        '</form>',
                    '</div>',
                '</div>',
             '</div>    ',
         '</div>'].join("")
        }

    }));

    $(function () {
        var activity = new M2012.Calendar.View.Label({
            master: window.$Cal
        });
    });

})(jQuery, _, M139, window._top || window.top);
