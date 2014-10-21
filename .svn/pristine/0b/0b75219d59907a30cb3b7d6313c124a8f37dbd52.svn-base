M139.namespace("M2012.Fileexpress.Cabinet.View", {
	Command : Backbone.View.extend({
		el : "",
		initialize : function(options) {
			this.model = options.model;
			var self = this;
			top.$App.unbind("cabinetCommand").
				on("cabinetCommand", function(args) {//监听其它模块发起的菜单命令
				self.doCommand(args.command, args);
			});
		},
		doCommand : function(command, args) {
			var self = this;
			if (!args) {//未传则置空
				args = {}
			}
			var model = self.model;
			
			var fids = [];
			if (args && args.fids) { //如果有传fids，直接取用
				fids = args.fids;
				if(typeof fids === 'string'){
					fids = [fids];
				}
			} else {	//如果没传，获取列表中选中项的fids
				fids = self.getSelectedFids();
			}
			var fidsStr = fids.join(',');
			
			function addBehavior() {
			    var map = {
			        markAll: "mailbox_markUnread_ok", deleteAll: "mailbox_deleteUnread_ok",
			        "delete": "mailbox_realDelete_ok", spam: "mailbox_spam_ok"
			    };
			    var tabReadMail = /readmail_/gi.test($App.getCurrentTab().name);
			    if (command == "move" && args.fid == 4) { //move 到fid=4才是普通删除
			        if(tabReadMail){
			            BH('toolbar_deleteok');
			        }else{
			            BH("mailbox_delete_ok");
			        }
			        return; 
			    }
			    if(map[command]){
			        if(tabReadMail && command == 'delete'){
	    		        BH('toolbar_realdeleteok');
			        }else{
    			        BH(map[command]);			        
			        }
			    }
			};
			
			// todo
			function commandCallback() {//完成操作后回调
				M139.UI.TipMessage.hide();
				if(messageSuccess) {//成功提示
					setTimeout(function() {
						M139.UI.TipMessage.show(messageSuccess, {
							delay : 3000
						});
					}, 1000);
				}
				addBehavior();
			}

			var message = "正在操作中.......";
			var messageSuccess = "";
			
			var commands = model.commands;
			switch (command) {
				case commands.UPLOAD:
					break;
				case commands.DOWNLOAD:
	        		if(checkSelect()) {
	        			if(self.model.isSupportDownload()){
	        				self.model.trigger("downloadFiles", fidsStr);
	        			}else{
							top.M139.UI.TipMessage.show(self.model.tipWords.OVER_SIZE, { delay: 3000, className: "msgYellow" }); 
	        			}
					}else{
						top.M139.UI.TipMessage.show(self.model.tipWords.SELECTED_EMPTY, { delay: 3000, className: "msgYellow" }); 
					}
					break;
				case commands.SEND_TO_MAIL:
					if(checkSelect()) {
						var tips = checkFileNum();
						if(!tips){
							sendFiles(self.model.sendTypes['MAIL']);
						}else{
							top.M139.UI.TipMessage.show(tips,{ delay: 3000, className: "msgYellow" });
						}
					}else{
						top.M139.UI.TipMessage.show(self.model.tipWords.SELECTED_EMPTY, { delay: 3000, className: "msgYellow" }); 
					}
					break;
				case commands.SEND_TO_PHONE:
	                if(checkSelect()) {
						sendFiles(self.model.sendTypes['MOBILE']);
					}else{
						top.M139.UI.TipMessage.show(self.model.tipWords.SELECTED_EMPTY, { delay: 3000, className: "msgYellow" }); 
					}
					break;
				case commands.RENEW:
					if(checkSelect()) {
	        			self.model.trigger("renewFiles", fidsStr);
					}else{
						top.M139.UI.TipMessage.show(self.model.tipWords.SELECTED_EMPTY, { delay: 3000, className: "msgYellow" }); 
					}
					break;
				case commands.SAVE_TO_DISK:
					BH('cabSaveToDisk');
					if(checkSelect()) {
						var namesStr = self.model.getNameList(fids).join('，');
			            var moveToDiskview = new top.M2012.UI.Dialog.SaveToDisk({
			                ids : fidsStr,
			                fileName : namesStr,
			                type : 'move'
			            });
			            moveToDiskview.render().on("success", function () {
			                self.model.trigger('refresh');
			            });
					}else{
						top.M139.UI.TipMessage.show(self.model.tipWords.SELECTED_EMPTY, { delay: 3000, className: "msgYellow" }); 
					}
					break;
				case commands.RENAME:
					if(checkSelect()) {
	        			self.model.trigger('renameFile');
					}else{
						top.M139.UI.TipMessage.show(self.model.tipWords.SELECTED_EMPTY, { delay: 3000, className: "msgYellow" }); 
					}
					break;
				case commands.DELETE_FILE:
					if(checkSelect()) {
						var selectedFids = self.model.get('selectedFids');
						var tip = $T.Utils.format(self.model.tipWords['DELETE_FILE_COUNT'], [fids.length]);
						top.$Msg.confirm(tip, function() {
	        				self.model.trigger("deleteFiles", fidsStr);
						}, {
							dialogTitle : '删除文件',
							icon : "warn"
						});
					}else{
						top.M139.UI.TipMessage.show(self.model.tipWords.SELECTED_EMPTY, { delay: 3000, className: "msgYellow" }); 
					}
					break;
				case "open":
					var fileids = self.model.get("selectedFids");
					if(fileids.length != 1){
						return;
					}
					var folder = $("em[fid='"+ fileids[0] +"']");
					if(folder.length == 0){
						folder = $("img[fid='"+ fileids[0] +"']");
					}
					folder[0].click();
			};
			function sendFiles(type){
				var url = self.model.urls['SEND_URL'];
				var fileList = self.model.getSelectedFiles();
                self.model.gotoSendPage({fileList : fileList, type : type});
			};
			function checkSelect() {//是否选择了文件
				return fids.length > 0?true:false;
			};
			function checkFileNum(){//选择发送的文件数量是否多50
				var serviceItem ='0016,0017'.indexOf(top.$User.getServiceItem()) >-1;
				if(serviceItem){
					return fids.length <=50?false:self.model.tipWords['SELECTEDFILE_TO_MANY'];
				}else{
					return fids.length <=10?false:self.model.tipWords['SELECTEDFILE_TO_MANY'];
				}
			}
		},
		getSelectedFids : function(isSessionMail) {
			var self = this;
			return self.model.get('selectedFids');
		}
	})
});
