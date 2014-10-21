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
﻿/**
 * 按模板生成列表类
 * @author sunsc
 * @param {Object} options
 * var list=new ListByTemplate({listContainer:列表容器,linkContainer:链接容器});
 */
function ListByTemplate(options){
	//默认配置参数
	this.options={
		//列表容器，ID或DOM对象
		listContainer:null,
		//链接容器，ID或DOM对象
		linkContainer:null,
		//在链接中显示好友名称数量
		showFriendsNameCountAtLink:3,
		//父级模板，使用时使用itemTemplate替换@itemEleStr标记形成Dom元素
		parentTemplate:"<ul class=\"sendBless\">@itemEleStr</ul>",
		//列表模板，其中@XXX标记在下面绑定数据匿名方法中找到对应
		itemTemplate:"<li><span class=\"fr\"><span class=\"c_7B7C80\">@Status&nbsp;&nbsp;</span><span class=\"c_9B8DA6\">@showBirDay</span></span><input @inputChecked id=\"@chkid\" value=\"@MobilePhone,@BirDay\" type=\"checkbox\">&nbsp;<label for=\"@chkid\">@AddrName</label>&nbsp;<span class=\"c_999\">@showMobilePhone</span></li>",		
		//链接模板
		linkTemplate:"<i class=\"birthdayIco\"></i>&nbsp;<a href=\"#;\">你有@count位好友即将过生日：@friends</a>",
		//数据源，格式详见constructorData
		dataSource:null,
		//替换模板中指点元素的正则表达式
		replaceRegByTemplate:/\@(\w+)/ig,
		//列表点击回调方法
		itemOnClickCallBack:null,
		//列表元素字符串
		itemEleStr:"",
		//父亲元素字符串
		parentEleStr:"",
		//链接元素字符串
		linkEleStr:"",
		//实例化后马上渲染DOM
		isRender:true,
		//已经发送过的手机号集合，字符串
		sentNumbers:"",
		//说明文字
		explainMsg:"已发送祝福",
		//已经选中的缓存
		selectedItemCache:"",
		//随机数
		random:Math.random().toString(),
		//设置缓存id模式
		setCacheIdMode:"birthdayFriendList",
		/**
		 * 取手机号码
		 * @param {string} mobilePhone 手机号码
		 * @return {Object} 返回取手机号码的正则表达式
		 */
		getMobilePhoneReg:function(mobilePhone){
			return "string"==typeof mobilePhone && new RegExp("("+mobilePhone+"{1,13},?)")|| "";
		},
		/**
		 * 得到状态
		 * @param {Object} phoneNumber 检查号码
		 * @param {Object} sentNumbers 已经发送的号码集体
		 * @param {Object} statusMsg 说明文字
		 */
		getStatus:function(phoneNumber,sentNumbers,explainMsg,day,month){
			explainMsg=explainMsg || "";
			var showDifDays = function(){
			   var explainMsg = '';
			   var date = new Date();
			   var nowDay = date.getDate();
			   var nowMonth = date.getMonth()+1;
			   var dif ="";
			   if(nowMonth==month){
			      dif = parseInt(day -nowDay);
			   }else{
			      dif = parseInt(DateTool.daysOfMonth() -nowDay)+parseInt(day,10);
			   }
			   if(0<dif&&dif<10){
				 explainMsg = "还有0"+dif+"天";
			   }else if(dif>=10){
				  explainMsg = "还有"+dif+"天";
			  }
			  return explainMsg;
			}
			if("string"==typeof phoneNumber &&"string"==typeof sentNumbers){
				//如果没有发送号码，显示空
				if(!sentNumbers){
					explainMsg="";
					explainMsg = showDifDays();
				}else{
					//如果有发送，则按形参显示提示
					var isSend = sentNumbers.indexOf(phoneNumber)>-1;
					if(!isSend){
					  explainMsg =  showDifDays();
					}else{
					  explainMsg = explainMsg;
					}
				}
			}
			return explainMsg;
		}
	};
	//数据源是否加载完成或是否有数据源，组件中的方法会根据此值来判断是否运行，为false时不会运行
	this.dataIsReady=false;
	//参数缓存变量
	var _options=null;
	//缓存变量
	_options=this.options||null;
	if("object"==typeof this.options){
		//继承传入参数
		_options=ListByTemplate.extend(_options,options);
	}

	/**
	 * 初始化缓存对象id，存放到top变量中
	 * @param {Object} instance 当前实例
	 * @param {string} byMode 模式
	 * @param {Object} _listContainer 容器对象
	 */
	(function(instance,byMode,_listContainer){
		//缓存id
		var id="";
		switch(byMode){
			case "byContainer"://按容器对象的id存放
				//如果容器标识是字符串，则直接使用
		        if ("string" == typeof _listContainer) {
					//id标识加随机数
		            id= _listContainer + "_" + _options.random;
		        }
		        else {
					//如果容器是DOM对象，则使用其ID
		            if (_listContainer && _listContainer.id) {
						id = _listContainer.id + "_" + _options.random;
		            }
		        }
			break;
			default://默认按全局对象id存放，传入的模式就是ID
				id=byMode;
			break;
		}
		//赋给当前对象缓存id
		instance.options["cacheId"]=id;
	})(this,_options.setCacheIdMode,_options.listContainer);
	
	/**
	 * 构造数据源
	 * @param {Object} _this 当前BirthdayReminder的实例
	 * @param {array} dataSource 数据源
	 */
	(function(instance,dataSource){
		//模拟数据源，基线上线时删除
		//构造测试数据，上线基线要去掉，此逻辑只用在研发期间，测试和上线时要删掉
		//_options.dataSource=ListByTemplate.constructorData();
		//如果有数据源
		if(dataSource && typeof dataSource=="object"){
			//数据源是否加载完成标记
			instance.dataIsReady=true;
		}
	})(this,_options.dataSource);
	/**
	 * 绑定数据
	 * @param {Object} instance 当前BirthdayReminder的实例
	 * @param {Object} options 参数集合
	 * @param {array} dataSource 数据源
	 * @param {string} itemTemplate 列表模板
	 * @param {string} linkTemplate 链接模板
	 * @param {Object} replaceRegByTemplate 替换模板中指点元素的正则表达式
	 * @param {string} sentNumbers 已经发送过的手机号集合，字符串
	 * @param {string} cacheId 缓存ID
	 */
	(function(instance,options,dataSource,itemTemplate,linkTemplate,replaceRegByTemplate,sentNumbers,cacheId){
		//检查数据源
        if (typeof dataSource=="object" && instance.dataIsReady) {
			//取缓存
			var selectedItemCache=top[cacheId]||"";
			//得到缓存放到局部变量中
			selectedItemCache=selectedItemCache && selectedItemCache["selectedItemCache"]||"";
			//得到缓存放到实例中
			instance.options.selectedItemCache=selectedItemCache;
			//存放列表字符串数组
			var itemArr=[],
				//好友名字集合
				friendsArr=[],
				//手机号集合
				mobileArr=[],
				//删除86正则表达式
				del86=/^86/,
				//dataSource长度
				count=dataSource.length,
				//好友姓名
				addName="",
				//好友组名
				fullGroupName = "",
				//手机号
				mobilePhone="",
				//构造已经选择的列表
				selectedItem=(function(){
					return typeof selectedItemCache=="string" && selectedItemCache.match(/(\d{1,13}),?/g)||null;
				})();
                //循环前先递减
				var isSendCard = false;
                for (var i=0;i<count;i++) {
					//手机号码，去86的
					if(!dataSource[i]["MobilePhone"]){
						break;
					}
					mobilePhone=dataSource[i]["MobilePhone"].toString().trim().replace(del86, "");
                    //按正则替换后放到数组中
                    itemArr.push(itemTemplate.replace(replaceRegByTemplate, function(p0, p1){
                        //对应数据源得到值
                        var val = dataSource[i][p1];
                        //根据P1返回对应的替换值
                        switch (p1) {
							//是否选中列表
							case "inputChecked":
								//默认不选择
								val="";
								//如果已选择列表中有数据
								if(Utils.queryString("singleBirthDay")){
								 val="checked";
								  break;
								};
								if(selectedItem){
									for(var iList=0,lList=selectedItem.length;iList<lList;iList++){
										//比如当前手机和已选择列表中的数据，存在则选择
										if(selectedItem[iList].replace(",","")==mobilePhone){
											val="checked";
										}
									}
								}
								else{
									//当前复选框状态默认选择
									isSendCard = sentNumbers.indexOf(mobilePhone)>-1?true:false;
									if(!isSendCard){
										val="checked";
										//增加到选择列表的缓存中
										options.listContainer && instance.addSelectedItem(mobilePhone);
									}
								}
								break;
								//显示生日
							case "showBirDay":
								//正则匹配取得日期
								var dateArr=dataSource[i]["BirDay"].toString().match(/(\d+)-(\d+)-(\d+)/),
									//月份
									month=dateArr[2],
									//天
									day=dateArr[3];
									//月份没有零时要补位
									month.length==1 && (month="0"+month);
									//天没有零时要补位
									day.length==1 && (day="0"+day);
								//组合显示
								val=dateArr && dateArr.length==4 && month+"月"+day+"日"||"";
								dateArr=null;
								break;
							case "showMobilePhone":
								//好友姓名
								fullGroupName=dataSource[i]["fullGroupName"];
								//如果有好友姓名
								fullGroupName = top.$TextUtils.htmlEncode(fullGroupName);
								if(fullGroupName){
									val = "("+fullGroupName+")";
								}
								else{
									val= "("+mobilePhone +")";
								}
								break;
                            	//好友名称，则放入数组中
                            case "AddrName":
							      if(val&&val.match(/^</)) val = top.top.Utils.htmlEncode(val);
                                   friendsArr.push(val);
								   mobileArr.push(mobilePhone);
								   if(friendsArr.join(',').getBytes()>10){//out
										friendsArr.pop();
										mobileArr.pop();
								   }

								
                                break;
                            	//复选框ID
                            case "chkid":
                                val = "chkid_" + mobilePhone;
                                break;
                            	//手机号去86
                            case "MobilePhone":
                                val = mobilePhone;
                                break;
                            	//状态
                            case "Status":
                              //得到号码
                                val = mobilePhone;
                                //显示状态消息
								var dateArr=dataSource[i]["BirDay"].toString().match(/(\d+)-(\d+)-(\d+)/);
								var day=dateArr[3];
                                var month = dateArr[2];
                                val = options.getStatus(val, sentNumbers, options.explainMsg,day,month);
                                break;
                            default:
                                break;
                        }
                        return val || "";
                    }));
                }
			//列表元素字符串
			options.itemEleStr=itemArr.join("");
			//链接元素字符串，控制显示人名个数及优先级
			options.linkEleStr=linkTemplate.replace(replaceRegByTemplate,function(p0,p1){
				//取好友名称或手机号的数据
				var showCount=friendsArr.length,
				//缓存2个手机号
				_mobileArr=mobileArr.slice(0,showCount),
				//缓存2个好友姓名
				_friendsArr=friendsArr.slice(0,showCount),
				//结果
				result=[];
				//linkTemplate模板只有2个标记位@count和@friends，根据p1进行标记匹配
				if(p1=="count"){
					//记录好友数量
					result.push(count);
				}
				else{
					//循环把数组中的手机号或姓名取出来
                    while (showCount--) {
                        //记录姓名优先手机号显示
                        result.push(_friendsArr[showCount] || _mobileArr[showCount]);
                    }
					//添加解决短信与贺卡进入时显示过长问题
					if(dataSource.length>friendsArr.length){
						result.splice(0,0,'...');
					}
				}
				_mobileArr=_friendsArr=null;
				
				//反转数组，因为要按生日顺序显示
				return result.reverse().join(",").replace(/\,$/,"");
			});
			friendsArr=itemArr=null;
		}
	})(this,_options,_options.dataSource,_options.itemTemplate,_options.linkTemplate,_options.replaceRegByTemplate,_options.sentNumbers,_options.cacheId);
	/**
	 * 渲染DOM
	 * @param {Object} instance 当前BirthdayReminder的实例
	 * @param {Object} options 参数集合
	 * @param {string} parentTemplate 父级模板
	 * @param {Object} replaceRegByTemplate 替换模板中指点元素的正则表达式
	 * @param {function} itemOnClickCallBack 点击回调
	 */
	(function(instance,options,parentTemplate,replaceRegByTemplate,itemOnClickCallBack){ 
			//列表容器
		var listContainer=options.listContainer,
			//链接容器
			linkContainer=options.linkContainer,
			//缓存父级元素字符串
			parentEleStr="",
			//初始化列表容器，兼容传入字符和DOM对象的两种方式
			listContainer=document.getElementById(listContainer) || listContainer || null,
			//初始化链接容器，兼容传入字符和DOM对象的两种方式
			linkContainer=document.getElementById(linkContainer) || linkContainer || null,
			//数据长度
			dataLenght=options.dataSource && options.dataSource.length;
			//检查数据源
        if (instance.dataIsReady) {
			//如果有列表容器
            if (listContainer) {
                //按正则替换后放到缓存中
                parentEleStr = parentTemplate.replace(replaceRegByTemplate, function(p0, p1){
                    return options[p1];
                });
				//大于5行时设定UL高度，列表容器滚动显示
				if(dataLenght>=5){
					parentEleStr=parentEleStr.replace(/class=\"sendBless\"/,'class=\"sendBless\" style=\"height:128px;\"');
				}
                //得到当前容器样式文本
                instance.cssText = listContainer.style.cssText;
                //渲染DOM
                listContainer.innerHTML = parentEleStr;
                //把父级元素字符串赋值回给实例的设置项
                options.parentEleStr = parentEleStr;
                //把容器赋值回给实例的设置项
                options.listContainer = listContainer;
                //马上渲染DOM
                if (!options.isRender) {
                    container.style.display = "none";
                }
            }
			//如果有链接容器
			if(linkContainer){
				//链接容器渲染
				linkContainer.innerHTML = options.linkEleStr;
				//回写给实例容器对象
				options.linkContainer = linkContainer;
			}
			//如果有列表容器，绑定列表事件
			listContainer && (listContainer.onclick=function(event){
				event=window.event || event||null;
				var target=event.target||event.srcElement,
					matchResult=null,
					nodeName=target.nodeName.toLowerCase();
				//只绑定复选框，并执行回调
				if(nodeName=="input"){
					//得到匹配值
					matchResult=target.value.match(/(^\d{1,13})/);
					if(matchResult){
						//选择
                        if (target.checked) {
							//增加已选择到缓存
							instance.addSelectedItem(matchResult[0]);
                        }
                        else {
							//删除已选择缓存
							instance.delSelectedItem(matchResult[0]);
                        }
					}
					//如果有回调方法，则运行
					itemOnClickCallBack && itemOnClickCallBack (instance);
				}
				matchResult=target=null;
				return;
			});
        }
		listContainer=linkContainer=null;
	})(this,_options,_options.parentTemplate,_options.replaceRegByTemplate,_options.itemOnClickCallBack);
	_options=null;
}
/**
 * 得到元素
 * @param {object} tag 要查找的目标范围对象
 * @param {string} selector 选择器字符串，支持按元素名称和类名。如：div、.list
 */
ListByTemplate.getEle=function(tag,selector){
	//正则匹配搜索条件，(pattern)模式的数据和顺序要对应selectorFun查找方法集合
	var selectorReg=/(^\.\S+)|(\S+)|(\S+\[\S+\=\S+\])/g,
		//按属性匹配正则
		attrReg=/(\S+)\[(\S+)\=(\S+)\]/,
		//查找方法集合
		selectorFun=null,
		//查找到的集合
		nodes=null,	
		//查找方法数量
		funLen=-1;
	if("string"===typeof selector && selector && "object"===typeof tag){
		//初始化查找方法集合,参数t是查找键值，按属性查找则会传入完整的的正则查找字符如：input[checked=true]
        selectorFun = [
		//按类名查找
		function(t){
			try{return tag.getElementsByClassName(t);}
			catch(e){return null;}
        }, 
		//按标签名查找
		function(t){
            try {return tag.getElementsByTagName(t);}
			catch(e){return null;}
        },
		//按属性查找
		function(t){
			//返回结果
			var result=[];
			//传入匹配结果
			(function(rules){
				//属性名称，如：node.getAttribute(attName)或node[attName]
				var attName=null,
				//属性值，如：attVal=node[attName]
					attVal=null,
				//查找到节点的总数
					nodeLen=0,
				//节点的集合
					nodeList=null;
				//校验匹配结果
                if (rules) {
                    //按标签得到节点集合
                    nodeList = tag.getElementsByTagName(rules[1]);
                    //查找到节点的总数
                    nodeLen = nodeList.length;
					//遍历节点集合
                    while (nodeLen--) {
						//传入节点进行属性匹配查找
                        (function(node){
                            if (node) {
								//缓存属性名称
                                attName = rules[2];
								//缓存属性值
                                attVal = node[attName] || node.getAttribute(attName) || null;
                                //转字符串进行比较，相等则填加到结果集中
								attVal + "" == rules[3] && result.push(node);
                            }
                        })(nodeList[nodeLen]);
                    }
                }
				nodeList=null;
			})(selector.match(attrReg));
			return result;
		}
        ];
		//查找方法数量
		funLen=selectorFun.length;
		while(funLen--){
			//保存匹配的值
			(function(rules){
                //去字符
                rules && (rules = rules.join("").replace(/\./g, ""));
                //运行方法集合中的方法，得到查找节点
                nodes = selectorFun[funLen](rules);
			})(selector.match(selectorReg));
			//验证查找结果
			if(nodes && nodes.length>0){break;}
		}
		//如果没有找到元素节点，则置空
		if(nodes && nodes.length==0){nodes=null;}
	}
	selectorFun=null;
	return nodes;
};

/**
 * 继承方法、浅复制
 * @param {Object} baseObject 原对象
 * @param {Object} importObject 导入对象
 */
ListByTemplate.extend = function(baseObject, importObject) {
    for (var _ in importObject) {
        _ && (baseObject[_] = importObject[_]);
    }
    return baseObject;
};

/**
 * 按标签名称得到节点列表
 * @param {string} selector 选择器字符串，支持按元素名称和类名。如：div、.list
 * @return {Object} nodeList 节点列表 || null
 */
ListByTemplate.prototype.getNodeList=function(selector){
	//调用getEle
	return selector && "string"==typeof selector && ListByTemplate.getEle(this.options.listContainer,selector) || null;
};

/**
 * 按标签名称得到节点列表
 * @param {string} selector 选择器字符串，支持按元素名称和类名。如：div、.list
 * @return {Object} dataList 节点列表 || null
 */
ListByTemplate.prototype.getDataList= function(selector){
	//数据集合
	var dataList=[];
	//得到节点集合
	(function(nodeList){
        if (nodeList) {
			//节点长度
			var len=nodeList.length,
			//匹配节点标签名称正则
			nodeNameReg=/(DIV|SPAN|P|^I?$|A|LI|TD)|(INPUT|SELECT|TEXTAREA)/,
			//得到元素值方法集合
			getValFuns=[function(){/*占座*/},function(t){return t.innerHTML;},function(t){return t.value;}];
			while(len--){
                (function(node){
					//匹配到的结果
					var rules=null,
						//节点值
						nodeValue="";
					//验证节点并且必须是元素节点
                    if (node && node.nodeType==1) {
						//匹配到结果
						rules=node.nodeName.match(nodeNameReg);
						if(rules){
							//取最大索引的匹配结果，rules[2]则运行getValFuns返回t.value，否则t.innerHTML
							dataList.push(rules[2] && getValFuns[2](node) || getValFuns[1](node));
						}
                    }
					rules=null;
                })(nodeList[len]);
			}
			getValFuns=nodeNameReg=null;
        }
	})(this.getNodeList(selector));
	dataList && dataList.length==0 && (dataList=null);
	return dataList; 
};

/**
 * 显示
 */
ListByTemplate.prototype.show=function(){
	var lc=this.options.listContainer||null;
	lc && (lc.style.display="block");
	lc=null;
};
/**
 * 隐藏
 */
ListByTemplate.prototype.hide=function(){
	var lc=this.options.listContainer||null;
	lc && (lc.style.display="none");
	lc=null;
};
/**
 * 清理列表
 */
ListByTemplate.prototype.cleanList=function(){
	var lc=this.options.listContainer||null;
	lc && (lc.innerHTML="");
	lc=null;
};
/**
 * 清理链接
 */
ListByTemplate.prototype.cleanLink=function(){
	var lc=this.options.linkContainer||null;
	lc && (lc.innerHTML="");
	lc=null;
};
/**
 * 清空选择列表
 */
ListByTemplate.prototype.cleanSelectedItem=function(){
    if(top[this.options.cacheId]&&top[this.options.cacheId]["selectedItemCache"]){
	  top[this.options.cacheId]["selectedItemCache"]=this.options.selectedItemCache="";
	}
}
/**
 * 增加选择列表到缓存中
 * @param {string} itemVal 项目值
 */
ListByTemplate.prototype.addSelectedItem=function(itemVal){
	//得到缓存
	var selectedItemCache=this.options.selectedItemCache,
	//当前实例
		instance=this;
	if(itemVal && "string"==typeof itemVal){
		//如果有缓存
		if(selectedItemCache){
			//使用逗号累加数据
			selectedItemCache+=","+itemVal;
		}
		else{
			//没有缓存直接赋值
			selectedItemCache=itemVal;
		}
		/**
		 * 
		 * @param {Object} cacheObj 缓存对象
		 * @param {Object} selectedItemCache 当前已经选择数据
		 */
		(function(cacheObj,selectedItemCache){
			//全局缓存对象存在则直接赋值
			if(cacheObj){
				cacheObj["selectedItemCache"]=selectedItemCache;
			}
			else{//如果没有全局缓存对象，则创建
				top[instance.options.cacheId]={
					"selectedItemCache":selectedItemCache
				};
			}
			//写回给当前实例 
			instance.options.selectedItemCache=selectedItemCache;
		})(top[this.options.cacheId],selectedItemCache);
	}
}
/**
 * 从缓存中删除选择列表
 * @param {string} itemVal 项目值
 */
ListByTemplate.prototype.delSelectedItem=function(itemVal){
	//得到缓存
	var selectedItemCache=this.options.selectedItemCache;
	//手机号和缓存都存在
	if(itemVal && "string"==typeof itemVal && selectedItemCache){
		//删除当前项从缓存中删除，并写回全局缓存和当前对象的实例中
		if(top[this.options.cacheId]&&top[this.options.cacheId]["selectedItemCache"]){
		  top[this.options.cacheId]["selectedItemCache"]=this.options.selectedItemCache=selectedItemCache.replace(this.options.getMobilePhoneReg(itemVal),"");
		}
	} 
}
﻿function floatTips(parentObj){
    parentObj.css({'position':'static'});  //解决IE浮层bug --
    var comTip = $('body').find('div.comTip');
    if(comTip && comTip.length>0){
        comTip.remove();
    }
    var This = this;
    this.parentObj = parentObj;
    var htmlCode = '';
    htmlCode += '<div class="comTip" style="display:none; z-index:9999;">'
             + '<span class="comTip_dir"><i class="b">◆</i><i class="o">◆</i></span>'
             + '</div>';
    this.jContainer = $(htmlCode).appendTo(parentObj);
    this.setContent = function(conHtml){
        This.jContainer.append(conHtml);
    }
    this.fadeIn = function(time){
        This.jContainer.fadeIn(time);
    }
    this.fadeOut = function(time){
        This.jContainer.fadeOut(time);
        if(This.keep)clearTimeout(This.keep);
        This.keep = setTimeout(function(){
            This.remove();
        },time);
    }
    this.remove = function(){
        This.jContainer.remove();
    }
}

floatTips.prototype.tips = function(content){
    var This = this;
    var parentObjH = This.parentObj.height();
    This.jContainer.css({'margin-top': -parentObjH-32});
    var comMes = '<span class="comMes">'+ content +'</span>';
    This.setContent(comMes);
    This.fadeIn(200);
    if(This.timeOut) clearTimeout(This.timeOut);
    This.timeOut = setTimeout(function(){
        This.fadeOut(200);
    },5000);
}

floatTips.prototype.confirm = function(btn,content,callback,noCallback){
    var This = this;
	var btnIdOffset = btn.offset();
    var parentObjH = This.parentObj.height();
	var isIE6 = (/msie\s*6.0/i).test(navigator.userAgent);
    var comMes = '<div class="comMes redialPop c_333">'
               + '<div class="redialPopMes">'+ content +'</div>'
               + '<div class="ta_c">'
               + '<a href="javascript:;" class="btnNm btnNm-h20 btnYes" style="left:0">'
               + '<i class="but_lIco"></i>'
               + '<span class="but_bg-x">发送</span>'
               + '<i class="but_rIco"></i>'
               + '</a>&nbsp;&nbsp;'
               + '<a href="javascript:;" class="btnNm btnNm-h20 btnNo" style="left:0;margin-right:0;">'
               + '<i class="but_lIco"></i>'
               + '<span class="but_bg-x">取消</span>'
               + '<i class="but_rIco"></i>'
               + '</a>'
               + '</div></div>';
	This.jContainer.css({'left':btnIdOffset.left});
    if(btnIdOffset.top < parentObjH){
        This.jContainer.find('.comTip_dir').addClass('comTip_dir2').removeClass('comTip_dir').html('<i class="b2">◆</i><i class="o2">◆</i>');
        This.jContainer.css({'top':btnIdOffset.top+btn.height()+5});
    }
    This.jContainer.addClass('redialPopBar');
	isIE6 && (comMes += '<iframe frameborder="0" style="position:absolute;z-index:-1;left:0;top:0;"></iframe>');
	This.setContent(comMes);
	isIE6 && This.jContainer.find("iframe").css({width: This.jContainer.width(), height: This.jContainer.height()});
    This.fadeIn(200);
	if (btnIdOffset.top > parentObjH) {
		//This.jContainer.css({'margin-top':-parentObjH-This.jContainer.height()-5});
		This.jContainer.css({"top": btnIdOffset.top - This.jContainer.height() - 5});
	}
    $(".btnNm", This.jContainer).click(function(){
        This.remove();
        try {
            if ($(this).hasClass("btnYes")) {
				if (callback) callback();
			} else if ($(this).hasClass("btnNo")) {
				if (noCallback) noCallback();
			}
			return false;
        } catch (e) { }
    });
    return false;
}


/*********************************浏览器检查*********************************/
var Sys = {};
var ua = navigator.userAgent.toLowerCase();
var s;
(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

//公共提示语
var ShowMsg = {
    CardName:					"为您制作的贺卡", 
    SendMmsMax:				"您输入祝福语超过500个字，超出部分将不显示，确定彩信发送？",
    NoSendCard:				"确定不发送此贺卡吗？",
    SendFail:					"发送失败，可能是网络繁忙，请稍后再试",
    LoadFail:					"数据加载失败",
    GetSmsFailState:			"加载祝福语分类失败，请稍后再试。",
    GetSmsFail:				"加载祝福语分类失败，请稍后再试。",
    GetDataFailState:		"加载祝福语列表失败，请稍后再试。",
    GetDataError:				"加载祝福语列表失败，请稍后再试。",    
    NoRecNumber:			"请填写收件人",
    RecNumberError:			"请正确填写接收人的邮箱地址:",
    MaxRecNum:				"收件人已超过上限：{0}人",
    LazyMaxRecNum:			"不能再选择收件人,一次最多只能发送{0}人",
    NoTitle:						"未填写邮件主题，您确定发送吗？",
    SameRecNum:				"不能添加已选择的重复联系人",
    HidTitle:						"隐藏主题",
    ChangeTitle:				"更改主题",
    DefineTime:				"定时发送时间不能比当前时间早！",
    NoRecNumberB:			"请选择好友。",
	PromptMsg:				"可填入{0}个收件人，每个人收到的是单独发给他/她的贺卡",
	RecBlessNumber:			"请选择接收祝福的好友",
	unChinaMobileNumber: "非移动号码的收件人无法接收，确定发送吗？",
	ComboUpgradeMsg: '，<a href="javascript:top.$App.showOrderinfo();" style="color:#0344AE">升级邮箱</a>可添加更多！'
};
//素材地址
var CardResAddress = "http://images.139cm.com/cximages/card/",//防止素材404添加初始化
	HolidayId = 0,
	InitMaterialId = 0,
	InitName = "",
	InitBlessing = "",
	CurrentMaterialId = 0,
	CurrentName = "",
	CurrentThumbUrl,
	CurrentFlashUrl,
	CurrentBlessing = "",
	CurrentNewHot = 1,
	CurrentTopGroupId = "0",
	CurrentGroupId = "0",
	CurrentPageIndex = 1,
	CurrentCombo = 0,

	pageSize = 10,
	richInput = new Object(),
	maxrec = 50,

	isBirthdayPage = false,
	birthdayData,
	br,

	MaterialListHtml = {},
	CardInfo = {}; //上一张用户套餐可用的贺卡

//cm与rm Host
var cardHost = top.isRichmail ? top.SiteConfig.cardMiddleware : "http://" + location.host + "/";

$(function() {
	Utils.Timer.getStartTime();
	GreatCard.init();
});

//Validate Model
var ValidateModel = {
	unChinaMobileNumberList: [],
	getUnChinaMobileNumberItem: function (number, email){
		this.unChinaMobileNumberList.push([number, email]);
	},
	getUnMobileNum: function(){
		return this.unChinaMobileNumberList.length;
	}
};

var ValidateView = {
	model: ValidateModel,
	arrowBtm: '<a id="arrowBtm" class="btn_showHide" href="javascript:;" title="展开">展开</a>',
	arrowTop: '<a id="arrowTop" class="btn_showHide btn_hide" href="javascript:;" title="隐藏">隐藏</a>',
	unMobileItem: '<p style="{0}"><span title="{1}"><em>"{2}"</em><{3}></span></p>',
	hideHtml: 'display:none;',
	contentTemplate: ['<p style="padding:5px 0;">{0}</p>',
							'<div class="tipWrap">{1}',
							'<div class="tipLists">{2}</div>',
							'{3}</div>'].join(""),
	//@param {Object} o 参数集 包含btn, parent, content, callback, nocallback, isBtnBtm(是否是底部按钮)
	floatTipsConfirm: function (o){
		var btn = o.btn,
			pt = o.parent,
			fTip = new floatTips(pt);

		fTip.confirm(btn, o.content, o.callback);
		if (this.model.getUnMobileNum() > 1) {
			this.bindEvent(o.isBtnBtm);
		}
	},
	sendMmsNumberTip: function(isBtnBtm){
		this.floatTipsConfirm({
			btn: isBtnBtm ? $("#btnSendMms") : $("#btnSendMms1"),
			parent: isBtnBtm ? $("#btnSendMms").parent() : $("#content"),
			content: this.getUnMobileList(),
			isBtnBtm: isBtnBtm,
			callback: this.sendMms
		});
		this.model.unChinaMobileNumberList = [];
	},
	sendMms: function(){
		GreatCard.sendMms("", true);
	},
	//非移动号码邮件列表
	getUnMobileList: function(){
		var num = this.model.getUnMobileNum();
		var listData = this.model.unChinaMobileNumberList;
		var listHtml = "",
			item = [],
			hideHtml = "",
			arrowBtmHtml = "",
			arrowTopHtml = "",
			itemLen = "",
			email = "";
		
		if (num > 1) {
			arrowBtmHtml = this.arrowBtm;
			arrowTopHtml = this.arrowTop;
		};
		for (var i = 0; i < num; i++) {
			item = listData[i];
			itemLen = (item[0] + item[1]).length;
			if (itemLen > 31) {
				email = item[1].slice(0, -(itemLen - 31 + 3)) + "...";
			} else {
				email = item[1];
			}
			hideHtml = i > 0 ? this.hideHtml : "";
			listHtml += this.unMobileItem.format(hideHtml, item[1], item[0], email);
		}

		return this.contentTemplate.format(ShowMsg.unChinaMobileNumber, arrowBtmHtml, listHtml, arrowTopHtml);
	},
	bindEvent: function(isBtnBtm){
		var doc = document,
			arrowBtm = doc.getElementById("arrowBtm"),
			arrowTop = doc.getElementById("arrowTop"),
			btnBtm = doc.getElementById("btnSendMms");

		/**
		 * 展开隐藏按钮事件触发
		 * @param {Object} arrowEle 展开隐藏按钮 必填
		 * @param {Boolean} isArrowTop 是否为隐藏按钮 选填 默认不是
		 */
		var arrowHandler = function (arrowEle, isArrowTop){
			var lists;
			if (isArrowTop) {
				arrowEle.style.display = "none";
				lists = arrowEle.previousSibling;
			} else {
				arrowEle.nextSibling.nextSibling.style.display = "block";
				lists = arrowEle.nextSibling;
			}
			var children = lists.children;

			for (var i = 0, l = children.length; i < l; i++) {
				if (i != 0) {
					children[i].style.display = isArrowTop ? "none" : "block";
				}
			}
			if (!isArrowTop && l > 20) {
				lists.className = "tipLists clip";
			} else{
				lists.className = "tipLists";
			}
			if (isBtnBtm) {
				var tipNode = btnBtm.nextSibling;
				if (tipNode.nodeType == 3) {
					tipNode = tipNode.nextSibling;
				}
				tipNode.style.display = "none";
				tipNode.style.display = "block";
				tipNode.style.top = btnBtm.offsetTop - tipNode.offsetHeight + 7 + "px";
			}
			return false;
		};

		Utils.addEvent(arrowBtm, "onclick", function(){arrowHandler(arrowBtm)});
		Utils.addEvent(arrowTop, "onclick", function(){arrowHandler(arrowTop, true)});
	}
};

var GreatCard = {
	initDefaultMaterialData: {},
	isEditorLoad: false,
	initMaterialId: Utils.queryString("materialId") || 0,
	isInitDataLoad: false,
	classData: {},
	redList: "8613715302529,8615013869025,8613923734350,8613923460200,8613510605783,8615816857163,8613902935586,8615989437317,8615095797683,8615801673146,8613602515120,8613925298251,8615875577736,8613500058946,8613652352913,8613652352913,8613902935586,8613510443893,8613830502001,8618740451175,8615915803517",
	/*
	 * 获取增值站点URL
	 * @param {string} param 接口参数名称
	 * @return {string} url
	 */
	getInterfaceUrl: function(param){
		//接口名称
	    var interFace= "/mw2/card/s?func=card:";
	    return interFace + param + "&sid=" + top.$App.getSid();
	},
	/*
	 * 贺卡页面初始化
	 */
	init: function(){
		this.getMaxRec();		//得到最大接收人，为红名单用户重新设置最多接收人数
		this.initShowMsg();		//初始化提示语, 依赖getMaxRec
		this.initReceiveInput();
		this.initData();			//加载初始化数据
		this.initAddrList();		//初始化发件人下拉框
		this.setChk();				//设置主题及选框
		this.loadEditor();
		this.initReceiver();
		this.setClass();			//设置分类
		this.bindEvent();
		//显示顺序
		if (Utils.queryString("birthday") || Utils.queryString("dyinfoBirthday") || Utils.queryString("successBirther")) {//生日
			isBirthdayPage = true;
			this.loadBirthday();
		}else{//默认贺卡
			EditorManager.onload = function(){
				var greatCard = GreatCard,currData =  greatCard.initDefaultMaterialData;
				greatCard.isEditorLoad = true;
				if (currData.id) {
					greatCard.defaultMaterialHandler(currData);
				}
			};
		}
	},
	//绑定dom事件
	bindEvent: function(){
		var doc = document,
			btnSendCard1 = doc.getElementById("btnSendMail1"),
			btnSendCard = doc.getElementById("btnSendMail"),
			btnSendMms1 = doc.getElementById("btnSendMms1"),
			btnSendMms = doc.getElementById("btnSendMms"),
			tabMmsCard = doc.getElementById("tabMmsCard"),//彩信贺卡tab
			//aShowSubject = doc.getElementById("aShowSubject"),//更改主题按钮
			iarrowDown = doc.getElementById("iarrowDown"),
			txtFormat = doc.getElementById("txtFormat"),//文字格式化
			chkDefiniteTime = doc.getElementById("chkDefiniteTime"),
			cardItem = doc.getElementById("cardItem"),//侧边栏贺卡tab
			smsItem = doc.getElementById("smsItem"),//侧边栏贺卡tab
			liNew = $("#liNew a")[0],//最新
			liHot = $("#liHot a")[0],//最热
			sltSmsListBarClass = doc.getElementById("sltSmsListBarClass"),
			smsListBar = doc.getElementById("divSmsListBar");

		EditorManager.onload = function(){
				var greatCard = GreatCard,currData =  greatCard.initDefaultMaterialData;
				greatCard.isEditorLoad = true;
				if (currData.id) {
					greatCard.defaultMaterialHandler(currData);
				}
			};
		this.bindAddr();
		Utils.addEvent(btnSendCard1, "onclick", function(){
			GreatCard.sendMail('1');
		});
		Utils.addEvent(btnSendCard, "onclick", function(){
			GreatCard.sendMail('2');
		});
		Utils.addEvent(btnSendMms1, "onclick", function(){
			GreatCard.sendMms();
			return false;
		});
		Utils.addEvent(btnSendMms, "onclick", function(){
			GreatCard.sendMms(true);
			return false;
		});
		Utils.addEvent(tabMmsCard, "onclick", function(){
			GreatCard.changeSendMms();
			return false;
		});
		//$(aShowSubject).click(function(){
			//GreatCard.aAddSubjectOnClick(this);
		//});
		Utils.addEvent(iarrowDown, "onclick", function(){
			GreatCard.arrowDown();
		});
		Utils.addEvent(txtFormat, "onclick", function(){
			GreatCard.aSiwtchEditorOnClick();
		});
		Utils.addEvent(chkDefiniteTime, "onclick", function(){
			GreatCard.chkDefiniteTimeOnClick();
		});
		$(cardItem).click(function(){
			GreatCard.changeTab(this, 0);
		});
		$(smsItem).click(function(){
			GreatCard.changeTab(this, 1);
		});
		Utils.addEvent(sltSmsListBarClass, "onchange", function(){
			GreatCard.loadSmsListBar(1);
		});

		liNew.setAttribute("param", "0,0,0,1");
		liHot.setAttribute("param", "1,0,0,1");
		
		//绑定贺卡分类事件
		this.bindEventChangeGroup();
		this.bindEventSmsList();

        //贺卡带入指定的一类素材
		var series = Utils.queryString("series") || "";
		if (series) {
		    var series = decodeURIComponent(series);
		    var clasesItem = $('#divGroup').find('a')
		    for (var i = 0; i < clasesItem.length; i++) {
		        var itemText = clasesItem.eq(i).text();
		        itemText = itemText.replace(/ /g, '');
		        if (itemText == series) {
		            var arr = clasesItem.eq(i).attr('param').split(",");
		            GreatCard.changeGroup(parseInt(arr[0], 10), arr[1], arr[2], parseInt(arr[3], 10));
		        }
		    }
		}

	    //插入短信内容		
		Utils.addEvent(smsListBar, "onclick", function (e) {
		    e = e || event;
		    var target = e.target || e.srcElement;

		    if (target.tagName == "P") {
		        var editHtml = GreatCard.getEditorContent();

		        GreatCard.setEditorContent(editHtml + target.innerHTML);
		        Utils.logReports({
		            mouduleId: 15,
		            action: 20015,
		            thing: "joinSms"
		        });
		    }
		});

		if (!top.$User.isChinaMobileUser()) {
		    //外网账号判断，屏蔽功能
		    var moBtn = $("#btnSendMms,#btnSendMms1,#tabMmsCard");
		    top.M139.Dom.rebuildDom(moBtn);
		    $("#btnSendMms,#btnSendMms1,#tabMmsCard").click(function () {
		        top.$User.checkAvaibleForMobile();
		    });
		}
	},
	//取用户手机号码 含86
	getUserNumber: function(){
		return top.UserData && top.UserData.userNumber || "";
	},
	getMaxRec: function(){
		window.maxrec = top.$User.getCapacity("mailgsendlimit") || 400;
		this.redList.indexOf(this.getUserNumber()) != -1 && (window.maxrec = 200);
	},
	initShowMsg: function(){
		ShowMsg.MaxRecNum = ShowMsg.MaxRecNum.format(maxrec);
		if (top.SiteConfig.comboUpgrade && top.$User.getServiceItem() != top.$User.getVipStr("20")) {//非20元套餐
			ShowMsg.MaxRecNum += ShowMsg.ComboUpgradeMsg;
		}

		ShowMsg.LazyMaxRecNum = ShowMsg.LazyMaxRecNum.format(maxrec);
		ShowMsg.PromptMsg = ShowMsg.PromptMsg.format(maxrec);
	},
	addrCallbackIsBack: function(addr){
		$("#lazyErrMsg").css("display","none");
		if(Utils.queryString("lazy")){
			var addrlist = addr.split(';');
			var html = '';        
			$.each(addrlist, function(i, item){                
				if(item != null && item != ''){  
					var match = item.match(/(.+)<(.+)>/); 
					var name='';
					var email='';       
					if(match != null && match != ''){        
						name = match[1].replace(/\"/g,"");
						email =  match[2];
					}else{
						name = email = addr;
					}
					html+="<li title=\""+email+"\"><label for=\"chk_"+i+"\"><input type=\"checkbox\" name=\"chk_"+i+"\" value=\""+email+"\" id=\"chk_"+i+"\" onclick=\"GreatCard.setLazyRecCount(this);\" checked=\"checked\"/>"+Utils.htmlEncode(name)+"</label></li>";
				}
			}); 
			$("#lazycontactList").html(html);
			this.setLazyRecCount();
		}else{
			richInput.insertItem(addr);
		}
	},
	addrCallback: function(addr){
		var isAdd=0;
		if(Utils.queryString("lazy")){
			var match = addr.match(/(.+)<(.+)>/);        
			if(match!=null&&match!=''){        
				name = match[1].replace(/\"/g,"");
				email =  match[2];
			}else{
				name = email = addr;
			} 
			//判断是否超过50个
			var len = $("#lazycontactList input:checkbox:checked").length;
			if(len>maxrec||len==maxrec){
				$("#spanErrMsg").html(ShowMsg.LazyMaxRecNum);
				$("#lazyErrMsg").css("display","block");
				return false;
			}
			$("#lazycontactList input:checkbox").each(function(i, item){   
				if(this.value === email){
				   if($(this).attr("checked")==false){
						$(this).attr("checked", true);
						isAdd=2;
				   }else{
						isAdd=1; 
				   }               
				   return false;
				}else{
					return;
				}
			});
			if(isAdd==0){        
				var i = $("#lazycontactList input:checkbox").length;
				$("#lazycontactList").append("<li  title=\""+email+"\"><label for=\"chk_"+i+"\"><input type=\"checkbox\" name=\"chk_"+i+"\" value=\""+email+"\" onclick=\"GreatCard.setLazyRecCount(this);\" id=\"chk_"+i+"\" checked=\"checked\"/>"+Utils.htmlEncode(name)+"</label></li>");       
				GreatCard.setLazyRecCount();
			 }else if(isAdd==2){
				GreatCard.setLazyRecCount();
			 }else{
				$("#spanErrMsg").html(ShowMsg.SameRecNum);
				$("#lazyErrMsg").css("display","block");            
			 }        
		}else{     
			richInput.insertItem(addr);
		}  
	},
	//绑定通讯录
	bindAddr: function(){
		$("#aContact").click(function() {
			var addrFrame = $("#addrFrame");
			if (addrFrame.length == 0) {
				var url = "/m2012/html/addrwin.html?type=email&callback=addrCallBack&useNameText=true"
					.format(top.location.host,
						top.isRichmail ? '' : top.stylePath);

				addrFrame = $("<iframe frameBorder='0' style='z-index:2048;display:none;border:1px solid #b1b1b1;height:350px;width:170px;position:absolute;' id='addrFrame' src='"+url+"'></iframe>");
				addrFrame.appendTo(document.body);
				$(document).click(function() {
					$("#addrFrame").hide();
				});
			}
			var jLink = $(this);
			var offset = jLink.offset();
			addrFrame.css({ top: offset.top + jLink.height(), left: offset.left - addrFrame.width() + jLink.width() });
			addrFrame.show();
			return false;
		});
	},
	//懒人贺卡统计收件人
	setLazyRecCount: function(obj){   
		var len = $("#lazycontactList input:checkbox:checked").length;
		if(obj!=null){
			if(len>maxrec){
				$(obj).attr("checked",false);
				$("#spanErrMsg").html(ShowMsg.LazyMaxRecNum);
				$("#lazyErrMsg").css("display","block");
			}else{
				$("#lazyErrMsg").css("display","none"); 
				$("#emcheckall").text(len);
			}
		}else{    
			$("#lazyErrMsg").css("display","none"); 
			if(len>maxrec){
				$("#spanErrMsg").html(ShowMsg.LazyMaxRecNum);
				$("#lazyErrMsg").css("display","block");
			}else{    
				$("#lazyErrMsg").css("display","none"); 
				$("#emcheckall").text(len);
			}
		}
	},
	//绑定懒人贺卡HTML
	bindLazyManHtml: function(){   
		var objlist = getLazyManLinkList();
		if(objlist!=null){       
			var html='';
			$.each(objlist, function(i, item){    
				var name = item.name;
				name = name.sub(12);
				html+="<li  title=\""+item.addr+"\"><label for=\"chk_"+i+"\"><input type=\"checkbox\" name=\"chk_"+i+"\" value=\""+item.addr+"\" id=\"chk_"+i+"\" onclick=\"GreatCard.setLazyRecCount(this);\" checked=\"checked\"/>"+Utils.htmlEncode(name)+"</label></li>";
			});        
			$("#lazycontactList").html(html);
		}
		this.setLazyRecCount();
		$("#txtTo").css("display","none");
		$("#divLazyMan").css("display","block");
		$("#trlazy").css("display","");
		$("#alazy").css("display","inline");
	},
	//打招呼HTML
    BindSayHelloHtml:function(){
       var sayHello = Utils.queryString("sayHello");
	   var objlist;
	   if('login'==sayHello&&top.$BMTips){
		 objlist = top.$BMTips.users.login;
	   }else if('online'==sayHello){
		 objlist = top.$BMTips.users.online;
	   }
	   //查询用户分组信息
		if(objlist!=null)
		{       
		    var html = '', isNotFull = true;
		    var sendIndex = 0; 
		    var maxSend = top.$User.getCapacity("mailgsendlimit");
			$.each(objlist, function(i, item){	
				var name = item.cardName;
				if(name==item.cardFullName){
				 isNotFull = false;
				}
				if (sendIndex < maxSend) {
				    html += "<li style=\"width: 250px;border-bottom:1px dotted #E8E8E8;\" title=\"" + (isNotFull ? item.cardFullName : '') + "\"><label for=\"chk_" + i + "\"><input type=\"checkbox\" name=\"chk_" + i + "\" value=\"\" id=\"chk_" + i + "\" onclick=\"\" email=\"" + item.friendMail + "\"  checked=\"checked\"/>" + Utils.htmlEncode(name) + "</label></li>";
				} else {

				    html += "<li style=\"width: 250px;border-bottom:1px dotted #E8E8E8;\" title=\"" + (isNotFull ? item.cardFullName : '') + "\"><label for=\"chk_" + i + "\"><input type=\"checkbox\" name=\"chk_" + i + "\" value=\"\" id=\"chk_" + i + "\" onclick=\"\" email=\"" + item.friendMail + "\" />" + Utils.htmlEncode(name) + "</label></li>";
				}
				sendIndex ++;
			});        
		   $("#onlineList").html(html); 
			if(objlist.length<=9){
			  $("#onlineList").css({'overflow':'hidden','zoom':1});
			}else{
			  $("#onlineList").css('height','132px');
			}		
		}
		if (objlist.length > maxSend) {
		    var bom_txt = ShowMsg.PromptMsg;
		    bom_txt += '<br>当前收件人已超过上限：' + maxrec + '人，我们已为您默认勾选前' + maxrec + '们好友';
		    if (maxrec == 50) {
		        bom_txt += ShowMsg.ComboUpgradeMsg;
		    }
		    $("#trSayHello").find('p.bom_txt').html(bom_txt)

		}
		$("#trSayHello").css("display","");
		$("#trReceive").css("display","none");
		$("#trTool").css("display","none");
		$("#trSubject").css("display","none");
		$("#trBirthday").css("display","none");
	},
	//按规则获取懒人贺卡接收人
	getLazyManLinkList: function(){
		 var obj = {};
		 top.Contacts.init("email",obj);
		 if(obj!=null){   
			if(obj.LinkManList.length>maxrec){
				if(obj.LastLinkList.length>0){
					return obj.LastLinkList;
				}else{
					var arr=obj.LinkManList.concat();
					if(arr.length>maxrec)arr.length=maxrec;
					return arr;
				}
			}else{
				 return obj.LinkManList;
			}
		 }
		 return null;
	},
	//懒人贺卡滚动标志
	arrowDown: function(){
		var len = $("#lazycontactList input:checkbox").length;
		var height = Math.ceil(len/3)*26;//实际数据高度
		var maxheight = (Math.ceil(maxrec/3)*26);//50行的高度
		var classname = $("#iarrowDown").attr("class");  
		if(classname=="arrowDown"){    
			if(height<104){
				maxheight=104;
			}
			else if(height>104&&height<maxheight){
				maxheight=height;
			}
			
			$("#lazycontactList").css("height",maxheight);
			$("#iarrowDown").attr("class","arrowUp");    
		}else{
			$("#lazycontactList").css("height","104px"); 
			$("#iarrowDown").attr("class","arrowDown");          
		} 
	},
	//初始化接收人输入框
	initReceiveInput: function(){
		//懒人贺卡不对收件人输入框进行初始化
		if(Utils.queryString("lazy")){
			this.bindLazyManHtml();
		}else if(Utils.queryString("sayHello")){//登录打招呼
	        this.BindSayHelloHtml();
	    }else{        
			//地址自动匹配
			var param={
				container:document.getElementById("txtTo"),
				autoHeight:true,
				plugins: [RichInputBox.Plugin.AutoComplete]
			}
			richInput = new RichInputBox(param);
			richInput.setTipText(ShowMsg.PromptMsg);
			var email = $("#hdnRecNumber").val();
			if(email){
				richInput.insertItem(email);
			}
		}
	},
	//加载编辑器
	loadEditor: function(){
		var editorManagerWidth = "";
		if (navigator.userAgent.indexOf("MSIE 6.0") == -1) {
			editorManagerWidth = 463;
		}
		var param={
			height: 200, //可以不设置,默认为100%
			container: document.getElementById("tdEditor"),
			hidToolBar: false,
			width: editorManagerWidth
		};

		EditorManager.create(param);
		/*
		try {
			setTimeout(function(){
				document.getElementById("theEditorFrame").contentWindow.document.body.style.width = "100%";
			}, 1500);
		} catch (ex) {};*/
	},
	//设置初始化接收人
	initReceiver: function(){
		var email = Utils.queryString("email") || top.Utils.queryString("email"),
		    url = location.search,
			to = top.Utils.queryStringNon("to", url);
		if (to) {
		    to =decodeURIComponent(to);// Todo 转码问题
		}
		if(email){
			richInput.insertItem(email);
		}
		if(to){
			richInput.insertItem(to);
		}	
	},
	//初始化发件人下拉框
	initAddrList: function(){
	   top.Utils.UI.selectSender("selFrom",true,document);
	},
	//设置分类
	setClass: function(){
	    var classid = Utils.queryString("classid");
		
		if(classid){
			CurrentNewHot = 2;
			CurrentTopGroupId = classid;
			CurrentGroupId = classid;
			CurrentPageIndex = 1;
		}
	},
	//设置主题及选框
	setChk: function(){
		$("#txtSubject").val("");
		$("#chkUrgent").attr("checked", false);
		$("#chkReceipt").attr("checked", false);
		$("#chkSaveToSentBox").attr("checked", true);
	},
	//获得用户名
	getUserName: function(){  
	    return top.$User.getSendName();
	},
	//初始化主题内容
	setSubject: function(){
		var name = this.getUserName();
		
		if (window.isBirthdayPage) {
			return name + "给你送来了生日贺卡";
		} else {
			return name + ShowMsg.CardName;
		}
	},
	//加载初始化数据
	initData: function(){
		
		this.pageTimeOut();
		
		//0=写日志上报，1=不写日志上报
		var isLog = Utils.queryString("isLog") || 0;
		var isBack = Utils.queryString("isBack") || 0;
		var materialId = Utils.queryString("materialId") || 0;  
		var senddate = Utils.queryString("sendDate") || "";
		if (Utils.queryString("dyinfoBirthday")) {
		    var now = top.M139.Date.getServerTime();
		    var birthDay = top.$App.get("dyInfoBirtherData").BirDay;
		    if (birthDay.slice(-2) != now.getDate()) {
		        senddate = birthDay + " 09:00:00"
		    }
		}
        
		if (Utils.queryString("successBirther")) {
		    var birtherData = top.$App.get("successBirtherData");
		    //是否是今天过生日
		    var birthday = top.$PUtils.dateFormat(birtherData.BirDay),
                now = top.M139.Date.getServerTime();
		    if (birthday.getDate() != now.getDate()) {
		        senddate = birtherData.BirDay + " 09:00:00";
		        $('#autotimeIntro').show().find('strong').text(birtherData.addrName);
            }
		}

		if(senddate.length > 0){
			$("#chkDefiniteTime").attr("checked", true);
			this.chkDefiniteTimeOnClick(senddate);
		}else{
			$("#chkDefiniteTime").attr("checked", false);
		}
		if(isBack == 1){//页面返回
			var params = top._card_greetingcard_pageparams;
			if(params != undefined){
				CurrentNewHot = params.newHot;
				CurrentTopGroupId = params.topGroupId;
				CurrentGroupId = params.groupId;
				CurrentPageIndex = params.pageIndex;
				this.addrCallbackIsBack(params.to);      
				$("#chkUrgent").attr("checked", params.priority);
				$("#chkReceipt").attr("checked", params.returnReceipt);
				$("#chkSaveToSentBox").attr("checked", params.saveToSent);
				$("#chkDefiniteTime").attr("checked", params.defineTime);
				this.chkDefiniteTimeOnClick();
			}
		}

		var dataJson = {
			type:0,
			isLog:isLog,
			materialId:materialId,
			newHot:CurrentNewHot,
			topGroupId:CurrentTopGroupId,
			groupId:CurrentGroupId,
			pageIndex:CurrentPageIndex,
			pageSize:pageSize
		},
			dataXml = namedVarToXML("", dataJson, "\r\n");
		
		top.M139.RichMail.API.call(GreatCard.getInterfaceUrl("cardInitData"), dataXml,
        function (e) {
            var msg = e.responseData;
		    if (msg.code == "S_OK") {
		        var greatCard = GreatCard,
                    classData = greatCard.classData;

		        msg = msg["var"];
		        if (msg.address && msg.address.length > 0) {
		            CardResAddress = msg.address;
		        }
		        HolidayId = msg.holidayId;//当前节日ID
		        if (msg.groupJson) {
		            greatCard.showGroup(msg.groupJson);//显示分类
		        }
		        if (classData.data) {
		            greatCard.showList(classData.data, classData.newHot, classData.topGroupId, classData.groupId);
		        } else {
		            greatCard.showList(msg.data, CurrentNewHot, CurrentTopGroupId, CurrentGroupId);
		        }
		        greatCard.isInitDataLoad = true;
		        Utils.Timer.getPassTime();
		        //显示当前分类样式
		        $("#divHCard ul li").removeClass("current");
		        $("#divGroup li").removeClass("current");
		        if (CurrentNewHot == 2) {
		            $("#liGroupId_" + CurrentTopGroupId).addClass("current");
		        } else if (CurrentNewHot == 0) {
		            $("#liNew").addClass("current");
		        } else if (CurrentNewHot == 1) {
		            $("#liHot").addClass("current");
		        }

		        if (msg.data.retData.length > 0) {
		            var index = GreatCard.listFindIndex(msg.data, materialId),
                        currData = msg.data.retData[index],
                        greatCard = GreatCard;

		            if (classData.data) {
		                currData = classData.data.retData[0];
		            }
		            if (greatCard.isEditorLoad) {
		                greatCard.defaultMaterialHandler(currData);
		            } else {
		                greatCard.initDefaultMaterialData = currData;
		            }
		            InitMaterialId = currData.id;
		            InitName = currData.name;
		            InitBlessing = currData.blessing;
		        }
		    } else {
		        window.location.href = cardHost + "error/systemTip4.html";
		    }
		},
			function (XmlHttpRequest, textStatus, errorThrown) {
			    top.FloatingFrame.alert(ShowMsg.LoadFail);
			}
		);
	},
	//显示分类
	showGroup: function(jsonData){
		var vhtml = [],
			group = jsonData.group;
		
		for(var i = 0, l = group.length; i < l; i++){
			var item = group[i],
				child = item.child;
				
			if(item.id == 1){
				vhtml.push("<li id=\"liGroupId_" + item.id + "\"  class=\"current\"><a href=\"javascript:;\" param=\"2,1,0,1\">" + item.name + "</a>");
				if(child.length > 0){
					vhtml.push("<ul id=\"ulChildGroupId_" + item.id + "\" class=\"sub-category\" style=\"display:none\">");
					for(var j = 0, m = child.length; j < m; j++){
						vhtml.push("<li><a href=\"javascript:;\" param=\"2," + item.id + "," + child[j].id + ",1\">" + child[j].name + "</a></li>");
					}
					vhtml.push("</ul>");
				}
				vhtml.push("</li>"); 
			}else{ 
				vhtml.push("<li id=\"liGroupId_" + item.id + "\"><a href=\"javascript:;\" param=\"2," + item.id + "," + item.id+",1\">" + item.name + "</a></li>");
			}
		}		
		$("#divGroup").html(vhtml.join(""));
		//显示或不显示子分类
		$("#divGroup li").hover( 
			function(){$(this).find("ul").show()}, 
			function(){$(this).find("ul").hide()} 
		); 
		//子分类样式
		$("#divGroup li ul").find("li").hover( 
			function(){$(this).addClass("on")}, 
			function(){$(this).removeClass("on")} 
		); 
	},
	/*
	 * 显示素材列表
	 * @jsonData {Object} 素材内容
	 * @newHot {Number} 分类 0:最新  1:最热  2:按分类
	 * @topGroupId {String} 一级分类 1:节日分类
	 * @groupId {String} 二级分类 如果topGroupId=1，groupId=0 选择全部节日，否则为节日ID
	 */
	showList: function(jsonData, newHot, topGroupId, groupId){
		var vhtml = [],
			retData = jsonData.retData;
		
		for(var i = 0, l = retData.length; i < l; i++){
			var vip = "",
				item = retData[i];
			var isNew = retData[i].isNew == 1 ? '<span class="iconNew"></span>' : '';
			vhtml.push('<dl id="dlList_' + item.id + '"><dt>' + isNew + '<a href="javascript:;"><img src="' + GreatCard.getFullUrl(item.thumbPath) + '" info="' + item.id + ',' + escape(item.name) + ',' + item.thumbPath + ',' + item.path + ',' + escape(item.blessing) + ',' + item.combo + '" />' + vip + '</a></dt>');
			vhtml.push('<dd>' + item.name + '</dd></dl>');
		}
		
		//处理图片中载两次代码
		var dom = document.getElementById("ulTab_1");
		var temphtml = vhtml.join("");
		//为了防止IE6两次
		if (Sys.ie == "6.0") {
			dom.innerHTML="<div style=\"margin:0 auto;line-height:130px;width:60px;\">加载中...</div>";           
			//获取到请求下来的图片
			var wrapHtml = document.createElement("div");
			wrapHtml.innerHTML = temphtml;
			var images = wrapHtml.getElementsByTagName("img");
			
			//等待图片加载完成
			var isComplete=true;
			var curinterval = window.setInterval(function(){
				for(var i = 0, l = images.length; i < l; i++){
					//如果还有未加载完成的，不能翻页
					if(!images[i].complete){
						isComplete = false;
						break;
					}
					isComplete = true;
				}
				if(isComplete){
					window.clearInterval(curinterval);
					GreatCard.showListHtml(dom, temphtml, jsonData, newHot, topGroupId, groupId);
				 }
			}, 10);
		}else{
			GreatCard.showListHtml(dom, temphtml, jsonData, newHot, topGroupId, groupId);
		}
	},
	/*
	 * 显示列表内容
	 * @html {String} 列表字符串
	 * @boxList {Object} 放图片列表的父容器
	 */
	showListHtml: function(boxList, html, jsonData, newHot, topGroupId, groupId){
		var doc = document,
			ulPage = doc.getElementById("ulPage_1"),
			ulPageTop  = doc.getElementById("ulPageTop_1"),
			pageHtml = GreatCard.pageNav(newHot, topGroupId, groupId, jsonData.pageIndex, jsonData.totalPage),
			pageHtml_btm = GreatCard.pageNav(newHot, topGroupId, groupId, jsonData.pageIndex, jsonData.totalPage, true);

		boxList.innerHTML = html;
		ulPage.innerHTML = pageHtml_btm;
		ulPageTop.innerHTML = pageHtml;
		this.bindDropMenu($("#divHCard .selPageBtn"));
		
		//单页时，隐藏翻页栏
		if(jsonData.totalPage < 2){
			ulPage.style.display = "none";
			ulPageTop.style.display = "none";
		}else{
			ulPage.style.display = "block";
			ulPageTop.style.display = "block";
		}

		//保存到本地
		var nodeId = "divContent_" + newHot + "_" + topGroupId + "_" + groupId + "_" + jsonData.pageIndex,
			divCon = doc.getElementById("divContent");

		MaterialListHtml[nodeId] = divCon.innerHTML;//将翻页素材储存在MaterialListHtml中
	},
	//显示FLASH
	materialClick: function(id, name, thumbPath, path, blessing, combo, isBack){
		Utils.logReports({
			mouduleId: 14,
			action: 10536,
			thing: "showFlash"
		});
		
		//点击的贺卡    
		var cardNew = new this.CardMaterial(id, name, thumbPath, path, blessing, combo, isBack);
		var vipInfo = (top.UserData.vipInfo && /^\d+$/.test(top.UserData.vipInfo.MAIL_2000008)) ? (top.UserData.vipInfo.MAIL_2000008 || "2") : "2"; //如果接口未返回vipInfo或者MAIL_2000008，默认使用2，全部贺卡都可以免费使用
		var currentUserCombo = parseInt(vipInfo, 10);
		if(currentUserCombo >= combo){
			//用户套餐可用的
			CardInfo = new this.CardMaterial(id, name, thumbPath, path, blessing, combo, isBack);
		}else{
			//用户套餐不可以发送对应的明信片
			var msg = "";
			switch(combo){
				case 1:
				    msg = 'VIP贺卡为5元版、20元版邮箱专属贺卡。立即升级，重新登录后即可使用。'
					//msg= UtilsMessage.vipNoPermissionNotice.format("5", "、20元版", "贺卡");
					break;
				case 2:
					msg= UtilsMessage.vipNoPermissionNotice.format("20", "", "贺卡");
					break;
				default:
					msg= UtilsMessage.vipNoPermissionNotice.format("5", "、20元版", "贺卡");
					break;
			}
			if (top.$User.isNotChinaMobileUser()) {
			    top.$User.showMobileLimitAlert();
			} else {
			    top.FloatingFrame.confirm(msg, function () {
			        //单击确认,调整到套餐页
			        GreatCard.showCard(CardInfo);
			        top.$App.showOrderinfo();
			        top.addBehaviorExt({
			            actionId: 102326,
			            moduleId: 14
			        });
			    }, function () {

			    });
			}
			top.$Msg.getCurrent().on("close", function () {
			    //单击取消,返回到上一张可用的                             
			    GreatCard.showCard(CardInfo);
			});
		}
		//显示最新贺卡
		this.showCard(cardNew);
	},
	defaultMaterialHandler: function (currData){
		this.materialClick(currData.id, escape(currData.name), currData.thumbPath, currData.path, escape(currData.blessing), currData.combo); 
	},
	//为点击的贺卡素材配置参数
	CardMaterial: function(id, name, thumbPath, path, blessing, combo, isBack){
		this.id = id;
		this.name = name;
		this.thumbPath = thumbPath;
		this.path = path;
		this.blessing = blessing;
		this.combo = combo;
		this.isBack = isBack;
	},
	//渲染flash
	showCard: function(card){
		var preNamets = CurrentName;

		//更新当前值
		CurrentMaterialId    = card.id;
		CurrentName          = unescape(card.name);
		CurrentThumbUrl    = GreatCard.getFullUrl(card.thumbPath);
		CurrentFlashUrl       = GreatCard.getFullUrl(card.path);  
		CurrentCombo       = card.combo;

		//更新样式    
		$("#ulTab_1 dl").removeClass("current");
		$("#dlList_"+CurrentMaterialId).addClass("current");

		//修改主题
		if($("#txtSubject").val().length == 0 || $("#txtSubject").val() == (GreatCard.setSubject() +"《"+ preNamets + "》")){
			$("#txtSubject")[0].value = GreatCard.setSubject() +"《"+ CurrentName + "》";    
		}

		var loadingFlash = GreatCard.getFullUrl("loading.swf");
		var so = new SWFObject(loadingFlash, "Loading", "440", "330", 9, "#869ca7");
		so.addParam("quality", "high");
		so.addParam("swLiveConnect", "true");
		so.addParam("menu", "false");
		so.addParam("allowScriptAccess", "sameDomain");
		so.addParam("wmode","opaque");
		so.addVariable("movie",loadingFlash);
		so.addVariable("swfUrl",CurrentFlashUrl);
		so.addParam("movie",loadingFlash);
		so.write("swfcontent"); 

		this.setEditorContent(this.textValue2Html(unescape(card.blessing))); 
		CurrentBlessing = this.getEditorContent(); 
	},
	//翻页条
	pageNav: function(newHot, topGroupId, groupId, pageIndex, pageCount, place){
		var prevClass = "previous",
			nextClass = "next",
			menuClass = (place === true) ? "selMenu ultop" : "selMenu",
			arrowIco = (place === true) ? "sjup" : "sjdown";

		pageIndex = parseInt(pageIndex, 10);
		pageCount = parseInt(pageCount, 10);
		if(pageIndex < 1){
			pageIndex = 1;
		}
		if(pageIndex > pageCount){
			pageIndex = pageCount;
		}
		if(pageIndex == 1){
			prevClass = "previous-disabled";
		}
		if(pageIndex == pageCount){
			nextClass = "next-disabled";
		}
		var prevIndex = pageIndex - 1,
			nextIndex = pageIndex + 1,
			pageStr = [];
		
		if(prevIndex >= 1){
			pageStr.push('<li><a href="javascript:;" title="上一页" param="{0},{1},{2},{3}">上一页</a></li>'
				.format(newHot, topGroupId, groupId, prevIndex));
		}
		if(nextIndex <= pageCount){
			pageStr.push('<li><a href="javascript:;" title="下一页" param="{0},{1},{2},{3}">下一页</a></li>'
				.format(newHot, topGroupId, groupId, nextIndex));
		}
		pageStr.push('<li class="selPageBtn ml_10"><a class="selPageLabel" href="javascript:;"><span>{0}/{1}页</span><i class="{2}"></i></a><ul class="{3}">'
			.format(pageIndex, pageCount, arrowIco, menuClass));
		for(var i = 1; i <= pageCount; i++){
			pageStr.push('<li><a param="{0},{1},{2},{3}" href="javascript:;">{4}/{5}页</a></li>'
					.format(newHot, topGroupId, groupId, i, i, pageCount));
		}
		pageStr.push('</ul></li>');
		pageStr = pageStr.join("");
		return pageStr;
	},
	/*
	 * 素材显示
	 * @newHost {Number} 分类 0: 最新  1:最热  2:按分类
	 * @topGroupId {String} 一级分类 1:节日分类
	 * @groupId {String} 二级分类 如果topGroupId=1，groupId=0 选择全部节日，否则为节日ID
	 * @pageIndex {Number} 当前页数
	 */
	changeGroup: function(newHot, topGroupId, groupId, pageIndex){
		this.pageTimeOut();

		//显示当前分类样式
		$("#divHCard ul li").removeClass("current");
		$("#divGroup li").removeClass("current");
		if(newHot==2){
			$("#liGroupId_" + topGroupId).addClass("current");
		}else if(newHot==0){
			$("#liNew").addClass("current");
		}else if(newHot==1){
			$("#liHot").addClass("current");
		}
		//隐藏子分类
		$("#ulChildGroupId_"+topGroupId).hide();
	  
		pageIndex = parseInt(pageIndex, 10);
		CurrentNewHot = newHot;
		CurrentTopGroupId = topGroupId;
		CurrentGroupId = groupId;
		CurrentPageIndex = pageIndex;
		
		var nodeId = "divContent_" + newHot + "_" + topGroupId + "_" + groupId + "_" + pageIndex,
			theNode = MaterialListHtml[nodeId],
			WrapCard = document.getElementById("divContent");

		//在ie6下会引起点击原来页数，不会再弹出menu
		/*
		if(theNode && nodeId != "divContent_2_5_5_1"){
			WrapCard.innerHTML = theNode;
			this.bindDropMenu($("#divHCard .selPageBtn"));
			//更新素材样式
			$("#ulTab_1 dl").removeClass("current");
			$("#dlList_"+CurrentMaterialId).addClass("current");
		}else{
		*/
			var dataJson = {
			   type:0,
			   newHot:newHot,
			   topGroupId:topGroupId,
			   groupId:groupId,
			   pageIndex:pageIndex,
			   pageSize:pageSize
			},
			dataXml = namedVarToXML("", dataJson, "");
			top.M139.RichMail.API.call(
                GreatCard.getInterfaceUrl("cardPageData"),
                dataXml,
                function (e) {
			        var msg = e.responseData;
			        if (msg.code == "S_OK") {
			            var msg = msg["var"],
                            greatCard = GreatCard;

			            if (greatCard.isInitDataLoad) {
			                greatCard.showList(msg.data, newHot, topGroupId, groupId);//显示素材
			            } else {
			                //初始化接口未加载，缓存翻页接口素材，防止被初始化数据所覆盖
			                greatCard.classData = {
			                    data: msg.data,
			                    newHot: newHot,
			                    topGroupId: topGroupId,
			                    groupId: groupId
			                };
			            }
			            //更新素材样式
			            $("#ulTab_1 dl").removeClass("current");
			            $("#dlList_" + CurrentMaterialId).addClass("current");
			            if (window.isBirthdayPage && nodeId == "divContent_2_5_5_1") {
			                var MaterialData = msg.data.retData[0];
			                $("#txtSubject").val("");

			                if (Utils.queryString("singleBirthDay")) {//有朋友过生日，系统会发送一封提醒发祝福的邮件
			                    var cardId = Utils.queryString("materialId"),
                                    index = GreatCard.listFindIndex(msg.data, cardId);

			                    MaterialData = msg.data.retData[index];
			                }
			                if (!greatCard.isInitDataLoad) { return; }
                            //老代码没有等编辑器加载成功就初始化贺卡，导致报错
			                Utils.waitForReady('GreatCard.isEditorLoad', function () {
			                    GreatCard.materialClick(MaterialData.id, escape(MaterialData.name), MaterialData.thumbPath, MaterialData.path, escape(MaterialData.blessing), MaterialData.combo);
			                });
			            }
			        } else {
			            window.location.href = cardHost + "error/systemTip4.html";
			        }
			    },
                function (XmlHttpRequest, textStatus, errorThrown) {
			        top.FloatingFrame.alert(ShowMsg.LoadFail);
			    }
			);
		//}
	},
	/*
	 * 绑定分类单击事件
	 */
	bindEventChangeGroup: function(){
		var doc = document,
			wrap = doc.getElementById("divHCard"),
			materialLists = doc.getElementById("divContent");

		Utils.addEvent(wrap, "onclick", this.changeGroupHandler);
		Utils.addEvent(materialLists, "onclick", this.materialHandler);
	},
	/**
	 * 绑定模拟下拉菜单
	 * @param obj {Object} 模拟下拉菜单jquery对象
	 */
	bindDropMenu: function (obj) {
		var menu = obj.find(".selMenu"),
			btn = obj.find(".selPageLabel");

		btn.click(function (e){
			e.stopPropagation();
			$(this).next().show();
		});
		$(document).click(function(){
			menu.hide();
		});
	},
	/**
	 * 绑定短信分类模拟下拉菜单
	 * @param obj {Object} 模拟下拉菜单jquery对象
	 */
	bindSmsClassDropMenu: function (obj){
		this.bindDropMenu(obj);

		var menu = obj.find(".selMenu"),
			label = obj.find(".drop-down-text");

		menu.click(function (e){
			var target = e.target,
				tagName = target.tagName,
				value = target.getAttribute("value");

			if (tagName != "A") return;
			label.html(target.innerHTML);
			obj.attr("value", value);
			GreatCard.loadSmsListBar(1);
		})
	},
	/*
	 * 点击分类素材显示处理器
	 */
	changeGroupHandler: function(e){
		e = e || event;
		var target = e.target || e.srcElement,
			param = target.getAttribute("param"),
			tagName = target.tagName,
			arr = [];

		if(param){
			arr = param.split(",");
			GreatCard.changeGroup(parseInt(arr[0], 10), arr[1], arr[2], parseInt(arr[3], 10));
		}
	},
	/*
	 * 显示点击素材函数
	 */
	materialHandler: function(e){
		e = e || event;
		var target = e.target || e.srcElement,
			param = target.getAttribute("info"),
			arr = [];

		if(param){
			arr = param.split(",");
			var combo = parseInt(arr[5], 10);
			combo = combo == 2? 1:combo;
			GreatCard.materialClick(parseInt(arr[0], 10), arr[1], arr[2], arr[3], arr[4], combo);
		}
	},
	bindEventSmsList: function(){
		$("#divMessage").click(function(e){
			var target = e.target,
				page = target.getAttribute("page");

			if (!page) return;
			GreatCard.loadSmsListBar(parseInt(page, 10));
		});
	},
	//获得经典短信分类
	loadSmsClass: function(){
		this.pageTimeOut();
		var smsClassNode = $("#sltSmsListBarClass"),
			pageLabel = smsClassNode.find(".drop-down-text"),
			menu = smsClassNode.find(".selMenu");

		if (menu.children().length > 0) return;
		
		top.M139.RichMail.API.call(
            GreatCard.getInterfaceUrl("getClassicSMS"),
            "",
            function (e) {
		        var data = e.responseData;
				if (data.code == "S_OK") {
					var data = data["var"],
						table = data.table,
						template = "",
						defaultValue = HolidayId > -1 ? "26_" + HolidayId : "26_0",
						defaultTxt = "";
					
					for(var i = 0, l = table.length; i < l; i++){
						var item = table[i], 
							value = item.classId + "_" + item.subClassId,
							text = item.className;

						if(item.userNumber){
							value = item.classId + "-" + item.userNumber;
						}
						if(item.subClassId > 0){
							text = "-" + text;
						}
						if (value === defaultValue) {
							defaultTxt = text;
						}
						template += '<li><a href="javascript:;" value="{0}">{1}</a></li>'
							.format(value, text.encode());
					}
					menu.html(template);
					pageLabel.html(defaultTxt);
					smsClassNode.attr("value", defaultValue);
					GreatCard.bindSmsClassDropMenu(smsClassNode);
					GreatCard.loadSmsListBar(1);
				}else{
					top.FloatingFrame.alert(ShowMsg.GetSmsFailState);
				} 
		    },
            function(XmlHttpRequest, textStatus, errorThrown){
				top.FloatingFrame.alert(ShowMsg.GetSmsFail);
			}
		);
	},
	//加载经典短信列表
	//loadPage=是否加载翻页条
	loadSmsListBar: function(pageIndex){
		this.pageTimeOut();
			   
		 var smsClass = document.getElementById("sltSmsListBarClass"),
			selectValue = smsClass.getAttribute("value"),
			url = "/mw2/card/uploads/Html/SmsListBar/SmsList_" + selectValue + "-" + pageIndex + ".htm?rnd=" + Math.random(),
			param = {},
			reqType = "GET",
			conType = "application/json;charset:utf-8";

		 if (selectValue.indexOf("-") > 0) {
			url = GreatCard.getInterfaceUrl("initSMSList");
			var selArr = selectValue.split("-");
			param = {
				actionId: 0,
				classId: selArr[0],
				pageSize: pageSize,
				pageIndex: pageIndex
			};
			reqType = "POST";
			conType = "application/xml;charset:utf-8";
			param = namedVarToXML("", param, "");
		}

		 top.M139.RichMail.API.call(url, param, function (e) {
		     var data = e.responseData;
				var totalPage = 0,
					dataList = null,
					textHtml = [],//短信
					pageHtmlTop,//翻页
					pageHtml,
					data = data["var"] ? data["var"] : data,
					doc = document,
					smsListBar = doc.getElementById("divSmsListBar"),
					ulPage_2 = doc.getElementById("ulPage_2"),
					ulPageTop_2 = doc.getElementById("ulPageTop_2"),
					className = "";

				smsListBar.innerHTML = "";
				if(selectValue.indexOf("-") > 0){
					totalPage = data.pageCount;
					dataList = data.table;
				}else{
					toLowers(data);
					toLowers(data.tList);
					totalPage = data.totalPage;
					dataList = data.tList;
				}
				if(totalPage > 0){
					for(var i = 0, l = dataList.length; i < l; i++){
						className = (i % 2 == 0) ? "" : "line";
						textHtml.push('<p class="' + className + '">' + dataList[i].content.encode() + '</p>');
					}
				}

				textHtml = textHtml.join("");
				pageHtmlTop = GreatCard.loadPageBar(pageIndex, totalPage);
				pageHtml = GreatCard.loadPageBar(pageIndex, totalPage, true);
				smsListBar.innerHTML = textHtml;
				ulPage_2.innerHTML = pageHtml;
				ulPageTop_2.innerHTML = pageHtmlTop;
				GreatCard.bindDropMenu($("#divMessage .selPageBtn"));

				if(totalPage < 2){
					ulPage_2.parentNode.style.display = "none";
					ulPageTop_2.parentNode.style.display = "none";
				}else{
					ulPage_2.parentNode.style.display = "block";
					ulPageTop_2.parentNode.style.display = "block";
				}
			},
			function(XmlHttpRequest, textStatus, errorThrown){
				top.FloatingFrame.alert(ShowMsg.GetDataError);
			}
		);
	},
	//加载祝福语翻页条
	loadPageBar: function(pageIndex, pageCount, place){
		pageIndex=parseInt(pageIndex, 10);
		pageCount=parseInt(pageCount, 10);
		var prevClass = "previous";
		var nextClass = "next";
		var menuClass = (place === true) ? "selMenu ultop" : "selMenu";
		if(pageIndex<1) pageIndex = 1;
		if(pageIndex>pageCount) pageIndex = pageCount; 
		if(pageIndex == 1) prevClass = "previous-disabled";
		if(pageIndex == pageCount) nextClass = "next-disabled";    
		var prevIndex = pageIndex - 1;
		var nextIndex = pageIndex + 1;  
		var pageStr = "";    
		if (prevIndex >= 1) {
			pageStr += '<li><a href="javascript:;" title="上一页" page="{0}">上一页</a></li>'.format(prevIndex);
		}
		if (nextIndex <= pageCount) {
			pageStr += '<li><a href="javascript:;"  title="下一页" page="{0}">下一页</a></li>'.format(nextIndex);
		}

		pageStr += '<li class="selPageBtn ml_10"><a class="selPageLabel" href="javascript:;"><span>{0}/{1}页</span><i class="sjdown"></i></a><ul class="{2}">'
			.format(pageIndex, pageCount, menuClass);
		for(var i=1; i<=pageCount; i++){
			pageStr += '<li><a page="{0}" href="javascript:;">{1}/{2}页</a></li>'
					.format(i, i, pageCount);
		}
		pageStr+="</ul></li>";  
		return pageStr;
	},
	//查找
	listFindIndex: function(data, materialId){
		var index = 0;
		if(materialId && materialId > 0){
			for(var i = 0, l = data.retData.length; i < l; i++){
				if(data.retData[i].id == materialId){
					index = i;
					break;
				}
			}
		}
		return index;
	},
	//加载生日提醒
	loadBirthday: function(){
	    if (Utils.queryString("birthday") || Utils.queryString("dyinfoBirthday") || Utils.queryString("successBirther")) {
			isBirthdayPage = true;
		}
        if (Utils.queryString("singleBirthDay")) {
        	 if(top.SiteConfig.birthMail){
        	 	birthdayData = top.$App.get('birth').birdthMan;
        	 	GreatCard.initBirthData(birthdayData);
        	 }else{
                 Utils.waitForReady('top.BirthRemind.birdthMan', function () {
                     birthdayData = top.BirthRemind.birdthMan;
                     GreatCard.initBirthData(birthdayData);
                 });
        	 }
		} else {
            Utils.waitForReady('top.$App.getModel("contacts").get("data")', function () {
                if (Utils.queryString("dyinfoBirthday")) {
                    birthdayData = [top.$App.get("dyInfoBirtherData")];
                } else if (Utils.queryString("successBirther")) {
                    birthdayData = [top.$App.get("successBirtherData")];
                } else {
                    birthdayData = top.$App.getModel("contacts").get("data").birthdayContacts || [];
                }
				GreatCard.initBirthData(birthdayData);
			});
		}
	},
	initBirthData:function(birthdayData){
	    if (birthdayData) birthdayData = birthdayData.slice(0,50);
		if(!isBirthdayPage){
			if(birthdayData && parseInt(birthdayData.length, 10) > 0){
				//生日提醒
				new ListByTemplate({
					"linkContainer":"tipsLink",
					"dataSource":birthdayData,
					explainMsg:"已发送祝福"
				});

				$("#tipsLink").click(function(){
					GreatCard.sentNumList();
					//日志上报
					Utils.logReports({
						mouduleId: 14,
						action: 30156,
						thing: "tipsLink"
					});
					return false;
				});

				$("#tipsLink").show();
				$("#trBirthday").hide();
			}
		}else{
			GreatCard.sentNumList();
		}
	},
	//贺卡发送列表
	sentNumList: function(){
		var dataJson = {op: "get"},
			dataXml = namedVarToXML("", dataJson, "");

		top.M139.RichMail.API.call(
            GreatCard.getInterfaceUrl("birthdayRemind"),
			dataXml,
			function (e) {
			    var result = e.responseData;
				var names = "";
				
				if(result["var"]){
					$.each(result["var"].mobiles, function(index, item){ 
						names += item + "、";
					});
				
					if(names != ""){
						names = names.substr(0, names.length - 1);
					}
				}
				
				GreatCard.initBirthdayPage(names);
			},
			function(err){
				GreatCard.initBirthdayPage("");
			}
	   );
	},
	//初始化生日页面
	initBirthdayPage: function(sentList){
		$("#tipsLink").hide();
		$("#trBirthday").show();
		$("#trTool").hide();
		$("#trSubject").hide();
		$("#trReceive").hide();
		//生日提醒		
		br = new ListByTemplate({
			"listContainer":"friendList",
			"dataSource":birthdayData,
			"sentNumbers":sentList,
			"explainMsg":"已发送祝福"
		});
		//去掉重选 
		if (Utils.queryString("singleBirthDay") && br.cleanSelectedItem) {
		  br.cleanSelectedItem();
		  $("#trBirthday").find(".bom_txt").hide();
		}
		isBirthdayPage = true;
		this.changeGroup(2, "5", "5", 1);
	},
	//点击定时发信
	chkDefiniteTimeOnClick: function(setTime){
	    //是否是生日提醒邮件来的
		var doc = document,
			chk = doc.getElementById("chkDefiniteTime"),
			container = doc.getElementById("spanDefiniteTime");
		if(Utils.queryString("singleBirthDay")){
			/*if(chk.checked){
			   $("#autotime").html("<td colspan='2' style='padding-left:55px;'><span style='color:#999;'>贺卡将于好友生日当天上午9时单独发送给TA。</span></td>").show();
			  }else{
			   $("#autotime").hide();
			  }
			  */
          return;
		}
		if(chk.checked){
			$(container).parent().removeClass("hide");
			var now = new Date();
			now.setMinutes(now.getMinutes() + 10);
			
			//获取定时选项栏
			container.innerHTML = this.timeBar(now);

			var selYear = doc.getElementById("selYear"),
				selMonth = doc.getElementById("selMonth"),
				selDay = doc.getElementById("selDay"),
				selHour = doc.getElementById("selHour"),
				selMinute = doc.getElementById("selMinute");

			$("#selMonth").change(function(){
				var date = new Date();
				date.setFullYear($("#selYear").val());
				date.setDate(1);
				date.setMonth($("#selMonth").val());
				date.setDate(0);
				var days = date.getDate();
				date.setDate(1);
				var weekDays = ["日 星期天", "日 星期一", "日 星期二", "日 星期三", "日 星期四", "日 星期五", "日 星期六"];
				var startWeekDay = date.getDay();
				selDay.options.length = 0;
				for (var i = 1; i <= days; i++) {
					var wd = (startWeekDay + i - 1) % 7;
					var op = new Option(i + weekDays[wd], i);
					if (wd == 0 || wd == 6) {
						op.style.color = "red";
					}
					selDay.options.add(op);
				}
			});
			$("#selYear").change(function(){$("#selMonth").change()});

			if(setTime != null && setTime.length > 0){
				var defaultTime = Utils.parseDateString(setTime);

				//默认初始化后选中当前日期
				this.setTimeBar(selYear, selMonth, selDay, selHour, selMinute, defaultTime);
			}else if(window.isBirthdayPage){
				var nodeList = br.getDataList("input[checked=true]");

				if(nodeList != null && nodeList.length > 0){
					if(nodeList.length == 1){
						var sYear = "",
							arr_DateBirthday,
							birtDate = new Date();
						
						//第一个提醒时间
						arr_DateBirthday = nodeList[0].split(',')[1].split("-");
						//如果当前时间是在12月，而生日的月份是1月，则是明年的提醒(年份+1)
						if (parseInt(arr_DateBirthday[1], 10) == 1 && parseInt(arr_DateBirthday[2], 10) < 11 && parseInt(now.getMonth(), 10) == 11){
							sYear = now.getFullYear() + 1;
						}else{
							sYear = now.getFullYear();
						}

						birtDate.setFullYear(sYear);
						birtDate.setDate(parseInt(arr_DateBirthday[2], 10));
						birtDate.setMonth(parseInt(arr_DateBirthday[1], 10) - 1);
						//今天就是生日
						if((now.getHours() > 9) &&(parseInt(arr_DateBirthday[1], 10) == now.getMonth()+1) && (parseInt(arr_DateBirthday[2], 10) == now.getDate())){
							birtDate.setHours(now.getHours());
							birtDate.setMinutes(now.getMinutes());
						}else{
							birtDate.setHours(9);
							birtDate.setMinutes(0);
						}
						
						this.setTimeBar(selYear, selMonth, selDay, selHour, selMinute, birtDate);
					}else{
						this.setTimeBar(selYear, selMonth, selDay, selHour, selMinute, now);
					}
				}
				nodeList = null;
			}else{
				this.setTimeBar(selYear, selMonth, selDay, selHour, selMinute, now);
			}
		}else{
			this.cancelDefiniteTime();
		}
		$("#selYear").focus();
	},
	/*
	 * 获取定时时间的html
	 * @date {Object} 传入时间
	 * return string of html
	 */
	timeBar: function(date){
		var htmlCode = "";
			
		htmlCode += '<label><select id="selYear">';
		htmlCode += "<option value='$i'>$i</option>".$(date.getFullYear(),date.getFullYear()+5).join("");
		htmlCode += '</select>年</label>';
		htmlCode += '<label><select id="selMonth">';
		htmlCode += "<option value='$i'>$i</option>".$(1,12).join("");
		htmlCode += '</select>月</label>';
		htmlCode += '<label><select id="selDay">';
		htmlCode += "<option value='$i'>$i</option>".$(1,31).join("");
		htmlCode += '</select>日</label>';
		htmlCode += '<label><select id="selHour">';
		htmlCode += "<option value='$i'>$i</option>".$(0,23).join("");
		htmlCode += '</select>时</label>';
		htmlCode += '<label><select id="selMinute">';
		htmlCode += "<option value='$i'>$i</option>".$(0,59).join("");
		htmlCode += '</select>分</label>';

		return htmlCode;
	},
	/*
	 * 默认初始化后选中当前日期
	 * @y  {Object} 年DOM
	 * @m {Object} 月DOM
	 * @d  {Object} 日DOM
	 * @h  {Object} 时DOM
	 * @m {Object} 分DOM
	 * @date {Object} 设置的时间
	 */
	 setTimeBar: function(y, m, d, h, mi, date){
		for(var i = 0, l = y.length; i < l; i++){
			if(y[i].value == date.getFullYear()){
				y[i].selected = true;
			}
		}

		m[date.getMonth()].selected = true;
		$("#selMonth").change();
		d[date.getDate() - 1].selected = true;
		h[date.getHours()].selected = true;
		mi[date.getMinutes()].selected = true;
	 },
	//取消定时邮件
	cancelDefiniteTime: function(){
		var chk = document.getElementById("chkDefiniteTime");
		var container = document.getElementById("spanDefiniteTime");
		chk.checked = false;
		$(container).parent().addClass("hide");
	},
	//得到定时邮件设置的时间
	getDefiniteTime: function(){
		if(document.getElementById("chkDefiniteTime").checked){
			return {
				year:$("#selYear").val(),
				month:$("#selMonth").val(),
				day:$("#selDay").val(),
				hour:$("#selHour").val(),
				minute:$("#selMinute").val()
			}
		}else{
			return {year:"",month:"",day:"",hours:"",minute:""};
		}
	},
	//发送邮件
	sendMail: function (thingId) {
	    if (Utils.queryString("sayHello")) {
	        var objlist = $("#onlineList input:checkbox:checked");

	        if (objlist.length > maxrec) {
	            top.$Msg.alert('已超出最大收件人数量，请重新勾选！')
	            return;
	        }
	    }

		this.pageTimeOut();
		if(!this.validate()) return;
		var aSend = document.getElementById("btnSendMail");
		var click1 = aSend.onclick;
		aSend.onclick = null;
		top.WaitPannel.show("正在发送...");
		
		if(window.isBirthdayPage){
			//日志上报
			Utils.logReports({
				mouduleId: 14,
				action: 30161,
				thingId: thingId,
				thing: "sendBirthdayEmail"
			});
		}
		
		/*添加验证套餐代码*/
		var MaterialId = CurrentMaterialId;      
		var param = this.getDefiniteTime();
		param.subject = $("#txtSubject").val();
		if(Utils.queryString("singleBirthDay")){//迟到生日祝福
		   if(Utils.queryString("lateBirth")){
			 param.subject = "迟到的祝福，" + param.subject;
		   }
	    }
		param.content = this.getMailContent();
		param.to = GreatCard.getEmailstr();
		param.splitReceiver = true;
		param.priority = $("#chkUrgent").attr("checked");
		param.returnReceipt = $("#chkReceipt").attr("checked");
		param.saveToSent = $("#chkSaveToSentBox").attr("checked");
		param.callback = function(result) {
			top.WaitPannel.hide(); 
			aSend.onclick=click1;
			if (result.success) {                    
				top._greetingcard_un = GreatCard.getUserName();
				top._greetingcard_re = GreatCard.getEmailstr();//$("#txtTo").val();
				top._greetingcard_et = $("#txtSubject").val();
				GreatCard.writeSuccessLog(MaterialId);
				successReceiverNum = param.to.split(";").length - 1;
				
				Utils.logReports({
					mouduleId: 14,
					action: 220,
					ext1: successReceiverNum,
					thing: "sendCardSuccess"
				});
				setTimeout(function () { //延时跳转，避免后面的代码出现不能执行已释放代码的异常
				    var tid = result.tid?"&tid=" + result.tid:''
				    window.location.href = "/m2012/html/card/card_success.html?isSave=" + ($("#chkSaveToSentBox").attr("checked") ? 1 : 0) + "&defineTime=" + ($("#chkDefiniteTime").attr("checked") ? 1 : 0) + tid + "&materId=" + CurrentMaterialId + "&rnd=" + Math.random();
				}, 100);
				return;
			} else {
				top.FloatingFrame.alert(result.msg);
			}
		}
		if (Utils.queryString("singleBirthDay")) {
		    //调用生日页面的发送生日
			param.isDefiniteTime = $("#chkDefiniteTime").attr("checked");
			if(top.SiteConfig.birthMail){
			    top.$App.get('birth').sendTimeMail(param);
			    setTimeout(function () {
			        window.location.href = "/m2012/html/card/card_success.html?isSave=" + ($("#chkSaveToSentBox").attr("checked") ? 1 : 0) + "&defineTime=" + ($("#chkDefiniteTime").attr("checked") ? 1 : 0) + "&materId=" + CurrentMaterialId + "&rnd=" + Math.random();
			    }, 500);
			    return;
			}else{
			    if (top.BirthRemind) {
			        top.BirthRemind.sendTimeMail(param);
			        return;
			    }
			}
		}
		this.sendMailByCoremail(param);
	},
	//获得邮件内容
	getMailContent: function () {
        //发送到外部的，要使用完整链接
	    var writeBehaviorUrl = "http://" + location.host + "/m2012/html/card/card_writebehavior.html";
	    var title = $("#txtSubject").val();
	    title = top.$T.Html.encode(title);
		var vhtml ="<table id=\"cardinfo\" width=\"660\" align=\"center\" style=\"background:#FDFBE2; font-size:12px; margin-top:18px\">" +
				   "<tr><td style=\"background-repeat:no-repeat; background-position:center 10px; padding:0 60px 0 55px; vertical-align:top; text-align:center;\" background=\""+resourcePath+"/images/heka_mail_bg.jpg\">" +
				   "<div style=\"text-align:right; height:60px; line-height:60px;padding-right:48px\"><a style=\"color:#000; font-family:\"宋体\"\" id=\"139command_greetingcard3\" href=\""+writeBehaviorUrl+"\" target=\"_blank\">登录139邮箱发送更多贺卡>></a></div>"+
				   "<h2 style=\"font-size:14px; margin:12px 0\">" + title + "</h2>" +
				   "<table style=\"width:440px; height:330px;margin:0 auto;\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"background-repeat:no-repeat;background-position:155px 59px;text-align:center\" background=\""+ CurrentThumbUrl +"\" id=\"139command_flash\" rel=\""+CurrentFlashUrl+"\"></td></tr></table>"+
				   "<div style=\"margin:24px 0; font-size:14px\">如果您无法查看贺卡，<a style=\"color:#369\" href=\"http://" + location.host + "/m2012/html/card/card_readcard.html?resPath=" + resourcePath + "&link=" + CurrentFlashUrl + "&from=" + encodeURIComponent($("#txtSubject").val()) + "\" target=\"_blank\">点击此处查看</a></div>" +
				   "<div><a id=\"139command_greetingcard1\" style=\"color:#369\" href=\""+writeBehaviorUrl+"\" target=\"_blank\" style=\"margin-right:60px\"><img style=\"border:none\" src=\""+resourcePath+"/images/heka_mail_bt01.gif\" alt=\"\" /></a><a id=\"139command_greetingcard2\" style=\"color:#369\" href=\""+writeBehaviorUrl+"\" target=\"_blank\"><img style=\"border:none\" src=\""+resourcePath+"/images/heka_mail_bt02.gif\" alt=\"\" /></a></div>"+
				   "<div style=\"line-height:1.8; text-align:left; font-size:14px; padding:12px 48px\">"+ this.getEditorContent() +"</div>"+
				   "</td></tr></table>" +			   
				   "<table><tr><td background=\""+writeBehaviorUrl+"\"></td></tr></table>";
		return vhtml;
	},
	//发送邮件
	sendMailByCoremail: function(param){
		var url = "/coremail/fcg/ldmmapp?funcid=compose&sid=" + top.sid + "&rnd=" + Math.random();
		var result = {};
		if(!checkInputData()){
			fail(ShowMsg.RecNumberError + checkInputData.errorAddr);
			return;
		}
		//检查收件人地址合法性
		function checkInputData(){
			var mailReg=/^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
			var mailRegExt=/^<[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}>$/i;
			var result = true;
			$([param.to, param.cc||"", param.bcc||""]).each(
				function() {
					if (!result) return;
					var txt = this.toString();
					if (!txt) return;
					txt = txt.replace(/"[^"]*"(?=\s*<)/g, "");
					var arr = txt.split(/[;,，；]/);
					for (var i = 0; i < arr.length; i++) {
						if (arr[i].trim() == "") continue;
						if (mailReg.test(arr[i].trim()) || mailRegExt.test(arr[i].trim())) {
							continue;
						} else {
							result = false;
							checkInputData.errorAddr = arr[i];
							return;
						}
					}
				}
			);
			return result;
		}

		//发信接入封装好的接口
		(function () {
			var scheduleDate = param.year ? new top.Date(param.year, param.month - 1, param.day, param.hour, param.minute) : null;
			var mailList = Utils.parseEmail(param.to);
			for (var i = 0; i < mailList.length; i++) {
				mailList[i] = mailList[i].all;
			}
			var selFrom = document.getElementById("selFrom");
			var account = selFrom.options[selFrom.selectedIndex].text;
			var sendMailInfo = {
				account: account,
				to: mailList,
				singleSend: true,
				isHtml: true,
				subject: param.subject,
				content: param.content,
				priority: param.priority ? 1 : 3, //紧急, //是否重要
				sendReceipt: param.returnReceipt,
				saveToSendBox: param.saveToSent,
				timeset: scheduleDate,
				onsuccess: function (successInfo) {
					success(successInfo);
					allways(successInfo);
				},
				onerror: function (errorInfo) {
				    fail(errorInfo);
				}
			};
			top.CM.sendMail(sendMailInfo, Utils.queryString("comefrom") ? Utils.queryString("comefrom") : "greetingCard");
		})();

		/****************修复贺卡定时时间早于当前时间时发送引起的问题*************************/
		function allways(data){ 
			if(data.code=="FA_INVALID_DATE"){
				var result={success:false,msg:ShowMsg.DefineTime};
				  //top.FloatingFrame.alert(ShowMsg.DefineTime);
				if (param.callback) param.callback(result);
		   } 
		}
		  /**************end***************************/
		function fail(errorMsg) {
		    if (errorMsg.code == "FA_INVALID_DATE") {
		        var result = { success: false, msg: ShowMsg.DefineTime };
		        //top.FloatingFrame.alert(ShowMsg.DefineTime);
		        if (param.callback) param.callback(result);
		        return;
		    }
			result.success = false;
			result.msg = errorMsg || ShowMsg.SendFail;
			if (param.callback) param.callback(result);
		}
		function success(res){
		    result.success = true;
		    if(res && res.mid && res.mid.tid){
		        result.tid = res.mid.tid;
		    }
			if (param.callback) param.callback(result);
		}
	},
	//贺卡发送成功写日志上报
	writeSuccessLog: function(id){
		var type = 0,
			receivers=0;
		
		$(top._greetingcard_re.split(/[;,；，]/)).each(
			function(){
				if(this!="") receivers++;
			} 
		);
	   
		var dataJson = {
			type: type,
			id: id,
			count: receivers
		},
		dataXml = namedVarToXML("", dataJson, "\r\n");
		
		top.M139.RichMail.API.call(GreatCard.getInterfaceUrl("successBehavior"),dataXml,function(e){                          
			//成功处理
		});
	},
	//判断页面超时
	pageTimeOut: function(){
		if(Utils.PageisTimeOut(true)){
			return false;
		}
	},
	//获得全路径URL
	getFullUrl: function(s){
		if(s.indexOf(CardResAddress) == -1){
			s = CardResAddress + s;
		}
		return s;
	},
	// 将“\”转义字符转换为HTML代码
	textValue2Html: function(s){
		return s.replace(/\r\n/g, "<br />").replace(/\r/g, "<br />").replace(/\n/g, "<br />");
	},
	//设置编辑器内容
	setEditorContent: function(content){
		if(new RegExp(/<div/i).test(content) == false){
			content = "<div>"+content+"</div>";
		}
		EditorManager.setHtmlContent(content);  
	},
	//获得编辑器内容
	getEditorContent: function(){
		var content = "";
		content = EditorManager.getHtmlContent();     
		return content;
	},
	//判断页面是否被编辑
	checkUserEdit: function(){
		var tovalue = this.getEmailstr();

		if($.trim(tovalue) != "" && $.trim(tovalue) != ShowMsg.PromptMsg) return true;
		if(InitMaterialId != CurrentMaterialId) return true;
		if($("#txtSubject").val() != (this.setSubject() +"《"+ InitName + "》")) return true;
		if(this.getEditorContent() != InitBlessing) return true;
		if($("#chkUrgent").attr("checked")) return true;
		if($("#chkReceipt").attr("checked")) return true;
		if(!$("#chkSaveToSentBox").attr("checked")) return true;
		if($("#chkDefiniteTime").attr("checked")) return true;
		return false;
	},
	/**
	 * 彩信发贺卡
	 * @param {Boolean} isBtnBtm 选填 是否是底部按钮 默认识顶部按钮
	 * @param {Boolean} unValidateNumber 选填 是否不需要检验为移动号码 默认需要
	 */
	sendMms: function (isBtnBtm, unValidateNumber){
		var content = "",
			mobiles = this.getToMobileList(),
			subject = "",
			txtSubjectNode = document.getElementById("txtSubject"),
			txtSubjectVal = txtSubjectNode.value;

		if (CurrentBlessing != this.getEditorContent()) {
			content = EditorManager.getHtmlToTextContent();
		}
		if (content.length > 500) {
			if (!confirm(ShowMsg.SendMmsMax)) return;
			content = content.substring(0, 500);
		}
		if (!unValidateNumber && ValidateModel.unChinaMobileNumberList.length > 0) {
			ValidateView.sendMmsNumberTip(isBtnBtm);
			return;
		}
		if (txtSubjectVal &&
			txtSubjectVal.length != 0 && 
			txtSubjectVal != (GreatCard.setSubject() +"《"+ CurrentName + "》")) {
			subject = txtSubjectVal;
		}
		top._card_greetingcard_content = content;
		//保存本页状态值
		this.savePage();
		var isLog = Utils.queryString("isLog") || 0,
			url = "card_sendmms.html?isLog=" + isLog + "&mobile=" + mobiles + "&subject=" + escape(subject) + "&materialId=" + CurrentMaterialId;
		
		if (Utils.queryString("lazy")) {
			url += "&lazy=" + Utils.queryString("lazy");
		}
		//邮件生日
		if(Utils.queryString("singleBirthDay")){
		   url += "&singleBirthDay=1";
		}
		if (window.isBirthdayPage) {
			url += "&birthday=1";
		}
		if (Utils.queryString("dyinfoBirthday")) {
		    url += "&dyinfoBirthday=1";
		}
		location.href = url;
	},
	//保存本页状态值
	savePage: function(){
		var params = {
			to: GreatCard.getEmailSave(),//getEmailstr();//$("#txtTo").val();
			subject: $("#txtSubject").val(),
			content: GreatCard.getEditorContent(),
			priority: $("#chkUrgent").attr("checked"),
			returnReceipt: $("#chkReceipt").attr("checked"),
			saveToSent: $("#chkSaveToSentBox").attr("checked"),
			defineTime: $("#chkDefiniteTime").attr("checked"),
			materialId: CurrentMaterialId,
			name: CurrentName,
			thumbUrl: CurrentThumbUrl,
			flashUrl: CurrentFlashUrl,
			currentContent: CurrentBlessing,
			newHot: CurrentNewHot,
			topGroupId: CurrentTopGroupId,
			groupId: CurrentGroupId,
			pageIndex: CurrentPageIndex,
			cardResAddress: CardResAddress,
			holidayId: HolidayId,
			initMaterialId: InitMaterialId,
			initName: InitName,
			initBlessing: InitBlessing,
			combo: CurrentCombo
		};

		top._card_greetingcard_pageparams = params;
	},
	getEmailstr: function(){
		var emaillist='';
		if(Utils.queryString("lazy")){    
			var objlist = $("#lazycontactList input:checkbox:checked");
			$(objlist).each(function(i, item){             
				if(MailTool.checkEmail(this.value)){
					emaillist+=this.value+";";
				}
			});
		}else if(window.isBirthdayPage){
			var successMobiles = "";        //已发送生日提醒的列表 号码,日期;13760225650,2011-05-05
			var nodeList=br.getDataList("input[checked=true]");
			var arrBirthday;
			var mobile = "";
			var arr_DateBirthday;
			var arr_DateTemp=top.UserData.ServerDateTime.format("yyyy-MM-dd").split("-");
			var birthday_temp;

			if(nodeList != null && nodeList.length>0){
				for(var i=0;i<nodeList.length;i++){
					arrBirthday = nodeList[i].split(',');
					//提醒邮件地址/号码
					mobile = arrBirthday[0];
					if (mobile.substring(0,2)=="86"){
						mobile = mobile.substring(2);
					}
					emaillist += mobile + "@" + top.$App.getMailDomain()+";";//发送邮件用
					successMobiles += mobile + ",";
					//提醒时间
					arr_DateBirthday = arrBirthday[1].split("-");
					//如果当前时间是在12月，而生日的月份是1月，则是明年的提醒(年份+1)
					if (parseInt(arr_DateBirthday[1], 10) == 1 && parseInt(arr_DateBirthday[2], 10) < 11 && parseInt(arr_DateTemp[1], 10) == 12){
						successMobiles += (parseInt(arr_DateTemp[0], 10)+1).toString();
					}else{
						successMobiles += arr_DateTemp[0];
					}
					successMobiles += "-" + arr_DateBirthday[1] + "-" + arr_DateBirthday[2] + ";";
				}
			}
			top._greetingcard_bn = successMobiles.substr(0,successMobiles.length-1);//保存已发送祝福时用
			nodeList=null;
		}else if(Utils.queryString("sayHello")){
		   var objlist = $("#onlineList input:checkbox:checked");
			$(objlist).each(function(i, item){		
				if(MailTool.checkEmail($(this).attr('email'))){
					emaillist+=$(this).attr('email')+";";
				}
			});
	   }else{
			var arrEmail=richInput.getRightEmails();
			if(arrEmail.length>0){
				for(var i=0;i<arrEmail.length;i++){
				   emaillist+=MailTool.getAddr(arrEmail[i])+";";           
				}
			}
		} 
		return emaillist;
	},
	//点击切换编辑器模式
	aSiwtchEditorOnClick: function(){ 
		EditorManager.toggleToolBar();
	},
	//切换经典短信和贺卡标签
	changeTab: function(obj, type){
		$(".tab-title ul li").removeClass("on");
		$(obj).addClass("on");

		if(type==0){//贺卡
			$("#divMessage").hide();
			$("#divHCard").show();
		}else{
			$("#divMessage").show();
			$("#divHCard").hide();
			GreatCard.loadSmsClass();
		}
		return false;
	},
	getEmailSave: function(){
		var emaillist='';
		if(Utils.queryString("lazy")){    
			$("#lazycontactList input:checkbox:checked").each(function(i, item){
				var txt = this.value.trim();
				if(txt.trim()=="")return;
				if(MailTool.checkEmail(txt)){
				   emaillist+=$(this).parent().text()+"<"+txt+">;";
				}
			});
		}else if(Utils.queryString("sayHello")){
		   $("#onlineList input:checkbox:checked").each(function(i, item){
				var txt = $(this).attr('email').trim();
				if(txt.trim()=="")return;
				if(MailTool.checkEmail(txt)){
				   emaillist+=$(this).parent().text()+"<"+txt+">;";
				}
			});
	
		}else{
			var arrEmail=richInput.getRightEmails();
			if(arrEmail.length>0){
				for(var i=0;i<arrEmail.length;i++){
				   emaillist+=arrEmail[i]+";";           
				}
			}
		}
		return emaillist;
	},
	//获得收件人邮箱中的手机号码，多个用逗号分割
	getToMobileList: function(){
		var result="";
		if(Utils.queryString("lazy")){       
			var num = 0;
			$("#lazycontactList input:checkbox:checked").each(function(i,item){
				if(num>9)return false;//取前10个
				var txt = this.value.trim();
				if(txt.trim()=="")return;
				
				if(MailTool.checkEmail(txt)){
					var mailArray = txt.split('@');
					if(Utils.isChinaMobileNumber(mailArray[0].trim())) {                
						result += $(this).parent().text()+"<"+mailArray[0] + ">,";
						num++;
					}
				}else{
					return;
				}
			});
		}else if(Utils.queryString("sayHello")){//验证打招呼的人
		   var objlist = $("#onlineList input:checkbox:checked");
			 if(objlist.length==0)
			{
				top.FloatingFrame.alert(ShowMsg.NoRecNumber);
				return false;
			}
			 var recnumberError = '';
			$(objlist).each(function(i, item){ 
                 var txt = $(this).attr('email').trim();            
				if(MailTool.checkEmail(txt)){
					var mailArray = txt.split('@');
					var title,pos;
					if(Utils.isChinaMobileNumber(mailArray[0].trim())) {  
						title = $(this).parent().parent().attr('title');
						pos = title.lastIndexOf("(");
						if(pos>0){
						 title = title.substr(0,pos);
						}
						result += title+"<"+mailArray[0] + ">,";
						num++;
					}
				}else{
					return;
				}
			});
	  }else{  
			var arrEmail = richInput.getRightEmails();    
			if (arrEmail.length>0) {
				for (var i = 0, l = arrEmail.length; i < l; i++) {
					var email = arrEmail[i],
						number = MailTool.getAccount(email);

					if (Utils.isChinaMobileNumber(number)) {
						result += number + ",";
					} else {
						ValidateModel.getUnChinaMobileNumberItem(number, MailTool.getAddr(email));
					}
				}
			}
		}
		if(result.length > 0) result = result.substr(0, result.length-1);
		return escape(result);
	},
	//修改主题
	aAddSubjectOnClick: function(link){
		var txt=document.getElementById("txtSubject");
		var container=txt.parentNode.parentNode;
		if(container.style.display=="none"){
			container.style.display="";
			link.innerHTML=ShowMsg.HidTitle;
			link.titleBak=link.title;
			link.title="";
			Utils.focusTextBox(txt);
		}else{
			container.style.display="none";
			link.innerHTML=ShowMsg.ChangeTitle;
			link.title=link.titleBak;
			_LastFocusAddressBox=document.getElementById("txtTo");
		}
	},
	//验证输入数据
	validate: function(){
		if(Utils.queryString("lazy")){
			var objlist = $("#lazycontactList input:checkbox:checked");
			if(objlist.length==0){
				bindRecTip(ShowMsg.NoRecNumber);
				return false;
			}
			if(objlist.length>maxrec){
				bindRecTip(ShowMsg.LazyMaxRecNum);
				return false;
			}
			var recnumberError = '';
			$(objlist).each(function(i, item){             
				if(!MailTool.checkEmail(this.value)){
					recnumberError+=this.value+";";
				}
			});
			if(recnumberError!=null&&recnumberError!=''){
				top.FloatingFrame.alert(ShowMsg.RecNumberError+recnumberError);
				bindRecTip(ShowMsg.RecNumberError+recnumberError);
				return false;
			}
		}else if(window.isBirthdayPage){
			var nodeList=br.getDataList("input[checked=true]");
			if(nodeList == null || nodeList.length<1){
				if(window.isBirthdayPage){
				    top.$Msg.alert(ShowMsg.RecBlessNumber);
				} else {
				    top.$Msg.alert(ShowMsg.NoRecNumberB);
				}
				return false;
			}
			nodeList=null;       
		}else if(Utils.queryString("sayHello")){//验证打招呼的人
		   var objlist = $("#onlineList input:checkbox:checked");
			 if(objlist.length==0){
				bindRecTip(ShowMsg.NoRecNumber);
				return false;
			}
		}else{
			if(!richInput.hasItem()){
				bindRecTip(ShowMsg.NoRecNumber);
				return false;
			}
			if(!checkInputData()){
				bindRecTip(ShowMsg.RecNumberError+checkInputData.errorAddr.encode());
				return false;
			}
			//计算收件人个数
			var maxReceiverNum = maxrec;
			var Emails=richInput.getRightEmails();
			if(Emails.length>maxReceiverNum){
				bindRecTip(ShowMsg.MaxRecNum);
				return false;
			}       
		}
		if ($("#txtSubject").val() == "") {
			if(window.confirm(ShowMsg.NoTitle)){
				$("#txtSubject").val("来自"+$("#selFrom").val()+"的来信");
			}else{
				return false;
			}
		}
		return true;

		function bindRecTip(msg){
			var recTipTools = new GreatCard.TipTools({
				FT: $('#txtTo'),
				objErr: $("#RichInputBoxID"),
				objFocus: $("#RichInputBoxID input"),
				msg: msg
			})
			recTipTools.init();
			window.scrollTo(0, 0);
		}
	},
	/**
	 * 校验提示工具
	 * @param {Object} o 包含参数如下
	 *				{Object} FT 绑定弹出层的容器
	 *				{Object} obj 校验内容容器
	 *				{String} msg 提示语
	 */
	TipTools: function(o){
		var This = this;
		this.FT = o.FT;
		this.objErr = o.objErr;
		this.objFocus = o.objFocus || this.objErr;
		this.msg = o.msg;
		this.FTErr = new floatTips(this.FT);
		this.stopAnimate = function(){
			this.FTErr.fadeOut(200);
			if(this.FTErr.timeOut){
				this.FTErr.fadeOut(200);
				clearTimeout(this.FTErr.timeOut);
			}
			$(this).unbind('focus');
		};
		this.init = function(){
			this.FTErr.tips(this.msg);
			RichInputBox.Tool.blinkBox(this.objErr, 'comErroTxt');
			this.objFocus.bind('focus', function(){
				This.stopAnimate();
			});
		};
	},
	//切换到发彩信贺卡页面
	changeSendMms: function(){
		var isLog = Utils.queryString("isLog") || 0;
		//var mobiles = this.getToMobileList();//GetToMobile();
		
		var url = "card_sendmms.html?isLog="+isLog;//+"&mobile="+mobiles;
			if(Utils.queryString("singleBirthDay")){
		   url += "&singleBirthDay=1";
			}
			if (Utils.queryString("dyinfoBirthday")) {
			    url += '&dyinfoBirthday=1';
			}
		if (window.isBirthdayPage) {
			url += "&birthday=1";
		}
		location.href = url;
	}
}

function setTextAreaSize(txt){
    if (!document.all) return;
    var height = txt.scrollHeight;
    if (height < 40) {
        txt.style.height = (height > 12 ? height : 12) + "px";        
        txt.style.overflowY = "hidden";
    } else {
        txt.style.height = "45px";
        txt.style.overflowY = "scroll";
    }
    if (txt.lastHeight != txt.style.height) {
        txt.lastHeight = txt.style.height;
    }
}
function isLocal(){
    return false;
}
//通讯录回调
function addrCallBack(addr){
	GreatCard.addrCallback(addr);
}
//添加经典短信
function AddSms(){
	var obj = $(".as-nav li:eq(1)");
	GreatCard.changeTab(obj, 1);
}

//供父级调用，确定是否关闭
function onModuleClose(){
    if(Utils.queryString("singleBirthDay")) {
    	$("#swfcontent").html("");  
        return;
    }
	var isClose = true;
	if(GreatCard.checkUserEdit()){
		isClose = confirm(ShowMsg.NoSendCard);        
	} 
	if(isClose) $("#swfcontent").html("");   
	return isClose;
}
//获得收件人邮箱中的手机号码，多个用逗号分割
function GetToMobile(){
    var result="";
    var arrEmail=richInput.getRightEmails();    
    if(arrEmail.length>0){
        for(var i=0;i<arrEmail.length;i++){
            var email = MailTool.getAccount(arrEmail[i]);
            if(Utils.isChinaMobileNumber(email)){
                result+=email+",";           
            }
        }
    }
    if(result.length > 0) result = result.substr(0, result.length-1);
    return result;
}

//发件人select onchange的时候
function selFromOnChange(){
    var selFrom=document.getElementById("selFrom");
    if(selFrom.value=="0"){
        selFrom[0].selected=true;
        window.top.Links.show("alias");//发件人下拉框里点击"设置别名"
    }else if(selFrom.value=="1"){
        selFrom[0].selected=true;
        window.top.Links.show("sendername");//发件人下拉框里点击"设置发件人姓名"
    }
}

//检查收件人地址合法性
function checkInputData(){
    var error = richInput.getErrorText();
    if(error){        
        checkInputData.errorAddr=error.encode();
        return false;;
    }
    return true;
}

/*
 * 将数组或对象中首字母大写的键改成小写
 * @param {Array || Object} param 必填: 为数组或者json对象
 */
function toLowers(param){
	var delKeys = []; //定义数组，存储要删除的大写键
	var len = param.length || 1;

	for(var i = 0; i < len; i++){
		var obj = param[i] || param;
		
		for(var key in obj){
			//将大写键存储在delKeys数组中
			if((/[A-W]/).test(key.substr(0, 1))){
				delKeys.push(key);
			}
			
			var newKey = key.substr(0, 1).toLowerCase() + key.substring(1); //大写键转小写
			obj[newKey] = obj[key];
		}
		
		//清除大写键
		for(var j = 0, l = delKeys.length; j < l; j++){
			delete obj[delKeys[j]];
		}

		obj = null;
		delKeys = [];
	}
}

String.prototype.sub =  function(n) {    
    var r = /[^\x00-\xff]/g;    
    if( this.replace(r, "mm").length <= n)  return  this;   
    // n = n - 3;    
    var m = Math.floor(n/2);    
    for( var i=m; i< this.length; i++) {    
        if( this.substr(0, i).replace(r, "mm").length>=n) {    
        return  this.substr(0, i) +"..."; }    
    }  return  this;   
}; 

//swfobject.js
function SWFObject(swf, id, w, h, ver, c){
	this.params = new Object();
	this.variables = new Object();
	this.attributes = new Object();
	this.setAttribute("id",id);
	this.setAttribute("name",id);
	this.setAttribute("width",w);
	this.setAttribute("height",h);
	this.setAttribute("version",ver);
	this.setAttribute("swf",swf);	
	this.setAttribute("classid","clsid:D27CDB6E-AE6D-11cf-96B8-444553540000");
	this.addParam("bgcolor",c);
};
SWFObject.prototype.addParam = function(key,value){
	this.params[key] = value;
};
SWFObject.prototype.getParam = function(key){
	return this.params[key];
};
SWFObject.prototype.addVariable = function(key,value){
	this.variables[key] = value;
};
SWFObject.prototype.getVariable = function(key){
	return this.variables[key];
};
SWFObject.prototype.setAttribute = function(key,value){
	this.attributes[key] = value;
};
SWFObject.prototype.getAttribute = function(key){
	return this.attributes[key];
};
SWFObject.prototype.getVariablePairs = function(){
	var variablePairs = new Array();
	for(key in this.variables){
		variablePairs.push(key +"="+ this.variables[key]);
	}
	return variablePairs;
};
SWFObject.prototype.getHTML = function(){
	var con = '';
	if (navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) {
		con += '<embed type="application/x-shockwave-flash" wmode="transparent" pluginspage="http://www.macromedia.com/go/getflashplayer" src="'+ this.getAttribute('swf') +'" width="'+ this.getAttribute('width') +'" height="'+ this.getAttribute('height') +'"';
		con += ' id="'+ this.getAttribute('id') +'" name="'+ this.getAttribute('id') +'" ';
		for(var key in this.params){ 
			con += [key] +'="'+ this.params[key] +'" '; 
		}
		var pairs = this.getVariablePairs().join("&");
		if (pairs.length > 0){ 
			con += 'flashvars="'+ pairs +'"'; 
		}
		con += '/>';
	}else{
		con = '<object id="'+ this.getAttribute('id') +'" classid="'+ this.getAttribute('classid') +'"  codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version='+this.setAttribute("version")+',0,0,0" width="'+ this.getAttribute('width') +'" height="'+ this.getAttribute('height') +'">';
		con += '<param name="movie" value="'+ this.getAttribute('swf') +'" />';
		for(var key in this.params) {
		 con += '<param name="'+ key +'" value="'+ this.params[key] +'" />';
		}
		var pairs = this.getVariablePairs().join("&");
		if(pairs.length > 0) {con += '<param name="flashvars" value="'+ pairs +'" />';}
		con += "</object>";
	}
	return con;
};
SWFObject.prototype.write = function (elementId) {
    if (typeof elementId == 'undefined') {
        document.write(this.getHTML());
    } else {
        var n = (typeof elementId == 'string') ? document.getElementById(elementId) : elementId;
        n.innerHTML = this.getHTML();
    }
};

(function(Utils){
	Utils.Timer = {
		startTime: {},
		getStartTime: function(){
			this.startTime = new Date;
		},
		getPassTime: function(){
			var passTime = (new Date - this.startTime) / 1000 + "s"; 
			try {
				if (console && console.log) {
					console.log(passTime);
				}
			} catch (ex) {};
		}
	};
})(Utils);
