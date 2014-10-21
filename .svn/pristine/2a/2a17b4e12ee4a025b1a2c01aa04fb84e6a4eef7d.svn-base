//上传控制器
var upload_module = {
    //须在文档未关闭前调用
    init: function (model) {
    	this.model = model;
        var t = supportUploadType = this.getSupportUpload();
        //ie678 多线程=》flash=》普通
        //ff3.6+ chrome 多线程=》普通
        //其它 普通
        //如果支持flash 创建flash上传并且 屏蔽普通上传
        //如果支持多线程上传 屏蔽普通上传和
        //如果支持截屏上传
        var isSupportCommonUpload = true;

        if (t.isSupportMultiThreadUpload) {
            upload_module_multiThread.init();
        }
        if (t.isSupportFlashUpload) {
            upload_module_flash.init();
            isSupportCommonUpload = false;
        }

        if (t.isSupportAJAXUpload) {
            upload_module_ajax.init();
            isSupportCommonUpload = false;
        }
        if (isSupportCommonUpload) {
            upload_module_common.init();
        }
		this.model.PageState = this.model.PageStateTypes.Common;
        bindAttachFrameOnload();

        if (isSupportCommonUpload || t.isSupportAJAXUpload) {
            $("#fromAttach").show();
        }
    },
    createUploadManager: function () {
        uploadManager = new UploadManager({
            container: document.getElementById("attachContainer")
        });
    },
    getSupportUpload: function () {
        var obj = {};
        obj.isSupportMultiThreadUpload = upload_module_multiThread.isSupport();
        obj.isSupportFlashUpload = upload_module_flash.isSupport();
        obj.isSupportAJAXUpload = upload_module_ajax.isSupport();
        obj.isSupportScreenShotUpload = obj.isSupportMultiThreadUpload;
        return obj;
    },
    //此函数只用来删除普通附件
    deleteFile: function (param) {
        var file = param.file;
        var fileId = file.fileId;
        var fileName = file.filePath;
        if (file.uploadType == "multiThread") {
            fileName = file.fileName;
        }
        if (isCurrentUploadAttach(fileName, fileId)) {
            var requestXml = {
                targetServer:1,
                composeId: upload_module.model.composeId,
                items: [fileId]
            };
            this.model.callApi("upload:deleteTasks", requestXml, function (result) {
                if (result.responseData["code"] == "S_OK") {
                    uploadManager.removeFile(file);
                    uploadManager.autoUpload();
                }
            });
            console.log("删除本次上传的附件:" + fileId + "," + fileName);
            //top.Debug.write("删除本次上传的附件:" + fileId + "," + fileName);
        }

        //判断是否本次上传的附件
        function isCurrentUploadAttach(fileName, fileId) {
            if (fileName.indexOf("\\") != -1 || upload_module.model.get('pageType') == "compose") {
                return true;
            }
            var dataSet = upload_module.model.get('initDataSet');
            if (dataSet.attachments) {
                for (var i = 0; i < dataSet.attachments.length; i++) {
                    if (fileId == dataSet.attachments[i].id) return false;
                }
            }
            return true;
        }
    },
    insertImgFile : function(imageUrl){
		htmlEditorView.editorView.editor.insertImage(imageUrl);
    },
    /*
    * 插入audio/video/doc/picture类型的文件预览链接到编辑器正文
    */
    insertRichMediaFile: function(fileName, fileSize){
		var ext = $T.Url.getFileExtName(fileName).toLowerCase();
		var filenameNoExt = fileName.slice(0, -ext.length-1);
		var isRichMedia = /^(?:mp3|wav|mp4|m4a|m4v|flv|docx?|pptx?|xlsx?|pdf|txt)$/i.test(ext);
		var icon = "txt.png";
		var html = "";
		var editor = htmlEditorView.editorView.editor;
		//var existed = $(editor.editorWindow.document).find('.inserted_Mark .name_container[title="'+filenameNoExt+'"]');

		var extName = "/" + ext + "/";

		var key;

		var map = {
			//"picture.png" : "/jpg/gif/png/ico/jfif/bmp/jpeg/jpe/",
			"music.png" : "/mp3/wma/wav/mod/ogg/midi/",
			"video.png" : "/flv/rmvb/rm/avi/wmv/mov/3gp/mp4/m4v/",
			"word.png" : "/doc/docx/wps/",
			"ppt.png" : "/ppt/pptx/",
			"xls.png" : "/xls/xlsx/",
			"pdf.png" : "/pdf/",
			"txt.png" : "/txt/log/ini/csv/"
		};

		/*if(existed.length > 0) {
			if(document.body.scrollIntoView){
				// todo
				// existed.blink();
			}
			return ;
		}*/

		BH({key: "compose_attach_addto_editor"});

		for(key in map){
			if(map[key].indexOf(extName) != -1 && map.hasOwnProperty(key)){
				icon = key;
				break;
			}
		}

		if(isRichMedia)
		{
			html = ['<div>',
					  '<span>&nbsp;</span>',
					  '<span class="inserted_Mark attachmentOther" contenteditable="false">',
						'<i style="display:none;width:0;height:0;font-size:0;background:transparent;opacity:0;">' + fileName + '</i>',
						'<img src="/m2012/images/module/networkDisk/images/small/' + icon + '" />',
						'<span class="name_container" title="' + filenameNoExt + '" style="color:#000;">' + (filenameNoExt.length > 28 ? filenameNoExt.substring(0, 28)+ "..." : $TextUtils.htmlEncode(filenameNoExt)) + '</span>',
						'<span class="gray">.' + ext + '</span><span class="gray">(' + fileSize + ')</span>',
						'<p class="pctrl"><a href="javascript:;" onclick="this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);return false;">移除</a></p>',
					  '</span>',
					  '<span>&nbsp;</span>',
					'</div>'].join("");
			// IE10下不能一次插入
			editor.insertHTML(html);
		}
    },
    /*
    * @see #insertRichMediaFile
    */
    removeRichMediaFile: function (fileName) {
	    var ext = $T.Url.getFileExtName(fileName);
		var filenameNoExt = fileName.slice(0, -ext.length-1);
	    htmlEditorView.editorView.editor.jEditorDocument.find(".inserted_Mark span.name_container").each(function(){
			if(this.getAttribute("title") == filenameNoExt){
				$(this).closest(".inserted_Mark").remove();
			}
	    });
    },
    deletePreuploadFile: function (fileName) {
        var requestXml = {
            composeId: upload_module.model.composeId,
            items: [fileName]
        };
        RequestBuilder.call("upload:deleteTasks", requestXml, function (result) {
            if (result["code"] == "S_OK") {
                top.Debug.write("删除本次上传的附件:" + fileName);
                upload_module.asynDeletedFile = "";
            }
        });
    }
}

//为了降低系统复杂性，旧的上传控件不再使用
upload_module_screenShot = {
    isSupport: function () {
        //抛弃旧的截屏控件，降低复杂性
        return false;
    }
}
