//截屏控件封装
ScreenShotControl = {
    /**
     * 写控件
     * <pre>示例：<br>
     * <br>ScreenShotControl.writeHtml();
     * </pre>
     * @return {无返回值}
     */
    writeHtml: function(){
        var htmlCode = "<script language=\"JavaScript\" for=\"ScreenSnapshotctrl\" event=\"ScreenSnapshotCtrlOnStart(id)\">\
            ScreenShotControl._onStart(id);\
        </script>\
        <script language=\"JavaScript\" for=\"ScreenSnapshotctrl\" event=\"ScreenSnapshotCtrlOnProgress(id, nProgress, nTotalSize, nUsedTime)\">\
            ScreenShotControl._onProgress(id,nProgress, nTotalSize, nUsedTime);\
        </script>\
        <script language=\"JavaScript\" for=\"ScreenSnapshotctrl\" event=\"ScreenSnapshotCtrlOnStop(id, nResult, strResponse)\">\
            ScreenShotControl._onStop(id, nResult, strResponse);\
        </script>\
        <script language=\"JavaScript\" for=\"ScreenSnapshotctrl\" event=\"SSCUploadClipboardFileOnStart(id, nFileCount, iFileIndex, strFileName)\">\
            ScreenShotControl._uploadClipboardFileOnStart(id, nFileCount, iFileIndex, strFileName);\
        </script>\
        <script language=\"JavaScript\" for=\"ScreenSnapshotctrl\" event=\"SSCUploadClipboardFileOnProgress(id, nFileCount, iFileIndex, strFileName,nProgress,nTotalSize, nTime)\">\
            ScreenShotControl._uploadClipboardFileOnProgress(id, nFileCount, iFileIndex, strFileName,nProgress,nTotalSize, nTime);\
        </script>\
        <script language=\"JavaScript\" for=\"ScreenSnapshotctrl\" event=\"SSCUploadClipboardFileOnStop(id, nFileCount,iFileIndex,strFileName, nResult, strResponse)\">\
            ScreenShotControl._uploadClipboardFileOnStop(id, nFileCount,iFileIndex,strFileName, nResult, strResponse);\
        </script>"
        if ($.browser.msie) {
            htmlCode += "<OBJECT ID=\"ScreenSnapshotctrl\" name=\"ScreenSnapshotctrl\" \
             CLASSID=\"CLSID:E58FEC7E-D43F-40B3-8747-196105D8CF93\"></OBJECT>";
        }
        else {
            htmlCode += " <embed name=\"ScreenSnapshotctrl\" id=\"ScreenSnapshotctrl\" \
             type=\"application/x-richinfo-screensnaphot\" width=\"600\" height=\"40\">";
            window.ScreenSnapshotCtrlOnStart = function(){
                ScreenShotControl._onStart.apply(ScreenShotControl, arguments)
            };
            window.ScreenSnapshotCtrlOnProgress = function(){
                ScreenShotControl._onProgress.apply(ScreenShotControl, arguments)
            };
            window.ScreenSnapshotCtrlOnStop = function(){
                ScreenShotControl._onStop.apply(ScreenShotControl, arguments)
            };
            window.SSCUploadClipboardFileOnStart = function(){
                ScreenShotControl._uploadClipboardFileOnStart.apply(ScreenShotControl, arguments)
            };
            window.SSCUploadClipboardFileOnProgress = function(){
                ScreenShotControl._uploadClipboardFileOnProgress.apply(ScreenShotControl, arguments)
            };
            window.SSCUploadClipboardFileOnStop = function(){
                ScreenShotControl._uploadClipboardFileOnStop.apply(ScreenShotControl, arguments)
            };
        }
        document.write(htmlCode);
    },
    uploading: false,
    _onStart: function(taskId){
        ScreenShotControl.uploading = true;
        if (this.onStart) {
            this.onStart(taskId)
        }
    },
    _onProgress: function(taskId, progress, totalSize, usedTime){
        if (this.onProgress) {
            var result = {};
            result.taskId = taskId;
            result.progress = progress;
            result.totalSize = totalSize;
            result.usedTime = usedTime;
            this.onProgress(result)
        }
    },
    _onStop: function(taskId, resultCode, responseText){
        ScreenShotControl.uploading = false;
        if (this.onStop) {
            var result = {
                resultCode: resultCode,
                responseText: responseText
            };
            this.onStop(result);
        }
    },
    /**
     * 从剪贴板开始上传的事件
     * @param {Object} taskId 必选参数，文件id。
     * @param {Object} fileCount 必选参数，文件数。
     * @param {Object} fileIndex 必选参数，下标(第几个文件)。
     * @param {Object} fileName 必选参数，文件名。
     * @return {无返回值}
     */
    _uploadClipboardFileOnStart: function(taskId, fileCount, fileIndex, fileName){
        ScreenShotControl.uploading = true;
        if (this.onStart) {
            this.onStart({
                taskId: taskId,
                fileCount: fileCount,
                fileIndex: fileIndex,
                fileName: fileName
            });
        }
    },
    _uploadClipboardFileOnProgress: function(taskId, fileCount, fileIndex, fileName, progress, totalSize, usedTime){
        if (this.onProgress) {
            this.onProgress({
                taskId: taskId,
                fileCount: fileCount,
                fileIndex: fileIndex,
                fileName: fileName,
                progress: progress,
                totalSize: totalSize,
                usedTime: usedTime
            });
        }
    },
    _uploadClipboardFileOnStop: function(taskId, fileCount, fileIndex, fileName, resultCode, responseText){
        ScreenShotControl.uploading = false;
        if (this.onStop) {
            this.onStop({
                taskId: taskId,
                resultCode: resultCode,
                fileCount: fileCount,
                fileIndex: fileIndex,
                fileName: fileName,
                responseText: responseText
            });
        }
    },
    getObj: function(){
        var obj = document.getElementById("ScreenSnapshotctrl");
        if (obj) {
            this.getObj = function(){
                return obj;
            }
            return obj;
        }
        return null;
    },
    enable: function(){
        try {
            var version = this.getObj().GetVersion();
            if (top.SiteConfig && top.SiteConfig.screenControlVersion && top.SiteConfig.screenControlVersion > version) {
                return false;
            }
            return true;
        } 
        catch (e) {
            return false;
        }
    },
    /**
     * 是否需要升级
     * <pre>示例：<br>
     * <br>ScreenShotControl.needToUpdate();
     * </pre>
     * @return{true||false}
     */
    needToUpdate: function(){
        try {
            var version = this.getObj().GetVersion();
            if (top.SiteConfig && top.SiteConfig.screenControlVersion && top.SiteConfig.screenControlVersion > version) {
                return true;
            }
            return false;
        } 
        catch (e) {
            return false;
        }
    },
    /**
     * 得到上传ID
     * <pre>示例：<Br>
     * <br>ScreenShotControl.getUploadId();
     * </pre>
     * @return {int}
     */
    getUploadId: function(){
        if (this.randomUploadId) {
            this.randomUploadId++;
        }
        else {
            this.randomUploadId = 1;
        }
        return this.randomUploadId;
    },
    
    shot: function(param){
        var taskId = this.getUploadId();
        if (this.enable() && this.enable()) {
            if (!this.isUploading()) {
                this.getObj().GetScreenSnapshotImg(taskId, param.uploadUrl, param.cookie || document.cookie);
                return true;
            }
            else {
                alert("文件上传中,请稍后...");
                return false;
            }
        }
        else {
            return false;
        }
    },
    /**
     * 设置限传文件大小
     * <pre>示例：<br>
     * <br>ScreenShotControl.setUploadFileSizeLimit(1000);
     * </pre>
     * @param {Object} limit 必选参数，文件大小。
     * @return {无返回值}
     */
    setUploadFileSizeLimit: function(limit){
        if (typeof limit == "number") {
            this.getObj().SetUploadFileSizeLimit(limit);
        }
        else {
            this.getObj().SetUploadFileSizeLimit(limit());
        }
    },
    /**
     * 上传剪贴板的文件
     * <pre>示例：<br>
     * <br>ScreenShotControl.uploadClipboardFile(param);
     * </pre>
     * @param {Object} param 必选参数，json格式，上传的地址、cookie信息
     * @return {无返回值}
     */
    uploadClipboardFile: function(param){
        if (this.enable() && !this.isUploading()) {
            var taskId = this.getUploadId();
            this.getObj().UploadClipboardFile(taskId, param.uploadUrl, param.cookie || document.cookie);
        }
    },
    /**
     * 上传剪贴板的图片
     * <pre>示例：<br>
     * <br>ScreenShotControl.uploadClipboardImg(param);
     * </pre>
     * @param {Object} param 必选参数，json格式，上传的地址、cookie信息
     * @return {无返回值}
     */
    uploadClipboardImg: function(param){
        if (this.enable() && !this.isUploading()) {
            var taskId = this.getUploadId();
            this.getObj().UploadClipboardFile(taskId, param.uploadUrl, param.cookie || document.cookie);
        }
    },
    /**
     * 停止请求
     * <pre>示例：<br>
     * <br>ScreenShotControl.stop(taskId);
     * </pre>
     * @param {string} taskId 必选参数，要停止任务ID
     * @return {无返回值}
     */
    stop: function(taskId){
        this.getObj().StopUpload(taskId || this.randomUploadId);
    },
    /**
     * 是否正在上传,每次限制只能传一个
     * <pre>示例：<br>
     * <br>ScreenShotControl.isUploading();
     * </pre>
     * @return{无返回值}
     */
    isUploading: function(){
        return this.uploading;
    }
}


