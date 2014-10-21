RichInputBox = function() {
    this.init.apply(this, arguments);
}
RichInputBox.instances = [];
RichInputBox.getInstanceByContainer = function(element) {
    for (var i = 0; i < RichInputBox.instances.length; i++) {
        var o = RichInputBox.instances[i];
        if (o.container == element || o.jContainer == element) return o;
    }
    return null;
}
RichInputBox.prototype = {
    init: function(config) {
        if (!RichInputBox.styleLoaded) this.createStyle(); //加载样式表
        if (!config.type) {
            //默认是输入邮件地址
            this.type = "email";
        } else {
            this.type = config.type;
        }
        this.autoDataSource = config.autoDataSource;
        this.autoHeight = config.autoHeight;
		this.change = config.change||function(){};
		this.errorfun = config.errorfun||'';
        var This = this;
        RichInputBox.instances.push(this);
        this.id = RichInputBox.instances.length;
        var handlerName = "RichInputBoxSetValueHandler" + RichInputBox.instances.length;
        config.container.innerHTML = '<div class="RichInputBoxLayout"><div class="RichInputBox" id="RichInputBoxID"><input backspacedeleteoff="true" tabindex="' + RichInputBox.instances.length + '" setvaluehandler="' + handlerName + '" type="text" style="padding: 2px 0 2px 1px; height:18px;"/></div></div>';
        if ($.browser.msie && $.browser <= 6) {
            config.container.firstChild.style.height = "18px";
        }
        if (config.autoHeight) {
            config.container.firstChild.style.maxHeight = "1000px";
        }
        this.container = config.container.firstChild.firstChild;
        this.jContainer = $(this.container);
        this.textbox = this.container.firstChild;
        this.jTextBox = $(this.textbox);
        this.items = {};
		this.hashMap = {};
        window[handlerName] = function() {
            This.createItemFromTextBox();
        }

        RichInputBox.Tool.bindEvent(this, this.jContainer, RichInputBox.Events.Container);
        RichInputBox.Tool.bindEvent(this, this.jTextBox, RichInputBox.Events.TextBox);

        config.plugins = RichInputBox.Plugin.getDefaultPlugin(this);
        for (var i = 0; i < config.plugins.length; i++) {
            try {
                config.plugins[i](this);
            } catch (e) { }
        }

        if (!RichInputBox.Events.bindDocument) {
            RichInputBox.Tool.bindEvent(null, $(document), RichInputBox.Events.Document);
            RichInputBox.Events.bindDocument = true;
        }
    },
    getItems: function() {
        var result = [];
        var This = this;
        this.jContainer.find("div[rel]").each(function() {
            var itemId = this.getAttribute("rel");
            var item = This.items[itemId];
            if (item) result.push(item);
        })
        return result;
    },
     isRepeat: function(addr) {
        if (this.type == "mobile") {
            var hashKey = NumberTool.getNumber(addr);
        } else if (this.type == "email") {
            var hashKey = MailTool.getAddr(addr);
        }
        if (hashKey && this.hashMap[hashKey]){
			//实现闪烁效果
			for(p in this.items){
				var item = this.items[p];
				if(item && item.hashKey == hashKey){
					var element = item.element;
					RichInputBox.Tool.blinkBox(element,'blinkColor');
					break;
				}
			}
		    return true;
		}else return false;

    },
    insertItem: function(addr, isAfter, element, isFocusItem) {
        var current = this;
        if (!element) {
            var focusText = !isAfter && !element;
            element = this.jTextBox;
        }
        //替换全角数字
        if (/[０-９]/.test(addr)) {
            addr = addr.replace(/([０-９])/g, function(c) {
                return "０１２３４５６７８９".indexOf(c);
            });
        }

        var list = addr.split(/[,;；，]/);
        for (var i = 0; i < list.length; i++) {
            var str = list[i].trim();
            if (str != "") {
                if (this.repeatable || !this.isRepeat(str)) {
                    var item = new RichInputBox.Item(current, str);
                    this.items[item.itemId] = item;
                    if (isAfter) {
                        element.after(item.element);
                    } else {
                        element.before(item.element);
                    }
                    if (isFocusItem) item.select();
                }
            }
        }
        this.clearTipText();
        this.resize();
        try {
            //如果是tab触发的blur则不处理
            if (focusText && this.textbox.getAttribute("TabPress") != "1") {
                this.textbox.focus();
            }
        } catch (e) { }
        //由于技术原因，这个浮动提示无法长期存在
        this.hideTipTextExt();
        this.hideTipTextExt = function() { };
        this.showTipTextExt = function() { };
		if(current.change){//内容发生改变时，做额外操作
		   current.change();
		};
    },
    resize: function(delay) {
        var This = this;
        RichInputBox.Tool.delay("reisze" + this.id, function() {
            RichInputBox.Tool.resizeContainer(This.container, This.autoHeight);
            if (This.onresize) This.onresize();
        }, 100);
    },
    getTextBoxNextItem: function() {
        var node = this.textbox.nextSibling;
        if (node) {
            var itemId = node.getAttribute("rel");
            if (itemId) {
                return this.items[itemId];
            }
        } else {
            return null;
        }
    },
    getTextBoxPrevItem: function() {
        var node = this.textbox.previousSibling;
        if (node) {
            var itemId = node.getAttribute("rel");
            if (itemId) {
                return this.items[itemId];
            }
        } else {
            return null;
        }
    },
    unselectAllItems: function() {
        for (var p in this.items) {
            var item = this.items[p];
            if (item) {
                item.unselect();
            }
        }
        this.lastClickItem = null;
    },
    selectAll: function() {
        for (var p in this.items) {
            var item = this.items[p];
            if (item) {
                item.select();
            }
        }
    },
    copy: function() {
        var items = this.getSelectedItems();
        var list = [];
        for (var i = 0; i < items.length; i++) {
            list.push(items[i].allText);
        }
        RichInputBox.Tool.Clipboard.setData(list);
        if ($.browser.msie) {
            window.clipboardData.setData("Text", list.join(";"));
        }
    },
    cut: function() {
        var items = this.getSelectedItems();
        var list = [];
        for (var i = 0; i < items.length; i++) {
            list.push(items[i].allText);
            items[i].remove();
        }
        RichInputBox.Tool.Clipboard.setData(list);
        if ($.browser.msie) {
            window.clipboardData.setData("Text", list.join(";"));
        }
    },
    paste: function() {
        if ($.browser.msie) {
            var text = window.clipboardData.getData("Text");
            if (text) {
                //粘贴的时候，如果内容是完整的地址，则马上转化
                if (/[;,；，]/.test(text) ||
                    (this.type == "email" && MailTool.checkEmailText(text)) ||
                    (this.type == "mobile" && NumberTool.isChinaMobileNumberText(text))
                    ) {
                    this.insertItem(text);
                    return false;
                }
                return;
            }
        }
        if (RichInputBox.Tool.Clipboard.hasData()) {
            var items = RichInputBox.Tool.Clipboard.getData();
            for (var i = 0; i < items.length; i++) {
                this.insertItem(items[i]);
            }
            return false;
        }
    },
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
    clear: function() {
        this.items = {};
        this.jContainer.find("div[rel]").remove();
    },
    removeSelectedItems: function() {
        var items = this.getSelectedItems();
        for (var i = 0; i < items.length; i++) {
            items[i].remove();
        }
    },
    createItemFromTextBox: function() {
        if (this.tipText) this.clearTipText();
        var textbox = this.textbox;
        var value = textbox.value.trim();
        if (value != "" && value != this.tipText) {
            if (this.type == "email" && /^\d+$/.test(value)) {
                value = value + "@139.com";
            }
            textbox.value = "";
            textbox.style.width = "2px";
            this.insertItem(value);
        }
    },
    moveTextBoxTo: function(insertElement, isAfter) {
        var jTextBox = this.jTextBox;
        if (isAfter) {
            insertElement.after(jTextBox);
        } else {
            insertElement.before(jTextBox);
        }
        RichInputBox.Tool.fixTextBoxWidth(jTextBox);
        window.focus();
        jTextBox.focus();
    },
    moveTextBoxToLast: function() {
        var textbox = this.textbox;
        if (textbox.parentNode.lastChild != textbox) {
            textbox.parentNode.appendChild(textbox);
        }
        if ($.browser.msie) window.focus();
        //textbox.focus();
    },
	 disposeItemData: function(item) {
        delete this.items[item.itemId];
        if (item.hashKey) delete this.hashMap[item.hashKey];
    },
    trySelect: function(p1, p2) {
        if (p1.y == p2.y && p1.x == p2.x) return;
        if (p1.y == p2.y) {
            if (p1.x < p2.x) {
                var topPosition = p1;
                var bottomPosition = p2;
            } else {
                var topPosition = p2;
                var bottomPosition = p1;
            }
        } else if (p1.y < p2.y) {
            var topPosition = p1;
            var bottomPosition = p2;
        } else {
            var topPosition = p2;
            var bottomPosition = p1;
        }
        var startElement;
        var elements = this.jContainer.find("div");
        var itemHeight;
        for (var i = 0; i < elements.length; i++) {
            var element = elements.eq(i);
            var offset = element.offset();
            var x = offset.left + element.width();
            var y = offset.top + element.height();
            var selected = false;
            if (!itemHeight) itemHeight = element.height();
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
            var itemObj = this.items[element.attr("rel")];
            if (selected) {
                itemObj.select();
            } else {
                itemObj.unselect();
            }
        }
    },
    itemIdNumber: 0,
    getNextItemId: function() {
        return this.itemIdNumber++;
    },
    setTipText: function(text) {
        this.tipText = text;
        var jTxt = this.jTextBox;
        jTxt.val(text);
        jTxt.css("color", "silver")
        .val(text);
        this.showTipText = true;
        if(!this.bindTipTextBoxEvent){//避免调用setTipText的时候重复绑定
        	jTxt.mousedown(this.clearTipText).keydown(this.clearTipText);
        	this.bindTipTextBoxEvent=true;
        }
        var maybeHidden = true;
        setTimeout(function () {
            RichInputBox.Tool.fixTextBoxWidth(jTxt, maybeHidden);
        }, 100);
    },
    setTipTextExt: function(text) {
        var This = this;
        this.tipTextExt = text;
        var jTxt = this.jTextBox;
        jTxt.focus(function() {
            This.showTipTextExt();
        }).blur(function() {
            This.hideTipTextExt();
        });
    },
    hideTipTextExt: function() {
        if (this.tipTextExtContainer) this.tipTextExtContainer.hide();
    },
    showTipTextExt: function() {
        if (!this.tipTextExt) return;
        var jContainer = this.jContainer;
        if (!this.tipTextExtContainer) {
            this.tipTextExtContainer = $("<div style='font-size:12px;position:absolute;padding:3px 5px 3px 5px;border:1px solid silver;'></div>")
            .text(this.tipTextExt).appendTo(document.body);
        }
        var offset = jContainer.offset();
        this.tipTextExtContainer.css({
            left: offset.left - 2,
            top: offset.top + jContainer.height() + 1,
            display: ""
        });
    },
    clearTipText: function(e) {
    	//这里的this既有可能是文本框，也有可能是richinput
    	var current = (e && e.richInputBox)||this;

        var jTxt = this.jTextBox || $(this);
        if (current.tipText && jTxt.val() == current.tipText) {
            jTxt.val("")
            .css("color", "black")
        }
        this.showTipText = false;
        setTimeout(function(){
            RichInputBox.Tool.fixTextBoxWidth(jTxt);
        },0);
    },
    focus: function() {
        try {
            if ($.browser.msie) {
                this.textbox.focus();
            } else {
                this.textbox.select(); //select焦点不会自动滚动到文本框
            }
        } catch (e) { }
    },
    hasItem: function() {
        return this.getItems().length > 0;
    },
    getRightEmails: function() {
        var items = this.getItems();
        var result = [];
        for (var i = 0; i < items.length; i++) {
            if (!items[i].error) {
                result.push(items[i].allText);
            }
        }
        return result;
    },
    getRightNumbers: function() {
        return this.getRightEmails();
    },
    getErrorText: function() {
        var items = this.getItems();
        for (var i = 0; i < items.length; i++) {
            if (items[i].error) {
                return items[i].allText;
            }
        }
        return null;
    },
    createStyle: function() {
        var htmlCode = "<style type='text/css'>b{font-weight:normal}\
.RichInputBoxLayout{\
	padding:0 0 1px;\
	min-height:18px;\
	max-height:45px;\
	overflow-x:hidden;\
	overflow-y:auto;\
	border-color:#7c7c7c #c3c3c3 #c3c3c3 #9a9a9a;\
	border-style:solid;\
	border-width:1px;\
	background-color:white\
}\
#RichInputBoxID\
{\
	height:auto;\
	font-size:12px;\
	font-family:Tahoma;\
	cursor:text;\
	width:100%;\
	float:left;\
	_float:none;\
	}\
#RichInputBoxID .addrItem\
{\
	border-color:#a0a0a0;\
	color:#a0a0a0;\
	float:left;\
	font-family:Tahoma;\
	font-size:12px;\
	height:16px;\
	line-height:16px;\
	margin:1px 5px 1px 1px;\
	white-space:nowrap;\
	cursor:default;\
	}\
#RichInputBoxID .mouseover\
{\
	background-color:#eee;\
}\
#RichInputBoxID .addrItem b\
{\
	white-space:nowrap;\
	font-family:Tahoma;\
	font-size:12px;\
	color:#000;\
	border-color:#000;\
}\
#RichInputBoxID .addrItem span\
{\
	white-space:nowrap;\
	font-family:Tahoma;\
	font-size:12px;\
	color:#a0a0a0;\
	border-color:#a0a0a0;\
	cursor:default;\
}\
#RichInputBoxID .addrItem span.error\
{\
	color:Red;\
}\
#RichInputBoxID .selected span.error\
{\
	color:white;\
}\
#RichInputBoxID .selected\
{\
	background-color:rgb(50,119,222);\
	color:white;\
}\
#RichInputBoxID .selected b,#RichInputBoxID .selected span\
{\
	color:white;\
}\
#RichInputBoxID input\
{\
	background-color:Transparent;\
	font-family:Tahoma;\
	font-size:12px;\
	height:16px;\
	padding:1;\
	float:left;\
	border:0;\
	margin:0;\
	}\
#RichInputBoxID input[type='text']:focus\
{\
    border:0;\
    background:white;\
}\
</style>";
        $(htmlCode).appendTo(document.body);
        RichInputBox.styleLoaded = true;
    }
}

//tool.js

RichInputBox.Tool = {
    unselectable: function(element) {
        if ($.browser.msie) {
            element.unselectable = "on";
        } else {
            element.style.MozUserSelect = "none";
            element.style.KhtmlUserSelect = "none";
        }
    },
    fixTextBoxWidth: function (jText, maybeHidden) {
        var This = this;
		var current = RichInputBox.Events.currentRichInputBox;
	    if(current&&current.change){current.change();}
        if (this.tagName == "INPUT") {
            jText = $(this);
        }
        var minWidth = 10;
        if (jText.val() == "") {
            jText.width(minWidth);
            return;
        }
        if ($.browser.msie && !maybeHidden) {
            var width = jText[0].createTextRange().boundingWidth + 13;
        } else {
            var widthHelper = $("#widthHelper");
            if (widthHelper.length == 0) {
                widthHelper = $("<span style='position:absolute;left:0px;top:0px;visibility:hidden;'\
                id='widthHelper'></span>").appendTo(document.body);
                widthHelper.css({
                    fontSize: jText.css("font-size"),
                    fontFamily: jText.css("font-family"),
                    border: 0,
                    padding: 0
                });
            }
            var width = widthHelper.text(jText.val().replace(/ /g, "1")).width() + 13;
        }
        var maxWidth = jText.parent().width();
        maxWidth = maxWidth > 100 ? maxWidth : 500;
        maxWidth -= 3;
        if (width > maxWidth) width = maxWidth;
        if (width < minWidth) width = minWidth;
        jText.width(width);
    },
    resizeContainer: function(element, autoHeight) {
        element = element.parentNode;
        if (autoHeight) {
            if (element.style.height != "auto") element.style.height = "auto";
            return;
        }

        var oldHeight = element.style.height;
        //ie下计算高度
        if ($.browser.msie && $.browser.version <= 6) {
            element.style.height = "18px";
            if (element.scrollHeight > element.clientHeight) {
                element.style.height = Math.min(45, element.scrollHeight) + "px";
            }
        }
        var newHeight = element.style.height;
        if (oldHeight != newHeight) {
            return true;
        }
        return false;
        //element.scrollTop = 1000;
        //if (element) element.parentNode.scrollTop = 1000;
        //改成textbox.focus?
    },
    //根据坐标获取最接近的item
    getNearlyElement: function(param) {
        var current = param.richInputBox;
        //得到当前坐标所在行的元素
        var jElements = current.jContainer.find("div");
        var rowsElements = [];
        for (var i = 0; i < jElements.length; i++) {
            var jElement = jElements.eq(i);
            var _y = jElement.offset().top;
            if (param.y > _y && param.y < _y + jElement.height()) {
                rowsElements.push(jElement);
            }
        }
        //获得插入点
        var overElemet;
        var isAfter = true;
        for (var i = 0; i < rowsElements.length; i++) {
            var jElement = rowsElements[i];
            var offset = jElement.offset();
            var _x = offset.left;
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
            }
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
                })
            })(func));
        }
    },
    draw: function(p1, p2) {
        if (!window.drawDiv) {
            window.drawDiv = $("<div style='position:absolute;left:0px;top:0px;border:1px solid blue;'></div>")
            .appendTo(document.body);
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
    Clipboard: {
        setData: function(arr) {
            this.items = arr;
        },
        hasData: function() {
            return Boolean(this.items) && this.items.length > 0;
        },
        getData: function() {
            return (this.items || []).concat();
        }
    },
    hidDragEffect: function() {
        if (this.dragEffectDiv) this.dragEffectDiv.hide();
    },
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
    drawInsertFlag: function(p) {
        if (!this.drawInsertFlagDiv) {
            this.drawInsertFlagDiv = $("<div style='position:absolute;\
            background-color:black;width:1px;height:15px;z-index:5000;overflow:hidden;border:0;'></div>").appendTo(document.body);
        }
        var hitRichInputBox;
        for (var i = 0; i < RichInputBox.instances.length; i++) {
            var rich = RichInputBox.instances[i];
            if (RichInputBox.Tool.isContain(rich.container, p.target)) {
                hitRichInputBox = rich;
                break;
            }
        }
        if (hitRichInputBox) {
            var nearItem = RichInputBox.Tool.getNearlyElement({
                richInputBox: hitRichInputBox,
                x: p.x,
                y: p.y
            });
        }
        if (nearItem) {
            var offset = nearItem.element.offset();
            this.drawInsertFlagDiv.css({
                left: offset.left + (nearItem.isAfter ? (nearItem.element.width() + 2) : -2),
                top: offset.top,
                display: "block"
            });
            this.insertFlag = { element: nearItem.element, isAfter: nearItem.isAfter, richInputBox: hitRichInputBox };
        } else {
            this.insertFlag = { richInputBox: hitRichInputBox };
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
	blinkBox: function(obj,className){
        var This = this;
        obj.addClass(className);
        var keep;
        var loop = setInterval(function(){
            if(keep)clearTimeout(keep);
			
            obj.addClass(className);
            keep = setTimeout(function(){obj.removeClass(className);},100);
        },200);
        setTimeout(function(){
            if(loop) clearInterval(loop);
        },1000);
    }
}

//items.js

RichInputBox.Item = function() { this.init.apply(this, arguments); }
RichInputBox.Item.prototype = {
    init: function(richInputBox, text) {
        var This = this;
        this.richInputBox = richInputBox;
        this.itemId = richInputBox.getNextItemId();
        this.allText = text;
        if (richInputBox.type == "email") {
            if(richInputBox.errorfun){
		     richInputBox.errorfun(this,text);
		   }else{
		    this.error = !MailTool.checkEmailText(text);
            this.errorMsg = "该地址格式有错，请双击修改";
		   }
        } else if (richInputBox.type == "mobile") {
            this.error = !NumberTool.isChinaMobileNumberText(text);
            this.errorMsg = "该号码非移动手机号";
        }
        if (this.error) {
            var element = this.element = $("<div class='addrItem' title='{0}'><span unselectable='on' class='error'></span>;</div>".format(this.errorMsg));
            element.find("span:eq(0)").text(text);
        } else {
            var element = this.element = $("<div unselectable='on' class='addrItem'><b unselectable='on'></b><span unselectable='on'></span>;</div>");
            if (richInputBox.type == "email") {
                var addr = this.addr = MailTool.getAccount(text) + "@" + MailTool.getDomain(text);
                richInputBox.hashMap[this.hashKey = addr.toLowerCase()] = true;
			    if (text.indexOf("<") != -1) {
                    element.find("b").text("\"" + MailTool.getName(text) + "\"");
                    element.find("span:eq(0)").text("<" + addr + ">");
                } else {
                    element.find("b").text(addr);
                }
                element.attr("title", text);
            } else {
                var number = NumberTool.getNumber(text);
				richInputBox.hashMap[this.hashKey = number.toLowerCase()] = true;
                if (text.indexOf("<") != -1) {
                    element.find("b").text("\"" + NumberTool.getName(text) + "\"");
                    element.find("span:eq(0)").text("<" + number + ">");
                } else {
                    element.find("b").text(number);
                }
                element.attr("title", number);
            }
        }
        element.attr("rel", this.itemId);
        RichInputBox.Tool.unselectable(element[0]);
        this.selected = false;
        RichInputBox.Tool.bindEvent(richInputBox, element, RichInputBox.Events.Items);
    },
    select: function() {
        var element = this.element;
        element.addClass("selected");
        richInputBox = this.richInputBox;
        this.selected = true;
        if ($.browser.msie) {
            var jTextBox = richInputBox.jTextBox;
            RichInputBox.Tool.delay("ItemFocus", function() {
                  // var range = document.body.createTextRange();
               // range.collapse();
               // range.select(); //强制textbox失焦点
              //  element.focus();
			   richInputBox.focus();
            });
        } else if ($.browser.opera) {
            var scrollTop = richInputBox.container.parentNode.scrollTop;
            richInputBox.textbox.focus();
            richInputBox.container.parentNode.scrollTop = scrollTop;
        } else {
            richInputBox.focus();
        }
    },
    unselect: function() {
        this.element.removeClass("selected");
        this.selected = false;
    },
    remove: function() {
        delete this.richInputBox.items[this.itemId];
		this.richInputBox.disposeItemData(this);
        this.element.remove();
        this.richInputBox.resize();
    }
};

//events.js

Keys={
    A:65,
    C:67,
    X:88,
    V:86,
    Enter:13,
    Space:32,
    Left:37,
    Up:38,
    Right:39,
    Down:40,
    Delete:46,
    Backspace:8,
    Semicolon: ($.browser.mozilla || $.browser.opera) ? 59 : 186,//分号
    Comma:188,//逗号
    Tab:9
}
RichInputBox.Events = {
    Document: {
        mousemove: function(e) {
            var current = RichInputBox.Events.currentRichInputBox;
            if (!current) return;
            var p = {
                x: e.clientX,
                y: e.clientY,
                target: e.target
            };
            if (RichInputBox.Tool.dragEnable) {
                RichInputBox.Tool.drawDragEffect(p);
                RichInputBox.Tool.delay("drawInsertFlag", function() {
                    RichInputBox.Tool.drawInsertFlag(p);
                }, 20);
                e.preventDefault();
                return;
            } else if (current.selectArea) {
                //RichInputBox.Tool.draw(current.startPosition, p);
                current.trySelect(current.startPosition, p);
                e.preventDefault();
                return;
            }
        },
        mousedown: function(e) {
            var o = e.target;
            var current;
            while (o) {
                if (o.className == "RichInputBox") {
                    current = RichInputBox.getInstanceByContainer(o);
                    break;
                }
                o = o.parentNode;
            }
            RichInputBox.Events.currentRichInputBox = current;
            for (var i = 0; i < RichInputBox.instances.length; i++) {
                var item = RichInputBox.instances[i];
                if (item != current) item.unselectAllItems();
            }
        },
        mouseup: function(e) {
            RichInputBox.Tool.fireDelay("drawInsertFlag");
            var current = RichInputBox.Events.currentRichInputBox;
            if (!current) return;
            if (RichInputBox.Tool.dragEnable) {
                var dragItems = RichInputBox.Tool.dragItems;
                var insertFlag = RichInputBox.Tool.insertFlag;
                if (insertFlag && dragItems && insertFlag.richInputBox) {
                    var insertCurrent = insertFlag.richInputBox;
                    current.repeatable = true;
                    for (var i = 0; i < dragItems.length; i++) {
                        var moveItem = dragItems[i];
                        insertCurrent.insertItem(moveItem.allText, insertFlag.isAfter, insertFlag.element, true);
                    }
                    current.repeatable = false;
                    for (var i = 0; i < dragItems.length; i++) {
                        var moveItem = dragItems[i];
                        moveItem.remove();
                    }
                }
            } else if (current.selectArea) {
                var endPosition = {
                    x: e.clientX,
                    y: e.clientY
                };
                //RichInputBox.Tool.draw(current.startPosition, endPosition);
                current.trySelect(current.startPosition, endPosition);
                if (current.getSelectedItems().length == 0) {
                    Utils.focusTextBox(current.textbox);
                }
            } else {
                return;
            }
            if ($.browser.msie) {
                //this.releaseCapture();
                if (RichInputBox.Events.captureElement) {
                    RichInputBox.Events.captureElement.releaseCapture();
                    RichInputBox.Events.captureElement = null;
                }
            } else {
                window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            }
            RichInputBox.Tool.dragEnable = false;
            current.selectArea = false;
            RichInputBox.Tool.dragItems = null;
            RichInputBox.Tool.insertFlag = null;
            RichInputBox.Tool.hidDragEffect();
            RichInputBox.Tool.hidDrawInsertFlag();
            //RichInputBox.Events.currentRichInputBox = null;
        }
    },
    Container: {
        keydown: function(e) {
            if (e.target.tagName == "INPUT" && e.target.value != "") return;
            var current = e.richInputBox;
            current.resize();
            switch (e.keyCode) {
                case Keys.Backspace:
                    {
                        return KeyDown_Backspace.apply(this, arguments);
                    }
                case Keys.Delete:
                    {
                        return KeyDown_Delete.apply(this, arguments);
                    }
                case Keys.A:
                    {
                        if (e.ctrlKey) return KeyDown_Ctrl_A.apply(this, arguments);
                    }
                case Keys.C:
                    {
                        if (e.ctrlKey) return KeyDown_Ctrl_C.apply(this, arguments);
                    }
                case Keys.X:
                    {
                        if (e.ctrlKey) return KeyDown_Ctrl_X.apply(this, arguments);
                    }
                case Keys.V:
                    {
                        if (e.ctrlKey) return KeyDown_Ctrl_V.apply(this, arguments);
                    }
            }
            function KeyDown_Backspace(e) {
                var selecteds = current.getSelectedItems();
                if (selecteds.length > 0) {
                    current.moveTextBoxTo(selecteds[0].element);
                }
                current.removeSelectedItems();
                window.focus();
                current.jTextBox.focus();
                e.preventDefault();
            }
            function KeyDown_Delete(e) {
                var selecteds = current.getSelectedItems();
                if (selecteds.length > 0) {
                    current.moveTextBoxTo(selecteds[0].element);
                }
                current.removeSelectedItems();
                window.focus();
                current.jTextBox.focus();
            }
            function KeyDown_Ctrl_A(e) {
                current.selectAll();
                e.preventDefault();
            }
            function KeyDown_Ctrl_C(e) {
                return current.copy();
            }
            function KeyDown_Ctrl_X(e) {
                return current.cut();
            }
            function KeyDown_Ctrl_V(e) {
                return current.paste();
            }
        },
        click: function(e) {
            if (e.target.className != "RichInputBox") return;
            var current = e.richInputBox;
            if (current.getSelectedItems().length > 0) return; //鼠标划选时不触发
            var nearItem = RichInputBox.Tool.getNearlyElement({
                richInputBox: current,
                x: e.clientX,
                y: e.clientY
            });
            if (nearItem) current.moveTextBoxTo(nearItem.element, nearItem.isAfter);
        },
        mousedown: function(e) {
            var current = e.richInputBox;
            var target = e.target;
            if (target.parentNode && target.parentNode.className.indexOf("addrItem") != -1) {
                target = target.parentNode;
            }
            current.startPosition = {
                x: e.clientX,
                y: e.clientY
            };
            if (target.className.indexOf("addrItem") != -1) {
                RichInputBox.Tool.dragEnable = true;
                var itemId = target.getAttribute("rel");
                var clickItem = current.items[itemId];
                var items = current.getSelectedItems();
                if ($.inArray(clickItem, items) == -1) {
                    items.push(clickItem);
                }
                RichInputBox.Tool.dragItems = items;
            } else if (target == current.container || (target.tagName == "INPUT" && target.value == "")) {
                current.unselectAllItems();
                current.createItemFromTextBox();
                current.moveTextBoxToLast();
                current.selectArea = true;
                //e.preventDefault();
            } else {
                RichInputBox.Tool.dragEnable = false;
                current.selectArea = false;
                //e.preventDefault();
                return;
            }
            if ($.browser.msie) {
                RichInputBox.Events.captureElement = this;
                this.setCapture();
            } else {
                window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            }
            RichInputBox.Events.currentRichInputBox = current;
        }
    },
    TextBox: {
        keyup: RichInputBox.Tool.fixTextBoxWidth,
        paste: function() {
            RichInputBox.Tool.fixTextBoxWidth.call(this);
            if (window.navigator.userAgent.indexOf("Firefox") >= 0) {
                var This = this;
                setTimeout(function() {
                    var text = This.value;
                    This.value = "";
                    This.value = text; //火狐下的文本框渲染bug
                }, 0);
            }
        },
        cut: RichInputBox.Tool.fixTextBoxWidth,
        focus: function(e) {
        	if(e && e.richInputBox)e.richInputBox.clearTipText();
            _LastFocusAddressBox = e.richInputBox; //耦合代码
        },
        blur: function(e) {
            var current = e.richInputBox;
            if (this.getAttribute("dblclicking") == "1") {
                this.setAttribute("dblclicking", null);
                return;
            }
            current.createItemFromTextBox();
            
            //优化，失去焦点后显示tip文本
            if(current.getItems()==0 && current.tipText){
            	current.setTipText(current.tipText);
            }
        },
        keydown: function(e) {
            RichInputBox.Tool.fixTextBoxWidth.call(this);
            if (e.shiftKey || e.ctrlKey) return;
            var current = e.richInputBox;
            switch (e.keyCode) {
                case Keys.Backspace:
                    {
                        return KeyDown_Backspace.apply(this, arguments);
                    }
                case Keys.Delete:
                    {
                        return KeyDown_Delete.apply(this, arguments);
                    }
                case Keys.Semicolon:
                case Keys.Comma:
                case Keys.Enter:
                    {
                        return KeyDown_Enter.apply(this, arguments);
                    }
                case Keys.Left:
                    {
                        return KeyDown_Left.apply(this, arguments);
                    }
                case Keys.Right:
                    {
                        return KeyDown_Right.apply(this, arguments);
                    }
                case Keys.Up: case Keys.Down:
                    {
                        e.isUp = e.keyCode == Keys.Up;
                        return KeyDown_Up_Down.apply(this, arguments);
                    }
                case Keys.Tab:
                    {
                        return KeyDown_Tab.apply(this, arguments);
                    }
            }
            function KeyDown_Backspace(e) {
                if (this.value == "") {
                    if (current.getSelectedItems().length > 0) return;
                    var item = current.getTextBoxPrevItem();
                    if (item) item.remove();
                    this.focus();
                }
            }
            function KeyDown_Delete(e) {
                if (this.value == "") {
                    var item = current.getTextBoxNextItem();
                    if (item) item.remove();
                    this.focus();
                }
            }
            function KeyDown_Enter(e) {
                if (this.value.trim() != "") {
                    setTimeout(function() {
                        current.createItemFromTextBox();
                    }, 0);
                }
                return false;
            }
            function KeyDown_Left(e) {
                if (this.value == "") {
                    var item = current.getTextBoxPrevItem();
                    if (item) {
                        current.jTextBox.insertBefore(item.element);
                        current.jTextBox.focus();
                        if ($.browser.msie) {
                            current.textbox.createTextRange().select();
                        }
                        return false;
                    }
                }
            }
            function KeyDown_Right(e) {
                if (this.value == "") {
                    var item = current.getTextBoxNextItem();
                    if (item) {
                        current.jTextBox.insertAfter(item.element);
                        current.jTextBox.focus();
                        if ($.browser.msie) {
                            current.textbox.createTextRange().select();
                        }
                        return false;
                    }
                }
            }
            function KeyDown_Up_Down(e) {
                if (this.value == "") {
                    var offset = current.jTextBox.offset();
                    var nearItems = RichInputBox.Tool.getNearlyElement({
                        x: offset.left,
                        y: offset.top + (e.isUp ? -5 : 20),
                        richInputBox: current
                    });
                    if (nearItems) current.moveTextBoxTo(nearItems.element, nearItems.isAfter);
                    return false;
                }
            }
            function KeyDown_Tab(e) {
                this.setAttribute("TabPress", "1");
                var This = this;
                setTimeout(function() {
                    This.setAttribute("TabPress", null);
                }, 0);
            }
        }
    },
    Items: {
        dblclick: function(e) {
            var current = e.richInputBox;
            var item = current.items[this.getAttribute("rel")];
            item.element.replaceWith(current.jTextBox);
            item.remove();
            current.textbox.value = item.allText + ";";
            RichInputBox.Tool.fixTextBoxWidth.call(current.textbox);
            current.textbox.setAttribute("dblclicking", "1"); //防止自动触发blur
            Utils.focusTextBox(current.textbox);
            setTimeout(function() {
                current.textbox.setAttribute("dblclicking", null);
            }, 0);
        },
        mousedown: function(e) {
            var current = e.richInputBox;
            if (!e.shiftKey && !e.ctrlKey) {
                var item = current.items[this.getAttribute("rel")];
                if (!item.selected) {
                    var selectItems = current.getSelectedItems();
                    for (var i = 0; i < selectItems.length; i++) {
                        selectItems[i].unselect();
                    }
                }
                item.select();
            }
        },
        click: function(e) {
            this.focus();
            var current = e.richInputBox;
            var item = current.items[this.getAttribute("rel")];
            if (!e.shiftKey && !e.ctrlKey) {
                current.unselectAllItems();
                item.select();
            } else if (e.shiftKey) {
                shiftSelectItem(item);
            } else if (e.ctrlKey) {
                item.selected ? item.unselect() : item.select();
            }
            current.lastClickItem = item;

            function shiftSelectItem(item) {
                if (!current.lastClickItem || current.lastClickItem == item) return;
                var items = current.getItems();
                var a = $.inArray(current.lastClickItem, items);
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
            }
        },
        mouseover: function(e) {
            if (this.removeClassTimer) {
                clearTimeout(this.removeClassTimer);
            }
            $(this).addClass("mouseover");
        },
        mouseout: function(e) {
            var element = $(this)
            this.removeClassTimer = setTimeout(function() { element.removeClass("mouseover"); }, 0);
        }
    }
}

//plugin.js

RichInputBox.Plugin = {
    AutoComplete: function (richInputBox) {
        top.M2012.Contacts.getModel().requireData(function () {
            AutoCompleteMenu.createAddrMenu(richInputBox.textbox, true);
        });
    },
    AutoCompleteMobile: function (richInputBox) {
        top.M2012.Contacts.getModel().requireData(function () {
            AutoCompleteMenu.createPhoneNumberMenuFromLinkManList(richInputBox.textbox, true);
        });
    },
    getDefaultPlugin: function (richInputBox) {
        if (richInputBox.type == "email") {
            return [RichInputBox.Plugin.AutoComplete];
        } else if (richInputBox.type == "mobile") {
            return [RichInputBox.Plugin.AutoCompleteMobile];
        }
        return [];
    }
}