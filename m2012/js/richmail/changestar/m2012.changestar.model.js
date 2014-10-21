/**   
* @fileOverview 邮件列表和读信页加星标和取消星标
*/

(function (jQuery, _, M139) {

/**
* @namespace 
* 邮件列表和读信页加星标和取消星标
*/

M139.namespace("M2012.ChangeStar.Model",Backbone.Model.extend({
    
    defaults:{  
		ids:[], //星标邮件mid
		type:'starFlag',
	   value:0  // 0 - 取消星标 1 - 标记星标
	},
	
    UpdatStar: function (options, callback) {
	
		var options= options || {
			ids:this.get("ids"),
            sessionIds:this.get("sessionIds"),
			type:this.get("type"),
			value:this.get("value")
		}

        if(!options.ids){delete options.ids}
        if(!options.sessionIds){delete options.sessionIds}
        
        M139.RichMail.API.call("mbox:updateMessagesStatus",options,function(result){
            if(result.responseData.code && result.responseData.code == 'S_OK'){
                callback && callback(result.responseData["var"]);
            }
        });
        
	}

}));

})(jQuery, _, M139);

/*
*报文格式：
    <object> 
    <array name="ids"> 
        <string>208102e80ed5a52d00000003</string>
    </array> 
    <string name = "type" >starFlag</string> 
    <int name="value">0</int> 
    </object>
*/
