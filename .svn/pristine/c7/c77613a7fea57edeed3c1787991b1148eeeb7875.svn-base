/**
* @fileOverview 读信页往来邮件
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;

    /**
    * @namespace 
    * 读信页往来邮件
    */

        M139.namespace('M2012.ReadMail.Contactsmail.View', superClass.extend({

        /**
        *@lends M2012.ReadMail.Contactsmail.View.prototype
        */

        el: "",

        template: {
            container: ['<div class="contactsMail p_relative" id="contactsMail" style="background:white;">',
                        '</div>'
                        ].join(''),
        
        containerCon:['<div class="contactsMail-info">',
             '<div class="norTips">',
                '{contactsInfo}',
             '</div>',
            //'<p>邮件到达通知：<span class="gray">接收</span> <a href="#">修改</a></p>',
         '</div>',
         '<div class="contactsMail-btn ">',
             '<a class="btnTb" id="writeMailTo" href="javascript:;" bh="rmcontact_writemail"><span>写 信</span></a><a class="btnTb ml_5" href="javascript:$App.jumpTo(\'sms\')" bh="rmcontact_sendsms"><span>写短信</span></a>',
         '</div>',
         ' <!--[if lt ie 8]><div style="+zoom:1;"><![endif]-->',
         '<table class="contactsMail-tab" id="mailItem">',
             '<tbody><tr>',
                 '<th class="td1"><i class="i_m_n"></i></th>',
                 '<th class="td2">往来邮件</th>',
                 '<th class="td3"><a href="javascript:;" id="moremail" bh="rmcontact_moremail">更多</a></th>',
             '</tr>',
             //'{mailItem}',
         '</tbody></table>',
         '<!--[if lt ie 8]></div><![endif]-->',
         '<p class="contactsMail-text"><img src="../images/global/searchloading.gif" /> 数据加载中...</p>',
         ' <!--[if lt ie 8]><div style="+zoom:1;"><![endif]-->',
         '<table class="contactsMail-tab" id="attachItem" >',
             '<tbody><tr>',
                 '<th width="25" class="td1"><i class="i_atta"></i></th>',
                 '<th class="td2">往来附件</th>',
                 '<th width="35" class="td3"></th>',
             '</tr>',
             //'{attachItem}',
         '</tbody></table>',
          '<!--[if lt ie 8]></div><![endif]-->'
         ].join(''),
        
            contactsInfo:[ '<span class="norTipsIco"><a href="javascript:;" bh="rmcontact_seeinfo" ><img src="{img}" width="52" height="52" /></a></span>', //<img src="images/ad/face.jpg" width="52" height="52" alt="">
                 '<div class="norTipsContent">',
                     '<div class="norTipsTitle"><a href="javascript:;" bh="rmcontact_seeinfo" >{name}</a></div>',
                     '<div class="norTipsLine gray">{email}</div>',
                     '<div class="norTipsLine gray">{mobile}</div>',
                 '</div>'].join(''),
                 
            mailItem: [
                     '<tr>',
                 '<td class="td1"><i class="{classname}"></i>', //i_m_nf
                 '</td>',
                 '<td colspan="2" class="td4">',
                     '<div class="contactsMail-tit">{title}</div>',
                 '</td>',
                    '</tr>'
            ].join(''),

            attachItem: ['<tr>',
                 '<td class="td1"><i class="i_atta"></i></td>',
                 '<td colspan="2" class="td4">',
                     '<div class="contactsMail-tit">{href}</div>',
                 '</td>',
                    '</tr>'
            ].join(''),

            noMailTips: ['<p class="contactsMail-text">数据加载中...</p>'].join(''),
            noAttachTips: ['<p class="contactsMail-text">暂无往来附件<br>当你们有附件往来，就会显示在这里。<br/><a href="javascript:;" id="quickcompose">立即写信给Ta</a></p>'].join(''),

            mbMessageShow: ['<p id="yidongweibo11" class="weibop"><i class="i_wiebo mr_5"></i><a href="{link}" title="来我的微博看看吧！" id="microBlogNews">{message}</a></p>'].join(''),
            mbInvitelogShow: ['<p id="yidongweibo11"><a class="btnTb" href="javascript:void(0)" id="invite_register"><span><i class="i_wiebo mr_5"></i>邀请开通</span></a></p>'].join(''),
            mbLetterContent: ['<div style="font-family: 宋体; font-size: 14px; color: rgb(0, 0, 0);"><strong>Hi，亲爱的{name}：</strong></div>',
                           '<div style="font-family: 宋体; font-size: 14px; color: rgb(0, 0, 0); word-break:break-all;word-wrap:break-word;">您的好友{me}通过139邮箱邀请您开通移动微博，随时一句话，传遍好友圈，只需两步，注册成功！</div>',
                           '<div style="font-family: 宋体; font-size: 14px; color: rgb(0, 0, 0); word-break:break-all;word-wrap:break-word;">&nbsp;</div>',
                           '<div style="font-family: 宋体; font-size: 14px; color: rgb(0, 0, 0);">请点击以下链接进行开通：</div>',
                           '<div style="font-family: 宋体; font-size: 14px; color: rgb(0, 0, 0);">',
 						   '<a href="http://139url.cn/9ge2az">http://139url.cn/9ge2az</a>',
 						   '</div>',
                           '<div style="font-family: 宋体; font-size: 14px; color: rgb(153, 153, 153);">(如果点击无效，请复制链接到浏览器地址栏中)</div> ',
                           '<div style="font-family: 宋体;text-align:right; font-size: 14px; color: rgb(153, 153, 153);">{time}</div>',
                           '<div style="font-family: 宋体; font-size: 14px; color: rgb(0, 0, 0);">&nbsp;</div>',
                           '<div style="font-family: 宋体; font-size: 14px; color: rgb(0, 0, 0);">&nbsp;</div>'].join("")

        },

        initialize: function (options) {
            var self = this;
            this.keyword = options.keyword;
            this.email = $Email.getEmail(this.keyword);
            this.contactsInfo = options.contactsInfo;
            this.mid = options.mid;
            this.model = new M2012.ReadMail.Contactsmail.Model();
            this.mailmodel = $App.getView("mailbox").model;
            return superClass.prototype.initialize.apply(this, arguments);
        },

        /**
        * 通讯录信息
        */
        getContactsInfo: function(email){
            var self = this;
            var data = this.contactsInfo;
            var temp = self.template.contactsInfo;
            var imgSrc = '/m2012/images/ad/face.jpg';    
            M2012.Contacts.API.getContactsImage([$Email.getAccount(email)],function(url){
               if(url!=''){imgSrc = url}
            });
                        
            var name = $App.getModel('contacts').getAddrNameByEmail(email);
            return $T.Utils.format(temp,{
                img:imgSrc,
                name:M139.Text.Utils.htmlEncode(name),
                email:M139.Text.Utils.htmlEncode($Email.getEmail(email)),
                mobile:M139.Text.Utils.htmlEncode(data.MobilePhone)
            });
        },

        /**
        * 获取 微博信息，是邀请开通还是显示微博消息
        */

        showMicroblog: function () {

            var addres = this.keyword;
            //括取号内邮箱地址
            if (/[<>]/.test(addres)) {
                var reg = new RegExp("<(.+)>", "g");
                addres = reg.exec(addres)[1];
            }

            var showMicroBlog = top.SiteConfig.showMicroBlog;  //微博开关

            var senderDomain = $Email.getDomain(addres);  //发件人的域名
            var mailDomain = top.SiteConfig.mailDomain;   //当前线域名

            if (showMicroBlog && mailDomain == senderDomain) {
                var self = this;
                top.M139.RichMail.API.call("weibo:userinfo", { weibo: addres }, function (response) {
                    var res = response.responseData;
                    if (res && res['code'] == "S_OK") {
                        var data = res['var'];     
                        firstMessage = data.text?data.text:'我在移动微博，你在哪儿？';      
                        var link = data.screenName;
                        var showMessage = self.template.mbMessageShow;
                        showMessage = $T.Utils.format(showMessage, { message: firstMessage, link: link });
                        $(self.el).find('div.contactsMail-info').find('p#yidongweibo11').remove();
                        $(self.el).find('div.contactsMail-info').append(showMessage).find('#microBlogNews').click(function () {
                            BH('microblog_message');
                            var linkUrl = 'http://tmail.weibo.10086.cn/';
                            linkUrl += link;
                            if(!top.weibovalid){
                                var img = new Image();
                                img.src = top.SiteConfig.ssoInterface + "/GetUserByKeyEncrypt?url=" + encodeURIComponent("http://auth.weibo.10086.cn/sso/139mailframe.php?sid=") + "&comeFrom=weibo&sid=" + top.sid  //单点登录请求
                                img.onerror = function () {
                                    top.weibovalid = true;
                                    top.$App.showUrl(linkUrl, '移动微博');
                                }                                
                            }else{
                                top.$App.showUrl(linkUrl, '移动微博');
                            }
                            return false;
                        });

                    } else {

                        var invite = self.template.mbInvitelogShow;
                        $(self.el).find('div.contactsMail-info').find('p#yidongweibo11').remove();
                        $(self.el).find('div.contactsMail-info').append(invite).find('#invite_register').click(function () {
                            BH('microblog_invite');
                            var name = addres || '';  //收件人的名字
                            name = name.split('@')[0];
                            var time = top.M139.Date.getServerTime() || new Date();
                            time = time.format('yyyy年MM月dd日');
                            var sendName = self.getSendName();
                            var letterContent = self.template.mbLetterContent;
                            letterContent = $T.Utils.format(letterContent, { name: name, time: time, me: sendName });
                            var sendTitle = '您的好友' + sendName + '邀请您开通移动微博';
                            $App.show("compose", null, { inputData: { receiver: addres, subject: sendTitle, content: letterContent, letterPaperId: '0090' } });
                            return false;
                        });

                    };

                    
                })
            }
        },

        
        /**
        * 往来邮件列表
        */
        getMailList: function (data) {
            var self = this;
            var mailItem = self.template.mailItem;
            var html = [];
            var hrefTemp = '<a href="javascript:;" mid="{mid}" title="{subject}" bh="rmcontact_readmail">{subject}</a>';
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    var subject = '';
                    var classname = '';
					var from = data[i].from;			
                    if (from && from.indexOf($Email.getEmail(self.keyword)) > -1) {
                        classname = 'i_m_nf'; //in
                    }else{
						classname = 'i_m_hui';  //out
					}
					if(data[i].fid == 3){ classname = 'i_m_hui' }
                    if (data[i].subject == '') {
                        subject = '(无)';
                    } else {
                        subject = data[i].subject;
                    }
                    subject = subject.replace(/(&<{)|(}>&)/g,''); //过滤搜索字符
                    html.push($T.Utils.format(mailItem, {
                        classname: classname,
                        title: $T.Utils.format(hrefTemp, {
                            mid: data[i].mid,
                            subject: M139.Text.Utils.htmlEncode(subject)
                        })
                    }));
                }
            }
            return html.join('');
        },

        /**
        * 往来附件列表
        */
        getAttachList: function (data) {
            var self = this;
            var attachItem = self.template.attachItem;
            var hrefTemp = '<a href="{0}" title="{1}" bh="rmcontact_downattach">{1}</a>';
            var html = [];
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    var attachName = '';
                    var href = '';
                    if (data[i].attachName == '') {
                        attachName = '(无)';
                    } else {
                        attachName = data[i].attachName;
                    }
                    href = $T.Utils.format(hrefTemp, [self.getDownLoadUrl(data[i]), M139.Text.Utils.htmlEncode(attachName)]);
                    html.push($T.Utils.format(attachItem, {
                        href: href
                    }));
                }
            }
            return html.join('');

        },

        /**获取往来附件下载路径*/
        getDownLoadUrl: function (file) {
            var self = this;
            return $App.getDownLoadUrl({
                mid:file.mid,
                offset:file.attachOffset, 
                size:file.attachSize, 
                name:file.attachName,
                type:file.attachType, 
                encoding:file.encode
            });
        },

        /**往来邮件列表*/
        mailListRender: function (keyword) {
            var self = this;
            var mailListHtml = '';
            var options = {
                condictions: [ //往来邮件条件
                    {
                        field: "from",
                        operator: "contains",
                        value: keyword
                    },
                    {
                        field: "to",
                        operator: "contains",
                        value: keyword
                    },
					{
                        field: "cc",
                        operator: "contains",
                        value: keyword
                    }
                ]
            };
            //this.mailmodel.set("searchOptions", options);
            this.model.set("searchContactsMailOptions", options);
            this.model.searchContactsMail( options , function (result) {
                mailListHtml = self.getMailList(result);
                self.model.set({mailListData:result});
                $(self.el).find("#mailItem tbody").append(mailListHtml);
                mailListHtml != '' && $(self.el).find("p.contactsMail-text:eq(0)").remove();
                setTimeout(function(){
                    self.readmailEvent();
                },500);
                if($App.getLayout()=='left' || $App.getLayout() == 'top'){
                    $(self.el).find('#moremail').hide();         //分栏模式需要隐藏       
                }
                $App.trigger("mailboxDataChange");
            });
        },
        
        logger: new M139.Logger({name: "M2012.ReadMail.Contact"}),

        /** 往来附件列表 */
        attachListRender: function (keyword) {
            var self = this;
            var attachListHtml = '';
            var href = '';
            var options = {
                start: 1,
                total: 15,
                order: 'receiveDate',
                desc: 1,
                stat: 1,
                isSearch: 1,
                filter: {
                    from: keyword
                }
            };
            this.model.getAttachData(options, function (result) {
                if (result.code === 'S_OK' && result['var']) {
                    if(result['var'].length > 0){
                        attachListHtml = self.getAttachList(result['var']);
                        $(self.el).find("#attachItem tbody").append(attachListHtml);
                    }else{
                        $(self.el).find("#attachItem").after(self.template.noAttachTips);
                    }
                } else {
                      self.logger.error("readmail contact attach returndata error", "[attach:listAttachments]", result);
                }
            });

        },
        
        /** 获取往来单封邮件数据 */
        getMailDataByMid:function(mid){
            var self = this;
            var mailListData = self.model.get('mailListData');
            var mailData = null;
            $.each(mailListData,function(n){
                if(mailListData[n].mid == mid){
                    mailData = mailListData[n];
                    return false;
                }
            });
            return mailData;
        },

        getSendName: function () {
            var usrInfo = top.$PUtils.userInfo;
            if (usrInfo.userName && usrInfo.userName != usrInfo.UserNumber) {
                return usrInfo.userName;
            } else if (usrInfo.aliasName) {
                return usrInfo.aliasName;
            } else if (usrInfo.UserNumber) {
                return usrInfo.UserNumber;
            } else {
                return '';
            }
        },

                
        /**定义事件*/
        initEvents: function (show) {
            var self = this;
            if(show){ 
                self.showInfo();
            }
            self.showMicroblog();
        },
        
        /** 显示往来邮件信息 */
        showInfo:function(){
            var self = this;
            var containerCon = self.template.containerCon;        
            var content = $T.Utils.format(containerCon, {
                contactsInfo: self.getContactsInfo(self.keyword)
            });
            
            var email = $Email.getEmail(self.keyword);
            var htmlContainer = $(self.el).find('#contactsMail');
            if(!htmlContainer.attr('rel') && self.keyword){
                htmlContainer.prepend(content).attr('rel',1);
                self.mailListRender(email);
                self.attachListRender(email);
            }
            
        },
        
        //联系人信息事件
        contactInfoEvent:function(){
            var self = this;
            $(self.el).find('.contactsMail-info .norTips a').bind('click',function(){
                var contactsInfo = self.contactsInfo;
                if(contactsInfo && contactsInfo[0]){ //编辑联系人
                    top.$App.show("addrEdit","&id=" + contactsInfo[0].SerialId + "&pageId=0");
                }else{
                    //添加联系人
                    var name = $Email.getName(self.keyword);
                    var account = $Email.getAccount(self.keyword);
                    new M2012.UI.Dialog.ContactsEditor({
                        name: name,
                        email: $Email.getEmail(self.keyword),
                        mobile: $Mobile.isMobile(account) ? account : '' 
                    }).render();
                }
            });
        },

        //读信
        readmailEvent:function(){
            var self = this;
            $(self.el).find('.contactsMail-tit a').bind('click',function(){
                var mid = $(this).attr('mid');
                var mailData = self.getMailDataByMid(mid); 
				
				//要区分草稿箱
				if(mailData && mailData.fid == 2){
					$App.restoreDraft(mid);
				}else{
					$App.readMail(mid,false,null,{mailData:mailData});
				}
				
            });
            
            //更多往来邮件
            $(self.el).find('#moremail').click(function(){
                var options = self.model.get("searchContactsMailOptions");
                $App.trigger("mailCommand", { command: "showTraffic", email: options });
            });
            
            
            //写信点击
            $(self.el).find('#writeMailTo,#quickcompose').click(function(){
                $App.show("compose",null,{inputData:{receiver:self.keyword}});
            });
            
            //联系人信息事件
            self.contactInfoEvent();
        },
        
        render: function (show) {
            var self = this;
            var container = self.template.container;
            $(self.el).find(".J-readMailArea").append(container);
            self.initEvents(show);
        }

    }));
    

})(jQuery, _, M139);


