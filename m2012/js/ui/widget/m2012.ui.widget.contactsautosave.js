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