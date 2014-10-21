var UploadManager = function() {
    this.init.apply(this, arguments);
}

var TaskID = 10000;

function noop(){}

UploadManager.prototype = {
    //同一时刻只会有一种上传方式正在上传
    init: function (c) {
        var This = this;
        this.currentUploadType = "none"; // "common|flash|screenshot|html5|mutil",
        this.fileList = [];
        this.container = c.container;
        this.jContainer = $(c.container);
        this.jContainer.click(function (e) {
            var target = e.target;
            if (target.tagName == "A" && target.getAttribute("command")) {
                var taskId = target.getAttribute("taskid");
                var fileId = target.getAttribute("fileid");
                var file = utool.getFileById(taskId || fileId);
                This.doCommand({
                    command: target.getAttribute("command"),
                    file: file,
                    imgUrl: target.getAttribute("imgUrl")
                });
                upload_module.model.autoSendMail = false;
            }
        });

        $("#uploadInput").on("click", function(){
	       setTimeout(function(){
		       $("#uploadInput").removeAttr("accept");
	       }, 200);
        });
        
        $("#floatDiv").click(function(e, fakeClick){
	        if(fakeClick !== "fakeClick") {	// 用户手动点击，移除影响
		        uploadManager.callback = null;
		        delete uploadManager.callback;
		        delete uploadManager.filterType;
	        }
        });
    },
    doCommand: function (param) {
        //DeleteFile|CancelUpload|RemoveWaiting
        switch (param.command) {
            case "RemoveFile":
            	this.removeFile(param.file);
            	param.file.isCancel = true;
                break;
            case "DeleteFile":
            	//if (this.isUploading()) { //删除已上传的文件会调用刷新接口，并中止当前上传的文件，需要调用cancel清除当前上传的文件引用
                if (param.file.state =="uploading") {
                    uploadManager.cancelUploading();//删除正在上传的文件
                } else {
                    upload_module.deleteFile(param);
                }
                break;
            case "CancelUpload":
                param.file.cancelUpload();
                uploadManager.autoUpload();
                break;
            case "ResumeUpload"://续传-flash，html5(ajax)
                this.uploadResume(param.file);
                //UploadFacade.uploadResume();//todo 耦合了，通过uploadManager中转调用
                break;
        }
    },
    isUploadAble: function () {
        //当前是否可以使用上传
        return !this.isUploading();
    },
    //添加上传任务
    uploadFile: function (param) {
        if (!$.isArray(param)) param = [param];
        var totalSize = 0;
        var notified = false;
        var flashSize = 1024*1024*100;//flash只支持100M
        for (var i = 0; i < param.length; i++) {
            var item = param[i];
            //截屏控件上传，无法预先判断文件是否重复
            if (item.uploadType != "screenShot" && utool.checkFileExist(item.fileName)) {
                if (!item.replaceImage && !item.insertImage) {
                    var fileNameExist = ComposeMessages.FileNameExist,
                		fileName = top.$T.Utils.htmlEncode(utool.getFileNameByPath(item.fileName));
                    var errorMsg = top.$T.Utils.format(fileNameExist, [fileName]);
                    // FF.alert(errorMsg);
                    top.$Msg.alert(errorMsg, {
                        isHtml: true,
                        onclose: function (e) {
                            //e.cancel = true;//撤销关闭
                        }
                    });
                    return false;
                }
            }
            if (item.uploadType == "multiThread" && item.fileSize == 0) {
                if (!item.replaceImage) {
                    var noFileSize = ComposeMessages.NoFileSize,
                		fileName = top.$T.Utils.htmlEncode(utool.getFileNameByPath(item.fileName));
                    var errorMsg = top.$T.Utils.format(noFileSize, [fileName]);
                    top.$Msg.alert(errorMsg, {
                        onclose: function (e) {
                            //e.cancel = true;//撤销关闭
                        }
                    });
                    // FF.alert(ComposeMessages.NoFileSize.format(utool.getFileNameByPath(item.fileName).encode()));
                    return false;
                }
            }
			if (item.uploadType == 'flash' &&item.fileSize >=flashSize){
	            uploadManager.removeFile(param);
				$("#aLargeAttach").click();
				return false;
			}

            if(!UploadLargeAttach.isLargeAttach){
	            if (item.fileSize) {
	                totalSize += item.fileSize;
	            }
            }
        }
        for (var i = 0; i < param.length; i++) {
            var item = param[i];
            var fileInfo = {};
            fileInfo.uploadType = item.uploadType; // "common|flash|screenshot|html5|mutil",
            fileInfo.fileName = item.fileName; //ie6 会把文件路径带过来
            fileInfo.fileSize = item.fileSize || 0; //普通上传可能不知道文件大小
            fileInfo.taskId = item.taskId || TaskID++; //普通上传就不用这个东西了
            fileInfo.fileObj = item.fileObj; //ajax
            fileInfo.insertImage = item.insertImage;
            fileInfo.replaceImage = item.replaceImage;
            fileInfo.isLargeAttach = item.isLargeAttach;
            if (fileInfo.uploadType == "common") {
                fileInfo.state = "uploading";
            } else {
                fileInfo.state = item.state;
            }
	    	var fileName = fileInfo.fileName.split(/[\\\/]/g).pop();
        	//upload_module.insertRichMediaFile(fileName);
            var file = new UploadFileItem(fileInfo);
            var rsource;
            if(this.filterType) {
	            file.filterType = this.filterType;
	            if(file.filterType.test(fileInfo.fileName) == false) {
		            if(!notified) {
			            notified = true;
			            rsource = file.filterType.source;
			            if(rsource.indexOf("docx") > 0) {
				            rsource = "doc(x), ppt(x), xls(x), pdf, txt";
			            } else if(rsource.indexOf("mp3") > 0) {
				            rsource = "mp3";
			            } else if(rsource.indexOf("mp4") > 0) {
				            rsource = "mp4, flv";
			            }
			            top.$Msg.alert("请选择" + rsource + "类型的文件。");
		            }
		            continue;
	            }
            }
            this.fileList.push(file);
        }
        if(this.filterType) {
	        delete this.filterType;	// 选择文件结束，必须立即删除标识
        }
        this.render({ type: "add" });
        var This = this;
        upload_module.model.requestComposeId(function () {
            This.autoUpload();
        });
    },
    removeFile: function (file) {
        var list = this.fileList;
        for (var i = 0; i < list.length; i++) {
            var f = list[i];
            if (f.taskId == file.taskId) {
                f.remove(function(removed) {
	                var attaches = upload_module.model.composeAttachs;
	                if(removed) {
                        list.splice(i, 1);
                        removeFromAttach(f.fileId);
                    }
                });
                break;
            }
        }
        this.render({ type: "remove" });
        //console.dir(compose_attachs);
    },
    //上传文件，每次只上传一个
    autoUpload: function () {
        //top.addBehavior("写信页-点击上传附件",11);
        var list = this.fileList;
        var isUploading = this.isUploading();
        if (!isUploading) {
            for (var i = 0; i < list.length; i++) {
                var file = list[i];
                if (file.state == "waiting") {
                    file.upload();
                    return true;
                }
            }
            //console.log("全部上传完成：");
            //console.log(list);
            if(typeof this.callback === "function") {
	            this.callback();
	            delete this.callback;
            }
            if (upload_module.model.autoSendMail) {//自动发送
                setTimeout(function () {
                    if (upload_module.model.autoSendMail) {
                        // btnSendOnClick();
                        $("#topSend").click();
                    }
                }, 2000);
            }
        }
        //var pageType = upload_module.model.get('pageType');

        BH({ key: "compose_commonattachsuc" });
        return false;
    },
    isUploading: function () {
        var list = this.fileList;
        for (var i = 0; i < list.length; i++) {
            var file = list[i];
            if (file.state == "uploading") return true;
        }
        return false;
    },
    //界面更新
    render: function (param) {
        if (param && param.type == "refresh") this.container.innerHTML = "";
        //根据文件项的状态更新他们的ui
        var list = this.fileList;
        var previewImg = [];
        UploadFileItem.prototype.previewImg = [];
        for (var i = 0; i < list.length; i++) {
            var f = list[i];
            if (f.insertImage || f.replaceImage) { //如果插入的是内联图片，则不生成附件列表
                f.updateUI();
            } else if (f.hasUI()) {
                f.updateUI();
            } else {
                this.container.appendChild(f.createUI(previewImg));
			//	this.container.insertBefore(f.createUI(previewImg),this.container.firstChild);
            }
        }
        //输出超大附件的列表
        renderLargeAttachList();

		var container = this.container;
        //this.container.style.display = (list.length > 0 || Arr_DiskAttach.length > 0) ? "" : "none";

		if(container.innerHTML != '') {
			$([container, container.parentNode]).show();
		} else {
			$([container, container.parentNode]).hide();
		}
		
		if(window.conversationPage && window.PageMid){
			param.len = list.length || 1;
			top.$App.trigger("conversationResize_" + window.PageMid, param);	
		}
    },
    //重新刷新所有附件状态
    refresh: function (callback) {
        var newList = this.fileList = [];
        var list;

        //添加普通附件
        list = utool.getAttachFiles();
        for (var i = 0; i < list.length; i++) {
            var fileInfo = list[i];
            var file = new UploadFileItem({
                type: "Common",
                fileName: fileInfo.fileName || fileInfo.name,
                fileId: fileInfo.id || fileInfo.fileId,
                fileSize: fileInfo.fileSize || fileInfo.size || 0,
                insertImage: fileInfo.insertImage,
                replaceImage: fileInfo.replaceImage,
                isComplete: (fileInfo.status === 0 || !fileInfo.hasOwnProperty("status")) ? true : false
            });
            newList.push(file);
        }
        //刷界面
        this.render({ type: "refresh" });
        if(typeof callback === "function") {
	        callback();
        }
    },
    onUploadError: function (msg) {
        top.SendScriptLog(msg);
    },
    cancelUploading: function () {
        for (var i = 0; i < this.fileList.length; i++) {
            var item = this.fileList[i];
            if (item.state == "uploading") {
                item.cancelUpload();
            }
        }
    },
    uploadResume: function(file){
        file.uploadResume();
    }
}
UploadFileItem = function() {
    this.init.apply(this, arguments);
}

UploadFileItem.prototype = {
    init: function (f) {
        this.uploadType = f.uploadType; //"common|flash|screenshot|html5|mutil"
        this.fileType = f.fileType || "common"; //disk|common
        this.filePath = f.fileName;
        this.fileName = utool.getFileNameByPath(f.fileName);
        this.fileSize = parseInt(f.fileSize);
        this.taskId = f.taskId || Math.random(); //未传完的附件的任务号
        this.fileId = f.fileId; //附件的id
        this.fileObj = f.fileObj; //ajax文件对象
        this.insertImage = f.insertImage;
        this.replaceImage = f.replaceImage;
        this.isLargeAttach = f.isLargeAttach;
        this.isComplete = Boolean(f.isComplete);
        if (this.isComplete) {
            this.state = "complete";
        } else {
            this.state = f.state || "waiting";
        }

        this.lastUIState = "none";
        this.showProgress = this.uploadType != "common"; //是否显示上传进度条
        this.knownFileSize = f.uploadType != "common";
    },
    hasUI: function () {
        return Boolean(this.container);
    },
    createUI: function (previewImg) {
        var element = document.createElement("li");
        //var element = document.createElement("div");
        element.className = '';
        this.container = element;
        this.updateUI(previewImg);
        return element;
    },

	remove: function (callback) {
		var container = this.container;
		var fileName = this.fileName;
		var hasInserted = false;

		var filenameNoExt = fileName.substr(0, fileName.lastIndexOf("."));

		if(typeof callback !== "function") {
			callback = noop;
		}

		if (this.hasUI()) {
			htmlEditorView.editorView.editor.jEditorDocument.find(".inserted_Mark span.name_container").each(function(){
				if(this.getAttribute("title") == filenameNoExt){
					hasInserted = true;
				}
			});

			if(hasInserted) {
				top.$Msg.confirm("删除附件后，邮件正文中的文件会同时被删除，确定删除吗？", function(){
					container.parentNode.removeChild(container);
					upload_module.removeRichMediaFile(fileName);
					callback(true);
				}, function(){
					callback(false);
				},{
					icon: "i_warn"
				});
			} else {
				container.parentNode.removeChild(container);
				callback(true);
			}
		}
	},
	
    //更新UI
    updateUI: function (previewImg) {
        var isUpdateProgress = this.state == "uploading" && this.showProgress && this.lastUIState == "uploading";
        if (this.insertImage || this.replaceImage) {
            this.updateInsertImageLoading();
            return;
        }
        if (isUpdateProgress) {
            //只更新进度条
            this.updateProgress();
        } else {
            //更新html
            var htmlCode = "";
            switch (this.state) {
                case "waiting":
                    htmlCode = this.getWaitingHTML();
					$("#divUploadTip").hide();//开始上传的时候要隐藏tips
                    break;
                case "complete":
                    htmlCode = this.getCompleteHTML();
                    utool.fillSubject(this.fileName);
                    break;
                case "uploading":
                    htmlCode = this.showProgress ? this.getProgressUploadingHTML() : this.getCommonUploadingHTML();
                    break;
                case "blockerror": //上传中断
                    htmlCode = this.getProgressUploadingHTML({ resume: true });
                    break;
                case "error":
                    htmlCode = "";
                    break;
            }
            if (this.state == "uploading") {
                // this.container.className = "upLoad shadow";
            } else if (this.container.className == "upLoad shadow") {
                //this.container.className = "";
            }
            this.container.innerHTML = htmlCode;
            if (this.state == "complete") {
                //var files = upload_module.model.get('initDataSet').attachments;
                var filename = $(this.container).find("span:first").text();
                var fileId = $(this.container).find("span:first").attr("fileid");
                var num1 = filename.lastIndexOf(".");
                var num2 = filename.length;
                var file = filename.substring(num1, num2); //后缀名  
                var imgUrl = $(this.container).find("a:first").attr("imgUrl");
                //var downloadUrl = upload_module.model.getAttachUrl(fileId, encodeURIComponent(filename, true);
                var downloadurl = $(this.container).find("a:first").attr("downloadurl");
                var isImg = /(?:\.jpg|\.gif|\.png|\.ico|\.jfif|\.bmp|\.jpeg|\.jpe)$/i.test(file);
                if (isImg) {
                    //var downloadUrl = top.$T.Utils.format("http://" + location.host + "/RmWeb/view.do?func=attach:download&type=attach&encoding=1&sid={0}&mid={1}&offset={2}&size={3}&name={4}",
                    //[upload_module.model.getSid(), upload_module.model.get('initDataSet').omid, files[i].fileOffSet, files[i].base64Size, encodeURIComponent(files[i].fileName)]);
                    var previewObj = {
                        imgUrl: imgUrl,
                        fileName: filename,
                        downLoad: downloadurl
                    }
                    var length = UploadFileItem.prototype.previewImg.push(previewObj);
                    $(this.container).attr("index", length - 1);
                }
            };

			// clientType 1 webmail 2 从酷版上传（跨设备）
            if(this.clientType == 2 && this.state === "waiting"){
	            //$(this.container).find('[command="CancelUpload"]').hide();
	            $(this.container).find('[command="RemoveFile"]').hide();
            }
            $(this.container).show();
        }
        this.lastUIState = this.state;
    },
    srcollImgPreview: function (This) {
        var self = this;
        var num = $(This).parents("li").attr("index");
        if (num != "") {
            if (typeof (top.focusImagesView) != "undefined") {
                top.focusImagesView.render({ data: UploadFileItem.prototype.previewImg, num: parseInt(num) });
            }
            else {
                top.M139.registerJS("M2012.OnlinePreview.FocusImages.View", "packs/focusimages.html.pack.js?v=" + Math.random());
                top.M139.requireJS(['M2012.OnlinePreview.FocusImages.View'], function () {
                    top.focusImagesView = new top.M2012.OnlinePreview.FocusImages.View();
                    top.focusImagesView.render({ data: UploadFileItem.prototype.previewImg, num: parseInt(num) });
                });
            }
        };
    },
    //添加内联图片上传loading效果
    updateInsertImageLoading: function () {
        switch (this.state) {
            case "waiting":
            case "uploading":
                top.M139.UI.TipMessage.show('图片加载中...');
                //top.WaitPannel.show('图片加载中...');
                break;
            case "complete":
                top.M139.UI.TipMessage.hide();
                break;
            case "error":
                break;
        }
        this.lastUIState = this.state;
    },
    isUploading: false,
    //等待上传的html
    getWaitingHTML: function () {
        var htmlCode = '<i class="{i_attachmentS}"></i><span class="ml_5">{prefix}<span class="gray">{suffix}</span></span>\
						<span class="progressBarDiv">\
							<span class="progressBar"></span>\
							<span class="progressBarCur">\
								<span style="width: 0%;"></span>\
							</span>\
						</span>\
						<span class="gray">{getFileMd5}{getMd5}({fileSizeText})</span>\
						<a hideFocus="1" href="javascript:void(0)" class="ml_5" taskid="{taskId}" fileid="{fileId}" uploadtype="{uploadType}" filetype="{fileType}" command="RemoveFile">删除</a>';
        var shortName = utool.shortName(this.fileName),
			prefix = shortName.substring(0, shortName.lastIndexOf('.') + 1),
			suffix = shortName.substring(shortName.lastIndexOf('.') + 1, shortName.length);
        var fileIconClass = $T.Utils.getFileIcoClass(0, this.fileName);
        var data = {
            fileIconClass: fileIconClass,
            prefix: prefix,
            suffix: suffix,
            fileId: this.taskId,
            fileSizeText: "",
            fileType: this.fileType,
            uploadType: this.uploadType,
            taskId: this.taskId,
            getFileMd5:'扫描中',
            getMd5:this.getMd5 || '0%'
        };
        //如果是普通上传，就不知道文件大小了
        if (this.knownFileSize) {
            data.fileSizeText = (this.fileType == "largeAttach" ? this.fileSize : top.$T.Utils.getFileSizeText(this.fileSize, { maxUnit: "K", comma: true }));
        }
        data.i_attachmentS = this.isLargeAttach?'i_bigAttachmentS':'i_attachmentS';
        htmlCode = top.$T.Utils.format(htmlCode, data);
        return htmlCode;
    },

    getDownloadUrl: function() {
	    var file,
	    	model,
	    	pageType,
        	downloadUrl,
        	fileId = this.fileId;

        model = upload_module.model;
        pageType = model.get('pageType');
        if ("|draft|forward|reply|replyAll|resend|".indexOf('|' + pageType + '|') >= 0) {	//草稿箱打开，需要用读信地址
            // 从restoreDraft的报文中找到这个附件
            file = _.find(model.get('initDataSet').attachments, function(item){
			    return item.fileId === fileId;
			}) || {};
			if(!file.fileOffSet){
				downloadUrl = model.getAttachUrl(fileId, encodeURIComponent(this.fileName), true);
				return downloadUrl;
			}
			downloadUrl = "http://" + location.host + "/RmWeb/view.do?func=attach:download&type=attach&encoding=1&sid={0}&mid={1}&offset={2}&size={3}&name={4}";
            downloadUrl = top.$T.Utils.format(downloadUrl, [model.getSid(), model.get('mid'), file.fileOffSet, file.base64Size, encodeURIComponent(file.fileName)]);
            //downloadUrl = encodeURIComponent(downloadUrl);
        } else {
        	downloadUrl = model.getAttachUrl(fileId, encodeURIComponent(this.fileName), true);
        }
        return downloadUrl;
    },

    getImgUrl: function(FilePreview) {
	    var imgUrl = "";
        var model = upload_module.model;
	    var fileId = this.fileId;
	    var pageType = model.get('pageType');
	    var file;

        if (pageType == "draft" || pageType == "resend") {
            imgUrl = "";
        } else {
		    file = _.find(model.get('initDataSet').attachments, function(item){
			    return item.fileId === fileId;
			}) || {};
		    
            imgUrl = FilePreview.getImgUrl({
                fileSize: file.fileSize,
                fileOffSet: file.fileOffSet,
                fileName: $T.Html.encode(file.fileName),
                type: "email"
            }, model.get('mid'));
        }
        return imgUrl;
    },

    //上传完成的html
    getCompleteHTML: function () {
        var imgUrl = "";
        var previewUrl = "";
        var downloadUrl = "";
        var previewHtml = "";
        var comefrom = "compose";
        //var insertImgHtml = "";

        var tempArr;
        var target = "_blank";
        var clickEvent = "";
        var model = upload_module.model;
	    var pageType = model.get('pageType');
        var FilePreview = new top.M2012.ReadMail.View.FilePreview();
        var previewType = FilePreview.checkFile(this.fileName, this.fileSize);

        var showFilePreview = this.fileType != "largeAttach" && FilePreview.isRelease();
        var isImg = /\.(?:jpg|gif|png|ico|jfif|bmp|jpeg?)$/i.test(this.fileName);
        var tempStr = "<a style='' {6} hideFocus='1' imgUrl='{3}' fileName='{5}' class='ml_5' behavior='{0}' ext='2' href=\"{1}\" target='{7}' title='预览文件' downloadurl='{4}' >{2}</a>";
        var behaviorKey = previewType == 1 ? "预览-在线预览" : "预览-预览压缩包";
        var option3 = previewType == 1 ? "预览" : "打开";


        showFilePreview &= previewType > 0;		// 没有注解的代码
        
        if (showFilePreview) {
			downloadUrl = this.getDownloadUrl();

		    /*if(previewType == 1 && isImg) {
			    previewUrl = "javascript:;";
                target = "_self";
                clickEvent = "onclick = 'UploadFileItem.prototype.srcollImgPreview(this)'";
                downloadUrl = decodeURIComponent(downloadUrl);
                //var tempImg = "<a class='ml_5' href='javascript:;' hideFocus='1' imgUrl='{0}' command='InsertImgFile'>插入正文</a>"
                //insertImgHtml = top.$T.Utils.format(tempImg, [downloadUrl]);
			} else {*/
	        if ("|draft|forward|reply|replyAll|resend|".indexOf('|' + pageType + '|') >= 0) {	//草稿箱打开，需要用读信地址
	            comefrom = "draftresend";
            }
			previewUrl = top.M2012.ReadMail.View.FilePreview.getUrl({
	            fileName: encodeURIComponent(this.fileName),
	            fileSize: this.fileSize,
	            type: "email",
	            downloadUrl: downloadUrl,
	            contextId: this.fileId,
	            comefrom: comefrom,
	            composeId: model["composeId"]
	        }, model.get("currFid"));	// todo currFid是干什么的？这里可以为空
			//}

	        imgUrl = this.getImgUrl(FilePreview);

            tempArr = [behaviorKey, previewUrl, option3, imgUrl, downloadUrl, $T.Html.encode(this.fileName), clickEvent, target];
            previewHtml = top.$T.Utils.format(tempStr, tempArr);
        } //}附件预览

        var fileSizeText = this.fileType == "largeAttach" ? this.fileSize : top.$T.Utils.getFileSizeText(this.fileSize, { maxUnit: "K", comma: true });

		if(isImg) {
			previewHtml += '<a hideFocus="1" class="ml_5" href="javascript:void(0)" onclick="upload_module.insertImgFile(\''+downloadUrl+'\')">添加到正文</a>';
		} else if(/\.(?:mp3|mp4|m4a|m4v|flv|docx?|pptx?|xlsx?|pdf|txt)$/i.test(this.fileName)) {
			if(this.fileSize > 1024 * 1024 * 20 && /\.(?:docx?|pptx?|xlsx?|pdf|txt)$/i.test(this.fileName)) {
				// skip
			} else {
				previewHtml += '<a hideFocus="1" class="ml_5" href="javascript:void(0)" onclick="upload_module.insertRichMediaFile(\''+this.fileName+'\', \''+fileSizeText+'\')">添加到正文</a>';
			}
		}

        //{insertImgHtml}\ //屏蔽插入正文功能，后台与内联图片冲突
		//下面的i 原来的class为{fileIconClass} 
        var htmlCode = '<i class="i_attachmentS"></i>\
						<span class="ml_5" fileid="{fileId}">{prefix}<span class="gray">{suffix}</span></span>\
						<span class="gray ml_5">({fileSizeText})</span>\
						{previewHtml}\
						<a hideFocus="1" class="ml_5" href="javascript:void(0)" fileid="{fileId}" filetype="{fileType}" command="DeleteFile">删除</a>';
        var shortName = utool.shortName(this.fileName);
        var fileIconClass = $T.Utils.getFileIcoClass(0, this.fileName);

        return top.$T.Utils.format(htmlCode, {
            fileIconClass: "i_attachmentS",
            prefix: shortName.substring(0, shortName.lastIndexOf('.') + 1),
            suffix: shortName.substring(shortName.lastIndexOf('.') + 1),
            fileSizeText: fileSizeText,
            fileId: this.fileId,
            fileType: this.fileType,
           //insertImgHtml : insertImgHtml,
            previewHtml: previewHtml
        });
    },

    //普通上传中,没有进度条,取消上传不用传什么参数
    getCommonUploadingHTML: function () {
        var htmlCode = '<i class="i_attachmentS"></i>\
						<span class="ml_5">{prefix}<span class="gray">{suffix}</span></span>\
						<span class="progressBarDiv" style="display:none">\
							<span class="progressBar"></span>\
							<span class="progressBarCur">\
								<span style="width: 0%;"></span>\
							</span>\
						</span>\
						<span class="gray" style="display:none">0%</span>\
						<span class="gray">上传中……</span>\
						<a hideFocus="1" class="ml_5" href="javascript:void(0)" command="CancelUpload" taskid="{taskId}" uploadtype="{uploadType}">删除</a>';
        var shortName = utool.shortName(this.fileName),
			prefix = shortName.substring(0, shortName.lastIndexOf('.') + 1),
			suffix = shortName.substring(shortName.lastIndexOf('.') + 1, shortName.length);
        var fileIconClass = $T.Utils.getFileIcoClass(0, this.fileName);
        var data = {
            fileIconClass: fileIconClass,
            prefix: prefix,
            suffix: suffix,
            uploadType: "common",
            taskId: this.taskId
        };
        htmlCode = top.$T.Utils.format(htmlCode, data);
        return htmlCode;
    },
    //显示进度条的上传中
    getProgressUploadingHTML: function (args) {
        var htmlCode = '<i class="{i_attachmentS}"></i>\
						<span class="ml_5">{prefix}<span class="gray">{suffix}</span></span>\
						<span class="progressBarDiv">\
							<span class="progressBar"></span>\
							<span class="progressBarCur">\
								<span style="width: {progress}%;"></span>\
							</span>\
						</span>\
						<span class="gray">{progress}%</span>\
						<span class="gray">{uploadTipText}({sendedSizeText})</span>\
						<a class="ml_5" href="javascript:void(0)" command="CancelUpload" taskid="{taskId}" uploadtype="{uploadType}">删除</a>';
        var shortName = utool.shortName(this.fileName),
			prefix = shortName.substring(0, shortName.lastIndexOf('.') + 1),
			suffix = shortName.substring(shortName.lastIndexOf('.') + 1, shortName.length);
        var fileIconClass = $T.Utils.getFileIcoClass(0, this.fileName);
        var uploadTipText = "上传中";
        if (args && args.resume) {
            uploadTipText = "<b style='color:red'>上传失败</b>";
            htmlCode += "&nbsp;|&nbsp;<a href=\"javascript:void(0)\" command=\"ResumeUpload\" taskid=\"{taskId}\">续传</a>"
        }
        var data = {
            fileIconClass: fileIconClass,
            prefix: prefix,
            suffix: suffix,
            uploadTipText:uploadTipText,
            sendedSizeText: top.$T.Utils.getFileSizeText(this.sendedSize || 0, { maxUnit: "K", comma: true }),
            fileSizeText: top.$T.Utils.getFileSizeText(this.fileSize, { maxUnit: "K", comma: true }),
            progress: Math.min(this.progress || 0, 99),
            uploadType: this.uploadType,
            taskId: this.taskId
        };
        data.i_attachmentS = this.isLargeAttach?'i_bigAttachmentS':'i_attachmentS';
        htmlCode = top.$T.Utils.format(htmlCode, data);
        return htmlCode;
    },
    //更新进度条
    updateProgress: function () {
        //不刷新删除按钮
        var li = document.createElement("li");
        li.innerHTML = this.getProgressUploadingHTML();
        var new2 = $(li).children()[2];
        var new3 = $(li).children()[3];
        var new4 = $(li).children()[4];
        var old2 = $(this.container).children()[2];
        var old3 = $(this.container).children()[3];
        var old4 = $(this.container).children()[4];
        old2.innerHTML = new2.innerHTML;
        old3.innerHTML = new3.innerHTML;
        old4.innerHTML = new4.innerHTML;

        //this.container.innerHTML = this.getProgressUploadingHTML();
    },
    upload: function () {
        if (this.uploadType == "flash") {
            upload_module_flash.upload(this.taskId);
        } else if (this.uploadType == "multiThread") {
            upload_module_multiThread.upload(this);
        } else if (this.uploadType == "ajax") {
            upload_module_ajax.upload(this);
        }
    },
    //取消正在上传的任务
    cancelUpload: function () {
        if (this.uploadType == "common") { 
            var form = document.forms["fromAttach"];
            form.reset();
            refreshAttach();
            utool.logUpload(UploadLogs.CommonCancel);
        } else if (this.uploadType == "flash") {
            upload_module_flash.cancel(this);
        } else if (this.uploadType == "multiThread") {
            upload_module_multiThread.cancel(this);
            refreshAttach(true);
            uploadManager.removeFile(this);
        } else if (this.uploadType == "ajax") {
            upload_module_ajax.cancel(this);
            uploadManager.removeFile(this);
            return;
        }
        
        upload_module.model.autoSendMail = false;
        //refreshAttach(true); //刷新附件列表，保证准确性
    },
    //续传上传的任务 - 支持flash html5(ajax)
    uploadResume: function(){
        if (this.uploadType == "flash") {
            UploadFacade.uploadResume();
        }else if(this.uploadType == "ajax"){
            upload_module_ajax.uploadResume(this);
        }
    }
};
//var asynDeletedFile = "";

//var compose_attachs = [];

function addCompleteAttach(obj){
    //console.dir(obj);
    //给obj添加insertImage,replaceImage属性，不然刷新的时候会添加内联图片附件列表
    var fileList = uploadManager.fileList;
    for(var j=0;j<fileList.length;j++){
        var file = fileList[j];
        if(file.fileName == obj.fileName){
	    obj.insertImage = file.insertImage;
	    obj.replaceImage = file.replaceImage;
            break;
        }
    }
    for(var i=0;i<upload_module.model.composeAttachs.length;i++){
        if(upload_module.model.composeAttachs[i].fileId == obj.fileId) return;
    }
    upload_module.model.composeAttachs.push({
        fileId:obj.fileId,
        fileName:obj.fileName,
        fileSize:obj.fileSize,
	insertImage: obj.insertImage,
	replaceImage: obj.replaceImage
    });
}
function removeFromAttach(fid){
    for(var i=0;i<upload_module.model.composeAttachs.length;i++){
        if(upload_module.model.composeAttachs[i].fileId==fid){
            upload_module.model.composeAttachs.splice(i,1);
            return;
        }
    }
}
