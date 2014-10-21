var FileProperty = {
    //提示语
    Messages: {
        Empty: "文件名称不能为空",
        MaxLength: "最大长度不能超过50字",
        InvalidChar: "不能有以下特殊字符 \\/:*?\"<>|",
        InvalidChar2: "文件名包含广告宣传信息，或不符合现行法律法规要求。",
        RepeatfileName: "文件名称不能重复",
        Exception: "创建文件失败，请稍后再试。"
    },
    extstr: "",
    pageLoad: function() {
        $("p.dialog-error-tip").hide();
        DiskTool.DialogAuto();
        //加载文件属性
        FileProperty.Ajax.getInfo();
        //取消
        FileProperty.__clickAnchor("aCancel", function() {
            top.FloatingFrame.close();
        })
        FileProperty.__clickAnchor("aSumbit", function() {
            $("p.dialog-error-tip").hide();
            //检查文件夹合法性
            var fileName = $.trim($(":text").val());
            var invalidMsg = FileProperty.validName(fileName);
            if (invalidMsg) {
                $("#errorMsg").html(invalidMsg);
                $("p.dialog-error-tip").show();
                try{
                    frameElement.parentNode.style.height = document.body.scrollHeight + "px";
                } catch (e) { }
            } else {
                //Rename文件夹
                FileProperty.Ajax.rename(fileName + "." + FileProperty.extstr, Utils.queryString("id", window.location.href));
            }
        });
    },
    validName: function(name) {
        if (name == null) {
            return FileProperty.Messages.Empty;
        }
        name = $.trim(name);
        if (name == "") {
            return FileProperty.Messages.Empty;
        }
        //查看长度
        if (name.length > 50) {
            return FileProperty.Messages.MaxLength;
        }
        //查看特殊字符
        //\/:*?"<>|
        function checkOtherChar(str) {
            for (var loop_index = 0; loop_index < str.length; loop_index++) {
                if (str.charAt(loop_index) == '*'
                || str.charAt(loop_index) == '|'
                || str.charAt(loop_index) == ':'
                || str.charAt(loop_index) == '"'
                || str.charAt(loop_index) == '<'
                || str.charAt(loop_index) == '>'
                || str.charAt(loop_index) == '?'
                || str.charAt(loop_index) == '\\'
                || str.charAt(loop_index) == '\''
                || str.charAt(loop_index) == '/') {
                    return false;
                }
            }
            return true;
        }
        if (!checkOtherChar(name)) {
            return FileProperty.Messages.InvalidChar;
        }
        return null;
    },
    /* Ajax通讯 */
    Ajax: {
        getUserInfo: function() {
            if (!window["cacheUid"]) {
                window["cacheUid"] = Utils.queryString("sid", window.location.href)
            }
            return window["cacheUid"];
        },
        //重命名文件夹
        rename: function(fileName, pid) {
            DiskTool.addDiskBehavior({
                actionId: 36,
                thingId: 0,
                moduleId: 11,
                actionType: 10
            });
            if (Utils.PageisTimeOut(true)) return;
            var reNameUrl = DiskTool.resolveUrl('renameDiskFile', true);
            var reData = {
                fileId: pid,
                fileName: fileName
            }
            $.postXml({
                url: reNameUrl,
                data: XmlUtility.parseJson2Xml(reData),
                success: function(result) {
                    if (result.code == "S_OK") {
                        //刷新页面
                        DiskTool.getDiskWindow().Toolbar.refreshList();
                        //关闭窗口
                        top.FloatingFrame.close();
                    } else {
                        //抛出错误信息
                        $("#errorMsg").html(result.summary);
                        $("p.dialog-error-tip").show();
                    }
                },
                error: function(error) {
                    //抛出服务器异常
                    DiskTool.handleError(error);
                }
            });
        },
        getInfo: function() {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) return;
            $.postXml({
                url: DiskTool.resolveUrl('filedetail', true), //获取文件信息的地址
                data: XmlUtility.parseJson2Xml({
                    fileid: Utils.queryString("id", window.location.href),
                    dirType: 1
                }),
                success: function(result) {
                    if (result.code == 'S_OK') {
                        var data = result['var'];
                        //生成当前路径
                        var pathStr = "";
                        if (DiskTool.getDiskWindow().currentNav) {
                            var dirNav = DiskTool.getDiskWindow().currentNav;
                            for (var i = dirNav.length - 1; i >= 0; i--) {
                                pathStr += "/" + dirNav[i].Name;
                            }
                        } else {
                            pathStr += "/彩云网盘";
                        }
                        FileProperty.extstr = DiskTool.getFileExtName(data.srcfilename);
                        $("#tdType").html("{0} {1}".format(FileProperty.extstr.toUpperCase(), data.filetypename));
                        $("#tdType").attr("fileExt", FileProperty.extstr);
                        $("#tdSize").html(DiskTool.getFileSizeText(data.filesize));
                        $("#tdUploadTime").html(data.createtime.format("yyyy-MM-dd hh:mm:ss"));
                        $(":text").val(DiskTool.getFileNameNoExt(data.srcfilename)).after(".{0}".format(FileProperty.extstr.toLowerCase()));
                        var pos = ""; //data.Position;
                        window.isMusic = (/^\/彩云网盘\/我的音乐/).test(pathStr);
                        $("#tdPos").html(Utils.htmlEncode(pathStr));
                    } else {
                        //服务器抛出异常
                        DiskTool.FF.alert(result.summary);
                    }

                },
                error: function(error) {
                    DiskTool.handleError(error);
                }
            });
        }
    },
    /* 私有方法 */
    __clickAnchor: function(id, action) {
        $.getById(id).click(function(e) {
            if (action) {
                action();
            }
            e.preventDefault();
        });
    }
};
$(function() {
    FileProperty.pageLoad();
    $(":text:first").focus();
});