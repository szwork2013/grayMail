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


/***************************************************************
 *
 *程序启动
 *
***************************************************************/
$(function(){
	Utils.Timer.getStartTime();
	GCard.init();
	
	Utils.logReports({//进入彩信发贺卡页
		mouduleId: 14,
		action: 2391,
		thing: "mmsSendGreatCardPage"
	});
});

//公共提示语
var ShowMsg = {
    GetMMSInfoFail:		"获取赠送彩信使用情况失败，请稍后再试。",
    CardName:			"为您制作的贺卡",
    LoadFail:			"数据加载失败",
    GetSmsFailState:	"加载祝福语分类失败，请稍后再试。",
    GetSmsFail:			"加载祝福语分类失败，请稍后再试。",
    GetDataFailState:	"加载祝福语列表失败，请稍后再试。",
    GetDataError:		"加载祝福语列表失败，请稍后再试。",
    SendingCard:		"正在发送...",
    SystemBusy:			"彩信发送失败，请稍后再试。",
    NoCard:				"请选择要发送的贺卡！",
    NoRecNumber:		"请填写接收手机",
	NoRecBlessNumber:	"请选择接收祝福的好友",
    MaxSMSText:			"祝福语最多只能输入500个字！",
    NoCode:				"请输入验证码",
    WrongRecNumber:		"请正确填写接收手机号码:",
    MaxRecNumber:		"发送人数超过上限：{0}人",
    NoSendCard:			"确定不发送此贺卡吗？",
    SMSLength:			"您最多只能输入{0}个字！",
    LazyMaxRecNum:		"不能再选择收件人,一次最多只能发送10人",
    SameRecNum:			"不能添加已选择的重复联系人",
    UnicomNum:			"彩信贺卡暂时只能发送给移动用户，请重新添加！",
    HidTitle:			"隐藏主题",
    ChangeTitle:		"更改主题",
    HolidayFree:		"妇女节期间3月5日-3月8日彩信贺卡<span class='style12font-ff0000'>免费发送</span>", // "超出的条数，节日期间彩信贺卡<span class='style12font-ff0000'>免费发送</span>",
    HolidayFree1:		"妇女节期间3月5日-3月8日彩信贺卡免费发送。",//"节日期间彩信贺卡免费发送!"
	ComboUpgradeMsg: '，<a href="javascript:top.$App.showOrderinfo();" style="color:#0344AE">升级邮箱</a>可添加更多！'
};

var PromptMsg = "可同时发给{0}人，手机号以分号“;”隔开，可向全国移动用户发送",
	HolidayId = 0,
	ImageCode = "",
	InitStoreHouseId = 0,
	InitTitle = "",
	InitBlessing = "",
	CurrentStoreHouseId = 0,
	CurrentMaterialId = 0,
	CurrentTitle = "",
	CurrentPathUrl,
	MaxReceiverMobile = 200, //最大群发条数
	pageSize = 8,
	richInput = new Object(),
	//groupSendCount=0,//群发条数

	isBirthdayPage = false,
	birthdayData,
	br,

	CardInfo = {}, //上一张用户套餐可用的贺卡
	MaterialListHtml = {},
	NewHot = {//最新最热
		fresh: 0,
		hot: 1,
		all: 2
	},
	TopGroup = {//一级分类
		all: 0,
		holiday: 1,
		bless: 2,
		friend: 3,
		love: 4,
		birthday: 5
	};


//配置文件
var cardConfig = {
	cardHost: top.isRichmail ? top.SiteConfig.cardMiddleware : "http://" + location.host + "/",
	/*
	 * 获取接口URL
	 * @param {string} param 接口参数名称
	 * @return {string} url
	 */
	getInterfaceUrl: function (param) {
		//接口名称
	    var interFace= "/mw2/card/s?func=card:";
		return interFace + param + "&sid=" + top.$App.getSid();
	}
};

var PageUrl = {
	Success: "http://" + location.host + "/m2012/html/card/card_success.html?type=1&materId=" + CurrentMaterialId + "&rnd=" + Math.random(),
	CardResAddress: "http://images.139cm.com/cximages/card/", //素材地址 防止素材404添加初始化
	Error: "http://smsrebuild1.mail.10086.cn/card/error/systemTip4.html"
};

//浏览器检查
var Sys = {};
var ua = navigator.userAgent.toLowerCase();
var s;
(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

var GCard = {
	isInitDataLoad: false,
	classPageData: {},

	//日封顶数
	maxDaySend: 1000,
	
	//月封顶
	maxMonthSend: 10000,
	
	/*
	 * 封装ajax请求
	 * @url {String} 请求地址
	 * @params {Object} 请求参数
	 * @callback {Function} 回调函数
	 */
	ajaxRequest: function(url, params, callback){
	    top.M139.RichMail.API.call(cardConfig.getInterfaceUrl(url), params, callback);
	},
	/*
	 * json字符串转json对象
	 * @str {String} json字符串
	 * return {Object} json对象
	 */
	strToJson: function(str){
		if (!str) {
			return {};
		}

		if (window.JSON && JSON.parse) {
			return JSON.parse(str);
		} else {
			return eval("(" + str + ")");
		}
	},
	//页面初始化
	init: function(){
		
		this.pageTimeOut();						//超时判断
		this.initData();						//加载初始化数据

		this.showReceivermodule();				//显示接收人模块
		this.initReceivers();					//设置初始化接收人
		this.bindEvent();
		this.setValidateAndSubject();			//设置验证码输入框和主题
		this.getTipInfo();						//获得彩信信息
		this.checkInputWord();					//检查字数
		this.loadBirthday();					//加载生日提醒
	},
	//事件绑定
	bindEvent: function(){
		var doc = document;
		function $id(id){
			return doc.getElementById(id);
		}

		var tbEditor = $("#tbEditor"),
			imgRnd = $id("imgRnd"),
			divCodeImg = $id("divCodeImg"),
			txtValidCode = $id("txtValidCode"),
			smsListBar = $id("divSmsListBar"),        //插入短信内容      
			iarrowDown = $id("iarrowDown"),           //懒人贺卡滚动标志
			//aShowSubject = $id("aShowSubject"),     //更改主题按钮
			btnBack = $id("btnBack"),                 //返回发贺卡页面按钮
			btnBack1 = $id("btnBack1"),
			btnSendMms1 = $id("btnSendMms1"),     //发彩信贺卡按钮
			btnSendMms = $id("btnSendMms"),     
			imgCodeBtn = $id("imgCode"),          //刷新验证码按钮     
			mmsTab = $id("mmsTab"),               //彩信贺卡tab
			smsTab = $id("smsTab"),               //祝福语tab
			smsClassSel = $id("sltSmsListBarClass"), //祝福语分类select
			liNew = $id("liNew").getElementsByTagName("a")[0], //最新链接
			liHot = $id("liHot").getElementsByTagName("a")[0]; //最热链接

		//点击验证码输入框事件
		$("#txtValidCode").focus(function(e) {
			e.stopPropagation();
            if (this.value == this.defaultValue) {
                this.value = "";
                $(this).removeClass("input-default");
            }
            $("#trValide").addClass("show-rnd-img");
            $("#spValidCode").show();
			//显示验证码
			if (!imgRnd.src) {
				GCard.refreshImgRndCode();
			}
            $(document).click(function(e) {
                var elem = e.target;
                while(elem && elem.id != "divValidate"){
	                elem = elem.parentNode;
	            }

	            if(!elem || e.target.id == "spanValidate") {
                    $(document).unbind("click");
                    $("#trValide").removeClass("show-rnd-img");
                    $("#spValidCode").hide();
                }
            });
        });

		//字数检查
		tbEditor.bind("propertychange", GCard.checkInputWord);
		tbEditor.bind("input", GCard.checkInputWord);
		tbEditor.attr("change", "false");
		tbEditor.change(function() {
			tbEditor.attr("change", "true");
		});

		//绑定点击分类显示素材
		this.bindEventChangeGroup();
		this.bindEventSmsList();
		
		//添加按钮(展示通讯录)
		$("#aAddrBook").click(function() {
			var addrFrame = $("#addrFrame");
			if (addrFrame.length == 0) {
				var url = "/m2012/html/addrwin.html?type=mobile&callback=AddrCallback&useNameText=true"
					.format(top.location.host,
						top.isRichmail ? '' : top.stylePath);

				addrFrame = $("<iframe frameBorder='0' style='z-index:2048;display:none;border:1px solid #b1b1b1;height:350px;width:170px;position:absolute;' id='addrFrame' src='" + url + "'></iframe>");
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

		Utils.addEvent(smsListBar, "onclick", function(e){
			e = e || window.event;
			var target = e.target || e.srcElement;

			if (target.tagName == "P") {
				var tbEditor = doc.getElementById("tbEditor"),
				editValue = tbEditor.value;

				tbEditor.value = editValue + GCard.html2Text(target);
				GCard.checkInputWord();

				Utils.logReports({
					mouduleId: 15,
					action: 20015,
					thing: "joinSms"
				});
			}
		})

		Utils.addEvent(iarrowDown, "onclick", this.arrowDown);
		//if(aShowSubject) $(aShowSubject).click(this.addSubjectHandler);
		
		//$(aShowSubject).click(this.addSubjectHandler);
		
		Utils.addEvent(btnBack, "onclick", this.changeSendMail);
		Utils.addEvent(btnBack1, "onclick", this.changeSendMail);
		
        Utils.addEvent(btnSendMms1, "onclick", function(){
			GCard.sendMms("1");
        });

		Utils.addEvent(btnSendMms, "onclick", function(){
			GCard.sendMms("2");
        })
		
		Utils.addEvent(imgCodeBtn, "onclick", function(){
			GCard.refreshImgRndCode();
			return false;
		});
		
		$(mmsTab).click(function(){
			GCard.changeTab(this, 0);
		});
		
		$(smsTab).click(function(){
			GCard.changeTab(this, 1);
		});
		
		Utils.addEvent(smsClassSel, "onchange", function(){
			GCard.loadSmsListBar(1);
		});

		liNew.setAttribute("param", NewHot.fresh + "," + TopGroup.all + "," + "0,1");
		liHot.setAttribute("param", NewHot.hot + "," + TopGroup.all + "," + "0,1");
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
			GCard.loadSmsListBar(1);
		})
	},

	/*
	 * 分类函数
	 */
	changeGroupHandler: function(e){
		e = e || event;
		var target = e.target || e.srcElement,
			param = target.getAttribute("param"),
			tagName = target.tagName,
			arr = [];

		if(param){
			arr = param.split(",");
			GCard.changeGroup(parseInt(arr[0], 10), arr[1], arr[2], parseInt(arr[3], 10));
		}
		return false;
	},

	/*
	 * 显示点击素材函数
	 */
	materialHandler: function(e){
		e = e || event;
		var target = e.target || e.srcElement,
			param = target.getAttribute("info"),
			arr = [];

		if (param) {
			arr = param.split(",");
			GCard.storeHouseClick({
				id: parseInt(arr[0], 10),
				materid: arr[1],
				title: arr[2],
				scale: parseInt(arr[3], 10),
				path: arr[4],
				blessing: arr[5],
				combo: parseInt(arr[6], 10)
			});
		}
		return false;
	},
	bindEventSmsList: function(){
		$("#divMessage").click(function(e){
			var target = e.target,
				page = target.getAttribute("page");

			if (!page) return;
			GCard.loadSmsListBar(parseInt(page, 10));
		});
	},

	//超时判断
	pageTimeOut: function(){
		if(Utils.PageisTimeOut(true)){
			return false;
		}
	},
	
	//接收人输入框或者接收人显示
	showReceivermodule: function(){
		if (Utils.queryString("lazy")) {
			this.bindLazyManHtml();
		} else {
			//地址自动匹配
			var param = {
				container: document.getElementById("txtTo"),
				autoHeight: true,
				type: "mobile",
				plugins: [RichInputBox.Plugin.AutoCompleteMobile]
			}

			richInput = new RichInputBox(param);
			richInput.setTipText(PromptMsg);
		}
	},

	//初始化接收人
	initReceivers: function(){
		if (Utils.queryString("to") != null) {
			richInput.insertItem(Utils.queryString("to"));
		}
	},

	//设置验证码输入框和主题
	setValidateAndSubject: function(){
		var doc = document;
		doc.getElementById("txtSubject").value = "";
		doc.getElementById("spValidCode").style.display = "none";
		doc.getElementById("trControlValidCodeShow").style.display = "none";
	},

	//获得提示信息
	getTipInfo: function(){
		var param = {fromType: 1, actionType: 1},
			dataXml = namedVarToXML("", param, "");
		GCard.getTipInfoAjax(dataXml);
	},

	/**
	 * 获得提示信息初始化ajax
	 * @s {Object} 不同环境的$
	 * @data {String} 发送的请求数据
	 */
	getTipInfoAjax: function(data){
		var self = GCard;

	    top.M139.RichMail.API.call(
            Utils.getAddedSiteUrl("mmsInitData"),
            data,
            function (e) {
                var msg = e.responseData;
                if (msg.code == "S_OK") {
					if (Number(msg.groupNumHint)) {//获取群发条数
						MaxReceiverMobile = Number(msg.groupNumHint);
					}

					//组装发送人数超过上限的提示语
					ShowMsg.MaxRecNumber = ShowMsg.MaxRecNumber.replace("{0}", MaxReceiverMobile);
					if (top.SiteConfig.comboUpgrade && !self.is20Version()) {//非20元套餐
						ShowMsg.MaxRecNumber += ShowMsg.ComboUpgradeMsg;
					}

					self.getMaxDayMonthSend(msg.chargeHint);

                    var doc = document,
						validCodeNode = doc.getElementById("trControlValidCodeShow"),
						divMsg = doc.getElementById("divMsg"),
						mobile = $.trim(Utils.queryString("mobile"));

                    if (mobile && mobile.length > 0) {
                        richInput.insertItem(mobile);
                    } else {
                        richInput.setTipText(PromptMsg.replace("{0}", MaxReceiverMobile));
                    }

                    if (msg.validateUrl == "") {
                        validCodeNode.style.display = "none";
                    } else {
                        ImageCode = msg.validateUrl;
                        validCodeNode.style.display = "";
                    }
                  

                    divMsg.innerHTML = GCard.getPresentMmsInfo(msg);//添加彩信赠送提示语

                    function showPartnerTip() {
                        
                        if (top.$User.needMailPartner()) {
                            $("#divMsg").append("<div><a href='javascript:top.$App.show(\"mobile\")'>*开通邮箱伴侣</a>享受更多彩信优惠</div>");
                            top.BH("partner_guide3");
                        }
                         
                    }
                    showPartnerTip();
                } else {
					richInput.setTipText(PromptMsg.replace("{0}", MaxReceiverMobile));
				}
            },
			function () {
			    top.FloatingFrame.alert(ShowMsg.GetMMSInfoFail);
			}
		);
	},

	//加载初始化数据
	initData: function(){
		var isLog = Utils.queryString("isLog") || 0,//0=写日志上报，1=不写日志上报
			materialId = Utils.queryString("materialId") || 0,
			doc = document;

		if (materialId > 0) {
			doc.getElementById("btnBack").style.display = "";
			doc.getElementById("btnBack1").style.display = "";
		}

		var dataJson = {
				type: 1,
				isLog: isLog,
				materialId: materialId,
				pageSize: pageSize
		   },
		   dataXml = namedVarToXML("", dataJson, "");

		this.ajaxRequest("cardInitData", dataXml, this.initDataRes);
	},

	//加载初始化数据响应
	initDataRes: function (e) {
		var materialId = Utils.queryString("materialId") || 0;
		var msg = e.responseData;
		
		if (msg.code != "S_OK") {
			window.location.href = PageUrl.Error;
			return;
		}

		var msg = msg["var"];
		
		if (msg.address.length > 0) {//资源地址
			PageUrl.CardResAddress = msg.address;
		}
		HolidayId = msg.holidayId;//当前节日ID
		if (msg.groupJson) {//显示分类
			GCard.showGroup(msg.groupJson);
		}
			
		//显示素材
		var newHot = NewHot.hot,
			topGroupId = TopGroup.all,
			groupId = 0,
			currClassId = Utils.queryString("classid"),
			classPageData = GCard.classPageData;

		if (currClassId) {//设置分类(外部调用), 不清楚入口在哪里
			newHot = NewHot.all;
			topGroupId = groupId = currClassId;
			GCard.changeGroup(NewHot.all, currClassId, currClassId, 1);
		} else {
			if (classPageData.jsonData) {
				GCard.showList({
					jsonData: classPageData.jsonData,
					newHot: classPageData.newHot,
					topGroupId: classPageData.topGroupId,
					groupId: classPageData.groupId,
					scale: classPageData.scale
				});
			} else {
				GCard.showList({
					jsonData: msg.data,
					newHot: newHot,
					topGroupId: topGroupId,
					groupId: groupId,
					scale: 0
				});
			}
			GCard.isInitDataLoad = true;
			Utils.Timer.getPassTime();
		}
		if (newHot == NewHot.all) {//显示当前分类样式
			$(".divHCard ul li").removeClass("current");
			$("#divGroup li").removeClass("current");
			$("#liGroupId_" + topGroupId).addClass("current");
		}
		if (msg.data.retData.length > 0) {
			var index = GCard.listFindIndex(msg.data, materialId),
				defaultMaterial = msg.data.retData[index],
				doc = document,
				txtSubject = doc.getElementById("txtSubject"),
				tbEditor = doc.getElementById("tbEditor");
				
			if (classPageData.jsonData) {
				defaultMaterial = classPageData.jsonData.retData[0];
			};
			GCard.storeHouseClick({
				id: defaultMaterial.id,
				materid: defaultMaterial.materialId,
				title: escape(defaultMaterial.name),
				scale: defaultMaterial.scale,
				path: defaultMaterial.path,
				blessing: escape(defaultMaterial.blessing),
				combo: defaultMaterial.combo
			});
				
			if (defaultMaterial.materialId && materialId > 0 && defaultMaterial.materialId == materialId) {
				var subject = $.trim(Utils.queryString("subject")),
					cardContent = top._card_greetingcard_content;

				if (subject) {
					txtSubject.value = subject;
				}
				if (cardContent && $.trim(cardContent) != "") {
					tbEditor.value = cardContent;
					GCard.checkInputWord();
				}
			}

			InitStoreHouseId = defaultMaterial.id;
			CurrentMaterialId = defaultMaterial.materialId; //默认加载的贺卡ID
			InitTitle = txtSubject.value;
			InitBlessing = tbEditor.value;
		}
	},

	/*
	 * 素材显示
	 * @newHost {Number} 分类 0: 最新  1:最热  2:按分类
	 * @topGroupId {String} 一级分类 1:节日分类
	 * @groupId {String} 二级分类 如果topGroupId=1，groupId=0 选择全部节日，否则为节日ID
	 * @pageIndex {Number} 当前页数
	 */
	changeGroup: function(newHot, topGroupId, groupId, pageIndex) {
		$("#hdnNewHot").val(newHot);
		$("#hdnTopGroupId").val(topGroupId);
		$("#hdnGroupId").val(groupId);
		this.showChangeGroup(pageIndex);
	},

	//显示改变分类
	showChangeGroup: function(pageIndex) {
		this.pageTimeOut();

		var newHot = $("#hdnNewHot").val();
		var topGroupId = $("#hdnTopGroupId").val();
		var groupId = $("#hdnGroupId").val();
		var scale = 0; //$("#selScale").val();0:全部

		//显示当前分类样式
		$("#divHCard ul li").removeClass("current");
		$("#divGroup li").removeClass("current");
		if(newHot == NewHot.all){
			$("#liGroupId_" + topGroupId).addClass("current");
		}else if(newHot == NewHot.fresh){	
			$("#liNew").addClass("current");
		}else if(newHot == NewHot.hot){
			$("#liHot").addClass("current");
		}
		
		$("#ulChildGroupId_" + topGroupId).hide();//隐藏子分类

		var nodeId = "divContent_" + newHot + "_" + topGroupId + "_" + groupId + "_" + scale + "_" + pageIndex,
			theNode = MaterialListHtml[nodeId];

		$("#ulTab_1 dl").removeClass("current");//更新素材样式
		$("#dlList_" + CurrentStoreHouseId).addClass("current");

		if (typeof theNode != "undefined" && nodeId != "divContent_2_5_5_0_1") {
			$("#divContent").html(theNode);
			this.bindDropMenu($("#divHCard .selPageBtn"));//翻页下拉菜单重新绑定事件
		} else {
			var dataJson = {
					type: 1,
					newHot: newHot,
					topGroupId: topGroupId, 
					groupId: groupId,
					scale: scale,
					pageIndex: pageIndex,
					pageSize: pageSize
				},
				dataXml = namedVarToXML("", dataJson, "");

			this.ajaxRequest("cardPageData", dataXml, function(e){
				var msg = e.responseData;
				if (msg.code == "S_OK") {
						var msg = msg["var"];

						if (GCard.isInitDataLoad) {
							GCard.showList({//显示素材
								jsonData: msg.data,
								newHot: newHot,
								topGroupId: topGroupId,
								groupId: groupId,
								scale: scale
							});
						} else {
							GCard.classPageData = {
								jsonData: msg.data,
								newHot: newHot,
								topGroupId: topGroupId,
								groupId: groupId,
								scale: scale
							};
						}

						if (msg.data.retData.length > 0 && Utils.queryString("classid") && Utils.queryString("classid") == groupId) {
							var defaultMaterial = msg.data.retData[0];

							if (GCard.isInitDataLoad) {
								GCard.storeHouseClick({
									id: defaultMaterial.id,
									materid: defaultMaterial.materialId,
									title: escape(defaultMaterial.name),
									scale: defaultMaterial.scale,
									path: defaultMaterial.path,
									blessing: escape(defaultMaterial.blessing),
									combo: defaultMaterial.combo
								});
								InitTitle = $("#txtSubject").val();
								InitBlessing = $("#tbEditor").val();
							}
								
							InitStoreHouseId = defaultMaterial.id;
							CurrentMaterialId = defaultMaterial.materialId; //默认加载的贺卡ID
						}
						if (isBirthdayPage && nodeId == "divContent_2_5_5_0_1") {
							var defaultMaterialBir = msg.data.retData[0];

							$("#txtSubject").val("");
							if (!GCard.isInitDataLoad) {return;};
							GCard.storeHouseClick({
								id: defaultMaterialBir.id,
								materid: defaultMaterialBir.materialId,
								title: escape(defaultMaterialBir.name),
								scale: defaultMaterialBir.scale,
								path: defaultMaterialBir.path,
								blessing: escape(defaultMaterialBir.blessing),
								combo: defaultMaterialBir.combo
							});
						}
					} else {
						window.location.href = PageUrl.Error;
					}
			});
		}
	},

	/*
	 * 显示素材列表
	 * @listInfo {Object} 所需信息(jsonData, newHot, topGroupId, groupId, scale)
	 *		jsonData {Object} 素材内容
	 *		newHot {Number} 分类 0:最新  1:最热  2:按分类
	 *		topGroupId {String} 一级分类 1:节日分类
	 *		groupId {String} 二级分类 如果topGroupId=1，groupId=0 选择全部节日，否则为节日ID
	 *		scale {String} 尺寸 
	 */
	showList: function(listInfo) {
		var doc = document, 
			vhtml = [],
			retData = listInfo.jsonData.retData;
			
		for(var i = 0, l = retData.length; i < l; i++){
			var vip = "",
				str = "",
				item = retData[i];

			str = '<dl id="dlList_{id}">\
						<dt>\
							<a href="javascript:;">\
								<img info="{id},{materialId},{name},{scale},{path},{blessing},{combo}" src="{thumbPath}" />\
							{vip}</a>\
						</dt>\
						<dd>{name1}<span>{scale1}</span></dd>\
					</dl>';
			str = String.format(str,{
				id: item.id,
				materialId: item.materialId,
				name: escape(item.name),
				scale: item.scale,
				path: item.path,
				blessing: escape(item.blessing),
				combo: item.combo,
				thumbPath: GCard.getFullUrl(item.thumbPath),
				vip: vip,
				name1: item.name,
				scale1: GCard.getScaleName(item.scale)
			});
			vhtml.push(str);
		}

		//处理图片中载两次代码
		var dom = doc.getElementById("ulTab_1");
		var temphtml = vhtml.join("");
		//为了防耻IE6两次
		if(Sys.ie){
			dom.innerHTML="<div style=\"margin:0 auto;line-height:130px;width:60px;\">加载中...</div>";
			//获取到请求下来的图片
			var wrapHtml = doc.createElement("div");
			wrapHtml.innerHTML = temphtml;
			var images = wrapHtml.getElementsByTagName("img");
			
			//等待图片加载完成
			var isComplete = true;
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
					GCard.showListHtml(dom, temphtml, listInfo);
				 }
			}, 10);
		}else{
			GCard.showListHtml(dom, temphtml, listInfo);
		}
	},

	/*
	 * 显示列表内容
	 * @html {String} 列表字符串
	 * @boxList {Object} 放图片列表的父容器
	 * @listInfo {Object} 列表信息
	 */
	showListHtml: function(boxList, html, listInfo){
		var newHot = listInfo.newHot,
			topGroupId = listInfo.topGroupId,
			groupId = listInfo.groupId,
			scale = listInfo.scale,
			jsonData = listInfo.jsonData,
			doc = document,
			ulPage = doc.getElementById("ulPage_1"),
			ulPageTop  = doc.getElementById("ulPageTop_1"),
			pageHtml = this.pageNav({
				newHot: newHot,
				topGroupId: topGroupId,
				groupId: groupId,
				pageIndex: jsonData.pageIndex,
				pageCount: jsonData.totalPage
			}),
			pageHtml_btm = this.pageNav({
				newHot: newHot,
				topGroupId: topGroupId,
				groupId: groupId,
				pageIndex: jsonData.pageIndex,
				pageCount: jsonData.totalPage,
				place: true
			});
					
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
		var nodeId = "divContent_" + newHot + "_" + topGroupId + "_" + groupId + "_" + scale + "_" + jsonData.pageIndex,
			divCon = doc.getElementById("divContent");

		MaterialListHtml[nodeId] = divCon.innerHTML;//将翻页素材储存在MaterialListHtml中
	},

	//显示分类
	showGroup: function(jsonData){
		var vhtml = [],
			group = jsonData.group;
		
		for (var i = 0, l = group.length; i < l; i++) {
			var item = group[i],
				child = item.child;
				
			if (item.id == 1) {
				vhtml.push(String.format('<li id="liGroupId_{id}"  class="current">\
					<a href="javascript:;" param="{newHot},{topGroup},0,1">{name}</a>', 
					{
						id: item.id,
						newHot: NewHot.all,
						topGroup: TopGroup.holiday,
						name: item.name
					})
				);
				if (child.length > 0) {
					vhtml.push(String.format('<ul id="ulChildGroupId_{id}" class="sub-category" style="display:none">', 
						{id: item.id})
					);
					for (var j = 0, m = child.length; j < m; j++) {
						vhtml.push(String.format('<li><a href="javascript:;" param="{newHot},{id},{childId},1">{name}</a></li>', 
							{
								newHot: NewHot.all,
								id: item.id,
								childId: child[j].id,
								name: child[j].name
							})
						);
					}
					vhtml.push('</ul>');
				}
				vhtml.push('</li>'); 
			} else {
				vhtml.push(String.format('<li id="liGroupId_{id}">\
						<a href="javascript:;" param="{newHot},{id},{id},1">{name}</a>\
					</li>',
					{
						id: item.id,
						newHot: NewHot.all,
						name: item.name
					})
				);
			}
		}		
		$("#divGroup").html(vhtml.join(""));
		//显示或不显示子分类
		$("#divGroup li").hover(
			function(){
				$(this).find("ul").show();
			},
			function(){
				$(this).find("ul").hide();
			}
		);
		//子分类样式
		$("#divGroup li ul").find("li").hover(
			function(){
				$(this).addClass("on");
			},
			function(){
				$(this).removeClass("on");
			}
		); 
	},

	/**
	 * 翻页条
	 * navInfo {Object} 导航信息(newHot, topGroupId, groupId, pageIndex, pageCount, place)
	 *	 place {Boolean} 翻页条位置 上或者下 
	 */
	pageNav: function (navInfo) {
		var  newHot = navInfo.newHot,
			topGroupId = navInfo.topGroupId,
			groupId = navInfo.groupId,
			pageIndex = navInfo.pageIndex,
			pageCount = navInfo.pageCount,
			place = navInfo.place,
			prevClass = "previous",
			nextClass = "next",
			menuClass = (place === true) ? "selMenu ultop" : "selMenu",
			arrowIco = (place === true) ? "sjup" : "sjdown";

		pageIndex = parseInt(pageIndex, 10);
		pageCount = parseInt(pageCount, 10);
		if (pageIndex < 1) {
			pageIndex = 1;
		}
		if (pageIndex > pageCount) {
			pageIndex = pageCount;
		}
		if (pageIndex == 1) {
			prevClass = "previous-disabled";
		}
		if (pageIndex == pageCount) {
			nextClass = "next-disabled";
		}
		var prevIndex = pageIndex - 1,
			nextIndex = pageIndex + 1,
			pageStr = [];
		
		if (prevIndex >= 1) {
			pageStr.push(String.format('<li><a href="javascript:;" title="上一页"  param="{0},{1},{2},{3}">上一页</a></li>',
				[newHot, topGroupId, groupId, prevIndex]));
		}
		if (nextIndex <= pageCount) {
			pageStr.push(String.format('<li><a href="javascript:;" title="下一页"  param="{0},{1},{2},{3}">下一页</a></li>',
				[newHot, topGroupId, groupId, nextIndex]));
		}
		pageStr.push(String.format('<li class="selPageBtn ml_10"><a class="selPageLabel" href="javascript:;"><span>{0}/{1}页</span><i class="{2}"></i></a><ul class="{3}">', [pageIndex, pageCount, arrowIco, menuClass]));

		for (var i = 1; i <= pageCount; i++) {
			pageStr.push(String.format('<li><a param="{0},{1},{2},{3}" href="javascript:;">{3}/{4}页</a></li>',
				[newHot, topGroupId, groupId, i, pageCount]));
		}
		pageStr.push('</ul></li>');
		pageStr = pageStr.join("");
		return pageStr;
	},

	/**
	 * 显示左侧图片
	 * card {Object} 点击右侧贺卡图片的信息(id, materid, title, scale, path, blessing, combo)
	 */
	storeHouseClick: function(card) {
		Utils.logReports({
			mouduleId: 14,
			action: 10536,
			thing: "showGif"
		});

		var id = card.id,
			combo = card.combo;

		if (id == CurrentStoreHouseId) {
			return;
		}

		//点击的贺卡
		var cardNew = card;
		var vipInfo = (top.UserData.vipInfo && /^\d+$/.test(top.UserData.vipInfo.MAIL_2000009)) ? (top.UserData.vipInfo.MAIL_2000009 || "2") : "2"; //如果接口未返回vipInfo或者MAIL_2000009，默认使用2，全部贺卡都可以免费使用
		var currentUserCombo = parseInt(vipInfo, 10);

		if (currentUserCombo >= combo) {
			//用户套餐可用的
			CardInfo = card;
		} else {
			//用户套餐不可以发送对应的明信片
			var msg = 'VIP贺卡为5元版、20元版邮箱专属贺卡。立即升级，重新登录后即可使用。';
			/*
			switch (combo) {
				case 1:
					msg = UtilsMessage.vipNoPermissionNotice.format("5", "、20元版", "贺卡");
					break;
				case 2:
					msg = UtilsMessage.vipNoPermissionNotice.format("20", "", "贺卡");
					break;
				default:
					msg = UtilsMessage.vipNoPermissionNotice.format("5", "、20元版", "贺卡");
					break;
			}
			*/

			top.FloatingFrame.confirm(msg, function() {
				GCard.showCard(CardInfo);
				top.$App.showOrderinfo();//单击确认,调整到套餐页
				top.addBehaviorExt({
					actionId: 102326,
					moduleId: 14
				});
			}, function() {
				GCard.showCard(CardInfo);//单击取消,返回到上一张可用的
			});
            /*todo
			(function() {
				top.$(".clR\\ CloseButton")[0].onclick = function() {
					GCard.showCard(CardInfo);
				}
			})();
            */
		}

		this.showCard(cardNew);
	},

	//显示当前贺卡
	showCard: function(card) {
		var preNamets = CurrentTitle;
		//更新当前值
		CurrentStoreHouseId = card.id;
		CurrentMaterialId = card.materid;
		CurrentTitle = unescape(card.title);
		CurrentPathUrl = this.getFullUrl(card.path);
		//更新样式
		$("#ulTab_1 dl").removeClass("current");
		$("#dlList_" + card.id).addClass("current");
		
		var doc = document,
			txtSubject = doc.getElementById("txtSubject"),
			txtSubjectValue = txtSubject.value,
			imgPreview = doc.getElementById("imgPreview"),
			tbEditor = doc.getElementById("tbEditor"),
			imgarea = doc.getElementById("imgarea");

		if (txtSubjectValue.length == 0 || txtSubjectValue == (this.setSubject() + "《" + preNamets + "》")) {//修改主题
			txtSubject.value = this.setSubject() + "《" + CurrentTitle + "》";
		}

		if (card.scale == 3) {
			imgarea.setAttribute("class", "");
		} else {
			imgarea.setAttribute("class", "small");
		}

		//显示图片
		imgPreview.src = CurrentPathUrl;
		imgPreview.style.display = "";

		//更改祝福语(赋值2次为了解决IE第一输入不触发onpropertychange事件问题
		tbEditor.value = unescape(card.blessing);
		tbEditor.value = unescape(card.blessing);
		tbEditor.setAttribute("text", card.blessing);
		tbEditor.setAttribute("text", card.blessing);

		//检查字数
		GCard.checkInputWord();
	},

	//获得经典短信分类
	loadSmsClass: function() {
		this.pageTimeOut();
		var smsClassNode = $("#sltSmsListBarClass"),
			pageLabel = smsClassNode.find(".drop-down-text"),
			menu = smsClassNode.find(".selMenu");

		if (menu.children().length > 0) return;

		this.ajaxRequest("getClassicSMS", null, function(e){
		    var data = e.responseData;

			if (data.code == "S_OK") {
				var data = data["var"],
					template = "",
					defaultValue = HolidayId > -1 ? "26_" + HolidayId : "26_0",
					defaultTxt = "";

				$.each(data.table, function(i, item) {
					var value = item.classId + "_" + item.subClassId,
						text = item.className;

					if (item.userNumber) {
						value = item.classId + "-" + item.userNumber;
					}
					if (item.subClassId > 0) {
						text = "-" + text;
					}
					if (value === defaultValue) {
						defaultTxt = text;
					}
					template += String.format('<li><a href="javascript:;" value="{0}">{1}</a></li>', [value, text.encode()]);
				});

				menu.html(template);
				pageLabel.html(defaultTxt);
				smsClassNode.attr("value", defaultValue);
				GCard.bindSmsClassDropMenu(smsClassNode);
				GCard.loadSmsListBar(1);
			}else{
				top.FloatingFrame.alert(ShowMsg.GetSmsFailState);
			}
		})
	},

	/*
	 * 加载经典短信列表
	 * @pageIndex {Number} 所翻页数
	 */
	loadSmsListBar: function(pageIndex) {
		this.pageTimeOut();

		var selectValue = $("#sltSmsListBarClass").attr("value"),
			url = "/mw2/card/uploads/Html/SmsListBar/SmsList_"+selectValue+"-"+pageIndex+".htm?rnd="+ Math.random(),
			param = {},
			reqType = "GET",
			conType = "application/json;charset:utf-8";

		if (selectValue.indexOf("-") > 0) {
			url = cardConfig.getInterfaceUrl("initSMSList");
			var splitValue = selectValue.split("-");
			param = {
				actionId: 0,
				classId: splitValue[0],
				pageSize: pageSize,
				pageIndex: pageIndex
			};
			reqType = "POST";
			conType = "application/xml;charset:utf-8";
			param = namedVarToXML("", param, "\r\n");
		}

		top.M139.RichMail.API.call(url, param,
            function (e) {
                var data = e.responseData;
		        var totalPage = 0,
                    dataList = null,
                    textHtml = [],//短信
                    pageHtml,//翻页
                    data = data["var"] ? data["var"] : data,
                    doc = document,
                    smsListBar = doc.getElementById("divSmsListBar"),
                    ulPage_2 = doc.getElementById("ulPage_2"),
                    ulPageTop_2 = doc.getElementById("ulPageTop_2"),
                    className = "";

		        smsListBar.innerHTML = "";
		        if (selectValue.indexOf("-") > 0) {
		            totalPage = data.pageCount;
		            dataList = data.table;
		        } else {
		            GCard.toLowers(data);
		            GCard.toLowers(data.tList);
		            totalPage = data.totalPage;
		            dataList = data.tList;
		        }

		        if (totalPage > 0) {
		            for (var i = 0, l = dataList.length; i < l; i++) {
		                className = (i % 2 == 0) ? "" : "line";
		                textHtml.push('<p class="' + className + '">' + dataList[i].content.encode() + '</p>');
		            }
		        }

		        textHtml = textHtml.join("");
		        pageHtmlTop = GCard.loadPageBar(pageIndex, totalPage);
		        pageHtml = GCard.loadPageBar(pageIndex, totalPage, true);
		        smsListBar.innerHTML = textHtml;
		        ulPage_2.innerHTML = pageHtml;
		        ulPageTop_2.innerHTML = pageHtmlTop;
		        GCard.bindDropMenu($("#divMessage .selPageBtn"));

		        if (totalPage < 2) {
		            ulPage_2.parentNode.style.display = "none";
		            ulPageTop_2.parentNode.style.display = "none";
		        } else {
		            ulPage_2.parentNode.style.display = "block";
		            ulPageTop_2.parentNode.style.display = "block";
		        }
		    },
			function (XmlHttpRequest, textStatus, errorThrown) {
			    top.FloatingFrame.alert(ShowMsg.GetDataError);
			}
		);
	},

	//加载祝福语翻页条
	loadPageBar: function(pageIndex, pageCount, place) {
		pageIndex = parseInt(pageIndex, 10);
		pageCount = parseInt(pageCount, 10);
		var prevClass = "previous";
		var nextClass = "next";
		var menuClass = (place === true) ? "selMenu ultop" : "selMenu";
		if (pageIndex < 1) pageIndex = 1;
		if (pageIndex > pageCount) pageIndex = pageCount;
		if (pageIndex == 1) prevClass = "previous-disabled";
		if (pageIndex == pageCount) nextClass = "next-disabled";
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
		pageStr += '</ul></li>';  
		return pageStr;
	},

	//发送彩信
	sendMms: function(thingId) {
		this.pageTimeOut();
		
		if (!this.validate()) return;

		var doc = document,
			aSend = doc.getElementById("btnSendMms"),
			tbEditor = doc.getElementById("tbEditor"),
			txtSubject = doc.getElementById("txtSubject"),
			txtValidCode = doc.getElementById("txtValidCode"),
			sendHandler = aSend.onclick,
			storeHouseId = CurrentStoreHouseId,
			lotIndex = CurrentPathUrl.lastIndexOf("."),
			//ext = CurrentPathUrl.substring(lotIndex),
			mobilelist = this.getToMobile();
			dataStr = tbEditor.getAttribute("text"),
			cardTitle = txtSubject.value || this.setSubject(),
			validateValue = txtValidCode.value;

		aSend.onclick = null;

		if (escape(tbEditor.getAttribute("change")) == "true") {
			dataStr = escape(tbEditor.value);
		}

		if (validateValue == txtValidCode.defaultValue) {
			validateValue = "";
		}
		
		var dataJson = {
			receiverNumber: mobilelist,
			title: escape(cardTitle), 
			content: dataStr, 
			imageUrl: CurrentPathUrl.replace(PageUrl.CardResAddress, "/uploads/sys/"),
			materialId: storeHouseId,
			validate: validateValue,
			fromType: 1,
			actionId: 2
		},
			dataXml = namedVarToXML("", dataJson, "");

	

		GCard.getMmsPCardAjax(dataJson, sendHandler, mobilelist, storeHouseId);



		if (isBirthdayPage) {
			Utils.logReports({
				mouduleId: 14,
				action: 30160,
				thingId: thingId,
				thing: "sendBirthdayMms"
			});
		}
	},
	
	/**
	 * 获得发送彩信ajax
	 * @data {String} 发送的请求数据
	 * @sendHandler {Fun} 发送按钮绑定的处理器
	 * @mobilelist {String} 接收人列表
	 * @storeHouseId {String} 素材id
	 */
	getMmsPCardAjax: function (dataJson, sendHandler, mobilelist, storeHouseId) {
		var self = this;
	    var data = namedVarToXML("", dataJson, "");
	    top.M139.RichMail.API.call(Utils.getAddedSiteUrl("mmsPCard"), data,
			//top.WaitPannel.show(ShowMsg.SendingCard);todo
			function (e) {
			    var msg = e.responseData;
			    var doc = document,
					aSend = doc.getElementById("btnSendMms");

			    aSend.onclick = sendHandler;
			    top.WaitPannel.hide();

			    if (msg.code == "S_OK") {
			        top.$App.trigger("mms_send", {type:"greetingCard", count: dataJson.receiverNumber.split(",").length });

			        var re = mobilelist.replace(/(")([ \S\t]*?)("\s*<)/g, "");

			        re = re.replace(/<|>/g, "").replace(/[;；，]/g, ",");
			        top._greetingcard_re = re;//接收人
			        top._greetingcard_et = $("#txtSubject").val();
			        GCard.writeSuccessLog(storeHouseId);

			        Utils.logReports({
			            mouduleId: 14,
			            action: 221,
			            thing: "sendMmsCardSuccess"
			        });

			        setTimeout(function () { //延时，避免ie6出现aborted中断http请求
			            window.location.href = PageUrl.Success;
			        },500);
			    } else if (msg.code == "VALIDATE_ERR" || msg.code == "MMS_VALIDATE_INPT") {
			        var validCode = doc.getElementById("trControlValidCodeShow"),
						txtValidCode = doc.getElementById("txtValidCode");

			        validCode.style.display = "";
			        txtValidCode.value = txtValidCode.defaultValue;
			        ImageCode = msg.validateUrl;
			        GCard.refreshImgRndCode();
			        top.FloatingFrame.alert(msg.resultMsg.replace("\\r", ""));
			    } else if (msg.code == "MMS_CARD_5" || msg.code == "MMS_CARD_20") {
			        //不够套餐
			        var msg = UtilsMessage.vipNoPermissionNotice.format("5", "、20元版", "贺卡");

			        top.FloatingFrame.confirm(msg, function () {
			            //单击确认,调整到套餐页
			            top.Links.show('orderinfo');
			        }, function () { });
			    } else if (msg.code == "MMS_DAY_LIMIT" && top.SiteConfig.comboUpgrade) {
					self.tipMaxDayMonthSend();
				} else if (msg.code == "MMS_MONTH_LIMIT" && top.SiteConfig.comboUpgrade) {
					self.tipMaxDayMonthSend(true);
				} else {
					top.FloatingFrame.alert(msg.resultMsg || ShowMsg.SystemBusy);
			    }
			},
			function () {
			    top.WaitPannel.hide();
			    top.FloatingFrame.alert(ShowMsg.SystemBusy);
			}
		);
	},

	//加载生日提醒
	loadBirthday: function(){
	    if (Utils.queryString("birthday") || Utils.queryString("dyinfoBirthday")) {
			isBirthdayPage = true;
		}

	    if (Utils.queryString("dyinfoBirthday")) {
	        birthdayData = [top.$App.get("dyInfoBirtherData")];
	    }else if (Utils.queryString("singleBirthDay")) {
			if(top.SiteConfig.birthMail){
        	 	birthdayData = top.$App.get('birth').birdthMan;
			}else{
			    birthdayData = top.BirthRemind.birdthMan;
			}
		} else {
		    birthdayData =  top.$App.getModel("contacts").get("data").birthdayContacts||[];
		}
		if (birthdayData) {
			birthdayData = birthdayData.slice(0, 10);
		}

		if (!isBirthdayPage) {
			if (birthdayData && parseInt(birthdayData.length) > 0) {
				//生日提醒
				new ListByTemplate({
					"linkContainer":"tipsLink",
					"dataSource":birthdayData,
					explainMsg:"已发送祝福"
				});

				$("#tipsLink").click(function(){
					GCard.sentNumList();
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
		} else {
			this.sentNumList();
		}
	},

	//贺卡发送列表
	sentNumList: function(){
		var dataJson = {
				op: "get"
			},
			dataXml = namedVarToXML("", dataJson, "");

		top.M139.RichMail.API.call(
            cardConfig.getInterfaceUrl("birthdayRemind"),
			dataXml,
			function(result){
				var names = "";
				if (result && result['responseData'] && result['responseData']['code'] == 'S_OK') {
				    result = result['responseData'];
				    if (result["var"]) {
				        $.each(result["var"].mobiles, function (index, item) {
				            names += item + "、";
				        });

				        if (names != "") {
				            names = names.substr(0, names.length - 1);
				        }
				    }
				}
				
				GCard.initBirthdayPage(names);
			},
			function(err){GCard.initBirthdayPage("");}
	   );
	},

	//绑定懒人贺卡HTML
	bindLazyManHtml: function() {
		var mobile = Utils.queryString("mobile");
		
		if(mobile != null && mobile != ""){
			var html = '';
			var objlist = mobile.split(',');

			$.each(objlist, function(i, item){
				var match = item.match(/(.+)<(.+)>/);

				if(match != null && match != ''){
					name = match[1].replace(/\"/g, "");
					email = match[2];
				}else{
					name = email = item;
				}
				
				html += String.format('<li  title="{email}">\
						<label for="chk_{index}">\
							<input type="checkbox" name="chk_{index}" value="{email}" id="chk_{index}" onclick="GCard.setLazyRecCount(this);" checked="checked"/>\
						{name}</label>\
					</li>',
					{
						email: email,
						index: i,
						name: Utils.htmlEncode(name)
					});
			});
			$("#lazycontactList").html(html);
		}
		this.setLazyRecCount();
		$("#txtTo").css("display", "none");
		$("#divLazyMan").css("display", "block");
		$("#trlazy").css("display", "");
		$("#alazy").css("display", "inline");
	},

	//懒人贺卡统计收件人
	setLazyRecCount: function(obj) {
		var len = $("#lazycontactList input:checkbox:checked").length;
		if (obj != null) {
			if (len > MaxReceiverMobile) {
				$(obj).attr("checked", false);
				$("#spanErrMsg").html(ShowMsg.LazyMaxRecNum);
				$("#lazyErrMsg").css("display", "block");
			} else {
				$("#lazyErrMsg").css("display", "none");
				$("#emcheckall").text(len);
			}
		} else {
			//判断是否超过10个
			$("#lazyErrMsg").css("display", "none");
			if (len > MaxReceiverMobile) {
				$("#spanErrMsg").html(ShowMsg.LazyMaxRecNum);
				$("#lazyErrMsg").css("display", "block");
			}
			else {
				$("#lazyErrMsg").css("display", "none");
				$("#emcheckall").text(len);
			}
		}
	},

	//获得每月赠送彩信信息
	getPresentMmsInfo: function(data){
		var s = data.chargeHint.replace(/class="style12font-ff0000"/g, "").replace(/限发/g, '限发<span>').replace(/条/g, '</span>条');
		        
		return "<p>"+s+"</p>";
	},

	//初始化主题内容
	setSubject: function() {
		var name = this.getUserName();

		if (isBirthdayPage) {
			return name + "给你送来了生日贺卡";
		} else {
			return name + ShowMsg.CardName;
		}
	},

	//获得用户名
	getUserName: function() {
	    return top.$User.getTrueName();
	},

	//查找
	listFindIndex: function(data, materialId) {
		var index = 0;
		if (materialId && materialId > 0) {
			for (var i = 0, l = data.retData.length; i < l; i++) {
				if (data.retData[i].materialId == materialId) {
					index = i;
					break;
				}
			}
		}
		return index;
	},

	//获得全路径URL
	getFullUrl: function(s) {
		if (s.indexOf(PageUrl.CardResAddress) == -1 && s.indexOf("http") == -1) {
			s = PageUrl.CardResAddress + s;
		}
		return s;
	},

	//获得尺寸大小
	getScaleName: function(scale) {
		var scaleName = "240*320";
		//1.小(128×128)，2.中(176×220)，3.大(240×320)
		switch (scale) {
			case 1: scaleName = "128×128"; break;
			case 2: scaleName = "176×220"; break;
			case 3: scaleName = "240×320"; break;
		}
		return scaleName;
	},

	//修改主题
	addSubjectHandler: function() {
		var txt = document.getElementById("txtSubject"),
			container = txt.parentNode.parentNode;

		if (container.style.display == "none") {
			container.style.display = "";
			this.innerHTML = ShowMsg.HidTitle;
			this.titleBak = this.title;
			this.title = "";
			Utils.focusTextBox(txt);
		} else {
			container.style.display = "none";
			this.innerHTML = ShowMsg.ChangeTitle;
			this.title = this.titleBak;
			_LastFocusAddressBox = document.getElementById("txtTo");
		}

		return false;
	},

	html2Text: function(obj) {
		var content = "";
		if (document.all) {
			content = obj.innerText;
		} else {
			var tmp = obj.innerHTML;
			tmp = tmp.replace(/<br\s?\/?>/ig, "\n");
			var div = document.createElement("div");
			div.innerHTML = tmp;
			content = div.textContent;
		}
		return content;
	},

	//获得收件人邮箱中的手机号码，多个用逗号分割
	getToMobile: function() {
		var result = "";
		if (Utils.queryString("lazy")) {
			var mailReg = /^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
			var mailRegExt = /^<[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}>$/i;
			$("#lazycontactList input:checkbox:checked").each(function() {
				this.value = this.value.trim();
				var txt = this.value;
				if (Utils.isChinaMobileNumber(txt)) result += txt + ",";
			});
		} else if (isBirthdayPage) {
			var successMobiles = "";        //已发送生日提醒的列表 号码,日期;13760225650,2011-05-05
			var nodeList = br.getDataList("input[checked=true]");
			var arrBirthday;
			var mobile = "";
			var arr_DateBirthday;
			var arr_DateTemp = top.UserData.ServerDateTime.format("yyyy-MM-dd").split("-");
			var birthday_temp;

			if (nodeList != null && nodeList.length > 0) {
				for (var i = 0; i < nodeList.length; i++) {
					arrBirthday = nodeList[i].split(',');
					//提醒邮件地址/号码
					mobile = arrBirthday[0];
					if (mobile.substring(0, 2) == "86") {
						mobile = mobile.substring(2);
					}
					result += mobile + ","; //发送彩信用
					successMobiles += mobile + ",";
					//提醒时间
					arr_DateBirthday = arrBirthday[1].split("-");
					//如果当前时间是在12月，而生日的月份是1月，则是明年的提醒(年份+1)
					if (parseInt(arr_DateBirthday[1], 10) == 1 && parseInt(arr_DateBirthday[2], 10) < 11 && parseInt(arr_DateTemp[1], 10) == 12) {
						successMobiles += (parseInt(arr_DateTemp[0], 10) + 1).toString();
					}
					else {
						successMobiles += arr_DateTemp[0];
					}
					successMobiles += "-" + arr_DateBirthday[1] + "-" + arr_DateBirthday[2] + ";";
				}
			}
			top._greetingcard_bn = successMobiles.substr(0, successMobiles.length - 1); //保存已发送祝福时用
			nodeList = null;
		} else {
			var arrEmail = richInput.getRightNumbers();
			if (arrEmail.length > 0) {
				for (var i = 0; i < arrEmail.length; i++) {
					var email = NumberTool.getNumber(arrEmail[i]);
					if (Utils.isChinaMobileNumber(email)) {
						result += email + ",";
					}
				}
			}
		}
		if (result.length > 0) result = result.substr(0, result.length - 1);
		return result;
	},

	//判断页面是否被编辑
	checkUserEdit: function() {
		var tovalue = this.getToMobile();
		if ($.trim(tovalue) != "" && $.trim(tovalue) != PromptMsg) return true;
		if (InitStoreHouseId != CurrentStoreHouseId) return true;
		if ($.trim($("#txtSubject").val()) != InitTitle) return true;
		if ($.trim($("#tbEditor").val()) != InitBlessing) return true;
		if ($.trim(txtValidCode.value) != "" && $.trim(txtValidCode.value) != txtValidCode.defaultValue) return true;
		return false;
	},

	//成功写日志上报
	writeSuccessLog: function(id) {
		var type = 1;
		var receivers = 0;
		$(top._greetingcard_re.split(/[;,；，]/)).each(
				function() {
					if (this != "") receivers++;
				}
	   );

		var dataJson = {
			type: type,
			id: id,
			count: receivers
		},
			dataXml = namedVarToXML("", dataJson, "");

		top.M139.RichMail.API.call(cardConfig.getInterfaceUrl("successBehavior"), dataXml,
			function (data) {
			    //成功处理
			},
			function () {
			    //错误处理
			}
		);
	},

	//懒人贺卡滚动标志
	arrowDown: function() {
		var height = $("#lazycontactList").css("height");
		if (height == "auto") {
			$("#lazycontactList").css("height", "104px");
			$("#iarrowDown").attr("class", "arrowDown");
		}
		else {
			$("#lazycontactList").css("height", "auto");
			$("#iarrowDown").attr("class", "arrowUp");
		}
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
		isBirthdayPage = true;
		this.changeGroup(2, "5", "5", 1);
	},

	//刷新验证码图片
	refreshImgRndCode: function(){
		var imagecodeUrl = ImageCode;

		imagecodeUrl = imagecodeUrl.replace("clientid=3", "clientid=2")
			.replace("imagecode0", "imagecode");
		document.getElementById("imgRnd").src = imagecodeUrl + Math.random();
	},

	//检查字数
	checkInputWord: function(){
		var doc = document,
			smsLength = 500, //彩信输入文字最大个数
			tbEditor = doc.getElementById("tbEditor"),
			num = tbEditor.value.length, //输入内容文字个数
			textOther = doc.getElementById("pLetterCount").getElementsByTagName("em")[0];
		
		textOther.innerHTML = (smsLength - num) < 0 ? 0 : (smsLength - num); //显示可输入文字个数
		if(num > smsLength){
			//去掉该汉字
			tbEditor.value = $.trim(tbEditor.value).substring(0, smsLength);
			textOther.innerHTML = 0;
			//对象失去焦点，同时弹出(setTimeout是兼容IE检查超出规定字数粘贴的时候焦点blur不了的bug)
			setTimeout(function() {
			   tbEditor.blur();

				var isOpen = top.FloatingFrame.current && !top.FloatingFrame.current.isDisposed;
				if (!isOpen) {
					top.FloatingFrame.alert(ShowMsg.SMSLength.replace("{0}", smsLength));
				}
			}, 0);
		}
	},

	//验证输入数据
	validate: function() {
		var doc = document, 
			tbEditor = doc.getElementById("tbEditor"),
			validCode = doc.getElementById("trControlValidCodeShow"),
			txtValidCode = doc.getElementById("txtValidCode"),
			txtCodeValue = txtValidCode.value;

		if (CurrentPathUrl.length == 0) {
			top.FloatingFrame.alert(ShowMsg.NoCard);
			return false;
		}
		if (tbEditor.value.length > 500) {
			top.FloatingFrame.alert(ShowMsg.MaxSMSText, function() { tbEditor.focus(); });
			return false;
		}

		if (Utils.queryString("lazy")) {
			var objlist = $("#lazycontactList input:checkbox:checked");
			if (objlist.length == 0) {
				bindMobileTip(ShowMsg.NoRecNumber);
				return false;
			}
			if (objlist.length > MaxReceiverMobile) {
				bindMobileTip(ShowMsg.LazyMaxRecNum);
				return false;
			}
			var recnumberError = '';
			$(objlist).each(function(i, item) {
				if (!Utils.isChinaMobileNumber(this.value)) {
					recnumberError += this.value + ";";
				}
			});
			if (recnumberError != null && recnumberError != '') {
				bindMobileTip(ShowMsg.WrongRecNumber + recnumberError)
				return false;
			}
		} else if (isBirthdayPage) {
			var nodeList = br.getDataList("input[checked=true]");
			if (nodeList == null || nodeList.length < 1) {
				bindMobileTip(ShowMsg.NoRecBlessNumber);
				nodeList = null;
				return false;
			} else {
				nodeList = null;
			}
		} else {
			if (!richInput.hasItem()) {
				bindMobileTip(ShowMsg.NoRecNumber);
				return false;
			}
			if (!checkMobileData()) {
				bindMobileTip(ShowMsg.WrongRecNumber + checkMobileData.errorAddr);
				return false;
			}
			//计算收件人个数
			var Emails = richInput.getRightNumbers();
			if (Emails.length > MaxReceiverMobile) {
				bindMobileTip(ShowMsg.MaxRecNumber.replace("{0}", MaxReceiverMobile));
				return false;
			}
		}
		if (validCode.style.display != "none") {
			if ($.trim(txtCodeValue) == "" || txtCodeValue == txtValidCode.defaultValue) {
				var validTipTools = new this.TipTools({
					FT: $('.codearea').parent(),
					objErr: $("#txtValidCode"),
					msg: ShowMsg.NoCode
				});
				validTipTools.init();
				return false;
			}
		}
		return true;

		function bindMobileTip(msg){
			var mobileTipTools = new GCard.TipTools({
				FT: $('#txtTo'),
				objErr: $("#RichInputBoxID"),
				objFocus: $("#RichInputBoxID input"),
				msg: msg
			})
			mobileTipTools.init();
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
	//返回到邮件贺卡页面
	changeSendMail: function() {
		var url = "card_sendcard.html?isBack=1&isLog=1";
		if (Utils.queryString("lazy")) {
			url += "&lazy=" + Utils.queryString("lazy");
		}
		if(Utils.queryString("singleBirthDay")){
			url += "&singleBirthDay=" + Utils.queryString("singleBirthDay")+"&birthday="+Utils.queryString("birthday");
		}
		location.href = url;
		return false;
	},

	//切换经典短信和贺卡标签
	changeTab: function(obj, type) {
		$(".as-nav li").removeClass("current");
		$(obj).addClass("current");
		if (type == 0) {//贺卡
			$("#divMessage").hide();
			$("#divHCard").show();
		} else {
			$("#divMessage").show();
			$("#divHCard").hide();
			GCard.loadSmsClass();
		}
		return false;
	},

	/*
	 * 将数组或对象中首字母大写的键改成小写
	 * @param {Array || Object} param 必填: 为数组或者json对象
	 */
	toLowers: function(param){
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
	},
	
	is20Version: function(){
		return top.$User.getServiceItem() == top.$User.getVipStr("20");
	},

	getMaxDayMonthSend: function (str) {
		if (str == "") return;

		var dayMatch = str.match(/每天限发(\d*)/),
			monthMatch = str.match(/每月限发(\d*)/);

		dayMatch && (this.maxDaySend = dayMatch[1]);
		monthMatch && (this.maxMonthSend = monthMatch[1]);
	},

	/**
	 * @param {Boolean} isMonth 必填 true 为月封顶
	 */
	tipMaxDayMonthSend: function (isMonth) {
		var self = this,
			txt = "发送彩信超过{0}封顶上限：{1}条{2}",
			txt1 = "，升级邮箱可提高每{0}发送上限。",
			day = "日",
			month = "月";

		if (isMonth) {
			txt1 = txt1.format(month);
			txt = txt.format(month, this.maxMonthSend, this.is20Version() ? "" : txt1);
		} else {
			txt1 = txt1.format(day);
			txt = txt.format(day, this.maxDaySend, this.is20Version() ? "" : txt1);
		}

		top.$Msg.confirm(txt, function(){
			!self.is20Version() && top.$App.showOrderinfo();

			var dialog = top.$Msg.getDialog(window);
			dialog && dialog.close();
		}, function(){
			//
		})
	}
};

//获得收件人邮箱中的手机号码，多个用逗号分割
function GetToMobileList() {
    var arrEmail = richInput.getRightNumbers();
    var result = "";
    if (arrEmail.length > 0) {
        for (var i = 0; i < arrEmail.length; i++) {
            var email = NumberTool.getNumber(arrEmail[i]);
            if (Utils.isChinaMobileNumber(email)) {
                result += email + ",";
            }
        }
    }
    if (result.length > 0) result = result.substr(0, result.length - 1);
    return result;
}

//检查收件人手机合法性
function checkMobileData() {
    var error = richInput.getErrorText();
    if (error) {
        checkMobileData.errorAddr = error.encode();
        return false; ;
    }
    return true;
}

//供父级调用，确定是否关闭
function onModuleClose() {
    if (GCard.checkUserEdit()) {
        return confirm(ShowMsg.NoSendCard);
    }
    return true;
}

//通讯录 start
function AddrCallback(addr) {
    var isAdd = 0;

	if (!Utils.queryString("lazy")) {
		richInput.insertItem(addr);
		return;
	}

	var match = addr.match(/(.+)<(.+)>/);
	var name = match[1].replace(/\"/g, "");
	var email = match[2];
	$("#lazyErrMsg").css("display", "none");
	if (!Utils.isChinaMobileNumber(email)) {
		$("#spanErrMsg").html(ShowMsg.UnicomNum);
		$("#lazyErrMsg").css("display", "block");
		return;
	}
	//判断是否超过10个       
	var len = $("#lazycontactList input:checkbox:checked").length;
	if (len > MaxReceiverMobile || len == MaxReceiverMobile) {
		$("#spanErrMsg").html(ShowMsg.LazyMaxRecNum);
		$("#lazyErrMsg").css("display", "block");
		return false;
	}
	$("#lazycontactList input:checkbox").each(function(i, item) {
		if (this.value === email) {
			if ($(this).attr("checked") == false) {
				$(this).attr("checked", true);
				isAdd = 2;
			} else {
				isAdd = 1;
			}
			return false;
		} else {
			return;
		}
	});
	if (isAdd == 0) {
		var i = $("#lazycontactList input:checkbox").length;
		var strHtml = String.format('<li  title="{email}">\
				<label for="chk_{index}">\
					<input type="checkbox" name="chk_{index}" value="{email}" onclick="GCard.setLazyRecCount(this);" id="chk_{index}" checked="checked"/>\
				{name}</label>\
			</li>',
			{
				email: email,
				index: i,
				name: Utils.htmlEncode(name)
			});
		$("#lazycontactList").append(strHtml);
		GCard.setLazyRecCount();
	} else if (isAdd == 2) {
		GCard.setLazyRecCount();
	} else {
		$("#spanErrMsg").html(ShowMsg.SameRecNum);
		$("#lazyErrMsg").css("display", "block");
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
