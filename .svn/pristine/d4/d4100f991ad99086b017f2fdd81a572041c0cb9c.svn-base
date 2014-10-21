/**   
* @fileOverview 邮件举报功能
*/

(function (jQuery, _, M139) {

/**
* @namespace 
* 邮件举报功能
*/

M139.namespace("M2012.MailComplaint.Model",Backbone.Model.extend({
        
        defaults:{
			fid:null, //当前文件夹
			mid:null, //当前邮件
			rubbishFid:5, //垃圾邮箱
			noReadMailFids:[2, 3, 4, 8, 9], //我的订阅、帐单中心、草稿箱、已发送和已删除文件夹（不显示入口举报，垃圾箱显示不是垃圾邮件）
			noFids:[2,3], //草稿箱、已发送列表不显示
			noSpamMailFids:[2, 3, 4, 5, 8, 9], //非拒收文件夹
			moveToFid: 5, //移动垃圾箱
			isSessionMode:false, //读信模式
			selectData:null, //列表选择数据
			sessionIds:[], //会话邮件ids
			ids:null, //普通邮件ids
			listData:null, //邮件列表数据，从读信获取
			dataSource:null, //读信数据
			accountList:[], //处理帐号
			myAccounts:[] //我的所有帐号
		},
		
		/** 提示信息 */
		tips:{
			serverBusy:'系统繁忙，请稍后重试',
			warnSys:'系统邮件，不能举报',
			warnMe:'自己的邮件，不能举报',
			warnTask:'待办任务，不能举报',
			warnSpamSys:'不能对系统邮件地址进行拒收',
			warnSpamMe:'不能对自己的邮件地址进行拒收'
		},
		
		/** 显示不是垃圾邮件 */
		isNotRubbishMailBtn:function(){
			return this.get('fid') == this.get('rubbishFid');
		},
		
		/** 显示工具栏举报按钮 */
		isShowComplaintBtn:function(){
			try{
				if(this.get('dataSource')){
					return this.isRMComplaintEntry();
				}else{
					return this.isComplaintMailBox();
				}
			}catch(e){
				return false;
			}
		},
		
		/** 是否举报邮件列表 test*/
		isComplaintMailBox:function(){
			var fids = this.get('noReadMailFids');
			var fid = this.get('fid');
			return $.inArray(fid,fids) == -1;
		},
		
		/** 是否读信举报文件夹 */
		isComplaintReadMailFid:function(){
			var fids = this.get('noReadMailFids');
			var fid = this.get('fid');
			return $.inArray(fid,fids) == -1;
		},

		/** 是否拒收邮件入口 */
		isSpamMail:function(){ 
			var fids = this.get('noSpamMailFids');
			var fid = this.get('fid');
			if($.inArray(fid,fids) > -1){
				return false;
			}else{
				return this.isRMComplaintEntry(); //同举报入口
			}
		},
        
        isAllowRefuseEmailaddr:function(addr){
            var self = this;
            var mid = this.get('mid');
            var logoType = 0;
            if(mid){
                var mailData = $App.getMailDataByMid(mid);
                var from = mailData && M139.Text.Email.getEmail(mailData.from); //邮件发件人
                if(addr == from){
                    logoType = mailData.logoType;
                }
            }
            if(self.isHasSysAccount(addr) || logoType == 1){
                self.showWarnTips(self.tips.warnSpamSys);
                return false;
            }else if(self.isHasMyAccount(addr)){
                self.showWarnTips(self.tips.warnSpamMe);
                return false;
            }
            return true;
        },
		
		/** 是否包含系统帐号 */
		isHasSysAccount:function(account){
			var sysAccounts = this.getSystemAccounts();
			return $.inArray(account,sysAccounts) > -1;
		},
		
		/** 是否包含自己帐号 */
		isHasMyAccount:function(account){
			var myAccounts = this.get('myAccounts');
			return $.inArray(account,myAccounts) > -1;
		},
		
		/** 
		* 读信举报入口
		* 以下条件读信页不显示“举报”入口：
			1、139邮箱系统邮件。如：subscribe@139.com、homemail@139.com、admin@139.com、postmaster@139.com、idea@139.com、antispam@139.com、ued@139.com、mail139@139.com、uec@139.com、service@139.com、idea@139.com、kefu@139.com、administrator@139.com、hostmaster@139.com、webmaster@139.com、mail139_holiday@139.com、port@139.com、mail139_vip@139.com、szlvsechuxing@139.com 。建议后期运营部门更新配置后支持研发调取。
			2、我的订阅、帐单中心、垃圾邮件、草稿箱、已发送和已删除文件夹
			3、139邮箱本人账号。（手机号码帐号、飞信帐号、别名帐号）
			4、带有139邮箱系统邮件LOGO的邮件(logotype=1)
		*/
		isRMComplaintEntry:function(){
			var mailData = this.get('dataSource');
			var from = this.get('from');
			if (mailData && mailData.from) { from = mailData.from;}//bugfix:从model取的from没有重新赋值，会取到上一封邮件的发件人
			var account = $Email.getEmail(from) || null;
			//会话模式
			if($App.isSessionMode()){ 
				return false;
			}
			
			//获取不了自己的帐号
			if(this.get('myAccounts').length == 0){ 
				return false;
			}
			//举报文件夹
			if(!this.isComplaintReadMailFid()){
				return false;
			}
			//系统邮件加标识
			if(mailData && mailData.logoType == 1){
				return false;
			}
			//待办任务
			if (mailData && mailData.flags && mailData.flags.taskFlag == 1) {
				return false;
			};
			//发件人含系统或自己帐号
			if(this.isHasMyAccount(account) || this.isHasSysAccount(account)){
				return false;
			}
			//订阅邮件
			if (mailData.subscriptionFlag == 1) {
				return false;
			};
			return true;
		},
		
		
		/** 
		* 获取系统邮件帐号
		*/
		getSystemAccounts:function(){
			return $App.getSysAccount() || [];
		},
		
		/** 
		* 组装拒收请求参数
		*/
		callSpamMailRequest:function(opt,callback){
			var options = {
				opType:2, //1、举报 2、拒收 3、取消垃圾邮件
				needFilterHistoryMail:opt.check ? 1 : 0, //1,2生效,是否处理历史邮件
				listType:2, //黑名单
				list:opt.list //处理拒收名单
                //ids:this.get('ids')
			};
			this.requestReportSpamMails(options,callback);
		},

		/** 
		* 组装举报请求
		*/
		callComplaintRequest:function(opt,callback){
			var options = {
				opType:1, //1、举报 2、拒收 3、取消垃圾邮件
				newFid:this.get('moveToFid'),
				needFilterHistoryMail:opt.check ? 1 : 0, //1,2,3生效,是否处理历史邮件
				list:opt.check ? this.get('accountList') : [],
				ids:this.get('ids')
			};
			this.requestReportSpamMails(options,callback);
		},

		/** 
		* 组装取消垃圾邮件请求
		*/
		callNotRubbishMailRequest:function(opt,callback){
			var options = {
				opType:3, 
				newFid:1,
                needFilterHistoryMail:opt.check ? 1 : 0, //1,2,3生效,是否处理历史邮件
				listType: 3, //opt.check ? 3 : 0, 
				list:this.get('accountList'),
				ids:this.get('ids')
			};
			this.requestReportSpamMails(options,callback);
		},		
		
		/** 
		* 功能接口请求
		*/
		requestReportSpamMails:function(options,callback){
			M139.RichMail.API.call("mbox:reportSpamMails",options,function(result){
                var responseData = result.responseData;
				callback && callback(responseData);
			});
		},

		/** 列表选择验证 */
		checkListSelect:function(){
			var self = this;
			var selectmids = this.get('ids');
            var flag = true;
			var accountList = [];
            var listObj = {};
            var fid = this.get('fid');
            var noAccountCount = 0;  //邮件没有发件人地址的邮件封数
            var mailboxModel = $App.getMailboxView().model;
            var superSelectResult = mailboxModel.superSelectResult || {};

			
			selectmids[0] && $.each(selectmids,function(n,mid){
				// 当存在跨页选择时，只能通过mailboxModel.superSelectResult中保存的mail对象来获取邮件信息
				var mailData = $App.getMailDataByMid(mid) || superSelectResult[mid];
				if(mailData){
					var logoType = mailData.logoType;
					var subscriptionFlag = mailData.subscriptionFlag;
					var account = $Email.getEmail(mailData.from);
                    if(account){
                        if(fid != 5){
                            if(self.isHasSysAccount(account) || logoType == 1 || subscriptionFlag == 1){ //系统邮件
                                self.showWarnTips(self.tips.warnSys);
                                flag = false;
                                return false;
                            }
                            if(self.isHasMyAccount(account)){ //自己帐号
                                self.showWarnTips(self.tips.warnMe);
                                flag = false;
                                return false;
                            }
                        }
                        listObj[account] = account;  //去重
                    }else{
                        noAccountCount++;
                    }
				}
			});
            for(var key in listObj){
                accountList.push(key);
            }
            this.set({accountList:accountList});
            this.set({noAccountCount:noAccountCount});
			return flag;
		},
        
		/** 
		* 举报失败提示 
		*/
		showFailTips:function(){
			this.showWarnTips(this.tips.serverBusy);
		},
		
		/** 
		* 举报警告提示 
		*/
		showWarnTips:function(text){
			text && M139.UI.TipMessage.show(text,{
				colour:'msgRed',
                prior:true,
				delay:3000
			});
		}
		
}));

})(jQuery, _, M139);


