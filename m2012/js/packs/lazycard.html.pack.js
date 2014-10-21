
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

//懒人贺卡 新版

M139.namespace('M2012.LazyCard.View', Backbone.View.extend({

    initialize: function (param) {
        this.model = new M2012.LazyCard.Model();
        this.loadData();
        this.addEvent();
    },

    //加载数据以及容器
    loadData: function () {
        var self = this;
        self.model.initContacts();  //初始化联系人数据
        self.model.initCardData();  //初始化贺卡数据
        self.loadContactHtml();     //组装联系人容器
        self.loadCardHtml();        //组装贺卡容器
    },

    //事件绑定
    addEvent: function () {
        var self = this;
        //展开，收拢联系人
        $('#btn_more').click(function () {
            var more = !$(this).hasClass('on');
            if (more) {
                $(this).addClass('on');
                $('#receiver').parent().addClass('addrMore').find('tr').show();
                $('.sleeperCard').hide();
            } else {
                $('#receiver').parent().removeClass('addrMore');
                $('#receiver').find('tr:gt(0)').hide();
                $('.sleeperCard').show();
                $(this).removeClass('on');
            }
        });

        //关闭对话框
        $('#close').click(function () {
            top.ProductFuns.closeLazyCard();
        });

        //显示发送人个数
        $('label,input').click(function () {
            var num = $('input:checked').length;
            $('#friendNum').text(num);
        });

        //换一张贺卡
        $("#changeCard").click(function () {
            var currentIndex = parseInt(self.model.get("currentIndex")) || 0;
            var dataLength = parseInt(self.model.get("dataLength")) || 0;

            currentIndex++;

            if (currentIndex >= dataLength) {
                currentIndex = 0;
            }
            /*
            *更换贺卡后，进行数据更新。
            */
            var cardData = top.$lazycardList.dataList[currentIndex];

            var cardConfig = self.model.get("cardConfig");
            var resourceUrl = self.model.get('resourceUrl')

            cardConfig.materId = cardData['id'];          //贺卡ID
            cardConfig.cardContent = cardData.blessing;   //祝福语
            cardConfig.cardSwf = resourceUrl + cardData.path;  //flash路径
            cardConfig.cardName = cardData.name;  //贺卡标题
            cardConfig.cardImg = resourceUrl + cardData.thumbPath;  //图片路径
            cardConfig.metaSubject = "为您制作的贺卡《" + cardConfig.cardName + "》"  //邮件标题

            $("#blessing").val(cardConfig.cardContent);
            $('#cardFlash').html("<embed width='264' height='199' style='width: 264px;height: 199px;' src='" + cardConfig.cardSwf + "' type='application/x-shockwave-flash'>");
            self.model.set("currentIndex", currentIndex);
        });

        //发送贺卡
        $('#sendCard').click(function () {
            var cardConfig = self.model.get("cardConfig");
            //行为统计
            //top.addBehavior(cardConfig.behavior);
            top.addBehaviorExt({ actionId: 10347, thingId: 6 })
            //组装联系人
            var receiver = [];
            if (cardConfig.noContact) {
                var receiver = $('#customReceiver').val();
                if (!top.$Email.isEmail(receiver)) {
                    top.$Msg.alert('请输入合法邮箱地址');
                    return;
                }
                cardConfig.cardReceiver = [receiver];
            } else {
                $('input:checked').each(function (i, v) {
                    if ($(this).attr('addr')) {
                        receiver.push($(this).attr('addr'));
                    }
                })
                if (receiver.length == 0) {
                    top.$Msg.alert('请选择联系人');
                    return;
                }
                cardConfig.cardReceiver = receiver;
            }
            //组装发送的html
            self.loadMailHtml();           //将当前待发送贺卡数据进行组装
            self.model.sendCard(function (res) {
                self.sendCallback(res);
            });
        });    
    },

    //贺卡成功发送回调函数
    sendCallback: function (tid) {
        var self = this;
        var cardConfig = self.model.get("cardConfig");
        top.$App.show('card_success', "&lazyCard=1&isSave=1&defineTime=0&tid=" + tid + "&materId=" + cardConfig.materId + "&rnd=" + Math.random());
        setTimeout(function () {
            top.ProductFuns.closeLazyCard();  //延时跳转，避免后面的代码出现不能执行已释放代码的异常           
        }, 100);
    },    

    //组装发送联系人数据及html
    loadContactHtml: function () {
        var self = this;
        var cardConfig = self.model.get("cardConfig");
        var contactVarHtml = [];
        var count = 0;
        var strChecked = "checked";
        var receiveMail = "",           //sun:接受人邮箱
            currContant = null;         //sun:当前联系人数据
        /*
        *  组装联系人容器
        */
        for (var i = itemIdx = 0, contantLength = cardConfig.arrContant.length; i < contantLength && i < 50; i++, itemIdx++) {
            currContant = cardConfig.arrContant[i];         //sun:得到当前联系人数据
            if (currContant) {
                receiveMail = currContant.mail;                //sun:得到接受方邮箱
                if (top.$Email.isEmail(receiveMail)) {       //sun:校验接受邮箱，没有邮箱不显示
                    if (count >= 3) {
                        strChecked = "";
                    }
                    var cName = $.trim(currContant.name);
                    cName = cName ? cName : $.trim(receiveMail);
                    cName = $T.Utils.htmlEncode(cName);
                    cName = top.$T.Utils.getBytes(cName) > 13 ? top.$PUtils.getLeftStr(cName, 13, "...") : cName;
                    if (i < 4) {
                        var cardtr = '<li><input type="checkbox" checked="true"  addr="' + receiveMail + '"><label>' + cName + '</label></li>';
                    } else {
                        var cardtr = '<li><input type="checkbox" addr="' + receiveMail + '"><label>' + cName + '</label></li>';
                    }
                    contactVarHtml.push(cardtr);
                    count++;
                } else { //sunsc:如果邮箱不合法，不显示，元素下标递减
                    itemIdx--;
                }
            } 
        }
        if (contactVarHtml.length) {
            cardConfig.contactVarHtml = "<ul>" + contactVarHtml.join("") + "</ul>";        }
        else {
            cardConfig.contactVarHtml = '<ul><li><input id="customReceiver" style="border: 1px #ccc solid;" /></li></ul>';
        }

    },

    //组装贺卡并渲染容器
    loadCardHtml: function () { 
        var self = this;
        var cardConfig = self.model.get("cardConfig");
        //发送人
        $('#receiver').html(cardConfig.contactVarHtml).find('tr:gt(0)').hide();
        var num = $('input:checked').length;
        if (num) {
            $('#friendNum').text(num)
        } else {
            $('#friendNum').parent().text('轻松一键，为您的好友送去新年贺卡！')
        }
        //祝福语
        $('#blessing').html(cardConfig.cardContent);
        //贺卡
        var flash = "<embed width='264' height='199' style='width: 264px;height: 199px;' src='"+cardConfig.cardSwf+"' type='application/x-shockwave-flash'>"
        $('#cardFlash').html(flash);
    },
   
    //将当前待发送正文的 html进行组装
    loadMailHtml: function () {
        var self = this;
        var cardConfig = self.model.get("cardConfig");
        /**
        *组装贺卡主题
        */
        if ($.trim(top.trueName) != "") {
            cardConfig.cardSubject = top.trueName + cardConfig.metaSubject;
        } else {
            var phone = top.$User.getUid();
            phone = phone ? (phone.substring(0, 2) == "86" ? phone.substring(2) : phone) : 0;
            cardConfig.cardSubject = top.$User.getUid().substring(2) + cardConfig.metaSubject;
        }
        /*
        *组装贺卡正文
        */
        cardConfig.cardContent = $("#blessing").val();
        cardConfig.cardContent = cardConfig.cardContent ? cardConfig.cardContent.replace(/(\r)?\n/g, '<br>') : "";
        var rp = top.getDomain("resource") + "/rm/richmail";
        cardConfig.mailVarHtml = ["<table id=\"cardinfo\" width=\"660\" align=\"center\" style=\"background:#FDFBE2; font-size:12px; margin-top:18px\">", "<tr><td style=\"background-repeat:no-repeat; background-position:center 10px; padding:0 60px 0 55px; vertical-align:top; text-align:center;\" background=\"", rp, "/images/heka_mail_bg.jpg\">", "<div style=\"text-align:right; height:60px; line-height:60px;padding-right:48px\"><a style=\"color:#000; font-family:\"宋体\"\" id=\"139command_greetingcard3\" href=\"", top.ucDomain, "/Card/GreetingCard/WriteBehavior.ashx?type=1\" target=\"_blank\">登录139邮箱发送更多贺卡>></a></div>" + "<h2 style=\"font-size:14px; margin:12px 0\">", top.$TextUtils.htmlEncode(cardConfig.cardSubject), "</h2><table style=\"width:440px; height:330px;margin:0 auto;\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"background-repeat:no-repeat;background-position:155px 59px;text-align:center\" background=\"", cardConfig.cardImg, "\" id=\"139command_flash\" rel=\"", cardConfig.cardSwf, "\"></td></tr></table><div style=\"margin:24px 0; font-size:14px\">如果您无法查看贺卡，<a style=\"color:#369\" href=\"http://file.mail.10086.cn/card/card_readcard.html?resPath=", rp, "&link=", $.trim(cardConfig.cardSwf), "&from=", encodeURIComponent(cardConfig.cardSubject), "\" target=\"_blank\">点击此处查看</a></div>", "<div><a id=\"139command_greetingcard1\" style=\"color:#369\" href=\"", top.ucDomain, "/Card/GreetingCard/WriteBehavior.ashx?type=1\" target=\"_blank\" style=\"margin-right:60px\"><img style=\"border:none\" src=\"", rp, "/images/heka_mail_bt01.gif\" alt=\"\" /></a><a id=\"139command_greetingcard2\" style=\"color:#369\" href=\"", top.ucDomain, "/Card/GreetingCard/WriteBehavior.ashx?type=1\" target=\"_blank\"><img style=\"border:none\" src=\"", rp, "/images/heka_mail_bt02.gif\" alt=\"\" /></a></div><div style=\"line-height:1.8; text-align:left; font-size:14px; padding:12px 48px\">", cardConfig.cardContent, "</div></td></tr></table><table><tr><td background=\"", top.ucDomain, "/Card/GreetingCard/WriteBehavior.ashx?rnd=", Math.random(), "\"></td></tr></table>"].join("");
    }
 
}));


$(function () { //main函数入口
    LazyCard = new M2012.LazyCard.View;
});
