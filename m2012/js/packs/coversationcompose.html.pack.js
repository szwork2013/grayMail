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

﻿/**
 * @fileOverview 定义编辑器的弹出菜单
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var document = window.document;

    M139.namespace("M2012.UI.HTMLEditor.View.Menu", superClass.extend(
        /**
        *@lends M2012.UI.HTMLEditor.View.Menu.prototype
        */
        {
            /** 弹出菜单组件
            *@constructs M2012.UI.HTMLEditor.View.Menu
            *@extends M139.View.ViewBase
            *@param {Object} options 初始化参数集
            *@param {String} options.template 组件的html代码
            *@example
            */
            initialize: function (options) {
                var $el = jQuery((options && options.template) || this.template);
                this.setElement($el);
                return superClass.prototype.initialize.apply(this, arguments);
            },

            render: function () {
                var This = this;
                this.$el.appendTo(document.body);

                this.on("select", this.hide);

                this.render = function () {
                    return this;
                }
                
                return superClass.prototype.render.apply(this, arguments);
            },

            hide: function () {
                M2012.UI.PopMenu.unBindAutoHide({ action: "click", element: this.el});
                return superClass.prototype.hide.apply(this, arguments);
            },

            //#xxx转rgb
            getRGBColor: function (color) {
                if (/rgb/i.test(color)) {
                    return color.toLowerCase();
                } else if (color.indexOf("#") > -1) {
                    var m = color.match(/^\#(.)(.)(.)$/);
                    if (m) {
                        return M139.Text.Utils.format("rgb({r},{g},{b})", {
                            r: parseInt(m[1] + m[1], 16),
                            g: parseInt(m[2] + m[2], 16),
                            b: parseInt(m[3] + m[3], 16)
                        });
                    } else {
                        m = color.match(/^\#(..)(..)(..)$/);
                        if (m) {
                            return M139.Text.Utils.format("rgb({r},{g},{b})", {
                                r: parseInt(m[1], 16),
                                g: parseInt(m[2], 16),
                                b: parseInt(m[3], 16)
                            });
                        }
                    }
                }
                return color;
            },

            /**
             *显示菜单
             *@param {Object} options 参数集
             *@param {HTMLElement} options.dockElement 停靠的元素
             */
            show: function (options) {
                var This = this;
				var direction = this.editorView.options.editorBtnMenuDirection || "down";
                
                //会话邮件写信页特殊处理
				if(window.conversationPage){
					direction = "up";
                    //this.$el.find("div.font-type").css({ 'height':185,'overflow':'hidden', 'background':'white' });
                    this.$el.find("div.FontFamilyList,div.FontSizeList").css({ 'height':140, 'overflow-y':'scroll', 'position':'relative','background':'white' });
				}
                
				this.$el.css("z-index", 40000);
                this.dockElement = options.dockElement;
                //停靠在按钮旁边
                M139.Dom.dockElement(options.dockElement, this.el, {
                    direction: direction
                });
                //点击空白处自动消失
                M2012.UI.PopMenu.bindAutoHide({
                    action: "click",
                    element: this.el,
                    stopEvent: true,
                    callback: function () {
                        This.hide();
                    }
                });
                return superClass.prototype.show.apply(this, arguments);
            },
            
            /**
             *显示默认字体对话框
             *@param 
             */
            onChangeButtonClick: function () {
                this.hide();
                var fontIFrame = top.$Msg.open({
                    dialogTitle:"设置默认字体",
                    url:"defaultFont.htm?sid="+top.sid,
                    width:420,
                    height:248
                });
                
                var self = this;
                top.$App.on('setDefaultFonts', function(fonts){
                    self.editorView.editor.setDefaultFont(fonts);
                    if(top.$App){
                        top.$App.off('setDefaultFonts');
                        top.$App.trigger("userAttrChange", {callback: function () {}});
                    }
                    fontIFrame.close();
                });
                top.$App.on('cancelDefaultFonts', function(){
                    if(top.$App){
                        top.$App.off('cancelDefaultFonts');
                    }
                    fontIFrame.close();
                });
            }
        }
    ));

    M2012.UI.HTMLEditor.View.FaceFamilyMenu = M2012.UI.HTMLEditor.View.Menu.extend({
        events: {
            "click a.BtnChangeDefault": "onChangeButtonClick",
            "click .FontFamilyList a": "onSelect"
        },
        template: ['<div class="menuPop shadow font-type" style="left:600px;top:260px;">',
         '<div class="fonttype-list FontFamilyList">',
             '<a rel="微软雅黑" style="font-family: 微软雅黑;" href="javascript:void(0)"><span class="cur"></span>微软雅黑</a>',
             '<a rel="宋体" style="font-family: 宋体;" href="javascript:void(0)"><span class="cur"></span>宋体</a>',
             '<a rel="黑体" style="font-family: 黑体;" href="javascript:void(0)"><span class="cur"></span>黑体</a>',
             '<a rel="楷体" style="font-family: 楷体;" href="javascript:void(0)"><span class="cur"></span>楷体</a>',
             '<a rel="隶书" style="font-family: 隶书;" href="javascript:void(0)"><span class="cur"></span>隶书</a>',
             '<a rel="幼圆" style="font-family: 幼圆;" href="javascript:void(0)"><span class="cur"></span>幼圆</a>',
             '<a rel="Arial" style="font-family: Arial;" href="javascript:void(0)"><span class="cur"></span>Arial</a>',
             '<a rel="Arial Narrow" style="font-family: Arial Narrow;" href="javascript:void(0)"><span class="cur"></span>Arial Narrow</a>',
             '<a rel="Arial Black" style="font-family: Arial Black;" href="javascript:void(0)"><span class="cur"></span>Arial Black</a>',
             '<a rel="Comic Sans MS" style="font-family: Comic Sans MS;" href="javascript:void(0)"><span class="cur"></span>Comic Sans MS</a>',
             '<a rel="Courier" style="font-family: Courier;" href="javascript:void(0)"><span class="cur"></span>Courier</a>',
             '<a rel="System" style="font-family: System;" href="javascript:void(0)"><span class="cur"></span>System</a>',
             '<a rel="Times New Roman" style="font-family: Times New Roman;" href="javascript:void(0)"><span class="cur"></span>Times New Roman</a>',
             '<a rel="Verdana" style="font-family: Verdana;" href="javascript:void(0)"><span class="cur"></span>Verdana</a>',
         '</div>',
         '<div class="font-type-btn" style="display:none;">',
             '<a href="javascript:void(0)" title="修改" class="font-a BtnChangeDefault"><i class="i_setn"></i></a>',
             '默认:<span id="defaultFamily"></span>',
         '</div>',
        '</div>'].join(""),
        onSelect: function (e) {
            var value = e.target.style.fontFamily;
            this.trigger("select", { value: value });
        },
        onChangeButtonClick: function () {
            return M2012.UI.HTMLEditor.View.Menu.prototype.onChangeButtonClick.apply(this, arguments);
        },

        /**
         藏默认字体菜单
         *@inner
        */
        hideDefaultFont:function(){
            this.$el.find(".font-type-btn").hide();
        },
        
        /**
         显示默认字体菜单
         *@inner
        */
        showDefaultFont:function(){
            this.$el.find(".font-type-btn").show();
        },

        onDefaultValueChange: function (value) {
            this.trigger("defaultvaluechange", { value: value });
        },
        show: function () {
            var style = this.editorView.editor.getSelectedStyle();
            this.$("a.on").removeClass("on");
            if (style.fontFamily) {
                style.fontFamily = style.fontFamily.replace(/'/g, "");//过滤掉多余的引号，如：'Arial Black' 
                this.$("a[rel='" + style.fontFamily + "']").addClass("on");
            }
            //ie bug 会显示多个打勾
            if ($B.is.ie) {
                this.$el.html(this.$el.html());
            }
            var defaultFamily = M2012.UI.HTMLEditor.Model.Editor.getDefaultFont().family;
            if (!defaultFamily) {
                this.hideDefaultFont();
            }else if(this.editorView.isShowSetDefaultFont){
                this.showDefaultFont();
                this.$('#defaultFamily').text(defaultFamily);
            }
            
            return M2012.UI.HTMLEditor.View.Menu.prototype.show.apply(this, arguments);
        }
    });

    M2012.UI.HTMLEditor.View.FaceSizeMenu = M2012.UI.HTMLEditor.View.Menu.extend({
        events: {
            "click a.BtnChangeDefault": "onChangeButtonClick",
            "click .FontSizeList a": "onSelect"
        },
        template: ['<div class="menuPop shadow font-type" style="left:600px;top:660px;">',
             '<div class="fonttype-list FontSizeList">',
                 '<a href="javascript:void(0)" rel="x-small"><span style="font-size:x-small;"><span class="cur"></span>六号</span></a>',
                 '<a href="javascript:void(0)" rel="small"><span style="font-size:small;"><span class="cur"></span>五号</span></a>',
                 '<a href="javascript:void(0)" rel="medium"><span style="font-size:medium;"><span class="cur"></span>四号</span></a>',
                 '<a href="javascript:void(0)" rel="large"><span style="font-size:large;"><span class="cur"></span>三号</span></a>',
                 '<a href="javascript:void(0)" rel="x-large"><span style="font-size:x-large;"><span class="cur"></span>二号</span></a>',
                 '<a href="javascript:void(0)" rel="xx-large"><span style="font-size:xx-large;"><span class="cur"></span>一号</span></a>',
             '</div>',
             '<div class="font-type-btn" style="display:none;">',
                 '<a href="javascript:void(0)" title="修改" class="font-a BtnChangeDefault"><i class="i_setn"></i></a>',
                 '默认:<span id="defaultSize"></span>',
             '</div>',
         '</div>'].join(""),
        onSelect: function (e) {
            var target = M139.Dom.findParent(e.target, "a") || e.target;
            var map = {
                "xx-large": 6,
                "x-large": 5,
                "large": 4,
                "medium": 3,
                "small": 2,
                "x-small": 1
            };
            var value = map[target.getAttribute("rel")];
            this.trigger("select", { value: value });
        },
        onChangeButtonClick: function () {
            return M2012.UI.HTMLEditor.View.Menu.prototype.onChangeButtonClick.apply(this, arguments);
        },
        onDefaultValueChange: function (value) {
            this.trigger("defaultvaluechange", { value: value });
        },
        getPxSize:function(fontSizeText){
            if (/\d+$/.test(fontSizeText)) {
                fontSizeText = ({
                    6: "xx-large",
                    5: "x-large",
                    4: "large",
                    3: "medium",
                    2: "small",
                    1: "x-small"
                })[fontSizeText] || fontSizeText;
            }
            return fontSizeText;
        },

        /**
         藏默认字体菜单
         *@inner
        */
        hideDefaultFont: function () {
            this.$el.find(".font-type-btn").hide();
        },
        
        /**
         显示默认字体菜单
         *@inner
        */
        showDefaultFont:function(){
            this.$el.find(".font-type-btn").show();
        },

        show: function () {
            var style = this.editorView.editor.getSelectedStyle();
            var selectedFontSize = this.getPxSize(style.fontSize);
            this.$("a.on").removeClass("on");
            // style.fontSize IE8对选区设置新字号后会得到数字，而默认会得到像素值，chrome总是得到像素值
            if (style.fontSize) {
                this.$("a > span").each(function () {
	                // IE8 get text value such as "medium", chrome get pixel value
                    var menuValue = M139.Dom.getCurrentCSS(this, "font-size");
                    // fix: old IE不勾选默认字号
                    if(isNaN(parseInt(menuValue)) && this.innerText.indexOf(style.fontSizeText) != -1) {
	                    $(this.parentNode).addClass("on");
                    } else if (selectedFontSize == menuValue) {
                        $(this.parentNode).addClass("on");
                        return false;
                    } else if (style.fontSize == "12px" && parseInt(menuValue) < 12) {
                        //chrome有时候最小字体是12px
                        $(this.parentNode).addClass("on");
                        return false;
                    }
                });
            }
            //ie bug 会显示多个打勾
            if ($B.is.ie && $B.getVersion() < 8) {
                this.$el.html(this.$el.html());
            }
            
            var defaultSize = M2012.UI.HTMLEditor.Model.Editor.getDefaultFont().sizeText;
            if (!defaultSize) {
                this.hideDefaultFont();
            }else if(this.editorView.isShowSetDefaultFont){
                this.showDefaultFont();
                this.$('#defaultSize').text(defaultSize);
            }
            
            return M2012.UI.HTMLEditor.View.Menu.prototype.show.apply(this, arguments);
        }
    });

    M2012.UI.HTMLEditor.View.ColorMenu = M2012.UI.HTMLEditor.View.Menu.extend({
        events: {
            "click .ColorList a": "onSelect"
        },
        colors: ["0, 0, 0", "153, 51, 0", "51, 51, 0", "0, 51, 0", "0, 51, 102", "0, 0, 128", "51, 51, 153", "51, 51, 51", "128, 0, 0", "255, 102, 0", "128, 128, 0", "0, 128, 0", "0, 128, 128", "0, 0, 255", "102, 102, 153", "128, 128, 128", "255, 0, 0", "255, 153, 0", "153, 204, 0", "51, 153, 102", "51, 204, 204", "51, 102, 255", "128, 0, 128", "153, 153, 153", "255, 0, 255", "255, 204, 0", "255, 255, 0", "0, 255, 0", "0, 255, 255", "0, 204, 255", "153, 51, 102", "192, 192, 192", "255, 153, 204", "255, 204, 153", "255, 255, 153", "204, 255, 204", "204, 255, 255", "153, 204, 255", "204, 153, 255", "255, 255, 255"],
        //colors: ["000000", "993300", "333300", "003300", "003366", "000080", "333399", "333333", "800000", "ff6600", "808000", "008000", "008080", "0000ff", "666699", "808080", "ff0000", "ff9900", "99cc00", "339966", "33cccc", "3366ff", "800080", "999999", "ff00ff", "ffcc00", "ffff00", "00ff00", "00ffff", "00ccff", "993366", "c0c0c0", "ff99cc", "ffcc99", "ffff99", "ccffcc", "ccffff", "99ccff", "cc99ff", "ffffff"],
        insertPath: ".fontcolor-list",
        template: ['<div class="menuPop shadow font-colorpop" style="left:820px;top:860px;">',
             '<div class="fontcolor-list ColorList">',
             '</div>',
         '</div>'].join(""),
        onSelect: function (e) {
            var value = (e.target.firstChild || e.target).style.backgroundColor;
            this.trigger("select", { value: value });
        },
        render: function () {
            var htmlCode = [];
            var colors = this.colors;
            var itemTemplate = '<a href="javascript:void(0)" rel="#color#"><span style="background-color:#color#"></span></a>';
            for (var i = 0; i < colors.length; i++) {
                var c = colors[i];
                htmlCode.push(itemTemplate.replace(/\#color\#/g, "rgb(" + c + ")"));
                //htmlCode.push(itemTemplate.replace(/\#color\#/g, "#" + c));
            }
            this.$(this.insertPath).html(htmlCode.join(""));

            return M2012.UI.HTMLEditor.View.Menu.prototype.render.apply(this, arguments);
        },
        onChangeButtonClick: function () {
            //todo 显示修改默认字体菜单
        },
        onDefaultValueChange: function (value) {
            this.trigger("defaultvaluechange", { value: value });
        },
        show: function () {
            var This = this;
            var style = this.editorView.editor.getSelectedStyle();
            this.$("a.on").removeClass("on");
            var selColor = (this.options && this.options.isBackgroundColor) ? style.backgroundColor : style.color;
            if (selColor) {
                var rgb = this.getRGBColor(selColor);
                this.$("a[rel='" + rgb + "']").addClass("on");
            }
            return M2012.UI.HTMLEditor.View.Menu.prototype.show.apply(this, arguments);
        }
    });

    M2012.UI.HTMLEditor.View.TableMenu = M2012.UI.HTMLEditor.View.Menu.extend({
        events: {
            "click td": "onSelect",
            "mouseover td > div": "onItemMouseOver"
        },
        Rows: 10,
        Cells: 10,
        insertPath: "table",
        template: ['<div class="menuPop shadow tabpop" style="left:620px;top:860px;">',
         '<p>请选择表格大小<label></label></p>',
         '<table></table>',
        '</div>'].join(""),
        onSelect: function (e) {
            this.trigger("select", {
                value: this.getSelectedValue(e)
            });
        },
        getSelectedValue: function (e) {
            var dom = e.target.firstChild || e.target;
            return {
                rows: dom.getAttribute("rowIndex") * 1 + 1,
                cells: dom.getAttribute("cellIndex") * 1 + 1
            };
        },
        //鼠标移过显示选中效果
        onItemMouseOver: function (e) {
            var sel = this.getSelectedValue(e);
            this.$("label").text(" " + sel.rows + "行" + sel.cells + "列");
            this.$("td").each(function () {
                if (this.cellIndex < sel.cells && this.parentNode.rowIndex < sel.rows) {
                    this.className = "on";
                } else {
                    this.className = "";
                }
            });
        },
        render: function () {
            var htmlCode = [];
            var rows = this.Rows;
            var cells = this.Cells;
            var htmlCode = [];
            for (var i = 0; i < rows; i++) {
                htmlCode.push("<tr>");
                for (var j = 0; j < cells; j++) {
                    htmlCode.push("<td><div rowIndex='" + i + "' cellIndex='" + j + "'></div></td>");
                }
                htmlCode.push("</tr>");
            }
            this.$(this.insertPath).html(htmlCode.join(""));

            return M2012.UI.HTMLEditor.View.Menu.prototype.render.apply(this, arguments);
        }
    });

    M2012.UI.HTMLEditor.View.RowSpaceMenu = M2012.UI.HTMLEditor.View.Menu.extend({
        events: {
            "click a.BtnChangeDefault": "onChangeButtonClick",
            "click .FontLineHeightList a": "onSelect"
        },
        Rows: 10,
        Cells: 10,
        template: ['<div class="menuPop shadow font-type" style="left:820px;top:1060px;">',
             '<div class="fonttype-list FontLineHeightList">',
             '<a href="javascript:;" rel="1.2"><span class="cur"></span>单倍</a>',
             '<a href="javascript:;" rel="1.5"><span class="cur"></span>1.5倍</a>',
             '<a href="javascript:;" rel="2"><span class="cur"></span>2倍</a>',
             '<a href="javascript:;" rel="2.5"><span class="cur"></span>2.5倍</a>',
             '</div>',
             '<div class="font-type-btn" style="display:none;">',
                 '<a href="javascript:void(0)" title="修改" class="font-a BtnChangeDefault"><i class="i_setn"></i></a>',
                 '默认:<span id="defaultLineHeight"></span>',
             '</div>',
         '</div>'].join(""),
        onSelect: function (e) {
            this.trigger("select", {
                value: this.getSelectedValue(e)
            });
        },
        getSelectedValue: function (e) {
            var val = e.target.getAttribute('rel');
            return val * 1;
        },
        onDefaultValueChange: function (value) {
            this.trigger("defaultvaluechange", { value: value });
        },
        onChangeButtonClick: function () {
            return M2012.UI.HTMLEditor.View.Menu.prototype.onChangeButtonClick.apply(this, arguments);
        },
        
        /**
         藏默认行距菜单
         *@inner
        */
        hideDefaultFont:function(){
            this.$el.find(".font-type-btn").hide();
        },
        
        /**
         显示默认字体菜单
         *@inner
        */
        showDefaultFont:function(){
            this.$el.find(".font-type-btn").show();
        },
        
        show: function () {
            var style = this.editorView.editor.getSelectedStyle();
            this.$("a.on").removeClass("on");
            if (style.lineHeight) {
                this.$("a[rel='" + style.lineHeight + "']").addClass("on");
            }
            //ie bug 会显示多个打勾
            if ($B.is.ie) {
                this.$el.html(this.$el.html());
            }
            
            var defaultLineHeight = M2012.UI.HTMLEditor.Model.Editor.getDefaultFont().lineHeightText;

            if (!defaultLineHeight) {
                this.hideDefaultFont();
            }else if(this.editorView.isShowSetDefaultFont){
                this.showDefaultFont();
                this.$('#defaultLineHeight').text(defaultLineHeight);
            }

            return M2012.UI.HTMLEditor.View.Menu.prototype.show.apply(this, arguments);
        }
    });

    M2012.UI.HTMLEditor.View.LinkMenu = M2012.UI.HTMLEditor.View.Menu.extend({
        events: {
            "click a.BtnYes": "onSelect",
            "click": "onContainerClick",
            "click a.i_u_close": "hide",
            "click a.BtnTestLink": "onTestLinkClick",
            "click a.CloseButton": "onCloseButtonClick"
        },
        template: ['<div class="shadow linkpop" style="position: absolute;">',
             '<a href="javascript:;" title="关闭" class="i_u_close CloseButton"></a>',
             '<ul class="form">',
                 '<li class="formLine">',
                     '<label class="label">要显示的文字：</label>',
                     '<div class="element"><input type="text" class="iText inShadow TextBoxText" value="">',
                     '</div>',
                 '</li>',
                 '<li class="formLine">',
                     '<label class="label">链接到：</label>',
                     '<div class="element"><input type="text" class="iText inShadow TextBoxUrl" value="http://">',
                     '</div>',
                 '</li>',
                 '<li class="formLine">',
                     '<label class="label"></label>',
                     '<div class="element"><a class="BtnTestLink" href="javascript:;" style="font-family:\'宋体\'">检测此链接&gt;&gt;</a>',
                     '<span class="lbl_linkTip" style="color:red;display:none">  链接格式非法</span>',
                     '</div>',
                 '</li>',
             '</ul>',
             '<p class="ta_r"><a href="javascript:void(0)" class="btnNormal vm BtnYes"><span>确 定</span></a></p>',
         '</div>'].join(""),
        onContainerClick: function (e) {
            //方式默认行为：点击空白自动关闭
            M139.Event.stopEvent(e);
        },
        onTestLinkClick:function(e){
            var value = this.getSelectedValue(e);
            var url = value.url.trim();
            if (url == "") {
                this.$(".TextBoxUrl").focus();
            } else if (this.testLink(url)) {
                window.open(url);
            }
        },
        testLink: function (url) {
            if (M139.Text.Url.isUrl(url)) {
                this.$(".lbl_linkTip").hide();
                return true;
            } else {
                this.$(".lbl_linkTip").show();
                return false;
            }
        },
        onCloseButtonClick:function(){
            this.hide();
        },
        render: function () {
            this.textInput = this.$(".TextBoxText");
            this.urlInput = this.$(".TextBoxUrl");
            var This = this;
            M139.Timing.watchInputChange(this.urlInput[0], function () {
                This.onUrlChange();
            });
            return M2012.UI.HTMLEditor.View.Menu.prototype.render.apply(this, arguments);
        },
        onUrlChange:function(){
            var text = this.textInput.val();
            var url = this.urlInput.val();
            //如果文本内容为空，则同步url框的值，交互需求
            if (text == "" || url.indexOf(text) == 0) {
                if (url != "http://") {
                    this.textInput.val(url);
                }
            }
        },
        show: function () {
            var This = this;
            this.textInput.val(this.editorView.editor.getSelectedText());
            this.urlInput.val("http://");
            setTimeout(function () {
                This.urlInput.focus();
                This.urlInput.select();
            }, 10);
            return M2012.UI.HTMLEditor.View.Menu.prototype.show.apply(this, arguments);
        },
        onSelect: function (e) {
            var input = this.getSelectedValue(e);
            if (!this.testLink(input.url)) {
                return;
            }
            if (input.text.trim() == "") {
                input.text = value.url;
            }
            this.hide();
            this.trigger("select", {
                text: input.text,
                url: input.url
            });
        },
        getSelectedValue: function (e) {
            return {
                text: this.textInput.val(),
                url: this.urlInput.val()
            };
        }
    });

    //表情菜单
    M2012.UI.HTMLEditor.View.FaceMenu = M2012.UI.HTMLEditor.View.Menu.extend(
        /**
        *@lends M2012.UI.HTMLEditor.View.FaceMenu.prototype
        */
        {
            /** 表情菜单组件
            *@constructs M2012.UI.HTMLEditor.View.FaceMenu
            *@extends M2012.UI.HTMLEditor.View.Menu
            *@param {Object} options 初始化参数集
            *@param {String} options.basePath 可选参数：表情文件的根路径（缺省加载默认配置）
            *@param {Array} options.faces 可选参数：表情文件分类的配置（缺省加载默认配置）
            *@example
            new M2012.UI.HTMLEditor.View.FaceMenu({
                basePath: "/m2012/images/face",
                faces: [{
                    name: "豆豆",
                    folder: "doudou",//文件夹名称
                    thumb: "thumb.png",
                    count: 19,//表情个数
                    pageSize: 40,//一页显示几个
                    height: 20,//缩略图高度
                    thumbOffset: 30,
                    width: 20,//缩略图宽度
                    fileType: "gif",//表情图片文件类型
                    desc: ["假笑", "开心", "坏笑", "晴转阴","...."]//每个表情的描述文字
                }]
            }).render();
            */
            initialize: function (options) {
                options = options || {};

                this.basePath = options.basePath || FaceConfig.basePath;
                this.faces = options.faces || FaceConfig.faces;

                var $el = jQuery((options && options.template) || this.template);
                this.setElement($el);
                this.model = new Backbone.Model();
                return M2012.UI.HTMLEditor.View.Menu.prototype.initialize.apply(this, arguments);
            },
            events: {
                "click .HeaderItem": "onHeaderClick",
                "click .ThumbItem": "onThumbClick",
                "click .PrevPage": "onPrevPageClick",
                "click .NextPage": "onNextPageClick",
                "click .CloseButton": "onCloseClick"
            },
            headerTemplate: '<li class="HeaderItem" data-index="{index}"><a href="javascript:;"><span>{name}</span></a></li>',
            thumbTemplate: ['<div class="ab"><a class="ThumbItem" href="javascript:;" ',
                'index="{index}" ',
                'style="height:{height}px;width:{width}px;',
                'background-position: -{x}px -{y}px;',
                'background-image: url({thumb});',
                'background-repeat: no-repeat;margin:5px;border:0;" ',
                'data-url="{image}" ',
                'title="{alt}"></a></div>'].join(""),
            /*
            <div class="ab">
			<a class="ThumbItem" href="javascript:;" style="height:20px;width:20px;background-position: -0px -0px;background-image: url(http://rm.mail.10086ts.cn/m2012/images/face/doudou/thumb.png);background-repeat: no-repeat;margin:5px;border:0;"  title="假笑"></a>
			</div>
            */


            template: ['<div class="tips delmailTips smilepop" style="top:1600px;left:40px;">',
                 '<a class="delmailTipsClose CloseButton" href="javascript:;"><i class="i_u_close"></i></a>',
                 '<div class="tips-text">',
                     '<div class="tab smilepopTab">',
                         '<div class="tabTitle">',
                             '<ul class="HeaderContainer">',
                             '</ul>',
                         '</div>',
                         '<div class="tabMain">',
                             '<div class="tabContent show">',
                                 '<div style="width:449px;height:225px" class="smilelist clearfix ContentContainer">',		
                                    /*
                                    <div class="ab">
						            <a class="ThumbItem" href="javascript:;" style="height:20px;width:20px;background-position: -0px -0px;background-image: url(http://rm.mail.10086ts.cn/m2012/images/face/doudou/thumb.png);background-repeat: no-repeat;margin:5px;border:0;"  title="假笑"></a>
						            </div>
                                     */
                                 '</div>',
                                 '<div class="pagediv clearfix" style="display:none">',//翻页暂时不需要了
                                     '<div class="pageDrop fr page-top mr_10">',
                                         '<span class="pagenum LabelPage"></span>',
                                         '<a class="PrevPage" href="javascript:;">上一页</a>',
                                         '<a class="NextPage" href="javascript:;">下一页</a>',
                                     '</div>',
                                 '</div>',
                             '</div>',
                         '</div>',
                     '</div>',
                 '</div>',
             '</div>'].join(""),
            render: function () {

                this.renderHeaders();

                this.initEvents();

                this.setHeader(0);

                return M2012.UI.HTMLEditor.View.Menu.prototype.render.apply(this, arguments);
            },

            /**
             *绘制头部，即表情分类区
             *@inner
             */
            renderHeaders: function () {
                var list = this.faces;
                var htmlCode = [];
                for (var i = 0; i < list.length; i++) {
                    htmlCode.push(M139.Text.Utils.format(this.headerTemplate,
                    {
                        index: i,
                        name: list[i].name
                    }));
                }
                this.$(".HeaderContainer").html(htmlCode.join(""));
            },

            /**
             *绘制表情内容区
             *@inner
             */
            renderContent: function () {
                var pageIndex = this.model.get("pageindex");
                var headerIndex = this.model.get("header");
                var face = this.faces[headerIndex];
                var htmlCode = [
                '<div style="display:none;left:12px;top: 140px;" class="smilelistView">',
                    '<img class="PreviewImage" width="64" height="64" />',
                '</div>'];
                var startIndex = (pageIndex - 1) * face.pageSize;
                var endIndex = Math.min(face.count, startIndex + face.pageSize);
                for (var i = startIndex; i < endIndex; i++) {
                    var bgImage = this.basePath + "/" + face.folder + "/" + face.thumb;
                    var image = this.basePath + "/" + face.folder + "/" + i + "." + face.fileType;
                    htmlCode.push(M139.Text.Utils.format(this.thumbTemplate,
                    {
                        x: i * face.thumbOffset,
                        y: 0,
                        height: face.height,
                        width: face.width,
                        thumb: bgImage,
                        image: image,
                        alt: face.desc[i],
                        index: i
                    }));
                }
                this.$(".ContentContainer").html(htmlCode.join(""));
            },

            /**
             *绑定事件
             *@inner
             */
            initEvents: function () {
                var This = this;
                this.model.on("change:header", function (model, header) {
                    var face = This.faces[header];
                    model.set("pageindex", null, true);
                    model.set("pageindex", 1);
                    This.focusHeader();
                }).on("change:pageindex", function (model, pageIndex) {
                    This.renderContent();
                    This.updatePageBar();
                });

                this.$(".ContentContainer").mouseover(function (e) {
                    if (e.target.tagName == "A") {
                        This.onPreviewShow(e, e.target.getAttribute("index"));
                    }
                }).mouseout(function (e) {
                    if (e.target.tagName == "A") {
                        This.onPreviewHide(e);
                    }
                });
            },

            /**
             *设置当前表情
             *@inner
             */
            setHeader: function (index) {
                this.model.set("header", index);
            },

            /**
             *点击表情种类的时候
             *@inner
             */
            onHeaderClick: function (e) {
                var li = M139.Dom.findParent(e.target, "li");
                var index = li.getAttribute("data-index");
                this.setHeader(index);
            },

            /**
             *点击x关闭按钮
             *@inner
             */
            onCloseClick: function (e) {
                this.hide();
            },

            /**
             *鼠标悬浮的时候显示预览图片
             *@inner
             */
            onPreviewShow: function (e,index) {
                var url = e.target.getAttribute("data-url");
                var img = this.$("img.PreviewImage").attr("src", url);
                var div = img.parent().show();
                if (index % 14 > 6) {
                    div.css("left", 365);
                } else {
                    div.css("left", 12);
                }
            },

            /**
             *隐藏预览图片
             *@inner
             */
            onPreviewHide: function (e) {
                this.$("img.PreviewImage").parent().hide();
            },

            /**
             *当前标签获得焦点
             *@inner
             */
            focusHeader: function () {
                var index = this.model.get("header");
                this.$(".HeaderItem.on").removeClass("on");
                this.$(".HeaderItem").eq(index).addClass("on");
            },

            /**
             *更新分页信息
             *@inner
             */
            updatePageBar: function () {
                var header = this.model.get("header");
                var page = this.model.get("pageindex");
                var face = this.faces[header];
                var pageCount = Math.ceil(face.count / face.pageSize);
                var lblText = page + "/" + pageCount;
                this.$(".LabelPage").text(lblText);
                if (pageCount > 1) {
                    this.$(".PrevPage,.NextPage").show();
                } else {
                    this.$(".PrevPage,.NextPage").hide();
                }
            },

            /**
             *当用户点击表情
             *@inner
             */
            onThumbClick: function (e) {
                var url = e.target.getAttribute("data-url");
                //发送出去要加完整路径
                if (url.indexOf("http") == -1) {
                    url = "http://" + location.host + "/" + url;
                }
                this.onSelect({
                    url: url
                });
                return false;
            },

            /**
             *获得当前表情页数
             *@inner
             */
            getPageCount: function () {
                var header = this.model.get("header");
                var face = this.faces[header];
                var pageCount = Math.ceil(face.count / face.pageSize);
                return pageCount;
            },

            /**
             *点击上一页
             *@inner
             */
            onPrevPageClick: function () {
                var page = this.model.get("pageindex");
                if (page > 1) {
                    this.model.set("pageindex", page - 1);
                }
            },
            /**
             *点击下一页
             *@inner
             */
            onNextPageClick: function () {
                var page = this.model.get("pageindex");
                if (page < this.getPageCount()) {
                    this.model.set("pageindex", page + 1);
                }
            },
            /**
             *触发select事件
             */
            onSelect: function (e) {
                this.hide();
                this.trigger("select", {
                    url: e.url
                });
            }
        });

    var FaceConfig = {
        basePath: "/m2012/images/face",
        faces: [
        	{
                name: "生活",
                folder: "life",
                thumb: "thumb.png",
                count: 49,
                pageSize: 84,
                height: 20,
                thumbOffset: 30,
                width: 20,
                fileType: "gif",
                desc: ["鄙视", "踹地板", "得意", "发呆", "奋斗", "睡觉", "委屈", "无聊", "想家", "许愿", "中彩票", "抓狂", "逛街", "开心", "可爱", "恋爱", "伤心", "郁闷", "被K", "迟到了", "加班", "盼发工资", "求美女", "失恋了", "遇见帅哥", "月光了", "健身", "开车兜风", "旅游", "约会", "爱护森林", "春节", "低碳生活", "光棍节", "国庆", "节约用水", "绿色出行", "七夕", "圣诞节", "万圣节", "中秋", "大哭", "愤怒", "开心", "流泪", "窃喜", "伤心", "爽", "郁闷"]
            },
            {
                //表情名称
                name: "豆豆",
                //文件夹名称
                folder: "doudou",
                thumb: "thumb.png",
                //表情个数
                count: 19,
                //一页显示几个
                pageSize: 84,
                //缩略图高度
                height: 20,
                thumbOffset: 30,
                //缩略图宽度
                width: 20,
                fileType: "gif",
                //每个表情的描述文字
                desc: ["假笑", "开心", "坏笑", "晴转阴", "愁", "窘", "微笑", "傻笑", "抛媚眼", "装酷", "哭了", "爱慕", "调皮", "见钱眼开", "耍帅", "哈哈笑", "鼠眉鼠眼", "打盹", "生病了"]
            },
            {
                //表情名称
                name: "飞信",
                //文件夹名称
                folder: "fetion",
                thumb: "thumb.png",
                //表情个数
                count: 52,
                //一页显示几个
                pageSize: 84,
                //缩略图高度
                height: 20,
                thumbOffset: 30,
                //缩略图宽度
                width: 20,
                fileType: "gif",
                //每个表情的描述文字
                desc: ["天使","生气","咬牙切齿","困惑","酷","大哭","尴尬","思考","惊呆","拳头","好主意","偷笑","惊讶","睡着了","悲伤","鄙视","微笑","生病了","大笑","沉思","眨眼","失望","天真","担心","困","吓到","饮料","生日蛋糕","猫脸","闹钟","下雨","咖啡","计算机","狗脸","红心","心碎","女生抱抱","男生抱抱","香吻","灯泡","酒杯","手机","月亮","音乐","礼物","彩虹","玫瑰","凋谢","星星","太阳","雨伞","蜗牛"]
            },
            {
                name: "YOYO",
                folder: "yoyo",
                thumb: "thumb.png",
                count: 24,
                pageSize: 84,
                height: 20,
                thumbOffset: 30,
                width: 20,
                fileType: "gif",
                desc: ["撒娇", "惊奇", "眨眼", "无精打采", "乖乖", "俏皮", "淘气", "卡哇伊", "跳舞", "流汗", "打哈欠", "兴奋", "发呆", "帅气", "爱美", "大哭", "悟空", "色咪咪", "西瓜太郎", "兔女郎", "藐视", "疑问", "同情", "牛郎"]
            },
            {
                name: "信封脸",
                folder: "mailer",
                thumb: "thumb.png",
                count: 18,
                pageSize: 84,
                height: 20,
                thumbOffset: 30,
                width: 20,
                fileType: "gif",
                desc: ["害羞", "色", "可爱", "鄙视", "哭", "闭嘴", "冷汗", "抓狂", "衰", "晕", "憨笑", "大骂", "鼓掌", "飞吻", "馋", "偷笑", "可怜", "流泪"]
            }
        ]
    };

    /** 
     解决在非当前窗口创建编辑器的问题
    */
    M2012.UI.HTMLEditor.View.Menu.setWindow = function (window) {
        $ = jQuery = window.jQuery;
        document = window.document;
    };
})(jQuery, _, M139);

﻿/**
 * @fileOverview HTML编辑器的界面
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var document = window.document;

    /**
     *@namespace
     *@name M2012.UI.HTMLEditor.View
     *@inner
     */
    M139.namespace("M2012.UI.HTMLEditor.View", {});


    M139.namespace("M2012.UI.HTMLEditor.View.Editor", superClass.extend(
     /**
      *@lends M2012.UI.HTMLEditor.View.Editor.prototype
      */
    {
        /** HTML编辑器的界面
        *@constructs M2012.UI.HTMLEditor.View.Editor
        *@extends M139.View.ViewBase
        *@param {Object} options 初始化参数集
        *@param {String} options.template 组件的html代码
        *@param {String} options.toolbarPath_Common 常用按钮容器路径（第一排）
        *@param {String} options.buttons_Common 常用按钮
        *@param {String} options.toolbarPath_More 非常用按钮容器路径（第二排）
        *@param {String} options.buttons_More 非常用按钮
        *@param {String} options.showMoreButton 显示更多的切换按钮
        *@example
        */
        initialize: function (options) {

            if (options.buttons_Common && !this.options.toolBarPath_Common) {
                throw "缺少参数:options.toolBarPath_Common";
            }
            if (options.buttons_More && !this.options.toolBarPath_More) {
                throw "缺少参数:options.toolBarPath_More";
            }

            if(options.menus && _.isFunction(options.menus)){
                options.menus = options.menus();
            }

            var div = document.createElement("div");
            div.innerHTML = $T.format(options.template, { blankUrl: this.options.blankUrl });
            this.setElement(div.firstChild);

            this.menus = {};
            this.buttons = {};
            
            this.isShowSetDefaultFont = options.isShowSetDefaultFont;

            return superClass.prototype.initialize.apply(this, arguments);
        },

        /**@inner*/
        render: function () {
            var This = this;

            /**
            *编辑器基础类
            *@filed
            *@type {M2012.UI.HTMLEditor.Model.Editor}
            */
            this.editor = new M2012.UI.HTMLEditor.Model.Editor({
                frame: this.$("iframe")[0]
            });




            this.editor.on("focus", function () {
                /**编辑器加载完成(主要是空白页需要网络加载)
                * @name M2012.UI.HTMLEditor.View.Editor#focus
                * @event
                * @param {Object} e 事件参数
                * @example
                editorView.on("focus",function(e){});
                */
                This.trigger("focus");
            });
            this.editor.on("blur", function () {
                /**编辑器加载完成(主要是空白页需要网络加载)
                * @name M2012.UI.HTMLEditor.View.Editor#blur
                * @event
                * @param {Object} e 事件参数
                * @example
                editorView.on("blur",function(e){});
                */
                This.trigger("blur");
            });

            this.toolBar_Common = this.$(this.options.toolBarPath_Common);
            
            if(this.options.isSessionMenu || this.options.isUserDefineBtnContaier){ //全局查找
                this.toolBar_Common = $(this.options.toolBarPath_Common);
            }

            this.toolBar_More = this.$(this.options.toolBarPath_More);

            //注册常用按钮（第一排）
            var buttons_Common = this.options.buttons_Common;
            if (buttons_Common) {
                for (var i = 0; i < buttons_Common.length; i++) {
                    var btn = buttons_Common[i];
                    this.registerButton(btn, true);
                }
            }
            //注册非常用按钮（第二排）
            var buttons_More = this.options.buttons_More;
            if (buttons_More) {
                for (var i = 0; i < buttons_More.length; i++) {
                    var btn = buttons_More[i];
                    this.registerButton(btn);
                }
            }


            //注册菜单
            var menus = this.options.menus;
            if (menus) {
                for (var i = 0; i < menus.length; i++) {
                    var menu = menus[i];
                    this.registerMenu(menu);
                }
            }

            if (this.options.showMoreButton) {
                this.$(this.options.showMoreButton).click(function () {
                    This.onShowMoreClick();
                });
            }

            this.initEvents();

            return superClass.prototype.render.apply(this, arguments);
        },

        /**
         *注册按钮
         *@param {Object} options 配置参数集
         *@param {String} options.name 按钮名称，作为键值
         *@param {String} options.template 按钮的html代码
         *@param {String} options.command 按钮绑定的指令
         *@param {String} options.menu 按钮绑定的菜单
         *@param {Function} options.callback 点击按钮后的回调
         *@param {Function} options.queryStateCallback 查询状态回调（比如当前选中的文字颜色对此按钮的表现有影响）
         *@param {Boolean} isCommonButton 是否常用按钮(放在第一排)
        */
        registerButton: function (options, isCommonButton) {
            var This = this;

            var toolBar = isCommonButton ? this.toolBar_Common : this.toolBar_More;
            var el = toolBar[0];
            if (options.isLine) {
                //添加分割线
                $D.appendHTML(el, options.template);
            } else {
                //添加按钮的dom元素
                $D.appendHTML(el, options.template);
                var btn = jQuery(el.lastChild).click(function (e) {
                    This.onButtonClick(this, e, options);
                }).bind("dblclick",function(e){
                    This.onButtonDblClick(this, e, options);
                });

                if (options.queryStateCallback) {
                    //当光标选择区域变化的时候，需要通知到按钮变更外观
                    this.editor.on("bookmarkchange", function (e) {
                        options.queryStateCallback({
                            selectedStyle: e.selectedStyle,
                            editor:this,
                            element: btn
                        });
                    });
                }
                if(options.init){
                    options.init({
                        editor:this.editor,
                        element:btn
                    });
                }
            }
            this.buttons[options.name] = options;

        },

        /**
         *注册按钮
         *@param {Object} options 配置参数集
         *@param {String} options.name 菜单名称，作为键值
         *@param {String} options.template 按钮的html代码
         *@param {Function} options.callback 点击菜单项后的回调
         *@param {Function} options.queryStateCallback 查询状态回调（比如当前选中的文字颜色对此按钮的表现有影响）
        */
        registerMenu: function (options) {
            var This = this;
            this.menus[options.name] = options;
        },

        initEvents: function () {
            var This = this;
            this.editor.on("afterexeccommand", function (e) {
                if (e.command == "ForeColor") {
                    This.$el.find("#ED_SetFontColor span").css("background-color", e.param);

                    // 写信弹出窗口新增,如果找不到元素,默认为evocationEidtBar
                    // fix: 选择颜色, 颜色条不会改变的问题
                    if (!This.$el.find("#ED_SetFontColor span").length ) {
                        $("#evocationEidtBar").find("#ED_SetFontColor span").css("background-color", e.param);
                    }
                } else if (e.command == "BackColor") {
                    This.$el.find("#ED_SetBackgroundColor span").css("background-color", e.param);
                }
            });

            //检测输入值是否超出最大长度限制
            if (this.options.maxLength) {
                this.editor.on("keydown", function () {
                    This.testInputLength();
                });
            }
            //显示默认文本
            if (this.options.placeHolder) {
                this.editor.on("ready", function () {
                    This.initPlaceHolder();
                    This.editor.on("keyup", function () {
                        This.showPlaceHolder();
                    });;
                });
            }
        },

        /**
         *初始化默认提示文本
         *@inner
         */
        initPlaceHolder: function () {
            var This = this;
            var el = this.$el.find(".PlaceHolder");
            el.html(this.options.placeHolder);
            el.click(function () {
                This.editor.focus();
            });
            this.showPlaceHolder();
            this.editor.on("setcontent", function () {
                This.showPlaceHolder();
            });
        },

        /**
         *显示默认提示文本
         *@inner
         */
        showPlaceHolder:function(){
            var el = this.$el.find(".PlaceHolder");
            var text = $(this.editor.editorDocument.body).text();
            if (text == "") {
                el.show();
            } else {
                el.hide();
            }
        },

        /**
         *在编辑器上方显示小提示，3秒消失
         */
        showErrorTips: function (msg) {
            clearTimeout(this.errorTipHideTimer);
            var el = this.$el.find(".ErrorTipContent").html(msg).parent();
            el.show();
            this.errorTipHideTimer = setTimeout(function () {
                el.hide();
            },3000);
        },

        /**
         *检测输入值是否超出最大长度限制
         *@inner
         */
        testInputLength: function () {
            var This = this;
            clearTimeout(this.testInputTimer);
            this.testInputTimer = setTimeout(function () {
                var content = This.editor.getHtmlContent();
                var length = M139.Text.Utils.getBytes(content);
                if (length > This.options.maxLength) {
                    This.showErrorTips(This.options.maxLengthErrorTip);
                    M139.Dom.flashElement(This.el);
                }
            }, 500);
        },

        /**
         *显示菜单
         *@param {Object} options 配置参数集
         *@param {String} options.name 菜单名
         *@param {HTMLElement} options.dockElement 停靠的按钮元素
        */
        showMenu: function (options) {
            var This = this;
            this.editor.editorWindow.focus();
            var menu = this.menus[options.name];

            if ($.isFunction(menu.view)) {
                menu.view = menu.view();
                menu.view.on("select", function (e) {
                    menu.callback(This.editor, e);
                });
            }
            menu.view.editorView = this;
            menu.view.render().show(options);

            this.trigger("menushow", {
                name: name
            });
        },

        /**
         *双击按钮
         *@inner
         */
        onButtonDblClick:function(button, e, buttonOptions){
            if (buttonOptions.dblClick){
                buttonOptions.dblClick(this.editor);
            }
        },

        /**@inner*/
        onButtonClick: function (button, e, buttonOptions) {
            //点击色块，直接设置字体颜色，硬编码
            var target = M139.Dom.findParent(e.target, "span") || e.target;
            if (target.id == "ED_SetFontColor") {
                this.editor.setForeColor($(target).find("span").css("background-color"));
                return;
            } else if (target.id == "ED_SetBackgroundColor") {
                this.editor.setBackgroundColor($(target).find("span").css("background-color"));
                return;
            }
            if (buttonOptions.menu) {
                this.showMenu({
                    name: buttonOptions.menu,
                    dockElement: button
                });
            }
            if (buttonOptions.command) {
                this.editor[buttonOptions.command]();
            }


            var btn = M139.Dom.findParent(e.target,"a");
            var command = "";
            if(btn.id){
                command = btn.id.replace("ED_","");
            }

            this.trigger("buttonclick", {
                event: e,
                command:command,
                target: button,
                options: buttonOptions
            });
        },

        /**
         *点击显示更多按钮
         *@inner
         */
        onShowMoreClick: function () {
	        if(this.flashLoaded === undefined) {
		        var node = document.getElementById("flashplayer");
		        var isFlashUpload = !!(supportUploadType.isSupportFlashUpload && node);
		        if(isFlashUpload && this.$("#avflashupload").length == 0){
			        node = node.cloneNode(true);
			        node.setAttribute("id", "avflashupload");
			        this.$(".EditorBarMore").append($("<div></div>").css({
				        position: "absolute",
				        left: $("#ED_Video").position().left + 1 + "px",
				        top: "29px",
				        width: "45px",
				        height: "23px",
				        opacity: 0
			        }).append(node));
		        }
		        this.flashLoaded = isFlashUpload;
	        }
            this.toggleToolBar();
        },

        /**显示/隐藏第二排非常用按钮*/
        toggleToolBar: function () {
            var title = "";
            var editorBody = this.$(".eidt-body");

            if (this.$(".eidt-body").hasClass("eidt-body-full")) {
                title = "隐藏更多操作";
            	editorBody.removeClass("eidt-body-full");
                editorBody.css("height", "+=27");
        	} else {
	        	title = "更多操作";
            	editorBody.addClass("eidt-body-full");
                editorBody.css("height", "-=27");
            }
            this.$("a[bh='compose_editor_more']").attr("title", title);
        }
    })
    )


    var DefaultStyle = {
        //常用按钮容器
        toolBarPath_Common: "div.EditorBarCommon",
        //非常用按钮容器
        toolBarPath_More: "div.EditorBarMore",
        //更多按钮
        showMoreButton: "a.ShowMoreMenu",

        //会话邮件工具按钮  
        toolBarPath_Session: "div.tips-covfont .tips-text",

		//常用按钮集合（第一排）
		buttons_Common: [
			{
				name: "FontFamily",
				menu: "FontFamily_Menu",
				template: ['<a bh="compose_editor_fontfamily" title="设置字体" class="edit-btn" id="ED_FontFamily" href="javascript:;">',
								'<span class="edit-btn-rc">',
									'<b class="ico-edit ico-edit-ff">字体</b>',
								'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//显示选中文字的字体  此功能暂时屏蔽
						//e.element.find("span").text(e.selectedStyle.fontFamily.split(",")[0].replace(/'/g, ""));
					}
				}
			},
			{
				name: "FontSize",
				menu: "FontSize_Menu",
				template: ['<a bh="compose_editor_fontsize" title="设置字号" class="edit-btn" id="ED_FontSize" href="javascript:;">',
								'<span class="edit-btn-rc">',
									'<b class="ico-edit ico-edit-fsi">字号</b>',
								'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//显示选中文字的字体 此功能暂时屏蔽
						//e.element.find("span").text(e.selectedStyle.fontSizeText);
					}
				}
			},
			{
				name: "Bold",
				command: "setBold",
				template: ['<a bh="compose_editor_bold" title="文字加粗" href="javascript:;" class="edit-btn" id="ED_Bold">',
								'<span class="edit-btn-rc">',
									'<b class="ico-edit ico-edit-b">粗体</b>',
								'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//选中加上edit-btn-on
						e.selectedStyle.isBold ? e.element.addClass("edit-btn-on") : e.element.removeClass("edit-btn-on");
					}
				}
			},
			//加粗
			{
				name: "Italic",
				command: "setItalic",
				template: ['<a bh="compose_editor_italic" title="斜体字" href="javascript:;" class="edit-btn" id="ED_Italic">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-i">斜体</b>',
							'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//选中加上edit-btn-on
						e.selectedStyle.isItalic ? e.element.addClass("edit-btn-on") : e.element.removeClass("edit-btn-on");
					}
				}
			},
			//下划线
			{
				name: "UnderLine",
				command: "setUnderline",
				template: ['<a bh="compose_editor_underline" title="下划线" href="javascript:;" class="edit-btn" id="ED_UnderLine">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-ud">下划线</b>',
							'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//选中加上edit-btn-on
						e.selectedStyle.isUnderLine ? e.element.addClass("edit-btn-on") : e.element.removeClass("edit-btn-on");
					}
				}
			},
			{
				name: "FontColor",
				menu: "FontColor_Menu",
				template: ['<a bh="compose_editor_color" title="文字颜色" hideFocus="1" href="javascript:;" class="edit-btn editor-btn-select p_relative " id="ED_FontColor">',
		 						'<span class="edit-btn-rc" id="ED_SetFontColor">',
		 							'<b class="ico-edit ico-edit-color">文字颜色</b>',
		 							'<span class="ico-edit-color-span" style="background-color:rgb(255,0,0);"></span>',
		 						'</span>',
		 						'<span bh="compose_editor_color_select" class="ico-edit-color-xl"></span>',
		 					'</a>'].join("")
			},
			{ isLine: 1, template: '<span class="line"></span>' },
			{
				name: "AlignLeft",
				command: "setAlignLeft",
				template: ['<a bh="compose_editor_align_left" title="左对齐" href="javascript:;" class="edit-btn" id="ED_AlignLeft">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-alil">左对齐</b>',
							'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//选中加上edit-btn-on
						e.selectedStyle.isAlignLeft ? e.element.addClass("edit-btn-on") : e.element.removeClass("edit-btn-on");
					}
				}
			},
			{
				name: "AlignCenter",
				command: "setAlignCenter",
				template: ['<a bh="compose_editor_align_middle" title="居中对齐" href="javascript:;" class="edit-btn" id="ED_AlignCenter">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-aliz" id="ED_AlignCenter">居中对齐</b>',
							'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//选中加上edit-btn-on
						e.selectedStyle.isAlignCenter ? e.element.addClass("edit-btn-on") : e.element.removeClass("edit-btn-on");
					}
				}
			},
			{
				name: "AlignRight",
				command: "setAlignRight",
				template: ['<a bh="compose_editor_align_right" title="右对齐" href="javascript:;" class="edit-btn" id="ED_AlignRight">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-alir">右对齐</b>',
							'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//选中加上edit-btn-on
						e.selectedStyle.isAlignRight ? e.element.addClass("edit-btn-on") : e.element.removeClass("edit-btn-on");
					}
				}
			},
			{
				name: "UnorderedList",
				command: "insertUnorderedList",
				template: ['<a bh="compose_editor_ul" title="插入项目编号" href="javascript:;" class="edit-btn" id="ED_UnorderedList">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-xl">项目编号</b>',
							'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//选中加上edit-btn-on
						e.selectedStyle.isUnorderedList ? e.element.addClass("edit-btn-on") : e.element.removeClass("edit-btn-on");
					}
				}
			},
			{
				name: "OrderedList",
				command: "insertOrderedList",
				template: ['<a bh="compose_editor_ol" title="插入数字编号" href="javascript:;" class="edit-btn" id="ED_OrderedList">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-xl2">数字编号</b>',
							'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//选中加上edit-btn-on
						e.selectedStyle.isOrderedList ? e.element.addClass("edit-btn-on") : e.element.removeClass("edit-btn-on");
					}
				}
			},
			{ isLine: 1, template: '<span class="line"></span>' },
			{
				name: "Undo",
				command: "undo",
				template: ['<a bh="compose_editor_undo" title="撤消" href="javascript:;" class="edit-btn" id="ED_Undo">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-cx">撤消</b>',
							'</span>',
							'</a>'].join("")
			},
			{
				name: "FormatPrinter",
				command: "setFormatPrinter",
				dblClick:function(editor){
					editor.setFormatPrinterOn(1);
				},
				template: ['<a bh="compose_editor_printer" title="格式刷" href="javascript:;" class="edit-btn" id="ED_FormatPrinter">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-bush">格式刷</b>',
							'</span>',
							'</a>'].join(""),
				init: function (e) {
					e.editor.on("change:printerMode",function(){
						e.editor.get("printerMode") !="off" ? e.element.addClass("edit-btn-on") : e.element.removeClass("edit-btn-on");
					});
				}
			},
			{ isLine: 1, template: '<span class="line"></span>' },
			/*{
				name: "InsertImage",
				menu: "InsertImage_Menu",
				template: ['<a bh="compose_editor_image" title="插入图片" href="javascript:;" class="edit-btn" id="ED_InsertImage">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-pic">图片</b>',
							'</span>',
							'</a>'].join("")
			},
			{
				//啥事没做 外部通过buttonclick事件监听
				name: "ScreenShot",
				template: ['<a bh="compose_editor_screenshot" title="截屏" href="javascript:;" class="edit-btn" id="ED_ScreenShot">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-scr">截屏</b>',
							'</span>',
							'</a>'].join("")
			},*/
			{
				name: "Face",
				menu: "Face_Menu",
				template: ['<a bh="compose_editor_face" title="插入表情" href="javascript:;" class="edit-btn" id="ED_Face">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-smile">表情</b>',
							'</span>',
							'</a>'].join("")
			}/*,
			{
				name: "Preview",
				command: "preview",
				template: ['<a bh="compose_preview" title="预览" href="javascript:;" class="edit-btn" id="ED_Preview">',
					'<span class="edit-btn-rc">',
						'<b class="ico-edit ico-edit-preview">预览</b>',
					'</span>',
					'</a>'].join("")
			},
			{
				name: "Template",
				command: "Template_Menu",
				template: ['<a bh="compose_insert_template" title="使用模板" href="javascript:;" class="edit-btn" id="ED_Template">',
					'<span class="edit-btn-rc">',
						'<b class="ico-edit ico-edit-table">模板</b>',
					'</span>',
					'</a>'].join("")
			}*/
		],

		//非常用按钮集合（第二排）
		buttons_More: [
			{
				name: "strikeThrough",
				command: "strikeThrough",
				template: ['<a bh="compose_strike" title="删除线" href="javascript:;" class="edit-btn" id="ED_Delete">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-delLine">删除线</b>',
							'</span>',
							'</a>'].join("")
			},
			{
				name: "BackgroundColor",
				menu: "BackgroundColor_Menu",
				template: ['<a bh="compose_editor_bgcolor" title="背景颜色" hideFocus="1" href="javascript:;" class="edit-btn editor-btn-select p_relative " id="ED_BackgroundColor">',
		 					'<span class="edit-btn-rc" id="ED_SetBackgroundColor">',
								'<b class="ico-edit ico-edit-color ico-editbg-color">背景颜色</b>',
								'<span class="ico-edit-color-span ico-editbg-color-span" style="background-color:rgb(192,192,192);"></span>',
							'</span>',
							'<span bh="compose_editor_bgcolor_select" class="ico-edit-color-xl"></span>',
							'</a>'].join("")
			},
			{
				name: "RemoveFormat",
				command: "removeFormat",
				template: ['<a bh="compose_remove_format" title="清除格式" href="javascript:;" class="edit-btn" id="ED_RemoveFormat">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-delFormat">清除格式</b>',
							'</span>',
							'</a>'].join("")
			},
			{ isLine: 1, template: '<span class="line lineBottom" style="margin-left:80px;"></span>' },
			{
				name: "Outdent",
				command: "setOutdent",
				template: ['<a bh="compose_editor_indent" title="减少缩进" href="javascript:;" class="edit-btn" id="ED_Outdent">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-jdsj">减少缩进</b>',
							'</span>',
							'</a>'].join("")
			},
			{
				name: "Indent",
				command: "setIndent",
				template: ['<a bh="compose_editor_outdent" title="增加缩进" href="javascript:;" class="edit-btn" id="ED_Indent">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-addsj">增加缩进</b>',
							'</span>',
							'</a>'].join("")
			},
			{
				name: "RowSpace",
				menu: "RowSpace_Menu",
				template: ['<a bh="compose_editor_lineheight" title="设置行距" href="javascript:;" class="edit-btn" id="ED_RowSpace">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-sxali">行距</b>',
							'</span>',
							'</a>'].join("")
			},
			{
				name: "Table",
				menu: "Table_Menu",
				template: ['<a bh="compose_editor_table" title="插入表格" href="javascript:;" class="edit-btn" id="ED_Table">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-tab">表格</b>',
							'</span>',
							'</a>'].join("")
			},
			{ isLine: 1, template: '<span class="line lineBottom" style="margin-left:26px;"></span>' },
			{
				name: "Redo",
				command: "redo",
				template: ['<a bh="compose_editor_redo" title="恢复撤销的操作" href="javascript:;" class="edit-btn" id="ED_Redo">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-hf">恢复</b>',
							'</span>',
							'</a>'].join("")
			},
			{
				name: "SelectAll",
				command: "selectAll",
				template: ['<a bh="compose_select_all" title="全选" href="javascript:;" class="edit-btn" id="ED_SelectAll">',
					'<span class="edit-btn-rc">',
						'<b class="ico-edit ico-edit-allSeled">全选</b>',
					'</span>',
					'</a>'].join("")
			},
			{ isLine: 1, template: '<span class="line lineBottom"></span>' },
			{
				name: "Link",
				menu: "Link_Menu",
				template: ['<a bh="compose_editor_link" title="插入链接" href="javascript:;" class="edit-btn" id="ED_Link">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-link">链接</b>',
							'</span>',
							'</a>'].join("")
			},
			{
				name: "Voice",
				template: ['<a bh="compose_editor_voice" title="语音识别" href="javascript:;" class="edit-btn" id="ED_Voice">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-voice">语音</b>',
							'</span>',
							'</a>'].join("")
			},
			{
				name: "InsertVideo",
				command: "uploadInsertVideo",
				template: ['<a bh="compose_insert_video" title="将mp4/flv格式的视频文件插入到邮件正文" href="javascript:;" class="edit-btn" id="ED_Video">',
					'<span class="edit-btn-rc">',
						'<b class="ico-edit ico-edit-picture">视频</b>',
					'</span>',
					'</a>'].join("")
			},
			{
				name: "InsertAudio",
				command: "uploadInsertAudio",
				template: ['<a bh="compose_insert_audio" title="将mp3格式的音频文件插入邮件正文" href="javascript:;" class="edit-btn" id="ED_Audio">',
					'<span class="edit-btn-rc">',
						'<b class="ico-edit ico-edit-music">音乐</b>',
					'</span>',
					'</a>'].join("")
			}/*,
			{
				name: "InsertText",
				command: "uploadInsertDocument",
				template: ['<a bh="compose_insert_doc" title="支持word、xls、ppt、pdf格式的文件插入到邮件正文" href="javascript:;" class="edit-btn" id="ED_Preview">',
					'<span class="edit-btn-rc">',
						'<b class="ico-edit ico-edit-text">文档</b>',
					'</span>',
					'</a>'].join("")
			}*/
		],

        //菜单集合
        menus: function () {
            return [
                //字体
                {
                    name: "FontFamily_Menu",
                    view: function () { return new M2012.UI.HTMLEditor.View.FaceFamilyMenu() },
                    callback: function (editor, selectValue) {
                        editor.setFontFamily(selectValue.value);
                    }
                },
                //字号
                {
                    name: "FontSize_Menu",
                    view: function () { return new M2012.UI.HTMLEditor.View.FaceSizeMenu() },
                    callback: function (editor, selectValue) {
                        editor.setFontSize(selectValue.value);
                    }
                },
                //字体颜色
                {
                    name: "FontColor_Menu",
                    view: function () { return new M2012.UI.HTMLEditor.View.ColorMenu() },
                    callback: function (editor, selectValue) {
                        editor.setForeColor(selectValue.value);
                    }
                },
                //背景颜色
                {
                    name: "BackgroundColor_Menu",
                    view: function () { return new M2012.UI.HTMLEditor.View.ColorMenu({ isBackgroundColor: true }) },
                    callback: function (editor, selectValue) {
                        editor.setBackgroundColor(selectValue.value);
                    }
                },
                //插入表格
                {
                    name: "Table_Menu",
                    view: function () { return new M2012.UI.HTMLEditor.View.TableMenu() },
                    callback: function (editor, selectValue) {
                        editor.insertTable(selectValue.value);
                    }
                },
                //设置行距
                {
                    name: "RowSpace_Menu",
                    view: function () { return new M2012.UI.HTMLEditor.View.RowSpaceMenu() },
                    callback: function (editor, selectValue) {
                        editor.setRowSpace(selectValue.value);
                    }
                },
                //插入链接
                {
                    name: "Link_Menu",
                    view: function () { return new M2012.UI.HTMLEditor.View.LinkMenu() },
                    callback: function (editor, e) {
                        editor.editorWindow.focus();
                        if (e.text.trim() == "") {
                            $Msg.alert("请输入链接文本", { icon: "fail" });
                        } else {
                            if ($B.is.ie || $B.is.firefox) {
                                editor.insertHTML(M139.Text.Utils.format('<a href="{url}">{text}</a>', {
                                    url: e.url,
                                    text: M139.Text.Html.encode(e.text)
                                }));
                            } else {
                                editor.setLink(e.url);
                                if (editor.getSelectedText() != e.text) {
                                    try {
                                        var el = editor.getSelectedElement();
                                        $(el).text(e.text);
                                    } catch (e) { }
                                }
                            }
                        }
                    }
                },
                //插入图片
                {
                    name: "InsertImage_Menu",
                    view: function () { return new M2012.UI.HTMLEditor.View.ImageMenu() },
                    callback: function (editor, e) {
                        editor.insertImage(e.url);
                    }
                },
                //插入表情
                {
                    name: "Face_Menu",
                    view: function () { return new M2012.UI.HTMLEditor.View.FaceMenu() },
                    callback: function (editor, e) {
                        editor.insertImage(e.url);
                    }
                }
            ]
        },

		//编辑器整体html结构
		template: ['<div class="editorWrap">',
			'<div class="tips write-tips ErrorTip" style="left: 0px; top: -32px; display:none;">',
				'<div class="tips-text ErrorTipContent" style=""></div>',
				'<div class="tipsBottom diamond" style=""></div>',
			'</div>',
			'<div style="position:absolute;width:100%;">',
				'<div class="PlaceHolder" unselectable="on" style="position: absolute;left: 10px;top: 35px;color:silver;z-index:50;font-size:16px;display:none;width:100%;"></div>',
			'</div>',
			'<div class="eidt-body"><!-- eidt-body-full 展开时加上 -->',
				'<div class="eidt-bar">',
					'<a bh="compose_editor_more" hidefocus="1" href="javascript:;" title="更多操作" class="pushon ShowMoreMenu"></a>',
					'<div class="EditorBarCommon eidt-bar-li"></div>',
					'<div class="EditorBarMore eidt-bar-li"></div>',
				'</div>',
				'<div class="eidt-content"><iframe hidefocus="1" src="{blankUrl}" frameborder="0" style="height:100%;border:0;width:100%;"></iframe></div>',
				//右下角的东东
				'<a hidefocus="1" style="display:none" href="javascript:void(0)" class="stationery"></a>',
			'</div>',
		'</div>'].join("")
    };


    /**
     *HTML编辑器命名空间
     *@namespace
     *@name M2012.UI.HTMLEditor
     */
    M139.namespace("M2012.UI.HTMLEditor", {});


    jQuery.extend(M2012.UI.HTMLEditor,
     /**
      *@lends M2012.UI.HTMLEditor
      */
    {
        /**
        *创建一个编辑器实例
        *@param {Object} options 参数集合
        *@param {HTMLElement} options.contaier 可选参数，父元素，默认是添加到body中
        *@param {String} options.blankUrl 编辑区空白页的地址
        *@param {Array} options.hideButton 不显示的编辑按钮
        *@param {Array} options.showButton 显示的编辑按钮
        *@param {Array} options.combineButton 会话模式显示的编辑按钮
        *@param {String} options.userDefined 自定义的常用按钮路径
        *@param {String} options.userDefinedToolBarContainer 自定义的编辑按钮容器
        *@param {String} options.editorBtnMenuDirection 编辑按钮菜单的方向 up/down
        *@param {String} options.editorBtnMenuHeight 编辑按钮菜单的高度
        *@param {Number} options.maxLength 限制最大输入值，超过的时候编辑器会提示
        *@returns {M2012.UI.HTMLEditor.View.Editor} 返回编辑器控件实例
        *@example
        var editorView = M2012.UI.HTMLEditor.create({
            contaier:document.getElementById("myDiv"),
            blankUrl:"html/editor_blank.htm"
        });

        editorView.editor.setHtmlContent("hello world");

        */
        create: function (options) {
            if ($(options.contaier)[0].ownerDocument != document) {
                this.setWindow(window.parent);//解决在top窗口创建编辑器的问题
            }
            //要隐藏的按钮
            if (options.hideButton) {
                $(options.hideButton).each(function (index,menuName) {
                    for (var i = 0; i < DefaultStyle.buttons_Common.length; i++) {
                        var name = DefaultStyle.buttons_Common[i].name;
                        if (name == menuName || name == menuName + "_Menu") {
                            DefaultStyle.buttons_Common.splice(i, 1);
                            i--;
                        }
                    }
                });
            } else if (options.showButton) {
                var showButtons = [];
                $(options.showButton).each(function (index, menuName) {
                    for (var i = 0; i < DefaultStyle.buttons_Common.length; i++) {
                        var name = DefaultStyle.buttons_Common[i].name;
                        if (name == menuName || name == menuName + "_Menu") {
                            showButtons.push(DefaultStyle.buttons_Common[i]);
                        }
                    }
                });
                DefaultStyle.buttons_Common = showButtons;
                if(!options.showMoreButton){
                    DefaultStyle.buttons_More = null;
                }
            } else if (options.combineButton) {
                var showButtons = [];
                var combineButtons = DefaultStyle.buttons_Common.concat( DefaultStyle.buttons_More );
                $(options.combineButton).each(function (index, menuName) {
                    for (var i = 0; i < combineButtons.length; i++) {
                        var name = combineButtons[i].name;
                        if (name == menuName || name == menuName + "_Menu") {
                            showButtons.push(combineButtons[i]);
                        }
                    }
                });
                DefaultStyle.buttons_Common = showButtons;
                DefaultStyle.toolBarPath_Common = DefaultStyle.toolBarPath_Session;
                DefaultStyle.buttons_More = null;
            }
            
            if(options.userDefinedToolBarContainer){
                DefaultStyle.toolBarPath_Common = options.userDefinedToolBarContainer;
            }

            var view = new M2012.UI.HTMLEditor.View.Editor({
                template: DefaultStyle.template,
                buttons_Common: DefaultStyle.buttons_Common,
                toolBarPath_Common: DefaultStyle.toolBarPath_Common,
                buttons_More: DefaultStyle.buttons_More,
                toolBarPath_More: DefaultStyle.toolBarPath_More,
                menus: DefaultStyle.menus,
                showMoreButton: DefaultStyle.showMoreButton,
                blankUrl: options.blankUrl,
                maxLength: options.maxLength, //最大输入内容值
                maxLengthErrorTip: options.maxLengthErrorTip || "超过最大输入限制：" + options.maxLength + "字节",
                placeHolder: options.placeHolder,
                isSessionMenu: options.combineButton ? true : false,
                isUserDefineBtnContaier: options.userDefinedToolBarContainer ? true : false,
                editorBtnMenuDirection: options.editorBtnMenuDirection,
                isShowSetDefaultFont: options.isShowSetDefaultFont || false
            });
            view.render();
            options.contaier.html(view.$el);
            options.combineButton && $("a.ShowMoreMenu").hide();
            
            if(options.userDefinedToolBarContainer){
                view.$el.find('div.eidt-bar').remove();
            }

            return view;
        },
        /** 解决在非当前窗口创建编辑器的问题
        */
        setWindow: function (window) {
            jQuery = window.jQuery;
            document = window.document;
            M2012.UI.HTMLEditor.View.Menu.setWindow(window);
        }
    });

})(jQuery, _, M139);
﻿/*global Backbone: false */

/**
  * @fileOverview 定义通讯录数据实体类
  */

(function (jQuery,_,M139){
    var $ = jQuery;
    var inM2012 = false;
    /**通讯录数据实体
    *@constructs M2012.Contacts.ContactsInfo
    */
    function ContactsInfo(options) {
        for (var p in options) {
            this[p] = options[p] || "";
        }
        var emails = this.emails = [];
        var mobiles = this.mobiles = [];
        var faxes = this.faxes = [];
        if (!this.name) this.name = (this.AddrFirstName || "") + (this.AddrSecondName || "");
        this.lowerName = this.name.toLowerCase();
        if (this.FamilyEmail) emails.push(this.FamilyEmail);
        if (this.OtherEmail) emails.push(this.OtherEmail);
        if (this.BusinessEmail) emails.push(this.BusinessEmail);

        if (this.MobilePhone) mobiles.push(this.MobilePhone);
        if (this.OtherMobilePhone) mobiles.push(this.OtherMobilePhone);
        if (this.BusinessMobile) mobiles.push(this.BusinessMobile);

        if (this.OtherFax) faxes.push(this.OtherFax);
        if (this.FamilyFax) faxes.push(this.FamilyFax);
        if (this.BusinessFax) faxes.push(this.BusinessFax);
        if (!inM2012) {
            inM2012 = Boolean(top.$App);
        }
        if (inM2012) {
            this.fixPhoto();
        }
    }
    var defPhoto;
    var sysImgPath = ["/upload/photo/system/nopic.jpg", "/upload/photo/nopic.jpg"];
    var baseUrl;
    ContactsInfo.prototype =
        /**
        *@lends M2012.Contacts.ContactsInfo.prototype
        */
    {
        getMobileSendText: function () {
            var n = this.getFirstMobile();
            n = n && n.replace(/\D/g, "");
            if (!n) return "";
            var name = this.name.replace(/"/g, "");
            return "\"" + name + "\"<" + n + ">";
        },
        getEmailSendText: function () {
            var e = this.getFirstEmail();
            if (!e) return "";
            var name = this.name.replace(/"/g, "");
            return "\"" + name + "\"<" + e + ">";
        },
        getFaxSendText: function () {
            var e = this.getFirstFax();
            if (!e) return "";
            var name = this.name.replace(/"/g, "");
            return "\"" + name + "\"<" + e + ">";
        },
        getFirstEmail: function () {
            if (this.emails && this.emails[0]) return this.emails[0];
            return "";
        },
        getFirstMobile: function () {
            if (this.mobiles && this.mobiles[0]) return this.mobiles[0];
            return "";
        },
        getFirstFax: function () {
            if (this.faxes && this.faxes[0]) return this.faxes[0];
            return "";
        },
        /**
         *模糊搜索
         */
        match: function (keyword) {
            return [
            this.name,
            this.BusinessEmail,
            this.BusinessFax,
            this.BusinessMobile,
            this.CPName,
            this.FamilyEmail,
            this.FamilyFax,
            this.FirstNameword,
            this.Jianpin,
            this.MobilePhone,
            this.OtherEmail,
            this.OtherFax,
            this.OtherMobilePhone,
            this.Quanpin,
            this.UserJob].join("").toLowerCase().indexOf(keyword) > -1;
        },
        fixPhoto: function () {
            if (this.ImagePath) return;
            if (!defPhoto) {
                defPhoto = $App.getResourcePath() + "/images/face.png";
				/*不再用g2的域名访问地址
                baseUrl = M139.Text.Url.makeUrl(getDomain("webmail") + "/addr/apiserver/httpimgload.ashx", {
                    sid: $App.getSid()
                });
				*/
				//
				function getPhotoUploadedAddr() {
						var tmpurl = location.host;
						var url2 = "";
						if (tmpurl.indexOf("10086.cn") > -1 && top.$User.isGrayUser()) {
							url2 = "http://image0.139cm.com";
						} else if(tmpurl.indexOf("10086.cn") > -1 && !top.$User.isGrayUser()) {
							url2 = "http://images.139cm.com";
						} else if (tmpurl.indexOf("10086ts") > -1) {
							url2 = "http://g2.mail.10086ts.cn";
						}else if(tmpurl.indexOf("10086rd") > -1){
							url2 = "http://static.rd139cm.com";
						}
						return url2 ;
				}
				baseUrl = getPhotoUploadedAddr()
            }
            if (this.ImageUrl) {
                if (this.ImageUrl.indexOf("http://") == 0) {
                    return;
                }
                this.ImagePath = this.ImageUrl;
            //  var path = this.ImagePath.toLowerCase(); 不能转大小写
				var path = this.ImagePath;
                if (path == sysImgPath[0] || path == sysImgPath[1] || path == "") {
                    this.ImageUrl = defPhoto;
                }else{
                //    this.ImageUrl = baseUrl + "&path=" + encodeURIComponent(path);不需要编码
					this.ImageUrl = baseUrl + path + "?rd=" + Math.random();
                }
            } else {
                this.ImageUrl = defPhoto;
                this.ImagePath = "/upload/photo/nopic.jpg";
            }
        }
    }
    M139.namespace("M2012.Contacts.ContactsInfo", ContactsInfo);



})(jQuery,_,M139);
/**
 * 邮箱工具类
 */
MailTool = {
    /**
    * 验证邮箱地址是否合法
    * <pre>示例：<br>
    * MailTool.checkEmail('account@139.com');
    * </pre>
    * @param {string} text 验证的邮箱地址字符串
    * @return {Boolean}
    */
    checkEmail: function (text) {
        if (typeof text != "string") return false;
        text = $.trim(text);
        //RFC 2822
        var reg = new RegExp("^[a-z0-9\.!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$", "i");
        var result = reg.test(text);
        return result;
    },
    /**
    * 验证邮箱地址是否合法(另一种形式)
    * <pre>示例：<br>
    * MailTool.checkEmailText('"人名"&lt;account@139.com&gt;');
    * </pre>
    * @param {string} text 验证的邮箱地址字符串，如："人名"&lt;account@139.com&gt;
    * @return {Boolean}
    */
    checkEmailText: function (text) {//单个
        if (typeof text != "string") return false;
        text = $.trim(text);
        //无签名邮件地址
        if (this.checkEmail(text)) {
            return true;
        }
        //完整格式
        var r1 = new RegExp('^(?:"[^"]*"\\s?|[^<>;,，；"]*)<([^<>\\s]+)>$');
        var match = text.match(r1);
        if (match) {
            if (this.checkEmail(match[1])) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    },
    /**
    * 得到邮箱地址字符中的域名部分。
    * <pre>示例：<br>
    * MailTool.getDomain('account@domain.com');<br>rusult is "domain.com"
    * </pre>
    * @param {string} email 邮件地址字符串
    * @return {域字符串}
    */
    getDomain: function (email) {
        if (typeof email != "string") return "";
        email = $.trim(email);
        if (this.checkEmail(email)) {
            return email.split("@")[1].toLowerCase();
        } else if (this.checkEmailText(email)) {
            return email.match(/@([^@]+)>$/)[1].toLowerCase();
        } else {
            return "";
        }
    },
    /**
    * 返回邮箱地址的前缀部分。
    * <pre>示例：<br>
    * MailTool.getAccount('account@domain.com');<br>rusult is "account"
    * </pre>
    * @param {string} email 邮箱地址字符串
    * @return {邮箱前缀字符串}
    */
    getAccount: function (email) {
        if (typeof email != "string") return "";
        email = $.trim(email);
        if (this.checkEmail(email)) {
            return email.split("@")[0];
        } else if (this.checkEmailText(email)) {
            return email.match(/<([^@<>]+)@[^@<>]+>$/)[1];
        } else {
            return "";
        }
    },
    /**
    * 得到人名+邮箱中的人名部分。
    * <pre>示例1：<br>
    * <br>MailTool.getName('"人名"&lt;account@domain.com&gt;');<br>
    * rusult is "人名"<br>
    * <br>示例2：<br>
    * <br>MailTool.getName('account@domain.com');<br>
    * rusult is "account"
    * </pre>
    * @param {string} email 复合邮箱地址。
    * @return {人名部分字符串}
    */
    getName: function (email) {
        if (typeof email != "string") return "";
        email = $.trim(email);
        if (this.checkEmail(email)) {
            return email.split("@")[0];
        } else if (this.checkEmailText(email)) {
            var name = email.replace(/<[^@<>]+@[^@<>]+>$/, "");
            name = $.trim(name.replace(/"/g, ""));
            if (name == "") return MailTool.getAccount(email);
            return name;
        } else {
            return "";
        }
    },
    /**
    * 得到邮箱地址
    * <pre>示例：<br>
    * MailTool.getAddr('"人名"&lt;account@139.com&gt;');<br>
    * rusult is "account@139.com";
    * </pre>
    * @param {string} email 邮箱地址，如："人名"&lt;account@139.com&gt;。
    * @return {邮箱地址字符串}
    */
    getAddr: function (email) {
        if (MailTool.checkEmailText(email)) {
            return MailTool.getAccount(email) + "@" + MailTool.getDomain(email);
        }
        return "";
    },
    /**
    * 比对2个邮件地址是否相同
    * <pre>示例：<br>
    * MailTool.compareEmail(emailaddr1,emailaddr2);
    * </pre>
    * @param {string} mail1 邮箱1
    * @param {string} mail2 邮箱2
    * @return {Boolean}
    */
    compareEmail: function (mail1, mail2) {
        var m1 = MailTool.getAddr(mail1).toLowerCase();
        if (m1 && m1 == MailTool.getAddr(mail2).toLowerCase()) {
            return true;
        }
        return false;
    },
    /**
    * 验证多种形式的邮箱地址。
    * <pre>示例：<br>MailTool.parse('"人名"&lt;account@139.com&gt;;account@139.com;account@139.com');</pre>
    * @param {Object} mailText 邮箱地址字符串，如："人名"&lt;account@139.com&gt;;account@139.com;account@139.com
    * @return {Boolean}
    */
    parse: function (mailText) {
        var result = {};
        result.error = "";
        if (typeof mailText != "string") {
            result.error = "参数不合法";
            return result;
        }
        /*
        简单方式处理,不覆盖签名里包含分隔符的情况
        */
        var lines = mailText.split(/[;,，；]/);
        var resultList = result.emails = [];
        for (var i = 0; i < lines.length; i++) {
            var text = $.trim(lines[i]);
            if (text == "") continue;
            if (this.checkEmail(text)) {
                resultList.push(text);
            } else if (this.checkEmailText(text)) {
                resultList.push(text);
            } else {
                result.error = "邮件地址不合法:“" + text + "”";
            }
        }
        if (!result.error) {
            result.success = true;
        } else {
            result.success = false;
        }
        return result;
    },
    /**
    * 验证邮箱地址是否是139邮箱。
    * <pre>示例：<br>
    * MailTool.is139Email('account@139.com');
    * </pre>
    * @param {Object} 邮箱地址字符串。
    * @return {Boolean}
    */
    is139Email: function (email) {
        var domain = this.getDomain(email);
        if (domain === (top.mailDomain || "139.com")) return true;
        return false;
    },
    /**
    * 验证邮箱地址是否是带手机号的139邮箱。
    */
    is139NumberEmail: function (email) {
        var is139 = this.is139Email(email);
        if (is139) {
            return /^\d{11}$/.test(this.getAccount(email));
        }
        return false;
    },
    /**
    * 格式化发件人地址，传入"name","account@domain.com",返回"name"<account@domain.com>
    * <pre>示例：<br>
    * MailTool.getSendText('李福拉','lifula@139.com');
    * @return {String}
    * </pre>
    */
    getSendText: function (name, addr) {
        if (!Utils.isString(name) || !Utils.isString(addr)) return "";
        return "\"" + name.replace(/[\s;,；，<>"]/g, " ") + "\"<" + addr.replace(/[\s;,；，<>"]/g, "") + ">";
    },
    /**
    * 智能分割以字符串形式存在的多个邮件地址
    * <pre>示例：<br>
    * MailTool.splitAddr('李福拉<lifula@139.com>;lifl@richinfo.cn');
    * @return {Array}
    * </pre>
    */
    splitAddr: function (text) {
        var list = text.split(/[,;；，]/);
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            //如果分割完了以后前后2个地址都存在一个双引号，说明是因为人名当中有分隔符，所以得前后2个值合并成一个
            //if (item.indexOf("\"") == 0 && item.lastIndexOf("\"") == 0) {
            if (item.indexOf("\"") > -1 && item.indexOf("\"") == item.lastIndexOf("\"")) {
                var nextItem = list[i + 1];
                if (nextItem && nextItem.indexOf("\"") == nextItem.lastIndexOf("\"")) {
                    list[i] = item + " " + nextItem;
                    list.splice(i + 1, 1);
                    i--;
                }
            }
        }
        return list;
    }
}
/**
 * 号码工具类
 */
NumberTool = {
    /**
    * 加86前缀
    * <pre>示例：<br>
    * NumberTool.add86(手机号码);
    * </pre>
    * @param {Object} number 号码字符串或数字。
    * @return {加86前缀的号码}
    */
    add86: function(number) {
        if (typeof number != "string") number = number.toString();
        return number.trim().replace(/^(?:86)?(?=\d{11}$)/, "86");
    },
    /**
    * 去86前缀
    * <pre>示例：<br>
    * NumberTool.add86(86手机号码);
    * </pre>
    * @param {Object} number 号码字符串或数字。
    * @return {去86前缀的号码}
    */
    remove86: function(number) {
        if (typeof number != "string") number = number.toString();
        return number.trim().replace(/^86(?=\d{11}$)/, "");
    },
    isChinaMobileNumber: function(num) {
        num = num.toString();
        if (num.length != 13 && num.length != 11) return false;
        if (num.length == 11) {
            num = "86" + num;
        }
        var reg = new RegExp(top.UserData.regex);
		return reg.test(num);
    },
    isChinaMobileNumberText: function(text) {
        if (/^\d+$/.test(text)) {
            return this.isChinaMobileNumber(text);
        }
        var reg = /^(?:"[^"]*"|[^"<>;,；，]*)\s*<(\d+)>$/;
        var match = text.match(reg);
        if (match) {
            var number = match[1];
            return this.isChinaMobileNumber(number);
        } else {
            return false;
        }
    },
    getName: function(numberText) {
        if (this.isChinaMobileNumberText(numberText)) {
            if (numberText.indexOf("<") == -1) {
                return "";
            } else {
                return numberText.replace(/<\d+>$/, "").replace(/^["']|["']$/g, "");
            }
        }
        return "";
    },
    getNumber: function(numberText) {
        if (this.isChinaMobileNumberText(numberText)) {
            if (numberText.indexOf("<") == -1) {
                return numberText;
            } else {
                var reg = /<(\d+)>$/;
                var match = numberText.match(reg);
                if (match) {
                    return match[1];
                } else {
                    return "";
                }
            }
        }
        return "";
    },
    compareNumber: function(m1, m2) {
        if ( typeof(m1) === "undefined" || typeof(m2) === "undefined" ) {
            return false
        }

        m1 = m1.toString();
        m2 = m2.toString();
        m1 = this.remove86(this.getNumber(m1));
        m2 = this.remove86(this.getNumber(m2));
        if (m1 && m1 == m2) return true;
        return false;
    },
    parse: function(inputText) {
        var result = {};
        result.error = "";
        if (typeof inputText != "string") {
            result.error = "参数不合法";
            return result;
        }
        /*
        简单方式处理,不覆盖签名里包含分隔符的情况
        */
        var lines = inputText.split(/[;,，；]/);
        var resultList = result.numbers = [];
        for (var i = 0; i < lines.length; i++) {
            var text = $.trim(lines[i]);
            if (text == "") continue;
            if (this.isChinaMobileNumberText(text)) {
                resultList.push(text);
            } else {
                result.error = "该号码不是正确的移动手机号码：“" + text + "”";
            }
        }
        if (!result.error) {
            result.success = true;
        } else {
            result.success = false;
        }
        return result;
    },
    getSendText: function (name, number) {
        if (!Utils.isString(name) || !Utils.isString(number)) return "";
        return "\"" + name.replace(/[\s;,；，<>"]/g, " ") + "\"<" + number.replace(/\D/g,"") + ">";
    }
}


var __DateTool = {
    //获得月份的天数，不传参数默认返回本月天数
    daysOfMonth: function(d) {
        if (!d) d = new Date();
        var isLeapYear = this.isLeapYear(d.getFullYear());
        return [31, (isLeapYear ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][d.getMonth()];
    },
    //年份是否闰年
    isLeapYear: function(y) {
        if (!y) y = new Date();
        if (y.getFullYear) y = y.getFullYear();
        return (y % 400 == 0 || (y % 4 == 0 && y % 100 != 0));
    },
    //获得星期几
    WEEKDAYS: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    getWeekDayText: function(d) {
        if (!d) d = new Date();
        return this.WEEKDAYS[d.getDay()];
    }
};
if(!window.DateTool){
    //防止命名冲突
    DateTool = __DateTool;
}


/**
 * 新的选择组带新建组的控件。
 * <pre>示例：<br>
 * var chkGroup = new GroupCheckbox($('#group')[0], document);
 * chkGroup.check(['556465','98989','65656']);
 * var groupid = chkGroup.check();
 * </pre>
 * @param {Object} parent 父容器
 * @param {string} context 上下文document
 * @return {Object}
 */
function GroupCheckbox(parent, context){
    if (!parent) return;
    context = context || document;
    parent.style.visibility="hidden";
    parent.innerHTML = '<ul class="group"></ul><a href="javascript:;"><i class="plus"></i>新建分组</a>';
    var container = parent.firstChild;

    var lbl = context.createElement("LABEL");
    var ele = context.createElement("INPUT");
    ele.type = "checkbox";
    lbl.appendChild(ele);
    lbl.appendChild(context.createTextNode(" "));
    ele = context.createElement("LI");
    ele.appendChild(lbl);
    lbl = null;

    var row2 = context.createElement("LI");
    row2.innerHTML = "<span>默认保存到 &quot;未分组&quot;</span>";
    container.appendChild(row2);

    var groups = top.Contacts.data.groups;
    for (var i = groups.length - 1, k=groups[i]; i >= 0; k=groups[--i]){
        var gid = "Chk_" + k.GroupId;
        row2 = ele.cloneNode(true); //li
        lbl = row2.firstChild; //label
        lbl['for'] = gid;
        lbl.replaceChild(context.createTextNode(k.GroupName), lbl.lastChild);

        lbl = lbl.firstChild; //input
        lbl.id = gid;
        lbl.value = k.GroupId;

        container.appendChild(row2);
    }
    ele = null; row2 = null; lbl = null;
    parent.style.visibility = "visible";

    //加下方的新建组
    var btnAdd = parent.lastChild;
    btnAdd.onclick = function(){
        var Contacts = top.Contacts;
        var frameworkMessage = top.frameworkMessage;
        var FF = top.FF;
        var txtGName = context.createElement('INPUT');
        var btnOk = context.createElement('A');
        var btnCanel = context.createElement('A');
        var tip = frameworkMessage.addGroupTitle;
    
        btnAdd.style.display = "none"; 
        txtGName.value = tip;
        txtGName.maxLength=16;
        txtGName.className = "text gp def";
        
        btnOk.href = "javascript:void(0)";
        btnCanel.href = "javascript:void(0)";
        btnCanel.style.marginLeft = ".5em";
        btnOk.innerHTML = "添加";
        btnCanel.innerHTML = "取消";
    
        txtGName.onfocus = function(){
            if(this.value==tip){
                this.value = "";
                this.className = "text gp";
            } else {
                this.select();
            }
        };
        txtGName.onblur = function(){
            if (this.value.length==0){
               this.value = tip;
               this.className = "text def gp";
            }
        };
    
        btnOk.onclick = function(){
            var gpName = txtGName.value;
            if (gpName.length>0 && gpName != tip) {
                var _this = this;
                Contacts.addGroup(gpName,function(result){
                    if(result.success){
                        var p = _this.parentNode;
                        var lst = p.getElementsByTagName('UL')[0];
                        var li = context.createElement('LI');
                        li.innerHTML = "<label for='Chk_" + result.groupId + "'><input id='Chk_" + result.groupId + "' value='" + result.groupId + "' type='checkbox' checked='checked' />" + htmlEncode(gpName) + "</label>";
                        lst.appendChild(li);
                        lst.scrollTop=lst.scrollHeight;
                        btnCanel.onclick();
                    }else{
                        FF.alert(result.msg);
                    }
                });
            }
        };
        
        btnCanel.onclick = function(){
            parent.removeChild(txtGName);
            parent.removeChild(btnOk);
            parent.removeChild(btnCanel);
            btnAdd.style.display = "inline";
        };
    
        parent.appendChild(txtGName);
        parent.appendChild(btnOk);
        parent.appendChild(btnCanel);
    }

    this.container = container;
    this.check = function(checkedGroup){
        var chks = this.container.getElementsByTagName("INPUT");
        if (checkedGroup) {
            each(chks, function(i){
                i.checked = contain(i.value)
            });
        } else {
            var buff = [];
            each(chks, function(i){
                i.checked && buff.push(i.value);
            })
            return buff;
        }
        function each(arr, callback){
            for (var j=0, m=arr.length; j<m; j++){
                callback(arr[j]);
            }
        }
        function contain(v){
            for (var j=0, m=chks.length; j<m; j++){
                if (chks[j]==v) return true;
            }
            return false;
        }
    }

    function htmlEncode(str){
        return str.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;").replace(/\'/g, "&#39;")
        .replace(/ /g, "&nbsp;");       
    }
}
﻿/**
 * @fileOverview 定义通讯录数据管理模块
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var isFirstLoadQueryUserInfo = true;
    M139.namespace("M2012.Contacts.Model", Backbone.Model.extend(
    /**@lends M2012.Contacts.Model.prototype*/
    {

        /**通讯录数据实体
        *@constructs M2012.Contacts.Model
        */
        initialize: function (options) {
            this.initEvents();
        },

        /**
         *@inner
         */
        getUserNumber: function () {
            return top.$User.getUid();
        },

        /**
         *加载通讯录数据
         */
        loadMainData: function (options, callback) {
            options = options || {};
            var This = this;
            this.isLoading = true;

            //options.testUrl = "/m2012/js/test/html/contactsData.js";//用测试数据
            if (options.testUrl) {
                //测试数据
                $.get(options.testUrl, function (responseText) {
                    This.onMainDataLoad(M139.JSON.tryEval(responseText), callback);
                });
            } else {
                var requestData = {
                    GetUserAddrJsonData: {
                        //UserNumber: this.getUserNumber()
                    }
                };
                M2012.Contacts.API.call("GetUserAddrJsonData", requestData,
                    function (e) {
                        This.isLoading = false;
                        if (e) {
                            if (e.responseData) {
                                if (e.responseData.ResultCode == "0") {
                                    This.onMainDataLoad(e.responseData, callback);
                                } else if (e.responseData.ResultCode == "216") {
                                    $App.trigger("change:sessionOut", {}, true);
                                } else {
                                    M139.Logger.getDefaultLogger().error('addrsvr response error', e.responseData);
                                }
                            } else {
                                M139.Logger.getDefaultLogger().error('addrsvr response invalid', e.responseText);
                            }
                        } else {
                            M139.Logger.getDefaultLogger().error('addrsvr response empty');
                        }
                    }
                );
            }
        },


        loadQueryUserInfo: function (callback) {
            if (SiteConfig.m2012NodeServerRelease && $App.isShowWelcomePage() && isFirstLoadQueryUserInfo) {
                //第一次加载读欢迎页内联json
                var data = getWelcomeInlinedJSON();
                if (data) {
                    setTimeout(function () {
                        inlinedCallback(data, true);
                    }, 0);
                } else {
                    $App.on("welcome_QueryUserInfo_load", function (data) {
                        inlinedCallback(data, true);
                    });
                }
            } else {
                var client = new M139.ExchangeHttpClient({
                    name: "ContactsLoadMainDataHttpClient",
                    responseDataType: "JSON2Object"
                });
                client.on("error", function(e) {
                    if (options && _.isFunction(options.error)) {
                        options.error(e);
                    }
                });
                var reqData = "<QueryUserInfo><UserNumber>" + $User.getUid() + "</UserNumber></QueryUserInfo>";
                client.request(
                {
                    method: "post",
                    url: "/addrsvr/QueryUserInfo?sid=" + $App.query.sid + "&formattype=json",
                    data: reqData
                }, callback);
            }
            isFirstLoadQueryUserInfo = false;
            function inlinedCallback(data, todoClone) {//TODO Clone
                if (todoClone) {
                    data = $App.deepCloneJSON(data);
                }
                callback({
                    responseData: data
                });
                inlinedCallback = new Function();//防止欢迎页和页面自己加载的调用2次回调
            }
            function getWelcomeInlinedJSON() {
                var json = null;
                try {
                    json = document.getElementById("welcome").contentWindow.inlinedQueryUserInfoJSON;
                } catch (e) { }
                return json;
            }
        },

        //获取个人资料
        getUserInfo: function (options, callback) {
            var self = this;            
            if (!top.$User) {
                return;
            }
            
            options = options || {};
            
            //options.refresh true  每次都刷新数据
            if(self.UserInfoData && !options.refresh){
                if (callback && typeof (callback) == "function") {
                    try {
                        callback(self.UserInfoData);
                        return;
                    } catch (ex) {}
                }
            }

            self.getUserInfoWaiting = true;
            this.loadQueryUserInfo(
                function (e) {
                    if (e && e.responseData) {
                        var code = e.responseData.ResultCode;
                        var data = {
                            "code": "S_FALSE", //这是取缓存验证用户失败时默认的返回code
                            "ResultCode": code
                        };
                        if (code == "0") {
                            //返回报文：QueryUserInfoResp={"ResultCode":"0","ResultMsg":"Operate successful","UserInfo":[{"un":"8613911111115","b":"19","c":"\u5f20","d":"\u4e09\u4e30","e":"2323","f":"1","h":"西藏","i":"拉萨市","k":"试试11","l":"518007","m":"长虹科技大厦的份上","n":"0","p":"13911111115","r":"13911111115","s":"0756626262","t":"435435341","v":"07552566251","y":"zhumy@rd139.com","c8":"1391111111","a2":"5180071","a3":"长虹大厦发送地方实得分","a4":"彩讯科技公司","b3":"Z","b8":"\/Upload\/Photo\/139111\/139111111\/13911111115\/20120808173757.gif","c1":"前端工程师","e7":"2","e8":"0","f2":"5522","f7":"game","f8":"8","g7":"111","g8":"111111111111111111"}]}
                            //var userInfo = self.userInfoTranslate(e.responseData["UserInfo"][0]);
                            //console.log(userInfo);
                            //if (callback) { callback(userInfo); }
                            data = {
                                "code": "S_OK",
                                "var": self.userInfoTranslate(e.responseData["UserInfo"][0])
                            };
                        }
                        self.UserInfoData = data;
                        if (callback && typeof (callback) == "function") {
                            try {
                                callback(data);
                            } catch (ex) {
                                
                            }
                        }
                    }
                    self.getUserInfoWaiting = false;
                }
            );
        },
        contactRequest:function(apiName,options,callback){
            var client = new M139.ExchangeHttpClient({
                name: "ContactsLoadMainDataHttpClient",
                requestDataType: "ObjectToXML2",
                responseDataType: "JSON2Object"
            });
            if (!options) { options = {}; }
            options.UserNumber = top.$User.getUid();
            var reqData = {};
            reqData[apiName]= options

            client.request(
                {
                    method: "post",
                    url: "/addrsvr/"+apiName+"?sid=" + top.$App.query.sid + "&formattype=json",
                    data: reqData
                },
                function (e) {
                    if (callback) {callback(e); }
                }
            );
        },
        //修改个人资料
        modifyUserInfo: function (userInfo, callback) {
			var self = this;
            this.contactRequest("ModUserInfo", userInfo, function (e) {
				self.UserInfoData = null;
                if (e && e.responseData) {
                    if (callback) {
                        callback(e.responseData);
                    }
                }
            });
        },
        modifyGroup:function(options,callback){
            //<EditGroupList><UserNumber>8613590330157</UserNumber><GroupId>1171021884</GroupId><SerialId>1025214752</SerialId><GroupType>1</GroupType></EditGroupList>
            this.contactRequest("EditGroupList", options, function (e) {
                if (e && e.responseData) {
                    if (callback) {
                        callback(e.responseData);
                    }
                }
            });

        },
        userInfoTranslate: function (UserInfo) {
            var map = {
                "a": "UserType",
                "b": "SourceType",
                "c": "AddrFirstName",
                "d": "AddrSecondName",
                "e": "AddrNickName",
                "f": "UserSex",
                "g": "CountryCode",
                "h": "ProvCode",
                "i": "AreaCode",
                "j": "CityCode",
                "k": "StreetCode",
                "l": "ZipCode",
                "m": "HomeAddress",
                "n": "MobilePhoneType",
                "o": "BirDay",
                "p": "MobilePhone",
                "q": "BusinessMobile",
                "r": "BusinessPhone",
                "s": "FamilyPhone",
                "t": "BusinessFax",
                "u": "FamilyFax",
                "v": "OtherPhone",
                "w": "OtherMobilePhone",
                "x": "OtherFax",
                "y": "FamilyEmail",
                "z": "BusinessEmail",
                "c2": "OtherEmail",
                "c3": "PersonalWeb",
                "c4": "CompanyWeb",
                "c5": "OtherWeb",
                "c6": "OICQ",
                "c7": "MSN",
                "c8": "OtherIm",
                "c9": "CPCountryCode",
                "d0": "CPProvCode",
                "d1": "CPAreaCode",
                "a0": "CPCityCode",
                "a1": "CPStreetCode",
                "a2": "CPZipCode",
                "a3": "CPAddress",
                "a4": "CPName",
                "a5": "CPDepartName",
                "a6": "Memo",
                "a7": "ContactCount",
                "a8": "ContactType",
                "a9": "ContactFlag",
                "b0": "SynFlag",
                "b1": "SynId",
                "b2": "RecordSeq",
                "b3": "FirstNameword",
                "b4": "CountMsg",
                "b5": "StartCode",
                "b6": "BloodCode",
                "b7": "StateCode",
                "b8": "ImageUrl",
                "b9": "SchoolName",
                "c0": "BokeUrl",
                "c1": "UserJob",
                "e1": "FamilyPhoneBrand",
                "e2": "BusinessPhoneBrand",
                "e3": "OtherPhoneBrand",
                "e4": "FamilyPhoneType",
                "e5": "BusinessPhoneType",
                "e6": "OtherPhoneType",
                "e7": "EduLevel",
                "e8": "Marriage",
                "e9": "NetAge",
                "e0": "Profession",
                "f1": "Income",
                "f2": "Interest",
                "f3": "MoConsume",
                "f4": "ExpMode",
                "f5": "ExpTime",
                "f6": "ContactMode",
                "f7": "Purpose",
                "f8": "Brief",
                "f9": "FavoEmail",
                "f0": "FavoBook",
                "g1": "FavoMusic",
                "g2": "FavoMovie",
                "g3": "FavoTv",
                "g4": "FavoSport",
                "g5": "FavoGame",
                "g6": "FavoPeople",
                "g7": "FavoWord",
                "g8": "Character",
                "g9": "MakeFriend",
                "ui": "UserInfo",
                "un": "UserNumber",
                "sd": "SerialId",
                "gd": "GroupId",
                "gp": "Group",
                "gi": "GroupInfo",
                "ct": "Contacts",
                "ci": "ContactsInfo",
                "gl": "GroupList",
                "li": "GroupListInfo",
                "tr": "TotalRecord",
                "rc": "ResultCode",
                "rm": "ResultMsg",
                "gn": "GroupName",
                "cn": "CntNum",
                "ri": "RepeatInfo",
                "lct": "LastContacts",
                "lctd": "LastContactsDetail",
                "lci": "LastContactsInfo",
                "cct": "CloseContacts",
                "cci": "CloseContactsInfo",
                "an": "AddrName",
                "at": "AddrType",
                "ac": "AddrContent",
                "us": "UserSerialId",
                "ai": "AddrId",
                "lid": "LastId",
                "ate": "AddrTitle",
                "trg": "TotalRecordGroup",
                "trr": "TotalRecordRelation",
                "cf": "ComeFrom",
                "cte": "CreateTime",
                "trg": "TotalRecordGroup",
                "trr": "TotalRecordRelation",
                "Bct": "BirthdayContacts",
                "bci": "BirthdayContactInfo"
            }
            var result = {};
            for (elem in UserInfo) {
                if (map[elem]) {
                    result[map[elem]] = UserInfo[elem];
                }
            }
            return result;
        },
        //获取隐私设置
        getPrivateSettings: function (callback) {
            if (!window.$User) {
                return;
            }

            var self = this;
            var client = new M139.ExchangeHttpClient({
                name: "ContactsLoadMainDataHttpClient",
                responseDataType: "JSON2Object"
            });

            var reqData = "<GetPrivacySettings><UserNumber>" + $User.getUid() + "</UserNumber></GetPrivacySettings>";

            client.request(
                {
                    method: "post",
                    url: "/addrsvr/GetPrivacySettings?sid=" + $App.query.sid,
                    data: reqData
                },
                function (e) {

                    if (e && e.responseData) {
                        var respData = e.responseData;
                        var code = respData.ResultCode;
                        var data = {
                            "code": "S_FALSE" //这是取缓存验证用户失败时默认的返回code
                        };
                        if (code == "0") {
                            //返回报文：QueryUserInfoResp={"ResultCode":"0","ResultMsg":"Operate successful","UserInfo":[{"un":"8613911111115","b":"19","c":"\u5f20","d":"\u4e09\u4e30","e":"2323","f":"1","h":"西藏","i":"拉萨市","k":"试试11","l":"518007","m":"长虹科技大厦的份上","n":"0","p":"13911111115","r":"13911111115","s":"0756626262","t":"435435341","v":"07552566251","y":"zhumy@rd139.com","c8":"1391111111","a2":"5180071","a3":"长虹大厦发送地方实得分","a4":"彩讯科技公司","b3":"Z","b8":"\/Upload\/Photo\/139111\/139111111\/13911111115\/20120808173757.gif","c1":"前端工程师","e7":"2","e8":"0","f2":"5522","f7":"game","f8":"8","g7":"111","g8":"111111111111111111"}]}
                            //var userInfo = self.userInfoTranslate(e.responseData["UserInfo"][0]);
                            //console.log(userInfo);
                            //if (callback) { callback(userInfo); }

                            data = {
                                "code": "S_OK",
                                "var": {
                                    "addMeRule": respData.WhoAddMeSetting,
                                    "UserInfoSetting": respData.UserInfoSetting //这个是一个对象
                                }
                            };
                        }
                        if (callback && typeof (callback) == "function") {
                            try {
                                callback(data);
                            } catch (ex) {
                                
                            }
                        }
                    }
                }
            );
        },

        //更新隐私设置
        //注意：经测试，如果UserInfoSetting未传递所有值，则未传递的值默认设置为“仅好友可见”，值为0
        //建议暂不使用此接口设置数据
        /*
        options={
              UserNumber:8613800138000, //此字段可忽略，会自动添加
              WhoAddMeSetting:0,
              UserInfoSetting:{
                AddrFirstName:0,
                UserSex:0,
                BirDay:0,
                ImageUrl:0,
                FamilyEmail:0,
                MobilePhone:0,
                FamilyPhone:0,
                OtherIm:0,
                HomeAddress:0,
                CPName:0,
                UserJob:0,
                BusinessEmail:0,
                BusinessMobile:0,
                BusinessPhone:0,
                CPAddress:0,
                CPZipCode:0
              }
            }
        */
        updatePrivateSettings: function (options, callback) {
            var client = new M139.ExchangeHttpClient({
                name: "ContactsLoadMainDataHttpClient",
                requestDataType: "ObjectToXML2",
                responseDataType: "JSON2Object"
            });

            var UserNumber = $User.getUid();
            var reqData = { "UserNumber": UserNumber }; //默认加上号码
            reqData = { "SavePrivacySettings": $.extend(reqData, options) };

            client.request(
                {
                    method: "post",
                    url: "/addrsvr/SavePrivacySettings?sid=" + $App.query.sid,
                    data: reqData
                },
                function (e) {
                    if (e && e.responseData) {
                        var respData = e.responseData;
                        var result = {
                            "code": (respData.ResultCode == "0" ? "S_OK" : respData.ResultCode) || "FS_UNKNOWN",
                            "var": {
                                "msg": respData.ResultMsg || ""
                            }
                        };

                        if (callback) {
                            callback(result);
                        }
                    }
                }
            );
        },
        /**
         *获取通讯录数据
         */
        requireData: function (callback) {
            var data = this.get("data");
            if (data) {
                if (callback) {
                    callback(data);
                }
            } else {
                if (!this.isLoading) {
                    this.loadMainData();
                }
                this.on("maindataload", function (data) {
                    this.off("maindataload", arguments.callee);
                    if (callback) {
                        setTimeout(function () {
                            callback(data);
                        }, 0);
                    }
                });
            }
        },

        /**通讯是否已加载*/
        isLoaded: function () {
            return !!this.get("data");
        },

        /**
         *通讯录数据加载完成后处理数据
         *@inner
         */
        onMainDataLoad: function (json, callback) {
            json.Groups = json.Group || json.Groups;

            //后台不输出数组的时候容错
            if (!json.LastContacts) json.LastContacts = [];
            if (!json.CloseContacts) json.CloseContacts = [];
            if (!json.BirthdayContacts) json.BirthdayContacts = [];
            if (!json.Contacts) json.Contacts = [];
            if (!json.Groups) json.Groups = [];
            if (!json.GroupMember) json.GroupMember = {};
            if (!json.NoGroup) json.NoGroup = [];

            json.TotalRecord = parseInt(json.TotalRecord);
            json.TotalRecordGroup = parseInt(json.TotalRecordGroup);
            json.TotalRecordRelation = parseInt(json.TotalRecordRelation);
            json.userSerialId = json.UserSerialId;

            var exports = {
                TotalRecord: json.TotalRecord,
                TotalRecordGroup: json.TotalRecordGroup,
                TotalRecordRelation: json.TotalRecordRelation,
                noGroup: json.NoGroup
            };

            //分组
            this.createGroupData({
                data: json,
                exports: exports
            });

            //联系人
            this.createContactsData({
                data: json,
                exports: exports
            });

            //组关系
            this.createGroupMemberData({
                data: json,
                exports: exports
            });
            //处理最近、紧密联系人
            this.createLastAndCloseContactsData({
                data: json,
                exports: exports
            });

            //处理生日联系人
            this.createBirthdayContactsData({
                data: json,
                exports: exports
            });
            
            //处理VIP联系人
            this.createVIPContactsData({
                data: json,
                exports: exports
            });
            
            //处理用户个人资料  QueryUserInfo合并至GetUserAddrJsonData接口输出
            if(json["UserInfo"] && json["UserInfo"][0]){
                this.UserInfoData = {
                    "code": "S_OK",
                    "var": this.userInfoTranslate(json["UserInfo"][0])
                };
            }

            this.set("data", exports);
            this.trigger("maindataload", exports);
            if (callback) callback(exports);
        },

        /**
         *加载通讯录主干数据后处理分组数据
         *@inner
         */
        createGroupData: function (options) {
            if (options.append) {
                //添加新组后更新缓存
                var data = this.get("data");
                var groups = data.groups;
                var groupsMap = data.groupsMap;
                var groupMember = data.groupMember;
                var newGroup = {
                    GroupId: options.append.groupId,
                    id: options.append.groupId,
                    GroupName: options.append.groupName,
                    name: options.append.groupName,
                    CntNum: 0,
                    count: 0
                };
                groups.push(newGroup);
                groupsMap[newGroup.id] = newGroup;
                groupMember[newGroup.id] = [];
            } else {
                var exports = options.exports;
                var data = options.data;
                var dataGroups = data.Groups;
                var groups = new Array(dataGroups.length);
                var groupsMap = {};
                for (var i = 0, len = dataGroups.length; i < len; i++) {
                    var g = dataGroups[i];
                    groupsMap[g.gd] = groups[i] = {
                        GroupId: g.gd,
                        id: g.gd,
                        GroupName: g.gn,
                        name: g.gn,
                        CntNum: g.cn,
                        count: g.cn
                    };
                }
                exports.groups = groups;
                exports.groupsMap = groupsMap;
            }
        },

        /**
         *加载通讯录主干数据后处理联系人数据
         *@inner
         */
        createContactsData: function (options) {
            if (options.remove) {
                var data = this.get("data");
                var serialId = options.serialId;
                delete data.contactsMap[serialId];
                delete data.contactsIndexMap[serialId];
                var contacts = data.contacts;
                for (var i = contacts.length - 1; i >= 0; i--) {
                    if (contacts[i].SerialId == serialId) {
                        contacts.splice(i, 1);
                        break;
                    }
                }
                data.emailHash = null;//清除字段缓存
            } else if (options.append) {
                var data = this.get("data");
                var newContacts = options.append;
                var contacts = data.contacts;
                var contactsMap = data.contactsMap;
                var contactsIndexMap = data.contactsIndexMap;
                var nogroup = data.noGroup;
                for (var i = 0; i < newContacts.length; i++) {
                    var c = newContacts[i];
                    c.Quanpin = c.FullNameword || "";
                    c.Jianpin = c.FirstWord || "";

                    var info = new M2012.Contacts.ContactsInfo(c);
                    contacts[contacts.length] = info;
                    contactsMap[info.SerialId] = info;
                    contactsIndexMap[info.SerialId] = contacts.length;
                }
                data.emailHash = null;//清除字段缓存
                data.TotalRecord += newContacts.length;
            }else{
                var exports = options.exports;
                var data = options.data;
                var dataContacts = data.Contacts

                var contacts = new Array(dataContacts.length);
                var contactsMap = {};
                var contactsIndexMap = {};

                var csClass = M2012.Contacts.ContactsInfo;
                for (var i = 0, len = dataContacts.length; i < len; i++) {
                    var c = dataContacts[i];
                    var info = new csClass({
                        SerialId: c.sd,
                        AddrFirstName: c.c,
                        AddrSecondName: c.d,
                        MobilePhone: c.p,
                        BusinessMobile: c.q,
                        OtherMobilePhone: c.w,
                        FamilyEmail: (c.y || "").toLowerCase(),
                        BusinessEmail: (c.z || "").toLowerCase(),
                        OtherEmail: (c.c2 || "").toLowerCase(),
                        FirstNameword: (c.b3 || "").toLowerCase(),
                        FamilyFax: c.u,
                        BusinessFax: c.t,
                        OtherFax: c.x,
                        ImageUrl: c.b8,
                        Quanpin: (c.d2 || "").toLowerCase(),
                        Jianpin: (c.d3 || "").toLowerCase(),
                        CPName: c.a4,
                        UserJob: c.c1
                    });
                    contacts[i] = info;
                    contactsMap[c.sd] = info;
                    contactsIndexMap[c.sd] = i;
                }
                exports.contacts = contacts;
                exports.contactsMap = contactsMap;
                exports.contactsIndexMap = contactsIndexMap;
            }

            //刷新通讯录标签
            var addrtab = $App.getTabByName("addr");
            if (addrtab) {
                addrtab.isRendered = false;
            }
        },

        updateContactsData: function (options) {
            var data = this.get("data");
            var contactinfos = options.modification;
            var map = data.map || [];
            var contacts = data.contacts;
            var contactsMap = data.contactsMap;
            var groupsMap = data.groupsMap;

            var j, k, flag, groups = [];

            for (k = contactinfos.length; k--; ) {

                var info = new M2012.Contacts.ContactsInfo(contactinfos[k]);
                contactsMap[info.SerialId] = info;

                for (j = contacts.length; j--; ) {
                    if (contacts[j].SerialId == info.SerialId) {
                        contacts[j] = info;
                        break;
                    }
                }

                //删除现有map后重建关系
                groups.length = 0;
                for (j = map.length; j--; ) {
                    if (map[j].SerialId == info.SerialId) {
                        groups.push(map[j].GroupId);
                        map.splice(j, 1);
                    }
                }

                //先删除groups、groupsMap 的联系人数，注意groups是旧的组关系
                for (j = groups.length; j--; ) {
                    flag = groupsMap[groups[j]];
                    flag.count = parseInt(flag.count) - 1;
                    flag.CntNum = parseInt(flag.CntNum) - 1;
                }

                //重建map
                groups = info.GroupId.split(','); //groups有""的元素
                for (j = groups.length; j--; ) {
                    if (groups[j]) {
                        map.push({ SerialId: info.SerialId, GroupId: groups[j] });
                        flag = groupsMap[groups[j]];
                        flag.count = parseInt(flag.count) + 1;
                        flag.CntNum = parseInt(flag.CntNum) + 1;
                    }
                }

                //更新未分组
                for (j = data.noGroup.length; j--; ) {
                    if (data.noGroup[j] == info.SerialId) {
                        data.noGroup.splice(j, 1);
                        break;
                    }
                }

                if (groups.length == 0) {
                    data.noGroup.push(String(info.SerialId));
                    if (data.groupedContactsMap) {
                        delete data.groupedContactsMap[info.SerialId];
                    }
                } else {
                    if (data.groupedContactsMap) {
                        data.groupedContactsMap[info.SerialId] = 1;
                    }
                }

            }
            if(data.emailHash){//还要更新二级hash缓存
                if(info.emails && info.emails.length>0){
                    data.emailHash[info.emails[0]]=info;
                 }
            }
            groups.length = 0;
            groups = null;
        },


        /**
         *加载通讯录主干数据后处理联系人组关系数据
         *@inner
         */
        createGroupMemberData: function (options) {
            if (options.append) {
                //添加组关系缓存
                var appendItem = options.append;//格式为{SerialId:"",groups:[]}
                var groups = appendItem.GroupId;
                
                groups = groups.length == 0 ? [] : groups;
                groups = _.isString(groups) ? groups.split(",") : groups;

                var data = this.get("data");
                var groupsMap = data.groupsMap;
                var groupMember = data.groupMember;
                if (groups.length == 0) {
                    //如果没分组，联系人id添加到noGroup
                    data.noGroup.push(appendItem.SerialId);
                } else {
                    _.each(groups, function (gid) {
                        var gm = groupMember[gid];
                        if (_.isUndefined(gm)) {
                            data.groupMember[gid] = [];
                            gm = data.groupMember[gid];
                        }

                        gm.push(appendItem.SerialId);
                        groupsMap[gid].CntNum = gm.length;
                    });
                }
            } else {
                var data = options.data;
                var exports = options.exports;
                var contactsMap = exports.contactsMap;
                var groupsMap = exports.groupsMap;
                var groupMember = data.GroupMember;
                for (var gid in groupMember) {
                    var group = groupsMap[gid];
                    if (!group) {
                        if(/^\d+$/.test(gid)){
                            delete groupsMap[gid];//删除组脏数据
                        }
                    } else {
                        var members = groupMember[gid];
                        for (var i = 0; i < members.length; i++) {
                            if (!contactsMap[members[i]]) {
                                members.splice(i, 1);//删除联系人脏数据
                                i--;
                            }
                        }
                        group.CntNum = members.length;
                    }
                }
                exports.groupMember = groupMember;
            }
        },

        /**
         *加载通讯录主干数据后处理最近联系人和紧密联系人数据
         *@inner
         */
        createLastAndCloseContactsData: function (options) {
            if (options.append) {
                var data = this.get("data");

                var lastestContacts = data.lastestContacts;
                if (!$.isArray(lastestContacts)) {
                    return;
                }

                var items = options.append || [];
                for (var i = 0; i < items.length; i++) {
                    var l = items[i];
                    lastestContacts.unshift(l);
                }
                var map = {};
                //排除重复
                for (var i = 0; i < lastestContacts.length; i++) {
                    var l = lastestContacts[i];
                    if (map[l.AddrContent]) {
                        lastestContacts.splice(i, 1);
                        i--;
                    } else {
                        map[l.AddrContent] = 1;
                    }
                }
                if (lastestContacts.length > 50) {
                    lastestContacts.length = 50;
                }
            } else {
                var exports = options.exports;
                var data = options.data;
                var dataLastContacts = data.LastContacts;
                var dataCloseContacts = data.CloseContacts;
                var lastestContacts = [];
                var closeContacts = [];


                for (var i = 0, len = dataLastContacts.length; i < len; i++) {
                    var l = dataLastContacts[i];
                    if (typeof l.ac == "object") continue;//不懂？
                    lastestContacts.push({
                        SerialId: l.sd,
                        AddrName: l.an,
                        AddrType: l.at,
                        AddrContent: l.ac
                    });
                }

                for (var i = 0, len = dataCloseContacts.length; i < len; i++) {
                    var l = dataCloseContacts[i];
                    if (typeof l.ac == "object") continue;
                    closeContacts.push({
                        SerialId: l.sd,
                        AddrName: l.an,
                        AddrType: l.at,
                        AddrContent: l.ac
                    });
                }
                exports.lastestContacts = lastestContacts;
                exports.closeContacts = closeContacts;
            }
        },

        /**
         *加载通讯录主干数据后处理过生日的联系人数据
         *@inner
         */
        createBirthdayContactsData: function (options) {
            var exports = options.exports;
            var data = options.data;
            var dataBirContacts = data.BirthdayContacts;
            var birthdayContacts = new Array(dataBirContacts.length);
            for (var i = dataBirContacts.length - 1; i >= 0; i--) {
                var k = dataBirContacts[i];
                birthdayContacts[i] = {
                    SerialId: k.sd,
                    AddrName: k.an,
                    MobilePhone: k.p,
                    FamilyEmail: k.y,
                    BusinessEmail: k.z,
                    OtherEmail: k.c2,
                    BirDay: k.o
                };
            };
            exports.birthdayContacts = birthdayContacts;
        },

        /**
         *处理vip联系人数据
         *@inner
         */
        createVIPContactsData: function (options) {
            //"Vip":[{"vipg":"1158807544","vipc":"188722633,998324356","vipn":"2"}]
            var data = options.data;
            var exports = options.exports;
            var vipData = data.Vip && data.Vip[0];
            var vip = {};
            if (vipData) {
                try{
                    vip.groupId = vipData.vipg;
                    vip.contacts = vipData.vipc ? vipData.vipc.split(",") : [];
                } catch (e) {
                    //todo
                }
            }
            exports.vip = vip;
        },

        /**
         *根据联系人id获得对象
         *@param {String} cid 联系人id (SerialId)
         *@returns {M2012.Contacts.ContactsInfo} 返回联系人对象
         */
        getContactsById: function (cid) {
            return this.get("data").contactsMap[cid] || null;
        },
        /**
         *根据联系人id获取当前联系人的所有组
         *@param {String} cid 联系人id (SerialId)
         *@returns [] 返回联系人组
         */
        getContactsGroupById: function(cid){
            var groups = [];
            var member = this.get("data").groupMember;
            for(var key in member){
                if(member[key] && member[key].length > 0){
                    if(member[key].join(',').indexOf(cid) > -1){
                        groups.push(key);
                    }
                }
            }

            return groups;
        },
        /**
         *根据组id获得对象
         *@param {String} gid 组id (groupId)
         *@returns {Object} 返回组对象
         */
        getGroupById: function (gid) {
            return this.get("data").groupsMap[gid] || null;
        },

        /**
         *根据组名获得组对象
         *@param {String} gid 组id (groupId)
         *@returns {Object} 返回组对象
         */
        getGroupByName: function (groupName) {
            var groups = this.getGroupList();
            for (var i = 0, len = groups.length; i < len; i++) {
                var g = groups[i];
                if (g.name === groupName) {
                    return g;
                }
            }
            return null;
        },


        /**
         *获得联系人的分组id列表
         *@param {String} serialId 联系人id
         *@returns {Object} 返回组对象
         */
        getContactsGroupId: function (serialId) {
            var groupMember = this.get("data").groupMember;
            var groups = [];
            for (var gid in groupMember) {
                var members = groupMember[gid];
                for (var i = 0, len = members.length; i < len; i++) {
                    if (members[i] === serialId) {
                        groups.push(gid);
                        break;
                    }
                }
            }
            return groups;
        },

        /**
         *返回一个联系组的克隆列表
         *@returns {Array} 返回数组
         */
        getGroupList: function () {
            var groups = this.get("data");
            if (groups) {
                groups = groups.groups;
            }

            if (groups && _.isFunction(groups.concat)) {
                groups = groups.concat();
            } else {
                groups = [];
            }

            return groups;
        },
        /**
         *返回一个分组共有多少联系人，数据接口输出的有可能不准确，可纠正
         *@param {String} gid 组id (groupId)
         *@returns {Number} 返回组联系人个数
         */
        getGroupMembersLength: function (gid) {
            var group = this.getGroupById(gid);
            if (!group) {
                throw "M2012.Contacts.Model.getGroupContactsLength:不存在联系人分组gid=" + gid;
            }
            return group.CntNum;
        },
        /**
         *返回一个联系组的所有联系人id
         *@param {String} gid 组id (groupId)
         *@param {Object} options 选项集
         *@param {String} options.filter 筛选出有以下属性的联系人:email|mobile|fax
         *@returns {Array} 返回组联系人id：[seriaId,seriaId,seriaId]
         */
        getGroupMembersId: function (gid, options) {
            var result = this.getGroupMembers(gid, options);
            for (var i = 0, len = result.length; i < len; i++) {
                result[i] = result[i].SerialId;
            }
            return result;
        },
        /**
         *返回一个联系组的所有联系人列表
         *@param {String} gid 组id (groupId)
         *@param {Object} options 选项集
         *@param {String} options.filter 筛选出有以下属性的联系人:email|mobile|fax
         *@returns {Array} 返回组联系人id：[ContactsInfo,ContactsInfo,ContactsInfo]
         */
        getGroupMembers: function (gid, options) {
            options = options || {};
            var filter = options.filter;                        
            var cData = this.get("data");
            var contactsMap = cData.contactsMap;
            var groupMember = cData.groupMember;
            var result = [];
            if (gid == this.getVIPGroupId()) {
                result = this.getVIPContacts();
            } else {
                var gm = groupMember[gid];
                if (gm) {
                    for (var i = 0, len = gm.length; i < len; i++) {
                        var cid = gm[i];
                        var c = contactsMap[cid];
                        if (c) {
                            result.push(c);
                        }
                    }
                }
            }
            if (options && options.filter) {
                result = this.filterContacts(result, { filter: options.filter, colate: options.colate });
            }
            return result;
        },
        /**获得vip联系人*/
        getVIPContacts: function () {
            var data = this.get("data");
            var result = [];
            var vip = data && data.vip;
            var contactsMap = data && data.contactsMap;
            if (vip && vip.contacts) {
                var contacts = vip.contacts;
                for (var i = 0; i < contacts.length; i++) {
                    var c = contacts[i];
                    var item = contactsMap[c];
                    if (item) {//vip联系人有可能被删除了
                        result.push(item);
                    }
                }
            }
            return result;
        },
        /**
         *获得vip分组id
         */
        getVIPGroupId: function () {
            var id = "";
            var data = this.get("data");
            if (data && data.vip) {
                id = data.vip.groupId;
            }
            return id;
        },

        /**
         *筛选联系人
         *@param {Array} contacts 要筛选的联系人
         *@param {Object} options 选项集
         *@param {String} options.filter 筛选属性：email|mobile|fax
         *@returns {Array} 返回组联系人id：[ContactsInfo,ContactsInfo,ContactsInfo]
         */
        filterContacts: function (contacts, options) {
            var filter = options.filter;
            var result = [];
            for (var i = 0, len = contacts.length; i < len; i++) {
                var c = contacts[i];
                if (filter == "email" && c.getFirstEmail()) {
                    result.push(c);
                } else if (filter == "mobile" && c.getFirstMobile()) {
                    result.push(c);
                } else if (filter == "fax" && c.getFirstFax()) {
                    result.push(c);
                } else if (options.colate && c.getFirstEmail().indexOf(filter) > -1) {
                    result.push(c); //change by Aerojin 2014.06.09 过滤非本域用户
                }                
            }
            return result;
        },

        /**
         *绑定一些事件
         *@inner
         */
        initEvents:function(){
            var self = this;
            var E = "dataForMatch_email", M = "dataForMatch_mobile", F = "dataForMatch_fax";

            //清除用来做索引的缓存
            self.on("update", function (e) {
                if (e.type == "AddSendContacts" || e.type == "AddContacts" || e.type == "EditContacts") {
                    if (self.has(E)) {
                        self.unset(E);
                    }

                    if (self.has(M)) {
                        self.unset(M);
                    }

                    if (self.has(F)) {
                        self.unset(F);
                    }
                }
            });

            //重新加载联系人数据时，也清理做索引的缓存
            self.on("maindataload", function () {
                if (self.has(E)) {
                    self.unset(E);
                }

                if (self.has(M)) {
                    self.unset(M);
                }

                if (self.has(F)) {
                    self.unset(F);
                }
            });
        },

        //预先处理 合并最近联系人紧密联系人与常用联系人，排除重复
        getDataForMatch: function (filter) {
            var dataKey = "dataForMatch_" + filter;
            var data = this.get(dataKey);
            if (!data) {
                var contacts = this.filterContacts(this.get("data").contacts, {
                    filter: filter
                });
                data = getOldLinkManList(contacts, filter);
                this.set(dataKey, data);
            }
            return data;
            function getOldLinkManList(contacts, filter) {
                var key;
                if (filter == "email") {
                    key = "emails";
                } else if (filter == "fax") {
                    key = "faxes";
                } else if (filter == "mobile") {
                    key = "mobiles";
                }
                var linkManList = [];
                for (var i = 0, len = contacts.length; i < len; i++) {
                    var c = contacts[i];
                    var addrs = c[key];
                    for (var j = 0; j < addrs.length; j++) {
                        var addr = addrs[j];
                        linkManList.push({
                            name: c.name,
                            lowerName: c.lowerName,
                            addr: addr,
                            id: c.SerialId,
                            quanpin: c.Quanpin,
                            jianpin: c.Jianpin
                        });
                    }
                }
                return linkManList;
            }
        },
        /**
         *根据输入匹配联系人
         *@inner
         */
        getInputMatch: function (options) {
            var contacts = this.getDataForMatch(options.filter);
            var keyword = options.keyword;
            var len = contacts.length;
            var matches = [];
            var matchTable = {};
            var attrToNumber = {
                "addr": "01",
                "name": "02",
                "quanpin": "03",
                "jianpin": "04"
            }
            var numberToAttr = {
                "01": "addr",
                "02": "name",
                "03": "quanpin",
                "04": "jianpin"
            }
            var SPLIT_CHAR = "0._.0";//匹配键的分隔符
            //高性能哈希，匹配下标+匹配属性=key，value为匹配结果集合
            function pushMatch(attrName, index, arrIndex) {
                var matchKey = index + SPLIT_CHAR + attrName;
                if (index < 10) matchKey = "0" + matchKey;
                var arr = matchTable[matchKey];
                if (!arr) matchTable[matchKey] = arr = [];
                arr.push(arrIndex);
            }
            for (var i = 0; i < len; i++) {
                var item = contacts[i];
                //if (host.value.indexOf("<" + item.addr + ">") > 0) continue;
                var minIndex = 10000;
                var minIndexAttr = null;
                var index = item.addr.indexOf(keyword);
                if (index != -1 && index < minIndex) {
                    minIndex = index;
                    minIndexAttr = attrToNumber.addr;
                }
                if (index == 0) {
                    pushMatch(minIndexAttr, minIndex, i);
                    continue;
                }
                index = item.lowerName.indexOf(keyword && keyword.toLowerCase());// update by tkh 用户输入的关键字统一转换成小写
                if (index != -1 && index < minIndex) {
                    minIndex = index;
                    minIndexAttr = attrToNumber.name;
                }
                if (minIndex == 0) {
                    pushMatch(minIndexAttr, minIndex, i);
                    continue;
                }

                if (!/[^a-zA-Z]/.test(keyword)) {
                    if (item.quanpin && item.jianpin) {
                        index = item.quanpin.indexOf(keyword);
                        if (index != -1 && index < minIndex) {
                            minIndex = index;
                            minIndexAttr = attrToNumber.quanpin;
                        }
                        if (minIndex == 0) {
                            pushMatch(minIndexAttr, minIndex, i);
                            continue;
                        }
                        index = item.jianpin.indexOf(keyword);
                        if (index != -1 && index < minIndex) {
                            minIndex = index;
                            minIndexAttr = attrToNumber.jianpin;
                        }
                    }
                }
                if (minIndexAttr) {
                    pushMatch(minIndexAttr, minIndex, i);
                    continue;
                }
            }

            var allMatchKeys = [];
            for (var p in matchTable) {
                allMatchKeys.push(p);
            }
            allMatchKeys.sort(function (a, b) {
                return a.localeCompare(b);
            });
            var MAX_COUNT = options.maxLength || 30;
            for (var i = 0; i < allMatchKeys.length; i++) {
                var k = allMatchKeys[i];
                var arr = matchTable[k];
                //从key中获取matchAttr和matchIndex，后面用于着色加粗
                var matchAttr = getAttrNameFromKey(k);
                var matchIndex = getMatchIndexFromKey(k);
                for (var j = 0; j < arr.length; j++) {
                    var arrIndex = arr[j];
                    matches.push({
                        info: contacts[arrIndex],
                        matchAttr: matchAttr,
                        matchIndex: matchIndex
                    });
                    if (matches.length >= MAX_COUNT) break;
                }
            }
            //var matchKey = index + SPLIT_CHAR + attrName;
            function getAttrNameFromKey(key) {
                return numberToAttr[key.split(SPLIT_CHAR)[1]];
            }
            function getMatchIndexFromKey(key) {
                return parseInt(key.split(SPLIT_CHAR)[0], 10);
            }
            return matches;
        },

        /**搜索联系人：姓名、拼音、传真、职位等
         *@param {String} keyword 搜索关键字
         *@param {Object} options 搜索选项集
         *@param {Array} options.contacts 要搜索的联系人集（否则是全部联系人）
         */
        search: function (keyword, options) {
            options = options || {};
            if (options.contacts) {
                var contacts = options.contacts;
            } else {
                var contacts = this.get("data").contacts;
                if (options.filter) {
                    contacts = this.filterContacts(contacts, { filter: options.filter });
                }
            }
            var result = [];
            for (var i = 0, len = contacts.length; i < len; i++) {
                var c = contacts[i];
                if (c.match(keyword)) {
                    result.push(c);
                }
            }
            return result;
        },
        /**
         *得到地址
         *@param {String} text 要提取地址的文本
         *@param {String} addrType 要提取地址类型：email|mobile|fax
         */
        getAddr: function (text, addrType) {
            if (addrType == "email") {
                return M139.Text.Email.getEmail(text);
            } else if (addrType == "mobile") {
                return M139.Text.Mobile.getNumber(text);
            }
            return "";
        },
        /**
         *得到名字
         *@param {String} text 要提取地址的文本
         *@param {String} addrType 要提取地址类型：email|mobile|fax
         */
        getName: function (text, addrType) {
            if (addrType == "email") {
                return M139.Text.Email.getName(text);
            } else if (addrType == "mobile") {
                return M139.Text.Mobile.getName(text);
            }
            return "";
        },

        /**
         *得到发送文本 "name"<addr>
         *@param {String} name 姓名
         *@param {String} addr 地址
         *@example
         var text = model.getSendText("李福拉","lifula@139.com");
         var text = model.getSendText("李福拉","15889394143");
         */
        getSendText: function (name, addr) {
            name = (name || "") && name.replace(/["\r\n]/g, " ");
            return "\"" + name + "\"<" + addr + ">";
        },

        /**
         *根据邮件地址获得联系人
         *@param {String} email 邮件地址
         *@returns {Array} 返回联系人数组
         */
        getContactsByEmail: function (email) {
            email = $Email.getEmailQuick(email);
            var item = this.getHashContacts()[email];
            if (item) {
                return [item];
            } else {
                return [];
            }
        },

        getHashContacts:function(){
            var data = this.get("data");
            if (!data) return {};
            if (!data.emailHash) {
                var contacts = data.contacts;
                var hash = {};
                if (contacts) {
                    for (var i = 0, len = contacts.length; i < len; i++) {
                        var c = contacts[i];
                        for (var j = 0; j < c.emails.length; j++) {
                            hash[c.emails[j]] = c;
                        }
                    }
                }
                data.emailHash = hash;
            }
            return data.emailHash || {};
        },

        /**
         *根据手机号获得联系人
         *@param {String} email 邮件地址
         *@returns {Array} 返回联系人数组
         */
        getContactsByMobile: function (mobile) {
            var data = this.get("data");
            var result = [];
            if (!data || !data.contacts) return result;
            for (var i = 0, contacts = data.contacts, len = contacts.length; i < len; i++) {
                var c = contacts[i];
                for (var j = 0; j < c.mobiles.length; j++) {
                    if (c.mobiles[j] == mobile) {
                        result.push(c);
                    }
                }
            }
            return result;
        },

        /**
         *根据邮件地址获得联系人
         *@param {String} email 邮件地址
         *@returns {String} 返回联系人姓名，如果找不到，返回@前的账号部分
         */
        getAddrNameByEmail: function (email) {
            email = email.trim();
            var c = this.getContactsByEmail(email);
            if (c && c.length > 0) {
                return c[0].name;
            } else {
                var name = $Email.getNameQuick(email);
                if (name && name.replace(/['"\s]/g,"") != "") {
                    return name;
                } else {
                    name = email.replace(/<[^>]+>$/, "");
                    if (name && name.replace(/['"\s]/g, "") != "") {
                        return name;
                    } else {
                        return email;
                    }
                }
            }
        },

        /**
         *更新通讯录缓存数据
         */
        updateCache: function (options) {
            var type = options.type;
            switch (type) {
                case "AddGroup":
                    this.createGroupData({
                        append:options.data
                    });
                    break;
                case "DeleteContacts":
                    this.createContactsData({
                        remove:options.data
                    });
                    break;

                case "AddSendContacts":
                    //添加最近联系人
                    this.createLastAndCloseContactsData({
                        append: options.data.items
                    });
                    var newContacts = options.data.newContacts;
                    //添加新联系人
                    if (newContacts && newContacts.length > 0) {
                        this.createContactsData({
                            append:newContacts
                        });

                        for (var i = 0, m = newContacts.length; i < m; i++) {
                            this.createGroupMemberData({ append: newContacts[i] });
                        }
                    }

                    //if (c.GroupId) {
                    //    var groups = c.GroupId.split(','), group;
                    //    for (var j = groups.length; j--; ) {
                    //        group = data.groupMember[groups[j]];
                    //        if (group) {
                    //            group.push(info.SerialId);
                    //        }

                    //        group = data.groupsMap[groups[j]];
                    //        if (group) {
                    //            group.CntNum = Number(group.CntNum) + 1;
                    //            group.count = group.CntNum;
                    //        }
                    //    }
                    break;

                case "AddContacts":
                    this.createContactsData({
                        append: _.isArray(options.data) ? options.data : [options.data]
                    });
                    var data = _.isArray(options.data) ? options.data[0] : options.data;
                    if (data && data.GroupId) {
                        this.createGroupMemberData({
                            append: data
                        });
                    }
                    break;

                case "EditContacts":
                    this.updateContactsData({
                        modification: _.isArray(options.data) ? options.data : [options.data]
                    });
                    break;

            }

            /**服务端响应事件
            * @name M2012.Contacts.Model#update
            * @event
            * @param {Object} e 事件参数
            * @param {String} e.type 更新行为：AddGroup|AddContacts|EditGroup
            * @param {Object} e.data 更新的数据
            * @example
            model.on("update",function(e){
                console.log(e.type);
                console.log(e);
            });
            */
            this.trigger("update", options);

        },

        /**
         * 获取通讯录现有总条数
         * @param {Function} 回调函数，这是可等待数据加载成功后才给出的
         * @return {Number} 总条数，如果未加载到数据，则返回 -1
         */
        getContactsCount: function(callback) {

            if (callback) {
                M139.Timing.waitForReady('"undefined" !== typeof top.$App.getModel("contacts").get("data").contacts.length', function () {
                    callback(this.get("data").contacts.length);
                });
            }

            if (this.isLoaded()) {
                return this.get("data").contacts.length;
            } else {
                return -1;
            }
        }
    }));


    jQuery.extend(M2012.Contacts,
    /**@lends M2012.Contacts*/
    {
        /**返回一个M2012.Contacts.Model模块实例*/
        getModel: function () {

            if (window != window.top) {
                return top.M2012.Contacts.getModel();
            }

            if (!this.current) {
                this.current = new M2012.Contacts.Model();
            }
            return this.current;
        }

    });

})(jQuery, _, M139);
﻿

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
﻿/**
 * @fileOverview 定义通讯录富文本框的子项元素对象
 */

(function (jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	var namespace = "M2012.UI.RichInput.ItemView";
	M139.namespace(namespace, superClass.extend(
	/**@lends M2012.UI.RichInput.ItemView.prototype*/
	{
		/** 定义通讯录地址本组件代码
		 *@constructs M2012.UI.RichInput.ItemView
		 *@extends M139.View.ViewBase
		 *@param {Object} options 初始化参数集
		 *@param {String} options.type 地址本类型:email|mobile|fax|mixed
		 *@example
		 new M2012.UI.RichInput.ItemView({
			 text:"lifula@139.com",
			 richInput:richInput,
			 itemId:richInput.getNextItemId(),
			 errorMessage:"收件人格式不对"
		 }).render();
		 */
		initialize: function (options) {
			var $el = jQuery(options.template || this.template);

			this.setElement($el);

			var This = this;
			this.richInputBox = options.richInput;
			this.type = options.type;
			this.allText = options.text;

			if (this.type == "email" && /^\d+$/.test(this.allText)) {
				this.allText += "@139.com";
			}

			this.hashKey = this.addr = this.getAddr();
			this.account = $Email.getAccount(this.addr);
			this.domain = $Email.getDomain(this.addr);
			this.itemId = options.itemId;
			if (!this.addr) {
				this.error = true;
				this.errorMsg = options.errorMessage;
				this.$el.removeClass(this.selectedClass).addClass(this.errorClass);
			}
			if(this.richInputBox.errorfun){
				this.richInputBox.errorfun(this, this.allText);
				if(this.error)this.$el.removeClass(this.selectedClass).addClass(this.errorClass);
			}
			this.selected = false;

			return superClass.prototype.initialize.apply(this, arguments);
		},
		name: namespace,
		selectedClass: "btnNormal_write",
		errorClass:"btnError",
		otherClass:"btnOther",
		errorDomainClass:"addrDomainError",
		template: '<div class="addrBase addrBaseNew btnNormal_write" unselectable="on"><a href="javascript:;" class="addrBase_con"><b></b><span></span></a><a href="javascript:void(0);" class="addrBase_close" title="删除">x</a></div>',
		render: function () {
			var This = this;
			var title = this.error ? this.errorMsg : this.addr;
			var text = this.error ? this.allText : this.getName();

			//this.$el.text(text).attr("title", title).append("<span>;</span>");

			this.$el.attr("title", title);

			if (this.error) {
				this.$("b").text(this.allText);
			} else {
				if (this.allText.indexOf("<") > -1) {
					this.$("b").text(text);
					if(this.type == 'email'){
						this.$("span:eq(0)").html('&lt;' + this.account + '<span class="addrDomain">@' + this.domain + '</span>&gt;');
					}else{
						this.$("span:eq(0)").text("<" + this.getAddr() + ">");
					}
				} else {
					if(this.type == 'email'){
						this.$("b").html(this.account + "<span class='addrDomain'>@" + this.domain + "</span>");
					}else{
						this.$("b").text(this.allText);
					}
				}
			}

			this.$el.attr("rel", this.itemId);

			this.initEvents();

			//设置最大宽度
			if ($B.is.ie && $B.getVersion() < 8) {
				var containerWdith = this.richInputBox.$el.width();
				setTimeout(function () {
					var width = This.$el.width();
					if (width > 200 && (width + 10) > containerWdith) {
						This.$el.width(containerWdith - 10);
					}
				}, 0);
			}

			this.addDistinctBehavior("contact_insert");
			return superClass.prototype.render.apply(this, arguments);
		},
		/**
		 *初始化事件
		 *@inner
		 */
		initEvents:function(){
			this.$el.on("dblclick",$.proxy(this,"onDblclick"))
				.on("mouseenter", $.proxy(this, "onMouseEnter"))
				.on("mouseleave", $.proxy(this, "onMouseLeave"));

			this.on("select",function(){
				//this.$el.removeClass(this.selectedClass).addClass(this.selectedClass+"On");
				this.el.className = this.el.className.replace(/\bbtn\w+(?!On)/, function($0){return ($0+"On").replace("OnOn", "On")});
				//console.log("select: " + this.el.className);
			}).on("unselect",function(){
				//this.$el.removeClass(this.selectedClass+"On").addClass(this.selectedClass);
				this.el.className = this.el.className.replace(/\b(btn\w+)On/, function($0, $1){return $1});
				//console.log("unselected: " + this.el.className);
			}).on("errorDomain",function(){
				this.$el.attr("title", '该地址的域名可能不存在，请双击修改');
				this.$el.addClass(this.errorDomainClass + " " + this.otherClass);
			}).on("changeDomain",function(e){
				this.addr = this.addr.replace('@' + e.errorDomain,'@' + e.domain);
				this.allText = this.allText.replace('@' + e.errorDomain,'@' + e.domain);
				this.domain = e.domain;
				delete this.richInputBox.hashMap[this.hashKey];
				this.hashKey = this.addr;
				this.richInputBox.hashMap[this.hashKey] = this;
				this.$el.removeClass(this.errorDomainClass + " " + this.otherClass);
				this.$el.attr("title",this.addr);
				this.$el.find("span.addrDomain").html('@' + e.domain);
			});
		},
		/**
		 *@inner
		 */
		getAddr:function(){
			var addr = this.richInputBox.contactsModel.getAddr(this.allText, this.type);
			if (this.type == "email") {
				var domain = this.options.limitMailDomain;
				if (domain && $Email.getDomain(addr) !== domain) {
					addr = "";
				}
			}
			return addr;
		},
		/**
		 *@inner
		 */
		getName:function(){
			var name = this.richInputBox.contactsModel.getName(this.allText,this.type);
			return name;
		},

		/**
		 *选中该成员
		 */
		select: function() {
			var box = this.richInputBox;

			// 必须判断，否则触发很频繁
			if(this.selected == false) {
				this.addDistinctBehavior("contact_select");
				this.selected = true;
			}
 
			//todo remove to parentview
			if ($.browser.msie) { 
				var jTextBox = box.jTextBox;
				//鼠标划选的时候多次触发 有性能问题，所以延迟
				M2012.UI.RichInput.Tool.delay("ItemFocus", function() {
					box.focus();
				});
			} else if ($.browser.opera) {
				var scrollTop = box.container.parentNode.scrollTop;
				box.textbox.focus();
				box.container.parentNode.scrollTop = scrollTop;
			} else {
				box.focus();
			}
			this.trigger("select");
		},

		addDistinctBehavior: function(type){
			var prefix = this.richInputBox.comefrom;
			BH({key: prefix + "_" + type});
		},

		/**
		 *取消选中状态
		 */
		unselect: function() {
			this.selected = false;
			this.trigger("unselect");
		},
		/**
		 *移除元素
		 */
		remove: function() {
			//todo
			this.richInputBox.disposeItemData(this);
			return superClass.prototype.remove.apply(this, arguments);
		},

		/**
		 *双击执行编辑
		 *@inner
		 */
		onDblclick: function (e) {
			this.addDistinctBehavior("contact_dblclick");
			this.richInputBox.editItem(this);
		},

		onMouseEnter: function (e) {
			var self = this;
			var hover_close = false;
			if($(e.target).hasClass("addrBase_close")) {
				hover_close = true;
			}
			this.richInputBox.hoverItem = this;
			setTimeout(function(){
				if(self.richInputBox.hoverItem === self) {
					if(hover_close) {
						self.addDistinctBehavior("contact_hover_close");
					} else {
						self.addDistinctBehavior("contact_hover");
					}
				}
			}, 500);
		},

		onMouseLeave: function () {
			this.richInputBox.hoverItem = null;
		}
	}));
})(jQuery, _, M139);

﻿/**
 * @fileOverview 定义通讯录富文本框的插件
 */

(function (jQuery, _, M139) {
	var $ = jQuery;
	var namespace = "M2012.UI.RichInput.Plugin";
	M139.namespace(namespace,
	/**@lends M2012.UI.RichInput.Plugin */
	{
		AddrSuggest: function (richInput, maxItem) {
			M2012.Contacts.getModel().requireData(function () {
				richInput.addrSuggest = new M2012.UI.Suggest.AddrSuggest({
					textbox: richInput.textbox,
					filter: richInput.type,
					maxItem: maxItem
				}).on("select", function () {
					richInput.createItemFromTextBox();
				});
			});
		}
	});
})(jQuery, _, M139);
﻿/**
 * @fileOverview 定义通讯录富文本框的扩管文本框对象
 */

(function (jQuery, _, Backbone, M139) {
	var namespace = "M2012.UI.RichInput.TextBoxView";
	M139.namespace(namespace, Backbone.View.extend(
		/**@lends M2012.UI.RichInput.TextBoxView.prototype*/
		{
			/** 定义通讯录地址本组件代码
			 *@constructs M2012.UI.RichInput.TextBoxView
			 *@param {Object} options 初始化参数集
			 *@param {HTMLElement} options.element 托管的文本框对象
			 */
			initialize: function (options) {

				this.setElement(options.element);

				this.richInputBox = options.richInput;

				this.jTextBox = this.$("input");
				this.textbox = this.jTextBox[0];

				this.initEvent();
			},
			/**
			 *初始化事件
			 *@inner
			 */
			initEvent: function () {
				this.jTextBox.click($.proxy(this, "onClick"))
					.focus($.proxy(this, "onFocus"))
					.blur($.proxy(this, "onBlur"))
					.keydown($.proxy(this, "onKeyDown"))
					.keydown($.proxy(this, "onKeyUp"))
					.bind("paste", $.proxy(this, "onPaste"))
					.bind("cut", $.proxy(this, "onCut"));
				var This = this;
				M139.Timing.watchInputChange(this.textbox, function (e) {
					This.onChange(e);
				});
			},
			/**
			 *文本框内容变更时
			 *@inner
			 */
			onChange: function (e) {
				this.fixTextBoxWidth();
				this.trigger("input");
			},
			/**
			 *文本框根据内容自适应宽度
			 *@inner
			 */
			fixTextBoxWidth: function () {
				var jText = this.jTextBox;
				var minWidth = 10;
				if (jText.val() == "") {
					this.$el.width(minWidth);
					return;
				}
				if ($B.is.ie && $B.getVersion() < 10) {
					var width = jText[0].createTextRange().boundingWidth + 13;
				} else {
					//计算宽度
					var widthHelper = $("#widthHelper");
					if (widthHelper.length == 0) {
						widthHelper = $("<span id='widthHelper' style='position:absolute;left:0px;top:0px;visibility:hidden;'></span>");
						widthHelper.appendTo(document.body);
						widthHelper.css({
							fontSize: jText.css("font-size"),
							fontFamily: jText.css("font-family"),
							border: 0,
							padding: 0
						});
					}
					var width = widthHelper.text(jText.val().replace(/ /g, "1")).width() + 13;
					//fixed IE10下文本框会出来一个x
					//if ($B.is.ie && $B.getVersion() >= 10) {
					//	width += 20;
					//}
				}
				var maxWidth = this.richInputBox.$el.width() - 3;
				if (width > maxWidth) width = maxWidth;
				if (width < minWidth) width = minWidth;


				//设置最大宽度
				if ($B.is.ie && $B.getVersion() < 8) {
					if (width > 200) {
						var containerWdith = this.richInputBox.$el.width();
						if (width + 10 > containerWdith) {
							width = containerWdith - 10;
						}
					}
				}

				this.$el.width(width);
				jText.width(width);
			},

			setEditMode: function (itemView) {
				var jTextBox = this.jTextBox;
				this.richInputBox.editMode = true;
				jTextBox.attr("mode", "edit"); //防止自动触发blur
				setTimeout(function () {
					jTextBox.attr("mode", "");
				}, 0);
				jTextBox.val(itemView.allText);
				itemView.$el.replaceWith(this.$el);
				itemView.remove();
				
				M139.Dom.selectTextBox(this.textbox);
				this.fixTextBoxWidth();
			},

			setValue:function(value){
				this.textbox.value = value;
				this.fixTextBoxWidth();
			},

			/**
			 *粘贴
			 *@inner
			 */
			onPaste: function (e) {
				/*
				todo test
				if (window.navigator.userAgent.indexOf("Firefox") >= 0) {
					var This = this;
					setTimeout(function() {
						var text = This.value;
						This.value = "";
						This.value = text; //火狐下的文本框渲染bug
					}, 0);
				}
				*/
			},
			/**
			 *剪切
			 *@inner
			 */
			onCut: function (e) {
				/*
				todo
				var current = e.richInputBox;
				RichInputBox.Plugin.AutoAssociateLinkMan(current);
				*/
			},
			/**
			 *获得焦点
			 *@inner
			 */
			onFocus: function (e) {
				this.richInputBox.trigger("focus");
				if(this.richInputBox.highlight){
					this.richInputBox.jItemContainer.addClass('writeTable-txt-on');
				}
				/*
				todo
				if(e && e.richInputBox){
					var current = e.richInputBox;
					RichInputBox.Plugin.AutoAssociateLinkMan(current);
				}
				*/
			   // add by tkh
			   if(e && this.richInputBox.inputAssociateView){
					this.richInputBox.inputAssociateView.render();// add by tkh
			   }
			   
			   /*if(e && this.richInputBox.inputCorrectView){
					this.richInputBox.inputCorrectView.render();// add by yly
			   }*/
			},
			/**
			 *失去焦点
			 *@inner
			 */
			onBlur: function (e) {
				var current = this.richInputBox;
				if (this.jTextBox.attr("mode") == "edit") {
					this.jTextBox.attr("mode", "");
					return;
				}
				current.editMode = false;
				current.createItemFromTextBox();
				current.jItemContainer.removeClass('writeTable-txt-on');
				///console.log("blurrrrrrrrrrrrr..");
				// warn ! IE8鼠标在联系人上按下时，光标会继续闪动，即它还是焦点
				// 这导致触发光标的blur事件，导致无法选中。 (add by xiaoyu)
				//current.unselectAllItems();
			},
			/**
			 *点击
			 *@inner
			 */
			onClick: function (e) {
				if (e && e.richInputBox) e.richInputBox.clearTipText();
			},

			/**
			 *按键松开
			 *@inner
			 */
			onKeyUp: function (e) {
				this.fixTextBoxWidth();
			},
			/**
			 *键盘按下
			 *@inner
			 */
			onKeyDown: function (e) {
				var This = this;
				if (e.shiftKey || e.ctrlKey) return;
				var current = this.richInputBox;
				var Keys = M139.Event.KEYCODE;
				var textbox = this.textbox;
				this.fixTextBoxWidth();
				switch (e.keyCode) {
					case Keys.BACKSPACE:
						{
							return KeyDown_Backspace.apply(this, arguments);
						}
					case Keys.DELETE:
						{
							return KeyDown_Delete.apply(this, arguments);
						}
					case Keys.SEMICOLON:
					case Keys.COMMA:
					case Keys.ENTER:
						{
							return KeyDown_Enter.apply(this, arguments);
						}
					case Keys.LEFT:
						{
							return KeyDown_Left.apply(this, arguments);
						}
					case Keys.RIGHT:
						{
							return KeyDown_Right.apply(this, arguments);
						}
					case Keys.UP: case Keys.Down:
						{
							e.isUp = e.keyCode == Keys.Up;
							return KeyDown_Up_Down.apply(this, arguments);
						}
					case Keys.TAB:
						{
							return KeyDown_Tab.apply(this, arguments);
						}
				}
				function KeyDown_Backspace(e) {
					if (textbox.value == "") {
						if (current.getSelectedItems().length > 0) return;
						var item = current.getTextBoxPrevItem();
						if (item) item.remove();
						textbox.focus();
					}
				}
				function KeyDown_Delete(e) {
					if (textbox.value == "") {
						var item = current.getTextBoxNextItem();
						if (item) item.remove();
						textbox.focus();
					}
				}
				function KeyDown_Enter(e) {
					if (textbox.value.trim() != "") {
						setTimeout(function () {
							current.createItemFromTextBox();
						}, 0);
					}
					return false;
				}
				function KeyDown_Left(e) {
					if (textbox.value == "") {
						var item = current.getTextBoxPrevItem();
						if (item) {
							current.moveTextBoxTo(item.$el);
							return false;
						}
					}
				}
				function KeyDown_Right(e) {
					if (textbox.value == "") {
						var item = current.getTextBoxNextItem();
						if (item) {
							current.moveTextBoxTo(item.$el, true);
							return false;
						}
					}
				}
				function KeyDown_Up_Down(e) {
					if (textbox.value == "") {
						var offset = current.textboxView.offset();
						var nearItems = M2012.UI.RichInput.Tool.getNearlyElement({
							x: offset.left,
							y: offset.top + (e.isUp ? -5 : 20),
							richInputBox: current
						});
						if (nearItems) current.moveTextBoxTo(nearItems.element, nearItems.isAfter);
						return false;
					}
				}
				function KeyDown_Tab(e) {
					textbox.setAttribute("TabPress", "1");
					setTimeout(function () {
						textbox.setAttribute("TabPress", null);
					}, 0);
				}
			}
		}));
})(jQuery, _, Backbone, M139);
﻿/**
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

﻿/**
 * @fileOverview 定义输入自动提示组件
 */

(function(jQuery,Backbone,_,M139){
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    /***/
    M139.namespace("M2012.UI.Suggest.InputSuggest",superClass.extend(
    /**@lends M2012.UI.Suggest.InputSuggest.prototype */
    {
        /** 
        *输入自动提示组件
        *@constructs M2012.UI.Suggest.InputSuggest
        *@extends M139.View.ViewBase
        *@param {Object} options 初始化参数集
        *@param {HTMLElement} options.textbox 捕获文本框
        *@param {Function} options.onInput 捕获输入，该函数返回一个数组，表示要提示的项
        *@param {Function} options.onSelect 选择了其中一项（回车、或者鼠标点选）
        *@param {String} options.template 容器(提示菜单)的html模板
        *@param {String} options.itemTemplate
        *@param {String} options.itemPath
        *@param {String} options.itemInsertPath
        *@param {String} options.itemContentPath
        *@param {String} options.itemFocusClass
        *@example
        */
        initialize:function(options){
            options = _.defaults(options,DefaultStyle);

            var div = document.createElement("div");
            div.innerHTML = this.options.template;
            this.setElement(div.firstChild);

            this.onSelect = options.onSelect || this.onSelect;
            this.onInput = options.onInput || this.onInput;
            this.textbox = options.textbox;
            this.initEvent();

            superClass.prototype.initialize.apply(this,arguments);
        },

        /**@inner*/
        initEvent:function(){
            var options = this.options;
            var This = this;
            var jTb = jQuery(options.textbox);


            jTb.bind("keydown", function (e) {
                This.onTextBoxKeyDown(e);
            }).bind("change", function (e) {
                setTimeout(function () {
                    if (jTb.val() == "") {
                        This.hide();
                    }
                },10);
            });

            //由原本的监听keyup改为定时监控输入值
            M139.Timing.watchInputChange(options.textbox, function (e) {
                This.onTextBoxChange(e);
            });
            


            if (M139.Browser.is.ie) {
                //拖滚动条的时候阻止文本框失焦点
                this.$el.mousedown(function (e) {
                    jTb.attr("mode", "edit");
                    jTb.focus();
                }).mousemove(function () {
                    jTb.focus();
                });
                $(document).click(function (e) {
                    if (e.target != This.el) {
                        This.hide();
                    }
                });
            }else{
                jTb.bind("blur", function (e) {
                    This.hide();
                });
                this.$el.mousedown(function (e) {
                    //禁用默认事件，可以在鼠标拉滚动条的时候菜单不消失(ie除外)
                    M139.Event.stopEvent(e);
                });
            }
        },

        /**选中第几项（高亮),鼠标经过或者键盘选择*/
        selectItem:function(index){
            var item = typeof index == "number" ? this.getItem(index) : index;
            var last = this.getSelectedItem();
            if (last != null) this.utilBlurItem(last);
            this.utilFocusItem(item);

            var ele = item[0];
            this.utilScrollToElement(this.el,ele); //如果选中的项被遮挡的话则滚动滚动条
        },

        /**
         *获得需要滚动的元素
         *@inner
         */
        getScrollElement:function(){
            return this.el;
        },

        /**根据下标获得项*/
        getItem:function(index){
            return this.$el.find(this.options.itemPath+"[index='"+index+"']").eq(0);
        },

        /**获得当前提示的所有项*/
        getItems:function(){
            return this.$el.find(this.options.itemPath);
        },
        
        /**获得当前选中项*/
        getSelectedItem:function(){
            var sel = this.$el.find(this.options.itemPath+"[i_selected='1']");
            if(sel.length){
                return sel.eq(0);
            }else{
                return null;
            }
        },

        /**获得当前选中下标*/
        getSelectedIndex:function(){
            var item = this.getSelectedItem();
            if(item){
                return item.attr("index") * 1;
            }else{
                return -1;
            }
        },

        /**@inner*/
        onItemSelect:function(item){

            this.hide();

            var value = $(item).attr("data-value");
            if(jQuery.isFunction(this.onSelect)){
                this.onSelect(value);
            }

            this.textbox.value = value;

            this.textbox.setAttribute("mode", "");


            this.trigger("select",{value:value});
        },


        /**
         *显示提示列表,每次show默认会清除之前的item
         *@param {Array} list 提示数据项[{text:"",title:""}]
         */
        show:function(list){
            if (this.isShow) return;
            if (this.el.parentNode != document.body) {
                document.body.appendChild(this.el);
                //document.body.appendChild(bgIframe);
            }

            var This = this;
            
            this.clear();
            
            var options = this.options;
            for(var i=0,len = list.length;i<len;i++){
                var data = list[i];
                var item = jQuery(options.itemTemplate);
                item.attr("index",i);
                item.attr("data-value",data.value);
                item.find(options.itemContentPath).html(data.text);
                item.appendTo(this.$el.find(options.itemInsertPath));
                item.mousedown(onItemClick);
                item.mouseover(onItemMouseOver);
            }
            
            function onItemClick(){
                This.onItemSelect(this);
            }
            function onItemMouseOver(){
                This.selectItem(this.getAttribute("index")*1);
            }

            var offset = $(this.textbox).offset();
            var top = offset.top + $(this.textbox).height();
            
            var width = Math.max(this.textbox.offsetWidth, 400);
            var parent = $(this.textbox).parent().parent();
            var parentW = parent.offset().left + parent.width();
            var elW = offset.left + width;
            var left = elW > parentW ? offset.left - (elW - parentW) : offset.left;
            
            var height = list.length > 8 ? "300px" : "auto";
            
            //会话邮件写信页
            if(/conversationcompose/i.test(window.location.href)){
                height = list.length > 5 ? "125px" : "auto";
            }

            this.$el.css({
                width: width + "px",
                height: height,
                overflowY: "auto",
                top: top,
                left: left
            });

            //设置最高的建议浮层高度
            if (options.maxItem && options.maxItem > 0) {
                var maxLen = options.maxItem;
                var itemHeight = 24; //单个24px
                this.$el.css({
                    height: list.length > maxLen ? (itemHeight * maxLen) + "px" : "auto"
                });
            }

            this.selectItem(0); //显示的时候选中第一项
            this.isShow = true;
            superClass.prototype.show.apply(this,arguments);
        },

        /**隐藏菜单*/
        hide:function(){
            if (!this.isShow) return;
            this.el.style.display = "none";
            //bgIframe.style.display = "none";
            this.clear();
            this.isShow = false;
        },


        /**
         *修改选中项外观
         *@inner
         */
        utilFocusItem:function(item){
            item.attr("i_selected",1);
            item.css({
                backgroundColor: "#e8e8e8",//选中时候灰色
                color : "#444"
            });
            item.find("span").css("color", "#444");
        },

        /**
         *修改失去焦点项外观
         *@inner
         */
        utilBlurItem:function(item){
            item.attr("i_selected",0);
            item.css({
                backgroundColor : "",
                color : ""
            });
            item.find("span").css("color", "");
        },

        /**
         *如果选中的项被遮挡的话则滚动滚动条
         *@inner
         */
        utilScrollToElement:function(container,element){
            var elementView = {
                top: this.getSelectedIndex() * $(element).height()
            };
            elementView.bottom = elementView.top + element.offsetHeight
            var containerView = {
                top: container.scrollTop,
                bottom: container.scrollTop + container.offsetHeight
            };
            if (containerView.top > elementView.top) {
                container.scrollTop -= containerView.top - elementView.top;

            } else if (containerView.bottom < elementView.bottom) {
                container.scrollTop += elementView.bottom - containerView.bottom;
            }
        },

        /**清除所有提示项*/
        clear:function(){
            var op = this.options;
            if(op.itemInsertPath){
                this.$el.find(op.itemInsertPath).html("");
            }else if(op.itemPath){
                this.$el.find(op.itemPath).remove();
            }
        },

        /**
         *监听到文本框值变化时触发，同时触发oninput
         *@inner
         */
        onTextBoxChange: function (evt) {
            var keys = M139.Event.KEYCODE;
            switch (evt && evt.keyCode) {
                //case keys.ENTER:
                case keys.UP:
                case keys.DOWN:
                case keys.LEFT:
                case keys.RIGHT: return;
            }
            this.hide();
            var items = this.onInput(this.options.textbox.value.trim());

            if (items && items.length > 0) {
                this.show(items);
            }
        },

        /**
         *文本框键盘按下触发
         *@inner
         */
        onTextBoxKeyDown:function(evt){
            var This = this;
            var keys = M139.Event.KEYCODE;
            evt = evt || event;
            switch (evt.keyCode) {
                case keys.SPACE:
                case keys.TAB:
                case keys.ENTER: doEnter(); break;
                case keys.UP: doUp(); break;
                case keys.DOWN: doDown(); break;
                case keys.RIGHT:
                case keys.LEFT: this.hide(); break;
                default: return;
            }
            function doEnter() {
                var item = This.getSelectedItem();
                if (item != null) This.onItemSelect(item);
                if (evt.keyCode == keys.ENTER) {
                    M139.Event.stopEvent(evt);
                }
            }
            function doUp() {
                var index = This.getSelectedIndex();
                if (index >= 0) {
                    index--;
                    index = index < 0 ? index + This.getItems().length : index;
                    This.selectItem(index);
                }
                M139.Event.stopEvent(evt);
            }
            function doDown() {
                var index = This.getSelectedIndex();
                if (index >= 0) {
                    var len = This.getItems().length;
                    index = (index + 1) % len;
                    This.selectItem(index);
                }
                M139.Event.stopEvent(evt);
            }
        }
    }));

    var DefaultStyle = {
        template:['<div class="menuPop shadow" style="display:none;z-index:6024;padding:0;margin:0;">',
            '<ul></ul>',
        '</div>'].join(""),
        itemInsertPath:"ul",
        itemPath:"ul > li",
        itemTemplate:'<li style="width:100%;overflow:hidden;white-space:nowrap;"><a href="javascript:;"><span></span></a></li>',
        itemContentPath:"span:eq(0)"
    };
})(jQuery,Backbone,_,M139);
﻿/**
 * @fileOverview 定义输入自动提示组件
 */

(function(jQuery,Backbone,_,M139){
    var $ = jQuery;
    var superClass = M2012.UI.Suggest.InputSuggest;
    /***/
    M139.namespace("M2012.UI.Suggest.AddrSuggest",superClass.extend(
    /**@lends M2012.UI.Suggest.AddrSuggest.prototype */
    {
        /** 
        *输入自动提示组件
        *@constructs M2012.UI.Suggest.AddrSuggest
        *@extends M139.UI.Suggest.InputSuggest
        *@param {Object} options 初始化参数集
        *@param {String} options.filter 要筛选的通讯录数据类型
        *@param {HTMLElement} options.textbox 捕获文本框
        *@param {Boolean} options.onlyAddr 返回的值是否不包含署名，默认是flase
        *@example
        */
        initialize:function(options){
            this.contactModel = M2012.Contacts.getModel();
            this.filter = options.filter;
            this.onlyAddr = options.onlyAddr;
            superClass.prototype.initialize.apply(this,arguments);
        },
        /**
         *返回输入匹配的联系人，为基类提供数据
         *@inner
         */
        onInput:function(value){
            var result = [];
            if (value != "") {
                value = value.toLowerCase();
                var items = this.contactModel.getInputMatch({
                    keyword: value,
                    filter: this.filter
                });

                var inputLength = value.length;
                //防止重复
                var repeat = {};
                for (var i = 0; i < items.length; i++) {
                    var matchInfo = items[i];
                    var obj = matchInfo.info;
                    var addrText = "";
                    if (repeat[obj.addr + "|" + obj.name]) {
                        continue;
                    } else {
                        repeat[obj.addr + "|" + obj.name] = 1;
                    }
                    if (matchInfo.matchAttr == "addr") {
                        matchText = obj.addr.substring(matchInfo.matchIndex, matchInfo.matchIndex + inputLength);
                        addrText = obj.addr.replace(matchText, "[b]" + matchText + "[/b]");
                        addrText = "\"" + obj.name.replace(/\"/g, "") + "\"<" + addrText + ">";
                        addrText = M139.Text.Html.encode(addrText).replace("[b]", "<span style='font-weight:bold'>").replace("[/b]", "</span>");
                    } else if (matchInfo.matchAttr == "name") {
                        matchText = obj.name.substring(matchInfo.matchIndex, matchInfo.matchIndex + inputLength);
                        addrText = obj.name.replace(matchText, "[b]" + matchText + "[/b]");
                        addrText = "\"" + addrText.replace(/\"/g, "") + "\"<" + obj.addr + ">";
                        addrText = M139.Text.Html.encode(addrText).replace("[b]", "<span style='font-weight:bold'>").replace("[/b]", "</span>");
                    } else {
                        addrText = "\"" + obj.name.replace(/\"/g, "") + "\"<" + obj.addr + ">";
                        addrText = M139.Text.Html.encode(addrText);
                    }
                    var value = obj.addr;
                    if(!this.onlyAddr){
                        if(this.filter == "email"){
                            value = M139.Text.Email.getSendText(obj.name,obj.addr);
                        }else{
                            value = M139.Text.Mobile.getSendText(obj.name,obj.addr);
                        }
                    }
                    result.push({text:addrText,value:value,name:obj.name});
                }
                delete repeat;
            }
            return result;
        }
    }));

    jQuery.extend(M2012.UI.Suggest.AddrSuggest,
    /**@lends M2012.UI.AddrSuggest*/
    {
        /**
         *创建自动输入提示组件实例
         *@param {Object} options 参数集合
         *@param {HTMLElement} options.textbox 要捕获的文本框
         *@param {String} options.filter 要筛选的通讯录数据类型
         *@param {Number} options.maxItem 可选参数，一次最多显示几个，默认50个
         */
        create:function(options){
            var ui = new M2012.UI.Suggest.AddrSuggest(options);
            return ui;
        }
    });
})(jQuery,Backbone,_,M139);
﻿/**
 * @fileOverview 定义输入自动联想发件人组件
 */

(function(jQuery, Backbone, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	/***/
	M139.namespace("M2012.UI.Suggest.InputAssociate", superClass.extend(
	/**@lends M2012.UI.Suggest.InputAssociate.prototype */
	{
		/**
		 *输入自动联想发件人组件
		 *@constructs M2012.UI.Suggest.InputAssociate
		 *@extends M139.View.ViewBase
		 *@param {Object} options 初始化参数集
		 *@param {M2012.UI.RichInput.View} options.richInputBox 地址输入框组件
		 *@example
		 */
		initialize : function(options) {
			if(!options || !options.richInputBox) {
				console.log('创建自动联想发件人组件需要传入地址输入框组件实例！');
			}
			this.richInputBox = options.richInputBox;
			this.jContainer = options.richInputBox.jAddrTipsContainer;
			this.contactsModel = options.richInputBox.contactsModel;
			this.response = {
				isSuccess : true,
				requestEmail : '',
				emailList : []
			};
			this.responseCache = [];
			// 缓存响应结果
			this.emailsStr = '';
			// 请求参数：EmailList
			this.emailsStrCache = [];
			// 缓存请求参数：EmailList
			this.isWaiting = false;
			// 联想地址上限
			this.maxAddrs = 5;
			
			superClass.prototype.initialize.apply(this, arguments);
		},
		render : function() {
			var self = this;
			if(self.timeout){
				clearTimeout(self.timeout);
			}
			self.timeout = setTimeout(function() {
				var emails = self.richInputBox.getInputBoxItems();
				emails = emails.ASC();
				self.emailsStr = self.getEmailsStr(emails);
				var response = self.getResponse(self.emailsStr);
				if(response && response.isSuccess) {
					self.callback(response);
				} else if(emails.length > 0 && emails.length <= 20) {//多于20人不再联想
					self.emailsStrCache.push(self.emailsStr);
					if(!self.isWaiting) {
						self.emailsStr = self.emailsStrCache.pop();
						self.isWaiting = true;
						var request = "<GetAudienceEmailList><UserNumber>{0}</UserNumber><EmailList>{1}</EmailList></GetAudienceEmailList>";
						request = request.format(top.$User.getUid(), self.emailsStr);
						$RM.call("GetAudienceEmailList", request, function(response){
							self.successHandler(response.responseData);
						}, {error: self.error });
					}
				} else {
					if(self.jContainer.html().indexOf('您是否在找') > -1){
						self.jContainer.hide();
					}
				}
			}, 50);
		},
		/**
		 *根据请求参数requestEmail获得缓存中保存的响应
		 *@param requestEmail 请求参数
		 *@inner
		 */
		getResponse : function(requestEmail) {
			if(!requestEmail) {
				return;
			}
			var self = this;
			var responses = self.responseCache;
			for(var i = 0, rLen = responses.length; i < rLen; i++) {
				var response = responses[i];
				if(response.requestEmail == requestEmail) {
					return response;
				}
			}
		},
		/**
		 *根据请求地址输入框组件返回的邮件地址列表获取请求参数
		 *@param emails 邮件地址列表
		 *@inner
		 */
		getEmailsStr : function(emails){
			if(!emails){
				return '';
			}
			var tempArray = [];
			for(var i = 0;i < emails.length;i++){
				tempArray.push($T.Email.getEmail(emails[i]));
			}
			return tempArray.join(',');
		},
		/**
		 *请求接口成功后回调改函数
		 *@param responseObj 响应数据对象
		 *@inner
		 */
		successHandler : function(responseObj) {
			var self = this;
			self.isWaiting = false;
			// todo 测试数据
			// responseObj.EmailList = [{"Serialid":"980802114","Email":"346788382@qq.com"},{"Serialid":"1019969704","Email":"tongkaihong@163.com"},{"Serialid":"974791953","Email":"tongkaihong@richinfo.cn"}];
			if(responseObj && responseObj.EmailList) {
				self.response.isSuccess = true;
				self.response.requestEmail = self.emailsStr;
				self.response.emailList = responseObj.EmailList;
				self.responseCache.push(self.response);
				self.callback(self.response);
			}
		},
		/**
		 *请求接口成功后回调函数将调用该函数
		 *@param response 组装后的响应数据对象
		 *@inner
		 */
		callback : function(response) {
			var self = this;
			if(response.isSuccess) {
				var contactArr = response.emailList;
				var len = contactArr.length > self.maxAddrs ? self.maxAddrs : contactArr.length;
				if(len > 0) {
					var html = '您是否在找：';
					for(var i = 0; i < len; i++) {
						var contact = contactArr[i];
						if(i > 0){
							html += ',';
						}
						html += self.getContactHtml(contact);
					}
					var instances = M2012.UI.RichInput.instances;
		            for(var i=0;i<instances.length;i++){
		            	instances[i].jAddrTipsContainer.hide();
		            }
					self.jContainer.html(html).show();
					
					self.jContainer.unbind('click').bind('click', function(event) {
						var jEle = $(event.target);
						if(jEle[0].nodeName.toLowerCase() == 'a'){
							var rel = jEle.attr("rel");
							if(rel == "addrInfo") {
								self.richInputBox.insertItem(jEle.attr('title'));
								self.richInputBox.focus();
								// todo 行为统计
								//top.addBehavior('写信页-点击推荐的联系人');
								jEle.remove();
								var associates = self.jContainer.find("a[rel='addrInfo']");
					        	if(associates.size() == 0){
					        		self.jContainer.hide();
					        	}
							}
						}
					});
				} else {
					self.jContainer.hide();
				}
			}
		},
		/**
		 *请求接口失败后的回调函数
		 *@inner
		 */
		error : function() {
			this.isWaiting = false;
		},
		/**
		 *组装联想结果html
		 *@inner
		 */
		getContactHtml : function(contact) {
			var self = this;
			var serialid = contact.Serialid;
			var addr = contact.Email;
			var name = _getName();
			var nameLen = name.length;
			var addrText = name;
			if(nameLen > 12) {
				addrText = name.substring(0, 9) + "...";
			}
			var title = '"' + name.replace(/\"/g, '') + '"<' + addr + '>';
			var html = '<a href="javascript:;" hidefocus="1" title="' + $T.Html.encode(title) + '" rel="addrInfo">' + $T.Html.encode(addrText) + '</a>';
			return html;

			function _getName() {
				var contactById = self.contactsModel.getContactsById(serialid);
				var name = (contactById && contactById.name) ? contactById.name : '';
				if(!name) {
					// var lastLinkList = top.LastLinkList, linkMan = {};
					// for(var i = 0; i < lastLinkList.length; i++) {
						// linkMan = lastLinkList[i];
						// if(linkMan.addr == addr) {
							// name = linkMan.name;
							// break;
						// }
					// }
					//if(!name) {
						var contactByEmail = self.contactsModel.getContactsByEmail(addr);
						if(contactByEmail && contactByEmail.length > 0) {
							name = contactByEmail[0].name;
						}
					//}
				}
				return name ? name : addr.split('@')[0];
			}
		}
	}));
})(jQuery, Backbone, _, M139);

﻿/**
 * @fileOverview 定义输入收件人地址域名纠错组件
 */

(function(jQuery, Backbone, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    /***/
    M139.namespace("M2012.UI.Suggest.InputCorrect", superClass.extend(
    /**@lends M2012.UI.Suggest.InputCorrect.prototype */
    {
        /**
         *输入收件人地址域名纠错组件
         *@constructs M2012.UI.Suggest.InputCorrect
         *@extends M139.View.ViewBase
         *@param {Object} options 初始化参数集
         *@param {M2012.UI.RichInput.View} options.richInputBox 地址输入框组件
         *@example
         */
        initialize : function(options) {
            if(!options || !options.richInputBox) {
                console.log('创建收件人地址域名纠错组件需要传入地址输入框组件实例！');
            }
            this.richInputBox = options.richInputBox;
            this.jContainer = options.richInputBox.jAddrDomainTipsContainer;
			
            this.response = {
                isSuccess : true,
                requestDomain : '',
                suggestions : {}
            };
            this.responseCache = [];
            // 缓存响应结果
            this.domainsStr = '';
            // 请求参数：domain
            this.domainsStrCache = [];
            this.isWaiting = false;
            
            superClass.prototype.initialize.apply(this, arguments);
        },
		suggesDomainTemplate:"",
		callApi: M139.RichMail.API.call,
        render : function() {
            var self = this;
			if(self.timeout){
				clearTimeout(self.timeout);
			}
			self.timeout = setTimeout(function() {
				var domains = self.richInputBox.getInputBoxItemsDomain();
				domains = domains.ASC();
				self.domainsStr = domains.join(',');
				var response = self.getResponse(self.domainsStr);
				if(response && response.isSuccess) {
					self.callback(response);
				}else if(domains.length > 0) {
					self.domainsStrCache.push(self.domainsStr);
					if(!self.isWaiting){
						self.isWaiting = true;
						self.callApi("mbox:checkDomain",{domain:domains},function(response){
							self.successHandler(response.responseData);
						},{error: self.error});
					}
				}else{
					self.jContainer.hide();
				}
			}, 50);
			
        },
        /**
         *根据请求参数requestDomain获得缓存中保存的响应
         *@param requestDomain 请求参数
         *@inner
         */
        getResponse : function(requestDomain) {
			if(!requestDomain) {
				return;
			}
			var self = this;
			var responses = self.responseCache;
			for(var i = 0, rLen = responses.length; i < rLen; i++) {
				var response = responses[i];
				if(response.requestDomain == requestDomain) {
					return response;
				}
			}
        },
        /**
         *请求接口成功后回调改函数
         *@param responseObj 响应数据对象
         *@inner
         */
        successHandler : function(responseObj) {
            var self = this;
            self.isWaiting = false;
			if(responseObj && responseObj['var'] && responseObj['var'].suggestions) {
                self.response.isSuccess = true;
                self.response.requestDomain = self.domainsStr;
                self.response.suggestions = responseObj['var'].suggestions;
                self.responseCache.push(self.response);
                self.callback(self.response);
            }
        },
        /**
         *请求接口成功后回调函数将调用该函数
         *@param response 组装后的响应数据对象
         *@inner
         */
        callback : function(response) {
            var self = this;
			if(response.isSuccess) {
			    var html = '<p class="gray">我们发现您输入的地址可能有误，请修改：</p>';
				var domainHtml = [],i=0;
				var suggestions = response.suggestions;
				for(var domain in suggestions){
					i++;
					var sugDomains = suggestions[domain];
					self.richInputBox.showErrorDomain(domain);
					domainHtml.push(self.getDomainHtml(domain,sugDomains));
				}
				if(i>0) {
					html += domainHtml.join('');
					this.jContainer.html(html).show();
					this.bindClickEvent();
				}else{
					this.jContainer.hide();
				}
			}
        },
		bindClickEvent:function(){
			var self = this;
			self.jContainer.unbind('click').bind('click', function(event) {
				var jEle = $(event.target);
				if(jEle[0].nodeName.toLowerCase() == 'a'){
					var rel = jEle.attr("rel");
					if(rel == "domain") {
						var domain = jEle.attr('domain');
						var errorDomain = jEle.parent().attr('domain');
						self.richInputBox.changItemDomain(errorDomain,domain);
						jEle.parent().remove();
						if(self.jContainer.find('p').length == 1){
							self.jContainer.hide();
						}
						top.BH('compose_emaildomain_correct');
					}
				}
			});
		},
		getDomainHtml : function(errDomain,sugDomains){
			var html = '<p domain="{errDomain}">{errDomain} → {sugDomainHtml}</p>';
			var sugDomainHtml = [];
			for(var i=0; i<sugDomains.length; i++){
				if(i>0) sugDomainHtml.push('，');
				sugDomainHtml.push('<a href="javascript:;" hidefocus="1" rel="domain" domain='+ sugDomains[i] +'>'+ sugDomains[i] +'</a>');
			}
			return $T.format(html,{errDomain:errDomain,sugDomainHtml:sugDomainHtml.join('')});
		},
        /**
         *请求接口失败后的回调函数
         *@inner
         */
        error : function() {
            this.isWaiting = false;
        }
    }));
})(jQuery, Backbone, _, M139);

﻿/**
 * @fileOverview 定义通讯录地址本组件Model对象
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.Model.ModelBase;
    var namespace = "M2012.UI.Widget.Contacts.Model";
    M139.namespace(namespace, superClass.extend(
    /**@lends M2012.UI.Widget.Contacts.Model.prototype*/
    {
        /** 弹出菜单组件
         *@constructs M2012.UI.Widget.Contacts.Model
         *@extends M139.Model.ModelBase
         *@param {Object} options 初始化参数集
         *@param {String} options.filter 过滤的数据类型:email|mobile|fax
         *@param {Boolean} options.selectMode 如果是对话框选择模式，则增加一些功能
         *@example
         var model = new M2012.UI.Widget.Contacts.Model({
             filter:"email"
         });
         */
        initialize: function (options) {
            options = options || {};

            if (top.$App) {
                this.contactsModel = window.top.$App.getModel("contacts");
            } else {
                this.contactsModel = M2012.Contacts.getModel();
            }

            this.filter = options.filter;
            this.colate = options.colate; //change by Aerojin 2014.06.09 过滤非本域用户

            if (options.selectMode) {
                this.selectedList = [];
            }

            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: namespace,

        dataReady: function (callback) {
            var This = this;
            this.contactsModel.requireData(function () {
                This.contactsData = This.contactsModel.get("data");
                callback();
            });
        },

        /**
         *重构收敛了添加选中联系人的方法
         */
        addSelectedItem: function (item) {
            //无filter，默认按serialId进行对比判同，在通讯录分组选择框中使用
            var compare = _.isUndefined(this.filter) ? item.serialId : item.addr;

            if(this.isSelectedItem(compare)){
                return false;
            }else{
                this.selectedList.push(item);
                return true;
            }
        },
        /**
         *获得组列表
         */
        getGroupList: function () {
            return this.contactsModel.getGroupList();
        },
        /**
         *获得读信联系人组id added by tj
         */
        getReadGroupId: function () {
            var groupList = this.getGroupList();
            for (var i = 0; i < groupList.length; i++) {
                if (groupList[i].name == "读信联系人") {
                    return groupList[i].id;
                }
            }
        },
        /**
         *获得组联系人
         */
        getGroupMembers: function (gid,options) {
            options = options || {};
            //change by Aerojin 2014.06.09 过滤非本域用户
            var contacts =  this.contactsModel.getGroupMembers(gid, {
                filter: this.filter || this.colate,
                colate: this.colate
            });
            if(options.getSendText){
                for(var i=0,len=contacts.length;i<len;i++){
                    if(this.filter == "email"){
                        contacts[i] = contacts[i].getEmailSendText();
                    }else if(this.filter == "mobile"){
                        contacts[i] = contacts[i].getMobileSendText();
                    } else if (this.filter == "fax") {
                        contacts[i] = contacts[i].getFaxSendText();
                    }
                }
            }
            return contacts;
        },


        /**
         * 获得最近联系人。先按内容与SerialId查找到联系人，然后再按条件获得联系方式，注意尽量保持原始的AddrContent
         */
        getLastestContacts: function (data) {
            var contacts = data || this.contactsData.lastestContacts;
            var result = [], ct;
            if (this.filter == "fax") {
                return result;//传真没实现最近紧密联系人
            }
            var addrType = this.filter == "email" ? "E" : "M";
            for (var i = 0, len = contacts.length; i < len; i++) {
                var c = contacts[i];
                var addrcontent = c.AddrContent;

                if (!/\d{5,}/.test(c.SerialId)) {
                    if (c.AddrType == "E") {
                        ct = this.contactsModel.getContactsByEmail(c.AddrContent)[0];
                    } else if (c.AddrType == "M") {
                        ct = this.contactsModel.getContactsByMobile(c.AddrContent)[0];
                    }
                } else {
                    ct = this.contactsData.contactsMap[c.SerialId];
                }

                if (ct) {
                    if (this.filter === "email" && c.AddrType !== "E") {
                        //条件是电邮，但是是通过手机号查找到的联系人，则取出第一电邮替代通讯方式
                        addrcontent = ct.getFirstEmail();
                        if (!addrcontent) {
                            ct = false;
                        }
                    } else if (this.filter === "mobile" && c.AddrType !== "M") {
                        addrcontent = ct.getFirstMobile();
                        if (!addrcontent) {
                            ct = false;
                        }
                    }
                }

                if (ct) {
                    result.push({
                        addr: addrcontent,
                        name: ct.name,
                        SerialId: ct.SerialId
                    });
                } else if (c.AddrType == addrType) {
                    var rndId = this.createLastContactsId();
                    this.lastContactsMap[rndId] = {
                        addr: c.AddrContent,
                        name: c.AddrName,
                        SerialId: rndId
                    };
                    result.push(this.lastContactsMap[rndId]);
                }
            }
            return result;
        },

        /**
         *生成一个假的联系人id，为了兼容一些不存在于通讯录中的最近联系人
         */
        createLastContactsId:function(){
            var rnd = parseInt(Math.random() * 100000000);
            return -rnd;
        },

        lastContactsMap: {},

        /**
         *获得紧密联系人
         */
        getCloseContacts: function () {
            var contacts = this.contactsData.closeContacts;
            return this.getLastestContacts(contacts);
        },
        /**
         *获得未分组联系人
         */
        getUngroupContacts: function (allContacts) {
            var contactsMap = this.contactsData.contactsMap;
            var noGroup = this.contactsData.noGroup;
            var result = [];
            //change by Aerojin 2014.06.18 过滤非本域用户
            for (var i = 0, len = noGroup.length; i < len; i++) {
                var c = contactsMap[noGroup[i]];
                if (this.colate && c && c.getFirstEmail().indexOf(this.colate) > -1) {
                    result.push(c);
                } else if (!this.colate && c) {
                    result.push(c);
                }
            }
            return result;
        },
        /**搜索联系人*/
        getSearchContacts: function () {
            var result = this.contactsModel.search(this.get("keyword"), {
                contacts: this.getContacts()
            });
            return result;
        },
        /**获得联系人*/
        getContacts: function () {
            var contacts = this.get("contacts");
            if (!contacts) {
                var contacts = this.contactsData.contacts;
                if (this.filter || this.colate) {
                    contacts = this.contactsModel.filterContacts(contacts, { filter: this.filter || this.colate, colate: this.colate }); //change by Aerojin 2014.06.09 过滤非本域用户
                }                
                this.set("contacts", contacts);
            }
            return contacts;
        },
        /**获得vip联系人*/
        getVIPContacts: function () {
            return this.contactsModel.getGroupMembers(this.contactsModel.getVIPGroupId(), { filter: this.filter });
        },
        /**获得vip分组id*/
        getVIPGroupId: function () {
            return this.contactsModel.getVIPGroupId();
        },
        getContactsById: function (cid) {
            if (cid > 0) {
                var item = this.contactsModel.getContactsById(cid);
                if (item) {
                    var email = item.getFirstEmail();
                    return {
                        //this.filter=undefined时,返回邮箱,以解决编辑/新建组手机号码为空的用户无法加入到组.--可能存在BUG--
                        addr: this.filter == "email" ? email : (item.getFirstMobile() || email),
                        name: item.name,
                        SerialId: item.SerialId
                    };
                } else {
                    return null;
                }
            } else {
                return this.lastContactsMap[cid];
            }
        },
        isSelectedItem:function(addr){
            var list = this.selectedList;
            for(var i=0,len = list.length;i<len;i++){
                if(list[i].addr == addr || list[i].SerialId == addr){
                    return true;
                }
            }
            return false;
        },
        getSendText:function(name,addr){
            return this.contactsModel.getSendText(name,addr);
        },

        /**清空最近联系人记录*/
        clearLastContacts: function (isClose) {
            var This = this;
            //todo 这是老的代码移植过来
            var param = {
                type: isClose ? "close" : "last"
            };
            var Msg = {
                warn_delclose: "确认清空所有紧密联系人记录？",
                warn_dellast: "确认清空所有最近联系人记录？"
            };
            top.$Msg.confirm(Msg['warn_del' + param.type], function () {
                top.addBehavior("19_9561_11清空最近/紧密", isClose ? "2" : "1");
                top.Contacts.EmptyLastContactsInfo(param, function (result) {
                    if (result.success) {
                        /**
                         *@event#M2012.UI.Widget.Contacts.Model
                         */
                        This.trigger("contactshistoryupdate");
                    } else {
                        top.$Msg.alert(result.msg);
                    }
                });
            }, {
                icon:"warn"
            });
        },

        /**清空紧密联系人记录*/
        clearCloseContacts:function(){
            this.clearLastContacts(true);
        },

        /**
         *重新加载通讯录数据
         */
        reloadContactsData: function () {
            this.contactsModel.loadMainData();
        }
    }));

})(jQuery, _, M139);
﻿/**
 * @fileOverview 定义通讯录地址本组件代码
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.Widget.Contacts.View";

    var GroupsId = {
        //所有联系人
        All: -1,
        //未分组
        Ungroup: -2,
        //最近联系人
        Lastest: -3,
        //紧密联系人
        Close: -4,
        Search: -5
    };

    M139.namespace(namespace, superClass.extend(
    /**@lends M2012.UI.Widget.Contacts.View.prototype*/
    {
        /** 定义通讯录地址本组件代码
         *@constructs M2012.UI.Widget.Contacts.View
         *@extends M139.View.ViewBase
         *@param {Object} options 初始化参数集
         *@param {String} options.type 地址本类型:email|mobile|fax|mixed
         *@param {Object} options.model model对象，为组件提供数据支持
         *@param {String} options.template 组件的html代码
         *@param {Boolean} options.showSelfAddr 是否显示发给自己，默认是true
         *@param {Boolean} options.showCreateAddr 是否显示添加联系人，默认是true 
         *@param {Boolean} options.showAddGroup 是否显示添加整组的图标，默认是true 
         *@param {Boolean} options.showLastAndCloseContacts 是否显示最近紧密联系人，默认是true 
         *@param {String} options.maxCount 最大添加个数
         *@example
         new M2012.UI.Widget.Contacts.View({
             container:document.getElementById("addrContainer"),
             filter:"email"
         }).render().on("select",function(e){
             if(e.isGroup){
                 alert(e.value.length);
             }else{
                 alert(e.value);
             }
         });
         */
        initialize: function (options) {
            var This = this;
            this.filter = options.filter;
            this.selectMode = options.selectMode;
            this.showCountElFlag = options.comefrom == 'compose_addrinput' ? 'none' : '';
            //change by Aerojin 2014.06.09 过滤非本域用户
            this.model = new M2012.UI.Widget.Contacts.Model({
                filter: this.filter,
                colate: options.colate,
                selectMode: this.selectMode
            });
            var el = $D.getHTMLElement(options.container);
            el.innerHTML = this.template;
            if(options.width !== "auto") {
            	el.style.width = "191px";
            }
            this.setElement(el);
            this.model.dataReady(function () {
                This.render();
                clearTimeout(timer);
            });

            //3秒后显示重试按钮
            var timer = setTimeout(function () {
                This.showRetryDiv();
            }, 3000);

            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: namespace,
        retryCount: 0, //用户点击重新加载联系人的次数
        MemberFirstSize: 10, //分组里首次显示最多几个联系人
        MemberPageSize: 500,//分组里每次显示最多几个联系人，点更多加载更多
        template: ['<div class="AddrEmptyTip ta_c loadingerror" style="height:280px;padding:80px 0 0 0">',
        '<div class="LoadingImage" style="padding-top:50px;"><img src="/m2012/images/global/searchloading.gif" /></div>',
            '<div class="bodyerror RetryDiv" style="display:none">',
 		        '<img src="../images/global/smile.png" width="73" height="72">',
 		        '<p>没加载出来，再试一次吧。</p>',
 		        '<a class="btnTb BtnRetry" href="javascript:"><span class="p_relative">重新加载</span></a>',
 	        '</div>',
 		'</div>',
        '<div class="ContentDiv tabContent p_relative" style="display:none;">',
 	    '<div class="searchContact">',
 	      '<input type="text" class="searchContactText">',
 	      '<a hidefocus="1" href="javascript:;" class="searchContactBtn"><i class="i_c-search"></i></a>',
 	    '</div>',
        '<div class="searchEnd-empty SearchEmptyTip" style="display:none">',
            '<a href="javascript:" class="delmailTipsClose BtnCloseSearchEmptyTip"><i class="i_u_close"></i></a>',
            '<p class="gray">查找结果：</p>',
            '<p>没有符合条件的联系人</p>',
        '</div>',
 	    '<div class="searchEnd" style="display:none">',
 		    '<ul class="contactList">',
            '<li data-groupId="-5"><a hidefocus="1" class="GroupButton contactList_a" href="javascript:;" title="显示或隐藏成员列表"><i class="i_plusj"></i><span>搜索结果</span><var></var></a>',
            '<ul class="pb_5">',
               //'<li><a href="javascript:void(0)">18688959302</a></li>',
             '</ul>',
            '</li>',
            '</ul>',
 	    '</div>',
         '<ul class="contactList GroupList">',
           
         '</ul>',
         '<div class="contactListNew">',
		    '<a bh="compose_addressbook_createcontacts" hidefocus="1" class="AddNewContacts" href="javascript:;">+ 新建联系人</a>',
		 '</div>',
        '</div>'].join(""),
        GroupItemTemplate: [
            '<li data-groupId="{groupId}">',
             '<a title="{clearGroupTitle}" href="javascript:;" style="display:{showClearGroup}" class="i_r_yq2 i_dels ClearGroup"></a>',
             '<a bh="compose_addressbook_addgroupclick" hidefocus="1" style="display:{showAddGroup}" title="添加整组" href="javascript:;" class="i_r_yq2 AddGroup"></a>',
             '<a bh="{behavior}" hidefocus="1" class="GroupButton contactList_a" href="javascript:;" title="显示或隐藏成员列表">',
                 '<i class="i_plusj"></i>',
                 '<span>{groupName}</span>',
                 '<var style="display:{showCountEl}">({count})</var>',
                 '</a>',
             '<ul class="pb_5" style="display:none"></ul>',
           '</li>'].join(""),
        MemberItemTemplate: '<li style="display:{display}" class="ContactsItem" data-addr="{addr}" data-contactsId="{contactsId}"><a hidefocus="1" href="javascript:void(0)" title="{addrTitle}">{contactsName}</a></li>',
        //联系人容器dom
        GroupContainerPath: "ul.GroupList",
        events: {
            "click .GroupButton": "onGroupButtonClick",
            "click .LoadMoreMember": "onLoadMoreMemberClick",
            "click .ContactsItem": "onContactsItemClick",
            "click .searchContactBtn": "onClearSearchInput",
            "click .AddGroup": "onAddGroupClick",
            "click .SendToMySelf": "onSendToMySelfClick",
            "click .AddNewContacts": "onAddNewContactsClick",
            "click .BtnCloseSearchEmptyTip": "hideGroupEmptyTip",
            "click .BtnRetry": "onRetryClick",
            "click .ClearGroup": "onClearGroupClick"
        },
        /**构建dom函数*/
        render: function () {
            var options = this.options;

            this.clearSearchButton = this.$("a.searchContactBtn");

            this.$(".AddrEmptyTip").hide();

            this.renderGroupListView();

            this.initEvent();

            if (options.showSelfAddr === false) {
                this.$(".SendToMySelf").hide();
            }
            if (options.showCreateAddr === false) {
                this.$(".contactListNew").hide();
            }
            this.$("div.ContentDiv").show();
            this.render = function () {
                return this;
            }

            return superClass.prototype.render.apply(this, arguments);
        },

        /**
         *加载联系组界面
         *@inner
         */
        renderGroupListView: function () {
            var groups = this.model.getGroupList();
            var htmlCode = ['<li class="SendToMySelf contactList_a"><a bh="compose_addressbook_sendself" hidefocus="1" href="javascript:void(0)">发给自己</a></li>'];
            var template = this.GroupItemTemplate;

            if (this.options.showLastAndCloseContacts !== false) {

                //最近联系人
                htmlCode.push(M139.Text.format(template, {
                    groupId: GroupsId.Lastest,
                    groupName: "最近联系人",
                    clearGroupTitle:"清空最近联系人记录",
                    showCountEl: this.showCountElFlag,
                    count: this.model.getLastestContacts().length,
                    behavior: "compose_addressbook_lastcontacts",
                    showAddGroup: "none",
                    showClearGroup: ""
                }));

                //紧密联系人
                htmlCode.push(M139.Text.format(template, {
                    groupId: GroupsId.Close,
                    groupName: "紧密联系人",
                    clearGroupTitle: "清空紧密联系人记录",
                    showCountEl: this.showCountElFlag,
                    count: this.model.getCloseContacts().length,
                    behavior: "compose_addressbook_closecontacts",
                    showAddGroup: "none",
                    showClearGroup: ""
                }));
            }
            //所有联系人
            htmlCode.push(M139.Text.format(template, {
                groupId: GroupsId.All,
                groupName: "所有联系人",
                showCountEl: this.showCountElFlag,
                count: this.model.getContacts().length,
                behavior: "compose_addressbook_allcontacts",
                showAddGroup: "none",
                showClearGroup: "none"
            }));

            //未分组联系人
            htmlCode.push(M139.Text.format(template, {
                groupId: GroupsId.Ungroup,
                groupName: "未分组",
                showCountEl: this.showCountElFlag,
                count: this.model.getUngroupContacts().length,
                behavior: "compose_addressbook_ungroup",
                showAddGroup: "none",
                showClearGroup: "none"
            }));
            if (this.options.showVIPGroup !== false) {
                //vip联系人
                htmlCode.push(M139.Text.format(template, {
                    groupId: this.model.getVIPGroupId(),
                    groupName: "VIP联系人",
                    showCountEl: this.showCountElFlag,
                    count: this.model.getGroupMembers(this.model.getVIPGroupId()).length,
                    behavior: "compose_addressbook_vip",
                    showAddGroup: this.options.showAddGroup === false ? "none" : "",
                    showClearGroup: "none"
                }));
            }
            for (var i = 0, len = groups.length; i < len; i++) {
                var g = groups[i];
                var members = this.model.getGroupMembers(g.id).length;
                var showAddGroup = this.options.showAddGroup === false ? "none" : "";
                var h = null;

                //读信联系人特别处理上报
                if (g.name == "读信联系人") {
                    h = M139.Text.format(template, {
                        groupId: g.id,
                        groupName: M139.Text.Html.encode(M139.Text.Utils.getTextOverFlow(g.name, 6, true)),
                        showCountEl: this.showCountElFlag,
                        count: members,
                        behavior: "compose_addressbook_readcontacts",
                        showAddGroup: showAddGroup,
                        showClearGroup: "none"
                    });
                }
                else {
                    h = M139.Text.format(template, {
                        groupId: g.id,
                        groupName: M139.Text.Html.encode(M139.Text.Utils.getTextOverFlow(g.name, 6, true)),
                        showCountEl: this.showCountElFlag,
                        count: members,
                        behavior: "compose_addressbook_customcontacts",
                        showAddGroup: showAddGroup,
                        showClearGroup: "none"
                    });
                }
                htmlCode.push(h);
            }
            htmlCode = htmlCode.join("");
            this.$(this.GroupContainerPath)[0].innerHTML = htmlCode;

            if (this.options.showSelfAddr === false) {
                this.$(".SendToMySelf").hide();
            }
        },
        /**
         *初始化事件行为
         *@inner
         */
        initEvent: function () {
            var This = this;
            //切换展开组
            this.model.on("change:currentGroup", function (model, gid) {
                var oldGid = model.previous("currentGroup");
                if (oldGid != null) {
                    this.hideGroupMember(oldGid);
                }
                if (gid) {
                    this.showGroupMember(gid);
                }
            }, this);

            //最近紧密联系人记录清除后
            this.model.on("contactshistoryupdate", function () {
                This.updateView();
            });

            //监听搜索框输入
            var input = this.$("input")[0];
            M139.Timing.watchInputChange(input, function () {
                This.onSearchInputChange(input.value);
            });

            //选择模式下，选中的联系人左边列表要隐藏
            if (this.selectMode) {
                this.on("additem", function (e) {
                    var addr = [];
                    if (!e.isGroup) {
                        e.SerialId = e.serialId;
                        addr = [e];
                    } else {
                        addr = e.value;
                    }

                    if (This.filter) {
                        for (var i=0; i<addr.length; i++) {
                            if(addr[i].addr && addr[i].addr.length){
                                This.utilGetMemberElement(addr[i].addr).hide();
                            }else{
                                This.utilGetMemberElementById(addr[i].serialId).hide();
                            }
                        }
                    } else {
                        for (var i=0; i<addr.length; i++) {
                            This.utilGetMemberElementById(addr[i].serialId).hide();
                        }
                    }
                });
                this.on("removeitem", function (e) {
                    if (This.filter) {
                        if(e && e.addr.length){     
                            This.utilGetMemberElement(e.addr).show();
                        }else{
                            This.utilGetMemberElementById(e.serialId).hide();
                        }
                    } else {
                        This.utilGetMemberElementById(e.serialId).show();
                    }
                });
            }

            this.on("print", function () {
                this.model.set("currentGroup", GroupsId.Lastest);
            });

        },
        /**@inner*/
        showGroupEmptyTip:function(){
            this.$(".SearchEmptyTip").show();
        },
        /**@inner*/
        hideGroupEmptyTip:function(){
            this.$(".SearchEmptyTip").hide();
        },

        /**
         *显示重试按钮
         *@inner
        */
        showRetryDiv: function () {
            var This = this;
            This.$(".LoadingImage").hide();
            This.$(".RetryDiv").show();

            if (This.retryCount > 1) {
                var total = -1, arrlength = -1, glength = -1, datstr = "hasdata";
                var cmodel = This.model.contactsModel || {};
                if (cmodel.get) {
                    var data = cmodel.get("data");
                    if (_.isUndefined(data)) {
                        datstr = "nodata";
                    } else {
                        total = data.TotalRecord;
                        if ($.isArray(data.Contacts)) {
                            arrlength = data.Contacts.length;
                        }
                        if ($.isArray(data.Groups)) {
                            glength = data.Groups.length;
                        }
                    }
                }

                This.logger.error($TextUtils.format('addrlist retry fail|filter={0}|mode={1}|retry={2}|data={3}|isLoading={4}|total={5}|contacts={6}|groups={7}',
                    [This.filter, This.selectMode, This.retryCount, datstr, cmodel.isLoading, total, arrlength, glength]));
            }
        },

        /**@inner*/
        renderMemberView: function (gid, mode) {
            var container = this.utilGetMemberContainer(gid);
            var containerInit = container.attr("init") || 0;
            if (mode == "init" && container.attr("init") == 1) {
                return;
            }

            //显示组成员
            var htmlCode = [];
            var template = this.MemberItemTemplate;
            var contacts;
            if (gid == GroupsId.All) {
                contacts = this.model.getContacts();
            } else if (gid == GroupsId.Lastest) {
                contacts = this.model.getLastestContacts();
            } else if (gid == GroupsId.Close) {
                contacts = this.model.getCloseContacts();
            } else if (gid == GroupsId.Ungroup) {
                contacts = this.model.getUngroupContacts();
            } else if (gid == GroupsId.Search) {
                contacts = this.model.getSearchContacts();
            } else {
                contacts = this.model.getGroupMembers(gid);
            }

            if (gid == GroupsId.Search && contacts.length == 0) {
                //显示搜索结果为空的提示
                this.showGroupEmptyTip();
                this.switchGroupMode();
            } else {
                this.hideGroupEmptyTip();
            }


            //一共几个联系人
            var total = contacts.length;
            //当前已显示几个
            var showCount = container.find("li[data-addr]").length;
            //一次追加几个
            var pageSize = containerInit == 1 ? this.MemberPageSize : this.MemberFirstSize;

            //分页显示的，每次显示10个，点击更多每次新显示10
            for (var i = showCount, len = Math.min(showCount + pageSize, total) ; i < len; i++) {
                var c = contacts[i];
                var addr = c.addr || this.getAddr(c);//最近联系人直接有addr属性，联系人对象需要获取
                var addrText = M139.Text.Html.encode(addr);

                if (!this.filter){
                    addr = c.SerialId;
                }

                var isDisplay = !(this.selectMode && this.model.isSelectedItem(addr))

                htmlCode.push(M139.Text.format(template, {
                    contactsId: c.SerialId,
                    contactsName: M139.Text.Html.encode(c.name),
                    addr: addrText,
                    addrTitle: addrText,
                    display: isDisplay ? "" : "none"
                }));
            }
            //如果还没显示完
            if (showCount + pageSize < total) {
                htmlCode.push('<li class="LoadMoreMember" data-groupId="'
                    + gid + '"><a hidefocus="1" href="javascript:;">更多<span class="f_SimSun">↓</span></a></li>');
            }
            htmlCode = htmlCode.join("");
            container.append(htmlCode);
            container.attr("init", 1);//表示已经加载过一次数据了
        },
        /**@inner*/
        onLoadMoreMemberClick: function (e) {
            $(M139.Dom.findParent(e.currentTarget, "li")).hide();
            var gid = this.utilGetClickGroupId(e);
            this.renderMemberView(gid);
        },


        /**@inner*/
        onClearSearchInput: function () {
            top.BH('compose_addressbook_search');
            var txt = this.$("input:text");
            if (this.$(".searchContact").hasClass("searchContact-on")) {
                txt.val("");
            }
            this.hideGroupEmptyTip();
            txt.focus();           
        },

        /**
         *搜索框输入值变化
         *@inner
         */
        onSearchInputChange: function (value) {
            if (value == "") {
                this.switchGroupMode();
                this.$(".searchContact").removeClass("searchContact-on");
            } else {
                this.renderSearchView(value);
                this.$(".searchContact").addClass("searchContact-on");
                this.trigger('BH_onSearch');
            }
        },

        /**
         *从搜索视图返回正常视图
         *@inner*/
        switchGroupMode: function () {
            this.$(".searchEnd").hide();
            this.$(".GroupList").show();
        },

        /**@inner*/
        renderSearchView: function (keyword) {
            this.$(".GroupList").hide();
            this.$(".searchEnd").show();
            this.$(".searchEnd li ul").html("").attr("init", 0);
            this.model.set("keyword", keyword);
            this.model.set("currentGroup", null);//否则不会触发change:currentGroup
            this.model.set("currentGroup", GroupsId.Search);
        },
        /**@inner*/
        onGroupButtonClick: function (e) {
            var gid = this.utilGetClickGroupId(e);
            var currentGid = this.model.get("currentGroup");
            if (currentGid == gid) {
                this.model.set("currentGroup", null);
            } else {
                this.model.set("currentGroup", gid);
            }
        },

        /**
         *点击发给自己
         *@inner
        */
        onSendToMySelfClick: function () {
            var name = top.$User.getTrueName();
            if(this.filter == "email"){
                var addr = top.$User.getDefaultSender();
            }else if(this.filter == "mobile"){
                var addr = top.$User.getShortUid();
            }
            var sendText = this.model.getSendText(name,addr);
            var result = {
                value:sendText,
                name:name,
                addr:addr
            };
            if (this.selectMode) {
				if (this.model.selectedList.length >= this.options.maxCount) {
                    this.trigger("additemmax");
                } else {
				    var ok = this.model.addSelectedItem(result);
				    ok && this.trigger("additem", result);
                }
            } else {
                this.trigger("select", result);
            }
        },


        /**@inner*/
        showGroupMember: function (gid) {
            this.renderMemberView(gid, "init");
            //显示成员容器
            this.utilGetMemberContainer(gid).show();
            //折叠+变-
            this.utilGetGroupElement(gid).find("a.GroupButton i").addClass("i_minus");
        },
        /**@inner*/
        hideGroupMember: function (gid) {
            //隐藏成员容器
            this.utilGetMemberContainer(gid).hide();
            //折叠-变+
            this.utilGetGroupElement(gid).find("a.GroupButton i").removeClass("i_minus");
        },

        /**
         *点击选择联系人
         *@inner
         */
        onContactsItemClick: function (clickEvent) {
            var cid = M139.Dom.findParent(clickEvent.target, "li").getAttribute("data-contactsId");
            var c = this.model.getContactsById(cid);
            var sendText = this.model.getSendText(c.name, c.addr);
            var result = {
                value:sendText,
                name:c.name,
                addr: c.addr,
                serialId: c.SerialId
            };
            if (this.selectMode) {
                if (this.model.selectedList.length >= this.options.maxCount) {
                    this.trigger("additemmax");
                } else if(this.options.isAddVip && top.Contacts.IsPersonalEmail(c.SerialId)){
						top.FF.alert("不支持添加自己为VIP联系人。");
				}else{
                    var ok = this.model.addSelectedItem(result);
                    ok && this.trigger("additem", result);
				}
            } else {
                this.trigger("select", result);
                //最近联系人
                if ($(clickEvent.currentTarget).parent().parent().attr("data-groupid") == -3) {
                    top.BH("compose_addressbook_lastitem");
                }
                //紧密联系人
                else if ($(clickEvent.currentTarget).parent().parent().attr("data-groupid") == -4) {
                    top.BH("compose_addressbook_closeitem");
                }
                //所有联系人
                else if ($(clickEvent.currentTarget).parent().parent().attr("data-groupid") == -1) {
                    top.BH("compose_addressbook_allitem");
                }
                //未分组
                else if ($(clickEvent.currentTarget).parent().parent().attr("data-groupid") == -2) {
                    top.BH("compose_addressbook_noitem");
                }
                //vip联系人
                else if ($(clickEvent.currentTarget).parent().parent().attr("data-groupid") == this.model.getVIPGroupId()) {
                    top.BH("compose_addressbook_vipitem");
                }
                //读信联系人
                else if ($(clickEvent.currentTarget).parent().parent().attr("data-groupid") == this.model.getReadGroupId()) {
                    top.BH("compose_addressbook_readitem");
                }
                else {
                    BH("compose_addressbook_itemclick");
                }
            }
        },

        /**
         *点击添加整组
         *@inner
         */
        onAddGroupClick: function (e) {
            var item;            
            var gid = this.utilGetClickGroupId(e);
            if (gid > 0) {
                if (this.selectMode) {
                    var list = this.model.getGroupMembers(gid).concat();
					var vipList=[];

                    for (var i = 0; i < list.length; i++) {
                        var c = list[i];
						if (this.filter == "email") {
                            var sendText = c.getEmailSendText();
                        } else if (this.filter == "mobile") {
                            var sendText = c.getMobileSendText();
                        }  
                        item = {
                            value:sendText,
                            name:c.name,
                            addr: this.getAddr(c),
                            serialId: c.SerialId,
                            SerialId: c.SerialId
                        };
                        list[i] = item;
						if (this.model.selectedList.length >= this.options.maxCount) {
							this.trigger("additemmax");
                            break;
                        } else if(this.options.isAddVip){ //vip联系人不能重复被选中-添加整组排重
							var selected = this.model.selectedList;
							var hasSelevted = false;
							for(var j=0; j< selected.length;j++){
								if(item.serialId == selected[j].serialId ||top.Contacts.IsPersonalEmail(item.serialId)){
									hasSelevted = true;
									break;
								}
							}
							if(!hasSelevted){
								var ok = this.model.addSelectedItem(item);
								ok && vipList.push(item);
							}
                        } else {
                            var ok = this.model.addSelectedItem(item);
                            if (!ok) {
                                list.splice(i, 1);
                                i--;
                            }
                        }
                    }
                    this.trigger("additem", {
                        isGroup: true,
                        group: gid,
                        value: !this.options.isAddVip? list:vipList
                    });
                } else {
                    this.trigger("select", {
                        isGroup: true,
                        group: gid,
                        value: this.model.getGroupMembers(gid, {
                            getSendText: true
                        })
                    });
                }
                this.utilGetMemberContainer(gid).find("li").hide();
            }

            this.trigger("BH_onAddGroup");//增加行为ID
        },

        /**
         *点击添加联系人
         *@inner
         */
        onAddNewContactsClick: function () {
            var This = this;
            var topWin = M139.PageApplication.getTopAppWindow();
            var addView = new topWin.M2012.UI.Dialog.ContactsEditor().render();
            addView.on("success", function (result) {
                This.trigger('addContact', result);
                This.onAddContacts();
                //上报添加联系人成功行为
                BH("compose_linkmansuc");
            });

            addView.on('addGroupSuccess', function(result){                
                This.trigger('addGroup', result);
            });

            this.trigger('BH_onAddNewContacts');
        },

        /**
         *添加联系人成功时触发
         */
        onAddContacts: function () {
            this.updateView();
        },

        /**
         *由于数据变化 重绘通讯录界面
         */
        updateView:function(){
            //清除缓存数据
            this.model.set("contacts", null);
            this.renderGroupListView();
            this.model.set("currentGroup", null);
        },

        /**
         *点击重试，重新加载通讯录数据
         */
        onRetryClick: function () {
            var This = this;
            This.retryCount++;

            this.$(".LoadingImage").show();
            this.$(".RetryDiv").hide();
            setTimeout(function () {
                This.showRetryDiv();
            }, 5000);
            this.model.reloadContactsData();
        },

        /**
         *点击清空最近、紧密联系人
         */
        onClearGroupClick: function (e) {
            if ($(e.target).parent().attr('data-groupid') == -3) {
                top.BH("compose_addressbook_lastcancel");
            }
            if ($(e.target).parent().attr('data-groupid') == -4) {
                top.BH("compose_addressbook_closecancel");
            }
            var gid = this.utilGetClickGroupId(e);
            if (gid == GroupsId.Lastest) {
                this.model.clearLastContacts();
            } else if (gid == GroupsId.Close) {
                this.model.clearCloseContacts();
            }
        },

        /**
         *todo move to model
         *@inner
         */
        getAddr: function (c) {
            var addr = "";
            if (this.filter == "email") {
                addr = c.getFirstEmail();
            } else if (this.filter == "mobile") {
                addr = c.getFirstMobile();
            } else if (this.filter == "fax") {
                addr = c.getFirstFax();
            } else {
                addr = c.SerialId;
            }
            return addr;
        },

        /**
         *todo move to model
         *添加已选的部分联系人（对话框选择模式下有用）
         */
        addSelectedItems: function (selContacts) {
            var filter = this.filter;
            for (var i = 0; i < selContacts.length; i++) {
                var c = selContacts[i];
                if (typeof c == "object") {
                    var ok = this.model.addSelectedItem(c);
                    ok && this.trigger("additem", c);
                } else {
                    var addr = "";
                    var name = "";
                    if (filter == "email") {
                        addr = M139.Text.Email.getEmail(c);
                        name = M139.Text.Email.getName(c);
                        value = M139.Text.Email.getSendText(name, addr);
                    } else if (filter == "mobile") {
                        addr = M139.Text.Mobile.getMobile(c);
                        name = M139.Text.Mobile.getName(c);
                        value = M139.Text.Mobile.getSendText(name, addr);
                    }
                    if (addr) {
                        var item = {
                            name: name,
                            addr: addr,
                            value: value
                        };
                        var ok = this.model.addSelectedItem(item);
                        ok && this.trigger("additem", item);
                    }
                }
            }


        },
        removeSelectedAddr: function (param) {
            var list = this.model.selectedList;
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                var tmpCopareItem ="";
				tmpCopareItem = !this.options.isAddVip? item.addr :item.serialId;

                if (!this.filter) {
                    tmpCopareItem = item.serialId;
                }


				if (tmpCopareItem == param) {
                    list.splice(i, 1);
                    this.trigger("removeitem", item);
                    return;
                }
            }

        },

        /**
         *选择模式下获得选中的成员
         */
        getSelectedItems:function(){
            if(this.selectMode){
                var result = this.model.selectedList.concat();
                return result;
            }else{
                return null;
            }
        },

        /**@inner*/
        utilGetClickGroupId: function (clickEvent) {
            return M139.Dom.findParent(clickEvent.target, "li").getAttribute("data-groupId");
        },
        utilGetMemberElement: function (addr) {
            return this.$("li[data-addr='" + addr + "']");
        },

        /**@inner*/
        utilGetMemberElementById: function (serialId) {
            return this.$("li[data-contactsid='" + serialId + "']");
        },

        /**@inner*/
        utilGetGroupElement: function (gid) {
            return this.$("li[data-groupId='" + gid + "']");
        },
        /**@inner*/
        utilGetMemberContainer: function (gid) {
            return this.utilGetGroupElement(gid).find("ul");
        }

    }));
})(jQuery, _, M139);
/**
 * 通过模板绑定生成列表型界面，实现类似于asp.net的数据绑定，模板列机制。
 * 调用方式非常简单，一般只需要两行代码，只需要模板字符串和数据源就可以工作
 * 模板语法也非常简单，只有4个关键字
 * <!--item start--> 列表开始标记
 * <!--item end--> 列表结束标记
 * $变量名：输出数据源中当前行中的字段值到当前位置
 * @函数名：通过自定义函数生成html片段，输出到当前位置，自定义函数在this.Functions中定义
 * 
 * 行绑定事件：
 * ItemDataBound在生成每行数据的html之后会触发，可以对生成的html做二次处理，完成一些更复杂的逻辑
 * 
 * 注意所有的更改都要在DataBind之前完成
 * 
 * @example
 * repeater有两种使用方式：1.指定dom元素，生成后直接渲染dom 2.只传入模板字符串和数据源，返回生成的html代码，不操作dom
 * 方式一:
 * 第1步，在dom元素中声明模板
 * <div id="repeater1">
    	<table>
    		<tr><td>标题</td><td>发件人</td><td>发送日期</td></tr>
			<!--item start-->
			<tr name="item"><td><a href="#">$index</a>-@getTitle(subject,from)</td><td>$from</td><td>$sentDate</td></tr>
			<!--item end-->
    	</table>
    </div>
    第2步，获取数据源（json数据格式）
    var dataSource=[{
'id':'43:1tbiKwH1mEKNltb5qAAAsZ',
'from':'"铁喜光" <tiexg@139.com>',
'subject':'邮件主题',
'sentDate':new Date()
}]);
第3步，实例化repeater，调用DataBind方法
 var rp=new Repeater(document.getElementById("repeater1")); //传入dom元素，dom元素即做为容器又做为模板字符串
 rp.DataBind(dataSource); //数据源绑定后即直接生成dom
 
 方式二:(适用于不在html页面中声明模板的情况)
不同的只有第3步
var templateStr=document.getElementById("repeater1").innerHTML;
var rp=new Repeater(templateStr);//传入模板字符
var htmlStr=rp.DataBind(dataSource); //生成字符串，不操作dom
  
 * 
 */
(function (){
M139.core.namespace("M139.UI",{ 
Repeater: function(container,options){	
	this.HtmlTemplate=null;
	this.HeaderTemplate=null;
	this.FooterTemplate=null;
	this.ItemTemplate; 
	this.EmptyTemplate="暂无数据"
	this.SeparateTemplate;
	this.Functions=null;
	this.DataSource=null;
	this.ItemContainer;
	this.ItemDataBound=null;
	this.RenderMode=0;	//0，同步渲染，界面一次性组装，1.异步渲染，50毫秒生成一行
	this.RenderCallback=null;	//异步渲染模式用到的，行渲染回调函数
	this.Element=null;	
	this.Instance=null;
	this.DataRow=null;	//当前行数据
	
	var self=this; 
	if (typeof(container) != undefined) {
		if (typeof(container) == "string") {
			this.HtmlTemplate = container;	//直接传入html模板字符串
		}
		else {
			this.Element = container;
		}
		//n=findChild(obj,"name","item");
	}
	function getOptions(){	//初始化参数
			for(elem in options){
				if(elem){
					this[elem]=options[elem];
				}
			}
	}
	getOptions();
		
	this.DataBind = function(datasource) {

		var self=this;
	    this.DataSource=datasource;
	    if (this.DataSource && !$.isArray(this.DataSource)) {
	    	this.DataSource=[this.DataSource];//如果是object,转化为数组
	    }
	    if (this.HtmlTemplate == null) {
	        this.HtmlTemplate = this.Element.innerHTML;
	    }
	    //this.ItemTemplate=this.HtmlTemplate.match(/(<!--item\s+start-->)([\r\n\w\W]+)(<!--item\s+end-->)/ig)[0];
	    var re = /(<!--item\s+start-->)([\r\n\w\W]+)(<!--item\s+end-->)/i;
	    if (!datasource || datasource.length == 0) {
	        this.Render([]);
	        return this.HtmlTemplate.replace(re, "");
	    }
	    //re.exec(this.HtmlTemplate);
	    var match = this.HtmlTemplate.match(re);
	    this.ItemTemplateOrign = match[0];
	    this.ItemTemplate = match[2];

	    if(this.HtmlTemplate.indexOf("section")>=0){
	    	var sectionMatch=this.HtmlTemplate.match(/(<!--section start-->)([\w\W]+?)(<!--item start-->)([\w\W]+?)(<!--item end-->)([\w\W]+?)(<!--section end-->)/i);
	    	this.sectionStart=sectionMatch[2];
	    	this.sectionEnd=sectionMatch[6];

	    	//this.sectionStart=
	    }

	    
	    reg1 = /\$[\w\.]+\s?/ig; //替换变量的正则
	    reg2 = /\@(\w+)\s?(\((.*?)\))?/ig; //替换函数的正则
	    //reg2 = /\@(\w+)\s?\((.*?)\)/ig; //替换函数的正则
	    var result = new Array(); //每一行的html会push到result数组中
	    this.prevSectionName=""; //前一分组名称
	    for (var i = 0; i < this.DataSource.length; i++) {
	        var dataRow = this.DataSource[i];
	        dataRow["index"] = i;//追加索引
	        this.DataRow = dataRow; //设置当前行数据
	        var row = this.ItemTemplate;

	        row = row.replace(reg2, function($0, $1, $2,$3) { //替换函数
	            var name = $1.trim();
	            var paramList =[];
	            if($3){ paramList= $3.split(",");} //非空检测，如果有参数
	           
	            var param = new Array();
	            for (var i = 0; i < paramList.length; i++) {
	                if (dataRow[paramList[i]]!=null) {
	                    param.push(dataRow[paramList[i]]);
	                } else {
	                    param.push(paramList[i]);
	                }
	            }
	            if (self.Functions[name]) {
	                //return self.Functions[name](param);
	                var context = self;
	                if (self.Instance) {
	                    self.Instance.DataRow = dataRow;
	                    context = self.Instance;
	                }
	                var fun_result = self.Functions[name].apply(context, param);
	                if (fun_result && typeof(fun_result)=="string" && fun_result.indexOf("$") >= 0) {
	                    fun_result = fun_result.replace(/\$/ig, "@￥");//把$转义，否则影响正则替换
	                }
	                return fun_result;

	            }


	        });
	        row = row.replace(reg1, function($0) { //替换变量
	            m = $0.substr(1).trim();
				if(dataRow[m]!=undefined){
					//一级变量
					return dataRow[m]; 
				}else{
				    if (m.indexOf(".") >= 0) {// //多级变量
				        var arr = m.split(".");
				        var temp = dataRow;//多级变量暂存器
				        for (var i = 0; i < arr.length; i++) {
				            if (temp[arr[i]] != undefined) {
				                temp = temp[arr[i]]
				            } else {//变量不存在
				                return "";
				                //return "$" + m;
				            }

				        }
				        return temp;
				    }
				    return "";
					
				}
	            

	        });
	        
	        var sectionName="";
	       	if(self.Functions && self.Functions["getSectionName"]){
	       		sectionName=self.Functions["getSectionName"].call(self, self.DataRow );
	       	}
	       	
       		if(this.sectionStart && sectionName!=this.prevSectionName){//分组名改变，生成新分组
				if(i==0){//第一行记录
					this.prevSectionName=sectionName;
					this.firstSectionName=sectionName;//暂存第一个sections名称，最后整体替换时用
				}else{
					result.push(this.sectionEnd); //因为htmltemplate一开始已经包含了第一个section的start标记，所以每行总是先追加end+内容+start
					result.push(this.sectionStart.replace("@getSectionName",sectionName));
					this.prevSectionName=sectionName;
				}
				
      			
       		}
	       	
	        if(this.HtmlTemplate.indexOf("<!--display")>=0){//模板中包含显示标记才执行，避免多余的执行
	        	row=row.replace(/(<!--display\s+start-->)(\W+<\w+[^>]+display:none[\w\W]+?)(<!--display end-->)/ig,"");//移除不显示的html
	        }
				
	        var itemArgs = {	//事件参数
	            index: i,
	            sectionName:sectionName,
	            data: dataRow,
	            html: row
	        };
	        if (this.ItemDataBound) {	//是否设置了行绑定事件
	            var itemRet = this.ItemDataBound(itemArgs);
	            if (itemRet) {
	                row = itemRet;
	            }
	        }
	        result.push(row);
	        
	       	
	    }
	    
	    return this.Render(result);
	};

	/***
	 * 将行数据join成一个字符串，替换item模板,header模板,footer模板.
	 */
	this.Render = function(result) {
        var str = result.join("");
        //因为jscript 5.5以上 String.prototype.replace(pattern, replacement)
        //如果pattern是正则表达式, replacement参数中的$&表示表达式中匹配的字符串
        //例: replace(/\d/g, "$&cm") 就表示将每一个数字追加上cm。
        //这样下面的对html的replace，就会在str出现 $& 的位置插入完整的ItemTemplateOrign
        //所以需要做$的转义 $$ 表示一个 $，测试时可以发邮件标题为 $<b>$ test</b> 来重现
        if ('0'.replace('0',"$&")==='0'){
            str = str.replace(/\$/ig,"$$$$");
        }

        var html = "";
        if (this.HtmlTemplate) {
        	if(this.firstSectionName){
        		html=this.HtmlTemplate.replace("@getSectionName",this.firstSectionName);
        	}else{
        		html=this.HtmlTemplate;
        	}
            html = html.replace(this.ItemTemplateOrign, str);
        } else {
            //html = this.ItemTemplate.replace(this.ItemTemplateOrign, str);
        }
        if (this.HeaderTemplate)
            html = this.HeaderTemplate + html;
        if (this.FooterTemplate) {
            html = html + this.FooterTemplate;
        }
        if(html==""){
			html=this.EmptyTemplate;
		
        }
        
        if(this.Element){
         	this.Element.innerHTML = html;
         	this.Element.style.display="";
        }

        if (html && html.indexOf("@￥") >= 0) {
            html = html.replace(/@￥/ig, "$");
        }
        return html;
	    
	}		
}

});
window.Repeater = M139.UI.Repeater;
})();


﻿/**
 * @fileOverview 定义对话框组件基类
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var prevDialog;//上一个实例
    var current;//当前实例
    M139.namespace("M2012.UI.DialogBase", superClass.extend(
     /**
        *@lends M2012.UI.DialogBase.prototype
        */
    {
        /** 对话框组件基类
        *@constructs M2012.UI.DialogBase
        *@extends M139.View.ViewBase
        *@param {Object} options 初始化参数集
        *@param {String} options.template 对话框组件的html代码
        *@param {String} options.dialogTitle 定义标题栏文本
        *@param {String} options.dialogTitlePath 定义标题栏的路径
        *@param {String} options.titlePath 定义标题栏容器的路径
        *@param {String} options.title 定义正文标题文本
        *@param {String} options.contentPath 定义内容容器的路径
        *@param {String} options.contentButtonPath 所有功能按钮路径
        *@param {String} options.closeButPath 标题栏上的关闭按钮路径
        *@param {Boolean} options.showMiniSize 是否显示最小化按钮
        *@param {Boolean} options.showZoomSize 是否显示缩放按钮
        *@param {Boolean} options.showZoomIn 是否显示默认放大
        *@param {Object} options.zoomInSize 放大的比率（width，height）
        *@param {String} options.minisizeButPath 标题栏上的最小化按钮路径
        *@param {String} options.zoomsizeButPath 标题栏上的缩放按钮路径
        *@param {Boolean} options.hideTitleBar 是否隐藏标题栏
        *@param {String} options.bottomTip 左下角按钮栏的提示文本
        *@example
        */
        initialize: function (options) {
            var $el = jQuery(options.template);
            prevDialog = current;
            current = this;
            this.setElement($el);
            this.jContainer = $el;//兼容老版本
            return superClass.prototype.initialize.apply(this, arguments);
        },
        defaults: {
            name: "M2012.UI.DialogBase"
        },
        render: function () {
            var This = this;
            var options = this.options;
			if(options.dialogTitle =='附件存彩云网盘'){
				this.setBoxTop = true; //弹窗太高撑破页面
			}
            //对话框标题
            if (options.dialogTitle && options.dialogTitlePath) {
                this.$(options.dialogTitlePath).text(options.dialogTitle);
                if (options.hideTitleBar) {
                    this.$(options.titleBarPath).hide();
                }
            }

            if (options.bottomTip) {
                this.$(options.bottomTipPath).html(options.bottomTip);
            }

            if (options.showMiniSize) {
                this.$(options.minisizeButPath).show();
            }
            
            if (options.showZoomSize){
                this.$(options.zoomsizeButPath).show();
                this.zoomInSize = options.zoomInSize;
                
                if(options.showZoomIn){
                    this.showZoomIn = options.showZoomIn;
                    this.$(options.zoomsizeButPath).removeClass('i_t_zoomin').addClass('i_t_zoomout').attr('title','缩小');
                    if (options.width) options.width += options.zoomInSize.width;
                    if (options.height) options.height += options.zoomInSize.height;
                }
            }

            this.$el.css("z-index", M139.Dom.getNextZIndex());

            this.on("render", function () {
                //显示内容
                if (options.content && options.contentPath) {
                    var cnt = this.$(options.contentPath);
                    cnt.html(options.content);
                    if (options.height) {
                        cnt.height(options.height);
                        this.cntHeight = options.height;
                    }
                    if (options.width) {
                        /*
                        if (cnt.find("iframe").length == 0) {
                            cnt.width(options.width);
                        }*/
                        this.$el.width(options.width);
                    }
                    this.$cntEl = cnt;
                }
                //内容标题
                if (options.title && options.titlePath) {
                    this.$(options.titlePath).text(options.title);
                }

                //图标
                if (options.icon && options.iconPath) {
                    this.$(options.iconPath).addClass(options.icon);
                }


                //绑定事件
                this.bindEvents();
            });


            //第一个按钮获得焦点
            M139.Dom.fixIEFocus(true);

            return superClass.prototype.render.apply(this, arguments);
        },
        /**@inner*/
        bindEvents: function () {
            var titleBar;
            var options = this.options;
            var This = this;

            //拖放热区 标题栏容器
            if (options.titleBarPath) {
                var titleBar = this.$(options.titleBarPath)[0];
            }

            if (options.closeButPath) {
                this.$(options.closeButPath).click(function (e) {
                    This.trigger('beforeClose',e);
                    //This.close(e);
                });
            }

            if (options.contentButtonPath) {
                this.$(options.contentButtonPath).click(function (e) {
                    var obj = {
                        event: e
                    };
                    This.trigger("contentbuttonclick", obj);
                    if (!obj.cancel) {
                        This.close(e);
                    }
                    e.preventDefault();
                    e.stopPropagation();
                });
            }

            this.$(options.minisizeButPath).click(function (e) {
                This.onMiniSizeClick(e);
                return false;
            });
            
            this.$(options.zoomsizeButPath).click(function (e) {
                This.onZoomSizeClick(e);
                return false;
            });

            var zIndex = this.$el.css("z-index") - 1;

            //遮罩
            var mask;
            this.on("print", function () {
                mask = M2012.UI.DialogBase.showMask({
                    zIndex:zIndex
                });
                this.setMiddle();
                this.$el.css("visibility", "");
            }).on("remove", function () {
                mask.hide();
                M139.Dom.fixIEFocus();
            }).on("minisize", function () {
                mask.hide();
            }).on("cancelminisize", function () {
                mask = M2012.UI.DialogBase.showMask({
                    zIndex: zIndex
                });
            }).on("beforeClose",function(e){
                var unClose = false;
                if (typeof (options.onBeforeClose) == 'function') {
                    unClose = options.onBeforeClose(e);
                }
                if(!unClose) This.close(e);
            }).on("close", function (e) {
                if (typeof (options.onClose) == 'function') {
                    options.onClose(e);
                }
            });

            //对话框可拖拽
            $D.setDragAble(this.el, {
                handleElement: options.titleBarPath
            });
        },
        /**
         *设置对话框标题
         *@param {Stirng} title 标题文本
         */
        setDialogTitle: function (title) {
            this.$(this.options.dialogTitlePath).text(title);
        },
        /**设置对话框居中显示*/
        setMiddle: function () {
            var w = $(document.body).width();
            var h = document.documentElement.clientHeight || document.body.clientHeight;
			var T = 0;
			if(this.setBoxTop){
				T = -100;
			}
            this.$el.css({
                left: (w - this.getWidth()) / 2 + "px",
                top: ((h - this.getHeight()) / 2+T) + "px"
            });
        },

		// fix: caused by CSS box model
		getHeight: function(){
			var bodyHeight = this.$(".boxIframeMain").height();
			return Math.max(bodyHeight, this.$el.height());
		},

        /**
         *重置对话框的高度（根据iframe的高度自适应）
         */
        resetHeight: function () {
            var h = this.$el.height();
            this.$(this.options.contentPath).height(h);
            this.$(this.options.contentPath).find("iframe").height(h);
        },

        /**
         *点击最小化
         *@inner
         */
        onMiniSizeClick: function (e) {
            var obj = {};
            this.trigger("beforeminisize", {});
            if (!obj.cancel) {
                this.minisize();
            }
        },

        /**
         *最小化，不使用hide
         */
        minisize: function () {
            this.trigger("minisize");
            this.oldSize = {
                height: this.$el.height(),
                width: this.$el.width()
            };
            this.$el.height(1);
            this.$el.width(1);
            this.$el.css({
                left: 0,
                top: 0,
                overflow: "hidden"
            });
        },

        /**
         *取消最小化
         */
        cancelMiniSize: function () {
            this.$el.height(this.oldSize.height);
            this.$el.width(this.oldSize.width);
            this.$el.css("overflow", "");
            this.setMiddle();
            this.trigger("cancelminisize");
        },
        
        /**
         *点击缩放
         *@inner
         */
        onZoomSizeClick: function(e){
            var zoomEl = $(e.target);
            var handle = 'zoomIn';
            
            var zoomInWidth = 0;
            var zoomInHeight = 0;
            
            if(zoomEl.hasClass('i_t_zoomin')){ //放大
                handle = 'zoomIn';
                zoomEl.removeClass('i_t_zoomin').addClass('i_t_zoomout').attr('title','缩小');
                zoomInWidth = zoomInWidth + this.zoomInSize.width;
                zoomInHeight = zoomInHeight + this.zoomInSize.height;
            }else{  //缩小
                handle = 'zoomOut';
                zoomEl.removeClass('i_t_zoomout').addClass('i_t_zoomin').attr('title','放大');
                zoomInWidth = zoomInWidth - this.zoomInSize.width;
                zoomInHeight = zoomInHeight - this.zoomInSize.height;
            }
            
            var width = this.$el.width();
            var height = this.$el.height();
            
            if(this.$cntEl && this.cntHeight){
                var cntHeight = this.$cntEl.height();
                this.$cntEl.height(cntHeight + zoomInHeight);
            }
            this.$el.width(width + zoomInWidth).height(height + zoomInHeight);
            
            if(this.options.onZoom){
                this.options.onZoom(handle);
            }
            this.setMiddle();
        },

        /**关闭对话框*/
        close: function (e) {
            var data = {
                event: e
            };
            (typeof this.onClose == "function") && this.onClose.call(this, data);
            if (!(e && e.silent === true)) {
                this.trigger("close", data); //e.silent时,不触发close事件,就是不触发回调
            }

            if (!data.cancel) {
                this.remove();
                this.isClosed = true;
                //当弹出2个窗口，关闭上面那个后把current指针还原
                if (prevDialog && !prevDialog.isClosed) {
                    current = prevDialog;
                    prevDialog = null;
                }
            }
        },
        /**
         *设置按钮灰显，不可用
         *@param {Number} index 按钮下标
         *@param {Boolean} value 是否不可用，true为不可用
         */
        setButtonDisable: function (index, value) {
            var btn = this.$(this.options.contentButtonPath).eq(index);
            if (value) {
                btn.addClass(this.options.buttonDisableClass);
            } else {
                btn.removeClass(this.options.buttonDisableClass);
            }
        },

        /**
         *设置按钮文本
         *@param {Number} index 按钮下标
         *@param {String} text 按钮文本
         */
        setButtonText: function (index, text) {
            this.$(this.options.contentButtonPath).eq(index).find("span").text(text);
        },

        /**
         *设置左下角按钮栏提示文本
         *@param {String} html 按钮文本html
         */
        setBottomTip: function (html) {
            this.$(this.options.bottomTipPath).html(html);
        },

        /**
         *重新计算对话框大小（在内嵌iframe的情况下，iframe内页高度发生变化时调用）
         */
        resize: function () {
            try {
                var iframe = this.$("iframe")[0];
                if (iframe) {
                    iframe.parentNode.style.height = iframe.contentWindow.document.body.scrollHeight + "px";
                }
            } catch (e) { }
        }
    }
    )
    );


    //对话框基本html：包括标题栏、内容区、按钮栏
    var DialogConf = {
        //wTipCont class是老版本向下兼容=_=
        template: ['<div class="boxIframe" style="position:absolute;visibility: hidden;">',
        '<div class="boxIframeTitle DL_TitleBar"><h2><span class="DL_DialogTitle"></span></h2>',
        '<a class="i_t_close DL_CloseBut CloseButton" title="关闭" href="javascript:;"></a>',
        '<a class="i_t_min DL_MiniSizeBut" title="最小化" style="display:none" href="javascript:;"></a>',
        '<a class="i_t_zoomin DL_ZoomSizeBut" title="放大" style="display:none" href="javascript:;"></a>', //Zoom In 放大 Zoom Out 缩小
        '</div> ',
        '<div class="boxIframeMain">',
            '<div class="boxIframeText MB_Content wTipCont">',
                    //内容
            '</div>',
            '<div class="boxIframeBtn DL_ButtonBar">',
                '<span class="bibText BottomTip"></span>',
                '<span class="bibBtn">',
                '<a class="btnSure MB_But_0 YesButton" rel="0" href="javascript:void(0)" style="display:none"><span>确定</span></a> <a rel="1" class="btnNormal MB_But_1 CancelButton" href="javascript:void(0)" style="display:none"><span>否</span></a> <a rel="2" class="btnNormal MB_But_2 CancelButton" href="javascript:void(0)" style="display:none"><span>取消</span></a>',
                '</span>',
            '</div>',
        '</div>',
        '</div>'].join(""),
        dialogTitle: "系统提示",
        titleBarPath: ".DL_TitleBar",
        dialogTitlePath: ".DL_DialogTitle",
        buttonBarPath: ".DL_ButtonBar",
        closeButPath: ".DL_CloseBut",
        minisizeButPath: ".DL_MiniSizeBut",
        zoomsizeButPath: ".DL_ZoomSizeBut",
        contentButtonPath: ".DL_ButtonBar a",
        bottomTipPath: ".BottomTip",
        buttonDisableClass: "btnGrayn",
        contentPath: ".MB_Content"
    };
    //对话框扩展内容：内容区定制，带图标，醒目文字、普通文字
    var DialogConf_MessageBox = {
        replaceInnerHTML: {
            ".MB_Content": ['<div class="norTips"> <span class="norTipsIco"><i class="MB_Icon" style="display:none"></i></span>',//<i class="i_ok"></i>
                 '<dl class="norTipsContent">',
                   '<dt class="norTipsTitle MB_MessageBox_Title"></dt>',//醒目
                   '<dd class="norTipsLine MB_MessageBox_Content"></dd>',//正常文本 ***封邮件已成功移动到指定文件夹。<a href="#">查看详情</a>
                 '</dl>',
               '</div>'
            ].join("")
        },
        /*
        replaceInnerText:{
            ".MB_MessageBox_Title":
        },
        */
        iconPath: ".MB_Icon",
        titlePath: ".MB_MessageBox_Title",
        contentPath: ".MB_MessageBox_Content"
    };

    var DIALOG_ICONS = {
        "ok": "i_ok",
        "fail": "i_fail",
        "warn": "i_warn"
    };

    //添加静态方法
    $.extend(M2012.UI.DialogBase,
     /**
        *@lends M2012.UI.DialogBase
        */
    {
        /**
        *提示对话框，相当于window.alert()，只有一个确认按钮
        *@param {String} msg 提示的内容文本，默认是纯文本，当options.isHtml为真时才不做encode
        *@param {Object} options 参数集合
        *@param {String} options.title 可选参数，定义正文标题文本
        *@param {String} options.dialogTitle 可选参数，定义标题栏文本
        *@param {String} options.icon 可选参数，定义左侧提示图标，默认为warn，目前内建支持ok,fail,warn(如果没有内建，可以直接传图标的class)
        *@param {Function} options.onBeforeClose 关闭对话框前的回调
        *@param {Function} options.onClose 关闭对话框时的回调
        *@param {Function} options.onZoom 缩放对话框时的回调
        *@param {Boolean} options.isHtml 标注msg字段为html，不做encode
        *@returns {M2012.UI.DialogBase} 返回对话框实例
        *@example
        $Msg.alert("hello world",{
            onClose:function(e){
                e.cancel = true;//撤销关闭
            }
        });
        */
        alert: function (msg, options) {
            options = options || {};
            var op = {
                buttons: ["确 定"],
                icon: options.icon || "warn"
            };
            _.defaults(op, options);
            return this.confirm(msg, op);
        },

        /**
        *确认对话框，有确认和取消两个按钮，可以定制按钮的文本
        *@param {String} msg 提示的内容文本，默认是纯文本，当options.isHtml为真时才不做encode
        *@param {Function} btn1OnClick 可选参数，点击第一个按钮
        *@param {Function} btn2OnClick 可选参数，点击第二个按钮
        *@param {Function} btn3OnClick 可选参数，点击第三个按钮
        *@param {Object} options 参数集合
        *@param {Function} options.onBeforeClose 关闭对话框前的回调
        *@param {Function} options.onClose 关闭对话框时的回调
        *@param {Function} options.onZoom 缩放对话框时的回调
        *@param {String} options.title 可选参数，定义正文标题文本
        *@param {String} options.dialogTitle 可选参数，定义标题栏文本
        *@param {String} options.icon 可选参数，定义左侧提示图标，目前支持ok,fail(或者直接传图标的class)
        *@param {Array} options.buttons 显示几个按钮，以及按钮的文本
        *@param {Boolean} options.isHtml 标注msg字段为html，不做encode
        *@returns {M2012.UI.DialogBase} 返回对话框实例
        *@example
        $Msg.confirm(
            "Are you sure?",
            function(){
                //click sure
            },
            function(){
                //click cancel
            },
            {
                buttons:["是","否"],//按钮文本，支持3个按钮，默认为2个按钮，即["确定","取消"]
                title:"对话框标题"
            }
        );
    
        $Msg.confirm(
            "您还可以手动选择要归档的邮件，移动到指定文件夹",
            function(){
                alert("您点击了确定");
            },
            {
                title:"邮件归档失败",
                dialogTitle:"邮件清理",
                icon:"fail"
            }
        );
        */
        confirm: function (msg, btn1OnClick, btn2OnClick, btn3OnClick, options) {
            var shows = [];
            var hides = [];
            var buttons = ["确 定", "取 消"];
            var clicks = [];
            var replaceInnerText = {};

            //收集点击回调
            for (var i = 1; i < arguments.length; i++) {
                if (_.isFunction(arguments[i]) || arguments[i] === null) {
                    clicks.push(arguments[i]);
                }
            }
            //获取options
            for (var i = arguments.length - 1; i > 0; i--) {
                if (_.isObject(arguments[i]) && !_.isFunction(arguments[i])) {
                    options = arguments[i];
                    break;
                }
            }
            if (!options) options = {};
            buttons = options.buttons || buttons;

            //要显示按钮
            for (var i = 0; i < buttons.length; i++) {
                shows.push(".MB_But_" + i);
                replaceInnerText[".MB_But_" + i + " span"] = buttons[i];
            }
            //如果没按钮，隐藏按钮条
            if (!buttons || buttons.length == 0) {
                hides.push(DialogConf.buttonBarPath);
            }
            //显示图标
            if (options.icon) {
                shows.push(DialogConf_MessageBox.iconPath);
            }

            var mb_options = {
                name:options.name,
                title: options.title,
                height: options.height,
                width: options.width,
                dialogTitle: options.dialogTitle,
                shows: shows.join(","), //显示的按钮
                hides: hides.join(","),
                showMiniSize: options.showMiniSize,
                showZoomSize: options.showZoomSize,
                showZoomIn: options.showZoomIn,
                zoomInSize: options.zoomInSize,
                replaceInnerText: replaceInnerText,
                content: (options && options.isHtml) ? msg : M139.Text.Html.encode(msg),
                bottomTip: options.bottomTip,
                onBeforeClose:options.onBeforeClose,
                onClose:options.onClose,
                onZoom:options.onZoom,
                events: {
                    "contentbuttonclick": function (e) {
                        if (e.event) {
                            var a = M139.Dom.findParent(e.event.target, "a");
                            if (a) {
                                var rel = a.getAttribute("rel");
                                if (clicks[rel]) clicks[rel](e);
                            }
                        }
                        if (options.onclose) {
                            options.onclose(e);
                        }
                    }
                },
                icon: options.icon ? (DIALOG_ICONS[options.icon] || options.icon) : "" //传ok直接映射为i_ok,也可以直接传class
            };
            var exOp = $.extend({}, DialogConf)
            if (options.usingTemplate !== false) {
                exOp = $.extend(exOp, DialogConf_MessageBox);
            }

            _.defaults(mb_options, exOp);
            var mb = new M2012.UI.DialogBase(mb_options);
            mb.render().$el.appendTo(document.body);
            return mb;
        },

        /**
        *输入对话框
        *@param {String} msg 提示的内容文本
        *@param {Function} yesOnClick 可选参数，点击确认按钮
        *@param {Function} cancelOnClick 可选参数，点击取消按钮
        *@param {Object} options.title 可选参数，对话框的标题
        *@param {Object} options.maxLength 可选参数，文本框最大输入字符数
        *@param {Object} options.defaultValue 可选参数，文本框默认值
        *@param {Boolean} options.isPassword 输入框为密码框
        *@returns {M2012.UI.DialogBase} 返回对话框实例
        *@example
        $Msg.prompt(
            "请输入你的名字",
            function(value,e){
                if(value !="lifula"){
                    e.cancel = true;//取消关闭
                }
            },
            {
                title:"对话框标题"
            }
        );
        */
        prompt: function (msg, yesOnClick, cancelOnClick, options) {
            //获取options
            for (var i = arguments.length - 1; i > 0; i--) {
                if (_.isObject(arguments[i]) && !_.isFunction(arguments[i])) {
                    options = arguments[i];
                    break;
                }
            }
            options = options || {};
            var html = ['<fieldset class="form">',
             '<legend class="hide"></legend>',
             '<ul class="formLine">',
               '<li>',
                 '<label class="label">' + msg + '</label>',
                 '<div class="element">',
                   '<input type="text" class="iText" style="width:170px;">',
                 '</div>',
               '</li>',
             '</ul>',
           '</fieldset>'].join("");

            if (options.isPassword) {
                html = html.replace("type=\"text\"", "type=\"password\"");
            }

            options.buttons = ["确 定", "取 消"];

            var mb = this.showHTML(html, function (e) {
                var text = mb.get$El().find("input:eq(0)").val();
                if (yesOnClick) {
                    yesOnClick(text, e);
                }
            }, function () {
                if (_.isFunction(cancelOnClick)) {
                    cancelOnClick();
                }
            }, options);
            if (options.defaultValue) {
                mb.on("print", function () {
                    mb.get$El().find("input:eq(0)").val(options.defaultValue).select();
                });
            }
            return mb;
        },

        /**
        *打开一个iframe对话框
        *@param {Object} options 参数集合
        *@param {String} options.title 对话框标题
        *@param {String} options.url iframe的页面地址
        *@param {String|Number} options.height 对话框高度
        *@param {String|Number} options.width 对话框宽度
        *@param {String} options.name 对话框的名称，如果有name属性，则无法同时弹出2个相同name的对话框，会返回null，需要注意
        *@returns {M2012.UI.DialogBase} 返回对话框实例
        *@example
        $Msg.open({
            dialogTitle:"对话框标题",
            url:"http://www.baidu.com",
            width:400,
            height:400
        });
        */
        open: function (options) {
            //增加name属性支持，如果有name，则判断当前是否已经弹出的（并且没关闭的相同对话框），如果有，就返回null，不做别的处理
            if (options.name) {
                var cur = this.getCurrent();
                if (cur && cur.isClosed !== true && cur.options && cur.options.name === options.name) {
                    return null;
                }
            }



            var mb_options = {
                dialogTitle: options.dialogTitle,
                showMiniSize: options.showMiniSize,
                showZoomSize: options.showZoomSize,
                showZoomIn: options.showZoomIn,
                zoomInSize: options.zoomInSize,
                width: options.width || "400px",
                height: options.height || "250px",
                hideTitleBar: options.hideTitleBar,
                hides: ".DL_ButtonBar",    //隐藏按钮栏
                content: "<iframe frameBorder='0' scrolling='no' style='height:100%;width:100%;'></ifame>",
                events: {
                    "close": function () {
                        if (options && options.onclose) {
                            options.onclose();
                        }
                    }
                }
            };
            _.defaults(mb_options, DialogConf);
            var mb = new M2012.UI.DialogBase(mb_options);
            var url = M139.Text.Url.makeUrl(options.url, {
                viewid: mb.id
            });
            mb.render().$el.appendTo(document.body)
            .find("iframe").attr("src", url);
            return mb;
        },
        /**
        *弹出对话框，定制html内容，可以选择显示或者不显示按钮
        *@param {String} html 对话框的html内容标题
        *@param {Function} btn1OnClick 可选参数，在有按钮的情况下，点击第一个按钮
        *@param {Function} btn2OnClick 可选参数，在有按钮的情况下，点击第二个按钮
        *@param {Function} btn3OnClick 可选参数，在有按钮的情况下，点击第三个按钮
        *@param {Object} options 设置参数集合
        *@param {String} options.title 对话框标题
        *@param {Array} options.buttons 定制按钮,如：["按钮1","按钮2"]，如果没有按钮，则不显示按钮栏
        *@param {String} options.name 对话框的名称，如果有name属性，则无法同时弹出2个相同name的对话框，会返回null，需要注意
        *@returns {M2012.UI.DialogBase} 返回对话框实例
        */
        showHTML: function (html, btn1OnClick, btn2OnClick, btn3OnClick, options) {
            var mb_options = {
                isHtml: true,
                usingTemplate: false
            };
            //获取options
            for (var i = arguments.length - 1; i > 0; i--) {
                if (_.isObject(arguments[i]) && !_.isFunction(arguments[i])) {
                    options = arguments[i];
                    break;
                }
            }
            options = options || {};
            options.buttons = options.buttons || [];
            _.defaults(mb_options, options);

            //增加name属性支持，如果有name，则判断当前是否已经弹出的（并且没关闭的相同对话框），如果有，就返回null，不做别的处理
            if (options.name) {
                var cur = this.getCurrent();
                if (cur && cur.isClosed !== true && cur.options && cur.options.name === options.name) {
                    return null;
                }
            }


            return this.confirm(html, btn1OnClick, btn2OnClick, btn3OnClick, mb_options);
        },
        /**
        *静态方法，在使用$Msg.open()打开的iframe中使用，根据window对象得到弹出的对话框实例
        *@param {Window} target 对话框中iframe的window对象
        *@returns {M2012.UI.DialogBase} 返回对话框实例
        *@example
        var dialog = window.parent.$Msg.getDialog(window);
        dialog.close();
        */
        getDialog: function (target) {
            var result = null;
            if ($.isWindow(target)) {
                var frameElement = target.frameElement;
                var viewId = M139.Text.Url.queryString("viewid", frameElement.src);
                result = M139.View.getView(viewId);
            }
            return result;
        },
        /**@inner*/
        close: function (target) {
            var item = this.getDialog(target);
            if (item) item.close();
        },
        /**
        *得到当前弹出框实例，向下兼容用
        *@inner
        *@returns {M2012.UI.DialogBase} 返回对话框实例
        */
        getCurrent: function () {
            return current;
        }
    });

    jQuery.extend(M2012.UI.DialogBase,
    /**
    *@lends M2012.UI.DialogBase
    */
    {
        /**
         *遮罩层元素池
         *@inner
         */
        masks: [],
        /**
         *显示一个遮罩层
         *@param {Object} options 参数集合
         *@param {Number} options.zIndex 必选参数
         *@param {Number} options.opacity 可选参数 遮罩层的透明度（默认0.5）
         *@returns {jQuery} 返回一个遮罩层
         */
        showMask: function (options) {
            var mask;
            options = options || {};
            var zIndex = options.zIndex;
            var opacity = options.opacity || 0.5;
            for (var i = 0; i < this.masks.length; i++) {
                if (this.masks[i].css("display") == "none") {
                    mask = this.masks[i];
                    break;
                }
            }
            if (!mask) {
                mask = createMask();
                this.masks.push(mask);
            }
            mask.css("z-index", zIndex);
            mask.css("opacity", opacity);
            mask.show();
            function createMask() {
                var el = $("<div class='layer_mask' style='overflow:hidden'></div>");
                if ($B.is.ie) {
                    //ie6增加iframe 遮住<select>
                    el.append("<iframe frameBorder='0' style='width:100%;height:100%;filter:alpha(opacity=0);'></iframe>");
                }
                el.appendTo(document.body);
                return el;
            }
            return mask;
        }
    });

    //定义缩写
    window.$Msg = M2012.UI.DialogBase;
})(jQuery, _, M139);
﻿/**
 * @fileOverview 定义弹出菜单组件
 */

 (function (jQuery,_,M139){
 var $ = jQuery;
 var superClass = M139.View.ViewBase;
M139.namespace("M2012.UI.PopMenu",superClass.extend(
 /**
  *@lends M2012.UI.PopMenu.prototype
  */
{
    /** 弹出菜单组件
    *@constructs M2012.UI.PopMenu
    *@extends M139.View.ViewBase
    *@param {Object} options 初始化参数集
    *@param {String} options.template 组件的html代码
    *@param {Array} options.itemsContainerPath 定义子项的容器路径
    *@param {Array} options.items 定义子项内容
    *@param {String} options.itemsPath 定义子项节点路径
    *@param {String} options.itemsTemplate 定义子项html模板
    *@param {String} options.itemsContentPath 定义内dock容显示的位置
    *@param {String} options.splitLineTemplate 定义分割线的html模板
    *@param {String} options.subMenuIconTemplate 子菜单箭头图标
    *@param {String} options.subMenuIconInsertPath 子菜单箭头插入的位置
    *@param {String} options.subMenuInsertPath 定义子菜单插入的父元素的位置
    *@param {Number} options.scrollCount 定义最多到几个菜单项的时候出现滚动条，默认为15
    *@param {Number} options.maxHeight 定义菜单最多到多少像素高的时候出现垂直滚动条，默认240
    *@example
    */
    initialize: function (options) {
        var customClass = options.customClass || "";
        var customStyle = options.customStyle || "";
        options.template = options.template.replace("{customClass}", customClass);
        options.template = options.template.replace("{customStyle}", customStyle);
        var $el = jQuery(options.template);
        this.setElement($el);
        return superClass.prototype.initialize.apply(this, arguments);
    },
    name: "M2012.UI.PopMenu",
    /**构建dom函数*/
    render:function(){
        var This = this;
        var options = this.options;
        var items = options.items;

        var itemContainer = options.itemsContainerPath ? this.$el.find(options.itemsContainerPath):this.$el;
        var itemCount = 0;

        if (options.selectMode) {
            this.$el.addClass(options.selectModeClass);
        }

        for(var i=0;i<items.length;i++){
            var item = items[i];
            if(item.isLine){
                itemContainer.append(options.splitLineTemplate);
            }else{
                var node = jQuery(options.itemsTemplate).appendTo(itemContainer);

                if(item.text){
                    node.find(options.itemsContentPath).text(item.text);
                } else if (item.html) {
                    if (item.highlight == false) { //非高亮状态，不生成a:hover样式
                        node.html(item.html);
                    } else {
                        node.find(options.itemsContentPath).html(item.html);
                    }
                }

                if (options.selectMode) {
                    node.find(options.subMenuIconInsertPath).prepend(options.selectIconTemplate);
                }

                if(item.items && item.items.length){
                    //插入有子菜单的右箭头
                    node.find(options.subMenuIconInsertPath).append(options.subMenuIconTemplate);
                    node.attr("submenu","1");
                }
                node.attr("index",i);
                itemCount ++ ;
            }
        }

        this.on("print",function(){
            //判断是否要出滚动条
            if(itemCount > (options.scrollCount || 15) || this.getHeight() > options.maxHeight){
                this.$el.css({
                    "overflow-x":"hidden",
                    "overflow-y":"scroll",
                    "height":(options.maxHeight || 310)
                });
            }
            //处理溢出界面
            if (this.options.parentMenu) {
                var offset = this.$el.offset();
                var bottom = offset.top + M139.Dom.getElementHeight(this.$el);
                var moreTop = bottom - $(document.body).height()+10;
                if (moreTop > 0) {
                    this.$el.css("top", -moreTop + "px");
                }
            }
        });

        this.$el.find(options.itemsPath).mouseover(function(){
            This.onMenuItemMouseOver(this);
        }).click(function (e) {
            var obj = e.target;
            var isThisMenu = M139.Dom.containElement(This.el, obj);
            //子菜单的容器在菜单项里，这里要排除子菜单的点击
            if (isThisMenu) {
                This.$el.find("ul div *").each(function () {
                    if (this == obj) {
                        isThisMenu = false;
                    }
                });
            }
            if (isThisMenu) {
                This.onMenuItemClick(this);
            }

            e.stopPropagation();
            if ($.browser.msie && $.browser.version <= 7) { // update by tkh IE67 阻止浏览器的默认行为，解决bug：回复转发打开空白写信页
                e.preventDefault();
            }
        });

		if(options.hideInsteadOfRemove) {
	        this.on("itemclick", function () {
	            this.hide();
	        });
		} else {
	        this.on("itemclick", function () {
	            this.remove();
	        });
        }

        return superClass.prototype.render.apply(this, arguments);
    },
    /**@inner*/
    getItemByNode:function(node){
        return this.options.items[node.getAttribute("index")];
    },
    /**@inner*/
    onMenuItemClick:function(node){
        var index = node.getAttribute("index");
        if(!index) return;
        index = index | 0;
        var item = this.getItemByNode(node);
        if (jQuery.isFunction(item.onClick)) {
            item.onClick(item);
        }
        if (jQuery.isFunction(this.options.onItemClick)) {
            this.options.onItemClick(item, index);
        }
        this.trigger("itemclick", item, index);
    },

    /**移除菜单*/
    remove:function(){
        this.removeSubMenu();
        superClass.prototype.remove.apply(this,arguments);
    },

    selectItem:function(index){
	    var options = this.options;
        this.$(options.itemsPath).removeClass(options.selectedClass).eq(index).addClass(options.selectedClass);
    },

    /**
     *鼠标移动到菜单项上面，需要显示子菜单
     *@inner
     */
    onMenuItemMouseOver: function (node) {
        var This = this;
        if (node.getAttribute("submenu")) {
            var item = this.getItemByNode(node);
            this.trigger("itemMouseOver", item);
            //创建子菜单
            if (item.menu && this.subMenu == item.menu) {
                return;
            } else {
                var op = jQuery.extend({}, this.options);
                op.items = item.items;
                op.parentMenu = this;
                
                var left = op.width ?  parseInt(op.width) : 150;
                var _top = -5;

                if (op.width2) { op.width = op.width2;} //二级菜单支持独立宽度
                item.menu = new M2012.UI.PopMenu(op);
                /*
                if (menu.$el.height() + top > $(document.body).height()) {
                    options.top = top - menu.$el.height();
                }
                if (menu.$el.width() + left > $(document.body).width()) {
                    options.left = left - menu.$el.width();
                }*/


                this.trigger("subItemCreate", item);
                var $el = item.menu.render().get$El();
                var offset = this.$el.offset();
                if (offset.left > $(document.body).width() / 2) {
                    left = -$el.width();
                }

                $el.appendTo(node).css({
                    left: left+"px",
                    top: _top+"px"
                });

                item.menu.on("remove", function () {
                    item.menu = null;
                }).on("itemclick", function () {
                    This.remove();
                });
            }
            //一个菜单只能同时显示一个子菜单
            this.removeSubMenu();
            this.subMenu = item.menu;
        } else {
            this.removeSubMenu();
        }
    },

    show: function(){
	    var This = this;
        $D.bindAutoHide({
            stopEvent:true,
            action:"click",
            element:this.el,
            callback: function(){This.hide()}
        });
	    superClass.prototype.show.apply(this, arguments);
    },

    hide: function(){
	    $D.unBindAutoHide({element: this.el});
	    superClass.prototype.hide.apply(this, arguments);
    },
    
    /**
     *移除子菜单
     *@inner
     */
    removeSubMenu:function(){
        if(this.subMenu){
            try {
                this.subMenu.remove();
                this.subMenu = null;
            }catch(e){}
        }
    }
}
));

var DefaultMenuStyle = {
    template: ['<div class="menuPop shadow {customClass}" style="top:0;left:0;z-index:9001;{customStyle}">',
       '<ul>',
       '</ul>',
    '</div>'].join(""),
    splitLineTemplate:'<li class="line"></li>',
    itemsContainerPath:"ul",
    itemsPath:"ul > li",
    itemsTemplate: '<li><a href="javascript:;"><span class="text"></span></a></li>',
    itemsContentPath: 'a > span',
    subMenuIconTemplate: '<i class="i_triangle_h"></i>',
    selectModeClass: "menuPops",
    selectedClass: "cur",
    selectIconTemplate: '<i class="i_b_right"></i>',
    subMenuIconInsertPath:'a'
};


jQuery.extend(M2012.UI.PopMenu,
 /**
  *@lends M2012.UI.PopMenu
  */
{
    /**
    *使用常规的样式创建一个菜单实例
    *@param {Object} options 参数集合
    *@param {Array} options.items 菜单项列表
    *@param {HTMLElement} options.container 可选参数，父元素，默认是添加到body中
    *@param {String} options.top 坐标
    *@param {String} options.left 坐标
    *@example
    M2012.UI.PopMenu.create({
        items:[
            {
                text:"标已读",
                onClick:function(){
                    alert("标已读");
                }
            },
            {
                text:"标未读",
                onClick:function(){}
            },
            {
                isLine:true
            },
            {
                text:"标签",
                items:[
                    {
                        html:'&lt;span class=&quot;tagMin&quot;&gt;&lt;span class=&quot;tagBody&quot; style=&quot;background-color:#369;&quot;&gt;&lt;/span&gt;&lt;/span&gt; &lt;span class=&quot;tagText&quot;&gt;标签1&lt;/span&gt;',
                        onClick:function(){}
                    },
                    {
                        html:'&lt;span class=&quot;tagMin&quot;&gt;&lt;span class=&quot;tagBody&quot; style=&quot;background-color:#F60;&quot;&gt;&lt;/span&gt;&lt;/span&gt; &lt;span class=&quot;tagText&quot;&gt;标签2&lt;/span&gt;',
                        onClick:function(){}
                    }
                ]
            },
        ],
        onItemClick:function(item){
            alert("子项点击");
        }
    });
    */
    create:function(options){
        if(!options || !options.items){
            throw "M2012.UI.PopMenu.create:参数非法";
        }
        options = _.defaults(options,DefaultMenuStyle);
        var menu = new M2012.UI.PopMenu(options);
        menu.render().$el.appendTo(options.container || document.body).css("visibility","hidden");
        if (options.dockElement) {
            setTimeout(function () {
                M139.Dom.dockElement(options.dockElement, menu.$el, { direction: options.direction, dx: options.dx, dy: options.dy });
                menu.$el.css("visibility", "");
            }, 0);
        } else {
            var top = parseInt(options.top);
            var left = parseInt(options.left);
            if (menu.$el.height() + top > $(document.body).height()) {
                options.top = top - menu.$el.height();
            }
            if (menu.$el.width() + left > $(document.body).width()) {
                options.left = left - menu.$el.width();
            }
            menu.$el.css({
                left: options.left || 0,
                top: options.top || 0
            });
            menu.$el.css("visibility", "");
        }

        //点击页面其它地方自动隐藏
        $D.bindAutoHide({
            stopEvent:true,
            action:"click",
            element:menu.el,
            callback: options.hideInsteadOfRemove ? function(){menu.hide()} : function(){menu.remove()}
        });

        return menu;
    },
    /**当点击时自动创建菜单
    */
    createWhenClick: function (options,createCallback) {
        if (!options || !options.target) {
            throw "必须包含options.target，表示被点击的元素";
        }
        $(options.target).click(function (e) {
            if (!options.dockElement) {
                options.dockElement = $(options.target);
            }
            var menu = M2012.UI.PopMenu.create(options);
            if (createCallback) {
                createCallback(menu);
            }
        });
            
        
    },


    bindAutoHide:function(options){
        return $D.bindAutoHide(options);
    },

    unBindAutoHide: function (options) {
        return $D.unBindAutoHide(options);
    }
    
});

})(jQuery,_,M139);
﻿/**
 * @fileOverview 定义弹出菜单按钮组件
 */

(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;

	/**
	*@lends M2012.UI.MenuButton.prototype
	*/
	M139.namespace("M2012.UI.MenuButton", superClass.extend({
		/** 菜单按钮组件
	    *@constructs M2012.UI.MenuButton
	    *@extends M139.View.ViewBase
	    *@param {Object} options 初始化参数集
	    *@param {String} options.text 按钮的文本
	    *@param {String} options.template 组件的html代码
	    *@param {HTMLElement} options.container 按钮的容器
	    *@param {Function} options.onClick 按钮的点击回调
	    *@param {Function} options.onItemClick 菜单的点击回调
	    *@param {Array} options.menuItems 菜单项列表
	    *@param {Boolean} options.leftSibling 左侧是否还有按钮，显示竖线不显示圆角
	    *@param {Boolean} options.rightSibling 右侧是否还有按钮，显示竖线不显示圆角
	    *@example
		    M2012.UI.MenuButton.create({
		        text:"按 钮",
		        container:$("#btnContainer"),
		        leftSibling:true, //左边还有按钮，影响样式
		        rightSibling:true, //右边还有按钮，影响样式
		        menuItems:[
		            {
		                text:"xxx",
		                onClick:function(){}
		            }
		        ],
		        onItemClick:function(){
		            alert("itemclick");
		        },
		        onClick:function(){
		            alert("onclick");
		        }
		    });
	    */
		initialize: function(options) {
			var div = document.createElement('div');
			div.innerHTML = options.template;
			this.setElement(div.firstChild);
			return superClass.prototype.initialize.apply(this, arguments);
		},

		name: "M2012.UI.MenuButton",

		render: function() {
			var This = this;
			var options = this.options;
			var html = options.text ? M139.Text.Html.encode(options.text) : options.html;

			this.el.firstChild.innerHTML = html;

			if (options.leftSibling) {
				$D.appendHTML(this.el.firstChild, options.leftSiblingTemplate);
			}

			if (options.menuItems) {
				if (options.menuIconTemplate) {
					var temp = options.onClick ? options.menuIconTemplate : options.menuIconNoSpliterTemplate;
					$D.appendHTML(this.el.firstChild, temp);
				}
			} else {
				options.noMenu(this.$el);
			}

			if (options.rightSibling) {
				var span = this.el.firstChild;
				span = (span.firstChild && span.firstChild.tagName == "SPAN") ? span.firstChild : span;
				$D.appendHTML(span, options.rightSiblingTemplate);
			} else if (!options.onClick && options.rightNoSibling) {
				options.rightNoSibling(this.$el);
			}


			if (options.onClick) {
				this.$el.click(function(e) {
					var menuIcon = This.$el.find(options.menuIconButtonPath)[0];
					var isClickIcon = menuIcon == e.target || (menuIcon && M139.Dom.containElement(menuIcon, e.target));

					if (!isClickIcon) { // 点的不是下拉箭头
						options.onClick();
					} else if (options.onClickBefore) {
						options.onClickBefore(e); //点击下拉箭头触发回调事件, change by Aerojin 2014.04.15
					}

					if ($.browser.msie && $.browser.version <= 8) { // update by tkh IE67 阻止浏览器的默认行为，解决bug：回复转发打开空白写信页
						e.preventDefault();
					}
					//return false;
				});
			} else if (options.menuItems) {
				this.$el.click(function(e) {
					if (options.onClickShow) {
						options.onClickShow(e);
					}
					This.showMenu();

					// 在应用中创建按钮时onclick事件和样式耦合
					// 因此在不需要onclick样式的按钮上记录onclick事件只能放到这里
					var text = $.trim(options.text);
					if (text == "移动到") {
						$App.isReadSessionMail() && BH('cMail_toolbar_move');
					} else if (text == "标记为") {
						$App.isReadSessionMail() && BH('cMail_toolbar_mark');
					}
				});
			}

			if (options.menuItems && options.onClick && options.menuIconButtonPath) {
				this.$el.find(options.menuIconButtonPath).click(function() {
					This.showMenu();
				});
			}

			return superClass.prototype.render.apply(this, arguments);
		},

		/**@inner*/
		showMenu: function() {
			var menu = this.menu;
			var options = this.options;

			if (menu === undefined) {
				this.menu = M2012.UI.PopMenu.create(_.chain(options).pick(["selectMode", "onItemClick", "customClass", "customStyle"]).extend({
					dockElement: this.$el,
					items: options.menuItems,
					hideInsteadOfRemove: true
				}).value());
			} else {
				menu.isHide() ? menu.show() : menu.hide();
			}
		}
	}));

	var DefaultMenuButtonStyle = {
		template: ['<a class="btnTb ml_6" href="javascript:">', '<span class="r pr_25 two"></span>', '</a>'].join(""),
		//下拉图标
		menuIconTemplate: '<span><i class="i_triangle_d"></i></span>',
		//按钮没有自己的onClick的时候，不出现中间那条线，也就不需要多一个span
		menuIconNoSpliterTemplate: '<i class="i_triangle_d"></i>',
		leftSiblingTemplate: '<i class="l-line"></i>',
		rightSiblingTemplate: '<i class="r-line"></i>',
		//当右边没有按钮的时候
		rightNoSibling: function($el) {
			$el.find("span.pr_25")[0].className = "pr_20 p_relative";
		},
		//当没有子菜单的时候
		noMenu: function($el) {
			$el.find("span.pr_25")[0].className = "p_relative";
		},
		menuIconButtonPath: "span > span"
	};


	jQuery.extend(M2012.UI.MenuButton, {
		/**
		*使用常规的样式创建一个菜单实例
		*@lends M2012.UI.MenuButton
		*@see #M2012.UI.MenuButton.prototype.initialize
		*/
		create: function(options) {
			if (!options || !(options.text || options.html) || !options.container) {
				throw "M2012.UI.MenuButton.create:参数非法";
			}
			options = _.defaults(options, DefaultMenuButtonStyle);
			var button = new M2012.UI.MenuButton(options);
			var el = button.render().el;
			var container = options.container || document.body;
			$(container).append(el);
			return button;
		}
	});

})(jQuery, _, M139);
﻿/**
 * @fileOverview 定义下拉框组件，仿原生的select控件
 */

(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace("M2012.UI.DropMenu", superClass.extend(
		/**
		 *@lends M2012.UI.DropMenu.prototype
		 */
		{
			/** 下拉框组件
			 *@constructs M2012.UI.DropMenu
			 *@extends M139.View.ViewBase
			 *@param {Object} options 初始化参数集
			 *@param {String} options.template 组件的html代码
			 *@param {String} options.contentPath 定义子项的容器路径
			 *@param {Number} options.selectedIndex 初始化下标（选中的项）
			 *@example
			 */
			initialize: function(options) {
				var $el = $(options.template);
				this.setElement($el);
				return superClass.prototype.initialize.apply(this, arguments);
			},
			name: "M2012.UI.DropMenu",

			/**构建dom函数*/
			render: function() {
				var This = this;
				var options = this.options;

				if (options.contentPath) {
					var initText = options.defaultText || "";
					if (typeof options.selectedIndex == "number") {
						initText = options.menuItems[options.selectedIndex].text || options.menuItems[options.selectedIndex].html;
						this.selectedIndex = options.selectedIndex;
					}
					this.setText(initText);
				}

				/*防止事件重复绑定*/
				this.$el.off('click').on("click", function() {
					if (This.quiet) {
						return;
					}
					This.showMenu();
				});

				return superClass.prototype.render.apply(this, arguments);
			},

			defaults: {
				selectedIndex: -1
			},

			/**@inner*/
			setText: function(text) {
				this.$el.find(this.options.contentPath).html(text);
			},

			disable: function() {
				this.quiet = true;
			},

			enable: function() {
				this.quiet = false;
			},

			/**@inner*/
			showMenu: function() {
				var This = this;
				var menu = this.menu;
				var options = this.options;

				if (menu === undefined) {
					var menuOptions = {
						onItemClick: function(item, index) {
							This.onMenuItemClick(item, index);
						},
						container: document.body,	// todo 很搓
						items: options.menuItems,
						dockElement: this.$el,
						width: this.getWidth(),
						maxHeight: options.maxHeight,
						customClass: options.customClass,
						selectMode: options.selectMode,
						hideInsteadOfRemove: true
					};
					this.menu = M2012.UI.PopMenu.create(menuOptions);
					this.menu.on("subItemCreate", function(item) {
						This.trigger("subItemCreate", item);
					});
					This.trigger("menuCreate", this.menu);
				} else {
					menu.isHide() ? menu.show() : menu.hide();
				}
			},

			/**inner*/
			onMenuItemClick: function(item, index) {
				this.setText(item.text || item.html);
				this.selectedIndex = index;
				/**
				 *选中值发生变化
				 *@event
				 *@name M2012.UI.DropMenu#change
				 *@param {Object} item 原来的menuItem数据
				 *@param {Number} index 选中的下标
				 */
				this.trigger("change", item, index);
			},
			/**
			 *得到选中的值
			 *@returns {Object}
			 */
			getSelectedItem: function() {
				return this.options.menuItems[this.selectedIndex] || null;
			},
			/***
			设置当前选中项
			*/
			setSelectedIndex: function(idx) {
				this.selectedIndex = idx;
				this.options.selectedIndex = idx;
				var item = this.getSelectedItem();
				this.setText(item.text || item.html);
			},
			setSelectedText: function(text) {
				this.setSelectedValue(text, "text");
			},
			setSelectedValue: function(val, type) {
				for (var i = 0; i < this.options.menuItems.length; i++) {
					if (this.options.menuItems[i].value == val || (type == "text" && this.options.menuItems[i].text == val)) {
						this.setSelectedIndex(i);
						return;
					}
				}
			},
			/**
			* 获取数量
			*/
			getCount: function() {
				return this.options.menuItems.length;
			},
			/**
			* 在指定的位置添加一项，默认在尾部追加
			*/
			addItem: function(item, position) {
				if (position == undefined) {
					this.options.menuItems.push(item);
				} else {
					this.options.menuItems.splice(position, 0, item);
				}
				this.render();
			}
		}
	));

	var DefaultStyle = {
		template: [
			'<div class="dropDown">',
			'<div class="dropDownA" href="javascript:void(0)"><i class="i_triangle_d"></i></div>',
			'<div class="dropDownText"></div>',
			'</div>'
		].join(""),
		contentPath: ".dropDownText",
		dropButtonPath: ".dropDownA"
	};


	jQuery.extend(M2012.UI.DropMenu,
		/**
		 *@lends M2012.UI.DropMenu
		 */
		{
			/**
			*使用常规的样式创建一个菜单实例
			*@param {Object} options 参数集合
			*@param {String} options.defaultText 初始化时按钮的默认文本（如果有selectedIndex属性，则此属性无效）
			*@param {Array} options.menuItems 菜单项列表
			*@param {Number} options.selectedIndex 初始化下标
			*@param {HTMLElement} options.container 按钮的容器
			*@example
			var dropMenu = M2012.UI.DropMenu.create({
			    defaultText:"默认文本",
			    //selectedIndex:1,
			    menuItems:[
			        {
			            text:"选项一",
			            myData:1
			        },
			        {
			            text:"选项二",
			            myData:2
			        }
			    ],
			    container:$("div")
			});
			dropMenu.on("change",function(item){
			    alert(item.myData);
			});

			alert(dropMenu.getSelectedItem());//如果默认没有选中值，则返回null
			*/
			create: function(options) {
				if (!options || !options.container) {
					throw "M2012.UI.DropMenu.create:参数非法";
				}
				options = _.defaults(options, DefaultStyle);
				var button = new M2012.UI.DropMenu(options);
				options.container.html(button.render().$el);

				return button;
			}
		});

})(jQuery, _, M139);

﻿/**创建浮动的popup容器
 * icon支持的样式 i_ok对号，i_warn叹号 
 * @example
 * 			
 * var popup=M139.UI.Popup.create({
	target:document.getElementById("btn_popup"),
	icon:"i_ok",
	buttons:[{text:"确定",cssClass:"btnRed",click:function(){alert("ok");popup.close();}},
		{text:"取消",click:function(){alert("cancel");popup.close();}}
	],
	content:"hello"
	}
	);

	popup.render();
 */
M139.core.namespace("M139.UI.Popup", Backbone.View.extend({
    initialize: function (options) {

        this.target = options.target;//目标元素
        this.icon = null; //图标的样式名，
        this.buttons = null;//按钮集合，如[{text:"确定",click:function(){},class:"cssName"}]
        this.contentElement = null;//无素的el

        options.mainClass = options.mainClass || "tips delmailTips"; //顶层容器的样式
        options.containerClass = options.containerClass || "norTips"; //容器的样式
        options.contentClass = options.contentClass || "norTipsContent"; //内容的样式
        
        this.width = options.width;
        
        this.options = options;
    },
    render: function () {
        var self = this;
        var options = this.options;
        if (this.contentElement != null) { //避免重复调用
            return;
        }
        function getOffset() {
            var offset = $(self.target).offset();
            //console.log(offset);
            //console.log($(self.target).position());
            /*
			$(self.target).parents().each(function(){
				var t=$(this);
				if(t.css("position")=="absolute"){
					offset.top-=t.offset().top;
					offset.left-=t.offset().left;
				}
			});*/
            return offset;
        }
        function getHeight() {
            return self.height || $(self.contentElement).height()
        }

        function getWidth() {
            if (($.browser.msie && $.browser.version < 7) && !self.width) {
                self.width = 220;//IE6加默认宽度
            }
            return self.width || $(self.contentElement).width()
        }

        function getPosition(arrow) { //根据taget获取坐标
            var pos = getOffset();
            var height = $(self.target).height();

            try {
                $(self.contentElement).width(getWidth());//宽度自适应
            } catch (ex) { //避免iframe跨域报错

            }
            var left = pos.left;
            var x = parseInt(getOffset().left) + parseInt(getWidth());
            var w;
            if (x > $(window).width()) { //x座标超出屏幕区域,从右向左
                left = $(self.target).offset().left + $(self.target).width() - getWidth()-5; //重置内容栏的x坐标

                w = $(self.contentElement).width() - $(self.target).width() / 2 ;

            } else {
                w = $(self.target).width() / 2;
            }

            w -= 3;

            $(self.contentElement).find("[name=popup_arrow]").css("left", w + "px"); //重设箭头的x坐标		

            //return "top:"+(pos.top+height+10)+"px;left:"+(pos.left)+"px;width:235px;";	
            if (arrow == "down") { //向上指的箭头 down
                self.contentElement.css({
                    top: (pos.top + height + 10) + "px",
                    left: left + "px"
                });
            } else {//向下指的箭头 up
                /*self.contentElement.css({top:(pos.top+height-10-getHeight()-$(self.target).height())+"px",
					left:left+"px"});*/
                var t = ($(self.target).offset().top - getHeight()) - 10;

                self.contentElement.css({
                    top: t + "px",
                    left: left + "px"
                });
            }

        }

        function getArrowDirection() {//根据taget获取小箭头的方向
            // warning：此处需要先执行getOffset().top
            // ie11（默认ie9模式）下，首次执行getOffset()获取不到值
            console.log(getOffset())
            var y = getOffset().top + getHeight();
            if (y > $(window).height()) { //y座标超出屏幕区域

                //return "tipsBottom";
                return "up";
            } else {
                //return "tipsTop";
                return "down";
            }


        }
        function getIcon() { //获取图标的html
            if (self.options && self.options.icon) {
                return '<span class="norTipsIco"><i class="' + self.options.icon + '"></i></span>';
            } else {
                return "";
            }

        }
        function getButtons() {//获取按钮的html
            var b = options.buttons;
            if (b) {
                var result = ['<div name="buttons" class="delmailTipsBtn">'];
                for (var i = 0; i < b.length; i++) {
                    var className = b[i]["cssClass"] ? b[i]["cssClass"] : "btnNormal";
                    result = result.concat(['<a href="javascript:void(0)" class="', className, '"><span>', b[i]["text"], '</span></a>']);

                }
                result.push("</div>");
                return result.join("");
            } else {
                return "";
            }
            //return '<div class="delmailTipsBtn"><a href="javascript:void(0)" class="btnRed"><span>删 除</span></a><a href="javascript:void(0)" class="btnNormal"><span>取 消</span></a></div>';
        }
        function getArrowPosition() {//获取小箭头x轴的坐标
            //var w=$(self.target).width();
            //return "left:"+(w/2)+"px";
        }

        var html = ['<div id="popup_', options.name, '" style="z-index:1001" class="',options.mainClass,'"> <a href="javascript:" class="delmailTipsClose" name="popup_close">',
            options.noClose ? '' : '<i class="i_u_close"></i>',
   '</a><div class="tips-text">',
     '<div class="', options.containerClass,
     '" style="', options.height ? "height:" + options.height : "px",
     '"> ', getIcon(),
       '<div class="', options.contentClass, '">',
       options.content,
       '</div>',
     '</div>',
     getButtons(),
   '</div>',
   '<div class="diamond" name="popup_arrow" style="', getArrowPosition(), '"></div>',
 '</div>'].join("");

        this.contentElement = $(html); //先创建dom，是获取dom的引用
        $(document.body).append(this.contentElement);
        //this.contentElement=$("#"+elementId);
        var direction = options.direction || getArrowDirection();
        var arrowClass = direction == "up" ? "tipsBottom" : "tipsTop";

        this.contentElement.find("[name=popup_arrow]").addClass(arrowClass);//必须要生成dom计算高度后才能知道箭头方向
        this.contentElement.find("[name=popup_close]").click(function (e) { //关闭按钮点击事件
            //加一个关闭按钮的回调，要怨就怨产品去
            if (options && options.closeClick) {
                if (typeof options.closeClick == 'function')
                    options.closeClick();
            }

            self.trigger("close", {event: e, source: "popup_close"});
            self.close();
        });
        getPosition(direction);//内容容器及箭头重定位
        $(this.options.buttons).each(function (idx) { //底部按钮集点击事件
            //var click=this["click"];
            self.contentElement.find("div[name=buttons] a").eq(idx).click(this["click"]);
        });
        if (options.autoHide) {
            $D.bindAutoHide({
                action: "click",
                stopEvent: true,
                element: this.contentElement.get(0),
                callback: function (data) {
                    self.trigger("close", data);
                    if (!data.cancel) {
                        self.close();
                    }
                }
            });
        }

    },
    close: function () { //关闭popup
        try {
            M139.Dom.fixIEFocus();
        } catch (ex) { }
        if (this.contentElement) {
            this.contentElement.remove();
        }
        this.contentElement = null;//释放指针
    }
}));

jQuery.extend(M139.UI.Popup,{ //扩展原型增加工厂方法
	popupList:{},
	create:function(options){ //工厂模式＋单例，创建一个popup实例
		var name=options.name || "tips"+Math.random();
		options.name = name;
		if(!this.popupList[name] || this.popupList[name].contentElement==null){ //是否创建过，每个name只创建一个实例
			this.popupList[name]=new M139.UI.Popup(options);
			this.currentPopup=this.popupList[name];
		}
		return this.popupList[name];
	},
	close:function(name){
		var instance=this.currentPopup;
		if(name){
			instance=this.popupList[name];
		}
        if(instance){
		   instance.close();
        }

	}
	  
});

/** 
 * 标签页控件
 * @param {Object} container 标签控件的容器，请传递页面中的dom元素引用
 * @param {Array} tabList 标签页的标题数组，数组长度即等于标签个数
 * @param {Array} pageList 内容页的数组，存放html内容，数组长度即等于标签个数
 * @param {Function} onTabChange　标签页切换的回调函数，当首次调用render的时候，以及切换标签的时候都会触发，在此回调函数中可以调用this.setPageContent来设置内容页的html
 * @example
 * 有两种方式创建，1.直接设置tab和page的数组，不需要代码进行控制。2.一开始不设定page内容，在标签切换事件onTagChange回调函数中调用setPageContent设置内容
 * 
 * 方式1:
 * 	var tab=new TabPage({container:document.getElementById("div1"),
	tabList:["one","two","three"],
	pageList:["您好","世界","hello,world"]
	});
	tab.render();
	
	方式2
	var tab2=new TabPage({container:document.getElementById("div2"),
	tabList:["tab1","tab2","tab3"],
	onTabChange:function (tabIndex){
		var html=["<p>tab content",tabIndex,"</p>"].join("");
		this.setPageContent(html);
	}
	});
	tab2.render();
 */
M139.core.namespace("M139.UI",{ 
TabPage:function(options){
	var self=this;
	this.el=null;
	this.className="tab";
	this.tabList = null; //标签页标题的数组
	this.tabBh = null;
	this.pageList=null;//内容页数组
	this.container=null;
	this.selectedIndex=0;	//当前选中项索引
	this.onTabChange=null;	//选中tab回调事件
	this.tabControl=null;		//tab栏的容器
	this.tabContent=null;		//内容栏的容器
	this.tabDefaultClass="";
	this.tabActiveClass="on";
	this.contentList=new Object();	//内容栏的缓存列表
	
	function getOptions(){	//初始化参数
		for(elem in options){
			if(elem){
				self[elem]=options[elem];
			}
		}
	}
	getOptions();
	
	/***
	 * 初始化容器
	 */
	this.init=function(){ 
		var div=document.createElement("div");
		if(this.tabControl==null){	
			
			div.className=this.className;
			div.innerHTML="<div class=\"tabTitle\"></div>";
			if(this.container){
				this.container.appendChild(div);
			}
			
			var ul=document.createElement("ul");
			div.firstChild.appendChild(ul);
			this.tabControl=ul;
			this.tabContent=document.createElement("div");
			div.appendChild(this.tabContent);
			if (options.contentClass) {
			    this.tabContent.className = options.contentClass;//"tabMain";
			}
		}
		this.el=div;
		return div;
	}
	
	/**
	 * 设置tab页的内容，可以传字符串也可以传dom element，实现了对内容节点的缓存
	 */
	this.setPageContent=function(content){
		var key=this.selectedIndex;
		if (this.tabContent.childNodes.length > 0) {	//先删除原节点
			this.tabContent.removeChild(this.tabContent.childNodes[0]);
		}
			
		if (this.contentList[key]) {	//本tab页已打开过
			this.tabContent.appendChild(this.contentList[key]);
		}
		else {	//本tab页第一次加载
			var c=document.createElement("div");
			c.className="tabContent";
			c.style.display="block";
			this.tabContent.appendChild(c);
			if (typeof(content) == "string") {
				c.innerHTML = content;
			}else{
				c.appendChild(content);
			}
			this.contentList[key]=c;
		}
		
	
	}
	//创建和重新显示tab栏
	this.renderTab=function(isInit){
	    function addTabEvent(tab,idx){
	        tab.onclick = function(){
	            self.changeTab(idx);
	            return false;
			};
	    }
		var idx=0;
		for(elem in this.tabList){
		    obj = this.tabList[elem];
		    tabBh = this.tabBh[elem];
			var tab;
			if(isInit){	//首次调用时创建tab
				tab=document.createElement("li");
				//tab.style.display="inline";
				tab.innerHTML = " <a hidefocus=\"1\" bh=" + tabBh + " href=\"javascript:\"> <span>" + obj + " </span> </a>";
				this.tabControl.appendChild(tab);
			}else{
				tab=this.tabControl.childNodes[idx];
			}
			if (this.selectedIndex == idx) {
				tab.className = "on";
			}else{
				tab.className = "";
			}
			addTabEvent(tab,idx);
			idx++;
			
		}
	}
	//切换tab栏
	this.changeTab=function(targetIndex,isFirst){
		this.selectedIndex=targetIndex;
		this.renderTab(false);
		if(this.pageList){
			this.setPageContent(this.pageList[targetIndex]);	//设置内容
		}
		if(this.onTabChange){
			this.onTabChange(targetIndex,isFirst); 
		}
		
	}
	this.render=function(){
		this.init();
		this.renderTab(true);
		this.changeTab(0,true);
		return this.el;
	}
	
}
})

/** 
 * 导航页控件
 * @param {Object} container 左侧导航控件的容器，请传递页面中的dom元素引用
 * @param {Function} onTabChange　导航页切换的回调函数
	var tab = new TabNav({
		container:document.getElementById("#nav"),
		onTabChange:function (item){
		}
	});
	tab.render();
 */
M139.namespace("M139.UI.TabNav", Backbone.View.extend({

	events: {
		"click li.nav-item": "changeTab",
		"click .groupToggleShow": "toggleFold"
	},

	initialize: function(options){
		var tpl = "", html, items, obj = {};

		this.items = [];
		this.onTabChange = options.onTabChange;

		for(var key in options.items) {
			items = options.items[key];
			this.items = this.items.concat(items.data);
			obj[key] = $TextUtils.formatBatch(items.itemTemplate, items.data).join("");
		}
		
		html = $TextUtils.format(options.template, obj);

		var $el = $(html).hide().css("marginLeft", 0);
		$el.appendTo(options.container);
		$el.find("li.nav-item").each(function(index) {
			$(this).attr("nav-index", index);
		});
		this.setElement($el);
	},

	render: function(){
		return this;
	},

	getItems: function(){
		return this.items;
	},

	//切换tab栏
	changeTab: function(e){
		var index = $(e.currentTarget).attr("nav-index") | 0;
		if((typeof index == "number") && index < 0 || index >= this.items.length) {
			return ;
		}
		//this.switchItem(index);
		$App.show(this.items[index].key);
		this.onTabChange(this.items[index]);
	},

	switchItem: function(key){
		var index, len;
		var items = this.items;
		if(typeof key === "string") {
			for(index=0,len=items.length; index<len; index++){
				if(key === items[index].key) break;
			}
		} else {
			index = key;
		}

		this.$el.find("li a.on").removeClass("on");
		this.$el.find("li.nav-item:eq(" + index + ")>a").addClass("on");
	},

	// 切换组折叠与显示
	toggleFold: function(e) {
		var element = $(e.currentTarget).find("i");
		var jGroup = $(e.currentTarget).next("ul");
		if (element.hasClass('t_blackRight')) {
			jGroup.show();
			element.removeClass("t_blackRight").addClass("t_blackDown");
		} else {
			jGroup.hide();
			element.removeClass("t_blackDown").addClass("t_blackRight");
		}
	},

	hide: function(){
		this.$el.hide();
	},
	show: function(key){
		//$("#sub").hide();
		this.$el.show();
	}
}));

﻿

    M139.core.namespace("M2012.UI.RichHint",
         Backbone.View.extend({
             histList: {},
             hintEl: null,
             register: function (target, titleHtml) {
                 var overTarget = false;
                 var overHint = false;
                 var T = this;
                 function createHint(sender) {
                     if ($(target).is(":visible")) { //target必须是可见的，未被销毁的

                         if (!T.hintEl) {//创建hint的dom,确保单例
                             T.hintEl = $("<div class='remarkTips shadow'></div>");

                             $(document.body).append(T.hintEl);
                         }
                         T.hintEl.unbind();//清除所有事件
                         T.hintEl.hide();//先不展示
                         if (_.isFunction(titleHtml)) {
                             T.hintEl.html(titleHtml(sender));
                         } else {
                             T.hintEl.html(titleHtml);
                         }



                         var offset = $(sender).offset();

                         offset.top = offset.top + $(sender).height() + 8;
                         T.hintEl.css({
                             "position": "absolute",
                             "left": offset.left + "px",
                             "top": offset.top + "px"
                         });//绝对定位
             
                         var showArgs = { sender: sender, el: T.hintEl, isShow: true };
                         T.trigger("show", showArgs);
                         if (showArgs.isShow) { //是否显示，在事件监听中可以禁止显示
                             T.hintEl.show();
                         } else {
                             T.hintEl.html("");
                             T.hintEl.hide();
                             return;
                         }

                         T.hintEl.hover(function () {
                             overHint = true;
                         }, function () {
                             overHint = false;
                             checkForDispear();
                         });
                         T.hintEl.click(function () {
                             
                             checkForDispear();
                         });
                     }
                 }
                 function initTarget() {

                     $(target).hover(function () { //target的划过时，停留500毫秒再创建hint
                         overTarget = true;
                         var sender = $(this);
                         setTimeout(function () {
                             //1.必须有一个over才创建，避免移出后，由于延时执行创建导致的死灰复燃.
                             //2.target必须是可见的，未被销毁的
                             if ($(target).is(":visible") && (overTarget || overHint)) {
                                 createHint(sender);
                             }
                         }, 1000);
                     }, function () {
                         overTarget = false;
                         checkForDispear();
                     });

                 }
                 function checkForDispear() {
                     setTimeout(function () {
                         if (!overTarget && !overHint) {
                             if (T.hintEl) {
                                 T.hintEl.html("");
                                 T.hintEl.hide();
                             }

                         }
                     }, 200);
                 }

                 initTarget();
             }

         })
    );

    (function (){
        $Hint = M2012.UI.RichHint.prototype;
    })();

﻿/**
 * @fileOverview 定义加载中的提示组件
 */

(function (jQuery, Backbone, _, M139) {
    var $ = jQuery;

    


    M139.core.namespace("M139.UI", {
        TipMessage: {
            /**
             *显示加载中的提示，默认为顶部绿色提示
             *@param {String} msg 提示文本
             *@param {Object} options 可选参数集合
             *@param {Number} options.delay 延迟多少毫秒自动消失
             */
            show: function (msg, options) {
                if (!msg) return;
                if(this.prior){
                    return;
                }
                var self = this;
                if (!this.isAdded) {
                    var div = document.createElement("div");
                    div.innerHTML = "<span id=\"tipmsg\" style=\"display:none;position:absolute;z-index:9999;top:0px;left:45%;\" class=\"msg\"></span>";
                    this.el = $(div.firstChild);
                    document.body.appendChild(div.firstChild);
                    this.isAdded = true;
                }
                //var left = (document.body.offsetWidth - 100) / 2;  计算body宽度性能损耗太严重了
                //this.el.css("left", left + "px");
                this._removeClass();
                if (options && options.className) {
                    this.className = options.className;
                    this.el.addClass(options.className); //加上自定义样式，一般为底色如：msgRed
                }
                this.el[0].innerHTML = msg;
                this.el.show();

                var showKey = Math.random().toString();
                this.el.attr("showkey", showKey);

                clearTimeout(this.el.stop().data('timer'));//取消fadeOut
                
                if(options && options.prior){
                    this.prior = options.prior;
                }
                
                if (options && options.delay) { //自动消失
                    setTimeout(function () {
                        if (self.el.attr("showkey") === showKey) {
                            self.prior = false;
                            self.hide();
                        }
                    }, options.delay)
                }
            },
            warn: function (msg, options) {
                this.show(msg, $.extend({ className: 'msgYellow' }, options));
            },
            error:function(msg,options){
                this.show(msg, $.extend({ className: 'msgRed' }, options));
            },
            /**
             *显示在屏幕中间显眼的loading提示
             *@param {String} msg 提示文本
             *@param {Object} options 可选参数集合
             *@param {Number} options.delay 延迟多少毫秒自动消失
             *@example
             M139.UI.TipMessage.showMiddleTip("正在归档...");
             //隐藏
             M139.UI.TipMessage.hideMiddleTip();
             */
            showMiddleTip: function (msg, options) {
                var self = this;
                if (!this.middleTip) {
                    this.middleTip = $(['<div class="noflashtips inboxloading" style="z-index:99999">',
	                    ($.browser.msie && $.browser.version <= 7) ? '<i></i>' : '',
	                    '<img src="/m2012/images/global/load.gif" alt="加载中..." style="vertical-align:middle;">加载中，请稍后...',
                    '</div>'].join("")).appendTo(document.body);
                }
                msg = msg || "加载中，请稍后...";
                M139.Dom.setTextNode(this.middleTip[0], msg);
                this.middleTip.show();


                var showKey = Math.random().toString();
                this.middleTip.attr("showkey", showKey);

                clearTimeout(this.middleTip.stop().data('timer'));//取消fadeOut

                if (options && options.delay) { //自动消失
                    setTimeout(function () {
                        if (self.middleTip.attr("showkey") === showKey) {
                            self.hideMiddleTip();
                        }
                    }, options.delay)
                }
            },

            /**
             *隐藏中间提示
             */
            hideMiddleTip:function(){
                this.middleTip && this.middleTip.fadeOut(800);
            },

            /**
             *隐藏顶部加载中的提示
             */
            hide: function () {
                if(this.prior){
                    return;
                }

                var _this = this;
                
                if ($B.is.ie && $B.getVersion() < 8) {
                    this.el && this.el.hide();
                    _this._removeClass();
                }else{
                    this.el && this.el.fadeOut(800, function(){
                        _this._removeClass();
                    });
                }
                
            },
            _removeClass: function () {
                if (this.className) {
                    this.el.removeClass(this.className);
                    this.className = null;
                }
            }
        }
    });
})(jQuery, Backbone, _, M139);
﻿/**
 * @fileOverview 定义翻页组件代码
 */

 (function(jQuery,_,M139){
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.PageTurning";
    M139.namespace(namespace,superClass.extend(
    /**@lends M2012.UI.PageTurning.prototype*/
    {
       /** 弹出菜单组件
        *@constructs M2012.UI.PageTurning
        *@extends M139.View.ViewBase
        *@param {Object} options 初始化参数集
        *@param {Number} options.pageCount 页数
        *@param {Number} options.pageIndex 初始化下标（第几页，从1开始）
        *@param {String} options.template 组件的html代码
        *@param {String} options.selectButtonTemplate 当有下拉按钮的时候，按钮的模板
        *@param {String} options.selectButtonInsertPath 下拉按钮插入的位置
        *@param {String} options.selectButtonPath 下拉按钮插入的位置
        *@param {String} options.nextButtonTemplate
        *@param {String} options.nextButtonInsertPath
        *@param {String} options.nextButtonPath
        *@param {String} options.prevButtonTemplate
        *@param {String} options.prevButtonInsertPath
        *@param {String} options.prevButtonPath
        *@param {String} options.pageNumberButtonTemplate
        *@param {String} options.pageNumberButtonInsertPath
        *@param {String} options.pageNumberButtonPath
        *@param {String} options.pageNumberContentPath
        *@param {String} options.maxPageButtonShow 一次最多显示几个1,2,3按钮
        *@example
        var pt = new M2012.UI.PageTurning({
            template:'&lt;div class="blacklist-page"&gt;&lt;/div>',
            pageNumberButtonTemplate:'&lt;a rel="number" href="javascript:;"&gt;&lt;/a&gt;',
            pageNumberButtonPath:"a[rel='number']",
            prevButtonTemplate:'&lt;a rel="prev" href="javascript:;"&gt;上一页&lt;/a&gt;',
            prevButtonPath:"a[rel='prev']",
            nextButtonTemplate:'&lt;a rel="next" href="javascript:;"&gt;下一页&lt;/a&gt;',
            nextButtonPath:"a[rel='next']",
            numberButtonFocusClass:"on"
        });
        */
        initialize: function (options) {
            var $el = jQuery(options.template);
            this.setElement($el);
            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: namespace,
        /**构建dom函数*/
        render:function(){
            var options = this.options;
            this.renderChildren(options);
            this.initEvent();
            return superClass.prototype.render.apply(this, arguments);
        },
        /**
         *创建内容html
         *@inner
         */
        renderChildren:function(options){
            this.options.pageIndex = options.pageIndex;
            this.options.pageCount = options.pageCount;

            //如果有下拉页码按钮
            if (options.selectButtonTemplate) {
                this.$el.append(options.selectButtonTemplate);
                this.$(options.pageLabelPath).text(options.pageIndex + "/" + options.pageCount);
            }

            var showPrev = options.pageIndex > 1;
            var btnPrev = $(options.prevButtonTemplate);
            //插入上一页按钮
            if(options.prevButtonTemplate){
                if(options.prevButtonInsertPath){
                    btnPrev.appendTo(this.$el.find(options.prevButtonInsertPath));
                }else{
                    btnPrev.appendTo(this.$el);
                }
            }
            //如果不显示，可以消失或者灰显
            if (!showPrev) {
                if (options.disablePrevButtonClass) {
                    btnPrev.addClass(options.disablePrevButtonClass);
                } else {
                    btnPrev.hide();
                }
            }

            //如果有页码按钮
            if (options.pageNumberButtonPath) {
                //插入页码按钮
                if(options.pageCount > 1){
                    if(options.pageNumberButtonTemplate){
                        var pageNumberContainer = options.pageNumberButtonInsertPath ? this.$el.find(options.pageNumberButtonInsertPath) : this.$el;
                        var startPage = 1;
                        var endPage = options.pageCount;

                        //优化每次显示最佳的目标页码按钮
                        if(options.maxPageButtonShow && options.maxPageButtonShow < options.pageCount){
                            startPage = Math.max(options.pageIndex-2,1);
                            startPage = Math.min(startPage,options.pageCount - options.maxPageButtonShow + 1);
                            endPage = Math.min(startPage + options.maxPageButtonShow - 1,options.pageCount);
                        }
                    
                        for(var i=startPage;i<=endPage;i++){
                            var numberButton = jQuery(options.pageNumberButtonTemplate).appendTo(pageNumberContainer);
                            if(options.pageNumberContentPath){
                                numberButton.find(options.pageNumberContentPath).text(i);
                            }else{
                                numberButton.text(i);
                            }
                            numberButton.attr("index",i);
                        }
                    }
                }

                //当前页码获得焦点
                if(options.numberButtonFocusClass){
                    this.$el.find("*[index='" + options.pageIndex + "']").addClass(options.numberButtonFocusClass);
                }
            }

            var showNext = options.pageCount > 1 && options.pageIndex < options.pageCount;
            var btnNext = $(options.nextButtonTemplate);
            //插入下一页按钮
            if(options.nextButtonTemplate){
                if(options.nextButtonInsertPath){
                    btnNext.appendTo(this.$el.find(options.nextButtonInsertPath));
                } else {
                    btnNext.appendTo(this.$el);
                }
            }
            if (!showNext) {
                if (options.disableNextButtonClass) {
                    btnNext.addClass(options.disableNextButtonClass);
                } else {
                    btnNext.hide();
                }
            }
        },
        /**
         *绑定事件
         *@inner
         */
        initEvent:function(){
            var This = this;
            var options = this.options;
            if(options.pageNumberButtonPath){
                this.$el.find(options.pageNumberButtonPath).click(function(){
                    var index = this.getAttribute("index") * 1;
                    This.onNumberButtonClick(index);
                });
            }

            if(options.prevButtonPath){
                this.$el.find(options.prevButtonPath).click(function(){
                    This.onPrevButtonClick();
                });
            }

            if(options.nextButtonPath){
                this.$el.find(options.nextButtonPath).click(function(){
                    This.onNextButtonClick();
                });
            }

            if (options.selectButtonPath) {
                this.$(options.selectButtonPath).click(function () {
                    This.onSelectPageClick();
                });
            }
        },

        /**
         *程序控制强制翻页
         *@param {Number} pageIndex 更新当前页码
         *@param {Number} pageCount 可选参数，更新页数，
         *@param {Boolean} isSilent 可选参数，是否静默（即不触发pagechange），默认值为false
         *@example
         var pt = M2012.UI.PageTurning.create({
            pageIndex:1
            pageCount:20,
            maxPageButtonShow:5,
            container:$("#ddd")
         });
         pt.on("pagechange",function(pageIndex){
            console.log("点击了第"+pageIndex+"页");
         });
         pt.update(2);//翻到第二页
         */
        update: function (pageIndex, pageCount, isSilent) {
            this.$el.html("");

            pageCount = typeof(pageCount) == "number" ? pageCount : this.options.pageCount;

            var newOp = _.defaults({
                pageIndex: pageIndex,
                pageCount: pageCount
            }, this.options);

            this.renderChildren(newOp);
            this.initEvent();

            if(arguments.length == 2 && _.isBoolean(arguments[1])){
                isSilent = arguments[1];
            }

            if (!isSilent) {
                /**
                *翻页事件
                *@event 
                *@name M2012.UI.PageTurning#pagechange
                *@param {Number} index 页码
                */
                this.trigger("pagechange", pageIndex);
            }
        },
        /**@inner*/
        onSelectPageClick: function () {
            var This = this;
            //显示下拉菜单
            var popup = M139.UI.Popup.create({
                    target: this.$(this.options.selectButtonPath),
                    width: 135,
                    buttons: [{
                        text: "确定",
                        cssClass: "btnNormal",
                        click: function () {
                            var index = popup.contentElement.find("input:text").val();
                            if (/^\d+$/.test(index)) {
                                if (index > 0 && index <= This.options.pageCount) {
                                    This.onNumberButtonClick(parseInt(index));
                                } else if (index > This.options.pageCount) {
                                    //大于最大页,默认跳转到最后一页
                                    This.onNumberButtonClick(This.options.pageCount);
                                } else {
                                    //小于0,跳转到第一页(只能等于0,不能输入小于0的)
                                    This.onNumberButtonClick(1);
                                }
                            }
                            popup.close();
                        }
                    }],
                    content: '<div style="padding-top:15px;">跳转到第 <input type="text" style="width:30px;"/> 页</div>'
                }
			);
            popup.render();
            popup.contentElement.find("input:text").keyup(function (e) {
                this.value = this.value.replace(/\D/g, "");
            }).focus();
            M139.Dom.bindAutoHide({
                element: popup.contentElement[0],
                stopEvent: true,
                callback: function () {
                    popup.contentElement.remove();
                }
            });
        },
        /**@inner*/
        onNumberButtonClick:function(index){
            this.update(index);
        },
        /**@inner*/
        onPrevButtonClick:function(){
            var index = this.options.pageIndex - 1;
            if (index > 0) {
                this.update(index);
            }
        },
        /**@inner*/
        onNextButtonClick:function(){
            var index = this.options.pageIndex + 1;
            if (index <= this.options.pageCount) {
                this.update(index);
            }
        }
    }));

    jQuery.extend(M2012.UI.PageTurning,
    /**@lends M2012.UI.PageTurning*/
    {
        /**
         *创建一个分页组件的工厂方法
         *@param {Object} options 参数集合
         *@param {Number} options.pageCount 页数
         *@param {Number} options.pageIndex 初始化下标（第几页，从1开始）
         *@param {String} options.maxPageButtonShow 一次最多显示几个1,2,3按钮
         *@param {Object} options.styleTemplate 可选参数，模板风格，默认是:M2012.UI.PageTurning.STYLE1
         *@example
         var pt = M2012.UI.PageTurning.create({
            pageIndex:1
            pageCount:20,
            maxPageButtonShow:5,
            container:$("#ddd")
         });
         pt.on("pagechange",function(pageIndex){
            console.log("点击了第"+pageIndex+"页");
         });
         */
        create: function (options) {
            var styleIndex = options.styleTemplate || 1;
            var style = this["STYLE_" + styleIndex];
            options = _.defaults(options,style);
            var pt = new M2012.UI.PageTurning(options);
            pt.render().$el.appendTo(options.container);
            return pt;
        },
        /**默认风格*/
        STYLE_1:{
            template:'<div class="blacklist-page"></div>',
            pageNumberButtonTemplate:'<a rel="number" href="javascript:;"></a>',
            pageNumberButtonPath:"a[rel='number']",
            prevButtonTemplate:'<a rel="prev" href="javascript:;">上一页</a>',
            prevButtonPath:"a[rel='prev']",
            nextButtonTemplate:'<a rel="next" href="javascript:;">下一页</a>',
            nextButtonPath:"a[rel='next']",
            numberButtonFocusClass:"on"
        },
        /**风格2:收件箱风格*/
        STYLE_2: {
            template: '<div class="toolBarPaging ml_10 fr"><div>',
            pageLabelPath: "a[rel='selector'] span",//显示页码的路径
            selectButtonTemplate: '<a rel="selector" href="javascript:;" class="pagenum"><span class="pagenumtext">100/5000</span></a>',
            prevButtonTemplate: '<a rel="prev" title="上一页" href="javascript:;" class="up"></a>',//<!-- 不可点击时 加 上  up-gray -->
            nextButtonTemplate: '<a rel="next" title="下一页" href="javascript:;" class="down "></a>',//<!-- 不可点击时 加 上  down-gray -->
            prevButtonPath: "a[rel='prev']",
            nextButtonPath: "a[rel='next']",
            selectButtonPath: "a[rel='selector']",
            disablePrevButtonClass: "up-gray",
            disableNextButtonClass: "down-gray"
        }
    });

 })(jQuery,_,M139);
﻿;

(function ($, _, M) {

/**
 * 给选择出来的元素加上空白文本。
 * @param {String} text 设置的空白文本，如果为空则取消空白文本逻辑
 * @return {Void}
 */
$.extend($.fn, {
    blankText: function() {
        if (this.length <1) return this;
        var text = arguments[0];

        if (text === "") {
            $(this).unbind("focus").unbind("blur");
        } else {
            $(this).focus(function(){
                if (this.value == text) {
                    this.value = "";
                    this.style.color = "";
                }
            }).blur(function(){
                if (this.value.length == 0){
                    this.value = text;
                    this.style.color = "#AAA";
                }
            });

            if(this.val() == "") {
                this.val(text).css("color", "#AAA");
            }
        }
    }
});

M.namespace("M2012.UI.ListMenu",

    /**
     * 下拉列表类
     */
    function(param) {
        this.expandButton = param.expandButton;
        this.listContainer = param.listContainer;
        this.textField = param.textField;
        this.data = param.data;
        this.onItemCreate = param.onItemCreate;
        this.onItemClick = param.onItemClick;

        var _ = this;

        //点展开按钮时，计算完边界后，显示菜单
        $(_.expandButton).click(function(e){
            var listHeight = $(_.listContainer).height();
            var _this = $(this);
            var menuBottom = listHeight + _this.offset().top + _this.height();

            var _top = menuBottom > $(document).height() ?
                0-listHeight-7 : _this.height()

            $(_.listContainer).css("top", _top).show();
            e.stopPropagation();
        });

        $(document).click(function(e){
            $(_.listContainer).hide();
        });

        if (!$.isFunction(_.onItemCreate)){
            _.onItemCreate = function(){};
        }

        var buff = [];
        for(var i=0, m=_.data.length; i<m; i++){
            buff.push(_.onItemCreate(_.data[i], i, m));
        }
        _.listContainer.innerHTML = buff.join("");
        $(_.listContainer).hide();
        buff = null;

        buff = [].concat(_.data);
        $(_.listContainer.childNodes).each(function(i){
            $(this).data("value", buff.shift());
        });

        if (typeof(param.defaultValue) != "undefined") {
            _.textField.innerHTML = param.defaultValue;
        }

        $(_.listContainer.childNodes).click(function(e){
            _.textField.innerHTML = this.textContent || this.innerText;
            var value = $(this).data("value");

            _.onItemClick({ "value": value, sender: this, event: e});

            e.stopPropagation();
            $(_.listContainer).hide();
        });

        this.length = function(){
            return _.listContainer.childNodes.length;
        };

        this.value = function(value){
            if (typeof(value) == "undefined"){
                var _value = _.textField.innerHTML;
                $(_.listContainer.childNodes).each(function(i){
                    var itemValue = this.textContent || this.innerText;
                    if (_value == itemValue) {
                        return _.data[i];
                    }
                });
            } else {
                $(_.listContainer.childNodes).each(function(i){
                    if ($(this).data("value") == value){
                        _.textField.innerHTML = value;
                    }
                });
            }
        };
    }
);

})(jQuery, _, M139);


﻿﻿/**
 * @fileOverview 定义选择器组件（包括选择时间、日历等）
 */
 (function (jQuery,_,M139){
 var $ = jQuery;
 var superClass = M139.View.ViewBase;
M139.namespace("M2012.UI.Picker.PickerBase",superClass.extend(
 /**
  *@lends M2012.UI.Picker.PickerBase.prototype
  */
{
    /** 弹出菜单组件
    *@constructs M2012.UI.Picker.PickerBase
    *@extends M139.View.ViewBase
    *@param {Object} options 初始化参数集
    *@param {String} options.template 组件的html代码
    *@param {HTMLElement} options.container 可选参数，容器，表示该控件是静止的
    *@param {HTMLElement} options.bindInput 可选参数，挂载的文本框
    *@example
    */
    initialize: function (options) {
        options = options || {};
        var $el = jQuery(options.template||this.template);
        this.setElement($el);

        //绑定文本框获得焦点事件
        this.bindHostEvent();

        return superClass.prototype.initialize.apply(this, arguments);
    },
    name: "M2012.UI.Picker.PickerBase",

    render:function(){
        //使render只执行一次
        this.render = function(){
            return this;
        }
        this.$el.appendTo(this.options.container || document.body);
        
        return superClass.prototype.render.apply(this, arguments);
    },

    /**
     *@param {Object} options 参数集
     *@param {HTMLElement} options.dockElement 可选参数，根据什么元素定位（缺省是以文本框定位）
     *@param {Number} options.top 可选参数定位坐标
     *@param {Number} options.left 可选参数定位坐标
     */
    show:function(options){
        options = options || {};
        var dockElement = options.dockElement || this.options.bindInput;

        if(dockElement){
            var param= {
                margin:10
            };
            if(options.dx){param.dx=options.dx;param.dy=options.dy;}
            M139.Dom.dockElement(dockElement, this.el,param);
        }else if(options.x && options.y){
            this.$el.css({
                top:options.y,
                left:options.x
            });
        }
        this.$el.css("z-index","9999");
        return superClass.prototype.show.apply(this, arguments);
    },

    hide:function(){
        M2012.UI.PopMenu.unBindAutoHide({
            action:"click",
            element:this.el
        });
        return superClass.prototype.hide.apply(this, arguments);
    },

    /**
     *绑定文本框获得焦点后显示控件
     *@inner
     */
    bindHostEvent:function(){
        if(!this.options.bindInput){
            return;
        }
        var This = this;

        this.$el.click(function (e) {
            M139.Event.stopEvent(e);
        });

        $(this.options.bindInput).click(function(){
            This.render().show(This.options);

            M2012.UI.PopMenu.bindAutoHide({
                action:"click",
                element:This.el,
                stopEvent:true,
                callback:function(){
                    This.hide();
                }
            });
        });
    },

    /**子类中调用，当选择值发生变化后，主动调用onSelect，会触发select事件*/
    onSelect:function(value,index){
        if(value === undefined){
            if(this.getValue){
                value = this.getValue();
            }else if(this.getSelectedValue){
                value = this.getSelectedValue();
            }
        }
        /**选择值发生变更的时候触发
        * @name M2012.UI.Picker.PickerBase#select
        * @event
        * @param {Object} e 事件参数
        * @example
        picker.on("select",function(e){
            e.value
        });
        */
        this.trigger("select",{value:value,index:index});
    }
}
));


})(jQuery,_,M139);
﻿/**
 * @fileOverview 定义日历控件
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M2012.UI.Picker.PickerBase;
    M139.namespace("M2012.UI.Picker.Calendar", superClass.extend(
     /**
      *@lends M2012.UI.Picker.Calendar.prototype
      */
    {
        /** 日历选择组件
        *@constructs M2012.UI.Picker.Calendar
        *@extends M2012.UI.Picker.PickerBase
        *@param {Object} options 初始化参数集
        *@param {Date} options.value 初始化值
        *@param {Object} options.container 如果是静态控件，指定一个父容器
        *@param {Object} options.bindInput 如果是外挂，指定一个绑定的文本框
        *@param {Boolean} options.stopPassDate 是否禁选过去时间，默认是false
        *@example
        */
        initialize: function (options) {
            options = options || {};

            this.stopPassDate = options.stopPassDate;

            if (options.value) {
                if (this.stopPassDate) {
                    var now = new Date;
                    this.value = now > options.value ? now : options.value;
                } else {
                    this.value = options.value;
                }
            } else {
                this.value = new Date;
            }

            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: "M2012.UI.Picker.Calendar",
        template:['<div class="dayControl" style="position:absolute;z-index:9999;background-color:white">',
             '<div class="dayControlTitle">',
                 '<a href="javascript:;" class="upYear UpMonth"></a>',
                 '<a href="javascript:;" class="upMonth UpYear"></a>',
                 '<span class="MonthLabel"></span>',
                 '<a href="javascript:;" class="downYear DownYear"></a>',
                 '<a href="javascript:;" class="downMonth DownMonth"></a>',
             '</div>',
             '<div class="dayControlNo"></div>',
             '<table>',
                 '<thead>',
                 '<tr>',
                     '<th>日</th>',
                     '<th>一</th>',
                     '<th>二</th>',
                     '<th>三</th>',
                     '<th>四</th>',
                     '<th>五</th>',
                     '<th>六</th>',
                 '</tr>',
                 '</thead>',
                 '<tbody>',
                 '</tbody>',
             '</table>',
         '</div>'].join(""),
        events:{
            "click a.UpYear": "onPrevYearClick",
            "click a.DownYear":"onNextYearClick",
            "click a.UpMonth":"onPrevMonthClick",
            "click a.DownMonth":"onNextMonthClick",
            "click td":"onDateClick"
        },
        render:function(){
            this.updateContent(this.value);
            return superClass.prototype.render.apply(this, arguments);
        },
        /**
         *@inner
         */
        onPrevYearClick: function () {
            if (this.stopPassDate) {
                var prevYear = new Date(this.curValue);
                prevYear.setFullYear(prevYear.getFullYear() - 1);
                if (this.compareMonth(new Date,prevYear) > 0) {
                    return;
                }
            }
            this.curValue.setFullYear(this.curValue.getFullYear() - 1);
            this.updateContent(this.curValue);
        },
        /**
         *@inner
         */
        onNextYearClick:function(){
            this.curValue.setFullYear(this.curValue.getFullYear() + 1);
            this.updateContent(this.curValue);
        },
        /**
         *@inner
         */
        onPrevMonthClick: function () {
            if (this.stopPassDate && this.isCurrentMonth(this.curValue)) {
                //禁选过去月
                return;
            }

            this.curValue.setDate(0);
            this.updateContent(this.curValue);
        },
        /**
         *@inner
         */
        onNextMonthClick:function(){
            this.curValue.setDate(32);
            this.updateContent(this.curValue);
        },

        /**
         *日期变更后刷新html
         *@inner
         */
        updateContent: function (date) {
            this.$("tbody").html(this.getCalendarHTML(date));
            this.$(".MonthLabel").text(date.format("yyyy-MM"));
            this.curValue = new Date(date);
            this.focusSelectedCell(date);
        },


        /**
         *让选中的日期单元格高亮
         *@inner
         */
        focusSelectedCell:function(){
            this.$("td.on").removeClass("on");
            var date = this.value.getDate();
            this.$("td[rel='" + date + "']").addClass("on");
        },

        /**@inner*/
        onDateClick:function(e){
            var td = e.target;
            var date = td.innerHTML;
            
            if(/\d+/.test(date)){
                var selDate = new Date(this.curValue);
                selDate.setDate(date);

                if (this.stopPassDate) {
                    var now = new Date();
                    if (!M139.Date.isSameDay(now, selDate) && now > selDate) {
                        return;
                    }
                }

                this.value = selDate;
                this.focusSelectedCell();
                this.onSelect(selDate);
                this.hide();
            }
        },

        //是否过去的月份
        compareMonth:function(date1,date2){
            if (date1.getFullYear() > date2.getFullYear()) {
                return 1;
            } else if (date1.getFullYear() < date2.getFullYear()) {
                return -1;
            } else {
                return date1.getMonth() - date2.getMonth();
            }
        },

        //是否本月
        isCurrentMonth: function (date) {
            var now = new Date();
            return date.getMonth() == now.getMonth() && date.getFullYear() == now.getFullYear();
        },

        /**根据日期获得日期区域的html内容*/
        getCalendarHTML:function(date){
            var days = M139.Date.getDaysOfMonth(date);
            var firstMonthDay = M139.Date.getFirstWeekDayOfMonth(date);
            var htmlCode = [];
            var cellsCount = days + firstMonthDay ;

            //是否禁选过去时间
            var stopPassDate = this.stopPassDate;
            var passMonth = this.compareMonth(new Date(),date);
            var today = new Date().getDate();

            htmlCode.push("<tr>");
 
            for(var i=1,j=1;i<=cellsCount;i++,j++){
                if(i>firstMonthDay && j<=days){
                    htmlCode.push("<td rel='" + j + "' " + getColor(j) + ">" + j + "</td>");
                }else{
                    htmlCode.push("<td></td>");
                    j--;
                }
                if(i%7 == 0 || i==cellsCount){
                    htmlCode.push("</tr>");
                }
            }
            function getColor(date) {
                if (!stopPassDate) return "";
                var disableColor = 'style="color:silver;"';
                if (passMonth > 0) {
                    return disableColor;
                } else if (passMonth < 0) {
                    return "";
                }else{
                    return date < today ? disableColor : "";
                }
            }
            return htmlCode.join("");
        }
    }
    ));

    jQuery.extend(M2012.UI.Picker.Calendar , {
        create : function(options){
            var calendar = new M2012.UI.Picker.Calendar(options);
            return calendar;
        }
    });

})(jQuery, _, M139);
// HTML5 placeholder plugin version 1.01
// Copyright (c) 2010-The End of Time, Mike Taylor, http://miketaylr.com
// MIT Licensed: http://www.opensource.org/licenses/mit-license.php
//
// Enables cross-browser HTML5 placeholder for inputs, by first testing
// for a native implementation before building one.
//
//
// USAGE: 
//$('input[placeholder]').placeholder();

// <input type="text" placeholder="username">
(function($){
  //feature detection
  var hasPlaceholder = 'placeholder' in document.createElement('input');
  
  //sniffy sniff sniff -- just to give extra left padding for the older
  //graphics for type=email and type=url
  var isOldOpera = $.browser.opera && $.browser.version < 10.5;

  $.fn.placeholder = function(options) {
    //merge in passed in options, if any
    var options = $.extend({}, $.fn.placeholder.defaults, options),
    //cache the original 'left' value, for use by Opera later
    o_left = options.placeholderCSS.left;
  
    //first test for native placeholder support before continuing
    //feature detection inspired by ye olde jquery 1.4 hawtness, with paul irish
    return (hasPlaceholder) ? this : this.each(function() {
      //TODO: if this element already has a placeholder, exit
    
      //local vars
      var $this = $(this),
          inputVal = $.trim($this.val()),
          inputWidth = $this.width(),
          inputHeight = $this.height(),

          //grab the inputs id for the <label @for>, or make a new one from the Date
          inputId = (this.id) ? this.id : 'placeholder' + (+new Date()),
          placeholderText = $this.attr('placeholder'),
          placeholder = $('<label for='+ inputId +'>'+ placeholderText + '</label>');
        
          //stuff in some calculated values into the placeholderCSS object
          options.placeholderCSS['width'] = inputWidth;
          //options.placeholderCSS['height'] = inputHeight;

          // adjust position of placeholder 
          options.placeholderCSS.left = (isOldOpera && (this.type == 'email' || this.type == 'url')) ?
            '11%' : o_left;
          placeholder.css(options.placeholderCSS);
    
      //place the placeholder
      $this.wrap(options.inputWrapper);
      $this.attr('id', inputId).after(placeholder);
      
      //if the input isn't empty
      if (inputVal){
          placeholder.hide();
          $this.focus();
      };
    
      //hide placeholder on focus
      $this.focus(function(){
        if (!$.trim($this.val())){
          placeholder.hide();
        };
      });
    
      //show placeholder if the input is empty
      $this.blur(function(){
        if (!$.trim($this.val())){
          placeholder.show();
        };
      });
    });
  };
  
  //expose defaults
  $.fn.placeholder.defaults = {
    //you can pass in a custom wrapper
    inputWrapper: '<span style="position:relative"></span>',
  
    //more or less just emulating what webkit does here
    //tweak to your hearts content
    placeholderCSS: {
        'cursor':'text',
      'font':'12px', 
      'color':'#bababa', 
      'position': 'absolute', 
      'left':'0px',
      'top':'0px', 
      'overflow': 'hidden'
    }
  };
})(jQuery); 
﻿ (function(jQuery,_,M139){
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.Widget.VoiceInput";
    M139.namespace(namespace,superClass.extend(
    {
        initialize: function (opt) {
            $.extend(this.options, opt);
            if (this.options.autoClose == undefined) {
                this.options.autoClose = true;
            }
        },
        template:"",
        events: {},
        isSupportFlash: function () {
   
            if (navigator.plugins && navigator.plugins["Shockwave Flash"]) {
                return true;
            } else {
                try {
                    var flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");

                    return true;
                } catch (ex) {
                }
                return false;
            }
        },
        // 获取flash
        getFlashHtml: function (id, width, height, path) {
            var swfUrl = path;
            return ['<object codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0"', ' width="' + width + '" height="' + height + '" id="' + id + '" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000">', '<param name="allowScriptAccess" value="always" />', '<param name="movie" value="' + swfUrl + '" />', '<param name="quality" value="high" /><param name="allowScriptAccess" value="always" />', '<param name="wmode" value="transparent" />', ' <embed src="' + swfUrl + '" quality="high" width="' + width + '" height="' + height + '" wmode="transparent"', ' type="application/x-shockwave-flash" pluginspage="//www.macromedia.com/go/getflashplayer"', ' name="' + id + '"  >', '</embed>', '</object>'].join("");
        },
        getVoiceOption: function () {
            var result = {};
            if (this.options.grammarList) {
                result.grammarList = this.options.grammarList;
            }
            return result;
        },
        onComplete:function(args){
            var input=$(this.options.input);
            var text = decodeURIComponent(args.result).replace(/[，。！？]/ig, "");//替换标点
            if (input && input.is("input")) {
                input.val(input.val()+text);
                input.focus();
            } else {
                input.html(input.html()+text);
            }
            if (this.options.onComplete) {
                console.log("oncomplete:"+text);
                this.options.onComplete(text);
            }
            if (this.options.autoClose && text!="") {
                this.onCancel();
            }
        },
        onCancel: function (paramInstance) {
            var self = this;
      
            setTimeout(function () { //延时执行避免flash报错
                var instance = VoiceInput._instance;
                if (paramInstance && paramInstance.onCancel) {
                    instance = paramInstance;
                }
                if (instance.options.popup) {
                    instance.options.popup.close();
                }
            }, 100);

        },
        render: function () {
            var self = this;
            var html
            if (this.isSupportFlash()) {
                html = this.getFlashHtml("VoiceInput", 250, 150, "/m2012/flash/voice_input.swf?rnd="+top.sid);
            } else {
                html = "<div style=\"width:200px;height:55px;margin-top:20px;margin-bottom:20px\">您的浏览器未安装或禁用了flash插件，无法使用语音功能。</div>";
            }
            
            function createPopup() {
                for (var i = 0; i < VoiceInput._instanceList.length; i++) {
                    var instance = VoiceInput._instanceList[i];
                    if (instance != self) {
                        instance.onCancel(instance);
                    }
                }
                M139.UI.Popup.close();
                var popup = M139.UI.Popup.create({
                    target: $(self.options.button),
                    input: $(self.options.input),
                    autoHide:true,
                    content: html
                });
                self.options.popup = popup;
                popup.render();

                popup.on("close", function () {
                    //alert("close")
                });

                /*M139.Dom.bindAutoHide({
                    element: popup.contentElement,
                    callback:self.onCancel
                });*/
            }


            if (this.options.autoCreate) {
                VoiceInput.setCurrent(self);
                createPopup();
                BH("voiceinput_" + this.options.from);
            } else {
                $(this.options.button).click(function () {

                    VoiceInput.setCurrent(self);
                    createPopup();
                    BH("voiceinput_" + self.options.from);
                });
            }
           
           
        }
    }));
      
 
 })(jQuery, _, M139);
var VoiceInput={ 
    _instance: null,
    _instanceList:[],
    setCurrent: function (obj) {

        this._instance = obj;
    },
    create: function (options) { //工厂模式＋单例，创建一个popup实例
        if (!options.from) { options.from = "search" }
        this._instance = new M2012.UI.Widget.VoiceInput(options);
        this._instanceList.push(this._instance);
         this._instance.render();
         
         

         
         
         /*$GlobalEvent.on("click", function (e) {
             console.log(e.window);
             //e.event
         });*/
         return this._instance;
     },
     getVoiceOption: function () {
         return this._instance.getVoiceOption();
     },
     onComplete: function (args) {
         this._instance.onComplete(args);
     },
     onCancel: function () {
         this._instance.onCancel();
     },
     close: function (name) {
        this._instance.onCancel();
     },
     onInit: function (args) {
         
     }

 }


/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
 */
;(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.9',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
        },

        getLineHeight: function(elem) {
            return parseInt($(elem)['offsetParent' in $.fn ? 'offsetParent' : 'parent']().css('fontSize'), 10);
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));

﻿/**
* @fileOverview 会话邮件写信
* @code by SuKunWei && Yeshuo
*/
var htmlEditorView = {};
var ComposeModel;
var PageMid;

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    
         
    M139.namespace('M2012.ReadMail.ConversationBottomBar.Compose.View', superClass.extend({

        /**
         * 快捷回复提示语
         */
        tips: {
            replySuccess: '邮件回复成功',
            replyFail: '系统繁忙,请稍后重试。',
            replyContentError: '请输入要回复的内容。',
            replyMailError: '一个或多个地址错误，请编辑后再试一次。',
            replyMailNull: '收件人地址为空，请输入邮件地址后再发送。'

        },

        /**
         * 回复符号匹配
         */
        replyPrefix: {
            "1": "Re:",
            "2": ">",
            "3": "Reply:"
        },

        /**
         * 事件绑定
         */
        events: {
        
            "click a[ref=cc-edit]": "onAddCCorBCC",
            "click a[ref=bcc-edit]": "onAddCCorBCC",
            "click #subject": "onSubjectClick",
            "click #closelink": "closeReplybox",
            "click #sendbtn": "onSend",
            "click #gotoCompose": "onGotoCompose",
            "click #fontstyle": "showFontBar",
            "keyup #subject-input": "checkSubjectInputLength",
            "blur #subject-input": "onSubjectInputBlur",
            "click #to": "onAddrShowboxClick",
            "click #cc": "onAddrShowboxClick",
            "click #bcc": "onAddrShowboxClick",
            "click #replytextarea": "onReplyTextareaClick",
            "focus #replytextarea": "onReplyTextareaClick",
            'click #receiverto': 'showAddressBookDialog',
            'click #receivercc': 'showAddressBookDialog',
            'click #receiverbcc': 'showAddressBookDialog'
        },
    
        name: "M2012.ReadMail.ConversationBottomBar", 

        /**
         * 下标箭头匹配
         */
        bottombarCurPos: {
            "reply": "20px",
            "replyall": "90px",
            "forward": "155px"
        },

        /**
         * 模版定义
         */
        template:{
            replybox: (function () {
                return ['',
                        '<div class="tips cov-write" id="replybox" style="display: none; border-bottom:none;">',
                            '<a href="javascript:;" id="closelink" class="c-w-cloase" title="关闭" bh="cov_closeeidtor">×</a>',
                            '<div class="tips-text" id="tips-text" >',
                                '<div class="cov-tab-div">',
                                '<!--[if lt ie 8]><div style="+zoom:1;"><![endif]-->',
                                    '<table class="cov-write-tab">',
                                        '<tbody>',
                                            '<tr class="c-w-f">',
                                                '<td class="td1"><a href="javascript:;" class="mt_5" id="receiverto">收件人：</a></td>',
                                                '<td colspan="2">',
                                                    '<div id="to" class="th27 hide"></div>',
                                                    '<div id="to-edit" >',
                                                    '</div>',
                                                '</td>',
                                                '<td class="td2" ref="ccbcc" ><a href="javascript:;" ref="cc-edit" bh="cov_clickcclink">抄送</a> <a href="javascript:;" ref="bcc-edit" bh="cov_clickbcclink">密送</a></td>',
                                            '</tr>',
                                            '<tr style="display: none;">',
                                                '<td class="td1"><a href="javascript:;" class="mt_5" id="receivercc">抄　送：</a></td>',
                                                '<td colspan="2">',
                                                    '<div id="cc" class="th27 hide"></div>',
                                                    '<div id="cc-edit" >',
                                                    '</div>',
                                                '</td>',
                                                '<td class="td2" ref="ccbcc" ><a href="javascript:;" ref="bcc-edit" bh="cov_clickbcclink">密送</a></td>',
                                            '</tr>',
                                            '<tr style="display: none;">',
                                                '<td class="td1"><a href="javascript:;" class="mt_5" id="receiverbcc">密　送：</a></td>',
                                                '<td colspan="2">',
                                                    '<div id="bcc" class="th27 hide"></div>',
                                                    '<div id="bcc-edit" >',
                                                    '</div>',
                                                '</td>',
                                                '<td class="td2" ref="ccbcc" ><a href="javascript:;" ref="cc-edit" bh="cov_clickcclink">抄送</a><!--<a href="javascript:;" ref="bcc-edit" bh="cov_clickbcclink">密送</a>--></td>',
                                            '</tr>',
                                        '</tbody>',
                                    '</table>',
                                    '<!--[if lt ie 8]></div><![endif]-->',
                                '</div>',
                                '<div class="c-w-text" style="_zoom:1">',
                                    
                                    '<!--[if lt ie 8]><div style="+zoom:1;"><![endif]-->',
                                    '<table class="c-w-textitle" style="display:none;">',
                                        '<tbody>',
                                            '<tr>',
                                                '<td class="td1">主　题：</td>',
                                                '<td>',
                                                    '<div class="texttitle" id="subject" style="height:18px;"></div>',
                                                    '<input id="subject-input" class="iText ztinput" value="" style="display: none;"/>',
                                                '</td>',
                                            '</tr>',
                                        '</tbody>',
                                    '</table>',
                                    //附件区域
                                    '<div class="writeattrlist clearfix" style="display: none">',
                                        '<ul class="attrlistUl" id="attachContainer">',
                                        '</ul>',
                                    '</div>',
                                    '<!--[if lt ie 8]></div><![endif]-->',
                                    '<textarea id="replytextarea" style="display:none" ></textarea>',
                                    '<div id="htmlEdiorContainer"></div>',
                                '</div>',
                            '</div>',
                            '</div>',						
                        '<div class="tips tips-covfont" id="tips-covfont" style="visibility:hidden" >',
                            '<div class="tips-text clearfix">',
                            '</div>',
                            '<div class="tipsBottom diamond"></div>',
                        '</div>',
                        '<div class="cov-r-btn cov-r-border" style="display:none;">',
                            '<a href="javascript:;" id="sendbtn" class="cov-btn cov-b-b fl" style="margin-top:4px" bh="cov_clicksendmail">发 送</a>',
                            '<a title="编辑样式" id="fontstyle" href="javascript:;"  class="edit-btn" style="margin-top:5px">',
                                '<span class="edit-btn-rc"> <b class="ico-edit ico-edit-qfont">编辑样式</b>',
                                '</span>',
                            '</a>',
                            '<span class="line"></span>',
							'<a href="javascript:;"  title="添加附件" class="edit-btn" id="realUploadButton" >',
                                '<span class="edit-btn-rc"> <b class="ico-edit ico-edit-attr">附件</b>',
                                '</span>',
                            '</a>',
                            '<div class="floatWrap" >', 
								'<div id="floatDiv"  >',
									'<form style="" enctype="multipart/form-data" id="fromAttach" method="post" action="" target="frmAttachTarget">',
										'<input   style="height: 20px;" type="file" name="uploadInput" title="添加附件" id="uploadInput" multiple="true">',
									'</form>',
									'<iframe id="frmAttachTarget" style="display: none" name="frmAttachTarget"></iframe>',
								'</div>',
                            '</div>',
                            '<a title="超大附件" href="javascript:;" class="edit-btn" style="display:none" id="aLargeAttach">',
                                '<span class="edit-btn-rc"><b class="ico-edit ico-edit-cloud">云邮局</b>',
                                '</span>',
                            '</a>',
                            '<a bh="compose_editor_image" title="插入图片" href="javascript:;" class="edit-btn" id="aInsertPic"><span class="edit-btn-rc"><b class="ico-edit ico-edit-pic">图片</b></span></a>',
                            '<a id="caiyunDisk" title="彩云网盘" href="javascript:;" class="edit-btn"><span class="edit-btn-rc"><b class="i-color-cloud">彩云网盘</b></span></a>',
                            '<p class="fileLoading fl" style="display:none"><img src="/m2012/images/global/load.gif" width="16" height="16" > 图片插入中...</p>',
                            '<a href="javascript:;" id="gotoCompose" bh="cov_gotocompose" class="fr mr_10 mt_5" >切换到完整写信模式</a>',
							'<a class="fr mr_10 mt_5" style="display:none" id="gotoComposeLoading"><img src="/m2012/images/global/loading.gif">正在切换中...</a>',
                        '</div>',
                        '<p class="clearfix" style="height:5px;overflow:hidden;width:100%">&nbsp;</p>',
						'<input type="hidden" id="txtSubject" />',
					    '<div class="tips write-tips EmptyTips" style="display: none;"><div class="tips-text EmptyTipsContent">收件人输入错误</div><div class="tipsTop diamond"></div></div>'].join("")
            })()
        },        
        
        /**
         * 初始化
         */
        initialize: function(options){
            this.parentview = options.parentview;
            this.mid = PageMid = options.mid;
            this.data = options.data;
            // 绑定当前写信视图到主视图，用于在外层判断写信正文是否改变
            this.parentview['compose'+this.mid] = this;
            return superClass.prototype.initialize.apply(this, arguments);
        },

        /**
         * 定义容器
         */
        initContainer:function(){
            this.toEditBox = this.toEditBox || this.$el.find('#to-edit');
            this.ccEditBox = this.ccEditBox || this.$el.find('#cc-edit');
            this.bccEditBox = this.bccEditBox || this.$el.find('#bcc-edit');
            this.toAddrShowBox = this.toAddrShowBox || this.$el.find('#to');
            this.ccAddrShowBox = this.ccAddrShowBox || this.$el.find('#cc');
            this.bccAddrShowBox = this.bccAddrShowBox || this.$el.find('#bcc');
            this.replyContentBox = this.replyContentBox || this.$el.find('#replytextarea');
            this.subjectInput = this.subjectInput || this.$el.find('#subject-input');
            this.tipsText = this.tipsText || this.$el.find('#tips-text');
            this.covFont = this.covFont || this.$el.find('#tips-covfont');
            this.fontBtn = this.fontBtn || this.$el.find('#fontstyle');
        },
    
        /** 
         * 初始化事件 
         */        
        initEvents: function () {
            var self = this;
            var mid = this.mid;
            this.body = this.body || $('body');
            this.setBottombar();
            this.initContainer();

            //回复、全部回复、转发、标签主题
            top.$App.off("conversationCompose_" + mid);
            top.$App.on("conversationCompose_" + mid, function(args){
                $.extend(self, args);
                args && args.type && self.onBottomToolbarClick(args.type);
                if(args.type !== 'edit' &&args.type !== 'del' && args.type !== 'more' && args.type !== 'subject-focus'){
                    //self.replyContentBox.focus();
                    self.onReplyTextareaClick();                    
                }

                // 在每回复/全部回复/转发之间切换时，因为联系人发生了变化要对初始数据进行保存
                // 避免在没有修改的情况下点击关闭出现存草稿提示
                setTimeout(function(){
                    self.lastSave = self.getEditData();
                },1000)
            });

            //全局点击判断         
            this.body.click(function (e) {
                var target = e.srcElement || e.target; 
                self.hideEditBox(target);
            });

            top.$App.on("globalClick", function (e) {
                if (/conversationcompose.html/i.test(e.window.location.href)) {
                    return;
                }
                self.onAddrEditboxBlur(self.toEditBox);
                self.onAddrEditboxBlur(self.ccEditBox);
                self.onAddrEditboxBlur(self.bccEditBox);
            });
			
			//添加附件后高度自适应
			top.$App.off("conversationResize_" + mid);
			top.$App.on("conversationResize_" + mid, function(options){
				var type = options.type;
				var length = options.len;
				setTimeout(function(){
					self.onReSize();
					if(type === 'add'){
						self.parentview.scrollToPosition(27 * length);
					}
				},500)
			});

            top.$App.off('bottomComposeEditSubject');
            top.$App.on('bottomComposeEditSubject', function() {
                self.onSubjectClick();
            });
			
			//定义写信id
			this.initComposeId();

            top.$App.off('saveDraftsBeforeCloseTab');
            top.$App.on('saveDraftsBeforeCloseTab', function() {
                self.saveDraft(function() {self.removeReplybox();});
            });
        },

        /** 调整容器样式 */
        fixContainerCss: function(top){
            this.tipsText.css({ 'padding-top': top || 0 + 'px'});
        },

        /** 移除联系人输入框样式 */
        removeRichInputClass:function($el){
            this.writeTableCon = this.writeTableCon || this.body.find(".writeTable-txt");
            this.writeTableCon.removeClass("writeTable-txtOn");
        },

        /** 隐藏编辑框 */
        hideEditBox:function(target){
            var self = this;
            var domIdReg = /to|cc|bcc|sendbtn/i;
            var classReg = /writeTable-txt|addrBase|c-w-cloase|addnum/i;



            if (!$(target)[0]) { return }

            //点击显示层无效
            if (domIdReg.test($(target).attr('id')) || domIdReg.test($(target).parent().attr('id'))) {
                return;
            }
            //点击子项无效
            if ($(target).parents('#to-edit')[0] || $(target).parents('#cc-edit')[0] || $(target).parents('#bcc-edit')[0]) {
                return;
            }
            if (classReg.test($(target).attr('class')) || classReg.test($(target).parent().attr('class'))) {
                return;
            }
            if ( $(target).attr('rel') === 'addrInfo' ){
                return;
            }

            clearTimeout(self.hideTimer);

            self.hideTimer = setTimeout(function () {

                
                if(self.toEditBox.css('display') !== 'none' && self.toEditBox.parents('tr').css('display')!=='none' ){
                    if(!$(target).parents('div.RichInputBox')[0] ){
                        //self.onAddrEditboxBlur(self.toEditBox);
                        self.removeRichInputClass(self.toInputView.$el);
                    }
                }

                if(self.ccEditBox.css('display') !== 'none' && self.ccEditBox.parents('tr').css('display')!=='none' ){
                    if(!$(target).parents('div.RichInputBox')[0] ){
                        //self.onAddrEditboxBlur(self.ccEditBox);
                        self.removeRichInputClass(self.ccInputView.$el);
                    }
                }

                if(self.bccEditBox.css('display') !== 'none' && self.bccEditBox.parents('tr').css('display')!=='none' ){
                    if(!$(target).parents('div.RichInputBox')[0] ){
                        //self.onAddrEditboxBlur(self.bccEditBox);
                        self.removeRichInputClass(self.bccInputView.$el);
                    }
                } 


            },10);
        },

        /** 初始化界面 */
        setBottombar: function () {
            var self = this,
                $el = this.$el;
			$el.append(this.template.replybox); //插入节点
			
            setTimeout(function () {
                self.parentview.onResize();
            },500);
        },

        /** 重置回复框 */
        resetReplyBox:function(ref){
            
			/*this.toInputView.clear();
            this.ccInputView.clear();
            this.bccInputView.clear();
            this.editorView.editor.setHtmlContent(this.defaultFontsHtml);
			this.resetIframeHeight();
            $('#attachContainer').html('');
            uploadManager.fileList = [];*/
            var mid = this.mid;
            top.$App.off("conversationCompose_" + mid);
			top.$App.off('uploadImgStart_' + mid);
			// window.location.reload();			
        },

        /** 定义点击事件 */
        onBottomToolbarClick: function (ref) {
            var self = this,
                $el = this.$el,
                curMail = this.curMail;
         
            if (!ref) { return; }

            var from = curMail.from,
                to = curMail.dataSource.to,
                cc = curMail.dataSource.cc,
                bcc = curMail.dataSource.bcc,
                subject = curMail.dataSource.subject;

            var $subjectEdit = this.subjectEdit = this.parentview.$el.find("#edit-" + self.mid);    

            // 处理 --- “回复”，“回复全部”，“转发”
            if (this.bottombarCurPos[ref]) {

                
                self.preloadAddr = true;

                // DOM准备
                if ($el.find("#replybox").length == 0) {
                    $el.html(this.template.replybox);
                    this.initContainer();
                }

                // DOM呈现
                if ($el.find("#replybox").is(":hidden")) {
                    $el.find("#replybox").show();
                    $el.find("#sendbtn").parent().show();
                }

                // 指示当前操作
                this.parentview.$el.find("#bottombar-cur-pos").show().animate({ "left": self.bottombarCurPos[ref] }, "normal");
                
                // 首次点击底部工具条添加“编辑主题”选项，且点击一次后置灰(暂时需求干掉)
                if ($subjectEdit.length == 0 && "none" !== parent.$('#conversationcompose_' + self.mid).css("display")) {
                    var parentToolBar = this.parentview.$el.find('#bottomBar_' + self.mid);
                    parentToolBar.find("[name=more]").before('<a href="javascript:;" ref="edit" id="edit-'+self.mid+'" bh="cov_editreplysubject">编辑主题</a><em class="gray">|</em>');
                    $subjectEdit = this.subjectEdit = this.parentview.$el.find("#edit-" + self.mid);
                } else {
                    $subjectEdit.removeClass("clickFlag");
                }
            }            

            var $to = $el.find("#to"),
                $cc = $el.find("#cc"),
                $subject = $el.find("#subject"),
                $subjectInput = self.subjectInput, //$el.find("#subject-input"),
                setSubject = function (prefix) {
                    subject = prefix + subject;
                    sliceSubject = subject.length > 50 ? subject.slice(0, 50) + "..." : subject.slice(0, 50);
                    $subject.text(sliceSubject).attr("title", subject);
                    $subjectInput.closest("table").hide();
                },
                setAutoSave = function () {

                    self.subject = subject;
                    self.content = "";

                    self.setAutoSave();
                };

            switch (ref) {

                case "reply":

                    //需要初始化值
                    self.initToRichInputData(from);
                    self.initCcRichInputData();
                    self.initBccRichInputData();
                    self.onAddrEditboxBlur(self.toEditBox);
                    self.onAddrEditboxBlur(self.ccEditBox);
                    self.onAddrEditboxBlur(self.bccEditBox);
                    setSubject(this.rPrefix);
                    self.subjectInput.parents("table").show();
                    setAutoSave();
					self.setFocus();
                    break;
                case "replyall":
                    var allAddress = [];
                    var newAddress = [];
                    var toAddress;
                    var fromAddress = [from];
                    var replyallMemo = {};
                    var remail;
                    allAddress = allAddress.concat(fromAddress);
                    if(to){
                        var toAddress = to.split(",");
                        allAddress = allAddress.concat(toAddress);
                    }                    
                    //过滤重复
                    $.each(allAddress,function(i,val){
                        remail = $Email.getEmail(val);
                        if(!replyallMemo[remail]){
                            replyallMemo[remail] = 1;
                            newAddress.push(val);
                        }
                    });
                 
                    self.initToRichInputData(newAddress.join(','));
                    self.initCcRichInputData(cc);
                    self.initBccRichInputData(bcc);
                    self.onAddrEditboxBlur(self.toEditBox);
                    self.onAddrEditboxBlur(self.ccEditBox);
                    self.onAddrEditboxBlur(self.bccEditBox);
                    setSubject(this.rPrefix);
                    self.subjectInput.parents("table").show();
                    setAutoSave();
					self.setFocus();
                    break;
                case "forward":
                    self.initToRichInputData();
                    self.initCcRichInputData();
                    self.initBccRichInputData();
                    self.onAddrEditboxBlur(self.toEditBox);
                    self.onAddrEditboxBlur(self.ccEditBox);
                    self.onAddrEditboxBlur(self.bccEditBox);
                    setSubject("Fw:");
                    showEditSubjectArea();
                    self.hideAddNum();
                    setAutoSave();
                    break;
                case "edit":
                    showEditSubjectArea();
                    break;
                case "subject-focus":
                    this.$el.find("#subject").trigger('click');
                    break;
            }

            function showEditSubjectArea(){
                // if (!$subjectEdit.hasClass("clickFlag")) {
                    self.subjectInput.parents("table").show();
                    self.onSubjectClick();
                    // $subjectEdit.addClass("clickFlag");  // gray2表示点击过
                // }
            }

            // 记录上次点击的标签，防止重复点击
            if(ref !== 'edit'){
                self.curTab = ref;
            }

            self.initEditorEvent();
        },

        /** 智能联想输入组件 */
        createRichInput:function(id){
            return M2012.UI.RichInput.create({
                container: document.getElementById(id),
                maxSend: top.$User.getMaxSend(),
                type: "email",
                preventAssociate: true   //屏蔽推荐收件人
            });
        },

        /** 写信容器高度自适应 */
        onReSize:function(speed){
            var self = this,
                mid = this.mid,
				speed = speed || 200,
                fixH = 5;
            if(!self.hasfixH){                 
                self.hasfixH = true;
            }else{
                fixH = 0;
            } 

            if (typeof (clearTimeout) === "undefined") { return } //iframe移除时
            clearTimeout(self.resizeTimer);
            self.resizeTimer = setTimeout(function(){
                self.iframe = self.iframe || parent.$('#conversationcompose_' + mid);
				$(self.iframe).animate({'height':self.getBodyHeight() + fixH + 'px'},50);
			},speed);
        },

        /** 获取iframe高度 */
        getBodyHeight:function(win){
            var self = this,
                win = win || window,
                bodyH = 0,
                dbody = win.document.body;

            if(dbody && dbody.clientHeight){
                bodyH = dbody.clientHeight;                
            }else if( win.document.documentElement && win.document.documentElement.clientHeight){
                bodyH = win.document.documentElement.clientHeight;
            }

            //IE6特殊处理
            if($B.is.ie && $B.getVersion() < 7){
                bodyH = dbody.scrollHeight;
            }

            return bodyH;
        },

        /** 数据是否变动 */
        isDataChanged:function(){
            var self = this,
                data = this.getEditData(),
                lastSave = this.lastSave;
            // 如果lastSave不存在证明页面还未完成初始化（粗略判断）
            if (!lastSave) return false;

            for(var i in lastSave){
                if (data[i] != lastSave[i]) {
                    return true;
                }
            }
            return false;
        },

        /** 自动保存 */
        setAutoSave: function () {

            var self = this,
                $el = this.$el,
                mid = this.mid,
                $replybox = parent.$('#conversationcompose_' + mid);

            if (!$replybox.is(":hidden")) {
                if (this.autosaveInterval) {
                    clearInterval(this.autosaveInterval);
                }
                this.autosaveInterval = setInterval(function () {
                    if (!$replybox.is(":hidden")) {
                        self.isDataChanged() && self.saveDraft();
                    } else {
                        clearInterval(self.autosaveInterval);
                    }
                }, 60 * 1000); //1分钟存一次草稿
            }

        },

        /** 获取对应的view */
        getInputViewById:function(id){
            var map = {
                    'to':this.toInputView,
                    'cc':this.ccInputView,
                    'bcc':this.bccInputView
            };
            return map[id];
        },

        /** 获取输入框地址 */
        getInputItemAddrs:function(id){
            
            var view = this.getInputViewById(id),
                addr;
            if(view){
                addr = view.getAddrItems();
                return addr;
            }   
            return []; 
        },    

        /** 编辑框失焦点 */
        onAddrEditboxBlur: function (target) {
            this.onReSize();
            return;

            if (!target || !target.attr('id') || target.attr('id').indexOf('-') === -1) {
                return;
            }

            var self = this,
                $editbox = target,
                editboxID = $editbox.attr("id"),
                showboxID = editboxID.split("-")[0],
                $showbox = this.$el.find("#"+showboxID),

                getAddrHtml = function (showboxID) {
                    var str = "",
                        item,
                        isEmail = false,
                        getMailName = self.parentview.getMailName,
                        arr = self.getInputItemAddrs(showboxID),
                       
                        len = arr.length,
                        emailO = {},
                        splitStr,
                        email;
                     
                    for (var i = 0, len = arr.length; i < len; i++) {
                        item = arr[i];
                        email = $Email.getEmail(item);
                        if ($.trim(item) == "" || emailO[email]) {
                            arr.splice(i--, 1);
                            len--;
                            continue;
                        }
                        emailO[email] = true;
                        splitStr = i === len - 1 ? "" : "; ";
                        isEmail = $Email.isEmailAddr(item) || $Email.isEmail(item);
                        str += isEmail ? '<span>' + $T.Utils.htmlEncode(getMailName(item)) + splitStr + '</span>' : '<span class="red">' + $T.Utils.htmlEncode(getMailName(item)) + splitStr + '</span>';
                    }

                    // 保存过滤后的联系人地址，发送时用
                    self[showboxID] = arr;
                    return len == 0 ? "" : str + '<span class="other">+另外00人</span>';
                },
                clipAddrHtml = function ($cont) {

                    var width = 0,
                        cwidth = $cont.width(),
                        td2Wdith = $cont.parent().next().width(),
                        els = $cont.children(),
                        len = els.length,
                        last,
                        otherTipsWidth = 80,
                        flag,
                        text;

                    for (var i = 0; i < len - 1; i++) {
                        width += $(els[i]).width();
                        // 如果只有一个邮件地址，或者所有邮件地址加起来长度没有超过一行，直接移除最后一项【+另外几人】
                        if (len == 2 || i == len - 2 && width <= cwidth) {
                            els.last().remove();
                            last = $cont.find(":last");
                            text = last.text().replace(";", "");
                            last.text(text);
                            break;
                        }
                    }



                    // 处理换行情况
                    if (width > cwidth) {
                        width = els.last().width(); //另外的宽度+滚动条
                       
                        for (var i = 0, len = els.length; i < len - 1; i++) {
                            width += $(els[i]).width();
                            if (width > cwidth) break;
                        }

                        if( self[showboxID + '-flag']){
                            i = self[showboxID + '-flag'];  
                        }else{
                            if(showboxID == 'to'){ i-- } //特殊处理
                            self[showboxID + '-flag'] = i;
                        }
                        
                        els.filter(":gt(" + (i - 1) + ")").not(":last").hide();
                        last = els.filter(":eq(" + (i - 1) + ")");
                        text = last.text().replace(",", "");
                        last.text(text);

                        last = els.last();
                        text = last.text().replace(/\d+/, len - i - 1);
                        last.text(text);
                        if ($cont.find(".red").index() >= i) {
                            last.removeClass("other");
                            last.addClass("other-error");
                        }
                        self.onReSize();
                    }
                    
                };
            
            // 确保tr可见，以便触发渲染、计算联系人和输入框的宽度
            var addrHTML = getAddrHtml(showboxID);
            $showbox.show().closest("tr").show();
            $showbox.html(addrHTML);
            if (this[showboxID].length) {
                $editbox.hide();
                clipAddrHtml($showbox);                    
                if (showboxID == "cc") {
                    self.$el.find("a[ref=" + editboxID + "]").hide();
                }
                self.onReSize();
            } else if (showboxID == "to") {
                $showbox.hide();
                $editbox.show();
            } else {
                $showbox.hide();
                if (this.preloadAddr) {
                    $editbox.show().closest("tr").hide();
                    self.$("a[ref=" + editboxID + "]").text(showboxID == "cc" ? "抄送" : "密送").show();
                    var ccbccSelector = showboxID == "cc" ? "#bcc" : "#cc";
                    ccbccSelector = self.$(ccbccSelector).is(":hidden") ? "#to" : ccbccSelector
                    self.onReSize();
                }
            }

            if(showboxID === 'to'){
                self.fixContainerCss(0);
                self.$el.find('.EmptyTips').hide();
            }

            self.onReSize();
            
        },

        /** 联系人显示层事件 */
        onAddrShowboxClick: function (e) {
            var self = this,
                target = e.target || e.srcElement,
                $showbox = $(target).closest("div"),
                $editbox = $showbox.next("div"),
                $textarea = $editbox.find("textarea");
                $showbox.hide();
                $editbox.show();

            //编辑状态下聚焦
            var id = $showbox.attr('id'),
                view = this.getInputViewById(id);
            if(view){
                view.focus();
            }

            self.onReSize();
        },

        /** 错误提示 */
        showErrorTipsBox:function(text, callback){
            top.$Msg.alert(
                text,
                {
                    isHtml:true,
                    icon:"warn",
                    onClose:function(e){
                        callback && callback();
                    }
                }
            );
        },
		
		// 获取下载大附件的html代码
		getLargeAttachsHtml: function(callback){
			
			var self = this;
			var html = '';
			
			// 调服务端接口获取大附件的下载地址
			ComposeModel.mailFileSend(Arr_DiskAttach, function(result){
				if(result.responseData && result.responseData.code == 'S_OK'){
					var fileList = result.responseData['var']['fileList'];
    				var urlCount = 0;
                    var newArr_DiskAttach = [];
                    for(var i =0, l = Arr_DiskAttach.length; i < l; i++){
                        if(Arr_DiskAttach[i].fileType !== "netDisk"){
                            newArr_DiskAttach.push(Arr_DiskAttach[i]);
                        }
                    }
    				for(var j = 0,len = fileList.length;j < len;j++){
    					var mailFile = fileList[j];
    					for (var i = 0,diskLen = newArr_DiskAttach.length;i < diskLen; i++) {
                            var diskFile = newArr_DiskAttach[i];
                            if ((mailFile.fileId === diskFile.fileId || mailFile.fileName == diskFile.fileName) && !diskFile.getIt) {
                                diskFile.getIt = true;
                                diskFile.downloadUrl = mailFile.url;
                                diskFile.exp = mailFile.exp;
                                urlCount++;
                                break;
                            }
                        }
    				}
	                if (urlCount == newArr_DiskAttach.length) {
	                	html = getDiskLinkHtml();						
	                } else {
						top.console.log('获取大附件下载地址有误！！');
                        self.logger.error("get aLargeAttach error");
	                }
						callback && callback(html);
				}else{
					callback && callback(html);
					top.console.log('获取大附件下载地址失败！！');
                    self.logger.error("get aLargeAttach fail");
				}
			});
		},
		

        /** 发送邮件 */
        onSend: function () {
            var self = this;
            var $el = this.$el;
            var mid = this.mid;
            var content =  self.editorView.editor.getHtmlContent();  //$el.find("#replytextarea").val();
            var replyMessageData = { mid: mid };

            if(self.sendFlag){ //正在发送中
                return;
            }
            
            //判断是否收件人为空
            if (!self.toInputView.hasItem()) {
                window.scrollTo(0, 0);
                //self.fixContainerCss(15); 
                //self.toInputView.showEmptyTips("请填写收件人");
                self.showErrorTipsBox(self.tips.replyMailNull, function(){
                    self.toInputView.focus();     
                });
                return;
            }

            //错误地址判断
            var richInput = null,
                addrBox = null;
            if (self.toInputView.getErrorText()) {
                richInput = self.toInputView;
                addrBox = self.toAddrShowBox;
                //self.fixContainerCss(14);
            } else if (self.ccInputView.getErrorText()) {
                richInput = self.ccInputView;
                addrBox = self.ccAddrShowBox;
            } else if (self.bccInputView.getErrorText()) {
                richInput = self.bccInputView;
                addrBox = self.bccAddrShowBox;
            }
            if (richInput) {
                self.showErrorTipsBox(self.tips.replyMailError, function(){
                    addrBox.trigger('click');
                });
                return;
            }
			
			//省略验证邮件地址格式
            var enableQuote = this.curTab == "forward" || top.$App.getConfig("UserAttrs").replyWithQuote == 1 ? true : false; //是否引用原文
            //content = M139.Text.Utils.htmlEncode(content);
            //content = content.replace(/\r/gm, '').replace(/\n/gm, '<br>');
			
			var enableQuoteSplit = enableQuote ? "<hr id=\"replySplit\"/>" : "";

            var postData = {
                to: this.toInputView.getAddrItems().join(","),
                cc: this.ccInputView.getAddrItems().join(","),
                bcc: this.bccInputView.getAddrItems().join(","),
                mid: mid,
                content: content
            };
            var replyMessageData = {
                mid: mid
            };

			//添加超大附件链接正文内容
            /*var newArr_DiskAttach = [];
            for(var i =0, l = Arr_DiskAttach.length; i < l; i++){
                if(Arr_DiskAttach[i].fileType !== "netDisk"){
                    newArr_DiskAttach.push(Arr_DiskAttach[i]);
                }
            }
            if(newArr_DiskAttach.length == 0){
                this.model.mailInfo['content'] += getDiskLinkHtml();
            }
            if (newArr_DiskAttach.length > 0 && action == this.model.actionTypes['DELIVER']) {
                this.resolveLargeAttachs(action, callback);
            }else{
                this.callComposeApi(action, callback);
            }*/


			if (Arr_DiskAttach.length > 0) {
                var newArr_DiskAttach = [];
                for(var i =0, l = Arr_DiskAttach.length; i < l; i++){
                    if(Arr_DiskAttach[i].fileType !== "netDisk"){
                        newArr_DiskAttach.push(Arr_DiskAttach[i]);
                    }
                }

                if (newArr_DiskAttach.length == 0) {
                    content += getDiskLinkHtml() + enableQuoteSplit;
                    postData.content = content;
                    self.callReplyMessage(enableQuote, postData, replyMessageData, content);
                } else {
                    this.getLargeAttachsHtml(function(data){
                        content += data + enableQuoteSplit;
                        postData.content = content;
                        self.callReplyMessage(enableQuote, postData, replyMessageData, content);
                    }); 
                }							
		    }else{
				content += enableQuoteSplit;
				postData.content = content;
				self.callReplyMessage(enableQuote, postData, replyMessageData, content);
			}

            // this.parentview.$el.find('li[name=del]').show();
            // this.parentview.$el.find('li[name=edit]').hide();
			
        },
		
		/** 发信封装 */
		callReplyMessage:function(enableQuote, postData, replyMessageData, content){
			
			var self = this;
			var $el = this.$el;
			
			top.M139.UI.TipMessage.show("正在发送邮件...");
            self.sendFlag = true;
            this.replyMessage(postData, replyMessageData, function (sendMailRequest) {
                if(!enableQuote) {
					sendMailRequest.attrs.content = content;
                }
                sendMailRequest && self.compose(sendMailRequest, function (flag, summary) {
                    if (flag){
                        self.resetReplyBox();
                        top.M139.UI.TipMessage.show(self.tips.replySuccess, { delay: 3000 });
                        self.removeReplybox();
                    } else if (summary) {
                        top.M139.UI.TipMessage.show(summary, { delay: 3000 });
                    } else {
                        var failText = self.tips.replyFail;
                        top.M139.UI.TipMessage.show(failText, { delay: 3000 });
                    }
                    self.sendFlag = false;
                });
            });
			
		},
		

        /** 跳转异常时处理 */
        onGotoComposeFix:function(){

            var self = this; 
            var $el = this.$el;
            var mid = this.mid;
            var content =  self.editorView.editor.getHtmlContent();//$el.find("#replytextarea").val();
            var subject = $.trim(self.subjectInput.val());
            var type = this.curTab; // 'reply','replyall','forward'
            var toAll = type === 'replyall' ? 1 : 0;

            //存草稿后再打开


            //内容换行处理
            //content = content.replace(/\r\n/gm,'<br/>');
            //content = content.replace(/\n/gm,'<br/>');

            //传送到写信页的替换数据，使用后要立即清空
            var postToComposeData = {
                type: this.curTab,
                content: content,
                subject: subject,
                account: this.toInputView.getAddrItems().join(","),
                to: this.toInputView.getAddrItems().join(","), 
                cc: this.ccInputView.getAddrItems().join(","), 
                bcc: this.bccInputView.getAddrItems().join(",") 
            };

            //暂时这样实现，待回复功能优化后这块可以干掉           
            M139.PageApplication.getTopApp().sessionPostData = postToComposeData;

            if( type === 'forward'){
                top.$App.forward(mid);
            }else{
                top.$App.reply(toAll, mid, true);
            }

            //清空
            this.editorView.editor.setHtmlContent('');
			this.resetIframeHeight();
            this.removeReplybox();

        },

        /** 
         * 跳转完整写信模式 
         * 就是先存草稿再打开草稿
         */
        onGotoCompose:function(){
            var self = this;
			$('#gotoCompose').hide();
			$('#gotoComposeLoading').show();
			self.saveDraft(function(mid){
                self.resetIframeHeight();
                self.removeReplybox();
                top.$App.restoreDraft(mid);//打开草稿
            });
        },


        /** 字体样式调整层隐藏显示 */
        showFontBar:function(){
            var self = this,
                jTarget = this.fontBtn,
                bodyHeight;

            if(jTarget.hasClass("edit-btn-on")){
                jTarget.removeClass("edit-btn-on");
                self.covFont.css("visibility","hidden");
                self.covFont.next().addClass("cov-r-border");              
                setTimeout(function(){
                    self.onReSize();
                },100);    
            }else{
                jTarget.addClass("edit-btn-on");
                self.covFont.css("visibility","visible");
                self.covFont.next().removeClass("cov-r-border");
                setTimeout(function(){
                    self.onReSize();
                },200);                
                top.BH("cov_richeditor");
            }
           
        },

        /** 容器滚动条调整 */
        containerScrollTo:function(height){
            var height = height || 0;
            var bContainer = this.parentview.bContainer;
            var scrolltop = bContainer.scrollTop();
            bContainer.animate({scrollTop:(scrolltop + height)}, 300);
        },

        /** 智能输入事件绑定 */
        richInputInitEvents:function(view, target){
            var self = this;

            view && view.on("blur",function(){
                self.onReSize();
            }).on("itemchange",function(){
                self.onReSize();
            }).on("focus",function(){
                self.richInputAddClass(view);
            })

            var txtContainer = view.$el.find(".writeTable-txt");
            txtContainer.on("click",function(){
                self.richInputAddClass(view);
            });

        },

        /** 联系人输入框添加边线 */
        richInputAddClass:function(view){
            this.removeRichInputClass();
            view.$el.find(".writeTable-txt").addClass("writeTable-txtOn");
        },

     
        /** 存草稿 */
        saveDraft: function (callback) {
            var self = this;
            var $el = this.$el;
            var mid = this.mid;
            var content = self.editorView.editor.getHtmlContent();
            var replyMessageData = { mid: mid };


            //省略验证邮件地址格式
            var enableQuote = top.$App.getConfig("UserAttrs").replyWithQuote == 1 ? true : false; //是否引用原文

            if (enableQuote) {
                content += "<br/><br/><br/><br/><hr id=\"replySplit\"/>";
            }
            var postData = {
                to: this.toInputView.getAddrItems().join(","), 
                cc: this.ccInputView.getAddrItems().join(","), 
                bcc: this.bccInputView.getAddrItems().join(","), 
                mid: mid,
                content: content,
                action: "autosave"
            };
            var replyMessageData = {
                mid: mid
            };
   
            this.replyMessage(postData, replyMessageData, function (sendMailRequest) {
                if (!enableQuote) {
                    sendMailRequest.attrs.content = content;
                }
 
                sendMailRequest && self.compose(sendMailRequest, function (flag, composeMid) {
                    if (flag) {
                        var time = new Date(),
                            hour = time.getHours(),
                            minu = time.getMinutes();

                        top.M139.UI.TipMessage.show(hour + "时" + minu + "分成功保存到草稿箱", { delay: 3000 });
                        // 保存回复关键信息，用于下次自动保存判断内容是否有改动
                        self.lastSave = self.getEditData();
                        callback && callback(composeMid);
                    }else{
						//存草稿异常处理，调用fix方式（不能带附件）
						self.onGotoComposeFix();
					}
                });
            });
        },
		
		/** 
         * 获取写信相关数据Id,originalContent,messageId 
         * 由于上传附件是要绑定写信id的，所以初始化时要调用生成Id
         */
		initComposeId:function(){
			var self = this;	
			var replyMessageData = {
                mid: self.mid
            };
			top.M139.RichMail.API.call("mbox:replyMessage", replyMessageData, function (result) {

				if (result.responseData.code && result.responseData.code == 'S_OK') {
					var data = result.responseData["var"];
					window.composeId = self.composeId = data.id;
					self.originalContent = data.content || "";
					self.messageId = data.messageId;
				}else {
					top.$Msg.alert(self.tips.replyFail, {
						icon: 'fail'
					});
                    self.logger.error("conversationmail replyMessage error", "[mbox:replyMessage]", result);
                }
			});		
		},

        /** 密送、抄送 */
        onAddCCorBCC: function (e) {
            var target = e.target || e.srcElement,
                editID = $(target).attr("ref"),
                showID = editID.split("-")[0],
                $editbox = this.$el.find("#" + editID), //cc-edit,bcc-edit
                $showbox = this.$el.find("#" + showID), //cc,bcc
                cc = this.curMail.dataSource.cc,
                bcc = this.curMail.dataSource.bcc;
			
			var toTr = this.$("#to").closest("tr"),
				ccTr = this.$("#cc").closest("tr"),
				bccTr = this.$("#bcc").closest("tr"),
				toTr_ccEdit = toTr.find("a[ref=cc-edit]"),
				toTr_bccEdit = toTr.find("a[ref=bcc-edit]");
				toTr_ccEdit.hide();
				toTr_bccEdit.hide();
				
			var thisTr = $showbox.closest("tr");
            $showbox.hide(); 
            thisTr.show();//所在行显示
            $(".eidt-body").css("zoom","1"); //IE7 bug修复 
			
			this.$("a[ref=" + editID + "]").hide(); //所在行编辑隐藏
			
			if(editID === 'cc-edit'){
				bccTr.is(":hidden") && thisTr.find("a[ref='bcc-edit']").show();
			}
			
			if(editID === 'bcc-edit'){
				ccTr.is(":hidden") && thisTr.find("a[ref='cc-edit']").show();
			}
			
            this.preloadAddr = false;
            this.onReSize();
        },

        /** 创建收件人输入框智能联想 */
        initToRichInputData:function(to){
            if( !this.toInputView){
                this.toInputView = this.createRichInput('to-edit');
                this.toInputView.render();
                this.richInputInitEvents(this.toInputView, '#to-edit'); 
                this.toInputView.clear();
                to && this.toInputView.insertItem(to);
            } else {
                this.toInputView.clear();
                to && this.toInputView.insertItem(to);
            }
        },

        /** 创建抄送人输入框智能联想 */
        initCcRichInputData:function(cc){
            if( !this.ccInputView){
                this.ccInputView = this.createRichInput('cc-edit');
                this.ccInputView.render();
                this.richInputInitEvents(this.ccInputView, '#cc-edit'); 
                this.ccInputView.clear();
                cc && this.ccInputView.insertItem(cc);
            } else {
                this.ccInputView.clear();
                cc && this.ccInputView.insertItem(cc);
            }
        },

        /** 创建密送人输入框智能联想 */
        initBccRichInputData:function(bcc){
            if( !this.bccInputView){
                this.bccInputView = this.createRichInput('bcc-edit');
                this.bccInputView.render();
                this.richInputInitEvents(this.bccInputView, '#bcc-edit'); 
                bcc && this.bccInputView.insertItem(bcc);           
            } else {
                this.bccInputView.clear();
                bcc && this.bccInputView.insertItem(bcc);
            }
        },

        /** 隐藏添加提示 */
        hideAddNum:function(){
            this.$el.find('div.addnum').hide();
        },

        // 点击关闭回复框
        closeReplybox: function() {
            var self = this;
            if (self.isDataChanged()) {
                dialog = top.$Msg.confirm(
                        '关闭后，已修改的内容会保存到草稿箱，确认关闭？',
                        function () {
                            self.saveDraft(function() {self.removeReplybox();});                            
                        },
                        function () {
                            self.removeReplybox();
                        },
                        {
                            dialogTitle:'系统提示',
                            icon:"warn",
                            isHtml: true,
                            buttons: ['关闭', '关闭不保存草稿', '取消']
                        }); 
            } else {
                self.removeReplybox();
            }             
        },
        /** 关闭回复框功能 */
        removeReplybox: function () {
            var self = this;
            var parent = this.parentview.$el
            var mainbody = parent.find('div[name=covMail_mainbody][mid='+ this.mid +']');
            // mainbody.find('li[name=del]').show();
            // mainbody.find('li[name=edit]').hide();
            mainbody.find("div[name=covMail_bottom_compose]").hide();

            this.parentview.curTab = null;
            this.parentview.bottomview.curBtn = null;
            this.curTab = null;
            this.resetReplyBox();

            clearInterval(this.autosaveInterval);
            clearTimeout(this.hideTimer);            
            setTimeout(function() {                       
                mainbody.find("div[name=covMail_bottom_compose]").remove();
            }, 300);

            // 校验是否关闭当前页签
            var total = this.model.get('total');
            var composeiframes = parent.find('div[name=covMail_bottom_compose]:visible');
            if (total == 0 && composeiframes.length == 0) top.$App.close();
        },

        /** 
         * 密送、抄送隐藏逻辑
         * 收件人一直显示
         * 如果有抄送，且密送不显示，则显示'密送'
         * 如果有密送，且抄送不显示，则显示'抄送'
         */
        checkCCBCCvisibility: function () {
            var cc = this.ccInputView.getAddrItems().join(",") || this.ccInputView.getErrorText(),
                bcc = this.bccInputView.getAddrItems().join(",") || this.bccInputView.getErrorText();

            var toTr = this.$("#to").closest("tr"),
				toTr_ccEdit = toTr.find("a[ref=cc-edit]"),
				toTr_bccEdit = toTr.find("a[ref=bcc-edit]"),
				
				bccTr = this.$("#bcc").closest("tr"),
				bccTr_ccEdit = bccTr.find("a[ref=cc-edit]"),
				
				ccTr = this.$("#cc").closest("tr"),
				ccTr_bccEdit = ccTr.find("a[ref=bcc-edit]");

			//先隐藏所有抄送,密送
			this.$(".td2 a").hide();
			
			//tr输出
			cc ? ccTr.show() : ccTr.hide();
            bcc ? bccTr.show() : bccTr.hide();
			
			if(cc){
				//隐藏抄送
				bccTr_ccEdit.hide(); 
				toTr_ccEdit.hide();				
            }else{
				if(bccTr.is(":hidden")){
					toTr_ccEdit.show(); //显示抄送 
                }else{
                    bccTr_ccEdit.show(); //显示抄送 
                }
			}
			
			if(bcc){
				//隐藏密送
				ccTr_bccEdit.hide(); 
				toTr_bccEdit.hide();				
            }else{
				if(ccTr.is(":hidden")){
					toTr_bccEdit.show(); //显示密送 
                }else{
                    ccTr_bccEdit.show(); //显示密送 
                }
			}
        },

        /** 标题点击 */
        onSubjectClick: function () {
            var self = this,
                $el = this.$el,
                $subject = $el.find("#subject"),
                $subjectInput = self.subjectInput,
                txt = $subject.attr("title"),
                $table = $subjectInput.parents("table"),
                inputwidth = $table.width() - 80;
            $subjectInput.parents("table").show();  
            $subject.hide();
            $subjectInput.val(txt).width(inputwidth).show();
            top.$TextUtils.textFocusEnd($subjectInput[0]);
            this.subjectLimitNum = Math.floor(inputwidth / 7) + 100;
            this.checkCCBCCvisibility();
            this.onReSize();
   
            setTimeout(function(){
                self.onReSize();
            },100)

        },

        /** 内容点击 */
        onReplyTextareaClick: function () {
            var self = this;
            setTimeout(function(){
                self.checkCCBCCvisibility();
                self.onReSize();
            },100);
        },

        /** 标题字数限制 */
        checkSubjectInputLength: function (e) {
            var $subjectInput = this.subjectInput,
                txt = $subjectInput.val();
            if ($.trim(txt).length > 200) {
                txt = $.trim(txt).slice(0, 200);
                $subjectInput.val(txt);
            }
        },

        /** 标题blur */
        onSubjectInputBlur: function () {
            var $el = this.$el,
                txt = this.subjectInput.val(),
                txt = $.trim(txt),
                subject = top.$TextUtils.getTextOverFlow2(txt, this.subjectLimitNum, true);
            $el.find("#subject").attr("title", txt).text(subject).show();
            this.subjectInput.hide();
            this.subject = txt;
        },

        /** 获取内容 */
        monitorContentTextarea: function () {
            var txt = self.editorView.editor.getHtmlContent();
            this.content = $.trim(txt);
        },

        /**
         * 快捷回复信件
         * @param {Object} options 初始化参数集
         */
        compose: function (options, callback) {
            var self = this;
            top.M139.RichMail.API.call("mbox:compose&comefrom=5&categroyId=103000000", options, function (result) {
                if (result.responseData.code && result.responseData.code == 'S_OK') {
                    callback && callback(true, result.responseData['var']);
                } else if (result.responseData.summary) {
                    callback && callback(false, result.responseData.summary);
                    self.logger.error("conversationmail compose error", "[mbox:compose]", result);
                } else {
                    //callback && callback();
                }
            });
        },
		
		/**
		 * 回复框正文高度还原
		 */
		resetIframeHeight:function(){
			var iframe = this.editorView.editor.frame;
			$(iframe).height(125);
			$(iframe.parentNode.parentNode).height(125);
		},

        /**
         * 回复框正文高度自适应
         */
        onReplyBoxAutoHeight:function(options){
            var self = this;
            clearTimeout(this.replyBoxAtuoHeightTimer);
			var speed = 100;
            this.replyBoxAtuoHeightTimer = setTimeout(function(){
                
                var iframe = options.frame,
				    doc = iframe.contentWindow.document,
                    editorBody = doc.body,
                    editorHeight = self.getBodyHeight(iframe.contentWindow), //$(editorBody).height();
                    editorMaxheight = self.getEditorMaxHeight();
				
                if( editorHeight <= 125 ){
                    editorHeight = 125;
					speed = 200;
                }
                
				if( editorHeight > editorMaxheight){
					editorHeight = editorMaxheight;
					doc.getElementsByTagName("html")[0].style.overflow = "auto";
					editorBody.style.overflow = "hidden";
				}else{
					doc.getElementsByTagName("html")[0].style.overflow = "hidden";
					editorBody.style.overflow = "hidden";
				}
				
                //iframe.style.height = editorHeight + 'px';
                //iframe.parentNode.parentNode.style.height = editorHeight + 'px';

                //IE6处理
                if( $B.is.ie && $B.getVersion() < 7){
                    editorBody.style.height = editorHeight + 'px';//IE6 
                    editorBody.style.overflowY = 'scroll';                     
                }

                $(iframe).animate({'height':editorHeight + 'px'},speed);
				$(iframe.parentNode.parentNode).animate({'height':editorHeight + 'px'},speed);				
				setTimeout(function(){
					self.onReSize(1);				
				},speed)

            },200);    

        },

        /** 
        * 初始化写信编辑器
        */
        initEditorEvent:function(){

            var self = this,
                editorView;
		
            if(self.editorView){
                return;
            }
			
            editorView = htmlEditorView.editorView = self.editorView = M2012.UI.HTMLEditor.create({

                combineButton: [
                    "FontFamily",
                    "FontSize",
                    "Bold",
                    "Italic",
                    "UnderLine",
                    "FontColor",
                    "BackgroundColor",
                    "SetBackgroundColor",
                    "UnorderedList",
                    "OrderedList",
                    "AlignLeft",
                    "AlignCenter",
                    "AlignRight",
                    "Outdent",
                    "Indent",
                    "RowSpace"
                ],            
                contaier:$("#htmlEdiorContainer"),
                blankUrl:"../html/coveditor_blank.htm?sid="+top.sid,
                isShowSetDefaultFont:true,
                placeHolder: " ",
                uploadForm:{
                    getUploadUrl: function(callback){

						ComposeModel.requestComposeId(function(){
                            var url = utool.getControlUploadUrl(true);
                            setTimeout(function(){
                                callback(url);
                            },0);
                        });
                    },
                    fieldName: "uploadInput",
                    getResponseUrl: function(responseText){
                        var imageUrl = '';
                        var returnObj = ComposeModel.getReturnObj(responseText);
                        returnObj.insertImage = true;
                        upload_module.model.composeAttachs.push(returnObj);
                        uploadManager.refresh();
                        
                        if(returnObj){
                            imageUrl = ComposeModel.getAttachUrl(returnObj.fileId, returnObj.fileName, false);
                        }
                        return imageUrl;
                    }
                }
            });
        
            editorView.on("buttonclick",function(e){
				
				if(/FontFamily|FontSize/.test(e.command)){
					self.initFontScrollEvent(e.command);
				}
            });

            
			var commands = ["keyup","keydown","paste","afterexeccommand"];
            
			$.each(commands,function(i,val){
                editorView.editor.on(val, function () {
                    self.onReplyBoxAutoHeight(editorView.editor);
                    // self.memoTimeHandler();
                });
            });

            editorView.editor.on("focus", function () {
                self.onReplyTextareaClick();
            });

            editorView.editor.on("paste", function (e) {
			    if(self.isRight){
                    paste(e); //右键粘贴
                }
            });
			
			//默认聚焦
			editorView.editor.on("ready", function(e){
				self.setFocus();
			});					

            editorView.editor.on("mousedown", function (e) {
                if($B.is.ie){
                    var ele = e.target;
                    self.ieImgel = null;
                    self.ieTableEl = null;
                    if(ele.tagName == 'IMG'){
                        self.ieImgel = $(ele);
                    }else if(ele.tagName == 'TABLE'){
                        self.ieTableEl = $(ele);
                    }
                }
                if(e.button == 2){ //右键
                    self.isRight = true;
                }else{
                    self.isRight = false;
                }
            });

            editorView.editor.on("keydown", function (e) {
                if (e.ctrlKey && e.keyCode == M139.Event.KEYCODE.V) {
                    paste(e);
                }else if(e.keyCode == M139.Event.KEYCODE.BACKSPACE){ //ie浏览器选中图片时，按退格会退出到登录页，但实际是想删除图片
                    if(self.ieImgel){
                        self.ieImgel.remove();
                        self.ieImgel = null;
                        $(editorView.editor.frame.contentWindow.document.body).find('#divImgEditorMenuBar').remove();
                        return false;
                    }
                    if(self.ieTableEl){
                        self.ieTableEl.remove();
                        self.ieTableEl = null;
                        return false;
                    }
                }
            });

            function paste(e) {
                self.editorView.editor.markFont();
                try {
                    e.returnValue = window.captureClipboard();
                    if(e.returnValue === false){
                        top.$Event.stopEvent(e);
                    }

                    setTimeout(function(){
                        self.editorView.editor.resetTextSizeForIe();
                    }, 50);
                } catch (e) {
                }
            }

			//默认字体设置
			var defaultFontsHtml = self.defaultFontsHtml = this.getDefaultFonts(editorView.editor) || '';
            editorView.editor.setHtmlContent(defaultFontsHtml);
			//行为统计
            this.replaceFontButtonBh();   
            //初始化存草稿数据
            setTimeout(function(){
                self.lastSave = self.getEditData();
            },1000)

            //插入图片后
            editorView.editor.on("insertImage", function (e) {
                self.hideUploadImgStatus();
				resizeHeight();
				setTimeout(function(){
					resizeHeight();
				},2000)
			});
			
			function resizeHeight(){
			    self.onReplyBoxAutoHeight(editorView.editor); 
                self.onReSize();
			}
			
            //上传图片监听
            if(window.conversationPage && window.PageMid){
				top.$App.off('uploadImgStart_' + window.PageMid);
                top.$App.on('uploadImgStart_' + window.PageMid,function(){
                    self.showUploadImgStatus(window);
                });
            }

        },

        /** 显示上传图片过程 */
        showUploadImgStatus:function(win){
            var self = this;
            self.uploadImgStautsCon = self.uploadImgStautsCon || $("p.fileLoading");
            self.uploadImgLoading = win.setTimeout(function(){
                self.uploadImgStautsCon.show();
                $("div.picpop").hide();
            },3000)
        },

        /** 隐藏上传图片过程 */
        hideUploadImgStatus:function(){
            var self = this;
            self.uploadImgStautsCon = self.uploadImgStautsCon || $("p.fileLoading");
            clearTimeout(self.uploadImgLoading);
            self.uploadImgStautsCon.hide();
        },

        /** 获取编辑数据 todo附件数据还未添加 */
        getEditData:function(){
            var self = this;
            return {
                to: self.toInputView.getAddrItems().join(","),
                cc: self.ccInputView.getAddrItems().join(","),
                bcc: self.bccInputView.getAddrItems().join(","),
                content: self.editorView.editor.getHtmlContent(),
                subject: $.trim(self.subjectInput.val()),
                attachs: self.$el.find("#attachContainer li").length
            }
        },

		/** 编辑器聚焦 */
		setFocus:function(){
			var self = this;
			var mid = this.mid;
            if(this.editorView && this.editorView.editor && this.editorView.editor.editorWindow){
				setTimeout(function(){
					self.editorView.editor.editorWindow.focus();
					// self.parentview.scrollToEditorPos(mid, self.getEditorMaxHeight());
				},1000)
			}
		},
		
		/** 调整编辑器高度 */
		getEditorMaxHeight: function(){
            //var attachHeight = $('#attachContainer').height();
            var attachHeight = 0;
			return top.$App.getBodyHeight() + attachHeight - 290;
		},
		

		/** 定义字体滚动区域事件 */
		initFontScrollEvent:function(command){
		
			if(command === 'FontSize' && !this.FontSizeContainer){
				this.FontSizeContainer = $('div.FontSizeList');
                this.FontSizeContainer.mousewheel(function(event, delta) {
					_scrollTop($(this), event, delta);			
				});
			}
			
			if(command === 'FontFamily' && !this.FontFamilyListContainer){
				this.FontFamilyListContainer = $('div.FontFamilyList');
				this.FontFamilyListContainer.mousewheel(function(event, delta) {
					_scrollTop($(this), event, delta);
                });
			}
			
			function _scrollTop(container, event, delta){
				var _top = container.scrollTop();
				if( delta > 0){
					container.scrollTop(_top - 100);
				}else{
					container.scrollTop(_top + 100);
				}
				event.stopPropagation();
				event.preventDefault();
			}
			
		},
		
		/** 默认字体设置 */
		getDefaultFonts:function(editor){
			
			if(!editor){ return ""}
			var self = this;
			var doc = document;
			var newLineDiv = doc.createElement("div");
			var temp = '<div style="font-family: {fontFamily}; font-size: {fontSize}; color: {color}; line-height: {lineHeight};"><br><br><br><br><br><br></div>';
			var fonts = top.$User.getDefaultFont();
			var formatObj = {
			   fontFamily : fonts.family,
			   fontSize : editor.getPxSize(fonts.size),
			   color : fonts.color,
			   lineHeight : fonts.lineHeight
			};
			var html = top.$T.Utils.format(temp, formatObj);
			return html;			
		},

        /** 滚动条位置调整 */		
        memoTimeHandler:function(){
            var self = this;
			var mid = this.mid;
			
            clearTimeout(self.memoTimer);
            self.memoTimer = setTimeout(function(){
				self.parentview.scrollToEditorPos(mid, self.getEditorMaxHeight());
            },500)
        },

        /**
         * 替换行为统计
         */
        replaceFontButtonBh:function(){
            var bh = ["cov_fontbold", "cov_fontitalic", "cov_fontunderline", "cov_fontfamily", "cov_fontsize", "cov_fontcolour", "cov_fontbackground", "cov_fontitemstyle", "cov_fontnumberstyle", "cov_fontalignleft", "cov_fontaligncenter", "cov_fontalignright", "cov_fontreducetab", "cov_fontaddtab", "cov_fontlineheight" ];
            var buttons = $("#tips-covfont a");
            $.each(buttons,function(i,val){
                $(this).attr('bh',bh[i]);
            });
        },

        /**
         * 快捷回复信件数据组装
         * @param {Object} postData 传递参数
         * @param {Object} replyMessageData 传递参数
         * @param {function} callback 回调函数 
         */
        replyMessage: function (postData, replyMessageData, callback) {
            var self = this,
                thiscallback = callback,
				//add by zsx 代收邮箱快捷回复的时候，取当前代收账户作为默认值
                defaultSender = top.$User.getDefaultSender(),
                mid = this.mid,
                emptySubject = defaultSender + '的来信',
                subject = $.trim(self.$el.find("#subject").attr("title")) || emptySubject,
                thisone,
                fid = parseInt(this.dataSource.fid);
                
            if (subject.length == 0) {
                subject = this.curTab == "forward" ? "Fw:" + this.originalSubject : this.rPrefix + this.originalSubject;
            }

                
            if (fid && top.$App.getFolderType(fid) == -3) {
                thisone = top.$App.getFolderById(fid).email;
                var poplist = top.$App.getPopList();
                var list = [];
                for (var i = 0; i < poplist.length; i++) {
                    list.push(poplist[i]["email"]);
                }
                if ($.inArray(thisone, list) > -1) {
                    defaultSender = thisone;
                }
            }
            //add by zsx如果是其他文件夹移动过来的邮件，快捷回复的时候，回复人要回复为默认值
            var findEmail = (function () {
                var toDiv = postData.to.split(",");
                var toList = [];
                for (var i = 0; i < toDiv.length; i++) {
                    toList.push(top.$Email.getEmail(toDiv[i]));
                }
                var poplist = top.$App.getPopList();
                var popArray = $.map(poplist, function (n) {
                    return n.email;
                });
                for (var j = 0; j < toList.length; j++) {
                    if ($.inArray(toList[j], popArray) > -1) {
                        return toList[j];
                    }
                }
                return "";
            })();
            if (findEmail == "") {
                defaultSender = top.$User.getDefaultSender();
            } else {
                defaultSender = findEmail;
            }
			
			var sendMailRequest = {
                    attrs: {
                        account: defaultSender,
                        to: postData.to,
                        cc: postData.cc || "",
                        bcc: postData.bcc || "",
                        showOneRcpt: 0,
                        isHtml: 1,
                        subject: subject,
                        content: '',
                        priority: 3,
                        requestReadReceipt: 0,
                        saveSentCopy: 1,
                        inlineResources: 1,
                        scheduleDate: 0,
                        normalizeRfc822: 0,
                        id: self.composeId,
                        attachments: self.curTab == "forward" && self.attachments ? self.attachments : ""
                    },
                    action: postData.action || "deliver",
                    returnInfo: 1
                };
			
            if (self.composeId) {
				if(self.messageId) {
                    sendMailRequest.attrs.messageId = self.messageId;
                }
				sendMailRequest.attrs.content = postData.content + '<div id="reply139content" style="display: block;">' + (self.curTab == "forward" ? self.originalContent : self.rQuote == 1 ? self.originalContent : "") +'</div>'
                thiscallback && thiscallback(sendMailRequest);
            }
        },

        showAddressBookDialog: function(e) {
            var self = this;
            var target = e.target;
            var id = target.id;
            var inputViewId = id.slice('receiver'.length);
            var inputView = this.getInputViewById(inputViewId);
            var items = inputView.getValidationItems();
            var view = top.M2012.UI.Dialog.AddressBook.create({
                filter:"email",
                items:items,
                comefrom:"compose_addrinput"
            });
            view.on("select",function(e){
                // var richInputManager = self.model.addrInputManager;
                // richInputManager.addMailToCurrentRichInput(e.value.join(";")).focus();
                inputView.insertItem(e.value.join(";"));
            });
            view.on("cancel",function(){
                //alert("取消了");
            });
        }
    }));


    //初始化
    $(function(){
        
        //获取参数
        var match = location.href.match(/mid=([^&]+)/),
            mid,
            options,
            dataSource,
            container,
            el,
            parentview; //会话邮件的主view

        if(match && match[1]){
            mid = match[1];
            
            if(!mid){ return }
            options = top.M139.PageApplication.getTopApp().sessionCompose[mid];
            
            if(!options){ return }
          
            new M2012.ReadMail.ConversationBottomBar.Compose.View({
                el:$('body'),
                parentview:options.parentview,
                mid:mid,
                data:options.data
            }).initEvents();

            M139.core.utilCreateScriptTag(
            {
                id: "conversationrichupload",
                src: "conversationrichupload.html.pack.js",
                charset: "utf-8"
            },
            function () {
                $('#realUploadButton').click(function(){
                    $('#uploadInput').trigger("click");
                }); 
            });

        }

    });


})(jQuery, _, M139);    


