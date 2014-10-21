var upload_module_multiThread = {
    init: function (isDocumentClosed) {
        MultiThreadUpload.create(isDocumentClosed);
        /*
        var realUploadButton = document.getElementById("realUploadButton");
        realUploadButton.onclick = function () {
            requestComposeId();
            var files = MultiThreadUpload.showDialog();
            addUploadType(files);
            uploadManager.uploadFile(files);
            return false;
        };
        */
        //截屏
        captureScreen = function () {
            if (uploadManager.isUploading()) {
            	top.$Msg.alert(ComposeMessages.PleaseUploadSoon,{
			        onclose:function(e){
			            //e.cancel = true;//撤销关闭
			        }
			    });
                //FF.alert(ComposeMessages.PleaseUploadSoon);
                return;
            }
            MultiThreadUpload.screenShot();
        }
        //向下兼容
        captureClipboard = function () {
        	if(window.loadCaptureTime && new Date()-window.loadCaptureTime<1000){
        		return ;
        	}
        	window.loadCaptureTime=new Date();
        	return checkAndUploadClipboardData();
        };
        //新的控件，截屏完成后要手动触发上传
        MultiThreadUpload.onScreenShot = function (file) {
            file.insertImage = true;
            file.uploadType = "multiThread";
            uploadManager.uploadFile(file);
            //top.addBehavior("成功插入截屏");
        };
        function checkAndUploadClipboardData() {
            var data = MultiThreadUpload.getClipboardData();
            //截屏后默认使用多线程上传
            var files = [];
            var isInlineImg = false;
            //有时候会存在截屏以后，剪贴板之前复制的文件还留着，所以只取一样
            if (data.copyFiles.length > 0) {   //复制文件 .jpg格式的也不作内联图片处理
                files = data.copyFiles;
            } else if (data.imageFiles.length > 0) {  //复制图片（从word，qq对话框等复制的图片）
                files = data.imageFiles;
                isInlineImg = true;
            } else if (data.htmlFiles.length > 0) {
                files = data.imageFiles;
            }
            if (files.length > 0) {
                //top.addBehavior("写信-粘贴附件");
                if (uploadManager.isUploading()) {
                	top.$Msg.alert(ComposeMessages.PleaseUploadSoon,{
				        onclose:function(e){
				            //e.cancel = true;//撤销关闭
				        }
				    });
                    //FF.alert(ComposeMessages.PleaseUploadSoon);
                    return;
            	}
            }else{// add by tkh files.length == 0表示复制的不是文件
            	return;
            }
            var replaceImage = data.html ? true : false;
            addUploadType(files);
            /*//如果粘贴的是图片
            if (files.length == 1) {
                addInsertImageFlag(files,replaceImage);
            } else if (files.length > 1) {
                var imageCount = 0;
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    if (utool.isImageFile(file.fileName)) imageCount++;
                }
                if (imageCount > 1) {
                    if (window.confirm("您粘贴的附件中有多张图片，上传后是否全部插入到正文中？")) {
                        addInsertImageFlag(files,replaceImage);
                    }
                }
            }*/
            //如果是内联图片
            if(isInlineImg){
                addInsertImageFlag(files,replaceImage);
            }
            uploadManager.uploadFile(files);

            if (files.length > 0){
            	if(data.html){
            		upload_module_multiThread.html=data.html;
            	}
           		return false; //取消默认得粘贴动作
            } 
        }
        function addUploadType(arr) {
            $(arr).each(function () { this.uploadType = "multiThread" });
        }
        function addInsertImageFlag(files,replaceImage) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (utool.isImageFile(file.fileName)) {
                    if(replaceImage){
                        file.replaceImage = true;
                    }else{
                        file.insertImage = true;
                    }
                }
            }
        }
    },
    upload: function (file) {
        //默认使用多线程上传
        /*
        var isMultiThreadUpload = true;
        if (top.SiteConfig.multiThreadUploadReleaseFlag == 0) {
        isMultiThreadUpload = false;
        } else if (top.SiteConfig.multiThreadUploadReleaseFlag == 1 && !top.UserData.IsTestUserNumber) {
        isMultiThreadUpload = false;
        }
        */
        var isMultiThreadUpload = false; //richmail 还不支持多线程
        if (isMultiThreadUpload) {
            MultiThreadUpload.upload(file);
        } else {
            MultiThreadUpload.commandUpload(file);
        }
    },
    cancel: function (file) {
        MultiThreadUpload.cancel(file);
    },
    isSupport: function () {
        if (navigator.userAgent.indexOf("Opera") > -1) {
            return false;
        }
        if (navigator.userAgent.indexOf("Opera") > -1) {
            return false;
        }
        if (window.ActiveXObject !== undefined) {
            try {
                var obj = new ActiveXObject("RIMail139ActiveX.InterfaceClass");
                var version = obj.Command("<param><command>common_getversion</command></param>");
                return true;
            } catch (e) {
                return false;
            }
        } else {
            var mimetype = navigator.mimeTypes && navigator.mimeTypes["application/x-richinfo-mail139activex"];
            if (mimetype && mimetype.enabledPlugin) {
                return true;
            }
        }
        return false;
    }
}
MultiThreadUpload = {
    create: function (isDocumentClosed) {
        var elemenetID = "mtUploader" + Math.random();
        if ($.browser.msie || $B.is.ie11) {
            var htmlCode = '<OBJECT style="display:none" width="0" height="0" id="' + elemenetID + '" CLASSID="CLSID:63A691E7-E028-4254-8BD5-BDFDB8EF6E66"></OBJECT>';
        } else {
            var htmlCode = '<div style="height:0;width:0;overflow:hidden;"><embed id="' + elemenetID + '" type="application/x-richinfo-mail139activex" height="0" width="0" hidden="true"></embed></div>';
        }
        if (upload_module.model.isFirefox) {
            $(htmlCode).appendTo(top.document.body);
        } else if (isDocumentClosed || (top && top.$App && top.$App.isReadSessionMail && top.$App.isReadSessionMail())) {// 兼容会话邮件写信页
            $(htmlCode).appendTo(document.body);
        } else {
            document.write(htmlCode);
        }
        if (upload_module.model.isFirefox) {
            var obj = top.document.getElementById(elemenetID);
        } else {
            var obj = document.getElementById(elemenetID);
        }
        this.control = obj;
    },
    doCommand: function (commandName, commandData) {
        var returnXml = this.control.Command(commandData);
        switch (commandName) {
            case "getopenfilename":
                {
                    return _getopenfilename();
                }
            case "getscreensnapshot":
                {
                    return _getscreensnapshot();
                }
            case "getlastscreensnapshot":
                {
                    //获得最后一次截屏的时间
                    return _getlastscreensnapshot();
                }
            case "getclipboardfiles":
                {
                    return _getclipboardfiles();
                }
            case "getversion":
                {
                    return _getversion();
                }
            case "upload":
                {
                    return _upload();
                }
            case "suspend":
                {
                    return _suspend();
                }
            case "continue":
                {
                    return _continue();
                }
            case "cancel":
                {
                    return _cancel();
                }
            case "getstatus":
                {
                    return _getstatus();
                }
            case "setbreakpointstorepoint":
                {
                    return _setbreakpointstorepoint();
                }
            case "commonupload":
                {
                    return _commonupload();
                }
        }
        function _commonupload() {
            return returnXml.indexOf("<result>0</result>") > 0;
        }
        function _getopenfilename() {
            var doc = $TextUtils.getXmlDoc(returnXml);
            var jDoc = $(doc);
            var files = [];
            jDoc.find("file").each(function () {
                var jObj = $(this);
                var item = {
                    filePath: jObj.find("name").text(),
                    fileSize: parseInt(jObj.find("size").text())
                };
                item.fileName = item.filePath;
                files.push(item);
            });
            return files;
        }
        function _getclipboardfiles() {
            var doc = $TextUtils.getXmlDoc(returnXml);
            var jDoc = $(doc);
            var result = {
                text: "",
                html: "",
                htmlFiles: "",
                imageFiles: [],
                copyFiles: [],
                otherFiles: []
            };
            result.text = jDoc.find("CF_TEXT").text();
            //result.html = jDoc.find("CF_HTML Fragment").text().decode();
            //result.html = M139.Text.Html.decode(jDoc.find("CF_HTML Fragment").text());
            result.html = jDoc.find("CF_HTML Fragment").text();
            jDoc.find("CF_HTML file").each(function () {
                var jObj = $(this);
                var item = {
                    filePath: jObj.find("name").text(),
                    fileSize: parseInt(jObj.find("size").text())
                };
                item.fileName = item.filePath;
                result.imageFiles.push(item);
            });
            jDoc.find("CF_BITMAP file").each(function () {
                var jObj = $(this);
                var item = {
                    filePath: jObj.find("name").text(),
                    fileSize: parseInt(jObj.find("size").text())
                };
                item.fileName = item.filePath;
                result.imageFiles.push(item);
            });
            jDoc.find("CF_HDROP file").each(function () {
                var jObj = $(this);
                var item = {
                    filePath: jObj.find("name").text(),
                    fileSize: parseInt(jObj.find("size").text())
                };
                item.fileName = item.filePath;
                result.copyFiles.push(item);
            });
            jDoc.find("CF_OTHERS file").each(function () {
                var jObj = $(this);
                var item = {
                    filePath: jObj.find("name").text(),
                    fileSize: parseInt(jObj.find("size").text())
                };
                item.fileName = item.filePath;
                result.otherFiles.push(item);
            });
            return result;
        }
        function _getlastscreensnapshot() {
            var doc = $TextUtils.getXmlDoc(returnXml);
            var jDoc = $(doc);
            var time = new Date(parseInt(jDoc.find("time").text()));
            var oprResult = parseInt(jDoc.find("oprResult").text());
            if (oprResult == 0) {
                var file = {
                    filePath: jDoc.find("name:eq(0)").text(),
                    fileSize: parseInt(jDoc.find("size:eq(0)").text())
                };
                file.fileName = file.filePath;
            }
            return {
                time: time,
                oprResult: oprResult,
                file: file
            };
        }
        function _getscreensnapshot() {
            return returnXml.indexOf("<result>0</result>") > 0;
        }
        function _getversion() {
            return parseInt(returnXml.replace(/\D+/g, ""));
        }
        function _upload() {
            return returnXml.indexOf("<result>0</result>") > 0;
        }
        function _suspend() {
            return returnXml.indexOf("<result>0</result>") > 0;
        }
        function _continue() {
            return returnXml.indexOf("<result>0</result>") > 0;
        }
        function _cancel() {
            return returnXml.indexOf("<result>0</result>") > 0;
        }
        function _setbreakpointstorepoint() {
            return returnXml.indexOf("<result>0</result>") > 0;
        }
        function _getstatus() {
            if (returnXml != "<return />") {
            	//top.Debug.write(returnXml);
            	// todo M139.Logger.debug(returnXml);
            }
            var doc = top.$TextUtils.getXmlDoc(returnXml);
            var jDoc = $(doc);
            var files = [];
            jDoc.find("file").each(function () {
                var file = $(this);
                var obj = {
                    taskId: file.find("taskId").text(),
                    fileName: file.find("fileName").text(),
                    status: file.find("status").text(),
                    attachId: file.find("attachId").text(),
                    totalSize: parseInt(file.find("totalSize").text()),
                    completedSize: parseInt(file.find("completedSize").text()),
                    transSpeed: parseInt(file.find("transSpeed").text()),
                    needTime: parseInt(file.find("needTime").text()),
                    stopReason: file.find("stopReason").text(),
                    errorCode: file.find("errorCode").text()
                };
                //普通上传
                if (returnXml.indexOf("<httpSvrPostResp>") != -1) {
                    obj.isCommonUpload = true;
                    var responseText = file.find("httpSvrPostResp").text();
                    var p = { responseText: responseText, fileName: utool.getFileNameByPath(obj.fileName) };
                    var result = utool.checkUploadResultWithResponseText(p);
                    if (result.success) {
                        obj.attachId = result.fileId;
                    }
                }
                files.push(obj);
            });
            return files;
        }
    },
    getClipboardData: function () {
        var command = "<param><command>localfile_getclipboardfiles</command></param>";
        var data = this.doCommand("getclipboardfiles", command);
        return data;
    },
    getVersion: function () {
        var command = "<param><command>getversion</command></param>";
        var version = this.doCommand("getversion", command);
        return version;
    },
    showDialog: function () {
        var command = "<param><command>localfile_getopenfilename</command><title>请选择要上传的文件</title><filter>*.*</filter></param>";
        var files = this.doCommand("getopenfilename", command);
        return files;
    },
    uploadFileCount: 0,
    //多线程上传(特殊协议)
    upload: function (file) {
        var command = "<param>\
            <command>attachupload_upload</command>\
            <taskId>{taskId}</taskId>\
            <svrUrl>{svrUrl}</svrUrl>\
            <sid>{sid}</sid>\
            <composeId>{composeId}</composeId>\
            <referer></referer>\
            <cookie>{cookie}</cookie>\
            <filePathName>{fileName}</filePathName>	\
            <size>{fileSize}</size>\
            </param>";
        var param = {
            svrUrl: "http://" + location.host + "/coremail/s",
            sid: upload_module.model.sid,
            composeId: upload_module.model.composeId,
            fileName: top.encodeXML(file.filePath),
            fileSize: file.fileSize,
            taskId: file.taskId,
            cookie: top.$T.Utils.format("Coremail={0}; Coremail.sid={1}", [$T.Cookie.get("Coremail"),$T.Cookie.get("Coremail.sid")])
        };
        command = top.$T.Utils.format(command, param);
        var success = this.doCommand("upload", command);
        if (success) {
            file.state = "uploading";
            file.updateUI();
            this.startWatching();
            this.uploadFileCount++;

            utool.logUpload(UploadLogs.MultiStart);
        } else {
            file.state = "error";
            uploadManager.removeFile(file);
        }
    },
    commandUpload: function (file) {
    	var isInlineImg = false;
		if(file.insertImage || file.replaceImage) { isInlineImg = true; }
        var command = "<param>\
            <command>attachupload_commonupload</command>\
            <taskId>{taskId}</taskId>\
            <svrUrl>{svrUrl}</svrUrl>\
            <cookie>{cookie}</cookie>\
            <filePathName>{fileName}</filePathName>\
            <size>{fileSize}</size>\
            </param>";
        var param = {
            //svrUrl: top.encodeXML(utool.getControlUploadUrl(isInlineImg)),
            //fileName: top.encodeXML(file.filePath),
            svrUrl: $T.Xml.encode(utool.getControlUploadUrl(isInlineImg)),
            fileName: $T.Xml.encode(file.filePath),
            fileSize: file.fileSize,
            taskId: file.taskId,
            cookie: top.$T.Utils.format("Coremail={0}; Coremail.sid={1}; aTestCookie=123", [$T.Cookie.get("Coremail"),$T.Cookie.get("Coremail.sid")])
        };
        command = top.$T.Utils.format(command, param);
        //top.Debug.write(command);
        var success = this.doCommand("commonupload", command);
        if (success) {
            file.state = "uploading";
            file.updateUI();
            this.startWatching();
            this.uploadFileCount++;
        } else {
            file.state = "error";
            uploadManager.removeFile(file);
        }
    },
    "continue": function (item) {
        var command = "<param><command>attachupload_continue</command><taskId>" + item.taskId + "</taskId></param>";
        var success = this.doCommand("continue", command);
        if (success) {
            //item.uploadFlag = MultiThreadUpload.UploadFlags.Uploading;
            //item.render();
            this.startWatching();
        }
        return success;
    },
    //截屏后要主动轮训是否有截屏操作
    startCheckClipBoard: function () {
        var This = this;
        var lastAction = This.getLastScreenShotAction();
        clearInterval(This.checkClipBoardTimer);
        This.checkClipBoardTimer = setInterval(function () {
            var result = This.getLastScreenShotAction();
            if (result.time.getTime() != lastAction.time.getTime()) {
                clearInterval(This.checkClipBoardTimer);
                if (result.oprResult == 0) {//0表示有截屏，否则表示用户取消
                    if (This.onScreenShot) This.onScreenShot(result.file);
                }
            }
        }, 1000);
    },
    getStatus: function () {
        var result = this.doCommand("getstatus", "<param><command>attachupload_getstatus</command></param>");
        return result;
    },
    stop: function (item) {
        if (item) {
            var command = "<param><command>attachupload_suspend</command><taskId>" + item.taskId + "</taskId></param>";
            var success = this.doCommand("suspend", command);
            if (success) {
                //item.uploadFlag = MultiThreadUpload.UploadFlags.Stop;
                //item.render();
            }
            return success;
        }
    },
    cancel: function (item) {
        if (item) {
            var command = "<param><command>attachupload_cancel</command><taskId>" + item.taskId + "</taskId></param>";
            var success = this.doCommand("cancel", command);
            var file = utool.getFileById(item.taskId);
            if (success && file) {
                if (this.uploadFileCount > 0) this.uploadFileCount--;
                uploadManager.removeFile(file);
            }
            utool.logUpload(UploadLogs.MultiCancel);
        }
    },
    //截屏
    screenShot: function () {
        var result = this.doCommand("getscreensnapshot", "<param><command>screensnapshot_getscreensnapshot</command></param>");
        if (result) this.startCheckClipBoard();
        return result;
    },
    //得到最后一次截屏操作的时间
    getLastScreenShotAction: function () {
        var result = this.doCommand("getlastscreensnapshot", "<param><command>screensnapshot_getlastscreensnapshot</command></param>");
        return result;
    },
    startWatching: function () {
    	//alert('startWatching startWatching!!');
        var This = this;
        if (!this.watchTimer) {
            this.watchTimer = setInterval(function () {
                try {
                    This.test();
                } catch (e) { }
            }, 300);
        }
    },
    stopWatching: function () {
        clearInterval(this.watchTimer);
        this.watchTimer = 0;
        top.Debug.write("stopWatching");
    },
    test: function () {////////////////////////////////代码走到这里
        var This = this;
        var files = This.getStatus();
        //console.log("getStatus:" + files.length);
        if (this.uploadFileCount == 0) {
            this.stopWatching();
        }
        for (var i = 0; i < files.length; i++) {
            var obj = files[i];
            //alert('taskId :::::'+obj.taskId);
            if (obj && obj.taskId) {
                var file = utool.getFileById(obj.taskId);
                if (!file) {
                    top.Debug.write("已经移除的taskId：" + obj.taskId);
                    return;
                }
                if (obj.status < 4) {
                    file.sendedSize = obj.completedSize;
                    file.uploadSpeed = obj.transSpeed;
                    file.needTime = obj.needTime;
                    file.progress = parseInt(((file.sendedSize / file.fileSize) || 0) * 100);
                    file.state = "uploading";
                    file.fileId = obj.attachId;
                    file.updateUI();
                } else {
                    if (obj.status == 4) {
                        if (obj.stopReason == 1) {
                            if (obj.isCommonUpload) {
                                if (obj.attachId) {
                                    file.state = "complete";
                                    file.fileId = obj.attachId;
                                    file.updateUI();
                                    if (file.insertImage) {
                                        // insertAttachImage(obj.attachId, obj.fileName);
                                        upload_module.model.active();// 激活写信页
                                        var imageUrl = upload_module.model.getAttachUrl(obj.attachId, obj.fileName, false);
                                        htmlEditorView.editorView.editor.insertImage(imageUrl);
                                    }else if(file.replaceImage){
                                        replaceAttachImage(obj.attachId, obj.fileName);
                                        /**
                                         * @modify by wn
                                         * 2014-7-30
                                         * 显示图片栏小工具
                                         */
                                        top.$App.showImgEditor( $(htmlEditorView.editorView.editor.editorDocument).find('body') );                  
                                    }
                                }
                            } else {
                                file.state = "complete";
                                file.fileId = obj.attachId;
                                file.updateUI();
                                if (file.insertImage) {
                                    //insertAttachImage(obj.attachId, obj.fileName);
                                    var imageUrl = upload_module.model.getAttachUrl(obj.attachId, obj.fileName, false);
                                    htmlEditorView.editorView.editor.insertImage(imageUrl);
                                }
                            }
                            utool.logUpload(UploadLogs.MultiSuccess);
                        } else if (obj.stopReason == 2) {
                            //fileInfo.uploadFlag = MultiThreadUpload.UploadFlags.Stop;
                            //fileInfo.render();
                        } else if (obj.stopReason == 3) {
                            //fileInfo.remove();
                        } else if (obj.stopReason == 0) {
                            //假停止
                            this.uploadFileCount++;
                        } else if (obj.stopReason == 4) {
                            if (obj.errorCode && /^(5|6|17|24)$/.test(obj.errorCode)) {
                                utool.logUpload(UploadLogs.MultiFail2, "errorCode=" + obj.errorCode);
                            } else {
                                utool.logUpload(UploadLogs.MultiFail1, "errorCode=" + obj.errorCode);
                            }
                        }
                    }
                    if (this.uploadFileCount > 0) this.uploadFileCount--;
                    if (obj.status == 4) uploadManager.autoUpload();
                    
                    if (obj.stopReason > 2) {
                        var errorLog = "multiThread upload fail,stopReason:{stopReason},fileName:{fileName},fileSize:{fileSize},sendedSize:{sendedSize}";
                        try {
                            errorLog = top.$T.Utils.format(errorLog, {
                                stopReason: obj.stopReason,
                                fileName: file.fileName,
                                fileSize: file.fileSize,
                                sendedSize: file.sendedSize
                            });
                            uploadManager.onUploadError(errorLog);
                        } catch (e) { }
                    }
                }
            }
        }
    }
}
//todo 这是老代码直接拷贝过来,从word复制内容粘贴兼容性处理
function replaceAttachImage(fileId, fileName) {
    if (upload_module_multiThread.html) { //图文混排
        var html = upload_module_multiThread.html
                   .replace(/\<\!\[if \!vml\]\>/ig, "")
                   .replace(/\<\!\[endif\]\>/ig, "")
                   .replace(/\<v:imagedata/ig,'<img'); //有些word图片会生成<v:imagedata，需替换成<img
        htmlEditorView.editorView.editor.insertHTML(html);
        upload_module_multiThread.html = "";//清空
    }
    var url = upload_module.model.getAttachUrl(fileId, fileName, true);
    htmlEditorView.editorView.editor.replaceImage(fileName, url);
}
/*
status – 任务状态。1：准备上传；2：开始上传；3：正在上传；4：停止上传。
totalSize – 要传文件的大小。status为2时有效。
completedSize – 已完成大小。status为2时有效。
transSpeed – 上传速度。单位是byte/s。status为2时有效。
needTime – 剩余时间。单位是s。status为2时有效。
stopReason – 停止原因。1：完成；2：暂停；3：取消；4：出错。status为3时有效。
errorCode – 失败码。1：网络错误；2：URL无效；3：内存不足…（待定）。status为4且stopReason为4时有效。
*/