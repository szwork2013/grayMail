/**
 * @fileOverview 签名菜单视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Compose.View.SignMenu', superClass.extend(
	/**
	 *@lends M2012.Compose.View.prototype
	 */
	{
		el : ".writePar",
		name : "signmenu",
		events : {
			"click #signs": "showSignMenu"//创建签名菜单
		},
		initialize : function(options) {
			this.model = options.model;
			this.signMenuItems = [];
			this.initializeSignMenuItems();
			this.signMenu = {};
			return superClass.prototype.initialize.apply(this, arguments);
		},
		// 渲染复选框
		render : function() {
		},
		// 初始化签名菜单项
		initializeSignMenuItems : function() {
			var self = this;
			// 不使用
			var noUse = {
				text : '不使用',
				onClick : function() {
					htmlEditorView.editorView.editor.setSign('');
					self.selectedSignIndex = 0;
				}
			};
			// 我的签名
			var signListMenu = self.getSignListMenu();
			// 设置签名
			var settingSign = {
				text : '设置签名',
				onClick : function() {
					// 需验证
					if (top.$App.isNewWinCompose()) {
						top.$App.closeNewWinCompose(true);
					}
					top.$App.show("account",{anchor:"sign"});
				}
			}
			// 分割线
			var line = {
				isLine : true
			}

			// 推荐签名(二级菜单)
			var systemSignMenu = self.getSystemSignMenu();
			var recommendSigns = {
				text : '祝福语',
				items : systemSignMenu
			}
			
			this.signMenuItems = [noUse].concat(signListMenu, settingSign, line, recommendSigns);
		},

		// 显示签名菜单
		showSignMenu : function(){
			BH({key : "compose_signtriangle"});
			
			var self = this;
			self.signMenu = M2012.UI.PopMenu.create({
				selectMode : true,
				//container : ".writePar",
				dockElement : $("#signs")[0],
				direction: "upDown",
				dx: -50,
				width : 120,
				width2:450,
				customStyle: "top: -157px; left: 258px; position: absolute;",
				items : self.signMenuItems,
				top : "200px",
				left : "200px",
				onItemClick : function(item){
					//alert("子项点击");
				}
			});

			if(self.selectedSignIndex === undefined) {
				// 选中用户当前使用的签名
				var defaultSign = self._getDefaultSign();
				if(defaultSign){
					var signName = defaultSign.name || defaultSign.title;
					for(var i = 0, j = self.signMenuItems.length; i < j; i++){
						var item = self.signMenuItems[i];
						if(item.id && item.text == signName){
							self.selectedSignIndex = i;
							break;
						}
					}
				}else{
					//选中菜单项‘不使用’
					self.selectedSignIndex = 0;
				}
			}

			this.signMenu.selectItem(this.selectedSignIndex);
		},

		// 获取默认签名
		// 相关接口：/s?func=user:getSignatures
		// isDefault只用于初始化选择
		_getDefaultSign : function(){
			var signList = top.$App.getSignList();
			for (var i = 0,len = signList.length; i < len; i++) {
				var signItem = signList[i];
				if (signItem.isDefault) {
					return signItem;
				}
			}
		},
		// 设置当前签名
		_setCurrentSignIndex : function(item){
			var items = this.signMenuItems;
			for(var i = 0, len = items.length; i < len; i++){
				if (items[i].id == item.id) {
					this.selectedSignIndex = i;
					return ;
				}
			}
		},
		// 获取我的签名列表
		getSignListMenu : function() {
			var self = this;
			var signListMenu = [];
			if(!self.hasVcard()) {
				var vcard = {
					text : "我的电子名片",
					id: -1,
					onClick : function() {
						htmlEditorView.createVcardSign(1);
						self._setCurrentSignIndex(this);
					}
				};
				signListMenu.push(vcard);
			}
			var signList = top.$App.getSignList();
			if(signList && signList.length > 0) {
				for(var i = 0, j = signList.length; i < j; i++) {
					var sign = signList[i];
					var text = sign.name || sign.title;
					var signItem = {
						text : text,
						type : sign.type,
						id : sign.id,
						isDefault : sign.isDefault,
						content : sign.content,
						onClick : function() {
							if(this.type == 1) {
								htmlEditorView.createVcardSign(3, this.id, this.isDefault);
							} else {
								htmlEditorView.editorView.editor.setSign(M139.Text.Html.decode(this.content));
							}
							self._setCurrentSignIndex(this);
						}
					};
					signListMenu.push(signItem);
				}
			}
			return signListMenu;
		},
		//祝福语
		getSystemSignMenu : function() {
			var systemSignMenu = [];
			var self = this;
			var systemSigns = self.model.systemSigns;
			for(var i = 0, len = systemSigns.length; i < len; i++) {
				var systemSignItem = systemSigns[i];
				var systemSignMenuItem = {
					text : systemSignItem,
					onClick : function() {
						htmlEditorView.editorView.editor.setBlessings(this.text);
					}
				};
				systemSignMenu.push(systemSignMenuItem);
			}
			return systemSignMenu;
		},
		// 判断是否用电子名片
		hasVcard : function() {
			var has = false;
			//默认不存在电子名片
			var index = 0;
			var vcardSign = {};
			var signList = top.$App.getSignList();
			if(signList && signList.length > 0) {
				for(var i = 0, j = signList.length; i < j; i++) {
					var signListItem = signList[i];
					if(signListItem.type == 1) {
						has = true;
						index = i;
						break;
					}
				}
			}
			if(has && index != 0) {
				vcardSign = signList[index];
				signList.splice(index, 1);
				signList.unshift(vcardSign);
			}
			return has;
		}
	}));
})(jQuery, _, M139);
