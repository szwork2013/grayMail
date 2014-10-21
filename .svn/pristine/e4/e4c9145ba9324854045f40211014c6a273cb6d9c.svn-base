/**
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