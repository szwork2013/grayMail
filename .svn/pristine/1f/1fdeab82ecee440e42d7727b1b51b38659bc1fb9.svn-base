M139.namespace("M2012.Disk.Model", {
	ContextMenu : Backbone.Model.extend({
		initialize : function (options) {
			this.diskModel = options.model;
		},
		container : ['<div style="top: 145px; left: 727px; z-index: 9001; position: absolute;" class="menuPop shadow  show" bindautohide="1"><ul>','</ul></div>'],
		template :['<li index="2" command="download"><a href="javascript:;"><span class="text"><i class="icon i-cDown"></i>下载</span></a></li></li>',
					'<li index="3" command="sendToMail"><a href="javascript:;"><span class="text"><i class="icon i-cSend"></i>发送</span></a></li></li>',
					'<li index="4" command="share"><a href="javascript:;"><span class="text"><i class="icon i-cShare"></i>分享</span></a></li>',
					'<li index="5" command="remove"><a href="javascript:;"><span class="text"><i class="icon i-cMove"></i>移动到</span></a></li>',
					'<li index="6" command="rename"><a href="javascript:;"><span class="text"><i class="icon i-cRenaming"></i>重命名</span></a></li>',
					'<li index="7" command="deleteDirsAndFiles"><a href="javascript:;"><span class="text"><i class="icon i-cDelete"></i>删除</span></a></li>'],
		//获取邮件列表右键菜单 isSingle，是否单封邮件
		getMailMenu : function (isSingle) {
			var data = [];
			var rightContextString = "";
			var self = this;
			var selectedOne = this.diskModel.getSelectedDirAndFiles();
			if (isSingle) { //单封邮件
				
				if(selectedOne[0] && (selectedOne[0]["type"] == "file" || selectedOne[0].directoryId)){
					data = [{
						text : '我是文件',
						command : "preview",
						bh2 : "context_preview",
						items : [{
								html : "<b>读信预览</b>"
							}
						]
					}];
					rightContextString = self.template.join("");
				}else if(selectedOne[0] && selectedOne[0]["type"] == "directory"){
					if(self.diskModel.isRootDir(selectedOne[0]["id"])){
						data = [{
							text : '我是目录，且是系统的',
							command : "newWindow",
							bh : "context_newWindow"
							}];
						rightContextString = self.template[0];
					}else{
						data = [{
							text : '我是目录，非系统目录',
							command : "preview",
							bh2 : "context_preview",
							items : [{
								html : "<b>读信预览</b>"
							}]
						}];
						rightContextString = self.template[0] + self.template[2] + self.template[3]+ self.template[4] +self.template[5] ;
					}
				}
			} else { //多封
				var isAllFILE = false;
				var isAllDIR = false;
				var file = 0;
				var directory = 0;
				var systemD = 0;
				var length = selectedOne.length;
				$.each(selectedOne, function(){
					if(this.type == "file" || this.directoryId){
						file++;
					}
					if(this.type == "directory"){
						if(self.diskModel.isRootDir(this.id)){
							systemD++;
						}else{
							directory++;
						}
					}
				});
				if(systemD == length){
					data = [{
						text : '全是系统目录',
						command : "move",
						args : {
							fid : 4
						},
						bh : "context_move"
					}];
					rightContextString = "";
				}
				if(directory == length){
					data = [{
						text : '全是普通目录',
						command : "move",
						args : {
							fid : 4
						},
						bh : "context_move"
					}];
					rightContextString = self.template[0] +self.template[2]+self.template[3]+ self.template[5];
				}
				if(file == length){
					data = [{
						text : '全是文件',
						command : "move",
						args : {
							fid : 4
						},
						bh : "context_move"
					}];
					rightContextString = self.template[0] + self.template[1] + self.template[2]+ self.template[3]+ self.template[5];
				}
				if(systemD + directory == length && systemD != 0 && directory !=0){
					data = [{
						text : '系统普通',
						command : "move",
						args : {
							fid : 4
						},
						bh : "context_move"
					}];
					rightContextString = self.template[1];
				}
				if(directory + file == length && directory !=0 && file !=0){
					data = [{
						text : '普通文件',
						command : "move",
						args : {
							fid : 4
						},
						bh : "context_move"
					}];
					rightContextString = self.template[0] +self.template[2]+self.template[3]+ self.template[5];
				}
				if(systemD + file == length && systemD !=0 && file !=0){
					data = [{
						text : '文件系统',
						command : "move",
						args : {
							fid : 4
						},
						bh : "context_move"
					}];
					rightContextString = "";
				}
				if(systemD + file + directory == length && systemD !=0 && file !=0 && directory !=0){
					data = [{
						text : '普通系统文件',
						command : "move",
						args : {
							fid : 4
						},
						bh : "context_move"
					}];
					rightContextString = "";
				}
				console.log(file+"-"+directory+"-"+systemD);
			}
			if(self.diskModel.get('currentShowType') != 0){
				rightContextString = self.template[0]+self.template[1]+self.template[2]+self.template[5];
			}
			return {
				data : data,
				rightContextString : rightContextString,
				menustr : self.container[0] + rightContextString + self.container[1]
			};
		}

	})
});
