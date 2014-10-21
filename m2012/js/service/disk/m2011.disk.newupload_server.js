var UploadServer = {
    urls: {
        getPreUploadUrl: function() {
            return DiskTool.resolveUrl('quickPreUpload', true);
        },
        getUploadSuccessUrl: function() {
            return DiskTool.resolveUrl('diskUploadSuccess', true);
        },
        getUploadKeyUrl: function() {
            return DiskTool.resolveUrl('getQuickUploadKey', true);
        },
        getDeleteUploadUrl: function() {
            return DiskTool.resolveUrl('deleteUploadFile', true);
        }
    },
    //请求服务器，改变文件状态
    changeFileState: function(file, type, callback) {
        var status = type == "success" ? 0 : 2;
        //预上传
        var url = UploadServer.urls.getPreUploadUrl();
        //上传成功
        if (status == 0) {
            url = UploadServer.urls.getUploadSuccessUrl();
        }
        var data = {
            fileName: XmlUtility.escape(file.fileName),
            fileSize: file.fileSize,
            fileId: file.fileId ? file.fileId : "",
            status: status,
            fileRefId: file.storageId,
            fileExt: XmlUtility.escape(DiskTool.getFileExtName(file.fileName)),
            comefrom: file.comeFrom,
            bitemId: file.bitemId,
            dirId: file.dirId,
            virusStatus: file.virus ? "1" : "0",
            utype: 2
        };
        var retryTimes = 0;
        (function send() {
            $.postXml({
                url: url,
                data: XmlUtility.parseJson2Xml(data),
                timeout: 30000,
                success: function(result) {
                    var result = { success: false };
                    if (this.code == DiskConf.isOk) {
                        var value = this["var"];
                        if (value.errorCode == 0) {
                            result.success = true;
                            result.fileId = value.fileId;
                        }
                    } else if (this["var"]) {
                        var value = this["var"];
                        result.errorCode = value.ErrorCode;
                        //剩余容量不足
                        if (result.errorCode == 1) {
                            result.overLength = true;
                        }
                        //超过单个文件最大限制
                        else if (result.errorCode == 2) {
                            result.overFileLength = true;
                        }
                        //其他情况直接抛出错误信息
                        else {
                            result.errorMsg = this.summary;
                        }
                    }
                    if (callback) { callback(result); }
                },
                error: function(error) {
                    if (type == "success" && retryTimes < 2) {
                        send();
                        retryTimes++;
                    }
                }
            });
        })();
    },
    //获取分布式上传地址和key
    getUploadKey: function(file, callback) {
        var data = {
            fileSize: file.fileSize,
            fileName: XmlUtility.escape(file.fileName)
        };
        //断点续传
        if (file.storageId) {
            data.storageId = file.storageId;
        }
        $.postXml({
            url: UploadServer.urls.getUploadKeyUrl(),
            data: XmlUtility.parseJson2Xml(data),
            timeout: 30000,
            success: function() {
                var result = { success: false };
                if (this.code == DiskConf.isOk) {
                    var value = this["var"];
                    if (value.errorCode == 0) {
                        result.success = true;
                        result.ip = value.domain;
                        result.port1 = value.port1;
                        result.port2 = value.port2;
                        result.missionId = value.taskNumber;
                        result.key = value.fileKey;
                        result.serverTime = value.serverTime;
                        result.commandcgi = value.commandCgi;
                        result.datacgi = value.dataCgi;
                        result.status = value.status;
                    }
                } else if (this["var"]) {
                    var value = this["var"];
                    if (value.errorCode == 14) {
                        result.code = 14;
                        result.size = value.taskNumber;
                    } else if (value.errorCode == 2) {
                        result.overLength = true;
                    } else {
                        result.errorMsg = this.summary;
                    }
                }
                if (callback) { callback(result); }
            },
            error: function() {
                var result = { success: false };
                if (callback) { callback(result); }
            }
        });
    },
    //删除文件
    deleteFile: function(fileId, callback) {
        $.postXml({
            url: UploadServer.urls.getDeleteUploadUrl(),
            data: XmlUtility.parseJson2Xml({
                fileId: fileId
            }),
            async: false,
            success: function() {
                var result = { success: false };
                result.success = this.code == DiskConf.isOk;
                if (callback) { callback(result); }
            },
            error: function(error) {
                var result = { success: false };
                if (callback) { callback(result); }
            }
        });
    },
    checkFileSafe: function(filePath, fileSize) {
        return this.checkFileNameLengthSafe(filePath)
        && this.checkFileExtendNameSafe(filePath)
        && this.checkFileSizeSafe(filePath, fileSize);
    },
    checkFileNameLengthSafe: function(filePath) {
        var fileName = DiskTool.getFileName(filePath);
        if (DiskTool.len(fileName) > DiskConf.MaxUploadFileNameLength) {
            UploadServer.checkFileError = FileNameLength.format(DiskTool.getFileName(filePath).shortName(), acceptMaxFileLength);
            return false;
        }
        return true;
    },
    checkFileExtendNameSafe: function(filePath) {
        var extend = DiskTool.getFileExtName(filePath);
        var accept = true;
        if (this.isPhotoUpload()) {
            accept = CheckAlbum(filePath);
        } else if (this.isMusicUpload()) {
            accept = CheckMusic(filePath);
        }
        return accept;
    },
    checkFileSizeSafe: function(filePath, fileSize) {
        if (fileSize == 0) {
            UploadServer.checkFileError = fuErrorMsg_fileMinSizeLimited.format(DiskTool.getFileName(filePath).shortName());
            return false;
        } else {
            if (fileSize > fileUploadMaxSize) {
                var msg = fuErrorMsg_UploadMaxSize;
                if (top.UserData.vipInfo && top.UserData.vipInfo.serviceitem != "0016" && top.UserData.vipInfo.serviceitem != "0017") {
                    msg = fuErrorMsg_UploadMaxSize1;
                }
                UploadServer.checkFileError = msg.format(DiskTool.getFileName(filePath).shortName(), DiskTool.getFileSizeText(fileUploadMaxSize));
                return false;
            }
        }
        return true;
    },
    /**
    *是否是相册上传
    */
    isPhotoUpload: function() {
        return Utils.queryString("comefrom") == "1"
        || document.getElementById("stPosition").value.split("-")[0] == "1";
    },
    /**
    *是否是音乐上传
    */
    isMusicUpload: function() {
        return Utils.queryString("comefrom") == "2"
        || document.getElementById("stPosition").value.split("-")[0] == "2";
    }
}
//每次发送文件
var fileLimited = 5;
var fileUploadMaxSize = 50 * 1024 * 1024;
var BanLvfileUploadMaxSize = 100 * 1024 * 1024;
var fuErrorMsg_fileLimited = "一次做多只能发送{0}个文件";
var fuErrorMsg_fileMinSizeLimited = "您添加的文件\"{0}\"大小为0，不能上传！";
var fuErrorMsg_fileMaxSizeLimited = "您添加的文件\"{0}\"大于50M，不能上传！";
var fuErrorMsg_BanLvfileMaxSizeLimited = "您添加的文件\"{0}\"大于100M，不能上传！";
var fuErrorMsg_UploadMaxSize = "您添加的文件{0}大于{1}，不能上传！";
var fuErrorMsg_UploadMaxSize1 = "文件{0}大小超过上限{1}，不能上传！<a onclick=\"top.$App.showOrderinfo()\" href=\"javascript:void(0)\" style=\"color: Blue;text-decoration:underline\">升级邮箱</a>可上传更大彩云文件。";
var fuErrorMsg_fileNotFound = "找不到文件,无法续传,请重新上传!";
var fuErrorMsg_fileExist = "文件\"{0}\"已经存在上传列表中，请勿重复添加";
var fuErrorMsg_ServerEorror = "服务器异常,无法上传";

//设置上传大小
(function() {
    var win = DiskTool.getDiskWindow().parent;
    if (win.DiskMainData && win.DiskMainData.UploadMaxSize) {
        fileUploadMaxSize = parseInt(win.DiskMainData.UploadMaxSize);
    }
    top._diskUploadWindow.upgradeGuide = function() {
        DiskTool.addDiskBehavior({
            actionId: 102321,
            thingId: 0,
            moduleId: 11,
            actionType: 20
        });

        top.FF.close();
        top.Links.show('upgradeGuide');
        //  top._diskUploadWindow.closeButton.click();
    }
})();

