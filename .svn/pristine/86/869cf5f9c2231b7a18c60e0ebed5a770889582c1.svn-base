/**
 * @fileOverview 定义加载中的提示组件
 */

(function (jQuery, Backbone, _, M139) {
    var $ = jQuery;

    


    M139.core.namespace("M139.UI", {
        TipMessage: {
            /**
             *显示加载中的提示，默认为顶部绿色提示
             *@param {String} msg 提示文本
             *@param {Object} options 可选参数集合
             *@param {Number} options.delay 延迟多少毫秒自动消失
             */
            show: function (msg, options) {
                if (!msg) return;
                if(this.prior){
                    return;
                }
                var self = this;
                if (!this.isAdded) {
                    var div = document.createElement("div");
                    div.innerHTML = "<span id=\"tipmsg\" style=\"display:none;position:absolute;z-index:9999;top:0px;left:45%;\" class=\"msg\"></span>";
                    this.el = $(div.firstChild);
                    document.body.appendChild(div.firstChild);
                    this.isAdded = true;
                }
                //var left = (document.body.offsetWidth - 100) / 2;  计算body宽度性能损耗太严重了
                //this.el.css("left", left + "px");
                this._removeClass();
                if (options && options.className) {
                    this.className = options.className;
                    this.el.addClass(options.className); //加上自定义样式，一般为底色如：msgRed
                }
                this.el[0].innerHTML = msg;
                this.el.show();

                var showKey = Math.random().toString();
                this.el.attr("showkey", showKey);

                clearTimeout(this.el.stop().data('timer'));//取消fadeOut
                
                if(options && options.prior){
                    this.prior = options.prior;
                }
                
                if (options && options.delay) { //自动消失
                    setTimeout(function () {
                        if (self.el.attr("showkey") === showKey) {
                            self.prior = false;
                            self.hide();
                        }
                    }, options.delay)
                }
            },
            warn: function (msg, options) {
                this.show(msg, $.extend({ className: 'msgYellow' }, options));
            },
            error:function(msg,options){
                this.show(msg, $.extend({ className: 'msgRed' }, options));
            },
            /**
             *显示在屏幕中间显眼的loading提示
             *@param {String} msg 提示文本
             *@param {Object} options 可选参数集合
             *@param {Number} options.delay 延迟多少毫秒自动消失
             *@example
             M139.UI.TipMessage.showMiddleTip("正在归档...");
             //隐藏
             M139.UI.TipMessage.hideMiddleTip();
             */
            showMiddleTip: function (msg, options) {
                var self = this;
                if (!this.middleTip) {
                    this.middleTip = $(['<div class="noflashtips inboxloading" style="z-index:99999">',
	                    ($.browser.msie && $.browser.version <= 7) ? '<i></i>' : '',
	                    '<img src="/m2012/images/global/load.gif" alt="加载中..." style="vertical-align:middle;">加载中，请稍后...',
                    '</div>'].join("")).appendTo(document.body);
                }
                msg = msg || "加载中，请稍后...";
                M139.Dom.setTextNode(this.middleTip[0], msg);
                this.middleTip.show();


                var showKey = Math.random().toString();
                this.middleTip.attr("showkey", showKey);

                clearTimeout(this.middleTip.stop().data('timer'));//取消fadeOut

                if (options && options.delay) { //自动消失
                    setTimeout(function () {
                        if (self.middleTip.attr("showkey") === showKey) {
                            self.hideMiddleTip();
                        }
                    }, options.delay)
                }
            },

            /**
             *隐藏中间提示
             */
            hideMiddleTip:function(){
                this.middleTip && this.middleTip.fadeOut(800);
            },

            /**
             *隐藏顶部加载中的提示
             */
            hide: function () {
                if(this.prior){
                    return;
                }

                var _this = this;
                
                if ($B.is.ie && $B.getVersion() < 8) {
                    this.el && this.el.hide();
                    _this._removeClass();
                }else{
                    this.el && this.el.fadeOut(800, function(){
                        _this._removeClass();
                    });
                }
                
            },
            _removeClass: function () {
                if (this.className) {
                    this.el.removeClass(this.className);
                    this.className = null;
                }
            }
        }
    });
})(jQuery, Backbone, _, M139);