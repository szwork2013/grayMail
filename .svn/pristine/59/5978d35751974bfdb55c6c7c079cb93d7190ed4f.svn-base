/**
*  懒人贺卡model
*  封装数据
*  1:贺卡数据   直接从配置的文件进行读取。stop.$App.LazyPeopleOfCardsConfig中
*  cardConfig
*  [{
*       type: "春节",                                 //分类
*       materId: "27",                                //分类ID,
*       fromSubject: "为您制作的贺卡《{0}》",         //来源标题
*       behavior: "欢迎页弹出发送贺卡邮件浮层_春节",
*       userCustomeKey: "2013cj",
*       //贺卡数据列表
*       dataList: [{
*           //贺卡名称
*           cardName: "春节乐翻天",
*           //贺卡内容
*           cardContent: "新年到放鞭炮\r\n拱拱手祝福好\r\n身体棒乐陶陶\r\n送旧符展新貌\r\n春节乐天天笑！",
*           //贺卡flash路径
*           cardFlash: "http://images.139cm.com/cximages/card/FlashCard/mnhpurgc.swf",
*           //贺卡图片路径 
*           cardImg: "http://images.139cm.com/cximages/card/FlashCard/mmk92vh3.jpg"
*       },{},{}...]
*   }, {
*       //分类
*       type: "元宵节",
*       //分类ID,
*       materId: "28",
*        //来源标题
*        fromSubject: "为您制作的贺卡《{0}》",
*        behavior: "欢迎页弹出发送贺卡邮件浮层_元宵",
*        userCustomeKey: "2013yx",
*        //贺卡数据列表
*        dataList: [{
*            //贺卡名称
*            cardName: "元宵节快乐",
*            //贺卡内容
*            cardContent: "吃一碗汤圆，\r\n愿它能帮你褪去世事的繁杂，\r\n忘掉生活的烦恼，\r\n快乐到永远！\r\n元宵节快乐！",
*            //贺卡flash路径
*            cardFlash: "http://images.139cm.com/cximages/card/FlashCard/yby15nm6.swf",
*            //贺卡图片路径 
*            cardImg: "http://images.139cm.com/cximages/card/FlashCard/ycvhxjle.jpg"
*        },{},{}...]
*    }]
*
*
*  2:联系人数据  从top.$App.getModel("contacts").get("data")中去筛选得到
*   
*   [{
	AddrContent: "xxx@139.com"
	AddrName: "xxxx"
	AddrType: "E"
	SerialId: "1115333200"
	}]
*   从其中处理过滤非自己、非设置了自己手机号码、非系统的邮箱，之后得到数组
*   arrContant: [],		//筛选的前50联系人
*   [{
		name: 联系人姓名
		mail: 邮箱
	},{},{}]
*   
*
*   主要功能：
*   1：读取懒人贺卡数据并初始化
*   2：筛选有效联系人邮箱数据
*   3: 发送贺卡邮件
*/

/**   
 * @fileOverview 懒人贺卡
 */
(function(jQuery, _, M139) {
	/**
	 * @namespace
	 * 懒人贺卡
	 */
	M139.namespace("M2012.LazyCard.Model", Backbone.Model.extend({
		defaults: {
			cardConfig: {
				zfIsClose: false,		//弹出贺卡是否关闭
				type: "",				//节日类别 例：春节
				cardName: "",			//贺卡名称 例：《新年贺喜》
				materId: 0,				//暂时无用，可作为扩展，可删除
				contactVarHtml: "",		//联系人容器
				cardVarHtml: "",		//贺卡容器
				cardContent: "",		//贺卡正文
				cardSwf: "",			//贺卡flash
				cardImg: "",			//贺卡图片
				metaSubject: "",		//原始贺卡源标题
				cardSubject: "",		//发送贺卡标题
				cardReceiver: "",		//贺卡接收者
				mailVarHtml: "",		//邮件贺卡容器
				behavior: "",			//行为统计ID
				arrContant: null,		//筛选的前50联系人   
				arrOwnAccount: [],		//自己的帐号  1:别名@139.com 2:手机号码@139.com 3:设置手机号码是自己的邮箱@139.com 例:设置自己号码为企业邮箱的邮箱
				selfPhoneNo: 0			//自己的手机号
			},
			systemMails:["beijing10086@bj.chinamobile.com", "mail139@139.com", "mail139_holiday@139.com", "port@139.com", "tixing@139.com", "mail139_vip@139.com", "care@139.com", "port@139.com", "10086@cq.chinamobile.com", "10086@gd.chinamobile.com", "10086@gs.chinamobile.com", "10086@gx.chinamobile.com", "10086@gz.chinamobile.com", "10086@ha.chinamobile.com", "10086@hl.chinamobile.com", "10086@jl.chinamobile.com", "10086@js.chinamobile.com", "10086@jx.chinamobile.com", "10086@ln.chinamobile.com", "10086@nm.chinamobile.com", "10086@nx.chinamobile.com", "10086@qh.chinamobile.com", "10086@sc.chinamobile.com", "10086@sd.chinamobile.com", "10086@sn.chinamobile.com", "10086@sx.chinamobile.com", "10086@tj.chinamobile.com", "10086@xj.chinamobile.com", "10086@xz.chinamobile.com", "10086@yn.chinamobile.com", "10086@zj.chinamobile.com"]
		},
		initOwnAccount: function() { //得到自己的账号  
			var self = this;
			var cardConfig 	= self.get("cardConfig");
			var mailDomain 	= top.$App.getMailDomain(); //mail域名
			var selfPhoneNo = top.$User.getUid().substring(2);
			cardConfig.arrOwnAccount = new Array();
			var aliasName 	= top.$User.getAliasName('common'); //别名  example@139.com
			if(aliasName) cardConfig.arrOwnAccount.push(aliasName);
			var prePhoneMail = selfPhoneNo + "@" + mailDomain;
			if(prePhoneMail) cardConfig.arrOwnAccount.push(prePhoneMail);
			cardConfig.selfPhoneNo = selfPhoneNo;
		},
		/*
		 *获取联系人：依次从紧密联系人、最近联系人、所有联系人取得联系人并集
		 *其中依次检测：非本人邮箱手机号码检测，非系统邮箱检测
		 *
		 */
		initContacts: function() {
			var self = this;
			var cardConfig 		= self.get("cardConfig");
			var contactData 	= {};
			$.extend(contactData, top.$App.getModel("contacts").attributes.data); 
			var arrContant 		=  new Array();
			var count 			= 0;
			var arrTmp 			= [];
			var latestContacts 	= contactData.lastestContacts; 	//最近联系人
			var closeContacts	= contactData.closeContacts; 	//紧密联系人
			var totalContacts 	= contactData.contacts; 		//所有联系人

			/*
			*加载自己的帐号
			*/
			self.initOwnAccount();
			/*
			* 紧密联系人
			*/
			if(closeContacts && closeContacts.length > 1) { 
				var arrTmp = closeContacts;
				for(var i = 0; i < arrTmp.length; i++) {
					if(arrTmp[i].AddrType && $.trim(arrTmp[i].AddrType) == "E") {
						var mail = $.trim(arrTmp[i].AddrContent);
						if(mail && _filterSelfContact(mail) && _filterSysMails(mail)) { 	//过滤自己账号
							arrContant[count] = {
								mail: mail,
								name: $.trim(arrTmp[i].AddrName)
							};
							count++;
							if(count >= 50) {
								break;
							}
						}
					}
				}
			}
			/*
			* 最近联系人
			*/
			if(arrContant.length < 50) {
				if(latestContacts && latestContacts.length > 0) {
					arrTmp = latestContacts;
					for(var i = 0; i < arrTmp.length; i++) {
						var mail = $.trim(arrTmp[i].AddrContent);
						if(mail && _filterSelfContact(mail) && _filterRepeat(mail) && _filterSysMails(mail)) { //过滤自己账号
							arrContant[count] = {
								mail: mail,
								name: $.trim(arrTmp[i].AddrName)
							};
							count++;
							if(count >= 50) {
								break;
							}
						}
					}
				}
			}
			/*
			* 所有联系人
			*/
			if(arrContant.length < 50) {
				arrTmp = totalContacts;
				if(arrTmp && arrTmp.length > 0) {
					for(var i = 0; i < arrTmp.length; i++) {
						var mail = $.trim(arrTmp[i].FamilyEmail);
						if(mail && _filterSelfContact(mail) && _filterRepeat(mail) && _filterSysMails(mail)) { //过滤自己和系统账号
							arrContant[count] = {
								mail: mail,
								name: $.trim(arrTmp[i].AddrFirstName)
							};
							count++;
							if(count >= 50) {
								break;
							}
						}
					}
				}
			}
			

			function _filterSelfContact(mail) { //是否为自己账号
				if(cardConfig.arrOwnAccount) {
					for(var i = 0; i < cardConfig.arrOwnAccount.length; i++) {
						if(cardConfig.arrOwnAccount[i] == mail) {
							return false;
						}
						//屏蔽原139邮箱手机号码相同的邮箱针对自己  
						//例如：联系人名：A Email:B 手机:C
						//而原来139邮箱的邮箱地址又是C@139.com  屏蔽此类邮箱
						if(cardConfig.selfPhoneNo) {
							var contacts = top.$App.getModel("contacts").getContactsByEmail(mail);
							if(contacts && contacts.length > 0 && contacts[0].MobilePhone && String(cardConfig.selfPhoneNo).substring(2).indexOf(contacts[0].MobilePhone) > -1) {
								return false;
							}
						}
					}
				}
				return true;
			}

			function _filterRepeat(mail) {
				if(arrContant) {
					for(var i = 0; i < arrContant.length; i++) {
						if(arrContant[i].mail == mail) {
							return false;
						}
					}
				}
				return true;
			}

			function _filterSysMails(mail) {
				var sysMails = self.get("systemMails");
				for(var i = 0; i < sysMails.length; i++) {
					if(sysMails[i] == mail) {
						return false;
					}
				}
				return true;
			}

			cardConfig.arrContant = arrContant.slice(0);//将帐号缓存
		},
		sendCard: function() {
			var self = this;
			var cardConfig = self.get("cardConfig");
				var panel = self.get("tempPanel");
				if(panel) panel.close();
				top.WaitPannel.show("正在发送...");
				var mailList = this.parseEmail(cardConfig.cardReceiver);
				for(var i = 0, l = mailList.length; i < l; i++) {
					mailList[i] = mailList[i].all;
				}
				mailList = mailList.join(",");
				var data = {   //邮件发送数据格式
					attrs: {
							id: "",
				        	mid : "", //后台返回的草稿ID,成功调用存草稿方法后修改该属性
							messageId: "",
				        	account: top.$User.getDefaultSender()|| top.$PUtils.mobileMail,//发件人
					        to: mailList,//收件人地址‘,’号分隔
					        cc: "",//抄送人地址
					        bcc: "",//密送人地址
					        showOneRcpt: 1, //是否群发单显1 是 0否 
					        isHtml: 1,
					        subject: cardConfig.cardSubject,
					        content: cardConfig.mailVarHtml,
					        priority: 3, //是否重要
					        signatureId: 0,//使用签名档
					        stationeryId: 0,//使用信纸
					        saveSentCopy: 1,//发送后保存副本到发件箱
					        requestReadReceipt : 0,//是否需要已读回执
					        inlineResources: 1, //是否内联图片
					        scheduleDate: 0, //定时发信
					        normalizeRfc822: 0,
					        attachments: []//所有附件信息
					},
					action: "deliver",
					returnInfo: 1,
					replyNotify: 0
				}
				$RM.call("mbox:compose&comefrom=5&categroyId=103000000", data, function(res) {
					var rs = res && res.responseData ? res.responseData : null;
							result(rs);
			    },{error: function(){ alert("连接失败");top.WaitPannel.hide(); } });
				
				function result(res){
					if(res && res.code && res.code == "S_OK"){  //发送成功
						self.trigger("successRender",res);
					}else{										//发送失败
						self.trigger("errorRender",res);
					}
				}

		},
		initCardData: function () {
		    
		        var self = this;
		        var cardConfig 	 = self.get("cardConfig");
				var cardsConfig  = top.$App.LazyPeopleOfCardsConfig || null,
				 /**
                 *初始化当前贺卡的基本数据
                 */
                	flashDomStr	 = "<embed id='{0}' width='200' height='150' style='border: 1px solid green; width: 200px; margin-right: 5px; height: 150px; float: left;' src='{1}' type='application/x-shockwave-flash'>",
                    //问题
                    cardCfgIdx = self.get("cardCfgIdx"),
                	mainData = top.$App.LazyPeopleOfCardsConfig[cardCfgIdx] || {},

                    list 		 = mainData && mainData.dataList ? mainData.dataList : null,
                    dataLength 	 = list ? list.length : 0,							//列表长度
                    currentIndex = Math.round(Math.random() * 10) % dataLength;		//计算伪随机使用的贺卡数据下标
                 /**
                 *加载当前贺卡的初始数据
                 */
                 if(!isNaN(currentIndex)){
                 cardConfig.type 		= mainData.type;
                 cardConfig.materId 	= mainData.materId;
                 cardConfig.cardContent = list[currentIndex].cardContent;
                 cardConfig.cardSwf 	= list[currentIndex].cardFlash;
                 cardConfig.cardName 	= list[currentIndex].cardName;
                 cardConfig.cardImg 	= list[currentIndex].cardImg;
                 cardConfig.metaSubject = mainData.fromSubject.format(cardConfig.cardName);
                 cardConfig.behavior 	= mainData.behavior;
                 }
                 
                 var data = {
                 	currentIndex:currentIndex, 				//当前的贺卡
                 	dataLength:dataLength, 					//贺卡的数量
                 	userCustomeKey:mainData.userCustomeKey 	//记录的key值
                 };
                 self.set(data);
		},
		/*封装参数
		*@param  String   
		*将此次弹出的贺卡对应key进行保存。Key值保存形式为:lazyCard=2013yx,2013gq,2013zq...... 
		*例：此次的贺卡对应key为2013cy,如果弹出之后会在lazyCard
		**/		
		packageParam: function(param) {
            var self = this;
            var currentParam = self.get("lazycard").split(",");
            if(param) {
                if(currentParam && currentParam.length > 0 && currentParam instanceof Array) {
                    for(var i = 0; i < currentParam.length; i++) {
                        if(currentParam[i] == param) {
                            return currentParam.join(",");
                        }
                    }
                    currentParam.push(param);
                    return currentParam.join(",");
                } else {
                    currentParam = param;
                }
            }
            return currentParam;
        },
		parseEmail: function(text) {
			var reg 	= /(?:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}|(?:"[^"]*")?\s?<[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}>)\s*(?=;|,|，|；|$)/gi;
			var regName = /^"([^"]+)"|^([^<]+)</;
			var regAddr = /<?([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})>?/i;
			var matches = text.match(reg);
			var result 	= [];
			if(matches) {
				for(var i = 0, len = matches.length; i < len; i++) {
					var item = {};
					item.all = matches[i];
					var m = matches[i].match(regName);
					if(m) item.name = m[1];
					m = matches[i].match(regAddr);
					if(m) item.addr = m[1];
					if(item.addr) {
						item.account = item.addr.split("@")[0];
						item.domain  = item.addr.split("@")[1];
						if(!item.name) item.name = item.account;
						result.push(item);
					}
				}
			}
			return result;
		}
	}));

})(jQuery, _, M139);