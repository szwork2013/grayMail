//机械化操作
utool = {
    getMaxUploadSize: function () {
    	//套餐升级
    	var vipInfo = top.$User.getVipInfo();
        if (vipInfo && vipInfo.MAIL_2000005) {
        	
        	
        	// todo 临时代码，服务端vipinfo居然全返回0
        	var tempInt = parseInt(vipInfo.MAIL_2000005 / 1024 / 1024);
        	if(tempInt < 50){
        		return 50;
        	}
        	
        	
            return parseInt(vipInfo.MAIL_2000005 / 1024 / 1024);
        }
        return 50;
    },
    checkFileExist: function (fileName) {
        fileName = utool.getFileNameByPath(fileName);
        var list = uploadManager.fileList;
        for (var i = 0; i < list.length; i++) {
            var file = list[i];
            if (file.fileName == fileName) return true;
        }
        return false;
    },
    getUploadTipMessage: function () {
    	var tip = $T.Utils.format("添加小于{0}M的附件", [utool.getMaxUploadSize()]);
        //var tip = "添加小于{0}M的附件".format(utool.getMaxUploadSize());
        if (supportUploadType.isSupportScreenShotUpload) {
            tip += "，可使用 Ctrl+V 粘贴附件和图片";
      //} else if (document.all) {// update by tkh 由于邮箱小工具适用于所有浏览器所以document.all的判断去掉
        }else if(window.navigator.platform != "Win64" && $B.is.windows){
            tip += "<br/>安装<a hideFocus='1' style='color:blue' onclick='M139.Plugin.ScreenControl.isScreenControlSetup(true);' href='javascript:;'>邮箱小工具</a>，即可Ctrl+V粘贴上传附件"
        }
        /*
        if (supportUploadType.isSupportFlashUpload) {
            tip += "<br/>当前正在使用Flash上传组件，如果上传异常，您可以选择<a style='font-weight:bolder;color:blue;text-decoration: underline;' href='javascript:;' onclick='utool.showDisableFlashMsg();return false;'>普通上传</a>";
        }*/
        return tip;
    },
    //弹出禁用flash上传的对话框
    showDisableFlashMsg: function () {
        if (confirm("您是否要禁用Flash上传组件?")) {
            var d = new Date();
            d.setFullYear(2099);
            $Cookie.set({name : 'flashUploadDisabled',value : '1',expries : d});
            alert("Flash上传组件已经禁用，您下次打开写信页将使用原始但是稳定的上传方式。");
        }
    },
    //检测加上文件大小是否超标
    checkSizeSafe: function (size) {
        return this.getRemainSize() > size;
    },
    //获得目前已使用的控件
    getSizeNow: function () {
        var sizeNow = 0;
        var list = uploadManager.fileList;
        for (var i = 0; i < list.length; i++) {
            var file = list[i];
            if (file.fileSize) sizeNow += file.fileSize;
        }
        return sizeNow;
    },
    //获得剩余的可上传文件大小
    getRemainSize: function () {
        return this.getMaxUploadSize() * 1024 * 1024 - this.getSizeNow();
    },
    //截取文件名
    shortName: function (fileName) {
        if (fileName.length <= 30) return fileName;
        var point = fileName.lastIndexOf(".");
        if (point == -1 || fileName.length - point > 5) return fileName.substring(0, 28) + "…";
        return fileName.replace(/^(.{26}).*(\.[^.]+)$/, "$1…$2");
    },
    getFileNameByPath: function (filePath) {
        return filePath.replace(/^.+?\\([^\\]+)$/, "$1");
    },
    getFileById: function (fid) {
        var list = uploadManager.fileList;
        for (var i = 0; i < list.length; i++) {
            var f = list[i];
            if (f.fileId == fid || f.taskId == fid) {
                return f;
            }
        }
        return null;
    },
    getAttachFiles: function () {
	    var file;
        var result = upload_module.model.composeAttachs;

        //干掉没有文件名的附件2010-12-16 by lifl
        try {
            for (var i = 0; i < result.length; i++) {
                file = result[i];
                if (!file.fileName && !file.name) {
                    result.splice(i, 1);
                    i--;
                }
            }
        } catch (e) { }
        //替换fileRealSize属性
        for(var i=0;i<result.length;i++){
            file = result[i];
            if(file.fileRealSize){
                file.base64Size = file.fileSize;
                file.fileSize = file.fileRealSize;
            }
        }

        return result;
    },
    getControlUploadUrl: function (isInlineImg) {
	    var model = upload_module.model;
	    model.requestComposeId();
        var url = "http://" + window.location.host + "/RmWeb/mail?func=attach:upload&sid=" + model.sid + "&composeId=" + model.composeId;
        if(isInlineImg){
            url += "&type=internal";
        }
        return url;
    },
    getBlockUploadUrl:function(type){
	    var model = upload_module.model;
        var url = "http://" + window.location.host + "/RmWeb/mail?func=attach:upload2&sid=" + model.sid + "&composeId=" + model.composeId+"&uploadType="+type;
       
        return url;
    },

	/*
	* 获取普通上传返回给iframe的报文中的附件地址
	*/
	getControlUploadedAttachUrl: function(frame){
	    var doc = frame.contentWindow.document;
		var responseText = doc.body.innerHTML || doc.documentElement.innerHTML;
		var imageUrl = "";

		var returnObj = upload_module.model.getReturnObj(responseText);
		if (returnObj) {
			//returnObj.insertImage = true;
			//model.composeAttachs.push(returnObj);
			//uploadManager.refresh();
			imageUrl = upload_module.model.getAttachUrl(returnObj.fileId, returnObj.fileName, false);
		}
		return imageUrl;
	},

    checkUploadResultWithResponseText: function (param) {
        var text = param.responseText;
        var result = {};
        var reg = /'var':([\s\S]+?)\};<\/script>/;
        if (text.indexOf("'code':'S_OK'") > 0) {
            var m = text.match(reg);
            result = eval("(" + m[1] + ")");
            result.success = true;
            addCompleteAttach(result);
        } else {
            result.success = false;
        }
        return result;
    },
    isScreenShotUploading: function () {
        return Boolean(window.upload_module_screenShot && upload_module_screenShot.isUploading);
    },
    isImageFile: function (fileName) {
        return /\.(?:jpg|jpeg|gif|png|bmp)$/i.test(fileName);
    },
    //如果邮件没有主题，则把文件名加上
    fillSubject: function (fileName) {
        var txtSubject = document.getElementById("txtSubject");
        if (txtSubject.value == "") {
            txtSubject.value = fileName;
            top.$App.setTitle(fileName);            
            // add by tkh
            upload_module.model.autoSaveTimer['subMailInfo']['subject'] = fileName;
        }
    },
    logUpload: function(code, info) {
        //接口已不使用
    }
}
UploadLogs = {
    CommonStart: 5001,
    CommonCancel: 5002,
    CommonSuccess: 5003,
    CommonFail: 5004,
    CommonFailInfo: 5005,
    AjaxStart: 5051,
    AjaxCancel: 5052,
    AjaxSuccess: 5053,
    AjaxFail: 5054,
    AjaxFailInfo: 5055,
    FlashStart: 6001,
    FlashCancel: 6002,
    FlashSuccess: 6003,
    FlashFail: 6004,
    FlashFailInfo: 6005,
    MultiStart: 7001,
    MultiStop: 7002,
    MultiContinue: 7003,
    MultiCancel: 7004,
    MultiSuccess: 7005,
    MultiFail1: 7006,
    MultiFail2: 7007
};
//向下兼容，插入图片那个页面会调用
function getFileIdByName(fileName){
    var list = uploadManager.fileList;
    for(var i=0;i<list.length;i++){
        var f = list[0];
        if(f.filePath==fileName || f.fileName == fileName){
            return f.fileId;
        }
    }
    return null;
}