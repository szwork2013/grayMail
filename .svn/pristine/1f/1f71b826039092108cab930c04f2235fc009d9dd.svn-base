

(function (jQuery, _, M139, top) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var master = window.$Cal;

    M139.namespace('M2012.Calendar.View.BlackWhiteList', superClass.extend({
        template: {
            dialogTitle: "日历黑白名单管理",
            BLACK_TEXT: "黑名单",
            WHITE_TEXT: "白名单",
            ERROR_TEXT: "获取黑白名单失败，请稍后再试",

            MAIN: ['<div class="bw-name">',
                        '<ul>',
                            '<li id="whiteTitle" data-type="whiteitems"><a href="javascript:void(0)">日历白名单</a></li>',
                            '<li id="blackTitle" data-type="blackitems"><a href="javascript:void(0)">日历黑名单</a></li>',
                        '</ul>',
                    '</div>',
                    '<div id="popup_white_list" class="bw-text hide">',
                        '<p>添加别人为白名单，可以自动<span class="ml_5 mr_5 c_009900">接受</span>TA给您发送的所有日历消息请求。</p>',
                        '<p class="mt_5"><a id="addwhitelist" data-type="whitelist" href="javascript:void(0)">+添加白名单</a></p>',
                        '{whiteListHtml}', //白名单列表
                    '</div>',
                    '<div id="popup_black_list" class="bw-text">',
                        '<p>添加别人为黑名单，可以自动<span class="ml_5 mr_5 red">屏蔽</span>TA给您发送的所有日历消息请求。</p>',
                        '<p class="mt_5"><a id="addblacklist" data-type="blacklist" href="javascript:void(0)">+添加黑名单</a></p>',
                        '{blackListHtml}', //黑名单列表
                    '</div>'].join(""),
            LIST_TEMPLATE: ['<div class="bw-table">',
                                '<div class="bw-table-t">',
                                    '<div data-type="tips" class="tips meet-tips hide">',
                                        '<div class="tips-text">请先选择</div>',
                                        '<div class="tipsBottom diamond"></div>',
                                    '</div>',
                                    '<input data-cmd="selectAll" class="mr_5" type="checkbox"><label class="mr_5" for="">全选</label>',
                                    '<a data-cmd="deleteSelected" data-type="{type}" href="javascript:void(0)">删除</a>',
                                '</div>',
                                '<div class="bw-table-ul">',
                                    '{itemList}', //黑白名单列表
                                '</div>',
                            '</div>'].join(""),
            ITEM: '<div class="bw-table-li"><input class="mr_5" type="checkbox" data-type="item" data-uin="{uin}"><label for="">{name}&lt;{email}&gt;</label></div>'
        },
        types:{
            blacklist: {
                TEXT: "黑名单",
                KEY: "blacklist",
                type: 2,
                emptyHtml: '<div class="bw-empty">黑名单为空</div>'
            },
            whitelist: {
                TEXT: "白名单",
                KEY: "whitelist",
                type: 1,
                emptyHtml: '<div class="bw-empty">白名单为空</div>'
            }
        },
        /**
         * 黑白名单弹窗
         * @param {String} options.type 默认展开的类型,默认为白名单,可选参数: whitelist/blacklist
         * @example
         * new M2012.Calendar.Popup.BlackWhiteList.View();
         *
         *
         */
        initialize: function (options) {
            var _this = this;
            options = options || {};
            _this.defaultType = _this.types[options.type] || _this.types.whitelist;//默认打开白名单,除非有设定
            _this.master = options.master;

            _this.model = new M2012.Calendar.Model.BlackWhiteList({ master: _this.master });

            //监听一些失败的情况
            _this.listenOnError();

            _this.model.getBlackWhiteList(function (data) {
                _this.render();
            });
        },
        listenOnError: function () {
            var _this = this;
            var model = _this.model;

            model.on("onfail,onerror", function () {
                top.M139.UI.TipMessage.show(_this.template.ERROR_TEXT, { delay: 3500, className: "msgRed" });
                _this.busy = false;
            });
        },
        render: function () {
            var _this = this;
            var model = _this.model;
            var template = _this.template;

            var whitelist = model.get("whitelist"),
                blacklist = model.get("blacklist");
            var whiteListHtml = _this.joinHtml(whitelist, _this.types.whitelist);
            var blackListHtml = _this.joinHtml(blacklist, _this.types.blacklist);

            var dialogHtml = $T.format(template.MAIN, {
                whiteListHtml: whiteListHtml,
                blackListHtml: blackListHtml
            });

            _this.dialog = $Msg.showHTML(dialogHtml,
                {
                    width: '480px',
                    dialogTitle: template.dialogTitle
                });

            _this.initEvents();
        },
        initEvents: function () {
            var _this = this;
            var $dialogEl = _this.dialog.$el;
            var dialog = _this.dialog;

            //保存元素
            dialog.li = $dialogEl.find("#whiteTitle,#blackTitle");
            dialog.whitelist = $dialogEl.find("#whiteTitle");
            dialog.blacklist = $dialogEl.find("#blackTitle");

            dialog.allList = $dialogEl.find("#popup_white_list,#popup_black_list");
            dialog.add = $dialogEl.find("#addwhitelist,#addblacklist");

            dialog.whiteitems = $dialogEl.find("#popup_white_list");
            dialog.blackitems = $dialogEl.find("#popup_black_list");

            //标签切换
            dialog.li.off("click").on("click", function (e) {
                dialog.li.removeClass("on");
                var li = $(this);
                li.addClass("on");

                //显示对应列表的内容
                var type = li.attr("data-type");
                dialog.allList.addClass("hide");
                dialog[type].removeClass("hide");
            });

            //添加黑白名单按钮点击
            dialog.add.off("click").on("click", function (e) {
                var type = $(this).attr("data-type");
                dialog.close();

                new M2012.Calendar.View.AddBlackWhite({
                    type: type,
                    closeClick: function (e) {
                        //TODO 显示黑白名单，等于new一个自己的实例
                        new M2012.Calendar.View.BlackWhiteList({ master: master, type: type });
                    }
                });
            });

            $dialogEl.find(".bw-table").off("click").on("click", function (e) {
                var sender = $(e.target);
                var container = sender.closest(".bw-table");
                var cmd = sender.attr("data-cmd"),
                    type = sender.attr("data-type");
                if (cmd) {
                    _this[cmd](container, type);
                }
            });

            //dialog.whiteTitle.trigger("click"); //显示白名单
            dialog[_this.defaultType.KEY].trigger("click"); //根据参数显示黑白名单

            ////极端情况，至少看到标题栏，起码可以关掉弹窗
            try {
                setTimeout(function () {
                    var top = parseInt($dialogEl.css("top"));
                    if (top <= 0) {
                        $dialogEl.css("top", 10);
                    }
                }, 250);
            }
            catch (e) { }
        },
        joinHtml: function (obj, currentType) {
            var _this = this;
            var itemTemplate = _this.template.ITEM;
            var html = '';
            if (obj && obj.length > 0) {
                var lists = '';
                $(obj).each(function (i, item) {
                    lists += $T.format(itemTemplate, {
                        name: $T.Html.encode(item.name),
                        email: $T.Html.encode(item.email),
                        uin: item.uin
                    });
                });
                html = $T.format(_this.template.LIST_TEMPLATE, {
                    itemList: lists,
                    type: currentType.KEY
                });
            } else {
                html = currentType.emptyHtml;
            }
            return html;
        },
        deleteSelected: function (container,type) {
            var _this = this;

            var chkList = container.find("input[data-type='item']:checked");
            var uins = [];
            chkList.each(function (i, item) {
                uins.push($(this).attr("data-uin"));
            });

            if (uins.length > 0) {
                _this.model.delBlackWhiteItem({
                    uin: uins.join(",")
                }, function (result, json) {
                    chkList.parent().remove();

                    //为空就要显示空白
                    if (container.find("input[data-type='item']").size() == 0) {
                        var currentType = _this.types[type];
                        container.after(currentType.emptyHtml);
                        container.remove();
                    }
                });
            } else {
                var tips = container.find("div[data-type='tips']");
                tips.removeClass("hide");

                if (_this.timer) {
                    clearTimeout(_this.timer);
                    _this.timer = null;
                }

                _this.timer = setTimeout(function () {
                    tips.addClass("hide");
                }, 1500);
            }
        },
        selectAll: function (container) {
            var _this = this;

            var checked = !!(container.find("input[data-cmd='selectAll']").attr("checked"));
            container.find("input[data-type='item']").attr("checked", checked); //全选
        }
    }));
})(jQuery, _, M139, window._top || window.top);