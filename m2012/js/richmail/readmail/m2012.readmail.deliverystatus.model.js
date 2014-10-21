﻿/**   
* @fileOverview 读信页邮件投递状态查询
*/

(function (jQuery, _, M139) {

/**
*@namespace 
*读信页邮件投递状态查询
*/

M139.namespace("M2012.DeliveryStatus.Model",Backbone.Model.extend({
   
    defaults:{  //默认数据
        mid:null,
		sort:0,
		start:0,
		total:50,
		rcptFlag:null
	},
	
	//邮件发送详细状态[尽量不要改动]
    sendStatus:{
            state_0:  "投递中",
            state_60: "已投递到对方邮箱",
            state_61: "已投递到对方邮箱，但被对方认定为病毒邮件",
            state_70: "投递失败，该邮件疑似含病毒",
            state_71: "投递失败，收件人不存在",
            state_72: "投递失败，收件人已被冻结或注销",
            state_73: "投递失败，服务器通信错误",
            state_74: "投递失败，您的帐户无权向此邮件组发送邮件",
            state_75: "投递失败，您的帐户无权向此邮件组发送邮件",
            state_76: "投递失败，您的帐户无权向此邮件组发送邮件",
            state_77: "投递失败，收件人帐户已被限制接收接收",
            state_78: "投递失败，您的帐户已被限制发送邮件",
            state_79: "投递失败，您的帐户在对方的黑名单中",
            state_80: "投递失败，对方邮箱拒收此邮件",
            state_81: "投递失败，服务器通信错误",
            state_82: "投递失败，被对方邮箱判定为垃圾邮件",
            state_83: "投递失败，被对方邮箱判定为病毒邮件",
            state_84: "网关退信",
            state_85: "邮件大小超时收件人设置的大小",
            state_86: "邮箱容量已满",
            state_87: "本域投递失败，用户反病毒，邮件作为附件来通知收件人",
            state_88: "本域投递失败，用户分拣规则设置为直接删除",
            state_89: "已投递到对方邮箱，对方已回复（自动回复）",
            state_90: "已投递到对方邮箱，对方已转发（自动转发）",
            state_91: "本域投递失败，邮件审核未通过",
            state_99: "投递中",
            state_100: "已投递对方服务器",
            state_101: "投递中",
            state_119: "投递失败",
            state_250: "该邮件已超出发信状态查询有效期"
        },

	
	getDataSource:function(callback){
	
		var options={
			mid:this.get("mid"),
			sort:this.get("sort"),
			start:this.get("start"),
			total:this.get("total")
		}

        M139.RichMail.API.call("mbox:getDeliverStatus",options,function(result){            
            callback(result.responseData);
        });
        
	}

}));

})(jQuery, _, M139);
