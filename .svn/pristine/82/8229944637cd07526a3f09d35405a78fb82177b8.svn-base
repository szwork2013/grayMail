/**   
* @fileOverview 读信正文底部滚动条组件
*/

(function (jQuery, _, M139) {
    var superClass = M139.View.ViewBase;
    var cssLoaded = false;
    M139.namespace("M2012.ReadMail.ScrollBar.View", superClass.extend(
    /**
    *@lends M2012.ReadMail.ScrollBar.View.prototype
    */
    {
        /**
         *@param {Object} options 参数集合
         *@param {HTMLElement} options.container
         *@param {HTMLElement} options.widthEl 根据什么元素调整滚动条的大小
         *@param {HTMLElement} options.contentIframe
         */
        initialize: function (options) {
            var $el = $(this.template);
            this.setElement($el);
            this.widthEl = $(this.options.widthEl);
            this.contentChild = $(this.el.firstChild);
            var win = options.contentIframe.contentWindow;
            this.scrollContent = win.document.documentElement;
            $(options.contentIframe).addClass("ReadMailContentIframe");

            if (($B.is.ie && $B.getVersion() < 9) || $B.is.firefox) {
                win.document.body.style.overflowX = "hidden";
                win.document.documentElement.style.overflowX = "hidden";
                win.document.getElementsByTagName("html")[0].style.overflowX = "hidden";
            }else if (!cssLoaded) {
                if ($B.is.webkit) {
                    //由于不能组织横向滚动条显示，只能用样式把它弱化到看不清
                    /*var style = ['<style>',
                     '.ReadMailContentIframe::-webkit-scrollbar {',
                         'color:white;',
                         'background:white;',
                     '}',
                     '.ReadMailContentIframe::-webkit-scrollbar-track {',
                         'color:white;',
                         'background:white;',
                     '}',
                     '.ReadMailContentIframe::-webkit-scrollbar-thumb {',
                         'color:white;',
                         'background:white;',
                     '}',
                     '.ReadMailContentIframe::-webkit-scrollbar-thumb:window-inactive {',
                         'color:white;',
                         'background:white;',
                     '}',
                     '</style>'].join("");
                    $(style).appendTo(document.body);
					*/
					win.document.getElementsByTagName("html")[0].style.overflowX = "hidden";
					//$(win.document).find('html').css({'overflow-x':'hidden'});
				}
                //cssLoaded = true;
            }

            return superClass.prototype.initialize.apply(this, arguments);
        },
        template: [
            '<div class="M2012_ReadMail_ScrollBar_View" style="position:absolute;left:0px;padding-left:20px;bottom:0;overflow-x:scroll;overflow-y:hidden;height:25px;">',
                '<div>&nbsp;</div>',
            '</div>'
        ].join(""),


        render: function () {
            var This = this;
            this.$el.appendTo(this.options.container);
            //todo待优化到特定事件触发
            var timer = setInterval(function () {
                if (M139.Dom.isRemove(This.el)) {
                    clearInterval(timer);
                    This.update = new Function();
                } else if (M139.Dom.isHide(This.el,true)) {

                } else {
                    This.update();
                }
            }, 2000);
            this.bindEvents();
            return superClass.prototype.render.apply(this, arguments);
        },
        /**
         *更新滚动条的宽度、滚动位置
         */
        update: function () {
            var scrollContainerWidth = this.widthEl.width() - 35;
            this.$el.width(scrollContainerWidth);
            //邮件正文区的宽度
            var iframeContentWidth = this.getIframeScrollWidth();
            this.contentChild.width(iframeContentWidth);
            this.el.scrollLeft = this.getIframeScrollLeft();
            if (iframeContentWidth - scrollContainerWidth < 20) {
                this.hide();
            } else {
                this.show();
            }
        },

        /**
         *在ie9，ie10下 有个缺陷是会看到双滚动条：模拟的和iframe实际的
         *@inner
         */
        isIframeScrollInView:function(){
            var div = this.getIFrameScrollParent();
            console.log('div.scrollHeight'+div.scrollHeight+'div.scrollTop'+div.scrollTop+'$(div).height()'+$(div).height())
            if (div.scrollHeight - (div.scrollTop + $(div).height()) < 100) {
                return true;
            } else {
                return false;
            }
        },

        /**
         *得到iframe滚动的容器
         *@inner
         */
        getIFrameScrollParent:function(){
            if (!this.iframeScrollParent) {
                var el = this.options.contentIframe;
                while (el) {
                    if (el.style && el.style.overflowY == "auto") {
                        this.iframeScrollParent = el;
                        break;
                    }
                    el = el.parentNode;
                }
            }
            return this.iframeScrollParent;
        },

        /**
         *获得iframe内容的实际最大宽度
         *@inner
         */
        getIframeScrollWidth:function(){
            var iframe = this.options.contentIframe;
            var doc = iframe.contentWindow.document;
            return Math.max(iframe.scrollWidth, doc.documentElement.scrollWidth, doc.body.scrollWidth);
        },

        /**
         *获得iframe内容的滚动值
         *@inner
         */
        getIframeScrollLeft: function () {
            var iframe = this.options.contentIframe;
            var doc = iframe.contentWindow.document;
            return Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft, doc.getElementsByTagName("html")[0].scrollLeft);
        },
        
        /**
         *设置iframe内容的滚动值
         *@inner
         */
        setIframeScrollLeft:function(scrollLeft){
            var iframe = this.options.contentIframe;
            var doc = iframe.contentWindow.document;
            doc.documentElement.scrollLeft = scrollLeft;
            doc.body.scrollLeft = scrollLeft;
            doc.getElementsByTagName("html")[0].scrollLeft = scrollLeft;
        },

        /**
         *@inner
         */
        bindEvents: function () {
            var This = this;
            this.$el.bind("scroll", function () {
                //console.log("scrollLeft:" + This.el.scrollLeft + ",getIframeScrollLeft:" + This.getIframeScrollLeft());
                This.setIframeScrollLeft(This.el.scrollLeft);
            });

            if ($B.is.ie && $B.getVersion() >= 9) {
                //console.log(this.getIFrameScrollParent())// undefined
                $(this.getIFrameScrollParent()).bind("scroll", function () {
                    //防止显示双滚动条
                    if (This.isIframeScrollInView()) {
                        This.$el.css("visibility", "hidden");
                    } else {
                        This.$el.css("visibility", "");
                    }
                });
            }
        }
    }));
    
})(jQuery, _, M139);