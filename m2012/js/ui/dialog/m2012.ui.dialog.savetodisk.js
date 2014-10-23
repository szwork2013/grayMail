﻿//http://smsrebuild0.mail.10086.cn/disk/disk?func=disk:saveAttach&sid=MTM1MzI4NzA1NTAwMTU0ODU0MzYxNAAA000001&rnd=0.2288308567367494
/*
<?xml version="1.0" encoding="utf-8" ?>
<object>
    <string  name="filename">PAD%u7248%u79BB%u7EBF%u4E2D%u5FC3%u6D4B%u8BD5%u7528%u4F8B%28CTC%29.xls</string>
    <string  name="usernumber">8615889394143</string>
    <string  name="directoryid">117321768</string>存到最新上传实际上是20
    <string  name="ComeFrom">0</string>
    <int name="BItemId">0</int>
    <string  name="url">http://appmail3.mail.10086.cn/RmWeb/view.do?func=attach:download&amp;mid=058b00000b92645b0000000a&amp;offset=392686&amp;size=83378&amp;name=PAD%E7%89%88%E7%A6%BB%E7%BA%BF%E4%B8%AD%E5%BF%83%E6%B5%8B%E8%AF%95%E7%94%A8%E4%BE%8B(CTC).xls&amp;encoding=1&amp;sid=MTM1MzI4NzA1NTAwMTU0ODU0MzYxNAAA000001&amp;type=attach</string>
    <string  name="cookieValue"></string>
    <string  name="type">attach</string>
</object>
{
    "code": "S_OK",
	"summary":"附件转存彩云成功！"
}
*/
/**
 * @fileOverview 定义存附件到彩云对话框
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.Dialog.SaveToDisk";

    /*
    var acceptMaxFileLength = 80; //字节
var acceptPhotoExtend = "bmp,gif,ico,jpg,jpeg,png,tif,tiff,";
var acceptMusicExtend = "mid,wma,wav,mp3,cda,";
var PhotoExtendAlert = "“{0}”不是图片格式文件,请重新选择";
var MusicExtendAlert = "“{0}”不是音乐格式文件,请重新选择";
var MusicExtendTips = "（支持上传mp3,wma,wav,mid等格式的音乐文件）";
var PhotoExtendTips = "（支持上传jpg,png,gif,bmp等格式的图片文件）";
var FileNotSelectAlert = "请先选择你要上传的文件";
var DirectoryRootName = "彩云";
var FileHadExist = "文件“{0}”已存在，是否将彩云中的该文件替换？";
var FileNameIsEmpty = "文件的文件名不能为空！";
var FileNameLength = "文件“{0}”名称大于{1}字符，不能上传";
var BanLvTips = "单个文件最大{0}";
var NotBanLvTips = "单个文件最大{0}  <a title='升级套餐,您可以上传更大单个文件.' href='#'>(上传更大单个文件!)</a>";
var UploadResultPage = top.SiteConfig.disk + "/html/uploadresult.html";
var InstallControlTips = "安装139邮箱小工具上传更稳定，速度更快，并支持选择多个文件和断点续传。<a href=\"{0}\" target=\"_blank\">立即安装</a>";
var UpdateControlTips = "系统检测到“139邮箱小工具”有更新版本，要升级后才能正常使用。<a href=\"{0}\" target=\"_blank\">立即升级</a>";
var EnforceUpdateTips = "检测到“139邮箱小工具”有新版本，需要升级才能继续。";
 var fileName = "";
    var url = "";
    var attachinfos = [];
    if (top.NETDISKATTACHMENT) {
        var netdiskattachment = top.NETDISKATTACHMENT;
        if(isArray(netdiskattachment)){
            attachinfos = netdiskattachment;
        }else{
            if (netdiskattachment.fileName) {
                fileName = netdiskattachment.fileName;
            }
            if (netdiskattachment.url) {
                url = netdiskattachment.url;
            }
            attachinfos = [{
                attachname : fileName,
                attachurl : url
            }];
        }
    } else {
        attachinfos = [{
            attachname : escape(Utils.queryString("filename")),
            attachurl : decodeURIComponent(Utils.queryString("tourl"))
        }];
    }
    if (DirectoryTree.selComefrom == 2) {
        for(var i=0;i<attachinfos.length;i++){
            fileName = unescape(attachinfos[i].attachname);
            if (!CheckMusic(fileName)) {
                return;
            }
        }
    } else if (DirectoryTree.selComefrom == 1) {
        for(var i=0;i<attachinfos.length;i++){
            fileName = unescape(attachinfos[i].attachname);
            if (!CheckAlbum(fileName)) {
                return;
            }
        }
    }
    */

    //特殊的文件夹id
    var DIRID = {
        //我的相册
        PHOTO: 20,
        //我的音乐
        MUSIC: 30
    };
    var AcceptPhotoExtend = "bmp,gif,ico,jpg,jpeg,png,tif,tiff".split(",");
    var AcceptMusicExtend = "mid,wma,wav,mp3,cda".split(",");
    var PhotoExtendAlert = "“{0}”不是图片格式文件,请重新选择";
    var MusicExtendAlert = "“{0}”不是音乐格式文件,请重新选择";

    M139.namespace(namespace, superClass.extend(
    /**@lends M2012.UI.Dialog.SaveToDisk.prototype*/
    {
        /** 定义存附件到彩云对话框
         *@constructs M2012.UI.Dialog.SaveToDisk
         *@extends M139.View.ViewBase
         *@param {Object} options 初始化参数集
         *@param {String} options.fileName 附件名
         *@param {String} options.downloadUrl 附件下载地址
         * 
         *@param {String} options.ids 文件ID 多个id用逗号隔开 
         *@param {String} options.type 组件类型 'save' 保存附件至彩云 'move' 移动文件至彩云
		 *@param {String} options.isreadmail 是否是读信页存网盘
         *@example
         */
        initialize: function (options) {
            this.model = new Backbone.Model();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        templateBtn : '<a id="createFolder" class="btnGreenBd btn MB_But_0 YesButton btnGray" rel="0" href="javascript:void(0)" style=""><span>新建文件夹</span></a>',
        templateNewFolder : [ '<li><span class="on">',
							     '<i class="i_plus"></i>',
							     '<i class="i_wjj"></i>',
							     '<input type="text" value="新建文件夹" style="height:11px;width:80px;" class="iText ml_5" value="" maxlength="255">',
							     '<a href="javascript:;" class="btnMinOK ml_5" title="确定"></a>',
							     '<a href="javascript:;" class="btnMincancel ml_5" title="取消"></a>',
							 '</span></li>'].join(""),
        tipWords: {
            Empty: "文件夹名称不能为空",
            MaxLength: "最大长度不能超过255字",
            InvalidChar: "不能有以下特殊字符 \\/:*?\"<>|&",
            RepeatDirName: "文件夹名称不能重复",
            Exception: "创建文件夹失败，请稍后再试。",
            Level: "文件夹层级不能超过5层",
            NotSys: "不能与系统文件夹重名"
        },
        dialogTitle: {
            save: "附件存彩云网盘",
            move: "附件存彩云网盘",
            diskFileMove: "移动",
            shareCopy: "复制到"
        },
        rootName: '彩云网盘',
        maxLengthName: 255,
        name: namespace,
        /**构建dom函数*/
        requestInitData2: function (callback) {
            var This = this;
            top.M139.UI.TipMessage.show("正在打开彩云网盘...");
            M139.RichMail.API.call("disk:getDirectorys", "", function (response) {// update by tkh 调用新接口
                top.M139.UI.TipMessage.hide();
                if (response.responseData.code == "S_OK") {
                    callback && callback();
                } else {
                    top.$Msg.alert("加载失败，请稍后重试", { ico: "warn" });
                    return;
                }
            });

        },
        render: function () {
            var This = this;
            //	This.requestInitData2(function(){
            var options = This.options;
            var dialogTitle = This.dialogTitle[options.type] || This.dialogTitle['save'];

				This.dialog = $Msg.showHTML("", function (e) {
					This.onYesClick(e);
				}, function (e) {
					This.onCancelClick(e);
				}, {
					width: 500,
					buttons: ["确定", "取消"],
					dialogTitle: dialogTitle
				});
				
				// add by tkh
				This.createBtnStatus = true;// 新建按钮是否可点击
				This.jContainer = This.dialog.$el;
				This.jContainer.find('.BottomTip').html(This.templateBtn);// 添加新建按钮
				This.initFolderEvent();// 初始化新建文件夹事件

            This.setElement(This.dialog.el);

            This.initEvent();

            return superClass.prototype.render.apply(This, arguments);
            //	});
        },

        // add by tkh新建文件夹输入框绑定事件
        initFolderEvent : function(){
        	var self = this,pl= 0;
        	this.jCreateFolderBtn = this.jContainer.find("#createFolder");
			this.jCreateFolderBtn.unbind('click').bind('click', function(event){
				if(!self.createBtnStatus){
					return;
				}
				self.disableCreateFolderBtn();
				self.jSelectFolder = self.treeView.model.get("selectedNode").$el;
				pl = parseInt($(self.jSelectFolder.find('a')[0]).css('paddingLeft')) + 18 ;
				$(self.jSelectFolder.find('ul')[0]).show().prepend(self.templateNewFolder);
				$(self.jSelectFolder.find('ul')[0]).find('span').eq(0).css('paddingLeft',pl+'px')
				$(self.jSelectFolder.find('a')[0]).addClass('on');
				$(self.jSelectFolder.find('i')[0]).show();
				bindEvents();
			});
        	
        	function bindEvents(){
        		var jInput = self.jSelectFolder.find("input");
        		// jInput.blur(function(event){
        			// var target = $(event.target);
	        		// $(this).parent('span').parent('li').remove();
	        		// ableCreateFolderBtn();
	        	// }).focus(function(){
	        		// var text = $(this).val();
	        		// if(text == '新建文件夹'){
	        			// $(this).val('');
	        		// }
	        	// });
	        	if($B.is.ie && $B.getVersion() == 6){
					jInput.bind('keydown', function(event){
						clearInput($(this));
						
						if(event.keyCode == M139.Event.KEYCODE.ENTER){
							self.jSelectFolder.find("a.btnMinOK").click();
						}
					}).bind('keypress', function(event){
						clearInput($(this));
						
						if(event.keyCode == M139.Event.KEYCODE.ENTER){
							self.jSelectFolder.find("a.btnMinOK").click();
						}
					});
				}else{
					jInput.bind('keydown', function(event){
						clearInput($(this));
						
						if(event.keyCode == M139.Event.KEYCODE.ENTER){
							self.jSelectFolder.find("a.btnMinOK").click();
						}
					});
				}
	        	function clearInput(jInput){
	        		var text = jInput.val();
	        		if(text == '新建文件夹'){
	        			jInput.val('');
	        		}
	        	}
	        	
	        	jInput.focus();
	        	
	        	self.jSelectFolder.find("a.btnMinOK").click(function(event){
	        		var name = $.trim(jInput.val());
	        		var msg = self.getErrorMsg(name);
	        		if(!msg){
	        			var dirId = getSelectedDirid();
	        			var options = {parentId : dirId, name : name, dirType : getSelectedDirType()};
	        			self.requestCreateFolder(options);
	        		}else{
	        			top.$Msg.alert(msg);
	        		}
	        	});
	        	self.jSelectFolder.find("a.btnMincancel").click(function(event){
	        		$(this).parent('span').parent('li').remove();
	        		self.ableCreateFolderBtn();
	        	});
        	};
        	
        	// 获取当前选中目录的ID
        	function getSelectedDirid(){
        		var dir = self.treeView.model.get("selectedNode").tag;
    			var dirId = String(dir.directoryId || dir.parentDirectoryId);
	            if (dir.parentDirectoryId == DIRID.PHOTO) {
	                dirId = dir.parentDirectoryId;
	            }else if(dir.parentDirectoryId == DIRID.MUSIC){
	                dirId = dir.parentDirectoryId;
	            }
	            return dirId;
        	};
        	
        	// 获取当前选中目录的dirType
        	function getSelectedDirType(){
        		var dir = self.treeView.model.get("selectedNode").tag;
            	return dir.dirType;
        	};
        },
        // add by tkh新建文件夹按钮不可用
        disableCreateFolderBtn: function () {
            var self = this;
            self.createBtnStatus = false;
            self.jCreateFolderBtn.addClass('btnGray');
        },
        // add by tkh激活新建文件夹按钮
        ableCreateFolderBtn: function () {
            var self = this;
            self.createBtnStatus = true;
            self.jCreateFolderBtn.removeClass('btnGray');
        },
        // add by tkh验证文件夹名称
        getErrorMsg: function (name) {
            var self = this;
            if (!name) {
                return self.tipWords.Empty;
            }
            //查看长度
            if (name.length > self.maxLengthName) {
                return self.tipWords.MaxLength;
            }
            if (!self.isRightName(name)) {
                return self.tipWords.InvalidChar;
            }
            return;
        },
        // add by tkh判断文件夹是否正确
        isRightName: function (name) {
            var reg = /[*|:"<>?\\/&]/;
            return !reg.test(name);
        },
        // add by tkh 移动文件至彩云
        requestMoveToDisk: function (dir) {
            var This = this;
            var dirId = String(dir.directoryId || dir.parentDirectoryId);
            var bItemId = 0;
            var comeFrom =This.options.comeFrom || "0";
            if (dir.parentDirectoryId == DIRID.PHOTO) {
                dirId = dir.parentDirectoryId;
                bItemId = dir.directoryId;
            } else if (dir.parentDirectoryId == DIRID.MUSIC) {
                dirId = dir.parentDirectoryId;
                bItemId = dir.directoryId;
            }
            if (dir.directoryId == DIRID.PHOTO || dir.parentDirectoryId == DIRID.PHOTO) {
                comeFrom = "1";
            } else if (dir.directoryId == DIRID.MUSIC || dir.parentDirectoryId == DIRID.MUSIC) {
                comeFrom = "2";
            }

            var requestData = {
                directoryId: dirId,
                shareFileId: this.options.ids,
                comeFrom: comeFrom,//comeFrom 来源  0为普通目录 1为相册 2为音乐
                //bItemId: bItemId,
                type: dir.dirType
            };
            var names = this.options.fileName;
            M139.UI.TipMessage.show("已后台保存，稍后查看",{delay : 5000});
            M139.RichMail.API.call("file:turnFile", requestData, function (response) {
                M139.UI.TipMessage.hide();
                if (response.responseData && response.responseData.code == "S_OK") {
                	if(This.options.comeFrom === 'fileCenter'){ // todo 日志上报
                        BH({key:'diskv2_fileCenter_savesuc'});
                	}else{
                        BH({key:'diskv2_cabinet_savesuc'});
                	}
                	
                //    This.onSaveRequestLoad(response.responseData);
					This.dialog.close();
                    //var tipMsg = "存彩云网盘成功";
                    //if (This.options.comeFrom !== 'largeAttach'&&(This.options.comeFrom !== 'fileCenter' ||top.Links !=="undefined")) {// 文件提取中心是独立的页面，没办法打开彩云
                    //    tipMsg += "，<a href='javascript:;' onclick='top.Links.show(\"diskDev\",\"&id={0}\",true);top.FF.close();return false;'>去查看</a>";
                    //}
                    //var tipMsgStr = tipMsg.format(dirId);
					//M139.UI.TipMessage.show(tipMsgStr,{delay : 5000}); 
                //    top.$Msg.alert(tipMsg.format(top.$T.Utils.htmlEncode(names), dirId), {
	            //        isHtml: true
	            //    });
                }else if(response.responseData.code == "-7"){
                	var html = response.responseData.summary;
	                //单文件超过大小
                    var vipInfo = top.UserData.vipInfo;
                    if (vipInfo && vipInfo.serviceitem != "0016" && vipInfo.serviceitem != "0017") {
                        html += '&nbsp;<a href="javascript:;" style="text-decoration: underline;" onclick="var topWin = top; topWin.FF.close();topWin.$App.show(\'mobile\');return false;">上传更大单个文件</a>';
                    }
                    top.FF.close();
                    top.$Msg.alert(html, {
                        icon: "warn",
                        isHtml: true
                    });
                } else if (response.responseData.code == "-4") {
                    var html = response.responseData.summary;
                    top.FF.close();
                    top.$Msg.alert(html, {
                        icon: "warn",
                        isHtml: true
                    });
                } else {
                    top.$Msg.alert("保存失败，请稍后重试", { ico: "warn" });
                }
            });
        },
        // add by zsx 提取中心的存彩云不是一样的
        requestMoveToDiskForFileCenter: function (dir) {
            var This = this;
            var dirId = String(dir.directoryId || dir.parentDirectoryId);
            var bItemId = 0;
            var comeFrom = "0";
            if (dir.parentDirectoryId == DIRID.PHOTO) {
                dirId = dir.parentDirectoryId;
                bItemId = dir.directoryId;
            } else if (dir.parentDirectoryId == DIRID.MUSIC) {
                dirId = dir.parentDirectoryId;
                bItemId = dir.directoryId;
            }
            if (dir.directoryId == DIRID.PHOTO || dir.parentDirectoryId == DIRID.PHOTO) {
                comeFrom = "1";
            } else if (dir.directoryId == DIRID.MUSIC || dir.parentDirectoryId == DIRID.MUSIC) {
                comeFrom = "2";
            }

            var requestData = {
                groupId: this.options.groupId,
                dirId: dirId,
                sendIds: this.options.ids,
                //     comeFrom: comeFrom,//comeFrom 来源  0为普通目录 1为相册 2为音乐
                //bItemId: bItemId,
                type: dir.dirType
            };
            var names = this.options.fileName;
			if(This.options.comeFrom == 'fileCenter'){
				This.trigger("fileCenterSaveSuccess");
				M139.RichMail.API.call("file:toDiskForCenter", requestData,function(){});
				This.dialog.close();
			}else{
	            M139.UI.TipMessage.show("已后台保存，稍后查看",{delay : 5000});
	            M139.RichMail.API.call("file:toDiskForCenter", requestData, function (response) {
	                M139.UI.TipMessage.hide();
	                if (response.responseData && response.responseData.code == "S_OK") {
		                
	                	if(This.options.comeFrom === 'fileCenter'){ // todo 日志上报
	                		//This.onSaveRequestLoad(response.responseData);
	                	}else{
	                		// diskv2_cabinet_savesuc
	                	}
	                	
	                	
	                   
						This.dialog.close();
						
						//return;
	                   // var tipMsg = "存彩云网盘成功";
	                    //if (This.options.comeFrom !== 'largeAttach'&&(This.options.comeFrom !== 'fileCenter' ||top.Links !=="undefined")) {// 文件提取中心是独立的页面，没办法打开彩云
	                    //    tipMsg += "，<a href='javascript:;' onclick='top.Links.show(\"diskDev\",\"&id={0}\",true);top.FF.close();return false;'>去查看</a>";
	                    //}
						//var tipMsgStr = tipMsg.format(dirId);
						//M139.UI.TipMessage.show(tipMsgStr,{delay : 5000});    
	                //    top.$Msg.alert(tipMsg.format(top.$T.Utils.htmlEncode(names), dirId), {
		            //        isHtml: true
		            //    });
	                }else if(response.responseData.code == "-7"){
	                	var html = response.responseData.summary;
		                //单文件超过大小
	                    var vipInfo = top.UserData.vipInfo;
	                    if (vipInfo && vipInfo.serviceitem != "0016" && vipInfo.serviceitem != "0017") {
	                        html += '&nbsp;<a href="javascript:;" style="text-decoration: underline;" onclick="var topWin = top; topWin.FF.close();topWin.$App.show(\'mobile\');return false;">上传更大单个文件</a>';
	                    }
		                top.FF.close();
		                top.$Msg.alert(html, {
		                    icon:"warn",
		                    isHtml: true
		                });
	                }else if(response.responseData.code == "-4"){
	                	var html = response.responseData.summary;
		                top.FF.close();
		                top.$Msg.alert(html, {
		                    icon:"warn",
		                    isHtml: true
		                });
	                } else {
	                    top.$Msg.alert("保存失败，请稍后重试", { ico: "warn" });
	                }
	            });
			}

        },
        //add by cezo 彩云文件/文件夹移动
        requestDiskFileMove: function (dir) {
            var This = this;
            var dirId = String(dir.directoryId || dir.parentDirectoryId);
            var data = this.options.data;
            var requestData = {
                fileIds: data.fileIds,
                directoryIds: data.directoryIds,
                srcDirType: data.srcDirType,
                toDirectoryId: dirId,
                toDirType: dir.dirType
            };

            M139.UI.TipMessage.show("正在移动...");
            M139.RichMail.API.call("disk:move", requestData, function (response) {
                M139.UI.TipMessage.hide();
                var responseData = response.responseData;

                if (responseData && responseData.code == "S_OK") {
                    This.onSaveRequestLoad(response.responseData);
                } else if (responseData && responseData.code == "JOIN_MCLOUD") {//正在接入彩云
                    This.confirmMcloudUpgrade();
                } else {
                    var error = response.responseData.summary;
                    top.$Msg.alert(error, { ico: "warn" });
                }
            });
        },

        //接入彩云提示
        confirmMcloudUpgrade: function () {
            $Msg.confirm(
                "尊敬的用户，彩云正在进行系统升级，暂时无法进行该操作，请稍后再试!",
                function () { },
                function () { },
                {
                    buttons: ["确定"]
                }
            ).setDialogTitle("彩云系统升级");
        },

        /** 存彩云同时存彩云，存彩云不提示 */
        repareSaveToMcloud: function () {
            var self = this;
            var options = this.options;
            if (options && options.saveToMcloud) {
                this.saveToMcloud = true;
            }

            this.initMcloudEvent();
            return superClass.prototype.render.apply(this, arguments);
        },
        //add by xx 共享管理 复制到 彩云
        requestCopyToDisk: function (dir) {
            var This = this;
            var dirId = String(dir.directoryId || dir.parentDirectoryId);
            var data = this.options.data;
            var fromDiskType = dir.dirType;
            var toDirType = 0;
            if (fromDiskType == 1) {   //因为旧版共享管理定义文件类型和重构彩云不一样，需要转化下
                toDirType = 0;
            } else if (fromDiskType == 3) {
                toDirType = 1;
            } else if (fromDiskType == 4) {
                toDirType = 2;
            }
            var requestData = {
                fileIds: data.fileIds,
                directoryIds: data.directoryIds,
                toDirId: dirId,
                toDirType: toDirType,
                path: data.path
            };
            var requestData = {
            };
            if (_.isArray(data)) {
                requestData[data[0]] = data[1];
            } else {
                requestData["catalogInfos"] = data.catalogInfos ? data.catalogInfos.join(",") : "";
                requestData["contentInfos"] = data.contentInfos ? data.contentInfos.join(",") : "";
            }
            requestData["newCatalogID"] = dirId;

            M139.UI.TipMessage.show("正在复制...");
            /*rewrite this*/
            M139.RichMail.API.call("disk:copyContentCatalog", requestData, function (response) {
                M139.UI.TipMessage.hide();
                var responseData = response.responseData;

                if (responseData && responseData.code == "S_OK") {
                    This.onSaveRequestLoad(response.responseData);
                } else {
                    top.$Msg.alert("复制失败，请稍后重试", { ico: "warn" });
                }
            });
        },
        // add by tkh 新建文件夹
        requestCreateFolder: function (options) {
            var self = this;
            var requestData = {
                parentId: options.parentId,
                name: options.name,
                dirType: options.dirType
            };

            M139.UI.TipMessage.show("正在新建文件夹...");
            M139.RichMail.API.call("disk:createDirectory", requestData, function (response) { // update by tkh 调新接口
                M139.UI.TipMessage.hide();
                var responseData = response.responseData;

                if (responseData && responseData.code == "S_OK") {
                    var dirid = responseData['var']['directoryId'];
                    self.selectedId = dirid;
                    self.trigger('print', dirid);// 重新生成文件夹树状结构，并选中新创建的文件夹
                    // 新建文件夹按钮可用
                    self.ableCreateFolderBtn();
                } else if (responseData && responseData.code == "JOIN_MCLOUD") {//正在接入彩云
                    self.confirmMcloudUpgrade();
                } else {
                    var error = responseData.summary;
                    $Msg.alert(error, { ico: "warn" });
                }
            });
        },

        requestInitData: function () {
            var This = this;
            !this.saveToMcloud && M139.UI.TipMessage.show("正在打开彩云网盘...");
            M139.RichMail.API.call("disk:getDirectorys", "", function (response) {// update by tkh 调用新接口
                M139.UI.TipMessage.hide();
                if (response.responseData.code == "S_OK") {
                    This.onInitDataLoad(response.responseData["var"]['directorys']);
                } else {
                    $Msg.alert("加载失败，请稍后重试", { ico: "warn" });
                }
            });

        },
        /*
        Attachinfos 对象（多个附件对象）
        attachname 附件名
        attachurl 附件下载路径
        usernumber 手机号 
        directoryid 保存目录id
        comeFrom 来源  0为普通目录 1为相册 2为音乐
        bItemId 专辑或相册id，当comefrom为 1或2时，该值有用
        数据库彩云普通目录，相册、音乐专辑是三张表
        为相册或音乐专辑的话 bItemId 就是相册或专辑ID
        为普通目录的话，bItemId 无效
        */
        requestSaveToDisk: function (dir) {
            var This = this;
            var dirId = String(dir.directoryId || dir.parentDirectoryId);
            var requestData = { netFiles: [] };
            var Attachinfos = this.options.Attachinfos;
            var names = [];
            var item;

            if (Attachinfos) {
                for (var i = Attachinfos.length - 1; i >= 0; --i) {
                    item = Attachinfos[i];
                    item.directoryId = dirId;
                    item.dirType = dir.dirType;
                    names.push(item.fileName);
                }
                requestData.netFiles = Attachinfos;
            } else {
                requestData.netFiles.push({
                    url: this.options.downloadUrl,
                    directoryId: dirId,
                    dirType: dir.dirType,
                    fileName: this.options.fileName,
                    fileSize: this.options.fileSize
                });
            }

            !this.saveToMcloud && M139.UI.TipMessage.show("正在保存至彩云网盘...");
            M139.RichMail.API.call("disk:attachUpload", requestData, function (response) {
                M139.UI.TipMessage.hide();
                if (response.responseData && response.responseData.code == "S_OK") {
                    BH({ key: 'diskv2_other_savesuc' });
                    This.onSaveRequestLoad(response.responseData);
                    This.dialog.close();
                    var tipMsg = "存彩云网盘成功";
                    if (This.options.comeFrom !== 'fileCenter' && top.Links != undefined ) {// 文件提取中心是独立的页面，没办法打开彩云
                        tipMsg += "，<a href='javascript:;' onclick='top.Links.show(\"diskDev\",\"&id={0}\",true);top.FF.close();return false;'>去查看</a>";
                    }
                    var tipMsgStr = tipMsg.format(dirId);
                    M139.UI.TipMessage.show(tipMsgStr, { delay: 5000 });
                    //    top.$Msg.alert(tipMsg.format(top.$T.Utils.htmlEncode(names.join(",")), dirId), {
                    //        isHtml: true
                    //    });

                } else {
                    var error = response.responseData.summary;
                    !this.saveToMcloud && $Msg.alert(error, { ico: "warn" });
                }
            });
        },

        onInitDataLoad: function (json) {
            if (json) {
                this.model.set("data", json);
                json[0] && this.model.set("rootId", json[0]["parentDirectoryId"]);//确定彩云的根目录id
            }
            this.trigger("initdataload");
        },

        onSaveRequestLoad: function (json) {
            if (json && json.code == "S_OK") {
                this.onSaveSuccess();
            }
        },

        /**
         *将后台输出的恶心的数据组装成树数据
         */
        getTreeNodeData: function () {
            var self = this;
            var data = this.model.get("data");
            var nodeMap = {};
            var rootLevelNodes = [];
            var allDirs = [].concat(data);
            var rootId = self.model.get("rootId");

            //添加彩云根目录 add by chenzhuo
            allDirs.unshift({
                directoryId: rootId,
                directoryName: self.rootName,
                dirType: 1,
                parentDirectoryId: 0
            });
            //var allDirs = [].concat(data.sysdirs, data.dirs, data.photodirs, data.musicdirs);// update by tkh 调用新接口

            var newDirs = [];
            for (var i = 0, len = allDirs.length; i < len; i++) {
                var dir = allDirs[i];

                newDirs.push({
                    directoryId: dir.directoryId,
                    parentDirectoryId: dir.parentDirectoryId,
                    text: dir.directoryName,
                    tag: dir,
                    childNodes: []
                })
            }

            rootLevelNodes.push(this.getNodeTreeData(newDirs));
            return rootLevelNodes;
        },

        //add by chenzhuo 生成目录树形结构(数据)
        getNodeTreeData: function (directories) {
            var root = {};//根目录

            for (var i = 0, len = directories.length; i < len; i++) {
                var dir = directories[i];

                for (var j = 0; j < len; j++) {
                    var item = directories[j];

                    if (dir.parentDirectoryId == item.directoryId) {
                        item.childNodes.push(dir);
                        break;
                    }

                    j == len - 1 && (root = dir);
                }
            }

            return root;
        },

        // update by tkh 新增属性selectedId
        renderTree: function () {
            var self = this;
            var nodes = this.getTreeNodeData();
            var newnodes = nodes;
            //如果是读信页
            //	debugger;
            if (self.options.isreadmail) {
                var firstTrees = nodes[0]["childNodes"];
                $.each(firstTrees, function () {
                    if (this["text"] == "139邮箱") {
                        //	newnodes = [this];
                        self.model.set("rootId", this["directoryId"]);
                        return false;
                    }
                });
            }
            var selectedId = self.selectedId || self.model.get("rootId");
			var topselectedId = '';
            if(top.resetDiskSelect){//定义在index.html页面
			   top.resetDiskSelect = false;
	           top.$App && top.$App.setCustomAttrs("diskSelectId",'');//取消网盘之前选择的目录
            }else{
	           topselectedId = top.$App && top.$App.getCustomAttrs("diskSelectId"); 
            }
            if (self.options.isreadmail && topselectedId) {
                selectedId = self.selectedId || topselectedId || self.model.get("rootId");
            }
            this.treeView = M2012.UI.TreeView.create({
                el: this.dialog.$(".boxIframeText"),
                nodes: newnodes,
                selectedId: selectedId
            }).render();
        },

        /** 存彩云附件同时存彩云 */
        autoSaveToDisk: function () {
            var nodes = this.getTreeNodeData();
            var dir = nodes[0].tag;
            this.requestSaveToDisk(dir);
        },

        initEvent: function (e) {
            this.on("initdataload", function () {
                this.renderTree();
            }).on("print", function () {
                this.requestInitData();
            }).on("success", function (e) {
                M139.UI.TipMessage.show("保存成功", {
                    delay: 5000
                });
                this.dialog.close();
            });
        },


        //附件存彩云不同时存彩云了
        initMcloudEvent: function (e) {

            var downUrl = this.options.downloadUrl;
            var fileName = this.options.fileName;
            console.log(downUrl);
            $App.trigger("saveToMcloud", {
                downUrl: downUrl,
                fileName: fileName || '全部附件.zip',
                fileSize: top.M139.Text.Url.queryString('size', downUrl) || '1'
            });
            /*
			var self = this;
            this.on("initdataload", function () {
                this.autoSaveToDisk();
            }).on("print", function () {
                this.requestInitData();
            }).on("success", function (e) {
                M139.UI.TipMessage.show("存彩云同时存彩云成功", {
                    delay: 3000
                });
				console.log('存彩云同时存彩云成功');
				var downUrl = this.options.downloadUrl;
				var fileName = this.options.fileName;
				console.log(downUrl);
				$App.trigger("saveToMcloud",{
					downUrl:downUrl,
					fileName: fileName || '全部附件.zip',
					fileSize:top.M139.Text.Url.queryString('size', downUrl) || '1'
				});
            });*/
        },

        onSaveSuccess: function () {
            this.trigger("success");
        },

        /**
         *检查文件是否可以保存
         * 彩云文件移动规则：
         * （1）相册下的文件可以移动到自定义目录、彩云根目录等但不能移动到音乐目录
         * （2）音乐下的文件可以移动到自定义目录、彩云根目录等但不能移动到相册目录
         * （3）相册和音乐下的目录不能移动
         * （4）自定义及彩云根目录的文件，是图片格式的可以移动到相册目录，是音乐格式的可以移动到音乐目录
         * （5）自定义目录可以在自定义目录之间移动，但是不能移动到相册和音乐目录
         * author：xiaoyingxiang
         * check :jiangzixiang
         *@inner
         */
        checkFile: function (dir) {
            var fileName = this.options.fileName;
            var extName = M139.Text.Url.getFileExtName(fileName);
            var error = "";
            //保存到“我的相册”、“我的音乐”要检查文件扩展名
            if (dir.directoryId == DIRID.PHOTO || dir.parentDirectoryId == DIRID.PHOTO) {
                if ($.inArray(extName, AcceptPhotoExtend) == -1) {
                    error = PhotoExtendAlert.format(M139.Text.Url.getOverflowFileName(fileName, 15));
                }
            } else if (dir.directoryId == DIRID.MUSIC || dir.parentDirectoryId == DIRID.MUSIC) {
                if ($.inArray(extName, AcceptMusicExtend) == -1) {
                    error = MusicExtendAlert.format(M139.Text.Url.getOverflowFileName(fileName, 15));
                }
            }
            if (error) {
                $Msg.alert(error, {
                    icon: "warn"
                });
                return false
            } else {
                return true;
            }
        },

        onYesClick: function (e) {
            var dir = this.treeView.model.get("selectedNode").tag;
            e.cancel = true;//取消对话框关闭
            if (this.checkFile(dir)) {
                var type = this.options.type;
                var isForFileCenter = this.options.isForFileCenter;
                if (isForFileCenter) {
                    this.requestMoveToDiskForFileCenter(dir);
                    return;
                }
                if (type === 'move') {
                    this.requestMoveToDisk(dir);
                } else if (type === "diskFileMove") {
                    this.requestDiskFileMove(dir);
                } else if (type === "shareCopy") {
                    this.requestCopyToDisk(dir);
                } else {
                    this.requestSaveToDisk(dir);
                }
            }
        },
        onCancelClick: function () {
            this.trigger("cancel");
        }
    }));
})(jQuery, _, M139);