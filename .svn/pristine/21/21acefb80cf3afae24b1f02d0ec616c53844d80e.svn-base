/*
 * html5方式上传
 */
var CommonUpload = function (options) {
    this.perSize            = "";
    this.fileNamePre        = "";
    this.btnUploadEle       = {};//上传文件按钮

    this.files              = [];//上传文件队列

    this.currentFile        = {};//当前上传的文件
    this.currentFileIndex   = 0;

    this.xhr                = {};
    this.uploading          = false;
    this.isBegin            = false;//暂停之后续传使用

    this.continueUploadCount= 0;//断网续传次数

    this.progressData       = {//每个时间点发送文件大小
        endTime             : 0,
        loadedSize          : 0
    };

    this.init(options);
};

CommonUpload.include = function (o) {
    var included = o.included;
    for (var i in o) this.prototype[i] = o[i];
    included && included();
};

CommonUpload.include({
    init: function (options) {
        this.initParams(options);
        this.createIframeUpload();
        this.bindEvent();
    },

    initParams: function (options) {
        this.controler = options.controler;
        this.model = options.model;
        this.subModel = options.subModel;

        this.isMcloud = this.subModel.get("isMcloud");
        this.fileNamePre = options.fileNamePre || "filedata";
        this.btnUploadId = options.btnUploadId;
    },

    bindEvent: function(){
        var self = this;
    //    var fileInput = document.getElementById(this.btnUploadId);
		var fileInput = null;
        if(typeof(this.btnUploadId) == "string"){
			fileInput = document.getElementById(this.btnUploadId);
		}else{
			fileInput = this.btnUploadId;
		}

        this.btnUploadEle = fileInput;
        fileInput.onchange = function(){
            self.selecteFileHandle();
            self.model.uploadClickBehavior(self.controler);
        };

        this.frmUpload.load(function(){
            self.frmUploadHandle();
        });
    },

    frmUploadHandle: function(){
        var self = this;
        var frmUploadWindow = this.frmUpload[0].contentWindow;

        try {
            if(frmUploadWindow.location.href.indexOf("blank.htm")>0){
                return;
            }

            console.log(frmUploadWindow.location.href);

            this.model.get("currentFile").state = "complete";
            this.model.get("currentFile").responseText = frmUploadWindow.location.href.replace(/&amp;/g, "&");
            this.controler.update();
        } catch (ex) {

        }
    },

    createIframeUpload: function(){
//        var html = '<iframe id="frmUploadTarget" src="/blank.htm"></iframe>';
        this.frmUpload = $("#frmUploadTarget");
        this.form = $("#fromUpload");

        if (this.isMcloud == "1") {//普通上传存彩云，需要上传参数uploadCode
            this.form.prepend('<input type="hidden" name="uploadCode" id="uploadCode" />')
                .prepend('<input type="hidden" name="redirectURL" id="redirectURL" />');
        }
    },

    setFileType: function (type) {
        var newType = "";

        if (type == "image") {
            newType = "image/*";
        } else if (type == "music") {
            newType = "audio/*";
        } else {
            newType = "*/*";
        }
        this.btnUploadEle.setAttribute("accept", newType);
    },

    selecteFileHandle: function(){
        this.addFile();
        this.controler.trigger("select", {fileList: this.files});
    },

    addFile: function(){
        this.files = [];//清空上传队列

        var fileList = [{
            name: this.getFileName()
        }];

        for (var i = 0, len = fileList.length; i < len; i++) {
            var file = fileList[i];

            this.files.push(fileList[i]);
        }
    },

    getFileName: function(){
        var match = this.btnUploadEle.value.match(/(\\)?([^\\]*)$/);

        return match && match[2];
    },

    //重置上传队列
    setFileList: function (fileList) {//fileList为引用型指向files，直接修改files即可
        if (!this.uploading) {
            this.model.get("currentFile").state = "prepareupload";
            this.controler.update();
        }
    },

    getFileInfo: function () {
        this.currentFile = this.files[this.currentFileIndex++];
        !this.currentFile && (this.currentFileIndex = 0);

        return this.currentFile;
    },

    getFileByClientTaskno: function (clientTaskno) {
        for (var i = 0, len = this.files.length; i < len; i++) {
            var file = this.files[i];

            if (file.clientTaskno == clientTaskno) {
                return file;
            }
        }
    },

    setCurrentFile: function (clientTaskno) {
        for (var i = 0, len = this.files.length; i < len; i++) {
            var item = this.files[i];

            if (item.clientTaskno == clientTaskno) {
                this.currentFile = item;
                this.isBegin = true;
            }
        }
    },

    setExtData: function (param) {
        //js中obj是引用型的，已经在外部扩展了参数，不需要再处理了。
    },

    getCurrentFileParam: function (key) {
        return this.currentFile[key] || "";
    },

    /*
     * html5 上传接口
     * @param {Object} packData 上传的post数据
     */
    upload: function (packData) {
        var self = this;
        var urlUpload = packData.urlUpload;

        this.form.attr("action", urlUpload);
        if (this.isMcloud == "1") {
            $("#uploadCode").attr("value", packData.uploadCode);
            $("#redirectURL").attr("value", self.model.commonUploadResultUrl + "?uploadRet");
        }
        this.form.submit();
        this.form[0].reset();
    },

    getCompleteSize: function (ranges) {
        var rangesArr = ranges.split(";");
        var firstCompleteRange = rangesArr[0];

        return firstCompleteRange && Number(firstCompleteRange.split("-")[1]);
    },

    onloadstart: function(){
        this.model.get("currentFile").state = "loadstart";
        this.controler.update();
    },

    onerror: function(){
        this.model.get("currentFile").state = "error";
        this.model.get("currentFile").isContinueUpload = true;
        this.controler.update();
        this.uploading = false;
    },

    storeBusinessId: function (businessId) {
        this.currentFile[businessId] = businessId;
    },

    getFileMd5: function (callback) {
        //
    }
});
