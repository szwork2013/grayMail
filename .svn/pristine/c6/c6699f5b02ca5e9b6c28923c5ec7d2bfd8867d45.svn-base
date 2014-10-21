/**
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

