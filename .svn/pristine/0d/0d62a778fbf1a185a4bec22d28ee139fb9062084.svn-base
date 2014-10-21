//页面初始化
function PageInit() {
    DiskTool.DialogAuto();
    $("#aSaveAttach").click(function(e) {
        SaveAttachToDisk();
        e.preventDefault();
    });

    $("#aCancel").click(function() {
        top.FloatingFrame.close();
    });
    $("#aOpenDisk").click(function() {
        top.Links.show('diskDev', '&id=2', true);
        top.FloatingFrame.close();
    });
    $("#aSaveOK").click(function() {
        top.FloatingFrame.close();
    });
    /*界面超时处理*/
    if (Utils.PageisTimeOut(true)) return;
    //初始化目录
    DirectoryTree.isCanHide = false;
    DirectoryTree.ClickDirTree(true);
    return;
}
function SaveAttachToDisk() {
    //DiskTool.addDiskBehavior(7026, 25, 20, 1, 0);//第二期改造
    DiskTool.addDiskBehavior({
        actionId: 7026,
        thingId: 2,
        moduleId: 25,
        actionType: 20
    });
    DirectoryTree.SelectDirectory();
    var fileName = "";
    var url = "";
    var attachinfos = [];
    if (top.NETDISKATTACHMENT) {
        var netdiskattachment = top.NETDISKATTACHMENT;
        if(isArray(netdiskattachment)){
            attachinfos = netdiskattachment;
        }else{
            if (netdiskattachment.fileName) {
                fileName = netdiskattachment.fileName;
            }
            if (netdiskattachment.url) {
                url = netdiskattachment.url;
            }
            attachinfos = [{
                attachname : fileName,
                attachurl : url
            }];
        }
    } else {
        attachinfos = [{
            attachname : escape(Utils.queryString("filename")),
            attachurl : decodeURIComponent(Utils.queryString("tourl"))
        }];
    }
    if (DirectoryTree.selComefrom == 2) {
        for(var i=0;i<attachinfos.length;i++){
            fileName = unescape(attachinfos[i].attachname);
            if (!CheckMusic(fileName)) {
                return;
            }
        }
    } else if (DirectoryTree.selComefrom == 1) {
        for(var i=0;i<attachinfos.length;i++){
            fileName = unescape(attachinfos[i].attachname);
            if (!CheckAlbum(fileName)) {
                return;
            }
        }
    }
    //SaveAttach(fileName, DirectoryTree.selDirId, url, DirectoryTree.selComefrom, DirectoryTree.selItemId);
    SaveAttach(attachinfos, DirectoryTree.selDirId, DirectoryTree.selComefrom, DirectoryTree.selItemId);
}
//判断数组
function isArray(obj){
    return Object.prototype.toString.call(obj) === '[object Array]'; 
} 
function SaveAttach(attachinfos, did, selComefrom, selItemId) {
    if (selComefrom != 1 && selComefrom != 2) {
        selItemId = 0;
    }
    DiskTool.ShowWaiting();
    $.postXml({
        url: DiskTool.resolveUrl("attachUpload", true),
        data: XmlUtility.parseJson2Xml({
            //filename: escape(fileName),
            attachinfos:attachinfos,
            usernumber: top.UserData.userNumber,
            directoryid: did,
            ComeFrom: selComefrom,
            BItemId: selItemId,
            //url: url,
            cookieValue: Utils.getCookie("Coremail") //,
            //type: "attach"
        }),
        success: function(data) {
            DiskTool.HideWaiting();
            if (data.code == "S_OK") {
                if(attachinfos.length == 1){
                    var msg = "\"{0}\"已成功保存到彩云网盘！".format(Utils.htmlEncode(unescape(attachinfos[0].attachname)));
                }else{
                    var msg = "所选附件已成功保存到彩云网盘！";
                }
                DiskTool.addDiskBehavior({
                    actionId: 12,
                    thingId: 4,
                    moduleId: 11,
                    actionType: 10
                });
                var topWin = top;
                topWin.FF.close();
                topWin.$Msg.alert(msg, {
                    icon: "warn"
                });
                if (topWin.NETDISKATTACHMENT) {
                    topWin.NETDISKATTACHMENT = null;
                }
            } else {
                alert(data.summary);
            }
        },
        error: function() {
            DiskTool.handleError(error);
        }
    });
}
//获取传递的参数
function queryStringAtt(param, isescape, url) {
    url = url ? url : location.search;
    var regx = new RegExp("[?&]" + param + "=([^&]*)", "i");
    var svalue = url.match(regx);
    if (isescape) {
        svalue = svalue ? svalue[1] : "";
    } else {
        svalue = svalue ? unescape(svalue[1]) : "";
    }
    return svalue.trim();
}