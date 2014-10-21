/**
 * @fileOverview 定义HTML编辑器
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.Model.ModelBase;

    /**
     *@namespace
     *@name M2012.UI.HTMLEditor.Model
     *@inner
     */
    M139.namespace("M2012.UI.HTMLEditor.Model", {});


    M139.namespace("M2012.UI.HTMLEditor.Model.Editor", superClass.extend(
     /**
        *@lends M2012.UI.HTMLEditor.Model.Editor.prototype
        */
    {
        /** 编辑器基础类
        *@constructs M2012.UI.HTMLEditor.Model.Editor
        *@extends M139.Model.ModelBase
        *@param {Object} options 初始化参数集
        *@param {HTMLElement} options.frame 必选参数，编辑区域的iframe对象
        *@param {HTMLElement} options.textArea 存放存文本内容的文本框对象（如果不使用纯文本模式，可以不传该参数）
        *@example
        */
        initialize: function (options) {
            var This = this;
            if (typeof options.frame != "object") {
                throw "缺少参数options.frame";
            }

            /**
            *编辑器是否加载完成进入可用状态
            *@field
            *@type {Boolean}
            */
            this.isReady = false

            /**
            *编辑器是否为html模式
            *@field
            *@type {Boolean}
            */
            this.isHtml = true;

            /**
            *编辑器iframe对象
            *@field
            *@type {HTMLIframe}
            */
            this.frame = options.frame;
            /**
            *编辑器iframe的jQuery对象
            *@field
            *@type {jQuery}
            */
            this.jFrame = $(this.frame);

            /**
            *编辑区iframe的window对象
            *@field
            *@type {Window}
            */
            this.editorWindow = null;

            /**
             *编辑区iframe的document对象
             *@field
             *@type {HTMLDocument}
            */
            this.editorDocument = null;

            /**
             *编辑区iframe的document的jQuery对象
             *@field
             *@type {jQuery}
            */
            this.jEditorDocument = null;

            /**
             *存放纯文本的文本框set
             *@field
             *@type {HTMLElement}
            */
            this.textArea = options.textArea || this.frame.ownerDocument.createElement("textarea");

            /**
             *存放纯文本文本框的jQuery对象
             *@field
             *@type {HTMLElement}
            */
            this.jTextArea = $(this.textArea);

            M139.Iframe.domReady(this.frame, function () {
                This.onReady();
            });

            return superClass.prototype.initialize.apply(this, arguments);
        },
        defaults: {
            name: "M2012.UI.HTMLEditor.Model.Editor",
            printerMode:"off" //格式刷状态
        },
        /**@inner*/
        onReady: function () {
            this.isReady = true;


            this.editorWindow = this.frame.contentWindow;
            this.editorDocument = this.frame.contentWindow.document;
            this.jEditorDocument = $(this.editorDocument);
            this.editorDocument.body._obj = this ;
            this.initEvents();

            /**编辑器加载完成(主要是空白页需要网络加载)
                * @name M2012.UI.HTMLEditor.Model.Editor#ready
                * @event
                * @param {Object} e 事件参数
                * @example
                editor.on("ready",function(e){});
            */
            this.trigger("ready");

        },

        /**
         *光标选择文字区域发生变化
         *@inner
         */
        onBookMarkChange: function () {
            if(this.get("printerMode") != "off"){
                var selectedFormat = this.getSelectedStyle();
                var formatForPrint = this.get("formatForPrint");
                if(!this.utilDeepEquals(selectedFormat,formatForPrint)){
                    
                    this.printFormat(formatForPrint);//格式化选中的内容
                }
            }

            /**光标选择区域发生变化
            * @name M2012.UI.HTMLEditor.Model.Editor#bookmarkchange
            * @event
            * @param {Object} e 事件参数
            * @example
            editor.on("bookmarkchange",function(e){});
            */
            this.trigger("bookmarkchange",{
                selectedStyle: this.getSelectedStyle()
            });

        },

        /**
         *判断2个对象的属性是否相等
         *@inner
         */
        utilDeepEquals:function(o1,o2){
            for(var p in o1){
                if(o1[p] !== o2[p]){
                    return false;
                }
            }
            return true;
        },

        /**@inner*/
        initEvents: function () {
            var This = this;
            //屏蔽可编辑区的脚本异常
            this.editorWindow.eval("window.onerror=function(){return true}");

            this.jEditorDocument.keydown(function (e) {
                var returnValue = This.onEditorFrameKeyDown(e);
                formatPrintOff(e);
                return returnValue;
            }).keyup(function (e) {
                This.onEditorFrameKeyUp(e);
            }).mousedown(function(e){
                This.onEditorFrameMouseDown(e);
            }).mouseup(function(e){
                This.onEditorFrameMouseUp(e);
            }).click(function () {
                This.onFocus();
            });

            this.jEditorDocument.find('body').on('paste',function(e){
                This.onPaste(e);
            });

            try {
                var edWin = this.editorWindow;
                M139.Event.GlobalEvent.on("click", function (e) {
                    if (e.window != edWin) {
                        if (This.focused) {
                            This.onBlur();
                        }
                    }
                });
                //编辑区iframe触发全局的鼠标键盘事件
                new M139.Event.GlobalEventManager({ window: this.editorWindow });

            } catch (e) {
                
            }

            $(document).on("keydown",formatPrintOff);
            var esc = M139.Event.KEYCODE.Esc;
            function formatPrintOff(e) {
                if (e.keyCode == esc) {
                    //退出格式刷
                    This.setFormatPrintOff();
                }
            }
            
            this.initWatchSelectChange();

            //ie下实现支持撤销
            this.initHistory();
        },

        /**
         *当获得焦点触发事件
         */
        onFocus: function () {
            /**编辑器加载完成(主要是空白页需要网络加载)
                * @name M2012.UI.HTMLEditor.Model.Editor#focus
                * @event
                * @param {Object} e 事件参数
                * @example
                editor.on("focus",function(e){});
            */
            this.trigger("focus");
            this.focused = true;
        },
        /**
         *当失去焦点触发事件
         */
        onBlur: function () {
            /**编辑器加载完成(主要是空白页需要网络加载)
                * @name M2012.UI.HTMLEditor.Model.Editor#blur
                * @event
                * @param {Object} e 事件参数
                * @example
                editor.on("blur",function(e){});
            */
            this.trigger("blur");
            this.focused = false;
        },
        /**
         *右键粘贴
         */
        onPaste: function (e) {
            /**
                * @name M2012.UI.HTMLEditor.Model.Editor#paste
                * @event
                * @param {Object} e 事件参数
                * @example
                editor.on("paste",function(e){});
            */
            this.trigger("paste", e);
        },

        //实现监控选择区域变化
        //todo 实现方式要改，这个有时候会不触发
        /**@inner*/
        initWatchSelectChange:function(){
            var This = this;
            try{
                var selEl = this.getSelectedElement();
                var selCnt = this.getSelectedText();
                var selSelStyle = this.getSelectedStyle();
            }catch(e){}

            this.jEditorDocument.keydown(selChange).mouseup(selChange);
            this.on("afterexeccommand",selChange);
            function selChange(){
                var newSelEl = This.getSelectedElement();
                var newSelCnt = This.getSelectedText();
                var newSelStyle = This.getSelectedStyle();
                if(selEl !== newSelEl || selCnt !== newSelCnt || !This.utilDeepEquals(selSelStyle,newSelStyle)){
                    This.onBookMarkChange();
                }
                selEl = newSelEl;
                selCnt = newSelCnt;
                selSelStyle = newSelStyle;
            }
        },

        /**
         *在ie下实现手动的编辑记录（支持撤销和重做）
         *@inner
         */
        initHistory: function () {
            var This = this;
            //实现撤销功能
            var historyStack = [];
            var redoStack = [];
            var supportRedoMode = this.supportRedoMode = $B.is.ie;
            var history = this.history = {
                add: function () {
                    var len = historyStack.length;
                    var newHistory = {};
                    newHistory.html = This.editorDocument.body.innerHTML;
                    if (len === 0 || historyStack[len-1].html !== newHistory.html) {
                        if ($.browser.msie) {
                            newHistory.bookmark = This.getBookmarkData();
                        }
                        historyStack.push(newHistory);
                        if (historyStack.length > 11) {
                            historyStack.shift();
                        }
                        redoStack.length = 0;
                    }
                },
                undo: function () {
                    if (historyStack.length == 0) return;
                    history.add();
                    if (historyStack.length < 2) return;
                    redoStack.push(historyStack.pop());
                    var obj = historyStack[historyStack.length - 1];
                    this.goHistory(obj);
                },
                redo: function () {
                    if (redoStack.length == 0) return;
                    var obj = redoStack.pop();
                    this.goHistory(obj);
                    historyStack.push(obj);
                },
                goHistory: function (obj) {
                    //回退历史 ie
                    This.editorDocument.body.innerHTML = obj.html;
                    var range = This.editorDocument.body.createTextRange();
                    if ($B.is.ie) {
                        This.moveToBookmark(obj.bookmark);
                    }
                },
                //定时监控
                startWatch: function () {
                    This.historyTimer = setInterval(history.add, 3000);
                },
                init: function () {
                    if (this.hasInit) return;
                    this.hasInit = true;
                    //如果支持自定义的撤销
                    if (supportRedoMode) {
                        this.add();
                        this.startWatch();
                        This.on("beforeexeccommand", history.add);
                        This.on("afterexeccommand", history.add);
                    }
                }
            };


            //实现保存ie的bookmark
            if ($B.is.ie) {
                //fixed ie9ie10滚动的时候触发activate，恢复焦点造成的焦点老是跳的问题
                if ($B.is.ie && $B.getVersion() >= 9) {
                    this.jEditorDocument.on("mousedown", function () {
                        This.isMouseDown = true;
                    });
                    this.jEditorDocument.on("mouseup", function () {
                        This.isMouseDown = false;
                    });
                }
                this.jEditorDocument.on("beforedeactivate", function () {
                    //console.log("beforedeactivate");
                    This.saveBookMark();
                }).on('activate', function () {
                    //console.log("actived");
	//	$(this.editorDocument.body).on('focus', function () {
                    history.init();
                    if (This._keepBookmark) {
                        if ($B.is.ie && $B.getVersion() >= 9) {
                            if (This.isMouseDown) {
                                return;
                            }
                        }
                        //console.log("moved to bookmark");
                        This.moveToBookmark(This._keepBookmark);
                        This._keepBookmark = null;
                    }
                });
                setTimeout(function () {
                    history.init();
                }, 0);
            } else if($B.is.ie11) {
	            this.jEditorDocument.on("beforedeactivate", function () {
                    var selection = This.getSelection();
                    This.ie11BookMark = {
	                    node: selection.focusNode,
                        offset: selection.focusOffset
                    };
                });
            }
        },

        _keepBookmark: null,
        //保存光标选中的历史
        saveBookMark:function(){
            this._keepBookmark = this.getBookmarkData();
        },
        //根据历史记录设置光标
        moveToBookmark:function(bk){
            var doc = this.editorDocument;
            if (!bk || !bk.bookmark) return;
            var range = doc.body.createTextRange();
            var textLength = doc.body.innerHTML.length;
            range.moveToBookmark(bk.bookmark);
            var copy = range.duplicate();
            var startOffset = copy.moveStart("character", -textLength);
            var endOffset = copy.moveEnd("character", textLength);
            if (startOffset != bk.startOffset || endOffset != bk.endOffset) {
                range.moveStart("character", startOffset - bk.startOffset);
                range.moveEnd("character", endOffset - bk.endOffset);
            }
            try {
                range.select();
            } catch (e) { }
        },
        getBookmarkData:function () {
            var doc = this.editorDocument;
            var range;
            //return {};
            if(doc.selection) {
	            range = doc.selection.createRange();
            } else {
                //range = doc.createRange();	// 错，这个没有BookMark API
                //throw new Error("keep focus caret ERROR");
                range = doc.body.createTextRange();
            }
            var textLength = doc.body.innerHTML.length;
            var result = {};
            if (range.getBookmark) {//选中图片/表格,无法调用getBookmark
                result.bookmark = range.getBookmark();
                result.startOffset = range.moveStart("character", -textLength);
                result.endOffset = range.moveEnd("character", textLength);
            }
            return result;
        },

        /**@inner*/
        onEditorFrameKeyDown: function (e) {
            var code = e.charCode || e.keyCode;
            if (code == 9) {//tab键
                var strTab = "&nbsp;&nbsp;&nbsp;&nbsp;";
                var sel = this.getSelection();
                var range = this.getRangeObject(sel);
                if ($.browser.msie) {//ie  
                    try {
                        range.pasteHTML(strTab);
                    } catch (e) { }
                } else {
                    var fragment = range.createContextualFragment(strTab);
                    var lastChild = fragment.lastChild; //获得DocumentFragment的末尾位置  
                    range.insertNode(fragment);
                    range.setEndAfter(lastChild);//设置末尾位置  
                    range.collapse(false);//合并范围至末尾  
                    sel.removeAllRanges();//清除range  
                    sel.addRange(range);//设置range  
                }
                M139.Event.stopEvent(e);
            } else if (code == 13 && !e.ctrlKey && !e.shiftKey) {
                //回车换行
                if ($.browser.msie) {
                    var sel = this.getSelection();
                    var range = this.getRangeObject(sel);
                    try {
                        var o = range.parentElement();
                        while (o) {
                            if (o.tagName == "P" && o == this.editorDocument.body.firstChild && this.editorDocument.body.childNodes.length == 1) {
                                this.execCommand("formatblock", "<div>");
                                break;
                            }
                            if (!/^(?:td|body|span|font|i|em|b)$/i.test(o.tagName)) {
                                break;
                            } else if (o.tagName == "TD" || o.tagName == "BODY") {
                                this.execCommand("formatblock", "<div>");
                                break;
                            }
                            o = o.parentNode;
                        }
                    } catch (e) { }
                }

            } 
            //撤销
            if (e.ctrlKey && this.supportRedoMode) {
                if (code == 90) {
                    this.undo();
                    M139.Event.stopEvent(e);
                } else if (code == 89) {
                    this.redo();
                    M139.Event.stopEvent(e);
                }
            }
            
            /**抛出键盘事件
                * @name M2012.UI.HTMLEditor.Model.Editor#keydown
                * @event
                * @param {Object} e 事件参数
                * @example
                * todo: 坑。。。绑定事件还是处理事件，会引起误解
                editor.on("keydown",function(e){
                    console.log(e.keyCode);
                });
            */
            this.trigger("keydown", e);

            return e.returnValue;
        },
        onEditorFrameKeyUp:function(e){
            /**抛出键盘事件
                * @name M2012.UI.HTMLEditor.Model.Editor#keyup
                * @event
                * @param {Object} e 事件参数
                * @example
                editor.on("keyup",function(e){
                    console.log(e.keyCode);
                });
            */
            this.trigger("keyup", e);
        },
        onEditorFrameMouseDown:function(e){
            /**抛出鼠标下按事件
                * @name M2012.UI.HTMLEditor.Model.Editor#mousedown
                * @event
                * @param {Object} e 事件参数
                * @example
                editor.on("mousedown",function(e){
                    console.log(e.keyCode);
                });
            */
            this.trigger("mousedown", e);
        },
        onEditorFrameMouseUp:function(e){
            /**抛出鼠标松开事件
                * @name M2012.UI.HTMLEditor.Model.Editor#mouseup
                * @event
                * @param {Object} e 事件参数
                * @example
                editor.on("mouseup",function(e){
                    console.log(e.keyCode);
                });
            */
            this.trigger("mouseup", e);
        },

        /**不晓得干嘛用的，控件粘贴图片要做处理？*/
        replaceImage: function (fileName, uri) {
            this.editorWindow.focus();
            var imgs = this.editorDocument.getElementsByTagName("img");
            for (var i = 0; i < imgs.length; i++) {
                if (imgs[i].src.indexOf("file:") >= 0 && unescape(imgs[i].src).indexOf(unescape(fileName)) > 0) {
                    imgs[i].src = uri;
                }
            }
        },

        focus:function(){
            try {
                this.editorWindow.focus();
            } catch (e) { }
        },

        //获取页面上选中的文字
        getSelectedText:function () {
            var win = this.editorWindow;
            if (win.getSelection) {
                return win.getSelection().toString();
            }else if(win.document.getSelection){
                return win.document.getSelection();
            }else if (win.document.selection){
                return win.document.selection.createRange().text;
            }
            return "";
        },

        /**
         *光标处插入图片
         *@param {String} uri 要插入的图片地址
         */
        insertImage: function (url) {
            var sel, range;

            this.editorWindow.focus();
            sel = this.getSelection();
            range = this.getRangeObject(sel);

            if ($B.is.ie && $B.getVersion() < 9) {  //IE678下outerHTML，pasteHTML，innerHTML方法插入图片，图片的路径会是绝对路径
                var html = M139.Text.Utils.format("&nbsp;&nbsp;<img crs='{0}' src='{0}' />",[url]);

                if (sel.type.toLowerCase() == 'control') {
                    range.item(0).outerHTML = html;
                } else {
                    try {
                        range.pasteHTML(html);
                    } catch (e) {
                        this.editorDocument.body.innerHTML = html + this.editorDocument.body.innerHTML;
                    }
                }
                $(M139.Text.Utils.format("img[crs='{0}']",[url]), this.editorDocument).each(function () {
                    this.src = url;
                    $(this).removeAttr('crs');
                });
            } else {
	            this.insertHTML("&nbsp;&nbsp;");
                this.execCommand("InsertImage", url);
            }

			// IE下默认会选择图片，不清除选区，插入会变成替换
			if ($B.is.ie) {
				range = this.getRangeObject();
				range.collapse(false); //合并范围至末尾
                sel.removeAllRanges && sel.removeAllRanges(); //清除range
                sel.addRange && sel.addRange(range);
			}

            $(M139.Text.Utils.format("img[crs='{0}']",[url]), this.editorDocument).each(function () {
                $(this).load(function () {
                    if (this.width > 520 && this.src.indexOf("attachId=") > 0) {
                        var orgWidth = this.width;
                        var orgHeight = this.height;
                        this.setAttribute("orgWidth", orgWidth);
                        this.setAttribute("orgHeight", orgHeight);
                        this.width = 520;
                    }
                });
            });
            this.trigger("insertImage", { url: url });
            
            // add by tkh 显示图片小工具
            var jEditorBody = $(this.editorDocument).find('body');
			top.$App.showImgEditor(jEditorBody);
        },

        /**
        *在光标处插入表格
        *@param {Object} options 初始化参数集
        *@param {Number} options.rows 表格的行数
        *@param {Number} options.cells 表格的列数
        *@param {Number} options.width 表格的宽度
        *@param {Number} options.height 表格的高度
        *@example
        */
        insertTable: function (options) {
            var rows = options.rows;
            var cells = options.cells;
            var htmlCode = "<table border='1' cellPadding='0' cellSpacing='0'>";
            //todo 高度和宽度没有实现
            for (var i = 0; i < rows; i++) {
                htmlCode += "<tr>";
                for (var j = 0; j < cells; j++) {
                    htmlCode += "<td style='min-width:50px;width:50px;' border='1'><div>&nbsp;</div></td>";
                }
                htmlCode += "</tr>";
            }
            htmlCode += "</table>&nbsp;";
            this.insertHTML(htmlCode);
        },

		execInsertHTML: function(html){
			var ie11bookmark, range, selection;

			this.editorDocument.body.focus();

			if($B.is.ie) {
				selection = this.getSelection();
				range = this.getRangeObject(selection);
				range.pasteHTML(html);
				return;
			}

			// 恢复IE11的光标位置
			else if($B.is.ie11){
				ie11bookmark = this.ie11BookMark;
				selection = this.getSelection();
				range = this.getRangeObject(selection);

				if(ie11bookmark){
					//console.log(ie11bookmark);
					range.setEnd(ie11bookmark.node, ie11bookmark.offset);
					range.collapse(false);
					selection.removeAllRanges(); //清除range
					selection.addRange(range);
				}
			}
			
			this.execCommand("insertHTML", html);
		},

		// 从当前光标位置分割父节点，直接指定的父节点为止
        splitOff: function() {
	        var This = this;
            //this.editorWindow.focus();
            $(this.editorDocument.body).focus();
           // setTimeout(function(){
            var selection = This.getSelection();
            var range = This.getRangeObject(selection);
            var docFrag, emptyNode;
            var ie11bookmark = This.ie11BookMark;

            if(ie11bookmark) {
                emptyNode = ie11bookmark.node;
            } else {
                emptyNode = range.startContainer || range.parentElement();
            }

            if(emptyNode == This.editorDocument.body) {
                return;
            }

            while(emptyNode.parentNode && emptyNode.parentNode !== This.editorDocument.body) {
                emptyNode = emptyNode.parentNode;
            }

            if($B.is.ie && $B.getVersion() < 9){
	            // moveEnd会将光标置于起始端，应该使用moveStart
	            // 其实只需要向上找到父元素为body的节点
	            range.moveStart("character", -emptyNode.innerHTML.length-1);
	            //range.moveToElementText(emptyNode);
	            //range.moveStart("character", -1);
	            range.select();
            } else {
	            range.collapse(false);
	            if($B.is.ie11 && ie11bookmark){
		            range.setStartBefore(emptyNode || This.editorDocument.body.firstChild);
		            range.setEnd(ie11bookmark.node, ie11bookmark.offset);
	            } else {
	                range.setStartBefore(emptyNode || This.editorDocument.body.firstChild);
                }
    	        selection.removeAllRanges(); //清除range
        	    selection.addRange(range);
            	//console.log("'"+range.toString()+"'");

	            //setTimeout(function(){
		            emptyNode = This.editorDocument.createElement("div");
		            emptyNode.innerHTML = "<br>&nbsp;<br>";
	                docFrag = range.extractContents();
	                docFrag.appendChild(emptyNode);
	           // }, 500);
        	}
        //}, 2000);

           //setTimeout(function(){
	           
            if($B.is.ie && $B.getVersion() < 9){
	            //var copy = range.duplicate();	// 被copy的range内容依然是活引用
	            //var text = range.text;
	            //range.text = "";
	            This.cut();
	            range.collapse(true);
	            range.select();
	            
	            //range.pasteHTML(copy.text);
	            range.pasteHTML("<div><br>&nbsp;&nbsp;</div>");
	            
	            range.moveStart("character", -100);
	            range.collapse(true);
	            range.select();
	            This.paste();
	            
	            range.moveEnd("character", 2);
	            range.collapse(false);
	            range.select();
	            //range.pasteHTML("<div>|MARK|</div>");
	            //console.log(range.text);
            } else {
                range.insertNode(docFrag);
                //range.insertNode(emptyNode);
                //$(this.editorDocument.body).prepend(docFrag);
                //this.execCommand("formatblock", "<div>");
                range.setEnd(emptyNode, 0);
                //range.setEndAfter(emptyNode); //设置末尾位置
                range.collapse(false);
                selection.removeAllRanges(); //清除range
                selection.addRange(range);
            }
            //}, 1000);
            //$(this.editorDocument.body).focus();
        },

        /**销毁对象，释放资源*/
        dispose: function () {
            //top.Debug.write("Editor Dispose");
            clearInterval(this.updateStateTimer);
            clearInterval(this.historyTimer);
        },

        /**得到选中区域对象*/
        getSelection: function () {
            var win = this.editorWindow;
            var userSelection;
            if (win.getSelection) {
                userSelection = win.getSelection();
            }
            else if (win.document.selection) {//Opera
                userSelection = win.document.selection;
            }
            return userSelection;
        },
        /**得到选中的范围对象*/
        getRangeObject: function (selection) {
            var selectionObject = selection || this.getSelection();
            if (selectionObject.createRange) {	// IE8 (xiaoyu)
                return selectionObject.createRange();
            } else if (selectionObject.getRangeAt && selectionObject.type == "Range") {
                return selectionObject.getRangeAt(0);
            } else if (this.editorDocument.createRange) {
                var range = this.editorDocument.createRange();
                try{
	                range.setStart(selectionObject.anchorNode||this.editorDocument.body, selectionObject.anchorOffset||0);
                	range.setEnd(selectionObject.focusNode||this.editorDocument.body, selectionObject.focusOffset||0);
                } catch(e){
	                console.log(selectionObject.anchorNode, selectionObject.focusNode);
                }
                return range;
            }
        },

        /*
         *特殊的元素类
        */
        StyleObjectElements: { img: 1, hr: 1, li: 1, table: 1, tr: 1, td: 1, embed: 1, object: 1, ol: 1, ul: 1 },

        /**
         *获得选中元素的类型
         *@inner
         *@returns {String} text|control|none
         */
        utilGetSelectedElementType: function (sel) {
            var type = "";
            if ($B.is.ie) {
                var ieType = this.editorDocument.selection.type;
                if (ieType == 'Text')
                    type = "text";
                if (ieType == 'Control')
                    type = "element";
                if (ieType == 'None')
                    type = "none";
            } else {
                type = "text";
                if (sel.rangeCount == 1) {
                    var range = sel.getRangeAt(0),
					    startContainer = range.startContainer;
                    if (startContainer == range.endContainer
					    && startContainer.nodeType == 1
					    && (range.endOffset - range.startOffset) == 1
					    && this.StyleObjectElements[startContainer.childNodes[range.startOffset].nodeName.toLowerCase()]) {
                        type = "element";
                    }
                }
            }
            return type;
        },
        /**
		 * [selectElementText 选中元素范围]
		 * @param {[type]} el [description]
		 */
		selectElementText: function ( el ){
			var doc = this.editorDocument;
			var selection = this.getSelection();	
			if(doc.getSelection){
				// range.selectNodeContent(el); // ?
				selection.selectAllChildren( el );
			}
			else if(doc.body.createTextRange){
				selection = doc.body.createTextRange();
				selection.moveToElementText( el );
				selection.select();
			}
			el.focus();
		},
        /**
         *获得选中的元素（不精确）
         */
        getSelectedElement: function () {
            var sel = this.getSelection();
            if (!sel) return null;
            var range = this.getRangeObject(sel);
            if (!range) return null;
            var node;
            //要理解getType(),getSelectedElement(),getRanges()
            var selectType = this.utilGetSelectedElementType(sel);
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
                        if ($B.is.ie) {
                            if ($B.getVersion() >= 9) {
                                node = sel.anchorNode || range.startContainer;
                                if (node && node.nodeType != 1) node = node.parentNode;
                            } else {
                                if (range.text.length > 0) range.collapse(true);
                                node = range.parentElement();
                            }
                        }
                        else {
                            node = sel.anchorNode;
                            if (node && node.nodeType != 1) node = node.parentNode;
                        }
                        break;
                    }
                default:
                    {
                        if ($B.is.ie) {
                            if ($B.getVersion() >= 9) {
                                node = range.startContainer;
                                if (node && !node.tagName && node.parentNode) node = node.parentNode;
                            } else {
                                node = range.parentElement();
                            }
                        }
                        else {
                            node = sel.anchorNode;
                            if (node && node.nodeType != 1) node = node.parentNode;
                        }
                        break;
                    }
            }
            if (node && (node.ownerDocument != this.editorDocument)) {
                node = null;
            }

            //ie8，9 选择范围有bug（要忽略前面的空白)
            if (node && $B.is.ie && $B.getVersion() > 7) {
                var count = 0;
                var elCount = 0;
                for (var i = 0; i < node.childNodes.length; i++) {
                    var child = node.childNodes[i];
                    if (child.nodeType == 3 || child.tagName == "BR") {
                        count++;
                    } else {
                        elCount++;
                    }
                }
                if (count && elCount === 1 && node.lastChild.nodeType == 1) {
                    node = node.lastChild;
                }
            }

            return node;
        },

        /**
         *判断元素是否块元素
         */
        utilIsBlockElement:function(tagName){
            if (typeof tagName != "string") {
                tagName = tagName && tagName.tagName;
            }
            return /^(?:body|div|p|table|td|tr|ul|li|fieldset|legend)$/i.test(tagName);
        },

        /**
         *设置行距 todo 不大管用
         */
        setRowSpace: function (rowSpace) {
            this.editorWindow.focus();
            var This = this;
            rowSpace = rowSpace * 100 + "%";
            var selectedE = this.getSelection();
            var range = this.getRangeObject(selectedE);
            var startPE;
            var endPE;
            var rng;
            var allNodes = [];
            if ($B.is.ie && $B.getVersion() < 9) {
                rng = range.duplicate();
                range.collapse(false);
                startPE = range.parentElement();
                rng.collapse(false);
                endPE = rng.parentElement();
            } else {
                range = selectedE.getRangeAt(0);
                startPE = range.startContainer.parentNode;
                endPE = range.endContainer.parentNode;
            }
            if (!startPE || startPE.ownerDocument != this.editorDocument) {
                return;
            }
            try {
                var startDom = findBlockParent(startPE);
                makeStyle(startDom);
            } catch (e) { }
            try {
                var endDom = findBlockParent(endPE);
                if (startDom && endDom && startDom != endDom) {
                    //如果开始节点与结束节点不同，则遍历获取它们之间的节点
                    var allNodes = getMiddleNodes(startDom, endDom);
                    if (allNodes.length > 0) {
                        _.each(allNodes, function (item) {
                            makeStyle(item);
                        });
                    }
                    makeStyle(endDom);
                }
            } catch (e) { }
            function makeStyle(dom) {
                if (dom) {
                    $("*", dom).add(dom).css("line-height", rowSpace);
                }
            }
            function findBlockParent(el) {
                while (el) {
                    if (This.utilIsBlockElement(el)) {
                        return el;
                    }
                    el = el.parentNode;
                }
                return null;
            }
            //获得2个节点之间的节点
            function getMiddleNodes(startNode, endNode) {
                var all = [];
                var node = startDom.nextSibling;
                while (node) {
                    if (node == endNode || M139.Dom.containElement(node, endNode)) {
                        break;
                    } else {
                        all.push(node);
                        if (!node.nextSibling) {
                            node = node.parentNode;
                        } else {
                            node = node.nextSibling;
                        }
                    }
                }
                return all;
            }
        },

        /**
         *插入超链接
         */
        setLink: function (url) {
            this.editorWindow.focus();
            this.execCommand("CreateLink", url);
        },
        /**
        *插入签名
        */
        setSign: function (text) {
            var today = new Date();
            text = text.replace("$时间$", today.format("yyyy年MM月dd日 星期") + ["天", "一", "二", "三", "四", "五", "六"][today.getDay()]);
            if (this.isHtml) {
                var doc = this.editorDocument;
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
                    var fonts = top.$User.getDefaultFont();
                    var style = {
                       fontFamily : fonts.family,
                       fontSize : this.getPxSize(fonts.size),
                       color : fonts.color,
                       lineHeight : fonts.lineHeight
                    };
                    $(newLineDiv).css(style);
                    newLineDiv.innerHTML = '<br><br><br>';
                    contentObj.appendChild(newLineDiv);						
                    contentObj.appendChild(signContainer);
                }
                signContainer.innerHTML = text;// + "<div>&nbsp;</div>";
                signContainer.signLength = signContainer.innerHTML.length;
            } else {
                this.textArea.value += "\r\n" + text;
            }
        },

        /**
        *todo 插入祝福语
        */
        setBlessings: function (text) {
            if (this.isHtml) {
                var doc = this.editorDocument;
                text = text.replace(/^\s*<p>|<\/p>\s*$/i, "");
                if (!/<\/\w+>/.test(text)) {
                    text = text.replace(/\r?\n/g, "<br>");
                }
                var blessingsContainer = doc.getElementById("blessingsContainer");
                if (!blessingsContainer || (blessingsContainer.signLength && blessingsContainer.signLength != blessingsContainer.innerHTML.length)) {
                    if (blessingsContainer) blessingsContainer.id = null;
                    blessingsContainer = doc.createElement("div");
                    blessingsContainer.id = "blessingsContainer";
                    var contentObj = doc.getElementById("content139") || doc.body;
                    var newLineDiv = doc.createElement("div");
                    newLineDiv.innerHTML = "<br>";
                    var signContainer = doc.getElementById("signContainer");
                    if (signContainer) {
                        contentObj.insertBefore(blessingsContainer, signContainer);
                        contentObj.insertBefore(newLineDiv, signContainer);
                    } else {
                        contentObj.appendChild(newLineDiv);
                        contentObj.appendChild(blessingsContainer);
                    }
                }
                blessingsContainer.innerHTML += "<div>" + text + "</div>";
                blessingsContainer.signLength = blessingsContainer.innerHTML.length;
            } else {
                this.contentPlainText.value += "\r\n" + text;
            }
        },

        /**添加引用内容（写信编辑器）*/
        addReplyContent: function (content) {
            // 在编辑器中文中添加6个空行 add by chenzhuo
			var sessionCon = top.$App.getSessionDataContent();
            var html = this.getHtmlContent() + sessionCon + "<div><br><br><br></div><div id='signContainer'></div><hr id='replySplit'/><div id='reply139content'>" + content + "</div>";
            this.setHtmlContent(html);
        },

        /**获得编辑器的html内容*/
        getHtmlContent: function () {
            var html = this.editorDocument.body.innerHTML;
            if ($B.is.webkit) {
                if (html.indexOf("<!--[if") > -1) {
                    //替换从office粘贴文本出现注释的bug
                    html = html.replace(/<!--\[if !\w+\]-->([\s\S]*?)<!--\[endif\]-->/g, "$1");
                }
            }
            return html;
        },

        /**设置html内容*/
        setHtmlContent: function (htmlCode) {
            var This = this;
            if (this.isReady) {
                setContent();
            } else {
                this.on("ready", setContent);
            }
            function setContent() {
                This.editorDocument.body.innerHTML = htmlCode;
                This.trigger("setcontent");
            }
        },

        //todo 使用公共代码实现
        /**
         *将html文本转化成普通文本
         */
        getHtmlToTextContent: function () {
            var body = this.editorDocument.body;
            var content = "";
            if (document.all) {
                content = body.innerText;
            } else {
                var tmp = body.innerHTML;
                tmp = tmp.replace(/<br\s?\/?>/ig, "\n");
                var div = document.createElement("div");
                div.innerHTML = tmp;
                content = div.textContent;
            }
            return content;
        },

        //todo 使用公共代码实现
        /**
         *纯文本模式切换到编辑器模式，内容转换
         */
        getTextToHtmlContent: function () {
            var content = this.textArea.value;
            var div = document.createElement("div");
            if (document.all) {
                content = content.replace(/\r?\n/g, "<br>");
                content = content.replace(/ /g, "&nbsp;");
                div.innerHTML = content;
                return div.innerHTML;
            } else {
                div.appendChild(document.createTextNode(content));
                return div.innerHTML.replace(/\r?\n/g, "<br>");
            }
        },

        /**获得纯文本内容*/
        getTextContent: function () {
            return this.textArea.value;
        },

        //todo 封装成调用时不需要判断编辑器状态
        /**纯文本模式下设置内容*/
        setTextContent: function (text) {
            this.textArea.value = text;
        },

        /**
         *切换编辑器模式 html or 纯文本
        */
        switchEditor: function () {
            if (this.isHtml) {
                this.setTextContent(this.getHtmlToTextContent());
                this.jTextArea.show();
                this.jFrame.hide();
                this.isHtml = false;
            } else {
                this.setHtmlContent(this.getTextToHtmlContent());
                this.jFrame.show();
                this.jTextArea.hide();
                this.isHtml = true;
            }
        },

        /**设置、取消格式刷*/
        setFormatPrinter:function(){
            if(this.get("printerMode") == "off"){
                this.setFormatPrinterOn();
            }else{
                this.setFormatPrintOff();
            }
        },

        /**选中格式刷*/
        setFormatPrinterOn:function(keep){
            //保存当前格式
            this.set("formatForPrint",this.getSelectedStyle());

            this.set("printerMode", keep ? "keepOn" : "on");

            this._keepBookmark = null;//防止ie下movetobk的时候滚动
        },

        /**退出格式刷*/
        setFormatPrintOff:function(){
            this.set("printerMode","off");
        },

        /**
        * 格式化选中内容
        * execCommand具有切换的效果，因此在选区不同区域格式混杂的时候会有问题。
        * （比如用第一行的格式刷全文就会有问题）(xiaoyu)
        * 完善格式刷，先需对选区进行有选择的清除，再整体添加之前被清掉的格式。
        */
        printFormat: function (formatStyle) {
            if (this.formatLocked) return;

            var This = this;
            //如果是一次性刷子，退出格式刷状态
            var pMode = this.get("printerMode");
            if (pMode == "on") {//多次刷子是 = keepOn
                this.setFormatPrintOff();
            } else if (pMode == "off") {
                return;
            }


            //防止短期内多次触发而崩溃
            this.formatLocked = true;
            setTimeout(function () {
                This.formatLocked = false;
            }, 500);

			// 清除局部杂乱样式
			this.execCommand("removeFormat");

            var oldStyle = this.getSelectedStyle();

            if(oldStyle.isBold !== formatStyle.isBold){
                this.execCommand("bold",null,true);
            }

            if(oldStyle.isUnderLine !== formatStyle.isUnderLine){
                this.execCommand("underline",null,true);
            }

            if(oldStyle.isItalic !== formatStyle.isItalic){
                this.execCommand("italic",null,true);
            }

            if(oldStyle.isOrderedList !== formatStyle.isOrderedList){
                this.execCommand("insertorderedlist",null,true);
            }
            if(oldStyle.isUnorderedList !== formatStyle.isUnorderedList){
                this.execCommand("insertunorderedlist",null,true);
            }

            if(oldStyle.textAlign !== formatStyle.textAlign){
                this.execCommand("Justify" + formatStyle.textAlign,null,true);
            }
            
            if(oldStyle.color !== formatStyle.color){
                this.execCommand("ForeColor",formatStyle.color,true);
            }

            if(oldStyle.backgroundColor !== formatStyle.backgroundColor){
                this.setBackgroundColor(formatStyle.backgroundColor,true);
            }

            if(oldStyle.fontFamily !== formatStyle.fontFamily){
                this.execCommand("fontname",formatStyle.fontFamily,true);
            }


            //这个放最后，会触发afterexeccommand事件，更新ui状态
            if(oldStyle.fontSize !== formatStyle.fontSize){
                this.setFontSize(formatStyle.fontSize);
            }


        },

        /**
         *光标处插入html
         *@param {String} htmlCode 要插入的html
         */
        insertHTML: function (htmlCode) {
            this.editorWindow.focus();
            var sel = this.getSelection();
            var range = this.getRangeObject(sel);
            if (!$B.is.ie) {
                range.deleteContents();
                var fragment = range.createContextualFragment(htmlCode);
                var lastNode = fragment.lastChild;
                range.insertNode(fragment);
                range.setEndAfter(lastNode); //设置末尾位置  
                range.collapse(false); //合并范围至末尾  
                sel.removeAllRanges(); //清除range
                sel.addRange(range);
            } else if ($B.getVersion() >= 9) {
                //ie9
                range.deleteContents();
                var _div = this.editorWindow.document.createElement("div");
                _div.innerHTML = htmlCode;
                //var lastNode = _div.firstChild; //只插入了部分html
                var lastNode = _div;
                range.insertNode(_div);
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
                        this.editorDocument.body.innerHTML = htmlCode + this.editorDocument.body.innerHTML;
                    }
                }
            }
        },

        /**@inner 查询格式状态*/
        queryCommandState: function (command) {
            var state = false;
            try {
                state = this.editorDocument.queryCommandState(command);
            } catch (e) { }
            return state;
        },
        FontSizeList: {
            "6": "一号",
            "5": "二号",
            "4": "三号",
            "3": "四号",
            "2": "五号",
            "1": "六号",
            "32px": "一号",
            "24px": "二号",
            "18px": "三号",
            "16px": "四号",
            "13px": "五号",
            "10px": "六号",
            "12px": "六号"//chrome
        },
        /**获得光标当前所在位置的样式值：字体、颜色、对齐方式等*/
        getSelectedStyle: function () {
            var This = this;
            var element = this.getSelectedElement();
            if (!element || element.ownerDocument != this.editorDocument) {
                //有时候浏览器会返回编辑器以外的选中元素
                return null;
            } else {
	            var Dom = M139.Dom;
                var textAlign = Dom.getCurrentCSS(element, "text-align");
                var fontSize = Dom.getCurrentCSS(element, "font-size");
                var fontFamily = Dom.getCurrentCSS(element, "font-family");
                var color = Dom.getCurrentCSS(element, "color");
                var backgroundColor = Dom.getCurrentCSS(element, "background-color");
                var lineHeight = Dom.getCurrentCSS(element, "line-height");
                var result = {
                    isBold: this.queryCommandState("bold"),
                    isUnderLine: this.queryCommandState("underline"),
                    isItalic: this.queryCommandState("italic"),
                    isOrderedList: this.queryCommandState("insertorderedlist"),
                    isUnorderedList: this.queryCommandState("insertunorderedlist"),
                    isAlignLeft: textAlign == "left",
                    isAlignCenter: textAlign == "center",
                    isAlignRight: textAlign == "right",
                    textAlign:textAlign,
                    fontFamily: fontFamily,
                    fontSize: fontSize,
                    color:color,
                    backgroundColor:backgroundColor,
                    fontSizeText: getFontSizeText(fontSize),
                    lineHeight: parseInt(lineHeight)/parseInt(fontSize)
                };
                return result;
            }
            function getFontSizeText(fontSize) {
                return This.FontSizeList[fontSize] || fontSize;
            }
        },

        /**
         *根据字体名获得字号
         *@inner
         */
        utilGetFontSizeLevel: function (fontSizeName) {
            if (/^\d+$/.test(fontSizeName)) {
                return parseInt(fontSizeName);
            } else {
                var list = ["","xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large"];
                return jQuery.inArray(fontSizeName, list) || 4;
            }
        },

        /**加大字号*/
        setFontSizeUp: function () {
            this.editorWindow.focus();
            var element = this.getSelectedElement();
            var fontSize = M139.Dom.getCurrentCSS(element, "font-size");
            if (fontSize.indexOf("px") > -1) {
                var newSize = parseInt(fontSize) + 4 + "px";
                this.setFontSize(newSize);//这个只支持字号 不支持像素
                element = this.getSelectedElement();
                element.style.fontSize = newSize;
            } else {
                var fontSize = this.utilGetFontSizeLevel(fontSize);
                this.setFontSize(fontSize + 1);//最大是1号字
            }
        },

        /**减少字号*/
        setFontSizeDown: function () {
            this.editorWindow.focus();
            var element = this.getSelectedElement();
            var fontSize = M139.Dom.getCurrentCSS(element, "font-size");
            if(fontSize == 'medium'){fontSize = '16px';} //修复html编辑器对字体缩小在特定条件下失效的问题,暂用该方法
            if (fontSize.indexOf("px") > -1) {
                var newSize = Math.max(9, parseInt(fontSize) - 4) + "px";//不能小于9像素
                this.setFontSize(newSize);//这个只支持字号 不支持像素
                element = this.getSelectedElement();
                element.style.fontSize = newSize;
            } else {
                var fontSize = this.utilGetFontSizeLevel(fontSize);
                this.setFontSize(Math.max(1, fontSize - 1));
            }
        },

        /**
         *剪切选中内容
         */
        cut: function () { this.execCommand("Cut") },
        /**
         *复制选中内容
         */
        copy: function () { this.execCommand("Copy") },
        /**
         *在光标处粘贴内容
         */
        paste: function () { this.execCommand("Paste") },
        /**
         *设置文字效果粗体
         */
        setBold: function () { this.execCommand("Bold") },
        /**
         *设置文字效果下划线
         */
        setUnderline: function () { this.execCommand("Underline") },
        /**
         *设置文字效果斜体字
         */
        setItalic: function () { this.execCommand("Italic") },
        /**
         *设置字体
         */
        setFontFamily: function (fontName) {
            if ($B.is.ie && $B.getVersion() < 9) {
                //this.jEditorDocument.find("font").attr("oldel", 1);
                var fontTags = this.editorDocument.getElementsByTagName("font");
                if (fontTags.length > 200) {
                    var moreBreak = true;
                }
                if (!moreBreak) { 
                    for (var i = 0, len = fontTags.length; i < len; i++) {
                        fontTags[i].setAttribute("oldel", "1");
                    }
                }
            }
            this.execCommand("fontname", fontName);
            if ($B.is.ie && $B.getVersion() < 9) {
                //解决从word复制内容到html编辑器里，有时字体无法修改的问题
                /*
                this.jEditorDocument.find("font:not([oldel])").find("span").each(function () {
                    if (this.style.fontFamily) {
                        this.style.fontFamily = "";
                    }
                });
                */
                if (!moreBreak) {
                    //jquery性能太差 重新优化
                    var fontTags = this.editorDocument.getElementsByTagName("font");
                    for (var i = 0, len = fontTags.length; i < len; i++) {
                        var font = fontTags[i];
                        if (!font.getAttribute("oldel")) {
                            var spanList = font.getElementsByTagName("span");
                            for (var j = 0, jLen = spanList.length; j < jLen; j++) {
                                var span = spanList[j];
                                if (span.style.fontFamily) {
                                    span.style.fontFamily = "";
                                }
                            }
                        }
                    }
                }
            }
        },
        // 标示已存在的font
        markFont: function(){
            this.jEditorDocument.find("font").attr("oldel", 1);
        },
        // 从word中复制到ie中的文本会有font标签，影响了文本字体大小，要去掉此属性 add by chenzhuo
        resetTextSizeForIe: function(){
            if (!$B.is.ie) {
                return;
            }

            var editorDocument = this.editorDocument;
            var fontElem = editorDocument.getElementsByTagName("font");
            var fontElemLen = fontElem.length;

            if (fontElemLen > 0) {
                for (var i = 0; i < fontElemLen; i++) {
                    var item = fontElem[i];
                    if (item.getAttribute("oldel") === null) { //新粘贴的文本
                        item.removeAttribute("size");
                    }
                }
            }
        },
        /**
         *设置字号
         */
        setFontSize: function (fontSize) {
            this.editorWindow.focus();
            if ($B.is.ie) {
                this.jEditorDocument.find("font").attr("oldel", 1);
            }
            var element = this.getSelectedElement();
            if (fontSize.toString().indexOf("px") > -1) {
	            //this.execCommand("FontSize", fontSize, true);
	            // size 1-7 分别对应 12 13 16 18 24 32 48
	            //var map = [12 13 16 18 24 32 48];
	           // var size = parseInt(fontSize, 10);
	           // for(var i=0,len=map.length;)
                this.execCommand("FontSize", 4, true);//这个只支持字号 不支持像素,所以要折腾2次
                element.style.fontSize = fontSize;
                this.trigger("afterexeccommand",{
                    command:"FontSize",
                    param:fontSize
                });
            }else{
                this.execCommand("FontSize", fontSize);
                if (element.style.fontSize) {
                    element.style.fontSize = "";
                }
            }

            if ($B.is.ie) {
                
                //解决从word复制内容到html编辑器里，有时字体大小无法修改的问题
                this.jEditorDocument.find("font:not([oldel])").find("span").each(function () {
                    if (this.style.fontSize) {
                        this.style.fontSize = "";
                    }
                });
            }

        },
        /**
         *设置默认字体 add by tkh  modif by yly
         * @param {Object} fonts {size : '2',family : '宋体',color : '#000000',lineHeight:'1.5'}
         */
        setDefaultFont : function (fonts){
            var self = this;
            var style = {
               fontFamily : fonts.family,
               fontSize : self.getPxSize(fonts.size),
               color : fonts.color,
               lineHeight : fonts.lineHeight
            };
            
            var indexObj = getIndexObj();
            var eleList = self.jEditorDocument.find('body').find("div:lt("+indexObj.index+")");
            if(eleList && eleList.length > 0){
                for(var i = 0;i < eleList.length;i++){
                    var ele = eleList[i];
                    $(ele).css(style);
                }
            }else{
                var jNewDivEle = $(self.editorDocument.createElement('div'));
                if(!$B.is.ie) {
                    jNewDivEle.append('<br>');
                }
                if(indexObj.jEle){
                    indexObj.jEle.before(jNewDivEle);
                }else{
                    self.jEditorDocument.find('body').append(jNewDivEle);
                }
                jNewDivEle.css(style);
            }
            
			function getIndexObj(){
				var children = self.jEditorDocument.find('body').children();
				var jSignContainer = self.jEditorDocument.find("#signContainer");
				if(jSignContainer.size() > 0){
					return {
						index : jSignContainer.index(),
						jEle : jSignContainer
					};
				}
				var jReplySplit = self.jEditorDocument.find("#replySplit");
				if(jReplySplit.size() > 0){
					return {
						index : jReplySplit.index(),
						jEle : jReplySplit
					};
				}
				return {
					index : children.size()
				};
			}
            
    	},
    	getPxSize : function(fontSizeText){
			if (/\d+$/.test(fontSizeText)) {
				if($B.is.chrome && fontSizeText == 1){
                	return "12px";
                }
                fontSizeText = ({
                    6: "32px",
                    5: "24px",
                    4: "18px",
                    3: "16px",
                    2: "13px",
                    1: "10px"
                })[fontSizeText] || fontSizeText;
            }
            return fontSizeText;
		},
        /**
         *设置字体颜色
         */
        setForeColor: function (color) {
            this.editorWindow.focus();
            //if (M139.Browser.is.firefox && color.indexOf("rgb") > -1) {
            if (color.indexOf("rgb") > -1) {
                //兼容处理
                color = this.changeRGBColor(color);
            }

            if ($B.is.ie) {
                this.jEditorDocument.find("font").attr("oldel", 1);
            }
            this.execCommand("ForeColor", color);
            if ($B.is.ie) {
                //解决从word复制内容到html编辑器里，有时字体颜色无法修改的问题
                /*
                    用了很猥琐的做法   
                    从word复制的内容 字体标签是 <span lang="EN-US" style="color:red" >
                    html编辑器自己加的字体标签是 <font color="blue">
                    那么我就把应用字体颜色后的新增的font标签下的span标签的color干掉  就可以防止无法修改全部选中范围的字体颜色了
                */
                this.jEditorDocument.find("font:not([oldel])").find("span").each(function () {
                    if (this.style.color) {
                        this.style.color = "";
                    }
                });
            }
        },

        /**
         *rgb(1,1,1)格式转#010101格式
         */
        changeRGBColor:function(rgb){
            var m = rgb.replace(/\s/g,"").match(/rgb\((\d+),(\d+),(\d+)\)/i);
            if (m) {
                var r = (m[1] * 1).toString(16).replace(/^(.)$/, "0$1");
                var g = (m[2] * 1).toString(16).replace(/^(.)$/, "0$1");
                var b = (m[3] * 1).toString(16).replace(/^(.)$/, "0$1");
                return "#" + r + g + b;
            }
            return "";
        },

		preview: function() {
			var source = this.editorDocument.body.innerHTML;
			var html = '<iframe id="frm_preview" name="frm_preview" width="100%" height="100%" marginwidth="24" marginheight="24" frameborder="0" src="/m2012/html/preview_blank.htm"></iframe>';
			var height = $(window).height() - 100;

			top.$Msg.showHTML(html, {
				dialogTitle:'预览',
				buttons:['关闭'],
				width: "90%",
				height: height + "px"
			});

			//alert(top === parent);	// true
			document.domain = window.location.host.match(/[^.]+\.[^.]+$/)[0];
			var preview_frm = parent.document.getElementById('frm_preview');

			$(preview_frm).on("load", function(){
				preview_frm.contentWindow.document.body.innerHTML = source;
			});
			//document.domain = window.location.host.match(/[^.]+\.[^.]+$/)[0];
			//var win = window.open("about:blank", "_blank");
			//var win = window.open("/m2012/html/preview_blank.htm", "_blank");
			//console.log(win.document.body);
			//win.document.body.innerHTML = s;//source;
		},
		/**
		* 内容全选
		*/
		selectAll: function() { this.execCommand("selectAll"); },
		/**
		* 添加删除线
		*/
		strikeThrough: function() { this.execCommand("strikeThrough"); },
        /**
         *设置内容左对齐
         */
        setAlignLeft: function () { this.execCommand("JustifyLeft") },
        /**
         *设置内容居中对齐
         */
        setAlignCenter: function () { this.execCommand("JustifyCenter") },
        /**
         *设置内容右对齐
         */
        setAlignRight: function () { this.execCommand("JustifyRight") },
        /**
         *增加缩进
         */
        setIndent: function () { this.execCommand("Indent") },
        /**
         *减少缩进
         */
        setOutdent: function () { this.execCommand("Outdent") },
        /**
         *设置数字列表（ol）
         */
        insertOrderedList: function () { this.execCommand("Insertorderedlist") },
        /**
         *设置符号列表（ul）
         */
        insertUnorderedList: function () { this.execCommand("Insertunorderedlist") },

		/**
		* 上传后需要添加到附件列表，因此直接模拟上传附件行为
		*/
        _uploadFile: function(type, filterType) {
	        var isFlashUpload = supportUploadType.isSupportFlashUpload && document.getElementById("flashplayer");

	        if(isFlashUpload){
		        return ;
		    }
		    uploadManager.filterType = filterType;
	        uploadManager.callback = function(){
		        var list = this.fileList;
		        var item;
		        var fileSizeText;
		        var filterType;

		        for(var i=0, len=list.length; i < len; i++) {
			        item = list[i];
			        filterType = item.filterType;
			        if(filterType) {
				        if(filterType.test(item.fileName)) {
					        fileSizeText = item.fileType == "largeAttach" ? item.fileSize : $T.Utils.getFileSizeText(item.fileSize, { maxUnit: "K", comma: true });
				            upload_module.insertRichMediaFile(item.fileName, fileSizeText);
			            }
				        delete item.filterType; // 防止第二次上传后重复添加到正文
			        }
		        }
	        }
	        var fileInput = document.getElementById("uploadInput");
	        var acceptMimeTypes = {
		        "audio": "audio/mpeg",
		        "video": "video/mp4, flv-application/octet-stream",
		        "doc": "text/plain, application/vnd.ms-powerpoint, application/vnd.ms-excel, application/msword, application/pdf",
		        "image": "image/gif, image/jpeg, image/bmp, image/png"
	        };

	        $(fileInput).attr("accept", acceptMimeTypes[type]);

	        if(fileInput) {
		        $(fileInput).trigger("click", "fakeClick");
	        }
        },

        uploadInsertDocument: function() {
            this._uploadFile("doc", /\.(?:docx?|pptx?|xlsx?|pdf|txt)$/i);
        },

        uploadInsertAudio: function() {
            this._uploadFile("audio", /\.(?:mp3|m4a|wav)$/i);
        },

        uploadInsertVideo: function() {
            this._uploadFile("video", /\.(?:mp4|flv|f4v|m4v)$/i);
        },

        /**
         *清除文字格式
         */
        removeFormat: function () {
	        //this.execCommand("removeFormat");
			var doc = this.editorDocument;
			this.sourceBackup = doc.body.innerHTML;	// 支持一次撤销
			var contentNode = doc.getElementById("content139") || doc.body;
			var signContainer = doc.getElementById("signContainer");
			//var replyContainer = doc.getElementById("reply139content");

			if(signContainer){
				signContainer.parentNode.removeChild(signContainer);
			}
			//if(replyContainer){
			//	replyContainer.parentNode.removeChild(replyContainer);
			//}
			// note: 先removeChild，再获取innerHTML
			var source = contentNode.innerHTML;
			// ctrl+Z撤销（清除格式后需要这个恢复之前的备份内容）
			this.restoreSource = function (e) {
				if(e.ctrlKey){
					if(e.keyCode === 90 && this.hasOwnProperty("sourceBackup")){
						this.undo();
					}
				}
				return false;
			};
			this.on("keydown", this.restoreSource);
			source = source.replace(/(style)\s*=\s*(["']?)(?:[^\\>]|\\\2)*?\2/ig, "");
			//source = source.replace(/<[\w:-]+\s*style/ig, "");
			source = source.replace(/<\/?(?:h\d|li|dl|dd|dt|ol|ul|font|sub|sup|i|u|em|del|b|strike|strong)(\s+[^>]*)?>/ig, "");
			// remove comment (conditional tags)
			source = source.replace(/<!--\[if.*?-->.*?<!--\[endif\]-->/ig, "");
			// finally, remove all empty tags.
			//source = source.replace(/<([\w:-]+)[^>]*>\s*<\/\1>/ig, '');
			// remove all empty tags that with no 'src' property.
			source = source.replace(/<([\w:]+)(\s+(?!src)\w+\s*=\s*(["']?)(?:[^\\>]|\\\3)*?\3)?>\s*<\/\1>/ig, '');
			contentNode.innerHTML = source;
			if(signContainer) {
				var replySplit = doc.getElementById("replySplit");
				if(replySplit){
					contentNode.insertBefore(signContainer, replySplit);
				} else {
					contentNode.appendChild(signContainer);
				}
			}
			//if(replyContainer) {
			//	contentNode.appendChild(replyContainer);
			//}
		},
        /**
         *清除文字背景颜色
         */
        setBackgroundColor: function (color,isSilent) {
            if ($.browser.firefox) {
                this.execCommand("Bold");//为了生成一个span
                var elem = this.getSelectedElement();
                elem.style.backgroundColor = color;
                this.execCommand("Bold");//打扫卫生
            } else {
                if ($B.is.ie) {
                    this.jEditorDocument.find("font").attr("oldel", 1);
                }
                this.execCommand("BackColor", color);
                if ($B.is.ie) {
                    //解决从word复制内容到html编辑器里，有时字体颜色无法修改的问题
                    this.jEditorDocument.find("font:not([oldel])").find("span").each(function () {
                        if (this.style.backgroundColor) {
                            this.style.backgroundColor = "";
                        }
                    });
                }
            }
        },

        /**
         *重做（取消撤销的操作）
         */
        redo: function () {
            if (this.supportRedoMode) {
                this.history.redo();
            } else {
	            this.execCommand("Redo");
            }
        },
        /**
         *撤销操作
         */
        undo: function () {
            if (this.supportRedoMode) {
                this.history.undo();
            } else {
	            // 清除格式后，支持一次性撤销（IE仍可多次）
	            if(this.sourceBackup != undefined){
		            this.editorDocument.body.innerHTML = this.sourceBackup;
		            this.sourceBackup = null;
		            delete this.sourceBackup;
		            this.editor.off("keydown", this.restoreSource);
	            } else {
	                this.execCommand("Undo");
                }
            }
        },
        /**
         *封装document.execCommand操作
         */
        execCommand: function (command, param, isSilent) {
            var self = this;

            if (!isSilent) {
                this.editorWindow.focus();
            }
            if(!isSilent){
                this.trigger("beforeexeccommand", { command: command, param: param });
            }

            //var sRange = this.getRangeObject();
            this.editorDocument.execCommand(command, false, param);
            this.styleCommand(command);

            //var eRange = this.getRangeObject();

            if (!isSilent && M139.Browser.is.ie && M139.Browser.getVersion() > 7) {
                this.editorWindow.focus();
            }

            if(!isSilent){
                this.trigger("afterexeccommand", { command: command, param: param });
            }
            
            //updateState();
        },

        // 一些文本操作之后的样式控制
        styleCommand: function (command) {
            var self = this;

            switch (command) {
                case "Indent":
                    // ie下BLOCKQUOTE元素会增加默认的顶部和底部外边距
                    if ($B.is.ie) {
                        setTimeout(function(){
	                        //note: IE11不支持createRange (xiaoyu)
							try{
								var range = self.getRangeObject();
								var sRangeContainer = range.parentElement().parentElement;

                                if (sRangeContainer.tagName == "BLOCKQUOTE") {
                                    sRangeContainer.style.marginTop = "0";
                                    sRangeContainer.style.marginBottom = "0";
                                }
                            }catch(e){ }
                        }, 100);
                    }
                    break;
            }
        }
    }
)
);

    //添加静态方法
    $.extend(M2012.UI.HTMLEditor.Model.Editor,
     /**
      *@lends M2012.UI.HTMLEditor.Model.Editor
      */
    {
        getDefaultFont: function () {
            var defaultFont = {};
            try {
                defaultFont = top.$User.getDefaultFont();
            } catch (e) {
            }
            return defaultFont;
        }
    });

})(jQuery, _, M139);
