;
(function($, _, M139) {

    var superclass = M2012.Calendar.View.Popup.Direction;
    var calendarTypes = M2012.Calendar.Constant.calendarTypes;
    var className = "M2012.Calendar.View.ActivityPopTip";

    M139.namespace(className, superclass.extend({
        el: "body",
        configData: {
            TIPS: '此为公共日历，不能创建活动'
        },
        initialize: function(options) {
            superclass.prototype.initialize.apply(this, arguments);
        },
        setContent: function(elem) {
            elem && elem.html(this.configData.TIPS);
        },
        setLink: function (elem) {
            elem && elem.parent().addClass("hide");
        },
        setOptions: function (elem) {
            //setLink处理了.这里不需要处理
        },
        setWidth: function (width) {
            /*
             * 成也important,败也important
             */
            if (!_.isNull(width) || !_.isUndefined(width)) {
                var match = ("" + width).match(/\d+/);
                if (match) {
                    width = match[0] + "px !important";
                    var elem = this.popElement,
                        cssText = elem.attr("style");
                    cssText += "width: " + width;
                    this.popElement.css("cssText", cssText);
                }
            }
        }
    }));

    var popupTip = M2012.Calendar.View.ActivityPopTip;
    $.extend(popupTip, {
        /**
        * 创建提示浮层,控制单个浮层提示
        */
        create: function(options) {
            var _this = this;
            options = options || {};
            console.clear();
            console.log("浮层签名: ",options);
            if (options.e || options.target) {
                _this.current =new popupTip({
                    target: options.target,
                    event: options.e
                });

                if (options.width) {
                    _this.current.setWidth && _this.current.setWidth(options.width);
                }
            }
        },
        close: function() {
            var current = this.current;
            current && current.hide();
        }
    })

})(jQuery, _, M139, window._top || window.top);