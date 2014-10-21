
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