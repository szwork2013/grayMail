/**
 * @fileOverview 定义Iframe使用的封装
 * @inner
 */

(function (jQuery, Backbone, _, M139) {

    M139.namespace("M139.Iframe", Backbone.Model.extend(
    /**
    *@lends M139.Iframe.prototype
    */
    {
        /** 
        *定义Iframe使用的封装
        *@constructs M139.Iframe
        *@param {Object} options 初始化参数集
        *@example
        */
        initialize: function (options) {
            if (!options || !options.name) {
                throw "Application实例缺少参数:name";
            }
        }
    }
    ));

    jQuery.extend(M139.Iframe,
    /**
    *@lends M139.Iframe
    */
    {
        /**
         *判断iframe是否可以使用
         *@param {HTMLElement} iframe iframe元素
         *@param {String} query 可选参数，检查iframe中存在的对象（一般情况下不用传）
         */
        isAccessAble: function (iframe,query) {
            var ok = false;
            try {
                var win = iframe.contentWindow;
                var doc = win.document;
                ok = Boolean(doc.body && document.domain == doc.domain && win.location.href.indexOf("http") > -1);
                if (ok && doc.readyState) {
                    if (doc.readyState == "complete") {
                        ok = true;
                    } else {
                        ok = false;
                    }
                }
                if (ok && query) {
                    ok = Boolean(win[query]);
                }
            } catch (e) { }
            return ok;
        },

        /**
         *判断iframe是否已加载完成，可用
         *@param {HTMLElement} iframe
         *@param {Function} callback确认可用后的回调
         *@param {Object} options高级查询参数，比如options.query函数检查window中的对象可用
         */
        domReady: function (iframe, callback, options) {
            var timer;
            options = options || {};
            M139.Timing.waitForReady(function(){
                var ok = M139.Iframe.isAccessAble(iframe, options.query);
                if (ok && timer) {
                    clearInterval(timer);
                }
                return ok;
            }, callback);
            if (options.checkIframeHealth) {
                timer = this.checkIframeHealth({
                    iframe: iframe
                });
            }
        },
        /**
         *老版本的markSureIframeReady：保证iframe能够正确加载,通常用在ajax代理的iframe
         *每3秒检查一次，如果不对，则替换src重新加载
        */
        checkIframeHealth:function (conf) {
            var iframe = conf.iframe;
            var retryTimes = conf.retryTimes || 3;
            var interval = conf.interval || 3000;
            var query = conf.query;
            var check = function () {
                return M139.Iframe.isAccessAble(iframe, conf.query);
            };
            var timer = setInterval(function () {

                if (M139.Dom.isRemove(iframe)) {
                    clearInterval(timer);
                    return;
                }

                retryTimes--;
                if (!check()) {
                    var url = iframe.src;
                    if (url.indexOf("?") == -1) {
                        url += "?";
                    }
                    url += "&" + Math.random();
                    iframe.src = url;
                } else {
                    clearInterval(timer);
                }
                if (retryTimes <= 0) {
                    clearInterval(timer);
                    if (!check()) {
                        throw "M139.Iframe.checkIframeHealth Fail:" + iframe.src;
                    }
                }
            }, interval);
            return timer;
        }
    });
    
    $Iframe = M139.Iframe;
})(jQuery, Backbone, _, M139);