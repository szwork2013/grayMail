﻿var LetterMessage={
    letterExistError: "通讯录已存在邮箱/手机相同的联系人",
    letterSaveSuccess:"保存成功!"
}

var $ = jQuery = top.$;

/* 读信页面跳转处理特殊业务[没有重构的] */
/*
var jumpToKey = {
    partid:top.$User.getPartid(),
    source:'jumpto',
    mid:top.$App.getCurrMailMid()
}
*/

/* $class */
function $class(clzName, tagName){
    /**
    * 判断是否包含样式
    * pattern = .xx.yy
    */
    function IsClass(className, pattern) {
        var _reg = new RegExp('^(?=[\\s\\S]*(?:^|\\s)' + pattern + '(?:\\s|$))');
        return _reg.test(className);
    }

    var tags = [];
    if (document.getElementsByClassName) {
        tags = document.getElementsByClassName(clzName);
        for(var m=tags.length; m--;){
            tags[m].tagName != tagName && tags.splice(m,1) ;
        }
    } else {
        var temp = document.getElementsByTagName(tagName);
        for(var m=temp.length; m--;){
            if (temp[m].className && IsClass(temp[m].className, clzName)) {
                tags.push(temp[m]);
            }
        }
    }
    return tags;
}

/** addrFeed */
function addrFeed(lnks){
    $.each(lnks,function(n){
        var func = $(this).attr("rev");
        var beh = $(this).attr("rel");
        $(this).attr('href','javascript:;');
        $(this).click(function(){
            var url = '';
            switch(func) {
                case "PersonalCommunication":
                    top.Links.showUrl(top.domainList[top.$User.getPartid()].webmail + '/userconfig/Personal/Communication.aspx?sid=' + top.$App.getSid() + '&behavior=' + beh, '个人资料');
                    break;
                case "PersonalBaseData":
                    top.$App.show('account');
                    break;
                case "SetPrivate":
                    top.$App.show('account');
                    break;
                case "UpdateContact":
                    top.$App.show('updateContact', 'behavior=' + beh);
                    break;
                }
        });
    })
}

/** letterContentBottomLoad */
function letterContentBottomLoad() { //todo 通讯录
   
    var Links = top.Links || {};
    var Contacts = top.Contacts || {};
	var $$ = function(id){return document.getElementById(id);}
    
    //flash杂志
    if (document.getElementById("mail139command")) {
        var div = document.getElementById("mail139command");
        var url = div && div.getAttribute("rel");
        var testReg = '' || /^http:\/\/www\.dooland\.com\/magazine/i;
        if (url && testReg.test(url)) {
            parent.location.href = url;
        }
    }
    //共享通讯录
    if (/这是[\s\S]+?的通讯录/.test(subject)) {
        var fromNumber = document.getElementById("FromNumber");
        var fromUIN = document.getElementById("FromUIN");
        var btnShareInput = document.getElementById("btnshareinput");
        if (fromNumber && fromUIN && btnShareInput) {
            btnShareInput.href = "javascript:;";
            btnShareInput.onclick = function() {
                top.Links.show("shareAddrInput", "&ShareFromNumber=" + fromNumber.value + "&ShareFromUIN=" + fromUIN.value + "&email=" + escape(from), true);
                return false;
            }
        }
    } else if (/您能把通讯录共享给我吗/.test(subject)) {
        var btnShareAddr = document.getElementById("btnshareaddr");
        var fromNumber = document.getElementById("FromNumber");
        if (btnShareAddr && fromNumber) {
            btnShareAddr.href = "javascript:;";
            btnShareAddr.onclick = function() {
                top.Links.show("shareAddr", "&email=" + fromNumber.value, true);
                return false;
            }
        }
    } else if (/的电子名片/.test(subject)) {//通讯录 电子名片
        var btnSaveBusiness = document.getElementById("btnsavebusiness");
        var businessCardInfo = document.getElementById("businesscardinfo");
        if (btnSaveBusiness && businessCardInfo && businessCardInfo.value.length > 0) {
            btnSaveBusiness.href = "javascript:;";
            btnSaveBusiness.style.display = "inline-block";
            btnSaveBusiness.onclick = function() {
                setTimeout(function() {
                    var text = businessCardInfo.value;
                    var obj = top.$Xml.xml2object(text, { ContactDetail: { type: "simple"} });
                    var info = new top.ContactsInfo(obj);
                    var searchText = info.name + "," + info.emails + "," + info.mobiles + "," + info.faxes;
                    var contacts = top.Contacts.data.contacts;
                    if (contacts && contacts.length>0){
                        for (var i = 0, len = contacts.length; i < len; i++) {
                            if (contacts[i].search(searchText)) {
                                top.$Msg.alert(LetterMessage.letterExistError); //已存在
                                return false;
                            }
                        }
                    }
                    top.Contacts.addContactDetails(info, function(result) {
                        if (result.success) {
                            top.$Msg.alert(LetterMessage.letterSaveSuccess);
                        } else {
                            top.$Msg.alert(result.msg);
                        }
                    });
                }, 0);
                return false;
            }
        }
    } else if (document.getElementById("aPostcard139")) {//明信片
        document.getElementById("aPostcard139").onclick = function() {
            top.Links.show("postcard", "&to=" + escape(from));
			//top.BH("读信_明信片发送");
            return false;
        }
    } else if (document.getElementById("139CommandQuickShare")) {//文件快递
        $("a[id='139CommandQuickShare']", document).click(function() {
            top.Links.show("diskDev", "&from=cabinet&toFileList=true");
            return false;
        });
    } else if (document.getElementById("addr_whoaddme")) {//通讯录 谁加了我
        $("#addr_whoaddme", document).click(function() {
            top.$App.show('addrWhoAddMe')
            return false;
        });
        $("#addr_whoaddme_set", document).click(function() {
            top.$App.show('account');
            return false;
        });
        $("#addr_whoaddme_agree", document).click(function() {
            top.$App.show('addrWhoWantAddMe', "&relationId=" + $("#addr_whoaddme_relationId", document).val())
            return false;
        });
        $("#addr_whoaddme_refuse", document).click(function() {
            top.$App.show('addrWhoWantAddMe', "&relationId=" + $("#addr_whoaddme_relationId", document).val());
            return false;
        });
        $("#addr_whoaddme_sendemail", document).click(function() {
            top.CM.show({ receiver: $("#addr_whoaddme_email", document).val() });
            return false;
        });
        $("#addr_whoaddme_sms", document).click(function() {
            top.Links.show("sms", "&mobile=" + $("#addr_whoaddme_mobile", document).val());
            return false;
        });
    } else if (document.getElementById("139command_flash")) {//贺卡
    
        var container = document.getElementById("139command_flash");
        var flashUrl = container.getAttribute("rel");
        if (flashUrl) {
            flashUrl = flashUrl.replace(/images\.baina\.com/i, "images.139cm.com");
        }
        var isAllowHost = top.SiteConfig.flashDomainReg && top.SiteConfig.flashDomainReg.test(flashUrl);
        isAllowHost = isAllowHost || /^http:\/\/fun\.n20svrg\.139\.com\//i.test(flashUrl); 
        if (isAllowHost) {
            var flashEleStr = "";
            if (document.all) {
                flashEleStr = "<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" \
                codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0\" \
                width=\"440\" height=\"330\"><param name=\"movie\" value=\"_Card_\" />\
                <param name=\"wmode\" value=\"transparent\">\
                <param name=\"quality\" value=\"high\" />\
                <embed src=\"_Card_\" quality=\"high\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\"\
                type=\"application/x-shockwave-flash\" width=\"440\" height=\"330\"></embed></object>";
            } else {
                flashEleStr="<embed width=\"440\" height=\"330\" src=\"_Card_\" quality=\"high\" wmode=\"opaque\" allownetworking=\"internal\" allowscriptaccess=\"never\" type=\"application/x-shockwave-flash\"></embed>";
            }

            container.innerHTML = flashEleStr.replace(/_Card_/g, flashUrl);

			try {
                document.getElementById("139command_greetingcard1").onclick = function() {
                    top.Links.show("greetingcard", "&email=" + window.from);
					top.BH("读信_贺卡回复发送");
                    return false;
                }
                document.getElementById("139command_greetingcard2").onclick = function() {
                    top.Links.show("greetingcard");
					top.BH("读信_贺卡回复发送");
                    return false;
                }
                document.getElementById("139command_greetingcard3").style.display = "none";
            } catch (e) { }
        }
    }else if(document.getElementById("139mailtobirthRemind")||document.getElementById("birthRemind2")){ //添加我的生日提醒
        if (top.SiteConfig.birthMail) {//开放新的生日邮件
            top.$App.set('birth', top.window.BirthRemind);
            var _self = top.$App.get('birth');

            //如果是新版
            var isNew = $('[id=sendCard]', document).eq(0).attr('mail');
            if (isNew && isNew.indexOf('@') > -1) {
                top.addBehaviorExt({ actionId: 104208, thingId: 1 });                
                $('[id=sendCard]', document).click(function () {
                    var option = {
                        AddrName: $(this).attr('AddrName') || '',
                        BirDay: $(this).attr('BirDay') || '',
                        email: $(this).attr('mail') || '',
                        MobilePhone: $(this).attr('MobilePhone') || '',
                        fullGroupName: $(this).attr('groupname') || ''
                    }
                    option.BirDay = '2013-' + option.BirDay.replace(/月/, '-').replace(/日/, '');

                    option.fullGroupName = option.fullGroupName === "未分组" ? option.MobilePhone : option.fullGroupName;
                    top.addBehaviorExt({ actionId: 101081, thingId: 1 });
                    _self.birdthMan = [option];
                    var param = '&birthday=1&singleBirthDay=1&senddate=true&materialId=' + top.BirthRemind.cardIds[parseInt(11 * Math.random() + 1)];
                    top.Links.show('greetingcard', param);
                }).css('cursor', 'pointer').removeAttr('href');

                $('#id_setbirthday', document).removeAttr("target").attr('href', "javascript:;").click(function () {
                    top.addBehaviorExt({ actionId: 104891, thingId: 1 });
                    top.$App.show('account_userInfo');
                });

                $('#btnShowMore', document).click(function () {
                    top.addBehaviorExt({ actionId: 104191, thingId: 1 });
                    $(this).parents('table').eq(0).find('tr').show();
                    $(this).parents('tr').eq(0).hide();
                    $(top.window).resize();
                    return false;
                }).css('cursor', 'pointer').removeAttr('href');
                return;
            } 

            //更多好友
            $(document.getElementById("moreFriend")).click(function () {
                $(document.getElementById("birthInfo")).find('tr').show();
                $(this).hide();
                $(top.window).resize();
            });

            //发送贺卡
            
            var cardIds= [694,693,692,691,690,694,693,692,691,690,691,690];
            var param = '&birthday=1&singleBirthDay=1&senddate=true&materialId=' + cardIds[parseInt(11 * Math.random() + 1)];
            var pEL = null, AddrName, BirDay, mail, gName, MobilePhone;
            $(document.getElementById("sendCard")).attr('href', "javascript:").click(function () {
                _self.birdthMan = [];
                $(document.getElementById("birthInfo")).find("tr:visible input:checked").each(function (i, input) {
                    tdInfo = $($(input).parent().parent().children()[3]);
                    pEL = $(tdInfo.children()[0]);
                    BirDay = $(tdInfo.children()[1]).text();
                    AddrName = pEL.text();
                    mail = pEL.attr("mail");
                    MobilePhone = pEL.attr("mobilephone");
                    gName = pEL.attr('groupname') === '未分组' ? MobilePhone : pEL.attr('groupname');
                    _self.birdthMan.push({ AddrName: AddrName, BirDay: _self.formateTime(BirDay), email: mail, MobilePhone: MobilePhone, fullGroupName: gName });
                });
                if (_self.birdthMan.length > 0) {
                    top.Links.show('greetingcard', param);
                } else {
                    top.FF.alert("请选择要过生日的好友!");
                }
                return false;
            });
		}else{
			var sendCard = $('#sendCard',document);
			sendCard.removeAttr("target").attr('href',"javascript:;").click(function(){
			    top.$App.jumpTo('15',jumpToKey); //暂时跳转处理
			});
		}
	}else if(document.getElementById("quickHeadImg")){//添加上传头像
	    
        var guidSMail = $("#guidSMail",document);
		var tipsName =  $("#tipsName",document);
		var name  = top.$User.getAliasName() || top.$User.getLoginName();
		tipsName.html('HI，'+name);
		guidSMail.removeAttr("target").attr('href',"javascript:;").click(function(){
		    /*top.$App.jumpTo('15',jumpToKey); //暂时跳转处理*/
		    top.$App.show('account');
		});
	}else if(document.getElementById("139olympic")){//olympic
        $("#139light1,#139light2",document).removeAttr('target').attr('href',"javascript:;").click(function(){
	        top.$Msg.alert('该活动已经结束，感谢您的支持！');
	    });
	}else if(document.getElementById("139jiayoly")){//中国加油
        $("#139jiay1,#139jiay2",document).removeAttr('target').attr('href',"javascript:;").click(function(){
	        top.$Msg.alert('该活动已经结束，感谢您的支持！');
	    });
            
	}else if(document.getElementById('mysubscribe')){ //精品订阅
	      top.$App.showMailbox(9);
	      //top.MB.subscribeTab('mySubscribe');
	}else if(document.getElementById("checkin_go")){//签到记录
	      var div = document.getElementsByTagName("div")[0];
		  var p = document.getElementsByTagName("p")[0];
		  p.style.display="none";
		  div.style.display="block";
		  var toCheckUI  = function(){
		      top.BH({ actionId: 102149, thingId: 2, pageId: 10544, moduleId: 13 });
		      //... 签到展开
		      top.$PUtils.showCheck(2000);
		  };
	     document.getElementById("checkin_go").onclick = function(){
			toCheckUI();
		    return false;
		}
		document.getElementById("checkin_login").href="javascript:void(0);";
		document.getElementById("checkin_login").onclick = function(){
		   toCheckUI();
		   return false;
		};
	}

    //wapmail运营短地址兼容
    if (document.getElementById("operationlinkId_0")) {
        ShortLinkModel.handleShortLink();
    }

    
    if (document.getElementById("139Command_CustomLinks")) {
        $("a[id='139Command_CustomLinks']", document).click(function() {
            var title = this.getAttribute('title'),
                href = this.getAttribute('href'),
                params = this.getAttribute('params') || "";
            var testStr = top.$Url.getHost(href).split(':')[0];
            if (testStr.slice(-9) == ".10086.cn") {
                if (href.indexOf('sid=') < 0) {
                    href += href.indexOf('?') > 0 ? '&' : '?';
                    href += "sid=" + top.sid;
                }
                if(params){
                    href += params;
                }
                top.$App.showUrl(href, title);
                return false;
            }
        });


    }



    if (document.getElementById("139Command_LinksShow")) {
        $("a[id='139Command_LinksShow'][rel]", document).click(function() {
            var command = this.getAttribute("rel");

            //写信页跳转
            if (command == "compose") {
                var params = this.getAttribute("params");
                params = params.split("&");
                var option = {}
                var oValue,oKey
                for (var i = 0; i < params.length; i++) {
                    if (params[i]) {
                        oKey = params[i].split("=")[0];
                        oValue = params[i].split("=")[1];
                    }
                    option[oKey] = oValue;
                }                
                //option = { receiver: '13923797879@139.com', subject: '主题', content: '内容', letterPaperId: '0090', timeset:'2013-01-04 10:00:00' }
                top.$App.show("compose", null, { inputData: option });
                return false;
            }


            //通信录跳转
            if (command == "addrvipgroup")   { top.appView.show(command); return false; }
            if (command == "addrWhoAddMe")   { top.appView.show(command); return false; }
            if (command == "addrinputhome")  { top.appView.show(command); return false; }
            if (command == "addroutput")     { top.appView.show(command); return false; }
            if (command == "addrMyVCard")    { top.appView.show(command); return false; }
            if (command == "addrbaseData")   { top.appView.show(command); return false; }

            //设置页跳转
            if (command == "account_accountSafe") { top.appView.show(command); return false; }
            if (command == "account_secSafe")     { top.appView.show(command); return false; }
            if (command == "account_areaSign")    { top.appView.show(command); return false; }
            if (command == "account_userInfo")    { top.appView.show(command); return false; }
            
            //任务邮件
            if (command == "searchTaskmail") {
                top.appView.searchTaskmail();
                return false;
            }
			
			//我的账单
            if (command == "billdeliver") {
                top.$App.showMailbox(8);
                return false;
            } else if (command == "mysubscribe") {
                top.$App.showMailbox(9);
                return false;
            }

            var params = this.getAttribute("params");

			//账单生活
			if (command === "billLifeNew") {
                top.$App.show(command, params);
                return false;
            }

            //收件箱
            if (command === "mailbox") {
                top.$App.showMailbox(1);
                return false;
            }

            //未读邮件
            if (command === "unreadmail") {
                top.$App.trigger("mailCommand", { command: "viewUnread", fid: 0 })
                return false;
            }

            //邮箱营业厅--首页
            if (command === "mailhallindex") {
                top.$Evocation.goMailhallUrl({oct : 'main',oac : 'index'});
                return false;
            }
            //邮箱营业厅--流量叠加包"main","flowaddlist"
            if (command === "mailhallflowaddlist") {
                top.$Evocation.goMailhallUrl({oct : 'main',oac : 'flowaddlist'});
                return false;
            }
            //邮箱营业厅--手机流量套餐
            if (command === "mailhallliuliang") {
                top.$Evocation.goMailhallUrl({oct : 'liuliang',oac : 'index'});
                return false;
            }
            //邮箱营业厅--4g套餐
            if (command === "mailhall4g") {
                top.$Evocation.goMailhallUrl({oct : 'upgrade',oac : 'get4g'});
                return false;
            }
            //邮箱营业厅--话费充值
            if (command === "mailhallpay") {
                top.$Evocation.goMailhallUrl({oct : 'ipos',oac : 'iposorder'});
                return false;
            }

            if(command.toLowerCase() == "smartlife"){
                top.$App.show('smartLife');
                return false;
            }
			
            //运营快速唤起功能
            if (command == "quick_launch") {                
                top.$Evocation.create(params);
                if(params.indexOf('silv=1')>-1){
                    var This = ShortLinkModel;
                    url = this.href;
                    if (url && This.isShortUrl(url)) {
                        if (This.isShortUrlForOpen(url)) {
                            link.href = url.replace("$sid", top.sid).replace("$v", 4).replace("usernumber",top.$App.getConfig("UserData")["UID"].replace(/^(86)/,""));
                            //链接中的u=userNumber需要替换成用户真实的手机号
                        } else {
                            var aid = This.queryString("aid", url);
                            var u = This.queryString("u", url);
                            var m  =This.queryString("m", url);
                            This.lookupLongUrl(aid,u,m,params,'evocation');
                        }
                    }
                }
                return false;
            }

            if (params) {
                if (params.indexOf("&") != 0) {
                  params = "&" + params;
                }
                
            }
			
			//特殊参数处理,跳到指定页面id位置
			var paramsMap = {
				'antivirus':{anchor:"antivirusArea"},
				'spam':{anchor:"spamMailArea"},
				'tagsuser':{anchor:"customerTags"}
			};
			
			if(paramsMap[command]){params = paramsMap[command]}
			
			var linksShow = false;
			if(top.Links && top.Links.map && (top.Links.map[command] || top.Links.old[command])){
				linksShow = true
			}	
            if (/^[-a-z_0-9]+$/i.test(command)) {
                if(top.LinksConfig[command]){
					top.$App.show(command, params);
					return false;
				}				
                if(linksShow){
					top.Links.show(command, params);
					return false;
				}				
            }
        });
    }

	//欢迎信的相关的内容  
	if($$("welcome_alias")){
		//成功打开欢迎信
		top.BH("欢迎信成功打开");
		
		var welcome_alias = $$("welcome_alias");
		welcome_alias.href="#";
		welcome_alias.removeAttribute("target");
		welcome_alias.onclick = function(){
			top.BH("欢迎信邮箱别名");
			//top.Links.show("accountManage");
		    top.$App.show('account');
		}
		
		var welcome_mailnotify = $$("welcome_mailnotify");
		welcome_mailnotify.href="#";
		welcome_mailnotify.removeAttribute("target");
		welcome_mailnotify.onclick = function(){
			top.BH("欢迎信短信通知");
			//top.Links.show("mailnotify");
		    top.$App.show('notice');
		}

		var welcome_sms = $$("welcome_sms");
		welcome_sms.href="#";
		welcome_sms.removeAttribute("target");
		welcome_sms.onclick = function(){
			top.BH("欢迎信发短信");
			top.Links.show("sms");
		}

		var welcome_message = $$("welcome_message")
		welcome_message.href="#";
		welcome_message.removeAttribute("target");
		welcome_message.onclick = function(){
			top.BH("欢迎信套餐信息");
			//top.Links.show("orderinfo");
		    top.$App.show('mobile');
		}
		
		$$("welcome_phoneFeixin").onclick = function(){
			top.BH("欢迎信下载手机版飞信");
		}

		$$("welcome_pcFeixin").onclick = function(){
			top.BH("欢迎信下载PC版飞信");
		}

		$$("welcome_foxmail").onclick = function(){
			top.BH("欢迎信foxmail发139邮件");
		}

		$$("welcome_collection").onclick = function(){
			top.BH("欢迎信代收邮件");
		}

		$$("welcome_mailList").onclick = function(){
			top.BH("欢迎信导入导出邮件");
		}

		$$("welcome_phoneToMail").onclick = function(){
			top.BH("欢迎信手机登陆139邮箱");
		}

		$$("welcome_more").onclick = function(){
			top.BH("欢迎信更多");
		}
	}

    var lnks = $class("139Command_ContactFeed", "A");
    addrFeed(lnks);

    fixImgSid();

    /* IPAD 读信页问题*/
    var ua = navigator.userAgent.toLowerCase();
    var isIpad = ua.match(/ipad/i) == "ipad";
    if (isIpad) {
        requestByScript("JTouch", "/m2012/js/richmail/readmail/JTouch.js", function () {
            ipadProblem();
        });
         
    }

    // 接受日历活动添加
    if (document.getElementById("calendarInviteOp")) {
        //$("#calendarInviteOp",document).hide(); // 加载脚本之前,先隐藏,不然会有延迟的效果,体验不好
        requestByScript("m2012.calendar.inviteactivity", "/m2012/js/packs/calendar/m2012.calendar.prod_inviteactivity.html.pack.js?sid=" + top.$App.getSid(), function () {
            inviteObj.work();
        },"utf-8");
    }

    // 接受会议邀请日历活动添加
    if (document.getElementById("meetingInviteOp")) {
        requestByScript("m2012.calendar.meeting.inviteactivity", "/m2012/js/packs/calendar/m2012.calendar.prod_meeting_inviteactivity.html.pack.js?sid=" + top.$App.getSid(), function () {
            meetingInviteObj.work();
        },"utf-8");
        
    }

    //日历分享
    if ($$("shareCalendarEmail")) {
        requestByScript("m2012_calendar_shareactivity",
            "/m2012/js/packs/calendar/m2012.calendar.prod_share.html.pack.js?sid=" + top.$App.getSid(),
            function () { },
            "utf-8"
        );
    }
    // 邀请加入群邮件群组
    if (document.getElementById("groupMailInviteOp")) {
        top.BH('gom_load_list_success');
        requestByScript("m2012.groupmail.joinGroupMail", "/m2012/js/service/groupmail_v2/common/m2012.groupmail.joingroupmail.js?sid=" + top.$App.getSid(), function () {

        },"utf-8");
    }
    // 分享日历
    if (document.getElementById("shareLabel")) {
        requestByScript("m2012_calendar_sharelabel",
            "/m2012/js/packs/calendar/m2012.calendar.prod_sharelabel.html.pack.js?sid=" + top.$App.getSid(),
            function () { },
            "utf-8"
        );
    }
}

function requestByScript(scriptId, dataHref, callback, charset, retry)
{
    var isReady = false;
    if (callback)
    {
        if (typeof (callback) == "string")
        {
            charset = callback;
            callback = null;
        }
    }
    var head = document.getElementsByTagName("head")[0];
    var objScript = document.getElementById(scriptId);
    //是否移出脚本DOM(非IE9时处理)
    var isRemoveScriptDom=!document.all && true || false,
    browserVersion=["msie 9.0","chrome","firefox"],
    i=0,bvLenght=browserVersion.length-1
    currVersion=window.navigator.userAgent.toLowerCase()||"";
    //IE9、chrome、firefox时处理
    while(i<=bvLenght){
        isRemoveScriptDom=currVersion.indexOf(browserVersion[i])>-1 && true || false;
        if (isRemoveScriptDom) {
            break;
        }
        i++;
    }
    browserVersion=null;

    try {
        if (objScript && isRemoveScriptDom) {
            objScript.src = "";
            objScript.parentNode.removeChild(objScript);
            objScript = null;
        }
    } 
    catch (e) {}        
    if (objScript != null)
    {
        if (dataHref.indexOf("?") == -1) dataHref += "?";
        dataHref += "&" + Math.random();
        objScript.src = dataHref;
        var dataScript = objScript;
    } else
    {
        var dataScript = document.createElement("script");
        dataScript.id = scriptId;
        if (charset)
        {
            dataScript.charset = charset;
        } else
        {
            dataScript.charset = "GB2312";
        }
        dataScript.src = dataHref;
        dataScript.defer = true;
        dataScript.type = "text/javascript";
        head.appendChild(dataScript);
    }
    if (document.all)
    {
        dataScript.onreadystatechange = function()
        {
            if (dataScript.readyState == "loaded" || dataScript.readyState == "complete")
            {
                isReady = true;
                if (callback) callback();
            }
        }
    } else
    {
        dataScript.onload = function()
        {
            isReady = true;
            if (callback) callback();
        }
    }

    if (retry)
    {
        setTimeout(function()
        {
            if (retry.times > 0 && !isReady)
            {
                retry.times--;
                if (dataHref.indexOf("?") == -1) dataHref += "?";
                dataHref += "&" + Math.random();
                Utils.requestByScript(scriptId, dataHref, callback, charset, retry);
            }
        }, retry.timeout);
    }
}

/* IPAD 读信页问题*/
function ipadProblem() {
    var div1 = top.$("#toolbar_" + top.ipadLetterMid).next()[0]; 
    var div2 = document.body;
    var Touches = JTouch(div2);
    Touches.on('swipe', function (evt, data) {
        //轻拂
        switch (data['direction']) {
            case 'left':
                div1.scrollLeft += 5;
                div2.scrollLeft += 5;
                break;
            case 'right':
                div1.scrollLeft -= 5;
                div2.scrollLeft -= 5;
                break;
            case 'up':
                div1.scrollTop += 5;
                div2.scrollTop += 5;
                break;
            case 'down':
                div1.scrollTop -= 5;
                div2.scrollTop -= 5;
                break;
        };
    })


};

/** fixImgSid */
function fixImgSid(){
    var imgs = document.getElementsByTagName("IMG");
    if (imgs.length == 0) return;

    for(var i=imgs.length; i--;) {
        var _src = imgs[i].getAttribute("mail139command_src");
        if (_src && _src.indexOf("$sid$")>-1) {
            imgs[i].src = _src.replace(/\$sid\$/, top.sid);
        }
    }
}


var isTest = location.host.indexOf("10086rd") > -1;

//wap短地址处理
var ShortLinkModel = {
    queryString: function (param, url) {
        return top.M139.Text.Url.queryString(param, url);
    },
    //判断是否运营短地址
    isShortUrl: function (url) {
        return !!this.queryString("aid", url);
    },
    //是否第三方短地址,aid是下划线开头或者有nomail参数
    isShortUrlForOpen: function (url) {
        return /^_/.test(this.queryString("aid", url)) || this.queryString("nomail", url) == "1";
    },
    //处理运营短地址
    handleShortLink: function () {
        var This = this;
        var links = parent.jQuery("a[id*='operationlinkId']",document);//运营短地址
        links.each(function () {
            var link = this;
            var url = link && link.href;
            var params = $(link).attr('params');
            if (link && This.isShortUrl(url)) {
                if (This.isShortUrlForOpen(url)) {
                    link.href = url.replace("$sid", top.sid).replace("$v", 4).replace("usernumber",top.$App.getConfig("UserData")["UID"].replace(/^(86)/,""));
					//链接中的u=userNumber需要替换成用户真实的手机号
                } else {
                    link.href = "javascript:;";
                    link.onclick = (function (url) {
                        return function () {
							var aid = This.queryString("aid", url);
							var u = This.queryString("u", url);
							var m  =This.queryString("m", url);
                            This.lookupLongUrl(aid,u,m,params);
                            return false;
                        };
                    })(url);
                }
            }
        });
    },
    //查询长地址
    lookupLongUrl: function (aid,u,m,parms) {
        var This = this;
        var url = "/mw2/together/s?func=operation:address&v=4&sid=" + top.sid + "&aid=" + aid;
		if(u){
			url = url + "&u=" + u;
		}
		if(m){
			url = url + "&m=" + m;
		}
        top.$RM.call(url, null,function (e) {
            if (isTest) {
                var url = "http://html5.mail.10086.cn/?id=sms";
                This.gotoUrl(url);
            } else if (e && e.responseData) {
                var url = e.responseData["var"].url;
                This.gotoUrl(url, parms);
            }
        });
    },
    makeObject:function(params){
        var attr = params.replace(/^&/, '').split('&'),
            i=0,o, k, v,obj;
        for (; i < attr.length; i++) {
            o = attr[i].split('=');
            k = o[0];
            v = o[1];
            obj[k] = v;
        }
        return obj;
    },

    gotoUrl: function (url, params) {
        var id = this.queryString("id", url);
        if (id) {
            if (id == "disk") {
                id = "diskDev";
            }
            if (id == "bill") {
                top.MB.show(8);
            } else if (id == "compose") {
                var option = this.makeObject(params) || null;
                top.CM.show(option);
            } else if (id == "password") {
                top.$App.show("account", params);
            } else {
                var item = top.LinksConfig[id];
                if (item) {
                    top.Links.show(id, params);
                } else {
                    this.showNoUrl();
                }
            }
        } else {
            this.showNoUrl();
        }
    },
    showNoUrl: function () {
        top.$Msg.alert("抱歉，当前版本没有该业务");
    }
};

try {
    letterContentBottomLoad();
} catch (e) {
    if (window.console) {
        //console.log(e);
    }
}