/*处理pns消息
通过pnsResultHandle函数传入pns返回的json报文进行单元测试
例如：
(1)测试新邮件到达通知
$App.getModel("pnsModel").pnsResultHandle({"c":1,"msg":[{"type":70,"topic":"cccc","ctx":{"mailFrom":"铁喜光","imapId":"1327542421","mailSize":"7117","mailMsgId":"44820000095ac54f00000035","mailToAddr":"tiexg@139.com","unKnow":"unKnow","mailAttName":"","mailSenderFrom":"tiexg@139.com","msgContent":"ccccccccccccccc\n铁喜光\n邮箱：13590330157@139.com\n手机：13590330157","msgType":"70","mailFolder":"1"},"isAsk":0,"msgId":"bfe751ced501469daee08c80b5ca0299"}]});
(2)测试红色上角标推送
$App.getModel("pnsModel").pnsResultHandle({"c":1,"msg":[{"type":300,"topic":"null","ctx":"...","isAsk":0,"msgId":"13401410a0ba4848901fe344c16c0d83"}]});

*/
M139.namespace("M2012.Model.Pns", {
    PnsModel: Backbone.Model.extend({
 
        callApi: M139.RichMail.API.call,
        pnsUrl : '/pns/poll?sid=' + top.sid + '&comeFrom=1003', // PNS接口地址负责推送新邮件到前端 add by tkh
        updateMsgStatusUrl : '/subscribe/inner/bis/updateTipsMemcKey?sid='+top.sid, // 更改消息状态
        pnsErrorInterval : 1000*120, // 接口报错后下一次重新调接口的时间间隔
        pnsTimer: null, // 接口报错后需要用定时器再调一次接口，pnsTimer用于报错定时器ID
        //pns推送过来的消息类型
        msgTypes: {
            mailMsg: 70,
            calendarMsg: 100,
            superiorNum: 300,//上标数字
            operateMsg: 1012,
            msgBox:500,
            groupMailMsg : 201 // 群邮件消息
        },
        logger : new top.M139.Logger({
			name : "M2012.Folder.Model.FolderModel"
		}),
        //初始化
        initialize: function () {

            $App.registerModel("pnsModel", this);
        },

    
        // update by tkh  调服务端推送接口取新邮件信息
        startRequestPns: function () {
            var self = this;
            
            var options = {};
            options.method = 'get';
            options.timeout = self.pnsErrorInterval;
            options.error = function(){
            	self.callPns();
            	self.logger.error("newMailArrival callPns error");
            };
            options.ontimeout = function(){
            	self.callPns();
            	self.logger.error("newMailArrival callPns timeout");
            };
            options.isSendClientLog = false;
            
            M139.RichMail.API.call(self.pnsUrl, null, function(e) {
    			var result = e.responseData;
    			if (result) {
    			    //console.log(result);
        			if(result.errorCode){
        				self.callPns();
        				self.logger.error("newMailArrival returndata error", "[pns/poll]", result);
        			}else{
        			    self.pnsResultHandle(result);
        			    $App.trigger("pnsNewArrival",result);//留给以后扩展
        				self.callPns(500);
        				//self.autoReceiveMail();
        			}
        		}else{
        			self.callPns();
        			self.logger.error("newMailArrival returndata error", "[pns/poll]", result);
        		}
	        }, options);
        },

        // 返回之后重新请求接口 add by tkh
        callPns : function(seconds){
        	var self = this;
        	
        	// 判断用户是否登录超时
        	if(top.$App.isSessionOut()){
        		console.log('登录超时！不再请求PNS');
        		return;
        	}
        	
        	if(self.pnsTimer){
        		clearTimeout(self.pnsTimer);
        	}
        	self.pnsTimer = setTimeout(function(){
        	    self.startRequestPns();
        	}, seconds || self.pnsErrorInterval);
        },
        /*
        此函数可用于单元测试
        $App.getModel("pnsModel").pnsResultHandle({"c":1,"msg":[{"type":70,"topic":"cccc","ctx":{"mailFrom":"铁喜光","imapId":"1327542421","mailSize":"7117","mailMsgId":"44820000095ac54f00000035","mailToAddr":"tiexg@139.com","unKnow":"unKnow","mailAttName":"","mailSenderFrom":"tiexg@139.com","msgContent":"ccccccccccccccc\n铁喜光\n邮箱：13590330157@139.com\n手机：13590330157","msgType":"70","mailFolder":"1"},"isAsk":0,"msgId":"bfe751ced501469daee08c80b5ca0299"}]});
        
        */
        pnsResultHandle: function (result) {
            var self = this;
            if (result.c > 0) {   //c代表数量
                // update by xyx 新增推送日历消息
                var msgArr = result.msg;
                for (var i = 0, l = msgArr.length; i < l; i++) {
                    if (msgArr[i].type && (msgArr[i].type == this.msgTypes.mailMsg)) {
                        this.showNewMail(msgArr);
                    } else if (msgArr[i].type && (msgArr[i].type == this.msgTypes.calendarMsg)) {
                        this.showCalendarMsg(msgArr);
                    } else if (msgArr[i].type == this.msgTypes.operateMsg) {
                        this.showOperateTipMsg(msgArr);
                    } else if (msgArr[i].type == this.msgTypes.superiorNum) {
                        this.showSuperiorNum(msgArr);
                    } else if (msgArr[i].type == this.msgTypes.groupMailMsg) {
                        this.showGroupMailMsg(msgArr);
                    }
                }
            } else if (result.c == 0) {
                //console.log('超时返回！autoReceiveMail'); //清理满屏的控制台信息. 控制台输出没有意义,有需要应该上报
                self.logger.debug('超时返回！autoReceiveMail'); //只在测试线输出, 要在现网输出,在控制台输入"top.SiteConfig.isDev=true"并回车
            }
        },
        showNewMail: function (msgArr) {
            var mid = msgArr[0].ctx.mailMsgId;
            var options = { ids: [mid] };
            this.callApi("mbox:getMessageInfo", options, function (e) {
                if (e.responseData && e.responseData["var"]) {
                    var resultNew = e.responseData["var"];

                    $App.getView("folder").model.set("vipMailStats", null);
                    $App.getView("mailbox").model.set("freshMailList", resultNew);

                    $App.trigger("reloadFolder");
                    if ($App.getCurrentTab().name.indexOf("mailbox") >= 0) {
                        $App.trigger("mailboxDataChange", { render: true }); // 刷新邮件列表
                    }

                    $App.trigger("newMailArrival", resultNew); // 显示右下角邮件到达tip弹窗
                    $App.trigger("msgBoxMailArrival",resultNew); //显示消息提醒盒子的红点
                }
            });

        },

        // add by xyx   将pns推送过来的字符串(msgContent)转换为对象  20131010
        showCalendarMsg: function(msgArr){
            for(var i= 0, l=msgArr.length; i<l; i++){
                var strContent = msgArr[i].ctx.msgContent;
                var from = msgArr[i].ctx.mailFrom;
                var objContent = false;
                try {
                    objContent = JSON.parse(strContent);
                } catch (e) {
                }
                if (!objContent) {
                    try {
                        objContent = eval("("+strContent+")");
                    } catch (e) {
                    }
                }

                if (objContent) {
                    objContent.fromName = from;
                    $App.trigger("newCalendarMsg", objContent);
                } else {
                    top.M139.Logger.getDefaultLogger().error("日历通知tip报文异常", strContent);
                }
            }


        },

        showMsgBoxHot:function(msgArr){
            var self = this;
            var msgLen = 0;
            var mailLen = 0;
            var transfer = {  //只接收的消息
                groupmail_gin: 'addrGroupinvite',
                addr_mkpn: 'addrMaykown',
                calendar_cain: 'calendarInvite',
                calendar_cen: 'calendarActive',
                netdisk_tsen: 'cabinet',
                cpo_cpopu: 'myMagazine',
                cpo_cponm: 'magazineHome'
            };

            M139.RichMail.API.call("msg:getRemindMsg",{},function(response){
                var res = response.responseData;
                //处理消息盒子的消息
                if(res.code == 'S_OK'){
                    for(var i=0; i<res['var'].length; i++){
                        var msg = res['var'][i]
                        if(transfer[msg['msgType']] && msg.msgContent>0){
                            msgLen ++;
                        }
                    }
                }
                //如果有消息，红点亮
                if(msgLen){
                    top.$Evocation.msgBoxHot.show();
                }
            });
        },


        msgBoxHasNewMail:function(){
            //首次登录
            if(typeof $Evocation.hasNewMail == 'undefined'){
                return $User.getUnreadMessageCount();
            }else if($Evocation.hasNewMail){
                return 1
            }else{
                return 0
            }
        },

        showOperateTipMsg: function(msgArr) {
            for(var i= 0, l=msgArr.length; i<l; i++){
                var strContent = msgArr[i].ctx;
                var objContent = false;
                try {
                    objContent = JSON.parse(strContent);
                } catch (e) {
                }
                if (!objContent) {
                    try {
                        objContent = eval("("+strContent+")");
                    } catch (e) {
                    }
                }

                if (objContent) {
                    top.operatetipsview && top.operatetipsview.showTips([objContent]);
                } else {
                    top.M139.Logger.getDefaultLogger().error("智能运营与PNS对接报文异常", strContent);
                }
            }
        },
        
        // 修改云邮局消息状态
        updateMpostMsgStatus : function(){
        	var self = this;
        	
        	var data = {status : 2};
            M139.RichMail.API.call(self.updateMsgStatusUrl, data, function(result) {
    			var responseData = result.responseData;
                if (responseData && responseData.resultCode == 0) {
                	console.log('Function[updateMpostMsgStatus] update pushMsg.status suc!');
                } else {
                    console.log(result);
                	self.logger.error('Function[updateMpostMsgStatus] update pushMsg.status error!');
                }
	        }, {requestDataType: "Object2JSON"});
            
			mpdifyTopMsgStatus();
			
			function mpdifyTopMsgStatus(){
				var pushMsg = top.$App.pushMpostMsg;
	        	if(pushMsg){
	        		pushMsg.msg.status = data.status;
	        	}
			}
        },
        
        showSuperiorNum: function (msgArr) {
        	var self = this;
        	
        	//给目标结点加红点上标
            function addRedSuperior(target) {
            	// add by tkh
                target.addClass('p_relative');
            	
                if (target.children().length == 0) {
                    target.append('<i class="i-red_dot"></i>');
                    $(target).click(function () { //点击后红点消失
                        $(this).find("i").remove();
                    });
                }
            }
        	
            if (msgArr[0]) {
                
                // add by tkh 将云邮局消息保存到顶层，供云邮局内部判断我的报刊是否显示角标使用，避免云邮局内部发http请求取消息
            	var pushMpostMsg = M139.JSON.tryEval(msgArr[0].ctx);
            	var status = pushMpostMsg && pushMpostMsg.msg.status;
            	if(status != 4){
            		top.$App.pushMpostMsg = pushMpostMsg;
            		top.$App.trigger('renderNewMagazineIcon');
            	}
            	if(status == 1){
            		// addRedSuperior($("#toptab_googSubscription a")); // 由于邮箱要推出消息盒子，顶层的红点暂时屏蔽掉
                
	                // 通过once绑定事件，保证只执行一次
	                top.$App.once('updateMpostMsgStatus', function(){
	                	self.updateMpostMsgStatus();
	                });
            	}
            }
        },
        /**
         * 群邮件中的消息推送
         * add by lc
         * @param msgArr
         */
        showGroupMailMsg : function(msgArr) {
            if (this.lastMsgId == msgArr[0].msgId)
            {
                // 如果相等, 表示重复推送了, 丢弃
                console.warn && console.warn("the same msgid");
                return;
            }

            // 保留上次的消息ID, 防止重复
            this.lastMsgId = msgArr[0].msgId;

            var content = "";
            try {
                content = JSON.parse(msgArr[0].ctx);
            } catch (e) {
                if (!content) {
                    try {
                        // 某些IE下不支持JSON.parse
                        content = eval("("+msgArr[0].ctx+")");
                    } catch (e) {
                    }
                }
                console.warn && console.warn("json parse exception...");
            }

            if (Number(content.type) == 2) {
                // 处理群邮件新消息
                console.log && console.log(content);
                top.$App && top.$App.trigger("changeGroupMsgSum", content);
            }
        }
    })
});
