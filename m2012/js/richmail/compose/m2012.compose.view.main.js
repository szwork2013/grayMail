﻿/**
* @fileOverview 写信视图层.
*@namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Compose.View.Main', superClass.extend(
        /**
        *@lends M2012.Compose.View.prototype
        */
    {
        el: "body",
        name : "compose",
        events: {
            "click #topSend": "toSendMail",//顶部发送
            "click #topSave": "toSaveMail",//顶部存草稿
            "click #bottomSend": "toSendMail",//底部发送
            "click #bottomSave": "toSaveMail",//底部存草稿
            "click #topCancelSend": "cancelSend",//顶部取消发信
            "click #cancelSend": "cancelSend",//底部取消发信
            "click #newWinComposeLink": "preOpenNewWinCompose",//新窗口写信
            "click #composePreviewLink": "composePreview",
            "click #thLetterPaperFrame" : "showPaperFrame",//信纸
            "click #aMMSSend" : "MMSSend",//彩信发送正文
            "click #aSMSSend" : "SMSSend" //短信发送正文
        },
        letterTemplate : '<iframe frameborder="0" scrolling="no" style="width:191px;border:0;height:{height}px;" src="letterpaper/letterpaper.htm" id="frmLetterPaper" name="frmLetterPaper"></iframe>',
        initialize: function (options) {
            this.model = options.model;
            this.initEvents();
            this.loadData();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initEvents : function(){
            var self = this;
            self.registerMouseEvent();
            self.registerKeyboardEvent();
            self.registerCloseTabEvent();

            if (top.$App.isNewWinCompose()) {
                $('#newWinComposeLink', document).hide();
            }
            top.$App.on("closeNewWinCompose", function () {
                $('#newWinComposeLink', document).show();
            });
        },
        // 注册隐鼠标事件
        registerMouseEvent : function(){
            $("#switchSider").toggle(function(event){
                top.BH('compose_addressbook_toggle');
                $(this).attr('title', '显示右边栏');
                // 隐藏右侧的样式
                $("#writeWrap").addClass("writeMainOff");
            },function(event){
                top.BH('compose_addressbook_toggle');
                $(this).attr('title', '隐藏右边栏');
                $("#writeWrap").removeClass("writeMainOff");
            });
        },
        // 注册键盘事件:快捷发送 等
        registerKeyboardEvent : function(){
            var self = this;
            // Ctrl+Enter 快捷发送
            if($B.is.ie && $B.getVersion() == 6){
                $(window.document).bind('keydown', function(event){
                    bindKeyEvent(event);
                }).bind('keypress', function(event){
                    bindKeyEvent(event);
                });
            }else{
                $(window.document).bind('keydown', function(event){
                    bindKeyEvent(event);
                });
            }
            function bindKeyEvent(event){
                if(event.ctrlKey && event.keyCode == M139.Event.KEYCODE.ENTER){
                    var tipContent = $(".norTipsContent").html();
                    if(tipContent === self.model.tipWords['LACK_ATTACHMENTS']){
                        self.sendMail();
                    }else{
                        $("#topSend").click();
                    }
                }else if (event.ctrlKey && event.keyCode == M139.Event.KEYCODE.V) {
                    try {
                        window.captureClipboard();
                    } catch (e) { }
                }
            }
        },
        // 注册关闭写信标签页事件
        registerCloseTabEvent : function(){
            var self = this;
            top.$App.on("closeTab", self.closeTabCallback);
        },
        // 关闭写信标签页回调
        closeTabCallback : function(args){
            var self = this;
            if(!top || !top.$App){
                return;
            }
            if (top.$App.getCurrentTab().name.indexOf('compose') != -1) {
                mainView.model.active(); // 激活用户想关闭的页签
            }
        	
            //var tabName = top.$App.getCurrentTab().name;
            if(args.name && args.name === mainView.model.tabName){
                var isEdited = mainView.model.compare();
                if(isEdited){
                    if(window.confirm(mainView.model.tipWords['CANCEL_SEND'])){
                        top.M139.UI.TipMessage.hide();
						
                        clearInterval(mainView.model.autoSaveTimer['timer']);
                        args.cancel = false;
			            
                        top.$App.off("closeTab", mainView.closeTabCallback);
                    }else{
                        args.cancel = true;
                    }
                }else{
                    top.M139.UI.TipMessage.hide();
					
                    clearInterval(mainView.model.autoSaveTimer['timer']);
                    args.cancel = false;
					
                    top.$App.off("closeTab", mainView.closeTabCallback);
                }
            }
        },
        // 加载传入的数据
        loadData : function(){
            top.M139.UI.TipMessage.show(this.model.tipWords['LOADING']);

            var self = this;
            var model = self.model;
            var TYPE = model.pageTypes;

            //写信 | 上传大附件
            model.regRouter({
                matchs: [ TYPE.COMPOSE, TYPE.UPLOAD_LARGE_ATTACH ],
                onroute: function() {
                    self.initPageInfo();
                }
            });

            //回复 | 全部回复
            model.regRouter({
                matchs: [ TYPE.REPLY, TYPE.REPLYALL ],
                onroute: function(args, model) {
                    var title = (args.pageType === TYPE.REPLY)?'回复':'全部回复';
                    top.$App.setTitle(title);
                    model.replyMessage(args.pageType, self.composeCallback);
                }
            });

            //转发 | 以附件转发 | 多封转发
            model.regRouter({
                matchs: [ TYPE.FORWARD, TYPE.FORWARDASATTACH ],
                onroute: function(args, model) {
                    top.$App.setTitle('转发');
                    model.forwardMessage(args.pageType, self.composeCallback);
                }
            });

            // 纯附件转发
            model.regRouter({
                matchs: [TYPE.FORWARDATTACHS],
                onroute: function (args, model) {
                    top.$App.setTitle('附件转发');
                    model.forwardAttachs(args.pageType, self.composeCallback);
                }
            });

            //恢复草稿
            model.regRouter({
                matchs: [ TYPE.DRAFT ],
                onroute: function(args, model) {
                    model.restoreDraft(self.composeCallback)
                }
            });

            //再次发送
            model.regRouter({
                matchs: [ TYPE.RESEND ],
                onroute: function(args, model) {
                    model.editMessage(self.composeCallback);
                }
            });

            //邮件发送自定义内容
            model.regRouter({
                matchs: [ TYPE.VCARD, TYPE.CUSTOM ],
                onroute: function(args, model) {
                    //if ('vCard' == args.pageType) {
                        
                    //}

                    self.loadCustom(args, model);
                }
            });

            model.trigger('route');
        },

        //邮件发送自定义内容
        loadCustom: function(args, model) {
            var self = this;
            var id = $composeApp.inputData.templateid;
            var _args = $composeApp.inputData.args;

            $composeApp.on("mailcontentload", function(param) {
                htmlEditorView.setEditorContent(param.content);
            });

            $composeApp.on("mailsignload", function(param) {
                htmlEditorView.editorView.editor.on("ready", function(e) {
                    if (param.sign) {
                        htmlEditorView.editorView.editor.setSign(param.sign);
                    }

                    if (param.onsign) {
                        param.onsign(htmlEditorView, self);
                    }
                });
            });

            $composeApp.on("mailsubjectload", function(param) {
                $("#txtSubject").val(param.subject);
            });

            $composeApp.on("mailreceiverload", function(param) {
                addrInputView.toRichInput.insertItem(param.to);

                if (param.cc) {
                    addrInputView.ccRichInput.insertItem(param.cc);
                }

                if (param.bcc) {
                    addrInputView.bccRichInput.insertItem(param.bcc);
                }
            });

            if (id) {
                M139.requireJS(['packs/promotion/'+encodeURIComponent(id)+'.pack'], function() {
                    self.initPageInfo();
                    $composeApp.trigger('extmailload', {
                        templateid: id,
                        param: _args
                    });
                });
            }
        },

        // 用回复/转发邮件的回调
        composeCallback : function(res){
			
			//会话邮件里回复、全部回复、转发切换到完成模式时的数据处理
			var sessionData,
				mid = res["responseData"]["var"]["omid"];
				
			if( top.M139.PageApplication.getTopApp().sessionPostData){
				sessionData = top.M139.PageApplication.getTopApp().sessionPostData;		   
			}
					
			function useSessionPostData(res, mid){
				var attrs = ['account', 'to', 'cc', 'bcc', 'subject'],
					_var = res.responseData['var'];
				
				if(sessionData && res && _var){
					_var = replaceData(sessionData, res.responseData['var'], attrs);							
				}	
				
				return _var;
				
				//替换数据
				function replaceData(postData, res, attrs){
					$.each(attrs,function(i,val){
						if(res && postData &&  typeof(res[val])!== 'undefined' && postData[val]){
							res[val] = postData[val];
						}	
					});
					return res;
				}
			}
			
			try{
				res["responseData"]["var"] = useSessionPostData(res, mid); 
               
			}catch(e){
				console.log(e);
			}
						
			function getSendText(name, email) {
            if (typeof name != "string" || typeof email != "string") return "";
				return "\"" + name.replace(/"|\\/g, "") + "\"<" + email.replace(/[\s;,；，<>"]/g, "") + ">";
			}
			var trueName = top.$User.getTrueName();
			// console.log(res);
			//其他文件夹数据移动到代收文件夹后，转发或者回复的时候，如果内容中找不到当前设置的默认邮箱，还原系统邮箱
			var content = res["responseData"]["var"]["content"];
			var reg = /收件人:(.*)/igm;
			var arrMactches = null;
			if (content) { arrMactches = content.match(reg); }
			var default1 = $(".sendPsel").text();
			if(arrMactches && arrMactches[0].indexOf($Email.getEmail(default1)) == -1){
				M139.NoNeedToGetDefaultSender = 1;
				var tmpName = trueName == "" ? top.$User.getDefaultSender() : getSendText(trueName, top.$User.getDefaultSender());
				senderView.chooseSender(tmpName);
			}
			//如果代收文件移动到收件夹，强制内容中查找，若找到用此账户。
			var poplist = _.pluck(top.$App.getPopList(), "email");
			
			function findPop(){
				for(var ii=0; ii < poplist.length;ii++){
					if(arrMactches && arrMactches[0].indexOf(poplist[ii]) > -1){
						return poplist[ii];
					}
				}
				return "";
			}
			var foundPop = findPop();
			if(foundPop != ""){
				M139.NoNeedToGetDefaultSender = 2;
				M139.NoNeedToGetDefaultSender2 = foundPop;
				senderView.chooseSender(getSendText(trueName, foundPop));	
			}
        	var self = mainView;
        	self.model.set('initDataSet', res.responseData['var']?res.responseData['var']:{});
        	self.model.set('isComposePageOnload', true);
        	var pageType = self.model.get('pageType');
        	if(pageType === self.model.pageTypes['REPLY'] || pageType === self.model.pageTypes['REPLYALL']){
        		if($composeApp.query.userAccount){
	        		self.model.get('initDataSet').account = $composeApp.query.userAccount;
	        	}
        		if(res.responseData.code && res.responseData.code == 'S_OK'){
        			// 是否带原邮件回复
        			if(!top.$App.getReplyWithQuote()){
        				if(res.responseData['var']){
        					res.responseData['var']['content'] = '';
        				}else{
        					res.responseData['var'] = {};
        				}
        				self.model.set('initDataSet', res.responseData['var']);
        				if($composeApp.query.withAttach == "true"){
		        			self._solveInlineResources(res);
		        		}else{
		        			console.log('无内联图片！');
		        		}
        			}
	        	}else{
	        		console.log('读取原邮件信息出错！');
	        	}
	        	// 收件人姓名与通讯录保持一致
	        	if(top.Contacts.isReady){
	        		var dataSet = self.model.get('initDataSet');
					if(sessionData){
						dataSet.to = sessionData.account;
						dataSet.cc = sessionData.cc;
						dataSet.bcc = sessionData.bcc;
					}
	                dataSet.to = self.model.getEamils(dataSet.to);
	                dataSet.cc = self.model.getEamils(dataSet.cc);
	                dataSet.bcc = self.model.getEamils(dataSet.bcc);
	            }
        	}
        	self.initPageInfo();
        },
        initPageInfo : function(){
            var self = this;
            if (self.model.get('isEditorPageOnload') && self.model.get('isComposePageOnload')) {
                top.M139.UI.TipMessage.hide();
                var dataSet = self.model.get('initDataSet');
                if(!dataSet){
                    top.$Msg.alert(self.model.tipWords['LOADFAIL'],{
                        onclose:function(e){
                            //e.cancel = true;
                        }
                    });
                    return;
                }
                //事务id,相当于原来cm的mid
                if (dataSet.id) self.model.composeId = dataSet.id;
                //原邮件id,richmail新增
                if (dataSet.messageId) self.model.messageId = dataSet.messageId;
                var pageType = self.model.get('pageType');
                // 渲染写信页面
                self.render(pageType, dataSet);
                // 设置页面焦点
                self.initFocus(dataSet);
                // 生成自动存草稿定时器
                self.model.createAutoSaveTimer();             
	            self.showMoreAttach()
                BH({key : "compose_loadsuc"});
            }else{
                console.log('写信页编辑器还未加载完！');
            }
        },
        // 渲染写信页面
        render : function(pageType, dataSet){
            //this._solveIeBug();
            addrInputView.render(pageType, dataSet);
            subjectView.render(dataSet);
            uploadView.render(dataSet);
            htmlEditorView.render(pageType, dataSet);
            senderView.render(pageType, dataSet);
            littlesView.render(pageType, dataSet);
            timingView.render(pageType, dataSet);
        },
        // 解决IE67样式Bug DIV(.writeMain)的宽度保持与 DIV(#writeWrap)一致
        _solveIeBug : function(){
            if($B.is.ie && $B.getVersion() == 6){
                //var parentWidth = $("#writeWrap").css('width');
                //$("div.writeMain").css({width : parentWidth});
        		
                if($("html")[0].scrollHeight > $("html").height()){
                    $("html").css("overflowY","scroll");
                }
                //if($.browser.msie&&$.browser.version=="6.0"&&$("html")[0].scrollHeight>$("html").height()) $("html").css("overflowY","scroll"); 
            }
        },
        // 初始化页面焦点
        initFocus : function(dataSet){
            if (!dataSet.to) {
                addrInputView.toRichInput.focus();
                addrInputView.toRichInput.setTipText(addrInputView.model.tipWords['TO_DEFAULT_TEXT']);
            } else if (!dataSet.subject) {
                $("#txtSubject").focus();
            } else {
                // todo 该判断是否可移到组件内部？
                if(htmlEditorView.editorView.editor.isReady){
                    htmlEditorView.setFocus();
                }else{
                    htmlEditorView.editorView.editor.on("ready", function(e){
                        htmlEditorView.setFocus();
                    });
                }
            }
        },
        //带附件回复,处理内联图片的问题
        _solveInlineResources : function(res){
            var attachments = res.responseData['var']['attachments'];
            if (attachments) {
                var list = [];
                for (var i = 0,amLen = attachments.length; i < amLen; i++) {
                    var attachItem = attachments[i];
                    if (attachItem.inlined) {
                        list.push({
                            id: attachItem.id,
                            inlined: false
                        });
                    }
                }
                if (list.length > 0) {
                    //因为内联的图片正文不存在的话发送后会被后台过滤掉,所以要把附件变成"非内联"
                    this.model.mailInfo['id'] = res.responseData['var']['id'];
                    this.model.mailInfo['attachments'] = list;
                    this.model.sendOrSaveMail(this.model.actionTypes['CONTINUE'], null);
                }
            }
        },
	    //回复带附件处理超大附件网盘文件
        showMoreAttach:function(){
		    var oIframes,oAttachAndDisk,oTimer,self=this,i=0;
			$('iframe').each(function(){
    			if(this.src.indexOf('editor_blank')!=-1){
		        	 oIframes = this;		
    			}
			});
		    oTimer = setInterval(function(){
				if(self.model.get('contIsSuc')||i>20){
					clearInterval(oTimer);
				}else{
					try{
						i++
		    			if(oIframes){
							oAttachAndDisk = oIframes.contentWindow.document.getElementById('attachAndDisk');		
		    			}
					}catch(e){
						console.log(e)
					}
					if(oAttachAndDisk){
						self.model.set('contIsSuc',true)
						$('#showMoreLargeAttach').show().click(function(){
							scrollIntoView(oAttachAndDisk);
						})
					}
					
				}
			}, 500);
			function scrollIntoView(oAttachAndDisk){
	
					var oBody = oAttachAndDisk.offsetParent;
					var iTop = 0;
					while(oAttachAndDisk != oBody){
						iTop += oAttachAndDisk.offsetTop;
						oAttachAndDisk = oAttachAndDisk.parentNode;
					}
					oBody.scrollTop = iTop;
			}
			},
			/*function scrollIntoView(oAttachAndDisk){
				//if(oAttachAndDisk.scrollIntoView()){
					//oAttachAndDisk.scrollIntoView()
				//}else{
					debugger;
					var oBody = oAttachAndDisk.offsetParent;
					var wrapDivHeight = $(oIframes.contentWindow.document.getElementsByTagName('div')[0]).height()+$(oIframes.contentWindow.document.getElementsByTagName('div')[1]).height();
					var iTop = 0;
					var oBodyHeight = $(oIframes.contentWindow.document.body).height();
					var reply139contentHeight = $(oIframes.contentWindow.document.getElementById('reply139content')).height()+wrapDivHeight-oBodyHeight;
					var iScrollTop;
					while(oAttachAndDisk != oBody){
						iTop += oAttachAndDisk.offsetTop;
						oAttachAndDisk = oAttachAndDisk.parentNode;
					}
					iScrollTop = (oBodyHeight/reply139contentHeight)*iTop;
					oBody.scrollTop = iScrollTop;
				//}
			}
        },
*/        // 发送邮件
        toSendMail : function(event){
            if($("#topSend").attr('disabled')) return; //避免重复发送
            // 添加发件人类型行为统计
            if (top.$App.isNewWinCompose()) {
                BH({ key: "newwin_compose_send" });
            } else {
        	senderView.addBehavior();}
        	
        	// 验证收件人
        	if(!addrInputView.checkInputAddr(event)){
        		console.log('收件人验证未通过！');
        		return;
        	}
        	// 验证主题
        	if(!subjectView.checkSubject(event)){
        		console.log('主题验证未通过！');
        		return;
        	}
        	// 上传附件完毕后自动发送邮件 
			if (uploadManager.isUploading()) {
				this.model.autoSendMail = true;
				// todo提示用户
				//top.WaitPannel.show("附件上传完毕后邮件将自动发送!", 1000);
				top.M139.UI.TipMessage.show('附件上传完毕后邮件将自动发送!',{delay : 1000});
				console.log('附件上传完毕后邮件将自动发送!');
				return;
			}
        	// 验证正文
        	if(!htmlEditorView.checkContent(event)){
        		console.log('正文验证未通过！');
        		return;
        	}
        	// 如果是恢复草稿并且单击的不是‘定时发送’则验证是否为定时邮件
        	var pageType = this.model.get('pageType');
			if(pageType == this.model.pageTypes['DRAFT']){
				if(!timingView.isClickTimingBtn(event)){
					if(!timingView.checkTiming(event)){
		        		console.log('定时邮件验证未通过！');
		        		return;
		        	}
				}
			}else{
				if(!timingView.isClickTimingBtn(event)){
					timingView.isScheduleDate = false;
				}
			}
        	this.sendMail();
        },
        // 发送邮件
        sendMail : function(){
        	var self = this;
        	// 判断用户是否设置过真实姓名
        	if(!top.$User.getTrueName()  &&  typeof(top.$App.getUserCustomInfo(20)) == 'undefined' ){
        		new M2012.Compose.View.SetTruename({callback : send});
        	}else{
        		send();
        	}
        	function send(){
        		top.M139.UI.TipMessage.show(self.model.tipWords['SENDING']);
	        	$("#topSend,#bottomSend").attr("disabled", true);
				setTimeout(function () {
		            $("#topSend,#bottomSend").attr("disabled", null);
		        }, 3000);
		        htmlEditorView.editorView.editor.trigger("before_send_mail");
				mainView.model.sendOrSaveMail(mainView.model.actionTypes['DELIVER'], mainView.sendMailCallback);
        	}
        },
		// 保存邮件
		toSaveMail : function(e){
		    BH({ key: top.$App.isNewWinCompose() ? "newwin_compose_save" : "compose_save" });
			// 单击存草稿立即disabled按钮 ，3秒后恢复
			$("#topSave,#bottomSave").attr("disabled", true);
			setTimeout(function () {
	            $("#topSave,#bottomSave").attr("disabled", null);
	        }, 3000);
	        this.saveMailCallback.actionType = this.model.actionTypes['SAVE'];
			this.model.sendOrSaveMail(this.model.actionTypes['SAVE'], this.saveMailCallback);
		},
		// 存/自动存   草稿
		saveMailCallback : function(res){
		    if (res.responseData && res.responseData.code == 'S_OK') {
				// 刷新邮件列表
				if(top.$App){
					top.$App.trigger("mailboxDataChange");
				}
        		//mainView.model.mailInfo['mid'] = res.responseData['var']['tid'];
        		mainView.model.mailInfo['mid'] = res.responseData['var'];
        		if (res["var"] && typeof (res.responseData['var']) == 'string') {
                    mainView.model.draftId = res.responseData['var'];
                } else {
                    mainView.model.draftId = res.responseData['var'] && res.responseData['var']["mid"];
                }
	            var tipwords = mainView.model.getTipwords(mainView.model.actionTypes['SAVE']),
	            	now = new Date(),
	            	actionType = mainView.saveMailCallback.actionType;
	            if(actionType && actionType === mainView.model.actionTypes['AUTOSAVE']){
	            	tipwords = mainView.model.getTipwords(actionType);
	            }else{
	            	mainView.model.setSubMailInfo(htmlEditorView.getEditorContent(), $("#txtSubject").val());
	            }
	            console.log($T.Utils.format(tipwords, [now.getHours(), now.getMinutes()]));
	            top.M139.UI.TipMessage.show($T.Utils.format(tipwords, [now.getHours(), now.getMinutes()]),{delay : 1000});
            }else{
            	console.log('存草稿失败！');
            	var errorMsg = mainView.model.getErrorMessageByCode("saveMail", res.responseData.code) || res.responseData.summary;
                if(errorMsg){
                	top.M139.UI.TipMessage.show(errorMsg, {delay : 1000});
                }
            }
		},
		// 发送邮件成功
        sendMailCallback : function(result){
        	top.M139.UI.TipMessage.hide();
        	if(!result.responseData){
                top.$Msg.alert('发送失败！',{
                	isHtml:true,
			        onclose:function(e){
			            //e.cancel = true;
			        }
			    });
        		return;
        	}
        	if(result.responseData.code == 'S_OK'){
        		if(timingView.isScheduleDate){
        			BH({key : "compose_timingsendsuc"});
        		}
        		
        		clearInterval(mainView.model.autoSaveTimer['timer']);
        		mainView.model.PageState = mainView.model.PageStateTypes.Sended;
        		mainView.model.setSubMailInfo(htmlEditorView.getEditorContent(), $("#txtSubject").val());
                mainView.model.modifySendList(result);
                
                top.$App.off("closeTab", mainView.closeTabCallback);
                var url = top.SiteConfig.showNewWriteOk?"write_ok_new.html?sid=":"write_ok.html?sid="
                url += mainView.model.getSid();
                url = $composeApp.inputDataToUrl(url,{
                     sid : mainView.model.getSid(),
                     index : top.$App.getCurrentTab().data.sendList.length - 1
                });
                var res = result.responseData
                if (res['var'] && res['var'].tid) {
                    url += '&tid=' + res['var'].tid;
                }
                if(res && res.attachs && res.attachs.length>0){
                    url += '&attachs=' + '1';
                }
                if(mainView.model.get('hasLargeAttach')){
	                //url += '&hasLargeAttach=' + '1';
                }
                location.href = url;
            }else { //发送失败统一使用后台返回的提示语，如返回英文提示语，找后台修改
                var errorMsg = result.responseData.summary || mainView.model.getErrorMessageByCode("sendMail", result.responseData.code, mainView.model.mailInfo);
                if (!errorMsg) errorMsg = "发送失败:" + result.responseData.code;
                top.$Msg.alert(errorMsg,{
                    isHtml:true,
                    onclose:function(e){
                        //e.cancel = true;
                    }
                });
            }
        },

		/**
		 * 取消写信 
		 */
		cancelSend : function(e){			
		    if (top.$App.isNewWinCompose()) {
		        BH({ key: "newwin_compose_cancel" });
		        var isEdited = mainView.model.compare();
		        if (!isEdited || window.confirm(mainView.model.tipWords['CANCEL_SEND'])) {
		            top.window.close();
		        }
			} else {
			    BH({ key: "compose_cancel" });
			    top.$App.close();
			}
		},

		preOpenNewWinCompose: function () {
		    BH({ key: "newwin_compose" });
            // 先清除锚点，防止影响后续判断
		    var url = top.location.href;
		    url = url.slice(0, url.lastIndexOf('#'));
            // 如果已经写入内容，先存草稿，再在新窗口打开
		    if (!this.model.isBlankCompose()) {
		        $("#topSave,#bottomSave").attr("disabled", true);
		        setTimeout(function () {
		            $("#topSave,#bottomSave").attr("disabled", null);
		        }, 3000);
		        saveDraftCallback.actionType = this.model.actionTypes['SAVE'];
		        var newwindow = top.window.open("about:blank");
		        this.model.sendOrSaveMail(this.model.actionTypes['SAVE'], saveDraftCallback);		        
		    } else {
		        openNewWinCompose();
		    }

		    function openNewWinCompose(mid) {
		        var r = document.documentElement; //防止窗口被浏览器拦截
		        var f = document.createElement("form");
		        f.target = "_blank";
		        f.method = "get";
		        $(f).append('<input type="hidden" name="t" value="win_compose" />');
		        $(f).append('<input type="hidden" name="id" value="2" />');
		        $(f).append('<input type="hidden" name="sid" value="' + top.$App.getSid() + '" />');
		        $(f).append('<input type="hidden" name="draftId" value="' + mid + '" />');
		        r.insertBefore(f, r.childNodes[0]);
		        f.action = url;
		        f.submit();
		    }

		    // 保存草稿成功后，获取mid，打开新写信窗口
		    function saveDraftCallback(res) {
		        var mid;
		        if (res.responseData && res.responseData.code == 'S_OK') {
		            // 刷新邮件列表
		            if (top.$App) {
		                top.$App.trigger("mailboxDataChange");
		            }
		            url = url.replace(/[&](id|t|draftId)=\w+/g, "");
		            newwindow.location.href = url + "&id=2&t=win_compose&draftId=" + res.responseData["var"];
		        } else {
		            newwindow.close();

		            console.log('存草稿失败！');
		            var errorMsg = mainView.model.getErrorMessageByCode("saveMail", res.responseData.code) || res.responseData.summary;
		            if (errorMsg) {
		                top.M139.UI.TipMessage.show(errorMsg, { delay: 1000 });
		            }
		        }
		    };
		},

		composePreview: function() {
			htmlEditorView.editorView.editor.preview();
		},

		/**
         * 显示信纸选择框并加载指定信纸 
         */
		showPaperFrame: function (event) {
		    // 为了获取divLetterPaper的偏移量，需要先显示
		    $("#divAddressList").removeClass('show');
		    $("#divLetterPaper").addClass('show');

		    $("#thContactFrame").removeClass('on');
		    $("#thLetterPaperFrame").addClass('on');

            var composeIframe = window.frameElement;
            var height = $(composeIframe).height() - 119;

            if ($("#frmLetterPaper").size() == 0 || $("#frmLetterPaper").height() != height) {
                var htmlCode = $T.format(this.letterTemplate, { height: height });
        		$("#divLetterPaper").html(htmlCode);
        	}
			
			if ($B.is.ie && $B.getVersion() <= 7) {
                event.preventDefault();
            }
		},
        /**
		 * 彩信发送正文 
		 */
        MMSSend: function (e) {
            if (top.$App.isNewWinCompose()) {
                top.$App.closeNewWinCompose(true);
            }
            var self = this;
            var text = this.getTextContentWithoutSign();
            var title = $("#txtSubject").val();
            var list = self.model.addrInputManager.getAllEmails();
            //所有手机数组
            var arrAllMobile=[];
            //通过正则取邮件地址里生成的数组
            var arrMobileByRegExp=null;
            //单个手机
            var mobile="";
            $(list).each(function() {
                var text = this.toString();
                var addr = $Email.getEmail(text);
                if (/^\d{11}@139\.com$/.test(addr)) {
                    //取邮件地址里的数据
                    arrMobileByRegExp=addr.match(/(^\d{11})@139\.com$/);
                    //取到手机号就放到手机数组集合中
                    arrMobileByRegExp && arrMobileByRegExp[1] && (arrAllMobile.push(arrMobileByRegExp[1]));
                } else {
                    var c = top.Contacts.getSingleContactsByEmail(addr, true);
                    if (c){
                        mobile=c.getFirstMobile();
                        mobile && arrAllMobile.push(mobile);
                    }
                }
            });
            //设置回彩信数据
            top.Main.setReplyMMSData({
                content:text||"",
                receivers:arrAllMobile,
                subject:title||""
            });
            window.top.Links.show("mms","&mmstype=diy&initData=replyMMSData");
            waitToFill();
            arrAllMobile=arrMobileByRegExp=null;
            function waitToFill() {
                M139.Timing.waitForReady("top.document.getElementById('mms').contentWindow.document.body", function() {
                    var win = window.top.document.getElementById('mms').contentWindow;
                    if (win.willBeRefresh) {
                        setTimeout(waitToFill, 1000);
                        return;
                    } else {
                        try {
                            win.clearContentTip();
                        } catch (e) { }
                    }
                });
            }
        },
        /**
         * 短信发送正文 
         */
        SMSSend: function (e) {
            if (top.$App.isNewWinCompose()) {
                top.$App.closeNewWinCompose(true);
            }
            var self = this;
            var text = this.getTextContentWithoutSign();
            var indexKey = "composeMobileText" + Math.random();
            top[indexKey] = text;
            var list = self.model.addrInputManager.getAllEmails();
            var mobiles = "";
            $(list).each(function() {
                var text = this.toString();
                var addr = $Email.getEmail(text);
                if (/^\d{11}@139\.com$/.test(addr)) {
                    mobiles += "\"{0}\"<{1}>,".format($Email.getName(text).replace(/"/g, ""), $Email.getAccount(addr));
                } else {
                    var c = top.Contacts.getSingleContactsByEmail(addr, true);
                    if (c) mobiles += c.getMobileSendText();
                }
            });
            if (mobiles) {
                window.top.Links.show("sms", "&mobile=" + escape(mobiles) + "&composeText=" + indexKey);
            } else {
                window.top.Links.show("sms", "&composeText=" + indexKey);
            }
        },
		/**
		 * 组装邮件信息 
		 */
		buildMailInfo : function(action, callback){
			if (this.model.composeId) {
	            this.model.mailInfo['id'] = this.model.composeId;
	        }
	        if (this.model.messageId) {
	            this.model.mailInfo['messageId'] = this.model.messageId;
	        }
	        if(this.model.draftId){
	        	this.model.mailInfo['mid'] = this.model.draftId;
	        }
			var txtSubject = $("#txtSubject");
			this.model.mailInfo['account'] = M139.Text.Html.decode(senderView.getSender());
			this.model.mailInfo['to'] = addrInputView.toRichInput.getValidationItems().join(',');
			this.model.mailInfo['cc'] = addrInputView.ccRichInput.getValidationItems().join(',');
			this.model.mailInfo['bcc'] = addrInputView.bccRichInput.getValidationItems().join(',');
			
			this.model.mailInfo['showOneRcpt'] = $("#aAllToOne").attr('showOneRcpt')?$("#aAllToOne").attr('showOneRcpt'):0;
			this.model.mailInfo['subject'] = txtSubject.val();
            
            // 设置签名图片地址, 电子名片服务器不能访问,暂时替换,等后台更改了可删除
			var remoteAttachment=[];
			if (action == "deliver") { //仅发送时才需要远程下载签名图片
			    remoteAttachment = this.model.handlerSignImags();
			}

            var letterContent = htmlEditorView.getEditorContent();
            this.model.mailInfo['content'] = letterContent;

			this.model.mailInfo['priority'] = $("#chkUrgent")[0].checked ? 1 : 3;
			this.model.mailInfo['requestReadReceipt'] = $("#chkReceipt")[0].checked ? 1 : 0;
			this.model.mailInfo['saveSentCopy'] = $("#chkSaveToSentBox")[0].checked ? 1 : 0;
			this.model.mailInfo['inlineResources'] = 1;
			this.model.mailInfo['scheduleDate'] = timingView.getScheduleDate();
			this.model.mailInfo['normalizeRfc822'] = 0;

			if(remoteAttachment.length > 0){
				this.model.mailInfo['remoteAttachment'] = remoteAttachment;
			}else{
				delete this.model.mailInfo['remoteAttachment'];
			}
			this.model.fixBase64FileSize();//为了适应mbox:compose接口，在回复和转发时fileSize是base64后的值

			var attachments =[];
			for (var i = 0; i < this.model.composeAttachs.length; i++) {
			    if (this.model.composeAttachs[i].fileSize != undefined) {
			        attachments.push(this.model.composeAttachs[i]);
			    }
			}
			// 设置附件
			this.model.mailInfo['attachments'] = attachments;

			//设置主题色值
			var headerValue = txtSubject.attr('headerValue');
	        if(txtSubject.attr('headerValue')){
	            this.model.mailInfo['headers'] = {
	                "X-RM-FontColor": headerValue
	            }
	        }else{
	        	delete this.model.mailInfo['headers'];
	        }
			var newArr_DiskAttach = [];
					for(var i =0, l = Arr_DiskAttach.length; i < l; i++){
						if(Arr_DiskAttach[i].fileType !== "netDisk"){
							newArr_DiskAttach.push(Arr_DiskAttach[i]);
						}
			}
			if(newArr_DiskAttach.length == 0){
				this.model.mailInfo['content'] += getDiskLinkHtml();
			}
    		if (newArr_DiskAttach.length > 0 && action == this.model.actionTypes['DELIVER']) {
    			this.resolveLargeAttachs(action, callback);
		    }else{
		    	this.callComposeApi(action, callback);
		    }
		},
		// 将下载大附件的html代码添加到文件正文
		resolveLargeAttachs : function(action, callback){
			var self = this;
			// 调服务端接口获取大附件的下载地址
			self.model.mailFileSend(Arr_DiskAttach, function(result){
				if(result.responseData && result.responseData.code == 'S_OK'){
					var fileList = result.responseData['var']['fileList'];
    				var urlCount = 0;
					var newArr_DiskAttach = [];
					for(var i =0, l = Arr_DiskAttach.length; i < l; i++){
						if(Arr_DiskAttach[i].fileType !== "netDisk"){
							newArr_DiskAttach.push(Arr_DiskAttach[i]);
						}
					}
    				for(var j = 0,len = fileList.length;j < len;j++){
    					var mailFile = fileList[j];
    					for (var i = 0,diskLen = newArr_DiskAttach.length;i < diskLen; i++) {
                            var diskFile = newArr_DiskAttach[i];
                            if ((mailFile.fileId === diskFile.fileId || mailFile.fileName == diskFile.fileName || mailFile.fileName == diskFile.name1) && !diskFile.getIt) {
                                diskFile.getIt = true;
                                diskFile.downloadUrl = mailFile.url;
                                diskFile.exp = mailFile.exp;
                                urlCount++;
                                break;
                            }
                        }
    				}
	                if (urlCount == newArr_DiskAttach.length) {
	                	self.model.mailInfo['content'] += getDiskLinkHtml();
	                	self.model.set('hasLargeAttach',true)
	                	self.callComposeApi(action, callback);
	                } else {
	                    console.log('获取大附件下载地址有误！！');
	                }
				}else{
					console.log('获取大附件下载地址失败！！');
				}
			});
		},
		// 根据文件来源返回调整数据结构后的文件对象，为了满足largeAttach.js中的方法 setNetLink的需求
		getFileByComeFrom : function(fileObj){
			var comeFrom = fileObj.comeFrom;
			var newfile = {};
			if(comeFrom == 'localFile'){
				newfile.fileId = fileObj.businessId;
				newfile.fileName = fileObj.name;
				newfile.filePath = fileObj.name;
				newfile.fileSize = fileObj.size;
				newfile.fileType = 'keepFolder';
				newfile.state = 'success';
			}else if(comeFrom == 'disk'){
				newfile.fileGUID = fileObj.filerefid;
				
				newfile.fileId = fileObj.id;
				newfile.fileName = fileObj.name;
				newfile.filePath = fileObj.name;
				newfile.fileSize = fileObj.file.fileSize;
				newfile.fileType = 'netDisk';
				newfile.state = 'success';
			}else if(comeFrom == 'cabinet'){
				newfile.fileId = fileObj.fid;
				newfile.fileName = fileObj.fileName;
				newfile.filePath = fileObj.fileName;
				newfile.fileSize = fileObj.fileSize;
				newfile.fileType = 'keepFolder';
				newfile.state = 'success';
			}else{
				console.log('不支持的文件来源！comeFrom:'+comeFrom);
			}
			return newfile;
		},
		// 调服务端接口发信
		callComposeApi : function(action, callback){
			var self = this;
            var guid = window.guid;
			var data = self.model.getRequestDataForSend(action);
			if(action != 'save' && action != 'autosave'){ //防止邮箱发送时同时自动保存邮件，导致邮件丢失
				clearInterval(self.model.autoSaveTimer['timer']);
			}
			if (window.RawDeflate && window.Base64) {
			    var zipData = M139.Text.Xml.obj2xml(data);
			    var dataLength = zipData.length;
			    var before = new Date;
			    zipData = Base64.toBase64(RawDeflate.deflate(Base64.utob(zipData)));
			    if (zipData.length > dataLength) {
			        RawDeflate = null;
			        Base64 = null;
			        commonSend();
			    }else{
			        var usedTime = new Date - before;
			        console.log("RawDeflate.deflate user:" + usedTime); 
			        var dataZipLength = zipData.length;
			        self.model.callApi("/m2012server/composeCompress?comefrom=5&categroyId=103000000&sid=" + top.sid + "&usedTime="
                        + usedTime + ("&length=" + dataLength + "-" + dataZipLength) + '&guid=' + guid, zipData,
                        function (res) {
                            if (res.responseData && res.responseData.code == "S_OK") {
                                if (callback) {
                                    callback(res);
                                }
                            }else {
                                commonSend();
                                RawDeflate = null;
                                Base64 = null;
			                }
			        });
			    }
			} else {
			    commonSend();
			}
			function commonSend() {
			    var categroyId = $Url.queryString("categroyId");
			    if (categroyId) {
			        self.model.callApi("mbox:compose", data, function (res) {
			            if (callback) {
			                callback(res);
			            }
			        }, { urlParam: '&guid=' + guid + '&categroyId=' + categroyId });
			    } else {
			        self.model.callApi("mbox:compose&categroyId=103000000", data, function (res) {
			            if (callback) {
			                callback(res);
			            }
			        }, { urlParam: '&guid=' + guid });
			    }
			}
		},
        
		getTextContentWithoutSign : function () {
			var doc = htmlEditorView.editorView.editor.editorDocument.cloneNode(true);
			var signContainer = doc.getElementById("signContainer");
			var styles = doc.getElementsByTagName("style");
			if(signContainer){
				signContainer.parentNode.removeChild(signContainer);
			}

			// 使用信纸后，会在body中带入style样式标签（样式内容会视作纯文本）
			while(styles[0]){
				styles[0].parentNode.removeChild(styles[0]);
			}
			return (doc.body.textContent || doc.body.innerText).trim();
		}
    }));
})(jQuery, _, M139);
