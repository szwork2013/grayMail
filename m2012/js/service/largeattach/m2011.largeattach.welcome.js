var sharingWelcome = {
    //请求的服务器地址
    url: {
        //获取欢迎页面配置信息
        getWelcomeDataUrl: function() {
            return fileSharing.resolveUrl("getWelcomeData");
        },
        //获取暂存柜文件信息
        getFilesUrl: function() {
            return fileSharing.resolveUrl("getFiles");
        },
        getFileDetailUrl: function() {
            return fileSharing.resolveUrl("batfiledetail");
        }
    },
    //事件、方法
    action: {
        //页面加载
        pageLoad: function() {
            var isToSend = false;
            var fileId = Utils.queryString("fileId");
            var sendType = Utils.queryString("type");
            var toFileList = Utils.queryString("tofilelist");
            //用于记录欢迎页面数据
            var welcomeData = null;
            //用于记录暂存柜配置等数据
            var FolderInfo = null;
            var netDiskFiles = null;
            //续期  todo?
            if (toFileList) {
                // window.location.href = "filelistdisk.htm";
                top.MM.close();
                top.Links.show("diskDev", "&goid=9000", false);
                return;
            } else if (fileId && sendType) {
                //彩云文件进行文件快递
                isToSend = true;
                sharingWelcome.server.getFileDetail(fileId, function() {
                    netDiskFiles = this;
                });
            } else {
                //获取暂存柜相关信息
                sharingWelcome.server.getFiles(function() {
                    FolderInfo = this;
                });
                //获取数据判断是否显示欢迎页面            
                sharingWelcome.server.getWelcomeData(function() {
                    welcomeData = {};
                    welcomeData.isShowUploadGuide = (this.showUploadGuide <= 0);
                });
            }
            //彩云文件进行文件快递
            if (isToSend && netDiskFiles && netDiskFiles.length > 0) {
                var topNetDiskFiles = new top.Array();
                $(netDiskFiles).each(function() {
                    var ff = new top.Object();
                    for (var key in this) {
                        ff[key] = this[key];
                    }
                    ff.fileType = "netDisk";
                    topNetDiskFiles.push(ff);
                });
                fileSharing.tool.keepFiles(topNetDiskFiles);
                window.location.href = "largeattach_send.html?sid={0}#{1}".format(fileSharing.tool.getUserInfo(), sendType);
            } else if (welcomeData && welcomeData.isShowUploadGuide == false) {
                //暂存柜有数据则直接跳转到文件发送页面
                window.location.href = "largeattach_send.html?sid={0}#{1}".format(fileSharing.tool.getUserInfo(), sendType ? sendType : "email");
            } else {
                Utils.loadSkinCss(null, document, "fileExp");
            }
            //添加行为
            fileSharing.tool.addBehavior({
                actionId: 10476,
                thingId: 0,
                moduleId: 11,
                actionType: 20
            });
            $(function() {
                if (FolderInfo) {
                    $("#spSize").text(fileSharing.tool.getFileSizeText(FolderInfo.folderSize));
                    $("#spRemainDays").text(FolderInfo.keepDays);
                    var maxSizeStr = "1G";
                    if (top.SiteConfig.comboUpgrade) {
                        maxSizeStr = (Math.floor(top.$User.getCapacity("maxannexsize") / 1024) || 4) + "G";//maxannexsize的单位默认是M
                    }
                    $("#maxSizeUpload").html(maxSizeStr);
                    var maxSizeTips = " 在这里，你可以将最大{0}的文件快递到任意邮箱，还可以将最大3M的文件快递到任意中国移动手机。";
                    $("#maxSizeTips").html(maxSizeTips.format(maxSizeStr));
                }
                $("#btnEnter").click(function() {
                    window.location.href = 'largeattach_send.html?sid={0}#email'.format(fileSharing.tool.getUserInfo());
                });
            });
        }
    },

    //呈现页面相关信息
    render: {},

    server: {

        //获取暂存柜文件信息
        //actionId:  0: 获取暂存柜配置信息、文件列表
        //           1: 获取暂存柜配置信息
        //           2: 获取暂存柜文件列表信息
        getFiles: function(callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            $.postXml({
                url: sharingWelcome.url.getFilesUrl(),
                data: XmlUtility.parseJson2Xml({
                    actionId: 1
                }),
                async: false,
                success: function (result) {
                    if (this.code == fsConfig.isOk) {
                        if (callback) { callback.call(this["var"]); }
                    }
                    else { fileSharing.FF.alert(this.summary); }
                },
                error: function(error) {
                    fileSharing.tool.handleError(error);
                }
            });
        },

        //获取欢迎页面信息
        getWelcomeData: function(callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            $.postXml({
                url: sharingWelcome.url.getWelcomeDataUrl(),
                async: false,
                success: function(result) {
                    //处理album数据
                    if (this.code == fsConfig.isOk) {
                        if (callback) { callback.call(this); }
                    }
                    else { fileSharing.FF.alert(this.summary); }
                },
                error: function(error) {
                    fileSharing.tool.handleError(error);
                }
            });
        },

        //获取欢迎页面信息
        getFileDetail: function(fileIds, callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            $.postXml({
                url: sharingWelcome.url.getFileDetailUrl(),
                data: XmlUtility.parseJson2Xml({ fileids: fileIds }),
                async: false,
                success: function(result) {
                    //处理album数据
                    if (this.code == fsConfig.isOk) {
                        if (callback) {
                            var result = this["var"].files;
                            var files = [];
                            if (result && result.length > 0) {
                                files = $.map(result, function(f) {
                                    return {
                                        fileName: f.srcfilename,
                                        fileSize: f.filesize,
                                        pid: "",
                                        fileId: f.fileid,
                                        fileGUID: f.file_ref_id,
                                        uploadTime: f.uploadtime
                                    };
                                });
                            }
                            callback.call(files);
                        }
                    }
                    else { fileSharing.FF.alert(this.summary); }
                },
                error: function(error) {
                    fileSharing.tool.handleError(error);
                }
            });
        }
    }
}

//执行代码
sharingWelcome.action.pageLoad();