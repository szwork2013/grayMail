
/**
 * 拒绝原因
 * @param target {HTMLElement} 需要弹窗的对象,会将html模板添加到对象后面
 * @param onSubmit {Function} 点击确定时的回调,会传入谢绝原因字符串
 * 
 * examples:
 * new RefusePopup({
 *     target:document.getElementById(''),
 *     onSubmit:function(reason){
 *         alert(reason);
 *     }
 * });
 */
; (function ($) {
    function RefusePopup(options) {
        var _this = this;
        _this.options = options;
        _this.callback = options.onSubmit || $.noop;
        _this.all = $("a", document);
        _this.target = $(options.target);
        _this.$el = $(_this.template);
        _this.textarea = _this.$el.find('textarea');
        _this.submit = _this.$el.find('#submit');
        _this.cancel = _this.$el.find('#cancel');

        _this.target.after(_this.$el);

        //计算偏移
        var offset = _this.target.offset();
        var currentTop = offset.top - _this.$el.height() - 10; //稍微偏上
        _this.$el.css('top', currentTop);

        //事件绑定
        bindEvents();

        //关闭浮层
        function closePopup() {
            _this.$el.remove();
        }

        function bindEvents() {
            //页面内点击隐藏浮层
            $(document.body).on('click', function (e) {
                closePopup();
            });

            //在浮层内点击取消事件冒泡
            _this.$el.on('click', function (e) {
                e.stopPropagation(); //阻止冒泡
            });

            //点击确定,回调
            _this.submit.on('click', function (e) {
                var reason = _this.textarea.val();
                reason = reason == _this.placeholderText ? '' : reason; //去掉默认的placeholder
                _this.callback(reason);
                closePopup();
            });

            //点击取消
            _this.cancel.on('click', function () {
                closePopup();
            });

            //给按钮绑定事件
            _this.all.on('click', function () {
                closePopup();
            });

            //设置最大输入长度
            try { top.M139.Dom.setTextBoxMaxLength(_this.textarea, _this.maxLength); } catch (e) { }

            //placeholder
            if (isSupportPlaceholder()) {
                _this.textarea.attr('placeholder', _this.placeholderText).css('color', _this.normalColor);
            } else {
                _this.textarea.on('focus', function (e) {
                    var input = $(this);
                    var text = input.val();
                    if (text == _this.placeholderText) {
                        input.val('').css('color', _this.normalColor);
                    }
                }).on('blur', function (e) {
                    var input = $(this);
                    var text = input.val();

                    if (text.replace(/\s/gi, '') == '') {
                        input.val(_this.placeholderText).css('color', _this.placeholderColor);
                    }
                });

                setTimeout(function () {
                    _this.textarea.trigger('blur');
                }, 0xff);
            }
        }

        function isSupportPlaceholder() {
            return 'placeholder' in document.createElement('input');
        }
    }

    RefusePopup.prototype.placeholderText = '谢绝原因（50个字）';
    RefusePopup.prototype.maxLength = 50; //最大输入长度
    RefusePopup.prototype.normalColor = '#000';
    RefusePopup.prototype.placeholderColor = '#999';
    RefusePopup.prototype.template = ['<div style="z-index: 1001; width: 342px; top: -155px; left: 53px; position:absolute;background: #FEFEFE;border:1px solid #cecece;padding:3px 6px; color:#666; -moz-box-shadow:0 0 5px #cecece; -webkit-box-shadow:0 0 5px #cecece; box-shadow:0 0 5px #cecece; -moz-border-radius:3px; -webkit-border-radius:3px; border-radius:3px; padding:0; margin:0;">',
                     '<div style=" margin:0; padding:0;">',
                         '<div style="padding:10px 10px 5px 10px; margin:0; background-color:#fafafa; -moz-border-radius:3px 3px 0 0; -webkit-border-radius:3px 3px 0 0;  border-radius:3px 3px 0 0;">',
                             '<div style="overflow:hidden;zoom:1; margin:0; padding:0;">',
                                 '<div style="overflow:hidden;zoom:1; margin:0; padding:0;">',
                                     '<textarea style="font:12px/1.5 \'Microsoft YaHei\',Verdana,\'Simsun\';border:1px solid #c5c5c5;border-top-color:#c6c6c6;border-right-color:#dadada;border-bottom-color:#dadada;padding:4px 5px;height:15px; width: 310px;height: 70px;margin: 8px 0; resize:none; overflow:auto; color:#999;">',
                                         '',
                                     '</textarea>',
                                 '</div>',
                             '</div>',
                         '</div>',
                         '<div style="border-top:1px solid #e8e8e8;text-align:right;height:24px;background-color:#fff;position:relative;padding:6px; margin:0; -moz-border-radius:0 0 3px 3px; -webkit-border-radius:0 0 3px 3px; border-radius:0 0 3px 3px;">',
                             '<a id="submit" href="javascript:void(0)" style="height:24px; line-height:24px; color:#fff; background:#00BE16;  background: -moz-gradient(linear, 0 0, 0 100%, from(#00C417), to(#00B615)); background: -webkit-gradient(linear, 0 0, 0 100%, from(#00C417), to(#00B615));  background: linear-gradient(#00C417 0%,#00B615 100%); display:inline-block;cursor:pointer;padding:0 0 0 12px; margin:0; overflow:hidden;vertical-align:middle; _background:#00BE16; text-decoration:none;">',
                                 '<span style=" font:12px/1.5 \'Microsoft YaHei\',Verdana,\'Simsun\'; height:24px; line-height:24px; color:#fff; display:inline-block;padding:0 12px 0 0; margin:0;overflow:visible;text-align:center;vertical-align:top;white-space:nowrap;">',
                                     '确 定',
                                 '</span>',
                             '</a>',
                             '<a id="cancel" style="height:22px; line-height:22px; border:1px solid #e2e2e2; color:#666 !important; background:#F9F9F9; background: -moz-gradient(linear, 0 0, 0 100%, from(#FFFFFF), to(#F4F4F4)); background: -webkit-gradient(linear, 0 0, 0 100%, from(#FFFFFF), to(#F4F4F4));  background: linear-gradient(#FFFFFF 0%,#F4F4F4 100%); display:inline-block;cursor:pointer;height:22px;padding:0 0 0 12px;overflow:hidden;vertical-align:middle; margin:0 0 0 5px; text-decoration:none;"',
                             'href="javascript:void(0)">',
                                 '<span style="font:12px/1.5 \'Microsoft YaHei\',Verdana,\'Simsun\';  display:inline-block;line-height:24px;padding:0 12px 0 0;overflow:visible;text-align:center;vertical-align:top;white-space:nowrap;">',
                                     '取 消',
                                 '</span>',
                             '</a>',
                         '</div>',
                     '</div>',
                 '</div>'].join("");

    window.RefusePopup = RefusePopup; //污染window
})(window.jQuery || top.jQuery)
