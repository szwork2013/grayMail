function FastUploadPageInit() {
	theUploadControl = new UploadControl();
    theUploadControl.init({
        container: document.getElementById("fastUploadProgress")
    });
    
    if(UploadControl.enforceUpdate()) return;
	
	//树形菜单选项
   $("#file-tree").click(function(event){
         $("#file-tree2").attr("style","display:block");
         DirectoryTree.ClickDirTree(true);
         Utils.stopEvent(event);
    });
    $(document).click(function(){
         $("#file-tree2").hide();
    });
    $("#aUploadCloseBtn").click(function(){
        FastUploadClose();
    });
    $("#aCancelAll").click(function(){
        CancelALLUpload();
    });
    window.onPageEvent_fileAdd = function(uc, file) {
        resetUploadInfo(uc);
        var value = document.getElementById("stPosition").value.split("-");
        SelectDirectory();
        file.comeFrom = selComefrom;
        file.dirId = selDirId;
        file.bitemId = selItemId;
    }
    window.onPageEvent_fileRemove=function(uc) {
        resetUploadInfo(uc);
    }
	//初始化来源
    InitFromDirectory();
    checkContinueUpload();
    
    EnabledButtons("aUploadFastBtn",AddFiles);
    
    uploadWindow = top.FloatingFrame.current;
    uploadWindow.onclose = FastUploadClose;
    CommonInit();
}
function GetUploadSpeed(){
    return UploadControl.getCurrent().getGlobalSpeed();
}
function GetUploadFileCount(){
    return UploadControl.getCurrent().getFiles().length;
}
function GetUploadProgress(){
    return UploadControl.getCurrent().getGlobalProgress();
}
function CancelALLUpload() {
    if (window.confirm("是否取消所有上传?")) {
        UploadControl.getCurrent().cancelAll();
    }
}
function onFloatingFrameClose(){
    FastUploadClose();
    return false;
}
function FastUploadClose() {
    var fileCount = theUploadControl.getFiles().length;
    var isUploading = theUploadControl.isUploading();
    if (isUploading && !window.confirm("正在上传文件，是否取消上传？")) {
        return false;
    }else{
        if (isUploading) theUploadControl.dispose();
        try{
			if (isUploadNeedRefresh) {
			    var win = DiskTool.getDiskWindow();                
			    if(win.Toolbar)win.Toolbar.refreshList();
			    if(win.FileList && win.FileList.Render)win.FileList.Render.renderParent();
            }
			window.setTimeout(function (){FF.close();},0);
        } catch(e) {}
    }
}
function  AddFiles() {
    theUploadControl.openFileDialog();
}
function resetUploadInfo(uc){
    var files = uc.getFiles();
    var totalSize = 0;
    var fileCompleteCount = 0;
    for (var i = 0; i < files.length; i++) {
        totalSize += files[i].fileSize;
        if(files[i].state=="success") {
            fileCompleteCount = fileCompleteCount+1;
        }
    }
    var htmlCode = "上传列表中有{0}个文件,共{1}".format(files.length, DiskTool.getFileSizeText(totalSize));
    $("#spanFileInfo").html(htmlCode);
    if(fileCompleteCount > 0) {
        $("#pFileInfoSub").html("已成功上传{0}个文件".format(fileCompleteCount));
        $("#pFileInfoSub").show();
    } else {
        $("#pFileInfoSub").hide();
    }
    if (files.length == 0) {
        $("#divFileInfo").hide();
    } else {
        $("#aCancelAll").show();
    }
}
//是否为续传
function checkContinueUpload() {
    var match = DiskQueryString("fileid");
    if (match) {
        var fileId = match;
        var ac = theUploadControl.activex;
        var count = ac.gettaskcount();
        for (var i = 0; i < count; i++) {
            if (ac.gettaskfileid(i) == fileId) {
                SelectDirectory();
                theUploadControl.addFile(ac.gettaskfilename(i), ac.gettaskfilesize(i), fileId);
                theUploadControl.autoUpload();
                return;
            }
        }
        alert(fuErrorMsg_fileNotFound);
    } else {
        //控件上传一出来就选文件
        AddFiles();
    }
}
document.write(getUploadControlHtml());