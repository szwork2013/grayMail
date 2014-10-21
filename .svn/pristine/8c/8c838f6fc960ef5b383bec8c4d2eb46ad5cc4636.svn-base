/*
添加你可能认识的人，取决于对方的设置

总是同意：

  向后台发置状态请求。DealStatus=1,OperUserType=2,name="新名字"
  取得返回的SerialId, 去修改联系人，后加载缓存

总是忽略：

  弹出验证消息对话框，确定发送。
  取输入信息并到，发置状态请求报文中。DealStatus=3, OperUserType=2

发邮件询问：

  弹出验证消息对话框，确定发送。
  取输入信息并到，发置状态请求报文中。DealStatus=2, OperUserType=1

隐藏记录:
  发置状态请求报文中。DealStatus=7, OperUserType=2
*/

//尽可能聚合顶层的对象;
var Pt = {

    sid: top.$App.getSid(),

    error: function(title, msg) {
        top.M139.Logger.getDefaultLogger().error("[" + title + "]" + msg);
    },
	
    alert: function() {
        top.$Msg.alert.apply(top.$Msg, arguments);
    },

    confirm: function(){
        top.$Msg.confirm.apply(top.$Msg, arguments);
    },

    open: function(){
        top.$Msg.open.apply(top.$Msg, arguments);
    },
	
	show:function(){
		 top.$Msg.showHTML.apply(top.$Msg, arguments);
	},
    
	modStatus: function() {
        top.Contacts.modDealStatus.apply(top.Contacts, arguments);
    },
    
    getPage: function() {
        top.Contacts.getWhoAddMePageData.apply(top.Contacts, arguments);
    },

    addContacts: function() {
        top.Contacts.OneKeyAddWAM.apply(top.Contacts, arguments);
    },
    
    param: function(key) {
        return top.$Url.queryString(key, location.href);
    },

    htmlEncode: function(str) {
        return top.$TextUtils.htmlEncode(str);
    },

    UcDomain: function(path) {
        return top.ucDomain + path;
    }
};
var C =top.Contacts;

var DealManager = {
	askOrForgetContacts: null, //需要询问的人
	oneKeyAddSucInfo : null,   //批量添加成功的人
	dealCount: 0,
    //添加
    add: function(relation, info) {
        // info=new ContactsInfo();
        // info.name
        // info.email
        // info.mobile
        // info.groupId;
        //var ff = top.FF;
        var q = { relationId: relation, dealStatus: "1", groupId: "", reqMsg: "", replyMsg: "", operUserType: "2", Name: info.name };

        if (window.isruning) {
            window.isruning = false;
            var isprod = true;
        }

        //修改待添加联系人的关系状态
        C.modDealStatus(q, function(result) {
            if (result.success) {
                top.FF.close();
                var info = result.info;
                if(info.ResultCode =="21"){
					top.FF.alert("保存失败，联系人数量已达上限。你可以<a href=\"javascript:top.FF.close();appView.show(\'addrhome\');\">管理通讯录</a>");
					return ;
                }

                //运营邮件
                if (isprod) {
                    WamProd.emailList.push(info.Email); //运营邮件发送
                    WamProd.sendEmail();
                }

				onDealed(result);
            } else {
                Pt.alert(result.msg||"添加失败",function(){top.FF.close();});
            }
        });

        //处理成功后读取联系人详细资料
        function onDealed(result) {
            C.getContactsInfoById(result.info.SerialId, function(result) {
                if (result.success) {
                    var _info = new top.ContactsInfo();
                    for (m in result.contactsInfo) {
                        _info[m] = result.contactsInfo[m];
                    }
                    onQueryed(_info);
                } else {
                }
            });
        }

        //读取成功后修改该联系人详细资料
        function onQueryed(_info) {
            var image = _info.ImageUrl || '';
            _info.name = info.name;
            _info.AddrFirstName = info.name;
            _info.FamilyEmail = info.email;
            _info.MobilePhone = info.mobile;
            _info.GroupId = info.groupId;
            _info.OverWrite = '1';
            _info.ImageUrl = image.substring(0, image.indexOf('?'));

            C.editContactDetails(_info, function(result) {
                if (result.success) {
                    C.updateCache("AddContactsDetails", { info: _info });
                    onSuccess(result);
                } else {
                    Pt.alert("添加失败");
                }
            });
        };

        //修改成功后提示、发邮件、消失头像
        function onSuccess(result) {
            Helper.disappear(relation);
            //暂时不发送添加成功后推广邮件
            //Helper.sendEmail(2, info, relation);
			top.FF.close();
            Pt.alert(ADDR_I18N[ADDR_I18N.LocalName].whoaddme['info_addsuccess']);
            Helper.stats("addcontact_agree_"+result.success);

            if(top.$Addr){                
                var master = top.$Addr;
				master.trigger(master.EVENTS.LOAD_MODULE, {
					key: 'events:contacts',
					actionKey: '110',
					contactId: relation,
					groupId: [info.groupId]
				});
                master.trigger(master.EVENTS.LOAD_MODULE, {key: 'remind:getWhoAddMe'}); 
            }
        }
    },
    addTwo: function(relation, info, ignore, isRepetition){
        top.M2012.Contacts.API.addContacts(info, function(result){
            if (result.success) {
                onSuccess(result);
            } else {
                Pt.alert(result.msg||"添加失败",function(){top.FF.close();});
            }
        });

         //修改成功后提示、发邮件、消失头像
        function onSuccess(result) {
            Helper.disappear(info.SecondUIN);
            //暂时不发送添加成功后推广邮件
            //Helper.sendEmail(2, info, relation);
            top.FF.close();            
            if(ignore == "0"){
                Pt.alert("好友请求已发出，请耐心等待" + info.name + "的确认");
            }else if(ignore == "1"){
                Pt.alert(ADDR_I18N[ADDR_I18N.LocalName].whoaddme['info_addsuccess']);

                if(top.$Addr){
                    var master = top.$Addr;
                    master.trigger(master.EVENTS.LOAD_MODULE, {
						key: 'events:contacts',
						actionKey: '110',
						contactId: relation,
						groupId: [info.groupId]
					});
                    master.trigger(master.EVENTS.LOAD_MODULE, {key: 'remind:getWhoAddMe'});
                }
            }

            Helper.stats("addcontact_agree_" + result.success);            
        }   
    },
    //忽略
    forget: function(relation, info) {
        var q = { relationId: relation, dealStatus: "3", groupId: info.groupId, reqMsg: info.reqMsg, replyMsg: "", operUserType: "2" };
        var ff = top.FF;
        C.modDealStatus(q, function(result) {
            if (result.success) {
				top.FF.close();
                Helper.disappear(relation);
                if(top.$Addr){
                    var master = top.$Addr;
                    master.trigger(master.EVENTS.LOAD_MODULE, {key: 'remind:getWhoAddMe'});
                }
            } else {
                Pt.alert("发送请求失败。");
            }
            Helper.stats("addcontact_forget_"+result.success);
        });
    },
    //询问
    ask: function(relation, info) {
        var msg = info.reqMsg.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var q = { relationId: relation, dealStatus: "2", groupId: info.groupId, reqMsg: msg, replyMsg: "", operUserType: "1" };

        if (window.isruning) {
            window.isruning = false;
            var isprod = true;
        }

        C.modDealStatus(q, function(result) {
            if (result.success) {
                Helper.disappear(relation);
                var _info = result.info;
                try {
                    info.name = _info.Name;
                    info.email = _info.Email;
                    Helper.sendEmail(info, relation);
                    Helper.stats("add");

                    //运营邮件
                    if (isprod) {
                        isprod = false;
                        WamProd.emailList.push(info.email); //运营邮件发送
                        WamProd.sendEmail();
                    }
                } catch (ex) { }

                var showName = _info.Name;
                if (showName.length == 11 && /\d+/.test(showName)) {
                    showName = showName.replace(/(?:^86)?(\d{3})\d{4}/, "$1****");
                }

                var cont = document.createElement("span");
                cont.appendChild(document.createTextNode(showName));
                var showName = cont.innerHTML;
                cont = null;
				top.FF.close();
                Pt.alert("好友请求已发出，请耐心等待" + showName + "的确认");
                
                if(top.$Addr){
                    var master = top.$Addr;
                    master.trigger(master.EVENTS.LOAD_MODULE, {key: 'remind:getWhoAddMe'});
                }
            } else {
                Pt.alert("发送请求失败。");
            }
            Helper.stats("addcontact_ask_"+result.success);
        });
    },
	//批量添加选择联系人中需要询问-忽略的
	multiAsk:function(relation, info){
		var msg = info.reqMsg.replace(/</g, "&lt;").replace(/>/g, "&gt;");
		var operUserType = info.dealstatus == "0" ? "1" :"2";
		var q = { relationId: relation, dealStatus: info.dealstatus, groupId: info.groupId, reqMsg: msg, replyMsg: "", operUserType: operUserType};
		C.modDealStatus(q, function(result) {
			if (result.success) {
				top.FF.close();
				var _info = result.info;
				try {
					info.name = _info.Name;
					info.email = _info.Email;
					Helper.sendEmail(info, relation);
					Helper.stats("add");

					WamProd.emailList.push(info.email); //运营邮件发送
				} catch (ex) { }

				var showName = _info.Name;
				if (showName.length == 11 && /\d+/.test(showName)) {
					showName = showName.replace(/(?:^86)?(\d{3})\d{4}/, "$1****");
				}

				var cont = document.createElement("span");
					cont.appendChild(document.createTextNode(showName));
				var showName = cont.innerHTML;
					cont = null;
				var currentDealIndex = DealManager.dealCount;
				var currentDealInfo = DealManager.askOrForgetContacts[currentDealIndex-1]; 
				var askForgetCount = DealManager.askOrForgetContacts.length;
				if(currentDealIndex == askForgetCount ){
					top.FF.alert("好友请求已发出，请耐心等待" + Pt.htmlEncode(currentDealInfo.name) + "的确认",function(){
						DealManager.dealCount =0; //处理完该页后dealCount = 0;
						DealManager.askOrForgetContacts = [];
						top.FF.close();
						outBindMore();
					});
					//ff.onclose = function(){top.FloatingFrame.close(); outBindMore();}
				}else{
					top.FF.confirm("好友请求已发出，请耐心等待" + showName + "的确认",
					function(){//处理下一个
						top.FF.close();
						var currentDealIndex = DealManager.dealCount;
						var currentDealInfo = DealManager.askOrForgetContacts[currentDealIndex];
						DealManager.openMultiAskPage(currentDealInfo.RelationId, currentDealInfo.name, currentDealInfo.img,currentDealInfo.DealStatus);
					},
					function(){//取消
						DealManager.dealCount =0;
						DealManager.askOrForgetContacts = [];
						//top.FF.close();
						outBindMore();
						
					},
					{"yesText":"处理下一个","noText":"关闭"});
					
				}
				
			} else {
				Pt.alert("发送请求失败。");
		    }
		    Helper.stats("addcontact_ask_"+result.success);
		});
	},

    //隐藏
    hide: function(relation, onsuccess, onfail) {
        var q = { relationId: relation, dealStatus: "7", groupId: "", reqMsg: "", replyMsg: "", operUserType: "2" };
        Pt.modStatus(q, function(result) {
            if (result.success) {
                onsuccess(result);
            } else {
                onfail();
            }
            Helper.stats("hidecontact_"+result.success);
        });
    },

	openMultiAskPage: function(relation, name, img,dealstatus){
		DealManager.dealCount++;
		var url = "/m2012/html/addr/addr_multiask.html?frame=" + frameElement.id  + 
		"&relation=" + escape(relation) +
		"&name=" + escape(name) +
		"&img=" + escape(img) +
		"&dealstatus=" + escape(dealstatus) +
		"&rnd=" + Math.random();

		var ff = top.FF.open("请求添加好友", url, 450, 310, true);
		ff.onclose = function () { top.FloatingFrame.close(); outBindMore();} //执行的就是弹出框x关闭的回调函数
	},
	//添加成功后选择分组
	addSuccUsersInGroup: function(){
		var url = "/m2012/html/addr/addr_onekeyaddingroup.html?frame=" + frameElement.id ;
		var ff = top.FloatingFrame.open("联系人分组", url, 460, 300,true);
		ff.onclose =function(){top.FloatingFrame.close(); outBindMore();}			
	},
	openNextAskPage: function(){
		top.FF.close();
		var askContacts = DealManager.askOrForgetContacts;
		var deal = DealManager.dealCount;
		if(askContacts && askContacts.length > deal){
			DealManager.openMultiAskPage(askContacts[deal].RelationId, askContacts[deal].name, askContacts[deal].img,askContacts[deal].DealStatus);
		}else{
			top.FF.close();
			outBindMore(); //一个界面所有操作完成-没有框弹出才刷新
			DealManager.dealCount = 0;
		}
	}
};

var Helper = {

    PAGESIZE: 20,
    HTML_NODATA: "<div class=\"no-data\">暂时没有可能认识的人</div>",

    //渐隐掉
    disappear: function (id, onDisappear){
        $("#lstContact li."+id).fadeOut(1200,function(){
            this.parentNode.removeChild(this);

            var total = $("#lblTotal").text();
            total = new Number(total);
            total--;
            $("#lblTotal").text(total);

            /*
            if (total <= Helper.PAGESIZE){
               // $("#lblMore").closest('.tool_bar_box').hide();
            }*/

            if (total == 0){
               $('#lstContact').parent().html(html_nodata);
            }
        });
    },

    //发送谁加了我邮件
    sendEmail: function( info, relation) {
        var data = {
            "userName": top.trueName || top.uid,
            "receiverName": info.name,
            "receiverEmail": info.email,
            "message": info.reqMsg || "无",
            "relationId": relation + "",
            "agreeStatus": "0",
            "refuseStatus": "0"
        };

        //top.WaitPannel.show();
        top.$RM.call("mail:askAddFriendToMayKnow", data, function() {
            //top.WaitPannel.hide();
        });
    },

    stats: function (type){
        var actionId={
			add: 96,
			update:96,
			refuse:95,
			agree:9553,
			forget:9553,
			agree_all:9553,
			forget_all:9553,
			addcontact_agree_true:9554,
			addcontact_ask_false:9554,
			addcontact_forget_true:9554,
			addcontact_forget_false:9554,
			hidecontact_true:9554,
			hidecontact_false:9554
		};
		var ThingId ={
			agree:1,
			forget:2,
			agree_all:3,
			forget_all:4,
			addcontact_agree_true:1,
			addcontact_ask_false:2,
			addcontact_forget_true:3,
			addcontact_forget_false:3,
			hidecontact_true:4,
			hidecontact_false:4
		};
		var Result={
				addcontact_agree_true:0,
				addcontact_ask_false:1,
				addcontact_forget_true:0,
				addcontact_forget_false:1,
				hidecontact_true:0,
				hidecontact_false:1
				
		};

		top.BH({
			actionId: actionId[type] ||0, 
			thingId:  ThingId[type]|| "0",
			moduleId: 19, 
			actionType: 10
			});
	}
};

var WamProd = {
    isSent: false,
    relationIds: null,
    emailList: [],
    isProd: function () {
        if (!this.relationIds) {
            var relationIds = Pt.param("rids");
            this.relationIds = relationIds;
        }
        return !!this.relationIds;
    },
    exec: function () {
        var _this = this;
        if (_this.isProd()) {
            _this.emailList = [];
            ridList = _this.relationIds.split("|");

            var allList = $("#lstContact input[type='checkbox']");
            allList.attr("checked", null);
            var hasItem = false;
            $(ridList).each(function (i, val) {
                var item = allList.filter("[rel='" + val + "']");
                if (item.size() > 0) {
                    item.attr("checked", true);

                    //var rev = item.attr("rev");
                    //rev = rev && rev.split("|");
                    //var email = top.$T.Email.isEmail(rev[1]);
                    //if (top.$T.Email.isEmail(rev[1])) {
                    //    _this.emailList.push(rev[1]); //邮件
                    //}

                    hasItem = true;
                }
            });

            if (hasItem) {
                //有添加好友，则发送邮件
                $("#btnAddNew").trigger("click", {
                    callback: function () {
                        _this.sendEmail();
                    },
                    isprod:true
                });
            }
            else {
                WamProd.isSent = true;

                allList.attr("checked", true);
                top.FF.alert("对不起，您已经添加过好友了，无需重复操作！");
                
                _this.logger({
                    msg: "对不起，您已经添加过好友了，无需重复操作"
                });
            }
        }
    },
    sendEmail: function () {
        var _this = this;

        if (WamProd.isSent) return; //只执行一次

        //修改状态并清理
        WamProd.isSent = true;

        if (_this.emailList.length <= 0) {
            _this.logger({
                msg: "需要发送的邮件地址为空"
            });
            return;
        }
        if (!top.tmpMailBody) {
            _this.logger({
                level: "ERROR",
                msg: "邮件内容为空"
            });
            return;
        }

        var params = {
            email: _this.emailList.join(","),
            showOneRcpt: 1, //群发单显
            subject: '来自' + top.$User.getSendName() + '好友的问候',
            content: top.tmpMailBody
        };

        top.$PUtils.sendMail(params);
        _this.emailList = [];
    },
    logger: function (options) {
        M139.Logger.sendClientLog({
            level: options.level || "INFO",
            name: "RichMailHttpClient",
            url: options.url || location.href || '',
            errorMsg: options.msg || "Not Response S_OK",
            responseText: options.responseText || ''
        });
    }
};

(function(D, N, $, C, R, log, Pt, H){
    //#region PageMsg
    var PageMsg = {},
        G = function(i){return D.getElementById(i)},
        PAGESIZE = H.PAGESIZE,
        html_nodata = H.HTML_NODATA,
        pageCount = 0,
       //bug现象：点击图片没有弹出添加联系人界面
	   //原因： 图片没有添加这个事件
	   //解决：给img外层a标签添加于"添加到通讯录"a标签一样的参数一样的响应事件
	   //添加选择框10.10-puyuhui
       //mod:lwh 13-07-18,同步模板（此段是否已作废？）
        ITEM_TEMPLATE = 
        '<li class="<%= RelationId %> clearfix">\
            <div class="box selected">\
                <dl class="clearfix">\
                <dt>\
                    <input type="checkbox" checked="checked" class="box-input" value="" rname="<%= showName %>" rel="<%= RelationId %>" req="<%= WhoAddMeSetting %>" rev="<%= UserNumber %>|<%= Email %>|<%= securityName %>">\
                    </dt>\
                    <dt class="a_parent">\
                        <a req="<%= WhoAddMeSetting %>" rel="<%= RelationId %>" rev="<%= UserNumber %>|<%= Email %>|<%= securityName %>" behavior="19_26008_1WhoKnowU添加" href="javascript:void(0)">\
                            <img src="<%= ImageUrl %>" class="pic" style="height:48px;width:48px;">\
                        </a>\
                    </dt>\
                    <dd><strong title="<%= showName %>"><%= showName %></strong></dd>\
                    <dd><%= showRelation %></dd>\
                </dl>\
                <div class="boxBtDiv" style="border-top:1px solid #EBEBEB">\
                    <span class="addRegister a_parent">\
                        <i class="plus"></i>\
                        <a req ="<%= WhoAddMeSetting %>" rel="<%= RelationId %>" rev="<%= UserNumber %>|<%= Email %>|<%= securityName %>" href="javascript:void(0)" behavior="19_26008_1WhoKnowU添加">添加到通讯录</a>\
                    </span>\
                    <a href="javascript:void(0);" class="yellowh" confirmset="0" style="display:<%= WhoAddMeSettingStyle %>" confirmSet="<%= WhoAddMeSetting %>">需验证</a>\
                </div>\
                <div class="funbox" style="display:none;"><a rel="<%= RelationId %>" href="javascript:void(0)" class="close"></a></div>\
            </div>\
        </li>',

        template = _.template($("#contactField").html()),

        DEAL_TYPE = { ASK: '0', AGREE: '1', FORGET: '2' };  //0：询问，1：同意，2：忽略
    //#endregion
    if (N) PageMsg = N[N.LocalName].whoaddme;
    
	window.outBindMore = function(newindex){
		WamObj.pageIndex=0;
		WamObj.bindMore();
		WamProd.sendEmail();
	}
	
    var WamObj = {
        pageIndex: 0,

        TEMPLATE: {
            DIRECT_RELATION: "您在他的通讯录中",
            INDIRECT_RELATION: "与您有{Count}个共同联系人"
        },
        getRelation: function (relationType, relationId,  count) {
            var TEMPLATE = this.TEMPLATE;
            relation = "";
            if ((relationType && relationType == "2") || (!relationId && parseInt(count) > 0)) {
                relation = top.$T && top.$T.format(TEMPLATE.INDIRECT_RELATION, { Count: count });
            } else {
                relation = TEMPLATE.DIRECT_RELATION;                
            }
            return relation;
        },

        bindAdd: function(){
            var usernumber = this.rev.replace(/^86/,"");
            var relationId = this.rel || 0;
            var uin = $(this).data('uin');
            var dealstatus = $(this).data('status');
            var item = $(this).closest('.rel_item');// $("#lstContact li." + relationId);
            var img = item.find("img").attr("src");

            var name = item.find("strong").attr("title");
            if (name.length == 0){
                name = item.find("strong").text(); 
            }
            var WhoAddMeSetting = $(this).attr("req");//判断隐私设置可能认识的人的状态，不需要getConfig再去查询ps

            //#region 用于运营邮件判断,好多中间变量
            if (window.isProd) {
                window.isProd = false;
                window.isruning = true;
            } else {
                window.isruning = false;
            }
            //#endregion

            switch(WhoAddMeSetting) {
                case DEAL_TYPE.ASK:
                    WamObj.DealObj.ask(relationId, name, img, uin, dealstatus, usernumber);
                    break;

                case DEAL_TYPE.AGREE:
                    WamObj.DealObj.agree(relationId, name, usernumber, uin, dealstatus);
                    break;

                case DEAL_TYPE.FORGET:
                    WamObj.DealObj.forget(relationId, name, img, uin, dealstatus, usernumber);
                    break;

                default:
                    Pt.alert(PageMsg["error_readCfgFail"]);
                    break;
            }

            top.BH('addr_remind_addContacts');
        },

        bindClose: function(){            
            var reltion = this.rel || 0;
            if($.trim(reltion) == "0"){

                var info = {};
                var item  = $(this).closest('.rel_item');
                var self = item.find('.addRegister a');
                var usernumber = self.attr('rev').replace(/^86/,"").split('|');
                var name = item.find("strong").attr("title");
                var WhoAddMeSetting = DEAL_TYPE.FORGET;

                if (name.length == 0){
                    name = item.find("strong").text(); 
                }

                info.name = name;
                info.email = usernumber[1];
                info.mobile = usernumber[0];
                info.SecondUIN = self.data('uin');
                info.DealStatus = DEAL_TYPE.FORGET; //self.data('status');

                DealManager.addTwo(reltion, info, WhoAddMeSetting);

            }else{
                DealManager.hide(reltion, function(){
                    H.disappear(reltion);
                }, function(){
                    Pt.alert("忽略联系人失败。");
                });
            }

            top.BH('addr_remind_delIcon');
            return false;
        },

        bindMore: function (event) {
            var _this = this;
            WamObj.pageIndex++;

            Pt.getPage(function(result){
                if (!result.success){
                    Pt.alert("加载失败");
                    return false;
                }

                var lst = G('lstContact');

                if(result.total <=0){
                    lst.parentNode.innerHTML = html_nodata;
                    return false;
                }

                if(WamObj.pageIndex * PAGESIZE >= result.total){//设置WamObj.pageIndex，换一组-循环查询
                    WamObj.pageIndex =0;
                }
                
                lst.innerHTML = "";//清空上一批可能认识的人
                var data = result.list, buff=[];

                //data[i]的数据字段
                //DealStatus: "0"
                //Email: "tiexg2@139.com"
                //Name: "157"
                //NameSrc: "0"
                //RelationId: "629207"
                //ReplyMsg: ""
                //ReqDate: ""
                //SerialId: "48634771"
                //UpdateFlag: "0"
                //UserNumber: "8613590330157"
                //WhoAddMeSetting -"0"
                //WhoAddMeSettingStyle -"block?none"
                //RelationLevel: 1,直接关系; 2,间接关系,有共同联系人CommonCount个
                //CommonCount: 共同联系人数量,Int

                for (var i = 0, m = data.length; i < m; i++) {
                    var item = data[i];
                    if (data[i].DealStatus != 0) continue;
                    data[i].ImageUrl = WamObj.setContactImage(data[i].ImageUrl);
                    data[i].showName = Pt.htmlEncode( WamObj.replaceStar(data[i].Name) ); //name在这里转义过了
                    data[i].securityName = data[i].Name.replace(/\"/g, "&quot;");
                    data[i].WhoAddMeSettingStyle = data[i].WhoAddMeSetting == 0 || data[i].WhoAddMeSetting == 2? "block" : "none"; 
                    data[i].showRelation = WamObj.getRelation(item.RelationLevel, item.RelationId, item.CommonCount); //直接关系还是二度关系
                    data[i].DealStatus = data[i].WhoAddMeSetting;
                    data[i].SecondUIN = data[i].UIN;

                    buff.push(template(data[i]));
                }
                
                lst.innerHTML += buff.join('');
                data = [];

                $("#lstContact li").unbind().hover(function(){
                    $(this).find(".box").addClass("hover");
                    $(this).find(".funbox").show();
                },function(){
                    $(this).find(".box").removeClass("hover");
                    $(this).find(".funbox").hide();
                });
                
                $("#lblMore").unbind("click").click(WamObj.bindMore);
                $("#lstContact .a_parent a").unbind("click").click(WamObj.bindAdd);
                $("#lstContact .funbox a").unbind("click").click(WamObj.bindClose);

                //选择可能认识的人交互
                $("#lstContact .box input.box-input").unbind("click").click(function () {
                    var divParent = $(this).parent().parent().parent();
                    if(this.checked){//选中添加背景色
                        divParent.addClass("selected");
                    }else{
                        divParent.removeClass("selected");
                    }
                });

                /*
                $("#lstContact .addRegister strong").each(function(){
                    if(this.offsetWidth > 110){
                        var txt = this.innerText || this.textContent;
                        this.title = txt;
                        while (this.offsetWidth > 110){
                            txt = txt.substring(0,txt.length-2);
                            txt = txt + "…";
                            this.innerHTML = txt;
                        }
                        //TOFIX:这里应该考虑使用折半法查找最佳截取字数。
                    }
                });
                //*/

                //新的-如果总数小于PAGESIZE则不出现换一组
                if (result.total <= PAGESIZE ){
                    G('lblMore').style.display = "none";
                    $("#lblMore").closest('.tool_bar_box').hide();
                }else{
                    G('lblMore').style.display = "block";
                 }

                //触发RelationId
                //bug现象：点击可能认识的某个人，直接进入whoaddme.htm
                //再点击“查看更多”会弹出添加某个联系人界面
                //原因:点击某个联系人进入whoaddme.htm后,relationId不为空，
                //再点击“查看更多”时触发if内部的语句
                //解决:增加window.ifFirst变量
                var qrid = Pt.param("relationId");
                var uinid = Pt.param("uinId");
                if(qrid && !window.isFirst)
                {
                    $("#lstContact .addRegister a[rel='" + qrid + "']").trigger("click");
                    window.isFirst=true;
                }else if(uinid && !window.isFirst){
                    $("#lstContact .addRegister a[uin='" + uinid + "']").trigger("click");
                    window.isFirst=true;
                }

                if (!window.isFirst) {
                    window.isFirst = true;
                    WamProd.exec(); //可能认识的人，运营邮件
                }

            }, WamObj.pageIndex, PAGESIZE);

            top.BH('addr_remind_next');
            return false;
        },

        DealObj: {
            TITLE: "请求加为好友",
            agree: function(relation, name, un, uin, status){
                var url = "addr/addr_maybeknown_add.html?frame=" + frameElement.id + 
                    "&relation=" + escape(relation) +
                    "&name=" + escape(name) +
                    "&un=" + escape(un) + 
                    "&seconduin=" + escape(uin) + 
                    "&dealstatus=" + escape(status);

                 top.FloatingFrame.open("添加联系人", url, 420, 390, true);
            },
            forget: function(relation, name, img, uin, status, un){
                var url = "addr/addr_maybeknown_forget.html?frame=" + frameElement.id + 
                    "&relation=" + escape(relation) +
                    "&name=" + escape(name) +
                    "&img=" + escape(img) + 
                    "&un=" + escape(un) + 
                    "&seconduin=" + escape(uin) + 
                    "&dealstatus=" + escape(status);

                Pt.open({ dialogTitle: this.TITLE, width:"450px",height:"310px",url: url, onclose: function(){} });
            },
            ask: function(relation, name, img, uin, status, un){
                var url = "addr/addr_maybeknown_request.html?frame=" + frameElement.id + 
                    "&relation=" + escape(relation) +
                    "&name=" + escape(name) +
                    "&img=" + escape(img) +
                    "&un=" + escape(un) + 
                    "&seconduin=" + escape(uin) + 
                    "&dealstatus=" + escape(status) +
                    "&rnd=" + Math.random();

                Pt.open({ dialogTitle: this.TITLE,width:"450px",height:"310px", url: url, onclose: function(){top.BH('addr_remind_abrogate');} });
            }
        },

        setContactImage: function(imgurl){
            var sysImgPath = ["/upload/photo/system/nopic.jpg","/upload/photo/nopic.jpg"];
            if(imgurl && imgurl.toLowerCase() != sysImgPath[0] && imgurl.toLowerCase() != sysImgPath[1]){
                imgurl = imgurl.replace('upload', 'Upload');
                imgurl = imgurl.replace('photo', 'Photo');
                return (new top.M2012.Contacts.ContactsInfo({ImageUrl: imgurl})).ImageUrl;
            }else{
                return R + "/images/face.png";
            }
        },

        //手机号变星星。
        replaceStar: function(name){
            var showName = name;
            if (name.length == 11 && /^\d+$/.test(name)){
                showName = name.replace(/(?:^86)?(\d{3})\d{4}/,"$1****");
            }
            return showName;
        }
    }

    $(function(){
		WamObj.bindMore();
		top.addBehaviorExt({ actionId:19404, thingId:0, moduleId:19 });
		//全选交换-10.10-puyuhui
		$("#chooseAllRelations").click(function(){
			$("#lstContact").find("input[type=checkbox]").attr("checked",this.checked);
			if(this.checked){//选中添加背景色
				$("li>div").addClass("selected");
			}else{
				$("li>div").removeClass("selected");
			}
			
		});
		//批量添加已选中认识的人到通讯录
		$("#btnAddNew").click(function (e,options) {
			top.addBehaviorExt({actionId:102544,thingId:0,moduleId:19});
			
			//获取数据
			var selectedContacts = $("#lstContact").find(":checked");
			var selects = selectedContacts.length;
			if(selects <=0 ){
				top.FF.alert("请选择要添加的人");
				return false;
			}
			if(selects == 1){//只选中1个认识的人，批量添加时相当于点击自己
			    //$(selectedContacts).next().click();
			    if (options && options.isprod) window.isProd = true;
			    $(selectedContacts).parent().next().find("a").click();
				return false;
			}
			
			var agreeContacts = [];//同意
			var askOrForgetContacts = []; //询问
			var privateAskFail = [] ;//隐私查询失败
			var agreeMailList = {};
		
			$(selectedContacts).each(function (e, v) {
			    var whoAddMeSetting = $(this).attr("req");
			    var info = {};
			    var rev = $(this).attr("rev").split("|");

			    info.RelationId = $(this).attr("rel");
			    info.OperUserType = "2"; //
			    info.usernumber = rev[0].replace(/^86/, "");
			    info.name = $(this).attr("rname");
			    info.img = $(this).closest("dl").find("img").attr("src");

			    agreeMailList[info.name] = rev[1]; //保存邮件地址

			    switch (whoAddMeSetting) {
			        case DEAL_TYPE.AGREE:
			            info.DealStatus = 1;
			            agreeContacts.push(info);
			            break;
			        case DEAL_TYPE.ASK:
			            info.DealStatus = 2;
			            askOrForgetContacts.push(info);
			            break;
			        case DEAL_TYPE.FORGET:
			            info.DealStatus = 3
			            askOrForgetContacts.push(info);
			            break;
			        default:
			            privateAskFail.push(info);
			            break;
			    }
			});
			
			DealManager.askOrForgetContacts =askOrForgetContacts;//记录需要验证的人
			//所有认识的人隐私查询失败，给出提示
			if(privateAskFail.length == selectedContacts.length){
				Pt.alert("对方隐私查询失败，请稍后再试！");
				return false;
			}
			var agreeContactsCount = agreeContacts.length;
            //#region 自动同意的人列表
			if(agreeContactsCount > 0){
				var requestData = [];
					requestData.push("<OneKeyAddWAM>");
					requestData.push("<UserNumber>{0}</UserNumber>".format(top.$User.getUid()));
				var relationIds = [];
				for(var i=0; i<agreeContactsCount; i++){
					var rid = agreeContacts[i].RelationId;
					if(rid){
						relationIds.push(rid);
					}
					
				}
				relationIds = relationIds.join(",");
				requestData.push("<RelationId>{0}</RelationId>".format(relationIds));
				requestData.push("</OneKeyAddWAM>");
				requestData = requestData.join("");
				
				//回调
				function oneKeyAddCallback(res){
					var res = top.M139.JSON.tryEval(res);
					var data = res.responseData;
					if(!data || data.ResultCode != 0){
						if(data.ResultCode == 21){
							Pt.alert("联系人数量已达上限！",function(){
								execAsk();
							});
							return false;
						}
						
						Pt.alert("系统繁忙，请稍后再试！",function(){
							execAsk();
						});
						return false;
					}
					//添加成功但没有返回值-或添加失败时往下执行询问
					var addInfo = data.ContactsInfo;
					if(!addInfo){
						execAsk();
						return false;
					}
					
					//一键添加可能认识的人成功或终止时 往下执行询问
					function execAsk(){
						var askInfo = DealManager.askOrForgetContacts;
						if(askInfo.length>0){
							DealManager.openMultiAskPage(askInfo[0].RelationId, askInfo[0].name, askInfo[0].img,askInfo[0].DealStatus);
						}
					}
					
					top.addBehaviorExt({actionId:102545,thingId:0,moduleId:19});
					
					//成功返回数据-添加分组
					DealManager.oneKeyAddSucInfo = addInfo;
					var html ="";
					var url = "/m2012/html/addr/addr_onekeyaddsuc.html?frame=" + frameElement.id;
					var str1 = '<iframe src="{0}" id="onekeyaddsucframe" name="onekeyaddsucframe" frameborder="0" scrolling="no" style="width:100%;height:220px;"></iframe>';
						html += str1.format(url);
					Pt.show( html, function(){ 
					//top.$Msg.showHtml( html, "系统提示","","","",function(){ 
						window.outBindMore();
						//top.FF.close();
					});

					//更新添加联系人缓存
					var upinfos=[];
					for(var i=0; i<addInfo.length;i++){
						var info = {
							SerialId:addInfo[i].SerialId,
							AddrFirstName:addInfo[i].UserName,
							MobilePhone :"",
							FamilyEmail :"",
							FirstNameword : ""
						};
						upinfos.push(info);

						var email = agreeMailList[info.AddrFirstName];
						if (email && top.$T.Email.isEmail(email)) {
						    WamProd.emailList.push(email);
						}
					}
					top.Contacts.updateCache("addMoreContacts", { contacts: upinfos});
				}
				Pt.addContacts(requestData,oneKeyAddCallback);
			}
            //#endregion
			else if (askOrForgetContacts.length > 0) {//没有whoaddmesetting=0，直接执行询问
			    DealManager.openMultiAskPage(askOrForgetContacts[0].RelationId, askOrForgetContacts[0].name, askOrForgetContacts[0].img, askOrForgetContacts[0].DealStatus);
			}
		});
		
	});

})(document, ADDR_I18N, jQuery, top.Contacts, top.resourcePath, null, Pt, Helper)

//#region 已注释代码
//NameSrc
//0：默认值，手机号；1：联系人或个人资料；2：发件人姓名；3：别名

//UpdateFlag;   1、需要更新；0、不需要更新

//DealStatus
//0－初始值（未添加、未更新）
//1－对方已同意添加请求
//2－对方未处理添加请求
//3－对方已拒绝添加请求
//4－对方已同意更新请求
//5－对方未处理更新请求
//6－对方已拒绝更新请求

//DealManager.add 的报文
//xml=<ModDealStatus><RelationId>629271</RelationId><DealStatus>1</DealStatus><GroupId></GroupId><ReqMsg></ReqMsg><ReplyMsg></ReplyMsg><OperUserType>2</OperUserType><name>张传明后台-C</name></ModDealStatus>
//<?xml version="1.0" encoding="UTF-8"?><ModDealStatusResp><ResultCode>0</ResultCode><ResultMsg>Operation Success</ResultMsg><RelationId>629271</RelationId><UserNumber>8613612840878</UserNumber><SerialId>48635081</SerialId><Name>张传明2010</Name><Email>13612840878@139.com</Email><DealStatus>1</DealStatus><ReplyMsg></ReplyMsg><ReqDate>2010-12-09 17:14</ReqDate><NameSrc>1</NameSrc><UpdateFlag>0</UpdateFlag></ModDealStatusResp>


//<Total>16</Total>
//<UserInfo>
//	<RelationId>47829887</RelationId>
//	<UserNumber>8613692278088</UserNumber>
//	<SerialId>414618235</SerialId>
//	<Name>刘小军</Name>
//	<Email>13692278088@139.com</Email>
//	<DealStatus>0</DealStatus>
//	<ReqDate></ReqDate>
//	<NameSrc>0</NameSrc>
//	<ReplyMsg></ReplyMsg>
//	<UpdateFlag></UpdateFlag>
//</UserInfo>


//DealStatus: "0"
//Email: "tiexg2@139.com"
//Name: "157"
//NameSrc: "0"
//RelationId: "629207"
//ReplyMsg: ""
//ReqDate: ""
//SerialId: "48634771"
//UpdateFlag: "0"
//UserNumber: "8613590330157"
//#endregion