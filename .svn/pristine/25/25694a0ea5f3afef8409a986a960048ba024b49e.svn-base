var selectDisk = {
    //1表示全部，0最新上传 其它就是相册ID
    currentDir: 1,
    //每页显示图片大小
    pageSize: 12,
    //可选择图片的最大容量(5M)
    fileMaxSize: 5242880,
    //缩略图数据
    thumbImgUrls: [],
    //和父框架交互的参数信息
    args: null,
    photos: [],
    urls: {
        //获取专辑信息列表
        getAlbumList: function() {
            return DiskTool.resolveUrl("getDiskAlbumList", true);
        },
        //获取相册信息列表
        getPhotoList: function() {
            return DiskTool.resolveUrl("getDiskPhotoList", true);
        },
        //获取缩略图信息列表
        getThumbnailImageUrl: function() {
            return DiskTool.resolveUrl("getthumbnailimage", true);
        },
        //文件转存到coremail服务器
        getFileToCormailUrl: function() {
            return DiskTool.resolveUrl("fileToCoremail", true);
        },
        //文件显示错误提示图片
        getErrorImgUrl: function() {
            return DiskTool.getRelativeUrl("/m2012/images/module/disk/disk_cuowu.gif");
        }
    },
    messages: {
        NoPhoto: "彩云相册中暂无照片，请选择其他方式。",
        MaxSize: "所选图片大于5M，无法添加，超大附件请使用文件快递！"
    },
    action: {
        //页面加载
        pageLoad: function() {
            Utils.loadSkinCss(null, document, "netdisk");
            //获取彩云图片选取相关参数
            selectDisk.action.getDiskArgs();
            $(function() {
                DiskTool.addDiskBehavior({
                    actionId: 19801,
                    thingId: 0,
                    moduleId: 11,
                    actionType: 20
                });
                DiskTool.useWait();
                $(document).click(function(e) {
                    $("#file-tree").hide();
                });
                //设置tab页
                selectDisk.action.showTab();
                //显示专辑下拉列表
                selectDisk.action.showAlbumList();
                //设置分页器            
                //显示当前专辑下所有图片
                selectDisk.action.showPhotoList();
            });
        },
        //初始化相关参数
        getDiskArgs: function() {
            var args = top.GetDiskArgs();
            args = args ? args : {};
            args.sid = (typeof args.sid == "undefined") ? queryString("sid") : args.sid;
            args.restype = (typeof args.restype == "undefined") ? 1 : args.restype;
            args.selectMode = (typeof args.selectMode == "undefined") ? 0 : args.selectMode;
            args.width = (typeof args.width == "undefined") ? 500 : args.width;
            args.height = (typeof args.height == "undefined") ? 500 : args.height;
            args.isUpload = (typeof args.isUpload == "undefined") ? false : args.isUpload;
            args.composeId = (typeof args.composeId == "undefined") ? "" : args.composeId;
            args.uploadUrl = (typeof args.uploadUrl == "undefined") ? "" : args.uploadUrl;
            selectDisk.args = args;
        },
        //设置tab页
        showTab: function() {
            if (queryString("isShowTab") == 1) {
                var coremailPath = queryString("coremailPath");
                //写信页打开时重置样式
                top.$(".winTip").css("top", 120);
                top.$(".winTipC").find("iframe").height(415);
                $("#div_Tab").show();
                $("#aLocalPhoto").attr("href", "{0}disk_img_1.htm{1}".format(coremailPath, window.location.search));
                $("#aNetImage").attr("href", "{0}disk_img_3.htm{1}".format(coremailPath, window.location.search));
            }
        },
        //初始化专辑下拉列表
        showAlbumList: function() {
            selectDisk.server.getAlbumList(function() {
                //相片总数
                var totalCount = 0;
                var list = [];
                if (this.allPhotoCount) {
                    totalCount = parseInt(this.allPhotoCount);
                }
                if (this.albumList && this.albumList.length > 0) {
                    list = this.albumList;
                }
                if (list && list.length > 0) {
                    selectDisk.render.renderAlbumList(list, totalCount);
                }
            });
        },
        //显示图片列表
        showPhotoList: function() {
            var albumId = selectDisk.currentDir;
            albumId = albumId == 1 ? "" : albumId;
            selectDisk.server.getPhotoList(albumId, function() {
                var data = this;
                data = data ? data : [];

                selectDisk.pager.data = data;
                selectDisk.pager.renderList = selectDisk.render.renderPhotoList;
                selectDisk.pager.init();
            });
        },
        //当前所选专辑发生改变时
        changDir: function(dirId) {
            if (selectDisk.currentDir != dirId) {
                selectDisk.currentDir = dirId;
                selectDisk.action.showPhotoList();
            }
        },
        //附件转存cormail
        fileToCormail: function(file) {
            var data = {
                sid: selectDisk.args.sid,
                cormailSid: selectDisk.args.coremailSid,
                fileUrl: file.url,
                fileName: file.srcFileName,
                composeId: selectDisk.args.composeId,
                uploadUrl: selectDisk.args.uploadUrl
            };
            selectDisk.server.fileToCormail(data, function() {
                var attachId = this.fileId;
                if (top.isRichmail) {
                    attachId = {
                        fileId: this.fileId,
                        fileName: file.srcFileName
                    }
                }
                var rows = [];
                rows.push({
                    fileid: file.fileId,
                    filename: file.srcFileName,
                    filesize: file.fileSize,
                    url: file.url,
                    attachid: attachId
                });
                selectDisk.args.callback({
                    code: 0,
                    info: "",
                    count: 1,
                    rows: rows
                });
                top.WaitPannel.hide();
                top.FloatingFrame.close();
            });
        },
        //获取在写信页编辑器中显示的图片Url
        getFileUrl: function(file) {
            var url = "";
            var width = selectDisk.args.width;
            var height = selectDisk.args.height;
            //获取当前选中图片的中图url地址
            selectDisk.server.getThumbImageData(file.fileId, width, height, function() {
                if (this && this[file.fileRefId]) {
                    url = this[file.fileRefId];
                }
            }, false);
            file.url = url;
        }
    },
    render: {
        //呈现专辑下拉列表
        renderAlbumList: function(data, total) {
            var ddl = $(".uploadTree div");
            ddl.text("我的相册 ({0})".format(total));
            ddl.click(function(e) {
                $("#file-tree").toggle();
                Utils.stopEvent(e);
            });
            var container = $("#file-tree");
            container.empty();
            var li = $("<li id='ab_1' class='current'><i class='i-tree2'/><i class='i-folder1'></i><span>我的相册 ({0})</span></li>".format(total));
            var ul = $("<ul></ul>");
            container.append(li);
            li.append(ul);
            $.each(data, function() {
                ul.append($("<li id='ab_{0}'><i class='i-tree2'/><i class='i-folder1'></i><span>{1}({2})</span></li>".format(this.albumId, this.albumName, this.totalCount)));
            });
            container.find("li").click(function(e) {
                var li = $(this);
                container.find(".current").removeClass("current");
                li.addClass("current");
                $(".uploadTree div").text(li.find("span").eq(0).text());
                container.hide();
                selectDisk.action.changDir(this.id.split("_")[1]);
                e.stopPropagation();
            });
            selectDisk.currentDir = 1;
        },
        //呈现图片列表
        renderPhotoList: function(data) {
            data = data ? data : [];
            var container = $(".listImg");
            container.empty();
            if (data.length == 0) {
                container.append($("<P class='no-note'>{0}</P>".format(selectDisk.messages.NoPhoto)));
                return;
            }
            var template =
            '<a id="img_{0}">\
                <span style="text-align:center">\
                    <img src ="/m2012/images/module/disk/disk_loadinfo.gif" fileid="{0}" filerefid="{1}"/>\
                </span>\
             </a>';
            var li = null;
            $.each(data, function() {
                li = $(template.format(this.fileId, this.fileRefId));
                li.find("img")[0].onerror = function() {
                    if (this.error) {
                        this.alt = "加载有误";
                    } else {
                        this.error = 1;
                        this.src = "/m2012/images/module/disk/disk_cuowu.gif";
                    }
                }
                li.data("data", this);
                container.append(li);
            });
            //点击图片时触发事件
            container.find("a").click(function(e) {
                e.stopPropagation();
                var file = $(this).data("data");
                if (file.fileSize > selectDisk.fileMaxSize) {
                    alert(selectDisk.messages.MaxSize);
                    return;
                }
                if (!selectDisk.args.callback) return;
                //获取文件缩略图地址(中图)
                selectDisk.action.getFileUrl(file);
                if (selectDisk.args.isUpload) {
                    selectDisk.action.fileToCormail(file);
                    return;
                }
                var rows = [];
                rows.push({
                    fileid: file.fileId,
                    filename: file.srcFileName,
                    filesize: file.fileSize,
                    url: file.url,
                    attachid: ""
                });
                selectDisk.args.callback({
                    code: 0,
                    info: "",
                    count: 1,
                    rows: rows
                });
                top.FloatingFrame.close();
            });
            //呈现相片缩略图
            selectDisk.render.renderThumbImage();
        },
        //获取缩略图并呈现
        renderThumbImage: function() {
            var remain = [];
            var remianImgs = []; //没有加载缩略图的图片对象列表
            var images = $(".listImg>a>span>img");
            var urls = selectDisk.thumbImgUrls;

            var fileId = null;
            var refId = null;
            var url = null;
            //先从缓存中获取数据          
            images.each(function() {
                fileId = $(this).attr("fileid");
                refId = $(this).attr("filerefid");
                //无fileId、filerefid时跳过
                if (!fileId || !refId) {
                    return true;
                }
                if (urls && urls[refId] && urls[refId].length > 0) {
                    $(this).attr("src", urls[refId]);
                } else {
                    remain.push(fileId);
                    remianImgs.push(this);
                }
            });
            //没有缓存的图片则请求服务器获取
            if (remain.length > 0) {
                var fileIds = remain.join(",");
                selectDisk.server.getThumbImageData(fileIds, 100, 75, function() {
                    var result = this;
                    if (result) {
                        $.each(remianImgs, function() {
                            refId = $(this).attr("filerefid");
                            url = result[refId];
                            if (url && url.length > 0) {
                                selectDisk.thumbImgUrls[refId] = url;
                            } else { url = selectDisk.urls.getNoPicURL(); }
                            $(this).attr("src", url);
                        });
                    }
                });
            }
        }
    },
    server: {
        //获取相册文件夹列表
        getAlbumList: function(callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return
            };
            $.postXml({
                url: selectDisk.urls.getAlbumList(),
                success: function() {
                    if (this.code == DiskConf.isOk) {
                        if (callback) {
                            callback.call(this["var"]);
                        }
                    } else { DiskTool.FF.alert(this.summary); }
                },
                error: function(error) {
                    DiskTool.handleError(error);
                }
            });
        },
        //获取指定专辑相片列表
        //albumId为空去所有相片信息
        getPhotoList: function(albumId, callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            $.postXml({
                url: selectDisk.urls.getPhotoList(),
                data: XmlUtility.parseJson2Xml({
                    albumId: albumId
                }),
                success: function(result) {
                    if (result.code == DiskConf.isOk) {
                        if (callback) { callback.call(result["var"].photoList); }
                    } else { DiskTool.FF.alert(result.summary); }
                },
                error: function(error) {
                    DiskTool.handleError(error);
                }
            });
        },
        //获取相片缩略图
        getThumbImageData: function(fileIds, width, height, callback, async) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            if (typeof async == "undefined") {
                async = true;
            }
            $.postXml({
                url: selectDisk.urls.getThumbnailImageUrl(),
                data: XmlUtility.parseJson2Xml({
                    fileids: fileIds,
                    width: width,
                    height: height
                }),
                async: async,
                success: function(result) {
                    if (result.code == DiskConf.isOk) {
                        if (callback) { callback.call(result["var"]); }
                    } else { DiskTool.FF.alert(result.summary); }
                },
                error: function(error) {
                    DiskTool.handleError(error);
                }
            });
        },
        //文件转存cormail服务器
        fileToCormail: function(data, callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            $.postXml({
                url: selectDisk.urls.getFileToCormailUrl(),
                data: XmlUtility.parseJson2Xml(data),
                success: function(result) {
                    if (result.code == DiskConf.isOk) {
                        if (callback) { callback.call(result["var"]); }
                    } else { DiskTool.FF.alert(result.summary); }
                },
                error: function(error) {
                    DiskTool.handleError(error);
                }
            });
        }
    },
    pager: {
        index: 0,
        data: null,
        count: 0,
        size: 12,
        init: function() {
            if (!selectDisk.pager.data) {
                return;
            }
            selectDisk.pager.index = 0;
            var total = selectDisk.pager.data.length;
            selectDisk.pager.count = parseInt(total / selectDisk.pager.size);
            if (total % selectDisk.pager.size != 0) {
                selectDisk.pager.count += 1;
            }
            selectDisk.pager.renderPager();
        },
        //控制分页器项显示
        displayPager: function() {
            if (selectDisk.pager.count <= 1) {
                $("#pageup").hide();
                $("#pagedown").hide();
                return;
            }
            if (selectDisk.pager.index < selectDisk.pager.count - 1) {
                $("#pagedown").show();
            } else {
                $("#pagedown").hide();
            }
            if (selectDisk.pager.index > 0) {
                $("#pageup").show();
            } else {
                $("#pageup").hide();
            }
        },
        //呈现分页器
        renderPager: function() {
            var container = $("#pagelist");
            container.empty();
            if (selectDisk.pager.count == 0) {
                container.append($("<option  selected>0/0</option>"));
            } else {
                var selected = "";
                for (var i = 1; i <= selectDisk.pager.count; i++) {
                    selected = "";
                    if (selectDisk.pager.index == i - 1) {
                        selected = "selected";
                    }
                    container.append($("<option {0}>{1}/{2}</option>".format(selected, i, selectDisk.pager.count)));
                }
            }
            //上一页
            $("#pageup").click(function(e) {
                e.preventDefault();
                if (selectDisk.pager.index > 0) {
                    selectDisk.pager.index--;
                    selectDisk.pager.refresh();
                }
            });
            //下一页
            $("#pagedown").click(function(e) {
                e.preventDefault();
                if (selectDisk.pager.index < selectDisk.pager.count - 1) {
                    selectDisk.pager.index++;
                    selectDisk.pager.refresh();
                }
            });
            $("#pagelist").change(function(e) {
                var p = this.selectedIndex;
                if (selectDisk.pager.index != p) {
                    selectDisk.pager.index = p;
                    selectDisk.pager.refresh();
                }
            });
            selectDisk.pager.refresh();
        },
        //刷新列表
        refresh: function() {
            //控制分页器项显示
            selectDisk.pager.displayPager();
            //选中下拉列表
            $("#pagelist")[0].selectedIndex = selectDisk.pager.index;
            //呈现列表
            if (selectDisk.pager.renderList) {
                var currData = [];
                var data = selectDisk.pager.data;
                var start = selectDisk.pager.size * selectDisk.pager.index;
                var end = start + selectDisk.pager.size;
                currData = $.grep(data, function(n, index) {
                    if (index >= start && index < end) {
                        return true;
                    }
                });
                selectDisk.pager.renderList(currData);
            }
        },
        //呈现列表
        renderList: null
    }
};
//页面加载
selectDisk.action.pageLoad();