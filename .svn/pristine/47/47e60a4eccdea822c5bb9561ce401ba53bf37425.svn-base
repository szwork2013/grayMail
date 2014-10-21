UploadProxy = {
    isLoaded: function() {
        var iframe = top.document.getElementById("uploadproxy");
        try {
            if (iframe.contentWindow.isReady) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    },
    isSetup: function() {
        return top.document.getElementById("uploadproxy").contentWindow.isSetup;
    },
    load: function(callback) {
        top.$("#uploadproxy").remove();
        var url = fileSharing.tool.getRelativeUrl("uploadproxy.htm");
        var iframe = top.jQuery("<iframe id='uploadproxy' style='display:none' name='uploadproxy'></iframe>".format(url));
        iframe[0].src = url;
        iframe.load(function() {
            iframe.unbind("load", arguments.callee);
            if (callback) callback(this.contentWindow.isSetup);
        });
        iframe.appendTo(top.document.body);
    },
    ready: function(callback) {
        if (UploadProxy.isLoaded() && top.document.getElementById("uploadproxy").contentWindow.isSetup) {
            if (callback) callback(true);
        } else {
            UploadProxy.load(callback);
        }
    },
    getProxyWindow: function() {
        if (UploadProxy.isLoaded()) {
            return top.frames["uploadproxy"];
        } else {
            return null;
        }
    },
    setFolderInfo: function(FolderInfo) {
        var proWin = UploadProxy.getProxyWindow();
        if (proWin) proWin.FolderInfo = FolderInfo;
    }
}



function onLog(logText) {
    try {
        var data = "{0}:{1}:{2}";
        data = data.format(20, new Date().getTime(), logText);
        top.SendScriptLog(data);
    }
    catch (e) {
    }
}
if (window.isLocal && isLocal()) {
    window.onerror = function() { return true; }
    document.onkeydown = function() {
        if (event.keyCode == 8 && !/INPUT|TEXTAREA/.test(event.srcElement.tagName)) {
            return false;
        }
    }
}

jQuery.extend({
    //Ajax提交Xml
    /*
    config.url ;        请求连接[not null]
    config.dataType ;   ajax输出类型，默认为json
    config.data :       xml数据
    config.success:     请求成功後[not null]
    config.error:       请求失败
    config.async:       是否异步，默认为true
    */
    postXml: function(config, jq) {
        if (config == null) {
            return;
        }
        var errors = config["error"] || fileSharing.tool.handleError;
        var async = typeof config["async"] == "undefined" ? true : config["async"];
        var ajaxParam = {
            type: "POST",
            contentType: "text/xml",
            async: async,
            url: config["url"],
            data: config["data"],
            complete: config["complete"],
            success: function(result) {
                if (async == true) {
                    processData(result);
                }
            },
            error: errors
        };
        var query = (jq || jQuery);
        if (async == false) {
            var response = query.ajax(ajaxParam).responseText;
            processData(response);
        } else {
            query.ajax(ajaxParam);
        }

        //处理获取的数据
        function processData(result) {
            var isError = false;
            try {
                result = eval("(" + result + ")");
            } catch (ex) {
                result = null;
            }
            if (result && result.code == 999) {
                fileSharing.tool.invalidAction();
                return;
            }
            config["success"].apply(result, arguments);
        }
    },
    //是否是数组
    isArray: function(f) {
        return f != null && f.constructor == Array;
    },
    //是否数字
    isNumber: function(n) {
        return /^\d+$/.test(n);
    },
    //弹出窗口高度自适应
    dialogAutoHeight: function(a, callback) {
        $.fn.extend({
            hide: function() {
                $(this).css("display", "none");
                if (callback) {
                    callback();
                    return;
                }
                autoHeight(a);
            },
            show: function() {
                $(this).css("display", "block");
                if (callback) {
                    callback();
                    return;
                }
                autoHeight(a);
            }
        });

        function autoHeight(a) {
            var h1 = $("body").height();
            if (!$.browser.msie) {
                h1 = parseInt(h1) + 7;
            }
            if (top.FloatingFrame) {
                if (a) {
                    top.FloatingFrame.setHeight(a, true);
                }
                else {
                    top.FloatingFrame.setHeight(h1, true);
                }
            }
        }
    }
});

//Xml数据组合工具类
/* Xml 组合方法 */
function XmlUtility() {
    this.__strs = [];
}
/* 实例方法 */
//组合xml字符串（比“+”高效）
XmlUtility.prototype.append = function(str) {
    this.__strs.push(str);
    return this;
};
XmlUtility.prototype.join = function(separator) {
    if (!separator) {
        separator = "";
    }
    return this.__strs.join(separator);
};
XmlUtility.escape = function(val) {
    return val.toString().replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&apos;");
}
/* 静态方法 */
//从Json数据转换Xml，将数据类型作为标签
XmlUtility.parseJson2Xml = function(json, excludeHeader, name) {
    var xml = new XmlUtility();
    if (!excludeHeader) {
        xml.append("<?xml version=\"1.0\" encoding=\"utf-8\" ?>");
    }
    xml.append(name ? "<object name=\"{0}\">".format(name) : "<object>");

    jQuery.each(json, function(name, val) {
        if (typeof val == "undefined" || val == null) {
            return;
        }
        if (jQuery.isArray(val)) {
            xml.append("<list name=\"{0}\">".format(name));
            jQuery.each(val, function() {
                xml.append(XmlUtility.parseJson2Xml(this, true));
            })
            xml.append("</list>");
        }
        else if (val.constructor == String) {
            xml.append("<string  name=\"{0}\">{1}</string>".format(name, XmlUtility.escape(val)));
        }
        else if ((typeof val == 'number') && val.constructor == Number) {
            xml.append("<int name=\"{0}\">{1}</int>".format(name, val));
        }
        else if ((typeof val == 'object') && val.constructor == Date) {
            xml.append("<date name=\"{0}\">{1}</date>".format(name, val));
        }
        else if ((typeof val == 'boolean') && val.constructor == Boolean) {
            xml.append("<bool name=\"{0}\">{1}</bool>".format(name, val));
        }
        else if ((typeof val == 'object') && val.constructor == Object) {
            xml.append(XmlUtility.parseJson2Xml(val, true, name));
        }
        else {
            //其余一切用字符串
            xml.append("<string name=\"{0}\">{1}</string>".format(name, val.toString()));
        }
    });
    xml.append("</object>");
    return xml.join();
};

(function(){
	if ("function" != typeof Array.prototype.indexOf){
		/**
		 * 查询数组中元素的索引
		 * @param {String} ele 元素
		 */
		Array.prototype.indexOf = function (ele) {
			for (var i = 0, l = this.length; i < l; i++) {
				if (ele === this[i]) {
					return i;
				}
			}
			return -1;
		}
	}
})();