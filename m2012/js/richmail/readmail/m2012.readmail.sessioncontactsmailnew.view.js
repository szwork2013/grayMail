/**
* @fileOverview 读信页往来邮件会话
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
	//定义hoverTips类 单例模式加鼠标效果混合于一体 create by zhangsixue
	function hoverTips(options){
		this.dock = options.dock || null;
		this.mid = options.mid || "";
		this.isAttach = options.isAttach || false;
		this.midData = options.midData || {};
		this.currentHtml = "";
		this.initEvents();
	}
	hoverTips.prototype = {
		constructor : hoverTips,
		list : {},
		template : "<div class='selfTips_{0}' style='position: absolute; display: none; background:#000; z-index:1000; width: 300px; border: 1px solid #000;'> this is a window for this tips{1}</div>",
		templateMess : ['<div class="menuPop shadow lw-pop" id="Tips_{id}" style="top:1px;">',
					  '<table>',
						'<tr>',
						  '<td class="td1">主题：</td>',
						  '<td>',
							'{subject}',
						  '</td>',
						'</tr>',
						'<tr>',
						  '<td class="td1">时间：</td>',
						  '<td>{date}</td>',
						'</tr>',
					  '</table>',
					'</div>'].join(""),
		templateAttach : ['<div class="menuPop shadow lw-pop" id="Tips_{id}" style="top:1px;">',
					  '<table>',
						'<tr>',
						  '<td class="td1">主题：</td>',
						  '<td>',
							'{subject}',
						  '</td>',
						'</tr>',
						'<tr>',
						  '<td class="td1">附件：</td>',
						  '<td>',
							'{attachName}',
						  '</td>',
						'</tr>',
						'<tr>',
						  '<td class="td1">时间：</td>',
						  '<td>{date}</td>',
						'</tr>',
					  '</table>',
					'</div>'].join(""),
		initEvents: function(){
			var self = this;
			this.dock.unbind();
			this.dock.hover(function(){
				var offset = self.dock.offset();
				var height1 = self.dock.height();
				self.currentHtml = self.create();
				var windowHeight = $(window).height();
				var currentHtmlHeight = self.currentHtml.height();
				var left1 = 0;
				var top1 = 0;
				top1 = offset.top + height1;
				if(!self.isAttach){
					left1 = offset.left - 30;
				}else{
					left1 = offset.left - 48;
				}
				if(currentHtmlHeight + height1 + offset.top > windowHeight){
					top1 = offset.top - self.currentHtml.height() - 8;
				}
				self.currentHtml.css({
					left : left1,
					top : top1
				});
				self.delayShow();
		//		self.currentHtml.mouseenter(function(){
		//		clearTimeout(self.hideTime);
			//	self.delayShow();
		//		}).mouseleave(function(){
		//			clearTimeout(self.showTime);
		//			self.delayHide();
		//		});
			},function(){
				clearTimeout(self.showTime);
				self.delayHide();
			});
			//点击的时候也要隐藏
			this.dock.click(function(){
				self.delayHide();
			});
		},
		//往来附件少掉一项
		getTemplate : function(){
			if(!this.isAttach){
				return this.templateMess;
			}else{
				return this.templateAttach;
			}
		},
		create: function(){
			var jQ = null;
			var self = this;
			if(this.mid in this.list){
				jQ = this.list[this.mid];
				return jQ;
			}
			var midTh = "sixue" + Math.random().toString().slice(2);
			var thisTemplate = this.getTemplate();
			var subject = self.midData.subject;//标题不用处理了^_^
			if(!this.isAttach){
				thisTemplate = M139.Text.Utils.format(thisTemplate,{
					id: midTh,
					subject : M139.Text.Html.encode(subject),
					date : $Date.format("yyyy-MM-dd hh:mm:ss",new Date(self.midData.sendDate * 1000))
				});
			}else{
				thisTemplate = M139.Text.Utils.format(thisTemplate,{
					id: midTh,
					subject : M139.Text.Html.encode(subject),
					attachName : M139.Text.Html.encode(self.midData.attachName),
					date : $Date.format("yyyy-MM-dd hh:mm:ss",new Date(self.midData.sendDate * 1000))
				});
			}			
			$(thisTemplate).appendTo(document.body);
			this.list[this.mid] = $("#Tips_"+ midTh);
			return $("#Tips_"+ midTh);
			
		},
		delayShow :function(){
			var self = this;
			clearTimeout(this.showTime);
			this.showTime = setTimeout(function(){
				self.currentHtml.show();
			},50);
		},
		delayHide :function(){
			var self = this;
			this.hideTime = setTimeout(function(){
				self.currentHtml.hide();
			},50);
		}
	};
    var superClass = M139.View.ViewBase;

    /**
    * @namespace 
    * 读信页往来邮件会话
    */

        M139.namespace('M2012.ReadMail.SessionContactsMailNew.View', superClass.extend({

        /**
        *@lends M2012.ReadMail.SessionContactsMail.View.prototype
        */

        el: "",
		
		name: "M2012.ReadMail.ContactsMail",

        template: {
            container: ['<div class="contactsMail p_relative" id="contactsMail" style="background:white;">','</div>'].join(''),
        
        containerCon:['<div class="contactsMail-info">',
             '<div class="norTips">',
                '{contactsInfo}',
             '</div>',
            //'<p>邮件到达通知：<span class="gray">接收</span> <a href="#">修改</a></p>',
         '</div>',
         '<div class="contactsMail-btn ">',
             '<a class="btnTb" id="writeMailTo" href="javascript:;" bh="rmcontact_writemail"><span>写 信</span></a><a class="btnTb ml_5" href="javascript:$App.jumpTo(\'sms\')" bh="rmcontact_sendsms"><span>写短信</span></a>',
         '</div>',
		 '<div class="readtab">',
			'<ul class="readtab-ul clearfix">',
				'<li class="li1 on" bh="rmcontact_mailtab" >',
					'<a href="javascript:;" hidefocus="true">',
						'<i class="i_m_n"></i>',
						'<span>往来邮件</span>',
					'</a>',
				'</li>',
				'<li class="li2" bh="rmcontact_attachtab" >',
					'<a href="javascript:;" hidefocus="true">',
						'<i class="i_atta"></i>',
						'<span>往来附件</span>',
					'</a>',
				'</li>',
			'</ul>',
			'<div class="readtab-text readtab-text-mail" id="mailItem">',
				'<p class="ta_c pt_10 pb_10"><img src="../images/global/load.gif"> 正在加载中...</p>',
			'</div>',
			'<div class="readtab-text hide" id="attachItem">',
				'<p class="ta_c pt_10 pb_10"><img src="../images/global/load.gif"> 正在加载中...</p>',			
			'</div>',
		'</div>'
         ].join(''),
        
			inMailItem:['<div class="wl-mail">', //发出的邮件
						'<div class="wl-ico"></div>',
						'<div class="wl-t"></div>',
						'<div class="wl-c" mid="{1}">',
							'<ul>',
							  '{0}',
							'</ul>',
						'</div>',
					'<div class="wl-b"></div>',
			//	'<div class="tips-text">',
			//		'<div class="imgInfo imgInfo-attr">',
			//			'{1}',
			//			'<ul class="readtab-list">',
			//				'{0}',
			//			'</ul>',
			//		'</div>',
			//	'</div>',
			//	'<div class="tipsRight diamond"></div>',
			'</div>'].join(''),
			
			outMailItem:['<div class="wl-mail-r">', //发出的邮件
						'<div class="wl-ico"></div>',
						'<div class="wl-t"></div>',
						'<div class="wl-c" mid="{1}">',
							'<ul>',
							  '{0}',
							'</ul>',
						'</div>',
					'<div class="wl-b"></div>',
			//	'<div class="tips-text">',
			//		'<div class="imgInfo imgInfo-attr">',
			//			'{1}',
			//			'<ul class="readtab-list">',
			//				'{0}',
			//			'</ul>',
			//		'</div>',
			//	'</div>',
			//	'<div class="tipsRight diamond"></div>',
			'</div>'].join(''),
			
			moreLink:[ 
			'<p class="ta_c f_st pt_10 pb_10" id="moremail">',
				'<a href="javascript:;">查看更多&gt;&gt;</a>',
			'</p>'].join(''),
			
			fail:'<p class="ta_c pt_10 pb_10">内容加载失败，请稍候<a href="javascript:;" id="reload" style="text-decoration:underline;">重试</a></p>',
		
            contactsInfo:[ '<span class="norTipsIco"><a href="javascript:;" bh="rmcontact_seeinfo" ><img src="{img}" width="52" height="52" /></a></span>', //<img src="images/ad/face.jpg" width="52" height="52" alt="">
                 '<div class="norTipsContent">',
                     '<div class="norTipsTitle widthdiv"><a href="javascript:;" bh="rmcontact_seeinfo" title="{name}" >{name}</a></div>',
                     '<div class="norTipsLine gray widthdiv" title="{email}">{email}</div>',
                     '<div class="norTipsLine gray widthdiv" title="{mobile}">{mobile}</div>',
                 '</div>'].join(''),
           
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
                           '<div style="font-family: 宋体; font-size: 14px; color: rgb(0, 0, 0);">&nbsp;</div>'].join(""),
			hoverTips : ['<div class="menuPop shadow lw-pop" style="top:1px;">',
						  '<table>',
							'<tr>',
							  '<td class="td1">主题：</td>',
							  '<td>',
								'{title}',
							  '</td>',
							'</tr>',
							'<tr>',
							  '<td class="td1">收件人：</td>',
							  '<td>',
								'{rece}',
							  '</td>',
							'</tr>',
							'<tr>',
							  '<td class="td1">时间：</td>',
							  '<td>2013-10-16 15:45:56</td>',
							'</tr>',
						  '</table>',
						'</div>'].join("")
        },

        initialize: function (options) {
            var self = this;
            this.keyword = options.keyword;
            this.email = $Email.getEmail(this.keyword);
            this.contactsInfo = options.contactsInfo;
            this.mid = options.mid;
            this.model = new M2012.ReadMail.SessionContactsMailNew.Model();
			this.model.set('email',this.email);
            this.mailmodel = $App.getView("mailbox").model;
			this.originHeight = 0;
			this.timer = null;
			this.layOut = $App.getLayout();
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
                    var rsp = response.responseData;

                    if (rsp['var']) {  //微博接口报文修改了，做个容错
                        rsp = rsp['var'];
                        if (rsp['resultCode'] == '1') {
                            self.showWeibo(rsp);
                        } else if (rsp['resultCode'] == '2') {
                            self.inviteWeibo(addres);
                        }                            
                    } else {
                        if (rsp && rsp.code == "S_OK" && rsp.screenName != '') {
                            self.showWeibo(rsp);
                        } else {
                            self.inviteWeibo(addres);
                        };
                    }
                    self.reSize(); 
                    
                })
            }
        },

        //显示微博消息

        showWeibo: function (rsp) {
            var self = this;
            var firstMessage = rsp.text ? rsp.text : '我在移动微博，你在哪儿？';
            var link = rsp.screenName;
            var showMessage = self.template.mbMessageShow;
            showMessage = $T.Utils.format(showMessage, { message: firstMessage, link: link });

            $(self.el).find('div.contactsMail-info').append(showMessage).find('#microBlogNews').click(function () {
                BH('microblog_message');
                var img = new Image();
                img.src = top.SiteConfig.ssoInterface + "/GetUserByKeyEncrypt?url=" + encodeURIComponent("http://auth.weibo.10086.cn/sso/139mailframe.php?sid=") + "&comeFrom=weibo&sid=" + top.sid  //单点登录请求
                img.onerror = function () {
                    var linkUrl = 'http://tmail.weibo.10086.cn/';
                    linkUrl += link;
                    top.$App.showUrl(linkUrl, '移动微博');
                }
                return false;
            });

        },
        
        //显示邀请按钮
        inviteWeibo: function (addres) {
            var self = this;
            var invite = self.template.mbInvitelogShow;
            $(self.el).find('div.contactsMail-info').append(invite).find('#invite_register').click(function () {
                BH('microblog_invite');
                var name = addres || '';  //收件人的名字
                name = name.split('@')[0];
                var time = top.M139.Date.getServerTime() || new Date();
                time = time.format('yyyy年MM月dd日');
                var sendName = $User.getSendName();
                var letterContent = self.template.mbLetterContent;
                letterContent = $T.Utils.format(letterContent, { name: name, time: time, me: sendName });
                var sendTitle = '您的好友' + sendName + '邀请您开通移动微博';
                $App.show("compose", null, { inputData: { receiver: addres, subject: sendTitle, content: letterContent, letterPaperId: '0090' } });
                return false;
            });
        },
        
        /**
        * 往来邮件列表
        */
        getMailList: function (data) {
            var self = this,
				mailItem = '',
				subject = '',
				subjectHtml = '',
				html = [],
				email = self.email,
				hrefTemp = '<li><a href="javascript:;" mid="{mid}" bh="rmcontact_readmail"><span class="text">{subject}</span></a></li>';
			
            if (data) {
				for (var i = 0, len = data.length; i < len; i++) {
                    if( i >= 20 ){ break }
					mailItem = self.getItemTemplate(data[i], email);
                    data[i].subject == '' ? subject = '(无)' : subject = data[i].subject;
                    subject = subject.replace(/(&<{)|(}>&)/g,''); //过滤搜索字符
                    subjectHtml = $T.Utils.format(hrefTemp, {
                            mid: data[i].mid,
                            subject: $T.Utils.htmlEncode(subject)
                        });
					html.push($T.Utils.format(mailItem,[subjectHtml,'']));
                }
            }
            return html.join('');
        },

        /**
        * 往来附件列表
        */
        getAttachList: function (data) {
            var self = this,
				hrefTemp = '<li><a href="{0}" tit="{1}" bh="rmcontact_downattach"><i class="i_atta"></i><span class="text">{1}</span></a></li>',
				email = self.email,
				attachName = '',
				newData = {},
				html = [];
            if (data) {
			
				//先组装数组
				$.each(data,function(n,val){
					if(!newData[val.mid]){
						newData[val.mid] = [val];
					}else{
						newData[val.mid].push(val);
					}
				});
				var ii = 0;
			//	self.model.set("newData", newData);//把整理后包装的数据存起来
				$.each(newData,function(n,d){ //data为数组		
					var href = [],
						attachItem = '';
					$.each(d,function(i,val){					
						ii++;
						if( ii >= 21 ){ return false; }		
						val.attachName == '' ? attachName = '(无)' : attachName = val.attachName;
						href.push($T.Utils.format(hrefTemp, [self.getDownLoadUrl(val), $T.Utils.htmlEncode(attachName)]));
					});					
					attachItem = self.getItemTemplate(d[0], email);
					//    html.push($T.Utils.format(attachItem,[href.join(''), '<i class="imgLink i_atta" title="' + $T.Utils.htmlEncode(d[0].from) + '"></i>']));
					html.push($T.Utils.format(attachItem,[href.join(''), n]));
				});
				
            }
            return html.join('');
        },
		
		/** 获取会话模版 */
		getItemTemplate:function(data,email){
			var self = this, 
			inMailItem = self.template.inMailItem,
			outMailItem = self.template.outMailItem;
			var isIn = data.from.indexOf(email)>-1;
            if (data.fid == 3) {isIn = false};
			return isIn ? inMailItem : outMailItem;
		},
		//获取时间：是发送时间还是收到时间 返回字段
		getSendOrReceiveTime : function(data,email){
			var is = data.from.indexOf(email)>-1;
			return is ? 'receiveDate' :'sendDate'; 
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
        mailListRender: function () {
            var self = this,
				moreLinkHtml = this.template.moreLink,
				noDataTips = '<p class="notext">暂无往来邮件</p>',
				thisContainer = $(self.el).find('#mailItem');
            this.model.searchContactsMail(function (result) {
				if (result && result.code === 'S_OK' && result['var']) {
					//去重复。如果from中的地址to中也有，说明是自己发给自己的去掉
					var tmpVar = result['var'];
					var reaLVar = [];
					reaLVar = tmpVar;
					/*新接口后不需要此逻辑
					var defArr = $User.getAccountList();
					var del = true;
					for(var j = 0; j < defArr.length; j++){
						if(defArr[j]["name"] == self.email){
							del = false;
							break;
						}
					}
					if(del){
						for(var i = 0; i < tmpVar.length; i++){
							var from = $Email.getEmail(tmpVar[i]["from"]);	
							if(tmpVar[i]["to"].indexOf(from) == -1){
								reaLVar.push(tmpVar[i]);
							}
						}
					}else{
						reaLVar = tmpVar;
					}*/
					mailListHtml = self.getMailList(reaLVar);
					self.model.set({mailListData:reaLVar});
					
					if(reaLVar.length == 0){
						mailListHtml = noDataTips;
					}
					
					if($App.getLayout() == 'list' &&  reaLVar.length > 20 ){
						 mailListHtml += moreLinkHtml;       
					}
					thisContainer.html(mailListHtml);
					$App.trigger("mailboxDataChange");		
					self.readMailEvent();				
				} else { //重新加载
					thisContainer.html(self.template.fail)
						.find('#reload').click(function(){
							$(this).parent().html('<img src="../images/global/load.gif"> 正在加载中...');
							setTimeout(function(){ self.mailListRender()},1000);
						});
					self.reSize();
					self.logger.error("readmail contactsmail mailList returndata error", "[mbox:searchMessages]", result);
				}
            });
        },

        /** 往来附件列表 */
        attachListRender: function (keyword) {
            var self = this;
			var	attachListHtml = '';
			var	container = $(self.el).find('#attachItem');

            this.model.getAttachData(function (result) {
				var noDataTips = '<p class="notext">暂无往来附件</p>';
                if (result && result.code === 'S_OK' && result['var']) {
					//去重复。如果from中的地址to中也有，说明是自己发给自己的去掉
					var tmpVar = result['var']['var']; //新接口改报文
					var reaLVar = [];
					reaLVar = tmpVar;
					/*新接口后不需要此逻辑
					var defArr = $User.getAccountList();
					var del = true;
					for(var j = 0; j < defArr.length; j++){
						if(defArr[j]["name"] == self.email){
							del = false;
							break;
						}
					}
					var from = self.model.getDefaultsAccount();
					if(del){
						for(var i = 0; i < tmpVar.length; i++){
							if(tmpVar[i]["from"].indexOf(from) == -1){
								reaLVar.push(tmpVar[i]);
							}
						}
					}else{
						reaLVar = tmpVar;
					}*/
					self.model.set({attachListData : reaLVar});
                    if(reaLVar.length > 0){
                        attachListHtml = self.getAttachList(reaLVar);
                        container.html(attachListHtml);
						//删除某些
						var divs = $(".readtab-text .wl-mail-r,.readtab-text .wl-mail").filter(":visible");
						$.each(divs, function(index,value){
							if($(this).find("ul").find("li").length == 0){
								$(this).remove();
							}
						});
						setTimeout(function(){
							self.attachsEvent(reaLVar);
						},200);
					}else{
                        container.html(noDataTips);
                    }
                } else { //重新加载
					container.html(self.template.fail)
						.find('#reload').click(function(){
							$(this).parent().html('<img src="../images/global/load.gif"> 正在加载中...');
							setTimeout(function(){ self.attachListRender(); },1000);
						});
					self.reSize();
                    self.logger.error("readmail contactsmail attach returndata error", "[attach:listAttachments]", result);
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

        /**定义事件*/
        initEvents: function (show) {
            var self = this;
            if(show){ 
                self.showInfo();
            }
            self.showMicroblog();
			
			//往来邮件，往来附件切换
			var sessionTabCon = self.sessionTabCon = $(self.el).find(".readtab");
			sessionTabCon.find('.readtab-ul li').click(function(){
				if( $(this).hasClass("on") ){
					return;
				}else{
					$(this).addClass("on").siblings().removeClass("on");
					sessionTabCon.find('.readtab-text').addClass('hide');
					sessionTabCon.find('.readtab-text:eq(' + $(this).index() + ')').removeClass('hide');
					
					//加载往来附件
					if($(this).hasClass("li2") && !$(this).attr('data-load')){
						self.attachListRender(self.email);
						$(this).attr('data-load',1);
					}
					
					self.reSize(); 
				}				
			});
			
			//窗口缩放自适应
			$(window).resize(function(){
				if(self.mid !== $App.getCurrMailMid()){return;}
				clearTimeout(self.timer);
				self.timer = setTimeout(function(){
					self.reSize();
				},300);
			});
			
			//写信点击
            $(self.el).find('#writeMailTo,#quickcompose').click(function(){
                $App.show("compose",null,{inputData:{receiver:self.keyword}});
            });
            
            //联系人信息事件
            self.contactInfoEvent();
			
        },
        
        /** 显示往来邮件信息 */
        showInfo:function(){
            var self = this,
				containerCon = self.template.containerCon,       
				content = $T.Utils.format(containerCon, {
					contactsInfo: self.getContactsInfo(self.keyword)
				});
            var htmlContainer = $(self.el).find('#contactsMail');
            if(!htmlContainer.attr('rel') && self.keyword){
                htmlContainer.prepend(content).attr('rel',1);
                self.mailListRender();
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
		
		//鼠标hover效果
		itemHoverEvent:function(selector){
			this.sessionTabCon.find(selector).hover(function(){
				$(this).addClass('tips-attr-on');
			},function(){
				$(this).removeClass('tips-attr-on');
			});
		},

		//高度自适应,往来邮件和往来附件切换时判断
		//要考虑分栏读信
		reSize:function(){
			var self = this,
				layOutIsList = (self.layOut === 'list') ? true : false,
				toolbarHeight = layOutIsList ? 41 : 0,
				contactsCon = $(self.el).find('#contactsMail'),
				readTabHeight = contactsCon.find('.readtab').height() + 30,
				infoHeight = contactsCon.find('.contactsMail-info').height(),
				btnHeight = contactsCon.find('.contactsMail-btn').height(),
				thisElHeight = $(self.el).height(),
				totalHeight = toolbarHeight + readTabHeight + infoHeight + btnHeight,
				fixHeight = layOutIsList ? 18 : 10,
				newHeight = 0;
			
			if( $B.is.ie ) { fixHeight = 0 }
			
			if(self.layOut === 'top'){ thisElHeight = thisElHeight - 8 } //上下分栏
			
			
			if( thisElHeight > totalHeight ){
				newHeight = thisElHeight - toolbarHeight - fixHeight;
			}else{
				newHeight = totalHeight - toolbarHeight;
			}
			
			//console.log('toolbarHeight:' + toolbarHeight + 'newHeight:' + newHeight + 'thisElHeight:' + thisElHeight);
			
			contactsCon.height(newHeight);
			
			/*setTimeout(function(){
				self.arguments.callee();
			},1000)*/
		},
		
		
        //往来邮件读信
        readMailEvent:function(){
            var self = this;
			
            var maildata = self.model.get("mailListData");
			//从mid取数据
			function getDataFromMid(mid){
				for(var i =0, l = maildata.length; i< l; i++){
					if(maildata[i]["mid"] == mid){
						return maildata[i];
					}
				}
			}
			
		//	var divs = $("#mailItem > div");
			var divs = $(".readtab-text.readtab-text-mail:visible").children("div");//修复ie7不显示更多后的第二次往来邮件
			var currentMid = self.mid;
			$.each(divs,function(index, value){
				var _this = $(this);
				//为当前的邮件添加边框
				var mid = _this.find("a").attr("mid");
				if(currentMid == mid){
					var thisClass = _this.attr("class");
					if(thisClass == "wl-mail"){
						_this.addClass("wl-mail-on").removeClass("wl-mail");
					}else if(thisClass == "wl-mail-r"){
						_this.addClass("wl-mail-ron").removeClass("wl-mail-r");
					}
				}
				//	为每一项添加鼠标效果
				new hoverTips({
					dock : _this,
					mid : mid,
					midData : getDataFromMid(mid)
				});
			});
			/*
				function readMailHover(e){
					var tar = e.target;
					if(tar.nodeName.toLowerCase() == "span"){
						var _this = this;
						var mid= $(tar).parent("a").attr("mid");
						new hoverTips({
							li : $(_this),
							mid : mid
						});
						
						currentMid = mid;
						if(mid in mids){ //缓存
							mids[mid].show();
						}else{
							$.each(maildata, function(index,value){
								if(value["mid"] == mid){
									var offset = $(_this).offset();
									$(self.template.hoverTips).appendTo(document.body).css({"left" : offset.left + "px", "top" : offset.top + "px"});
									mids[mid] = $(self.template.hoverTips);
								}
							});
						}
					}
				}
				function readMailHoverLeave(){
					mids[currentMid].hide();
				}
				*/
			//读信事件
			var mailItemCon = self.sessionTabCon.find('#mailItem');
			
			mailItemCon.find('li a').bind('click',function(){
				var mid = $(this).attr('mid'),
					mailData = self.getMailDataByMid(mid),
					displayModel = $App.getView("mailbox").model.get("layout");
				if($App.getCurrMailMid() == mid){
					$App.readMail(mid);
					return;
				}
				//要区分草稿箱
				if(mailData && mailData.fid == 2){
					$App.restoreDraft(mid);
				}else{
				//列表上下和左右模式的时候，不单独处理
					if(displayModel == "list"){
						$App.close();//关闭当前的窗口（读信页）
						$App.readMail(mid,false,null,{mailData:mailData});
					}else{
				//		$App.getView("maillist").readMailSplitView(mid);//上下模式，当前页面打开
						$App.readMail(mid,false,null,{mailData:mailData});
					}
					
				}
			});
			
            //更多往来邮件
            $(self.el).find('#moremail').click(function(){
                var options = self.model.get("searchContactsMailOptions");
				//点了搜索更多之后，再点未读邮件，再点搜索更多，会显示上一次的未读，清空此影响
				if(options && options.flags){
					delete options.flags["read"];
				}
				top.$App.getView("mailbox").model.set("IamFromLaiwang",true);//设置是来往邮件的搜索
				top.$App.getView("mailbox").model.set("UnReadIamFromLaiwang",false);//点击未读后，再重新点更多，会用影响，清楚此影响
                $App.trigger("mailCommand", { command: "showTraffic", email: options, thisEmail: self.email});//把这个人的邮件地址传下去
            });
			
			//自适应
			setTimeout(function(){
				self.reSize();
			},200)
			
        },
		
		//往来附件事件
		attachsEvent:function(data){
			var self = this;
			this.originHeight = $(self.el).find('#contactsMail').height();

			//从mid取数据
			function getDataFromMid(mid, _this){
				var tmp2Data = {};
			//	for(var i =0, l = attachData.length; i< l; i++){
				$.each(data, function(index, value){
					if(value["mid"] == mid){

							tmp2Data["subject"] = value["subject"];
							tmp2Data["sendDate"] = value["sendDate"];
							tmp2Data["attachName"] = _this.attr("tit");
					}
				});
				return tmp2Data;
			//	}
			}
			
		//	var aes = $("#attachItem a");
			var aes = $(".readtab-text:visible").find("a"); //ie7
			$.each(aes,function(index, value){
				var _this = $(value);
				var mid = _this.closest("div").attr("mid");
				//为当前的附件添加边框
				if(self.mid == mid){
					var div8 = _this.closest("div").parent("div");
					var thisClass = div8.attr("class");
					if(thisClass == "wl-mail"){
						div8.addClass("wl-mail-on").removeClass("wl-mail");
					}else if(thisClass == "wl-mail-r"){
						div8.addClass("wl-mail-ron").removeClass("wl-mail-r");
					}
				}
				new hoverTips({
					dock : _this,
					mid : mid + Math.random().toString().slice(3,9),  //mid会一样，为了单例模式
					isAttach : true,//附件
					midData : getDataFromMid(mid, _this)
				});
			});
			
			this.itemHoverEvent('#attachItem .tips');
			this.reSize();
		},
        
        render: function (show) {
            var self = this;
            var container = self.template.container;
            $(self.el).find(".J-readMailArea").append(container);
            self.initEvents(show);
		//	self.model.searchContactsMail(function(r){
		//		console.log(1111);
		//		console.log(r);
		//		console.log(2222);
		//	});
        }

    }));
    

})(jQuery, _, M139);


