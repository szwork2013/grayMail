

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
            this.$el.mousemove($.proxy(this, "onMouseMove"))
                .mouseup($.proxy(this, "onMouseUp"))
                .mousedown($.proxy(this, "onMouseDown"));
        },
        onMouseMove: function (e) {
            var current = M2012.UI.RichInput.Tool.currentRichInputBox;
            if (!current) return;
            var p = {
                x: e.clientX,
                y: e.clientY + current.tool.getPageScrollTop(),
                target: e.target
            };
            if (current.tool.dragEnable) {
                current.tool.drawDragEffect(p);
                current.tool.delay("drawInsertFlag", function () {
                    current.tool.drawInsertFlag(p);
                }, 20);
                e.preventDefault();
                return;
            } else if (current.selectArea) {
                //M2012.UI.RichInput.Tool.draw(current.startPosition, p);
                current.trySelect(current.startPosition, p);
                e.preventDefault();
                return;
            }
        },
        onMouseDown: function (e) {
            var o = e.target;
            var current;
            while (o) {
                //todo 巧合编程
                if (o.className && o.className.indexOf("RichInputBox") > -1) {
                    current = M2012.UI.RichInput.getInstanceByContainer(o);
                    break;
                }
                o = o.parentNode;
            }
            M2012.UI.RichInput.Tool.currentRichInputBox = current;
            for (var i = 0; i < M2012.UI.RichInput.instances.length; i++) {
                var item = M2012.UI.RichInput.instances[i];
                if (item != current) item.unselectAllItems();
            }
        },
        onMouseUp: function (e) {
            M2012.UI.RichInput.Tool.fireDelay("drawInsertFlag");
            var current = M2012.UI.RichInput.Tool.currentRichInputBox;
            if (!current) return;
            if (M2012.UI.RichInput.Tool.dragEnable) {
                var dragItems = M2012.UI.RichInput.Tool.dragItems;
                var insertFlag = M2012.UI.RichInput.Tool.insertFlag;
                if (insertFlag && dragItems && insertFlag.richInputBox) {
                    var insertCurrent = insertFlag.richInputBox;
                    for (var i = 0; i < dragItems.length; i++) {
                        var moveItem = dragItems[i];
                        insertCurrent.insertItem(moveItem.allText, {
                            isAfter: insertFlag.isAfter,
                            element: insertFlag.element,
                            isFocusItem: true,
                            testRepeat: moveItem.richInputBox == insertCurrent ? false : true //当前拖拽，不排重(手动remove)；多个实例拖拽，要排重
                        });
                        moveItem.remove();
                    }
                    for (var i = 0; i < dragItems.length; i++) {
                        var moveItem = dragItems[i];
                        moveItem.remove();
                    }
                }
            } else if (current.selectArea) {
                var endPosition = {
                    x: e.clientX,
                    y: e.clientY + M2012.UI.RichInput.Tool.getPageScrollTop()
                };
                //M2012.UI.RichInput.Tool.draw(current.startPosition, endPosition);
                current.trySelect(current.startPosition, endPosition);
                if (current.getSelectedItems().length == 0) {
                    //todo
                    //Utils.focusTextBox(current.textbox);
                }
            } else {
                return;
            }
            if ($.browser.msie) {
                //this.releaseCapture();
                if (M2012.UI.RichInput.Tool.captureElement) {
                    M2012.UI.RichInput.Tool.captureElement.releaseCapture();
                    M2012.UI.RichInput.Tool.captureElement = null;
                }
            } else {
                window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            }
            M2012.UI.RichInput.Tool.dragEnable = false;
            current.selectArea = false;
            M2012.UI.RichInput.Tool.dragItems = null;
            M2012.UI.RichInput.Tool.insertFlag = null;
            M2012.UI.RichInput.Tool.hidDragEffect();
            M2012.UI.RichInput.Tool.hidDrawInsertFlag();
            //M2012.UI.RichInput.Tool.currentRichInputBox = null;
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