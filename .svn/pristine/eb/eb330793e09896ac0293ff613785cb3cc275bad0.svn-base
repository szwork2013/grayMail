/*   迷你贺卡页   */
(function (jQuery, Backbone, _, M139) {

    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace("Evocation.Greetingcard.View", superClass.extend(
    {
        popHtml:
            ['<div class="repeattips-box boxIframeMain_bg clearfix">',
                '<div class="newWrite_pic">',
                    '<div id="evocation_flash"></div>',
                    '<a id="evocation_changeCard" bh="evocation_card_changecard" href="javascript:;">换一张贺卡</a>',
                '</div>',
                '<div class="newWrite_right">',
                    '<ul class="newWrite">',
                        '<li class="clearfix">',
                            '<a id="evocation_contacts" class="newWrite_label" title="选择联系人" bh="evocation_card_addaddr" href="javascript:;">收件人：</a>',
                            '<div class="newWrite_con">',
                                '<div id="evocationContainer" class="newWrite_input newWrite_input_first"></div>',
                            '</div>',
                        '</li>',
                        '<li class="clearfix">',
                            '<span class="newWrite_label">主&nbsp;&nbsp;&nbsp;题：</span>',
                            '<div class="newWrite_con">',
                                '<div class="newWrite_input newWrite_input_first ">',
                                    '<input id="evocation_subject" type="text" name="evocation_subject" class="newWriteText gray" maxlength="50" value="主 题">',
                                '</div>',
                            '</div>',
                        '</li>',
                    '</ul>',
                    '<div class="newWriteBox">',
                        '<div class="newWrite_content" style="height:116px;">',
                        '<textarea id="evocation_content" class="newWrite_content_scroll" style="height:116px;">祝福附言</textarea></div>',
                    '</div>',
                '</div>',
            '</div>',
            '<div class="boxIframeBtn height28">',
                //'<p class="pb_5" id="evocation_sendTime"></p>',
                '<span class="bibBtn">',
                    '<a id="evocation_send" bh="evocation_card_send" href="javascript:;" class="btnSetG" hidefocus="1" role="button"><span>发 送</span></a>',
                '</span>',
            '</div>'
            ].join(''),

        /*popHtml: 
            ['<div class="quicksend-box">                  ',
                 '<h3>现在，您可以通过本对话框快速发送贺卡啦！</h3> ',
             '<table class="writeTable">',
                 '<tbody>',
                     '<tr>',
                         '<th scope="row"  width="65" style="padding-right:5px;"  class="ta_r" valign="top">',
                                '收件人：',
                         '</th>',
                         '<td>',
                             '<div class="p_relative" style="z-index:3;">',
                                 '<div id="evocationContainer"></div>',
                             '</div>',
                         '</td>',
                         '<td width="30">',
                             '<a href="javascript:top.addBehaviorExt({ actionId: 104582 });" id="evocation_contacts" class="quick-add"><span class="heng"></span><span class="shu"></span></a>',
                         '</td>',
                     '</tr>',
                     '<tr>',
                           '<th scope="row"  width="65" style="padding-right:5px;" class="ta_r" valign="top">',
                           '发送内容：',
                         '</th>',
                         '<td >',
                             '<div class="qiucklr clearfix" style="width:378px">',
                                 '<div class="qiucklr-left" id="evocation_flash">',
                                 '</div>',
                                 '<div class="qiucklr-right">',
                                     '<div class="textarea-qiucksend"><textarea id="evocation_content">祝福附言</textarea></div>',
                                 '</div>',
                             '</div>',
                            '<p class="pt_5"><a id="evocation_changeCard" href="javascript:void(0)">换一张贺卡</a></p>',
                         '</td>   ',
                          '<td width="30"> &nbsp;',
                         '</td> ',
                     '</tr>',
                     '<tr>',
                           '<th scope="row"  width="65" style="padding-right:5px;"  class="ta_r" valign="top">',
                           '&nbsp;',
                         '</th>',
                         '<td colspan="2">',
                              '<p class="pb_5" id="evocation_sendTime"></p>',
                               '<p><a class="btnTb" id="evocation_send" href="javascript:void(0)" ><span>立即发送</span></a></p>',
                         '</td> ',
                     '</tr>',
                 '</tbody>',
             '</table>',
         '</div>'].join(""),*/

        cardStore: [
            {
                cardName: "祝你万事如意",
                cardContent: "叫太阳每天把幸福的阳光 \r\n洒在你身上 \r\n叫月亮每天给你一个 \r\n甜美的梦境 \r\n祝愿你事事如意！",
                cardFlash: "http://images.139cm.com/cximages/card/FlashCard/t2pnqik7.swf",
                cardImg: "http://images.139cm.com/cximages/card/FlashCard/1en5av8x.gif"
            },
            {
                cardName: "开心每一天",
                cardContent: "走过山山水水 \r\n脚下高高低低 \r\n经历风风雨雨 \r\n还要寻寻觅觅 \r\n生活忙忙碌碌 \r\n获得多多少少 \r\n失去点点滴滴 \r\n重要的是开开心心！",
                cardFlash: "http://images.139cm.com/cximages/card/FlashCard/8xlqi110.swf",
                cardImg: "http://images.139cm.com/cximages/card/FlashCard/52paolp5.gif"
            },
            {
                cardName: "思念的快乐",
                cardContent: "这是快乐分享的时刻 \r\n是思念好友的时刻 \r\n是美梦成真的时刻",
                cardFlash: "http://images.139cm.com/cximages/card/FlashCard/xox5gsts.swf",
                cardImg: "http://images.139cm.com/cximages/card/FlashCard/09odaxsi.gif"
            },
            {
                cardName: "朋友意难忘",
                cardContent: "朋友就是雨天里的那把伞 \r\n朋友就是晴空里的那阵风 \r\n朋友就是感冒时的那剂苦药 \r\n最爱的朋友啊，愿你我永远相随",
                cardFlash: "http://images.139cm.com/cximages/card/FlashCard/6mn9rfvb.swf",
                cardImg: "http://images.139cm.com/cximages/card/FlashCard/ll7j3o1t.gif"
            },
            {
                cardName: "最近好吗",
                cardContent: "在人生的旅途中， \r\n有些人会与我们并肩而行， \r\n有些人只是与我们短暂相处， \r\n我们都称之为朋友。 \r\n亲爱的朋友，你还好吗？",
                cardFlash: "http://images.139cm.com/cximages/card/FlashCard/2wcpoy8l.swf",
                cardImg: "http://images.139cm.com/cximages/card/FlashCard/hr2q075n.jpg"
            },
            {
                cardName: "朋友你还好吗",
                cardContent: "友谊，是一棵生长在沙漠的仙人掌， \r\n经历着时间的考验； \r\n时间，能体现出彼此的牵挂； \r\n朋友你现在还好吗？ \r\n愿我们的友谊常青， \r\n愿你活力常在，越过越精彩！",
                cardFlash: "http://images.139cm.com/cximages/card/FlashCard/dxi9pdai.swf",
                cardImg: "http://images.139cm.com/cximages/card/FlashCard/g48kbq2r.jpg"
            },
            {
                cardName: "励志每一天",
                cardContent: "时间就像卫生纸， \r\n看着挺多的， \r\n其实用着用着也就不够了; \r\n为了，梦想 \r\n努力每一天，加油！",
                cardFlash: "http://images.139cm.com/cximages/card/FlashCard/xtrqb18e.swf",
                cardImg: "http://images.139cm.com/cximages/card/FlashCard/xsuai596.jpg"
            },
            {
                cardName: "努力进取",
                cardContent: "朋友： \r\n相信自己！ \r\n机会总是给准备好的人， \r\n努力吧，你会成功的！",
                cardFlash: "http://images.139cm.com/cximages/card/FlashCard/yrbh8dn0.swf",
                cardImg: "http://images.139cm.com/cximages/card/FlashCard/pa146vaf.jpg"
            },
            {
                cardName: "我的朋友",
                cardContent: "感谢岁月让一只船 \r\n在这里找到了落帆的愿望 \r\n你的友情不是花朵 \r\n是青青的枝 \r\n冬天过后总有新叶 \r\n你永远是我心灵深处的朋友 \r\n真心感谢你",
                cardFlash: "http://images.139cm.com/cximages/card/FlashCard/3nqu0n4v.swf",
                cardImg: "http://images.139cm.com/cximages/card/FlashCard/au02kc8e.jpg"
            },
            {
                cardName: "加油",
                cardContent: "人生不如意事十之八九， \r\n不要难过！ \r\n阳光总在风雨后， \r\n相信自己是最捧的，加油！",
                cardFlash: "http://images.139cm.com/cximages/card/FlashCard/qfug5osc.swf",
                cardImg: "http://images.139cm.com/cximages/card/FlashCard/n855ia13.jpg"
            }
        ],
        cardStore1: [{
            //贺卡名称
            cardName: "水晶圣诞",
            //贺卡内容
            cardContent: "夜幕降临，雪花飘落 \r\n霓虹灯明，祝福声起 \r\n我把圣诞节装在水晶球里 \r\n我的祝福和圣诞老人一起到来 \r\n祝你圣诞节欢乐无边，来年好运连连",
            //贺卡flash路径
            cardFlash: "http://images.139cm.com/cximages/card/FlashCard/v60uxqvm.swf",
            //贺卡图片路径 
            cardImg: "http://images.139cm.com/cximages/card/FlashCard/ngd56e6k.jpg"
        },
        {
            //贺卡名称
            cardName: "雪人送祝福",
            //贺卡内容
            cardContent: "洁白的雪花代表我们的友谊纯洁\r\n璀璨的烟火代表我们激情的岁月\r\n火红的圣诞代表我们红火的生活\r\n那挂满的圣诞树代表什么\r\n代表我对你满满的祝福",
            //贺卡flash路径
            cardFlash: "http://images.139cm.com/cximages/card/FlashCard/qf47j6rx.swf",
            //贺卡图片路径 
            cardImg: "http://images.139cm.com/cximages/card/FlashCard/ipghst2u.jpg"
        },
        {
            //贺卡名称
            cardName: "超级圣诞礼物",
            //贺卡内容
            cardContent: "圣诞到，雪花飘 \r\n圣诞老人把门叫 \r\n麋鹿跳，礼物到 \r\n快快开门把礼瞧 \r\n不是金子不是银 \r\n圣诞贺卡有一张 \r\n祝你圣诞节快乐 \r\n天天开心，事事顺利", 
            //贺卡flash路径
            cardFlash: "http://images.139cm.com/cximages/card/FlashCard/ja1l366q.swf",
            //贺卡图片路径 
            cardImg: "http://images.139cm.com/cximages/card/FlashCard/v01xwvb8.jpg"
        },
        {
            //贺卡名称
            cardName: "快乐在圣诞",
            //贺卡内容
            cardContent: "酌一口美酒，心放宽 \r\n听一段音乐，心悠闲 \r\n赏一番雪景，心坦然 \r\n阅一张贺卡，心温暖 \r\n传一传祝愿，心里甜 \r\n祝君快乐在圣诞 \r\n开心快乐永不变",
            //贺卡flash路径
            cardFlash: "http://images.139cm.com/cximages/card/FlashCard/u7yonknm.swf",
            //贺卡图片路径 
            cardImg: "http://images.139cm.com/cximages/card/FlashCard/08dbpy32.jpg"
        },
        {
            //贺卡名称
            cardName: "浪漫圣诞节",
            //贺卡内容
            cardContent: "或许轻轻的问候最贴心；\r\n或许淡淡的感情最迷人；\r\n圣诞的夜晚我希望能和你一起度过；\r\n亲爱的，\r\n圣诞节快乐!",
            //贺卡flash路径
            cardFlash: "http://images.139cm.com/cximages/card/FlashCard/l9iioqmm.swf",
            //贺卡图片路径 
            cardImg: "http://images.139cm.com/cximages/card/FlashCard/6erieipk.jpg"
        },
        {
            //贺卡名称
            cardName: "圣诞有礼",
            //贺卡内容
            cardContent: "每年都想收到很多圣诞礼物，\r\n今年也不例外，祝你收礼物收到手软，\r\n圣诞快乐！",
            //贺卡flash路径
            cardFlash: "http://images.139cm.com/cximages/card/FlashCard/6r3ngcbb.swf",
            //贺卡图片路径 
            cardImg: "http://images.139cm.com/cximages/card/FlashCard/lmsnqk8d.jpg"
        },
        {
            //贺卡名称
            cardName: "圣诞大餐",
            //贺卡内容
            cardContent: "圣诞节是全世界的节日，\r\n每年此时，所有人都庆祝圣诞节的到来，\r\n这天最重要的环节无疑是圣诞晚餐，\r\n开开心心吃一顿圣诞大餐吧。\r\n祝你：圣诞快乐！",
            //贺卡flash路径
            cardFlash: "http://images.139cm.com/cximages/card/FlashCard/ilw5lvsv.swf",
            //贺卡图片路径 
            cardImg: "http://images.139cm.com/cximages/card/FlashCard/oycrsmcc.jpg"
        }],

        getRandom: function () {
            var nowIndex = this.model.get('curCardIndex');
            var cardIndex;
            do {
                cardIndex = parseInt(Math.random() * 1000);
                cardIndex = cardIndex % this.cardStore.length;
            } while (cardIndex == nowIndex);

            this.model.set('curCardIndex', cardIndex);
            this.model.set('curCardObject', this.cardStore[cardIndex]);
            return this.cardStore[cardIndex];
        },

        initialize: function (options) {
            this.popWindow();           //弹窗
            this.initEvents();          //初始化事件
        },

        initEvents: function () {
            this.model.setLetterSendTime('贺卡');
            this.model.addContacts('email');          //通信录组件接入      
            this.initCard();            //初始化贺卡界面
            this.bindchangeCard();      //换一张贺卡事件绑定
            this.bindCardSend();        //邮件发送事件绑定
        },

        /*******     弹窗           *********/
        popWindow:function(){        
            top.$App.evoctionPop = top.$Msg.showHTML(this.popHtml, {
                dialogTitle: "发贺卡", 
                width: 500,
                onclose: function(){
                    top.BH('evocation_card_close');
                    $(".menuPop.shadow").hide();
                }
            });
        },

        /*******     初始化贺卡界面  *********/        
        initCard: function (noFirst) {
            var card = this.getRandom();
            var embedFlash = '<embed width="193" height="168" style=" width: 193px; margin-right: 5px; height: 168px;" src="'
            embedFlash += card.cardFlash;
            embedFlash += '" type="application/x-shockwave-flash" swliveconnect="true" wmode="transparent">';

            $('#evocation_flash embed').remove();
            $('#evocation_flash').append(embedFlash);
            $('#evocation_subject').val(card.cardName);
            if (noFirst) {
                $('#evocation_content').val(card.cardContent);
            } else {
                var val = this.model.get("content");
                if (!val) {
                    $('#evocation_content').val(card.cardContent);
                } else {
                    $('#evocation_content').val(val);
                }
            }
        },

        /*******     "换一张贺卡"  *********/
        bindchangeCard: function () {
            var self = this;
            $('#evocation_changeCard').bind('click', function () {
                self.initCard(true);
            });
        },

        /*******     发送功能  *********/
        bindCardSend: function () {
            var self = this;
            $('#evocation_send').bind('click', function () {
                //*********验证收信人地址是否正确
                if (self.model.richInput.getErrorText()) {
                    //self.model.richInput.showEmptyTips("请正确填写收信人号码");
                    $Msg.alert('一个或多个地址错误，请编辑后再试一次');
                    return;
                }

                //*********验证收信人地址是否为空
                var address = self.model.richInput.getValidationItems(self.model.richInput);
                if (address.length == 0) {
                    //self.model.richInput.showEmptyTips("请填写收信人")
                    $('#evocation_contacts').click();
                    return;
                }
                address = address.join(',');
                self.cardSend(address);
            })
        },

        cardSend: function (address) {
            var self = this;
            var data = {   //邮件发送数据格式
                attrs: {
                    id: "",
                    mid: "", //后台返回的草稿ID,成功调用存草稿方法后修改该属性
                    messageId: "",
                    account: top.$User.getDefaultSender() || top.$PUtils.mobileMail,//发件人
                    to: address,//收件人地址‘,’号分隔
                    cc: "",//抄送人地址
                    bcc: "",//密送人地址
                    showOneRcpt: 1, //是否群发单显1 是 0否 
                    isHtml: 1,
                    subject: self.getSubject(),
                    content: self.getEmailContent(),
                    priority: 3, //是否重要
                    signatureId: 0,//使用签名档
                    stationeryId: 0,//使用信纸
                    saveSentCopy: 1,//发送后保存副本到发件箱
                    requestReadReceipt: 0,//是否需要已读回执
                    inlineResources: 1, //是否内联图片
                    scheduleDate: self.getScheduleDate || 0, //定时发信
                    normalizeRfc822: 0,
                    attachments: []//所有附件信息
                },
                action: "deliver",
                returnInfo: 1,
                replyNotify: 0
            };
            $RM.call("mbox:compose&comefrom=5&categroyId=103000000", data, function (res) {
                if (res && res.responseData)
                    self.model.cardSuccess()
            }, { error: function () { alert("连接失败"); top.WaitPannel.hide(); } });
        
        },

        getSubject: function () {
            var cardSubject = $.trim($('#evocation_subject').val());
            if(cardSubject && cardSubject != ""){return cardSubject;}
            var subject = '为您制作的贺卡《' + this.model.get('curCardObject').cardName + '》';
            if ($.trim(top.trueName) != "") {
                subject = top.trueName + subject;
            } else {
                var phone = top.$User.getUid();
                phone = phone ? (phone.substring(0, 2) == "86" ? phone.substring(2) : phone) : 0;
                subject = top.$User.getUid().substring(2) + subject;
            }
            return subject;
        },

        getEmailContent: function () {
            var rp = top.getDomain("resource") + "/rm/richmail";
            var card = this.model.get('curCardObject');
            var subject = this.getSubject();
            var content = ["<table id=\"cardinfo\" width=\"660\" align=\"center\" style=\"background:#FDFBE2; font-size:12px; margin-top:18px\">",
                "<tr><td style=\"background-repeat:no-repeat; background-position:center 10px; padding:0 60px 0 55px; vertical-align:top; text-align:center;\" background=\"",
                rp,
                "/images/heka_mail_bg.jpg\">",
                "<div style=\"text-align:right; height:60px; line-height:60px;padding-right:48px\"><a style=\"color:#000; font-family:\"宋体\"\" id=\"139command_greetingcard3\" href=\"",
                top.ucDomain,
                "/Card/GreetingCard/WriteBehavior.ashx?type=1\" target=\"_blank\">登录139邮箱发送更多贺卡>></a></div>" + "<h2 style=\"font-size:14px; margin:12px 0\">",
                subject,
                "</h2><table style=\"width:440px; height:330px;margin:0 auto;\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"background-repeat:no-repeat;background-position:155px 59px;text-align:center\" background=\"",
                card.cardImg,
                "\" id=\"139command_flash\" rel=\"",
                card.cardFlash,
                "\"></td></tr></table><div style=\"margin:24px 0; font-size:14px\">如果您无法查看贺卡，<a style=\"color:#369\" href=\"http://file.mail.10086.cn/card/card_readcard.html?resPath=",
                rp,
                "&link=",
                card.cardFlash,
                "&from=",
                encodeURIComponent(subject),
                "\" target=\"_blank\">点击此处查看</a></div>",
                "<div><a id=\"139command_greetingcard1\" style=\"color:#369\" href=\"",
                top.ucDomain,
                "/Card/GreetingCard/WriteBehavior.ashx?type=1\" target=\"_blank\" style=\"margin-right:60px\"><img style=\"border:none\" src=\"",
                rp,
                "/images/heka_mail_bt01.gif\" alt=\"\" /></a><a id=\"139command_greetingcard2\" style=\"color:#369\" href=\"",
                top.ucDomain,
                "/Card/GreetingCard/WriteBehavior.ashx?type=1\" target=\"_blank\"><img style=\"border:none\" src=\"",
                rp, "/images/heka_mail_bt02.gif\" alt=\"\" /></a></div><div style=\"line-height:1.8; text-align:left; font-size:14px; padding:12px 48px\">",
                $('#evocation_content').val(),
                "</div></td></tr></table><table><tr><td background=\"",
                top.ucDomain,
                "/Card/GreetingCard/WriteBehavior.ashx?rnd=",
                Math.random(),
                "\"></td></tr></table>"].join("");        
            return content;
        },

        getScheduleDate: function () {
            return this.model.get('sendTime');
        },

        getcontent: function () {
            return $('#evocation_content').val();
        }
    }));
  
})(jQuery,Backbone,_,M139);