

(function (jQuery, _, M139, top) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    window.SiteConfig = window.SiteConfig || top.SiteConfig;
    M139.namespace('M2012.Calendar.View.AddBlackWhite', superClass.extend({
        template: {
            ERROR_TEXT: "添加失败，请稍后再试",

            MAIN: ['<div class="bw-text">',
                        '{tips}',
                        '<div class="saddpeowidth">',
                            '<div id="emptyTips" class="tips meet-tips hide">',
                                '<div class="tips-text">邮箱地址不能为空</div>',
                                '<div class="tipsBottom diamond"></div>',
                            '</div>',
                            '<input id="txtEmail" class="iText" type="text">',
                        '</div>',
                        '<p class="gray mt_10">添加多个139邮箱地址时，以分号隔开</p>',
                        '<div id="errorTips"></div>',
                    '</div>'].join(""),
            EMAIL_FORMAT_ERR: '<p class="red mt_10">邮件地址格式错误，如abc@139.com</p>'
        },
        types: {
            whitelist: {
                dialogTitle: "添加白名单",
                text: "白名单",
                tips: '<p>添加别人为白名单，可以自动<span class="ml_5 mr_5 c_009900" style="color: green;">接受</span>TA给您发送的所有日历消息请求。</p>',
                errorTips: '<p class="c_009900 mt_10">邮件地址已存在白名单内</p>',
                type: "1" //白名单标记位
            },
            blacklist: {
                dialogTitle: "添加黑名单",
                text: "黑名单",
                tips: '<p>添加别人为黑名单，可以自动<span class="ml_5 mr_5 red">屏蔽</span>TA给您发送的所有日历消息请求。</p>',
                errorTips: '<p class="c_009900 mt_10">邮件地址已存在黑名单内</p>',
                type: "2"
            }
        },
        /**
         * 黑白名单弹窗
         * @param {String} options.type 显示的类型，表示添加黑名单还是白名单，可选：blacklist/whitelist
         * @param {String} options.email 邮件地址，例如: 张三<zhangsan@139.com>
         * @example
         * new M2012.Calendar.View.AddBlackWhite({type:"whitelist"});
         */
        initialize: function (options) {
            var _this = this;
            options = options || {};

            _this.model = new M2012.Calendar.Model.BlackWhiteList();

            _this.currentType = _this.types[options.type] || _this.types.whitelist;
            _this.render();
        },
        render: function () {
            var _this = this;
            var template = _this.template;

            var dialogHtml = $T.format(template.MAIN, {
                tips: _this.currentType.tips
            });

            _this.dialog = $Msg.showHTML(dialogHtml,
                function (e) {
                    //确定
                    e.cancel = true; //点击确定时不关闭，等回调完成时再处理
                    _this.onConfirmClick(e);
                },
                function (e) {
                    //取消
                },
                {
                    width: '480px',
                    dialogTitle: _this.currentType.dialogTitle,
                    buttons: ['确定', '取消'],
                    onClose: function (e) {
                        _this.options.closeClick && _this.options.closeClick(e);
                    }
                });

            _this.initEvents();
        },
        initEvents: function () {
            var _this = this;
            var model = _this.model;

            var $dialogEl = _this.dialog.$el;

            //保存元素
            _this.dialog.errorTips = $dialogEl.find("#errorTips");
            _this.dialog.emptyTips = $dialogEl.find("#emptyTips");
            _this.dialog.input = $dialogEl.find("#txtEmail");
            _this.dialog.confirm = $dialogEl.find(".YesButton");

            _this.dialog.input.on("focus", function (e) {
                _this.dialog.emptyTips.addClass("hide");
            }).on("keyup", function (e) {
                if (e.keyCode == 13) {//Enter
                    _this.dialog.confirm.trigger("click");
                }
            });

            if (_this.options.email) {
                _this.dialog.input.val(_this.options.email);
            }
        },
        onConfirmClick: function (e) {
            var _this = this;

            if (_this.busy) {
                $Msg.alert("正在处理中，请稍后...");
                return;
            }

            var inputs = _this.dialog.input.val().replace("/\s/gi", "");
            if (inputs) {
                inputs = inputs.replace(/[,，;；]/gi, ";");
                var emails = inputs.split(";");
                var list = [];
                $(emails).each(function (i, item) {
                    if (item == '') return true; //下一个

                    if (_this.isLocalDomain(item)) {
                        list.push($T.Email.getEmail(item));
                    } else {
                        _this.dialog.errorTips.html(_this.template.EMAIL_FORMAT_ERR);
                        return false;
                    }
                });

                if (list.length == 0) {
                    _this.dialog.errorTips.html(_this.template.EMAIL_FORMAT_ERR);
                    return;
                }

                var params = {
                    type: _this.currentType.type,
                    email: list.join(",")
                };

                _this.busy = true; //标记繁忙
                _this.model.addBlackWhiteItem(params, function (result, json) {
                    _this.busy = false; //标记繁忙
                    //弹出提示框，提示某些邮箱添加失败
                    if (result && result.error && result.error.length > 0) {
                        new M2012.Calendar.View.ErrorList({
                            list: result.error,
                            onClose: function () {
                                _this.options.closeClick && _this.options.closeClick();
                            }
                        });
                        _this.dialog.close({ silent: true });
                        return;
                    }

                    //创建成功，关闭窗口，并打开黑白名单的窗口
                    _this.dialog.close();
                });
            } else {
                _this.dialog.emptyTips.removeClass("hide");
                M139.Dom.flashElement(_this.dialog.input.selector);
                _this.dialog.input.focus();
                return;
            }
        },
        isLocalDomain: function (email) {
            var domain = (window.SiteConfig && SiteConfig.mailDomain) || "139.com";
            return $T.Email.getDomain(email) == domain;
        }
    }));

    M139.namespace('M2012.Calendar.View.ErrorList', superClass.extend({
        template: {
            ERROR_TEXT: "添加失败，请稍后再试",

            MAIN: ['<div class="bw-text">',
                        '<p>以下邮箱地址未注册</p>',
                        '<div class="bw-table">',
                            '<div class="bw-table-t">邮箱地址</div>',
                            '{errorList}',
                        '</div>',
                    '</div>'].join(""),
            ERROR_ITEM: '<div class="bw-table-li">{email}</div>'
        },
        /**
         * 显示添加时的错误列表
         * @param {Array} options.list 错误的邮件列表(list中的数据为对象)
         * @param {Function} options.onClose 关闭按钮的回调
         */
        initialize: function (options) {
            var _this = this;
            options = options || {};
            if (!options.list) return;

            _this.list = options.list;
            _this.onClose = options.onClose || function () { };

            _this.render();
        },
        render: function () {
            var _this = this;
            var html = _this.joinHtml();
            $Msg.showHTML(html, {
                width: "480px",
                onClose: function () {
                    _this.onClose();
                },
                buttons:["确定"]
            })
        },
        joinHtml: function () {
            var _this = this;
            var template = _this.template;
            var listHtml = '';
            $(_this.list).each(function (i, item) {
                listHtml += $T.format(template.ERROR_ITEM, {
                    email: $T.Html.encode(item.email)
                });
            });

            var html = $T.format(template.MAIN, {
                errorList: listHtml
            });
            return html;
        }
    }));
})(jQuery, _, M139, window._top || window.top);