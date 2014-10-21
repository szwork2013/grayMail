/*
* Copyright (C) 2011 http://www.richinfo.cn
* 檔案名：      photoProperty.js
* 檔功能描述：  相片重命名的js功能类,对应dialogPhotoProperty.htm
* 創建人：      lizg   
* 創建日期：    2011/12/21
* 修改人：            
* 修改日期：
* 程式版次：  
* 修改描述：           
*/
photoProperty = {
    url: {
        renamePhotoUrl: DiskTool.resolveUrl("renameDiskPhoto", true)
    },
    //提示语
    Messages: {
        Empty: "图片名称不能为空",
        MaxLength: "最大长度不能超过50字符",
        InvalidChar: "不能有以下特殊字符 \\/:*?\"<>|",
        RepeatfileName: "图片名称不能重复",
        Exception: "图片重命名失败，请稍后再试。"
    },
    //相片序号
    getSeqId: function() {
        return Utils.queryString("id", window.location.href);
    },
    //父窗体
    parent: DiskTool.getDiskWindow(),
    //初始化页面相关信息
    initPage: function() {
        var location = window.location.href;
        var seqId = photoProperty.getSeqId();
        var albumName = Utils.queryString("albumName", location);
        var model = $.grep(photoProperty.parent.albumPhoto.tool.getPhotos(), function(o) {
            return o.seqNo == seqId;
        })[0];
        var extend = DiskTool.getFileExtName(model.srcFileName);
        //设置页面元素内容
        $("#tdType").html(extend.toUpperCase());
        $("#tdPos").html("我的相册/{0}".format(Utils.htmlEncode(unescape(albumName))));
        $("#tdSize").html(DiskTool.getFileSizeText(model.fileSize));
        $("#tdUploadTime").html(DiskTool.formatDate(model.createTime));
        $(":text").val(DiskTool.getFileNameNoExt(model.srcFileName)).removeData("data").data("data", model);
        $("#sp_fileExt").html(".{0}".format(extend));
        $("#hidfileExt").val(".{0}".format(extend));
    },

    //重命名
    rename: function() {
        var errorTip = $("p.dialog-error-tip");
        var errorArea = $("#errorMsg");
        var seqId = photoProperty.getSeqId();
        var input = $(":text");
        var model = input.data("data");

        errorTip.hide();
        //检查文件夹合法性
        var fileName = $.trim(input.val());
        var invalidMsg = photoProperty.validatePhotoName(fileName);
        if (invalidMsg) {
            errorArea.html(invalidMsg);
            errorTip.show();
            return;
        }
        if (fileName == DiskTool.getFileNameNoExt(model.srcFileName)) {
            top.FloatingFrame.close();
            return;
        }
        fileName += $("#hidfileExt").val();
        photoProperty.server.rename(fileName, seqId, function() {
            DiskTool.addDiskBehavior({
                actionId: 36,
                moduleId: 11,
                actionType: 10
            });
            photoProperty.parent.Toolbar.refreshList(false);
            top.FloatingFrame.close();
        });
    },

    //验证相册文件夹名称合法性
    validatePhotoName: function(name) {
        name = name ? $.trim(name) : "";
        if (name.length == 0) {
            return photoProperty.Messages.Empty;
        }
        //查看长度
        if (name.length > 50) {
            return photoProperty.Messages.MaxLength;
        }
        //检查特殊字符
        return DiskTool.validateName(name);
    },

    //页面加载
    pageLoad: function() {
        //加载皮肤
        Utils.loadSkinCss(null, document, "netdisk");
        DiskTool.unWait();
        DiskTool.DialogAuto();
        $(function() {
            photoProperty.initPage();
            $("p.dialog-error-tip").hide();

            //添加事件
            DiskTool.registerAnchor({
                "aCancel": function() {
                    top.FloatingFrame.close();
                },
                "aSumbit": photoProperty.rename
            }, function(val) {
                return val;
            });
            $(".text")[0].focus();
            $(".text")[0].blur();
        });
    },
    //服务器通信
    server: {
        //获取用户标识
        getUserInfo: function() {
            var key = "cacheUid";
            if (!window[key])
                window[key] = Utils.queryString("sid", window.location.href);
            return window[key];
        },
        //重命名
        rename: function(fileName, fileId, callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            $.postXml({
                url: photoProperty.url.renamePhotoUrl,
                data: XmlUtility.parseJson2Xml({
                    photoId: fileId,
                    photoName: fileName,
                    sid: photoProperty.server.getUserInfo()
                }),
                success: function(result) {
                    if (result.code == DiskConf.isOk) {
                        if (callback) callback();
                    }
                    else {
                        //服务器抛出异常
                        DiskTool.FF.alert(result.summary);
                    }
                },
                error: function(error) {
                    DiskTool.handleError(error);
                }
            });
        }
    }
};

//页面加载
photoProperty.pageLoad();
 
