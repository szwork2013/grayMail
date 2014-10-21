/**
 * @fileOverview 定义文件快递（超大附件）快速上传视图（安装小工具后才能用的组件功能）
 */

/*
    fileId 控件上传队列id
    storageId 分布式存储分配的id
    uploadId 数据库中存在记录的已完整、未完成的文件记录id
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.LargeAttach.FastUploadView";

    M139.namespace(namespace, superClass.extend(
    /**@lends M2012.UI.LargeAttach.FastUploadView.prototype*/
    {
        /** 定义文件快递（超大附件）flash上传界面
         *@constructs M2012.UI.LargeAttach.FastUploadView
         *@extends M139.View.ViewBase
         *@param {Object} options 初始化参数集
         *@param {HTMLElement} options.container 控件容器元素
         *@example
         
         */
        initialize: function (options) {
            this.model = options.model;
            this.fastUploadModel = new M2012.UI.LargeAttach.FastUploadModel({});

            this.files = new Backbone.Collection;

            var html = $T.Utils.format(this.template, {maxUploadSize: M139.Text.Utils.getFileSizeText(this.model.MaxUploadSize)});
            $(html).appendTo(options.container);

            this.setElement(options.container);
            this.globalName = this.getGlobalName();
            this.controlId = this.getControlId();
            return superClass.prototype.initialize.apply(this, arguments);
        },


        template: ['<div class="boxIframeText bigatta">',
            '<div class="topBtn"><a href="javascript:void(0)" class="btnNormal SelectFile"><span>添加文件</span></a></div>',
            '<div class="attaList" style="height:300px">',
                '<p class="gray pl_10 pt_10 pb_10 pr_10">',
                    '可同时上传多个文件，单文件最大{maxUploadSize}；<br>',
                    '文件有效期为15天，可在暂存柜续期；<br>',
                    '若您删除了文件，或文件已过期，收件人将无法下载；<br>',
                    '请遵守国家相关法律，严禁上传反动、暴力、色情、违法及侵权内容。</p>',
            '</div>',
        '</div>'].join(""),

        switchListMode:function(){
            //隐藏提示语，切换到上传队列视图
            this.$(".attaList > p").hide();
        },

        /**
         *获得此对象的全局引用，因为此对象需要跟c++控件交互，所以需要暴露到全局
         *@inner
         */
        getGlobalName: function () {
            var rnd = parseInt(Math.random() * 100000000);
            var name = "_fastupload_handler" + rnd;
            window[name] = this;
            return name;
        },
        /**
         *随机创建一个控件id
         *@inner
         */
        getControlId: function () {
            var rnd = parseInt(Math.random() * 100000000);
            var name = "_fastupload_" + rnd;
            return name;
        },

        events: {
            "click .SelectFile": "onSelectFileClick"
        },

        render: function () {
            this.initUploadControl();
            this.initEvents();
            return superClass.prototype.render.apply(this, arguments);
        },


        isSupportControlUpload: function () {
            return M139.Plugin.FastUpload.checkControlSetup() > 0;
        },

        /**
         *初始化ActiveX上传控件
         *@inner
         */
        initUploadControl: function () {
            this.control = M139.Plugin.FastUpload.createControl({
                controlId: this.controlId,
                container: this.el,
                globalHandler: this.globalName
            });
        },


        initEvents: function () {
            var This = this;
            this.files.on("add", function (itemModel) {
                This.createItemView(itemModel);
                This.tryUploadNext();
            });

            this.on("remove", function () {
                this.stopAll();
                this.el.innerHTML = "";//销毁控件
            });

            //打开对话框后自动弹出windows文件选择框
            this.on("print", function () {
                this.openDialog();
            });
        },

        getSuccessFiles:function(){
            var succFiles = this.files.filter(function (itemModel) {
                return itemModel.get("state") == "Success";
            });
            return succFiles;
        },

        getUploadingFiles:function(){
            var uploadingFiles = this.files.filter(function (itemModel) {
                return itemModel.get("state") == "Uploading";
            });
            return uploadingFiles;
        },

        tryUploadNext: function () {
            var This = this;

            if (this.getUploadingFiles().length < this.fastUploadModel.MaxUploadingCount) {

                var waitFile = this.files.find(function (itemModel) {
                    return itemModel.get("state") == "Waiting";
                });
                if (waitFile) {
                    var fileInfo = {
                        filePath: waitFile.get("filePath"),
                        fileName: waitFile.get("fileName"),
                        fileSize: waitFile.get("fileSize"),
                        fileId: waitFile.get("fileId"),
                        storageId: waitFile.get("storageId")
                    };
                    waitFile.set("state", "Uploading");
                    this.fastUploadModel.getUploadKey(fileInfo, function (result) {
                        if (result.success) {
                            upload(result.serverInfo);
                        } else {
                            var msg = result.message || "获取上传地址失败";
                            waitFile.set("errorMsg", msg);
                            waitFile.set("state", "Fail");
                        }
                    });
                }
            }

            function upload(serverInfo) {
                var param = {};
                jQuery.extend(param, serverInfo);
                jQuery.extend(param, fileInfo);
                console.log("do uploading file");
                M139.Plugin.FastUpload.uploadFile(This.control, param);
            }
        },

        /**
         *关闭所有窗口前要停止所有上传任务，只移除控件还不行
         *@inner
         */
        stopAll:function(){
            var upFiles = this.getUploadingFiles();
            for (var i = 0; i < upFiles.length; i++) {
                var f = upFiles[i];
                this.stopUpload(f.get("fileId"));
            }
        },

        /**
         *@inner
         */
        stopUpload:function(fileId){
            M139.Plugin.FastUpload.stopUpload(this.control, fileId);
        },

        /**
         *删除文件
         */
        deleteFile:function(itemModel){
            var storageId = itemModel.get("storageId");
            var uploadId = itemModel.get("uploadId");
            var prevState = itemModel.previous("state");
            if (prevState == "Uploading") {
                M139.Plugin.FastUpload.stopUpload(this.control, itemModel.get("fileId"), {
                    isDelete: true,
                    storageId: storageId
                });
            }
            if (itemModel.get("state") != "Success") {//上传成功就不从服务器删除了
                this.fastUploadModel.deleteFile(uploadId, function (result) {
                    if (result.success) {
                        M139.UI.TipMessage.show("删除成功", { delay: 3000 });
                    }
                });
            }
        },

        createItemView: function (itemModel) {
            var This = this;
            var view = new UploadItemView({
                model: itemModel
            });

            this.switchListMode();
            view.render().$el.appendTo(this.$(".attaList"));
            itemModel.on("change:state", function (model, state) {
                This.onItemStateChange(model, state);
            });
        },

        isUploading:function(){
            var uploadingItem = this.files.find(function (item) {
                return item.get("state") == "Uploading";
            });
            return !!uploadingItem;
        },

        /**
         *当有文件状态发生变化，计算出一些数据，给外部的表现层使用
         */
        onItemStateChange: function (model, state) {
            if (state == "Delete") {
                this.deleteFile(model);
                this.files.remove(model);
            } else if (state == "GotoStop") {
                this.stopUpload(model.get("fileId"));
                return;
            }


            var failFiles = this.files.filter(function (item) { 
                return item.get("state") == "Fail";
            });
            var successCount = this.getSuccessFiles().length;
            var uploading = this.isUploading();
            this.model.set("uploading", uploading);
            this.model.set("fileCount", this.files.length);
            this.model.set("failCount", failFiles.length);
            this.model.set("successCount", successCount);
            //兼容flash控件的status
            this.model.set("status", {
                isUploading: uploading,
                fileTotal: this.files.length,
                progressTotal: 0,
                speedTotal: 0
            });

            this.tryUploadNext();//尝试上传队列文件


            this.trigger("uploadprogress", {
                status: status
            });
        },

        onSelectFileClick: function () {
            this.openDialog();
        },

        onSelectFile: function (files) {
            var MaxSize = this.model.MaxUploadSize;

            //判断大小
            for (var i = 0; i < files.length; i++) {
                var f = files[i];
                if (f.fileSize > MaxSize) {
                    var error = "您选择的文件“{0}”超过了单个文件最大限制{1},请重新选择！"
                        .format(M139.Text.Url.getOverflowFileName(f.fileName), M139.Text.Utils.getFileSizeText(MaxSize));
                } else if (f.fileSize === 0) {
                    var error = "您选择的文件“{0}”大小为0,无法上传！"
                        .format(M139.Text.Url.getOverflowFileName(f.fileName));
                }
                if (error) {
                    $Msg.alert(error, {
                        icon: "warn"
                    });
                    return;
                }
            }

            for (var i = 0; i < files.length; i++) {
                var f = files[i];
                if (this.isExistFile(f.filePath)) {
                    M139.UI.TipMessage.show("文件重复添加:" + f.filePath, {
                        delay: 3000
                    });
                } else {
                    this.files.add({
                        fileName: f.fileName,
                        fileSize: f.fileSize,
                        filePath: f.filePath,
                        fileId: this.fastUploadModel.getNewUploadFileId(),
                        uploadedSize: 0,
                        state: "Waiting"
                    });
                }
            }
        },

        /**
         *添加续传的文件任务
         */
        addContinueUpload: function (fileInfo) {
            var storageId = fileInfo.storageId;
            var filePath;
            var count = this.control.gettaskcount();
            for (var i = 0; i < count; i++) {
                if (storageId == this.control.gettaskfileid(i)) {
                    filePath = this.control.gettaskfilename(i);
                }
            }
            //todo 找不到可以续传的文件
            //fileSharing.FF.alert(sharingBox.messages.ContinueError);
            this.files.add({
                fileName: fileInfo.fileName,
                fileSize: fileInfo.fileSize,
                filePath: filePath,
                fileId: this.fastUploadModel.getNewUploadFileId(),
                uploadId: fileInfo.fileId,
                storageId: fileInfo.storageId,
                uploadedSize: 0,
                state: "Waiting"
            });
        },


        /**
         *判断文件是否已选择
         */
        isExistFile:function(filePath){
            var match = this.files.find(function (itemModel) {
                return itemModel.get("filePath") === filePath;
            });
            return !!match;
        },

        getItemByFileId:function(fileId){
            var match = this.files.find(function (itemModel) {
                return itemModel.get("fileId") === fileId;
            });
            return match;
        },

        /**
         *打开windows上传文件
         *@inner
         */
        openDialog: function () {
            var files = M139.Plugin.FastUpload.openWindowFileDialog(this.control, {
                filter: "*.*",
                dialogTitle: "请选择要上传的文件"
            });
            if (files.length > 0) {
                this.onSelectFile(files);
            }
        },
        /**
         *C++控件触发：上传前调用
         */
        onUploadStart: function (fileId) {
            console.log("c++ onUploadStart:" + fileId);
            var itemModel = this.getItemByFileId(fileId);
            if (itemModel) {
                itemModel.set("state", "Uploading");
                //如果有滚动条，滚动到正在上传的文件处
                this.scrollToFirstUploadingFile();
            } else {
                //存在移除的时间差
                this.stopUpload(fileId);
            }
        },
        /**
         *C++控件触发：上传进度变更时触发
         */
        onUploadProgress: function (fileId, progress, uploadsize, times) {
            console.log("c++ onUploadProgress:" + [fileId, progress, uploadsize, times].join(","));
            var itemModel = this.getItemByFileId(fileId);
            if (itemModel) {
                itemModel.set("state", "Uploading");
                itemModel.set("uploadedSize", uploadsize);
            }
            /*
            this.lastUploadTip = status;

            this.model.set("uploading", status.isUploading);
            this.model.set("fileCount", status.fileTotal);
            if (!status.isUploading) {
                this.model.set("failCount", status.fileTotal - status.progressTotal);
            }
            this.model.set("status", status);

            this.trigger("uploadprogress", {
                status: status
            });
            */
        },
        /**
         *C++控件触发：上传动作停止
         */
        onUploadStop: function (fileId, result, fileIdOfServer) {
            console.log("c++ onUploadStop:" + [fileId, result, fileIdOfServer].join(","));
            var resultState = ["success", "stopped", "unknownerror", "virus"];
            var r = resultState[result] || resultState[2]; //超过3,默认为2
            var itemModel = this.getItemByFileId(fileId);

            if (!itemModel) {
                return;//已经移除掉了
            }

            itemModel.set("storageId", fileIdOfServer);
            /*todo
            if (result >= 2 && top.ScriptErrorLog) {
                fileSharing.tool.tryCatch(function () {
                    top.ScriptErrorLog.addLog("project:LargeAttachments【{0}】version:{1},resultCode:{2},storageId:{3},fileName:{4},fileSize:{5},progress:{6},userAgent:{7}"
                    .format(top.UserData.userNumber, (window.proxyWindow || window).uploadControl.getversion(),
                            result, fileIdOfServer, file.fileName, file.fileSize, file.progress, navigator.userAgent));
                });
            }
            */
            var state = "Fail";
            var errorMsg = "";
            if (r == "success") {
                this.fastUploadModel.changeFileState({
                    state: 0,//上传成功
                    fileName: itemModel.get("fileName"),
                    fileSize: itemModel.get("fileSize"),
                    storageId: itemModel.get("storageId")
                }, function (result) {
                    if (result.success) {
                        itemModel.set("uploadId", result.uploadId);
                        itemModel.set("state", "Success");
                    } else {
                        itemModel.set("errorMsg", result.message);
                        itemModel.set("state", "Fail");
                    }
                });
                return;

            } else if (r == "virus") {
                if (file.uploadId) {
                    this.fastUploadModel.deleteFile(fileIdOfServer);
                }
                errorMsg = "此文件包含病毒";
            } else if (r == "stopped") {
                state = "Stop";
            } else {
                errorMsg = "未知错误";
            }
            if(errorMsg){
                itemModel.set("errorMsg", errorMsg);
            }
            itemModel.set("state", state);
        },
        /**
         *C++控件触发：控件产生日志
         */
        onLog: function (logText) {
            console.log("c++ onLog:" + logText);
            top.M139.Logger.sendClientLog({
                name: "FastUploadControl",
                errorMsg: logText
            });
        },
        /**
         *C++控件触发：开始上传时触发，此时已经获得了分布式存储文件id
         */
        onPrepare: function (fileId, fileIdOfServer) {
            var This = this;
            console.log("c++ onPrepare:" + [fileId, fileIdOfServer].join(","));
            var itemModel = this.getItemByFileId(fileId);

            
            if (itemModel.get("uploadId")) {
                console.log("c++ onPrepare again and return");
                return;//续传的时候重新触发 此时已经在上传了 所以不执行操作
            }

            itemModel.set("storageId", fileIdOfServer);



            var obj = {
                fileName: itemModel.get("fileName"),
                fileSize: itemModel.get("fileSize"),
                state: 2,
                storageId: fileIdOfServer
            };
            //分布式取到id后，从前端服务申请上传
            this.fastUploadModel.changeFileState(obj, function (result) {
                if (result.success) {
                    itemModel.set("uploadId", result.uploadId);
                    return;
                } else if (result.overMaxSize) {//文件大小超过容量
                    
                } else if (result.fileNameError) {//文件名非法
                    
                }
                M139.Plugin.FastUpload.stopUpload(This.control, fileId);
                itemModel.set("errorMsg", result.message);
                itemModel.set("state", "Fail");
            });
        },

        /**
         *取得上传成功的文件列表
         */
        getUploadedFileList: function () {
            var list = this.getSuccessFiles();
            return _.map(list, function (item) {
                return {
                    fileId: item.get("uploadId"),
                    fileName: item.get("fileName"),
                    fileSize: item.get("fileSize")
                };
            });
        },

        isUploadComplete: function () {
            if (this.isUploading()) {
                return false;
            } else {
                return true;
            }
        },

        scrollToFirstUploadingFile: function () {
            var uploadingItem = this.getUploadingFiles()[0];
            if (uploadingItem) {
                var fileId = uploadingItem.get("fileId");
                var element = this.$el.find("div[fileId='" + fileId + "']")[0];
                if (element) {
                    try{
                        element.scrollIntoView();
                    } catch (e) { }
                }
            }
        }

    }));


    //文件状态视图：排队、上传中、上传失败、上传成功
    var UploadItemView = superClass.extend({
        initialize: function (options) {
            this.model = options.model;

            this.setElement(jQuery(this.template.Container));

            return superClass.prototype.initialize.apply(this, arguments);
        },

        events:{
            "click .BtnDelete": "onDeleteButtonClick",
            "click .BtnRetry": "onRetryButtonClick",
            "click .BtnStop" : "onStopButtonClick"
        },

        render: function () {
            this.renderAll();
            this.initEvent();
            return superClass.prototype.render.apply(this, arguments);
        },

        /**
         *显示文件名
         *@inner
         */
        renderFileName:function(){
            var fileName = this.model.get("fileName");
            var extName = M139.Text.Url.getFileExtName(fileName);
            //文件名
            this.$(this.template.P_FileName).text(M139.Text.Utils.getTextOverFlow(M139.Text.Url.getFileNameNoExt(fileName), 20, true));
            //扩展名
            this.$(this.template.P_FileNameExt).text("." + extName);
            //图标
            this.$(this.template.P_FileIcon).addClass("i_f_" + extName);
        },

        /**
         *显示进度条
         *@inner
         */
        renderProgress: function () {
            var uploadedSize = this.model.get("uploadedSize");
            var fileSize = this.model.get("fileSize");
            var percent = (Math.floor(uploadedSize / fileSize * 100) || 0) + "%";

            this.$(this.template.P_ProgressBar).css("width", percent);
            this.$(this.template.P_ProgressText).text(percent);
        },

        /**
         *显示上传速度(这里暂时没显示速度，只有"上传大小/总大小"）
         *@inner
         */
        renderSpeed:function(){
            var uploadedSize = this.model.get("uploadedSize");
            var fileSize = this.model.get("fileSize");
            var fileSizeText = M139.Text.Utils.getFileSizeText(fileSize);
            var text = "(" + M139.Text.Utils.getFileSizeText(uploadedSize) + "/" + fileSizeText + ")";
            this.$(this.template.P_Speed).text(text);
            this.$(this.template.P_FileSize).text("(" + fileSizeText + ")");
            //todo
            //this.$(this.template.P_RemainTime)
        },

        /**
         *打印上传失败的原因
         *@inner
        */
        renderFailMsg:function(){
            var errorMsg = this.model.get("errorMsg");
            if (errorMsg) {
                this.$(this.template.P_ErrorTip).text(errorMsg);
            }
        },

        /**
         *显示整体界面
         *@inner
         */
        renderAll: function () {
            var state = this.model.get("state");
            this.$el.attr("fileId", this.model.get("fileId"));
            if (state == this.States.Delete) {
                this.$el.remove();
            } else {
                var innerHTML = this.template[state];
                if (innerHTML) {
                    this.el.innerHTML = innerHTML;
                    this.renderFileName();
                    this.renderProgress();
                    this.renderSpeed();

                    if (state == this.States.Fail) {
                        this.renderFailMsg();
                    }
                }
            }
        },

        /**
         *绑定事件
         *@inner
         */
        initEvent: function () {
            var This = this;
            this.model.on("change:state", function (model, state) {
                This.renderAll();
            }).on("change:speed", function (model, speed) {
                This.renderSpeed();
            }).on("change:uploadedSize", function (model, uploadedSize) {
                This.renderSpeed();
                This.renderProgress();
            });
        },

        States:{
            Waiting:"Waiting",
            Fail: "Fail",
            Stop: "Stop",
            Uploading:"Uploading",
            Success: "Success",
            Delete: "Delete",
            GotoStop: "GotoStop"
        },

        onDeleteButtonClick: function () {
            var This = this;
            $Msg.confirm("是否要删除文件？", function () {
                This.model.set("state", This.States.Delete);
            }, {
                icon:"warn"
            });
        },

        onRetryButtonClick:function(){
            this.model.set("state", this.States.Waiting);
        },

        onStopButtonClick: function () {
            this.model.set("state", this.States.GotoStop);
        },


        template: (function () {
            var temp = {
                P_FileName: ".FileName",
                P_FileNameExt: ".FileNameExt",
                P_Speed: ".Speed",
                P_ProgressBar: ".ProgressBar",
                P_BtnRetry: ".BtnRetry",
                P_BtnDelete: ".BtnDelete",
                P_ErrorTip: ".UploadErrorTip",
                P_FileIcon: ".FileIcon",
                P_ProgressText: ".ProgressText",
                P_RemainTime: ".RemainTime",
                P_FileSize: ".FileSize",
                Container: '<div class="attaListLi"></div>',
                Uploading: [
                    '<i class="i_file FileIcon"></i>',
                    '<div class="attaListLiText">',
                        '<p><span class="FileName">111</span><span class="gray FileNameExt">.jpg</span><span class="gray Speed">(40.5m/50M)</span></p>',
                        '<div class="">',
                            '<span class="progressBarDiv">',
                                    '<span class="progressBar"></span>',
                                    '<span class="progressBarCur">',
                                        '<span style="width: 0%;" class="ProgressBar"></span>',
                                    '</span>',
                                '</span><span class="ProgressText"></span>',
                        '</div>',
                    '</div>	',
                    '<div class="attaListLiText2"><a href="javascript:;" class="BtnStop">暂停</a> | <a class="BtnDelete" href="javascript:;">删除</a><br><span class="gray RemainTime"></span></div>'
                ].join(""),
                Stop: [
                    '<i class="i_file FileIcon"></i>',
                    '<div class="attaListLiText">',
                        '<p><span class="FileName">111</span><span class="gray FileNameExt">.doc</span><span class="gray Speed"></span></p>',
                        '<div class="">',
                            '<span class="progressBarDiv">',
                                    '<span class="progressBar"></span>',
                                    '<span class="progressBarCur">',
                                        '<span style="width: 0;" class="ProgressBar"></span>',
                                    '</span>	',
                                '</span> <span class="gray">已暂停</span>',
                        '</div>',
                    '</div>',
                     '<div class="attaListLiText2"><a href="javascript:;" class="BtnRetry">继续</a> | <a href="javascript:;" class="BtnDelete">删除</a></div>'
                ].join(""),
                Fail: [
                    '<i class="i_file FileIcon"></i>',
                    '<div class="attaListLiText">',
                        '<p><span class="red FileName">134554465465464</span><span class="gray FileNameExt">.mp3</span><span class="gray Speed"></span></p>',
                        '<div class="">',
                            '<span class="red UploadErrorTip">上传失败</span>',
                        '</div>',
                    '</div>	',
                    '<div class="attaListLiText2"><a href="javascript:;" class="BtnRetry">重试</a> | <a href="javascript:;" class="BtnDelete">删除</a></div>'
                ].join(""),
                Waiting: [
                    '<i class="i_file FileIcon"></i>',
                    '<div class="attaListLiText">',
                        '<p><span class="FileName">111</span><span class="gray FileNameExt">.doc</span><span class="gray Speed"></span></p>',
                        '<div class="">',
                            '<span class="progressBarDiv">',
                                    '<span class="progressBar"></span>',
                                    '<span class="progressBarCur">',
                                        '<span style="width: 0;" class="ProgressBar"></span>',
                                    '</span>	',
                                '</span> <span class="gray">等待中</span>',
                        '</div>',
                    '</div>',
                    '<div class="attaListLiText2"><a href="javascript:;" class="BtnDelete">删除</a></div>'
                ].join(""),
                Success: [
                    '<i class="i_file FileIcon"></i>',
                    '<div class="attaListLiText">',
                        '<p><span class="FileName">111</span><span class="gray FileNameExt">.pdf</span><span class="gray FileSize"></span></p>',
                        '<div class="">',
                            '<span class="c_009900">上传成功</span>',
                        '</div>',
                    '</div>',
                    '<div class="attaListLiText2"><a class="BtnDelete" href="javascript:;">删除</a>',
                    '</div>'
                ].join("")
            };
            return temp;
        })()
    });


})(jQuery, _, M139);