var LetterMessage={
    letterExistError: "通讯录已存在邮箱/手机相同的联系人",
    letterSaveSuccess:"保存成功!"
}

var $ = top.$W.$;

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
                    jumpToReadMail();
                    break;
                case "PersonalBaseData":
                    var url = createJumpUrl({
                        id:'account',
                        source:'newwin'
                    });
                    window.open(url+"&email=" + "&behavior=" + beh + "");
                    break;
                case "SetPrivate":
                    var url = createJumpUrl({
                        id:'account',
                        source:'newwin'
                    });
                    window.open(url+"&behavior=" + beh + "");
                    break;
                case "UpdateContact":
                    jumpToReadMail();
                    break;
                }
        });
        
    })
}

/** letterContentBottomLoad */
function letterContentBottomLoad() { //todo 通讯录
   
    var Links = top.$W.Links || {};
    var Contacts = top.$W.Contacts || {};
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
        var btnShareInput = document.getElementById("btnshareinput");
        if (fromNumber && btnShareInput) {
            btnShareInput.href = "javascript:;";
            btnShareInput.onclick = function() {
                //top.$W.Links.show("shareAddrInput", "&ShareFromNumber=" + fromNumber.value + "&email=" + escape(from), true);
                var url = createJumpUrl({
                    id:'shareAddrInput',
                    source:'newwin'
                });
                window.open(url+"&ShareFromNumber=" + fromNumber.value + "&email=" + escape(from));
                return false;
            }
        }
    } else if (/您能把通讯录共享给我吗/.test(subject)) {
        var btnShareAddr = document.getElementById("btnshareaddr");
        var fromNumber = document.getElementById("FromNumber");
        if (btnShareAddr && fromNumber) {
            btnShareAddr.href = "javascript:;";
            btnShareAddr.onclick = function() {
                //top.$W.Links.show("shareAddr", "&email=" + fromNumber.value, true);
                var url = createJumpUrl({
                    id:'shareAddr',
                    source:'newwin'
                });
                window.open(url+"&email=" + fromNumber.value);
                return false;
            }
        }
    } else if (/的电子名片/.test(subject)) {//通讯录 电子名片
        var btnSaveBusiness = document.getElementById("btnsavebusiness");
        var businessCardInfo = document.getElementById("businesscardinfo");
        if (btnSaveBusiness && businessCardInfo) {       
            btnSaveBusiness.href = "javascript:;";
            btnSaveBusiness.style.display = "inline-block";
            btnSaveBusiness.onclick = function() {
                
                /*
                setTimeout(function() {
                    var text = businessCardInfo.value;
                    var obj = top.$W.$Xml.xml2object(text, { ContactDetail: { type: "simple"} });
                    var info = new top.$W.ContactsInfo(obj);
                    var searchText = info.name + "," + info.emails + "," + info.mobiles + "," + info.faxes;
                    //隐藏bug：已有联系人为零个的时候出错。
                    //for (var i = 0, contacts = top.Contacts.data.contacts, len = contacts.length; i < len; i++) {
                    var contacts = top.$W.Contacts.data.contacts;
                    if (contacts && contacts.length>0){
                        for (var i = 0, len = contacts.length; i < len; i++) {
                            if (contacts[i].search(searchText)) {
                                top.$W.$Msg.alert(LetterMessage.letterExistError); //已存在
                                return false;
                            }
                        }
                    }
                    top.$W.Contacts.addContactDetails(info, function(result) {
                        if (result.success) {
                            top.$W.$Msg.alert(LetterMessage.letterSaveSuccess);
                        } else {
                            top.$W.$Msg.alert(result.msg);
                        }
                    });
                }, 0); */
                
                //新窗口读信跳转处理
                jumpToReadMail();
                return false;
            }
        }
    } else if (document.getElementById("aPostcard139")) {//明信片
        document.getElementById("aPostcard139").onclick = function() {
            //top.$W.Links.show("postcard", "&to=" + escape(from));
			top.$W.BH("读信_明信片发送");
            var url = createJumpUrl({
                id:'postcard',
                source:'newwin',
                to:escape(from)
            });
            window.open(url);
            return false;
        }
    } else if (document.getElementById("139CommandQuickShare")) {//文件快递
        $("a[id='139CommandQuickShare']", document).click(function() {
            //top.$W.Links.show("quicklyShare", "&toFileList=true");
            var url = createJumpUrl({
                id:'quicklyShare',
                source:'newwin'
            });
            window.open(url+'&toFileList=true');
            return false;
        });
    } else if (document.getElementById("addr_whoaddme")) {//通讯录 谁加了我
        $("#addr_whoaddme", document).click(function() {
            //top.$W.Links.show("addrWhoAddMe");
            window.open(createJumpUrl({
                id:'addrWhoAddMe',
                source:'newwin'
            }));
            return false;
        });
        $("#addr_whoaddme_set", document).click(function() {
            //top.$W.Links.show("setPrivate");
            window.open(createJumpUrl({
                id:'setPrivate',
                source:'newwin'
            }));
            return false;
        });
        $("#addr_whoaddme_agree", document).click(function() {
            //top.$W.Links.show("addrWhoWantAddMe", "&relationId=" + $("#addr_whoaddme_relationId", document).val());
            var url = createJumpUrl({
                id:'addrWhoWantAddMe',
                source:'newwin'
            })+"&relationId=" + $("#addr_whoaddme_relationId", document).val();
            window.open(url);
            return false;
        });
        $("#addr_whoaddme_refuse", document).click(function() {
            //top.$W.Links.show("addrWhoWantAddMe", "&relationId=" + $("#addr_whoaddme_relationId", document).val());
            var url = createJumpUrl({
                id:'addrWhoWantAddMe',
                source:'newwin'
            })+"&relationId=" + $("#addr_whoaddme_relationId", document).val();
            window.open(url);
            return false;
        });
        $("#addr_whoaddme_sendemail", document).click(function() {
            //top.$W.CM.show({ receiver: $("#addr_whoaddme_email", document).val() });
            var url = createJumpUrl({
                id:'2',
                source:'interface',
                to:$("#addr_whoaddme_email", document).val()
            });
            window.open(url);
            return false;
        });
        $("#addr_whoaddme_sms", document).click(function() {
            //top.$W.Links.show("sms", "&mobile=" + $("#addr_whoaddme_mobile", document).val());
            var url = createJumpUrl({
                id:'sms',
                source:'interface'
            });
            window.open(url+"&mobile=" + $("#addr_whoaddme_mobile", document).val());
            return false;
        });
    } else if (document.getElementById("139command_flash")) {//贺卡
    
        var container = document.getElementById("139command_flash");
        var flashUrl = container.getAttribute("rel");
        if (flashUrl) {
            flashUrl = flashUrl.replace(/images\.baina\.com/i, "images.139cm.com");
        }
        var isAllowHost = top.$W.SiteConfig.flashDomainReg && top.$W.SiteConfig.flashDomainReg.test(flashUrl);
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
                    //top.$W.Links.show("greetingcard", "&email=" + window.from);
					top.$W.BH("读信_贺卡回复发送");
                    var url = createJumpUrl({
                        id:'greetingcard',
                        source:'newwin'
                    });
                    window.open(url+"&email="+window.from);
                    return false;
                }
                document.getElementById("139command_greetingcard2").onclick = function() {
                    //top.$W.Links.show("greetingcard");
					top.$W.BH("读信_贺卡回复发送");
                    var url = createJumpUrl({
                        id:'greetingcard',
                        source:'newwin'
                    });
                    window.open(url);
                    return false;
                }
                document.getElementById("139command_greetingcard3").style.display = "none";
            } catch (e) { }
        }
    }else if(document.getElementById("139mailtobirthRemind")||document.getElementById("birthRemind2")){ //添加我的生日提醒
		var sendCard = $('#sendCard',document);
		sendCard.removeAttr("target").attr('href',"javascript:;").click(function(){
		    //好友生日提醒，需要优化暂时这样处理
            jumpToReadMail();
		});
	}else if(document.getElementById("quickHeadImg")){//添加上传头像
	    
        var guidSMail = $("#guidSMail",document);
		var tipsName =  $("#tipsName",document);
		var name  = top.$W.$User.getAliasName() || top.$W.$User.getLoginName();
		tipsName.html('HI，'+name);
		guidSMail.removeAttr("target").attr('href',"javascript:;").click(function(){
		    //jumpToReadMail();
		    var url = createJumpUrl({
                        id:'account',
                        source:'newwin'
            });
		});
	}else if(document.getElementById("139olympic")){//olympic
        $("#139light1,#139light2",document).removeAttr('target').attr('href',"javascript:;").click(function(){
	        alert('该活动已经结束，感谢您的支持！');
	    });
	}else if(document.getElementById("139jiayoly")){//中国加油
        $("#139jiay1,#139jiay2",document).removeAttr('target').attr('href',"javascript:;").click(function(){
	        alert('该活动已经结束，感谢您的支持！');
	    });
            
	}else if(document.getElementById('mysubscribe')){ //精品订阅
	    var url = createJumpUrl({
                      id:'33',
                      source:'newwin'
                  });
        window.open(url);
	}else if(document.getElementById("checkin_go")){//签到记录
	      var div = document.getElementsByTagName("div")[0];
		  var p = document.getElementsByTagName("p")[0];
		  p.style.display="none";
		  div.style.display="block";
		  var toCheckUI  = function(){
		        var url = createJumpUrl({
                    id:'welcome',
                    source:'newwin'
                });
                window.open(url);
		  };
	     document.getElementById("checkin_go").onclick = function(){
		    try{
		        top.$W.BH({ actionId: 102149, thingId: 2, pageId: 10544, moduleId: 13 });
			}catch(e){}
			toCheckUI();
		    return false;
		}
		document.getElementById("checkin_login").href="javascript:void(0);";
		document.getElementById("checkin_login").onclick = function(){
		   toCheckUI();
		   return false;
		};
	}
    if (document.getElementById("139Command_LinksShow")) {
        $("a[id='139Command_LinksShow'][rel]", document).click(function() {
            var command = this.getAttribute("rel");
            var params = this.getAttribute("params");
            if (params) params = "&" + params;
            if (/^[-a-z_0-9]+$/i.test(command)) {
                var url = createJumpUrl({
                    id:command,
                    source:'newwin'
                });
                window.open(url+params);
                return false;
            }
        });
    }

	//欢迎信的相关的内容  
	if($$("welcome_alias")){
		//成功打开欢迎信
		top.$W.BH("欢迎信成功打开");
		
		var welcome_alias = $$("welcome_alias");
		welcome_alias.href="#";
		welcome_alias.removeAttribute("target");
		welcome_alias.onclick = function(){
			top.$W.BH("欢迎信邮箱别名");
			//top.$W.Links.show("accountManage");
		    //top.$W.$App.show('account');
            var url = createJumpUrl({
                id:'account',
                source:'newwin'
            });
            window.open(url);
		}
		
		var welcome_mailnotify = $$("welcome_mailnotify");
		welcome_mailnotify.href="#";
		welcome_mailnotify.removeAttribute("target");
		welcome_mailnotify.onclick = function(){
            var url = createJumpUrl({
                id:'notice',
                source:'newwin'
            });
            window.open(url);
		}

		var welcome_sms = $$("welcome_sms");
		welcome_sms.href="#";
		welcome_sms.removeAttribute("target");
		welcome_sms.onclick = function(){
			top.$W.BH("欢迎信发短信");
			//top.$W.Links.show("sms");
		    var url = createJumpUrl({
                id:'sms',
                source:'newwin'
            });
            window.open(url);
		}

		var welcome_message = $$("welcome_message")
		welcome_message.href="#";
		welcome_message.removeAttribute("target");
		welcome_message.onclick = function(){
			top.$W.BH("欢迎信套餐信息");
			//top.$W.Links.show("orderinfo");
		    var url = createJumpUrl({
                id:'orderinfo',
                source:'newwin'
            });
            window.open(url);
		}
		
		$$("welcome_phoneFeixin").onclick = function(){
			top.$W.BH("欢迎信下载手机版飞信");
		}

		$$("welcome_pcFeixin").onclick = function(){
			top.$W.BH("欢迎信下载PC版飞信");
		}

		$$("welcome_foxmail").onclick = function(){
			top.$W.BH("欢迎信foxmail发139邮件");
		}

		$$("welcome_collection").onclick = function(){
			top.$W.BH("欢迎信代收邮件");
		}

		$$("welcome_mailList").onclick = function(){
			top.$W.BH("欢迎信导入导出邮件");
		}

		$$("welcome_phoneToMail").onclick = function(){
			top.$W.BH("欢迎信手机登陆139邮箱");
		}

		$$("welcome_more").onclick = function(){
			top.$W.BH("欢迎信更多");
		}
	}

    var lnks = $class("139Command_ContactFeed", "A");
    addrFeed(lnks);

    fixImgSid();
}

/** fixImgSid */
function fixImgSid(){
    var imgs = document.getElementsByTagName("IMG");
    if (imgs.length == 0) return;

    for(var i=imgs.length; i--;) {
        var _src = imgs[i].getAttribute("mail139command_src");
        if (_src && _src.indexOf("$sid$")>-1) {
            imgs[i].src = _src.replace(/\$sid\$/, top.$W.sid);
        }
    }
}

try {
    letterContentBottomLoad();
} catch (e) {
    if (window.console) {
        //console.log(e);
    }
}