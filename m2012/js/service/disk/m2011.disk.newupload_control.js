var postCardExt = "png,jpg,jpeg,gif,";
var MAX_UPLOADLIMIT = 3;
var Control_Enforce_Update = true; //小工具强制升级开关
var Control_Enforce_Version = 196871; //低于该版本强制升级

var ControlMessage = {
    0: "完成",
    101: "操作失败:消息结构错误,二进制帧结构错(101)",
    102: "非法source,如comefrom错误或者用户IP未授权等(102)",
    103: "认证错或者校验错,用户名认证错或者md5串校验错(103)",
    104: "版本错误(104)",
    105: "磁盘空间不足(105)",
    106: "存储不可用(106)",
    107: "请求超时(107)",
    108: "请求不合法或含有非法参数(108)",
    109: "文件不存在(109)",
    100: "部分成功(100)",
    110: "系统错误(110)",
    111: "文件超过限定大小(111)",
    112: "解析请求出错(112)",
    113: "其他错误(113)",
    114: "上传文件成功，但文件中毒(114)",
    115: "不支持的压缩格式(115)",
    118: "上传文件已经存在(118)",
    119: "SSOID验证失败(119)",
    120: "Userlevel不合法(120)",
    121: "Md5验证错误(121)",
    199: "操作失败(199)",
    536870912: "用户取消上传(536870912)",
    536870913: "指定的文件不存在，可能已经完成或被删除(536870913)",
    536870914: "未找到文件信息，可能是断点信息已被删除或参数错误(536870914)",
    536870915: "内部参数错误(536870915)",
    536870916: "内部参数错误(536870916)",
    536870917: "内存不足，创建任务失败(536870917)",
    536870918: "上传的文件大小为0或超过最大限制(536870918)",
    536870919: "文件正在上传中(536870919)",
    536870920: "上传的文件被检测出病毒，上传失败！(536870920)",
    536870921: "自动重试上传次数过多，您的网络可能不稳定(536870921)",
    536870922: "连接服务器超时，请确认网络连接是否正常(536870922)",
    536870923: "读取文件失败，可能文件被其他应用程序占用或文件不存在(536870923)",
    536870924: "服务器连接错误，返回信息有误(536870924)",
    536870925: "网络连接错误，请确认网络连接是否正常(536870925)",
    536870926: "服务器连接被断开，请确认网络正常后重试(536870926)",
    536870927: "您选择的文件正在上传(536870927)",
    536870928: "连接超时，初始化网络失败(536870928)",
    536870929: "读取文件失败(536870929)",
    536870930: "网络状况差，等待其他任务完成后继续(536870930)",
    536870931: "源文件内容已改变，续传失败(536870931)",
    536870932: "上传失败(205)",
    536870933: "您上传的文件找不到，请重新选择上传文件(536870933)"
}
function GetControlMessage(errorCode) {
    var errorMsg = "上传失败(200)";
    if (errorCode) {
        if (errorCode < 200) {
            errorMsg = "服务器繁忙（" + errorCode + "）";
        } else {
            errorMsg = ControlMessage[errorCode] ? ControlMessage[errorCode] : "上传失败(200)";
        }
    }
    return errorMsg;
}
function UploadControl() {
    UploadControl.current = this;
    var This = this;
    var files = [];
    this.autoUploadNext = function() {
        if (!this.isDispose && this.countUploadingFiles() < MAX_UPLOADLIMIT) {
            return true;
        } else {
            return false;
        }
    }
    this.addFile = function(filePath, fileSize, storageId) {
        if (this.existsFile(filePath)) {
            top.FF.alert("文件“{0}”已经存在，请勿反复添加".format(filePath));
            return false;
        } else if (!UploadServer.checkFileSafe(filePath, fileSize)) {
            if (UploadServer.checkFileError) top.FF.alert(UploadServer.checkFileError);
            return false;
        }
        var param = {};
        param.uploadId = getRandomUploadId();
        param.state = "wait";
        param.filePath = filePath;
        param.fileSize = fileSize;
        param.fileName = DiskTool.getFileName(filePath);
        param.container = document.createElement("li");
        if (storageId) {
            param.storageId = storageId;
            param.isContinueUpload = true;
        }
        var item = new UploadFileItem(param);
        files.push(item);
        this.container.appendChild(item.container);
        item.refresh();
        if (window.onPageEvent_fileAdd) {
            window.onPageEvent_fileAdd(this, item);
        }
        return true;
    }
    this.removeFile = function(uploadId) {
        for (var i = 0; i < files.length; i++) {
            var f = files[i];
            if (f.uploadId == uploadId) {
                files.splice(i, 1);
                f.container.parentNode.removeChild(f.container);
                if (window.onPageEvent_fileRemove) onPageEvent_fileRemove(this);
                return true;
            }
        }
        return false;
    }
    this.existsFile = function(filePath) {
        for (var i = 0; i < files.length; i++) {
            if (files[i].filePath == filePath) {
                return true;
            }
        }
        return false;
    }
    this.getFile = function(uploadId) {
        for (var i = 0; i < files.length; i++) {
            if (files[i].uploadId == uploadId) {
                return files[i];
            }
        }
        return null;
    }
    this.getFiles = function() {
        return files.concat();
    }
    this.isUploading = function() {
        for (var i = 0; i < files.length; i++) {
            if (files[i].isUploading()) return true;
        }
        return false;
    }
    this.countUploadingFiles = function() {
        var count = 0;
        for (var i = 0; i < files.length; i++) {
            if (files[i].isUploading()) count++;
        }
        return count;
    }
    this.autoUpload = function() {
        top.Debug.write("try upload");
        if (this.autoUploadNext()) {
            var item = this.getNextUploadFile();
            if (item) {
                top.Debug.write("new upload");
                item.getUploadKey();
                this.autoUpload();
            }
        } else {
            top.Debug.write("no upload");
        }
    }
    this.getNextUploadFile = function() {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (file.state == "wait") return file;
        }
        if (this.getUploadFileIsAllFinish()) {
            $("#aUploadCloseBtn").html("完 成");
        }
        return null;
    }
    this.getUploadFileIsAllFinish = function() {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (file.state != "success") return false;
        }
        return true;
    }
    this.cancelAll = function() {
        var list = this.getFiles(); //先拷贝一份列表
        for (var i = 0; i < list.length; i++) {
            list[i].cancel();
        }
    }
    //浏览本地文件
    this.openFileDialog = function() {
        var accExt = "all files(*.*)|*.*||";
        if (UploadServer.isPhotoUpload()) {
            accExt = "image files(*.bmp;*.gif;*.ico;*.jpg;*.jpeg;*.png;*.tif;*.tiff)|*.bmp;*.gif;*.ico;*.jpg;*.jpeg;*.png;*.tif;*.tiff||";
        } else if (UploadServer.isMusicUpload()) {
            accExt = "music files(*.mid;*.wma;*.wav;*.mp3;*.cda)|*.mid;*.wma;*.wav;*.mp3;*.cda||";
        }
        var c = this.activex;
        if (c.getopenfilename(accExt, "请选择要上传的文件")) {
            var count = c.getfilecount();
            if (count > 50) {
                top.FF.alert("您不能一次性选择超过50个文件");
                return false;
            }
            for (var i = 0; i < count; i++) {
                var filePath = c.getfilename(i);
                var fileSize = c.getfilesize(i);
                this.addFile(filePath, fileSize);
            }
            this.autoUpload();
        }
    }
    this.init = function(param) {
        this.container = param.container;
        if (param.activex) {
            this.activex = param.activex;
        } else {
            this.activex = document.getElementById("cxdndctrl");
        }
        this.activex.setuserid(top.UserData.userNumber);
    }
    this.dispose = function() {
        this.cancelAll();
        this.isDispose = true;
    }
    //得到总的上传速度
    this.getGlobalSpeed = function() {
        var speed = 0;
        for (var i = 0; i < files.length; i++) {
            var f = files[i];
            if (f.state == "progress" && f.speed) {
                speed += f.speed;
            }
        }
        return speed;
    }
    //得到总体的上传进度
    this.getGlobalProgress = function() {
        //只算那些已经上传成功的,正在上传的,等待上传的
        var totalSize = 0;
        var totalProgress = 0;
        for (var i = 0; i < files.length; i++) {
            var f = files[i];
            if (f.isUploading() || f.state == "wait" || f.state == "success") {
                totalSize += f.fileSize;
                if (/complete|success/i.test(f.state)) {
                    totalProgress += f.fileSize;
                } else {
                    totalProgress += f.progress || 0;
                }
            }
        }
        if (totalSize > 0) {
            return totalProgress / totalSize;
        } else {
            return 0;
        }
    }
    //随机获得uploadId
    function getRandomUploadId() {
        var rnd = parseInt(Math.random() * 100000000);
        if (This.getFile(rnd)) {
            return getRandomUploadId();
        } else {
            return rnd;
        }
    }
}
function getUploadControlHtml() {
    var htmlCode =
        '<script language="javascript" type="text/javascript" for="cxdndctrl" event="onstart(uploadId)">\
            onUploadStart(uploadId);\
        </script>\
        <script language="javascript" type="text/javascript" for="cxdndctrl" event="onprogress(uploadId, progress, sendedSize, times)">\
            onUploadProgress(uploadId, progress, sendedSize, times);\
        </script>\
        <script language="javascript" type="text/javascript" for="cxdndctrl" event="onstop(uploadId, result, storageId)">\
            onUploadStop(uploadId, result, storageId);\
        </script>\
        <script language="javascript" type="text/javascript" for="cxdndctrl" event="onlog(logText)">\
            onLog(logText);\
        </script>\
        <script language="javascript" type="text/javascript" for="cxdndctrl" event="onprepare(uploadId, storageId)">\
            onUploadPrepare(uploadId, storageId);\
        </script>';
    if (document.all) {
        htmlCode += '<object id="cxdndctrl" classid="CLSID:0CEFA82D-A26D-491C-BAF7-604441B409FD"></object>';
    } else {
        htmlCode += '<embed id="cxdndctrl" type="application/x-richinfo-cxdnd3" height="1" width="1"></embed>';
        onstart = onUploadStart;
        onprogress = onUploadProgress;
        onstop = onUploadStop;
        onprepare = onUploadPrepare;
    }
    return htmlCode;
}
function onLog(logText) {
    DiskTool.sendLogMsg(logText, 10);
}
function onUploadStart(uploadId) {
    top.Debug.write("onstart:" + [uploadId].join(","));
    var uc = UploadControl.getCurrent();
    var item = uc.getFile(uploadId);
    if (item.hadStarted) {//重新连接
        item.state = "reconnect";
    } else {
        item.state = "scan"; //扫描
    }
    item.refresh();
}
function onUploadProgress(uploadId, progress, sendedSize, progressTimes) {
    top.Debug.write("onUploadProgress:" + [uploadId, progress, sendedSize, progressTimes].join(","));
    var uc = UploadControl.getCurrent();
    var item = uc.getFile(uploadId);
    item.updateProgress(progress, sendedSize, progressTimes);
}
function onUploadStop(uploadId, result, storageId) {
    top.Debug.write("onStop:" + [uploadId, result, storageId].join(","));
    var uc = UploadControl.getCurrent();
    var file = uc.getFile(uploadId);
    file.storageId = storageId;
    var resultState = ["complete", "stop", "unknowerror", "virus"];
    var state = resultState[result] || resultState[2]; //超过3,默认为2
    if (result >= 2 && top.ScriptErrorLog) {
        try {
            top.ScriptErrorLog.addLog("project:Disk【{0}】version:{1},resultCode:{2},storageId:{3},fileName:{4},fileSize:{5},progress:{6},userAgent:{7}"
            .format(
            top.UserData.userNumber,
            (window.proxyWindow || window).uploadControl.getversion(),
            result,
            storageId,
            file.fileName,
            file.fileSize,
            file.progress,
            navigator.userAgent));
        } catch (e) { }
    }
    if (result == 0) {
        onAndtotal(3020, "控件上传成功:" + storageId);
    } else if (result == 1) {
        //1表示人为停止
        onAndtotal(3021, "控件上传人为停止:" + storageId);
    } else if (result >= 2) {
        //2表示意外停止
        var info = "控件上传意外停止:" + result + " fileid:" + storageId;
        if (uc.activex.getversion() > 196866) {
            var errorCode = uc.activex.getstopreason(uploadId);
            var errorMsg = GetControlMessage(errorCode);
            info += " resultCode:" + errorCode;
            info += " errorMsg:" + errorMsg;
        }
        if (result == 2) {
            onAndtotal(3022, info);
        }
        else if (result == 3) {
            onAndtotal(3023, info);
        }
        else if (result == 4) {
            onAndtotal(3024, info);
        }
        else {
            onAndtotal(3025, info);
        }
    }


    file.state = state;
    if (state == "virus") file.virus = true;
    if (state == "complete" || state == "virus") {
        file.refresh();
        file.markUploadSuccess();
    } else {
        if (state == "stop") {
            if (file.removeFlag) {
                file.deleteAndRemove();
            } else if (file.overLength) {
                file.state = "error";
                file.errorMsg = "彩云剩余容量不足";
            }
        }
        else if (state == "unknowerror")//按控件代码提示错误
        {
            if (uc.activex.getversion() > 196866) {
                var errorCode = uc.activex.getstopreason(uploadId);
                var errorMsg = GetControlMessage(errorCode);
                file.errorMsg = errorMsg;
            }
        }
        file.refresh();
    }
    //手动暂停不继续其它任务
    if (state == "stop") {
        uc.autoUpload();
    }
}
function onUploadPrepare(uploadId, storageId) {
    var uc = UploadControl.getCurrent();
    var file = uc.getFile(uploadId);
    if (file.storageId && file.storageId != storageId) {
        file.fileId = null;
        file.isContinueUpload = false;
    }
    file.storageId = storageId;
    file.markFileStart();
}
UploadControl.enforceUpdate = function() {
    if (!Control_Enforce_Update) return false;
    var ax = UploadControl.getCurrent().activex;
    var curr_Version = ax.getversion();
    if (curr_Version < Control_Enforce_Version) {
        DiskTool.FF.alert(EnforceUpdateTips, new top.Function("Utils.openControlDownload();"));
        var flashUploadPage = location.href.replace('disk_fastupload.html', 'disk_flashupload.html');
        location.href = flashUploadPage; //转到flash上传
        top._diskUploadWindow.jContainer.find("iframe:first").css('height', '465px');
        return true;
    }
    return false;
}
UploadControl.retry = function(uploadId) {
    var uc = UploadControl.getCurrent();
    var file = uc.getFile(uploadId);
    if (file) file.retry();
}
UploadControl.stop = function(uploadId) {
    var uc = UploadControl.getCurrent();
    var file = uc.getFile(uploadId);
    if (file) file.stop();
}
UploadControl.cancel = function(uploadId) {
    var uc = UploadControl.getCurrent();
    var file = uc.getFile(uploadId);
    if (file) file.cancel();
    if (uc.getUploadFileIsAllFinish()) {
        $("#aUploadCloseBtn").html("完 成");
    }
}
UploadControl.continueUpload = function(uploadId) {
    var uc = UploadControl.getCurrent();
    var file = uc.getFile(uploadId);
    if (file) file.continueUpload();
}
UploadControl.getCurrent = function() {
    return UploadControl.current;
}
function UploadFileItem(param) {
    for (var p in param) {
        this[p] = param[p];
    }
}
var UploadingStates = ["getUploadKey", "createUpload", "scan", "progress", "virus", "complete"];
UploadFileItem.prototype.isUploading = function() {
    if ($.inArray(this.state, UploadingStates) >= 0) {
        return true;
    } else {
        return false;
    }
}
UploadFileItem.prototype.updateProgress = function(progress, sendedSize, progressTimes) {
    var file = this;
    file.state = "progress";
    file.progress = progress;
    file.sendedSize = sendedSize;
    file.progressTimes = progressTimes;
    if (!file.speedQueue || progressTimes == 1) {
        file.speedQueue = [];
        file.speedQueue.push(sendedSize);
        file.speed = sendedSize; //上传速度:字节(/秒)
    } else {
        //上传速度取10秒平均
        file.speedQueue.push(Math.max(0, sendedSize - file.lastSendedSize));
        while (file.speedQueue.length > 10) file.speedQueue.shift();
        file.speed = DiskTool.getArrayAverage(file.speedQueue);
    }
    file.remainTime = Math.ceil((file.fileSize - progress) / file.speed); //剩余时间:秒
    if (isNaN(file.remainTime)) file.remainTime = 0;
    file.lastSendedSize = sendedSize;
    file.refresh();
}
var UploadControlParams = "<parameters><id>{0}</id><comefrom>{1}</comefrom><key>{2}</key><serveraddress>{3}</serveraddress>"
+ "<commandport>{4}</commandport><dataport>{5}</dataport><filename>{6}</filename><filesize>{7}</filesize><ssoid>{8}</ssoid>"
+ "<userlevel>{9}</userlevel><usernumber>{10}</usernumber><flowtype>{11}</flowtype><taskno>{12}</taskno>"
+ "<resumetransmit>{13}</resumetransmit><commandcgi>{14}</commandcgi><datacgi>{15}</datacgi><browsertype>{16}</browsertype>"
+ "<fileid>{17}</fileid><ver>{18}</ver></parameters>";

UploadFileItem.prototype.getUploadKey = function() {
    this.state = "getUploadKey";
    var ax = UploadControl.getCurrent().activex;
    var file = this;
    UploadServer.getUploadKey(this, callback);
    function callback(info) {
        isUploadNeedRefresh = true;
        if (info.success) {
            try {
                if (info.serverTime) {
                    ax.setservertime(parseInt(parseDateString(info.serverTime).getTime() / 1000));
                }
                /*增加控件版本统计 控件强制升级需要删除*/
                onAndtotal(99999, ax.getversion());
                var result;
                if (ax.getversion() < 196864 || info.commandcgi == "" || info.datacgi == "") {//不支持代理
                    onAndtotal(3001, "调用upload"); //统计
                    result = ax.upload(
                    parseInt(file.uploadId),
                    10,
                    info.key,
                    info.ip,
                    parseInt(info.port1),
                    parseInt(info.port2),
                    0,
                    "",
                    0,
                    "",
                    "",
                    file.filePath,
                    file.fileSize,
                    top.UserData.ssoSid,
                    "0", //userlevel
                    top.UserData.userNumber, //usernumber
                    "0", //flowtype
                    info.missionId, //taskno
                    1);
                } else {
                    var mybrowsetype = 200;
                    if ($.browser.msie) {
                        mybrowsetype = 0;
                    } else if (window.navigator.userAgent.indexOf("Firefox") >= 0) {
                        mybrowsetype = 151;
                        if (/Firefox\/(?:[4-9]|3\.[0-3])/.test(navigator.userAgent)) {//3.6.3及以前 
                            mybrowsetype = 150;
                        }
                    }
                    var storageId = 0;
                    var resumetransmit = 0;
                    if (file.storageId) {
                        resumetransmit = 1;
                        storageId = file.storageId;
                    }
                    var myparams = "";
                    var v = ax.getversion() >= 196867 ? 2 : 1;
                    if (info.status && info.status == "118" && file.storageId.length && file.storageId.length == 32) {
                        //该文件已上传完成
                        onUploadStop(file.uploadId, 0, file.storageId);
                        uploadControl.removetaskbyid(file.fileId);
                        return;
                    } else if (info.status && info.status == "114") {
                        onAndtotal(3002, "调用uploadex"); //统计
                        //重新上传
                        myparams = UploadControlParams.format(file.uploadId, 10, info.key, info.ip, info.port1, info.port2, file.filePath.replace(/[&]/g, "&amp;").replace(/[']/g, "&apos;"), file.fileSize, top.UserData.ssoSid,
                                    0, top.UserData.userNumber, 0, info.missionId, 0, info.commandcgi, info.datacgi, mybrowsetype, storageId, v);

                    } else if (info.status && info.status == "0" && file.storageId && file.storageId.length == 32) {
                        //继传
                        myparams = UploadControlParams.format(file.uploadId, 10, info.key, info.ip, info.port1, info.port2, file.filePath.replace(/[&]/g, "&amp;").replace(/[']/g, "&apos;"), file.fileSize, top.UserData.ssoSid,
                                    0, top.UserData.userNumber, 0, info.missionId, 1, info.commandcgi, info.datacgi, mybrowsetype, storageId, v);
                    } else {
                        onAndtotal(3002, "调用uploadex"); //统计
                        //新上传
                        myparams = UploadControlParams.format(file.uploadId, 10, info.key, info.ip, info.port1, info.port2, file.filePath.replace(/[&]/g, "&amp;").replace(/[']/g, "&apos;"), file.fileSize, top.UserData.ssoSid,
                                    0, top.UserData.userNumber, 0, info.missionId, 0, info.commandcgi, info.datacgi, mybrowsetype, storageId, v);
                    }
                    result = ax.uploadex(myparams);
                }
                if (result != 0) {
                    file.state = "createUpload";
                    file.refresh();
                } else {
                    error(info);
                }
            } catch (e) {
                error(info);
            }
        } else {
            error(info);
        }
    }
    function error(info) {
        if (info.overLength) {
            file.state = "error";
            file.errorMsg = "剩余容量限制不足，无法上传";
        } else if (info.overFileLength) {
            file.state = "error";
            file.errorMsg = "超过单个文件大小限制";
        } else if (file.state == "nameerr") {
            //不做提示
        } else if (info.code && info.code == 14) {
            file.state = "filesizeerror";
            file.errorMsg = "文件大于{0}M,不能上传".format(info.size);
        } else {
            file.state = "unknowerror";
            if (info.errorMsg) {
                file.errorMsg = info.errorMsg;
            }
        }
        file.refresh();
    }
    function parseDateString(str) {
        str = str.trim();
        var reg = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
        var m = str.match(reg);
        if (m) {
            var year = m[1];
            var month = m[2] - 1;
            var day = m[3];
            var hour = m[4];
            var minutes = m[5];
            var seconds = m[6];
            return new Date(year, month, day, hour, minutes, seconds);
        } else {
            return null;
        }
    }
}
UploadFileItem.prototype.getActiveX = function() {
    return UploadControl.getCurrent().activex;
}
UploadFileItem.prototype.remove = function() {
    var uc = UploadControl.getCurrent();
    uc.removeFile(this.uploadId);
}
UploadFileItem.prototype.cancel = function() {
    onAndtotal(3006, "用户取消上传");
    if (this.isUploading()) {
        this.stop(true);
    } else if (this.storageId) {
        this.deleteAndRemove();
    } else {
        this.remove();
    }
}
/**
*暂停
*/
UploadFileItem.prototype.stop = function(remove) {
    onAndtotal(3005, "用户暂停");
    var ax = this.getActiveX();
    if (remove) {
        this.removeFlag = true;
    }
    ax.stop(this.uploadId);
}
UploadFileItem.prototype.deleteAndRemove = function() {
    var file = this;
    if (file.fileId) {
        UploadServer.deleteFile(file.fileId, function(result) {
            if (result.success && file.storageId) {
                deleteTask();
            }
        });
    } else if (file.storageId) {
        deleteTask();
    }
    function deleteTask() {
        if (file.isContinueUpload) {
            top.Debug.write("取消removetask");
            return;
        }
        var ax = file.getActiveX();
        var result = ax.removetaskbyfileid(file.storageId);
        top.Debug.write("removetaskbyfileid:" + file.storageId + "result:" + result);
    }
    this.remove();
}
//继续
UploadFileItem.prototype.continueUpload = function() {
    onAndtotal(3004, "继传调用uploadex");
    var uc = UploadControl.getCurrent();
    this.state = "wait";
    this.refresh();
    uc.autoUpload();
}
//重试
UploadFileItem.prototype.retry = function() {
    if (this.state == "completeNotSuccess") {
        this.markUploadSuccess(); //重新标记完成
    } else {
        this.getUploadKey(); //重传
    }
}
//数据库里预占用
UploadFileItem.prototype.markFileStart = function() {
    var file = this;
    if (!file.fileId && !file.isContinueUpload) {
        UploadServer.changeFileState(file, "preupload", function(result) {
            if (result.success) {
                file.fileId = result.fileId;
            } else {
                file.state = "stop";
                if (result.overLength) {
                    file.errorMsg = "超出容量限制";
                    file.overLength = true;
                    file.stop();
                } else if (result.errorMsg) {
                    file.errorMsg = result.errorMsg;
                    file.stop();
                }
                file.refresh();
            }
        });
    }
}
//上传完成,写数据库
UploadFileItem.prototype.markUploadSuccess = function(fileId) {
    var file = this;
    UploadServer.changeFileState(file, "success", function(result) {
        if (result.success) {
            file.state = "success";
            file.fileId = result.fileId;
        } else {
            file.state = "completeNotSuccess";
            if (result.errorMsg) {
                file.errorMsg = result.errorMsg;
            }
        }
        file.refresh();
        UploadControl.getCurrent().autoUpload();
    });
}
UploadFileItem.prototype.refresh = function() {
    if (theUploadControl.isDispose) return;
    var container = this.container;
    if (1 == 2) {
        //这种情况下好像可以不用更新了
    } else {
        var htmlCode = "";
        var formatObj = {};
        formatObj.fileShortNameHtml = this.fileName.shortName().encode();
        formatObj.fileSizeText = DiskTool.getFileSizeText(this.fileSize);
        formatObj.uploadId = this.uploadId;
        //直接输出各种状态
        top.Debug.write("refresh:" + this.state);
        switch (this.state) {
            case "wait":
                {
                    $("#aUploadCloseBtn").html("关 闭");
                    formatObj.className = "ad-uploading";
                    htmlCode = '<div class="ad-ul-hd">\
				        <span class="ul-title">{fileShortNameHtml}</span><span class="ul-size">（{fileSizeText}）</span>\
				        <ul class="ul-act">\
					        <li><a href="javascript:;"  onclick="UploadControl.cancel(\'{uploadId}\');return false;">取消</a></li>\
				        </ul>\
			        </div>\
			        <div class="ad-ul-bd">\
				        <span class="ul-uploaded">正在等待上传...</span>\
			        </div>';
                    break;
                }
            case "getUploadKey":
            case "createUpload":
                {
                    formatObj.className = "ad-uploading";
                    htmlCode = '<div class="ad-ul-hd">\
			        <span class="ul-title">{fileShortNameHtml}</span><span class="ul-size">（{fileSizeText}）</span>\
			        <ul class="ul-act">\
				            <li><a href="javascript:;"  onclick="UploadControl.cancel(\'{uploadId}\');return false;">取消</a></li>\
			            </ul>\
		            </div>\
		            <div class="ad-ul-bd">\
			            <span class="ul-uploaded">正在开始上传...</span>\
		            </div>';
                    break;
                }
            case "scan":
                {
                    formatObj.className = "ad-uploading";
                    formatObj.loadingImgSrc = DiskTool.getResource() + "/images/uploading.gif";
                    htmlCode = '<div class="ad-ul-hd">\
		            <span class="ul-title">{fileShortNameHtml}</span><span class="ul-size">（{fileSizeText}）</span>\
		            <ul class="ul-act">\
			            <li><a href="javascript:;"  onclick="UploadControl.cancel(\'{uploadId}\');return false;">取消</a></li>\
		            </ul>\
	                </div>\
	                <div class="ad-ul-bd">\
		                <span class="ul-uploaded"><img src=\"{loadingImgSrc}\" />正在扫描文件...</span>\
	                </div>';
                    break;
                }
            case "reconnect":
                {
                    formatObj.className = "ad-uploading";
                    formatObj.loadingImgSrc = DiskTool.getResource() + "/images/uploading.gif";
                    htmlCode = '<div class="ad-ul-hd">\
		            <span class="ul-title">{fileShortNameHtml}</span><span class="ul-size">（{fileSizeText}）</span>\
		            <ul class="ul-act">\
			            <li><a href="javascript:;"  onclick="UploadControl.cancel(\'{uploadId}\');return false;">取消</a></li>\
		            </ul>\
	                </div>\
	                <div class="ad-ul-bd">\
		                <span class="ul-uploaded"><img src=\"{loadingImgSrc}\" />正在重新连接...</span>\
	                </div>';
                    break;
                }
            case "progress":
                {
                    formatObj.className = "ad-uploading";
                    htmlCode = '<div class="ad-ul-hd">\
			        <span class="ul-title">{fileShortNameHtml}</span><span class="ul-size">（{fileSizeText}）</span>\
			        <ul class="ul-act">\
				        <li><a href="javascript:;" onclick="UploadControl.stop(\'{uploadId}\');">暂停</a></li>\
				        <li><a href="javascript:;" onclick="UploadControl.cancel(\'{uploadId}\');">取消</a></li>\
			        </ul>\
		            </div>\
		            <div class="ad-ul-bd">\
			            <div class="ul-progress">\
				            <div class="ul-pg-current" style="width:{uploadPercent}">\
				            </div>\
			            </div>\
		            </div>\
		            <div class="ad-ul-ft">\
		            <span class="ul-uploaded">已上传：{sendedSizeText}</span>\
		            <span class="ul-speed" style="display:{displaySpeed}">速度：{speedText}/秒</span>\
		            <span class="ul-lasttime" style="display:{displayRemainTime}">剩余时间：{remainTimeText}</span></div>';
                    //置重新连接状态
                    this.hadStarted = true;
                    formatObj.speedText = DiskTool.getFileSizeText(this.speed);
                    formatObj.sendedSizeText = DiskTool.getFileSizeText(this.progress);
                    formatObj.displayRemainTime = "";
                    formatObj.remainTimeText = DiskTool.getTextTimeSpan(this.remainTime);
                    formatObj.uploadPercent = parseInt(100 * this.progress / this.fileSize) + "%";
                    if (this.uiState == "progress") {
                        //只更新进度条和百分比剩余时间
                        if (!this.jContainer) this.jContainer = $(container);
                        this.jContainer.find("div.ul-pg-current").css({ width: formatObj.uploadPercent });
                        var uploadHtmlCode = '<span class="ul-uploaded">已上传：{sendedSizeText}</span>\
			            <span class="ul-speed" style="display:{displaySpeed}">速度：{speedText}/秒</span>\
			            <span class="ul-lasttime" style="display:{displayRemainTime}">剩余时间：{remainTimeText}</span>';
                        uploadHtmlCode = String.format(uploadHtmlCode, formatObj);
                        this.jContainer.find("div.ad-ul-ft").html(uploadHtmlCode);
                        return;
                    }
                    break;
                }
            case "stop":
                {
                    formatObj.className = "ad-uploading";
                    htmlCode = '<div class="ad-ul-hd">\
				        <span class="ul-title">{fileShortNameHtml}</span><span class="ul-size">（{fileSizeText}）</span>\
				        <ul class="ul-act">\
					        <li><a href="javascript:;" onclick="UploadControl.continueUpload(\'{uploadId}\');">继续</a></li>\
					        <li><a href="javascript:;" onclick="UploadControl.cancel(\'{uploadId}\');">取消</a></li>\
				        </ul>\
			        </div>';
                    break;
                }
            case "error": //上传失败无法重试的情况
                {
                    formatObj.className = "ad-uploaded";
                    formatObj.errorMsg = this.errorMsg;
                    htmlCode = '<div class="ad-ul-hd">\
				        <b class="i-s-w"></b><span class="ul-title">{fileShortNameHtml}</span><span class="ul-size">（{fileSizeText}）</span>\
				        <span class="ul-done">{errorMsg}</span>\
                    </div>';
                    break;
                }
            case "unknowerror":
            case "completeNotSuccess": //上传失败可以重试的情况
                {
                    formatObj.className = "ad-uploading";
                    formatObj.errorMsg = "上传失败，请重试";
                    if (this.errorMsg) {
                        formatObj.errorMsg = this.errorMsg;
                    }
                    htmlCode = '<div class="ad-ul-hd">\
				        <b class="i-s-w"></b><span class="ul-title">{fileShortNameHtml}</span><span class="ul-size">（{fileSizeText}）</span>\
				        <ul class="ul-act">\
					        <li><a href="javascript:;" onclick="UploadControl.retry(\'{uploadId}\');return false;">重试</a></li>\
					        <li><a href="javascript:;" onclick="UploadControl.cancel(\'{uploadId}\');">取消</a></li>\
				        </ul>\
			        </div>\
			        <div class="ad-ul-bd">\
				        <span class="ul-uploaded">{errorMsg}</span>\
			        </div>';
                    break;
                }
            case "filesizeerror":
                {
                    formatObj.className = "ad-uploading";
                    htmlCode = '<div class="ad-ul-hd">\
				        <b class="i-s-w"></b><span class="ul-title">{fileShortNameHtml}</span><span class="ul-size">（{fileSizeText}）</span>\
				        <ul class="ul-act">\
					        <li><span style="color: red">失败</span></li>\
				        </ul>\
			        </div>\
			        <div class="ad-ul-bd">\
				        <span class="ul-uploaded"><span style="color: red">您选择的文件过大!不能上传</span></span>\
			        </div>';
                    this.state = "unknowerror";
                    break;
                }
            case "nameerr":
                {
                    formatObj.className = "ad-uploading";
                    htmlCode = '<div class="ad-ul-hd">\
				        <b class="i-s-w"></b><span class="ul-title">{fileShortNameHtml}</span><span class="ul-size">（{fileSizeText}）</span>\
				        <ul class="ul-act">\
					        <li><span style="color: red">失败</span></li>\
				        </ul>\
			        </div>\
			        <div class="ad-ul-bd">\
				        <span class="ul-uploaded"><span style="color: red">文件名包含广告宣传信息，或不符合现行法律法规要求！</span></span>\
			        </div>';
                    this.state = "unknowerror";
                    break;
                }
            case "complete":
            case "virus":
                {
                    formatObj.className = "ad-uploaded";
                    htmlCode = '<div class="ad-ul-hd">\
				        <span class="ul-title">{fileShortNameHtml}</span><span class="ul-size">（{fileSizeText}）</span>\
				        <span class="ul-done">正在完成上传</span>\
			        </div>';
                    break;
                }
            case "success":
                {
                    formatObj.className = "ad-uploaded";
                    htmlCode = '<div class="ad-ul-hd">\
				        <b class="i-s-s"></b><span class="ul-title">{fileShortNameHtml}</span><span class="ul-size">（{fileSizeText}）</span>\
				        <span class="ul-done">完成</span>{0} \
			        </div>';
                    var sMakePostCard = "";
                    var isMakePostCard = false;
                    var fileExt = DiskTool.getFileExtName(formatObj.fileShortNameHtml).toLowerCase();
                    if (fileExt) {
                        isMakePostCard = postCardExt.indexOf(fileExt + ",") > -1;
                    }
                    if (isMakePostCard) {
                        var file = this;
                        sMakePostCard = "<span class=\"ul-done\"><a href=\"javascript:DiskTool.showPostCard(\'{0}\');\" id=\"aMakePostCard\" >制作明信片</a></span>".format(file.fileId);
                    }
                    htmlCode = htmlCode.format(sMakePostCard);
                    var uc = UploadControl.getCurrent();
                    resetUploadInfo(uc);
                    break;
                }
        }
        htmlCode = String.format(htmlCode, formatObj);
        container.innerHTML = htmlCode;
        container.className = formatObj.className;
    }
    this.uiState = this.state;
}
String.prototype.shortName = function() {
    var nameLen = this.length;
    if (nameLen <= 28) return this;
    var point = this.lastIndexOf(".");
    if (point == -1 || this.length - point > 5) {
        return this.substring(0, 25) + "…";
    }
    return this.replace(/^(.{24}).*(\.[^.]+)$/, "$1…$2");
}