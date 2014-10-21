/**
*添加例外的View
*/

(function ($, _, M) {

    
    var matrixVM = new M2012.MatrixVM();

    var superClass = M.View.ViewBase;
    M.namespace('M2012.Settings.View.ExceptNotice', superClass.extend({
        name: "M2012.Settings.View.ExceptNotice",

        message: {
            warn_except_overflow: "最多只能添加$limit$个例外情况",
            error_except_addfailed: "添加例外情况出错",
            updateLevel: '短信邮件为5元版与20元版邮箱专属功能。立即升级，重新登录即可使用。'
        },
        template: {},

        initialize: function (option) {
            var _this = this;

            _this.model = option.model || new M2012.Settings.Model.MailNotice();

            _this.table = $("#listExcept");

            var panel = $("#addExcept");
            _this.exceptDiv = panel;
            _this.richExcept = panel.find("input#richExcept");

            _this.notifyMenu = new M2012.Settings.View.NotifyMenu({
               // container: panel.find("#notifyType"), showClose: false， 去掉，不然少一项目
			   container: panel.find("#notifyType")
            });

            //按钮
            _this.lnkAdd = $("#addExceptLink");
            _this.lnkClose = $("#closeExcept");
            _this.lnkRecent = $("#recentExcept");
            _this.lnkContact = $("#contactExcept, #inputcontactExcept");

            _this.pnlRange = $("#addExceptRangeModify");
            _this.btnAdd = panel.find("a#btnAddExcept");
            _this.btnCancel = panel.find("a#btnCancelExcept");
            _this.result = $("#exceptResult");
            _this.rangepanel = $("#addExceptRangePanel");

            _this.rdoEnable = panel.find("#exceptEnable");
            _this.rdoDisable = panel.find("#exceptDisable");

            _this.initEvents();

            _this.template["recentmail"] = _.template($('#recentmail_template').html());
            _this.template["exceptlist"] = _.template($('#exceptlist_template').html());

            _this.model.on("fetchsuccess", function (rs) {
                _this.flush({ pagecmd: "first" });
            });
        },

        render: function () {
            this._reset();
            this._show();
        },

        _parent: function (el, tagName) {
            tagName = tagName.toUpperCase();
            var _el = el;
            for (var i = 0xFF; i--; ) {
                if (_el == null || "#document" === _el.nodeName) {
                    return false;
                } else if (_el.nodeName === tagName) {
                    break;
                } else {
                    _el = _el.parentNode;
                }
            }
            return _el;
        },

        WaitPanel: matrixVM.createWaitPanel(),
        FF: matrixVM.createFloatingFrame(),

        initEvents: function () {
            var _this = this;
            var model = _this.model;

            /* 按钮点击事件 */
            _this.lnkAdd.on("click", function () { _this.showPanel() });
            _this.lnkClose.on("click", function () { _this._reset(); _this._hide() });

            _this.lnkRecent.on("click", function () { _this.showRecent() });
            _this.lnkContact.on("click", function () { _this.showContact() });

            _this.btnAdd.on("click", function () { _this.onSubmit() });
            _this.btnCancel.on("click", function () { _this._reset(); _this._hide() });

            _this.rdoDisable.on("click", function () { _this.hideField() });
            _this.rdoEnable.on("click", function () { _this.showField() });

            _this.pnlRange.find("A").on("click", function () { _this.showModifyTime() });

            _this.table.on("click", function (e) { _this.onCommand(e) });

            var ROW = "TR";
            _this.table.mouseover(function (e) {
                var tr = _this._parent(e.target, ROW);
                if (tr) {
                    tr = $(tr);
                    if (!tr.hasClass("on")) {
                        $(tr).addClass("on").find(".hide").removeClass("hide");
                    }
                }
            });

            _this.table.mouseout(function (e) {
                var tr1 = _this._parent(e.target, ROW);
                if (tr1 && tr1.tagName === ROW) {
                    if (e.toElement != null) { //e.toElement == null 窗口切换失焦
                        var tr2 = _this._parent(e.toElement, ROW);
                        if (tr2 && tr1.id == tr2.id) {
                            return;
                        }
                    }

                    $(tr1).removeClass("on").find("a").addClass("hide");
                }
            });
        },

        //选不接收时，屏蔽接收方式与接收时间
        hideField: function () {
            this.notifyMenu.close();
            this.exceptDiv.find(".j_disablefield").hide();
        },

        //选接收时，展开接收方式与接收时间
        showField: function () {
            this.notifyMenu.reset();
            this.exceptDiv.find(".j_disablefield").show();
        },

        require: matrixVM.createRequestByScript(),

        //最近收信对话框
        showRecent: function () {
            var _this = this;

            if (!top.appView) {
                var dialog1 = top.FF.open("最近收信", "options_notice_recentmail.htm", 420, 300, true, "", false, false);

                var ifr = dialog1.jContainer.find("iframe")[0];
                ifr.onsuccess = function (addr) {
                    _this.onMailSelect(addr, _this);
                    dialog1.close();
                };

                return;
            }

            _this.require.requestByScript({
                id: "recentmail",
                src: "notice_ext.pack.js",
                charset: "utf-8"
            }, function () {

                var dialog = new top.M2012.UI.Dialog.RecentMail({ "template": _this.template.recentmail });
                dialog.on("success", function (addr) {
                    _this.onMailSelect(addr, _this);
                });
                dialog.trigger("print");
            });
        },

        //联系人选择对话框
        showContact: function () {
            var _this = this;
            var emailList = $.trim(_this.richExcept.val());
            if (emailList.length > 0) {
                emailList = M.Text.Email.splitAddr(emailList);
            } else {
                emailList = [];
            }

            if (!top.appView) {
                top.Utils.openAddressWindow({
                    receiverTitle: "发件人",
                    selectedList: emailList,
                    callback: function (addrs) { _this.onContactSelect(addrs, _this) }
                });
                return;
            }

            var contactView = top.M2012.UI.Dialog.
                AddressBook.create({
                    filter: "email",
                    items: emailList
                });

            contactView.on("select", function (addrs) {
                addrs = addrs.value.join(",");
                addrs = $Email.splitAddr(addrs);
                _this.onContactSelect(addrs, _this);
            });
        },

        onContactSelect: function (addrs, context) {
            addrs = $.map(addrs, function (i) { return $Email.getEmail(i) });
            addrs = M.unique(addrs, function (a, b) { return $Email.compare(a, b) });
            context.richExcept.val(addrs);
        },

        onMailSelect: function (addr, context) {
            var oldValue = context.richExcept.val();
            if (oldValue.length > 0) {
                addr.push(oldValue);
            }
            var lists = addr.join(",");

            lists = $Email.splitAddr(lists);
            lists = $.map(lists, function (i) { return $Email.getEmail(i) });
            lists = M.unique(lists, function (a, b) { return $Email.compare(a, b) });

            context.richExcept.val(lists);
        },

        //修改时间段
        showModifyTime: function () {
            var _this = this;
            var model = _this.model;

            var oldValue = _this.pnlRange.data("range");
            window.console && console.log("showModifyTime...", oldValue);

            _this.pnlRange.hide();
            var panel = _this.rangepanel.parent().removeClass("hide");

            var rangePicker = new M2012.Settings.View.TimeRangeSelector({
                container: _this.rangepanel, value: oldValue, type: "modify"
            });

            rangePicker.on("cancel", function () {
                panel.addClass("hide");
                _this.pnlRange.show();
            });

            rangePicker.on("submit", function (args) {
                var value = args.value;

                window.console && console.log("range changed", args);
                panel.addClass("hide");
                args.success();

                _this.pnlRange.data("range", value)
                    .show().find("span").text(value.discription);
            });
        },

        //点添加链接时，显示填写面板
        showPanel: function () {
            var div = this.exceptDiv;
            if (div.hasClass("hide")) {
                div.removeClass("hide");
                this.render();
                window.document.body.scrollTop += 125; //表单区域一半的高度，这样用户感觉是居中展开的，不会太突兀。
            }
        },

        //显示例外表格
        showExcepttable: function (args) {
            var _this = this;
            var data = args.viewdata;
            if (data.exceptlist.length == 0) {
                _this.table.hide();
                return;
            }

            _this.table.html(_this.template.exceptlist(data));
            if ($.isFunction(args.success)) {
                args.success(_this.table);
            } else {
                _this.table.show();
            }
        },
        //显示单个例外详细设置
        showDetail: function (args) {
            var _this = this;
            var model = _this.model;

            model.trigger("exceptdetailrendering", { "notifyid": args.nid, "success": function (result) {
                window.console && console.log("detail model filtered", args, result);

                if (!top.appView) {
                    var dialog1 = top.FF.open("详细设置", "options_notice_detail.htm", 560, 430, true, "", false, false);
                    var defaultText = result.value.notifytype == 1 ? "短信到达通知" : "彩信到达通知";
                    var ifr = dialog1.jContainer.find("iframe")[0];
                    ifr.value = result.value;
                    ifr.onsuccess = function (value) {
                        _this.onSaveDetail(value, dialog1, defaultText);
                    };
                    ifr.oncancel = function () {
                        dialog1.close();
                    };
                    return;
                }

                top.M139.core.utilCreateScriptTag({
                    id: "detailform",
                    src: "notice_ext.pack.js?v=" + Math.random(),
                    charset: "utf-8"
                }, function () {
                    var dialog = new top.M2012.UI.Dialog.ExceptNotify({
                        value: result.value, limit: model.RANGE_LIMIT,model:_this.model
                    });
                    dialog.on("success", function (view, value) {
                        _this.onSaveDetail(value, dialog);
                    });
                    dialog.on("cancel", function () { 
                        
                    });
                    dialog.trigger("print");
                })
            }
            });
        },

        onSaveDetail: function (value, dialog, defaultText) {
            var _this = this;
            var model = _this.model;
            var text = {sms: "短信到达通知",mms: "彩信到达通知"}
            var type = {sms: 1, mms: 2}
            if (!top.appView) {
                var el = $(dialog.jContainer).find("iframe").contents().find(".dropDownText");
            } else {
                var el = dialog.$el.find(".dropDownText");
            }
            if (el.text() == text.sms) {
                value.notifytype = type.sms;
            }
            if (el.text() == text.mms) {
                value.notifytype = type.mms;
            }
			// add by zhangsixie.例外情况，接受方式不接受的时候，把enable设置为false没用，需要把接受方式设置为O。
			if(!value["enable"]){
				value["notifytype"] = 0;
			}
            model.trigger("exceptmodifying", { "value": value, "success": function (result) {
                if (result.code == "1011") {
                    top.FF.confirm(
                    _this.message.updateLevel,
                        function () {
                            top.Links.show('orderinfo');
                            dialog.close();
                        },
                        function () {
                            el.text(defaultText);
                        },
                        true
                    );
                    return
                }
                if (!result.success) {
                    _this.FF.alert("修改失败");
                    return false;
                }
                if (!top.appView) { dialog.close(); }

                //更新原来所在的行的数据显示
                var row = _this.table.find("#nid_" + value.notifyid);

                if (!top.SiteConfig.mailNotice) {
                    var arr = ["不接收通知", "普通短信", "彩信", "wap链接", "长短信", "免提短信"];
                } else {
                    var arr = ["不接收通知", "短信到达通知", "彩信到达通知", "wap链接", "短信邮件", "免提短信"];
                }
                row.find(".j_notifytype").text(
                    arr[value.notifytype]
                );

                var desc = value.timerange[0].discription + (value.timerange.length > 1 ? "等" : "") + (value.supply ? "；补发" : "");
                if (!value.enable) {
                    desc = "";
                }

                row.find(".j_discription").text(desc);
            }
            });
        },

        //点确定按钮时，校验并提交
        onSubmit: function () {
            var _this = this;
            var model = _this.model;

            if (_this.busy) {
                return;
            }

            var error = [];
            var addr = _this.richExcept.val();
			addr = M139.Text.Html.encode(addr);//编码 edit by zsx
            var enableRecevie = _this.exceptDiv.find(":radio:checked").val() == "1";
            var supply = _this.exceptDiv.find(":checkbox").is(":checked");
            var notifyType = _this.notifyMenu.selectedValue();
            var range = _this.pnlRange.data("range");
            if (_this.exceptDiv.find(".dropDownText").text() == "短信到达通知") {
                notifyType = 1;
            }
            if (top.SiteConfig.mailNotice) {
                if (top.$User) {
                    var userLevel = top.$User.getUserLevel();
                    var provcode = top.$User.getProvCode();
                    var confirmJson = {
                        name: "updateLevel",
                        dialogTitle: "系统提示",
                        icon: "warn"
                    }
                    var confirm = top.$Msg.confirm;
                }
                else {
                    var userLevel = top.UserData.serviceItem;
                    var provcode = top.UserData.provCode;
                    var confirmJson = true;
                    var confirm = top.FF.confirm;
                }
                if ((userLevel == "0010" && provcode == "1") || userLevel == "0015" || userLevel == "0005") {
                    if (notifyType == 4) {
                        var msgAlert = confirm(
                        this.message.updateLevel,
                        function () {
                            if (top.$User) { top.$App.show("mobile") } else { top.Links.show('orderinfo') };
                        },
                        function () {
                            _this.exceptDiv.find(".dropDownText").text("短信到达通知");
                        },
                        confirmJson);
                        return;
                    }
                }
            }
            //TOFIX：这里要兼容只有邮件域的情况
            addr = M.Text.Email.parse(addr);
            error = addr.error;
            if (addr.success) {
                if (addr.emails.length > 0) {
                    addr.emails = $.map(addr.emails, function (i) {
                        return M.Text.Email.getEmail(i);
                    });
                } else {
                    addr.success = false;
                }
            } else {
                addr = _this.richExcept.val();
				addr = M139.Text.Html.encode(addr); //编码 edit by zsx
                addr = $Email.splitAddr(addr);
                var temp = [];
                error = [];

                $.each(addr, function (i, n) {
                    n = $.trim(n);
                    if (n.length === 0) return;

                    if (_this.isDomain(n) || $Email.isEmail(n)) {
                        temp.push(n);
                    } else {
                        error.push(n);
                    }
                });
                error = error.join(', ');

                if (temp.length > 0) {
                    addr = { success: true, emails: temp };
                    if (_this.isDomain(error)) { error = false; }
                } else {
                    addr = { success: false, emails: null };
                }
            }

            if (!addr.success || error) {
                $D.flashElement(_this.richExcept)
                if (error.length > 0) {
                    _this.FF.alert("Email地址 " + error + " 有误，请输入正确的邮件地址（如：example@139.com）或域（如：@139.com）");
                }
                return;
            }

            //点确定添加时，仍需要过一道去除重复。
            addr.emails = M139.unique(addr.emails, function (a, b) {
                if ($Email.compare(a, b)) {
                    return true;
                } else if (a.indexOf("@") === 0 && b.indexOf("@") === 0) {
                    return a.toLowerCase() === b.toLowerCase();
                }
                return false;
            });

            model.trigger("emailadding", {
                "emaillist": addr.emails,
                "success": function (repeatId) {
                    _this.busy = true;
                    model.trigger("exceptadding", {
                        "value": {
                            emaillist: addr.emails,
                            timerange: range,
                            enable: enableRecevie,
                            notifytype: notifyType,
                            fromtype: 2,
                            supply: supply
                        },
                        "success": function (result) {
                            _this.WaitPanel.hide();
                            _this.busy = false;

                            if (result.success) {
                                _this._reset();
                                _this._hide();

                                _this.flush({ pagecmd: "first", success: function (_table) {
                                    //TODO: 高亮前几行
                                    model.trigger("exceptadded", { value: addr.emails, success: function (list) {
                                        var ids = "";
                                        $.each(list, function () { ids += ",#nid_" + this.notifyid });
                                        ids = ids.substring(1);
                                        var rows = _table.find(ids);
                                        rows.hide();
                                        _table.show();
                                        rows.fadeIn('slow');
                                    }
                                    });
                                }
                                })
                            } else {

                                if (result.code == "ER_OVERFLOW") {
                                    var limit = model.getExceptLimit();
                                    var message = _this.message.warn_except_overflow.replace("$limit$", limit);
                                    var popup = M139.UI.Popup.create({
                                        name: "except_overflow",
                                        target: _this.btnAdd,
                                        icon: "i_fail",
                                        width: 300,
                                        buttons: [
                                            {
                                                text: "确定",
                                                click: function () {
                                                    popup.close();
                                                }
                                            }],
                                        content: message
                                    });
                                    popup.render();

                                } else {
                                    _this.FF.alert(_this.message.error_except_addfailed);
                                }
                            }
                        }
                    });
                },
                "error": function (repeatId) {
                    //TODO: 要找到重复所在的页码，并闪烁所在的行
                    _this.WaitPanel.show("已添加过该联系人", { delay: 2000 });
                    _this.flush({ pagecmd: "last" });

                    setTimeout(function () {
                        var first = _this.table.find("#nid_" + repeatId[0]);
                        var scrollDisc = first.offset().top + 110 - document.documentElement.clientHeight;
                        if (scrollDisc > document.body.scrollTop) {
                            document.body.scrollTop = scrollDisc;
                        }

                        $.each(repeatId, function () {
                            _this.table.find("#nid_" + this)
                                .css({ backgroundColor: "#fe9" })
                                .animate({ backgroundColor: "#fff" }, 1500);
                        });
                    }, 400);

                }
            });
        },

        /**
        * 例个表格中的点击事件
        * @param {EventArgs} e jQuery事件对象
        */
        onCommand: function (e) {
            if (e.target.tagName != "A") {
                return;
            }

            var _this = this;
            var link = $(e.target);
            var cmd = link.data("cmd");
            var nid = link.data("nid");
            var page = link.data("pageIndex");

            _this.cmdHandler["onexcept" + cmd]({
                "nid": nid, "page": page
            }, _this);
        },

        cmdHandler: {
            onexceptdelete: function (args, context) {
                var model = context.model;
                model.trigger("exceptdeleting", {
                    "notifyid": args.nid,
                    "success": function (result) {
                        $("#nid_" + args.nid).fadeOut("fast", function () {
                            context.flush({ pagecmd: "current" })
                        });
                    },
                    "error": function (result) {
                        top.$Msg.alert("删除失败");
                    }
                });
            },
            onexceptmodify: function (args, context) {
                context.showDetail(args);
            },
            onexceptmore: function (args, context) {
                context.flush({ pagecmd: "next" })
            }
        },

        _reset: function () {
            var _this = this;

            _this.richExcept.val("");
            _this.notifyMenu.reset();
            _this.exceptDiv.find(".j_disablefield").show();
            _this.rdoEnable.attr('checked', 'checked');

            var range = {
                "weekday": "1,2,3,4,5,6,7",
                "begin": 8,
                "end": 22
            };
            range.discription = _this.model.getTimeRange(range);

            _this.pnlRange.data("range", range);
            _this.pnlRange.find("span").text(range.discription);
        },

        _show: function () {
            this.exceptDiv.removeClass("hide").addClass("show");
        },

        _hide: function () {
            this.exceptDiv.removeClass("show").addClass("hide");
        },

        flush: function (args) {
            var _this = this;
            _this.model.trigger("exceptlist_rendering", {
                "pagecmd": args.pagecmd,
                "success": function (viewdata) {
                    _this.showExcepttable({ "viewdata": viewdata, "success": args.success });
                }
            });
        },

        regDomain: /^@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
        isDomain: function (str) {
            return this.regDomain.test(str);
        }

    })
    );

})(jQuery, _, M139);