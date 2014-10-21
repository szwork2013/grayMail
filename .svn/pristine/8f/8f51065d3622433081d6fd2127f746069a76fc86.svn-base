/**
*邮件到达通知主View
*/
(function ($, _, M) {
    var superClass = M139.View.ViewBase;

    M139.namespace('M2012.Settings.View.MailNotice', superClass.extend({
        logger: new M.Logger({ name: "setting.mailnotice.view" }),

        messages: {
            UNKNOW: "获取数据失败",
            SESSIONTIMEOUT: "太久没操作，请重新登录",
            updateLevel: '短信邮件为5元版与20元版邮箱专属功能。立即升级，重新登录即可使用。'
        },

        FROMTYPES: {
            NOCONTACT: 0, //不在通讯录
            CONTACT: 1, //在通讯录
            SOMEONE: 2 //指定的人（即例外情况）
        },

        el: "body",
        name: "MailNotice",
        expandSpan: [],
        events: {
            "click .j_modTimeSpan": "showTimeSpanPanel",
            "click .j_delTimeSpan": "removeMajorTimeRange",
            "click #btnAddMajorRange": "showRangeAddtionPanel"
        },

        initialize: function () {
            var _this = this;

            if (top.$User) {
                if (top.$User.isInternetUser()) {
                    top.$User.showMobileLimitAlert();
                    top.$App.closeTab("notice");
                    return;
                }
            } else if (',83,84,'.indexOf("," + top.UserData.provCode + ",") > -1) {
                top.FF.alert("尊敬的用户：您暂时无法使用本功能。如需使用完整功能，请使用中国移动手机开通139邮箱。");
                top.MM.goBack();
                return;
            }

            _this.submit = $("#btnSubmit");
            _this.cancel = $("#btnCancel");
            _this.btnAddMajorRange = $("#btnAddMajorRange");
            _this.majorRangeTable = $("table#MajorTimeRange");
            _this.model = new M2012.Settings.Model.MailNotice();
            _this.viewNotice = new M2012.Settings.View.Notice();
            _this.viewExcept = new M2012.Settings.View.ExceptNotice({ model: _this.model });
            $(".j_disablepanel").hide();

            var model = _this.model;

            model.on("sessiontimeout", function (summary) {
                _this.onsessionout(summary);
            });

            model.on("userLevelError", function (data) {
                _this.render(data);
                _this.userLevelError(data);
            });

            model.on("fetching", function () {
                _this.onfetching();
            });

            model.on("fetched", function (rs) {
                _this.onfetched(rs);
            });

            model.on("fetcherrored", function (rs) {
                _this.onfetcherrored(rs);
            });

            model.on("fetchsuccess", function (rs) {
                _this.render(rs);
            });

            model.on("fetched:popnotify", function (rs) {
                _this.renderPopNotify(rs);
            });

            model.on("saving", function (data) {
                _this.onsaving(data);
            });

            model.on("saved", function () {
                _this.onsaved();
            });

            model.on("deleting", function (data) {
                _this.ondeleting(data);
            });

            model.on("deleted", function () {
                _this.ondeleted();
            });

            model.on("noticeTypeClosed", function (closed) {
                _this.onNoticeTypeClosed(closed);
            });

            model.fetch();
        },

        /**
        * 呈现添加整体时段设置面板
        * @param {EventArgs} e jQuery事件对象
        */
        showRangeAddtionPanel: function (e) {
            var _this = this;
            var tid = "tid_addtion";

            if (_this.expandSpan[tid]) { return; }

            var panel = $("#majorRangeField");
            panel.parent().removeClass("hide");

            var majortable = _this.majorRangeTable;

            var rangePicker = new M2012.Settings.View.TimeRangeSelector({
                container: panel, value: { tid: tid }
            });

            rangePicker.on("cancel", function () {
                _this.logger.debug("Major Timespan Add canceled");
                panel.parent().addClass("hide");
                delete _this.expandSpan[tid];
            })

            rangePicker.on("submit", function (args) {
                _this.logger.debug("Major Timespan Add submited", args);
				var notifyTypeMenuContact = $("#notifyTypeMenuContact").text();
				var notifyTypeMenuNoContact = $("#notifyTypeMenuNoContact").text();
				var ServiceItem = '';
				if(top.$User){
					ServiceItem = top.$User.getServiceItem();
				}else{
					ServiceItem = top.UserData.serviceItem;
				}
				if((notifyTypeMenuContact == "短信邮件" || notifyTypeMenuNoContact =="短信邮件") && (ServiceItem == '0010' || ServiceItem == '0015')){
					var confirm = top.$User? top.$Msg.confirm : top.FF.confirm;
					confirm(_this.messages.updateLevel,
                        function () {
                            if (top.$User) { top.$App.show("mobile") } else { top.Links.show('orderinfo') };
                        });
						return;
				}
                var param = args.value;

                _this.model.trigger("MajorRangeAdding", { "value": param, "success": function (rs) {
                    _this.logger.debug("MajorTimespanSaved", rs);

                    if (rs.code === "S_OK") {
                        if (_this.expandSpan[tid]) {
                            delete _this.expandSpan[tid];
                        }

                        args.success();
                        panel.parent().addClass("hide");

                        if (rs.needlock) {
                            _this.btnAddMajorRange.hide();

                            if (_this.btnAddMajorRange.next().is("span:contains('添加')")) {
                                _this.btnAddMajorRange.next().show();
                            } else {
                                _this.btnAddMajorRange.after($("<span class='gray'>添加</span>"));
                            }
                        }

                        $(".j_delTimeSpan").removeClass("hide");

                        var row = $(_this.TEMPL_RANGE(rs.range)).hide();

                        majortable.append(row);
                        row.fadeIn("slow", function () {
                            row.removeAttr("style");
                        });
                    } else if (rs.code == "ER_EXISTS") {
                        _this.WaitPanel.show("已存在同样的时间段，请修改", { delay: 2000 });
                        majortable.find("tr#major_range_" + rs.range.tid)
                        .css({ backgroundColor: "#fe9" })
                        .animate({ backgroundColor: "#fff" }, 1000);
                    }

                }
                });
            })

            _this.expandSpan[tid] = true;
            _this.logger.debug("RangeAddtionPanel expanding", e);
        },

        /**
        * 呈现修改整体时段设置面板
        * @param {EventArgs} e jQuery事件对象
        */
        showTimeSpanPanel: function (e) {
            var tid, row, _this, panel, majortable;
            _this = this;
            majortable = _this.majorRangeTable;

            tid = $(e.currentTarget).data("tid");
            if (_this.expandSpan[tid]) {
                return;
            }

            row = majortable.find("tr#major_range_" + tid);

            panel = $('<tr><td colspan="2" style="padding-left:0;"></td></tr>');

            _this.model.trigger("TimeRangeExpanding", { "tid": tid, "success": function (rs) {
                _this.logger.debug("renderTimeRangeExpanding", rs);

                var rangePicker = new M2012.Settings.View.TimeRangeSelector({
                    container: panel.children(), value: { tid: tid, begin: rs.begin, end: rs.end, weekday: rs.weekday.join() }
                });

                rangePicker.on("cancel", function () {
                    _this.logger.debug("Major Timespan modify canceled");
                    delete _this.expandSpan[tid];
                    panel.remove();
                });

                rangePicker.on("submit", function (args) {
                    _this.logger.debug("Major Timespan modify submited", args);

                    var param = args.value;

                    _this.model.trigger("MajorRangeModifing", { "value": param, "success": function (rs) {
                        _this.logger.debug("MajorTimespanSaved", rs);

                        if (rs.code === "S_OK") {
                            args.success();
                            panel.remove();
                            $(row).find("#desc_" + rs.range.tid).text(rs.range.discription);
                            delete _this.expandSpan[tid];
                        } else if (rs.code == "ER_EXISTS") {
                            _this.WaitPanel.show("已存在同样的时间段，请修改", { delay: 2000 });
                            majortable.find("tr#major_range_" + rs.range.tid)
                            .css({ backgroundColor: "#fe9" })
                            .animate({ backgroundColor: "#fff" }, 1000);
                        }
                    }
                    });
                });

                panel.insertAfter(row);
            }
            });

            _this.expandSpan[tid] = true;
        },

        removeMajorTimeRange: function (e) {
            var _this = this;
            var tid = $(e.target).data("tid");

            _this.logger.debug("MajorTimeRange removing", tid);

            var row = _this.majorRangeTable.find("tr#major_range_" + tid);

            _this.model.trigger("MajorTimespanRemoving", { "tid": tid, "success": function (rs) {
                _this.logger.debug("renderMajorTimespanRemoved", rs);
                if (rs.code === "S_OK") {

                    var panel = row;
                    if (_this.expandSpan[tid]) {
                        delete _this.expandSpan[tid];
                        panel = row.next("tr").andSelf(); //移除修改时段面板
                    }

                    panel.fadeOut(function () {
                        if (panel) panel.remove();
                        panel = null;
                    });

                    if (rs.needlock) {
                        $(".j_delTimeSpan").addClass("hide");
                    }

                    if (rs.canAdd) {
                        _this.btnAddMajorRange.next("span").remove();
                        _this.btnAddMajorRange.show();
                    }
                }
            }
            });
        },

        WaitPanel: (new M2012.MatrixVM()).createWaitPanel(),

        userLevelError: function (data) {
            var self = this;
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
                    var notifySatus = $.grep(data, function (n, i) {
                        return n.notifytype == 4; //免费用户更改成长短信
                    });
                    console.log(notifySatus.length)
                    if (notifySatus.length > 0) {
                        var msgAlert = confirm(
                        self.messages.updateLevel,
                        function () {
                            if (top.$User) { top.$App.show("mobile") } else { top.Links.show('orderinfo') };
                        },
                        function () {
                            self.model.trigger("fetch");
                        },
                        confirmJson);
                        self.isbusy = false;
                        self.model.set({ userLevelError: true });
                    } else {
                        self.isbusy = false;
                        self.model.set({ userLevelError: false });
                    }
                }
            }
        },

        onfetcherrored: function () {
            this.WaitPanel.hide();
            var tip = this.messages["UNKNOW"];

            if (top.$Msg) {
                top.$Msg.alert(tip);
            } else if (top.Utils && $.isFunction(top.Utils.showTimeoutDialog)) {
                top.Utils.showTimeoutDialog(true)
            }

            //禁用页面可操作元素
            $(".j_disablepanel").hide();
            $(":radio, :checkbox").attr("disabled", true);
            this.submit.unbind("click");
        },

        onsessionout: function () {
            var tip = this.messages["SESSIONTIMEOUT"];
            top.$Msg.alert(tip);
            this.isbusy = false;
        },

        onfetching: function () {
            this.WaitPanel.show("正在加载中...");
        },

        onsaving: function (data) {
            this.WaitPanel.show("正在保存...");
        },

        onfetched: function () {
            this.WaitPanel.hide();
        },

        onsaved: function () {
            this.WaitPanel.hide();
            this.WaitPanel.show("您的设置已保存", { delay: 2000 });
            this.isbusy = false;
        },

        ondeleting: function () {
            this.WaitPanel.show("正在删除...");
        },

        ondeleted: function () {
            this.WaitPanel.hide();
            this.WaitPanel.show("已删除", { delay: 2000 });
            this.isbusy = false;
        },

        onNoticeTypeClosed: function (closed) {
            if (closed) {
                $("#MajorTimeRangePanel").hide();
                if (top.BH) { top.BH("set_notice_type_delete"); }
            } else {
                this.model.trigger("majorenable_rendering", function (enable) {
                    if (enable) {
                        $("#MajorTimeRangePanel").show();
                    }
                });
                if (top.BH) { top.BH("set_notice_type_modify"); }
            }
        },

        render: function (data) {
            var _this = this;
            var model = _this.model;
            var messages = _this.messages;
            var from = _this.FROMTYPES;
            console.log(data)
            _this.logger.debug("mailnotice.view.render", data);

            model.trigger("majorenable_rendering", function (enable) {
                var panel = $("#majorswitch");
                panel.find(":radio[value=" + (enable ? "open" : "close") + "]")
                .attr("checked", "checked");

                if (enable) {
                    $(".j_disablepanel,#li_conversation").show();
                } else {
                    $(".j_disablepanel,#li_conversation").hide();
                }
            });

            $("#majorswitch :radio").click(function (e) {
                var rdo = e.target;
                _this.model.set({ majorswitch: rdo.value == "open" });

                if (rdo.value == "close") {
                    $(".j_disablepanel,#li_conversation").hide();
                    $("#popnotice").removeAttr("checked");
                    $("#popnotice").attr("disabled", "disabled");
                    _this.model.set({ "popnotify": 0 });
                } else {
                    $(".j_disablepanel,#li_conversation").show();
                    $("#popnotice").removeAttr("disabled");
                }
            });

            _this.model.on("change:majorswitch", function (model, isOpened) {
                if (!isOpened) {
                    //显示，是否要添加例外对话框
                    var tipName = "tipOtherExcept"; //单例
                    _this.popup = M139.UI.Popup.create({
                        name: tipName,
                        target: $("#majorswitch :radio")[1],
                        icon: "i_fail",
                        width: 240,
                        buttons: [
                        {
                            text: "添加例外情况",
                            cssClass: "btnSure",
                            click: function () {
                                $("#majorswitch :radio[value='open']").trigger("click");
                                $("#addExceptLink").trigger("click");
                                window.scrollTo(0, $("#addExceptLink").offset().top - 125);
                            }
                        },
                        {
                            text: "关闭邮件到达通知",
                            click: function () {
                                _this.popup.close();
                                _this.popup = false;
                                _this.model.trigger("save");
                            }
                        }
                        ],
                        content: "添加例外情况可只提醒您需要的通知<br>确定关闭所有邮件到达通知吗？"
                    });

                    //直接点 X 关闭
                    _this.popup.on("close", function (args) {
                        if (args.source === "popup_close") {
                            _this.popup = false;
                            _this.model.trigger("save");
                        }
                    });

                    _this.popup.render();
                } else {
                    if (_this.popup) {
                        _this.popup.close();
                    }
                }
            });

            //主要的通知下发方式
            (function (container1, container2) {

                _this.menu1 = new M2012.Settings.View.NotifyMenu({
                    container: container1,
					acceptNotice : true
                });

                _this.menu2 = new M2012.Settings.View.NotifyMenu({
                    container: container2,
					acceptNotice : true
                });

                _this.menu1.on("change", function (value) {
                    model.trigger("noticetypechange", { "type": from.CONTACT, "value": value });
                });

                _this.menu2.on("change", function (value) {
                    model.trigger("noticetypechange", { "type": from.NOCONTACT, "value": value });
                });

                model.trigger("notifytype_rendering", from.CONTACT, function (noticeType) {
                    _this.menu1.model.set({ value: noticeType });
                });

                model.trigger("notifytype_rendering", from.NOCONTACT, function (noticeType) {
                    _this.menu2.model.set({ value: noticeType });
                });

                //主开关开启时，如果通讯录内外均不接收通知，则均改为普通短信
                model.on("change:majorswitch", function (_model, isOpened) {
                    if (!isOpened) {
                        return;
                    }

                    var onAllClosed = function (allClosed) {
                        _model.off("noticeTypeClosed", onAllClosed);

                        if (!allClosed) {
                            return;
                        }

                        var NORMAL_SMS = 1;
                        _this.menu1.model.set({ value: NORMAL_SMS });
                        _this.menu2.model.set({ value: NORMAL_SMS });
                    };

                    _model.on("noticeTypeClosed", onAllClosed);
                    _model.trigger("noticeTypeChanged");
                });

            })($("#notifyTypeMenuContact"), $("#notifyTypeMenuNoContact"));

            //补发选项
            (function (_model, chkSupply) {
                var checked = "checked";
                _model.trigger("majorsupply_rendering", function (issupply) {
                    if (issupply) {
                        chkSupply.attr(checked, checked);
                    } else {
                        chkSupply.removeAttr(checked);
                    }
                });

                chkSupply.click(function () {
                    _model.set({ majorsupply: chkSupply.is(":checked") });
                });
            })(model, $("#mailnotice_supply"));
            
            // add by tkh 订阅邮件选项
            (function (_model, chkMpostnotice) {
                var checked = "checked";
                _model.trigger("mpostnotice_rendering", function (issyncDy) {
                    if (typeof issyncDy === 'undefined' || issyncDy) {
                        chkMpostnotice.attr(checked, checked);
                    } else {
                        chkMpostnotice.removeAttr(checked);
                    }
                });

                chkMpostnotice.click(function () {
                    _model.set({ mpostnotice : chkMpostnotice.is(":checked") });
                    
                    if(chkMpostnotice.is(":checked") && top.BH){
                    	top.BH("set_notice_mpostsubmail");
                    }
                });
            })(model, $("#mpostnotice"));

            //短信聚合显示,added by tiexg 
            (function initConversation() {
                $(data).each(function (i, n) {//data是接口返回的报文，初始化单选框的值
                    if (n["msgConverge"]) {
                        $("#div_conversation input[type=radio]").eq(1).attr("checked","1");
                    }
                });
                $("#div_conversation input[type=radio]").change(function () {
                    var val = $("#div_conversation input[type=radio]:checked").val();
                    var msgConverge=val=="open"?true:false;
                    $(data).each(function (i, n) {  //单选框改变时修改data变量，点击保存时data会直接组报文调用updateNotify接口
                        n["msgConverge"] = msgConverge;
                    });
                });
                var img = $(".mailTipArrived");
                $("#div_conversation label").hover(function () {    //tips图片鼠标交互
                    img.show();
                    if ($(this).attr("name") == "c1") {
                        img.css("top", "0px").find("img").attr("src", "/m2012/images/201312/yjddtz_02.png");
                    } else {
                        img.css("top", "20px").find("img").attr("src", "/m2012/images/201312/yjddtz_01.png");
                    }
                }, function () {
                    img.hide();
                });
            })();
             

            //主要时段
            (function (_table) {
                var on = "on", cmd = ".j_cmd", flag = "major_range_", ROW = "TR";

                _table.mouseover(function (e) {
                    var tr = _this._parent(e.target, ROW);
                    if (tr) {
                        tr = $(tr);
                        if (!tr.hasClass(on) && (tr.attr("id") || "").indexOf(flag) > -1) {
                            $(tr).addClass(on).find(cmd).show();
                        }
                    }
                });

                _table.mouseout(function (e) {
                    var tr1 = _this._parent(e.target, ROW);
                    if (tr1 && tr1.tagName === ROW) {
                        if (e.toElement != null) { //e.toElement == null 窗口切换失焦
                            var tr2 = _this._parent(e.toElement, ROW);
                            if (tr2 && tr1 == tr2) {
                                return;
                            }
                        }

                        $(tr1).removeClass(on).find(cmd).hide();
                    }
                });

                model.trigger("majortimerange_rendering", function (result) {
                    var type = from.CONTACT;
                    var buff = [];
                    var ranges = result.timerange;

                    for (var i = 0; i < ranges.length; i++) {
                        buff.push(_this.TEMPL_RANGE(ranges[i]));
                    }

                    _table.html(buff.join(""));

                    if (result.lockdelete) {
                        $(".j_delTimeSpan").addClass("hide");
                    }

                    if (result.lockadd && _this.btnAddMajorRange.is(":visible")) {
                        _this.btnAddMajorRange.hide();
                        _this.btnAddMajorRange.after($("<span class='gray'>添加</span>"));
                    }
                });

            })(_this.majorRangeTable);

            _this.submit.unbind("click").bind("click", function () {
                if (top.SiteConfig.mailNotice) {
                    _this.model.trigger("userLevelError", data);
                    if (_this.model.get("userLevelError")) {
                        return
                    }
                }
                if (_this.isbusy) {
                    return;
                }
				if(top.$User && !top.$User.isNotChinaMobileUser() || ',81,82,83,84,'.indexOf("," + top.UserData.provCode + ",") == -1){ //edit by zsx
					_this.viewNotice.update();
				}
                
                _this.isbusy = true;
                _this.model.trigger("save", data);
            });
        },

        renderPopNotify: function (isOpened) {
            var _this = this;
            var chkPnotice = $("#popnotice");
            if (isOpened == "1") {
                chkPnotice.attr("checked", "checked");
            } else {
                chkPnotice.removeAttr("checked");
            }

            chkPnotice.click(function () {
                if (!!chkPnotice.attr("checked")) {
                    _this.model.set({ "popnotify": 1 });
                } else {
                    _this.model.set({ "popnotify": 0 });
                }
            });

            _this.logger.debug("popnotice:", isOpened);
        },

        showFailure: function (dom, msg) {
            var tipName = "tipNoticeFailure"; //单例
            var popup = M139.UI.Popup.create({
                name: tipName,
                target: dom[0],
                icon: "i_fail",
                width: 300,
                buttons: [
                {
                    text: "确定",
                    click: function () {
                        popup.close();
                    }
                }],
                content: msg
            });
            popup.render();

            //错误提示5秒后自动隐藏
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(function () {
                try {
                    this.timer = null;
                    popup.close();
                }
                catch (e) { }
            }, 5000);
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

        update: function () {
            var This = this;
            This.model.update(function (result) {
                //更新
                var messages = This.messages;
                var tip = messages.FA_DEFAULT; //设置为默认错误
                var data = result["var"];
                if (result.code == "S_OK") {
                    tip = messages.S_UPDATE;
                } else if (result.code == "S_FALSE") {
                    tip = message.SESSIONTIMEOUT;
                }

                top.M139.UI.TipMessage.show(tip, { delay: 2000 });
            });
        },

        // 视图模板 //{

        TEMPL_RANGE: _.template([
            '<tr id="major_range_<%= tid %>" data-tid="<%= tid %>">',
                '<td id="desc_<%= tid %>"><%= discription %></td>',
                '<td class="td1">',
                    '<a class="j_delTimeSpan j_cmd" data-cmd="delete" data-tid="<%= tid %>" href="javascript:void(0)" style="display:none" bh="set_notice_range_delete">删除</a>',
                    '<span class="j_delTimeSpan j_cmd" style="display:none"> | </span>',
                    '<a class="j_modTimeSpan j_cmd" data-cmd="modify" data-tid="<%= tid %>" href="javascript:void(0)" style="display:none" bh="set_notice_range_modify">修改</a>',
                '</td>',
            '</tr>'].join('')),

        TEMPLATE_TIME_PANEL: ['<tr data-tid="{tid}"><td colspan="2" style="padding-left:0;">',
        '<ul class="form nofitimeset-form j_panel_range_{tid}">',
        '<li class="formLine">',
        '<label class="label">时段：</label>',
        '<div class="element">',
        '<div><input id="timefield" type="text" class="iText" data-value=\'{"start":8,"end":22}\' value="8:00 ~ 22:00" readonly /></div>',
        '<div></div>',
        '</div>',
        '</li>',
        '<li class="formLine">',
        '<label class="label">日期：</label>',
        '<div class="element">',
        '<div data-tid="{tid}" class="weekdiscription">每天</div>',
        '<div>',
        '<ul class="sundaysel">',
        '<li data-day="7"><a href="javascript:void(0)">周日</a></li>',
        '<li data-day="1"><a href="javascript:void(0)">周一</a></li>',
        '<li data-day="2"><a href="javascript:void(0)">周二</a></li>',
        '<li data-day="3"><a href="javascript:void(0)">周三</a></li>',
        '<li data-day="4"><a href="javascript:void(0)">周四</a></li>',
        '<li data-day="5"><a href="javascript:void(0)">周五</a></li>',
        '<li data-day="6"><a href="javascript:void(0)">周六</a></li>',
        '</ul>',
        '</div>',
        '</div>',
        '</li>',
        '</ul>',
        '<div class="tips-btn">',
        '<a data-tid="{tid}" class="btnNormal j_modifyMajorRange" href="javascript:void(0)"><span>确 定</span></a> <a data-tid="{tid}" class="btnNormal j_modTimeSpanCanel" href="javascript:void(0)"><span>取 消</span></a>',
        '</div>',
        '</td></tr>'].join(""),

        TEMPLATE_ADDTIME_PANEL: ['<tr><td style="padding-left:0;">',
        '<ul class="form nofitimeset-form j_panel_range_{tid}">',
        '<li class="formLine">',
        '<label class="label">时段：</label>',
        '<div class="element">',
        '<div><input id="timefield" type="text" class="iText" data-value=\'{"start":8,"end":22}\' value="8:00 ~ 22:00" readonly /></div>',
        '<div></div>',
        '</div>',
        '</li>',
        '<li class="formLine">',
        '<label class="label">日期：</label>',
        '<div class="element">',
        '<div data-tid="{tid}" class="weekdiscription">每天</div>',
        '<div>',
        '<ul class="sundaysel">',
        '<li data-day="7"><a href="javascript:void(0)">周日</a></li>',
        '<li data-day="1"><a href="javascript:void(0)">周一</a></li>',
        '<li data-day="2"><a href="javascript:void(0)">周二</a></li>',
        '<li data-day="3"><a href="javascript:void(0)">周三</a></li>',
        '<li data-day="4"><a href="javascript:void(0)">周四</a></li>',
        '<li data-day="5"><a href="javascript:void(0)">周五</a></li>',
        '<li data-day="6"><a href="javascript:void(0)">周六</a></li>',
        '</ul>',
        '</div>',
        '</div>',
        '</li>',
        '</ul>',
        '<div class="tips-btn">',
        '<a data-tid="{tid}" class="btnNormal j_addMajorRangeSave" href="javascript:void(0)"><span>确 定</span></a> <a data-tid="{tid}" class="btnNormal j_modTimeSpanCanel" href="javascript:void(0)"><span>取 消</span></a>',
        '</div>',
        '</td></tr>'].join("")

        //}

    })
);

    $(function () {
        new M2012.Settings.View.MailNotice();
    });

})(jQuery, _, M139);