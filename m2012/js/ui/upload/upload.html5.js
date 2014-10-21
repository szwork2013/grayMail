/*
 * html5方式上传
 */
var Html5Upload = function (options) {
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

Html5Upload.include = function (o) {
    var included = o.included;
    for (var i in o) this.prototype[i] = o[i];
    included && included();
};

Html5Upload.include({
    init: function (options) {
        this.initParams(options);
        this.bindEvent();
    },

    initParams: function (options) {
        this.controler = options.controler;
        this.model = options.model;

        this.fileNamePre = options.fileNamePre || "filedata";
        this.perSize = options.perSize || 1024 * 50;
        this.btnUploadId = options.btnUploadId;
    },

    bindEvent: function(){
        var self = this;
		var fileInput = null;
        if(typeof(this.btnUploadId) == "string"){
			fileInput = document.getElementById(this.btnUploadId);
		}else{
			fileInput = this.btnUploadId;
		}

        fileInput.setAttribute("multiple", "true");
        this.btnUploadEle = fileInput;
        fileInput.onchange = function(){
            self.selecteFileHandle();
            self.model.uploadClickBehavior(self.controler);
            fileInput.parentNode.reset();
        };
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
        var filesLen = this.files.length;

        this.addFile();
        this.controler.trigger("select", {fileList: this.files.slice(filesLen)});
    },

    addFile: function(){
        var fileList = this.btnUploadEle.files;

        for (var i = 0, len = fileList.length; i < len; i++) {
            var file = fileList[i];

            this.files.push(fileList[i]);
        }
    },

    //重置上传队列
    setFileList: function (fileList) {//fileList为引用型指向files，直接修改files即可
        for (var i = 0, len = this.files.length; i < len; i++) {
            var file = this.files[i];

            if (file.state == 0) {
                this.files.splice(i, 1);
                i--;
                len--;
            }
        }

        if (!this.uploading) {
            this.model.get("currentFile").state = "prepareupload";
            this.controler.update();
        }
    },

    getFileInfo: function () {
        if (this.isBegin) {
            this.isBegin = false;
            return this.currentFile;
        }

        this.currentFile = this.files[this.currentFileIndex++];
        !this.currentFile && this.currentFileIndex--;

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
        var isBreakpointUpload = !!packData.ranges;
        var isMcloud = packData.isMcloud;//是否存彩云

        this.storeBusinessId(packData.businessId);

        delete packData.urlUpload;
        delete packData.businessId;
        delete packData.isMcloud;

        var fileUpload = this.currentFile;
        var dataComplete = 0;

        if (packData.ranges) {//断点续传
            dataComplete = self.getCompleteSize(packData.ranges); //单一分段 2000 ranges: 0-1000  rang: 1001-1999

            //根据断点信息，如果发现文件已经上传完成，就不再上传
            if (dataComplete == this.currentFile.size - 1) self.onload();
            packData.range = dataComplete + "-" + (this.currentFile.size - 1);
            fileUpload = this.fileSlice(this.currentFile, dataComplete, this.currentFile.size);
        } else {//第一次上传
            packData.range = 0 + "-" + (this.currentFile.size - 1);
        }

        delete packData.ranges;//ranges 代表已经上传的部分，去掉，只传range(代表所传文件的片段)

        this.currentFile.dataComplete = dataComplete;//记录上次完成上传的文件大小

        var formData = new FormData;

        var xhr = new XMLHttpRequest();
        this.xhr = xhr;
        xhr.open("post", urlUpload, true);
        xhr.withCredentials = true;

        if (isMcloud == "1") {//存彩云用户
            packData.Range = "bytes=" + packData.range;
            delete packData.range;

            if (packData.contentSize === "") {
                packData.contentSize = this.model.get("currentFile").size;
            }

            for (var j in packData) xhr.setRequestHeader(j, packData[j]);

            // 文件名进行url编码，否则设置中文名时报错
            xhr.setRequestHeader("Content-Type", "application/octet-stream;name=" + encodeURIComponent(this.model.get("currentFile").name));
            xhr.setRequestHeader("x-NameCoding", "urlencoding");
        } else {
            for (var j in packData) formData.append(j, packData[j]);
        }

        formData.append(self.fileNamePre, fileUpload);

        if (!isBreakpointUpload) {
            xhr.upload.addEventListener("loadstart", function(){
                self.onloadstart();
            }, false);
        }
        xhr.upload.addEventListener("progress", function(e){self.onprogress(e);}, false);
        xhr.addEventListener("load", function(e){self.onload(e)}, false);
        //xhr.addEventListener("error", function(){self.onerror()}, false);
        xhr.addEventListener("abort", function(){self.oncancel()}, false);
        xhr.addEventListener("timeout", function(){self.ontimeout()}, false);
        xhr.addEventListener("readystatechange", function(){self.onreadystatechange(xhr)}, false);

        if (isMcloud == "1") {//存彩云用户
            xhr.send(fileUpload);
        } else {
            xhr.send(formData);
        }
    },

    // 139返回ranges格式为0-1000; 彩云返回的ranges格式为1000;
    getCompleteSize: function (ranges) {
        var rangesArr = ranges.split(";");
        var firstCompleteRange = rangesArr[0];
        var completeSize = 0;

        if (firstCompleteRange) {
            if (firstCompleteRange.indexOf("-") > -1) {
                completeSize = Number(firstCompleteRange.split("-")[1]);
            } else {
                completeSize = Number(firstCompleteRange.split("-")[0]);
            }
        }

        return completeSize;
    },

    onloadstart: function(){
        this.model.get("currentFile").state = "loadstart";
        this.controler.update();
    },

    onprogress: function (e) {
        var dataComplete = this.currentFile.dataComplete;

        console.log("上次上传大小：" + this.currentFile.dataComplete);
        console.log("已上传大小  ：" + (dataComplete + e.loaded));
        console.log("文件总大小  ：" + (dataComplete + e.total));

        if (e.lengthComputable) {
            var speed = this.getSpeed(e.loaded);
            var surplusTime = speed == 0 ? 0 : Math.round((e.total - e.loaded) / speed);

            this.model.get("currentFile").state = "progress";
            this.model.get("currentFile").sendSize = dataComplete + e.loaded;
            this.model.get("currentFile").totalSize = dataComplete + e.total;
            this.model.get("currentFile").speed = top.M139.Text.Utils.getFileSizeText(speed) + "/S";
            this.model.get("currentFile").surplusTime = this.model.transformTime(surplusTime);
            this.controler.update();

            return;
        }

        console.log(this.msg.NOUPLOAD);
    },

    onmd5progress: function (percent) {
        console.log(percent);

        this.model.get("currentFile").state = "md5progress";
        this.model.get("currentFile").md5Percent = percent;
        this.controler.update();
    },

    onload: function (e) {
        var target = e ? e.target : {};
        console.log(this.currentFile.name + "上传成功！");
        console.log("分布式响应文本：" + target.responseText || "获取断点信息时，发现之前已上传完成了该文件");

        this.uploading = false;

        this.model.get("currentFile").state = "complete";
        this.model.get("currentFile").responseText = target.responseText || true;
        this.controler.update();
    },

    onerror: function(){
        this.model.get("currentFile").state = "error";
        this.model.get("currentFile").isContinueUpload = true;
        this.controler.update();
        this.uploading = false;

        var errTxt = "fileName:" + this.model.get("currentFile").name;
        this.model.errLogByHtml5(errTxt);
    },

    onabort: function(){
        this.xhr.abort();
    },

    oncancel: function(){
        var errTxt = "中断上传！";
        this.model.errLogByHtml5(errTxt);
    },

    ontimeout: function(){
        var errTxt = "ontimeout";
        this.model.errLogByHtml5(errTxt);
    },

    onreadystatechange: function (xhr) {
        if (xhr.readyState === 4) {
            if (xhr.status == 0) {
                this.errorHandler();
            }
        }
    },

    errorHandler: function(){
        if (!this.model.get("isStop")) {//没有点暂停，就是网络中断
            this.controler.monitorToResume();

            var errTxt = "fileName:" + this.model.get("currentFile").name + "|error:网络断开了！";
            this.model.errLogByHtml5(errTxt);
        }
    },

    storeBusinessId: function (businessId) {
        this.currentFile[businessId] = businessId;
    },

    getFileMd5: function (callback) {
        this.timeBegin = new Date;
        this.uploading = true;

        var output = [],
            worker,
            file_id = 1;

        var md5WorkUrl = this.controler.config.resourceUrlForMd5 + "/calculator.worker.md5.js";

        output.push('<tr>', '<td>MD5</td><td> <div class="progress progress-striped active" style="margin-bottom: 0px" id="md5_file_hash_', file_id, '"><div class="bar"></div></div></td></tr>');
        worker = new Worker(md5WorkUrl);
        worker.addEventListener('message', this.handle_worker_event("md5_file_hash_" + file_id, callback));

        this.hash_file(this.currentFile, worker);

        //document.getElementById('list').innerHTML = '<table class="table table-striped table-hover">' + output.join('') + '</table>' + document.getElementById('list').innerHTML;
    },

    hash_file: function (file, worker) {
        var i, buffer_size, block, threads, reader, blob;
        var self = this;

        var handle_load_block = function (event) {
            threads += 1;
            worker.postMessage({
                'message':event.target.result,
                'block':block
            });
        };

        var handle_hash_block = function (event) {
            threads -= 1;

            if (threads === 0) {
                if (block.end !== file.size) {
                    block.start += buffer_size;
                    block.end += buffer_size;

                    if (block.end > file.size) {
                        block.end = file.size;
                    }
                    reader = new FileReader();
                    reader.onload = handle_load_block;
                    blob = self.fileSlice(file, block.start, block.end);

                    reader.readAsArrayBuffer(blob);
                }
            }
        };
        buffer_size = 64 * 16 * 1024;
        block = {
            'file_size':file.size,
            'start':0
        };

        block.end = buffer_size > file.size ? file.size : buffer_size;
        threads = 0;

        worker.addEventListener('message', handle_hash_block);
        reader = new FileReader();
        reader.onload = handle_load_block;
        blob = this.fileSlice(file, block.start, block.end);

        reader.readAsArrayBuffer(blob);
    },

    handle_worker_event: function (id, callback) {
        var self = this;

        return function (event) {
            var doc = document;
            var fileHashEle = doc.getElementById(id);
            if (event.data.result) {
                console.log(Math.round(((new Date).getTime() - self.timeBegin.getTime()) / 1000));
                callback && callback(event.data.result);
            } else {
                self.onmd5progress(Math.floor(event.data.block.end * 100 / event.data.block.file_size) + "%");
            }
        };
    },

    getSpeed: function (loadedSize) {
        var progressData = this.progressData;
        var nowTime = (new Date).getTime();
        var speed = 0;

        if (progressData.endTime !== 0) {
            speed = Math.round((loadedSize - progressData.loadedSize) / ((nowTime - progressData.endTime) / 1000));
            speed = Math.abs(speed);//续传做一下容错，将负值转换成正值，虽然瞬时速度值不对，但不影响
        }

        progressData.endTime = nowTime;
        progressData.loadedSize = loadedSize;

        return speed;
    },

    fileSlice: function (file, sendSize, end) {
        var type = file.type;

        if (file.slice) {
            return file.slice(sendSize, end, type);
        } else if (file.webkitSlice) {
            return file.webkitSlice(sendSize, end, type);
        } else if (file.mozSlice) {
            return file.mozSlice(sendSize, end, type);
        }
    }
});
