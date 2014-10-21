//cm与rm Host
var cardHost = top.isRichmail ? top.SiteConfig.cardMiddleware : "http://" + location.host + "/";

//通讯录自动保存
try{
    var isAutoSaveContact = top.Contacts.isAutoSaveContact();
    var C = top.Contacts;
    var del = C.DelSavedContact;
    var mod = C.ModSavedContact;
    var showadd = C.QuickAddGroup;
    var queryUserInfo = C.QueryUserInfo;
} catch (e) { }
/**
  * 获取增值站点URL
  * @param {string} param 接口参数名称
  * @return {string} url
  */
function getInterfaceUrl(param){
    //接口名称
    var interFace= "/mw2/card/s?func=card:";
    return interFace + param + "&sid=" + top.$App.getSid();
}

var CardResAddress;

function showPartnerTip() {
    var count = top.$User.getFreeMmsCount();
    if (count <= 5 && top.$User.needMailPartner()) { //免费条数小于5
        $("#MmsCardTip").prepend("<div>*本月免费自写彩信仅余<span>" + count + "</span>条，<a href='javascript:top.$App.show(\"mobile\")'>开通邮箱伴侣</a>享受更多彩信优惠</div>");
        top.BH("partner_guide1");
    }
}

$(function () {
    birthRemind.isShow();
	
	bindEvent();

	//发送生日号码
	sendBrithdayNum();

	pnl = {
		main: $('#pnlDetail'),
		mainHTML: $('#pnlDetail').html()
	};

	view();
	showPartnerTip();
	lottery();
	fromLazyCard();

});

//从懒人贺卡来
function fromLazyCard() {
    var lazyCard = Utils.queryString("lazyCard") || 0;
    if (lazyCard) {
        $('#aSms').hide();
    }
}



function lottery() {
    var self = this;
    validTime = new Date(2014, 5, 31),
    isCM = top.$User.isChinaMobileUser(),  //是否移动用户
    tid = $Url.queryString("tid");

    //获取当前时间
    var testServerTime = top.$Url.queryString("testServerTime");
    now = testServerTime ? top.$Date.parse(testServerTime) : top.M139.Date.getServerTime();

    var html = ['<div class="lottery2">',
        '<a href="javascript:;" class="fl ml_15 mr_15"><img src="http://' + location.host + '/m2012/images/201312/baoxiang.gif" width="124" height="124" alt="宝箱"></a>',
        '<div><h3 class="fz_16">开箱抢奖啦！</h3><p>“和你一起开箱邮礼”活动专为139邮箱新客户特别策划。<br>首次密码设置、发邮件、发贺卡有机会，抽取道具参与气球抢<br>奖游戏，赢取iPad、三星手机、手机上网流量包等丰厚好礼。</p></div>',
    '</div>'].join("");

    // 1.开关打开， 2.有效期， 3.移动用户， 4.tid有获取
    if (top.SiteConfig.showLottery && validTime > now && isCM && tid) {
        var option = {
            versionID: 1, //版本ID，1:标准版2.0；2：酷版
            originID: 1, //抽奖资格来源ID，1：发送贺卡；2：发送邮件； 
            tid: tid
        };
        var optionStr = 'versionID=1&originID=1&tid='+tid;
        top.M139.RichMail.API.call("setting:examineShowStatus", optionStr, function (res) {
            res = res.responseData;
            if (res.code = "S_OK") {
                var status = res['var']['showStatus']; //显示状态，1：正常显示抽奖入口，2：提醒最后一次显示抽奖入口，3：不显示抽奖入口
                if (status == 1 || status == 2) {
                    var content = $('#lottery').html(html).show();
                    if (status == '2') {
                        content.find('h3').text('开箱抢奖啦！这是最后一次开箱抢奖机会啦！');
                    }
                    content.find('a').one("click", function () {
                        top.addBehaviorExt({ actionId: 8000, thingId: 3727 });
                        top.$App.show('lottery', option);
                        content.find('img')[0].src ="http://" + location.host + '/m2012/images/201312/baoxianggray.gif' ;
                    })
                    $('#divRecommendCard,#card_birthday,#divContact').hide();
                } else {
                    self.gotoUserCenter();  //显示用户中心跳转链接
                }
            }
        }, { method: "GET" });
    } else {
        self.gotoUserCenter();  //显示用户中心跳转链接
    }

};



function bindEvent(){
   $("#aOutbox").bind("click", function(event){
       var name = top.$App.getCurrentTab().name;
       window.top.$App.showMailbox(3);
       window.top.$App.close(name);
		
		return false;
   });
	/*
   $("#aInbox").bind("click", function(event){
		var name = top.MM.currentModule.name;
		
		window.top.MB.show(1);
		window.top.MM.close(name);
		return false;
   });*/
}

function view(){
	var isSave = Utils.queryString("isSave") || 0;

	if (isSave == 1) {
		$("#pSaveBox").show();
	} else {
		$("#pSaveBox").hide();
	}

	var adContainer = document.getElementById("divAd");
	var type = Utils.queryString("type");

	if (type=="1") {//彩信发送
		mmsSend(adContainer);
	} else { //邮件发送
		mailSend(adContainer);
   }
}

function mmsSend(adContainer){
	$("#h2Msg").html("您的彩信贺卡发送成功");
	$("#aSms").hide();
	$("#aInbox").hide();
	
	if (isAutoSaveContact) {
		// add by tkh
		var list = [];
		new M2012.UI.Widget.ContactsAutoSave({
            container:document.getElementById("divContact"),
            type: "mobile",
            from: 2, //来源贺卡
            list: list.concat(top._greetingcard_re.split(','))
        }).render();
		/*
		try{
			!function(c,t){
				var from = C.FROMTYPE.MOBILE | C.FROMTYPE.CARD,
					contacts = c,
					recentMail = t,
					panel = document.getElementById("divContact");

				C.AutoSaveRecentContacts(contacts, from, panel, recentMail);
			}(top._greetingcard_re, top._greetingcard_et);
		}catch(e){}*/
	} else {
		try{
			var param={
				type: "mobile",
				mobiles: top._greetingcard_re,
				container: document.getElementById("divContact")
			};
			top.Contacts.createAddContactsPage(param);
	   }catch(e){}
	}
	
	// todo add by tkh 暂时屏蔽广告
	// $("#divAd").show();
    // try{
        // top.loadAD(1163, adContainer);
    // } catch (e) { }
}

function mailSend(adContainer){
	$("#MmsCardTip").hide();

	var defineTime = Utils.queryString("defineTime") || 0;

	if (defineTime == 0) {
	    $("#aSms").bind("click", function (event) {
	        if (!top.$User.isChinaMobileUser()) {
	            top.$User.checkAvaibleForMobile();
	            return;
	        }
	        var current = top.$App.getCurrentTab().name;
	        var url = String.format("&id=85&un={un}&re={re}&et={et}", {
				un: encodeURIComponent(top._greetingcard_un),
				re: encodeURIComponent(top._greetingcard_re),
				et: encodeURIComponent(top._greetingcard_et)
	        });

	        top.$App.show('smsnotify', url);
	        top.$App.close(current);
			return false;
	   });
	   
	   try {
			var receivers = top._greetingcard_re;
			var formatList = Utils.parseEmail(receivers);
			var paramEmailString = [];

			$(formatList).each(function() {
				if (this.domain != "10086.cn") {
					paramEmailString.push(this.addr);
				}
			});

			if (isAutoSaveContact) {
				var autoSave = null;
				// add by tkh
				autoSave = new M2012.UI.Widget.ContactsAutoSave({
		            container:document.getElementById("divContact"),
		            type: "email",
		            from: 2, //来源贺卡
		            list: paramEmailString
		        });
				
				autoSave.on("BH_CancelModify", function () {
					top.BH("send_card_cancel_modify");
				});

				autoSave.on("BH_Modify", function () {
					top.BH("send_card_modify");
				});

				autoSave.on("BH_AddGroup", function () {
					top.BH("send_card_add_group");
				});

				autoSave.on("BH_DeleteContact", function () {
					top.BH("send_card_delete_contact");
				});

				autoSave.on("BH_Save", function () {
					top.BH("send_card_save");
				});

				autoSave.on("BH_Cancel", function () {
					top.BH("send_card_cancel");
				});
				
				autoSave.render();
				/*
				try{
					!function(c,t){
						var from = C.FROMTYPE.MAIL | C.FROMTYPE.CARD,
							contacts = c,
							recentMail = t,
							panel = document.getElementById("divContact");

						C.AutoSaveRecentContacts(contacts, from, panel, recentMail);
					}(paramEmailString,top._greetingcard_et);
				}catch(e){}*/
			} else {
				try{
					var param={
						type:"email",
						emails:top._greetingcard_re,
						container:document.getElementById("divContact")
					};
					top.Contacts.createAddContactsPage(param);
				}catch(e){}
			}

			paramEmailString = paramEmailString.join(",");

			showInvite = function() {
				top.Links.show("invitebymail", "&email=" + paramEmailString, true);
			}
			//if (paramEmailString != "") {
				//$("#aSms").after("<a class='toSeeEmail' href='javascript:;' onclick='showInvite();return false' style='margin-left: 20px;'>邀请好友使用139邮箱</a>");
			//}
	   } catch (e) { }  
	} else {//定时邮件
		document.getElementById("btnConfirm").style.display="";
		$("#h2Msg").html("定时贺卡设置成功");
		$("#pSaveBox").hide(); 
		$("#aSms").hide(); 
		$("#aInbox").parent().hide();
	}

    //显示广告
    try{
        top.loadAD(1162, adContainer);
    } catch (e) { }
	try{
		top.postJiFen(62,1);
	}catch(e){}
}

//加载初始化数据
function initData() {
	var materialId = Utils.queryString("materId") || 0,
		data = {
			materialId:materialId
		},
		dataXml = namedVarToXML("", data, "");

	top.M139.RichMail.API.call(getInterfaceUrl("getRecommendList"),dataXml,
		function(e){ 
		    var msg = e.responseData;
			if(msg.code == "S_OK"){
				var msg = msg["var"];

				CardResAddress = msg.address;
				showList(msg.data);
			}else{
				 window.location.href = "http://" + window.location.host + "/Error/systemTip4.html";
			}
		}
    );
}


var birthRemind = {

    showBirther: [],

    isShow: function () {
        var self = this;
        var allContacts = top.Contacts.data.birthdayContacts || [];
        //没有要过生日的好友
        if (allContacts.length == 0) {
            self.doOthers();
            return;
        }
        top.M139.RichMail.API.call("card:birthdayRemind", { op: "get" }, function (res) {
            var result = res.responseData;
            if (result.code == "S_OK") {
                self.filterBirther(result['var'].mobiles);

            } else {
                //返回不成功，不显示
                self.doOthers();
            }

        });
    },

    //过滤掉已经发过的好友
    filterBirther: function (remind) {
        //去除刚刚发送的号码
        if (top._greetingcard_bn != undefined && top._greetingcard_bn != "") {
            var sended = top._greetingcard_bn.split(',')[0];
            remind.push(sended);
        }

        var senders = top.Contacts.data.birthdayContacts;
        for (var i = 0; i < senders.length; i++) {
            //过滤没有手机号的好友
            if (!senders[i].MobilePhone || !senders[i].addrName) {
                senders.splice(i--, 1);
                continue;
            }
            //过滤已提醒的人
            for (var j = 0; j < remind.length; j++) {
                if (remind[j] == senders[i].MobilePhone) {
                    senders.splice(i--, 1);
                    break;
                }
            }
        }
        if (senders.length > 0) {
            this.showBirther = senders.slice(0, 3);
            this.takeHtmlData();
        } else {
            this.doOthers();
        }

    },

    takeHtmlData: function () {
        var addrList = [],
            self = this;
        for (var i = 0; i < self.showBirther.length; i++) {
            addrList.push(self.showBirther[i].MobilePhone);
            self.showBirther[i].ImageUrl = top.getDomain('resource') + '/m2012/images/ad/face.jpg';;
        }
        top.M2012.Contacts.API.call("QueryContactsImageUrl", { QueryContactsImageUrl: { UserNumber: top.$User.getUid(), AddrInfo: addrList.join(",") }}, function (e) {
            var res = e.responseData,
                imgUrl = "";
            if (res.ResultCode == "0" && res.ImageInfo) {
                for (var i = 0; i < res.ImageInfo.length; i++) {
                    if (res.ImageInfo[i].ImageUrl) {
                        self.showBirther[i].ImageUrl = top.getDomain('resource') + res.ImageInfo[i].ImageUrl;
                    }
                }
            }
            self.fitingHtml();
        });
    },

    template:[ '<li class="clearfix noLineT">',
 					'<a style="cursor:default"><img src="@imgurl" alt="@name" title="@name"></a>',
 					'<div class="wrapperBirthday_info">',
 						'<strong><em>@name</em>@date</strong>',
 						'<p><a href="javascript:" index="@index" type="card">发生日贺卡</a>',
                        '<span>|</span>',
                        '<a href="javascript:" index="@index" type="post">发明信片</a></p>',
 					'</div>',
 				'</li>'].join(""),

    fitingHtml: function () {
        var self = this;
        var Html = ''
        var today = top.M139.Date.getServerTime();
        var month = today.getMonth() + 1,
            day = today.getDate();
        for (var i = 0; i < this.showBirther.length; i++) {
            Html += this.template.replace(/@imgurl/g, this.showBirther[i].ImageUrl)
            .replace(/@name/g, this.showBirther[i].addrName)
            .replace(/@index/g, i);
            var birth = this.showBirther[i].BirDay;
            if (month == birth.split('-')[1] && day == birth.split('-')[2]) {
                birth = '在今天（' + month + '月' + day + '日）过生日';
            } else {
                birth = birth.split('-')[1].replace(/^0/, '') + '月' + birth.split('-')[2].replace(/^0/, '') + '日';
            }
            Html = Html.replace(/@date/, birth);
        }
        $('#birth_remind').show().find('ul').append(Html).find('a').click(function () {
                index = $(this).attr('index'),
                type = $(this).attr('type');

            top.$App.set("successBirtherData", self.showBirther[index]);
            if (type == "card") {
                top.BH('发贺卡完成-贺卡生日祝福');
                top.$App.show('greetingcard', '&successBirther=1');
            } else if (type == "post") {
                var name = top.$App.getCurrentTab().name;
                top.BH('发贺卡完成-明信片生日祝福');
                top.$App.show('postcard', '&successBirther=1&to=' + self.showBirther[index].FamilyEmail + "&sendDate=" + self.showBirther[index].BirDay + " 09:00:00");
                window.top.$App.close(name);
            }

        });
    },

    doOthers: function () {
        initData();
    }


}




//生日号码发送
function sendBrithdayNum(){
	if(top._greetingcard_bn != undefined && top._greetingcard_bn != ""){
		var dataJson = {
				op: "set",
				mobiles: top._greetingcard_bn
			},
			dataXml = namedVarToXML("", dataJson, "");
		
		top.M139.RichMail.API.call(getInterfaceUrl("birthdayRemind"), dataXml,
			function (e) {
			    top._greetingcard_bn = null;
			}
		);

		//生日提醒清理
		new ListByTemplate().cleanSelectedItem();
	}

	writeBirInfo();
}

function writeBirInfo() {
    try{
        queryUserInfo(function (o) {
            if (o && o.info && !o.info.BirDay) {
                $("#card_birthday").show();
            }
        });
    } catch (e) { }
}

//获得全路径URL
function getFullUrl(s){
    if(s.indexOf(CardResAddress) == -1) s = CardResAddress + s;
    return s;
}

function  showList(data){
    var table = $("#divRecommendCard").show();
    var inside = $("<div class=\"cardBox clr\" ></div>");

    table.empty();
    inside.append("<p><i></i>喜欢这张贺卡的用户还喜欢：</p>");
    $.each(data, function(i, item){ 
        var row = this,
			fragment = [],
			html;
		
		fragment.push("<dl><dt><a href=\"javascript:;\"><img src=\"");
		fragment.push(getFullUrl(row.materialThumbPath));
		fragment.push("\" /></a></dt><dd>");
		fragment.push(row.materialName);
		fragment.push("</dd></dl>");
		fragment = fragment.join("");
		
		html = $(fragment);
        html.find("a").click(function(e){
            window.location.href = "card_sendcard.html?materialId="+ row.materialId+"&rnd="+Math.random();
            return false;
        });
        inside.append(html);
    });
    table.append(inside);
    
	var b = $.browser;
    if (b.msie && b.version=="8.0") {
        setTimeout(function(){
            var a = $('#divRecommendCard, #divContact');
            a.hide();
            setTimeout(function(){a.show()},0);
        },667);
    }
}
