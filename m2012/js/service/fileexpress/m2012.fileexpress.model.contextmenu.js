M139.namespace("M2012.Fileexpress.Model", {
	ContextMenu : Backbone.Model.extend({
		initialize : function (options) {
			this.diskModel = options.model;
		},
		container : ['<div style="top: 145px; left: 727px; z-index: 9001; position: absolute;" class="menuPop shadow  show" bindautohide="1"><ul>','</ul></div>'],
		template :[//'<li index="1" command="open"><a href="javascript:;"><span class="text"><i class="icon i-cOpen"></i>打开</span></a></li>',
					'<li index="2" command="download"><a href="javascript:;"><span class="text"><i class="icon i-cDown"></i>下载</span></a></li></li>',
					'<li index="3" command="sendToMail"><a href="javascript:;"><span class="text"><i class="icon i-cSendmail"></i>发送</span></a></li></li>',
					'<li index="4" command="renew"><a href="javascript:;"><span class="text"><i class="icon i-cRenewal"></i>续期</span></a></li>',
					'<li index="5" command="saveToDisk"><a href="javascript:;"><span class="text"><i class="icon i-cColrDisk"></i>存彩云网盘</span></a></li>',
				//	'<li index="6" command="sendToPhone"><a href="javascript:;"><span class="text"><i class="icon i-cPhone"></i>发送到手机</span></a></li>',
					'<li index="7" command="rename"><a href="javascript:;"><span class="text"><i class="icon i-cRenaming"></i>重命名</span></a></li>',
					'<li index="8" command="deleteFile"><a href="javascript:;"><span class="text"><i class="icon i-cDelete"></i>删除</span></a></li>'],
		//获取邮件列表右键菜单 isSingle，是否单封邮件
		getMailMenu : function (isSingle) {
			var data = [];
			var rightContextString = "";
			var self = this;
		//	var selectedOne = this.diskModel.getSelectedDirAndFiles();
			if (isSingle) { //单封邮件
				rightContextString = self.template.join("");
			} else { //多封
				rightContextString = self.template[0] + self.template[1] + self.template[2] + self.template[3] + self.template[5];
			}
			return {
				data : data,
				rightContextString : rightContextString,
				menustr : self.container[0] + rightContextString + self.container[1]
			};
		}

	})
});