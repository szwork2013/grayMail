/**   
* @fileOverview 邮件撤回功能
*/

(function (jQuery, _, M139) {

/**
* @namespace 
* 邮件撤回功能
* 仅支持本域邮件帐号
*/

M139.namespace("M2012.ReadMail.Recall.Model",Backbone.Model.extend({
        
        defaults:{
            fid:null,
            mid:null,
            dataSource:null
	    },
	    
	    tips:{
	        error1:"撤回失败,邮件不存在",
            error2:"撤回失败,此邮件不支持召回",
            error3:"撤回失败,该邮件已超过撤回期限"
	    },
        
        recallMsg:{
            "0": "撤回失败，邮件可能已被删除、自动转发，或其它未知原因",
            "1": "稍后执行",
            "2": "成功撤回",
            "3": "撤回失败，邮件可能彻底删除或已经撤回(重复操作)",
            "4": "撤回失败，邮件可能已被删除、自动转发或其它未知原因",
            "5": "撤回失败，邮件已读",
            "6": "撤回失败，邮件已被POP过",
            "7": "撤回失败，邮件可能已被删除、自动转发或其它未知原因",
            "8": "撤回失败，邮件发送已经超过系统设置的最大天数",
            "9": "撤回失败，邮件可能已被删除、自动转发，或其它未知原因",
            "10": "撤回失败，收件人地址不存在",
            "11": "撤回失败，邮件可能已被删除、自动转发，或其它未知原因",
            "12": "撤回失败，邮件被拒收",
            "13": "撤回失败，收件人账号被冻结",
            "14": "撤回失败，收件人账号已注销",
			"15": "撤回失败，邮件被imap过"
        },
        
        /** 判断是否本域邮件 */
        isSameDomain:function(email){
            return $App.isLocalDomainAccount(email);
        },
        
        /* 获取收件抄送密送所有帐号 */
        getReceiveAddrList:function(){
            var self = this;
            var data = this.get('dataSource');
            var to = data.to;
            var cc = data.cc;
            var bcc = data.bcc;
            var all = '';
            var allArray = [];
            var newArray = [];
            if(to) all+= to;
            if(cc) all = all + ',' + cc;
            if(bcc) all = all + ',' + bcc;
            allArray = $.unique(all.split(','));
            for(var i = 0; i<allArray.length; i++){
                var email = $Email.getEmail(allArray[i]);
                if(self.isSameDomain(email)){
                    newArray.push(email);
                }
            }
            return newArray;
        },

	    callDataSource:function(options,callback){
	        var self = this;
            M139.RichMail.API.call("mbox:recallMessage",options,function(result){
                callback && callback(result.responseData);
            });   
	    }
	    
}));

})(jQuery, _, M139);


