var saveShareFile = {
    urls: {
        getSaveFileUrl: function() {
            return DiskTool.resolveUrl("turnFile", true);
        }
    },
    action: {
        pageLoad: function() {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            //加载皮肤
            Utils.loadSkinCss(null, document, "netdisk");
            $(function() {
                //初始化目录
                DirectoryTree.isCanHide = false;
                DirectoryTree.ClickDirTree(true);
                //窗口自适应
                DiskTool.DialogAuto();
                //事件注册
                var clicks = {
                    "aSaveAttach": saveShareFile.action.saveAttach,
                    "aCancel": function() { top.FloatingFrame.close(); },
                    "aSaveOK": function() { top.FloatingFrame.close(); },
                    "aSaveOK2": function() { top.FloatingFrame.close(); },
                    "aOpenDisk": function() {
                        top.Links.show('diskDev', '&id=2', true);
                        top.FloatingFrame.close();
                    }
                };
                DiskTool.registerAnchor(clicks, function(val) {
                    return val;
                });
            });
        },

        //暂存柜文件保存到彩云
        saveAttach: function() {
            DirectoryTree.SelectDirectory();
            var shareFileId = Utils.queryString("shareFileId");
            var fileName = Utils.queryString("shareFileName");
            var dirId = DirectoryTree.selDirId;
            var itemId = DirectoryTree.selItemId;
            var from = DirectoryTree.selComefrom;

            fileName = unescape(fileName);
            if (from == 2 && !CheckMusic(fileName)) {
                return;
            }
            if (from == 1 && !CheckAlbum(fileName)) {
                return;
            }
            if (from != 1 && from != 2) {
                itemId = 0;
            }
            //请求服务器保存文件
            saveShareFile.server.saveAttach({
                usernumber: top.UserData.userNumber,
                directoryId: dirId,
                shareFileId: shareFileId,
                comeFrom: from,
                bItemId: itemId,
                type: 0
            }, success, failure);

            //执行成功后的页面处理
            function success() {
                try {
                    //刷新彩云页
                    top.$("iframe#diskDev")[0].contentWindow.Action.refresh();
                } catch (e) {

                }
                DiskTool.addDiskBehavior({
                    actionId: 12,
                    thingId: 4,
                    moduleId: 11,
                    actionType: 10
                });

                var $M = top.$Msg;

                top.FF.close();

                $M.alert("\"{0}\"已成功保存到彩云网盘！<br>&nbsp;<a href='javascript:;' onclick='top.Links.show(\"diskDev\",\"&id=2\",true);top.FF.close();return false;'>查看</a>".format(Utils.htmlEncode(fileName)), {
                    isHtml: true
                });
            }

            //执行失败后的页面处理
            function failure(code, msg) {
                var html = msg;
                //单文件超过大小
                if (code == "-7") {
                    var vipInfo = top.UserData.vipInfo;
                    if (vipInfo && vipInfo.serviceitem != "0016" && vipInfo.serviceitem != "0017") {
                        html += '&nbsp;<a href="javascript:;" style="text-decoration: underline;" onclick="var topWin = top; topWin.FF.close();topWin.$App.show(\'mobile\');return false;">上传更大单个文件</a>';
                    }
                }
                var $M = top.$Msg;
                top.FF.close();
                $M.alert(html, {
                    icon:"warn",
                    isHtml: true
                });
            }
        }
    },
    server: {
        saveAttach: function(param, sucesses, errors) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            $.postXml({
                url: saveShareFile.urls.getSaveFileUrl(),
                data: XmlUtility.parseJson2Xml(param),
                success: function(result) {
                    if (result.code == DiskConf.isOk) {
                        if (sucesses) sucesses();
                    } else {
                        if (errors) errors(result.code, result.summary);
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
saveShareFile.action.pageLoad();  