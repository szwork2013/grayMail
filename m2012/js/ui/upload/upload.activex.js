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
