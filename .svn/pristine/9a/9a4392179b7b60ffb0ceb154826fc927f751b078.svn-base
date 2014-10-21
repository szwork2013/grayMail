DiskCommon = {
    /**
    *封闭ajax对象,可跨域
    *conf: ajax参数对象{url, data, method, isCross, frameName, beforeCallback(), okCallback()}
    */
    _ajax: {
        create: function(conf) {
            var objXHR = null;
            var isCross = arguments[0]; //是否是跨域请求
            var frameName = arguments[1]; //跨域请求时的frame名称
            try {
                if (window.XMLHttpRequest) {
                    if (conf.isCross) {
                        objXHR = new window.frames[conf.frameName]["XMLHttpRequest"];
                    } else {
                        objXHR = new window["XMLHttpRequest"];
                    }
                } else {
                    var xhrArr = ["MSXML2.XMLHTTP.5.0", "MSXML2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
                    for (var i = 0; i < xhrArr.length; i++) {
                        try {
                            if (conf.isCross) {
                                objXHR = new window.frames[conf.frameName].ActiveXObject[xhrArr[i]];
                                break;
                            } else {
                                objXHR = new window.ActiveXObject[xhrArr[i]];
                                break;
                            }
                        } catch (e) { }
                    }
                }
            } catch (e) { }
            return objXHR;
        },
        send: function(ajaxConf) {
            var xmlHttp = this.create(ajaxConf);
            with (xmlHttp) {
                try {
                    open(ajaxConf.method, ajaxConf.url, true);
                    setRequestHeader("Content-Type", "application/xml");
                    setRequestHeader("Accept", "text/javascript");
                    send(ajaxConf.data);
                    onreadystatechange = function() {
                        if (xmlHttp.readyState != 4) {
                            ajaxConf.beforeCallback();
                        }
                        if (xmlHttp.readyState == 4 && ((xmlHttp.status >= 200 && xmlHttp.status <= 300) || xmlHttp.status == 304)) {
                            okCallback(reponseText);
                        }
                    }
                } catch (e) { }
            }
        }
    }
}
/**
*开关对象(配置各种事件开关)
*/
var DiskSwitchConfig = {
    sendWeibo: false
}
DiskTool = {
    /**
    *返回要请求的地址
    */
    resolveUrl: function(name, needPara) {
        var urls = [];
//        urls.push("/mw2/disk/disk?func=disk:" + name);
        urls.push("/mw2/file/disk?func=disk:" + name);
        if (needPara) {
            urls.push("&sid=" + top.sid);
            urls.push("&rnd=" + Math.random());
        }
        return urls.join("");
    },
    /**
    *发送到微博 fileID：要发送的文件ID
    */
    sendToWb: function(fileID) {
        //发送请求给服务端,进行授权验证，并返回要跳转的地址
        var newwin = window.open();
        $.postXml({
            url: DiskTool.resolveUrl('weibo', true),
            data: XmlUtility.parseJson2Xml({
                fileid: fileID
            }),
            success: function(result) {
                if (result.code == 'S_OK') {
                    newwin.location.href = result.url;
                }
            }
        });
    },
    getResource: function() {
        var resourcePath = window.top.resourcePath;
        if (top.isRichmail) {//rm环境,返回rm变量
            resourcePath = window.top.rmResourcePath;
        }
        return resourcePath;
    },
    /*去掉手机号前的86*/
    remove86: function(number) {
        if (typeof number != "string") number = number.toString();
        return number.trim().replace(/^86(?=\d{11}$)/, "");
    },
    cResizeWrapper: function() {
        var resizeAct = function() {
            var win = $(window);
            $(".content").height(DiskTool.getWinSize()[1] - 20);
        };
        $(function() {
            resizeAct();
        })
        DiskTool.wResize(window, resizeAct);
    },
    /**
    *根据文件名获取后缀名
    */
    getFileExtName: function(fileName) {
        if (fileName) {
            var reg = /\.([^.]+)$/;
            var m = fileName.match(reg);
            return m ? m[1] : "";
        } else {
            return "";
        }
    },
    /**
    *获取文件名称(无后缀名)
    */
    getFileNameNoExt: function(fileName) {
        fileName = fileName ? fileName : "";
        if (fileName.lastIndexOf(".") > 0) {
            return fileName.substring(0, fileName.lastIndexOf("."));
        } else {//无后缀名情况
            return fileName;
        }
    },
    /**
    *获取文件名称
    */
    getFileName: function(filePath) {
        return filePath.replace(/^[\s\S]+\\([^\\]+)$/, "$1");
    },
    /**
    *根据后缀名获取icon样式
    */
    getFileImageClass: function(ext) {
        var type = "other";
        ext = ext.toLowerCase();
        for (var p in DiskTool.icons) {
            var arr = DiskTool.icons[p];
            if ($.inArray(ext, arr) > -1) {
                type = p;
                break;
            }
        }
        return type;
    },
    getPersentText: function(floatNum) {
        var n = floatNum * 100;
        n = parseInt(n);
        return n + "%";
    },
    getArrayAverage: function(arr) {
        var result = 0;
        for (var i = 0, len = arr.length; i < len; i++) {
            result += arr[i];
        }
        return parseInt(result / len);
    },
    getTextTimeSpan: function(seconds) {
        if (isNaN(seconds)) {
            return "未知";
        } else if (seconds <= 0) {
            return "0秒";
        }
        var s = seconds % 60;
        var minutes = parseInt(seconds / 60);
        var m = minutes % 60;
        var hours = parseInt(minutes / 60);
        var text = s + "秒";
        if (m > 0) text = m + "分" + text;
        if (hours > 0) text = hours + "小时" + text;
        return text;
    },
    /**
    *icon与后缀名对应列表
    */
    icons: {
        doc: ["wiz", "rtf", "dot", "doc", "wbk"],
        docx: ["docx"],
        xls: ["xlw", "xlv", "xlt", "slk", "xls", "xld", "xll", "xlb", "xla", "xlk", "dif", "csv", "xlc", "xlm"],
        xlsx: ["xlsx"],
        ppt: ["ppa", "pps", "ppt", "pwz", "pot"],
        pptx: ["pptx"],
        rar: ["rar"],
        zip: ["zip", "7z"],
        psd: ["psd"],
        xml: ["xml", "xsl"],
        html: ["html", "htm"],
        java: ["java"],
        fon: ["fon"],
        jpg: ["jpg"],
        gif: ["gif"],
        png: ["png"],
        bmp: ["bmp"],
        tiff: ["tiff"],
        mpeg: ["mpeg"],
        avi: ["avi"],
        wmv: ["wmv"],
        mov: ["mov"],
        mpg: ["mpg"],
        vob: ["vob"],
        rmvb: ["rmvb"],
        mp3: ["mp3"],
        wma: ["wma"],
        wav: ["wav"],
        asf: ["asf"],
        mp4: ["mp4"],
        sis: ["sis"],
        sisx: ["sisx"],
        cab: ["cab"],
        pdf: ["pdf"],
        tif: ["tif"],
        txt: ["txt"],
        swf: ["swf"],
        fla: ["fla"],
        flv: ["flv"],
        exe: ["exe"],
        vsd: ["vsd"],
        iso: ["iso"],
        rm: ["rm"],
        midi: ["midi"],
        chm: ["chm"],
        css: ["css"]
    },
    /**
    *后缀名与样式类型对应关系
    */
    getExtType: function(ext) {
        ext = $.trim(ext);
        if (ext != "") {
            var category = {
                "pic": "bmp,gif,ico,jpg,jpeg,png,tif,jfif,tiff,jpe",
                "audio": "mid,wma,wav,mp3,cda,midi",
                "video": "avi,wmv,wmp,rm,ram,rmvb,ra,mpg,mpeg",
                "office": "doc,docx,xls,xlsx,ppt,pps,pptx,vsd",
                "app": "exe"
            };
            var type = "";
            ext = ext.toLowerCase();
            $.each(category, function(name, val) {
                if (val.indexOf(ext) > -1) {
                    type = name;
                    return false;
                }
            });
        }
        return type;
    },

    //需要在内页调用(自动取SID)
    //type[可选]:10彩云控件,20文件快递控件,30,基础邮箱控件
    sendLogMsg: function(msg, type) {
        try {
            var data = "{0}:{1}:{2}";
            data = data.format(type, new Date().getTime(), msg);
            top.SendScriptLog(data);
        }
        catch (e) { }
    },

    /**
    *切换TAB,disk/myshare/friendshare
    */
    SwichPageMode: function(mode) {
        var cwindow = top.$("iframe#diskDev")[0].contentWindow;
        switch (mode) {
            case "disk":
                {
                    cwindow.$("#mainFrame")[0].src = "disk_default.html?sid=" + top.sid;
                    break;
                }
            case "myshare":
                {
                    cwindow.$("#mainFrame")[0].src = "disk_my-share.html?sid=" + top.sid;
                    break;
                }
            case "friendshare":
                {
                    cwindow.$("#mainFrame")[0].src = "disk_friend-share.html?sid=" + top.sid;
                    break;
                }
            case "Album":
                {
                    cwindow.$(".nav-hd li").removeClass("current");
                    cwindow.$("#liAlbum").addClass("current");
                    cwindow.$("#mainFrame")[0].src = "disk_album.html";
                    break;
                }
        }
    },
    /**
    *图片加载失败样式
    */
    scriptImgError: function(picPath) {
        return "if(this.error){this.alt=\"加载有误\";}else{this.error=1;this.src=\"" + picPath + "\";}";
    },
    /**
    *获取长度，数字字母一般字符算1个，全角字符中文算2
    */
    len: function(str) {
        if (str == null) {
            return 0;
        }
        return str.replace(/[^\x00-\xff]/g, "**").length;
    },
    //替换字符串
    replace: function(str, oldStr, newStr) {
        return str.replace(new RegExp(oldStr, 'g'), newStr);
    },
    /**
    *将数据库返回的时间字符串转换为格式 yyyy-MM-dd HH:mm:ss
    */
    formatDate: function(s) {
        s = s ? s : "";
        var reg = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
        var match = s.match(reg);
        return match ? match[0] : s;
    },
    /**
    *将参数添加到URL中
    */
    appendParaToUrl: function(url, params) {
        var strPara = $.param(params);
        if (strPara != "") {
            url += (url.indexOf("?") >= 0 ? "&" : "?") + strPara;
        }
        return url;
    },
    //检查文件(夹)名是否含有\/:*?"<>|等特殊字符
    validateName: function(s) {
        var invalidCodes = ['*', '|', ':', '"', '<', '>', '?', '\\', '\'', '/'];
        var code = "";
        for (var i = 0, length = s.length; i < length; i++) {
            code = s.charAt(i);
            for (var j = 0, len = invalidCodes.length; j < len; j++) {
                if (code == invalidCodes[j])
                    return "不能有以下特殊字符 \\/:*?\"<>|";
            }
        }
        return null;
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
    //获取彩云内容文档窗体
    getDiskWindow: function() {
		var mainFrame = top.$("iframe#diskDev")[0].contentWindow.$("#mainFrame")[0];

		if (mainFrame) {
			return mainFrame.contentWindow;
		} else {
			return top.$("iframe#diskDev")[0].contentWindow;
		}
    },
    wResize: function(win, handler) {
        if (document.all) {
            $(win.frameElement).resize(handler);
        } else {
            $(win).resize(handler);
        }
    },
    getWinSize: function(win) {
        var myWidth = 0, myHeight = 0;
        if (!win) {
            win = window;
        }
        var document = win.document;
        if (typeof (win.innerWidth) == 'number') {
            myWidth = win.innerWidth;
            myHeight = win.innerHeight;
        }
        else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
            myWidth = document.documentElement.clientWidth;
            myHeight = document.documentElement.clientHeight;
        }
        else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
            myWidth = document.body.clientWidth;
            myHeight = document.body.clientHeight;
        }
        return [myWidth, myHeight];
    },
    invalidAction: function() {
        top.location = top.ucDomain + "/Error/systemTip4.html";
    },
    useWait: function() {
        $("body").bind("ajaxStop", function() { top.WaitPannel.hide(); });
        $("body").bind("ajaxStart", function() { top.WaitPannel.show(); });
    },
    unWait: function() {
        $("body").unbind("ajaxStop");
        $("body").unbind("ajaxStart");
    },
    //显示加载中
    ShowWaiting: function(msg) {
        top.WaitPannel.show(msg);
    },
    //隐藏加载中
    HideWaiting: function() {
        top.WaitPannel.hide();
    },
    notUseWait: function() {
        $("body").unbind("ajaxStop");
        $("body").unbind("ajaxStart");
    },
    //main的滚动条返回顶部
    mainScroll: function() {
        top.$("iframe#diskDev")[0].contentWindow.scrollTop();
    },
    FF: top.FloatingFrame,
    //****弹出窗口自动伸长************
    DialogAuto: function() {
        $.fn.extend({
            hide: function() {
                $(this).css("display", "none");
                AutoHeight();
            },
            show: function() {
                $(this).css("display", "block");
                AutoHeight();
            }
        });
        function AutoHeight() {
            if (top.FloatingFrame) {
                setTimeout(function() {
                    var h1 = $("body").height();
                    if (!$.browser.msie) {
                        h1 = parseInt(h1) + 7;
                    }
                    top.FloatingFrame.setHeight(h1, true);
                }, 0);
            }
        }
    },
    //打开彩云标签
    openDiskFrame: function(id) {
        var param = "&goid=";
        if (id) {
            param = param + id;
        }
        top.Links.show("diskDev", param, true);
    },
    /**
    *打开上传窗口
    *uploadComeFrom: 调用命令的来源(0首页，1相册，2音乐)
    *pid: 文件夹ID
    *pName: 文件名称
    *fileId: 文件ID
    *uploadType: 上传类型
    */
    openUpload: function(uploadComeFrom, pid, pName, fileId, uploadType) {
        //DiskTool.addDiskBehavior(7001, 25, 20); //添加行为日志
        pid = pid ? pid : "";
        fileId = fileId ? fileId : "";
        pName = pName ? pName : "";
        uploadComeFrom = uploadComeFrom ? uploadComeFrom : "0";
        if (!uploadType) {
            uploadType = DiskTool.getSupportUploadType();
        } else {
            var knownUploadType = true;
        }
        var height = 280;
        var width = 550;
        if (fileId && uploadType != "control") {
            DiskTool.FF.alert("续传文件需要安装139邮箱小工具！", function() {
                Utils.openControlDownload();
            });
            return;
        }
        if (top._diskUploadWindow && !top._diskUploadWindow.isDisposed) {
            if (!top.$Msg) {
                top._diskUploadWindow.show();
                return;
            }
        }
        var url = "";
        if (uploadType == "flash" && !Utils.flashPlayerVersion(10)) {
            uploadType = "common";
        }
        if (uploadType == "common") {
            url = "/m2012/html/disk/disk_upload.html?comeFrom={0}&id={1}&dirName={2}";
            url = url.format(uploadComeFrom, pid, pName);
            height = 400;
        } else if (uploadType == "flash") {
            url = "/m2012/html/disk/disk_flashupload.html?comeFrom={0}&id={1}&fileid={2}&dirName={3}";
            url = url.format(uploadComeFrom, pid, fileId, pName);
            height = 465;
            width = 520;
        } else if (uploadType == "control") {
            url = "/m2012/html/disk/disk_fastupload.html?comeFrom={0}&id={1}&fileid={2}&dirName={3}";
            url = url.format(uploadComeFrom, pid, fileId, pName);
            height = 470;
        }
        var uploadForChoose = false; //上传方式是否可选,用于测试
        if (knownUploadType || !uploadForChoose) {
            top._diskUploadWindow = top.FloatingFrame.open("上传文件", url, width, height, true, true);
        } else {
            var htmlCode = "<div>请选择上传类型:<br/>\
            <input name='netDiskUploadType' onclick='window.netDiskUploadTypeSelect=\"common\"' type='radio' />普通上传<br/>\
            <input name='netDiskUploadType' onclick='window.netDiskUploadTypeSelect=\"flash\"' type='radio' />flash上传<br/>\
            <input name='netDiskUploadType' checked='1' onclick='window.netDiskUploadTypeSelect=\"control\"' type='radio'/>控件上传</div>";
            top.netDiskUploadTypeSelect = "control";
            DiskTool.FF.confirm(htmlCode, function() {
                var uploadType = top.netDiskUploadTypeSelect;
                DiskTool.openUpload(uploadComeFrom, pid, pName, fileId, uploadType);
            });
        }
    },
    /*
    *文件下载
    *说明： “我的文件夹” 下载时需要传递选择的文件夹id、文件id
    *       "音乐"、“相册” 只传选中的文件id，如果是选择了文件夹，需遍历出所有文件然后组装id
    */
    downloadFile: function(files, folders, docname, fileAllCount) {
        /*界面超时处理*/
        if (Utils.PageisTimeOut(true)) {
            return;
        }
        //先打开一个窗口
        var onlyOneFile = false;
        //单文件下载
        if (files && files.split(",").length == 1 && !folders) {
            onlyOneFile = true;
        }
        var downLoadUrl = "";
        var packState = "";
        $.postXml({
            url: DiskTool.resolveUrl("download", true),
            data: XmlUtility.parseJson2Xml({
                userNumber: top.UserData.userNumber,
                folderid: folders ? folders : "",
                fileid: files ? files : "",
                downname: escape(docname)
            }),
            timeout: 120000,
            async: false,
            success: function(result) {
                //处理album数据
                if (result.code == DiskConf.isOk) {
                    fileAllCount = fileAllCount ? fileAllCount : 0;
                    DiskTool.addDiskBehavior({
                        actionId: 17,
                        thingId: 0,
                        moduleId: 11,
                        actionType: 10
                    });
                    //DiskTool.addDiskBehavior(17, 11, 10, null, fileAllCount);
                    //fileDown(result["var"], downWin, onlyOneFile);
                    downLoadUrl = result["var"].url;
                    packState = result["var"].state;
                }
                else { DiskTool.FF.alert(result.summary); }
            },
            error: function(error) {
                DiskTool.handleError(error);
            }
        });
        fileDown(downLoadUrl, onlyOneFile, packState);
        //下载文件
        function fileDown(result, onlyOneFilePara, state) {
            if (!result) {
                return;
            }
            //单文件下载
            if (onlyOneFilePara) {
                if (result) {
                    window.open(result);
                }
                return;
            }
            //多文件下载
            var url = "/m2012/html/disk/disk_filedownload.html?downloadurl={0}&state={1}";
            url = url.format(escape(result), state);
            top.FF.open("多个文件打包", url, 480, 100, true);
        }
    },
    //获取虚拟盘下载地址
    //winbit: 操作系统类型32/64
    getDownLoadVdUrl: function(isrm) {
        var url = top.getDomain("rebuildDomain");
        return url += "/diskmw/netdisk/spaceinterface/VirtualDisk/vdtool/setup/Mail139_disk.exe";
    },
    //获取主机名
    getHost: function(url) {
        var host = "";
        url = url ? url : window.location.href;
        var match = url.match(/http:\/\/[^\/]+(?=\/)/g);
        if (match != null && match.length > 0) {
            host = match[0];
        }
        return host;
    },
    /*改用top中的addBehavior*/
    addDiskBehavior: function(obj) {
        if (top.addBehaviorExt) {
            top.addBehaviorExt(obj);
        }
    },

    /**
    *获取支持的上传类型
    */
    getSupportUploadType: function() {
        var type = "common";
        if ($.browser.msie) {
            if (isSupportControlUpload_IE() && isSupportFlashUpload_IE()) {
                //type = "control";//由于控件升级之后，导致彩云控件上传不可用，暂时屏蔽掉控件上传 chenzhuo 2013/7/2
				type = "flash";
            } else if (isSupportFlashUpload_IE()) {
                type = "flash";
            }
        } else if (isSupportFlashUpload_NotIE()) {
            type = "flash";
        }
        //必须支持flash上传9.0以上版本
        function isSupportFlashUpload_NotIE() {
            if (navigator.plugins && navigator.plugins.length > 0) {
                var swf = navigator.plugins["Shockwave Flash"];
                if (swf) {
                    var words = swf.description.split(" ");
                    for (var i = 0; i < words.length; ++i) {
                        if (isNaN(parseInt(words[i]))) continue;
                        var flashVersion = parseInt(words[i]);
                        if (flashVersion >= 9) {
                            return true;
                        }
                    }
                }
            } else {
                return false;
            }
        }
        function isSupportFlashUpload_IE() {
            if (window.ActiveXObject) {
                try {
                    var flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.10");
                } catch (e) {
                    try {
                        var flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.9");
                    } catch (e) { }
                }
                if (flash) return true;
            }
            return false;
        }
        function isSupportControlUpload_IE() {
            return Utils.isUploadControlSetup();
        }
        return type;
    },
    /**
    *加载播放器
    */
    loadPlayer: function(isRefresh, loadpageCallback) {
        if (isRefresh) {
            DiskTool.tabFixPlayer(false);
            top.$("#playerframe").parent().remove();
        }
        if (top.$("#playerframe").length == 0) {
            top.MusicPlayerLoadpageCallback = loadpageCallback;
            top.$("<div style='position:absolute;z-index:999;top:24px;right:7px;'><iframe id='playerframe' src='"
                + "/m2012/html/disk/disk_musicplayer.html' style='width:212px;height:21px;' scrolling='no' frameborder='0'></iframe></div>")
            .appendTo(top.document.body);
            DiskTool.tabFixPlayer(true);
        }
    },
    tabFixPlayer: function(isShow) {
        if (top.MM && top.MM.tab && top.MM.tab.showPlayer) {
            top.MM.tab.showPlayer(isShow);
        }
    },
    handleError: function(error) {
        if (error.responseText == "") {
            return;
        }
        DiskTool.FF.alert("系统繁忙，请稍后再试。");
    },
    //单位最小为k，最大为G
    getFileSizeText: function(length, ignoreByte) {
        if (length == 0 || isNaN(length)) {
            return "0K";
        }
        if (length < 1024) {
            length = 1024;
        }
        var unit = "B";
        if (length >= 1024) {
            unit = "K";
            length = length / 1024;
            if (length >= 1024) {
                unit = "M";
                length = length / 1024;
                if (length >= 1000) {
                    unit = "G";
                    length = length / 1024;
                }
            }
        }
        return Math.round(length * 10) / 10 + unit;
    },
    /**
    *mapper              : id与函数名称的映射json
    *getFuncFromValue    : 根据json的函数名获取函数
    *getAnchorFromKey    : 根据json的id获取jq对象
    */
    registerAnchor: function(mapper, getFuncFromValue, getAnchorFromKey) {
        if (getAnchorFromKey == null) {
            getAnchorFromKey = function(id) {
                return $.getById(id);
            };
        }
        if (getFuncFromValue == null) {
            getFuncFromValue = function(val) {
                return window[val];
            }
        }
        $.each(mapper, function(name, val) {
            var tempEle = getAnchorFromKey(name);
            tempEle.click(function(e) {
                if (tempEle.length > 0 && !tempEle[0].disabled) {
                    var func = getFuncFromValue(val);
                    if (func != null && $.isFunction(func)) {
                        func(this);
                    }
                }
                e.preventDefault();
            });
        });
    },
    /**
    *点击功能按钮弹出menu
    */
    dropMenuAction2: function(buttonId, divid, showEvent) {
        //显示
        $("#" + divid).hide();
        $("#" + buttonId).click(function(e) {
            $(".drop-menu").hide();
            if (!this.disabled) {
                if (window["dropMenuAction_timeoutid"] != null) {
                    window.clearTimeout(window["dropMenuAction_timeoutid"]);
                    window["dropMenuAction_timeoutid"] = null;
                }
                //定位div坐标
                var op = $("#" + buttonId).offset();
                $("#" + divid).css({ position: "absolute", left: op.left + "px", top: (op.top + 25) + "px" });
                $("#" + divid).show();
                if (showEvent) {
                    showEvent();
                }
            }
            e.stopPropagation();
        }).children("i").click(function(e) {
            $(this).parent().click();
            e.stopPropagation();
        });
        $(document).click(function(e) {
            if (e.target.id != buttonId) {
                $("#" + divid).hide();
            }
        });
    },
    dropMenuAction3: function(buttonId, divid, showEvent) {
        //显示
        $("#" + divid).hide();
        $("#" + buttonId).click(function(e) {
            $(".drop-menu").hide();
            if (!this.disabled) {
                if (window["dropMenuAction_timeoutid"] != null) {
                    window.clearTimeout(window["dropMenuAction_timeoutid"]);
                    window["dropMenuAction_timeoutid"] = null;
                }
                //定位div坐标
                var op = $("#" + buttonId).offset();
                document.getElementById(divid).style.position = "absolute";
                document.getElementById(divid).style.left = op.left + "px";
                document.getElementById(divid).style.bottom = "30px";
                $("#" + divid).show();
                if (showEvent) {
                    showEvent();
                }
            }
            e.stopPropagation();
        }).children("i").click(function(e) {
            $(this).parent().click();
            e.stopPropagation();
        });
        $(document).click(function(e) {
            if (e.target.id != buttonId) {
                $("#" + divid).hide();
            }
        });
    },
    //添加音乐到播放器
    // list [{FileId:xx,Name:yy}]
    appendMusic: function(list) {
        if (window.top.MusicPlayer) {
            window.top.MusicPlayer.appendSongList(list);
        } else {
            DiskTool.loadPlayer(true, function() {
                if (window.top.MusicPlayer) {
                    window.top.MusicPlayer.appendSongList(list);
                }
            });
        }
    },
    //主窗体高度与内容自适应
    AddListenScroll: function() {
        var h = 0;
        var pw = window.parent.$("#mainFrame")[0];
        window.setInterval(function() {
            pw.style.height = document.body.offsetHeight + "px";
        }, 1000);
    },
    getUserInfo: function() {
        if (!window["cacheUid"]) {
            window["cacheUid"] = Utils.queryString("sid", DiskTool.getDiskWindow().parent.location.href)
        }
        return window["cacheUid"];
    },
    //制作明信片
    showPostCard: function(fileId, isNotFromUpload) {
        /*界面超时处理*/
        if (Utils.PageisTimeOut(true)) {
            return;
        }
        $.postXml({
            url: DiskTool.resolveUrl("getthumbnailimage", true),
            data: XmlUtility.parseJson2Xml({
                fileids: fileId,
                width: 450,
                height: 350
            }),
            success: function(result) {
                if (result.code == DiskConf.isOk) {
                    sendPostCard(result["var"]);
                } else { DiskTool.FF.alert(result.summary); }
            },
            error: function(error) {
                DiskTool.handleError(error);
            }
        });
        function sendPostCard(result) {
            var message = "获取图片缩略图失败！";
            var imgUrl = "";
            if (!result) {
                DiskTool.FF.alert(message);
                return;
            }
            for (var key in result) {
                imgUrl = result[key];
            }
            if (!imgUrl) {
                DiskTool.FF.alert(message);
                return;
            }
            setTimeout(function() {
                top.Links.show('postcard', "&diskimage=" + encodeURIComponent(imgUrl))
            }, 0);
            if (isNotFromUpload) {
                DiskTool.addDiskBehavior({
                    actionId: 7021,
                    thingId: 0,
                    moduleId: 11,
                    actionType: 20
                });
                //DiskTool.addDiskBehavior(7021, 11, 20, 0, 0); ;
            } else {
                DiskTool.addDiskBehavior({
                    actionId: 7020,
                    thingId: 0,
                    moduleId: 11,
                    actionType: 20
                });
                //DiskTool.addDiskBehavior(7020, 11, 20, 0, 0); ;
                top.FloatingFrame.minimize();
            }
        }
    },
    removeMusicTrigger: function() {
        //刷新播放列表
        if (window.top.MusicPlayer) {
            try {
                window.top.MusicPlayer.removeMusicTrigger();
            } catch (e) { }
        }
    },
    /**
    *工具栏函数包
    */
    Toolbar: {
        /*获取选中的行*/
        getAllSelectedRow: function(returnRow /* 为true返回选中tr行（Jquery对象）；默认返回行所对应的数据对象 */) {
            var checkedRow = $("#tbl-fileList>tr>td>:checked")
                .parent().parent();
            if (returnRow) {
                return checkedRow;
            }
            //返回数据属性
            return checkedRow.map(function() {
                return $(this).data("data");
            });
        },
        /*获取当前文件夹Id*/
        getCurrentDirectoryId: function() {
            if (Utils.queryString("id") != null) {
                return Utils.queryString("id");
            }
            var cache = window["cachePid"];
            if (cache.length == 0) {
                return null;
            }
            return cache[cache.length - 1];
        },
        /*获取域地址*/
        getDiskHost: function(relUrl) {
            var url = "http://" + window.location.host + "/";
            if (relUrl) {
                return url + relUrl;
            }
            return url;
        },
        /*checkbox 文件快递部分处理*/
        controlSendPanel: function(config) {
            var de = $.disableElement;
            var ee = $.enableElement;
            config = $.extend({
                data: null,
                nameField: "ITEMNAME",
                sizeField: "ITEMSIZE",
                panel: $("#aSendFile"),
                email: $("#aEmail"),
                wap: $("#aWap"),
                mms: $("#aMMS"),
                preValid: null
            }, config);
            if (config.preValid != null && !config.preValid()) {
                de(config.panel);
                return;
            }
            var data = config.data;
            if (data == null || data.length == 0) {
                de(config.panel);
                return;
            }
            var displayPanel = false;
            var count = data.length;
            if (count >= 1 && count <= 5) {
                ee(config.email);
                ee(config.wap);
                displayPanel = true;
            } else {
                de(config.email);
                de(config.wap);
            }
            if (count == 1) {
                var validMMS = true;
                var name = data[0][config.nameField];
                var size = data[0][config.sizeField];
                if (size / 1024 <= 50 && DiskTool.Toolbar.getExtTypeBySend(DiskTool.getFileExtName(name)) != "") {
                    ee(config.mms);
                    displayPanel = true;
                } else {
                    de(config.mms);
                }
            } else {
                de(config.mms);
            }
            if (displayPanel) {
                ee(config.panel);
            } else {
                de(config.panel);
            }
        },
        getExtTypeBySend: function(ext) {
            var category = {
                "pic": "gif,jpg,jpeg",
                "audio": "mid,midi,wav",
                "office": "txt"
            };
            var type = "";
            ext = ext.toLowerCase();
            $.each(category, function(name, val) {
                if (val.indexOf(ext) > -1) {
                    type = name;
                    return false;
                }
            });
            return type;
        }
    }
}
/**
*Jquery扩展
*/
jQuery.extend({
    /**
    *Ajax提交Xml
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
        var errors = config["error"] || DiskTool.handleError;
        var async = typeof config["async"] == "undefined" ? true : config["async"];
        var timeout = config["timeout"] || 60000;
        var ajaxParam = {
            type: "POST",
            contentType: "text/xml",
            async: async,
            timeout: timeout,
            url: config["url"],
            dataType: "text",
            data: config["data"],
            complete: config["complete"],
            success: function(result) {
                if (async == true)
                    processData(result);
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
            try {
                result = eval("(" + result + ")");
            } catch (ex) {
                result = {
                    code: "S_Error",
                    summary: "请求服务器出错"
                };
            }
            if (result && result.code == 999) {
                DiskTool.invalidAction();
                return;
            }
            config["success"].apply(result, arguments);
        }
    },
    //根据Id获取元素    
    getById: function(id    //id
        , returnDom         //true返回dom；false返回jQuery对象
        , doc) {             //指定document
        if (id == null || jQuery.trim(id) == "") {
            return null;
        }
        doc = doc || document;
        if (returnDom) {
            return doc.getElementById(id);
        }
        return jQuery("#" + id, doc);
    },
    isArray: function(obj) {
        return obj != null && obj.constructor == Array;
    },
    disableElement: function(ele) {
        //v1.2.6变更 现在彩云不要这个效果
        return;
        var element = $(ele);
        if ($.browser.msie) {
            element.attr("disabled", "disabled");
        } else {
            if (element.data("storeEvents") == null) {
                var disabledClick = function(e) {
                    e.preventDefault();
                    return false;
                };
                var ev = element.data("events");
                element.data("storeEvents", ev || {});
                var newEv = {
                    click: {
                        "1": disabledClick
                    }
                };
                element.data("events", newEv);
            }
        }
        if (element.attr("tagName") == "A") {
            element.parent().addClass("pager-disabled");
            element.parent().addClass("tool-disabled");
        }
        return element;
    },
    enableElement: function(ele) {
        var element = $(ele);
        if ($.browser.msie) {
            $(ele).removeAttr("disabled");
        }
        else {
            if (element.data("storeEvents") != null) {
                element.data("events", element.data("storeEvents"));
                element.removeData("storeEvents");
            }
        }
        if (element.attr("tagName") == "A") {
            element.parent().removeClass("pager-disabled");
            element.parent().removeClass("tool-disabled");
        }
        return element;
    },
    //全角空格也清除
    trim2: function(text) {
        return (text || "").replace(/(^\s+)|(^　+)|(\s+$)|(　+$)/g, "");
    }
});
/* XmlUtility Start */
/**
*json转换成xml的方法
*/
function XmlUtility() {
    this.__strs = [];
}
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
/* 静态方法 */
//从Json数据转换Xml，将数据类型作为标签
XmlUtility.parseJson2Xml = function(json, excludeHeader, name) {
    var xml = new XmlUtility();
    if (!excludeHeader) {
        xml.append("<?xml version=\"1.0\" encoding=\"utf-8\" ?>");
    }
    xml.append(name ? "<object name=\"{0}\">".format(name) : "<object>");
    
    jQuery.each(json, function(name, val) {
        if (!val && val != 0) {
            return;
        }
        /*if (jQuery.isArray(val)) {
            xml.append("<list name=\"{0}\">".format(name));
            jQuery.each(val, function() {
                xml.append(XmlUtility.parseJson2Xml(this, true));
            })
            xml.append("</list>");
        }
        else */
        if (val.constructor == String) {
            xml.append("<string name=\"{0}\">{1}</string>".format(name, XmlUtility.escape(val)));
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
        else if ((typeof val == 'object') && (val != null && val.constructor == Array)) {
            xml.append("<array name=\"{0}\">".format(name));
            jQuery.each(val, function() {
                xml.append(XmlUtility.parseJson2Xml(this, true));
            })
            xml.append("</array>");
        }
        else {
            //其余一切用字符串
            xml.append("<string name=\"{0}\">{1}</string>".format(name, val.toString()));
        }
    });
    xml.append("</object>");
    return xml.join();
}
/* 静态方法 */
//从Json数据转换Xml，将数据名称作为标签
XmlUtility.parseFromJson = function(json, excludeHeader, tagName) {
    var xml = new XmlUtility();
    if (!excludeHeader) {
        xml.append("<?xml version=\"1.0\" encoding=\"utf-8\" ?>");
    }
    if (tagName) {
        xml.append("<" + tagName + " type=\"object\">");
    }
    else {
        xml.append("<object>");
    }
    jQuery.each(json, function(name, val) {
        if (val !== null) {
            if (jQuery.isArray(val)) {
                xml.append("<" + name + " type=\"list\">");
                jQuery.each(val, function() {
                    xml.append(XmlUtility.parseFromJson(this, true));
                });
                xml.append("</" + name + ">");
            }
            else if (val.constructor == String) {
                //else if((typeof val == 'string') && val.constructor == String){
                xml.append("<" + name + " type=\"string\">" + XmlUtility.escape(val) + "</" + name + ">");
            }
            else if ((typeof val == 'number') && val.constructor == Number) {
                xml.append("<" + name + " type=\"number\">" + val + "</" + name + ">");
            }
            else if ((typeof val == 'object') && val.constructor == Date) {
                xml.append("<" + name + " type=\"date\">" + val + "</" + name + ">");
            }
            else if ((typeof val == 'boolean') && val.constructor == Boolean) {
                xml.append("<" + name + " type=\"bool\">" + val + "</" + name + ">");
            }
            else if ((typeof val == 'object') && val.constructor == Object) {
                xml.append(XmlUtility.parseFromJson(val, true, name));
            }
            else {
                //其余一切用字符串
                xml.append("<" + name + " type=\"string\">" + val.toString() + "</" + name + ">");
            }
        }
    });
    if (tagName) {
        xml.append("</" + tagName + ">");
    }
    else {
        xml.append("</object>");
    }
    return xml.join();
};
XmlUtility.escape = function(val) {
    if (val) {
        val = val.toString();
        val = DiskTool.replace(val, "&", "&amp;");
        val = DiskTool.replace(val, "<", "&lt;");
        val = DiskTool.replace(val, ">", "&gt;");
        val = DiskTool.replace(val, "\"", "&quot;");
        val = DiskTool.replace(val, "'", "&apos;");
    }
    return val;
};
/* XmlUtility End */
//****首页右侧滚动************
function ListenScroll(a, b) {
    //设定iframe高度等于当前文档高度
    time++;
    var h = $(a).height() + "px";
    if (window.parent.$("#mainFrame")[0]) {
        window.parent.$("#mainFrame")[0].style.height = h;
    }
}
var time = 0;
function AddListenScroll() {
    setInterval('ListenScroll("#container",".aside-bd")', 1000);
}
function AutoHeight(a) {
    var h1 = $("body").height();
    if (!$.browser.msie) {
        h1 = parseInt(h1) + 7;
    }
    if (top.FloatingFrame) {
        if (a) {
            top.FloatingFrame.setHeight(a, true);
        } else {
            top.FloatingFrame.setHeight(h1, true);
        }
    }
}
//判断页面操作类型 0：我的共享 1：好友共享 2：我的文件柜
function PageMode() {
    if (location.href.indexOf("disk_my-share.html") != -1) {
        return 0;
    }
    else if (location.href.indexOf("disk_friend-share.html") != -1) {
        return 1;
    }
    else
        return 2;
}
function ShareOperMode() {
    try {
        var url = DiskTool.getDiskWindow().location.href.toLowerCase();
        if (url.indexOf("disk_default.html") != -1)
            return "default";
        else if (url.indexOf("disk_photolist.html") != -1 || url.indexOf("disk_photoshow.html") != -1)
            return "photo";
        else if (url.indexOf("disk_album.html") != -1)
            return "album";
        else if (url.indexOf("disk_music.html") != -1)
            return "music";
        else
            return "default";
    } catch (e) {
        return "default";
    }
}
//*****图片按比例缩放*******
function DrawImage(ImgD, FitWidth, FitHeight) {
    var image = new Image();
    image.src = ImgD.src;
    if (image.width > 0 && image.height > 0) {
        if (image.width / image.height >= FitWidth / FitHeight) {
            if (image.width > FitWidth) {
                ImgD.width = FitWidth;
                ImgD.height = (image.height * FitWidth) / image.width;
            } else {
                ImgD.width = image.width;
                ImgD.height = image.height;
            }
        } else {
            if (image.height > FitHeight) {
                ImgD.height = FitHeight;
                ImgD.width = (image.width * FitHeight) / image.height;
            } else {
                ImgD.width = image.width;
                ImgD.height = image.height;
            }
        }
    }
}
$(function() {
    if (document.all) {
        document.body.attachEvent("onkeydown", function() {
            if (window.event.keyCode == 13) {
                return false;
            }
        });
    }
});
