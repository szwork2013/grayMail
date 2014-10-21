/*
 * 上传组件中间层，负责根据浏览器环境进行调用html5,控件或flash上传类.
 * 具体上传控制还是由各种上传类(html5,控件及flash)进行控制.
 */

// 上传相关配置项，主要是供测试时使用，上线前需要关闭开关
var UploadFacadeConfig = {

    // 使用flash上传时，不得低于此版本（flash支持断点续传等高级特性）
    flashVersionNeed            : "11.4",

    isCloseControl              : false, // 是否强制关闭控件上传，上线前关闭

//    flashVersion                : "11.3", // 上线需要注释掉此行代码

    control                     : false, // 默认是否开启控件上传，上线前关闭
    flash                       : false, // 默认是否开启flash上传，上线前关闭
    common                      : false // 默认是否开启普通上传，上线前关闭
};

var UploadFacade = function (options) {
    this.uploadType = {
        HTML5   : "html5",
        CONTROL : "control",
        FLASH   : "flash",
        COMMON  : "common"
    };

    this.config = {
        //html5上传中md5需要用到的资源路径
        resourceUrlForMd5           : "/m2012/js/ui/upload"
    };

    this.currentUploadType = ""; //当前上传文件方式html5, 控件或flash

    this.isCommonUpload = false; //是否支持普通上传，彩云上传中需要用到

    this.flashUpadeUrl = "http://get.adobe.com/cn/flashplayer/?fpchrome"; // flash升级地址

    //储存各种事件及相应处理器
    this.events = {
        selecte         : function(){},
        prepareupload   : function(){},
        loadstart       : function(){},
        progress        : function(){},
        md5progress     : function(){},
        complete        : function(){},
        error           : function(){}
    };

    window.InstanceUpload = this.instanceUpload = {};

    this.init(options);
};

/*
 * UploadFacade原型扩展函数
 */
UploadFacade.include = function (o) {
    var included = o.included;
    for (var i in o) this.prototype[i] = o[i];
    included && included();
};

/*
 * UploadFacade扩展静态方法
 */
UploadFacade.extend = function (o) {
    var included = o.included;
    for (var i in o) this[i] = o[i];
    included && included();
};

UploadFacade.extend({
    //是否安装控件
    isUploadControlSetup: function(){
        var setup = false;

        if (window.ActiveXObject) {//ie
            try {
                if (new ActiveXObject("Cxdndctrl.Upload")) {
                    setup = true;
                }
            } catch (ex) {
                try {
                    if (new ActiveXObject("ExCxdndCtrl.ExUpload")) {
                        setup = true;
                    }
                } catch (e) {
                    console.log(ex);
                    console.log('创建ActiveXObject("Cxdndctrl.Upload")及ActiveXObject("ExCxdndCtrl.ExUpload")对象失败！');
					//M139.Logger.getDefaultLogger().error('创建ActiveXObject("Cxdndctrl.Upload")及ActiveXObject("ExCxdndCtrl.ExUpload")对象失败！');
                }
            }
        } else if (navigator.plugins) {//firefox chrome
            var mimetype = navigator.mimeTypes["application/x-richinfo-cxdnd3"];

            setup = (mimetype && mimetype.enabledPlugin) ? true : false;
        }

        if (UploadFacadeConfig.isCloseControl) {
            setup = false;
        }

        return setup;
    },

    //返回Flash Player的版本号,如果不支持，则返回0
    getFlashVersion: function () {
        var isIE = $.browser.msie;
        function getVersionInIE() {
            /*var v = 0;
            for (var i = 11; i >= 6; i--) {
                try {
                    var obj = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + i);
                    if (obj) {
                        v = i;
                        break;
                    }
                } catch (e) { }
            }
            return v;*/

            var version = 0;
            var axo;

            // NOTE : new ActiveXObject(strFoo) throws an exception if strFoo isn't in the registry
            try {
                // version will be set for 7.X or greater players
                axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
                version = axo.GetVariable("$version");
            } catch (e) {
            }

            if (!version) {
                try {
                    // version will be set for 6.X players only
                    axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");

                    // installed player is some revision of 6.0
                    // GetVariable("$version") crashes for versions 6.0.22 through 6.0.29,
                    // so we have to be careful.

                    // default to the first public version
                    version = "WIN 6,0,21,0";

                    // throws if AllowScripAccess does not exist (introduced in 6.0r47)
                    axo.AllowScriptAccess = "always";

                    // safe to call for 6.0r47 or greater
                    version = axo.GetVariable("$version");

                } catch (e) {
                }
            }

            if (!version) {
                try {
                    // version will be set for 4.X or 5.X player
                    axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
                    version = axo.GetVariable("$version");
                } catch (e) {
                }
            }

            if (!version) {
                try {
                    // version will be set for 3.X player
                    axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
                    version = "WIN 3,0,18,0";
                } catch (e) {
                }
            }

            if (!version) {
                try {
                    // version will be set for 2.X player
                    axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                    version = "WIN 2,0,0,11";
                } catch (e) {
                }
            }

            if (version !== 0) {
                var match = version.match(/(\d+),(\d+).*$/);

                if (match[0]) {
                    version = Number(match[1] + "." + match[2]);
                } else {
                    version = 0;
                }
            }

            return version;
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
        };
        getVersionInOthers = getVersionInIE;
        return result;
    },

    //是否安装flash插件
    isUploadFlashSetup: function(){
        return this.getFlashVersion() > 0 ? true : false;
    }
});

/*
 * 扩展UploadFacade的原型方法
 */
UploadFacade.include({
    init: function (options) {
        this.model = options.model;
        this.subModel = options.subModel;
        this.isCommonUpload = options.isCommonUpload || false;
        this.isMcloud = options.isMcloud;
        this.createInstance(options);
        this.isNotUseFlash = options.isNotUseFlash;
    },

    //定义自定义事件监听，一种事件暂时只有单一处理器
    on: function (eventType, callback) {
        this.events[eventType] = callback;
    },

    //执行自定义事件
    trigger: function (command, options) {
        this.events[command].call(this, options);
    },

    update: function(){
        var currentFile = this.model.get("currentFile");
        var state = currentFile.state;

        this.trigger(state);
    },

    //todo 移动到模型层
    //完整的上传接口包含了获取地址，md5及上传，续传的时候需要clientTaskno,
    // reqData表示请求获取上传地址时需要的参数(彩云获取上传地址需要请求参数directoryId，dirType)
    uploadHandle: function (errCallback, md5LoadingCallback, clientTaskno, reqData) {
        var self = this;

        clientTaskno && this.setCurrentFile(clientTaskno);//续传时根据clientTaskno重新设置上传队列中的当前上传文件

        var currentFile = this.getFileInfo();
        this.model.set("currentFile", currentFile || {});
        currentFile && console.log("当前上传文件: " + currentFile.clientTaskno + ", " + currentFile.name);

        if (!currentFile) return;

        var businessId = self.getCurrentFileParam("businessId", currentFile);
        var uploadTaskID = self.getCurrentFileParam("uploadTaskID", currentFile);//存彩云时续传需要用
        if (!clientTaskno || !businessId) {//新上传文件
            if (self.currentUploadType == self.uploadType.COMMON) {
                self.model.getCommonUploadKey(currentFile, function (result) {
                    getUploadUrlHandle(result);
                }, reqData);
            }

            md5LoadingCallback && md5LoadingCallback(currentFile.clientTaskno);

            this.getFileMd5(function (fileMd5) {//todo 放到else中
                console.log(fileMd5);
                currentFile.fileMd5 = fileMd5;

                self.model.getUploadKey(currentFile, function (result) {
                    getUploadUrlHandle(result);
                }, reqData);
            });
        } else {//断点上传文件
            self.model.getBreakpointKey(businessId, uploadTaskID, function (result) {
                getUploadUrlHandle(result, true);
            });
        }

        function getUploadUrlHandle (result, isBreakpoint) {
            if (!result.success) {
                self.instanceUpload.uploading = false;
                self.model.get("currentFile").summary = result.summary;
                errCallback({clientTaskno: currentFile.clientTaskno});
                console.log(isBreakpoint ? "获取断点上传地址失败！" : "获取上传地址失败！");
                return;
            }

            delete currentFile.name;//为下文重新给文件命名(重复上传相同文件，需要取服务端文件名字)
            for (var i in result) currentFile[i] = result[i];
			currentFile["name1"] = result["name"];
            self.setExtData({businessId: result.businessId, uploadTaskID: result.uploadTaskID});//由于控件不方便扩展参数而设计

            if (result.status == 1) {//上传文件存在单副本，已上传过
                self.instanceUpload.uploading = false;

                self.model.get("currentFile").state = "complete";
                self.model.get("currentFile").responseText = true;
                self.update();

                return;
            }

            var dataUpload = self.model.packageData(currentFile);//todo getPostData
            self.upload(dataUpload);
        }
    },

    //对外提供上传接口
    upload: function (param) {
        this.instanceUpload.upload(param);
    },

    monitorToResume: function(){
        var self = this;
        var clientTaskno = this.model.get("currentFile").clientTaskno;

        if (!this.model.monitorIntervalId) { //避免上传接口异常时多次执行
            this.model.monitorIntervalId = setInterval(function () { //每隔5秒检测网络
                self.uploadHandle(function(){
                    self.model.trigger("error");
                }, function(){
                    self.model.trigger("getFileMd5");
                }, clientTaskno);
            }, 5000);
        }
    },

    //设置当前上传文件
    setCurrentFile: function (clientTaskno) {
        this.instanceUpload.setCurrentFile(clientTaskno);
    },

    //返回筛选后的文件列表
    setFileList: function (fileList) {
        this.instanceUpload.setFileList(fileList);
    },

    //设置上传文件类型
    setFileType: function (type) {
        this.instanceUpload.setFileType(type);
    },

    //转换文件的md5值
    getFileMd5: function (file) {
        this.instanceUpload.getFileMd5(file);
    },

    //获取上传队列中当前上传的文件信息
    getFileInfo: function(){
        return this.instanceUpload.getFileInfo();
    },

    //设置当前上传文件的扩展信息，包含了businessId
    setExtData: function (param) {
        this.instanceUpload.setExtData(param);
    },

    //获取当前上传文件的参数
    getCurrentFileParam: function (key, currentFile) {
        return this.instanceUpload.getCurrentFileParam(key, currentFile);
    },

    onabort: function (clientTaskno) {
        this.instanceUpload.onabort(clientTaskno);
    },

    createInstance: function (options) {
        options.controler = this;
        this.currentUploadType = this.getCurrentUploadType();

        switch (this.currentUploadType) {
            case this.uploadType.HTML5:
                window.InstanceUpload = this.instanceUpload = new Html5Upload(options);
                break;

            case this.uploadType.CONTROL:
                window.InstanceUpload = this.instanceUpload = new ActivexUpload(options);
                break;

            case this.uploadType.FLASH:
                window.InstanceUpload = this.instanceUpload = new FlashUpload(options);
                break;

            case this.uploadType.COMMON:
                window.InstanceUpload = this.instanceUpload = new CommonUpload(options);
                break;

            default:
                this.bindInputBtnEvent(options.btnUploadId);
        }
    },

    //todo 移动到model
    bindInputBtnEvent: function (id) {
        var self = this;
		var btn = null;
        if(typeof(id) == "string"){
			btn = $("#" + id).hide().next();
		}else{
			btn = $(id).hide().next();
		}
		
        var flashVersion = UploadFacade.getFlashVersion();

        btn.click(function(){
            if (flashVersion < UploadFacadeConfig.flashVersionNeed) { // flash版本不够，提示升级flash引导
                self.updateFlashGuide();
            } else { // html5、控件和flash均不支持，提示安装控件
				//提示安装 
                //self.model.showInstallActivex(btn);
				self.model.showInstallActivex({isInstall : true});
            }
        }).show();
    },

    // 升级flash引导
    updateFlashGuide: function(){
        var self = this;

        top.$Msg.confirm(
            "系统检测到您的FLASH版本太低，需要升级后才能正常使用上传服务！",
            function(){
                window.open(self.flashUpadeUrl);
            },
            function(){
                //cancel
            },
            {
                buttons: ["升级", "取消"],
                dialogTitle: "升级提示"
            }
        )
    },

    getCurrentUploadType: function(){
        var currentUploadType;

        if (UploadFacadeConfig.common) {
            currentUploadType = this.uploadType.COMMON;
        } else if (UploadFacadeConfig.flash) {
            currentUploadType = this.uploadType.FLASH;
        } else if (UploadFacadeConfig.control) {
            currentUploadType = this.uploadType.CONTROL;
        } else {
            if (window.File && window.FileList && window.FileReader &&
                    window.Blob && window.FormData && window.Worker &&
                    "withCredentials" in (new XMLHttpRequest)) {
                // 浏览器支持html5方式上传
                /*if (this.isMcloud == "1") { // 存彩云
                    currentUploadType = this.uploadType.COMMON;
                } else {
                    currentUploadType = this.uploadType.HTML5;
                }*/
                    currentUploadType = this.uploadType.HTML5;
            } else if (UploadFacade.isUploadControlSetup()) {
                // 浏览器支持控件上传
                currentUploadType = this.uploadType.CONTROL;
            } else if (UploadFacade.isUploadFlashSetup()) {
                // 浏览器支持flash上传
                if ($.browser.msie && $.browser.version === "8.0") { // ie8中屏蔽掉flash
                    if (this.isCommonUpload) {
                        currentUploadType = this.uploadType.COMMON;
                    } else {
                        currentUploadType = this.uploadType.CONTROL;
                    }
                } else {
                    var flashVersion = UploadFacade.getFlashVersion();

                    if (UploadFacadeConfig.flashVersion) {
                        flashVersion = UploadFacadeConfig.flashVersion;
                    }

                    if (flashVersion >= UploadFacadeConfig.flashVersionNeed) {
                        currentUploadType = this.uploadType.FLASH;
                    }
                }
            } else if (this.isCommonUpload) {
                currentUploadType = this.uploadType.COMMON;
            }
        }

        return currentUploadType;
    }
});
