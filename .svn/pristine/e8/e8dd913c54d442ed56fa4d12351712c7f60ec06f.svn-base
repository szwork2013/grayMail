/*
* Copyright (C) 2011 http://www.richinfo.cn
* 檔案名：      m2011.disk.album.js
* 檔功能描述：  相册集的js功能类,对应myAlbum.html
* 創建人：      lizg  
* 創建日期：    2011/12/21
* 修改人：            
* 修改日期：
* 程式版次： 
* 修改描述：           
*/
var album = {

    //相册的数据组
    albumArr: [],

    flashId: "0",

    //服务器请求相关接口
    url: {
        getAlbumList: function() {
            return DiskTool.resolveUrl("getDiskAlbumList", true);
        },
        //根据相册id获取相册文件信息
        getPhotoList: function() {
            return DiskTool.resolveUrl("getDiskPhotoList", true);
        },
        getDeleteAlbumUrl: function() {
            return DiskTool.resolveUrl("deleteDiskPhoto", true);
        },
        getThumbnailImageUrl: function() {
            return DiskTool.resolveUrl("getthumbnailimage", true);
        },
        getNoPicURL: function() {
            return "/m2012/images/module/disk/disk_no-pic.jpg";
        },
        getErrorPicUrl: function() {
            return "/m2012/images/module/disk/disk_cuowu.gif";
        },
        getPhotoListUrl: function() {
            return "disk_photolist.html?id={0}&name={1}";
        },
        getAlbumPropertyUrl: function() {
            return "disk_dialogalbumproperty.html?sid={0}&id={1}&name={2}&ran={3}";
        }
    },
    //提示语
    messages: {
        Res_UserSizePopedom: "下载出错",
        Res_CheckFile: "请选择可操作的文件",
        Res_UserSize: "尊敬的用户,您好!彩云文件单次打包下载限量为{size}M请您重新选择文件再下载!",
        SendFiveFile: "一次只能发送5个文件,请取消部分文件",
        CanNotSendFolder: "只能快递文件，暂不支持文件夹快递！",
        SendOneMMSFile: "通过彩信发送文件快递只能操作一个文件",
        noFindSid: "该用户不存在",
        serverError: "对不起，加载时出错！请刷新页面！",
        addError: "抱歉，您已经创建了50个相册，无法再创建。",
        downOne: "一次只能下载一个相册!",
        downEmpty: "文件夹为空,不能下载!",
        proEmpty: "请选择一个相册进行操作",
        proOnly: "只能选择一个相册",
        proDefault: "系统默认相册不能进行此操作!",
        delSure: "确定要删除选中的相册?",
        delDefault: "对不起,不能册除系统相册!",
        delOk: "相册删除成功",
        delOnprint: "你选择的相册正在冲印，暂时不能删除",
        Res_Del_Fail_More: "相册下照片过多，请先删除该相册下的照片再删除该相册。",
        delTimeout: "登录超时，请重新登录",
        delError: "系统错误，请稍后重试",
        printTips: "确定要冲印相册“{0}”吗？（只有jpg格式图片才能被冲印）",
        printTipsMuch: "一次最多只能冲印500张照片，请重新选择！",
        printErrorEmpty: "你选择的相册里没有图片，请重新选择",
        printError: "你选择的相册里的没有jpg格式的图片，请重新选择",
        VipUserPrint: "抱歉，该功能仅对广州及深圳的全球通用户开放",
        Empty: "相册名称不能为空",
        MaxLength: "最大长度不能超过20字符",
        InvalidChar: "不能有以下特殊字符 \\/:*?\"<>|",
        previewFileCount: "选择的相册总照片数为0，无法预览"
    },
    //页面相关操作
    action: {
        //页面加载
        pageLoad: function() {
            //加载皮肤
            Utils.loadSkinCss(null, document, "netdisk");
            DiskTool.AddListenScroll();
            $(function() {
                DiskTool.useWait();
                var map = {
                    ablumUpload: album.action.upload,
                    ablumUpload1: album.action.upload,
                    ablumAdd: album.action.addAblum,
                    ablumAdd1: album.action.addAblum,
                    ablumDown: function() { album.action.download(); },
                    ablumDown1: function() { album.action.download(); },
                    ablumDel: album.action.deleteItem,
                    ablumDel1: album.action.deleteItem,
                    slide: album.action.slideFlash,
                    slide1: album.action.slideFlash
                };
                DiskTool.registerAnchor(map, function(val) { return val; });
                album.render.renderAlbum();
            });
        },
        //上传
        upload: function() {
            DiskTool.openUpload(1, 0);
        },
        //新建文件夹
        addAblum: function() {
            if ($(":checkbox").length > 50) {
                DiskTool.FF.alert(album.messages.addError);
                return;
            }
            var url = DiskTool.getRelativeUrl("disk_dialogcreatealbum.html?&sid={0}&ran={1}");
            url = url.format(album.tool.getUserInfo(), Math.random());
            top.FloatingFrame.open("新建相册", url, 450, 100, true);
        },
        //删除相册
        deleteItem: function() {
            var result = album.tool.getAlbumCheck();
            //没有选择要删除的文件夹
            if (result.list.length == 0) {
                DiskTool.FF.alert(album.messages.proEmpty);
                return;
            }
            //删除了系统默认文件夹
            if (result.res != 0) {
                DiskTool.FF.alert(album.messages.proDefault);
                return false;
            }
            //删除操作
            DiskTool.FF.confirm(album.messages.delSure, function() {
                album.action.delAlbum(result.list);
            });
        },
        //册除相册的最终操作,list为相册的编号
        delAlbum: function(list) {
            DiskTool.addDiskBehavior({
                actionId: 34,
                moduleId: 11,
                actionType: 10
            });
            album.server.delAlbum(list, function() {
                Toolbar.refreshList();
            });
        },
        //下载
        download: function(albumId) {
            var checkBox = null;
            var albumName = "";
            var photoCount = 0;
            if (typeof albumId == "undefined") {
                var count = $("input:checkbox:checked").length;
                if (count == 0) {
                    DiskTool.FF.alert(album.messages.proEmpty);
                    return;
                }
                if (count > 1) {
                    DiskTool.FF.alert(album.messages.downOne);
                    return;
                }
                checkBox = $("input:checkbox:checked");
                albumId = checkBox.val();
            }
            if (!checkBox || checkBox.length == 0) {
                checkBox = $(':checkbox[value={0}]'.format(albumId));
            }
            albumName = checkBox.next().find("label").attr("name");
            photoCount = parseInt(checkBox.next().find("label").attr("count"));
            //选择的相册中无相片
            if (!photoCount || photoCount == 0) {
                DiskTool.FF.alert(album.messages.downEmpty);
                return;
            }
            if (photoCount == 1) {//如果只有一张图片则不打包（不传文件名时会自动取文件名)
                albumName = "";
            }
            //获取相册中的所有图片
            album.server.getPhotos(albumId, function() {
                var files = $.map(this.photoList, function(n) {
                    return n.fileId;
                });
                DiskTool.downloadFile(files.join(","), "", albumName, photoCount);
            });
        },
        //播放幻灯片
        slideFlash: function() {
            DiskTool.addDiskBehavior({
                actionId: 7003,
                moduleId: 11,
                actionType: 20
            });
            var sid = album.tool.getUserInfo();
            //var res = encodeURIComponent(DiskTool.getResource());
            //var ucd = encodeURIComponent(top.ucDomain);
            var res = DiskTool.getResource().encode();// update by tkh XSS漏洞
            var ucd = top.ucDomain.encode();
            var url = top.getDomain("rebuildDomain") + "/disk/netdisk/html/albumslide.htm?sid={0}&aid={1}&res={2}&ucd={3}";
            var checkAlbum = album.tool.getAlbumCheck();
            var fileNum = album.tool.getAlbumCheck(true);
            if (fileNum > 0) {
                /*if (checkAlbum.res == 0 && checkAlbum.list.length > 0) {
                album.flashId = checkAlbum.list.split(",")[0];
                }*/
                album.flashId = checkAlbum.list.split(",")[0];
                window.open(url.format(sid, album.flashId, res, ucd));
            } else {
                DiskTool.FF.alert(album.messages.previewFileCount);
                return false;
            }
        }
    },
    //页面数据呈现
    render: {
        //呈现相册列表
        renderAlbum: function() {
            //展开父级页面的相册列表
            if (window.parent.DiskInfo.Data) {
                window.parent.DiskInfo.Action.ExpandAlbum();
            }
            //返回上一级
            $("div.tbl-list-return a").click(window.parent.DiskInfo.Action.ReturnParentDir);

            var cbSelectAll = $.getById("cbSelectAllFile", true);
            var lblSelectAll = $("#lblSelectAllFile,#lblSelectAllFile2");
            cbSelectAll.checked = false;
            lblSelectAll.text("全选");
            //全选/不选
            $(cbSelectAll).click(function() {
                var v = this.checked;
                var title = v ? "不选" : "全选";
                lblSelectAll.text(title);
                $("#album-list>ul").each(function() {
                    var row = $(this);
                    row.find("div>:checkbox").each(function() {
                        if (this.disabled === false) {
                            this.checked = v;
                        }
                    });
                });
            });
            //设置相册文件个数统计信息
            if (window.parent.TiteInfo) {
                window.parent.TiteInfo.setVal(1, $("#lblAlbumCount"));
            }
            //清空单击复选框的缓存
            $("#hidrow").removeData("data");
            $(".album-list>ul").html("");
            //获取相册文件夹列表并展示
            album.server.getAlbumList(function() {
                album.albumArr = this;
                //无数据显示提示信息
                if (album.albumArr.length == 0) {
                    $(".tbl-list-null.").show();
                    return;
                }
                $.each(album.albumArr, function() {
                    //flash首先要显示的相册id
                    if (this.totalCount > 0 && album.flashId == 0) {
                        album.flashId = this.albumId;
                    }
                    album.render.renderAlbumItem(this);
                })
                //显示图片缩略图
                album.render.renderThumbnailImage();
            });
        },
        //相册子项的数据绑定
        renderAlbumItem: function(row) {
            var item = row;
            var shareIc = '<i class="share"/>';
            var isabled = item.albumId == 0 ? "disabled" : "";

            var templat = '<li>\
                                <div class="album-hd"><input type="checkbox" /><a><label></label></a></div> \
                                <div class="album-bd album-bg">\
                                    <p class="img-bd">{0}<span><img filerefid="" alt="" src="/m2012/images/module/disk/disk_loadinfo.gif" /></span></p>\
                                    <div></div>\
                                </div> \
                                <div class="album-ft" > \
                                    <ul> \
                                        <li><a class="a-download">下载</a></li> \
                                        <li><a class="a-share">共享</a></li> \
                                        <li><a class="a-rename">重命名</a></li> \
                                        <li><a class="a-delete">删除</a></li> \
                                    </ul>\
                                </div>\
                            </li>';
            templat = item.isShare == 1 ? templat.format(shareIc) : templat.format("");
            var jq_templat = $(templat);
            //系统默认文件夹特殊处理
            if (item.albumName == "最新上传") {
                item.albumId = 0;
                jq_templat.find("a.a-share").parent().remove();
                jq_templat.find("a.a-rename").remove();
                jq_templat.find("a.a-delete").remove();
            }
            var fragment = jq_templat.attr("id", item.albumId);
            //禁用部分操作项显示
            fragment.find("input:checkbox").val(item.albumId).click(function() {
                album.tool.isDisplay();
            });
            //设置相册标题
            fragment.find("label").text("{0}[{1}]".format(album.tool.cutStr(item.albumName, 16), item.totalCount))
			    .attr("id", item.coverGuid ? "0" : item.coverGuid).attr("name", item.albumName)
				.attr("name", item.albumName).attr("count", item.totalCount);
            //进入相册列表
            fragment.find("div>a").click(function() {
                window.location.href = (album.url.getPhotoListUrl()).format(item.albumId, escape(item.albumName));
            });
            fragment.find("img").attr("filerefid", item.fileRefId).attr("fileid", item.fileId)
				.click(function() {
				    window.location.href = (album.url.getPhotoListUrl()).format(item.albumId, escape(item.albumName));
				}).error(function() {
				    this.src = album.url.getErrorPicUrl();
				});
            fragment.find(".album-bd").click(function() {
                window.location.href = (album.url.getPhotoListUrl()).format(item.albumId, escape(item.albumName));
            });
            //下载
            fragment.find(".album-ft .a-download").click(function() {
                album.action.download(item.albumId)
            });
            fragment.appendTo(".album-list>ul");
            //没有封面则显示无图片图标
            if (!row.fileRefId) {
                $(".img-bd>span>img").attr("src", album.url.getNoPicURL());
            }
            if (item.albumId != 0) {
                //重命名相册
                fragment.find(".album-ft .a-rename").click(function() {
                    var url = album.url.getAlbumPropertyUrl();
                    url = url.format(album.tool.getUserInfo(), item.albumId, escape(item.albumName), Math.random());
                    url = DiskTool.getRelativeUrl(url);
                    FloatingFrame.open("相册属性", url, 450, 223, true);
                });
                //删除相册
                fragment.find(".album-ft .a-delete").click(function() {
                    var confirmMsg = "确定要删除相册'{0}'?".format(item.albumName);
                    DiskTool.FF.confirm(confirmMsg, function() {
                        album.action.delAlbum(item.albumId);
                    });
                });
            }
            else {
                fragment.find(".album-ft .a-rename").css("display", "none");
                fragment.find(".album-ft .a-delete").css("display", "none");
            }
            //光标移到图片上显示相关操作
            fragment.find(".album-bd").parent().hover(
				    function() { $(this).addClass("al-current"); },
				    function() { $(this).removeClass("al-current") }
				);
            //操作共享
            var a = fragment.find(".a-share").click(function(e) {
                DiskTool.addDiskBehavior({
                    actionId: 14,
                    thingId: null,
                    moduleId: 11,
                    actionType: 10,
                    ext1: 1
                });
                //取消所有项的选中状态、选中当前项
                $("#tbl-fileList>li>div>:checked").attr("checked", false);
                fragment.find(":checkbox").attr("checked", "checked");
                var url = DiskTool.getRelativeUrl("disk_dialogsharefile.html");
                top.FloatingFrame.open("好友共享", url, 565, 440, true);
            });
            //缓存数据到Row
            fragment.data("data", item);
        },
        // 呈现缩略图列表 
        renderThumbnailImage: function() {
            var remain = [];
            var remianImgs = []; //没有加载缩略图的图片对象列表
            var images = $(".img-bd>span>img");
            var urls = window.parent.DiskInfo.ThumbImgUrls;
            var fileId = null;
            var refId = null;
            var url = null;
            //先从缓存中获取数据          
            images.each(function() {
                fileId = $(this).attr("fileid");
                refId = $(this).attr("filerefid");
                //无封面时跳过
                if (!fileId || !refId) {
                    return true;
                }
                if (urls && urls[refId]) {
                    $(this).attr("src", urls[refId]);
                } else {
                    remain.push(fileId);
                    remianImgs.push(this);
                }
            });
            //没有缓存的图片则请求服务器获取
            if (remain.length > 0) {
                var fileIds = remain.join(",");
                album.server.getThumbnailImageData(fileIds, function() {
                    var result = this;
                    if (!result) return;
                    $.each(remianImgs, function() {
                        refId = $(this).attr("filerefid");
                        url = result[refId];
                        if (url && url.length > 0) {
                            if (!window.parent.DiskInfo.ThumbImgUrls) {
                                window.parent.DiskInfo.ThumbImgUrls = {};
                            }
                            window.parent.DiskInfo.ThumbImgUrls[refId] = url;
                        }
                        else { url = album.url.getNoPicURL(); }
                        $(this).attr("src", url);
                    });
                });
            }
        }
    },
    //服务器请求
    server: {
        //获取相册文件夹列表
        getAlbumList: function(callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return
            };
            $.postXml({
                url: album.url.getAlbumList(),
                success: function() {
                    //处理album数据
                    if (this.code == DiskConf.isOk) {
                        if (callback) { callback.call(this["var"].albumList); }
                    } else {
                        DiskTool.FF.alert(this.summary);
                    }
                },
                error: function(error) {
                    DiskTool.handleError(error);
                }
            });
        },
        getPhotos: function(albumId, callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            $.postXml({
                url: album.url.getPhotoList(),
                data: XmlUtility.parseJson2Xml({
                    albumId: albumId.toString()
                }),
                success: function(result) {
                    //处理album数据
                    if (result.code == DiskConf.isOk) {
                        if (callback) { callback.call(result["var"]); }
                    }
                    else { DiskTool.FF.alert(result.summary); }
                },
                error: function(error) {
                    DiskTool.handleError(error);
                }
            });
        },
        //获取缩略图信息  
        getThumbnailImageData: function(fileRefIds, callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            $.postXml({
                url: album.url.getThumbnailImageUrl(),
                data: XmlUtility.parseJson2Xml({
                    width: 128,
                    height: 86,
                    fileids: fileRefIds
                }),
                success: function() {
                    if (this.code == DiskConf.isOk) {
                        if (callback) callback.call(this["var"]);
                    } else {
                        DiskTool.FF.alert(result.summary);
                    }
                },
                error: function(error) { DiskTool.handleError(error); }
            });
        },
        //册除相册
        delAlbum: function(list, callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            $.postXml({
                url: album.url.getDeleteAlbumUrl(),
                async: false,
                data: XmlUtility.parseJson2Xml({
                    albumIds: list
                }),
                success: function(result) {
                    if (result.code == DiskConf.isOk) {
                        if (callback) { callback(); }
                    }
                    else {
                        DiskTool.FF.alert(result.summary);
                    }
                },
                error: function(error) {
                    DiskTool.handleError(error);
                }
            });
        }
    },
    //工具类
    tool: {
        //用户sid
        getUserInfo: function() {
            var key = "cacheUid";
            var url = window.parent.location.href;
            if (!window[key]) {
                window[key] = Utils.queryString("sid", url);
            }
            return window[key];
        },
        //获取用户的IP
        getUserServerIP: function() {
            return window.parent.DiskMainData.UserServerIP;
        },
        //用户真正number
        getUserNumber: function() {
            return window.parent.DiskMainData.UserNumber;
        },
        //获取相册文件数
        getAlbumFileCount: function() {
            return window.parent.getAlbumFileCount;
        },
        //获取页面的选中的相册id filenum如果为true，刚表示获取所选文件夹的文件数
        getAlbumCheck: function(fileNum) {
            var checked = [];
            var result = 0 //表示所选文件夹正确;
            var value = null;
            var fileCount = 0;
            $.each($("#album-list :checked"), function() {
                value = $(this).val();
                checked.push(value);
                fileCount += parseInt($(this).parent().find("label").attr("count"));
                if (value == 0) {
                    result = 1;
                    return false;
                }
            });
            if (fileNum) {
                return fileCount;
            } else {
                return { res: result, list: checked.join(",") };
            }
        },
        //刷新列表
        refreshList: function(updateCache) {
            if (typeof updateCache == "undefined" || updateCache.constructor != Boolean) {
                updateCache = true;
            }
            if (updateCache) {
                DiskTool.getDiskWindow().parent.Event.refreshData(null, 1);
            }
            album.render.renderAlbum();
        },
        //获取相册文件夹列表
        getAlbumArr: function() {
            return album.albumArr;
        },
        //剪切字符串
        cutStr: function(str, len) {
            if (!str || !len) {
                return '';
            }
            var a = 0, i = 0, temp = '';
            for (i = 0; i < str.length; i++) {
                a += str.charCodeAt(i) > 255 ? 2 : 1;
                if (a > len) {
                    return temp;
                }
                temp += str.charAt(i);
            }
            return str;
        },
        //操作项目显示而否
        showItem: function(isChecked, arr) {
            var show = "";
            if (!isChecked) {
                $.each(arr, function(i) {
                    $.disableElement($("#" + arr[i]));
                })
            }
            else {
                $.each(arr, function(i) {
                    $.enableElement($("#" + arr[i]));
                })
            }
        },
        isDisplay: function() {
            if ($("#album-list :checked").length > 0) {
                album.tool.showItem(true, ["ablumDown", "ablumDel", "ablumShare", "ablumMod", "ablumPrint", "ablumDown1", "ablumDel1", "ablumShare1", "ablumMod1", "ablumPrint1"]);
            }
            if ($("#album-list :checked").length >= 2) {
                album.tool.showItem(false, ["ablumMod", "ablumDown", "ablumPrint", "ablumMod1", "ablumDown1", "ablumPrint1"]);
            }
            if ($("#album-list :checked").length == 0) {
                album.tool.showItem(false, ["ablumDown", "ablumDel", "ablumShare", "ablumMod", "ablumPrint", "ablumDown1", "ablumDel1", "ablumShare1", "ablumMod1", "ablumPrint1"]);
            }
            if ($("#album-list :checked").val() == 0) {
                album.tool.showItem(false, ["ablumDel", "ablumShare", "ablumMod", "ablumDel1", "ablumShare1", "ablumMod1"]);
            }
        },
        //验证相册文件夹名称合法性
        validateAlbumName: function(name) {
            name = name ? $.trim(name) : "";
            if (name.length == 0) {
                return album.messages.Empty;
            }
            //查看长度
            if (name.length > 20) {
                return album.messages.MaxLength;
            }
            return DiskTool.validateName(name);
        },
        //获取选中的所有相册
        getAllSelectedRow: function(isRow) {
            var row = $("#tbl-fileList>li>div>:checked").parent().parent();
            return isRow ? row : row.map(function() {
                return $(this).data("data");
            });
        }
    }
};
////提供接口给外部页面调用
var Toolbar = {
    //刷新当前列表
    refreshList: function(updateCache) {
        album.tool.refreshList(updateCache);
    }
}
//调整页面宽度
function onresizewidth() {
    //自动调整宽度
    var listwidth = $("#album-list").width();
    if (parseInt(listwidth) > 800) {
        $("#album-list ul").css("width", "800");
    }
}
//页面初始化
album.action.pageLoad();