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
        	DELIVER : '邮件已经发送',
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

        getSubject : function() {
            var subject = this.mailInfo.subject;
            return subject;
        },
        
        /**
         * @param type 0-获取 1-刷新 
         * @param callback 转发类型
         */
        getDeliverStatus : function(type, callback){
    		var data = {};
    		if(type == 0){
    			data.tid = this.mailInfo.tid;
    		}else{
    			//data.mid = this.mailInfo.tid;
    			data.tid = this.mailInfo.tid;
    		}
    		data.sort = 0;
    		data.start = 0;
    		data.total = 50;
    		this.callApi("mbox:getDeliverStatus", data, function(res) {
    			if(callback){
    				callback(res);
    			}
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
	        var htmlCode = [];
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
	        var htmlHeader = '<table class="mail-tdzt">\
	              <caption id="trStatusHeader"  style="display:none">\
	              <span>发送详情：</span><a hideFocus="1" id="refreshStatus" href="javascript:successView.refreshDeliverStatusTable()">[刷新状态]</a>\
	              </caption>\
	              <thead>\
	                <tr>\
	                  <th class="t1">收件人</th>\
	                  <th class="t2">投递状态</th>\
	                  <th class="t3">时间</th>\
	                </tr>\
	              </thead>\
	              <tbody>';
	        htmlCode.push(htmlHeader);
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
	            var date = obj["lastTime"];
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
	        //footer
	        htmlCode.push('</tbody></table>');
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
* @fileOverview 信纸成功页视图层.
*@namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Compose.View.Success', superClass.extend(
        /**
        *@lends M2012.Compose.View.prototype
        */
    {
        el: "body",
        name : "success",
		vipTipTemple: ['<div class="norTips norTips-min">',
						//'<span class="norTipsIco mt_5"><img src="'+ top.m2012ResourceDomain +'/m2012/images/global/vip.png" alt="VIP联系人"></span>',
						'<div class="norTipsContent pl_15">',
						'<div class="norTipsTitle">设置VIP联系人，TA的来信单独显示！</div>',
						'<div class="norTipsLine vipPeoInfo"><ul class="pb_10">',
						'{vipTipsList}',
						'</ul></div>',
                        '<p style="margin-bottom: 10px;">设置成功后，您可在左侧“vip邮件”栏查看到TA的邮件</p>',
                        '<p class="mb_5">',
						'<a id="addvip" hidefocus="1" class="btnG" href="javascript:;" onclick="{clickEvent}">',
						'<span>一键添加VIP联系人</span></a></p>',
						'</div></div>'].join(''),
		vipListTemple:['<li class="mt_5">',
						'<input type="checkbox" name="checkbox" id="{serialId}" vipName="{name}">',
						'<label for="{serialId}"> ',
						'<span class="c_009900">“{name}”</span>&lt;{email}&gt;',
						'</label></li>'].join(''),
		addVipSucTemple:['<div class="norTips norTips-min">',
						 '<span class="norTipsIco"><i class="i_ok_min"></i></span>',
						 '<div class="norTipsContent p_relative">',
						 '<div class="norTipsTitle">添加成功！</div>',
						 '<div class="norTipsLine vipPeoInfo">添加了',
						 '{vipName}为VIP联系人，其邮件已标记为“VIP邮件”。</div>',
						 '<p class="ta_r pr_10"><a href="javascript:top.$App.show(\'addrvipgroup\');" class="linkPosition">去看看&gt;&gt;</a></p>',
						 '</div></div>'].join(''),
        aliasNameTemple:[ '<div class="alias-tips-warp alias-tab-1" style="width:350px">',
                         '<div class="alias-set">',
                             '<h2 class="alias-title">不想透露手机号码？想要个性化帐号？来设置别名吧！</h2>',
                             '<div class="alias-min">',
                                 '<span>',
                                     '<label class="label">别名：</label>',
                                 '</span>',
                                 '<span>',
                                     '<input type="text" maxlength="15" first="true" value="例：bieming" class="iText gray">',
                                 ' </span>',
                                 '<span>@139.com</span>',
                             '</div>',
                             '<div class="alias-tips">',
                                 '<p>以字母开头，5-15个字符，<span class="red">设置后不可修改删除</span>。</p>',
                             '</div>',
                             '<div class="alias-btn-warp"><a class="alias-btn" href="javascript:;" id="saveName">保存</a></div>',
                         '</div>',
                         '<div class="alias-set-ok" style="display:none">',
                             '<h2 class="alias-title"><span class="i_ok_min"></span>别名设置成功！</h2>',
                             '<p class="alias-okname">别名：<span id="okName">@139.com</span></p>',
                         '</div>',
                         '</div>'].join(""),
        subscriptionTemple:[ '<div class="viagreader-warp" style="width:448px">',
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
        trueNameTemple: [ '<div class="alias-tips-warp viagreader-tips"> <!-- 切换此节点 -->',
                    '<div class="alias-set">',
                         '<h2 class="alias-title">想让接收人一眼认出你？来设置你的发件人姓名吧！</h2>',
                         '<div class="alias-min">',
                             '<span>',
                                 '<label class="label">发件人姓名：</label>',
                             '</span>',
                             '<span>',
                                 '<input type="text" maxlength="12" class="iText gray">',
                             '</span>',
                         '</div>',
                         '<div class="alias-btn-warp"><a class="alias-btn" href="javascript:;" id="savaTrueName">保  存</a></div>',
                         '<div class="tips write-tips EmptyTips" id="trueNameTips" style="left: 76px; top: 15px; display: none;"><div class="tips-text EmptyTipsContent">姓名不能为空</div><div class="tipsBottom diamond"></div></div>',
                        '</div>',
                    '</div>'].join(""),
                     
        events: {
            "click #sendSMS": "showSendSMS",// 打开发短信页面
            "click #showSendedBox": "showSendedBox",// 打开已发送 / 草稿箱
            "click #showDeliverStatus": "showDeliverStatus",// 显示投递状态
            "click #showMailBox": "showMailBox",// 打开收件箱
            "click #showCompose": "showCompose",// 打开写信页
            "click #openMailNotify": "openMailNotify",// 开启邮件到达通知
            "click #closeWin": "closeWin"// 开启邮件到达通知
        },
        initialize: function (options) {
            this.model = options.model;
            this.render();
            return superClass.prototype.initialize.apply(this, arguments);
        },        

        // 根据操作类型渲染页面
        render : function () {
            //页面主内容渲染
            this.mainRender();

            //页面副内容，只显示一个模块，下面是显示优先级
            this.subRenderArr = [
                'addVipContact'   //VIP联系人                
            ];
            //这是随机注入的显示内容
            var randomItem = ['showAliasNameSet','tureNameSet','showSubscription','mailNotify']   //别名设置，发件人姓名设置，云邮局一键订阅;
            while (randomItem.length){
                var i = (0 | Math.random() * 100) % randomItem.length;
                this.subRenderArr.push(randomItem.splice(i,1)[0]);
            }

            this.subRender();
        },

        mainRender:function(){
            top.$App.getCurrentTab().data.status = true;
            var action = this.model.mailInfo.action;
            if(!action){
                return;
            }
            var self = this;
            var tipObj = $("#tipWords");
            if (top.$App.isNewWinCompose()) {
                $("#closeWin").show();
            }
            if(action === 'deliver'){
                tipObj.html(self.model.tipWords.DELIVER);
                //$("#sendSMS").show();
                $("#showDeliverStatus").show();
                //self.loadDeliverStatusTable();
            }else if(action === 'schedule'){
                tipObj.html(self.model.tipWords.SCHEDULE);
                $("#saveMail").html(self.model.tipWords.SAVETO);
                $("#sendSMS").hide();
                $("#showDeliverStatus").hide();
            }else{
                console.log('未知的操作类型action :'+action);
            }
            
            if($Url.queryString("attachs")){
                //如果有附件则显示附件
                var html = '附件已自动保存到您的附件夹，<a href="javascript:top.BH(\'send_email_attach\'); top.$App.show(\'diskDev\', {from:\'attachment\'})">点击查看&gt;&gt;</a>'
                $("#saveMail").html(html);
            }
            if($Url.queryString('hasLargeAttach')){
	            //如果有超大附件显示
                var html = '超大附件已保存至彩云网盘，稍后进入网盘查看'
                $("#saveLargeAttach").html(html).show();
            }
            // 是否显示邮件以保存到已发送
            if(this.model.mailInfo.saveToSendBox){
                $("#saveMail").show();
            }else{
                $("#saveMail").hide();
            }            
            BH({key : "composesuc_loadsuc"});            
            self.gotoUserCenter();            
            this.autoSaveContacts();
        },

        subRender:function(){
            var self = this;
            var curFunction = self.subRenderArr.shift();
            curFunction && self[curFunction]();
        },
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
                        $('#mailNotify').show().find('#openMailNotify').click(function(){
                            top.BH('send_email_notify');
                            self.openMailNotify();
                        })
                    }
                }
            })

        },
        openMailNotify:function(){
            //恶心的发送数据，没有文档，todo
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
                    $('#mailNotify').hide();
                    $("#openMailNotifySuc").show();
                }
            });
        },

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
                    self.subscriptionRender(list);
                }else{
                    self.subRender();
                }
            }); 
        },    
        subscriptionRender:function(list){
            var i=0,len=3,listHtml = '',item,self=this;
            if(list.length<len){
                self.subRender();
                return;
            }
            for(;i<len; i++){
                item = list[i];
                listHtml += M139.Text.Utils.format(self.subscriptionItem,{
                    src : item.journalLogo,
                    name : item.columnName,
                    id : item.sub == 0?item.columnId:'',
                    isSubcript:item.sub == 0?'':'gury-btn'
                });
            }
            $('#subRender').html(self.subscriptionTemple).find('ul').html(listHtml).find('a[columnId]').one({
                'click':function(){
                    var item = $(this);
                    var columnId = $(this).attr('columnId');
                    if(!columnId) return;
                    self._subscript(columnId,function(){
                        item.addClass('gury-btn').text('已订阅');
                    });
                }
            });
            $('#subRender').find('a[dataId]').click(function(){
                var columnId = $(this).attr('dataId');
                top.BH('send_email_subscribeGoto');                
                top.$App.show("googSubscription",{cid : columnId,comeFrom:1005})

            })
            $('#mailApp').click(function(){
                top.BH('send_email_subscribePic');
            });
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
        },

        tureNameSet:function(){
            var self = this;
            if(top.trueName || typeof top.trueName == "undefined"){
                this.subRender();
            }else{
                $('#subRender').html(self.trueNameTemple);
                $('#savaTrueName').click(function(){
                    var name = $('#subRender input').val();
                    if(self.isSeting){
                        return;
                    }
                    self.isSeting = true;
                    var AddrFirstName = top.$TextUtils.htmlEncode(name);
                    var postStr = '<ModUserInfo><AddrFirstName>'+AddrFirstName+'</AddrFirstName></ModUserInfo>'
                    M139.RichMail.API.call("ModUserInfo", postStr, function (response) {
                        self.isSeting = false;
                        var res = response.responseData;
                        if(res && res.ResultCode == '0'){
                            top.BH('send_email_trueNameSet');
                            top.$App.trigger("userAttrChange", {trueName: AddrFirstName})
                            top.M139.UI.TipMessage.show('发件人姓名保存成功',{delay:2000});
                        }else{
                            top.M139.UI.TipMessage.show('保存失败，请稍后再试',{className:'msgRed',delay:2000});
                        }
                    });
                })
            }
        },

        showAliasNameSet:function(){ //别名设置
            var self = this;
            var accountList = top.$User.getAccountList();
            if(accountList.length == 0 || !!top.$User.getAliasName()){ 
                self.subRender();
                return; 
            }
            
            var aliasSet = $('#aliasSet').html(self.aliasNameTemple).show();
            var input = aliasSet.find('input'),
                saveName = aliasSet.find('#saveName')

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
            var text = "", self = this;
            
            var aliasSet = $('#aliasSet');
            var rightTips = "以字母开头，5-15个字符，<span class='red'>设置后不可修改删除</span>。";
            var tips = aliasSet.find('.alias-tips p');
            
            var flag = false;
            if ($.trim(alias) == "" || alias == "例：bieming") {
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
                tips.html('<span class="i_warn_min"></span>' + text).addClass('red');
            }else{
                tips.html(rightTips).removeClass('red');
            }
            return flag;
        },
        _serverCheckAlias:function(name,callback){
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
                        $('#aliasSet').find('.alias-tips p').html('<span class="i_warn_min"></span>'+msg).addClass('red');
                    }
                }
            });
        },

        _setAliasName:function(name){
            var self = this;
            self._serverCheckAlias(name,function(){
                M139.RichMail.API.call("user:updateAliasAction", { "alias": name }, function (response) {
                    if (response && response.responseData) {
                        if (response.responseData.code == 'S_OK') {
                            top.$App.trigger("userAttrChange");
                            $('#aliasSet').find('.alias-set').hide();
                            $('#aliasSet').find('.alias-set-ok').show().find('#okName').text(name + "@139.com")
                        } else {
                            $('#aliasSet').find('.alias-tips p').html('<span class="i_warn_min"></span>'+response.responseData.msg).addClass('red');
                        }
                    }
                });


            });
        },

        //点击图片打开用户中心页面
		gotoUserCenter: function () {
		    var self = this;
            var isMobileUser = $Mobile.isChinaMobile(top.$User.getShortUid());  //判断是不是移动用户
            if (isMobileUser) {
                if (top.SiteConfig.footballUrl) {
                    var showed = top.$App.getUserCustomInfo('footBall');
                    var now = top.M139.Date.getServerTime().format('yyyyMMdd');
                    if (now != showed) {
                        top.addBehaviorExt({ actionId: 104614, thingId: 2 });
                        top.$App.setUserCustomInfoNew({ footBall: now }, function () {
                            var tips = '<a href="javascript:top.addBehaviorExt({ actionId: 104614, thingId: 1 });top.$App.show(\'football\',\'&flag=6%2F' + now + '\');" style="display:inline-block; margin-bottom:10px;"><img src="../images/201312/foot2014_03.jpg" alt="" title=""></a>';
                            $('#gotoUserCenter1').replaceWith(tips);
                        })
                    } else {
                        self._gotoUserCenter();
                    }
                }else{
                    self._gotoUserCenter();
                }
            }
		},
		_gotoUserCenter: function () {
		    var userCenter = $('#gotoUserCenter').show();
            userCenter.find('a').eq(0).click(function () {
		        top.$App.closeNewWinCompose();
		        top.BH('send_ok_email');  //统计发邮件完成页中，点击“用户中心”链接的人数、次数
		        var url = "http://zone.mail.10086.cn/api/sso/ssoformail.ashx?to=CN201204A1&flag=1&sid=";
		        url += top.$App.getSid();
		        top.window.open(url);
		    });

            userCenter.find('a').eq(1).click(function(){
                top.BH('send_email_myTask');
                top.$App.show('myTask');
            })
		
		},
		//检查添加vip联系人提醒的条件
		checkedAddVipCondition: function(){ 
			var receiver = this.model.mailInfo["to"];
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
			this.model.set('vip',vip);
			return flag;
		},
		
		addVipContact: function(){ //添加vip联系人提醒
			var self = this;
			if(self.checkedAddVipCondition()){
				var vips = self.model.get('vip');
				var vip = {}, html = '', vipTipsList = [], listHtml = '';
				for(var i=0; i<vips.length; i++){
					vip = vips[i];
					listHtml = M139.Text.Utils.format(self.vipListTemple,{
						serialId : vip.serialId,
						name : top.$TextUtils.htmlEncode(vip.name),
						email : vip.email
					});
					vipTipsList.push(listHtml);
				}
				html = M139.Text.Utils.format(self.vipTipTemple,{
					vipTipsList : vipTipsList.join(''),
					clickEvent : "successView.addVip();"
				});
				$('#divAddVipContacts').html(html).show();
			}else{
                self.subRender();
            }
		},
		
        addVip: function(el){
            top.addBehaviorExt({ actionId: 105761});
			top.$App.closeNewWinCompose();
			var checked = $('#divAddVipContacts').find("input:checked");
			if(checked.length == 0){
				top.$Msg.alert('请先选择联系人');
				return;
			}
			var serialIds = [], vipNames = [], self = this;
			$.each(checked,function(i,n){
				serialIds.push(n.id);
				vipNames.push(n.getAttribute('vipName'));
			});
			var options = {type:"add",notAlert:true};
			top.Contacts.submitVipContact(serialIds,function(){
				self.addVipContactSuc(vipNames);
			},options);
        },
        
        addVipContactSuc : function(vipNames){
			var self = this;
			var nameHtml = '';
			for(var i=0; i<vipNames.length; i++){
				if(i>0) nameHtml += '，';
				nameHtml += '<span class="c_009900">“'+ top.$TextUtils.htmlEncode(vipNames[i]) +'”</span>';
			}
			var html = M139.Text.Utils.format(self.addVipSucTemple,{vipName : nameHtml}); 
			$('#divAddVipContacts').html(html);
        },
		
        // 自动添加联系人
        autoSaveContacts : function(){
            var self = this;
	        var autoSave = null;
            var model = self.model;

            var _subject = model.getSubject();
            var list = model.getReceversArray();

            var isAuto = top.$App.getUserCustomInfo(9);

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
                
                /*new M2012.UI.Widget.ContactsManuallySave({
                    container:document.getElementById("divSaveSendContacts"),
                    type: "email",
                    list: list,
                    subject: _subject
                }).render();*/
                
                //console.log('手动保存联系人暂时不支持！！！');
                //todo 手动保存联系人
                //$("#divSaveToAddr").show();
                //self.model.showAddContacts();
            }
        },
        // 加载邮件投递状态
        loadDeliverStatusTable : function(){
            var self = this;
            self.model.getDeliverStatus(0, function(result){
                if(result.responseData['code'] == 'S_OK'){
                    self.insertDeliverStatusTable(result);
                    var olink = $("#showDeliverStatus");
                    olink.html('隐藏发送状态');
                }else{
                    console.log('获取邮件状态失败！');
                }
            });
            
            /*var options = {tid : self.model.mailInfo.tid, rcptFlag : 1};
            deliverystatusview = new M2012.DeliveryStatus.View({el:$("#divDetailStatus")[0]});
            deliverystatusview.model.set(options);
            deliverystatusview.render();*/
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
            var obStatusInfo = $("#divDetailStatus");
            var receiver = self.model.mailInfo["to"];
            var cc = self.model.mailInfo["cc"] ? self.model.mailInfo["cc"] : []; //抄送
            var bcc = self.model.mailInfo["bcc"] ? self.model.mailInfo["bcc"] : []; //密送
            var arr = receiver;
            if (cc.length > 0) {
                arr = receiver.concat(cc);
            }
            if (bcc.length > 0) {
                arr = arr.concat(bcc);
            }
            var newResult = self.model.setDefaultDeliverStatus(result.responseData['var'], arr);
            var html = self.model.getDeliverDetailStatusHtml(newResult);
            obStatusInfo.html(html).show();
            $("#refreshStatus")[0].href = "javascript:successView.refreshDeliverStatusTable()";
            $("#trStatusHeader").show();
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
            var obStatusInfo = $("#divDetailStatus");
            var olink = $("#showDeliverStatus");
            if (obStatusInfo.html() != "" && obStatusInfo.is(":visible")) {
                obStatusInfo.hide();
                olink.html('查看发送状态');
                return;
            }
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
            // todo 无法打开新页
            top.$App.show('compose', { reload: true });
            top.$App.close(tab);
        },
        closeWin: function () {
            BH({ key: "newwin_compose_success_close" });
            top.window.close();
        }
    }));
    successModel = new M2012.Compose.Model.Success();
    successView = new M2012.Compose.View.Success({model : successModel});
})(jQuery, _, M139);


