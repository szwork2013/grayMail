/**
 * @author wuxiang 
 * @description 运营滚动效果
 * data为li中的数据,
 * defaultLines为默认展现的条数,
 * scrollLine每一次滚动的条数
 * speed 滚动的速度
 * timer 每一次滚动所花时间
 * var mutiScroll = new M2012.UI.MutiScroll({ data:['11111','222222','33333','222222','33333'],
 *                           parentEl:$("#accountList"),
 *                           defaultLines:2,
 *                           scrollLine:1,
 *                           speed:1300,
 *                           timer:1500
 *                         }); 
 * 更新滚动内容
 * mutiScroll.updateScroll({data:["aaaaa","bbbbb","ccccc"]});
 */
(function (jQuery, _, M139) {
	    var $ = jQuery;
	    var superClass = M139.View.ViewBase;
	    M139.namespace('M2012.UI.MutiScroll', superClass.extend({
	    	 data:[],
	    	 parentEl:null,
	    	 speed:1300,   //滚动的速度
	    	 timer:1500,   //多少次滚动一次
	    	 scrollLine:1, //每次滚动条数
			 defaultLines:1,//展现的条数
	    	 initialize :function(obj){
	    	  	this.data = obj.data||[];
	    	  	this.speed = obj.speed||1300;//卷动速度，数值越大，速度越慢（毫秒）
	    	  	this.timer = obj.timer||1500;//滚动的时间间隔（毫秒）
	    	  	this.parentEl = obj.parentEl;
	    	  	this.scrollLine  = obj.scrollLine||1;
				this.defaultLines = obj.defaultLines||1;
	    	  	this.init();
	         },
	         init:function(){
	        	 this._initPararent(this.data);
	        	 this._scroll();
	        	 this._initEvent();
	         },
			 _initPararent:function(data){
				 var Lis = [],len = data.length;
	        	 for(var i = 0;i<len;i++){
	        		 Lis.push( $T.Utils.format(this._templateLi,{info:data[i]}));
	     		 }
	        	 this.parentEl.html($T.Utils.format(this._templateUl,{id:this.cid,lis:Lis.join('')}));
				 //获取每一行的高度,展现的行数
				 var liHeight = this.parentEl.find("li:first").outerHeight();
				 this.parentEl.css({height:liHeight*this.defaultLines,overflow:'hidden'});
			 },
			 updateScroll:function(param){
			     if(param.data){
			     	this.data = param.data;
					this._initPararent(param.data);
					this._stop();
					this._scroll();
				 }
			 },
	         _scroll:function(){
	         	 if(this.data.length>this.defaultLines){
				 	this._start();
	         	 }
	         },
	         _scrollUp:function(){
			     var self = this;
			     var ulEl =  this.parentEl.eq(0).find("ul:first");
				 var scrollLine =  parseInt(this.scrollLine,10);
				 var lineH = this.parentEl.find("li:first").outerHeight();
				 var upHeight = 0-scrollLine*lineH;
				 var speed =parseInt(this.speed,10); 
	         	 if(this.timerID){
				    try{
							ulEl.animate({marginTop:upHeight},speed,function(){
									for(i=1;i<=scrollLine;i++){
										   ulEl.find("li:first").appendTo(ulEl);
									}
									ulEl.css({marginTop:0});
							});
						}catch(e){
						   self._stop();
						   self._scroll();
						}
					}
	         },
	         _stop:function(){
	         	 if(this.timerID){
                    clearInterval(this.timerID);
					this.timerID = null;
				}
	         },
	         _start:function(){
	         	var self = this;
	         	self.timerID=setInterval(function(){
                        		self._scrollUp();
                            },self.timer);
	         },
	         _initEvent:function(){
	         	 //鼠标事件绑定
	         	var self = this;
                this.parentEl.hover(function(){
				      self._stop();
                },function(){
                      self._scroll();
                }).mouseout();
	         },
	    	 _templateUl:'<ul id="ul_{id}" style="overflow:hidden;margin:0px;">{lis}</ul>',
	    	 _templateLi:'<li style="overflow:hidden;">{info}</li>'
	    }));
})(jQuery, _, M139);

﻿/**
 * @fileOverview 定义倒计时组件.
 * @options {year : year,month : month,date : date,hour : hour,minute : minute,callback : callback}
 */
(function(){
	CountDown = function(options){
		// 构造函数
		this.year = options.year;
		this.month = options.month;
		this.date = options.date;
		this.hour = options.hour;
		this.minute = options.minute;
		this.callback = options.callback;
		
		this.timerID = null;
		this.timerRunning = false;
	};
	CountDown.prototype = {
		/**
		* 显示倒计时视图
		*/
		show: function() {
			var self = this;
			var today = new Date();
			var nowHour = today.getHours();
			var nowMinute = today.getMinutes();
			var nowMonth = today.getMonth();
			var nowDate = today.getDate();
			var nowYear = today.getFullYear();
			var nowSecond = today.getSeconds();
			today = null;
			hourleft = self.hour - nowHour;
			minuteleft = self.minute - nowMinute;
			secondleft = 0 - nowSecond;
			yearleft = self.year - nowYear;
			monthleft = self.month - nowMonth - 1;
			dateleft = self.date - nowDate;
			if(secondleft < 0) {
				secondleft = 60 + secondleft;
				minuteleft = minuteleft - 1;
			}
			if(minuteleft < 0) {
				minuteleft = 60 + minuteleft;
				hourleft = hourleft - 1;
			}
			if(hourleft < 0) {
				hourleft = 24 + hourleft;
				dateleft = dateleft - 1;
			}
			if(dateleft < 0) {
				// todo
				//dateleft = 31 + dateleft;
				dateleft = $Date.getDaysOfMonth(new Date()) + dateleft;
				monthleft = monthleft - 1;
			}
			if(monthleft < 0) {
				monthleft = 12 + monthleft;
				yearleft = yearleft - 1;
			} else {
				if(monthleft == 2){
					dateleft += monthleft * 30 - 1;
				}else{
					dateleft += 28;
				}
			}
			dateleft-=28;
			//dateleft-=$Date.getDaysOfMonth(new Date());
			//Temp=yearleft+'年, '+monthleft+'月, '+dateleft+'天, '+hourleft+'小时, '+minuteleft+'分, '+secondleft+'秒'
			dateleft = dateleft < 10 ? '0' + dateleft : dateleft;
			hourleft = hourleft < 10 ? '0' + hourleft : hourleft;
			minuteleft = minuteleft < 10 ? '0' + minuteleft : minuteleft;
			secondleft = secondleft < 10 ? '0' + secondleft : secondleft;
			
			var time = {year : yearleft,month : monthleft,date : dateleft,hour : hourleft,minute : minuteleft,second : secondleft};
			self.callback(time);
			if(self.timerID){
				clearTimeout(self.timerID);
			}
			self.timerID = setTimeout(function(){
				self.show();
			}, 1000);
			self.timerRunning = true;
		},
		stop: function(){
			var self = this;
			if(self.timerRunning){
				clearTimeout(self.timerID);
			}
			self.timerRunning = false;
		},
		start : function() {
			var self = this;
			self.stop();
			self.show();
		}
	};
})();

﻿/**
 * @fileOverview 欢迎页主题运营：地球一小时
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = Backbone.Model;

    /**
     * @namespace
     * 欢迎页地球一小时
     */
    M139.namespace('M2012.Welcome.Earth2013.Model', superClass.extend({

        /**
         *@lends M2012.Welcome.Earth2013.prototype
         */
        dynamicInfo:{
            eventTime:'2013-03-23 20:30:00',
            partyNum:1234567,
            status:0, // 是否设置地球一小时日程提醒0:未参与  1：参与
            enviStatus:0, // 是否承诺一个环保行动0: 否  1：是
            isShow:1,
            invitedFriends:13,
            partInfo:[
                {partakeName:'aa', partType:1, partakeContent:'地球一小时'},
                {partakeName:'bb', partType:2, partakeContent:'承诺一个环保'},
                {partakeName:'cc', partType:3, partakeContent:'邀请2位好友'}
            ]
        },
        singleLoginSite:'http://zone.mail.10086.cn/api/sso/ssoformail.ashx?to=CN201302D1&sid=',
        attrbuteKey:'topicality',
        attrbuteValues:{
            lightoff:'lightoff', // 熄灯一小时
            promise:'promise', // 环保承诺
            invitefriends:'invitefriends'// 邀请好友
        },
        attrbuteKeyForOld:46,
        attrbuteValuesForOld:{
            lightoff:1, // 熄灯一小时
            promise:2, // 环保承诺
            invitefriends:3// 邀请好友
        },
        inviteTemplate:'', // 参加模板
        iniviteMail:{
            email:"", //收件人地址‘,’号分隔
            subject:"您的好友{0}邀请您参与\"地球一小时\"活动",
            content:""
        },
        initialize:function () {
            this.initMailTemplate();
        },
        callApi:M139.RichMail.API.call,
        /**
         * 获取地球一小时初始化信息
         * @param callback {Function} 获取参加地球一小时活动动态消息
         */
        getEarthHourInfo:function (callback) {
            var self = this;
            var data = {};
            self.callApi("earthhour:earthHourInit", data, function (res) {
                self.setDynamicInfo(res.responseData);
                if (callback) {
                    callback(res.responseData);
                }
            });
        },
        /*inner*/
        initMailTemplate:function () {
            var self = this;
            self.getMailTemplate(2, function (res) {
                self.setInviteTemplate(res.emailTemplate);
            });
        },
        /**
         *获取邮件模板
         * @param type {int} 1: 邀请好友见证邮件模版 2: 邀请好友参加邮件模版
         */
        getMailTemplate:function (type, callback) {
            var self = this;
            var data = {type:type};
            self.callApi("earthhour:getStencil", data, function (res) {
                if (callback) {
                    callback(res.responseData);
                }
            });
        },
        /**
         *设置参加活动状态
         * @param partyType {int} 1: 地球一小时 2：承诺一个环保行动
         * @param callback {Function} 回调
         */
        setStatus:function (partyType, callback) {
            var data = {
                partType:partyType + ''
            }
            M139.RichMail.API.call("earthhour:setStatus", data, function (res) {
                if (callback) {
                    callback(res.responseData);
                }
            });
        },
        /**
         *邀请好友
         * @param mails {String} 邀请人的邮箱地址（多个）用“，”隔开
         * @param callback {Function} 回调
         */
        inviteFriends:function (mails, callback) {
            var data = {
                mails:mails
            }
            M139.RichMail.API.call("earthhour:inviteFriends", data, function (res) {
                if (callback) {
                    callback(res.responseData);
                }
            });
        },
        /**
         *将服务端返回的初始化信息保存到model层
         *@param dynamicInfo {Object} 动态信息对象
         *@inner
         */
        setDynamicInfo:function (dynamicInfo) {
            var self = this;
            self.dynamicInfo.eventTime = dynamicInfo.eventTime;
            self.dynamicInfo.partyNum = dynamicInfo.partyNum;
            self.dynamicInfo.status = dynamicInfo.status;
            self.dynamicInfo.enviStatus = dynamicInfo.enviStatus;
            self.dynamicInfo.isShow = dynamicInfo.isShow;
            self.dynamicInfo.invitedFriends = dynamicInfo.invitedFriends;
            self.dynamicInfo.partInfo = dynamicInfo.partInfo;
        },
        /**
         *保存邀请邮件模板
         *@param template {String} 邮件模板
         *@inner
         */
        setInviteTemplate:function (template) {
            this.inviteTemplate = template;
        },
        /**
         *按照真实姓名，别名，手机号码取用户名
         *@return {String}
         */
        getUserName:function () {
            if (top.$User) {
                return top.$User.getSendName();
            } else {
                return top.Utils.getUserName();
            }
        },
        /**
         *按照真实姓名，别名 返回用户名，没有真实姓名别名就返回''
         *@return {String}
         */
        getSignName:function () {
            var name = top.UserData.userName;//姓名
            if (!name) {//别名
                if (top.UserData.uidList.length > 0) {
                    name = top.UserData.uidList[0];
                } else {
                    name = '';
                }
            }
            return name.replace(/</g, "&lt;");
        },
        /**
         *返回最大收件人数量
         *@return {Int}
         */
        getMaxSender:function () {
            if (top.$User) {
                return top.$User.getMaxSend();
            } else {
                return top.getMaxReceiverNum();
            }
        },
        /**
         *返回运营中心环保承诺单点登录地址 todo 该地址暂时未上线
         *@return {String}
         */
        getSingleLoginSite:function () {
            return this.singleLoginSite + top.sid;
        },
        /**
         *判断当前时间是否超过某个时间,2013-03-23 21:30:00
         *@return {Boolean}
         */
        isOverTime:function (date) {
            var date = $Date.parse(date);
            if (!date) {
                return false;
            }
            var now = new Date();
            if (now >= date) {
                return true;
            }
            return false;
        },
        /*
         *@deprecated 暂时废弃该方法
         */
        resizePopHeight:function () {
            var pH = $("#withnessTemplate .add-gf-p").height();
            var conH = $("#withnessTemplate .add-gf-con").height();
            $("#withnessTemplate .earth-pop-body").height(pH + conH);
        },
        /**
         *弹出提示框
         */
        alert:function (tip) {
            if (top.$Msg) {
                top.$Msg.alert(tip);
            } else {
                top.FloatingFrame.alert(tip);
            }
        },
        /**
         *打开彩云标签页
         */
        showDisk:function () {
            if (top.$App) {
                top.$App.show('diskDev');
            } else {
                top.Links.show('diskDev', '&id=2');
            }
        },
        /**
         *发送邮件
         * @param param {Object} {email : '12345@139.com,12367@139.com', subject : 'aaa', content : 'bbb'}
         * @param callback {Function} 回调
         */
        sendMail:function (param, callback) {
            var mailInfo = {
                id:"",
                mid:"", //后台返回的草稿ID,成功调用存草稿方法后修改该属性
                messageId:"",
                account:param.account ? param.account : getDefaultSender(), //发件人
                to:param.email, //收件人地址‘,’号分隔
                cc:"", //抄送人地址
                bcc:"", //密送人地址
                showOneRcpt:1, //是否群发单显1 是 0否
                isHtml:1,
                subject:param.subject,
                content:param.content,
                priority:3, //是否重要
                signatureId:0, //使用签名档
                stationeryId:0, //使用信纸
                saveSentCopy:1, //发送后保存副本到发件箱
                requestReadReceipt:0, //是否需要已读回执
                inlineResources:1, //是否内联图片
                scheduleDate:0, //定时发信
                normalizeRfc822:0,
                attachments:[]//所有附件信息
            }
            var data = {
                "attrs":mailInfo,
                "action":'deliver',
                "replyNotify":0,
                "returnInfo":1
            };
            M139.RichMail.API.call("mbox:compose&comefrom=5&categroyId=103000000", data, function (res) {
                if (callback) {
                    callback(res.responseData);
                }
            });
            function getDefaultSender() {
                if (top.$App) {
                    return top.$User.getDefaultSender();
                } else {
                    return top.UserData.DefaultSender;
                }
            }
        }
    }));

})(jQuery, _, M139);

﻿/**
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
