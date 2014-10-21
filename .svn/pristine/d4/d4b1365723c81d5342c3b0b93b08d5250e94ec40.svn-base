/**
* @fileOverview 写信附件列表视图层.
* @namespace 
*/
(function (jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Compose.View.HtmlEditor', superClass.extend(
		/**
		*@lends M2012.Compose.View.HtmlEditor.prototype
		*/
	{
		el: "body",
		name : "htmlEditor",
		events: {
		},
		initialize: function (options) {
			this.model = options.model;
			var self = this;
			var editor;
			this.editorView = M2012.UI.HTMLEditor.create({
				contaier:$("#htmlEdiorContainer"),
				blankUrl:"../html/editor_blank.htm?sid="+top.sid,
				isShowSetDefaultFont:true
			});

			editor = this.editorView.editor;

			this.editorView.on("buttonclick", function(e){
				switch (e.command ) {
					case "Voice":
						if (!self.EditorVoiceInstance) {
							self.EditorVoiceInstance=VoiceInput.create({
								autoCreate: true,
								button: $(e.target),
								from: "editor",
								onComplete: function (text) {
									editor.insertHTML(text);
									setTimeout(function () {
										editor.editorWindow.focus();
									}, 200);
								}
							});
							
						} else {
							self.EditorVoiceInstance.render();
						}
						break;
				}
			});

			editor.on("before_send_mail", function(e){
				var insertedMarks = $(editor.editorDocument).find(".inserted_Mark");
				insertedMarks.hide();
			});

			editor.on("mousedown", function (e) {
				if($B.is.ie){
					var ele = e.target;
					self.ieImgel = null;
					self.ieTableEl = null;
					if(ele.tagName == 'IMG'){
						self.ieImgel = $(ele);
					}else if(ele.tagName == 'TABLE'){
						self.ieTableEl = $(ele);
					}
				}
				if(e.button == 2){ //右键
					self.isRight = true;
				}else{
					self.isRight = false;
				}
			});
			
			editor.on("paste", function (e) {
				if(self.isRight){
					paste(e); //右键粘贴
				}
			});

			editor.on("keydown", function (e) {
				if (e.ctrlKey && e.keyCode == M139.Event.KEYCODE.V) {
					paste(e);
				}else if(e.ctrlKey && e.keyCode == M139.Event.KEYCODE.ENTER){
					$("#topSend").click();
				}else if(e.keyCode == M139.Event.KEYCODE.BACKSPACE){ //ie浏览器选中图片时，按退格会退出到登录页，但实际是想删除图片
					if(self.ieImgel){
						self.ieImgel.remove();
						self.ieImgel = null;
						return false;
					}
					if(self.ieTableEl){
						self.ieTableEl.remove();
						self.ieTableEl = null;
						return false;
					}
				}
			});

			function paste(e) {
				editor.markFont();
				try {
					e.returnValue = window.captureClipboard();
					if(e.returnValue === false){
						top.$Event.stopEvent(e);
					}

					setTimeout(function(){
						editor.resetTextSizeForIe();
					}, 50);
				} catch (e) {
					var content = self.getEditorContent() || '';
					setTimeout(function(){
						var newContent = self.getEditorContent() || '';
						if(content == newContent && $B.is.windows && window.navigator.platform != "Win64"){
							M139.Plugin.ScreenControl.isScreenControlSetup(true);
						}
						editor.resetTextSizeForIe();
					},50);
				}
			}

			return superClass.prototype.initialize.apply(this, arguments);
		},
		// 渲染编辑器 
		render : function(pageType, dataSet){
			var self = this;
			var editor = self.editorView.editor;
			// 编辑器空白iframe添加tabindex属性
			editor.frame.tabIndex = 5;
			$(window).resize(function(){
				self._initEditorHeight();
				self._initRightContactHeight();
				$("#divLetterPaper").is(":visible") && mainView.showPaperFrame();
			});

			// 自适应 初始化编辑器高度
			self._initEditorHeight();
			self._initRightContactHeight();

			// todo 该判断是否可移到组件内部？
			if(editor.isReady){
				renderEditor(pageType, dataSet);
			}else{
				editor.on("ready", function(e){
					renderEditor(pageType, dataSet);
				});
			}
			function renderEditor(pageType, dataSet){
				if (dataSet.content || dataSet.html || dataSet.text) {
					var htmlContent = dataSet.content || (dataSet.html && dataSet.html.content) || (dataSet.text && dataSet.text.content);
					if (Number(dataSet.isHtml) == 0) {
						htmlContent = top.$T.Utils.htmlEncode(htmlContent).replace(/\r?\n/g, "<br />");
					}
					if (pageType == "reply" || pageType == "replyAll" || pageType == "forward") {
						htmlContent = htmlContent;
					}
					if (pageType == "compose" || pageType == "draft" || pageType == "resend") {
						self.setEditorContent(htmlContent);
					} else {
						editor.addReplyContent(htmlContent);
					}
				}else{ //会话邮件回复切换到写信
					var htmlContent = top.$App.getSessionDataContent();
					self.setEditorContent(htmlContent);
				}

				// 加载指定信纸
				if(dataSet.letterPaperId){
					mainView.showPaperFrame();
					var readyStr = "$('#frmLetterPaper')[0].contentWindow && $('#frmLetterPaper')[0].contentWindow.letterPaperView";
					M139.Timing.waitForReady(readyStr, function(){
						$('#frmLetterPaper')[0].contentWindow.letterPaperView.setPaper('', null, dataSet.letterPaperId);
					});
				}

				if(dataSet.template){
					//根据邮件模板设置邮件正文
					(function setContentByTemplate(template, content){
						var url = "/m2012/js/compose/template/" + template + ".js";
						M139.core.utilCreateScriptTag(
							{
								id: template,
								src: url,
								charset: "utf-8"
							},
							function () {
								var templateHtml = top.$App.composeTemplate;
								content = $T.format(templateHtml, {content: content || ""});
								self.setEditorContent(content);
							}
						);
					})(dataSet.template, dataSet.content);
				}
				// 加载签名
				self._loadSign(pageType);
				if(pageType == 'uploadLargeAttach'){
					$("#aLargeAttach").click();
				}
				if(pageType != self.model.pageTypes.VCARD && pageType != self.model.pageTypes.CUSTOM) {
					editor.setDefaultFont(top.$User.getDefaultFont());
				}
				self.model.autoSaveTimer['subMailInfo']['content'] = self.getEditorContent();
				self.model.defaultContent = self.getEditorContent();

				//使编辑区也支持拖放文件
				var editorBody = editor.editorDocument.body;
				if(editorBody.addEventListener) {
					editorBody.addEventListener("dragenter", _dragenter, false);
					editorBody.addEventListener("dragover", _dragover, false);
					editorBody.addEventListener("drop", _drop, false);
				}
				// 显示图片小工具
				top.$App.showImgEditor($(editorBody));
			}
		},

		_getEditorBody:function(){
			if (!this.divEdBody) {
				this.divEdBody = $("#htmlEdiorContainer div.eidt-body");
			}
			return this.divEdBody;
		},

		// 自适应 初始化编辑器高度
		_initEditorHeight : function(){
			var self = this;
			var composeIframe = window.frameElement;
			var extraHeight = 59 + 26 + 10;		// 底部按钮栏高度 + 编辑工具栏高度 + 空白误差
			if ($("#moreOptions").is(":visible")) {
				extraHeight += 28;
			}
			var divEdBody = this._getEditorBody();
			var height = parseInt(composeIframe.style.height) - divEdBody.offset().top - extraHeight;
			if(height < self.model.editorMinHeight){
				height = self.model.editorMinHeight;
			}
			divEdBody.height(height);
		},

		//右侧通讯录与写信页齐高
		_initRightContactHeight: function () {
			var divAddr = $("#divAddressList");
			// 使用了fix定位，必须通过iframe高度来计算
			var composeIframe = window.frameElement;
			var mainHeight = $(composeIframe).height();
			var height = mainHeight - 144 - 35;
			var groupList = divAddr.find('.GroupList');
  
			if (groupList.height() != height) {
				groupList.height(height);
				divAddr.find('.searchEnd').height(height);	// 搜索结果列表
			}
		},

		// 加载签名
		_loadSign : function(pageType){
			var self = this;
			var signTypes = "|compose|uploadLargeAttach|reply|replyAll|forward|forwardAsAttach|forwardAttachs|forwardMore";
			if (signTypes.indexOf('|'+pageType+'|') >= 0) {
				self._setDefaultSign();
			}
		},

		// 设置默认签名
		_setDefaultSign : function(){
			var self = this;
			var signList = top.$App.getSignList();
			for (var i = 0,len = signList.length; i < len; i++) {
				var signItem = signList[i];
				if (signItem.isDefault) {
					if(signItem.type == 1){ //我的电子名片签名需获取最新的用户信息
						self.createVcardSign(3, signItem.id, signItem.isDefault,signItem.isAutoDate);
					}else{
						self.editorView.editor.setSign(M139.Text.Html.decode(signItem.content));
					}
					break;
				}
			}
		},
		//生成我的电子名片签名
		createVcardSign : function(opType,id,isDefault,isAutoDate){
			var self = this;
			//top.M139.UI.TipMessage.show('正在获取电子名片信息');
			M2012.Contacts.getModel().getUserInfo({}, function(result){
				var userInfo = {};
				if(result.code === 'S_OK'){
					userInfo = result['var'];
				}else{
					console.log("M2012.Contacts.getModel().getUserInfo 获取用户信息失败！result.code:"+result.code);
					top.M139.UI.TipMessage.hide();
					/*
					userInfo = {
						name : 'helloworld',
						FavoWord : '自强不息，奋斗不止！',
						UserJob : 'web前端开发',
						CPName : '彩讯科技',
						CPAddress : '长虹大厦',
						FamilyEmail : 'tkh@139.com',
						MobilePhone : '1500000000',
						OtherPhone : '1510000000',
						BusinessFax : '458788',
						CPZipCode : '1546'
					};*/
				}
				//top.M139.UI.TipMessage.show('正在生成电子名片');
				var items = ['user:signatures']; //添加电子签名
				items[1]  = {
					'opType'	 : opType, //opType，1:增加，2:删除，3:修改
					'id'		 : id,
					'title'	  : '我的电子名片',//签名名称
					'content'	: self._getVcardContent(userInfo,isAutoDate),//签名内容 
					'isHtml'	 : 1,//是否是HTML格式
					'isDefault'  : isDefault,//是否是默认签名档
					'isAutoDate' : 0,//1：自动加入 0：不加入默认为0，不自动加入写信日期
					'isSMTP'	 : 0,//是否在smtp信件中追加签名   1:是 0:否默认为0，不在smtp中追加签名
					'type'	   : 1 //签名的类型，0：用户自定义的签名   1: 我的电子名片签名(通讯录)
				};
				items[2] = 'user:getSignatures';
				items[3] = null;
				self.editorView.editor.setSign(items[1].content);
				//top.M139.UI.TipMessage.hide();
				
				self.model.autoSaveTimer['subMailInfo']['content'] = self.getEditorContent();
				self.model.defaultContent = self.getEditorContent();
			});
		},
		//我的电子名片签名内容
		_getVcardContent : function(userInfo,isAutoDate){
			var imgSrc = this._getContactImage(userInfo.ImageUrl);
			var encode = M139.Text.Html.encode;
			var contentArr = [
				'<table border="0" style="width:auto;font-family:\'宋体\';font-size:12px;border:1px solid #b5cbdd;-webkit-border-radius:5px;line-height:21px;background-color:#f8fcff;flaot:left;">',
				'<tbody>',
				'<tr>'
			];
			contentArr.push('<td style="vertical-align:top;padding:5px;"><img rel="signImg" width="96" height="96" src="'+imgSrc+'"></td>');
			contentArr.push('<td style="padding:5px;">');
			contentArr.push('<table style="font-size:12px;line-height:19px;table-layout:auto;">');
			contentArr.push('<tbody>');
			if(userInfo.AddrFirstName) contentArr.push('<tr><td colspan="2"><strong id="dzmp_unm" style="font-size:14px;">'+encode(userInfo.AddrFirstName)+'</strong></td></tr>');
			if(userInfo.FavoWord) contentArr.push('<tr><td colspan="2" style="padding-bottom:5px;">'+encode(userInfo.FavoWord)+'</td></tr>');
			if(userInfo.UserJob) contentArr.push('<tr><td>职务：</td><td>'+encode(userInfo.UserJob)+'</td></tr>');
			if(userInfo.CPName) contentArr.push('<tr><td >公司：</td><td>'+encode(userInfo.CPName)+'</td></tr>');
			if(userInfo.CPAddress) contentArr.push('<tr><td >地址：</td><td>'+encode(userInfo.CPAddress)+'</td></tr>');
			if(userInfo.FamilyEmail) contentArr.push('<tr><td >邮箱：</td><td>'+encode(userInfo.FamilyEmail)+'</td></tr>');
			if(userInfo.MobilePhone) contentArr.push('<tr><td >手机：</td><td>'+encode(userInfo.MobilePhone)+'</td></tr>');
			if(userInfo.OtherPhone) contentArr.push('<tr><td >电话：</td><td>'+encode(userInfo.OtherPhone)+'</td></tr>');
			if(userInfo.BusinessFax) contentArr.push('<tr><td >传真：</td><td>'+encode(userInfo.BusinessFax)+'</td></tr>');
			if(userInfo.CPZipCode) contentArr.push('<tr><td >邮编：</td><td>'+encode(userInfo.CPZipCode)+'</td></tr>');
			if(isAutoDate) contentArr.push('<tr><td >日期：</td><td>'+$Date.format("yyyy年MM月dd日 星期w",new Date())+'</td></tr>');
			contentArr.push('</tbody></table></td></tr></tbody></table>');
			return contentArr.join('');
		},
		//获取联系人头像地址
		_getContactImage : function(imgurl){
			var imgUrlLowerCase, result;
			var sysImgPath = this.model.sysImgPath;

			result = "/m2012/images/global/face.png";
			if(imgurl) {
				imgUrlLowerCase = imgurl.toLowerCase();
				if(imgUrlLowerCase != sysImgPath[0] && imgUrlLowerCase != sysImgPath[1]){
					if(/^https?:\/\//.test(imgUrlLowerCase)) {
						result = $T.Html.encode(imgurl);
					} else {
						result = top.getDomain('resource') + $T.Html.encode(imgurl);
					}
				}
			}
			return result;
		},
		// todo 直接获取内容
		getEditorContent : function () {
			if (this.editorView.editor.isHtml) {
				return this.editorView.editor.getHtmlContent();
			} else {
				return this.editorView.editor.getTextContent();
			}
		},
		//得到编辑器内容(纯文本)
		getTextContent: function () {
			return this.editorView.editor.isHtml ? this.editorView.editor.getHtmlToTextContent() : this.editorView.editor.getTextContent();
		},
		setEditorContent : function (content) {
			if (this.editorView.editor.isHtml) {
				return this.editorView.editor.setHtmlContent(content);
			} else {
				return this.editorView.editor.setTextContent(content);
			}
		},
		// 用户未上传附件验证正文/主题是否提到附件
		checkContent : function(event){
			var self = this;
			var isContinue = false;
			var noAttach = uploadManager.fileList.length == 0 && Arr_DiskAttach.length == 0;
			if(noAttach){
				var content = self.getEditorContent() || '';
				content = content.split("replySplit")[0];
				
				var subject = self.model.autoSaveTimer['subMailInfo']['subject'];
				var newSubject = $("#txtSubject").val();
				
				if (content.indexOf("附件") >= 0 || (subject != newSubject && newSubject.indexOf("附件") >= 0)) {
					if(M139.UI.Popup.currentPopup){
						M139.UI.Popup.currentPopup.close();
					}
					var target = subjectView.getPopupTarget(event);
					var popup = M139.UI.Popup.create({
						target : target,
						icon : "i_ok",
						width : 300,
						buttons : [{
							text : "确定",
							cssClass : "btnSure",
							click : function() {
								mainView.sendMail();
								popup.close();
							}
						}, {
							text : "取消",
							click : function() {
								popup.close();
							}
						}],
						content : self.model.tipWords['LACK_ATTACHMENTS']
					});
					popup.render();
					
				}else{
					isContinue = true;
				}
			}else{
				isContinue = true;
			}
			return isContinue;
		},

		/**
		 * 截屏, 向下兼容
		 * 有可能打开页面时不支持，但是后来安装了。
		 * 如果控件成功被创建，则该函数会被覆盖掉
		 */
		captureScreen : function(){
			if(upload_module_multiThread.isSupport() || M139.Plugin.ScreenControl.isScreenControlSetup(true)){
				upload_module_multiThread.init(true);
				if(captureScreen != arguments.callee){
					captureScreen();
				}
			}
		}
	}));
})(jQuery, _, M139);
