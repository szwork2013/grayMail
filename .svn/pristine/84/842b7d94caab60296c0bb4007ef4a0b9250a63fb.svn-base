

(function (jQuery, _, Backbone, M139) {
	var namespace = "M2012.UI.RichInput.DocumentView";
	M139.namespace(namespace, Backbone.View.extend({
		/** 定义通讯录地址本组件代码
		 *@constructs M2012.UI.RichInput.DocumentView
		 *@param {Object} options 初始化参数集
		 *@param {HTMLElement} options.textbox 文本框对象
		 *@example
		 */
		initialize: function (options) {
			this.setElement(document.body);

			this.initEvent();
		},
		initEvent: function () {
			this.$el.mouseup($.proxy(this, "onMouseUp"))
				.mousedown($.proxy(this, "onMouseDown"));
		},
		// todo
		onMouseDown: function (e) {
			//var o;
			//var current;
			var box;
			var RichInput = M2012.UI.RichInput;

			//o = $(e.target).closest(".RichInputBox");
			//if(o.length > 0) {
			//	current = RichInput.getInstanceByContainer(o[0]);
			//}

			//RichInput.Tool.currentRichInputBox = current;

			for (var i = 0; i < RichInput.instances.length; i++) {
				box = RichInput.instances[i];
				//if (box !== current) {
					box.unselectAllItems();
				//}
			}
		},
		onMouseUp: function (e) {
			var tool = M2012.UI.RichInput.Tool;
			var current = tool.currentRichInputBox;
			var insertCurrent;
			var i, len;
			
			tool.fireDelay("drawInsertFlag");
			tool.hidDragEffect();
			tool.hidDrawInsertFlag();

			if (!current) return;

			if (tool.dragEnable) {
				var dragItems = tool.dragItems;
				var insertFlag = tool.insertFlag;
				if (insertFlag && dragItems && insertFlag.richInputBox) {
					insertCurrent = insertFlag.richInputBox;
					// todo (add by xiaoyu)
					// 坑！
					// 拖动排序，remove写在一个循环里，这段逻辑有问题：
					//   先添加后再删除可能因排重而失败（即使有testRepeat，在拖动多个时还是有问题）
					//   先删除再添加也会因参照元素脱离DOM树而添加失败
					// 导致的表现：拖动（一个或多个）元素到已选择的元素上，一些元素会被删除
					//if(insertCurrent && insertCurrent !== current) {
						len = dragItems.length;
						for (i = 0; i < len; i++) {
							var moveItem = dragItems[i];
							insertCurrent.insertItem(moveItem.allText, {
								nearItem: insertFlag.nearItem,
								isFocusItem: true,
								testRepeat: moveItem.richInputBox === insertCurrent ? false : true //当前拖拽，不排重(手动remove)；多个实例拖拽，要排重
							});
						}
						
						for (i = 0; i < len; i++) {
							dragItems[i].remove();
						}
					//}
				}
			} else if (current.selectArea) {
				var endPosition = {
					x: e.clientX,
					y: e.clientY + tool.getPageScrollTop()
				};
				//console.log("trySelect");
				current.trySelect(current.startPosition, endPosition);

				//if (current.getSelectedItems().length == 0) {
					//todo
					//Utils.focusTextBox(current.textbox);
				//}
			} else {
				return;
			}
			if ($.browser.msie) {
				//this.releaseCapture();
				if (tool.captureElement) {
					tool.captureElement.releaseCapture();
					tool.captureElement = null;
				}
			} else {
				// todo remove
				//window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
			}
			tool.dragEnable = false;
			current.selectArea = false;
			tool.dragItems = null;
			tool.insertFlag = null;
			tool.currentRichInputBox = null;
		}
	}));

	var current;
	M2012.UI.RichInput.DocumentView.create = function () {
		if (!current) {
			current = new M2012.UI.RichInput.DocumentView();
		}
		return current;
	}
})(jQuery, _, Backbone, M139);