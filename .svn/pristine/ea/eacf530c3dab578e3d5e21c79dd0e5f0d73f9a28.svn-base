/**
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

