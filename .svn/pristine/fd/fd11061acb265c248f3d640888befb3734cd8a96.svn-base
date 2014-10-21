/*
* Copyright (C) 2011 http://www.richinfo.cn
* 檔案名：      createAlbum.js
* 檔功能描述：  相册集创建的js功能类,对应dialogCreateAlbum.htm
* 創建人：      lizg  
* 創建日期：    2011/12/21
* 修改人：            
* 修改日期：
* 程式版次： 
* 修改描述：           
*/
var createAlbum = {
    //服务器访问地址
    url: {
        DiskInfo: DiskTool.resolveUrl("addDiskAlbum", true)
    },

    //提示语
    messages: {
        RepeatDirName: "相册名称不能重复"
    },

    //相册列表页窗体
    parent: DiskTool.getDiskWindow(),

    //页面加载
    pageLoad: function() {
        //加载皮肤
        Utils.loadSkinCss(null, document, "netdisk");
        $(function() {
            $("p.dialog-error-tip").hide();
            DiskTool.DialogAuto();

            //事件注册
            DiskTool.registerAnchor({
                "aCancel": function() {
                    top.FloatingFrame.close();
                },
                "aSumbit": createAlbum.create
            }, function(val) {
                return val;
            });
            $("#txtName")[0].focus();
            $("#txtName")[0].blur();
        });
    },

    //创建文件夹操作
    create: function() {
        var tipArea = $("p.dialog-error-tip");
        var errorArea = $("#errorMsg");
        var dirName = $.trim($("#txtName").val());
        tipArea.hide();

        //检查文件夹命名合法性
        var invalidMsg = createAlbum.parent.album.tool.validateAlbumName(dirName);
        if (invalidMsg) {
            errorArea.html(invalidMsg);
            tipArea.show();
            //重新计算高度
            setTimeout(function () {
                top.$Msg.getCurrent().resetHeight();
            }, 100);
            return;
        }
        //检查文件夹是否重名
        var albumList = createAlbum.parent.album.tool.getAlbumArr();
        var statis = $.grep(albumList, function(i) {
            return i.albumName == dirName;
        });
        if (statis.length > 0) {
            errorArea.html(createAlbum.messages.RepeatDirName);
            tipArea.show();
            return;
        }
        //执行新建文件夹操作
        createAlbum.server.create(dirName, function() {
            DiskTool.addDiskBehavior({
                actionId: 33,
                moduleId: 11,
                actionType: 10
            });
            createAlbum.parent.album.tool.refreshList();
            top.FloatingFrame.close();
        });
    },

    /* 服务器通讯 */
    server: {

        //创建文件夹
        create: function(dirName, callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            $.postXml({
                url: createAlbum.url.DiskInfo,
                data: XmlUtility.parseJson2Xml({
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
createAlbum.pageLoad();
