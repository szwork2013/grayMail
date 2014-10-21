//重写Utils.queryString
Utils.queryString = function(param, url) {
    if (!url) {
        url = location.search;
    }
    var reg = new RegExp("[?#&]" + param + "=([^&]*)", "i");
    var svalue = url.match(reg);
    var result = svalue ? decodeURIComponent(svalue[1]) : null;
    if (!result && location.hash) {
        svalue = location.hash.match(reg);
        result = svalue ? decodeURIComponent(svalue[1]) : null;
    }
    return result;
}
var SearchList = {
	Messages: {
        Res_Del_Fail: "删除失败，请稍后再试。",
        Res_Del_Fail_More: "文件夹下文件过多，请先删除该文件夹下的文件再删除该文件夹。",
        Res_Del_Success: "删除成功！",
        Res_Fail: "下载出错",
        Res_CheckFile: "请选择可操作的文件",
        Res_UserSize: "尊敬的用户,您好!彩云文件单次打包下载限量为{size}M请您重新选择文件再下载!",
        SendFiveFile: "一次只能发送5个文件,请取消部分文件",
        CanNotSendFolder: "只能快递文件，暂不支持文件夹快递！",
        SendOneMMSFile: "通过彩信发送文件快递只能操作一个文件",
        FriendShare: "好友共享",
        AtleastOne: "请选择一个文件或文件夹",
        OnlyOne: "只能选择一个文件或文件夹",
        FileProperty: "文件属性"
    },
	Action: {
        querySearchCondition: function(){
            var q = SearchList.Action.queryString;
            var paraList = ["searchtype", "keyword", "matchcase", "directoryid", "includechild", "startdate", "enddate", "limit", "upperorlower", "filetype"];
            var obj = {};
            $.each(paraList, function(){
                obj[this] = q(this);
            })
            return obj;
        },
        queryString: function(name){
            var url = window.location.href;
            return Utils.queryString(name, url);
        },
        getUserInfo: function(){
            if (!window["cacheUid"]) {
                window["cacheUid"] = SearchList.Action.queryString("sid");
            }
            return window["cacheUid"];
        },
        resConfirmDelete: function(fileCount, folderCount){
            var s = "确定要删除选定的";
            var t = " ";
            if (folderCount) {
                t += folderCount + " 个文件夹";
            }
            if (fileCount) {
                if (t != " ") {
                    t += "和 ";
                }
                t += fileCount + " 个文件";
            }
            t += "吗？删除后将无法恢复。";
            s += t;
            return s;
        }
    },
	Event: {
        //全选的时候
        clickCheckBoxAll: function(v, count){
            SearchList.Event.clickCheckBoxCommon();
        },
        //选单行的Checkbox的时候
        clickCheckBoxInRow: function(checked, cb, row){
            SearchList.Render.renderCheckedRow(cb.checked, row);
            SearchList.Event.clickCheckBoxCommon();
        },
        clickCheckBoxCommon: function(){
            var allChecked = $("#tbl-fileList>tr>td").find(":checked");
            var selectCount = allChecked.length;
            
            if (selectCount > 0) {
                $.enableElement($("#aShare"));
                $.enableElement($("#aDown"));
                $.enableElement($("#aDel"));
                if (selectCount == 1) {
                    $.enableElement($("#aProperty"));
                } else {
                    $.disableElement($("#aProperty"));
                }
            } else {
                $.disableElement($("#aShare"));
                $.disableElement($("#aDown"));
                $.disableElement($("#aProperty"));
                $.disableElement($("#aDel"));
            }
        }
    },
	Render: {
        //显示搜索列表
		renderList: function(list){
			$.getById("cbSelectAllFile", true).checked = false;
            $("#lblSelectAllFile").text("全选");
			$("#lblSelectAllFile2").text("全选");
			
            var table = $("#tbl-fileList");
            table.empty();
            $.disableElement($("#aProperty"));
			var len = ListPager.Filter.getDataCount();
			if (len == 0) {
                $(".result-count").addClass("result-null");
                $("#tbl-header,.nd-hd").hide();
            } else {
				$("#tbl-header,nd-hd").show();
                //呈现列表
                $.each(list, function(n){
                    if (this.POS == null || $.trim(this.POS) == "") {
                        //return true;
                    }
                    var tempObj = this;
                    var imageCss = "";
                    var rowToolHTML = "&nbsp;<a class='fcI del' href='javascript:;'>删除</a>";
                    var isAudio = false;
                    var ext = DiskTool.getFileExtName(this.srcfilename);
                    var extType = null;
                    imageCss = DiskTool.getFileImageClass(ext);
					
					var prvExp = "doc/docx/xls/xls/ppt/pdf/txt/htm/html/pptx/xlsx";  
                    var prvExp2 = "rar/zip/7z"; 
					var prcmd = "";
					if(top.FilePreview.isRelease()) {
					    if (DiskTool.getFileExtName(tempObj.srcfilename).length > 0 && prvExp.indexOf(DiskTool.getFileExtName(tempObj.srcfilename).toLowerCase()) > -1) {
						    prcmd = "<a class='fcI preview2' href='javascript:;'>预览</a>&nbsp;";
					    } else if (DiskTool.getFileExtName(tempObj.srcfilename).length > 0 && prvExp2.indexOf(DiskTool.getFileExtName(tempObj.srcfilename).toLowerCase()) > -1) {
						    prcmd = "<a class='fcI preview2' href='javascript:;'>打开</a>&nbsp;";			
					    } else{
						    prcmd="";
					    }
					}
                    if (this.isresume == 1) {
                        rowToolHTML = "<a class='fcI resume' href='javascript:;'>续传</a>" + rowToolHTML;
                        imageCss = "no-load";
                    } else {
                        extType = DiskTool.getExtType(ext);
                        switch (extType) {
                            case "pic": {
                                    rowToolHTML = "<a class='fcI preview' filerefid=" +
                        tempObj.fileid + " href='javascript:;'>预览</a>&nbsp;<a class='fcI down' href='javascript:;'>下载</a>&nbsp;<a class='fcI rename' href='javascript:;'>重命名</a>" + rowToolHTML;
                                break;
                            }
                            case "audio": {
                                rowToolHTML = "<a class='fcI play' href='javascript:;'>播放</a>&nbsp;<a class='fcI down' href='javascript:;'>下载</a>&nbsp;<a class='fcI rename' href='javascript:;'>重命名</a>" + rowToolHTML;
                                //播放图标
                                isAudio = true;
                                break;
                            }
                            default: {
                                    rowToolHTML =prcmd + "<a class='fcI down' href='javascript:;'>下载</a>&nbsp;<a class='fcI rename' href='javascript:;'>重命名</a>" + rowToolHTML;
                                    break;
                                }
                        }
                    }
                    
                    var fragment = $("                                  \
                    <tr>                                                \
                        <td class='t-check'>                            \
                            <input type='checkbox' />                   \
                        </td>                                           \
                        <td class='t-type'><a class='thumbnail'><i class='{2}'></i></a></td>     \
                        <td class='t-name'><a class='title'></a>     \
                        <p>{3}</p>                                    \
                        <td class='t-date'>{0}</td>                     \
                        <td class='t-size'>{1}</td>                     \
                    </tr>".format(this.uploadtime, this.filesize == null ? "" : DiskTool.getFileSizeText(parseFloat(this.filesize), true), imageCss, rowToolHTML));
                    fragment.find(".title").html(Utils.htmlEncode(this.srcfilename)).attr("title", this.srcfilename);
                    
                    if (extType == "pic") {
                        var thumbnail = "<a href=\"#\" class=\"thumbnail\"><img filerefid=" +
                        tempObj.file_ref_id +
                        " src='" +
                        "/m2012/images/module/disk/disk_loadinfo.gif" +
                        "' onerror='" //显示图片加载中...
 						+ DiskTool.scriptImgError("/m2012/images/module/disk/disk_cuowu.gif") +
                        "' />";
                        if (tempObj.isshare === 0) {
                            thumbnail += "<i class='i-hand h-img'></i></a>";
                        } else {
                            thumbnail += "</a>";
                        }
                        fragment.find(".t-type").empty().append($(thumbnail));
                    } else {
                        if (tempObj.isshare === 0) {
                            $("<i class=\"i-hand\" title=\"共享\"></i>").insertAfter(fragment.find("i:first"));
                        }
                    }
                    
                    fragment.click(function(){
                        var cb = $(this).find(":checkbox");
                        if (cb.length > 0 && !cb[0].disabled) {
                            cb[0].checked = !cb[0].checked;
                            SearchList.Event.clickCheckBoxInRow(cb[0].checked, cb[0], $(this));
                        }
                    });
                    
                    //音频文件图标变换
                    if (isAudio) {
                        fragment.find("td.t-type").hover(function(){
                            $(this).find("i:first").toggleClass(imageCss).toggleClass("mp3-hover");
                        }, function(){
                            $(this).find("i:first").toggleClass(imageCss).toggleClass("mp3-hover");
                        });
                        fragment.find("i").click(function(){
                            DiskTool.appendMusic([{
                                FileId: tempObj.fileid,
                                Name: tempObj.srcfilename
                            }]);
                        });
                    }
                    
                    //点击单选框
                    var cbSingleClick = function(cb){
                        var row = $(cb).parent().parent();
                        SearchList.Event.clickCheckBoxInRow(cb.checked, cb, row);
                    }
                    
                    var cbCtl = fragment.data("data", this) //缓存数据到Row
					.find(":checkbox").click(function(e){
                        cbSingleClick(this);
                        e.stopPropagation();
                    });
                    if (tempObj.isresume == 1) {
                        cbCtl.attr("disabled", true);
                    }
                    
                    //文件名下方的anchor
                    var anchorAction = {
                        "down": function(){
                            Toolbar.down([tempObj], true);
                        },
                        "del": function(){
                            Toolbar.delDocAndFile([tempObj]);
                        },
                        "play": function(){
                            DiskTool.addDiskBehavior({
								actionId: 7005,
								thingId: 0,
								moduleId: 11,
								actionType: 20
							});
                            DiskTool.appendMusic([{
                                FileId: tempObj.fileid,
                                Name: tempObj.srcfilename
                            }]);
                        },
                        "preview": function (This) {
                            SearchList.Render.getPreviewImg(function (previewImg) {
                                var filerefid = This.attr("filerefid");
                                var len = previewImg.length;
                                var index = 0;
                                for (var i = 0; i < len; i++) {
                                    if (previewImg[i].filerefid == filerefid) {
                                        index = i;
                                        break;
                                    }
                                }
                                if (typeof (top.focusImagesView) != "undefined") {
                                    top.focusImagesView.render({ data: previewImg, index: index });
                                }
                                else {
                                    top.M139.registerJS("M2012.OnlinePreview.FocusImages.View", "packs/focusimages.html.pack.js?v=" + Math.random());
                                    top.M139.requireJS(['M2012.OnlinePreview.FocusImages.View'], function () {
                                        top.focusImagesView = new top.M2012.OnlinePreview.FocusImages.View();
                                        top.focusImagesView.render({ data: previewImg, index: index });
                                    });
                                }
                            })
                            //预览图片
                            //var url = "/m2012/html/disk/disk_preview.html?fileid={0}&sid={1}";
                            //url = url.format(tempObj.fileid, SearchList.Ajax.getUserInfo());
                            //top._diskPreviewdWindow = top.FloatingFrame.open("图片预览", url, 520, 475, true, true);
                        },
						"preview2":function(){
							//附件预览
							DiskTool.addDiskBehavior({
								actionId: 7012,
								thingId: 0,
								moduleId: 11,
								actionType: 20
							});
							var downcgiurl = DiskTool.resolveUrl('download', true);
							var result = "";
							$.postXml({
								url: downcgiurl,
								data: XmlUtility.parseJson2Xml({
									fileid: tempObj.fileid.toString()
								}),
								async: false,
								success: function(data) {
									result = data['var'].url;
								}
							});
                            var checkReturnCode = function(result){
                                var msg = "";
                                if (result == "2" || result == "3") {
                                    msg == "参数错误";
                                }else if (result == "5") {
                                    msg = "您所选择的文件或文件夹大小为0，不能下载！";
                                }else if (result == "4") {
                                    msg = "彩云文件单次打包下载限量为200M，请重新选择文件！";
                                }else if(result.length <= 0){
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
						        tempObj.fileid,
						        encodeURIComponent(result),
						        encodeURIComponent(tempObj.srcfilename),
						        top.UserConfig.skinPath,
						        encodeURIComponent(DiskTool.getResource()),
						        encodeURIComponent(top.SiteConfig.diskInterface),
						        tempObj.filesize,
						        top.SiteConfig.disk
					        );
                            window.open(url);
						},
                        "resume": function(){
                            var tempDirId = tempObj.directoryid;
                            var tempDirType = 0;
                            var tempDirName = "";//tempObj.substring(POS.lastIndexOf("/")+1);
                            if(tempDirName == "我的音乐") {
                                tempDirType = 2;
                            } else if(tempDirName == "我的相册") {
                                tempDirType = 1;
                            }
                            DiskTool.openUpload(tempDirType, tempDirId, encodeURIComponent(tempDirName), encodeURIComponent(tempObj.file_ref_id));
                        },
						"rename":function(ele) {
							var url = DiskTool.getRelativeUrl("disk_dialogfileproperty.html?sid=" + SearchList.Action.getUserInfo());
                    		url += "&id=" + tempObj.fileid;
							if(ele) {
								ele.blur();
							}
                    		DiskTool.FF.open(SearchList.Messages.FileProperty, url, 450, 250, true);
						}
                    };
                    fragment.find("td.t-name>p>a").click(function(e){
                        var source = $(this);
                        $.each(anchorAction, function(name, actFunc){
                            if (source.hasClass(name)) {
                                if (name == "preview") {
                                    var status = $("#jonMark").length;
                                    if (status > 0) {
                                        return
                                    }
                                    top.$("body").append('<div class="jon-mark" id="jonMark" style="z-index:9999"><img style="position:absolute;top:50%;left:50%" src="/m2012/images/global/loading_xs.gif" /></div>')
                                    actFunc(source);
                                    return false;
                                }
                                actFunc();
                                return false;
                            }
                        });
                        e.preventDefault();
                        e.stopPropagation();
                    });
                    fragment.find("td.t-name>a.title,a.thumbnail").click(function(e) {
                        //执行下方的第一个行为
                        var a = $(this);
                        a.parent().parent().find("td.t-name>p>a:eq(0)").click();
                        e.preventDefault();
                        e.stopPropagation();
                    });
                    table.append(fragment);
                });
			}
			$(".result-count").show().find("em").html(len.toString() || 0);
            //加载缩略图
            var picFileIds = getPicFileIds();
            if(picFileIds && picFileIds.length > 0){
                SearchList.Ajax.getThumbnailImageData(picFileIds);
            }
        },
        getImgUrl: function (filerefid, callback) {  //获取缩略图数组
            var imgurl = DiskTool.resolveUrl('getthumbnailimage', true);
            filerefid = filerefid.join(",");
            var thumbimg = "";
            $.postXml({
                url: imgurl,
                data: XmlUtility.parseJson2Xml({
                    name: top.UserData.ssoSid,
                    fileids: filerefid,
                    width: 72,
                    height: 72
                }),
                async: false,
                timeout: 120000,
                success: function (result) {
                    if (result.code != 'S_OK') {
                        //服务器抛出异常
                        DiskTool.FF.alert(result.summary);
                    } else {
                        var allFiles = SearchList.Render.allFiles;
                        var pageIndex = ListPager.Filter.pageIndex;
                        var firstNum = pageIndex * 10;
                        var previewImg = [];
                        for (var i = firstNum; i < firstNum + 10; i++) {
                            var dataObj = allFiles[i];
                            if (!dataObj) { break }
                            var isImg = /(?:\.jpg|\.gif|\.png|\.ico|\.jfif|\.tiff|\.tif|\.bmp|\.jpeg|\.jpe)$/i.test(dataObj.srcfilename);
                            if (isImg) {
                                var downLoad = SearchList.Render.getDownloadAttachUrl(dataObj);
                                previewImg.push({
                                    imgUrl: result['var'][dataObj.file_ref_id],
                                    fileName: dataObj.srcfilename,
                                    downLoad: downLoad,
                                    comefrom: "disk",
                                    filerefid: dataObj.fileid
                                })
                            }
                        }
                        callback(previewImg)
                    }
                },
                error: function (error) {
                    DiskTool.handleError(error);
                }
            });
        },
        imgUrl: null,
        pageIndex: 0,
        previewImg: [],
        allFiles: [],
        getPreviewImg: function (callback) {
            var result = SearchList.Render.allFiles;
            var fileid = [];
            for (var i = 0; i < result.length; i++) {
                var dataObj = result[i];
                var isImg = /(?:\.jpg|\.gif|\.png|\.ico|\.jfif|\.tiff|\.tif|\.bmp|\.jpeg|\.jpe)$/i.test(dataObj.srcfilename);
                if (isImg) {
                    fileid.push(dataObj.fileid)
                }
            }
            console.log(result)
            SearchList.Render.getImgUrl(fileid, callback);
        },
        getDownloadAttachUrl: function (dataObj) {
            var downcgiurl = DiskTool.resolveUrl("download", true);
            var downloadUrl = "";
            var fileName = dataObj.filename;
            if (top.$B.is.firefox) {
                fileName = fileName.replace(/ /g, "_");
            }
            $.postXml({
                url: downcgiurl,
                data: XmlUtility.parseJson2Xml({
                    userNumber: top.UserData.userNumber,
                    folderid: "",
                    fileid: dataObj.fileid,
                    downname: escape(fileName)
                }),
                async: false,
                timeout: 120000,
                success: function (result) {
                    //处理album数据
                    if (result.code == DiskConf.isOk) {
                        downloadUrl = result["var"].url;
                    }
                },
                error: function (error) {
                    DiskTool.handleError(error);
                }
            });
            return downloadUrl;
        },
		renderCheckedRow: function(checked, row){
            if (checked) {
                if (!row.hasClass("t-checked")) {
                    row.addClass("t-checked");
                }
            } else {
                if (row.hasClass("t-checked")) {
                    row.removeClass("t-checked");
                }
            }
        }
	},
	Ajax: {
		getUserInfo: function(){
            if (!window["cacheUid"]) {
                window["cacheUid"] = Utils.queryString("sid", window.parent.location.href)
            }
            return window["cacheUid"];
        },
        getUserServerIP: function(){
            return window.parent.DiskMainData.UserServerIP;
        },
        getUserNumber: function(){
            return window.parent.DiskMainData.UserNumber;
        },
		getThumbnailImageData: function(fileRefIds){
            /*界面超时处理*/
            if(Utils.PageisTimeOut(true))return;
            $.postXml({
                url: DiskTool.resolveUrl('getthumbnailimage', true),
                data: XmlUtility.parseJson2Xml({
                    name: SearchList.Ajax.getUserInfo(),
                    fileids: fileRefIds,
					width: 50,
                    height: 50
                }),
                success: function(result){
                    if (result.code != "S_OK") {
                        //服务器抛出异常
						DiskTool.FF.alert(result.summary);
                    } else {
                        var img = $(".thumbnail>img");
                        $(".thumbnail>img").each(function(){	
                            var url = null;
                            var imgid = $(this).attr("filerefid");
                            if(window.parent.DiskInfo) {
								url = window.parent.DiskInfo.ImgSearch[imgid];
                            }
							if(url == null) {
                                url = result['var'][imgid];
                                if(window.parent.DiskInfo)window.parent.DiskInfo.ImgSearch[imgid] = url;
                            }						
                            $(this).attr("src", url);
                        });
                    }
                },
                error: function(error){
                    DiskTool.handleError(error);
                }
            });
        },
		fileDownload: function(url, fileAllCount) {
            var para = {
                url: url,
                success: function(result){
                    //0:失败   1成功：返回下载请求的CGI  2用户SESSION不正确   3参数不正确  4返回用户单次下载量(彩云文件单次打包下载量不够)
                    var msg = "";
                    if (result.length < 10) 
                        msg = SearchList.Messages.Res_Fail;
                    if (msg.length == 0) {
                        $("#iframecgi").attr("src", result);
                        DiskTool.addDiskBehavior({
							actionId: 17,
							thingId: 0,
							moduleId: 11,
							actionType: 20
						});
                    } else {
                        FF.alert(msg);
                    }
                },
                error: function(error){
                    DiskTool.handleError(error);
                }
            };
            $.get(para.url, null, para.success);
        },
		getList: function(pageIndex){
            /*界面超时处理*/
            if(Utils.PageisTimeOut(true))return;
            $.postXml({
                url: DiskTool.resolveUrl('search', true),
                data: XmlUtility.parseJson2Xml(SearchList.Action.querySearchCondition()),
                success: function(result){
                    if (!pageIndex) {
                        pageIndex = 0;
                    }
                    //处理正确信息                  
                    if (result.code == 'S_OK') {
                        //呈现分页器
                        ListPager.Filter.setData(result['var'].files);
						ListPager.Filter.initialize = true;
						ListPager.Render.initialPager();
						
                        ListPager.Render.renderList(ListPager.Filter.getData());
                        ListPager.Render.renderPage(pageIndex);

                        SearchList.Render.allFiles = result['var'].files;
                    } else {
                        //服务器抛出异常
                        DiskTool.FF.alert(result.summary);
                    }
                },
                error: function(error){
					DiskTool.handleError(error);
                }
            });
        }
	}
};
var Toolbar = {
	initial: function(){
        //Id跟函数之间的映射
        var map = {
            "aBack": "back",
            "aDown": "down",
			"aDown2": "down",
            "aShare": "share",
			"aShare2": "share",
            "aDel": "delDocAndFile",
			"aDel2": "delDocAndFile",
            "aProperty": "showProperty"
        };
        DiskTool.registerAnchor(map, function(val){
            return Toolbar[val];
        });
    },
	//返回列表
    back: function(){
        window.history.go(-1);
    },
	//下载
    down: function(rows, isAc){
        DiskTool.addDiskBehavior({
			actionId: 7029,
			thingId: 0,
			moduleId: 11,
			actionType: 20
		});
        if (!rows || !isAc) {
            rows = Toolbar.getAllSelectedSearchRow();
        }
		if(rows.length<=0){
			DiskTool.FF.alert("请选择文件");            
			return false;
		}
        var fids = [];
        $.each(rows, function(){
            fids.push(this.fileid.toString());
        });
        if (fids.length > 0) {
            var str = fids.join(",");
            DiskTool.downloadFile(str, "", "", fids.length);
        } else {
            return false;
        }
    },
	//共享
    share: function(ele){
        var count = Toolbar.getAllSelectedSearchRow().length;
		if(count <= 0) {
			DiskTool.FF.alert("请选择文件");            
			return false;
		}
		DiskTool.addDiskBehavior({
			actionId: 14,
			thingId: 0,
			moduleId: 11,
			actionType: 10
		});
        //DiskTool.addDiskBehavior(14, 11, 10, null, count);
		if(ele) {
			ele.blur();
		}
        var urlshare = DiskTool.getRelativeUrl("disk_dialogsharefile.html");
        DiskTool.FF.open(SearchList.Messages.FriendShare, urlshare, 565, 440, true);
    },
	//删除文件夹和文件
    delDocAndFile: function(rows){
		DiskTool.addDiskBehavior({
			actionId: 34,
			thingId: 0,
			moduleId: 11,
			actionType: 10
		});
        //DiskTool.addDiskBehavior(34, 11, 10);//第二期更改
        var fids = [];
        if (!rows[0]) {
            rows = Toolbar.getAllSelectedSearchRow();
        }
		if(rows.length <= 0){
			DiskTool.FF.alert("请选择文件");            
			return false;
		}
        $.each(rows, function(){
            fids.push(this.fileid.toString());
        });
        var filecount = fids.length;
        if (filecount > 0) {
            var deleteMsg = SearchList.Action.resConfirmDelete(filecount);
            DiskTool.FF.confirm(deleteMsg, function(){
				var deleteurl = DiskTool.resolveUrl('delDiskDirsAndFiles', true);
				$.postXml({
					url: deleteurl,
					data: XmlUtility.parseJson2Xml({
						dirIds: "",
						fileIds: fids.join(",")
					}),
					success: function(result) {
						if (result.code == "S_OK") {
							//刷新播放列表
							DiskTool.getDiskWindow().Toolbar.refreshList();
							DiskTool.removeMusicTrigger();
						} else {
			    DiskTool.FF.alert(SearchList.Messages.Res_Del_Fail);
						}
					},
					error: function(error) {
						DiskTool.handleError(error);
					}
				});	
            });
        } else {
            return false;
		}
	},
	//属性和重命名
    showProperty: function(){
        var selectedRow = Toolbar.getAllSelectedSearchRow();
        var count = selectedRow.length;
        if (count == 0) {
            DiskTool.FF.alert(SearchList.Messages.AtleastOne);
        } else if (count > 1) {
                DiskTool.FF.alert(SearchList.Messages.OnlyOne);
            } else {
                var data = selectedRow[0];
                if (data) {
                    //文件
                    var url = DiskTool.getRelativeUrl("disk_dialogfileproperty.html?sid=" + SearchList.Action.getUserInfo());
                    url += "&id=" + data.fileid;
                    DiskTool.FF.open(SearchList.Messages.FileProperty, url, 450, 250, true);
                }
            }
    },
	//获取选中的行
    getAllSelectedSearchRow: function(returnRow /* 为true返回选中tr行（Jquery对象）；默认返回行所对应的数据对象 */){
        var checkedRow = $("#tbl-fileList>tr>td>:checked").parent().parent();
        if (returnRow) {
            return checkedRow;
        }
        //返回数据属性DIRFLAG,ITEMID,ITEMNAME,ITEMSIZE,SOURCETYPE,UPLOADTIME,VIRUSSTATUS
        return checkedRow.map(function(){
            return $(this).data("data");
        });
    },
	refreshList: function(){
        //刷新本页面
        SearchList.Ajax.getList(ListPager.Filter.pageIndex, true);
        $.disableElement($("#aProperty"));
        $.disableElement($("#aDown"));
        $.disableElement($("#aDel"));
        $.disableElement($("#aShare"));
    },
    __getDiskHost: function(relUrl){
        var url = "http://" + window.location.host + "/";
        if (relUrl) {
            return url + relUrl;
        }
        return url;
    }
}
$(function(){
    //设置分页器属性
    DiskTool.notUseWait();
    ListPager.Filter.sortData = function(field, initialIsAsc) {
        var isAsc = false;
        if (ListPager.Filter.order == field) {
            isAsc = !ListPager.Filter.isAsc;
        } else {
            ListPager.Filter.order = field;
            isAsc = initialIsAsc;
        }
        ListPager.Filter.isAsc = isAsc;
        var data = ListPager.Filter.getAllData();
        if (data != null && data.length > 0) {
            data.sort(function(x, y){
                var compareVal = 0;
                switch (ListPager.Filter.order) {
                    //名称  
                    case "name":{
                        compareVal = x.srcfilename.localeCompare(y.srcfilename);
                        break;
                    }
                    //类型
                    case "type":{
                        compareVal = DiskTool.getFileExtName(x.srcfilename).localeCompare(DiskTool.getFileExtName(y.srcfilename));
                        break;
                    }
					//路径
                    case "place":{
                        //compareVal = x.POS.localeCompare(y.POS);
                        break;
                    }
                    //时间
                    case "date":{
                        compareVal = x.uploadtime.localeCompare(y.uploadtime);
                        break;
                    }
                    //大小
                    case "size":{
                        compareVal = x.filesize - y.filesize;
                        break;
                    }
                }
                compareVal = compareVal * (isAsc ? 1 : -1);
                return compareVal;
            });
        }
    };
    ListPager.Render.renderList = SearchList.Render.renderList;
	AddListenScroll();
});

//非异步请求
var getajax = function(url){
    var result = "";
    try {
        result = $.ajax({
            url: url,
            async: false
        }).responseText;
    } catch(e) {
        result = "";
    }
    return result;
}

var getPicFileIds = function(){
    var list = ListPager.Filter.getData();
    var listCount = list.length;
    var fileIds = "";
    for (var index = 0; index < listCount; index++) {
        var tempObj = list[index];
        var ext = DiskTool.getFileExtName(tempObj.srcfilename);
        var extType = DiskTool.getExtType(ext)
        if (extType == "pic") {
            fileIds += tempObj.fileid + ",";
        }
    }
    return fileIds;
}

$(function(){
    DiskTool.useWait();
    AddListenScroll();
    //初始化加载数据
    SearchList.Ajax.getList(); //加载当前文件夹数据
    //工具栏按钮设定
    Toolbar.initial();
    $.disableElement($("#aProperty"));
    $.disableElement($("#aDown"));
    $.disableElement($("#aDel"));
    $.disableElement($("#aShare"));
    
    //全选
    $("#cbSelectAllFile").click(function(){
        var v = this.checked;
        var count = 0;
        if(v) {
			$("#lblSelectAllFile").text("不选");
			$("#lblSelectAllFile2").text("不选");
		} else {
			$("#lblSelectAllFile").text("全选");
			$("#lblSelectAllFile2").text("全选");
		}
        $("#tbl-fileList>tr").each(function(){
            var row = $(this);
            row.find("td>:checkbox").each(function(){
                if (this.disabled === false) {
                    this.checked = v;
                }
            });
            SearchList.Render.renderCheckedRow(v, row);
            count++;
        });
        SearchList.Event.clickCheckBoxAll(v, count);
    });
    
    //排序
    var sortClick = function(ctl, field, initialIsAsc){
        var ctl = $(ctl);
        ListPager.Filter.sortData(field, initialIsAsc);
        
        //箭头
        $("span.t-arrow").html("");
        ctl.find("span.t-arrow").html(ListPager.Filter.isAsc ? "↑" : "↓");
        
        //返回第一页
        ListPager.Render.renderPager(null, 0);
        ListPager.Render.renderList(ListPager.Filter.getData());
    }
    
    //设定每列排序
    $(".tbl-list>thead>tr>th.t-type").click(function(){
        sortClick(this, "type", true);
    });
    $(".tbl-list>thead>tr>th.t-name").click(function(){
        sortClick(this, "name", true);
    });
    $(".tbl-list>thead>tr>th.t-date").click(function(){
        sortClick(this, "date", false);
    });
    /*$(".tbl-list>thead>tr>th.t-place").click(function(){
        sortClick(this, "place", true);
    });*/
    $(".tbl-list>thead>tr>th.t-size").click(function(){
        sortClick(this, "size", true);
    });
});
