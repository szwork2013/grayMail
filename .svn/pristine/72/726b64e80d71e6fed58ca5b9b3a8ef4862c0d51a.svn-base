

(function ($, _, M139, top) {
    var master = window.$Cal;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Calendar.UI.Captcha.View', superClass.extend({
        template: {
            //这货在日历内部到底有没有通用性啊
            MAIN: ['<div class="pt_10 repeattips-bottom clearfix">',
                        '<span class="numFour">验证码：</span>',
                        '<div class="fl">',
                            '<input id="{cid}_txtInput" type="text" name="" class="iText ">',
                        '</div>',
                        '<div id="{cid}_captchaDiv" class="verificationBox">',
                            '<p class="verificationBoxImg">',
                                '<img src="{imageUrl}" alt="" title="">',
                            '</p>',
                            '<p class="verificationBoxInfo">图中显示的图案是什么?将你认为正确答案前的<span>字母或数字</span>填入框中（不分大小写）</p>',
                            '<a href="javascript:void(0);" class="verificationBoxBtn">看不清，换一张</a>',
                        '</div>',
                    '</div>'].join("")
        },
        configData: {

        },
        /**
         * 图片验证码(不确定是否具备通用性)
         * @example
         * new M2012.Calendar.UI.Captcha.View({
         *     target:$("div"), //jQuery对象
         *     imageUrl:"http://mail.10086.cn/getimage" //可选参数,图片验证码,如果不传递,则通过接口initCalendar获取
         * });
         */
        initialize: function (options) {
            var _this = this;
            options = $.extend({}, options);
            _this.target = options.target || options.container;
            _this.imageUrl = options.imageUrl; //可以直接外部传进来
            if (!_this.imageUrl) {
                _this.model = new M2012.Calendar.UI.Captcha.Model();
            }
            if (_this.target) {
                _this.render();
            }
        },
        render: function () {
            var _this = this;

            _this.initData(function () {
                var html = $T.format(_this.template.MAIN, { imageUrl: _this.imageUrl });
                _this.target.html(html);
                _this.initEvents();
            });
        },
        initData: function (callback) {
            //检查并获取验证码图片
            var _this = this;

            if (_this.imageUrl) {
                callback();
            } else {
                _this.model.getImageUrl(function (url) {
                    _this.imageUrl = url;
                    callback();
                })
            }
        },
        initEvents: function () {
            var _this = this;

            _this.txtInput = _this.target.find("input");
            _this.captchaDiv = _this.target.find(".verificationBox")
            _this.captchaImg = _this.target.find("img");
            _this.refreshButton = _this.target.find("a");

            _this.txtInput.unbind("click").bind("click", function (e) {
                _this.show();
                _this._stopEvent(e);
            });

            _this.refreshButton.unbind("click").bind("click", function () {
                _this._refresh();
            });

            _this.captchaImg.unbind('click').bind("click", function () {
                _this._refresh();
            });

            _this.target.removeClass("hide");

            _this.captchaDiv.unbind('click').bind("click", function (e) {
                _this._stopEvent(e);
            });
            $(document.body).click(function (e) {
                _this.hide();
            });
        },
        show: function (options) {
            var _this = this;
            if (options && options.refresh == true) {
                _this._refresh();
                _this.txtInput.focus();
            } else {
                _this.captchaDiv.removeClass("hide");
            }
        },
        hide: function () {
            var _this = this;
            _this.code = _this.txtInput.val().replace(/\s/gi, '');
            _this.captchaDiv.addClass("hide");
        },
        getData: function () {
            return this.code;
        },
        _refresh: function () {
            var _this = this;
            if (_this.imageUrl&&_this.captchaImg) {
                var imageUrl = $Url.makeUrl(_this.imageUrl, { rnd: Math.random() });
                _this.captchaImg.attr("src", imageUrl);
            }
        },
        _stopEvent: function (e) {
            if (e) {
                if (e.stopPropagation) {
                    e.stopPropagation();
                    e.preventDefault();
                } else {
                    e.cancelBubble = true;
                    e.returnValue = false;
                }
            }
        }
    }));


    //对应的MODEL
    M139.namespace("M2012.Calendar.UI.Captcha.Model", Backbone.Model.extend({
        initialize: function () {
            this.API = master.api;
        },
        getImageUrl: function (callback) {
            var _this = this;
            callback = callback || $.noop;

            this.API.initCalendar({
                data: {},
                success: function (data) {
                    callback(data.imageUrl);
                },
                error: $.noop
            });
        }
    }));
})(jQuery, _, M139, window._top || window.top);