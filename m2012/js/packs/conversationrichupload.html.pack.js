
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.UI.UploadImage.Menu.View', superClass.extend(
	/**
	 *@lends M2012.UI.UploadImage.Menu.View.prototype
	 */
	{
		initialize: function(options){
			this.wrapper = $(options.wrapper)[0];
			this.template = options.template;
			this.uploadImageMenus = M2012.UI.PopMenu.create({
				container: document.body,
				dockElement: this.wrapper,
				hideInsteadOfRemove: true,
				template: this.template,
				items:[]
			});
		},

		render: function(){
			/** 插入图片菜单按钮 **/
		
			//window.uploadImageMenus = uploadImageMenus;	// for debug
			var uploadImageMenus = this.uploadImageMenus;

			$(this.wrapper).css("position", "relative").on("click", function(e){
				var isHide = uploadImageMenus.isHide();
				e.stopPropagation();	// 必须，否则首次无法show
				if(isHide) {
					M139.Dom.dockElement(this, uploadImageMenus.el, {dx: -20});
					uploadImageMenus.show();
					M139.Dom.bindAutoHide({
						stopEvent: true,
						action: "click",
						element: uploadImageMenus.el,
						callback: function(){
							uploadImageMenus.hide();
						}
					});
				} else {
					uploadImageMenus.hide();
				}
			});

			return this;
		},

		/*
		* 添加本地上传菜单项，插入本地上传图片到编辑器
		* @param id 和模板中的菜单项id要对应
		*/

		addLocalUploadMenuItem: function(id){
			var wrapper;
			var uploadImageMenus = this.uploadImageMenus;
			var element = document.getElementById(id || "aLocalFile");	// 模板中的元素id

			if(element == null) {
				return;
			}

			wrapper = $('<div class="FloatingDiv"></div>');
			wrapper.css({
				position: "absolute",
				top:0,
				left:0,
				width: "100%",
				height: "22px",
				opacity: 0,
				overflow: "hidden",
				padding: "0px",
				zIndex: 1024
			}).appendTo($(element).css("position", "relative"));

			new M2012.Compose.View.UploadForm({
				wrapper: wrapper,
				accepts: ["bmp", "png", "jpg", "jpeg", "gif"],
				uploadUrl: utool.getControlUploadUrl(true),
				onSelect: function(value, ext){
					BH("compose_editor_image_local");
					uploadImageMenus.hide();

					if (_.indexOf(this.accepts, ext) == -1) {
						$Msg.alert("只允许插入jpg, jpeg, gif, bmp, png格式的图片", {icon:"warn"});
						return false;
					}

					if(window.conversationPage && window.PageMid){
						top.$App.trigger('uploadImgStart_' + window.PageMid,{});				
					}
					return true;
				},
				onUploadFrameLoad: function (frame) {
					var imageUrl = utool.getControlUploadedAttachUrl(frame);
					imageUrl && htmlEditorView.editorView.editor.insertImage(imageUrl);
				}
			}).render();

			$(element).on("click", function(){});
		},

		/*
		* 添加网络图片上传菜单项，插入网络图片到编辑器
		* @param id 和模板中的菜单项id要对应
		*/

		addInternetUploadMenuItem: function(id){
			var uploadImageMenus = this.uploadImageMenus;
			var element = document.getElementById(id || "aInternetFile");

			var internetMenu = new M2012.UI.UploadImage.InternetImageMenu();

			$(element).on("click", function(){
				BH({key: "compose_editor_image_net"});
				internetMenu.render().show({
					dockElement: document.getElementById("aInsertPic")
				});
				uploadImageMenus.hide();
			});
		},

		/*
		* 添加手机图片上传菜单项，插入手机图片到编辑器
		* @param id 和模板中的菜单项id要对应
		*/

		addMobileUploadMenuItem: function(id){
			
		}
	}));
})(jQuery, _, M139);

// 上传网络图片组件类
M2012.UI.UploadImage.InternetImageMenu = Backbone.View.extend({
	events: {
		"click a.YesButton": "onYesClick",
		"click .CloseButton": "onCloseClick"
	},
	initialize: function(options) {
		var $el = jQuery((options && options.template) || this.template);
		this.setElement($el);
	},
	template: ['<div class="tips delmailTips netpictips" style="z-index:9999;display:none;">', '<a class="delmailTipsClose CloseButton" href="javascript:;"><i class="i_u_close"></i></a>', '<div class="tips-text">', '<div class="netpictipsdiv">', '<p>插入网络照片</p>', '<p>', '<input type="text" class="iText" value="http://">', '</p>', '<p class="ErrorTip" style="color:red;display:none">图片地址格式错误</p>', '<p style="color:#666">右键点击所选图片，进入“属性”对话框，即可获取图片地址</p>', '</div>', '<div class="delmailTipsBtn"><a href="javascript:void(0)" class="btnNormal vm YesButton"><span>确 定</span></a></div>', '</div>', '<div class="tipsTop diamond covtop"></div>', '</div>'].join(""),

	render: function() {
		this.$el.appendTo(document.body);
		return this;
	},

	onCloseClick: function(e) {
		this.$(".ErrorTip").hide();
		this.hide();
	},
	onYesClick: function(e) {
		var url = this.$("input:text").val().trim();
		if (!M139.Text.Url.isUrl(url)) {
			this.$(".ErrorTip").show();
			return;
		}

		this.$(".ErrorTip").hide();
		this.hide();

		htmlEditorView.editorView.editor.insertImage(url);
		return false;
	},
	show: function(options) {
		var self = this;
		var distance, docker = options.dockElement;

		if(docker.getBoundingClientRect){
			distance = this.$el.width() + docker.getBoundingClientRect().right - $(window).width();
			if(distance < 20) distance = 20;
			this.$el.find(".diamond").css("left", 10+distance+"px");
		}
		this.$el.show();
		this.$("input").val("http://").select();

		//停靠在按钮旁边
		console.log();
		M139.Dom.dockElement(docker, this.el, {dx: -distance, dy:10});

		M139.Dom.bindAutoHide({
			stopEvent: true,
			action: "click",
			element: this.el,
			callback: function() {
				self.hide();
			}
		});
	},
	hide: function() {
		this.$el.hide();
		M139.Dom.unBindAutoHide({element: this.el});
	}
});

var ComposeMessages = {
    PleaseUploadSoon: "附件上传中，请稍后再添加新的附件",
    FileSizeOverFlow: "对不起，文件大小超出附件容量限制。",
    FileNameExist: "\"{0}\"相同的文件名已经存在,请重命名后再上传",
    FileUploadError: "文件\"{0}\'上传失败",
    FileIsUsing: "对不起，文件正在被其它应用程序占用，请关闭文件后再试。",
    GetLargeAttachFail:"获取大附件失败，请稍后再试", //"发送失败，可能是网络繁忙，请您稍后再试"
    ExistFileName:"已上传附件中存在相同文件名，请重命名后再试。",
    NoFileSize:"\"{0}\"文件大小为 0 字节，无法上传",
    FileUploadFail:"对不起，上传附件失败，请删除后重试！"
}
//上传控制器
var upload_module = {
    //须在文档未关闭前调用
    init: function (model) {
    	this.model = model;
        var t = supportUploadType = this.getSupportUpload();
        //ie678 多线程=》flash=》普通
        //ff3.6+ chrome 多线程=》普通
        //其它 普通
        //如果支持flash 创建flash上传并且 屏蔽普通上传
        //如果支持多线程上传 屏蔽普通上传和
        //如果支持截屏上传
        var isSupportCommonUpload = true;

        if (t.isSupportMultiThreadUpload) {
            upload_module_multiThread.init();
        }
        if (t.isSupportFlashUpload) {
            upload_module_flash.init();
            isSupportCommonUpload = false;
        }

        if (t.isSupportAJAXUpload) {
            upload_module_ajax.init();
            isSupportCommonUpload = false;
        }
        if (isSupportCommonUpload) {
            upload_module_common.init();
        }
		this.model.PageState = this.model.PageStateTypes.Common;
        bindAttachFrameOnload();

        if (isSupportCommonUpload || t.isSupportAJAXUpload) {
            $("#fromAttach").show();
        }
    },
    createUploadManager: function () {
        uploadManager = new UploadManager({
            container: document.getElementById("attachContainer")
        });
    },
    getSupportUpload: function () {
        var obj = {};
        obj.isSupportMultiThreadUpload = upload_module_multiThread.isSupport();
        obj.isSupportFlashUpload = upload_module_flash.isSupport();
        obj.isSupportAJAXUpload = upload_module_ajax.isSupport();
        obj.isSupportScreenShotUpload = obj.isSupportMultiThreadUpload;
        return obj;
    },
    //此函数只用来删除普通附件
    deleteFile: function (param) {
        var file = param.file;
        var fileId = file.fileId;
        var fileName = file.filePath;
        if (file.uploadType == "multiThread") {
            fileName = file.fileName;
        }
        if (isCurrentUploadAttach(fileName, fileId)) {
            var requestXml = {
                targetServer:1,
                composeId: upload_module.model.composeId,
                items: [fileId]
            };
            this.model.callApi("upload:deleteTasks", requestXml, function (result) {
                if (result.responseData["code"] == "S_OK") {
                    uploadManager.removeFile(file);
                    uploadManager.autoUpload();
                }
            });
            console.log("删除本次上传的附件:" + fileId + "," + fileName);
            //top.Debug.write("删除本次上传的附件:" + fileId + "," + fileName);
        }

        //判断是否本次上传的附件
        function isCurrentUploadAttach(fileName, fileId) {
            if (fileName.indexOf("\\") != -1 || upload_module.model.get('pageType') == "compose") {
                return true;
            }
            var dataSet = upload_module.model.get('initDataSet');
            if (dataSet.attachments) {
                for (var i = 0; i < dataSet.attachments.length; i++) {
                    if (fileId == dataSet.attachments[i].id) return false;
                }
            }
            return true;
        }
    },
    insertImgFile : function(imageUrl){
		htmlEditorView.editorView.editor.insertImage(imageUrl);
    },
    /*
    * 插入audio/video/doc/picture类型的文件预览链接到编辑器正文
    */
    insertRichMediaFile: function(fileName, fileSize){
		var ext = $T.Url.getFileExtName(fileName).toLowerCase();
		var filenameNoExt = fileName.slice(0, -ext.length-1);
		var isRichMedia = /^(?:mp3|wav|mp4|m4a|m4v|flv|docx?|pptx?|xlsx?|pdf|txt)$/i.test(ext);
		var icon = "txt.png";
		var html = "";
		var editor = htmlEditorView.editorView.editor;
		//var existed = $(editor.editorWindow.document).find('.inserted_Mark .name_container[title="'+filenameNoExt+'"]');

		var extName = "/" + ext + "/";

		var key;

		var map = {
			//"picture.png" : "/jpg/gif/png/ico/jfif/bmp/jpeg/jpe/",
			"music.png" : "/mp3/wma/wav/mod/ogg/midi/",
			"video.png" : "/flv/rmvb/rm/avi/wmv/mov/3gp/mp4/m4v/",
			"word.png" : "/doc/docx/wps/",
			"ppt.png" : "/ppt/pptx/",
			"xls.png" : "/xls/xlsx/",
			"pdf.png" : "/pdf/",
			"txt.png" : "/txt/log/ini/csv/"
		};

		/*if(existed.length > 0) {
			if(document.body.scrollIntoView){
				// todo
				// existed.blink();
			}
			return ;
		}*/

		BH({key: "compose_attach_addto_editor"});

		for(key in map){
			if(map[key].indexOf(extName) != -1 && map.hasOwnProperty(key)){
				icon = key;
				break;
			}
		}

		if(isRichMedia)
		{
			html = ['<div>',
					  '<span>&nbsp;</span>',
					  '<span class="inserted_Mark attachmentOther" contenteditable="false">',
						'<i style="display:none;width:0;height:0;font-size:0;background:transparent;opacity:0;">' + fileName + '</i>',
						'<img src="/m2012/images/module/networkDisk/images/small/' + icon + '" />',
						'<span class="name_container" title="' + filenameNoExt + '" style="color:#000;">' + (filenameNoExt.length > 28 ? filenameNoExt.substring(0, 28)+ "..." : $TextUtils.htmlEncode(filenameNoExt)) + '</span>',
						'<span class="gray">.' + ext + '</span><span class="gray">(' + fileSize + ')</span>',
						'<p class="pctrl"><a href="javascript:;" onclick="this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);return false;">移除</a></p>',
					  '</span>',
					  '<span>&nbsp;</span>',
					'</div>'].join("");
			// IE10下不能一次插入
			editor.insertHTML(html);
		}
    },
    /*
    * @see #insertRichMediaFile
    */
    removeRichMediaFile: function (fileName) {
	    var ext = $T.Url.getFileExtName(fileName);
		var filenameNoExt = fileName.slice(0, -ext.length-1);
	    htmlEditorView.editorView.editor.jEditorDocument.find(".inserted_Mark span.name_container").each(function(){
			if(this.getAttribute("title") == filenameNoExt){
				$(this).closest(".inserted_Mark").remove();
			}
	    });
    },
    deletePreuploadFile: function (fileName) {
        var requestXml = {
            composeId: upload_module.model.composeId,
            items: [fileName]
        };
        RequestBuilder.call("upload:deleteTasks", requestXml, function (result) {
            if (result["code"] == "S_OK") {
                top.Debug.write("删除本次上传的附件:" + fileName);
                upload_module.asynDeletedFile = "";
            }
        });
    }
}

//为了降低系统复杂性，旧的上传控件不再使用
upload_module_screenShot = {
    isSupport: function () {
        //抛弃旧的截屏控件，降低复杂性
        return false;
    }
}

//机械化操作
utool = {
    getMaxUploadSize: function () {
    	//套餐升级
    	var vipInfo = top.$User.getVipInfo();
        if (vipInfo && vipInfo.MAIL_2000005) {
        	
        	
        	// todo 临时代码，服务端vipinfo居然全返回0
        	var tempInt = parseInt(vipInfo.MAIL_2000005 / 1024 / 1024);
        	if(tempInt < 50){
        		return 50;
        	}
        	
        	
            return parseInt(vipInfo.MAIL_2000005 / 1024 / 1024);
        }
        return 50;
    },
    checkFileExist: function (fileName) {
        fileName = utool.getFileNameByPath(fileName);
        var list = uploadManager.fileList;
        for (var i = 0; i < list.length; i++) {
            var file = list[i];
            if (file.fileName == fileName) return true;
        }
        return false;
    },
    getUploadTipMessage: function () {
    	var tip = $T.Utils.format("添加小于{0}M的附件", [utool.getMaxUploadSize()]);
        //var tip = "添加小于{0}M的附件".format(utool.getMaxUploadSize());
        if (supportUploadType.isSupportScreenShotUpload) {
            tip += "，可使用 Ctrl+V 粘贴附件和图片";
      //} else if (document.all) {// update by tkh 由于邮箱小工具适用于所有浏览器所以document.all的判断去掉
        }else if(window.navigator.platform != "Win64" && $B.is.windows){
            tip += "<br/>安装<a hideFocus='1' style='color:blue' onclick='M139.Plugin.ScreenControl.isScreenControlSetup(true);' href='javascript:;'>邮箱小工具</a>，即可Ctrl+V粘贴上传附件"
        }
        /*
        if (supportUploadType.isSupportFlashUpload) {
            tip += "<br/>当前正在使用Flash上传组件，如果上传异常，您可以选择<a style='font-weight:bolder;color:blue;text-decoration: underline;' href='javascript:;' onclick='utool.showDisableFlashMsg();return false;'>普通上传</a>";
        }*/
        return tip;
    },
    //弹出禁用flash上传的对话框
    showDisableFlashMsg: function () {
        if (confirm("您是否要禁用Flash上传组件?")) {
            var d = new Date();
            d.setFullYear(2099);
            $Cookie.set({name : 'flashUploadDisabled',value : '1',expries : d});
            alert("Flash上传组件已经禁用，您下次打开写信页将使用原始但是稳定的上传方式。");
        }
    },
    //检测加上文件大小是否超标
    checkSizeSafe: function (size) {
        return this.getRemainSize() > size;
    },
    //获得目前已使用的控件
    getSizeNow: function () {
        var sizeNow = 0;
        var list = uploadManager.fileList;
        for (var i = 0; i < list.length; i++) {
            var file = list[i];
            if (file.fileSize) sizeNow += file.fileSize;
        }
        return sizeNow;
    },
    //获得剩余的可上传文件大小
    getRemainSize: function () {
        return this.getMaxUploadSize() * 1024 * 1024 - this.getSizeNow();
    },
    //截取文件名
    shortName: function (fileName) {
        if (fileName.length <= 30) return fileName;
        var point = fileName.lastIndexOf(".");
        if (point == -1 || fileName.length - point > 5) return fileName.substring(0, 28) + "…";
        return fileName.replace(/^(.{26}).*(\.[^.]+)$/, "$1…$2");
    },
    getFileNameByPath: function (filePath) {
        return filePath.replace(/^.+?\\([^\\]+)$/, "$1");
    },
    getFileById: function (fid) {
        var list = uploadManager.fileList;
        for (var i = 0; i < list.length; i++) {
            var f = list[i];
            if (f.fileId == fid || f.taskId == fid) {
                return f;
            }
        }
        return null;
    },
    getAttachFiles: function () {
	    var file;
        var result = upload_module.model.composeAttachs;

        //干掉没有文件名的附件2010-12-16 by lifl
        try {
            for (var i = 0; i < result.length; i++) {
                file = result[i];
                if (!file.fileName && !file.name) {
                    result.splice(i, 1);
                    i--;
                }
            }
        } catch (e) { }
        //替换fileRealSize属性
        for(var i=0;i<result.length;i++){
            file = result[i];
            if(file.fileRealSize){
                file.base64Size = file.fileSize;
                file.fileSize = file.fileRealSize;
            }
        }

        return result;
    },
    getControlUploadUrl: function (isInlineImg) {
	    var model = upload_module.model;
	    model.requestComposeId();
        var url = "http://" + window.location.host + "/RmWeb/mail?func=attach:upload&sid=" + model.sid + "&composeId=" + model.composeId;
        if(isInlineImg){
            url += "&type=internal";
        }
        return url;
    },
    getBlockUploadUrl:function(type){
	    var model = upload_module.model;
        var url = "http://" + window.location.host + "/RmWeb/mail?func=attach:upload2&sid=" + model.sid + "&composeId=" + model.composeId+"&uploadType="+type;
       
        return url;
    },

	/*
	* 获取普通上传返回给iframe的报文中的附件地址
	*/
	getControlUploadedAttachUrl: function(frame){
	    var doc = frame.contentWindow.document;
		var responseText = doc.body.innerHTML || doc.documentElement.innerHTML;
		var imageUrl = "";

		var returnObj = upload_module.model.getReturnObj(responseText);
		if (returnObj) {
			//returnObj.insertImage = true;
			//model.composeAttachs.push(returnObj);
			//uploadManager.refresh();
			imageUrl = upload_module.model.getAttachUrl(returnObj.fileId, returnObj.fileName, false);
		}
		return imageUrl;
	},

    checkUploadResultWithResponseText: function (param) {
        var text = param.responseText;
        var result = {};
        var reg = /'var':([\s\S]+?)\};<\/script>/;
        if (text.indexOf("'code':'S_OK'") > 0) {
            var m = text.match(reg);
            result = eval("(" + m[1] + ")");
            result.success = true;
            addCompleteAttach(result);
        } else {
            result.success = false;
        }
        return result;
    },
    isScreenShotUploading: function () {
        return Boolean(window.upload_module_screenShot && upload_module_screenShot.isUploading);
    },
    isImageFile: function (fileName) {
        return /\.(?:jpg|jpeg|gif|png|bmp)$/i.test(fileName);
    },
    //如果邮件没有主题，则把文件名加上
    fillSubject: function (fileName) {
        var txtSubject = document.getElementById("txtSubject");
        if (txtSubject.value == "") {
            txtSubject.value = fileName;
            top.$App.setTitle(fileName);            
            // add by tkh
            upload_module.model.autoSaveTimer['subMailInfo']['subject'] = fileName;
        }
    },
    logUpload: function(code, info) {
        //接口已不使用
    }
}
UploadLogs = {
    CommonStart: 5001,
    CommonCancel: 5002,
    CommonSuccess: 5003,
    CommonFail: 5004,
    CommonFailInfo: 5005,
    AjaxStart: 5051,
    AjaxCancel: 5052,
    AjaxSuccess: 5053,
    AjaxFail: 5054,
    AjaxFailInfo: 5055,
    FlashStart: 6001,
    FlashCancel: 6002,
    FlashSuccess: 6003,
    FlashFail: 6004,
    FlashFailInfo: 6005,
    MultiStart: 7001,
    MultiStop: 7002,
    MultiContinue: 7003,
    MultiCancel: 7004,
    MultiSuccess: 7005,
    MultiFail1: 7006,
    MultiFail2: 7007
};
//向下兼容，插入图片那个页面会调用
function getFileIdByName(fileName){
    var list = uploadManager.fileList;
    for(var i=0;i<list.length;i++){
        var f = list[0];
        if(f.filePath==fileName || f.fileName == fileName){
            return f.fileId;
        }
    }
    return null;
}
upload_module_common = {
    init: function (model) {
        var btnAttach = document.getElementById("uploadInput");
        btnAttach.onchange = function () {
            var input = this;
            var fileName = input.value;
            if(!fileName)return;
            var form = document.forms["fromAttach"];
            if (utool.checkFileExist(fileName)) {
                top.$Msg.alert(ComposeMessages.ExistFileName);
                form.reset();
                return;
            }

            (function post() {
                form.action = utool.getControlUploadUrl();
                try {
                    form.submit();
                    utool.logUpload(UploadLogs.CommonStart);
                    form.reset();
                } catch (e) {
                    $("#frmAttachTarget").attr("src", "/blank.htm").one("load", function () {
                        form.submit();
                        utool.logUpload(UploadLogs.CommonStart);
                        form.reset();
                    });
                }
                upload_module_common.showUploading(fileName);
            })();
        };
        btnAttach.onclick = function () {
        	BH({key : "compose_commonattach"});
        	
            upload_module.model.requestComposeId();
            if (uploadManager.isUploading()) {
                top.$Msg.alert(ComposeMessages.PleaseUploadSoon);
                return false;
            }
        };
    },
    //不知道进度
    showUploading: function (fileName) {
        uploadManager.uploadFile({
            fileName: fileName,
            uploadType: "common"
        });
    }
}
function bindAttachFrameOnload(){
    $("#frmAttachTarget").load(onload);
    function onload() {
        var frmAttach = window.frames["frmAttachTarget"];
        commonAttachFrameOnLoad(frmAttach);
    }
}
function commonAttachFrameOnLoad(frmAttach, isInserImage) {
    if (!window.uploadManager || !uploadManager.isUploading()) {
        if (!isInserImage) {//弹出框插入图片那里
            return;
        }
    }
    var form = document.forms["fromAttach"];

    if(frmAttach.location.href.indexOf("blank.htm")>0){
        return;
    }
    var obj = frmAttach.return_obj;
    if(obj && obj.code == "S_OK"){
        var attachInfo = obj["var"];
        attachInfo.insertImage = isInserImage;
        upload_module.model.composeAttachs.push(attachInfo);
		uploadManager.refresh(function(){
			if(upload_module.model.autoSendMail) {
				mainView.toSendMail();
			}
			form.reset();
		});
        return true;
    }else if(obj && obj.code == "FA_ATTACH_SIZE_EXCEED"){
    	top.$Msg.alert(ComposeMessages.FileSizeOverFlow);
    }else{
    	top.$Msg.confirm(
	        "附件上传失败，请重试。",
	        function(){
	            form.submit();
	        },
	        function(){
	            form.reset();
    			uploadManager.cancelUploading();
	        },
	        {
	            buttons:["重试","取消"],
	            title:"上传附件"
	        }
	    );
    }
    return false;
}
//刷新附件iframe,可以取消普通上传
function refreshAttach(onlyRefreshAttach, callback) {
    if (upload_module.model.autoSendMail) {//自动发送,需要测试
        upload_module.model.PageState = upload_module.model.PageStateTypes.Common;
        upload_module.model.autoSendMail = false;
    } else {
        if(!onlyRefreshAttach){	// todo 什么意思？
            var frmAttach = document.getElementById("frmAttachTarget");
            frmAttach.src = "blank.htm";
        }
    }
    if(upload_module.model.composeId){
        upload_module.model.callApi("attach:refresh", {id : upload_module.model.composeId}, function (result) {
            var files = result.responseData["var"];
            upload_module.model.composeAttachs = files;
            var fileList = uploadManager.fileList;
            for(var i=0; i<fileList.length; i++){
                var file = fileList[i];
                for(var j=0; j<files.length; j++){
                    if(files[j].fileId == file.fileId){
                    	files[j].insertImage = file.insertImage;
                        files[j].replaceImage = file.replaceImage;  //后台返回的附件数据没有replaceImage值，在这里加上，不然会显示内联附件列表
                    }
                }
            }
            uploadManager.refresh(callback);
        });
    }
}
 function SWFObject(swf, id, w, h, ver, c){
	this.params = new Object();
	this.variables = new Object();
	this.attributes = new Object();
	this.setAttribute("id",id);
	this.setAttribute("name",id);
	this.setAttribute("width",w);
	this.setAttribute("height",h);
	this.setAttribute("swf",swf);	
	this.setAttribute("classid","clsid:D27CDB6E-AE6D-11cf-96B8-444553540000");
	if(ver)this.setAttribute("version",ver);
	if(c)this.addParam("bgcolor",c);
}
SWFObject.prototype.addParam = function(key,value){
	this.params[key] = value;
}
SWFObject.prototype.getParam = function(key){
	return this.params[key];
}
SWFObject.prototype.addVariable = function(key,value){
	this.variables[key] = value;
}
SWFObject.prototype.getVariable = function(key){
	return this.variables[key];
}
SWFObject.prototype.setAttribute = function(key,value){
	this.attributes[key] = value;
}
SWFObject.prototype.getAttribute = function(key){
	return this.attributes[key];
}
SWFObject.prototype.getVariablePairs = function(){
	var variablePairs = new Array();
	for(key in this.variables){
		variablePairs.push(key +"="+ this.variables[key]);
	}
	return variablePairs;
}
SWFObject.prototype.getHTML = function(){
	var con = '';
	if (navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) {
		con += '<embed class="flash" type="application/x-shockwave-flash"  pluginspage="http://www.macromedia.com/go/getflashplayer" src="'+ this.getAttribute('swf') +'" width="'+ this.getAttribute('width') +'" height="'+ this.getAttribute('height') +'"';
		con += ' id="'+ this.getAttribute('id') +'" name="'+ this.getAttribute('id') +'" ';
		for(var key in this.params){ 
			con += [key] +'="'+ this.params[key] +'" '; 
		}
		var pairs = this.getVariablePairs().join("&");
		if (pairs.length > 0){ 
			con += 'flashvars="'+ pairs +'"'; 
		}
		con += '/>';
	}else{
		con = '<object class="flash" id="'+ this.getAttribute('id') +'" classid="'+ this.getAttribute('classid') +'"  codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=11,0,0,0" width="'+ this.getAttribute('width') +'" height="'+ this.getAttribute('height') +'">';
		con += '<param name="movie" value="'+ this.getAttribute('swf') +'" />';
		for(var key in this.params) {
		 con += '<param name="'+ key +'" value="'+ this.params[key] +'" />';
		}
		var pairs = this.getVariablePairs().join("&");
		if(pairs.length > 0) {con += '<param name="flashvars" value="'+ pairs +'" />';}
		con += "</object>";
	}
	return con;
}
SWFObject.prototype.write = function(elementId){	
	if(typeof elementId == 'undefined'){
		document.write(this.getHTML());
	}else{
	    var n = document.getElementById(elementId);
	    //n.innerHTML = this.getHTML();
	    if (!n) {
	        n = $(elementId);
	    }
	    $(n).append(this.getHTML());
	}
}
﻿var upload_module_flash = {
    init: function() {
        //var url = "/m2012/flash/Richinfo_annex_upload.swf";
        var url = "/m2012/flash/muti_upload.swf?v="+Math.random();
        
        var so = new SWFObject(url, "flashplayer", "70", "20");
        so.addParam("wmode","transparent");
        so.write("#floatDiv");
        
        
        //增加检测flash是否正常运作的机制
        //3秒后如果flash不能正常运行，则弄成普通上传
        setTimeout(function () {
            if (!upload_module_flash.isRealOK) {
                var reset = false;
                try {
                    if (!document.getElementById("flashplayer").upload) {
                        reset = true;
                    }
                    UploadFacade.init();
                } catch (e) {
                    reset = true;
                }
                if (reset) resetCommonUpload();
            }
        }, 3000);
        function resetCommonUpload() {
           
            upload_module_common.init();
            $("#fromAttach").show();
            supportUploadType.isSupportFlashUpload = false;
            $T.Cookie.set({name : 'flashUploadDisabled',value : '1'});
            document.getElementById("flashplayer").style.display = "none";
        }
    },
    upload: function (taskId) {

        var file = utool.getFileById(taskId);
		var isLargeAttach = false;
        function startUpload() {
            UploadFacade.upload(taskId);
            if(isLargeAttach){
	           file.isLargeAttach =true; 
            }
            file.state = "uploading";
            file.updateUI();
        }
        if (file.taskId == window.firstTaskId) {  //第1个文件

            var isShow = UploadLargeAttach.isShowLargeAttach(file, 'flash',function () {
				if(UploadLargeAttach.isLargeAttach == true){
					isLargeAttach = true;
				}
				
                startUpload();
            });
            if (!isShow) { startUpload(); }

           
        } else {   //后面的文件直接上传，不再判断大小
            startUpload();

        }

        

        //utool.logUpload(UploadLogs.FlashStart);
    },
    cancel: function (file) {
        file.isCancel = true;
        //UploadLargeAttach.cancelForWaiting(file);
        var fileId= window.currentFileId
       
        window.currentFileId = null;
        window.currentSip = null;

        
        uploadManager.removeFile(file);
        uploadManager.autoUpload();
        try{
            UploadFacade.cancel(file.taskId);
        } catch (ex) { }
        /*
        var requestXml = {
            composeId: upload_module.model.composeId,
            items: [fileId]
        };
        window.setTimeout(function () { //加延时，等待后台执行完当前分块（后台没有修改之前的容错代码）
            upload_module.model.callApi("upload:deleteTasks", requestXml, function (result) {
                uploadManager.removeFile(file);
                uploadManager.autoUpload();
            });
        }, 2000);
        */
        //utool.logUpload(UploadLogs.FlashCancel);
    },
    isSupport: function() {
        //由于其它浏览器不发送Coremail Cookie 所以flash上传暂时只支持ie
        if (document.all && window.ActiveXObject !== undefined) {
            //用户曾经手动触发禁用flash上传
        	/*
            if (Utils.getCookie("flashUploadDisabled") == "1") {
                return false;
            } 
            */           
			try {
                var flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.10");
            } catch (e) {
                try {
                    var flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.9");
                } catch (e) { }
            }
            if (flash) return true;
        }
        return false;
    }
}
UploadFacade = {
    getFlashObj:function(){
        return document.getElementById("flashplayer");
    },
    init: function () {
        var uploadUrl = utool.getBlockUploadUrl("flash");
        console.log(uploadUrl);
        this.getFlashObj().setUploadUrl(uploadUrl);

        this.getFlashObj().setOptions({});
    },
    getUploadUrl: function () {
        if (UploadLargeAttach.enable) {//超大附件
            console.log("upload url:" + UploadLargeAttach.uploadUrl);
            return UploadLargeAttach.uploadUrl;
        }
        var result = utool.getBlockUploadUrl("flash");
        console.log("upload url2:" + result);
        return result;
    },
    onclick: function() {
        //upload_module.model.requestComposeId();
        if (!upload_module.model.composeId) {
            upload_module.model.composeId = Math.random();
        }
        
        return true;
    },
    _blockInfo:{},
    getBlockInfo:function(){
    
    },
    onrequest: function (args) {
        var result;
        if (UploadLargeAttach.enable) {
            result = UploadLargeAttach.postParams;
            //result["Filename"] = result["filename"];
            result["range"] = args.offset + "-" + (Number(args.offset) + (Number(args.length)-1)).toString();

        } else {

            result = {
                type: 1,
                //fileid: null,
                filesize: args.fileSize,
                timestamp: new Date().toDateString(),
                range: args.offset + "-" + (Number(args.offset) + Number(args.length)).toString()
                //sip:null
            }
            if (window.currentFileId) {
                result.fileid = window.currentFileId;
                result.sip = window.currentSip;
            }
        }


        return result;
    },
    onprogress:function(args){
        if (args.data.indexOf("middleret") > 0) {
            args.data = UploadLargeAttach.responseConvert(args.data);
        }
        var fileId = args.data.match(/["']fileId["']:["'](.+?)["']/)[1];
        var sip = args.data.match(/["']sip["']:["'](.+?)["']/)[1];
        if (!window.currentFileId) {    //同一个文件不重新赋值fileId，避免切换服务器时返回不同的fileId
            window.currentFileId = fileId;
        }
        window.currentSip = sip;
        //alert(args.percent);
        if (window.currentSip && !UploadLargeAttach.enable) { //重设上传url，增加sip参数提升服务端性能，需要排除超大附件上传
            var urlNew = utool.getBlockUploadUrl("flash") + "&sip=" + window.currentSip;
            this.getFlashObj().setUploadUrl(urlNew);
            //alert(urlNew);
        }

        var taskId = args.taskId;
        var file = utool.getFileById(taskId);
        if (!file) return;
        file.state = "uploading";
        file.sendedSize = args.bytesLoaded;
        file.uploadSpeed = args.speed;
        console.log("上传速度" + file.uploadSpeed);
        file.progress = args.percent;
        file.updateUI();
        
        if (file.uploadSpeed < 30000) {
            M139.Logger.sendClientLog({
                level: "INFO",
                name: "upload speed is too slow",
                errorMsg: "speed:" + file.uploadSpeed + "|filename:" + file.fileName
            });
        }
        if (this.retryCount > 0 && !this.retryLogSended) { //重试次数大于0，表示是上传重试恢复的，上报日志
            M139.Logger.sendClientLog({
                level: "INFO",
                name: "upload fail retry",
                errorMsg: "retry ok," +file.fileName
            });
            this.retryLogSended = true;
        }

        this.monitorTimeout(fileId, file);
        this.lastSendedTime = new Date();

    },
    monitorTimeout: function (fileId,file) { //监控1个分块上传时间超过20秒，认为网络问题，自动续传
        var self = this;
        if (this.timeoutId) { 
            window.clearTimeout(this.timeoutId);//作好清理
        }
        this.timeoutId = window.setTimeout(function () {
            var self = this;
            if (fileId != window.currentFileId || file.progress == 100) {
                return;
            } else {
                var msg = "上传超时,fileName:" + file.fileName +"|fileSize:"+file.fileSize+ "|progress:" + file.progress + "%";
                console.warn(msg);
                
                M139.Logger.sendClientLog({
                    level: "ERROR",
                    name: "request timeout",
                    errorMsg: msg
                });

                UploadFacade.getFlashObj().uploadResume();
            }
        },15000);  
    },

    oncomplete: function (args) {
        window.currentFileId = null;
        window.currentSip = null;
        if (args.data.indexOf("middleret") > 0) {
            args.data = UploadLargeAttach.responseConvert(args.data);
        }

        var file = utool.getFileById(args.taskId);
        var result = utool.checkUploadResultWithResponseText({ fileName: file.filePath, responseText: args.data });
        if (result.success) {
            file.state = "complete";
            file.fileId = result.fileId;
            file.updateUI();

            UploadLargeAttach.completeUpload(file);
            utool.logUpload(UploadLogs.FlashSuccess);
        } else {
            file.state = "error";
            //file.updateUI();
            //FF.alert("文件上传失败，请删除后重试！");
            top.$Msg.alert('文件上传失败，请删除后重试！', {
                onclose: function (e) {
                    //e.cancel = true;//撤销关闭
                }
            });
            utool.logUpload(UploadLogs.FlashFailInfo);
        }
        uploadManager.autoUpload();
    },
    onselect: function (args) {
        var list = [];
        for(var i=0;i<args.length;i++){
            var item = args[i];
            var obj = {
                taskId: item.taskId,
                idx:i,
                fileName: decodeURIComponent(item.fileName),
                fileSize: item.fileSize,
                state:item.status,
                uploadType: "flash"
            };
            if (item.fileSize > 0) {
                list.push(obj);
            } else {
                $Msg.alert("文件：\"" + decodeURIComponent(item.fileName) + "\"大小为0字节，请重新选择");
                return false;
            }
            
        }
        if (list.length > 0) {
            window.firstTaskId = list[0].taskId;
            var checkResult = uploadManager.uploadFile(list);
            if (checkResult == false) { 
                return false;
            }
        }
        /*
        var self = this;
        var isShow=UploadLargeAttach.isShowLargeAttach(args, function () {
            self.getFlashObj().upload(true);
        });
        

        if (!isShow) {
            this.getFlashObj().upload(false);
        }*/
    },
    onloadcomplete: function (args) {
        //alert("onloadcomplete");
        var self = this;
        var file = utool.getFileById(args.taskId);
        if (args.isLarge) {
            file.md5 = args.md5;
            UploadLargeAttach.prepareUpload(file, function (postParams) {
                self.getFlashObj().setUploadUrl(file.uploadUrl);
                self.getFlashObj().uploadRequest();
            });
        }
    },
    onerror: function (args) {
        //alert(args.taskId);
        var self = this;
        var file = utool.getFileById(args.taskId);
        
        if (file) {
            file.state = "blockerror";
            file.updateUI();
        }
        M139.Logger.sendClientLog({
            level: "ERROR",
            name: "I/O Error",
            errorMsg: "fileName:"+file.fileName+"|error:"+args.error
        });
        if (this.timeoutId) {
            window.clearTimeout(this.timeoutId);//清理掉超时监控，避免两个自动续传同时进行
        }
        if (this.retryCount <= 3) {
            setTimeout(function () {
                self.uploadResume();
            }, 5000);
        }
        /*var self = this;
        $Msg.confirm("上传中断，是否续传", function () {
            self.getFlashObj().uploadResume();
        });*/
    },
    uploadResume: function () {
        this.retryCount++;
        this.getFlashObj().uploadResume();
        M139.Logger.sendClientLog({
            level: "INFO",
            name: "upload fail retry",
            errorMsg: "time:" + new Date().toString() + "|retryCount:" + this.retryCount
        });
        BH("compose_upload_resume");
    },
    onmouseover: function () {
    },
    onmouseout: function () {
    },
    upload: function (taskId) {//第一个文件开始上传时调用
        this.retryCount = 0;
        this.lastSendedTime = new Date();
        var needMd5 = UploadLargeAttach.enable;
        this.getFlashObj().upload(needMd5);
        //var flash = document.getElementById("flashplayer");
        //flash.upload(taskId);
    },
    cancel: function (taskId) {
        this.getFlashObj().cancel(taskId);
        //var flash = document.getElementById("flashplayer");
        //flash.cancel(taskId);
    }
}

var upload_module_multiThread = {
    init: function (isDocumentClosed) {
        MultiThreadUpload.create(isDocumentClosed);
        /*
        var realUploadButton = document.getElementById("realUploadButton");
        realUploadButton.onclick = function () {
            requestComposeId();
            var files = MultiThreadUpload.showDialog();
            addUploadType(files);
            uploadManager.uploadFile(files);
            return false;
        };
        */
        //截屏
        captureScreen = function () {
            if (uploadManager.isUploading()) {
            	top.$Msg.alert(ComposeMessages.PleaseUploadSoon,{
			        onclose:function(e){
			            //e.cancel = true;//撤销关闭
			        }
			    });
                //FF.alert(ComposeMessages.PleaseUploadSoon);
                return;
            }
            MultiThreadUpload.screenShot();
        }
        //向下兼容
        captureClipboard = function () {
        	if(window.loadCaptureTime && new Date()-window.loadCaptureTime<1000){
        		return ;
        	}
        	window.loadCaptureTime=new Date();
        	return checkAndUploadClipboardData();
        };
        //新的控件，截屏完成后要手动触发上传
        MultiThreadUpload.onScreenShot = function (file) {
            file.insertImage = true;
            file.uploadType = "multiThread";
            uploadManager.uploadFile(file);
            //top.addBehavior("成功插入截屏");
        };
        function checkAndUploadClipboardData() {
            var data = MultiThreadUpload.getClipboardData();
            //截屏后默认使用多线程上传
            var files = [];
            var isInlineImg = false;
            //有时候会存在截屏以后，剪贴板之前复制的文件还留着，所以只取一样
            if (data.copyFiles.length > 0) {   //复制文件 .jpg格式的也不作内联图片处理
                files = data.copyFiles;
            } else if (data.imageFiles.length > 0) {  //复制图片（从word，qq对话框等复制的图片）
                files = data.imageFiles;
                isInlineImg = true;
            } else if (data.htmlFiles.length > 0) {
                files = data.imageFiles;
            }
            if (files.length > 0) {
                //top.addBehavior("写信-粘贴附件");
                if (uploadManager.isUploading()) {
                	top.$Msg.alert(ComposeMessages.PleaseUploadSoon,{
				        onclose:function(e){
				            //e.cancel = true;//撤销关闭
				        }
				    });
                    //FF.alert(ComposeMessages.PleaseUploadSoon);
                    return;
            	}
            }else{// add by tkh files.length == 0表示复制的不是文件
            	return;
            }
            var replaceImage = data.html ? true : false;
            addUploadType(files);
            /*//如果粘贴的是图片
            if (files.length == 1) {
                addInsertImageFlag(files,replaceImage);
            } else if (files.length > 1) {
                var imageCount = 0;
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    if (utool.isImageFile(file.fileName)) imageCount++;
                }
                if (imageCount > 1) {
                    if (window.confirm("您粘贴的附件中有多张图片，上传后是否全部插入到正文中？")) {
                        addInsertImageFlag(files,replaceImage);
                    }
                }
            }*/
            //如果是内联图片
            if(isInlineImg){
                addInsertImageFlag(files,replaceImage);
            }
            uploadManager.uploadFile(files);

            if (files.length > 0){
            	if(data.html){
            		upload_module_multiThread.html=data.html;
            	}
           		return false; //取消默认得粘贴动作
            } 
        }
        function addUploadType(arr) {
            $(arr).each(function () { this.uploadType = "multiThread" });
        }
        function addInsertImageFlag(files,replaceImage) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (utool.isImageFile(file.fileName)) {
                    if(replaceImage){
                        file.replaceImage = true;
                    }else{
                        file.insertImage = true;
                    }
                }
            }
        }
    },
    upload: function (file) {
        //默认使用多线程上传
        /*
        var isMultiThreadUpload = true;
        if (top.SiteConfig.multiThreadUploadReleaseFlag == 0) {
        isMultiThreadUpload = false;
        } else if (top.SiteConfig.multiThreadUploadReleaseFlag == 1 && !top.UserData.IsTestUserNumber) {
        isMultiThreadUpload = false;
        }
        */
        var isMultiThreadUpload = false; //richmail 还不支持多线程
        if (isMultiThreadUpload) {
            MultiThreadUpload.upload(file);
        } else {
            MultiThreadUpload.commandUpload(file);
        }
    },
    cancel: function (file) {
        MultiThreadUpload.cancel(file);
    },
    isSupport: function () {
        if (navigator.userAgent.indexOf("Opera") > -1) {
            return false;
        }
        if (navigator.userAgent.indexOf("Opera") > -1) {
            return false;
        }
        if (window.ActiveXObject !== undefined) {
            try {
                var obj = new ActiveXObject("RIMail139ActiveX.InterfaceClass");
                var version = obj.Command("<param><command>common_getversion</command></param>");
                return true;
            } catch (e) {
                return false;
            }
        } else {
            var mimetype = navigator.mimeTypes && navigator.mimeTypes["application/x-richinfo-mail139activex"];
            if (mimetype && mimetype.enabledPlugin) {
                return true;
            }
        }
        return false;
    }
}
MultiThreadUpload = {
    create: function (isDocumentClosed) {
        var elemenetID = "mtUploader" + Math.random();
        if ($.browser.msie || $B.is.ie11) {
            var htmlCode = '<OBJECT style="display:none" width="0" height="0" id="' + elemenetID + '" CLASSID="CLSID:63A691E7-E028-4254-8BD5-BDFDB8EF6E66"></OBJECT>';
        } else {
            var htmlCode = '<div style="height:0;width:0;overflow:hidden;"><embed id="' + elemenetID + '" type="application/x-richinfo-mail139activex" height="0" width="0" hidden="true"></embed></div>';
        }
        if (upload_module.model.isFirefox) {
            $(htmlCode).appendTo(top.document.body);
        } else if (isDocumentClosed || (top && top.$App && top.$App.isReadSessionMail && top.$App.isReadSessionMail())) {// 兼容会话邮件写信页
            $(htmlCode).appendTo(document.body);
        } else {
            document.write(htmlCode);
        }
        if (upload_module.model.isFirefox) {
            var obj = top.document.getElementById(elemenetID);
        } else {
            var obj = document.getElementById(elemenetID);
        }
        this.control = obj;
    },
    doCommand: function (commandName, commandData) {
        var returnXml = this.control.Command(commandData);
        switch (commandName) {
            case "getopenfilename":
                {
                    return _getopenfilename();
                }
            case "getscreensnapshot":
                {
                    return _getscreensnapshot();
                }
            case "getlastscreensnapshot":
                {
                    //获得最后一次截屏的时间
                    return _getlastscreensnapshot();
                }
            case "getclipboardfiles":
                {
                    return _getclipboardfiles();
                }
            case "getversion":
                {
                    return _getversion();
                }
            case "upload":
                {
                    return _upload();
                }
            case "suspend":
                {
                    return _suspend();
                }
            case "continue":
                {
                    return _continue();
                }
            case "cancel":
                {
                    return _cancel();
                }
            case "getstatus":
                {
                    return _getstatus();
                }
            case "setbreakpointstorepoint":
                {
                    return _setbreakpointstorepoint();
                }
            case "commonupload":
                {
                    return _commonupload();
                }
        }
        function _commonupload() {
            return returnXml.indexOf("<result>0</result>") > 0;
        }
        function _getopenfilename() {
            var doc = $TextUtils.getXmlDoc(returnXml);
            var jDoc = $(doc);
            var files = [];
            jDoc.find("file").each(function () {
                var jObj = $(this);
                var item = {
                    filePath: jObj.find("name").text(),
                    fileSize: parseInt(jObj.find("size").text())
                };
                item.fileName = item.filePath;
                files.push(item);
            });
            return files;
        }
        function _getclipboardfiles() {
            var doc = $TextUtils.getXmlDoc(returnXml);
            var jDoc = $(doc);
            var result = {
                text: "",
                html: "",
                htmlFiles: "",
                imageFiles: [],
                copyFiles: [],
                otherFiles: []
            };
            result.text = jDoc.find("CF_TEXT").text();
            //result.html = jDoc.find("CF_HTML Fragment").text().decode();
            //result.html = M139.Text.Html.decode(jDoc.find("CF_HTML Fragment").text());
            result.html = jDoc.find("CF_HTML Fragment").text();
            jDoc.find("CF_HTML file").each(function () {
                var jObj = $(this);
                var item = {
                    filePath: jObj.find("name").text(),
                    fileSize: parseInt(jObj.find("size").text())
                };
                item.fileName = item.filePath;
                result.imageFiles.push(item);
            });
            jDoc.find("CF_BITMAP file").each(function () {
                var jObj = $(this);
                var item = {
                    filePath: jObj.find("name").text(),
                    fileSize: parseInt(jObj.find("size").text())
                };
                item.fileName = item.filePath;
                result.imageFiles.push(item);
            });
            jDoc.find("CF_HDROP file").each(function () {
                var jObj = $(this);
                var item = {
                    filePath: jObj.find("name").text(),
                    fileSize: parseInt(jObj.find("size").text())
                };
                item.fileName = item.filePath;
                result.copyFiles.push(item);
            });
            jDoc.find("CF_OTHERS file").each(function () {
                var jObj = $(this);
                var item = {
                    filePath: jObj.find("name").text(),
                    fileSize: parseInt(jObj.find("size").text())
                };
                item.fileName = item.filePath;
                result.otherFiles.push(item);
            });
            return result;
        }
        function _getlastscreensnapshot() {
            var doc = $TextUtils.getXmlDoc(returnXml);
            var jDoc = $(doc);
            var time = new Date(parseInt(jDoc.find("time").text()));
            var oprResult = parseInt(jDoc.find("oprResult").text());
            if (oprResult == 0) {
                var file = {
                    filePath: jDoc.find("name:eq(0)").text(),
                    fileSize: parseInt(jDoc.find("size:eq(0)").text())
                };
                file.fileName = file.filePath;
            }
            return {
                time: time,
                oprResult: oprResult,
                file: file
            };
        }
        function _getscreensnapshot() {
            return returnXml.indexOf("<result>0</result>") > 0;
        }
        function _getversion() {
            return parseInt(returnXml.replace(/\D+/g, ""));
        }
        function _upload() {
            return returnXml.indexOf("<result>0</result>") > 0;
        }
        function _suspend() {
            return returnXml.indexOf("<result>0</result>") > 0;
        }
        function _continue() {
            return returnXml.indexOf("<result>0</result>") > 0;
        }
        function _cancel() {
            return returnXml.indexOf("<result>0</result>") > 0;
        }
        function _setbreakpointstorepoint() {
            return returnXml.indexOf("<result>0</result>") > 0;
        }
        function _getstatus() {
            if (returnXml != "<return />") {
            	//top.Debug.write(returnXml);
            	// todo M139.Logger.debug(returnXml);
            }
            var doc = top.$TextUtils.getXmlDoc(returnXml);
            var jDoc = $(doc);
            var files = [];
            jDoc.find("file").each(function () {
                var file = $(this);
                var obj = {
                    taskId: file.find("taskId").text(),
                    fileName: file.find("fileName").text(),
                    status: file.find("status").text(),
                    attachId: file.find("attachId").text(),
                    totalSize: parseInt(file.find("totalSize").text()),
                    completedSize: parseInt(file.find("completedSize").text()),
                    transSpeed: parseInt(file.find("transSpeed").text()),
                    needTime: parseInt(file.find("needTime").text()),
                    stopReason: file.find("stopReason").text(),
                    errorCode: file.find("errorCode").text()
                };
                //普通上传
                if (returnXml.indexOf("<httpSvrPostResp>") != -1) {
                    obj.isCommonUpload = true;
                    var responseText = file.find("httpSvrPostResp").text();
                    var p = { responseText: responseText, fileName: utool.getFileNameByPath(obj.fileName) };
                    var result = utool.checkUploadResultWithResponseText(p);
                    if (result.success) {
                        obj.attachId = result.fileId;
                    }
                }
                files.push(obj);
            });
            return files;
        }
    },
    getClipboardData: function () {
        var command = "<param><command>localfile_getclipboardfiles</command></param>";
        var data = this.doCommand("getclipboardfiles", command);
        return data;
    },
    getVersion: function () {
        var command = "<param><command>getversion</command></param>";
        var version = this.doCommand("getversion", command);
        return version;
    },
    showDialog: function () {
        var command = "<param><command>localfile_getopenfilename</command><title>请选择要上传的文件</title><filter>*.*</filter></param>";
        var files = this.doCommand("getopenfilename", command);
        return files;
    },
    uploadFileCount: 0,
    //多线程上传(特殊协议)
    upload: function (file) {
        var command = "<param>\
            <command>attachupload_upload</command>\
            <taskId>{taskId}</taskId>\
            <svrUrl>{svrUrl}</svrUrl>\
            <sid>{sid}</sid>\
            <composeId>{composeId}</composeId>\
            <referer></referer>\
            <cookie>{cookie}</cookie>\
            <filePathName>{fileName}</filePathName>	\
            <size>{fileSize}</size>\
            </param>";
        var param = {
            svrUrl: "http://" + location.host + "/coremail/s",
            sid: upload_module.model.sid,
            composeId: upload_module.model.composeId,
            fileName: top.encodeXML(file.filePath),
            fileSize: file.fileSize,
            taskId: file.taskId,
            cookie: top.$T.Utils.format("Coremail={0}; Coremail.sid={1}", [$T.Cookie.get("Coremail"),$T.Cookie.get("Coremail.sid")])
        };
        command = top.$T.Utils.format(command, param);
        var success = this.doCommand("upload", command);
        if (success) {
            file.state = "uploading";
            file.updateUI();
            this.startWatching();
            this.uploadFileCount++;

            utool.logUpload(UploadLogs.MultiStart);
        } else {
            file.state = "error";
            uploadManager.removeFile(file);
        }
    },
    commandUpload: function (file) {
    	var isInlineImg = false;
		if(file.insertImage || file.replaceImage) { isInlineImg = true; }
        var command = "<param>\
            <command>attachupload_commonupload</command>\
            <taskId>{taskId}</taskId>\
            <svrUrl>{svrUrl}</svrUrl>\
            <cookie>{cookie}</cookie>\
            <filePathName>{fileName}</filePathName>\
            <size>{fileSize}</size>\
            </param>";
        var param = {
            //svrUrl: top.encodeXML(utool.getControlUploadUrl(isInlineImg)),
            //fileName: top.encodeXML(file.filePath),
            svrUrl: $T.Xml.encode(utool.getControlUploadUrl(isInlineImg)),
            fileName: $T.Xml.encode(file.filePath),
            fileSize: file.fileSize,
            taskId: file.taskId,
            cookie: top.$T.Utils.format("Coremail={0}; Coremail.sid={1}; aTestCookie=123", [$T.Cookie.get("Coremail"),$T.Cookie.get("Coremail.sid")])
        };
        command = top.$T.Utils.format(command, param);
        //top.Debug.write(command);
        var success = this.doCommand("commonupload", command);
        if (success) {
            file.state = "uploading";
            file.updateUI();
            this.startWatching();
            this.uploadFileCount++;
        } else {
            file.state = "error";
            uploadManager.removeFile(file);
        }
    },
    "continue": function (item) {
        var command = "<param><command>attachupload_continue</command><taskId>" + item.taskId + "</taskId></param>";
        var success = this.doCommand("continue", command);
        if (success) {
            //item.uploadFlag = MultiThreadUpload.UploadFlags.Uploading;
            //item.render();
            this.startWatching();
        }
        return success;
    },
    //截屏后要主动轮训是否有截屏操作
    startCheckClipBoard: function () {
        var This = this;
        var lastAction = This.getLastScreenShotAction();
        clearInterval(This.checkClipBoardTimer);
        This.checkClipBoardTimer = setInterval(function () {
            var result = This.getLastScreenShotAction();
            if (result.time.getTime() != lastAction.time.getTime()) {
                clearInterval(This.checkClipBoardTimer);
                if (result.oprResult == 0) {//0表示有截屏，否则表示用户取消
                    if (This.onScreenShot) This.onScreenShot(result.file);
                }
            }
        }, 1000);
    },
    getStatus: function () {
        var result = this.doCommand("getstatus", "<param><command>attachupload_getstatus</command></param>");
        return result;
    },
    stop: function (item) {
        if (item) {
            var command = "<param><command>attachupload_suspend</command><taskId>" + item.taskId + "</taskId></param>";
            var success = this.doCommand("suspend", command);
            if (success) {
                //item.uploadFlag = MultiThreadUpload.UploadFlags.Stop;
                //item.render();
            }
            return success;
        }
    },
    cancel: function (item) {
        if (item) {
            var command = "<param><command>attachupload_cancel</command><taskId>" + item.taskId + "</taskId></param>";
            var success = this.doCommand("cancel", command);
            var file = utool.getFileById(item.taskId);
            if (success && file) {
                if (this.uploadFileCount > 0) this.uploadFileCount--;
                uploadManager.removeFile(file);
            }
            utool.logUpload(UploadLogs.MultiCancel);
        }
    },
    //截屏
    screenShot: function () {
        var result = this.doCommand("getscreensnapshot", "<param><command>screensnapshot_getscreensnapshot</command></param>");
        if (result) this.startCheckClipBoard();
        return result;
    },
    //得到最后一次截屏操作的时间
    getLastScreenShotAction: function () {
        var result = this.doCommand("getlastscreensnapshot", "<param><command>screensnapshot_getlastscreensnapshot</command></param>");
        return result;
    },
    startWatching: function () {
    	//alert('startWatching startWatching!!');
        var This = this;
        if (!this.watchTimer) {
            this.watchTimer = setInterval(function () {
                try {
                    This.test();
                } catch (e) { }
            }, 300);
        }
    },
    stopWatching: function () {
        clearInterval(this.watchTimer);
        this.watchTimer = 0;
        top.Debug.write("stopWatching");
    },
    test: function () {////////////////////////////////代码走到这里
        var This = this;
        var files = This.getStatus();
        //console.log("getStatus:" + files.length);
        if (this.uploadFileCount == 0) {
            this.stopWatching();
        }
        for (var i = 0; i < files.length; i++) {
            var obj = files[i];
            //alert('taskId :::::'+obj.taskId);
            if (obj && obj.taskId) {
                var file = utool.getFileById(obj.taskId);
                if (!file) {
                    top.Debug.write("已经移除的taskId：" + obj.taskId);
                    return;
                }
                if (obj.status < 4) {
                    file.sendedSize = obj.completedSize;
                    file.uploadSpeed = obj.transSpeed;
                    file.needTime = obj.needTime;
                    file.progress = parseInt(((file.sendedSize / file.fileSize) || 0) * 100);
                    file.state = "uploading";
                    file.fileId = obj.attachId;
                    file.updateUI();
                } else {
                    if (obj.status == 4) {
                        if (obj.stopReason == 1) {
                            if (obj.isCommonUpload) {
                                if (obj.attachId) {
                                    file.state = "complete";
                                    file.fileId = obj.attachId;
                                    file.updateUI();
                                    if (file.insertImage) {
                                        // insertAttachImage(obj.attachId, obj.fileName);
                                        upload_module.model.active();// 激活写信页
                                        var imageUrl = upload_module.model.getAttachUrl(obj.attachId, obj.fileName, false);
                                        htmlEditorView.editorView.editor.insertImage(imageUrl);
                                    }else if(file.replaceImage){
                                        replaceAttachImage(obj.attachId, obj.fileName);
                                        /**
                                         * @modify by wn
                                         * 2014-7-30
                                         * 显示图片栏小工具
                                         */
                                        top.$App.showImgEditor( $(htmlEditorView.editorView.editor.editorDocument).find('body') );                  
                                    }
                                }
                            } else {
                                file.state = "complete";
                                file.fileId = obj.attachId;
                                file.updateUI();
                                if (file.insertImage) {
                                    //insertAttachImage(obj.attachId, obj.fileName);
                                    var imageUrl = upload_module.model.getAttachUrl(obj.attachId, obj.fileName, false);
                                    htmlEditorView.editorView.editor.insertImage(imageUrl);
                                }
                            }
                            utool.logUpload(UploadLogs.MultiSuccess);
                        } else if (obj.stopReason == 2) {
                            //fileInfo.uploadFlag = MultiThreadUpload.UploadFlags.Stop;
                            //fileInfo.render();
                        } else if (obj.stopReason == 3) {
                            //fileInfo.remove();
                        } else if (obj.stopReason == 0) {
                            //假停止
                            this.uploadFileCount++;
                        } else if (obj.stopReason == 4) {
                            if (obj.errorCode && /^(5|6|17|24)$/.test(obj.errorCode)) {
                                utool.logUpload(UploadLogs.MultiFail2, "errorCode=" + obj.errorCode);
                            } else {
                                utool.logUpload(UploadLogs.MultiFail1, "errorCode=" + obj.errorCode);
                            }
                        }
                    }
                    if (this.uploadFileCount > 0) this.uploadFileCount--;
                    if (obj.status == 4) uploadManager.autoUpload();
                    
                    if (obj.stopReason > 2) {
                        var errorLog = "multiThread upload fail,stopReason:{stopReason},fileName:{fileName},fileSize:{fileSize},sendedSize:{sendedSize}";
                        try {
                            errorLog = top.$T.Utils.format(errorLog, {
                                stopReason: obj.stopReason,
                                fileName: file.fileName,
                                fileSize: file.fileSize,
                                sendedSize: file.sendedSize
                            });
                            uploadManager.onUploadError(errorLog);
                        } catch (e) { }
                    }
                }
            }
        }
    }
}
//todo 这是老代码直接拷贝过来,从word复制内容粘贴兼容性处理
function replaceAttachImage(fileId, fileName) {
    if (upload_module_multiThread.html) { //图文混排
        var html = upload_module_multiThread.html
                   .replace(/\<\!\[if \!vml\]\>/ig, "")
                   .replace(/\<\!\[endif\]\>/ig, "")
                   .replace(/\<v:imagedata/ig,'<img'); //有些word图片会生成<v:imagedata，需替换成<img
        htmlEditorView.editorView.editor.insertHTML(html);
        upload_module_multiThread.html = "";//清空
    }
    var url = upload_module.model.getAttachUrl(fileId, fileName, true);
    htmlEditorView.editorView.editor.replaceImage(fileName, url);
}
/*
status – 任务状态。1：准备上传；2：开始上传；3：正在上传；4：停止上传。
totalSize – 要传文件的大小。status为2时有效。
completedSize – 已完成大小。status为2时有效。
transSpeed – 上传速度。单位是byte/s。status为2时有效。
needTime – 剩余时间。单位是s。status为2时有效。
stopReason – 停止原因。1：完成；2：暂停；3：取消；4：出错。status为3时有效。
errorCode – 失败码。1：网络错误；2：URL无效；3：内存不足…（待定）。status为4且stopReason为4时有效。
*/
//为了降低系统复杂性，旧的上传控件不再使用
upload_module_screenShot = {
    isSupport: function () {
        //抛弃旧的截屏控件，降低复杂性
        return false;
    }
}
﻿var upload_module_ajax = {
    init: function() {
        document.body.addEventListener("dragenter", _dragenter, false);
        document.body.addEventListener("dragover", _dragover, false);
        document.body.addEventListener("drop", _drop, false);

        //如果支持控件上传，点击附件按钮不使用ajax上传，只在拖放时应用
        //if (supportUploadType.isSupportMultiThreadUpload) return;

        var uploadInput = document.getElementById("uploadInput");
        uploadInput.onmouseover = function() {
            upload_module.model.requestComposeId();
            //requestComposeId();
            uploadInput.onmouseover = null;
        }
        uploadInput.setAttribute("multiple", true);
        uploadInput.onchange = function() {
            var files = this.files;
            upload_module.model.requestComposeId();

            var oldList = uploadManager.fileList;
            for (var i = 0; i < oldList.length; i++) {
                var f = oldList[i];
                if (f.state == "blockerror") {
                    $Msg.alert("上传队列中存在上传中断的文件，请续传或删除后才能选择新的文件上传。");
                    return;
                }
            }
            var self = this;
            var isShowConfirm= UploadLargeAttach.isShowLargeAttach(files,'ajax', function () {
				if(UploadLargeAttach.isLargeAttach){
					$(files).each(function(i,file){
				        file.isLargeAttach = true;
					})
				}
                _uploadFiles(files);
                self.parentNode.reset();
            });
            if (isShowConfirm) { return;}
            
            /*
            model.requestComposeId(function() {
                _uploadFiles(files);
            });*/
//            this.value = "";//ie10有兼容性问题
            _uploadFiles(files);
            this.parentNode.reset();
        }
        uploadInput.onclick = function() {
        	BH({key : "compose_commonattach"});
        	
            if (upload_module_screenShot.isUploading) {
            	top.$Msg.alert(ComposeMessages.PleaseUploadSoon,{
			        onclose:function(e){
			            //e.cancel = true;//撤销关闭
			        }
			    });
                return false;
            }
        };
    },
    upload: function(file) {
        if (!file || !file.fileObj) return;

        HTML5AJAXUpload.lastSendedTime = new Date();
        HTML5AJAXUpload.lastSendedSize = 0;
        HTML5AJAXUpload.retryCount = 0;
        HTML5AJAXUpload.isCancel = false;
        if (UploadLargeAttach.enable) {
            UploadLargeAttach.prepareUpload(file, function (postParams) {
                HTML5AJAXUpload.upload(file);
            });
        } else {
            HTML5AJAXUpload.upload(file);
        }
    },
    cancel: function () {
        HTML5AJAXUpload.isCancel = true;
        HTML5AJAXUpload.stop();

        HTML5AJAXUpload.clearTimer();

        if (HTML5AJAXUpload.currentFile) uploadManager.removeFile(HTML5AJAXUpload.currentFile);
        uploadManager.autoUpload();
    },
    uploadResume: function(file){
        if (!file || !file.fileObj) return;
        HTML5AJAXUpload.upload(file);
    },
    isSupport: function() {
        //火狐3.6以上,Safari,Chrome,IE10+ 支持XMLHttpRequest上传文件
        if (window.FormData && !$B.is.opera && !$B.is.ie) {  //ie10 11浏览器暂不用html5上传
            return true;
        } else {
            return false;
        }
    }
};

var HTML5AJAXUpload = {
    timeout: 30 * 1000,//监控1个分块上传时间超过20秒，认为网络问题，自动续传
    xhr: {},
    currentFile :{},
    onabort: function(oEvent){
        console.log('onabort');
        console.log(oEvent);
    },
    onerror: function (oEvent) {
        if (this.isCancel) {
            return;
        }
        var self = this;
        console.log('onerror');
        console.log(oEvent);
        var f = this.currentFile;
        f.state = "blockerror"; //上传失败，删除/续传
        f.updateUI();
        M139.Logger.sendClientLog({
            level: "ERROR",
            name: "I/O Error",
            errorMsg: "fileName:"+f.fileName+"|error:"+oEvent//+args.error
        });
        if (this.timeoutId) {
            window.clearTimeout(this.timeoutId);//清理掉超时监控，避免两个自动续传同时进行
        }
        if (this.retryCount <= 3) {
            setTimeout(function () {
                self.uploadResume(f);
            }, 5000);
        }
    },
    onload: function(oEvent){
        console.log('onload');
        console.log(oEvent);
    },
    onloadend: function(oEvent){
        console.log('onloadend');
        console.log(oEvent);
    },
    onloadstart: function(oEvent){
        console.log('onloadstart');
        console.log(oEvent);
    },
    onprogress: function(oEvent){
        var This = this;
        if (oEvent.lengthComputable) {
            var f = This.currentFile; //ff下xhr事件指针有bug，所以不能直接用fileInfo
            f.sendedSize = f.offset + oEvent.loaded;
            f.progress = parseInt(f.sendedSize / f.fileSize * 100);
            f.state = "uploading";
            //计算速度
            
            f.uploadSpeed = (f.sendedSize - this.lastSendedSize) / (new Date() - this.lastSendedTime);
            console.log("上传速度"+f.uploadSpeed);
            f.updateUI();

            if (f.uploadSpeed>0 && f.uploadSpeed < 30) {//KB为单位
                M139.Logger.sendClientLog({
                    level: "INFO",
                    name: "upload speed is too slow",
                    errorMsg: "speed:" + f.uploadSpeed + "|filename:" + f.fileName
                });
            }
            if (this.retryCount > 0 && f.sendedSize > this.lastSendedSize && !this.retryLogSended) { //重试次数大于0，表示是上传重试恢复的，上报日志
                M139.Logger.sendClientLog({
                    level: "INFO",
                    name: "upload fail retry",
                    errorMsg: "retry ok," + f.fileName
                });
                this.retryLogSended = true;
            }

            this.lastSendedTime = new Date();
            this.lastSendedSize = f.sendedSize;
        }
        
        this.monitorTimeout(f);
    },
    monitorTimeout: function (file) { //监控1个分块上传时间超过20秒，认为网络问题，自动续传
        var self = this;
        window.lastFile=file;
        if (this.timeoutId) {
            window.clearTimeout(this.timeoutId);//作好清理
        }
        this.timeoutId = window.setTimeout(function () {
            if (file == window.lastFile && file.progress<100 && file.progress == window.lastFile.progress && file.state!="complete") {
                self.ontimeout();
            } 

        }, 30000);

    },
    clearTimer: function () {
        if (this.timeoutId) {
            window.clearTimeout(this.timeoutId);//清理掉超时监控，避免两个自动续传同时进行
        }
    },
    ontimeout: function (oEvent) { //超时
        var f = this.currentFile;
        var msg = "上传超时,fileName:" + f.fileName +"|fileSize:"+f.fileSize+ "|progress:" + (f.progress || "0") + "%";
        console.warn(msg);
        M139.Logger.sendClientLog({
            level: "ERROR",
            name: "request timeout",
            errorMsg: msg
        });
        console.log(f);
        //上传超时，自动续传
        this.uploadResume(f);
        //this.onFail();
    },
    onreadystatechange: function(oEvent){
        //abort也会触发，但是xhr.responseText为空
        var xhr = this.xhr;
        var This = this;
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var f = This.currentFile;
                var responseText = xhr.responseText;
                if (responseText.indexOf("middleret") > 0) {
                    responseText = UploadLargeAttach.responseConvert(responseText);
                }
                var uploadResult = This.uploadResult = utool.checkUploadResultWithResponseText({
                    responseText: responseText,
                    fileName: f.fileName
                });
                if (uploadResult.success) {
                    if (uploadResult.fileSize == f.fileSize) {
                        This.oncomplete();
                    } else if ((uploadResult.offset + uploadResult.length) < f.fileSize) {
                        f = $.extend(f, uploadResult);
                        f.offset = uploadResult.offset + uploadResult.length;
                        if (f.isLargeAttach) { f.offset = f.offset + 1;}
                        f.state = "uploading";
                        f.updateUI();
                        This.upload(f);
                    }
                } else {
                    This.onFail("response not ok:" + xhr.responseText);
                }
            } else {
                This.onFail("http code:" + xhr.status);
            }
        } 
    },
    oncomplete: function () {
        var f = this.currentFile;
        f.fileId = this.uploadResult.fileId;
        f.state = "complete";
        f.progress = 100;
        f.updateUI();
        UploadLargeAttach.completeUpload(f);
        uploadManager.autoUpload();
        utool.logUpload(UploadLogs.AjaxSuccess);
    },
    onFail: function(code){
        var f = this.currentFile;
        f.state = "uploading";
        f.updateUI();
        utool.logUpload(UploadLogs.AjaxFail);
        
        var response = this.xhr.responseText;
        if(response.indexOf('FA_ATTACH_SIZE_EXCEED') > 0){
            console.log('附件大小超过服务端允许的大小!responseText:'+response);
            top.$Msg.alert(ComposeMessages.FileSizeOverFlow);
            M139.Logger.sendClientLog({
                level: "ERROR",
                name: "html5Upload fail",
                errorMsg: ComposeMessages.FileSizeOverFlow + 'responseText' + response
            });
        } else if (response.indexOf('FS_UNKNOWN') > 0) {
            console.log('上传文件未知错误!responseText:' + response);
            top.$Msg.alert(ComposeMessages.FileUploadFail);
            M139.Logger.sendClientLog({
                level: "ERROR",
                name: "html5Upload fail",
                errorMsg: ComposeMessages.FileUploadFail + 'responseText' + response
            });
        } else {
            this.onerror(code);
        }
    },
    uploadResume: function (fileInfo) {
        if (!this.isCancel) {
            this.retryCount++;
            HTML5AJAXUpload.upload(fileInfo);
            M139.Logger.sendClientLog({
                level: "INFO",
                name: "upload fail retry",
                errorMsg: "time:" + new Date().toString() + "|retryCount:" + this.retryCount
            });
        }
    },
    upload: function(fileInfo) {
        fileInfo.offset = fileInfo.offset || 0;
        fileInfo.length = fileInfo.length || 1024 * 1024;//原本192KB 
        
        var This = this;
        this.currentFile = fileInfo;
        
        var xhr = this.getFileUploadXHR();
        this.xhr = xhr;
        
        xhr.upload.onabort = function(oEvent){This.onabort(oEvent);};
        xhr.upload.onerror = function(oEvent){This.onerror(oEvent);};
        xhr.upload.onload = function(oEvent){This.onload(oEvent);};
        xhr.upload.onloadend = function(oEvent){This.onloadend(oEvent);};
        xhr.upload.onloadstart = function(oEvent){This.onloadstart(oEvent);};
        xhr.upload.onprogress = function(oEvent){This.onprogress(oEvent);};
        //xhr.ontimeout = function(oEvent){This.ontimeout(oEvent);};
        xhr.onreadystatechange = function(oEvent) {This.onreadystatechange(oEvent);};
        
        
        this.isSupportFileSlice = This.isSupportFileSliceFn(fileInfo.fileObj);
        
        //var url = utool.getControlUploadUrl(); //整块上传接口地址
        //var url = utool.getBlockUploadUrl(); //分块上传接口地址
        var url = this.isSupportFileSlice ? utool.getBlockUploadUrl("html5") : utool.getControlUploadUrl();
        if (fileInfo.isLargeAttach) {
            url = fileInfo.uploadUrl;
        }
        xhr.open("POST", url, true);
        
        xhr.timeout = this.timeout; //timeout
 
        var fd = this.getFormData(fileInfo);
        xhr.send(fd);

        fileInfo.state = "uploading";
        fileInfo.updateUI();
        utool.logUpload(UploadLogs.AjaxStart);
    },
    getFormData:function(fileInfo){
        var formData = new FormData();
        var fileData ;
        if (fileInfo.isLargeAttach) {
            fileData = this.getFileDataForLarge(fileInfo);
        } else {
            fileData = this.getFileData(fileInfo)
        }
        for (var key in fileData) {
            if(key == 'FileData'){
                formData.append(key, fileData[key], fileInfo.fileName); //由于切片会将fileName改成blob，分块需重写fileName
            }else{
                formData.append(key, fileData[key]);
            }
        }
        return formData;
    },
    getFileData: function(fileInfo){
        var This = this;
        if(!This.isSupportFileSlice){
            return {
                FileData : fileInfo.fileObj
            };
        }
        var range = this.getRange(fileInfo);
        return {
            timestamp : new Date().toDateString(),
            type : "1",
            sip : fileInfo.sip || "",
            range : range.from + "-" + range.to,
            fileid : fileInfo.fileId || "",
            filesize : fileInfo.fileSize,
            Filename : fileInfo.fileName,
            FileData : This.fileSlice(fileInfo.fileObj, range.from, range.to)  //必须放在最后，不然上传数据会出错
        };
    },
    getFileDataForLarge: function (fileInfo) {
        var result = UploadLargeAttach.postParams;
        var range = this.getRange(fileInfo,1);
        result.range = range.from + "-" + range.to,
        result.filedata = this.fileSlice(fileInfo.fileObj, range.from, range.to+1);//分布式上传接口这个字段居然用的小写字母
        return result;
    },
    getRange: function(fileInfo,delta){
        var from = fileInfo.offset;
        var to = Number(fileInfo.offset) + Number(fileInfo.length);
        to = to > fileInfo.fileSize ? fileInfo.fileSize : to;
        if (!delta) { delta = 0;}
        return {
            from: from,
            to: to - delta
        };
    },
    stop: function() {
        this.xhr.abort();
        utool.logUpload(UploadLogs.AjaxCancel);
    },
    getFileUploadXHR: function() {
        if (!window.fileUploadXHR) {
            fileUploadXHR = new XMLHttpRequest();
        }
        return fileUploadXHR;
    },
    isSupportFileSliceFn: function(file){
        if (file.slice || file.webkitSlice || file.mozSlice) {
            return true;
        }else{
            return false;
        }
    },
    fileSlice: function (file, from, to) {
        var type = file.type;
        if (file.slice) {
            return file.slice(from, to, type);
        } else if (file.webkitSlice) {
            return file.webkitSlice(from, to, type);
        } else if (file.mozSlice) {
            return file.mozSlice(from, to, type);
        }
    }
}

function _dragenter(e){
	upload_module.model.requestComposeId();
	var files = e.dataTransfer && e.dataTransfer.files;
	e.stopPropagation();
	if(files && files.length > 0){
		e.preventDefault();
	}
}
function _dragover(e){
	var files = e.dataTransfer && e.dataTransfer.files;
	e.stopPropagation();
	if(files && files.length > 0){
		e.preventDefault();
	}
}
function _drop(e){
	var files = e.dataTransfer && e.dataTransfer.files;
	e.stopPropagation();
	if(files && files.length > 0){
		e.preventDefault();
	} else {
		return;
	}

    for (var i = 0; i < files.length; i++) {
        if(files[i].fileSize==0){
            top.$Msg.alert('不能拖放文件夹，以及大小为零的文件');
            return;
        }
    }
    var isShowConfirm= UploadLargeAttach.isShowLargeAttach(files,'ajax', function () {
		if(UploadLargeAttach.isLargeAttach){
			$(files).each(function(i,file){
		        file.isLargeAttach = true;
			})
		}
        _uploadFiles(files);
    });
    if (isShowConfirm) { return;}
    _uploadFiles(files);
}
function _uploadFiles(files){
    if (!files || files.length == 0) return;
    var list = [];
    for(var i=0;i<files.length;i++){
	    
        var f=files[i];
        var obj = {
            fileName: f.fileName || f.name,
            fileSize: f.fileSize || f.size,
            fileObj: f.fileObj ||f,
            uploadType:'ajax',
            isLargeAttach:f.isLargeAttach
        };
        list.push(obj);
    }
    uploadManager.uploadFile(list);
}

(function(jQuery, Backbone, M139) {
	var $ = jQuery;
	M139.namespace('M2012.Compose.View.UploadForm', Backbone.View.extend(
	/**
	*@lends M2012.Compose.View.UploadForm.prototype
	*/
	{
		el: "div",
		
		events: {
		},

		template: ['<form target="{target}" enctype="multipart/form-data" method="post" action="{action}">',
					'	<input style="font-size:24px; position:absolute; right: 0;height:24px;" type="file" name="{fieldName}" />',	// title trick
					'</form>'].join(""),

		/*
		* @options
		*	- [required] fieldName 文件上传域的name
		*	- [optional] uploadUrl 上传地址，默认为根地址
		*	- [optional] wrapper 父元素，form和iframe都会添加到该元素下
		*	- [optional] accepts 允许上传的文件类型，仅在文件选择对话框进行过滤选择
		*	- [required] onSelect 选择文件后的处理过程
		*	- [required] onUploadFrameLoad 请求返回数据，iframe触发onload事件处理
		*/
		initialize: function (options) {
			var uniqueId = M2012.Compose.View.UploadForm.UID++;
			options = options || {};
			// 不要让多实例共享iframe，绑定多次onload会重复处理
			this.frameId = options.frameId || ("_hideFrame_" + uniqueId);
			this.template = M139.Text.Utils.format(this.template, {
				target: this.frameId,
				fieldName: (options.fieldName || "file"),
				action: options.uploadUrl || "/"
			});
			function noop(){return true}

			this.accepts = options.accepts;
			this.onSelect = options.onSelect || noop;
			this.onUploadFrameLoad = options.onUploadFrameLoad || noop;
			this.wrapper = options.wrapper || document.body;
			var $el = $(this.template).appendTo( this.wrapper );
			this.setElement($el);	// make sure that the view have only one `input:file` element inside.
		},

		render: function(){
			this.resetAccepts();
			this.initEvents();
			//this.$el.hide();	// don't! if we want to click it.
			return this;
		},

		initEvents: function(){
			var This = this;
			this.$("input").on("change", function(){
				var form, jFrame, value;

				form = this.form;
				value = this.value;

				if(!(value && This.onSelect(value, $Url.getFileExtName(value)))) {
					form.reset();
					return ;
				}

				jFrame = This.getHideFrame();
				jFrame.one("load", function(){
					This.onUploadFrameLoad(this);
				});

				try {
					form.submit();
					form.reset();
				} catch(e) {
					jFrame.attr("src", "/m2012/html/blank.html").one("load", function() {
						form.submit();
						form.reset();
					});
				}
			})/*.on("click", function(){
				This.isUserClick = true;	// 用户手动点击了按钮（而非模拟点击）
			})*/;
		},

		/*
		* 指定上传文件选择对话框过滤的文件类型
		*/
		resetAccepts: function(accepts){
			var types = accepts || this.accepts;
			var mimes = M2012.Compose.View.UploadForm.mimeTypes;
			if(_.isArray(this.accepts)){
				types = _.map(types, function(key){
					return mimes[key];
				});
				types = _.unique(types).join(", ");
				this.$("input").attr("accept", types);
			}
		},

		getHideFrame: function(){
			var This = this;
			var id = "#"+this.frameId;
			var jFrame = $(this.wrapper).closest("body").find(id);
			if(jFrame.length == 0){
				// todo 使用id !!! 否则每次都会重复一个iframe
				jFrame = $('<iframe id="' + this.frameId + '" name="' + this.frameId + '" style="display:none"></iframe>').appendTo( this.wrapper );
			}
			return jFrame;
		}
	}, {
		UID: 0,
		mimeTypes: {
			"gif" : "image/gif",
			"jpg" : "image/jpeg",
			"bmp" : "image/bmp",
			"png" : "image/png",
			"txt" : "text/plain",
			"doc" : "application/msword",
			"docx" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			"ppt" : "application/vnd.ms-powerpoint",
			"pptx" : "application/vnd.openxmlformats-officedocument.presentationml.presentation",
			"xls" : "application/vnd.ms-excel",
			"xlsx" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			"pdf" : "application/pdf",
			"mp3" : "audio/mpeg",
			"mp4" : "video/mp4",
			"zip" : "application/zip",
			"rar" : "application/octet-stream",
			"flv" : "flv-application/octet-stream"	// todo not supported ?
		}
	}));
})(jQuery, Backbone, M139);

var Arr_DiskAttach = []; //彩云附件数组
var Arr_OutLink = [];


function removeLargeAttach(fileId) {
	for (var i = 0; i < Arr_DiskAttach.length; i++) {
		var f = Arr_DiskAttach[i];
		if (f.fileId == fileId) {
			Arr_DiskAttach.splice(i, 1);
			renderLargeAttachList();
			break;
		}
	}
}

// 写信页插入彩云外链 (xiaoyu) 
function getOutLinkHtml(data, callback) {
	M139.RichMail.API.call("disk:getOutLink", data, callback);
}

function getFileItemById(fileId) {
	var i, item = null;
	for (i = Arr_OutLink.length - 1; i >= 0; --i) {
		item = Arr_OutLink[i];
		if (item.fileId == fileId) break;
	}
	return i >= 0 ? item : null;
}
/** 
*附件存彩云
*/
function composeSaveToDisk(fileId) {
    var moveToDiskview = new top.M2012.UI.Dialog.SaveToDisk({
        ids : fileId,
        fileName : '',
        type : 'move',
        comeFrom: 'largeAttach'
    });
    moveToDiskview.render().on("success", function () {
        //self.model.trigger('refresh');
    });

}

// update by tkh
function renderLargeAttachList() {
	//跟普通附件用到同一个容器，所以很难搞，必须排在普通附件前面 jContainer = $("#attachContainer")
	uploadManager.jContainer.find("li[rel='largeAttach']").remove();
	var itemTemp = '<li rel="largeAttach" objId="{objId}" filetype="{fileType}"><i class="{fileIconClass}"></i>\
					<span class="ml_5">{prefix}<span class="gray">{suffix}</span></span>\
					<span class="gray ml_5">({fileSizeText})<span class="tiquma pl_5 black" style="display:none;">提取码：{tiquma}</span></span>\
					<a hideFocus="1" class="ml_5" href="javascript:void(0)" onclick="removeLargeAttach(\'{fileId}\')">删除</a></li>';
					//<a hideFocus="1" class = "{isShowSaveToDisk}" href="javascript:void(0)" data-id="{objId}" bh="composemail_savedisk" onclick="composeSaveToDisk(\'{fileId}\')">存彩云网盘</a></li>';
	var attachListHtml = "";
	var fileIds = [];
	var requestData = {
		linkType: 0,
		encrypt: 0,
		pubType: 1,
		fileIds: ""
	};
	var needToshowList = [];
	Arr_OutLink.length = 0;
	//去掉彩云网盘的，但是copy一份，展示的时候都要显示
	for (var i = 0; i < Arr_DiskAttach.length; i++) {
		var item = Arr_DiskAttach[i];
		needToshowList.push(item);
		// change the below and to or
		if (item.fileType == "netDisk") {
		//	Arr_DiskAttach.splice(i, 1);
		//	i--; // tu...
			Arr_OutLink.push(item);
			fileIds.push(item.fileId);
		} 
	}
	for(var j =0, len=needToshowList.length; j < len; j++){
		var item = needToshowList[j];
		var shortName = utool.shortName(item.fileName),
			prefix = shortName.substring(0, shortName.lastIndexOf('.') + 1),
			suffix = shortName.substring(shortName.lastIndexOf('.') + 1, shortName.length);
		var fileIconClass = $T.Utils.getFileIcoClass(0, item.fileName);
		var fileClass = "";
			var isShowSaveToDisk= "";
		if(item["fileType"] == "netDisk"){
			fileClass = "i_cloudS";
				isShowSaveToDisk = 'hide';
		}else if(item["fileType"] == "keepFolder"){
			fileClass = "i_bigAttachmentS";
		}
		var data = {
			objId : item.fileId ? item.fileId : "",
			fileType : fileClass,
			fileIconClass: fileClass,
			prefix: prefix,
			suffix: suffix,
			fileSizeText: item.fileSize,
			fileId: item.fileId,
			isShowSaveToDisk:isShowSaveToDisk
		};
		attachListHtml += top.$T.Utils.format(itemTemp, data);
		//彩云网盘的数据
	}
	// 首次加载时不执行，否则初始化附件列表时会出现异常，导致信纸无法加载等问题
	if (fileIds.length > 0) {
		requestData.fileIds = fileIds.join(",");
		getOutLinkHtml(requestData, function(res) {
			var outLinkHtml = '<br><br><br><dl class="writeOk" style="color: #444;font: 12px/1.5 \'Microsoft YaHei\',Verdana; display: inline-block; padding:5px 0 5px 10px;">';
			var list, source;


			if (res.responseData && res.responseData["code"] == "S_ERROR") {
				// todo: 变为error
				top.M139.UI.TipMessage.show("获取文件链接失败", {className: "msgRed", delay:3000});
			} else {
				list = res.responseData["var"].linkBeans;
				for (var i = 0, l = list.length; i < l; i++) {
					item = list[i];
					source = getFileItemById(item.objID);
					if(source !== null) {
						source.linkUrl = item.linkUrl;	// 添加linkUrl属性
					}
					if(item.passwd){
						$("li[rel='largeAttach'][objid='"+ item.objID +"']").find(".tiquma").show().html("提取码："+item.passwd);
					}
				}	
			}
		});
	}

	if (attachListHtml) {
	//	uploadManager.jContainer.prepend(attachListHtml);
		uploadManager.jContainer.append(attachListHtml);
		uploadManager.jContainer.show();
	} else if (uploadManager.fileList.length == 0) {
		uploadManager.jContainer.hide();
	}
	
	// update by tkh
	var container = uploadManager.jContainer[0];
	container.style.display = container.innerHTML != '' ? '' : 'none';
	var parent = container.parentNode;
	parent.style.display = container.innerHTML != '' ? '' : 'none';
}

//追加彩云附件内容
function getDiskLinkHtml() {
	var html = '';
    if(Arr_DiskAttach.length > 0 || Arr_OutLink.length > 0) {
        var resourcePath = top.m2012ResourceDomain + '/m2012/images/module/readmail/';
        var userName = $T.Html.encode(top.$User.getTrueName());
		var htmlTemplate = ['<table cellpadding="0" cellspacing="0" '
			,'style="border:1px solid #c6cace; border-radius:5px; background:#fff; font-size:12px;" width="700">'
			,'<tr><th bgcolor="#4a73b5" align="left" height="48" '
			,'style="border-top-left-radius:4px; border-top-right-radius:4px;">'
			,'<img src="{resourcePath}mail_logo.jpg" width="168" height="22" style="margin-left:15px;"></th></tr>'
			,'<tr><td style="padding:20px;"><h2 style="font-size:14px; margin:0;padding:0;">尊敬的用户：</h2></td></tr>'
			,'<tr><td style="padding:0 50px;"><p style="font-size:14px; margin:0; padding:0;">'
			,'<a style="color:#0066cc; font-weight:bold; text-decoration:none;">{userName}</a>给您发送了以下{count}个文件，共'
			,'<span>{totalSize}</span></p></td></tr>'
			,'<tr><td style="padding:0 50px 0px;">'
			,'<p style="font-size:14px;margin:0; padding:0;">部分文件将于 '
			,'<a style="color:#0066cc; text-decoration:none;">{exp}</a> 到期，请及时下载保存。</p></td></tr> '
			,'<tr><td style="padding:30px 50px 10px; font-size:14px;"><strong></strong><br>' //附言：
			,'<p style="margin:0 20px; padding:0;"></p></td></tr>' //文件已发送，请查收。//写信页没有附言，删除该处的文字
			,'<tr><td align="center"><a href="{downloadUrl}" style="display:inline-block; text-align:center;">'
			,'<img src="{resourcePath}enter_btn.png"></a></td></tr>'
			,'<tr><td align="center">'
			,'<div style="width:91%; border-radius:8px; margin:20px 0; border:1px solid #dfdfe2;background:#fcfcfc;">'
			,'<table cellpadding="0" cellspacing="0" width="100%">{itemHtml}{itemHtml2}</table></div></td></tr>' 
			,'<tr><td style=" padding:10px 20px;">'
			,'<p style="border-bottom:1px solid #dedede; margin:0 10px; padding:10px; font-size:14px; text-indent:10px; color:#666666;">'
			,'139邮箱将一如既往。热忱的为您服务！</p></td></tr>'
			,'<tr><td align="right" style=" padding:0 20px; font-size:12px; color:#a6a6a6;">中国移动139邮箱企业团队</td></tr>'
			,'<tr><td align="right" style=" padding:5px 20px 30px; margin-bottom:20px; font-size:12px; color:#a6a6a6;">'
			,'{date}</td></tr>'
			,'<tr><td height="5" bgcolor="#efefef" '
			,'style="border-bottom-left-radius:4px;border-bottom-right-radius:4px;"></td></tr>'
			,'</table>'
		].join('');
		var htmlNewTemplate = ['<table id="attachAndDisk" style="margin-top:25px; border-collapse:collapse; table-layout:fixed; width:95%; font-size: 12px; line-height:18px; font-family:\'Microsoft YaHei\',Verdana,\'Simsun\';">',
				'<thead>',
					'<tr>',
						'<th style="background-color:#e8e8e8; height:30px; padding:0 11px; text-align:left;"><img src="{resourcePath}attachmentIcon.png" alt="" title="" style="vertical-align:middle; margin-right:6px; border:0;" />来自139邮箱的文件</th>',
					'</tr>',
				'</thead>',
				'<tbody>',
					'<tr>',
						'<td style="border:1px solid #e8e8e8;">',
							'{itemHtml}',
						'</td>',
					'</tr>',
					'<tr>',
						'<td style="border:1px solid #e8e8e8;">',
							'{itemHtml2}',
						'</td>',
					'</tr>',
				'</tbody>',
			 '</table>'].join("");
		var today = new Date();
		var html = top.M139.Text.Utils.format(htmlNewTemplate,{
			resourcePath : resourcePath,
			userName : userName,
			count : Arr_DiskAttach.length,
			totalSize : getTotalSize(),
			exp : Arr_DiskAttach[0].exp,
			downloadUrl: Arr_DiskAttach[0].downloadUrl,
			itemHtml : getAttachmentItemHtml(),
			itemHtml2 : getNetDiskItemHtml(),
			date : today.format('yyyy年MM月dd日')
		});
	}
	return html;
}
function getTotalSize(){
	var totalSize = 0;
	for (var i = 0; i < Arr_DiskAttach.length; i++) {
		totalSize += Arr_DiskAttach[i].fileLength;
	}
	return $T.Utils.getFileSizeText(totalSize);
}
function getAttachmentItemHtml(){
	var filetypeobj = getFiletypeobj();
	var resourcePath = top.m2012ResourceDomain + '/m2012/images/module/readmail/';
	var itemHtml = [
		'<td><dl style="margin:20px 40px;">',
		'<dt style="float:left;"><img src="{fileIconSrc}"></dt><dd>',
		'<span style="width:34%;display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">',
		'{fileName}</span>({fileSize})</dd><dd>{exp} 到期</dd></dl></td>'
	].join('');
	var tableContainer = ['<table style="border-collapse:collapse; table-layout:fixed; width:100%;" id="attachItem" class="newAttachItem">',
								'<thead>',
									'<tr>',
										'<td style="height:10px;"></td>',
									'</tr>',
									'<tr>',
										'<th style=" text-align:left; padding-left:30px; height:35px;"><strong style="margin-right:12px;">139邮箱-超大附件</strong><a href="{downloadUrl}" style="font-weight:normal;">进入下载页面</a></th>',
									'</tr>',
								'</thead>',
								'<tbody>',
								'{trs}',
								'</tbody>',
						'</table>'].join("");
					var itemHtmlNew = ['<tr>',
										'<td style="padding-left:30px; height:40px;">',
											'<table style="border-collapse:collapse; table-layout:fixed; width:100%;">',
												'<tr class="cts">',
													'<td width="42"><img src="{fileIconSrc}" alt="" title="" style="vertical-align:middle; border:0;" /></td>',
													'<td style="line-height:18px;">',
														'<span>{fileName}<span class="gray"></span></span>',
														'<span style="color:#999; margin-left:5px;">({fileSize})</span><span style="color:#999; margin-left:5px;">({exp}天后过期)</span>',
													'</td>',
												'</tr>',
											'</table>',
										'</td>',
									'</tr>',
									'<tr>',
										'<td style="height:10px;"></td>',
									'</tr>'].join("");
	var midHtml = [];
	if(Arr_DiskAttach.length ==0){
		return "";
	}
	var ind = 0;
	for (var i = 0; i < Arr_DiskAttach.length; i++) {
		var f = Arr_DiskAttach[i];
		if(f.fileType == "keepFolder"){
			ind++;
			var fileType = '', extName = f.fileName.match(/.\w+$/);
			if(extName){
				fileType = extName[0].replace('.','');
			}
			var fileIconSrc = resourcePath + (filetypeobj[fileType] || 'none.png');
			midHtml.push(top.M139.Text.Utils.format(itemHtmlNew,{
				fileIconSrc : fileIconSrc,
				fileName : f.fileName,
				fileSize : f.fileSize,
				exp : $Date.getDaysPass(new Date(),$Date.parse(f.exp))
			}));
		}
	}
	if(ind > 0){
		return top.M139.Text.Utils.format(tableContainer,{
				trs : midHtml.join(''),
				downloadUrl : Arr_DiskAttach[0]["downloadUrl"]
		});
	}else{
		return "";
	}
}
function getNetDiskItemHtml(){
	var filetypeobj = getFiletypeobj();
	var resourcePath = top.m2012ResourceDomain + '/m2012/images/module/readmail/';
	var itemHtml = [
		'<td><a href="{linkUrl}" target="_blank">123</a><dl style="margin:20px 40px;">',
		'<dt style="float:left;"><img src="{fileIconSrc}"></dt><dd>',
		'<span style="width:34%;display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">',
		'{fileName}</span>({fileSize})</dd><dd>{exp} 到期</dd></dl></td>'
	].join('');

	var tableContainer = ['',
			'<table style="border-collapse:collapse; table-layout:fixed; width:100%;" id="diskItem">',
				'<thead>',
					'<tr><td style="height:10px;"></td></tr>',
					'<tr>',
						'<th style=" text-align:left; padding-left:30px; height:35px;"><strong style="margin-right:12px;">139邮箱-彩云网盘</strong></th>',
					'</tr>',
				'</thead>',
				'<tbody>',
					'{trs}',
				'</tbody>',
			'</table>'].join("");

	var itemHtmlNew = ['',
			'<tr><td style="padding-left:30px; height:40px;">',
					'<table style="border-collapse:collapse; table-layout:fixed; width:100%;">',
						'<tr class="cts" dataString="{dataString}">',
							'<td width="42"><span class="dataString" style="display:none;">{dataString}</span>',
							'<img src="{fileIconSrc}" alt="" title="" style="vertical-align:middle; border:0;" /></td>',
							'<td style="line-height:18px;">',
								'<span>{fileName}<span class="gray"></span></span>',
								'<span style="color:#999; margin-left:5px;">({fileSize})</span><span class="gray ml_5"></span>',
								'<p style="padding:0; margin:0;"><span style="{display}">提取码：{tiquma}</span><a href="{linkUrl}">查看</a></p>',
							'</td>',
						'</tr>',
					'</table>',
				'</td>',
			'</tr>',
			'<tr><td style="height:10px;"></td></tr>'].join("");

	var midHtml = [];
	if(Arr_OutLink.length ==0){
		return "";
	}
	for (var i = 0; i < Arr_OutLink.length; i++) {
		var f = Arr_OutLink[i];
		var fileType = '', extName = f.fileName.match(/.\w+$/);
		if(extName){
			fileType = extName[0].replace('.','');
		}
		var fileIconSrc = resourcePath + (filetypeobj[fileType] || 'none.png');

		midHtml.push(top.M139.Text.Utils.format(itemHtmlNew,{
			fileIconSrc : fileIconSrc,
			fileName : f.fileName,
			fileSize : f.fileSize,
			exp : f.exp,
			linkUrl : f.linkUrl,
			display : f.passwd ? "" : "display:none;",
			tiquma : f.passwd ? f.passwd : "",
			dataString : M139.JSON.stringify(f)
		}));

	}
	if(Arr_OutLink.length > 0){
		return top.M139.Text.Utils.format(tableContainer,{
			trs : midHtml.join('')
		});
	}else{
		return "";
	}
}
function getFiletypeobj(){
	return {
        'xls'  : 'xls.png',
		'xlsx'  : 'xls.png',
		'doc'  : 'word.png',
		'docx' : 'word.png',
        'jpeg' : 'jpg.png',
		'jpg'  : 'jpg.png',
        'rar'  : 'zip.png',
		'zip'  : 'zip.png',
		'7z'   : 'zip.png',
        'txt'  : 'txt.png',
		'rtf'  : 'txt.png',
        'ppt'  : 'ppt.png',
		'pptx'  : 'ppt.png',
		'xml'  : 'xml.png',
        'wmv'  : 'wmv.png',
		'wma'  : 'wma.png',
		'wav'  : 'wav.png',
        'vsd'  : 'vsd.png',
		'vob'  : 'vob.png',
        'fla'  : 'swf.png',
		'swf'  : 'swf.png',
		'flv'  : 'swf.png',
        'sis'  : 'sis.png',
		'rm'   : 'rm.png',
		'rmvb' : 'rm.png',
        'psd'  : 'psd.png',
		'ppt'  : 'ppt.png',
        'png'  : 'png.png',
		'pdf'  : 'pdf.png',
		'mpg'  : 'mpg.png', 
        'mp4'  : 'mp3.png',
		'mpeg' : 'mp3.png',
		'mpg'  : 'mp3.png',
		'mp3'  : 'mp3.png',
        'java' : 'java.png',
		'iso'  : 'iso.png',
        'htm'  : 'html.png',
		'html' : 'html.png', 
		'asp'  : 'html.png',
		'jsp'  : 'html.png',
		'aspx' : 'html.png',
        'gif'  : 'gif.png', 
		'exe'  : 'exe.png', 
		'css'  : 'css.png',
        'chm'  : 'chm.png',
		'cab'  : 'cab.png',
		'bmp'  : 'bmp.png',
        'avi'  : 'ai.png',
        'asf'  : 'asf.png',
		'mov'  : 'rm.png',
		'JPG'  : 'jpg.png'
    };
}
function isExistNetDiskFile(fid) {
	for (var i = 0; i < Arr_DiskAttach.length; i++) {
		if (Arr_DiskAttach[i].fileId == fid) {
			return true;
		}
	}
	return false;
}

//插入彩云链接 update by tkh
function setNetLink(files) {
	//top.addBehavior("写信页-点击上传附件",21);
	for (var i = 0; i < files.length; i++) {
		var f = files[i];
		if (f.fileType == "local" && !f.complete) {
			files.splice(i, 1);
			i--;
			continue;
		}
		var fid = f.fileId || f.fid;
		if (isExistNetDiskFile(fid)) {
			alert("文件\"" + f.fileName + "\"已经存在,请勿重复添加");
		} else {
			f.fileId = fid;
			f.fileLength = f.fileSize;
			f.fileSize = $T.Utils.getFileSizeText(f.fileSize);
			f.isDisk = true;
			if(Arr_DiskAttach.length == 0){
				Arr_DiskAttach.push(f);
			}else{
				for(var tt = Arr_DiskAttach.length -1; tt > -1; tt--){
					if(Arr_DiskAttach[tt].fileType == f.fileType){ //反向遍历，若存在，则添加到此位置
						Arr_DiskAttach.splice(tt+1, 0, f);
						break;
					}else if(tt == 0 && Arr_DiskAttach[tt].fileType == "netDisk"){ //如果到了最后一个，还全部是彩云网盘文件，则需要把暂存柜放在彩云前面
						Arr_DiskAttach.unshift(f);
					}else if(tt == 0){ //如果没有找到相同类型的，则添加到最后
						Arr_DiskAttach.push(f);
					}
				}
			}
		//	Arr_DiskAttach.push(f);
		}
	}
	if (files.length > 0) {
		renderLargeAttachList();
		// todo 自动发送提示用户填主题
		//utool.fillSubject(files[0].fileName);
	}
}

﻿var UploadLargeAttach = {
    enable:false,
    currentFile: null,
    isLargeAttach:false,
    //检测是否需要超大附件上传
    isShowLargeAttach: function (files,uploadType,callback) {

        var result = false;
        var is139 = true;
        var isBigAttach = false;
        var totalSize = 0;
        var iLargeSize =1024*1024*50;//邮箱最大的发送大小的大
        var aToEmail = [];
		var largeSize = 1024*1024*20;
		var flashSize = 1024*1024*10;//flash只支持100M
		var tipsType = false;
		if(!top.$App.isReadSessionMail()){
			aToEmail =_.union(addrInputView.toRichInput.getValidationItems(),addrInputView.ccRichInput.getValidationItems());
			$(aToEmail).each(function(i,str){
				if(str.indexOf('@139.com') == '-1'){
					is139 = false;
				}
			});
		}

		if(aToEmail.length == 0){
			is139 = false;
		}

        UploadLargeAttach.enable = false;
        UploadLargeAttach.isLargeAttach = false;
        $(files).each(function(i,file){
	      var filesSize = file.fileSize ||file.size;
	       totalSize += filesSize;
            if (filesSize > largeSize) {
	            isBigAttach = true;
            }
        })
        if((uploadType == 'ajax'&&!utool.checkSizeSafe(totalSize))||(uploadType == 'flash' &&utool.getSizeNow()>=iLargeSize)){
	        tipsType = true;
        }
        if (tipsType) {
            top.tipsBox = top.$Msg.confirm("附件总大小超过50M，可能会被对方邮箱拒收。<br>使用 <b title='超大附件以链接形式发送，文件在您的暂存柜内保存15天，续期后可以保留更久。'>超大附件<i class='i_wenhao'></i></b>发送，对方接收无障碍。", function () {
                UploadLargeAttach.enable = true;
		        UploadLargeAttach.isLargeAttach = true;
				BH({ key: "compose_send_largeAttach_50M" });
                callback();
            }, function () {
	            uploadManager.removeFile(files);
            }, {isHtml:true,icon:'i_warn',buttons:["是，使用超大附件!","不，取消上传"]});
            return true;
        }
		if(!is139&&isBigAttach){
            result = true;
            top.$Msg.confirm("附件已超过20M，可能会被对方邮箱拒收。<br>使用 <b title='超大附件以链接形式发送，文件在您的暂存柜内保存15天，续期后可以保留更久。'>超大附件<i class='i_wenhao'></i>&nbsp;</b>发送，对方接收无障碍。", function () {
                UploadLargeAttach.enable = true;
		        UploadLargeAttach.isLargeAttach = true;
				BH({ key: "compose_send_largeAttach_20M" });
                callback();
            }, function () {
                callback();
                //uploadManager.removeFile(file);
            }, {isHtml:true,icon:'i_warn',buttons:["是，使用超大附件","不，继续上传"]});
		}

        return result;
    },
    //超大附件请求预上传接口，并对上传接口的请求报文转换
    prepareUpload: function (file, callback) {

        /*
        POST http://rm.mail.10086ts.cn/mw2/file/disk?func=file:fastUpload&sid=xxx

        <object>
  <string name="fileName">测试环境hosts.txt</string>
  <int name="fileSize">908</int>
  <string name="fileMd5">2bfda476d9e76462a9a8f1ca4aff1c16</string>
</object>
        */
        var self = this;
        this.currentFile = file;
        file.isLargeAttach = true;

        function preUpload(md5Value) {
            var data = {
                fileName: file.fileName,
                fileSize: file.fileSize,
                fileMd5: md5Value
            }
            file.comeFrom = "cabinet";
            file.fileType = "keepFolder";
            M139.RichMail.API.call("file:fastUpload", data, function (result) {
                if (file.isCancel) { //md5过程中取消上传
                    uploadManager.removeFile(file);
                    uploadManager.autoUpload();
                    return;
                }
                if (result.responseData["code"] && result.responseData["code"] == "S_OK") {
                    var status = result.responseData["var"]["status"];
                    file.fileName = result.responseData["var"]["fileName"];//取预上传接口返回的文件名称，文件可能重名被自动改名，或单副本取文件原始名称，否则发送时无法匹配到文件
                    if (status == "0") {
                        var params = result.responseData["var"]["postParam"];
                        file.fileId = result.responseData["var"]["fileId"];
                        file.fileIdForSend = result.responseData["var"]["fileId"];
                        file.uploadUrl = result.responseData["var"]["url"];
                        self.uploadUrl = file.uploadUrl;
                        //params.fileObj = file.fileObj;
                        self.postParams = params;
                        callback(params);
                    } else if (status == "1") { //单副本，直接插入
                        
                        uploadManager.removeFile(file);
                        file.fileId = result.responseData["var"].fileId;
                        file.state = "complete";
			file.fileIdForSend = result.responseData["var"]["fileId"];
                        var fileCabinet = [self.transformFile(file)];
                        top.$App.trigger('obtainCabinetFiles', fileCabinet);
                        uploadManager.autoUpload();
                    }
                }

            });
        }
        if (file.md5) {    //flash上传已计算好md5
            preUpload(file.md5);
        } else {
            this.getFileMd5(preUpload);
        }
      
    },
    transformFile:function(file){
        return {
            comeFrom: "cabinet",
            fileId: file.fileIdForSend,
            fileName: file.fileName,
            fileSize: $T.Utils.getFileSizeText(file.fileSize),
            fileType: "keepFolder",
            state: "success"
        };
    },
    completeUpload: function (file) {
        if (file.isLargeAttach) {
            uploadManager.removeFile(file);
            //Arr_DiskAttach.push(file);//依赖，引自largeAttach.js
            //setNetLink(file);//依赖，引自largeAttach.js
            var fileCabinet = [this.transformFile(file)];
            top.$App.trigger('obtainCabinetFiles', fileCabinet);

        }
    },
    getFileMd5: function (callback) {
        this.timeBegin = new Date;
        this.uploading = true;

        var output = [],
            worker,
            file_id = 1;

        var md5WorkUrl =  "/m2012/js/ui/upload/calculator.worker.md5.js";

        worker = new Worker(md5WorkUrl);

        worker.addEventListener('message', this.handle_worker_event("md5_file_hash_" + file_id, callback));
        /*
        worker.addEventListener('message', function (event) {
            var progress = Math.floor(event.data.block.end * 100 / event.data.block.file_size);
            if (event.data.result) {
                callback(event.data.result);
            }
        });*/

        this.hash_file(this.currentFile.fileObj, worker);

        //document.getElementById('list').innerHTML = '<table class="table table-striped table-hover">' + output.join('') + '</table>' + document.getElementById('list').innerHTML;
    },
    hash_file: function (file, worker) {
        var i, buffer_size, block, threads, reader, blob;
        var self = this;

        var handle_load_block = function (event) {
            threads += 1;
            worker.postMessage({
                'message': event.target.result,
                'block': block
            });
        };

        var handle_hash_block = function (event) {
            threads -= 1;

            if (threads === 0) {
                if (block.end !== file.size) {
                    block.start += buffer_size;
                    block.end += buffer_size;

                    if (block.end > file.size) {
                        block.end = file.size;
                    }
                    reader = new FileReader();
                    reader.onload = handle_load_block;
                    blob = HTML5AJAXUpload.fileSlice(file, block.start, block.end);

                    reader.readAsArrayBuffer(blob);
                }
            }
        };
        buffer_size = 64 * 16 * 1024;
        block = {
            'file_size': file.size,
            'start': 0
        };

        block.end = buffer_size > file.size ? file.size : buffer_size;
        threads = 0;

        worker.addEventListener('message', handle_hash_block);
        reader = new FileReader();
        reader.onload = handle_load_block;
        blob = HTML5AJAXUpload.fileSlice(file, block.start, block.end);

        reader.readAsArrayBuffer(blob);
    },

    handle_worker_event: function (id, callback) {
        var self = this;
        return function (event) {
            if (event.data.result) {
                console.log(Math.round(((new Date).getTime() - self.timeBegin.getTime()) / 1000));
                callback && callback(event.data.result);
            } else {
	            self.currentFile.getMd5 = Math.floor(event.data.block.end * 100 / event.data.block.file_size) + "%";
				self.currentFile.updateUI();
                console.log(Math.floor(event.data.block.end * 100 / event.data.block.file_size) + "%");

            }
        };
    },
    responseConvert: function (response) {
        /*
        原始报文
        分块：
        <?xml version="1.0" encoding="utf-8"?><result><retcode>0</retcode><taskno>11201408041644582148</taskno><fileid>GFLF1121120140804164458214801192</fileid><timestamp>1407141898</timestamp><range>0-196607</range><middleret></middleret></result>
        
        上传完成：
        <?xml version="1.0" encoding="utf-8"?><result><retcode>0</retcode><taskno>11201408050941251093</taskno><fileid>GFLF1101120140805094125109301621</fileid><timestamp>1407202901</timestamp><range>10027008-10144767</range><middleret>{
    "code": "S_OK",
	"summary":"成功",
	"var":{
			"url":"",			
			"disk": {},
			"file": {}
		  }
}</middleret></result>
        */

        var isComplete = false;
        var result,reg;
        if (response.indexOf("S_OK") >= 0) {
            reg = /<fileid>(.+?)<\/fileid>/i;
            var ma = response.match(reg);
            var fileId = ma[1];
            result = '<script>document.domain=window.location.host.match(/[^.]+\.[^.]+$/)[0]; var return_obj={\'code\':\'S_OK\',\'var\':{"fileId":"'
                + fileId + '","fileName":"' + this.currentFile.fileName + '","fileSize":' + this.currentFile.fileSize + '}};</script>'
        } else {
            reg = /<fileid>(.+?)<\/fileid>.+<range>(.+?)<\/range>/i;
            var ma = response.match(reg);
            var fileId = ma[1];
            var offset = ma[2].split("-");
            result = '<script>document.domain=window.location.host.match(/[^.]+\.[^.]+$/)[0]; var return_obj={\'code\':\'S_OK\',\'var\':{"fileId":"'
                + fileId + '","sip":"webapp_ip25","offset":' + offset[0] + ',"length":' + (offset[1] - offset[0]) + '}};</script>'
        }
        return result;
        
    }

}
﻿var UploadManager = function() {
    this.init.apply(this, arguments);
}

var TaskID = 10000;

function noop(){}

UploadManager.prototype = {
    //同一时刻只会有一种上传方式正在上传
    init: function (c) {
        var This = this;
        this.currentUploadType = "none"; // "common|flash|screenshot|html5|mutil",
        this.fileList = [];
        this.container = c.container;
        this.jContainer = $(c.container);
        this.jContainer.click(function (e) {
            var target = e.target;
            if (target.tagName == "A" && target.getAttribute("command")) {
                var taskId = target.getAttribute("taskid");
                var fileId = target.getAttribute("fileid");
                var file = utool.getFileById(taskId || fileId);
                This.doCommand({
                    command: target.getAttribute("command"),
                    file: file,
                    imgUrl: target.getAttribute("imgUrl")
                });
                upload_module.model.autoSendMail = false;
            }
        });

        $("#uploadInput").on("click", function(){
	       setTimeout(function(){
		       $("#uploadInput").removeAttr("accept");
	       }, 200);
        });
        
        $("#floatDiv").click(function(e, fakeClick){
	        if(fakeClick !== "fakeClick") {	// 用户手动点击，移除影响
		        uploadManager.callback = null;
		        delete uploadManager.callback;
		        delete uploadManager.filterType;
	        }
        });
    },
    doCommand: function (param) {
        //DeleteFile|CancelUpload|RemoveWaiting
        switch (param.command) {
            case "RemoveFile":
            	this.removeFile(param.file);
            	param.file.isCancel = true;
                break;
            case "DeleteFile":
            	//if (this.isUploading()) { //删除已上传的文件会调用刷新接口，并中止当前上传的文件，需要调用cancel清除当前上传的文件引用
                if (param.file.state =="uploading") {
                    uploadManager.cancelUploading();//删除正在上传的文件
                } else {
                    upload_module.deleteFile(param);
                }
                break;
            case "CancelUpload":
                param.file.cancelUpload();
                uploadManager.autoUpload();
                break;
            case "ResumeUpload"://续传-flash，html5(ajax)
                this.uploadResume(param.file);
                //UploadFacade.uploadResume();//todo 耦合了，通过uploadManager中转调用
                break;
        }
    },
    isUploadAble: function () {
        //当前是否可以使用上传
        return !this.isUploading();
    },
    //添加上传任务
    uploadFile: function (param) {
        if (!$.isArray(param)) param = [param];
        var totalSize = 0;
        var notified = false;
        var flashSize = 1024*1024*100;//flash只支持100M
        for (var i = 0; i < param.length; i++) {
            var item = param[i];
            //截屏控件上传，无法预先判断文件是否重复
            if (item.uploadType != "screenShot" && utool.checkFileExist(item.fileName)) {
                if (!item.replaceImage && !item.insertImage) {
                    var fileNameExist = ComposeMessages.FileNameExist,
                		fileName = top.$T.Utils.htmlEncode(utool.getFileNameByPath(item.fileName));
                    var errorMsg = top.$T.Utils.format(fileNameExist, [fileName]);
                    // FF.alert(errorMsg);
                    top.$Msg.alert(errorMsg, {
                        isHtml: true,
                        onclose: function (e) {
                            //e.cancel = true;//撤销关闭
                        }
                    });
                    return false;
                }
            }
            if (item.uploadType == "multiThread" && item.fileSize == 0) {
                if (!item.replaceImage) {
                    var noFileSize = ComposeMessages.NoFileSize,
                		fileName = top.$T.Utils.htmlEncode(utool.getFileNameByPath(item.fileName));
                    var errorMsg = top.$T.Utils.format(noFileSize, [fileName]);
                    top.$Msg.alert(errorMsg, {
                        onclose: function (e) {
                            //e.cancel = true;//撤销关闭
                        }
                    });
                    // FF.alert(ComposeMessages.NoFileSize.format(utool.getFileNameByPath(item.fileName).encode()));
                    return false;
                }
            }
			if (item.uploadType == 'flash' &&item.fileSize >=flashSize){
	            uploadManager.removeFile(param);
				$("#aLargeAttach").click();
				return false;
			}

            if(!UploadLargeAttach.isLargeAttach){
	            if (item.fileSize) {
	                totalSize += item.fileSize;
	            }
            }
        }
        for (var i = 0; i < param.length; i++) {
            var item = param[i];
            var fileInfo = {};
            fileInfo.uploadType = item.uploadType; // "common|flash|screenshot|html5|mutil",
            fileInfo.fileName = item.fileName; //ie6 会把文件路径带过来
            fileInfo.fileSize = item.fileSize || 0; //普通上传可能不知道文件大小
            fileInfo.taskId = item.taskId || TaskID++; //普通上传就不用这个东西了
            fileInfo.fileObj = item.fileObj; //ajax
            fileInfo.insertImage = item.insertImage;
            fileInfo.replaceImage = item.replaceImage;
            fileInfo.isLargeAttach = item.isLargeAttach;
            if (fileInfo.uploadType == "common") {
                fileInfo.state = "uploading";
            } else {
                fileInfo.state = item.state;
            }
	    	var fileName = fileInfo.fileName.split(/[\\\/]/g).pop();
        	//upload_module.insertRichMediaFile(fileName);
            var file = new UploadFileItem(fileInfo);
            var rsource;
            if(this.filterType) {
	            file.filterType = this.filterType;
	            if(file.filterType.test(fileInfo.fileName) == false) {
		            if(!notified) {
			            notified = true;
			            rsource = file.filterType.source;
			            if(rsource.indexOf("docx") > 0) {
				            rsource = "doc(x), ppt(x), xls(x), pdf, txt";
			            } else if(rsource.indexOf("mp3") > 0) {
				            rsource = "mp3";
			            } else if(rsource.indexOf("mp4") > 0) {
				            rsource = "mp4, flv";
			            }
			            top.$Msg.alert("请选择" + rsource + "类型的文件。");
		            }
		            continue;
	            }
            }
            this.fileList.push(file);
        }
        if(this.filterType) {
	        delete this.filterType;	// 选择文件结束，必须立即删除标识
        }
        this.render({ type: "add" });
        var This = this;
        upload_module.model.requestComposeId(function () {
            This.autoUpload();
        });
    },
    removeFile: function (file) {
        var list = this.fileList;
        for (var i = 0; i < list.length; i++) {
            var f = list[i];
            if (f.taskId == file.taskId) {
                f.remove(function(removed) {
	                var attaches = upload_module.model.composeAttachs;
	                if(removed) {
                        list.splice(i, 1);
                        removeFromAttach(f.fileId);
                    }
                });
                break;
            }
        }
        this.render({ type: "remove" });
        //console.dir(compose_attachs);
    },
    //上传文件，每次只上传一个
    autoUpload: function () {
        //top.addBehavior("写信页-点击上传附件",11);
        var list = this.fileList;
        var isUploading = this.isUploading();
        if (!isUploading) {
            for (var i = 0; i < list.length; i++) {
                var file = list[i];
                if (file.state == "waiting") {
                    file.upload();
                    return true;
                }
            }
            //console.log("全部上传完成：");
            //console.log(list);
            if(typeof this.callback === "function") {
	            this.callback();
	            delete this.callback;
            }
            if (upload_module.model.autoSendMail) {//自动发送
                setTimeout(function () {
                    if (upload_module.model.autoSendMail) {
                        // btnSendOnClick();
                        $("#topSend").click();
                    }
                }, 2000);
            }
        }
        //var pageType = upload_module.model.get('pageType');

        BH({ key: "compose_commonattachsuc" });
        return false;
    },
    isUploading: function () {
        var list = this.fileList;
        for (var i = 0; i < list.length; i++) {
            var file = list[i];
            if (file.state == "uploading") return true;
        }
        return false;
    },
    //界面更新
    render: function (param) {
        if (param && param.type == "refresh") this.container.innerHTML = "";
        //根据文件项的状态更新他们的ui
        var list = this.fileList;
        var previewImg = [];
        UploadFileItem.prototype.previewImg = [];
        for (var i = 0; i < list.length; i++) {
            var f = list[i];
            if (f.insertImage || f.replaceImage) { //如果插入的是内联图片，则不生成附件列表
                f.updateUI();
            } else if (f.hasUI()) {
                f.updateUI();
            } else {
                this.container.appendChild(f.createUI(previewImg));
			//	this.container.insertBefore(f.createUI(previewImg),this.container.firstChild);
            }
        }
        //输出超大附件的列表
        renderLargeAttachList();

		var container = this.container;
        //this.container.style.display = (list.length > 0 || Arr_DiskAttach.length > 0) ? "" : "none";

		if(container.innerHTML != '') {
			$([container, container.parentNode]).show();
		} else {
			$([container, container.parentNode]).hide();
		}
		
		if(window.conversationPage && window.PageMid){
			param.len = list.length || 1;
			top.$App.trigger("conversationResize_" + window.PageMid, param);	
		}
    },
    //重新刷新所有附件状态
    refresh: function (callback) {
        var newList = this.fileList = [];
        var list;

        //添加普通附件
        list = utool.getAttachFiles();
        for (var i = 0; i < list.length; i++) {
            var fileInfo = list[i];
            var file = new UploadFileItem({
                type: "Common",
                fileName: fileInfo.fileName || fileInfo.name,
                fileId: fileInfo.id || fileInfo.fileId,
                fileSize: fileInfo.fileSize || fileInfo.size || 0,
                insertImage: fileInfo.insertImage,
                replaceImage: fileInfo.replaceImage,
                isComplete: (fileInfo.status === 0 || !fileInfo.hasOwnProperty("status")) ? true : false
            });
            newList.push(file);
        }
        //刷界面
        this.render({ type: "refresh" });
        if(typeof callback === "function") {
	        callback();
        }
    },
    onUploadError: function (msg) {
        top.SendScriptLog(msg);
    },
    cancelUploading: function () {
        for (var i = 0; i < this.fileList.length; i++) {
            var item = this.fileList[i];
            if (item.state == "uploading") {
                item.cancelUpload();
            }
        }
    },
    uploadResume: function(file){
        file.uploadResume();
    }
}
UploadFileItem = function() {
    this.init.apply(this, arguments);
}

UploadFileItem.prototype = {
    init: function (f) {
        this.uploadType = f.uploadType; //"common|flash|screenshot|html5|mutil"
        this.fileType = f.fileType || "common"; //disk|common
        this.filePath = f.fileName;
        this.fileName = utool.getFileNameByPath(f.fileName);
        this.fileSize = parseInt(f.fileSize);
        this.taskId = f.taskId || Math.random(); //未传完的附件的任务号
        this.fileId = f.fileId; //附件的id
        this.fileObj = f.fileObj; //ajax文件对象
        this.insertImage = f.insertImage;
        this.replaceImage = f.replaceImage;
        this.isLargeAttach = f.isLargeAttach;
        this.isComplete = Boolean(f.isComplete);
        if (this.isComplete) {
            this.state = "complete";
        } else {
            this.state = f.state || "waiting";
        }

        this.lastUIState = "none";
        this.showProgress = this.uploadType != "common"; //是否显示上传进度条
        this.knownFileSize = f.uploadType != "common";
    },
    hasUI: function () {
        return Boolean(this.container);
    },
    createUI: function (previewImg) {
        var element = document.createElement("li");
        //var element = document.createElement("div");
        element.className = '';
        this.container = element;
        this.updateUI(previewImg);
        return element;
    },

	remove: function (callback) {
		var container = this.container;
		var fileName = this.fileName;
		var hasInserted = false;

		var filenameNoExt = fileName.substr(0, fileName.lastIndexOf("."));

		if(typeof callback !== "function") {
			callback = noop;
		}

		if (this.hasUI()) {
			htmlEditorView.editorView.editor.jEditorDocument.find(".inserted_Mark span.name_container").each(function(){
				if(this.getAttribute("title") == filenameNoExt){
					hasInserted = true;
				}
			});

			if(hasInserted) {
				top.$Msg.confirm("删除附件后，邮件正文中的文件会同时被删除，确定删除吗？", function(){
					container.parentNode.removeChild(container);
					upload_module.removeRichMediaFile(fileName);
					callback(true);
				}, function(){
					callback(false);
				},{
					icon: "i_warn"
				});
			} else {
				container.parentNode.removeChild(container);
				callback(true);
			}
		}
	},
	
    //更新UI
    updateUI: function (previewImg) {
        var isUpdateProgress = this.state == "uploading" && this.showProgress && this.lastUIState == "uploading";
        if (this.insertImage || this.replaceImage) {
            this.updateInsertImageLoading();
            return;
        }
        if (isUpdateProgress) {
            //只更新进度条
            this.updateProgress();
        } else {
            //更新html
            var htmlCode = "";
            switch (this.state) {
                case "waiting":
                    htmlCode = this.getWaitingHTML();
					$("#divUploadTip").hide();//开始上传的时候要隐藏tips
                    break;
                case "complete":
                    htmlCode = this.getCompleteHTML();
                    utool.fillSubject(this.fileName);
                    break;
                case "uploading":
                    htmlCode = this.showProgress ? this.getProgressUploadingHTML() : this.getCommonUploadingHTML();
                    break;
                case "blockerror": //上传中断
                    htmlCode = this.getProgressUploadingHTML({ resume: true });
                    break;
                case "error":
                    htmlCode = "";
                    break;
            }
            if (this.state == "uploading") {
                // this.container.className = "upLoad shadow";
            } else if (this.container.className == "upLoad shadow") {
                //this.container.className = "";
            }
            this.container.innerHTML = htmlCode;
            if (this.state == "complete") {
                //var files = upload_module.model.get('initDataSet').attachments;
                var filename = $(this.container).find("span:first").text();
                var fileId = $(this.container).find("span:first").attr("fileid");
                var num1 = filename.lastIndexOf(".");
                var num2 = filename.length;
                var file = filename.substring(num1, num2); //后缀名  
                var imgUrl = $(this.container).find("a:first").attr("imgUrl");
                //var downloadUrl = upload_module.model.getAttachUrl(fileId, encodeURIComponent(filename, true);
                var downloadurl = $(this.container).find("a:first").attr("downloadurl");
                var isImg = /(?:\.jpg|\.gif|\.png|\.ico|\.jfif|\.bmp|\.jpeg|\.jpe)$/i.test(file);
                if (isImg) {
                    //var downloadUrl = top.$T.Utils.format("http://" + location.host + "/RmWeb/view.do?func=attach:download&type=attach&encoding=1&sid={0}&mid={1}&offset={2}&size={3}&name={4}",
                    //[upload_module.model.getSid(), upload_module.model.get('initDataSet').omid, files[i].fileOffSet, files[i].base64Size, encodeURIComponent(files[i].fileName)]);
                    var previewObj = {
                        imgUrl: imgUrl,
                        fileName: filename,
                        downLoad: downloadurl
                    }
                    var length = UploadFileItem.prototype.previewImg.push(previewObj);
                    $(this.container).attr("index", length - 1);
                }
            };

			// clientType 1 webmail 2 从酷版上传（跨设备）
            if(this.clientType == 2 && this.state === "waiting"){
	            //$(this.container).find('[command="CancelUpload"]').hide();
	            $(this.container).find('[command="RemoveFile"]').hide();
            }
            $(this.container).show();
        }
        this.lastUIState = this.state;
    },
    srcollImgPreview: function (This) {
        var self = this;
        var num = $(This).parents("li").attr("index");
        if (num != "") {
            if (typeof (top.focusImagesView) != "undefined") {
                top.focusImagesView.render({ data: UploadFileItem.prototype.previewImg, num: parseInt(num) });
            }
            else {
                top.M139.registerJS("M2012.OnlinePreview.FocusImages.View", "packs/focusimages.html.pack.js?v=" + Math.random());
                top.M139.requireJS(['M2012.OnlinePreview.FocusImages.View'], function () {
                    top.focusImagesView = new top.M2012.OnlinePreview.FocusImages.View();
                    top.focusImagesView.render({ data: UploadFileItem.prototype.previewImg, num: parseInt(num) });
                });
            }
        };
    },
    //添加内联图片上传loading效果
    updateInsertImageLoading: function () {
        switch (this.state) {
            case "waiting":
            case "uploading":
                top.M139.UI.TipMessage.show('图片加载中...');
                //top.WaitPannel.show('图片加载中...');
                break;
            case "complete":
                top.M139.UI.TipMessage.hide();
                break;
            case "error":
                break;
        }
        this.lastUIState = this.state;
    },
    isUploading: false,
    //等待上传的html
    getWaitingHTML: function () {
        var htmlCode = '<i class="{i_attachmentS}"></i><span class="ml_5">{prefix}<span class="gray">{suffix}</span></span>\
						<span class="progressBarDiv">\
							<span class="progressBar"></span>\
							<span class="progressBarCur">\
								<span style="width: 0%;"></span>\
							</span>\
						</span>\
						<span class="gray">{getFileMd5}{getMd5}({fileSizeText})</span>\
						<a hideFocus="1" href="javascript:void(0)" class="ml_5" taskid="{taskId}" fileid="{fileId}" uploadtype="{uploadType}" filetype="{fileType}" command="RemoveFile">删除</a>';
        var shortName = utool.shortName(this.fileName),
			prefix = shortName.substring(0, shortName.lastIndexOf('.') + 1),
			suffix = shortName.substring(shortName.lastIndexOf('.') + 1, shortName.length);
        var fileIconClass = $T.Utils.getFileIcoClass(0, this.fileName);
        var data = {
            fileIconClass: fileIconClass,
            prefix: prefix,
            suffix: suffix,
            fileId: this.taskId,
            fileSizeText: "",
            fileType: this.fileType,
            uploadType: this.uploadType,
            taskId: this.taskId,
            getFileMd5:'扫描中',
            getMd5:this.getMd5 || '0%'
        };
        //如果是普通上传，就不知道文件大小了
        if (this.knownFileSize) {
            data.fileSizeText = (this.fileType == "largeAttach" ? this.fileSize : top.$T.Utils.getFileSizeText(this.fileSize, { maxUnit: "K", comma: true }));
        }
        data.i_attachmentS = this.isLargeAttach?'i_bigAttachmentS':'i_attachmentS';
        htmlCode = top.$T.Utils.format(htmlCode, data);
        return htmlCode;
    },

    getDownloadUrl: function() {
	    var file,
	    	model,
	    	pageType,
        	downloadUrl,
        	fileId = this.fileId;

        model = upload_module.model;
        pageType = model.get('pageType');
        if ("|draft|forward|reply|replyAll|resend|".indexOf('|' + pageType + '|') >= 0) {	//草稿箱打开，需要用读信地址
            // 从restoreDraft的报文中找到这个附件
            file = _.find(model.get('initDataSet').attachments, function(item){
			    return item.fileId === fileId;
			}) || {};
			if(!file.fileOffSet){
				downloadUrl = model.getAttachUrl(fileId, encodeURIComponent(this.fileName), true);
				return downloadUrl;
			}
			downloadUrl = "http://" + location.host + "/RmWeb/view.do?func=attach:download&type=attach&encoding=1&sid={0}&mid={1}&offset={2}&size={3}&name={4}";
            downloadUrl = top.$T.Utils.format(downloadUrl, [model.getSid(), model.get('mid'), file.fileOffSet, file.base64Size, encodeURIComponent(file.fileName)]);
            //downloadUrl = encodeURIComponent(downloadUrl);
        } else {
        	downloadUrl = model.getAttachUrl(fileId, encodeURIComponent(this.fileName), true);
        }
        return downloadUrl;
    },

    getImgUrl: function(FilePreview) {
	    var imgUrl = "";
        var model = upload_module.model;
	    var fileId = this.fileId;
	    var pageType = model.get('pageType');
	    var file;

        if (pageType == "draft" || pageType == "resend") {
            imgUrl = "";
        } else {
		    file = _.find(model.get('initDataSet').attachments, function(item){
			    return item.fileId === fileId;
			}) || {};
		    
            imgUrl = FilePreview.getImgUrl({
                fileSize: file.fileSize,
                fileOffSet: file.fileOffSet,
                fileName: $T.Html.encode(file.fileName),
                type: "email"
            }, model.get('mid'));
        }
        return imgUrl;
    },

    //上传完成的html
    getCompleteHTML: function () {
        var imgUrl = "";
        var previewUrl = "";
        var downloadUrl = "";
        var previewHtml = "";
        var comefrom = "compose";
        //var insertImgHtml = "";

        var tempArr;
        var target = "_blank";
        var clickEvent = "";
        var model = upload_module.model;
	    var pageType = model.get('pageType');
        var FilePreview = new top.M2012.ReadMail.View.FilePreview();
        var previewType = FilePreview.checkFile(this.fileName, this.fileSize);

        var showFilePreview = this.fileType != "largeAttach" && FilePreview.isRelease();
        var isImg = /\.(?:jpg|gif|png|ico|jfif|bmp|jpeg?)$/i.test(this.fileName);
        var tempStr = "<a style='' {6} hideFocus='1' imgUrl='{3}' fileName='{5}' class='ml_5' behavior='{0}' ext='2' href=\"{1}\" target='{7}' title='预览文件' downloadurl='{4}' >{2}</a>";
        var behaviorKey = previewType == 1 ? "预览-在线预览" : "预览-预览压缩包";
        var option3 = previewType == 1 ? "预览" : "打开";


        showFilePreview &= previewType > 0;		// 没有注解的代码
        
        if (showFilePreview) {
			downloadUrl = this.getDownloadUrl();

		    /*if(previewType == 1 && isImg) {
			    previewUrl = "javascript:;";
                target = "_self";
                clickEvent = "onclick = 'UploadFileItem.prototype.srcollImgPreview(this)'";
                downloadUrl = decodeURIComponent(downloadUrl);
                //var tempImg = "<a class='ml_5' href='javascript:;' hideFocus='1' imgUrl='{0}' command='InsertImgFile'>插入正文</a>"
                //insertImgHtml = top.$T.Utils.format(tempImg, [downloadUrl]);
			} else {*/
	        if ("|draft|forward|reply|replyAll|resend|".indexOf('|' + pageType + '|') >= 0) {	//草稿箱打开，需要用读信地址
	            comefrom = "draftresend";
            }
			previewUrl = top.M2012.ReadMail.View.FilePreview.getUrl({
	            fileName: encodeURIComponent(this.fileName),
	            fileSize: this.fileSize,
	            type: "email",
	            downloadUrl: downloadUrl,
	            contextId: this.fileId,
	            comefrom: comefrom,
	            composeId: model["composeId"]
	        }, model.get("currFid"));	// todo currFid是干什么的？这里可以为空
			//}

	        imgUrl = this.getImgUrl(FilePreview);

            tempArr = [behaviorKey, previewUrl, option3, imgUrl, downloadUrl, $T.Html.encode(this.fileName), clickEvent, target];
            previewHtml = top.$T.Utils.format(tempStr, tempArr);
        } //}附件预览

        var fileSizeText = this.fileType == "largeAttach" ? this.fileSize : top.$T.Utils.getFileSizeText(this.fileSize, { maxUnit: "K", comma: true });

		if(isImg) {
			previewHtml += '<a hideFocus="1" class="ml_5" href="javascript:void(0)" onclick="upload_module.insertImgFile(\''+downloadUrl+'\')">添加到正文</a>';
		} else if(/\.(?:mp3|mp4|m4a|m4v|flv|docx?|pptx?|xlsx?|pdf|txt)$/i.test(this.fileName)) {
			if(this.fileSize > 1024 * 1024 * 20 && /\.(?:docx?|pptx?|xlsx?|pdf|txt)$/i.test(this.fileName)) {
				// skip
			} else {
				previewHtml += '<a hideFocus="1" class="ml_5" href="javascript:void(0)" onclick="upload_module.insertRichMediaFile(\''+this.fileName+'\', \''+fileSizeText+'\')">添加到正文</a>';
			}
		}

        //{insertImgHtml}\ //屏蔽插入正文功能，后台与内联图片冲突
		//下面的i 原来的class为{fileIconClass} 
        var htmlCode = '<i class="i_attachmentS"></i>\
						<span class="ml_5" fileid="{fileId}">{prefix}<span class="gray">{suffix}</span></span>\
						<span class="gray ml_5">({fileSizeText})</span>\
						{previewHtml}\
						<a hideFocus="1" class="ml_5" href="javascript:void(0)" fileid="{fileId}" filetype="{fileType}" command="DeleteFile">删除</a>';
        var shortName = utool.shortName(this.fileName);
        var fileIconClass = $T.Utils.getFileIcoClass(0, this.fileName);

        return top.$T.Utils.format(htmlCode, {
            fileIconClass: "i_attachmentS",
            prefix: shortName.substring(0, shortName.lastIndexOf('.') + 1),
            suffix: shortName.substring(shortName.lastIndexOf('.') + 1),
            fileSizeText: fileSizeText,
            fileId: this.fileId,
            fileType: this.fileType,
           //insertImgHtml : insertImgHtml,
            previewHtml: previewHtml
        });
    },

    //普通上传中,没有进度条,取消上传不用传什么参数
    getCommonUploadingHTML: function () {
        var htmlCode = '<i class="i_attachmentS"></i>\
						<span class="ml_5">{prefix}<span class="gray">{suffix}</span></span>\
						<span class="progressBarDiv" style="display:none">\
							<span class="progressBar"></span>\
							<span class="progressBarCur">\
								<span style="width: 0%;"></span>\
							</span>\
						</span>\
						<span class="gray" style="display:none">0%</span>\
						<span class="gray">上传中……</span>\
						<a hideFocus="1" class="ml_5" href="javascript:void(0)" command="CancelUpload" taskid="{taskId}" uploadtype="{uploadType}">删除</a>';
        var shortName = utool.shortName(this.fileName),
			prefix = shortName.substring(0, shortName.lastIndexOf('.') + 1),
			suffix = shortName.substring(shortName.lastIndexOf('.') + 1, shortName.length);
        var fileIconClass = $T.Utils.getFileIcoClass(0, this.fileName);
        var data = {
            fileIconClass: fileIconClass,
            prefix: prefix,
            suffix: suffix,
            uploadType: "common",
            taskId: this.taskId
        };
        htmlCode = top.$T.Utils.format(htmlCode, data);
        return htmlCode;
    },
    //显示进度条的上传中
    getProgressUploadingHTML: function (args) {
        var htmlCode = '<i class="{i_attachmentS}"></i>\
						<span class="ml_5">{prefix}<span class="gray">{suffix}</span></span>\
						<span class="progressBarDiv">\
							<span class="progressBar"></span>\
							<span class="progressBarCur">\
								<span style="width: {progress}%;"></span>\
							</span>\
						</span>\
						<span class="gray">{progress}%</span>\
						<span class="gray">{uploadTipText}({sendedSizeText})</span>\
						<a class="ml_5" href="javascript:void(0)" command="CancelUpload" taskid="{taskId}" uploadtype="{uploadType}">删除</a>';
        var shortName = utool.shortName(this.fileName),
			prefix = shortName.substring(0, shortName.lastIndexOf('.') + 1),
			suffix = shortName.substring(shortName.lastIndexOf('.') + 1, shortName.length);
        var fileIconClass = $T.Utils.getFileIcoClass(0, this.fileName);
        var uploadTipText = "上传中";
        if (args && args.resume) {
            uploadTipText = "<b style='color:red'>上传失败</b>";
            htmlCode += "&nbsp;|&nbsp;<a href=\"javascript:void(0)\" command=\"ResumeUpload\" taskid=\"{taskId}\">续传</a>"
        }
        var data = {
            fileIconClass: fileIconClass,
            prefix: prefix,
            suffix: suffix,
            uploadTipText:uploadTipText,
            sendedSizeText: top.$T.Utils.getFileSizeText(this.sendedSize || 0, { maxUnit: "K", comma: true }),
            fileSizeText: top.$T.Utils.getFileSizeText(this.fileSize, { maxUnit: "K", comma: true }),
            progress: Math.min(this.progress || 0, 99),
            uploadType: this.uploadType,
            taskId: this.taskId
        };
        data.i_attachmentS = this.isLargeAttach?'i_bigAttachmentS':'i_attachmentS';
        htmlCode = top.$T.Utils.format(htmlCode, data);
        return htmlCode;
    },
    //更新进度条
    updateProgress: function () {
        //不刷新删除按钮
        var li = document.createElement("li");
        li.innerHTML = this.getProgressUploadingHTML();
        var new2 = $(li).children()[2];
        var new3 = $(li).children()[3];
        var new4 = $(li).children()[4];
        var old2 = $(this.container).children()[2];
        var old3 = $(this.container).children()[3];
        var old4 = $(this.container).children()[4];
        old2.innerHTML = new2.innerHTML;
        old3.innerHTML = new3.innerHTML;
        old4.innerHTML = new4.innerHTML;

        //this.container.innerHTML = this.getProgressUploadingHTML();
    },
    upload: function () {
        if (this.uploadType == "flash") {
            upload_module_flash.upload(this.taskId);
        } else if (this.uploadType == "multiThread") {
            upload_module_multiThread.upload(this);
        } else if (this.uploadType == "ajax") {
            upload_module_ajax.upload(this);
        }
    },
    //取消正在上传的任务
    cancelUpload: function () {
        if (this.uploadType == "common") { 
            var form = document.forms["fromAttach"];
            form.reset();
            refreshAttach();
            utool.logUpload(UploadLogs.CommonCancel);
        } else if (this.uploadType == "flash") {
            upload_module_flash.cancel(this);
        } else if (this.uploadType == "multiThread") {
            upload_module_multiThread.cancel(this);
            refreshAttach(true);
            uploadManager.removeFile(this);
        } else if (this.uploadType == "ajax") {
            upload_module_ajax.cancel(this);
            uploadManager.removeFile(this);
            return;
        }
        
        upload_module.model.autoSendMail = false;
        //refreshAttach(true); //刷新附件列表，保证准确性
    },
    //续传上传的任务 - 支持flash html5(ajax)
    uploadResume: function(){
        if (this.uploadType == "flash") {
            UploadFacade.uploadResume();
        }else if(this.uploadType == "ajax"){
            upload_module_ajax.uploadResume(this);
        }
    }
};
//var asynDeletedFile = "";

//var compose_attachs = [];

function addCompleteAttach(obj){
    //console.dir(obj);
    //给obj添加insertImage,replaceImage属性，不然刷新的时候会添加内联图片附件列表
    var fileList = uploadManager.fileList;
    for(var j=0;j<fileList.length;j++){
        var file = fileList[j];
        if(file.fileName == obj.fileName){
	    obj.insertImage = file.insertImage;
	    obj.replaceImage = file.replaceImage;
            break;
        }
    }
    for(var i=0;i<upload_module.model.composeAttachs.length;i++){
        if(upload_module.model.composeAttachs[i].fileId == obj.fileId) return;
    }
    upload_module.model.composeAttachs.push({
        fileId:obj.fileId,
        fileName:obj.fileName,
        fileSize:obj.fileSize,
	insertImage: obj.insertImage,
	replaceImage: obj.replaceImage
    });
}
function removeFromAttach(fid){
    for(var i=0;i<upload_module.model.composeAttachs.length;i++){
        if(upload_module.model.composeAttachs[i].fileId==fid){
            upload_module.model.composeAttachs.splice(i,1);
            return;
        }
    }
}

/*
界面展示相关逻辑
*/
/* 初始化发件人列表 */
function initAddrList() {
     Utils.UI.selectSender("selFrom",true,document);
}
function getReplyLetterStartHtml(mid) {
    var letter = top.ReadMailInfoTable[mid].response;
    var htmlCode = '<div style="padding-right: 0px; padding-left: 0px; font-size: 12px; padding-bottom: 2px; padding-top: 2px; font-family: arial narrow">';
    htmlCode += '------------------&nbsp;原始邮件&nbsp;------------------\n</div>';
    htmlCode += '<div style="font-size: 12px">';
    htmlCode += '<div><b>发件人:</b>&nbsp;{from};\n</div>';
    htmlCode += '<div><b>发送时间:</b>&nbsp;{sentDate}\n</div>';
    htmlCode += '<div><b>收件人:</b>&nbsp;{to}; \n</div>';
    htmlCode += '<div><b>抄送:</b>&nbsp;{cc}; \n</div>';
    htmlCode += '<div>\n</div>';
    htmlCode += '<div><b>主题:</b>&nbsp;{subject}</div></div><div>&nbsp;\n</div>';
    var formatObj = {
        subject: letter.subject.encode(),
        from: (letter.account||"").toString().encode(),
        to: (letter.to || "(无)").encode(),
        cc: (letter.cc || "(无)").encode(),
        sentDate: (letter.sendDate && (new Date(letter.sendDate*1000)).format("yyyy年MM月dd日 hh点mm分") || "")
    };
    htmlCode = String.format(htmlCode, formatObj);
    return htmlCode;
}


//编辑器重设大小
function setEditorSize() {
}
$(window).resize(resizeAll);
function resizeAll() {
}
//修复IE6页面宽度
function setIframeSize() {
    try {
        jQuery("body").width(jQuery(window.frameElement).width());
    } catch (e) { }
}
ICONS_CLASS = {
    "access.gif": ["ade", "snp", "mda", "mdb", "adp"],
    "msword.gif": ["wiz", "rtf", "dot", "doc", "wbk"],
    "excel.gif": ["xlw", "xlv", "xlt", "slk", "xls", "xld", "xll", "xlb", "xla", "xlk", "dif", "csv", "xlc", "xlm"],
    "ppt.gif": ["ppa", "pps", "ppt", "pwz", "pot"],
    "ii_WAR.GIF": ["rar", "zip", "iso", "7z"],
    "MUSIC.GIF": ["aifc", "aiff", "aif", "snd", "au", "midi", "mid", "rmi", "mp3", "wav", "m3u", "wax", "wma"],
    "JPG.GIF": ["bmp", "dib", "gif", "jpe", "jpg", "jpeg", "jfif", "png", "mdi", "ico", "xbm"],
    "WORD.GIF": ["css", "323", "html", "htm", "sol", "txt", "sor", "wsc", "sct", "htt", "htc", "xml", "xsl", "odc", "rqy", "vcf"],
    "Movie.GIF": ["mpa", "mpg", "m1v", "mpeg", "mp2", "mpe", "mp2v", "mpv2", "mov", "qt", "IVF", "asx", "asf", "avi", "wm", "wmv", "wmx", "wvx", "rm"]
};
function getLinkImgPath(ext) {
    ext = ext.toLowerCase();
    for (var p in ICONS_CLASS) {
        if ($.inArray(ext, ICONS_CLASS[p])!=-1) return p;
    }
    return "默认.GIF";
}
/*
function disableLink(link) {
    link.style.color = "silver";
    link._onclick = link.onclick;
    link.style.cursor = "none";
    link.onclick = null;
}
function ableLink(link) {
    link.style.color = "";
    if (link._onclick) link.onclick = link._onclick;
    link.style.cursor = "pointer";
}*/

function showCC() {
    if (document.getElementById("trCc").style.display == "none") {
	    aAddCcOnClick($("#aShowCc")[0],true);
    }
}
function showBCC() {
    if (document.getElementById("trBcc").style.display == "none") {
	    aAddBccOnClick($("#aShowBcc")[0]);
    }
}
$(function() {
    //button标签点击失去焦点
    $("button,input:button").click(function() {
        $(this).blur();
    });
    //导航按钮样式切换
    $(".navgation button").mouseover(function() {
        $(this).addClass("on");
    });
    $(".navgation button").mouseout(function() {
        $(".navgation button").removeClass("on");
    });
    //通讯录与信纸切换
    /*
    $("#thContactFrame").click(function() {
        showContactFrame();
    });
    $("#thLetterPaperFrame").click(function() {
        showPaperFrame();
    });*/
    $("#btnContactsSelectMenu").click(function(e) {
        if (!window.gotoAddressMenu) {
            gotoAddressMenu = new PopMenu();
            gotoAddressMenu.addItem("新建联系人", function() { top.Links.show("addrContacts"); top.addBehavior("写信页新建联系人"); });
            gotoAddressMenu.addItem("管理通讯录", function() { top.Links.show("addr"); top.addBehavior("写信页通讯录"); });
        }
        gotoAddressMenu.show(this);
        top.$Event.stopEvent(e);
    });
    //标签页onShow的时候
    try {
        window.frameElement.module.onShow.addEventListener(function() {
                //setTimeout(resizeAll, 0);
            }
        );
    } catch (e) { }

    //修复浏览器的bug引起的小问题,与业务无关
    //if (document.all) {
        //var frm = document.getElementById("HtmlEditor");
        //var frm = htmlEditorView.editorView.editorWindow;
        //frm.onfocus = function() {
            //if (frm.click) frm.click();
       // }
        //frameElement.onblur = function() {
            //if (frm.click) frm.click();
        //}
    //}
    /*
    AddressBook.onload = function() {
        resizeAll();
    }
    //创建通讯录
    AddressBook.createMailStyle(
        document.getElementById("divAddressList"),
        function(addrInfo) {
            RichInputManager.addMailTofocus(addrInfo);
        }
    );*/
});
//右侧切到通讯录
/*
function showContactFrame() {
	$("#divLetterPaper").hide();
	$("#divAddressList").show();
	$("#thLetterPaperFrame").removeClass("active");
	$("#thContactFrame").addClass("active");
}
//右侧切到信纸
function showPaperFrame(letterPaperUrl) {
	$("#divAddressList").hide();
	$("#divLetterPaper").show();
	$("#thContactFrame").removeClass("active");
	$("#thLetterPaperFrame").addClass("active");
    var div = document.getElementById("divLetterPaper");
    if(div.innerHTML.trim()==""){
        div.innerHTML = '<iframe frameborder="0" scrolling="auto" style="width:100%;border:0;height:374px;" src="letterpaper/letterpaper.htm" id="frmLetterPaper"></iframe>';
    }
    var frame = document.getElementById("frmLetterPaper");
    //加载特定信纸
    //letterPaperUrl="jieri_xinzhi05.html";
    if (letterPaperUrl) {
        frame.onload = function() {
            this.onload = null;
            this.contentWindow.setPaper(letterPaperUrl);
        }
    }
}*/

﻿/**
 * @fileOverview 定义基础邮箱写信所需公共代码
 */
 (function(jQuery,Backbone,_,M139){
    var $ = jQuery;
    M139.namespace("M2012.Compose.Model",Backbone.Model.extend({
    	defaults : {
            pageType : '',
            mid : '',
            sd : '',
            ids : '',
            isEditorPageOnload : true,
            isComposePageOnload : false,
            initDataSet : {}// 用于存储 原邮件对象 如：待回复邮件，待转发邮件等
        },
		isChrome : false,
		isFirefox : false,
		PageStateTypes : {
		    //正在初始化
		    Initializing: 1,
		    //正在上传附件
		    Uploading: 2,
		    //正在发送邮件
		    Sending: 3,
		    //正在保存附件
		    Saving: 4,
		    //普通状态
		    Common: 5,
		    //发送完成
		    Sended: 6
		},
		PageState : 1,
		autoSendMail : false,
		sid : '',
		composeId : '',
		messageId : '',
		draftId : '',
		composeAttachs : [],
		asynDeletedFile : '',
        maxUploadLargeAttach: 1,
		mailInfo : {
            id: "",
        	mid : "", //后台返回的草稿ID,成功调用存草稿方法后修改该属性
			messageId: "",
        	account: "",//发件人
	        to: "",//收件人地址‘,’号分隔
	        cc: "",//抄送人地址
	        bcc: "",//密送人地址
	        showOneRcpt: 0, //是否群发单显1 是 0否 
	        isHtml: 1,
	        subject: "",
	        content: "",
	        priority: 1, //是否重要
	        signatureId: 0,//使用签名档
	        stationeryId: 0,//使用信纸
	        saveSentCopy: 1,//发送后保存副本到发件箱
	        requestReadReceipt : 0,//是否需要已读回执
	        inlineResources: 1, //是否内联图片
	        scheduleDate: 0, //定时发信
	        normalizeRfc822: 0,
	        remoteAttachment: [],
	        attachments: [],//所有附件信息
	        headers : {}
        },
        autoSaveTimer : {
        	timer : null,
        	interval : 120,
        	subMailInfo : {
                // todo 添加 收件人
        		content : "",// 编辑器内容
        		subject : ""// 主题
        	}
        },
		pageTypes : {
            COMPOSE : 'compose',//写新邮件
            REPLY : 'reply',//回复
            REPLYALL : 'replyAll',//回复全部
            FORWARD : 'forward',//转发
            FORWARDASATTACH : 'forwardAsAttach',//作为附件转发
            FORWARDATTACHS : 'forwardAttachs',// 纯附件直接转发
            FORWARDMORE : 'forwardMore',//多封邮件作为附件转发
            DRAFT : 'draft',
            RESEND : 'resend',
            VCARD : 'vCard', //电子名片，向下迁移到自定义邮件中

            //增加一种新的通用型的，写信页去异步加载一个内容填充逻辑.js，该js内调用写信页定义
            //好的开放API来填入内容，控制邮件属性，最小侵入写信主干逻辑。
            //包.js放入推广内容区 packs/promotion//xxx_201310.pack.js，带上线月份，便于确认清理
            CUSTOM : 'customExtMail',

            UPLOAD_LARGE_ATTACH : 'uploadLargeAttach'// 显示大附件上传框
        },
        tipWords : {
        	LOADING : '加载中...',
        	SENDING : '邮件正在发送...',
        	LOAD_FAIL : '加载失败，请重试。',
        	AUTO_SAVE_SUC : '{0}点{1}分自动保存草稿成功',
        	SAVE_SUC : '{0}点{1}分成功保存到草稿箱',
        	LACK_SUBJECT : '未填写主题，确定发送吗？',
        	LACK_ATTACHMENTS : '您在邮件中提到了附件，可能忘了上传附件。确定继续发送吗？',
        	CANCEL_SEND : '关闭写信页，未保存的内容将会丢失，是否关闭？',
        	INVALID_DATE : '定时发送时间不能比当前时间早。',
        	NO_RECEIPT : '收件人格式不正确。',
        	TO_DEFAULT_TEXT : '输入对方移动手机号，就能给他发邮件',
        	UPLOAD_LARGEATTACH : '添加最大{0}G的附件和暂存柜文件、彩云文件',
        	SCHEDULE_MAIL : '您设置在{0}定时发送此邮件'
        },
        richInputTypes : {
        	TO : 'to',// 收件人
        	CC : 'cc',// 抄送
        	BCC : 'bcc'// 密送
        },
        actionTypes : {
        	CONTINUE : "continue",// 继续编辑 
		 	AUTOSAVE : "autosave",// 自动保存
		 	SAVE : "save",//存原稿并继续编辑
		 	DELIVER : "deliver"//立即发送邮件
        },
        systemSigns : ["Best wishes for the year to come!",
                "I hope you have a most happy and prosperous New Year.！",
                "天增岁月人增寿，春满乾坤福满门；福开新运，财源广进！",
                "恭祝您的事业蒸蒸日上，新年更有新气象！",
                "值此春回大地、万象更新之良辰，敬祝您福、禄、寿三星高照，阖府康乐，如意吉祥！ 拜新年！",
                "上联：加薪买房购小车；下联：娶妻生子成家室；横批：接财神！",
                "傲不可长，欲不可纵，乐不可极，志不可满。","宝剑锋从磨砺出，梅花香自苦寒来。",
                "博观而约取，厚积而薄发。","博学之，审问之，慎思之，明辨之，笃行之。",
                "不登高山，不知天之高也；不临深溪，不知地之厚也。","不飞则已，一飞冲天；不鸣则已,一鸣惊人。",
                "不可乘喜而轻诺，不可因醉而生嗔，不可乘快而多事，不可因倦而鲜终。","沧海横流，方显英雄本色。",
                "沉舟侧畔千帆过，病树前头万木春。","尺有所短，寸有所长。物有所不足，智有所不明。"],
        sysImgPath : ["/upload/photo/system/nopic.jpg","/upload/photo/nopic.jpg"],
        containerHeight : {// 自适应
        	emailInputBox : 32,// 地址输入框高度
        	allToOne : 5,// 单击群发单显输入框高度的浮动值
        	moreOptions : 35// 单击底部更多选项小三角后底部高度的浮动值
        },
        logger: new top.M139.Logger({name: "M2012.Compose"}),
        tabName : '', // 当前写信页签名称，用于激活写信页
        editorMinHeight : 210, // 编辑器最小高度
        addrinputMaxHeight : 88, // 地址输入框最大高度，超过则显示滚动条
        handlerQueue: [],

        /** 
        *写信所需公共代码
        *@constructs M2012.Compose.Model
        *@param {Object} options 初始化参数集
        *@param {String} options.mid 可选参数，根据mid创建一个实例，即围绕这个mid进行工作 发送完邮件即结束这个mid的任务，不要重复使用这个model实例
        *@example
        */
        initialize:function(options){
        	this.initGlobalVars();
        	this.initUploadComponent();
            this.on('route', function() {
                this.routePage();
            });
        },
        // 初始化全局变量
        initGlobalVars : function(){
            var self = this;

        	var pageType = $composeApp.query.type || ($composeApp.inputData && $composeApp.inputData.type) || this.pageTypes['COMPOSE'],
            	composeType = $composeApp.query.composeType,
            	id = $composeApp.query.id,
	        	mid = $composeApp.query.mid,

	            ids = $composeApp.query.ids?$composeApp.query.ids.split(","):[]; //转发多封邮件会带多个id
	        if(pageType == this.pageTypes['COMPOSE'] && id == "2" && !top.ssoComposeHandled && composeType && mid){
		    	top.ssoComposeHandled = true; //只处理一次
		    	pageType = composeType;
		    }
		    self.sid = self.getSid();
		    self.set('pageType', pageType);
		    self.set('mid', mid);

		    self.set('ids', ids);
		    self.resourcePath = '/rm/coremail/';// todo 
		    self.PageState = this.PageStateTypes.Initializing;
			self.isChrome = $B.is.chrome;
			self.isFirefox = $B.is.firefox;
            //根据套餐显示最大上传文件大小
            if (top.SiteConfig.comboUpgrade) {
                self.maxUploadLargeAttach = Math.floor(top.$User.getCapacity("maxannexsize") / 1024) || 4;
            }
            self.tipWords['UPLOAD_LARGEATTACH'] = self.tipWords['UPLOAD_LARGEATTACH'].format(self.maxUploadLargeAttach);

            self.tabName = top.$App.getCurrentTab().name;

            var siteDomain = self.getTop().getDomain("mail").replace(location.protocol+'//','');
            var srcDomain = self.getTop().getDomain("resource").substring(13);

            self.regG2 = new RegExp('(g\d+).' + siteDomain, 'i');
            self.regApp = new RegExp('appmail[3]?.' + siteDomain, 'i');
            self.regSrc = new RegExp('image[0s]' + srcDomain, 'i');


            var TYPE = self.pageTypes;
            self.regRouter({
                matchs: [ TYPE.COMPOSE, TYPE.UPLOAD_LARGE_ATTACH ],
                onroute: function() {
                    var dataSet = self.get('initDataSet');
                    var queryObj = $composeApp.query;

                    dataSet.isShowVideoMail = Boolean(queryObj['videomail']);//视频邮件
                    dataSet.isShowTimeSet = Boolean(queryObj['timeset']) || $composeApp.inputData?$composeApp.inputData.timeset:'';//定时邮件
                    dataSet.scheduleDate = queryObj['timeset'] || $composeApp.inputData?$composeApp.inputData.timeset:'';//时间
                    dataSet.isShowSelectBox = Boolean(queryObj['showSelectBox']);//超大附件
                    dataSet.account = queryObj['userAccount'] || $composeApp.inputData?$composeApp.inputData.userAccount:'';//发信账号
                    dataSet.to = queryObj['receiver'] || $composeApp.inputData?$composeApp.inputData.receiver:'';//收件人 
                    dataSet.subject = queryObj['subject'] || $composeApp.inputData?$composeApp.inputData.subject:'';//主题
                    dataSet.content = queryObj['content'] || $composeApp.inputData?$composeApp.inputData.content:'';//正文
                    dataSet.template = queryObj['template'] || $composeApp.inputData?$composeApp.inputData.template:'';//邮件模板
                    dataSet.letterPaperId = queryObj['letterPaperId'] || $composeApp.inputData?$composeApp.inputData.letterPaperId:'';//信纸ID
                    dataSet.saveSentCopy = 1; // 保存到收件箱

                    self.set('isComposePageOnload', true);
                }
            });
        },

        /**
        * 注册页面路由，注意撰写邮件只会在一种状态下完成，
        * 所以没有多路由，而是提前分拣出唯一的处理状态。
        * 但单个状态，可以有个onroute函数队列顺序触发
        */
        regRouter: function (router) {
            var self = this;
            var pageType = self.get('pageType');

            var matchs = router.matchs;
            for (var i = 0; i < matchs.length; i++) {
                if (matchs[i] == pageType) {
                    self.handlerQueue.push(router.onroute);
                }
            }
        },

        routePage: function() {
            var self = this;
            var pageType = self.get('pageType');
            var handlerQueue = self.handlerQueue;
            for (var i = 0; i < handlerQueue.length; i++) {
                handlerQueue[i]({ pageType: pageType }, self);
                self.set('isComposePageOnload', true);
            }
        },

        // 初始化上传附件
        initUploadComponent : function(){
        	//初始化上传模块 upload_module.js
            upload_module.init(this); 
            //创建上传管理器 
            upload_module.createUploadManager();
        },

        callApi: M139.RichMail.API.call,
        /**
         * 根据回复类型 获取邮件信息
         * @param applyType 回复类型
         */
        replyMessage : function(replyType, callback){
        	if(typeof replyType !== 'string'){
        		console.log('replyMessage:回复类型请传递字符串!');
        		return;
        	}
    		var data = {
    			toAll : replyType === this.pageTypes['REPLYALL'] ? "1" : "0",
    			mid : this.get('mid'),
    			withAttachments : $T.Url.queryString("withAttach") == "true"? "1" : "0"
    		}
    		this.callApi("mbox:replyMessage", data, function(res) {
    			if(callback){
    				callback(res);
    			}
	        });
        },
        /**
         * 根据转发类型 获取邮件信息
         * @param applyType 转发类型
         */
        forwardMessage : function(pageType, callback){
        	if(typeof pageType !== 'string'){
        		console.log('forwardMessage:转发类型请传递字符串!');
        		return;
        	}
    		var data = this.getRequestDataForForward(pageType);
    		this.callApi("mbox:forwardMessages", data, function(res) {
    			if(callback){
    				callback(res);
    			}
	        });
        },
        forwardAttachs: function (pageType, callback) {
            if (typeof pageType !== 'string') {
                console.log('forwardMessage:转发类型请传递字符串!');
                return;
            }
            var data = top.FORWARDATTACHS;
            top.FORWARDATTACHS = null;
            this.callApi("mbox:forwardAttachs", data, function (res) {
                if (callback) {
                    callback(res);
                }
            });
        },
        //恢复草稿
        restoreDraft : function(callback){
        	var data = {
    			mid : this.get('mid')
    		}
    		this.callApi("mbox:restoreDraft", data, function(res) {
    			if(callback){
    				callback(res);
    			}
	        });
        },
        //编辑发送中的邮件再次发送
        editMessage : function(callback){
        	var data = {
    			mid : this.get('mid')
    		}
    		this.callApi("mbox:editMessage", data, function(res) {
    			if(callback){
    				callback(res);
    			}
	        });
        },

        setSubMailInfo : function(content, subject){
        	this.autoSaveTimer['subMailInfo']['content'] = content;
        	this.autoSaveTimer['subMailInfo']['subject'] = subject;
        },
        //创建自动存草稿定时器 todo 全局变量
        createAutoSaveTimer : function(){
        	var self = this;
    		self.autoSaveTimer['timer'] = setInterval(function(){
    			var isEdited = self.compare(true);
    			if (!isEdited) {
		            return;
		        } else {
		            mainView.saveMailCallback.actionType = self.actionTypes['AUTOSAVE'];
    				self.sendOrSaveMail(self.actionTypes['AUTOSAVE'], mainView.saveMailCallback);
		        }
    		}, self.autoSaveTimer['interval'] * 1000);
       },
       // 比较是否有改动
       compare : function(isSetSubMailInfo){
       		var self = this;
       		var cloneSubMailInfo = $.extend({}, self.autoSaveTimer['subMailInfo']);
       		if(isSetSubMailInfo){
       			self.setSubMailInfo(htmlEditorView.getEditorContent(), $("#txtSubject").val());
       			content = self.autoSaveTimer['subMailInfo']['content'];
			    subject = self.autoSaveTimer['subMailInfo']['subject'];
       		}else{
       			content = htmlEditorView.getEditorContent();
				subject = $("#txtSubject").val();
       		}

			if (content === cloneSubMailInfo['content'] && subject == cloneSubMailInfo['subject']) {
				return false;// 无改动
			}else{
				return true;// 有改动
			}
       },
       // 判断当前写信页是否为空白写信页
       isBlankCompose : function(){
       		var self = this;
   			if(self.addrInputManager.getAllEmails().length > 0 || $("#txtSubject").val() || htmlEditorView.getEditorContent() != self.defaultContent){
   				return false;
       		}else{
       			return true;
       		}
       },
       /**
         * 发送/保存 /自动保存邮件 
         */
        sendOrSaveMail: function (action, callback){
        	if(typeof action !== 'string'){
        		console.log('sendOrSaveMail:请传递字符串action！'+ action);
        		return;
        	}
        	var self = this;
        	if(action === self.actionTypes['AUTOSAVE'] || action === self.actionTypes['SAVE']){
        		clearInterval(self.autoSaveTimer['timer']);
            	self.createAutoSaveTimer();
        	}
        	mainView.buildMailInfo(action, callback);
		},
		// 回复全部操作应排除自己
		filterEmails : function (){
		    var uidList = top.$User.getUidList();
		    var popList = top.$App.getPopList();
		    var myAddrList = uidList.concat(popList);
		    var dataSet = this.get('initDataSet');
		    if(dataSet.to){
		        for(var i = 0,toLen = dataSet.to.length;i < toLen;i++){
		            for(var j = 0,myLen = myAddrList.length;j < myLen;j++){
		                if($Email.compare(dataSet.to[i], myAddrList[j])){
		                    dataSet.to.splice(i, 1);
		                    i--;
		                    break;
		                }
		            }
		        }
		    }
		    if(dataSet.cc){
		        for(var m = 0;m < dataSet.cc.length;m++){
		            for(var n = 0;n < myAddrList.length;n++){
		                if($Email.compare(dataSet.cc[m], myAddrList[n])){
		                    dataSet.cc.splice(m, 1);
		                    m--;
		                    break;
		                }
		            }
		        }
		    }
		},
		/**
		 * 获取需要发送的数据
		 * @param action    continue:  继续编辑 
		 *					autosave:  自动保存
		 *					save :     存原稿并继续编辑
		 *					deliver：   立即发送邮件
		 */
		getRequestDataForSend : function(action){
			var returnInfo = 1;
			if(action === this.actionTypes['CONTINUE']){
				returnInfo = 0;
			}
			return {
				"attrs": this.mailInfo,
				"action": action,
				"replyNotify": $("#replyNotify")[0].checked ? 1 : 0,
				"returnInfo": returnInfo
			}
		},
		/**
		 * 获取需要发送的数据 todo 收件箱转发多封邮件
		 * @param pageType  FORWARD: 转发
		 *					FORWARDASATTACH: 作为附件转发 
		 */
		getRequestDataForForward : function(pageType){
			var self = this;
			var data = {};
			if(pageType === this.pageTypes['FORWARD']){
				data.mode = 'quote';
				data.ids = [self.get('mid')];
				data.mid = self.get('mid');
			}else if(pageType === this.pageTypes['FORWARDASATTACH'] || pageType === this.pageTypes['FORWARDMORE']){
				data.mode = 'attach';
				data.ids = self.get('ids');
			}else{
				console.log('不支持的参数值：'+pageType);
			}
    		return data;
		},
		/**
		 * 根据操作类型获取提示语
		 * @param action 
		 */
		getTipwords : function(action){
			if(action === this.actionTypes['AUTOSAVE']){
				return this.tipWords['AUTO_SAVE_SUC'];
			}else if(action === this.actionTypes['SAVE']){
				return this.tipWords['SAVE_SUC'];
			}else{
				return '';
			}
		},
        /**
         * 获取签名图片列表
         * 电子名片服务器不能访问,暂时替换,等后台更改了可删除
         */
        handlerSignImags: function() {
            var letterDoc = htmlEditorView.editorView.editor.editorWindow.document;
            if (!letterDoc) return;

            var src, arrSignImg = [], imgs = letterDoc.getElementsByTagName('IMG');
            for (var i = imgs.length - 1; i >= 0; i--) {
                if ( 'signImg' == imgs[i].getAttribute('rel') ) {
                    src = imgs[i].src;
                    if (0 > src.indexOf('attach:getAttach')) {
                        src = this.replaceSignImgsSrc(src);
                        arrSignImg.push($T.Xml.encode(src));
                        imgs[i].src = src;
                    }
                }
            }

            return arrSignImg;
        },

        //电子名片服务器不能访问,暂时替换,等后台更改了可删除
        RESRCIP: "172.16.172.171:2080",
        G2DOMAIN: "$1.api.localdomain",

        replaceSignImgsSrc : function(content){
            var _this = this;
            return content.replace(_this.regApp, _this.RESRCIP).replace(_this.regSrc, _this.RESRCIP).replace(_this.regG2, _this.G2DOMAIN);
        },
        getTop: function () {
            return M139.PageApplication.getTopAppWindow();
        },
        /**
        *获取SID值
        */
        getSid: function () {
            var sid = top.$T.Url.queryString("sid");
            return sid;
        },
		// 获取写信会话ID 只需要获取一次
        requestComposeId : function(callback){
        	var self = this;
			
			if(window.composeId){
				self.composeId = window.composeId;
			}			
			
        	if(self.composeId){
		        if(callback){
		        	callback();	
		        }
		    }else{
	        	this.callApi("mbox:getComposeId", null, function(res) {
		            if (res.responseData['code'] == 'S_OK') {
                        if(!self.composeId){
                        	self.composeId = res.responseData['var'];
                        }
                        if(callback){
	            			callback();
	            		}
		            }
		        });
	       }
        },
        getAttachUrl : function(fileId, fileName, fullUrl) {
        	var sid = this.getSid();
		    var url = "/RmWeb/view.do?func=attach:getAttach&sid="+sid+"&fileId="+fileId + "&fileName=" + encodeURIComponent(fileName);
		    if(fullUrl)url = "http://" + location.host + url;
		    return url;
		},
		// 主题颜色管理器
		subjectColorManager : {
		    maps: {
		        0: { color: "#000000", title: "黑色" },
		        1: { color: "#FF0000", title: "红色" },
		        2: { color: "#FF9800", title: "橙色" },
		        3: { color: "#339A67", title: "绿色" },
		        4: { color: "#2D5AE2", title: "蓝色" },
		        5: { color: "#7F0081", title: "紫色" }
		    },
		    getColorName: function (number) {
		        var maps = this.maps;
		        var item = maps[number];
		        if (!item) item = maps[0];
		        return item.title;
		    },
		    getColor: function (number) {
		        var maps = this.maps;
		        var item = maps[number];
		        if (!item) item = maps[0];
		        return item.color;
		    },
		    getColorList: function () {
		        var maps = this.maps;
		        var result = [];
		        var i = 0;
		        while (true) {
		            if (!maps[i]) break;
		            result.push(maps[i]);
		            i++;
		        }
		        return result;
		    }
		},
		// 投递/定时 邮件操作成功后将部分邮件信息保存到顶级窗口的sendList变量中
		modifySendList : function(result){
			var self = this;
            var mid = result.responseData["var"] && result.responseData["var"]["mid"];
            var tid = result.responseData["var"] && result.responseData["var"]["tid"];
            //跳转到发送完成页
            var topArray_To = new top.Array(); //页面被销毁的时候 数组对象不可用
            var topArray_CC = new top.Array();
            var topAttay_BCC = new top.Array();
            topArray_To = topArray_To.concat($T.Email.getMailListFromString(self.mailInfo.to));
            topArray_CC = topArray_CC.concat($T.Email.getMailListFromString(self.mailInfo.cc));
            topAttay_BCC = topAttay_BCC.concat($T.Email.getMailListFromString(self.mailInfo.bcc));
            var sendMailInfo = {
                to: topArray_To,
                cc: topArray_CC,
                bcc: topAttay_BCC,
                subject: self.mailInfo.subject,
                action: 'deliver',
                saveToSendBox: self.mailInfo.saveSentCopy,
                mid: mid,
                tid: tid
            };
            if (self.mailInfo.scheduleDate) sendMailInfo.action = "schedule"; //定时邮件的action rm 兼容 cm，发信成功页使用
            top.$App.getCurrentTab().data.sendList = new top.Array();
            top.$App.getCurrentTab().data.sendList.push(sendMailInfo);
		},
		// 根据用户选择的日期返回日期提示语
		getDateTipwords : function(calendar){
			var today = $Date.format('yyyy-MM-dd', new Date());// 今天
			var tomorrow = $Date.format('yyyy-MM-dd',$Date.getDateByDays(new Date(), 1)); // 明天
			var dayAfterTomorrow = $Date.format('yyyy-MM-dd',$Date.getDateByDays(new Date(), 2));// 后天
			var thisSunday = $Date.format('yyyy-MM-dd',$Date.getWeekDateByDays(6));// 本周日
			var nextSunday = $Date.format('yyyy-MM-dd',$Date.getWeekDateByDays(13));// 下周日
			var msg = '';
			if(calendar === today){
				msg = '今天';
			}else if(calendar === tomorrow){
				msg = '明天';
			}else if(calendar === dayAfterTomorrow){
				msg = '后天';
			}else if(calendar > dayAfterTomorrow && calendar <= thisSunday){
				msg = '本周' + this._getWeek(calendar);
			}else if(calendar > thisSunday && calendar <= nextSunday){
				msg = '下周' + this._getWeek(calendar);
			}else{
				msg = calendar;
			}
			return msg;
		},
		// 获取星期几
		_getWeek : function(calendar){
			var week = $Date.getChineseWeekDay($Date.parse(calendar.trim() + ' 00:00:00'));
			return week.substr(2,1); 
		},
		// 根据用户选择的时间返回时间提示语
		getTimeTipwords : function(time){
			var tempArr = time.split(':');
			var hour = parseInt(tempArr[0].trim(), 10);
			var now = new Date();
			var hello = $Date.getHelloString(new Date(now.setHours(hour)));
			var msg = '';
			if(hour <= 12){
				msg = hello + time;
			}else{
				msg = hello + (hour - 12) + ':' + tempArr[1];
			}
			return msg;
		},
		/**
		 * 根据服务端返回的JS代码解析出文件对象
		 * @param html 调用上传接口后服务端返回的js代码
		 * return 文件对象
		 */
		getReturnObj : function(html){
			if($.type(html) !== "string"){
				return null;
			}
			var returnObj = null;
	        var reg = /'var':([\s\S]+?)\};<\/script>/i;
	        if (html.indexOf("'code':'S_OK'") > 0) {
	        	returnObj = {};
	        	var m = html.match(reg);
	            var result = eval("(" + m[1] + ")");
	            returnObj.fileId = result.fileId;
	         	returnObj.fileName = result.fileName;
	        }
	        return returnObj;
		},
		// 地址输入框管理器
		addrInputManager : {
		    /**
		     * 向地址输入框实例插入邮件地址
		     * @param richInput  RichInput实例
		     * @param items 邮件地址列表 如果传入的是字符串则转成数组
		     * @return
		     */
		    addMail: function(richInput, items) {
		   		if(!(richInput instanceof M2012.UI.RichInput.View)){
		   			console.log('请传入RichInput实例对象');
		   			return;
		   		}
		        if ($.type(items) === "string") items = [items];
		        for (var i = 0,len = items.length; i < len; i++) {
		            richInput.insertItem(items[i]);
		        }
		    },
		    removeMail: function(richInput, list) {
		        if ($.type(list) === "string") list = [list];
		        var items = richInput.getItems();
		        for (var i = 0; i < items.length; i++) {
		            var richInputItem = items[i];
		            for (var j = 0; j < list.length; j++) {
		                if (richInputItem.allText == list[j]) {
		                    richInputItem.remove();
		                    break;
		                }
		            }
		        }
		    },
		    addMailToCurrentRichInput: function(addr) {
		        if (!addrInputView.currentRichInput){
		        	addrInputView.currentRichInput = addrInputView.toRichInput;
		        }
		        addrInputView.currentRichInput.insertItem(addr);
		        return addrInputView.currentRichInput;
		    },
		    getAllEmails: function() {
		        var a1 = addrInputView.toRichInput.getValidationItems();
		        var a2 = addrInputView.ccRichInput.getValidationItems();
		        var a3 = addrInputView.bccRichInput.getValidationItems();
		        return a1.concat(a2).concat(a3);
		    }
		},
		// 获取大附件下载地址
		mailFileSend : function(files, callback){
			var xmlStr = this.getXmlStr(files);
			var data = {
        		xmlStr : xmlStr
        	}
    		this.callApi("file:mailFileSend", data, function(res) {
    			if(callback){
    				callback(res);
    			}
	        });
		},
		// 获取大附件下载地址时需拼装xml格式的请求参数
		getXmlStr : function(files){
			var requestXml = '';
		    requestXml += "<![CDATA[";
		    requestXml += '<Request>';
		    var quickItems = [];
		    var netDiskXML = "";
		    for (var i = 0; i < files.length; i++) {
		        var file = files[i];
		        if (file.fileType == "netDisk") {
		        	var tempStr = "<File><FileID>{0}</FileID><FileName>{1}</FileName><FileGUID>{2}</FileGUID><FileSize>{3}</FileSize></File>";
		        	netDiskXML += $T.Utils.format(tempStr, [file.fileId, $T.Xml.encode(file.fileName), file.fileGUID, file.fileLength]);
		        } else {
		        	quickItems.push(file.uploadId || file.fileId)
		        }
		    }
		    if(quickItems.length > 0){
		    	requestXml += "<Fileid>" + quickItems.join(",") + "</Fileid>";
		    }
		    if(netDiskXML){
		    	requestXml += "<DiskFiles>" + netDiskXML + "</DiskFiles>";
		    }
		    requestXml += '</Request>';
		    requestXml += "]]>";
		    return requestXml;
		},
		//根据coremail的错误代码返回提示语句
		getErrorMessageByCode : function (action, code, data){
		    var actionList = {
		        "attach": {
		            "FA_ATTACH_EXCEED_LIMIT": "上传失败，附件大小超出限制",
		            "FA_UPLOAD_SIZE_EXCEEDED": "上传失败，附件大小超出限制"
		        },
		        "saveMail": {
		        	"FA_ATTACH_EXCEED_LIMIT":"发送失败，附件/信件大小超过邮箱限制",
		            "FA_OVERFLOW": "附件/信件大小超出邮箱限制,无法保存草稿"
		        },
		        "sendMail": {
		        	"FA_ATTACH_EXCEED_LIMIT":"发送失败，附件/信件大小超过邮箱限制",
		            "FA_OVERFLOW": "发送失败，附件/信件大小超过邮箱限制",
		            "FA_INVALID_ACCOUNT": "发送失败，FA_INVALID_ACCOUNT(发件人数据异常)",
		            "FA_INVALID_PARAMETER": "发送失败，FA_INVALID_PARAMETER(发件人数据异常)",
		            "FA_ID_NOT_FOUND":"请勿重复发送(邮件可能已发出，但由于网络问题服务器没有反馈，请到发件箱确认)",
		            "FA_WRONG_RECEIPT":"收件人地址格式不正确，请修改后重试",
		            "FS_UNKNOWN": "发送失败，请重新发送",
		            "FA_REDUNDANT_REQUEST":"邮件正在发送中，请稍候",
		            "FA_IS_SPAM":"您的邮件发送失败，原因可能是：<br>1、  你超出了单天发送邮件封数的限制。<br>2、  你发送的邮件包含广告内容等不良信息。"
		        }
		    };
		    if(action=="sendMail" && code=="FA_INVALID_ACCOUNT" && isThirdAccountSendMail()){
		        return "第三方账号发信失败，请确认账号密码以及POP服务器地址设置正确。<a hideFocus=\"1\" href=\"javascript:top.$App.show(\"account\")\">管理账号&gt;&gt;</a>";
		    }
		    if(actionList[action] && actionList[action][code]){
		        return actionList[action][code];
		    }
		    function isThirdAccountSendMail(){
		        if(data && data.account){
                    return !top.$App.isLocalDomainAccount(data.account)
		        }
		        return false;
		    }
		    return "";
		},
		//自适应   调整编辑器高度
		adjustEditorHeight : function(height){
			var c = $("#htmlEdiorContainer div.eidt-body");
			var h = c.height() + height;
			h = parseInt(h);
			if(h < self.editorMinHeight){
				h = self.editorMinHeight;
			}
			c.height(h);
		},
		//todo 匹配通讯录联系人
		getEamils : function(str){
		    //str = str.replace(/\"/g,'');
		    if(!str){
		    	return '';
		    }
		    var arr = str.split(",");
	        var emails = [];
	        for(var i = 0, len = arr.length; i < len; i++){
	            var email = arr[i];
	            var nextemail = arr[i+1];
	            if(email && nextemail){
	                var emailObj = top.Utils.parseSingleEmail(email);
	                if(!$T.Email.isEmailAddr(emailObj.all)){
	                    arr[i] = email + " " + nextemail;
	                    arr.splice(i + 1, 1);
	                    i--;
	                }
	            }
	        }
	        for(var j = 0, l = arr.length; j < l; j++){
	            emails.push(getNameByEmail(arr[j]));
	        }
	        return emails.join(',');
		    
		    // 根据邮箱地址获取发件人姓名（查询通讯录）
		    function getNameByEmail(text){
		    	if(!text) return;
		    	if(text.indexOf('<') == 0){
		    		text = text.replace(/</,'"<').replace(/></,'>"<');
		    	}
		    	//console.log(text);
			    var obj = $T.Utils.parseSingleEmail(text);
			    var prefix = obj.addr.split('@')[0];
			    var contact = top.Contacts.getSingleContactsByEmail(obj.addr);
			    if(contact){
			        var name = contact.name;
			        if(name == prefix || (contact.MobilePhone && contact.MobilePhone == name)){ //排除未完善联系人
			            return text;
			        }else{
			            return '"' + name.replace(/\"/g,'') + '"' + '<' + obj.addr + '>';
			        }
			    }else{
			        return text;
			    }
		    }
		},
		
		// 切换到当前写信页签
		active : function(){
			var self = this;
			var tabName = self.tabName;
			if(tabName && tabName.indexOf('compose') != -1){
				top.$App.activeTab(tabName);
			}
		},
		
		// 选择文件组件返回的文件列表统一数据结构
		transformFileList : function(fileList){
			if(!$.isArray(fileList)){
				return fileList;
			}
			var self = this;
			var files = [];
			for(var i = 0,len = fileList.length;i < len;i++){
				var file = fileList[i];
				files.push(self.getFileByComeFrom(file));
			}
			return files;
		},
        //在回复和转发时把fileSize改为base64后的值
		fixBase64FileSize: function () { //当回复和转发时，mbox:compose接收的attachments数组中的fileSize是base64后的值。
		    var attachs = this.composeAttachs;
		    if (attachs.length > 0) {
		        for (var i = 0; i < attachs.length; i++) {
		            if (attachs[i].base64Size) {
		                attachs[i].fileSize = attachs[i].base64Size;
		            }
		        }
		    }
		},
		
		// 根据文件来源返回调整数据结构后的文件对象，为了满足largeAttach.js中的方法 setNetLink的需求
		getFileByComeFrom : function(fileObj){
			var comeFrom = fileObj.comeFrom;
			var newfile = {};
			if(comeFrom == 'localFile'){
				newfile.fileId = fileObj.businessId;
				newfile.fileName = fileObj.name;
				newfile.filePath = fileObj.name;
				newfile.fileSize = fileObj.size;
				newfile.fileType = 'keepFolder';
				newfile.state = 'success';
			}else if(comeFrom == 'disk'){
				newfile.fileGUID = fileObj.filerefid;
				
				newfile.fileId = fileObj.id;
				newfile.fileName = fileObj.name;
				newfile.filePath = fileObj.name;
				newfile.fileSize = fileObj.file.fileSize;
				newfile.fileType = 'netDisk';
				newfile.state = 'success';
			}else if(comeFrom == 'cabinet'){
				newfile.fileId = fileObj.fid;
				newfile.fileName = fileObj.fileName;
				newfile.filePath = fileObj.fileName;
				newfile.fileSize = fileObj.fileSize;
				newfile.fileType = 'keepFolder';
				newfile.state = 'success';
			}else{
				console.log('不支持的文件来源！comeFrom:'+comeFrom);
			}
			return newfile;
		},
        /**
         *ie9以上支持客户端压缩报文
         */
		isSupportCompressRequest: function () {
		    if (window.FormData || ($B.is.ie && $B.getVersion() >= 9)) {
		        return true;
		    } else {
		        return false;
		    }
		},
        /**
         *加载压缩脚本的类库
         */
		loadCompressLib: function () {
		    var tag = "rawdeflateScript";
		    if (!document.getElementById(tag)) {
		        M139.core.utilCreateScriptTag({
		            id: tag,
		            src: "/m2012/js/richmail/compose/rawdeflate.js",
		            charset: "utf-8"
		        });
		    }
		}
    }));
})(jQuery,Backbone,_,M139);
﻿/**
* @fileOverview 写信视图层.
*@namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Compose.View.Main', superClass.extend(
        /**
        *@lends M2012.Compose.View.prototype
        */
    {
        el: "body",
        name : "compose",
        events: {
         
      
           
            
        },

        initialize: function (options) {
            this.model = options.model;
          
            //this.loadData();
            return superClass.prototype.initialize.apply(this, arguments);
        },
		
		
		/**
		 * 组装邮件信息 
		 */
		buildMailInfo : function(action, callback){
			if (this.model.composeId) {
	            this.model.mailInfo['id'] = this.model.composeId;
	        }
	        if (this.model.messageId) {
	            this.model.mailInfo['messageId'] = this.model.messageId;
	        }
	        if(this.model.draftId){
	        	this.model.mailInfo['mid'] = this.model.draftId;
	        }
			var txtSubject = $("#txtSubject");
			this.model.mailInfo['account'] = M139.Text.Html.decode(senderView.getSender());
			this.model.mailInfo['to'] = addrInputView.toRichInput.getValidationItems().join(',');
			this.model.mailInfo['cc'] = addrInputView.ccRichInput.getValidationItems().join(',');
			this.model.mailInfo['bcc'] = addrInputView.bccRichInput.getValidationItems().join(',');
			
			this.model.mailInfo['showOneRcpt'] = $("#aAllToOne").attr('showOneRcpt')?$("#aAllToOne").attr('showOneRcpt'):0;
			this.model.mailInfo['subject'] = txtSubject.val();
            
            // 设置签名图片地址, 电子名片服务器不能访问,暂时替换,等后台更改了可删除
            var remoteAttachment = this.model.handlerSignImags();

            var letterContent = htmlEditorView.getEditorContent();
            this.model.mailInfo['content'] = letterContent;

			this.model.mailInfo['priority'] = $("#chkUrgent")[0].checked ? 1 : 3;
			this.model.mailInfo['requestReadReceipt'] = $("#chkReceipt")[0].checked ? 1 : 0;
			this.model.mailInfo['saveSentCopy'] = $("#chkSaveToSentBox")[0].checked ? 1 : 0;
			this.model.mailInfo['inlineResources'] = 1;
			this.model.mailInfo['scheduleDate'] = timingView.getScheduleDate();
			this.model.mailInfo['normalizeRfc822'] = 0;

			if(remoteAttachment.length > 0){
				this.model.mailInfo['remoteAttachment'] = remoteAttachment;
			}else{
				delete this.model.mailInfo['remoteAttachment'];
			}
			this.model.fixBase64FileSize();//为了适应mbox:compose接口，在回复和转发时fileSize是base64后的值
			// 设置附件
			this.model.mailInfo['attachments'] = this.model.composeAttachs;

			//设置主题色值
			var headerValue = txtSubject.attr('headerValue');
	        if(txtSubject.attr('headerValue')){
	            this.model.mailInfo['headers'] = {
	                "X-RM-FontColor": headerValue
	            }
	        }else{
	        	delete this.model.mailInfo['headers'];
	        }
    		if (Arr_DiskAttach.length > 0 && action == this.model.actionTypes['DELIVER']) {
    			this.resolveLargeAttachs(action, callback);
		    }else{
		    	this.callComposeApi(action, callback);
		    }
		},
		// 将下载大附件的html代码添加到文件正文
		resolveLargeAttachs : function(action, callback){
			var self = this;
			// 调服务端接口获取大附件的下载地址
			self.model.mailFileSend(Arr_DiskAttach, function(result){
				if(result.responseData && result.responseData.code == 'S_OK'){
					var fileList = result.responseData['var']['fileList'];
    				var urlCount = 0;
    				for(var j = 0,len = fileList.length;j < len;j++){
    					var mailFile = fileList[j];
    					for (var i = 0,diskLen = Arr_DiskAttach.length;i < diskLen; i++) {
                            var diskFile = Arr_DiskAttach[i];
                            if ((mailFile.fileId === diskFile.fileId || mailFile.fileName == diskFile.fileName) && !diskFile.getIt) {
                                diskFile.getIt = true;
                                diskFile.downloadUrl = mailFile.url;
                                diskFile.exp = mailFile.exp;
                                urlCount++;
                                break;
                            }
                        }
    				}
	                if (urlCount == Arr_DiskAttach.length) {
	                	self.model.mailInfo['content'] += getDiskLinkHtml();
						debugger;
	                } else {
	                    console.log('获取大附件下载地址有误！！');
	                }
				}else{
					console.log('获取大附件下载地址失败！！');
				}
			});
		}

       
        
      
		
       
     
    
        
    }));
})(jQuery, _, M139);


﻿/**
 * @fileOverview 写信编辑器上方上传工具栏视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Compose.View.Upload', superClass.extend(
	/**
	 *@lends M2012.Compose.View.Upload.prototype
	 */
	{
		el : "#composeUploadBar",
		name : "composeUpload",
		events : {
			"click #attachmentSwitchIcon": "showUploadMenu"
		},
		initialize : function(options) {
			this.model = options.model;
			var uploadTip = $("#divUploadTip");
			if(uploadTip.length == 0){
				uploadTip = $('<span id="divUploadTip" class="msg msgWhite ta_l" style="display:none;"></span>')
					.css("z-index", 128).appendTo(document.body);
			}
			this.initEvents();
			this.initializeUploadMenuList();
			return superClass.prototype.initialize.apply(this, arguments);
		},

		// 渲染附件附件列表
		render: function(dataSet){
			if (dataSet && dataSet.attachments) {
				this.model.composeAttachs = dataSet.attachments.concat();
			}
			uploadManager.refresh();
		},
		initEvents : function(){
			var self = this;

			var uploadPicMenu = new M2012.UI.UploadImage.Menu.View({
				template: ['<div class="menuPop shadow picpop" style="z-index:999;width:' + (top.$App.isReadSessionMail() ? "80":"133") + 'px;display:none;">',
						'<a id="aLocalFile" class="LocalFile" href="javascript:;">本地图片</a>',
						'<a id="aInternetFile" class="InternetFile" href="javascript:;">网络图片</a>',
						// 验收环境或会话邮件隐藏此菜单项
						(location.href.indexOf("rd139cm") > 0 || top.$App.isReadSessionMail()) ? '' : '<a id="aMobilePic" href="javascript:;">从手机上传图片<i class="i_newsL"></i></a>',
						//'<a class="NetDiskFile" href="javascript:;">从彩云选取</a>',
					'</div>'].join(""),
				wrapper: document.getElementById("aInsertPic")
			}).render();
			uploadPicMenu.addLocalUploadMenuItem();
			uploadPicMenu.addInternetUploadMenuItem();
			uploadPicMenu.addMobileUploadMenuItem();

			/* 插入文档到编辑器 */

			/*虚拟进度条，实现太烂了..*/
			//new VirtualProgress({"step-duration": 3000}).addStep({progress:0.3, estimate:5000});

			var dlg;
			var progressElement;
			var startTime;
			var progressTimer, importFailTimer;
			var totalProgress;
			var randomTotalTime;
			var cancelInsert = false;
			var randRate;

			function initProgress(){
				startTime = +new Date();
				progressTimer = importFailTimer = null;
				totalProgress = 0;
				cancelInsert = false;
				randomTotalTime = (Math.random() * 20 + 40);	// 40s - 60s
				randRate = parseInt(Math.random() * 10 + 30);
			}

			// 上传，到30%
			function progress1(){
				var percent;
				//percent = parseInt((+new Date() - startTime)/randomTotalTime);

				totalProgress = parseInt((+new Date() - startTime)/randomTotalTime);
				if(totalProgress < 30) {
					percent = parseInt(Math.sqrt((200-totalProgress)*totalProgress)*0.6);
					//console.log(totalProgress, percent);
					progressElement.text(percent + "%");
					progressTimer = setTimeout(progress1, parseInt(Math.random() * 100 + 50));
				}
			}

			// 插入文档，预计5s到80%
			function progress2(){
				var percent;
				var p = (+new Date()-startTime)/5000;
				if(p < 1) {
					percent = randRate + parseInt((0.5 - Math.cos( p * Math.PI ) / 2)*40);
					//console.log(percent);
					progressElement.text(percent + "%");
					progressTimer = setTimeout(progress2, parseInt(Math.random() * 150 + 50));
				} else {
					//console.log("进入progress3");
					progressTimer = setTimeout(progress3, 300);
				}
			}

			function progress3() {
				randRate = parseInt(progressElement.text()) + parseInt(Math.random()*4);
				if(randRate < 97){
					progressElement.text(randRate + "%");
					progressTimer = setTimeout(progress3, 3000);
				}
			}

			element = document.getElementById("aInsertDoc");

			if(element) {
				wrapper = $('<div class="FloatingDiv"></div>');
				wrapper.css({
					position: "absolute",
					top:0,
					left:0,
					width: "72px",
					height: "20px",
					opacity: 0,
					overflow: "hidden",
					padding: "0px",
					"z-index": 1024
				}).appendTo($(element).css("position", "relative"));

				new M2012.Compose.View.UploadForm({
					wrapper: wrapper,
					uploadUrl: utool.getControlUploadUrl(true),
					accepts: ["doc", "docx", "xls", "xlsx", "txt"],
					onSelect: function(value, ext){
						if (_.indexOf(this.accepts, ext) == -1) {
							$Msg.alert("只允许插入" + this.accepts.join(", ") + "格式的文档", {icon:"warn"});
							return false;
						}

						(function(){
							var html = ['<div class="clearfix">',
								'<div style="text-align:center;padding:58px; padding-top:85px;">',
									'<img src="http://rescdn.qqmail.com/zh_CN/htmledition/images/ico_loading2104474.gif" style=""vertical-align: middle;>',
									'<span style="margin-left:10px;line-height: 32px;height: 32px;display: inline-block;zoom: 1;*display:block;">正在导入…<span class="docUploadPercent" style="display: inline;">0%</span></span>',
								'</div>',
							'</div>'].join("\r\n");

							dlg = top.$Msg.showHTML(html, {
								dialogTitle: "导入文档",
								width: 420,
								height: 220,
								buttons: [],
								onBeforeClose: function(){	// 手动关闭才会触发
									cancelInsert = true;
								},
								onClose: function(data) {
									clearTimeout(importFailTimer);
									clearTimeout(progressTimer);
								}
							});
							
							setTimeout(function(){
								progressElement = dlg.$el.find(".docUploadPercent");
								// progress.start();
								initProgress();
								importFailTimer = setTimeout(function(){
									top.M139.UI.TipMessage.show("导入文档失败", {delay:3000, className: "msgRed"});
									dlg.close();
								}, 60 * 1000);
								progress1();
							}, 0);
						})();

						return true;
					},
					onUploadFrameLoad: function (frame) {
						var model = self.model;

						try{
							var doc = frame.contentWindow.document;
							var responseText = doc.body.innerHTML || doc.documentElement.innerHTML;
							var returnObj = model.getReturnObj(responseText);

							if(!returnObj || !returnObj.fileId) {
								top.M139.UI.TipMessage.show("上传文件失败，请稍后再试", {delay:3000, className: "msgRed"});
								dlg.close();
								return ;
							}

							//console.log("进入progress2");
							//console.log(progressElement.text());
							clearTimeout(progressTimer);
							progress2();

							if(cancelInsert === false){
								self.getPreviewDoc(returnObj, function(html, code){
									clearTimeout(progressTimer);
									clearTimeout(importFailTimer);
									//console.log("OK, end at " + progressElement.text());
									if(html){
										progressElement.text("100%");
									}
									
									setTimeout(function(){
										var message = "";

										dlg.close();

										if(code == "4") {	// 文档加密
											message = "文档已加密，无法导入";
										} else if(html == ""){
											message = "导入文档失败";
										}
										if(html == "" || code == "4") {
											top.M139.UI.TipMessage.show(message, {delay:3000, className: "msgRed"});
											return ;
										}

										try{
											html = html.replace(/(<table.*?)(border="0")/ig, '$1border="1"');
											var div = document.createElement("div");
											div.innerHTML = html;
											var editor = htmlEditorView.editorView.editor;
											var styles = div.getElementsByTagName("style");
											var frag = document.createDocumentFragment();
											var editorBody = editor.editorDocument.body;
											var len = styles.length;
											while(styles[0]){	// believe what you see
												frag.appendChild(styles[0]);
											}
											if(len > 0){
												editorBody.insertBefore(frag, editorBody.firstChild);
											}
											html = div.innerHTML;
											if(!$B.is.ie && !$B.is.ie11){
												editor.execInsertHTML(html);
											} else {
												editor.splitOff();
												editor.insertHTML(html);
											}
											top.M139.UI.TipMessage.show("导入文档成功", {delay:3000});
										} catch(e) {
											top.M139.UI.TipMessage.show("导入文档失败", {delay:3000, className: "msgRed"});
										}
									}, 200);
								});
							}
						}catch(e){
							console.log(e.stack);
						}
					}
				}).render();

				$(element).on("click", function(){
					BH({key: "compose_import_doc"});
					self.hideUploadTip();
				}).mouseenter(function() {
					var options = {host: this, text: "将 word, excel, txt 文档导入到邮件正文"};
					self.showUploadTip(options);
				}).mouseleave(function() {
					self.hideUploadTip();
				});
			}

			/* 截屏上传 */

			$("#aScreenShot").on("click", function(){
				htmlEditorView.captureScreen();
			});

			$("#divUploadTip").on("mouseenter", function(e){
				clearTimeout(self.hideTimer);
			}).on("mouseleave", function(e){
				$(this).hide();
			});

			// 上传附件鼠标悬浮事件
			//if (!supportUploadType.isSupportFlashUpload && !window.conversationPage) {
			if(!window.conversationPage) {
				$("#floatDiv").mouseenter(function() {
					var options = {host: this, text: utool.getUploadTipMessage()};
					self.showUploadTip(options);
				}).mouseleave(function() {
					self.hideUploadTip();
				});
			}

			/* 超大附件和彩云网盘附件 */

			$("#aLargeAttach").click(function(event){
				self.showLargeAttachDialog();
				return false;
			}).mouseenter(function() {
				var options = {host: this, text: self.model.tipWords['UPLOAD_LARGEATTACH']};
				self.showUploadTip(options);
			}).mouseleave(function() {
				self.hideUploadTip();
			});
	        	$("#toAttachment").click(function(event){
        	    
	        	    //return false;
	        	});

			$("#caiyunDisk").click(function(event){
				if (top.$App.getCurrentTab().name.indexOf('compose_') > -1) {
					top.BH("compose_largeattach_disk");
				} else {
					top.BH('cMail_compose_uploadDisk');
				}
				
				self.showDiskDialog();
				top.$("li[tabid^='compose'] a").click(function(){
					if(top.dirid){
						top.dirid = "";
					}
				});
				return false;
			}).mouseenter(function(){
				var options = {host: this, text: "从彩云网盘选择文件发送"};
				self.showUploadTip(options); 
			}).mouseleave(function() {
				self.hideUploadTip();
			});

			$("#aMobilePic").click(function(e) {

				if(top.$App.isReadSessionMail()){
					return ;
				}

				if(window.mobileUploadTimer === undefined) {
					window.mobileUploadTimer = null;
				}

				$("#guideUpload").hide();

				var timeoutTimer = null;
				var dlg;
				var curFileId = "";
				var startTime;
				var html2 = ['<div class="mobileUpload clearfix">',
					'<img src="../images/201312/img_phone_02.jpg" class="mobileUpload-img2" />',
					'<p class="mobileUpload-introduction"></p>',
					'<span class="progressBarDiv">',
					'	<span class="progressBar"></span>',
					'	<span class="progressBarCur">',
					//'		<span style="width: 0%;-webkit-transition:width 2s ease;-moz-transition:width 2s ease;transition:width 2s ease;"></span>',
					'		<span style="width: 0%;"></span>',
					'	</span>',
					'</span>',
					'</div>'].join("\r\n");

				function showDlg() {

					var html = ['<div class="mobileUpload clearfix">',
						'<img src="../images/201312/img_phone_01.jpg" class="mobileUpload-img1" />',
						'<p class="mobileUpload-info">请查收短信，点击链接登录139邮箱，选择要上传的图片</p>',
						'<p class="mobileUpload-introduction">支持android、ios手机操作系统<a href="http://help.mail.10086.cn/statichtml/1/Content/3198.html" target="_blank">帮助</a></p>',
						'</div>'].join("\r\n");

					dlg = top.$Msg.showHTML(html, {
						dialogTitle: "从手机上传图片",
						width: 360,
						height: 235,
						buttons: [],
						onClose: function(data) {
							over();
						}
					});
				}

				function doInsert(file){
					over();
					self.insertImages([file.fileId]);
					upload_module.uploadedPics.push(file.fileName);
				}

				function detectAtInterval() {
					mobileUploadTimer = setTimeout(function(){
						refreshAttach2(function(file){
							//var newFileIds = _.pluck(uploadManager.fileList, "fileId");
							//var diffIds = _.difference(newFileIds, self.fileIds);

							//if(diffIds.length > 0){
							//	self.insertImages(diffIds);
							//}
							//detectAtInterval();

							if(file) {
								curFileId = file.fileId;

								//console.log(curFileId);
								if(file.status == 0) {		// 已上传完成
									if(!dlg.isClosed){	// note: undefined == false => false
										var bar = dlg.$el.find(".progressBarCur span");
										if(bar.length > 0){
											bar.stop(true, false).animate({"width": "100%"}, 1000, function(){
												doInsert(file);
											});
										} else {
											doInsert(file);
										}
									} else {
										self.insertImages([file.fileId]);
										// 记住，以防下次刷新再次插入正文
										upload_module.uploadedPics.push(file.fileName);
									}
								} else if(file.status == 1) {	// 上传中
									if(!dlg.progressing) {
										over();
										//setTimeout(function(){
										dlg = top.$Msg.showHTML(html2, {
											dialogTitle: "从手机上传图片",
											width: 360,
											height: 235,
											buttons: [],
											onClose: function(data) {
												var offset, offset2;
												var target = $("#attachContainer").find("li:last span:first");
												//var target = $("#attachContainer").find('[fileId="' + curFileId + '"]');
												//var target = $("#attachContainer").find('[fileId]');

												var dlgOutLine = $('<div style="position:absolute;display:none;z-index:9999;border:4px solid #666;background:transparent;"></div>').appendTo(top.document.body);

												offset = dlg.$el.offset();
												
												dlgOutLine.css({
													top: offset.top + "px",
													left: offset.left + "px",
													width: dlg.$el.width() + "px",
													height: dlg.$el.height() + "px"
												});

												// todo && curFileId
												if(curFileId && target.length > 0) {
													offset = target.offset();
													offset2 = top.$("[id^=compose]").offset();
													offset.top += offset2.top;
													offset.left += offset2.left;

													dlgOutLine.fadeIn(200).animate({
														top: offset.top + "px",
														left: offset.left - 10 + "px",
														width: target.width() + 80 + "px",
														height: "8px",
														opacity: 0.5
													}, 600, function(){
														$(this).fadeOut(function(){
															$(this).remove();
														});
													});
												}
												over();
											}
										});
										//}, 50);
										dlg.isClosed = false;
										dlg.progressing = true;
										startTime = +new Date();
									} else {
										// 计算进度
										//dlg.$el.find(".progressBarCur span").css("width", file.fileCurSize/file.fileRealSize * 100 + "%");
										//dlg.$el.find(".progressBarCur span").css("width", (100 - 300000 / (+new Date() - startTime)) + "%");
										dlg.$el.find(".progressBarCur span").stop(true, false).animate({"width": 100 - 100 / Math.sqrt((+new Date() - startTime)/1000) + "%"}, 3000);
									}
								}
							}

							detectAtInterval();
						});
					}, 3000);
				}

				//刷新附件iframe,可以取消普通上传
				function refreshAttach2(callback) {
					M139.RichMail.API.call("attach:refresh", {id : upload_module.model.composeId, type: 1}, function (result) {
						var i, j, len1, len2, found;
						var outFile, sfile, cfile, files, fileList;

						upload_module.model.composeAttachs = files = result.responseData["var"];
						fileList = uploadManager.fileList;

						for(i=0, len1=files.length; i<len1; i++){
							sfile = files[i];
							found = false;
							for(j=0, len2=fileList.length; j<len2; j++){
								cfile = fileList[j];
								if(cfile.fileId == sfile.fileId){
									//found = true;
									cfile.insertImage = sfile.insertImage;
									cfile.replaceImage = sfile.replaceImage;  //后台返回的附件数据没有replaceImage值，在这里加上，不然会显示内联附件列表
								}
							}
							for(j=0,len2=upload_module.uploadedPics.length; j<len2; j++){
								if(upload_module.uploadedPics[j] == sfile.fileName){
									found = true;
								}
							}
							if(found === false && /\.(?:gif|bmp|jpe?g|png|ico|tiff)$/.test(sfile.fileName)) {
								// todo 坑爹，fileList每次刷新都是重新构建的，无法寄存状态
								// 这个必须仅在第一次出现的时候标记一次，不然每刷新列表一次都会插入正文。
								if(sfile.clientType == 2) {	// 从酷版上传
									outFile = sfile;
								}
								//console.log("found new file: "+outFile);
							}
						}
						uploadManager.refresh(function(){
							callback(outFile);
						});
					});
				}
				//window.refreshAttach2 = refreshAttach2;

				upload_module.uploadedPics = [];
				for(var i=0; i<upload_module.model.composeAttachs.length; i++) {
					upload_module.uploadedPics.push(upload_module.model.composeAttachs[i].fileName);
				}

				function over() {
					console.log("dlg, timeout is over !!!");
					dlg.remove();
					dlg.isClosed = true;
					// todo 不清除了，内存泄漏？
					//clearTimeout(mobileUploadTimer);
					clearTimeout(timeoutTimer);
				}

				// 超时失败提示
				timeoutTimer = setTimeout(function() {
					var html;

					// todo 如果正在显示上传进度对话框，则直接返回
					if(dlg.isClosed !== true && !dlg.progressing) {
						html = ['<dl class="norTipsContent">',
							'<dt class="norTipsLine">未检测到上传成功的手机图片，已取消此操作。</dt>',
							'<dd class="norTipsLine gray">手机短信将无法进行图片上传，点击短信连接将登陆139酷版邮箱。</dd>',
						'</dl>'].join("\r\n");

						over();

						top.$Msg.confirm(html, {
							isHtml: true,
							icon: "i_warn",

							buttons: ["关闭"],
							dialogTitle: "从手机上传图片"
						});
					}
				}, 60 * 10 * 1000);

				showDlg();

				upload_module.model.requestComposeId();

				self.sendSysSms(function(data){
					if(data.code === "S_OK") {
						if(mobileUploadTimer){
							clearTimeout(mobileUploadTimer);
						}
						detectAtInterval();	// 发送成功，开始检测上传
					} else if(data.code === "WAPSEND_LIMIT"){
						over();
						top.$Msg.confirm("操作过于频繁，请稍后再试。", {
							icon: "i_warn",
							buttons: ["确定"],
							dialogTitle: "从手机上传图片"
						});
						clearTimeout(timeoutTimer);
					} else {
						over();
						top.$Msg.alert("网络异常，请稍后再试");
						clearTimeout(timeoutTimer);
					}
				});

				BH({key: "compose_mobile_upload_pic"});

				self.fileIds = _.pluck(uploadManager.fileList, "fileId");
			});


			top.$App.off('obtainCabinetFiles');
			top.$App.on('obtainCabinetFiles', function(files){
				var fileObjs = self.model.transformFileList(files);
				setNetLink(fileObjs);
				top.selectFileDialog3 && top.selectFileDialog3.close();
			});
		},

		sendSysSms: function(callback) {

			var url = "/mw2/sms/sms?func=sms:sendSysSms&sid=" + top.$App.getSid() + "&rnd=" + Math.random();
			var cnum = (top.$User.getAliasName("mobile") + "/" + top.$User.getAliasName("common")).replace(/@[^\/]*/g, "");
			//var url = "sms:sendSysSms";
			var postData = ['<object>',
				'<int name="type">1</int>',
				'<int name="attr">',
				[htmlEditorView.model.composeId, top.$App.getSid(), (new Date).getTime()].join("/"),
				"," + cnum,
				'</int>',
				'</object>'].join('');

			M139.RichMail.API.call(url, postData, function (result) {
				callback(result.responseData || {});
			});
		},

		insertImages: function(fileIds) {
			setTimeout(function(){
				top.WaitPannel.hide();
			}, 3000);

			BH({key: "compose_mobile_insert_pic"});

			if(!fileIds || fileIds.length === 0) {
				top.WaitPannel.show("未获取到图片，请稍后再试^^", {className: "msgRed"});
			} else {
				//console.log(fileIds);
				_.each(fileIds, function(fileId) {
					var file = utool.getFileById(fileId);
					var previewUrl = decodeURIComponent(file.getDownloadUrl());
					console.log("insert: " + previewUrl);
					htmlEditorView.editorView.editor.insertImage(previewUrl);
				});
				top.WaitPannel.show("上传成功");
			}
		},

		getPreviewDoc: function(info, callback){
			var account, info, url, downloadUrl;

			account = (top.$User.getAliasName("mobile")).replace(/@[^\/]*/g, "");
			url = "/mw2/opes/addOfficeToEmail.do?sid=" + top.sid + "&cguid=" + $TextUtils.getCGUID();
			downloadUrl = "http://"+location.host + this.model.getAttachUrl(info.fileId, info.fileName, false);

			var postData = {
				account: account,
				composeId: this.model.composeId,
				fileid: info.fileId,
				filename: encodeURIComponent(info.fileName),
				filedownurl: downloadUrl,
				fileSize: info.fileSize | 0,
				sid: top.sid,
				comefrom: "email",
				browsetype: 1,	// 文件转换方式, 1为html
				longHTTP: true
			};
			M139.RichMail.API.call(url, postData, function(result){
				var data = null,
					html = "";

				if(result) {
					data = result.responseData;
				}

				if(data && data.resultCode == "S_OK") {
					pages = data.fileContent;
					for(var i=0, len=pages.length; i < len; i++){
						page = pages[i];
						html += "<h3>" + page.fileName + "</h3>";
						html += page.content + "<br />";
					}
				}
				callback(html, data.code);
			});
		},

		// 选择彩云网盘弹出层
		showDiskDialog : function(){
			var self = this;

			if (top.selectFileDialog2) {
				top.selectFileDialog2.cancelMiniSize();
				return;
			}

			var selectFileDialog2 = top.selectFileDialog2 = top.$Msg.open({
				dialogTitle: "从彩云网盘选择",
				url: "selectfile/disk_write.html?sid=" + top.sid,
				width: 520,
				height: 468
			//  showMiniSize: true
			});


			selectFileDialog2.on("remove", function () {
				top.selectFileDialog2 = null;
			});

			top.$App.on('obtainSelectedFiles', function(files){ // 从选择文件弹窗获取用户选择的文件（本地文件，暂存柜，彩云）
				var fileObjs = self.model.transformFileList(files);
				//console.log(JSON.stringify(fileObjs));
				setNetLink(fileObjs);
				selectFileDialog2.close();
			});
			selectFileDialog2.on('remove', function(){
				top.$App.off('obtainSelectedFiles');
			});
		},
		showAttachmentDialog : function(){
		    var self = this;
		    self.model.requestComposeId();
			var selectFileDialog4 = top.selectFileDialog4 = top.$Msg.open({
			    dialogTitle: "从附件夹中选择",
			    url: "selectfile/attachment_write.html?sid=" +top.sid + "&"+"composeId="+self.model["composeId"],
			    width: 520,
			    height: 415
			//    showMiniSize: true
			});
			selectFileDialog4.on("remove", function () {
			    top.selectFileDialog4 = null;
			});

            top.$App.on('obtainAttachFiles', function(list){ 
                //var fileObjs = self.model.transformFileList(files);
                //console.log(JSON.stringify(fileObjs));
            	//setNetLink(fileObjs);
		        var newList = uploadManager.fileList ||[];
            	//for(var i = 0,len = files.length ; i<len ; i++){
	            	//uploadManager.fileList.push('UploadFileItem':files[i])
            	//}
			    for (var i = 0; i < list.length; i++) {
			        var fileInfo = list[i];
			        var file = new UploadFileItem({
			            type: "Common",
			            fileName: fileInfo.fileName || fileInfo.name,
			            fileId: fileInfo.id || fileInfo.fileId,
			            fileSize: fileInfo.fileSize || fileInfo.size || 0,
			            insertImage: fileInfo.insertImage,
			            replaceImage: fileInfo.replaceImage,
			            isComplete: true
			        });
			        newList.push(file);
					self.model.composeAttachs.push({
	                        fileId: fileInfo.id || fileInfo.fileId,
				            fileName: fileInfo.fileName || fileInfo.name,
				            fileSize: fileInfo.fileSize || fileInfo.size || 0,
							insertImage: fileInfo.insertImage,
							replaceImage: fileInfo.replaceImage
	                    });
			    }
			    //刷界面
			    //this.render({ type: "refresh" });




				uploadManager.render({ type: "add" })

            	selectFileDialog4.close();
            });
            selectFileDialog4.on('remove', function(){
            	top.$App.off('obtainAttachFiles');
            });
		},
        showLargeAttachDialog : function(){
            var self = this;
            BH({key : "compose_largeattach"});
            if(top.SiteConfig.isQuicklyShare){
				M139.RichMail.API.call("disk:init", null, function(res) {
					if(!res || !res.responseData) return ;
					res = res.responseData;
					if(res.code == "S_OK"){
						top.isMcloud = (res["var"].isMcloud != "0");
					}
				});
				self.selectFile();
			}else{
				self.createLargeAttachComponet();
			}
		},

		// 创建上传大附件组件
		createLargeAttachComponet : function(){
			var self = this;
			new M2012.UI.LargeAttach.Model().requireUpload({},function(view){
				self.uploadDialog = view;
				//选文件后的回调
				view.on("select", function (e) {
					//console.log(e);
					//e.files是文件列表, e.autoSend是指用户点击了，上传完自动发信
					if(e && e.files){
						BH({key : "compose_largeattachsuc"});
						
						var files = e.files;
						setNetLink(files);
						// 上传完成后自动发送邮件
						if(e.autoSend){
							mainView.toSendMail();
						}
					}
				});
			});
		},

		initializeUploadMenuList: function(){
			var self = this;
			self.uploadMenuList = [{
                text:"从邮件附件中选择",
                onClick:function(){
                    self.showAttachmentDialog();
                }
			},{
                text:"从网盘中选择",
                onClick:function(){
                    self.showDiskDialog();
                }
		        }];
		},

		showUploadMenu : function(){
			//BH({key : ""});
			
			var self = this;
			self.uploadMenu = M2012.UI.PopMenu.create({
				dockElement : $("#attachmentSwitchIcon")[0],
	            width : 130,
	            items : self.uploadMenuList,
	            dx: -77,
	            dy: 3,
	            onItemClick : function(item){
	                //alert("子项点击");
	            }
	        });
		},
		// 选择文件弹出层
		selectFile : function(){
			var self = this;

			if (window.selectFileDialog) {
				window.selectFileDialog.cancelMiniSize();
				return;
			}

			var selectFileDialog = window.selectFileDialog = top.$Msg.open({
				dialogTitle: "添加超大附件",
				url: "selectfile/largeAttach.html?sid=" + top.sid,
				width: 520,
				height: 401,
				showMiniSize: true
			});
			top.selectFileDialog001 = selectFileDialog;
			setTimeout(function(){
				window.selectFileDialog.setMiddle();
			},500);
			if (!M2012.UI.Widget.LargeAttachUploadTips) {
				M139.core.utilCreateScriptTag({
					id: "m2012.ui.widget.largeattachuploadtips",
					src: "/m2012/js/ui/widget/m2012.ui.widget.largeattachuploadtips.js",
					charset: "utf-8"
				});
			}

			selectFileDialog.on("minisize", function () {
				//最小化动画
				var offset = this.$el.offset();
				var obj = {
					top: offset.top,
					left: offset.left,
					height: this.$el.height(),
					width: this.$el.width()
				};
				var div = $('<div style="border:3px silver solid;position:absolute;z-index:9999"></div>').css(obj);
				div.appendTo(document.body).animate({
					left: $(document.body).width() - 200,
					top: $(document.body).height() - 200,
					height: 100,
					width: 100
				}, 300, function () {
					div.remove();
					var ball = new M2012.UI.Widget.LargeAttachUploadTips({
						dialog: selectFileDialog
					});
					ball.render();
				});

				top.BH("compose_largeattach_minisize");
			});

			selectFileDialog.on("remove", function () {
				window.selectFileDialog = null;
			});

			selectFileDialog.on("close", function (args) {
				//console.log($(this.el).html());
				var win = $(this.el).find("iframe")[0].contentWindow;
				var uploadModel = win.selectFileView.UploadApp.model;
				var isUploading = uploadModel.isUploading();

				if (isUploading) {
					if (window.confirm(win.selectFileView.model.tipWords["UPLOADING"])) {
						args.cancle = false;
					} else {
						removeFlash();
						args.cancel = true;
					}
				} else {
					removeFlash();
					args.cancel = false;
				}

				function removeFlash(){
					$("object", win.document).remove();
				}
			});
			top.$App.on('rebuildSelectFileDialog', function(obj){ // 选择文件弹窗根据页面内容调整高度
				selectFileDialog.jContainer.find('iframe').css(obj);
			});
			top.$App.on('obtainSelectedFiles', function(files){ // 从选择文件弹窗获取用户选择的文件（本地文件，暂存柜，彩云）
				var fileObjs = self.model.transformFileList(files);
				//console.log(JSON.stringify(fileObjs));
				setNetLink(fileObjs);
				if(top.autoSendMail){
					top.mainView.toSendMail();
				}
				top.autoSendMail = false;
				selectFileDialog.close();
			});
			selectFileDialog.on('remove', function(){
				top.$App.off('rebuildSelectFileDialog');
				top.$App.off('obtainSelectedFiles');
			});
		},
		/*
		 * 显示上传附件鼠标悬浮提示语
		 * @param options {host : document.getElementById("realUploadButton"), text : '添加小于50M的附件，可使用 Ctrl+V 粘贴附件和图片'}
		 */
		showUploadTip : function(options){
			if(!options){
				options = {host: $("#realUploadButton")[0], text: utool.getUploadTipMessage()};
			}
			if(window.conversationPage){return;}
			clearTimeout(this.hideTimer);
			var uploadTip = $("#divUploadTip").html(options.text);
			M139.Dom.dockElement(options.host, uploadTip[0]);
			uploadTip.show();
		},

		hideUploadTip : function(){
			var uploadTip = $("#divUploadTip");
			clearTimeout(this.hideTimer);
			this.hideTimer = setTimeout(function(){
				uploadTip.hide();
			}, 200);
		}
	}));
})(jQuery, _, M139);

﻿/**
* @fileOverview 写信附件列表视图层.
* @namespace 
*/
(function (jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Compose.View.HtmlEditor', superClass.extend(
		/**
		*@lends M2012.Compose.View.HtmlEditor.prototype
		*/
	{
		el: "body",
		name : "htmlEditor",
		events: {
		},
		initialize: function (options) {
			this.model = options.model;
			var self = this;
			var editor;
			this.editorView = M2012.UI.HTMLEditor.create({
				contaier:$("#htmlEdiorContainer"),
				blankUrl:"../html/editor_blank.htm?sid="+top.sid,
				isShowSetDefaultFont:true
			});

			editor = this.editorView.editor;

			this.editorView.on("buttonclick", function(e){
				switch (e.command ) {
					case "Voice":
						if (!self.EditorVoiceInstance) {
							self.EditorVoiceInstance=VoiceInput.create({
								autoCreate: true,
								button: $(e.target),
								from: "editor",
								onComplete: function (text) {
									editor.insertHTML(text);
									setTimeout(function () {
										editor.editorWindow.focus();
									}, 200);
								}
							});
							
						} else {
							self.EditorVoiceInstance.render();
						}
						break;
				}
			});

			editor.on("before_send_mail", function(e){
				var insertedMarks = $(editor.editorDocument).find(".inserted_Mark");
				insertedMarks.hide();
			});

			editor.on("mousedown", function (e) {
				if($B.is.ie){
					var ele = e.target;
					self.ieImgel = null;
					self.ieTableEl = null;
					if(ele.tagName == 'IMG'){
						self.ieImgel = $(ele);
					}else if(ele.tagName == 'TABLE'){
						self.ieTableEl = $(ele);
					}
				}
				if(e.button == 2){ //右键
					self.isRight = true;
				}else{
					self.isRight = false;
				}
			});
			
			editor.on("paste", function (e) {
				if(self.isRight){
					paste(e); //右键粘贴
				}
			});

			editor.on("keydown", function (e) {
				if (e.ctrlKey && e.keyCode == M139.Event.KEYCODE.V) {
					paste(e);
				}else if(e.ctrlKey && e.keyCode == M139.Event.KEYCODE.ENTER){
					$("#topSend").click();
				}else if(e.keyCode == M139.Event.KEYCODE.BACKSPACE){ //ie浏览器选中图片时，按退格会退出到登录页，但实际是想删除图片
					if(self.ieImgel){
						self.ieImgel.remove();
						self.ieImgel = null;
						return false;
					}
					if(self.ieTableEl){
						self.ieTableEl.remove();
						self.ieTableEl = null;
						return false;
					}
				}
			});

			function paste(e) {
				editor.markFont();
				try {
					e.returnValue = window.captureClipboard();
					if(e.returnValue === false){
						top.$Event.stopEvent(e);
					}

					setTimeout(function(){
						editor.resetTextSizeForIe();
					}, 50);
				} catch (e) {
					var content = self.getEditorContent() || '';
					setTimeout(function(){
						var newContent = self.getEditorContent() || '';
						if(content == newContent && $B.is.windows && window.navigator.platform != "Win64"){
							M139.Plugin.ScreenControl.isScreenControlSetup(true);
						}
						editor.resetTextSizeForIe();
					},50);
				}
			}

			return superClass.prototype.initialize.apply(this, arguments);
		},
		// 渲染编辑器 
		render : function(pageType, dataSet){
			var self = this;
			var editor = self.editorView.editor;
			// 编辑器空白iframe添加tabindex属性
			editor.frame.tabIndex = 5;
			$(window).resize(function(){
				self._initEditorHeight();
				self._initRightContactHeight();
				$("#divLetterPaper").is(":visible") && mainView.showPaperFrame();
			});

			// 自适应 初始化编辑器高度
			self._initEditorHeight();
			self._initRightContactHeight();

			// todo 该判断是否可移到组件内部？
			if(editor.isReady){
				renderEditor(pageType, dataSet);
			}else{
				editor.on("ready", function(e){
					renderEditor(pageType, dataSet);
				});
			}
			function renderEditor(pageType, dataSet){
				if (dataSet.content || dataSet.html || dataSet.text) {
					var htmlContent = dataSet.content || (dataSet.html && dataSet.html.content) || (dataSet.text && dataSet.text.content);
					if (Number(dataSet.isHtml) == 0) {
						htmlContent = top.$T.Utils.htmlEncode(htmlContent).replace(/\r?\n/g, "<br />");
					}
					if (pageType == "reply" || pageType == "replyAll" || pageType == "forward") {
						htmlContent = htmlContent;
					}
					if (pageType == "compose" || pageType == "draft" || pageType == "resend") {
						self.setEditorContent(htmlContent);
					} else {
						editor.addReplyContent(htmlContent);
					}
				}else{ //会话邮件回复切换到写信
					var htmlContent = top.$App.getSessionDataContent();
					self.setEditorContent(htmlContent);
				}

				// 加载指定信纸
				if(dataSet.letterPaperId){
					mainView.showPaperFrame();
					var readyStr = "$('#frmLetterPaper')[0].contentWindow && $('#frmLetterPaper')[0].contentWindow.letterPaperView";
					M139.Timing.waitForReady(readyStr, function(){
						$('#frmLetterPaper')[0].contentWindow.letterPaperView.setPaper('', null, dataSet.letterPaperId);
					});
				}

				if(dataSet.template){
					//根据邮件模板设置邮件正文
					(function setContentByTemplate(template, content){
						var url = "/m2012/js/compose/template/" + template + ".js";
						M139.core.utilCreateScriptTag(
							{
								id: template,
								src: url,
								charset: "utf-8"
							},
							function () {
								var templateHtml = top.$App.composeTemplate;
								content = $T.format(templateHtml, {content: content || ""});
								self.setEditorContent(content);
							}
						);
					})(dataSet.template, dataSet.content);
				}
				// 加载签名
				self._loadSign(pageType);
				if(pageType == 'uploadLargeAttach'){
					$("#aLargeAttach").click();
				}
				if(pageType != self.model.pageTypes.VCARD && pageType != self.model.pageTypes.CUSTOM) {
					editor.setDefaultFont(top.$User.getDefaultFont());
				}
				self.model.autoSaveTimer['subMailInfo']['content'] = self.getEditorContent();
				self.model.defaultContent = self.getEditorContent();

				//使编辑区也支持拖放文件
				var editorBody = editor.editorDocument.body;
				if(editorBody.addEventListener) {
					editorBody.addEventListener("dragenter", _dragenter, false);
					editorBody.addEventListener("dragover", _dragover, false);
					editorBody.addEventListener("drop", _drop, false);
				}
				// 显示图片小工具
				top.$App.showImgEditor($(editorBody));
			}
		},

		_getEditorBody:function(){
			if (!this.divEdBody) {
				this.divEdBody = $("#htmlEdiorContainer div.eidt-body");
			}
			return this.divEdBody;
		},

		// 自适应 初始化编辑器高度
		_initEditorHeight : function(){
			var self = this;
			var composeIframe = window.frameElement;
			var extraHeight = 59 + 26 + 10;		// 底部按钮栏高度 + 编辑工具栏高度 + 空白误差
			if ($("#moreOptions").is(":visible")) {
				extraHeight += 28;
			}
			var divEdBody = this._getEditorBody();
			var height = parseInt(composeIframe.style.height) - divEdBody.offset().top - extraHeight;
			if(height < self.model.editorMinHeight){
				height = self.model.editorMinHeight;
			}
			divEdBody.height(height);
		},

		//右侧通讯录与写信页齐高
		_initRightContactHeight: function () {
			var divAddr = $("#divAddressList");
			// 使用了fix定位，必须通过iframe高度来计算
			var composeIframe = window.frameElement;
			var mainHeight = $(composeIframe).height();
			var height = mainHeight - 144 - 35;
			var groupList = divAddr.find('.GroupList');
  
			if (groupList.height() != height) {
				groupList.height(height);
				divAddr.find('.searchEnd').height(height);	// 搜索结果列表
			}
		},

		// 加载签名
		_loadSign : function(pageType){
			var self = this;
			var signTypes = "|compose|uploadLargeAttach|reply|replyAll|forward|forwardAsAttach|forwardAttachs|forwardMore";
			if (signTypes.indexOf('|'+pageType+'|') >= 0) {
				self._setDefaultSign();
			}
		},

		// 设置默认签名
		_setDefaultSign : function(){
			var self = this;
			var signList = top.$App.getSignList();
			for (var i = 0,len = signList.length; i < len; i++) {
				var signItem = signList[i];
				if (signItem.isDefault) {
					if(signItem.type == 1){ //我的电子名片签名需获取最新的用户信息
						self.createVcardSign(3, signItem.id, signItem.isDefault,signItem.isAutoDate);
					}else{
						self.editorView.editor.setSign(M139.Text.Html.decode(signItem.content));
					}
					break;
				}
			}
		},
		//生成我的电子名片签名
		createVcardSign : function(opType,id,isDefault,isAutoDate){
			var self = this;
			//top.M139.UI.TipMessage.show('正在获取电子名片信息');
			M2012.Contacts.getModel().getUserInfo({}, function(result){
				var userInfo = {};
				if(result.code === 'S_OK'){
					userInfo = result['var'];
				}else{
					console.log("M2012.Contacts.getModel().getUserInfo 获取用户信息失败！result.code:"+result.code);
					top.M139.UI.TipMessage.hide();
					/*
					userInfo = {
						name : 'helloworld',
						FavoWord : '自强不息，奋斗不止！',
						UserJob : 'web前端开发',
						CPName : '彩讯科技',
						CPAddress : '长虹大厦',
						FamilyEmail : 'tkh@139.com',
						MobilePhone : '1500000000',
						OtherPhone : '1510000000',
						BusinessFax : '458788',
						CPZipCode : '1546'
					};*/
				}
				//top.M139.UI.TipMessage.show('正在生成电子名片');
				var items = ['user:signatures']; //添加电子签名
				items[1]  = {
					'opType'	 : opType, //opType，1:增加，2:删除，3:修改
					'id'		 : id,
					'title'	  : '我的电子名片',//签名名称
					'content'	: self._getVcardContent(userInfo,isAutoDate),//签名内容 
					'isHtml'	 : 1,//是否是HTML格式
					'isDefault'  : isDefault,//是否是默认签名档
					'isAutoDate' : 0,//1：自动加入 0：不加入默认为0，不自动加入写信日期
					'isSMTP'	 : 0,//是否在smtp信件中追加签名   1:是 0:否默认为0，不在smtp中追加签名
					'type'	   : 1 //签名的类型，0：用户自定义的签名   1: 我的电子名片签名(通讯录)
				};
				items[2] = 'user:getSignatures';
				items[3] = null;
				self.editorView.editor.setSign(items[1].content);
				//top.M139.UI.TipMessage.hide();
				
				self.model.autoSaveTimer['subMailInfo']['content'] = self.getEditorContent();
				self.model.defaultContent = self.getEditorContent();
			});
		},
		//我的电子名片签名内容
		_getVcardContent : function(userInfo,isAutoDate){
			var imgSrc = this._getContactImage(userInfo.ImageUrl);
			var encode = M139.Text.Html.encode;
			var contentArr = [
				'<table border="0" style="width:auto;font-family:\'宋体\';font-size:12px;border:1px solid #b5cbdd;-webkit-border-radius:5px;line-height:21px;background-color:#f8fcff;flaot:left;">',
				'<tbody>',
				'<tr>'
			];
			contentArr.push('<td style="vertical-align:top;padding:5px;"><img rel="signImg" width="96" height="96" src="'+imgSrc+'"></td>');
			contentArr.push('<td style="padding:5px;">');
			contentArr.push('<table style="font-size:12px;line-height:19px;table-layout:auto;">');
			contentArr.push('<tbody>');
			if(userInfo.AddrFirstName) contentArr.push('<tr><td colspan="2"><strong id="dzmp_unm" style="font-size:14px;">'+encode(userInfo.AddrFirstName)+'</strong></td></tr>');
			if(userInfo.FavoWord) contentArr.push('<tr><td colspan="2" style="padding-bottom:5px;">'+encode(userInfo.FavoWord)+'</td></tr>');
			if(userInfo.UserJob) contentArr.push('<tr><td>职务：</td><td>'+encode(userInfo.UserJob)+'</td></tr>');
			if(userInfo.CPName) contentArr.push('<tr><td >公司：</td><td>'+encode(userInfo.CPName)+'</td></tr>');
			if(userInfo.CPAddress) contentArr.push('<tr><td >地址：</td><td>'+encode(userInfo.CPAddress)+'</td></tr>');
			if(userInfo.FamilyEmail) contentArr.push('<tr><td >邮箱：</td><td>'+encode(userInfo.FamilyEmail)+'</td></tr>');
			if(userInfo.MobilePhone) contentArr.push('<tr><td >手机：</td><td>'+encode(userInfo.MobilePhone)+'</td></tr>');
			if(userInfo.OtherPhone) contentArr.push('<tr><td >电话：</td><td>'+encode(userInfo.OtherPhone)+'</td></tr>');
			if(userInfo.BusinessFax) contentArr.push('<tr><td >传真：</td><td>'+encode(userInfo.BusinessFax)+'</td></tr>');
			if(userInfo.CPZipCode) contentArr.push('<tr><td >邮编：</td><td>'+encode(userInfo.CPZipCode)+'</td></tr>');
			if(isAutoDate) contentArr.push('<tr><td >日期：</td><td>'+$Date.format("yyyy年MM月dd日 星期w",new Date())+'</td></tr>');
			contentArr.push('</tbody></table></td></tr></tbody></table>');
			return contentArr.join('');
		},
		//获取联系人头像地址
		_getContactImage : function(imgurl){
			var imgUrlLowerCase, result;
			var sysImgPath = this.model.sysImgPath;

			result = "/m2012/images/global/face.png";
			if(imgurl) {
				imgUrlLowerCase = imgurl.toLowerCase();
				if(imgUrlLowerCase != sysImgPath[0] && imgUrlLowerCase != sysImgPath[1]){
					if(/^https?:\/\//.test(imgUrlLowerCase)) {
						result = $T.Html.encode(imgurl);
					} else {
						result = top.getDomain('resource') + $T.Html.encode(imgurl);
					}
				}
			}
			return result;
		},
		// todo 直接获取内容
		getEditorContent : function () {
			if (this.editorView.editor.isHtml) {
				return this.editorView.editor.getHtmlContent();
			} else {
				return this.editorView.editor.getTextContent();
			}
		},
		//得到编辑器内容(纯文本)
		getTextContent: function () {
			return this.editorView.editor.isHtml ? this.editorView.editor.getHtmlToTextContent() : this.editorView.editor.getTextContent();
		},
		setEditorContent : function (content) {
			if (this.editorView.editor.isHtml) {
				return this.editorView.editor.setHtmlContent(content);
			} else {
				return this.editorView.editor.setTextContent(content);
			}
		},
		// 用户未上传附件验证正文/主题是否提到附件
		checkContent : function(event){
			var self = this;
			var isContinue = false;
			var noAttach = uploadManager.fileList.length == 0 && Arr_DiskAttach.length == 0;
			if(noAttach){
				var content = self.getEditorContent() || '';
				content = content.split("replySplit")[0];
				
				var subject = self.model.autoSaveTimer['subMailInfo']['subject'];
				var newSubject = $("#txtSubject").val();
				
				if (content.indexOf("附件") >= 0 || (subject != newSubject && newSubject.indexOf("附件") >= 0)) {
					if(M139.UI.Popup.currentPopup){
						M139.UI.Popup.currentPopup.close();
					}
					var target = subjectView.getPopupTarget(event);
					var popup = M139.UI.Popup.create({
						target : target,
						icon : "i_ok",
						width : 300,
						buttons : [{
							text : "确定",
							cssClass : "btnSure",
							click : function() {
								mainView.sendMail();
								popup.close();
							}
						}, {
							text : "取消",
							click : function() {
								popup.close();
							}
						}],
						content : self.model.tipWords['LACK_ATTACHMENTS']
					});
					popup.render();
					
				}else{
					isContinue = true;
				}
			}else{
				isContinue = true;
			}
			return isContinue;
		},

		/**
		 * 截屏, 向下兼容
		 * 有可能打开页面时不支持，但是后来安装了。
		 * 如果控件成功被创建，则该函数会被覆盖掉
		 */
		captureScreen : function(){
			if(upload_module_multiThread.isSupport() || M139.Plugin.ScreenControl.isScreenControlSetup(true)){
				upload_module_multiThread.init(true);
				if(captureScreen != arguments.callee){
					captureScreen();
				}
			}
		}
	}));
})(jQuery, _, M139);

﻿/**
 * @fileOverview 定义写信页App对象
 */
 (function(jQuery,Backbone,_,M139){
    var $ = jQuery;
    var superClass = M139.PageApplication;
    M139.namespace("M2012.Compose.Application", superClass.extend(
    /**@lends M2012.MainApplication.prototype*/
    {
        /** 
        *写信页App对象
        *@constructs M2012.Compose.Application
        *@extends M139.PageApplication
        *@param {Object} options 初始化参数集
        *@example
        */
        initialize:function(options){
            superClass.prototype.initialize.apply(this,arguments);
        },

        defaults:{
            /**@field*/
            name:"M2012.Compose.Application"
        },

        /**主函数入口*/
        run:function(){
            this.initViews();

            this.initEvents();
        },

        initViews:function(){
        	var composeModel = this.model = new M2012.Compose.Model();
        	var options = {model:composeModel};
            
			//addrInputView = new M2012.Compose.View.AddrInput(options);
            //subjectView = new M2012.Compose.View.Subject(options);

            uploadView = new M2012.Compose.View.Upload(options);
			
			ComposeModel = composeModel; //全局

            //htmlEditorView = new M2012.Compose.View.HtmlEditor(options);
            
			//senderView = new M2012.Compose.View.Sender(options);
            //signMenuView = new M2012.Compose.View.SignMenu(options);
            //timingView = new M2012.Compose.View.Timing(options);
            //addressBook = new M2012.Compose.View.AddressBook(options);
            mainView = new M2012.Compose.View.Main(options);
        },

        initEvents: function () {
            //this.startCheckContentLength();
        },

        /**
         *定时检测正文内容，如果过大就加载压缩类库
         */
        startCheckContentLength: function () {
        
        }
		
    }));
    window.guid = Math.random().toString(16).replace(".", "");//为每个窗口生成一个唯一数，避免重复提交发信请求
    $composeApp = new M2012.Compose.Application();
    $composeApp.run();
    //页面离开提示
	/*
    window.top.onbeforeunload=function(){
        try{
            var isEdited = mainView ? mainView.model.compare() : false;
            if(isEdited){
                return "未保存的内容将会丢失，确定要离开页面？";
            }
        }catch(e){}
    }*/
})(jQuery,Backbone,_,M139);
