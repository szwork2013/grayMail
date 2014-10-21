var ShowMsg = {
    NoKeyword: "请输入搜索关键字!",
    DefauleKeyword: "查找文件",
    CheckOneFile: "请选择至少一个可操作的文件",
    CheckOneDown: "一次只能下载一个文件",
    CanNotCopyAlbum: "不能复制相册",
    MoveSuccess: "复制成功",
    MoveFailure: "复制操作失败",
    HaveSameName_Fail: "复制失败：以下文件已存在于目标文件夹,请重新选择！",
    NoSelectedFile: "您未选择任何文件",
    ExceedMobileFileSize: "选择的文件不能大于5M",
    ImageCanNotCopy: "只有图片文件才能移动到“我的相册”中！",
    MusicCanNotCopy: "只有音乐文件才能移动到“我的音乐”中！",
    DiskSizeFull: "彩云空间，请重新选择文件！",
    CanNotCopy: "此文件无法确认格式，不能复制",
    CanNotCopyFolder: "抱歉，暂时不支持文件夹的复制！",
    MoreTenCopy: "一次最多只能复制10个文件！",
    Res_DownMore: "您选择了打包下载:\n{sname}\n确定要打包下载吗?",
    Res_UserSize: "尊敬的用户,您好!彩云文件单次打包下载限量为{size}M请您重新选择文件再下载!",
    Res_UserSizePopedom: "您无权进行下载",
    DeletedSuccessed: "删除成功",
    Res_Del_Fail: "删除失败，请稍后再试。",
    CancelShare: "您选择的文件已被分享者取消了",
    Cancel_1: "确定要取消分享吗？取消后好友将无法下载该文件。",
    Cancel_2: "确定要删除吗？",
    CancelShareSuccess: "文件分享已成功取消!",
    DelCancel: "您真的确定要取消文件 [{0}] 对 [{1}] 的分享吗?",
    MoveFileSuccess: "转存彩云网盘成功!",
    HaveSameNameFile: "已存在同名的文件/文件夹!"
};
var disk_My_Music = "/彩云网盘/我的音乐";
var disk_My_Ablum = "/彩云网盘/我的相册";
var Url_DiskFInfo = DiskTool.resolveUrl("friendShareList", true); //获取好友共享的文件列表
var Url_DiskMInfo = DiskTool.resolveUrl("myShareList", true); //获取我的共享列表
var sid = top.UserData.ssoSid;
var userShareCount = 0;
var usernumber = top.UserData.userNumber;

var DiskShare = {
    model: {
        curDirId: "", // 默认进来为根目录
        thumbnailSize: "50*50",
        shareList: [], // 分享列表数据
        curDirPath: "00019700101000000001",
        checkboxNum: 0, // 选择文件(夹)个数
        pageIndex: 1,
        pageSize: 10, // 每页文件个数

        // 排序种类
        sortActionData: {
            "date-asc"  : {type: "date", thingId: 2, status: 1, rename: "date-desc"},
            "date-desc" : {type: "date", thingId: 1, status: 0, rename: "date-asc"},
            "name-asc"  : {type: "name", thingId: 6, status: 1, rename: "name-desc"},
            "name-desc" : {type: "name", thingId: 2, status: 0, rename: "name-asc"},
            "size-asc"  : {type: "size", thingId: 4, status: 1, rename: "size-desc"},
            "size-desc" : {type: "size", thingId: 3, status: 0, rename: "size-asc"},
            "type-asc"  : {type: "type", thingId: 5, status: 1, rename: "type-desc"},
            "type-desc" : {type: "type", thingId: 5, status: 0, rename: "type-asc"}
        },

        init: function(){
            var path = Utils.queryString("Path");
            path && (this.curDirPath = path);
        },

        getFileById: function (id) {
            var self = this;
            var shareList = self.shareList;

            for (var i = 0, len = shareList.length; i < len; i++) {
                var item = shareList[i];
                if (item.shareObjId == id) {
                    return item;
                }
            }

            return {};
        },

        isRootDir: function(){
            return !Utils.queryString("DirectoryID");
        },

        isMyShare: function(){
            return PageMode() == "0";
        },

        //获取图片下载地址
        getDownloadUrl: function (fileItem, sucCallback, errCallback) {
            /*if (PageMode() == 0) {//我的共享，传递当前用户号码
                var shareNumberPre = Utils.queryString("SN") == null ? fileItem.sharer : Utils.queryString("SN");
            } else {//好友共享，传递共享者的用户号码
                var shareNumberPre = Utils.queryString("RN") == null ? fileItem.sharer : Utils.queryString("RN");
            }*/
            //预览附件
            DiskTool.addDiskBehavior({
                actionId: 7012,
                thingId: 0,
                moduleId: 11,
                actionType: 20
            });
            var downcgiurl = DiskTool.resolveUrl('download', true);
            $.postXml({
                url: downcgiurl,
                data: XmlUtility.parseJson2Xml({
                    directoryIds: "",
                    fileIds: fileItem.shareObjId.toString(),
                    isFriendShare: 1,
                    path: DiskShare.model.curDirPath
                }),
                timeout: 120000,
                async: false,
                success: function (data) {
                    if (data.code == "S_OK") {
                        sucCallback(data['var'].url);
                    } else {
                        errCallback(data.summary);
                    }
                },
                error: function (err) {
                    errCallback(err);
                }
            });
        },

        // 获取页面数
        getPageCount: function(){
            return Math.ceil(this.shareList.length / 10);
        }
    },
    view: {
        sortHtml: {
            "1": '<em class="downRinking">↑</em>',
            "0": '<em class="downRinking">↓</em>'
        },

        init: function (options) {
            this.model = options.model;
            this.model.init();
        },

        bindEvent: function(){
            AddListenScroll();

            //全选
            $("#cbSelectAllFile").click(function() {
                var v = this.checked;
                var count = 0;

                $("#tblist>tr").each(function() {
                    var row = $(this);
                    var checkboxElem = row.find("td>:checkbox")[0];

                    if (checkboxElem.disabled === false) {
                        if (checkboxElem.checked != v) {
                            checkboxElem.checked = v;
                            renderCheckedRow(v, row);
                        }
                    }
                    count++;
                });
                clickCheckBoxAll(v, count);
                if (v) {
                    $("#lblSelectAllFile").text("不选");
                } else {
                    $("#lblSelectAllFile").text("全选");
                }
            });
            $("#btnSelect").click(searchKeyWord);
            $("#btnDown").click(function() {
                download('0', '0', '0', '0');
            });
            $("#btnDown2").click(function() {
                download('0', '0', '0', '0');
            });
            $("#btncancel").click(function() {
                cancelshare(1);
            });
            $("#btncancel2").click(function() {
                if (!this.disabled) {
                    cancelshare(1);
                }
            });
            $("#btnAllFriends").click(showFriends);
            //搜索
            $("#txtKeyWord").keyup(function (e) {
                if (e.keyCode == 13) {
                    searchKeyWord();
                }
                //e.preventDefault();
            }).focus(function () {
                    if (this.value == this.getAttribute("defaultValue")) {
                        this.value = "";
                    }
            }).blur(function () {
                if (this.value == "") {
                    this.value = this.getAttribute("defaultValue");
                }
            });

            //排序
            var sortClick = function(ctl, field, initialIsAsc) {
                var ctl = $(ctl);
                ListPager.Filter.sortData(field, initialIsAsc);

                //箭头
                $("span.t-arrow").html("");
                ctl.find("span.t-arrow").html(ListPager.Filter.isAsc ? "↑" : "↓");

                //返回第一页
                ListPager.Render.renderPager(null, 0);
                ListPager.Render.renderList(ListPager.Filter.getData());
            };
            //设定每列排序
            $("#sort2>thead>tr>th.t-type").click(function() {
                sortClick(this, "type", true);
            });
            $("#sort2>thead>tr>th.t-name").click(function() {
                sortClick(this, "name", true);
            });
            $("#sort2>thead>tr>th.t-date").click(function() {
                sortClick(this, "date", false);
            });
            $("#sort2>thead>tr>th.t-size").click(function() {
                sortClick(this, "size", true);
            });

            //返回上一级
            $(".tbl-list-return a").click(function() {
                window.history.go(-1);
                return false;
            });

            $("#sortMenus").click(function(e){
                DiskShare.view.shareHandle(e);
            });
        },

        //共享资源页面加载
        render: function(){
            var self = this;

            $(function() {
                DiskTool.useWait();

                // 事件绑定
                self.bindEvent();

                var pagemode = PageMode();

                $("#cbSelectAllFile").attr("checked", false);
                $("#lblSelectAllFile").text("全选");

                //页面为好友共享时，初始化复制到功能
                if (PageMode() == "1") {
                    if (Utils.queryString("id") != null) {
                        window.parent.DiskInfo.Action.Expand(3, Utils.queryString("id"));
                    } else {
                        window.parent.DiskInfo.Action.Expand(3, 0);
                    }

                    //复制到到按钮
                    $("#btnCopy").click(function() {
                        showCopyTo(this);
                    });
                    $("#btnCopy2").click(function() {
                        showCopyTo(this);
                    });

                    //getAllDirectory();
                    $.disableElement($("#btnCopy"));
                } else {
                    if (Utils.queryString("id") != null) {
                        window.parent.DiskInfo.Action.Expand(4, Utils.queryString("id"));
                    } else {
                        window.parent.DiskInfo.Action.Expand(4, 0);
                    }
                }
                if (Utils.queryString("id") != null && Utils.queryString("id") != "") {
                    showFriends(Utils.queryString("id"), null);
                } else {
                    loadMyShareInfo('loadMyShareInfo', sid, pagemode);
                    //loadMyFriendList('getmyfriendlist', sid, pagemode);
                }

                $.disableElement($("#btnDown"));
                $.disableElement($("#btncancel"));

                //在我的共享根目录下不显示“返回上级”链接，而进入下级目录时则显示并将“取消共享”按钮隐藏
                if (Utils.queryString("DirectoryID")) {
                    $("div.tbl-list-return").show();
                    $("#btncancel").hide();
                    $("#btncancel2").hide();
                //    $("#btnCopy").hide();
                    $("#btnCopy2").hide();
                } else {
                    $("div.tbl-list-return").hide();
                }

                DiskShare.UI.menu({
                    btnElem: $(".diskSortTitle"),
                    menuElem: $("#sortMenus")
                });
            });
        },

        shareHandle: function (e) {
            var self = this;
            var target = e.target;
            var $target = $(target);
            var liElem = $target.parents("li");

            if (liElem.length > 0) {
                var currentSort = self.model.sortActionData[liElem.attr("name")];

                DiskTool.addDiskBehavior({
                    actionId: 7038,
                    thingId: currentSort.thingId,
                    moduleId: 14,
                    actionType: 20
                });
                $("#sortMenus li").removeClass("cur").find("em").remove();
                liElem.addClass("cur")
                    .find("span").append(self.sortHtml[currentSort.status]);
                self.sortPannelClick(currentSort.type, currentSort.status);
                liElem.attr("name", currentSort["rename"]);
            }
        },

        //排序
        sortPannelClick : function(field, initialIsAsc) {
            ListPager.Filter.sortData(field, initialIsAsc, true);
            //箭头
            $("span.t-arrow").html("");
            $("#sort2>thead>tr>th.t-" + field).find("span.t-arrow").html(initialIsAsc ? "↑" : "↓");

            //返回第一页
            ListPager.Render.renderPager(null, 0);
            ListPager.Render.renderList(ListPager.Filter.getData());
            $("#sortMenus").hide();
        },

        // 创建分页
        createPager: function() {
            var self = this;
            var pagerContainer = $("#filelist_pager");

            pagerContainer.html("");

            //先清除
            var pageCount = this.model.getPageCount();

            //生成分页
            this.pager = M2012.UI.PageTurning.create({
                styleTemplate : 2,
                container : pagerContainer,
                pageIndex : self.model.pageIndex,
                maxPageButtonShow : 5,
                pageCount : pageCount
            });
            this.pager.on("pagechange", function(index) {
                self.model.pageIndex = index;
				$("#cbSelectAllFile").attr("checked", false);
				$("#btnDown").show();
				$("#btnCopy").show(); //临时加
				DiskShare.model.checkboxNum = 0;
                var pageSize = self.model.pageSize;
                ListPager.Render.renderList(self.model.shareList.slice((index - 1) * pageSize, index * pageSize));
            });
        }
    }
};

DiskShare.UI = {
    /*
     * 弹出菜单
     * @param {Object} options {btnElem: jQDom, menuElem: jQDom}
     */
    menu: function (options) {
        var btnElem = options.btnElem;
        var menuElem = options.menuElem;

        //点击按钮显示面板
        btnElem.click(function(e){
            var btnElemOffset = btnElem.offset();

            menuElem.css({
                left: btnElemOffset.left - (menuElem.outerWidth() - btnElem.outerWidth()),
                top: btnElemOffset.top + btnElem.height() + 5
            }).show();

            return false;
        });

        //点击页面隐藏面板
        $(document).click(function() {
            menuElem.hide();
        });
    }
};

DiskShare.view.init({model: DiskShare.model});
DiskShare.view.render();

if (!top.SiteConfig.isDiskDev) {
    var serviceIP = window.parent.DiskMainData.UserServerIP;
}

function GetThumbnailImageUrl() {
    return DiskTool.resolveUrl('getthumbnailimage', true);
}
function GetNoPicURL() {
    return "/m2012/images/module/disk/disk_no-pic.jpg";
}
function getGetThumbnailImageData(fileIds) {
    /*界面超时处理*/
    if (Utils.PageisTimeOut(true)) return;
    $.postXml({
        url: GetThumbnailImageUrl(),
        data: XmlUtility.parseJson2Xml({
            fileids: fileIds,
            width: 50,
            height: 50
        }),
        success: function(result) {
            if (result.code != 'S_OK') {
                //服务器抛出异常
                DiskTool.FF.alert(result.summary);
            } else {
                var img = $(".thumbnail>img");
                $(".thumbnail>img").each(function() {
                    var url = null;
                    var imgid = $(this).attr("filerefid");
                    if (window.parent.DiskInfo) {
                        url = window.parent.DiskInfo.ImgShare[imgid];
                    }
                    if (url == null) {
                        url = result['var'][imgid];
                        if (window.parent.DiskInfo) {
                            window.parent.DiskInfo.ImgShare[imgid] = url;
                        }
                    }
                    if (url != null) {
                        $(this).attr("src", url);
                    }
                });
            }
        },
        error: function(error) {
            DiskTool.handleError(error);
        }
    });
}
ListPager.Filter.sortData = function(field, initialIsAsc, isUnReverse) {
    var isAsc = false;
    if (ListPager.Filter.order == field && !isUnReverse) {
        isAsc = !ListPager.Filter.isAsc;
    } else {
        ListPager.Filter.order = field;
        isAsc = initialIsAsc;
    }
    //此处处理是同步页面上排序链接按钮的样式
    $("#sortMenus a").removeClass("current");
    if (isAsc) {
        $("#" + field + "-asc").addClass("current");
    } else {
        $("#" + field + "-desc").addClass("current");
    }
    ListPager.Filter.isAsc = isAsc;
    var data = ListPager.Filter.getAllData();
    if (data != null && data.length > 0) {
        data.sort(function(x, y) {
            //文件夹永远放在前面
            /*if (x.shareFlag != y.shareFlag) {
                if (x.shareFlag == 0) {
                    return 1;
                } else if (y.shareFlag == 0) {
                    return -1;
                }
                if (x.shareFlag == 1) {
                    return 1;
                } else if (y.shareFlag == 1) {
                    return -1;
                }
                return -1;
            }*/
            var compareVal = 0;
            switch (ListPager.Filter.order) {
                //名称                     
                case "name":
                    {
                        compareVal = x.shareObjName.localeCompare(y.shareObjName);
                        break;
                    }
                    //类型
                case "type":
                    {
                        compareVal = DiskTool.getFileExtName(x.shareObjName).localeCompare(DiskTool.getFileExtName(y.shareObjName));
                        break;
                    }
                    //时间
                case "date":
                    {
                        //compareVal = Utils.parseDate(x.createTime.replace(new RegExp("-", "g"), ".")) - Utils.parseDate(y.createTime.replace(new RegExp("-", "g"), "."));
                        compareVal = x.shareTime.localeCompare(y.shareTime);
                        break;
                    }
                    //大小
                case "size":
                    {
                        compareVal = x.shareFileSize - y.shareFileSize;
                        break;
                    }
            }
            compareVal = compareVal * (isAsc ? 1 : -1);
            return compareVal;
        });
    }
};

ListPager.Render.renderList = bindsharelist;

//选单行的Checkbox的时候
function clickCheckBoxInRow(checked, cb, row) {
    renderCheckedRow(cb.checked, row);
    clickCheckBoxAll();
}
function renderCheckedRow(checked, row) {
    var btnDown = $("#btnDown");
    var btncancel = $("#btncancel");
    var btnSelectAll = $("#cbSelectAllFile");
    var isRootDir = DiskShare.model.isRootDir();
    var isMyShare = DiskShare.model.isMyShare();

    if (!row.find("td>:checkbox").attr("disabled")) {
        if (checked) {
            if (!row.hasClass("t-checked2")) {
                row.addClass("t-checked2");
            }

            // 选择文件超过1个时，屏蔽掉下载取消按钮
            if (++DiskShare.model.checkboxNum > 1) {
            //    isRootDir && btnDown.hide();
				btnDown.hide();
				$("#btnCopy").hide();//临时加
                isMyShare && btncancel.hide();

                // 只对我的共享中选择文件超过1个时，屏蔽全选按钮；全选的时候，不禁用全选按钮
                if (DiskShare.model.checkboxNum < DiskShare.model.pageSize && isMyShare) {
                    btnSelectAll.attr("disabled", true);
                }
            }
        } else {
            if (row.hasClass("t-checked2")) {
                row.removeClass("t-checked2");
            }
            if (--DiskShare.model.checkboxNum <= 1) {
                isRootDir && btnDown.show();
				$("#btnCopy").show(); //临时加
                isMyShare && btncancel.show();
                btnSelectAll.attr("disabled", false);
            }
        }
    }
}
function clickCheckBoxAll() {
    var allChecked = $("#tblist>tr>td").find(":checked");
    var selectCount = allChecked.length;
    /*if (selectCount == 0) {
        $.disableElement($("#btnDown"));
        $.disableElement($("#btnCopy"));
        $.disableElement($("#btncancel"));
    } else {
        $.enableElement($("#btnDown"));
        $.enableElement($("#btnCopy"));
        $.enableElement($("#btncancel"));
    }*/
}
function getajax(url) {
    var result = "";
    try {
        result = $.ajax({ url: url, async: false }).responseText;
    } catch (e) {
        result = "";
    }
    return result;
}
/**
*根据专辑id取得专辑所属的相册或音乐id
*comefrom: 1-相册; 2-音乐
*/
function GetFileListByAlbum(comefrom, albumId, shareUserNumber) {
    var fileIds = "";
    if (comefrom == '1') {
        $.postXml({
            url: "/ajax/getImgList.ashx",
            async: false,
            data: XmlUtility.parseFromJson({ albumid: albumId, sid: sid, shareUserNumber: shareUserNumber }),
            success: function(data) {
                fileIds = data.resultData.join(",");
            }
        });
    } else if (comefrom == '2') {
        var para = {
            name: sid,
            clear: "false",
            cid: albumId,
            clsinfo: "false",
            shareUserNumber: shareUserNumber
        };
        $.postXml({
            url: "/ajax/GetMusicList.ashx",
            async: false,
            data: XmlUtility.parseFromJson(para),
            success: function(result) {
                $.each(result.resultData.File.Rows, function() {
                    if (fileIds == "")
                        fileIds = this.FILEID;
                    else
                        fileIds += "," + this.FILEID;

                });
            }
        });
    }
    return fileIds;
}
/**
*当下载文件时，shareFlag为0，为文件夹时，shareFlag为1
*comeFrom(数据来源)0：文件或文件夹；1：相片；2：音乐
*/
function download(comefrom, shareFlag, fileid, usernumber) {
    var fileList = '';
    var fileidList = '';
    var isOnlyFile = true;
    var selectCount = $("#tblist input:checked").length;
    var fileItem = {};
    var filePath = "";

    if (selectCount > 1) return; // 一次下载一个文件

    if (fileid == "0" && selectCount == 0) {
        DiskTool.FF.alert(ShowMsg.CheckOneFile);
        return;
    }
    if (fileid == "0") {
        var fileType;
        $("#tblist input:checked").parent().find(":hidden").each(function() {
            fileType = this.value.split("|")[0];
            if (fileType == "0") {
                isOnlyFile = false;
            }
            fileType = fileType == "1" ? "0" : "1";
            fileid = this.value.split("|")[1];
            comefrom = this.value.split("|")[2];

            fileItem = DiskShare.model.getFileById(fileid);
            filePath = fileItem.path || "";
            fileList += fileid + "," + fileType + "," + comefrom + "," + filePath + "|";
            fileidList += fileid + ",";
        });
        //去除最后一个|
        fileList = fileList.length > 0 ? fileList.substring(0, fileList.length - 1) : "";
        fileidList = fileidList.length > 0 ? fileidList.substring(0, fileidList.length - 1) : "";
    } else {
        fileItem = DiskShare.model.getFileById(fileid);
        filePath = fileItem.path || "";
        fileList = fileid + "," + shareFlag + "," + comefrom + "," + filePath;
        fileidList = fileid;
    }
    var fileArr = fileList.split('|');
    if (fileArr.length > 1 || shareFlag == "1") {
        isOnlyFile = false;
    }
    //用户点击下载行为收集 
    DiskTool.addDiskBehavior({
        actionId: 7038,
        thingId: 0,
        moduleId: 25,
        actionType: 20
    });
    /*if (PageMode() == "1") {//“好友共享”下载与登录页面文件提取一致。
        updateReadCount(sid, fileidList); //好友共享页面：点击下载，修改为已读状态。
    }*/
    var downName = '';
    if (selectCount > 1 && fileid == "0") {// 打包下载
        downName = PageMode() == "1" ? "好友分享" : "我的分享";
    } else if (selectCount == 0 && fileid != '0') {//单文件下载
        selectCount = 1;
    }
    if (fileList == "" && folderList == "") {
        DiskTool.FF.alert("您所选择的文件或文件夹大小为0，不能下载!");
    } else {
        newShareDownload(fileList, isOnlyFile);
    }
}
function updateReadCount(sid, fileList) {
    Share.submitData({
        fileIds: fileList
    }, function(data) {
        if (data != null && data.code == 'S_OK') {
            try {
                if (data.notReadCount > 0) {
                    window.parent.$("#sp_sharefilecount").show();
                    window.parent.$("#sp_sharefilecount").html("(" + data.notReadCount + ")");
                    window.parent.$("#aMainFriendShare").attr("title", "您新收到" + data.notReadCount + "个分享文件");
                } else {
                    window.parent.$("#aMainFriendShare").attr("title", "");
                    window.parent.$("#sp_sharefilecount").hide();
                }
                var arrlist = fileList.split(',');
                $.each(arrlist, function(index, id) {
                    if (id != null && id != '') {
                        $("#tblist>tr").each(function() {
                            var row = $(this);
                            if (row.attr("id") == "tr" + id)
                                row.removeClass("no-read");
                        });
                    }
                });
                if (top.diskUI != null) {
                    top.diskUI.refreshDiskCount(data.notReadCount);
                }
                window.parent.Event.refreshData();
            } catch (e) { }
        }
    }, 'updateReadSate');
}
//加载共享列表
function loadMyShareInfo(ajaxtype, userId, modetype) {
    var shareNumber = Utils.queryString("SN");
    var sendData = {
        directoryId: Utils.queryString("DirectoryID")
    };

    if (PageMode() == "1") {
        sendData.path = Utils.queryString("Path");
    }
    Share.getDiskList(modetype, sendData, function(data) {
        if (data.code != 'S_OK') {
            DiskTool.FF.alert(data.summary);
        } else {
            if (data['var'].shareList != null) {
                if (data['var'].shareList.length > 0) {
                    $("#d_page").hide();
					$("#tbl-list").show();
					$("#toolBar").show();
                    $("#shareh3").show();
                } else {
                    $("#d_page").show();
					$(".appendixList.p_relative").hide();
					$("#tbl-list").hide();
					$("#toolBar").hide();
                    $("#shareh3").hide();
                }
				var tmpdata = data['var'].shareList;
				var s = [];
				$.each(tmpdata, function(i){
					if(this.shareObjName == "云享四川"){
						s = tmpdata.splice(i,1);
						top.yunxiangsichuan = true;
					}
				});
				if(s.length != 0){
					tmpdata.unshift(s[0]);
				}
                showPage(tmpdata);
				//    showPage(data['var'].shareList);
				$("#tblist input[type='checkbox']").click(function(){
					var length = $("#tblist input:checked").length;
					var length2 = $("#tblist input[type='checkbox']").length;
					if(length == length2){
						$("#cbSelectAllFile").attr("checked",true);
					}else{
						$("#cbSelectAllFile").removeAttr("checked");
					}
				});
				$("#tblist tr").hover(function(){
					if($(this).hasClass("t-checked2")){
						return;
					}
					$(this).addClass("t-hover");
				},function(){
					$(this).removeClass("t-hover");
				});
				//点击“云享四川”的统计
				$("#tblist").find("a[title='云享四川']").click(function(){
					BH("yunxiangsichuan");
				});
            } else {
                $("#d_page").show();
				$(".appendixList.p_relative").hide();
            }
        }
    });
}
function showPage(data, page) {
    $("#d_page").hide();
    $("#tblist").empty();
    if (!page) { page = 0; }
    //呈现分页器
    ListPager.Filter.setData(data, page);
    ListPager.Filter.initialize = true;
    ListPager.Render.initialPager();
    ListPager.Render.renderPage(page);
    ListPager.Render.renderList(ListPager.Filter.getData());

    if (data.length == 0) {
        $("#d_page").show();
		$(".appendixList.p_relative").hide();
		$("#tbl-list").hide();
		$("#toolBar").hide();
    }
    userShareCount = data.length;
    if (PageMode() == "1") {
        $(".crumb").html("<strong>好友分享：</strong>(共" + userShareCount + "个文件)");
    } else {
        $(".crumb").html("<strong>我的分享：</strong>(共" + userShareCount + "个文件)");
    }
}
/*加载好友列表(重复功能，先去掉)
function loadMyFriendList(ajaxtype, userId, modetype) {
$("#myfriend").empty();  
Share.getDiskList({
shareUserNumber: ""
}, function(data){            
if(data.code != "S_OK"){
DiskTool.FF.alert(data.errorMsg);
} else {
if(data.resultData != null && data.resultData.Rows.length > 0) { 
$.each(data.resultData.Rows,function(){
var list = this;
var showMobile = modetype == '0' ? list.recvUserNumber : list.shareUserNumber;
var mobile = NumberTool.remove86(showMobile);
var shareList = top.Contacts.getSingleContactsByMobile(showMobile,true);
var addressName = shareList!=null?shareList.name:mobile;
var fragment = $("<li><i class='i-vcard'></i><a href='javascript:void(0);'></a></li>");
fragment.find("a").text(addressName)
.attr("title",mobile)
.click(function(e){
showFriends(showMobile, this);
e.stopPropagation();
e.preventDefault();
});
$("#myfriend").append(fragment);
});
} else {
$("#myfriend").append("无共享的好友"); 
}
}
});
$("#hidfriendid").val("");
}*/
//接口地址
var Share = {
    submitData: function (data, handleResult, commonName) {
        jQuery.postXml({
            url: DiskTool.resolveUrl(commonName, true),
            data: XmlUtility.parseJson2Xml(data),
            success: handleResult
        });
    },
    getDiskList: function (modetype, data, callback) {
        var resultUrl = Url_DiskFInfo;
        if (modetype == 0) {
            resultUrl = Url_DiskMInfo;
        }
        jQuery.postXml({
            url: resultUrl,
            data: XmlUtility.parseJson2Xml(data),
            success: function (result) {
                var json = result["var"]["shareList"];
//                ListPager.Filter.allFiles = result;
                callback(result);
                DiskShare.model.shareList = json;
                // 创建分页
                DiskShare.view.createPager();
            },
            error: function (error) {
                DiskTool.handleError(error);
            }
        });
    }
};
function CheckRepeatFile(dirId) {
    var fileName = "";
    $("#tblist input:checked").parent().parent().find(".t-name").each(function() {
        fileName += $(this).find("a").attr("title") + ":";
    });

    if (fileName && fileName.length > 0)
        fileName = fileName.substring(0, fileName.length - 1);
    var RepeatName = "";
    var result = "";
    try {
        result = $.ajax({
            url: "/ajax/CheckFileName.ashx",
            processData: false,
            type: 'POST',
            dataType: 'xml',
            data: XmlUtility.parseFromJson({ name: sid, did: dirId, filelist: fileName }),
            async: false
        });
        result = eval("(" + result.responseText + ")");
    } catch (e) {
        DiskTool.FF.alert(e.message);
        return "1";
    }
    //处理正确信息                  
    if (result.code == "S_OK") {
        RepeatName = result.resultData;
    } else {
        //服务器抛出异常
        DiskTool.FF.alert(result.summary);
    }
    return RepeatName;
}
/**
* 打开共享复制到窗口
* 此处使用移动到公用组件
*/
function showCopyTo(ele) {
    var directoryID = Utils.queryString("DirectoryID");
    var fileIds = [];
    var folderIds = [];
    var exts = [];
    var msg = "";
    var names = [];
	var contentInfos = "";
	var filetype = "";

    if ($("#tblist input:checked").length == 0) {
        DiskTool.FF.alert(ShowMsg.CheckOneFile);
        return;
    }
    $("#tblist input:checked").parent().find(":hidden").each(function() {
        var srcName = $(this).parent().parent().find(".t-name a").attr("title");
        names.push(srcName);
        var ext = DiskTool.getFileExtName(srcName);
        if (ext == null || ext == "" || ext.length == 0) {
		//暂时支持文件夹
        //    msg = ShowMsg.CanNotCopyFolder;
        //    return;
        }
        exts.push(ext);
        if (this.value.split("|")[0] != "1") {
        //暂时支持文件夹
		//    msg = ShowMsg.CanNotCopyFolder;
        //    return;
        }
		this.value.split("|")[0] == 0 ? filetype = "folder" : filetype = "file";
		contentInfos = $(this).attr("path");
        fileIds.push(this.value.split("|")[1]);
    });

    if (msg != "") {
        DiskTool.FF.alert(msg);
        return;
    }
    //文件ID 
    var fileId = fileIds.join(",");
    //文件夹ID
    var folderId = folderIds.join(",");
    //扩展名
    var extList = exts.join(",");
    var url = "/m2012/html/disk/disk_dialogmove.html?sid=" + sid;
    url += "&fileId=" + fileId;
    url += "&folderId=" + folderId;
    url += "&extList=" + extList;
    url += "&rootDirId=" + 0;
    url += "&type=3"; //此处3标识来自复制到
    if (ele) {
        ele.blur();
    }
    var moveToDiskview = new top.M2012.UI.Dialog.SaveToDisk({
    //    fileName: names.join(","),
        data : getDataNew(),
        type : 'shareCopy'
    });
    moveToDiskview.render();
	function getDataNew(){
		var contentInfosType = "";
		filetype == "folder" ? contentInfosType = "catalogInfos" : contentInfosType = "contentInfos";
		return [contentInfosType, contentInfos];
	}
    function getData(){
        var data = {
            fileIds: fileId,
            directoryIds: folderId,
            path: DiskShare.model.curDirPath
        };
        return data;
    }
    //window.DiskTool.FF.open("复制到", url, 330, 321, true);
}
/*
* 好友共享 "复制到"
* 老版共享复制到代码 现在不使用
*/
function shareCopyTo(dirID, itemtype, dirName) {
    var mlist = "";
    var msg = "";
    var extList = "";
    if ($("#tblist input:checked").length > 0) {
        //不能复制10个以上
        if ($("#tblist input:checked").length > 10) {
            DiskTool.FF.alert(ShowMsg.MoreTenCopy);
            return;
        }
        //验证复制音乐和图片
        $("#tblist input:checked").parent().find(":hidden").each(function() {
            var srcName = $(this).parent().parent().find(".t-name a").attr("title");
            var ext = DiskTool.getFileExtName(srcName);
            if (ext == null || ext == "" || ext.length == 0) {
                msg = ShowMsg.CanNotCopy;
                return;
            } else {
                extList += ext + ",";
            }
            if (itemtype != "file") {
                //复制到我的相册或者我的音乐   
                var filetype = DiskTool.getExtType(ext);
                if (itemtype == "image" && filetype != "pic") {
                    msg = ShowMsg.ImageCanNotCopy;
                    return;
                }
                if (itemtype == "music" && filetype != "audio") {
                    msg = ShowMsg.MusicCanNotCopy;
                    return;
                }
            }
            if (this.value.split("|")[0] == "1") {
                mlist += this.value.split("|")[1] + ",";
            } else {
                msg = ShowMsg.CanNotCopyAlbum;
                return;
            }
        });
        if ($.trim(msg).length > 0) {
            DiskTool.FF.alert(msg);
            return;
        }
        if (mlist.length > 0) {
            mlist = mlist.substring(0, mlist.length - 1);
        }
        //好友共享页面：点击下载，修改为已读状态。
        updateReadCount(sid, mlist);
        Share.submitData({
            ajaxAct: 'sharecopyto',
            sid: sid,
            fileID: mlist,
            dirId: dirID,
            extList: extList,
            dirName: dirName
        }, function(data) {
            if (data.resultCode != 0) {
                DiskTool.FF.alert(data.summary);
                return;
            }
            var invalidMsg = '';
            var code = data.resultData;
            if (code == '0') {
                invalidMsg = ShowMsg.MoveSuccess;
            } else if (code == '3') {
                invalidMsg = ShowMsg.ImageCanNotCopy;
            } else if (code == '4') {
                invalidMsg = ShowMsg.MusicCanNotCopy;
            } else if (code == '5') {
                invalidMsg = ShowMsg.DiskSizeFull;
            } else {
                invalidMsg = ShowMsg.MoveFailure;
            }
            if (invalidMsg != "") {
                DiskTool.FF.alert(invalidMsg);
            }
        });
    } else {
        DiskTool.FF.alert(ShowMsg.CheckOneFile);
    }
}
/**
*绑定列表显示 
*/
function bindsharelist(list) {
    var directoryID = Utils.queryString("DirectoryID");
    if (directoryID && PageMode() != 0) {//好友共享->文件夹，刚隐藏到顶部和底部的下载按钮
       // $('#btnDown').hide();
        //$('#btnDown2').hide();
    }
    var body = $("#tblist").empty();
    var operName = "";
    if (!directoryID) {
        var operName = (PageMode() == "0") ? "取消分享" : "删除";
    }
    $("#lblSelectAllFile").text("全选");
//    $("#lblSelectAllFile2").text("全选");
    var filelists = '';
    var imgNum = 0;
    var previewImg = [];
    var pageIndex = ListPager.Filter.pageIndex;

    $.each(list, function () {
        var item = this;
        var shareHtml = "";
        var filetype = item.shareObjType.toString() == "1" ? "0" : "1";
        var strHid = filetype + "|" + item.shareObjId + "|" + item.shareComefrom;
        var showName = "", showList = "", j = 0;
        var shareNumber = "";
        var recNumbers = "";
        var pageName = "";

        if (directoryID) {
            shareNumber = Utils.queryString("SN");
            recNumbers = Utils.queryString("RN");
        } else {
            if (PageMode() == 0) {
                recNumbers = item.shareeList.join(",").toString();
            } else {
                recNumbers = item.sharer.toString();
            }
        }
        var arraylist = recNumbers.split(",");
        if (PageMode() == 0) {
            if (arraylist.length > 9) {
                shareHtml += '<ul class="sharePeoList">'
                + '<li><a href="javascript:void(0);" class="countSharePeo">分享给'
                + arraylist.length
                + '个人<i class="dico"></i></a>'
                + '<ul style="display:none;width:105px;height:180px;" id="ulRecUserDisplay" class="ulRecUserDisplay">';
            } else if (arraylist.length > 3) {
                shareHtml += '<ul class="sharePeoList">'
                + '<li><a href="javascript:void(0);" class="countSharePeo">分享给'
                + arraylist.length
                + '个人<i class="dico"></i></a>'
                + '<ul style="display:none; background: #fff; position:absolute; z-index: 1000" id="ulRecUserDisplay" class="ulRecUserDisplay">';
            } else {
                shareHtml += '<ul class="shareList">';
            }
        }
        $.each(arraylist, function () {
            showName = top.Contacts.getSingleContactsByMobile(this.toString(), true);
            showName != null ? showName = showName.AddrFirstName : showName = NumberTool.remove86(this);
            var showCCNumber = showName.MobilePhone || NumberTool.remove86(this);
            if (showName.length == 13 && showName.substr(0, 2) == "86") {
                showName = NumberTool.remove86(showName);
            }
            var copyShowName = showName;
            var realShowName = "";
            var nameCount = 0;
            for (var i = 0; i < copyShowName.length; i++) {
                nameCount += DiskTool.len(copyShowName.charAt(i));
                if (nameCount < 12) {
                    realShowName += top.$T.Html.encode(copyShowName.charAt(i));
                } else {
                    realShowName += "..";
                    break;
                }
            }
            if (PageMode() == 0) {
                shareHtml += ' <li id="86' + showCCNumber + '"><a  id="del86' + showCCNumber + '" href="javascript:void(0)" title="取消分享">' + realShowName + '<i id="del86' + showCCNumber + '" class="i-delete-ti"></i></a></li>'
            } else {
                shareHtml += "<span>" + realShowName + "</span>";
            }
            showList += realShowName + "\r\n";
            j++;
        });
        if (PageMode() == 0) {
            if (arraylist.length > 3) {
                shareHtml += '</ul> </li> </ul>';
            } else {
                shareHtml += '</ul>';
            }
        }
        //当前附件浏览只能恢度用户使用。删除下面条件全网开放
        var preview2 = "";
        if (top.FilePreview.isRelease()) {
            var prvExp = "doc/docx/xls/xls/ppt/pdf/txt/htm/html/pptx/xlsx";
            var prvExp2 = "rar/zip/7z";
            if (DiskTool.getFileExtName(item.shareObjName).length > 0 && prvExp.indexOf(DiskTool.getFileExtName(item.shareObjName).toLowerCase()) > -1) {
                preview2 = "预览";
            } else if (DiskTool.getFileExtName(item.shareObjName).length > 0 && prvExp2.indexOf(DiskTool.getFileExtName(item.shareObjName).toLowerCase()) > -1) {
                preview2 = "打开";
            }
        }
        var isImg = /(?:\.jpg|\.gif|\.png|\.ico|\.jfif|\.tiff|\.tif|\.bmp|\.jpeg|\.jpe)$/i.test(item.shareObjName);
		var isAudio = false;
		var isVideo = false;
		var videoUrl = "";
        var index = "";
        if (isImg) {
            imgNum++;
            index = imgNum - 1;
        } else if(/\.(?:mp3|m4a|wma|wav)$/i.test(item.shareObjName)){
	        isAudio = true;
        } else if(/\.(?:avi|flv|mp4|rm|rmvb|wmv|3gp|mov|webm|mpg|mpeg|asf|mkv)$/i.test(item.shareObjName)){
	        isVideo = true;
        }
        var fragment =$("<tr>\
            <td class='t-check wh1'> \
                <input type='checkbox' /> \
                <input id='hidvalue' type='hidden'/> \
            </td> \
            <td class='t-type wh2' style='vertical-align: middle;'><a class='thumbnail'></a></td> \
            <td class='t-name' style='vertical-align: middle;'><a class='title'></a><span class='subFileCount' /><p> \
                <a class='fcI' href='javascript:;' ></a> <a class='fcI' style='display:none' href='javascript:;'>预览</a> <a class='fcI' href='javascript:;'>下载</a> <a  class='fcI' href='javascript:;'></a></p> \
            </td>\
            <td class='t-sName wh4' style='vertical-align: middle;'></td> \
            <td class='t-date wh5' style='vertical-align: middle;'></td> \
            <td class='t-size wh6' style='vertical-align: middle;'></td> \
            </tr>");

		if(isAudio) {
			fragment.attr("url", item.presentURL);
		} else if(isVideo) {
			var videoUrl = "/m2012/html/onlinepreview/video.html?sid=" + top.sid;
			videoUrl += "&id=" + item.shareObjId;
			videoUrl += "&name=" + encodeURIComponent(item.shareObjName);
			videoUrl += "&presentURL=" + encodeURIComponent(item.presentURL || item.presentLURL || item.presentHURL);

	        fragment.attr("url", videoUrl);
        }

        fragment.attr("id", "tr" + item.shareObjId).attr("index", index)
            .find("input:checkbox").val(item.shareObjId)
                               .attr("title", directoryID == null ? item.sharer : shareNumber)
							   .attr("path", item.path)
	                           .end()
	        .find("input:hidden").val(strHid)
                               .attr("title", directoryID == null ? item.sharer : shareNumber)
							   .attr("path", item.path)
	                           .end()
			.find("#path").text(item.path)
	                           .end()				   
	        .find(".t-name>a.title").text(item.shareObjName)
	                  .attr("name", item.shareObjName)
	                  .attr("title", item.shareObjName)
	                  .end()
            .find("a.fcI:eq(0)").text(preview2)
                      .end()
	        .find("a.fcI:eq(3)").text(Utils.htmlEncode(operName))
	                  .end()
	        .find(".t-sName").empty().append(shareHtml)
        //.attr("title",showList)             
	                  .end()
	        .find(".t-date").text(item.shareTime.format("yyyy-MM-dd hh:mm"))
	                  .end()
	        .find(".t-size").text((item.shareFileSize == 0 || item.shareFileSize == undefined) ? "" : DiskTool.getFileSizeText(parseFloat(item.shareFileSize)))
	                  .end();
        //如果是进入我的共享，则隐藏“转存彩云”链接
        //fragment.find("a.fcI:eq(4)").hide();
        /*好友共享-转存彩云
        fragment.find("a.fcI:eq(4)").click(function(e) {
        var fileId = "";
        var folderId = "";
        if(item.shareFlag == '1') {
        folderId = item.fileId;
        } else {
        fileId = item.fileId;
        }
        Share.submitData({
        ajaxAct: 'movefilefromshare',
        sid: sid,
        fileId: fileId,
        folderId: folderId                               
        }, function(data) {      
        alert("fileId:"+ fileId +",folderId:"+ folderId);                  
        if(data.resultCode == '0') {
        var code = data.resultData;                                
        if(code == '1') {
        DiskTool.FF.alert(ShowMsg.MoveFileSuccess);
        } else if(code == '11') {
        DiskTool.FF.alert(ShowMsg.HaveSameNameFile);
        } else {
        DiskTool.FF.alert(data.errorMsg);
        }
        }
        });                                  
        e.stopPropagation();
        });*/
        fragment.data("data", item); //将数据对象缓存到行
        if (DiskTool.getExtType(DiskTool.getFileExtName(item.shareObjName)) == "pic") {
            filelists += item.shareObjId + ",";
            var thumbnail = "<img width='32px' height='32px' filerefid=" + item.shareObjId + " src='/m2012/images/module/disk/disk_loadinfo.gif' alt='" + item.shareObjName + "'  />";
            fragment.find(".t-type .thumbnail").empty().append($(thumbnail));
            fragment.find("a.title,a.fcI:eq(1)").css("display", "inline");
            fragment.find("img").error(function () {
                $(this).attr("src", "/m2012/images/global/nopic.jpg")
            });
            previewImg.push({
				thumbnailURL: item.thumbnailUrl,
				bigthumbnailURL: item.presentURL || item.bigThumbnailUrl,
				presentURL: item.presentURL,
				fileName: item.shareObjName
			});
            if (item.thumbnailUrl) {
                fragment.find("img").attr("src", item.thumbnailUrl);
            }
            fragment.find("a.title,a.thumbnail,a.fcI:eq(1)").click(function () {
                var This = $(this);

                var num = This.parents("tr").attr("index");
                if (num != "") {
                    if (typeof (top.focusImagesView) != "undefined") {
                        top.focusImagesView.render({ data: previewImg, index: parseInt(num) });
                    }
                    else {
                        top.M139.registerJS("M2012.OnlinePreview.FocusImages.View", "packs/focusimages.html.pack.js?v=" + Math.random());
                        top.M139.requireJS(['M2012.OnlinePreview.FocusImages.View'], function () {
                            top.focusImagesView = new top.M2012.OnlinePreview.FocusImages.View();
                            top.focusImagesView.render({ data: previewImg, index: parseInt(num) });
                        });
                    }
                }
            });
        } else if(isAudio) {
	        fragment.find("a.title,a.thumbnail,a.fcI:eq(1)").click(function (e) {
		        var row = $(e.target).parents("tr");
		        var id = row.attr("id");
		        
		        if(id.length > 2){
			        id = id.slice(2);
					top.MusicBox.addMusic(id, [{
						id: id,
						url: row.attr("url"),
						text: row.find("a.title").attr("name")
					}]);
					top.MusicBox.show();
				}
			});
	    } else if(isVideo) {
	        fragment.find("a.title,a.thumbnail,a.fcI:eq(1)").click(function (e) {
		        var url = $(e.target).parents("tr").attr("url");
				top.addBehavior("disk_video_play");
				console.log("play video");
				window.open(url, "_blank");
	        });
	    } else {
        //    var cls = filetype == "0" ? "folder" : DiskTool.getFileImageClass(DiskTool.getFileExtName(item.shareObjName));
			var cls = filetype == "0" ? "i-file-smalIcion i-f-sys" : $T.Utils.getFileIcoClass2(0,item.shareObjName);
            fragment.find(".t-type .thumbnail").empty().append("<i class='" + cls + "'></i>");
        }
        var eventobj1 = "";
        var eventobj2 = "";
        if (DiskTool.getExtType(DiskTool.getFileExtName(item.shareObjName)) == "pic") {
            eventobj2 = "a.fcI:eq(2)";
        } else if (preview2 == "") {
            eventobj1 = "a.fcI:eq(0)";
            eventobj2 = "a.fcI:eq(2)"
        } else {
            eventobj1 = "a.title,a.thumbnail,a.fcI:eq(0)";
            eventobj2 = "a.fcI:eq(2)";
        }
        fragment.find(eventobj1).click(function (e) {
            /*if (PageMode() == 1 && item.isRead.toString() == '0') {
                updateReadCount(top.UserData.ssoSid, item.shareObjId + ","); //修改为已读状态。
            }*/
            DiskShare.model.getDownloadUrl(item, function (downloadUrl) {
                result = downloadUrl;
            });
            var checkReturnCode = function (result) {
                var msg = "";
                if (result == "2" || result == "3") {
                    msg == "参数错误";
                } else if (result == "5") {
                    msg = "您所选择的文件或文件夹大小为0，不能下载！";
                } else if (result == "4") {
                    msg = "彩云文件单次打包下载限量为200M，请重新选择文件！";
                } else if (result.length <= 0) {
                    msg = "下载失败，请稍后再试。";
                }
                return msg;
            };
            var msg = checkReturnCode(result);
            if (msg.length != 0) {
                DiskTool.FF.alert(msg);
                return;
            }
            var url = "http://" + top.location.host + "/m2012/html/onlinepreview/online_preview.html?src=disk&sid={0}&mo={1}&id={2}&dl={3}&fi={4}&skin={5}&resourcePath={6}&diskservice={7}&filesize={8}&disk={9}";
            url = url.format(
                top.UserData.ssoSid,
                top.uid,
                item.shareObjId,
                encodeURIComponent(result),
                encodeURIComponent(item.shareObjName),
                top.UserConfig.skinPath,
                DiskTool.getResource(),
                top.SiteConfig.diskInterface,
                item.shareFileSize,
                "http://" + window.location.host
                );
            window.open(url);
            e.stopPropagation();
            e.preventDefault();
        });
        /*fragment.find(eventobj2).click(function (e) {
            if (PageMode() == 0) {//我的共享，传递当前用户号码
                var shareNumberDown = Utils.queryString("SN") == null ? item.sharer : Utils.queryString("SN");
            } else {//好友共享，传递共享者的用户号码
                var shareNumberDown = Utils.queryString("RN") == null ? item.sharer : Utils.queryString("RN");
            }
            download(item.shareComefrom, item.shareObjType, item.shareObjId, shareNumberDown, item.shareObjName);
            e.stopPropagation();
            e.preventDefault();
        });
        fragment.find("a.fcI:eq(3)").click(function (e) {
            cancelshare(2, item);
            e.stopPropagation();
            e.preventDefault();
        });*/
        if (PageMode() == 0) {
            pageName = 'disk_my-share.html';
        } else {
            pageName = 'disk_friend-share.html';
        }
        //当共享为文件夹时
        if (item.shareDirType == '1' && item.shareObjType == '1') {
            fragment.find(".t-type .thumbnail,a.title").click(function () {
                var shareNumbers = fragment.find("input:hidden").attr("title");
                var path = item.path || DiskShare.model.curDirPath;
                window.location = pageName + "?DirectoryID=" + item.shareObjId + "&T=0&SN=" + shareNumbers + "&RN=" + recNumbers + "&Path=" + path;
            });
        }
        //我的相册
        if (item.shareDirType == '3' && item.shareObjType == '1') {
            fragment.find(".t-type .thumbnail").empty().append("<i class='folder-p'></i>");
            fragment.find(".t-type .thumbnail,a.title").click(function () {
                var shareNumbers = fragment.find("input:hidden").attr("title");
                window.location = pageName + "?DirectoryID=" + item.shareObjId + "&T=1&SN=" + shareNumbers + "&RN=" + recNumbers;
            });
        }
        //我的音乐
        if (item.shareDirType == '4' && item.shareObjType == '1') {
            fragment.find(".t-type .thumbnail").empty().append("<i class='folder-m'></i>");
            fragment.find(".t-type .thumbnail,a.title").click(function () {
                var shareNumbers = fragment.find("input:hidden").attr("title");
                window.location = pageName + "?DirectoryID=" + item.shareObjId + "&T=2&SN=" + shareNumbers + "&RN=" + recNumbers;
            });
        }
        //显示或隐藏删除共享图标 如果是在文件夹中，刚不添加此事件
        fragment.find(".showName").hover(
	            function () { fragment.find("#del" + this.id).show(); },
	            function () { fragment.find("#del" + this.id).hide(); }
	        );
        if (directoryID) {
            fragment.find(".i-delete-ti").remove();
        }
        //点击下拉
        fragment.find(".countSharePeo").click(function (e) {
            $('.ulRecUserDisplay').hide();
            var jDiv = $(this).parent().find("#ulRecUserDisplay");
            jDiv.toggle();
            e.stopPropagation();
            e.preventDefault();
            var link = this;
            $(document).mousemove(function (e) {//鼠标移出浮层后浮层自动关闭
                //原理是计算一个矩形范围，离开该范围自动消失
                if (outofArea(e.pageX, e.pageY, $(link), jDiv)) {
                    $(this).unbind("mousemove", arguments.callee);
                    //隐藏菜单
                    jDiv.hide();
                }
            });
        });

        //判断鼠标是否移出链接和层的矩形范围
        function outofArea(x, y, jLink, div) {

            var linkOffset = jLink.offset();
            var divOffset = div.offset();
            var linkTop = linkOffset.top;
            var divLeft = divOffset.left;
            var divRight = divLeft + div.width();
            var divBottom = divOffset.top + div.height();
            //移出整个大矩形
            if (y < linkTop || x < divLeft || x > divRight || y > divBottom) {
                return true;
            }
            //移出链接范围
            if (x < linkOffset.left && y < divOffset.top) {
                return true;
            } else if (x > linkOffset.left + jLink.width() && y < divOffset.top) {
                return true;
            }
        }
        //取消共享
        fragment.find(".i-delete-ti").click(function (e) {
            var recUserNumber = this.id.substring(3);
            DelShare(item, recUserNumber);
            e.stopPropagation();
            e.preventDefault();
        });
        var rowClick = function () {
            var cb = $(this).find("input:checkbox");
            if (cb.length > 0 && !cb[0].disabled) {
                cb[0].checked = !cb[0].checked;
                clickCheckBoxInRow(cb[0].checked, cb[0], $(this));
            }
        };
        //点击单选框
        var cbSingleClick = function (e) {
            var row = $(this).parent().parent();
            clickCheckBoxInRow(this.checked, this, row);
            e.stopPropagation();
        };
        fragment.click(rowClick);
        fragment.find("input:checkbox").click(cbSingleClick);
        /*if (PageMode() == 1 && item.isRead.toString() == '0') {
            fragment.addClass("no-read");
        }*/
        body.append(fragment);
    });
    var c = 4 - list.length;
    if (c > 0) {
        var row = $("<tr id='iamduoyu' style='display: ;'>\
            <td class='t-check' style='border-bottom: none;'> \
            </td> \
            <td class='t-type' style='border-bottom: none;'><div></div></td> \
            <td class='t-name' style='border-bottom: none;'> \
            </td>\
            <td class='t-share' style='border-bottom: none;'></td> \
            <td class='t-date' style='border-bottom: none;'></td> \
            <td class='t-size' style='border-bottom: none;'></td> \
            </tr>");
		row.hide();
        row.find("div").height(c * 70);
        body.append(row);
    }
    //绑定缩略图
    /*if (filelists && filelists.length > 0) {
        getGetThumbnailImageData(filelists);
    }*/
}
/**
*取消某个文件对某个用户的共享
*shareObjId：文件id
*fileName：文件名称
*sharer：共享者
*recUserNumber：被共享者
*/
function DelShare(item, recUserNumber) {
    var fileName = item.shareObjName;
    var message = "您真的确定要取消文件 \"" + Utils.htmlEncode(fileName) + "\" 对 " + recUserNumber.substring(2) + " 的共享吗?";
    DiskTool.FF.confirm(message, function() {
        var dataSend = {
            fileIds: "",
            dirIds: ""
        };
        if (item.shareObjType == "1") {
            dataSend.dirIds = item.shareObjId;
        } else {
            dataSend.fileIds = item.shareObjId;
        }
        Share.submitData(dataSend, function(data) {
            if (data.code == 'S_OK') {
                window.location.href = top.M139.Text.Url.getAbsoluteUrl('disk_my-share.html', location.href);
                $(".crumb").html("<strong>我的分享：</strong>(共" + (userShareCount - 1) + "个文件)");
                window.parent.Event.refreshData();
                DiskTool.FF.alert(ShowMsg.CancelShareSuccess);
            } else {
                DiskTool.FF.alert(data.summary);
            }
        }, "cancelShare");
    });
}
//取消共享 PageMode=  0：我的共享  1：好友共享 comtype: 1上方删除 2行工具栏删除
function cancelshare(comType, itemObj) {
    var pagemode = PageMode();
    if (comType == 1) {
        var countSid = $("#tblist input:checked").length;
    } else {
        var countSid = 1;
    }

    if (pagemode == 0 && countSid > 1) return;

    if (countSid) {
        //针对不同类型赋值不同提示
        var msg = pagemode == "0" ? ShowMsg.Cancel_1 : ShowMsg.Cancel_2;
        var sList = "";
        var selectedFids = [];
        var selectedDirIds = [];

        DiskTool.FF.confirm(msg, function() {
            var delInfo = "";
            //组合删除条件
            if (comType == 1) {
                //获取选择的行
                var selectRows = $("#tblist input:checked").parent().parent().map(function() {
                    return $(this).data("data");
                });
                $.each(selectRows, function() {
                    addFileDirIds(this);
                    sList += this.shareObjId + ","
                });
                sList = sList.length > 0 ? sList.substring(0, sList.length - 1) : "";
            } else {
                addFileDirIds(itemObj);
                sList = itemObj.shareObjId.toString();
            }

            function addFileDirIds (item) {
                if (item.shareObjType == "1") {
                    selectedDirIds.push(item.shareObjId);
                } else {
                    selectedFids.push(item.shareObjId);
                }
            }

            var ty = 4;
            if (pagemode == "1") {
                updateReadCount(top.UserData.ssoSid, sList); //好友共享页面：点击下载，修改为已读状态。
                ty = 3;
            }
            Share.submitData({
                fileIds: selectedFids.join(","),
                dirIds: selectedDirIds.join(",")
            }, function(data) {
                if (data.code != 'S_OK') {
                    DiskTool.FF.alert(data.summary);
                } else {
                    var arrlist = sList.split(",");
                    if (arrlist && arrlist.length > 0) {
                        var data = ListPager.Filter.getAllData();
                        var page = ListPager.Filter.pageIndex;
                        for (var m = 0; m < arrlist.length; m++) {
                            if (data && data.length > 0) {
                                for (var i = data.length - 1; i >= 0; i--) {
                                    if (data[i].shareObjId == arrlist[m]) {
                                        data.splice(i, 1);
                                    }
                                }
                            }
                        }
                        showPage(data, page);
                        /* 
                        for (var i = 0; i < arrlist.length; i++) {
                        $("#tr" + arrlist[i]).remove();
                        }*/
                        $("#cbSelectAllFile").attr("checked", false);
                        $("#lblSelectAllFile").text("全选");
//                        $("#lblSelectAllFile2").text("全选");
                    }
                    /* if (PageMode() == "1") {
                    $(".crumb").html("<strong>好友共享：</strong>(共" + (userShareCount - arrlist.length) + "个文件)");
                    } else {
                    $(".crumb").html("<strong>我的共享：</strong>(共" + (userShareCount - arrlist.length) + "个文件)");
                    }*/
                    window.parent.Event.refreshData();
					location.reload();
                }
            }, pagemode == 0 ? "cancelShare" : "delShare");
            $.disableElement($("#btnDown"));
            $.disableElement($("#btncancel"));
            //页面为好友共享时，初始化复制到功能
            if (PageMode() == "1") {
                $.disableElement($("#btnCopy"));
            }
        });
    } else {
        DiskTool.FF.alert(ShowMsg.CheckOneFile);
    }
}
//根据用户ID查询共享信息
function showFriends(uid, obj) {
    $("#myfriend li").each(function() {
        $(this).find("a").removeClass("current");
    });
    if (uid.length != "undefined" && uid.length > 0) {
        $("#hidfriendid").val(uid);
    } else {
        $("#hidfriendid").val("");
    }
    var actionType = PageMode();
    if (actionType == "1") {
        var sendData = {
            sharer: uid,
            directoryId: Utils.queryString("DirectoryID"),
            comefrom: Utils.queryString("T")
        }
    } else {
        var sendData = {
//            recvUserNumber: uid,
            directoryId: Utils.queryString("DirectoryID"),
//            comefrom: Utils.queryString("T")
            path: Utils.queryString("Path")
        }
    }
    Share.getDiskList(PageMode(), sendData, function(data) {
        if (data.code != "S_OK") {
            DiskTool.FF.alert(data.summary);
        } else {
            showPage(data['var'].fileList);
        }
    });
}
//共享搜索
function searchKeyWord(skey) {
    DiskTool.addDiskBehavior({
        actionId: 7009,
        thingId: 0,
        moduleId: 11,
        actionType: 20
    });
    if (skey) {
        $("#txtKeyWord").val(skey);
    }
    var key = $.trim($("#txtKeyWord").val());
    if (DiskTool.len(key) > 30) {
        DiskTool.FF.alert("最大长度30字节（15个汉字）");
        return false;
    }
    key = encodeURIComponent(key);
    if (key == encodeURIComponent(ShowMsg.DefauleKeyword) || key.length == 0) {
        DiskTool.FF.alert(ShowMsg.NoKeyword);
        return;
    }
    var param = {
        ajaxAct: 'searchkeyword',
        sid: sid,
        ModeType: PageMode(),
        key: key
    }
    Share.getDiskList(param, function(data) {
        if (data.resultCode != 0) {
            DiskTool.FF.alert(data.errorMsg);
        } else {
            showPage(data['var'].fileList);
        }
    });
}

//新版共享文件下载
function newShareDownload(downloadData, isOnlyFile) {
    /*界面超时处理*/
    if (Utils.PageisTimeOut(true)) { return; }
    var downLoadUrl = "";
    var packState = "";
    $.postXml({
        url: DiskTool.resolveUrl("download", true),
        data: XmlUtility.parseJson2Xml(getSendData(downloadData)),
        timeout: 120000,
        async: false,
        success: function(result) {
            if (result.code == "S_OK") {
                downLoadUrl = result['var'].url;
            } else if (result.code == "S_ERROR") {
                top.$Msg.alert(result.summary);
            } else {
                top.$Msg.alert("下载失败，可能的原因是所选文件夹为空");
            }
        },
        error: function(error) {
            DiskTool.handleError(error);
        }
    });
    newSharefileDown(downLoadUrl, isOnlyFile, packState);

    function getSendData (downloadData) {
        var arr = downloadData.split("|");
        var directoryIds = [];
        var fileIds = [];
        var path = "";

        for (var i = 0, len = arr.length; i < len; i++) {
            var item = arr[i].split(",");

            if (item[1] == "0") {//文件
                fileIds.push(item[0]);
            } else {//目录
                directoryIds.push(item[0]);
            }

            i == 0 && (path = item[3]);
        }

        return {
            directoryIds: directoryIds.join(","),
            fileIds: fileIds.join(","),
            isFriendShare: 1,
            path: path || DiskShare.model.curDirPath
        };
    }
}
//新版下载共享文件接口
function newSharefileDown(result, onlyOneFilePara, state) {
    if (!result) { return; }
    //单文件下载
    if (onlyOneFilePara) {
        window.open(result);
        return;
    }
    //多文件下载
    var url = "/m2012/html/disk/disk_filedownload.html?downloadurl={0}&state={1}";
    url = url.format(escape(result), state);
    top.$Msg.confirm('多个文件打包完成！', function(){
        $("body").append("<iframe id='downloadFrame' src='{0}' style='display: none;'> </iframe>");
        $("#downloadFrame").attr('src', result);
    }, function(){
        top.FF.close();
    }, {
        buttons:["下载","取消下载"]
    });
    //top.FF.open("多个文件打包", url, 480, 100, true);
}
