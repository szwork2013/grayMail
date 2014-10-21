/*
* Copyright (C) 2011 http://www.richinfo.cn
* 檔案名：      m2011.disk.photo.js
* 檔功能描述：  相册图片列表的js功能类,对应photoList.html
* 創建人：      lizg   
* 創建日期：    2011/12/21
* 修改人：            
* 修改日期：
* 程式版次：  
* 修改描述：           
*/
var albumPhoto = {
    clearCache: "false",
    //可以用来做明信片的文件后缀
    postCardExt: "png,jpg,jpeg,gif,",
    defPageSize: 24,
    showedFocusImage: 0, //是否触发幻灯片
    //服务器接口地址
    uri: {
        getList: function () {
            return DiskTool.resolveUrl("getDiskPhotoList", true);
        },
        getDelUrl: function () {
            return DiskTool.resolveUrl("deleteDiskPhoto", true);
        },
        getThumbnailImageUrl: function () {
            return DiskTool.resolveUrl("getthumbnailimage", true);
        },
        //图片预览
        getImageAllUrl: function () {
            return DiskTool.resolveUrl("flashplay", true);
        },
        getNoPicURL: function () {
            return "/m2012/images/module/disk/disk_no-pic.jpg";
        },
        getSetCover: function () {
            return DiskTool.resolveUrl("setDiskAlbumCover", true);
        },
        getFileDownloadUrl: function () {
            return DiskTool.resolveUrl("download", true);
        }
    },
    //提示语
    messages: {
        Res_UserSizePopedom: "下载失败，请稍后再试。",
        Res_UserSize: "尊敬的用户,您好!彩云文件单次打包下载限量为{size}M请您重新选择文件再下载!",
        SendFiveFile: "一次只能发送50个文件,请取消部分文件",
        CanNotSendFolder: "只能快递文件，暂不支持文件夹快递",
        SendOneMMSFile: "通过彩信进行文件快递每次只能发送一张图片",
        Res_Del_Fail: "删除失败，请稍后再试。",
        Res_Del_Fail_More: "相册下照片过多，请先删除该相册下的照片再删除该相册。",
        Res_Del_Success: "删除成功",
        Res_SetFM_Success: "封面设定成功",
        Res_Print_ErrorType: "您选择的图片不是jpg格式，请重新选择",
        Res_Pram_Error: "参数不正确",
        Res_Move_Fail: "移动失败，请稍后再试。",
        Res_Delete_Tips: "是否要删除{0}个图片?",
        Res_Delete_Error1: "你选择的图片正在冲印，不能删除。请重新选择",
        SetPageCountMsg: "每页最多显示500张，请重新输入要显示的张数。",
        proEmpty: "请选择一个相册进行操作",
        Res_Only_One: "一次只能重命名一张图片",
        AlbumEmpty: "该相册内没有图片，无法展示",
        Res_Check_One: "请勾选需要操作的图片",
        Move_Success: "移动成功！",
        VipUserPrint: "抱歉，该功能仅对广州及深圳的全球通用户开放",
        SendMMSFileSize: "文件大于50k不能发送！",
        FileNotSupportMMS: '"{0}"不支持手机彩信发送!',
        ErrorFilePath: "无法获取文件路径"
    },
    showSidError: function () {
        window.location.href = top.ucDomain + "/error/systemtip4.html";
    },
    //获取所有的图片数据
    photos: [],
    //事件处理
    action: {
        //页面初始化信息
        pageLoad: function () {
            //加载皮肤
            Utils.loadSkinCss(null, document, "netdisk");
            DiskTool.AddListenScroll();
            $(function () {
                DiskTool.useWait();
                var url = "disk_album.html?sid={0}".format(albumPhoto.server.getUserInfo());
                var sid = albumPhoto.server.getUserInfo();
                var aid = albumPhoto.tool.getAlbumId();
                var aName = albumPhoto.tool.getAlbumName();

                $("#path").val(DiskTool.getResource());
                //设置导航信息
                $("#spMapPath").append("&gt;<a href='disk_photolist.html?id={0}&name={1}'>{2}</a>".format(aid, escape(aName), aName));
                $(".nd-hd>ul>li>i:not(.i-down)").click(function () {
                    $(this).next().click();
                });
                //返回上一级
                $("div.tbl-list-return a").click(window.parent.DiskInfo.Action.ReturnParentDir);

                //初始化页面事件、列表和分页控件       
                albumPhoto.event.initial();
                //获取服务器数据并展示
                albumPhoto.action.getList();
            });
        },
        //获取列表数据
        //refreshPager: 是否要重新绘画分页控件
        getList: function (refreshPager) {
            //获取服务器数据并展示
            albumPhoto.server.getList(function () {
                var data = this ? this : { photoList: [] };
                albumPhoto.photos = data.photoList;
                //设置分页控件数据，呈现控件和数据列表
                ListPager.Render.initialPager();
                var pageSize = albumPhoto.defPageSize;
                if (DiskConf.diskPhotoListPageSize) {
                    pageSize = DiskConf.diskPhotoListPageSize
                }
                //展开主框架右侧相册分类
                if (window.parent.DiskInfo.Data) {
                    window.parent.DiskInfo.Action.ExpandAlbum(albumPhoto.tool.getAlbumId());
                }
                //是否重新绘画分页器
                if (typeof refreshPager == "undefined" || refreshPager.constructor != Boolean) {
                    refreshPager = true;
                }
                ListPager.Filter.initialize = refreshPager;
                ListPager.Filter.pageSize = pageSize;
                ListPager.Render.renderList = albumPhoto.render.renderList;
                ListPager.Filter.setData(data.photoList);
                ListPager.Render.renderPage(ListPager.Filter.pageIndex);


                var flashXml = albumPhoto.server.getFlashXML(0);
                if (flashXml) {
                    flashXml = flashXml.split("<mesne>")
                    var arr = [];
                    var len = flashXml.length;
                    for (var i = 1; i < len; i++) {
                        var img = flashXml[i].split("</mesne>")[0];
                        arr.push(img)
                    }
                    var thumbImage = albumPhoto.action.getAllImage;
                    albumPhoto.previewImg = [];
                    var datasource = data.photoList
                    for (var i = 0; i < datasource.length; i++) {
                        var dataObj = datasource[i];
                        albumPhoto.previewImg.push({
                            imgUrl: thumbImage[i],
                            fileName: dataObj.srcFileName,
                            downLoad: arr[i],
                            comefrom: "disk",
                            filerefid: dataObj.fileId
                        })
                    }
                }
            });
        },
        //刷新列表
        refreshList: function (refreshPager) {
            //获取服务器数据并展示
            albumPhoto.action.getList(refreshPager);
        },
        //下载
        down: function (id) {
            var allFids = [];
            //下载时名称
            var downName = "";
            var files = "";
            if (id) {//单个下载
                allFids.push(id);

                for (var i = 0; i < albumPhoto.photos.length; i++) {
                    if (albumPhoto.photos[i].fileId == id) {
                        downName = albumPhoto.photos[i].srcFileName;
                        break;
                    }
                }

            } else {//多个下载
                $.each(albumPhoto.tool.getAllSelectedRow(), function () {
                    allFids.push(this.fileId);
                });
                //downName = albumPhoto.tool.getAlbumName();
                downName = "";//传空值，服务端会自动取相册名
            }
            if (allFids.length == 0) {
                DiskTool.FF.alert(albumPhoto.messages.Res_Check_One);
                return;
            }
            files = allFids.join(",");
            DiskTool.downloadFile(files, "", downName, allFids.length);
            DiskTool.addDiskBehavior({
                actionId: 7029,
                moduleId: 25,
                actionType: 20
            });
        },
        /*删除
        * fileId: 图片id
        * seqId：图片序列号
        */
        del: function (fileId) {
            DiskTool.addDiskBehavior({
                actionId: 37,
                moduleId: 11,
                actionType: 10
            });
            var fileIds = [];
            if (fileId) {
                fileIds.push(fileId);
            } else {
                $.each(albumPhoto.tool.getAllSelectedRow(), function () {
                    fileIds.push(this.fileId);
                });
            }
            if (fileIds.length == 0) {
                DiskTool.FF.alert(albumPhoto.messages.Res_Check_One);
                return;
            }
            //确认删除
            var confirmMsg = albumPhoto.messages.Res_Delete_Tips.format(fileIds.length);
            DiskTool.FF.confirm(confirmMsg, function () {
                albumPhoto.server.del(fileIds.join(","), function () {
                    Toolbar.refreshList();
                });
            });
        },
        //获取缩略图
        getThumbnailImageData: function () {
            var remain = [];
            var remianImgs = []; //没有加载缩略图的图片对象列表
            var images = $(".img-bd>span>img");
            var urls = window.parent.DiskInfo.ThumbImgUrls;

            var fileId = null;
            var refId = null;
            var url = null;
            albumPhoto.action.getAllImage = [];
            //先从缓存中获取数据          
            images.each(function () {
                fileId = $(this).attr("fileid");
                refId = $(this).attr("filerefid");
                //无封面时跳过
                if (!fileId || !refId) {
                    return true;
                }
                if (urls && urls[refId] && urls[refId].length > 0) {
                    $(this).attr("src", urls[refId]);
                    albumPhoto.action.getAllImage.push(urls[refId])
                } else {
                    remain.push(fileId);
                    remianImgs.push(this);
                }
            });
            //没有缓存的图片则请求服务器获取
            if (remain.length > 0) {
                var fileIds = remain.join(",");
                albumPhoto.server.getThumbnailImageData(fileIds, function () {
                    var result = this;
                    if (result) {
                        $.each(remianImgs, function () {
                            refId = $(this).attr("filerefid");
                            url = result[refId];
                            albumPhoto.action.getAllImage.push(url);
                            if (url && url.length > 0) {
                                if (!window.parent.DiskInfo.ThumbImgUrls) {
                                    window.parent.DiskInfo.ThumbImgUrls = {};
                                }
                                window.parent.DiskInfo.ThumbImgUrls=url
                                albumPhoto.action.getThumbUrls();
                            } else { url = albumPhoto.uri.getNoPicURL(); }
                            $(this).attr("src", url);
                        });
                    }
                });
            }
        },
        getThumbUrls: function () {
            var urls = window.parent.DiskInfo.ThumbImgUrls;
            var key = [];
            var value = [];
            for (i in urls) {
                key.push(i);
                value.push(urls[i]);
            }
            var len = key.length;
            key.unshift(key[len - 1]);
            value.unshift(value[len - 1]);
            key.shift(key[len])
            value.shift(value[len])
            for (var n = 0; n < key.length; n++) {
                window.parent.DiskInfo.ThumbImgUrls[key] = value;
            }
        },
        getAllImage: [],
        //获取当前页所有图片id
        getPicFileIds: function () {
            var list = ListPager.Filter.getData();
            var filter = [];
            for (var i = 0, length = list.length; i < length; i++) {
                if (list[i].fileId) {
                    filter.push(list[i].fileId);
                }
            }
            return filter.join(",");
        },
        //上传相片
        upload: function () {
            DiskTool.openUpload("1", albumPhoto.tool.getAlbumId(), encodeURIComponent(albumPhoto.tool.getAlbumName()));
        },
        //共享
        share: function () {
            if (top.$User && !top.$User.checkAvaibleForMobile()) { //非移动用户，屏闭wap短信发送
                return;
            }
            var selectedRow = albumPhoto.tool.getAllSelectedRow();
            var selCount = selectedRow.length;
            if (selCount == 0) {
                DiskTool.FF.alert(albumPhoto.messages.Res_Check_One);
                return;
            }
            DiskTool.addDiskBehavior({
                actionId: 14,
                moduleId: 11,
                actionType: 10,
                ext1: selCount
            });
            var urlshare = DiskTool.getRelativeUrl("disk_dialogsharefile.html");
            DiskTool.FF.open("好友共享", urlshare, 565, 440, true);
        },
        //发送到邮箱
        sendEmail: function () {
            var selectFiles = albumPhoto.tool.getAllSelectedRow();
            var fileCount = selectFiles ? selectFiles.length : 0;
            if (fileCount == 0) {
                DiskTool.FF.alert(albumPhoto.messages.Res_Check_One);
                return;
            }
            if (fileCount > 50) {
                DiskTool.FF.alert(albumPhoto.messages.SendFiveFile);
                return;
            }
            var files = $.map(selectFiles, function (n) {
                return n.fileId;
            });
            //转到文件快递发送页面
            DiskTool.addDiskBehavior({
                actionId: 7006,
                moduleId: 11,
                actionType: 20
            });
            window.setTimeout(function () {
                top.Links.show("quicklyShare", "&type=email&fileId={0}".format(files.join(",")));
            }, 0);
        },
        //发送到手机(wap)
        sendMobile: function () {
            if (top.$User && !top.$User.checkAvaibleForMobile()) { //非移动用户，屏闭wap短信发送
                return;
            }
            var selectFiles = albumPhoto.tool.getAllSelectedRow();
            var fileCount = selectFiles ? selectFiles.length : 0;
            if (fileCount == 0) {
                DiskTool.FF.alert(albumPhoto.messages.Res_Check_One);
                return;
            }
            if (fileCount > 50) {
                DiskTool.FF.alert(albumPhoto.messages.SendFiveFile);
                return;
            }
            var files = $.map(selectFiles, function (n) {
                return n.fileId;
            });
            //转到文件快递发送页面
            DiskTool.addDiskBehavior({
                actionId: 7007,
                moduleId: 11,
                actionType: 20
            });
            window.setTimeout(function () {
                top.Links.show("quicklyShare", "&type=mobile&fileId={0}".format(files.join(",")));
            }, 0);
        },
        //发送到手机(彩信)
        sendMMS: function () {
            if (top.$User && !top.$User.checkAvaibleForMobile()) { //非移动用户，屏闭wap短信发送
                return;
            }
            var selectFiles = albumPhoto.tool.getAllSelectedRow();
            var count = selectFiles ? selectFiles.length : 0;
            if (count == 0) {
                DiskTool.FF.alert(albumPhoto.messages.Res_Check_One);
                return;
            }
            if (count != 1) {
                DiskTool.FF.alert(albumPhoto.messages.SendOneMMSFile);
                return;
            }
            DiskTool.addDiskBehavior({
                actionId: 7008,
                moduleId: 11,
                actionType: 20
            });
            var file = selectFiles[0];
            //文件不能大于50k
            if (file.fileSize / 1024 > 50) {
                DiskTool.FF.alert(albumPhoto.messages.SendMMSFileSize);
                return;
            }
            //验证文件格式是否符合彩信发送
            var ext = DiskTool.getFileExtName(file.srcFileName);
            var type = DiskTool.Toolbar.getExtTypeBySend(ext);
            if (!type) {
                DiskTool.FF.alert(albumPhoto.messages.FileNotSupportMMS.format(file.srcFileName));
                return;
            }
            //请求分布式获取文件分布式地址
            var filePath = "";
            albumPhoto.server.getFilePath(file.fileId, file.srcFileName, function () {
                filePath = this.url;
            });
            filePath = filePath ? filePath : "";
            if (filePath.length == 0) {
                DiskTool.FF.alert(albumPhoto.messages.ErrorFilePath);
                return;
            }
            var url = "&fileid={0}&{1}={2}&ext={3}";
            url = url.format(file.fileRefId, albumPhoto.tool.getPathName(type), encodeURIComponent(filePath), ext);
            //打开标签              
            window.setTimeout(function () { top.Links.show("mms", url); }, 0);
        },
        //图片移动到
        movePhoto: function () {
            var selects = albumPhoto.tool.getAllSelectedRow();
            var count = selects.length;
            if (count == 0) {
                DiskTool.FF.alert(albumPhoto.messages.Res_Check_One);
                return;
            }
            var files = $.map(selects, function (f) { return f.fileId; });
            var url = "disk_dialogmove.html?sid={0}&fileId={1}&folderId=&extList=jpg&rootDirId={2}&type=1";
            url = url.format(albumPhoto.server.getUserInfo(), files.join(","), albumPhoto.tool.getAlbumId());
            url = DiskTool.getRelativeUrl(url);
            DiskTool.FF.open("移动到", url, 330, 321, true);
        },
        //发送到微博
        showSendWb: function () {
            var selects = albumPhoto.tool.getAllSelectedRow();
            var count = selects.length;
            if (count == 0) {
                DiskTool.FF.alert(albumPhoto.messages.Res_Check_One);
                return;
            }
            if (count > 1) {
                DiskTool.FF.alert("只能选择一个文件");
                return;
            }
            DiskTool.sendToWb(selects[0].fileId);
        },
        //相册图片列表flash展示
        slideFlash: function () {
            DiskTool.addDiskBehavior({
                actionId: 7003,
                moduleId: 11,
                actionType: 20
            });
            var sid = albumPhoto.server.getUserInfo();
            var aid = albumPhoto.tool.getAlbumId();
            //todo 外页打开 跨域 老地址
            var url = top.getDomain("rebuildDomain") + "/disk/netdisk/html/albumslide.htm?sid={0}&aid={1}&res={2}&ucd={3}";
            //url = url.format(sid, aid, encodeURIComponent(DiskTool.getResource()), encodeURIComponent(top.ucDomain));
            url = url.format(sid, aid, DiskTool.getResource().encode(), top.ucDomain.encode());
            window.open(url);
        },
        //用flash展示指定照片
        openImgByFlash: function (num) {
            var len = albumPhoto.previewImg.length;
            var thumbImage = albumPhoto.action.getAllImage;
            for (var i = 0; i < len; i++) {	//新上传图片时  资源会不同步  在点击后获取数据
                albumPhoto.previewImg[i].imgUrl = thumbImage[i];
            }
            if (typeof (top.focusImagesView) != "undefined") {
                top.focusImagesView.render({ data: albumPhoto.previewImg, index: parseInt(num) });
            }
            else {
                top.M139.registerJS("M2012.OnlinePreview.FocusImages.View", "packs/focusimages.html.pack.js?v=" + Math.random());
                top.M139.requireJS(['M2012.OnlinePreview.FocusImages.View'], function () {
                    top.focusImagesView = new top.M2012.OnlinePreview.FocusImages.View();
                    top.focusImagesView.render({ data: albumPhoto.previewImg, index: parseInt(num)});
                });
            }
        }
    },
    //相关事件
    event: {
        //页面启动
        initial: function () {
            //工具栏按钮设定
            var mapper = {
                aUpload: albumPhoto.action.upload,
                aUpload1: albumPhoto.action.upload,
                aDown: function () { albumPhoto.action.down(); },
                aDown1: function () { albumPhoto.action.down(); },
                aShare: albumPhoto.action.share,
                aShare1: albumPhoto.action.share,
                aDel: function () { albumPhoto.action.del(); },
                aDel1: function () { albumPhoto.action.del(); },
                aEmail: albumPhoto.action.sendEmail,
                aEmail2: albumPhoto.action.sendEmail,
                aWap: albumPhoto.action.sendMobile,
                aWap2: albumPhoto.action.sendMobile,
                aMMS: albumPhoto.action.sendMMS,
                aMMS2: albumPhoto.action.sendMMS,
                aMove: albumPhoto.action.movePhoto,
                aMove2: albumPhoto.action.movePhoto,
                aSendWeibo: albumPhoto.action.showSendWb,
                aSendWeibo2: albumPhoto.action.showSendWb,
                slide: albumPhoto.action.slideFlash,
                slide1: albumPhoto.action.slideFlash
            };
            DiskTool.registerAnchor(mapper, function (val) { return val; });
            DiskTool.dropMenuAction2("aSendFile", "sendFileMenu");
            DiskTool.dropMenuAction3("aSendFile2", "sendFileMenu2");

            //清空复选框缓存
            $("#hidrow").removeData("data");
            $("#stAlbumName").html(albumPhoto.tool.getAlbumName());
        },
        //全选的时候
        clickCheckBoxAll: function (v, count) {
            albumPhoto.event.clickCheckBoxCommon();
        },
        //选单行的Checkbox的时候
        clickCheckBoxInRow: function (checked, cb, row) {
            albumPhoto.render.renderCheckedRow(cb.checked, row);
            albumPhoto.event.clickCheckBoxCommon();
        },
        clickCheckBoxCommon: function () {
            var allChecked = $("#tbl-fileList>li>div").find(":checked");
            //控制文件快递
            Toolbar.controlSendPanel({
                data: albumPhoto.tool.getAllSelectedRow(),
                nameField: "ITEMNAME",
                sizeField: "ITEMSIZE"
            });
        },
        //刷新根目录
        refreshRoot: function (list, classList, fileList) {
            if (classList) {
                //刷新专辑列表
                albumPhoto.render.renderRecord(classList);
            }
        },
        //刷新专辑列表
        refreshRecord: function (fileList, pid) {
        },
        pageChanged: function () { }
    },
    /* 
    *界面代码 
    */
    render: {
        //相册列表呈现
        renderList: function (list) {
            //设置全选
            var cbSelectAll = $.getById("cbSelectAllFile", true);
            var lblSelectAll = $("#lblSelectAllFile,#lblSelectAllFile2");
            cbSelectAll.checked = false;
            lblSelectAll.text("全选");
            $(cbSelectAll).click(function () {
                var checked = this.checked;
                var title = null;
                title = checked ? "不选" : "全选";
                lblSelectAll.text(title);
                $("#tbl-fileList>li").each(function () {
                    var row = $(this);
                    row.find("div>:checkbox").each(function () {
                        if (this.disabled === false) { this.checked = checked; }
                    });
                });
            });
            //设置相册文件个数统计信息
            if (window.parent.TiteInfo) {
                window.parent.TiteInfo.setVal(11, $("#lblAlbumCount"), albumPhoto.tool.getAlbumId());
            }
            //呈现列表
            var table = $("#tbl-fileList");
            table.empty();
            if (list.length == 0) {
                $("div.tbl-list-null").show();
                $(".album-list").hide();
                return;
            }
            //有数据时
            $(".album-list").show();
            $("div.tbl-list-null").hide();

            //呈现列表
            $.each(list, function (index, n) {
                var albumId = this.albumId;
                var phoName = this.srcFileName;
                var phoSize = 0;
                var phoRefId = this.fileRefId;
                var coverGuid = this.fileGuid;
                var phoId = this.fileId;
                var seqId = this.seqNo;
                var phoExt = DiskTool.getFileExtName(this.srcFileName).toLowerCase();
                var fragment = $("<li> \
			        <div class='album-hd'> \
				        <input type='checkbox' /><label title='{0}'>{0}</label></div> \
			        <div class='album-bd'> \
				        <p class='img-bd'><span><img width='50px' height='50px'  alt='{0}' fileid='{1}' filerefid='{2}' src=\"/m2012/images/module/disk/disk_loadinfo.gif\"  onerror='{3}'/></span></p></div> \
			        <div class='album-ft'> \
				        <ul> \
					        <li><a  class='a-download'>下载</a></li>\
					        <li><a  class='a-rename'>重命名</a></li>\
					        <li><a  class='a-open'>设为封面</a></li>\
				        </ul> \
			        </div> \
			        </li>".format(Utils.htmlEncode(phoName), phoId, phoRefId, DiskTool.scriptImgError("/m2012/images/global/nopic.jpg")));

                //制作明信片
                if (albumPhoto.postCardExt.indexOf(phoExt + ",") >= 0) {
                    fragment.find(".album-ft ul").append("<li><a  class='a-postcard' title='制作明信片'>明信片</a></li>")
                    .click(function (e) {
                        DiskTool.showPostCard(phoId, true);
                        e.stopPropagation();
                        e.preventDefault();
                    });
                }
                //点击单选框
                var cbSingleClick = function (cb) {
                    var row = $(cb).parent().parent();
                    albumPhoto.Event.clickCheckBoxInRow(cb.checked, cb, row);
                }
                fragment.data("data", this);
                //图片FLASH预览
                fragment.find(".album-bd").click(function () {
                    albumPhoto.action.openImgByFlash(index);
                });
                //浮动层
                fragment.find(".album-bd").parent().hover(
                        function () { $(this).addClass("al-current"); },
                        function () { $(this).removeClass("al-current"); }
                );
                //下载
                fragment.find(".a-download").click(function (e) {
                    albumPhoto.action.down(phoId);
                    e.stopPropagation();
                    e.preventDefault();
                });
                //重命名
                fragment.find(".a-rename").click(function (e) {
                    var url = DiskTool.getRelativeUrl("disk_dialogphotoproperty.html?id={0}&sid={1}&albumName={2}&rd={3}");
                    url = url.format(seqId, albumPhoto.server.getUserInfo(), escape(albumPhoto.tool.getAlbumName()), Math.random());
                    DiskTool.FF.open("图片属性", url, 450, 222, true);
                    e.stopPropagation();
                    e.preventDefault();
                });
                //设为封面
                fragment.find(".a-open").css("display", "none");
                if (albumPhoto.tool.getAlbumId() > 0) {
                    fragment.find(".a-open").click(function (e) {
                        albumPhoto.server.setCover(albumId, coverGuid, phoRefId, function () {
                            DiskTool.FF.alert(albumPhoto.messages.Res_SetFM_Success);
                        });
                        e.stopPropagation();
                        e.preventDefault();
                    }).css("display", "");
                }
                //呈现相片
                table.append(fragment);
            });
            //显示图片缩略图
            albumPhoto.action.getThumbnailImageData();
        }
    },
    /**
    *服务器通信
    **/
    server: {
        getUserInfo: function () {
            var key = "cacheUid";
            if (!window[key]) {
                window[key] = top.UserData.ssoSid;
            }
            return window[key];
        },
        getUserServerIP: function () {
            return window.parent.DiskMainData.UserServerIP;
        },
        getUserIsVIP: function () {
            return window.parent.DiskMainData.IsPhotoVIP;
        },
        //用户电话号码
        getUserNumber: function () {
            return window.parent.DiskMainData.UserNumber;
        },
        //获取文件列表
        getList: function (callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            $.postXml({
                url: albumPhoto.uri.getList(),
                data: XmlUtility.parseJson2Xml({
                    albumId: albumPhoto.tool.getAlbumId()
                }),
                success: function (result) {
                    //处理album数据
                    if (result.code == DiskConf.isOk) {
                        if (callback) { callback.call(result["var"]); }
                    }
                    else { DiskTool.FF.alert(result.summary); }
                },
                error: function (error) {
                    DiskTool.handleError(error);
                }
            });
        },
        //删除文件
        del: function (fileIds, callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            $.postXml({
                url: albumPhoto.uri.getDelUrl(),
                data: XmlUtility.parseJson2Xml({
                    fileIds: fileIds
                }),
                success: function (result) {
                    //处理album数据
                    if (result.code == DiskConf.isOk) {
                        if (callback) { callback.call(); }
                    }
                    else { DiskTool.FF.alert(result.summary); }
                },
                error: function (error) {
                    DiskTool.handleError(error);
                }
            });
        },
        //设置封面
        setCover: function (albumId, coverGuid, refId, callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            $.postXml({
                url: albumPhoto.uri.getSetCover(),
                data: XmlUtility.parseJson2Xml({
                    albumId: albumId.toString(),
                    coverGuid: coverGuid,
                    fileRefId: refId
                }),
                success: function (result) {
                    //处理album数据
                    if (result.code == DiskConf.isOk) {
                        if (callback) { callback.call(); }
                    }
                    else { DiskTool.FF.alert(result.summary); }
                },
                error: function (error) {
                    DiskTool.handleError(error);
                }
            });
        },
        //获取缩略图信息
        getThumbnailImageData: function (fileIds, callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            $.postXml({
                url: albumPhoto.uri.getThumbnailImageUrl(),
                data: XmlUtility.parseJson2Xml({
                    fileids: fileIds,
                    width: 128,
                    height: 96
                }),
                success: function (result) {
                    if (result.code == DiskConf.isOk) {
                        if (callback) { callback.call(result["var"]); }
                    }
                    else { DiskTool.FF.alert(result.summary); }
                },
                error: function (error) {
                    DiskTool.handleError(error);
                }
            });
        },
        //获取图片预览图片数据
        getFlashXML: function (i) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            var flashxml = null;
            $.postXml({
                url: albumPhoto.uri.getImageAllUrl(),
                data: XmlUtility.parseJson2Xml({
                    fileids: albumPhoto.action.getPicFileIds(),
                    sw: 140 + "",
                    sh: 140 + "",
                    bw: 1000 + "",
                    bh: 1000 + ""
                }),
                async: false,
                success: function (result) {
                    if (result.resultCode == DiskConf.isOk) {
                        flashxml = "<root><index>{0}</index>{1}</root>".format(i, result.flashxml);
                    }
                },
                error: function (error) {
                    DiskTool.handleError(error);
                }
            });
            return flashxml;
        },
        //根据文件id获取其分布式下载路径
        getFilePath: function (fileId, fileName, callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            $.postXml({
                url: albumPhoto.uri.getFileDownloadUrl(),
                data: XmlUtility.parseJson2Xml({
                    userNumber: top.UserData.userNumber,
                    fileid: fileId,
                    downName: escape(fileName)
                }),
                async: false,
                success: function (result) {
                    if (result.code == DiskConf.isOk) {
                        if (callback) { callback.call(result["var"]); }
                    }
                    else { DiskTool.FF.alert(result.summary); }
                },
                error: function (error) {
                    DiskTool.handleError(error);
                }
            });
        }
    },
    //工工具类
    tool: {
        //获取相册id
        getAlbumId: function () {
            var albumId = Utils.queryString("id", window.location.href);
            return albumId = albumId ? albumId : 0;
        },
        //获取相册名称
        getAlbumName: function () {
            var albumName = Utils.queryString("name", window.location.href);
            albumName = albumName ? albumName : "";
            return Utils.htmlEncode(unescape(albumName));
        },
        //相册图片集合
        getPhotos: function () {
            return albumPhoto.photos;
        },
        //获取所以选中的图片
        getAllSelectedRow: function (isRow) {
            var row = $("#tbl-fileList>li>div>:checked").parent().parent();
            return isRow ? row : row.map(function () {
                return $(this).data("data");
            });
        },
        //获取彩信发送文件路径参数
        getPathName: function (type) {
            var name = "";
            var maper = {
                audio: "musicpath",
                pic: "imagepath",
                office: "textpath"
            };
            $.each(maper, function (n, v) {
                if (type == n) {
                    name = v;
                    return false;
                }
            });
            return name;
        }
    }
};
//提供外部接口方法，以供其他页面调用
var Toolbar = {
    refreshList: function(refreshPager) {
        //是否重新绘画分页器
        if (typeof refreshPager == "undefined" || refreshPager.constructor != Boolean) {
            refreshPager = true;
        }
        if (refreshPager) {
            DiskTool.getDiskWindow().parent.Event.refreshData(null, 1);
        }
        albumPhoto.action.refreshList(refreshPager);
    }
};
//初始化页面加载信息
albumPhoto.action.pageLoad();
