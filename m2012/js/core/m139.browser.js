/**
 * @fileOverview 定义与浏览器相关的常用方法的静态类
 */

(function (jQuery, M139) {
    var $ = jQuery;
    var ua = navigator.userAgent;
    /**
    *定义与浏览器相关的常用方法的静态类，缩写为$B
    *@namespace
    *@name M139.Browser
    */
    M139.Browser =
    {
        /**即：navigator.userAgent,$B.ua
        * @field
        */
        ua: ua,
        /**
        *@namespace
        *@name M139.Browser.is
        */
        _is:
        /**@lends M139.Browser.is*/
        {
            /**是否IE浏览器
             * @field
             */
            ie: /MSIE/,

            /**是否火狐浏览器
             * @field
             */
            firefox: /firefox/i,

            /**是否是否谷歌浏览器
             * @field
             */
            chrome: /chrome/i,

            /**是否欧朋浏览器
             * @field
             */
            opera: /opera/i,

            /**是否苹果的Safari浏览器,如果是Chrome则输出false
             * @field
             */
            safari: /safari/i,

            /**是否Webkit内核浏览器
             * @field
             */
            webkit: /webkit/i,

            /**是否Gecko内核浏览器
             * @field
             */
            gecko: /gecko/i,

            /**是否iOS操作系统
             * @field
             */
            ios: /iPad|iPhone|iPod/,

            /**是否mac操作系统
             * @field
             */
            mac: /mac/i,

            /**是否安卓操作系统
             * @field
             */
            android: /Android/,

            /**是否Windows Phone操作系统
             * @field
             */
            windowsphone: /Windows Phone/,

            /**是否Windows操作系统
             * @field
             */
            windows: /Windows/,

            /**是否为手机
             * @field
             */
            phone: /mobile|phone/i,

            /**是否为Pad设备
             * @field
             */
            pad: /iPad/,

            /**是否为Linux操作系统
             * @field
             */
            linux: /Linux/
        },
        /**@namespace*/
        support:
        /**@lends M139.Browser.support*/
        {
            /**是否支持position:fixed*/
            cssFixed: function () {
                return !$B.is.ie || $B.getVersion() > 6;
            },

            /**
             * 是否支持本地存储
             */
            storage: function () {
                try {
                    return "undefined" !== typeof(window.localStorage) && null !== window.localStorage;
                } catch (ex) {
                    return false;
                }
            }
        },
        /**
        *获得获得版本
        */
        getVersion: function () {
            var version;
            if ($B.is.chrome) {
                var reg = /Chrome\D?([\d.]+)/;
                var m = ua.match(reg);
                if (m) version = parseInt(m[1]);
            } else if ($B.is.safari) {
                var reg = /version\D?([\d.]+)/i;
                var m = ua.match(reg);
                if (m) version = parseFloat(m[1]);
            }
            return version || $.browser.version;
        },
        /**
        *判断ua是否包含某个关键字,即： $B.ua.indexOf(keyword) > -1，可以一次判断多个值
        *@example
        $B.uaContains(keyword1,keyword2);
        */
        uaContains: function (keyword1, keyword2) {
            var result = false;
            for (var i = 0; i < arguments.length; i++) {
                result = result || $B.ua.indexOf(arguments[i]) > -1;
            }
            return result;
        },
        /**
        *@inner
        *初始化，给M139.Browser.is赋值，也可以传一个假的ua进行测试
        */
        init: function (uaString) {
            var is = $B.is = {};
            var _is = $B._is;
            var _ua = uaString || ua;
            for (var r in _is) {
                if (typeof _is[r] == "object") {
                    is[r] = _is[r].test(_ua);
                }
            }
            is.safari = is.safari && !is.chrome;
            if(window.ActiveXObject == undefined && window.ActiveXObject !== undefined){
                is.ie11 = true; //别把ie11当ie
            }
        }
    };
    window.$B = M139.Browser;
    $B.init();


    if(!window.console){
        console = {
            assert: function () {  },
            count: function () {  },
            debug: function () {  },
            dir: function () {  },
            dirxml: function () {  },
            error: function () {  },
            group: function () {  },
            groupCollapsed: function () {  },
            groupEnd: function () {  },
            info: function () {  },
            log: function () {  },
            markTimeline: function () {  },
            profile: function () {  },
            profileEnd: function () {  },
            time: function () {  },
            timeEnd: function () {  },
            timeStamp: function () {  },
            trace: function () {  },
            warn: function () {  }
        }
    }

})(jQuery, M139);