/**
 *视图组件 textare框
 */
;(function ($, _, M139, top) {

    var Component = M2012.Calendar.View.Component;
    var Validate = M2012.Calendar.View.ValidateTip;

    M139.namespace("M2012.Calendar.View.TextArea", Component.extend({

        initialize: function (options) {

            this.name = options.name || 'content';
            this.titleName = options.titleName || '内容'
            this.maxLength = options.maxLength || 500;
            this.wrap = $("#" + options.wrap);
            this.require = options.require || false;
            this.render();
            this.kepElements();
            this.initEvents();
        },

        render: function () {
            var template = $T.Utils.format(this._template, {
                cid: this.cid,
                title: this.title,
                totalCount: this.maxLength,
                curCount: 0,
                require: this.require ? this._requireTemplate : "",
                titleName: this.titleName,
                cid: this.cid
            });
            $(template).appendTo(this.wrap);
        },

        kepElements: function () {
            this.textareaEl = $("#" + this.cid + '_content_textarea');
            this.statEl = $("#" + this.cid + '_stat');
        },
        changeHander: function (e) {
            var val = $(e.target).val();
            var objMsg = this.validate(val);
            if (objMsg.isOk) {
                this.statEl.text(val.length + "/500");
            } else {
                val = val.substr(0, this.maxLength);
                this.textareaEl.val(val);
                this.statEl.text("500/500");
                Validate.show(objMsg.msg, e.target);

            }
            this.setData(val);//截取500个字符

        },
        initEvents: function () {
            var self = this;
            this.textareaEl.bind('keyup', function (e) {
                self.changeHander.call(self, e);
            });
            this.textareaEl.bind('keydown', function (e) {
                self.changeHander.call(self, e);
            });
            this.textareaEl.bind('change', function (e) {
                self.changeHander.call(self, e);
            });
        },
        validate: function (val, isShow) {
            var objMsg = null;
            if (val.length > this.maxLength) {
                objMsg = { isOk: false, msg: '不能超过' + this.maxLength + '个字符' };
            } else if (isShow && this.require && val == '') {
                objMsg = { isOk: false, msg: this.titleName + '不能为空' };
                Validate.show(objMsg.msg, this.textareaEl);
            } else {
                objMsg = { isOk: true };
            }

            return objMsg;
        },
        setData: function (val) {

            this.obj = val;
        },
        bindData: function (val, type) {
            val = val || "";
            //ie6显示不出来处理
            //this.textareaEl.val(val.substr(0, this.maxLength)).hide().show();
            this.textareaEl.val(val).hide().show(); //全部显示，然后通过出发keyup来截取(因为val里面有\r\n，长度是4，实际是换行符，长度为1)
            if (type == -1) {//只读处理
                this.setReadOnly();
            }
            this.setData(val);
            //this.statEl.text(val.length + "/500");
            this.oldVal = val;

            this.textareaEl.trigger('keyup');
        },
        getData: function () {
            return $.trim(this.obj);

        },
        show: function () {

        },
        hide: function () {

        },

        _template: ['<div id="{cid}_wrap_input">',
        			 	'<label class="label">{titleName}：{require}</label>',
                     	 '<div class="element">',
	                        	'<div class="tagarea-div">',
	                        		'<textarea id="{cid}_content_textarea" class="iText tagarea"/>',
	                        		'<span class="tagarea-num gray" id="{cid}_stat">{curCount}/{totalCount}</span>',
	                        	'</div>',
                       	'</div>',
                       	 '<div id="{cid}_ControlReadEl" style="display:none;top: 0px; height:100px; z-index:1000; " class="blackbanner"></div>',
                 '</div>'].join("")

    }));
})(jQuery, _, M139, window._top || window.top);
