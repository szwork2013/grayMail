/**
 * @fileOverview 定义通讯录地址本组件代码
 */

(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	var namespace = "M2012.UI.RichInput.View";

	M139.namespace(namespace, superClass.extend({
	/**@lends M2012.UI.RichInput.View.prototype*/
		/** 定义通讯录地址本组件代码
		 *@constructs M2012.UI.RichInput.View
		 *@extends M139.View.ViewBase
		 *@param {Object} options 初始化参数集
		 *@param {String} options.type 地址本类型:email|mobile|fax|mixed
		 *@param {HTMLElement} options.container 组件的容器
		 *@param {Number|Function} options.maxSend 最大接收人个数，默认为50
		 *@param {Number} options.sendIsUpTo 达到多少个联系人后提示剩余个数（默认是maxSend-5)
		 *@param {String} options.limitMailDomain 限定输入的邮件域
		 *@param {String} options.validateMsg 非法输入值的提示语
		 *@param {Boolean} options.highlight 聚焦输入框是否高亮，默认true
		 *@example
		 var richinputView = new M2012.UI.RichInput.View({
			 container:document.getElementById("addrContainer"),
			 type:"email",
			 maxSend:200,
			 sendIsUpTo:195
		 }).render();
		 */
		initialize: function(options) {

			M2012.UI.RichInput.instances.push(this);
			this.id = M2012.UI.RichInput.instances.length;

			M2012.UI.RichInput.DocumentView.create();

			// 控制接收人提示层的位置，默认是在接收人输入框的上方top，可以设置为下方bottom
			this.tipPlace = options.tipPlace || "top";
			var div = document.createElement("div");
			var templateData = {
				offset: "-28px",
				arrow: "tipsBottom",
				zIndex: parseInt(options.zIndex) || 3
			};
			if (this.tipPlace == "bottom") { // 提示层在接收人输入框的底部
				templateData = {
					offset: "29px",
					arrow: "tipsTop",
					zIndex: parseInt(options.zIndex) || 3
				}
			}
			div.innerHTML = $T.format(this.template, templateData);
			if (options.border) {
				$(div).find('div.ItemContainer').css('border', options.border);
			}
			if (options.heightLime) {
				$(div).children().css({
					'overflow-y': 'auto',
					'max-height': options.heightLime + 'px',
					'_height': 'expression(this.scrollHeight > 50 ? "' + options.heightLime + 'px" : "auto")'
				});
			}
			var el = div.firstChild;

			this.type = options.type;
			this.contactsModel = M2012.Contacts.getModel();

			this.model = new Backbone.Model();
			//ad wx产品运营中要扩展的方法
			this.change = options.change || function() {};
			this.errorfun = options.errorfun || null;

			this.setElement(el);
			this.jTextBox = this.$("input");
			this.textbox = this.jTextBox[0];
			this.textboxView = new M2012.UI.RichInput.TextBoxView({
				richInput: this,
				element: this.$("div.addrText")
			});
			//向下兼容
			this.jContainer = this.$el;
			this.container = this.el;

			this.jItemContainer = this.$(this.itemContainerPath);

			this.jAddrTipsContainer = this.$(this.addrTipsPath);

			this.jAddrDomainTipsContainer = this.$(this.addrDomainTipsPath);

			this.items = {};
			this.hashMap = {};

			var maxSend = options.maxSend || 50;
			if (!$.isFunction(maxSend)) {
				maxSend = new Function("", "return " + maxSend);
			}
			this.maxSend = maxSend;
			this.sendIsUpTo = function() {
				return options.sendIsUpTo || (this.maxSend() - 5);
			};
			this.tool = M2012.UI.RichInput.Tool;

			this.highlight = typeof(options.highlight) == 'undefined' ? true : options.highlight;

			return superClass.prototype.initialize.apply(this, arguments);
		},
		name: namespace,
		template: ['<div class="p_relative RichInputBox writeTable" style="z-index:{zIndex};">',
			'<div class="tips write-tips EmptyTips" style="left:0;top:{offset};display:none;">',
				'<div class="tips-text EmptyTipsContent">',
					//'请填写收件人',
				'</div>',
				'<div class="{arrow} diamond"></div>',
			'</div>',
			'<div class="ItemContainer writeTable-txt clearfix" unselectable="on" style="cursor: text;overflow-x:hidden">',
				'<div class="PlaceHold" style="position:absolute;color: silver;display:none;left:10px;"></div>',
				'<div class="addrText" style="margin-top: -3px; *margin:0 0 0 3px;">',
					'<input type="text" style="width:100%" class="addrText-input">',
				'</div>',
			'</div>',
			'<div class="addnum" style="display:none"></div>',
			'<div class="pt_5 addrDomainCorrection" style="display:none"></div>',
		'</div>'].join(""),
		itemPath: ".addrBaseNew",
		itemContainerPath: "div.ItemContainer",
		addrTipsPath: "div.addnum",
		addrDomainTipsPath: "div.addrDomainCorrection",
		/**构建dom函数*/
		render: function() {
			var options = this.options;
			var title = "";

			this.initEvent();

			//this.$el.appendTo(options.container);
			var container = $D.getHTMLElement(options.container);
			container.innerHTML = "";
			container.appendChild(this.el);

			// add by xiaoyu (for 行为统计模块区分)
			switch (container.id) {
			case "evocationContainer":
				this.comefrom = "simplemail";
				title = $(container).closest(".boxIframe").find(".DL_DialogTitle").text();
				if (title.indexOf("短信") !== -1) {
					title = "_sms";
				} else if (title.indexOf("彩信") !== -1) {
					title = "_mms";
				} else if (title.indexOf("贺卡") !== -1) {
					title = "_greetingcard";
				} else {
					title = "";
				}
				this.comefrom += title;
				break;
			case "to-edit":
			case "cc-edit":
			case "bcc-edit":
				this.comefrom = "conversation";
				break;
			default:
				this.comefrom = "compose"; // 来自写信页
			}

			M2012.UI.RichInput.Tool.unselectable(this.el.parentNode);
			M2012.UI.RichInput.Tool.unselectable(this.el);
			M2012.UI.RichInput.Tool.unselectable(this.el.firstChild);

			if (this.options.placeHolder) {
				this.setTipText(this.options.placeHolder);
			}

			//插件
			var plugins = options.plugins;
			for (var i = 0; i < plugins.length; i++) {
				new plugins[i](this);
			}

			return superClass.prototype.render.apply(this, arguments);
		},
		/**
		 *初始化事件
		 *@inner
		 */
		initEvent: function() {
			var This = this;
			this.$el.on("click", $.proxy(this, "onClick"))
				.on("keydown", $.proxy(this, "onKeyDown"))
				.on("mousedown", $.proxy(this, "onMouseDown"))
				.on("mouseup", $.proxy(this, "onMouseUp"));

			this.$("div.PlaceHold").click(function() {
				This.textbox.select();
				This.textbox.focus();
				//return false;
			});

			this.model.on("change:placeHolder", function() {
				This.switchTipText();
			});

			this.textboxView.on("input", function() {
				This.switchTipText();
			});

			this.on("itemchange", function() {
				This.switchTipText();
			});

			this.jTextBox.keydown(function(e) {
				This.trigger("keydown", e);
			}).blur(function(e) {
				This.trigger("blur", e);
			});
		},

		/**
		 *提示没有收件人
		 *@param {String} msg 可选参数，默认是：请填写收件人
		 */
		showEmptyTips: function(msg) {
			msg = msg || "请填写收件人";
			var tips = this.$("div.EmptyTips");
			tips
			/*.css({
				left:"0",
				top:"-28px"
			})*/.show().find("div.EmptyTipsContent").text(msg);
			setTimeout(function() {
				tips.hide();
			}, 3000);
			// commented (暂时去掉)
			//M139.Dom.flashElement(this.el);
		},

		/**
		 *提示接收人格式非法
		 *@param {String} msg 可选参数，默认是：接收人输入错误
		 */
		showErrorTips: function(msg) {
			var item = this.getErrorItem();
			if (!item) return;

			msg = msg || "接收人输入错误";
			var tips = this.$("div.EmptyTips");
			tips.show().find("div.EmptyTipsContent").text(msg);

			var itemOffset = item.$el.offset();
			var richinputOffset = this.$el.offset();
			tips.css({
				left: itemOffset.left - richinputOffset.left + parseInt(item.$el.width() / 2) - 16,
				top: itemOffset.top - richinputOffset.top + (this.tipPlace == "bottom" ? 25 : -32)
			});
			setTimeout(function() {
				tips.hide();
			}, 3000);
		},

		/**
		 *获得输入的项
		 *@inner
		 *@returns {Array} 返回输入的dom数组
		 */
		getItems: function() {
			var result = [];
			var items = this.items;
			this.$(this.itemPath).each(function() {
				var itemId = this.getAttribute("rel");
				var item = items[itemId];
				if (item) result.push(item);
			});
			return result;
		},

		/** 得到收件人输入项 */
		getToInstancesItems: function() {
			var instances = M2012.UI.RichInput.instances;
			return instances[0].getValidationItems().distinct();
		},

		/**
		 *todo 得到所有实例的输入项
		 */
		getAllInstancesItems: function() {
			var instances = M2012.UI.RichInput.instances;
			var result = [];
			for (var i = 0; i < instances.length; i++) {
				result = result.concat(instances[i].getValidationItems());
			}
			result = result.distinct();
			return result;
		},
		/**
		 *得到所有实例的输入对象（收件人、抄送、密送）
		 */
		getInputBoxItems: function() {
			return this.getAllInstancesItems();
		},
		/**
		 *得到所有实例的地址域名
		 */
		getInputBoxItemsDomain: function() {
			var result = [];
			for (var p in this.items) {
				var item = this.items[p];
				if (item && item.domain) {
					result.push(item.domain);
				}
			}
			result = result.distinct();
			return result;
		},
		/**
		 *判断是否重复输入
		 *@inner
		 */
		isRepeat: function(addr) {
			//取手机号码或者邮件地址作为key
			var hashKey = this.contactsModel.getAddr(addr, this.type);
			if (hashKey && this.hashMap[hashKey]) {
				//实现闪烁效果
				for (var p in this.items) {
					var item = this.items[p];
					if (item && item.hashKey == hashKey) {
						M139.Dom.flashElement(item.el);
						break;
					}
				}
				return true;
			} else {
				return false;
			}
		},
		/**
		 *todo event
		 *插入收件人之前
		 *@inner
		 */
		/*beforeInsertItem: function() {
			var This = this;
			var curItemsLen = this.getInputBoxItems().length;
			var addresseeTips = this.jAddrTipsContainer;
			if (curItemsLen >= this.maxSend()) {
				addresseeTips.html('不能再添加收件人！').show();
				//todo
				//this.blinkBox(addresseeTips, 'xxxclass');
				//this.hideBlinkBox(addresseeTips);
				return false;
			}
			return true;
		},

*/
		/**
		 *插入成员
		 *@param {String} addr 插入的地址
		 *@param {Object} options 选项集合
		 *@param {Boolean} options.isAfter 是否插入到文本框后方
		 *@param {HTMLElement} options.element 插入到目标元素后方
		 *@param {Boolean} options.isFocusItem 插入后是否显示为选中状态
		 */
		insertItem: function(addr, options) {
			options = options || {};
			var nearItem = options.nearItem;
			var isAfter = nearItem && nearItem.isAfter;
			var element = nearItem && nearItem.element;
			var isFocusItem = options.isFocusItem;

			if (!element) {
				element = this.textboxView.$el;
			} else {
				//for(var i = 0, items = this.items; i < items.length; i++){
				//	if(nearItem === items[i] && items[i].selected){
				//		element = this.textboxView.$el;
				//		break;
				//	}
				//}
			}

			//add wx
			(typeof this.change === "function") && this.change(addr);

			var list = _.isArray(addr) ? addr : this.splitAddr(addr);

			var totalLength = this.getInputBoxItems().length;
			var breakSender = false;
			var str, item, tipHTML = "";

			for (var i = 0; i < list.length; i++) {
				if (totalLength == this.maxSend()) {
					//todo 移到别的地方会好一些
					try {
						if ($.isFunction(this.options.onMaxSend)) {
							this.options.onMaxSend();
						} else {
							//TODO 这一坨应该放在写信页调用的onMaxSend里

							var serviceItem = top.$User.getServiceItem();
							var isFree = true;
							if(serviceItem == "0017" || serviceItem == "0016"){
								isFree = false;
							}
							var decrease = '请减少邮件群发人数',
							    upGrade = '<a href="javascript:;" onclick="top.$App.showOrderinfo()" style="color:#0344AE">套餐升级</a>可增加群发人数!';

							if(this.noUpgradeTips){
								var tipHTML = '接收人数已超过上限<span style="color: #F60;">' + this.maxSend() + '</span>人！';
							}else{
								if (list.length == 1) {
									var tipHTML = '发送邮件人数已超过上限：<span style="color: #F60;">' + this.maxSend() + '</span>人!';
									if(isFree){
										tipHTML += upGrade;
									}else{
										tipHTML += decrease;
									}
								}else {
									var tipHTML = M139.Text.Utils.format('<span style="color: #F60;">{remain}</span>人未添加，最多添加<span style="color: #F60;">{maxSend}</span>人！', {
										remain: list.length - i,
										maxSend: this.maxSend()
									});								
									if(isFree){
										tipHTML += upGrade;
									}else{
										tipHTML += decrease;
									}
								}
							}
							this.showAddressTips({
								html: tipHTML,
								flash: true
							});
						}
					} catch (e) {}
					breakSender = true;
					break;
				} else {
					totalLength++;
				}
				str = list[i].trim();
				if (str != "") {
					if (options.testRepeat === false || !this.isRepeat(str)) {
						//move to itemview
						item = new M2012.UI.RichInput.ItemView({
							richInput: this,
							text: str,
							itemId: this.getNextItemId(),
							type: this.type,
							limitMailDomain: this.options.limitMailDomain,
							errorMessage: this.options.validateMsg || "地址有误，请双击修改"
						}).render();
						
						M2012.UI.RichInput.Tool.unselectable(item.el);
						this.items[item.itemId] = item;
						
						if (!item.error) {
							this.hashMap[item.hashKey] = true;
						}
						if (isAfter) {
							element.after(item.$el);
						} else {
							element.before(item.$el);
						}
						if (isFocusItem) item.select();
					}
				}
			}
			this.onItemChange({
				breakSender: breakSender
			});
		},
		/**
		 *todo event
		 *插入收件人之后
		 *@inner
		 */
		onItemChange: function(options) {
			options = options || {};
			if (!options.breakSender) {
				var addresseeTips = this.jAddrTipsContainer;
				var itemLength = this.getInputBoxItems().length;
				var html = '';
				if (itemLength >= this.sendIsUpTo()) {
					var remail = this.maxSend() - itemLength;
					html = '还可添加<strong class="c_ff6600">' + remail + '</strong>人';
					this.showAddressTips({
						html: html
					});
				} else {
					this.hideAddressTips();
				}
			}

			//收件人人数大于3人时提示群发单显(只在写信页用)
			// todo remove ?
			try {
				if (window.location.href.indexOf("html/compose.html") > -1) {
					top.$App.off('insertItem');
					var toLength = this.getToInstancesItems().length;
					toLength >= 3 && top.$App.trigger('insertItem', {
						totalLength: toLength
					});
				}
			} catch (e) {}

			this.trigger("itemchange");
		},

		/**
		 *地址栏下方的提示信息
		 *@param {Object} options 参数集
		 *@param {String} options.html 提示内容
		 *@param {Boolean} options.flash 是否闪烁
		 */
		showAddressTips: function(options) {
			var This = this;
			this.jAddrTipsContainer.html(options.html).show();
			if (options.flash) {
				M139.Dom.flashElement(this.jAddrTipsContainer);
			}
			clearTimeout(this.hideAddressTipsTimer);
			//5秒后提示自动消失
			this.hideAddressTipsTimer = setTimeout(function() {
				This.hideAddressTips();
			}, 5000);
		},
		hideAddressTips: function() {
			// add by tkh
			var associates = this.jAddrTipsContainer.find("a[rel='addrInfo']");
			if (associates.size() == 0) {
				this.jAddrTipsContainer.hide();
			}
		},

		/**
		 *得到文本框后一个成员
		 *@inner
		 */
		getTextBoxNextItem: function() {
			var node = this.textboxView.el.nextSibling;
			if (node) {
				var itemId = node.getAttribute("rel");
				if (itemId) {
					return this.items[itemId];
				}
			} else {
				return null;
			}
		},
		/**
		 *得到文本框前一个成员
		 *@inner
		 */
		getTextBoxPrevItem: function() {
			var node = this.textboxView.el.previousSibling;
			if (node) {
				var itemId = node.getAttribute("rel");
				if (itemId) {
					return this.items[itemId];
				}
			} else {
				return null;
			}
		},
		/**
		 *取消选择所有成员
		 *@inner
		*/
		unselectAllItems: function() {
			for (var p in this.items) {
				var item = this.items[p];
				if (item) {
					item.unselect();
				}
			}
		},
		/**
		 *选择所有成员
		 *@inner
		*/
		selectAll: function() {
			for (var p in this.items) {
				var item = this.items[p];
				if (item) {
					item.select();
				}
			}
		},

		/**
		 *复制选中成员
		 *todo 优化成原生的复制
		 *@inner 
		 */
		copy: function() {
			var This = this;
			var items = this.getSelectedItems();
			var list = [];
			for (var i = 0; i < items.length; i++) {
				list.push(items[i].allText);
			}
			M2012.UI.RichInput.Tool.Clipboard.setData(list);
			setTimeout(function() {
				M139.Dom.focusTextBox(This.textbox);
			}, 0);
		},
		/**
		 *剪切选中成员
		 *todo 优化成原生的剪切
		 *@inner 
		 */
		cut: function() {
			this.copy();
			var items = this.getSelectedItems();
			for (var i = 0; i < items.length; i++) {
				items[i].remove();
			}
			//console.log('cut 剪切');
			if (this.inputAssociateView) {
				this.inputAssociateView.render(); // add by tkh
			}
		},
		/**
		 *粘贴成员 todo 优化成原生的
		 *@inner 
		 */
		paste: function(e) {
			var This = this;
			setTimeout(function() {
				var text = This.textbox.value;
				if (/[;,；，]/.test(text) || (This.type == "email" && M139.Text.Email.isEmailAddr(text)) || (This.type == "mobile" && M139.Text.Mobile.isMobile(text))) {
					This.createItemFromTextBox();
				}
			}, 0);
		},

		/**
		 *获得选中的成员
		 *@inner 
		 */
		getSelectedItems: function() {
			var result = [];
			for (var p in this.items) {
				var item = this.items[p];
				if (item && item.selected) {
					result.push(item);
				}
			}
			return result;
		},

		/**
		 *清空输入项 
		 */
		clear: function() {
			for (var p in this.items) {
				var item = this.items[p];
				if (item) item.remove();
			}
		},

		/**
		 *移除选中的成员
		 *@inner 
		 */
		removeSelectedItems: function() {
			var items = this.getSelectedItems();
			for (var i = 0; i < items.length; i++) {
				items[i].remove();
			}
		},

		/**
		 *双击编辑联系人
		 */
		editItem: function(itemView) {
			this.textboxView.setEditMode(itemView);
		},

		/**
		 *@inner
		 *分割多个联系人
		 */
		splitAddr: function(addr) {
			if (this.type == "email") {
				return M139.Text.Email.splitAddr(addr);
			} else if (this.type == "mobile") {
				return M139.Text.Mobile.splitAddr(addr);
			}
			return [];
		},


		/**
		 *从文本框读取输入值，添加成员
		 */
		createItemFromTextBox: function() {
			var textbox = this.textbox;
			var value = textbox.value.trim();
			if (value != "" && value != this.tipText) {
				//todo 优化event
				if (this.type == "email" && /^\d+$/.test(value)) {
					value = value + "@" + ((top.$App && top.$App.getMailDomain()) || "139.com");
				}
				this.textboxView.setValue("");
				this.insertItem(value);
				if (this.inputAssociateView) {
					this.inputAssociateView.render(); // add by tkh 
				}
				if (this.inputCorrectView) {
					this.inputCorrectView.render(); //add by yly
				}
				this.focus();
			}
		},

		/**
		 *移动文本框到
		 *@inner
		 */
		moveTextBoxTo: function(insertElement, isAfter) {
			if (!insertElement) return;
			if (isAfter) {
				insertElement.after(this.textboxView.el);
			} else {
				insertElement.before(this.textboxView.el);
			}
			window.focus();
			this.jTextBox.focus();
		},

		/**
		 *移动文本框到末尾
		 *@inner
		 */
		moveTextBoxToLast: function() {
			var el = this.textboxView.el;
			if (el.parentNode.lastChild != el) {
				el.parentNode.appendChild(el);
			}
			if ($.browser.msie) window.focus();
			//textbox.focus();
		},

		/**
		 *移除成员数据
		 *@inner
		 */
		disposeItemData: function(item) {
			var items = this.items;
			delete items[item.itemId];

			//重新建立map，而不是直接删除key，因为有可能存在key相同的item
			this.hashMap = {};

			for (var id in items) {
				var item = items[id];
				if (!item.error) {
					this.hashMap[item.hashKey] = true;
				}
			}

			this.onItemChange();
		},
		/**
		 *根据鼠标移动的起始点和结束点，得到划选的成员
		 *@inner
		 */
		trySelect: function(p1, p2) {
			var startElement;
			var topPosition, bottomPosition;
			var elements;
			var itemHeight;
			var itemObj;

			if (p1.y == p2.y) {
				if (p1.x == p2.x) return;
				topPosition = Math.min(p1.x, p2.x);
				bottomPosition = Math.max(p1.x, p2.x);
			} else if (p1.y < p2.y) {
				topPosition = p1;
				bottomPosition = p2;
			} else {
				topPosition = p2;
				bottomPosition = p1;
			}

			elements = this.jContainer.find(this.itemPath);

			if (elements.length > 0) {
				itemHeight = elements.eq(0).height();
			}

			for (var i = 0; i < elements.length; i++) {
				var element = elements.eq(i);
				var offset = element.offset();
				var x = offset.left + element.width();
				var y = offset.top + itemHeight;
				var selected = false;

				if (!startElement) {
					if ((topPosition.x < x && topPosition.y <= y) || (y - topPosition.y >= itemHeight)) {
						startElement = element;
						selected = true;
					}
				} else if (bottomPosition.x > offset.left && bottomPosition.y > offset.top) {
					selected = true;
				} else if (bottomPosition.y - offset.top > itemHeight) {
					selected = true;
				}
				itemObj = this.items[element.attr("rel")];
				if (selected) {
					itemObj.selected == false && itemObj.select();
				} else {
					itemObj.unselect();
				}
			}
		},

		itemIdNumber: 0,
		/**
		 *返回下一个子项的id
		 *@inner
		 */
		getNextItemId: function() {
			return this.itemIdNumber++;
		},
		/**
		 *设置提示文本
		 */
		setTipText: function(text) {
			this.model.set("placeHolder", text);
		},
		/**
		 * 显示默认文本
		 * todo 是否调用太频繁了
		 */
		switchTipText: function() {
			if (this.textbox.value == "" && !this.hasItem()) {
				var text = this.model.get("placeHolder");
				this.$(".PlaceHold").show().text(text);
			} else {
				this.$(".PlaceHold").hide();
			}
		},
		/**
		 *输入组件获得焦点
		 */
		focus: function() {
			//if (document.all) {
			try {
				//当元素隐藏的时候focus会报错
				this.textbox.focus();
			} catch (e) {}
			//} else {
			//this.textbox.select(); //select焦点不会自动滚动到文本框
			//}
		},
		/**
		 *返回组件是否有输入值
		 *@returns {Boolean}
		 */
		hasItem: function() {
			return this.getItems().length > 0;
		},

		/**
		 *返回组件输入的所有地址
		 */
		getAddrItems: function() {
			var items = this.getItems();
			var result = [];
			for (var i = 0; i < items.length; i++) {
				if (!items[i].error) {
					result.push(items[i].addr);
				}
			}
			return result;
		},

		/**
		 *返回组件输入的所有地址（正确的）
		 */
		getValidationItems: function() {
			var items = this.getItems();
			var result = [];
			for (var i = 0; i < items.length; i++) {
				if (!items[i].error) {
					result.push(items[i].allText);
				}
			}
			return result;
		},

		/**
		 *返回第一个格式非法的输入文本
		 *@returns {String}
		 */
		getErrorText: function() {
			var item = this.getErrorItem();
			return item && item.allText;
		},
		/**
		 *@inner
		 */
		getErrorItem: function() {
			var items = this.getItems();
			for (var i = 0; i < items.length; i++) {
				if (items[i].error) {
					return items[i];
				}
			}
			return null;
		},

		getClickItemId: function(e) {
			var jEl = $(e.target).closest(this.itemPath);
			return jEl.length ? jEl.attr("rel") : null;
		},

		/**
		 *键盘按下
		 *@inner
		 */
		onKeyDown: function(e) {
			var Keys = M139.Event.KEYCODE;

			if (e.target.tagName == "INPUT" && e.target.value != "") {
				return;
			}
			if (e.keyCode == Keys.A && e.ctrlKey || e.keyCode == Keys.BACKSPACE) {
				e.preventDefault();
			}

			switch (e.keyCode) {
			case Keys.BACKSPACE:
			case Keys.DELETE:
				if(!e.ctrlKey && !e.shiftKey && !e.altKey){
					var selecteds = this.getSelectedItems();
					if (selecteds.length > 0) {
						this.moveTextBoxTo(selecteds[0].$el);
					}
					this.removeSelectedItems();
					window.focus();
					this.jTextBox.focus();
				}
				break;
			case Keys.A:
				if (e.ctrlKey) this.selectAll(e);
				break;
			case Keys.C:
				if (e.ctrlKey) this.copy(e);
				break;
			case Keys.X:
				if (e.ctrlKey) this.cut(e);
				break;
			case Keys.V:
				if (e.ctrlKey) this.paste(e);
				break;
			default:
				break;
			}
		},
		/**
		 *鼠标点击
		 *@inner
		 */
		onClick: function(e) {
			//console.log("onclick");
			if (!$(e.target).hasClass("ItemContainer")) {
				//console.log("click not processed.");
				return; // 只处理点击控件空白地方
			}

			var nearItem = M2012.UI.RichInput.Tool.getNearlyElement({
				richInputBox: this,
				x: e.clientX,
				y: e.clientY + M2012.UI.RichInput.Tool.getPageScrollTop()
			});
			//console.log(nearItem);
			if (nearItem) {
				this.moveTextBoxTo(nearItem.element, nearItem.isAfter);
			} else {
				this.textbox.focus();
			}
		},

		onMouseUp: function(e) {
			var clickItem, items;
			var itemId = this.getClickItemId(e);

			$(document.body).off("mousemove", this.proxyMouseMove);
			delete this.proxyMouseMove;

			if(this.moveStartCount >= 3) {
				return;		// 拖动后松开鼠标，无操作
			}

			if (itemId) {
				clickItem = this.items[itemId];
				// todo 点击删除为何不触发onClick？
				if($(e.target).hasClass("addrBase_close")) {
					this.unselectAllItems();
					clickItem.remove();
					clickItem.addDistinctBehavior("contact_click_remove");
				} else if (!e.ctrlKey && !e.shiftKey) {
					items = this.getSelectedItems();

					//if ($.inArray(clickItem, items) == -1) {
					if (!this.selectArea && this.lastClickItem === clickItem) {
						this.unselectAllItems();
						clickItem.selected == false && clickItem.select();
					}
					//}

					if ($.browser.msie) {
						M2012.UI.RichInput.Tool.captureElement = e.target;
						e.target.setCapture();
					} else {
						// todo remove
						//window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
					}
				}
			}
			this.selectArea = false;
		},

		/**
		 *鼠标按下
		 *@inner
		 */
		onMouseDown: function(e) {
			var target = e.target;
			var RichInput = M2012.UI.RichInput;

			e.stopPropagation();

			RichInput.Tool.currentRichInputBox = this;
			for (var i = 0; i < RichInput.instances.length; i++) {
				var box = RichInput.instances[i];
				if (box !== this && $(box.container).is(":visible")) {
					box.unselectAllItems();
				}
			}

			// 跳过这些元素，以保持编辑状态（蹲坑，终于看明白了...）
			// todo 让textbox停止冒泡就可以了...
			if (target.tagName == "INPUT" || 
				target.className == "addnum" || 
				target.parentNode.className == "addnum" || 
				target.className == "addrDomainCorrection" || 
				target.parentNode.className == "addrDomainCorrection" || 
				target.parentNode.parentNode.className == "addrDomainCorrection") {
				return;
			}

			var itemId = this.getClickItemId(e);

			this.startPosition = {
				x: e.clientX,
				y: e.clientY + M2012.UI.RichInput.Tool.getPageScrollTop()
			};

			this.proxyMouseMove = $.proxy(this, "onMouseMove");
			$(document.body).on("mousemove", this.proxyMouseMove);

			if (itemId) {

				// 在联系人组件上按下才有拖动操作
				M2012.UI.RichInput.Tool.dragEnable = true;

				items = this.getSelectedItems();

				clickItem = this.items[itemId];

				if (e.ctrlKey) {
					clickItem.selected ? clickItem.unselect() : clickItem.select();
				} else if (e.shiftKey) {
					this.shiftSelectItem(clickItem);
				} else {
					this.lastClickItem = clickItem;
					if(clickItem.selected == false) {
						this.unselectAllItems();
						clickItem.select();
					}
				}

				// todo 这段的逻辑未整理好
				if (this.editMode == true) {
					this.createItemFromTextBox();
				}
				this.moveTextBoxToLast();
				this.focus();
				M139.Event.stopEvent(e);	// todo why ?
			} else {
				if (target == this.el || $.contains(this.el, target)) {
					if (!e.ctrlKey) {
						this.unselectAllItems();
					}
					this.selectArea = true;
					if (this.editMode == false) {
						this.createItemFromTextBox();
					}
					this.moveTextBoxToLast();
					//console.log("--------- select area --------------");
					this.focus();
				}
			}

			this.moveStartCount = 0;
			M2012.UI.RichInput.Tool.dragItems = this.getSelectedItems();
			M2012.UI.RichInput.Tool.currentRichInputBox = this;
		},

		/*
		* bug fixed: 
		* 鼠标点击时同时设置编辑光标的位置，会触发不必要的mousemove事件
		* 只能在mousedown状态下添加mousemove事件
		*/
		onMouseMove: function(e) {
			var tool = this.tool;

			if (this.editMode) return;

			this.moveStartCount++;

			// fix: IE8 iframe在mousedown时就触发mousemove，导致数据处理出错
			if (this.moveStartCount < 3) {
				return;
			}

			var p = {
				x: e.clientX,
				y: e.clientY + tool.getPageScrollTop(),
				target: e.target
			};

			e.preventDefault();

			if (tool.dragEnable) {
				// console.log("mouse moved, delay draweffect");
				tool.drawDragEffect(p);
				tool.delay("drawInsertFlag", function() {
					tool.drawInsertFlag(p);
				}, 20);
			} else if (this.selectArea) { // 点击空白处划选联系人
				//M2012.UI.RichInput.Tool.draw(this.startPosition, p);
				//console.log("moving...try Select");
				this.trySelect(this.startPosition, p);
			}
		},

		//按住shift选中
		shiftSelectItem: function(item) {
			var lastClickItem = this.lastClickItem;
			if (!lastClickItem || lastClickItem == item) return;
			var items = this.getItems();
			var a = $.inArray(lastClickItem, items);
			var b = $.inArray(item, items);
			var min = Math.min(a, b);
			var max = Math.max(a, b);

			$(items).each(function(index) {
				if (index >= min && index <= max) {
					this.select();
				} else {
					this.unselect();
				}
			});
		},

		showErrorDomain: function(errorDomain) {
			var items = this.items;
			var item = '';
			for (var p in items) {
				item = items[p];
				if (item.domain == errorDomain) {
					item.trigger('errorDomain');
				}
			}
		},
		changItemDomain: function(errorDomain, domain) {
			var items = this.items;
			var item = '';
			for (var p in items) {
				item = items[p];
				if (item.domain == errorDomain) {
					item.trigger('changeDomain', {
						errorDomain: errorDomain,
						domain: domain
					});
				}
			}
		}
	}));


	var instances = M2012.UI.RichInput.instances = [];
	M2012.UI.RichInput.getInstanceByContainer = function(element) {
		for (var i = 0; i < instances.length; i++) {
			var o = instances[i];
			if (o.container === element || o.jContainer === element) return o;
		}
		return null;
	}

	//工具类
	M2012.UI.RichInput.Tool = {
		getPageScrollTop: function() {
			return Math.max(document.body.scrollTop, document.documentElement.scrollTop);
		},
		//元素不可选中（禁用浏览器原生选中效果）
		unselectable: function(element) {
			if ($.browser.msie) {
				element.unselectable = "on";
			} else {
				element.style.MozUserSelect = "none";
				element.style.KhtmlUserSelect = "none";
			}
		},
		resizeContainer: function(element, autoHeight) {
		},
		//根据坐标获取最接近的item
		getNearlyElement: function(param) {
			var box = param.richInputBox;
			var overElemet;
			var isAfter = true;
			var jElements = box.jContainer.find(box.itemPath);
			var rowsElements = [];
			var _x, _y, jElement;
			var elementHeight = jElements.eq(0).height();

			//得到当前坐标所在行的元素
			for (var i = 0; i < jElements.length; i++) {
				jElement = jElements.eq(i);
				_y = jElement.offset().top;
				if (param.y > _y && param.y < _y + elementHeight) {
					rowsElements.push(jElement);
				}
			}

			//获得插入点
			for (var i = 0; i < rowsElements.length; i++) {
				jElement = rowsElements[i];
				_x = jElement.offset().left;
				if (param.x < _x + jElement.width() / 2) {
					overElemet = jElement;
					isAfter = false;
					break;
				}
				overElemet = jElement;
			}
			if (overElemet) {
				return {
					element: overElemet,
					isAfter: isAfter
				};
			} else {
				return null;
			}
		},
		bindEvent: function(richInputBox, element, events) {
			for (var eventName in events) {
				var func = events[eventName];
				element.bind(eventName, (function(func) {
					return (function(e) {
						e.richInputBox = richInputBox;
						return func.call(this, e);
					});
				})(func));
			}
		},
		draw: function(p1, p2) {
			if (!window.drawDiv) {
				window.drawDiv = $("<div style='position:absolute;left:0px;top:0px;border:1px solid blue;'></div>").appendTo(document.body);
			}
			var width = Math.abs(p1.x - p2.x);
			var height = Math.abs(p1.y - p2.y);
			drawDiv.width(width);
			drawDiv.height(height);
			drawDiv.css({
				left: Math.min(p1.x, p2.x),
				top: Math.min(p1.y, p2.y)
			});
		},
		//伪剪贴板对象
		Clipboard: {
			setData: function(arr) {
				var txtGhost = $("<input type='text' style='width:1px;height:1px;overflow:hidden;position:absolute;left:0px;top:0px;'/>").appendTo(document.body).val(arr.join(";")).select();
				setTimeout(function() {
					txtGhost.remove();
				}, 0);
			}
		},
		hidDragEffect: function() {
			if (this.dragEffectDiv) this.dragEffectDiv.hide();
		},
		//拖拽的时候效果
		drawDragEffect: function(p) {
			if (!this.dragEffectDiv) {
				this.dragEffectDiv = $("<div style='position:absolute;\
				border:2px solid #444;width:7px;height:8px;z-index:5000;overflow:hidden;'></div>").appendTo(document.body);
			}
			this.dragEffectDiv.css({
				left: p.x + 4,
				top: p.y + 10,
				display: "block"
			});
		},
		hidDrawInsertFlag: function() {
			if (this.drawInsertFlagDiv) this.drawInsertFlagDiv.hide();
		},
		//插入效果（游标）
		drawInsertFlag: function(p) {
			var hitRichInputBox, rich, offset, nearItem;
			if (!this.drawInsertFlagDiv) {
				this.drawInsertFlagDiv = $("<div style='position:absolute;\
				background-color:black;width:2px;background:black;height:15px;z-index:5000;overflow:hidden;border:0;'></div>").appendTo(document.body);
			}
			//ie9,10和火狐，拖拽的时候 mousemove e.target始终等于按下的那个元素，所以只能用坐标判断
			// todo ...
			if (($B.is.ie && $B.getVersion() > 8) || $B.is.firefox) {
				for (var i = M2012.UI.RichInput.instances.length - 1; i >= 0; i--) {
					rich = M2012.UI.RichInput.instances[i];
					if (!M139.Dom.isHide(rich.el, true) && p.y > rich.$el.offset().top) {
						hitRichInputBox = rich;
						break;
					}
				}
			} else {
				for (var i = 0; i < M2012.UI.RichInput.instances.length; i++) {
					rich = M2012.UI.RichInput.instances[i];
					if (M2012.UI.RichInput.Tool.isContain(rich.container, p.target)) {
						hitRichInputBox = rich;
						break;
					}
				}
			}
			// todo 暂时禁止掉内部拖动排序
			if (hitRichInputBox/* && hitRichInputBox !== this*/) {
				nearItem = M2012.UI.RichInput.Tool.getNearlyElement({
					richInputBox: hitRichInputBox,
					x: p.x,
					y: p.y
				});
			}
			if (nearItem) {
				offset = nearItem.element.offset();
				this.drawInsertFlagDiv.css({
					left: offset.left + (nearItem.isAfter ? (nearItem.element.width() + 2) : -2),
					top: offset.top + 4,
					display: "block"
				});
				this.insertFlag = {
					nearItem: nearItem,
					richInputBox: hitRichInputBox
				};
			} else {
				this.insertFlag = {
					richInputBox: hitRichInputBox
				};
			}
		},
		isContain: function(pNode, cNode) {
			while (cNode) {
				if (pNode == cNode) return true;
				cNode = cNode.parentNode;
			}
			return false;
		},
		delay: function(key, func, interval) {
			if (!this.delayKeys) this.delayKeys = {};
			if (this.delayKeys[key]) {
				clearTimeout(this.delayKeys[key].timer);
			}
			this.delayKeys[key] = {};
			this.delayKeys[key].func = func;
			var This = this;
			this.delayKeys[key].timer = setTimeout(function() {
				This.delayKeys[key] = null;
				func();
			}, interval || 0);
		},
		fireDelay: function(key) {
			if (!this.delayKeys || !this.delayKeys[key]) return;
			this.delayKeys[key].func();
			clearTimeout(this.delayKeys[key].timer);
		},
		hideBlinkBox: function(tipObj, time) {
			if (typeof(time) != 'number') time = 5000;
			var This = this;
			if (This.keep) clearTimeout(This.keep);
			This.keep = setTimeout(function() {
				tipObj.hide();
			}, time);
		},
		blinkBox: function(obj, className) {
			var This = this;
			obj.addClass(className);
			var keep;
			var loop = setInterval(function() {
				if (keep) clearTimeout(keep);
				obj.addClass(className);
				keep = setTimeout(function() {
					obj.removeClass(className);
				}, 100);
			}, 200);
			setTimeout(function() {
				if (loop) clearInterval(loop);
			}, 1000);
		}
	}


	//暂放至此 数组扩展 去重
	Array.prototype.distinct = function() {
		var filtered = [];
		var obj = {};
		for (var i = 0; i < this.length; i++) {
			if (!obj[this[i]]) {
				obj[this[i]] = 1;
				filtered.push(this[i]);
			}
		}
		return filtered;
	};


	// 排序 
	Array.prototype.ASC = function() {
		return this.sort(function(a, b) {
			if (a.localeCompare(b) > 0) return 1;
			else return -1;
		});
	}

	/**@lends M2012.UI.RichInput*/
	$.extend(M2012.UI.RichInput, {
		/**
		 *创建富收件人文本框实例
		 *@param {Object} options 参数集合
		 *@param {String} options.type 地址本类型:email|mobile|fax|mixed
		 *@param {HTMLElement} options.container 组件的容器
		 *@param {Number} options.maxSend 最大接收人个数，默认为50
		 *@param {Number} options.preventAssociate 是否屏蔽推荐收件人功能
		 *@param {Number} options.preventCorrect 是否屏蔽域名纠错功能
		 *@param {Number|Function} options.sendIsUpTo 达到多少个联系人后提示剩余个数（默认是maxSend-5)
		 */
		create: function(options) {
			var plugins = [];
			plugins.push(M2012.UI.RichInput.Plugin.AddrSuggest);
			options.plugins = plugins;
			var view = new M2012.UI.RichInput.View(options);
			if (!options.preventAssociate && top.$App) {
				view.inputAssociateView = new M2012.UI.Suggest.InputAssociate({
					richInputBox: view
				}); // add by tkh 地址输入框联想组件
			}
			if (!options.preventCorrect && top.$App && M2012.UI.Suggest.InputCorrect) {
				view.inputCorrectView = new M2012.UI.Suggest.InputCorrect({
					richInputBox: view
				});
			}
			if (options.noUpgradeTips) {
				view.noUpgradeTips = true;
			} else {
				view.noUpgradeTips = false;
			}
			return view;
		}
	});

})(jQuery, _, M139);
