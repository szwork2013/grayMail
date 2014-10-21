/*
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
