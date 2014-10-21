var upcom = {};
upcom.emid = "";
upcom.sid = "";
upcom.userNumber = "";
upcom.flashGetUploadUrl = "";
upcom.uploadSize = 0;
upcom.prjtype = 2;
upcom.isUploaded = false; //为ture表示用户至少上传成功过一个文件
upcom.swf = null; //swf上传对象
upcom.State = null;
/**
* 上传类型 0=控件上传 1=falsh上传 2=普通上传
*/
upcom.uptype = 0;
/**
*初始化上传信息
*/
upcom.init = function(id) {
    //初始化全局参数
    upcom.emid = id || "divFlashLayer";
    upcom.sid = top.UserData.ssoSid;
    upcom.userNumber = top.UserData.userNumber;
    upcom.flashGetUploadUrl = top.M139.HttpRouter.getNoProxyUrl(DiskTool.resolveUrl("getFlashUploadUrl", true));
    upcom.flashCallbackUrl = top.M139.HttpRouter.getNoProxyUrl(DiskTool.resolveUrl("flashPreUpload", true));

    if (upcom.flashGetUploadUrl.indexOf("http://") == -1) {
        upcom.flashGetUploadUrl = "http://" + location.host + upcom.flashGetUploadUrl;
        upcom.flashCallbackUrl = "http://" + location.host + upcom.flashCallbackUrl;
    }

    upcom.uploadSize = 1024 * 1024 * 50;
    upcom.uptype = upcom.checkinfo();
    //1: 文件快递 2:手机彩云
    upcom.prjtype = 2;
    //上传大小
    var win = DiskTool.getDiskWindow().parent;
    if (win.DiskMainData && win.DiskMainData.UploadMaxSize) {
        upcom.uploadSize = parseInt(win.DiskMainData.UploadMaxSize);
    }
    switch (upcom.uptype) {
        case 0:
            break;
        case 1:
            upcom.init_flash();
            break;
        case 2:
            break;
        default:
            break;
    }
}
/**
* 检查上传环境 0=控件上传 1=falsh上传 2=普通上传
*/
upcom.checkinfo = function() {
    return 1;
}
/**
* flash上传初始化
*/
upcom.init_flash = function() {
    var url = "/m2012/flash/disk_richinfo_upload.swf";

    //解决第三方ie浏览器的bug
    if (navigator.userAgent.indexOf("MSIE") >= -1) {
        url += "?rnd=" + Math.random();
    }
    //初始化flash
    var swf = new SWFObject(url, "flashUpload", 490, 300);
    swf.addParam("quality", "high");
    swf.addParam("swLiveConnect", "true");
    swf.addParam("menu", "false");
    swf.addParam("allowScriptAccess", "always");
    swf.addParam("wmode", "transparent");
    swf.write(upcom.emid);
    upcom.swf = document.getElementById("flashUpload");
}
/**
* 上传需要的参数集合
*/
upcom.getParameter = function() {
    var args = {};
    switch (upcom.uptype) {
        case 0:
            break;
        case 1: /*flash上传所需要的参数*/
            //设置
            args.threads = 2;      //线程数
            args.sid = upcom.sid;         //sid
            args.phoneNumber = upcom.userNumber; //userNumber
            args.getUploadUrl = upcom.flashGetUploadUrl; /*请求上传地址URL*/
            args.uploadCallbackUrl = upcom.flashCallbackUrl; /*上传成功后更新本地数据库url*/
            args.type = upcom.prjtype;         /*类型 1:文件快递 2.彩云上传*/
            args.singleFileSizeLimit = upcom.uploadSize; //单文件上传大小限制单位字节
            args.tipTxtBlock = ""; /*提示文字块，默认值为"",文件快递要有值*/

            if (upcom.prjtype == 1) args.tipTxtBlock = "* 请遵守国家相关法律，严禁上传包括反动、暴力、色情、违法及侵权内容的文件；\n\n* 一次可上传多个文件，每个文件最大为1G；\n\n* 可以发送到任何邮箱以及移动手机；\n\n* 上传的文件，自动保存到文件暂存柜；\n\n* 文件可存放15天，您可以通过续期的功能让文件保存更长的时间；\n\n* 如果您删除了文件或文件已过期，则收件人无法下载；";

            args.isShowMinImg = true; //是否显示小图(缩略图)
            args.showMinImgSizeLimit = 5 * 1024 * 1024; //显示小图(缩略图)大小限制
            args.maxSelectFile = 50; //最大选择文件个数
            args.fileNameLength = DiskConf.MaxUploadFileNameLength; //文件名长度限制

            //标题提示语
            args.tipTxt = "提示";
            args.moreTxt = "信息";
            args.singleFileTxt = "(单文件最大|0|)";

            //选择文件错误提示语
            args.getDirTypeError = "获取上传文件目录与限制上传文件类型数据失败！";
            args.maxSelectFileError = "对不起，一次最多只能上传|0|个文件，请重新选择！";
            args.sizeMinError = "您添加的文件\"|0|\"大小为0, 不能上传！";
            args.sizeMaxError = "文件\"|0|\"大小超过上限|1|, 不能上传！";
            args.nameLongError = "您添加的文件\"|0|\"文件名超过" + args.fileNameLength + "字符, 不能上传！";
            args.typeError = "您添加的文件\"|0|\"类型不对, 不能上传！";

			var serviceitem = top.$User.getServiceItem();
            if (serviceitem != "0016" && serviceitem != "0017") {
                args.sizeMaxError = "文件\"|0|\"大小超过上限|1|, 不能上传！<a onclick=\"top.$App.showOrderinfo();\" href=\"javascript:void(0)\" style=\"color: Blue;text-decoration:underline\">升级邮箱</a>可上传更大彩云文件。";
            }

            //上传错误提示语
            args.userCancelError = "上传失败，用户取消上传！";
            args.getUploadUrlError = "请求上传地址URL为空错误！";

            args.getUploadUrlLoaderSecurityError = "请求上传地址失败，crossdomain错误！";
            args.getUploadUrlLoaderIoError = "请求上传地址失败，IO错误！";
            args.getUploadUrlLoaderLoadError = "请求上传地址失败，LOAD错误！";
            args.getUploadUrlLoaderReturnError = "请求上传地址错误，返回值错误|0|！";

            args.uploadUrlSecurityError = "上传分布式失败，crossdomain错误！";
            args.uploadUrlIoError = "上传分布式失败，IO错误！";
            args.uploadUrlUpLoadError = "上传分布式失败，UPLOAD错误！";
            args.uploadUrlReturnError = "上传分布式错误，返回值错误|0|！";

            args.updateDatabaseUrlLoaderSecurityError = "更新数据库失败，crossdomain错误！";
            args.updateDatabaseUrlLoaderIoError = "更新数据库失败，IO错误！";
            args.updateDatabaseUrlLoaderLoadError = "更新数据库失败，LOAD错误！";
            args.updateDatabaseUrlLoaderReturnError = "更新数据库错误，返回值错误|0|！";
            break;
        case 2:
            break;
    }
    return args;
}
/**
* flash回调有上传成功的文件
* @param {Object} val
*/
upcom.Uploaded = function(val) {
    upcom.isUploaded = val;
}
/**
*flash回调的上传状态
*/
upcom.setUploadState = function(obj) {
    upcom.State = obj;
}
/**
*取得flash上传成功的文件列表
*/
upcom.getUploadSuccessList = function() {
    if (upcom.swf == null) return [];
    return upcom.swf.getUploadSuccessList();
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
    //top._diskUploadWindow.closeButton.click();   
}