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

/*
 * html5方式上传
 */
var CommonUpload = function (options) {
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

CommonUpload.include = function (o) {
    var included = o.included;
    for (var i in o) this.prototype[i] = o[i];
    included && included();
};

CommonUpload.include({
    init: function (options) {
        this.initParams(options);
        this.createIframeUpload();
        this.bindEvent();
    },

    initParams: function (options) {
        this.controler = options.controler;
        this.model = options.model;
        this.subModel = options.subModel;

        this.isMcloud = this.subModel.get("isMcloud");
        this.fileNamePre = options.fileNamePre || "filedata";
        this.btnUploadId = options.btnUploadId;
    },

    bindEvent: function(){
        var self = this;
    //    var fileInput = document.getElementById(this.btnUploadId);
		var fileInput = null;
        if(typeof(this.btnUploadId) == "string"){
			fileInput = document.getElementById(this.btnUploadId);
		}else{
			fileInput = this.btnUploadId;
		}

        this.btnUploadEle = fileInput;
        fileInput.onchange = function(){
            self.selecteFileHandle();
            self.model.uploadClickBehavior(self.controler);
        };

        this.frmUpload.load(function(){
            self.frmUploadHandle();
        });
    },

    frmUploadHandle: function(){
        var self = this;
        var frmUploadWindow = this.frmUpload[0].contentWindow;

        try {
            if(frmUploadWindow.location.href.indexOf("blank.htm")>0){
                return;
            }

            console.log(frmUploadWindow.location.href);

            this.model.get("currentFile").state = "complete";
            this.model.get("currentFile").responseText = frmUploadWindow.location.href.replace(/&amp;/g, "&");
            this.controler.update();
        } catch (ex) {

        }
    },

    createIframeUpload: function(){
//        var html = '<iframe id="frmUploadTarget" src="/blank.htm"></iframe>';
        this.frmUpload = $("#frmUploadTarget");
        this.form = $("#fromUpload");

        if (this.isMcloud == "1") {//普通上传存彩云，需要上传参数uploadCode
            this.form.prepend('<input type="hidden" name="uploadCode" id="uploadCode" />')
                .prepend('<input type="hidden" name="redirectURL" id="redirectURL" />');
        }
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
        this.addFile();
        this.controler.trigger("select", {fileList: this.files});
    },

    addFile: function(){
        this.files = [];//清空上传队列

        var fileList = [{
            name: this.getFileName()
        }];

        for (var i = 0, len = fileList.length; i < len; i++) {
            var file = fileList[i];

            this.files.push(fileList[i]);
        }
    },

    getFileName: function(){
        var match = this.btnUploadEle.value.match(/(\\)?([^\\]*)$/);

        return match && match[2];
    },

    //重置上传队列
    setFileList: function (fileList) {//fileList为引用型指向files，直接修改files即可
        if (!this.uploading) {
            this.model.get("currentFile").state = "prepareupload";
            this.controler.update();
        }
    },

    getFileInfo: function () {
        this.currentFile = this.files[this.currentFileIndex++];
        !this.currentFile && (this.currentFileIndex = 0);

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

        this.form.attr("action", urlUpload);
        if (this.isMcloud == "1") {
            $("#uploadCode").attr("value", packData.uploadCode);
            $("#redirectURL").attr("value", self.model.commonUploadResultUrl + "?uploadRet");
        }
        this.form.submit();
        this.form[0].reset();
    },

    getCompleteSize: function (ranges) {
        var rangesArr = ranges.split(";");
        var firstCompleteRange = rangesArr[0];

        return firstCompleteRange && Number(firstCompleteRange.split("-")[1]);
    },

    onloadstart: function(){
        this.model.get("currentFile").state = "loadstart";
        this.controler.update();
    },

    onerror: function(){
        this.model.get("currentFile").state = "error";
        this.model.get("currentFile").isContinueUpload = true;
        this.controler.update();
        this.uploading = false;
    },

    storeBusinessId: function (businessId) {
        this.currentFile[businessId] = businessId;
    },

    getFileMd5: function (callback) {
        //
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
 * @fileOverview 定义彩云模块彩云页面模型层
 */
(function(jQuery, Backbone, _, M139) {
	var $ = jQuery;
	M139.namespace("M2012.Disk.Model", Backbone.Model.extend({
		defaults : {
			pageSize : 30,//每页显示文件数
			pageIndex : 1,//当前页
			listMode : 1,// 列表模式：0 列表 1 图标
			diskInfo : {},// 彩云信息
            isMcloud: "0",//是否存彩云：0 否；1 是
			sysDirList : [],// 系统文件夹列表
            sysDirListObj : {},// 系统文件夹列表转存为jason格式
            directorys : [],    //彩云所有目录列表
			curDirId : '',// 当前目录ID
            //curDirType: 0,//父文件夹类型
            curDirType: '',//当前目录类型
			curDirInfo : {},// 当前目录信息
			fileList : [],// 当前目录下的文件列表(包含子目录)
			imageList : [],// 当前页图片列表
            imageListObj : {},// 当前页缩略图
            thumbnailList : [],// 当前页缩略图列表
            thumbnailListObj : {},// 当前页缩略图列表
            coverList : [],// 当前页封面列表
			selectedFids : [],// 被选中的文件fid
            selectedDirIds : [], //当前选中的所有目录id
            SelectSysDir : 0,//保存右键操作过的系统文件夹
            selectedDirAndFileIds : [], //当前选中的目录和文件id
            selectedDirType: 1,//当前选中的目录类型
			searchStatus : 0, // 搜索状态
			hasSysFolders : 1,// 按钮是否为激活状态（选中系统文件夹使用该属性，除了下载按钮，其他的隐藏）
			hasFolders : 1,
			isRenameActivate : 1, // 按钮是否为激活状态（重命名按钮会使用该属性）
            isShareActivate : 1, // 按钮是否为激活状态（分享按钮会使用该属性）
            isSetCoverActivate : 1, //设为封面是否为激活状态
            isPostCardActivate : 1, // 制作明信片是否为激活状态
            isPlayActivate : 1, // 播放是否为激活状态
            isCreateBtnShow : 0,    //新建文件夹按钮是否为显示状态（我的相册+我的音乐到第二级目录，自定义文件夹可到4级目录）
            curDirLevel : '',   //当前是第几级目录
			isMailToolShow : 1, // 是否提示用户安装小工具
			maxLengthName : 255, // 文件名最大长度
			sortType : 'fileUpload', // 排序类型 'fileName' 'fileUpload' 'fileExpire' 'downloadCount' 'fileSize'
			sortIndex : -1, // 当前排序状态  1 升序 -1 降序
			parentDirs : [], // 当前目录的所有父辈目录(包括祖父辈)
            isMailToolShow : 1, // 是否提示用户安装小工具
            isRemoveFlash: true, // 是否删除flash，在onbeforeunload中使用，卸载页面前需要去掉flash
			shareFileId : [], // 共享文件
			totalSize : 0, //当前目录总数据
			currentShowType : 0, // all documentt, picture, music, vedio
			isImagesMode : false
		},
		commands : {// 定义工具栏所有命令
			UPLOAD : 'upload',
			DOWNLOAD : 'download',
			PLAY : 'play',
			SEND_TO_MAIL : 'sendToMail', // 发送到邮箱
			SEND_TO_PHONE : 'sendToPhone', // 发送到手机
            SET_COVER : 'setCover', //设为封面
            POSTCARD : 'postcard', //明信片
			RENAME : 'rename', // 重命名
            DELETE: 'deleteDirsAndFiles',// 删除目录和文件
            REMOVE: 'remove',//移动
            SHARE: 'share',//共享
            CREATE_DIR: 'createDir',//新建文件夹
			DRAG : 'dragMove' //拖拽移动
		},
		sendTypes : {// 发送类型
			MAIL : 'mail', // 邮件
			MOBILE : 'mobile' // 手机
		},
		previewTypes : {// 预览类型
			IMAGE : 'image', // 图片，当前页面弹出遮罩层预览
			DOCUMENT : 'document', // 文档，新窗口预览
			AUDIO : 'audio',	// 音频
			VIDEO : 'video'		// 视频
		},
		sortTypes : {// 排序类型
			FILE_NAME : 'fileName',
			UPLOAD_TIME : 'uploadTime', // 上传时间 CREATE_TIME
			FILE_SIZE : 'fileSize' // 大小
		},
		dirTypes : {// 文件类型
            ROOT: 0,//根目录 此值是前端定义，用以将根目录和其他目录进行区分，服务端定义为1
            USER_DIR : 1, // 自定义文件夹
            FILE : 'file', // 文件
            DIRECTORY : 'directory', // 文件
            ALBUM : 3, // 我的相册
            MUSIC : 4 // 我的音乐
        },
        dirFlag: {//是否系统文件夹
            SYS_DIR: "0",//系统目录
            NO_SYS_DIR: "1"//非系统目录
        },
        shareTypes : {// 分享类型
        	SINGLE : 'single', // 单击文件列表超链接分享的是单个文件
        	BATCH : 'batch' // 单击工具栏命令按钮分享的是批量选中的文件
        },
        dirLevelLimit : {   //新建文件夹创建级数限制
            USER_DIR : 4,   //自定义文件夹总共可以出现五级，允许新建到第四级
            SYS_DIR : 2     //系统文件夹下到第二级，包含第二级
        },
        sysDirIds :{
           ALBUM_ID : 20,
           MUSIC_ID : 30
        },
        fileClass : {
			IMAGE : 'viewPic',
		//	DOCUMENT : 'viewPicN'
			DOCUMENT : 'viewPic'
		},
		urls : {// 跳转到其它页面的URL
			SEND_URL : '/m2012/html/fileexpress/send.html?sid='+top.sid,
            SHARE_URL: '/m2012/html/disk/disk_dialogsharefile.html?sid='+top.sid,
			PREVIEW_URL : '/m2012/html/onlinepreview/online_preview.html?src=disk&sid={0}&id={2}&dl={3}&fi={4}&skin={5}&resourcePath={6}&diskservice={7}&filesize={8}&disk={9}'
		},
		previewSize : 1024 * 1024 * 20, // 预览支持的文件大小
        thumbnailSize :'65*65',
        postCardThumbnailSize : '450*350',
        limitSizeSend: 400 * 1024 * 1024* 1024,
        imagePath : '../../images/module/FileExtract/',
        imageGlobalPath : '../../images/global/',
		documentExts : "doc/docx/xls/xls/ppt/pdf/txt/htm/html/pptx/xlsx/rar/zip/7z", // 可预览的文档拓展名
		imageExts : "jpg/gif/png/ico/jfif/tiff/tif/bmp/jpeg/jpe", // 图片类拓展名
		audioExts : "/mp3/wav/ogg/wma/m4a/",
		videoExts : "/avi/flv/mp4/rm/rmvb/wmv/3gp/mov/webm/mpg/mpeg/asf/mkv/",
		tipWords : {
        	DELETE_FILEANDDIR : '删除操作无法恢复，您确定要删除{0}个文件夹，{1}个文件吗？', // 提示待刪除文件數量
        	DELETE_FILE : '删除操作无法恢复，您确定要删除{0}个文件吗？？', // 提示待刪除文件數量
        	DELETE_DIR : '删除文件夹将同时删除其中的文件，您确定要删除{0}个文件夹吗？', // 提示待刪除文件數量
        	DELETE_FILE_COUNT : '文件删除后接收方将无法下载，您确认删除这 {0} 个文件吗？', // 显示待删除文件数量
        	EMPTY_NAME: "文件名称不能为空",
        	OVER_NAME: "最大长度不能超过{0}个字符",
        	INVALID_NAME: "不能有以下特殊字符 \\/:*?\"<>|&",
        	DELETE_SUC : "删除成功!",
        	DELETE_ERR : "删除失败!",
            DOWNLOAD_ERR: "下载文件失败!",
            NO_FILE: "请选择文件",
            NO_Play: "目前音乐播放器仅支持IE浏览器！",
            CANT_SEND_FOLDER: "只能发送文件，暂不支持文件夹发送!",
            CREATE_DIR_SUC: "新建文件夹成功!",
            CREATE_DIR_ERR: "新建文件夹失败!",
            RENAME_SUC: "文件重命名成功!",
            RENAME_ERR: "文件重命名失败!",
            SETCOVER_SUC:"封面设定成功",
            SETCOVER_ERR:"封面设定失败",
            THUMBNAIL_ERR : "获取封面失败！",
            THUMBNAIL_ERR : "缩略图加载失败",
            UPLOADING: "关闭彩云网盘，当前正在上传的文件会失败，是否关闭？",
            LIMIT_SIZE_SEND: "彩云网盘暂不能发送{0}以上的文件，超大文件请使用暂存柜上传并发送！",
            UPLOADING_CHANGE_VIEW: "切换视图，当前正在上传的文件会失败，是否切换？",
            SELECTEDFILE_TO_MANY :"文件个数超出套餐限制，请重新选择",
            ONLY_RENAME_ONE:"只能对单个文件（夹）重命名。",
            SYS_NO_SEL:"系统文件夹不能被勾选。",
            ONLY_SHARE_ONE:"只能对单个文件（夹）进行分享。",
            SHARE_OVERLAP:"部分文件（夹）已分享，请重新选择！",
            SHARE_TO_MANY :"分享人数已达上限100人"
        },
        TIPS : {
            PREVIEW_OVERSIZE: "该文件超出了在线预览支持的文件大小，请下载后查看",
            OPERATE_SUCCESS: "操作成功",
            OPERATE_ERROR: "操作失败，请稍后再试",
            SHARE_SUCCESS: "分享成功！",
            SHARER_MAX: "分享人数已达到上限{0}人"
        },
        logger : new top.M139.Logger({
			name : "M2012.Disk.Model"
		}),
		name : 'M2012.Disk.Model',
		callApi : M139.RichMail.API.call,
		defaultInputValue : '搜索彩云网盘', // 搜索框默认值
		serviceItem : '0017', // 20元版
        inputPara : {},

        /**
		 *彩云公共代码
		 *@constructs M2012.Compose.Model.StorageCabinet
		 *@param {Object} options 初始化参数集
		 *@example
		 */
		initialize : function(options) {
			this.diskAllInfo = {};// 彩云详细信息（包括彩云信息及文件夹列表）
			//this.curDirAllInfo = {};// 当前目录详细信息（包括目录信息及文件列表）
			this.inputData = $diskApp.inputData;// 其它页面传递过来的数据对象
            this.keyword = $T.Url.queryString('keyword');
            this.dirId = $T.Url.queryString('id');
            if(this.inputData){
                this.inputPara.inputData = this.inputData;
            }else if(this.keyword){
                this.inputPara.keyword = this.keyword;
            }else if(this.dirId){
                this.inputPara.dirId = this.dirId;
            }

		},

        // 命令调用
        doCommand: function(command, args) {
            !args && (args = {});
            args.command = command;
            top.$App.trigger("diskCommand", args);
        },
		//第一次进入的时候三个接口合并返回数据
		getIndexDisk : function(callback){
			var self = this;
            self.callApi("disk:index", null, function(res) {
                if(callback) {
                    callback(res);
                }
            });
		},
		//云享四川
		getisShareSiChuan : function(callback){
			var self = this;
            self.callApi("disk:isShareSiChuan", null, function(res) {
                if(callback) {
                    callback(res);
                }
            });
		},
        //获取彩云初始化信息
        getDiskInit : function(callback){
            var self = this;
            self.callApi("disk:init", null, function(res) {
                if(callback) {
                    callback(res);
                }
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
		//分类搜索 文件扩展名称 如 jpg,MP3 等，中间以逗号隔开,不区分大小写，此参数为空时返回所有文件
		getCategorySearch : function(callback, options){
			var self = this;
			self.callApi("disk:searchbyexts", getData(), function(res){
				callback && callback(res);
			});
			
			function getData(){
				var data = {
					exts : options.exts
				};
				return data;
			}
		},
		//todo 获取某目录下的所有文件（包括子文件夹）
		getDirFiles : function(callback, options) {
			var self = this;
            self.callApi("disk:fileList", getData(), function(res) {
				if(callback) {
					callback(res);
				}
			});
			
			function getData(){
				var data = {
                    directoryId : options.dirid,
					dirType : options.dirType,
                    thumbnailSize  : self.thumbnailSize
				};
				return data;
			}
		},
		// 分页获取目录所有文件夹和文件信息
		getDirFilesByPage : function(callback, options){
			var self = this;
            self.callApi("disk:fileListPage", getData(), function(res) {
				if(callback) {
					callback(res);
				}
			});
			
			function getData(){
				var data = {
                    directoryId : options.dirid,
					dirType : options.dirType,
                    thumbnailSize  : self.thumbnailSize,
					toPage : self.get("pageIndex"),
					pageSize : self.get("pageSize"),
					catalogSortType : 0,
					contentSortType : 0
				};
				return data;
			}
		},
		//删除目录和文件
        deleteDirsAndFiles : function(callback, dataSend) {
            var self = this;
            self.callApi("disk:mgtVirDirInfo", getData(), function (res) {
				if(callback) {
					callback(res, dataSend);
				}
                //显示文件进入回收站提示
				self.trigger("showRecycleTips");
			});
			
			function getData(){
				if (!dataSend) {
                    dataSend = {
                        directoryIds: self.get("selectedDirIds").join(","),
                        fileIds: self.get("selectedFids").join(","),
                        dirType: self.getDirTypeForServer(),
                        opr:2
                    }
                }
				return dataSend;
			}
		},
		//下载目录和文件
		download : function(callback, dataSend) {
			var self = this;
			self.callApi("disk:download", getData(), function(res) {
				if(callback) {
					callback(res);
				}
			});
			
			function getData(){
                if (!dataSend) {
                    var fileIds = self.get("selectedFids"),
                        dirIds = self.get("selectedDirIds");
                    var fileObj = self.getFileById(dirIds[0] || fileIds[0]);
                    var parentDirectoryId = dirIds.length?fileObj.directory.parentDirectoryId:(fileObj.file && fileObj.file.directoryId || fileObj.directoryId);
                    var parentDirType = self.get('curDirType');

                    dataSend = {
                        directoryIds : dirIds.join(","),
                        fileIds : fileIds.join(","),
                        parentDirectoryId : parentDirectoryId,
                        parentDirType : parentDirType,
                        dirType : parentDirType,
                        isFriendShare : 0
                    };
                }
				return dataSend;
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
                    options.parentId = self.get("curDirId");
                    options.dirType = self.getDirTypeForServer();
                }
                return options;
            }
        },
        //设为封面
        setCover : function(callback, dataSend){
            var self = this;
            self.callApi('disk:setCover', getData(), function(result){
                callback && callback(result);
            });

            function getData(){
                if(!dataSend){
                    var fileId = self.get('selectedFids')[0]+'';
                    dataSend = {
                        fileId : fileId
                    }
                }
                return dataSend;
            }
        },
        
        // 发送明信片 
        postCard : function(){
        	var self = this;
        	var selectedFids = self.get('selectedFids');
        	self.getThumbImage(function(result){
        		var responseData = result.responseData;
        		if(responseData && responseData.code == 'S_OK'){
        			// todo
        			var imgUrl = responseData['var'].url;
    				top.Links.show('postcard', "&diskimage=" + encodeURIComponent(imgUrl));
    			}else{
    				top.M139.UI.TipMessage.show(self.model.tipWords.THUMBNAIL_ERR,{ delay: 3000, className: "msgYellow" });
    				self.logger.error("postCard returnData error", "[disk:thumbnail]", result);
    			}
        	}, {fileId : selectedFids[0]});
        },
        
		//重命名文件
        renameDirAndFile : function(callback, options) {
			var self = this;
			self.callApi("disk:rename", getData(), function(res) {
                callback && callback(res);
			});

            function getData(){
                if (!options.fileId && !options.directoryId) {
                    var fileId = self.get("selectedFids")[0];
                    var dirId = self.get("selectedDirIds")[0];
                    var dirObj = self.getFileById(dirId || fileId);
                    var filetype = dirObj.directory.dirType;

                    if (fileId) {//选择文件
                        options.fileId = fileId;
                    } else {//选择目录
                        options.directoryId = dirId;
                        options.dirType = filetype;
                    }
                }

                return options;
            }
		},
		// 搜索文件列表
		search : function(callback, keywords) {
			var self = this;
			self.callApi("disk:search", getData(), function(res) {
				if(callback) {
					callback(res);
				}
			});
			
			function getData(){
				var data = {
					keyword : keywords
				};
				return data;
			}
		},
		//按照文件类型搜索 文件类型，取值范围(0:图片;1:音乐;2:多媒体)
		searchFileType : function(callback, filetype){
			var self = this;
			self.callApi("disk:search", getData(), function(res) {
				callback && callback(res);
			});
			
			function getData(){
				var data = {
					filetype : filetype
				};
				return data;
			}
		},
		// todo 获取图片文件缩略图
		getThumbImageList : function(callback, options){
			var self = this;
			self.callApi("disk:thumbnails", getData(), function(result) {
				if(callback) {
					callback(result);
				}
			});
			
			function getData(){
				var data = {
                    directoryId : self.get('curDirId'),
                    dirType : self.get('curDirType'),
					thumbnailSize : self.thumbnailSize
				};
				return data;
			}
		},
		
		// 获取缩略图   发送明信片时调用该方法
		getThumbImage : function(callback, options){
			var self = this;
			self.callApi("disk:thumbnail", getData(), function(result) {
				if(callback) {
					callback(result);
				}
			});
			
			function getData(){
				var data = {
					fileId : options.fileId,
					thumbnailSize : self.postCardThumbnailSize
				};
				return data;
			}
		},
		// 供 repeater 调用
		renderFunctions : {
			getFullFileName : function() {// 带拓展名
				var row = this.DataRow;
				return $T.Html.encode(row.name);
			},
			getShortFileName : function() {// 带拓展名
				var row = this.DataRow;
				var name = row.name;
				var point = name.lastIndexOf(".");
				if(point == -1 || name.length - point > 5){
                    //return name.substring(0, 15) + "…";
                    return name.substring(0, 15);
                }

				return $T.Html.encode(name.replace(/^(.{15}).*(\.[^.]+)$/, "$1…$2"));
				//return row.fileName.length > 20?row.fileName.substr(0, 20):row.fileName;
			},
            getFileType :function() {
                var row = this.DataRow;
                var filetype = '';
                if(row.type == 'directory'){    //目录类型
                    filetype = row.directory.dirType;
                }else{      //文件类型
                    filetype = row.type;
                }
				if(!filetype || typeof filetype == "object"){
					filetype = "file";
				}
                return filetype;
            },
			getFullName : function() {// 不带拓展名
				var row = this.DataRow;
				var name = row.name;
				var point = name.lastIndexOf(".");
                if(row.directory && row.directory.dirFlag){
                    return $T.Html.encode(name);
                }
				if(point == -1){
					return $T.Html.encode(name);
				}else{
					return $T.Html.encode(name.substring(0, point));
				}
			},

			getShortName : function(max){// 不带拓展名
				var row = this.DataRow;
				var name = row.name;
				var point = name.lastIndexOf(".");
				var keywords = $T.Html.encode($Url.getQueryObj()["keyword"]) || "";//从URL获取搜索的内容
				if(point != -1 && row.directory && !row.directory.dirFlag){
					name = name.substring(0, point);
				}
				if(row.ext && row.directoryId){
					var p = name.indexOf(".");
					if(p != -1){
						name = name.substring(0, p);
					}
					if(name.length > max){
						name =  $T.Html.encode(name.substring(0, max)) + "…";
					}else{
						name =  $T.Html.encode(name);
					}
					return name;
				}
				if(row.rawSize || row.directoryId){
					return name.substring(0, point);
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
				if(!row.type){
					row.type = {};
				}
				if(!row.file){
					row.file = {};
				}
                if(row.type === 'directory'){
					return '';
				}
				if(row.file.ext){
					return '.' + $T.Html.encode(row.file.ext.toLowerCase());
				}
				var fileName = row.name;
				if(fileName.indexOf('.') == -1){
					return '';
				}

				var length = fileName.split(".").length;
            	return '.' + $T.Html.encode(fileName.split(".")[length-1].toLowerCase());
			},
			getFileSize : function() {
                var self = this;
                var model = self.dataModel;
				var row = this.DataRow;
				if(row.type != model.dirTypes.FILE){
					return 0;
				}
				return $T.Utils.getFileSizeText(row.file.fileSize || row.fileSize);
			},

			getFileIconClass : function() {
                var self = this,
                    model = self.dataModel,
                    row = this.DataRow,
					rowName = row.name;
				if(typeof row.type === "object" || row.directoryId){
					row.type = "file";
				}
				//添加if 配置新新图标模板
				if(rowName == "手机视频"){
					return 'i-file-smalIcion i-f-smv';
				}else if(rowName == "手机图片"){
					return 'i-file-smalIcion i-f-sJpg';
				}else if(rowName == "我的音乐1"){
					return 'i-file-smalIcion i-f-smic';
				}else if(rowName == "我的相册1"){
					return 'i-file-smalIcion i-f-sJpg';
				}
                if((row.id != model.sysDirIds.ALBUM_ID) && (row.id != model.sysDirIds.MUSIC_ID) && (row.type == model.dirTypes.FILE)){
                    return $T.Utils.getFileIcoClass2(0, row.name);
                }else if((row.id != model.sysDirIds.ALBUM_ID) && (row.id != model.sysDirIds.MUSIC_ID) && (row.type != model.dirTypes.FILE)){
                    return 'i-file-smalIcion i-f-sys';
                }else if(row.id == model.sysDirIds.ALBUM_ID){
                    return 'i_file_16 i_m_album';
                }else if(row.id == model.sysDirIds.MUSIC_ID){
                    return 'i_file_16 i_m_music';
                }

			},
			getThumbnailUrl : function(){
                var self = this,
                    model = self.dataModel,
                    row = this.DataRow,
                    thumbnailUrl = '',
                    dirType = row.directory && row.directory.dirType,
					dirName = row.name,
                    name = row.name,
                    extName = row.file && row.file.ext;
					if(!row.directory){
						row.directory = {};
					}
					if(typeof row.type === "undefined" || typeof row.type === "object"){
						if(row.bigthumbnailURL && (row.ext && 'mp4,wmv,flv,swf,rmvb,3gp,avi,mpg,mkv,asf,mov,rm'.indexOf(row.ext.toLowerCase()) == -1)){
							return row.bigthumbnailURL;
						}
						return model.getThumbImagePath(_.last(name.split(".")));
					}

				if(row.type != model.dirTypes["FILE"]){    //目录文件
                    if(row.directory.dirType == model.dirTypes.ALBUM && row.id != model.sysDirIds.ALBUM_ID){
                            thumbnailUrl = model.imagePath+'norSys.png';
                    }else{
                        thumbnailUrl = model.getIconByType(dirType, dirName);
                    }
                }else{
                    if(model.isImage(name)){  //图片文件
                              thumbnailUrl =  model.imageGlobalPath + 'load1.gif';
							  if(row.file.thumbnailURL || row.thumbnailURL){
								thumbnailUrl = row.file.thumbnailURL || row.thumbnailURL;
							  }
							  
                    }else{
						if(!extName){
							extName = _.last(name.split("."));
						}
                        thumbnailUrl = model.getThumbImagePath(extName);
                    }
                }
                return thumbnailUrl;
			},
			getFileIntSize : function(){
                var self = this;
                var row = this.DataRow;
                var model = self.dataModel;
				var row = this.DataRow;
                if(row.dirType != model.dirTypes.FILE){
					return 0;
				}
				return row.file.fileSize;
			},
            isShare : function(){
                var self = this;
                var row = this.DataRow;
                var model = self.dataModel;
                var listMode = model.get('listMode');
                if(listMode == 1){  //图标模式
                    if(row.isShare == 1 && row.type == model.dirTypes.FILE){
                    //    return '<i class="hand"></i>';
							return '<i class="cShare"></i>';
                    }else if(row.isShare == 1){
                    //    return '<i class="systemHand"></i>';
							return '<i class="cShare"></i>';
                    }
                }else if(listMode == 0){    //列表模式
                    if(row.isShare == 1){
                        return '<i class="i_file_16 i_m_hand"></i>';
                    }
                }
                return '';
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
                if(row.type !== model.dirTypes.FILE){
                	return model.fileClass['DOCUMENT'];
                }
                var fileName = row.name;
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
				commonOperateTemplete : ['<a hideFocus="1" href="javascript:void(0)" onclick="return false;" name="download" fileid="{fid}" target="_self">下载 </a>',
										'<span>|</span>',
										'<a hideFocus="1" href="javascript:void(0)" name="share" fileid="{fid}"> 共享 </a>',
										'<span>|</span>',
										'<a hideFocus="1" href="javascript:void(0)" onclick="return false;" name="send" fileid="{fid}"> 发送 </a>',
										'<span>|</span>',
										'<a hideFocus="1" href="javascript:void(0)" onclick="return false;" name="delete" fileid="{fid}" fname="{shortFileName}"> 删除</a>'].join(""),
				errorOperateTemplete : ['<i class="i_warn_min"></i>',
						            	'<span class="red">上传失败！</span>',
						            	'<a hideFocus="1" href="javascript:void(0)" onclick="return false;" name="delete" fileid="{fid}" fname="{shortFileName}">删除</a>'].join(""),
				commonIconTemplete : ['<p style="display:none;">',
										'<a hideFocus="1" href="javascript:void(0)" onclick="return false;" name="download" fileid="{fid}" target="_self">下载 </a>',
										'<span class="line">|</span>',
										'<a hideFocus="1" href="javascript:void(0)" name="share" fileid="{fid}"> 共享 </a>',
										'<span class="line">|</span>',
										'<a hideFocus="1" href="javascript:void(0)" onclick="return false;" name="send" fileid="{fid}"> 发送 </a>',
										'<span class="line">|</span>',
										'<a hideFocus="1" href="javascript:void(0)" onclick="return false;" name="delete" fileid="{fid}" fname="{shortFileName}"> 删除</a>',
									'</p>'].join(""),
				errorIconTemplete : ['<p class="gray failTips">',
						                '<i class="i_warn_min"></i>',
						                '<span class="red">上传失败！</span>',
						                '<a hideFocus="1" href="javascript:void(0)" onclick="return false;" name="delete" fileid="{fid}" fname="{shortFileName}">删除</a>',
						            '</p>'].join("")
			};
			var mode = self.get('listMode');
            var isUploadSuccess = self.isUploadSuccess(row.id);
			if(mode){
				if(row.type !== self.dirTypes.FILE){
					return $T.Utils.format(templates['commonIconTemplete'], {fid : row.id, shortFileName : getShortFileName(row.name)}); 
				}
				
				if(!isUploadSuccess){
                	return $T.Utils.format(templates['errorIconTemplete'], {fid : row.id, shortFileName : getShortFileName(row.name)});
                }else{
                	return $T.Utils.format(templates['commonIconTemplete'], {fid : row.id, shortFileName : getShortFileName(row.name)});
                }
			}else{
				if(row.type !== self.dirTypes.FILE){
					return $T.Utils.format(templates['commonOperateTemplete'], {fid : row.id, shortFileName : getShortFileName(row.name)}); 
				}
				
				if(!isUploadSuccess){
                	return $T.Utils.format(templates['errorOperateTemplete'], {fid : row.id, shortFileName : getShortFileName(row.name)});
                }else{
                	return $T.Utils.format(templates['commonOperateTemplete'], {fid : row.id, shortFileName : getShortFileName(row.name)});
                }
			};
			
			function getShortFileName(name){
				var point = name.lastIndexOf(".");
				if(point == -1 || name.length - point > 5){
                    //return name.substring(0, 15) + "…";
                    return name.substring(0, 15);
                }

				return $T.Html.encode(name.replace(/^(.{15}).*(\.[^.]+)$/, "$1…$2"));
				//return row.fileName.length > 20?row.fileName.substr(0, 20):row.fileName;
			}
		},
		
		/*
		 * 表头排序
		 * type 3 我的相册  4 我的音乐  1 自定义文件夹  2 文件
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
					case self.sortTypes['FILE_SIZE']:
						sorter = function(a, b) {
							if (judgeType(a, b)) return sortFolder(a, b) || 0;
                            var afileSize = a.file.fileSize || a.fileSize;
                            var bfilesize = b.file.fileSize || b.fileSize;
							return (afileSize - bfilesize) * sortIndex || 0;
						};
						break;
					case self.sortTypes['FILE_NAME']:
						sorter = function(a, b) {
                            if (judgeType(a, b)) return sortFolder(a, b);
							return (a.name.localeCompare(b.name)) * sortIndex;
						};
						break;
					case self.sortTypes['UPLOAD_TIME']:
						sorter = function(a, b) {
                            if (judgeType(a, b)) return sortFolder(a, b);
							return ($Date.parse(a.createTime) - $Date.parse(b.createTime)) * sortIndex;
						};
						break;
				}
				options.dataSource.sort(sorter);
			}
            function judgeType (a, b) {
                return (a.directory && b.directory && a.directory.dirType != b.directory.dirType) || a.type != b.type || (a.directory && b.directory && a.directory.dirFlag != b.directory.dirFlag);
            }
			// 文件夹排在前面
			function sortFolder(a, b){
                if (a.type == self.dirTypes['FILE']) {
                    return 1;
                } else  if (b.type == self.dirTypes['FILE']) {
                    return -1;
                }
                if (a.directory.dirFlag == self.dirFlag['SYS_DIR']) {
                    return -1;
                } else if (b.directory.dirFlag == self.dirFlag['SYS_DIR']) {
                    return 1;
                }
                if (a.directory.dirType == self.dirTypes['USER_DIR']) {
                    return 1;
                } else if (b.directory.dirType == self.dirTypes['USER_DIR']) {
                    return -1;
                }
                return a.directory.dirType == self.dirTypes['ALBUM'] ? -1 : 1;
			}
		},
		// 状态栏视图层模板相对应的对象，用户替换模板中的变量 
		getStatusObj : function() {
			var self = this;
			var data = self.get('diskInfo');
			var usedPercent = Math.ceil(data.useSize / data.totalSize * 100);
			usedPercent = usedPercent > 100 ? 100 : usedPercent;
			var formatObj = {
				filesCount : data.fileNum, // 文件数量
				usedPercent : usedPercent,
				usedSize : $T.Utils.getFileSizeText(data.useSize),
				totalSize : $T.Utils.getFileSizeText(data.totalSize)
			}
			return formatObj;
		},
		// 获取总页数
		getPageCount : function() {
			return Math.ceil(this.get("totalSize") / this.get("pageSize")) || 1;// at least one
			// delete below
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
            for(var i= 0,l=pageData.length; i<l; i++){
                if(pageData[i].type == this.dirTypes.FILE){
                    this.set('imageList', this.getImageList(pageData));
                }
            }
            var imageList = this.get('imageList');
            var imageListObj = {};
            for(var i= 0, l=imageList.length; i<l; i++){
                imageListObj[imageList[i].id] = true;
            }
            this.set('imageListObj', imageListObj);
			return pageData;
		},
        //获取是图片的数据 todo 该方法可废弃
        getImageList:function(pageData){
            var self=this;
            var imgData=[];
            for(var i= 0,l=pageData.length; i<l; i++){
                //var fileName = pageData[i]["name"] || pageData[i]["srcfilename"];
                var fileName = pageData[i]["name"];
                if(self.isImage(fileName)){
                	imgData.push(pageData[i]);
                }
            }
            return imgData;
        },
        //根据图片数据返回图片的fid todo 该方法可废弃
        getImageFileds:function(imgData){
            var fileds="";
            for(var i= 0,l=imgData.length; i<l; i++){
                fileds +=","+imgData[i]["fileid"];
            }
            fileds=fileds.substr(1);
            return fileds;
        },
		// 判断用户是否安装邮箱小工具
		isSetupMailtool : function(){
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
            var reg = /[*|:"<>?\\/&]/;
            return !reg.test(name);
        },
		//添加数据，不存在则添加
		addOne: function(item, array){
			if(!item || !$.isArray(array)){
				return;
			}
			var index = $.inArray(item, array);
			if(index == -1){
				array.push(item);
			}
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
        //如果当前选择的目录类型存在则不做处理，不存在则改变当前选择目录类型
        changeDirType: function (dirType) {
            if (this.selectedDirType !== dirType) {
                this.selectedDirType = dirType;
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
       // 获取当前目录类型,提供给服务端的根目录type为1
        getDirTypeForServer: function(){
            var curDirType = this.get("curDirType");
            return curDirType == this.dirTypes.ROOT ? this.dirTypes.USER_DIR : curDirType;
        },
	   // 获取用户选中的文件列表
	   getSelectedDirAndFiles : function(){
	   		var self = this;
	   		var files = [];
	   		var fileList = self.get('fileList');
	   		var selectedFids = self.get('selectedDirAndFileIds');
	   		$(fileList).each(function(i){
	   			var fid = this.id;
	   			if($.inArray(fid, selectedFids) != -1){
	   				files.push(this);
	   			}
	   		});
	   		return files;
	   },
	   // 获取要共享的文件及文件夹
	   getShareFile: function(){
           var self = this;
           var fileIds = self.get('shareFileId');
           var files = [];

           for (var i = 0, len = fileIds.length; i < len; i++) {
           	   var fileObj = self.getFileById(fileIds[i]);
           	   if(fileObj.id){
           	       files.push(fileObj);
           	   }
           }

           return files;
	   },
	   
	   //共享
        showShareDialog1: function(shareType){
            if (top.$User && !top.$User.checkAvaibleForMobile()) return; //非移动用户，屏闭共享 todo 非移动用户直接屏蔽次功能入口
			
			var self = this;
			if(!shareType){
				shareType = self.shareTypes['BATCH'];
			}
			
			var dirType = self.get('curDirType');
            var shareUrl = self.urls.SHARE_URL+'&shareType='+shareType+'&dirType='+dirType;
            top.$Msg.open({
                dialogTitle: "分享给好友",
                url: shareUrl,
                width: 565,
                height: 440
            });
        },
        /**
         *  弹出分享好友窗口 和分享好友一致
         */
        showShareDialog: function (shareType) {
            var self = this;
			if(!shareType){
				shareType = self.shareTypes['BATCH'];
			}
            //if (top.$User && !top.$User.checkAvaibleForMobile()) return; //非移动用户，屏闭共享 todo 非移动用户直接屏蔽次功能入口
	        this.getSharList(function(res){
	            var maxCount,data,contacts;
	            if(self.isVipVersion()){
		            maxCount = 100;
	            }else{
		            maxCount = 20;
	            }
	                data = {
	                recvUserNumbers: [],
	                shareDirIds: [],
	                shareFileIds: []
	            };
	            contacts = top.$App.getModel("contacts").get("data").contacts;
	            if(_.isArray(res)){
		            var l = res.length,i = 0,flag ={};
		            for( i; i<l;i++){
			            flag[i] = false;
			            $.each(contacts,function(num,d){
				           if(d['MobilePhone'] == res[i]['recvuserNumber']){
						    data.recvUserNumbers.push('"'+d['name']+'"'+"<"+res[i]['recvuserNumber']+">");
				            flag[i] = true;
							return false;
					       }
			            })
			            if(!flag[i]){
						    data.recvUserNumbers.push('"'+res[i]['alias']+'"'+"<"+res[i]['recvuserNumber']+">");
			            }

		            }
	            }
                data.shareDirIds = self.get('selectedDirIds');
                data.shareFileIds = self.get('selectedFids');
                data.dirType = self.get('curDirType');
	            top.M2012.UI.Dialog.AddressBook.create({
	                filter: "mobile",
	                dialogTitle: "分享给好友",
	                showSelfAddr: false,
	                maxCount: maxCount,
	                items: data.recvUserNumbers
	            }).on("select", function (e) {
	                var selecteds = [];
	                if (e && e.value && e.value.length > 0) {
	                    selecteds = $.map(e.value, function (n) {
	                        var mobile = M139.Text.Mobile.getMobile(n);
	                        return M139.Text.Mobile.remove86(mobile);
	                    });
	                }

	                //判断选择前后的联系人信息是否发生变化
	                //如果没有变化则无需后续处理
	                var hasChanged = (selecteds.length !== data.recvUserNumbers.length);
	                if (!hasChanged)
	                    hasChanged = _.difference(selecteds, data.recvUserNumbers).length > 0;

	                if (!hasChanged)
	                    return true;

	                data.recvUserNumbers = (selecteds || []).concat();
	                var options = {
	                    success: function () {
	                        top.M139.UI.TipMessage.show(self.TIPS.SHARE_SUCCESS, { delay: 3000 });
	                        //args.success && args.success();
	                    },
	                    error: function (code, msg) {
	                        msg = msg || self.TIPS.OPERATE_ERROR;
	                        top.M139.UI.TipMessage.show(msg, { delay: 3000 ,className:"msgYellow"});
	                       // args.error && args.error();
	                    }
	                };
	                if (data.recvUserNumbers.length > 0) {
	                    self.share($.extend(data, options));
	                    return;
	                }
	                //没有接收人说明要取消共享
	                self.cancelShare($.extend(options, {
	                    dirIds: data.shareDirIds ? data.shareDirIds : [],
	                    fileIds: data.shareFileIds ? data.shareFileIds : [],
	                    success: function () {
	                        top.M139.UI.TipMessage.show(self.TIPS.OPERATE_SUCCESS, { delay: 3000 });
	                        //args.success && args.success();                                          
	                    }
	                }));
	                return true;

	            }).on("additemmax", function () {
	                top.$Msg.alert($T.format(self.TIPS.SHARER_MAX, [maxCount]));
	            });
	        })
        },
        share: function (args) {
            args = args || {};
            var self = this;
            var data = {};

            if (_.isArray(args.shareDirIds))
                data.shareDirIds = args.shareDirIds.join(",");

            if (_.isArray(args.shareFileIds))
                data.shareFileIds = args.shareFileIds.join(",");

            if (_.isArray(args.recvUserNumbers))
                data.recvUserNumbers = args.recvUserNumbers.join(",");
            top.$RM.call("disk:share", data, function (res) {
                if (res.responseData && res.responseData.code == 'S_OK') {
                    args.success && args.success();
                    return;
                }
                var errCode = "";
                var mssage = self.TIPS.OPERATE_ERROR;
                if (res.responseData && res.responseData.code)
                    errCode = res.responseData.code;
                if (res.responseData && res.responseData.summary)
                    mssage = res.responseData.summary;

                args.error && args.error(errCode, mssage);

            }, function () {
                var mssage = self.TIPS.OPERATE_ERROR;
                args.error && args.error("", mssage);
            });
        },
        cancelShare: function (args) {
            args = args || {};
            var self = this;
            var data = {
                dirIds: args.dirIds.join(","),
                fileIds: args.fileIds.join(",")
            };
            top.$RM.call("disk:cancelShare", data, function (res) {
                if (res.responseData && res.responseData.code == 'S_OK') {
                    args.success && args.success();
                    return;
                }
                var errCode = "";
                if (res.responseData && res.responseData.code)
                    errCode = res.responseData.code;
                args.error && args.error(errCode);

            }, function () {
                args.error && args.error();
            });
        },
	   //获取已分享联系人列表
	   getSharList:function(fnSuccess,fnError){
		   var self = this,allDirAndFiles = this.get("selectedDirAndFileIds"),filesAndDirLength = allDirAndFiles.length, shareObjId = [],options = {};

		   if(filesAndDirLength > 1){
			   var flag = true;
			   $.each(allDirAndFiles,function(i,item){
				    options = {"shareObjId":this};
		            top.$RM.call("disk:shareDetail", options, function (res) {
		                if (res && res.responseData && res.responseData.code == "S_OK") {
		                    var data = res.responseData["var"];
		                    if (data && data.recUserList)
		                        res = data.recUserList;
		                        if(res[0] != undefined){
			                        flag = false;
		                        }
		                    if(flag && (i == filesAndDirLength -1)){
			                    fnSuccess && fnSuccess(res);
		                    }
		                    return;
		                }
		                fnError && fnError();
		            }, function (e) {
		                fnError && fnError();
						 return;
		            });
		         	if(!flag){
						top.M139.UI.TipMessage.show("部分文件（夹）已分享，请重新选择！", { delay: 3000, className: "msgYellow" }); 
						return;
		         	}
			   })
		   }else{
		        options = {"shareObjId":allDirAndFiles[0]}
	            top.$RM.call("disk:shareDetail", options, function (res) {
	                if (res && res.responseData && res.responseData.code == "S_OK") {
	                    var data = res.responseData["var"];
	                    if (data && data.recUserList)
	                        res = data.recUserList;
	                    fnSuccess && fnSuccess(res);
	                    return;
	                }
	                fnError && fnError();
	            }, function (e) {
	                fnError && fnError();

	            });
		   }
		    var shareObjId = this.get("selectedDirAndFileIds")[0];
		},
		//是否是vip
        isVipVersion:function() {
            var serviceItem = top.$User.getServiceItem();
            return '0016,0017'.indexOf(serviceItem)>-1;
        },
	   // 全选
	   selectAll : function(){
	   		var self = this;
        //    var curPageData = self.getPageData(self.get('pageIndex'));
			var curPageData = self.get("fileList"); //数据源已变化
	   		var selectedFids = self.get('selectedFids');
	   		var selectedDirIds = self.get('selectedDirIds');
			/*
	   		$(curPageData).each(function(i){
	   			var fid = this.id;
	   			var fileType = this.type;
	   			if(fileType == self.dirTypes.FILE){
	   				if($.inArray(fid, selectedFids) == -1){
	   					if(self.isUploadSuccess(fid)){
							selectedFids.push(fid);
						}
		   			}
	   			}else if(this.directory.dirFlag != 0){ // dirFlag 0 系统目录  1 自定义目录
	   				if($.inArray(fid, selectedDirIds) == -1){
		   				selectedDirIds.push(fid);
		   			}
	   			}
	   		});*/
			$(curPageData).each(function(i){
	   			var fid = this.id;
	   			var fileType = this.type;
	   			if(fileType == self.dirTypes.FILE){
	   				if($.inArray(fid, selectedFids) == -1){
	   					if(self.isUploadSuccess(fid)){
							selectedFids.push(fid);
						}
		   			}
	   			}else{ // dirFlag 0 系统目录  1 自定义目录
	   				if($.inArray(fid, selectedDirIds) == -1){
		   				selectedDirIds.push(fid);
		   			}
	   			}
	   		});
	   		self.set('selectedDirAndFileIds', selectedFids.concat(selectedDirIds));
	   },
	   // 全不选
	   selectNone : function(){
	   		var self = this;
	   	//	var fileList = self.getPageData(self.get("pageIndex"));
			var fileList = self.get("fileList"); //数据源已变化
	   		var selectedFids = self.get('selectedFids');
	   		var selectedDirIds = self.get('selectedDirIds');
	   		$(fileList).each(function(i){
	   			var fid = this.id;
	   			var fileType = this.type;
	   			if(fileType == self.dirTypes.FILE){
	   				var fIndex = $.inArray(fid, selectedFids);
					if(fIndex != -1){
						selectedFids.splice(fIndex, 1);
					}
	   			}else{
	   				var dIndex = $.inArray(fid, selectedDirIds);
	   				if(dIndex != -1){
						selectedDirIds.splice(dIndex, 1);
					}
	   			}
	   		});
	   		self.set('selectedDirAndFileIds', selectedFids.concat(selectedDirIds));
	   },
	   // 根据文件ID返回文件对象
	   getFileById : function(fid){
	   		if(!fid){
	   			return;
	   		}
	   		var self = this;
	   		var file = {};
	   		var fileList = self.get('fileList');
	   		$(fileList).each(function(i){
	   			var fileId = this.id;
	   			if(fileId == fid){
	   				file = this;
	   				return false;
	   			}
	   		});
	   		return file;
	   },
	   
	   // 判断文件是否上传成功, 仅判断文件，文件夹无需判断
	   isUploadSuccess : function(fid){
	   		var self = this;
	   		var fileObj = self.getFileById(fid);
	   		if(!fileObj){
	   			return false;
	   		}
	   		if(fileObj.type === 'directory' || fileObj.directoryId){
	   			return true;
	   		}
	   		if(fileObj.uploadState === 'false'){
	   			return false;
	   		}
	   		
	   		var fileSize = parseInt(fileObj.file.fileSize, 10);
	   		var fileUploadSize = parseInt(fileObj.file.rawSize, 10);
	   		return fileSize === fileUploadSize?true : false;
	   },
	   
       getSelectedDirAndFileNames: function(filename){
            var selectedDirAndFileIds = this.get("selectedDirAndFileIds");
            var selectedDirAndFileNames = [];

            for (var i = 0; i < selectedDirAndFileIds.length; i++) {
                var file = this.getFileById(selectedDirAndFileIds[i]);

                selectedDirAndFileNames.push(file.name || filename);
            }

            return selectedDirAndFileNames;
        },
        getSelectedDirAndFileOverflowNames: function(newName, filename){
            var originNames = this.getSelectedDirAndFileNames(filename);
            var overflowNames = [];
            if(!newName){
                for (var i = 0; i < originNames.length; i++) {
                    overflowNames.push(M139.Text.Url.getOverflowFileName(originNames[i], 30));
                }
            }else{  //重命名文件名截取
                overflowNames.push(M139.Text.Url.getOverflowFileName(newName, 15));
            }
            return overflowNames;
        },
	   // 获取根目录
	   getRootDir : function(){
	   		var self = this;
            var baseInfo = self.get('diskInfo');
           return baseInfo.rootId;
	   },
	   // 判断当前目录或文件是否系统目录_20130613_xx
	   isRootDir : function(fileid){
	   		var self = this;
           var fileObj = self.getFileById(fileid);
		//   if(!fileObj.directory.dirFlag){
		//		return false;
		//  }
			if(!fileObj){
				return false;
			}
			if(!fileObj.directory){
				return false;
			}
           return fileObj.directory.dirFlag == 0 ? true : false;
	   },
	   // 判断用户是否选中了系统文件夹
	   isSelectedSysDir : function(){
            var self = this,
                isSysDir = false,
                selectedDirIds = self.get('selectedDirIds'),
                sysDirListObj = self.get('sysDirListObj');
           for(var i= 0,l=selectedDirIds.length; i<l; i++){
               if(sysDirListObj[selectedDirIds[i]]){
                   isSysDir = true;
                   break;
               }
           }
	   		return isSysDir;
	   },
	   // 根据dirid返回文件夹对象
	   getDirById : function(dirid){
	   		if(!dirid && dirid != 0){
	   			return;
	   		}
	   		var self = this;
	   		var dirObj = {};
	   		//var dirs = self.get('sysDirList').concat(self.get('userDirList')).concat(self.get('photoDirList')).concat(self.get('musicDirList'));
            var dirs = self.get('directorys');
	   		$(dirs).each(function(i){
	   			if(this.directoryId == dirid){
	   				dirObj = this;
	   				return false;
	   			}
	   		});
	   		return dirObj;
	   },
	   setParentDirs : function(dirObj){
	   		var self = this;
	   		if(!dirObj){
	   			self.logger.error("param error", "[setParentDirs]", dirObj);
	   			return;
	   		}
	   		
	   		if(dirObj.parentDirectoryId == 0){
	   			return;
	   		}else{
	   			var parentDir = self.getDirById(dirObj.parentDirectoryId);
	   			if(parentDir){
	   				self.get('parentDirs').unshift(parentDir);
	   				self.setParentDirs(parentDir);
	   			}
	   		}
	   },
	   getParentDirs : function(){
	   		var self = this;
	   		return self.get('parentDirs');
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
	   		}else if(self.videoExts.indexOf("/"+ext+"/") != -1){
		   		return self.previewTypes['VIDEO'];
	   		}else if(self.audioExts.indexOf("/"+ext+"/") != -1){
		   		return self.previewTypes['AUDIO'];
	   		}
	   },
	   // 获取完整的附件预览地址模板
	   getPreviewUrlTemplate : function(){
			var self = this;
			return "http://" + top.location.host + self.urls['PREVIEW_URL'];
	   },
	   // 跳转到文件发送页
	   gotoSendPage : function(options){
	   		// 为文件列表中的每一个文件对象添加额外属性标识文件来源:彩云
			function setComeFrom(files, comeFrom){
				if(!$.isArray(files)){
					return files;
				}
				for(var i = 0,len = files.length;i < len;i++){
					var file = files[i];
					file.comeFrom = comeFrom;
				}
			}
	   	
	   		var self = this;
	   		setComeFrom(options.fileList, 'disk');
	   		
	   		var data = {
				fileList : options.fileList,
				type : "mail",
				from : "netdisk"
			};
			$("#disk-main").hide();
			$("#iframe-main").show();
			var url = self.urls['SEND_URL'];
            url = $diskApp.inputDataToUrl(url, data);
			$("#netRightFrame").attr("src", url);
	    },
		getOutLinkHtml: function (data, callback) {
			top.M139.RichMail.API.call("disk:getOutLink", data, callback);
		},
		popupComposeSmallPop: function(fileList, data){
			var self = this;
			var itemTemp = '<li rel="largeAttach" objId="{objId}" filetype="i_cloudS"><i class="i_cloudS"></i>\
					<span class="ml_5">{prefix}<span class="gray">{suffix}</span></span>\
					<span class="gray ml_5">({fileSizeText})<span class="tiquma pl_5 black" style="display:none;">提取码：{tiquma}</span></span>\
					<a hideFocus="1" class="ml_5" href="javascript:void(0)" removeLargeAttach="{objId}">删除</a></li>';
			if (!this.filterFile(fileList)) {
	            //top.$Msg.alert(this.model.tipWords.LIMIT_SIZE_SEND);
				top.M139.UI.TipMessage.show(self.tipWords.LIMIT_SIZE_SEND,{ delay: 3000, className: "msgYellow" });
	            return ;
            }
			function getShortName(fileName) {
						if (fileName.length <= 30) return fileName;
						var point = fileName.lastIndexOf(".");
						if (point == -1 || fileName.length - point > 5) return fileName.substring(0, 28) + "…";
						return fileName.replace(/^(.{26}).*(\.[^.]+)$/, "$1…$2");
			}
			self.getOutLinkHtml(data, function(res){
				
				if(res.responseData.code === "S_OK"){
					var data = res.responseData["var"];
					var linkBeans = data.linkBeans;
					for(var i = 0; i < fileList.length; i++){
						var fileListItem = fileList[i];
						for(var j = 0, len = linkBeans.length; j < len; j++){
							var linkBeansItem = linkBeans[j];
							if(fileListItem.id === linkBeansItem.objID){
								fileListItem.linkUrl = linkBeansItem.linkUrl;
								fileListItem.passwd = linkBeansItem.passwd;
								break;
							}
						}
					}
					var htmlCode = "";
					var firstFileName = "";
					firstFileName = fileList[0].name;
					for(t = 0 ; t < fileList.length; t++){
						var item = fileList[t];
						var shortName = getShortName(item.name),
							prefix = shortName.substring(0, shortName.lastIndexOf('.') + 1),
							suffix = shortName.substring(shortName.lastIndexOf('.') + 1, shortName.length);
						var data = {
								objId : item.id,
								prefix: prefix,
								suffix: suffix,
								fileSizeText: M139.Text.Utils.getFileSizeText(item.file && item.file.fileSize || item.fileSize),
								fileId: item.fileId
						};
						htmlCode += top.$T.Utils.format(itemTemp, data);
					}	
					console.log(htmlCode);
					top.$Evocation.create({type: "compose", subject: "【139邮箱-彩云网盘】" + firstFileName, content: "", whereFrom: "disk", diskContent: htmlCode, diskContentJSON:fileList});
				}else{
					top.M139.UI.TipMessage.show("获取文件链接失败", {className: "msgRed", delay:3000});
				}
			});
		},
	    popupCompose: function(fileList, data){

            if (this.filterFile(fileList) == false) {
				top.M139.UI.TipMessage.show(this.tipWords.LIMIT_SIZE_SEND,{ delay: 3000, className: "msgYellow" });
	            return ;
            }

			// 获取外链，并插入链接内容到写信弹窗 (xiaoyu, 2014/03/26)
			M139.RichMail.API.call("disk:getOutLink", data, function(res) {
				var outLinkHtml = '<br><br><br><dl class="writeOk" style="dcolor: #444;font: 12px/1.5 \'Microsoft YaHei\',Verdana; display: inline-block; padding:5px 50px 5px 0px;">';
				var list, source;
				var firstFileName = "";

				function getFileIcoBgPos(ext) {
					var bgPos = "|none|{0 0;}\
								|doc|docx|{0 -34px;}\
								|exe|msi|{0 -67px;}\
								|fla|{0 -100px;}\
								|html|htm|{0 -133px;}\
								|pdf|{0 -168px;}\
								|ppt|pptx|{0 -201px;}\
								|psd|{0 -234px;}\
								|swf|{0 -268px;}\
								|txt|log|ini|{0 -301px;}\
								|xls|xlsx|{0 -335px;}\
								|rm|rmvb|avi|mov|wmv|flv|mp4|ogg|{0 -369px;}\
								|rar|zip|tar|gz|{0 -403px;}\
								|mp3|wma|wav|midi|{0 -437px;}\
								|jpg|bmp|png|gif|{0 -471px;}\
								|ai|{0 -504px;}";

					var reg = new RegExp("\\|" + ext + "\\|[^{]*{(.*?)}", "i");
					var match = reg.exec(bgPos);
					return match ? match[1] : "";
				}

				function getFileItemById(fileId) {
					var i, item = null;
					for (i = fileList.length - 1; i >= 0; --i) {
						item = fileList[i];
						if (item.id == fileId) break;
					}
					return i >= 0 ? item : null;
				}

				// 搞全局TMD坑， IE11 function item() [native code]
				var item = null;
				if (res.responseData && res.responseData["code"] == "S_ERROR") {
					// todo: 变为error
					top.M139.UI.TipMessage.show("获取文件链接失败", {className: "msgRed", delay:3000});
				} else {
					list = res.responseData["var"].linkBeans;
					for (var i = 0, l = list.length; i < l; i++) {
						item = list[i];
						source = getFileItemById(item.objID);
						if(!source) continue;
						if(firstFileName == ""){
							firstFileName = source.name;
						}
						var fileSize = (source.file && source.file.fileSize) || source.fileSize;
						outLinkHtml += ['<dd style="margin: 0;padding: 0;display: block;height:37px;">',
											'<img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" contentEditable="false" style="display:inline-block;vertical-align:middle;display: inline-block;margin-right: 5px;width: 32px;height: 32px;background: url(/m2012/images/global/disk-small-icon.png) no-repeat;background-position:' + getFileIcoBgPos($Url.getFileExtName(source.name)) + '">',
											'<span contentEditable="false" title="'+source.name+'">'+$TextUtils.getTextOverFlow(source.name, 18, true)+'</span>',
											'<span contentEditable="false" style="color:#ccc"> (' + $TextUtils.getFileSizeText(fileSize) + ')</span>',
											'<a contentEditable="false" href="' + item.linkUrl + '" target="_blank" style="margin-left: 15px;color: #1a75ca;text-decoration: none;">查看</a>',
										'</dd>'].join("");
					}
					outLinkHtml += '<dd contentEditable="false" style="margin:10px 0; padding-top:10px; border-top: 1px dashed #d7d7d7; color:#ccc;user-select:none;-webkit-user-select:none;-moz-userselect:none;">来自139邮箱 - 彩云网盘的分享</dd></dl><br><br>';
					top.$Evocation.create({type: "compose", subject: "【139邮箱-彩云网盘】" + firstFileName, content: outLinkHtml});
				}
			});
	    },

        // 根据文件名判断文件是否为图片(且支持预览)
        isImage : function(fileName){
            if(!fileName){
                return;
            }
            var self = this;
            var extName = $T.Url.getFileExtName(fileName);

            if (extName == "") {
                return false;
            }
            return self.imageExts.indexOf(extName) == -1?false:true;
        },
        // 根据文件名获取文件缩略图路径
        getThumbImagePath : function(extName){
            /*if(!extName){
                return;
            }*/
            var self = this;
            return self.imagePath + self.getThumbImageName(extName);
        },
        // 根据文件名获取文件缩略图名称（非图片）
        getThumbImageName : function(extName){
            var doc = 'doc/docx',
                html = 'htm/html',
                ppt = 'ppt/pptx',
                xls = 'xls/xlsx',
                rar = 'rar/zip/7z',
                music = 'mp3/wma/wav/mod/m4a',
				vedio = 'mp4,wmv,flv,rmvb,3gp,avi,mpg,mkv,asf,mov,rm',
                other = 'pdf/ai/cd/dvd/psd/fla/swf/txt';
            //var extName = $T.Url.getFileExtName(fileName);
                if(extName == "") {
                    return 'default.png';
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
                if(extName && music.indexOf(extName.toLowerCase()) != -1){
                    return 'music.png';
                }
				if(extName && vedio.indexOf(extName.toLowerCase()) != -1){
					return 'rmvb.png';
				}
                if(other.indexOf(extName) != -1){
                    return extName + '.png';
                }
				if("exe".indexOf(extName) != -1){
					return 'exe.png';
				}
            return 'default.png';
        },
        getIconByType:function(filetype,dirName){
            var self=this;
            var imagePath="";
            if(filetype == self.dirTypes["ALBUM"]){  //相册
            //    imagePath=self.imagePath+"album.png";
				imagePath=self.imagePath+"norSys.png";
            }else if(filetype == self.dirTypes["MUSIC"]){    //音乐
            //    imagePath=self.imagePath+"phmic.png"; 音乐也是普通文件
				imagePath=self.imagePath+"norSys.png";
            }else if(filetype == self.dirTypes["USER_DIR"]){    //自定义文件夹
                imagePath=self.imagePath+"norSys.png";
            }
			if(dirName == "手机视频"){
				imagePath=self.imagePath+"video.png";
			}else if(dirName == "手机图片"){
				imagePath=self.imagePath+"phJpg.png";
			}else if(dirName == "我的相册1"){
				imagePath=self.imagePath+"phJpg.png";
			}
            return imagePath;
        },
        // 保存接口返回的目录信息
        setDirProperties : function(directorys){
        	var self = this;
            self.set('directorys', directorys);
            var tempSysDir = [],
                fileList = self.get('fileList');
            for(var i=0, l=fileList.length; i<l; i++){
                if(fileList[i].directory.dirFlag == 0){ //0代表系统目录
                    tempSysDir.push(fileList[i]);
                }
            }
            self.set('sysDirList', tempSysDir);
            var sysDirListObj = {};
            for(var i= 0,l=tempSysDir.length; i<l; i++){
                sysDirListObj[tempSysDir[i].id] = true;
            }
            self.set('sysDirListObj', sysDirListObj);
        },
        // 重置某些属性，重新打开当前目录或者触发refresh方法时调用该方法
        resetProperties : function(){
        	var self = this;
        	self.set('pageIndex', 1);
	    	self.set('selectedFids', []);
	    	self.set('selectedDirIds', []);
	    	self.set('selectedDirAndFileIds', []);
	    	self.set('shareFileId', []);
        },
        // 获取初始化目录ID
        getInitializeDirid : function(){
        	var self = this;
			if(self.inputPara.dirId){
				top.firstEnterNet = false;
                return self.inputPara.dirId + '';
            }
			
			if(self.get("139MailId")){
				return self.get("139MailId");
			}
            
			var rootId = self.getRootDir();
			return rootId + '';
            

        },
        // 判断用户是否安装邮箱小工具
        isSetupMailTool : function(){
            return M139.Plugin.ScreenControl.isScreenControlSetup();
        },
        // 获取用户选中的文件列表
        getSelectedFiles : function(){
            var self = this;
            var files = [];
            var fileList = self.get('fileList');
            var selectedFids = self.get('selectedFids');
            $(fileList).each(function(i){
                var fid = this.id;
                if($.inArray(fid, selectedFids) != -1){
                    files.push(this);
                }
            });
            return files;
        },
        // 获取当前目录下上传文件类型
        getFileTypeUpload: function(){
            var curDirType = this.get("curDirType");
            var fileTypeUpload = "";

            if (curDirType == this.dirTypes.ALBUM) {//相册目录
                fileTypeUpload = "image";
            } else if (curDirType == this.dirTypes.MUSIC) {//音乐目录
                fileTypeUpload = "music";
            }

            return fileTypeUpload;
        },
        // 根据文件ID返回缩略图对象
        getThumbnailById : function(fid){
            if(!fid){
                return;
            }
            var self = this;
            var file = {};
            var thumbImageList = self.get('thumbnailList');
            $(thumbImageList).each(function(i){
                var fileId = this.fileId;
                if(fileId == fid){
                    file = this;
                    return false;
                }
            });
            return file;
        },
        // 根据文件ID返回封面对象
        getCoverById : function(fid){
            if(!fid){
                return;
            }
            var self = this;
            var file = {};
            var coverList = self.get('coverList');
            $(coverList).each(function(i){
                var fileId = this.directoryId;
                if(fileId == fid){
                    file = this;
                    return false;
                }
            });
            return file;
        },
        
        // 判断用户是否为20元版
	   isServiceItem : function(){
	   		var self = this;
	   		return top.$User.getServiceItem() === self.serviceItem?true:false;
	   },
	   
	   // 获取文件名不带拓展名
	   getFileName : function(name){
	   		if(!name){
	   			return '';
	   		}
			var point = name.lastIndexOf(".");
			if(point == -1){
				return name;
			}else{
				return name.substring(0, point);
			}
	   },

        //从fileList中及dom中删除文件或文件夹
        delFileById: function (ids) {
            var fileList = this.get("fileList");
            for (var i = 0, len = ids.length; i < len; i++) {
                var id = ids[i];

                for (var j = 0, l = fileList.length; j < l; j++) {
                    if (id == fileList[j].id) {
                        fileList.splice(j, 1);
                        break;
                    }
                }
            }
        },

        //获取当前目录文件夹个数
        getFolderNumByCurDir: function(){
            var fileList = this.get("fileList");
            var folderNum = 0;

            for (var i = 0, len = fileList.length; i < len; i++) {
                fileList[i].type == this.dirTypes['DIRECTORY'] && folderNum++;
                if (fileList[i].type != this.dirTypes['DIRECTORY']) break;
            }

            return folderNum;
        },

        // 彩云文件大于200M时，将提示无法发送，服务端原因导致
        filterFile: function (fileList) {
            var fileList = fileList || this.getSelectedFiles();

            for (var i = 0, len = fileList.length; i < len; i++) {
                var item = fileList[i];
				var fileSile = (item.file && item.file.fileSize) || item.fileSize;
                if (fileSile >= this.limitSizeSend) {
                    return false;
                }
            }

            return true;
        },

        //接入彩云提示
        confirmMcloudUpgrade: function(){
            $Msg.confirm(
                "尊敬的用户，彩云网盘正在进行系统升级，暂时无法进行该操作，请稍后再试!",
                function(){},
                function(){},
                {
                    buttons: ["确定"]
                }
            ).setDialogTitle("彩云网盘系统升级");
        },

        //上报日志
        sendLogger : function(args){
            var self = this;
            if(!args){
                return ;
            }
            var selectedFid = self.get('selectedFids');
            var selectedDirId = self.get('selectedDirIds');
            var selectedDirAndFileId = self.get('selectedDirAndFileId');
            if((selectedFid.length > 0) && (selectedDirId.length > 0)){
                BH({key : args.file});
                BH({key : args.dir});
            }else if(selectedDirId.length > 0){
                BH({key : args.dir});
            }else if(selectedFid.length > 0){
                BH({key : args.file});
            }
        },
		getFileListByType: function(callback){
			var self = this;
			var contentType = self.get("currentShowType") || 0;
			var data = {
				toPage : self.get("pageIndex"),
				pageSize : self.get("pageSize"),
				sortDirection : 1,
				contentSortType : 0,
 				isSumnum : 1,
				contentType : contentType
			};
			top.$RM.call("disk:getContentInfosByType",data, function(res){
				callback && callback(res);
			});
		},
        //下载单个文件行为日志上报
        downloadLogger : function(fid){
            var self = this,
                doc = 'doc/docx/xls/xlsx/ppt/pptx',
                pic = 'jpg/gif/png/ico/jfif/tiff/tif/bmp/jpeg/jpe',
                music = 'mp3/wma/wav/mod/mid/cda',
                exe = 'exe/msi',
                rar = 'rar/zip/7z',
                pdf = 'pdf',
                txt = 'txt',
                video = 'avi/wmv/wmp/rm/ram//rmvb/ra/mpg/mpeg/mp4',
                html = 'htm/html',
                other = 'ai/cd/dvd/psd/fla/swf';
            var fidObj = self.getFileById(fid);
            var extname = fidObj.file.ext;
            if(doc.indexOf(extname) != -1){
                BH({key : "diskv2_download_office"});
            }else if(pic.indexOf(extname) != -1){
                BH({key : "diskv2_download_image"});
            }else if(music.indexOf(extname) != -1){
                BH({key : "diskv2_download_music"});
            }else if(exe.indexOf(extname) != -1){
                BH({key : "diskv2_download_exe"});
            }else if(rar.indexOf(extname) != -1){
                BH({key : "diskv2_download_zip"});
            }else if(pdf.indexOf(extname) != -1){
                BH({key : "diskv2_download_pdf"});
            }else if(txt.indexOf(extname) != -1){
                BH({key : "diskv2_download_txt"});
            }else if(video.indexOf(extname) != -1){
                BH({key : "diskv2_download_vedio"});
            }else if(html.indexOf(extname) != -1){
                BH({key : "diskv2_download_html"});
            }else if(fidObj.type != self.dirTypes.FILE || other.indexOf(extname) != -1){
                BH({key : "diskv2_download_other"});
            }
        }
	}));
})(jQuery, Backbone, _, M139);

/**
 * @fileOverview 彩云状态栏视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Disk.View.Statusbar', superClass.extend(
	/**
	 *@lends M2012.Disk.View.prototype
	 */
	{
		el : "body",
		name : "M2012.Disk.View.Statusbar",
        template : ['<div class="netdiskfl">',
			             '<div class="netdiskfldiv" id="navContainer">',
				             '<a href="javascript:;">全部文件</a>',
//				             '<span class="f_st">&gt;</span>',
//				             '<a href="javascript:void(0)">我的照片</a>',
//				             '<span class="f_st">&gt;</span>',
//				             '<span>阳朔旅游</span>',
			             '</div>',
		            '</div>', 
        			'<div class="netdiskfr">',
        				'<span class="viewTipPic fr mr_10">',
				             '<a href="javascript:void(0)" class="mr_5" id="listMode"><i class="i_view"></i>',
				             '</a>',
				             '<a href="javascript:void(0)" id="iconMode">',
				                 '<i class="i_list_checked"></i>',
				             '</a>',
				         '</span>',
				         '<div class="fileSearchBar fr mr_10">',
                             '<div class="fileSearchDiv hide">',
				                 '<input type="text" class="text gray" value="搜索彩云网盘" id="keywords">',
                             '</div>',
				             '<a bh="diskv2_search" href="javascript:void(0)" class="fileSearchBtn" id="search">',
				                 '<i class="i_g-search"></i>',
				             '</a>',
				         '</div>',
			             '<span class="mr_10">',
			                 '<a href="javascript:void(0)" onclick="top.$App.showOrderinfo()" id="upgrade" class="c_0066cc fr ml_10 mr_10">升级</a>',
			                 '<span class="diskprogressBarBlue fr"> <em class="growsBlow" style="width: {usedPercent}%;"></em> <em class="growFont">{usedSize}/{totalSize}</em>',
			                 '</span>',
			                 '<em class="fr">容量：</em>',
			             '</span>',
		          	 '</div>'].join(""),
		capacityTemplate : ['<span class="progressBarDiv viewtProgressBar">',
								'<span class="progressBar"></span>',
								'<span class="progressBarCur" role="progressbar">',
									'<span class="progressCenter" style="width: {usedPercent}%;"></span>',
								'</span>',
							'</span>',
							'<p>网盘容量：{usedSize}/{totalSize}<a href="javascript:void(0)" onclick="top.$App.showOrderinfo()" id="upgrade" class="ml_10">升级</a></p>'].join(""),
		listModeTemplate : ['<span class="viewTipPic fr mr_10 ml_10">',
				             '<a href="javascript:void(0)" class="mr_5" id="listMode"><i class="i_view_checked"></i>',
				             '</a>',
				             '<a href="javascript:void(0)" id="iconMode">',
				                 '<i class="i_list"></i>',
				             '</a>',
				         '</span>'].join(""),
		logger : new top.M139.Logger({name: "M2012.Disk.View.Statusbar"}),
		events : {
		},
		initialize : function(options) {
			this.model = options.model;
			return superClass.prototype.initialize.apply(this, arguments);
		},
		initEvents : function(){
        	var self = this;
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
                var jKeywordsParent = jKeywords.parent();

        		if(jKeywordsParent.hasClass('hide')){
                    jKeywordsParent.removeClass('hide');
                    var keyword = self.model.inputPara.keyword;
                    if(keyword && keyword != self.model.defaultInputValue){
                        jKeywords.val(keyword);
                        self.searchFiles();
                    }

                }else{
        			var text = jKeywords.val();
	        		if(!text || text === self.model.defaultInputValue){
                        jKeywordsParent.addClass('hide');
	        		}else{
	        			self.searchFiles();
	        		}
        		}*/
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
				BH("disk3_list");
				$("#fileName2").show();
				$(".diskTableList.onScollTable").show();
        	});
        	$("#iconMode").click(function(event){
                var target = $(this);

        		self.changeViewTip(function(){
                    self.model.set('listMode', 1);
                    $("#listMode i").attr('class', 'i_view_checked');
                    target.find('i').attr('class', 'i_list');
                });
				BH("disk3_filethumbnail");
				$("#fileName2").hide();
				$(".diskTableList.onScollTable").hide();
        	});
			$("#sortMenus2 li[name='uploadTime']").click(function(){
				self.model.set('listMode', 1);
				$("#sortMenus2").hide();
				return false;
			});
			$("#sortMenus2 li[name='fileSize']").click(function(){
				self.model.set('listMode', 0);
				$("#sortMenus2").hide();
				$("#fileName2").show();
				return false;
			});
			$("#sortMenus2 li[name='fileName']").click(function(){
				self.model.set('listMode', 2); //时间轴视图
				$("#sortMenus2").hide();
				return false;
			});
			$(document).click(function(){
				$("#sortMenus2").hide();
			});
        },
		render : function(){
		    var self = this;
		    $("#keywords").val(self.model.defaultInputValue);
		    var html = $T.Utils.format(self.template, self.model.getStatusObj());
			var htmlcap = $T.Utils.format(self.capacityTemplate, self.model.getStatusObj());
		 	$("#diskStatus").html(html);
			$("#capacityTemplate").html(htmlcap);
			$("#listModeContainer").html(self.listModeTemplate);
		 	$("#pcClientSetup").html(top.SiteConfig["pcClientSetupHtml"]);

		 	// 根据用户套餐信息显示升级链接
		 	if(self.model.isServiceItem()){
		 		var jUpgrade = $("#upgrade");
		 	//	$(".diskprogressBarBlue").addClass('mr_10');
		 	//	jUpgrade.hide();
		 	}
			self.navigatorContainer = {};//面包屑缓存
		},
		// 渲染目录导航 
		renderNavigation : function(dirid){
			var self = this;
			$("#navContainer").html(self.getNavHtml(dirid));
			self.initNavEvents();
		},
		// 获取目录导航html
		getNavHtml : function(dirid){
			var self = this;
		//	debugger;
            var rootId = self.model.getRootDir();
			if(!dirid){
				dirid = self.model.get('curDirId');
			}
			if(self.navigatorContainer[dirid]){
				return self.navigatorContainer[dirid];
			}
			var curDirObj = self.model.getDirById(dirid);
			self.model.set('parentDirs', []);
			self.model.setParentDirs(curDirObj);
			var parentDirs = self.model.getParentDirs();
			var navHtml = [];
			if(parentDirs && parentDirs.length > 0){
				$(parentDirs).each(function(i){
					if(this.directoryName && this.directoryName.length > 10){
						this.directoryName = this.directoryName.substring(0,10) + "...";
					}
					if(curDirObj.directoryName && curDirObj.directoryName.length > 10){
						curDirObj.directoryName = curDirObj.directoryName.substring(0,10) + "...";
					}
					if(i == 0){
						navHtml.push('<a href="javascript:;" fileid="');
						navHtml.push(rootId);
						navHtml.push('" filetype="0');
						navHtml.push('">全部文件</a>');
					}else{
						navHtml.push('<span class="f_st">&nbsp;&gt;&nbsp;</span>');
						navHtml.push('<a href="javascript:void(0)" fileid="');
						navHtml.push(this.directoryId);
						navHtml.push('" filetype="');
						navHtml.push(this.dirType);
						navHtml.push('">');
						navHtml.push(this.directoryName);
						navHtml.push('</a>&nbsp;');
					}
				});
				navHtml.push('<span class="f_st">&nbsp;&gt;&nbsp;</span>');
				navHtml.push('<span>');
				navHtml.push(curDirObj.directoryName);
				navHtml.push('</span>');
			}else{
				navHtml.push('<a href="javascript:;" fileid="');
                navHtml.push(rootId);
				navHtml.push('" filetype="0">全部文件</a>');
				//navHtml.push(curDirObj.directoryId);
                ///navHtml.push(10);
                //navHtml.push('" filetype="0');
				//navHtml.push('');
			}
			self.navigatorContainer[dirid] = navHtml.join('');
			return navHtml.join('');
		},
		// 为导航添加单击事件
		initNavEvents : function(){
			var self = this;
            var curDirLevel = self.model.get('curDirLevel');
            var userDirLimit = self.model.dirLevelLimit.USER_DIR;
			$("#navContainer a").click(toggleDirHandle);
			$("#navContainer strong").click(toggleDirHandle);

            function toggleDirHandle(){
				top.firstEnterNet = false;
                var dirId = $(this).attr('fileid');
                var dirType = $(this).attr('filetype');
                var dirObj = self.model.getDirById(dirId);
                var dirLevel = dirObj.directoryLevel;
                self.model.set('curDirType', dirType);
				var curDirId = self.model.get("curDirId");
				if(curDirId == self.model.getRootDir()){
					self.model.trigger('openDir', curDirId);
					return;
				}
                self.model.set('curDirId', dirId);
                self.model.set("curDirLevel", dirLevel);
                self.model.set("selectedFids", []);
                self.model.set("selectedDirIds", []);
                self.model.set("selectedDirAndFileIds", []);

                self.model.trigger("changeFileTypeUpload");
                //todo
                if(dirLevel != userDirLimit){   //当用户从自定义文件夹第四级目录下的文件点击当前位置菜单第四级需要用到
                    self.model.set("curDirLevel", 1);
                }
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
		searchFiles : function(){
			var self = this;
		//	var keywords = $.trim($("#keywords").val());
			var keywords = $T.Html.encode($Url.getQueryObj()["keyword"]) || "";//从URL获取搜索的内容
			self.model.search(function(result){
				if(result.responseData.code && result.responseData.code == 'S_OK'){
					var files = result.responseData['var'].files;
                    self.model.selectNone();//解决 选中文件之后 在搜索中输入关键字搜索后，还会显示之前的已选中多少文件
					self.model.set('fileList', files);
					
					$("#navContainer").html('搜索包含“'+keywords+'”的彩云网盘文件，共'+files.length+'个');
					self.model.set('searchStatus', -self.model.get('searchStatus'));
    			}else{
    				self.logger.error("search returndata error", "[disk:search]", result);
    			}
			}, keywords);
		}
	}));
})(jQuery, _, M139);



﻿M139.namespace("M2012.Disk.View", {// todo 类的用途，从model继承
	Command: Backbone.View.extend({
		el: "",
		initialize: function(options) {
            this.model = options.model;

            var self = this;
            top.$App.unbind("diskCommand")
                .on("diskCommand", function (args) {//监听其他模块发起的菜单命令
                self.doCommand(args.command, args);
            });
		},
        doCommand: function (command, args) {
            var self = this,
                model = self.model,
                dataSend = args.data,
                isLineCommand = args.isLineCommand,
                commands = model.commands;

            var isSelected = this.isSelected(dataSend);

            switch (command) {
                case commands.UPLOAD:
                    //alert("上传文件");
                    break;
                case commands.CREATE_DIR:
                    model.trigger("createDir", dataSend);
                    break;
                case commands.DOWNLOAD:
                    if (isSelected) {
                        model.trigger("download", dataSend);
                    } else {
    				top.M139.UI.TipMessage.show(self.model.tipWords.NO_FILE,{ delay: 3000, className: "msgYellow" });
                    }
                    break;
                case commands.PLAY:
                    if (isSelected) {
                        model.trigger("play");
                    } else {
                        top.M139.UI.TipMessage.show(self.model.tipWords.NO_FILE,{ delay: 3000, className: "msgYellow" });
                    }
                    break;    
                case commands.SHARE:
                    if (isSelected) {
                        model.trigger("share");
                        self.model.sendLogger({file : 'diskv2_sharefile', dir : 'diskv2_sharefolder'});
                    } else {
                        top.M139.UI.TipMessage.show(self.model.tipWords.NO_FILE,{ delay: 3000, className: "msgYellow" });
                    }
                    break;
                case commands.SEND_TO_MAIL:
                    if (isSelected) {
	                    self.commandSend(dataSend, self.model.sendTypes["MAIL"], isLineCommand);
                    } else {
                        top.$Msg.alert(model.tipWords.NO_FILE);
                    }

                    break;
                case commands.SEND_TO_PHONE:
                    self.commandSend(dataSend, self.model.sendTypes["MOBILE"]);
                    break;
                case commands.REMOVE:
                    self.commandRemove(dataSend);
                    break;
				case commands.DRAG:
                    self.commandDragMove(dataSend);
                    break;
                case commands.SET_COVER:
                    if (isSelected) {
                        self.commandSetCover(dataSend);
                    }else{
                        top.M139.UI.TipMessage.show(self.model.tipWords.NO_FILE,{ delay: 3000, className: "msgYellow" });
                    }
                    break;
                case commands.POSTCARD:
                    if (isSelected) {
                        self.commandPsotcard(dataSend);
                    }else{
                        top.M139.UI.TipMessage.show(self.model.tipWords.NO_FILE,{ delay: 3000, className: "msgYellow" });
                    }
                    break;
                case commands.RENAME:
                    if (isSelected) {
                        model.trigger("renameDirAndFile", dataSend);
                        model.sendLogger({file : 'diskv2_renamefile', dir : 'diskv2_renamefolder'});
                    } else {
                        top.M139.UI.TipMessage.show(self.model.tipWords.NO_FILE,{ delay: 3000, className: "msgYellow" });
                    }
                    break;
                case commands.DELETE:
                    if (isSelected){
                        self.commandDelete(dataSend, args.filename);
                        self.model.sendLogger({file : 'diskv2_deletefile', dir : 'diskv2_deletefolder'});

                    }else{
                        top.M139.UI.TipMessage.show(self.model.tipWords.NO_FILE,{ delay: 3000, className: "msgYellow" });
                    }
                    break;
				case "open":
					var fileids = self.model.get("selectedDirAndFileIds");
					if(fileids.length != 1){
						return;
					}
					var folder = $("em[fileid='"+ fileids[0] +"']");
					if(folder.length == 0){
						folder = $("img[fileid='"+ fileids[0] +"']");
					}
					folder[0].click();
            }
        },
        commandDelete: function (data, filename) {
            var self = this;
            var model = self.model;
//            var selectedDirAndFileLen = model.getSelectedDirAndFileOverflowNames(filename).length;
//            var selectedDirAndFileNames = model.getSelectedDirAndFileOverflowNames(filename).join(",");
            var tipContent;
            var selectedDirAndFileLen = model.get('selectedDirAndFileIds').length;
            var selectedFidLen = model.get('selectedFids').length;
            var selectedDirLen = model.get('selectedDirIds').length;
            var extName = $T.Url.getFileExtName(filename);
            //if(filename){
            //    if(extName){
            //        tipContent = model.tipWords.DELETE_FILE.format(1);
            //    }else{
            //        tipContent = model.tipWords.DELETE_DIR.format(1);
            //    }
            //}else if(selectedFidLen>0 && selectedDirLen>0){
            //    tipContent = model.tipWords.DELETE_FILEANDDIR.format(selectedDirLen, selectedFidLen);
            //}else if(selectedFidLen>0){
            //    tipContent = model.tipWords.DELETE_FILE.format(selectedFidLen);
            //}else if(selectedDirLen>0){
            //    tipContent = model.tipWords.DELETE_DIR.format(selectedDirLen);
            //}
            //top.$Msg.confirm(tipContent, function(){
            //    model.trigger("deleteDirsAndFiles", data);

            //}, function(){
            //    //cancel
            //}, {
            //    buttons: ["是", "否"]
            //});
            model.trigger("deleteDirsAndFiles", data);
        },
        commandSetCover : function(data){
            var self = this;
            self.model.trigger("setCover", data);
        },
        commandPsotcard : function(){
            var self = this,
                model = self.model;
            self.model.trigger("postCard"); 
        },
        // isLineCommantop.M139.UI.TipMessage.showd 代表是否直接点击列表中的发送链接
        commandSend: function (data, type, isLineCommand) {
            if (!this.isSelected(data) && !isLineCommand) {
                top.M139.UI.TipMessage.show(this.model.tipWords.NO_FILE,{delay:3000,className:'msgYellow'});
            } else if (this.isSelectedDir(data)) {
                top.M139.UI.TipMessage.show(this.model.tipWords.CANT_SEND_FOLDER,{delay:3000,className:'msgYellow'});
            } else {
				var tips = this.checkFileNum(data);
				if(!tips){
					this.sendFiles(type, data);
				}else{
					top.M139.UI.TipMessage.show(tips,{ delay: 3000, className: "msgYellow" });
				}
            }
        },
		commandDragMove: function(dataSend){
			//拖拽移动
			function getData(){
                var data = {
                    fileIds: model.get("selectedFids").join(","),
                    directoryIds: model.get("selectedDirIds").join(","),
                    srcDirType: model.getDirTypeForServer()
                };
                return data;
            }
			console.log(getData());
		},
        commandRemove: function (dataSend) {
        	var self = this;
            var isSelected = this.isSelected(dataSend);
            var model = this.model;

            if (isSelected) {
                var moveToDiskview = new top.M2012.UI.Dialog.SaveToDisk({
                    fileName: model.getSelectedDirAndFileNames().join(","),
                    data : getData(),
                    type : 'diskFileMove'
                });
                moveToDiskview.render().on("success", function () {
                    self.model.trigger('refresh', null);
                });
            } else {
                top.M139.UI.TipMessage.show(self.model.tipWords.NO_FILE,{ delay: 3000, className: "msgYellow" });
            }

            function getData(){
                var data = {
                    fileIds: model.get("selectedFids").join(","),
                    directoryIds: model.get("selectedDirIds").join(","),
                    srcDirType: model.getDirTypeForServer()
                };
                return data;
            }
        },
        
        sendFiles: function (type, data) {
	        var model = this.model;
            var fileList = [];

			var requestData = {
				linkType: 0,
				encrypt: 0,
				pubType: 1,
				fileIds: ""
			};

            if (data) {
                var fids = data.fileIds;
                requestData.fileIds = data.fileIds.join(",");
                for (var i = 0, len = fids.length; i < len; i++) {
                    var fileItem = model.getFileById(fids[i]);
                    fileList.push(fileItem);
                }
            } else {
                fileList = model.getSelectedFiles();
                requestData.fileIds = _.pluck(fileList, "id").join(",");
            }			
			
            if(model.get("isMcloud") == "0"){
            	model.gotoSendPage({fileList : fileList, type: type});
            } else {
	            model.popupComposeSmallPop(fileList, requestData);
            }
        },

        //是否选择了目录或者文件
        isSelected: function (data) {
            var value;

            if (data) {
                value = data.fileIds || data.directoryIds ? true : false;
            } else {
                value = this.getSelectedFileId() || this.getSelectedDirId() ? true : false;
            }

            return value;
        },
		checkFileNum:function (){//选择发送的文件数量是否多50/5元用户
			var length = this.model.getSelectedFiles().length;
			var serviceItem = top.$User.getServiceItem()>-1;
			var self = this;
			if(serviceItem){
				return length <=50?false:self.model.tipWords['SELECTEDFILE_TO_MANY'];
			}else{
				return length <=10?false:self.model.tipWords['SELECTEDFILE_TO_MANY'];
			}
		},
		checkShareNum:function(){
			
		},
        isSelectedDir: function (data) {
            var value;

            if (data) {
                value = data.directoryId ? true : false;
            } else {
                value = this.getSelectedDirId() ? true : false;
            }

            return value;
        },
        getSelectedFileId: function(){
            return this.model.get("selectedFids").join(",");
        },
        getSelectedDirId: function(){
            return this.model.get("selectedDirIds").join(",");
        },
        getFileAndDirIds: function(){
            var ids = this.model.get("selectedFids").concat(this.model.get("selectedDirIds"));

            return ids.join(",");
        }
	})
});

/**
 * @fileOverview 彩云工具栏视图层.
 * @namespace
 */
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Disk.View.Leftbar', superClass.extend(
	/**
	 *@lends M2012.Disk.View.prototype
	 */
	{
	    el: "body",
	    name: "M2012.Disk.View.Leftbar",
	    template: ['<div class="uploadDiv" style="position:relative;">',
						'<!-- <a href="#" class="greenBtn uploadBtn" role="button"><i class="icon i-upload"></i>上传</a> -->',
						'<a href="javascript:;" role="button" hidefocus class="btn btnGreen" style="border: none;"><span><i class="icon i-upload"></i>上传</span></a>',
						'<div id="floatLoadDiv" style=" top:8px; left:28px; width: 142px; height: 29px;">',
							'<form style="" enctype="multipart/form-data" id="fromUpload" method="post" action="" target="frmUploadTarget">',
								'<input style="height: 29px;" type="file" name="uploadInput" id="uploadFileInput"/>',
								'<input style="display:none;height: 20px;" type="button" name="uploadInput"/>',
							'</form>',
							'<iframe id="frmUploadTarget" style="display: none" name="frmUploadTarget"></iframe>',
							'<div id="flashContainer"></div>',
						'</div>',
					'</div>',
                    '<div id="scrollDiv" class="networkDisk-folderScroll sweb" style="height:300px;">',
		    '<div class="folder-wraper">',
                 '<div class="folder-wraper-inner">',
					'<ul class="listMenu" role="tree" style="border-top:0;">',
						'<li class="on"><a href="javascript:void(0);" id="all"><i class="icon all-file"></i>全部文件</a></li>',
						'<li style=""><a href="javascript:void(0)" id="document1" bh="disk3_left_doc"><i class="icon i-doc"></i>文档</a></li>',
						'<li style=""><a href="javascript:void(0)" id="images" bh="disk3_left_img"><i class="icon i-img"></i>图片</a></li>',
						'<li style=""><a href="javascript:void(0)" id="music" bh="disk3_left_mus"><i class="icon i-mic"></i>音乐</a></li>',
						'<li style=""><a href="javascript:void(0)" id="vedio" class="borderBtm" style="border-bottom:0;" bh="disk3_left_vid"><i class="icon i-mov"></i>视频</a></li>',
						'<li style="display: none;"><a href="javascript:void(0)" id="linksManage" class="borderTop"><i class="icon i-link"></i>管理分享邮件</a></li>',
					'</ul>',
					'<ul class="listMenu" role="tree">',
						'<li><a href="javascript:void(0)" id="friendsShare" bh="friendShare"><i class="icon i-share"></i>收到的分享</a></li>',
						'<li><a href="javascript:void(0)" id="myShare" bh="myShare"><i class="icon i-myShare"></i>分享给好友</a></li>',
						'<li><a href="javascript:void(0)" id="officeshare" bh="officialsharing"><i class="icon i-c139"></i>官方共享</a></li>',
					'</ul>',
					'<ul class="listMenu" role="tree">',
						'<li><a href="javascript:void(0)" id="attachment" bh="diskv2_attachfolder_load"><i class="icon i-clamp"></i>附件夹</a></li>',
						'<li><a href="javascript:void(0)" id="cabinet"><i class="icon i-tank"></i>暂存柜</a></li>',		
					'</ul>',
                    '<ul class="listMenu noLineBottom" role="tree">',
						'<li class="p_relative">',
                            '<a href="javascript:void(0)" id="recycle"><i class="icon i-recycle"></i>回收站</a>',
                        '</li>',
					'</ul>',
                    '</div>',
                    '</div>',
					'<div class="downloadDisk" id="downloadDisk">',
						'<div class="diskUseAmount" id="capacityTemplate">',
							'<span class="progressBarDiv viewtProgressBar">',
								'<span class="progressBar"></span>',
								'<span class="progressBarCur" role="progressbar">',
									'<span class="progressCenter" style="width: 0%;"></span>',
								'</span>',
							'</span>',
							'<p>网盘容量：0M/0G<a href="javascript:void(0)" onclick="top.$App.showOrderinfo()" id="upgrade" class="ml_10">升级</a></p>',
						'</div>',
						'<div class="diskpOtherTool">',
							'<a href="javascript:top.$App.show(\'pcClientSetup\');" id="pcClient" bh="disk3_pcclient" style="margin-right:60px;">',
								'<i class="icon i-pc"></i>',
								'<span>PC客户端</span>',
							'</a>',
							'<a href="javascript:top.$App.show(\'smallTool\');" id="smallTools" bh="disk3_tools">',
								'<i class="icon i-tool"></i>',
								'<span>小工具</span>',
							'</a>',
							'<span class="i-addrDot" id="tipsForTools" style="display: none;"></span>',
                                           	'</div>',
					  '</div>',
					'</div>'].join(""),
	    recycleTip: [
         '<div class="newGroupTips" style="display:none;">',
             '<div class="inner">',
                 '<i class="icon-light mr_10"></i>',
                 '<p>在这里找回删除的文件</p>',
             '</div>',
             '<i href="javascript:" class="i_u_close" style="cursor:pointer;"></i>',
             '<i class="arrow-left-tips"></i>',
         '</div>'
	    ].join(""),
	    events: {
	        //左侧
	        "click #uploadFileInput": "uploadFileInput",
	        "click #all": "showAll",
	        "click #document1": "showDocument",
	        "click #images": "showImages",
	        "click #music": "showMusic",
	        "click #vedio": "showVedio",
	        "click #linksManage": "showLinksManage",
	        "click #friendsShare": "showFriendsShare",
	        "click #myShare": "showMyShare",
	        "click #attachment": "showAttachment",
	        "click #cabinet": "showCabinet",
	        "click #recycle": "showRecycle",
	        "click #officeshare": "officeshare"
	    },
	    render: function () {
	        var self = this;
	        $("#inAside").html(this.template);
	        //右侧框架定位
	        self.onResize();
	        $(window).resize(function () {
	            self.onResize();
	        });
	        if(location.host.indexOf("rd139cm.com") > -1 ){//验收环境隐藏官方共享
		        $('#officeshare').parent().hide();
	        }
	    },
	    initialize: function (options) {
	        var self = this;
	        this.render();
	        this.model = options.model;
	        this.initURL();//搜索的时候展示不同的内页
	        if (!this.isHTML5() && !this.isUploadControlSetup()) {
	            $("#tipsForTools").show();
	        }
	        self.initEvents();
	        return superClass.prototype.initialize.apply(this, arguments);
	    },
	    initEvents: function () {
	        var self = this;
	        //绑定事件用于显示文件删除后可以在回收站找到提示
	        self.model.on("showRecycleTips", function () {
	            self.showRecycleTips();
	        });

	    },
	    initURL: function () {
	        var from = $T.Url.queryString("from");
	        var keyword = $T.Url.queryString("keyword");
	        switch (from) {
	            case "officialsharing":
	                this.officeshare();
	                break;
	            case "attachment":
	                this.showAttachment(keyword);
	                this.model.set("break", true);
	                break;
	            case "cabinet":
	                this.showCabinet(keyword);
	                this.model.set("break", true);
	                break;
	            case "recycle":
	                this.showRecycle(keyword);
	                this.model.set("break", true);
	                break;
	            default:
	                //	this.showAll();
	                this.model.set("break", false);
	                break;
	        }
	    },
	    onResize: function () {
	        try {
	            $iframe = $("#netRightFrame");
	            $iframe.height($(top.document.body).height() - 47 - 29 - 12); //减去多余4像素
	            if ($.browser.msie && $.browser.version < 8) {
	                $iframe.width($(top.document.body).width());
	            } else {
	                $iframe.width($(document.body).width() - 200);
	            }
	            //计算左侧滚动条的高度
	            var scrollEl = $("#scrollDiv");
	            var height = $(document.body).height() - scrollEl.offset().top;
	            scrollEl.height(height);

	        } catch (e) { }
	    },
	    showRecycleTips: function () {
	        var self = this;
	        if (top.$App.getUserCustomInfo("disk_used_recycle") == "1")
	            return;

	        //首先将左侧滚动条滚动到底部
	        var scrollEl = $("#scrollDiv");
	        scrollEl[0].scrollTop = scrollEl[0].scrollHeight;

	        var tipsEl = $(self.recycleTip).appendTo(document.body);
	        tipsEl.css({
	            top: $("#recycle").offset().top
	        }).show().find(".i_u_close").click(function (e) {
	            tipsEl.fadeOut();
	        });

	        //5秒钟后自动消失
	        window.setTimeout(function () {
	            tipsEl.fadeOut();
	        }, 5000);

	        //设置标示下次不展示
	        top.$App.setUserCustomInfoNew({
	            disk_used_recycle: "1"
	        });
	    },
	    showDifferentDoc: function () {
	        var self = this;
	        $("#createDir").hide();//关闭顶部操作按钮控制
	        //$("#share").show();//关闭顶部操作按钮控制
	        $("#rename").hide();//关闭顶部操作按钮控制
	        $("#remove").hide();
	        if (top.secondSSS) {
	            top.secondSSS = false;
	        }
	        self.model.set("selectedFids", []);
	        self.model.set("selectedDirIds", []);
	        self.model.set("selectedDirAndFileIds", []);
	        top.M139.UI.TipMessage.show("正在加载中...");
	        //	if(self.model.set('currentShowType') == 1 && self.model.get('listMode') == 3){
	        //		self.model.set('listMode',2);
	        //	}
	        //	self.showAll();//如果是来自右上角搜索，清除搜索的影响
	        this.model.getFileListByType(function (result) {
	            $(".inboxHeader.bgMargin").hide();
	            if (result.responseData && result.responseData.code == 'S_OK') {
	                top.M139.UI.TipMessage.hide();
	                console.log(result);
	                self.model.diskAllInfo = result.responseData['var'];
	                self.model.set('fileList', self.model.diskAllInfo.files);
	                self.model.set('totalSize', self.model.diskAllInfo.totalCount);
	                //	self.model.set('searchStatus', -self.model.get('searchStatus'));
	                self.model.trigger("createPager");

	                self.model.trigger("renderFileList");
	                self.toggeleFrame2();
	            } else {
	                top.M139.UI.TipMessage.show("加载失败", { delay: 1000 });
	                self.logger.error("getContentInfosByType returndata error", "[disk:getContentInfosByType]", result);
	            }
	        });
	    },
	    uploadFileInput: function () {
	        var netRigthFrame = $("#netRightFrame").attr("src");
	        if ((netRigthFrame == "" || netRigthFrame.indexOf("cabinet.html") > -1) && this.model.get("currentShowType") == 0) {  //彩云网盘和暂存柜的时候正常处理，其他页面跳到彩云网盘
	            return;
	        } else {
	            if ($("#navContainer:visible").length == 0) {
	                this.showAll();
	            }
	            /*
                    $("#disk-main").show();
                    $("#iframe-main").hide();
                    var allFiles = $("#navContainer").find("a");
                    if(allFiles.length !=0){
                        if(allFiles.eq(0).text() == "全部文件"){
                            allFiles.eq(0).click();
                            return;
                        }
                    }
                */
	        }
	    },
	    //如果是右上角搜索，再点击文档类型，则先刷新所有，再按照类型搜索，否则不用刷新所有
	    showAll: function (e) {
	        BH("disk3_getAll");
	        var self = this;
	        this.toggeleFrame2();
	        $("ul.listMenu li").removeClass("on");
	        $("#all").closest("li").addClass("on");
	        top.firstEnterNet = false;
	        this.model.set("isImagesMode", false);
	        this.model.set('currentShowType', 0); //关闭文档类型显示顶部操作按钮
	        self.model.set('curDirId', "-1");
	        self.model.set('curDirId', self.model.getRootDir());
	        $("#createDir").show();//关闭顶部操作按钮控制
	        $(".inboxHeader.bgMargin").show();
	        $("#rename").show();//关闭顶部操作按钮控制
	        $("#remove").show();//关闭顶部操作按钮控制
	        $('#download').find('a').addClass("ml_6");
			this.model.trigger("refresh");
	        return;
	        var allFiles = $("#navContainer").find("a");
	        if (allFiles.length != 0) {
	            if (allFiles.eq(0).text() == "全部文件") {
	                allFiles.eq(0).click();
	                return;
	            }
	        }
	        //	$("#all").closest("li").addClass("on").siblings().removeClass();
	        var location1 = location.href;
	        //	var url = $("#netRightFrame").attr("src");
	        var index = location1.indexOf("from");
	        if (index != -1) {
	            location1 = location1.slice(0, index - 1);
	        }
	        //	if(url.indexOf("cabinet.html") > -1 || url.indexOf("mailattach_attachlist.html") > -1){
	        //		
	        //	}
	        location.href = location1;
	    },
	    ifIsUploading: function () {
	        var cancel = true;
	        var uploadModel = mainView && mainView.uploadModel;
	        var isUploading = uploadModel && uploadModel.isUploading();
	        if (isUploading) {
	            if (window.confirm("切换栏目，当前正在上传的文件会失败，是否关闭？")) {
	                cancel = true;
	            } else {
	                cancel = false;
	            }
	        }
	        return cancel;
	    },
	    showDocument: function (e) {
	        if (!this.ifIsUploading()) {
	            return;
	        }
	        var target = $(e.target).closest("li");
	        $("ul.listMenu li").removeClass("on");
	        target.addClass("on");
	        $('#download').find('a').removeClass("ml_6");
	        this.model.set("isImagesMode", false);
	        this.model.set('currentShowType', 4);//关闭顶部操作按钮控制
	        this.model.set('pageIndex', 1);
	        this.showDifferentDoc();
	        //	this.toggeleFrame2();
	    },
	    showImages: function (e) {
	        if (!this.ifIsUploading()) {
	            return;
	        }
	        if (e) {
	            var target = $(e.target).closest("li");
	            $("ul.listMenu li").removeClass("on");
	            target.addClass("on");
	        }
	        $('#download').find('a').removeClass("ml_6");
	        this.model.set('currentShowType', 1);
	        this.model.set('pageIndex', 1);
	        this.model.set("isImagesMode", true);
	        this.model.set('listMode', 2, { silent: true }); //图片的话，默认为时间轴模式
	        this.showDifferentDoc();
	        //	this.toggeleFrame2();
	    },
	    showMusic: function (e) {
	        if (!this.ifIsUploading()) {
	            return;
	        }
	        var target = $(e.target).closest("li");
	        $("ul.listMenu li").removeClass("on");
	        target.addClass("on");
	        $('#download').find('a').removeClass("ml_6");
	        this.model.set('currentShowType', 2);
	        this.model.set('pageIndex', 1);
	        this.model.set("isImagesMode", false);
	        this.showDifferentDoc();
	        //	this.toggeleFrame2();
	    },
	    showVedio: function (e) {
	        if (!this.ifIsUploading()) {
	            return;
	        }
	        var target = $(e.target).closest("li");
	        $("ul.listMenu li").removeClass("on");
	        target.addClass("on");
	        $('#download').find('a').removeClass("ml_6");
	        this.model.set('currentShowType', 3);
	        this.model.set('pageIndex', 1);
	        this.model.set("isImagesMode", false);
	        this.showDifferentDoc();
	        //	this.toggeleFrame2();
	    },
	    //隐藏掉主框架，显示内部小框架
	    //每次切换的时候，要重新创建上传按钮，但是切换到暂存柜，则按照暂存柜的方式创建，其他的按照彩云网盘的创建
	    toggeleFrame: function (flag) {
	        $("#disk-main").hide();
	        $("#iframe-main").show();
	        if (top.toolbarView && !flag && $T.Url.queryString("from") !== "attachment") {
	            top.toolbarView.createBtnUpload();
	        }
	    },
	    toggeleFrame2: function () {
	        $("#disk-main").show();
	        $("#iframe-main").hide();
	        if (top.toolbarView) {
	            top.toolbarView.createBtnUpload();
	        }
	    },
	    showLinksManage: function (e) {
	        this.toggeleFrame();
	        //	var target = $(e.target).closest("li");
	        //	target.addClass("on").siblings().removeClass();
	        $("ul.listMenu li").removeClass("on");
	        $("#linksManage").closest("li").addClass("on");
	        $("#netRightFrame").attr("src", "http://www.baidu.com/index.php"); //减去多余4像素
	    },
	    showFriendsShare: function (e) {
	        if (!this.ifIsUploading()) {
	            return;
	        }
	        this.toggeleFrame();
	        //	var target = $(e.target).closest("li");
	        //	target.addClass("on").siblings().removeClass();
	        //	$("#netRightFrame").attr("src","/m2012/html/disk/disk_friend-share.html?sid="+top.sid); //减去多余4像素
	        $("ul.listMenu li").removeClass("on");
	        $("#friendsShare").closest("li").addClass("on");
	        //$("#netRightFrame").attr("src", "/m2012/html/disk/disk_share_friend.html?sid=" + top.sid);
	        $("#netRightFrame").attr("src", "/m2012/html/disk_v2/disk_share_recive.html?sid=" + top.sid);
	    },
	    showMyShare: function (e) {
	        if (!this.ifIsUploading()) {
	            return;
	        }
	        this.toggeleFrame();
	        //	var target = $(e.target).closest("li");
	        //	target.addClass("on").siblings().removeClass();
	        //	$("#netRightFrame").attr("src","/m2012/html/disk/disk_my-share.html?sid="+top.sid); //减去多余4像素
	        $("ul.listMenu li").removeClass("on");
	        $("#myShare").closest("li").addClass("on");
	        //$("#netRightFrame").attr("src", "/m2012/html/disk/disk_share_my.html?sid=" + top.sid); //减去多余4像素
	        $("#netRightFrame").attr("src", "/m2012/html/disk_v2/disk_share_to.html?sid=" + top.sid); //减去多余4像素
	        //	var myshare = $("#netRightFrame")[0].contentWindow;
	        //	M139.Timing.waitForReady('myshare',function(){
	        //		myshare.document.getElementById("myShare").click();
	        //	})

	        //	setTimeout(function(){
	        //		$("#netRightFrame")[0].contentWindow.document.getElementById("myShare").click();
	        //	}, 0);
	    },
	    showAttachment: function (key) {
	        if (typeof key != "string" && !this.ifIsUploading()) {
	            return;
	        }
	        this.toggeleFrame();
	        $("ul.listMenu li").removeClass("on");
	        $("#attachment").closest("li").addClass("on");
	        //	var target = $(e.target).closest("li");
	        //	target.addClass("on").siblings().removeClass();
	        var url = "/m2012/html/mailattach/mailattach_attachlist.html?sid=" + top.sid;
	        if (key && typeof (key) == "string") {
	            url = url + "&keyword=" + key;
	        }
	        $("#netRightFrame").attr("src", url); //减去多余4像素
	    },
	    officeshare: function () {
	        this.toggeleFrame();
	        $("ul.listMenu li").removeClass("on");
	        $("#officeshare").closest("li").addClass("on");
	        $("#netRightFrame").attr("src", "/m2012/html/disk_v2/officialsharing.html?sid=" + top.sid); //减去多余4像素
	    },
	    showCabinet: function (key) {
	        if (typeof key != "string" && !this.ifIsUploading()) {
	            return;
	        }
	        this.toggeleFrame(true);
	        $("ul.listMenu li").removeClass("on");
	        $("#cabinet").closest("li").addClass("on");
	        //	var target = $(e.target).closest("li");
	        //	target.addClass("on").siblings().removeClass();
	        //	$("#netRightFrame").height($("#netRightFrame").height() - 30);
	        var url = "/m2012/html/fileexpress/cabinet.html?sid=" + top.sid;
	        if (key && typeof (key) == "string") {
	            url = url + "&keyword=" + key;
	        }
	        $("#netRightFrame").attr("src", url);
	    },
	    showRecycle: function (key) {
	        if (typeof key != "string" && !this.ifIsUploading()) {
	            return;
	        }
	        this.toggeleFrame(true);
	        $("ul.listMenu li").removeClass("on");
	        $("#recycle").closest("li").addClass("on");
	        var url = "/m2012/html/disk_v2/disk_index.html?sid=" + top.sid;
	        if (key && typeof (key) == "string") {
	            url = url + "&keyword=" + key;
	        }
	        $("#netRightFrame").attr("src", url);
	        top.BH("disk_recycle_enter");
	    },
	    isUploadControlSetup: function () {
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
	    isHTML5: function () {
	        return window.File && window.FileList && window.FileReader && window.Blob && window.FormData && window.Worker && "withCredentials" in (new XMLHttpRequest);
	    }
	}));
})(jQuery, _, M139);

/**
 * @fileOverview 彩云工具栏视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Disk.View.Toolbar', superClass.extend(
	/**
	 *@lends M2012.Disk.View.prototype
	 */
	{
		el : "body",
		name : "M2012.Disk.View.Toolbar",
		events : {
            "click #createDir"  : "createDir",
            "click #download"   : "download",
            "click #play"   	: "play",
            "click #rename"     : "rename",
            "click #share"      : "share",
			"click #delete"     : "deleteDirsAndFiles",
            "click #setCover"   : "setCover",
            "click #postcard"   : "postcard",
            "click #remove"     : "remove",
			"click #sortDock"   : "showSortTable",
			"click #isimagesModel" : "showImagesModel",
			"click #sendFile"   : "sendToMail"
		},
		initialize : function(options) {
			var self = this;
			this.model = options.model;
            this.parentView = options.parentView;
            this.initEvents();
			return superClass.prototype.initialize.apply(this, arguments);
		},
		initMoreBtns : function(flag){
			/*var self = this;
			$("#more").html("");
			var menuItems = [
					{
                        text: "分享给好友",
                        onClick: function(){ self.share();}
                    },
                    {
                        text: "移动到",
                        onClick: function(){ self.remove();}
                    },
                    {
                        text: "重命名",
                        onClick: function(){ self.rename();}
                    }
                ];
			if(!flag){
				menuItems = [menuItems[1]];
			}else{
				menuItems = menuItems;
			}
			M2012.UI.MenuButton.create({
				text:"更多",
				container:$("#more"),
				leftSibling:true, //左边还有按钮，影响样式
				rightSibling:false, //右边还有按钮，影响样式
				menuItems:menuItems
			});
*/			//修改样式 默认的button已经修改
		//	$("#more > a").removeClass("btnTb").addClass("btn ml_10");
		//	$("#more span").replaceWith('<em>更多</em><i class="triangle t_globalDown"></i>');
		},
        initEvents:function () {
            var self = this;
			//顶部按钮
			this.initMoreBtns(1);
			if(self.model.get("currentShowType")){
				$("#more").hide();
			}
            // 关闭小工具引导层
            $("#closeSetupTool").click(function(event){
                $("#setupToolContainer").hide();
            });

            // 绑定排序菜单单击事件
            var sortTypes = self.model.sortTypes;
            $("#sortMenus li[name='fileName']").click(function (event) {
                self.model.set('sortType', sortTypes['FILE_NAME']);
                self.model.set('sortIndex', -self.model.get('sortIndex'));

                $("#sortMenus").hide();
            });
            $("#sortMenus li[name='uploadTime']").click(function (event) {
                self.model.set('sortType', sortTypes['UPLOAD_TIME']);
                self.model.set('sortIndex', -self.model.get('sortIndex'));

                $("#sortMenus").hide();
            });
            $("#sortMenus li[name='fileSize']").click(function (event) {
                self.model.set('sortType', sortTypes['FILE_SIZE']);
                self.model.set('sortIndex', -self.model.get('sortIndex'));

                $("#sortMenus").hide();
            });

            //上传按钮初始化
            this.createBtnUpload();

            self.model.on("change:sortType", function(){// 排序类型
                self.parentView.fileListView.sortByType(); // 排序model层数据
                self.model.trigger("renderFileList");// 重新渲染文件列表
                self.renderSortMenu();// 重新渲染排序菜单
            });
            self.model.on("change:sortIndex", function(){// 排序方式 升序或者降序
                self.parentView.fileListView.sortByType();
                self.model.trigger("renderFileList");
                self.renderSortMenu();
            });
            self.model.on("renderBtns", function () {// 重新渲染工具栏按钮
                self.renderBtns();
            });
            self.model.on("change:isRenameActivate", function(){//工具栏重命名按钮是否激活
				  /*var isActivate = self.model.get('isRenameActivate');
            //    var jRename = $("#rename");
                if(isActivate){
                    self.initMoreBtns(1); //有 重命名和共享
					if(self.model.get('currentShowType') != 0 ){
						$("#share,#rename").show();
					}
                }else{
                    self.initMoreBtns(0); //无 重命名和共享
					if(self.model.get('currentShowType') != 0 ){
						$("#share,#rename").hide();
					}
                }
*/            });
			self.model.on("change:hasSysFolders", function(){//工具栏重命名按钮是否激活
				  //var isActivate = self.model.get('hasSysFolders');//0为系统文件夹，1为普通
            //    var jRename = $("#rename");
                //if(isActivate){
                    //$("#sendFile").show(); //有 重命名和共享
					//$("#delete").show();
					//$("#more").show();
                //}else{
                    //$("#sendFile").hide(); // 重命名和共享
					//$("#delete").hide();
					//$("#more").hide();
                //}
            });
            self.model.on("change:isShareActivate", function(){//工具栏分享按钮是否激活
			
                /*var isActivate = self.model.get('isShareActivate');
				if(isActivate){
                    self.initMoreBtns(1); //有 重命名和共享
					if(self.model.get('currentShowType') != 0 ){
						$("#share,#rename").show();
					}
                }else{
                    self.initMoreBtns(0); //无 重命名和共享
					if(self.model.get('currentShowType') != 0 ){
						$("#share,#rename").hide();
					}
                }
*/			/*
                var jShare = $("#share");
                if(isActivate){
                    jShare.find('a').show();
                }else{
                    jShare.find('a').hide();
                }
			*/	
            });
			self.model.on("change:hasFolders", function(){//工具栏重命名按钮是否激活
				 // var isActivate = self.model.get('hasFolders');
            //    var jRename = $("#rename");
                //if(isActivate){
                //    $("#sendFile").show(); //有 重命名和共享
                //}else{
                 //   $("#sendFile").hide(); //有 重命名和共享
               // }
            });
            self.model.on("change:isSetCoverActivate", function(){// 工具栏设为封面按钮是否激活
                /*var isActivate = self.model.get('isSetCoverActivate');
                var jsetCover = $("#setCover");
                if(isActivate){
                    jsetCover.find('a').show();
                }else{
                    jsetCover.find('a').hide();
                }
*/            });
            self.model.on("change:isPostCardActivate", function(){// 工具栏明信片按钮是否激活
                /*var isActivate = self.model.get('isPostCardActivate');
                var jPostCard = $("#postcard");
                if(isActivate){
                    jPostCard.find('a').show();
                }else{
                    jPostCard.find('a').hide();
                }
*/            });
            self.model.on("change:isPlayActivate", function(){// 工具栏明信片按钮是否激活
                /*var isActivate = self.model.get('isPlayActivate');
                var jPlay = $("#play");
                if(isActivate){
                    jPlay.find('a').show();
                }else{
                    jPlay.find('a').hide();
                }
*/            });
            self.model.on('change:isCreateBtnShow', function(){// 工具栏新建文件夹按钮是否显示
                //var isShow = self.model.get('isCreateBtnShow');
                //var jCreateDirBtn = $('#createDir');
                //if(isShow){
                    //jCreateDirBtn.css('display','none');关闭新建文件夹显示
                //}else{
                    //jCreateDirBtn.css('display','block');关闭新建文件夹显示
                //}
            });
        },
		showAll: function(e){
			BH("disk3_getAll");
			$("#disk-main").show();
			$("#iframe-main").hide();
            top.firstEnterNet = false;
            this.model.set("isImagesMode",false);
            this.model.set('currentShowType',0);
            this.model.set('curDirId',"-1");
            this.model.set('curDirId', this.model.getRootDir());
            //$("#createDir").show(); 关闭顶部按钮变化关闭顶部按钮变化
            $(".inboxHeader.bgMargin").show();
           // $("#share").hide();关闭顶部按钮变化
            //$("#rename").hide();关闭顶部按钮变化
		},
        createBtnUpload: function(){
            var This = this;
            mainView.uploadModel = new M2012.Fileexpress.Cabinet.Model.Upload({type:"disk"});

            window.UploadApp = new UploadFacade({
                btnUploadId: "uploadFileInput",//上传按钮dom元素的id
                fileNamePre: "filedata",
                model: mainView.uploadModel,
                subModel: This.model,
                isCommonUpload: true,
                isMcloud: This.model.get("isMcloud")
            });

            This.model.on("changeFileTypeUpload", function(){
                var fileTypeUpload = This.model.getFileTypeUpload();

                UploadApp.setFileType(fileTypeUpload);
            });

            UploadApp.on("select", function (options) {
                var fileList = options.fileList;
                var uploadType = this.currentUploadType;
				
                
				/*
				上传跳转修复，有bug，暂未处理*/
				var version = "7.08.09.0";
				if($.browser.msie && version.indexOf($.browser.version) != -1){
					var netRigthFrame = $("#netRightFrame").attr("src");
					if(netRigthFrame == "" || netRigthFrame.indexOf("cabinet.html") > -1){ //彩云网盘和暂存柜的时候正常处理，其他页面跳到彩云网盘
					//	return;
					}else{
						if($("#navContainer:visible").length == 0){
							This.showAll();
						}
					}
				}
                if (this.model.filterFile(fileList, uploadType)) {
                    this.model.trigger("renderList", {fileList: fileList});
                    this.setFileList(fileList);
                }
				
            });

            UploadApp.on("prepareupload", function(){
                var self = this;

                this.uploadHandle(function(){
                    self.model.trigger("error");
                }, function(){
                    self.model.trigger("getFileMd5");
                }, "", getDirInfo());
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

                UploadModel.completeHandle(clientTaskno, responseText, function(){//上传成功
                    UploadModel.trigger("complete");

                    self.uploadHandle(function(){//继续传下个文件
                        UploadModel.trigger("error");
                    }, function(){
                        UploadModel.trigger("getFileMd5");
                    }, "", getDirInfo());
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

                if (!state) {
                    this.model.trigger("error");
                    return;
                }

                this.uploadHandle(function(){//续传
                    self.model.trigger("error");
                }, function(){
                    self.model.trigger("getFileMd5");
                }, clientTaskno, getDirInfo());
            });

            This.uploadFileListView = new M2012.Disk.View.UploadFileList({
                listSelector: "#fileList tbody",
                iconSelector: "#fileList ul",
                controler: UploadApp,
                model: mainView.uploadModel,
                subModel: This.model,
                scrollSelector: "#fileList"
            });
            This.uploadFileListView.render();

            function getDirInfo(){
                return {
                    directoryId: This.model.get("curDirId"),
                    dirType: This.model.getDirTypeForServer()
                }
            }
        },
		render : function() {
			var self = this;
			
            var model = self.model;
            if(!model.isSetupMailTool() && model.get('isMailToolShow')){
                //$("#maxUploadSize").html(self.model.getMaxUploadSize());
                model.set('isMailToolShow', 0);// 只提示一次
            }
			model.trigger("createPager", null);
		},
		// 渲染工具栏按钮状态
		renderBtns : function(){
			var self = this,
                model = self.model;
			var selectedCount = self.model.get('selectedDirAndFileIds').length;
			var selectedFolders = self.model.get("selectedDirIds");
			var hasSysFolders = false;
			$.each(selectedFolders, function(){
				if(self.model.isRootDir(this)){
					hasSysFolders = true;
					return false;
				}
			});
			//if(selectedFolders.length > 0){ //关闭选择多个文件顶部按钮变化
				//self.model.set('hasFolders', 0);
			//}else{
				//self.model.set('hasFolders', 1);
			//}
			if(hasSysFolders){
				self.model.set('hasSysFolders', 0);
			}else{
				self.model.set('hasSysFolders', 1);
			}
        	if(selectedCount > 1){
				self.model.set('isRenameActivate', 0);
				self.model.set('isShareActivate', 1);
                self.model.set('isSetCoverActivate', 0);
                self.model.set('isPostCardActivate', 0);
			}else{
				self.model.set('isRenameActivate', 1);
				self.model.set('isShareActivate', 1);
                self.model.set('isSetCoverActivate', 1);
                
                if(selectedCount === 1 && self.model.get('selectedDirIds').length === 1){ // 目录不支持明信片
                	self.model.set('isPostCardActivate', 0);
                }else{
                	self.model.set('isPostCardActivate', 1);
                }
			}
			var selectedDirCount = self.model.get('selectedDirIds').length;
			if(selectedDirCount > 1){
				self.model.set('isPlayActivate', 0);
			}else{
				self.model.set('isPlayActivate', 1);
			}

            //是否显示新建文件夹按钮
            var curDirLevel = model.get('curDirLevel'),
                curDirType = model.get('curDirType'),
                userDirLimit = model.dirLevelLimit.USER_DIR,
                sysDirLimit = model.dirLevelLimit.SYS_DIR,
                userDirType = model.dirTypes.USER_DIR,
                albumDirType = model.dirTypes.ALBUM,
                musicDirType = model.dirTypes.MUSIC;

            if((curDirLevel >= userDirLimit && curDirType == userDirType) || (curDirLevel == sysDirLimit && curDirType == albumDirType) || (curDirLevel==sysDirLimit && curDirType == musicDirType)){
                self.model.set('isCreateBtnShow', 1);
            }else{
                self.model.set('isCreateBtnShow', 0);
            }
            var $uplaodTxt = $('#upload label');
            var $floatLoadDiv = $('#floatLoadDiv');
            //toolbar根据是相册or音乐or普通目录所显示的工具栏不同
			/*
			if(curDirType == model.dirTypes.ALBUM){
                $('#createDir span').html('新建相册');
                $uplaodTxt.html('上传照片');
                $('#play').hide();
                if(curDirLevel == sysDirLimit){
                    $('#setCover').show();
                }else{
                    $('#setCover').hide();
                    $('#postcard').show();
                    $floatLoadDiv.find('input[name="uploadInput"]').css('width','160px').end().css('width','160px');
                }
            }else if(curDirType == model.dirTypes.MUSIC){
                $('#createDir span').html('新建专辑');
                $uplaodTxt.html('上传歌曲');
                $('#postcard').hide();
//                $('#play').show();
                $floatLoadDiv.find('input[name="uploadInput"]').css('width','160px').end().css('width','160px');
            }else{
                $('#createDir span').html('新建文件夹');
                $('#postcard,#setCover,#play').hide();
                $uplaodTxt.html('上&nbsp;传');
                $floatLoadDiv.find('input[name="uploadInput"]').css('width','160px').end().css('width','160px');
            }
			*/
            
        },
		upload : function(event) {
			var self = this;
			self.doCommand(self.model.commands.UPLOAD);
		},
        download : function(event) {
			var self = this;
			self.doCommand(self.model.commands.DOWNLOAD);
		},
		play : function(play){
			var self = this;
			if(self.model.get('isPlayActivate')){
				self.doCommand(self.model.commands.PLAY);
			}
		},
        createDir : function(event) {
            var self = this;
            self.model.selectNone();
            self.doCommand(self.model.commands.CREATE_DIR);
            $("#fileList input[type='checkbox']").each(function(){
	            $(this).attr('checked', false);
            })
            BH({key : "diskv2_createfolder"});
            return false;
        },
        share: function (event) {
            var self = this;
			if(!self.model.get('hasSysFolders')){
				//top.M139.UI.TipMessage.show(self.model.tipWords.ONLY_RENAME_ONE, { delay: 3000, className: "msgYellow" }); 
				top.M139.UI.TipMessage.show(self.model.tipWords.NO_FILE, { delay: 3000, className: "msgYellow" }); 
				//self.model.set('hasSysFolders', 1);
	            return false;
			}
            if (self.model.get('isShareActivate')) {
                self.doCommand(self.model.commands.SHARE);
            }else{
				top.M139.UI.TipMessage.show(self.model.tipWords.ONLY_SHARE_ONE, { delay: 3000, className: "msgYellow" }); 
            }
            return false;
        },
		sendToMail : function() {
			var self = this;
			BH("disk3_send");
			self.doCommand(self.model.commands.SEND_TO_MAIL);
		},
		sendToPhone : function() {
			var self = this;
			self.doCommand(self.model.commands.SEND_TO_PHONE);
		},
		remove : function(event) {
			var self = this;
			if(!self.model.get('hasSysFolders')){
				//top.M139.UI.TipMessage.show(self.model.tipWords.ONLY_RENAME_ONE, { delay: 3000, className: "msgYellow" }); 
				top.M139.UI.TipMessage.show(self.model.tipWords.NO_FILE, { delay: 3000, className: "msgYellow" }); 
				//self.model.set('hasSysFolders', 1);
	            return false;
			}
			self.doCommand(self.model.commands.REMOVE);
		},
        setCover : function(event){
            var self = this;
			if(!self.model.get('hasSysFolders')){
				//top.M139.UI.TipMessage.show(self.model.tipWords.ONLY_RENAME_ONE, { delay: 3000, className: "msgYellow" }); 
				top.M139.UI.TipMessage.show(self.model.tipWords.NO_FILE, { delay: 3000, className: "msgYellow" }); 
				//self.model.set('hasSysFolders', 1);
	            return false;
			}
            if(self.model.get('isSetCoverActivate')){
                self.doCommand(self.model.commands.SET_COVER);
            }
        },
        postcard : function(event){
            var self = this;
			if(!self.model.get('hasSysFolders')){
				//top.M139.UI.TipMessage.show(self.model.tipWords.ONLY_RENAME_ONE, { delay: 3000, className: "msgYellow" }); 
				top.M139.UI.TipMessage.show(self.model.tipWords.NO_FILE, { delay: 3000, className: "msgYellow" }); 
				//self.model.set('hasSysFolders', 1);
	            return false;
			}
            if(self.model.get('isPostCardActivate')){
				self.doCommand(self.model.commands.POSTCARD);
			}
        },
		rename : function(event) {
			var self = this;
			BH('caiyunRename');
			if(!self.model.get('hasSysFolders')){
				//top.M139.UI.TipMessage.show(self.model.tipWords.ONLY_RENAME_ONE, { delay: 3000, className: "msgYellow" }); 
				top.M139.UI.TipMessage.show(self.model.tipWords.NO_FILE, { delay: 3000, className: "msgYellow" }); 
				//self.model.set('hasSysFolders', 1);
	            return false;
			}
			if(self.model.get('isRenameActivate')){
				self.doCommand(self.model.commands.RENAME);
			}else{
				top.M139.UI.TipMessage.show(self.model.tipWords.ONLY_RENAME_ONE, { delay: 3000, className: "msgYellow" }); 
			}
            return false;
		},
        deleteDirsAndFiles : function(event) {
			var self = this;
			BH('caiyunDel');
			if(!self.model.get('hasSysFolders')){
				//top.M139.UI.TipMessage.show(self.model.tipWords.ONLY_RENAME_ONE, { delay: 3000, className: "msgYellow" }); 
				top.M139.UI.TipMessage.show(self.model.tipWords.NO_FILE, { delay: 3000, className: "msgYellow" }); 
				//self.model.set('hasSysFolders', 1);
	            return false;
			}
			self.doCommand(self.model.commands.DELETE);
		},
		doCommand : function(command, args) {
            !args && (args = {});
            args.command = command;
            top.$App.trigger("diskCommand", args);
		},
		showSortTable : function(event){
			var jSortMenus = $("#sortMenus");
			jSortMenus.css({width : 125});
			BH('caiyunSort');
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
		showImagesModel : function(event){
			var jSortMenus2 = $("#sortMenus2");
			jSortMenus2.css({width : 125});
			jSortMenus2.show();
			M139.Dom.bindAutoHide({
                action: "click",
                element: jSortMenus2[0],
                stopEvent: true,
                callback: function () {
                    jSortMenus2.hide();
                    M139.Dom.unBindAutoHide({ action: "click", element: jSortMenus2[0]});
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
 * @fileOverview 定义彩云文件列表视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Disk.View.Filelist', superClass.extend(
	/**
	 *@lends M2012.Fileexpress.Cabinet.View.prototype
	 */
	{
		el : "body",
		name : "M2012.Disk.View.Filelist",
        template: [ '<!--[if lt ie 8]>',
				         '<div style=\'+zoom:1;\'><![endif]-->',
				         '<table cellpadding="0" cellspacing="0" class="listHead newShareTable" id="fileList2">',
				             '<tbody>',
				             '<!--item start-->',
				 	    	 '<tr fileid="$id">',
				                 '<td class="wh1 t-check"><input fileid="$id" filetype="@getFileType" type="checkbox"></td>',
				                 '<td>',
									'<div class="fl p_relative">',
										'<a href="javascript:void(0);" class="@getFileIconClass()"></a>',
										'@isShare()',
									'</div>',
				                    '<a hidefocus="true" href="javascript:void(0)" class="attchName" title="@getFullFileName()" style="">',
										'<span name="nameContainer">',
											'<em fileid="$id" fsize="@getFileIntSize()" filetype="@getFileType" name="fname">@getShortName(30)</em>',
											'<input type="text" fname="@getFullName()" exname="@getExtendName()" value="@getFullName()" maxlength="255" size="30" style="display:none;" />',
											'<em fileid="$id" fsize="@getFileIntSize()" filetype="@getFileType" name="fname">@getExtendName()</em>',
										'</span>',
									'</a>',
				                    '<div class="attachment" style="display: none;">@getOperateHtml()</div>',
				                 '</td>',
				                 '<td class="wh5 gray">$createTime</td>',
				                 '<td class="wh6 gray">@getFileSize()</td>',
				             '</tr>',
				             '<!--item end-->',
				           '</tbody>',
				 	 '</table>',
				     '<!--[if lt ie 8]></div><![endif]-->'].join(""),
		templateNoFile: [ '<!--[if lt ie 8]>',
				         '<div style=\'+zoom:1;\'><![endif]-->',
				         '<table cellpadding="0" cellspacing="0" class="listHead">',
				             '<tbody class="dir_no_file">',
				             '<tr><td width="5px" style="border-bottom:none;"></td><td class="" style="border-bottom: 0px;">',
								    '<div class="imgInfo addr-imgInfo ta_c">',
										'<dl>',
											'<dt><img src="../../images/module/networkDisk/fileNo.jpg" /></dt>',
											'<dd><p class="fz_14">暂无文件</p></dd>',
											'<dd><p>请点击左上角“上传”按钮添加</p></dd>',
										'</dl>',
									'</div>',
							 '</td><td width="5px" style="border-bottom:none;"></td></tr>',
				           '</tbody>',
				 	 '</table>',
				     '<!--[if lt ie 8]></div><![endif]-->'].join(""),		     
		events:{
			"click #selectAll" : "allOrNone"
		},
        defaults:{
            startEle : ''
        },
		allOrNone : function(event){
			var self = this;
			var checked = $("#selectAll").attr('checked')?true:false;
        	if(checked){
        		self.model.selectAll();
        	}else{
        		self.model.selectNone();
        	}

            self.model.set('startEle', '');
        	
        	if(self.model.get('listMode')){
        		self.model.trigger('reselectIconFiles');
        	}else{
        		self.reselectFiles();
        	}
        	
        	self.renderSelectCount();
		},
		initialize : function(options) {
			this.model = options.model;
            this.parentView = options.parentView;
			this.initEvents();
			return superClass.prototype.initialize.apply(this, arguments);
		},
		initEvents : function(){
        	var self = this;
        	var sortTypes = self.model.sortTypes;
        	// 绑定表头排序单击事件
        	var sortTypeMap = {
        		fileName : 'FILE_NAME',
        		uploadTime : 'UPLOAD_TIME',
        		fileSize : 'FILE_SIZE'
        	};
        	$("#fileName,#uploadTime,#fileSize").click(function(event){
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
		// 渲染列表
		render : function (){
		    var self = this;
		//    var pageData = self.model.getPageData(self.model.get("pageIndex"));
			var pageData = self.model.get("fileList"); //数据源已变化
		    var html = '';
		    if(pageData.length > 0){
			//	$("#toolBar").show();
				//hideOrShow(true);
		    	self.repeater = new Repeater(self.template);
                self.repeater.dataModel = self.model;
		        self.repeater.Functions = self.model.renderFunctions;
		    	html = self.repeater.DataBind(pageData);
		    }else{
		    	if(!self.model.get('curDirId')){ // 获取根目录下的文件列表前curDirId还未赋值
		    		html = '';
		    	}else{
		    		html = self.templateNoFile;
				//	$("#toolBar").hide();
					//hideOrShow(false);
		    	}
		    }
			function hideOrShow(flag){
				if(flag){
					$("#download").show();
					$("#sendFile").show();
					$("#delete").show();
					//$("#more").show();
				}else{
					$("#download").hide();
					$("#sendFile").hide();
					$("#delete").hide();
					//$("#more").hide();
				}
			}
			/*if(self.model.get("currentShowType")){
				$("#more").hide();
			}else{
				$("#more").show();
			}
*/		 	$("#fileList").html(html);
			//空模板 上传事件
			$("#noFileAndUpload").click(function(){
				$("#uploadFileInput").click();
			});
			self.fixList();
            self.hideOperates();
		 	self.reselectFiles();
		 	self.renderSelectAll(pageData);
		 	self.initClickEvents();
			//网盘拖动
			var diskDrag = M2012.Disk.View.Drag.prototype.createInstance(self,{model : self.model});
			//debugger;
			diskDrag.render();

           /* $("a").click(function(e){
                e.preventDefault();
            })*/
		},

        //根据文件类型 屏蔽操作链接
        hideOperates: function(){
            var self = this;
            // 显示表头列
            $(".diskTableList").find("th:gt(2)").show();
            if (self.model.get("fileList").length == 0) return;//空文件夹则返回
            // 根据文件类型 屏蔽操作链接
            $("#fileList tr").each(function (i) {
                var target = $(this);
                var filetype = target.find('td:eq(0)').find('input').attr('filetype') || self.model.dirTypes['FILE'];
                var fileid = target.find('td:eq(0)').find('input').attr('fileid');
                var jOperates = target.find('div.attachment');
                var isRootDir = self.model.isRootDir(fileid);

//                     if((filetype == self.model.dirTypes['ALBUM'] && self.model.isRootDir(fileid)) || (filetype == self.model.dirTypes['MUSIC'] && self.model.isRootDir(fileid)) ){  //系统目录
                if (isRootDir) {
                    jOperates.find('a[name="download"]').siblings().hide();
                } else if (filetype == self.model.dirTypes['USER_DIR'] || (filetype == self.model.dirTypes['ALBUM'] && !self.model.isRootDir(fileid)) || (filetype == self.model.dirTypes['MUSIC'] && !self.model.isRootDir(fileid))) {  //自定义文件夹
                    var jSend = jOperates.find('a[name="send"]');
                    jSend.hide();
                    jSend.prev('span').hide();
                }

                if (filetype != self.model.dirTypes['FILE']) {    //目录文件不显示大小
                    target.find('td:eq(3)').html('');
                }

//                    if(fileid == self.model.sysDirIds.ALBUM_ID || fileid == self.model.sysDirIds.MUSIC_ID){   //系统文件夹不显示上传时间
                if (isRootDir) {
                    target.find('td:eq(2)').html('');
                }
//                    if(fileid == self.model.sysDirIds.ALBUM_ID || fileid == self.model.sysDirIds.MUSIC_ID){//灰色显示我的相册+我的音乐复选框
                if (isRootDir) {
                //    target.find('td:eq(0)').find('input').attr('disabled', 'disabled');//系统的也可以选中
                }
            });
        },

		// 翻页需要选中上次选中的文件
		reselectFiles : function(){
			var self = this;
			$("#fileList input[type='checkbox']").each(function(i){
				var fid = $(this).attr('fileid');
				if(!self.model.isUploadSuccess(fid)){
					$(this).attr('disabled', true);
				}
				
				var selectedFids = self.model.get('selectedDirAndFileIds');
				if($.inArray(fid, selectedFids) != -1){
					if(self.model.isRootDir(fid)){
						$(this).attr('checked', false);
					}else{
						$(this).attr('checked', true);
					}
				}else{
					$(this).attr('checked', false);
				}
			});
		},
		
		// 渲染全选按钮
		renderSelectAll : function(pageData){
			var self = this;
			var selectedCount = $("#fileList input:checked").size();
			var uploadFailureCount = $("#fileList input:disabled").size(); // 包括系统文件夹数量
			var pageCount = selectedCount+ uploadFailureCount ;
			var isRootDir = 0;
			$.each(pageData,function(i,item){
				if(self.model.isRootDir(item.id)){
					isRootDir++
				}
			})
			if(pageCount == (pageData.length-isRootDir) && selectedCount !== 0){
				$("#selectAll").attr('checked', true);
			}else{
				$("#selectAll").attr('checked', false);
			}
		},
		
		// 列表模式用以下单击事件
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
                    self.selectEvent(target, event);
        		}else if(target.is("a[name='download']")){
        			self.downloadEvent(target);
                    var fid = target.attr('fileid');
                    self.model.downloadLogger(fid);
        		}else if(target.is("a[name='share']")){
        			self.shareEvent(target);
        		}else if(target.is("a[name='send']")){
        			self.sendEvent(target);
        		}else if(target.is("a[name='delete']")){
        			self.deleteEvent(target);
                    var filetype = target.parents('tr').find('.wh1 input').attr('filetype');
                    if(filetype != self.model.dirTypes.FILE){
                        BH({key : "diskv2_deletefolder"});
                    }else{
                        BH({key : "diskv2_deletefile"});
                    }
        		}
        		
        		previewOrOpenFile(target);


				toggleSelect(target);
			});
			// 预览文件 / 打开文件夹
			function previewOrOpenFile(target){
				var name = target.attr('name');
				var filetype = target.attr('filetype');
				var id = target.attr('fileid');
				if(name === 'fname'){
					if(filetype == self.model.dirTypes['FILE'] || !filetype){// 预览文件
						self.previewFile(id, target);
						BH({key : "diskv2_preview"});
					}else{// 打开文件夹
						var dirObj = self.model.getDirById(id);
						var dirLevel = dirObj.directoryLevel;
						self.model.set("curDirType", filetype);
						top.firstEnterNet = false;
						self.model.set('curDirId', id);
						self.model.set("curDirLevel", dirLevel);

                        self.model.set("selectedFids", []);
                        self.model.set("selectedDirIds", []);
                        self.model.set("selectedDirAndFileIds", []);

                        self.model.trigger("changeFileTypeUpload");
        			}
        		}
        	};
        	// 点击复选框以外的某些区域也可以 选中/取消 文件
        	function toggleSelect(target){
        		if(target.is("td") || target.is("a.attchName") || target.is("div.attachment")){
					var JCheckBox = target.parents('tr').find('input[type="checkbox"]');
					if(JCheckBox.is(':disabled')){
						return;
					}
					
                    var fid = JCheckBox.attr('fileid');
                    if(fid == self.model.sysDirIds.ALBUM_ID || fid == self.model.sysDirIds.MUSIC_ID){
                        return ;
                    }else{
                        setTimeout(function(){
                            var isSelected = JCheckBox.attr('checked');
                            JCheckBox.attr('checked', isSelected?false:true);
                            self.selectEvent(JCheckBox);
                        }, 100);
                    }
	        	}
        	};
        },
        // 复选框单击事件
        selectEvent : function(target, event){
        	var self = this;
            var model = self.model;
    		var fid = target.attr('fileid');
            var type = target.attr("filetype");
			var selectedFids = model.get('selectedFids');
            var shareFileId = model.get("shareFileId");
            var isRootDir = self.model.isRootDir(fid);
            var SelectSysDir = self.model.get("SelectSysDir");
            var selectedDirIds = model.get("selectedDirIds");
            var selectedDirAndFileIds = model.get("selectedDirAndFileIds");
            //var startEle = model.get('startEle');

            if(SelectSysDir){
				var dIndex = $.inArray(SelectSysDir, selectedDirIds);
				selectedDirIds.splice(dIndex,1);
				self.model.set('selectedDirAndFileIds', selectedFids.concat(selectedDirIds));
				self.model.set("selectedDirIds",selectedDirIds)
				self.model.set("SelectSysDir",false)
		        selectedDirAndFileIds = model.get("selectedDirAndFileIds");
            }
            if(isRootDir){
	            target.attr("checked",false);
				top.M139.UI.TipMessage.show(self.model.tipWords.SYS_NO_SEL, { delay: 1500, className: "msgYellow" }); 
	            return false;
            }
            // 保存 / 清除 选中文件或者目录的ID
            model.toggle(fid, type == model.dirTypes.FILE ? selectedFids : selectedDirIds);
            model.toggle(fid, selectedDirAndFileIds);
            model.toggle(fid, shareFileId);
            //记录当前选择的目录类型
            if (type !== model.dirTypes.FILE) {
                model.changeDirType(type);
            }
			var isSelected=target.attr("checked");
            if(isSelected){
                target.parents('tr').attr('class', 'trClick');
            }else{
                target.parents('tr').attr('class', '');
            }
			self.renderSelectCount();// 渲染文件数量
        },
        // 渲染用户选中文件数量
        renderSelectCount : function(){
        	var self = this;
        	var selectedCount = self.model.get('selectedDirAndFileIds').length;
            var selectedFids = self.model.get('selectedFids').length;
            var selectedDirIds = self.model.get('selectedDirIds').length;
        //    var curPageData = self.model.getPageData(self.model.get('pageIndex'));
			
			/*$.each(selectedDirIds,function(i,item){
				if(!self.model.isRootDir(item.id)){
					var dIndex = $.inArray(item.id, selectedDirIds);
					selectedDirIds.splice(dIndex,1);
					self.model.set('selectedDirAndFileIds', selectedFids.concat(selectedDirIds));
					self.model.set("selectedDirIds",selectedDirIds)
					self.model.set("SelectSysDir",false)
			        selectedDirAndFileIds = model.get("selectedDirAndFileIds");
				}
			})
*/			var curPageData = self.model.get("fileList"); //数据源已变化
            var curPageCount = curPageData.length;
            //列表渲染选中
			$("#cleanSelected").click(function(){
				self.model.selectNone();
				if(self.model.get('listMode')){
						self.model.trigger('reselectIconFiles');
					}else{
						self.reselectFiles();//渲染未选中
				}
				$("#selectAll").attr("checked",false);
			});
			if(selectedCount > 0){
                if(selectedFids > 0 && selectedDirIds > 0){
                    $("#selectCount b:eq(0)").text(selectedFids);
                    $("#selectCount b:eq(1)").text(selectedDirIds);
                    $("#selectCount span").show();
                }else if(selectedFids > 0){
                    $("#selectCount b:eq(0)").text(selectedFids);
                    $("#selectCount span:eq(0)").show();
                    $("#selectCount span:eq(1)").hide();
                    $("#selectCount span:eq(2)").hide();

                }else if(selectedDirIds > 0){
                    $("#selectCount b:eq(1)").text(selectedDirIds);
                    $("#selectCount span:eq(0)").hide();
                    $("#selectCount span:eq(1)").hide();
                    $("#selectCount span:eq(2)").show();

                }
    			$("#fileName").hide();
    			$("#selectCount").show();
                if(selectedCount == curPageCount || ((selectedCount+2) == curPageCount)){   //+2是加上我的音乐和我的相册两项
    				$("#selectAll").attr('checked', true);
    			}else{
    				$("#selectAll").attr('checked', false);
    			}
			}else{
				$("#selectAll").attr('checked', false);
				
				$("#selectCount").hide();
				$("#fileName").show();
			}
			
			self.model.trigger("renderBtns");// 重新渲染工具栏按钮
			
		//	var pageData = self.model.getPageData(self.model.get("pageIndex"));
			var pageData = self.model.get("fileList"); //数据源已变化
    		self.renderSelectAll(pageData);
        },
    	downloadEvent : function(target){
    		var self = this,
                dataSend = {},
                fid = target.attr('fileid'),
                fileObj = self.model.getFileById(fid);
	        if(fileObj.type != self.model.dirTypes['FILE']){
	        	dataSend.directoryIds = fid;
                dataSend.dirType = fileObj.directory.dirType;
	        }else{
	        	dataSend.fileIds = fid;
                dataSend.dirType = fileObj.type;
	        }
            dataSend.isFriendShare = '0';   //后台做了判断，彩云列表下载此参数都为0
            self.model.trigger("download", dataSend);
    	},
    	sendEvent : function(target){
    		var self = this;
    		var fid = target.attr('fileid');

            self.model.doCommand(self.model.commands.SEND_TO_MAIL, {
                data: {fileIds: [fid]},
                isLineCommand: true
            });
    	},
    	shareEvent : function(target){
    		var self = this;
    		var fid = target.attr('fileid');
    		self.model.set('shareFileId', [fid]);
	        self.model.showShareDialog(self.model.shareTypes['SINGLE']);
    	},
    	deleteEvent : function(target){
    		var self = this,
                dirType = '',
                fid = target.attr('fileid'),
                filename = target.attr('fname'),
                fileObj = self.model.getFileById(fid);
                if(fileObj.directory && fileObj.directory.dirType){
                    dirType =fileObj.directory.dirType;
                }else{
                    dirType =fileObj.type;
                }
                //filename用于用户没有选中而是直接点击删除的，因为没有选中则弹出框提示删除时无法在selectedFids取得删除文件名
                var args = {command : self.model.commands['DELETE'], data : {}, filename:filename};
	        if(dirType != self.model.dirTypes['FILE']){
	        	args.data.directoryIds = fid;
	        }else{
	        	args.data.fileIds = fid;
	        }
	        args.data.dirType = dirType;
	        top.$App.trigger("diskCommand", args);
    	},

        //新建目录
        createDir: function () {
            var self = this,
                model = self.model,
                curDirType = model.get("curDirType"),
                fileListItem = $("#fileList tbody > tr"),
                itemAppend = $(this.templateItem),
                inputTxtEle = itemAppend.find("input[type=text]");
                inputCheckEle = itemAppend.find("input[type=checkbox]");

            if (curDirType == model.dirTypes.ROOT) {//根目录下在"我的音乐"目录后添加目录
                fileListItem.eq(1).after(itemAppend);
            } else {
                fileListItem.eq(0).before(itemAppend);
            }

            var createDirType = model.getDirTypeForServer();
            inputTxtEle.select();
            inputTxtEle.prev().attr("filetype", createDirType);
            inputCheckEle.attr("filetype", createDirType);

            this.createDirEvent(itemAppend);
        },

		// 播放视频（新窗口）
		playVideo : function(fileObj, target){
			//var link;
			var url = "/m2012/html/onlinepreview/video.html?sid=" + top.sid;
			var presentURL = "";
			var fileArea = fileObj.file;
			if(fileArea) {
				presentURL = fileArea.presentURL || fileArea.presentLURL || fileArea.presentHURL || fileObj.presentURL || fileObj.presentLURL || fileObj.presentHURL;
			}
			//if(!presentURL) return ;

			url += "&id=" + fileObj.id;
			url += "&name=" + encodeURIComponent(fileObj.name);
			url += "&curDirType=" + this.model.get("curDirType");
			//url += "&parentDirectoryId=" + fileObj.file.directoryId;

			// >>> start
			var isCheckEnv = /rd139cm/.test(location.host);
			var fakeData = {
				"1.mp4":"http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D985&root=/mnt/wfs9&pt=/527/38&fileid=8P52738f9a863cbbbd6494bdecc754e7ba.mp4&type=5&ui=15817256763&ci=1A11V6cCz1QD005201405161456198z2&cn=1&ct=3&time=1405910796&exp=32545&code=8936DD6FC6E87F0505ADE43C04AE7F80A9A29D2339BAFD0BE719FEF24D841830&ec=0",
				"1.mpg":"http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/eb5/c1&fileid=7meb5c1ad53f42f69058c5ef304433c6e6.wmv&type=51&ui=15817256763&ci=1A11V6cCz1QD31420140721104500usi&cn=1&ct=3&time=1405910796&exp=32545&code=ADF828DB0975DECF5BD0C08DC2A0ECD82422B81A0A9C73D83582E0432C5A5C51&ec=0",
				"苦爱.wmv":"http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/eb5/c1&fileid=7meb5c1ad53f42f69058c5ef304433c6e6.wmv&type=51&ui=15817256763&ci=1A11V6cCz1QD31420140721104500usi&cn=1&ct=3&time=1405910796&exp=32545&code=ADF828DB0975DECF5BD0C08DC2A0ECD82422B81A0A9C73D83582E0432C5A5C51&ec=0",
				"2014.03.28 你不是真正的快乐 邓紫棋.rmvb":"http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/f2d/11&fileid=7Uf2d11caffa544e5226e4e77f8e84c558.rmvb&type=5&ui=15817256763&ci=1A11V6cCz1QD00520140721104539yb9&cn=2014.03.28+%E4%BD%A0%E4%B8%8D%E6%98%AF%E7%9C%9F%E6%AD%A3%E7%9A%84%E5%BF%AB%E4%B9%90+...&ct=3&time=1405910796&exp=32545&code=0DF23563FC201009BDF387EED2F0DE370D1B1637A71F00607DA1867E40FB63CF&ec=0",
				"05.avi":"http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/5e2/bd&fileid=7C5e2bdda00fd13ec09c9008ed853f6b62.avi&type=5&ui=15817256763&ci=1A11V6cCz1QD31420140721104615utg&cn=05&ct=3&time=1405910796&exp=32545&code=9F09777E3E8BD716B516C5EB9BEEA2868445E0E12FC7FEABCB2242FA0A26C70A&ec=0",
				"一位挪威攝影師七天不眠不休之作_让你感动到落泪.mov":"http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/6e5/a0&fileid=7M6e5a0d2608cee6b35ba3b17ab1a72fdf.mp4&type=5&ui=15817256763&ci=1A11V6cCz1QD00520140531091838whx&cn=%E4%B8%80%E4%BD%8D%E6%8C%AA%E5%A8%81%E6%94%9D%E5%BD%B1%E5%B8%AB%E4%B8%83%E5%A4%A9%E4%B8%8D%E7%9C%A0%E4%B8%8D%E4%BC%91%E4%B9%8B%E4%BD%9C_%E8%AE%A9%E4%BD%A0%E6%84%9F%E5%8A%A8...&ct=3&time=1405911006&exp=32545&code=08B88EB43FC720E08F25CF318634478925849C97B67DDA44D2A84998019CA79E&ec=0",
				"1zsgx.mp4":"http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/1dd/6f&fileid=7h1dd6f56891e6ba601f066897d6ac59c9.mp4&type=51&ui=15817256763&ci=1A11V6cCz1QD3142014072119441665y&cn=1zsgx&ct=3&time=1405943091&exp=32545&code=AB76FB9890F643543E57B17AAAFFB92E117484084696FFD7D23B3FF6B8065C80&ec=0",
				"俞敏洪一分钟励志演讲.flv":"http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/e1c/0c&fileid=7Me1c0cc97c615c38ccaba9486c741827f.flv&type=51&ui=15817256763&ci=1A11V6cCz1QD31420140721104601ut8&cn=%E4%BF%9E%E6%95%8F%E6%B4%AA%E4%B8%80%E5%88%86%E9%92%9F%E5%8A%B1%E5%BF%97%E6%BC%94%E8%AE%B2&ct=3&time=1405943281&exp=32545&code=F91591E39702CDE8FC939426EDE3623E3B71A38EDF7C2A687D785EAA9F66CF1A&ec=0"
			};

			if(isCheckEnv && fakeData[fileObj.name]){
				presentURL = fakeData[fileObj.name];
			}
			// <<< end

			url += "&presentURL=" + encodeURIComponent(presentURL);

			/*if(this.model.get("listMode") == 0){
				link = target.closest("tr").find("a");
			} else {
				link = target.closest("li").find("a");
			}*/
			top.addBehavior("disk_video_play");
			console.log("play video");
			//link.attr({"href":url, "target":"_blank"});//[0].click();
			window.open(url, "_blank");
		},

		/**
		* 添加当前目录内歌曲到音乐播放器
		*/
		addToAudioPlayer : function(fileObj){
			var fileList = this.model.get("fileList");
			var playList = [];
			var musicTypes = "|mp3|wav|wma|m4a|ogg|webm|";
			
			var isCheckEnv = /rd139cm/.test(location.host);
			var fakeData = {
				"很有味道\u00A0-\u00A0格格.mp3": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/d31/2e&fileid=7bd312e176d5bc170e8fe62e942807f5b5.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD00520140718151600r8b&cn=%E5%BE%88%E6%9C%89%E5%91%B3%E9%81%93+-+%E6%A0%BC%E6%A0%BC&ct=2&time=1405667788&exp=32539&code=93ECFECF6E076B4660090D8EAD984B5CE43C29DDBAB39A68971698A3B2BDA33E&ec=0",
				"还是要幸福.wma": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/445/0c&fileid=7X4450cb95c1cd2e9f03012f703c20ebbf.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD31420140718151554oj8&cn=%E8%BF%98%E6%98%AF%E8%A6%81%E5%B9%B8%E7%A6%8F&ct=2&time=1405668444&exp=32539&code=2076B6386EA81D82C3368B5F540A18234852AB788E579AA007F44F519B45A616&ec=0",
				"草原的姑娘\u00A0-\u00A0哈琪.wav": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/477/78&fileid=7i477789d40d9fa8e6e114977e048ed069.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD00520140718151533r7u&cn=%E8%8D%89%E5%8E%9F%E7%9A%84%E5%A7%91%E5%A8%98+-+%E5%93%88%E7%90%AA&ct=2&time=1405667788&exp=32539&code=7B595832C1BE4441EF8469363C9C7E1247C2995FE8B13936055E76FE577A170A&ec=0",
				"风吹麦浪\u00A0-\u00A0李健+孙俪.mp3": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/ad4/81&fileid=79ad48139cc6aa80e3eca28a1038660109.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD31420140718151505oid&cn=%E9%A3%8E%E5%90%B9%E9%BA%A6%E6%B5%AA+-+%E6%9D%8E%E5%81%A5%2B%E5%AD%99%E4%BF%AA&ct=2&time=1405667788&exp=32539&code=2D41034E188AFACF7F43B4BB499C4FE595B7AF2942DEECDF8A04F7A8FA323C81&ec=0",
				"一万个舍不得\u00A0-\u00A0庄心妍.mp3": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/100/66&fileid=7Y10066053adb236d10bef757dc9d23a54.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD00520140718151454r7a&cn=%E4%B8%80%E4%B8%87%E4%B8%AA%E8%88%8D%E4%B8%8D%E5%BE%97+-+%E5%BA%84%E5%BF%83%E5%A6%8D&ct=2&time=1405668444&exp=32539&code=183C716E2D340BE1112F413912F3E48A01E26AC2E788476A5566CE404517544E&ec=0",
				"春风沉醉的晚上.mp3": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/dee/17&fileid=70dee17512e4891a613def4a40c5a716db.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD00520140718151441r70&cn=%E6%98%A5%E9%A3%8E%E6%B2%89%E9%86%89%E7%9A%84%E6%99%9A%E4%B8%8A&ct=2&time=1405667788&exp=32539&code=4E4D08F8863792EE6305994D240A77F804BB7821C6FBCF0751794A83EF826812&ec=0",
				"徐千雅\u00A0-\u00A0蓝色海风.mp3": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/344/6b&fileid=7g3446bc5f7124dc7b0bc3bd4e8cecea97.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD31420140718151425ohx&cn=%E5%BE%90%E5%8D%83%E9%9B%85+-+%E8%93%9D%E8%89%B2%E6%B5%B7%E9%A3%8E&ct=2&time=1405667788&exp=32539&code=24905D98656C3BD2C8B9EF9E446232CE745CD04DAECAB8CE366C5ECE6E629E68&ec=0",
				"祁隆、庄心妍\u00A0-\u00A0一万个舍不得.ape": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/8c2/e9&fileid=7I8c2e92452915399a4ee93ee050ae6ed1.ape&type=3&ui=15817256763&ci=1A11V6cCz1QD00520140718151410r6l&cn=%E7%A5%81%E9%9A%86%E3%80%81%E5%BA%84%E5%BF%83%E5%A6%8D+-+%E4%B8%80%E4%B8%87%E4%B8%AA%E8%88%8D%E4%B8%8D%E5%BE%97&ct=2&time=1405667788&exp=32539&code=729BD420D99E57D667406457E56F817107A5E2E8F7EFF9826E21C855CDECA568&ec=0",
				"万树繁花\u00A0-\u00A0格格.mp3": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/004/7c&fileid=7A0047c8fdcb331919b36a5aa6ce4790d2.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD31420140529094608kc5&cn=%E4%B8%87%E6%A0%91%E7%B9%81%E8%8A%B1+-+%E6%A0%BC%E6%A0%BC&ct=2&time=1405667788&exp=32539&code=D8E320590ECC2FEC97A2E0F151FA0E7AF8140406E207EA1E5CB3F0E4033E13EC&ec=0",
				"李欣汝\u00A0-\u00A0欣赏.ogg": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/8a9/22&fileid=7g8a922c0836690d2d75070e8432c1cd7f.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD00520140529094558kmu&cn=%E6%9D%8E%E6%AC%A3%E6%B1%9D+-+%E6%AC%A3%E8%B5%8F&ct=2&time=1405667788&exp=32539&code=70AAA7323D9A11BCD65719578A50D10A3168CD96E5BD5D89B83C5C4120CB8D9E&ec=0",
				"My\u00A0Love.mp3": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/53f/65&fileid=7Q53f6502c2f9794bf8cd65881b75eb147.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD31420140529094542kc1&cn=My+Love&ct=2&time=1405667788&exp=32539&code=ED73B787477A23E10A6AC71CF6897E775CD1730CB9D367D249E5431C4FA3823F&ec=0",
				"越单纯越幸福\u00A0-\u00A0王筝.wma": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D985&root=/mnt/wfs9&pt=/625/da&fileid=8S625dab71b45ad7cd798b099204f614a3.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD00520140523113921fpn&cn=%E8%B6%8A%E5%8D%95%E7%BA%AF%E8%B6%8A%E5%B9%B8%E7%A6%8F+-+%E7%8E%8B%E7%AD%9D&ct=2&time=1405667788&exp=32539&code=1FD97DE45F617E2FA9FC8471C6773BBC7B66ECE5652D53E3457FB48B20713C77&ec=0",
				"他.mp3": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D985&root=/mnt/wfs9&pt=/f2b/a2&fileid=8Of2ba2637867c91003bdcab98079f6327.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD00520140523113756fnd&cn=%E4%BB%96&ct=2&time=1405667788&exp=32539&code=70BF332B84AD3C70E348D3F5565E7FD18CDC29CED8F2C421439F0B5E80DBC830&ec=0",
				"卡通人生.mp3": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D985&root=/mnt/wfs9&pt=/6ba/6d&fileid=8B6ba6d2f68603ba6046efab0f84326cac.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD00520140523114041ftw&cn=%E5%8D%A1%E9%80%9A%E4%BA%BA%E7%94%9F&ct=2&time=1405667788&exp=32539&code=EA1E3DC57A21D904AE222B327CFB98165DC1754B126B59EB714894F45D6F16F8&ec=0",
				"蓝色海风\u00A0-\u00A0徐千雅.ogg": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D985&root=/mnt/wfs9&pt=/911/84&fileid=8R911847ff0bfee5f54bc025c18d128381.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD31420140516183225bw5&cn=%E8%93%9D%E8%89%B2%E6%B5%B7%E9%A3%8E+-+%E5%BE%90%E5%8D%83%E9%9B%85&ct=2&time=1405667788&exp=32539&code=771F577B2D0905FDD4EC4CDAC7E9EA48C230B73B3D690507E61DF3F5BE23CD66&ec=0",
				"1.m4a": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D985&root=/mnt/wfs9&pt=/54d/a9&fileid=8R54da9b72063c54d8306dca915d7c5a79.m4a&type=3&ui=15817256763&ci=1A11V6cCz1QD314201405161456248ze&cn=1&ct=2&time=1405667788&exp=32539&code=78B21E9CA88851544042E1D275339B708E548C8BF337C051A36710AD54ED1BBB&ec=0",
				"彩云之南\u00A0-\u00A0徐千雅.wma": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D985&root=/mnt/wfs9&pt=/747/e7&fileid=8D747e7f34bbb685f0be76673ee46dd5cf.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD005201405161427428ny&cn=%E5%BD%A9%E4%BA%91%E4%B9%8B%E5%8D%97+-+%E5%BE%90%E5%8D%83%E9%9B%85+&ct=2&time=1405667788&exp=32539&code=4B7D537C70599B8DE0D926A7DBF6E0F7E847DEF454A16A494CD7D28E2D279460&ec=0",
				"Stars.mp3": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D985&root=/mnt/wfs9&pt=/7b3/ee&fileid=8E7b3ee58cc6666fea38bb44651714f12b.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD005201405161427388nx&cn=Stars&ct=2&time=1405667788&exp=32539&code=E80EFF7FB5A6915F59204C5C03BC9B6E0A914368198470ABA5275C2427A3DADB&ec=0"
			};
			
			$.each(fileList, function(i, item){
				var ext = $Url.getFileExtName(item.name).toLowerCase();
				if(musicTypes.indexOf("|"+ext+"|") >= 0){
					playList.push({
						id: item.id,
						url: isCheckEnv && fakeData[item.name] || item.file && item.file.presentURL || item.presentURL,
						text: item.name
					});
					/*
					M139.RichMail.API.call("disk:getFile", {fileId: item.id}, function (result) {
						var data = null;
						if(result && (data = result.responseData)){
							top.MusicBox.addMusic(fileObj.id, playList);
						}
					});
					*/
				}
			});

			top.MusicBox.addMusic(fileObj.id, playList);
			top.MusicBox.show();
		},

		// 文件预览
		previewFile : function(fid, target){
			if(!fid){
				return;
			}
			var self = this;
			if(!self.model.isUploadSuccess(fid)){
				console.log('sorry, 上传失败的文件不支持预览！！');
				return;
			}
			
			var fileObj = self.model.getFileById(fid);
			var dirType = fileObj.type;
			var fsize = fileObj.file.fileSize || fileObj.fileSize;
			var fname = fileObj.name;
			var previewType = self.model.getPreviewType(fname);

			if(previewType === self.model.previewTypes['AUDIO']){
				this.addToAudioPlayer(fileObj);
				return ;
			} else if(previewType === self.model.previewTypes['VIDEO']){
				this.playVideo(fileObj, target);
				return ;
			}

			if(!previewType){
				console.log('sorry, 文件类型不支持预览！！');
				return;
			}

			if(!self.model.isOverSize(parseInt(fsize))){
				console.log('sorry, 文件太大不支持预览！！');
				top.$Msg.alert("该文件超出了在线预览支持的文件大小，请下载后查看");
				return;
			}

			var options = {fileIds : fid, dirType : dirType, isFriendShare: 0};
			self.model.download(function(result){
				if(result.responseData.code && result.responseData.code == 'S_OK'){
					var downloadUrl = result.responseData['var'].url;
					if(downloadUrl){
						if(previewType === self.model.previewTypes['DOCUMENT']){
							// 预览文档
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
							self.previewImage(fileObj);
						}
					}
				}else{
					self.logger.error("preDownload returndata error", "[disk:preDownload]", result);
				}
			}, options);
		},
		
		/**
		* 图片单击事件，打开图片预览层
		* 并添加当前目录内的图片到幻灯片列表
		*/
		previewImage : function (fileObj) {

			var fileList = this.model.get("fileList");
			var index = 0;
			var imgList = [];
			var imgTypes = "|jpg|gif|png|ico|jfif|tiff|tif|bmp|jprg|jpe|";
			
			$.each(fileList, function(i, item){
				var ext = $Url.getFileExtName(item.name).toLowerCase();
				if(item.file === fileObj.file){
					index = imgList.length;
				}
				if(imgTypes.indexOf("|"+ext+"|") >= 0){
					// 坑，gif缩略图转换成静态图了，只能用presentURL
					imgList.push({
						thumbnailURL: item.file.thumbnailURL || item.thumbnailURL,
						bigthumbnailURL: item.file.presentURL || item.presentURL,
						presentURL: item.file.presentURL || item.presentURL,
						fileName: item.name
					});
				}
			});

			if (typeof (top.focusImagesView) != "undefined") {
				top.focusImagesView.render({ data: imgList, index : index });
			}else{
				top.M139.registerJS("M2012.OnlinePreview.FocusImages.View", "packs/focusimages.html.pack.js?v=" + Math.random());
				top.M139.requireJS(['M2012.OnlinePreview.FocusImages.View'], function () {
					top.focusImagesView = new top.M2012.OnlinePreview.FocusImages.View();
					top.focusImagesView.render({ data: imgList, index : index});
				});
			}
		},
		// 显示文件大小段落
		showSizeTable : function(target){
			var jIntr = target.find('div.viewIntroduce');
			jIntr.find('p:eq(1)').show();
			jIntr.find('p:eq(2)').hide();
        },
        // 显示操作栏段落
        showOperatesTable : function(target){
        	var jIntr = target.find('div.viewIntroduce');
			jIntr.find('p:eq(1)').hide();
			jIntr.find('p:eq(2)').show();
        },
        // 显示重命名input
        showRenameTable : function(){
        	var self = this;
        	var selectedDirAndFileId = self.model.get('selectedDirAndFileIds')[0];
        	$("#fileList input[type='checkbox']").each(function(i){
        		var fid = $(this).attr('fileid');
        		if(selectedDirAndFileId == fid){
        			var nameContainer = [], parentsName = '';
        			nameContainer = $(this).parents('tr').find('span[name="nameContainer"]');
        			nameContainer.find('em:eq(0)').hide();
        			nameContainer.find('input').show().select();
        			return;
        		}
        	});
        },
		fixList:function(){
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

/**
 * @fileOverview 定义彩云文件缩略图视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Disk.View.Filethumbnail', superClass.extend(
	/**
	 *@lends M2012.Disk.View.prototype
	 */
	{
		el : "#fileList",
		name : "M2012.Disk.View.Filethumbnail",
        template: [ '<ul>',
                '<!--item start-->',
                '<li class="listItem" fileid="$id">',
                    '<p class="chackPbar"><input fileid="$id" name="checkbox" filetype="@getFileType" type="checkbox" class="checkView" style="display:none;"/></p>',
                    '<a hidefocus="true" href="javascript:void(0)" class="@getPicClass()">',
                        '<span class="spanimg"><img src="@getThumbnailUrl()" title="@getFullFileName()" filetype="@getFileType" fileid="$id" fsize="$filesize" name="fname" style="width: 65px; height:65px;" /></span>',
                    '@isShare()</a>',
                    '<div class="viewIntroduce" style="">',
                        '<p title="@getFullFileName()">',
                            '<span class="itemName" name="nameContainer">',
                                '<a fileid="$id" filetype="@getFileType" fsize="$filesize" href="javascript:void(0)" name="fname">@getShortName(15)</a>',
                                '<input type="text" filetype="@getFileType" fname="@getFullName()" exname="@getExtendName()" value="@getFullName()" maxlength="255" size="30" style="display:none; width:100px; overflow: hidden;"></input>',
                            '</span>',
                            '<span fileid="$id" fsize="$filesize" filetype="@getFileType" name="fname" style="cursor:pointer">@getExtendName()</span>',
                        '</p>',
                        '<p class="gray"><span style="display: none;">@getFileSize()</span></p>',
                        '@getOperateHtml()',
                    '</div>',
                '</li>',
                '<!--item end-->',
            '</ul>'].join(""),
        templateNoFileTmp: [
            '<ul class="dir_no_file">',
				'<li class="">',
					'<div class="imgInfo addr-imgInfo">',
						'<i class="imgLink i-addr-smile"></i>',
						'<dl style="text-align: left;">',
							'<dt>暂无文件，您可以</dt>',
							'<dd><a id="noFileAndUpload" href="javascript:">上传文件</a></dd>',
						'</dl>',
					'</div>',
				'</li>',
            '</ul>'].join(""),
		templateNoFile :['<ul class="dir_no_file">',
				'<li class="">',
		'<div class="imgInfo addr-imgInfo ta_c">',
			'<dl>',
				'<dt><img src="../../images/module/networkDisk/fileNo.jpg" /></dt>',
				'<dd>',
					'<p class="fz_14">暂无文件</p>',
				'</dd>',
				'<dd>',
					'<p>请点击左上角“上传”按钮添加</p>',
				'</dd>',
			'</dl>',
		'</div></li></ul>'].join(""),
		hoverTipsTemplate : ['<div class="tips netpictips pl_10" style="width:220px; top: 336px;left: 590px; z-index: 1000;  background:#fff; border:1px solid #cecece;">',
								'<div class="tips-text">',
									'<div class="imgInfo" style="overflow: hidden;">',
										'<p>文件名称：{fileName}</p>',
										'<p>文件大小：{fileSize}</p>',
										'<p>上传时间：{fileTime}</p>',
									'</div>',
								'</div>',
								'<div class="tipsTop diamond"></div>',
							'</div>'].join(""),
		events:{
		},
		initialize : function(options) {
			this.model = options.model;
			return superClass.prototype.initialize.apply(this, arguments);
		},
		initEvents : function(){
            var self = this;
            var $lis = $("#fileList ul > li");
			self.containter = {};
			//	$(".viewPic,.viewPicN").mouseover(function(){return false;}).mouseout(function(){return false;});
			/*
				$lis.hover(function(){
					var fileType = $(this).find("span[fileid]").attr("filetype");
					var fileid = $(this).find("span[fileid]").attr("fileid");
					var fileObject = self.model.getFileById(fileid);
					if(fileType == "file"){
						var offset = $(this).offset();
						self.currentHtml = "";
						if(fileid in self.containter){
							self.currentHtml = self.containter[fileid];
						}else{
							var formatString = $T.Utils.format(self.hoverTipsTemplate,{
								fileName : fileObject.name,
								fileSize : $T.Utils.getFileSizeText(fileObject.file.fileSize),
								fileTime : fileObject.createTime
							});
							self.currentHtml = $(formatString);
							self.currentHtml.appendTo(document.body)
							self.containter[fileid] = self.currentHtml;
						}
					//	setTimeout(function(){
							self.currentHtml.css({top: offset.top + 150, left: offset.left}).show();
					//	}, 50);
					}				
				},function(){
					var fileid = $(this).find("span[fileid]").attr("fileid");
					if(fileid in self.containter){
						self.currentHtml = self.containter[fileid];
					//	setTimeout(function(){
							self.currentHtml.hide();
					//	}, 50);
					}
				});
				*/	
            //初始化文件列表（图标模式）事件
            $lis.live("mouseenter", function(e){
                var target = $(this);
				if($(this).closest("ul").hasClass("dir_no_file")){
					return;
				}
				
                target.addClass("listViewHover");
                target.find(".chackPbar input").show();
				if($(this).attr("rel") == "uploadFile"){
					return;
				}
            //    self.showOperatesTable(target);
			//如果是文件，显示tips
			
					var fileType = target.find("a[fileid]").attr("filetype");
					var fileid = target.find("a[fileid]").attr("fileid");
					var fileObject = self.model.getFileById(fileid);
					if(fileType == "file"){
						var offset = target.offset();
						self.currentHtml = "";
						if(!fileObject){
							fileObject ={
								name : target.find("a[filetype]").text() + target.find("span.itemSuffix").text(),
								file : {
									fileSize : target.find("p.gray").text()
								},
								createTime : ''
							};
							fileid = Math.random().toString(); //刚上传的问题没有fileid，虚拟一个，并保存在dom，以便mouseleave的时候消失
							target.find("a[fileid]").attr("fileid", fileid);
						}
						
						if(fileid in self.containter){
							//self.currentHtml = self.containter[fileid];
							
						}else{
							var formatString = $T.Utils.format(self.hoverTipsTemplate,{
								fileName : fileObject.name,
								fileSize : $T.Utils.getFileSizeText(fileObject.file.fileSize || fileObject.fileSize),
								fileTime : fileObject.createTime
							});
							fileObject.name = target.find("img").attr("title");
							//self.currentHtml = $(formatString);
							//self.currentHtml.appendTo(document.body)
							self.currentHtml = '文件名称：'+fileObject.name+'\n'+'文件大小：'+$T.Utils.getFileSizeText(fileObject.file.fileSize || fileObject.fileSize)+'\n'+'上传时间：'+fileObject.createTime;
							//self.containter[fileid] = self.currentHtml;
							
						}
						target.attr('title',self.currentHtml)
					//	setTimeout(function(){
						//var top1 = offset.top + 117;
						//if(offset.top + 114 + self.currentHtml.height() > $(window).height()){
						//	top1 = top1 - self.currentHtml.height() - 127;
							//self.currentHtml.find(".diamond").addClass("tipsBottom").removeClass("tipsTop");
						//}else{
							//self.currentHtml.find(".diamond").addClass("tipsTop").removeClass("tipsBottom");
						//}
						//self.currentHtml.css({top: top1, left: offset.left}).show();
					//	}, 50);
					}
				
				
            });

            $lis.live("mouseleave", function(e){
                var target = $(this);
                var isSelected=target.find(".chackPbar input").attr("checked");
				var fileid = target.find("a[fileid]").attr("fileid");
					//if(fileid in self.containter){
						//self.currentHtml = self.containter[fileid];
					//	setTimeout(function(){
							//self.currentHtml.hide();
					//	}, 50);
					//}
                if(isSelected){
                    return;
                }else{
                    target.removeClass('listViewHover listViewChecked');
                    target.find("p.chackPbar").find('input').hide();
                    self.showSizeTable(target);
                }
            });
			$(document).mousemove(function(e){
			//	if(!$(e.target).is("li")){
			//		console.log(123);
			//		$(".tips").hide(); //防止拖动时tips无法消失
			//	}
			});
            //去掉缩略图模式表头列  “上传时间”    "大小"
            $(".diskTableList").find("th:gt(2)").hide();
			$("#fileName2").hide();
			$(".diskTableList.onScollTable").hide();
            
            // 图片加载出错
        	$("#fileList img").error(function(event){
        		var defaultImage = self.model.imagePath + 'fail.jpg';
        		this.src = defaultImage;
        	});
        },
        initClickEvents:function(){
            var self = this;
            $("#fileList").unbind("click").click(function(event){//todoe 当前view el来代替 fileList
                var target=$(event.target);
                var name = target.attr('name');
                if(name == 'checkbox'){    //选中
                    self.selectEvent(target);
                }else if(name == 'download'){  //下载
                    self.downloadEvent(target);
                    var fid = target.attr('fileid');
                    self.model.downloadLogger(fid);
                }else if(name == 'share'){   //共享
                    self.shareEvent(target);
                }else if(name == 'send'){ //发送
                    self.sendEvent(target);
                }else if(name == 'delete'){  //删除
                    self.deleteEvent(target);
                    var filetype = target.parents('li').find('.chackPbar input').attr('filetype');
                    if(filetype != self.model.dirTypes.FILE){
                        BH({key : "diskv2_deletefolder"});
                    }else{
                        BH({key : "diskv2_deletefile"});
                    }
                }
                previewOrOpenFile(target);
                toggleSelect(target);
            });
            // 预览文件 / 打开文件夹
            function previewOrOpenFile(target){
            	var name=target.attr("name");
                var filetype=target.attr("filetype");
                var id = target.attr('fileid');
                if(name == "fname"){
                    if(filetype == self.model.dirTypes["FILE"] || !filetype){   //文件预览
                        self.model.trigger("previewFile",id, target);
                        BH({key : "diskv2_preview"});
                    }else{  // 打开文件夹
                        var dirObj = self.model.getDirById(id);
                        var dirLevel = dirObj.directoryLevel;
                        self.model.set("curDirType", filetype);
						top.firstEnterNet = false;
                        self.model.set('curDirId', id);
                        self.model.set("curDirLevel", dirLevel);

                        self.model.set("selectedFids", []);
                        self.model.set("selectedDirIds", []);
                        self.model.set("selectedDirAndFileIds", []);
                    }
                }
            };
            // 点击复选框以外的某些区域也可以 选中/取消 文件
            function toggleSelect(target){
                if(!target.is("p") && !target.is("li")){//
                	return;
                }

                var JCheckBox = getJCheckBox(target);
                if(JCheckBox.is(':disabled')){
					return;
				}
                
                var fid = JCheckBox.attr('fileid');
                var isRootDir = self.model.isRootDir(fid);
                if(fid == self.model.sysDirIds.ALBUM_ID || fid == self.model.sysDirIds.MUSIC_ID || isRootDir){
                    return ;
                }else{
                    setTimeout(function(){
                        var isSelected = JCheckBox.attr('checked');
                        JCheckBox.attr('checked', isSelected?false:true);
                        self.selectEvent(JCheckBox);
                    }, 100);
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
		render : function (){
		    var self = this;
		//    var pageData=self.model.getPageData(self.model.get("pageIndex"));
			var pageData = self.model.get("fileList"); //数据源已变化
            var imageList = self.model.get('imageList');
            var curDirType = self.model.get('curDirType');
            var html="";
            if(pageData.length>0){
			//	$("#toolBar").show();
				//hideOrShow(true);
                self.repeater=new Repeater(self.template);
                self.repeater.dataModel = self.model;
                self.repeater.Functions=self.model.renderFunctions;
                html=self.repeater.DataBind(pageData);
            }else{
                if(!self.model.get('curDirId')){ // 获取根目录下的文件列表前curDirId还未赋值
                    html = '';
					
                }else{
                    html = self.templateNoFile;
				//	$("#toolBar").hide();
					//hideOrShow(false);
                }
            }
			function hideOrShow(flag){
				if(flag){
					$("#download").show();
					$("#sendFile").show();
					$("#delete").show();
					//$("#more").show();
				}else{
					$("#download").hide();
					$("#sendFile").hide();
					$("#delete").hide();
					//$("#more").hide();
				}
			}
			//if(self.model.get("currentShowType")){ //关闭显示更多按钮
			//	$("#more").hide();
			//}else{
			//	$("#more").show();
			//}
            $("#fileList").html(html);
			$(".tips").hide(); //防止拖动时tips无法消失
			
			//空模板 上传事件
		//	$("#noFileAndUpload").click(function(){
		//		$("#uploadFileInput").click();
		//	});
			
            if(imageList.length > 0 || curDirType == self.model.dirTypes.ALBUM){
			//割接的账户不需要
				if(self.model.get("isMcloud") == "0"){
					self.showThumb();   //是图片显示缩略图
				}
            }
            self.hideOperates();    // 根据文件类型 屏蔽操作链接
            
            //self.initRenameEvents();    //重命名事件
            self.reselectFiles();   //翻页记忆选中文件
            self.model.trigger("renderSelectAll", pageData);
            
            self.initEvents();
            self.initClickEvents();
			//网盘拖动
			var diskDrag2 = M2012.Disk.View.Drag.prototype.createInstance(self,{model : self.model});
			//debugger;
			diskDrag2.render();
        },
        
        //图片列表显示缩略图
        showThumb : function(){
            var self=this;
            var isMcloud = this.model.get("isMcloud");
            //是图片显示缩略图
            self.model.getThumbImageList(function(result){
            	if(result.responseData && result.responseData.code == 'S_OK'){
                    var thumbnailList = result.responseData['var'].files;
                    var coverList = result.responseData['var'].covers;
                    self.model.set('thumbnailList', thumbnailList);
                    self.model.set('coverList', coverList);

                    $(".listItem img").each(function(){
                        var $curImg = $(this);
                        var fileid = $curImg.attr("fileid");
                        var filetype = $curImg.attr("filetype");
                        if(filetype == self.model.dirTypes.ALBUM && (fileid != self.model.sysDirIds.ALBUM_ID)){
                            var coverObj = self.model.getCoverById(fileid);
                            $curImg.attr("src", coverObj.coverUrl);
                        }else if(filetype == self.model.dirTypes.FILE){
                            var thumbObj = self.model.getThumbnailById(fileid);
                            if (thumbObj.thumbnailUrl != "") {
                                $curImg.attr("src", thumbObj.thumbnailUrl);

                                if (isMcloud == "1") {//存彩云，修改图片尺寸 todo 用委派
                                    $curImg.bind("load", function(){
                                        $curImg.css({width: "65px", height: "65px"});
                                    });
                                }
                            }
                        }
                    });
    			}else{
                    top.M139.UI.TipMessage.show(self.model.tipWords["THUMBNAIL_ERR"], {delay: 1000});
    				self.logger.error("fileListImg returnData error", "[disk:fileListImg]", result);
    			}
            });
        },
        
        // 根据文件类型 屏蔽操作链接
        hideOperates : function (){
            var self=this;

            if (self.model.get("fileList").length == 0) return;//空文件夹则返回

            $("#fileList li").each(function(i){
                var target=$(this);
                var filetype=target.find("p.chackPbar input").attr("filetype") || self.model.dirTypes['FILE'];
                var fileid = target.find('.chackPbar').find('input').attr('fileid');
                var isRootDir = self.model.isRootDir(fileid);

                if(filetype != self.model.dirTypes['FILE']){    //若是文件夹则不显示文件大小
                    target.find(".gray").html('');
                }

//                if(fileid == self.model.sysDirIds.ALBUM_ID || fileid == self.model.sysDirIds.MUSIC_ID){
                if (isRootDir) {//灰色显示我的相册+我的音乐复选框 系统的也可以选中
                //    target.find('.chackPbar').find('input').attr('disabled','disabled'); 
                }
                var jOperates = target.find('div.viewIntroduce p:eq(2)');

                if(isRootDir){  //系统目录
                    jOperates.find('a[name="download"]').siblings().hide();
                }else if(filetype == self.model.dirTypes['USER_DIR'] || (filetype == self.model.dirTypes['ALBUM'] && !isRootDir) || (filetype == self.model.dirTypes['MUSIC'] && !isRootDir)){  //自定义文件夹
                    var jSend = jOperates.find('a[name="send"]');
                    jSend.hide();
                    jSend.prev('span').hide();
                }
            });
        },
        // 显示操作栏段落
        showOperatesTable : function(target){
            var jIntr = target.find('div.viewIntroduce');
        //    jIntr.find('p:eq(1)').hide();
        //    jIntr.find('p:eq(2)').show();
        },
        // 显示文件大小段落
        showSizeTable : function(target){
            var jIntr = target.find('div.viewIntroduce');
            jIntr.find('p:eq(1)').show();
            jIntr.find('p:eq(2)').hide();
        },
        downloadEvent:function(target){
            var self = this,
                fid = target.attr('fileid');
            var dataSend = {};
            var fileObj = self.model.getFileById(fid);
            if(fileObj.type != self.model.dirTypes['FILE']){
                dataSend.directoryIds = fid;
                dataSend.dirType = fileObj.directory.dirType;
            }else{
                dataSend.fileIds = fid;
                dataSend.dirType = fileObj.type;
            }
            dataSend.isFriendShare = '0';//后台做了判断，彩云列表下载此参数都为0
            self.model.trigger("download", dataSend);
        },
        shareEvent : function(target){
            var self = this;
            var fid = target.attr('fileid');
    		self.model.set('shareFileId', [fid]);
	        self.model.showShareDialog(self.model.shareTypes['SINGLE']);
        },
        sendEvent:function(target){
            var self=this;
            var fid=target.attr("fileid");

            self.model.doCommand(self.model.commands.SEND_TO_MAIL, {
                data: {fileIds: [fid]},
                isLineCommand: true
            });
        },
        deleteEvent:function(target){
            var self = this,
                dirType = '',
                fid = target.attr('fileid'),
                filename = target.attr('fname'),
                fileObj = self.model.getFileById(fid);
                if(fileObj.directory && fileObj.directory.dirFlag){
                    dirType =fileObj.directory.dirFlag;
                }else{
                    dirType =fileObj.type;
                }

                var args = {command : self.model.commands['DELETE'], data : {}, filename:filename};  //filename用于用户没有选中而是直接点击删除的
                if(dirType != self.model.dirTypes['FILE']){
                    args.data.directoryIds = fid;
                }else{
                    args.data.fileIds = fid;
                }
                args.data.dirType = dirType;
                top.$App.trigger("diskCommand", args);
        },
        selectEvent:function(target){
            var self = this;
            var model = self.model;
            var fid = target.attr('fileid');
            var type = target.attr("filetype");
            var selectedFids = model.get('selectedFids');
            var shareFileId = model.get("shareFileId");
            var isRootDir = self.model.isRootDir(fid);
            var SelectSysDir = self.model.get("SelectSysDir");
            var selectedDirIds = model.get("selectedDirIds");
            var selectedDirAndFileIds = model.get("selectedDirAndFileIds");
            //避免系统文件夹选中
            if(SelectSysDir){
				var dIndex = $.inArray(SelectSysDir, selectedDirIds);
				selectedDirIds.splice(dIndex,1);
				self.model.set('selectedDirAndFileIds', selectedFids.concat(selectedDirIds));
				self.model.set("selectedDirIds",selectedDirIds)
				self.model.set("SelectSysDir",false)
		        selectedDirAndFileIds = model.get("selectedDirAndFileIds");
            }
            if(isRootDir){
	            target.attr("checked",false);
				top.M139.UI.TipMessage.show(self.model.tipWords.SYS_NO_SEL, { delay: 1500, className: "msgYellow" }); 
	            return false;
            }
            
            // 保存 / 清除 选中文件的ID
            model.toggle(fid, type == model.dirTypes.FILE ? selectedFids : selectedDirIds);
            model.toggle(fid, selectedDirAndFileIds);
            model.toggle(fid, shareFileId);
            // 渲染文件数量
            self.model.trigger("renderSelectCount");
            //改变li的样式
            var isSelected=target.attr("checked");
            if(isSelected){
                target.parents('li').attr('class', 'listItem listViewHover listViewChecked');
            }else{
                target.parents('li').attr('class', 'listItem listViewHover');
            }

        },
        reselectFiles : function(){
            var self = this;
            $("#fileList input[type='checkbox']").each(function(i){
                var fid = $(this).attr('fileid');
                if(!self.model.isUploadSuccess(fid)){
					$(this).attr('disabled', true);
				}
                
                var selectedFids = self.model.get('selectedDirAndFileIds');
                if($.inArray(fid, selectedFids) != -1 && !self.model.isRootDir(fid)){
                    $(this).attr('checked', true);
                    
                    var target = $(this).parents('li');     //给翻回去的那也之前选中的Li添加样式
                    target.addClass('listViewHover listViewChecked');
                    target.find("p.chackPbar").find('input').show();
                    self.showOperatesTable(target);
                }else{
                	$(this).attr('checked', false);
                	
                	var target = $(this).parents('li');
					target.removeClass('listViewHover listViewChecked');
					target.find("p.chackPbar").find('input').hide();
					self.showSizeTable(target);
                }
            });
        },

        // 隐藏重命名input
        hideRenameTable : function(target, newName){
            newName && target.prev("em").find("a").html(newName);
            target.prev('em').show();
            target.hide();
        },
        //显示重命名input
        showRenameTable : function(){
            var self = this;
            var selectedDirAndFileId = self.model.get('selectedDirAndFileIds')[0];
            $("#fileList input[type='checkbox']").each(function(i){
                var fid = $(this).attr('fileid');
                if(selectedDirAndFileId == fid){
                    var nameContainer = [];
                    nameContainer = $(this).parents('li').find('span[name="nameContainer"]');
                    nameContainer.find('em').hide();
                    nameContainer.find('input').show().select();
                    return;
                }
            });
        }
	}));
})(jQuery, _, M139);

/**
 * @fileOverview 定义彩云文件时间轴视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Disk.View.FileThumbnailImageView', superClass.extend(
	/**
	 *@lends M2012.Disk.View.prototype
	 */
	{
		el : "#diskPicModle",
		name : "M2012.Disk.View.FileThumbnailImageView",
        template: ['<li>',
					'<input fileid="{id}" name="checkbox" filetype="file" style="display:none;" type="checkbox" />',
					'<img src="{images}" filetype="file" fileid="{id}" style="width: 120px; height:120px;" />',
				'</li>'].join(""),
        templateNoFileTmp: [
            '<ul class="dir_no_file">',
				'<li class="">',
					'<div class="imgInfo addr-imgInfo">',
						'<i class="imgLink i-addr-smile"></i>',
						'<dl style="text-align: left;">',
							'<dt>暂无文件，您可以</dt>',
							'<dd><a id="noFileAndUpload" href="javascript:">上传文件</a></dd>',
						'</dl>',
					'</div>',
				'</li>',
            '</ul>'].join(""),
		events:{
		},
		initialize : function(options) {
			this.model = options.model;
			return superClass.prototype.initialize.apply(this, arguments);
		},
		initEvents : function(){
            var self = this;
            var $lis = $("#diskPicModle ul > li");
			$lis.mouseenter(function(){
				$(this).find("input").show();
			}).mouseleave(function(){
				var target = $(this);
				var isSelected=target.find("input").attr("checked");
				if(!isSelected){
					target.find("input").hide();
				}
			});
			
			 // 图片加载出错
        	$("#diskPicModle img").error(function(event){
        		var defaultImage = self.model.imagePath + 'fail.jpg';
        		this.src = defaultImage;
        	});
        },
        initClickEvents:function(){
            var self = this;
            $("#fileList,#diskPicModle").unbind("click").click(function(event){//todoe 当前view el来代替 fileList
                var target=$(event.target);
                var name = target.attr('name');
                if(name == 'checkbox'){    //选中
                    self.selectEvent(target);
                }else if(name == 'download'){  //下载
                    self.downloadEvent(target);
                    var fid = target.attr('fileid');
                    self.model.downloadLogger(fid);
                }else if(name == 'share'){   //共享
                    self.shareEvent(target);
                }else if(name == 'send'){ //发送
                    self.sendEvent(target);
                }else if(name == 'delete'){  //删除
                    self.deleteEvent(target);
                    var filetype = target.parents('li').find('.chackPbar input').attr('filetype');
                    if(filetype != self.model.dirTypes.FILE){
                        BH({key : "diskv2_deletefolder"});
                    }else{
                        BH({key : "diskv2_deletefile"});
                    }
                }
				//如果点了图片，处理复选框
				if(target[0].nodeName.toLowerCase() == "img"){
					var inputCheckbox = target.prev("input[name='checkbox']");
					if(inputCheckbox.attr("checked") != "checked"){
						inputCheckbox.attr("checked","checked");
					}else{
						inputCheckbox.removeAttr("checked");
					}
					self.selectEvent(inputCheckbox);
				}
                previewOrOpenFile(target);
                toggleSelect(target);
            });
            // 预览文件 / 打开文件夹
            function previewOrOpenFile(target){
            	var name=target.attr("name");
                var filetype=target.attr("filetype");
                var id = target.attr('fileid');
                if(name == "fname"){
                    if(filetype == self.model.dirTypes["FILE"] || !filetype){   //文件预览
                        self.model.trigger("previewFile",id);
                        BH({key : "diskv2_preview"});
                    }else{  // 打开文件夹
                        var dirObj = self.model.getDirById(id);
                        var dirLevel = dirObj.directoryLevel;
                        self.model.set("curDirType", filetype);
						top.firstEnterNet = false;
                        self.model.set('curDirId', id);
                        self.model.set("curDirLevel", dirLevel);

                        self.model.set("selectedFids", []);
                        self.model.set("selectedDirIds", []);
                        self.model.set("selectedDirAndFileIds", []);
                    }
                }
            };
            // 点击复选框以外的某些区域也可以 选中/取消 文件
            function toggleSelect(target){
                if(!target.is("p") && !target.is("li")){//
                	return;
                }

                var JCheckBox = getJCheckBox(target);
                if(JCheckBox.is(':disabled')){
					return;
				}
                
                var fid = JCheckBox.attr('fileid');
                if(fid == self.model.sysDirIds.ALBUM_ID || fid == self.model.sysDirIds.MUSIC_ID){
                    return ;
                }else{
                    setTimeout(function(){
                        var isSelected = JCheckBox.attr('checked');
                        JCheckBox.attr('checked', isSelected?false:true);
                        self.selectEvent(JCheckBox);
                    }, 100);
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
		createDateRange: function(){
			this.dateRange = [];
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
		},
		render : function (){
		    var self = this;
		//	debugger;
		//    var pageData=self.model.getPageData(self.model.get("pageIndex"));
			var pageData = self.model.get("fileList"); //数据源已变化
            var imageList = self.model.get('imageList');
            var curDirType = self.model.get('curDirType');
			var fileListOBJ = {};//数据对象，key-value：日期和当前日期对应数据
			var dateArr = [];
			for(var i = 0, len = pageData.length; i < len; i++){
				var pageDataItem = pageData[i];
				var modifyTime = pageDataItem["modifyTime"];
				var serverTime = $Date.parse(modifyTime);
				var today = new Date();
				var year = serverTime.getFullYear();
				var month = serverTime.getMonth() + 1;
				var day = serverTime.getDate();
				var ymd = year+ '-' + month + '-' + day;
				var ym = year+ '-' + month;
				if(today.getFullYear() == year && today.getMonth() + 1 == month && today.getDate() == day){
					if(!fileListOBJ[ymd]){
						fileListOBJ[ymd] = [pageDataItem];
						dateArr.push(ymd);
					}else{
						fileListOBJ[ymd].push(pageDataItem);
					}
				}else{
					if(!fileListOBJ[ym]){
						fileListOBJ[ym] = [pageDataItem];
						dateArr.push(ym);
					}else{
						fileListOBJ[ym].push(pageDataItem);
					}					
				}
				
				
			}
		//	debugger;
            var html= [];
			dateArr.sort().reverse();//日期排序+反转
		//	debugger;
            if(pageData.length>0){
				for(var t = 0,leng = dateArr.length; t < leng; t++){
					var key =  dateArr[t];
					var keyArr = key.split("-");
					var dateZh = "";
					if(keyArr.length == 3){
						dateZh = "今天";
					}else{
						dateZh = keyArr[0] + "年" + keyArr[1] + "月";
					}
					html.push("<h2>"+ dateZh +"</h2>");
					var fileListOBJItems = fileListOBJ[key];
					var lis = [];
					for(var j = 0, length = fileListOBJItems.length; j < length; j++){
						var fileListOBJItem = fileListOBJItems[j];
						lis.push(self.template.replace("{images}",fileListOBJItem.thumbnailURL).replace(/\{id\}/g,fileListOBJItem.id));
					}
					html.push("<ul class='diskPicShow clearfix'>" +lis.join("")+ "</ul>");
				}
			//	debugger;
				var clickToGetMore = ['<div class="diskPicModle2" id="clickToGetMore" style="display:none;">',
										'<a href="javascript:void(0);" id="aclickToGetMore">点击查看更多</a>',
									'</div>'].join("");
				$("#diskPicModle").html(html.join("") + clickToGetMore);
			//	console.log(html.join(""));
				//hideOrShow(true);
				if(self.model.get("totalSize") >= 30){
					$("#clickToGetMore").show();
				}else{
					$("#clickToGetMore").hide();
				}
				
				if(top.secondSSS){
					$("#clickToGetMore").hide();
				}
				$("#aclickToGetMore").click(function(){
					self.model.set('pageSize', 60);
					top.leftbarView.showImages();
					top.secondSSS = true;
					$(this).hide();
					self.model.set('pageSize', 30,{ slient: true});
				});
            //    self.repeater=new Repeater(self.template);
            //    self.repeater.dataModel = self.model;
            //    self.repeater.Functions=self.model.renderFunctions;
            //    html=self.repeater.DataBind(pageData);
            }else{
                if(!self.model.get('curDirId')){ // 获取根目录下的文件列表前curDirId还未赋值
                    html = '';
					
                }else{
                    html = "";
				//	$("#toolBar").hide();
					//hideOrShow(false);
                }
            }
			function hideOrShow(flag){
				if(flag){
					$("#download").show();
					$("#sendFile").show();
					$("#delete").show();
					//$("#more").show();关闭显示更多按钮
				}else{
					$("#download").hide();
					$("#sendFile").hide();
					$("#delete").hide();
					//$("#more").hide();关闭显示更多按钮
				}
			}
			//if(self.model.get("currentShowType")){关闭显示更多按钮
				//$("#more").hide();
			//}else{
				//$("#more").show();
			//}
            //$("#fileList").html(html);
			$(".tips").hide(); //防止拖动时tips无法消失
			
			//空模板 上传事件
		//	$("#noFileAndUpload").click(function(){
		//		$("#uploadFileInput").click();
		//	});
			
            if(imageList.length > 0 || curDirType == self.model.dirTypes.ALBUM){
			//割接的账户不需要
				if(self.model.get("isMcloud") == "0"){
					self.showThumb();   //是图片显示缩略图
				} 
            }
        //    self.hideOperates();    // 根据文件类型 屏蔽操作链接
            
            //self.initRenameEvents();    //重命名事件
            self.reselectFiles();   //翻页记忆选中文件
    //        self.model.trigger("renderSelectAll", pageData);
            
            self.initEvents();
            self.initClickEvents();

        },
        
        //图片列表显示缩略图
        showThumb : function(){
            var self=this;
            var isMcloud = this.model.get("isMcloud");
            //是图片显示缩略图
            self.model.getThumbImageList(function(result){
            	if(result.responseData && result.responseData.code == 'S_OK'){
                    var thumbnailList = result.responseData['var'].files;
                    var coverList = result.responseData['var'].covers;
                    self.model.set('thumbnailList', thumbnailList);
                    self.model.set('coverList', coverList);

                    $(".listItem img").each(function(){
                        var $curImg = $(this);
                        var fileid = $curImg.attr("fileid");
                        var filetype = $curImg.attr("filetype");
                        if(filetype == self.model.dirTypes.ALBUM && (fileid != self.model.sysDirIds.ALBUM_ID)){
                            var coverObj = self.model.getCoverById(fileid);
                            $curImg.attr("src", coverObj.coverUrl);
                        }else if(filetype == self.model.dirTypes.FILE){
                            var thumbObj = self.model.getThumbnailById(fileid);
                            if (thumbObj.thumbnailUrl != "") {
                                $curImg.attr("src", thumbObj.thumbnailUrl);

                                if (isMcloud == "1") {//存彩云，修改图片尺寸 todo 用委派
                                    $curImg.bind("load", function(){
                                        $curImg.css({width: "65px", height: "65px"});
                                    });
                                }
                            }
                        }
                    });
    			}else{
                    top.M139.UI.TipMessage.show(self.model.tipWords["THUMBNAIL_ERR"], {delay: 1000});
    				self.logger.error("fileListImg returnData error", "[disk:fileListImg]", result);
    			}
            });
        },
        
        // 显示操作栏段落
        showOperatesTable : function(target){
            var jIntr = target.find('div.viewIntroduce');
        //    jIntr.find('p:eq(1)').hide();
        //    jIntr.find('p:eq(2)').show();
        },
        // 显示文件大小段落
        showSizeTable : function(target){
            var jIntr = target.find('div.viewIntroduce');
            jIntr.find('p:eq(1)').show();
            jIntr.find('p:eq(2)').hide();
        },
        downloadEvent:function(target){
            var self = this,
                fid = target.attr('fileid');
            var dataSend = {};
            var fileObj = self.model.getFileById(fid);
            if(fileObj.type != self.model.dirTypes['FILE']){
                dataSend.directoryIds = fid;
                dataSend.dirType = fileObj.directory.dirType;
            }else{
                dataSend.fileIds = fid;
                dataSend.dirType = fileObj.type;
            }
            dataSend.isFriendShare = '0';//后台做了判断，彩云列表下载此参数都为0
            self.model.trigger("download", dataSend);
        },
        shareEvent : function(target){
            var self = this;
            var fid = target.attr('fileid');
    		self.model.set('shareFileId', [fid]);
	        self.model.showShareDialog(self.model.shareTypes['SINGLE']);
        },
        sendEvent:function(target){
            var self=this;
            var fid=target.attr("fileid");

            self.model.doCommand(self.model.commands.SEND_TO_MAIL, {
                data: {fileIds: [fid]},
                isLineCommand: true
            });
        },
        deleteEvent:function(target){
            var self = this,
                dirType = '',
                fid = target.attr('fileid'),
                filename = target.attr('fname'),
                fileObj = self.model.getFileById(fid);
                if(fileObj.directory && fileObj.directory.dirFlag){
                    dirType =fileObj.directory.dirFlag;
                }else{
                    dirType =fileObj.type;
                }

                var args = {command : self.model.commands['DELETE'], data : {}, filename:filename};  //filename用于用户没有选中而是直接点击删除的
                if(dirType != self.model.dirTypes['FILE']){
                    args.data.directoryIds = fid;
                }else{
                    args.data.fileIds = fid;
                }
                args.data.dirType = dirType;
                top.$App.trigger("diskCommand", args);
        },
        selectEvent:function(target){
            var self = this;
            var model = self.model;
            var fid = target.attr('fileid');
            var type = target.attr("filetype");
            var selectedFids = model.get('selectedFids');
            var selectedDirIds = model.get("selectedDirIds");
            var selectedDirAndFileIds = model.get("selectedDirAndFileIds");
            var shareFileId = model.get("shareFileId");
            // 保存 / 清除 选中文件的ID
            model.toggle(fid, type == model.dirTypes.FILE ? selectedFids : selectedDirIds);
            model.toggle(fid, selectedDirAndFileIds);
            model.toggle(fid, shareFileId);
            // 渲染文件数量
            self.model.trigger("renderSelectCount");
            //改变li的样式
            var isSelected=target.attr("checked");
            if(isSelected){
                target.parents('li').attr('class', 'listViewHoverAddBorder');
            }else{
                target.parents('li').attr('class', '');
            }

        },
        reselectFiles : function(){
            var self = this;
            $("#diskPicModle input[type='checkbox']").each(function(i){
                var fid = $(this).attr('fileid');
            //    if(!self.model.isUploadSuccess(fid)){
			//		$(this).attr('disabled', true);
			//	}
                
                var selectedFids = self.model.get('selectedDirAndFileIds');
                if($.inArray(fid, selectedFids) != -1){
                    $(this).attr('checked', true);
                    
                    var target = $(this).parents('li');     //给翻回去的那也之前选中的Li添加样式
                    target.addClass('listViewHoverAddBorder');
                    target.find('input').show();
                //    self.showOperatesTable(target);
                }else{
                	$(this).attr('checked', false);
                	var target = $(this).parents('li');
					target.removeClass('listViewHoverAddBorder');
					target.find('input').hide();
				//	self.showSizeTable(target);
                }
            });
        },

        // 隐藏重命名input
        hideRenameTable : function(target, newName){
            newName && target.prev("em").find("a").html(newName);
            target.prev('em').show();
            target.hide();
        },
        //显示重命名input
        showRenameTable : function(){
            var self = this;
            var selectedDirAndFileId = self.model.get('selectedDirAndFileIds')[0];
            $("#fileList input[type='checkbox']").each(function(i){
                var fid = $(this).attr('fileid');
                if(selectedDirAndFileId == fid){
                    var nameContainer = [];
                    nameContainer = $(this).parents('li').find('span[name="nameContainer"]');
                    nameContainer.find('em').hide();
                    nameContainer.find('input').show().select();
                    return;
                }
            });
        }
	}));
})(jQuery, _, M139);

/**
 * @fileOverview 定义彩云文件重命名视图层.
 * @namespace
 * @describe 重命名包括了：列表视图中的重命名和缩略视图的重命名
 */
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Disk.View.Rename', superClass.extend(
        /**
         *@lends M2012.Disk.View.Rename.prototype
         */
        {
            el:"body",
            name:"M2012.Disk.View.Rename",
            initialize:function (options) {
                this.model = options.model;
                return superClass.prototype.initialize.apply(this, arguments);
            },
            defaults : {
                isShowErrorTips : false
            },
            //渲染重命名视图
            render:function () {
                if (!this.model.get("listMode")) {//列表视图
                    this.fileListRenameRender();
                } else {//缩略图视图
                    this.fileThumbnailRenameRender();
                }
                this.bindEvent();

            },
            //列表模式，图标模式共用，响应重命名操作
            bindEvent: function(){
                var self = this;
                var inputTxtEle = $("#fileList input[type='text']:visible");
                inputTxtEle.bind("blur", function(e){
                    setTimeout(function(){
                        if($B.is.firefox && document.activeElement === inputTxtEle[0]){  //为兼容FF点击input时自动触发blur事件
                            return ;
                        }else{
                            if(!self.model.get("isShowErrorTips")){
                                self.renameHandle(inputTxtEle);
                            }
                        }

                    },100)
                });


                //重命名支持回车事件
                inputTxtEle.bind("keydown", enterHandle);
                $B.is.ie && $B.getVersion() == 6 && inputTxtEle.bind("keydown", enterHandle);

                function enterHandle (event) {
                    if (event.keyCode == M139.Event.KEYCODE.ENTER) {
                        var target = $(this);
                            self.renameHandle(target);
                    }
                }
            },
            renameHandle: function (target) {
                var self = this,
                    oldName = $.trim(target.attr('fname')),
                    newName = $.trim(target.val()),
                    listMode=self.model.get("listMode");
                if (oldName === newName) {
                    !listMode?self.hideRenameTable(target):self.hideThumbRename(target);
                    return;
                }
                var errorMsg = self.model.getErrorMsg(newName);

                if (errorMsg) {
                    self.model.set("isShowErrorTips", true);
                    top.$Msg.alert(errorMsg).on("close", function(args){
                        self.model.set("isShowErrorTips", false);
                        M139.Event.stopEvent(args.event);
                        setTimeout(function(){
                            target.focus();
                        }, 100);
                    });
                    return false;
//                    top.$Msg.alert(errorMsg);
//                    !listMode?self.hideRenameTable(target):self.hideThumbRename(target);
                } else {
                    var exName = $.trim(target.attr('exname'));// 拓展名
                    
                    var newFullName = newName + exName;
                    var options = {name: newFullName};

                    self.model.renameDirAndFile(function(result){
                        var responseData = result.responseData;

                        if (responseData && responseData.code == 'S_OK') {
                            top.M139.UI.TipMessage.show(self.model.tipWords.RENAME_SUC, {delay : 1000});
                            !listMode?setListRenameAbout(target):setThumbRenameAbout(target);
                            !listMode?self.hideRenameTable(target, newName):self.hideThumbRename(target, newName);
                        //    self.model.trigger("refresh");
                        } else if (responseData && responseData.code == "JOIN_MCLOUD") {//正在接入彩云
                            self.model.confirmMcloudUpgrade();
                        } else {
                            var tipMsg = responseData && responseData.summary || self.model.tipWords.RENAME_ERR;
                            top.M139.UI.TipMessage.show(tipMsg, {delay : 1000});
                        //    self.model.trigger("refresh", null);
                            self.logger.error("renameFiles returnData error", "[disk:renameFiles]", result);
                        }
                    }, options);

                    function setListRenameAbout(target){
                        var selectedTrEle = target.parents("tr");
                        target.attr("fname", newFullName);
                        selectedTrEle.find("a[name=delete]").attr("fname", newFullName);
                        selectedTrEle.find(".attchName").attr("title", newFullName);
                    };

                    function setThumbRenameAbout(target){
                        var selectedLiEle = target.parents("li");
                        target.attr("fname", newFullName);
                        selectedLiEle.find("a[name=delete]").attr("fname", newFullName);
                        selectedLiEle.find(".viewPic img").attr("title", newFullName);
                    };
                }
            },
            fileListRenameRender:function () {
                var self = this;
                var selectedDirAndFileId = self.model.get('selectedDirAndFileIds')[0];

                $("#fileList input[type='checkbox']").each(function (i) {
                    var fid = $(this).attr('fileid');
                    if (selectedDirAndFileId == fid) {
                        var nameContainer = $(this).parents('tr').find('span[name="nameContainer"]');
                        nameContainer.find('em:eq(0)').hide();
                        //防止不合法重命名后再次重命名input表单显示的是不合法文件名的文本
                        //var oldname = nameContainer.find('em:eq(0)').html();
                        var fileObj = self.model.getFileById(fid); // update by tkh html()方法会对文件名进行编码
                        var oldname = self.model.getFileName(fileObj.name);
                        nameContainer.find('input').attr('value', oldname).show().focus().select();
                        return;
                    }
                });
            },
            fileThumbnailRenameRender:function () {
                var self = this;
                var selectedDirAndFileId = self.model.get('selectedDirAndFileIds')[0];
                $("#fileList input[type='checkbox']").each(function(i){
                    var fid = $(this).attr('fileid');
                    if(selectedDirAndFileId == fid){
                        var nameContainer = $(this).parents("li").find('span[name="nameContainer"]');
                        //防止不合法重命名后再次重命名input表单显示的是不合法文件名的文本
                        //var oldname = nameContainer.find("em").find('a').html();
                        var fileObj = self.model.getFileById(fid); // update by tkh html()方法会对文件名进行编码
                        var oldname = self.model.getFileName(fileObj.name);
                        nameContainer.find("a").hide().next("input").attr('value', oldname).show().select();
                        return;
                    }
                });
            },
            // 隐藏重命名input
            hideRenameTable : function(target, newName){
                var cutedName = this.model.getSelectedDirAndFileOverflowNames(newName);//注意该方法返回的是一个数组
                newName && target.prev("em").html(cutedName[0]);
                target.siblings('em').show();
                target.hide();
            },
            hideThumbRename : function(target, newName){
                var cutedName = this.model.getSelectedDirAndFileOverflowNames(newName);//注意该方法返回的是一个数组
                newName && target.prev("a").html(cutedName[0]);
                target.prev("a").show();
                target.hide();
            }

        }
    ));
})(jQuery, _, M139);

/**
 * @fileOverview 定义彩云文件创建文件夹视图层.
 * @namespace
 * @describe 重命名包括了：列表视图中的创建文件夹和缩略视图的创建文件夹
 */
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Disk.View.CreateDir', superClass.extend(
        /**
         *@lends M2012.Disk.View.CreateDir.prototype
         */
        {
            el: "body",
            name: "M2012.Disk.View.CreateDir",
            initialize: function (options) {
                this.model = options.model;
                return superClass.prototype.initialize.apply(this, arguments);
            },
            templateItem: [
                '<tr>',
                    '<td class="wh1 t-check"><input fileid="" filetype="" type="checkbox"></td>',
                    '<td>',
                        '<p class="attchName" title="新建文件夹" style="cursor:pointer;">',
                            '<i class="i-file-smalIcion i-f-sys"></i>',
                            '<span name="nameContainer">',
                                '<em fileid="" fsize="" filetype="" name="fname" style="display:none;"></em>',
                                '<input type="text" fname="" exname="" value="新建文件夹" maxlength="255" size="30"></input>',
                                '<em fileid="" fsize="" filetype="" name="fname"></em>',
                            '</span>',
                        //    '<a href="javascript:;" class="btnMinOK ml_5" title="确定"></a>',
                        //    '<a href="javascript:;" class="btnMincancel ml_5" title="取消" name="btnMincancel"></a>',
                        '</p>',
                    //    '<div class="attachment" style="display:none;">',
                    //    '<a href="javascript:void(0)" name="download" fileid="">下载</a> <span> | </span> ',
                    //    '<a href="javascript:void(0)" name="share" fileid="">共享</a> <span> | </span> ',
                    //    '<a href="javascript:void(0)" name="delete" fileid="" fname=""> 删除</a>',
                    //    '</div>',
                    '</td>',
                    '<td class="uploadTime wh3 gray"></td>',
                    '<td class="wh6 gray"></td>',
                '</tr>'
            ].join(""),

            templateThumb:[
                '<li class="listItem">',
                    '<p class="chackPbar"><input fileid="" filetype="" type="checkbox" class="checkView" style="display:none;"/></p>',
                    '<a href="javascript:;" class="viewPic"><img filetype=""  fileid="" fsize="" name="fname" title="" src="../../images/module/FileExtract/norSys.png"></a>',
                    '<div class="AddrGroupContainer">',
                        '<input id="AddContacts_GroupName" value="新建文件夹" maxlength="255" size="30" type="text" class="iText mr_5" value="" style="width: 80px;">',
                    //    '<a href="javascript:;" class="btnMinOK mr_5" title="确定"></a>',
                    //    '<a href="javascript:;" class="btnMincancel" title="取消" name="btnMincancel"></a>',
                    '</div>',
                    '<div class="viewIntroduce" style="display:none;">',
                    '<p title="" style="height:24px; line-height: 24px; overflow: hidden;">',
                        '<span class="itemName" name="nameContainer">',
                            '<em><a fileid="" filetype="" fsize="" href="javascript:void(0)" name="fname"></a></em>',
                            '<input type="text" filetype="" filerefid="" fname="" exname="" value="" maxlength="50" size="30" style="display:none;"></input>',
                        '</span>',
                        '<span fileid="" fsize="" filetype="" name="fname" style="cursor:pointer"></span>',
                    '</p>',
                    '<p class="gray">0KB</p>',
                //    '<p style="display:none;">',
                //        '<a href="javascript:void(0)" name="download">下载</a><span class="line">|</span>',
                //        '<a href="javascript:void(0)" name="share" fileid="">共享</a><span class="line"> | </span>',
                //        '<a href="javascript:void(0)" name="send" fileid="">发送</a><span class="line"> | </span>',
                //        '<a href="javascript:void(0)" name="delete" fname="">删除</a>',
                //    '</p>',
                    '</div>',
                '</li>'
            ].join(""),
            defaults : {
                isShowErrorTips : false
            },

            //渲染重命名视图
            render : function () {
                if (!this.model.get("listMode")) {//列表视图
                    this.fileListCreateDirRender();
                } else {//缩略图视图
                    this.fileThumbnailCreateDirRender();
                }
            },

            //列表视图创建新文件夹
            fileListCreateDirRender: function(){
                var self = this,
                    model = self.model,
                    curPageIndex = model.get('pageIndex'),
                    curDirType = model.get("curDirType"),
                    fileItemPar = $("#fileList tbody"),
                    fileListItem =  fileItemPar.find('tr'),
                    isNoFile = self.isNoFile(fileItemPar),
                    itemAppend = $(this.templateItem),
                    inputTxtEle = itemAppend.find("input[type=text]");
                    isNoFile && fileListItem.remove();

                if (curDirType == model.dirTypes.ROOT && curPageIndex==1) {//根目录下在"我的音乐"目录后添加目录
                    var sysDirListNum = model.get("sysDirList").length;
                //    fileListItem.eq(sysDirListNum - 1).after(itemAppend);
					fileListItem.eq(1).after(itemAppend);
                } else {
                    isNoFile?fileItemPar.append(itemAppend):fileListItem.eq(0).before(itemAppend);
                }
                inputTxtEle.select();
                this.bindCreateDirEvent(itemAppend);
            },

            //缩略视图创建新文件夹
            fileThumbnailCreateDirRender: function(){
                var self = this,
                    model = self.model,
                    curPageIndex = model.get('pageIndex'),
                    listMode = model.get("listMode"),
                    curDirType = model.get("curDirType"),
                    fileItemPar = $("#fileList ul"),
                    fileThumbItem = fileItemPar.find('li'),
                    itemAppend = $(this.templateThumb),
                    folderIcon = itemAppend.find("img"),
                    inputTxtEle = itemAppend.find("input[type=text]"),
                    isNoFile = self.isNoFile(fileItemPar),
                    imagePath= model.getIconByType(curDirType);
                    isNoFile && fileThumbItem.remove();

                    if (curDirType == model.dirTypes.ROOT && curPageIndex==1) {//根目录下在"我的音乐"目录后添加目录
                        fileThumbItem.eq(1).after(itemAppend);
                    }else{
                        folderIcon.attr("src", imagePath);
                        isNoFile?fileItemPar.append(itemAppend):fileThumbItem.eq(0).before(itemAppend);
                    }
                    inputTxtEle.select();
                    this.bindCreateDirEvent(itemAppend);
            },

            bindCreateDirEvent: function (elemAdd) {
                var self = this;
                var inputTxtEle = elemAdd.find("input[type=text]:visible");
                /*var fn;
                fn = window.$GlobalEvent.on("click", function(args){
                    var target = $(args.event.target);
                    if(target.hasClass('btnMincancel')){
                        elemAdd.remove();
                        window.$GlobalEvent.off("click", fn);
                        return false;
                    } else if (inputTxtEle[0] === target[0]) {
                        return;
                    } else if(!self.model.get("isShowErrorTips")) {
                        if(self.createDirHandle(elemAdd)){
                            self.model.get('listMode') && self.createDirMouseHover(elemAdd);
                            window.$GlobalEvent.off("click", fn);
                            return false;
                        }

                    }
                });*/

                inputTxtEle.bind("blur", function(e){
                    setTimeout(function(){
                        if (elemAdd) {
							var newDirName = $.trim(elemAdd.find("input[type=text]").val());
							//失焦点取消
							if(newDirName == ""){
								elemAdd.remove();
								elemAdd = null;
							}
                            self.createDirHandle(elemAdd);
                            self.createDirMouseHover(elemAdd);
                        }
                    }, 500);
                });

                //新建文件夹命名支持回车事件
                inputTxtEle.bind('keydown', enterHandle);
                $B.is.ie && $B.getVersion() == 6 && inputTxtEle.bind('keypress', enterHandle);

                function enterHandle (event) {
                    if(event.keyCode == M139.Event.KEYCODE.ENTER){
						var newDirName = $.trim(elemAdd.find("input[type=text]").val());
						//回车闪烁
						if(newDirName == ""){
							M139.Dom.flashElement(inputTxtEle);
							return;
						}
                        self.createDirHandle(elemAdd);
                        self.createDirMouseHover(elemAdd);
                        $(this).unbind("blur");
                    }
                }

                elemAdd.find(".btnMincancel").click(function(){
                    elemAdd.remove();
                    elemAdd = null;
                })
            },

            createDirHandle: function (elemAdd) {
                var self = this,
                    model = self.model,
                    listMode = model.get("listMode"),
                    inputTxtEle = elemAdd.find("input[type=text]"),
                    inputCheckEle = elemAdd.find("input[type=checkbox]"),
                    newDirName = $.trim(inputTxtEle.val()),
                    errorMsg = model.getErrorMsg(newDirName);
                if (errorMsg) {
                    model.set("isShowErrorTips", true);
                    top.$Msg.alert(errorMsg).on("close", function(args){
                        model.set("isShowErrorTips", false);
                        M139.Event.stopEvent(args.event);
                        setTimeout(function(){//解决ie中会失去焦点，导致重复提示
                            inputTxtEle.focus();
                        }, 100);
                    });
                    return false;
                }

                var options = {name: newDirName};

                self.model.createDir(function (result) {
                    var responseData = result.responseData;
                    var error = responseData.summary;
                    if (responseData && responseData.code == "S_OK") {
                        var data = responseData["var"],
                            directoryId = data.directoryId,
                            createDirType = model.getDirTypeForServer(),
                            listMode = model.get('listMode'),
                            fileList = model.get("fileList");
                            model.trigger("refresh");
                        !listMode?setListCreateDir():setThumbCreatDir();
                        top.M139.UI.TipMessage.show(self.model.tipWords.CREATE_DIR_SUC, {delay: 1000});
                    } else if (responseData && responseData.code == "JOIN_MCLOUD") {//正在接入彩云
                        self.model.confirmMcloudUpgrade();
                    } else {
                        self.logger.error("createDir returnData error", "[disk:createDirectory]", result);
                        self.model.trigger("refresh", null);//新建目录失败需要刷新列表
                        top.M139.UI.TipMessage.show(error, {delay: 1000});
                    }

                    //处理刷新完界面后显示当前模式的图标总是刷新为了列表模式
                    function setListCreateDir(){
                        inputTxtEle.prev().attr({"filetype": createDirType, "fileid":directoryId});
                        inputCheckEle.attr({"filetype":createDirType, "fileid":directoryId});
                        var nameContainer = elemAdd.find(".nameContainer");
                        nameContainer.find("em").attr("filetype", createDirType);
                        var attachEle = elemAdd.find(".attachment");
                        elemAdd.find(".uploadTime").html(data.createTime);
                        attachEle.find("a").attr("fileid", directoryId);
                        attachEle.find("a[name=delete]").attr("fname", newDirName);
                        elemAdd.find(".attchName").attr("title", newDirName);
                        self.hideRenameTable(inputTxtEle, newDirName);
                        self.styleOperateBtn(elemAdd);
                    };

                    function setThumbCreatDir(){
                        inputTxtEle.attr("fileid", directoryId);
                        inputCheckEle.attr({"fileid":directoryId, "filetype":createDirType});
                        var viewIntroduce = elemAdd.find(".viewIntroduce");
                        var titleP = viewIntroduce.find("p:eq(0)");
                        var thumbImg = elemAdd.find(".viewPic img");
                        titleP.attr("title", newDirName);
                        titleP.find("a").attr({"fileid":directoryId, "filetype":createDirType}).html(newDirName);   //文件名称
                        titleP.find("input").attr({"fileid":directoryId, "filetype":createDirType, "value": newDirName}); //重命名输入框
                        titleP.find("span:eq(1)").attr({"fileid":directoryId, "filetype":createDirType}); //文件扩展名
                        thumbImg.attr({"title": newDirName, "fileid":directoryId, "filetype":createDirType});
                        viewIntroduce.find("p:eq(1)").html("");     //文件夹无需显示大小
                        var operationP = viewIntroduce.find("p:eq(2)");
                        operationP.find("a").attr("fileid", directoryId);
                        operationP.find("a[name=delete]").attr("fname", newDirName);
                        elemAdd.find(".AddrGroupContainer").remove();   //移出新建文件夹标签
                        viewIntroduce.show();
                    };
                }, options);
                return true;
            },

            //隐藏重命名input
            hideRenameTable : function(target, newName){
                newName && target.prev("em").html(newName);
                target.siblings('em').show();
                target.hide();
            },

            //隐藏新建文件夹确认和取消按钮
            styleOperateBtn: function (target) {
                target.find(".btnMinOK").hide();
                target.find(".btnMincancel").hide();
                target.find(".attachment").show();
            },
            //新创建文件夹添加鼠标移入移出事件
            createDirMouseHover : function(elemAdd){
                var self = this;
                elemAdd .hover(function(){
                var target=$(this);
                target.addClass("listViewHover");
                target.find(".chackPbar input").show();
                self.showOperatesTable(target);
            },function(){
                var target=$(this);
                var isSelected=target.find(".chackPbar input").attr("checked");
                if(isSelected){
                    return;
                }else{
                    target.removeClass('listViewHover listViewChecked');
                    target.find("p.chackPbar").find('input').hide();
                    self.showSizeTable(target);
                }

                });
            },
            // 显示操作栏段落
            showOperatesTable : function(target){
                var jIntr = target.find('div.viewIntroduce');
                jIntr.find('p:eq(1)').hide();
                jIntr.find('p:eq(2)').show().find("a:eq(2)").hide().prev("span").hide();    //隐藏"发送"操作
            },
            // 显示文件大小段落
            showSizeTable : function(target){
                var jIntr = target.find('div.viewIntroduce');
                jIntr.find('p:eq(1)').show();
                jIntr.find('p:eq(2)').hide();
            },
            //判断该目录下是否有子目录或文件，根据判断结果来决定是否移出“暂无文件”item
            isNoFile : function (fileItemPar){
                var isNoFile = false;
                if(fileItemPar.hasClass("dir_no_file") || fileItemPar.children().length == 0){
                    isNoFile = true;
                    fileItemPar.removeClass('dir_no_file');
                    return isNoFile;
                }
                return isNoFile;
                }
            }
    ));
})(jQuery, _, M139);

﻿/**
 * @fileOverview 定义彩云文件列表视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Disk.View.Music', superClass.extend(
	/**
	 *@lends M2012.Disk.View.Music.prototype
	 */
	{
		el : "body",
		name : "M2012.Disk.View.Music",
		logger : new top.M139.Logger({
			name : "M2012.Disk.View.Music"
		}),
		events : {
		},
		initialize : function(options) {
			this.model = options.model;
			this.initEvents();
			return superClass.prototype.initialize.apply(this, arguments);
		},
		initEvents : function(){
        	var self = this;
        },
        render : function(){
        	var self = this;
        	self.loadPlayer(true, function(){
        		self.addRootMusic();
        	});
            BH({key : "diskv2_musicplayer"});
        },
        
        // 加载播放器
	    loadPlayer: function(isRefresh, loadpageCallback) {
	    	var self = this;
	        if (isRefresh) {
	            //DiskTool.tabFixPlayer(false);
	            top.$("#playerframe").parent().remove();
	        }
	        if (top.$("#playerframe").length == 0) {
	            top.MusicPlayerLoadpageCallback = loadpageCallback;
	            top.$("<div style='position:absolute;z-index:999;top:24px;right:7px;'><iframe id='playerframe' src='"
	                + "/m2012/html/disk/disk_musicplayer.html' style='width:212px;height:21px;' scrolling='no' frameborder='0'></iframe></div>")
	            .appendTo(top.document.body);
	            //DiskTool.tabFixPlayer(true);
	            self.fixPlayer();
	        }
	    },
	    
	    // 调整播放器的样式
	    fixPlayer : function(){
	    	top.$("#playerframe").parent('div').css({top : '15px', right : '273px'}).hide();
	    },
	    
	    /**
	    * 添加音乐到播放器
	    * list [{FileId:xx,Name:yy}]
	    */
	    appendMusic : function(list, isPlay) {
	    	var self = this;
	    	
	        if (window.top.MusicPlayer) {
	            window.top.MusicPlayer.appendSongList(list, isPlay);
	        } else {
	            self.loadPlayer(true, function() {
	                if (window.top.MusicPlayer) {
	                    window.top.MusicPlayer.appendSongList(list, isPlay);
	                }
	            });
	        }
	    },
	    
	    //获取所有的歌曲信息
        play : function() {
        	var self = this;
            if (!$.browser.msie) {
                top.$Msg.alert(self.model.tipWords.NO_Play);
            }

            function getMusics(fids){
            	var musics = [];
            	for(var i = 0,len = fids.length;i < len;i++){
            		var fileObj = self.model.getFileById(fids[i]);
            		musics.push({FileId: fileObj['id'], Name: fileObj['name']});
            	}
            	return musics;
            }
            
            var allMusic = [];
            var selectedDirIds = self.model.get('selectedDirIds');
            var selectedFids = self.model.get('selectedFids');
            if(selectedDirIds.length > 0){
            	self.model.getDirFiles(function(result){
            		var responseData = result.responseData;
            		// todo
            		if(responseData && responseData.code == 'S_OK'){
                        var files = result.responseData["var"]['files'];
                        for(var i = 0,len = files.length;i < len;i++){
                        	allMusic.push({FileId: files[i]['id'], Name: files[i]['name']});
                        }
	    			}else{
                        self.logger.error("download returnData error", "[disk:fileList]", result);
                    }
            		if(selectedFids.length > 0){
            			allMusic = allMusic.concat(getMusics(selectedFids));
            		}
            		self.appendMusic(allMusic);
            	}, {dirid : selectedDirIds[0], dirType : self.model.dirTypes['MUSIC']});
            }else{
            	allMusic = getMusics(selectedFids);
            	self.appendMusic(allMusic);
            }
        },
        
        // 添加我的音乐根目录下的音乐文件
        addRootMusic : function(){
        	var self = this;
        	self.model.getDirFiles(function(result){
        		var responseData = result.responseData;
        		if(responseData && responseData.code == 'S_OK'){
                    var files = result.responseData["var"]['files'];
                    var allMusic = [];
                    for(var i = 0,len = files.length;i < len;i++){
                    	var fileObj = files[i];
                    	if(fileObj['type'] === self.model.dirTypes['FILE']){
                    		allMusic.push({FileId: fileObj['id'], Name: fileObj['name']});
                    	}
                    }
                    self.appendMusic(allMusic, 'noPlay');
    			}else{
                    self.logger.error("download returnData error", "[disk:fileList]", result);
                }
        	}, {dirid : 30, dirType : self.model.dirTypes['MUSIC']});
        }
	}));
})(jQuery, _, M139);

/**
* @fileOverview 彩云主视图层.
*@namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Disk.View.Main', superClass.extend(
        /**
        *@lends M2012.Disk.View.prototype
        */
    {
        el: "body",
        name : "M2012.Disk.View.Main",
        logger: new top.M139.Logger({name: "M2012.Disk.View.Main"}),
		first : true,
        events: {
        },
        initialize: function (options) {
        	this.model = options.model;
            this.initParams();
			setTimeout(function(){
				$("#outArticle").height($(top.document.body).height() - 47 - 29 - 8).css("over-flow","hidden");; //减去多余4像素
			},0);
			window.onresize = function(){
				$("#outArticle").height($(top.document.body).height() - 47 - 29 - 8);
			}
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initEvents : function(){
        	var self = this;

            /*window.onbeforeunload = function(e){
                var p=$("object").parent().parent();
                var node=$("object").parent();
                $("object").parent().remove();
                setTimeout(function(){
                    p.append(node);
                    insertFlashCode();
//                    self.toolbarView.createBtnUpload();
                },500);
                //document.body.innerHTML="";

                *//*var isRemoveFlash = self.model.get("isRemoveFlash");

                if (isRemoveFlash) { // 页面卸载或跳转前先移除掉flash，防止ie8报错
                    $("object").parent().remove();
                    document.body.innerHTML="<div></div>";
                } else { // 下载时触发是不需要移除flash的
                    self.model.set("isRemoveFlash", true);
                }*//*
            };*/

        	// 监听model层数据变化
			self.model.on("change:pageSize", function(){
				self.model.trigger("renderFileList");
			});
			self.model.on("change:pageIndex", function(){// 翻页
				if(self.model.get("currentShowType")){
					self.leftbarView.showDifferentDoc();
					return;
				}
				var curDirid = self.model.get('curDirId');
				var curDirtype = self.model.get('curDirType');
				var options = {dirid : curDirid, dirType : curDirtype};
				self.getFiles(function(){
							self.model.trigger('createPager');
							self.model.trigger("renderFileList");
				}, options);
		    });
		    self.model.on("change:listMode", function(){// 视图切换
		    	self.model.trigger("renderFileList");
		    });
			self.model.on("change:isImagesMode",function(){
				var isImagesMode = self.model.get("isImagesMode");
				if(isImagesMode){
					$("#listModeContainer").hide();
					$("#isimagesModel").show();
				}else{
					$("#listModeContainer").show();
					$("#isimagesModel").hide();
				}
				
			});
			//pageCount变化，说明切换了目录，分页要变化
			self.model.on("change:PageCount", function(){
				self.model.trigger("createPager");
			});
		    self.model.on("change:searchStatus", function(){// 搜索状态
		    	self.model.set('pageIndex', 1);
				self.model.trigger("createPager");
		    	
				self.model.trigger("renderFileList");
		    });

		    self.model.on("change:curDirId", function(){// 打开目录
				if(!top.firstEnterNet){
					self.model.trigger('openDir', self.model.get('curDirId'));
				}else{
					var curDirType = self.model.get('curDirType');
					self.statusView.renderNavigation(self.model.get('curDirId'));
					self.model.trigger('renderBtns');


					self.model.resetProperties();
					self.model.trigger('renderSelectCount');
					var curDirid = self.model.get('curDirId');
					var curDirtype = self.model.get('curDirType');
					var options = {dirid : curDirid, dirType : curDirtype};
					if(!top.firstEnterNet){
						self.getFiles(function(){
							self.model.trigger('createPager');
							self.model.trigger("renderFileList");
						}, options);
					}else{
							self.model.trigger('createPager');
							self.model.trigger("renderFileList");
					}
					
				}
		    });

            self.model.on("change:curDirLevel", function(){
                self.toolbarView.renderBtns();
            });
		    self.model.on("change:selectedDirAndFileIds", function(){//选择的文件及目录个数显示
                self.fileListView.renderSelectCount();
            });
		    // 绑定事件供其他view调用
		    self.model.on("createPager", function () {// 重新创建分页组件
	            self.toolbarView && self.toolbarView.createPager();
	        });
	        self.model.on("deleteDirsAndFiles", function (dataSend) {// 删除文件
	    		self.model.deleteDirsAndFiles(function(result, dataSend){
	    			if(result.responseData && result.responseData.code == 'S_OK'){

	    				top.M139.UI.TipMessage.show(self.model.tipWords['DELETE_SUC'], {delay : 1000});

                        var dirIds = dataSend.directoryIds;
                        var fileIds = dataSend.fileIds;

                        dirIds && (dirIds.length > 0) && delFileDataByIds(dirIds.split(","));
                        fileIds && (fileIds.length > 0) && delFileDataByIds(fileIds.split(","));
                
                        self.getDiskInit(function () {
                            self.statusView.render();
                            self.statusView.renderNavigation(self.model.get('curDirId'));
                            self.statusView.initEvents();
                            self.toolbarView.render();
                            //                            self.model.trigger('openDir', self.model.get('curDirId'));
                            self.model.trigger('switchModeStyle');
                            self.model.set("pageIndex", 1); //防止删除一整页文件后页面空白
                            self.model.trigger("createPager");
                        }, { notips: true });

	    			} else if (result.responseData && result.responseData.code == "JOIN_MCLOUD") {//正在接入彩云
                        self.model.confirmMcloudUpgrade();
                    } else {
	    				top.M139.UI.TipMessage.show(self.model.tipWords['DELETE_ERR'], {delay : 1000});
	    				self.logger.error("delete returnData error", "[disk:delDiskDirsAndFiles]", result);
	    			}
	    		}, dataSend);

                function delFileDataByIds (ids) {
                    self.model.delFileById(ids);
                    delDomByIds(ids);
                }

                function delDomByIds (ids) {
                    var container = $("#fileList");
                    var listMode = self.model.get("listMode");
					var fileEles = null;
					if(listMode == 0){
						fileEles = container.find("tr"); 
					}else if(listMode == 1){
						fileEles = container.find("li");
					}else if(listMode == 2){
						fileEles = $("#diskPicModle").find("li");
					}
                //    var fileEles = self.model.get("listMode") == 0 ? container.find("tr") : container.find("li");

                    for (var i = 0, len = ids.length; i < len; i++) {
                        var id = ids[i];

                        for (var j = 0, l = fileEles.length; j < l; j++) {
                            var item = fileEles.eq(j);
                            if (item.find("input").eq(0).attr("fileid") == id) {
                                item.remove();
                                break;
                            }
                        }
                        //刷新用户选中文件数量
                        var selectedDirAndFileIds = self.model.get('selectedDirAndFileIds');
                        var selectedDirIds = self.model.get('selectedDirIds');
                        var selectedFids = self.model.get('selectedFids');
                        var allSelectedIndex = $.inArray(id, selectedDirAndFileIds);
                        var dirSelectedIndex = $.inArray(id, selectedDirIds);
                        var fileSelectedIndex = $.inArray(id, selectedFids);
                        if(allSelectedIndex != -1){
                            if(dirSelectedIndex != -1){
                            selectedDirIds.splice(dirSelectedIndex, 1);
                            }else if(fileSelectedIndex != -1){
                                selectedFids.splice(fileSelectedIndex, 1);
                            }
                            selectedDirAndFileIds.splice(allSelectedIndex, 1);
                            self.model.trigger("renderSelectCount");
                        }
                    }
                }
	        });

            self.model.on('setCover',function(dataSend){
                self.model.setCover(function(result){
                    var responseData = result.responseData;
                    if(responseData && responseData.code == 'S_OK'){
                        top.M139.UI.TipMessage.show(self.model.tipWords['SETCOVER_SUC'], {delay : 1000});
                    }else{
                        top.M139.UI.TipMessage.show(self.model.tipWords['SETCOVER_ERR'], {delay : 1000});
                        self.logger.error("setCover returnData error", "[disk:setCover]", result);
                    }
                }, dataSend)
            });
	        self.model.on("download", function (dataSend) {// 下载文件
	    		self.model.download(function(result){
                    var responseData = result.responseData;
                    var error = result.responseData.summary;
                    if(responseData && responseData.code == 'S_OK'){
                        var data = result.responseData["var"];
                        $("#downloadFrame").attr('src', data.url);
	    			}else{
                        downloadErr();
                    }

                    function downloadErr(){
                        top.M139.UI.TipMessage.show(error, {delay: 1000});
                        self.logger.error("download returnData error", "[disk:download]", result);
                    }
	    		}, dataSend);
	        });
	        
            self.model.on("createDir", function (dataSend) {//新建文件夹
                self.createDirView.render();
            });
            self.model.on("share", function(){
                self.model.showShareDialog();
            });
	        self.model.on("renameDirAndFile", function () {// 文件重命名
                self.renameView.render();
	        });
	        self.model.on("renderFileList", function () {// 渲染文件列表
				self.render = true;
				//当不是搜索图片模式，但是当前为时间轴视图时
				if(self.model.get('currentShowType') != 1 && self.model.get('listMode') == 2){
					self.model.set('listMode',1);
					//$("#rename").show();
				}
				//当为搜索图片，且为时间轴视图时
				if(self.model.get('currentShowType') == 1 && self.model.get('listMode') == 2){
					$("#fileList").hide();
					$("#diskPicModle").show();
					$("#clickToGetMore").show();
					$("#sortDock").hide();
					$("#filelist_pager").hide();
					$(".diskTableList.onScollTable").hide();
					//$("#rename").hide();
				}else{
					$("#fileList").show();
					$("#diskPicModle").hide();
					$("#clickToGetMore").hide();
					$("#sortDock").show();
					$("#filelist_pager").show();
				//	$("#rename").show();
				}
				if(self.model.get('currentShowType') == 1 && self.model.get('listMode') == 0){
					$(".diskTableList.onScollTable").show();
				}
	        	var listMode = self.model.get('listMode');
				switch (listMode){
					case 0 :
						self.fileListView.render();
						$("#fileList").css("margin-top","0");
						break;
					case 1 :
						self.fileThumbnailView.render();
						$("#fileList").css("margin-top","14px");
						break;
					case 2 :
						self.fileThumbnailImageView.render();
						self.render = false;
						$("#fileList").css("margin-top","14px");
						$("#diskPicModle").css("margin-top","14px");
						break;
				}
				window.setTimeout(function(){
					self.resizeFileListHeight();
				},0xff);
	        });
	        self.model.on("renderSelectCount", function () {// 渲染用户选中的文件数量
	        	self.fileListView.renderSelectCount();
	        });
	        self.model.on("renderSelectAll", function (pageData) {// 渲染全选按钮
	        	self.fileListView.renderSelectAll(pageData);
	        });
	        self.model.on("reselectIconFiles", function () {// 缩略图模式的重新选中文件事件
	        	self.fileThumbnailView.reselectFiles();
	        });

	        self.model.on("previewFile", function (fid, target) {// 文件预览
	        	self.fileListView.previewFile(fid, target);
	        });
	        self.model.on("openDir", function (dirid) {// 打开文件夹
                //var model = self.model;
                var curDirType = self.model.get('curDirType');
                self.statusView.renderNavigation(dirid);
                self.model.trigger('renderBtns');


                self.model.resetProperties();
				self.model.trigger('renderSelectCount');
                var curDirid = self.model.get('curDirId');
                var curDirtype = self.model.get('curDirType');
                var options = {dirid : curDirid, dirType : curDirtype};
				self.getFiles(function(){
					self.model.trigger('createPager');
			    	self.model.trigger("renderFileList");
				}, options);
	        });
	        self.model.on("refresh", function () {// 刷新数据源，刷新界面
	        	// self.model.resetProperties();
	        	// self.fileListView.renderSelectCount();
	        	$(".inboxHeader.bgMargin").show();
	        	self.getDirectorys(function(){
	    			self.statusView.render();
	    			self.statusView.initEvents();
	    			self.toolbarView.render();
	    			self.model.trigger('openDir', self.model.get('curDirId'));
                    self.model.trigger('switchModeStyle');
			    });
	        });

            self.model.on('switchModeStyle', function(){
                var listMode = self.model.get('listMode');
                if(!listMode){
                    $("#listMode i").attr('class', 'i_view_checked');
                    $('#iconMode i').attr('class', 'i_list');
                }else{
                    $("#listMode i").attr('class', 'i_view');
                    $('#iconMode i').attr('class', 'i_list_checked');
                }
            });
            
            self.model.on("postCard", function () {// 制作明信片
	        	self.model.postCard();
	        });
	        
	        $(window).resize(function(){
        		self.resizeFileListHeight();
	        });

	        $(window).unload(function () {
	            $("object").parent().remove();//页面卸载或跳转前先移除掉flash，防止ie8报错  
	        });
			
			// 安装彩云PC客户端
			/*$("#setupDiskTool").click(function(event){
				var isrm = 0;
				if (top.isRichmail) {
                    isrm = 1;
                } else {
                    isrm = 0;
                }
                var diskResourcePath = 'http://images.139cm.com/rm/newnetdisk4/';
                var path = top.SiteConfig.disk;
                //window.open(path+"/wp.html?jsres=" + escape(diskResourcePath) + "&res=" + 'http://images.139cm.com/rm/richmail' + "&isrm=" + isrm, "virtualDiskHome");
				//彩云页面下载，需要统计积分，带sid过去
				var url = path+"/wp.html?jsres=" + $T.Html.encode(diskResourcePath) + "&res=" + 'http://images.139cm.com/rm/richmail' + "&isrm=" + isrm;
				url = url + "&sid=" + ($T.Url.queryString("sid") || top.sid);
                window.open(url, "virtualDiskHome");
			});*/

            this.registerCloseTabEvent();
        },
		render: function(){
			var self = this;
				//左边导航
			self.leftbarView = new M2012.Disk.View.Leftbar({model : self.model});
			top.leftbarView = self.leftbarView;
			if(self.model.get("break")){
				//	return;
			}
            self.getIndexDisk(function(){
    			self.statusView = new M2012.Disk.View.Statusbar({model : self.model});
    			self.statusView.render();
    			self.statusView.initEvents();
    			
    			self.commandView = new M2012.Disk.View.Command({model : self.model});
				
				//顶部导航
    			self.toolbarView = new M2012.Disk.View.Toolbar({model : self.model, parentView: self});
				top.toolbarView = self.toolbarView;
    			self.toolbarView.render();

		    	self.fileListView = new M2012.Disk.View.Filelist({model : self.model, parentView: self});// 列表模式
		    //	self.fileListView.render();
			//	self.model.trigger('createPager');
		    	self.fileThumbnailView = new M2012.Disk.View.Filethumbnail({model : self.model});// 缩略图模式
				self.fileThumbnailView.render();
				
				self.fileThumbnailImageView = new M2012.Disk.View.FileThumbnailImageView({model : self.model});

                self.renameView = new M2012.Disk.View.Rename({model: self.model});//重命名视图

                self.createDirView = new M2012.Disk.View.CreateDir({model: self.model});//创建文件夹视图
                
                /*self.musicView = new M2012.Disk.View.Music({model: self.model}); // 音乐播放视图层
                self.musicView.render();*/
                
                self.resizeFileListHeight();
				new M2012.Disk.View.ContextMenu({model: self.model, fileListView : self.fileListView});//鼠标右键
				self.model.getisShareSiChuan(function(res){
					console.log(res);
				});
            });
		},

        // 初始化一些参数，比如model中的一些提示语
        initParams: function(){
            var textTip = top.M139.Text.Utils.getFileSizeText(this.model.limitSizeSend);

            this.model.tipWords.LIMIT_SIZE_SEND = top.M139.Text.Utils.format(this.model.tipWords.LIMIT_SIZE_SEND, [textTip]);
        },

        registerCloseTabEvent: function(){
            top.$App.on("closeTab", this.closeTabCallback);
        },

        closeTabCallback: function (args) {
            if (!top || !top.$App) return;
            if (args.name && args.name.indexOf("diskDev") > -1) {
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
            var fileList = $("#fileList");

            if (fileList.length == 0) {
                return;
            }

            var listOffset = fileList.offset();
            var iframeHeight = $("#outArticle").height();
            var listTop = listOffset.top;
            $("#fileList").height(iframeHeight - listTop);
			$("#diskPicModle").height(iframeHeight - 63);
        },
		showGuidefirstTime : function(){
			var bgB = '<div class="backgroundBlock" id="bgB"></div>';
			var firstGuideTips = '<span class="promptOne" id="firstGuideTips"><a href="javascript:void(0);" id="firstGuideTipsClose"></a></span>';
						//为undefined的时候说明是第一次 为1的时候说明弹出过，不弹了。
						if(0 && !top.$App.getUserCustomInfo("sfgt")){ //屏蔽
							$(bgB).appendTo(top.document.body);
							$(firstGuideTips).appendTo(top.document.body);
							top.$("#firstGuideTipsClose").click(function(){
								top.$("#bgB").hide();
								top.$("#firstGuideTips").hide();
								top.$("#scContainer").hide();
								top.$App.setUserCustomInfoNew({"sfgt":1})
							});	
			}
		},
		getIndexDisk : function(callback){
            var self = this;
			top.firstEnterNet = true;
			top.M139.UI.TipMessage.show("正在加载中...");
            self.model.getIndexDisk(function(result){
                var responseData = result.responseData;
				var responseData = eval("(" + result.responseText + ")");
                if(responseData && responseData.code == 'S_OK'){
					top.M139.UI.TipMessage.hide();
                    var dataInit = responseData['var']["init"];
                    var baseInfo = dataInit.baseInfo;

                    self.model.set('diskInfo', baseInfo);
                    self.model.set('isMcloud', dataInit.isMcloud || "0");
					self.model.set('isShareSiChuan', dataInit.isShareSiChuan || "0");
					self.model.set('totalSize',baseInfo.fileNum);
					if(baseInfo["139MailId"]){
						self.model.set('139MailId', baseInfo["139MailId"]);
						self.model.set('curDirType','1');
					}
                    if(!self.model.get('curDirType')){
                        self.model.set('curDirType',baseInfo.rootDirType+'');
                    }
					/*
					if(self.model.get("isShareSiChuan") == "1"){
					//	alert("我是四川用户");
						var guideTips = ['<div id="layer_mask01" class="layer_mask" style="overflow: hidden; z-index: 5009; opacity: 0.5;"></div>',
											'<div class="shareLay" id="guideTips">',
											'<div class="container">',
												'<img src="/m2012/images/module/FileExtract/f.png">',
												'<a href="javascript:void(0);" id="guideTipsClose" class="closeBtn" title="关闭">x</a>',
												'<a href="javascript:void(0);" id="guideTipsEnter" class="txtInfoClick">云享四川 专享资源</a>',
											'</div>',
										'</div>'].join("");
						//为undefined的时候说明是第一次 为1的时候说明弹出过，不弹了。
						if(!top.$App.getUserCustomInfo("yunxiangsc")){
							$(guideTips).appendTo(top.document.body);
								top.$("#guideTipsClose").click(function(){
									top.$("#guideTips").hide();
									top.$("#layer_mask01").hide();
									top.$App.setUserCustomInfoNew({"yunxiangsc":1})
								});
								top.$("#guideTipsEnter").click(function(){
									top.$("#guideTips").hide();
									top.$App.setUserCustomInfoNew({"yunxiangsc":1});
									top.$("#layer_mask01").hide();
									top.$App.show('diskShare');
								});		
						}
						
					}*/
					self.model.diskAllInfo = result.responseData['var'];
					self.model.set('fileList', self.model.diskAllInfo.fileList);
                    callback && callback();
                    self.showGuidefirstTime();
                    // 判断是否从其他模块接收keyword参数，如果有则进入搜索界面
                    if(self.model.inputPara.keyword){
                    	$("#search").click();
                    	return;
                    }
                    
                    // 判断是否从其他模块接收dirId参数，如果有则进入指定目录，没有则进入彩云根目录
                    if(!self.model.get('curDirId')){
                        var initializeDirid = self.model.getInitializeDirid();
                        if(initializeDirid && initializeDirid != self.model.getRootDir()){
							if(!top.firstEnterNet){
								self.getDirectorys(function(){
									self.model.set('curDirId', initializeDirid);
								});
							}else{
								self.model.directorys = responseData['var']["allDirectorys"];
								self.model.setDirProperties(self.model.directorys);
								self.model.set('curDirId', initializeDirid);
							}
                            
                        }else{
							self.model.directorys = responseData['var']["allDirectorys"];
							self.model.setDirProperties(self.model.directorys);
                            self.model.set('curDirId', initializeDirid);
                        }
                    }
                }else{
					top.M139.UI.TipMessage.show("加载失败",{delay: 1000});
                    self.logger.error("getDiskInit returndata error", "[disk:init]", result);
                }
//                self.getDirectorys();
            });


        },
        // 获取彩云信息（容量，文件数量等）
        getDiskInit : function(callback,args){
            var self = this;
            args = args || {};
            if (!args.notips) {
                top.M139.UI.TipMessage.show("正在加载中...");
            }
            self.model.getDiskInit(function(result){
                var responseData = result.responseData;
                if(responseData && responseData.code == 'S_OK'){
					top.M139.UI.TipMessage.hide();
                    var dataInit = responseData['var'];
                    var baseInfo = dataInit.baseInfo;

                    self.model.set('diskInfo', baseInfo);
                    self.model.set('isMcloud', dataInit.isMcloud || "0");
					self.model.set('isShareSiChuan', dataInit.isShareSiChuan || "0");
					if(baseInfo["139MailId"]){
						self.model.set('139MailId', baseInfo["139MailId"]);
						self.model.set('curDirType','1');
					}
                    if(!self.model.get('curDirType')){
                        self.model.set('curDirType',baseInfo.rootDirType+'');
                    }/*
					if(self.model.get("isShareSiChuan") == "1"){
					//	alert("我是四川用户");
						var guideTips = ['<div id="layer_mask01" class="layer_mask" style="overflow: hidden; z-index: 5009; opacity: 0.5;"></div>',
											'<div class="shareLay" id="guideTips">',
											'<div class="container">',
												'<img src="/m2012/images/module/FileExtract/f.png">',
												'<a href="javascript:void(0);" id="guideTipsClose" class="closeBtn" title="关闭">x</a>',
												'<a href="javascript:void(0);" id="guideTipsEnter" class="txtInfoClick">云享四川 专享资源</a>',
											'</div>',
										'</div>'].join("");
						//为undefined的时候说明是第一次 为1的时候说明弹出过，不弹了。
						if(!top.$App.getUserCustomInfo("yunxiangsc")){
							$(guideTips).appendTo(top.document.body);
								top.$("#guideTipsClose").click(function(){
									top.$("#guideTips").hide();
									top.$("#layer_mask01").hide();
									top.$App.setUserCustomInfoNew({"yunxiangsc":1})
								});
								top.$("#guideTipsEnter").click(function(){
									top.$("#guideTips").hide();
									top.$App.setUserCustomInfoNew({"yunxiangsc":1});
									top.$("#layer_mask01").hide();
									top.$App.show('diskShare');
								});		
						}
						
					}*/
                    callback && callback();
                    self.showGuidefirstTime();
                    // 判断是否从其他模块接收keyword参数，如果有则进入搜索界面
                    if(self.model.inputPara.keyword){
                    	$("#search").click();
                    	return;
                    }
                    
                    // 判断是否从其他模块接收dirId参数，如果有则进入指定目录，没有则进入彩云根目录
                    if(!self.model.get('curDirId')){
                        var initializeDirid = self.model.getInitializeDirid();
                        if(initializeDirid && initializeDirid != self.model.getRootDir()){
                            self.getDirectorys(function(){
                                self.model.set('curDirId', initializeDirid);
                            });
                        }else{
                            self.model.set('curDirId', initializeDirid);
                        }
                    }
                }else{
					top.M139.UI.TipMessage.show("加载失败",{delay: 1000});
                    self.logger.error("getDiskInit returndata error", "[disk:init]", result);
                }
//                self.getDirectorys();
            });


        },

        // 初始化模型层数据
        getDirectorys : function(callback){
			var self = this;
            self.model.getDirectorys(function(result){
             if(result.responseData && result.responseData.code == 'S_OK'){
					self.model.directorys = result.responseData['var'].directorys;
                    self.model.setDirProperties(self.model.directorys);
                    callback && callback();
				}else{
					self.logger.error("getDirectorys returndata error", "[disk:getDirectorys]", result);
				}
		    });
        },
		// 取目录下的子文件夹及文件
		getFiles : function(callback, options){
			var self = this;
		    var options = {dirid : options.dirid, dirType : options.dirType};
		    self.model.getDirFilesByPage(function(result){
				if(result.responseData && result.responseData.code == 'S_OK'){
                    self.model.diskAllInfo = result.responseData['var'];
					/*
					var data = self.model.diskAllInfo.files;
					var currentId = "";
					var currentObj = null;
					if(self.first){
						$.each(data, function(){
							if(this.name == "139邮箱"){
								currentId = this.id;
								currentObj = this;
								return false;
							}	
						});
						self.first = false;
						if(currentId){
							options = {dirid : currentId, dirType : 1};
							self.model.set('curDirId', currentId); //当前目录
							$("#navContainer").append('<span class="f_st">&nbsp;&gt;&nbsp;</span><span>139邮箱</span>');
							currentObj.parentDirectoryId = options.dirid;//需要父目录
							self.model.setParentDirs(currentObj);
							self.getFiles(callback, options);
						}
						return;
					}*/
					self.model.set('fileList', self.model.diskAllInfo.files);
					self.model.set('totalSize', self.model.diskAllInfo.totalSize);
                    callback && callback();
                //    self.getDirectorys();   //调目录接口（用户操作当前位置）
				}else{
					self.logger.error("getFiles returndata error", "[disk:fileList]", result);
				}
		    }, options);
		}
    }));
})(jQuery, _, M139);


/**
 网盘拖拽实现移动到功能
 * */
M139.namespace("M2012.Disk.View", {
	Drag: Backbone.View.extend({
		initialize: function (options) {
		//	this.model = $App.getView("mailbox").model;
		//	this.model = new M2012.Disk.Model();
			this.model = options.model;
		},
		createInstance:function(self,options){
		//	debugger;
		//	if (!top.$App.getView("dragdisk")) {
				top.$App.registerView("dragdisk", new M2012.Disk.View.Drag(options));
		//	}
			this.fileList = self;
			return top.$App.getView("dragdisk");
		},
		alert1: function(){
			alert("alert1");
		},
		render: function () {
		//	console.log(321123);
		    var self = this;
			if (!this.created) { //第一次创建拖放元素
			    this.el = $("<div id='dragBasket' style='position:absolute;z-index:9999;display:none'><span class=\"msg msgYellow\"><i class=\"i_t_move\"></i> <span id='dragtips'>移动n个文件</span></span></div>");
				$(document.body).append(this.el);
				this.created = true;
			}
			var basket = this.el[0];
			var lastFid = -1;
			var dx = 0; //偏移量，用于判断是否执行了拖放
			var isDrag = false; //是否执行了拖放
			var orignElem; //最初鼠标按下时的那个dom元素
			var repeaterRender = true; //拖动的时候某些渲染和显示只显示一次，避免多余显示
			var listMode = self.model.get("listMode");
			var handleElement = $("#fileList2").find("tr[fileid]");
			if(listMode == 1){
				handleElement = $("#fileList").find("li[fileid]");
			}
			$D.setDragAble(basket, {
			    handleElement: handleElement,//TODO 7ms 优化
                //bounds:[0,0,800,600],
			    onDragStart: function (e) {
			        dx = 0;
					console.log("begin!");
			        orignElem = e.target || e.srcElement;
			        if (orignElem) {
			            if ($(orignElem)[0].tagName == "INPUT") {
			                return false; //返回false阻止拖动开始
			            } 
			        }
			    },
				onDragMove: function (e) {
				    dx++;
				    if (dx > 10) {
						console.log("moveing!");
				        self.el.show();
						if(repeaterRender){
							
							var thisCheckbox = $(orignElem).parents("tr").find("input[type=checkbox]");
							if(listMode == 1){
								thisCheckbox = $(orignElem).parents("li").find("input[type=checkbox]");
							}
							if(!thisCheckbox.prop("disabled")){
							
							//	console.log(thisCheckbox);
								thisCheckbox.attr("checked", true);
							//	thisCheckbox.click();
								var fid = thisCheckbox.attr('fileid');
								var type = thisCheckbox.attr("filetype");
								var selectedFids = self.model.get('selectedFids');
								var selectedDirIds = self.model.get("selectedDirIds");
								var selectedDirAndFileIds = self.model.get("selectedDirAndFileIds");
								var selectedDirType = self.model.get("selectedDirType");
								var shareFileId = self.model.get("shareFileId");
								//var startEle = model.get('startEle');

								// 保存 / 清除 选中文件或者目录的ID
								self.model.addOne(fid, type == self.model.dirTypes.FILE ? selectedFids : selectedDirIds);
								self.model.addOne(fid, selectedDirAndFileIds);
								self.model.addOne(fid, shareFileId);
								//记录当前选择的目录类型
								if (type !== self.model.dirTypes.FILE) {
									self.model.changeDirType(type);
								}
							//	self.fileList.selectEvent($(orignElem).parents("tr").find("input[type=checkbox]"));//拖动的时候，把选择的数据加到model里
							//	self.fileList.renderSelectCount();//拖动的时候 状态栏
								self.model.trigger("renderSelectCount");
								repeaterRender = false;
							}

						}
				        lastFid = hitTestFolder(basket);
					//	console.log(1111);
					//	console.log(self.model.get("selectedFids"));
					//	console.log(self.model.get("selectedDirIds"));
					//	console.log(2222);
					//	console.log("aa");
					//	console.log($("#dragBasket").offset());
					//	console.log("bb");
					//	console.log(lastFid + "123");
				        $(basket).find("#dragtips").html("移动" + self.getSelectedCount() + "个文件");
						/*
				        if (lastFid > 0 && lastFid != 8 & lastFid != 9) { //命中文件夹
				            var actionText = isTag ? "标记" : "移动" ;
				            $(basket).find("#dragtips").html(actionText + self.getSelectedCount() + "封邮件");
				            $(basket).find(".msg").removeClass("msgYellow");
				            $(basket).find("i")[0].className = "i_t_right";
				        } else {
				            lastFid = null;
				            $(basket).find(".msg").addClass("msgYellow");
				            $(basket).find("i")[0].className = "i_t_move";
				        } */
						if(lastFid){
							$(basket).find(".msg").removeClass("msgYellow");
				            $(basket).find("i")[0].className = "i_t_right";
						}else{
							lastFid = "";
				            $(basket).find(".msg").addClass("msgYellow");
				            $(basket).find("i")[0].className = "i_t_move";
						}
				        isDrag = true;
				    } else {
				        isDrag = false;
				    }
				    //console.warn(result);
				},
				onDragEnd: function (e) {
				    self.el.hide();
				    dx = 0;
					repeaterRender = true;
				//	console.log("end!");
				//	console.log('1-' + lastFid + '-2');
				    if (isDrag) { 
				        if (lastFid) {
							//top.$App.trigger("diskCommand", args);
							self.requestDiskFileMove(lastFid);
				        }
				    } 
				}
			});
		    function hitTestFolder (basket) {

		        var result = "";
		        var isReturn = false;//退出循环标志
				var trs = $("#fileList2 tr[fileid]");
				if(listMode == 1){
					trs = $("#fileList li[fileid]");
				}
		        trs.each(function (i, n) {
		            if (!isReturn) {
		                var input = $(n).find("input[filetype='1']");
						
		                if ($D.hitTest(n, basket)) {
		                    $(n).addClass("on");//高亮背景
						//	console.log("a");
						//	console.log($(n).offset());
		                //  console.log("b");
							result = input.attr("fileid");
		                
		                    isReturn = true;
		                } else {
		                    $(n).removeClass("on");
		                }
		            } else {
		                $(n).removeClass("on");
		            }
		        });
		        return result;
		    
		    }
		},
		getSelectedCount:function(){ //选中了几封邮件
		    var resultObj = this.model.get("selectedFids").length + this.model.get("selectedDirIds").length;
		    return resultObj;
		    
		},
		//彩云文件/文件夹移动
        requestDiskFileMove: function (dirId) {
            var self = this;
            var dirId = String(dirId);
            var requestData = {
                fileIds: self.model.get("selectedFids").join(","),
                directoryIds: self.model.get("selectedDirIds").join(","),
                srcDirType: 1,
                toDirectoryId: dirId,
                toDirType: 0
            };

            top.M139.UI.TipMessage.show("正在移动...");
            M139.RichMail.API.call("disk:move", requestData, function (response) {
                top.M139.UI.TipMessage.hide();
                var responseData = response.responseData;

                if (responseData && responseData.code == "S_OK") {
					self.model.trigger('refresh', null);
                } else {
                    var error = response.responseData.summary;
                    top.$Msg.alert(error, {ico: "warn"});
                }
            });
        }
	})
});
M139.namespace("M2012.Disk.Model", {
	ContextMenu : Backbone.Model.extend({
		initialize : function (options) {
			this.diskModel = options.model;
		},
		container : ['<div style="top: 145px; left: 727px; z-index: 9001; position: absolute;" class="menuPop shadow  show" bindautohide="1"><ul>','</ul></div>'],
		template :['<li index="2" command="download"><a href="javascript:;"><span class="text"><i class="icon i-cDown"></i>下载</span></a></li></li>',
					'<li index="3" command="sendToMail"><a href="javascript:;"><span class="text"><i class="icon i-cSend"></i>发送</span></a></li></li>',
					'<li index="4" command="share"><a href="javascript:;"><span class="text"><i class="icon i-cShare"></i>分享</span></a></li>',
					'<li index="5" command="remove"><a href="javascript:;"><span class="text"><i class="icon i-cMove"></i>移动到</span></a></li>',
					'<li index="6" command="rename"><a href="javascript:;"><span class="text"><i class="icon i-cRenaming"></i>重命名</span></a></li>',
					'<li index="7" command="deleteDirsAndFiles"><a href="javascript:;"><span class="text"><i class="icon i-cDelete"></i>删除</span></a></li>'],
		//获取邮件列表右键菜单 isSingle，是否单封邮件
		getMailMenu : function (isSingle) {
			var data = [];
			var rightContextString = "";
			var self = this;
			var selectedOne = this.diskModel.getSelectedDirAndFiles();
			if (isSingle) { //单封邮件
				
				if(selectedOne[0] && (selectedOne[0]["type"] == "file" || selectedOne[0].directoryId)){
					data = [{
						text : '我是文件',
						command : "preview",
						bh2 : "context_preview",
						items : [{
								html : "<b>读信预览</b>"
							}
						]
					}];
					rightContextString = self.template.join("");
				}else if(selectedOne[0] && selectedOne[0]["type"] == "directory"){
					if(self.diskModel.isRootDir(selectedOne[0]["id"])){
						data = [{
							text : '我是目录，且是系统的',
							command : "newWindow",
							bh : "context_newWindow"
							}];
						rightContextString = self.template[0];
					}else{
						data = [{
							text : '我是目录，非系统目录',
							command : "preview",
							bh2 : "context_preview",
							items : [{
								html : "<b>读信预览</b>"
							}]
						}];
						rightContextString = self.template[0] + self.template[2] + self.template[3]+ self.template[4] +self.template[5] ;
					}
				}
			} else { //多封
				var isAllFILE = false;
				var isAllDIR = false;
				var file = 0;
				var directory = 0;
				var systemD = 0;
				var length = selectedOne.length;
				$.each(selectedOne, function(){
					if(this.type == "file" || this.directoryId){
						file++;
					}
					if(this.type == "directory"){
						if(self.diskModel.isRootDir(this.id)){
							systemD++;
						}else{
							directory++;
						}
					}
				});
				if(systemD == length){
					data = [{
						text : '全是系统目录',
						command : "move",
						args : {
							fid : 4
						},
						bh : "context_move"
					}];
					rightContextString = "";
				}
				if(directory == length){
					data = [{
						text : '全是普通目录',
						command : "move",
						args : {
							fid : 4
						},
						bh : "context_move"
					}];
					rightContextString = self.template[0] +self.template[2]+self.template[3]+ self.template[5];
				}
				if(file == length){
					data = [{
						text : '全是文件',
						command : "move",
						args : {
							fid : 4
						},
						bh : "context_move"
					}];
					rightContextString = self.template[0] + self.template[1] + self.template[2]+ self.template[3]+ self.template[5];
				}
				if(systemD + directory == length && systemD != 0 && directory !=0){
					data = [{
						text : '系统普通',
						command : "move",
						args : {
							fid : 4
						},
						bh : "context_move"
					}];
					rightContextString = self.template[1];
				}
				if(directory + file == length && directory !=0 && file !=0){
					data = [{
						text : '普通文件',
						command : "move",
						args : {
							fid : 4
						},
						bh : "context_move"
					}];
					rightContextString = self.template[0] +self.template[2]+self.template[3]+ self.template[5];
				}
				if(systemD + file == length && systemD !=0 && file !=0){
					data = [{
						text : '文件系统',
						command : "move",
						args : {
							fid : 4
						},
						bh : "context_move"
					}];
					rightContextString = "";
				}
				if(systemD + file + directory == length && systemD !=0 && file !=0 && directory !=0){
					data = [{
						text : '普通系统文件',
						command : "move",
						args : {
							fid : 4
						},
						bh : "context_move"
					}];
					rightContextString = "";
				}
				console.log(file+"-"+directory+"-"+systemD);
			}
			if(self.diskModel.get('currentShowType') != 0){
				rightContextString = self.template[0]+self.template[1]+self.template[2]+self.template[5];
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

M139.namespace("M2012.Disk.View", {
	ContextMenu : Backbone.View.extend({
		el : "body",
		template : "",
		events : {},
		initialize : function (options) {
			var self = this;

			this.diskModel = options.model;
			this.fileList = options.fileListView;
			this.contextModel = new M2012.Disk.Model.ContextMenu({
					model : this.diskModel
			});
			//因为dom还没生成，用live监听事件，统一给所有含有右键菜单的容器添加contextMenu事件
			//todo attach event on li
			$("#fileList").live('contextmenu', function (e) {
				var sender = this,thisCheckbox;
				BH("disk3_context");
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
			
			
			var fileid = thisCheckbox.attr('fileid');
			this.fileid = fileid;
			var type = thisCheckbox.attr("filetype");
			
			if(self.model.isRootDir(fileid)){
				thisCheckbox.attr("checked", false);
				self.diskModel.set("SelectSysDir",fileid)
			}else{
				thisCheckbox.attr("checked", true);
			}
			
			
			var selectedFids = self.diskModel.get('selectedFids');
			var selectedDirIds = self.diskModel.get("selectedDirIds");
			var selectedDirAndFileIds = self.diskModel.get("selectedDirAndFileIds");
			var shareFileId = self.diskModel.get("shareFileId");
						
			self.diskModel.addOne(fileid, type == self.diskModel.dirTypes.FILE ? selectedFids : selectedDirIds);
			self.diskModel.addOne(fileid, selectedDirAndFileIds);
			self.diskModel.addOne(fileid, shareFileId);
			//记录当前选择的目录类型
			if (type !== self.diskModel.dirTypes.FILE) {
				self.diskModel.changeDirType(type);
			}
			self.fileList.renderSelectCount();//拖动的时候 状态栏
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
			var fileid = thisCheckbox.attr('fileid');
			
			var selectedList = this.diskModel.getSelectedDirAndFiles();//获取选中项
			var Mids = [];
			$.each(selectedList,function(){
				Mids.push(this.id);
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
					if(self.model.get('listMode')){
						self.model.trigger('reselectIconFiles');
					}else{
						self.fileList.reselectFiles();//渲染未选中
					}
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
				top.$App.trigger("diskCommand", {command : command});
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
			/*
			var menu = M2012.UI.PopMenu.create({
					width : 150,
					width2 : 180,
					items : menuItems,
					top : pos.y + "px",
					left : pos.x + "px",
					onItemClick : function (item) {
						//alert(item.command);
						var commandArgs = _.clone(item);
						for (elem in item.args) {
							commandArgs[elem] = item.args[elem];
						}
						$App.trigger("mailCommand", commandArgs);
						if (item.args && item.args.bh) {
							BH(item.args.bh);
						}
					}

				});
			
			this.model.set("currentMenu", menu);
			bindAutoHide(menu.el);

			menu.on("itemMouseOver", function (item) {
				if (item.bh2) { //鼠标划过的行为
					BH(item.bh2);
				}
			});
			menu.on("subItemCreate", function (item) { //二级菜单render前触发
				//bindAutoHide(item.menu.el);
				if (item.command == "preview") { //读信预览
					$(item.menu.el).removeClass(); //清除原有菜单样式
					$(item.menu.el).css({
						width : "570px",
						position : "absolute"
					}); //修改宽度
					$(item.menu.el).html(self.getPreviewMail());
				}
				//console.log(item);
			});

			//右键菜单自动消失
			function bindAutoHide(el) {
				$(el).mouseenter(function () {
					clearTimeout(timerId);
				}).mouseleave(function () {
					dispearInFuture();
				});
				var timerId = -1;
				function dispearInFuture() {

					timerId = setTimeout(function () {
							menu.remove();
						}, 500);
				}
			}
			*/

		}
	})
});

﻿/**
 * @fileOverview 定义彩云页面App对象
 */
(function(jQuery, Backbone, _, M139) {
	var $ = jQuery;
	var superClass = M139.PageApplication;
	M139.namespace("M2012.Disk.Application", superClass.extend(
	/**@lends M2012.MainApplication.prototype*/
	{
		/**
		 *彩云页App对象
		 *@constructs M2012.Disk.Application
		 *@extends M139.PageApplication
		 *@param {Object} options 初始化参数集
		 *@example
		 */
		initialize : function(options) {
			superClass.prototype.initialize.apply(this, arguments);
		},
		defaults : {
			/**@field*/
			name : "M2012.Disk.Application"
		},
        model: null,
		/**主函数入口*/
		run : function() {
		    this.model = new M2012.Disk.Model();
			var options = {
			    model: this.model
			};
			mainView = new M2012.Disk.View.Main(options);
			mainView.initEvents();
			mainView.render();
			BH({key : "diskv2_load"});
		}
	}));
	$diskApp = new M2012.Disk.Application();
	$diskApp.run();
})(jQuery, Backbone, _, M139);

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

    M139.namespace("M2012.Disk.View.UploadFileList", Backbone.View.extend({
        el: "#fileList",

        getListContainer: function(){
            return $(this.listSelector);//每次重新获取一遍容器
        },

        getIconContainer: function(){
            return $(this.iconSelector);
        },

        itemTemplete: ['<tr class="item-upload" clientTaskno="{clientTaskno}" rel="uploadFile">',
                '<td class="wh1 t-check"><input type="checkbox" disabled = "disabled" fileid="" filetype="file"></td>',
                '<td>',
					'<div class="fl p_relative">',
						'<i class="i-file-smalIcion i-f-{expandName}"></i>',
					'</div>',
                    '<a href="javascript:void(0)" class="attchName" title="">',
                        '<span class="nameContainer">',
                            '<em fileid="" fsize="" name="fname">{fileName}</em>',
                            '<input type="text" fname="{fileName}" exname="{expandName}" value="{fileName}" maxlength="255" size="30" style="display:none;">',
                            '<em fileid="" fsize="" name="fname">.{expandName}</em>',
                        '</span>',
                    '</a>',
                    '<div class="attachment">',
                        '{subTemplete}',
                    '</div>',
                '</td>',
                '<td class="wh5 gray" rel="uploadDate"></td>',
                '<td class="wh6 gray" rel="fileSize">{fileSize}</td>',
            '</tr>'].join(""),

        fileOperationTmplete: ['<span style="display:none;"><a href="javascript:void(0)" name="download" fileid="{businessId}">下载</a> <span>|</span> ',
            '<a href="javascript:void(0)" name="share" fileid="{businessId}">共享</a> <span>|</span> ',
            '<a href="javascript:void(0)" name="send" fileid="{businessId}">发送</a> <span>|</span> ',
            '<a href="javascript:void(0)" name="delete" fileid="{businessId}" fname="{fileNameOrigin}">删除</a></span>'].join(""),

        fileSizeLimitTmplete: ['<i class="i_warn_min"></i>',
            '<span class="red">超过100M，无法上传！</span>',
            '<a href="javascript:void(0)" name="deleteEle" fileid="{businessId}" fname="{fileNameOrigin}">删除</a>',
            '<span class="gray">139邮箱小工具支持超大文件急速上传、断点续传！</span>',
            '<a href="javascript:void(0)" name="installTool">立即安装</a>'].join(""),

        errUploadTemplete: ['<i class="i_warn_min"></i>',
            '<span class="red">{errInfo}</span>',
            '<a href="javascript:void(0)" class="pl_10" name="againUpload">重试</a>',
            '<span class="line">|</span>',
            '<a href="javascript:void(0)" name="deleteEle" fileid="" fname="">删除</a>'].join(""),

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
            '<span class="pt_5 gray">正在扫描本地文件</span>'].join(""),

        md5LoadingPercentTemplete: ['<img class="" src="../../images/global/load.gif">',
            '<span class="pt_5 gray">{md5Percent}正在扫描本地文件</span>'].join(""),

        commonUploadTemplete: ['<img class="" src="../../images/global/load.gif">',
            '<span class="pt_5 gray">正在上传本地文件</span>'].join(""),

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

        limitMaxUploadSizeTemplete: ['<i class="i_warn_min"></i>',
            '<span class="red">超出当前套餐单文件大小{limitUploadSize}限制，上传失败。</span>',
            '<a href="javascript:void(0);" name="deleteEle">删除</a>'].join(""),

        emptyUploadSizeTemplete: ['<i class="i_warn_min"></i>',
            '<span class="red">不允许上传空文件，请重新选择。</span>',
            '<a href="javascript:void(0);" name="deleteEle" class="">删除</a>'].join(""),

        deleteBtnTemplete: ['<span class="btn-delete">',
                '<span>|</span>',
                '<a hidefocus="1" href="javascript:void(0)" name="delete" fileid="{fileId}" fname="{fileOriginName}"> 删除</a>',
            '</span>'].join(""),

        itemIconTemplete: [ '<li class="listItem" rel="uploadFile">',
                '<p class="chackPbar">',
                    '<input fileid="{fileId}" name="checkbox"  filetype="file" type="checkbox" class="checkView" style="display: none;" disabled = "disabled">',
                '</p>',
                '<a href="javascript:void(0);" class="viewPic">',
                    '<img src="../../images/module/FileExtract/default.png" filetype="file" fileid="{fileId}" name="fname" style="">',
                '</a>',
                '<div class="viewIntroduce">',
                    '<p class="fileNameBar">',
                        '<span class="itemName" name="nameContainer">',
                            '<a fileid="{fileId}" filetype="file" fsize="$filesize" href="javascript:void(0)" name="fname">{fileName}</a>',
                            '<input type="text" filetype="file" fname="{fileName}" exname="{expandName}" value="{fileName}" maxlength="255" size="30" style="display:none; width:100px; overflow: hidden;" />',
                        '</span>',
                        '<span class="itemSuffix">.{expandName}</span>',
                    '</p>',
                    '{subTemplete}',
                '</div>',
            '</li>'].join(""),

        flashLimitTipIconTemplete: ['<p class="gray">',
                                        '<i class="i_warn_min"></i>',
                                        '<span class="red">超过100M上传失败！</span>',
                                        '<a href="#" name="deleteEle">删除</a>',
                                    '</p>'].join(""),

        emptyUploadSizeIconTemplete: ['<p class="gray" style="display:block!important;">',
                                        '<i class="i_warn_min"></i>',
                                        '<span class="red">不能上传空文件</span>',
                                        '<a href="#" name="deleteEle">删除</a>',
                                    '</p>'].join(""),

        limitUploadSizeIconTemplete: ['<p class="gray">',
                                    '<i class="i_warn_min"></i>',
                                    '<span class="red">超出当前套餐单文件大小</span>',
                                '</p>'].join(""),

        fileSizeBar: '<p class="gray" style="display: block;"><span style="display: none;">{fileSize}</span></p>',

        fileOperationIconTmplete: ['<p style="display: none;" class="attachment">',
                '<a hidefocus="1" href="javascript:void(0)" name="download" fileid="{businessId}">下载</a><span class="line">|</span>',
                '<a hidefocus="1" href="javascript:void(0)" name="share" fileid="{businessId}">共享</a><span class="line">|</span>',
                '<a hidefocus="1" href="javascript:void(0)" name="send" fileid="{businessId}">发送</a><span class="line">|</span>',
                '<a hidefocus="1" href="javascript:void(0)" name="delete" fileid="{businessId}" fname="{fileNameOrigin}">删除</a>',
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
                '<span class="red">{errInfo}</span>',
            '</p>'].join(""),

        errOperationTemplete: ['<p style="display: none;" class="attachment">',
                '<a href="javascript:void(0);">重试</a>',
                '<span class="line">|</span>',
                '<a href="javascript:void(0);" name="deleteEle">删除</a>',
            '</p>'
        ].join(""),

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
            this.controler          = options.controler;
            this.model              = options.model;
            this.listSelector       = options.listSelector;
            this.iconSelector       = options.iconSelector;
            this.subModel           = options.subModel;
            this.scrollSelector     = options.scrollSelector;
            this.isMcloud           = options.subModel.get("isMcloud");
            this.currentUploadType  = options.controler.currentUploadType;
        },

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
        },

        getListMode: function(){
            return mainView.model.get("listMode");// 列表模式：0 列表 1 图标
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
                        fileSize: file.size ? top.M139.Text.Utils.getFileSizeText(file.size) : "",
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
            this.bindCoperationEvent();
        },

        insertEle: function(elem){
            var self = this;
            var subModel = this.subModel;
            var container = this.getContainer();

            if (subModel) {
                var folderNum = subModel.getFolderNumByCurDir();

                /*if (folderNum > 0) {//当前目录下存在文件夹
                    var lastFolderEle = container.children().eq(folderNum - 1);
                    lastFolderEle.after(elem);
                    if (!self.getListMode()) {
                        self.el.scrollTop = lastFolderEle[0].offsetTop + lastFolderEle[0].offsetHeight;
                    } else {
                        self.el.scrollTop = lastFolderEle[0].offsetTop - 156;//由于图片视图li是浮动的，导致定位的父元素发生改变
                    }
                } else {
                    container.prepend(elem);
                    self.el.scrollTop = 0;
                }*/
                container.prepend(elem);
                self.el.scrollTop = 0;
            }
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
                currentItem = this.model.fileListEle[clientTaskno],
                templete = "";

            if (this.controler.currentUploadType == this.controler.uploadType.COMMON) { //普通上传
                templete = this.commonUploadTemplete;
            } else {
                templete = this.md5LoadingTemplete;
            }

            currentItem.find(".attachment").html(templete);
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
            bindStopUploadEvent();

            function bindStopUploadEvent(){
                btnSwitchUploadEle.bind("click", function(){
                    btnSwitchUploadEle.html("续传");
                    self.model.set("isStop", true);
                    self.controler.onabort(clientTaskno);
                    btnSwitchUploadEle.unbind("click");

                    // 由于彩云分布式无法支持暂停之后立即续传，需要将续传功能冻结 5s
                    setTimeout(function(){
                        bindResumeUploadEvent();
                    }, 5000);
                });
            }

            function bindResumeUploadEvent(){
                btnSwitchUploadEle.bind("click", function(){
                    var itemUploadEle = btnSwitchUploadEle.parents(".item-upload");

                    btnSwitchUploadEle.html("暂停");

                    //当前上传文件在上传队列中的索引
                    var clientTaskno = itemUploadEle.attr("clientTaskno");

                    self.controler.uploadHandle(function (options) {
                        self.error.call(self, options);
                    }, null, clientTaskno);

                    btnSwitchUploadEle.unbind("click");
                    bindStopUploadEvent();
                })
            }
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

            //普通上传存彩云，上传完文件之后需要刷新列表
            if (self.isMcloud == "1" && self.currentUploadType == self.controler.uploadType.COMMON) {
                self.subModel.trigger("refresh");
                return;
            }

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

            currentFile.fileInfo && currentItem.find("td[rel='uploadDate']").html(currentFile.fileInfo.createTime);
            currentFileSize && currentItem.find("td[rel='fileSize']").html(top.M139.Text.Utils.getFileSizeText(currentFileSize));

            currentItem.find("input[type='checkbox']").attr({'fileid':currentFileBusinessId,'disabled':false});
            currentItem.find(".attchName").attr("title", currentFileNameOrigin);
            currentItem.find(".nameContainer em").attr("fsize", currentFileSize)
                .attr("fileid", currentFileBusinessId)
                .eq(0).html(self.model.getShortName(currentFileNameOrigin, 30))
                .next().attr("fname", currentFileName).attr("value", currentFileName);

            var successHtml = top.M139.Text.Utils.format(this.fileOperationTmplete, {
                businessId: currentFileBusinessId,
                fileNameOrigin: $T.Html.encode(currentFileNameOrigin)
            });

            setTimeout(function(){
                currentItem.find(".attachment").html(successHtml).hide();
				currentItem.find(".attchName").css("padding-top","6px");
				
            }, 1000);

            this.completeModelHandle();
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
            var errHtml = top.M139.Text.Utils.format(this.errUploadTemplete, {
               errInfo: currentFile.summary || "上传失败！"
            });

            currentItem.find(".attachment").html(errHtml);
            currentItem.find("input[type='checkbox']").attr("disabled", true);
            currentItem.find("a[name='againUpload']").click(function(){//重传
                var btnTxtEle = $(this);
                var itemUploadEle = btnTxtEle.parents(".item-upload");
                var clientTaskno = itemUploadEle.attr("clientTaskno");

                $(this).parent().html(progressBarHtml);//插入进度条dom
                self.controler.uploadHandle(function (options) {
                    self.error.call(self, options);
                }, function(){
                    self.model.trigger("getFileMd5");
                }, clientTaskno);
            });

            this.completeModelHandle();
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
                currentItem = this.model.fileListEle[clientTaskno],
                templete = "";

            if (this.controler.currentUploadType == this.controler.uploadType.COMMON) { //普通上传
                templete = this.commonUploadTemplete;
            } else {
                templete = this.md5LoadingTemplete;
            }

            currentItem.find(".progressBarWrap").html(templete);
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
            var self = this;

            //普通上传存彩云，上传完文件之后需要刷新列表
            if (self.isMcloud == "1" && self.currentUploadType == self.controler.uploadType.COMMON) {
                self.subModel.trigger("refresh");
                return;
            }

            var currentFile = this.model.get("currentFile");//当前上传文件信息
            var clientTaskno = currentFile.clientTaskno;
            var currentItem = this.model.fileListEle[clientTaskno];
            var currentFileSize = currentFile.size;
            var currentFileNameOrigin = currentFile.name;
            var currentFileBusinessId = currentFile.businessId;
            var currentFileName = this.model.getFullName(currentFileNameOrigin);
            var progressTipEle = this.model.progressTipEle;
            var imgEle = currentItem.find(".viewPic img");

            currentItem.find(".state-upload").html("成功");
            currentItem.find(".progressBarWrap").remove();
            currentItem.find(".fileNameBar").after(top.M139.Text.Utils.format(this.fileSizeBar, {
                fileSize: top.M139.Text.Utils.getFileSizeText(currentFileSize)
            }));
            currentItem.find(".chackPbar input").attr("fileid", currentFileBusinessId);
            currentItem.find(".itemName em").html(self.model.getShortName(currentFileNameOrigin, 10));

            currentItem.find(".btn-switch-upload").hide();
            currentItem.find(".progressBarCur span").css({"width": "100%"}); //单副本上传控件进度条显示
            currentItem.find(".attachment").show();
			var ext = currentFile.fileInfo.name.split(".").pop();
            if (currentFile.thumbUrl) {
                imgEle.attr("src", currentFile.thumbUrl);
            } else if (currentFile.fileInfo.file && ext) {
                imgEle.attr("src", '../../images/module/FileExtract/' + ext + '.png');
                imgEle.parent().attr("class", "viewPic");
				imgEle.error(function(){
					this.src = '../../images/module/FileExtract/default.png';
				});
            }
            imgEle.attr("fileid", currentFileBusinessId);

            currentItem.find("input[type='checkbox']").attr({"fileid":currentFileBusinessId,'disabled':false});
            currentItem.find(".attchName").attr("title", currentFileNameOrigin);
            currentItem.find(".nameContainer em").attr("fsize", currentFileSize)
                .attr("fileid", currentFileBusinessId)
                .eq(0).html(currentFileName)
                .next().attr("fname", currentFileName).attr("value", currentFileName);

            var successHtml = top.M139.Text.Utils.format(this.fileOperationIconTmplete, {
                businessId: currentFileBusinessId,
                fileNameOrigin: $T.Html.encode(currentFileNameOrigin)
            });

        //    currentItem.find(".viewIntroduce").append(successHtml);
            this.completeModelHandle();
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
            var errHtml = top.M139.Text.Utils.format(this.errUploadIconTemplete, {
                errInfo: currentFile.summary || "上传失败！"
            });

            currentItem.find(".progressBarWrap").before(errHtml + self.errOperationTemplete)
                .remove();
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
            this.completeModelHandle();
        },

        //将上传成功或者失败文件的数据存储在fileList中
        completeModelHandle: function(){
            var currentFile = this.model.get("currentFile");
            var newFile = currentFile.fileInfo || {};
            var folderNum = this.subModel.getFolderNumByCurDir();

            this.subModel.get("fileList").splice(folderNum, 0, newFile);
            this.model.set("uploadedFileNum", this.model.get("uploadedFileNum") + 1);
        },

        errModelHandle: function(){
            var currentFile = this.model.get("currentFile");
            var newFile = currentFile.fileInfo || {};
            var folderNum = this.subModel.getFolderNumByCurDir();

            this.subModel.get("fileList").splice(folderNum, 0, newFile);
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
        }
    }));
})(jQuery, Backbone, _, M139);

