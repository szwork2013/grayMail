/*
* Copyright (C) 2011 http://www.richinfo.cn
* 檔案名：      albumProperty.js
* 檔功能描述：  相册集命名的js功能类,对应disk_dialogalbumproperty.html
* 創建人：      lizg   
* 創建日期：    2011/12/21
* 修改人：            
* 修改日期：
* 程式版次：  
* 修改描述：           
*/
var albumProperty = {
    url: {
        renameAlbum: DiskTool.resolveUrl("renameDiskAlbum", true)
    },

    //提示语
    messages: {
        Empty: "相册名称不能为空",
        MaxLength: "最大长度不能超过20字符",
        InvalidChar: "不能有以下特殊字符 \\/:*?\"<>|",
        RepeatDirName: "文件夹名称不能重复",
        Exception: "创建文件夹失败，请稍后再试。",
        NoInfo: "无法获取当前文件夹相关信息"
    },

    //父窗体
    parent: DiskTool.getDiskWindow(),

    //页面初始化
    pageLoad: function() {
        //加载皮肤
        Utils.loadSkinCss(null, document, "netdisk");
        $(function() {
            $("p.dialog-error-tip").hide();
            DiskTool.DialogAuto();

            var albumList = albumProperty.parent.album.tool.getAlbumArr();
            var ablumName = unescape(Utils.queryString("name", window.location.href));
            var ablumId = Utils.queryString("id", window.location.href);
            var ablumInfo = $.grep(albumList, function(o) {
                return ablumId == o.albumId;
            });
            //找不到当前相册信息则关闭页面
            if (!ablumInfo && ablumInfo.length == 0) {
                DiskTool.FF.alert(albumProperty.messages.NoInfo);
                top.FloatingFrame.close();
            }
            //初始化页面信息
            ablumInfo = ablumInfo[0];
            $(":text").val(ablumName);
            $("#tdPos").html("\\我的相册\\{0}".format(ablumName));
            $("#tdFileInfo").html("共有{0}张相片".format(ablumInfo.totalCount));
            $("#tdTime").html(DiskTool.formatDate(ablumInfo.createTime));

            //添加事件
            DiskTool.registerAnchor({
                "aCancel": function() {
                    top.FloatingFrame.close();
                },
                "aSumbit": albumProperty.rename
            }, function(val) {
                return val;
            });
            $("#area1")[0].focus();
            $("#area1")[0].blur();
        });
    },

    //提交进行重命名操作
    rename: function() {
        var errorTip = $("p.dialog-error-tip"),
            errorArea = $("#errorMsg"),
            dirName = $.trim($(":text").val()),
            albumId = Utils.queryString("id", window.location.href),
            albumList = albumProperty.parent.album.tool.getAlbumArr(),
            invalidMsg = null;

        errorTip.hide();
        //检查文件夹合法性
        invalidMsg = albumProperty.parent.album.tool.validateAlbumName(dirName);
        if (invalidMsg) {
            errorArea.html(invalidMsg);
            errorTip.show();
            return;
        }
        //检查文件夹是否重名或无更改
        var oAlbum = null;
        for (var i = 0, len = albumList.length; i < len; i++) {
            oAlbum = albumList[i];
            if (oAlbum.albumName != dirName) {
                continue;
            }
            //名称无更改则关闭窗口
            if (oAlbum.albumId == albumId) {
                top.FloatingFrame.close();
                return;
            }
            //重名提示错误信息
            if (oAlbum.albumId != albumId) {
                errorArea.html(albumProperty.messages.RepeatDirName);
                errorTip.show();
                return;
            }
        }
        //重名文件夹
        albumProperty.server.rename(dirName, albumId, function() {
            DiskTool.addDiskBehavior({
                actionId: 35,
                moduleId: 11,
                actionType: 10
            });
            //刷新页面
            albumProperty.parent.album.tool.refreshList();
            top.FloatingFrame.close();
        });
    },

    /* 服务器通讯 */
    server: {
        //重命名文件夹
        rename: function(dirName, pid, callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) return;
            $.postXml({
                url: albumProperty.url.renameAlbum,
                data: XmlUtility.parseJson2Xml({
                    albumId: pid,
                    albumName: dirName
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
albumProperty.pageLoad();

