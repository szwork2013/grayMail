/**
 * @fileOverview 定义通讯录自动保存联系人组件代码
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.Widget.ContactsAutoSave";

    M139.namespace(namespace, superClass.extend(
    /**@lends M2012.UI.Widget.ContactsAutoSave.prototype*/
    {
        /** 定义通讯录自动保存联系人组件代码
         *@constructs M2012.UI.Widget.ContactsAutoSave
         *@extends M139.View.ViewBase
         *@param {Object} options 初始化参数集
         *@param {String} options.type 发送类型:email|mobile|fax|mixed
         *@example
         new M2012.UI.Widget.ContactsAutoSave({
             container:document.getElementById("addrContainer"),
             type:"email",
             list:["lifula@139.com","15889394143@139.com]
         });
         */
        initialize: function (options) {
            //options.container.innerHTML = this.template;

            if (typeof options.type != "string") {
                throw "缺少参数：options.type";
            } else if (!_.isArray(options.list)) {
                throw "缺少参数：options.list,必须为Array类型";
            }

            this.type = options.type;
            this.from = options.from || this.FROM.NONE;
            this.list = options.list;
            this.subject = options.subject;

            this.model = new Backbone.Model();
            this.contactsModel = top.M2012.Contacts.getModel();
            this.api = top.M2012.Contacts.API;

            this.setElement(options.container);

            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: namespace,
        itemTemplate: '<div class="writeOk-list ContactsItem"><span class="writeOk-name ContactsAddr">{addr}</span><a hidefocus="1" class="EditContacts" rel="{index}" href="javascript:;">修改</a></div>',

        FROM: {
            NONE: 0,     //默认
            SMS: 1,      //发短信成功页
            CARD: 2,     //发贺卡成功页
            POST: 3,     //发明信片成功页
            EMAIL: 4,    //发邮件成功页
            MMS: 5,      //发彩信成功页
            FILE: 6      //发文件快递成功页
        },

        events: {
            //"clicl a.EditContacts": "onEditContactsClick"
        },
        /**构建dom函数*/
        render: function () {
            var options = this.options;
            this.initEvent();
            return superClass.prototype.render.apply(this, arguments);
        },

        renderContactsList: function (list) {
            var This = this;
            var htmlCode = ['<p class="botloine">已保存到通迅录</p>'];
            var template = this.itemTemplate;
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                var sendText = this.contactsModel.getSendText(item.AddrFirstName,this.type == "email" ? item.FamilyEmail : item.MobilePhone);
                htmlCode.push(M139.Text.Utils.format(template, {
                    index: i,
                    addr: M139.Text.Html.encode(sendText)
                }));
            }
            this.$el.html(htmlCode.join(""));

            this.$el.find("a.EditContacts").click(function (e) {
                This.onEditContactsClick(e);
            });
            this.$el.show();
        },

        /**
         *初始化事件行为
         *@inner
         */
        initEvent: function () {
            var This = this;
            this.requestAutoSave();

            this.model.on("change:items", function (sender, items) {
                This.renderContactsList(items);
            });
        },
        /**
         *自动保存联系人回调
         *@inner
         */
        onSaveRequestLoad: function (result) {
            if (result.success) {
                if (result.list && result.list.length > 0) {
                    this.model.set("items", result.list);
                    BH("composesuc_savetoaddressbook");//添加联系人上报
                }
            }
        },
        /**
         *请求自动保存联系人接口
         *@inner
         */
        requestAutoSave: function () {
            var This = this;
            top.M2012.Contacts.API.addSendContacts({
                type: this.type,
                from: this.from,
                list: this.list,
                subject: this.subject,
                autoSave: true
            }, function (result) {
                This.onSaveRequestLoad(result);
            });
        },
        /**
         *点击修改联系人
         *@inner
         */
        onEditContactsClick: function (e) {
            var This = this;
            var index = e.target.getAttribute("rel");
            var contactsEl = e.target.parentNode;
            var items = this.model.get("items");
            var c = items[index];

            if (e.target.innerHTML == "取消修改") {
                c.editView.hide();
			    this.trigger("BH_CancelModify");							
                return;
            }
			
			this.trigger("BH_Modify");

            if (!c.editView) {
                //创建一个编辑组件
                c.editView = new ContactsEditor({
                    dockElement: contactsEl,
                    type: this.type,
                    serialId: c.SerialId,
                    name: c.AddrFirstName,
                    email: c.FamilyEmail,
                    mobile: c.MobilePhone
                });
                
                c.editView.on("BH_AddGroup", function () {
                    This.trigger("BH_AddGroup");
                });
                c.editView.on("BH_DeleteContact", function () {
                    This.trigger("BH_DeleteContact");
                });
                c.editView.on("BH_Save", function () {
                    This.trigger("BH_Save");
                });
                c.editView.on("BH_Cancel", function () {
                    This.trigger("BH_Cancel");
                });

                c.editView.render();
                c.editView.on("success", function (info) {
                    top.M139.UI.TipMessage.show("修改成功", { delay: 3000 });
                    var sendText = This.contactsModel.getSendText(info.name, This.type == "email" ? info.email : info.mobile);
                    $(contactsEl).find(".ContactsAddr").text(sendText);
                }).on("delete", function () {
                    top.M139.UI.TipMessage.show("删除联系人成功", { delay: 3000 });
                    $(contactsEl).remove();
                    if (This.$(".ContactsItem").length == 0) {
                        This.$el.remove();
                    }
                }).on("hide", function () {
                    e.target.innerHTML = "修改";
                });
            }
            c.editView.show();
            e.target.innerHTML = "取消修改";
        }
    }));


    //编辑联系人组件
    var ContactsEditor = superClass.extend({
        initialize: function (options) {
            options = options || {};
            this.options = options;
            this.type = options.type;

            var $el = $(this.template);

            this.setElement($el);


            this.contactsModel = top.M2012.Contacts.getModel();
            this.api = top.M2012.Contacts.API;

            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: namespace,
        template: ['<div class="tips writeOkTips">',
 			'<div class="tips-text">',
 				'<a hidefocus="1" href="javascript:;" class="i_u_close CloseButton"></a>',
 				'<ul class="form setForm">',
                    '<li class="formLine ErrorTipContainer" style="display:none">',
                        '<label class="label"></label>',
                        '<div class="element">',
						    '<div class="red LblErrorTip">格式错误</div>',
                        '</div>',
                     '</li>',
 					'<li class="formLine">',
 						'<label class="label">姓名：</label>',
 						'<div class="element"><input maxlength="12" id="AddContacts_Name" type="text" class="iText" /><span class="ml_5 red">*</span>',
 						'</div>',
 					'</li>',
 					'<li class="formLine">',
 						'<label class="label">邮箱：</label>',
 						'<div class="element"><input maxlength="90" id="AddContacts_Email" type="text" class="iText" />',
 						'</div>',
 					'</li>',
 					'<li class="formLine">',
 						'<label class="label">手机：</label>',
 						'<div class="element"><input maxlength="20" id="AddContacts_Mobile" type="text" class="iText" />',
 						'</div>',
 					'</li>',
 					'<li class="formLine">',
 						'<label class="label">分组：</label>',
 						'<div class="element">',
 						'<div class="groupFen">',
 							'<div class="groupFenList GroupContainer">',
 								//'<p><input type="checkbox" value="" class="mr_5"><label for="">同学</label></p>',
 							'</div>	',
 							'<div class="groupBtn">	',
 								'<a href="javascript:;" class="BtnShowAddGroup">新建分组</a>',
                                '<div class="AddrGroupContainer" style="display:none">',
                                    '<input id="AddContacts_GroupName" maxlength="16" type="text" class="iText mr_5" value="" />',
                                    '<a hidefocus="1" href="javascript:;" class="btnMinOK mr_5 AddNewGroup" title="确定"></a>',
                                    '<a hidefocus="1" href="javascript:;" class="btnMincancel CancelAddGroup" title="取消"></a>',
                                '</div>',
 							'</div>',
 					'</div>',
 						'</div>',
 					'</li>',
 				'</ul>		',
 				'<div class="writeOkTipsBtn">',
 				'<a hidefocus="1" href="javascript:;" class="fr DeleteContacts">删除联系人</a>',
 				'<a hidefocus="1" href="javascript:;" class="btnNormal mr_10 SaveButton"><span>保存</span></a>',
                '<a hidefocus="1" href="javascript:void(0)" class="btnNormal CancelButton"><span>取消</span></a>',
 				'</div>',
 			'</div>',
 			'<div class="tipsTop diamond"></div>',
 		'</div>'].join(""),
        GroupItemTemplate: '<p><input id="{chkId}" type="checkbox" value="{groupId}" class="mr_5"><label for="{chkId}">{name}</label></p>',
        events: {
            "click .AddNewGroup": "onAddNewGroupClick",
            "click .DeleteContacts": "onDeleteContactsClick",
            "click .CloseButton,.CancelButton": "onCloseButtonClick",
            "click .SaveButton": "onSaveButtonClick",
            "click .BtnShowAddGroup": "onShowAddGroupClick",
            "click .CancelAddGroup": "onCancelAddGroupClick"
        },
        /**构建dom函数*/
        render: function () {

            $(this.options.dockElement).after(this.$el);

            this.renderGroupList();
            this.renderContactsInfo();


            this.initEvent();

            return superClass.prototype.render.apply(this, arguments);
        },

        /**@inner*/
        renderGroupList: function (groups) {
            var htmlCode = [];
            groups = groups || this.contactsModel.getGroupList();
            for (var i = 0; i < groups.length; i++) {
                var g = groups[i];
                htmlCode.push(M139.Text.Utils.format(this.GroupItemTemplate, {
                    groupId: g.id,
                    name: M139.Text.Html.encode(g.name),
                    chkId: "_groups_chk_" + g.id
                }));
            }
            this.$(".GroupContainer").append(htmlCode.join(""));
        },

        /**@inner*/
        renderContactsInfo: function () {
            var This = this;
            var options = this.options;
            this.$("#AddContacts_Name").val(options.name || "");
            this.$("#AddContacts_Email").val(options.email || "");
            this.$("#AddContacts_Mobile").val(options.mobile || "");
            var groups = options.groups;
            if (groups) {
                $(groups).each(function (index, groupId) {
                    This.checkedGroup(groupId);
                });
            }
            if (this.type == "email") {
                this.$("#AddContacts_Email").attr("disabled", true);
            } else if (this.type == "mobile") {
                this.$("#AddContacts_Mobile").attr("disabled", true);
            }
        },

        /**
         *点击添加组
         *@inner
         */
        onAddNewGroupClick: function () {
            var This = this;
            var groupName = this.$("#AddContacts_GroupName").val().trim();
            this.api.addGroup(groupName, function (result) {
                if (result.success) {
                    top.BH("send_email_add_group_success");
                    This.appendGroup(result.groupName, result.groupId);
                } else {
                    This.showError(result.error || result.msg);
                }
            });
        },

        /**
         *红字显示异常信息
         *@inner
         */
        showError: function (msg) {
            this.$(".ErrorTipContainer").show();
            this.$(".LblErrorTip").text(msg);
        },


        /**
         *展开添加组
         *@inner
         */
        onShowAddGroupClick: function () {
			this.trigger("BH_AddGroup");
			
            this.$(".AddrGroupContainer").show();
            this.$("#AddContacts_GroupName").val("").focus();
            this.$(".BtnShowAddGroup").hide();
        },

        /**
         *点击隐藏添加组
         *@inner
         */
        onCancelAddGroupClick: function () {
            this.hideAddGroup();
        },

        /**
         *隐藏添加组
         *@inner
         */
        hideAddGroup: function () {
            this.$(".AddrGroupContainer").hide();
            this.$(".BtnShowAddGroup").show();
        },

        /**
         *点击删除此联系人
         *@inner
         */
        onDeleteContactsClick: function () {
            var This = this;
			
			this.trigger("BH_DeleteContact");
			
            top.$Msg.confirm("是否要删除此联系人？", function () {
                This.api.deleteContacts({
                    serialId: This.options.serialId
                }, function (result) {
                    if (result.success) {
                        top.BH("send_email_delete_contact_success");
                        This.onDeleteSuccess();
                    } else if (result.error) {
                        top.$Msg.alert(result.error);
                    }
                });
            }, {
                icon:"warn"
            });
        },

        /**
         *点击x关闭
         *@inner
         */
        onCloseButtonClick:function(){
			this.trigger("BH_Cancel");
			
            this.hide();
        },

        /**
         *组选中
         *@inner
         */
        checkedGroup: function (groupId) {
            this.$("#_groups_chk_" + groupId).attr("checked", "checked");
        },

        /**
         *新建组成功后更新组的界面
         *@inner
         */
        appendGroup: function (groupName, groupId) {
            this.renderGroupList([{
                name: groupName,
                id: groupId
            }]);
            this.checkedGroup(groupId);
            this.$("#AddContacts_GroupName").val("");
            this.$(".GroupContainer")[0].scrollTop = 10000;//滚动到最下面，看到新建的组
            this.hideAddGroup();
        },

        /**
         *@inner
         */
        initEvent: function (e) {
            var This = this;

        },
        /**
         *@inner
         */
        onSaveButtonClick: function () {
            var This = this;
			
			this.trigger("BH_Save");
			
            var info = {};
            info.name = this.$("#AddContacts_Name").val();
            info.email = this.$("#AddContacts_Email").val();
            info.mobile = this.$("#AddContacts_Mobile").val();
            info.groupId = [];
            this.$("input:checkbox:checked").each(function () {
                info.groupId.push(this.value);
            });

            this.api.editContacts(this.options.serialId, info, function (result) {
                if (result.success) {
                    top.BH("send_email_modify_contact_success");
                    top.M139.UI.TipMessage.show("修改成功", { delay: 3000 });
                    This.onSuccess(info);
                } else {
                    This.showError(result.error || result.msg);
                }
            });
        },
        /**
         *@inner
         */
        onSuccess: function (info) {
            this.hide();
            this.trigger("success",info);
        },
        onDeleteSuccess: function () {
            this.remove();
            this.trigger("delete");
        }
    });

})(jQuery, _, M139);
﻿/**
 * @fileOverview 写信成功页模型层
 */
 (function(jQuery,Backbone,_,M139){
    var $ = jQuery;
    M139.namespace("M2012.Compose.Model.Success",Backbone.Model.extend({
    	name : 'composeSuccess',
    	mailInfo : {
        	to: [],
            cc: [],
            bcc: [],
            subject: '',
            action: '',
            saveToSendBox: 1,
            mid: '',
            tid: ''
        },
    	tipWords : {
        	DELIVER : '发送成功',
        	SCHEDULE : '定时邮件设置成功',
        	SAVETO : '此邮件已保存到“草稿箱”文件夹'
        },
        sendSMSId : 85,
        callApi: M139.RichMail.API.call,
        /** 
        *写信成功页公共代码
        *@constructs M2012.Compose.Model.Success
        *@param {Object} options 初始化参数集
        *@example
        */
        initialize : function(options){
        	this.pageApp = new M139.PageApplication({name : 'composeSuccess'});
        	this.initMailInfo();
        },
        // 初始化刚才发送的邮件信息
        initMailInfo : function(){
            var mailIndex = this.pageApp.inputData.index?this.pageApp.inputData.index:0;
			this.mailInfo = top.$App.getCurrentTab().data.sendList[mailIndex];
        },
        getRecevers : function(){
            var receivers = this.getReceversArray();
            return receivers.join(',');
        },

        getReceversArray: function() {
            var addrList = [];
            addrList = addrList.concat(this.mailInfo.to, this.mailInfo.cc, this.mailInfo.bcc);
            return addrList;
        },  
        _filterMail:function(mail){
            if(!$.isArray(mail)){
                mail = [mail];
            }
            return _.map(mail,function(e){return e.match(/\<?([\d\w]+@[\d\w\.]+)\>?/).slice(-1)[0]});
        },
        isShowAddAddrGroup:function(callback){
            var receivers = [],
                contacts = [],
                serialIds =[];
            var mailInfo = this.mailInfo;
            var data = top.M2012.Contacts.getModel().attributes.data;
            var groupMember = data.groupMember;
            var groups = data.groups;
            var email, contact;
            
            // 1. 若通讯录分组数量已达50个，不出现此入口
            if(groups.length > 50){
            	callback && callback(false);
            	return;
            }

            // 2. 当接收人数量（包括“收件人+抄送+密送”的总人数）大于5时，出现此入口
            receivers = receivers.concat(mailInfo.to, mailInfo.cc, mailInfo.bcc);
            if(receivers.length <= 5){
            	callback && callback(false);
            	return;
            }

            // 3. 当含有未在通讯录中接收人（包括“收件人+抄送+密送”）时，不出现此入口
            for(var i=0; i<receivers.length; i++){
            	email = top.M139.Text.Email.getEmail(receivers[i]);
            	contact = top.Contacts.getContactsByEmail(email)[0];
            	if(!contact){
            		callback && callback(false);
            		return;
            	}
            	serialIds.push(contact.SerialId);
            	contacts.push(contact);
            }

            // 4. 若所有接收人与通讯录的某一分组完全等价，不出现此入口
            var hasGroup = false;

			for(var i=0,len=groups.length; i<len; i++){
				if(groups[i].CntNum == serialIds.length){
					if( _.difference(groupMember[groups[i].id], serialIds).length === 0 ) {
						// 个数相等，且无差集
						hasGroup = true;
						break;
					}
				}
			}
			if(i == len) {
				this.set({list: contacts});
			}
			callback(!hasGroup);
        },

        getSubject : function() {
            var subject = this.mailInfo.subject;
            return subject;
        },
        //_添加VIP联系人---检查添加vip联系人提醒的条件
        checkedAddVipCondition: function(){ 
            var receiver = this.mailInfo["to"];
            if(!receiver || receiver.length == 0 || receiver.length > 2) return false; //收件人大于2人不显示
            
            var vipDetails = top.Contacts.data.vipDetails || {vipn:0,vipEmails:[]};
            var vipn = vipDetails.vipn || 0;
            var vipnMax = 10;
            if(vipn >= vipnMax) return false;  //vip联系人满10个时不显示
            
            var closeContacts = top.Contacts.data.closeContacts || []; //无紧密联系人不显示
            if(closeContacts.length == 0) return false;
            
            var saveContactsEl = document.getElementById('divSaveSendContacts');
            if(saveContactsEl && saveContactsEl.style.display == '') return false; //自动保存联系人和vip提醒不同时显示
            
            var flag = false, email = '', closeContact = {}, contacts = [], vip = [], html = '';
            for(var i = 0; i < receiver.length; i++){
                email = top.$Email.getEmail(receiver[i]);
                if($.inArray(email,vipDetails.vipEmails) == -1){ //已属于vip联系人，不再显示
                    for(var j = 0; j < closeContacts.length; j++){
                        closeContact = closeContacts[j];
                        if(closeContact.AddrContent == email){ 
                            contacts = top.Contacts.getContactsByEmail(email); //紧密联系人且存在通讯录中（排除自己），显示vip提醒
                            if(contacts.length > 0 && !top.Contacts.IsPersonalEmail(contacts[0].SerialId)){
                                vip.push({
                                    serialId: contacts[0].SerialId,
                                    name: contacts[0].name,
                                    email: email
                                });
                                flag = true;
                                break;
                            }
                        }
                    }
                }
                if(flag && vipn == vipnMax - 1 ) break; //当vip联系人只差一人就达最大值时，显示之一
            }
            this.set('vip',vip);
            return flag;
        }, 
        
        /**
         * @param type 0-获取 1-刷新 
         * @param callback 转发类型
         */
        getDeliverStatus : function(type, callback){
        	var tid = this.mailInfo.tid
    		var data = {tid : tid, sort:0, start : 0,total : 50};
    		this.callApi("mbox:getDeliverStatus", data, function(res) {
    			callback && callback(res);
	        });
        },
        /*对请求返回的投递状态进行修正：如果部分收件人的发信状态没有返回来，则默认是发送中*/
		setDefaultDeliverStatus : function(DeliverStatusResponse, arrReciver){
		     if(DeliverStatusResponse != undefined && DeliverStatusResponse.length >0 && typeof(DeliverStatusResponse[0].tos)!="undefined"){
		         DeliverStatusResponse=DeliverStatusResponse[0].tos;
		     }else{
		        DeliverStatusResponse=[];
		     }
		     var added = [];
		     if(DeliverStatusResponse.length<arrReciver.length){
		           for(var j=0;j<arrReciver.length;j++){
		                var  to=arrReciver[j];
		                var isFound=true;
		                if(DeliverStatusResponse.length==0)
		                    isFound=false;
		                    
		                for(var k=0;k<DeliverStatusResponse.length;k++){
		                    if($Email.getEmail(arrReciver[j]) == $Email.getEmail(DeliverStatusResponse[k]["mail"]) || arrReciver[j].indexOf(DeliverStatusResponse[k]["mail"])>-1){
		                        isFound=true;
		                        break;
		                    }
		                    if(k==DeliverStatusResponse.length-1){
		                         isFound=false;
		                    } 
		                }
		                if(!isFound){
		                   var obj={
		                    'lastDate':new Date(),
		                    'state':0, //正在投递中
		                    'mail': $T.Xml.encode(arrReciver[j])
		                  };
		                  added.push(obj);  
		              }
		          }
		          DeliverStatusResponse = DeliverStatusResponse.concat(added); 
		    }
		    var ret = [{tos:DeliverStatusResponse}];
		    return ret;
		},
		/*获取邮件投递状态详细信息*/
        // todo 直接从读信取
	    getDeliverDetailStatusHtml : function (DeliverStatusResponse) {
	        if (!DeliverStatusResponse)
	            return;
	        if (typeof (DeliverStatusResponse.errorCode) != "undefined") {
	            return;
	        }
	        DeliverStatusResponse = DeliverStatusResponse[0].tos;
	        
	        //详细状态
	        var sentState = {
	            state_0: "投递中",
	            state_60: "已投递到对方邮箱",
	            state_61: "已投递到对方邮箱，但被对方认定为病毒邮件",
	            state_70: "投递失败，该邮件疑似含病毒",
	            state_71: "投递失败，收件人不存在",
	            state_72: "投递失败，收件人已被冻结或注销",
	            state_73: "投递失败，服务器通信错误",
	            state_74: "投递失败，您的帐户无权向此邮件组发送邮件",
	            state_75: "投递失败，您的帐户无权向此邮件组发送邮件",
	            state_76: "投递失败，您的帐户无权向此邮件组发送邮件",
	            state_77: "投递失败，收件人帐户已被限制接收接收",
	            state_78: "投递失败，您的帐户已被限制发送邮件",
	            state_79: "投递失败，您的帐户在对方的黑名单中",
	            state_80: "投递失败，对方邮箱拒收此邮件",
	            state_81: "投递失败，服务器通信错误",
	            state_82: "投递失败，被对方邮箱判定为垃圾邮件",
	            state_83: "投递失败，被对方邮箱判定为病毒邮件",
	            state_84: "网关退信",
	            state_85: "邮件大小超时收件人设置的大小",
	            state_86: "邮箱容量已满",
	            state_87: "本域投递失败，用户反病毒，邮件作为附件来通知收件人",
	            state_88: "本域投递失败，用户分拣规则设置为直接删除",
	            state_89: "已投递到对方邮箱，对方已回复（自动回复）",
	            state_90: "已投递到对方邮箱，对方已转发（自动转发）",
	            state_91: "本域投递失败，邮件审核未通过",
	            state_99: "投递中",
	            state_100: "已投递对方服务器",
	            state_101: "投递中",
	            state_119: "投递失败",
	            state_250: "该邮件已超出发信状态查询有效期"
	        };
	        var l = DeliverStatusResponse.length;
	        var htmlCode = [];
	        for (var i = 0; i < l; i++) {

	            //收件人
	            var obj = DeliverStatusResponse[i];
	            htmlCode.push("<tr><td>");
	            var to = obj["mail"].replace(/</g, '&lt;').replace(/>/g, '&gt;');
	            htmlCode.push(to);
	            htmlCode.push("</td>");

	            //投递状态
	            htmlCode.push('<td title="');
	            var status = sentState["state_" + obj.state]; //投递状态
	            if (status == undefined) {
	                status = sentState["state_0"]
	            }
	            var label = status.toString();
	            var mailDomain = top.$App.getMailDomain();
	            if (to.indexOf(mailDomain) > -1) {
	            	if (obj.state==100) {
	            		label = "已投递到对方邮箱";
	            	}
	            }
	            htmlCode.push(label + '"') //增加title
	
	            if (label.indexOf("失败") > -1) {
	                htmlCode.push(' class="error" >');
	            } else {
	                htmlCode.push('>');
	            }
	            htmlCode.push(label);
	            htmlCode.push('</td>');
	            //time
	            htmlCode.push('<td>');
	            //格式化日期
	            //var date = obj["lastDate"]; //如果默认的数据，则是日期类型，但从RM返回来的是number
	            var date = obj["lastTime"] || obj["lastDate"];
	            if (typeof (date) == "number"){
	            	date = new Date(date * 1000);
	            }
	            console.log(date);
	            result = $Date.format("yyyy年MM月dd日(星期Week)Hour:mm", date);
	            result = result.replace(/Week/, ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]);
	
	            var h = date.getHours();
	            result = result.replace(/Hour/, h)
	            htmlCode.push(result);
	            htmlCode.push('</td></tr>');
	        }
	        return htmlCode.join("");
	    },
	    // 显示添加联系人到通讯录
	    showAddContacts : function() {
            var addrList = this.getReceversArray();

			//在rm环境下，数组 addrList 的元素可能为数组，Utils.parseSingleEmail方法只接收字符串，需要在这里提取 --add by YangShuangxi, 2010/02/03
			var getStr = function( obj ) {
				while( !obj.replace ){
					if( obj.length == 0 ) return "";
					obj = obj[0];
				}
				return obj||"";
			};
	        for(var i = 0,len = addrList.length; i < len; i++) {
				var contact = getStr(addrList[i]);
				if(contact){
					var obj = $TextUtils.parseSingleEmail(contact);
					if(obj){
						addrList[i] = obj;
					}
				}else{
					addrList.splice(i, 1);
					i--;
				}
	        }
			var paraObj = {
	            type: "email",
	            container: document.getElementById("divSaveToAddr"),
	            emails: addrList
	        };
	        // todo
	        // top.Contacts.createAddContactsPage(paraObj);
	    },
        /**
        *获取SID值
        */
        getSid: function () {
            var sid = top.$App.getSid();
            return sid;
        }
    }));
})(jQuery,Backbone,_,M139);
﻿/**
* @fileOverview 写信成功页视图层--添加好友到通信录.
* @namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Compose.View.Success.Addgroup', superClass.extend({
    	elModule : $("#randomModule"),

		templateContainer:['<strong class="writeOk_box_title">添加到分组 <span>( 写信时选择分组为收件人，轻松发给组内所有人 )</span></strong>',
			'<div class="writeOk_box_addrBas" style="height:165px;">{list}</div>',
			'<div class="writeOk_box_btn writeOk_box_btnNot clearfix">',
				'<a class="btnSetG" href="javascript:;" id="saveGroup"><span>保 存</span></a>',
			'</div>'].join(""),

		templateItem:[ '<div key="{key}" class="addrBase addrBaseNew btnNormal_write">',
			'<a class="addrBase_con" title="{email}" style="cursor:default" href="javascript:;">{name}</a>',
			'<a class="addrBase_close" title="删除" href="javascript:;">x</a>',
		'</div>'].join(""),

		templateSave:['<strong class="writeOk_box_title">已添加联系人到分组</strong>',
			'<ul class="writeOk_box_ul writeOk_box_ul_one clearfix">',
				'<li class="clearfix">',
					'<span class="writeOk_label">分组名称：</span>',
					'<div class="writeOk_element">',
						'<p>',
							'<input type="text" first="true"  maxlength="16" value="{value}" class="iText gray" name="" style="width:240px;">',
						'</p>',
						'<p class="writeOk_element_p">最多16个字符</p>',
						'<p class="clearfix writeOk_element_btn"><a href="javascript:;" class="btnSetG"><span>保 存</span></a></p>',
					'</div>',
				'</li>',
			'</ul>'].join(""),

		templateSuccess:[ '<div class="writeOk_boxOther clearfix">',
				'<i class="i_ok_min"></i>',
				'<div class="writeOk_boxOther_right">',
					'<strong>保存成功</strong>',
					'<p>{name}</p>',
				'</div>',
			'</div>'].join(""),

		templateFailed:[ '<div class="writeOk_boxOther clearfix">',
			'<i class="i_warn_min"></i>',
			'<div class="writeOk_boxOther_right">',
				'<strong>网页君开小差啦，保存不成功</strong>',
				'<p class="mt_10"><a class="btnSetG" href="javascript:;"><span>重新保存</span></a></p>',
			'</div>',
		'</div>'].join(""),

		initialize : function() {
			BH('wOk_addgroup_show');
			this.render();
		},

		//将通信录数组转化为hash表
		hashList:function(){
			var list = this.model.get('list');
			var i=0,len=list.length
			var obj = {};
			for(;i<len; i++){
				obj[i] = list[i];
			}
			this.list = obj;
			this._length = len;
		},

		// 渲染附件附件列表
		render: function(){
			var list, listStr = "";
			this.hashList();
			list = this.list;
			
			for(var i in list){
				listStr += $T.format(this.templateItem,{
					key:i,
					email:list[i].FamilyEmail,
					name:list[i].AddrFirstName
				});
			}
			container = $T.format(this.templateContainer,{list:listStr});
			this.elModule.html(container).show();		
			this.setHeight();			
			this.eventInit();		
		},

		setHeight:function(){
			var len = this._length;
			var height = Math.ceil(len/4) * 33 + 10;
			var _height = height>165?'165px':(height+'px');
			this.elModule.find('.writeOk_box_addrBas').css('height',_height);
		},

		eventInit:function(){
			var self = this;

			//处理姓名点击删除事件
			self.elModule.find('a.addrBase_close').click(function(){
				var div = $(this).parent('div[key]').remove();
				var key = 0 | div.attr('key');
				var len = --self._length;
				var a = [];
				self.list[key] = null;

				if(len==1){
					self.elModule.find('div[key]')
					    .addClass('btnNormal_writeNo')
					    .removeClass('btnNormal_write')
					    .find('a.addrBase_close').remove();
				}

			    self.setHeight();			
			});

			//添加联系人到分组
			self.elModule.find('#saveGroup').click(function(){
				BH('wOk_addgroup_save');
				self.setGroup();
			})
		},

		setGroup: function () {
			var self = this;
			var serialId = [];
			var names = [];
			var list = self.list

			for(var i in list){
				var item = list[i];
				if(!item){continue}
				var name = item.AddrFirstName || item.name || item.lowerName || '';
				names.push(name);
				serialId.push(item.SerialId);
			}		

			self.serialIds = serialId;
			value = names.join('、');
			value = value.length>16?(value.slice(0,13) + '...'):value;
			var html = $T.format(self.templateSave,{value:value});

			self.elModule.html(html).find('a').click(function(){
				BH('wOk_addgroup_savename');
				var value = self.elModule.find('input').val();
				var valid = self.isValid(value);
				if(valid){
					self.model.set('groupName',value);
					self.saveGroup(value);
				}
			});

			self.elModule.find('input').val(value).focus(function(){
				var first = $(this).attr('first');
				if(first){
				    $(this).val('').attr('first','');
				}
			}); 

			self.elModule.find('input').one('focus',function(){
				BH('wOk_addgroup_edite');
			})

	    },

	    saveGroup:function(name){
	    	var self = this;
	    	var option = {
				groupName: name,
				serialId: self.serialIds
	    	}

			top.Contacts.editGroupList(option,function(e) {
	            if(e.ResultCode == '0'){
	            	groupId = e.GroupInfo[0].GroupId;
	            	self.sucRender();

                    //更新通讯录
	            	var param = {
                        "groupName": option.groupName,
                        "serialId": option.serialId.join(","),
                        "groupId": groupId
                    }
	            	top.Contacts.updateCache("AddGroup", param);
                    top.Contacts.updateCache("CopyContactsToGroup", param);
	            }else{
	            	self.renderFailSave();
	            }
	        });       
	    },

	    isValid:function(value){
	    	var self = this;
	    	if($.trim(value) == ''){
	    		self.warnTips('请输入组名');	    		
	    		return false;
	    	}else if(top.Contacts.isExistsGroupName($.trim(value))){
	    		self.warnTips('分组名重复，请重新输入');	
	    		return false
	    	}
	    	return true;
	    },


	    warnTips:function(text){
	    	var p = this.elModule.find('p.writeOk_element_p').text(text).addClass('red');
    		setTimeout(function(){
    			p.text('最多输入16个字符').removeClass('red');
    		},3000);
	    },

	    sucRender:function(){
	    	BH('wOk_addgroup_suc');
	    	var self = this;
	    	var name = '分组名称：' + this.model.get('groupName');
	    	var html = $T.format(self.templateSuccess,{name:name});
	    	self.elModule.html(html);
	    },

	    renderFailSave:function(){
	    	var self = this;
	    	self.elModule.html(self.templateFailed).find('a').click(function(){
	    		self.render();
	    	});
	    },

	    renderSuccess:function(name){
	    	var el = self.el
	    	$(el).html(self.templateSuccess);
	    	$(el).find('input').val(self.requstBody.groupName);
	    	$(el).find('#editGroup').click(function(){
	    		var val = $(el).find('input').val();
	    		if($.trim(val) == ''){
	    			top.$Msg.alert('请输入组名');
	    		}else{
	    			top.Contacts.editGroupList(self.requstBody,function(e) {
			            if(e.ResultCode == '0'){
			            	self.requstBody.groupId = e.GroupInfo[0].GroupId;
			            	self.renderSuccess(self.requstBody.groupName)
			            }else{
			            	self.renderFailSave();
			            }
			        });   
	    		};
	    	});
	    }    
    }));
})(jQuery, _, M139);


﻿/**
* @fileOverview 信纸成功页视图层--发件人改名设置
* @namespace 
*/
(function ($, _, M139) {
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Compose.View.Success.Addvip', superClass.extend(
    {
        elModule: $("#randomModule"),
        vipTipTemple:[ '<div class="writeOk_vip clearfix">',
                    '<img src="../images/global/vipNew.png" alt="" title="">',
                    '<div class="writeOk_vip_right">',
                        '<strong>设置VIP，轻松管理TA的邮件</strong>',
                        '<ul id="writeOKVipList" class="writeOk_vip_list">',
                            '{vipTipsList}',
                        '</ul>',
                        '<p class="writeOk_vip_btn"><a id="addvip" class="btnSetG" href="javascript:;"><span>添加为VIP联系人</span></a></p>',
                    '</div>',
                '</div>'].join(""),
        vipListTemple:['<li>',
                       '<input type="checkbox" name="checkbox" id="{serialId}" vipName="{name}" checked="true" class="checkbox">',
                       '“<span>{name}</span>”&lt;{email}&gt;',
                       '</li>'].join(''),
        SucTemple:[ '<div class="writeOk_boxOther clearfix">',
                    '<i class="i_ok_min"></i>',
                    '<div class="writeOk_boxOther_right">',
                        '<strong>{vipName}已成为VIP联系人</strong>',
                        '<p>去“VIP邮件”<a href="javascript:top.appView.searchVip();">查看TA的邮件&gt;</a></p>',
                    '</div>',
                '</div>'].join(""),
        initialize: function () {
            this.render();
            this.eventInit();
            return superClass.prototype.initialize.apply(this, arguments);
        }, 
        render:function(){ //别名设置          
            var self = this;  

            var vips = self.model.get('vip');
            var vip = {}, html = '', vipTipsList = [], listHtml = '';
            for(var i=0; i<vips.length; i++){
                vip = vips[i];
                listHtml = M139.Text.Utils.format(self.vipListTemple,{
                    serialId : vip.serialId,
                    name : $TextUtils.htmlEncode(vip.name),
                    email : vip.email
                });
                vipTipsList.push(listHtml);
            }
            html = M139.Text.Utils.format(self.vipTipTemple,{
                vipTipsList : vipTipsList.join(''),
                clickEvent : "vipSuccessView.addVip();"
            });
            self.elModule.html(html).show();
        },

        eventInit:function(){
            var self = this;
            self.elModule.find('a').click(function(){
	            var checked, offset;

                top.addBehaviorExt({ actionId: 105761});
                top.$App.closeNewWinCompose();
                checked = self.elModule.find("input:checked");

                if(checked.length == 0){
                    offset = $("#writeOKVipList").offset();
                    $("#tipsBox").css({
	                    top: offset.top - 30 + "px",
	                    left: offset.left + "px"
                    }).show();
                    clearTimeout(this.tipsTimer);
                    this.tipsTimer = setTimeout(function(){
	                    $("#tipsBox").hide();
	                }, 3000);
                    return;
                }
                var serialIds = [], vipNames = [];
                $.each(checked,function(i,n){
                    serialIds.push(n.id);
                    vipNames.push(n.getAttribute('vipName'));
                });
                var options = {type:"add",notAlert:true};
                top.Contacts.submitVipContact(serialIds,function(){
                    self.sucRender(vipNames);
                },options);
            })
        },
        sucRender:function(name){
            var self = this;
            for(var i=0; i<name.length; i++){
                name[i] = '“<span class="green">' + name[i] + '</span>”';
            }
            var name = name.join(',');
            var html = $T.format(self.SucTemple,{vipName:name});
            self.elModule.html(html);
        },

        failRender:function(){
            var self = this;
            self.elModule.html(self.trueNameFailTemple).find('a').click(function(){
                self.render();
            })
        }
    }));
})(jQuery, _, M139);

﻿/**
* @fileOverview 信纸成功页视图层--主视图
* @namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Compose.View.Success.MailNotify', superClass.extend(
    {
        elModule: $("#randomModule"),
        
        mailNotifyTemple: [ '<div class="writeOk_vip clearfix">',
                    '<img src="../images/global/arrivalsNew.png" alt="" title="">',
                    '<div class="writeOk_vip_right">',
                        '<strong>有新邮件时，免费短信通知</strong>',
                        '<p class="writeOk_vip_btn"><a class="btnSetG" href="javascript:;"><span>立即开启</span></a></p>',
                    '</div>',
                '</div>'].join(""),
        mailNotifySucTemple:[ '<div class="writeOk_boxOther clearfix">',
                    '<i class="i_ok_min"></i>',
                    '<div class="writeOk_boxOther_right">',
                        '<strong>开启成功</strong>',
                        '<p>有新邮件时，{number}将收到短信提醒</p>',
                    '</div>',
                '</div>'].join(""),
        mailNotifyFailTemple:[ '<div class="writeOk_boxOther clearfix">',
                    '<i class="i_warn_min"></i>',
                    '<div class="writeOk_boxOther_right">',
                        '<strong>网页君开小差啦，保存不成功</strong>',
                        '<p class="mt_10"><a href="javascript:;" class="btnSetG"><span>重新开启</span></a></p>',
                    '</div>',
                '</div>'].join(""),
        initialize: function () {
            this.render();
            return superClass.prototype.initialize.apply(this, arguments);
        }, 
        render:function(){ //别名设置          
            var self = this;             
            self.elModule.html(self.mailNotifyTemple).show().find('a').click(function(){
                top.BH('send_email_notify');
                self.openMailNotify();
            });           
        },
        
        openMailNotify:function(){
            //恶心的发送数据，没有文档，todo
            var self = this;
            var data = [{
                notifyid:2,
                enable:true,
                notifytype:1,
                fromtype:0,
                supply:false,
                timerange:[{
                    begin:8,
                    end:22,
                    weekday:'1,2,3,4,5,6,7',
                    discription:'每天，8:00 ~ 22:00',
                    tid:'tid_0_0_0'
                }],
                emaillist:[]
            },
            {
                notifyid:1,
                enable:true,
                notifytype:1,
                fromtype:1,
                supply:false,
                timerange:[{
                    begin:8,
                    end:22,
                    weekday:'1,2,3,4,5,6,7',
                    discription:'每天，8:00 ~ 22:00',
                    tid:'tid_1_1_0'
                }],
                emaillist:[]
            }];

            top.M139.RichMail.API.call("user:updateMailNotify", { "mailnotify": data }, function (response) {
                var res = response.responseData;
                if(res.code == "S_OK"){
                    top.$App.closeNewWinCompose();
                    var html = $T.format(self.mailNotifySucTemple,{number:top.UserData.userNumber.slice(-11)})
                    self.elModule.html(html);
                }else{
                    self.elModule.html(self.mailNotifyFailTemple).find('a').click(function(){
                        self.openMailNotify();
                    });
                }
            });
        }
    }));
})(jQuery, _, M139);


﻿/**
* @fileOverview 信纸成功页视图层--主视图
* @namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Compose.View.Success.Subscribe', superClass.extend(
    {
        elModule: $("#randomModule"),
        subscriptionTemple:[ '<div class="viagreader-warp" style="width:448px;margin: 0;border: none;">',
                       '<div class="left-warp">',
                            '<h3><span>推荐阅读</span><a class="text-link" id="moreSubscript" href="javascript:;">去云邮局,查看更多&gt;&gt;</a></h3>',
                            '<ul class="viag-warp">',
                            '</ul>',
                        '</div>',
                        '<div class="right-warp" style="display:none">',
                            '<h3>手机畅享海量资讯</h3>',
                            '<a href="http://mpost.mail.10086.cn" target="_blank" id="mailApp"><img width="112" height="112" src="../images/201403/app.png"></a>',
                            '<p>点击或扫描<br>下载云邮局APP</p>',
                        '</div>',
                        '</div>'].join(""),
        subscriptionItem:['<li>',
                            '<a href="javascript:;" dataId="{id}"><img width="120" height="86" src="{src}"></a>',
                            '<p>{name}</p>',
                            '<a class="viag-btn {isSubcript}" href="javascript:top.BH(\'send_email_subscribe\');" columnId="{id}">订阅</a>',
                        '</li>'].join(""),
        failSubscript:[ '<fieldset class="boxIframeText">',
                        '<legend class="hide">开启邮件到达通知：</legend>',
                        '<div class="norTips"><span class="norTipsIco"><i class="i_warn"></i></span>',
                            '<dl class="norTipsContent">',
                                '<dt class="norTipsLine">客官，订阅君出小差拉，订阅不成功~~~<br>要不直接去<span class="orange">云邮局</span>选吧！</dt>   ',
                            '</dl>',
                        '</div>',
                        '</fieldset>',
                        '<div class="boxIframeBtn"><span class="bibText"></span><span class="bibBtn"><a class="btnSure" href="javascript:$App.show(\'googSubscription\');top.failSubscript.close();"><span>现在去</span></a></span>',
                        '</div>'].join(""),
        initialize: function () {
            this.render();
            return superClass.prototype.initialize.apply(this, arguments);
        }, 
        render:function(){        
            var i=0,len=3,listHtml = '',item,self=this;
            var list = this.model.get('list');
            if(list.length<len){return;}
            for(;i<len; i++){
                item = list[i];
                listHtml += M139.Text.Utils.format(self.subscriptionItem,{
                    src : item.journalLogo,
                    name : item.columnName,
                    id : item.sub == 0?item.columnId:'',
                    isSubcript:item.sub == 0?'':'gury-btn'
                });
            }
            self.elModule.html(self.subscriptionTemple).show().find('ul').html(listHtml).find('a[columnId]').one({
                'click':function(){
                    var item = $(this);
                    var columnId = $(this).attr('columnId');
                    if(!columnId) return;
                    self._subscript(columnId,function(){
                        item.addClass('gury-btn').text('已订阅');
                    });
                }
            });
            self.elModule.find('a[dataId]').click(function(){
                var columnId = $(this).attr('dataId');
                top.BH('send_email_subscribeGoto');                
                top.$App.show("googSubscription",{cid : columnId,comeFrom:1005})

            })
            $('#moreSubscript').click(function(){
                top.BH('send_email_subscribeMore');
                top.$App.show('googSubscription');
            })
        },
        _subscript:function(id,callback){
            var postUrl = top.getDomain('subscribeUrl') + "subscribe?sid=" + top.sid;
            var option = '{"comeFrom":503,"columnId":' + id + '}';
            top.M139.RichMail.API.call(postUrl, option,function(response){
                var res = response.responseData;
                if(res && res['body'] && res['body']['returnCode'] == 10){
                    callback();
                }else{
                    top.$Msg('订阅失败，请稍后再试！');
                }

            });                
        }
    }));
})(jQuery, _, M139);


﻿/**
* @fileOverview 信纸成功页视图层--主视图
* @namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Compose.View.Success.Aliasname', superClass.extend(
    {
        elModule: $("#randomModule"),
        aliasNameTemple:['<strong class="writeOk_box_title">别名发信，保护号码隐私</strong>',
                        '<ul class="writeOk_box_ul clearfix">',
                            '<li class="clearfix">',
                                '<span class="writeOk_label">别名：</span>',
                                '<div class="writeOk_element">',
                                    '<p>',
                                        '<input type="text" name="" maxlength="15" class="iText gray" first="true" value="例如：zhangsan">',
                                        '<span class="c_666">@139.com</span>',
                                    '</p>',
                                    '<p class="writeOk_element_p">以字母开头，5-15个字符</p>',
                                    '<p class="clearfix writeOk_element_btn"><a class="btnSetG" href="javascript:;"  id="saveName"><span>确 定</span></a><span class="gray">*别名保存后不可修改删除</span></p>',
                                '</div>',
                            '</li>',
                        '</ul>'].join(""),
        aliasNameSucTemple:[ '<div class="writeOk_boxOther clearfix">',
                    '<i class="i_ok_min"></i>',
                    '<div class="writeOk_boxOther_right">',
                        '<strong>设置成功</strong>',
                        '<p id="okName">别名发信地址：{name}</p>',
                    '</div>',
                    '</div>'].join(""),
        aliasNameFailTemple:[ '<div class="writeOk_boxOther clearfix">',
                    '<i class="i_warn_min"></i>',
                    '<div class="writeOk_boxOther_right">',
                        '<strong>网页君开小差啦，保存不成功</strong>',
                        '<p class="mt_10"><a href="javascript:;" class="btnSetG"><span>重新保存</span></a></p>',
                    '</div>',
                    '</div>'].join(""),
        initialize: function () {
            this.render();
            return superClass.prototype.initialize.apply(this, arguments);
        }, 
        render:function(){ //别名设置          
            var self = this;  
            var aliasSet = self.elModule.html(self.aliasNameTemple).show();
            var input = aliasSet.find('input'),
                saveName = aliasSet.find('#saveName');

            //事件绑定--输入验证
            input.bind({
                "keyup":function(){
                    self._clientCheckAlias(input.val());
                },
                "click":function(){
                    if($(this).attr('first')){
                        $(this).val('').attr('first','');
                    }
                }
            });

            saveName.bind({
                "click":function(){
                    top.addBehaviorExt({ actionId: 105286, thingId:0});
                    var name = input.val();
                    if(self._clientCheckAlias(name)){
                        self._setAliasName(name);
                    }
                }
            })
        },
        _clientCheckAlias: function (alias) {
            var text = "", 
                self = this,
                deaults = '例如：zhangsan';
            
            var aliasSet = self.elModule;
            var rightTips = "以字母开头，5-15个字符";
            var tips = aliasSet.find('.writeOk_element_p');
            
            var flag = false;
            if ($.trim(alias) == "" || alias == deaults) {
                text = "请输入别名帐号"
            }else if (/\s/.test(alias) || /[^A-Za-z0-9_\-\.]/.test(alias)) {  //其他字符
                text = "别名支持字符范围：0~9,a~z,“.”,“_”,“-”";
            }else if (/^[^A-Za-z]\w*/.test(alias)) {
                text = "必须以英文字母开头"; //开头非字母
            }else if(alias.length<5){
                text = "别名帐号为5-15个字符，以英文字母开头";
            }else{  //满足条件
                flag = true;
            }
            if(text){
                tips.html(text).addClass('red');
            }else{
                tips.html(rightTips).removeClass('red');
            }
            return flag;
        },
        _serverCheckAlias:function(name,callback){
            var self = this;
            M139.RichMail.API.call("user:checkAliasAction", { "alias": name }, function (response) {
                if (response && response.responseData && response.responseData.code) {
                    var res = response.responseData;
                    var code = res['code'];
                    if (code == "S_OK") {
                        callback(name);
                    } else if (code == "S_FALSE") {
                        top.$Msg.alert("登录超时，请重新登录", { delay: 3000 });
                    } else{
                        var msg = res.msg || res["var"].msg || "系统繁忙，请稍后再试。";
                        self.elModule.find('.writeOk_element_p').html(msg).addClass('red'); 
                        self.elModule.find('input:text').focus();
                    }
                }
            });
        },
        _setAliasName:function(name){
            var self = this;
            var aliasSet = self.elModule;
            self._serverCheckAlias(name,function(){
                M139.RichMail.API.call("user:updateAliasAction", { "alias": name }, function (response) {
                    if (response && response.responseData) {
                        if (response.responseData.code == 'S_OK') {
                            top.$App.trigger("userAttrChange");
                            var html = $T.format(self.aliasNameSucTemple,{name:name+'@139.com'});
                            aliasSet.html(html);
                        } else {
                            aliasSet.html(self.aliasNameFailTemple).find('a').click(function(){
                                self.render();
                            });
                        }
                    }
                });
            });
        }
    }));
})(jQuery, _, M139);


﻿/**
* @fileOverview 信纸成功页视图层--发件人改名设置
* @namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Compose.View.Success.TrueName', superClass.extend(
    {
        elModule: $("#randomModule"),
        trueNameTemple: [ '<strong class="writeOk_box_title">设置发件人姓名，让TA一眼认出我</strong>',
                    '<ul class="writeOk_box_ul clearfix">',
                        '<li class="clearfix">',
                            '<span class="writeOk_label">姓名：</span>',
                            '<div class="writeOk_element">',
                                '<p>',
                                    '<input type="text" name="" first="true" maxlength="12" class="iText gray" value="例如：zhangsan">',
                                '</p>',
                                '<p class="writeOk_element_p">最多12个字符</p>',
                                '<p class="clearfix writeOk_element_btn"><a class="btnSetG" href="javascript:;"><span>保 存</span></a></p>',
                            '</div>',
                        '</li>',
                    '</ul>'].join(""),
        trueNameSucTemple:[ '<div class="writeOk_boxOther clearfix">',
                    '<i class="i_ok_min"></i>',
                    '<div class="writeOk_boxOther_right">',
                        '<strong>设置成功</strong>',
                        '<p>发件人姓名：{name}</p>',
                    '</div>',
                    '</div>'].join(""),
        trueNameFailTemple: [ '<div class="writeOk_boxOther clearfix">',
                    '<i class="i_warn_min"></i>',
                    '<div class="writeOk_boxOther_right">',
                        '<strong>网页君开小差啦，保存不成功</strong>',
                        '<p class="mt_10"><a href="javascript:;" class="btnSetG"><span>重新保存</span></a></p>',
                    '</div>',
                    '</div>'].join(""),
        initialize: function () {
            this.render();
            return superClass.prototype.initialize.apply(this, arguments);
        }, 
        render:function(){ //别名设置          
            var self = this;  
            self.elModule.html(self.trueNameTemple).show();
            self.elModule.find('a').click(function(){
                var name = self.elModule.find('input').val();
                if(self.isSeting){
                    return;
                }
                if($.trim(name)==""){
                    var p = self.elModule.find('.writeOk_element_p');
                    p.text('请输入发件人姓名').addClass('red');
                    setTimeout(function(){
                        p.text('最多12个字符').removeClass('red');
                    },3000)
                    return;
                }
                self.isSeting = true;
                var AddrFirstName = $TextUtils.htmlEncode(name);
                var postStr = '<ModUserInfo><AddrFirstName>'+AddrFirstName+'</AddrFirstName></ModUserInfo>'
                M139.RichMail.API.call("ModUserInfo", postStr, function (response) {
                    self.isSeting = false;
                    var res = response.responseData;
                    if(res && res.ResultCode == '0'){
                        top.BH('send_email_trueNameSet');
                        top.$App.trigger("userAttrChange", {trueName: AddrFirstName});
                        self.sucRender(AddrFirstName);
                    }else{
                        self.failRender();
                    }
                });
            });
            
            self.eventInit();
        },
        sucRender:function(name){
            var self = this;
            var html = $T.format(self.trueNameSucTemple,{name:name});
            self.elModule.html(html);
        },

        failRender:function(){
            var self = this;
            self.elModule.html(self.trueNameFailTemple).find('a').click(function(){
                self.render();
            })
        },
        eventInit:function(){
            this.elModule.find('input').click(function(){
                if($(this).attr('first')){
                    $(this).val('')
                }
            })
        }
    }));
})(jQuery, _, M139);


﻿/**
* @fileOverview 信纸成功页视图层--发件人改名设置
* @namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Compose.View.Success.SaveContact', superClass.extend(
    {
        elModule: $("#addContact"),
        Temple: ['<strong class="writeOk_box_title">{title}</strong>',
                '<ul id="writeOKBoxList" class="writeOk_box_list" style="{height}">',
                '{list}',
                '</ul>',
                '{isAuto}'].join(""),
        ItemTemple:'<li email="{email}">{isAuto}<span type="name">{name}</span>&lt;<span type="email">{email}</span>&gt;</li>',
        saveTemple:['<div class="writeOk_box_btn clearfix">',
                    '<a href="javascript:top.BH(\'wOk_sContacts_save\');" id="manualSave" class="btnSetG"><span>确 定</span></a>',
                    '<a href="javascript:top.BH(\'wOk_sContacts_openauto\');" id="openAndSave" class="writeOk_box_a">开启自动保存</a>',
                    '</div>'].join(""),
        onlySaveTemple:[ '<div class="writeOk_boxOther clearfix">',
                '<i class="i_ok_min"></i>',
                '<div class="writeOk_boxOther_right">',
                    '<strong>保存成功</strong>',
                    '<p>您还可以 <a href="javascript:top.BH(\'wOk_sContacts_openauto1\');">开启自动保存</a> 下次将自动保存联系人到通讯录</p>',
                '</div>',
                '</div>'].join(""),
        onlyOpenTemple : [ '<div class="writeOk_boxOther clearfix">',
                '<i class="i_ok_min"></i>',
                '<div class="writeOk_boxOther_right">',
                    '<strong>开启成功</strong>',
                    '<p>将自动保存联系人到通讯录</p>',
                '</div>',
                '</div>'].join(""),
        failTemple: [ '<div class="writeOk_boxOther clearfix">',
                    '<i class="i_warn_min"></i>',
                    '<div class="writeOk_boxOther_right">',
                        '<strong>网页君开小差啦，保存不成功</strong>',
                        '<p class="mt_10"><a class="btnSetG" href="javascript:;"><span>重新保存</span></a></p>',
                    '</div>',
                    '</div>'].join(""),
        savedTemple: '<div class="writeOk_boxOther_bottom">已保存{name}到通讯录</div>',

      
        initialize: function () {
            this.initData();
            this.render();
            return superClass.prototype.initialize.apply(this, arguments);
        }, 
        
        initData:function(){
            var isAuto = top.Contacts.isAutoSaveContact();
            var list = this.model.getReceversArray();
            list = this._filterUnSave(list);
            this.model.set({
                list:list,
                currentItem:null,
                isAuto:isAuto
            });
        },

        render:function(){ 

            //如果是空的，则不执行下去
            var list = this.model.get('list');
            if(!list.length){return;}

            this.setHtml();
            this.eventInit();
        },

        setHtml:function(){
            var self = this;
            var listHtml = "";
            var ulHtml = "";
            var isAuto = self.model.get('isAuto')
            var list = self.model.get('list');
            var input = isAuto?'':'<input type="checkbox" checked="true" class="checkbox">';
            var isAutoHtml = isAuto?'':self.saveTemple;
            var height = list.length>5?'height:150px':'';
            var title = (isAuto?'已':'') + '保存联系人（'+list.length+'人）到通讯录'

            for(var i in list){
                listHtml += $T.format(self.ItemTemple,{
                    isAuto:input,
                    name:'"'+ list[i].name + '"',
                    email:list[i].email
                });
            }
            html = $T.format(self.Temple,{
                title:title,
                list:listHtml,
                height:height,
                isAuto:isAutoHtml
            });
            self.elModule.html(html).show().find('li:even').addClass('writeOk_hover');
            isAuto && self._aotoSave();
            var bh = isAuto?'wOk_sContacts_showauto':'wOk_sContacts_show';
            top.BH(bh);
        },

        eventInit:function(){
            var self = this;
            this.liDazzle(); 
            this.model.on('change:currentItem',function(){
                var item = self.model.get('currentItem');
                var obj = top.Contacts.getSingleContactsByEmail(item.email);
                if(obj){
                    var info = {
                        name:item.name,
                        email:item.email,
                        mobile:"",
                        groupId:[]
                    }
                    top.M2012.Contacts.API.editContacts(obj.SerialId, info, function (result) {
                        if (result.success) {                        
                            top.M139.UI.TipMessage.show("修改成功", { delay: 3000 });
                        } 
                    });
                }
            });
            $('#manualSave').click(function(){
                self._aotoSave(function(e){
                    if(e.success == true){
                        self.sucOnlySave();
                    }
                });
            });
            $('#openAndSave').click(function(){
                self._aotoSave(function(e){
                    if(e.success == true){
                        self.openAndSave(e);
                    }
                });                
            });

            $('input:checkbox').bind({
                'click':function(){
                    top.BH('wOk_sContacts_checked');
                }
            });
        },

        openAndSave:function(e){
            var self = this;
            var list = e.list;
            var name = [];
            for(var i in list){
                var nameStr = '“<span>'+list[i].AddrFirstName+'</span>”'
                name.push(nameStr);
            }
            var names = name[0];
            if(name.length>1){
                names +='等'+name.length+'位联系人';
            }
            var html = $T.format(self.savedTemple,{name:names})

            self.openAuto(function(){
                self.elModule.append(html);
            })
        },

        sucOnlySave:function(){
            var self = this;
            self.elModule.html(self.onlySaveTemple).find('a').click(function(){
                self.openAuto();
            });
        },

        openAuto:function(callback){
            var self = this;
            top.$App.setUserCustomInfoNew({9:1},function(){
                self.elModule.html(self.onlyOpenTemple);
                callback && callback();
            });
        },

        _aotoSave:function(callback){
            var self = this;
            self.liOut();
            var Domlist = self.elModule.find('li');
            var list = [];
            if(self.elModule.has('input:checkbox').length){
                Domlist = Domlist.filter(function(){return $(this).has('input:checked').length});
                if(Domlist.length == 0){
                    offset = $("#writeOKBoxList").offset();
                    $("#tipsBox").css({
	                    top: offset.top - 30 + "px",
	                    left: offset.left + "px"
                    }).show();
                    clearTimeout(this.tipsTimer);
                    this.tipsTimer = setTimeout(function(){
	                    $("#tipsBox").hide();
	                }, 3000);
                    return;
                }
            }
            list = Domlist.map(function(e){return $(this).text()}).get();
            var subject = this.model.getSubject();
            top.M2012.Contacts.API.addSendContacts({
                type: "email",
                from: 0,
                list: list,
                subject: subject,
                autoSave: true
            }, function (result) {
                console.log(result);
                callback && callback(result);
            });
        },

        liHover:function(li){
            var locked = this.model.get('lock');
            var isAuto = this.model.get('isAuto');
            if(locked){return;}
            var dom = li || this.elModule.find('li');
            var input = '<input type="text" maxlength="16" class="writeOk_box_input" value="{value}">';
            $(dom).find('span[type=name]').replaceWith(function(){
                var value = $(this).text().slice(1,-1);
                return $T.format(input,{value:value});
            });
            
            var bh = isAuto?'wOk_sContacts_hoverauto':'wOk_sContacts_hover';
            top.BH(bh);

        },

        liOut:function(li,name){
            var dom = li || this.elModule.find('li');
            var span = '<span type="name">{text}</span>';
            var input =  $(dom).find('input:text');
            input.replaceWith(function(){
                var text = '"' + (name || $(this).val()) + '"';
                return $T.format(span,{text:text});
            });
        },

        liDazzle:function(){
            var self = this;
            self.elModule.find('li').bind({
                'mouseenter':function(){
                    var locked = self.model.get('lock');
                    if(!locked){
                       self.liHover(this);
                    }
                },
                'mouseleave':function(){   
                    var locked = self.model.get('lock');
                    if(!locked){
                       self.liOut(this);
                    }
                },
                'click':function(){   
                    self.model.set('lock',true);
                    var li = this;
                    var email = $(this).attr('email');
                    if(!$(li).find('input:text').length){
                        var input = '<input type="text" maxlength="16" class="writeOk_box_input" value="{value}">';
                        $(li).find('span[type=name]').replaceWith(function(){
                            var value = $(this).text().slice(1,-1);
                            return $T.format(input,{value:value});
                        });
                    }
                    var dom   = $(this).find('input:text').addClass('writeOk_box_inputFocus').focus();
                    var name  = dom.val();  
                    var isAuto= self.model.get('isAuto');
                    var bh = 'wOk_sContacts_edite' + (isAuto?'auto':'');
                    top.BH(bh);
                    dom.bind({
                        'blur':function(){

                            self.model.set('lock',false);
                            var modifiedName = $(this).val();
                            if(name != modifiedName && isAuto){
                                self.model.set('currentItem',{email:email,name:modifiedName});
                            }
                            if($.trim(modifiedName) == ''){
                                self.liOut(li,name);
                            }else{
                                self.liOut(li);
                            }

                        },
                        'keyup':function(e){
                            if(e.keyCode == 13){

                                self.model.set('lock',false);
                                var modifiedName = $(this).val();
                                if(name != modifiedName && isAuto){
                                    self.model.set('currentItem',{email:email,name:modifiedName});
                                }
                                
                                if($.trim(modifiedName) == ''){
                                    self.liOut(li,name);
                                }else{
                                    self.liOut(li);
                                }

                            }
                        }
                    })
                }
            });
        },
        

        _filterUnSave:function(list){
            var i=0, newArr = [], email = '';
            for(i in list){
                email = this._formatEmail(list[i]);
                if(!top.Contacts.isExistEmail(email)){
                    newArr.push({
                        email:email,
                        //name:email.split('@')[0]
                        name: $TextUtils.htmlEncode($Email.getName(list[i]))
                    });
                }
            }
            return newArr;
        },

        _formatEmail:function(email){
            //return email.match(/<?([\d\w\-\.]+@[\d\w\.]+)>?/).pop();
            return email.match(/<?([^<@>]+@[\d\w\.]+)>?/).pop();
        }
    }));
})(jQuery, _, M139);


﻿/**
* @fileOverview 信纸成功页视图层--主视图
* @namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Compose.View.Success.Main', superClass.extend(
    {
        el: "body",
        name : "success",

        sendStatusTemple: [ '<table class="writeOk_table" id="divDetailStatus">',
            '<thead><tr><th width="44%">收件人</th><th width="28%">状态</th><th width="28%">时间</th></tr></thead>',
            '<tbody></tbody>',
            '<tfoot><tr><td colspan="3" class="writeOk_tableTop"></td></tr></tfoot>',
            '</table>'].join(""),
        events: {
            "click #sendSMS": "showSendSMS",// 打开发短信页面
            "click #showSendedBox": "showSendedBox",// 打开已发送 / 草稿箱
            "click #showDeliverStatus": "showDeliverStatus",// 显示投递状态
            "click #showMailBox": "showMailBox",// 打开收件箱
            "click #showCompose": "showCompose",// 打开写信页
            "click #openMailNotify": "openMailNotify"// 开启邮件到达通知
        },
        initialize: function (options) {
            this.model = options.model;
            this.render();
            return superClass.prototype.initialize.apply(this, arguments);
        }, 
        render: function () {
            this.mainRender();
            this.subRenderArr = [
                'addAddrGroup',     //添加通讯录群组
                'addVipContact'     //VIP联系人
            ];
            //random Module
            var randomItem = [
                'showAliasNameSet',     //别名设置
                'showTureNameSet',      //发件人姓名设置
                'showSubscription',     //云邮局一键订阅
                'mailNotify'            //邮件到达通知
            ];

            while (randomItem.length){
                var i = (0 | Math.random() * 100) % randomItem.length;
                this.subRenderArr.push(randomItem.splice(i,1)[0]);
            };

            this.subRender();

            $('input:text').live('click',function(){$(this).removeClass('gray')});
        },
        //主视图渲染
        mainRender:function(){
            top.$App.getCurrentTab().data.status = true;
            var action = this.model.mailInfo.action;
            if(!action){return;}
            BH({key : "composesuc_loadsuc"}); 
            this.setSatus(action);
            this.showIntegral();
            this.autoSaveContacts();
        },
        //一级模块视图---设置发信成功标题状态
        setSatus:function(action){
            var dom = $('#snedStatus');
            var html='';
            var isSave = this.model.mailInfo.saveToSendBox;
            switch(action){
                case 'deliver':
                    html ='发送成功';
                    html += isSave?'<span>邮件已保存到<a class="gray" href="javascript:top.$App.showMailbox(3);">“已发送”</a></span>':'';
                    dom.html(html);
                    break;
                case 'schedule':
                    html ='定时邮件设置成功'
                    html += '<span>邮件已保存到<a class="gray" href="javascript:top.$App.showMailbox(2);">“草稿箱”</a></span>';
                    dom.html(html);
                    $("#sendSMS").hide();
                    $("#showDeliverStatus").hide();
                    break;
            };
        },
        //一级模块---积分任务展示
        showIntegral:function(){
            var isChinaMobile = top.$User.isChinaMobileUser();
            if(!isChinaMobile)return;

            var button = $('#integral').show().find('a');
            button.eq(0).click(function(){
                top.BH('send_email_myTask');
                top.$App.show('myTask');
            });
            button.eq(1).click(function(){ 
                top.$App.closeNewWinCompose();
                top.BH('send_ok_email');  //统计发邮件完成页中，点击“用户中心”链接的人数、次数
                var url = "http://zone.mail.10086.cn/api/sso/ssoformail.ashx?to=CN201204A1&flag=1&sid=";
                top.window.open(url+top.sid);
            });
        }, 
        //二级模块优先级处理
        subRender:function(){
            var curFunction = this.subRenderArr.shift();
            curFunction && this[curFunction]();
        },
        //二级模块---添加通讯录群组(优先级1)
        addAddrGroup:function(){
            var self = this;
            var addAddrGroup;
            self.model.isShowAddAddrGroup(function(isShow){
                if(isShow){
                    addAddrGroup = new M2012.Compose.View.Success.Addgroup({model:self.model})
                }else{
                    self.subRender();
                }
            });
        },
        //二级模块---添加VIP联系人(优先级2)
        addVipContact: function(){ //添加vip联系人提醒
            var self = this;
            var isShow = self.model.checkedAddVipCondition();
            if(isShow){
                var addVip = new M2012.Compose.View.Success.Addvip({model:self.model})
            }else{
                self.subRender();
            }
        },    
        //二级模块---设置手机到达通知(优先级3~6随机)      
        mailNotify:function(){
            var self = this;
            if(!top.$User.isChinaMobileUser()){
                self.subRender();
            }
            top.M139.RichMail.API.call("user:getMailNotify", {}, function (response) {
                var res = response.responseData;
                if(res && res['code'] == 'S_OK'){
                    var data = res['var'];
                    var isOpen = $.grep(data, function (i) {
                        return (i.fromtype == 0 || i.fromtype == 1) && i.enable;
                    }).length >= 2;
                    if(isOpen){
                        self.subRender();
                    }else{
                        var mailNotify = new M2012.Compose.View.Success.MailNotify;
                    }
                }
            })
        },
        //二级模块---云邮局一键订阅(优先级3~6随机)
        showSubscription:function(){
            var self = this;
            if(!top.getDomain('subscribeUrl')){
                self.subRender();
            }
            var postUrl = top.getDomain('subscribeUrl') + "getRecommends?sid=" + top.sid;
            var option = '{"contentType":1,"size":3,"feeModel":0}'
               
            top.M139.RichMail.API.call(postUrl, option,function(response){
                var res = response.responseData;
                if(res && res['body'] && res['body']['list']){
                    var list = res['body']['list'];
                    self.model.set({list:list});
                    var subscribe = new M2012.Compose.View.Success.Subscribe({model:self.model})
                }else{
                    self.subRender();
                }
            }); 
        },    
        //二级模块---发件人姓名设置(优先级3~6随机)
        showTureNameSet:function(){
            var self = this;
            if(top.trueName || typeof top.trueName == "undefined"){
                this.subRender();
                return;
            }
            var trueName = new M2012.Compose.View.Success.TrueName
        },
        //二级模块---别名设置(优先级3~6随机)
        showAliasNameSet:function(){
            var self = this;
            var accountList = top.$User.getAccountList();
            if(accountList.length == 0 || !!top.$User.getAliasName()){ 
                self.subRender();
                return; 
            }            
            var aliasSet = new M2012.Compose.View.Success.Aliasname;
        },	
        // 自动添加联系人
        autoSaveContacts : function(){
            var self = this;
            var saveContact = new M2012.Compose.View.Success.SaveContact({model:self.model});
            return;
            
	        var autoSave = null;
            var model = self.model;

            var _subject = model.getSubject();
            var list = model.getReceversArray();

            var isAuto = top.Contacts.isAutoSaveContact();

            if(!isAuto || isAuto == '1'){

                autoSave = new M2012.UI.Widget.ContactsAutoSave({
					container:document.getElementById("divSaveSendContacts"),
					type: "email",
					list: list,
					subject: _subject
				});
				
				autoSave.on("BH_CancelModify", function() {
					top.BH("send_email_cancel_modify");
				});
				
				autoSave.on("BH_Modify", function() {
					top.BH("send_email_modify");
				});
				
				autoSave.on("BH_AddGroup", function() {
					top.BH("send_email_add_group");
				});
				
				autoSave.on("BH_DeleteContact", function() {
					top.BH("send_email_delete_contact");
				});
				
				autoSave.on("BH_Save", function() {
					top.BH("send_email_save");
				});
				
				autoSave.on("BH_Cancel", function() {
					top.BH("send_email_cancel");
				});
				
				autoSave.render();

            } else {

                top.M2012.Contacts.API.addSendContacts({
                    type: "email",
                    list: list,
                    subject: _subject
                });
            }
        },
        // 加载邮件投递状态
        loadDeliverStatusTable : function(){
            var self = this;
            self.model.getDeliverStatus(0, function(result){
                if(result.responseData['code'] == 'S_OK'){
                    self.insertDeliverStatusTable(result);
                    var newButton = ['<a href="javascript:;" class="restBtn" id="hideStatusTable">',
                    '<i class="i_writeMail"></i>发送状态</a> ',
                    '<a href="javascript:;" id="refresh" class="gray">刷新</a>'].join('');

                    $('#showDeliverStatus').replaceWith(newButton);
                    $('#refresh').click(function(){
                        self.refreshDeliverStatusTable();
                    })
                    $('#hideStatusTable').click(function(){
                        $('#divDetailStatus').hide();
                        $(this).replaceWith('<a href="javascript:;" id="showDeliverStatus"><i class="i_writeMail"></i>查看发送状态</a>');
                        $('#refresh').remove();
                    })

                }else{
                    console.log('获取邮件状态失败！');
                }
            });
        },
        // 刷新邮件投递状态
        refreshDeliverStatusTable : function(){
            var self = this; 
            self.model.getDeliverStatus(1, function(result){
                if(result.responseData['code'] == 'S_OK'){
                    self.insertDeliverStatusTable(result);
                    
                    top.M139.UI.TipMessage.show('投递状态已刷新!',{delay : 1000});
                }else{
                    console.log('刷新邮件状态失败！');
                }
            })
        },
        // 插入投递状态表格
        insertDeliverStatusTable : function(result){
            var self = this;
            var referDom = $('.writeOk_info_btn')
            var html = self.sendStatusTemple;
            var container = document.getElementById('divDetailStatus')?$('#divDetailStatus'):$(html);
            var to = self.model.mailInfo["to"];
            var cc = self.model.mailInfo["cc"] ? self.model.mailInfo["cc"] : []; //抄送
            var bcc = self.model.mailInfo["bcc"] ? self.model.mailInfo["bcc"] : []; //密送
            var arr = to;
            if (cc.length > 0) {arr = to.concat(cc);}
            if (bcc.length > 0) {arr = arr.concat(bcc);}

            var newResult = self.model.setDefaultDeliverStatus(result.responseData['var'], arr);
            var html = self.model.getDeliverDetailStatusHtml(newResult);
            container.show().find('tbody').html(html).end().insertAfter(referDom);
        },
        showSendSMS : function (){
            BH({ key: top.$App.isNewWinCompose() ? "newwin_compose_success_smstip" : "composesuc_sendmessage" });
            top.$App.closeNewWinCompose();
            var current = top.$App.getCurrentTab().name; 
            
            console.log('showSendSMS showSendSMS showSendSMS');
            var self = this;
            // todo
            var aliasName = top.$User.getAliasName();
            //var aliasName = 'tiexg';
            if (!aliasName) {
                aliasName = top.$User.getUid();
            } else {
                aliasName = String.prototype.toNormalString.call(aliasName);
            }
            var id = self.model.sendSMSId,
                sid = self.model.getSid(),
                un = aliasName,
                re = "",
                et = self.model.mailInfo.subject,
                sendSMSbt = document.getElementById("sendSMS") || null,
                getParam = "";
            var receivers = self.model.getRecevers();
			
            $($T.Email.parseEmail(receivers)).each(function() {
                re+= this.all + ";";
            })
            //合并get参数，并编码防止特殊字符
            getParam= "&id="+id+"&sid="+sid+"&un="+encodeURIComponent(aliasName)+"&re="+encodeURIComponent(re)+"&et="+encodeURIComponent(et);
            console.log(getParam);
            //frameElement.receivers = re;
            //top.Links.show("smsnotify", getParam, true);
            //top.MM.close(top.closeModuleName);
            
            top.$App.show("smsnotify", getParam);
            top.$App.close('compose');
            top.$App.close(current);
        },
        showSendedBox : function (){
            BH({ key: top.$App.isNewWinCompose() ? "newwin_compose_success_readmail" : "composesuc_seemail" });
            top.$App.closeNewWinCompose();
            var current = top.$App.getCurrentTab().name;
            
            var action = this.model.mailInfo.action;
            if(action === 'deliver'){
                top.$App.showMailbox(3);
            }else{
                top.$App.showMailbox(2);
            }
            top.$App.close('compose');
            top.$App.close(current);
        },
        showDeliverStatus : function (){    
            BH({ key: top.$App.isNewWinCompose() ? "newwin_compose_success_checksendresult" : "composesuc_seedeliverstate" });
            this.loadDeliverStatusTable();
        },
        showMailBox: function () {
            BH({ key: top.$App.isNewWinCompose() ? "newwin_compose_success_tomailbox" : "composesuc_mailbox" });
            top.$App.closeNewWinCompose();
            var current = top.$App.getCurrentTab().name;
            
            top.$App.showMailbox(1);
            top.$App.close('compose');
            top.$App.close(current);
        },
        showCompose: function () {
            BH({ key: top.$App.isNewWinCompose() ? "newwin_compose_success_continue" : "composesuc_newmail" });
            var tab = top.$App.getCurrentTab().name;
            top.$App.show('compose', { reload: true });
            top.$App.close(tab);
        }
    }));
    successModel = new M2012.Compose.Model.Success();
    successView = new M2012.Compose.View.Success.Main({model : successModel});
})(jQuery, _, M139);


