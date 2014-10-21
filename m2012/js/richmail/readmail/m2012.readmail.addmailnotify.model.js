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
