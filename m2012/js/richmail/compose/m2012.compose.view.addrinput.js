/**
 * @fileOverview 定义写信页地址输入组件封装
 */
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Compose.View.AddrInput', superClass.extend(
        /**
        *@lends M2012.Compose.View.prototype
        */
    {
        el: "body",
        name : "addrinput",
        events: {
        	"click #receiverTo": "showAddressBookDialog",
            "click #receiverCc": "showAddressBookDialog",
            "click #receiverBcc": "showAddressBookDialog"//显示联系人浮层
        },
        initialize: function (options) {
        	this.model = options.model;
        	this.maxSenders = top.$User.getMaxSend();
        	this.createAddrInputs();
        	this.currentRichInput = null;
        	this.initEvents();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        // 创建邮件地址输入框
        createAddrInputs : function(){
        	var self = this;
        	self.toRichInput = M2012.UI.RichInput.create({
		        container:document.getElementById("toContainer"),
		        maxSend : self.maxSenders,
		        type:"email",
                tipPlace: "bottom"
        	}).render();
        	
		    self.toRichInput.on("itemchange",function(){
		        //console.log(self.toRichInput.getErrorText());
		    }).on("itemchange",function(){
		        //console.log(self.toRichInput.getValidationItems().length);
		    });
		    self.toRichInput.on("focus",function(){
	            self.currentRichInput = this;
	            //self.toRichInput.setTipText('');
	        });
	        // todo 地址输入框组件注册快捷发送事件
	        self.toRichInput.on("keydown",function(e){
	            if(e.ctrlKey && e.keyCode == M139.Event.KEYCODE.ENTER){
		        	$("#topSend").click();
		        }
	        });
		    
		    self.ccRichInput = M2012.UI.RichInput.create({
		        container:document.getElementById("ccContainer"),
		        maxSend : self.maxSenders,
		        type:"email",
		        tipPlace: "bottom",
		        zIndex: 4
		    }).render();
		    self.ccRichInput.on("itemchange",function(){
		        console.log(self.ccRichInput.getErrorText());
		    }).on("itemchange",function(){
		        console.log(self.ccRichInput.getValidationItems());
		    });
		    self.ccRichInput.on("focus",function(){
	            self.currentRichInput = this;
	        });
		    // todo 地址输入框组件注册快捷发送事件
	        self.ccRichInput.on("keydown",function(e){
	            if(e.ctrlKey && e.keyCode == M139.Event.KEYCODE.ENTER){
		        	$("#topSend").click();
		        }
	        });
		    
		    self.bccRichInput = M2012.UI.RichInput.create({
		        container:document.getElementById("bccContainer"),
		        maxSend : self.maxSenders,
		        type:"email",
		        tipPlace: "bottom"
		    }).render();
		    self.bccRichInput.on("itemchange",function(){
		        console.log(self.bccRichInput.getErrorText());
		    }).on("itemchange",function(){
		        console.log(self.bccRichInput.getValidationItems());
		    });
		    self.bccRichInput.on("focus",function(){
	            self.currentRichInput = this;
	        });
	        // todo 地址输入框组件注册快捷发送事件
	        self.bccRichInput.on("keydown",function(e){
	            if(e.ctrlKey && e.keyCode == M139.Event.KEYCODE.ENTER){
		        	$("#topSend").click();
		        }
	        });
        },
        // 渲染地址输入框
        render : function(pageType, dataSet){
        	// 为输入框添加tabindex属性
        	$("#toContainer input:text")[0].tabIndex = 1;
        	$("#ccContainer input:text")[0].tabIndex = 2;
        	$("#bccContainer input:text")[0].tabIndex = 3;
        	
        	// 回复全部需排除自己
        	if(pageType == this.model.pageTypes['REPLYALL']){
		        this.model.filterEmails();
		    }
		    // 初始化输入框
        	this._initEmailInputs(dataSet);
        },
        // todo 验证收件人
        checkInputAddr : function(){
        	var self = this,
        		isContinue = true;
        	if (!self.toRichInput.hasItem()) {
        		window.scrollTo(0,0);
        		// 弹出框提示
				self.toRichInput.showEmptyTips("请填写收件人");
				// 文本框闪烁
				var obj = $('#toContainer').find('div.ItemContainer').eq(0);
				// todo 闪烁样式暂定为f1
				//M2012.UI.RichInput.Tool.blinkBox(obj, 'f1');
				/*input获取焦点后弹出框消失
				$('#toContainer input').bind('focus',function(){
					if(FT.timeOut){
						FT.fadeOut(200);
						clearTimeout(FT.timeOut);
					}
					$('#emailToHolder input').unbind('focus');
				});*/
				self.toRichInput.focus();
	            isContinue = false;
	        }
	        var richInput = null;
	        if (self.toRichInput.getErrorText()) {
				richInput = self.toRichInput;	            
	        }else if(self.ccRichInput.getErrorText()){
	        	richInput = self.ccRichInput;	            
	        }else if(self.bccRichInput.getErrorText()){
	        	richInput = self.bccRichInput;	            
	        }
	        if(richInput){
	        	isContinue = false;
	        	richInput.showErrorTips("收件人输入错误");
	        }
	        var items = self.model.addrInputManager.getAllEmails();
	        if (items.length > self.maxSenders) {
	        	// 弹框提示用户已达到上限，升级套餐
	            //FF.alert(top.getMaxReceiverTips());
	            isContinue = false;
	        }
	        return isContinue;
        },
        initEvents: function () {
            var self = this;
        	this.addOrDelCcClick();
        	this.addOrDelBccClick();
        	this.addOrDelAllToOneClick();
        	$("#cancelAllToOne").bind('click', function(){
        		$("#aAllToOne").click();
        	});
        	VoiceInput.create({
                autoClose:true,
                button: $("#btn_voiceTo"),
                from:"to",
                //grammarList:["张三","李四","王五","开始"],
        	    onComplete: function (text) {
       	        
        	        var input = $("#toContainer").find(".addrText-input");
        	        input.val(input.val()+text);//.focus();

        	    }
        	});
			this.guideTips();
        	
        },
        //绑定添加/删除抄送 单击事件
        addOrDelCcClick : function(){
        	var self = this,
        		ccEle = $("#trCc");
        	$("#aShowCc").toggle(function(notUserClick){
        		BH({key : "compose_cc"});
        		
        		$(this).text('删除抄送');
		        ccEle.show();
		        $(this).attr('titleBak',$(this).attr('title'));
		        $(this).attr('title','');
		        self.ccRichInput.focus();
		        self.currentRichInput = self.ccRichInput;
		        // 记录用户打开抄送栏
		        //$T.Cookie.set({name : 'c_cc',value : '1'});
		        self._addTabIndex(self.model.richInputTypes['CC']);
			    //$("#txtSubject").hide().show();
			    
			    // 自适应  编辑器高度
			    self.model.adjustEditorHeight(-self.model.containerHeight['emailInputBox']);
        	},function(notUserClick){
        		$(this).text("添加抄送");
        		ccEle.hide();
		        self.ccRichInput.clear();
		        $(this).attr('title',$(this).attr('titleBak'));
		        self.currentRichInput = self.toRichInput;
		        // 记录用户删除抄送栏
		        //$T.Cookie.set({name : 'c_cc',value : '0'});
		        self._removeTabIndex(self.model.richInputTypes['CC']);
			    //$("#txtSubject").hide().show();
			    
			    // 自适应  编辑器高度
			    self.model.adjustEditorHeight(self.model.containerHeight['emailInputBox']);
        	});
        },
        //绑定添加/删除密送单击事件
        addOrDelBccClick : function(){
        	var self = this,
        		bccEle = $("#trBcc");
        	$("#aShowBcc").toggle(function(e){
        		BH({key : "compose_bcc"});
        		
        		$(this).text('删除密送');
        		bccEle.show();
		        $(this).attr('titleBak',$(this).attr('title'));
		        $(this).attr('title','');
		        self.bccRichInput.focus();
		        self.currentRichInput = self.bccRichInput;
		        self._addTabIndex(self.model.richInputTypes['BCC']);
		        $("#txtSubject").hide().show();
		        
		        // 自适应  编辑器高度
			    self.model.adjustEditorHeight(-self.model.containerHeight['emailInputBox']);
        	},function(){
        		$(this).text("添加密送");
        		bccEle.hide();
		        self.bccRichInput.clear();
		        $(this).attr('title',$(this).attr('titleBak'));
		        self.currentRichInput = self.toRichInput;
		        self._removeTabIndex(self.model.richInputTypes['CC']);
		        $("#txtSubject").hide().show();
		        
		        // 自适应  编辑器高度
			    self.model.adjustEditorHeight(self.model.containerHeight['emailInputBox']);
        	});
        },
        //绑定添加/删除群发单显单击事件
        addOrDelAllToOneClick : function(){
        	var self = this;
        	$("#aAllToOne").toggle(function(e){
        		BH({key : "compose_alltoone"});
        		
        		$(this).text("取消群发单显");
        		$(this).attr('showOneRcpt', 1);
        		
        		$("#aShowCc,#aShowBcc").each(function() {
		            self._disableLink(this);
		        });
		        if($("#trCc").is(":visible")){
            		self.lastCCObj = self.ccRichInput.getValidationItems();
            		self.model.addrInputManager.addMail(self.toRichInput, self.lastCCObj);
		        	$("#aShowCc").click();
		        }
		        if($("#trBcc").is(":visible")){
            		self.lastBCCObj = self.bccRichInput.getValidationItems();
            		self.model.addrInputManager.addMail(self.toRichInput, self.lastBCCObj);
		        	$("#aShowBcc").click();
		        }
		        $("#receiverTo").text('群发单显');
		        $("#receiverTo").attr('title','点击选择收件人');
		        $("#sendOperators").hide();
		        $("#allToOneOperator").show();
		        
		        // 自适应  编辑器高度
			    self.model.adjustEditorHeight(-self.model.containerHeight['allToOne']);
        	},function(){
        		$(this).text("群发单显");
        		$("#aShowCc,#aShowBcc").each(function() {
		            self._enableLink(this);
		        });
        		$(this).attr('showOneRcpt', 0);
        		if (self.lastCCObj) {
		            $("#aShowCc").click();
		            self.model.addrInputManager.addMail(self.ccRichInput, self.lastCCObj);
		            self.model.addrInputManager.removeMail(self.toRichInput, self.lastCCObj);
		        }
        		if (self.lastBCCObj) {
		            $("#aShowBcc").click();
		            self.model.addrInputManager.addMail(self.bccRichInput, self.lastBCCObj);
		            self.model.addrInputManager.removeMail(self.toRichInput, self.lastBCCObj);
		        }
		        self.lastCCObj = null;
		        self.lastBCCObj = null;
		        
		        $("#receiverTo").text('收件人');
		        $("#receiverTo").attr('title','点击选择收件人');
		        $("#sendOperators").show();
		        $("#allToOneOperator").hide();
		        
		        // 自适应  编辑器高度
			    self.model.adjustEditorHeight(self.model.containerHeight['allToOne']);
        	});
        },
        showAddressBookDialog : function(event){
        	var self = this;
        	var target = event.target;
        	self._setCurrentRichInput(target);
			var items = self.currentRichInput.getValidationItems();
	        var view = top.M2012.UI.Dialog.AddressBook.create({
	            filter:"email",
	            items:items,
                comefrom:"compose_addrinput"
	        });
	        view.on("select",function(e){
	            var richInputManager = self.model.addrInputManager;
		        richInputManager.addMailToCurrentRichInput(e.value.join(";")).focus();
	        });
	        view.on("cancel",function(){
	            //alert("取消了");
	        });
        },
        // 根据事件源设置当前地址输入框
        _setCurrentRichInput : function(target){
        	var self = this;
        	var id = $(target).attr('id');
        	switch(id){
        		case 'receiverTo' :
        			BH({key : "compose_to"});
        			self.currentRichInput = self.toRichInput;
        			break;
        		case 'receiverCc' :
        			self.currentRichInput = self.ccRichInput;
        			break;
        		case 'receiverBcc' :
        			self.currentRichInput = self.bccRichInput;
        			break;
        		default :
        			console.log('事件源ID有误id:'+id);
        			break;			
        	}
        },
        // 初始化地址输入框组件
        _initEmailInputs : function(dataSet){
        	var self = this;
        	var model = this.model;
        	if(dataSet.to){
		        self.model.addrInputManager.addMail(self.toRichInput, dataSet.to);
		    }else{
		    	self.toRichInput.setTipText(self.model.tipWords['TO_DEFAULT_TEXT']);
		    }
		    if (dataSet.cc) {
		        dataSet.cc = dataSet.cc.replace(/\\["']/g, "");
		         if(model.get("pageType") != model.pageTypes.COMPOSE) {
			        if(!$("#trCc").is(":visible")){
		        		$("#aShowCc").click();
		        	}
	        	}
		        self.model.addrInputManager.addMail(self.ccRichInput, dataSet.cc);
		    } else if ($T.Cookie.get('c_cc') == "1") {
		        if(model.get("pageType") != model.pageTypes.COMPOSE) {
			        if(!$("#trCc").is(":visible")){
		        		$("#aShowCc").click();
		        	}
	        	}
		    }
		    if (dataSet.bcc) {
		        self.model.addrInputManager.addMail(self.bccRichInput, dataSet.bcc);
		        if(model.get("pageType") != model.pageTypes.COMPOSE) {
			        if(!$("#trBcc").is(":visible")){
			        	$("#aShowBcc").click();
			        }
		        }
		    }
		    // setTimeout(function() { _LastFocusAddressBox = null; }, 0);
        },
        //超链接不可用 
        _disableLink : function(link) {
		    link.style.color = "silver";
		    link._onclick = link.onclick;
		    link.style.cursor = "none";
		    link.onclick = null;
		},
		//超链接可用 
		_enableLink : function(link) {
		    link.style.color = "";
		    if (link._onclick) link.onclick = link._onclick;
		    link.style.cursor = "pointer";
		},
		/**
         * ie下 隐藏的文本框通过tab键获得了焦点 
         * @param inputType 输入框类型
         */
        _removeTabIndex : function(inputType){
        	if($B.is.ie){
	            if (inputType == this.model.richInputTypes['CC']) {
	                $("#ccContainer input:text")[0].tabIndex = null;
	            }else if(inputType == this.model.richInputTypes['BCC']){
	                $("#bccContainer input:text")[0].tabIndex = null;
	            }
	        }
        },
        /**
         * @param inputType 输入框类型
         */
        _addTabIndex : function(inputType){
        	if($B.is.ie){
	            if (inputType == this.model.richInputTypes['CC']) {
	                $("#ccContainer input:text")[0].tabIndex = 2;	
	            }else if(inputType == this.model.richInputTypes['BCC']){
	                $("#bccContainer input:text")[0].tabIndex = 3;
	            }
	        }
        },
		/**
		 * 用户引导tips
		 */
		guideTips:function(){
			var self = this;
			var tipsData = getGuideTips('aAllToOne');

			if (tipsData && tipsData.length > 0) {
			    top.$App.off('insertItem');
			    top.$App.on('insertItem', function (num) {
			        if (num && num.totalLength && num.totalLength > 2 && !self.model.get('hasShowGuideTips')) {
			            self.model.set({ 'hasShowGuideTips': true });
			            $('body').append(top.operatetipsview.render(tipsData[0], document));
			            top.operatetipsview.closeTips({ tipsid: tipsData[0].id, doc: document, type: tipsData[0].type });
			            top.BH('compose_alltoonetips');
			        }
			    });
			}

			//获取数据
			function getGuideTips(elementId){
				var tipsData = [];
				var adLink = top.$App.getConfig("AdLink");
				if(adLink && adLink.tips){
					tipsData = adLink.tips;
				}
				return $.grep(tipsData, function(val,i){
					return val.elementid === elementId;
				});
			}
		}
    }));
})(jQuery, _, M139);

