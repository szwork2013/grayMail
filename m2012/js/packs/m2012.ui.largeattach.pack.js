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
﻿/**
 * @fileOverview 定义文件快递（超大附件）模型
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.Model.ModelBase;
    var namespace = "M2012.UI.LargeAttach.Model";

    M139.namespace(namespace, superClass.extend(
    /**@lends M2012.UI.LargeAttach.Model.prototype*/
    {
        /** 定义文件快递（超大附件）模型
         *@constructs M2012.UI.LargeAttach.Model
         *@extends M139.Model.ModelBase
         *@param {Object} options 初始化参数集
         *@example
         
         */
        initialize: function (options) {
			this.resetMaxUploadSize();
        },
        defaults:{
            uploading: false,
            failCount: 0,
            successCount: 0,
            fileCount:0,
            autoSend:false,
            status:null
        },
        getSid: function () {
            return top.$App.getSid();
        },
        MaxUploadSize: 1024 * 1024 * 1024,
        getUserNumber: function () {
            return top.$User.getUid();
        },
		resetMaxUploadSize: function(){
            //根据套餐显示超大附件最大上传文件大小
            if (top.SiteConfig.comboUpgrade) {
                this.MaxUploadSize = (top.$User.getCapacity("maxannexsize") || 4 * 1024) * 1024 * 1024;
            }
        },
        //todo flash调用请求上传地址URL，flash里使用的，要用完整路径
        serverPath:"http://" +  location.host +"/mw2/disk/disk",
        getFlashUploadUrl:function(name) {
            var url = M139.Text.Url.makeUrl(this.serverPath, {
                "func": "disk:fUploadCheck",
                "sid": this.getSid(),
                "rnd": Math.random()
            });
            return M139.HttpRouter.getNoProxyUrl(url);
        },
        //flash调用,上传到分布式存储url
        getPreUploadUrl: function (name) {
            var url = M139.Text.Url.makeUrl(this.serverPath, {
                "func": "disk:preUpload",
                "sid": this.getSid(),
                "rnd": Math.random()
            });
            return M139.HttpRouter.getNoProxyUrl(url);
        },
        /**
         *加载大附件上传相关程序
         */
        requireUpload: function (options,callback) {
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
                        var view = top.largeAttachDialog = window.largeAttachDialog = new top.M2012.UI.Dialog.LargeAttach();
                        view.render();
                        view.dialog.on("remove", function () {
                            top.largeAttachDialog = window.largeAttachDialog = null;
                        });
                        callback(view);
                    }
                }
            }
        }
    }));
})(jQuery, _, M139);
﻿/**
 * @fileOverview 定义文件快递（超大附件）flash上传界面
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.LargeAttach.FlashView";

    M139.namespace(namespace, superClass.extend(
    /**@lends M2012.UI.LargeAttach.FlashView.prototype*/
    {
        /** 定义文件快递（超大附件）flash上传界面
         *@constructs M2012.UI.LargeAttach.FlashView
         *@extends M139.View.ViewBase
         *@param {Object} options 初始化参数集
         *@param {HTMLElement} options.container flash空间容器元素
         *@example
         
         */
        initialize: function (options) {
            this.model = options.model;
            this.setElement(options.container);
            return superClass.prototype.initialize.apply(this,arguments);
        },

        flashID: "flashUpload",
        flashHeight: 300,
        flashWidth:490,
        flashPath:"/m2012/flash/fast_upload.swf?rnd=" + Math.random(),//解决第三方ie浏览器的bug
        UploadStyle: 1,//类型 1:文件快递 2.彩云上传
        prjtype:1,//？？？

        render: function () {
            this.renderFlash();
            return superClass.prototype.render.apply(this,arguments);
        },

        isSupportControlUpload:function(){
            return false;
        },

        isSupportFlashUpload:function(){
            return M139.Plugin.Flash.getVersion() > 9;
        },

        renderFlash: function () {
            this.initFlashCallJS();
            if (M139.Plugin.Flash.getVersion() >= 9) {
                var swf = new M139.Plugin.Flash.SWFObject(this.flashPath, this.flashID, this.flashWidth, this.flashHeight);
                swf.addParam("quality", "high");
                swf.addParam("swLiveConnect", "true");
                swf.addParam("menu", "false");
                swf.addParam("allowScriptAccess", "always");
                swf.addParam("wmode", "transparent");
                swf.write(this.el);
                this.flashControl = document.getElementById(this.flashID);
            } else {
                this.$el.html(M139.Plugin.Flash.getFlashSetupTip());
            }
        },
        //初始化flash内部会调用js的函数，这里必须创建一个全局变量upcom
        initFlashCallJS: function () {
            var This = this;
            window.upcom = {};
            upcom.getParameter = function () {
                var args = {};
                switch (This.UploadStyle) {
                    case 0:
                        break;
                    case 1: /*flash上传所需要的参数*/
                        //设置
                        args.threads = 2;      //线程数
                        args.sid = This.model.getSid();         //sid
                        args.phoneNumber = This.model.getUserNumber(); //userNumber
                        args.getUploadUrl = This.model.getFlashUploadUrl(); //请求上传地址URL
                        args.uploadCallbackUrl = This.model.getPreUploadUrl(); //上传到分布式存储url
                        args.type = This.UploadStyle;         //类型 1:文件快递 2.彩云上传
                        args.singleFileSizeLimit = This.model.MaxUploadSize; //单文件上传大小限制单位字节
                        args.tipTxtBlock = ""; //提示文字块，默认值为"",文件快递要有值
                        if (This.prjtype == 1) {
                            args.tipTxtBlock = "* 推荐安装139邮箱小工具：支持超大文件极速上传、断点续传！<a href='"
                            + This.getControlDownUrl() + "' target='_blank'>立即安装</a>\n\n* 请遵守国家相关法律，严禁上传包括反动、暴力、色情、违法及侵权内容的文件；\n\n* 一次可上传多个文件，每个文件最大为"
                                + M139.Text.Utils.getFileSizeText(This.model.MaxUploadSize)
                                + "；\n\n* 可以发送到任何邮箱以及移动手机；\n\n* 上传的文件，自动保存到文件暂存柜；\n\n* 文件可存放15天，您可以通过续期的功能让文件保存更长的时间；\n\n* 如果您删除了文件或文件已过期，则收件人无法下载；";
                        }
                        args.isShowMinImg = true; //是否显示小图(缩略图)
                        args.showMinImgSizeLimit = 5 * 1024 * 1024; //显示小图(缩略图)大小限制

                        args.fileNameLength = 80; //文件名长度限制

                        //陈日红套餐升级接口没提供附件上传个数的参数，暂时前端配置，写信页和文件快递页面均使用，待接口支持，删掉此内容
                        var vipVersion = getVipVersion();
                        var maxSelectFileNum = {
                            "freeVersion": 10,
                            "5Version": 20,
                            "20Version": 50
                        };
                        args.maxSelectFile = maxSelectFileNum[vipVersion];//最大选择文件个数


                        //标题提示语
                        args.tipTxt = "提示";
                        args.moreTxt = "信息";
                        args.singleFileTxt = "(单文件最大|0|)";

                        //选择文件错误提示语
                        args.getDirTypeError = "获取上传文件目录与限制上传文件类型数据失败！";
                        args.maxSelectFileError = "对不起，一次最多只能上传|0|个文件，请重新选择！";
                        args.sizeMinError = "您添加的文件\"|0|\"大小为0, 不能上传！";
                        args.sizeMaxError = "您添加的文件\"|0|\"大于|1|, 不能上传！";
                        args.nameLongError = "您添加的文件\"|0|\"文件名过长, 不能上传！";
                        args.typeError = "您添加的文件\"|0|\"类型不对, 不能上传！";

                        //todo
                        try {
                            var serviceitem = top.$User.getServiceItem();
                            if (serviceitem != "0016" && serviceitem != "0017") {
                                args.sizeMaxError = "您添加的文件\"|0|\"大于|1|, 不能上传！<a onclick=\"top.$App.showOrderinfo()\" href=\"javascript:void(0)\" style=\"color: Blue;text-decoration:underline\">升级邮箱</a>可上传更大彩云文件。";
                            }
                        } catch (e) { }
                        /*
                        if (!window.FF) {
                            //flash会调用？
                            window.FF = window.FloatingFrame = {
                                alert: function (msg) {
                                    $Msg.alert(msg, {
                                        icon:"warn"
                                    });
                                }
                            };
                        }*/

                        //上传错误提示语
                        args.userCancelError = "上传失败，用户取消上传！";
                        args.getUploadUrlError = "请求上传地址URL为空错误！";

                        args.getUploadUrlLoaderSecurityError = "请求上传地址失败，crossdomain错误！";
                        args.getUploadUrlLoaderIoError = "请求上传地址失败，IO错误！";
                        args.getUploadUrlLoaderLoadError = "请求上传地址失败，LOAD错误！";
                        args.getUploadUrlLoaderReturnError = "请求上传地址错误，返回值错误！|0|";

                        args.uploadUrlSecurityError = "上传分布式失败，crossdomain错误！";
                        args.uploadUrlIoError = "上传分布式失败，IO错误！";
                        args.uploadUrlUpLoadError = "上传分布式失败，UPLOAD错误！";
                        args.uploadUrlReturnError = "上传分布式错误，返回值错误！|0|";

                        args.updateDatabaseUrlLoaderSecurityError = "更新数据库失败，crossdomain错误！";
                        args.updateDatabaseUrlLoaderIoError = "更新数据库失败，IO错误！";
                        args.updateDatabaseUrlLoaderLoadError = "更新数据库失败，LOAD错误！";
                        args.updateDatabaseUrlLoaderReturnError = "更新数据库错误，返回值错误！|0|";
                        break;
                    case 2:

                        break;
                }
                return args;
            };
            //flash上传成功后调用js
            upcom.Uploaded = function (isSuccess) {
                This.onUploaded(isSuccess);
            };
            /**
             *flash回调的上传状态
            */
            upcom.setUploadState = function (info) {
                This.onUploadProgress(info);
            }

        },

        /*
         * 获取控件地址
         */
        getControlDownUrl: function(){
            return top.ucDomain + "/LargeAttachments/html/control139.htm";//todo任然用的是增值站点资源，后期要迁移
        },

        /**
         *上传进度发生变化
         *@inner
         */
        onUploadProgress: function (status) {
            this.lastUploadTip = status;

            this.model.set("uploading", status.isUploading);
            this.model.set("fileCount", status.fileTotal);
            this.model.set("successCount", this.getUploadedFileList().length);

            this.model.set("status", status);

            this.trigger("uploadprogress", {
                status: status
            });
        },

        /**
         *上传完成(一个文件?),有时候不触发,flash控件有bug
         *@inner
         */
        onUploaded: function (isSuccess) {
            this.model.set("successCount", this.getUploadedFileList().length);
            this.trigger("uploaded", {
                success: isSuccess
            });
        },

        /**
        *取得flash上传成功的文件列表
        */
        getUploadedFileList: function () {
            if (!this.flashControl || !this.flashControl.getUploadSuccessList) {
                return [];
            } else {
                return this.flashControl.getUploadSuccessList();
            }
        },

        isUploading:function(){
            if (this.lastUploadTip && this.lastUploadTip.isUploading) {
                return true;
            } else {
                return false;
            }
        },

        //{"isUploading":false,"fileTotal":1,"progressTotal":1,"speedTotal":0}
        isUploadComplete: function () {
            if (this.isUploading()) {
                return false;
            } else {
                return true;
            }
        }

    }));
    /*
    uploadprogress:{"messages":{"isUploading":true,"fileTotal":1,"progressTotal":0,"speedTotal":0}} m2012.ui.largeattach.flashupload.pack.js:462
uploadprogress:{"messages":{"isUploading":true,"fileTotal":1,"progressTotal":0,"speedTotal":0}} m2012.ui.largeattach.flashupload.pack.js:462
uploadprogress:{"messages":{"isUploading":true,"fileTotal":1,"progressTotal":0.26,"speedTotal":19779647.67}} m2012.ui.largeattach.flashupload.pack.js:462
uploaded:{"success":true} m2012.ui.largeattach.flashupload.pack.js:464
uploadprogress:{"messages":{"isUploading":false,"fileTotal":1,"progressTotal":1,"speedTotal":0}}
    */
})(jQuery, _, M139);

function getVipVersion() {
    var vipVersion = "20Version";
    var vipItem = top.UserData.serviceItem;
    if (vipItem == "0010" || vipItem == "0015") {
        vipVersion = "freeVersion";
    } else if (vipItem == "0016") {
        vipVersion = "5Version";
    } else if (vipItem == "0017") {
        vipVersion = "20Version";
    }
    return vipVersion;
}
﻿/**
 * @fileOverview 定义大附件上传，flash上传对话框
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.Dialog.LargeAttach";

    M139.namespace(namespace, superClass.extend(
    /**@lends M2012.UI.Dialog.LargeAttach.prototype*/
    {
        /** 定义大附件上传，flash上传对话框
         *@constructs M2012.UI.Dialog.LargeAttach
         *@extends M139.View.ViewBase
         *@param {Object} options 初始化参数集
         *@param {String} options.type 对话框模式（send/upload/continueUpload),默认为send
         *@example
         */
        initialize: function (options) {
            this.options = (options || {});
            if (!this.options.type) {
                this.options.type = "send";
            }
            this.model = new M2012.UI.LargeAttach.Model();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: namespace,
        /**构建dom函数*/
        render: function () {
            var This = this;
            var options = this.options;

            this.dialog = $Msg.showHTML('<div id="divUploadView"></div>', function (e) {
                This.onSendClick(e);
            }, function (e) {
                This.onCancelClick(e);
            }, {
                width: 500,
                height: 335,
                dialogTitle: this.options.dialogTitle || "超大附件",
                buttons:["确 定","取 消"],
                showMiniSize:true
            });

            this.dialog.setButtonDisable(0, true); //按钮置灰

            this.renderBottomTip();

            this.setElement(this.dialog.el);
            this.renderUploadView();
            this.initEvents();

            return superClass.prototype.render.apply(this, arguments);
        },

        /**
         *添加续传任务
         */
        addContinueUpload:function(fileInfo){
            this.uploadView.addContinueUpload(fileInfo);
        },

        /**
         *加载上传组件
         *@inner
         */
        renderUploadView: function () {
            var uploadDiv = this.$("#divUploadView")[0];
            if(M139.Browser.is.ie && M139.Plugin.FastUpload.checkControlSetup() > 0){
                this.uploadView = new M2012.UI.LargeAttach.FastUploadView({
                    container: uploadDiv,
                    model: this.model
                }).render();
            } else {
                this.uploadView = new M2012.UI.LargeAttach.FlashView({
                    container: uploadDiv,
                    model: this.model
                }).render();
            }
        },

        /**
         *绑定事件
         *@inner
         */
        initEvents: function (e) {
            var This = this;
            this.uploadView.on("uploadprogress", function (e) {
                console.log("uploadprogress:" + JSON.stringify(e));
                This.onProgress(e);
            }).on("uploaded", function (e) {
                console.log("uploaded:" + e.success);
                This.onUploaded(e);
                This.updateBottomTip();
            });

            This.model.on("change:status", function (model, status) {
                This.updateBottomTip();
            }).on("change:autoSend", function (model, autoSend) {
                This.$("#chkLargeAttachAutoSend")[0].checked = autoSend;
            }).on("change:uploading", function (model, uploading) {

            });;

            this.dialog.on("minisize", function (e) {
                This.onMiniSize();
            }).on("close", function (e) {
                if (e.event) {
                    This.onCancelClick(e);
                }
            }).on("remove", function () {
                //要销毁控件
                This.uploadView.remove();
            });


            this.$("#chkLargeAttachAutoSend").click(function () {
                This.model.set("autoSend", this.checked);
            });
        },

        /**
         *最小化
         *@inner
         */
        onMiniSize: function () {
            this.showUploadingTip();
            this.showMinisizeAnimation();
            this.model.set("minisize",true);
        },

        /**
         *上传进度变化
         *@inner
         */
        onProgress:function(e){
            var status = e.status;
            if (status.isUploading === false && status.fileTotal > 0) {
                this.onComplete();
            }else if(this.model.get("fileCount") == this.model.get("successCount")){
                this.onComplete();
            }
            //todo
        },

        /**
         *上传完成？
         *@inner
         */
        onComplete: function () {
            //传完以后，如果当前已经最小化（或者勾选了完成自动发送），则自动完成对话框选择
            if (this.model.get("autoSend") || this.model.get("minisize")) {
                this.doSelect();
            } else {
                this.updateBottomTip();
            }
        },

        //那颗发送按钮的几种状态
        ButtonText:{
            AutoSend: "传完后，自动发送",
            Complete: "完成",
            CancelAutoSend: "取消自动发送"
        },

        
        /**
         *左下角内容
         */
        renderBottomTip: function () {
            var html = ['<label for="chkLargeAttachAutoSend">',
            '<input disabled id="chkLargeAttachAutoSend" type="checkbox"> 传完后，自动发送',
            '</label><span class="ErrorTip"></span>'];
            this.dialog.setBottomTip(html.join(""));
            //如果只是上传，不显示传完自动发送
            if (this.options.type != "send") {
                this.dialog.$el.find("#chkLargeAttachAutoSend").parent().hide();
            }
        },

        /**
         *左下角复选框状态
         */
        updateBottomTip: function () {
            var errorTip = "";
            var fileCount = this.model.get("fileCount");
            var failCount = this.model.get("failCount");
            try {
                //可能对话框已移除，会报错
                $("#chkLargeAttachAutoSend")[0].disabled = fileCount == 0;
                this.dialog.setButtonDisable(0, fileCount == 0);
                if (failCount > 0) {
                    errorTip += '&nbsp;&nbsp;&nbsp;&nbsp;<strong class="c_ff6600">' + failCount + ' </strong>个文件上传失败</span>';
                }
                this.$(".ErrorTip").html(errorTip);
            } catch (e) { }
        },

        /**
         *完成文件选择操作
         *@inner
         */
        doSelect: function () {
            var This = this;
            var uploadControl = this.uploadView;
            var fileCount = this.model.get("fileCount");
            var successfiles = uploadControl.getUploadedFileList();
            var autoSend = this.model.get("autoSend");
            var unSuccessCount = fileCount - successfiles.length;
            if (autoSend) {
                if (unSuccessCount > 0) {
                    var msg = "文件未全部上传成功，确定要发送吗？"
                    $Msg.confirm(msg, function () {
                        ok();
                    }, {
                        icon: "warn"
                    });
                } else {
                    ok();
                }
            } else {
                if (this.options.type == "send") {
                    if (unSuccessCount > 0) {
                        var msg = "文件未全部上传成功，确定添加吗？"
                        $Msg.confirm(msg, function () {
                            ok();
                        }, {
                            icon: "warn"
                        });
                    } else {
                        ok();
                    }
                } else {
                    ok();
                }
            }
            function ok() {
                This.trigger("select", {
                    files: successfiles,
                    autoSend: autoSend
                });
                This.dialog.close();
                if (This.uploadingTip) {
                    This.uploadingTip.remove();
                }
            }
        },

        /**
         *设置按钮文本
         *@inner
         */
        setButtonText: function (text) {
            this.dialog.setButtonText(0,text);
        },

        /**
         *完成一个文件上传
         *@inner
         */
        onUploaded: function (e) {
            var model = this.model;
            if (e.success) {
                model.set("successCount", model.get("successCount") + 1);
                if (model.get("fileCount") == 0) {
                    //文件上传太快，没有触发进度变化就触发了文件完成
                    model.set("fileCount", model.get("successCount"));
                }
            } else {
                model.set("failCount", model.get("failCount") + 1);
                if (model.get("fileCount") == 0) {
                    //文件上传太快，没有触发进度变化就触发了文件完成
                    model.set("fileCount", model.get("failCount"));
                }
                model.set("autoSend", false);
            }
            
            if (model.get("fileCount") == model.get("successCount") + model.get("failCount")) {
                model.set("uploading", false);
                this.onComplete();
            }
        },

        /**
         *显示最小化的动画
         *@inner
         */
        showMinisizeAnimation: function () {
            var This = this;
            var offset = this.$el.offset();
            var obj = {
                top: offset.top,
                left: offset.left,
                height: this.$el.height(),
                width: this.$el.width()
            };
            var div = $('<div style="border:3px silver solid;position:absolute;z-index:9999"></div>').css(obj);
            var offset = This.uploadingTip.$el.offset();
            div.appendTo(document.body).animate({
                left: offset.left,
                top: offset.top,
                height: 20,
                width: 220
            }, 500, function () {
                div.remove()
            });
        },


        cancelMiniSize:function(){
            this.dialog.cancelMiniSize();
            this.uploadingTip.hide();
            this.onCancelMiniSize();
        },


        onCancelMiniSize:function(){
            this.model.set("minisize",false);
        },

        /**
         *显示上传中置顶提示
         *@inner
         */
        showUploadingTip: function () {
            var This = this;
            if (!this.uploadingTip) {
                this.uploadingTip = new UploadingTipView({
                    model: this.model,
                    type: this.options.type
                }).render();
                this.uploadingTip.on("click", function () {
                    This.cancelMiniSize();
                });
            }
            this.uploadingTip.show();
        },
        /**
         *点击确定按钮
         *@inner
         */
        onSendClick: function (e) {
            var files;
            var autoSend = this.model.get("autoSend");
            if (this.model.get("uploading")) {//上传中
                this.dialog.minisize();
            } else {
                //完成上传了
                this.doSelect();
            }
            e.cancel = true;//取消对话框关闭
        },
        /**
         *点击取消按钮
         *@inner
         */
        onCancelClick: function (e) {
            var This = this;
            var fileCount = this.model.get("fileCount");
            var successCount = this.model.get("successCount");
            if (this.model.get("uploading")) {
                e.cancel = true;
                $Msg.confirm("附件正在上传中，关闭后将终止，是否关闭窗口？", function () {
                    This.dialog.close();
                }, {
                    icon:"warn"
                });
            } else if (fileCount > 0) {
                if (successCount > 0) {
                    e.cancel = true;
                    //上传的文件已保存在暂存柜中，是否取消添加到写信？
                    $Msg.confirm("已上传完的文件将添加到暂存柜", function () {
                        This.dialog.close();
                    }, {
                        icon: "warn"
                    });
                }
            }
        },

        isUploading: function () {
            return !!this.model.get("uploading");
        }
    }));

    //最小化上传窗口后现实的置顶提示 todo public
    var UploadingTipView = superClass.extend({
        initialize: function (options) {
            this.model = options.model;

            this.setElement($(this.template));

            return superClass.prototype.initialize.apply(this, arguments);
        },
        events: {
            "click .CancelAutoSendButton": "onCancelAutoSendButtonClick",
            "click .OpenAutoSendButton": "onOpenAutoSendButtonClick",
            "click":"onClick"
        },
        render: function () {
            this.$el.appendTo(document.body);

            this.initEvent();

            this.updateHTML();

            return superClass.prototype.render.apply(this, arguments);
        },
        template:['<span style="position:absolute;z-index:1024;top:10px;left: 480px;" class="msg">',
            '<img style="display:none" class="mr_5" src="/m2012/images/global/loading_xs.gif">',
            '<i style="display:none" class="FailIcon" class="i_file_16 i_m_xlsx mr_5"></i>',
            '<span class="MsgLabel">超大附件</span>',
            '<span style="display:none" class="CancelTip"> | 已开启自动发送 <a class="CancelAutoSendButton" href="javascript:;">取消</a></span>',
            '<span style="display:none" class="OpenTip"> | 自动发送未开启 <a class="OpenAutoSendButton" href="javascript:;">开启</a></span>',
            '</span>'
        ].join(""),
        initEvent: function (options) {
            var This = this;
            this.model.on("change:status", function () {
                This.updateHTML();
            }).on("change:autoSend", function () {
                This.updateHTML();
            }).on("change:failCount", function () {
                This.updateHTML();
            }).on("change:uploading", function () {
                This.updateHTML();
            });
        },

        /**
         *点击tip后自动消失，外部可以捕获隐藏事件
         *@inne
         */
        onClick: function (e) {
            if (e.target.tagName != "A") {//排除点击取消自动发送
                this.trigger("click");
            }
        },

        /**
         *点击取消自动发送
         *@inne
         */
        onCancelAutoSendButtonClick:function(){
            this.model.set("autoSend", false);
        },

        /**
         *点击开启自动发送
         *@inne
         */
        onOpenAutoSendButtonClick:function(){
            this.model.set("autoSend", true);
        },

        /**
         *更新tip内容
         *@inner
         */
        updateHTML: function () {
            var s = this.model.get("status");
            var autoSend = this.model.get("autoSend");
            var failCount = this.model.get("failCount");
            var fileCount = this.model.get("fileCount");
            var uploading = this.model.get("uploading");
            var lblMsg = "大附件上传";
            var errMsg = "";

            if (!uploading) {
                this.$("img").hide();//上传完，隐藏菊花图标
                lblMsg = '超大附件';
            } else {
                this.$("img").show();
                lblMsg = "附件上传中";
            }
            if (failCount > 0) {
                this.$el.addClass("msgRed");//有上传失败，tip显示为红色
                if (s.isUploading) {
                    this.$(".FailIcon").hide();
                } else {
                    this.$(".FailIcon").show();//上传完，并且有文件失败，显示失败图标
                }
                if (failCount == 1 && fileCount == 1) {
                    //todo 截断保留扩展名
                    //M139.Text.Utils.getTextOverFlow(s.failFiles[0].fileName, 10, true)
                    errMsg = "文件上传失败";
                } else {
                    errMsg = failCount + "个上传失败";
                }
                s.isUploading ? (lblMsg += "|" + errMsg) : (lblMsg = errMsg);
            } else {
                this.$el.removeClass("msgRed");
            }
            if (failCount > 0) {
                this.$(".OpenTip,.CancelTip").hide();
            } else {
                if (autoSend) {
                    this.$(".CancelTip").show();
                    this.$(".OpenTip").hide();
                } else if (fileCount == 0) {
                    this.$(".CancelTip").hide();
                    this.$(".OpenTip").hide();
                }else{
                    this.$(".CancelTip").hide();
                    this.$(".OpenTip").show();
                }
            }
            this.$(".MsgLabel").html(lblMsg);
            //不是发送模式，不显示自动发送
            if (this.options.type != "send") {
                this.$(".CancelTip").hide();
                this.$(".OpenTip").hide();
            }
        }
    });

})(jQuery, _, M139);
﻿

(function () {

    M139.core.namespace("M139.Plugin.FastUpload", {
        quickVersion: "v1.0.7.6",
        quickMinVersion: "v1.0.7.5",
        leastVersion:196872,//需要升级的版本 todo 跟上面那个变量作用重复了？
        /**
         *是否已安装快速上传组件
         *@returns {Number} 返回0表示未安装，返回-1表示已安装但是版本太低，返回1表示可以使用
         */
        checkControlSetup: function () {
            var setup = 0;
            var version = this.getVersion();
            //todo config
            if (version) {
                if (version < this.leastVersion) {
                    setup = -1;
                } else {
                    setup = 1;
                }
            }
            this.isControlSetup = function () {
                return setup;
            };
            return setup;
        },

        /**
         *获得控件版本，没安装或者控件不可用时返回0
         */
        getVersion: function () {
            var version = 0;
            try {
                var obj = new ActiveXObject("Cxdndctrl.Upload");
                version = obj.getversion();
            } catch (e) {

            }
            return version;
        },

        /**
         *获取创建控件所需要的html元素
         *@param {Object} options 参数集合
         *@param {String} controlId 指定控件的id
         *@param {String} globalHandler 一个全局的对象名，控件会调用此对象的回调
         */
        getUploadControlHtml: function (options) {
            var htmlCode = 
                '<script language="javascript" type="text/javascript" for="{controlId}" event="onstart(fileId)">\
                    {globalHandler}.onUploadStart(fileId);\
                </script>\
                <script language="javascript" type="text/javascript" for="{controlId}" event="onprogress(fileId, progress, uploadsize, times)">\
                    {globalHandler}.onUploadProgress(fileId, progress, uploadsize, times);\
                </script>\
                <script language="javascript" type="text/javascript" for="{controlId}" event="onstop(fileId, result, fileIdOfServer)">\
                    {globalHandler}.onUploadStop(fileId, result, fileIdOfServer);\
                </script>\
                <script language="javascript" type="text/javascript" for="{controlId}" event="onlog(logText)">\
                    {globalHandler}.onLog(logText);\
                </script>\
                <script language="javascript" type="text/javascript" for="{controlId}" event="onprepare(fileId, fileIdOfServer)">\
                    {globalHandler}.onPrepare(fileId, fileIdOfServer);\
                </script>';
            if (document.all) {
                htmlCode += '<object id="{controlId}" classid="CLSID:0CEFA82D-A26D-491C-BAF7-604441B409FD"></object>';
            } else {
                //用innerHTML方式创建的控件貌似无法创建成功，需要用document.write
                htmlCode += '<embed id="{controlId}" type="application/x-richinfo-cxdnd3"></embed>';
            }
            htmlCode = M139.Text.Utils.format(htmlCode, {
                controlId: options.controlId,
                globalHandler: options.globalHandler
            });
            return htmlCode;
        },
        /**
         *传给控件的上传指令, 大部分参数从服务端获取
         */
        UploadCommand: "<parameters><id>{id}</id><comefrom>10</comefrom><key>{key}</key><serveraddress>{server}</serveraddress>\
        <commandport>{commandPort}</commandport><dataport>{dataPort}</dataport><filename>{filePath}</filename><filesize>{fileSize}</filesize><ssoid>{sid}</ssoid>\
        <userlevel>0</userlevel><usernumber>{userNumber}</usernumber><flowtype>0</flowtype><taskno>{taskNumber}</taskno>\
        <resumetransmit>{resumetransmit}</resumetransmit><commandcgi>{commandCGI}</commandcgi><datacgi>{dataCGI}</datacgi><browsertype>{browserType}</browsertype>\
        <fileid>{fileId}</fileid><ver>{version}</ver></parameters>",

        /**
         *初始化ActiveX上传控件
         */
        createControl: function (options) {
            var div = document.createElement("div");
            div.style.display = "none";
            div.innerHTML = this.getUploadControlHtml(options);
            (options.container || document.body).appendChild(div);
            
            var c = document.getElementById(options.controlId);
            try{
                c.setuserid($User.getUid());
            } catch (e) {
                throw "M139.Plugin.FastUpload.createControl:setuserid";
            }

            return c;
        },

        /**
         *利用快速上传组件上传文件
         */
        uploadFile: function (control, options) {
            //console.log("uploadFile:" + JSON.stringify(options));
            //设置服务器时间
            if (options.date) {
                try{
                    var serverTime = M139.Date.parse(options.date).getTime() / 1000;
                } catch (e) {
                    throw "M139.Plugin.FastUpload.uploadFile Error At:options.serverTime";
                }
                control.setservertime(serverTime);
            }
            //todo
            var result = null;
            var controlVersion = control.getversion();
            //低版本不支持http代理服务器
            if (controlVersion < 196864) {
                try{
                    result = control.upload(
                        options.fileId,
                        10,
                        options.key,
                        options.domain,
                        parseInt(options.dataPort),
                        parseInt(options.uploadPort),
                        0,
                        "",
                        0,
                        "",
                        "",
                        options.filePath,
                        options.fileSize,
                        options.sid,
                        0, //userlevel
                        options.userNumber, //usernumber
                        0, //flowtype
                        options.taskno, //taskno
                        true);
                } catch (e) {
                    throw "M139.Plugin.FastUpload.uploadFile Error At:control.upload";
                }
            } else {
                var browserType = 200;
                if (M139.Browser.is.ie) {
                    browserType = 0;
                } else if (M139.Browser.is.firefox) {
                    browserType = M139.Browser.getVersion() <= 3.6 ? 150 : 151;
                }
                var myparams = "";
                if (options.status && options.status == "118" && options.storageId && options.storageId.length == 32) {
                    //该文件已上传完成 todo
                    //sharingUpload.action.onUploadStop(file.fileId, 0, file.storageId);
                    control.removetaskbyid(file.fileId);
                    return;
                }

                var commandParam = {
                    id: options.fileId,
                    key: options.key,
                    server: options.domain,
                    commandPort: options.dataPort,//这2个端口命名反了
                    dataPort: options.uploadPort,
                    filePath: M139.Text.Xml.encode(options.filePath),
                    fileSize: options.fileSize,
                    sid: $App.getSid(),
                    userNumber: $User.getUid(),
                    taskNumber: options.taskno,
                    commandCGI: options.commandCgi,
                    dataCGI: options.dataCgi,
                    browserType: browserType,
                    fileId: options.storageId || "",
                    version: controlVersion >= 196867 ? 2 : 1
                };

                if (options.status && options.status == "114") {
                    //重新上传
                    commandParam.resumetransmit = 0;
                    console.log("重新上传");
                } else if (typeof options.status != "undefined" && options.status == "0" && options.storageId && options.storageId.length == 32) {
                    //继传
                    commandParam.resumetransmit = 1;
                    console.log("续传");
                } else {
                    //新上传
                    commandParam.resumetransmit = 0;
                    console.log("新上传");
                }
                commandParam = M139.Text.Utils.format(this.UploadCommand, commandParam);
                try {
                    console.log(commandParam);
                    result = control.uploadex(commandParam);//成功返回0?
                } catch (e) {
                    throw "M139.Plugin.FastUpload.uploadFile Error At:control.uploadex";
                }
            }
            return result;
        },


        /**
         *停止上传
         */
        stopUpload: function (control, fileId, options) {
            try{
                control.stop(fileId);
                if (options && options.isDelete && options.storageId) {
                    console.log("call c++ removetaskbyfileid");
                    control.removetaskbyfileid(options.storageId);
                }
            } catch (e) {
                throw "M139.Plugin.FastUpload.stopUpload:control.stop";
            }
        },


        /**
         *通过组件打开windows文件选择框
         *@param {Object} control 控件实例
         *@param {Object} options 参数集合
         *@param {String} options.filter 选择文件扩展名显示，比如*.mp3
         *@param {String} options.dialogTitle 最多选择几个文件
         *@param {Number} options.maxLength 最多选择几个文件
         *@returns {Array} 返回选择的文件列表
         */
        openWindowFileDialog: function (control,options) {
            var filter = options.filter || "*.*";
            var dialogTitle = options.dialogTitle || "请选择文件";
            var selectFiles = [];
            //var maxLength = options.maxLength || 50;
            try{
                var result = control.getopenfilename(filter, dialogTitle);
            } catch (e) {
                throw "M139.Plugin.FastUpload.openWindowFileDialog Error At:control.getopenfilename";
            }
            if (result) {
                var count = control.getfilecount();
                for (var i = 0; i < count; i++) {
                    var filePath = control.getfilename(i);
                    var fileSize = control.getfilesize(i);
                    var fileName = M139.Text.Url.getFileName(filePath);
                    selectFiles.push({
                        filePath: filePath,
                        fileSize: fileSize,
                        fileName: fileName
                    });
                }
            }
            return selectFiles;
        }


    });


})();
﻿/**
 * @fileOverview 定义文件快递（超大附件）快速上传模型
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.Model.ModelBase;
    var namespace = "M2012.UI.LargeAttach.FastUploadModel";

    M139.namespace(namespace, superClass.extend(
    /**@lends M2012.UI.LargeAttach.FastUploadModel.prototype*/
    {
        /** 定义文件快递（超大附件）模型
         *@constructs M2012.UI.LargeAttach.FastUploadModel
         *@extends M139.Model.ModelBase
         *@param {Object} options 初始化参数集
         *@example
         
         */
        initialize: function (options) {
            return superClass.prototype.initialize.apply(this, arguments);
        },

        name: namespace,

        getSid: function () {
            return top.$App.getSid();
        },
        getUserNumber: function () {
            return top.$User.getUid();
        },
        //todo flash调用请求上传地址URL，flash里使用的，要用完整路径
        serverPath: "http://" + location.host + "/mw2/disk/disk",
        
        UploadStyle: 1,//类型 1:文件快递 2.彩云上传
        prjtype: 1,//？？？
        MaxUploadingCount:1,
        /**
         *获取新上传文件随机id,如果是断点续传的文件，则不通过这个生成
         *@inner
         */
        getNewUploadFileId: function () {
            var rnd = parseInt(Math.random() * 100000000);
            return rnd;
        },

        //预上传
        getPreUploadUrl: function () {
            return this.resolveUrl("disk:preUpload");
        },
        //上传成功
        getUploadSuccessUrl: function () {
            return this.resolveUrl("disk:uploadSuccess");
        },
        //获取分布式上传信息
        getUploadKeyUrl: function () {
            return this.resolveUrl("disk:getUploadKey");
        },
        //断点续传
        getBreakPFileUrl: function () {
            return this.resolveUrl("disk:breakPFile");
        },
        //删除
        getDeleteFileUrl: function () {
            return this.resolveUrl("disk:delFiles");
        },
        //组装url
        resolveUrl: function (name) {
            return M139.Text.Url.makeUrl(this.serverPath, {
                func: name,
                sid: $App.getSid(),
                rnd: Math.random()
            });
        },

        //服务器请求
        //改变文件状态
        changeFileState: function (options, callback) {
            var This = this;
            var url = this.getPreUploadUrl();
            if (options.state == 0) {
                url = this.getUploadSuccessUrl();
            }
            var data = {
                fileName: options.fileName,
                fileSize: options.fileSize,
                status: options.state,
                fileRefId: options.storageId,
                type: 1,//小工具2
                action: 1
            };
            M139.RichMail.API.call(url, data, function (response) {
                var json = response.responseData;
                var result = {};
                result.success = false;
                result.code = json.code;
                result.message = json.summary;
                if (json.code == This.ResponseCode.isOk) {
                    result.success = true;
                    result.uploadId = json["var"].fileId;
                } else if (json.code == This.ResponseCode.overMaxSize) {//文件大小超过容量
                    result.overMaxSize = true;
                } else if (json.code == This.ResponseCode.fileNameError) {//文件名非法
                    result.fileNameError = true;
                }
                if (callback) callback(result);
            });
        },

        //获取分布式上传地址
        getUploadKey: function (file, callback) {
            var This = this;
            var url = this.getUploadKeyUrl();
            var data = {};
            if (file.storageId) {
                data.fileId = file.storageId;
                url = this.getBreakPFileUrl();
            } else {
                data.fileName = file.fileName;
                data.fileSize = file.fileSize;
            }
            //发送请求
            M139.RichMail.API.call(
                url,
                M139.Text.Xml.obj2xml(data),
                function (response) {
                    var result = {};
                    try {
                        var json = response.responseData;
                        result.code = json.code;
                        result.message = json.summary;
                        if (json.code == This.ResponseCode.isOk) {
                            result.serverInfo = json["var"];
                            result.success = true;
                        }
                    } catch (e) {
                        result.success = false;
                    }
                    if (callback) callback(result);
                }
            );
        },
        deleteFile: function (storageId,callback) {
            var This = this;
            M139.RichMail.API.call(
                this.getDeleteFileUrl(),
                {
                    fileIds: storageId,
                    type: 1 //本地小工具上传2,web1
                },
                function (response) {
                    var json = response.responseData;
                    if (json && json.code == This.ResponseCode.isOk) {
                        if (callback) callback({ success: true });
                    } else {
                        if (callback) callback({ success: false });
                    }
                }
            );
        },


        ResponseCode: {
            //服务器返回标识_成功
            isOk: "S_OK",
            //务器返回标识_失败
            isError: "S_ERROR",
            //服务器返回标识_文件明非法
            fileNameError: "FILE_NAME_ERROR",
            //服务器返回标识_超出最大容量
            overMaxSize: "FREE_SIZE_ERROR"

        }
    }));
})(jQuery, _, M139);
﻿/**
 * @fileOverview 定义文件快递（超大附件）快速上传视图（安装小工具后才能用的组件功能）
 */

/*
    fileId 控件上传队列id
    storageId 分布式存储分配的id
    uploadId 数据库中存在记录的已完整、未完成的文件记录id
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.LargeAttach.FastUploadView";

    M139.namespace(namespace, superClass.extend(
    /**@lends M2012.UI.LargeAttach.FastUploadView.prototype*/
    {
        /** 定义文件快递（超大附件）flash上传界面
         *@constructs M2012.UI.LargeAttach.FastUploadView
         *@extends M139.View.ViewBase
         *@param {Object} options 初始化参数集
         *@param {HTMLElement} options.container 控件容器元素
         *@example
         
         */
        initialize: function (options) {
            this.model = options.model;
            this.fastUploadModel = new M2012.UI.LargeAttach.FastUploadModel({});

            this.files = new Backbone.Collection;

            var html = $T.Utils.format(this.template, {maxUploadSize: M139.Text.Utils.getFileSizeText(this.model.MaxUploadSize)});
            $(html).appendTo(options.container);

            this.setElement(options.container);
            this.globalName = this.getGlobalName();
            this.controlId = this.getControlId();
            return superClass.prototype.initialize.apply(this, arguments);
        },


        template: ['<div class="boxIframeText bigatta">',
            '<div class="topBtn"><a href="javascript:void(0)" class="btnNormal SelectFile"><span>添加文件</span></a></div>',
            '<div class="attaList" style="height:300px">',
                '<p class="gray pl_10 pt_10 pb_10 pr_10">',
                    '可同时上传多个文件，单文件最大{maxUploadSize}；<br>',
                    '文件有效期为15天，可在暂存柜续期；<br>',
                    '若您删除了文件，或文件已过期，收件人将无法下载；<br>',
                    '请遵守国家相关法律，严禁上传反动、暴力、色情、违法及侵权内容。</p>',
            '</div>',
        '</div>'].join(""),

        switchListMode:function(){
            //隐藏提示语，切换到上传队列视图
            this.$(".attaList > p").hide();
        },

        /**
         *获得此对象的全局引用，因为此对象需要跟c++控件交互，所以需要暴露到全局
         *@inner
         */
        getGlobalName: function () {
            var rnd = parseInt(Math.random() * 100000000);
            var name = "_fastupload_handler" + rnd;
            window[name] = this;
            return name;
        },
        /**
         *随机创建一个控件id
         *@inner
         */
        getControlId: function () {
            var rnd = parseInt(Math.random() * 100000000);
            var name = "_fastupload_" + rnd;
            return name;
        },

        events: {
            "click .SelectFile": "onSelectFileClick"
        },

        render: function () {
            this.initUploadControl();
            this.initEvents();
            return superClass.prototype.render.apply(this, arguments);
        },


        isSupportControlUpload: function () {
            return M139.Plugin.FastUpload.checkControlSetup() > 0;
        },

        /**
         *初始化ActiveX上传控件
         *@inner
         */
        initUploadControl: function () {
            this.control = M139.Plugin.FastUpload.createControl({
                controlId: this.controlId,
                container: this.el,
                globalHandler: this.globalName
            });
        },


        initEvents: function () {
            var This = this;
            this.files.on("add", function (itemModel) {
                This.createItemView(itemModel);
                This.tryUploadNext();
            });

            this.on("remove", function () {
                this.stopAll();
                this.el.innerHTML = "";//销毁控件
            });

            //打开对话框后自动弹出windows文件选择框
            this.on("print", function () {
                this.openDialog();
            });
        },

        getSuccessFiles:function(){
            var succFiles = this.files.filter(function (itemModel) {
                return itemModel.get("state") == "Success";
            });
            return succFiles;
        },

        getUploadingFiles:function(){
            var uploadingFiles = this.files.filter(function (itemModel) {
                return itemModel.get("state") == "Uploading";
            });
            return uploadingFiles;
        },

        tryUploadNext: function () {
            var This = this;

            if (this.getUploadingFiles().length < this.fastUploadModel.MaxUploadingCount) {

                var waitFile = this.files.find(function (itemModel) {
                    return itemModel.get("state") == "Waiting";
                });
                if (waitFile) {
                    var fileInfo = {
                        filePath: waitFile.get("filePath"),
                        fileName: waitFile.get("fileName"),
                        fileSize: waitFile.get("fileSize"),
                        fileId: waitFile.get("fileId"),
                        storageId: waitFile.get("storageId")
                    };
                    waitFile.set("state", "Uploading");
                    this.fastUploadModel.getUploadKey(fileInfo, function (result) {
                        if (result.success) {
                            upload(result.serverInfo);
                        } else {
                            var msg = result.message || "获取上传地址失败";
                            waitFile.set("errorMsg", msg);
                            waitFile.set("state", "Fail");
                        }
                    });
                }
            }

            function upload(serverInfo) {
                var param = {};
                jQuery.extend(param, serverInfo);
                jQuery.extend(param, fileInfo);
                console.log("do uploading file");
                M139.Plugin.FastUpload.uploadFile(This.control, param);
            }
        },

        /**
         *关闭所有窗口前要停止所有上传任务，只移除控件还不行
         *@inner
         */
        stopAll:function(){
            var upFiles = this.getUploadingFiles();
            for (var i = 0; i < upFiles.length; i++) {
                var f = upFiles[i];
                this.stopUpload(f.get("fileId"));
            }
        },

        /**
         *@inner
         */
        stopUpload:function(fileId){
            M139.Plugin.FastUpload.stopUpload(this.control, fileId);
        },

        /**
         *删除文件
         */
        deleteFile:function(itemModel){
            var storageId = itemModel.get("storageId");
            var uploadId = itemModel.get("uploadId");
            var prevState = itemModel.previous("state");
            if (prevState == "Uploading") {
                M139.Plugin.FastUpload.stopUpload(this.control, itemModel.get("fileId"), {
                    isDelete: true,
                    storageId: storageId
                });
            }
            if (itemModel.get("state") != "Success") {//上传成功就不从服务器删除了
                this.fastUploadModel.deleteFile(uploadId, function (result) {
                    if (result.success) {
                        M139.UI.TipMessage.show("删除成功", { delay: 3000 });
                    }
                });
            }
        },

        createItemView: function (itemModel) {
            var This = this;
            var view = new UploadItemView({
                model: itemModel
            });

            this.switchListMode();
            view.render().$el.appendTo(this.$(".attaList"));
            itemModel.on("change:state", function (model, state) {
                This.onItemStateChange(model, state);
            });
        },

        isUploading:function(){
            var uploadingItem = this.files.find(function (item) {
                return item.get("state") == "Uploading";
            });
            return !!uploadingItem;
        },

        /**
         *当有文件状态发生变化，计算出一些数据，给外部的表现层使用
         */
        onItemStateChange: function (model, state) {
            if (state == "Delete") {
                this.deleteFile(model);
                this.files.remove(model);
            } else if (state == "GotoStop") {
                this.stopUpload(model.get("fileId"));
                return;
            }


            var failFiles = this.files.filter(function (item) { 
                return item.get("state") == "Fail";
            });
            var successCount = this.getSuccessFiles().length;
            var uploading = this.isUploading();
            this.model.set("uploading", uploading);
            this.model.set("fileCount", this.files.length);
            this.model.set("failCount", failFiles.length);
            this.model.set("successCount", successCount);
            //兼容flash控件的status
            this.model.set("status", {
                isUploading: uploading,
                fileTotal: this.files.length,
                progressTotal: 0,
                speedTotal: 0
            });

            this.tryUploadNext();//尝试上传队列文件


            this.trigger("uploadprogress", {
                status: status
            });
        },

        onSelectFileClick: function () {
            this.openDialog();
        },

        onSelectFile: function (files) {
            var MaxSize = this.model.MaxUploadSize;

            //判断大小
            for (var i = 0; i < files.length; i++) {
                var f = files[i];
                if (f.fileSize > MaxSize) {
                    var error = "您选择的文件“{0}”超过了单个文件最大限制{1},请重新选择！"
                        .format(M139.Text.Url.getOverflowFileName(f.fileName), M139.Text.Utils.getFileSizeText(MaxSize));
                } else if (f.fileSize === 0) {
                    var error = "您选择的文件“{0}”大小为0,无法上传！"
                        .format(M139.Text.Url.getOverflowFileName(f.fileName));
                }
                if (error) {
                    $Msg.alert(error, {
                        icon: "warn"
                    });
                    return;
                }
            }

            for (var i = 0; i < files.length; i++) {
                var f = files[i];
                if (this.isExistFile(f.filePath)) {
                    M139.UI.TipMessage.show("文件重复添加:" + f.filePath, {
                        delay: 3000
                    });
                } else {
                    this.files.add({
                        fileName: f.fileName,
                        fileSize: f.fileSize,
                        filePath: f.filePath,
                        fileId: this.fastUploadModel.getNewUploadFileId(),
                        uploadedSize: 0,
                        state: "Waiting"
                    });
                }
            }
        },

        /**
         *添加续传的文件任务
         */
        addContinueUpload: function (fileInfo) {
            var storageId = fileInfo.storageId;
            var filePath;
            var count = this.control.gettaskcount();
            for (var i = 0; i < count; i++) {
                if (storageId == this.control.gettaskfileid(i)) {
                    filePath = this.control.gettaskfilename(i);
                }
            }
            //todo 找不到可以续传的文件
            //fileSharing.FF.alert(sharingBox.messages.ContinueError);
            this.files.add({
                fileName: fileInfo.fileName,
                fileSize: fileInfo.fileSize,
                filePath: filePath,
                fileId: this.fastUploadModel.getNewUploadFileId(),
                uploadId: fileInfo.fileId,
                storageId: fileInfo.storageId,
                uploadedSize: 0,
                state: "Waiting"
            });
        },


        /**
         *判断文件是否已选择
         */
        isExistFile:function(filePath){
            var match = this.files.find(function (itemModel) {
                return itemModel.get("filePath") === filePath;
            });
            return !!match;
        },

        getItemByFileId:function(fileId){
            var match = this.files.find(function (itemModel) {
                return itemModel.get("fileId") === fileId;
            });
            return match;
        },

        /**
         *打开windows上传文件
         *@inner
         */
        openDialog: function () {
            var files = M139.Plugin.FastUpload.openWindowFileDialog(this.control, {
                filter: "*.*",
                dialogTitle: "请选择要上传的文件"
            });
            if (files.length > 0) {
                this.onSelectFile(files);
            }
        },
        /**
         *C++控件触发：上传前调用
         */
        onUploadStart: function (fileId) {
            console.log("c++ onUploadStart:" + fileId);
            var itemModel = this.getItemByFileId(fileId);
            if (itemModel) {
                itemModel.set("state", "Uploading");
                //如果有滚动条，滚动到正在上传的文件处
                this.scrollToFirstUploadingFile();
            } else {
                //存在移除的时间差
                this.stopUpload(fileId);
            }
        },
        /**
         *C++控件触发：上传进度变更时触发
         */
        onUploadProgress: function (fileId, progress, uploadsize, times) {
            console.log("c++ onUploadProgress:" + [fileId, progress, uploadsize, times].join(","));
            var itemModel = this.getItemByFileId(fileId);
            if (itemModel) {
                itemModel.set("state", "Uploading");
                itemModel.set("uploadedSize", uploadsize);
            }
            /*
            this.lastUploadTip = status;

            this.model.set("uploading", status.isUploading);
            this.model.set("fileCount", status.fileTotal);
            if (!status.isUploading) {
                this.model.set("failCount", status.fileTotal - status.progressTotal);
            }
            this.model.set("status", status);

            this.trigger("uploadprogress", {
                status: status
            });
            */
        },
        /**
         *C++控件触发：上传动作停止
         */
        onUploadStop: function (fileId, result, fileIdOfServer) {
            console.log("c++ onUploadStop:" + [fileId, result, fileIdOfServer].join(","));
            var resultState = ["success", "stopped", "unknownerror", "virus"];
            var r = resultState[result] || resultState[2]; //超过3,默认为2
            var itemModel = this.getItemByFileId(fileId);

            if (!itemModel) {
                return;//已经移除掉了
            }

            itemModel.set("storageId", fileIdOfServer);
            /*todo
            if (result >= 2 && top.ScriptErrorLog) {
                fileSharing.tool.tryCatch(function () {
                    top.ScriptErrorLog.addLog("project:LargeAttachments【{0}】version:{1},resultCode:{2},storageId:{3},fileName:{4},fileSize:{5},progress:{6},userAgent:{7}"
                    .format(top.UserData.userNumber, (window.proxyWindow || window).uploadControl.getversion(),
                            result, fileIdOfServer, file.fileName, file.fileSize, file.progress, navigator.userAgent));
                });
            }
            */
            var state = "Fail";
            var errorMsg = "";
            if (r == "success") {
                this.fastUploadModel.changeFileState({
                    state: 0,//上传成功
                    fileName: itemModel.get("fileName"),
                    fileSize: itemModel.get("fileSize"),
                    storageId: itemModel.get("storageId")
                }, function (result) {
                    if (result.success) {
                        itemModel.set("uploadId", result.uploadId);
                        itemModel.set("state", "Success");
                    } else {
                        itemModel.set("errorMsg", result.message);
                        itemModel.set("state", "Fail");
                    }
                });
                return;

            } else if (r == "virus") {
                if (file.uploadId) {
                    this.fastUploadModel.deleteFile(fileIdOfServer);
                }
                errorMsg = "此文件包含病毒";
            } else if (r == "stopped") {
                state = "Stop";
            } else {
                errorMsg = "未知错误";
            }
            if(errorMsg){
                itemModel.set("errorMsg", errorMsg);
            }
            itemModel.set("state", state);
        },
        /**
         *C++控件触发：控件产生日志
         */
        onLog: function (logText) {
            console.log("c++ onLog:" + logText);
            top.M139.Logger.sendClientLog({
                name: "FastUploadControl",
                errorMsg: logText
            });
        },
        /**
         *C++控件触发：开始上传时触发，此时已经获得了分布式存储文件id
         */
        onPrepare: function (fileId, fileIdOfServer) {
            var This = this;
            console.log("c++ onPrepare:" + [fileId, fileIdOfServer].join(","));
            var itemModel = this.getItemByFileId(fileId);

            
            if (itemModel.get("uploadId")) {
                console.log("c++ onPrepare again and return");
                return;//续传的时候重新触发 此时已经在上传了 所以不执行操作
            }

            itemModel.set("storageId", fileIdOfServer);



            var obj = {
                fileName: itemModel.get("fileName"),
                fileSize: itemModel.get("fileSize"),
                state: 2,
                storageId: fileIdOfServer
            };
            //分布式取到id后，从前端服务申请上传
            this.fastUploadModel.changeFileState(obj, function (result) {
                if (result.success) {
                    itemModel.set("uploadId", result.uploadId);
                    return;
                } else if (result.overMaxSize) {//文件大小超过容量
                    
                } else if (result.fileNameError) {//文件名非法
                    
                }
                M139.Plugin.FastUpload.stopUpload(This.control, fileId);
                itemModel.set("errorMsg", result.message);
                itemModel.set("state", "Fail");
            });
        },

        /**
         *取得上传成功的文件列表
         */
        getUploadedFileList: function () {
            var list = this.getSuccessFiles();
            return _.map(list, function (item) {
                return {
                    fileId: item.get("uploadId"),
                    fileName: item.get("fileName"),
                    fileSize: item.get("fileSize")
                };
            });
        },

        isUploadComplete: function () {
            if (this.isUploading()) {
                return false;
            } else {
                return true;
            }
        },

        scrollToFirstUploadingFile: function () {
            var uploadingItem = this.getUploadingFiles()[0];
            if (uploadingItem) {
                var fileId = uploadingItem.get("fileId");
                var element = this.$el.find("div[fileId='" + fileId + "']")[0];
                if (element) {
                    try{
                        element.scrollIntoView();
                    } catch (e) { }
                }
            }
        }

    }));


    //文件状态视图：排队、上传中、上传失败、上传成功
    var UploadItemView = superClass.extend({
        initialize: function (options) {
            this.model = options.model;

            this.setElement(jQuery(this.template.Container));

            return superClass.prototype.initialize.apply(this, arguments);
        },

        events:{
            "click .BtnDelete": "onDeleteButtonClick",
            "click .BtnRetry": "onRetryButtonClick",
            "click .BtnStop" : "onStopButtonClick"
        },

        render: function () {
            this.renderAll();
            this.initEvent();
            return superClass.prototype.render.apply(this, arguments);
        },

        /**
         *显示文件名
         *@inner
         */
        renderFileName:function(){
            var fileName = this.model.get("fileName");
            var extName = M139.Text.Url.getFileExtName(fileName);
            //文件名
            this.$(this.template.P_FileName).text(M139.Text.Utils.getTextOverFlow(M139.Text.Url.getFileNameNoExt(fileName), 20, true));
            //扩展名
            this.$(this.template.P_FileNameExt).text("." + extName);
            //图标
            this.$(this.template.P_FileIcon).addClass("i_f_" + extName);
        },

        /**
         *显示进度条
         *@inner
         */
        renderProgress: function () {
            var uploadedSize = this.model.get("uploadedSize");
            var fileSize = this.model.get("fileSize");
            var percent = (Math.floor(uploadedSize / fileSize * 100) || 0) + "%";

            this.$(this.template.P_ProgressBar).css("width", percent);
            this.$(this.template.P_ProgressText).text(percent);
        },

        /**
         *显示上传速度(这里暂时没显示速度，只有"上传大小/总大小"）
         *@inner
         */
        renderSpeed:function(){
            var uploadedSize = this.model.get("uploadedSize");
            var fileSize = this.model.get("fileSize");
            var fileSizeText = M139.Text.Utils.getFileSizeText(fileSize);
            var text = "(" + M139.Text.Utils.getFileSizeText(uploadedSize) + "/" + fileSizeText + ")";
            this.$(this.template.P_Speed).text(text);
            this.$(this.template.P_FileSize).text("(" + fileSizeText + ")");
            //todo
            //this.$(this.template.P_RemainTime)
        },

        /**
         *打印上传失败的原因
         *@inner
        */
        renderFailMsg:function(){
            var errorMsg = this.model.get("errorMsg");
            if (errorMsg) {
                this.$(this.template.P_ErrorTip).text(errorMsg);
            }
        },

        /**
         *显示整体界面
         *@inner
         */
        renderAll: function () {
            var state = this.model.get("state");
            this.$el.attr("fileId", this.model.get("fileId"));
            if (state == this.States.Delete) {
                this.$el.remove();
            } else {
                var innerHTML = this.template[state];
                if (innerHTML) {
                    this.el.innerHTML = innerHTML;
                    this.renderFileName();
                    this.renderProgress();
                    this.renderSpeed();

                    if (state == this.States.Fail) {
                        this.renderFailMsg();
                    }
                }
            }
        },

        /**
         *绑定事件
         *@inner
         */
        initEvent: function () {
            var This = this;
            this.model.on("change:state", function (model, state) {
                This.renderAll();
            }).on("change:speed", function (model, speed) {
                This.renderSpeed();
            }).on("change:uploadedSize", function (model, uploadedSize) {
                This.renderSpeed();
                This.renderProgress();
            });
        },

        States:{
            Waiting:"Waiting",
            Fail: "Fail",
            Stop: "Stop",
            Uploading:"Uploading",
            Success: "Success",
            Delete: "Delete",
            GotoStop: "GotoStop"
        },

        onDeleteButtonClick: function () {
            var This = this;
            $Msg.confirm("是否要删除文件？", function () {
                This.model.set("state", This.States.Delete);
            }, {
                icon:"warn"
            });
        },

        onRetryButtonClick:function(){
            this.model.set("state", this.States.Waiting);
        },

        onStopButtonClick: function () {
            this.model.set("state", this.States.GotoStop);
        },


        template: (function () {
            var temp = {
                P_FileName: ".FileName",
                P_FileNameExt: ".FileNameExt",
                P_Speed: ".Speed",
                P_ProgressBar: ".ProgressBar",
                P_BtnRetry: ".BtnRetry",
                P_BtnDelete: ".BtnDelete",
                P_ErrorTip: ".UploadErrorTip",
                P_FileIcon: ".FileIcon",
                P_ProgressText: ".ProgressText",
                P_RemainTime: ".RemainTime",
                P_FileSize: ".FileSize",
                Container: '<div class="attaListLi"></div>',
                Uploading: [
                    '<i class="i_file FileIcon"></i>',
                    '<div class="attaListLiText">',
                        '<p><span class="FileName">111</span><span class="gray FileNameExt">.jpg</span><span class="gray Speed">(40.5m/50M)</span></p>',
                        '<div class="">',
                            '<span class="progressBarDiv">',
                                    '<span class="progressBar"></span>',
                                    '<span class="progressBarCur">',
                                        '<span style="width: 0%;" class="ProgressBar"></span>',
                                    '</span>',
                                '</span><span class="ProgressText"></span>',
                        '</div>',
                    '</div>	',
                    '<div class="attaListLiText2"><a href="javascript:;" class="BtnStop">暂停</a> | <a class="BtnDelete" href="javascript:;">删除</a><br><span class="gray RemainTime"></span></div>'
                ].join(""),
                Stop: [
                    '<i class="i_file FileIcon"></i>',
                    '<div class="attaListLiText">',
                        '<p><span class="FileName">111</span><span class="gray FileNameExt">.doc</span><span class="gray Speed"></span></p>',
                        '<div class="">',
                            '<span class="progressBarDiv">',
                                    '<span class="progressBar"></span>',
                                    '<span class="progressBarCur">',
                                        '<span style="width: 0;" class="ProgressBar"></span>',
                                    '</span>	',
                                '</span> <span class="gray">已暂停</span>',
                        '</div>',
                    '</div>',
                     '<div class="attaListLiText2"><a href="javascript:;" class="BtnRetry">继续</a> | <a href="javascript:;" class="BtnDelete">删除</a></div>'
                ].join(""),
                Fail: [
                    '<i class="i_file FileIcon"></i>',
                    '<div class="attaListLiText">',
                        '<p><span class="red FileName">134554465465464</span><span class="gray FileNameExt">.mp3</span><span class="gray Speed"></span></p>',
                        '<div class="">',
                            '<span class="red UploadErrorTip">上传失败</span>',
                        '</div>',
                    '</div>	',
                    '<div class="attaListLiText2"><a href="javascript:;" class="BtnRetry">重试</a> | <a href="javascript:;" class="BtnDelete">删除</a></div>'
                ].join(""),
                Waiting: [
                    '<i class="i_file FileIcon"></i>',
                    '<div class="attaListLiText">',
                        '<p><span class="FileName">111</span><span class="gray FileNameExt">.doc</span><span class="gray Speed"></span></p>',
                        '<div class="">',
                            '<span class="progressBarDiv">',
                                    '<span class="progressBar"></span>',
                                    '<span class="progressBarCur">',
                                        '<span style="width: 0;" class="ProgressBar"></span>',
                                    '</span>	',
                                '</span> <span class="gray">等待中</span>',
                        '</div>',
                    '</div>',
                    '<div class="attaListLiText2"><a href="javascript:;" class="BtnDelete">删除</a></div>'
                ].join(""),
                Success: [
                    '<i class="i_file FileIcon"></i>',
                    '<div class="attaListLiText">',
                        '<p><span class="FileName">111</span><span class="gray FileNameExt">.pdf</span><span class="gray FileSize"></span></p>',
                        '<div class="">',
                            '<span class="c_009900">上传成功</span>',
                        '</div>',
                    '</div>',
                    '<div class="attaListLiText2"><a class="BtnDelete" href="javascript:;">删除</a>',
                    '</div>'
                ].join("")
            };
            return temp;
        })()
    });


})(jQuery, _, M139);
