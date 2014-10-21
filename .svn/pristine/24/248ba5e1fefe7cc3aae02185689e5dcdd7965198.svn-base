var upload_module_flash = {
    init: function() {
        //var url = "/m2012/flash/Richinfo_annex_upload.swf";
        var url = "/m2012/flash/muti_upload.swf?v="+Math.random();
        
        var so = new SWFObject(url, "flashplayer", "70", "20");
        so.addParam("wmode","transparent");
        so.write("#floatDiv");
        
        
        //增加检测flash是否正常运作的机制
        //3秒后如果flash不能正常运行，则弄成普通上传
        setTimeout(function () {
            if (!upload_module_flash.isRealOK) {
                var reset = false;
                try {
                    if (!document.getElementById("flashplayer").upload) {
                        reset = true;
                    }
                    UploadFacade.init();
                } catch (e) {
                    reset = true;
                }
                if (reset) resetCommonUpload();
            }
        }, 3000);
        function resetCommonUpload() {
           
            upload_module_common.init();
            $("#fromAttach").show();
            supportUploadType.isSupportFlashUpload = false;
            $T.Cookie.set({name : 'flashUploadDisabled',value : '1'});
            document.getElementById("flashplayer").style.display = "none";
        }
    },
    upload: function (taskId) {

        var file = utool.getFileById(taskId);
		var isLargeAttach = false;
        function startUpload() {
            UploadFacade.upload(taskId);
            if(isLargeAttach){
	           file.isLargeAttach =true; 
            }
            file.state = "uploading";
            file.updateUI();
        }
        if (file.taskId == window.firstTaskId) {  //第1个文件

            var isShow = UploadLargeAttach.isShowLargeAttach(file, 'flash',function () {
				if(UploadLargeAttach.isLargeAttach == true){
					isLargeAttach = true;
				}
				
                startUpload();
            });
            if (!isShow) { startUpload(); }

           
        } else {   //后面的文件直接上传，不再判断大小
            startUpload();

        }

        

        //utool.logUpload(UploadLogs.FlashStart);
    },
    cancel: function (file) {
        file.isCancel = true;
        //UploadLargeAttach.cancelForWaiting(file);
        var fileId= window.currentFileId
       
        window.currentFileId = null;
        window.currentSip = null;

        
        uploadManager.removeFile(file);
        uploadManager.autoUpload();
        try{
            UploadFacade.cancel(file.taskId);
        } catch (ex) { }
        /*
        var requestXml = {
            composeId: upload_module.model.composeId,
            items: [fileId]
        };
        window.setTimeout(function () { //加延时，等待后台执行完当前分块（后台没有修改之前的容错代码）
            upload_module.model.callApi("upload:deleteTasks", requestXml, function (result) {
                uploadManager.removeFile(file);
                uploadManager.autoUpload();
            });
        }, 2000);
        */
        //utool.logUpload(UploadLogs.FlashCancel);
    },
    isSupport: function() {
        //由于其它浏览器不发送Coremail Cookie 所以flash上传暂时只支持ie
        if (document.all && window.ActiveXObject !== undefined) {
            //用户曾经手动触发禁用flash上传
        	/*
            if (Utils.getCookie("flashUploadDisabled") == "1") {
                return false;
            } 
            */           
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
}
UploadFacade = {
    getFlashObj:function(){
        return document.getElementById("flashplayer");
    },
    init: function () {
        var uploadUrl = utool.getBlockUploadUrl("flash");
        console.log(uploadUrl);
        this.getFlashObj().setUploadUrl(uploadUrl);

        this.getFlashObj().setOptions({});
    },
    getUploadUrl: function () {
        if (UploadLargeAttach.enable) {//超大附件
            console.log("upload url:" + UploadLargeAttach.uploadUrl);
            return UploadLargeAttach.uploadUrl;
        }
        var result = utool.getBlockUploadUrl("flash");
        console.log("upload url2:" + result);
        return result;
    },
    onclick: function() {
        //upload_module.model.requestComposeId();
        if (!upload_module.model.composeId) {
            upload_module.model.composeId = Math.random();
        }
        
        return true;
    },
    _blockInfo:{},
    getBlockInfo:function(){
    
    },
    onrequest: function (args) {
        var result;
        if (UploadLargeAttach.enable) {
            result = UploadLargeAttach.postParams;
            //result["Filename"] = result["filename"];
            result["range"] = args.offset + "-" + (Number(args.offset) + (Number(args.length)-1)).toString();

        } else {

            result = {
                type: 1,
                //fileid: null,
                filesize: args.fileSize,
                timestamp: new Date().toDateString(),
                range: args.offset + "-" + (Number(args.offset) + Number(args.length)).toString()
                //sip:null
            }
            if (window.currentFileId) {
                result.fileid = window.currentFileId;
                result.sip = window.currentSip;
            }
        }


        return result;
    },
    onprogress:function(args){
        if (args.data.indexOf("middleret") > 0) {
            args.data = UploadLargeAttach.responseConvert(args.data);
        }
        var fileId = args.data.match(/["']fileId["']:["'](.+?)["']/)[1];
        var sip = args.data.match(/["']sip["']:["'](.+?)["']/)[1];
        if (!window.currentFileId) {    //同一个文件不重新赋值fileId，避免切换服务器时返回不同的fileId
            window.currentFileId = fileId;
        }
        window.currentSip = sip;
        //alert(args.percent);
        if (window.currentSip && !UploadLargeAttach.enable) { //重设上传url，增加sip参数提升服务端性能，需要排除超大附件上传
            var urlNew = utool.getBlockUploadUrl("flash") + "&sip=" + window.currentSip;
            this.getFlashObj().setUploadUrl(urlNew);
            //alert(urlNew);
        }

        var taskId = args.taskId;
        var file = utool.getFileById(taskId);
        if (!file) return;
        file.state = "uploading";
        file.sendedSize = args.bytesLoaded;
        file.uploadSpeed = args.speed;
        console.log("上传速度" + file.uploadSpeed);
        file.progress = args.percent;
        file.updateUI();
        
        if (file.uploadSpeed < 30000) {
            M139.Logger.sendClientLog({
                level: "INFO",
                name: "upload speed is too slow",
                errorMsg: "speed:" + file.uploadSpeed + "|filename:" + file.fileName
            });
        }
        if (this.retryCount > 0 && !this.retryLogSended) { //重试次数大于0，表示是上传重试恢复的，上报日志
            M139.Logger.sendClientLog({
                level: "INFO",
                name: "upload fail retry",
                errorMsg: "retry ok," +file.fileName
            });
            this.retryLogSended = true;
        }

        this.monitorTimeout(fileId, file);
        this.lastSendedTime = new Date();

    },
    monitorTimeout: function (fileId,file) { //监控1个分块上传时间超过20秒，认为网络问题，自动续传
        var self = this;
        if (this.timeoutId) { 
            window.clearTimeout(this.timeoutId);//作好清理
        }
        this.timeoutId = window.setTimeout(function () {
            var self = this;
            if (fileId != window.currentFileId || file.progress == 100) {
                return;
            } else {
                var msg = "上传超时,fileName:" + file.fileName +"|fileSize:"+file.fileSize+ "|progress:" + file.progress + "%";
                console.warn(msg);
                
                M139.Logger.sendClientLog({
                    level: "ERROR",
                    name: "request timeout",
                    errorMsg: msg
                });

                UploadFacade.getFlashObj().uploadResume();
            }
        },15000);  
    },

    oncomplete: function (args) {
        window.currentFileId = null;
        window.currentSip = null;
        if (args.data.indexOf("middleret") > 0) {
            args.data = UploadLargeAttach.responseConvert(args.data);
        }

        var file = utool.getFileById(args.taskId);
        var result = utool.checkUploadResultWithResponseText({ fileName: file.filePath, responseText: args.data });
        if (result.success) {
            file.state = "complete";
            file.fileId = result.fileId;
            file.updateUI();

            UploadLargeAttach.completeUpload(file);
            utool.logUpload(UploadLogs.FlashSuccess);
        } else {
            file.state = "error";
            //file.updateUI();
            //FF.alert("文件上传失败，请删除后重试！");
            top.$Msg.alert('文件上传失败，请删除后重试！', {
                onclose: function (e) {
                    //e.cancel = true;//撤销关闭
                }
            });
            utool.logUpload(UploadLogs.FlashFailInfo);
        }
        uploadManager.autoUpload();
    },
    onselect: function (args) {
        var list = [];
        for(var i=0;i<args.length;i++){
            var item = args[i];
            var obj = {
                taskId: item.taskId,
                idx:i,
                fileName: decodeURIComponent(item.fileName),
                fileSize: item.fileSize,
                state:item.status,
                uploadType: "flash"
            };
            if (item.fileSize > 0) {
                list.push(obj);
            } else {
                $Msg.alert("文件：\"" + decodeURIComponent(item.fileName) + "\"大小为0字节，请重新选择");
                return false;
            }
            
        }
        if (list.length > 0) {
            window.firstTaskId = list[0].taskId;
            var checkResult = uploadManager.uploadFile(list);
            if (checkResult == false) { 
                return false;
            }
        }
        /*
        var self = this;
        var isShow=UploadLargeAttach.isShowLargeAttach(args, function () {
            self.getFlashObj().upload(true);
        });
        

        if (!isShow) {
            this.getFlashObj().upload(false);
        }*/
    },
    onloadcomplete: function (args) {
        //alert("onloadcomplete");
        var self = this;
        var file = utool.getFileById(args.taskId);
        if (args.isLarge) {
            file.md5 = args.md5;
            UploadLargeAttach.prepareUpload(file, function (postParams) {
                self.getFlashObj().setUploadUrl(file.uploadUrl);
                self.getFlashObj().uploadRequest();
            });
        }
    },
    onerror: function (args) {
        //alert(args.taskId);
        var self = this;
        var file = utool.getFileById(args.taskId);
        
        if (file) {
            file.state = "blockerror";
            file.updateUI();
        }
        M139.Logger.sendClientLog({
            level: "ERROR",
            name: "I/O Error",
            errorMsg: "fileName:"+file.fileName+"|error:"+args.error
        });
        if (this.timeoutId) {
            window.clearTimeout(this.timeoutId);//清理掉超时监控，避免两个自动续传同时进行
        }
        if (this.retryCount <= 3) {
            setTimeout(function () {
                self.uploadResume();
            }, 5000);
        }
        /*var self = this;
        $Msg.confirm("上传中断，是否续传", function () {
            self.getFlashObj().uploadResume();
        });*/
    },
    uploadResume: function () {
        this.retryCount++;
        this.getFlashObj().uploadResume();
        M139.Logger.sendClientLog({
            level: "INFO",
            name: "upload fail retry",
            errorMsg: "time:" + new Date().toString() + "|retryCount:" + this.retryCount
        });
        BH("compose_upload_resume");
    },
    onmouseover: function () {
    },
    onmouseout: function () {
    },
    upload: function (taskId) {//第一个文件开始上传时调用
        this.retryCount = 0;
        this.lastSendedTime = new Date();
        var needMd5 = UploadLargeAttach.enable;
        this.getFlashObj().upload(needMd5);
        //var flash = document.getElementById("flashplayer");
        //flash.upload(taskId);
    },
    cancel: function (taskId) {
        this.getFlashObj().cancel(taskId);
        //var flash = document.getElementById("flashplayer");
        //flash.cancel(taskId);
    }
}
