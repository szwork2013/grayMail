/**
 * @fileOverview 定义页面缩放提示的组件
 */

;(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var StorageKey_NotShow = "M139_ZoomTip_Not_Show_Again";
    M139.namespace("M2012.UI.Tip.ZoomTip.View", superClass.extend(
    {
        initialize: function (options) {
            var $el = jQuery(this.template);
            this.setElement($el);
            return superClass.prototype.initialize.apply(this, arguments);
        },
        template: ['<div id="divZoomTip">',
                '<div class="zoomTip_content">',
                    '<div class="zoomTip_inner">',
                        '<i style="background-image:url(http://images.139cm.com/m2012/images/global/global.png);background-position: -130px -150px;height: 24px;width: 24px;position: absolute;top: 20px;left: 10px;z-index: 20;"></i>',
                        '<div class="zoomTip_txt">您的浏览器目前处于缩放状态，会导致邮箱显示不正常，您可以键盘按“ctrl+数字0”组合键恢复初始状态。',
                        '<a id="aZoomNotShowAgain" style="color: #1E79C6;text-decoration: underline;" href="javascript:;">不再提示</a>',
                        '</div>',
                    '</div>',
                    '<a id="aZoomTipClose" title="关闭提示" style="position: absolute;right: 10px;top: 10px;width: 14px;height: 14px;font-size: 14px;color: #E4AF4D;line-height: 14px;font-family: Tahoma;font-weight: bold;overflow: hidden;text-align: center;" href="javascript:;" onclick="return false;">×</a>',
                '</div>',
        '</div>'].join(""),
        style: [
         '<style>',
         '#divZoomTip{',
             'position: fixed;',
             'top: 0px;',
             'left: 0px;',
             'height: 60px;',
             'width: 99.9%;',
             'z-index: 10240;',
             'overflow: hidden;',
         '}',
         '#divZoomTip .zoomTip_content {',
             'width: 100%;',
             ',position: relative;',
             'zoom: 1;',
             'background: #FFF2D1;',
             'border-bottom: 1px solid #E9C58C;',
         '}',
         '#divZoomTip .zoomTip_inner {',
            'width: 960px;',
            'height: 60px;',
            'margin: 0 auto;',
            'position: relative;',
            'zoom: 1;',
            'color: #555;',
         '}',
         '#divZoomTip .zoomTip_txt {',
            'margin-left: 35px;',
             'font-size: 14px;',
             'font-family: "Microsoft Yahei","\9ED1\4F53";',
             'padding-top: 22px;',
             'color: #984B12;',
             'line-height: 18px;',
             'height: 18px;',
         '}',
        '</style>'].join(""),
        initEvents: function () {
            var This = this;
            //缩放正常后移除提示
            $(window).bind("resize", function () {
                try{
                    if (M2012.UI.Tip.ZoomTip.Model.zoom() == 1) {
                        This.$el.hide();
                    } else {
                        This.$el.show();
                    }
                } catch (e) { }
            });
            this.$el.find("#aZoomTipClose").click(function () {
                This.close();
            });
            this.$el.find("#aZoomNotShowAgain").click(function () {
                This.close(true);
            });
        },
        render: function () {
            $(this.style).appendTo(document.body);
            this.$el.appendTo(document.body);
            this.initEvents();
            return this;
        },
        close: function (bNotShowAgain) {
            this.$el.remove();
            if (bNotShowAgain) {
                M2012.UI.Tip.ZoomTip.flagNotShowAgain();
            }
        }
    }));
    jQuery.extend(M2012.UI.Tip.ZoomTip, {
        isShow:false,
        watchZoom: function () {
            if ($B.is.ie && $B.getVersion() < 8) {
                return;
            }
            if (!this.isNotShowAgain()) {
                //调用第一次就检查一次，然后再根据resize事件检查
                if (!checkZoom()) {
                    $(window).bind("resize", function () {
                        checkZoom();
                    });
                }
            }
            function checkZoom() {
                var zoom = M2012.UI.Tip.ZoomTip.Model.zoom();
                //TODO 当窗口不是最大化的时候存在bug，暂时改为判断是0.1的完整倍数
                if (/^\d+\.\d$/.test(zoom)) {
                    showTip();
                    return true;
                }
            }
            function showTip() {
                if (!M2012.UI.Tip.ZoomTip.isShow) {
                    new M2012.UI.Tip.ZoomTip.View().render();
                    M2012.UI.Tip.ZoomTip.isShow = true;
                }
            }
        },
        isNotShowAgain: function () {
            var v = false;
            try {
                v = !!localStorage.getItem(StorageKey_NotShow);
            } catch (e) {

            }
            return v;
        },
        flagNotShowAgain: function () {
            try {
                localStorage.setItem(StorageKey_NotShow, "1");
            } catch (e) { }
        }
    });
})(jQuery, _, M139);