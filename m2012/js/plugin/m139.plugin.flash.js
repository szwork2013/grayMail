/**
 * @fileOverview 定义Flash插件常用的方法
 */
(function (jQuery, _, M139) {
    /**
     * @fileOverview 定义Flash插件常用的方法
     */
    /**
    *定义Flash插件常用方法的静态类
    *@namespace
    *@name M139.Plugin.Flash
    */
    M139.core.namespace("M139.Plugin.Flash",
    /**@lends M139.Plugin.Flash*/
    {
        /**
        *返回Flash Player的版本号,如果不支持，则返回0
        */
        getVersion: function () {
            var isIE = $.browser.msie;
            function getVersionInIE() {
                var v = 0;
                for (var i = 11; i >= 6; i--) {
                    try {
                        var obj = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + i);
                        if (obj) {
                            v = i;
                            break;
                        }
                    } catch (e) { }
                }
                return v;
            }
            function getVersionInOthers() {
                var v = 0;
                if (navigator.plugins && navigator.plugins.length > 0 && navigator.plugins["Shockwave Flash"]) {
                    var plugins = navigator.plugins["Shockwave Flash"];
                    for (var i = 0; i < plugins.length; i++) {
                        var swf = plugins[i];
                        if (swf.enabledPlugin && (swf.suffixes.indexOf("swf") != -1) && navigator.mimeTypes["application/x-shockwave-flash"]) {
                            var match = plugins.description.match(/ (\d+(?:\.\d+)?)/);
                            if (match) {
                                var v = parseInt(match[1]);
                                break;
                            }
                        }
                    }
                }
                return v;
            }
            var result = 0;
            if (isIE) {
                result = getVersionInIE();
            } else {
                result = getVersionInOthers();
            }
            /**@inner*/
            getVersionInIE = function () {
                return result;//保存返回值
            }
            getVersionInOthers = getVersionInIE;
            return result;
        },
        /**
        *使用document.write的方式创建一个flash 播放器标签
        */
        SWFObject: SWFObject,

        /**
         *获得提示安装flash的界面html
        */
        getFlashSetupTip: function () {
            return ['<div class="noflashtips">',
				 (($B.is.ie && $B.getVersion() < 7) ? '<i></i>' : ""),
				'<img src="/m2012/images/global/flash.jpg" alt="" style="vertical-align:middle">您未安装flash，<a target="_blank" title="安装Flash播放器" href="http://get.adobe.com/cn/flashplayer/">去安装</a>',
			'</div>'].join("");
        }
    });
    function SWFObject(swf, id, w, h, ver, c) {
        this.params = new Object();
        this.variables = new Object();
        this.attributes = new Object();
        this.setAttribute("id", id);
        this.setAttribute("name", id);
        this.setAttribute("width", w);
        this.setAttribute("height", h);
        this.setAttribute("version", ver);
        this.setAttribute("swf", swf);
        this.setAttribute("classid", "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000");
        this.addParam("bgcolor", c);
    }
    SWFObject.prototype.addParam = function (key, value) {
        this.params[key] = value;
    }
    SWFObject.prototype.getParam = function (key) {
        return this.params[key];
    }
    SWFObject.prototype.addVariable = function (key, value) {
        this.variables[key] = value;
    }
    SWFObject.prototype.getVariable = function (key) {
        return this.variables[key];
    }
    SWFObject.prototype.setAttribute = function (key, value) {
        this.attributes[key] = value;
    }
    SWFObject.prototype.getAttribute = function (key) {
        return this.attributes[key];
    }
    SWFObject.prototype.getVariablePairs = function () {
        var variablePairs = new Array();
        for (key in this.variables) {
            variablePairs.push(key + "=" + this.variables[key]);
        }
        return variablePairs;
    }
    SWFObject.prototype.getHTML = function () {
        var con = '';
        if (navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) {
            con += '<embed type="application/x-shockwave-flash"  pluginspage="http://www.macromedia.com/go/getflashplayer" src="' + this.getAttribute('swf') + '" width="' + this.getAttribute('width') + '" height="' + this.getAttribute('height') + '"';
            con += ' id="' + this.getAttribute('id') + '" name="' + this.getAttribute('id') + '" ';
            for (var key in this.params) {
                con += [key] + '="' + this.params[key] + '" ';
            }
            var pairs = this.getVariablePairs().join("&");
            if (pairs.length > 0) {
                con += 'flashvars="' + pairs + '"';
            }
            con += '/>';
        } else {
            con = '<object id="' + this.getAttribute('id') + '" classid="' + this.getAttribute('classid') + '"  codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=' + this.setAttribute("version") + ',0,0,0" width="' + this.getAttribute('width') + '" height="' + this.getAttribute('height') + '">';
            con += '<param name="movie" value="' + this.getAttribute('swf') + '" />';
            for (var key in this.params) {
                con += '<param name="' + key + '" value="' + this.params[key] + '" />';
            }
            var pairs = this.getVariablePairs().join("&");
            if (pairs.length > 0) { con += '<param name="flashvars" value="' + pairs + '" />'; }
            con += "</object>";
        }
        return con;
    }
    SWFObject.prototype.write = function (elementId) {
        if (typeof elementId == 'undefined') {
            document.write(this.getHTML());
        } else {
            var n = (typeof elementId == 'string') ? document.getElementById(elementId) : elementId;
            n.innerHTML = this.getHTML();
        }
    }
})(jQuery, _, M139);