var NeweditorMessage={
		NeweditorSelError:"请先选择要加入链接的文字。",
		NeweditorTxtError:"纯文本模式无法使用表情!"
}

//实例化,传入一个可编辑的frame,和一个纯文本textarea,接着所有操作都是围绕着他们俩
function EditorBox(frameElement,plainTextElement){
    var theEditorBox=this;  
    this.isHtml=true;
    this.contentFrame=frameElement;
    this.contentPlainText=plainTextElement;
    var This = this;
    var eWin = frameElement.contentWindow;
    var eDoc = eWin.document;
    var supportRedoMode = Boolean($.browser.msie);//IE下实现自定义的撤销
    //定义内容
    if($.browser.mozilla){
        eDoc.body.innerHTML = "<br />";
    }else{
        eDoc.body.innerHTML = "<div></div>";
    }
    //
    if(!document.all){
        if($.browser.opera){
            frameElement.contentWindow.document.body.contentEditable="false";
            frameElement.contentWindow.document.designMode = "on";
        }else{
            frameElement.contentWindow.document.body.contentEditable="true";
            if(navigator.userAgent.indexOf("WebKit")==-1){
                frameElement.contentWindow.document.body.contentEditable = "false";
            }
        }
    }else{
        
    }
    frameElement.contentWindow.eval("window.onerror=function(){return true}");
    $(frameElement.contentWindow.document).click(
        function(){
            if(PopMenu.current)PopMenu.current.hide();
        }
    )
    if(eDoc.attachEvent){  
        eDoc.attachEvent("onkeydown",catchKeyDown);
    }else{  
        eDoc.addEventListener("keydown",catchKeyDown,true);
    }  
    function catchKeyDown(e){
        e = e || window.event;
        var code=e.charCode||e.keyCode;
        
        if(code==9){//tab键
            var strTab = "&nbsp;&nbsp;&nbsp;&nbsp;";
            var sel = This.getSelection();
            var range = toolEditor.getRangeObject(sel);
            if($.browser.msie){//ie  
                range.pasteHTML(strTab);
            }else{  
                var fragment = range.createContextualFragment(strTab);
                var lastChild = fragment.lastChild; //获得DocumentFragment的末尾位置  
                range.insertNode(fragment);  
                range.setEndAfter(lastChild);//设置末尾位置  
                range.collapse(false);//合并范围至末尾  
                sel.removeAllRanges();//清除range  
                sel.addRange(range);//设置range  
            }
            Utils.stopEvent(e);
        }else if(code==13 && !e.ctrlKey && !e.shiftKey){
            //回车换行
            if($.browser.msie){
                var sel = This.getSelection();
                var range = toolEditor.getRangeObject(sel);
                try{
                    var o = range.parentElement();
                    while(o){
                        if(o.tagName=="P" && o==eDoc.body.firstChild && eDoc.body.childNodes.length==1){
                            This.execCommand("formatblock", "<div>");
                            break;
                        }
                        if(!/^(?:td|body|span|font|i|em|b)$/i.test(o.tagName)){
                            break;
                        }else if(o.tagName=="TD" || o.tagName=="BODY"){
                            This.execCommand("formatblock", "<div>");
                            break;
                        }
                        o = o.parentNode;
                    }
                }catch(e){}
            }
        }
        //撤销
        if(e.ctrlKey && supportRedoMode){
            if(code==90){
                This.undo();
                Utils.stopEvent(e);
            }else if(code==89){
                This.redo();
                Utils.stopEvent(e);
            }
        } 
    }
    //在光标位置插入html   
    function insertHTML(doc,html){   
        var sel=doc.selection;   
        if(sel!=null){   
            var rng=sel.createRange();   
            if(rng!=null)   
            rng.pasteHTML(html);   
       }   
    } 
    //命令族start
    this.cut=function(){this.execCommand("Cut")}
    this.copy=function(){this.execCommand("Copy")}
    this.paste=function(){this.execCommand("Paste")}
    this.setBold=function(){this.execCommand("Bold")}
    this.setUnderline=function(){this.execCommand("Underline")}
    this.setItalic=function(){this.execCommand("Italic")}
    this.setFontFamily=function(fontName){this.execCommand("fontname",fontName)}
    this.setFontSize=function(fontSize){this.execCommand("FontSize",fontSize)}
    this.setForeColor=function(color){this.execCommand("ForeColor",color)}
    this.setBackgroundColor=function(color){this.execCommand("BackColor",color)}
    //对齐方式
    this.setJustifyLeft=function(){this.execCommand("JustifyLeft")}
    this.setJustifyCenter=function(){this.execCommand("JustifyCenter")}
    this.setJustifyRight=function(){this.execCommand("JustifyRight")}
    //增加,减少缩进
    this.setIndent=function(){this.execCommand("Indent")}
    this.setOutdent=function(){this.execCommand("Outdent")}
    //数字列表,符号列表
    this.insertOrderedList=function(){this.execCommand("Insertorderedlist")}
    this.insertUnorderedList=function(){this.execCommand("Insertunorderedlist")}
    //清除格式
    this.clearFormat=function(){this.execCommand("ClearFormat")}
    //重做,撤销
    this.redo = function() {
        if (supportRedoMode) {
            history.redo();
        } else {
            this.execCommand("Redo");
        }
    }
    this.undo = function() {
        if (supportRedoMode) {
            history.undo();
        } else {
            this.execCommand("Undo");
        }
    }
    //插入图片
    this.insertImage = function(uri) {
        eWin.focus();
        This.callBeforeCommandEvent("insertImage");
        if ($.browser.msie && top.$.browser.version!=9) {
            var html = "<img src='{0}' />".format(uri);
            var sel = this.getSelection();
            var range = toolEditor.getRangeObject(sel);
            if (sel.type.toLowerCase() == 'control') {
                range.item(0).outerHTML = html;
            } else {
                try {
                    range.pasteHTML(html);
                } catch (e) {
                    eDoc.body.innerHTML = html + eDoc.body.innerHTML;
                }
            }
        } else {
            this.execCommand("InsertImage", uri);
        }
        if (PopMenu.current) PopMenu.current.hide();
        $("img[src='{0}']".format(uri), eDoc).each(function() {
            $(this).load(function() {
                if (this.width > 520 && this.src.indexOf("attachId=") > 0) {
                    var orgWidth = this.width;
                    var orgHeight = this.height;
                    this.setAttribute("orgWidth", orgWidth);
                    this.setAttribute("orgHeight", orgHeight);
                    this.width = 520;
                }
            });
        });
        This.callCommandEvent("insertImage");
    }
    /** 定时触发 **/
    function updateState(){
        try{
            if (frameElement.id && !document.getElementById(frameElement.id)) {
                This.dispose();
                return;
            }
        } catch (e) { }
        try {
            if (This.onUpdateState) This.onUpdateState();
        } catch (e) { }
    }

    var updateStateTimer = setInterval(function() {
        updateState();
    }, 300);
    this.insertTable = function(rows, cells, width, height) {
        This.callBeforeCommandEvent("insertTable");
        var htmlCode = "<table border='1' cellPadding='0' cellSpacing='0'>";
        htmlCode = htmlCode.format(height || "", width || "400px");
        for (var i = 0; i < rows; i++) {
            htmlCode += "<tr>";
            for (var j = 0; j < cells; j++) {
                if ($.browser.msie) {
                    htmlCode += "<td style='width:50px;'></td>";
                } else {
                    htmlCode += "<td style='min-width:50px;'>&nbsp;</td>";
                }
            }
            htmlCode += "</tr>";
        }
        htmlCode += "</table>";
        eWin.focus();
        var sel = this.getSelection();
        var range = toolEditor.getRangeObject(sel);
        if (!$.browser.msie) {
            range.deleteContents();
            var fragment = range.createContextualFragment(htmlCode);
            var lastNode = fragment.lastChild;
            range.insertNode(fragment);
            range.setEndAfter(lastNode); //设置末尾位置  
            range.collapse(false); //合并范围至末尾  
            sel.removeAllRanges(); //清除range
            sel.addRange(range);
        } else if (top.$.browser.version == 9) {
            //ie9
            range.deleteContents();
            var _div = eWin.document.createElement("div");
            _div.innerHTML = htmlCode;
            var lastNode = _div.firstChild;
            range.insertNode(lastNode);
            range.setEndAfter(lastNode); //设置末尾位置  
            range.collapse(false); //合并范围至末尾  
            sel.removeAllRanges(); //清除range
            sel.addRange(range);
        } else {
            if (sel.type.toLowerCase() == 'control') {
                range.item(0).outerHTML = htmlCode;
            } else {
                try {
                    range.pasteHTML(htmlCode);
                } catch (e) {
                    eDoc.body.innerHTML = htmlCode + eDoc.body.innerHTML;
                }
            }
        }
        This.callCommandEvent("insertTable");
    }
    this.dispose = function() {
        top.Debug.write("Editor Dispose");
        clearInterval(updateStateTimer);
        clearInterval(historyTimer);
    }
    this.getSelection = function() {
        return toolEditor.getSelection(eWin);
    }
    var styleObjectElements = { img: 1, hr: 1, li: 1, table: 1, tr: 1, td: 1, embed: 1, object: 1, ol: 1, ul: 1 };
    function getSelectedElementType(sel){
        var type = "";
        if($.browser.msie){
			var ieType = eWin.document.selection.type;
		    if ( ieType == 'Text' )
			    type = "text";
			if (ieType == 'Control')
			    type = "element";
			if (ieType == 'None')
			    type = "none";
	    }else{
	        type = "text";
	        if ( sel.rangeCount == 1 ){
				var range = sel.getRangeAt(0),
					startContainer = range.startContainer;
				if ( startContainer == range.endContainer
					&& startContainer.nodeType == 1
					&& ( range.endOffset - range.startOffset ) == 1
					&& styleObjectElements[ startContainer.childNodes[ range.startOffset ].nodeName.toLowerCase() ] )
				{
				    type = "element";
				}
			}
	    }
	    return type;
    }
    this.getSelectedElement = function() {

        var sel = this.getSelection();
        if (!sel) return null;
        var range = toolEditor.getRangeObject(sel);
        if (!range) return null;
        var node;
        //要理解getType(),getSelectedElement(),getRanges()
        var selectType = getSelectedElementType(sel);
        switch (selectType) {
            case "element":
                {
                    if ($.browser.msie) {
                        try {
                            node = sel.createRange().item(0);
                        }
                        catch (e) { }
                    }
                    else {
                        range = sel.getRangeAt(0);
                        node = range.startContainer.childNodes[range.startOffset];
                    }
                    break;
                }
            case "text": //如果选择的开端是文本
                {
                    if ($.browser.msie) {
                        if (top.$.browser.version == 9) {
                            node = range.startContainer;
                            if (node && !node.tagName && node.parentNode) node = node.parentNode;
                        } else {
                            if (range.text.length > 0) range.collapse(true);
                            node = range.parentElement();
                        }
                    }
                    else {
                        node = sel.anchorNode;
                        if (node.nodeType != 1) node = node.parentNode;
                    }
                    break;
                }
            default:
                {
                    if ($.browser.msie) {
                        if (top.$.browser.version == 9) {
                            node = range.startContainer;
                            if (node && !node.tagName && node.parentNode) node = node.parentNode;
                        } else {
                            node = range.parentElement();
                        }
                    }
                    else {
                        node = sel.anchorNode;
                        if (node.nodeType != 1) node = node.parentNode;
                    }
                    break;
                }
        }
        return node;
    }
    this.insertObject=function(html){
        This.callBeforeCommandEvent("insertObject");
        var obj=frameElement.contentWindow.document.getElementById("content139");
        if(!obj)obj=frameElement.contentWindow.document.body;
        obj.innerHTML=html+obj.innerHTML;
		obj.focus();
		This.callCommandEvent("insertObject");
    }
    //插入超链接
    this.setLink=function(){
        if(getSelectedText(frameElement.contentWindow)==""){
            FloatingFrame.alert("请先选择要加入链接的文字。");
            return;
        }
        FloatingFrame.prompt("系统提示","请输入网址:", "http://",function(url){
            if(url&&url!="http://"){
                This.callBeforeCommandEvent("setLink");
                theEditorBox.execCommand("CreateLink",url);
                This.callCommandEvent("setLink");
            }
        });
    }
    //插入签名
    this.setSign = function(text,scrollIntoView) {
        var today = new Date();
        text = text.replace("$时间$", today.format("yyyy年MM月dd日 星期") + ["天", "一", "二", "三", "四", "五", "六"][today.getDay()]);
        if (this.isHtml) {
            var doc = this.contentFrame.contentWindow.document;
            text = text.replace(/^\s*<p>|<\/p>\s*$/i, "");
            if (!/<\/\w+>/.test(text)) {
                text = text.replace(/\r?\n/g, "<br>");
            }
            var signContainer = doc.getElementById("signContainer");
            if (!signContainer || (signContainer.signLength && signContainer.signLength != signContainer.innerHTML.length)) {
                if (signContainer) signContainer.id = null;
                signContainer = doc.createElement("div");
                signContainer.id = "signContainer";
                var contentObj = doc.getElementById("content139") || doc.body;
                var newLineDiv = doc.createElement("div");
                newLineDiv.innerHTML = "<br/><br/>";
                contentObj.appendChild(newLineDiv);
                contentObj.appendChild(signContainer);
            }
            signContainer.innerHTML = text;
            signContainer.signLength = signContainer.innerHTML.length;
            if(scrollIntoView){
                signContainer.scrollIntoView(true);
                $(signContainer).focus();
            }
        } else {
            this.contentPlainText.value += "\r\n" + text;
        }
    }
    this.addReplyContent=function(content){
        var html=this.getHtmlContent()+"<div><br/><br/></div><br/><div id='signContainer'></div><hr id='replySplit'/><div id='reply139content'>"+content+"</div>";
        this.setHtmlContent(html);
    }
    this.getHtmlContent=function(){
        return this.contentFrame.contentWindow.document.body.innerHTML;
    }
    this.setHtmlContent=function(htmlCode){
        this.contentFrame.contentWindow.document.body.innerHTML=htmlCode;
    }
    //将html文本转化成普通文本
    this.getHtmlToTextContent=function(){
        var body=this.contentFrame.contentWindow.document.body;
        var content="";
        if(document.all){
            content=body.innerText;
        }else{
            var tmp=body.innerHTML;
            tmp=tmp.replace(/<br\s?\/?>/ig,"\n");
            var div=document.createElement("div");
            div.innerHTML=tmp;
            content=div.textContent;
        }
        return content;
    }
    this.getTextToHtmlContent=function(){
        var content=this.contentPlainText.value;
        var div=document.createElement("div");
        if(document.all){
            content=content.replace(/\r?\n/g,"<br>");
            content=content.replace(/ /g,"&nbsp;");
            div.innerHTML=content;
            return div.innerHTML;
        }else{
            div.appendChild(document.createTextNode(content));
            return div.innerHTML.replace(/\r?\n/g,"<br>");
        }
    }
    this.getTextContent=function(){
        return this.contentPlainText.value;
    }
    this.setTextContent=function(text){
        this.contentPlainText.value=text;
    }
    //切换模式 html or 纯文本
    this.switchEditor=function(){
        if(this.isHtml){
            this.setTextContent(this.getHtmlToTextContent());
            this.contentPlainText.style.display="";
            this.contentFrame.style.display="none";
            this.isHtml=false;
        }else{
            this.setHtmlContent(this.getTextToHtmlContent());
            this.contentFrame.style.display="";
            this.contentPlainText.style.display="none";
            this.isHtml=true;
        }
    }
    //命令族end
    
    //最最核心的函数--execCommand
    this.execCommand = function(command, param) {
//        if($.browser.msie){
//            var sel = this.getSelection();
//            try{
//                var range = toolEditor.getRangeObject(sel);
//                if (range.text == "") {
//                    eWin.focus();//focus会引发getBookmark和moveToBookmark
//                }
//            }catch(e){}
//        }
        eWin.focus();
        this.callBeforeCommandEvent(command, param);
        eDoc.execCommand(command, false, param);
        //触发"事件"
        this.callCommandEvent(command, param);
        //收起浮动菜单
        if (PopMenu.current) PopMenu.current.hide();
        updateState();
    }
    //简单地模仿事件...
    var commandEventHandlers = [];
    this.addCommandEventListener = function(handler) {
        commandEventHandlers.push(handler);
    }
    this.callCommandEvent = function(command, param) {
        for (var i = 0; i < commandEventHandlers.length; i++) {
            commandEventHandlers[i](this, command, param);
        }
    }
    var beforeCommandEventHandlers = [];
    this.addBeforeCommandEventListener = function(handler) {
        beforeCommandEventHandlers.push(handler);
    }
    this.callBeforeCommandEvent = function(command, param) {
        for (var i = 0; i < beforeCommandEventHandlers.length; i++) {
            beforeCommandEventHandlers[i](this, command, param);
        }
    }
    
    //2010-03-28 实现撤销功能
    var historyStack=[];
    var redoStack = [];
    var historyTimer;
    var history = {
        add: function() {
            var nowHtml = eDoc.body.innerHTML;
            if (isDifferent()) {
                addNew();
            }
            function isDifferent() {
                if (historyStack.length == 0) return true;
                var lastHistory = historyStack[historyStack.length - 1];
                if (lastHistory.html == nowHtml) return false;
                return true;
            }
            function addNew() {
                var newHistory = {};
                newHistory.html = nowHtml;
                if ($.browser.msie) {
                    newHistory.bookmark = toolEditor.getBookmark(eDoc);
                }
                historyStack.push(newHistory);
                if (historyStack.length > 11) {
                    historyStack.shift();
                }
                redoStack.length = 0;
            }
        },
        undo: function() {
            if (historyStack.length == 0) return;
            history.add();
            if (historyStack.length < 2) return;
            redoStack.push(historyStack.pop());
            var obj = historyStack[historyStack.length - 1];
            this.goHistory(obj);
        },
        redo: function() {
            if (redoStack.length == 0) return;
            var obj = redoStack.pop();
            this.goHistory(obj);
            historyStack.push(obj);
        },
        goHistory: function(obj) {
            //回退历史 ie
            eDoc.body.innerHTML = obj.html;
            var range = eDoc.body.createTextRange();
            if ($.browser.msie) {
                toolEditor.moveToBookmark(eDoc, obj.bookmark);
            }
        },
        //定时监控
        startWatch: function() {
            historyTimer = setInterval(history.add, 2000);
        },
        init: function() {
            if (this.hasInit) return;
            this.hasInit = true;
            //如果支持自定义的撤销
            if (supportRedoMode) {
                this.add();
                this.startWatch();
                This.addBeforeCommandEventListener(history.add);
                This.addCommandEventListener(history.add);
            }
        }
    }
    //2010-03-29 实现保存bookmark
    if($.browser.msie){
        var keepBookmark;
        $(frameElement).bind("beforedeactivate", function() {
            keepBookmark = toolEditor.getBookmark(eDoc);
        });
        $(frameElement).bind('activate', function() {
            history.init();
            if (keepBookmark) {
                toolEditor.moveToBookmark(eDoc, keepBookmark);
                keepBookmark = null;
            }
        });
        setTimeout(function() {
            history.init();
        }, 0);
    }
}

function showFontSizeMenu(host){
    var menu=new PopMenu();
    menu.addItem("<span style='font-size:xx-small;'>六号</span>",function(){theEditorBox.setFontSize(1)});
    menu.addItem("<span style='font-size:x-small;'>五号</span>",function(){theEditorBox.setFontSize(2)});
    menu.addItem("<span style='font-size:small;'>四号</span>",function(){theEditorBox.setFontSize(3)});
    menu.addItem("<span style='font-size:medium;'>三号</span>",function(){theEditorBox.setFontSize(4)});
    menu.addItem("<span style='font-size:large;'>二号</span>",function(){theEditorBox.setFontSize(5)});
    menu.addItem("<span style='font-size:x-large;'>一号</span>",function(){theEditorBox.setFontSize(6)});
    menu.show(host);
}

function showFontFamilyMenu(host){
    var fontFamilies=["宋体","黑体","楷体_GB2313","隶书","幼圆","Arial","Arial Narrow","Arial Black","Comic Sans MS","Courier","System","Times New Roman","Verdana"];
    var menu=new PopMenu();
    for(var i=0;i<fontFamilies.length;i++){
        var a=document.createElement("a");
        a.value=fontFamilies[i];
        a.style.lineHeight="120%";
        a.style.fontFamily=fontFamilies[i];
        a.innerHTML=fontFamilies[i];
        menu.addItem(a,function(item){theEditorBox.setFontFamily(item.value)});
    }
    menu.show(host);
}

function showAlignMenu(host){
    var menu=new PopMenu();
    menu.addItem("左对齐",function(){theEditorBox.setJustifyLeft()});
    menu.addItem("居中对齐",function(){theEditorBox.setJustifyCenter()});
    menu.addItem("右对齐",function(){theEditorBox.setJustifyRight()});
    menu.show(host);
}
function showIndentMenu(host){
    var menu=new PopMenu();
    menu.addItem("增加缩进",function(){theEditorBox.setIndent()});
    menu.addItem("减少缩进",function(){theEditorBox.setOutdent()});
    menu.show(host);
}
function showOrderedlistMenu(host){
    var menu=new PopMenu();
    menu.addItem("数字列表",function(){theEditorBox.insertorderedlist()});
    menu.addItem("符号列表",function(){theEditorBox.insertunorderedlist()});
    menu.show(host);
}
function showColorMenu(host,isBackgroundColor){
    var menu=new PopMenu("colorSelect");
    var colors=["#000000","#993300","#333300","#003300","#003366","#000080","#333399","#333333","#800000","#ff6600","#808000","#008000","#008080","#0000ff","#666699","#808080","#ff0000","#ff9900","#99cc00","#339966","#33cccc","#3366ff","#800080","#999999","#ff00ff","#ffcc00","#ffff00","#00ff00","#00ffff","#00ccff","#993366","#c0c0c0","#ff99cc","#ffcc99","#ffff99","#ccffcc","#ccffff","#99ccff","#cc99ff","#ffffff"];
    var obj;
    for(var i=0,len=colors.length;i<len;i++){
        obj=document.createElement("a");
        obj.href="javascript:void(0)";
        obj.style.backgroundColor=colors[i];
        menu.addItem(obj,function(item){
            if(isBackgroundColor){
                theEditorBox.setBackgroundColor(item.style.backgroundColor);
            }else{
                theEditorBox.setForeColor(item.style.backgroundColor);
            }
        });
    }
    menu.show(host);
}
//PopMenu是一个独立的对象
function PopMenu(containerClass){
    Utils.stopEvent();
    var theMenu=this;
    var container=document.createElement("div");
    this.container=container;
    container.id="editorSelect";
    container.className=containerClass||"editorSelect";
    container.style.display="none";
    var documentClick=null;
    this.show=function(host){
        if(PopMenu.current)PopMenu.current.hide();
        PopMenu.current=theMenu;
        document.body.appendChild(container);
        //Utils.offsetHost(host,container);
        var offset=$(host).offset();
        with(container.style){
            left=offset.left+"px";
            top=offset.top+$(host).height()+"px";
            display="block";
            position="absolute";
        }

        $(document).click(documentClick=function(){
            $(this).unbind("click",arguments.callee);
            if(PopMenu.current)PopMenu.current.hide();
        })

    }
    container.onclick=function(e){
        Utils.stopEvent();
    }
    this.hide=function(){
        if(!PopMenu.current)return;
        if(container.parentNode)container.parentNode.removeChild(container);
        if(theMenu.onHide)theMenu.onHide();
        $(document).unbind("click",documentClick);
        PopMenu.current=null;
    }
    this.addItem = function(title, clickHandler) {
        var item;
        if (typeof (title) == "string") {
            item = document.createElement("a");
            item.innerHTML = title;
        } else {
            item = title;
        }
        item.href = "javascript:void(0)";
        //        item.onmousedown=function(evt){
        //            if(clickHandler)clickHandler(this);
        //            theMenu.hide();
        //        }
        item.onclick = function(evt) {
            if (clickHandler) clickHandler(this);
            theMenu.hide();
            return false;
        }
        container.appendChild(item);
    }
    this.setContent=function(obj){
        if(typeof obj == "string"){
            container.innerHTML=obj;
        }else{
            container.innerHTML="";
            container.appendChild(obj);
        }
    }
}
//插入表格
function showInsertTableMenu(host){
    var menu=new PopMenu("editor_insertTableMenu");
    var rows = 10;
    var cells = 10;
    var htmlCode = "";
    htmlCode += "<div class='editor_insertTableTip' id='editor_tableTip'>请选择表格大小</div>";
    htmlCode+="<table class='editor_insertTable'>";
    var div = document.createElement("div");
    for(var i=0;i<rows;i++){
        htmlCode += "<tr>";
        for(var j=0;j<cells;j++){
            htmlCode += "<td><div class='editor_insertTableItem'></div></td>";
        }
        htmlCode += "</tr>";
    }
    htmlCode += "</table>";
    
    div.innerHTML = htmlCode;
    var table = div.lastChild;
    $(div).mouseover(function(e) {
        if (e.target.className == "editor_insertTableItem") {
            var cell = e.target.parentNode;
            var rowIndex = cell.parentNode.rowIndex;
            var cellIndex = cell.cellIndex;
            showTip("插入 {0} 行 {1} 列的表格".format(rowIndex + 1, cellIndex + 1));
            setCellsStatus(rowIndex, cellIndex);
        }
    }).click(function(e) {
        if (e.target.className == "editor_insertTableItem") {
            var cell = e.target.parentNode;
            var rowIndex = cell.parentNode.rowIndex;
            var cellIndex = cell.cellIndex;
            theEditorBox.insertTable(rowIndex + 1, cellIndex + 1);
            menu.hide();
        }
    });
    menu.setContent(div);
    menu.show(host);
    function setCellsStatus(rowIndex,cellIndex){
        for(var i=0;i<table.rows.length;i++){
            var row = table.rows[i];
            for(var j=0;j<row.cells.length;j++){
                var cell = row.cells[j];
                if(i<=rowIndex && j<=cellIndex){
                    cell.firstChild.style.backgroundColor = "#ccc";
                }else{
                    cell.firstChild.style.backgroundColor = "white";
                }
            }
        }
    }
    function showTip(msg){
        $("#editor_tableTip").html(msg);
    }
}
//表情
function showFaceWindow(host){
    if(!theEditorBox.isHtml){
        return FloatingFrame.alert(NeweditorMessage.NeweditorTxtError);
    }
    var menu=new PopMenu("expression");
    menu.setContent("loading....");
    menu.show(host);
    var offset=$(menu.container).offset();
    setPosition();
    if(window.FaceMenu){
        FaceMenu.init(menu.container);
        setPosition()
    }else{
        Utils.requestByScript("faceMenuScript",top.resourcePath+"/js/facemenu.js",function(){
            if(!window.FaceMenu)return;
            FaceMenu.init(menu.container);
            setPosition()
        });
    }
    function setPosition(){
        $(menu.container).css("left",offset.left-$(menu.container).width()+$(host).width()+"px");
    }
}

//签名
function showSignMenu(host){
    var menu=new PopMenu();
    menu.addItem($("<a style='font-weight:bold' href='javascript:;'>设置签名</a>")[0],function(){
        window.top.Links.show("signature");
    });
    if(window.signList && signList.length>0){
        menu.addItem(document.createElement("hr"),null);
        for(var i=0,j=signList.length;i<j;i++){
            var link=$("<a href='javascript:;'></a>");
            link.text(signList[i].name);
            link.attr("title",signList[i].content);
            menu.addItem(link[0],function(item){
                theEditorBox.setSign(item.title);
            });
        }
    }
    menu.addItem(document.createElement("hr"),null);
    for(var i=0,len=systemSign.length;i<len;i++){
        var link=$("<a href='javascript:;'></a>");
        link.text(systemSign[i]);
        link.attr("title",systemSign[i]);
        menu.addItem(link[0],function(item){
            theEditorBox.setSign(item.title);
        });
    }
    $(menu.container).css({width:"150px",height:"250px",overflow:"auto"});
    menu.show(host);
}


//获取页面上选中的文字
function getSelectedText(win) {     
    if (win.getSelection) {         
        return win.getSelection().toString();     
    }else if(win.document.getSelection){      
        return win.document.getSelection();     
    }else if (win.document.selection){
        return win.document.selection.createRange().text;
    }
    return "";
}

var systemSign=["Best wishes for the year to come!",
						"I hope you have a most happy and prosperous New Year.！",
						"天增岁月人增寿，春满乾坤福满门；福开新运，财源广进！",
						"恭祝您的事业蒸蒸日上，新年更有新气象！",
						"值此春回大地、万象更新之良辰，敬祝您福、禄、寿三星高照，阖府康乐，如意吉祥！ 拜新年！",
						"上联：加薪买房购小车；下联：娶妻生子成家室；横批：接财神！",
						"傲不可长，欲不可纵，乐不可极，志不可满。","宝剑锋从磨砺出，梅花香自苦寒来。",
						"博观而约取，厚积而薄发。","博学之，审问之，慎思之，明辨之，笃行之。",
						"不登高山，不知天之高也；不临深溪，不知地之厚也。","不飞则已，一飞冲天；不鸣则已,一鸣惊人。",
						"不可乘喜而轻诺，不可因醉而生嗔，不可乘快而多事，不可因倦而鲜终。","沧海横流，方显英雄本色。",
						"沉舟侧畔千帆过，病树前头万木春。","尺有所短，寸有所长。物有所不足，智有所不明。"];

toolEditor = {
    hasParent: function(element, tagName) {
        tagName = tagName.toUpperCase();
        while (element) {
            if (element.tagName == tagName) {
                return true;
            }
            element = element.parentNode;
        }
        return false;
    },
    curCSS: function(element, propertyName) {
        if (element.currentStyle) {
            return element.currentStyle[propertyName.replace(/-[a-z]/, function(m) { return m.replace("-", "").toUpperCase() })];
        } else {
            return frames["HtmlEditor"].getComputedStyle(element, '').getPropertyValue(propertyName);
        }
    },
    queryCommandState: function(doc, command) {
        var state = false;
        try {
            state = doc.queryCommandState(command);
        } catch (e) { }
        return state;
    },
    isAlignLeft: function(element) {
        return this.curCSS(element, "text-align") == "left";
    },
    isAlignCenter: function(element) {
        return this.curCSS(element, "text-align") == "center";
    },
    isAlignRight: function(element) {
        return this.curCSS(element, "text-align") == "right";
    },
    getFontSize: function(element) {
        return this.curCSS(element, "font-size");
    },
    getFontFamily: function(element) {
        return this.curCSS(element, "font-family");
    },
    getSelection: function(win) {
        win = win || window;
        var userSelection;
        if (win.getSelection) {
            userSelection = win.getSelection();
        }
        else if (win.document.selection) { // should come last; Opera!
            userSelection = win.document.selection;
        }
        return userSelection;
    },
    getRangeObject: function(selectionObject) {
        if (selectionObject.createRange) {
            return selectionObject.createRange();
        } else if (selectionObject.getRangeAt)
            return selectionObject.getRangeAt(0);
        else if (eWin.document.createRange) { // Safari!
            var range = eWin.document.createRange();
            range.setStart(selectionObject.anchorNode, selectionObject.anchorOffset);
            range.setEnd(selectionObject.focusNode, selectionObject.focusOffset);
            return range;
        }
    },
    getBookmark: function(doc) {
        var range = doc.selection.createRange();
        var textLength = doc.body.innerHTML.length;
        var result = {};
        if (range.getBookmark) {//选中图片/表格,无法调用getBookmark
            result.bookmark = range.getBookmark();
            result.startOffset = range.moveStart("character", -textLength);
            result.endOffset = range.moveEnd("character", textLength);
        }
        return result;
    },
    moveToBookmark: function(doc, bk) {
        if (!bk || !bk.bookmark) return;
        var range = doc.body.createTextRange();
        var textLength = doc.body.innerHTML.length;
        range.moveToBookmark(bk.bookmark);
        var copy = range.duplicate();
        var startOffset = copy.moveStart("character", -textLength);
        var endOffset = copy.moveEnd("character", textLength);
        if (startOffset != bk.startOffset || endOffset != bk.endOffset) {
            //top.Debug.write("产生偏移");
            range.moveStart("character", startOffset - bk.startOffset);
            range.moveEnd("character", endOffset - bk.endOffset);
        }
        range.select();
    }
};