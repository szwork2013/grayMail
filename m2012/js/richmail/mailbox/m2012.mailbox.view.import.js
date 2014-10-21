/**
 * 邮件导入视图
 * @author chengwei
 */
(function(jQuery, _, M139, win) {

	var $ = jQuery;
	var $App = top.$App || $App;
	var $Msg = top.$Msg || $Msg;
	var wmsvrPath2 = top.domainList.global.wmsvrPath2;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Mailbox.View.Import', superClass.extend({
		el : "body",
		events : {
			"click #btn_submit" : "importEmail",
			"click #btn_cancel" : "close"
		},
		initialize : function(options) {
			this.model = options.model;
			superClass.prototype.initialize.apply(this, arguments);
			this.initEvents();
			return this;
		},
		initEvents : function() {
			var self = this;
			this.model.on("importFinished", function(args) {
				$App.getView("importMailDialog").hide();
				var msg, btn, icon;
				if (args.failed === args.total) {
					msg = "邮件导入失败，请稍后重试。";
					btn = ["我知道了"];
					icon = "fail";
				} else if (args.success === args.total) {
					msg = "<p>邮件导入成功。</p><p>共有 " + args.total + " 封邮件导入到\"" + args.folderName + "\"文件夹。</p>";
					btn = ["查看邮件", "关闭"];
					icon = "ok";
				} else {
					msg = "<p>已处理 " + args.total + " 封邮件，其中共有 " + args.success + " 封成功导入到\"" + args.folderName + "\"文件夹。</p>";
					btn = ["查看已导入邮件", "关闭"];
					icon = "warn";
				}
				$Msg.confirm(msg, function() {
					(args.failed !== args.total) && $App.showMailbox(args.folderId);
					self.close();
				}, self.close, {
					onclose : self.close,
					icon : icon,
					buttons : btn,
					isHtml : true,
					dialogTitle : "导入邮件"
				});
			});
			this.model.on("showMessages", function(args) {
				args && $Msg[args.type || "alert"](args.msg, {
					dialogTitle : "导入邮件"
				});
			});
			this.model.on("startImporting", function() {
				self.showLoading();
				$("#btn_submit").addClass("btnGrayn");
				document["flash_import"].uploadAll();
			});
		},
		render : function() {
			var self = this;
			// 载入Flash
			$("#flash_button").html(this.getFlashHtml("flash_import", "100%", "100%", "Richinfo_import.swf"));
			// 构建文件夹列表
			var folders = $App.getView("folder").model.getFolderDropItems(), len = folders.length, idx;
			var currentFolderId = $App.getCurrentFid();
			while (len--) {
				if (folders[len].data === currentFolderId) {
					idx = len;
					break;
				}
			}
			this.dropMenu = M2012.UI.DropMenu.create({
				selectedIndex : idx || 0,
				menuItems : folders,
				maxHeight : 63,
				container : $("#drop_folder")
			});
		},
		// 执行导入操作
		importEmail : function() {
			this.model.importMail(this.dropMenu.getSelectedItem());
		},
		// 关闭导入邮件对话框
		close : function() {
			var dialog = $App.getView("importMailDialog");
			dialog && dialog.close();
		},
		// 获取flash
		getFlashHtml : function(id, width, height, swfName) {
			var swfUrl = '/m2012/flash/' + swfName;
			return ['<object codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0"', ' width="' + width + '" height="' + height + '" id="' + id + '" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000">', '<param name="allowScriptAccess" value="always" />', '<param name="movie" value="' + swfUrl + '" />', '<param name="quality" value="high" />', '<param name="wmode" value="transparent" />', ' <embed src="' + swfUrl + '" quality="high" width="' + width + '" height="' + height + '" wmode="transparent"', ' type="application/x-shockwave-flash" pluginspage="//www.macromedia.com/go/getflashplayer"', ' name="' + id + '" swLiveConnect="true" allowScriptAccess="always">', '</embed>', '</object>'].join("");
		},
		// 更新loading视图
		showLoading : function() {
			this.currentFileIndex = this.currentFileIndex || 0;
			$("#loadingText").html('正在导入第<span class="c_009900"> ' + (++this.currentFileIndex) + '</span> 封邮件')
			if (!$("#loadingImage").attr("src")) {
				$("#loadingImage").attr("src", top.rmResourcePath + "/images/scroll.gif").parent().css("visibility", "visible");
			}
		},
		// 单封上传处理完成
		uploadComplete : function(taskId, resp) {
			this.model.processComplete(taskId, resp);
			this.showLoading();
		}
	}));

	//Flash上传控件约定的回调函数
	win.JSForFlashUpload = {
		getUploadUrl : function() {
			return view.model.getUploadUrl();
		},
		onload : function(options) {
			options["filter"] = ["eml邮件(*.eml)"];
			return options;
		},
		onselect : function(xmlFileList, jsonFileList) {
			var mails = view.model.getMails(jsonFileList);
			var count = mails.length;
			$("#filecount").html( count ? '已选择<span class="c_009900">' + count + '</span>封邮件&nbsp;&nbsp;' : "未选择邮件&nbsp;&nbsp;");
			$("#choose_btn").text(count ? '重新选择' : '选择邮件');
			return mails;
		},
		onprogress : function(taskId, sendedSize, uploadSpeed) {
		},
		oncomplete : function(taskId, responseText) {
			view.uploadComplete(taskId, M139.JSON.tryEval(responseText));
		},
		onerror : function(taskId, errorCode, errorMsg) {
			$Msg.alert("由于您的网络不稳定，邮件导入失败。请稍后重试。", {
				icon : "fail",
				dialogTitle : "导入邮件"
			});
			view.close();
		},
		onclick : function() {
			return true;
		}
	};

	// 导入视图
	var view;

	$(function() {
		// 实例化导入视图
		view = new M2012.Mailbox.View.Import({
			model : new M2012.Mailbox.Model.Import()
		});
		view.render();
	});

})(jQuery, _, M139, window);