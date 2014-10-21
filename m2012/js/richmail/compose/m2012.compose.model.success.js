﻿/**
 * @fileOverview 写信成功页模型层
 */
 (function(jQuery,Backbone,_,M139){
    var $ = jQuery;
    M139.namespace("M2012.Compose.Model.Success",Backbone.Model.extend({
    	name : 'composeSuccess',
    	mailInfo : {
        	to: [],
            cc: [],
            bcc: [],
            subject: '',
            action: '',
            saveToSendBox: 1,
            mid: '',
            tid: ''
        },
    	tipWords : {
        	DELIVER : '邮件已经发送',
        	SCHEDULE : '定时邮件设置成功',
        	SAVETO : '此邮件已保存到“草稿箱”文件夹'
        },
        sendSMSId : 85,
        callApi: M139.RichMail.API.call,
        /** 
        *写信成功页公共代码
        *@constructs M2012.Compose.Model.Success
        *@param {Object} options 初始化参数集
        *@example
        */
        initialize : function(options){
        	this.pageApp = new M139.PageApplication({name : 'composeSuccess'});
        	this.initMailInfo();
        },
        // 初始化刚才发送的邮件信息
        initMailInfo : function(){
            var mailIndex = this.pageApp.inputData.index?this.pageApp.inputData.index:0;
			this.mailInfo = top.$App.getCurrentTab().data.sendList[mailIndex];
        },
        getRecevers : function(){
            var receivers = this.getReceversArray();
            return receivers.join(',');
        },

        getReceversArray: function() {
            var addrList = [];
            addrList = addrList.concat(this.mailInfo.to, this.mailInfo.cc, this.mailInfo.bcc);
            return addrList;
        },

        getSubject : function() {
            var subject = this.mailInfo.subject;
            return subject;
        },
        
        /**
         * @param type 0-获取 1-刷新 
         * @param callback 转发类型
         */
        getDeliverStatus : function(type, callback){
    		var data = {};
    		if(type == 0){
    			data.tid = this.mailInfo.tid;
    		}else{
    			//data.mid = this.mailInfo.tid;
    			data.tid = this.mailInfo.tid;
    		}
    		data.sort = 0;
    		data.start = 0;
    		data.total = 50;
    		this.callApi("mbox:getDeliverStatus", data, function(res) {
    			if(callback){
    				callback(res);
    			}
	        });
        },
        /*对请求返回的投递状态进行修正：如果部分收件人的发信状态没有返回来，则默认是发送中*/
		setDefaultDeliverStatus : function(DeliverStatusResponse, arrReciver){
		     if(DeliverStatusResponse != undefined && DeliverStatusResponse.length >0 && typeof(DeliverStatusResponse[0].tos)!="undefined"){
		         DeliverStatusResponse=DeliverStatusResponse[0].tos;
		     }else{
		        DeliverStatusResponse=[];
		     }
		     var added = [];
		     if(DeliverStatusResponse.length<arrReciver.length){
		           for(var j=0;j<arrReciver.length;j++){
		                var  to=arrReciver[j];
		                var isFound=true;
		                if(DeliverStatusResponse.length==0)
		                    isFound=false;
		                    
		                for(var k=0;k<DeliverStatusResponse.length;k++){
		                    if($Email.getEmail(arrReciver[j]) == $Email.getEmail(DeliverStatusResponse[k]["mail"]) || arrReciver[j].indexOf(DeliverStatusResponse[k]["mail"])>-1){
		                        isFound=true;
		                        break;
		                    }
		                    if(k==DeliverStatusResponse.length-1){
		                         isFound=false;
		                    } 
		                }
		                if(!isFound){
		                   var obj={
		                    'lastDate':new Date(),
		                    'state':0, //正在投递中
		                    'mail': $T.Xml.encode(arrReciver[j])
		                  };
		                  added.push(obj);  
		              }
		          }
		          DeliverStatusResponse = DeliverStatusResponse.concat(added); 
		    }
		    var ret = [{tos:DeliverStatusResponse}];
		    return ret;
		},
		/*获取邮件投递状态详细信息*/
        // todo 直接从读信取
	    getDeliverDetailStatusHtml : function (DeliverStatusResponse) {
	        if (!DeliverStatusResponse)
	            return;
	        if (typeof (DeliverStatusResponse.errorCode) != "undefined") {
	            return;
	        }
	        DeliverStatusResponse = DeliverStatusResponse[0].tos;
	        var htmlCode = [];
	        //详细状态
	        var sentState = {
	            state_0: "投递中",
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
	        };
	        var l = DeliverStatusResponse.length;
	        var htmlHeader = '<table class="mail-tdzt">\
	              <caption id="trStatusHeader"  style="display:none">\
	              <span>发送详情：</span><a hideFocus="1" id="refreshStatus" href="javascript:successView.refreshDeliverStatusTable()">[刷新状态]</a>\
	              </caption>\
	              <thead>\
	                <tr>\
	                  <th class="t1">收件人</th>\
	                  <th class="t2">投递状态</th>\
	                  <th class="t3">时间</th>\
	                </tr>\
	              </thead>\
	              <tbody>';
	        htmlCode.push(htmlHeader);
	        for (var i = 0; i < l; i++) {
	            //收件人
	            var obj = DeliverStatusResponse[i];
	            htmlCode.push("<tr><td>");
	            var to = obj["mail"].replace(/</g, '&lt;').replace(/>/g, '&gt;');
	            htmlCode.push(to);
	            htmlCode.push("</td>");
	            //投递状态
	            htmlCode.push('<td title="');
	            var status = sentState["state_" + obj.state]; //投递状态
	            if (status == undefined) {
	                status = sentState["state_0"]
	            }
	            var label = status.toString();
	            var mailDomain = top.$App.getMailDomain();
	            if (to.indexOf(mailDomain) > -1) {
	            	if (obj.state==100) {
	            		label = "已投递到对方邮箱";
	            	}
	            }
	            htmlCode.push(label + '"') //增加title
	
	            if (label.indexOf("失败") > -1) {
	                htmlCode.push(' class="error" >');
	            } else {
	                htmlCode.push('>');
	            }
	            htmlCode.push(label);
	            htmlCode.push('</td>');
	            //time
	            htmlCode.push('<td>');
	            //格式化日期
	            //var date = obj["lastDate"]; //如果默认的数据，则是日期类型，但从RM返回来的是number
	            var date = obj["lastTime"];
	            if (typeof (date) == "number"){
	            	date = new Date(date * 1000);
	            }
	            console.log(date);
	            result = $Date.format("yyyy年MM月dd日(星期Week)Hour:mm", date);
	            result = result.replace(/Week/, ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]);
	
	            var h = date.getHours();
	            result = result.replace(/Hour/, h)
	            htmlCode.push(result);
	            htmlCode.push('</td></tr>');
	        }
	        //footer
	        htmlCode.push('</tbody></table>');
	        return htmlCode.join("");
	    },
	    // 显示添加联系人到通讯录
	    showAddContacts : function() {
            var addrList = this.getReceversArray();

			//在rm环境下，数组 addrList 的元素可能为数组，Utils.parseSingleEmail方法只接收字符串，需要在这里提取 --add by YangShuangxi, 2010/02/03
			var getStr = function( obj ) {
				while( !obj.replace ){
					if( obj.length == 0 ) return "";
					obj = obj[0];
				}
				return obj||"";
			};
	        for(var i = 0,len = addrList.length; i < len; i++) {
				var contact = getStr(addrList[i]);
				if(contact){
					var obj = $TextUtils.parseSingleEmail(contact);
					if(obj){
						addrList[i] = obj;
					}
				}else{
					addrList.splice(i, 1);
					i--;
				}
	        }
			var paraObj = {
	            type: "email",
	            container: document.getElementById("divSaveToAddr"),
	            emails: addrList
	        };
	        // todo
	        // top.Contacts.createAddContactsPage(paraObj);
	    },
        /**
        *获取SID值
        */
        getSid: function () {
            var sid = top.$App.getSid();
            return sid;
        }
    }));
})(jQuery,Backbone,_,M139);