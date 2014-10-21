/**
 * 自动适应高度的TextArea组件
 * 原理:复制TextArea控件的属性给一个display:none的div,通过判断div的高度和宽度来设置TextArea的对应属性或样式
 * 直接使用div是否为一个更好的解决方式???
 */
; (function ($, _, M139, top) {

    var className = "M2012.Calendar.View.AdaptiveTextArea";
    M139.namespace(className, Backbone.View.extend({
        name: className,
        configData: {
            defaults: {
                width: 600, //宽度
                rows: 1, //默认显示的行数
                placeholder: '', //默认的提示语
                maxrows: -1 //最大行数,-1表示不限制,自动适配
            },
            mimics: [ //用于将textarea的样式复制给div
				'paddingTop',
				'paddingRight',
				'paddingBottom',
				'paddingLeft',
				'fontSize',
				'lineHeight',
				'fontFamily',
				'width',
				'fontWeight',
				'border-top-width',
				'border-right-width',
				'border-bottom-width',
				'border-left-width',
				'borderTopStyle',
				'borderTopColor',
				'borderRightStyle',
				'borderRightColor',
				'borderBottomStyle',
				'borderBottomColor',
				'borderLeftStyle',
				'borderLeftColor'
            ]
        },
        /**
         * 自适应高度的TextArea组件
         * var textarea=new M2012.Calendar.View.AdaptiveTextArea({
         *     container:$("#div"), //必选,jq对象,包含组件的容器,一般是div
         *     width:600,           //组件宽度
         *     maxrows:4,           //可选,最大的行数,超过出现滚动条.如果<=0,则表示自适应不出现滚动条
         *     text:"默认内容",      //可选,初始化填充文字
         *     placeholder:""       //可选,placeholder
         * });
         * var text=textarea.get();
         */
        initialize: function (options) {
            var _this = this;
            options = $.extend(_this.configData.defaults, options || {}); //参数容错以及默认参数填充

            if (!options.container) {
                throw Error(_this.name + " without parameter: container");
            }

            if (options.maxrows > 0 && options.rows > options.maxrows) options.rows = options.maxrows; //最大行数,即高度
            _this.options = options;
            _this.render();
            _this.bindEvents();
        },
        render: function () {
            var _this = this,
                options = _this.options,
                mimics = _this.configData.mimics,

                div = $("<div />").css({
                    'position': 'absolute',
                    'display': 'none',
                    'word-wrap': 'break-word',
                    'white-space': 'pre-wrap'
                }),
                area = $("<textarea />").css({
                    "overflow-y": "none",
                    "overflow-x": "none",
                    "width": options.width
                });

            //渲染
            _this.textarea = area.appendTo(options.container);
            _this.div = div.appendTo(options.container);

            //同步样式属性等
            _this.textarea.attr({ "rows": options.rows });

            //样式是不会变的,所以render的时候设置一次即可
            var i = mimics.length;
            while (i--) {
                _this.div.css(mimics[i].toString(), _this.textarea.css(mimics[i].toString()));
            }

            //placeholder
            if (!_this.isSupportPlaceHolder()) {
                _this.setPlaceHolder(options.placeholder);
            }
        },
        bindEvents: function () {
            var _this = this,
                textarea = _this.textarea,
                div = _this.div;

            textarea.bind("keyup change cut resize update", function () {
                _this.updateInnerDiv();
            }).bind("input paste", function () {
                setTimeout(function () {
                    _this.updateInnerDiv();
                }, 250); //延迟一下
            }).bind("blur", function () {
                //TODO 
            });

            textarea.trigger("change");
        },
        /**
         * 设置textarea的value
         * 注:仅支持设置值,其他的属性和样式需要在初始化的时候就完成
         */
        set: function (str) {

        },
        /**
         * 获取textarea的值
         */
        get: function () {

        },
        /**
         * 方法兼容jq的习惯
         */
        val: function () {
            return this.get();
        },
        focus: function () {
            this.textarea.focus();
        },

        /**
         * 是否支持placeholder属性
         */
        isSupportPlaceHolder: function () {
            return 'placeholder' in document.createElement('input');
        },
        /**
         * 统一化的placeholder体验
         */
        setPlaceHolder: function (defaultText) {
            //不支持placeholder的,需要手工实现
            var textarea = this.textarea,
                color = "#ababab", //placeholder的颜色,局部存吧
                defaultcolor = "black"; //默认字体的颜色

            if (!defaultText) return; //空格的话就不绑定了

            textarea.bind("focus", function () {
                var text = textarea.val();
                if ($(this).data("placeholder")) { //通过标记位来识别是否在placeholder模式,而不是字符串长度
                    textarea.val("").css("color", defaultcolor);
                }

            }).bind("blur", function () {
                var text = textarea.val();
                if (text.length === 0) {
                    textarea.val(_this.options.placeholder).css("color", color);
                    textarea.data("placeholder", true); //标记:手工placeholder模式
                } else {
                    textarea.data("placeholder", false); //非placeholder模式,即允许用户输入跟placeholder一样的字符串
                }
            });

            textarea.val(defaultText).trigger("blur");
        },

        /**
         * 
         */
        updateInnerDiv: function () {
            var _this = this,
                textarea = _this.textarea,
                div = _this.div,
                lineHeight, minheight, maxheight, goalheight,
                textcontent, divcontent; //textarea和div里面的内容

            //prepare
            lineHeight = parseInt(textarea.css('line-height'), 10) || parseInt(textarea.css('font-size'), '10');
            minheight = parseInt(textarea.css('height'), 10) || lineHeight * 3;
            maxheight = parseInt(textarea.css('max-height'), 10) || Number.MAX_VALUE;
            goalheight = 0;
            if (maxheight < 0) { maxheight = Number.MAX_VALUE; } //Opera如果未设置返回-1
            //end

            if (textarea.width() !== div.width()) {
                div.width(textarea.width()); //同宽
            }

            textcontent = textarea.val().replace(/&/g, '&amp;').replace(/ {2}/g, '&nbsp;').replace(/<|>/g, '&gt;').replace(/\n/g, '<br />');
            divcontent = div.html().replace(/<br>/gi, "<br />");

            if (textcontent !== divcontent) {
                div.html(textcontent);

                if (Math.abs(div.height() + lineHeight - textarea.height()) > 3) {
                    var goalheight = div.height() + lineHeight;
                    if (goalheight >= maxheight) {
                        _this.setDivStyle({ "height": maxheight, "overflow-y": "auto" });
                    } else if (goalheight <= minheight) {
                        _this.setDivStyle({ "height": minheight, "overflow-y": "hidden" });
                    } else {
                        _this.setDivStyle({ "height": goalheight, "overflow-y": "hidden" });
                    }
                }
            }
        },
        setDivStyle: function (cssObj) {
            //会多次调用,所以写成方法
            //cssObj必须包含height即{height:10}
            var _this = this,
                currentHeight;

            currentHeight = Math.floor(parseInt(cssObj.height, 10)); //防止出现10px的情况
            if (_this.textarea.height() !== currentHeight) {
                _this.textarea.animate(cssObj);
            }
        }
    }));

})(jQuery, _, M139, window._top || window.top);