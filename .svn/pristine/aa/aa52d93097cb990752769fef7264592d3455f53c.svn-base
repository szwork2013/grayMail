
(function (jQuery, _, M139) {
    /**
	 * @namespace
	 * 懒人贺卡
	 */
    M139.namespace("M2012.LazyCard.Model", Backbone.Model.extend({
        defaults: {
            cardIndex: 0,
            resourceUrl:/10086ts/.test(top.location.host)?"http://g2.mail.10086ts.cn/CardUpload/":"http://images.139cm.com/cximages/card/",
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
            systemMails: ["beijing10086@bj.chinamobile.com", "mail139@139.com", "mail139_holiday@139.com", "port@139.com", "tixing@139.com", "mail139_vip@139.com", "care@139.com", "port@139.com", "10086@cq.chinamobile.com", "10086@gd.chinamobile.com", "10086@gs.chinamobile.com", "10086@gx.chinamobile.com", "10086@gz.chinamobile.com", "10086@ha.chinamobile.com", "10086@hl.chinamobile.com", "10086@jl.chinamobile.com", "10086@js.chinamobile.com", "10086@jx.chinamobile.com", "10086@ln.chinamobile.com", "10086@nm.chinamobile.com", "10086@nx.chinamobile.com", "10086@qh.chinamobile.com", "10086@sc.chinamobile.com", "10086@sd.chinamobile.com", "10086@sn.chinamobile.com", "10086@sx.chinamobile.com", "10086@tj.chinamobile.com", "10086@xj.chinamobile.com", "10086@xz.chinamobile.com", "10086@yn.chinamobile.com", "10086@zj.chinamobile.com"]
        },
        initOwnAccount: function () { //得到自己的账号  
            var self = this;
            var cardConfig = self.get("cardConfig");
            var mailDomain = top.$App.getMailDomain(); //mail域名
            var selfPhoneNo = top.$User.getUid().substring(2);
            cardConfig.arrOwnAccount = new Array();
            var aliasName = top.$User.getAliasName('common'); //别名  example@139.com
            if (aliasName) cardConfig.arrOwnAccount.push(aliasName);
            var prePhoneMail = selfPhoneNo + "@" + mailDomain;
            if (prePhoneMail) cardConfig.arrOwnAccount.push(prePhoneMail);
            cardConfig.selfPhoneNo = selfPhoneNo;
        },
        /*
		 *获取联系人：依次从紧密联系人、最近联系人、所有联系人取得联系人并集
		 *其中依次检测：非本人邮箱手机号码检测，非系统邮箱检测
		 */
        initContacts: function () {
            var self = this;
            var cardConfig = self.get("cardConfig");
            var contactData = {};
            $.extend(contactData, top.$App.getModel("contacts").attributes.data);
            var arrContant = new Array();
            var count = 0;
            var arrTmp = [];
            var latestContacts = contactData.lastestContacts; 	//最近联系人
            var closeContacts = contactData.closeContacts; 	//紧密联系人
            var totalContacts = contactData.contacts; 		//所有联系人

            /*
			*加载自己的帐号
			*/
            self.initOwnAccount();
            /*
			* 紧密联系人
			*/
            if (closeContacts && closeContacts.length > 1) {
                var arrTmp = closeContacts;
                for (var i = 0; i < arrTmp.length; i++) {
                    if (arrTmp[i].AddrType && $.trim(arrTmp[i].AddrType) == "E") {
                        var mail = $.trim(arrTmp[i].AddrContent);
                        if (mail && _filterSelfContact(mail) && _filterSysMails(mail)) { 	//过滤自己账号
                            arrContant[count] = {
                                mail: mail,
                                name: $.trim(arrTmp[i].AddrName)
                            };
                            count++;
                            if (count >= 50) {
                                break;
                            }
                        }
                    }
                }
            }
            /*
			* 最近联系人
			*/
            if (arrContant.length < 50) {
                if (latestContacts && latestContacts.length > 0) {
                    arrTmp = latestContacts;
                    for (var i = 0; i < arrTmp.length; i++) {
                        var mail = $.trim(arrTmp[i].AddrContent);
                        if (mail && _filterSelfContact(mail) && _filterRepeat(mail) && _filterSysMails(mail)) { //过滤自己账号
                            arrContant[count] = {
                                mail: mail,
                                name: $.trim(arrTmp[i].AddrName)
                            };
                            count++;
                            if (count >= 50) {
                                break;
                            }
                        }
                    }
                }
            }
            /*
			* 所有联系人
			*/
            if (arrContant.length < 50) {
                arrTmp = totalContacts;
                if (arrTmp && arrTmp.length > 0) {
                    for (var i = 0; i < arrTmp.length; i++) {
                        var mail = $.trim(arrTmp[i].FamilyEmail);
                        if (mail && _filterSelfContact(mail) && _filterRepeat(mail) && _filterSysMails(mail)) { //过滤自己和系统账号
                            arrContant[count] = {
                                mail: mail,
                                name: $.trim(arrTmp[i].AddrFirstName)
                            };
                            count++;
                            if (count >= 50) {
                                break;
                            }
                        }
                    }
                }
            }


            function _filterSelfContact(mail) { //是否为自己账号
                if (cardConfig.arrOwnAccount) {
                    for (var i = 0; i < cardConfig.arrOwnAccount.length; i++) {
                        if (cardConfig.arrOwnAccount[i] == mail) {
                            return false;
                        }
                        //屏蔽原139邮箱手机号码相同的邮箱针对自己  
                        //例如：联系人名：A Email:B 手机:C
                        //而原来139邮箱的邮箱地址又是C@139.com  屏蔽此类邮箱
                        if (cardConfig.selfPhoneNo) {
                            var contacts = top.$App.getModel("contacts").getContactsByEmail(mail);
                            if (contacts && contacts.length > 0 && contacts[0].MobilePhone && String(cardConfig.selfPhoneNo).substring(2).indexOf(contacts[0].MobilePhone) > -1) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            }

            function _filterRepeat(mail) {
                if (arrContant) {
                    for (var i = 0; i < arrContant.length; i++) {
                        if (arrContant[i].mail == mail) {
                            return false;
                        }
                    }
                }
                return true;
            }

            function _filterSysMails(mail) {
                var sysMails = self.get("systemMails");
                for (var i = 0; i < sysMails.length; i++) {
                    if (sysMails[i] == mail) {
                        return false;
                    }
                }
                return true;
            }
            if (arrContant.length) {
                cardConfig.arrContant = arrContant.slice(0);//将帐号缓存
            } else {
                cardConfig.arrContant = [];
                cardConfig.noContact = true;
            }
        },
        sendCard: function (callback) {
            var self = this;
            var cardConfig = self.get("cardConfig");
            top.WaitPannel.show("正在发送...");
            var mailList = cardConfig.cardReceiver.join(',');
            var data = {   //邮件发送数据格式
                attrs: {
                    id: "",
                    mid: "", //后台返回的草稿ID,成功调用存草稿方法后修改该属性
                    messageId: "",
                    account: top.$User.getDefaultSender() || top.$PUtils.mobileMail,//发件人
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
                    requestReadReceipt: 0,//是否需要已读回执
                    inlineResources: 1, //是否内联图片
                    scheduleDate: 0, //定时发信
                    normalizeRfc822: 0,
                    attachments: []//所有附件信息
                },
                action: "deliver",
                returnInfo: 1,
                replyNotify: 0
            }
            $RM.call("mbox:compose&comefrom=5&categroyId=103000000", data, function (res) {
                top.WaitPannel.hide();
                var result = res.responseData;
                if (result.code == "S_OK" && result['var']) {
                    callback(result['var']['tid'])
                } else {
                    top.$Msg.alert('贺卡发送失败');
                    top.ProductFuns.closeLazyCard();
                }
            })

        },
        initCardData: function () {
            var self = this;
            var cardConfig = self.get("cardConfig");
            var mainData = top.$lazycardList || {};
            var list = mainData && mainData.dataList ? mainData.dataList : null;
            var dataLength = list ? list.length : 0;						//列表长度
            var currentIndex = Math.round(Math.random() * 1000) % dataLength;		//计算伪随机使用的贺卡数据下标
            var resourceUrl = this.get('resourceUrl');
            /**
            *加载当前贺卡的初始数据
            */
            
            if (!isNaN(currentIndex)) {
                cardConfig['type'] = mainData['type'];   //贺卡类型
                cardConfig.cardContent = list[currentIndex].blessing;   //祝福语
                cardConfig.cardSwf = resourceUrl + list[currentIndex].path;  //flash路径
                cardConfig.cardName = list[currentIndex].name;  //贺卡标题
                cardConfig.cardImg = resourceUrl + list[currentIndex].thumbPath;  //图片路径
                cardConfig.materId = list[currentIndex]['id'] || '';
                cardConfig.metaSubject = "为您制作的贺卡《" + cardConfig.cardName + "》"  //邮件标题
                cardConfig.behavior = "欢迎页弹出发送贺卡邮件浮层_" + cardConfig.type;  //行为统计
            }
            
            

            var curdata = {
                currentIndex: currentIndex, 				//当前的贺卡
                dataLength: dataLength 					//贺卡的数量
            };
            self.set(curdata);
        }
    }));

})(jQuery, _, M139);