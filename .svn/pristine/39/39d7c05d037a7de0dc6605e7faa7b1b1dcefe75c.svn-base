/**
* @fileOverview 欢迎页主题运营：地球一小时
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = Backbone.Model;
    
    /**
    * @namespace 
    * 欢迎页地球一小时
    */
    M139.namespace('M2012.Welcome.Earth2013.Model', superClass.extend({
		
        /**
        *@lends M2012.Welcome.Earth2013.prototype
        */
        dynamicInfo : {
        	eventTime : '2013-03-23 20:30:00',
        	partyNum : 1234567,
        	status : 0,// 是否设置地球一小时日程提醒0:未参与  1：参与
        	enviStatus : 0, // 是否承诺一个环保行动0: 否  1：是
        	isShow : 1,
        	invitedFriends : 13,
        	partInfo : [{partakeName : 'aa', partType : 1,partakeContent : '地球一小时'},
        				{partakeName : 'bb', partType : 2, partakeContent : '承诺一个环保'},
        				{partakeName : 'cc', partType : 3, partakeContent : '邀请2位好友'}]
        },
        singleLoginSite : 'http://zone.mail.10086.cn/api/sso/ssoformail.ashx?to=CN201302D1&sid=',
        attrbuteKey : 'topicality',
        attrbuteValues : {
        	lightoff : 'lightoff',// 熄灯一小时
        	promise : 'promise',// 环保承诺
        	invitefriends : 'invitefriends'// 邀请好友
        },
        attrbuteKeyForOld : 46,
        attrbuteValuesForOld : {
        	lightoff : 1,// 熄灯一小时
        	promise : 2,// 环保承诺
        	invitefriends : 3// 邀请好友
        },
        inviteTemplate : '', // 参加模板
        iniviteMail : {
        	email: "",//收件人地址‘,’号分隔
        	subject: "您的好友{0}邀请您参与\"地球一小时\"活动",
        	content: ""
        },
        initialize: function(){
        	this.initMailTemplate();
	    },
	    callApi: M139.RichMail.API.call,
	    /**
	     * 获取地球一小时初始化信息
	     * @param callback {Function} 获取参加地球一小时活动动态消息
	     */
	    getEarthHourInfo : function(callback){
		    var self = this;
	    	var data = {};
	    	self.callApi("earthhour:earthHourInit", data, function(res) {
	    		self.setDynamicInfo(res.responseData);
    			if(callback){
    				callback(res.responseData);
    			}
	        });
	    },
	    /*inner*/
	    initMailTemplate : function(){
	    	var self = this;
	    	self.getMailTemplate(2, function(res){
	    		self.setInviteTemplate(res.emailTemplate);
	    	});
	    },
	    /**
	     *获取邮件模板
	     * @param type {int} 1: 邀请好友见证邮件模版 2: 邀请好友参加邮件模版
	     */
	    getMailTemplate : function(type, callback){
	    	var self = this;
	    	var data = {type : type}; 
	    	self.callApi("earthhour:getStencil", data, function(res) {
    			if(callback){
    				callback(res.responseData);
    			}
	        });
	    },
	    /**
	     *设置参加活动状态
	     * @param partyType {int} 1: 地球一小时 2：承诺一个环保行动
	     * @param callback {Function} 回调
	     */
	    setStatus : function(partyType, callback){
	    	var data = {
        		partType : partyType+''
        	}          
        	M139.RichMail.API.call("earthhour:setStatus", data, function(res) {
    			if(callback){
					callback(res.responseData);
				}
	        });
	    },
	    /**
	     *邀请好友
	     * @param mails {String} 邀请人的邮箱地址（多个）用“，”隔开
	     * @param callback {Function} 回调
	     */
	    inviteFriends : function(mails, callback){
	    	var data = {
        		mails : mails
        	}
        	M139.RichMail.API.call("earthhour:inviteFriends", data, function(res) {
    			if(callback){
					callback(res.responseData);
				}
	        });
	    },
	    /**
	     *将服务端返回的初始化信息保存到model层
	     *@param dynamicInfo {Object} 动态信息对象
	     *@inner
	     */
	    setDynamicInfo : function(dynamicInfo){
	    	var self = this;
	    	self.dynamicInfo.eventTime = dynamicInfo.eventTime;
	    	self.dynamicInfo.partyNum = dynamicInfo.partyNum;
	    	self.dynamicInfo.status = dynamicInfo.status;
	    	self.dynamicInfo.enviStatus = dynamicInfo.enviStatus;
	    	self.dynamicInfo.isShow = dynamicInfo.isShow;
	    	self.dynamicInfo.invitedFriends = dynamicInfo.invitedFriends;
	    	self.dynamicInfo.partInfo = dynamicInfo.partInfo;
	    },
	    /**
	     *保存邀请邮件模板
	     *@param template {String} 邮件模板
	     *@inner
	     */
	    setInviteTemplate : function(template){
	    	this.inviteTemplate = template;
	    },
	    /**
	     *按照真实姓名，别名，手机号码取用户名
	     *@return {String}
	     */
	    getUserName : function(){
	    	if(top.$User){
	    		return top.$User.getSendName();
	    	}else{
	    		return top.Utils.getUserName();
	    	}
	    },
	    /**
	     *按照真实姓名，别名 返回用户名，没有真实姓名别名就返回''
	     *@return {String}
	     */
	    getSignName : function(){
	    	var name  = top.UserData.userName;//姓名
		    if(!name){//别名
			   if(top.UserData.uidList.length > 0){
				 name = top.UserData.uidList[0];
			   }else{
				 name = '';
			   }
		    }
		    return name.replace(/</g,"&lt;");
	    },
	    /**
	     *返回最大收件人数量
	     *@return {Int}
	     */
	    getMaxSender : function(){
	    	if(top.$User){
	    		return top.$User.getMaxSend();
	    	}else{
	    		return top.getMaxReceiverNum();
	    	}
	    },
		/**
	     *返回运营中心环保承诺单点登录地址 todo 该地址暂时未上线
	     *@return {String}
	     */
	    getSingleLoginSite : function(){
	    	return this.singleLoginSite + top.sid;
	    },
	    /**
	     *判断当前时间是否超过某个时间,2013-03-23 21:30:00
	     *@return {Boolean}
	     */
	    isOverTime : function(date){
	    	var date = $Date.parse(date);
	    	if(!date){
	    		return false;
	    	}
	    	var now = new Date();
	    	if(now >= date){
	    		return true;
	    	}
	    	return false;
	    },
	    /*
	     *@deprecated 暂时废弃该方法
	     */
	    resizePopHeight : function(){
	    	var pH = $("#withnessTemplate .add-gf-p").height();
	    	var conH = $("#withnessTemplate .add-gf-con").height();
	    	$("#withnessTemplate .earth-pop-body").height(pH + conH);
	    },
	    /**
		 *弹出提示框
		 */
	    alert : function(tip){
	    	if(top.$Msg){
				top.$Msg.alert(tip);
			}else{
				top.FloatingFrame.alert(tip);
			}
	    },
	    /**
		 *打开彩云标签页
		 */
	    showDisk : function(){
	    	if(top.$App){
	    		top.$App.show('diskDev');
	    	}else{
	    		top.Links.show('diskDev','&id=2');
	    	}
	    },
		/**
	     *发送邮件
	     * @param param {Object} {email : '12345@139.com,12367@139.com', subject : 'aaa', content : 'bbb'}
	     * @param callback {Function} 回调
	     */
		sendMail:function(param, callback){
	       var mailInfo = {
	            id: "",
	        	mid : "", //后台返回的草稿ID,成功调用存草稿方法后修改该属性
				messageId: "",
	        	account: param.account?param.account:getDefaultSender(),//发件人
		        to: param.email,//收件人地址‘,’号分隔
		        cc: "",//抄送人地址
		        bcc: "",//密送人地址
		        showOneRcpt: 1, //是否群发单显1 是 0否 
		        isHtml: 1,
		        subject: param.subject,
		        content: param.content,
		        priority: 3, //是否重要
		        signatureId: 0,//使用签名档
		        stationeryId: 0,//使用信纸
		        saveSentCopy: 1,//发送后保存副本到发件箱
		        requestReadReceipt : 0,//是否需要已读回执
		        inlineResources: 1, //是否内联图片
		        scheduleDate: 0, //定时发信
		        normalizeRfc822: 0,
		        attachments: []//所有附件信息
	        }
	    	var data = {
                "attrs"  :     mailInfo,
                "action" :     'deliver',
                "replyNotify": 0,
            	"returnInfo":  1
           };
	       M139.RichMail.API.call("mbox:compose&comefrom=5&categroyId=103000000", data, function(res) {
    	   		if(callback){
    	   			callback(res.responseData);
    	   		}
	       });
		   function getDefaultSender(){
		    	if(top.$App){
		    		return top.$User.getDefaultSender();
		    	}else{
		    		return top.UserData.DefaultSender;
		    	}
		   }
		}
}));
    
})(jQuery, _, M139);    