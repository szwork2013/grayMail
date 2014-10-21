var DiskSharing = {
    sendId: "",
    flags: null,
    action: {
        pageLoad: function() {
            var sendId = Utils.queryString("sendid");
            var container = $(".textcontent");
            if (!sendId) {
                DiskSharing.render.rendErrorFile();
                return;
            }
            DiskSharing.sendId = sendId;
            $(".downbtn").click(function() {
                var me = $(this);
                if (me.attr("down") == "0")
                { return; }
                me.attr("down", "0");
                window.setTimeout(function() { me.attr("down", "1"); }, 4000);
                var data = $(this).data("file");
                DiskSharing.action.downFile(data, function() {
                    window.setTimeout(function() {
                        DiskSharing.render.rendDownload();
                    }, 5000);
                });
            });
            DiskSharing.render.rendFile(sendId);
        },
        downFile: function(data, callback) {
            var url = "";
            DiskSharing.server.downloadSendFile(data.groupId, data.sendId, function(ret) {
                if (ret && ret.length > 0) {
                    url = ret;
                }
            });
            if (url) {
                if (callback) callback();
                window.open(url);
            }
        }
    },
    render: {
        rendFile: function(id) {
            DiskSharing.server.getDownFileListNew(id, function() {
                if (this && this.length > 0) {
                    DiskSharing.render.rendFileInfo(this[0]);
                } else {
                    DiskSharing.render.rendErrorFile();
                }
            }, false);
        },
        rendDownload: function() {
            DiskSharing.server.getDownFileListNew(DiskSharing.sendId, function() {
                if (this && this.length > 0) {
                    $("#spRemainDownTimes").text(this[0].remainDownloadTimes);
                }
            });
        },
        rendErrorFile: function() {
            var container = $(".textcontent");
            container.children().hide();
            container.prepend($("#tempErrorPreview").val());

        },
        rendFileInfo: function(file) {
            var html = $("#tempFilePreview").val();
            var thumbImgUrl = file.imgTbnailUrl;
            var container = $(".textcontent");
            var fileName = file.fileName;
            var ele = $(html.format(thumbImgUrl, DiskSharing.tool.subName(fileName, 30).encode(), file.fileSize, file.remainTime, file.remainDownloadTimes, fileName.encode()));
            if (thumbImgUrl) {
                ele.find("div.infoico").remove();
            } else {
                ele.find("img").remove();
            }
            ele.prependTo(container);
            $(".downbtn").data("file", file).parent().show();
        }
    },
    server: {
        getDownFileListNew: function(sendIds, callback, async) {
            async = async ? true : false;
            Utils.waitForReady("top.frames['proxy']._ajax", function(){
                top.frames['proxy']._ajax.post(
                "http://smsrebuild0.mail.10086.cn/disk/disk?func=disk:downLoadInitNew&sid=&rnd=0.39416378244658156",
                XmlUtility.parseJson2Xml({
                        sendIds: sendIds
                    }), function(result) {
                        var result = null;
                        if (this.code == fsConfig.isOk) {
                            result = this["var"].fileList;
                        }
                        if (callback) callback.call(result);
                    }, async);
            })
        },
        downloadSendFile: function(groupId, sendId, callback) {
            $.postXml({
                url: fileSharing.resolveUrl("downLoadMd"),
                data: XmlUtility.parseJson2Xml({
                    groupId: groupId,
                    sendId: sendId
                }),
                async: false,
                success: function(result) {
                    if (this && this.code) {
                        if (this.code != fsConfig.isOk) {
                            fileSharing.FF.alert(this.summary);
                            return;
                        }
                        if (callback) { callback(this.imageUrl); }
                    }
                },
                error: function(xhr, textStatus, errorThrown) {
                    fileSharing.tool.handleError(error);
                }
            });
        }
    },
    tool: {
        isPicture: function(ext) {
            var category = "bmp,gif,ico,jpg,jpeg,png,tif,";
            return category.indexOf("{0},".format(ext).toLowerCase()) > -1;
        },
        subName: function(name, length) {
            if (!name || name.length < length) {
                return name;
            }
            var left = "";
            var ext = "";
            var subs = name.split(".");
            if (subs.length > 1) {
                ext = "." + subs.pop();
                left = subs.join("");

            } else {
                left = name;
            }
            if (left.length < length) {
                return left + ext;
            };
            return left.substring(0, length) + "。。" + ext;
        }
    }
};
DiskSharing.action.pageLoad();