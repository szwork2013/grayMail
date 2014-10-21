/**
 *移动文件页面
 */
var Move = {
	Data: {},
	/**
     * 提示语对象
     */
    Messages:{
        Empty       : "文件夹名称不能为空",
        MaxLength   : "最大长度不能超过20字",
        InvalidChar : "不能有以下特殊字符 \\/:*?\"<>|",
        RepeatDirName:"文件夹名称不能重复",
        Exception   : "创建文件夹失败，请稍后再试。",
        Level       : "文件夹层级不能超过5层", 
        NotSys      : "不能与系统文件夹重名",
        Res_CheckFile: "请选择文件",
        CanNotMoveSysFolder: "“{0}”是系统文件夹，不能移动！",
        ImageCanNotCopy: "只有图片文件才能移动到“我的相册”中！",
        MusicCanNotCopy: "只有音乐文件才能移动到“我的音乐”中！",
        SameDiretory: "您不能选择本文件夹移动到本文件夹！",
        CheckSameDiretory: "您选择的文件夹中包含目标文件夹，不能移动！",
        SendOneMMSFile: "通过彩信发送文件快递只能操作一个文件！",
        MoveFolderToImg_Fail            :"移动出错：不能向“我的相册”中移动文件夹",
        MoveFolderToMusic_Fail          :"移动出错：不能向“我的音乐”中移动文件夹",
        MoveSlefFolder_Fail: "不允许将一个目录移动到它的子目录下面！",
        HaveSameName_Fail: "移动出错：已有同名目录/文件存在！",
        FiveMoreDir_Fail: "最多支持5级目录,超过5级不能移动！",
        Move_Success: "移动成功！",
        Move_Fail: "移动失败，请稍后再试。",
		SelectInfo:"请选择文件",
        DiskSizeFull:"彩云空间不足，请重新选择文件！",
        SavaAsDiskSuccess:"文件复制到彩云成功!",
		WrongDir:"目标文件夹不正确"
    },
	/**
     * 移动到组建状态
     * 0 默认状态  1 新建文件夹状态
     */
    Status:0,
	/**
     * 按字节截取指定长度
     */
    HideString: function(content) {
        var byteLength = 14;
        content = Utils.htmlEncode(content);
        if(!content) return "";
        if(content.length < byteLength) return content;
        return content.substring(0, byteLength) + "..";
    },
	/**
	 *事件对象
	 */
	Event: {
		init: function() {
			//加载文件结构
            Diskmain.getDirInfo(function(data){
                Move.Render.renderTree(data);
            });
			if(Utils.queryString("type", window.location.href) == "3") {
				$("#btnMove").text("复制");
                Move.Messages.Move_Success = "复制成功！";
                Move.Messages.ImageCanNotCopy = "只有图片文件才能复制到“我的相册”中！";
                Move.Messages.MusicCanNotCopy = "只有音乐文件才能复制到“我的音乐”中！";
			}
			/*绑定按钮事件*/
            $("#btnMove").click(function(){
                Move.Action.move();
            });
			//新建
            $("#btnNew").click(function(){
                Move.Action.createFolder();
            });
			//取消
            $("#btnCancel").click(function(e) {
                top.FloatingFrame.close();
            }).mouseover(function() {
                Move.Status = 0;
            }).mouseout(function() {
                Move.Status = 1;
            });
			//确定
            $("#btnSure").click(function(){
                //Move.Action.sucCreate();
            });
		}
	},
	/**
	 *异步对象
	 */
	Ajax: {
		createFolder: function(folderId, newFolderName, type, callback) {
			/*界面超时处理*/
            if(Utils.PageisTimeOut(true)) return;
			if(Move.Ajax.isHasFolderName(folderId, newFolderName, type)) {
                Move.Action.showTips(Move.Messages.RepeatDirName);
                return;
            }
			//判断请求的URL和data
			if(folderId == DiskConf.albumDirID) {//相册
				var postUrl = DiskTool.resolveUrl('addDiskAlbum', true);
				var postData = {albumName: newFolderName}
			} else if(folderId == DiskConf.musicDirID) {//音乐
				var postUrl = DiskTool.resolveUrl('addDiskMusicClass', true);
				var postData = {musicClassName: newFolderName}
			} else {
				var postUrl = DiskTool.resolveUrl('addDirectory', true);
				var postData = {
                    dirName: newFolderName,
                    parentDirId: folderId
                }
			}
			$.postXml({
                url: postUrl,
                data: XmlUtility.parseJson2Xml(postData),
				success: function(resultData) {
                    if (resultData.code == "S_OK") {
                        if(callback) callback(resultData);
                    } else {
						Move.Action.showTips(resultData.summary);
					} 
                },
                error: function(error) {
                    DiskTool.handleError(error);
                }
			});
		},
		/* 验证文件夹名称是否存在*/
		isHasFolderName: function(folderId, newFolderName, type) {
			if(!Move.Data.dirs) return;
            if(type == 0){//普通
                for(var i = 0, len = Move.Data.dirs.length; i < len; i++) {
					var single = Move.Data.dirs[i];
                    if(single.dirid != folderId)
                        continue;
                    if(single.dirName != newFolderName)
                        continue;
                    return true;
                }
            } else if(type == 1){//相册
                for(var i = 0, len = Move.Data.photodirs.length; i < len; i++) {
                    if(Move.Data.photodirs[i].dirName != newFolderName)
                        continue;
                    return true;
                }
            } else if(type == 2){//音乐专辑
                for(var i = 0;i < Move.Data.musicdirs.length; i++) {
                    if(Move.Data.musicdirs[i].dirName != newFolderName)
                        continue;
                    return true;
                }
            }
            return false;
		},
		/**
         * 进行移动
         * dirID   :目标目录ID
         * dirName :目标目录名称
         * dirType :目标目录类型  0普通文件目录  1我的相册目录   2我的音乐目录
         */
		move: function(dirID, dirName, dirType) {
			var fileId = Utils.queryString("fileId", window.location.href); 
            var folderId = Utils.queryString("folderId", window.location.href); 
            var extList = Utils.queryString("extList", window.location.href); 
            var rootDirId = Utils.queryString("rootDirId", window.location.href); 
            var fromType = Utils.queryString("type", window.location.href); 
			
			//验证是否可以移动
            var msg = Move.Ajax.checkMove(rootDirId, fileId, folderId, extList, dirID, dirName, dirType, fromType);
            if (msg) {
                Move.Action.showTips(msg);
                return;
            }
			/*界面超时处理*/
            if(Utils.PageisTimeOut(true))return;
			/*与服务端交互*/
			if(fromType == 3) {
				var postUrl = DiskTool.resolveUrl('shareCopyTo', true);
				var postData = {
					fileIds: fileId,
					toDirType: dirType,
					toDirId: dirID
				}
			} else {
				var postUrl = DiskTool.resolveUrl('moveDiskFile', true);
				var postData = {
					ajaxAct: "movefile",
					sid: top.UserData.ssoSid,
					fileIds: fileId,
					dirIds: folderId,
					fromType: fromType,
					extList: extList,
					toDirType: dirType,
					toDirId: dirID,
					dirName: dirName
				}
			}
			$.postXml({
				url: postUrl,
                data: XmlUtility.parseJson2Xml(postData),
				success: function(result) {
					if (result.code == "FS_UNKNOWN") {
                        //服务器抛出异常
                        DiskTool.FF.alert(result.summary);
                        return;
                    } else if(result.code != "S_OK"){
						Move.Action.showTips(result.summary);
					} else {
						//操作成功提示
						Move.Action.showTips(Move.Messages.Move_Success);
						//刷新父窗口
						if(DiskTool.getDiskWindow().Toolbar) {
							DiskTool.getDiskWindow().Toolbar.refreshList();
						}
						//刷新页面
						if(DiskTool.getDiskWindow().FileList && DiskTool.getDiskWindow().FileList.Render) {
							DiskTool.getDiskWindow().FileList.Render.renderParent();
						}
						//关闭窗口
						if(fromType == 3)//来自复制到
							setTimeout(function(){
								top.FloatingFrame.close();
							}, 1000);
						else
							top.FloatingFrame.close();
						try{
							//第二期更改
							//DiskTool.addDiskBehavior(39, 11, 20);
							DiskTool.addDiskBehavior({
								actionId: 39,
								thingId: 0,
								moduleId: 11,
								actionType: 20
							});
						}catch(e){}
					}
				},
				error: function(error) {
                    DiskTool.handleError(error);
                }
			});
		},
		/*检查当前移动操作是否允许*/
		checkMove: function(rootDirID, fileId, folderId, extList, dirID, dirName, dirType, fromType) {
			var msg = "";
			if(!dirID) {
				return Move.Messages.WrongDir;
			}
			if((!rootDirID || rootDirID=="null") && dirName == "彩云网盘" && dirType == fromType) {
				return Move.Messages.SameDiretory;
			}
			if(rootDirID == dirID) {
				return Move.Messages.SameDiretory;
			}
			if(folderId != null && folderId != "" && folderId == dirID) {
				return Move.Messages.SameDiretory;
			}
            if(dirType == 1 && $.trim(extList).length == 0) {
                return Move.Messages.ImageCanNotCopy;
            }
			if(dirType ==2 && $.trim(extList).length == 0) {
                return Move.Messages.MusicCanNotCopy;
            }
			if($.trim(fileId).length == 0 && $.trim(folderId).length == 0) {
                return Move.Messages.Res_CheckFile;
            }
            if($.trim(folderId).length > 0 && folderId.indexOf(dirID) != -1) {
                return Move.Messages.CheckSameDiretory;
            }
			if($.trim(extList).length > 0) {
				var arrExt = extList.split(",");
                $.each(arrExt, function(i, e) {
                    var filetype = DiskTool.getExtType(arrExt[i]);
                    if (dirType == 1 && filetype != "pic") {
                        msg = Move.Messages.ImageCanNotCopy;
                        return false;
                    }
                    if (dirType ==2 && filetype != "audio") {
                        msg = Move.Messages.MusicCanNotCopy;
                        return false;
                    }
                });
                if (msg) {
                    return msg;
                }
			}
			return null;
		}
	},
	/**
	 *动作对象
	 */
	Action: {
		/*移动文件夹*/
		move: function() {
			//选中节点
            var selectNode = $("#liRootNode a.current");
            if(selectNode.length == 0){
                Move.Action.showTips("请选择文件夹");
                return;
            }
            var dirID = $(selectNode).parent().attr("fid");
            var dirName = $(selectNode).text();
            var type = $(selectNode).parent().attr("ftype"); 
            Move.Ajax.move(dirID, dirName, type);
		},
		/*文件夹排序*/
        sortData:function(data){
            var array = data;
            array.sort(function(x, y){
                return y.dirid - x.dirid;
            });
            return array;
        },
		/*选择文件夹改变触发*/
		selectChanged:function(selectNode) {
			$("#liRootNode input[type=text]").parent().remove();
            $("#btnNew").removeClass("wTcBut_GrayBtn");
            Move.Status = 0; 
            Move.Action.closeTips();
			//级别
			var level = parseInt($(selectNode).parent().parent().attr("level")) + 1;
			//类型
			var type = parseInt($(selectNode).parent().attr("ftype"));
			if((type != 0 && level > 3 ) || level > 5){
                $("#btnNew").addClass("wTcBut_GrayBtn");
                $("#btnNew").unbind("click");
                return false;
			}
			$("#btnNew").click(function(){
			    Move.Action.createFolder();
			});
		},
		/*隐藏提示*/
        closeTips:function(){
            $(".moveTreeN_tip").hide();
        },
		/*创建文件夹*/
		createFolder: function(folderId, newFolderName, type, callback) {
			Move.Action.closeTips();
			if(Move.Status == 1) return;
			//选中节点
            var selectNode = $("#liRootNode a.current");
            if(selectNode.length == 0){
                Move.Action.showTips("请选择文件夹");
                return;
            }
			//级别
			var level = parseInt($(selectNode).parent().parent().attr("level")) + 1;
			if(level > 5){
                Move.Action.showTips("文件夹层级不能超过5层");
                return;
			}
			//类型
			var type = parseInt($(selectNode).parent().attr("ftype"));
			if(type == 1 && level > 3){
                Move.Action.showTips("相册文件夹超过层级限制");
                return;
			}
			if(type == 2 && level > 3){
                Move.Action.showTips("音乐文件夹超过层级限制");
                return;
			}
			//状态修改
            Move.Status = 1;
            $("#btnNew").addClass("wTcBut_GrayBtn");
			//按钮样式修改
            $("#btnSure").show();
            $("#btnMove").hide();
			//父节点操作
            selectNode.parent().removeClass("none");
            selectNode.parent().addClass("select");
            selectNode.parent().find("ul:eq(0)").show();
			//子级UL
            var childUl = selectNode.parent().find("ul:eq(0)");
            if(childUl.length == 0){
                selectNode.parent().append("<ul level="+ level +"></ul>");
                childUl = selectNode.parent().find("ul");
            }
			//根目录
            if(level == 2) {
				$("<li ftype="+ type +" class='none'><input type=\"text\" class=\"newNes_File\" maxlength=\"20\" onblur=\"Move.Action.sucCreate();\" value=\"新建文件夹\"/></li>").insertAfter("#liMusicRootDir"); 
			} else {
                childUl.prepend($("<li ftype="+ type +" class='none'><input type=\"text\" class=\"newNes_File\" onblur=\"Move.Action.sucCreate();\" value=\"新建文件夹\"/></li>"));
			}
            childUl.find(".newNes_File").focus();
            childUl.find(".newNes_File").select();
		},
		/*显示提示*/
        showTips:function(msg){
            msg = "<i class=\"ico_sigh\"></i>&nbsp;" + msg;
            $(".moveTreeN_tip").html(msg);
            $(".moveTreeN_tip").show();
        },
		/*完成新建*/
		sucCreate: function() {
			if(Move.Status!=1) return;
			var inNewFolder = $("#liRootNode input[type=text]");
			var folderId = $(inNewFolder).parent().parent().parent().attr("fid");
			var type = $(inNewFolder).parent().parent().parent().attr("ftype");
			if (inNewFolder.val().trim() == "") {
			    Move.Action.showTips("文件夹名不能为空");
			    return;
			}
			Move.Ajax.createFolder(folderId, inNewFolder.val(), type, function(result) {
				//更新当前焦点
                $("#liRootNode a.current").removeClass("current");
				$(inNewFolder).parent().attr("fid",result['var'].id);
                $(inNewFolder).parent().attr("ftype",type);
				//生成元素 、属性
                inNewFolder.replaceWith("<a href=\"javascript:;\" class=\"current\">"+ inNewFolder.val().encode() +"</a>");
				//绑定事件
                Move.Render.renderEvent();
				//按钮样式修改
                $("#btnSure").hide();
                $("#btnMove").show();
                
                //更新状态
                Move.Status = 0;
                Move.Action.closeTips();
                $("#btnNew").removeClass("wTcBut_GrayBtn");
			});
		}
	},
	/**
	 *界面渲染对象
	 */
	Render: {
		renderTree: function(data) {
			if(!data || data.length==0) return; 
			Move.Data = data;
			//获取根节点
            var dir = $("#ulRootNode");
            dir.empty();
			dir.parent().attr("fid", DiskConf.diskRootDirID);//设置根目录ID
			//相册文件夹根节点
            var photoRootNode=$("<li ftype='1' class='none' fid='"+ DiskConf.albumDirID +"'><a href='javascript:;' title='我的相册'>我的相册</a></li>"); 
            //音乐文件夹根节点
            var musicRootNode=$("<li ftype='2' class='none' fid='"+ DiskConf.musicDirID +"' id='liMusicRootDir'><a href='javascript:;' title='我的音乐'>我的音乐</a></li>"); 
			dir.append(photoRootNode);
			dir.append(musicRootNode); 
			
			//排序
            data.photodirs = Move.Action.sortData(data.photodirs);
            data.musicdirs = Move.Action.sortData(data.musicdirs);
            data.dirs = Move.Action.sortData(data.dirs);
			
			//生成目录
            Move.Render.loadSysDirectory(photoRootNode, DiskConf.albumDirID, data.photodirs, 1);
            Move.Render.loadSysDirectory(musicRootNode, DiskConf.musicDirID, data.musicdirs, 2);
            Move.Render.loadDirectory(dir, DiskConf.diskRootDirID, data.dirs);
            Move.Render.renderEvent();
		},
		/*载入系统目录*/
        loadSysDirectory: function(pdir, pid, lst, ty) {
            if (lst.length == 0) return;   
			var level = parseInt(pdir.parent().attr("level")) + 1;
	        var ul=$("<ul level='"+ level +"'></ul>");
	        pdir.append(ul);
	        pdir.removeClass("none");
	        ul.hide();
            $.each(lst, function(i) {
                var dir = this;
                if(dir.dirname!="最新上传"){
                    var li = $("<li ftype='"+ ty +"' class='none' fid='"+ dir.dirid +"'><a href='javascript:;' title='"+ dir.dirname +"'>"+ Move.HideString(dir.dirname) +"</a></li>");
		            ul.append(li);
		        }
	        });
	    },
		/*装入普通目录*/
        loadDirectory: function(pnode, pid, lst) {
            if (lst.length == 0) return;
            pnode.parent().removeClass("none");
            $.each(lst, function(i) {
                var dir = this;
                if (dir.parentdir == pid) {
                    //增加li
                    var count = 0;
                    for (var i = 0, len = lst.length; i < len; i++) {
                        if (lst[i].parentdir == dir.dirid) {
                            count = 1;
                            break;
                        }
                    }
                    if (count > 0) {
			            temp = 0;
			            sumFileCount(dir.dirid, lst);
			            var count = dir.filenum + temp;
                        var node = $("<li ftype='0' class='none' fid='"+ dir.dirid +"'><a href='javascript:;' title='"+ dir.dirname +"'>" + Move.HideString(dir.dirname) + "</a></li>");
			            pnode.append(node);
			            var level = parseInt(pnode.attr("level")) + 1;
			            var ul = $("<ul level='"+ level +"'></ul>");
			            node.append(ul);
			            ul.hide();
			            Move.Render.loadDirectory(ul, dir.dirid, lst);
                    } else {   
                        var node = $("<li ftype='0' class='none' fid='"+ dir.dirid +"'><a href='javascript:;' title='"+ dir.dirname +"'>"+ Move.HideString(dir.dirname) +"</a></li>");
			            pnode.append(node);
                    }
                }
            });
        },
		/*点击文件夹时的事件*/
		renderEvent: function() {
			var dir = $("#ulRootNode");
			dir.parent().find("a").unbind("click").click(function(e){
				Move.Action.selectChanged($(this));
				/*选择操作*/
                var li = $(this).parent();
                dir.parent().find("a").removeClass("current");
                $(this).addClass("current");
				//不可展开
                if(li.attr("class") == "none") return;
                if(li.attr("class") == "select"){
                    $(li).find("ul:eq(0)").hide();
                    $(li).removeClass("select");
                    return;
                }
				$(li).find("ul:eq(0)").show();
                $(li).addClass("select");
			});
		}
	}
}
/*初始化页面*/
$(function(){
    Move.Event.init();
});