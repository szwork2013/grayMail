var albumDirID;
var musicDirID;
Diskmain = {
    /*获取彩云整体信息 文件数量,共享目录等*/
    getDiskAllInfo: function(isasync) {
        /*界面超时处理*/
        if (Utils.PageisTimeOut(true)) {
            return;
        }
        var isAs = true;
        if (isasync) {
            isAs = false;
        }
        var url = DiskTool.resolveUrl('shareinit', true);
        $.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            async: isAs,
            success: function(data) {
                //将数据保存到对象
                window.shareinfo = data;
                //生成共享目录
                Render.shareUi();
            },
            error: function(a, b, c) { }
        });
    },
    /*获取目录结构信息*/
    getDirInfo: function(callback, isasync) {
        /*界面超时处理*/
        if (Utils.PageisTimeOut(true)) {
            return;
        }
        var isAs = true;
        if (isasync) {
            isAs = false;
        }
        var url = DiskTool.resolveUrl('getdiskallinfo', true);
        $.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            async: isAs,
            success: function(results) {
                if (results.code == 'S_OK') {
                    //将数据保存到对象
                    window.DiskDirData = results;
                    handleData(results);
                    if (callback) {
                        callback(window.dirInfo);
                        return;
                    }
                    //生成目录结构
                    Render.DirectoryUI();
                    //生成容量信息
                    Render.CapacityUI(results['var']);
                } else {
                    DiskTool.FF.alert(results.summary);
                }
            },
            error: function(a, b, c) {
                //alert(b + "--------" + c);
            }
        });
        function handleData(data) {
            window.dirInfo = data['var'];
            //取出相册和音乐目录信息
            for (var i = 0; i < data['var'].sysdirs.length; i++) {
                var single = data['var'].sysdirs[i];
                if (single.dirid == 20) {//我的相册
                    window.dirInfo.photoDir = single;
                }
                if (single.dirid == 30) {//我的音乐
                    window.dirInfo.musicDir = single;
                }
            }
        }
    }
}
/**
*DiskInfo对象
*/
DiskInfo = {
    /*Image Url Buffer*/
    ImgUrls: {}, ImgFile: {}, ImgPhoto: {}, ImgSearch: {}, ImgShare: {}, Img54: {},
    /*当前对象*/
    Current: {
        ID: 0,
        Ty: 0,
        Name: function() {
            return "#li" + DiskInfo.Current.Ty + "_" + DiskInfo.Current.ID;
        }
    },
    Data: {
        AlbumDId: DiskConf.albumDirID,
        MusicDId: DiskConf.musicDirID
    },
    Ajax: {
        getUserInfo: function() {
            if (!window["cacheUid"]) {
                window["cacheUid"] = Utils.queryString("sid", window.location.href)
            }
            return window["cacheUid"];
        }
    },
    Action: {
        Expand: function(ty, id) {
            if (ty == 3 || ty == 4) {
                if (id != null && id.length >= 13) {
                    id = id.substr(2);
                }
            }
            if (ty == 1 && id == null) {
                ty = 0;
                id = DiskInfo.Data.AlbumDId;
            }
            if (ty == 2 && id == null) {
                ty = 0;
                id = DiskInfo.Data.MusicDId;
            }
            if (id == null) {
                id = 0;
            }
            //如果Ty==null说明什么都不选择
            if (ty == null) {
                $("#dirlst .current").attr("class", "");
                $("#sharelst .current").attr("class", "");
                id = null;
                ty = null;
            }
            //记录当前选择项
            DiskInfo.Current.ID = id;
            DiskInfo.Current.Ty = ty;
            var clstree = function() {
                //查找样式
                var li = $(this);
                if (li.find("i").length > 0) {
                    if (li.find("i")[0].className == "i-photo" ||
					li.find("i")[0].className == "i-music" ||
					li.find("i")[0].className == "i-floder" ||
					li.find("i")[0].className == "i-lshare") {
                        li.find("ul").hide();
                    } else {
                        if (li.find("ul").length > 0) {
                            li.find("i")[0].className = "i-listAdd";
                            $(li.find("ul")[0]).hide();
                        } else {
                            li.find("i")[0].className = "i-listDel";
                        }
                    }
                }
                li.hover(function() {
                    li.addClass("hover");
                }, function() {
                    li.removeClass("hover");
                });
            };
            //收起所有的展开树
            $("#dirlst li").each(clstree);
            $("#sharelst li").each(clstree);
            if (ty == null) return; //不需要再定位选择
            //定位选择项
            var li = $(DiskInfo.Current.Name());
            if (li.length > 0) {
                //收起子集
                var c = li.find('ul');
                if (c.length > 0) {
                    c = $(c[0]);
                    c.hide();
                    li.find("i")[0].className == "i-listAdd"
                } else {
                    li.find("i")[0].className == "i-listDel"
                }
                //显示上级
                DiskInfo.Action.ExpandParent(li, ty);
            }
            else {
                //没有定位到就选择彩云首页
                DiskInfo.Current.ID = 0;
                DiskInfo.Current.Ty = 0;
            }
            DiskInfo.Action.SetCurrentCss();
        },
        ExpandParent: function(li, ty) {
            var ul = li.parent();
            if (ul.attr("id") != "dirlst" && ul.attr("id") != "sharelst") {
                var p = li.parent().parent();
                var c = p.find('ul');
                if (c.length > 0) {
                    c = $(c[0]);
                    c.show();
                    if (p.find("i")[0].className == "i-photo" ||
					p.find("i")[0].className == "i-music" ||
					p.find("i")[0].className == "i-floder" ||
					p.find("i")[0].className == "i-lshare") {
                    } else {
                        p.find("i")[0].className = "i-listDel"
                    }
                }
                DiskInfo.Action.ExpandParent(p, ty);
            }
        },
        //展开相册
        ExpandAlbum: function(albumId) {
            if (!albumId) {
                DiskInfo.Action.Expand(0, DiskInfo.Data.AlbumDId);
            } else {
                DiskInfo.Action.Expand(1, albumId);
            }
        },
        /*展开音乐*/
        ExpandMusic: function(musicId) {
            if (!musicId) {
                DiskInfo.Action.Expand(0, DiskInfo.Data.MusicDId);
            }
            else {
                DiskInfo.Action.Expand(2, musicId);
            }
        },
        SetCurrentCss: function() {
            //取消选所有选中样式
            $("#dirlst .current").attr("class", "");
            $("#sharelst .current").attr("class", "");
            $(DiskInfo.Current.Name()).attr("class", "current")
        },
        ReturnParentDir: function(dirId) {
            var curLi = $("#li" + DiskInfo.Current.Ty + "_" + DiskInfo.Current.ID);
            var parentLi = curLi.parent().parent();
            if (curLi.parent().attr("id") != "dirlst") {
                parentLi.click();
            } else {
                $("#mainFrame")[0].src = "/m2012/html/disk/disk_default.html?sid=" + top.sid;
            }
            return false;
        },
        getAlbumFileCount: function() {
            return sumRootDirCount(20);
        },
        getAlbumFileCountByID: function(albumid) {
            if (window.DiskDirData) {
                return sumFileCountByID(albumid, window.DiskDirData["var"].photodirs);
            }
            return 0;
        },
        getMusicFileCountById: function(cid) {
            if (window.DiskDirData) {
                if (cid) {
                    return sumFileCountByID(cid, window.DiskDirData["var"].musicdirs);
                }
                return sumRootDirCount(30);
            }
            return 0;
        }
    }
}

/**
*事件对象
*/
Event = {
    /**/
    initial: function() {
        Render.EventUI();  //给UI控件添加共享事件  
//        Diskmain.getDiskAllInfo(); //加载共享目录信息
//        Diskmain.getDirInfo(); //加载目录信息
        DiskInfo.Action.Expand(DiskInfo.Current.Ty, DiskInfo.Current.ID);
        //打开彩云首页
        $("#mainFrame")[0].src = "/m2012/html/disk/disk_default.html?sid=" + top.sid;
        Event.loadDiskInfo();
        if (searchKey_value && searchKey_value.length > 0) {//触发自动搜索
            $("#btnSearch").click();
        }
    },
    loadDiskInfo: function() {
        //if(DiskInfo.Data) {
        //DiskInfo.Render.refrshUI();
        Render.SearchUI();
        //	DiskInfo.Action.Expand(DiskInfo.Current.Ty,DiskInfo.Current.ID);
        //}
    },
    /*刷新页面数据*/
    refreshData: function(id, ty) {
        DiskInfo.Current.Ty = ty;
        DiskInfo.Current.ID = id;
        //重新获取彩云数据
//        Diskmain.getDiskAllInfo(1);
//        Diskmain.getDirInfo(null, 1);
    }
}
/**
*界面操作对象
*/
Render = {

    // 初始化渲染
    init: function(){
        $(function(){
            $("#pcClientSetup").html(top.SiteConfig["pcClientSetupHtml"]);
        });
    },

    /*全局UI对象事件*/
    EventUI: function() {
        $("#li3_0 i").click(function(e) {//点击谁共享给我的事件           
            $("#li3_0 ul").toggle();
            if ($("#li3_0 ul")[0].style.display == 'none') {
                this.className = "i-listAdd";
            } else {
                this.className = "i-listDel";
            }
            e.stopPropagation();
            e.preventDefault();
        });
        $("#li4_0 i").click(function(e) {//点击我给谁共享事件
            $("#li4_0 ul").toggle();
            if ($("#li4_0 ul")[0].style.display == 'none') {
                this.className = "i-listAdd";
            } else {
                this.className = "i-listDel";
            }
            e.stopPropagation();
            e.preventDefault();
        });
        //设定共享管理
        $("#li3_0").click(function() {//点击右侧好友共享
            DiskTool.SwichPageMode('friendshare');
        });
        $("#li4_0").click(function() {//点击右侧我的共享
            DiskTool.SwichPageMode('myshare');
        });
    },
    /*用户容量信息*/
    CapacityUI: function(dataObj) {
        if (dataObj.diskinfo) {
            var data = dataObj.diskinfo;
        } else { return; }
        //用户容量信息
        var info = jQuery(".adc-bd");
        var usagePercent = (data && data.totalsize > 0) ? (Math.round(data.totalusersize * 100 / data.totalsize)) : 0;
        if (isNaN(usagePercent)) {
            usagePercent = 0;
        }
        info.find("div.progress>.pg-bg").css("width", usagePercent + "%");
        info.find("div.progress>.pg-text").html(usagePercent + "%");

        info.find(".my-info h2 p").html(DiskTool.getFileSizeText(data.totalusersize) + "/" + DiskTool.getFileSizeText(data.totalsize));
        //显示套餐引导
        var isOnTips = false;
        var aVipInfo = info.find(".my-info h2 a");
        aVipInfo.hide();
        if ((data.totalusersize / data.totalsize) >= 0.8 &&
            top.UserData.vipInfo && top.UserData.vipInfo.serviceitem != "0017") {
            var dvOrderTips = $("#dvOrderTips");
            var aOrderLinkShow = $("#aOrderLinkShow");
            dvOrderTips.find("span:eq(0)").text(DiskTool.getFileSizeText(data.totalsize));
            aVipInfo.hover(function(e) {
                dvOrderTips.css({ top: (aVipInfo.offset().top + aVipInfo.height()) + "px", right: "10px" });
                dvOrderTips.show();
            }, function(e) {
                window.setTimeout(function(e1) {
                    if (!isOnTips) {
                        dvOrderTips.hide();
                    }
                }, 100);

            }).show();
            dvOrderTips.hover(function(e) {
                isOnTips = true;
            }, function(e) {
                isOnTips = false;
                dvOrderTips.hide();
            });
            aOrderLinkShow.click(function(e) {
                DiskTool.addDiskBehavior({
                    actionId: 102265,
                    thingId: 0,
                    moduleId: 11,
                    actionType: 20
                });
                top.$App.showOrderinfo();
                isOnTips = false;
                dvOrderTips.hide();
                return false;
            });
        }
    },
    /*生成用户目录*/
    DirectoryUI: function() {
        var data = window.DiskDirData['var'];
        var dir = jQuery("#dirlst");
        //清空ul
        dir.empty();
        //生成全部文件的li
        var allFilsLi = $("<li id='li0_10'><i class='i-floder'></i><a href='#' title='全部文件(" + data.diskinfo.filenum + ")' >全部文件(" + data.diskinfo.filenum + ")</a></li>");
        dir.append(allFilsLi);
        var photoFilNum = data.sysdirs[1].filenum; //相册文件总数
        var musicFilNum = data.sysdirs[2].filenum; //音乐文件总数
        //生成我的相册
        var photoli = $("<li id='li0_" + data.photoDir.dirid + "'><i class='i-photo'></i><a href='#' title='我的相册(" + photoFilNum + ")' >我的相册(" + photoFilNum + ")</a></li>");
        dir.append(photoli);
        loadDirectory2(photoli, data.photoDir.dirid, data.photodirs, 1);

        //生成我的音乐
        var musicLi = $("<li id='li0_" + data.musicDir.dirid + "'><i class='i-music'></i><a href='#' title='我的音乐(" + musicFilNum + ")'>我的音乐(" + musicFilNum + ")</a></li>");
        dir.append(musicLi);
        loadDirectory2(musicLi, data.musicDir.dirid, data.musicdirs, 2);

        //生成目录
        loadDirectory(dir, DiskConf.diskRootDirID, data.dirs);

        //设定i事件
        dir.find("i").click(function(e) {
            var li = $(this).parent();
            var ico = li.children("i")[0].className;
            if ((ico == "i-listDel" || ico == "i-listAdd") && li.find("ul").length > 0) {
                if (ico == "i-listAdd") {
                    li.children("i")[0].className = "i-listDel";
                    $(li.find("ul")[0]).show();
                } else {
                    li.children("i")[0].className = "i-listAdd";
                    $(li.find("ul")[0]).hide();
                }
            } else {
                li.find("ul").toggle();
            }
            e.stopPropagation();
            e.preventDefault();
        });
        //设定li点击事件
        dir.find("li").click(function(e) {
            var id = $(this).attr("id");
            var ty = id.substr(2, 1);
            //用户目录
            if (ty == "0") {
                if (id.substr(4) == data.photoDir.dirid) {
                    $("#mainFrame")[0].src = "/m2012/html/disk/disk_myalbum.html";
                } else if (id.substr(4) == data.musicDir.dirid) {
                    $("#mainFrame")[0].src = "/m2012/html/disk/disk_music.html";
                } else {
                    $("#mainFrame")[0].src = "/m2012/html/disk/disk_default.html?ty=" + ty + "&id=" + id.substr(4);
                }
            } else if (ty == "1") {//相册
                $("#mainFrame")[0].src = "/m2012/html/disk/disk_photolist.html?id=" + id.substr(4) + "&name=" + escape($(this).text());
            } else if (ty == "2") {//音乐
                $("#mainFrame")[0].src = "/m2012/html/disk/disk_music.html?id=" + id.substr(4) + "&name=" + escape($(this).text());
            }
            DiskInfo.Action.Expand(ty, id.substr(4));
            DiskTool.mainScroll();
            e.stopPropagation();
            e.preventDefault();
        });
        dir.find("li").hover(function() {
            $(this).addClass("hover");
        }, function() {
            $(this).removeClass("hover");
        });
    },
    /*去掉手机号前的86*/
    remove86: function(number) {
        if (typeof number != "string") number = number.toString();
        return number.trim().replace(/^86(?=\d{11}$)/, "");
    },
    /*生成好友共享*/
    shareUi: function() {
        data = window.shareinfo['var'];
        //好友共享
        $("#li3_0 span").html("好友共享(" + data.friendShareFileNum + ")");
        //清空UL
        $("#li3_0 ul").empty();
        $("#li3_0 ul").hide();
        $("#li3_0 ul").append($("<li>谁共享给我：</li>"));
        if (data.friendShareList != null && data.friendShareList.length > 0) {
            $.each(data.friendShareList, function() {
                var list = this;
                var showMobile = list.usernumber;
                var mobile = Render.remove86(showMobile);
                var shareList = top.Contacts.getSingleContactsByMobile(showMobile, true); //根据号码获取个人信息
                var addressName = list.alias ? list.alias : mobile;
                var fragment = $("<li id='li3_" + mobile + "'><i class='i-lshare'></i><a href='javascript:void(0);'></a></li>");
                fragment.find("a").text(addressName).attr("title", mobile).click(function(e) {
                    //显示一个好友
                    $("#mainFrame")[0].src = "/m2012/html/disk/disk_friend-share.html?id=" + showMobile;
                    var id = $(this).parent().attr("id");
                    var ty = id.substr(2, 1);
                    e.stopPropagation();
                    e.preventDefault();
                    DiskTool.mainScroll();
                });
                $("#li3_0 ul").append(fragment);
            });
        }
        //我的共享
        $("#li4_0 span").html("我的共享(" + data.myShareFileNum + ")");
        //清空UL
        $("#li4_0 ul").empty();
        $("#li4_0 ul").hide();
        $("#li4_0 ul").append($("<li>我给谁共享：</li>"));
        if (data.myShareList != null && data.myShareList.length > 0) {
            $.each(data.myShareList, function() {
                var list = this;
                var showMobile = list.usernumber;
                var mobile = Render.remove86(showMobile);
                var shareList = top.Contacts.getSingleContactsByMobile(showMobile, true);
                var addressName = list.alias ? list.alias : mobile;
                var fragment = $("<li id='li4_" + mobile + "'><i class='i-lshare'></i><a href='javascript:void(0);'></a></li>");
                fragment.find("a").text(addressName).attr("title", mobile).click(function(e) {
                    $("#mainFrame")[0].src = "/m2012/html/disk/disk_my-share.html?id=" + showMobile;
                    var id = $(this).parent().attr("id");
                    var ty = id.substr(2, 1);
                    e.stopPropagation();
                    e.preventDefault();
                    DiskTool.mainScroll();
                });
                $("#li4_0 ul").append(fragment);
            });
        }
    },
    /*搜索*/
    SearchUI: function() {
        //处理使在ie下enter触发搜索
        if (document.all) {
            $(document.body).keydown(function(e) {
                if (e.keyCode == 13) {
                    $("#btnSearch").focus();
                }
            });
        }
        //搜索
        $("#txtKeyword").keyup(function(e) {
            if (e.keyCode == 13) {
                $("#btnSearch").click();
                e.preventDefault();
            }
        }).blur(function() {
            $("#popMenu").hide();
        });
        $("#btnSearch").click(function() {
            DiskTool.addDiskBehavior({
                actionId: 7009,
                thingId: 0,
                moduleId: 11,
                actionType: 20
            });
            var txt = $("#txtKeyword");
            if (searchKey_value && searchKey_value.length > 0) {
                txt.val(unescape(searchKey_value));
            }
            var keyword = txt.val();
            keyword = keyword == txt.attr("defaultval") ? "" : $.trim2(keyword);
            if (keyword == "") {
                DiskTool.FF.alert("请输入搜索内容");
            } else if (DiskTool.len(keyword) > 30) {
                DiskTool.FF.alert("最大长度30字节（15个汉字）");
            } else {
                //获得disk_search.html
                var url = "/m2012/html/disk/disk_search.html";
                url = DiskTool.appendParaToUrl(url, {
                    keyword: keyword,
                    sid: DiskInfo.Ajax.getUserInfo()
                });
                //跳转页面
                $("#mainFrame")[0].src = url;
                //不选择任意项目
                DiskInfo.Action.Expand(null, null);
            }
        });
        $("a.to-advanced-search").click(function(e) {
            if ($("#popMenu").is(":visible")) {
                $("#popMenu").hide();
            } else {
                $("#popMenu").show();
            }
        });
        $("#apopMenu").click(function() {
            DiskTool.unWait();
            $("#popMenu").hide();
            DiskTool.addDiskBehavior({
                actionId: 7010,
                thingId: 0,
                moduleId: 11,
                actionType: 20
            });
            var url = "/m2012/html/disk/disk_adv-search.html";
            url = DiskTool.appendParaToUrl(url, {
                sid: DiskInfo.Ajax.getUserInfo()
            });
            $("#mainFrame")[0].src = url;
            //不选择任意项目
            DiskInfo.Action.Expand(null, null);
        });
    }
}
/*装入普通目录*/
function loadDirectory(pnode, pid, lst) {
    if (lst.length > 0) {
        $.each(lst, function(i) {
            var dir = this;
            if (dir.parentdir == pid) {
                //增加li
                var count = 0;
                for (var i = 0; i < lst.length; i++) {
                    if (lst[i].parentdir == dir.dirid) {
                        count = 1;
                        break;
                    }
                }
                if (count > 0) {
                    //temp = 0;
                    //sumFileCount(dir.dirid, lst);
                    var count = dir.filenum; //+ temp;
                    var node = $("<li id='li0_" + dir.dirid + "'><i class='i-listAdd'></i><a href='#' title='" + dir.dirname.encode() + "(" + count + ")" + "'>" + dir.dirname.encode() + "(" + count + ")" + "</a></li>");
                    pnode.append(node);
                    var ul = $("<ul></ul>");
                    ul.hide();
                    node.append(ul);
                    loadDirectory(ul, dir.dirid, lst);
                } else {
                    var node = $("<li id='li0_" + dir.dirid + "' ><i class='i-listDel'></i><a href='#' title='" + dir.dirname.encode() + "(" + dir.filenum + ")" + "'>" + dir.dirname.encode() + "(" + dir.filenum + ")" + "</a></li>");
                    pnode.append(node);
                }
            }
        });
    }
}
/*装入系统目录*/
function loadDirectory2(doc, pid, lst, ty) {
    if (lst.length > 0) {
        var ul = $("<ul></ul>");
        doc.append(ul);
        ul.hide();
        $.each(lst, function(i) {
            var dir = this;
            if (dir.dirname == "最新上传") {
                //dir.dirid = 10;
            }
            var li = $("<li id='li" + ty + "_" + dir.dirid + "' ><i class='i-listDel'></i><a href='#' title='" + dir.dirname.encode() + "(" + dir.filenum + ")" + "' >" + dir.dirname.encode() + "(" + dir.filenum + ")" + "</a></li>");
            ul.append(li);
        });
    }
}
//获取对应模块文件总数
// ty 10:文件夹 20:相册 30:音乐
function sumRootDirCount(ty) {
    if (window.DiskDirData) {
        var sysDirs = window.DiskDirData["var"].sysdirs;
        if (!sysDirs || sysDirs.length == 0) {
            return 0;
        }
        for (var i = 0, len = sysDirs.length; i < len; i++) {
            if (sysDirs[i].dirid == ty) {
                return sysDirs[i].filenum;
            }
        }
    }
    return 0;
}
function sumListCount(lst) {
    var sum = 0;
    for (var i = 0; i < lst.length; i++) {
        sum += lst[i].filenum;
    }
    return sum;
}
/*统计目录中含子目录的文件数*/
function sumFileCount(dirid, lst) {
    for (var i = 0; i < lst.length; i++) {
        if (lst[i].parentdir == dirid) {
            temp += lst[i].filenum
            sumFileCount(lst[i].dirid, lst);
        }
    }
}
function sumFileCountByID(dirid, lst) {
    for (var i = 0; i < lst.length; i++) {
        if (lst[i].dirid == dirid) {
            return lst[i].filenum;
        }
    }
    return 0;
}
/*统计系统目录文件总数*/
function sumListCount(lst) {
    var sum = 0;
    for (var i = 0; i < lst.length; i++) {
        sum += lst[i].filenum
    }
    return sum;
}
/*脚本自动更新文件列表顶部文件数目信息*/
var TiteInfo = {
    /*展指定ID  0目录 1相册 2音乐 3好友共享 4我的共享*/
    SelIndex: 0, SelObj: null, ID: null,
    init: function() {
        setInterval(TiteInfo.run, 1000);
    },
    setVal: function(index, Obj, id) {
        TiteInfo.SelIndex = index;
        TiteInfo.SelObj = Obj;
        TiteInfo.ID = id;
    },
    run: function() {
        try {
            if (window.DiskDirData && TiteInfo.SelObj != null) {
                switch (TiteInfo.SelIndex) {
                    case 0: //文件
                        var totalCount = 0;
                        if (TiteInfo.ID && TiteInfo.ID != "10") {
                            totalCount = 0;
                            for (var i = 0; i < window.DiskDirData['var'].dirs.length; i++) {
                                if (window.DiskDirData['var'].dirs[i].dirid == TiteInfo.ID) {
                                    temp = 0;
                                    //sumFileCount(window.DiskDirData['var'].dirs);
                                    totalCount = window.DiskDirData['var'].dirs[i].filenum + temp;
                                    break;
                                }
                            }
                        } else {
                            totalCount = window.DiskDirData['var'].diskinfo.filenum;
                        }
                        TiteInfo.SelObj.find("#aFileInfo").html("(共" + totalCount + "个文件)");
                        TiteInfo.SelObj.find("#aShareInfo").html("好友最新共享" + window.DiskDirData['var'].sharecount + "个文件");
                        break;
                    case 1: //相册
                        var filecount = DiskInfo.Action.getAlbumFileCount();
                        TiteInfo.SelObj.html("(共" + filecount + "个文件)");
                        break;
                    case 11: //相片
                        if (TiteInfo.ID != null) {
                            var filecount = DiskInfo.Action.getAlbumFileCountByID(TiteInfo.ID);
                            TiteInfo.SelObj.html("(共" + filecount + "个文件)");
                        }
                        break;
                    case 2: //音乐
                        var filecount = DiskInfo.Action.getMusicFileCountById(TiteInfo.ID);
                        TiteInfo.SelObj.html("(共" + filecount + "个文件)");
                        break;
                }
            }
        }
        catch (msg) { }
    },
    end: function() { }
}
TiteInfo.init();

// 入口
Render.init();
