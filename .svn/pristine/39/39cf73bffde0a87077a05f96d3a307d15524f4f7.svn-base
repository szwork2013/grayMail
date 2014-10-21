/**
 *公共的验证码组件
 */
; (function ($, _, M139, top) {
    var Component = M2012.Calendar.View.Component;
    var Validate = M2012.Calendar.View.ValidateTip;
    var Constant = M2012.Calendar.Constant;
    var $CUtils = M2012.Calendar.CommonAPI.Utils;
    var commonAPI = new M2012.Calendar.CommonAPI();

    M139.namespace("M2012.Calendar.View.Identify", Component.extend({

        initialize: function (options) {
            this.name = options.name || 'title';
            this.outer = options.outer || document.body;
            this.titleName = options.titleName || '验证码'
            this.render($("#" + options.wrap));

            this.onChange = _.isFunction(options.onChange) ? function (val) {
                options.onChange(val);
            } : this.onChange;

        },

        render: function (wrap) {
            var template = $T.Utils.format(this._template, {
                cid: this.cid,
                title: this.title,
                name: this.name,
                titleName: this.titleName
            });

            $(template).appendTo(wrap);

            this.kepElements();

            this.initEvents();

            this.hide();
        },

        onChange: function (val) {

        },

        handerError: function (errorCode) {

            var retVal = false;
            if (errorCode === Constant.IDENTIFY_CODES.IS_NEED_IDETIFY) {
                this.show();
                //Validate.show('请输入验证码',this.inputEl);
                this.inputEl.focus();
                retVal = true;
            } else if (errorCode === Constant.IDENTIFY_CODES.MORE_M30_STOP) {//输入了30次

                $Msg.alert("添加次数太频繁，请稍后再试");
                retVal = true;
                this.hide();
            } else if (errorCode === Constant.IDENTIFY_CODES.ERROR_INPUT_IDETIFY) {
                this.show();
                Validate.show('验证码输入错误', this.inputEl);
                retVal = true;

            } else if (errorCode === Constant.IDENTIFY_CODES.ERROR_OUT_DATE) {
                this.show();
                Validate.show('验证码已过期', this.inputEl);
                retVal = true;
            } else if (errorCode === Constant.IDENTIFY_CODES.ERROR_BLACK_LIST) {
                $Msg.alert("操作次数太频繁，您已经被列入黑名单...");
                retVal = true;
                this.hide();
            }
            return retVal;

        },
        changeImgUrl: function () {


            var url = this.imgEl.attr("src");
            if (url) {
                url += "&rnd=" + Math.random();

                this.imgEl.attr("src", url);
            }

        },
        kepElements: function () {

            this.wrap = $("#" + this.cid + '_wrap');
            this.inputEl = this.wrap.find("#" + this.cid + '_input');
            this.imgEl = this.wrap.find("#" + this.cid + '_img');
            this.validateImgEl = this.wrap.find("#" + this.cid + '_validateImg');
        },

        validate: function (val) {

            if (this.isVisible()) {
                if (this.getData() == '') {
                    $CUtils.adjustScrollToBottom(this.outer);
                    Validate.show('请输入验证码', this.inputEl);
                    return false;
                } else {
                    return true;
                }
            }
            return true;

        },

        isVisible: function () {
            return this.wrap.css('display') == 'none' ? false : true;
           // return this.wrap.is(":visible");
        },
        initEvents: function () {

            var self = this;

            this.wrap.find("#" + this.cid + "_changeImg").bind('click', function () {

                self.changeImgUrl();
                return false;//IE6下阻止事件
            });

            this.wrap.find("#" + this.cid + "_img").bind('click', function () {

                self.changeImgUrl();
                return false;

            });

            this.inputEl.change(function () {
                self.onChange($.trim(this.value));
            });

            $(document).bind('click', function (e) {

                var target = $(e.target);
                var id = target.attr("id");
                if (id == self.cid + '_validateImg' || id === self.cid + '_input') {
                    self.validateImgEl.show();
                } else {
                    self.validateImgEl.hide();
                }

            });

        },

        setData: function (obj) {
            this.obj = obj;
        },
        bindData: function (val, type) {

        },
        getData: function () {
            var val = this.inputEl.val();
            return $.trim(val);
        },
        show: function () {
            var self = this;

            commonAPI.callAPI({
                data: null,
                fnName: "initCalendar"
            }, function (data, json) {
                if (data["var"] && data["var"].imageUrl) {
                    self.imgEl.attr("src", data["var"].imageUrl);
                }
            }, function () {
                // 返回异常时的处理
            });

            $CUtils.adjustScrollToBottom(this.outer);
            this.changeImgUrl();
            this.wrap.show();
           // this.validateImgEl.show().css('bottom', this.getValidateImgHeight());
            //this.validateImgEl.show();

            this.imgEl.on("imgload", function () {
                self.validateImgEl.show();
                //图片加载完成之后调整高度
                //self.validateImgEl.css('bottom', self.getValidateImgHeight());
            });
        },
        getValidateImgHeight: function () {
            //return this.validateImgEl.outerHeight(true) + 20 + 8*2 + 10*2;
            return this.validateImgEl.outerHeight(true) + this.inputEl.outerHeight(true) + 5;
        },
        hide: function () {

            this.wrap.hide();
            this.validateImgEl.show();
            this.inputEl.val("");
        },
        getSelector: function (id) {
            return "#" + this.cid + id;
        },
        /**
        _template: ['<div id="{cid}_wrap" style="position:absolute;">',
        				'<label class="label">验证码：</label>',
						'<div class="element" style="height:20px;">',
							'<input type="text" id="{cid}_input" class="iText" value="">',
							'<div id="{cid}_validateImg" tabIndex=-1 class="validate-tip imgInfo mt_5 " >',
								'<img  id="{cid}_img" src="" title="点击更换验证码" style="cursor:pointer;" alt="图片验证码" onload="$(this).trigger(\'imgload\');">',
								'<p style="color: #666; width: 200px;">',
									'图中显示的图案是什么？将你认为正确答案前的<span class="c_ff6600">字母或数字</span>填入框中（不分大小写',
									'<a id="{cid}_changeImg" href="javascript:void(0);">看不清，换一张</a>',
								'</p>',
							'</div>',
						'</div>',
				 	'</div>'].join(""),*/

        _template: ['<div id="{cid}_wrap" class="repeattips-bottom clearfix">',
                       '<span class="numFour label">验证码：</span>',
                       '<div class="fl">',
                           '<input type="text" name="" id="{cid}_input" class="iText" value="">',
                       '</div>',
                       '<div class="verificationBox" id="{cid}_validateImg" tabIndex="-1" style="z-index: 9999">',
                           '<p class="verificationBoxImg">',
                               '<img src="" alt="图片验证码" title="点击更换验证码" id="{cid}_img" onload="$(this).trigger(\'imgload\');">',
                            '</p>',
                           '<p class="verificationBoxInfo">图中显示的图案是什么?将你认为正确答案前的<span>字母或数字</span>填入框中（不分大小写）</p>',
                           '<a id="{cid}_changeImg" href="#" class="verificationBoxBtn">看不清，换一张</a>',
                       '</div>',
                    '</div>'].join("")
    }));
})(jQuery, _, M139, window._top || window.top);
