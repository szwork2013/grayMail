function bindAttachFrameOnload(){
    $("#frmAttachTarget").load(onload);
    function onload() {
        var frmAttach = window.frames["frmAttachTarget"];
        commonAttachFrameOnLoad(frmAttach);
    }
}
function commonAttachFrameOnLoad(frmAttach, isInserImage) {
    if (!window.uploadManager || !uploadManager.isUploading()) {
        if (!isInserImage) {//弹出框插入图片那里
            return;
        }
    }
    var form = document.forms["fromAttach"];

    if(frmAttach.location.href.indexOf("blank.htm")>0){
        return;
    }
    var obj = frmAttach.return_obj;
    if(obj && obj.code == "S_OK"){
        var attachInfo = obj["var"];
        attachInfo.insertImage = isInserImage;
        upload_module.model.composeAttachs.push(attachInfo);
		uploadManager.refresh(function(){
			if(upload_module.model.autoSendMail) {
				mainView.toSendMail();
			}
			form.reset();
		});
        return true;
    }else if(obj && obj.code == "FA_ATTACH_SIZE_EXCEED"){
    	top.$Msg.alert(ComposeMessages.FileSizeOverFlow);
    }else{
    	top.$Msg.confirm(
	        "附件上传失败，请重试。",
	        function(){
	            form.submit();
	        },
	        function(){
	            form.reset();
    			uploadManager.cancelUploading();
	        },
	        {
	            buttons:["重试","取消"],
	            title:"上传附件"
	        }
	    );
    }
    return false;
}
//刷新附件iframe,可以取消普通上传
function refreshAttach(onlyRefreshAttach, callback) {
    if (upload_module.model.autoSendMail) {//自动发送,需要测试
        upload_module.model.PageState = upload_module.model.PageStateTypes.Common;
        upload_module.model.autoSendMail = false;
    } else {
        if(!onlyRefreshAttach){	// todo 什么意思？
            var frmAttach = document.getElementById("frmAttachTarget");
            frmAttach.src = "blank.htm";
        }
    }
    if(upload_module.model.composeId){
        upload_module.model.callApi("attach:refresh", {id : upload_module.model.composeId}, function (result) {
            var files = result.responseData["var"];
            upload_module.model.composeAttachs = files;
            var fileList = uploadManager.fileList;
            for(var i=0; i<fileList.length; i++){
                var file = fileList[i];
                for(var j=0; j<files.length; j++){
                    if(files[j].fileId == file.fileId){
                    	files[j].insertImage = file.insertImage;
                        files[j].replaceImage = file.replaceImage;  //后台返回的附件数据没有replaceImage值，在这里加上，不然会显示内联附件列表
                    }
                }
            }
            uploadManager.refresh(callback);
        });
    }
}