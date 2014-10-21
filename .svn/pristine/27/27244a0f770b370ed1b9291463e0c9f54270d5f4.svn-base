

(function ($, _, M139, top) {
    var className = "M2012.Calendar.View.RejectReason";

    M139.namespace(className, Backbone.View.extend({
        name: className,
        templates: {
            MAIN: '<textarea class="iText box-area" name="rejectreason"></textarea>'
        },
        configs: {
            defaultTip: '谢绝原因（50个字）',
            defaultName: 'calendar_popup_reject_reason'
        },
        /**
         * 
         * @param options.container {Object} 点击时需要弹出本冒泡的对象(jQuery对象)
         * @param options.onsubmit {Function} 可选参数, 点击确定时的回调
         * @param options.oncancel {Function} 可选参数, 点击取消时的回调
         * @param options.maxLen {Int} 可选参数,最大输入长度,默认50
         */
        initialize: function (options) {
            if (options && options.container) {
                this.container = options.container || options.target;
                this.onsubmit = options.onsubmit || $.noop;
                this.oncancel = options.oncancel || $.noop;
                this.defaultTip = options.defaultTip || this.configs.defaultTip;
                this.maxLen = options.maxLen || 50;

                this.render();
                this.initEvents();
            } else {
                throw new Error('container is empty')
            }
        },
        render: function () {
            var _this = this;

            _this.popup = M139.UI.Popup.create({
                name: _this.configs.defaultName, //单显
                target: _this.container,
                content: _this.templates.MAIN,
                //direction: 'up', //默认向上显示
                autoHide: true, //自动隐藏
                buttons: [
                    { text: "确定", cssClass: "btnSure", click: function () { _this.submit(); } },
                    { text: "取消", click: function () { _this.cancel(); } }
                ],
                noClose: true //不要关闭按钮
            });
            _this.popup.render();
        },
        initEvents: function () {
            var textarea = this.popup.contentElement.find("textarea");
            var defaultText = this.defaultTip; //默认提示语

            this.textarea = textarea; //保存,方便在确定时使用
            textarea.on("focus", function () {
                var txt = textarea.val();
                if (txt == defaultText) {
                    textarea.removeClass("gray").val("");
                }
            }).on("blur", function () {
                var txt = textarea.val();
                if (txt.replace(/\s/gi, '') == '') {
                    textarea.addClass("gray").val(defaultText);
                }
            });

            try { M139.Dom.setTextBoxMaxLength(textarea, this.maxLen); } catch (e) { } //记得彩云有兼容问题

            textarea.trigger("blur");
        },
        submit: function () {
            var txt = this.textarea.val(),
                data = { reason: (txt == this.defaultTip ? '' : txt) }; //如果是默认的提示语就清空

            this.onsubmit(data);
            this.popup.close();
        },
        cancel: function () {
            this.oncancel();
            this.popup.close();
        }
    }));

})(jQuery, _, M139, (window._top || window.top));