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
﻿﻿/**
 * @
 */
(function (jQuery, Backbone, _, M139) {
    var $ = jQuery;
    M139.namespace("M2012.UI.SelectFile.Model", Backbone.Model.extend({
        defaults: {
        	viewType : 'localFile',
        	localFileType : '',
        	localFileList : [], // 本地文件列表
        	cabinetFileList : [], // 暂存柜文件列表
        	diskFileList : [], // 彩云文件列表
        	diskDir : {} // 彩云目录
        },
        viewTypes : {
        	LOCAL_FILE : 'localFile',
        	DISK : 'disk',
        	CABINET : 'cabinet'
        },
        localFileTypes : {
        	LOCAL_FILE_DEFAULT : 'localFileDefault',
        	LOCAL_FILE_LIST : 'localFileList'
        },
        tipWords: {
            UPLOADING: "关闭超大附件，当前正在上传的文件会失败，是否关闭？",
            UPLOAD_LARGEATTACH: "(单个文件最大{0}G)"
        },
        urls : {// 跳转到其它页面的URL
			DISK_URL : '/m2012/html/selectfile/diskframe.html?sid='+top.sid,
			CABINET_URL : '/m2012/html/selectfile/cabinetframe.html?sid='+top.sid
		},
        fileSource: {//文件来源于彩云或者暂存柜
            DISK: "disk",
            CABINET: "cabinet"
        },
        callApi: M139.RichMail.API.call,
        initialize: function (options) {
        	// todo 迫不得已用了耦合代码
        	window.cabinetFileList = this.get('cabinetFileList');
        	window.diskFileList = this.get('diskFileList');
        	window.diskDir = this.get('diskDir');
            this.maxUploadLargeAttach = Math.floor(top.$User.getCapacity("maxannexsize") / 1024) || 4;
        },
        getCabinetFids : function(){
        	var self = this;
        	var fids = [];
        	var cabinetFileList = self.get('cabinetFileList');
        	for(var i = 0,len = cabinetFileList.length;i < len;i++){
        		fids.push(cabinetFileList[i].fid);
        	}
        	return fids;
        },
        getDiskFids : function(){
        	var self = this;
        	var fids = [];
        	var diskFileList = self.get('diskFileList');
        	for(var i = 0,len = diskFileList.length;i < len;i++){
        		fids.push(diskFileList[i].id+'');
        	}
        	return fids;
        },
        /*
         * 遍历数组，存在某项则删除，不存在则添加
         * @param {Object} obj 文件对象/是否全选及文件列表{fileSource: disk/cabinet, isAllChecked: true/false, dataSource: [file]}
         */
		toggleSelectedFiles: function (obj) {
            if (!obj) return;

            var self = this;
            var checked = obj.isAllChecked;
            var fileSource = obj.fileSource;

            if (checked != undefined) {//全选/反选
                if (fileSource == self.fileSource["DISK"]) {
                    self.set('diskFileList', checked ? obj.dataSource : []);
                } else {
                    self.set('cabinetFileList', checked ? obj.dataSource : []);
                }
                return;
            }

            //单选文件
            var selectedFiles = obj.fileSource == self.fileSource["DISK"] ? self.get('diskFileList') : self.get('cabinetFileList');
            var currentFile = obj.dataSource[0];
            for(var i = 0, len = selectedFiles.length; i < len; i++){
                var fileItem = selectedFiles[i];
                if (currentFile.fid === fileItem.fid) {
                    selectedFiles.splice(i, 1);
                    return;
                }
            }
            selectedFiles.push(currentFile);
		},
        // 遍历数组，存在某项则删除，不存在则添加
		toggleDiskFiles : function(file){
			if(!file){
				return;
			}
			var self = this;
			var diskFiles = self.get('diskFileList');
			for(var i = 0,len = diskFiles.length;i < len;i++){
				var diskFile = diskFiles[i];
				if(file.id === diskFile.id){
					diskFiles.splice(i, 1);
					return;
				}
			}
			diskFiles.push(file);
		},
		// 为文件列表中的每一个文件对象添加额外属性标识文件来源:本地，暂存柜，彩云
		setComeFrom : function(files, comeFrom){
			if(!$.isArray(files)){
				return files;
			}
			for(var i = 0,len = files.length;i < len;i++){
				var file = files[i];
				file.comeFrom = comeFrom;
			}
		}
    }));
})(jQuery, Backbone, _, M139);

(function(jQuery, Backbone, _, M139) {
    var $ = jQuery;
	var superClass = M139.View.ViewBase;
    M139.namespace("M2012.UI.SelectFile.View.UploadFileList", superClass.extend(
    {
        el: "#attachList",

        templete: ['<div data-size="{realFileSize}" class="attaListLi item-upload UploadItem" clienttaskno="{clientTaskno}">',
					 	'<i class="i-file-smalIcion i-f-{expandName}" style="float: left;margin-left: 14px;margin-top: 4px;"></i>',
					 	'<div class="attaListLiText">',
							'<em class="attaListLi_box">',
								'<span class="attaListLi_info" title="{fileName}">{fileName}</span>',
								'<span class="attaListLi_pic"><span class="gray">.{expandName}</span><span class="gray">(0/{fileSize})</span></span>',
							'</em>',
					 	//	'<p>',
					 	//	        '{fileName}<span class="gray">.{expandName}</span><span class="item-file-size gray">(0/{fileSize})</span>',
					 	//	'</p>',
					 		'<div class="attachment1 loadTipsLeft">',
					 			'<span class="progressBarDiv"> <span class="progressBar"></span> <span class="progressBarCur"> <span style="width: 0;"></span> </span> </span> {ratioSend}',
					 		'</div>',
					 	'</div>',
					 	'<div class="attaListLiText2">',
					 		'<a class="btn-pause" href="javascript:void(0)">暂停</a>',
					 	'</div>',
					 '</div>'].join(""),
	
	    fileSizeLimitTmplete : [ '<div class="">',
								     '<i class="i_warn_min"></i>',
								     '<span class="red">文件超过100M，无法上传。</span><span class="gray" style="display: none;">使用139小工具，上传更大文件。</span>',
								 '</div>'].join(""),
	
	    errUploadTemplete : [ '<div class="">',
							     '<i class="i_warn_min"></i>',
							     '<span class="red">上传失败。</span><span class="gray" style="display: none;">使用139小工具，上传更大文件。</span>',
							 '</div>'].join(""),
		
	    progressBarTemplete : ['<span class="progressBarDiv">',
						            '<span class="progressBar"></span>',
						            '<span class="progressBarCur">',
						                '<span style="width: 0;"></span>',
						            '</span>',
						        '</span>',
						        '<span data-size="{realFileSize}" class="state-upload gray"> 等待中({fileSize})</span>'].join(""),

        stateUploadTemplete: '<span style="display: inline-block;width: 80px;">{speed}</span>&nbsp;&nbsp;{surplusTime}',

        md5LoadingTemplete : ['<img class="mr_5" style="vertical-align:middle;" src="../../images/global/load.gif">',
	        				 '<span class="gray">正在扫描本地文件</span>'].join(""),

        md5LoadingPercentTemplete: ['<img class="mt_5" src="../../images/global/load.gif">',
            '<span class="pt_5 gray">{md5Percent}正在扫描本地文件</span>'].join(""),

	    commandTemplate : '<a class="btn-{cssPath}" command="{command}" clienttaskno="{clientTaskno}" href="javascript:void(0)">{text}</a>',
	    
	    lineTemplate : '<span class="line">|</span>',
	    
	    commandTypes : {
	    	DELETE_FILE : 'deleteFile',
	    	PAUSE_UPLOAD : 'pauseUpload',
	    	CONTINUE_UPLOAD : 'continueUpload',
	    	SETUP_CONTROLER : 'setupControler'
	    },
	    
	    commands : {
	    	deleteFile : {cssPath : 'delete', command : 'deleteFile', text : '删除', clientTaskno : ''},
	    	pauseUpload : {cssPath : 'pause', command : 'pauseUpload', text : '暂停', clientTaskno : ''},
	    	continueUpload : {cssPath : 'continue', command : 'continueUpload', text : '续传', clientTaskno : ''},
	    	setupControler : {cssPath : 'setup', command : 'setupControler', text : '', clientTaskno : ''}
	    },		 
	
	    initialize: function(options){
	        this.controler = options.controler;
	        this.model = options.model;
	        this.selector = options.selector;
	        return superClass.prototype.initialize.apply(this, arguments);
	    },
	
	    render: function(options) {
	        this.initEvents();
	    },
	    
	    initEvents: function(){
	        var self = this;
	
	        //监听model层数据变化
	        this.model.on("renderList", function (options) {
	            self.renderList(options);
	        });
	        this.model.on("getFileMd5", function (options) {
	            self.getFileMd5(options);
	        });
	        this.model.on("loadstart", function (options) {
	            self.loadstart(options);
	        });
	        this.model.on("progress", function (options) {
	            self.progress(options);
	        });
            this.model.on("md5Progress", function (options) {
                self.md5Progress(options);
            });
	        this.model.on("complete", function (options) {
	            self.complete(options);
	        });
	        this.model.on("cancel", function (options) {
	            self.cancel(options);
	        });
	        this.model.on("error", function (options) {
	            self.error(options);
	        });
            this.model.on('autoSaveDisk',function(){
				self.isHasMy139(function(){
			        //var currentFile = self.model.get("currentFile");
					//console.log(currentFile)
				});
            })
	        self.bindCommandEvent();
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
        saveToDisk : function(){
	        var self = this;
	        //var tipMsg = "已后台保存，稍后查看";
			//top.M139.UI.TipMessage.show(tipMsg,{delay : 5000}); 
	        self.model.saveToDisk(function(response){
                if (response.responseData && response.responseData.code == "S_OK") {
						BH({key:'diskv2_cabinet_auto_savesuc'});                	
	                    
                    //if (This.options.comeFrom !== 'fileCenter' || top.Links !=="undefined") {// 文件提取中心是独立的页面，没办法打开彩云
                        //tipMsg += "，<a href='javascript:;' onclick='top.Links.show(\"diskDev\",\"&id={0}\",true);top.FF.close();return false;'>去查看</a>";
                    //}
                    //var tipMsgStr = tipMsg.format(dirId);
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
	    // 事件委托绑定command事件
	    bindCommandEvent : function(){
	        var self = this;
	        var jContainer = self.getContainer();
	        jContainer.click(function(event) {
	            var target = event.target;
	            var tagName = target.tagName.toLowerCase();
	            var command = target.getAttribute('command');
	            if (tagName == "a" && command) {
	            	var clienttaskno = target.getAttribute('clienttaskno');
	                self.doCommand({
	                    command: command,
	                    clientTaskno: clienttaskno
	                });
	            }
	        });
	    },
	    
	    getContainer: function(){
	        return $(this.selector);
	    },
	    
	    doCommand : function(args){
	    	var self = this;
	    	var command = args.command;
	    	var clientTaskno = args.clientTaskno;
	    	var commandTypes = self.commandTypes;
	    	switch(command) {
	            case commandTypes['DELETE_FILE']:
	                self.deleteFile(clientTaskno);
	                break;
	            case commandTypes['PAUSE_UPLOAD']:
	                self.pauseUpload(clientTaskno);
	                break;
	            case commandTypes['CONTINUE_UPLOAD']:
	                self.continueUpload(clientTaskno);
	                break;
	            case commandTypes['SETUP_CONTROLER']:
	                self.setupControler();
	                break;
	            default : 
	            	console.log('系统不支持该命令！command:'+command);
	        }
	    },
	    deleteFile : function(clientTaskno){
	    	var self = this;
	    	var currentItem = self.model.fileListEle[clientTaskno];
	    	currentItem.remove();
	    	
	    	// 将该文件从文件列表中删除 
	    	self.model.delFileUploadSuc(clientTaskno);
	    },
	    pauseUpload : function(clientTaskno){
	    	var self = this;
	    	var currentItem = self.model.fileListEle[clientTaskno];
	    	var commandsHtml = self.getCommandsHtml([self.commandTypes['CONTINUE_UPLOAD']], clientTaskno);
	        currentItem.find(".attaListLiText2").html(commandsHtml);
            self.model.set("isStop", true);
            self.controler.onabort(clientTaskno);

            currentItem.attr("data-status", "stop");
	    },
	    continueUpload : function(clientTaskno){
	    	var self = this;
	    	var currentItem = self.model.fileListEle[clientTaskno];
	        var commandsHtml = self.getCommandsHtml([self.commandTypes['PAUSE_UPLOAD']], clientTaskno);
	        currentItem.find(".attaListLiText2").html(commandsHtml);
			self.controler.uploadHandle(self.errorHandle, null, clientTaskno);
	    },
	    setupControler : function(){
	    	top.Utils.openControlDownload();
	    },
	    renderList: function (options) {
	        var self = this;
	        var fileList = options.fileList;
	        var div = $("<div id=\"div_scrollcontainer\" style=\"overflow-x:hidden;overflow-y:auto;height:321px\"></div>");
	        for (var i = 0, len = fileList.length; i < len; i++) {
	            var file = fileList[i];

                if (file.state != 0) {
                    var $item = $(top.M139.Text.Utils.format(this.templete, {
                        fileName: $T.Html.encode(self.model.getFullName(file.name)),
                        expandName: self.model.getExtendName(file.name),
                        fileSize: top.M139.Text.Utils.getFileSizeText(file.size),
                        realFileSize: file.size,
                        clientTaskno: file.clientTaskno
                    }));

                    div.append($item);

                    this.model.fileListEle[file.clientTaskno] = $item; 
                    this.model.set("needUploadFileNum", this.model.get("needUploadFileNum") + 1);
                }
	        }
	        if ($("#div_scrollcontainer").length == 0) {
	            self.getContainer().append(div);
	        } else {
	            $("#div_scrollcontainer").append(div.children());
	        }
	        
            self.el.scrollTop = 0;
	    },
	
	    getFileMd5: function () {
	        var self = this,
	            currentFile = this.model.get("currentFile"),
	            clientTaskno = currentFile.clientTaskno,
	            currentItem = this.model.fileListEle[clientTaskno];
	
	        currentItem.find(".attachment1").html(this.md5LoadingTemplete);
	    },
	
	    loadstart: function () {
	        var self = this,
	            currentFile = this.model.get("currentFile"),
	            clientTaskno = currentFile.clientTaskno,
	            currentItem = this.model.fileListEle[clientTaskno];
	
	        var progressBarHtml = top.M139.Text.Utils.format(this.progressBarTemplete, {
	            fileSize: top.M139.Text.Utils.getFileSizeText(currentFile.size),
	            realFileSize: currentFile.size
	        });
	        currentItem.find(".attachment1").html(progressBarHtml);
			
			var commandsHtml = self.getCommandsHtml([self.commandTypes['PAUSE_UPLOAD']], clientTaskno);
	        currentItem.find(".attaListLiText2").html(commandsHtml);
	    },
	
	    progress: function () {
	    	var self = this;
	    	
	    	var currentFile = this.model.get("currentFile");
	        var ratioSend = Math.round(currentFile.sendSize / currentFile.totalSize * 100) + "%";
	        var currentItem = this.model.fileListEle[currentFile.clientTaskno];
	        
	        var fileSizeStr = '(' + $T.Utils.getFileSizeText(currentFile.sendSize) + '/' + $T.Utils.getFileSizeText(currentFile.totalSize) + ')';
			currentItem.find(".item-file-size").html(fileSizeStr);
	        currentItem.find(".progressBarCur span").css({width: ratioSend});//上传进度显示
            currentItem.find(".state-upload").html(top.M139.Text.Utils.format(this.stateUploadTemplete, {
                speed: currentFile.speed,
                surplusTime: currentFile.surplusTime
            }));

	        if(!this.model.isShowPause){
	        	var commandsHtml = self.getCommandsHtml([self.commandTypes['PAUSE_UPLOAD']], currentFile.clientTaskno);
	        	currentItem.find(".attaListLiText2").html(commandsHtml);
	        	this.model.isShowPause = true;
	        }

	        currentItem.attr("data-status", "progress");
	        currentItem.attr("data-sendSize", currentFile.sendSize);
	    },

        md5Progress: function(){
            var currentFile = this.model.get("currentFile");
            var currentItem = this.model.fileListEle[currentFile.clientTaskno];

            currentItem.find(".attachment1").html(top.M139.Text.Utils.format(this.md5LoadingPercentTemplete, {
                md5Percent: currentFile.md5Percent
            }));

            currentItem.attr("data-status", "progress");
            currentItem.attr("data-sendSize", 0);
        },
	
	    complete: function () {
	    	var self = this;
	    	var currentFile = this.model.get("currentFile");//当前上传文件信息
	        var clientTaskno = currentFile.clientTaskno;
	        var currentItem = this.model.fileListEle[clientTaskno];
	        var currentFileSize = currentFile.size;
	        var currentFileNameOrigin = currentFile.name;
	        var currentFileBusinessId = currentFile.businessId;
	        var currentFileName = this.model.getFullName(currentFileNameOrigin);
	
			var fileSizeStr = '(' + $T.Utils.getFileSizeText(currentFileSize) + ')';
			currentItem.find(".item-file-size").html(fileSizeStr);
			
	        currentItem.find(".state-upload").html("成功");
	        currentItem.find(".progressBarCur span").css({"width": "100%"}); //单副本上传控件进度条显示
	        currentItem.find(".attachment1").show();
			var currentFileNameOriginArr = currentFileNameOrigin.split("."); currentFileNameOriginArr.pop();
			var currentFileNameOriginWithoutExt = currentFileNameOriginArr.join(".");
			currentItem.find(".attaListLi_info").html($T.Html.encode(currentFileNameOriginWithoutExt)).attr("title",currentFileNameOrigin);
			currentItem.find(".attaListLi_pic .gray").eq(1).text("("+top.M139.Text.Utils.getFileSizeText(currentFileSize)+")");
			var successHtml = '<span class="c_009900">上传成功</span>';
	        setTimeout(function(){
	            currentItem.find(".attachment1").html(successHtml);
	        }, 1000);
	        
	        var commandsHtml = self.getCommandsHtml([self.commandTypes['DELETE_FILE']], clientTaskno);
	        currentItem.find(".attaListLiText2").html(commandsHtml);

	        this.completeModelHandle();

	        currentItem.attr("data-status", "complete");
	        currentItem.attr("data-size", currentFile.size);
	    },
	
	    cancel: function(){
	
	    },
	
	    error: function () {
	        var self = this;
	        var currentFile = this.model.get("currentFile");
	        var clientTaskno = currentFile.clientTaskno;
	        var controler = this.controler;
	        var currentItem = this.model.fileListEle[clientTaskno];
	        var progressBarHtml = top.M139.Text.Utils.format(this.progressBarTemplete, {
	            fileSize: top.M139.Text.Utils.getFileSizeText(currentFile)
	        });
	
	        currentItem.find(".attachment1").html(this.errUploadTemplete);
	        
	        var commandsHtml = self.getCommandsHtml([self.commandTypes['SETUP_CONTROLER'], self.commandTypes['DELETE_FILE']], clientTaskno);
	        currentItem.find(".attaListLiText2").html(commandsHtml);
	        
	        currentItem.find("a[name='againUpload']").click(function(){//重传
                $(this).parent().html(progressBarHtml);//插入进度条dom

                controler.uploadHandle(function(){
                    self.errorHandle(clientTaskno);
                });
            })
            .end().find("a[name='deleteEle']").click(function(){//删除文件
                currentItem.remove();
            });

	        this.completeModelHandle();

	        currentItem.attr("data-status", "error");
	    },

        completeModelHandle: function(){
            this.model.set("uploadedFileNum", this.model.get("uploadedFileNum") + 1);
        },

	    // 根据命令名称返回html片段
	    getCommandsHtml : function(commands, clientTaskno){
	    	if(!commands && !$.isArray(commands)){
	    		console.log('getCommandsHtml 参数必须为数组！commands :'+commands);
	    		return;
	    	}
	    	var self = this;
	    	var html = [];
	    	var len = commands.length;
	    	for(var i = 0;i < len;i++){
	    		var commandType = commands[i];
	    		self.commands[commandType].clientTaskno = clientTaskno;
	    		html.push($T.Utils.format(self.commandTemplate, self.commands[commandType]));
	    		if(i !== len - 1 && commandType != 'setupControler'){
	    			html.push(self.lineTemplate);
	    		}
	    	}
	    	return html.join('');
	    }
    }));
})(jQuery, Backbone, _, M139);
/**
 * @fileOverview 超大附件主视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.UI.SelectFile.View.Main', superClass.extend(
	/**
	 *@lends M2012.UI.Dialog.SelectFile.View
	 */
	{
		el : "body",
		name : "M2012.UI.Dialog.SelectFile.View",
        fileListTemplate : '<iframe frameborder="0" scrolling="no" style="width:{width};border:0;height:{height};display:block" src="{url}" id="{id}"></iframe>',
		events:{
			"click #localFile" : "showLocalFile",
			"click #disk" : "showDisk",
			"click #cabinet" : "showCabinet",
			"click #confirm" : "confirm",
			"click #cancel" : "cancel"
		},
		initialize : function(options) {
			this.model = options.model;
			var self = this;
			self.setAutoSend();
			$("#ckb_12_auto,#ckb_12").click(function(){
				var isUploading = false;
				var tmpA = self.getFileListFromView();
				for(var i = 0; i < tmpA.length; i++){
					if(tmpA[i].state != "complete"){
						isUploading = true;
						break;
					}
				}
				if(isUploading){
					self.setAutoSend();
				}
				$("#uploadFileInput").change(function(){
					self.setAutoSend();
				});
			});
			this.showMealInfo();
			return superClass.prototype.initialize.apply(this, arguments);
		},
		setAutoSend: function(){
			var self = this;
			if($("#ckb_12_auto").attr("checked")){
					var flag = true;
					var j = 0;
					var timer = setInterval(function () {
						if (!flag) {
							clearInterval(timer);
						} else {
							var files = self.getFileListFromView();
							for(var i = 0; i< files.length; i++){
								var file = files[i];
								if(file.state == "complete"){
									j++; 
								}
							}
							if(j == files.length && j != 0){
								flag = false;
								top.autoSendMail = true;
								$("#confirm").click();
							}
						}
					}, 500);
			}
		},
	    getFileListFromView: function () {
            var result = [];
			debugger;
            var items = $("#attachList .UploadItem");
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                result.push({
                    state: $(item).attr("data-status"),
                    size: $(item).attr("data-size") * 1,
                    sendSize: $(item).attr("data-sendSize") * 1
                });
            }
            return result;
        },
		showMealInfo : function(){
			var mealInfo = top.$App.getConfig('mealInfo');
			var serviceItem = mealInfo && mealInfo.serviceItem;
			//广东用户免费版兼容
			if(serviceItem == "0010"){
				serviceItem = "0015";
			}
			var currentServie = mealInfo[serviceItem];
			var attachSize = currentServie["attachSize"];
			var largeattachExpire = currentServie["largeattachExpire"];
			if(serviceItem && attachSize && largeattachExpire){
				$("#mealinfo").text("最大上传"+ attachSize +"文件，将保存到暂存柜，"+ largeattachExpire +"后过期。");
			}
		},
		initEvents : function(){
        	var self = this;
        	self.model.on("change:viewType", function(){
        		var viewType = self.model.get('viewType');
        		if(viewType === self.model.viewTypes['LOCAL_FILE']){
        			self.switchLocalFileView();
        		}
    			self.rebuildDialog();
		    });
		    self.model.on("change:localFileType", function(){
		    	self.switchLocalFileView();
		    	self.rebuildDialog();
		    });
		    
		    // todo 打开用户上次打开的目录，并选中用户上传选中的文件
		    top.$App.off('selectNetdiskFiles');
        	top.$App.on('selectNetdiskFiles', function(){
	    		var selectedFids = self.model.getDiskFids();
	    		
	    		// 该事件在  m2012.compose.view.netdisk.js 中绑定
	    		if(top && top.$App){
	    			top.$App.trigger('reselectNetdiskFiles', {diskDir : self.model.get('diskDir'), selectedFids : selectedFids});
	    		}
	    	});
	    	
	    	top.$App.off('toggleDiskFiles');
	    	top.$App.on('toggleDiskFiles', function(file){
	    		self.model.toggleDiskFiles(file);
	    		window.diskFileList = self.model.get('diskFileList');
	    	});
	    	
	    	top.$App.off('toggleDiskDir');
	    	top.$App.on('toggleDiskDir', function(dir){
	    		self.model.set('diskDir', dir);
	    		window.diskDir = self.model.get('diskDir');
	    		
	    		self.model.get('diskFileList').length = 0;
	    	});
	    	
	    	// 选中用户上次选中的文件
        	top.$App.on('selectStoragecabinetFiles', function(){
	    		var selectedFids = self.model.getCabinetFids();
	    		if(selectedFids.length == 0){
	    			return;
	    		}
	    		
	    		// 该事件在  m2012.compose.view.storagecabinet.js 中绑定
	    		if(top && top.$App){
	    			top.$App.trigger('reselectStoragecabinetFiles', {selectedFids : selectedFids});
	    		}
	    	});
			$("#formCab").click(function(event){
				top.BH("compose_largeattach_cabinet");
        	    self.showCabineDialog();
				top.selectFileDialog001.close();
        	    return false;
        	});
        },
        
        // 调整选择文件弹出层
        rebuildDialog : function(){
        	var height = $(document.body).height();
    		top.$App.trigger('rebuildSelectFileDialog', {height : height, display : 'block'});
        },
		render : function (){
		    var self = this;
		    self.model.set('localFileType', self.model.localFileTypes['LOCAL_FILE_DEFAULT']);
		    //self.model.set('viewType', self.model.viewTypes['LOCAL_FILE']);
            this.$el.find(".textgray").text(this.model.tipWords["UPLOAD_LARGEATTACH"].format(this.model.maxUploadLargeAttach));
		},
        showLocalFile : function(event) {
        	var self = this;
        	$("#localFile").addClass('on').siblings().removeClass('on');
        	var container = $("#localFileContainer");
        	$("#filesContainer").hide();
        	container.show();
        	
        	self.model.set('viewType', self.model.viewTypes['LOCAL_FILE']);
        	self.switchLocalFileView();
		},
		switchLocalFileView : function(){
			var self = this;
			var localFileType = self.model.get('localFileType');
			var localFileTypes = self.model.localFileTypes;
        	if(localFileType === localFileTypes['LOCAL_FILE_DEFAULT']){
        		
	    		// 为‘添加文件’创建上传组件 ，仅初始化一次
	    		if(!self.model.isCreateBtnUpload){
	    			try{
	    				self.createBtnUpload();
	    				self.model.isCreateBtnUpload = true;
	    			}catch(ex){
	    				console.log('上传组件初始化报错！switchLocalFileView:'+ex);
	    			}
	    		}
	    		
	    		cloneJUploadToMiddle();
    		}
    		if(localFileType === localFileTypes['LOCAL_FILE_LIST']){
    			cloneJUploadToTop();
    		};
    		// 将上传组件克隆到中间
    		function cloneJUploadToMiddle(){
    			var jMiddleUpload = $("#attachList > .addFilesTips");
	    		var jMiddleUploadInput = jMiddleUpload.find('#uploadFileInput');
	    		if(jMiddleUploadInput.size() === 0){
	    			var jUpload = $("#localFileContainer div.topBtn").eq(0).contents();
	    			jUpload.appendTo("#attachList > .addFilesTips");
	    			$("#localFileContainer div.floatLoadDivTop").attr('class', 'floatLoadDiv');
	    			$("#localFileContainer div.topBtn").removeClass('topBtnOn');
	    		}
	    		
	    		$("#localFileContainer div.topBtn").hide();
	    		jMiddleUpload.show().siblings('.attaListLi').hide();
    		};
    		// 将上传组件克隆到顶部
    		function cloneJUploadToTop(){
			/*
    			var jTopUpload = $("#localFileContainer div.topBtn");
    			var jTopUploadInput = jTopUpload.find('#uploadFileInput');
    			if(jTopUploadInput.size() === 0){
    				var jUpload = $("#attachList > .addFilesTips").contents();
	    			jUpload.appendTo("#localFileContainer div.topBtn");
	    			$("#localFileContainer div.floatLoadDiv").attr('class', 'floatLoadDivTop');
	    			$("#localFileContainer div.topBtn").addClass('topBtnOn');
    			}
    			
    			jTopUpload.show();
				$("#attachList > .addFilesTips").hide().siblings('.attaListLi').show();
			*/
				/*$("#floatLoadDiv").css({
					"margin-top" : "-23px",
					"left" : "0px",
					"width" : "96px",
					"height" : "20px"
				}).appendTo("#goForBigAttachment");
				$("#flashplayer").width("99px");*/
    		};
		},
		showDisk : function(event) {
        	var self = this;
        	$("#disk").addClass('on').siblings().removeClass('on');
        	
        	var container = $("#filesContainer");
        	var width = container.css('width');
        	var html = $T.Utils.format(self.fileListTemplate, {width : width, height : '345px', url : self.model.urls['DISK_URL'], id : 'diskFiles'});
        	container.html(html);
        	$("#localFileContainer").hide();
        	container.show();
        	
        	// 隐藏暂存柜页面底部的确认按钮
        	// top.$App.trigger('hideNetdiskBtn');
        	
        	self.model.set('viewType', self.model.viewTypes['DISK']);
		},
		showCabinet : function(event) {
        	var self = this;
        	$("#cabinet").addClass('on').siblings().removeClass('on');
        	
        	var container = $("#filesContainer");
        	var width = container.css('width');
        	var html = $T.Utils.format(self.fileListTemplate, {width : width, height : '345px', url : self.model.urls['CABINET_URL'], id : 'cabinetFiles'});
        	container.html(html);
        	$("#localFileContainer").hide();
        	container.show();
        	
        	// 隐藏暂存柜页面底部的确认按钮
        	//top.$App.trigger('hideStoragecabinetBtn');
        	
        	self.model.set('viewType', self.model.viewTypes['CABINET']);
		},
		
		// 创建上传组件
		createBtnUpload : function(){
        	var self = this;
            var UploadModel = new M2012.Fileexpress.Cabinet.Model.Upload({type:"file"});

            self.UploadApp = new UploadFacade({
                btnUploadId: "uploadFileInput",//上传按钮dom元素的id
                fileNamePre: "filedata",
                model: UploadModel
            });
            var UploadApp = self.UploadApp;

            UploadApp.on("select", function (options) {
                var fileList = options.fileList;
				var uploadType = this.currentUploadType;
                if (this.model.filterFile(fileList, uploadType)) {
                    this.model.trigger("renderList", {fileList: fileList});
                    this.setFileList(fileList);

                    if (this.currentUploadType != this.uploadType.FLASH) {
                        self.model.set('localFileType', self.model.localFileTypes['LOCAL_FILE_LIST']);
                    }
                }
				$("#goForBigAttachment").show();
				self.model.set('localFileType',"localFileList");
				$("#attachList").height(321);
                //--------------重要提示，Flash元素不能够隐藏或dom转移，否则flash与js通讯失效。所以只能用css位移的方法挪移flash容器
				$("#boxForBigAttachment").hide();
                //$("#boxForBigAttachment").closest("div").hide();

				$("#goForBigAttachment").css("z-index", 1);
				$("#attachList").css("overflow", "visible");
				$(".addFilesTips").removeClass().css(
                    {
                        "position": "absolute",
                        "left": "10px", top: "-40px", width: "90px", height: "40px"
                    }
                )
				$("#floatLoadDiv").css({ "margin-top": "0px", left: "0px", "position": "absolute" });
				$("#flashplayer").width("99px");
                //--------------------------------------

				$("#ckb_12").show();
				BH("compose_largeattach_local");
				$(".boxIframeBtn.delmailTipsBtn").css("visibility","visible");
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
                var currentFile = this.model.get("currentFile");
                var clientTaskno = currentFile.clientTaskno;
                var responseText = currentFile.responseText;

                this.model.completeHandle(clientTaskno, responseText, function(){//上传成功
                    self.model.trigger("complete");
					/*if(top.$App.getConfig('DiskAttConf')['autoSaveToDisk'] == 0){ //读取是否自动存网盘配置
						UploadModel.trigger("autoSaveDisk");
					}
*/
                    self.uploadHandle(function(){//继续传下个文件
                        self.model.trigger("error");
                    }, function(){
                        self.model.trigger("getFileMd5");
                    });
                }, function(msg){//上传失败
                    self.model.trigger("error");
                }, self);
            });

            UploadApp.on("error", function(){
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
                }, clientTaskno);
            });

            self.uploadFileListView = new M2012.UI.SelectFile.View.UploadFileList({
                selector: "#attachList",
                controler: UploadApp,
                model: UploadModel
            });
            self.uploadFileListView.render();
        },
		confirm : function(){
			try{
				var self = this;
	    		self.model.set('localFileList', self.UploadApp.model.fileUploadSuc.concat());
	    		
	    		self.model.setComeFrom(self.model.get('localFileList'), self.model.viewTypes['LOCAL_FILE']);
	    		self.model.setComeFrom(self.model.get('diskFileList'), self.model.viewTypes['DISK']);
	    		self.model.setComeFrom(self.model.get('cabinetFileList'), self.model.viewTypes['CABINET']);
	    		
	    		var files = self.model.get('localFileList').concat(self.model.get('diskFileList')).concat(self.model.get('cabinetFileList'));
	    		top.$App.trigger('obtainSelectedFiles', files);
	    		
	    		if(self && self.model){
		    		self.model.get('localFileList').length=0;
	    			self.model.get('diskFileList').length = 0;
	    			self.model.get('cabinetFileList').length = 0;
	    		}
			}catch(ex){
				console.log('选择文件报错！confirm:'+ex);
			}
		},
		cancel : function(){
			var selectFileDialog = $(top.document).find("iframe[id^='compose']")[0].contentWindow.selectFileDialog;
			selectFileDialog.close();
		//	selectFileDialog.trigger("close",{silent: true});
		},
		//从暂存柜选择文件
		showCabineDialog : function(){
			var selectFileDialog3 = top.selectFileDialog3 = top.$Msg.open({
				dialogTitle: "添加超大附件",
				url: "selectfile/cabinet_write.html?sid=" + top.sid,
				width: 520,
				height: 415
			//	showMiniSize: true
			});
			selectFileDialog3.on('remove', function(){
			//	top.$App.off('obtainCabinetFiles');
			});
		}
	}));
})(jQuery, _, M139);

﻿/**
 * @fileOverview 定义选择文件组件
 */
(function(jQuery, Backbone, _, M139) {
	var $ = jQuery;
	var superClass = M139.PageApplication;
	M139.namespace("M2012.UI.SelectFile.Application", superClass.extend(
	/**@lends M2012.UI.SelectFile.Application.prototype*/
	{
		/**
		 *选择文件App对象
		 *@constructs M2012.UI.SelectFile.Application
		 *@extends M139.PageApplication
		 *@param {Object} options 初始化参数集
		 *@example
		 */
		initialize : function(options) {
			superClass.prototype.initialize.apply(this, arguments);
		},
		defaults : {
			/**@field*/
			name : "M2012.UI.SelectFile.Application"
		},
		/**主函数入口*/
		run : function() {
			selectFileModel = new M2012.UI.SelectFile.Model();
		    selectFileView = new M2012.UI.SelectFile.View.Main({model : selectFileModel});
		    selectFileView.initEvents();
			selectFileView.render();
		}
	}));
	$selectFileApp2 = new M2012.UI.SelectFile.Application();
	$selectFileApp2.run();
})(jQuery, Backbone, _, M139);

