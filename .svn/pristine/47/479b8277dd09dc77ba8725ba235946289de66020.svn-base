
/**
 * 139邮箱SDK行为上报兼容
 * 目前作为自定义事件的行为兼容上报
 * 
 * examples:
 * M2012.Calendar.Analytics.sendEvent('load',{api:'load_main_data'});
 * 
 * //点击事件上报
 * M2012.Calendar.Analytics.sendClick(e); //一般在jqElem.click(function(e){})方法中
 */
; (function ($, _, M139, top) {
    //兼容
    if (!window._udata) {
        window._udata = {
            sendClick: function () { },
            sendEvent: function () { }
        }
    }

    var className = 'M2012.Calendar.Analytics';
    M139.namespace(className, Backbone.Model.extend({
        name: className,
        sendEvent: function (name, value) {
            _udata.sendEvent(name, value);
        },
        sendClick: function (e) {
            _udata.sendClick(e);
        }
    }));

    var analytics = new M2012.Calendar.Analytics();

    //扩展到实例
    $.extend(M2012.Calendar.Analytics, {
        sendEvent: analytics.sendEvent,
        sendClick: analytics.sendClick
    })
})(jQuery, _, M139, window._top || window.top);