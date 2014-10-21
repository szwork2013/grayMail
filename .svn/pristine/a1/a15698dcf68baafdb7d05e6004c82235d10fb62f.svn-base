//设置域
document.domain = window.location.host.match(/[^.]+\.[^.]+$/)[0].replace(/:\d+/, "");
//是否是本地客户端环境  
function isLocal() {
    return window == window.top;
}

//文件快递页面配置信息
var fsConfig = {
    quickVersion: "v1.0.7.6",
    quickMinVersion: "v1.0.7.5",
    enableCheckVersion: "on",

    //服务器返回标识_成功
    isOk: "S_OK",
    //务器返回标识_失败
    isError: "S_ERROR",
    //服务器返回标识_文件明非法
    fileNameError: "FILE_NAME_ERROR",
    //服务器返回标识_超出最大容量
    overMaxSize: "FREE_SIZE_ERROR",
    //资源文件版本
    versions: {
        basic: "20121031"
    }
};
(function() {
    var partConfig = {
        "1": {
            stylePath: "/rm",
            lighttpUrl: "http://image0.139cm.com",
            userLoginDomain: "http://mail.10086.cn",
            userconfigDomain: "/mw2/disk",
            coremailDomain: "http://appmail3.mail.10086.cn",
            serverPath: "/mw2/disk/disk",
            isRichmail: true
        },
        "12": {
            stylePath: "/rm",
            lighttpUrl: "http://images.139cm.com",
            userLoginDomain: "http://mail.10086.cn",
            userconfigDomain: "/mw2/disk",
            coremailDomain: "http://appmail.mail.10086.cn",
            serverPath: "/mw2/disk/disk",
            isRichmail: true
        }
    };
    var getCookie = function(name) {
        var arr = document.cookie.match(new RegExp("(^|\\W)" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]);
        return "";
    }
    var currConfig = null;
    var host = window.location.host.toLowerCase();
    if (host.length > 0) {
        for (var key in partConfig) {
            if (partConfig[key].userconfigDomain.indexOf(host) > -1) {
                currConfig = partConfig[key];
                break;
            }
        }
    }
    currConfig = currConfig ? currConfig : partConfig["12"];
    for (var key in currConfig) {
        fsConfig[key] = currConfig[key];
    }
})();
var fileSharing = {
    isLoad: false,
    //是否是RM用户
    isRichMail: null,
    //ajax请求提示信息
    ajaxMessage: "加载中...",
    //浮动窗体
    FF: null,
    //获取资源文件路径
    getResourcePath: function() {
        if (fsConfig.isRichmail) {
            return isLocal() ? fsConfig.lighttpUrl + fsConfig.stylePath + "/richmail" : window.top.rmResourcePath;
        }
        return isLocal() ? fsConfig.lighttpUrl + fsConfig.stylePath + "/coremail" : window.top.resourcePath;

    },
    //获取通讯录资源路径
    getMailHtmlPath: function() {
        var stylePath = fsConfig.isRichmail ? "" : "/" + fsConfig.stylePath;
        return fsConfig.coremailDomain + stylePath;
    },
    //获取页面相关环境变量
    loadVariable: function() {
        var url = fileSharing.resolveUrl("fSharingInitData");
        fileSharing.loadScript(url);
    },
    //cm、rm地址解析
    resolveUrl: function(name) {
        var urls = [];
        urls.push(fsConfig.serverPath);
        urls.push("?func=disk:" + name);
        urls.push("&sid=" + fileSharing.tool.getUserInfo());
        urls.push("&rnd=" + Math.random());
        return urls.join("");
    },
    //初始化页面
    //notGlobal: 是否不加载fileExp_global.css
    initialize: function(callback, notGlobal) {
        if (top && top.Utils && top.Utils.PageisTimeOut(true)) {
            return;
        }
        //初始化弹出层
        fileSharing.FF = top.FloatingFrame;
        var resourcePath = fileSharing.getResourcePath();
        if (!notGlobal) {
            fileSharing.loadCss(resourcePath + "/css/fileExp_global.css");
        }

        top.loadScript("libs.pack.js", document);
        top.loadScript("m2011.utilscontrols.pack.js", document);
        top.loadScript("/m2012/js/service/largeattach/m2011.largeattach.all.js", document);

        //回调函数用于加载其他脚本和样式
        if (callback) { callback(); }
    },
    //加载样式
    loadCss: function(args) {
        if (!args) {
            return;
        }
        var source = [];
        if (args.constructor == String) {
            source.push(args);
        } else if (args.constructor == Array) {
            source = args.concat();
        } else {
            source.push(args.toString());
        }
        //加载所以css
        var pn = /^http(s)?:.*/i;
        var rootPath = "coremail";
        var largeAttachPath = "";
        var resourcePath = fileSharing.getResourcePath();
        if (resourcePath.indexOf("/richmail") > -1) {
            rootPath = "richmail";
        }
        var largeAttachPath = resourcePath.replace(rootPath, "largeattachments1");
        for (var i = 0, len = source.length; i < len; i++) {
            var src = source[i];
            if (src && src.length > 0) {
                src = (pn.test(src) ? "" : largeAttachPath) + src + "?v=" + fileSharing.tool.getVersion();
                document.write("<link rel='stylesheet' type='text/css' href='" + src + "' />");
            }
        }
    },
    //加载脚本
    loadScript: function(args, charset) {
        if (!args) {
            return;
        }
        charset = charset || "utf-8";
        var source = [];
        if (args.constructor == String) {
            source.push(args);
        } else if (args.constructor == Array) {
            source = args.concat();
        } else {
            source.push(args.toString());
        }
        //加载所有脚本
        var pn = /^http(s)?:.*/i;
        var rootPath = "coremail";
        var largeAttachPath = "";
        var resourcePath = fileSharing.getResourcePath();
        if (resourcePath.indexOf("/richmail") > -1) {
            rootPath = "richmail";
        }
        var largeAttachPath = resourcePath.replace(rootPath, "largeattachments1");
        for (var i = 0, len = source.length; i < len; i++) {
            var src = source[i];
            if (src && src.length > 0) {
                src = (pn.test(src) ? "" : largeAttachPath) + src + "?v=" + fileSharing.tool.getVersion();
                document.write("<script charset='" + charset + "' src='" + src + "' type='text/javascript'></" + "script>");
            }
        }
    },
    tool: {
        //获取当前资源文件版本
        getVersion: function(src) {
            var version = "";
            if (src && src.length > 0) {
                src = src.toLowerCase();
                var pn = /[^\/]\/([^\.]+)\.[^\/]+$/;
                if (pn.test(src)) {
                    var name = pn.exec(src)[1];
                    var temp = fsConfig.versions[name];
                    if (name && temp) {
                        version = temp;
                    }
                }
            }
            return version.length > 0 ? version : fsConfig.versions.basic;
        },
        //获取用户sid
        getUserInfo: function() {
            var sid = "";
            if (isLocal()) {
                try {
                    if (UserData && UserData.ssoSid) {
                        sid = UserData.ssoSid;
                    }
                } catch (ex) { }
            }
            if (!sid && top.UserData && top.UserData.ssoSid) {
                sid = top.UserData.ssoSid;
            }
            return sid;
        },
        //获取相对路径
        getRelativeUrl: function(path) {
            var url = window.location.href;
            var pn = /http(s)?:\/\//i;
            var protocol = url.match(pn)[0];
            url = url.replace(pn, "");
            url = url.lastIndexOf("/") > 0 ? url.substring(0, url.lastIndexOf("/")) : url;
            while (path.substr(0, 3) == "../") {
                path = path.substring(3);
                url = url.lastIndexOf("/") > 0 ? url.substring(0, url.lastIndexOf("/")) : url;
            }
            return protocol + url + "/" + path;
        },
        invalidAction: function() {
            top.location = top.ucDomain + "/error/systemtip4.html";
        },
        //处理错误信息
        handleError: function(error) {
            if (error.responseText == "") {
                return;
            }
            fileSharing.FF.alert("系统繁忙，请稍后再试。");
        },
        //等待脚本加载
        waitForReady: function(obj, callback) {
            if (!window.__scriptReadyCount) {
                window.__scriptReadyCount = 0;
            }
            window.__scriptReadyCount++;
            var isSuccess = false;
            try {
                isSuccess = (obj != undefined && typeof obj != "undefined");
            } catch (ex) {
                isSuccess = false;
            }
            if (!isSuccess && window.__scriptReadyCount < 5) {
                setTimeout(function() {
                    arguments.callee(arguments);
                }, 2000);
                return;
            }
            if (callback) callback();
        },
        //暂存文件
        keepFiles: function(files) {
            top._tempFileList_ = files;
        },
        //获取暂存文件
        getFiles: function() {
            var files = top._tempFileList_;
            top._tempFileList_ = null;
            return files;
        },
        //添加行为
        addBehavior: function(obj) {
            if (top.addBehaviorExt) {
                top.addBehaviorExt(obj);
            }
        },
        //添加ajax等待提示信息
        startAjaxMsg: function() {
            $(window).bind("ajaxStart", function() {
                if (!isLocal()) {
                    top.WaitPannel.show(fileSharing.ajaxMessage);
                    return;
                }
                var div = $("#divLoading");
                if (div.length == 0) {
                    div = $('<div id="divLoading" style="position:absolute;right:0;top:0;background:#58bc3e;\
                             color:White;padding:5px;width:auto;height:auto;display:none;z-index:100;">' + fileSharing.ajaxMessage + '</div>').appendTo(document.body);
                }
                div.show();
            });
            $(window).bind("ajaxStop", function() {
                if (isLocal()) {
                    $("#divLoading").hide();
                    return;
                }
                top.WaitPannel.hide();
            });
        },
        //移除ajax等待提示信息
        stopAjaxMsg: function() {
            $(window).unbind("ajaxStart");
            $(window).unbind("ajaxStop");
        },
        //注册事件
        // config: {click:{},focus:{}}
        registActions: function(config) {
            if (!config) return;
            $.each(config, function(action, obj) {
                if (!obj) {
                    return true;
                }
                $.each(obj, function(id, func) {
                    if (id.length > 0 && func && func.constructor == Function) {
                        var handler = function(e) {
                            func.apply(this, arguments);
                            if (e.target.tagName == "A") {
                                e.preventDefault();
                            }
                            e.stopPropagation();
                        };
                        eval('$("#{0}").{1}(handler)'.format(id, action));
                    }
                });
            });
        },
        //注册click事件
        registClicks: function(config) {
            var setting = { click: config };
            fileSharing.tool.registActions(setting);
        },
        //替换字符串
        replace: function(str, oldStr, newStr) {
            return str.replace(new RegExp(oldStr, 'g'), newStr);
        },
        //执行异常处理
        tryCatch: function(exec, errors) {
            try {
                if (exec) { exec(); }
            } catch (e) {
                if (errors) { errors(e); }
            }
        },
        //获取文件大小描述
        getFileSizeText: function(length) {
            var unit = "B";
            if (length >= 1024) {
                unit = "K";
                length = length / 1024;
                if (length >= 1024) {
                    unit = "M";
                    length = length / 1024;
                    if (length >= 1024) {
                        unit = "G";
                        length = length / 1024;
                    }
                }
                length = Math.ceil(length * 100) / 100;
            }
            return length + unit;
        },
        //获取进度描述
        getProgressText: function(number) {
            if (!number) {
                return "0%";
            }
            return parseInt(number * 10000) / 100 + "%";
        },
        //获取时间描述
        getTimeText: function(timespan) {
            if (!timespan || timespan < 0) {
                return "";
            }
            var seconds = parseInt(timespan / 1000);
            if (seconds == 0) {
                return "00:00";
            }
            var s = seconds % 60;
            var minutes = parseInt(seconds / 60);
            var m = minutes % 60;
            var hours = parseInt(minutes / 60);
            var text = (m > 9 ? m : "0" + m) + ":" + (s > 9 ? s : "0" + s);
            if (hours > 0) {
                text = hours + ":" + text;
            }
            return text;
        },
        //获取文件名
        getFileName: function(filePath) {
            return filePath.replace(/^[\s\S]+\\([^\\]+)$/, "$1");
        },
        //将时间字符串转换为时间
        parseDate: function(str) {
            str = str.trim();
            var result = null;
            var reg = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
            var m = str.match(reg);
            if (m) {
                result = new Date(m[1], (m[2] - 1), m[3], m[4], m[5], m[6]);
            }
            return result;
        },
        //弹出文件选择框
        showSelectBox: function (mode, callback) {
            mode = mode || {};

            if (mode.type == "continueUpload") {
                if (!$.browser.msie) {
                    fileSharing.FF.alert("续传文件仅能在IE浏览器下使用");
                    return;
                }
            }

            //还得实现续传
            if (top.M2012.UI.Dialog.LargeAttach) {
                doCallback();
            } else {
                top.M139.UI.TipMessage.show("正在加载上传组件...");
                top.M139.core.utilCreateScriptTag({
                    src: "m2012.ui.largeattach.pack.js"
                }, function () {
                    top.M139.UI.TipMessage.hide();
                    doCallback();
                });
            }
            function doCallback() {

                if (mode.type == "continueUpload") {
                    if (top.M139.Plugin.FastUpload.checkControlSetup() <= 0) {
                        fileSharing.FF.alert("您当前浏览器没有安装139邮箱小工具,无法进行续传。");
                        return;
                    }
                }


                if (window.largeAttachDialog) {
                    //已存在，取消最小化
                    window.largeAttachDialog.cancelMiniSize();
                } else {
                    if (top.largeAttachDialog) {
                        $Msg.alert("超大附件正在上传中，无法同时进行多个上传任务", {
                            icon: "warn"
                        });
                        return;
                    } else {
                        var view = top.largeAttachDialog = window.largeAttachDialog = new top.M2012.UI.Dialog.LargeAttach(mode);
                        view.render();
                        view.dialog.on("remove", function () {
                            top.largeAttachDialog = window.largeAttachDialog = null;
                        });
                        if (callback) {
                            callback(view);
                        }
                    }
                }
            }
        },
        //获取选中的文件
        //isGetObj: true:获取文件对象/false:获取文件id
        getSelectedFiles: function(isGetObj) {
            var retValue = [],
				selectedFiles = sharingFileDisk.selectedFiles;
			
			if (!isGetObj) return selectedFiles;
			for (var i = 0, l = selectedFiles.length; i < l; i++) {
				var obj = fileSharing.tool.getFileById(selectedFiles[i]);
				obj && retValue.push(obj);
			}
			return retValue;
        },
        //根据文件id获取文件对象
        getFileById: function(fid) {
            var files = window.fileList ? window.fileList : [];
            for (var i = 0, length = files.length; i < length; i++) {
                if (files[i].fid == fid) {
                    return fileList[i];
                }
            }
            return null;
        },
        //获取文件扩展名
        getFileExtName: function(Name) {
            var reg = /\.([^.]+)$/;
            var m = Name.match(reg);
            return m ? m[1] : "";
        },
        //获取文件名，不带后缀
        getFileNoExtName: function(name) {
            name = name ? name : "";
            var index = name.lastIndexOf(".");
            return index > -1 ? name.substring(0, index) : name;
        },
        //根据文件名获取获取文件样式名
        getFileImageClass: function(fileName) {
            fileName = fileName ? fileName : "";
            var ext = fileSharing.tool.getFileExtName(fileName);
            var retValue = "other";
            if (!ext) {
                return retValue;
            }
            ext = ext.toLowerCase();
            if (!window.fileIconCache) {
                fileIconCache = ["swf", "fla", "share", "folder", "tif", "txt", "psd", "rar", "zip", "xml", "html", "java", "fon", "jpg", "gif", "png", "bmp", "tiff", "mpeg", "avi", "wmv", "mov", "mpg", "vob", "rmvb", "mp3", "wma", "wav", "asf", "mp4", "sis", "sisx", "cab", "doc", "docx", "pdf", "xls", "xlsx", "ppt", "pptx"];
            }
            $.each(fileIconCache, function(i, n) {
                if (n == ext) {
                    retValue = ext;
                    return false;
                }
            });
            return retValue;
        },
        //获取xml文档操作对象
        getXmlDoc: function(text) {
            var doc = new ActiveXObject("Microsoft.XMLDOM");
            doc.loadXML(text);
            return doc;
        }
    }
};

String.prototype.shortName = function(bound) {
    bound = bound || 35;
    if (this.length <= bound) {
        return this;
    }
    var point = this.lastIndexOf(".");
    if (point == -1 || this.length - point > 5) {
        return this.substring(0, bound - 2) + "…";
    }
    var pattern = "^(.{" + (bound - 4) + "}).*(\\.[^.]+)$";
    return this.replace(new RegExp(pattern), "$1…$2");
}

//获取文件字节数
String.prototype.getBytes = function() {
    return this.replace(/[^\x00-\xFF]/g, "aa").length;
}
