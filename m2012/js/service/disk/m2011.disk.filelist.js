window["crumb"] = [{
    Id: null,
    Name: "彩云网盘",
    Level: 1
}];
var FileList = {
    /**
    *接口地址
    */
    Uri: {},
    /**
    *提示语
    */
    Messages: {
        Res_CheckFile: "请选择文件",
        Res_Del_Fail: "删除失败，请稍后再试。",
        Res_Del_Fail_More: "文件夹下文件过多，请先删除该文件夹下的文件再删除该文件夹。",
        Res_Del_Flv1: "确定要删除选定的1个视频邮件文件吗？删除后收件人将无法查看您发送的视频邮件。",
        Res_Del_Flv2: "您删除的文件含有视频邮件文件，删除后收件人将无法查看您发送的视频邮件。确定要删除吗？",
        Res_Del_Success: "删除成功！",
        CanNotMoveSysFolder: "“{0}”是系统文件夹，不能移动！",
        ImageCanNotCopy: "只有图片文件才能移动到“我的相册”中！",
        MusicCanNotCopy: "只有音乐文件才能移动到“我的音乐”中！",
        SameDiretory: "您不能选择本文件夹移动到本文件夹！",
        CheckSameDiretory: "您选择的文件夹中包含目标文件夹，不能移动！",
        SendFiveFile: "一次只能发送50个文件,请取消部分文件！",
        CanNotSendFolder: "只能发送文件，暂不支持文件夹发送！",
        SendOneMMSFile: "通过彩信发送文件快递只能操作一个文件！",
        MoveSlefFolder_Fail: "不允许将一个目录移动到它的子目录下面！",
        HaveSameName_Fail: "移动出错：已有同名目录/文件存在！",
        FiveMoreDir_Fail: "最多支持5级目录,超过5级不能移动！",
        Move_Success: "移动成功！",
        Move_Fail: "移动失败，请稍后再试。",
        System_fail: "系统创建的文件夹暂不允许删除！",
        System_fail2: "您选择的文件夹中包含系统创建的文件夹，系统创建的文件夹暂不允许删除！",
        SelectInfo: "请选择文件",
        SelectFileCount_err: "所选文件夹为空，不能下载"
    },
    /**
    *行为对象
    */
    Action: {
        alert: function (msg, action) {
            DiskTool.FF.alert(msg, function () {
                if (action) {
                    action();
                }
            });
        },
        resConfirmDelete: function (fileCount, folderCount) {
            var s = "确定要删除选定的";
            var t = "";
            if (folderCount) {
                t += folderCount + "个文件夹";
            }
            if (fileCount) {
                if (t != "") {
                    t += "和";
                }
                t += fileCount + "个文件";
            }
            t += "吗？";
            s += t;
            if (folderCount == null || folderCount == 0) {
                s += "删除后将无法恢复";
            } else {
                s = "删除文件夹将同时删除其中的文件，" + s;
            }
            return s;
        },
        pushCrumb: function (data) {
            window["crumb"].push(data);
            FileList.Render.renderCrumb();
        },
        popCrumb: function () {
            window["crumb"].pop();
            FileList.Render.renderCrumb();
        }
    },
    /**
    *事件对象
    */
    Event: {
        //页面初始化
        initial: function () {
            Toolbar.initial(); //工具栏按钮设定
            //生成头部mappath
            FileList.Ajax.getMapPath();
            //判断是获取全部列表还是某文件夹下列表
            if (Utils.queryString("id") != DiskConf.diskRootDirID && Utils.queryString("id") != null && Utils.queryString("id") != "") {
                $("div.tbl-list-return").show();
                FileList.Ajax.getFileList(Utils.queryString("id")); //传递文件夹ID
            } else {
                $("div.tbl-list-return").hide();
                FileList.Ajax.getFileList(DiskConf.diskRootDirID); //传递根目录ID
            }
            FileList.Render.renderCapacity2(Utils.queryString("id"));
        },
        //全选时事件
        clickCheckBoxAll: function (v, count) {
            FileList.Event.clickCheckBoxCommon();
        },
        //选单行的Checkbox的时候
        clickCheckBoxInRow: function (checked, cb, row) {
            FileList.Render.renderCheckedRow(cb.checked, row);
            FileList.Event.clickCheckBoxCommon();
        },
        clickCheckBoxCommon: function () {
            var allChecked = $("#tbl-fileList>tr>td").find(":checked");
            var selectCount = allChecked.length;
            //文件快递  
            if (selectCount > 0) {
                $.enableElement($("#aDown"));
                $.enableElement($("#aMove"));
                $.enableElement($("#aDel"));
                if (selectCount == 1) {
                    $.enableElement($("#aProperty"));
                } else {
                    $.disableElement($("#aProperty"));
                }
                var isbreak = false;
                allChecked.parent().parent().each(function () {
                    var type = $(this).data("data").TYPE;
                    if (type != "2") {
                        isbreak = true;
                        return false;
                    }
                });
                if (isbreak) {
                    $.disableElement($("#aShare"));
                } else {
                    $.enableElement($("#aShare"));
                }
            } else {
                $.disableElement($("#aDown"));
                $.disableElement($("#aShare"));
                $.disableElement($("#aMove"));
                $.disableElement($("#aDel"));
                $.disableElement($("#aProperty"));
            }
            //控制文件快递
            Toolbar.controlSendPanel({
                data: $.grep(Toolbar.getAllSelectedRow(), function (n) {
                    return n.TYPE == "2";
                }),
                preValid: function () {
                    return Toolbar.getCheckFolder("count") < 1;
                }
            });
        },
        /*文件名下方的anchor对象*/
        anchorAction: {
            "sharef": function (tempObj, eParent, eSource) {
                $("#tbl-fileList>tr").find("td>:checkbox").attr("checked", false);
                if (eSource)
                    eParent.find(":checkbox").attr("checked", "checked");
                Toolbar.share(eSource);
            },
            "down": function (tempObj) {
                FileList.Ajax.download(tempObj.fileid, tempObj.type, tempObj.filename, tempObj.filenum);
            },
            "del": function (tempObj) {
                if (tempObj.dirflag == 0 && tempObj.type != 2) {
                    DiskTool.FF.alert(FileList.Messages.System_fail);
                    return;
                }
                FileList.Ajax.deleteItem(tempObj.fileid, tempObj.type, tempObj.sourcetype);
            },
            "open": function (tempObj) {
                if (tempObj.type == "3") {
                    //打开相册
                    window.location = "disk_myalbum.html";
                    return;
                }
                if (tempObj.type == "4") {
                    //打开音乐
                    window.location = "disk_music.html";
                    return;
                }
                if (window.parent.DiskInfo) {
                    window.parent.DiskInfo.Action.Expand(0, tempObj.fileid);
                }
                window.location = "disk_default.html?ty=0&id=" + tempObj.fileid;
                //打开之后定位main页的滚动条到顶部
                DiskTool.mainScroll();
            },
            "sendWap": function (tempObj) {
                if (top.$User && !top.$User.checkAvaibleForMobile()) { //非移动用户，屏闭wap短信发送
                    return;
                }
                DiskTool.addDiskBehavior({
                    actionId: 7007,
                    thingId: 0,
                    moduleId: 11,
                    actionType: 20
                });
                setTimeout(function () {
                    top.Links.show("quicklyShare", "&type=mobile&fileId=" + tempObj.fileid);
                }, 0);
            },
            "shareToWB": function (tempObj) {
                DiskTool.sendToWb(tempObj.fileid);
            },
            "play": function (tempObj) {
                DiskTool.addDiskBehavior({
                    actionId: 7005,
                    thingId: 0,
                    moduleId: 11,
                    actionType: 20
                });
                DiskTool.appendMusic([{
                    FileId: tempObj.fileid,
                    Name: tempObj.filename
                }]);
            },
            "preview": function (tempObj, id, This) {
                FileList.Render.getPreviewImg(function (previewImg) {
                    var filerefid = This.attr("filerefid");
                    var len = previewImg.length;
                    var index = 0;
                    for (var i = 0; i < len; i++) {
                        if (previewImg[i].filerefid == filerefid) {
                            index = i;
                            break;
                        }
                    }
                    if (typeof (top.focusImagesView) != "undefined") {
                        top.focusImagesView.render({ data: previewImg, index: index });
                    }
                    else {
                        top.M139.registerJS("M2012.OnlinePreview.FocusImages.View", "packs/focusimages.html.pack.js?v=" + Math.random());
                        top.M139.requireJS(['M2012.OnlinePreview.FocusImages.View'], function () {
                            top.focusImagesView = new top.M2012.OnlinePreview.FocusImages.View();
                            top.focusImagesView.render({ data: previewImg, index: index });
                        });
                    }
                });
            },
            "preview2": function (tempObj) {
                //预览附件
                DiskTool.addDiskBehavior({
                    actionId: 7012,
                    thingId: 0,
                    moduleId: 11,
                    actionType: 20
                });
                var downcgiurl = DiskTool.resolveUrl("download", true);
                var downloadUrl = "";
                $.postXml({
                    url: downcgiurl,
                    data: XmlUtility.parseJson2Xml({
                        userNumber: top.UserData.userNumber,
                        folderid: "",
                        fileid: tempObj.fileid,
                        downname: escape(tempObj.filename)
                    }),
                    async: false,
                    timeout: 120000,
                    success: function (result) {
                        //处理album数据
                        if (result.code == DiskConf.isOk) {
                            downloadUrl = result["var"].url;
                        }
                        else { DiskTool.FF.alert(result.summary); }
                    },
                    error: function (error) {
                        DiskTool.handleError(error);
                    }
                });
                if (downloadUrl) {
                    var url = "http://" + top.location.host + "/m2012/html/onlinepreview/online_preview.html?src=disk&sid={0}&mo={1}&id={2}&dl={3}&fi={4}&skin={5}&resourcePath={6}&diskservice={7}&filesize={8}&disk={9}";
                    url = url.format(
						top.UserData.ssoSid,
						top.uid,
						tempObj.fileid,
						encodeURIComponent(downloadUrl),
						encodeURIComponent(tempObj.filename),
						top.UserConfig.skinPath,
						encodeURIComponent(DiskTool.getResource()),
						encodeURIComponent(top.SiteConfig.diskInterface),
						tempObj.filesize,
						top.SiteConfig.disk
					);
                    window.open(url);
                }
            },
            "resume": function (tempObj) {
                var pid = Toolbar.getCurrentDirectoryId();
                var tempDirName = window["crumb"][window["crumb"].length - 1].Name;
                DiskTool.openUpload(0, pid, encodeURIComponent(tempDirName), encodeURIComponent(tempObj.filerefid));
            },
            "rename": function (data, fra) {
                if (data.type == "1") {
                    //文件夹
                    var url = DiskTool.getRelativeUrl("disk_dialogdocproperty.html?sid=" + FileList.Ajax.getUserInfo());
                    url += "&id=" + data.fileid;
                    url += "&ctime=" + DiskTool.replace(data.uploadtime, " ", ",");
                    DiskTool.FF.open("文件夹属性", url, 450, 245, true);
                } else {
                    //文件
                    var url = DiskTool.getRelativeUrl("disk_dialogfileproperty.html?sid=" + FileList.Ajax.getUserInfo());
                    url += "&id=" + data.fileid;
                    window.DiskTool.FF.open("文件属性", url, 450, 215, true);
                }
            }
        },
        //刷新列表
        refresh: function (list, pid) {
            $.disableElement($("#aDown"));
            $.disableElement($("#aShare"));
            $.disableElement($("#aSendFile"));
            $.disableElement($("#aMove"));
            $.disableElement($("#aDel"));
            $.disableElement($("#aProperty"));
            var level = window["cachePid"].length;
            if (level >= 5) {
                $.disableElement($("#aCreateDoc"));
            } else {
                $.enableElement($("#aCreateDoc"));
            }
        }
    },
    /**
    *界面代码
    */
    Render: {
        renderCrumb: function () {
            var crumbContainer = $("#crumbContainer");
            crumbContainer.empty();
            var spearator = $("<span>&nbsp;&gt;&nbsp;</span>");
            var max = window["crumb"].length;
            $.each(window["crumb"], function (i) {
                var data = this;
                var temp = $("<a>" + Utils.htmlEncode(data.Name) + "</a>");
                temp.data("data", data);
                temp.click(function () {
                    var thisData = $(this).data("data");
                    var currentLevel = thisData.Level;
                    var diff = window["crumb"].length - currentLevel;
                    if (diff > 0) {
                        for (var i = 0; i < diff; i++) {
                            window["crumb"].pop();
                            window["cachePid"].pop();
                        }
                        FileList.Ajax.getFileList(window["cachePid"].pop());
                        FileList.Render.renderCrumb();
                    }
                });
                crumbContainer.append(temp);

                if (i < max - 1) {
                    crumbContainer.append(spearator.clone());
                }
            });
        },
        /*刷新上级数据*/
        renderParent: function () {
            if (window.parent.DiskInfo) {
                var id = 0;
                if (Utils.queryString("id") != null) {
                    id = Utils.queryString("id");
                } else {
                    id = window["cachePid"][window["cachePid"].length - 1];
                }
                window.parent.Event.refreshData(id, 0);
                FileList.Render.renderCapacity2(id);
            }
        },
        /*重新渲染容量*/
        renderCapacity2: function (id) {
            if (window.parent.TiteInfo) {
                window.parent.TiteInfo.setVal(0, $(".folderPath"), id);
            }
        },
        renderCheckedRow: function (checked, row) {
            if (!row.find("td>:checkbox").attr("disabled")) {
                if (checked) {
                    if (!row.hasClass("t-checked")) {
                        row.addClass("t-checked");
                    }
                } else {
                    if (row.hasClass("t-checked")) {
                        row.removeClass("t-checked");
                    }
                }
            }
        },
        getImgUrl: function (filerefid, callback) {  //获取缩略图数组
            var imgurl = DiskTool.resolveUrl('getthumbnailimage', true);
            filerefid = filerefid.join(",");
            var thumbimg = "";
            $.postXml({
                url: imgurl,
                data: XmlUtility.parseJson2Xml({
                    name: top.UserData.ssoSid,
                    fileids: filerefid,
                    width: 72,
                    height: 72
                }),
                async: false,
                timeout: 120000,
                success: function (result) {
                    if (result.code != 'S_OK') {
                        //服务器抛出异常
                        FileList.Action.alert(result.summary);
                    } else {
                        var allFiles = FileList.Render.allFiles;
                        var pageIndex = ListPager.Filter.pageIndex;
                        var firstNum = pageIndex * 10;
                        var previewImg = [];
                        for (var i = firstNum; i < firstNum+10; i++) {
                            var dataObj = allFiles[i];
                            if (!dataObj) { break }
                            var isImg = /(?:\.jpg|\.gif|\.png|\.ico|\.jfif|\.tiff|\.tif|\.bmp|\.jpeg|\.jpe)$/i.test(dataObj.filename);
                            if (isImg) {
                                var downLoad = FileList.Render.getDownloadAttachUrl(dataObj);
                                previewImg.push({
                                    imgUrl: result['var'][dataObj.filerefid],
                                    fileName: dataObj.filename,
                                    downLoad: downLoad,
                                    comefrom: "disk",
                                    filerefid: dataObj.fileid
                                })
                            }
                        }
                        callback(previewImg)
                    }
                },
                error: function (error) {
                    DiskTool.handleError(error);
                }
            });
        },
        imgUrl: null,
        pageIndex: 0,
        previewImg: [],
        allFiles: [],
        getPreviewImg: function (callback) {
            var result = FileList.Render.allFiles;
            var fileid = [];
            for (var i = 0; i < result.length; i++) {
                var dataObj = result[i];
                var isImg = /(?:\.jpg|\.gif|\.png|\.ico|\.jfif|\.tiff|\.tif|\.bmp|\.jpeg|\.jpe)$/i.test(dataObj.filename);
                if (isImg) {
                    fileid.push(dataObj.fileid)
                }
            }
            FileList.Render.getImgUrl(fileid, callback);
        },
        getDownloadAttachUrl: function (dataObj) {
            var downcgiurl = DiskTool.resolveUrl("download", true);
            var downloadUrl = "";
            var fileName = dataObj.filename;
            if (top.$B.is.firefox) {
                fileName = fileName.replace(/ /g, "_");
            }
            $.postXml({
                url: downcgiurl,
                data: XmlUtility.parseJson2Xml({
                    userNumber: top.UserData.userNumber,
                    folderid: "",
                    fileid: dataObj.fileid,
                    downname: escape(fileName)
                }),
                async: false,
                timeout: 120000,
                success: function (result) {
                    //处理album数据
                    if (result.code == DiskConf.isOk) {
                        downloadUrl = result["var"].url;
                    }
                },
                error: function (error) {
                    DiskTool.handleError(error);
                }
            });
            return downloadUrl;
        },
        /*渲染文件列表*/
        renderFileList: function (list) {
            //根据当前目录，定位右侧目录展开的位置
            if (window.parent.DiskInfo.Data) {//判断目录结构数据
                var id = window["cachePid"].pop() || Utils.queryString("id", window.location.href);
                window.parent.DiskInfo.Action.Expand(0, id);
            }
            $.getById("cbSelectAllFile", true).checked = false;
            $("#lblSelectAllFile").text("全选");
            $("#lblSelectAllFile2").text("全选");

            var table = $("#tbl-fileList");
            table.empty();
            if (list.length == 0) {//文件列表与目录列表都为空的情况下
                $("div.tbl-list-null").show();
            } else {
                $("div.tbl-list-null").hide();
                //文件列表DOM对象
                var rowElement = $("                                    \
                    <tr>                                                \
                        <td class='t-check'>                            \
                            <input type='checkbox' />                   \
                            <input type='hidden' />                     \
                        </td>                                           \
                        <td class='t-type'><a class='thumbnail'><i></i></a></td>              \
                        <td class='t-name'><a class='title'></a><span class='subFileCount' /> \
                        <p></p>                                         \
                        </td>                                           \
                        <td class='t-date'></td>                        \
                        <td class='t-size'></td>                        \
                    </tr>");
                var shareHand = $("<i class=\"i-hand\" title=\"共享\"></i>");
                var rowClick = function () {
                    var cb = $(this).find(":checkbox");
                    if (cb.length > 0 && !cb[0].disabled) {
                        cb[0].checked = !cb[0].checked;
                        FileList.Event.clickCheckBoxInRow(cb[0].checked, cb[0], $(this));
                    }
                };
                //点击单选框
                var cbSingleClick = function (e) {
                    var row = $(this).parent().parent();
                    FileList.Event.clickCheckBoxInRow(this.checked, this, row);
                    e.stopPropagation();
                };
                //文件夹dom
                var rowTool_folder = $("<a class='fcI open' href='javascript:;'>打开</a>&nbsp;|&nbsp;<a class='fcI down' href='javascript:;'>下载</a>&nbsp;<a class='fcI sharef' href='javascript:;'>共享</a>&nbsp;<a class='fcI shareToWB' href='javascript:'>发布到微博</a>&nbsp;<span>|&nbsp;</span><a class='fcI rename' href='javascript:;'>重命名</a>&nbsp;<a class='fcI del' href='javascript:;'>删除</a>");
                //续传dom
                var rowTool_resume = $("<a class='fcI resume' href='javascript:;'>续传</a>&nbsp;|&nbsp;<a class='fcI del' href='javascript:;'>删除</a>");
                //音乐列表dom
                var rowTool_audio = $("<a class='fcI play' href='javascript:;'>播放</a>&nbsp;|&nbsp;<a class='fcI down' href='javascript:;'>下载</a>&nbsp;<a class='fcI sharef' href='javascript:;'>共享</a>&nbsp;<a class='fcI sendWap' href='javascript:'>发送到手机（WAP）</a>&nbsp;<a class='fcI shareToWB' href='javascript:'>发布到微博</a>&nbsp;<span>|&nbsp;</span><a class='fcI rename' href='javascript:;'>重命名</a>&nbsp;<a class='fcI del' href='javascript:;'>删除</a>");
                //文件列表dom
                var rowTool_file = $("<a class='fcI down' href='javascript:;'>下载</a>&nbsp;<a class='fcI sharef' href='javascript:;'>共享</a>&nbsp;<a class='fcI sendWap' href='javascript:'>发送到手机（WAP）</a>&nbsp;<a class='fcI shareToWB' href='javascript:'>发布到微博</a>&nbsp;<span>|&nbsp;</span><a class='fcI rename' href='javascript:;'>重命名</a>&nbsp;<a class='fcI del' href='javascript:;'>删除</a>");

                //生成文件列表
                var fileCount = list.length;

                //将我的音乐和我的相册交换位置，强制像我的相册在前面
                if (list[0].type == 4) {//第一个为我的音乐
                    var musicObj = list[0];
                    list[0] = list[1];
                    list[1] = musicObj;
                }
                var imgNum = 0;
                var pageIndex = ListPager.Filter.pageIndex;
                if (fileCount > 0) {
                    for (var i = 0; i < fileCount; i++) {
                        var dataObj = list[i];
                        if (top.FilePreview.isRelease() || 1) {//判断附件预览是否全网开放
                            //var prvExp = "doc/docx/xls/xls/ppt/pdf/txt/htm/html/pptx/xlsx";
                            var prvExp = "doc/docx/xls/xls/ppt/pdf/txt/pptx/xlsx"; //临时屏蔽html文件的预览功能
                            var prvExp2 = "rar/zip/7z";
                            var isImg = /(?:\.jpg|\.gif|\.png|\.ico|\.jfif|\.tiff|\.tif|\.bmp|\.jpeg|\.jpe)$/i.test(dataObj.filename);
                            var index = "";
                            if (isImg) {
                                imgNum++;
                                index = (pageIndex * 10) + imgNum - 1;
                            }
                            //图片列表dom
                            var rowTool_pic = $("<a class='fcI preview' filerefid='" + dataObj.fileid + "' index='" + index + "' href='javascript:;'>预览</a>&nbsp;|&nbsp;<a class='fcI down' href='javascript:;'>下载</a>&nbsp;<a class='fcI sharef' href='javascript:;'>共享</a>&nbsp;<a class='fcI sendWap' href='javascript:'>发送到手机（WAP）</a>&nbsp;<a class='fcI shareToWB' href='javascript:'>发布到微博</a>&nbsp;<span>|&nbsp;</span><a class='fcI rename' href='javascript:;'>重命名</a>&nbsp;<a class='fcI del' href='javascript:;'>删除</a>");
                            if (DiskTool.getFileExtName(dataObj.filename).length > 0 && prvExp.indexOf(DiskTool.getFileExtName(dataObj.filename).toLowerCase()) > -1) {
                                var prvcmd = "<a class='fcI preview2' href='javascript:;'>预览</a>&nbsp;|&nbsp;";
                                //重定义 rowTool_file
                                rowTool_file = $(prvcmd + "<a class='fcI down' href='javascript:;'>下载</a>&nbsp;<a class='fcI sharef' href='javascript:;'>共享</a>&nbsp;<a class='fcI sendWap' href='javascript:'>发送到手机（WAP）</a>&nbsp;<a class='fcI shareToWB' href='javascript:'>发布到微博</a>&nbsp;<span>|&nbsp;</span><a class='fcI rename' href='javascript:;'>重命名</a>&nbsp;<a class='fcI del' href='javascript:;'>删除</a>");
                            } else if (DiskTool.getFileExtName(dataObj.filename).length > 0 && prvExp2.indexOf(DiskTool.getFileExtName(dataObj.filename).toLowerCase()) > -1) {			//判断是否为压缩文件
                                var prvcmd = "<a class='fcI preview2' href='javascript:;'>打开</a>&nbsp;|&nbsp;";
                                //重定义 rowTool_file
                                rowTool_file = $(prvcmd + "<a class='fcI down' href='javascript:;'>下载</a>&nbsp;<a class='fcI sharef' href='javascript:;'>共享</a>&nbsp;<a class='fcI sendWap' href='javascript:'>发送到手机（WAP）</a>&nbsp;<a class='fcI shareToWB' href='javascript:'>发布到微博</a>&nbsp;<span>|&nbsp;</span><a class='fcI rename' href='javascript:;'>重命名</a>&nbsp;<a class='fcI del' href='javascript:;'>删除</a>");
                            } else {
                                rowTool_file = $("<a class='fcI down' href='javascript:;'>下载</a>&nbsp;<a class='fcI sharef' href='javascript:;'>共享</a>&nbsp;<a class='fcI sendWap' href='javascript:'>发送到手机（WAP）</a>&nbsp;<a class='fcI shareToWB' href='javascript:'>发布到微博</a>&nbsp;<span>|&nbsp;</span><a class='fcI rename' href='javascript:;'>重命名</a>&nbsp;<a class='fcI del' href='javascript:;'>删除</a>");
                            }
                            if (dataObj.filesize > 1024 * 1024 * 20) {
                                rowTool_file = $("<a class='fcI down' href='javascript:;'>下载</a>&nbsp;<a class='fcI sharef' href='javascript:;'>共享</a>&nbsp;<a class='fcI sendWap' href='javascript:'>发送到手机（WAP）</a>&nbsp;<a class='fcI shareToWB' href='javascript:'>发布到微博</a>&nbsp;<span>|&nbsp;</span><a class='fcI rename' href='javascript:;'>重命名</a>&nbsp;<a class='fcI del' href='javascript:;'>删除</a>");
                            }
                        }
                        //设定文件与文件夹样式
                        var rowTool = rowTool_folder;
                        var isAudio = false; //是否是音频
                        var extType = null; //后缀名
                        var imageCss = "folder"; //普通文件夹样式
                        if (dataObj.type == 3) {//相册文件夹样式
                            imageCss = "folder-p";
                            window["albumid"] = dataObj.fileID;
                        } else if (dataObj.type == 4) {//音乐文件夹样式
                            imageCss = "folder-m";
                            window["musicid"] = dataObj.fileID;
                        } else if (dataObj.type == 2) {//文件
                            var ext = DiskTool.getFileExtName(dataObj.filename);
                            imageCss = DiskTool.getFileImageClass(ext);
                            if (dataObj.isresume == 1) {
                                rowTool = rowTool_resume;
                                imageCss = "no-load";
                            } else {
                                extType = DiskTool.getExtType(ext);
                                switch (extType) {
                                    case "pic":
                                        {
                                            rowTool = rowTool_pic;
                                            break;
                                        }
                                    case "audio":
                                        {
                                            rowTool = rowTool_audio;
                                            //播放图标
                                            isAudio = true;
                                            break;
                                        }
                                    default:
                                        {
                                            rowTool = rowTool_file;
                                            break;
                                        }
                                }
                            }
                        }
                        var fragment = rowElement.clone(); //克隆行对象
                        var time = dataObj.createtime || dataObj.uploadtime;
                        if (time && time != "") {
                            time = DiskTool.formatDate(time);
                        }
                        fragment.find("a.title").text(dataObj.filename).attr("title", dataObj.filename + "(" + dataObj.filenum + ")"); //mouseover(titleMouse);
                        fragment.find("td.t-date").text(time);
                        fragment.find("i:first").addClass(imageCss); //添加样式
                        fragment.find("td.t-size").text(dataObj.filesize == 0 ? "" : DiskTool.getFileSizeText(parseFloat(dataObj.filesize), true));

                        if (extType == "pic") {//文件为图片
                            var thumbnail = "<a href=\"javascript:;\" class=\"thumbnail\"><img width='50px' height='50px'  filerefid=" +
                            dataObj.filerefid + " src='" +
                            "/m2012/images/module/disk/disk_loadinfo.gif" + "' onerror='" + //显示图片加载中...
                            DiskTool.scriptImgError("/m2012/images/global/nopic.jpg") + "' />";
                            if (dataObj.isshare == 1) {//共享的文件
                                thumbnail += "<i class='i-hand h-img'></i></a>";
                            } else {
                                thumbnail += "</a>";
                            }
                            fragment.find(".t-type").empty().append($(thumbnail));
                        } else {
                            var tempI = fragment.find("i:first").addClass(imageCss);
                            if (dataObj.isshare == 1) {
                                shareHand.clone().insertAfter(tempI);
                            }
                        }
                        fragment.find("p").append(rowTool.clone()); //添加文件夹名下方工具条
                        fragment.click(rowClick); //添加点击事件

                        //音频文件图标变换
                        if (isAudio) {
                            fragment.find("td.t-type").hover(function () {
                                $(this).find("i:first").toggleClass(imageCss).toggleClass("mp3-hover");
                            }, function () {
                                $(this).find("i:first").toggleClass(imageCss).toggleClass("mp3-hover");
                            });
                        }
                        var cbCtl = fragment.data("data", dataObj) //缓存数据到Row
                                .find(":checkbox").click(cbSingleClick);
                        if (dataObj.type == 1 || dataObj.type == 3 || dataObj.type == 4) {//当为文件夹时
                            fragment.find("a.shareToWB").remove(); //隐藏发布到微博的连接
                            fragment.find("span.subFileCount").html("(" + dataObj.filenum + ")");
                        }
                        //fragment.find("a.shareToWB").remove(); //隐藏发布到微博的连接
                        if (!DiskSwitchConfig.sendWeibo) {//判断微博的开关是否打开，否则隐藏全部
                            fragment.find("a.shareToWB").remove();
                        }
                        if (dataObj.type == 3 || dataObj.type == 4) {//为系统目录
                            cbCtl.remove();
                            //如果为相册或音乐根目录(系统目录)，则隐藏删除、重命名、共享链接
                            fragment.find("a.del").remove();
                            fragment.find("a.rename").remove();
                            fragment.find("a.sharef").remove();
                            fragment.find("span").remove();
                        }
                        if (dataObj.isresume == 1) {
                            cbCtl.attr("disabled", true);
                        }
                        //文件名下链接按钮点击事件
                        fragment.find("td.t-name>p>a").click(function (e) {
                            var source = $(this);
                            $.each(FileList.Event.anchorAction, function (name, actFunc) {
                                if (source.hasClass(name)) {
                                    if (name == "preview") {
                                        var status = $("#jonMark").length;
                                        if (status > 0) {
                                            return
                                        }
                                        top.$("body").append('<div class="jon-mark" id="jonMark" style="z-index:9999"><img style="position:absolute;top:50%;left:50%" src="/m2012/images/global/loading_xs.gif" /></div>')
                                    }
                                    actFunc(source.parent().parent().parent().data("data")
									, source.parent().parent().parent(), source);
                                    return false;
                                }
                            });
                            e.preventDefault();
                            e.stopPropagation();
                        });
                        //文件图标 文件名称 点击事件
                        fragment.find("a.title ,a.thumbnail").click(function (e) {
                            //执行下方的第一个行为
                            var a = $(this);
                            a.parent().parent().find("td.t-name>p>a:eq(0)").click();
                            e.preventDefault();
                            e.stopPropagation();
                        });
                        table.append(fragment);
                    }
                }
            }
            if (true) {
                //显示图片缩略图
                var picFileIds = FileList.Render.getPicFileIds();
                if (picFileIds && picFileIds.length > 0) {
                    FileList.Ajax.getThumbnailImageData(picFileIds);
                }
            }
        },
        /*渲染被选中的行*/
        renderCheckedRow: function (checked, row) {
            if (!row.find("td>:checkbox").attr("disabled")) {
                if (checked) {
                    if (!row.hasClass("t-checked")) {
                        row.addClass("t-checked");
                    }
                } else {
                    if (row.hasClass("t-checked")) {
                        row.removeClass("t-checked");
                    }
                }
            }
        },
        /*获取图片ID*/
        getPicFileIds: function () {
            var list = ListPager.Filter.getData();
            var listCount = list.length;
            var fileIds = "";
            for (var index = 0; index < listCount; index++) {
                var tempObj = list[index];
                var ext = DiskTool.getFileExtName(tempObj.filename);
                var extType = DiskTool.getExtType(ext)
                if (extType == "pic") {
                    fileIds += tempObj.fileid + ",";
                }
            }
            return fileIds;
        },
        /*渲染页面文件夹文件数*/
        renderFileCount: function (list) {
            var table = $("#tbl-fileList");
            var totalCount = window["RootFileCount"] || 0;
            table.find("tr").each(function () {
                var row = $(this);
                var data = row.data("data");
                if (data) {
                    if (data.type == "1" || data.type == "3" || data.type == "4") {
                        var id = data.fileid;
                        var count = 0;
                        $.each(list, function () {
                            if (this.fileid == id) {
                                count = this.filenum;
                                return false;
                            }
                        });
                        row.find("span.subFileCount").html("(" + count + ")");
                        totalCount += count;
                    } else {
                        return false;
                    }
                }
            });
        }
    },
    /**
    *异步处理事件
    */
    Ajax: {
        /*下载 1：文件。2：文件夹*/
        download: function (itemID, type, itemName, fileNum) {
            DiskTool.useWait();
            var fileAllCount = 0;
            var selectCount = 0;
            var fileList = '';
            var folderList = '';
            if (itemID == undefined) { //点击列表头操作按钮 
                selectCount = Toolbar.getAllSelectedRow().length;
                folderList = Toolbar.getCheckFolder();
                fileList = Toolbar.getCheckFile();
                if ($.trim2(fileList) != "") {
                    fileAllCount += fileList.split(",").length;
                }
                fileAllCount += Toolbar.getCheckFolder("filenum");
            } else {
                selectCount = 1;
                if (type == "2") {
                    fileList = itemID;
                    fileAllCount = 1;
                } else {
                    folderList = itemID;
                    fileAllCount = fileNum;
                }
            }
            if (selectCount) {
                var docname = itemName || "";
                if (fileList == "" && folderList == window["albumid"]) {
                    docname = DiskConf.albumDirName;
                } else if (fileList == "" && folderList == window["musicid"]) {
                    docname = DiskConf.musicDirName;
                } else if (docname == "我的音乐" && selectCount==1) { //特殊处理，打包下载我的音乐根目录，不传文件名
                    docname = "";
                }
                if (top.$B.is.firefox) {
                    docname = docname.replace(/ /g, "_");
                }
                if (fileAllCount == 0) {
                    FileList.Action.alert(FileList.Messages.SelectFileCount_err);
                    return false;
                } else {
                    DiskTool.downloadFile(fileList.toString(), folderList.toString(), docname, fileAllCount);
                    //记录行为日志
                    if (fileList && fileAllCount == 1) {//无需打包下载（单个文件下载）
                        DiskTool.addDiskBehavior({
                            actionId: 7028,
                            thingId: 0,
                            moduleId: 25,
                            actionType: 20
                        });
                    } else {//打包下载
                        DiskTool.addDiskBehavior({
                            actionId: 7029,
                            thingId: 0,
                            moduleId: 25,
                            actionType: 20
                        });
                    }
                }
            } else {
                FileList.Action.alert(FileList.Messages.SelectInfo);
                return false;
            }
        },
        getajax: function (url) {
            var result = "";
            try {
                result = $.ajax({
                    url: url,
                    async: false
                }).responseText;
            } catch (e) {
                result = "";
            }
            return result;
        },
        /*删除文件和文件夹*/
        deleteItem: function (itemID, type, sourcetype) {
            var selectCount = 0;
            var fileList = '';
            var folderList = '';
            var filecount;
            var foldercount;
            if (itemID == undefined) {//点击列表头操作按钮
                filecount = Toolbar.getCheckFile('count');
                foldercount = Toolbar.getCheckFolder('count');
                folderList = Toolbar.getCheckFolder();
                fileList = Toolbar.getCheckFile();
            } else {
                if (type == "2") {
                    fileList = itemID;
                    filecount = 1;
                } else {
                    folderList = itemID;
                    foldercount = 1;
                }
            }
            if (filecount || foldercount) {
                var list = Toolbar.getAllSelectedRow();
                var deleteMsg = null;
                /* 检查系统文件夹start */
                if (foldercount) {
                    var hasSystem = false;
                    $.each(list, function () {
                        if (this.TYPE == "1" && this.DIRFLAG == 0) {
                            hasSystem = true;
                            return false;
                        }
                    });
                    if (hasSystem) {
                        deleteMsg = (foldercount == 1 && filecount == 0) ? FileList.Messages.System_fail : FileList.Messages.System_fail2;
                    }
                }
                /* 检查系统文件夹end */
                if (deleteMsg) {
                    DiskTool.FF.alert(deleteMsg);
                    return false;
                }
                deleteMsg = FileList.Action.resConfirmDelete(filecount, foldercount);
                if (sourcetype == undefined || sourcetype == null) {
                    var flvcount = 0;
                    $.each(list, function (index, n) {
                        if (n.sourcetype == '10') {
                            flvcount++;
                        }
                    });
                    if (flvcount > 0) {
                        deleteMsg = FileList.Messages.Res_Del_Flv2;
                    }
                } else if (sourcetype != undefined && sourcetype == '10') {
                    deleteMsg = FileList.Messages.Res_Del_Flv1;
                }
                DiskTool.FF.confirm(deleteMsg, function () {
                    var deleteurl = DiskTool.resolveUrl('delDiskDirsAndFiles', true);
                    $.postXml({
                        url: deleteurl,
                        data: XmlUtility.parseJson2Xml({
                            dirIds: folderList,
                            fileIds: fileList
                        }),
                        success: function (result) {
                            if (result.code == 'S_OK') {
                                if (filecount) {
                                    //删除文件日志
                                    DiskTool.addDiskBehavior({
                                        actionId: 37,
                                        thingId: 0,
                                        moduleId: 11,
                                        actionType: 10
                                    });
                                }
                                if (foldercount) {
                                    //删除文件夹日志
                                    DiskTool.addDiskBehavior({
                                        actionId: 34,
                                        thingId: 0,
                                        moduleId: 11,
                                        actionType: 10
                                    });
                                }
                                DiskTool.getDiskWindow().Toolbar.refreshList();
                                DiskTool.removeMusicTrigger();
                                //DiskTool.getDiskWindow().FileList.Render.renderParent();
                            } else {
                                DiskTool.FF.alert(FileList.Messages.Res_Del_Fail);
                            }
                        },
                        error: function (error) {
                            DiskTool.handleError(error);
                        }
                    });
                });
            } else {
                FileList.Action.alert(FileList.Messages.SelectInfo);
                return false;
            }
        },
        /*获取用户信息*/
        getUserInfo: function () {
            if (!window["cacheUid"]) {
                window["cacheUid"] = top.UserData.ssoSid;
            }
            return window["cacheUid"];
        },
        /*获取用户IP*/
        getUserServerIP: function () {
            return window.parent.DiskMainData.UserServerIP;
        },
        /**
        * 获取并生成当前页所在路径导航
        */
        getMapPath: function () {
            //文件夹ID
            var dirId = Utils.queryString("id", window.location.href);
            if (!dirId || dirId == DiskConf.diskRootDirID) {
                var divMapPath = $("#spMapPath");
                divMapPath.empty();
                divMapPath.append("<a href='disk_default.html'>彩云网盘</a>");
                return;
            }
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) return;

            $.postXml({
                url: DiskTool.resolveUrl('nav', true),
                data: XmlUtility.parseJson2Xml({
                    name: FileList.Ajax.getUserInfo(),
                    dirid: dirId
                }, true),
                success: function (result) {
                    if (result.code != 'S_OK') {
                        DiskTool.FF.alert(result.summary);
                        return;
                    }
                    var dirList = result['var'].nav;
                    //将当前路径放到全局变量中
                    window.currentNav = dirList;
                    if (!dirList) return;

                    var divMapPath = $("#spMapPath");
                    divMapPath.empty();

                    for (var i = 0; i < dirList.length; i++) {
                        if (dirList[i].Name != "彩云网盘") {
                            divMapPath.prepend("&nbsp;&gt;&nbsp;<a href='disk_default.html?id=" + dirList[i].Id + "'>" + dirList[i].Name.encode() + "</a>");
                        } else {
                            divMapPath.prepend("<a href='disk_default.html'>" + dirList[i].Name + "</a>");
                        }
                    }
                },
                error: function (error) {
                    DiskTool.handleError(error);
                }
            });
        },
        /*获取缩略图*/
        getThumbnailImageData: function (picIds) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            $.postXml({
                url: DiskTool.resolveUrl('getthumbnailimage', true),
                data: XmlUtility.parseJson2Xml({
                    name: top.UserData.ssoSid,
                    fileids: picIds,
                    width: 50,
                    height: 50
                }),
                success: function (result) {
                    if (result.code != 'S_OK') {
                        //服务器抛出异常
                        FileList.Action.alert(result.summary);
                    } else {
                        var img = $(".thumbnail>img");
                        $(".thumbnail>img").each(function () {
                            var url = null;
                            var imgid = $(this).attr("filerefid");
                            if (window.parent.DiskInfo) {
                                url = window.parent.DiskInfo.ImgFile[imgid];
                            }
                            if (url == null) {
                                if (result['var']) {
                                    url = result['var'][imgid];
                                    if (window.parent.DiskInfo) {
                                        window.parent.DiskInfo.ImgFile[imgid] = url;
                                    }
                                }
                            }
                            $(this).attr("src", url);
                        });
                    }
                },
                error: function (error) {
                    DiskTool.handleError(error);
                }
            });
        },
        /*获取文件列表*/
        getFileList: function (dirID, pageIndex) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            if (!pageIndex) {
                pageIndex = 0;
            }
            if (!window["cachePid"]) {//缓存文件夹ID
                window["cachePid"] = [];
            }
            if (dirID == null || window["cachePid"][window["cachePid"].length - 1] != dirID) {
                window["cachePid"].push(dirID);
            }
            var handleList = function (list) {
                //rowsCount计算所有文件总数(文件夹加文件)
                var rowsCount = list['var'].files.length;
                var pageCount = Math.ceil(rowsCount / ListPager.Filter.pageSize);
                ListPager.Filter.setData(list['var'].files);
                ListPager.Filter.initialize = true;
                ListPager.Render.initialPager();
                ListPager.Render.renderList = FileList.Render.renderFileList;
                ListPager.Render.renderPage(pageIndex);
                //FileList.Render.renderFileList(list['var'].files, true);
            };
            $.postXml({
                url: DiskTool.resolveUrl("getdirfiles", true),
                data: XmlUtility.parseJson2Xml({
                    dirid: dirID,
                    dirType: 1
                }),
                async: false,
                success: function (result) {
                    if (result.code == 'S_OK') {
                        handleList(result);
                        var files = result["var"].files;
                        FileList.Render.allFiles = files;
                    }
                },
                error: function (error) {
                    DiskTool.handleError(error);
                }
            });
        }
    }
}
$(function(){
    DiskTool.useWait();
    //设置分页器属性
    ListPager.pageChanged = function(){
        FileList.Event.refresh();
    };
    ListPager.Filter.sortData = function(field, initialIsAsc,isUnReverse){
        var isAsc = false;
        if (ListPager.Filter.order == field && !isUnReverse) {
            isAsc = !ListPager.Filter.isAsc;
        } else {
            ListPager.Filter.order = field;
            isAsc = initialIsAsc;
        }
        //此处处理是同步页面上排序链接按钮的样式
        $(".diskSort a").removeClass("current");
        if(isAsc){
            $("#"+field+"-asc").addClass("current");
        }else{
            $("#"+field+"-desc").addClass("current");
        }
        
        ListPager.Filter.isAsc = isAsc;
        var data = ListPager.Filter.getAllData();
        
        if (data != null && data.length > 0) {
            data.sort(function(x, y){
                //文件夹永远放在前面
                if (x.type != y.type) {
                    if (x.type == "2") {
                        return 1;
                    } else  if (y.type == "2") {
                        return -1;
                    }
                    if (x.type == "1") {
                        return 1;
                    } else if (y.type == "1") {
                        return -1;
                    }
                    return x.type == "4" ? -1 : 1;
                }
                var compareVal = 0;
                switch (ListPager.Filter.order) {
                    //名称          
                    case "name":{
                        compareVal = x.filename.localeCompare(y.filename);
                        break;
                    }
                    //类型
                    case "type":{
                        if (x.type == "1" || x.type == "3" || x.type == "4") {
                            compareVal = 0;
                        } else {
                            compareVal = DiskTool.getFileExtName(x.filename).localeCompare(DiskTool.getFileExtName(y.filename));
                        }
                        break;
                    }
                    //时间
                    case "date":{
                        if (x.type == "1") {
                            compareVal = x.createtime.localeCompare(y.createtime);
                        } else {
                            compareVal = x.uploadtime.localeCompare(y.uploadtime);
                        }
                        break;
                    }
                    //大小
                    case "size":{
                        if (x.type == "1" || x.type == "3" || x.type == "4") {
                            compareVal = 0;
                        } else {
                            compareVal = x.filesize - y.filesize;
                        }
                        break;
                    }
                }
                compareVal = compareVal * (isAsc ? 1 : -1);
                return compareVal;
            });
        }
    };
})
var Toolbar = $.extend({
    /**
    *初始化工具栏
    */
    initial: function() { //初始化工具栏
        //Id跟函数之间的映射
        var map = {
            "aPreDocument": "backToUp",
            "aUpload": "upload",
            "aUpload2": "upload",
            "aDown": "down",
            "aDown2": "down",
            "aCreateDoc": "createDoc",
            "aCreateDoc2": "createDoc",
            "aShare": "share",
            "aShare2": "share",
            "aDel": "delDocAndFile",
            "aDel2": "delDocAndFile",
            "aProperty": "showProperty",
            "aEmail": "sendEmail",
            "aEmail2": "sendEmail",
            "aWap": "sendMobile",
            "aWap2": "sendMobile",
            "aMMS": "sendMMS",
            "aMMS2": "sendMMS",
            "aMove": "showMove",
            "aMove2": "showMove",
			//此次不做此功能
            "aSendWeibo": "sendWb",
            "aSendWeibo": "sendWb"

        };
        DiskTool.registerAnchor(map, function(val) {
            return Toolbar[val];
        });
        DiskTool.dropMenuAction2("aSendFile", "sendFileMenu");
        DiskTool.dropMenuAction3("aSendFile2", "sendFileMenu2");

        DiskTool.dropMenuAction3("aMove2", "sendMove2", function() {
            if ($("#ulDownList2>li").length > 10) {
                $("#ulDownList2").parent().addClass("sent-over");
            }
        });
    },
	/*发送到邮箱*/
	sendEmail: function(){
        var fileId = Toolbar.getCheckFile();
        var count = Toolbar.getCheckFile("count");
		if(count <= 0) {
			DiskTool.FF.alert(FileList.Messages.SelectInfo);
			return;
		}
        var foldercount = Toolbar.getCheckFolder();
        if (count > 50) {
            DiskTool.FF.alert(FileList.Messages.SendFiveFile);
            return;
        }
        if (foldercount > 0) {
            DiskTool.FF.alert(FileList.Messages.CanNotSendFolder);
            return;
        }
        if ($.trim(fileId)) {
			DiskTool.addDiskBehavior({
				actionId: 7006,
				thingId: 0,
				moduleId: 11,
				actionType: 20
			});
            setTimeout(function(){
                top.Links.show("quicklyShare", "&type=email&fileId=" + fileId + "&isOldDisk=true");// update by tkh 老版彩云选择文件后点发送跳转到老版文件快递文件发送页
            },0);
        } else {
            return;
		}
    },
	/*发送到手机wap*/
	sendMobile: function () {
	    if (top.$User && !top.$User.checkAvaibleForMobile()) { //非移动用户，屏闭wap短信发送
	        return;
	    }
        var fileId = Toolbar.getCheckFile();
        if ($.trim(fileId)) {
            DiskTool.addDiskBehavior({
				actionId: 7007,
				thingId: 0,
				moduleId: 11,
				actionType: 20
			});
            setTimeout(function(){ 
                top.Links.show("quicklyShare", "&type=mobile&fileId=" + fileId + "&isOldDisk=true");
            },0);
        } else {
			DiskTool.FF.alert(FileList.Messages.SelectInfo);
			return;
		}
    },
	/*发送到彩信*/
	sendMMS: function () {
	    if (top.$User && !top.$User.checkAvaibleForMobile()) { //非移动用户，屏闭彩信发送
	        return;
	    }
        var list = Toolbar.getAllSelectedRow();
		if(list.length <= 0) {
			DiskTool.FF.alert(FileList.Messages.SelectInfo);
			return;
		}
		if(list[0].type == "1") {
		    DiskTool.FF.alert(FileList.Messages.SelectInfo);
			return;
		}
        if (list.length == 1) {
            DiskTool.addDiskBehavior({
				actionId: 7008,
				thingId: 0,
				moduleId: 11,
				actionType: 20
			});
            if(list[0].filesize/1024 > 50) {
                DiskTool.FF.alert("文件大于50k不能发送！");
                return;
            }
            var itemid = list[0].fileid;
            var itemname = list[0].filename;
            var ext = DiskTool.getFileExtName(itemname);
            var extType = Toolbar.getExtTypeBySend(ext);
            var rid = list[0].filerefid;
            var size= list[0].filesize;
            if(extType == "") {
               DiskTool.FF.alert( '"' + itemname + '"不支持手机彩信发送!');
			   return;	
            }
            var url = "";
			var downcgiurl = DiskTool.resolveUrl('download', true);
			var filepath = "";
			$.postXml({
				url: downcgiurl,
				data: XmlUtility.parseJson2Xml({
					fileid: itemid.toString()
				}),
				async: false,
				success: function(result) {
					filepath = result['var'].url;
				}
			});
            filepath = escape(filepath);
            if (filepath.length > 20) {
                //图片\音乐\文本
                switch (extType) {
                    case "audio":
                        url = "&fileid="+ rid +"&musicpath=" + filepath + "&ext=" + ext + "&size=" + size;
                        break;
                    case "pic":
                        url = "&fileid="+ rid +"&imagepath=" + filepath + "&ext=" + ext + "&size=" + size;
                        break;
                    case "office":
                        url = "&fileid="+ rid +"&textpath=" + filepath + "&ext=" + ext + "&size=" + size + "&encode=utf-8";
                        break;
                }
                //打开标签                
               setTimeout(function(){ top.Links.show("mms", url)},0);
            }
        } else {
            DiskTool.FF.alert(FileList.Messages.SendOneMMSFile);
        }
    },
	/*上传方法*/
	upload: function() {
		//如果为空，则为根目录Id,0首页,1相册,2音乐.
		var pid = Toolbar.getCurrentDirectoryId();
		if(pid == null) {
			pid = window["crumb"][window["crumb"].length-1].Id;
		}
		if(pid == null) {
			pid = Utils.queryString("id");
		}
		var tempDirName = "";
		if( window.parent.DiskInfo.Current.Name()== "#li0_0") {
            tempDirName= "彩云网盘";
		} else {
			tempDirName = window.parent.$(window.parent.DiskInfo.Current.Name()).text().split("(")[0];
		}
		DiskTool.openUpload(0, pid, encodeURIComponent(tempDirName));
	},
	/*下载*/
    down: function(){
        FileList.Ajax.download();
    },
	//删除文件夹和文件
    delDocAndFile: function(){
        FileList.Ajax.deleteItem();
    },
    /*共享isClearchk 共享前是否取消已选*/
    share: function (ele) {
        if (top.$User && !top.$User.checkAvaibleForMobile()) { //非移动用户，屏闭共享
            return;
        }
        var selectedRow = Toolbar.getAllSelectedRow();
        var count = selectedRow.length;
        if (count) {
			DiskTool.addDiskBehavior({
				actionId: 14,
				thingId: 0,
				moduleId: 11,
				actionType: 10
			});
            //DiskTool.addDiskBehavior(14, 11, 10, null, count);
			if(ele) {
				ele.blur();
			}
            var urlshare = DiskTool.getRelativeUrl("disk_dialogsharefile.html");
            DiskTool.FF.open("好友共享", urlshare, 565, 440, true);
        } else {
            FileList.Action.alert(FileList.Messages.SelectInfo);
            return;
        }
		var tempDirName= "";
		if( window.parent.DiskInfo.Current.Name()== "#li0_0") {
            tempDirName= "彩云网盘";
		}
    },
    /*弹出移动到的选择框*/
    showMove: function(ele) {
        var selectedRow = Toolbar.getAllSelectedRow();
        var count = selectedRow.length;
        if (count == 0) {
            DiskTool.FF.alert("请选择一个文件或文件夹");
            return;
        }
        //文件ID 
        var fileId = Toolbar.getCheckFile();
        //文件夹ID
        var folderId = Toolbar.getCheckFolder();
        //扩展名
        var extList = Toolbar.getCheckExt();
        //所在目录ID
        var rootDirId = Toolbar.getCurrentDirectoryId();
        var data = selectedRow[0];
        var url = DiskTool.getRelativeUrl("disk_dialogmove.html?sid=" + FileList.Ajax.getUserInfo());
        url += "&fileId=" + fileId;
        url += "&folderId=" + folderId;
        url += "&extList=" + extList;
        url += "&rootDirId=" + rootDirId;
        url += "&type=0";
		if(ele) {
			ele.blur();
		}
        window.DiskTool.FF.open("移动到", url, 330, 321, true);
    },
    /*获取选定文件的后缀名列表*/
    getCheckExt: function() {
        var extList = "";
        var selectedRow = Toolbar.getAllSelectedRow();
        if (selectedRow.length) {
            $.each(selectedRow, function() {
                if (this.type == "2") {
                    var ext = DiskTool.getFileExtName(this.filename);
                    extList += ext + ",";
                }
            });
        }
        extList = extList.length > 0 ? extList.substring(0, extList.length - 1) : "";
        return extList;
    },
    /*获取选中的文件ID或者文件个数*/
    getCheckFile: function(tag) {
        var fileId = "";
        var selectedRow = Toolbar.getAllSelectedRow();
        var filecount = 0;
        if (selectedRow.length) {
            $.each(selectedRow, function() {
                if (this.type == "2") {
                    fileId += this.fileid + ",";
                    filecount++;
                }
            });
        }
        fileId = fileId.length > 0 ? fileId.substring(0, fileId.length - 1) : "";
        if (tag == "count")
            return filecount;
        else
            return fileId;
    },
    /*获取选中的文件夹ID或者文件夹个数(返回选择文件夹中的文件总数量 tag: filenum)*/
    getCheckFolder: function(tag) {
        var folderId = "";
        var selectedRow = Toolbar.getAllSelectedRow();
        var foldercount = 0;
		var fileNum = 0;
        if (selectedRow.length) {
            $.each(selectedRow, function() {
                if (this.type == "1") {
                    folderId += this.fileid + ",";
                    foldercount++;
					fileNum += this.filenum;
                }
            });
        }
        folderId = folderId.length > 0 ? folderId.substring(0, folderId.length - 1) : "";
        if (tag == "count") {
            return foldercount;
        } else if(tag == "filenum") {
            return fileNum;
        } else {
			return folderId;
		}
    },
    /*新建文件夹*/
    createDoc: function() {
        DiskTool.addDiskBehavior({
			actionId: 33,
			thingId: 0,
			moduleId: 11,
			actionType: 20
		});
        var pid = Toolbar.getCurrentDirectoryId();
        var url = DiskTool.getRelativeUrl("disk_dialogcreatedocument.html?sid=" + FileList.Ajax.getUserInfo());
        if (pid != null) {
            url += "&pid=" + pid;
        }
        DiskTool.FF.open("新建文件夹", url, 450, 135, true);
    },
	refreshList: function(pid){
		if(Utils.queryString("id")!=null){
			pid = Utils.queryString("id");
		}
        if (!pid) {
            pid = window["cachePid"].pop();
        }
        //刷新本页面
		DiskTool.getDiskWindow().FileList.Render.renderParent();
        //FileList.Ajax.getAllDirectory();
        FileList.Ajax.getFileList(pid, ListPager.Filter.pageIndex, true);
    }
}, DiskTool.Toolbar);
/*页面初始化执行函数*/
$(function() {
    DiskTool.useWait(); 
	//ListPager.Render.initialPager(); //初始化分页器  
    //触发事件
    FileList.Event.initial();
    //返回上一级
    $("div.tbl-list-return a").click(window.parent.DiskInfo.Action.ReturnParentDir);
    //全选
    $("#cbSelectAllFile").click(function() {
        var v = this.checked;
        var count = 0;
        if (v) {
            $("#lblSelectAllFile").text("不选");
            $("#lblSelectAllFile2").text("不选");
        } else {
            $("#lblSelectAllFile").text("全选");
            $("#lblSelectAllFile2").text("全选");
        }
        $("#tbl-fileList>tr").each(function() {
            var row = $(this);
            row.find("td>:checkbox").each(function() {
                if (this.disabled === false) {
                    this.checked = v;
                }
            });
            FileList.Render.renderCheckedRow(v, row);
            count++;
        });
        FileList.Event.clickCheckBoxAll(v, count);
    });
	//排序
    var sortClick = function(ctl, field, initialIsAsc){
        var ctl = $(ctl);
        ListPager.Filter.sortData(field, initialIsAsc);
        
        //箭头
        $("span.t-arrow").html("");
        ctl.find("span.t-arrow").html(ListPager.Filter.isAsc ? "↑" : "↓");
        
        //返回第一页
        ListPager.Render.renderPage(0);
        //ListPager.Render.renderList(ListPager.Filter.getData());
		//$(".diskSort").hide();
    }
	
	//设定每列排序
    $(".tbl-list>thead>tr>th.t-type").click(function(){
        sortClick(this, "type", true);
    });
    $(".tbl-list>thead>tr>th.t-name").click(function(){
        sortClick(this, "name", true);
    });
    $(".tbl-list>thead>tr>th.t-date").click(function(){
        sortClick(this, "date", false);
    });
    $(".tbl-list>thead>tr>th.t-size").click(function(){
        sortClick(this, "size", true);
    });
	
	//排序
    var sortPannelClick = function(field, initialIsAsc){
        ListPager.Filter.sortData(field, initialIsAsc,true);
        
        //箭头
        $("span.t-arrow").html("");
        $(".tbl-list>thead>tr>th.t-" + field).find("span.t-arrow").html(initialIsAsc ? "↑" : "↓");
        
        //返回第一页
        ListPager.Render.renderPage(0);
        //ListPager.Render.renderList(ListPager.Filter.getData());
        $(".diskSort").hide();
    }
	$(".diskSortTitle").click(function(e){
        $(".diskSort").show();
		e.stopPropagation();
        e.preventDefault();
    });
    //点击页面隐藏面板
    $(document).click(function() {
        $(".diskSort").hide();
    });
    $("#date-asc").click(function(){
		DiskTool.addDiskBehavior({
			actionId: 7038,
			thingId: 2,
			moduleId: 14,
			actionType: 20
		});
        $(".diskSort a").removeClass("current");
        $(this).addClass("current");
        sortPannelClick("date",true);
    });
    $("#date-desc").click(function(){
		DiskTool.addDiskBehavior({
			actionId: 7038,
			thingId: 1,
			moduleId: 14,
			actionType: 20
		});
        $(".diskSort a").removeClass("current");
        $(this).addClass("current");
        sortPannelClick("date",false);
    });
    $("#name-asc").click(function(){
		DiskTool.addDiskBehavior({
			actionId: 7038,
			thingId: 6,
			moduleId: 14,
			actionType: 20
		});
        $(".diskSort a").removeClass("current");
        $(this).addClass("current");
        sortPannelClick("name",true);
    });
    $("#name-desc").click(function(){
		DiskTool.addDiskBehavior({
			actionId: 7038,
			thingId: 6,
			moduleId: 14,
			actionType: 20
		});
        $(".diskSort a").removeClass("current");
        $(this).addClass("current");
        sortPannelClick("name",false);
    });
    $("#size-asc").click(function(){
		DiskTool.addDiskBehavior({
			actionId: 7038,
			thingId: 4,
			moduleId: 14,
			actionType: 20
		});
        $(".diskSort a").removeClass("current");
        $(this).addClass("current");
        sortPannelClick("size",false);
    });
    $("#size-desc").click(function(){
		DiskTool.addDiskBehavior({
			actionId: 7038,
			thingId: 3,
			moduleId: 14,
			actionType: 20
		});
        $(".diskSort a").removeClass("current");
        $(this).addClass("current");
        sortPannelClick("size",true);
    });
    $("#type-asc").click(function(){
		DiskTool.addDiskBehavior({
			actionId: 7038,
			thingId: 5,
			moduleId: 14,
			actionType: 20
		});
        $(".diskSort a").removeClass("current");
        $(this).addClass("current");
        sortPannelClick("type",true);
    });
    $("#type-desc").click(function(){
		DiskTool.addDiskBehavior({
			actionId: 7038,
			thingId: 5,
			moduleId: 14,
			actionType: 20
		});
        $(".diskSort a").removeClass("current");
        $(this).addClass("current");
        sortPannelClick("type",false);
    });
	
	//搜索
    $("#txtKeyword").one("focus", function(){
        $(this).val("").data("clear", true);
    }).keyup(function(e){
        if (e.keyCode == 13) {
            $("#btnSearch").click();
            e.preventDefault();
        }
    });
	
	$("#btnSearch").click(function(){
		DiskTool.addDiskBehavior({
			actionId: 7009,
			thingId: 0,
			moduleId: 11,
			actionType: 20
		});
        var txt = $("#txtKeyword");
        if (!txt.data("clear")) {
            txt.val("");
        }
        var keyword = txt.val();
        keyword = $.trim2(keyword);
        if (keyword == "") {
            DiskTool.FF.alert("请输入搜索内容");
        } else { 
            if (DiskTool.len(keyword) > 30) {
                DiskTool.FF.alert("最大长度30字节（15个汉字）");
            } else {
                //获得disk_search.html
                var url = DiskTool.replace(window.location.href, "default", "search");
                url = DiskTool.appendParaToUrl(url, {
                    key: keyword,
                    sid: FileList.Ajax.getUserInfo()
                });
                //跳转页面
                window.location.href = url;
            }
        }
    });
	
	 $("a.to-advanced-search").click(function(e){
        DiskTool.HideWaiting();
		DiskTool.addDiskBehavior({
			actionId: 7010,
			thingId: 0,
			moduleId: 11,
			actionType: 20
		});
    });
});
