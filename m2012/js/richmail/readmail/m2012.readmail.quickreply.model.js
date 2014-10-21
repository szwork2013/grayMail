/**   
* @fileOverview 读信页邮件快捷回复
*/

(function (jQuery, _, M139) {

/**
* @namespace 
* 读信页邮件快捷回复
*/

M139.namespace("M2012.ReadMail.Model.QuickReply",Backbone.Model.extend({
        
    	
	    /**
        *快捷回复提示语
        */
	    tips:{
	        replySuccess:'邮件回复成功',
	        replyFail:'系统繁忙,请稍后重试。',
	        replyContentError:'请输入要回复的内容。',
	        replyMailError:'请输入正确的邮件地址。',
	        replyMailNull:'请输入回复的邮件地址。'
	    },
    		
	    /**
        *快捷回复信件
        *@param {Object} options 初始化参数集
        */
	    compose:function(options,callback){	
            var self = this;
            M139.RichMail.API.call("mbox:compose&comefrom=5&categroyId=103000000",options,function(result){
                if(result.responseData.code && result.responseData.code == 'S_OK'){
                    callback && callback(true);
                }else{
                    callback && callback();
                }
            });   
	    },
    	
        /**
        *快捷回复信件数据组装
        *@param {Object} postData 传递参数
        *@param {Object} replyMessageData 传递参数
        *@param {function} callback 回调函数 
        */
	    replyMessage:function(postData,replyMessageData,callback){
	        var self = this;
	        var thiscallback = callback;
			//add by zsx 代收邮箱快捷回复的时候，取当前代收账户作为默认值
			var defaultSender = $User.getDefaultSender();
			var mid = $App.getCurrMailMid();
			var url = $("#mid_"+mid).attr("src");
			var thisone,fid;
			if(url && url.indexOf('fid')){
				var i = url.indexOf("fid=");
				fid = url.substring(i + 4);
				fid = parseInt(fid);
				if($App.getFolderType(fid) == -3){
					thisone = $App.getFolderById(fid).email;
					var poplist = top.$App.getPopList();
					var list =[];
					for(var i =0;i<poplist.length;i++){
						list.push(poplist[i]["email"]);
					}
					if($.inArray(thisone,list) > -1){
						defaultSender = thisone;
					}
				}	
			}
			//add by zsx如果是其他文件夹移动过来的邮件，快捷回复的时候，回复人要回复为默认值
			var findEmail = (function(){
				var toDiv = $(".readMail").filter("[mid='"+top.$App.getCurrMailMid()+"']").find("#receiver_to").children("div").children(".gAddr");
				var toList = [];
				for(var i=0;i<toDiv.length;i++){
					toList.push(top.$Email.getEmail($(toDiv[i]).attr('addr')));
				}
				var poplist = top.$App.getPopList();
				var popArray = $.map(poplist,function(n){
					return n.email;
				});
				for(var j=0;j<toList.length;j++){
					if($.inArray(toList[j],popArray) > -1){
						return toList[j];
					}
				}
				return "";
			})();
			if(findEmail == ""){
				defaultSender = $User.getDefaultSender();
			}else{
				defaultSender = findEmail;
			}
            M139.RichMail.API.call("mbox:replyMessage",replyMessageData,function(result){
                if(result.responseData.code && result.responseData.code == 'S_OK'){
                    var content = postData.content;
                    var data = result.responseData["var"];
                    var composeId = data.id;
                   // var uid = $User.getLoginName(); //发件人用默认帐号
                    var list = postData.list;
                    var sendMailRequest = {
                        attrs:{ 
                                account: defaultSender,
                                to: list,
                                cc: '',
                                bcc: '',
                                showOneRcpt: 0,
                                isHtml: 1,
                                subject: data.subject,
                                content: content + data.content, //包含所有回复过程的邮件原文,若content单出现，则是当前快速回复的内容
                                priority: 3,
                                requestReadReceipt: 0,
                                saveSentCopy: 1,
                                inlineResources: 1,
                                scheduleDate: 0,
                                normalizeRfc822: 0,
                                id: composeId
                            },
                        action:"deliver",
                        returnInfo:1   
                    };
                    
                    if(data.messageId){
                        sendMailRequest.attrs.messageId = data.messageId;
                    }
                    thiscallback && thiscallback(sendMailRequest);
                }else{
                     $Msg.alert(self.tips.replyFail,{ icon:'fail'
                     });
                }
            });   
	    }

}));

})(jQuery, _, M139);


