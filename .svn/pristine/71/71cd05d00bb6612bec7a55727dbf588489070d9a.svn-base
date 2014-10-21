/**
 * @fileOverview 写信主题视图层.
 *@namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Compose.View.Subject', superClass.extend(
	/**
	 *@lends M2012.Compose.View.prototype
	 */
	{
	    el: "#subjectColor",
		name : "subject",
		initialize : function(options) {
			this.model = options.model;
			this.initEvents();
			this.colorData = this.model.subjectColorManager.getColorList();
			this._loadColorTable(this.colorData);
			//this._initSubjectColor();
			return superClass.prototype.initialize.apply(this, arguments);
		},
		initEvents: function () {
		    var self = this;
		    var type = self.model.get('pageType');
		    // 你知道吗？
		    // 因为产品要求标题栏在blur的时候要利用输入的标题重置标签名称
		    // 你知道吗？
		    // top.$App.setTitle实际上直接作用于当前标签页
		    // 所以问题来了……
		    // 当我们切换标签触发blur的时候，当前标签已经改变了
		    // so
		    // 不能直接用top.$App.setTitle
		    // 而是调用top.$App.getView("tabpage").setTitle(subject, self.moduleName)
		    // so
		    // 我在这里保存了当前的moduleName
		    // 
		    // yeshuo
		    self.moduleName = top.$App.getCurrentTab().name;
			$("#txtSubject").focus(function(){
				$("#divSubject").addClass('writeTable-txt-on');
			}).blur(function(){
				$("#divSubject").removeClass('writeTable-txt-on');
				// 用标题设置tab
				var subject = $.trim($(this).val());
				if (!subject) {
					switch(type){
						case 'reply':
						case 'replyAll':subject = '回复';break;
						case 'forward':
						case 'forwardAsAttach':subject = '转发';break;
						default: subject = '写信';
					}
				}
				top.$App.getView("tabpage").setTitle(subject, self.moduleName);
			});
			$("#divSubject div.theme-select").click(function (e) {
			    self.showColorTable(e);
			});
		},
		// 加载主题颜色选择框
		_loadColorTable : function(data) {
			var colorItems = this.$("li");
			if(colorItems.size() > 0) {
				return;
			}
			var self = this;
			var items = [];
			for (var i = 0, len = data.length; i < len; i++) {
			    var colorTitle = self.model.subjectColorManager.getColorName(i);
			    var html = ['<li onclick="subjectView.selectColor(this)"><a><span class="theme-i theme0', i + 1, '"><i class="i_xgg"></i></span>', colorTitle, '</a></li>'].join('');
			    items.push(html);
			}
			this.$("ul")[0].innerHTML = items.join("");
		},
		// 初始化用户上次保存的主题颜色
		/*_initSubjectColor : function() {
			var index = top.$App.getAttrs("subject_color");
			if(index == 5){
				index = 1;
			}else{
				if(index != 0){
					index += 1;
				}
			}
			if($.isNumeric(index) && index >= 0) {
			    this._setColorTableStyle(this.$("li").eq(index));
			}
		},*/
		// 设置颜色选择框选中样式
		_setColorTableStyle : function(color) {
		    var self = this;
			this.$("li.on").removeClass('on');
			color.addClass('on');
			$("#subjectColorSelector").attr('class', color.find('span')[0].className);
			this.$el.addClass('hide');

			var index = color.index();
			var colorValue = self.model.subjectColorManager.getColor(index);
			var txtSubject = $("#txtSubject");
			txtSubject.css("color", colorValue);
			txtSubject.attr('headerValue', self.getColorValue(index));
			// 发送邮件前组装请求报文的方法 buildMailInfo将读取该颜色值属性
		},
		// 选择颜色
		selectColor : function(color) {
			var self = this;
			BH({key : "compose_subjectcolor"});
			color = $(color);
			self._setColorTableStyle(color);
			var index = color.index();
			index = self.getColorValue(index);
			top.$App.setAttrs({
				subject_color : index
			}, function(result) {
				if(result.code === 'S_OK') {
					console.log('颜色值保存成功！' + index);
					$("#txtSubject").focus();
				} else {
					console.log('颜色值保存失败！' + index);
				}
			})
		},
		// 渲染主题
		render : function(dataSet) {
			var self = this;
			var subjectText = $composeApp.query.subject;
			if(dataSet) {
				subjectText = dataSet.subject;
				$("#txtSubject").val(subjectText);
			}
			top.$App.setTitle(subjectText, self.model.tabName);
			var lastTabName = top.$App.getCurrentTab().view.param && top.$App.getCurrentTab().view.param.lastTabName;
			// 过早执行关闭当前读信页会激活上一个tab，导致setTitle失败，因此延迟执行关闭操作
			// lastTabName && top.$App.close(lastTabName);
			
			self.model.autoSaveTimer['subMailInfo']['subject'] = $("#txtSubject").val();

			VoiceInput.create({
			    autoClose: true,
			    button: $("#btn_voiceSubject"),
			    input: $("#txtSubject"),
                from:"subject"
			    /*onComplete: function (text) {
                    
			    }*/
			});
		},
		// 显示主题颜色选择框
		showColorTable : function(event) {
			BH({key : "compose_subjectcolor"});
			
			this._loadColorTable(this.colorData);
			$("#subjectColor").removeClass("hide");
			// 点击空白处包括其他iframe自动消失
			M2012.UI.PopMenu.bindAutoHide({
				action : "click",
				element : $("#subjectColor")[0],
				stopEvent : true,
				callback : function() {
					$("#subjectColor").addClass("hide");
					M2012.UI.PopMenu.unBindAutoHide({
						action : "click",
						element : $("#subjectColor")[0]
					});
				}
			});
			top.$Event.stopEvent(event);
		},
		// 验证主题
		checkSubject : function(event) {
			var self = this;
			if(!event){
				event = {};
				event.target = $("#topSend")[0];
			}
			var isContinue = false;
			var jSubject = $("#txtSubject");
			var subject = jSubject.val();
			if($.trim(subject) == '') {
				var windowScrollTop = $(window).scrollTop();
				//滚动高度
				var divSubjectTop = jSubject.offset().top;
				var target = self.getPopupTarget(event);
				if(self.popup){
					self.popup.close();
				}
				self.popup = M139.UI.Popup.create({
					target : target,
					icon : "i_ok",
					width : 300,
					buttons : [{
						text : "确定",
						cssClass : "btnSure",
						click : function() {
							var defaultSubject = $T.Email.getEmail($("a.sendPsel").text());
							jSubject.attr('value', defaultSubject + "的来信");
							// 如果用户单击的是‘定时发送’则发送定时邮件，否则立即发生
							if(timingView.isClickTimingBtn(event)){
								timingView.isScheduleDate = true;
							}
							self.popup.close();
							mainView.toSendMail(event);
						}
					}, {
						text : "取消",
						click : function() {
							self.popup.close();
							if(windowScrollTop > divSubjectTop) {
								window.scrollTo(0, 0);
								M139.Dom.flashElement($("#divSubject")[0]);
							}
							jSubject.focus();
						}
					}],
					content : self.model.tipWords['LACK_SUBJECT']
				});
				self.popup.render();
				//M139.Dom.flashElement($("#divSubject")[0]);
			} else {
				isContinue = true;
			}
			return isContinue;
		},
		// 获取弹出层的target属性
		getPopupTarget : function(event){
			var target = $(event.target);
			var id = target.attr('id') || target.parent('a').attr('id');
			if(!timingView.isClickTimingBtn(event)){
                return target.parents("li")[0];
			}else{
                return timingView.targetEle;
			}
		},
		// 根据颜色所在的dom序数取得发送至服务端的颜色值
		getColorValue : function(index){
			// 兼容旧邮件的主题颜色：红色保存值5
			if(index == 1){
				index = 5;
			}else if(index > 1){
				index -= 1;
			}
			return index;
		}
	}));
})(jQuery, _, M139);
