/*
1: mail_inboxmailnumber 收件箱提醒
2：mail_scmn 特定联系人提醒
    3：calendar_cen日程即将到期事项数量提醒
    4：calendar_cain日历活动邀请数量提醒
    5：addr_mkpn通讯录可能认识的人数量提醒
    6：groupmail_gin群邮件群组邀请数量提醒
    7：netdisk_tsen网盘暂存柜到期文件数量提醒
8：netdisk_fsfn网盘好友共享文件数量提醒
    9：cpo_cpopu云邮局用户订阅报刊更新
    10：cpo_cponm云邮局报刊亭上架新杂志
11：webfe_asr别名设置提醒
12：webfe_mnsr邮件到达通知设置提醒
*/

M139.namespace("M2012", {
    RemindboxModel: Backbone.Model.extend({

    	initialize:function(){},
    	
    	getMsgList:function (callback) {
    		M139.RichMail.API.call("msg:getRemindMsg",{},function(response){
    			var res = response.responseData;
    			callback && callback(res);
    		});
    	},

    	removeMsg:function(option,callback){
    		M139.RichMail.API.call("msg:delRemindMsg",option,function(response){
    			var res = response.responseData;
    			callback && callback(res);
    		});
    	},

        getUnreadMailList:function(option,callback){
            var option = {
                "fid":0,
                "recursive":0,
                "ignoreCase":0,
                "isSearch":1,
                "isFullSearch":2,
                "start":1,
                "total":100,
                "limit":1000,
                "order":"receiveDate",
                "desc":"1",
                "flags":{"read":1},
                "statType":1
            }
            
            M139.RichMail.API.call("mbox:searchMessages",option,function(response){
                var res = response.responseData;
                callback && callback(res);
            });
        }
    })
});