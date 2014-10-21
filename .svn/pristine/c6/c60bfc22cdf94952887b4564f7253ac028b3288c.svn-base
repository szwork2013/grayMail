/**
* @fileOverview 欢迎页主题运营：地球一小时
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    
    /**
    * @namespace 
    * 欢迎页主题运营
    */
    M139.namespace('M2012.Welcome.Earth2013.View', superClass.extend({

        /**
        *@lends M2012.Welcome.Earth2013.prototype
        */
        el:'body',
        
        template : [ '<div class="noteBox">',
 	            '<i class="note-ico {0}"></i>',
 	            '<strong style="_vertical-align:1px;">{1}</strong><strong style="padding:0;font-family:\'宋体\';">{2}</strong>',
 	          '</div>'].join(""),
        events: {
            "click #attendNow": "attendNow" // 立即加入熄灯计划
        },
        tipMessages : {
        	countTip : '2013年地球1小时活动已进行',
        	attendNow : '点击“立即加入”按钮，设置地球1小时熄灯提醒。',
        	attent : '您已成功设置地球1小时熄灯提醒。',
        	checkTip : '请先选择或输入联系人',
        	richinputInviteTip : '请输入对方的手机号码或邮箱地址',
        	emptyTip : '请先选择或输入联系人',
        	errorTip : '请正确填写联系人地址'
        },
        initialize: function(){
        	this.model = new M2012.Welcome.Earth2013.Model();
        	this.timeObj = {year : 2013,month : 3,date : 23,hour : 20,minute : 30};
        	this.render();
        	this.initEvents();
        	this.imageIndex = 0;// 用于记录底部广告图片序数
        	this.jNum = $("div.people-num");
        	this.countDown = null;
		    return superClass.prototype.initialize.apply(this, arguments);
	    },
	    
	    render: function(){
	    	// 渲染倒计时
	    	var self = this;
	    	self.renderCountDown();
	    	// 渲染动态信息：人数，最近参与
	    	self.renderDynamicInfo();
	    	// 渲染活动列表
	    	self.renderActivities();
	    	// 创建邀请好友参加输入框组件
	    	self.createCompolent();
	    },
	    /*inner*/
	    renderCountDown : function(){
	    	var self = this;
	    	// 判断是否超过2013年3月23日20:30
	    	var isOver = self.model.isOverTime('2013-03-23 20:30:00');
	    	if(isOver){
	    		$("#earthcountdown").hide();
	    		$("#earthcountup").show();
	    		$("#countTip").html(self.tipMessages.countTip);
	    		if(self.countDown){
	    			clearTimeout(self.countDown.timerID);
	    			//self.countDown.stop();
	    		}
	    		setInterval(function(){
	    			var now = new Date();
	    			var date = $Date.parse('2013-03-23 20:30:00');
	    			var millisecond = now.getTime() - date.getTime();
	    			renderTimeUp($Date.getTimeObj(millisecond));
	    		}, 1000);
	    	}else{
	    		$("#earthcountdown").show();
	    		$("#earthcountup").hide();
	    		
	    		self.timeObj.callback = function(timeObj){
	    			if(timeObj.date == '00' && timeObj.hour == '00' && timeObj.minute == '00' && timeObj.second == '00'){
	    				$("#earthcountdown").hide();
	    				$("#earthcountup").show();
	    				if(self.countDown){
	    					self.countDown.stop();
	    				}
	    				self.renderCountDown();
	    			}
	    			renderTime(timeObj);
	    		};
		    	self.countDown = new CountDown(self.timeObj);
		    	self.countDown.start();
	    	}
	    	function renderTime(timeObj){
	    		$("#day").text(timeObj.date);
	    		$("#hour").text(timeObj.hour);
	    		$("#minute").text(timeObj.minute);
	    		$("#second").text(timeObj.second);
	    	};
	    	function renderTimeUp(timeObj){
	    		$("#dayup").text(timeObj.date);
	    		$("#hourup").text(timeObj.hour);
	    		$("#minuteup").text(timeObj.minute);
	    		$("#secondup").text(timeObj.second);
	    	}
	    },
	    /*inner*/
	    renderDynamicInfo : function(){
	    	var self = this;
	    	var mutiScroll = null;
            
            self.model.getEarthHourInfo(function(res){
            	if(res.code == 'S_OK'){
            		self.jNum.html('参与人数：' + self.getNumberHtml(res.partyNum));
	                mutiScroll = new M2012.UI.MutiScroll({ data : getLastestList(res.partInfo),
	                	parentEl : $("#lastestList"),
	                	defaultLines : 1,
	                	scrollLine : 1,
	                	speed : 1300,
	                	timer : 1500
	            	});
	            	//mutiScroll._stop();
	            	// 渲染邀请好友数量
	            	$("#initInviteCount").text(res.invitedFriends);
            	}else{
            		console.log('获取活动动态信息错误!');
            	}
	    	});
	    	setInterval(function(){
    			self.model.getEarthHourInfo(function(res){
    				if(res.code == 'S_OK'){
    					self.jNum.html('参与人数：' + self.getNumberHtml(res.partyNum));
    					if(mutiScroll){
    						mutiScroll.updateScroll({ data : getLastestList(res.partInfo)});
    					}
    				}else{
    					console.log('获取活动动态信息错误!');
    				}
		    	});
    		}, 120 * 1000);
	    	function getLastestList(list){
	    		if(!list || list.length == 0){
	    			return '';
	    		}
	    		var data = [], reval = [];
	    		for(var i = 0;i < list.length;i++){
	    			var msg = list[i];
	    			data.push($T.format(self.template, [getIconClass(msg.partType), msg.partakeName, getContentFix(msg.partType)+'&nbsp;&nbsp'+msg.partakeContent]));
	    		}
	    		return data;
	    	};
	    	function getIconClass(type){
	    		if(type == 1){
	    			return 'light';
	    		}else if(type == 2){
	    			return 'leaf';
	    		}else{
	    			return 'love';
	    		}
	    	};
	    	function getContentFix(type){
	    		if(type == 1){
	    			return '加入';
	    		}else if(type == 2){
	    			return '承诺';
	    		}else{
	    			return '邀请';
	    		}
	    	}
	    },
	    getNumberHtml : function(number){
    		var numStr = number.toString().replace(/(\d)/g, function($0, $1){
				return '<var>' + $1 + '</var>';
			});
			return numStr;
    	},
	    /*inner*/
	    renderActivities : function(){
	    	var self = this;
	    	// 判断当前时间是否超过21:30
	    	var isOver = self.model.isOverTime('2013-03-23 21:30:00');
	    	//var isOver = self.model.isOverTime('2013-02-22 17:30:00');
	    	if(isOver){
	    		// 隐藏熄灯一小时，邀请好友界面;显示分享熄灯一小时照片界面
	    		$("#callMsg > i").attr('class','i-con5-til fl');
	    		$("#callMsg > i").text('守护地球，不止熄灯1小时');
	    		
	    		$("#lampOffPlan").hide();
	    		$("#lampOffPlanContent").hide();
	    		$("#sharePhoto").show();
	    		$("#sharePhotoContent").show();
	    		
	    		$("#inviteFriends").parent("li").hide();
	    	}else{
	    		self.model.getEarthHourInfo(function(res){
		    		var isAttachLampOff = res.status;
		    		if(isAttachLampOff){
		    			$("#attendNow").hide();
			    		$("#attent").show();
			    		$("#lampOffTip").text(self.tipMessages.attent);
		    		}else{
		    			$("#attendNow").show();
			    		$("#attent").hide();
			    		$("#lampOffTip").text(self.tipMessages.attendNow);
		    		}
		    	});
	    	}
	    },
	    // 创建组件
	    createCompolent : function(){
	    	var self = this;
	    	if(top.$App){
	    		self.inviteRichInput = M2012.UI.RichInput.create({
			        container:document.getElementById("toContainerInvite"),
			        maxSend : self.model.getMaxSender(),
			        preventAssociate : true,
			        type:"email"
			    }).render();
			    self.inviteRichInput.on('itemchange', function(){
			    	// todo 调整界面高度
			    	//self.model.resizePopHeight();
			    });
			    self.inviteRichInput.setTipText(self.tipMessages.richinputInviteTip);
	    	}else{
				var emailToHolder = document.getElementById("toContainerInvite");
		        var param = {
		            container: emailToHolder,
		            plugins: [RichInputBox.Plugin.AutoComplete],
		            autoHeight: true,
		            skinAble: true
		        };
		        self.inviteRichInput = new RichInputBox(param);
		        self.inviteRichInput.setTipText(self.tipMessages.richinputInviteTip);
		        $(".RichInputBox > input").width(193);
		        $(".RichInputBoxLayout").css('overflow', 'hidden');
		        $(".RichInputBox").css('overflow', 'hidden');
		        
	    	}
	    },
	    initEvents: function(){
	    	var self = this;
	    	// 活动列表绑定单击事件
	    	$(".tabBox-ul > li").click(function(event){
	    		if($(this).is(":visible")){
	    			var index = $(this).index();
		    		$(this).addClass('tabBox-on').siblings('li').removeClass('tabBox-on');
		    		$(".tabBox-r > div:eq("+index+")").show().siblings('div').hide();
		    		
		    		if(index == 1){
		    			self.inviteRichInput.clear();
		    			$("#inviteNow").show();
		    			$("#inviteTip").text('邀请更多人参与');
	    				$("div.contactBox").show();
	    				$(".success-invite").hide();
	    				$("#inviteContainer").show();
		    		}
	    		}
	    	});
	    	// 邀请好友
	    	$("#inviteNow").click(function(event){
	    		if(!self.checkInput()){
	    			return;
	    		}
				var mails = self.getEmails();
	    		self.model.inviteFriends(mails.join(','), function(res){
	    			if(res.code == 'S_OK'){
	    				$("#inviteContainer .contactBox").hide();
	    				var inviteNum = res.inviteSum;
	    				$("#inviteCount").text(inviteNum);
	    				$("#initInviteCount").text(inviteNum);
	    				$("#inviteContainer .success-invite").show();
	    				
	    				$("#inviteNow").hide();
	    			}else{
	    				self.model.alert('邀请好友失败，请稍后重试');
	    			}
	    		});
	    		// 发送邀请好友参加活动的邮件
    			var inviteTemplate = self.model.inviteTemplate;
	    		if(inviteTemplate){
	    			self.sendMail(inviteTemplate);
	    		}else{
	    			self.model.getMailTemplate(2, function(res){
	    				inviteTemplate = res.emailTemplate;
	    				self.sendMail(inviteTemplate);
			    	});
	    		}
	    		// if(top.$App){
	    			// top.$App.setCustomAttrs(self.model.attrbuteKey, {earth2013 : self.model.attrbuteValues.invitefriends});
	    		// }else{
	    			// top.setUserCustomInfo(self.model.attrbuteKeyForOld, self.model.attrbuteValuesForOld.invitefriends);
	    		// }
	    	});
	    	// 继续邀请
	    	$("#inviteContinue").click(function(event){
	    		$("#inviteContainer .success-invite").hide();
	    		$("#inviteContainer .contactBox").show();
	    		$("#inviteNow").show();
	    		self.inviteRichInput.clear();
	    	});
	    	$("div.contactBox-t .fl").click(function(event){
	    		var items = self.getEmails();
	    		if(top.$App){
	    			var view = top.M2012.UI.Dialog.AddressBook.create({
			            filter:"email",
			            items:items
			        });
			        view.on("select",function(e){
			        	self.inviteRichInput.insertItem(e.value);
			        });
			        view.on("cancel",function(){
			        });
	    		}else{
	    			function callback(list) {
			        	self.inviteRichInput.clear();
			            self.inviteRichInput.insertItem(list.join(','));
			        };
			        top.Utils.openAddressWindow({ receiverTitle: "收件人", callback: callback, selectedList: items });
	    		}
	    	});
	    	$("#promiseNow").click(function(event){
	    		// todo 跳转至运营界面：环保承诺单点登录地址
	    		top.addBehavior("地球一小时-承诺环保立即参加");
	    		// 点击即认为用户参加了该活动,修改活动状态
	    		self.model.setStatus(2, function(res){
            		if(res.code == 'S_OK'){
	    				console.log('环保承诺状态保存成功');
	    				self.jNum.html('参与人数：' + self.getNumberHtml(res.partyNum));
	    			}else{
	    				console.log('环保承诺状态保存失败');
	    			}
            	});
			    window.open(self.model.getSingleLoginSite());
	    		// if(top.$App){
	    			// top.$App.setCustomAttrs(self.model.attrbuteKey, {earth2013 : self.model.attrbuteValues.promise});
	    		// }else{
	    			// top.setUserCustomInfo(self.model.attrbuteKeyForOld, self.model.attrbuteValuesForOld.promise);
	    		// }
	    	});
	    	$("#uploadNow").click(function(event){
	    		top.addBehavior("地球一小时-分享照片立即上传");
	    		self.model.showDisk();
	    	});
	    	// 图片轮转
	    	$("#adImagesSlide > a:eq(0)").click(function(event){
	    		if(self.imageIndex == 0){
	    			return;
	    		}
	    		self.imageIndex = self.imageIndex - 1;
	    		$("#adImagesSlide > a:eq("+(self.imageIndex+1)+")").click();
	    	});
	    	$("#adImagesSlide > a:gt(0):lt(4)").click(function(event){
	    		var index = $(this).index();
	    		$(this).addClass('on').siblings().removeClass('on');
	    		$("#adImages > a:eq("+(index-1)+")").show().siblings().hide();
	    		self.imageIndex = index - 1;
	    		// 阻止事件冒泡 ，若冒泡则会触发UI.AutoCompleteMenu.js: $(document).click(hide)导致地址输入框提示插件迅速隐藏
	    		return false;
	    	});
	    	$("#adImagesSlide > a:eq(5)").click(function(event){
	    		if(self.imageIndex == 3){
	    			return;
	    		}
	    		self.imageIndex = self.imageIndex + 1;
	    		$("#adImagesSlide > a:eq("+(self.imageIndex+1)+")").click();
	    	});
	    	// 广告图片绑定单击事件
	    	$("#adImages > a").click(function(event){
	    		var index = $(this).index();
	    		self.showAd(index);
	    	});
	    	//地址输入框绑定focus
	    	$("div.contact-txt").click(function(){
	    		self.inviteRichInput.focus();
	    	});
	    	// 底部光该图片轮转
	    	self.adTimer = setInterval(function(){
    			self.imageIndex += 1;
    			if(self.imageIndex == 4){
    				self.imageIndex = 0;
    			}
    			$("#adImagesSlide > a:eq("+(self.imageIndex+1)+")").click();
    		}, 3 * 1000);
	    },
	    sendMail : function(content){
	    	var self = this;
	    	self.model.iniviteMail.email = self.getEmails().join(',');
			self.model.iniviteMail.subject = $T.format(self.model.iniviteMail.subject, [self.model.getUserName()]);
			var signName = self.model.getSignName();
			if(signName){
				signName = '【'+signName+'】';
			}
			self.model.iniviteMail.content = content.replace('{1}', signName);
			self.model.sendMail(self.model.iniviteMail, function(res){
				if(res.code == 'S_OK'){
					if(!top.$App){
						top.addBehavior("地球一小时-成功发送邀请邮件");
					}
					console.log('邀请好友参加活动邮件发送成功！');
				}else{
					console.log('邀请好友参加活动邮件发送失败！');
				}
			});
	    },
	    showAd : function(index){
	    	var self = this;
	    	if(index == 0){
	    		// 精品订阅
	    		if(top.$App){
	    			top.Links.show('homemail');
	    		}else{
	    			top.addBehavior("地球一小时-底部推广精品订阅");
	    			top.Links.show('dingyuezhongxin');
	    		}
	    	}else if(index == 1){
	    		// 电子账单
	    		if(top.$App){
	    			alert('新版账单中心');
	    		}else{
	    			top.addBehavior("地球一小时-底部推广电子账单");
	    			top.Links.show('billmanager');
	    		}
	    	}else if(index == 2){
	    		// 电子贺卡
	    		if(top.$App){
	    			top.$App.show('greetingcard');
	    		}else{
	    			top.addBehavior("地球一小时-底部推广电子贺卡");
	    			top.Links.show('greetingcard');
	    		}
	    	}else{
	    		// 彩云
	    		if(!top.$App){
	    			top.addBehavior("地球一小时-底部推广查看彩云");
	    		}
	    		self.model.showDisk();
	    	}
	    },
	    // 获取邮件地址
	    getEmails : function(){
	    	var self = this;
	    	if(top.$App){
    			return self.inviteRichInput.getValidationItems();
    		}else{
    			return self.inviteRichInput.getRightEmails();
    		}
	    },
	    // 获取错误邮件地址信息
	    getErrorText : function(){
	    	var self = this;
	    	if(top.$App){
    			return self.inviteRichInput.getErrorText();
    		}else{
    			return self.inviteRichInput.getErrorText();
    		}
	    },
	    // 验证邀请好友地址输入框使用该方法弹出提示框
	    showTip : function(msg){
	    	var jTip = $("#earthInputTip > div.tips-text");
	    	jTip.text(msg);
	    	$("#earthInputTip").show();
			setTimeout(function(){
				$("#earthInputTip").hide();
			}, 3 * 1000);
	    },
	    checkInput : function(){
	    	var self = this;
	    	console.log(self.inviteRichInput.hasItem());
			if(!self.inviteRichInput.hasItem()){
				self.showTip(self.tipMessages.emptyTip);
				return false;
			}
			var error = self.getErrorText();
	        if (error) {
	            self.showTip(self.tipMessages.errorTip);
	            return false;
	        }
	        var items = this.getEmails();
	        if (items.length > maxSend) {
	            FF.alert(top.getMaxReceiverTips());
	            return false;
	        }
	        return true;
	    },
	    // 立即加入
	    attendNow : function(event){
	    	var self = this;
	    	if(top.$App){
	    		top.$App.on('earth2013Lightoff', function(){
	    			//top.$App.off('earth2013Lightoff');
                	self.model.setStatus(1, function(res){
                		if(res.code == 'S_OK'){
		    				console.log('熄灯一小时状态保存成功');
		    			}else{
		    				console.log('熄灯一小时状态保存失败');
		    			}
                	});
			        top.$App.setCustomAttrs(self.model.attrbuteKey, {earth2013 : self.model.attrbuteValues.lightoff});
			        top.$App.close('addcalendar');
			        top.$App.show('earth2013');
	    		});
	    		top.$App.show("addcalendar", {ywextend : 'earth2013'});
	    		top.$App.close('earth2013');
	    	}else{
	    		top.addBehavior("地球一小时-熄灯提醒立即加入");
	    		top.GlobalEvent.add('earth2013Lightoff', function(){
	    			top.addBehavior("地球一小时-成功保存日程提醒");
                	self.model.setStatus(1, function(res){
                		if(res.code == 'S_OK'){
                			// todo 渲染参加人数
                			//console.log('熄灯一小时状态保存成功');
                			self.jNum.html('参与人数：' + self.getNumberHtml(res.partyNum));
		    			}else{
		    				//console.log('熄灯一小时状态保存失败');
		    			}
                	});
                	// todo 老版本要求key value 为整形
			        top.setUserCustomInfo(self.model.attrbuteKeyForOld, self.model.attrbuteValuesForOld.lightoff);
			        // 刷新欢迎页入口图标
			        top.GlobalEvent.broadcast('flushEarth2013Icon', 'on');
			        
			        top.MM.close('addcalendar');
			        top.Links.show('earth2013');
	    		});
	    		top.GlobalEvent.add('earth2013LightoffCancel', function(){
			        top.MM.close('addcalendar');
			        top.Links.show('earth2013');
	    		});
	    		top.Links.show('addcalendar','&ywextend=earth2013');
	    		top.MM.close('earth2013');
	    	}
	    }
	}));
    earth2013View = new M2012.Welcome.Earth2013.View();
    richTo = earth2013View.inviteRichInput;
})(jQuery, _, M139);
window.onModuleClose = function(){
	$(".countimg-box > #FlashID").remove();
}