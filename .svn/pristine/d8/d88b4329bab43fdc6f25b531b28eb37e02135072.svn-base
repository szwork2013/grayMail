/*
上传组件，IE浏览器默认flash上传，其它浏览器html5

示例:
    var fileUpload = new FileUpload({
        container: document.getElementById("uploadBtn"),
        onselect: function (files) {
            var self = this;
            $(files).each(function (i, n) {
                updateUI(n);
            });
            setTimeout(function () { //异步，等待onselect函数return后才能调用upload
                self.upload();
            }, 10);
        },
        onprogress: function (fileInfo) {
            updateUI(fileInfo);
        },
        oncomplete: function (fileInfo, responseText) {
            updateUI(fileInfo);
           
        }
    });
*/

function FileUpload(options) {
    var uploader = null;
    var elementIndex = Math.random().toString().substr(2);//用于创建多个实例
    //console.log(elementIndex);
    if (options) {
        //为什么要多创建一级div容器？flash 的activex创建后，再改变位置会引起activex对象失效，所以要在创建前就定好位
        var div = document.createElement("div");
        div.id = "UploadDiv" + elementIndex;
        div.style.zIndex = 9999;
        document.body.appendChild(div);
        var c = $(options.container);

        function dock(dockContainer) {
            if (dockContainer) {
                c = $(dockContainer);
            }
            //绝对定位到上传按钮的坐标，flash本身为透明遮罩
            $(div).css({
                position: "absolute",
                left: c.offset().left + "px",
                opacity: 0,
                top: c.offset().top + "px"
            });
            console.log($(div).attr('id') + " c.offset().left = " + c.offset().left + 'px');
            console.log($(div).attr('id') + " c.offset().top = " + c.offset().top + 'px');
            // 重新修正里面内嵌元素的高度
            // IE下修正object, 非IE下修正input
            $(div).find("input,object").css({
                width : c.width(),
                height: c.height(),
                overflow: 'hidden'
            });
        }
        dock();
        function isShow(bool) {
            bool ? $(div).css({
                "margin-left" : "0px"   // 将容器重置
            }) : $(div).css({
                "margin-left" : "-999px" // 不隐藏DIV而是将容器移走, 在Chrome下如果隐藏了input,不会触发change事件
            });
        }
                
        function reset() {
            $(div).find('input').get(0).value = '';
        }

        function getMarginLeft() {
            return $(div).css('margin-left');
        }

        if ($.browser.msie || options.uploadType == "flash") {
            var objName = "JSForFlashUpload_" + elementIndex;
            //flash上传方式
            var url = (options.swfPath || "/m2012/flash/Richinfo_annex_upload.swf") + "?name=" + objName;
            var so = new SWFObject(url, "flashupload" + elementIndex, c.width(), c.height());
            so.addParam("wmode", "transparent");
            so.write(div.id);

            options.activexObj = document.getElementById("flashupload" + elementIndex);

            window[objName] = new FlashUpload(options);
            uploader = window[objName];

          
        } else {

            $(div).html(['<form style="" enctype="multipart/form-data" id="fromAttach" method="post" action="" target="frmAttachTarget">',
                 '<input style="overflow: hidden; height: ', c.height(), 'px; width: ', c.width(), 'px;" type="file" name="uploadInput" id="uploadInput' + elementIndex + '" multiple="true">',
                 '</form>',
                 '<iframe id="frmAttachTarget" style="display: none" name="frmAttachTarget"></iframe>'].join(""));
            options.uploadInput = document.getElementById("uploadInput" + elementIndex);
            uploader = new Html5Upload(options);
           
        }

    }
    
    this.dock = dock;
    this.isShow = isShow;
    this.reset = reset;
    this.getMarginLeft = getMarginLeft;
    this.upload = function () {//触发上传请求
        //alert("uploader.load");
        uploader.upload();
    },
    this.cancel = function () {//取消上传
        uploader.cancel();
    }
    this.getUploadFiles = function () {//获取上传队列
        uploader.getUploadFiles();
    }
    
    $.extend(options, this);//继承FileUpload的能力
}


var FlashUpload = function(options){
    
    var resultObject = {
        activexObj: options.activexObj,
        upload:function(){
            this.activexObj.uploadAll();
        },
        cancel: function () {
            this.activexObj.cancel();
        },
        getUploadUrl: function () {
            return this.agent.getUploadUrl();
        },
        getUploadFiles: function () {
            return this.uploadFiles;
        },
        onload: function (param) {
            this.agent = {};
            if (options) {
                this.agent = options;
            }
            param["filter"] = ["images图片(*.jpg;*.png;*.bmp)", "video(*.flv;*.avi;*.rmvb)"];
            param["uploadFieldName"] = "filedata";
            //options["filter"] = ["eml邮件(*.eml)"];
            //options["filter"] = ["所有文件(*.*)"];
            return param;
        },
        onselect: function (xmlFileList, jsonFileList) {

            for (var i = 0; i < jsonFileList.length; i++) {
                jsonFileList[i].fileName = decodeURIComponent(jsonFileList[i].fileName);
                jsonFileList[i].state = "waiting";
                /*if (jsonFileList[i].fileSize > 100000) { //大于100K不上传
                    jsonFileList.splice(i, 1);
                    i--;
                }*/
            }
            //uploadView.onselect(jsonFileList);
            this.agent.onselect && this.agent.onselect(jsonFileList);

            this.uploadFiles = jsonFileList;
            return jsonFileList;
        },
        onprogress: function (taskId, sendedSize, uploadSpeed, fileInfo) {
            fileInfo.taskId = taskId;
            fileInfo.sendedSize = sendedSize;
            fileInfo.percent = Math.round((sendedSize / fileInfo.fileSize) * 100);
            fileInfo.state = "uploading";
            fileInfo.fileName = decodeURIComponent(fileInfo.fileName);//防止乱码，flash里面做了encode
            //alert(fileInfo.percent);
            this.agent.onprogress && this.agent.onprogress(fileInfo);
        },
        oncomplete: function (taskId, responseText, fileInfo) {
            fileInfo.taskId = taskId;
            fileInfo.state = "complete";
            fileInfo.fileName = decodeURIComponent(fileInfo.fileName);//防止乱码，flash里面做了encode
            this.agent.oncomplete && this.agent.oncomplete(fileInfo, responseText);
        },
        onerror: function (taskId, errorCode, errorMsg) {
            alert("文件上传失败：" + errorMsg);
            this.agent.onerror && this.agent.onerror(errorMsg);
        },
        onmouseover: function () {

        },
        onmouseout: function () {

        },
        onclick: function () {
            top.BH && options.logKey && top.BH(options.logKey);
            return true;//返回false不会弹出文件选择框
            //alert("onclick");
        }

    }
    return resultObject;
}

var Html5Upload = function (options) {
    var resultObject = {
        uploadInput: null,
        currentFile: null,
        uploadFiles:[],//待上传的文件
        completeFiles:[],//已完成的文件
        init: function () {
            var self = this;
            this.agent = options;
            this.uploadInput = options.uploadInput;
            this.uploadInput.onclick = this.onclick;
            this.uploadInput.onchange = function () {
                var files = this.files;
                var result = [];
                for (var i = 0; i < files.length; i++) {
                    result.push({
                        fileName: files[i].name,
                        fileSize: files[i].size,
                        fileData: files[i],
                        state : "waiting",
                        taskId: Math.random().toString().substr(2)
                    });
                }
                self.uploadFiles = result;
                self.onselect(result);
            }
        },
        getFileUploadXHR: function () { //单例
            if (!window.fileUploadXHR) {
                fileUploadXHR = new XMLHttpRequest();
            }
            this.xhr = window.fileUploadXHR;
            return fileUploadXHR;
        },
        getUploadUrl: function () { //获取上传地址
            return this.agent.getUploadUrl();
        },
        getUploadFiles:function(){ //获取上传队列
            return this.uploadFiles.concat(this.completeFiles);
        },
        upload: function () {//开始上传请求
            this.uploadNextFile();
        },
        cancel:function(){  //取消上传
            this.xhr.abort();
        },
        uploadNextFile: function () { //每个上传文件会触发
            var fileInfo = this.uploadFiles.shift();
            this.completeFiles.push(fileInfo); //存入已完成列表
            this.currentFile = fileInfo;
            if (fileInfo) {
                var self = this;
                var xhr = this.getFileUploadXHR();

                xhr.upload.onabort = function (oEvent) { };
                xhr.upload.onerror = function (oEvent) { self.onerror(oEvent); };
                xhr.upload.onload = function (oEvent) { self.onload(oEvent); };
                xhr.upload.onloadend = function (oEvent) { };
                xhr.upload.onloadstart = function (oEvent) { };
                xhr.upload.onprogress = function (oEvent) {
                    console.log(oEvent);
                    fileInfo.state = "uploading";
                    fileInfo.sendedSize = oEvent.position;
                    fileInfo.percent = Math.round((oEvent.position / oEvent.total) * 100);
                    self.onprogress(fileInfo);
                };
                //xhr.ontimeout = function(oEvent){This.ontimeout(oEvent);};
                xhr.onreadystatechange = function (oEvent) {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            var responseText = xhr.responseText;
                            self.oncomplete(fileInfo, responseText);
                        }
                    }
                };


                var url = this.getUploadUrl();
                xhr.open("POST", url, true);

                //xhr.timeout = this.timeout; //timeout
                function getFormData(fileInfo) {
                    var formData = new FormData();
                    formData.append("filedata", fileInfo.fileData);
                    return formData;
                }
                var fd = getFormData(fileInfo);
                xhr.send(fd);
            }
        },
        onclick: function () {
            top.BH && options.logKey && top.BH(options.logKey);
        },
        onselect:function(files){
            this.agent.onselect && this.agent.onselect(files);
        },
        onload:function(e){
        },
        onerror:function(e){
            this.agent.onerror && this.agent.onerror(e);
        },
        onprogress: function (fileInfo) {
            this.agent.onprogress && this.agent.onprogress(fileInfo);
        },
        oncomplete: function (fileInfo, responseText) {
            fileInfo.state = "complete";
            this.agent.oncomplete && this.agent.oncomplete(fileInfo, responseText);
            this.uploadNextFile();
        }
    }

    resultObject.init();
    return resultObject;
}