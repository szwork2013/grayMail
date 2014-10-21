var acceptMaxFileLength = DiskConf.MaxUploadFileNameLength; //字节
var acceptPhotoExtend = "bmp,gif,ico,jpg,jpeg,png,tif,tiff,";
var acceptMusicExtend = "mid,wma,wav,mp3,cda,";
var PhotoExtendAlert = "“{0}”不是图片格式文件,请重新选择";
var MusicExtendAlert = "“{0}”不是音乐格式文件,请重新选择";
var MusicExtendTips = "（支持上传mp3,wma,wav,mid等格式的音乐文件）";
var PhotoExtendTips = "（支持上传jpg,png,gif,bmp等格式的图片文件）";
var FileNotSelectAlert = "请先选择你要上传的文件";
var DirectoryRootName = "彩云网盘";
var FileHadExist = "文件“{0}”已存在，是否将彩云中的该文件替换？";
var FileNameIsEmpty = "文件的文件名不能为空！";
var FileNameLength = "文件“{0}”名超过{1}字符，不能上传";
var BanLvTips = "单个文件最大{0}";
var NotBanLvTips = "单个文件最大{0}  <a title='升级套餐,您可以上传更大单个文件.' href='#'>(上传更大单个文件!)</a>";
var UploadResultPage = "/m2012/html/disk/disk_uploadresult.html";
var InstallControlTips = "安装139邮箱小工具上传更稳定，速度更快，并支持选择多个文件和断点续传。<a href=\"{0}\" target=\"_blank\">立即安装</a>";
var UpdateControlTips = "系统检测到“139邮箱小工具”有更新版本，要升级后才能正常使用。<a href=\"{0}\" target=\"_blank\">立即升级</a>";
var EnforceUpdateTips = "检测到“139邮箱小工具”有新版本，需要升级才能继续。";
//0：成功 1：用户未登录 2-3：系统出错4：容量不足5-6：系统出错7：文件上传成功，存在病毒8-9：系统出错10:未开通邮箱伴侣，大于50M!11:开通邮箱伴侣，大于100M!,12文件大小为0
var UploadResultError = ["文件 \"{0}\"上传成功",
"文件 \"{0}\"上传失败,用户登录超时",
"文件 \"{0}\"上传失败,系统出错",
"文件 \"{0}\"上传失败,系统出错",
"文件 \"{0}\"上传失败,系统繁忙！", //彩云空间不足
"文件 \"{0}\"上传失败,系统出错",
"文件 \"{0}\"上传失败,系统出错",
"文件 \"{0}\"上传成功,发现病毒,建议手动删除",
"文件 \"{0}\"上传失败,系统出错",
"文件 \"{0}\"上传失败,系统出错",
"您添加的文件{0}大于50M，不能上传！",
"您添加的文件{0}大于100M，不能上传！",
"文件 {0}上传失败,文件大小超过限制",
"文件 \"{0}\"上传失败,文件大小为0,不能上传",
"您添加的文件{0}大于{1}，不能上传！"
];
var isCommonUpload = false;
var isUploadNeedRefresh = false;
var isUploading = false;
var selComefrom;
var selDirId;
var selItemId;
function showTipMessage(msg) {
    $("#pMessage").html(msg).show();
}
function hideTipMessage() {
    $("#pMessage").hide();
}
function onLog(logText) {
    DiskTool.sendLogMsg(logText, 10);
}


function onAndtotal(code, info, isasync) {
    /*接口未做，先注释掉
    var ync = true;
    if(arguments.length == 3) {
    ync = isasync;
    }
    if(!code)return;
    if(!info)info=""
    if (Utils.PageisTimeOut(true))return;
    $.postXml({
    url: "http://" + window.location.host+"/Ajax/DiskUploadState.ashx?sid=" + top.UserData.ssoSid,
    data: XmlUtility.parseFromJson({code: code,info:info}),
    async:ync,
    success: function(result){},
    error: function(error){}
    });
    */
}

function SubmitUpload() {
    SelectDirectory();
    var fileData = $('#file').val();
    var filename = DiskTool.getFileName(fileData);
    if (fileData == "") {
        showTipMessage(FileNotSelectAlert);
        return false;
    }
    if (!CheckFileNameLength(fileData)) {
        return false;
    }
    if (selComefrom == 1) {//相册ID
        //判断格式是否符合
        if (!CheckAlbum(fileData)) return false;
    } else if (selComefrom == 2) {//音乐ID
        //判断格式是否符合
        if (!CheckMusic(fileData)) return false;
    }
    DisabledButtons("aUploadBtn");
    var returnUrl = DiskTool.getRelativeUrl("disk_uploadresult.html");
    //获取上传的URL
    var getUploadUrl = DiskTool.resolveUrl('getNormalUploadUrl', true);
    $.postXml({
        url: getUploadUrl,
        data: XmlUtility.parseJson2Xml({
            returnurl: XmlUtility.escape(returnUrl),
            filename: XmlUtility.escape(filename)
        }),
        success: function() {
            if (this.code == DiskConf.isOk) {
                var actionUrl = this["var"].url;
                var form = jQuery('#formUpload');
                jQuery(form).attr('action', actionUrl);
                jQuery(form).submit();
                isUploading = true;
                //开始上传
                $("#commonUpload")[0].style.display = "none";
                $("#commonUploadProgress")[0].style.display = "";
                setTimeout(UploadResult, 200);
                EnabledButtons("aUploadBtn", SubmitUpload);
            } else {
                showTipMessage(this.summary);
                EnabledButtons("aUploadBtn", SubmitUpload);
            }
        },
        error: function(error) {
            showTipMessage("上传失败(203)");
            EnabledButtons("aUploadBtn", SubmitUpload);
        }
    });
}
/**
resultCode:
0    上传成功
102  非法source
103  认证或校验错误
104  版本错
111  文件超过了限定的大小
107  请求超时
108  请求中含有非法参数
110  失败、系统错误	
119  ssoid 校验错误
120  userlevel 不合法
*/
//uploadResult.html页面调用
function commonUploadCallback(returnUrl) {
    var resultCode = q("retcode");
    var fileSize = q("filesize");
    if (fileSize) {
        fileSize = parseInt(fileSize);
    }
    if (resultCode == "0" && fileSize > 0) {
        //上传成功要写数据库
        successUpload();
    } else {
        onAndtotal(2007, resultCode, false);
        if (fileSize == 0) {
            alert("您添加的文件\"{0}\"大小为0，不能上传！".format(DiskTool.getFileName($('#file').val())));
        } else if (resultCode == "105") {
            alert("上传失败,系统繁忙");
        } else if (resultCode == "111") {
            alert("文件已经超过大小限制");
        } else if (resultCode == "119") {
            alert("上传失败,您登录已经超时");
        } else {
            alert("上传失败:" + resultCode);
        }
        reloadPage();
    }
    function successUpload() {
        var storageId = q("fileid");
        var fileName = DiskTool.getFileName($('#file').val());
        var fileSize = q("filesize");
        var url = DiskTool.resolveUrl('diskUploadSuccess', true);
        var data = {
            fileName: XmlUtility.escape(fileName),
            fileSize: fileSize,
            status: 2,
            fileRefId: storageId,
            fileExt: XmlUtility.escape(DiskTool.getFileExtName(fileName)),
            comefrom: selComefrom,
            bitemId: selItemId,
            dirId: selDirId,
            type: 1, //记日志,上传类型
            virusStatus: 0,
            utype: 1
        };
        $.postXml({
            url: url,
            data: XmlUtility.parseJson2Xml(data),
            timeout: 30000,
            success: function(result) {
                var result = { success: false };
                if (this.code == DiskConf.isOk) {
                    var value = this["var"];
                    if (value.errorCode == 0) {
                        var parentWin = DiskTool.getDiskWindow();
                        if (parentWin.Toolbar && parentWin.Toolbar.refreshList) {
                            parentWin.Toolbar.refreshList();
                        } else if (parentWin.FileList && parentWin.Filelist.Render.renderParent) {
                            parentWin.Filelist.Render.renderParent();
                        }
                        $("#commonUpload,#commonUploadProgress").remove();
                        $(document.body).prepend(
                            '<div style="margin-bottom:190px" class="dialog">\
                                <div class="bd bd-2">\
                                    <h3>上传成功！</h3>\
                                    <p>您可以<a href="javascript:location.href=location.href;void(0);">继续上传新的文件</a></p>\
                                </div>\
                                <i style="position:absolute;left:120px;top:20px" class="i-success"></i>\
                            </div>');
                    } else if (value.errorCode == 2) {
                        alert(UploadResultError[4].format(DiskTool.getFileName($('#file').val())));
                    } else if (response.resultCode == 1) {
                        alert("上传失败,文件名包含广告宣传信息，或不符合现行法律法规要求！");
                        reloadPage();
                    } else {
                        alert("上传失败");
                        reloadPage();
                    }
                } else {
                    alert("上传失败");
                    reloadPage();
                }
            },
            error: function(error) {
                alert("上传失败");
                reloadPage();
            }
        });
    }
    function q(id) {
        return Utils.queryString(id, returnUrl);
    }
}
function reloadPage() {
    location.href = location.href;
}
//上传初始化目录
function InitFromDirectory() {
	
    var uploadsize = 0;
    var win = DiskTool.getDiskWindow().parent;
    if (win.DiskMainData && win.DiskMainData.UploadMaxSize) {
        uploadsize = parseInt(win.DiskMainData.UploadMaxSize);
    }
    uploadsize = DiskTool.getFileSizeText(uploadsize);

	var serviceitem = top.$User.getServiceItem();
    if (serviceitem != "0016" && serviceitem != "0017") {
        $("#pTips").html(NotBanLvTips.format(uploadsize));
        $("#pTips").find("a").click(function() {
            top._diskUploadWindow.jContainer.find("a[title=最小化窗口]").click();
            top.$App.showOrderinfo();
            top.FF.close();
        });
    } else {
        $("#pTips").html(BanLvTips.format(uploadsize));
    }
    //来自目录
    var uploadComeFromDirName = DiskQueryString("dirName", location.href);
    var uploadComeFrom = DiskQueryString("comeFrom", location.href);
    var uploadComeFromPid = DiskQueryString("id", location.href);
    if (!uploadComeFrom || uploadComeFrom == "") {
        uploadComeFrom = "0";
    }
    if (uploadComeFrom == "1") {
        $("#pTips").html($("#pTips").html());
    }
    if (uploadComeFrom == "2") {
        $("#pTips").html($("#pTips").html());
    }
    if (!uploadComeFromPid || uploadComeFromPid == "") {
        uploadComeFromPid = "0";
    }
    if (uploadComeFromPid == "0") {
        if (!uploadComeFromDirName || uploadComeFromDirName == "") {
            uploadComeFromDirName = "彩云网盘";
            if (uploadComeFrom == "1") {
                uploadComeFromDirName = "最新上传";
            } else if (uploadComeFrom == "2") {
                uploadComeFromDirName = "我的音乐";
            }
        }
    } else {
        if (!uploadComeFromDirName || uploadComeFromDirName == "") {
            uploadComeFromDirName = "彩云网盘";
        }
    }
    DirectoryTree.comeFrom = parseInt(uploadComeFrom);
    DirectoryTree.comeFromId = parseInt(uploadComeFromPid);
    DirectoryTree.AddHideSt(uploadComeFromDirName, uploadComeFrom + "-" + uploadComeFromPid);
}
//选择目录
function SelectDirectory() {
    DirectoryTree.SelectDirectory();
    selComefrom = DirectoryTree.selComefrom;
    selItemId = DirectoryTree.selItemId;
    selDirId = DirectoryTree.selDirId;
}
//树目录对象
var DirectoryTree = {
    comeFrom: 0, //如果有来源,如上传,要先初始化这个值
    comeFromId: 10, //如果有来源,如上传,要先初始化这个值
    selComefrom: 0, //选择的目录来源,0我的彩云,1我的相册,2我的音乐
    selItemId: 0, //选择的
    selDirId: 0, //选择的目录ID
    UserDirectoryObj: null,
    isLoadingDir: false, //是否正在加载目录
    //用div显示下拉列表
    divTreeSub1: "<li dirid=\"{0}\"><i class=\"i-tree2\"></i><i class=\"i-folder2\"></i><span>{1}</span><ul>",
    divTreeSub2: "</ul></li>",
    divTree: "<li dirid=\"{0}\"><i></i><i class=\"i-folder1\"></i><span>{1}</span></li>",
    divTreeAll: "",
    isCanHide: true, //树是否能够隐藏
    rootDirName: "彩云网盘",
    rootMusicName: "我的音乐",
    rootAlbumName: "我的相册",
    rootDefaultAlbumName: "最新上传",
    InitDirectory: function(dirData) {
        if (dirData) {
            this.UserDirectoryObj = dirData;
        }
        //根目录
        if (this.comeFrom == 0) {
            this.divTreeAll += this.divTreeSub1.format("0-10", this.rootDirName);
            for (var i = 0; i < dirData.dirs.length; i++) {
                if (dirData.dirs[i].dirlevel == 1) {
                    if (this.IsHasSubDirectory(dirData.dirs, dirData.dirs[i].dirid)) {
                        this.divTreeAll += this.divTreeSub1.format("0-" + dirData.dirs[i].dirid, dirData.dirs[i].dirname.encode());
                        this.AddSubDirectory(dirData.dirs, dirData.dirs[i].dirid);
                        this.divTreeAll += this.divTreeSub2;
                    } else {
                        this.divTreeAll += this.divTree.format("0-" + dirData.dirs[i].dirid, dirData.dirs[i].dirname.encode());
                    }
                }
            }
            this.divTreeAll += this.divTreeSub2;
        }
        if (this.comeFrom == 0 || this.comeFrom == 1) {
            //精彩相册
            this.divTreeAll += this.divTreeSub1.format("1-0", this.rootAlbumName);
            //this.divTreeAll += this.divTree.format("1-0", this.rootDefaultAlbumName);
            for (var i = 0; i < dirData.photodirs.length; i++) {
                this.divTreeAll += this.divTree.format("1-" + dirData.photodirs[i].dirid, dirData.photodirs[i].dirname.encode());
            }
            this.divTreeAll += this.divTreeSub2;
        }
        if (this.comeFrom == 0 || this.comeFrom == 2) {
            //精彩音乐
            if (dirData.musicdirs.length > 0) {
                this.divTreeAll += this.divTreeSub1.format("2-0", this.rootMusicName);
                for (var i = 0; i < dirData.musicdirs.length; i++) {
                    this.divTreeAll += this.divTree.format("2-" + dirData.musicdirs[i].dirid, dirData.musicdirs[i].dirname.encode());
                }
                this.divTreeAll += this.divTreeSub2;
            } else {
                this.divTreeAll += this.divTree.format("2-0", this.rootMusicName);
            }
        }
        $("#file-tree2").html(this.divTreeAll);
        $("#file-tree2 li").click(function(event) {
            DirectoryTree.SelectDir(this);
            DirectoryTree.ClickDirTree(false);
            Utils.stopEvent(event);
        });
        $("#file-tree2 i").click(function(event) {
            DirectoryTree.ClickDirIcon(this);
            Utils.stopEvent(event);
        });
        //初始化来自目录
        try {
            var dirId = this.comeFrom + "-" + this.comeFromId;
            var liObj = $("#file-tree2 li[@dirid=" + dirId + "]");
            var dirname = liObj.find("span:eq(0)").html();
            if (dirname) {
                liObj.addClass("current");
                this.AddHideSt(dirname, dirId);
            }
        } catch (e) { }
    },
    SelectDir: function(obj) {//选择目录
        var dirName = $(obj).find("span:eq(0)").html();
        var dirId = $(obj).attr("dirid");
        if (dirId == "1-0") dirName = "最新上传";
        this.AddHideSt(dirName, dirId);
        $("#file-tree2 .current").removeClass("current");
        $(obj).addClass("current");
    },
    AddHideSt: function(opName, opId) {//添加到选择框
        if ($("#stPosition")[0].options.length == 1) {
            $("#stPosition").find("option").remove();
        }
        this.AddOption($("#stPosition")[0], opName, opId);
        if (opId == "1-0") opName = "最新上传";
        $("#file-tree").html(opName);
    },
    ClickDirIcon: function(obj) {//展开/收缩子目录
        var className = $(obj).attr("class");
        if (className == "i-tree2") {
            $(obj).attr("class", "i-tree1");
            $(obj).parent().find("i:eq(1)").attr("class", "i-folder1");
            $(obj).parent().find("ul:eq(0)").hide();
        } else if (className == "i-tree1") {
            $(obj).attr("class", "i-tree2");
            $(obj).parent().find("i:eq(1)").attr("class", "i-folder2");
            $(obj).parent().find("ul:eq(0)").show();
        }
    },
    ClickDirTree: function(isShow) {//展开/隐藏树开目录
        if (this.isLoadingDir) {
            return;
        }
        if (!this.UserDirectoryObj) {
            this.isLoadingDir = true;
            //装入用户所有的目录
            $.ajax({
                url: DiskTool.resolveUrl('getdiskallinfo', true),
                type: "POST",
                dataType: "json",
                success: function(data) {
                    if (data.code == 'S_OK') {
                        DirectoryTree.isLoadingDir = false;
                        DirectoryTree.InitDirectory(data['var']);
                    } else {
                        DiskTool.FF.alert(data.summary);
                    }
                },
                error: function(a, b, c) { }
            });
            return;
        }
        var obj = $("#file-tree2");
        if (isShow) {
            obj.show();
        } else if (this.isCanHide) {
            obj.hide();
        }
    },
    IsHasSubDirectory: function(dirs, dirId) {
        var hasSubDirectory = false;
        for (var j = 0; j < dirs.length; j++) {
            if (dirs[j].parentdir == dirId) {//有子目录
                hasSubDirectory = true;
                break;
            }
        }
        return hasSubDirectory;
    },
    AddSubDirectory: function(dirs, dirId) {
        for (var j = 0; j < dirs.length; j++) {
            if (dirs[j].parentdir == dirId) {//有子目录
                if (this.IsHasSubDirectory(dirs, dirs[j].dirid)) {
                    this.divTreeAll += this.divTreeSub1.format("0-" + dirs[j].dirid, dirs[j].dirname); //这里还需要考虑是否有子目录
                    this.AddSubDirectory(dirs, dirs[j].dirid);
                    this.divTreeAll += this.divTreeSub2;
                } else {
                    this.divTreeAll += this.divTree.format("0-" + dirs[j].dirid, dirs[j].dirname); //这里还需要考虑是否有子目录
                }
            }
        }
    },
    SelectDirectory: function() {//选择目录
        var selValue = $("#stPosition").val();
        this.selComefrom = selValue.substr(0, 1);
        this.selItemId = selValue.substr(2);
        this.selDirId = this.selItemId;
        if (this.selComefrom == 1) {//相册ID
            if (this.UserDirectoryObj) {
                this.selDirId = DiskConf.albumDirID;
            } else if (DiskTool.getDiskWindow() && DiskTool.getDiskWindow().parent && DiskTool.getDiskWindow().parent.DiskMainData) {
                this.selDirId = DiskTool.getDiskWindow().parent.DiskMainData.AlbumDId;
            }
        } else if (this.selComefrom == 2) {//音乐ID
            if (this.UserDirectoryObj) {
                this.selDirId = DiskConf.musicDirID;
            } else if (DiskTool.getDiskWindow() && DiskTool.getDiskWindow().parent && DiskTool.getDiskWindow().parent.DiskMainData) {
                this.selDirId = DiskTool.getDiskWindow().parent.DiskMainData.MusicDId;
            }
        }
        if (this.selDirId == 0) {
            if (this.selComefrom == 0) {//根目录ID
                if (this.UserDirectoryObj) {
                    for (i = 0; i < this.UserDirectoryObj.dirs.length; i++) {
                        if (this.UserDirectoryObj.dirs[i].dirlevel == 0) {
                            this.selDirId = this.UserDirectoryObj.dirs[i].dirid;
                            break;
                        }
                    }
                } else if (DiskTool.getDiskWindow() && DiskTool.getDiskWindow().parent && DiskTool.getDiskWindow().parent.DiskMainData) {
                    this.selDirId = DiskTool.getDiskWindow().parent.DiskMainData.RootDId;
                }
            }
        }
    },
    AddOption: function(st, text, value) {
        var op = new Option(text, value);
        if (op.innerHTML) {
            op.innerHTML = text.encode();
        }
        st.options.add(op);
    }
};
function CheckFileNameLength(fileData) {
    var fileName = DiskTool.getFileName(fileData);
    if (DiskTool.len(fileName) > acceptMaxFileLength) {
        window.alert(FileNameLength.format(fileName, acceptMaxFileLength));
        return false;
    }
    return true;
}
function CheckAlbum(fileData) {
    fileData = fileData ? fileData : "";
    if (!fileData) {
        window.alert(FileNameIsEmpty);
        return false;
    }
    var fileNames = fileData.split(",");
    var extName = null;
    for (var i = 0, len = fileNames.length; i < len; i++) {
        extName = DiskTool.getFileExtName(fileNames[i]);
        if (!extName) {
            window.alert(PhotoExtendAlert.format(DiskTool.getFileName(fileNames[i])));
            return false;
        }
        extName = extName.toLowerCase() + ",";
        if (acceptPhotoExtend.indexOf(extName) < 0) {
            window.alert(PhotoExtendAlert.format(DiskTool.getFileName(fileNames[i])));
            return false;
        }
    }
    return true;
}
function CheckMusic(fileData) {
    fileData = fileData ? fileData : "";
    if (!fileData) {
        window.alert(FileNameIsEmpty);
        return false;
    }
    var fileNames = fileData.split(",");
    var extName = null;
    for (var i = 0, len = fileNames.length; i < len; i++) {
        extName = DiskTool.getFileExtName(fileNames[i]);
        if (!extName) {
            window.alert(MusicExtendAlert.format(DiskTool.getFileName(fileNames[i])));
            return false;
        }
        extName = extName.toLowerCase() + ",";
        if (acceptMusicExtend.indexOf(extName) < 0) {
            window.alert(MusicExtendAlert.format(DiskTool.getFileName(fileNames[i])));
            return false;
        }
    }
    return true;
}
DiskQueryString = function(param, url) {
    if (!url) {
        url = location.search;
    }
    var reg = new RegExp("[?#&]" + param + "=([^&]*)", "i");
    var svalue = url.match(reg);
    var result = svalue ? decodeURIComponent(svalue[1]) : null;
    return result;
}
function UploadResult() {
    try {
        Tip.FileCount = 1;
        Tip.FileSizeCount = 0;
        Tip.UploadedSizeCount = 0;
        Tip.Speed = "未知";
        Tip.Percent = "..";
        var frameId = "uploadiframe";
        //如没上传完,这里会抛异常
        var backHref = document.getElementById(frameId).contentWindow.location.href;
        if (!backHref || backHref.toLowerCase().indexOf("disk_uploadresult.html") < 0) {
            throw "未上传完成";
        }
        Tip.FileCount = 1;
        Tip.Percent = 100;
        isUploading = false;
        $("#commonUploadProgress")[0].style.display = "none";
        var resultCode = DiskQueryString("Retcode", backHref);
        var retdesc = DiskQueryString("retdesc", backHref);
        var filename = DiskQueryString("filename", backHref);
        var filesize = DiskQueryString("fileSize", backHref); //字节
        if (resultCode == "0") {

        } else if (resultCode == "7") {
            //行为
            var level = GetUploadSizeLevel(filesize);
            window.alert(UploadResultError[resultCode].format(filename));
            isUploadNeedRefresh = true;
            closeWindow();
        } else if (resultCode == "9" && filesize == "0") {
            window.alert(UploadResultError[13].format(filename));
            closeWindow();
        } else {
            window.alert(UploadResultError[resultCode].format(filename));
            closeWindow();
        }
    } catch (e) {
        if (isUploading) {
            setTimeout(UploadResult, 200);
        }
    }
}
function GetUploadSizeLevel(size) {
    var level = 1;
    size = parseInt(size);
    var l = size / (1024 * 1024);
    if (l > 100) {
        level = 4;
    } else if (l > 50) {
        level = 3;
    } else if (l > 10) {
        level = 2;
    }
    return level;
}
function ResetCommonUpload() {
    uploadWindow.show();
    var frameId = "uploadiframe";
    document.getElementById(frameId).src = "";
    $('#resetBtn').click();
    $("#commonUpload")[0].style.display = "";
}
function UploadClose() {
    if (isUploading) {
        return closeWindow();
    } else {
        return closeWindow();
    }
}
function closeWindow() {
    if (isUploading && !window.confirm("文件正在上传，确定要关闭吗？")) {
        return false;
    } else {
        if (isUploading) {//取消现有的上传
            location.href = location.href;
        }
        try {
            clearInterval(window.tipDiskTimer);
            top.jQuery("#newvDiskMinIcon").hide();
            top.jQuery("#newvDiskTip").remove();
        } catch (ex) { }
        if (isUploadNeedRefresh) {
            var win = DiskTool.getDiskWindow();
            window.setTimeout(function() {
                try { win.Toolbar.refreshList(); } catch (ex) { };
                try { win.FileList.Render.renderParent(); } catch (ex) { };
            }, 0);
        }
        top.FloatingFrame.close();
    }
}
function UploadCancel() {
    location.href = location.href;
}
function FlashUploadInit() {
    /*界面超时处理*/
    if (Utils.PageisTimeOut(true)) return;
    //树形菜单选项
    $("#file-tree").click(function(event) {
        $("#file-tree2").attr("style", "display:block");
        DirectoryTree.ClickDirTree(true);
        Utils.stopEvent(event);
    });
    $(document).click(function() {
        $("#file-tree2").hide();
    });
    //初始化来源
    InitFromDirectory();
    $("#divFlashLayer").css("visibility", "visible");
    CommonInit();
}
function flashOnload() {
    if ($.browser.mozilla) {
        top.FloatingFrame.current.jContainer.css({ position: "relative" });
        setTimeout(function() {
            top.FloatingFrame.current.jContainer.css({ position: "absolute" });
        }, 0);
    }
    flashOnload = function() { };
}
//普通上传初始化
function UploadPageInit() {
    isCommonUpload = true;
    $("#aUploadBtn").click(function() {
        SubmitUpload();
    });
    $("#aUploadCancelBtn").click(function() {
        onAndtotal(1007, "用户取消上传", false);
        UploadCancel();
        return false;
    });
    $("#aUploadCloseBtn").click(function() {
        UploadClose();
    });
    $("#pinstall").html(InstallControlTips.format(top.ucDomain + "/largeattachments/html/control139.htm"));
    /*界面超时处理*/
    if (Utils.PageisTimeOut(true)) return;
    //树形菜单选项
    $("#file-tree").click(function(event) {
        $("#file-tree2").attr("style", "display:block");
        DirectoryTree.ClickDirTree(true);
        Utils.stopEvent(event);
    });
    $(document).click(function() {
        $("#file-tree2").hide();
    });
    //初始化来源11
    InitFromDirectory();
    CommonInit();
    $(".after").hide().parent().css("border", 0);
    //普通上传显示图片预览
    $("#file").change(function() {
        selectPicEvent(this);
        hideTipMessage();
    });
}
/**
*选择图片时的事件
*/
function selectPicEvent(f) {
    if (f.value != "") {
        var extName = DiskTool.getFileExtName($(f).val()) + ",";
        extName = extName.toLowerCase();
        if (acceptPhotoExtend.replace(",tif", "").replace(",tiff", "").indexOf(extName) >= 0) {
            var ua = navigator.userAgent;
            var img = document.getElementById('imgPreview');
            var imgUrl = "";
            if (ua.indexOf('MSIE 6') > -1) {
                $("#img").attr("src", f.value).show();
                $(".after").hide().parent().css("border", 0);
            } else if (ua.indexOf('MSIE') > -1) {
                var imgSrc = f.value;
                imgSrc = "file:///" + imgSrc.replace(/\\/g, "/");
                img.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=scale, src='" + imgSrc + "')";
                $("#img").hide().parent().css("border", 0);
            } else if (f.files && f.files.length > 0) {
                var imgUrl = "";
                if (f.files.item(0).getAsDataURL) {
                    imgUrl = f.files.item(0).getAsDataURL();
                } else {
                    imgUrl = window.URL.createObjectURL(f.files[0]);
                }
                $("#img").attr("src", imgUrl).show();
                $(".after").hide().parent().css("border", 0);
            }
            $(".after").css("display", "block");
        }
    }
}
function CommonInit() {
    uploadWindow = top.FloatingFrame.current;
    if (UploadType == "flash" && $.browser.firefox && false) {
        //无动作
    } else {
        if (uploadWindow) {
            uploadWindow.onshow = function () {
                clearInterval(window.tipDiskTimer);
                top.jQuery("#newvDiskMinIcon").hide();
                top.jQuery("#newvDiskTip").remove();
            };
        }
    }
    //当最小化窗口
    if (uploadWindow) {
        uploadWindow.onminimize = function () {
            tipDiskTimer = setInterval(Tip.update, 1000);
            Tip.update();
            var winPosition = uploadWindow.jContainer.offset();
            var layer = top.jQuery("<div style='position:absolute;border:4px solid silver;'></div>")
            .appendTo(top.document.body)
            .css({
                top: winPosition.top,
                left: winPosition.left,
                height: uploadWindow.jContainer.height(),
                width: uploadWindow.jContainer.width()
            });
            var endPosition = top.jQuery("#newvDiskMinIcon").offset();
            layer.animate({
                left: endPosition.left,
                top: endPosition.top,
                width: 0,
                height: 0
            }, 500, null, function () {
                layer.remove();
            });
        };
    }
}
function DisabledButtons(id) {
    var link = document.getElementById(id);
    link.style.color = "silver";
    link._onclick = link.onclick;
    $("#" + id).unbind("click");
}
function EnabledButtons(id, fn) {
    var link = document.getElementById(id);
    //disableLink的反作用
    link.style.color = "";
    if (fn) {
        $("#" + id).click(fn);
    }
    link.style.cursor = "pointer";
}
/**
*标签对象
*/
Tip = {
    isCompleted: function() {
        return false;
    },
    update: function() {
        var icon = top.jQuery("#newvDiskMinIcon");
        var tip = top.jQuery("#newvDiskTip");
        if (tip.length == 0) {
            var htmlCode = '<div style="display:none" id="newvDiskTip" class="shadow"></div>';
            tip = top.jQuery(htmlCode).appendTo(top.document.body);
        }
        if (icon.css("display") == "none") {
            top.switchNewDiskIconMode("Uploading");
            icon.unbind("hover");
            icon.hover(function() {
                var offset = $(this).offset();
                top.jQuery("#newvDiskTip").css({
                    top: offset.top,
                    left: offset.left + 30,
                    display: "block"
                });
            }, function() {
                top.jQuery("#newvDiskTip").hide();
            });
        }
        icon[0].onclick = function() {
            uploadWindow.show();
        }
        var htmlCode;
        var uploadType = window.UploadType;
        if (uploadType == "common") {//普通上传提示
            htmlCode = '<div class="sd-content">\
            <div class="bd"><p>&nbsp;</p><p>&nbsp;</p>\
            <div class="clear"></div>\
            <em style="font-size:14px">查看上传文件</em></div>\
            <div class="pointer">\
            <div class="pt-bd"></div>\
            </div></div>';
        } else {
            var speed = GetUploadSpeed();
            var fileCount = GetUploadFileCount();
            var progress = DiskTool.getPersentText(GetUploadProgress());
            if (progress == "100%") {
                icon[0].className = "fileExpOk";
            }
            htmlCode = '<div class="sd-content">\
                <div class="bd">\
                            <p>{0}</p>\
                            <p>文件数：{1}个</p>\
                <div class="clear"></div>\
                <em>{2}</em>\
                        </div>\
                <div class="pointer">\
                <div class="pt-bd"></div>\
                </div>\
                </div>'.format(
                    DiskTool.getFileSizeText(speed) + "/秒",
                    fileCount,
                    progress);
            if (fileCount == 0) {
                htmlCode = '<div class="sd-content">\
                <div class="bd"><p>&nbsp;</p><p>&nbsp;</p>\
                <div class="clear"></div>\
                <em style="font-size:14px">没有文件</em></div>\
                <div class="pointer">\
                <div class="pt-bd"></div>\
                </div></div>';
            }
        }
        top.jQuery("#newvDiskTip").html(htmlCode);
    }
}

$(function () {

    $("#pTips").find("a").click(function () {
        top._diskUploadWindow.jContainer.find("a[title=最小化窗口]").click();
        top.Links.show('upgradeGuide');
        top.FF.close();
    });
})
/**
*flash对象
*/
function SWFObject(swf, id, w, h, ver, c) {
    this.params = new Object();
    this.variables = new Object();
    this.attributes = new Object();
    this.setAttribute("id", id);
    this.setAttribute("name", id);
    this.setAttribute("width", w);
    this.setAttribute("height", h);
    this.setAttribute("version", ver);
    this.setAttribute("swf", swf);
    this.setAttribute("classid", "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000");
    if (c) {
        this.addParam("bgcolor", c);
    }
}
SWFObject.prototype.addParam = function(key, value) {
    this.params[key] = value;
}
SWFObject.prototype.getParam = function(key) {
    return this.params[key];
}
SWFObject.prototype.addVariable = function(key, value) {
    this.variables[key] = value;
}
SWFObject.prototype.getVariable = function(key) {
    return this.variables[key];
}
SWFObject.prototype.setAttribute = function(key, value) {
    this.attributes[key] = value;
}
SWFObject.prototype.getAttribute = function(key) {
    return this.attributes[key];
}
SWFObject.prototype.getVariablePairs = function() {
    var variablePairs = new Array();
    for (key in this.variables) {
        variablePairs.push(key + "=" + this.variables[key]);
    }
    return variablePairs;
}
SWFObject.prototype.getHTML = function() {
    var con = '';
    if (navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) {
        con += '<embed type="application/x-shockwave-flash"  pluginspage="http://www.macromedia.com/go/getflashplayer" src="' + this.getAttribute('swf') + '" width="' + this.getAttribute('width') + '" height="' + this.getAttribute('height') + '"';
        con += ' id="' + this.getAttribute('id') + '" name="' + this.getAttribute('id') + '" ';
        for (var key in this.params) {
            con += [key] + '="' + this.params[key] + '" ';
        }
        var pairs = this.getVariablePairs().join("&");
        if (pairs.length > 0) {
            con += 'flashvars="' + pairs + '"';
        }
        con += '/>';
    } else {
        con = '<object id="' + this.getAttribute('id') + '" classid="' + this.getAttribute('classid') + '"  codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=' + this.setAttribute("version") + ',0,0,0" width="' + this.getAttribute('width') + '" height="' + this.getAttribute('height') + '">';
        con += '<param name="movie" value="' + this.getAttribute('swf') + '" />';
        for (var key in this.params) {
            con += '<param name="' + key + '" value="' + this.params[key] + '" />';
        }
        var pairs = this.getVariablePairs().join("&");
        if (pairs.length > 0) { con += '<param name="flashvars" value="' + pairs + '" />'; }
        con += "</object>";
    }
    return con;
}
SWFObject.prototype.write = function(elementId) {
    if (typeof elementId == 'undefined') {
        document.write(this.getHTML());
    } else {
        var n = (typeof elementId == 'string') ? document.getElementById(elementId) : elementId;
        n.innerHTML = this.getHTML();
    }
}