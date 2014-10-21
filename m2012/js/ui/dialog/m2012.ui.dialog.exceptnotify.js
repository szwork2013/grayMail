
(function ($, _, M) {
    var superClass = M.View.ViewBase;
    var namespace = "M2012.UI.Dialog.ExceptNotify";

    /**@lends M2012.UI.Dialog.ExceptNotify.prototype*/
    M.namespace(namespace, superClass.extend({

        name: namespace,

        /** 定义最近收到的邮件对话框
        *@constructs M2012.UI.Dialog.ExceptNotify
        *@extends M139.View.ViewBase
        *@param {Object} options 初始化参数集
        *@param {String} options.template 模板
        *@example
        */
        initialize: function (options) {
            this.value = options.value;
            this.limit = options.limit || 5;
            this.model = options.model;
            this.initEvent();
            return superClass.prototype.initialize.apply(this, arguments);
        },

        render: function () {
            var _this = this;
            var value = _this.value;

            var viewData = $.extend({
                email: value.emaillist[0],
                ranglimit: _this.limit
            }, value);

            var topHead = top.document.getElementsByTagName("HEAD")[0];
            var link = top.document.createElement("link");
            link.href = _this.stylesheet;
            link.type = "text/css";
            link.rel = "stylesheet";
            topHead.appendChild(link);
            _this.topHead = topHead;
            _this.link = link;
            var defaultText = viewData.notifytype == 1 ? "短信到达通知" : "彩信到达通知";


            _this.dialog = $Msg.showHTML(_this.template(viewData), function (e) {
                _this.actionHandler.onsave(0, _this, e, defaultText);
            }, function (e) {
                _this.actionHandler.oncancel(0, _this);
            }, null, {
                width: 540,
                buttons: ["确定", "取消"],
                dialogTitle: "详细设置"
            });

            _this.setElement(_this.dialog.el);
            _this.trigger("rendered", viewData);
        },

        initEvent: function () {
            var _this = this;

            _this.on("print", function () {
                _this.render();
            });

            _this.on("success", function () {
                _this.dialog.close();
            });

            renderHandler = _this.renderHandler;

            _this.on("rendered", function (viewData) {
                renderHandler.showTypeMenu(viewData, _this);
                renderHandler.showRangeAction(viewData, _this);
                renderHandler.showNotifySwitch(viewData, _this);
            });

            _this.on("modifyed", function () {
                renderHandler.showButton(_this);
            });
        },

        renderHandler: {

            /** 显示类型菜单
            *@param {Object} viewData 视图数据
            *@param {this} context 传递this
            */
            showTypeMenu: function (viewData, context) {
                var _parent = context.$el;
                var typefield = _parent.find("#typefield");

                menu = new M2012.Settings.View.NotifyMenu({
                 //   container: typefield, showClose: false, root: top.$App.getResourceHost() 去掉。。。
					container: typefield, root: top.$App.getResourceHost()
                });

                menu.on("change", function (value) {
                    context.dataHandler.modifytype({
                        "value": value,
                        "success": function (rs) { }
                    }, context);
                });

                if (viewData.notifytype === 0) {
                    viewData.notifytype = 1;
                }

                menu.model.set({ value: viewData.notifytype });
            },

            /** 显示是否接收
            *@param {Object} viewData 视图数据
            *@param {this} context 传递this
            */
            showNotifySwitch: function (viewData, context) {
                var _parent = context.$el;
                var rdoSwitch = _parent.find("#notifyswitch :radio");

                rdoSwitch.click(function (e) {
                    if (e.target.value == "open") {
                        _parent.find(".j_disablefield").show();
                    } else {
                        _parent.find(".j_disablefield").hide();
                    }
                });
            },

            /** 时段表格当前行显示操作项
            *@param {Object} viewData 视图数据
            *@param {this} context 传递this
            */
            showRangeAction: function (viewData, context) {
                var on = "on", cmd = ".j_cmd", flag = "range_row_", ROW = "TR";
                var _this = this;
                var _parent = context.$el;
                var rangetable = _parent.find(".setnotifytb");

                rangetable.mouseover(function (e) {
                    var tr = _this._parent(e.target, ROW);
                    if (tr) {
                        tr = $(tr);
                        if (!tr.hasClass(on) && (tr.attr("class") || "").indexOf(flag) > -1) {
                            $(tr).addClass(on).find(cmd).show();
                        }
                    }
                });

                rangetable.mouseout(function (e) {
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

                rangetable.click(function (e) {
                    var link = $(e.target);

                    var cmd = link.data("cmd");
                    if (!cmd) {
                        return;
                    }

                    var tid = link.data("tid");
                    var page = link.data("pageIndex");

                    context.actionHandler["on" + cmd]({
                        "tid": tid, "value": viewData, "page": page, "event": e
                    }, context);

                });
            },

            /** 时段只有一行时，隐藏删除功能
            *@param {this} context 传递this
            */
            showButton: function (context) {
                var dialog = context.$el;
                var value = context.value;
                var range = value.timerange;
                if (range.length < 2) {
                    dialog.find("span.j_cmd").addClass("hide");
                }
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
            }
        },

        actionHandler: {

            /** 时段表格当前行显示操作项
            *@param {Object} args 事件参数
            *@param {this} context 传递this
            */
            onadd: function (args, context) {
                var id = "tr.range_row_addtion";
                var panel = $(context.template_range);
                var dialog = context.$el;
                var toolbar = dialog.find(id)

                var rangePicker = new M2012.Settings.View.TimeRangeSelector({
                    container: panel.children()
                });

                rangePicker.$el.find("#btnOk span").text("添 加");

                rangePicker.on("cancel", function () {
                    toolbar.removeClass("hide");
                    panel.remove();
                });

                rangePicker.on("submit", function (_args) {
                    window.console && console.log("range changed", _args);

                    var value = _args.value;

                    var tid = context.dataHandler.existrange(value, context);
                    if (tid) {
                        parent.M139.UI.TipMessage.show("已存在同样的时间段，请修改", { delay: 2000 });

                        dialog.find(".range_row_" + tid)
                            .css({ backgroundColor: "#fe9" })
                            .animate({ backgroundColor: "#fff" }, 1000);

                        return;
                    }

                    context.dataHandler.addrange({ "value": value, "success": function (result) {
                        _args.success();
                        toolbar.removeClass("hide");
                        panel.remove();
                        $.extend(result, value);
                        var viewData = result;

                        $(context.template_row(viewData)).insertAfter(toolbar.prev());

                        dialog.find(".j_cmd").filter(".hide").removeClass("hide");

                        if (result.lockadd) {
                            dialog.find(".range_row_addtion").addClass("hide");
                        }

                    }
                    }, context);
                });

                toolbar.addClass("hide");
                panel.insertAfter(toolbar);
            },

            /** 时段表格当前行显示操作项
            *@param {Object} args 事件参数
            *@param {this} context 传递this
            */
            onremove: function (args, context) {
                var id = "tr.range_row_" + args.tid;
                var dialog = context.$el;
                var rangetable = dialog.find(".setnotifytb");
                var toolbar = rangetable.find(id)

                context.dataHandler.removerange({
                    "tid": args.tid,
                    "success": function (rs) {
                        toolbar.fadeOut(666, function () {
                            toolbar.remove();
                        });

                        if (rs.lockdelete) {
                            rangetable.find("span.j_cmd").addClass("hide");
                        }

                        if (rs.showadd) {
                            rangetable.find(".range_row_addtion").removeClass("hide");
                        }
                    }
                }, context);
            },

            /** 展开时段修改面板
            *@param {Object} args 事件参数
            *@param {this} context 传递this
            */
            onmodify: function (args, context) {

                var id = "tr.range_row_" + args.tid;
                var dialog = context.$el;
                var toolbar = dialog.find(id)
                var btnAction = toolbar.find(".j_cmd");
                var panel = $(context.template_range);
                var oldValue = context.dataHandler.readrange(args, context);

                var rangePicker = new M2012.Settings.View.TimeRangeSelector({
                    container: panel.children(), value: oldValue
                });

                rangePicker.on("cancel", function () {
                    btnAction.removeClass("hide");
                    panel.remove();
                    context.trigger("modifyed");
                });

                rangePicker.on("submit", function (_args) {
                    window.console && console.log("range changed", _args);

                    var value = _args.value;

                    var tid = context.dataHandler.existrange(value, context);
                    if (tid && tid !== args.tid) {
                        parent.M139.UI.TipMessage.show("已存在同样的时间段，请修改", { delay: 2000 });

                        dialog.find(".range_row_" + tid)
                            .css({ backgroundColor: "#fe9" })
                            .animate({ backgroundColor: "#fff" }, 1000);

                        return;
                    }

                    dialog.find("#range_desc_" + args.tid).text(value.discription);
                    _args.success();

                    btnAction.removeClass("hide");
                    panel.remove();

                    context.dataHandler.modifyrange(value, context);
                    context.trigger("modifyed");
                });

                btnAction.addClass("hide");
                panel.insertAfter(toolbar);
            },

            /** 点确定按钮保存操作
            *@param {Object} args 事件参数
            *@param {this} context 传递this
            */
            onsave: function (args, context, e, defaultText) {

                var dialog = context.$el;
                var value = context.value;

                var opened = dialog.find("#notifyswitch :radio:checked").val() == "open";
                value.enable = opened;

                if (!opened) {
                    context.value.notifytype = 0;
                }

                var supply = (dialog.find(":checkbox").attr("checked") == "checked");
                value.supply = supply;
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
                        var text = { sms: "短信到达通知", mms: "彩信到达通知" }
                        var type = { sms: 1, mms: 2 }
                        if (dialog.find(".dropDownText").text() == text.sms) {
                            value.notifytype = type.sms;
                        }
                        if (dialog.find(".dropDownText").text() == text.mms) {
                            value.notifytype = type.mms;
                        }
                        if (value.notifytype == 4) {
                            e.cancel = true;
                            var msgAlert = confirm(
                        "短信邮件为5元版与20元版邮箱专属功能。立即升级，重新登录即可使用。",
                        function () {
                            $(".boxIframe").remove();
                            $(".winTip").remove();
                            $(".layer_mask").remove();
                            if (top.$User) { top.$App.show("mobile") } else { top.Links.show('orderinfo') };
                        },
                        function () {
                            dialog.find(".dropDownText").text(defaultText);
                        },
                        confirmJson);
                            return;
                        }
                    }
                }

                context.trigger("success", context, value);
                context.model.trigger("saved");
                var topHead = context.topHead;
                topHead.removeChild(context.link);
            },

            /** 点取消按钮保存操作
            *@param {Object} args 事件参数
            *@param {this} context 传递this
            */
            oncancel: function (args, context) {
                context.trigger("cancel", context);
                var topHead = context.topHead;
                topHead.removeChild(context.link);
            }

        },

        dataHandler: {

            /** 添加新时段
            *@param {Object} args 事件参数
            *@param {this} context 传递this
            */
            addrange: function (args, context) {
                var model = this.model;
                var value = args.value;
                var timerange = context.value.timerange;

                var dh = this;
                var tid = dh._tid(timerange[0].tid);

                var maxrangeid = this._maxId($.map(timerange, function (j) {
                    return dh._tid(j.tid).rangeindex;
                }));

                tid = dh._tid(tid.notifyindex, maxrangeid + 1), //notifyindex, rangeindex
                value.tid = tid;
                timerange.push(value);

                window.console && console.log("range added:", value, timerange);

                args.success({ lockadd: timerange.length >= context.limit });
            },

            /** 读取指定时段
            *@param {Object} args 事件参数
            *@param {this} context 传递this
            */
            readrange: function (args, context) {
                var value = {};
                var timerange = context.value.timerange;
                for (var i = 0; i < timerange.length; i++) {
                    if (timerange[i].tid == args.tid) {
                        $.extend(value, timerange[i]);
                        break;
                    }
                }
                return value;
            },

            /** 修改指定时段
            *@param {Object} args 事件参数
            *@param {this} context 传递this
            */
            modifyrange: function (args, context) {
                var timerange = context.value.timerange;
                for (var i = 0; i < timerange.length; i++) {
                    if (timerange[i].tid == args.tid) {
                        $.extend(timerange[i], args)
                        break;
                    }
                }
            },

            /** 删除指定时段
            *@param {Object} args 事件参数
            *@param {this} context 传递this
            */
            removerange: function (args, context) {
                var timerange = context.value.timerange;
                for (var i = timerange.length; i--; ) {
                    if (timerange[i].tid == args.tid) {
                        timerange.splice(i, 1);
                        break;
                    }
                }
                args.success({ lockdelete: timerange.length < 2, showadd: timerange.length <= context.limit });
            },

            /** 是否存在给定时段
            *@param {Object} args 事件参数
            *@param {this} context 传递this
            */
            existrange: function (args, context) {
                var timerange = context.value.timerange;
                for (var i = 0; i < timerange.length; i++) {
                    if (this._comparerange(timerange[i], args)) {
                        return timerange[i].tid;
                        break;
                    }
                }
                return false;
            },

            /** 修改提醒方式
            *@param {Object} args 事件参数
            *@param {this} context 传递this
            */
            modifytype: function (args, context) {
                context.value.notifytype = args.value;
                args.success({ "success": true, "value": context.value });
            },

            _comparerange: function (range1, range2) {
                return range1.begin === range2.begin && range1.end === range2.end && range1.weekday === range2.weekday;
            },

            _tid: function (tid) {
                if (arguments.length > 1) {
                    return (function (notifyindex, rangeindex) {
                        return ["tid", 2, notifyindex, rangeindex].join("_");
                    }).apply(this, arguments);
                }

                tid = tid.split("_");
                return { "fromtype": parseInt(tid[1]), "notifyindex": parseInt(tid[2]), "rangeindex": parseInt(tid[3]) };
            },

            _maxId: function (array) {
                return array.sort(function (a, b) { return b - a })[0];
            }
        },

        // template //{

        template_range: '<tr><td colspan="2" style="padding-left:0;"><!--rangePicker--></td></tr>',

        template_row: _.template([
                            '<tr class="range_row_<%= tid %>">',
                                '<td id="range_desc_<%= tid %>"><%= discription %></td>',
                                '<td class="td1">',
                                    '<span class="j_cmd <%= (lockadd ? \'hide\' : \'\') %>" style="display:none"><a data-cmd="remove" data-tid="<%= tid %>" href="javascript:void(0)">删除</a> | </span>',
                                    '<a class="j_cmd" style="display:none" data-cmd="modify" data-tid="<%= tid %>" href="javascript:void(0)">修改</a> ',
                                '</td>',
                            '</tr>'].join("")),

        template: _.template([
            '<div class="notify-boxf form-notify2">',
                '<!--[if lt ie 8]><div style="+zoom:1;"><![endif]-->',
                '<ul class="form">',
                '<li class="formLine">',
                    '<label class="label">发件人：</label>',
                    '<div class="element">',
                        '<input type="email" class="iText" value="<%= $TextUtils.htmlEncode(email) %>" readonly >',
                    '</div>',
                '</li>',
                '<li class="formLine">',
                    '<label class="label">是否接收：</label>',
                    '<div class="element" id="notifyswitch">',
                        '<input id="notifyswitch1" name="notifyswitch" class="mr_5" type="radio" value="open" <%= (enable ? \'checked\' : \'\') %> ><label class="mr_10" for="notifyswitch1">接收</label>',
                        '<input id="notifyswitch0" name="notifyswitch" class="mr_5" type="radio" value="close" <%= (!enable ? \'checked\' : \'\') %>><label for="notifyswitch0">不接收</label>',
                    '</div>',
                '</li>',
                '<li <%= (!enable ? \'style="display:none"\' : \'\') %> class="formLine j_disablefield">',
                    '<label class="label">接收方式：</label>',
                    '<div class="element" id="typefield"><!--notifytypeMenu--></div>',
                '</li>',
                '<li <%= (!enable ? \'style="display:none"\' : \'\') %> class="formLine j_disablefield">',
                    '<label class="label">接收时段：</label>',
                    '<div class="element">',
                        '<table class="setnotifytb">',
                        '<tbody>',
                        '<% _.each(timerange, function(range) { %>',
                            '<tr class="range_row_<%= range.tid %>">',
                                '<td id="range_desc_<%= range.tid %>"><%= range.discription %></td>',
                                '<td class="td1">',
                                    '<span class="j_cmd <%= (timerange.length < 2 ? \'hide\' : \'\') %>" style="display:none"><a data-cmd="remove" data-tid="<%= range.tid %>" href="javascript:void(0)">删除</a> | </span>',
                                    '<a class="j_cmd" style="display:none" data-cmd="modify" data-tid="<%= range.tid %>" href="javascript:void(0)">修改</a> ',
                                '</td>',
                            '</tr>',
                        '<% }); %>',
                        '<tr class="range_row_addtion <%= (timerange.length >= ranglimit ? \'hide\' : \'\') %>">',
                            '<td colspan="2"><a id="btnAdd" data-cmd="add" href="javascript:void(0)">添加</a></td>',
                        '</tr>',
                        '</tbody>',
                        '</table>',
                        '<div><label class="mr_5"><input type="checkbox" value="<%= supply %>" <%= supply ? \'checked\' : \'\' %> class="mr_5">补发</label><span class="gray">(如上述时段外有来信，在下一接受时间补发通知)</span></div>',
                    '</div>',
                '</li>',
                '</ul>',
                '<!--[if lt ie 8]></div><![endif]-->',
            '</div>'].join('')),

        stylesheet: '/m2012/css/module/set.css'

        //}

    }));

})(jQuery, _, M139);
