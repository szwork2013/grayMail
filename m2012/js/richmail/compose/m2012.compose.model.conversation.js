/**
 * @fileOverview 定义基础邮箱写信所需公共代码
 */
 (function(jQuery,Backbone,_,M139){
    var $ = jQuery;
    M139.namespace("M2012.Compose.Model",Backbone.Model.extend({
    	defaults : {
            pageType : '',
            mid : '',
            sd : '',
            ids : '',
            isEditorPageOnload : true,
            isComposePageOnload : false,
            initDataSet : {}// 用于存储 原邮件对象 如：待回复邮件，待转发邮件等
        },
		isChrome : false,
		isFirefox : false,
		PageStateTypes : {
		    //正在初始化
		    Initializing: 1,
		    //正在上传附件
		    Uploading: 2,
		    //正在发送邮件
		    Sending: 3,
		    //正在保存附件
		    Saving: 4,
		    //普通状态
		    Common: 5,
		    //发送完成
		    Sended: 6
		},
		PageState : 1,
		autoSendMail : false,
		sid : '',
		composeId : '',
		messageId : '',
		draftId : '',
		composeAttachs : [],
		asynDeletedFile : '',
        maxUploadLargeAttach: 1,
		mailInfo : {
            id: "",
        	mid : "", //后台返回的草稿ID,成功调用存草稿方法后修改该属性
			messageId: "",
        	account: "",//发件人
	        to: "",//收件人地址‘,’号分隔
	        cc: "",//抄送人地址
	        bcc: "",//密送人地址
	        showOneRcpt: 0, //是否群发单显1 是 0否 
	        isHtml: 1,
	        subject: "",
	        content: "",
	        priority: 1, //是否重要
	        signatureId: 0,//使用签名档
	        stationeryId: 0,//使用信纸
	        saveSentCopy: 1,//发送后保存副本到发件箱
	        requestReadReceipt : 0,//是否需要已读回执
	        inlineResources: 1, //是否内联图片
	        scheduleDate: 0, //定时发信
	        normalizeRfc822: 0,
	        remoteAttachment: [],
	        attachments: [],//所有附件信息
	        headers : {}
        },
        autoSaveTimer : {
        	timer : null,
        	interval : 120,
        	subMailInfo : {
                // todo 添加 收件人
        		content : "",// 编辑器内容
        		subject : ""// 主题
        	}
        },
		pageTypes : {
            COMPOSE : 'compose',//写新邮件
            REPLY : 'reply',//回复
            REPLYALL : 'replyAll',//回复全部
            FORWARD : 'forward',//转发
            FORWARDASATTACH : 'forwardAsAttach',//作为附件转发
            FORWARDATTACHS : 'forwardAttachs',// 纯附件直接转发
            FORWARDMORE : 'forwardMore',//多封邮件作为附件转发
            DRAFT : 'draft',
            RESEND : 'resend',
            VCARD : 'vCard', //电子名片，向下迁移到自定义邮件中

            //增加一种新的通用型的，写信页去异步加载一个内容填充逻辑.js，该js内调用写信页定义
            //好的开放API来填入内容，控制邮件属性，最小侵入写信主干逻辑。
            //包.js放入推广内容区 packs/promotion//xxx_201310.pack.js，带上线月份，便于确认清理
            CUSTOM : 'customExtMail',

            UPLOAD_LARGE_ATTACH : 'uploadLargeAttach'// 显示大附件上传框
        },
        tipWords : {
        	LOADING : '加载中...',
        	SENDING : '邮件正在发送...',
        	LOAD_FAIL : '加载失败，请重试。',
        	AUTO_SAVE_SUC : '{0}点{1}分自动保存草稿成功',
        	SAVE_SUC : '{0}点{1}分成功保存到草稿箱',
        	LACK_SUBJECT : '未填写主题，确定发送吗？',
        	LACK_ATTACHMENTS : '您在邮件中提到了附件，可能忘了上传附件。确定继续发送吗？',
        	CANCEL_SEND : '关闭写信页，未保存的内容将会丢失，是否关闭？',
        	INVALID_DATE : '定时发送时间不能比当前时间早。',
        	NO_RECEIPT : '收件人格式不正确。',
        	TO_DEFAULT_TEXT : '输入对方移动手机号，就能给他发邮件',
        	UPLOAD_LARGEATTACH : '添加最大{0}G的附件和暂存柜文件、彩云文件',
        	SCHEDULE_MAIL : '您设置在{0}定时发送此邮件'
        },
        richInputTypes : {
        	TO : 'to',// 收件人
        	CC : 'cc',// 抄送
        	BCC : 'bcc'// 密送
        },
        actionTypes : {
        	CONTINUE : "continue",// 继续编辑 
		 	AUTOSAVE : "autosave",// 自动保存
		 	SAVE : "save",//存原稿并继续编辑
		 	DELIVER : "deliver"//立即发送邮件
        },
        systemSigns : ["Best wishes for the year to come!",
                "I hope you have a most happy and prosperous New Year.！",
                "天增岁月人增寿，春满乾坤福满门；福开新运，财源广进！",
                "恭祝您的事业蒸蒸日上，新年更有新气象！",
                "值此春回大地、万象更新之良辰，敬祝您福、禄、寿三星高照，阖府康乐，如意吉祥！ 拜新年！",
                "上联：加薪买房购小车；下联：娶妻生子成家室；横批：接财神！",
                "傲不可长，欲不可纵，乐不可极，志不可满。","宝剑锋从磨砺出，梅花香自苦寒来。",
                "博观而约取，厚积而薄发。","博学之，审问之，慎思之，明辨之，笃行之。",
                "不登高山，不知天之高也；不临深溪，不知地之厚也。","不飞则已，一飞冲天；不鸣则已,一鸣惊人。",
                "不可乘喜而轻诺，不可因醉而生嗔，不可乘快而多事，不可因倦而鲜终。","沧海横流，方显英雄本色。",
                "沉舟侧畔千帆过，病树前头万木春。","尺有所短，寸有所长。物有所不足，智有所不明。"],
        sysImgPath : ["/upload/photo/system/nopic.jpg","/upload/photo/nopic.jpg"],
        containerHeight : {// 自适应
        	emailInputBox : 32,// 地址输入框高度
        	allToOne : 5,// 单击群发单显输入框高度的浮动值
        	moreOptions : 35// 单击底部更多选项小三角后底部高度的浮动值
        },
        logger: new top.M139.Logger({name: "M2012.Compose"}),
        tabName : '', // 当前写信页签名称，用于激活写信页
        editorMinHeight : 210, // 编辑器最小高度
        addrinputMaxHeight : 88, // 地址输入框最大高度，超过则显示滚动条
        handlerQueue: [],

        /** 
        *写信所需公共代码
        *@constructs M2012.Compose.Model
        *@param {Object} options 初始化参数集
        *@param {String} options.mid 可选参数，根据mid创建一个实例，即围绕这个mid进行工作 发送完邮件即结束这个mid的任务，不要重复使用这个model实例
        *@example
        */
        initialize:function(options){
        	this.initGlobalVars();
        	this.initUploadComponent();
            this.on('route', function() {
                this.routePage();
            });
        },
        // 初始化全局变量
        initGlobalVars : function(){
            var self = this;

        	var pageType = $composeApp.query.type || ($composeApp.inputData && $composeApp.inputData.type) || this.pageTypes['COMPOSE'],
            	composeType = $composeApp.query.composeType,
            	id = $composeApp.query.id,
	        	mid = $composeApp.query.mid,

	            ids = $composeApp.query.ids?$composeApp.query.ids.split(","):[]; //转发多封邮件会带多个id
	        if(pageType == this.pageTypes['COMPOSE'] && id == "2" && !top.ssoComposeHandled && composeType && mid){
		    	top.ssoComposeHandled = true; //只处理一次
		    	pageType = composeType;
		    }
		    self.sid = self.getSid();
		    self.set('pageType', pageType);
		    self.set('mid', mid);

		    self.set('ids', ids);
		    self.resourcePath = '/rm/coremail/';// todo 
		    self.PageState = this.PageStateTypes.Initializing;
			self.isChrome = $B.is.chrome;
			self.isFirefox = $B.is.firefox;
            //根据套餐显示最大上传文件大小
            if (top.SiteConfig.comboUpgrade) {
                self.maxUploadLargeAttach = Math.floor(top.$User.getCapacity("maxannexsize") / 1024) || 4;
            }
            self.tipWords['UPLOAD_LARGEATTACH'] = self.tipWords['UPLOAD_LARGEATTACH'].format(self.maxUploadLargeAttach);

            self.tabName = top.$App.getCurrentTab().name;

            var siteDomain = self.getTop().getDomain("mail").replace(location.protocol+'//','');
            var srcDomain = self.getTop().getDomain("resource").substring(13);

            self.regG2 = new RegExp('(g\d+).' + siteDomain, 'i');
            self.regApp = new RegExp('appmail[3]?.' + siteDomain, 'i');
            self.regSrc = new RegExp('image[0s]' + srcDomain, 'i');


            var TYPE = self.pageTypes;
            self.regRouter({
                matchs: [ TYPE.COMPOSE, TYPE.UPLOAD_LARGE_ATTACH ],
                onroute: function() {
                    var dataSet = self.get('initDataSet');
                    var queryObj = $composeApp.query;

                    dataSet.isShowVideoMail = Boolean(queryObj['videomail']);//视频邮件
                    dataSet.isShowTimeSet = Boolean(queryObj['timeset']) || $composeApp.inputData?$composeApp.inputData.timeset:'';//定时邮件
                    dataSet.scheduleDate = queryObj['timeset'] || $composeApp.inputData?$composeApp.inputData.timeset:'';//时间
                    dataSet.isShowSelectBox = Boolean(queryObj['showSelectBox']);//超大附件
                    dataSet.account = queryObj['userAccount'] || $composeApp.inputData?$composeApp.inputData.userAccount:'';//发信账号
                    dataSet.to = queryObj['receiver'] || $composeApp.inputData?$composeApp.inputData.receiver:'';//收件人 
                    dataSet.subject = queryObj['subject'] || $composeApp.inputData?$composeApp.inputData.subject:'';//主题
                    dataSet.content = queryObj['content'] || $composeApp.inputData?$composeApp.inputData.content:'';//正文
                    dataSet.template = queryObj['template'] || $composeApp.inputData?$composeApp.inputData.template:'';//邮件模板
                    dataSet.letterPaperId = queryObj['letterPaperId'] || $composeApp.inputData?$composeApp.inputData.letterPaperId:'';//信纸ID
                    dataSet.saveSentCopy = 1; // 保存到收件箱

                    self.set('isComposePageOnload', true);
                }
            });
        },

        /**
        * 注册页面路由，注意撰写邮件只会在一种状态下完成，
        * 所以没有多路由，而是提前分拣出唯一的处理状态。
        * 但单个状态，可以有个onroute函数队列顺序触发
        */
        regRouter: function (router) {
            var self = this;
            var pageType = self.get('pageType');

            var matchs = router.matchs;
            for (var i = 0; i < matchs.length; i++) {
                if (matchs[i] == pageType) {
                    self.handlerQueue.push(router.onroute);
                }
            }
        },

        routePage: function() {
            var self = this;
            var pageType = self.get('pageType');
            var handlerQueue = self.handlerQueue;
            for (var i = 0; i < handlerQueue.length; i++) {
                handlerQueue[i]({ pageType: pageType }, self);
                self.set('isComposePageOnload', true);
            }
        },

        // 初始化上传附件
        initUploadComponent : function(){
        	//初始化上传模块 upload_module.js
            upload_module.init(this); 
            //创建上传管理器 
            upload_module.createUploadManager();
        },

        callApi: M139.RichMail.API.call,
        /**
         * 根据回复类型 获取邮件信息
         * @param applyType 回复类型
         */
        replyMessage : function(replyType, callback){
        	if(typeof replyType !== 'string'){
        		console.log('replyMessage:回复类型请传递字符串!');
        		return;
        	}
    		var data = {
    			toAll : replyType === this.pageTypes['REPLYALL'] ? "1" : "0",
    			mid : this.get('mid'),
    			withAttachments : $T.Url.queryString("withAttach") == "true"? "1" : "0"
    		}
    		this.callApi("mbox:replyMessage", data, function(res) {
    			if(callback){
    				callback(res);
    			}
	        });
        },
        /**
         * 根据转发类型 获取邮件信息
         * @param applyType 转发类型
         */
        forwardMessage : function(pageType, callback){
        	if(typeof pageType !== 'string'){
        		console.log('forwardMessage:转发类型请传递字符串!');
        		return;
        	}
    		var data = this.getRequestDataForForward(pageType);
    		this.callApi("mbox:forwardMessages", data, function(res) {
    			if(callback){
    				callback(res);
    			}
	        });
        },
        forwardAttachs: function (pageType, callback) {
            if (typeof pageType !== 'string') {
                console.log('forwardMessage:转发类型请传递字符串!');
                return;
            }
            var data = top.FORWARDATTACHS;
            top.FORWARDATTACHS = null;
            this.callApi("mbox:forwardAttachs", data, function (res) {
                if (callback) {
                    callback(res);
                }
            });
        },
        //恢复草稿
        restoreDraft : function(callback){
        	var data = {
    			mid : this.get('mid')
    		}
    		this.callApi("mbox:restoreDraft", data, function(res) {
    			if(callback){
    				callback(res);
    			}
	        });
        },
        //编辑发送中的邮件再次发送
        editMessage : function(callback){
        	var data = {
    			mid : this.get('mid')
    		}
    		this.callApi("mbox:editMessage", data, function(res) {
    			if(callback){
    				callback(res);
    			}
	        });
        },

        setSubMailInfo : function(content, subject){
        	this.autoSaveTimer['subMailInfo']['content'] = content;
        	this.autoSaveTimer['subMailInfo']['subject'] = subject;
        },
        //创建自动存草稿定时器 todo 全局变量
        createAutoSaveTimer : function(){
        	var self = this;
    		self.autoSaveTimer['timer'] = setInterval(function(){
    			var isEdited = self.compare(true);
    			if (!isEdited) {
		            return;
		        } else {
		            mainView.saveMailCallback.actionType = self.actionTypes['AUTOSAVE'];
    				self.sendOrSaveMail(self.actionTypes['AUTOSAVE'], mainView.saveMailCallback);
		        }
    		}, self.autoSaveTimer['interval'] * 1000);
       },
       // 比较是否有改动
       compare : function(isSetSubMailInfo){
       		var self = this;
       		var cloneSubMailInfo = $.extend({}, self.autoSaveTimer['subMailInfo']);
       		if(isSetSubMailInfo){
       			self.setSubMailInfo(htmlEditorView.getEditorContent(), $("#txtSubject").val());
       			content = self.autoSaveTimer['subMailInfo']['content'];
			    subject = self.autoSaveTimer['subMailInfo']['subject'];
       		}else{
       			content = htmlEditorView.getEditorContent();
				subject = $("#txtSubject").val();
       		}

			if (content === cloneSubMailInfo['content'] && subject == cloneSubMailInfo['subject']) {
				return false;// 无改动
			}else{
				return true;// 有改动
			}
       },
       // 判断当前写信页是否为空白写信页
       isBlankCompose : function(){
       		var self = this;
   			if(self.addrInputManager.getAllEmails().length > 0 || $("#txtSubject").val() || htmlEditorView.getEditorContent() != self.defaultContent){
   				return false;
       		}else{
       			return true;
       		}
       },
       /**
         * 发送/保存 /自动保存邮件 
         */
        sendOrSaveMail: function (action, callback){
        	if(typeof action !== 'string'){
        		console.log('sendOrSaveMail:请传递字符串action！'+ action);
        		return;
        	}
        	var self = this;
        	if(action === self.actionTypes['AUTOSAVE'] || action === self.actionTypes['SAVE']){
        		clearInterval(self.autoSaveTimer['timer']);
            	self.createAutoSaveTimer();
        	}
        	mainView.buildMailInfo(action, callback);
		},
		// 回复全部操作应排除自己
		filterEmails : function (){
		    var uidList = top.$User.getUidList();
		    var popList = top.$App.getPopList();
		    var myAddrList = uidList.concat(popList);
		    var dataSet = this.get('initDataSet');
		    if(dataSet.to){
		        for(var i = 0,toLen = dataSet.to.length;i < toLen;i++){
		            for(var j = 0,myLen = myAddrList.length;j < myLen;j++){
		                if($Email.compare(dataSet.to[i], myAddrList[j])){
		                    dataSet.to.splice(i, 1);
		                    i--;
		                    break;
		                }
		            }
		        }
		    }
		    if(dataSet.cc){
		        for(var m = 0;m < dataSet.cc.length;m++){
		            for(var n = 0;n < myAddrList.length;n++){
		                if($Email.compare(dataSet.cc[m], myAddrList[n])){
		                    dataSet.cc.splice(m, 1);
		                    m--;
		                    break;
		                }
		            }
		        }
		    }
		},
		/**
		 * 获取需要发送的数据
		 * @param action    continue:  继续编辑 
		 *					autosave:  自动保存
		 *					save :     存原稿并继续编辑
		 *					deliver：   立即发送邮件
		 */
		getRequestDataForSend : function(action){
			var returnInfo = 1;
			if(action === this.actionTypes['CONTINUE']){
				returnInfo = 0;
			}
			return {
				"attrs": this.mailInfo,
				"action": action,
				"replyNotify": $("#replyNotify")[0].checked ? 1 : 0,
				"returnInfo": returnInfo
			}
		},
		/**
		 * 获取需要发送的数据 todo 收件箱转发多封邮件
		 * @param pageType  FORWARD: 转发
		 *					FORWARDASATTACH: 作为附件转发 
		 */
		getRequestDataForForward : function(pageType){
			var self = this;
			var data = {};
			if(pageType === this.pageTypes['FORWARD']){
				data.mode = 'quote';
				data.ids = [self.get('mid')];
				data.mid = self.get('mid');
			}else if(pageType === this.pageTypes['FORWARDASATTACH'] || pageType === this.pageTypes['FORWARDMORE']){
				data.mode = 'attach';
				data.ids = self.get('ids');
			}else{
				console.log('不支持的参数值：'+pageType);
			}
    		return data;
		},
		/**
		 * 根据操作类型获取提示语
		 * @param action 
		 */
		getTipwords : function(action){
			if(action === this.actionTypes['AUTOSAVE']){
				return this.tipWords['AUTO_SAVE_SUC'];
			}else if(action === this.actionTypes['SAVE']){
				return this.tipWords['SAVE_SUC'];
			}else{
				return '';
			}
		},
        /**
         * 获取签名图片列表
         * 电子名片服务器不能访问,暂时替换,等后台更改了可删除
         */
        handlerSignImags: function() {
            var letterDoc = htmlEditorView.editorView.editor.editorWindow.document;
            if (!letterDoc) return;

            var src, arrSignImg = [], imgs = letterDoc.getElementsByTagName('IMG');
            for (var i = imgs.length - 1; i >= 0; i--) {
                if ( 'signImg' == imgs[i].getAttribute('rel') ) {
                    src = imgs[i].src;
                    if (0 > src.indexOf('attach:getAttach')) {
                        src = this.replaceSignImgsSrc(src);
                        arrSignImg.push($T.Xml.encode(src));
                        imgs[i].src = src;
                    }
                }
            }

            return arrSignImg;
        },

        //电子名片服务器不能访问,暂时替换,等后台更改了可删除
        RESRCIP: "172.16.172.171:2080",
        G2DOMAIN: "$1.api.localdomain",

        replaceSignImgsSrc : function(content){
            var _this = this;
            return content.replace(_this.regApp, _this.RESRCIP).replace(_this.regSrc, _this.RESRCIP).replace(_this.regG2, _this.G2DOMAIN);
        },
        getTop: function () {
            return M139.PageApplication.getTopAppWindow();
        },
        /**
        *获取SID值
        */
        getSid: function () {
            var sid = top.$T.Url.queryString("sid");
            return sid;
        },
		// 获取写信会话ID 只需要获取一次
        requestComposeId : function(callback){
        	var self = this;
			
			if(window.composeId){
				self.composeId = window.composeId;
			}			
			
        	if(self.composeId){
		        if(callback){
		        	callback();	
		        }
		    }else{
	        	this.callApi("mbox:getComposeId", null, function(res) {
		            if (res.responseData['code'] == 'S_OK') {
                        if(!self.composeId){
                        	self.composeId = res.responseData['var'];
                        }
                        if(callback){
	            			callback();
	            		}
		            }
		        });
	       }
        },
        getAttachUrl : function(fileId, fileName, fullUrl) {
        	var sid = this.getSid();
		    var url = "/RmWeb/view.do?func=attach:getAttach&sid="+sid+"&fileId="+fileId + "&fileName=" + encodeURIComponent(fileName);
		    if(fullUrl)url = "http://" + location.host + url;
		    return url;
		},
		// 主题颜色管理器
		subjectColorManager : {
		    maps: {
		        0: { color: "#000000", title: "黑色" },
		        1: { color: "#FF0000", title: "红色" },
		        2: { color: "#FF9800", title: "橙色" },
		        3: { color: "#339A67", title: "绿色" },
		        4: { color: "#2D5AE2", title: "蓝色" },
		        5: { color: "#7F0081", title: "紫色" }
		    },
		    getColorName: function (number) {
		        var maps = this.maps;
		        var item = maps[number];
		        if (!item) item = maps[0];
		        return item.title;
		    },
		    getColor: function (number) {
		        var maps = this.maps;
		        var item = maps[number];
		        if (!item) item = maps[0];
		        return item.color;
		    },
		    getColorList: function () {
		        var maps = this.maps;
		        var result = [];
		        var i = 0;
		        while (true) {
		            if (!maps[i]) break;
		            result.push(maps[i]);
		            i++;
		        }
		        return result;
		    }
		},
		// 投递/定时 邮件操作成功后将部分邮件信息保存到顶级窗口的sendList变量中
		modifySendList : function(result){
			var self = this;
            var mid = result.responseData["var"] && result.responseData["var"]["mid"];
            var tid = result.responseData["var"] && result.responseData["var"]["tid"];
            //跳转到发送完成页
            var topArray_To = new top.Array(); //页面被销毁的时候 数组对象不可用
            var topArray_CC = new top.Array();
            var topAttay_BCC = new top.Array();
            topArray_To = topArray_To.concat($T.Email.getMailListFromString(self.mailInfo.to));
            topArray_CC = topArray_CC.concat($T.Email.getMailListFromString(self.mailInfo.cc));
            topAttay_BCC = topAttay_BCC.concat($T.Email.getMailListFromString(self.mailInfo.bcc));
            var sendMailInfo = {
                to: topArray_To,
                cc: topArray_CC,
                bcc: topAttay_BCC,
                subject: self.mailInfo.subject,
                action: 'deliver',
                saveToSendBox: self.mailInfo.saveSentCopy,
                mid: mid,
                tid: tid
            };
            if (self.mailInfo.scheduleDate) sendMailInfo.action = "schedule"; //定时邮件的action rm 兼容 cm，发信成功页使用
            top.$App.getCurrentTab().data.sendList = new top.Array();
            top.$App.getCurrentTab().data.sendList.push(sendMailInfo);
		},
		// 根据用户选择的日期返回日期提示语
		getDateTipwords : function(calendar){
			var today = $Date.format('yyyy-MM-dd', new Date());// 今天
			var tomorrow = $Date.format('yyyy-MM-dd',$Date.getDateByDays(new Date(), 1)); // 明天
			var dayAfterTomorrow = $Date.format('yyyy-MM-dd',$Date.getDateByDays(new Date(), 2));// 后天
			var thisSunday = $Date.format('yyyy-MM-dd',$Date.getWeekDateByDays(6));// 本周日
			var nextSunday = $Date.format('yyyy-MM-dd',$Date.getWeekDateByDays(13));// 下周日
			var msg = '';
			if(calendar === today){
				msg = '今天';
			}else if(calendar === tomorrow){
				msg = '明天';
			}else if(calendar === dayAfterTomorrow){
				msg = '后天';
			}else if(calendar > dayAfterTomorrow && calendar <= thisSunday){
				msg = '本周' + this._getWeek(calendar);
			}else if(calendar > thisSunday && calendar <= nextSunday){
				msg = '下周' + this._getWeek(calendar);
			}else{
				msg = calendar;
			}
			return msg;
		},
		// 获取星期几
		_getWeek : function(calendar){
			var week = $Date.getChineseWeekDay($Date.parse(calendar.trim() + ' 00:00:00'));
			return week.substr(2,1); 
		},
		// 根据用户选择的时间返回时间提示语
		getTimeTipwords : function(time){
			var tempArr = time.split(':');
			var hour = parseInt(tempArr[0].trim(), 10);
			var now = new Date();
			var hello = $Date.getHelloString(new Date(now.setHours(hour)));
			var msg = '';
			if(hour <= 12){
				msg = hello + time;
			}else{
				msg = hello + (hour - 12) + ':' + tempArr[1];
			}
			return msg;
		},
		/**
		 * 根据服务端返回的JS代码解析出文件对象
		 * @param html 调用上传接口后服务端返回的js代码
		 * return 文件对象
		 */
		getReturnObj : function(html){
			if($.type(html) !== "string"){
				return null;
			}
			var returnObj = null;
	        var reg = /'var':([\s\S]+?)\};<\/script>/i;
	        if (html.indexOf("'code':'S_OK'") > 0) {
	        	returnObj = {};
	        	var m = html.match(reg);
	            var result = eval("(" + m[1] + ")");
	            returnObj.fileId = result.fileId;
	         	returnObj.fileName = result.fileName;
	        }
	        return returnObj;
		},
		// 地址输入框管理器
		addrInputManager : {
		    /**
		     * 向地址输入框实例插入邮件地址
		     * @param richInput  RichInput实例
		     * @param items 邮件地址列表 如果传入的是字符串则转成数组
		     * @return
		     */
		    addMail: function(richInput, items) {
		   		if(!(richInput instanceof M2012.UI.RichInput.View)){
		   			console.log('请传入RichInput实例对象');
		   			return;
		   		}
		        if ($.type(items) === "string") items = [items];
		        for (var i = 0,len = items.length; i < len; i++) {
		            richInput.insertItem(items[i]);
		        }
		    },
		    removeMail: function(richInput, list) {
		        if ($.type(list) === "string") list = [list];
		        var items = richInput.getItems();
		        for (var i = 0; i < items.length; i++) {
		            var richInputItem = items[i];
		            for (var j = 0; j < list.length; j++) {
		                if (richInputItem.allText == list[j]) {
		                    richInputItem.remove();
		                    break;
		                }
		            }
		        }
		    },
		    addMailToCurrentRichInput: function(addr) {
		        if (!addrInputView.currentRichInput){
		        	addrInputView.currentRichInput = addrInputView.toRichInput;
		        }
		        addrInputView.currentRichInput.insertItem(addr);
		        return addrInputView.currentRichInput;
		    },
		    getAllEmails: function() {
		        var a1 = addrInputView.toRichInput.getValidationItems();
		        var a2 = addrInputView.ccRichInput.getValidationItems();
		        var a3 = addrInputView.bccRichInput.getValidationItems();
		        return a1.concat(a2).concat(a3);
		    }
		},
		// 获取大附件下载地址
		mailFileSend : function(files, callback){
			var xmlStr = this.getXmlStr(files);
			var data = {
        		xmlStr : xmlStr
        	}
    		this.callApi("file:mailFileSend", data, function(res) {
    			if(callback){
    				callback(res);
    			}
	        });
		},
		// 获取大附件下载地址时需拼装xml格式的请求参数
		getXmlStr : function(files){
			var requestXml = '';
		    requestXml += "<![CDATA[";
		    requestXml += '<Request>';
		    var quickItems = [];
		    var netDiskXML = "";
		    for (var i = 0; i < files.length; i++) {
		        var file = files[i];
		        if (file.fileType == "netDisk") {
		        	var tempStr = "<File><FileID>{0}</FileID><FileName>{1}</FileName><FileGUID>{2}</FileGUID><FileSize>{3}</FileSize></File>";
		        	netDiskXML += $T.Utils.format(tempStr, [file.fileId, $T.Xml.encode(file.fileName), file.fileGUID, file.fileLength]);
		        } else {
		        	quickItems.push(file.uploadId || file.fileId)
		        }
		    }
		    if(quickItems.length > 0){
		    	requestXml += "<Fileid>" + quickItems.join(",") + "</Fileid>";
		    }
		    if(netDiskXML){
		    	requestXml += "<DiskFiles>" + netDiskXML + "</DiskFiles>";
		    }
		    requestXml += '</Request>';
		    requestXml += "]]>";
		    return requestXml;
		},
		//根据coremail的错误代码返回提示语句
		getErrorMessageByCode : function (action, code, data){
		    var actionList = {
		        "attach": {
		            "FA_ATTACH_EXCEED_LIMIT": "上传失败，附件大小超出限制",
		            "FA_UPLOAD_SIZE_EXCEEDED": "上传失败，附件大小超出限制"
		        },
		        "saveMail": {
		        	"FA_ATTACH_EXCEED_LIMIT":"发送失败，附件/信件大小超过邮箱限制",
		            "FA_OVERFLOW": "附件/信件大小超出邮箱限制,无法保存草稿"
		        },
		        "sendMail": {
		        	"FA_ATTACH_EXCEED_LIMIT":"发送失败，附件/信件大小超过邮箱限制",
		            "FA_OVERFLOW": "发送失败，附件/信件大小超过邮箱限制",
		            "FA_INVALID_ACCOUNT": "发送失败，FA_INVALID_ACCOUNT(发件人数据异常)",
		            "FA_INVALID_PARAMETER": "发送失败，FA_INVALID_PARAMETER(发件人数据异常)",
		            "FA_ID_NOT_FOUND":"请勿重复发送(邮件可能已发出，但由于网络问题服务器没有反馈，请到发件箱确认)",
		            "FA_WRONG_RECEIPT":"收件人地址格式不正确，请修改后重试",
		            "FS_UNKNOWN": "发送失败，请重新发送",
		            "FA_REDUNDANT_REQUEST":"邮件正在发送中，请稍候",
		            "FA_IS_SPAM":"您的邮件发送失败，原因可能是：<br>1、  你超出了单天发送邮件封数的限制。<br>2、  你发送的邮件包含广告内容等不良信息。"
		        }
		    };
		    if(action=="sendMail" && code=="FA_INVALID_ACCOUNT" && isThirdAccountSendMail()){
		        return "第三方账号发信失败，请确认账号密码以及POP服务器地址设置正确。<a hideFocus=\"1\" href=\"javascript:top.$App.show(\"account\")\">管理账号&gt;&gt;</a>";
		    }
		    if(actionList[action] && actionList[action][code]){
		        return actionList[action][code];
		    }
		    function isThirdAccountSendMail(){
		        if(data && data.account){
                    return !top.$App.isLocalDomainAccount(data.account)
		        }
		        return false;
		    }
		    return "";
		},
		//自适应   调整编辑器高度
		adjustEditorHeight : function(height){
			var c = $("#htmlEdiorContainer div.eidt-body");
			var h = c.height() + height;
			h = parseInt(h);
			if(h < self.editorMinHeight){
				h = self.editorMinHeight;
			}
			c.height(h);
		},
		//todo 匹配通讯录联系人
		getEamils : function(str){
		    //str = str.replace(/\"/g,'');
		    if(!str){
		    	return '';
		    }
		    var arr = str.split(",");
	        var emails = [];
	        for(var i = 0, len = arr.length; i < len; i++){
	            var email = arr[i];
	            var nextemail = arr[i+1];
	            if(email && nextemail){
	                var emailObj = top.Utils.parseSingleEmail(email);
	                if(!$T.Email.isEmailAddr(emailObj.all)){
	                    arr[i] = email + " " + nextemail;
	                    arr.splice(i + 1, 1);
	                    i--;
	                }
	            }
	        }
	        for(var j = 0, l = arr.length; j < l; j++){
	            emails.push(getNameByEmail(arr[j]));
	        }
	        return emails.join(',');
		    
		    // 根据邮箱地址获取发件人姓名（查询通讯录）
		    function getNameByEmail(text){
		    	if(!text) return;
		    	if(text.indexOf('<') == 0){
		    		text = text.replace(/</,'"<').replace(/></,'>"<');
		    	}
		    	//console.log(text);
			    var obj = $T.Utils.parseSingleEmail(text);
			    var prefix = obj.addr.split('@')[0];
			    var contact = top.Contacts.getSingleContactsByEmail(obj.addr);
			    if(contact){
			        var name = contact.name;
			        if(name == prefix || (contact.MobilePhone && contact.MobilePhone == name)){ //排除未完善联系人
			            return text;
			        }else{
			            return '"' + name.replace(/\"/g,'') + '"' + '<' + obj.addr + '>';
			        }
			    }else{
			        return text;
			    }
		    }
		},
		
		// 切换到当前写信页签
		active : function(){
			var self = this;
			var tabName = self.tabName;
			if(tabName && tabName.indexOf('compose') != -1){
				top.$App.activeTab(tabName);
			}
		},
		
		// 选择文件组件返回的文件列表统一数据结构
		transformFileList : function(fileList){
			if(!$.isArray(fileList)){
				return fileList;
			}
			var self = this;
			var files = [];
			for(var i = 0,len = fileList.length;i < len;i++){
				var file = fileList[i];
				files.push(self.getFileByComeFrom(file));
			}
			return files;
		},
        //在回复和转发时把fileSize改为base64后的值
		fixBase64FileSize: function () { //当回复和转发时，mbox:compose接收的attachments数组中的fileSize是base64后的值。
		    var attachs = this.composeAttachs;
		    if (attachs.length > 0) {
		        for (var i = 0; i < attachs.length; i++) {
		            if (attachs[i].base64Size) {
		                attachs[i].fileSize = attachs[i].base64Size;
		            }
		        }
		    }
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
        /**
         *ie9以上支持客户端压缩报文
         */
		isSupportCompressRequest: function () {
		    if (window.FormData || ($B.is.ie && $B.getVersion() >= 9)) {
		        return true;
		    } else {
		        return false;
		    }
		},
        /**
         *加载压缩脚本的类库
         */
		loadCompressLib: function () {
		    var tag = "rawdeflateScript";
		    if (!document.getElementById(tag)) {
		        M139.core.utilCreateScriptTag({
		            id: tag,
		            src: "/m2012/js/richmail/compose/rawdeflate.js",
		            charset: "utf-8"
		        });
		    }
		}
    }));
})(jQuery,Backbone,_,M139);