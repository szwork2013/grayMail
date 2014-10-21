;
(function ($, _, M139, top) {
    var _super = M139.View.ViewBase,
        _class = "M2012.Calendar.View.CalendarAddPopup",
        Validate = M2012.Calendar.View.ValidateTip,
        commonAPI = M2012.Calendar.CommonAPI.getInstance();

    M139.namespace(_class, _super.extend({
        name: _class,
        template: {
            COLORS: ['<div class="repeattips-box" id="{cid}_outer">',
                '<p class="tac mt_15"><img src="../../images/module/calendar2.0/pic_02.jpg"></p>',
                '<div class="pt_20 repeattips-bottom clearfix" style="z-index:1000;">',
                    '<span class="numFour">日历名称：</span>',
                    '<div class="inputSelect clearfix fl">',
                       '<div id="{cid}_tip" style="left: 60px; top: -15px; display: none;" class="tips">',
                            '<div class="tips-text"></div>',
                            '<div class="tipsBottom  diamond"></div>',
                        '</div>',
                        '<input type="text" class="iText" id="{cid}_labelName">',
                        '<div class="inputSelect_color">',
                            '<a href="javascript:void(0);" class="dropDownA" id="{cid}_colorLink"><span class="theme-i" style="background-color: #90cf61;" data-value="#90cf61"><i class="i_xgg"></i></span><i class="i_triangle_d"></i></a>',
                            '<div class="inputSelect_box" style="display:none;" id="{cid}_colorSelect">',
                                '<ul class="clearfix">',
                                    '<li role="option"><span class="theme-i" style="background-color: #90cf61;" data-value="#90cf61"><i class="i_xgg" style="display:block;"></i></span></li>',
                                    '<li role="option"><span class="theme-i" style="background-color: #a5a5f0;" data-value="#a5a5f0"><i class="i_xgg"></i></span></li>',
                                    '<li role="option"><span class="theme-i" style="background-color: #fcc44d;" data-value="#f2b73a"><i class="i_xgg"></i></span></li>',
                                    '<li role="option"><span class="theme-i" style="background-color: #f399d5;" data-value="#ea8fcc"><i class="i_xgg"></i></span></li>',
                                    '<li role="option"><span class="theme-i" style="background-color: #93cbee;" data-value="#80bce1"><i class="i_xgg"></i></span></li>',
                                    '<li role="option"><span class="theme-i" style="background-color: #ef7f7f;" data-value="#ef7f7f"><i class="i_xgg"></i></span></li>',
                                    '<li role="option"><span class="theme-i" style="background-color: #afbecf;" data-value="#9eb4cd"><i class="i_xgg"></i></span></li>',
                                    '<li role="option"><span class="theme-i" style="background-color: #7fdada;" data-value="#69d1d1"><i class="i_xgg"></i></span></li>',
                                    '<li role="option"><span class="theme-i" style="background-color: #5eabf3;" data-value="#5eabf3"><i class="i_xgg"></i></span></li>',
                                    '<li role="option"><span class="theme-i" style="background-color: #ffb089;" data-value="#ffa77c"><i class="i_xgg"></i></span></li>',
                                 '</ul>',
                            '</div>',
                        '</div>',
                    '</div>',
                 '</div>',
                 '<div class="pt_20 repeattips-bottom clearfix">',
                     '<span class="numFour">添加参与人：</span> ',
                     '<div class="addPeople addPeopleOther" style="width:240px;">',
                         '<div id="{cid}_invite_input_container"></div>',
                         '<a id="{cid}_select_addr_link" href="javascript:void(0);" title="选择联系人" class="i_peo" style="z-index:4;"></a>',
                        // '<input class="iText" type=text> <a href="#"></a>',//
                     '</div>',
                 '</div>',
                '<div id="{cid}_invite_list_container" class="addPeopleMain"></div>', // 展开的联系人列表
            '</div>'
            ].join(""),
            DialogTitle: "新建日历"
        },
        showMaskContent : '<div style="position:absolute; top:0px; height:37px; width:100%; z-index:1000;" class="blackbanner"></div>',
        events : { // TODO 如何给document绑定事件
            "click .inputSelect_box li" : "chooseColor", // 勾选框
            "click .inputSelect_color" : "toggleColor",  // 颜色选择器
            "click #btn_save" : "save", // 保存按钮
            "click #btn_cancel" : "cancel", // 取消按钮
            //"click #btn_edit" : "edit", // "编辑详细链接"
             "change .iText" : "hideTip",
            //"keyup .iText" : "validate",
            //"keydown .iText" : "validate",
            "focus .iText" : "hideTip"
        },
        config : {
            MAX_ADDR_SELECT: 20,
            MSG_INVITE_MAX: '邀请人数已达到上限 {max} 人'
        },
        logger : new top.M139.Logger({
            name : "M2012.Calendar.View.MyCalendar"
        }),
        initialize: function (options) {
            options = options || {};
            options.master = window.$Cal;
            this.master = options.master;
            this.render(options);
            // 设置作用域,必须使用,不然无法通过backbone的方式绑定事件
            this.$el = this.dialog.$el;
            this.model = new M2012.Calendar.Model.CalendarAddPopup(options);
            //this.replaceButtons();
            this.defineElement();
            this.bindEvent();
        },
        defineElement : function () {
            var that = this;
            this.tipDomEl = this.$el.find("#" + this.cid + "_tip");
            this.labelNameEl = this.$el.find("#" + this.cid + "_labelName");
            this.colorLinkEl = this.$el.find("#" + this.cid + "_colorLink");
            this.outerEl = this.$el.find("#" + this.cid + "_outer");
            this.colorSelectEl = this.$el.find("#" + this.cid + "_colorSelect");
            // 设置初始值,点击"编辑按钮"时不需要对数据进行校验
            this.model.set("color", "#90cf61");
            this.model.set("labelName", {value : ''});
            this.dialog.inviteInputContainer = this.dialog.$el.find("#" + this.cid + "_invite_input_container");
            this.dialog.inviteListContainer = this.dialog.$el.find("#" + this.cid + "_invite_list_container");
            this.dialog.selectAddrLink = this.dialog.$el.find("#" + this.cid + "_select_addr_link");
            this.dialog.btnEl = this.dialog.$el.find("div .boxIframeBtn").css("position", "relative");

            //同时邀请别人
            this.invites = new M2012.Calendar.UI.Invite.View({
                target: this.dialog.inviteListContainer,
                input: this.dialog.inviteInputContainer
            });
            this.invites.model.on("change:hideScroll", function (args) {
                // 如果联系人列表为空时会触发该方法,m2012.calendar.ui.invite.view.js
                // todo 暂时先这么修改,有可能多次触发
                if (that.outerEl.hasClass("repeattips-boxScroll")) {
                    // 如果列表为空,则清除滚动条
                    that.outerEl.removeClass("repeattips-boxScroll");
                }
            });
            this.invites.model.on("change:showScroll", function () {
                // 如果联系人列表中有数据时,m2012.calendar.ui.invite.view.js中change触发
                if (!that.outerEl.hasClass("repeattips-boxScroll")) {
                    that.outerEl.addClass("repeattips-boxScroll");
                }
                // 将滚动条定位到底部
                that.inviteMainTable.get(0).scrollIntoView(false);
            });
            // 修改"参与人"控件的样式,不能改变公共的
            this.changeCssStyle();
        },
        changeCssStyle : function () { //使用js代码修改参与人控件
            this.dialog.$el.find(".addpeowidth").css("width", "auto"); // 宽度自适应
            this.dialog.$el.find(".PlaceHold").remove(); // 移除占位符
            //console.log(this.dialog.$el.find("#" + this.cid + "_invite_input_container input").parent().css("width", "90%"));
            this.dialog.$el.find("#" + this.cid + "_invite_list_container").find("table").css({
                "width" : "100%",
                "margin-top" : "0px"
            }); // 表格宽度自适应
            // 表格中的第一个th宽度设置为40%
            this.dialog.$el.find("#" + this.cid + "_invite_list_container").find("table thead tr th:first").attr("width", "40%");
            // 保存table,出现滚动条时，需要将滚动条带到最底部时需要这个对象
            this.inviteMainTable = this.dialog.$el.find("#" + this.cid + "_invite_list_container").find("table");
            // 增加样式,输入的字符不能超过图片的位置
            //this.invites.addrInput.$("div.addrText").addClass("addrText_wb");
        },
        /**
         * 1.给"添加参与人"的图标绑定点击事件
         * 2.给document绑定点击事件,关闭颜色选择器弹出窗口
         */
        bindEvent : function () {
            var that = this;
            that.dialog.selectAddrLink.on("click", function () {
                var selectedAddress = that.invites.getData(),
                    maxAddressCount = that.config.MAX_ADDR_SELECT - (selectedAddress.length || 0); //最大的可选数量
                top.M2012.UI.Dialog.AddressBook.create({
                    filter: "email",
                    maxCount: maxAddressCount
                }).on("select", function (e) {
                    // 在model的addData里面判断这些地址是否合格,根据返回值的不同来判断
                    // 如果e.value为自己,则不会添加到列表
                    that.invites.addData(e.value); //添加到列表中
                    // 列表中有数据时显示滚动条
                    if (that.invites.getData().length) { // length大于0时表示有值
                        if (!that.outerEl.hasClass("repeattips-boxScroll")) {
                            that.outerEl.addClass("repeattips-boxScroll");
                        }
                        // 定位到联系人,先增加滚动条后在增加瞄点
                        that.inviteMainTable.get(0).scrollIntoView(false);
                    }
                }).on("additemmax", function () {
                    // 如果添加的联系人超过最大个数,则回调此方法
                    top.$Msg.alert($T.format(that.config.MSG_INVITE_MAX, {
                        max: that.config.MAX_ADDR_SELECT
                    }));
                });
            });

            // 点击非颜色选择器区域时关闭选择器弹出窗
            $(document).click(function (e) {
                var target = e.srcElement || e.target;
                // 点击非颜色选择器区域时关闭选择器
                if ($(target).closest("#" + that.cid + "_colorSelect").length) {
                    return;
                }
                if ($(target).closest("#" + that.cid + "_colorLink").length) {
                    return;
                }
                that.colorSelectEl.hide();
                that.showLine(that.colorSelectEl.is(":visible"));
            });

            this.labelNameEl.on("keyup keydown",function(e) {
                that.limitLength(e);
            });

            // 鼠标移除事件
            this.colorLinkEl.parents().hover(function() {

            },function() {
                that.colorSelectEl.hide();
                that.showLine(that.colorSelectEl.is(":visible"));
            });
        },
        /**
         * 替换弹出窗口默认生成的按钮样板并展示
         * 替换原因: (公共的样式现在不支持新需求,也不能随意更改公共的样式)
         */
        replaceButtons : function () {
            var boxIFrameBtnEl = this.dialog.$el.find(".boxIframeBtn"),
                template = $T.format(this.template.BUTTONS);
            boxIFrameBtnEl.html(template).show();
        },
        /**
         * 做四件事情
         * 1:修改父节点的背景颜色 2:勾选效果 3:保存设置到值到model 4.关闭弹出窗口
         * @param event
         */
        chooseColor : function (event) {
            var target = event.target || event.srcElement,
                color = $(target).data("value");
            $(target).closest("div").prev().find("span").css("background-color", color).data("value", color);
            $(target).children(":first").show().end().parent().siblings().find("i").hide(); // 去掉兄弟节点的勾选样式
            $(target).closest("div").hide();
            this.showLine($(target).closest("div").is(":visible"));
            this.model.set("color", color);
        },
        toggleColor : function (event) {
            var target = event.target || event.srcElement,
                colorArea = $(target).closest("a").next();
            colorArea.toggle();
            this.showLine(colorArea.is(":visible"));
        },
        /**
         * 去掉或增加颜色选择框的横线样式
         * @param isShow 为true时,表示颜色选择窗口展开,则需要增加on样式,反之则去除
         */
        showLine : function (isShow) {
            isShow ? this.colorLinkEl.addClass("on") : this.colorLinkEl.removeClass("on");
        },
        render : function () {
            var that = this,
                template = $T.format(that.template.COLORS, {
                    cid: that.cid
                });
            that.dialog = $Msg.showHTML(template,
                function (e) {
                    // 点击确定按钮
                    e.cancel = true;
                    that.save(e);
                },
                //function (e) {
                    // 点击取消按钮 // ai
                    //that.cancel();s
                //},
                {
                    name:"popup_createCalendar_view",
                    width: "375px",
                    dialogTitle: that.template.DialogTitle,
                    buttons: ['保存', '取消'],
                    onClose: function () {
                        // 关闭弹出窗口之前先关闭其他的展开列表
                        $(that.dialog.el).click();
                    }
                }
            );
        },
        /**
         * 两个功能
         * 1.校验数据 2.调后台接口
         */
        save : function (e) {
            // name: $T.Html.encode(name)
            // 只需要验证是否为空
            if (!$.trim(this.labelNameEl.val())) {
                Validate.show('日历名称不能为空', this.labelNameEl);
                M139.Dom.flashElement(this.labelNameEl.selector);
                return;
            }

            var param = this.wrapParam(),
                that = this;

            $(that.showMaskContent).insertBefore(that.dialog.btnEl.children(":first"));
            this.model.getLabels({comeFrom:0, actionType : 0}, function (detail, text){
                  if (detail.code == 'S_OK') {
                      if (that.model.isLabelNameExist(detail["var"]["userLabels"], param.labelName)) {
                          that.dialog.btnEl.children(":first").remove();
                          Validate.show('日历名称已经存在', that.labelNameEl);
                      } else {
                          that.submit(param,e);
                      }
                  }
            },function (detail) {
                  console.warn(detail);
            });
        },
        submit : function (param, e) {
            var that = this;

            //$(that.showMaskContent).insertBefore(that.dialog.btnEl.children(":first"));
            this.model.addLabel(param, function(detail, json) {
                if (detail.code == 'S_OK') {
                    var label = detail["var"];
                    top.M139.UI.TipMessage.show('创建成功', { delay: 3000 });

                    // TODO 添加成功,则关闭窗口,跳转到月视图
                    that.master.trigger(that.master.EVENTS.LABEL_ADDED, {
                        seqNo: label.id,
                        labelName : param.labelName,
                        color : param.color,
                        labelShareInfo : param.labelShareInfo,
                        isShare: param.isShare
                    });

                    that.cancel();
                    that.master.trigger(that.master.EVENTS.NAVIGATE, { path: "view/update" });
                    new M2012.Calendar.Popup.View.Activity({master:that.master, labelId: label.id || 10});
                } else {
                    var info = commonAPI.getUnknownExceptionInfo(detail.errorCode);
                    if (info) {
                        if (detail.errorCode == 17) {
                            // 当errorCode为17时,特殊处理下...
                            // 17是用户将日历名称命名为"我的日历"
                            Validate.show(info, that.labelNameEl);
                        }else{
                            // 如果错误码在commonapi中有对应的错误信息,则弹出提示窗口
                            $Msg.alert(info);
                        }
                    }else{
                        // info为空时,不处理
                        top.M139.UI.TipMessage.show('创建失败', { delay: 3000 });
                    }
                    that.dialog.btnEl.children(":first").remove();
                }
            }, function (json){
                console.log('fnError');
            });
        },
        cancel : function () {
            this.dialog.close();
        },
        /**
         * 需要传递到编辑页面的参数
         * labelName : 日历名称,默认为空
         * color : 背景色,默认值"58a8b4"
         * isNewCalendarTemplate : 标志是新创建日历

        edit : function () {
            var params  = {
                labelName : this.model.get("labelName").value,
                color : this.model.get("color"),
                isNewCalendarTemplate : true
            };

            M2012.CalendarReminder.Url.redirect("add_label.html?from=month&" + $.param(params));
        },*/
        limitLength : function (e) {
            var event = e || window.event,
                target = event.target || event.srcElement,
                value = $(target).val();

            // 只需要验证长度
            //this.setModel(value, false, true);
            if (value.length > 30) {
                Validate.show('不能超过30个字', this.labelNameEl);
                M139.Dom.flashElement(this.labelNameEl.selector);
                $(target).val(value.substr(0, 30));
            }
        },
        hideTip : function () {
            this.tipDomEl.hide();
        },
        /**
         * 控制验证范围,点击"保存"时只需要验证是否为空,而"输入"时只需要验证长度
         * @param value 元素的值
         * @param isValidateNotEmpty 是否需要验证不为空 true表示需要校验
         * @param isValidateLength   是否需要验证长度 true表示需要校验
         */
        setModel : function (value, isValidateNotEmpty, isValidateLength) {
            var that = this,
                isLegal = true;
            this.model.set("labelName", {
                    "value" : $.trim(value),
                    "isValidateNotEmpty" : isValidateNotEmpty,
                    "isValidateLength" : isValidateLength
                },{
                    error : function (model, errorInfo) {
                        that.tipDomEl.children(":first").html(errorInfo).end().show();
                        M139.Dom.flashElement(that.labelNameEl.selector);
                        isLegal = false;
                    }
                });
            return isLegal;
        },
        wrapParam : function () { // 封装需要传递的参数
            var inviteData = this.invites.getData(),
                length = inviteData.length, // 如果长度为0,表示页面没有选择
                param =  {
                    labelName : $.trim(this.labelNameEl.val()),
                    color : this.model.get("color"),
                    isShare : 0
                };

            if (length > 0) {
                param.labelShareInfo = inviteData;
                param.isShare = 1;
            }

            return param;
        }
    }));
})(jQuery, _, M139, window._top || window.top);
