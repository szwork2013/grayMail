var fileProperty = {
    //服务器接口地址
    urls: {
        getRenameUrl: function() {
            return fileSharing.resolveUrl("renameFiles");
        }
    },
    //提示信息
    messages: {
        ErrorArgument: "参数传递错误",
        Empty: "文件名称不能为空",
        MaxLength: "最大长度不能50个字符",
        InvalidChar: "不能有以下特殊字符 \\/:*?\"<>|",
        RepeatfileName: "文件名称不能重复",
        Exception: "创建文件异常",
        IsFilterFileName: "文件名包含广告宣传信息，或不符合现行法律法规要求！"
    },
    //文件类型
    fileTypeDefine: {
        "图像": "bmp,gif,ico,jpg,jpeg,png,tif",
        "声音": "mid,wma,wav,mp3,cda",
        "视频": "avi,wmv,wmp,rm,ram,rmvb,ra,mpg,mpeg",
        "办公文档": "doc,docx,xls,xlsx,ppt,pps,pptx",
        "应用程序": "exe"
    },
    action: {
        //页面加载
        pageLoad: function() {
            //加载皮肤
            Utils.loadSkinCss(null, document, "netdisk");
                //ajax提示
                fileSharing.tool.startAjaxMsg();
                //窗口高度自适应
                $.dialogAutoHeight();
                //隐藏错误提示信息
                $("p.dialog-error-tip").hide();
                try{
                    $(":text:first").focus();
                } catch (e) { }
                //初始化页面信息
                fileProperty.action.initPage();
                //注册事件
                var clicks = {
                    aCancel: function() { fileSharing.FF.close(); },
                    aSumbit: fileProperty.action.submitRename
                };
                fileSharing.tool.registClicks(clicks);

        },
        //初始化页面信息
        initPage: function() {
            var file = fileProperty.tool.getFile();

            if (!file) {
                fileSharing.FF.alert(fileProperty.messages.ErrorArgument);
                fileSharing.FF.close();
                return;
            }
            var fileExtName = fileSharing.tool.getFileExtName(file.fileName);
            var fileNameNoExt = fileSharing.tool.getFileNoExtName(file.fileName);
            var fileTypeName = fileProperty.tool.getFileTypeName(fileExtName);
            $("#tdType").html("{0} {1}".format(fileExtName, fileTypeName));
            $("#tdSize").html(fileSharing.tool.getFileSizeText(file.fileSize));
            if (file.createTime) {
                $("#tdUploadTime").html(file.createTime.format("yyyy-MM-dd hh:mm:ss"));
            }
            $(":text").val(fileNameNoExt).after(".{0}".format(fileExtName.toLowerCase()));
            $(":text").attr({ "fileNoExt": fileNameNoExt, "fileExt": fileExtName });
        },
        //提交信息
        submitRename: function(e) {
            var errorTip = $("p.dialog-error-tip");
            var errorMsg = $("#errorMsg");
            //检查文件夹合法性
            var fileExtName = $(":text").attr("fileExt");
            var oldFileNoExt = $(":text").attr("fileNoExt");
            var newFileNoExt = $.trim($(":text").val());
            var fileName = "{0}.{1}".format(newFileNoExt, fileExtName.toLowerCase());
            var fileId = fileProperty.tool.getFileId();

            e.preventDefault();
            e.stopPropagation();
            errorTip.hide();
            var message = fileProperty.tool.validName(newFileNoExt);
            if (message) {
                errorMsg.html(message);
                errorTip.show();
                try {
                    frameElement.parentNode.style.height = document.body.scrollHeight + "px";
                } catch (e) { }
                return;
            }
            //名称无改动则直接退出无需请求服务器
            if (oldFileNoExt == newFileNoExt) {
                fileSharing.FF.close();
                return;
            }
            fileProperty.server.rename(fileName, fileId, function(result) {
                if (result.success) {
                    var mode = fileProperty.tool.getMode();
                    var parent = fileProperty.tool.getParent();
                    if (mode == "share") {
                        parent.sharingFileList.action.refresh();
                    } else if (mode == "disk") {
                        parent.sharingFileDisk.action.refresh();
                    }
                    setTimeout(fileSharing.FF.close, 500);//防止jquery中方法未执行完毕，js执行环境就被销毁
                } else {
                    errorMsg.html(result.message);
                    errorTip.show();
                }
            });
        }
    },
    render: {},
    server: {
        //重命名
        rename: function(fileName, fileId, callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            $.postXml({
                url: fileProperty.urls.getRenameUrl(),
                data: XmlUtility.parseJson2Xml({
                    fileId: fileId,
                    name: fileName
                }),
                success: function() {
                    var result = {};
                    result.success = this.code == fsConfig.isOk;
                    result.message = this.summary;
                    if (callback) {
                        callback(result);
                    }
                },
                error: function(error) {
                    fileSharing.tool.handleError(error);
                }
            });
        }
    },
    tool: {
        //获取父窗体
        getParent: function() {
            var mode = fileProperty.tool.getMode();
            var frameId = "quicklyShare";
            if (mode == "disk") {
                frameId = "diskDev";
            }
            return top.jQuery("iframe[id='{0}']".format(frameId))[0].contentWindow;
        },
        //获取信息类型
        getMode: function() {
            return Utils.queryString("mode");
        },
        //获取文件id
        getFileId: function() {
            return Utils.queryString("fileid");
        },
        //获取当前要编辑的文件
        getFile: function() {
            var fileId = Utils.queryString("fileid");
            if (!fileId) {
                return null;
            }
            var files = fileProperty.tool.getParent().fileList || [];
            var result = $.grep(files, function(n, i) {
                return n.fileId == fileId;
            });
            return result && result.length > 0 ? result[0] : null;
        },
        //获取文件类型名称
        getFileTypeName: function(ext) {
            var defValue = "未知类";
            if (!ext) {
                return defValue;
            }
            ext = ext.toLowerCase();
            $.each(fileProperty.fileTypeDefine, function(n, v) {
                if (v.indexOf(ext) > 0) {
                    defValue = n;
                    return false;
                }
            });
            return defValue;
        },
        //验证文件名
        validName: function(name) {
            name = name ? name : "";
            name = $.trim(name);
            if (name == "") {
                return fileProperty.messages.Empty;
            }
            if (name.length > 50) {
                return fileProperty.messages.MaxLength;
            }
            if (fileProperty.tool.hasInvalidChar(name)) {
                return fileProperty.messages.InvalidChar;
            }
            return "";
        },
        //是否含有非法字符
        hasInvalidChar: function(name) {
            var invalidChars = ['*', '|', ':', '"', '<', '>', '?', '\\', '\'', '/'];
            for (var i = 0, len = name.length; i < len; i++) {
                var currentChar = name.charAt(i);
                var isInvalid = false;
                $.each(invalidChars, function(index, name) {
                    if (name == currentChar) {
                        isInvalid = true;
                        return false;
                    }
                });
                if (isInvalid) {
                    return true;
                }
            }
            return false;
        }
    }
}

//页面加载
fileProperty.action.pageLoad();

