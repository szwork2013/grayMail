//�����ؼ���װ
ScreenShotControl = {
    /**
     * д�ؼ�
     * <pre>ʾ����<br>
     * <br>ScreenShotControl.writeHtml();
     * </pre>
     * @return {�޷���ֵ}
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
     * �Ӽ����忪ʼ�ϴ����¼�
     * @param {Object} taskId ��ѡ�������ļ�id��
     * @param {Object} fileCount ��ѡ�������ļ�����
     * @param {Object} fileIndex ��ѡ�������±�(�ڼ����ļ�)��
     * @param {Object} fileName ��ѡ�������ļ�����
     * @return {�޷���ֵ}
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
     * �Ƿ���Ҫ����
     * <pre>ʾ����<br>
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
     * �õ��ϴ�ID
     * <pre>ʾ����<Br>
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
                alert("�ļ��ϴ���,���Ժ�...");
                return false;
            }
        }
        else {
            return false;
        }
    },
    /**
     * �����޴��ļ���С
     * <pre>ʾ����<br>
     * <br>ScreenShotControl.setUploadFileSizeLimit(1000);
     * </pre>
     * @param {Object} limit ��ѡ�������ļ���С��
     * @return {�޷���ֵ}
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
     * �ϴ���������ļ�
     * <pre>ʾ����<br>
     * <br>ScreenShotControl.uploadClipboardFile(param);
     * </pre>
     * @param {Object} param ��ѡ������json��ʽ���ϴ��ĵ�ַ��cookie��Ϣ
     * @return {�޷���ֵ}
     */
    uploadClipboardFile: function(param){
        if (this.enable() && !this.isUploading()) {
            var taskId = this.getUploadId();
            this.getObj().UploadClipboardFile(taskId, param.uploadUrl, param.cookie || document.cookie);
        }
    },
    /**
     * �ϴ��������ͼƬ
     * <pre>ʾ����<br>
     * <br>ScreenShotControl.uploadClipboardImg(param);
     * </pre>
     * @param {Object} param ��ѡ������json��ʽ���ϴ��ĵ�ַ��cookie��Ϣ
     * @return {�޷���ֵ}
     */
    uploadClipboardImg: function(param){
        if (this.enable() && !this.isUploading()) {
            var taskId = this.getUploadId();
            this.getObj().UploadClipboardFile(taskId, param.uploadUrl, param.cookie || document.cookie);
        }
    },
    /**
     * ֹͣ����
     * <pre>ʾ����<br>
     * <br>ScreenShotControl.stop(taskId);
     * </pre>
     * @param {string} taskId ��ѡ������Ҫֹͣ����ID
     * @return {�޷���ֵ}
     */
    stop: function(taskId){
        this.getObj().StopUpload(taskId || this.randomUploadId);
    },
    /**
     * �Ƿ������ϴ�,ÿ������ֻ�ܴ�һ��
     * <pre>ʾ����<br>
     * <br>ScreenShotControl.isUploading();
     * </pre>
     * @return{�޷���ֵ}
     */
    isUploading: function(){
        return this.uploading;
    }
}


