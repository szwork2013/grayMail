/**   
* @fileOverview 定义设置页移动特色（邮箱伴侣和套餐）
*/

(function (jQuery, _, M139) {

/**
*@namespace 
*定义设置页移动特色（邮箱伴侣和套餐）
*/

M139.namespace("M2012.Settings.Mobilefeatures.Model",Backbone.Model.extend({
    
    defaults:{  //默认数据
        mealcode:null,
        dispose:null,
        mealobj:{ //套餐信息
            item:['项目',
                '<div class="p_relative" id="item0">免费版<span class="fw_n">(无升级)</span><i class="i_tc1"></i></div>',
 				'<div class="p_relative" id="item1">5元版<span class="fw_n">(升级50%)</span><i class="i_tc2"></i></div>',
                '<div class="p_relative" id="item2">20元版<span class="fw_n">(升级200%)</span><i class="i_tc3"></i></div>'
 				], 
            price:['功能费'],
            //priceValue:[],
            volume:['容量'],
            //volumeValue:[],
            attachSize:['附件'],
            //attachSizeValue:[],
            notifyFee:['邮件到达提醒'],
            //notifyFeeValue:[],
            freeSms:['自写短信'],
            //freeSmsValue:[],
            freeMms:['自写彩信'],
            //freeMmsValue:[],
            maxRecipients:['群发邮件人数'],
            //maxRecipientsValue:[],
            diskVolume:['彩云容量'],
           // diskVolumeValue:[],
            diskSingleFileSize:['彩云单个文件大小'],
            //diskSingleFileSizeValue:[],
            largeattachVolume:['文件快递容量'],
            //largeattachVolumeValue:[],
            largeattachExpire:['文件快递保存天数'],
            //largeattachExpireValue:[],
            videomailRecordLimit:['视频邮件'],
            //videomailRecordLimitValue:[],
            letterPapper:['信纸'],
            //letterPapperValue:[],
            greetingCard:['贺卡'],
            //greetingCardValue:[],
            postcard:['明信片'],
           // postcardValue:[],
            skin:['皮肤'],
           // skinValue:[],
            pushemail:['PushEmail 详情'],
            //pushemailValue:[],
            changeBtn:['<td rowspan="3">变更</td>',
                       '<td style="border-bottom:none; text-align:center;"><a href="javascript:void(0)" class="btnNormal"><span>注销&nbsp;免费版</span></a></td>',
                       '<td style="border-bottom:none;text-align:center;"><a href="../cancellation/upgrade.html" class="btnNormal"><span>升级为5元版</span></a></td>',
                       '<td style="border-bottom:none;text-align:center;"><a href="../cancellation/upgrade.html" class="btnNormal"><span>升级为20元版</span></a></td>'],
            changeMeal:['变更为<span class="col5Fa">免费版</span>','变更为<span class="col5Fa">5</span>元版','变更为<span class="col5Fa">20</span>元版'],
            changeSms:['发<strong>KTYX</strong>到<strong>10086</strong>','发<strong>KTYX5</strong>到<strong>10086</strong>','发<strong>KTYX20</strong>到<strong>10086</strong>']
                       
            
          
        }
        
	},
	
	logger: new top.M139.Logger({name: "M2012.Settings.Mobilefeatures"}),
	
	/**
	* 获取邮箱伴侣信息
	*/
	getMailPatterInfo:function(callback){
		var self = this;
		var options= '';
        top.M139.RichMail.API.call("mailPatter:getMailPatterInfo",null,function(response){
            if(response.responseData && response.responseData['code'] == 'S_OK'){
                callback && callback(response.responseData['var']);
            }else{
                self.logger.error("getMailPatterInfo returndata error", "[mailPatter:getMailPatterInfo]", response);
            }      
        });
	},
	getSmsCode: function (callback) {
	    //发送短信验证码
	    M139.RichMail.API.call("mailPatter:getSMSCode", {}, function (response) {
	        //console.log("发送短信的返回码：" + JSON.stringify(response.responseData));
	        callback(response.responseData); //验证
	    });
	},
	
	/**
	* 设置邮箱伴侣
	*/
	openMailPartern:function(options,callback){
		var self = this;
		
        top.M139.RichMail.API.call("mailPatter:setMailPatterInfo",options,function(result){
            if(result.responseData.code && result.responseData.code == 'S_OK'){
                callback && callback(result.responseData.code);
            } else {
                callback && callback(result.responseData.code);
                
            }
        });
	},

	/**
	* 获取邮箱套餐信息
	*/
	getMealInfo:function(callback){
	    var self = this;
		var options= '';
        M139.RichMail.API.call("meal:getMealInfo",options,function(result){
            if(result.responseData.code && result.responseData.code == 'S_OK'){
                callback(result.responseData["var"]);
            }else{
                self.logger.error("getMealInfo returndata error", "[meal:getMealInfo]", result);            
            }
        });
        
	},
	
	/**
	* 更换邮箱套餐信息
	*/
	setMailPatterInfo:function(callback){
	    var self = this;
		var options= {
		        MailUpdate:self.get('mealcode'),
		        dispose:self.get('dispose')
		    }; 
        M139.RichMail.API.call("mailPatter:setMailPatterInfo",options,function(result){
            if(result.responseData.code && result.responseData.code == 'S_OK'){
                callback(result.responseData["var"]);
            }else{
                self.logger.error("setMailPatterInfo returndata error", "[mailPatter:setMailPatterInfo]", result);            
            }
        });
        
	}
	
	

}));

})(jQuery, _, M139);
