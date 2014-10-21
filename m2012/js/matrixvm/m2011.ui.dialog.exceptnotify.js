
(function ($, _, M) {
    var superClass = M.View.ViewBase;
    var namespace = "M2011.UI.Dialog.ExceptNotify";

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
            this.el = options.container;
            this.template = options.template;
            this.initEvent(options);
            return superClass.prototype.initialize.apply(this, arguments);
        },

        render: function (options) {
            var _this = this;
            var value = _this.value;

            var viewData = $.extend({
                email: value.emaillist[0],
                ranglimit: _this.limit
            }, value);
            
            _this.el.html(_this.template.detail(viewData));
            
            options.btnOk.click(function(){
                _this.actionHandler.onsave(0, _this);
            });

            options.btnCancel.click(function(){
                _this.trigger("cancel");
            });

            _this.trigger("rendered", viewData);
        },

        initEvent: function (options) {
            var _this = this;

            _this.on("print", function () {
                _this.render(options);
            });

            renderHandler = _this.renderHandler;

            _this.on("rendered", function (viewData) {
                renderHandler.showTypeMenu(viewData, _this);
                renderHandler.showRangeAction(viewData, _this);
                renderHandler.showNotifySwitch(viewData, _this);
            });

            _this.on("modifyed", function() {
                renderHandler.showButton(_this);
            });
        },

        renderHandler: {

            /** 显示类型菜单
             *@param {Object} viewData 视图数据
             *@param {this} context 传递this
             */
            showTypeMenu: function(viewData, context) {
                var _parent = context.el;
                var typefield = _parent.find("#typefield");

                var menu = new M2012.Settings.View.NotifyMenu({
                    container: typefield, showClose: false, root: top.getResourceHost()
                });

                menu.on("change", function(value){
                    context.dataHandler.modifytype({
                        "value": value,
                        "success": function(rs) {}
                    }, context);
                });

                if (viewData.notifytype === 0) {
                    viewData.notifytype = 1;
                }

                menu.model.set({value: viewData.notifytype});
            },

            /** 显示是否接收
             *@param {Object} viewData 视图数据
             *@param {this} context 传递this
             */
            showNotifySwitch: function(viewData, context) {
                var _parent = context.el;
                var rdoSwitch = _parent.find("#notifyswitch :radio");

                rdoSwitch.click(function(e){
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
            showRangeAction: function(viewData, context) {
                var on = "on", cmd = ".j_cmd", flag = "range_row_", ROW = "TR";
                var _this = this;
                var _parent = context.el;
                var rangetable = _parent.find(".setnotifytb");

                rangetable.mouseover(function(e){
                    var tr = _this._parent(e.target, ROW);
                    if (tr) {
                        tr = $(tr);
                        if (!tr.hasClass(on) && (tr.attr("class") || "").indexOf(flag) > -1) {
                            $(tr).addClass(on).find(cmd).show();
                        }
                    }
                });

                rangetable.mouseout(function(e){
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

                rangetable.click(function(e){
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
            showButton: function(context) {
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
                for(var i=0xFF; i--; ) {
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
            onadd: function(args, context) {
                var id = "tr.range_row_addtion";
                var panel = $(context.template.range);
                var dialog = context.el;
                var toolbar = dialog.find(id)

                var rangePicker = new M2012.Settings.View.TimeRangeSelector({
                    container: panel.children()
                });

                rangePicker.$el.find("#btnOk span").text("添 加");

                rangePicker.on("cancel", function(){
                    toolbar.removeClass("hide");
                    panel.remove();
                });

                rangePicker.on("submit", function(_args){
                    window.console && console.log("range changed", _args);

                    var value = _args.value;

                    var tid = context.dataHandler.existrange(value, context);
                    if (tid) {
                        top.FF.alert("已存在同样的时间段，请修改", { delay:2000 });

                        dialog.find(".range_row_" + tid)
                            .css({backgroundColor:"#fe9"})
                            .animate({backgroundColor: "#fff"}, 1000);

                        return;
                    }

                    context.dataHandler.addrange({"value": value, "success": function(result){
                        _args.success();
                        toolbar.removeClass("hide");
                        panel.remove();
                        $.extend(result, value);
                        var viewData = result;

                        $(context.template.row(viewData)).insertAfter(toolbar.prev());

                        dialog.find(".j_cmd").filter(".hide").removeClass("hide");

                        if (result.lockadd) {
                            dialog.find(".range_row_addtion").addClass("hide");
                        }

                    }}, context);
                });

                toolbar.addClass("hide");
                panel.insertAfter(toolbar);
            },

            /** 时段表格当前行显示操作项
             *@param {Object} args 事件参数
             *@param {this} context 传递this
             */
            onremove: function(args, context) {
                var id = "tr.range_row_" + args.tid;
                var dialog = context.el;
                var rangetable = dialog.find(".setnotifytb");
                var toolbar = rangetable.find(id)

                context.dataHandler.removerange({
                    "tid": args.tid,
                    "success": function(rs) {
                        toolbar.fadeOut(666, function(){
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
            onmodify: function(args, context) {

                var id = "tr.range_row_" + args.tid;
                var dialog = context.el;
                var toolbar = dialog.find(id)
                var btnAction = toolbar.find(".j_cmd");
                var panel = $(context.template.range);
                var oldValue = context.dataHandler.readrange(args, context);

                var rangePicker = new M2012.Settings.View.TimeRangeSelector({
                    container: panel.children(), value: oldValue
                });

                rangePicker.on("cancel", function(){
                    btnAction.removeClass("hide");
                    panel.remove();
                    context.trigger("modifyed");
                });

                rangePicker.on("submit", function(_args){
                    window.console && console.log("range changed", _args);

                    var value = _args.value;

                    var tid = context.dataHandler.existrange(value, context);
                    if (tid && tid !== args.tid) {
                        top.FF.alert("已存在同样的时间段，请修改", { delay:2000 });

                        dialog.find(".range_row_" + tid)
                            .css({backgroundColor:"#fe9"})
                            .animate({backgroundColor: "#fff"}, 1000);

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
            onsave: function(args, context) {

                var dialog = context.el;
                var value = context.value;

                var opened = dialog.find("#notifyswitch :radio:checked").val() == "open";
                value.enable = opened;

                if (!opened) {
                    context.value.notifytype = 0;
                }

                var supply = (dialog.find(":checkbox").attr("checked") == "checked");
                value.supply = supply;

                context.trigger("success", context, value);
            },

            /** 点取消按钮保存操作
             *@param {Object} args 事件参数
             *@param {this} context 传递this
             */
            oncancel: function(args, context) {
                context.trigger("cancel", context);
            }

        },

        dataHandler: {

            /** 添加新时段
             *@param {Object} args 事件参数
             *@param {this} context 传递this
             */
            addrange: function(args, context) {
                var model = this.model;
                var value = args.value;
                var timerange = context.value.timerange;

                var dh = this;
                var tid = dh._tid(timerange[0].tid);

                var maxrangeid = this._maxId($.map(timerange, function(j){
                    return dh._tid(j.tid).rangeindex;
                }));

                tid = dh._tid(tid.notifyindex, maxrangeid + 1), //notifyindex, rangeindex
                value.tid = tid;
                timerange.push(value);

                window.console && console.log("range added:", value, timerange);

                args.success({ lockadd: timerange.length >= context.limit});
            },

            /** 读取指定时段
             *@param {Object} args 事件参数
             *@param {this} context 传递this
             */
            readrange: function(args, context) {
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
            modifyrange: function(args, context) {
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
            removerange: function(args, context) {
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
            existrange: function(args, context) {
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
            modifytype: function(args, context) {
                context.value.notifytype = args.value;
                args.success({ "success": true, "value": context.value });
            },

            _comparerange: function(range1, range2) {
                return range1.begin === range2.begin && range1.end === range2.end && range1.weekday === range2.weekday;
            },

            _tid: function(tid) {
                if (arguments.length > 1) {
                    return (function(notifyindex, rangeindex){
                        return ["tid", 2, notifyindex, rangeindex].join("_");
                    }).apply(this, arguments);
                }

                tid = tid.split("_");
                return { "fromtype": parseInt(tid[1]), "notifyindex": parseInt(tid[2]), "rangeindex": parseInt(tid[3]) };
            },

            _maxId: function(array) {
                return array.sort(function(a,b){return b-a})[0];
            }
        }

    }));

})(jQuery, _, M139);
