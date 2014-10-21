/**   
* @fileOverview 短信提醒
*/
(function (jQuery, _, M139) {

/**
* @namespace 
* 短信提醒
*/

M139.namespace("M2012.SmsNotifyFriends.Model",Backbone.Model.extend({
    
	defaults:{
    	sid:top.$App.getSid(),
    	validImgUrl:null
	},
	
	/** 获取短信套餐信息 */
	getSmsPackageInfo:function(callback){
		var options = {
			serialId:-1,
			dataType:0
		};

		top.M139.RichMail.API.call("sms:getSmsMainData",options,function(result){
            
            if(result.responseData.code && result.responseData.code == 'S_OK'){
                callback && callback(result.responseData["var"]);
            } else {
                top.$App.logger.error("sms:getSmsMainData data error", "[sms:getSmsMainData]", result.responseData);
            	top.$Msg.alert('系统繁忙，请稍后重试！');
            }
        });
	},
	
	/** 短信提醒初始化数据 */
	getSmsNotifyData:function(options,callback){

		M139.RichMail.API.call("sms:smsNotifyInit",options,function(result){
            if(result.responseData.code && result.responseData.code == 'S_OK'){
			
                result.responseData.summary!='' && top.$Msg.alert(result.responseData.summary,{
					onClose:function(e){
						top.$App.close();
						top.$App.showMailbox(3);
					}
				});				
                callback && callback(result.responseData["var"]);      
            } else {
                callback && callback(result.responseData);
            }
        });
	}
    
}));

})(jQuery, _, M139);
