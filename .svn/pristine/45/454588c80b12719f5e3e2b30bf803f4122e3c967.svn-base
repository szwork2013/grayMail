(function(jQuery, _, M139) {
	var $ = jQuery;
	var $App = top.$App || $App;
	var wmsvrPath2 = top.domainList.global.wmsvrPath2;
	/**
	 * 邮件导入
	 * @author chengwei
	 */
	M139.namespace("M2012.Mailbox.Model.Import", M139.Model.ModelBase.extend({
		name : "MailImport",
		defaults : {
			folderId : "", // 导入文件夹ID
			folderName : "", // 导入文件夹的Name
			maxLength : (40 * 1024 * 1024), // 单封邮件最大50M
			selectedFileNum : 0, // 用户选择的文件数
			importFileNum : 0, // 可导入的文件数
			processedCount : 0, // 已导入的文件数
			successCount : 0, // 导入成功的文件数
			failedCount : 0, // 导入失败的文件数
			isImporting : false // 是否正在导入中
		},
		initialize : function(options) {
			return M139.Model.ModelBase.prototype.initialize.apply(this, arguments);
		},
		// 获取上传路径
		getUploadUrl : function() {
			var uploadUrl = "{0}/mail?func=mbox:importMessages&sid={1}&fid={2}";
			return $T.Utils.format(uploadUrl, [wmsvrPath2, $App.getSid(), this.get("folderId")]);
		},
		// 获取要上传的邮件
		getMails : function(selectedMail, callback) {
			var count = selectedMail.length, mails;
			this.set("selectedFileNum", count);
			mails = this.filterMail(selectedMail);
			this.set("importFileNum", mails.length);
			var msg = mails.length === 0 ? "每封要导入的邮件其文件大小需在50M以内。" : mails.length < count ? "每封要导入的邮件其文件大小需在50M以内，超过限制的文件已未被选取。" : "";
			msg && this.trigger("showMessages", {
				msg : msg
			});
			return mails;
		},
		// 执行导入操作
		importMail : function(folder) {
			if (!this.get("isImporting")) {
				this.set("folderId", folder.data);
				this.set("folderName", folder.text);
				if (!!this.get("importFileNum")) {
					this.set("isImporting", true);
					this.trigger("startImporting");
				} else {
					this.trigger("showMessages", {
						msg : "请选择要导入的邮件！"
					});
				}
			}
		},
		// 过滤邮件
		filterMail : function(mailList) {
			var maxLength = this.get("maxLength"), len = mailList.length, array = [], size;
			while (len--) {
				size = mailList[len].fileSize;
				if (size && (parseInt(size, 10) < maxLength)) {
					array.push(mailList[len]);
				}
			}
			return array;
		},
		// 单封邮件导入成功
		processComplete : function(taskId, resp) {
			var succ = this.get("successCount") || 0;
			var fail = this.get("failedCount") || 0;
			if (resp.code === "S_OK") {
				top.BH('toolbar_mailimportsucess');
				this.set("successCount", ++succ);
			} else {
				this.set("failedCount", ++fail);
			}
			this.processFinish();
		},
		// 处理是否完成所有邮件的导入
		processFinish : function() {
			var sum = this.get("processedCount") || 0;
			this.set("processedCount", ++sum);
			if (sum === this.get("importFileNum")) {
				this.trigger("importFinished", {
					success : this.get("successCount") || 0,
					failed : this.get("failedCount") || 0,
					total : this.get("importFileNum"),
					selected : this.get("selectedFileNum"),
					folderId : this.get("folderId"),
					folderName : this.get("folderName")
				});
			}
		}
	}));
})(jQuery, _, M139);
