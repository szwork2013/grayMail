/**
* @fileOverview 普通模式读信功能
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    
    /**
    * @namespace 
    * 普通模式读信功能
    */   
         
    M139.namespace('M2012.ReadMail.Normal.View', superClass.extend({


		
	name: "M2012.ReadMail",
    
        /**
        *读信功能模版
        *tag 我的标签模版
        *from 发件人模版
        *receiver 接收人模版(收件人、抄送人、密送人)
        *email 邮件地址模版
        *date 时间模版
        *remark_remind 邮件备注、邮件提醒模版
        *attach 附件列表模版
        *thumbnails_li 附件缩略图单元模版
        *thumbnails 附件缩略图模版
        */   
        
        template:{    
		
		//邮件头
		mailHeader: ['<div class="readMail">',
                     '<div class="hTitle">',
                        '<h2 style="{titleColor}">{starAttributeNew}{titleIco}{title}</h2>{otherLink}{reCall}',
                        '<span class="readTagdiv" style="display:none" data="{labelIds}">{tagHtml}</span> ',
                     '</div>',
                     '<span class="readmialTool2"></span> ',
                     '<span id="readMailIcons" class="readmialTool" style="display:none;">',                        
                            '<a name="tagMenu_read" href="javascript:;" bh="readmail_icons_disk" class="J_backupMail i_clouds" title="备份至“彩云网盘”"></a> <span>|</span> ',
                            '{cloudNote} <span>|</span> ',
                            '<a href="javascript:;" name="remark_add" mid="{mid}" bh="readmail_addremark" class="i_note {remarkClass}" title="邮件备注"></a> <span>|</span> ',
                            '{printMail} <span>|</span> ',
                            '{newWinUrl}',
                            '<a id="readMailMoreBtn" href="javascript:;" class="btnSimple"><i class="triangle t_blackDown"></i></a>',
                            //'<a href="javascript:;" bh="readmail_icons_dropdown" class="ml_10 J_toggleTriangle"><i class="g-down"></i></a>',
                     '</span></div>',
                     '<div class="readMail-left-con">',
                         '<div class="readMailInfo">',
                            '{fromHtml}',
                            '{toHtml}',
                            '{ccHtml}',
                            '{bccHtml}',
                            '{dateHtml}',
                            '<div id="readremark_{mid}" class="rMList jstoggle" name="remark" style="display:none"></div>',
                            '{attachHtml}',
                            '<div class="rMList jstoggle" id="deliverystatus_div_{mid}"  style="display:none"></div>',
                            '<div class="mt_2">',
                                '<div class="rMr p_relative J_iconDesc" style="display: none;">',
                                    '<a href="javascript:;" bh="readmail_desc_disk" class="J_backupMail">备份至彩云网盘</a> | ',
                                    '<a href="javascript:;" bh="readmail_desc_note" class="J_saveNote">保存到和笔记</a> | ',
                                    '<a href="javascript:;" bh="readmail_desc_tip" name="remark_add">邮件备注</a> | ',
                                    '<a href="javascript:;" bh="readmail_desc_print" class="J_printMail">打印</a> | ',
                                    '<a href="javascript:;" bh="readmail_desc_newwin" class="J_newwin">新窗口读信</a> | ',
                                    '<a href="javascript:;" bh="readmail_desc_export" class="J_exportMail">导出邮件</a> | ',
                                    '<a href="javascript:;" bh="readmail_desc_original" class="J_showOriginalLetter">显示邮件原文</a> | ',
                                    '<a href="javascript:;" bh="readmail_desc_garbled" class="J_errorCode">邮件有乱码？</a>',
                                '</div>',
                            '</div>',
                         '</div>',
                     '</div>'
                     ].join(''),
				 
		//邮件内容
        readmailbody: [ 
            '<div class="bgMargin"><div class="toolBar" id="toolbar_{mid}" ></div></div>',
            '<span class="lineD"></span>',
            '<div class="inboxfl bgPadding_left J-readMailArea" id="readmail_container" style="+zoom:1;visibility:hidden;">',
                '<a href="javascript:;" class="switchOn3 innerboxshadow" {contactStyle} hidefocus="true" ><i class="triangle-big-l"></i></a>',
                '<div id="leftbox" class="inboxflDiv" >',
                    '<div class="lineDn clearfix" id="leftPart">',
                        '<div class="readMail-left" id="readmail_{mid}" mid="{mid}"></div>',
                    '</div>',
                    //'<div id="risktips" class="rMList" style="display:none"></div>',//'{riskTips}',
                    '<div class="mialContent" id="mailContent_{mid}">',
                        '<div class="mailText"> ',
                            '<span class="fontZoom" id="fontzoom_{mid}" style="display:none" > <a href="javascript:;" rel="increase"  title="放大字号" bh="readmail_bigfont"><span>A</span><sup>+</sup></a><a href="javascript:;" title="原来字号大小" rel="normal" bh="readmail_normalfont">原</a><a href="javascript:;" title="缩小字号" rel="reduce" bh="readmail_smallfont"><span style="font-size:10px;">A</span><sub>-</sub></a><a href="javascript:;" rel="close" title="关闭" class="fz-colse"></a></span> ',
                            '<div id="contentText" rel="14">',
                                '<div>{mailContentHtml}</div>',
                            '</div>',
                        '</div>',
                    //'<div class="attrBody" id="attach_{mid}"></div>', //'{getThumbnailsHtml},
                    '</div>',
                    '{quickReplyHtml}',
                '</div>',
            '</div>',
            '<a href="javascript:;" class="i-backTop" style="display:none;" title="回到顶部" hidefocus=""></a>'
         ].join(''),
                 
        tag: ["<span href='{tagLink}' class='tag'>",
                   "<span class='tagBody'>",
                       "<span>{tagName}</span>",
                       "<a href='{tagCloseLink}'><i class='i_cl_w'></i></a>",
                   "</span>",
             "</span>"],

       from: ["<div class='rMList' {display}>",
                    "<span class='rMl'>发件人：</span>",
                    "<div class='rMr p_relative'>",
			            "<div class='gAddr'>",
				            "<strong class='gAddrN'>{name}</strong>",
				            "<em class='gAddrE'>&lt;{email}&gt;</em>",
				            "<b class='i_triangle_d'>,</b>",
			            "</div>",
			            "{agent}",
		            "</div>",
              "</div>"],
             
    receiver: ["<div class='rMList'{display} id='{id}' >",
                    "<span class='rMl'>{name}：</span>",
                    "<div class='rMr p_relative'>{emails}{vip}{agent}{refuse}{notify}</div>",
               "</div>"],
                                  
       email:["<div class='gAddr' email='{2}' addr='{3}'>",
                    "<strong class='gAddrN'>{0}</strong>",
                    //"<em class='gAddrE'>&lt;{1}&gt;</em>",
                    "{1}",
                    "<b class='i_triangle_d'>,</b>",
              "</div>"],        
       
       sliceUp:[' | <a href="javascript:;" ><i id="togglemoreinfo" class="i_2trid i_2tridd" title="收起"></i></a>'],
       
       date: ["<div id='sendDate' class='rMList' {display}><span class='rMl'>时　间：</span><div class='rMr p_relative'>{date}</div></div>"],
                   
       quickreply: ['<div class="readMailReply p_relative" style="{0}" id="quickreply_{1}">',
                    '</div>',
                    '<div class="readMailReplyDone" style="display:none">此邮件已经快捷回复。<a href="javascript:;" class="dropDownA">再回一封</a></div>'
                    ],
                
       attach: ["<div class='rMList'{display}>",
                    "<span class='rMl'>附　件：</span>",
                    "<div class='rMr'><span>{num}个({attachList})</span></div>",
                "</div>"],
                
       headAttach: [ '<div class="rMList">', 
                     '<span class="rMl">附　件：</span>',
                     '<div class="rMr convattrlist" id="headAttach">{0}</div>',
                     '</div>'].join("")          
    },

    events:{
        //"click #allsavetodisk":"getAllSaveToDiskUrl"
        "click a.J_newwin": "onNewWinReadMailClick",
        "mouseover ul.attrList li": "onPreviewAttachImgMouseOver",
        "click #spammail": "onNotSpammailClick",
        //"click a[name=tagMenu_read]": "onTagMenuClick",
        "mouseover div.mailText": "onFontZoomMouseOver",
        "mouseover div.gAddr": "onReceiverAddrMouseOver",
		"click a#addmailnotify": "onAddMailNotify",
		"click a.J_printMail": "onPrintMailClick",
        "click a.Vip": "onVipClick",
        "click a.J_errorCode": "onErrorCodeLinkClick",
        "click a.J_showOriginalLetter": "showOriginalLetter",
        "click a.J_exportMail": 'onExportMailClick',
        "click a#readMailMoreBtn": 'onMoreBtnClick',
		"click a#saveToNote": "onSelectNote"
    },

		initialize: function(){
			this.model= new M2012.ReadMail.Normal.Model();
            this.initSonView();
			this.mailboxModel = $App.getView("mailbox").model;
			this.mailTagEvent();
			return superClass.prototype.initialize.apply(this, arguments);
		},

    //定义子视图
    initSonView: function(){
        this.sonview = true;
        this.quickreplyview = new M2012.ReadMail.View.QuickReply();
        this.readmailcontentview = new M2012.ReadMail.View.ReadMailContent({model:this.model, parentView: this});
        this.filepreview = new M2012.ReadMail.View.FilePreview();
        this.deliverystatusview = new M2012.DeliveryStatus.View();
        this.readreceiptview = new M2012.Receipt.View();
        this.recallview = new M2012.ReadMail.Recall.View();
        this.risktipsview = new M2012.ReadMail.RiskTips.View();
        this.remindview = appView.getView("remind"); //公用一个view
    },
    
		
		//获取代发信息
		getAgentHtml:function(data){
			var self = this;
			var html = '';
			try{
				if (data.sender && data.sender != undefined) {
					var from = M139.Text.Email.getEmail(data.account);
					var sender = $Email.getEmail(data.sender);
					//if(from != sender){
						html = '<span class="issuing-name">(由<strong style="color:red">' + sender + '</strong>代发)</span>';
					//}
				}
			}catch(ex){}
			return html;
		},
    //vip
    getVipHtml:function(data){
        var from = $Email.getEmail(data.account);
        var accountInfo = {};
        var html = '';
        accountInfo.isVip = 0; //不在通讯录内
        var contact = top.Contacts.getContactsByEmail(from);
        if(contact && contact.length > 0){
            accountInfo.isVip = 2; //在通讯录内，但不是vip联系人
            var contactsInfo = contact[0];
            accountInfo.serialId = contactsInfo.SerialId;
            accountInfo.name = contactsInfo.name;
            var _vipc = top.Contacts.getVipInfo();
            var i = $.inArray(accountInfo.serialId, _vipc.vipSerialIds.split(','));
            if(i > -1) accountInfo.isVip = 1; //是vip联系人
        }
        if(accountInfo.isVip == 1){
            html = '<a class="Vip user_vip" bh="readmail_delvip" title="取消“VIP联系人”" href="javascript:;"></a>';
        }else if(accountInfo.isVip == 2){
            html = '<a class="Vip user_gray_vip" bh="readmail_addvip" title="添加“VIP联系人”,其邮件将同时标记为“VIP邮件”" href="javascript:;"></a>';
        }else{
            html = '<a class="Vip" style="display:none;" href="javascript:;"></a>';
        }
        this.model.set('accountInfo',accountInfo);
        return html;
    },
    
    //拒收
    getRefuseHtml:function(data,fid){
        var self = this;
        var html = '';
        var mailListData = self.model.get('mailListData');
        var logoType = 0 ;
        if(mailListData) logoType = mailListData.logoType;
        var from = $Email.getEmail(data.account);
        if(from){
            mailboxComplaintView.model.set({from:from});
            if(fid != 5 && logoType == 0 && top.mailboxComplaintView.isSpamMail()){
                html = '<span class="pl_10"><a href="javascript:;" onclick=\'top.$App.trigger("mailCommand", { command: "refuseMail", email: "'+ from +'" });\'>[拒收]</a></span>';
            }
        }
        return html;
    },

    /**
    *获取标签视图
    */
    getTagHtml:function(label){
    	if(label){
    	    var tagView = M2012.Mailbox.View.MailTag.prototype.createInstance(); //tagview的单例
            return tagView.render(label,false);
    	}else{
    	    return "";
    	}
    },
    
    /** 重新渲染tag */
    renderTag:function(tagcon,newTagHtml){
        var self = this;
       
        newTagHtml && tagcon.html(newTagHtml);
        tagcon.hide();
     	if(tagcon.find('.TagDiv').length > 0){
	        tagcon.find('.tag').unwrap();
	    }
	    tagcon.show();
    },
        
    /** 
    * 获取接收人邮件地址
    * @param {object} returnObject 返回数据
    * @param {array} emailData 邮件地址 
    //有通许录地址则显示通许录地址，没有就显示全称
    */
    getReceiverEmail:function(returnObject,emailData){
        var self = this;
        var thisTemplate = self.template.email.join('');
        var eaddrTemp = "<em class='gAddrE'>&lt;{0}&gt;</em>";
        var arr = [];
        if (emailData) {
            var list = emailData.split(",");
            for (var i = 0; i < list.length; i++) {
                var obj = M139.Text.Email.getEmail(list[i]);    
                var alladdr = list[i];
                    alladdr = $T.Html.encode(alladdr);
                var name = $App.getAddrNameByEmail(list[i]); //这里要完整地址，不能单个email
                name = $T.Html.encode(name); //encode 防xss
                var email = $Email.getEmail(list[i]) || name; //代收邮件有些没有收件地址的
                email = $T.Html.encode(email); //encode 防xss
                var eaddr = ''; 
                var thisCode = $T.Utils.format(thisTemplate,[name,eaddr,email,alladdr]);
                arr.push(returnObject ? obj : thisCode );
            }
        }
        if( arr.length > 0 ){
            if (returnObject) {
                return arr;
            } else {
                return arr.join("");
            }
        }else{
            return "";
        }      
    },

    /** 获取批量添加联系人数组 
     * @param {object} emailData 读信获取数据
    */
    getAddContactsList: function(emailData){
        var self = this;
        var contactslist = [];
        if (emailData) {
            var list = emailData.split(",");
            for (var i = 0; i < list.length; i++) {
                var name = $App.getAddrNameByEmail(list[i]); //这里要完整地址，不能单个email
                var email = $Email.getEmail(list[i]) || name; //代收邮件有些没有收件地址的
                //通讯录没有的才进入批量添加
                if($App.getModel("contacts").getContactsByEmail(email).length==0){
                    if($Email.isEmail(email)){
                        contactslist.push({
                            name:name,
                            email:email
                        });
                    }                    
                }
            }            
        }
        return contactslist;
    },

    /**　批量添加联系人连接 
     * @param {object} options.data 读信获取数据
     * @param {object} options.type 类别
    */
    showBatchAddLink: function (options) {
        if (this.isBriefMode) { return;}
        var self = this;
        var temp = '<a href="javascript:;" title="批量添加联系人" name="batch_addr">批量添加</a>';
        if(options && options.data && options.type){
            var addContacts = self.getAddContactsList(options.data); 
            if(addContacts.length > 1){  // 2个陌生人以上才出现批量添加
                var container = $(self.el).find('#receiver_' + options.type);
                container.find('.rMr').append(temp);
                var alink = $(container.find('a:last'));
                alink.click(function(){
                    new M2012.UI.Dialog.ContactsEditor({
                        addContacts:addContacts,
                        alink:alink
                    }).batchrender();
                    BH('readmail_batchaddcontacts');
                });
            } 
        }
    },

    /** 标题颜色 */
    getColor: function(mid){
        var mailInfo = $App.getMailDataByMid(mid);
        if(mailInfo && mailInfo.color){
            return createMailboxRenderFunctions().getSubjectColor(mailInfo.color);
        }else{
            return '';
        }
    },
    
    /** 标题图标 */
    getTitleIco: function (mid) {
        var mailInfo = $App.getMailDataByMid(mid);
        if (mailInfo && mailInfo.priority == 1) {
            return '<i class="i_exc mr_5"></i>';
        }else{
            return '';
        }
    },
        
    /** 
    * 获取接收人Dom
    * 收件人，抄送人，密送人
    * @param {string} name 签名
    * @param {array} emails 邮件地址  
    * @param {options}
    */
    getReceiverHtml:function(name,emails,options){
        var self = this;
        var thisTemplate = self.template.receiver.join('');
        var thisEmail = "";
        if(emails != undefined){
            thisEmail = self.getReceiverEmail(false,emails); //true 为[]
        }
        var agent = '';
        var id = '';
        var vip = '';
        var refuse = '';
		var notify = '';
        if(options && options.agent){agent = options.agent;}
        if(options && options.vip){vip = options.vip;}
        if(options && options.refuse){refuse = options.refuse;}
		if(options && options.notify){notify = options.notify;} //邮件提醒
	
        if(options && options.type){
            id = 'receiver_' + options.type;
        }
        var formatData = {display:"",id: id,name:name,emails:thisEmail,vip:vip,agent:agent,refuse:refuse,notify:notify};
        var thisCode = $T.Utils.format(thisTemplate,formatData);
        return thisEmail == "" ?  "" : thisCode;
    },
    
    /**
    * 获取回复所有人地址
    */
    getReplyAllEmails:function(dataSource){
        var self = this;

        var fromEmailArray = self.getReceiverEmail(true,dataSource.account);
        var toEmailArray = self.getReceiverEmail(true,dataSource.to);
        var ccEmailArray = self.getReceiverEmail(true,dataSource.cc);
        var filterArray = []; //将要过滤的帐号
        
        var mailsArray = toEmailArray.concat(ccEmailArray);
        mailsArray = mailsArray.concat(fromEmailArray);
        
        //console.log('所有帐号');
        //console.log(mailsArray);
        
        //获取我的所有帐号
        var myEmail = $User.getAccountList();
            //console.log(myEmail);
            
            for(var i = 0 ; i < myEmail.length; i++){
                filterArray.push(myEmail[i].name);
            }
        
        //代收邮件地址
        var poplist = $App.getFolders("pop");
        for(var i = 0; i < poplist.length; i++) {
            filterArray.push(poplist[i].name.toLowerCase());
        }
       // console.log('所有过滤的帐号');
        //console.log(filterArray);
        
        
        //最后的回复帐号
        var resultArray = [];
        
        //移除自己所有账号、代收账号
        for (var i = 0; i < mailsArray.length; i++) {
            var obj = mailsArray[i];
            if ( $.inArray(obj.toLowerCase(),filterArray) == -1) {
                obj!='' && resultArray.push(obj);
            }
        }
        //console.log('过滤后');
        //console.log(resultArray);
        
        //全部是自己发给自己时，回复全部会是空的，填上一个自己的地址
        if(resultArray.length == 0) {
            resultArray.push(myEmail[0].name);
        }
        return resultArray.join(","); 
    },
    
    /** 
    * 获取头部附件列表视图
    * @param {string} attach 附件列表
    */
    getAttachHtml:function(dataSource){ 
        var self = this;
        var thisTemplate = '<div class="rMList" id="headAttach" >{0}</div>';//self.template.headAttach;
        var attach = dataSource.attachments;
        var data = '';
        var html = '';
        if(attach && attach.length>0){
            data = self.filepreview.getSessionAttach(dataSource.subject,attach,dataSource.omid);
            html = $T.Utils.format(thisTemplate,[data]); 
        }
        return html;
    },

    /** 
    * 获取时间视图
    * @param {date} sendDate 时间
    */
    getDateHtml:function(dataSource){
        var self = this;
        var sendDate = dataSource.sendDate;
        var thisTemplate = self.template.date.join('');
        var thisDate = $Date.format("yyyy-MM-dd hh:mm:ss",new Date(sendDate * 1000));
        var formatData = { display:"", date:thisDate};
        var thisCode = $T.Utils.format(thisTemplate,formatData);
        return sendDate == undefined ? "" : thisCode;
    },
    
    getTagMenuHtml:function(){
        return this.getTagMenuIco();
    },

		getRemindHtml:function(dataSource, temp){
			return this.getRemindIco(dataSource, temp);
		},
		/** 
		* 获取待办邮件图标 
		*/
		getRemindIco:function(dataSource, temp){
			var taskFlag = 0;
			if(dataSource.flag && dataSource.flag.taskFlag){
				taskFlag = dataSource.flag.taskFlag;
			}
            var status = ['add','update','finish'][taskFlag]; //任务状态
            var map = { //样式
                'add':'i_tx',
                'update':'i_tx_y',
                'finish':'i_tx_b'
            };
            var iClassMap = { //样式
                'add':'i_cDo',
                'update':'i_cDon',
                'finish':'i_cDoy'
            };
            var data = {
                aclass: map[status],
                mid: dataSource.omid,
                status: status,
                taskdate: dataSource.taskDate || 0,
                from: $T.Html.encode(dataSource.account),
                senddate: dataSource.sendDate,
                subject: $T.Html.encode(dataSource.subject),
                iclass: iClassMap[status]
            };
            /*var temp = [''
                ,'<p>'
                ,'<a href="javascript:;" class="{aclass}" rel="read" name="mailtask">'
                ,'<span mid="{mid}" status="{status}" taskdate="{taskdate}" from="{from}" senddate="{senddate}" subject="{subject}"></span>'
                ,'</a>'
                ,'<span>待办任务</span>'
                ,'</p>'
                ,''].join('');*/
            //var temp = '<a href="javascript:;" name="mailtask" title="设置任务" mid="{mid}" status="{status}" taskdate="{taskdate}" from="{from}" senddate="{senddate}" subject="{subject}"><i class="i_calendars"></i></a> | ';
            return $T.Utils.format(temp,data);
        },
    
    /** 
    * 获取标签操作图标 
    */
    getTagMenuIco:function(){
        var temp = '<a href="javascript:;" name="tagMenu_read" class="i_tagfor"></a>';
        return temp;
    },
    
    /**
    * 快捷回复容器
    */
    getQuickReplyHtml:function(){
        var self = this;
        var display = "display:;";
        var mid = self.model.get("mid");
        var html = $T.Utils.format(self.template.quickreply.join(''),[display,mid]);
        return html;
    },
    
    /**
    * 星标属性
    * @param {object} flag 邮件属性 flag.starFlag 为星标邮件标志 
    */
    starAttributeNew: function (flag) {
        var isHasStar = flag.starFlag == 1 ? 1 : 0;
        var temp='<i class="i_star" name="read_starmail"></i>';
        if (isHasStar) {
           return temp.replace("i_star", "i_star_y");
        }else{
           return temp;

        }
    },
    /**
    * 备注图标
    * @param {object} flag 邮件属性 flag.memoFlag 为邮件备注标志
    */
		getRemarkClass:function(dataSource){
			if(dataSource && dataSource.flag && dataSource.flag.memoFlag == 1){
				return "i_note_y";
			}else{
				return "";
			}
		},

    /**
    * 新窗口读信连接
    * @param {string} mid 邮件mid
    */
    newWinUrl:function(mid,fid){
        var temp = '<a href="javascript:;" mid="{0}" name="newwin" class="J_newwin i_2win" title="新窗口读信" bh="readmail_newwin"></a>';
        return $T.Utils.format(temp,[mid]);
    },

    /**
    * 新增邮件保存到和笔记入口
    */
    cloudNote: function (mid, fid) {
        var temp = (['<ul class="u-saveNoteSlider" style="top:0px;right:0px;"><li>',
            '<a href="javascript:;" mid="{0}" name="saveNote" class="lnk J_saveNote" title="保存到“和笔记”" bh="readmail_icons_note">',
            '<i class="ico ico1"></i>存和笔记</a></li>',
            '<li><a href="javascript:;" class="lnk J_saveEvernote" bh="evernote_readmail_entry" title="保存到“印象笔记”"><i class="ico ico2"></i>存印象笔记</a></li></ul>']).join('');
        this.popTemp = $T.Utils.format(temp, [mid]);
        return '<a href="javascript:;" id="saveToNote" class="i_bot" title="保存到笔记"></i></a>'
    },
    /*选择存储和笔记或印象笔记*/
    onSelectNote: function(){
        var self = this;
        var popup = self.model.get('popup');
        if(popup){
            popup.close();
        }

        popup = M139.UI.Popup.create({
            name: "selectNotePop",
            width: 102,
            height: 62,
            autoHide:true,
            target: document.getElementById("saveToNote"),
            content: self.popTemp
        });
        self.model.set('popup',popup);

        popup.render();

        $('a.J_saveNote').click(function(){
            self.onCloudNoteClick()
            popup.close();
        });
        $('a.J_saveEvernote').click(function(){
			top.addBehaviorExt({ actionId: 106905, thingId: 11 });
            self.onEverNoteClick();
            popup.close();
        });
        M139.Dom.bindAutoHide({
            element: popup.contentElement[0],
            stopEvent: true,
            callback: function () {
                popup.contentElement.remove();
            }
        });
    },

    printMail: function (mid) {
        var temp = '<a href="javascript:;" mid="{0}" name="saveNote" class="J_printMail i_print" title="打印" bh="readmail_icons_print"></a>';
        return $T.Utils.format(temp, [mid]);
    },
    

    /**
    * 更多信息按钮输出
    */
    showmoreinfo:function(){
        var self = this;
        var html = self.template.sliceUp.join('');     
        if($(self.el).find(".mailSectionTitle .rMList").length>6){
	        $(self.el).find(".readmialTool").append(html);
        }                
    },
    
    
    /**联系人页卡*/
    showContactCard:function(node){
        var self = this;
        var email = node.find('.gAddr');
        $.each(email,function(n){
            var _this = this;
            $(this).mouseover(function(){
                var addr = $(_this).attr('addr');
				var email = $Email.getEmail(addr) || $(_this).attr('email');
                email!='' && M2012.UI.Widget.ContactsCard.show({
                    dockElement:$(_this),
                    email:email
                })  
            })
        });
    },

    onNewWinReadMailClick:function(){
        var mid = this.model.get('mid');
        $App.openNewWin(mid);
    },

    //保存为和笔记
    onCloudNoteClick: function () {

        //接口不支持暂时屏蔽
        /*top.addBehaviorExt({ actionId: 104705, thingId: 2 });
        $App.trigger("mailCommand", {'command': 'savetoNote', 'mids': [this.model.get('mid')]});
        return;*/
        var mid = this.model.get('mid');
        var mailObj = M139.PageApplication.getTopApp().print[mid];
        if (mailObj && mailObj.html) {
            var title = mailObj.subject || "";
            title = title.slice(0, 65);
            var content = mailObj.html.content || "";
        }
        //content = content.replace(/\\/ig, "\\\\").replace(/(\r)?\n/ig, "\\n").replace(/\"/ig, "\\\"").replace(/\//ig, "\\\/"); //转义
        var options = {
            title: title || '邮件标题',
            content: content || '邮件内容',
            attachmentDirId: ""
        }
        top.M139.RichMail.API.call("mnote:createNote", options, function (res) {       //创建笔记
            if (res.responseData && res.responseData["code"] == "S_OK") {
                M139.UI.TipMessage.show("邮件已转存至和笔记 <a href='javascript:top.$App.show(\"note\")'>查看</a>");
                //var noteId = res.responseData["var"]["noteid"];         //返回新建的noteId
            } else {
                M139.UI.TipMessage.show("保存失败，请重试");
            }
            setTimeout(function () {
                M139.UI.TipMessage.hide();
            }, 3000);
        });
    },

	//保存为印象笔记
    onEverNoteClick: function(){
        var mid = this.model.get('mid');
        var mailObj = M139.PageApplication.getTopApp().print[mid];
        if (mailObj && mailObj.html) {
            var title = mailObj.subject || "";
            title = title.slice(0, 65);
            var content = mailObj.html.content || "";
        }
        content = content.replace(/\\/ig, "\\\\").replace(/(\r)?\n/ig, "\\n").replace(/\"/ig, "\\\"").replace(/\//ig, "\\\/"); //转义
        var options = {
            title: title || '邮件标题',
            content: content || '邮件内容'
        }
        top.M139.RichMail.API.call("evernote:createNote", options, function (res) {
            if(res.responseData && res.responseData["code"]){
                if(res.responseData["code"] == 'OAUTH_BINDING' || res.responseData["code"] == 'TOKEN_EXPIRED'){
                    top.$App.showOauthDialog({func:function(){}});
                }else if(res.responseData["code"] == 'S_OK'){
                    M139.UI.TipMessage.show('操作成功，邮件内容已保存到印象笔记', {delay: 2000});
                    top.addBehaviorExt({ actionId: 106906, thingId: 4});
                }
            } else {
                M139.UI.TipMessage.show('遇到异常，保存失败，请稍后重试', {delay: 2000, className: "msgRed"});
            }
        });
    },
    onPrintMailClick: function () {
        top.addBehaviorExt({ actionId: 104928, thingId: 0 });
        var mid = this.model.get('mid');
        window.open("/m2012/html/printmail.html?mid=" + mid);
    },
    
    onPreviewAttachImgMouseOver: function (e) {
        if(!e.target.bindHover){
            $(e.target).hover(function () {
                $(this).addClass("lihover");
            }, function () {
                $(this).removeClass("lihover");
            }).addClass("lihover");
            e.target.bindHover = 1;
        }
    },
    //不是垃圾邮件
    onNotSpammailClick: function (e) {
        var mid = this.model.get('mid');
        var mids = [];
        mids.push(mid);
        var args = {
            command: 'move',
            fid: 1,
            mids: mids,
            comefrom: 'spammail'
        };
        $App.trigger('mailCommand', args);
    },

    onTagMenuClick: function (e) {
        var mid = this.model.get('mid');
        var tagItems = [
        {
            html: "<i class='i_star_y'></i><span class='tagText'>星标</span>",
            command: "mark", args: { type: "starFlag", value: 1 }
        },
        { isLine: true }];

        tagItems = tagItems.concat($App.getView("mailbox").model.getTagMenuItems());

        M2012.UI.PopMenu.create({
            dockElement: e.target || e.srcElement,
            direction: "auto",
            items: tagItems,
            onItemClick: function (item) {
                var args = item.args || {};
                if (item.command) {
                    args.command = item.command;
                    args.mids = [mid];
                    $App.trigger("mailCommand", args);
                }
            }
        });
    },

    onFontZoomMouseOver: function (e) {
        //字体缩放
        if (!this.model.get('isSubscribeaction')) {
            if (!e.target.bindHover) {
                var jTarget = $(e.target);
                jTarget.hover(show, hide);
                show();
                e.target.bindHover = 1;
            }
        }
        function show() {
            jTarget.find('span.fontZoom').show();
        }
        function hide() {
            jTarget.find('span.fontZoom').hide();
        }
    },
    //邮箱地址鼠标移过显示下拉箭头，鼠标移开下拉箭头消失
    onReceiverAddrMouseOver: function (e) {
        if (!e.target.bindHover) {
            var jTarget = $(e.target);
            jTarget.hover(show, hide);
            show();
            e.target.bindHover = 1;
        }
        function show() {
            var email = jTarget.attr('email');
            if ($Email.getEmail(email) != '') {
                jTarget.addClass("SgAddr")
            }
        }
        function hide() {
            jTarget.removeClass("SgAddr");
        }
    },

	//来邮提醒
	onAddMailNotify: function(node){
		var self = this;
		var addMailNotifyCon = this.$el.find('a#addmailnotify');
		BH('readmail_smsremind');
		if(!$User.getMailNotifyInfo()){ //获取不了数据时跳转
			$App.show('notice');
			return;
		}					
							
		//互联网用户限制
		if($User.isInternetUser()){
			$User.showMobileLimitAlert();
			return;
		}
		
		M139.core.utilCreateScriptTag(
		{
			id: 'addmailnotifyscript', 
			src: 'm2012.addmailnotify.pack.js', 
			charset: "utf-8"
		},
		function () {
			var email = addMailNotifyCon.attr('data-from');
			if(email){
				var mailNotifyView = new M2012.AddMailNotify.View({addEmail:email});
				if($User.getMailNotifyInfo().notifyType == '0'){
					mailNotifyView.render(); //未开启
				}else{
					mailNotifyView.addAccount(); //已开启
				}
			}
		})	
		
	},
    
    /**
    * vip联系人操作
    */
    onVipClick:function(){
        var accountInfo = this.model.get('accountInfo');
        var self = this;
        var param = {
            serialId : accountInfo.serialId,
            name : accountInfo.name
        };
        if(accountInfo.isVip == 1){
            param.success = function(){
                accountInfo.isVip = 2;
                $(self.el).find('a.Vip')
                          .removeClass('user_vip').addClass('user_gray_vip')
                          .attr('bh','readmail_addvip')
                          .attr('title','添加“VIP联系人”,其邮件将同时标记为“VIP邮件”');
            }
            top.Contacts.delSinglVipContact(param);
        }else if(accountInfo.isVip == 2){
            param.success = function(){
                accountInfo.isVip = 1;
                $(self.el).find('a.Vip')
                          .removeClass('user_gray_vip').addClass('user_vip')
                          .attr('bh','readmail_delvip')
                          .attr('title','取消“VIP联系人”');
            }
            top.Contacts.addSinglVipContact(param);
        }
        
    },
    
    /**
    * 容器自适应高度
    */
    onResize:function(){
        var self = this;
        var el = $(self.el);
        var inbox = el.find('div.J-readMailArea:eq(0)');
        if (inbox.length > 0) {
            var subWinHeight = $App.getBodyHeight();
            var containerH = subWinHeight - 155;//写死性能高,引发重绘损耗40ms
            containerH = Math.max(200,containerH); 
            !el.attr('addclass') && el.attr('addclass',1);
            if(self.mailboxModel.isApproachMode() && self.mailboxModel.get("layout") == "left"){
                //inbox.css();
            }else{
                inbox.height(containerH - 4).css({'overflow-x':'hidden','position':'relative'});
                if($B.is.ie && $B.getVersion() < 8){ //ie67 解决往来邮件模块展开和收缩，switchOn3按钮跳跃问题,360兼容模式有问题
                    inbox.css({'overflow-y':'scroll'});
                }
            }            
        }

       
        var mid = this.model.get('mid');
        if (this.readmailcontentview.resize) { //内容自适应
            this.readmailcontentview.resize(mid);
        }

        // 功能iconsbottom适应
        var $J_iconDesc = this.$el.find('.J_iconDesc');
        var $readMailIcons = this.$el.find('#readMailIcons');
        if ($J_iconDesc.is(':visible')) {
            $readMailIcons.css('bottom', $J_iconDesc.height() + 13 + 'px');
        }		

        // 同步往来邮件容器的高度
        this.contactRecordView && this.contactRecordView.setContactsMailConH();
        setTimeout(function () {
            self.CutBriefReceiver();
        }, 50);

    },
    showBriefMode: function (flag,force) {
        var self = this;
        var to = this.$el.find('#receiver_to');
        var cc = this.$el.find('#receiver_cc');
        if (flag) { //精简
            if (to.height() + cc.height() > 50 || force) { 

                this.isBriefMode = true;
                this.ccNodes = cc.find(".rMr").children();//暂存，用于恢复完整模式
                to.find(".rMr").append(this.ccNodes);
                cc.hide();
                this.$el.find("#sendDate").hide();
                this.$el.find("#receiver_to span").html("于&nbsp;" + this.$el.find("#sendDate div").html()+ "&nbsp;发送至&nbsp;");
                   
                this.$el.find("[name=batch_addr]").hide();
                    
           
            }
           
        } else {    //完整
            if (this.isBriefMode) {
                this.isBriefMode = false;
                to.find(".rMr").children().show();
                cc.find(".rMr").append(this.ccNodes);
                cc.show();
                this.ccNodes.show();
               
                this.$el.find("#sendDate").show();
                this.$el.find("#receiver_to span").html("收件人");

                this.$el.find("[name=batch_addr]").show();
            }
        }
        //切换按钮的生成
        if (this.isBriefMode != undefined) {
            var btnSwitch = $("<div id='btn_switchBrief' class='rMr_right'><a href='javascript:' bh='" + (self.isBriefMode ? "readmail_showdetail" : "readmail_showsimple") + "'>" + (self.isBriefMode ? "完整信息<i class='g-down'></i>&nbsp;&nbsp;" : "精简信息<i class='g-up'></i>&nbsp;&nbsp;") + "</a></div>");
            this.$el.find('#btn_switchBrief').remove();//先清场
            this.$el.find('#receiver_from').find(".rMr").append(btnSwitch);
            btnSwitch.click(function () {

                self.showBriefMode(!self.isBriefMode,true);
                self.CutBriefReceiver(true);
                $(this).remove();
            });
        }
        
    },
    CutBriefReceiver: function (isSwitch) {
        var self = this;
        var to = this.$el.find('#receiver_to');
        var cc = this.$el.find('#receiver_cc');
        if (this.isBriefMode) {
            var LINEHEIGHT = 20;//行高
            var list = to.find(".gAddr");

            for (var i = list.length - 1; i > 0; i--) {//判断高度是否超过一行，超过一行隐藏元素
                var elem = list[i];
                //console.log(elem);
                $(elem).show();
                if (to.height() > LINEHEIGHT) {
                    $(elem).hide();
                }
                
            }

        } else if (!isSwitch) {
            if (to.height() + cc.height() > 50) {//超过2行切换为精简
                this.showBriefMode(true);
            }
        }
        this.$el.find(".gAddr:visible").find(".i_triangle_d").html(",");
        this.$el.find(".gAddr:visible:last").find(".i_triangle_d").html(self.isBriefMode ? "..." : " "); //去除最后一个逗号
        this.$el.find("#receiver_to").find(".gAddr:visible:last").find(".i_triangle_d").html(self.isBriefMode ? "..." : " ");
        this.$el.find("#receiver_from .gAddr").find(".i_triangle_d").html(" ");
    },
		
    resizeSwitchBtn: function() {
        // 往来邮件闭合按钮的默认right值是0，在有滚动条的时候要重置为16px
        // 当没有滚动条/展开的时候，需要将style中的right值清空，使样式设置的值生效
        var el = $(this.el);
        var switchBtn = el.find('.switchOn3');
        var inbox = el.find('div.J-readMailArea:eq(0)');
        if (!el.hasClass('inboxflOff'))  {
            switchBtn.css('right','');
        } else if (inbox[0] && inbox[0].scrollHeight > inbox.height()) {
            var right = $B.is.chrome ? '12px' : '16px';
            switchBtn.css('right',right);
        }
    },
		/**
		* 判断是否加载成功
		* @param {object} 图片对象
		*/
		checkLoadImg:function(){  
			var self = this;
			var errorImg = '/m2012/images/global/nopic.jpg'; //异常情况替换
			var prewImgObj = $(self.el).find("img.imgLink");
		
			prewImgObj.length>0 && $.each(prewImgObj,function(index){
				  var _this = this;
				  $(this).error(function(){ 
							$(this).attr('src',errorImg).attr('rel',2);	
							var imgUrl = $(this).attr('data-url');
							_this = null;
							self.logger.error("readmail prewImages load error", "[mbox:getThumbnail]", imgUrl);
						})
			})
		},    
	  
		/** 分栏读信更多菜单栏 */
		splitToolbarMore:function(toolbarview,mid){
			var self = this;
			if($App.getLayout()=='left' || $App.getLayout()=='top'){
				var btn = $('.toolBarArray #btn_more');
				var menupop = btn.find('.menuPop');
				if(menupop.length>0){menupop.remove();}
				btn.show().click(function(){
					toolbarview.createMoreToolMenu(mid,btn);
				});                
			}
		},	
		
		
		/** 来邮提醒链接 
		 * 不显示：我的订阅，群邮件，广告，病毒，垃圾不显示
		*/
		getMailNotifyLink:function(from,fid){
			var notifyLink = '';
			if(fid && $.inArray(fid,[5,6,9,11,12]) == -1){
				notifyLink = '<span style="padding-left:10px;"><a href="javascript:;" onClick="return false" id="addmailnotify" data-from="' + $T.Utils.htmlEncode(from) + '">[来邮短信提醒]</a></span>';
			}
			return notifyLink;
		},
		
		
		/** 标签功能 */
		mailTagEvent:function(){
			var self = this;
			appView.on("readmailControl",function(e){   
				var thismid = self.model.get('mid');
				if(e.mids && $.inArray(thismid,e.mids) > -1){
					if( e.command == 'tag'){
						setTimeout(function(){
							var labelIds = $App.getMailDataByMid(thismid).label; //邮件列表对应的标签数据
							if($.inArray(e.args.labelId,labelIds)==-1){ 
								labelIds.push(e.args.labelId); //插入新的标签数据
								appView.trigger("mailboxDataChange",{render:true});   //更新了数据才刷新列表
								console.log('读信页刷新列表');
							}
							self.renderTag($(self.el).find('.readTagdiv'), self.getTagHtml(labelIds));
						},500)
					} 
				}
			});
		},
		
		
		/** 信头渲染 */
		renderHeader:function(){
				
			/** === 数据定义 === */
			var self = this,
				$el = $(self.el),
				mid = this.model.get('mid'),
				dataSource = this.model.get('dataSource'),
				mailListData = self.model.get('mailListData'),
				currFid = self.model.get("currFid"),
				fid = currFid,
				label = [],
				mailData = $App.getMailDataByMid(mid),
				thistemp = self.template.mailHeader,
                searchMode = currFid == 0;

            $el.find('.J_toggleTriangle').die('click').live('click', function() {
                self.toogleIconsDesc();
            });
            $el.find('.J_backupMail').die('click').live('click', function() {
                self.backupMail();
            });
			
			if(this.el){this.setElement(this.el)}
		
			if(mailListData && mailListData.fid){
				fid = mailListData.fid;
                currFid=fid;
                self.model.set("currFid",fid);

			}

            var isSessionMode = $App.isSessionMode() && $App.isSessionFid(fid);
			
			//是否精品订阅邮件和任务邮件
			var isSubscribeaction = false;
			if(dataSource.headers){
				if(dataSource.headers["X-RICHINFO"]){
					isSubscribeaction = true; 
				}
				if(dataSource.headers.taskDate){
					dataSource.taskDate = dataSource.headers.taskDate;
				}
			}
			self.model.set({isSubscribeaction:isSubscribeaction});
			
			//邮件标签
			if(mailData && mailData.label){
				label = mailData.label;
			}
			self.model.set({dataSource:dataSource,label:label});

			//定义邮件撤回
			self.recallview.model.set({fid:fid,dataSource:dataSource});    		 
			
			//定义标题
			var title  =  dataSource.subject == "" ? "(无)" : dataSource.subject;
			
			//设置tab标题,只在飞信读信用
			if(self.model.get('source')=='interface'){	
				title = title.replace(/&nbsp;/i,'');
				$App.setTitle(title);
			}

			/** === 渲染工具栏 === */
			var showToolBar = true;			
			var toolbarContainer = $("#toolbar_" + mid);
			
			if($(self.el).attr('id') == 'readWrap' || $App.isNewWin()){
				showToolBar = false;
			}
			
			if(showToolBar){

				var toolbarview = new M2012.ReadMail.ToolBar.View({
                        el:"#toolbar_" + mid,
                        dataSource:dataSource,
                        currFid:currFid, 
                        getSessionPrevNextMail:isSessionMode, 
                        mailListData:mailListData,
                        searchMode: searchMode
                    });
				var toolbarHtml = toolbarview.render();
				toolbarContainer.html(toolbarHtml);
				toolbarview.initEvents();
				
				//工具栏下拉菜单
				var readmailOption = {
					mid:mid,
					mail:self.model.get("mailListData")
				};
				
				new M2012.Mailbox.View.MailMenu({ el: "#toolbar_" + mid + " .toolBarUl", model: new M2012.Mailbox.Model.Mailbox, readmail: readmailOption }).render();
			
				//分栏读信工具栏
				self.splitToolbarMore(toolbarview,mid);
			}else{
				toolbarContainer.hide();
			}
			
			/** === 渲染读信头部 === */
			var formatObj = {
				mid: mid,
				titleIco:self.getTitleIco(mid),
				titleColor:self.getColor(mid),
				reCall:self.recallview.render(),
				title: M139.Text.Utils.htmlEncode(title),
				tagHtml: self.getTagHtml(label),
				fromHtml: self.getReceiverHtml('发件人',dataSource.account,{type:'from',vip:self.getVipHtml(dataSource),agent:self.getAgentHtml(dataSource),refuse:self.getRefuseHtml(dataSource,fid),notify:self.getMailNotifyLink(dataSource.account,fid)}),//self.getFromHtml(dataSource.account,self.getAgentHtml(dataSource)),
				toHtml: self.getReceiverHtml('收件人',dataSource.to,{type:'to'}),
				ccHtml: self.getReceiverHtml('抄　送',dataSource.cc,{type:'cc'}),
				bccHtml: self.getReceiverHtml('密　送',dataSource.bcc,{type:'bcc'}),
				dateHtml : self.getDateHtml(dataSource),
				attachHtml: self.getAttachHtml(dataSource),
				remarkClass: self.getRemarkClass(dataSource),
				starAttributeNew: self.starAttributeNew(dataSource.flag),
				tagMenuHtml: self.getTagMenuHtml(),
				newWinUrl: $App.isNewWin() ? '' : self.newWinUrl(mid,currFid),
				cloudNote: self.cloudNote(mid, currFid),
				printMail: self.printMail(mid)

			};
			
			var thisCon = $('#readmail_' + mid);
			thisCon.html($T.Utils.format(thistemp,formatObj) || '');
			thisCon.find(".allgetdown").click(function(event){
			//	alert(123321);
				event.stopPropagation();
			});
            // 订阅邮件不显示功能icons
            if (!$App.getMailboxView().model.isSubscriptionMail()) {
                $el.find('#readMailIcons').show();
            }
			
			$el.find('div.J-readMailArea').css({'visibility':'visible'});

			/** === 我的标签 === */ 
			self.renderTag($el.find('.readTagdiv'));
			//self.mailTagEvent();
			
			/** === 任务提醒 === */
			$el.find('#readMailIcons').prepend(self.getRemindHtml(dataSource, '<a class="{iclass}" href="javascript:;" bh="readmail_icons_task" name="mailtask" title="设置任务" mid="{mid}" status="{status}" taskdate="{taskdate}" from="{from}" senddate="{senddate}" subject="{subject}"></a> <span>|</span> '));
            $el.find('.J_iconDesc').prepend(self.getRemindHtml(dataSource, '<a href="javascript:;" bh="readmail_desc_task" name="mailtask" mid="{mid}" status="{status}" taskdate="{taskdate}" from="{from}" senddate="{senddate}" subject="{subject}">设置任务</a> | '));

			self.remindview.addEvent($el.find('#leftbox'));
			
			
			/** === 投递状态 === */ 
			if(fid==3 && mailListData && mailListData.rcptFlag){
				var deliveryContainer = "#deliverystatus_div_" + mid ;
				self.deliverystatusview.el = deliveryContainer;
				self.deliverystatusview.model.set({mid:mid,rcptFlag:mailListData.rcptFlag});
				self.deliverystatusview.render();
			}
			

			/** === 批量添加联系人[收件和抄送] === */ 
			self.showBatchAddLink({data:dataSource.to,type:'to'});
			self.showBatchAddLink({data:dataSource.cc,type:'cc'});
			

            /** === 邮件备注 === */
			var remarkContainer = "#readmail_" + mid;
			var remarkview = new M2012.Remark.View({el:remarkContainer});
			if(dataSource.flag && dataSource.flag.memoFlag == 1){
				remarkview.model.set({opType:'get',mid:mid});
				remarkview.render();
			}else{
				remarkview.model.set({mid:mid});
			}
			remarkview.initEvents();	

			/** === 已读回执 === */ 			
			if(dataSource.requestReadReceipt == 1 && fid != 3){
				var readreceiptview = new M2012.Receipt.View();
				readreceiptview.model.set({
					mailListData:mailListData,
					requestReadReceipt:1,
					readReceipt:dataSource.readReceipt || null
				});
				readreceiptview.initEvents();
			} 

			/** === 往来邮件 === */ 	
			//判断是否默认显示往来邮件,精品订阅不显示
			var contactsFlag = true;
			var thismail = dataSource.account;
			if(isSubscribeaction || thismail==''){
				contactsFlag = false;
			}		
			//逼近式搜索时，上下视图、左右视图不显示往来邮件
			var mailboxModel = self.mailboxModel;
			if(mailboxModel && mailboxModel.get('layout') != 'list' && mailboxModel.isApproachMode()){
				contactsFlag = false;
			}

			if(contactsFlag && !self.model.isFromMyself(dataSource)){ 
				var contactsInfo = $App.getModel('contacts').getContactsByEmail(thismail);
				//往来邮件#￥%
				
				if (true || top.$User.isGrayUser()) { //灰度和全网上不同的版本
				    if (!this.contactRecordView) {
				        this.contactRecordView = new M2012.ReadMail.ContactRecord.View({ el: self.el, 
                        keyword: thismail, mid: mid, contactsInfo: contactsInfo,parentView:self });
				    }
				}else{
					//contactsmailview = new M2012.ReadMail.SessionContactsMail.View({el:self.el,keyword:thismail,mid:mid,contactsInfo:contactsInfo});
				}

                /*
                 * 往来邮件唤出Btn的点击事件
                 *
                 */
                var switchBtn = $el.find('.switchOn3');
                switchBtn.click(function(){
                    // 原有代码，通过切换样式（inboxflOff）来控制显示隐藏和定位
                    // 目前仍依赖这个样式进行判断
                    $el.hasClass('inboxflOff') ? BH('rmcontact_show') : BH('rmcontact_hide');
                    $el.toggleClass('inboxflOff');

                    // 控制往来邮件模块显示/隐藏
                    var contactMailsCon = $el.find('#contactMails');
                    if ($el.hasClass('inboxflOff')) {
                        BH("rmcontact_close");
                        contactMailsCon.hide();
                    } else {
                        BH("rmcontact_open");
                        contactMailsCon.show();
                    }
                    !contactMailsCon.length && self.contactRecordView.render();
                    self.resizeSwitchBtn();
                });
                // ie6下需要通过js实现来邮件唤出Btn的fixed效果
                if ($B.is.ie && $B.getVersion() === 6) {
                    // 初始位置校正
                    switchBtn.css({'position': 'absolute', 'top': '31px', 'right':0});
                    // 滚动实时位置调整
                    $el.find('div.J-readMailArea:eq(0)').scroll(function() {
                        var offsetTop = $(this).scrollTop();
                        switchBtn.css('top', offsetTop + 31);
                    });
                }
			}else{
				$el.addClass('inboxflOff');
				$el.find('.switchOn3').hide();
			}
            $el.addClass('inboxflOff');//总是隐藏			
			
			/** === 联系人页卡 === */ 
			if(!$App.isNewWin()){
				self.showContactCard($el);
			}
			
			/** === 附件 === */  			
			//附件缩略图预览
			var thumbnailsHtml = self.filepreview.getThumbnailsHtml(title,dataSource.attachments,mid);
			thumbnailsHtml = "";
			thumbnailsHtml!='' && $('#mailContent_' + mid).append(thumbnailsHtml);
			
			//附件缩略图加载失败处理
			self.checkLoadImg(); 
			
			//附件存彩云事件(头部和尾部)
			self.filepreview.el = $el.find('.convattrlist,#attach_' + mid);
			self.filepreview.initEvents(dataSource,mid);  
			
			/** === 邮件撤回功能 === */ 	
			self.recallview.el = $el.find('#recall');
			self.recallview.initEvents();  
			
			/** === 快捷回复 === */ 	
			var showQuickReply = true;
			if(isSubscribeaction){
				showQuickReply = false; //精品订阅不显示快捷回复
			}
			if(showQuickReply){
				var quickReplyContainer = "#quickreply_" + mid;
				var replyall = self.getReplyAllEmails(dataSource);
				self.quickreplyview.setElement(quickReplyContainer);
				self.quickreplyview.model.set({mid:mid,sender:dataSource.account,replyAll:replyall});
				self.quickreplyview.render();
				self.quickreplyview.initEvents();  
			}else{
				$el.find('.readMailReply').hide();
			}	

			self.showBriefMode(true);
			/** === 预警提醒 === */ 	
			self.riskTipsEvent();
			
			//滚动条
			self.scrollTopEvent();
			
			
			/** === 窗口自适应 === */ 	
			self.onResize();
			//$el.scrollTop(0);
			$(window).resize(function(){
				self.onResize();
			});
		

			
			//event define end 
		},
		
		/** 预警提醒 */
		riskTipsEvent:function(){
			var self = this;
			var $el = this.$el;
			var fid = self.model.get('currFid');
			var dataSource = self.model.get('dataSource');
			if(self.letterDomReady && self.letterInfoReady && !self.showRiskTips && fid && dataSource){
				self.showRiskTips = true;
				self.risktipsview.el = self.el;
				self.risktipsview.model.set({fid:fid,dataSource:dataSource});
				if(self.risktipsview.model.isDisableImg()){
					var mid = this.model.get('mid');
					var contentDoc = $('#mid_' + mid)[0].contentWindow.document;
					$(contentDoc).find('img').each(function(n,val){
						var src = $(this).attr('src');
						$(this).attr('original',src).removeAttr('src');
					});
					//dataSource.html.content = content.replace(/src=/ig, 'original='); //替换所有img src=变量            
				}
				var riskTipsHtml = self.risktipsview.render();
				if(riskTipsHtml){
					$el.find('div#leftPart').after(riskTipsHtml);
					self.risktipsview.initEvents();
				}	
			}
		},
		
		
		/** 邮件头事件 */
		initMailHeaderEvent:function(){
			var self = this;
			var mid = this.model.get('mid');
			var commandMid = 'letterInfoReady_' + mid;

			$App.off('letterInfoReady').on('letterInfoReady',function(data){ //off解除旧信监听
				if(data && data.omid !== mid){ 
					//超时处理
					if(data && data.code === "FA_INVALID_SESSION"){
						$App.showSessionOutDialog();
						M139.UI.TipMessage.hide();
					}
					return; 
				}                    
				self.letterInfoReady = true;
				letterInfoHandler(self,data);
				//console.log('我是第一次输出');
			});
			
			//二次验证
			$App.off(commandMid).on(commandMid,function(data){			
				if(self.letterInfoReady){return}
				letterInfoHandler(self,data);				
				self.letterInfoReady = true;
				//console.log('我是第二次输出');				
			});
			
			
			function letterInfoHandler(self,data){
				if(data && (data.errorCode || data.errorCode == 0)){ 
					self.logger.error("readmail letterInfo returndata error", "[view:readMessage]", data);
					self.readMailError(data, true); //异常处理
				}else{
					self.model.savePrintData(data); //保存数据
					self.model.set({dataSource:data});
					self.renderHeader();
				}
			}
		},
		
		
		
		/** 邮件正文事件 */
		initMailContentEvent:function(){
			var self = this;
			var fid = self.model.get('fid');
			var mid = self.model.get('mid');
			var commandMid = 'letterDomReady_' + mid;

            if(this.el){this.setElement(this.el)}
			
			$App.off('letterDomReady').on('letterDomReady',function(win){

                if(win && win.letterInfo && win.letterInfo.omid !== mid){
                    return;
                }
				
				self.letterDomReady = true;
				letterDomHanderl(self,win);
				
			});
			
			//二次验证
			$App.off(commandMid).on(commandMid,function(win){			
				if(self.letterDomReady){return}
				letterDomHanderl(self,win);				
				self.letterDomReady = true;
			});
			
			
			function letterDomHanderl(self,win){
				var errorFlag = false;
				if(win && win.letterInfo && win.letterInfo.errorCode){
					errorFlag = true;
				}
				if(!errorFlag && win.letterInfo && win.letterInfo.omid){
					
					//保存正文内容
					var content = win.document.body.innerHTML;
					M139.PageApplication.getTopApp().print[win.letterInfo.omid].html = {content:content}; 
					win.letterInfo.html = {content:content};
					self.readmailcontentview.mailDomReady(win.letterInfo,win);
					self.riskTipsEvent();
					_letterInlineScript(win);
					M139.UI.TipMessage.hide();

                    // 邮件正文样式兼容处理
//                    self.handleStyleForReadMailContent(win); // 暂不处理chrome的兼容性问题，损耗性能
				}
			}
		},

        // 读新内容样式的兼容性处理 add by chenzhuo
        handleStyleForReadMailContent: function (win) {
            var doc = win.document;

            // chrome中表格的单元格border宽度如果小于1pt，将无法显示
            if ($B.is.chrome) {
                var td = doc.getElementsByTagName("td");
                for (var i = 0, len = td.length; i < len; i++) {
                    var item = td[i];
                    var borderWidth = item.style.borderWidth;
                    if (borderWidth) {
                        // if border width less 1 (normal is 0.5), need 1 instead of it
                        item.style.borderWidth = borderWidth.replace(/0\.\d+/g, 1);
                    }
                }
            }
        },
		
		/** 滚动到顶部 */
		scrollTopEvent:function(){
			var self = this,
				scrollHeight = 0,
				scrollContainer = this.$el.find('div.J-readMailArea'),
				scrollTopIco = this.$el.find('a.i-backTop'),
				firstShow = false,
				times = 300; 
			
			this.scrollTimer = null; //函数节流，防止scroll频繁调用
			
			scrollTopIco[0] && scrollContainer.scroll(function(){
				
				var _this = this;
				
				if(!firstShow){
					firstShow = true;
					scrollTopIco.fadeIn(0);
				}

				clearTimeout(self.scrollTimer);
				
				self.scrollTimer = setTimeout(function(){
					scrollHeight = $(_this).scrollTop() || 0;
					if(scrollHeight > 0 && scrollTopIco[0].style.display === 'none'){
						scrollTopIco.fadeIn(0);
					}
					if( scrollHeight === 0 ){
						scrollTopIco.fadeOut(times);
						self.scrollTimer = null;
						firstShow = false;
					}				
				},times);
			});
			
			scrollTopIco.bind('click',function(){
				var _this = this;
				scrollContainer.animate({scrollTop:0}, times);
				setTimeout(function(){
					$(_this).fadeOut(times);
				},times);
			});
			
		},
		
		/** 加载运营邮件脚本,可以独立出来 */
		loadScript:function(options){
			var doc = options.doc || document,
				script = doc.createElement('script');
			script.src = options.src + '?sid=' + top.$App.getSid();
			doc.getElementsByTagName("body")[0].appendChild(script);
		},

		/** 读信异常 */
		readMailError:function(data, needClose){
			M139.UI.TipMessage.hide();
			needClose && $App.close();
			if(data && data.code === 'FA_INVALID_SESSION'){ //会话过期处理
				top.$App.showSessionOutDialog();
			}else{
				$Msg.alert('读取信件异常，请稍后再试。');
			}
		},		
	
		/** 读信主容器渲染 */
		render:function(isRendered){
			
			var self=this;
			var mid = this.model.get('mid');
			
			if(!isRendered){
				//self.model.set({isRendered:true});
				M139.UI.TipMessage.show("正在加载中...");
				var mailListData = self.model.get('mailListData'),
					currFid = self.model.get("currFid"),
					fid = currFid,
					label = [],
					mailData = $App.getMailDataByMid(mid),
					thistemp = self.template.readmailbody,
					options = {
						mid:mid,
						mailListData:mailListData,
						fid:fid,
						mailData:mailData
					};
				self.readmailcontentview.options = options;
				
				var formatObj = {
					mid: mid,
					contactStyle: $App.isNewWin() ? 'style="display:none"' : '',
					quickReplyHtml: self.getQuickReplyHtml(),
					mailContentHtml: self.readmailcontentview.getMailContentIframe(mid,true)
				};
				var thisHtml = $T.Utils.format(thistemp,formatObj);
				$(self.el)[0].innerHTML = thisHtml;
				
				//每次渲染时定义事件
				this.initMailHeaderEvent();
				this.initMailContentEvent();

                // 根据是否有滚动条来调整读信区域样式
                var $readMailArea = self.$el.find('div.J-readMailArea');
                setTimeout(function(){        
                    if ($readMailArea[0].scrollHeight <= $readMailArea.height()) {
                        $readMailArea.removeClass('bgPadding_left').addClass('bgPadding');
                    }
                }, 1000);
			}
			
		},
		
    
	
		/** 新窗口读信数据 */
		getNewWinData:function(callback){
			var self=this;
			var returnHtml = '';
			this.model.getDataSource(function(dataSource){
				var mid  =  dataSource.omid;
				var title  =  dataSource.subject == "" ? "(无)" : dataSource.subject;
				var dataObj = {
					dataSource:dataSource,
					mid: mid,
					titleIco:self.getTitleIco(mid),
					titleColor:self.getColor(mid),
					title: M139.Text.Utils.htmlEncode(title),
					fromHtml: self.getReceiverHtml('发件人',dataSource.account,{agent:self.getAgentHtml(dataSource)}),//self.getFromHtml(dataSource.account,self.getAgentHtml(dataSource)),
					toHtml: self.getReceiverHtml('收件人',dataSource.to),
					ccHtml: self.getReceiverHtml('抄　送',dataSource.cc),
					bccHtml: self.getReceiverHtml('密　送',dataSource.bcc),
					dateHtml : self.getDateHtml(dataSource),
					attachHtml: self.getAttachHtml(dataSource),
					mailContentHtml: self.readmailcontentview.getMailContentIframe(mid)
			   };
			   if(callback){callback(dataObj)};
			});
		 
		},

        onErrorCodeLinkClick: function(){
            var orignUrl = "/m2012/html/newwinreadmail.html?t=newwin&sid={0}&mid={1}&messycode=1";
            window.open($T.Utils.format(orignUrl,[sid,$App.getCurrMailMid()]));
        },

        showOriginalLetter: function(){
            var orignUrl = "/RmWeb/view.do?func=mbox:getMessageData&mode=text&part=0&sid={0}&mid={1}";
            window.open($T.Utils.format(orignUrl,[sid,$App.getCurrMailMid()]));
            BH('toolbar_mailcode');
        },

        onExportMailClick: function(){
            var wmsvrPath2 =  domainList.global.wmsvrPath2;
            var downloadUrl = wmsvrPath2 + "/mail?func=mbox:downloadMessages&sid={0}&mid={1}";
            window.open($T.Utils.format(downloadUrl,[sid,$App.getCurrMailMid()]));
            BH('toolbar_export');
        },

        onMoreBtnClick: function(e){
            var dom = $(e.target); 
            var This = this;
            var offset = dom.offset();
            var menu = M2012.UI.PopMenu.create({
                items: [
                    {
                        text: "导出邮件",
                        onClick: This.onExportMailClick
                        //command: "exportMail"
                    },
                    {
                        text: "显示邮件原文",
                        onClick: This.showOriginalLetter
                        //command: "importMail"
                    },
                    {
                        text: "邮件有乱码？",
                        onClick: This.onErrorCodeLinkClick
                        //command: "errorCodeMail"
                    }
                ],
                width: 102,
                left: offset.left - 102,
                top: offset.top + 16
            });
        },

        backupMail: function() {
            $App.trigger("mailCommand", {
                command: 'backupMail',
                mids: [$App.getCurrMailMid()]
            });
            BH('toolbar_backupMailSingle');
        },

        toogleIconsDesc: function() {
            var $J_iconDesc = this.$el.find('.J_iconDesc');
            var $readMailIcons = this.$el.find('#readMailIcons');
            var $i = this.$el.find('.J_toggleTriangle').find('i');

            if ($J_iconDesc.is(':visible')) {
                $J_iconDesc.hide();
                $i.removeClass('g-up').addClass('g-down');
                $readMailIcons.css('bottom', '13px');
            } else {
                $J_iconDesc.show();
                $i.removeClass('g-down').addClass('g-up');
                $readMailIcons.css('bottom', $J_iconDesc.height() + 13 + 'px');
            }
        }



}));
    
    
})(jQuery, _, M139); 



function _letterInlineScript(win) {
    //运营邮件处理
    win.from = '';
    win.subject = '';
    var document = win.document;

    /* 读信页面跳转处理特殊业务[没有重构的] */
    var jumpToKey = {
        partid: $User.getPartid(),
        source: 'jumpto',
        mid: $App.getCurrMailMid()
    }


    function writeScript(id, url) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.charset = 'utf-8';
        script.id = id;
        script.src = url + '?sid=' + $App.getSid();
        document.getElementsByTagName('body')[0].appendChild(script);
    }


    function letterInit(dataSource) {
        if (dataSource && dataSource.omid) {
            var mid = dataSource.omid;
            var letterScriptLoad = false;
            win.subject = dataSource.subject;
            win.from = $Email.getEmail(dataSource.account);
            var subjectMatch = [
                new RegExp("\u8fd9\u662f[\\s\\S]+?\u7684\u901a\u8baf\u5f55"),
                new RegExp("\u80fd\u628a\u901a\u8baf\u5f55\u5171\u4eab\u7ed9\u6211\u5417"),
                new RegExp("\u7684\u7535\u5b50\u540d\u7247"),
                new RegExp("\u66F4\u65B0\u4E86\u4E2A\u4EBA\u8D44\u6599")
            ];
            var idMatch = [
                "139command_flash",
                "mail139command",
                "aPostcard139",
                "139CommandQuickShare",
                "139Command_LinksShow",
                "addr_whoaddme",
                "welcome_alias",
                "welcome_mailnotify",
                "welcome_sms",
                "welcome_phoneFeixin",
                "welcome_pcFeixin",
                "welcome_foxmail",
                "welcome_collection",
                "welcome_mailList",
                "welcome_phoneToMail",
                "welcome_more",
                "139mailtobirthRemind",
                "birthRemind2",
                "checkin_go",
                "readmail",
                "quickHeadImg",
                "139olympic",
                "139jiayoly",
                "operationlinkId_0",
                "139Command_CustomLinks",
                "calendarInviteOp",
                "shareCalendarEmail",
                "shareLabel",
				"groupMailInviteOp"
            ];
        }
		
        checkMarketingMail();
        checkReadMark();
        checkSubscribeMail();

        var ua = navigator.userAgent.toLowerCase();
        var isIpad = ua.match(/ipad/i) == "ipad";

        if (isSubjectMatch() || isIdMatch() || isIpad) {
            if (isIpad) {
                top.ipadLetterMid = dataSource.omid;
            }
            letterScriptLoad = true;
            var scriptPath = "/m2012/js/richmail/readmail/m2012.readmail.letterscript.js";
            writeScript('letterscript', scriptPath);
        }


        var allLinks = document.links;

        $.each(allLinks, function (i) {
            var link = parent.$(allLinks[i], document);
            var href = link.attr('href');
            var rel = link.attr('rel');
            var param = link.attr('param');
            if (/^prod$/i.test(rel)) {//所有产品运营之类的跳转
                link.click(function () {
                    $PUtils && $PUtils.show(param, href);
                });
            } else if (/^http/i.test(href)) {
                link.attr('target', "_blank"); //是否每个a标签都加 _blank
            } else if (/^mailto:/i.test(href)) {
                link.click(function () {
                    var receiver = href.replace(/^mailto:/i, "");
                    $App.show("compose", null, {
                        inputData: {
                            receiver: href.replace(/^mailto:/i, "")
                        }
                    });
                    return false;
                });
            }
            if (link.attr("clicklog") == "true") {
                var thingId = link.attr("thingid");
                if (thingId && /^\d+$/.test(thingId)) {
                    link.click(function () {
                        top.addBehavior && top.addBehavior("邮件正文点击统计", this.getAttribute("thingid"));
                    });
                }
            }

        });

        if (win.frameElement.style.visibility == "hidden") {
            win.frameElement.style.visibility = "";
        }

        function isSubjectMatch() {
            var result = false;
            try {
                $.each(subjectMatch, function () {
                    if (this.test(win.subject)) {
                        result = true;
                    }
                });
                return result;
            } catch (e) {

            }
        }

        function isIdMatch() {
            var result = false;
            try {
                $.each(idMatch, function (n) {
                    if (document.getElementById(idMatch[n])) {
                        result = true;
                    }
                });
                return result;
            } catch (e) {
            }
            return result;
        }

        function checkMarketingMail() {
            var tag = document.getElementById("139Command_MarketingMail");
            if (!tag) return;
            var id = tag.getAttribute("rel");
            if (id && /^\d+$/.test(id)) {
				 top.addBehavior && top.addBehavior("打开运营邮件", id);
            }
        }

        function checkSubscribeMail() {
            var subscribeAccount = ['subscribe@139.com', 'cmpost@139.com', 'smpost@139.com', 'subscribe-service@139.com', 'subscribe-topic@139.com'];
            var accountFlag = false;
            $.each(subscribeAccount, function (n, val) {
                if (dataSource.account && dataSource.account.indexOf(val) >= 0) {
                    accountFlag = true;
                    return false; //退出循环
                }
            });
            if (dataSource.headers && dataSource.headers["X-RICHINFO"] && accountFlag) {
                //var scriptPath = "/m2012/js/richmail/readmail/m2012.readmail.subscribeaction.js"; // update by tkh 注入的JS由云邮局负责维护
                var scriptPath = "/mpost2014/js/mpost/mail/m2012.readmail.subscribeaction.js";
                
                writeScript('subscribeaction', scriptPath);
                var mediaplayerPath = "/m2012/component/mediaplayer/m139.component.mediaplayer.js";
                writeScript('mediaplayer', mediaplayerPath);
            }
        }

        function checkReadMark() {
            var element = document.getElementById("139Command_ReadMark");
            if (element) {
                var actionId = element.getAttribute("actionid");
                var thingId = element.getAttribute("thingid");
                var moduleId = element.getAttribute("moduleid");
				top.addBehaviorExt && top.addBehaviorExt({ actionId: actionId, thingId: thingId, moduleId:moduleId});
            }
        }
    }


    win.doc = $('body', document);
    win.doc.attr('rel', 1).attr('orignheight', win.doc.height());

    //页面初始化
    letterInit(win.letterInfo);
	$("#attachAndDisk").hide();
	(function(M139){
			var idMatch = ["attachAndDisk"];
			var result = false;
			try {
				$.each(idMatch, function (n) {
					if (document.getElementById(idMatch[n])) {
						result = true;
					}
				});
			}catch(e){}
			function setScript(url,callback) {
				var script = document.createElement('script');
				script.type = 'text/javascript';
				script.charset = 'utf-8';
				script.src = url + '?sid=' + $App.getSid();
				document.getElementsByTagName('body')[0].appendChild(script);
				if (document.all) {
					script.onreadystatechange = function () {
						if (script.readyState == "loaded" || script.readyState == "complete") {
							callback && callback();
						}
					}
				} else {
					script.onload = function () {
						callback && callback();
					}
				}
			}
			if(result && !top.$App.isSessionMode()){
			//	writeScript('jqu', "");
				setScript("/m2012/js/packs/libs.pack.js", function(){
					writeScript('attachanddiskdisplay', "/m2012/js/richmail/readmail/m2012.readmail.attachanddiskdisplay.js");
					if($("#downloadDisk").length == 0){
						$("<iframe id='downloadDisk' style='display: none;'></iframe>").appendTo(top.document.body)
					}
				});	
			}
			var infoSta = $("#infoSta");
				var listUp = $("i[id='listUp']");
				var listUpH = $("i[id='listUp']:visible");
				var listDown = $("i[id='listDown']");
				var listDownH = $("i[id='listDown']:visible");
				
				//	var infoStaCurrent = top.$("div[id='infoSta']");
				var mid = top.$App.getCurrMailMid();
				var curMail = top.$("#readmail_" + mid);
				var infoStaCurrent = curMail.find("#infoSta");
				if(infoStaCurrent.next("ul").find("li").length > 3){
					infoStaCurrent.next("ul").hide();
					listUp.show();
					listDown.hide();
				}
				
				$("div[id='infoSta']").unbind("click").bind("click", function () {
						var self = this;
						top.BH("readmail_toggle");
						if($("i[id='listUp']:visible").length == 0){
							listDown.hide();
							$(self).next().slideUp();
							listUp.show();
						}else{
							listUp.hide();
							$(self).next().slideDown();
							listDown.show();
						}
						
				});
			
	})(M139);
}