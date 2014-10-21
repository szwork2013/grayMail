﻿/**   
* @fileOverview 读信页添加邮件到达提醒
*/

(function (jQuery, _, M139) {

/**
*@namespace 
*读信页添加邮件到达提醒
*/

M139.namespace("M2012.AddMailNotify.Model",Backbone.Model.extend({
   
    defaults:{  
		addEmail:null
	},
	
	getMailNotify:function(callback){
		var self = this;
		 M139.RichMail.API.call("user:getMailNotify",{},function(result){            
            callback && callback(result.responseData);
        });
	},

	updateMailNotify:function(options,callback){
	
        M139.RichMail.API.call("user:updateMailNotify",options,function(result){            
            callback && callback(result.responseData);
        });
        
	},
	
	setAttr:function(callback){
		var options = {
			attrs:{ _custom_SmsNotify: 0}
		};
		M139.RichMail.API.call("user:setAttrs",options,function(result){            
            callback && callback(result.responseData);
        });
	},
	
	addMailNotifyExcp:function(callback){
		var self = this;
		var email = self.get('addEmail');
			email = $Email.getEmail(email);
		var options = {
			emaillist:[email],
			timerange:[
						{
							begin:8,
							end:22,
							weekday:'1,2,3,4,5,6,7',
							discription:'每天，8:00 ~ 22:00'
						}
					  ],
			enable:true,
			notifytype:1,
			fromtype:2,
			supply:false
		};
		M139.RichMail.API.call("user:addMailNotifyExcp",options,function(result){            
            callback && callback(result.responseData);
        });
	}

}));

})(jQuery, _, M139);

﻿/**
* @fileOverview 读信页添加邮件到达提醒
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    
    /**
    * @namespace 
    * 读信页添加邮件到达提醒
    */   
         
    M139.namespace('M2012.AddMailNotify.View', superClass.extend({

    /**
    *@lends M2012.AddMailNotify.View.prototype
    */

    el:"",

    events:{},
	
	name:"M2012.AddMailNotify.View",

    template:{
        content:['<div class="norTipsContent">',
                     '<p>您的邮件到达提醒处于关闭状态。确定是否为此发件人设置来邮短信提醒？</p>',
                     '<p class="mt_20">{0}</p>',
                 '</div>'].join("")   
 		      },

    initialize: function(options){
       var self=this;
       this.model= new M2012.AddMailNotify.Model();
	   this.model.set({addEmail:options.addEmail});
       return superClass.prototype.initialize.apply(this, arguments);
       
    },
	
	/** 判断添加成功 */
	isAddSuccess:function(){
		if(this.updateMailNotifySuccess && this.setAttrSuccess && this.addMailNotifyExcpSuccess){
			this.updateMailNotifySuccess = false;
			this.setAttrSuccess = false;
			this.addMailNotifyExcpSuccess = false;
			top.BH('readmail_smsremindsuccess');
			M139.UI.TipMessage.show("来邮短信提醒添加成功", { delay:3000 });
			$User.getMailNotifyInfo().notifyType = "9"; //设置为9
			try{
				$App.getTabByName('notice').isRendered = false;
			}catch(e){}
		}
	},
	
	//获取手机通知
	getMailNotify:function(callback){
		var self = this;
		self.model.getMailNotify(function(result){
			if(result && result.code === 'S_OK'){
				var data = result["var"];
				
				//超过50人或在例外列表中，跳到设置页
				var notifyExcpLength = data.length - 2;
				self.hasContainsExcp = self.isMailNotifyExcpContains(data); //是否已经包含
				if(notifyExcpLength >= 50 || self.hasContainsExcp){
					$App.show('notice');
					return;		
				}
				
				var result = $.grep(data,function(val,i){
					val.enable = true;
					return val.fromtype == 0 || val.fromtype == 1;
				});
				var options = {
						mailnotify:result
					};
				callback && callback(options);
			}else{
				self.logger.error("readmail getMailNotify returndata error", "[user:getMailNotify]", result);
			}
			
		});
	},
	
	//是否例外列表包含地址,如果包含则直接跳到设置页
	isMailNotifyExcpContains:function(data){
		var self = this;
		var result = $.grep(data,function(val,i){
				return val.fromtype != 0 && val.fromtype != 1;
			});
		var list = [];
		try{
			$.each(result,function(n,val){
				if(val && val.emaillist){
					list = list.concat(val.emaillist);
				}
			});
		}catch(e){}	
		
		//判断是否包含自己帐号，若有则补充自己所有帐号
		var containsMyself = false;
		var myAccounts = $User.getAccountListArray();
		if(list[0]){
			$.each(list,function(i,val){
				if($.inArray(val,myAccounts) > -1){
					containsMyself = true;
				}
			});
		}
		if(containsMyself){ list = list.concat(myAccounts)}
		var email = $Email.getEmail(self.model.get('addEmail'));
		if(!email){return true}
		return $.inArray(email,list) > -1;
	
	},
	
	//修改手机通知
	updateMailNotify:function(options,callback){
		var self = this;
		self.model.updateMailNotify(options,function(result){
			if(result && result.code === 'S_OK'){
				self.updateMailNotifySuccess = true;
				//self.isAddSuccess();
				callback && callback();
			}else{
				self.logger.error("readmail updateMailNotify returndata error", "[user:updateMailNotify]", result);
			}
		});				
	},
	
	setAttr:function(callback){
		var self = this;
		self.model.setAttr(function(result){
			if(result && result.code === 'S_OK'){
				self.setAttrSuccess = true;
				self.isAddSuccess();
				callback && callback();
			}else{
				self.logger.error("readmail setAttr returndata error", "[user:setAttrs]", result);
			}
		});
	},
	
	//添加例外情况,如果已存在的不在添加
	addMailNotifyExcp:function(){
		var self = this;
		if(self.hasContainsExcp){ 
			self.addMailNotifyExcpSuccess = true;
			self.isAddSuccess();
			return;
		}
		self.model.addMailNotifyExcp(function(result){
			if(result && result.code === 'S_OK'){
				self.addMailNotifyExcpSuccess = true;
				self.isAddSuccess();
			}else{
				self.logger.error("readmail addMailNotifyExcp returndata error", "[user:addMailNotifyExcp]", result);
			}
		});
	},

	/** 添加提醒账号 */
	addAccount:function(){
		var self = this;
		self.getMailNotify(function(options){
			self.updateMailNotify(options,function(){
				self.setAttr(function(){
					self.addMailNotifyExcp();
				});	
			});
		});
	},
	
	/** 对话框输出 */
    render:function (){
        var self=this;
		var email = self.model.get('addEmail');
		var dialog = self.dialog = $Msg.confirm(
				$T.Utils.format(self.template.content,[$T.Html.encode(email)]),
				function(){
					self.addAccount();
					self.dialog = null;
				},
				null,
				{
					isHtml:true,
					dialogTitle:"来邮提醒",
					icon:"warn"
				}
			);
    }
	

}));
    
    
})(jQuery, _, M139);    



