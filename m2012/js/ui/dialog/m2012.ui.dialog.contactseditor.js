/**
 * @fileOverview 定义添加联系人对话框
 */

 (function(jQuery,_,M139){
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.Dialog.ContactsEditor";

    M139.namespace(namespace,superClass.extend(
    /**@lends M2012.UI.Dialog.ContactsEditor.prototype*/
    {
       /** 定义通讯录地址本组件代码
        *@constructs M2012.UI.Dialog.ContactsEditor
        *@extends M139.View.ViewBase
        *@param {Object} options 初始化参数集
        *@param {String} options.serialId 联系人id
        *@param {String} options.name 联系人姓名
        *@param {String} options.mobile 联系人手机号
        *@param {String} options.email 联系人邮件地址
        *@example
        */
        initialize: function (options) {
            options = options || {};
            this.options = options;
            this.filter = options.filter;

            this.contactsModel = M2012.Contacts.getModel();

            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: namespace,
        template:[ '<div class="boxIframeText">',
 			'<p class="mt_10 Lbl_Tip" style="margin-left:25px; display:none;"></p>',
             '<ul class="form groupFenDiv">',
                 '<li class="formLine ErrorTipContainer" style="display:none">',
                    '<label class="label"></label>',
                    '<div class="element">',
						'<div class="red LblErrorTip">格式错误</div>',
                    '</div>',
                 '</li>',
                 '<li class="formLine">',
                     '<label class="label">姓名：</label>',
                     '<div class="element">   ',
 						'<input maxlength="12" id="AddContacts_Name" type="text" class="iText" /> <span class="red">*</span>',
                     '</div>',
                 '</li>',
                 '<li class="formLine">',
                     '<label class="label">邮箱：</label>',
                     '<div class="element">       ',
 						'<input maxlength="90" id="AddContacts_Email" type="text" class="iText" />',
                     '</div>',
                 '</li>',
 				'<li class="formLine">',
                     '<label class="label">手机：</label>',
                     '<div class="element">        ',
 						'<input maxlength="20" id="AddContacts_Mobile" type="text" class="iText" />',
                     '</div>',
                 '</li>',
 				'<li class="formLine">',
                     '<label class="label">分组：</label>',
                     '<div class="element">  ',
 						'<div class="groupFen">',
 							'<div class="groupFenList GroupContainer">',
 								//'<p><input type="checkbox" value="" class="mr_5"><label for="">同学</label></p>',
 							'</div>	',
 							'<div class="groupBtn">',
 								'<a href="javascript:;" class="BtnShowAddGroup">新建分组</a>',
                                '<div class="AddrGroupContainer" style="display:none">',
                                    '<input id="AddContacts_GroupName" maxlength="16" type="text" class="iText mr_5" value="" />',
                                    '<a hidefocus="1" href="javascript:;" class="btnMinOK mr_5 AddNewGroup" title="确定"></a>',
                                    '<a hidefocus="1" href="javascript:;" class="btnMincancel CancelAddGroup" title="取消"></a>',
                                '</div>',
 							'</div>',
 						'</div>	',
                     '</div>',
                 '</li>',
             '</ul>',
 			//'<p class="gray pb_10" style="margin-left:25px;">如需编辑联系人详细资料，请进入<a href="javascript:;">新建联系人</a></p>',
         '</div>'].join(""),
        
        //批量添加模版
        batchtemplate:[ '<div class="boxIframeText">',
            '<p class="mt_10 Lbl_Tip" style="margin-left:25px; display:none;"></p>',
             '<ul class="form groupFenDiv">',
                 '<li class="formLine ErrorTipContainer" style="display:none">',
                    '<label class="label"></label>',
                    '<div class="element">',
                        '<div class="red LblErrorTip">格式错误</div>',
                    '</div>',
                 '</li>',
                 '<li class="formLine"><div style="padding-left:50px">你即将添加{0}个联系人，重复的联系人不再保存。</div></li>',
                 '<li class="formLine">',
                     '<label class="label">分组：</label>',
                     '<div class="element">  ',
                        '<div class="groupFen">',
                            '<div class="groupFenList GroupContainer">',
                                //'<p><input type="checkbox" value="" class="mr_5"><label for="">同学</label></p>',
                            '</div> ',
                            '<div class="groupBtn">',
                                '<a href="javascript:;" class="BtnShowAddGroup">新建分组</a>',
                                '<div class="AddrGroupContainer" style="display:none">',
                                    '<input id="AddContacts_GroupName" maxlength="16" type="text" class="iText mr_5" value="" />',
                                    '<a hidefocus="1" href="javascript:;" class="btnMinOK mr_5 AddNewGroup" title="确定"></a>',
                                    '<a hidefocus="1" href="javascript:;" class="btnMincancel CancelAddGroup" title="取消"></a>',
                                '</div>',
                            '</div>',
                        '</div> ',
                     '</div>',
                 '</li>',
             '</ul>',
            //'<p class="gray pb_10" style="margin-left:25px;">如需编辑联系人详细资料，请进入<a href="javascript:;">新建联系人</a></p>',
         '</div>'].join(""),

        GroupItemTemplate:'<p><input id="{chkId}" type="checkbox" value="{groupId}" class="mr_5"><label for="{chkId}">{name}</label></p>',
        events:{
            "click .AddNewGroup": "onAddNewGroupClick",
            "click .BtnShowAddGroup": "onShowAddGroupClick",
            "click .CancelAddGroup": "onCancelAddGroupClick"
        },

        /**构建dom函数*/
        render:function(){
            var This = this;
            var options = this.options;

            this.dialog = $Msg.showHTML(this.template,function(e){
                This.onYesClick();
                e.cancel = true;
            },function(){
                This.onCancel();
            },{
                //width:"380px",
                buttons:["确定","取消"],
                dialogTitle:"添加联系人"
            });

            this.setElement(this.dialog.el);

            this.renderGroupList();
            this.renderContactsInfo();


            this.initEvent();

            return superClass.prototype.render.apply(this, arguments);
        },

        /**构建批量添加dom函数*/
        batchrender:function(){
            var This = this;
            var options = this.options;
            var html = $T.Utils.format(this.batchtemplate,[options.addContacts.length]);
            this.dialog = $Msg.showHTML(html,function(e){
                This.onBatchYesClick();
                e.cancel = true;
            },function(){
                This.onCancel();
            },{
                //width:"380px",
                buttons:["确定","取消"],
                dialogTitle:"批量添加联系人"
            });

            this.setElement(this.dialog.el);
            this.renderGroupList();
            this.renderContactsInfo();


            this.initEvent();

            return superClass.prototype.render.apply(this, arguments);
        },

        /**@inner*/
        renderGroupList:function(groups){
            var htmlCode = [];
            groups = groups || this.contactsModel.getGroupList();
            for(var i=0;i<groups.length;i++){
                var g = groups[i];
                htmlCode.push(M139.Text.Utils.format(this.GroupItemTemplate,{
                    groupId:g.id,
                    name: M139.Text.Html.encode(g.name),
                    chkId:"_groups_chk_" + g.id
                }));
            }
            this.$(".GroupContainer").append(htmlCode.join(""));
        },

        /**@inner*/
        renderContactsInfo:function(){
            var This = this;
            var options = this.options;
            var info = {};
            if(options.serialId){
                var contacts = this.contactsModel.getContactsById(options.serialId);
                if(contacts){
                    info.name = contacts.name;
                    info.mobile = contacts.getFirstMobile();
                    info.email = contacts.getFirstEmail();
                    var groups = this.contactsModel.getContactsGroupId(options.serialId);
                }
                this.dialog.setDialogTitle("编辑联系人");
            }else{
                info.name = options.name;
                info.email = options.email;
                info.mobile = options.mobile;
                if (info.email) {
                    this.setLabelTip("将<" + info.email + ">加到通讯录");
                }
            }
            this.$("#AddContacts_Name").val(info.name || "");
            this.$("#AddContacts_Email").val(info.email || "");
            this.$("#AddContacts_Mobile").val(info.mobile || "");
            if(groups){
                $(groups).each(function(index,groupId){
                    This.checkedGroup(groupId);
                });
            }
        },
        /**
         *设置对话框内容区第一行文本提示内容
         *@inner
         */
        setLabelTip:function(text){
            this.$(".Lbl_Tip").text(text);
        },

        /**
         *点击添加组
         *@inner
         */
        onAddNewGroupClick: function () {
            var This = this;
            var groupName = this.$("#AddContacts_GroupName").val().trim();
            M2012.Contacts.API.addGroup(groupName, function (result) {
                if(result.success){                    
                    This.appendGroup(result.groupName,result.groupId);
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
            this.$(".LblErrorTip").html(msg);
        },

        /**
         *展开添加组
         *@inner
         */
        onShowAddGroupClick:function(){
            this.$(".AddrGroupContainer").show();
            this.$("#AddContacts_GroupName").val("").focus();
            this.$(".BtnShowAddGroup").hide();
        },

        /**
         *点击隐藏添加组
         *@inner
         */
        onCancelAddGroupClick:function(){
            this.hideAddGroup();
        },

        /**
         *隐藏添加组
         *@inner
         */
        hideAddGroup:function(){
            this.$(".AddrGroupContainer").hide();
            this.$(".BtnShowAddGroup").show();
        },

        /**
         *组选中
         *@inner
         */
        checkedGroup:function(groupId){
            this.$("#_groups_chk_"+groupId).attr("checked","checked");
        },

        /**
         *新建组成功后更新组的界面
         *@inner
         */
        appendGroup:function(groupName,groupId){
            var data = {
                name:groupName,
                id:groupId
            };

            this.renderGroupList([data]);
            this.checkedGroup(groupId);
            this.$("#AddContacts_GroupName").val("");
            this.$(".GroupContainer")[0].scrollTop = 10000;//滚动到最下面，看到新建的组
            this.hideAddGroup();
            this.trigger("addGroupSuccess", data);
        },

        /**
         *@inner
         */
        initEvent:function(e){
            var This = this;
            /*
			this.on('success',function(){
				var tabname = top.$App.getCurrentTab().name;
				(tabname === 'addrhome' || tabname === 'addr') && top.$App.show('addr'); //刷新通讯录
				if (top.$App.getTabByName("addr")) { top.$App.getTabByName("addr").isRendered = false; }
			});
            */
        },
        /**
         *@inner
         */
        onYesClick: function () {
            var This = this;
            var info = {};
            info.name = this.$("#AddContacts_Name").val();
            info.email = this.$("#AddContacts_Email").val();
            info.mobile = this.$("#AddContacts_Mobile").val();
            info.groupId = [];
            this.$("input:checkbox:checked").each(function () {
                info.groupId.push(this.value);
            });
            if (this.options.serialId) {
                //编辑联系人
                M2012.Contacts.API.editContacts(this.options.serialId, info, function (result) {
                    if (result.success) {
                        top.M139.UI.TipMessage.show("修改成功", { delay: 3000 });
                        This.onSuccess(result);
                    } else {
                        This.showError(result.error || result.msg);
                    }
                });
            } else {
                //添加联系人
                M2012.Contacts.API.addContacts(info, function (result) {
                    if (result.success) {
                        top.M139.UI.TipMessage.show("添加成功", { delay: 3000 });
                        This.onSuccess(result);
                    } else {
                        This.showError(result.error || result.msg);
                    }
                });
            }
        },

        /**
         * 批量添加确认点击
         */
        onBatchYesClick: function () {
            var callback;
            var This = this;
            var groupId = [];
            var info = This.options.addContacts;
            var alink = This.options.alink; //批量增加链接

            This.$("input:checkbox:checked").each(function () {
                groupId.push(this.value);
            });
            
            if (info.length > 0) {
                
                //添加groupId
                $.each(info,function(){
                    this.groupId = groupId;
                });

                callback = function(result){
                    if(result.success){
                        top.M139.UI.TipMessage.show("成功添加{0}个联系人".format(info.length), { delay: 3000 });
                        setTimeout(function(){
                            $App.trigger("change:contact_maindata"); //刷新通讯录
                        }, 2000);

                        if (alink) {
                            alink.hide();//成功添加后隐藏链接
                        }
                        This.onSuccess(result);
                    }else {
                        This.showError(result.error || result.msg);
                    }
                };
                
                if(info.length > 1){
                    Contacts.addContacts(info, callback);                    
                }else{
                    M2012.Contacts.API.addContacts(info[0], callback);
                }               
            }
        },

        /**
         *@inner
         */
        onSuccess: function (result) {
            this.dialog.close();
            this.trigger("success", result);
        },
        /**
         *@inner
         */
        onCancel:function(){
            this.trigger("cancel");
        }
    }));



 })(jQuery, _, M139);

/*
 $(function () {
     
     M2012.Contacts.getModel().requireData(function () {
         new M2012.UI.Dialog.ContactsEditor({
            serialId:"602955467"
         }).render();
     });
 })
 */