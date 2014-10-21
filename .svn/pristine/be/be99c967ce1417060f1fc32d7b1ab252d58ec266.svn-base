/**   
* @fileOverview 已读回执功能
*/

(function (jQuery, _, M139) {

/**
*@namespace 
*已读回执功能
*/

M139.namespace("M2012.Receipt.Model",Backbone.Model.extend({
        
        defaults:{
            mailListData:null,
            requestReadReceipt:false, //是否已读
	        askMe:1, //总是提示
	        notSend:2, //总是不发送
	        alwaysSend:3, //总是发送
	        readReceipt:null //是否询问
	    },
    	
	    /**
	    *获取配置信息
	    */
	    getAttrs:function(callback){   
		    var options = {server:1};
            M139.RichMail.API.call("user:getAttrs",options,function(result){
                if(result.responseData.code && result.responseData.code == 'S_OK'){
                    callback && callback(result.responseData["var"]);
                }
            });
	    },
    	
	    /**
	    *设置总是发送回执
	    */
	    setAlwaysSend:function(callback){
	        var self = this;
	        var alwaysSend = self.get("alwaysSend");
	        var options = { attrs: { preference_receipt : alwaysSend } };
	        M139.RichMail.API.call("user:setAttrs",options,function(result){
                if(result.responseData.code && result.responseData.code == 'S_OK'){
                    callback && callback(result.responseData["var"]);
                }
            });    
	    },
    	
	    /**
	    *设置总是不发送回执
	    */
	    setNotSend:function(callback){
	        var self = this;
	        var notSend = self.get("notSend");
	        var options = { attrs: { preference_receipt : notSend } };
	        M139.RichMail.API.call("user:setAttrs",options,function(result){
                if(result.responseData.code && result.responseData.code == 'S_OK'){
                    callback && callback(result.responseData["var"]);
                }
            });    
	    },
    	
	    /**
	    * 发送已读回执
	    */        
        sendMDN:function(callback){
            var self = this;
            var options = self.get("readReceipt");
                options.to = $Email.getEmail(options.to);
            console.log(options);
            M139.RichMail.API.call("mbox:sendMDN&comefrom=5&categroyId=103000000",options,function(result){
                if(result.responseData.code && result.responseData.code == 'S_OK'){
                    callback && callback(result.responseData["var"]);
                }else{
                    //接口异常上报
                }
            });            
        }
        
}));
})(jQuery, _, M139);