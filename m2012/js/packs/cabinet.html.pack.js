/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
var hexcase=0;function hex_md5(a){return rstr2hex(rstr_md5(str2rstr_utf8(a)))}function hex_hmac_md5(a,b){return rstr2hex(rstr_hmac_md5(str2rstr_utf8(a),str2rstr_utf8(b)))}function md5_vm_test(){return hex_md5("abc").toLowerCase()=="900150983cd24fb0d6963f7d28e17f72"}function rstr_md5(a){return binl2rstr(binl_md5(rstr2binl(a),a.length*8))}function rstr_hmac_md5(c,f){var e=rstr2binl(c);if(e.length>16){e=binl_md5(e,c.length*8)}var a=Array(16),d=Array(16);for(var b=0;b<16;b++){a[b]=e[b]^909522486;d[b]=e[b]^1549556828}var g=binl_md5(a.concat(rstr2binl(f)),512+f.length*8);return binl2rstr(binl_md5(d.concat(g),512+128))}function rstr2hex(c){try{hexcase}catch(g){hexcase=0}var f=hexcase?"0123456789ABCDEF":"0123456789abcdef";var b="";var a;for(var d=0;d<c.length;d++){a=c.charCodeAt(d);b+=f.charAt((a>>>4)&15)+f.charAt(a&15)}return b}function str2rstr_utf8(c){var b="";var d=-1;var a,e;while(++d<c.length){a=c.charCodeAt(d);e=d+1<c.length?c.charCodeAt(d+1):0;if(55296<=a&&a<=56319&&56320<=e&&e<=57343){a=65536+((a&1023)<<10)+(e&1023);d++}if(a<=127){b+=String.fromCharCode(a)}else{if(a<=2047){b+=String.fromCharCode(192|((a>>>6)&31),128|(a&63))}else{if(a<=65535){b+=String.fromCharCode(224|((a>>>12)&15),128|((a>>>6)&63),128|(a&63))}else{if(a<=2097151){b+=String.fromCharCode(240|((a>>>18)&7),128|((a>>>12)&63),128|((a>>>6)&63),128|(a&63))}}}}}return b}function rstr2binl(b){var a=Array(b.length>>2);for(var c=0;c<a.length;c++){a[c]=0}for(var c=0;c<b.length*8;c+=8){a[c>>5]|=(b.charCodeAt(c/8)&255)<<(c%32)}return a}function binl2rstr(b){var a="";for(var c=0;c<b.length*32;c+=8){a+=String.fromCharCode((b[c>>5]>>>(c%32))&255)}return a}function binl_md5(p,k){p[k>>5]|=128<<((k)%32);p[(((k+64)>>>9)<<4)+14]=k;var o=1732584193;var n=-271733879;var m=-1732584194;var l=271733878;for(var g=0;g<p.length;g+=16){var j=o;var h=n;var f=m;var e=l;o=md5_ff(o,n,m,l,p[g+0],7,-680876936);l=md5_ff(l,o,n,m,p[g+1],12,-389564586);m=md5_ff(m,l,o,n,p[g+2],17,606105819);n=md5_ff(n,m,l,o,p[g+3],22,-1044525330);o=md5_ff(o,n,m,l,p[g+4],7,-176418897);l=md5_ff(l,o,n,m,p[g+5],12,1200080426);m=md5_ff(m,l,o,n,p[g+6],17,-1473231341);n=md5_ff(n,m,l,o,p[g+7],22,-45705983);o=md5_ff(o,n,m,l,p[g+8],7,1770035416);l=md5_ff(l,o,n,m,p[g+9],12,-1958414417);m=md5_ff(m,l,o,n,p[g+10],17,-42063);n=md5_ff(n,m,l,o,p[g+11],22,-1990404162);o=md5_ff(o,n,m,l,p[g+12],7,1804603682);l=md5_ff(l,o,n,m,p[g+13],12,-40341101);m=md5_ff(m,l,o,n,p[g+14],17,-1502002290);n=md5_ff(n,m,l,o,p[g+15],22,1236535329);o=md5_gg(o,n,m,l,p[g+1],5,-165796510);l=md5_gg(l,o,n,m,p[g+6],9,-1069501632);m=md5_gg(m,l,o,n,p[g+11],14,643717713);n=md5_gg(n,m,l,o,p[g+0],20,-373897302);o=md5_gg(o,n,m,l,p[g+5],5,-701558691);l=md5_gg(l,o,n,m,p[g+10],9,38016083);m=md5_gg(m,l,o,n,p[g+15],14,-660478335);n=md5_gg(n,m,l,o,p[g+4],20,-405537848);o=md5_gg(o,n,m,l,p[g+9],5,568446438);l=md5_gg(l,o,n,m,p[g+14],9,-1019803690);m=md5_gg(m,l,o,n,p[g+3],14,-187363961);n=md5_gg(n,m,l,o,p[g+8],20,1163531501);o=md5_gg(o,n,m,l,p[g+13],5,-1444681467);l=md5_gg(l,o,n,m,p[g+2],9,-51403784);m=md5_gg(m,l,o,n,p[g+7],14,1735328473);n=md5_gg(n,m,l,o,p[g+12],20,-1926607734);o=md5_hh(o,n,m,l,p[g+5],4,-378558);l=md5_hh(l,o,n,m,p[g+8],11,-2022574463);m=md5_hh(m,l,o,n,p[g+11],16,1839030562);n=md5_hh(n,m,l,o,p[g+14],23,-35309556);o=md5_hh(o,n,m,l,p[g+1],4,-1530992060);l=md5_hh(l,o,n,m,p[g+4],11,1272893353);m=md5_hh(m,l,o,n,p[g+7],16,-155497632);n=md5_hh(n,m,l,o,p[g+10],23,-1094730640);o=md5_hh(o,n,m,l,p[g+13],4,681279174);l=md5_hh(l,o,n,m,p[g+0],11,-358537222);m=md5_hh(m,l,o,n,p[g+3],16,-722521979);n=md5_hh(n,m,l,o,p[g+6],23,76029189);o=md5_hh(o,n,m,l,p[g+9],4,-640364487);l=md5_hh(l,o,n,m,p[g+12],11,-421815835);m=md5_hh(m,l,o,n,p[g+15],16,530742520);n=md5_hh(n,m,l,o,p[g+2],23,-995338651);o=md5_ii(o,n,m,l,p[g+0],6,-198630844);l=md5_ii(l,o,n,m,p[g+7],10,1126891415);m=md5_ii(m,l,o,n,p[g+14],15,-1416354905);n=md5_ii(n,m,l,o,p[g+5],21,-57434055);o=md5_ii(o,n,m,l,p[g+12],6,1700485571);l=md5_ii(l,o,n,m,p[g+3],10,-1894986606);m=md5_ii(m,l,o,n,p[g+10],15,-1051523);n=md5_ii(n,m,l,o,p[g+1],21,-2054922799);o=md5_ii(o,n,m,l,p[g+8],6,1873313359);l=md5_ii(l,o,n,m,p[g+15],10,-30611744);m=md5_ii(m,l,o,n,p[g+6],15,-1560198380);n=md5_ii(n,m,l,o,p[g+13],21,1309151649);o=md5_ii(o,n,m,l,p[g+4],6,-145523070);l=md5_ii(l,o,n,m,p[g+11],10,-1120210379);m=md5_ii(m,l,o,n,p[g+2],15,718787259);n=md5_ii(n,m,l,o,p[g+9],21,-343485551);o=safe_add(o,j);n=safe_add(n,h);m=safe_add(m,f);l=safe_add(l,e)}return Array(o,n,m,l)}function md5_cmn(h,e,d,c,g,f){return safe_add(bit_rol(safe_add(safe_add(e,h),safe_add(c,f)),g),d)}function md5_ff(g,f,k,j,e,i,h){return md5_cmn((f&k)|((~f)&j),g,f,e,i,h)}function md5_gg(g,f,k,j,e,i,h){return md5_cmn((f&j)|(k&(~j)),g,f,e,i,h)}function md5_hh(g,f,k,j,e,i,h){return md5_cmn(f^k^j,g,f,e,i,h)}function md5_ii(g,f,k,j,e,i,h){return md5_cmn(k^(f|(~j)),g,f,e,i,h)}function safe_add(a,d){var c=(a&65535)+(d&65535);var b=(a>>16)+(d>>16)+(c>>16);return(b<<16)|(c&65535)}function bit_rol(a,b){return(a<<b)|(a>>>(32-b))};
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

/*
 * html5方式上传
 */
var Html5Upload = function (options) {
    this.perSize            = "";
    this.fileNamePre        = "";
    this.btnUploadEle       = {};//上传文件按钮

    this.files              = [];//上传文件队列

    this.currentFile        = {};//当前上传的文件
    this.currentFileIndex   = 0;

    this.xhr                = {};
    this.uploading          = false;
    this.isBegin            = false;//暂停之后续传使用

    this.continueUploadCount= 0;//断网续传次数

    this.progressData       = {//每个时间点发送文件大小
        endTime             : 0,
        loadedSize          : 0
    };

    this.init(options);
};

Html5Upload.include = function (o) {
    var included = o.included;
    for (var i in o) this.prototype[i] = o[i];
    included && included();
};

Html5Upload.include({
    init: function (options) {
        this.initParams(options);
        this.bindEvent();
    },

    initParams: function (options) {
        this.controler = options.controler;
        this.model = options.model;

        this.fileNamePre = options.fileNamePre || "filedata";
        this.perSize = options.perSize || 1024 * 50;
        this.btnUploadId = options.btnUploadId;
    },

    bindEvent: function(){
        var self = this;
		var fileInput = null;
        if(typeof(this.btnUploadId) == "string"){
			fileInput = document.getElementById(this.btnUploadId);
		}else{
			fileInput = this.btnUploadId;
		}

        fileInput.setAttribute("multiple", "true");
        this.btnUploadEle = fileInput;
        fileInput.onchange = function(){
            self.selecteFileHandle();
            self.model.uploadClickBehavior(self.controler);
            fileInput.parentNode.reset();
        };
    },

    setFileType: function (type) {
        var newType = "";

        if (type == "image") {
            newType = "image/*";
        } else if (type == "music") {
            newType = "audio/*";
        } else {
            newType = "*/*";
        }
        this.btnUploadEle.setAttribute("accept", newType);
    },

    selecteFileHandle: function(){
        var filesLen = this.files.length;

        this.addFile();
        this.controler.trigger("select", {fileList: this.files.slice(filesLen)});
    },

    addFile: function(){
        var fileList = this.btnUploadEle.files;

        for (var i = 0, len = fileList.length; i < len; i++) {
            var file = fileList[i];

            this.files.push(fileList[i]);
        }
    },

    //重置上传队列
    setFileList: function (fileList) {//fileList为引用型指向files，直接修改files即可
        for (var i = 0, len = this.files.length; i < len; i++) {
            var file = this.files[i];

            if (file.state == 0) {
                this.files.splice(i, 1);
                i--;
                len--;
            }
        }

        if (!this.uploading) {
            this.model.get("currentFile").state = "prepareupload";
            this.controler.update();
        }
    },

    getFileInfo: function () {
        if (this.isBegin) {
            this.isBegin = false;
            return this.currentFile;
        }

        this.currentFile = this.files[this.currentFileIndex++];
        !this.currentFile && this.currentFileIndex--;

        return this.currentFile;
    },

    getFileByClientTaskno: function (clientTaskno) {
        for (var i = 0, len = this.files.length; i < len; i++) {
            var file = this.files[i];

            if (file.clientTaskno == clientTaskno) {
                return file;
            }
        }
    },

    setCurrentFile: function (clientTaskno) {
        for (var i = 0, len = this.files.length; i < len; i++) {
            var item = this.files[i];

            if (item.clientTaskno == clientTaskno) {
                this.currentFile = item;
                this.isBegin = true;
            }
        }
    },

    setExtData: function (param) {
        //js中obj是引用型的，已经在外部扩展了参数，不需要再处理了。
    },

    getCurrentFileParam: function (key) {
        return this.currentFile[key] || "";
    },

    /*
     * html5 上传接口
     * @param {Object} packData 上传的post数据
     */
    upload: function (packData) {
        var self = this;
        var urlUpload = packData.urlUpload;
        var isBreakpointUpload = !!packData.ranges;
        var isMcloud = packData.isMcloud;//是否存彩云

        this.storeBusinessId(packData.businessId);

        delete packData.urlUpload;
        delete packData.businessId;
        delete packData.isMcloud;

        var fileUpload = this.currentFile;
        var dataComplete = 0;

        if (packData.ranges) {//断点续传
            dataComplete = self.getCompleteSize(packData.ranges); //单一分段 2000 ranges: 0-1000  rang: 1001-1999

            //根据断点信息，如果发现文件已经上传完成，就不再上传
            if (dataComplete == this.currentFile.size - 1) self.onload();
            packData.range = dataComplete + "-" + (this.currentFile.size - 1);
            fileUpload = this.fileSlice(this.currentFile, dataComplete, this.currentFile.size);
        } else {//第一次上传
            packData.range = 0 + "-" + (this.currentFile.size - 1);
        }

        delete packData.ranges;//ranges 代表已经上传的部分，去掉，只传range(代表所传文件的片段)

        this.currentFile.dataComplete = dataComplete;//记录上次完成上传的文件大小

        var formData = new FormData;

        var xhr = new XMLHttpRequest();
        this.xhr = xhr;
        xhr.open("post", urlUpload, true);
        xhr.withCredentials = true;

        if (isMcloud == "1") {//存彩云用户
            packData.Range = "bytes=" + packData.range;
            delete packData.range;

            if (packData.contentSize === "") {
                packData.contentSize = this.model.get("currentFile").size;
            }

            for (var j in packData) xhr.setRequestHeader(j, packData[j]);

            // 文件名进行url编码，否则设置中文名时报错
            xhr.setRequestHeader("Content-Type", "application/octet-stream;name=" + encodeURIComponent(this.model.get("currentFile").name));
            xhr.setRequestHeader("x-NameCoding", "urlencoding");
        } else {
            for (var j in packData) formData.append(j, packData[j]);
        }

        formData.append(self.fileNamePre, fileUpload);

        if (!isBreakpointUpload) {
            xhr.upload.addEventListener("loadstart", function(){
                self.onloadstart();
            }, false);
        }
        xhr.upload.addEventListener("progress", function(e){self.onprogress(e);}, false);
        xhr.addEventListener("load", function(e){self.onload(e)}, false);
        //xhr.addEventListener("error", function(){self.onerror()}, false);
        xhr.addEventListener("abort", function(){self.oncancel()}, false);
        xhr.addEventListener("timeout", function(){self.ontimeout()}, false);
        xhr.addEventListener("readystatechange", function(){self.onreadystatechange(xhr)}, false);

        if (isMcloud == "1") {//存彩云用户
            xhr.send(fileUpload);
        } else {
            xhr.send(formData);
        }
    },

    // 139返回ranges格式为0-1000; 彩云返回的ranges格式为1000;
    getCompleteSize: function (ranges) {
        var rangesArr = ranges.split(";");
        var firstCompleteRange = rangesArr[0];
        var completeSize = 0;

        if (firstCompleteRange) {
            if (firstCompleteRange.indexOf("-") > -1) {
                completeSize = Number(firstCompleteRange.split("-")[1]);
            } else {
                completeSize = Number(firstCompleteRange.split("-")[0]);
            }
        }

        return completeSize;
    },

    onloadstart: function(){
        this.model.get("currentFile").state = "loadstart";
        this.controler.update();
    },

    onprogress: function (e) {
        var dataComplete = this.currentFile.dataComplete;

        console.log("上次上传大小：" + this.currentFile.dataComplete);
        console.log("已上传大小  ：" + (dataComplete + e.loaded));
        console.log("文件总大小  ：" + (dataComplete + e.total));

        if (e.lengthComputable) {
            var speed = this.getSpeed(e.loaded);
            var surplusTime = speed == 0 ? 0 : Math.round((e.total - e.loaded) / speed);

            this.model.get("currentFile").state = "progress";
            this.model.get("currentFile").sendSize = dataComplete + e.loaded;
            this.model.get("currentFile").totalSize = dataComplete + e.total;
            this.model.get("currentFile").speed = top.M139.Text.Utils.getFileSizeText(speed) + "/S";
            this.model.get("currentFile").surplusTime = this.model.transformTime(surplusTime);
            this.controler.update();

            return;
        }

        console.log(this.msg.NOUPLOAD);
    },

    onmd5progress: function (percent) {
        console.log(percent);

        this.model.get("currentFile").state = "md5progress";
        this.model.get("currentFile").md5Percent = percent;
        this.controler.update();
    },

    onload: function (e) {
        var target = e ? e.target : {};
        console.log(this.currentFile.name + "上传成功！");
        console.log("分布式响应文本：" + target.responseText || "获取断点信息时，发现之前已上传完成了该文件");

        this.uploading = false;

        this.model.get("currentFile").state = "complete";
        this.model.get("currentFile").responseText = target.responseText || true;
        this.controler.update();
    },

    onerror: function(){
        this.model.get("currentFile").state = "error";
        this.model.get("currentFile").isContinueUpload = true;
        this.controler.update();
        this.uploading = false;

        var errTxt = "fileName:" + this.model.get("currentFile").name;
        this.model.errLogByHtml5(errTxt);
    },

    onabort: function(){
        this.xhr.abort();
    },

    oncancel: function(){
        var errTxt = "中断上传！";
        this.model.errLogByHtml5(errTxt);
    },

    ontimeout: function(){
        var errTxt = "ontimeout";
        this.model.errLogByHtml5(errTxt);
    },

    onreadystatechange: function (xhr) {
        if (xhr.readyState === 4) {
            if (xhr.status == 0) {
                this.errorHandler();
            }
        }
    },

    errorHandler: function(){
        if (!this.model.get("isStop")) {//没有点暂停，就是网络中断
            this.controler.monitorToResume();

            var errTxt = "fileName:" + this.model.get("currentFile").name + "|error:网络断开了！";
            this.model.errLogByHtml5(errTxt);
        }
    },

    storeBusinessId: function (businessId) {
        this.currentFile[businessId] = businessId;
    },

    getFileMd5: function (callback) {
        this.timeBegin = new Date;
        this.uploading = true;

        var output = [],
            worker,
            file_id = 1;

        var md5WorkUrl = this.controler.config.resourceUrlForMd5 + "/calculator.worker.md5.js";

        output.push('<tr>', '<td>MD5</td><td> <div class="progress progress-striped active" style="margin-bottom: 0px" id="md5_file_hash_', file_id, '"><div class="bar"></div></div></td></tr>');
        worker = new Worker(md5WorkUrl);
        worker.addEventListener('message', this.handle_worker_event("md5_file_hash_" + file_id, callback));

        this.hash_file(this.currentFile, worker);

        //document.getElementById('list').innerHTML = '<table class="table table-striped table-hover">' + output.join('') + '</table>' + document.getElementById('list').innerHTML;
    },

    hash_file: function (file, worker) {
        var i, buffer_size, block, threads, reader, blob;
        var self = this;

        var handle_load_block = function (event) {
            threads += 1;
            worker.postMessage({
                'message':event.target.result,
                'block':block
            });
        };

        var handle_hash_block = function (event) {
            threads -= 1;

            if (threads === 0) {
                if (block.end !== file.size) {
                    block.start += buffer_size;
                    block.end += buffer_size;

                    if (block.end > file.size) {
                        block.end = file.size;
                    }
                    reader = new FileReader();
                    reader.onload = handle_load_block;
                    blob = self.fileSlice(file, block.start, block.end);

                    reader.readAsArrayBuffer(blob);
                }
            }
        };
        buffer_size = 64 * 16 * 1024;
        block = {
            'file_size':file.size,
            'start':0
        };

        block.end = buffer_size > file.size ? file.size : buffer_size;
        threads = 0;

        worker.addEventListener('message', handle_hash_block);
        reader = new FileReader();
        reader.onload = handle_load_block;
        blob = this.fileSlice(file, block.start, block.end);

        reader.readAsArrayBuffer(blob);
    },

    handle_worker_event: function (id, callback) {
        var self = this;

        return function (event) {
            var doc = document;
            var fileHashEle = doc.getElementById(id);
            if (event.data.result) {
                console.log(Math.round(((new Date).getTime() - self.timeBegin.getTime()) / 1000));
                callback && callback(event.data.result);
            } else {
                self.onmd5progress(Math.floor(event.data.block.end * 100 / event.data.block.file_size) + "%");
            }
        };
    },

    getSpeed: function (loadedSize) {
        var progressData = this.progressData;
        var nowTime = (new Date).getTime();
        var speed = 0;

        if (progressData.endTime !== 0) {
            speed = Math.round((loadedSize - progressData.loadedSize) / ((nowTime - progressData.endTime) / 1000));
            speed = Math.abs(speed);//续传做一下容错，将负值转换成正值，虽然瞬时速度值不对，但不影响
        }

        progressData.endTime = nowTime;
        progressData.loadedSize = loadedSize;

        return speed;
    },

    fileSlice: function (file, sendSize, end) {
        var type = file.type;

        if (file.slice) {
            return file.slice(sendSize, end, type);
        } else if (file.webkitSlice) {
            return file.webkitSlice(sendSize, end, type);
        } else if (file.mozSlice) {
            return file.mozSlice(sendSize, end, type);
        }
    }
});

﻿/*
 * flash上传方式
 */


window.insertFlashCode=function(options){ //用于解决flash崩溃问题
    var url = "/m2012/flash/muti_upload_v2.swf?name=InstanceUpload&rnd="+Math.random();
    /*var btnId=(options && options.btnUploadId) || "floatLoadDiv";
 
	var btn = null;
        if(typeof(btnId) == "string"){
			btn = $("#"+btnId);
		}else{
			btn = $(btnId);
		}*/
    var btn = $("#floatLoadDiv");
    if (options.containerWindow) {
        btn = options.containerWindow.$("#floatLoadDiv");
    }
    var width = btn.width(); var height = btn.height() + 4;
    btn.html("");

    var so = new SWFObject(url, "flashplayer", width, height);
    so.addParam("wmode", "transparent");
    //console.warn("insert flash,window.isCabinet:" + window.isCabinet);
    so.write(btn);
    /*
    if (window.isCabinet) {
        so.write(btn);
    } else {
        so.write("#floatLoadDiv");
    }*/


    if (window.isMcloud == "1") { //彩云用户
        M139.Timing.waitForReady("document.getElementById(\"flashplayer\").setOptions",function () {
            document.getElementById("flashplayer").setOptions({ paramType: ["header"] });
        });
    }
}
var FlashUpload = Backbone.View.extend({
    progressData: {//每个时间点发送文件大小
        endTime             : 0,
        loadedSize          : 0
    },
    initialize: function (options) {
        this.model = options.model;
        this.subModel = options.subModel;
        this.controler = options.controler;

        window.isMcloud=this.controler.isMcloud;

        window.insertFlashCode(options);

    },
    getFlashObj: function () {
        if (window.isCabinet) {
            return window.parent.document.getElementById("flashplayer");
        }
        return document.getElementById("flashplayer");
    },
    onabort: function () {//暂停

        this.getFlashObj().pause()
    },
    upload: function (args) {

        var arr = args.ranges.replace(";", "").split("-");
        var start = Number(arr[1] + 1);
        this.getFlashObj().uploadResume();
    },
    //设置当前上传文件
    setCurrentFile: function (clientTaskno) {
        //this.instanceUpload.setCurrentFile(clientTaskno);
        //this.model.set("currentFile", this.dataTranslate(args));
    },
    setFileList: function (args) {
        var uploadQueue = [];
        for (var i = 0; i < args.length; i++) {
            var item = args[i];
            if (item.state == 1) {
                uploadQueue.push({ taskId: item.clientTaskno ,fileName:name});
            }
        }
        this.getFlashObj().setUploadQueue(uploadQueue);
        
    },
    setFileType:function (type) {
        var newType = "all files(*.*)|*.*||";

        if (type == "image") {
            newType = "image files(*.bmp;*.gif;*.ico;*.jpg;*.jpeg;*.png;*.tif;*.tiff)|*.bmp;*.gif;*.ico;*.jpg;*.jpeg;*.png;*.tif;*.tiff||";
        } else if (type == "music") {
            newType = "music files(*.mid;*.wma;*.wav;*.mp3;*.cda)|*.mid;*.wma;*.wav;*.mp3;*.cda||";
        }

        this.getFlashObj().setOptions({fileFilter:[newType]});
    },
    setExtData: function (param) {
        //js中obj是引用型的，已经在外部扩展了参数，不需要再处理了。
    },
    getCurrentFileParam:function(key,map){
        return map[key];
    },
    getFileInfo: function () {
        var fileInfo = this.getFlashObj().getFileInfo();
        var c = this.model.get("currentFile");
        fileInfo.businessId = c.businessId;
        return this.dataTranslate(fileInfo)
    },
    onselect: function (args) {
        console.log(args);
        this.model.uploadClickBehavior(this.controler);

        var data = [];
        for (var i = 0; i < args.length; i++) {
            data.push({
                clientTaskno: args[i].taskId,
                name: decodeURIComponent(args[i].fileName),
                size: args[i].fileSize
            });
        }
        this.controler.trigger("select", { fileList: data })
    },
    onloadfile: function (args) {
        this.setCurrentFileData(this.dataTranslate(args));
        this.model.trigger("getFileMd5");
    },
    getFileMd5:function () {//防止报错
    },
    onfilemd5: function (args) {
        //alert("md5:" + args.fileMd5);

        this.model.set("currentFile", this.dataTranslate(args));
        this.model.get("currentFile").state = "loadstart";
        this.controler.update();

        //之后要把上传相关的业务代码移出去
        var data = {
            name: decodeURIComponent(args.fileName),
            size: args.fileSize,
            fileMd5: args.fileMd5
        };

        var reqData = {};
        if (this.subModel && this.subModel.get("curDirId") != undefined) {//彩云上传
            reqData.directoryId = this.subModel.get("curDirId");
            reqData.dirType = this.subModel.getDirTypeForServer();
        }

        var self = this;
        this.model.getUploadKey(data, function (result) {
            function setFileData(result) { 
                var currentFile= self.model.get("currentFile");
                for (var elem in result) {
                    currentFile[elem] = result[elem];
                }

                currentFile.businessId = result.businessId; //服务端返回的fileId赋值
                currentFile.uploadTaskID = result.uploadTaskID; //服务端返回的uploadTaskID赋值
            }
            if (result.success) {
                if (result.status == "0") { //文件未上传过
                    //var currentFile = self.model.getFileInfo();
                    self.dataTranslate(args);
                    setFileData(result);
                    var url = result["urlUpload"];
                    var param = result["dataUpload"];
                    self.getFlashObj().setUploadUrl(url);
                    self.uploadOptions = param;
                    self.getFlashObj().uploadRequest(param);
                } else if (result.status == "1") {//单副本，直接完成

                    //self.dataTranslate(args);
                    self.dataTranslate(args);
                    setFileData(result);

                    //self.model.trigger("complete");
                    self.uploading = false;
                    self.model.get("currentFile").state = "complete";
                    self.model.get("currentFile").responseText = true;
                    self.controler.update();

                    self.getFlashObj().uploadNext();
                }
            } else {
                var errorMsg = "上传初始化失败，请重试";
                if (result.response && result.response.summary) {
                    errorMsg = result.response.summary;
                }
                $Msg.alert(errorMsg);
            }
        }, reqData);
    },
    setCurrentFileData:function(options){
        var currentFile = this.model.get("currentFile");
        $.extend(currentFile, options);
    },
    dataTranslate: function (args) {
        var data = {
            clientTaskno: args.taskId,
            name: decodeURIComponent(args.fileName),
            size: args.fileSize,
            sendSize: args.bytesLoaded,
            totalSize: args.bytesTotal
            //speed: args.speed,
            //surplusTime: args.surplusTime
        };

        if (args.bytesLoaded) {
            var speed = this.getSpeed(args.bytesLoaded);
            var surplusTime = speed == 0 ? 0 : (args.bytesTotal - args.bytesLoaded) / speed;

            data.speed = top.M139.Text.Utils.getFileSizeText(speed) + "/S";
            data.surplusTime = this.model.transformTime(surplusTime);
        }

        if (this.model.get("currentFile").businessId) {
            data.businessId = this.model.get("currentFile").businessId;
            data.uploadTaskID = this.model.get("currentFile").uploadTaskID;
        }

        return data;
    },
    onprogress: function (args) {
        this.setCurrentFileData(this.dataTranslate(args));
        
        this.model.trigger("progress");
    },
    oncomplete: function (args) {
        
        this.setCurrentFileData(this.dataTranslate(args));
        this.uploading = false;
        this.model.get("currentFile").state = "complete";
        this.model.get("currentFile").responseText = args.data;
        this.controler.update();
    },
    onrequest: function (args) {
        var range =  args.offset + "-" + (Number(args.offset) + Number(args.length) - 1).toString();
        if (this.controler.isMcloud == "1") { //彩云用户

            this.uploadOptions["x-Range"] = "bytes=" + range;
            this.uploadOptions["x-NameCoding"] = "urlencoding";
        } else {
            this.uploadOptions["range"] = range;
        }
        return this.uploadOptions;
    },
    onerror: function (args) {
        this.monitorToResume();

        var errTxt = "fileName:" + this.model.get("currentFile").name + "|error:" + args.error;
        this.model.errLogByFlash(errTxt);
        
    },
    monitorToResume: function () {
        var self = this;
        var fileInfo=this.model.get("currentFile");
        var businessId = fileInfo.businessId;
        var uploadTaskID = fileInfo.uploadTaskID;
        if (!this.monitorIntervalId) { //避免上传接口异常时多次执行
            this.monitorIntervalId = setInterval(function () { //每隔3秒检测网络
                self.model.getBreakpointKey(businessId, uploadTaskID,function (result) {
                    if (result && result["dataUpload"]) {
                        clearInterval(self.monitorIntervalId);
                        self.monitorIntervalId = null;
                        self.upload(result["dataUpload"]);
                    }
                });
            }, 5000);
        }
    },
    getSpeed: function (loadedSize) {
        var progressData = this.progressData;
        var nowTime = (new Date).getTime();
        var speed = 0;

        if (progressData.endTime !== 0) {
            speed = Math.round((loadedSize - progressData.loadedSize) / ((nowTime - progressData.endTime) / 1000));
            speed = Math.abs(speed);//续传做一下容错，将负值转换成正值，虽然瞬时速度值不对，但不影响
        }

        progressData.endTime = nowTime;
        progressData.loadedSize = loadedSize;

        return speed;
    }
});

 function SWFObject(swf, id, w, h, ver, c){
	this.params = new Object();
	this.variables = new Object();
	this.attributes = new Object();
	this.setAttribute("id",id);
	this.setAttribute("name",id);
	this.setAttribute("width",w);
	this.setAttribute("height",h);
	this.setAttribute("swf",swf);	
	this.setAttribute("classid","clsid:D27CDB6E-AE6D-11cf-96B8-444553540000");
	if(ver)this.setAttribute("version",ver);
	if(c)this.addParam("bgcolor",c);
}
SWFObject.prototype.addParam = function(key,value){
	this.params[key] = value;
}
SWFObject.prototype.getParam = function(key){
	return this.params[key];
}
SWFObject.prototype.addVariable = function(key,value){
	this.variables[key] = value;
}
SWFObject.prototype.getVariable = function(key){
	return this.variables[key];
}
SWFObject.prototype.setAttribute = function(key,value){
	this.attributes[key] = value;
}
SWFObject.prototype.getAttribute = function(key){
	return this.attributes[key];
}
SWFObject.prototype.getVariablePairs = function(){
	var variablePairs = new Array();
	for(key in this.variables){
		variablePairs.push(key +"="+ this.variables[key]);
	}
	return variablePairs;
}
SWFObject.prototype.getHTML = function(){
	var con = '';
	if (navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) {
		con += '<embed class="flash" type="application/x-shockwave-flash"  pluginspage="http://www.macromedia.com/go/getflashplayer" src="'+ this.getAttribute('swf') +'" width="'+ this.getAttribute('width') +'" height="'+ this.getAttribute('height') +'"';
		con += ' id="'+ this.getAttribute('id') +'" name="'+ this.getAttribute('id') +'" ';
		for(var key in this.params){ 
			con += [key] +'="'+ this.params[key] +'" '; 
		}
		var pairs = this.getVariablePairs().join("&");
		if (pairs.length > 0){ 
			con += 'flashvars="'+ pairs +'"'; 
		}
		con += '/>';
	}else{
		con = '<object class="flash" id="'+ this.getAttribute('id') +'" classid="'+ this.getAttribute('classid') +'"  codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=11,0,0,0" width="'+ this.getAttribute('width') +'" height="'+ this.getAttribute('height') +'">';
		con += '<param name="movie" value="'+ this.getAttribute('swf') +'" />';
		for(var key in this.params) {
		 con += '<param name="'+ key +'" value="'+ this.params[key] +'" />';
		}
		var pairs = this.getVariablePairs().join("&");
		if(pairs.length > 0) {con += '<param name="flashvars" value="'+ pairs +'" />';}
		con += "</object>";
	}
	return con;
}
SWFObject.prototype.write = function(elementId){	
	if(typeof elementId == 'undefined'){
		document.write(this.getHTML());
	}else{
	    var n = document.getElementById(elementId);
	    //n.innerHTML = this.getHTML();
	    if (!n) {
	        n = $(elementId);
	    }
	    $(n).append(this.getHTML());
	}
}
/*
 * html5方式上传
 */
var ActivexUpload = function (options) {
    this.perSize        = "";
    this.fileNamePre    = "";
    this.btnUploadEle   = {};//上传文件按钮

    this.files          = [];//上传文件队列
    this.currentFile    = {};//当前上传的文件
    this.randomNumbers  = {};

    this.fileTypeUpload = "*.*";//当前容许上传文件类型

    this.progressData   = {//每个时间点发送文件大小
        endTime         : 0
    };

    this.init(options);
};

ActivexUpload.include = function (o) {
    var included = o.included;
    for (var i in o) this.prototype[i] = o[i];
    included && included();
};

ActivexUpload.include({
    init:function (options) {
        this.initParams(options);
        this.bindEvent();
    },

    initParams:function (options) {
        this.controler = options.controler;
        this.model = options.model;

        this.fileNamePre = options.fileNamePre || "filedata";
        this.perSize = options.perSize || 1024 * 50;
        this.btnUploadId = options.btnUploadId;
    },

    bindEvent: function(){
        var self = this;

        this.registerControlEvent();

    //    this.btnUploadEle = $("#" + this.btnUploadId).hide().next();
		
        if(typeof(this.btnUploadId) == "string"){
			this.btnUploadEle = $("#" + this.btnUploadId).hide().next();
		}else{
			this.btnUploadEle = $(this.btnUploadId).hide().next();
		}

        this.btnUploadEle.click(function(){
	//	debugger;
            try {
                var activeUpload = new ActiveXObject("ExCxdndCtrl.ExUpload");
                if (activeUpload && activeUpload.getversion() >= 66816) {
                   self.openSelectFileDialog();
                } else {
					//提示升级 self.model.showInstallActivex({isInstall : false});
                    self.model.showInstallActivex(self.btnUploadEle);
                }
            } catch (ex) {
				//提示安装
                // self.model.showInstallActivex(self.btnUploadEle);
			//	top.$Msg.alert("139邮箱小工具安装失败，有可能是浏览器插件冲突导致，请升级或使用其他浏览器进行操作！");
				self.model.showInstallActivex({isInstall : true});
            }
            self.model.uploadClickBehavior(self.controler);
        }).show();
    },

    registerControlEvent: function () {
        var div = document.createElement("div");

        div.style.cssText = "width:1px;height:0px;overflow:hidden;";
        div.innerHTML = this.getUploadControlHtml();
        document.body.appendChild(div);
        window.uploadControl = document.getElementById("cxdndctrl");
        try {
            window.uploadControl.setuserid(top.UserData.userNumber);//todo 新方法
        } catch (ex) {
            console.log(ex);
        }
    },

    setFileType: function (type) {
        var newType = "all files(*.*)|*.*||";

        if (type == "image") {
            newType = "image files(*.bmp;*.gif;*.ico;*.jpg;*.jpeg;*.png;*.tif;*.tiff)|*.bmp;*.gif;*.ico;*.jpg;*.jpeg;*.png;*.tif;*.tiff||";
        } else if (type == "music") {
            newType = "music files(*.mid;*.wma;*.wav;*.mp3;*.cda)|*.mid;*.wma;*.wav;*.mp3;*.cda||";
        }

        this.fileTypeUpload = newType;
    },

    openSelectFileDialog: function () {
        uploadControl.getopenfilename(this.fileTypeUpload, "选择文件");
    },

    getFilesUpload: function(){
        var files = uploadControl.getfilelist();

        return top.$Xml.xml2object(files);
    },

    setFileList: function (fileList) {
        var fileListXml = ["<array>"];

        for (var i = 0, len = fileList.length; i < len; i++) {
            fileListXml.push("<object>" + top.$Xml.obj2xml2(fileList[i]) + "</object>");
        }

        fileListXml.push("</array>");

        fileListXml = fileListXml.join("");

        uploadControl.setfilelist(fileListXml);
    },

    getFileInfo: function(){
        this.currentFile = top.$Xml.xml2object(uploadControl.getfileinfo());

        return this.currentFile;
    },

    getFileMd5: function (callback) {
        var fileMd5 = uploadControl.getfilemd5();

        callback && callback(fileMd5);
    },

    upload: function (dataUpload) {
        var newDataUpload = this.getNewDataUplod(dataUpload);
        var data = "<parameters>" + top.$Xml.obj2xml2(newDataUpload) + "</parameters>";

        console.log(data);
        uploadControl.uploadex(data);
    },

    //重新组装控件需要的数据
    getNewDataUplod: function (dataUpload) {
        var currentFile = this.model.get("currentFile");
        dataUpload.resumetransmit = 0;

        dataUpload.ranges && (dataUpload.resumetransmit = 1);
        dataUpload.ver = uploadControl.getversion() >= 196867 ? 2 : 1;
        delete dataUpload.businessId;

        dataUpload.fastuploadurl = dataUpload.urlUpload;
        delete dataUpload.urlUpload;

        dataUpload.browsertype = this.getBrowserType();

        //由于控件内部设计的原因需要这些参数
        if (dataUpload.isMcloud == "1") {
            dataUpload.filesize = currentFile.size;
            dataUpload.ssoid = top.sid;
            dataUpload.filemd5 = currentFile.fileMd5;
            dataUpload.filename = currentFile.name;
            //控件需要以下参数
            dataUpload.fileid = dataUpload.UploadtaskID;
            dataUpload["Content-Type"] = "application/octet-stream;name=" + currentFile.name;
            dataUpload["Content-Length"] = dataUpload["contentSize"] = currentFile.size;
        }

        return dataUpload;
    },

    setCurrentFile: function (clientTaskno) {
        uploadControl.setcurrentfile(clientTaskno.toString());
    },

    setExtData: function (param) {
        uploadControl.setextdata(M139.JSON.stringify(param));
    },

    getCurrentFileParam: function (key, currentFile) {
        var extData = currentFile.extdata;
        var value = "";

        if (extData) {
            try {
                extData = eval("(" + extData + ")");
                value = extData[key] || "";
            } catch (ex) {
                value = "";
            }
        }

        return value;
    },

    //验证控件是否可以接受return对象
    onselect: function (fileList) {
        console.log(fileList);

        var filesObj = top.$Xml.xml2object(fileList);

        if (!filesObj) return;//未选择文件

        var files = filesObj.object;
        !files.length && (files = [files]);

        this.controler.trigger("select", {fileList: files});
    },

    onprepareupload: function(){
        this.model.get("currentFile").state = "prepareupload";
        this.controler.update();
    },

    onloadstart: function (clientTaskno) {
        this.model.get("currentFile").state = "loadstart";
        this.controler.update();
    },

    onprogress: function (clientTaskno, progress, uploadSize, times) {
        var speed = Math.ceil(progress / (times || 1));
        var surplusTime = Math.round((this.currentFile.size - progress) / speed);

        console.log("文件已上传大小：" + progress);
        console.log("本次上传所用时间：" + times);
        console.log("剩余大小：" + (this.currentFile.size - progress));
        console.log("速度：" + speed);
        console.log("剩余时间：" + surplusTime);

        this.model.get("currentFile").state = "progress";
        this.model.get("currentFile").sendSize = progress;
        this.model.get("currentFile").totalSize = this.currentFile.size;
        this.model.get("currentFile").speed = top.M139.Text.Utils.getFileSizeText(speed) + "/S";
        this.model.get("currentFile").surplusTime = this.model.transformTime(surplusTime);
        this.controler.update();
    },

    oncomplete: function (clientTaskno, responseTxt) {
        console.log(this.currentFile.name + " upload complete.");

        this.model.get("currentFile").state = "complete";
        this.model.get("currentFile").responseText = responseTxt;
        this.controler.update();
    },

    onerror: function (clientTaskno, state) {
        var isContinueUpload = state == "unknownerror" ? true : false;

        this.model.get("currentFile").state = "error";
        this.model.get("currentFile").isContinueUpload = isContinueUpload;
        this.controler.update();
    },

    onabort: function (clientTaskno, result, fileIdOfServer) {
        console.log("暂停上传文件clientTaskno：" + clientTaskno);
        uploadControl.stop(clientTaskno.toString());
    },

    onstop: function (clientTaskno, result, fileIdOfServer) {
        console.log("onStop:" + [clientTaskno, result, fileIdOfServer].join(","));

        var resultState = {
            "0": "success",
            "1": "stopped",
            "2": "unknownerror",
            "3": "virus",
            "10004": "sourceFileDeleted"//源文件已被移动、删掉或者修改
        };
        var state = resultState[result] || resultState[2]; //不在范围内，默认为2

        if (state == "unknownerror" || (state == "virus")) {
            this.onerror(clientTaskno, state);
        } else if (state == "sourceFileDeleted") {
            this.model.get("currentFile").state = "error";
            this.model.get("currentFile").summary = this.model.msg["SOURCE_FILE_DELETED"];
            this.controler.update();
        }
    },

    onlog: function (logText) {
        console.log(logText);
        this.model.errLogByActivex(logText);
    },

    //获取文件随机标示
    getRandomFileMark: function () {
        var rnd = parseInt(Math.random() * 100000000);
        var randomNumbers = this.randomNumbers;

        if (randomNumbers[rnd]) {
            return arguments.callee();
        } else {
            randomNumbers[rnd] = true;
            return rnd;
        }
    },

    getUploadControlHtml: function () {
        var htmlCode =
            '<script language="javascript" type="text/javascript" for="cxdndctrl" event="onselect(fileList)">\
                InstanceUpload.onselect(fileList);\
            </script>\
            <script language="javascript" type="text/javascript" for="cxdndctrl" event="onprepareupload()">\
                InstanceUpload.onprepareupload();\
            </script>\
            <script language="javascript" type="text/javascript" for="cxdndctrl" event="onstart(clientTaskno)">\
                InstanceUpload.onloadstart(clientTaskno);\
            </script>\
            <script language="javascript" type="text/javascript" for="cxdndctrl" event="onprogress(clientTaskno, progress, uploadsize, times)">\
                InstanceUpload.onprogress(clientTaskno, progress, uploadsize, times);\
            </script>\
            <script language="javascript" type="text/javascript" for="cxdndctrl" event="oncomplete(clientTaskno, responseTxt)">\
                InstanceUpload.oncomplete(clientTaskno, responseTxt);\
            </script>\
            <script language="javascript" type="text/javascript" for="cxdndctrl" event="onstop(clientTaskno, result, fileIdOfServer)">\
                InstanceUpload.onstop(clientTaskno, result, fileIdOfServer);\
            </script>\
            <script language="javascript" type="text/javascript" for="cxdndctrl" event="onlog(logText)">\
                InstanceUpload.onlog(logText);\
            </script>';

        if (document.all) {
            htmlCode += '<object id="cxdndctrl" classid="CLSID:A4EA13AA-D1C9-44CE-B372-D073554256DF"></object>';
        } else {
            htmlCode += '<embed id="cxdndctrl" type="application/x-richinfo-cxdnd3" height="1" width="1"></embed>';
            setTimeout(function(){
                onselect = function(fileList){
                    InstanceUpload.onselect(fileList);
                };
                onprepareupload = function(){
                    InstanceUpload.onprepareupload();
                };
                onstart = function (clientTaskno) {
                    InstanceUpload.onloadstart(clientTaskno);
                };
                onprogress = function (clientTaskno, progress, uploadsize, times) {
                    InstanceUpload.onprogress(clientTaskno, progress, uploadsize, times);
                };
                oncomplete = function (clientTaskno, responseTxt) {
                    InstanceUpload.oncomplete(clientTaskno, responseTxt);
                };
                onstop = function (clientTaskno, result, fileIdOfServer) {
                    InstanceUpload.onstop(clientTaskno, result, fileIdOfServer);
                };
                onlog = function (logText) {
                    console.log(logText);
                    InstanceUpload.model.errLogByActivex(logText);
                };
            }, 500);
        }

        return htmlCode;
    },

    getBrowserType: function(){
        var mybrowsetype = 200;

        if ($.browser.msie) {
            mybrowsetype = 0;
        } else if (window.navigator.userAgent.indexOf("Firefox") >= 0) {
            mybrowsetype = 151;

            if (/Firefox\/(?:[4-9]|3\.[0-3])/.test(navigator.userAgent)) {//3.6.3及以前
                mybrowsetype = 150;
            }
        }

        return mybrowsetype;
    }
});

﻿(function () {
    M139.core.namespace("M139.Plugin.ScreenControl", {
    	/**
		 * 安装截屏控件是否成功
		 * <pre>示例：<br>
		 * <br>Utils.isScreenControlSetup(ture,true);
		 * </pre>
		 * @param {Boolean} showTip 可选参数，是否显示提示消息。
		 * @param {Boolean} cacheResult 是否使用父级窗口控件。
		 * @return{true|false}
		 */
		isScreenControlSetup : function(showTip, cacheResult, isShowDialog) {
		    if (isShowDialog) return showDialog();
		    if (top.isScreenControlSetup != undefined && cacheResult) {
		        return top.isScreenControlSetup;
		    }
		    //if (!$B.is.ie) {
		        //if (showTip) alert("截屏功能仅能在IE浏览器下使用");
		        //return false;
		    //}
			if (window.navigator.platform == "Win64") { //64位浏览器暂时不支持139小工具
		        if (showTip) alert("当前浏览器暂不支持安装139邮箱小工具");
		        return false;
		    }
            if(!$B.is.windows){ //非windows系统不支持139小工具
                if (showTip) alert("当前操作系统暂不支持安装139邮箱小工具");
                return false;
            }
            
		    var setup = false;
		    try {
		        if (window.ActiveXObject !== undefined) { //ie11下 window.ActiveXObject ==undefined   !==undefined
		            var obj = new ActiveXObject("ScreenSnapshotCtrl.ScreenSnapshot.1");
		            if (obj) setup = true;
		        } else if (navigator.mimeTypes) {
		            var mimetype = navigator.mimeTypes["application/x-richinfo-screensnaphot"];
		            if (mimetype && mimetype.enabledPlugin) {
		                setup = true;
		            }
		        }
		    } catch (e) {
		
		    }
		    if (!setup && showTip) {
		        //___openWin("使用截屏功能必须安装139邮箱控件,是否安装?");
		        showDialog();
		    } else if (setup && showTip && top.SiteConfig.screenControlVersion && document.all) {
		        var version = obj.GetVersion();
		        if (version < top.SiteConfig.screenControlVersion || (location.host.indexOf("10086") >= 0 && version == 16777477)) {
		            setup = false;
		            //___openWin("使用截屏功能必须安装139邮箱控件,是否安装?");
		            showDialog();
		        }
		    }
		    // todo
		    function showDialog() {
		        //var exeFileUrl = top.ucDomain + "/ControlUpdate/mail139_tool_setup.exe";
		        var exeFileUrl = top.LinkConfig.smallToolSetup.url;
		        var htmlCode = ['<div class="pl_15 pt_15 pr_15 pb_15">'
                                ,'<p class="c_666">安装139邮箱小工具后，您可以使用以下功能：</p>'
                                ,'<table class="mestip-tab"><tr>'
                                ,'<td width="40"><i class="mes-t-1"></i></td>'
                                ,'<td>上传<span class="c_009900 fw_b">2G </span>超大附件</td>'
                                ,'<td width="40"><i class="mes-t-2"></i></td>'
                                ,'<td>粘贴图片到正文<br>粘贴方式上传附件</td>'
                                ,'</tr><tr>'
                                ,'<td width="40"><i class="mes-t-4"></i></td>'
                                ,'<td>截屏</td>'
                                ,'<td width="40"><i class="mes-t-3"></i></td>'
                                ,'<td>鼠标右键快递文件</td>'
                                ,'</tr></table></div>'].join("");
		        top.$Msg.showHTML(htmlCode,
		        	function(){
		        		//M139.Plugin.ScreenControl.openControlDownload();
		        		top.$App.show("smallTool");
		        	},
		        	function(){
		        		window.open(exeFileUrl);
		        	},
		        	function(){
		        	},
		        	{
						dialogTitle:'139邮箱小工具安装提示',
				        buttons:['在线安装','下载安装','取消']
				    });
		    }
		    
		    delete obj;
		    top.isScreenControlSetup = setup;
		    return setup;
		},
		/**
		 * 打开使用控件下载的页面
		 * <pre>示例：<br>
		 * <br>Utils.openControlDownload(true);
		 * </pre>
		 * @param {Boolean} removeUploadproxy 可选参数，使用后是否移动窗口
		 */
		openControlDownload : function(removeUploadproxy) {
			// todo
			//top.ucDomain = 'http://' + location.host +  '/g2/';
			var urlDomain = '';
			if(top.ucDomain){
				urlDomain = top.ucDomain;
			}else{
				urlDomain = 'http://g2.mail.10086.cn';
			}
		    var win = window.open(urlDomain + "/LargeAttachments/html/control139.htm");
		    setTimeout(function() { win.focus(); }, 0);
		    //top.addBehavior("文件快递-客户端下载");
		    if (removeUploadproxy) {
		        removeUploadproxyWindow();
		    }
		},
		removeUploadproxyWindow : function(){
		    try{
		       // top.addBehavior("文件快递-客户端下载");
		        top.$("#uploadproxy").attr("src", "about:blank");
		        top.$("#uploadproxy").remove();
		    }catch(e){}
		}
    });
    
})();
/**
 * @fileOverview 定义文件快递暂存柜模型层
 */
(function(jQuery, Backbone, _, M139) {
	var $ = jQuery;
	M139.namespace("M2012.Fileexpress.Cabinet.Model", Backbone.Model.extend({
		defaults : {
			pageSize : 30,//每页显示文件数
			pageIndex : 1,//当前页
			listMode : 0,// 列表模式：0 列表 1 图标
			fileList : [],// 当前使用的数据
			imageList : [],// 当前页图片列表
			originalList : [],// 原始数据（过期时间排序）
			selectedFids : [],// 被选中的文件fid
			searchStatus : 0, // 搜索状态
			isBtnActivate : 1, // 按钮是否为激活状态（重命名按钮会使用该属性）
			isMailToolShow : 1, // 是否提示用户安装小工具
			maxLengthName : 255, // 文件名最大长度 
			sortType : 'fileUpload', // 排序类型 'fileName' 'fileUpload' 'fileExpire' 'downloadCount' 'fileSize'
			sortIndex : -1 // 当前排序状态  1 升序 -1 降序
		},
		commands : {// 定义工具栏所有命令
			UPLOAD : 'upload',
			DOWNLOAD : 'download',
			SEND_TO_MAIL : 'sendToMail', // 发送到邮箱
			SEND_TO_PHONE : 'sendToPhone', // 发送到手机
			RENEW : 'renew', // 续期
			SAVE_TO_DISK : 'saveToDisk', // 存彩云
			RENAME : 'rename', // 重命名
			DELETE_FILE : 'deleteFile'// 删除
		},
		sendTypes : {// 发送类型
			MAIL : 'mail', // 邮件
			MOBILE : 'mobile' // 手机
		},
		previewTypes : {// 预览类型
			IMAGE : 'image', // 图片，当前页面弹出遮罩层预览
			DOCUMENT : 'document'// 文档，新窗口预览
		},
		sortTypes : {// 排序类型
			FILE_NAME : 'fileName',
			CREATE_TIME : 'createTime', // 上传时间
			EXPIRY_DATE : 'expiryDate', // 有效时间
			DOWNLOAD_TIMES : 'downloadTimes', // 下载次数
			FILE_SIZE : 'fileSize' // 大小
		},
		fileClass : {
			IMAGE : 'viewPic',
		//	DOCUMENT : 'viewPicN'
			DOCUMENT : 'viewPic'
		},
		urls : {// 跳转到其它页面的URL
			SEND_URL : '/m2012/html/fileexpress/send.html?sid='+top.sid,
			PREVIEW_URL : '/m2012/html/onlinepreview/online_preview.html?src=disk&sid={0}&mo={1}&id={2}&dl={3}&fi={4}&skin={5}&resourcePath={6}&diskservice={7}&filesize={8}&disk={9}'
		},
		imagePath : '../../images/module/FileExtract/',
		previewSize : 1024 * 1024 * 20, // 预览支持的文件大小20M
		downloadSize : 1024 * 1024 * 500, // 打包下载限制为500M todo
		thumbnailSize : '80*90', // 缩略图尺寸
		documentExts : "doc/docx/pdf/txt/htm/html/ppt/pptx/xls/xlsx/rar/zip/7z", // 可预览的文档拓展名
		imageExts : "jpg/gif/png/ico/jfif/tiff/tif/bmp/jpeg/jpe", // 图片类拓展名
		tipWords : {
        	DELETE_FILE_NAME : '确定删除文件：{0}？', // 显示待删除文件名
        	DELETE_FILE_COUNT : '文件删除后接收方将无法下载，您确认删除这 {0} 个文件吗？', // 显示待删除文件数量
        	EMPTY_NAME: "文件名称不能为空",
        	OVER_NAME: "最大长度不能超过{0}个字符",
        	INVALID_NAME: "不能有以下特殊字符 \\/:*?\"<>|",
        	DELETE_SUC : "删除成功!",
        	RENEW_SUC : "文件续期成功!",
        	RENAME_SUC : "文件重命名成功!",
        	RENAME_FAI : "文件重命名失败!",
        	SET_SUC : '设置成功!',
        	SELECTED_EMPTY : '未选中任何文件!',
        	OVER_SIZE: "文件总大小已超过500M，无法批量下载！",
        	DOWNLOAD_WAITING : "请等待...",
            UPLOADING: "关闭暂存柜，当前正在上传的文件会失败，是否关闭？",
            UPLOADING_CHANGE_VIEW: "切换视图，当前正在上传的文件会失败，是否切换？",
            SELECTEDFILE_TO_MANY :"文件个数超出套餐限制，请重新选择",
            ONLY_RENAME_ONE:"只能对单个文件（夹）重命名。"
        },
		logger : new top.M139.Logger({
			name : "M2012.Fileexpress.Cabinet.Model"
		}),
		name : 'M2012.Fileexpress.Cabinet.Model',
		callApi : M139.RichMail.API.call,
		defaultInputValue : '搜索暂存柜', // 搜索框默认值
		serviceItem : '0017', // 20元版
		/**
		 *暂存柜公共代码
		 *@constructs M2012.Compose.Model.StorageCabinet
		 *@param {Object} options 初始化参数集
		 *@example
		 */
		initialize : function(options) {
			this.dataSource = {};// 接口返回的原始数据
		},
		//获取暂存柜文件
		getDataSource : function(callback) {
			var self = this;
			var data = {
				actionId : 0,
				imageSize : self.thumbnailSize
			};
			self.callApi("file:getFiles", data, function(res) {
				if(callback) {
					callback(res);
				}
			});
		},
		//设置提醒方式
		setTipMode : function(callback) {
			var self = this;
			self.callApi("file:setFiles", getData(), function(res) {
				if(callback) {
					callback(res);
				}
			});
			
			function getData(){
				var isEmail = $("#tipMail")[0].checked ? 1 : 0;
				var isMobile = $("#tipMobile")[0].checked ? 1 : 0;
				var data = {
					mobileRemind : isMobile,
					emailRemind : isEmail
				};
				return data;
			}
		},
		//删除文件,多个fid用逗号隔开
		deleteFiles : function(callback, ids) {
			var self = this;
			self.callApi("file:delFiles", getData(), function(res) {
				if(callback) {
					callback(res);
				}
			});
			
			function getData(){
				var data = {
					fileIds : ids
				};
				return data;
			}
		},
		//下载文件,多个fid用逗号隔开
		downloadFiles : function(callback, ids) {
			var self = this;
			self.callApi("file:preDownload", getData(), function(res) {
				if(callback) {
					callback(res);
				}
			});
			
			function getData(){
				var data = {
					fileIds : ids
				};
				return data;
			}
		},
		//文件续期,多个fid用逗号隔开
		renewFiles : function(callback, ids) {
			var self = this;
			self.callApi("file:continueFiles", getData(), function(res) {
				if(callback) {
					callback(res);
				}
			});
			
			function getData(){
				var data = {
					fileIds : ids
				};
				return data;
			}
		},
		//重命名文件
		renameFile : function(callback, options) {
			var self = this;
			self.callApi("file:renameFiles", getData(), function(res) {
				if(callback) {
					callback(res);
				}
			});
			
			function getData(){
				var data = {
					fileId : options.fileId,
					name : options.name
				};
				return data;
			}
		},
		// 供 repeater 调用
		renderFunctions : {
			getFullFileName : function() {// 带拓展名
				var row = this.DataRow;
				return $T.Html.encode(row.fileName);
			},
			getShortFileName : function() {// 带拓展名
				var row = this.DataRow;
				var name = row.fileName;
				var point = name.lastIndexOf(".");
				if(point == -1 || name.length - point > 5){
					return $T.Html.encode(name.substring(0, 15)) + "…";
				}
				return $T.Html.encode(name.replace(/^(.{15}).*(\.[^.]+)$/, "$1…$2"));
				//return row.fileName.length > 20?row.fileName.substr(0, 20):row.fileName;
			},
			getFullName : function() {// 不带拓展名
				var row = this.DataRow;
				var name = row.fileName;
				var point = name.lastIndexOf(".");
				if(point == -1){
					return $T.Html.encode(name);
				}else{
					return $T.Html.encode(name.substring(0, point));
				}
			},
			getShortName : function(max){// 不带拓展名
				var row = this.DataRow;
				var name = row.fileName;
				var point = name.lastIndexOf(".");
				var keywords = $T.Html.encode($Url.getQueryObj()["keyword"]) || "";//从URL获取搜索的内容
				if(point != -1){
					name = name.substring(0, point);
				}
				if(name.length > max){
					name =  $T.Html.encode(name.substring(0, max)) + "…";
				}else{
					name =  $T.Html.encode(name);
				}
				//如果是来自搜索，替换搜索的关键字为红色
				if(keywords){
					name = name.replace(new RegExp("("+keywords+")"),"<font color='red'>$1</font>");
				}
				return name;
			},
			getExtendName : function(){// 仅返回拓展名
				var row = this.DataRow;
				var fileName = row.fileName;
				if(fileName.indexOf('.') == -1){
					return '';
				}
				
				var length = fileName.split(".").length;
            	return $T.Html.encode('.' + fileName.split(".")[length-1].toLowerCase());
			},
			getFileSize : function() {
				var row = this.DataRow;
				return $T.Utils.getFileSizeText(row.fileSize);
			},
			getFileIconClass : function() {
				var row = this.DataRow;
				return $T.Utils.getFileIcoClass2(0, row.fileName);
			},
			getThumbnailUrl : function(){
                var self = this;
                var row = this.DataRow;
                var model = self.dataModel;
				var thumbnailUrl = '';
				if(row.thumbnailImage && row.fileSize <= 1024 * 1024 * 6){
                	thumbnailUrl = row.thumbnailImage;
				//	thumbnailUrl = model.getThumbImagePath(row.fileName);
                }else{
                	thumbnailUrl = model.getThumbImagePath(row.fileName);
                }
                return thumbnailUrl;
			},
			getOperateHtml : function(){
				var self = this;
                var row = this.DataRow;
                var model = self.dataModel;
                return model.getOperateTemplate(row);
			},
			getPicClass : function(){
				var self = this;
                var row = this.DataRow;
                var model = self.dataModel;
                var fileName = row.fileName;
                if(model.isImage(fileName)){
                	return model.fileClass['IMAGE'];
                }else{
                	return model.fileClass['DOCUMENT'];
                }
			}
		},
		
		// 获取操作按钮html代码 todo
		getOperateTemplate : function(row){
			var self = this;
			var templates = {
				commonOperateTemplete : ['<a hideFocus="1" href="javascript:void(0)" name="download" fid="{fid}" target="_self">下载</a>',
										'<span>|</span>',
										'<a hideFocus="1" href="javascript:void(0)" name="send" fid="{fid}"> 发送 </a>',
										'<span>|</span>',
										'<a hideFocus="1" href="javascript:void(0)" name="renew" fid="{fid}"> 续期 </a>',
										'<span>|</span>',
										'<a hideFocus="1" href="javascript:void(0)" name="delete" fid="{fid}" fname="{shortFileName}"> 删除</a>'].join(""),
				errorOperateTemplete : ['<i class="i_warn_min"></i>',
						            '<span class="red">上传失败！</span>',
						            '<a hideFocus="1" href="javascript:void(0)" name="delete" fid="{fid}" fname="{shortFileName}">删除</a>'].join(""),
				commonIconTemplete : ['<p style="display:none;">',
										'<a hideFocus="1" href="javascript:void(0)" name="download" fid="{fid}" target="_self">下载</a>',
										'<span class="line">|</span>',
										'<a hideFocus="1" href="javascript:void(0)" name="send" fid="{fid}">发送</a>',
										'<span class="line">|</span>',
										'<a hideFocus="1" href="javascript:void(0)" name="renew" fid="{fid}">续期</a>',
										'<span class="line">|</span>',
										'<a hideFocus="1" href="javascript:void(0)" name="delete" fid="{fid}" fname="{shortFileName}">删除</a>',
									'</p>'].join(""),		            
				errorIconTemplete : ['<p class="gray failTips">',
							                '<i class="i_warn_min"></i>',
							                '<span class="red">上传失败！</span>',
							                '<a hideFocus="1" href="javascript:void(0)" name="delete" fid="{fid}" fname="{shortFileName}">删除</a>',
							            '</p>'].join("")		            
			};
			var mode = self.get('listMode');
            var isUploadSuccess = self.isUploadSuccess(row.fid);
			if(mode){
				if(!isUploadSuccess){
                	return $T.Utils.format(templates['errorIconTemplete'], {fid : row.fid, shortFileName : getShortFileName(row.fileName)});
                }else{
                	return $T.Utils.format(templates['commonIconTemplete'], {fid : row.fid, shortFileName : getShortFileName(row.fileName)});
                }
			}else{
				if(!isUploadSuccess){
                	return $T.Utils.format(templates['errorOperateTemplete'], {fid : row.fid, shortFileName : getShortFileName(row.fileName)});
                }else{
                	return $T.Utils.format(templates['commonOperateTemplete'], {fid : row.fid, shortFileName : getShortFileName(row.fileName)});
                }
			};
			
			function getShortFileName(name){
				var point = name.lastIndexOf(".");
				if(point == -1 || name.length - point > 5){
					return $T.Html.encode(name.substring(0, 15)) + "…";
				}
				return $T.Html.encode(name.replace(/^(.{15}).*(\.[^.]+)$/, "$1…$2"));
			}
		},
		
		// 过滤文件列表
		search : function(keywords) {
			var self = this;
			var files = self.get('originalList').concat();
			return $.grep(files, function(obj, i) {
				return obj.fileName.toLocaleLowerCase().indexOf(keywords.toLocaleLowerCase()) > -1;
			});
		},
		/*
		 * 表头排序
		 * @param options.field 排序字段
		 * @param options.fileList 排序数据源
		 * @return 排完序后的文件列表
		 */
		sort : function(options) {
			var self = this;
			//设置排序规则
			if(options.field) {
				var sorter = null;
				var sortIndex = self.get('sortIndex');
				switch (options.field) {
					case "fileSize":
						sorter = function(a, b) {
							return (a.fileSize - b.fileSize) * sortIndex;
						};
						break;
					case "fileName":
						sorter = function(a, b) {
							return (a.fileName.localeCompare(b.fileName)) * sortIndex;
						};
						break;
					case "remainTimes":
						sorter = function(a, b) {
							return (a.sendCount - b.sendCount) * sortIndex;
						};
						break;
					case "expiryDate":
						sorter = function(a, b) {
							return (a.expiryDate - b.expiryDate) * sortIndex;
						};
						break;
					case "createTime":
						sorter = function(a, b) {
							return ($Date.parse(a.createTime) - $Date.parse(b.createTime)) * sortIndex;
						};
						break;
					case "downloadTimes":
						sorter = function(a, b) {
							return (a.downloadTimes - b.downloadTimes) * sortIndex;
						};
						break;	
				}
				options.dataSource.sort(sorter);
			}
		},
		// 格式化过期时间
		formatExpireDate : function(dataSource) {
			$(dataSource).each(function() {
				if( typeof (this.expiryDate) == "string") {
					this.expiryDate = $Date.parse(this.expiryDate);
				}
			});
			return dataSource;
		},
		// 状态栏视图层模板相对应的对象，用户替换模板中的变量
		getStatusObj : function() {
			var self = this;
			var data = self.dataSource;
			var usedPercent = Math.ceil(data.usedSize / data.folderSize * 100);
			usedPercent = usedPercent > 100 ? 100 : usedPercent;
			var formatObj = {
				filesCount : data.fileList.length, // 文件数量
				usedPercent : usedPercent,
				usedSize : $T.Utils.getFileSizeText(data.usedSize),
				folderSize : $T.Utils.getFileSizeText(data.folderSize),
				keepDays : data.keepDays
			}
			return formatObj;
		},
		// 获取总页数
		getPageCount : function() {
			var messageCount = this.get('fileList').length;
			var result = Math.ceil(messageCount / this.get("pageSize"));
			if(result <= 0) {
				result = 1
			};//最小页数为1
			return result;
		},
		// 获取第N页的文件列表
		getPageData : function(nPage){
			var start = (nPage - 1) * this.get("pageSize");
			var end = 0;
			var pageCount = this.getPageCount();
			if(nPage < pageCount){
				end = start + this.get("pageSize");
			}else{
				end = this.get('fileList').length;
			}
			var pageData = this.get('fileList').slice(start, end);
			// this.setImageIndex(pageData); // 接口无法同时返回多张图片的下载地址，先做单张预览
			return pageData;
		},
		//  设置图片序数属性，方便图片预览 ，如果不是图片imageIndex赋值-1
		loadFileImageIndex : function(fileList){
			if(!fileList || !$.isArray(fileList)){
				return;
			}
			var self = this;
			var index = 0;
			$(fileList).each(function(i){
				var fileName = this.fileName;
				if(self.isImage(fileName)){
					this.imageIndex = index++;
					self.get('imageList').push(this);
				}else{
					this.imageIndex = -1;
				}
	   		});
		},
		// 判断用户是否安装邮箱小工具
		isSetupMailTool : function(){
			return M139.Plugin.ScreenControl.isScreenControlSetup();
		},
		//验证文件名
        getErrorMsg : function(name) {
        	var self = this;
            if (!name) {
                return self.tipWords['EMPTY_NAME'];
            }
            if (name.length > self.get('maxLengthName')) {
                return $T.Utils.format(self.tipWords['OVER_NAME'], [self.get('maxLengthName')]);
            }
            if (!self.isRightName(name)) {
                return self.tipWords['INVALID_NAME'];
            }
            return '';
        },
		//判断文件名是否正确
        isRightName: function(name) {
            var reg = /[*|:"<>?\\/]/;
            return !reg.test(name);
        },
		// 遍历数组，存在某项则删除，不存在则添加
		toggle : function(item, array){
			if(!item || !$.isArray(array)){
				return;
			}
			var index = $.inArray(item, array);
			if(index != -1){
				array.splice(index, 1);
			}else{
				array.push(item);
			}
		},
		// 根据fid清除数据
		clearFiles : function(fids, array){
			var self = this;
			if(!fids || !$.isArray(fids) || !$.isArray(array)){
				return;
			}
			$(fids).each(function(i){
				self.toggle(this, array);
			});
		},
		getResource : function () {
	        var resourcePath = window.top.resourcePath;
	        if (top.isRichmail) {//rm环境,返回rm变量
	            resourcePath = window.top.rmResourcePath;
	        }
	        return resourcePath;
	   },
	   // 获取用户选中的文件列表
	   getSelectedFiles : function(){
	   		var self = this;
	   		var files = [];
	   		var fileList = self.get('originalList');
	   		var selectedFids = self.get('selectedFids');
	   		$(fileList).each(function(i){
	   			var fid = this.fid;
	   			if($.inArray(fid, selectedFids) != -1){
	   				files.push(this);
	   			}
	   		});
	   		return files;
	   },
	   // 全选
	   selectAll : function(){
	   		var self = this;
	   		//var fileList = self.get('fileList');
	   		var fileList = self.getPageData(self.get("pageIndex"));
	   		var selectedFids = self.get('selectedFids');
	   		$(fileList).each(function(i){
	   			var fid = this.fid;
	   			if($.inArray(fid, selectedFids) == -1){
	   				if(self.isUploadSuccess(fid)){
						selectedFids.push(fid);
					}
	   			}
	   		});
	   },
	   // 全不选
	   selectNone : function(){
	   		var self = this;
	   		var fileList = self.getPageData(self.get("pageIndex"));
	   		var selectedFids = self.get('selectedFids');
	   		$(fileList).each(function(i){
	   			var fid = this.fid;
	   			var index = $.inArray(fid, selectedFids);
				if(index != -1){
					selectedFids.splice(index, 1);
				}
	   			
	   		});
	   },
	   // 判断当前页有没有文件被选中
	   hasFileSelected : function(){
	   		var self = this;
	   		var hasFile = false;
	   		var fileList = self.getPageData(self.get("pageIndex"));
	   		var selectedFids = self.get('selectedFids');
	   		$(fileList).each(function(i){
	   			var fid = this.fid;
	   			var index = $.inArray(fid, selectedFids);
				if(index != -1){
					hasFile = true;
					return false;
				}
	   		});
	   },
	   // 根据文件ID返回文件对象(从model中originalList获取)
	   getFileById : function(fid){
	   		if(!fid){
	   			return;
	   		}
	   		var self = this;
	   		var file = {};
	   		var originalList = self.get('originalList');
	   		$(originalList).each(function(i){
	   			var fileId = this.fid;
	   			if(fileId === fid){
	   				file = this;
	   				return false;
	   			}
	   		});
	   		return file;
	   },

        // 根据文件ID返回文件对象(从model中fileList获取)
        getFileByIdFromFileList : function(fid){
            if(!fid){
                return;
            }
            var self = this;
            var file = {};
            var fileList = self.get('fileList');
            $(fileList).each(function(i){
                var fileId = this.fid;
                if(fileId === fid){
                    file = this;
                    return false;
                }
            });
            return file;
        },

        //从model中fileList 及 originalList删除文件
        deleteFileFromModel: function (fid) {
            var originalList = this.get("originalList");
            var fileList = this.get("fileList");
            var curFileFromOriginalList = this.getFileById(fid);
            var curFileFromFileList = this.getFileByIdFromFileList(fid);

            console.log("originalList删除前有文件个数：" + originalList.length + "");
            console.log("fileList删除前有文件个数：" + originalList.length + "");
            this.toggle(curFileFromOriginalList, originalList);
            this.toggle(curFileFromFileList, fileList);
            console.log("originalList删除后有文件个数：" + originalList.length + "");
            console.log("fileList删除后有文件个数：" + originalList.length + "");
        },
	   
	   // 判断文件是否上传成功
	   isUploadSuccess : function(fid){
	   		var self = this;
	   		var fileObj = self.getFileById(fid);
	   		if(!fileObj){
	   			return false;
	   		}
	   		if(fileObj.state == '0'){ // 旧文件state 0 表示上传成功 ，新文件fileUploadSize == fileSize 表示上传成功
	   			return true;
	   		}
	   		
	   		var fileSize = parseInt(fileObj.fileSize, 10);
	   		var fileUploadSize = parseInt(fileObj.fileUploadSize, 10);
	   		return fileSize === fileUploadSize?true : false;
	   },
	   
	   // 根据文件ID返回文件名
	   getNameList : function(ids){
	   		if(!$.isArray(ids)){
	   			return;
	   		}
	   		var self = this;
	   		var names = [];
	   		for(var i = 0,len = ids.length;i < len;i++){
	   			var fileObj = self.getFileById(ids[i]);
	   			names.push(fileObj.fileName);
	   		}
	   		return names;
	   },
	   // 获取文件拓展名
	   getExtname : function(fileName) {
	        if (fileName) {
	            var reg = /\.([^.]+)$/;
	            var results = fileName.match(reg);
	            return results ? results[1].toLowerCase() : "";
	        } else {
	            return "";
	        }
	    },
	    // 判断文件是否超过预览支持的最大尺寸
	   isOverSize : function(fileSize){
	   		if(!fileSize){
	   			return;
	   		}
	   		var self = this;
	   		if(fileSize <= self.previewSize){
	   			return true;
	   		}else{
	   			return false;
	   		}
	   },
	    // 根据文件名获取预览类型 
	   getPreviewType : function(fileName){
	   		var self = this;
	   		var ext = self.getExtname(fileName);
	   		if(self.documentExts.indexOf(ext) != -1){
	   			return self.previewTypes['DOCUMENT'];
	   		}else if(self.imageExts.indexOf(ext) != -1){
	   			return self.previewTypes['IMAGE'];
	   		}
	   },
	   // 获取完整的附件预览地址模板
	   getPreviewUrlTemplate : function(){
			var self = this;
			return "http://" + top.location.host + self.urls['PREVIEW_URL'];
	   },
	   // 获取暂存柜允许上传的最大附件
	   getMaxUploadSize : function(){
	   		var maxSize = 1;
            if (top.SiteConfig.comboUpgrade) {
                maxSize = Math.floor(top.$User.getCapacity("maxannexsize") / 1024) || 4;
            }
            return maxSize;
	   },
	   // 根据文件名获取文件缩略图路径
	   getThumbImagePath : function(fileName){
	   		if(!fileName){
	   			return;
	   		}
	   		var self = this;
	   		var path = '';
	   		return self.imagePath + self.getThumbImageName(fileName);
	   },
	   // 根据文件名获取文件缩略图名称（非图片）
	   getThumbImageName : function(fileName){
	   		var doc = 'doc/docx',
	   			html = 'htm/html',
	   			ppt = 'ppt/pptx',
	   			xls = 'xls/xlsx',
	   			rar = 'rar/zip/7z',
				music = 'mp3/wma/wav/mod/m4a/',
				vedio = 'mp4,wmv,flv,rmvb,3gp,avi,mpg,mkv,asf,mov,rm',
	   			other = 'pdf/ai/cd/dvd/psd/fla/swf/txt/exe';
			var	img = 'bmp/jpeg/jpg/png/gif/tif';
	   		var extName = $T.Url.getFileExtName(fileName);
			if(extName == "") {
                    return 'default.png';
			}
			if(img.indexOf(extName) != -1){
				return 'jpg.png';
			}
			if("eml".indexOf(extName) != -1){
					return 'eml.png';
			}
	   		if(doc.indexOf(extName) != -1){
	   			return 'doc.png';
	   		}
	   		if(html.indexOf(extName) != -1){
	   			return 'html.png';
	   		}
	   		if(ppt.indexOf(extName) != -1){
	   			return 'ppt.png';
	   		}
	   		if(xls.indexOf(extName) != -1){
	   			return 'xls.png';
	   		}
	   		if(rar.indexOf(extName) != -1){
	   			return 'rar.png';
	   		}
			if(music.indexOf(extName) != -1){
                    return 'music.png';
			}
			if(vedio.indexOf(extName) != -1){
					return 'rmvb.png';
			}
	   		if(other.indexOf(extName) != -1){
	   			return extName + '.png';
	   		}
	   		return 'default.jpg';
	   },
	   // 根据文件名判断文件是否为图片(且支持预览)
	   isImage : function(fileName){
	   		if(!fileName){
	   			return;
	   		}
	   		var self = this;
	   		var extName = $T.Url.getFileExtName(fileName);
	   		return self.imageExts.indexOf(extName) == -1?false:true;
	   },
	   
	   // 获取用户选中的文件总容量
	   getSelectedFileSize : function(){
	   		var self = this;
	   		var selectedFiles = self.getSelectedFiles();
	   		var totalSize = 0;
	   		$(selectedFiles).each(function(i){
	   			var fid = this.fid;
	   			totalSize += parseInt(this.fileSize, 10);
	   		});
	   		return totalSize;
	   },
	   
	   // 判断用户选中的文件总大小是否支持打包下载
	   isSupportDownload : function(){
	   		var self = this;
	   		var selectedFiles = self.get('selectedFids');
	   		if(selectedFiles.length === 1){
	   			return true;
	   		}
	   		return self.getSelectedFileSize() > self.downloadSize?false : true;
	   },
	   popupComposeSmallPop: function(fileList){
			var self = this;
			var itemTemp = '<li rel="largeAttach" objId="{objId}" filetype="i_cloudS"><i class="i_bigAttachmentS"></i>\
					<span class="ml_5">{prefix}<span class="gray">{suffix}</span></span>\
					<span class="gray ml_5">({fileSizeText})<span class="tiquma pl_5 black" style="display:none;">提取码：{tiquma}</span></span>\
					<a hideFocus="1" class="ml_5" href="javascript:void(0)" removeLargeAttach="{objId}">删除</a></li>';
			if (fileList.length === 0) {
	            return ;
            }
			function getShortName(fileName) {
						if (fileName.length <= 30) return fileName;
						var point = fileName.lastIndexOf(".");
						if (point == -1 || fileName.length - point > 5) return fileName.substring(0, 28) + "…";
						return fileName.replace(/^(.{26}).*(\.[^.]+)$/, "$1…$2");
			}

					var mailfileList = fileList;
					var htmlCode = "";
					var firstFileName = "";
					
					firstFileName = mailfileList[0].fileName;
					for(t = 0 ; t < mailfileList.length; t++){
						var item = mailfileList[t];
						var shortName = getShortName(item.fileName),
							prefix = shortName.substring(0, shortName.lastIndexOf('.') + 1),
							suffix = shortName.substring(shortName.lastIndexOf('.') + 1, shortName.length);
						var data = {
								objId : item.fid,
								prefix: prefix,
								suffix: suffix,
								fileSizeText: M139.Text.Utils.getFileSizeText(item.fileSize),
								fileId: item.fid
						};
						htmlCode += top.$T.Utils.format(itemTemp, data);
					}	
					console.log(htmlCode);
					top.$Evocation.create({type: "compose", subject: "【139邮箱-暂存柜】" + firstFileName, content: "", whereFrom: "file", diskContent: htmlCode, fileContentJSON:mailfileList});
		},
	   // 跳转到文件发送页
	   gotoSendPage : function(options){
	   		var self = this;
			var fileList = options.fileList;
	   		var data = {
				fileList : fileList,
				type : options.type || self.sendTypes['MAIL'],
				from : "cabinet"
			};
		//	var url = self.urls['SEND_URL'];
        //    url = $cabinetApp.inputDataToUrl(url, data);
        //    location.href = url;
		//debugger;
			this.popupComposeSmallPop(fileList);
	   },
	   
	   // 判断用户是否为20元版
	   isServiceItem : function(){
	   		var self = this;
	   		return top.$User.getServiceItem() === self.serviceItem?true:false;
	   }
	}));
})(jQuery, Backbone, _, M139);

/**
 * @fileOverview 文件快递暂存柜状态栏视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Fileexpress.Cabinet.View.Statusbar', superClass.extend(
	/**
	 *@lends M2012.Fileexpress.Cabinet.View.prototype
	 */
	{
		el : "body",
		name : "M2012.Fileexpress.Cabinet.View.Statusbar",
		template : ['<div class="inboxHeaderfr clearfix">',
					    '<span class="mr_10">',
							'<span class="diskprogressBarBlue fr">',
								'<em class="growsBlow" style="width: {usedPercent}%;"></em>',
								'<em class="growFont">{usedSize}/{folderSize}</em>',
							'</span>',
							'<span class="fr"></span>',
						'</span>',
						'<span class="fl ml_10" id="navContainer">暂存柜容量：</span>',
					 '</div>'].join(""),
		template2 : ['<dl class="clearfix mt_15" id="">',
									'<dt><a href="javascript:void(0)" onclick="top.$App.showOrderinfo()" class="fr">升级</a>暂存柜容量：</dt>',
									'<dd>',
										'<span>',
											'<span class="diskprogressBarBlue fr">',
												'<em class="growsBlow" style="width: {usedPercent}%;"></em>',
												'<em class="growFont">{usedSize}/{folderSize}</em>',
											'</span>',
										'</span>',
									'</dd>',
								'</dl>',
								'<dl class="clearfix mt_10 mb_5" id="">',
									'<dt>过期提醒：</dt>',
									'<dd>',
										'<input type="checkbox" id="tipMail"/><label for="tipMail">&nbsp;到期前两天邮件提醒</label>',
										'<span style="display:none;"><input type="checkbox" id="tipMobile"> 短信提醒</span>',
									'</dd>',
								'</dl>',
								'<div class="line"></div>'].join(""),
		listModeTemplate : ['<span class="viewTipPic fr mr_10 ml_10">',
					     '<a href="javascript:void(0)" class="mr_5" id="listMode"> ',
					 	'<!--不选中时候添加"i_view_checked"-->',
					 	'<i class="i_view_checked"></i>',
					     '</a>',
					     '<a href="javascript:void(0)" id="iconMode">',
					 	'<!--选中时候添加"i_list_checked"-->',
					 	'<i class="i_list"></i>',
					     '</a>',
					 '</span>'].join(""),
		logger : new top.M139.Logger({name: "M2012.Fileexpress.Cabinet.View.Statusbar"}),
		events : {
		},
		initialize : function(options) {
			this.model = options.model;
			return superClass.prototype.initialize.apply(this, arguments);
		},
		initEvents : function(){
        	var self = this;
        	// 过期提醒弹出层
        	var jTip = $("#popup_maillist_set");
		//	$("#fileList").css("margin-top","14px");
		//	$("#btn_setting").click(function(){
		//		jTip.show();
		//	});
        	$("#btn_setting").click(function(event){
        		var left = $(this).offset().left - jTip.width()/2 - 70;
        		jTip.css('left', left);
				jTip.show();
				
				M139.Dom.bindAutoHide({
	                action: "click",
	                element: jTip[0],
	                stopEvent: true,
	                callback: function () {
	                    jTip.hide();
	                    M139.Dom.unBindAutoHide({ action: "click", element: jTip[0]});
	                }
	            });
	            top.$Event.stopEvent(event);
        	});
        	// 关闭过期提醒弹出层
        	$("#closeSetTip, #cancelSetTip").click(function(event){
        		jTip.hide();
        	});
        	$("#setTipSure").click(function(event){
        		self.model.setTipMode(function(result){
        			if(result.responseData.code && result.responseData.code == 'S_OK'){
        				BH({key : "fileexpress_cabinet_settipsuc"});
        				
        				top.M139.UI.TipMessage.show(self.model.tipWords['SET_SUC'], {delay : 1000});
        			}else{
        				self.logger.error("setFiles returndata error", "[file:setFiles]", result);
        			}
        			jTip.hide();
        		});
        	});
        	// 文件搜索
        	$("#keywords").blur(function(){
        		var text = $(this).val();
        		if(!text){
        			text = self.model.defaultInputValue;
        		}
        		$(this).val(text);
        	}).focus(function(){
        		var text = $(this).val();
        		if(text == self.model.defaultInputValue){
        			$(this).val('');
        		}
        	});
        	$("#search").click(function(event){
				self.searchFiles();
				return;
				/*
        		var jKeywords = $("#keywords");
        		if(jKeywords.hasClass('hide')){
        			jKeywords.removeClass('hide');
        		}else{
        			var text = jKeywords.val();
	        		if(!text || text === self.model.defaultInputValue){
	        			$("#keywords").addClass('hide');
	        		}
	        		self.searchFiles(event);
        		}
				*/
        	});
        	// 文件搜索支持回车事件
			if($B.is.ie && $B.getVersion() == 6){
				$("#keywords").bind('keydown', function(event){
					if(event.keyCode == M139.Event.KEYCODE.ENTER){
						$("#search").click();
					}
				}).bind('keypress', function(event){
					if(event.keyCode == M139.Event.KEYCODE.ENTER){
						$("#search").click();
					}
				});
			}else{
				$("#keywords").bind('keydown', function(event){
					if(event.keyCode == M139.Event.KEYCODE.ENTER){
						$("#search").click();
					}
				});
			};
        	// 列表模式切换
        	$("#listMode").click(function(event){
                var target = $(this);

                self.changeViewTip(function(){
                    self.model.set('listMode', 0);
                    $("#iconMode i").attr('class', 'i_list_checked');
                    target.find('i').attr('class', 'i_view');
                });
				$(".wh3,.wh4,.wh5,.wh6").show();
				$(".diskTableList.onScollTable").show();
				$("#fileList").css("margin-top","0");
        	});
        	$("#iconMode").click(function(event){
                var target = $(this);

                self.changeViewTip(function(){
                    self.model.set('listMode', 1);
        		    $("#listMode i").attr('class', 'i_view_checked');
        		    target.find('i').attr('class', 'i_list');
                });
				$(".wh3,.wh4,.wh5,.wh6").hide();
				$(".diskTableList.onScollTable").hide();
				$("#fileList").css("margin-top","14px");
        	});
        },
		render : function(){
		    var self = this;
            var dataSource = self.model.dataSource;

		    $("#keywords").val(self.model.defaultInputValue);
		    var html = $T.Utils.format(self.template2, self.model.getStatusObj());
		 	$("#layout").html(html);
			$("#listModeContainer").html(self.listModeTemplate);
        //    $("#pcClientSetup").html(top.SiteConfig["pcClientSetupHtml"]);
		 	
		 	// 根据用户套餐信息显示升级链接
		 	if(self.model.isServiceItem()){
		 		var jUpgrade = $("#upgrade");
		 	//	jUpgrade.prev('em.gray').hide();
		 	//	jUpgrade.hide();
		 	}

            // 根据getFiles接口中的emailRemind来设置邮件提醒的勾选状态
            $("#tipMail").attr('checked', !!Number(dataSource.emailRemind));
            $("#tipMobile").attr('disabled', true);
		 	if(!self.model.isSetupMailTool()){
		 		$("#setupMailtool").show();
		 	}
		 	
		 	var mode = self.model.get('listMode');
			if(mode){
				$("#listMode i").attr('class', 'i_view_checked');
        		$("#iconMode").find('i').attr('class', 'i_list');
			}else{
				$("#iconMode i").attr('class', 'i_list_checked');
        		$("#listMode").find('i').attr('class', 'i_view');
			}
		},
        //切换视图提示
        changeViewTip: function (callback) {
            var self = this;
            var isUploading = mainView.uploadModel.isUploading();

            if (isUploading) {
                if (window.confirm(self.model.tipWords["UPLOADING_CHANGE_VIEW"])) {
                    callback && callback();
                }
            } else {
                callback && callback();
            }
        },
		// 搜索文件
		searchFiles : function(event){
			var self = this;
		//	var keywords = $.trim($("#keywords").val());
			var keywords = $T.Html.encode($T.Url.queryString("keyword")) || "";//从URL获取搜索的内容
			if(!keywords || keywords === self.model.defaultInputValue){
				self.model.set('fileList', self.model.get('originalList'));
			}else{
				self.model.set('fileList', self.model.search(keywords));
			}
			$("#navContainer").html('搜索包含“'+keywords+'”的暂存柜文件，共'+self.model.get('fileList').length+'个');
			self.model.set('searchStatus', -self.model.get('searchStatus'));// 重新加载第一页文件列表
		}
	}));
})(jQuery, _, M139);



﻿M139.namespace("M2012.Fileexpress.Cabinet.View", {
	Command : Backbone.View.extend({
		el : "",
		initialize : function(options) {
			this.model = options.model;
			var self = this;
			top.$App.unbind("cabinetCommand").
				on("cabinetCommand", function(args) {//监听其它模块发起的菜单命令
				self.doCommand(args.command, args);
			});
		},
		doCommand : function(command, args) {
			var self = this;
			if (!args) {//未传则置空
				args = {}
			}
			var model = self.model;
			
			var fids = [];
			if (args && args.fids) { //如果有传fids，直接取用
				fids = args.fids;
				if(typeof fids === 'string'){
					fids = [fids];
				}
			} else {	//如果没传，获取列表中选中项的fids
				fids = self.getSelectedFids();
			}
			var fidsStr = fids.join(',');
			
			function addBehavior() {
			    var map = {
			        markAll: "mailbox_markUnread_ok", deleteAll: "mailbox_deleteUnread_ok",
			        "delete": "mailbox_realDelete_ok", spam: "mailbox_spam_ok"
			    };
			    var tabReadMail = /readmail_/gi.test($App.getCurrentTab().name);
			    if (command == "move" && args.fid == 4) { //move 到fid=4才是普通删除
			        if(tabReadMail){
			            BH('toolbar_deleteok');
			        }else{
			            BH("mailbox_delete_ok");
			        }
			        return; 
			    }
			    if(map[command]){
			        if(tabReadMail && command == 'delete'){
	    		        BH('toolbar_realdeleteok');
			        }else{
    			        BH(map[command]);			        
			        }
			    }
			};
			
			// todo
			function commandCallback() {//完成操作后回调
				M139.UI.TipMessage.hide();
				if(messageSuccess) {//成功提示
					setTimeout(function() {
						M139.UI.TipMessage.show(messageSuccess, {
							delay : 3000
						});
					}, 1000);
				}
				addBehavior();
			}

			var message = "正在操作中.......";
			var messageSuccess = "";
			
			var commands = model.commands;
			switch (command) {
				case commands.UPLOAD:
					break;
				case commands.DOWNLOAD:
	        		if(checkSelect()) {
	        			if(self.model.isSupportDownload()){
	        				self.model.trigger("downloadFiles", fidsStr);
	        			}else{
							top.M139.UI.TipMessage.show(self.model.tipWords.OVER_SIZE, { delay: 3000, className: "msgYellow" }); 
	        			}
					}else{
						top.M139.UI.TipMessage.show(self.model.tipWords.SELECTED_EMPTY, { delay: 3000, className: "msgYellow" }); 
					}
					break;
				case commands.SEND_TO_MAIL:
					if(checkSelect()) {
						var tips = checkFileNum();
						if(!tips){
							sendFiles(self.model.sendTypes['MAIL']);
						}else{
							top.M139.UI.TipMessage.show(tips,{ delay: 3000, className: "msgYellow" });
						}
					}else{
						top.M139.UI.TipMessage.show(self.model.tipWords.SELECTED_EMPTY, { delay: 3000, className: "msgYellow" }); 
					}
					break;
				case commands.SEND_TO_PHONE:
	                if(checkSelect()) {
						sendFiles(self.model.sendTypes['MOBILE']);
					}else{
						top.M139.UI.TipMessage.show(self.model.tipWords.SELECTED_EMPTY, { delay: 3000, className: "msgYellow" }); 
					}
					break;
				case commands.RENEW:
					if(checkSelect()) {
	        			self.model.trigger("renewFiles", fidsStr);
					}else{
						top.M139.UI.TipMessage.show(self.model.tipWords.SELECTED_EMPTY, { delay: 3000, className: "msgYellow" }); 
					}
					break;
				case commands.SAVE_TO_DISK:
					BH('cabSaveToDisk');
					if(checkSelect()) {
						var namesStr = self.model.getNameList(fids).join('，');
			            var moveToDiskview = new top.M2012.UI.Dialog.SaveToDisk({
			                ids : fidsStr,
			                fileName : namesStr,
			                type : 'move'
			            });
			            moveToDiskview.render().on("success", function () {
			                self.model.trigger('refresh');
			            });
					}else{
						top.M139.UI.TipMessage.show(self.model.tipWords.SELECTED_EMPTY, { delay: 3000, className: "msgYellow" }); 
					}
					break;
				case commands.RENAME:
					if(checkSelect()) {
	        			self.model.trigger('renameFile');
					}else{
						top.M139.UI.TipMessage.show(self.model.tipWords.SELECTED_EMPTY, { delay: 3000, className: "msgYellow" }); 
					}
					break;
				case commands.DELETE_FILE:
					if(checkSelect()) {
						var selectedFids = self.model.get('selectedFids');
						var tip = $T.Utils.format(self.model.tipWords['DELETE_FILE_COUNT'], [fids.length]);
						top.$Msg.confirm(tip, function() {
	        				self.model.trigger("deleteFiles", fidsStr);
						}, {
							dialogTitle : '删除文件',
							icon : "warn"
						});
					}else{
						top.M139.UI.TipMessage.show(self.model.tipWords.SELECTED_EMPTY, { delay: 3000, className: "msgYellow" }); 
					}
					break;
				case "open":
					var fileids = self.model.get("selectedFids");
					if(fileids.length != 1){
						return;
					}
					var folder = $("em[fid='"+ fileids[0] +"']");
					if(folder.length == 0){
						folder = $("img[fid='"+ fileids[0] +"']");
					}
					folder[0].click();
			};
			function sendFiles(type){
				var url = self.model.urls['SEND_URL'];
				var fileList = self.model.getSelectedFiles();
                self.model.gotoSendPage({fileList : fileList, type : type});
			};
			function checkSelect() {//是否选择了文件
				return fids.length > 0?true:false;
			};
			function checkFileNum(){//选择发送的文件数量是否多50
				var serviceItem ='0016,0017'.indexOf(top.$User.getServiceItem()) >-1;
				if(serviceItem){
					return fids.length <=50?false:self.model.tipWords['SELECTEDFILE_TO_MANY'];
				}else{
					return fids.length <=10?false:self.model.tipWords['SELECTEDFILE_TO_MANY'];
				}
			}
		},
		getSelectedFids : function(isSessionMail) {
			var self = this;
			return self.model.get('selectedFids');
		}
	})
});

(function(jQuery, Backbone, _, M139) {
    var $ = jQuery;
    M139.namespace("M2012.Fileexpress.Cabinet.Model.Upload", Backbone.Model.extend({
        defaults: {
            currentFile: {
                clientTaskno: "",
                name: "",
                size: "",
                fileMd5: "",
                state: "uploading",
                sendSize: "",
                totalSize: "",
                speed: "",
                surplusTime: "",
                responseText: "",
                isContinueUpload: "",
                fileInfo: {},
                summary: "",
                isMcloud: "0"//是否存彩云： 1 是；0 否
            },
            curConditionType: "",//当前被使用的环境，分为文件快递和彩云,值：file, disk
            isStop: false,
            continueUploadCount: 0,
            isTipFilterFile: false,
            needUploadFileNum: 0,
            uploadedFileNum: 0,
            RootId:null,
            attachId:null,
            my139Id:null
        },

        logger : new top.M139.Logger({
            name : "M2012.Fileexpress.Cabinet.Model.Upload"
        }),

        monitorIntervalId: null,

        name: "M2012.Fileexpress.Cabinet.Model.Upload",

        callApi : M139.RichMail.API.call,

        randomNumbers: {},

        fileListEle: {},//上传列表dom引用

        fileUploadSuc: [],//上传成功文件
        
		dirTypes : {// 文件类型
            ROOT: 0,//根目录 此值是前端定义，用以将根目录和其他目录进行区分，服务端定义为1
            USER_DIR : 1, // 自定义文件夹
            FILE : 'file', // 文件
            DIRECTORY : 'directory'// 文件
        },
        
        maxUploadSize: 1024 * 1024 * 1024,

        limitFlashUploadSize: 100 * 1024 * 1024,//flash上传单文件最大100M

        installToolUrl: "/m2012/controlupdate/mail139_tool_setup.exe",

        commonUploadResultUrl: "http://" + location.host + "/m2012/html/disk_v2/uploadresult.html",

        //根据套餐显示超大附件最大上传文件大小
        resetMaxUploadSize: function(){
            if (this.get("curConditionType") == "file") {//文件快递上传单文件大小
                this.maxUploadSize = (top.$User && top.$User.getCapacity("maxannexsize") || (4 * 1024)) * 1024 * 1024;
            } else {//彩云上传单文件大小
                this.maxUploadSize = (top.$User && top.$User.getCapacity("diskfilesize") || 1024) * 1024 * 1024;
            }
        },

        params: {
            DISPERSED_SERVER_CODE: {
                "SUC_UPLOAD": "0"//上传分布式成功
            },
            MIDDLE_SERVER_CODE: {
                "S_OK"  : "上传文件成功！",
                "S_ERR" : "上传失败！"
            }
        },

        msg: {
            NOUPLOAD:"unable to compute",
            UPLOADFAIL:"There was an error attempting to upload the file!",
            UPLOADCANCEL:"The upload has been canceled by ther user or ther browser dropped the connection.",
            SOURCE_FILE_DELETED: "对不起，源文件不存在，无法继续上传！"
        },

        installActivexTemplete: ['<div class="tips delmailTips netpictips" id="setupToolContainer" style="width:304px;">',
            '<a hidefocus="1" class="delmailTipsClose" href="javascript:void(0)" id="closeSetupTool"><i class="i_u_close"></i></a>',
            '<div class="tips-text">',
            '<div class="imgInfo">',
            '<a hidefocus="1" class="imgLink imgAttch" href="javascript:void(0)" title="图片"><img src="/m2012/images/module/FileExtract/attrch.png"></a>',
            '<dl class="attrchUp"> ',
            '<dt><strong>支持极速上传，大文件上传更加稳定！</strong></dt>',
            '<dd><span class="mr_10"><i class="i_done mr_5"></i>高速秒传</span> <span><i class="i_done mr_5"></i>上传<span id="maxUploadSize">超</span>大文件</span></dd>',
            '<dd><span class="mr_10"><i class="i_done mr_5"></i>断点续传</span> <span><i class="i_done mr_5"></i>显示上传进度</span></dd>',
            '<dd class="mb_15"><a hidefocus="1" href="/m2012/controlupdate/mail139_tool_setup.exe" target="_blank" class="btnSetG"><span>安装139邮箱小工具</span></a></dd>',
            '</dl>',
            '</div>',
            '</div>',
            '<div class="tipsTop diamond"></div>',
            '</div>'].join(""),

        /**
         *上传模型公共代码
         *@constructs M2012.Compose.Model.StorageCabinet
         *@param {Object} options 初始化参数集
         *@example
         */
        initialize : function (options) {
            this.setConditionType(options.type);
            this.resetMaxUploadSize();
        },

        setConditionType: function (type) {
            this.set("curConditionType", type ? type : "file");
        },

        getUploadInterface: function(){
            return this.get("curConditionType") + ":fastUpload";
        },

        getResumeInterface: function(){
            return this.get("curConditionType") + ":resumeUpload";
        },

        getCommonUploadInterface: function(){
            return this.get("curConditionType") + ":normalUpload";
        },

        getUploadKey: function (file, callback, reqData) {
            var self = this;
            var curConditionType = self.get("curConditionType");

            var data = {
                fileName: file.name,
                fileSize: file.size,
                fileMd5: file.fileMd5
            };

            //彩云上传需要多加2个参数
            if (reqData) {
                data.directoryId = reqData.directoryId;
                data.dirType = reqData.dirType;
                data.thumbnailSize = "65*65";//返回缩略图的尺寸
            }

            data = top.$Xml.obj2xml(data);

            var result = {};
            var uploadInterfaceName = this.getUploadInterface();
            self.postXml(uploadInterfaceName, data, function (e) {
                var response = e.responseData;

                result.success = false;
                if (response && response.code == "S_OK") {
                    result.message = response.summary;
                    try {
                        var val = response["var"];
                        result.success = true;
                        result.status = val.status;
                        result.urlUpload = val.url;
                        result.businessId = val.fileId;
                        result.isMcloud = val.isMcloud || "0";//是否存彩云

                        var fileInfo = val.file;
                        result.fileInfo = fileInfo;//将上传文件的相关信息存储起来(文件快递或者彩云)
                        result.name = fileInfo.fileName || fileInfo.name || file.name;//上传重复文件，需要取服务端的新文件名
                        if (fileInfo.file) {
                            result.thumbUrl = curConditionType == "file" ? fileInfo.thumbnailImage : fileInfo.file.thumbnailUrl;//单副本文件，获取缩略图
                        }
                        result.dataUpload = val["postParam"];
                        result.isMcloud == "1" && result.dataUpload && (result.uploadTaskID = result.dataUpload.UploadtaskID);//存彩云，获取断点信息的时候需要参数uploadTaskID
                        result.dataUpload.ranges = "";//已经上传的文件片段，第一次上传rang为空
                    } catch (ex) {
                        result.success = false;
                        self.logger.error(uploadInterfaceName + " illegality json|" + e.responseText, "[" + uploadInterfaceName + "]", e.responseText);
                    }
                } else {
                    result.success = false;
                    result.summary = response && response.summary;
                    result.response = response;
                    self.logger.error(uploadInterfaceName + " returndata error|" + e.responseText, "[" + uploadInterfaceName + "]", e.responseText);
                }

                callback && callback(result);
            }, function (e) {
                result.success = false;
                callback && callback(result);
                self.logger.error(uploadInterfaceName + " ajax error|" + e, "[" + uploadInterfaceName + "]", e);
            });
        },
		//获取彩云信息(所有目录信息)
        getDirectorys : function(callback) {
			var self = this;
            self.callApi("disk:getDirectorys", null, function(res) {
				if(callback) {
					callback(res);
				}
			});
		},
		//存彩云
		saveToDisk : function(callback){
			var self = this;
			//debugger;
	        var currentFile = _.last(self.fileUploadSuc);
	        var dir = this.dirTypes;
            var requestData = {
                directoryId: self.get("attachId"),
                shareFileId: currentFile.businessId,
                comeFrom: '0',//comeFrom 来源  0为普通目录 1为相册 2为音乐
                //bItemId: bItemId,
                type: dir.USER_DIR
            };
			self.callApi("file:turnFile",requestData,function(res){
				if(callback) {
					callback(res);
				}
			})

		},
		//获取网盘目录下的文件及目录
		getfiles : function(callback,directoryId){
			var self = this,options ={};
			if(directoryId){
				options.directoryId = directoryId;
	            self.callApi("disk:fileListPage", options, function(res) {
					if(callback) {
						callback(res);
					}
				});
			}
		},
        //新建目录
        createDir: function (callback, options) {
            var self = this;
            self.callApi("disk:createDirectory", getData(), function (result) {
                callback && callback(result);
            });
            function getData(){
                if (!options.parentId) {
                    options.parentId = self.get("RootId");
                    options.dirType = self.getDirTypeForServer();
                }
                return options;
            }
        },

        //获取断点上传地址和断点位置
        /*
         * @fileid {String} 必填 彩云id
         * @uploadTaskID {String} 选填 彩云id
         */
        getBreakpointKey: function (fileid, uploadTaskID, callback) {
            var self = this;
            var data = {
                fileId: fileid,
                uploadTaskID: uploadTaskID
            };
            var curConditionType = self.get("curConditionType");

            data = top.$Xml.obj2xml(data);

            var resumeInterfaceName = this.getResumeInterface();
            this.postXml(resumeInterfaceName, data, function (e) {
                var response = e.responseData;
                var result = {};

                result.success = false;
                if (response && response.code == "S_OK") {
                    result.message = response.summary;
                    try {
                        var val = response["var"];
                        result.success = true;
                        result.status = val.status;
                        result.urlUpload = val.url;
                        result.businessId = val.fileId;
                        result.isMcloud = val.isMcloud || "0";//是否存彩云

                        var fileInfo = val.file;
                        result.fileInfo = fileInfo;//将上传文件的相关信息存储起来
                        result.name = fileInfo.fileName || fileInfo.name || self.get("currentFile").name;//上传重复文件，需要取服务端的新文件名

                        result.dataUpload = val["postParam"];
                        result.isMcloud == "1" && result.dataUpload && (result.uploadTaskID = result.dataUpload.UploadtaskID);//存彩云，获取断点信息的时候需要参数uploadTaskID
                        result.dataUpload.ranges = val.ranges;

                        if (self.monitorIntervalId) {//网络断开又恢复正常了
                            clearInterval(self.monitorIntervalId);
                            self.monitorIntervalId = null;
                        }
                    } catch (ex) {
                        result.success = false;
                        self.logger.error(resumeInterfaceName + " illegality json|" + e.responseText, "[" + resumeInterfaceName + "]", e.responseText);
                    }
                } else {
                    result.success = false;
                    self.logger.error(resumeInterfaceName + " returndata error|" + e.responseText, "[" + resumeInterfaceName + "]", e.responseText);
                }

                callback && callback(result);
            }, function (e) {
                self.logger.error(resumeInterfaceName + " ajax error|" + e, "[" + resumeInterfaceName + "]", e);
            });
        },

        getCommonUploadKey: function (file, callback, reqData) {
            var self = this;
            var curConditionType = self.get("curConditionType");

            var data = {
                fileName: file.name,
                returnUrl: this.commonUploadResultUrl
            };

            //彩云上传需要多加2个参数
            if (reqData) {
                data.directoryId = reqData.directoryId;
                data.dirType = reqData.dirType;
                data.thumbnailSize = "65*65";//返回缩略图的尺寸
            }

            data = top.$Xml.obj2xml(data);

            var result = {};
            var uploadInterfaceName = this.getCommonUploadInterface();
            self.postXml(uploadInterfaceName, data, function (e) {
                var response = e.responseData;

                result.success = false;
                if (response && response.code == "S_OK") {
                    result.message = response.summary;
                    try {
                        var val = response["var"];
                        result.success = true;
                        result.urlUpload = val.url;
                        result.uploadCode = val.uploadCode;
                        result.isMcloud = val.isMcloud || "0";

//                        var fileInfo = val[curConditionType];
//                        result[curConditionType + "Info"] = fileInfo;//将上传文件的相关信息存储起来(文件快递或者彩云)
//                        result.name = (curConditionType == "file" ? fileInfo.fileName : fileInfo.name) || file.name;//上传重复文件，需要取服务端的新文件名
                        result.name = file.name;
                    } catch (ex) {
                        result.success = false;
                        self.logger.error(uploadInterfaceName + " illegality json|" + ex, "[" + uploadInterfaceName + "]", ex);
                    }
                } else {
                    result.success = false;
                    result.summary = response.summary;
                    self.logger.error(uploadInterfaceName + " returndata error|" + response, "[" + uploadInterfaceName + "]", response);
                }

                callback && callback(result);
            }, function (e) {
                result.success = false;
                callback && callback(result);
                self.logger.error(uploadInterfaceName + " ajax error|" + e, "[" + uploadInterfaceName + "]", e);
            });
        },

        //组装上传需要的post数据
        packageData: function (file) {
            var dataUpload = file.dataUpload || {};

            dataUpload.urlUpload = file.urlUpload;
            dataUpload.businessId = file.businessId;
            dataUpload.isMcloud = file.isMcloud;

            file.uploadCode && (dataUpload.uploadCode = file.uploadCode);

            return dataUpload;
        },

        //上传完成触发
        completeHandle: function (clientTaskno, responseText, sucHandle, errHandle, uploadApp) {
            console.log("上传完成分布式返回报文：" + responseText);

            var self = this;
            var errMsg = this.params.MIDDLE_SERVER_CODE["S_ERR"];
            var sucMsg = this.params.MIDDLE_SERVER_CODE["S_OK"];
            var retcode = "";
            var responseData = "";
            var middleret = "";
            var middleretJson = {};

            //上传文件存在单副本，不用再上传了
            if (responseText === true) {
                this.fileUploadSuc.push(jQuery.extend(true, {}, this.get("currentFile")));
                console.log("上传成功文件：");
                console.log(this.fileUploadSuc);
                sucHandle();
                this.behaviorUploadSuc(uploadApp);
                return;
            }

            //普通上传
            if (responseText.indexOf("http://") == 0) {
                responseData = responseText;

                if (self.get("currentFile").isMcloud == "1") {//存彩云，通过uploadRet是否有值，判断文件是否上传成功
                    retcode = M139.Text.Url.queryString("uploadRet", responseText);
                    validateUpload(true);
                    return;
                }

                retcode = M139.Text.Url.queryString("retcode", responseText);
                middleret = M139.Text.Url.queryString("middleret", responseText);
                try {
                    middleret = middleret.replace(/\+/g, "%20");//java中会将空格转换成+，所以解码前要先对+做正确的编码
                    middleret = unescape(middleret);
                } catch (ex) {
                    errUploadHandle(true);
                    return;
                }
                validateUpload(true);

                return;
            }

            //html5,flash或控件上传
            responseData = top.$Xml.xml2object(responseText);
            if (!responseData) {
                errHandle(errMsg);
                return;
            }

            retcode = responseData.retcode;
            middleret = responseData.middleret;
            validateUpload();

            function validateUpload(isCommonUpload){
                var curConditionType = self.get("curConditionType");

                //存彩云
                if (self.get("currentFile").isMcloud == "1") {
                    if (isCommonUpload) {//普通上传
                        if (retcode && retcode != "") {//上传成功
                            sucHandle();
                            //上传成功之后做记录
                            self.set("needUploadFileNum", 1);
                            self.set("uploadedFileNum", 1);
                            self.behaviorUploadSuc(uploadApp);
                        } else {
                            errUploadHandle(true);
                        }
                        return;
                    }

                    retcode = responseData.resultCode;
                    if (retcode == 0) {//存彩云成功
                        self.fileUploadSuc.push(jQuery.extend(true, {}, self.get("currentFile")));
                        try {
                            self.get("currentFile").fileInfo.file.fileSize = self.get("currentFile").fileInfo.file.rawSize = self.get("currentFile").size;
                        } catch (ex) {
                            console.log("中间件返回上传文件的数据结构有问题！");
                        }
                        sucHandle();
                        self.behaviorUploadSuc(uploadApp);
                    } else {
                        console.log("上传分布式失败! retcode: " + retcode);
                        self.logger.error("upload mcloud returndata error|[pcUploadFile]|上传彩云失败! retcode:" + retcode, "[pcUploadFile]", responseData);
                        errUploadHandle(isCommonUpload);
                    }

                    return;
                }

                if (retcode != self.params.DISPERSED_SERVER_CODE.SUC_UPLOAD) {//上传分布式失败
                    console.log("上传分布式失败! retcode: " + retcode);
                    self.logger.error("upload distributed returndata error|[fastuploadsvr.fcg]|上传分布式失败! retcode:" + retcode, "[fastuploadsvr.fcg]", responseData);
                    errUploadHandle(isCommonUpload);
                    return;
                }

                //上传分布式成功
                //继续判断middleret 为中间件返回的json 来判断是否入库中间件服务器
                if (!middleret) {
                    errUploadHandle(isCommonUpload);
                    console.log("入库失败! middleret: " + middleret);
                    self.logger.error(curConditionType + " upload middleret returndata error|[fastuploadsvr.fcg]|入库失败! middleret为空", "[fastuploadsvr.fcg]", responseData);
                    return;
                }

                try {
                    middleretJson = eval("(" + middleret + ")");
                } catch (ex) {
                    self.logger.error(curConditionType + "upload middleret json illegality|[fastuploadsvr.fcg]|middleret格式非法", "[fastuploadsvr.fcg]", responseData);
                    errUploadHandle(isCommonUpload);
                    return;
                }

                if (middleretJson.code == "S_OK") {
                    self.fileUploadSuc.push(jQuery.extend(true, {}, self.get("currentFile")));
                    console.log("上传成功文件：");
                    console.log(self.fileUploadSuc);

                    var middleretJsonVar = middleretJson["var"];
                    console.log(middleretJson);

                    //普通上传，将上传文件信息存储起来
                    if (isCommonUpload) {
                        try {
                            self.get("currentFile").fileInfo = middleretJsonVar.file;
                            self.get("currentFile").size = middleretJsonVar.file.file.fileSize;
                            self.get("currentFile").businessId = middleretJsonVar.file.id;
                        } catch (ex) {
                            console.log("中间件返回上传文件的数据结构有问题！");
                        }
                    }

                    if (curConditionType == "disk") {
                        try {
                            self.get("currentFile").fileInfo.file.fileSize = self.get("currentFile").fileInfo.file.rawSize;
                        } catch (ex) {
                            console.log("中间件返回上传文件的数据结构有问题！");
                        }
                    }

                    self.get("currentFile").thumbUrl = middleretJsonVar.url;
                    sucHandle();
                    self.behaviorUploadSuc(uploadApp);
                } else {
                    self.logger.error(curConditionType + " upload middleret returndata error|[fastuploadsvr.fcg]|S_ERR", "[fastuploadsvr.fcg]", responseData);
                    errUploadHandle(isCommonUpload);
                }
            }

            function errUploadHandle (isCommonUpload) {
                self.get("currentFile").summary = middleretJson["summary"] || errMsg;
                if (isCommonUpload) {
                    self.get("currentFile").fileInfo = {
                        uploadState: "false"
                    };
                }

                errHandle(errMsg);
            }
        },

        behaviorUploadSuc: function (uploadApp) {
            var curConditionType = this.get("curConditionType");

            if (uploadApp.currentUploadType == uploadApp.uploadType.HTML5) {
                curConditionType == "file" ? BH({key : "fileexpress_cabinet_html5_uploadsuc"}) : BH({key : "diskv2_uploadhtml5_suc"});
            } else if(uploadApp.currentUploadType == uploadApp.uploadType.CONTROL) {
                curConditionType == "file" ? BH({key : "fileexpress_cabinet_activex_uploadsuc"}) : BH({key : "diskv2_uploadactivex_suc"});
            } else if(uploadApp.currentUploadType == uploadApp.uploadType.FLASH) {
                curConditionType == "file" ? BH({key : "fileexpress_cabinet_flash_uploadsuc"}) : BH({key : "diskv2_uploadflash_suc"});
            } else if(uploadApp.currentUploadType == uploadApp.uploadType.COMMON) {
                BH({key : "diskv2_uploadcommon_suc"});
            }
        },

        //上传点击行为统计
        uploadClickBehavior: function (uploadApp) {
            var curConditionType = this.get("curConditionType");

            if (uploadApp.currentUploadType == uploadApp.uploadType.HTML5) {
                curConditionType == "file" ? BH({key : "fileexpress_cabinet_html5_upload_click"}) : BH({key : "diskv2_uploadhtml5_click"});
            } else if(uploadApp.currentUploadType == uploadApp.uploadType.CONTROL) {
                curConditionType != "file" && BH({key : "diskv2_uploadactivex_click"});
            } else if(uploadApp.currentUploadType == uploadApp.uploadType.FLASH) {
                curConditionType != "file" && BH({key : "diskv2_uploadflash_click"});
            } else if(uploadApp.currentUploadType == uploadApp.uploadType.COMMON) {
                BH({key : "diskv2_uploadcommon_click"});
            }
        },

        //控件上报错误日志
        errLogByActivex: function (logText) {
            var self = this;
            self.logger.error(self.get("curConditionType") + " upload by activex|[fastuploadsvr.fcg]|" + logText);
        },

        //flash上报错误日志
        errLogByFlash: function (logText) {
            var self = this;
            self.logger.error(self.get("curConditionType") + " upload by flash|I/O Error|" + logText, "I/O Error", logText);
        },

        //html5上传错误日志
        errLogByHtml5: function (logText) {
            var self = this;
            self.logger.error(self.get("curConditionType") + " upload by html5|Uploading Error|" + logText, "Uploading Error", logText);
        },

        //上传队列文件是否已经上传完成
        isUploading: function(){
            return this.get("needUploadFileNum") != this.get("uploadedFileNum");
        },

        postXml:function (url, data, successCallback, errorCallback) {
            this.callApi(url, data, function (e) {
                successCallback && successCallback(e);
            }, {
                headers:{"Content-Type":"text/xml"},
                error:function () {
                    errorCallback && errorCallback();
                }
            })
        },

        /*
         * 根据筛选规则，将符合规则的文件state设置为1，不符合的设为0,供上传组件使用
         * 添加字段error具体描述不能上传的原因，渲染界面的时候使用
         * @param {Object} fileList 用户选择的文件列表
         * @param {String} uploadType 当前上传的方式
         */
        filterFile: function (fileList, uploadType) {
            var isValid = true;

            for (var i = 0, len = fileList.length; i < len; i++) {
                var file = fileList[i];

                if ((/&/.test(file.name))) { //文件名中含有非法字符
                    file.state = 0;
                    file.error = "invalidFileName";
                    this.set("isTipFilterFile", true);
                    isValid = false;
                } else if (uploadType != "common") {
                    //是否超过套餐上传单文件大小限制
                    if (file.size == 0) {
                        isValid = false;
                        file.state = 0;
                        file.error = "emptyUploadSize";
                        this.set("isTipFilterFile", true);
                    } else if (file.size > this.maxUploadSize) {
                        isValid = false;
                        file.state = 0;
                        file.error = "limitUploadSize";

                        if (this.get("curConditionType") == "disk" && this.is20Version()) {
                            file.error = "limitMaxUploadSize";
                        }
                        this.set("isTipFilterFile", true);
                    } else if (uploadType == "flash" && (file.size > this.limitFlashUploadSize)) {//是否超过flash上传文件大小限制
                        isValid = false;
                        file.state = 0;
                        file.error = "limitFlashUploadSize";
                        this.set("isTipFilterFile", true);
                    } else {
                        file.state = 1;
                    }
                }

                if (file.clientTaskno == undefined || (file.clientTaskno == 0)) {//没有值，由脚本生产clientTaskno
                    file.clientTaskno = this.getClientTaskno();
                }
            }

            this.get("isTipFilterFile") && this.tipFilterFile(fileList);

            return isValid;
        },

        tipFilterFile: function (fileList) {
            var self = this;
            var emptyFileHtml = '<p>{fileNames} 为空文件，请重新选择！</p>';
            var invalidFileNameHtml = '<p>上传文件名不能有以下特殊字符 \/:*?"<>|&</p>';
            var limitFlashUploadSizeHtml = '{fileNames} 超过100M，无法上传！139邮箱小工具支持超大文件急速上传、断点续传！<a href="' + self.installToolUrl + '" target="_blank">立即安装</a>';
            var limitUploadSizeHtml = '文件单个上传大小已超过套餐限制{maxUploadSize}{upgradeTip}</p>';
            var upgradeTipHtml = '，请立即<a href="javascript:top.$App.showOrderinfo();" style="text-decoration: underline;">升级邮箱</a>！';
            var choseOther = '，请重新选择。';
            var emptyFileNames = [];
            var limitFlashUploadSizeFileNames = [];
            var limitUploadSizeFileNames = [];
            var invalidFileNames = [];
            var tipHtml = "";

            for (var i = 0, len = fileList.length; i < len; i++) {
                var file = fileList[i];

                if (file.error == "invalidFileName") {
                    invalidFileNames.push(file.name);
                } else if (file.error == "emptyUploadSize") {
                    emptyFileNames.push(file.name);
                } else if (file.error == "limitUploadSize" || file.error == "limitMaxUploadSize") {
                    limitUploadSizeFileNames.push(file.name);
                } else if (file.error == "limitFlashUploadSize") {
                    limitFlashUploadSizeFileNames.push(file.name);
                }
            }

            if (invalidFileNames.length > 0) {
                tipHtml += M139.Text.Utils.format(invalidFileNameHtml, {fileNames: invalidFileNames.join(",")});
            }
            if (emptyFileNames.length > 0) {
                tipHtml += M139.Text.Utils.format(emptyFileHtml, {fileNames: emptyFileNames.join(",")});
            }
            if (limitFlashUploadSizeFileNames.length > 0) {
                tipHtml += M139.Text.Utils.format(limitFlashUploadSizeHtml, {fileNames: limitFlashUploadSizeFileNames.join(",")});
            }
            if (limitUploadSizeFileNames.length > 0) {
                tipHtml += M139.Text.Utils.format(limitUploadSizeHtml, {
                    fileNames: limitUploadSizeFileNames.join(","),
                    maxUploadSize: M139.Text.Utils.getFileSizeText(self.maxUploadSize),
                    upgradeTip: self.isVipVersion() ? choseOther : upgradeTipHtml
                });
            }

            top.$Msg.alert(tipHtml, {isHtml: true});
            this.set("isTipFilterFile", false);
        },

        //获取文件随机标示
        getClientTaskno: function() {
            var rnd = parseInt(Math.random() * 100000000);
            var randomNumbers = this.randomNumbers;

            if (randomNumbers[rnd]) {
                return arguments.callee();
            } else {
                randomNumbers[rnd] = true;
                return rnd;
            }
        },

        delFileUploadSuc: function (clientTaskno) {
            var fileUploadSuc = this.fileUploadSuc;

            for (var i = 0, len = fileUploadSuc.length; i < len; i++) {
                var file = fileUploadSuc[i];

                if (file.clientTaskno == clientTaskno) {
                    fileUploadSuc.splice(i, 1);
                    i--;
                }
            }
        },

        getTimestamp:function (timeStr) {
            return this.parseDate(timeStr).getTime() / 1000;
        },

        //将时间字符串转换为时间
        parseDate:function (str) {
            str = str.trim();
            var result = null;
            var reg = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
            var m = str.match(reg);
            if (m) {
                result = new Date(m[1], (m[2] - 1), m[3], m[4], m[5], m[6]);
            }
            return result;
        },

        transformTime: function (second) {
            var now = new Date;

            now.setHours(0);
            now.setMinutes(0);
            now.setSeconds(second);
            return $Date.format("hh:mm:ss", now);
        },

        getFullName: function (fileNameOrigin) {// 不带拓展名
            var point = fileNameOrigin.lastIndexOf(".");
            if(point == -1){
                return fileNameOrigin;
            }else{
                return fileNameOrigin.substring(0, point);
            }
        },

        getExtendName: function (fileNameOrigin) {// 仅返回拓展名
            if(fileNameOrigin.indexOf('.') == -1){
                return '';
            }

            var length = fileNameOrigin.split(".").length;
            return fileNameOrigin.split(".")[length-1].toLowerCase();
        },

        //替换模板中的{**}，如果没有指定被替换，就保持不便，主要用在模板之前的组装合并
        format: function (str, arr) {
            var reg;
            if ($.isArray(arr)) {
                reg = /\{([\d]+)\}/g;
            } else {
                reg = /\{([\w]+)\}/g;
            }
            return str.replace(reg,function($0,$1){
                var value = arr[$1];
                if(value !== undefined){
                    return value;
                }else{
                    return $0;
                }
            });
        },

        getShortName : function(name, max){// 带拓展名
            var point = name.lastIndexOf(".");
            if(point != -1){
                name = name.substring(0, point);
            }
            if(name.length > max){
                return name.substring(0, max) + "…";
            }else{
                return name;
            }
        },

        is20Version: function() {
            return top.$User.getServiceItem() == top.$User.getVipStr("20");
        },

        isVipVersion:function() {
            var serviceItem = top.$User.getServiceItem();
            return '0016,0017'.indexOf(serviceItem)>-1;
        },

        showInstallActivex: function (options) {
		//	debugger;
			var htmlUpdate = ['<div class="autoTips" style="width: auto; border:0;">',
									'<div class="norTips clearfix" style="border:0">',
										'<span class="norTipsIco"><img src="/m2012/images/module/networkDisk/tool.png" /></span>',
										'<dl class="norTipsContent">',
											'<dt class="norTipsLine mt_10 fz_14">升级您的139邮箱小工具，支持更快捷、更稳定的文件上传。</dt>',
											'<dd class="norTipsLine mt_20"><a id="update139" href="/m2012/controlupdate/mail139_tool_setup.exe" class="btnSure" onclick="update.close()"><span>升级139邮箱小工具</span></a></dd>',
										'</dl>',
									'</div>',
								'</div>'].join("");
			var htmlInstall = ['<div class="autoTips" style="width: auto; border:0;">',
								'<div class="norTips clearfix" style="border:0">',
									'<span class="norTipsIco"><img src="/m2012/images/module/networkDisk/tool.png" /></span>',
									'<dl class="norTipsContent">',
										'<dt class="norTipsLine mt_10 fz_14">安装您的139邮箱小工具，支持更快捷、更稳定的文件上传。</dt>',
										'<dd class="norTipsLine mt_20"><a id="install139" href="/m2012/controlupdate/mail139_tool_setup.exe" class="btnSure"><span>安装139邮箱小工具</span></a></dd>',
									'</dl>',
								'</div>',
							'</div>'].join("");
			options = options || {};
			
			if(options.isInstall){
				var install = top.$Msg.showHTML(htmlInstall,{dialogTitle:"安装139邮箱小工具"});
				top.$("#install139").click(function(){
					install.close();
				});
			}else{
				var update = top.$Msg.showHTML(htmlUpdate,{dialogTitle:"升级139邮箱小工具"});
				top.$("#update139").click(function(){
					update.close();
				});
				
			}
			
			/*
            var elem = $("#setupToolContainer");

            if (elem.length > 0) {
                elem.show();
            } else {
				elem = $(this.installActivexTemplete).appendTo(top.document.body);
				elem.find("#closeSetupTool").click(function(){
					elem.hide();
				});

                var btnOffset = $btn.offset();
                elem.css({
                    left: btnOffset.left-6,
                    top: btnOffset.top + 25 + 106
                });
            }
			*/
        }
    }));
})(jQuery, Backbone, _, M139);
﻿(function(jQuery, Backbone, _, M139) {
    var $ = jQuery;

    M139.namespace("M2012.Fileexpress.Cabinet.View.UploadFileList", Backbone.View.extend({
        el: "#fileList",

        getListContainer: function(){
            return $(this.listSelector);//每次重新获取一遍容器
        },

        getIconContainer: function(){
            return $(this.iconSelector);
        },

        itemTemplete: ['<tr class="item-upload" clientTaskno="{clientTaskno}" rel="uploadFile">',
                '<td class="wh1 t-check"><input type="checkbox" disabled = "disabled" fid=""></td>',
                '<td>',
					'<div class="fl p_relative">',
						'<i class="i-file-smalIcion i-f-{expandName}"></i>',
					'</div>',
                    '<a href="javascript:void(0)" class="attchName" title="">',
                        '<span class="nameContainer">',
                            '<em fid="" fsize="" name="fname">{fileName}</em>',
                            '<input type="text" fname="{fileName}" exname="{expandName}" value="{fileName}" maxlength="255" size="30" style="display:none;">',
                            '<em fid="" fsize="" name="fname">.{expandName}</em>',
                        '</span>',
                    '</a>',
                    '<div class="attachment">',
                        '{subTemplete}',
                    '</div>',
                '</td>',
                '<td class="wh4 gray" rel="uploadDate"></td>',
                '<td class="wh4 gray" rel="maxSaveTime"></td>',
                '<td class="wh5 gray">0</td>',
                '<td class="wh6 gray" rel="fileSize">{fileSize}</td>',
            '</tr>'].join(""),

        fileOperationTmplete: ['<span style="display: none;"><a href="javascript:void(0)" name="download" fid="{businessId}">下载</a> <span>|</span> ',
            '<a href="javascript:void(0)" name="send" fid="{businessId}">发送</a> <span>|</span> ',
            '<a href="javascript:void(0)" name="renew" fid="{businessId}">续期</a> <span>|</span> ',
            '<a href="javascript:void(0)" name="deleteUpload" fid="{businessId}" fname="{fileNameOrigin}">删除</a></span>'].join(""),

        fileSizeLimitTmplete: ['<i class="i_warn_min"></i>',
            '<span class="red">超过100M，无法上传！</span>',
            '<a href="javascript:void(0)" name="delete" fid="{businessId}" fname="{fileNameOrigin}">删除</a>',
            '<span class="gray">139邮箱小工具支持超大文件急速上传、断点续传！</span>',
            '<a href="javascript:void(0)" name="installTool">立即安装</a>'].join(""),

        errUploadTemplete: ['<i class="i_warn_min"></i>',
            '<span class="red">{errInfo}</span>',
            '<a href="javascript:void(0)" class="pl_10" name="againUpload">重试</a>',
            '<span class="line">|</span>',
            '<a href="javascript:void(0)" name="deleteEle" fid="" fname="">删除</a>'].join(""),

        progressBarTemplete: ['<span class="progressBarDiv">',
            '<span class="progressBar"></span>',
            '<span class="progressBarCur">',
            '<span style="width: 0;"></span>',
            '</span>',
            '</span>',
            '<span class="state-upload gray" style="display: inline-block;width: 150px;"> 等待中({fileSize})</span>',
            '<a href="javascript:void(0);" class="btn-switch-upload pl_10" style="display: none;">暂停</a>'].join(""),

        stateUploadTemplete: '<span style="display: inline-block;width: 80px;">{speed}</span>&nbsp;&nbsp;{surplusTime}',

        md5LoadingTemplete: ['<img class="" src="../../images/global/load.gif">',
            '<span class="pt_5 gray">正在扫描文件</span>'].join(""),

        md5LoadingPercentTemplete: ['<img class="" src="../../images/global/load.gif">',
            '<span class="pt_5 gray">{md5Percent}正在扫描文件</span>'].join(""),

        flashLimitTipTemplete: ['<i class="i_warn_min"></i>',
            '<span class="red">超过100M，无法上传！</span>',
            '<a href="javascript:void(0);" name="deleteEle" class="">删除</a>',
            '<span class="gray">139邮箱小工具支持超大文件急速上传、断点续传！</span>',
            '<a href="javascript:void(0);" name="installTool">立即安装</a>'].join(""),

        limitUploadSizeTemplete: ['<i class="i_warn_min"></i>',
            '<span class="red">超出当前套餐单文件大小{limitUploadSize}限制，上传失败，请升级邮箱获得更多权益。</span>',
            '<a href="javascript:void(0);" name="deleteEle">删除</a>',
            '<span> | </span>',
            '<a href="javascript:void(0);" name="upgradeMail">升级邮箱</a>'].join(""),

        emptyUploadSizeTemplete: ['<i class="i_warn_min"></i>',
            '<span class="red">不允许上传空文件，请重新选择。</span>',
            '<a href="javascript:void(0);" name="deleteEle" class="">删除</a>'].join(""),

        deleteBtnTemplete: ['<span class="btn-delete">',
                '<span>|</span>',
                '<a hidefocus="1" href="javascript:void(0)" name="delete" fid="{fileId}" fname="{fileOriginName}"> 删除</a>',
            '</span>'].join(""),

        itemIconTemplete: [ '<li class="listItem" rel="uploadFile">',
                '<p class="chackPbar">',
                    '<input fid="{fileId}" name="checkbox"  filetype="file" type="checkbox" class="checkView" style="display: none;" disabled = "disabled">',
                '</p>',
                '<a href="javascript:void(0);" class="viewPic">',
                    '<img src="../../images/module/FileExtract/default.jpg" style="width: 65px; height: 65px;">',
                '</a>',
                '<div class="viewIntroduce">',
                    '<p class="fileNameBar">',
                        '<span class="itemName">',
                            '<em>{fileName}</em>',
                        '</span>',
                        '<span class="itemSuffix">.{expandName}</span>',
                    '</p>',
                    '{subTemplete}',
                '</div>',
            '</li>'].join(""),

        flashLimitTipIconTemplete: ['<p class="gray" style="display:block!important;">',
                                        '<i class="i_warn_min"></i>',
                                        '<span class="red">超过100M上传失败！</span>',
                                        '<a href="#" name="deleteEle">删除</a>',
                                    '</p>'].join(""),

        emptyUploadSizeIconTemplete: ['<p class="gray" style="display:block!important;">',
                                        '<i class="i_warn_min"></i>',
                                        '<span class="red">不能上传空文件</span>',
                                        '<a href="#" name="deleteEle">删除</a>',
                                      '</p>'].join(""),

        limitUploadSizeIconTemplete: ['<p class="gray" style="display:block!important;">',
                                    '<i class="i_warn_min"></i>',
                                    '<span class="red">超出套餐限制</span>',
                                    '<a href="#" name="deleteEle">删除</a>',
                                '</p>'].join(""),

        fileSizeBar: '<p class="gray" style="display: none;">{fileSize}</p>',

        fileOperationIconTmplete: ['<p style="display: none;">',
                '<a hidefocus="1" href="javascript:void(0)" name="download" fid="{businessId}">下载</a><span class="line">|</span>',
                '<a hidefocus="1" href="javascript:void(0)" name="send" fid="{businessId}">发送</a><span class="line">|</span>',
                '<a hidefocus="1" href="javascript:void(0)" name="renew" fid="{businessId}">续期</a><span class="line">|</span>',
                '<a hidefocus="1" href="javascript:void(0)" name="deleteUpload" fid="{businessId}" fname="{fileNameOrigin}">删除</a>',
            '</p>'].join(""),

        progressBarIconTemplete: ['<div class="progressBarWrap">',
                                    '<span class="progressBarDiv viewtProgressBar">',
                                        '<span class="progressBar"></span>',
                                        '<span class="progressBarCur">',
                                            '<span class="progressCenter" style="width: 0%;"></span>',
                                        '</span>',
                                    '</span>',
                                    '<span class="gray" style="display: none;">等待中</span>',
                                '</div>'].join(""),

        errUploadIconTemplete: ['<p class="gray">',
                '<i class="i_warn_min"></i>',
                '<span class="red">上传失败！</span>',
                '<a href="javascript:void(0);">重试</a>',
                '<span class="line">|</span>',
                '<a href="javascript:void(0);" name="deleteEle">删除</a>',
            '</p>'].join(""),

        progressTipTemplete: ['<div id="progressTip" class="tips netpictips pl_10" style="width:220px; top: 336px;left: 900px;">',
                '<a class="delmailTipsClose" href="javascript:void(0);">',
                    '<i class="i_u_close"></i>',
                '</a>',
                '<div class="tips-text">',
                    '<div class="imgInfo">',
                        '<dl class="attrchUp">',
                            '<dd>',
                                '速度：',
                                '<span id="speedEle">112k/s</span>',
                            '</dd>',
                            '<dd>',
                                '上传进度：',
                                '<span id="progressEle">42%</span>',
                                '<em class="gray" id="progressRatioEle">(43M/65M)</em>',
                            '</dd>',
                            '<dd class="mb_15">预计剩余时间：<span id="surplusTimeEle"></span></dd>',
                        '</dl>',
                    '</div>',
                '</div>',
                '<div class="tipsTop diamond"></div>',
            '</div>'].join(""),

        initialize: function (options) {
            this.controler      = options.controler;
            this.model          = options.model;
            this.listSelector   = options.listSelector;
            this.iconSelector   = options.iconSelector;
            this.subModel       = options.subModel;
            this.scrollSelector = options.scrollSelector;
        },

        logger: new top.M139.Logger({name: "M2012.Fileexpress.Cabinet.View.UploadFileList"}),

        render: function (options) {
            this.initEvents();
        },

        initEvents: function(){
            var self = this;

            //监听model层数据变化
            this.model.on("renderList", function (options) {
                !self.getListMode() ? self.renderList(options) : self.renderListIcon(options);
            });
            this.model.on("getFileMd5", function (options) {
                !self.getListMode() ? self.getFileMd5(options) : self.getFileMd5Icon(options);
            });
            this.model.on("loadstart", function (options) {
                !self.getListMode() ? self.loadstart(options) : self.loadstartIcon(options);
            });
            this.model.on("progress", function (options) {
                !self.getListMode() ? self.progress(options) : self.progressIcon(options);
            });
            this.model.on("md5Progress", function (options) {
                !self.getListMode() ? self.md5Progress(options) : self.md5ProgressIcon(options);
            });
            this.model.on("complete", function (options) {
                !self.getListMode() ? self.complete(options) : self.completeIcon(options);
            });
            this.model.on("cancel", function (options) {
                !self.getListMode() ? self.cancel(options) : self.cancelIcon(options);
            });
            this.model.on("error", function (options) {
                !self.getListMode() ? self.error(options) : self.errorIcon(options);
            });
            this.model.on('autoSaveDisk',function(){
				//self.isHasMy139(function(){
			        //var currentFile = self.model.get("currentFile");
					//console.log(currentFile)
				//});
            })
        },

        getListMode: function(){
            return mainView.model.get("listMode");// 列表模式：0 列表 1 图标
        },
		isHasMy139: function(callback){
			var self = this;
            self.model.getDirectorys(function(result){
	            if(result.responseData && result.responseData.code== 'S_OK'){
					var directorys = result.responseData['var'].directorys;
					if(directorys.length != 0){self.model.set('RootId',directorys[0].parentDirectoryId)}
					$.each(directorys,function(i,item){
						if(item.directoryName == '139邮箱'){
							self.model.set('my139Id',item.directoryId)
						}
					})
					if(self.model.get('my139Id')){
						var directoryId = self.model.get('my139Id');
						self.isHasMyAttach(directoryId)
					}else{
						var options ={};
							options.name = "139邮箱";
						self.createDir(function(result){
							if(result.responseData && result.responseData.code== 'S_OK'){							
								var directoryId = result.responseData['var'].directoryId;
								self.model.set('my139Id',directoryId)	
								self.isHasMyAttach(directoryId)
							}
	
						},options);
					}
					//console.log(self.model.directorys)
	                //self.model.setDirProperties(self.model.directorys);
	                callback && callback();
				}else{
					self.logger.error("getDirectorys returndata error", "[disk:getDirectorys]", result);
				}
            })
		},
		isHasMyAttach : function(directoryId){
			var self = this;
			self.model.getfiles(function(result){
	            if(result.responseData && result.responseData.code== 'S_OK'){
					var directorys = result.responseData['var'].files;
					$.each(directorys,function(i,item){
						if(item.name == '我的附件'){
							self.model.set('attachId',item.id);
						}
					})
					if(self.model.get('attachId')){
						self.saveToDisk();
					}else{
						var options ={};
							options.name = "我的附件";
							options.parentId = self.model.get('my139Id');
							
						self.createDir(function(result){
							if(result.responseData && result.responseData.code== 'S_OK'){							
								var directoryId = result.responseData['var'].directoryId;
								self.model.set('attachId',directoryId)	
								self.saveToDisk();
							}
	
						},options);
					}
					//console.log(self.model.directorys)
	                //self.model.setDirProperties(self.model.directorys);
	                //callback && callback();
				}else{
					self.logger.error("getfiles returndata error", "[disk:fileListPage]", result);
				}
				
			},directoryId)
			
		},
        //新建目录
        createDir: function (callback, options) {
            var self = this,options = options||{};
            self.model.callApi("disk:createDirectory", getData(), function (result) {
                callback && callback(result);
            });
            function getData(){
                if (!options.parentId) {
                    options.parentId = self.model.get("RootId");
                    options.dirType = '1';
                }
                return options;
            }
        },
       // 获取当前目录类型,提供给服务端的根目录type为1
        getDirTypeForServer: function(){
            var curDirType = this.get("curDirType");
            return curDirType == this.dirTypes.ROOT ? this.dirTypes.USER_DIR : curDirType;
        },
        saveToDisk : function(){
	        var self = this;
	        self.model.saveToDisk(function(response){
                if (response.responseData && response.responseData.code == "S_OK") {
						BH({key:'diskv2_cabinet_auto_savesuc'});                	
	                    var tipMsg = "存彩云网盘成功";
                    //if (This.options.comeFrom !== 'fileCenter' || top.Links !=="undefined") {// 文件提取中心是独立的页面，没办法打开彩云
                        //tipMsg += "，<a href='javascript:;' onclick='top.Links.show(\"diskDev\",\"&id={0}\",true);top.FF.close();return false;'>去查看</a>";
                    //}
                    //var tipMsgStr = tipMsg.format(dirId);
					M139.UI.TipMessage.show(tipMsg,{delay : 5000}); 
                //    top.$Msg.alert(tipMsg.format(top.$T.Utils.htmlEncode(names), dirId), {
	            //        isHtml: true
	            //    });
                }else if(response.responseData.code == "-7"){
                	var html = response.responseData.summary;
	                //单文件超过大小
                    var vipInfo = top.UserData.vipInfo;
                    if (vipInfo && vipInfo.serviceitem != "0016" && vipInfo.serviceitem != "0017") {
                        html += '&nbsp;<a href="javascript:;" style="text-decoration: underline;" onclick="var topWin = top; topWin.FF.close();topWin.$App.show(\'mobile\');return false;">上传更大单个文件</a>';
                    }
	                top.FF.close();
	                top.$Msg.alert(html, {
	                    icon:"warn",
	                    isHtml: true
	                });
                }else if(response.responseData.code == "-4"){
                	var html = response.responseData.summary;
	                top.FF.close();
	                top.$Msg.alert(html, {
	                    icon:"warn",
	                    isHtml: true
	                });
                } else {
                    top.$Msg.alert("保存失败，请稍后重试", { ico: "warn" });
                }
	        })
        },
        //获取当前模式下的容器
        getContainer: function(){
            return !this.getListMode() ? this.getListContainer() : this.getIconContainer();
        },

        renderList: function (options) {
            var self = this;

            this.returnFirstPage();

            //等待视图模板
            var defaultTemplete = self.model.format(this.itemTemplete, {
                subTemplete: this.progressBarTemplete
            });

            this.createList({
                fileList: options.fileList,
                fileNameLen: 30,
                defaultTemplete: defaultTemplete
            });
        },

        //创建上传列表
        createList: function (options) {
            var self = this;
            var fileList = options.fileList;
            var div = $("<div></div>");
            var $item = "";
            var templete = "";
            var fileListNum = this.model.uploadFileNum = fileList.length;

            for (var i = 0; i < fileListNum; i++) {
                var file = fileList[i];

                if (file.state != 0) {
                    var data = {
                        fileName: $T.Html.encode(self.model.getShortName(file.name, options.fileNameLen)),
                        expandName: self.model.getExtendName(file.name),
                        fileSize: top.M139.Text.Utils.getFileSizeText(file.size),
                        clientTaskno: file.clientTaskno
                    };

                    templete = options.defaultTemplete;

                    $item = $(top.M139.Text.Utils.format(templete, data));
                    div.append($item);
                    this.model.fileListEle[file.clientTaskno] = $item;
                    this.model.set("needUploadFileNum", this.model.get("needUploadFileNum") + 1);
                }
            }

            if (div.children().length == 0) return;

            this.deleteEmptyContainer();
            this.insertEle(div.children());
            this.deleteExcessEle();
            this.controlScroll();
            this.bindCoperationEvent();
        },

        insertEle: function (elem) {
            var container = this.getContainer();

            container.prepend(elem);
            this.el.scrollTop = 0;
        },

        bindCoperationEvent: function(){
            var self = this;
            var container = !this.getListMode() ? this.getListContainer() : this.getIconContainer();

            container.click(function(e){
                self.operateHandle(e);
            });
        },

        operateHandle: function (e) {
            var target = e.target;

            if (target.tagName == "A") {
                var name = target.getAttribute("name");
                var $target = $(target);

                this.model.currentItem = !this.getListMode() ? $target.parents("tr") : $target.parents("li");
                this.command(name);
            }
        },

        command: function (name) {
            var self = this;
            var currentItem = self.model.currentItem;

            switch (name) {
                case "deleteEle":
                    currentItem.remove();
                    return;
                case "upgradeMail":
                    top.$App.showOrderinfo();
                    return;
                case "installTool":
                    window.open(self.model.installToolUrl);
                    return;
            }
        },

        getFileMd5: function(){
            var self = this,
                currentFile = this.model.get("currentFile"),
                clientTaskno = currentFile.clientTaskno,
                currentItem = this.model.fileListEle[clientTaskno];

            currentItem.find(".attachment").html(this.md5LoadingTemplete);
        },

        loadstart: function(){
            var self = this,
                currentFile = this.model.get("currentFile"),
                clientTaskno = currentFile.clientTaskno,
                currentItem = this.model.fileListEle[clientTaskno];

            var progressBarHtml = top.M139.Text.Utils.format(this.progressBarTemplete, {
                fileSize: top.M139.Text.Utils.getFileSizeText(currentFile.size)
            });
            currentItem.find(".attachment").html(progressBarHtml);

            var btnSwitchUploadEle = currentItem.find(".btn-switch-upload");
            btnSwitchUploadEle.show();

            btnSwitchUploadEle.toggle(function(){//暂停
                var btn = $(this);

                btn.html("续传");
                /*if (btn.next().attr("class") == "btn-delete") {
                    btn.next().show();
                } else {
                    var deleteHtml = top.M139.Text.Utils.format(self.deleteBtnTemplete, {
                        fileId: currentFile.businessId,
                        fileOriginName: currentFile.name
                    });
                    btn.after(deleteHtml);
                }*/
                self.model.set("isStop", true);
                self.controler.onabort(clientTaskno);
            }, function(){//续传
                var btnTxtEle = $(this),
                    itemUploadEle = btnTxtEle.parents(".item-upload");

                btnTxtEle.html("暂停");
                self.model.set("isStop", false);
//                    .next().hide();

                //当前上传文件在上传队列中的索引
                var clientTaskno = itemUploadEle.attr("clientTaskno");

                self.controler.uploadHandle(function (options) {
                    self.error.call(self, options);
                }, null, clientTaskno);
            });
        },

        //options: {clientTaskno, sendSize, totalSize, speed, surplusTime}
        progress: function(){
            var currentFile = this.model.get("currentFile");
            var ratioSend = Math.round(currentFile.sendSize / currentFile.totalSize * 100) + "%";
            var currentItem = this.model.fileListEle[currentFile.clientTaskno];

            currentItem.find(".progressBarCur span").css({width: ratioSend});//上传进度显示
            currentItem.find(".state-upload").html(top.M139.Text.Utils.format(this.stateUploadTemplete, {
                speed: currentFile.speed,
                surplusTime: currentFile.surplusTime
            }));
        },

        md5Progress: function(){
            var currentFile = this.model.get("currentFile");
            var currentItem = this.model.fileListEle[currentFile.clientTaskno];

            currentItem.find(".attachment").html(top.M139.Text.Utils.format(this.md5LoadingPercentTemplete, {
                md5Percent: currentFile.md5Percent
            }));
        },

        md5ProgressIcon: function(){
            var currentFile = this.model.get("currentFile");
            var currentItem = this.model.fileListEle[currentFile.clientTaskno];

            currentItem.find(".progressBarWrap").html(top.M139.Text.Utils.format(this.md5LoadingPercentTemplete, {
                md5Percent: currentFile.md5Percent
            }));
        },

        complete: function(){
            var self = this;
            var currentFile = this.model.get("currentFile");//当前上传文件信息
            var clientTaskno = currentFile.clientTaskno;
            var currentItem = this.model.fileListEle[clientTaskno];
            var currentFileSize = currentFile.size;
            var currentFileNameOrigin = currentFile.name;
            var currentFileBusinessId = currentFile.businessId;
            var currentFileName = this.model.getFullName(currentFileNameOrigin);

            currentItem.find(".state-upload").html("成功");
            currentItem.find(".btn-switch-upload").hide();
            currentItem.find(".progressBarCur span").css({"width": "100%"}); //单副本上传控件进度条显示
            currentItem.find(".attachment").show();

            currentItem.find("td[rel='uploadDate']").html(currentFile.fileInfo.createTime);
            currentItem.find("td[rel='maxSaveTime']").html(currentFile.fileInfo.remain);

            currentItem.find("input[type='checkbox']").attr({'fid': currentFileBusinessId,'disabled':false});
            currentItem.find(".attchName").attr("title", currentFileNameOrigin);
            currentItem.find(".nameContainer em").attr("fsize", currentFileSize)
                .attr("fid", currentFileBusinessId)
                .eq(0).html(self.model.getShortName(currentFileNameOrigin, 30))
                .next().attr("fname", currentFileName).attr("value", currentFileName);

            var successHtml = top.M139.Text.Utils.format(this.fileOperationTmplete, {
                businessId: currentFileBusinessId,
                fileNameOrigin: $T.Html.encode(currentFileNameOrigin)
            });

            setTimeout(function(){
                currentItem.find(".attachment").html(successHtml);
				currentItem.find(".attchName").css("padding-top","6px");
            }, 1000);

            this.sucModelHandle();
        },

        cancel: function (options) {

        },

        error: function(){
            var self = this;
            var currentFile = this.model.get("currentFile");
            var clientTaskno = currentFile.clientTaskno;
            var controler = this.controler;
            var currentItem = this.model.fileListEle[clientTaskno];
            var progressBarHtml = top.M139.Text.Utils.format(this.progressBarTemplete, {
                fileSize: top.M139.Text.Utils.getFileSizeText(currentFile.size)
            });

            currentItem.find(".attachment").html(top.M139.Text.Utils.format(this.errUploadTemplete, {
                errInfo: currentFile.summary || "上传失败！"
            }));
            currentItem.find("input[type='checkbox']").attr("disabled", true);
            currentItem.find("a[name='againUpload']").click(function(){//重传
                var btnTxtEle = $(this);
                var itemUploadEle = btnTxtEle.parents(".item-upload");
                var clientTaskno = itemUploadEle.attr("clientTaskno");

                $(this).parent().html(progressBarHtml);//插入进度条dom
                self.controler.uploadHandle(function (options) {
                    self.error.call(self, options);
                }, null, clientTaskno);
            });
                /*.end().find("a[name='deleteEle']").click(function(){//删除文件
                    currentItem.remove();
                });*/

            this.errModelHandle();
        },

        renderListIcon: function (options) {
            var self = this;

            this.returnFirstPage();

            //等待视图模板
            var defaultTemplete = self.model.format(this.itemIconTemplete, {
                subTemplete: this.progressBarIconTemplete
            });

            this.createList({
                fileList: options.fileList,
                fileNameLen: 10,
                defaultTemplete: defaultTemplete
            });
//            this.showProgressTip();
        },

        showProgressTip: function(){
            var tipEle = $("#progressTip");

            if (tipEle.length == 0) {
                this.model.progressTipEle = $(this.progressTipTemplete);
                $("body").append(this.model.progressTipEle);
            }
        },

        getFileMd5Icon: function(){
            var self = this,
                currentFile = this.model.get("currentFile"),
                clientTaskno = currentFile.clientTaskno,
                currentItem = this.model.fileListEle[clientTaskno];

            currentItem.find(".progressBarWrap").html(this.md5LoadingTemplete);
        },

        loadstartIcon: function(){
            var self = this,
                currentFile = this.model.get("currentFile"),
                clientTaskno = currentFile.clientTaskno,
                currentItem = this.model.fileListEle[clientTaskno];

            var progressBarIconHtml = top.M139.Text.Utils.format(this.progressBarIconTemplete, {
                fileSize: top.M139.Text.Utils.getFileSizeText(currentFile.size)
            });
            currentItem.find(".progressBarWrap").after(progressBarIconHtml).remove();

            var btnSwitchUploadEle = currentItem.find(".btn-switch-upload");
            btnSwitchUploadEle.show();

            btnSwitchUploadEle.toggle(function(){//暂停
                $(this).html("续传");
                self.controler.onabort(clientTaskno);
            }, function(){//续传
                var btnTxtEle = $(this),
                    itemUploadEle = btnTxtEle.parents(".item-upload");

                btnTxtEle.html("暂停");

                //当前上传文件在上传队列中的索引
                var clientTaskno = itemUploadEle.attr("clientTaskno");

                self.controler.uploadHandle(function (options) {
                    self.error.call(self, options);
                }, null, clientTaskno);
            });

            /*currentItem.hover(function(){
                var progressTipEle = self.model.progressTipEle;
                var currentFileOffset = currentItem.offset();

                progressTipEle.css({
                    left: currentFileOffset.left,
                    top: currentFileOffset.top + 170
                }).show();
                setTimeout(function(){
                    progressTipEle.hide();
                }, 3000);
            });*/
        },

        //options: {clientTaskno, sendSize, totalSize, speed, surplusTime}
        progressIcon: function(){
            var currentFile = this.model.get("currentFile");
            var ratioSend = Math.round(currentFile.sendSize / currentFile.totalSize * 100) + "%";
            var currentItem = this.model.fileListEle[currentFile.clientTaskno];
            var progressTipEle = this.model.progressTipEle;

            currentItem.find(".progressBarCur span").css({width: ratioSend});//上传进度显示
            currentItem.find(".progressBarWrap .gray").html(ratioSend);
//            progressTipEle.find("speedEle").html(currentFile.speed);
//            progressTipEle.find("progressEle").html(ratioSend);
//            progressTipEle.find("progressRatioEle").html("(" + currentFile.sendSize + "/" + currentFile.totalSize + ")");
//            progressTipEle.find("surplusTimeEle").html(currentFile.surplusTime);
        },

        completeIcon: function(){
            var currentFile = this.model.get("currentFile");//当前上传文件信息
            var clientTaskno = currentFile.clientTaskno;
            var currentItem = this.model.fileListEle[clientTaskno];
            var currentFileSize = currentFile.size;
            var currentFileNameOrigin = currentFile.name;
            var currentFileBusinessId = currentFile.businessId;
            var currentFileName = this.model.getFullName(currentFileNameOrigin);
            var progressTipEle = this.model.progressTipEle;

            currentItem.find(".state-upload").html("成功");
            currentItem.find(".progressBarWrap").remove();
            currentItem.find(".fileNameBar").after(top.M139.Text.Utils.format(this.fileSizeBar, {
                fileSize: top.M139.Text.Utils.getFileSizeText(currentFileSize)
            }));

            currentItem.find(".btn-switch-upload").hide();
            currentItem.find(".progressBarCur span").css({"width": "100%"}); //单副本上传控件进度条显示
            currentItem.find(".attachment").show();
            currentFile.thumbUrl && currentItem.find(".viewPic img").attr("src", currentFile.thumbUrl);

            currentItem.find("input[type='checkbox']").attr({"fid":currentFileBusinessId,'disabled':false});
            currentItem.find(".attchName").attr("title", currentFileNameOrigin);
            currentItem.find(".itemName em").text(currentFileName.substr(0,15));

            var successHtml = top.M139.Text.Utils.format(this.fileOperationIconTmplete, {
                businessId: currentFileBusinessId,
                fileNameOrigin: $T.Html.encode(currentFileNameOrigin)
            });

            currentItem.find(".viewIntroduce").append(successHtml);
            this.sucModelHandle();
//            progressTipEle.unbind("hover");
        },

        cancelIcon: function (options) {

        },

        errorIcon: function(){
            var self = this;
            var currentFile = this.model.get("currentFile");
            var clientTaskno = currentFile.clientTaskno;
            var controler = this.controler;
            var currentItem = this.model.fileListEle[clientTaskno];
            var progressBarHtml = top.M139.Text.Utils.format(this.progressBarTemplete, {
                fileSize: top.M139.Text.Utils.getFileSizeText(currentFile.size)
            });

            currentItem.find(".attachment").html(this.errUploadTemplete);
            currentItem.find("a[name='againUpload']").click(function(){//重传
                var btnTxtEle = $(this);
                var itemUploadEle = btnTxtEle.parents(".item-upload");
                var clientTaskno = itemUploadEle.attr("clientTaskno");

                $(this).parent().html(progressBarHtml);//插入进度条dom
                self.controler.uploadHandle(function (options) {
                    self.error.call(self, options);
                }, null, clientTaskno);
            });
                /*.end().find("a[name='deleteEle']").click(function(){//删除文件
                    currentItem.remove();
                });*/
            this.errModelHandle();
        },

        //将上传失败文件的数据存储在fileList中
        errModelHandle: function(){
            var currentFile = this.model.get("currentFile");
            var businessId = currentFile.businessId;
            var newFile = currentFile.fileInfo;

            this.subModel.get("fileList").unshift(newFile);
            this.subModel.get("originalList").unshift(newFile);
            this.model.set("uploadedFileNum", this.model.get("uploadedFileNum") + 1);
        },

        //将上传成功文件的数据存储在fileList中
        sucModelHandle: function(){
            var currentFile = this.model.get("currentFile");
            var newFile = currentFile.fileInfo;

            this.subModel.get("fileList").unshift(newFile);
            this.subModel.get("originalList").unshift(newFile);
            this.model.set("uploadedFileNum", this.model.get("uploadedFileNum") + 1);
        },

        //如果当前不在第一页，回到第一页
        returnFirstPage: function(){
            if (this.subModel && this.subModel.get("pageIndex") > 1) {
                this.subModel.set("pageIndex", 1);
            }
        },

        //上传文件时删除超过当前页的文件
        deleteExcessEle: function(){
            var container = this.getContainer();
            var uploadFileNum = this.model.uploadFileNum;
            var children = container.children();
            var childrenLen = children.length;

            if (childrenLen > this.subModel.get("pageSize")) {
                for (var i = 30; i < childrenLen; i++) children.eq(i).remove();
            }

            //重新生成分页按钮
            this.subModel && this.subModel.trigger("createPager");
        },

        //删除空容器
        deleteEmptyContainer: function(){
            if (this.subModel) {
                var fileItem = this.subModel.get("fileList");
                fileItem.length == 0 && this.getContainer().html("");
            }
        },

        //如果在列表底部上传文件，将滚动条移动到顶部
        controlScroll: function(){
            if (this.scrollSelector) {
                $(this.scrollSelector)[0].scrollTop = 0;
            }
        }
    }));
})(jQuery, Backbone, _, M139);

/**
 * @fileOverview 文件快递暂存柜状态栏视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Fileexpress.Cabinet.View.Toolbar', superClass.extend(
	/**
	 *@lends M2012.Fileexpress.Cabinet.View.prototype
	 */
	{
		el : "body",
		name : "M2012.Fileexpress.Cabinet.View.Toolbar",
		events : {
			"click #download" : "download", 
			"click #sendToMail" : "sendToMail", 
			"click #sendToPhone" : "sendToPhone", 
			"click #renew" : "renew", 
			"click #saveToDisk" : "saveToDisk", 
			"click #rename" : "rename", 
			"click #deleteFile" : "deleteFile",
			"click #sortDock": "showSortTable"
		},
		initialize : function(options) {
			var self = this;
			this.model = options.model;
			this.initEvents();
			return superClass.prototype.initialize.apply(this, arguments);
		},
		initMoreBtns : function(flag){ //已关闭更多按钮
			var self = this;
			$("#more").html("");
			var menuItems = [
					{
                        text: "发送到手机",
                        onClick: function(){ self.sendToPhone();}
                    },
                    {
                        text: "重命名",
                        onClick: function(){ self.rename();}
                    },
                    {
                        text: "删除",
                        onClick: function(){ self.deleteFile();}
                    }
                ];
			if(!flag){
				menuItems = [menuItems[2]];
			}else{
				menuItems = [menuItems[1],menuItems[2]];
			}
			M2012.UI.MenuButton.create({
				text:"更多",
				container:$("#more"),
				leftSibling:false, //左边还有按钮，影响样式
				rightSibling:false, //右边还有按钮，影响样式
				menuItems:menuItems
			});
			//修改样式 默认的button已经修改
		//	$("#more > a").removeClass("btnTb").addClass("btn ml_10");
		//	$("#more span").replaceWith('<em>更多</em><i class="triangle t_globalDown"></i>');
		},
		initEvents : function() {
			var self = this;
			$("#sendToPhone").hide();
			//$("#rename").hide();
			//$("#deleteFile").hide();
			$("#more").hide();
			//this.initMoreBtns(1);
			// 关闭小工具引导层
			$("#closeSetupTool").click(function(event){
				$("#setupToolContainer").hide();
			});

			// 绑定排序菜单单击事件 todo
			var sortTypes = self.model.sortTypes;
        	$("#sortMenus li[name='fileName']").click(function(event){
        		self.model.set('sortType', sortTypes['FILE_NAME']);
        		self.model.set('sortIndex', -self.model.get('sortIndex'));
        		
        		$("#sortMenus").hide();
        	});
        	$("#sortMenus li[name='createTime']").click(function(event){
        		self.model.set('sortType', sortTypes['CREATE_TIME']);
        		self.model.set('sortIndex', -self.model.get('sortIndex'));
        		
        		$("#sortMenus").hide();
        	});
        	$("#sortMenus li[name='expiryDate']").click(function(event){
        		self.model.set('sortType', sortTypes['EXPIRY_DATE']);
        		self.model.set('sortIndex', -self.model.get('sortIndex'));
        		
        		$("#sortMenus").hide();
        	});
        	$("#sortMenus li[name='downloadTimes']").click(function(event){
        		self.model.set('sortType', sortTypes['DOWNLOAD_TIMES']);
        		self.model.set('sortIndex', -self.model.get('sortIndex'));
        		
        		$("#sortMenus").hide();
        	});
        	$("#sortMenus li[name='fileSize']").click(function(event){
        		self.model.set('sortType', sortTypes['FILE_SIZE']);
        		self.model.set('sortIndex', -self.model.get('sortIndex'));
        		
        		$("#sortMenus").hide();
        	});

            //上传按钮初始化
//            try {
                this.createBtnUpload();
//            } catch (ex) {}
		},
        createBtnUpload: function(){
            var This = this;
            mainView.uploadModel = new M2012.Fileexpress.Cabinet.Model.Upload({type:"file"});
        //    parent.$("#floatLoadDiv").html("");//clear
            window.isCabinet = true;
            window.UploadApp = new UploadFacade({
                containerWindow:parent,
                btnUploadId: parent.document.getElementById("uploadFileInput") || parent.document.getElementById("floatLoadDiv"),//上传按钮dom元素的id
                fileNamePre: "filedata",
                model: mainView.uploadModel
            });
            
            parent.InstanceUpload = window.InstanceUpload;

            UploadApp.on("select", function (options) {
                var fileList = options.fileList;
                var uploadType = this.currentUploadType;

                if (this.model.filterFile(fileList, uploadType)) {
                    this.model.trigger("renderList", {fileList:fileList});
                    this.setFileList(fileList);
                }
            });

            UploadApp.on("prepareupload", function(){
                var self = this;

                this.uploadHandle(function(){
                    self.model.trigger("error");
                }, function(){
                    self.model.trigger("getFileMd5");
                });
            });

            UploadApp.on("loadstart", function(){
                this.model.trigger("loadstart");
            });

            UploadApp.on("progress", function(){
                this.model.trigger("progress");
            });

            UploadApp.on("md5progress", function(){
                this.model.trigger("md5Progress");
            });

            UploadApp.on("complete", function(){
                var self = this;
                var UploadModel = self.model;
                var currentFile = UploadModel.get("currentFile");
                var clientTaskno = currentFile.clientTaskno;
                var responseText = currentFile.responseText;

                UploadModel.completeHandle(clientTaskno, responseText, function (thumbUrl) {//上传成功
                    thumbUrl && (UploadModel.get("currentFile").thumbUrl = thumbUrl);
                    UploadModel.trigger("complete");
                    UploadModel.trigger("autoSaveDisk");
                    self.uploadHandle(function(){//继续传下个文件
                        UploadModel.trigger("error");
                    }, function(){
                        UploadModel.trigger("getFileMd5");
                    });
                }, function(msg){//上传失败
                    self.model.trigger("error");
                }, self);
				$("#toolBar").show();
            });

            UploadApp.on("error", function(){
                var self = this;
                var currentFile = this.model.get("currentFile");
                var clientTaskno = currentFile.clientTaskno;
                var state = currentFile.isContinueUpload;

                behaviorUploadErr();
                if (!state) {
                    this.model.trigger("error");
                    return;
                }

                this.uploadHandle(function(){//续传
                    self.model.trigger("error");
                }, function(){
                    self.model.trigger("getFileMd5");
                }, clientTaskno);
            });

            This.uploadFileListView = new M2012.Fileexpress.Cabinet.View.UploadFileList({
                listSelector: "#fileList tbody",
			//	listSelector : frames["ifbg"].document.getElementById("fileList").getElementsByTagName("tbody")[0],
                iconSelector: "#fileList ul",
			//	iconSelector : frames["ifbg"].document.getElementById("fileList").getElementsByTagName("ul")[0],
                controler: UploadApp,
                model: mainView.uploadModel,
                subModel: This.model,
                scrollSelector: "#fileList"
            });
            This.uploadFileListView.render();

            function behaviorUploadErr(){
                mainView.uploadModel.logger.error(mainView.uploadModel.curConditionType + " upload distributed error", "[fastuploadsvr.fcg]");
            }
        },
		render : function() {
			var self = this;
			if(!self.model.isSetupMailTool() && self.model.get('isMailToolShow')){
				//$("#maxUploadSize").html(self.model.getMaxUploadSize());
		 		$("#setupToolContainer").show();
		 		self.model.set('isMailToolShow', 0);// 只提示一次
		 		// setTimeout(function(){
		 			// $("#setupToolContainer").hide();
		 		// }, 5000);
		 	}
		 	self.model.trigger("createPager", null);
		},
		upload : function(event) {
			var self = this;
			self.doCommand(self.model.commands.UPLOAD);
		},
		download : function(event) {
			var self = this;
			BH({key : "fileexpress_cabinet_download"});
			
			self.doCommand(self.model.commands.DOWNLOAD);
		},
		sendToMail : function(event) {
			var self = this;
			self.doCommand(self.model.commands.SEND_TO_MAIL);
			event.preventDefault();
		},
		sendToPhone : function(event) {
			var self = this;
			self.doCommand(self.model.commands.SEND_TO_PHONE);
			event.preventDefault();
		},
		renew : function(event) {
			var self = this;
			self.doCommand(self.model.commands.RENEW);
		},
		saveToDisk : function(event) {
			var self = this;
			self.doCommand(self.model.commands.SAVE_TO_DISK);
		},
		rename : function(event) {
			var self = this;
			if(self.model.get('isBtnActivate')){
				self.doCommand(self.model.commands.RENAME);
			}else{
				top.M139.UI.TipMessage.show(self.model.tipWords.ONLY_RENAME_ONE, { delay: 3000, className: "msgYellow" }); 
			}
		},
		deleteFile : function(event) {
			var self = this;
			self.doCommand(self.model.commands.DELETE_FILE);
		},
		doCommand : function(command, args) {
			if(!args) {
				args = {};
			}
			args.command = command;
			top.$App.trigger("cabinetCommand", args);
		},
        // todo
		showSortTable : function(event){
			var jSortMenus = $("#sortMenus");
			jSortMenus.css({width : 125});
			
			jSortMenus.show();
			M139.Dom.bindAutoHide({
                action: "click",
                element: jSortMenus[0],
                stopEvent: true,
                callback: function () {
                    jSortMenus.hide();
                    M139.Dom.unBindAutoHide({ action: "click", element: jSortMenus[0]});
                }
            });
            top.$Event.stopEvent(event);
		},
        // 根据排序类型渲染排序菜单
		renderSortMenu : function(){
			var self = this;
        	var sortType = self.model.get('sortType');
        	var selector = "#sortMenus li[name="+sortType+"]";
	    	var jSortType = $(selector);
	    	
	    	$("#sortMenus li.cur").removeClass('cur').find('em').remove('.downRinking');
	    	
	    	var sortState = self.model.get('sortIndex') == 1?'↑':'↓';
        	jSortType.addClass('cur').find('span').append('<em class="downRinking">'+sortState+'</em>');
		},
		createPager : function() {
			var self = this;
			var pagerContainer = $("#filelist_pager");
			pagerContainer.html("");
			//先清除
			var pageCount = this.model.getPageCount();
			//生成分页
			this.pager = M2012.UI.PageTurning.create({
				styleTemplate : 2,
				container : pagerContainer,
				pageIndex : this.model.get("pageIndex"),
				maxPageButtonShow : 5,
				pageCount : pageCount
			});
			this.pager.on("pagechange", function(index) {
				self.model.set("pageIndex", index);
			});
		}
	}));
})(jQuery, _, M139);

/**
 * @fileOverview 文件快递暂存柜视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Fileexpress.Cabinet.View.Filelist', superClass.extend(
	/**
	 *@lends M2012.Fileexpress.Cabinet.View.prototype
	 */
	{
		el : "body",
		name : "M2012.Fileexpress.Cabinet.View.Filelist",
        template: [ '<!--[if lt ie 8]>',
				         '<div style=\'+zoom:1;\'><![endif]-->',
				         '<table cellpadding="0" cellspacing="0" class="listHead newShareTable" id="fileList2">',
				             '<tbody>',
				             '<!--item start-->',
				 	    	 '<tr>',
				                 '<td class="wh1 t-check"><input fid="$fid" type="checkbox"></td>',
				                 '<td>',
									'<div class="fl p_relative">',
										'<a href="javascript:void(0);" class="@getFileIconClass()"></a>',
								//		'@isShare()',
									'</div>',
				                    '<a hideFocus="1" href="javascript:void(0)" class="attchName" title="@getFullFileName()" style="">',
								//	'<i class="@getFileIconClass()"></i>',
									'<span name="nameContainer">',
										'<em fid="$fid" fsize="$fileSize" name="fname">@getShortName(30)</em>',
										'<input type="text" fname="@getFullName()" exname="@getExtendName()" value="@getFullName()" maxlength="255" size="30" style="display:none;"></input>','<em fid="$fid" fsize="$fileSize" name="fname">@getExtendName()</em>',
									'</span>',
									'</a>',
				                    '<div class="attachment" style="display: none;">@getOperateHtml()</div>',
				                 '</td>',
				                 '<td class="wh4 gray">$createTime</td>',
				                 '<td class="wh4 gray">$remain</td>',
				                 '<td class="wh5 gray">$downloadTimes</td>',
				                 '<td class="wh6 gray">@getFileSize()</td>',
				             '</tr>  ',
				             '<!--item end-->',
				           '</tbody>',
				 	 '</table>',
				       '<!--[if lt ie 8]></div><![endif]-->'].join(""),
		templateIcon : [ '<ul>',
							 '<!--item start-->',
							 '<li class="listItem">',
					         	'<p class="chackPbar"><input fid="$fid" type="checkbox" class="checkView" style="display:none;"/></p>',
					     		'<a hideFocus="1" href="javascript:void(0)" class="@getPicClass()"><img fid="$fid" fsize="$fileSize" name="fname" src="@getThumbnailUrl()" style="width: 65px; height: 65px;"></a>',
					             '<div class="viewIntroduce" style="padding: 0 3px;">',
					             	'<p title="@getFullFileName()"><span class="itemName" name="nameContainer"><em><a hideFocus="1" fid="$fid" fsize="$fileSize" href="javascript:void(0)" name="fname">@getShortName(15)</a></em><input type="text" fname="@getFullName()" exname="@getExtendName()" value="@getFullName()" maxlength="255" size="30" style="display:none; width:110px;"></input></span><span fid="$fid" fsize="$fileSize" name="fname" style="cursor:pointer">@getExtendName()</span></p>',
					                '<p class="gray" style="display: none;">@getFileSize()</p>',
					                '@getOperateHtml()',
					             '</div>',
					 		 '</li>',
					 		 '<!--item end-->',
						'</ul>'].join(""),
		templateNoFile : [ '<!--[if lt ie 8]>',
				         '<div style=\'+zoom:1;\'><![endif]-->',
				         '<table cellpadding="0" cellspacing="0" class="listHead">',
				             '<tbody>',
				             '<tr><td style="border-bottom: 0;">',
								'<div class="imgInfo addr-imgInfo ta_c">',
										'<dl>',
											'<dt><img src="../../images/module/networkDisk/cabinet.jpg" /></dt>',
											'<dd><p class="fz_14">暂无文件</p></dd>',
											'<dd><p>临时文件存在暂存柜，绿色环保，点击左上角“上传”按扭添加！</p></dd>',
										'</dl>',
								'</div>',
							 '</td></tr>',
				           '</tbody>',
				 	 '</table>',
				     '<!--[if lt ie 8]></div><![endif]-->'].join(""),
		events:{
			"click #selectAll" : "allOrNone"
		},
		allOrNone : function(event){
			var self = this;
			var checked = $("#selectAll").attr('checked')?true:false;
        	if(checked){
        		self.model.selectAll();
        	}else{
        		self.model.selectNone();
        	}
        	
        	self.reselectFiles();
        	self.renderSelectCount();
		},
		initialize : function(options) {
			this.model = options.model;
			this.toolbarView = options.toolbarView;
			this.initEvents();
			return superClass.prototype.initialize.apply(this, arguments);
		},
		initEvents : function(){
        	var self = this;
        	var sortTypes = self.model.sortTypes;
        	// 绑定表头排序单击事件 todo
        	var sortTypeMap = {
        		fileName : 'FILE_NAME',
        		createTime : 'CREATE_TIME',
        		expiryDate : 'EXPIRY_DATE',
        		downloadTimes : 'DOWNLOAD_TIMES',
        		fileSize : 'FILE_SIZE'
        	};
        	$("#fileName,#createTime,#expiryDate,#downloadTimes,#fileSize").click(function(event){
        		var id = $(this).attr('id');
        		self.model.set('sortType', sortTypes[sortTypeMap[id]]);
        		self.model.set('sortIndex', -self.model.get('sortIndex'));
        	});
        },
        // 根据排序类型执行排序操作
        sortByType : function(){
        	var self = this;
        	var sortType = self.model.get('sortType');
	    	var jSortType = $("#"+sortType);
	    	self.sort({jEle : jSortType, field : sortType, dataSource : self.model.get('fileList')});
	    	if(sortType === self.model.sortTypes['FILE_NAME']){
	    		jSortType.siblings().find("i").attr('class', '');
	    	}else{
	    		jSortType.parent().siblings().find("i").attr('class', '');
	    	}
        },
        /*
         * 表头排序
         * @param options.jEle 表头项对应的JQuery对象
         * @param options.field 表头项对应的排序字段
         * @param options.dataSource 排序数据源
         */
        sort : function(options){
        	var self = this;
        	var jI = getJI(options.jEle);
    		self.model.sort({field : options.field, dataSource : options.dataSource});
    		self.render();
    		
    		var sortClass = jI.attr('class');
    		sortClass = (self.model.get('sortIndex') === -1)?'i_th0':'i_th1';
    		jI.attr('class', sortClass);
    		
    		function getJI(jEle){
    			if(jEle[0].nodeName.toLowerCase() == 'i'){
    				return jEle;
    			}else if(jEle[0].nodeName.toLowerCase() == 'span'){
    				return jEle.siblings('i');
    			}else{
    				return jEle.find('i');
    			}
    		}
        },
		// 渲染暂存柜
		render : function (){
		    var self = this;
		    var pageData = self.model.getPageData(self.model.get("pageIndex"));
		    var html = '';
		    if(pageData.length > 0){
		    	self.repeater = new Repeater(self.getTemplate());
		    	self.repeater.dataModel = self.model;
		        self.repeater.Functions = self.model.renderFunctions;
		    	html = self.repeater.DataBind(pageData);
				$("#toolBar").show();
		    }else{
		    	html = self.templateNoFile;
				$("#toolBar").hide();
		    }
		 	$("#fileList").html(html);
		 	self.fixList();
		 	self.reselectFiles(pageData);
		 	self.renderSelectAll(pageData);
		 	if(pageData.length > 0){
			 	self.initClickEvents();
		 	}
		 	self.initRenameEvents();
		 	var mode = self.model.get('listMode');
		 	if(mode){
		 		self.initIconEvents();
		 		
		 		//self.loadThumbImage();// todo 通过model.renderFunctions 替换缩略图 该行可注释掉
		 		
		 		$("#cabinetSortHeader th:gt(2)").hide();
		 	}else{
		 		$("#cabinetSortHeader th:gt(2)").show();
		 	}
		},
		// 翻页需要选中上次选中的文件
		reselectFiles : function(){
			var self = this;
			$("#fileList input[type='checkbox']").each(function(i){
				var fid = $(this).attr('fid');
				if(!self.model.isUploadSuccess(fid)){
					$(this).attr('disabled', true);
				}
				
				var selectedFids = self.model.get('selectedFids');
				if($.inArray(fid, selectedFids) != -1){
					$(this).attr('checked', true);
					// 图标模式还需要给li添加选中样式
					var mode = self.model.get('listMode');
					if(mode){
						var target = $(this).parents('li');
						target.addClass('listViewHover listViewChecked');
						target.find("p.chackPbar").find('input').show();
						self.showOperatesTable(target);
					}
				}else{
					$(this).attr('checked', false);
					// 图标模式需要去掉li选中样式
					var mode = self.model.get('listMode');
					if(mode){
						var target = $(this).parents('li');
						target.removeClass('listViewHover listViewChecked');
						target.find("p.chackPbar").find('input').hide();
						self.showSizeTable(target);
					}
				}
			});
		},
		// 渲染全选按钮
		renderSelectAll : function(pageData){
			var self = this;
			var selectedCount = $("#fileList input:checked").size();
			var uploadFailureCount = $("#fileList input:disabled").size();
			var pageCount = selectedCount + uploadFailureCount;
			if(pageCount == pageData.length && selectedCount !== 0){
				$("#selectAll").attr('checked', true);
			}else{
				$("#selectAll").attr('checked', false);
			}
		},
		// 列表模式，图标模式共用以下单击事件
        initClickEvents : function(){
        	var self = this;
			$("#fileList tr").hover(function(){
				$(this).addClass("trHover");
			},function(){
				$(this).removeClass("trHover");
			});
        	$("#fileList").unbind('click').click(function(event){
        		var target = $(event.target);
        		if(target.is("input[type='checkbox']")){
        			self.selectEvent(target);
        		}else if(target.is("a[name='download']")){
        			self.downloadEvent(target);
        		}else if(target.is("a[name='send']")){
        			self.sendEvent(target);
        		}else if(target.is("a[name='renew']")){
        			self.renewEvent(target);
        		}else if(target.is("a[name='delete']")){
        			self.deleteEvent(target, true);
        		}else if(target.is("a[name='deleteUpload']")){
        			self.deleteEvent(target, true);
                }
        		// 预览文件
        		var name = target.attr('name');
        		if(name === 'fname'){
        			self.previewFile(target);
        		}
        		
        		toggleSelect(target);
        	});
        	
        	// 点击复选框以外的某些区域也可以 选中/取消 文件
        	function toggleSelect(target){
        		var mode = self.model.get('listMode');
				if(mode){
		        	if(!target.is("p") && !target.is("li")){
	                	return;
	                }
					var JCheckBox = getJCheckBox(target);
					if(JCheckBox.is(':disabled')){
						return;
					}
					
					var isSelected = JCheckBox.attr('checked');
					JCheckBox.attr('checked', isSelected?false:true);
					self.selectEvent(JCheckBox);
				}else{
					if(target.is("td") || target.is("a.attchName") || target.is("div.attachment")){
						var JCheckBox = target.parents('tr').find('input[type="checkbox"]');
						if(JCheckBox.is(':disabled')){
							return;
						}
						
						var isSelected = JCheckBox.attr('checked');
						JCheckBox.attr('checked', isSelected?false:true);
						self.selectEvent(JCheckBox);
		        	}
				}
        	};
        	
        	// 获取复选框JQuery对象
	        function getJCheckBox(target){
	        	var tagName = target[0].tagName.toLowerCase();
	        	if(tagName === 'li'){
	        		return target.find('input[type="checkbox"]');
	        	}else{
	        		return target.parents('li').find('input[type="checkbox"]');
	        	}
	        };
        },
        // 列表模式，图标模式共用，响应重命名操作
        initRenameEvents : function(){
        	var self = this;
        	$("#fileList input[type='text']").blur(function(i){
        		var target = $(this);
        		rename(target);
        	});
        	// 重命名支持回车事件
			if($B.is.ie && $B.getVersion() == 6){
				$("#fileList input[type='text']").bind('keydown', function(event){
					if(event.keyCode == M139.Event.KEYCODE.ENTER){
						var target = $(this);
						rename(target);
					}
				}).bind('keypress', function(event){
					if(event.keyCode == M139.Event.KEYCODE.ENTER){
						var target = $(this);
						rename(target);
					}
				});
			}else{
				$("#fileList input[type='text']").bind('keydown', function(event){
					if(event.keyCode == M139.Event.KEYCODE.ENTER){
						var target = $(this);
						rename(target);
					}
				});
			};
			function rename(target){
        		var oldName = $.trim(target.attr('fname'));
        		var newName = $.trim(target.val());
        		if(oldName === newName){
        			self.hideRenameTable(target);
        			return;
        		}
        		var errorMsg = self.model.getErrorMsg(newName);
        		if(errorMsg){
        			top.$Msg.alert(errorMsg).on("close", function(args){
                        setTimeout(function(){//解决ie中会失去焦点，导致重复提示
                            target.focus();
                        }, 100);
                    });
        		}else{
        			var ids = self.model.get('selectedFids').join(',');
        			var exName = $.trim(target.attr('exname'));// 拓展名
        			var options = {fileId : ids, name : newName+exName};
        			self.model.renameFile(function(result){
        				if(result.responseData.code && result.responseData.code == 'S_OK'){
		    				
		    				self.model.trigger("refresh");
							top.M139.UI.TipMessage.show(self.model.tipWords['RENAME_SUC'], {delay : 1000});
		    			}else{
		    				top.M139.UI.TipMessage.show(self.model.tipWords['RENAME_FAI'], {delay : 1000});
		    				self.hideRenameTable(target);
		    				self.logger.error("renameFiles returndata error", "[disk:renameFiles]", result);
		    			}
        			}, options);
        		}
			}
        },
        // 初始化文件列表（图标模式）事件
        initIconEvents : function(){
        	var self = this;
        	// 鼠标悬浮事件
			self.containter = {};
			var hoverTipsTemplate = ['<div class="tips netpictips pl_10" style="width:220px; top: 336px;left: 590px; z-index: 1000; background:#fff; border:1px solid #cecece;">',
								'<div class="tips-text">',
									'<div class="imgInfo" style="overflow: hidden;">',
										'<p>文件名称：{fileName}</p>',
										'<p>文件大小：{fileSize}</p>',
										'<p>上传时间：{fileTime}</p>',
									'</div>',
								'</div>',
								'<div class="tipsTop diamond" style=""></div>',
							'</div>'].join("");
        	$("#fileList li").live("mouseenter", function(event){
        		var target = $(this);
    			target.addClass('listViewHover');
    			target.find("p.chackPbar").find('input').show();
    		//	self.showOperatesTable(target);
				var fileid = target.find("img").attr("fid");
				var file = self.model.getFileById(fileid);
			//	console.log(file);
				var offset = target.offset();
				self.currentHtml = "";
				if(!file){
					fileid = Math.random().toString(); //刚上传的问题没有fileid，虚拟一个，并保存在dom，以便mouseleave的时候消失
					target.find("a[fileid]").attr("fileid", fileid);
				}
				if(fileid in self.containter){
					self.currentHtml = self.containter[fileid];
				}else{
					var formatString = $T.Utils.format(hoverTipsTemplate,{
						fileName : file.fileName,
						fileSize : $T.Utils.getFileSizeText(file.fileSize),
						fileTime : file.createTime
					});
					file.name = target.find(".viewIntroduce p").eq(0).attr("title");
					//self.currentHtml = $(formatString);
					//self.currentHtml.appendTo(document.body)
					self.currentHtml = '文件名称：'+file.name+'\n'+'文件大小：'+$T.Utils.getFileSizeText(file.fileSize)+'\n'+'上传时间：'+file.createTime;
					//self.containter[fileid] = self.currentHtml;
				}
				target.attr('title',self.currentHtml)
					//	setTimeout(function(){
				//var top1 = offset.top + 115;
				//if(offset.top + 112 + self.currentHtml.height() > $(window).height()){
					//top1 = top1 - self.currentHtml.height() - 125;
					//self.currentHtml.find(".diamond").addClass("tipsBottom").removeClass("tipsTop");
				//}else{
					//self.currentHtml.find(".diamond").addClass("tipsTop").removeClass("tipsBottom");
				//}
				//self.currentHtml.css({top: top1, left: offset.left}).show();
        	});
        	$("#fileList li").live("mouseleave", function(event){
        		var target = $(this);
        		var isSelected = target.find('input:checkbox').attr("checked");
				var fileid = target.find("img").attr("fid");
				//if(fileid in self.containter){
						//self.currentHtml = self.containter[fileid];
					//	setTimeout(function(){
							//self.currentHtml.hide();
					//	}, 50);
				//}
        		if(isSelected){
        			return;
        		}
    			target.removeClass('listViewHover listViewChecked');
    			target.find("p.chackPbar").find('input').hide();
    		//	self.showSizeTable(target);
        	});
        	
        	// 图片加载出错
        	$("#fileList img").error(function(event){
        		if(this.error){
        			this.alt = "加载有误";
        		}else{
        			this.error = 1;
        			var defaultImage = self.model.imagePath + 'default.jpg';
        			this.src = defaultImage;
        		}
        	});
        },
        // 加载缩略图  todo 若文件列表接口返回：thumbnailImage 则废弃改方法
        loadThumbImage : function(){
        	var self = this;
        	$("#fileList img").each(function(i){
        		var fid = $(this).attr('fid');
        		var fileObj = self.model.getFileById(fid);
        		var imageName = fileObj.fileName;
        		if(self.model.isImage(imageName)){
        			self.model.get('imageList').push(fileObj);
        		}else{
        			var imagePath = self.model.getThumbImagePath(imageName);
        			$(this).attr('src', imagePath);
        		}
        	});
        	// todo 从接口取图片文件的缩略图
        },
        // 复选框单击事件
        selectEvent : function(target){
        	var self = this;
    		var fid = target.attr('fid');
			var selectedFids = self.model.get('selectedFids');
			// 保存 / 清除 选中文件的ID 遍历数组，存在某项则删除，不存在则添加
			self.model.toggle(fid, selectedFids);
			// 渲染文件数量
			self.renderSelectCount();
			// 图标模式还需改变li的class属性
			var mode = self.model.get('listMode');
			if(mode){
				var isSelect = target.attr('checked');
				if(isSelect){
					target.parents('li').attr('class', 'listItem listViewHover listViewChecked');
				}else{
					target.parents('li').attr('class', 'listItem listViewHover');
				}
			}else{
				var isSelect = target.attr('checked');
				if(isSelect){
					target.parents('tr').attr('class', 'trClick');
				}else{
					target.parents('tr').attr('class', '');
				}
				
			}
        },
        // 渲染用户选中文件数量
        renderSelectCount : function(){
        	var self = this;
        	var selectedCount = self.model.get('selectedFids').length;
        	var jRename = $("#rename");
			$("#cleanSelected").click(function(){
				self.model.selectNone();
				self.reselectFiles();//渲染未选中
				self.renderSelectCount();
				$("#selectAll").attr("checked",false);
			});
			if(selectedCount > 0){
				$("#selectCount b").text(selectedCount);
    			$("#fileName").hide();
    			$("#selectCount").show();
    			
    			// 选中多个文件，重命名按钮置灰
    			if(selectedCount > 1){
					//self.toolbarView.initMoreBtns(0); 关闭更多按钮操作
    				//jRename.find('a').hide();
				//	$("ul span:contains('重命名')").closest("li").hide();//按钮在另外的视图，用dom查找隐藏起来
    				self.model.set('isBtnActivate', 0);
    			}else{
					//self.toolbarView.initMoreBtns(1); 关闭更多按钮操作
    				//jRename.find('a').show();
				//	$("ul span:contains('重命名')").closest("li").show();//
    				self.model.set('isBtnActivate', 1);
    			}
			}else{
				$("#selectCount").hide();
				$("#fileName").show();
				
				//jRename.find('a').show();
    			self.model.set('isBtnActivate', 1);
			}
			
			var pageData = self.model.getPageData(self.model.get("pageIndex"));
    		self.renderSelectAll(pageData);
        },
    	downloadEvent : function(target){
    		var self = this;
    		BH({key : "fileexpress_cabinet_download"});
    		
    		var ids = target.attr('fid');
	        self.model.trigger("downloadFiles", ids);
    	},
    	sendEvent : function(target){
    		var self = this;
    		var fid = target.attr('fid');
            self.model.gotoSendPage({fileList : [self.model.getFileById(fid)]});
    	},
    	renewEvent : function(target){
    		var self = this;
    		var ids = target.attr('fid');
	        self.model.trigger("renewFiles", ids);
    	},
    	deleteEvent : function(target, isNoRefresh){
    		var self = this;
    		var fname = target.attr('fname');
    		var tip = $T.Utils.format(self.model.tipWords['DELETE_FILE_NAME'], [fname]);
    		top.$Msg.confirm(
	            tip,
	            function(){
	                deleteFiles();
	            },
	            function(){
	            },
	            {
	                buttons:["确定", "取消"],
	                title:""
	            }
	        );
	        function deleteFiles(){
	        	var ids = target.attr('fid');
	        	self.model.trigger("deleteFiles", ids, target, isNoRefresh);
	        }
    	},
    	// 文件预览
    	previewFile : function(target){
    		var self = this;
    		var fid = target.attr('fid');
    		if(!self.model.isUploadSuccess(fid)){
    			console.log('sorry, 上传失败的文件不支持预览！！');
    			return;
			}
    		
    		var fileObj = self.model.getFileById(fid);
    		var fsize = fileObj.fileSize;
    		if(!self.model.isOverSize(parseInt(fsize))){
    			console.log('sorry, 文件太大不支持预览！！');
    			return;
    		}
    		var fname = fileObj.fileName;
    		var previewType = self.model.getPreviewType(fname);
    		if(!previewType){
    			console.log('sorry, 文件类型不支持预览！！');
    			return;
    		}
    		self.model.downloadFiles(function(result){
    			if(result.responseData.code && result.responseData.code == 'S_OK'){
    				var downloadUrl = result.responseData.imageUrl;
    				if(downloadUrl){
    					if(previewType === self.model.previewTypes['DOCUMENT']){
    						// 预览文档  todo
    						var url = self.model.getPreviewUrlTemplate();
		                    url = url.format(
								top.sid,
								top.uid,
								fid,
								encodeURIComponent(downloadUrl),
								encodeURIComponent(fname),
								top.UserConfig.skinPath,
								encodeURIComponent(self.model.getResource()),
								encodeURIComponent(top.SiteConfig.diskInterface),
								fsize,
								top.SiteConfig.disk
							);
		                    window.open(url);
    					}else{
    						// 预览图片
    						var previewObj = {
		                        imgUrl: "",
		                        fileName : fname,
		                        downLoad : downloadUrl,
		                        singlePreview : true
		                    };
		                    self.previewImage(previewObj);
    					}
    				}
    			}else{
    				self.logger.error("preDownload returndata error", "[disk:preDownload]", result);
    			}
    		}, fid);
    	},
    	// 图片单击事件，打开图片预览层
    	previewImage : function (previewObj) {
            if (typeof (top.focusImagesView) != "undefined") {
                top.focusImagesView.render({ data: [previewObj], index : 0 });
            }else{
                top.M139.registerJS("M2012.OnlinePreview.FocusImages.View", "packs/focusimages.html.pack.js?v=" + Math.random());
                top.M139.requireJS(['M2012.OnlinePreview.FocusImages.View'], function () {
                    top.focusImagesView = new top.M2012.OnlinePreview.FocusImages.View();
                    top.focusImagesView.render({ data: [previewObj], index : 0});
                });
            }
	    },
    	// 显示文件大小段落
        showSizeTable : function(target){
        	var jIntr = target.find('div.viewIntroduce');
		//	jIntr.find('p:eq(1)').show();
		//	jIntr.find('p:eq(2)').hide();
        },
        // 显示操作栏段落
        showOperatesTable : function(target){
        	var jIntr = target.find('div.viewIntroduce');
		//	jIntr.find('p:eq(1)').hide();
		//	jIntr.find('p:eq(2)').show();
        },
        // 显示重命名input
        showRenameTable : function(){
        	var self = this;
        	var selectedFid = self.model.get('selectedFids')[0];
        	$("#fileList input[type='checkbox']").each(function(i){
        		var fid = $(this).attr('fid');
        		if(selectedFid === fid){
        			var nameContainer = [],parentsName = '';
        			if(!self.model.get('listMode')){
        				parentsName = 'tr';
        			}else{
        				parentsName = 'li';
        			}
        			nameContainer = $(this).parents(parentsName).find('span[name="nameContainer"]');
        			nameContainer.find('em:eq(0)').hide();
        			nameContainer.find('input').show().select();
        			return;
        		}
        	});
        },
        // 隐藏重命名input
        hideRenameTable : function(target){
        	var self = this;
        	target.siblings('em').show();
        	target.hide();
        },
		getTemplate : function(){
			var self = this;
			var mode = self.model.get('listMode');
			if(!mode){
				return self.template;
			}else{
				return self.templateIcon;
			}
		},
		fixList:function(){ //修正列表形式滚动条增加宽度问题
			console.log($("#fileList2").height());
			console.log($("#fileList").height());
			if($("#fileList2").height() == null){
				$("#fileList").css("margin-right","0px")
			}else{
				if($("#fileList2").height()<$("#fileList").height()){
					$("#fileList").css("margin-right","14px")
				}else{
					$("#fileList").css("margin-right","0px")	
				}
			}	
		}
	}));
})(jQuery, _, M139);

M139.namespace("M2012.Fileexpress.Model", {
	ContextMenu : Backbone.Model.extend({
		initialize : function (options) {
			this.diskModel = options.model;
		},
		container : ['<div style="top: 145px; left: 727px; z-index: 9001; position: absolute;" class="menuPop shadow  show" bindautohide="1"><ul>','</ul></div>'],
		template :[//'<li index="1" command="open"><a href="javascript:;"><span class="text"><i class="icon i-cOpen"></i>打开</span></a></li>',
					'<li index="2" command="download"><a href="javascript:;"><span class="text"><i class="icon i-cDown"></i>下载</span></a></li></li>',
					'<li index="3" command="sendToMail"><a href="javascript:;"><span class="text"><i class="icon i-cSendmail"></i>发送</span></a></li></li>',
					'<li index="4" command="renew"><a href="javascript:;"><span class="text"><i class="icon i-cRenewal"></i>续期</span></a></li>',
					'<li index="5" command="saveToDisk"><a href="javascript:;"><span class="text"><i class="icon i-cColrDisk"></i>存彩云网盘</span></a></li>',
				//	'<li index="6" command="sendToPhone"><a href="javascript:;"><span class="text"><i class="icon i-cPhone"></i>发送到手机</span></a></li>',
					'<li index="7" command="rename"><a href="javascript:;"><span class="text"><i class="icon i-cRenaming"></i>重命名</span></a></li>',
					'<li index="8" command="deleteFile"><a href="javascript:;"><span class="text"><i class="icon i-cDelete"></i>删除</span></a></li>'],
		//获取邮件列表右键菜单 isSingle，是否单封邮件
		getMailMenu : function (isSingle) {
			var data = [];
			var rightContextString = "";
			var self = this;
		//	var selectedOne = this.diskModel.getSelectedDirAndFiles();
			if (isSingle) { //单封邮件
				rightContextString = self.template.join("");
			} else { //多封
				rightContextString = self.template[0] + self.template[1] + self.template[2] + self.template[3] + self.template[5];
			}
			return {
				data : data,
				rightContextString : rightContextString,
				menustr : self.container[0] + rightContextString + self.container[1]
			};
		}

	})
});
﻿/**
右键菜单view
 * */

M139.namespace("M2012.Fileexpress.View", {
	ContextMenu : Backbone.View.extend({
		el : "body",
		template : "",
		events : {},
		initialize : function (options) {
			var self = this;

			this.diskModel = options.model;
			this.fileList = options.fileListView;
			this.contextModel = new M2012.Fileexpress.Model.ContextMenu({
					model : this.diskModel
			});
			//因为dom还没生成，用live监听事件，统一给所有含有右键菜单的容器添加contextMenu事件
			//todo attach event on li
			$("#fileList").live('contextmenu', function (e) {
			//	debugger;
				var sender = this,thisCheckbox;
			//	BH("disk3_context");
				var target = e.target;
				//alert(pos.x+","+pos.y);
				thisCheckbox = $(e.target).parents("tr").find("input[type=checkbox]");
				if(thisCheckbox.length == 0){
					if($(e.target).is("li")){
						thisCheckbox = $(e.target).find("input[type=checkbox]");
					}else{
						thisCheckbox = $(e.target).parents("li").find("input[type=checkbox]");
					}	
				}
				if(thisCheckbox.attr('disabled') == 'disabled'){
					return false;
				}
				if (self.model.get("currentMenu")) { //如果上一个菜单还没消失则自动消失，避免出现多个菜单
					self.model.get("currentMenu").remove();
				}
				var menuItems = [];
			//	self.setThisSelected(e);
				menuItems = self.getMailMenu(e);
				if(typeof menuItems == "undefined"){
					return;
				}
				self.model.set("menuItems", menuItems["data"]);
				self.model.set("menustr", menuItems["menustr"]);
				self.model.set("rightContextString", menuItems["rightContextString"]);
				self.render(e);
				e.stopPropagation();
				e.preventDefault();
				return false; //屏蔽浏览器右键默认行为
			});
			//$("div_maillist").live('contextmenu',function(e){showContextMenu(e,"mail")});


		},
		setThisSelected : function(e){
			var self = this;
			var templi = $(e.target);
			var thisCheckbox = templi.parents("tr").find("input[type=checkbox]");
			if(thisCheckbox.length == 0){
				if(templi.is("li")){
					thisCheckbox = templi.find("input[type=checkbox]");
					templi.addClass("listViewHover").addClass("listViewChecked");
					templi.find(".chackPbar input").show();
				}else{
					thisCheckbox = templi.parents("li").find("input[type=checkbox]");
					templi.parents("li").addClass("listViewHover").addClass("listViewChecked");
					templi.parents("li").find(".chackPbar input").show();
				}
			}
			this.thisCheckbox = thisCheckbox;
			
			
			var fileid = thisCheckbox.attr('fid');
			this.fileid = fileid;
			var type = thisCheckbox.attr("filetype");
			toggleSelect(thisCheckbox);
			function toggleSelect(target){
        		var mode = self.model.get('listMode');
				if(mode){
					var isSelected = target.attr('checked');
					target.attr('checked', isSelected?false:true);
					self.selectEvent(target);
				}else{
					var isSelected = target.attr('checked');
					target.attr('checked', isSelected?false:true);
					self.selectEvent(target);
				}
        	};
		//	thisCheckbox.attr("checked", true);
			
		//	var selectedFids = self.diskModel.get('selectedFids');
						
		//	self.diskModel.addOne(fileid, type == self.diskModel.dirTypes.FILE ? selectedFids : selectedDirIds);
		//	self.diskModel.addOne(fileid, selectedDirAndFileIds);
		//	self.diskModel.addOne(fileid, shareFileId);
			//记录当前选择的目录类型
		//	if (type !== self.diskModel.dirTypes.FILE) {
		//		self.diskModel.changeDirType(type);
		//	}
		//	self.fileList.renderSelectCount();//拖动的时候 状态栏
		},
		// 复选框单击事件
        selectEvent : function(target){
        	var self = this;
    		var fid = target.attr('fid');
			var selectedFids = self.model.get('selectedFids');
			// 保存 / 清除 选中文件的ID
			self.model.toggle(fid, selectedFids);
			// 渲染文件数量
			self.fileList.renderSelectCount();
			// 图标模式还需改变li的class属性
			var mode = self.model.get('listMode');
			if(mode){
				var isSelect = target.attr('checked');
				if(isSelect){
					target.parents('li').attr('class', 'listItem listViewHover listViewChecked');
				}else{
					target.parents('li').attr('class', 'listItem listViewHover');
				}
			}
        },
		getMailMenu : function (e) { //邮件列表菜单
			var self = this;
			var isSingle = false; //是否单封 默认是多封邮件一起选中
			
			var thisCheckbox = $(e.target).parents("tr").find("input[type=checkbox]");
			if(thisCheckbox.length == 0){
				if($(e.target).is("li")){
					thisCheckbox = $(e.target).find("input[type=checkbox]");
				}else{
					thisCheckbox = $(e.target).parents("li").find("input[type=checkbox]");
				}	
			}
			if(thisCheckbox.length == 0){
				return;
			}
			var fileid = thisCheckbox.attr('fid');
			var selectedList = this.diskModel.getSelectedFiles();//获取选中项
			var Mids = [];
			$.each(selectedList,function(){
				Mids.push(this.fid);
			});
			if(Mids.length == 1 && Mids[0] == fileid){
				isSingle = true;
			}else{
				if (selectedList.length == 0) { //只有一封被选中 或者已经选中的就是这一封
					isSingle = true;
				self.setThisSelected(e);//只选中这一封
				}else if(($.inArray(fileid, Mids) == -1)){
					//删除其他选中的(可以先全部删除，后面再选中那一封)
					self.model.selectNone(); //内部未选中
					
				//	if(self.model.get('listMode')){
						self.fileList.reselectFiles();//渲染未选中
				//	}else{
				//		self.fileList.reselectFiles();//渲染未选中
				//	}
					self.setThisSelected(e);//只选中这一封
					isSingle = true;
				}
			}
			return this.contextModel.getMailMenu(isSingle);

		},
		//获取鼠标的绝对坐标
		getMousePos : function (e) {
			var x,
			y;
			var e = e || window.event;
			return {
				x : e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
				y : e.clientY + document.body.scrollTop + document.documentElement.scrollTop
			};
		},
		render : function (e) {
			var self = this;
			var menuItems = this.model.get("menuItems");
			var menustr = this.model.get("menustr");
			var rightContextString = this.model.get("rightContextString");
			if(!rightContextString){
				return; //如果菜单内容为空，则什么也不做。
			}
			var pos = this.getMousePos(e);
			var menu = $(menustr).appendTo(document.body)
			var left1 = pos.x;
			var top1 = pos.y;
			if(menu.height() + pos.y > $(document).height()){
				top1 = top1 - menu.height();
			}
			menu.css({ left : left1, top : top1});
			menu.find("li").click(function(){
				var command = $(this).attr("command");
				top.$App.trigger("cabinetCommand", {command : command});
				menu.remove();
			});
			bindAutoHide(menu);
			function bindAutoHide(el) {
				$(el).mouseenter(function () {
					clearTimeout(timerId);
				}).mouseleave(function () {
					dispearInFuture();
				});
				var timerId = -1;
				function dispearInFuture() {
					timerId = setTimeout(function() {
						menu.remove();
					}, 500);
				}
			}
		}
	})
});
/**
* @fileOverview 文件快递暂存柜主视图层.
*@namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Fileexpress.Cabinet.View.Main', superClass.extend(
        /**
        *@lends M2012.Compose.View.prototype
        */
    {
        el: "body",
        name : "M2012.Fileexpress.Cabinet.View.Main",
        logger: new top.M139.Logger({name: "M2012.Fileexpress.Cabinet.View.Main"}),
        events: {
        },
        initialize: function (options) {
        	this.model = options.model;
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initEvents : function(){
        	var self = this;
        	// 监听model层数据变化
			self.model.on("change:pageIndex", function(){// 翻页
				self.fileListView.render();
		    });
		    self.model.on("change:listMode", function(){// 视图切换
				self.fileListView.render();
		    });
		    self.model.on("change:searchStatus", function(){// 搜索状态
		    	self.model.set('pageIndex', 1);
		    	self.model.set('selectedFids', []);
				self.model.trigger("createPager");
		    	
		    	$("#fileName").show();
    			$("#selectCount").hide();
		    	
				self.fileListView.render();
		    });
		    self.model.on("change:sortType", function(){// 排序类型
		    	self.fileListView.sortByType();
		    	self.toolbarView.renderSortMenu();
		    });
		    self.model.on("change:sortIndex", function(){// 排序方式 升序或者降序
		    	self.fileListView.sortByType();
		    	self.toolbarView.renderSortMenu();
		    });
		    
		    // 绑定事件供其他view调用
		    self.model.on("createPager", function () {// 重新创建分页组件
	            self.toolbarView.createPager();
	        });
	        self.model.on("deleteFiles", function (ids, target, isNoRefresh) {// 删除文件
	    		self.model.deleteFiles(function(result){
	    			if(result.responseData && result.responseData.code == 'S_OK'){
	    				BH({key : "fileexpress_cabinet_deletesuc"});
	    				
	    				

                        if (!isNoRefresh) {
	    				    self.model.trigger("refresh", null);
                        }
		top.M139.UI.TipMessage.show(self.model.tipWords['DELETE_SUC'], {delay : 1000});
                        //文件上传中，删除已上传完的文件
                        if (self.model.get("listMode") == 0) {
                            target.parents("tr").remove();
                        } else {
                            target.parents("li").remove();
                        }
                        self.model.deleteFileFromModel(ids);//从model层删除文件
	    			}else{
	    				self.logger.error("delFiles returndata error", "[file:delFiles]", result);
	    			}
	    		}, ids);
	        });
	        self.model.on("downloadFiles", function (ids) {// 下载文件
	        	top.M139.UI.TipMessage.show(self.model.tipWords['DOWNLOAD_WAITING'], {delay : 2000});
	    		self.model.downloadFiles(function(result){
	    			if(result.responseData.code && result.responseData.code == 'S_OK'){
	    				BH({key : "fileexpress_cabinet_downloadsuc"});
	    				
	    				var downloadUrl = result.responseData.imageUrl;
	    				// window.open(downloadUrl);
	    				$("#downloadFrame").attr('src', downloadUrl);
	    			}else{
	    				self.logger.error("preDownload returndata error", "[file:preDownload]", result);
	    			}
	    		}, ids);
	        });
	        self.model.on("renewFiles", function (ids) {// 文件续期
	    		self.model.renewFiles(function(result){
	    			if(result.responseData.code && result.responseData.code == 'S_OK'){
	    				BH({key : "fileexpress_cabinet_renewsuc"});
	    				
	    				
	    				self.model.trigger("refresh");
						top.M139.UI.TipMessage.show(self.model.tipWords['RENEW_SUC'], {delay : 1000});
	    			}else{
	    				self.logger.error("continueFiles returndata error", "[file:continueFiles]", result);
	    			}
	    		}, ids);
	        });
	        self.model.on("renameFile", function () {// 文件重命名
	        	self.fileListView.showRenameTable();
	        });
	        self.model.on("refresh", function () {// 刷新数据源，刷新界面
	        	self.model.set('pageIndex', 1);
	        	self.model.set('selectedFids', []);
	        	
	        	self.fileListView.renderSelectCount();
	        	
	        	self.getDataSource(function(){
	    			self.statusView.render();
	    			self.statusView.initEvents();
	    			
	    			self.toolbarView.render();
	    			
			    	self.fileListView.render();
			    });
	        });
	        
	        $(window).resize(function(){
        		self.resizeFileListHeight();
	        });
	        $(window).unload(function () {
	            $("object").remove();//页面卸载或跳转前先移除掉flash，防止ie8报错  
	        });
	        
			
			// 安装彩云PC客户端 todo 地址写死了
			/*$("#setupDiskTool").click(function(event){
				var isrm = 0;
				if (top.isRichmail) {
                    isrm = 1;
                } else {
                    isrm = 0;
                }
                var diskResourcePath = 'http://images.139cm.com/rm/newnetdisk4/';
                var path = top.SiteConfig.disk;
                window.open(path+"/wp.html?jsres=" + escape(diskResourcePath) + "&res=" + 'http://images.139cm.com/rm/richmail' + "&isrm=" + isrm, "virtualDiskHome");
			});*/

            this.registerCloseTabEvent();
        },
		render : function(){
			var self = this;
    		self.getDataSource(function(){
    			self.statusView = new M2012.Fileexpress.Cabinet.View.Statusbar({model : self.model});
    			self.statusView.render();
    			self.statusView.initEvents();
    			
    			self.commandView = new M2012.Fileexpress.Cabinet.View.Command({model : self.model});
    			self.toolbarView = new M2012.Fileexpress.Cabinet.View.Toolbar({model : self.model});
    			self.toolbarView.render();
    			
		    	self.fileListView = new M2012.Fileexpress.Cabinet.View.Filelist({model : self.model,toolbarView: self.toolbarView});//视图层监听toolbar状态栏
		    	self.fileListView.render();
		    	
		    	self.resizeFileListHeight();
				new M2012.Fileexpress.View.ContextMenu({model: self.model, fileListView : self.fileListView});//鼠标右键
		    });
		},

        registerCloseTabEvent: function(){
            top.$App.on("closeTab", this.closeTabCallback);
        },

        closeTabCallback: function (args) {
            if (!top || !top.$App) return;
            if (args.name && args.name.indexOf("quicklyShare") > -1) {
                var isUploading = mainView.uploadModel.isUploading();

                if (isUploading) {
                    if (window.confirm(mainView.model.tipWords["UPLOADING"])) {
                        args.cancle = false;
                        top.$App.off("closeTab", mainView.closeTabCallback);
                    } else {
                        args.cancel = true;
                    }
                } else {
                    args.cancel = false;
                    top.$App.off("closeTab", mainView.closeTabCallback);
                }
            }
        },

		// 动态设置 fileList 高度避免出现两根滚动条
		resizeFileListHeight : function(){
		
			try {
                $iframe = $("#fileList");
				$iframe.height($(top.document.body).height() - 175); //减去多余4像素
                if ($.browser.msie && $.browser.version < 8) {
                //    $iframe.width($(top.document.body).width());
                }

            } catch (e) { }
			/*
		    var listOffset = $("#fileList").offset();

            if (!listOffset) {
                return;
            }

            var listTop = listOffset.top;
            var jQuick = getJquicklyShare();
		    var iframeHeight = jQuick.height();
		    $("#fileList").height(iframeHeight - listTop);
		    
		    function getJquicklyShare(){
			    var jQuicklyShare = top.$("iframe#quicklyShare");
			    if(jQuicklyShare.size() === 0){
			    	var mainIFrames = top.$(".main-iframe");
			    	for(var i = 0;i < mainIFrames.length;i++){
				    	if(mainIFrames[i].id === 'quicklyShare'){
				    		jQuicklyShare = top.$(mainIFrames[i]);
				    		break;
				    	}
				    }
			    }
			    return jQuicklyShare;
		    };*/
		},
		showGuidefirstTime : function(){
			var bgB = '<div class="backgroundBlock" id="bgB2"></div>';
			var firstGuideTipsCab = '<span class="promptTwo" id="firstGuideTipsCab"><a href="javascript:void(0);" id="firstGuideTipsCloseCab"></a></span>';
						//为undefined的时候说明是第一次 为1的时候说明弹出过，不弹了。
						if(0 && !top.$App.getUserCustomInfo("sfgt2")){ //屏蔽
							$(bgB).appendTo(top.document.body);
							$(firstGuideTipsCab).appendTo(top.document.body);
							top.$("#firstGuideTipsCloseCab").click(function(){
								top.$("#bgB2").hide();
								top.$("#firstGuideTipsCab").hide();
								top.$("#wpContainer").hide();
								top.$("#wpContainer").hide();
								top.$App.setUserCustomInfoNew({"sfgt2":1})
							});	
			}
		},
		// 初始化模型层数据
		getDataSource : function(callback){
			var self = this;
			top.M139.UI.TipMessage.show("正在加载中...");
			self.model.getDataSource(function(result){
				if(result.responseData && result.responseData.code == 'S_OK'){
					top.M139.UI.TipMessage.hide();
					self.model.dataSource = result.responseData['var'];
					var fileList = self.model.dataSource.fileList.concat();
					fileList = self.model.formatExpireDate(fileList);// 格式化过期时间
					self.model.sort({field : 'createTime', dataSource : fileList});// 默认按照上传时间排序
					
					self.model.set('fileList', fileList);
					self.model.set('originalList', fileList.concat());
					if(callback){
						callback();
					}
					if(fileList.length > 0){
						self.showGuidefirstTime();
					}
					// 判断是否从其他模块接收keyword参数，如果有则进入搜索界面
                    if($T.Url.queryString("keyword")){
                    	$("#search").click();
                    	return;
                    }
				}else{
					top.M139.UI.TipMessage.show("加载失败",{delay: 1000});
					self.logger.error("getFiles returndata error", "[file:getFiles]", result);
				}
		    });
		}
    }));
})(jQuery, _, M139);


﻿/**
 * @fileOverview 定义写信页App对象
 */
(function(jQuery, Backbone, _, M139) {
	var $ = jQuery;
	var superClass = M139.PageApplication;
	M139.namespace("M2012.Fileexpress.Cabinet.Application", superClass.extend(
	/**@lends M2012.MainApplication.prototype*/
	{
		/**
		 *暂存柜页App对象
		 *@constructs M2012.Fileexpress.Cabinet.Application
		 *@extends M139.PageApplication
		 *@param {Object} options 初始化参数集
		 *@example
		 */
		initialize : function(options) {
			superClass.prototype.initialize.apply(this, arguments);
		},
		defaults : {
			/**@field*/
			name : "M2012.Fileexpress.Cabinet.Application"
		},
		/**主函数入口*/
		run : function() {
			var cabinetModel = new M2012.Fileexpress.Cabinet.Model();
			var options = {
				model : cabinetModel
			};
			mainView = new M2012.Fileexpress.Cabinet.View.Main(options);
			mainView.initEvents();
			mainView.render();
			
			BH({key : "fileexpress_cabinet_loadsuc"});
		}
	}));
	$cabinetApp = new M2012.Fileexpress.Cabinet.Application();
	$cabinetApp.run();
})(jQuery, Backbone, _, M139);

