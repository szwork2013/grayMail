﻿/**
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

﻿;(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var document = window.document;

    // 定义编辑详细菜单
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
                };
                
                return superClass.prototype.render.apply(this, arguments);
            },

            hide: function () {
                M2012.UI.PopMenu.unBindAutoHide({ action: "click", element: this.el});
                setTimeout(function(){
                    // 群邮件新增, 当隐藏列表时需将上传组件隐藏
                    // todo 可以使用更好的方式替换top.groupmailFileUpload这个全局变量??
                    top.groupmailFileUpload && top.groupmailFileUpload.isShow(false);
                },0);

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
                
				//this.$el.css("z-index", 40000);
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

    M2012.UI.HTMLEditor.View.ImageMenu = M2012.UI.HTMLEditor.View.Menu.extend({
        events: {
            "click a.LocalFile": "onLocalSelect",
            "click a.InternetFile": "onInternetClick",
            "click": "onContainerClick"
        },
        /** 插入图片菜单
        *@constructs M2012.UI.HTMLEditor.View.ImageMenu
        *@extends M2012.UI.HTMLEditor.View.Menu
        *@param {Object} options 初始化参数集
        *@example
        */
        initialize: function (options) {
            options = options || {};
            //上传本地文件需要提供表单域的配置
            var form = this.uploadForm = M2012.UI.HTMLEditor.UploadForm;
            if(form){
                this.template = M139.Text.Utils.format(this.template,{
                    //fieldName:form.fieldName
                    //cid : this.cid
                });
            }

            this.menus = {};
            this.buttons = {};
            this.fileIds = [];

            return M2012.UI.HTMLEditor.View.Menu.prototype.initialize.apply(this, arguments);
        },
        template: ['<div class="menuPop shadow picpop" style="left:120px;top:660px;z-index: 1">',
            '<a class="LocalFile" href="javascript:;" id="groupmail_localPic">本地图片',

            '</a>',
              '<a bh="group_mail_session_uploadInternetPic" class="InternetFile" href="javascript:;">网络图片</a>',
             //'<a class="NetDiskFile" href="javascript:;">从彩云选取</a>',
         '</div>'].join(""),
        onContainerClick: function (e) {
            //方式默认行为：点击空白自动关闭
            //M139.Event.stopEvent(e);
        },
        onLocalSelect: function () {
        },
        onInternetClick: function () {
            var This = this;
            if (!this.internetMenu) {
                this.internetMenu = new M2012.UI.HTMLEditor.View.InternetImageMenu();
                this.internetMenu.editorView = this.editorView;
                this.internetMenu.on("select", function (e) {
                    This.onSelect(e.url);
                });
                this.internetMenu.render();
            }

            this.internetMenu.show({
                dockElement: this.dockElement
            });
            
            this.hide();
        },

        render: function () {
            var that = this;
            this.initEvents();

            /**
            var jForm = this.$("form");
            if(this.uploadForm){
                this.$(".FloatingDiv").css("opacity", "0");
                this.uploadForm.getUploadUrl(function(url){
                    jForm.attr("action",url);
                });
            }else{
                this.$("form").hide();
            }*/
            //alert(document.getElementById(this.cid + "_localPic"));

             top.groupmailFileUpload = new FileUpload({
                    container: this.$("#groupmail_localPic").get(0),
                    //uploadType:"flash",
                    getUploadUrl: function () {
                        return that.uploadForm.getResponseUrl();
                    },
                    onselect: function () {
                        var self = this;
                        setTimeout(function () { //异步，等待onselect函数return后才能调用upload
                            self.upload();
                        }, 10);
                    },
                    oncomplete: function (fileInfo, response) {
                        var res = "", result;
                        try {
                            res = JSON.parse(response);
                        }catch(e) {
                            if (!res) {
                                try {
                                    // 某些IE下不支持JSON.parse
                                    res = eval("("+response+")");
                                } catch (e) {
                                    console.warn && console.warn("-------------parse exception-----------");
                                }
                            }
                        }

                        if (res["code"] === "FS_UNKNOWN") {
                            console.warn && console.warn("upload's response is exception!!!");
                            return;
                        }
                        // 正确返回时的结果
                        result = res["var"];
                        if (result && result.downloadUrl) {
                            that.onSelect(result.downloadUrl + "&fileId=" + result.fileId);
                            //that.editorView.editor.insertHTML("<img src='" + result.downloadUrl + "' data-fileId=" + result.fileId + ">");
                        }
                    },
                    logKey : "group_mail_session_uploadLocalPic"
                });
            return M2012.UI.HTMLEditor.View.Menu.prototype.render.apply(this, arguments);
        },
        initEvents:function(){
            var This = this;
            this.$("input").change(function () {
                if (!this.value) {
                    return;
                }
                var extName = M139.Text.Url.getFileExtName(this.value);
                if ($.inArray(extName,["jpg", "jpeg", "gif", "bmp", "png"]) == -1) {
                    $Msg.alert("只允许插入jpg,jpeg,gif,bmp,png格式的图片", {
                        icon:"warn"
                    });
					try{
                    	form.reset();
                    }catch(e){}
					return;
                }
				
				if(window.conversationPage && window.PageMid){
					top.$App.trigger('uploadImgStart_' + window.PageMid,{});				
				}
				
                var form = this.form;
                var jFrame = This.getHideFrame();
                try{
                    form.submit();
                    form.reset();
                }catch(e){
                    jFrame.attr("src", "/m2012/html/blank.html").load(function () {
                        jFrame.unbind("load",arguments.callee);
                        form.submit();
                        form.reset();
                    });
                }
            }).click(function () {
                BH("compose_editor_image_local");
            });
        },
        onUploadFrameLoad: function (frame) {
            try{
                var doc = frame.contentWindow.document;
                var html = doc.body.innerHTML || doc.documentElement.innerHTML;
                //uploadForm外部调用的时候传入的对象（写信页代码）
                var url = this.uploadForm.getResponseUrl(html);
                if(url){
                    this.onSelect(url);
                }
            }catch(e){}
        },
        getHideFrame:function(){
            var This = this;
            var jFrame = this.$("#_hideFrame_");
            if(jFrame.length == 0){
                jFrame = $('<iframe name="_hideFrame_" style="display:none"></iframe>').appendTo(document.body).load(function(){
                    This.onUploadFrameLoad(this);
                });
            }
            return jFrame;
        },
        onSelect: function (url) {
            this.hide();
            this.trigger("select", {
                url: url
            });
        }
    });

    M2012.UI.HTMLEditor.View.InternetImageMenu = M2012.UI.HTMLEditor.View.Menu.extend({
        events: {
            "click a.YesButton": "onYesClick",
            "click .CloseButton": "onCloseClick"
        },
        initialize: function (options) {
            return M2012.UI.HTMLEditor.View.Menu.prototype.initialize.apply(this, arguments);
        },
        template: ['<div class="tips delmailTips netpictips">',
             '<a class="delmailTipsClose CloseButton" href="javascript:;"><i class="i_u_close"></i></a>',
             '<div class="tips-text">',
                 '<div class="netpictipsdiv">',
                     '<p>插入网络照片</p>',
                     '<p>',
                         '<input type="text" class="iText" value="http://">',
                     '</p>',
                     '<p class="ErrorTip" style="color:red;display:none">图片地址格式错误</p>',
                     '<p style="color:#666">右键点击所选图片，进入“属性”对话框，即可获取图片地址</p>',
                 '</div>',
                 '<div class="delmailTipsBtn"><a href="javascript:void(0)" class="btnNormal vm YesButton"><span>确 定</span></a></div>',
             '</div>',
             '<div class="tipsTop diamond covtop"></div>',
         '</div>'].join(""),

        onCloseClick: function (e) {
            this.hide();
        },
        onYesClick: function (e) {
            var url = this.$("input:text").val().trim();
            if (!M139.Text.Url.isUrl(url)) {
                this.$(".ErrorTip").show();
                return;
            } else {
                this.$(".ErrorTip").hide();
            }

            this.hide();
            this.trigger("select", {
                url: url
            });
            return false;
        },
        show: function () {
            var input = this.$("input").val("http://");
            setTimeout(function(){
                input.select();
            },0);
            return M2012.UI.HTMLEditor.View.Menu.prototype.show.apply(this, arguments);
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

/**
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
                    //this.registerButton(btn, true);
                }
            }
            //注册非常用按钮（第二排）
            var buttons_More = this.options.buttons_More;
            if (buttons_More) {
                for (var i = 0; i < buttons_More.length; i++) {
                    var btn = buttons_More[i];
                    //this.registerButton(btn);
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
                        // 注释掉该方法, 群邮件新增
                        //This.showPlaceHolder();
                    });
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
            //this.showPlaceHolder();
            el.show();
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
            //console.log("text: " + text + "---!!text: " + !!text.trim());
            if (!text.trim()) {
                el.show();
            } else {
                el.hide();
            }
        },
        /**
         * 是否显示占位提示
         * @param flag
         */
        isShowPlaceHolder : function (flag) {
            var el = this.$el.find(".PlaceHolder");
            flag ? el.show() : el.hide();
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
			{
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
			},
			{
				name: "Face",
				menu: "Face_Menu",
				template: ['<a bh="compose_editor_face" title="插入表情" href="javascript:;" class="edit-btn" id="ED_Face">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-smile">表情</b>',
							'</span>',
							'</a>'].join("")
			},
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
				name: "Preview",
				command: "preview",
				template: ['<a bh="compose_preview" title="预览" href="javascript:;" class="edit-btn" id="ED_Preview">',
					'<span class="edit-btn-rc">',
						'<b class="ico-edit ico-edit-preview">预览</b>',
					'</span>',
					'</a>'].join("")
			}/*,
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
			},
			{
				name: "InsertText",
				command: "uploadInsertDocument",
				template: ['<a bh="compose_insert_doc" title="支持word、xls、ppt、pdf格式的文件插入到邮件正文" href="javascript:;" class="edit-btn" id="ED_Preview">',
					'<span class="edit-btn-rc">',
						'<b class="ico-edit ico-edit-text">文档</b>',
					'</span>',
					'</a>'].join("")
			}
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
			//'<div class="tips write-tips ErrorTip" style="left: 0px; top: -32px; display:none;">',
				//'<div class="tips-text ErrorTipContent" style=""></div>',
				//'<div class="tipsBottom diamond" style=""></div>',
			//'</div>',
			'<div style="width:50%;">',
				'<div class="PlaceHolder" unselectable="on" style="position: absolute;left: 6px;top: 4px;color:silver;z-index:50;font-size:16px;display:none;width:100%;"></div>',
			'</div>',
			'<div class="eidt-content" id="editContent" style="display: block; height: 130px;"><!-- eidt-body-full 展开时加上 eidt-body-->',
				//'<div class="eidt-bar">',
					//'<a bh="compose_editor_more" style="display:none;" hidefocus="1" href="javascript:;" title="更多操作" class="pushon ShowMoreMenu"></a>',
                   //// '<div class="EditorBarCommon eidt-bar-li"></div>',
					//'<div class="EditorBarMore eidt-bar-li"></div>',
				//'</div>',
				'<iframe hidefocus="1" src="{blankUrl}" frameborder="0" scroll="no" style="height:100%;border:0;width:100%;"></iframe>',
				//右下角的东东
				//'<a hidefocus="1" style="display:none" href="javascript:void(0)" class="stationery"></a>',
                //'<div class="eidt-bar">',
                    //'<div class="EditorBarCommon eidt-bar-li"></div>',
                //'</div>',
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
        *@param {Object} options.uploadForm 上传本地图片的参数集合
        *@param {Function} options.uploadForm.getUploadUrl 获取上传地址的函数
        *@param {String} options.uploadForm.fieldName 表单域input控件的name
        *@param {Function} options.uploadForm.getResponseUrl 根据返回报文读取图片url
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
            //注册本地文件上传的相关接口
            M2012.UI.HTMLEditor.UploadForm = options.uploadForm;
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
﻿/**
 * @fileOverview 定义基础邮箱写信所需公共代码
 */
 (function(jQuery,Backbone,_,M139){
    var $ = jQuery;
    M139.namespace("M2012.Compose.Model",Backbone.Model.extend({
    	defaults : {
            pageType : '',
            mid : '',
            sd : '',
            ids : '',
            isEditorPageOnload : true,
            isComposePageOnload : false,
            initDataSet : {},// 用于存储 原邮件对象 如：待回复邮件，待转发邮件等
			contIsSuc:false, //用于判断转发回复时邮件内容是否加载完成
			hasLargeAttach:false //发送文件是否有超大附件
        },
		isChrome : false,
		isFirefox : false,
		PageStateTypes : {
		    //正在初始化
		    Initializing: 1,
		    //正在上传附件
		    Uploading: 2,
		    //正在发送邮件
		    Sending: 3,
		    //正在保存附件
		    Saving: 4,
		    //普通状态
		    Common: 5,
		    //发送完成
		    Sended: 6
		},
		PageState : 1,
		autoSendMail : false,
		sid : '',
		composeId : '',
		messageId : '',
		draftId : '',
		composeAttachs : [],
		asynDeletedFile : '',
        maxUploadLargeAttach: 1,
		mailInfo : {
            id: "",
        	mid : "", //后台返回的草稿ID,成功调用存草稿方法后修改该属性
			messageId: "",
        	account: "",//发件人
	        to: "",//收件人地址‘,’号分隔
	        cc: "",//抄送人地址
	        bcc: "",//密送人地址
	        showOneRcpt: 0, //是否群发单显1 是 0否 
	        isHtml: 1,
	        subject: "",
	        content: "",
	        priority: 1, //是否重要
	        signatureId: 0,//使用签名档
	        stationeryId: 0,//使用信纸
	        saveSentCopy: 1,//发送后保存副本到发件箱
	        requestReadReceipt : 0,//是否需要已读回执
	        inlineResources: 1, //是否内联图片
	        scheduleDate: 0, //定时发信
	        normalizeRfc822: 0,
	        remoteAttachment: [],
	        attachments: [],//所有附件信息
	        headers : {}
        },
        autoSaveTimer : {
        	timer : null,
        	interval : 120,
        	subMailInfo : {
                // todo 添加 收件人
        		content : "",// 编辑器内容
        		subject : ""// 主题
        	}
        },
		pageTypes : {
            COMPOSE : 'compose',//写新邮件
            REPLY : 'reply',//回复
            REPLYALL : 'replyAll',//回复全部
            FORWARD : 'forward',//转发
            FORWARDASATTACH : 'forwardAsAttach',//作为附件转发
            FORWARDATTACHS : 'forwardAttachs',// 纯附件直接转发
            FORWARDMORE : 'forwardMore',//多封邮件作为附件转发
            DRAFT : 'draft',
            RESEND : 'resend',
            VCARD : 'vCard', //电子名片，向下迁移到自定义邮件中

            //增加一种新的通用型的，写信页去异步加载一个内容填充逻辑.js，该js内调用写信页定义
            //好的开放API来填入内容，控制邮件属性，最小侵入写信主干逻辑。
            //包.js放入推广内容区 packs/promotion//xxx_201310.pack.js，带上线月份，便于确认清理
            CUSTOM : 'customExtMail',

            UPLOAD_LARGE_ATTACH : 'uploadLargeAttach'// 显示大附件上传框
        },
        tipWords : {
        	LOADING : '加载中...',
        	SENDING : '邮件正在发送...',
        	LOAD_FAIL : '加载失败，请重试。',
        	AUTO_SAVE_SUC : '{0}点{1}分自动保存草稿成功',
        	SAVE_SUC : '{0}点{1}分成功保存到草稿箱',
        	LACK_SUBJECT : '未填写主题，确定发送吗？',
        	LACK_ATTACHMENTS : '您在邮件中提到了附件，可能忘了上传附件。确定继续发送吗？',
        	CANCEL_SEND : '关闭写信页，未保存的内容将会丢失，是否关闭？',
        	INVALID_DATE : '定时发送时间不能比当前时间早。',
        	NO_RECEIPT : '收件人格式不正确。',
        	TO_DEFAULT_TEXT : '输入对方移动手机号，就能给他发邮件',
        	UPLOAD_LARGEATTACH : '添加最大{0}G的附件和暂存柜文件',
        	SCHEDULE_MAIL : '您设置在{0}定时发送此邮件'
        },
        richInputTypes : {
        	TO : 'to',// 收件人
        	CC : 'cc',// 抄送
        	BCC : 'bcc'// 密送
        },
        actionTypes : {
        	CONTINUE : "continue",// 继续编辑 
		 	AUTOSAVE : "autosave",// 自动保存
		 	SAVE : "save",//存原稿并继续编辑
		 	DELIVER : "deliver"//立即发送邮件
        },
        systemSigns : ["Best wishes for the year to come!",
                "I hope you have a most happy and prosperous New Year.！",
                "天增岁月人增寿，春满乾坤福满门；福开新运，财源广进！",
                "恭祝您的事业蒸蒸日上，新年更有新气象！",
                "值此春回大地、万象更新之良辰，敬祝您福、禄、寿三星高照，阖府康乐，如意吉祥！ 拜新年！",
                "上联：加薪买房购小车；下联：娶妻生子成家室；横批：接财神！",
                "傲不可长，欲不可纵，乐不可极，志不可满。","宝剑锋从磨砺出，梅花香自苦寒来。",
                "博观而约取，厚积而薄发。","博学之，审问之，慎思之，明辨之，笃行之。",
                "不登高山，不知天之高也；不临深溪，不知地之厚也。","不飞则已，一飞冲天；不鸣则已,一鸣惊人。",
                "不可乘喜而轻诺，不可因醉而生嗔，不可乘快而多事，不可因倦而鲜终。","沧海横流，方显英雄本色。",
                "沉舟侧畔千帆过，病树前头万木春。","尺有所短，寸有所长。物有所不足，智有所不明。"],
        sysImgPath : ["/upload/photo/system/nopic.jpg","/upload/photo/nopic.jpg"],
        containerHeight : {// 自适应
        	emailInputBox : 32,// 地址输入框高度
        	allToOne : 0,// 单击群发单显输入框高度的浮动值
        	moreOptions : 28// 单击底部更多选项小三角后底部高度的浮动值
        },
        logger: new top.M139.Logger({name: "M2012.Compose"}),
        tabName : '', // 当前写信页签名称，用于激活写信页
        editorMinHeight : 240, // 编辑器最小高度
        handlerQueue: [],

        /** 
        *写信所需公共代码
        *@constructs M2012.Compose.Model
        *@param {Object} options 初始化参数集
        *@param {String} options.mid 可选参数，根据mid创建一个实例，即围绕这个mid进行工作 发送完邮件即结束这个mid的任务，不要重复使用这个model实例
        *@example
        */
        initialize:function(options){
        	this.initGlobalVars();
        	this.initUploadComponent();
            this.on('route', function() {
                this.routePage();
            });
        },
        // 初始化全局变量
        initGlobalVars : function(){
            var self = this;

        	var pageType = $composeApp.query.type || ($composeApp.inputData && $composeApp.inputData.type) || this.pageTypes['COMPOSE'],
            	composeType = $composeApp.query.composeType,
            	id = $composeApp.query.id,
	        	mid = $composeApp.query.mid,

	            ids = $composeApp.query.ids?$composeApp.query.ids.split(","):[]; //转发多封邮件会带多个id
	        if(pageType == this.pageTypes['COMPOSE'] && id == "2" && !top.ssoComposeHandled && composeType && mid){
		    	top.ssoComposeHandled = true; //只处理一次
		    	pageType = composeType;
		    }
		    self.sid = self.getSid();
		    self.set('pageType', pageType);
		    self.set('mid', mid);

		    self.set('ids', ids);
		    self.resourcePath = '/rm/coremail/';// todo 
		    self.PageState = this.PageStateTypes.Initializing;
			self.isChrome = $B.is.chrome;
			self.isFirefox = $B.is.firefox;
            //根据套餐显示最大上传文件大小
            if (top.SiteConfig.comboUpgrade) {
                self.maxUploadLargeAttach = Math.floor(top.$User.getCapacity("maxannexsize") / 1024) || 4;
            }
            self.tipWords['UPLOAD_LARGEATTACH'] = self.tipWords['UPLOAD_LARGEATTACH'].format(self.maxUploadLargeAttach);

            self.tabName = top.$App.getCurrentTab().name;

            var siteDomain = self.getTop().getDomain("mail").replace(location.protocol+'//','');
            var srcDomain = self.getTop().getDomain("resource").substring(13);

            self.regG2 = new RegExp('(g\d+).' + siteDomain, 'i');
            self.regApp = new RegExp('appmail[3]?.' + siteDomain, 'i');
            self.regSrc = new RegExp('image[0s]' + srcDomain, 'i');


            var TYPE = self.pageTypes;
            self.regRouter({
                matchs: [ TYPE.COMPOSE, TYPE.UPLOAD_LARGE_ATTACH ],
                onroute: function() {
                    var dataSet = self.get('initDataSet');
                    var queryObj = $composeApp.query;

                    dataSet.isShowVideoMail = Boolean(queryObj['videomail']);//视频邮件
                    dataSet.isShowTimeSet = Boolean(queryObj['timeset']) || $composeApp.inputData?$composeApp.inputData.timeset:'';//定时邮件
                    dataSet.scheduleDate = queryObj['timeset'] || $composeApp.inputData?$composeApp.inputData.timeset:'';//时间
                    dataSet.isShowSelectBox = Boolean(queryObj['showSelectBox']);//超大附件
                    dataSet.account = queryObj['userAccount'] || $composeApp.inputData?$composeApp.inputData.userAccount:'';//发信账号
                    dataSet.to = queryObj['receiver'] || $composeApp.inputData?$composeApp.inputData.receiver:'';//收件人 
                    dataSet.subject = queryObj['subject'] || $composeApp.inputData?$composeApp.inputData.subject:'';//主题
                    dataSet.content = queryObj['content'] || $composeApp.inputData?$composeApp.inputData.content:'';//正文
                    dataSet.template = queryObj['template'] || $composeApp.inputData?$composeApp.inputData.template:'';//邮件模板
                    dataSet.letterPaperId = queryObj['letterPaperId'] || $composeApp.inputData?$composeApp.inputData.letterPaperId:'';//信纸ID
                    dataSet.saveSentCopy = 1; // 保存到收件箱

                    self.set('isComposePageOnload', true);
                }
            });
        },

        /**
        * 注册页面路由，注意撰写邮件只会在一种状态下完成，
        * 所以没有多路由，而是提前分拣出唯一的处理状态。
        * 但单个状态，可以有个onroute函数队列顺序触发
        */
        regRouter: function (router) {
            var self = this;
            var pageType = self.get('pageType');

            var matchs = router.matchs;
            for (var i = 0; i < matchs.length; i++) {
                if (matchs[i] == pageType) {
                    self.handlerQueue.push(router.onroute);
                }
            }
        },

        routePage: function() {
            var self = this;
            var pageType = self.get('pageType');
            var handlerQueue = self.handlerQueue;
            for (var i = 0; i < handlerQueue.length; i++) {
                handlerQueue[i]({ pageType: pageType }, self);
                self.set('isComposePageOnload', true);
            }
        },

        // 初始化上传附件
        initUploadComponent : function(){
        	//初始化上传模块 upload_module.js
            upload_module.init(this); 
            //创建上传管理器 
            upload_module.createUploadManager();
        },

        callApi: M139.RichMail.API.call,
        /**
         * 根据回复类型 获取邮件信息
         * @param applyType 回复类型
         */
        replyMessage : function(replyType, callback){
        	if(typeof replyType !== 'string'){
        		console.log('replyMessage:回复类型请传递字符串!');
        		return;
        	}
    		var data = {
    			toAll : replyType === this.pageTypes['REPLYALL'] ? "1" : "0",
    			mid : this.get('mid'),
    			withAttachments : $T.Url.queryString("withAttach") == "true"? "1" : "0"
    		}
    		this.callApi("mbox:replyMessage", data, function(res) {
    			if(callback){
    				callback(res);
    			}
	        });
        },
        /**
         * 根据转发类型 获取邮件信息
         * @param applyType 转发类型
         */
        forwardMessage : function(pageType, callback){
        	if(typeof pageType !== 'string'){
        		console.log('forwardMessage:转发类型请传递字符串!');
        		return;
        	}
    		var data = this.getRequestDataForForward(pageType);
    		this.callApi("mbox:forwardMessages", data, function(res) {
    			if(callback){
    				callback(res);
    			}
	        });
        },
        forwardAttachs: function (pageType, callback) {
            if (typeof pageType !== 'string') {
                console.log('forwardMessage:转发类型请传递字符串!');
                return;
            }
            var data = top.FORWARDATTACHS;
            top.FORWARDATTACHS = null;
            this.callApi("mbox:forwardAttachs", data, function (res) {
                if (callback) {
                    callback(res);
                }
            });
        },
        //恢复草稿
        restoreDraft : function(callback){
        	var data = {
    			mid : this.get('mid')
    		}
    		this.callApi("mbox:restoreDraft", data, function(res) {
    			if(callback){
    				callback(res);
    			}
	        });
        },
        //编辑发送中的邮件再次发送
        editMessage : function(callback){
        	var data = {
    			mid : this.get('mid')
    		}
    		this.callApi("mbox:editMessage", data, function(res) {
    			if(callback){
    				callback(res);
    			}
	        });
        },

        setSubMailInfo : function(content, subject){
        	this.autoSaveTimer['subMailInfo']['content'] = content;
        	this.autoSaveTimer['subMailInfo']['subject'] = subject;
        },
        //创建自动存草稿定时器 todo 全局变量
        createAutoSaveTimer : function(){
        	var self = this;
    		self.autoSaveTimer['timer'] = setInterval(function(){
    			var isEdited = self.compare(true);
    			if (!isEdited) {
		            return;
		        } else {
		            mainView.saveMailCallback.actionType = self.actionTypes['AUTOSAVE'];
    				self.sendOrSaveMail(self.actionTypes['AUTOSAVE'], mainView.saveMailCallback);
		        }
    		}, self.autoSaveTimer['interval'] * 1000);
       },
       // 比较是否有改动
       compare : function(isSetSubMailInfo){
       		var self = this;
       		var cloneSubMailInfo = $.extend({}, self.autoSaveTimer['subMailInfo']);
       		if(isSetSubMailInfo){
       			self.setSubMailInfo(htmlEditorView.getEditorContent(), $("#txtSubject").val());
       			content = self.autoSaveTimer['subMailInfo']['content'];
			    subject = self.autoSaveTimer['subMailInfo']['subject'];
       		}else{
       			content = htmlEditorView.getEditorContent();
				subject = $("#txtSubject").val();
       		}

			if (content === cloneSubMailInfo['content'] && subject == cloneSubMailInfo['subject']) {
				return false;// 无改动
			}else{
				return true;// 有改动
			}	
       },
       // 判断当前写信页是否为空白写信页
       isBlankCompose : function(){
       		var self = this;
   			if(self.addrInputManager.getAllEmails().length > 0 || $("#txtSubject").val() || htmlEditorView.getEditorContent() != self.defaultContent){
   				return false;
       		}else{
       			return true;
       		}
       },
       /**
         * 发送/保存 /自动保存邮件 
         */
        sendOrSaveMail: function (action, callback){
        	if(typeof action !== 'string'){
        		console.log('sendOrSaveMail:请传递字符串action！'+ action);
        		return;
        	}
        	var self = this;
        	if(action === self.actionTypes['AUTOSAVE'] || action === self.actionTypes['SAVE']){
        		clearInterval(self.autoSaveTimer['timer']);
            	self.createAutoSaveTimer();
        	}
        	mainView.buildMailInfo(action, callback);
		},
		// 回复全部操作应排除自己
		filterEmails : function (){
		    var uidList = top.$User.getUidList();
		    var popList = top.$App.getPopList();
		    var myAddrList = uidList.concat(popList);
		    var dataSet = this.get('initDataSet');
		    if(dataSet.to){
		        for(var i = 0,toLen = dataSet.to.length;i < toLen;i++){
		            for(var j = 0,myLen = myAddrList.length;j < myLen;j++){
		                if($Email.compare(dataSet.to[i], myAddrList[j])){
		                    dataSet.to.splice(i, 1);
		                    i--;
		                    break;
		                }
		            }
		        }
		    }
		    if(dataSet.cc){
		        for(var m = 0;m < dataSet.cc.length;m++){
		            for(var n = 0;n < myAddrList.length;n++){
		                if($Email.compare(dataSet.cc[m], myAddrList[n])){
		                    dataSet.cc.splice(m, 1);
		                    m--;
		                    break;
		                }
		            }
		        }
		    }
		},
		/**
		 * 获取需要发送的数据
		 * @param action    continue:  继续编辑 
		 *					autosave:  自动保存
		 *					save :     存原稿并继续编辑
		 *					deliver：   立即发送邮件
		 */
		getRequestDataForSend : function(action){
			var returnInfo = 1;
			if(action === this.actionTypes['CONTINUE']){
				returnInfo = 0;
			}
			return {
				"attrs": this.mailInfo,
				"action": action,
				"replyNotify": $("#replyNotify")[0].checked ? 1 : 0,
				"returnInfo": returnInfo
			}
		},
		/**
		 * 获取需要发送的数据 todo 收件箱转发多封邮件
		 * @param pageType  FORWARD: 转发
		 *					FORWARDASATTACH: 作为附件转发 
		 */
		getRequestDataForForward : function(pageType){
			var self = this;
			var data = {};
			if(pageType === this.pageTypes['FORWARD']){
				data.mode = 'quote';
				data.ids = [self.get('mid')];
				data.mid = self.get('mid');
			}else if(pageType === this.pageTypes['FORWARDASATTACH'] || pageType === this.pageTypes['FORWARDMORE']){
				data.mode = 'attach';
				data.ids = self.get('ids');
			}else{
				console.log('不支持的参数值：'+pageType);
			}
    		return data;
		},
		/**
		 * 根据操作类型获取提示语
		 * @param action 
		 */
		getTipwords : function(action){
			if(action === this.actionTypes['AUTOSAVE']){
				return this.tipWords['AUTO_SAVE_SUC'];
			}else if(action === this.actionTypes['SAVE']){
				return this.tipWords['SAVE_SUC'];
			}else{
				return '';
			}
		},
        /**
         * 获取签名图片列表
         * 电子名片服务器不能访问,暂时替换,等后台更改了可删除
         */
        handlerSignImags: function() {
            var letterDoc = htmlEditorView.editorView.editor.editorWindow.document;
            if (!letterDoc) return;

            var src, arrSignImg = [], imgs = letterDoc.getElementsByTagName('IMG');
            for (var i = imgs.length - 1; i >= 0; i--) {
                if ( 'signImg' == imgs[i].getAttribute('rel') ) {
                    src = imgs[i].src;
                    if (0 > src.indexOf('attach:getAttach')) {
                        src = this.replaceSignImgsSrc(src);
                        arrSignImg.push($T.Xml.encode(src));
                        imgs[i].src = src;
                    }
                }
            }

            return arrSignImg;
        },

        //电子名片服务器不能访问,暂时替换,等后台更改了可删除
        RESRCIP: "172.16.172.171:2080",
        G2DOMAIN: "$1.api.localdomain",

        replaceSignImgsSrc : function(content){
            var _this = this;
            return content.replace(_this.regApp, _this.RESRCIP).replace(_this.regSrc, _this.RESRCIP).replace(_this.regG2, _this.G2DOMAIN);
        },
        getTop: function () {
            return M139.PageApplication.getTopAppWindow();
        },
        /**
        *获取SID值
        */
        getSid: function () {
            var sid = top.$T.Url.queryString("sid");
            return sid;
        },
		// 获取写信会话ID 只需要获取一次
        requestComposeId : function(callback){
            if (!this.composeId) {
                this.composeId = Math.random().toString();
            }
		    if(callback){
		        callback();	
		    }
        },
        getAttachUrl : function(fileId, fileName, fullUrl) {
        	var sid = this.getSid();
		    var url = "/RmWeb/view.do?func=attach:getAttach&sid="+sid+"&fileId="+fileId + "&fileName=" + encodeURIComponent(fileName);
		    if(fullUrl)url = "http://" + location.host + url;
		    return url;
		},
		// 主题颜色管理器
		subjectColorManager : {
		    maps: {
		        0: { color: "#000000", title: "黑色" },
		        1: { color: "#FF0000", title: "红色" },
		        2: { color: "#FF9800", title: "橙色" },
		        3: { color: "#339A67", title: "绿色" },
		        4: { color: "#2D5AE2", title: "蓝色" },
		        5: { color: "#7F0081", title: "紫色" }
		    },
		    getColorName: function (number) {
		        var maps = this.maps;
		        var item = maps[number];
		        if (!item) item = maps[0];
		        return item.title;
		    },
		    getColor: function (number) {
		        var maps = this.maps;
		        var item = maps[number];
		        if (!item) item = maps[0];
		        return item.color;
		    },
		    getColorList: function () {
		        var maps = this.maps;
		        var result = [];
		        var i = 0;
		        while (true) {
		            if (!maps[i]) break;
		            result.push(maps[i]);
		            i++;
		        }
		        return result;
		    }
		},
		// 投递/定时 邮件操作成功后将部分邮件信息保存到顶级窗口的sendList变量中
		modifySendList : function(result){
			var self = this;
            var mid = result.responseData["var"] && result.responseData["var"]["mid"];
            var tid = result.responseData["var"] && result.responseData["var"]["tid"];
            //跳转到发送完成页
            var topArray_To = new top.Array(); //页面被销毁的时候 数组对象不可用
            var topArray_CC = new top.Array();
            var topAttay_BCC = new top.Array();
            topArray_To = topArray_To.concat($T.Email.getMailListFromString(self.mailInfo.to));
            topArray_CC = topArray_CC.concat($T.Email.getMailListFromString(self.mailInfo.cc));
            topAttay_BCC = topAttay_BCC.concat($T.Email.getMailListFromString(self.mailInfo.bcc));
            var sendMailInfo = {
                to: topArray_To,
                cc: topArray_CC,
                bcc: topAttay_BCC,
                subject: self.mailInfo.subject,
                action: 'deliver',
                saveToSendBox: self.mailInfo.saveSentCopy,
                mid: mid,
                tid: tid
            };
            if (self.mailInfo.scheduleDate) sendMailInfo.action = "schedule"; //定时邮件的action rm 兼容 cm，发信成功页使用
            top.$App.getCurrentTab().data.sendList = new top.Array();
            top.$App.getCurrentTab().data.sendList.push(sendMailInfo);
		},
		// 根据用户选择的日期返回日期提示语
		getDateTipwords : function(calendar){
			var today = $Date.format('yyyy-MM-dd', new Date());// 今天
			var tomorrow = $Date.format('yyyy-MM-dd',$Date.getDateByDays(new Date(), 1)); // 明天
			var dayAfterTomorrow = $Date.format('yyyy-MM-dd',$Date.getDateByDays(new Date(), 2));// 后天
			var thisSunday = $Date.format('yyyy-MM-dd',$Date.getWeekDateByDays(6));// 本周日
			var nextSunday = $Date.format('yyyy-MM-dd',$Date.getWeekDateByDays(13));// 下周日
			var msg = '';
			if(calendar === today){
				msg = '今天';
			}else if(calendar === tomorrow){
				msg = '明天';
			}else if(calendar === dayAfterTomorrow){
				msg = '后天';
			}else if(calendar > dayAfterTomorrow && calendar <= thisSunday){
				msg = '本周' + this._getWeek(calendar);
			}else if(calendar > thisSunday && calendar <= nextSunday){
				msg = '下周' + this._getWeek(calendar);
			}else{
				msg = calendar;
			}
			return msg;
		},
		// 获取星期几
		_getWeek : function(calendar){
			var week = $Date.getChineseWeekDay($Date.parse(calendar.trim() + ' 00:00:00'));
			return week.substr(2,1); 
		},
		// 根据用户选择的时间返回时间提示语
		getTimeTipwords : function(time){
			var tempArr = time.split(':');
			var hour = parseInt(tempArr[0].trim(), 10);
			var now = new Date();
			var hello = $Date.getHelloString(new Date(now.setHours(hour)));
			var msg = '';
			if(hour <= 12){
				msg = hello + time;
			}else{
				msg = hello + (hour - 12) + ':' + tempArr[1];
			}
			return msg;
		},
		/**
		 * 根据服务端返回的JS代码解析出文件对象
		 * @param html 调用上传接口后服务端返回的js代码
		 * return 文件对象
		 */
		getReturnObj : function(html){
			if($.type(html) !== "string"){
				return null;
			}
			var returnObj = null;
	        var reg = /'var':([\s\S]+?)\};<\/script>/i;
	        if (html.indexOf("'code':'S_OK'") > 0) {
	        	returnObj = {};
	        	var m = html.match(reg);
	            var result = eval("(" + m[1] + ")");
	            returnObj.fileId = result.fileId;
	         	returnObj.fileName = result.fileName;
	        }
	        return returnObj;
		},
		// 地址输入框管理器
		addrInputManager : {
		    /**
		     * 向地址输入框实例插入邮件地址
		     * @param richInput  RichInput实例
		     * @param items 邮件地址列表 如果传入的是字符串则转成数组
		     * @return
		     */
		    addMail: function(richInput, items) {
		   		if(!(richInput instanceof M2012.UI.RichInput.View)){
		   			console.log('请传入RichInput实例对象');
		   			return;
		   		}
		        if ($.type(items) === "string") items = [items];
		        for (var i = 0,len = items.length; i < len; i++) {
		            richInput.insertItem(items[i]);
		        }
		    },
		    removeMail: function(richInput, list) {
		        if ($.type(list) === "string") list = [list];
		        var items = richInput.getItems();
		        for (var i = 0; i < items.length; i++) {
		            var richInputItem = items[i];
		            for (var j = 0; j < list.length; j++) {
		                if (richInputItem.allText == list[j]) {
		                    richInputItem.remove();
		                    break;
		                }
		            }
		        }
		    },
		    addMailToCurrentRichInput: function(addr) {
		        if (!addrInputView.currentRichInput){
		        	addrInputView.currentRichInput = addrInputView.toRichInput;
		        }
		        addrInputView.currentRichInput.insertItem(addr);
		        return addrInputView.currentRichInput;
		    },
		    getAllEmails: function() {
		        var a1 = addrInputView.toRichInput.getValidationItems();
		        var a2 = addrInputView.ccRichInput.getValidationItems();
		        var a3 = addrInputView.bccRichInput.getValidationItems();
		        return a1.concat(a2).concat(a3);
		    }
		},
		// 获取大附件下载地址
		mailFileSend : function(files, callback){
			//过滤掉彩云网盘的文件
			files = files || [];
			var newFiles = [];
			for(var i =0, l = files.length; i < l; i++){
				if(files[i].fileType !== "netDisk"){
					newFiles.push(files[i]);
				}
			}
			var xmlStr = this.getXmlStr(newFiles);
			var data = {
        		xmlStr : xmlStr
        	}
    		this.callApi("file:mailFileSend", data, function(res) {
    			if(callback){
    				callback(res);
    			}
	        });
		},
		// 获取大附件下载地址时需拼装xml格式的请求参数
		getXmlStr : function(files){
			var requestXml = '';
		    requestXml += "<![CDATA[";
		    requestXml += '<Request>';
		    var quickItems = [];
		    var netDiskXML = "";
		    for (var i = 0; i < files.length; i++) {
		        var file = files[i];
		        if (file.fileType == "netDisk") {
		        	var tempStr = "<File><FileID>{0}</FileID><FileName>{1}</FileName><FileGUID>{2}</FileGUID><FileSize>{3}</FileSize></File>";
		        	netDiskXML += $T.Utils.format(tempStr, [file.fileId, $T.Xml.encode(file.fileName), file.fileGUID, file.fileLength]);
		        } else {
		        	quickItems.push(file.uploadId || file.fileId)
		        }
		    }
		    if(quickItems.length > 0){
		    	requestXml += "<Fileid>" + quickItems.join(",") + "</Fileid>";
		    }
		    if(netDiskXML){
		    	requestXml += "<DiskFiles>" + netDiskXML + "</DiskFiles>";
		    }
		    requestXml += '</Request>';
		    requestXml += "]]>";
		    return requestXml;
		},
		//根据coremail的错误代码返回提示语句
		getErrorMessageByCode : function (action, code, data){
		    var actionList = {
		        "attach": {
		            "FA_ATTACH_EXCEED_LIMIT": "上传失败，附件大小超出限制",
		            "FA_UPLOAD_SIZE_EXCEEDED": "上传失败，附件大小超出限制"
		        },
		        "saveMail": {
		        	"FA_ATTACH_EXCEED_LIMIT":"发送失败，附件/信件大小超过邮箱限制",
		            "FA_OVERFLOW": "附件/信件大小超出邮箱限制,无法保存草稿"
		        },
		        "sendMail": {
		        	"FA_ATTACH_EXCEED_LIMIT":"发送失败，附件/信件大小超过邮箱限制",
		            "FA_OVERFLOW": "发送失败，附件/信件大小超过邮箱限制",
		            "FA_INVALID_ACCOUNT": "发送失败，FA_INVALID_ACCOUNT(发件人数据异常)",
		            "FA_INVALID_PARAMETER": "发送失败，FA_INVALID_PARAMETER(发件人数据异常)",
		            "FA_ID_NOT_FOUND":"请勿重复发送(邮件可能已发出，但由于网络问题服务器没有反馈，请到发件箱确认)",
		            "FA_WRONG_RECEIPT":"收件人地址格式不正确，请修改后重试",
		            "FS_UNKNOWN": "发送失败，请重新发送",
		            "FA_REDUNDANT_REQUEST":"邮件正在发送中，请稍候",
		            "FA_IS_SPAM":"您的邮件发送失败，原因可能是：<br>1、  你超出了单天发送邮件封数的限制。<br>2、  你发送的邮件包含广告内容等不良信息。"
		        }
		    };
		    if(action=="sendMail" && code=="FA_INVALID_ACCOUNT" && isThirdAccountSendMail()){
		        return "第三方账号发信失败，请确认账号密码以及POP服务器地址设置正确。<a hideFocus=\"1\" href=\"javascript:top.$App.show(\"account\")\">管理账号&gt;&gt;</a>";
		    }
		    if(actionList[action] && actionList[action][code]){
		        return actionList[action][code];
		    }
		    function isThirdAccountSendMail(){
		        if(data && data.account){
                    return !top.$App.isLocalDomainAccount(data.account)
		        }
		        return false;
		    }
		    return "";
		},
		//自适应   调整编辑器高度
		adjustEditorHeight : function(height){
			var c = $("#htmlEdiorContainer div.eidt-body");
			var h = c.height() + height;
			h = parseInt(h);
			if(h < self.editorMinHeight){
				h = self.editorMinHeight;
			}
			c.height(h);
		},
		//todo 匹配通讯录联系人
		getEamils : function(str){
		    //str = str.replace(/\"/g,'');
		    if(!str){
		    	return '';
		    }
		    var arr = str.split(",");
	        var emails = [];
	        for(var i = 0, len = arr.length; i < len; i++){
	            var email = arr[i];
	            var nextemail = arr[i+1];
	            if(email && nextemail){
	                var emailObj = top.Utils.parseSingleEmail(email);
	                if(!$T.Email.isEmailAddr(emailObj.all)){
	                    arr[i] = email + " " + nextemail;
	                    arr.splice(i + 1, 1);
	                    i--;
	                }
	            }
	        }
	        for(var j = 0, l = arr.length; j < l; j++){
	            emails.push(getNameByEmail(arr[j]));
	        }
	        return emails.join(',');
		    
		    // 根据邮箱地址获取发件人姓名（查询通讯录）
		    function getNameByEmail(text){
		    	if(!text) return;
		    	if(text.indexOf('<') == 0){
		    		text = text.replace(/</,'"<').replace(/></,'>"<');
		    	}
		    	console.log(text);
			    var obj = $T.Utils.parseSingleEmail(text);
			    var prefix = obj.addr.split('@')[0];
			    var contact = top.Contacts.getSingleContactsByEmail(obj.addr);
			    if(contact){
			        var name = contact.name;
			        if(name == prefix || (contact.MobilePhone && contact.MobilePhone == name)){ //排除未完善联系人
			            return text;
			        }else{
			            return '"' + name.replace(/\"/g,'') + '"' + '<' + obj.addr + '>';
			        }
			    }else{
			        return text;
			    }
		    }
		},
		// 切换到当前写信页签
		active : function(){
			var self = this;
			var tabName = self.tabName;
			console.log(tabName);
			if(tabName && tabName.indexOf('compose') != -1){
				top.$App.activeTab(tabName);
			}
		},
		
		// 选择文件组件返回的文件列表统一数据结构
		transformFileList : function(fileList){
			if(!$.isArray(fileList)){
				return fileList;
			}
			var self = this;
			var files = [];
			for(var i = 0,len = fileList.length;i < len;i++){
				var file = fileList[i];
				files.push(self.getFileByComeFrom(file));
			}
			return files;
		},
        //在回复和转发时把fileSize改为base64后的值
		fixBase64FileSize: function () { //当回复和转发时，mbox:compose接收的attachments数组中的fileSize是base64后的值。
		    var attachs = this.composeAttachs;
		    if (attachs.length > 0) {
		        for (var i = 0; i < attachs.length; i++) {
		            if (attachs[i].base64Size) {
		                attachs[i].fileSize = attachs[i].base64Size;
		            }
		        }
		    }
		},
		
		// 根据文件来源返回调整数据结构后的文件对象，为了满足largeAttach.js中的方法 setNetLink的需求
		getFileByComeFrom : function(fileObj){
			var comeFrom = fileObj.comeFrom;
			var newfile = {};
			var behavior_flag = {local:false, disk: false, cabinet: false};
			if(comeFrom == 'localFile'){
				newfile.fileId = fileObj.businessId;
				newfile.fileName = fileObj.name;
				newfile.filePath = fileObj.name;
				newfile.fileSize = fileObj.size;
				newfile.fileType = 'keepFolder';
				newfile.name1 = fileObj.name1 || "";
				newfile.state = 'success';
				behavior_flag.local = true;
			}else if(comeFrom == 'disk'){
				newfile.fileGUID = fileObj.filerefid;
				
				newfile.fileId = fileObj.id;
				newfile.fileName = fileObj.name;
				newfile.filePath = fileObj.name;
				if(fileObj.file && fileObj.file.fileSize){
					newfile.fileSize = fileObj.file.fileSize;
				}
				if (fileObj.file && fileObj.file.presentURL) {
				    newfile.linkUrl = fileObj.file.presentURL;
				}
				newfile.fileType = 'netDisk';
				newfile.state = 'success';
				behavior_flag.disk = true;
			}else if(comeFrom == 'cabinet'){
				newfile.fileId = fileObj.fid || fileObj.fileId;
				newfile.fileName = fileObj.fileName;
				newfile.filePath = fileObj.fileName;
				newfile.fileSize = fileObj.fileSize;
				newfile.fileType = 'keepFolder';
				newfile.state = 'success';
				behavior_flag.cabinet = true;
			}else if(comeFrom == 'attach'){
				newfile.fileId = fileObj.fid || fileObj.fileId;
				newfile.fileName = fileObj.fileName;
				newfile.filePath = fileObj.fileName;
				newfile.fileSize = fileObj.fileSize;
				newfile.fileType = 'keepFolder';
				newfile.state = 'success';
				behavior_flag.cabinet = true;
			}else{
				console.log('不支持的文件来源！comeFrom:'+comeFrom);
			}
			// comeFrom信息源到此断了，在此添加行为统计(add by xiaoyu)
			behavior_flag.local && BH({key : "compose_largeattach_local"});
			behavior_flag.disk && BH({key : "compose_largeattach_disk"});
			behavior_flag.cabinet && BH({key : "compose_largeattach_cabinet"});
			return newfile;
		},
        /**
         *ie9以上支持客户端压缩报文
         */
		isSupportCompressRequest: function () {
		    if (window.FormData || ($B.is.ie && $B.getVersion() >= 9)) {
		        return true;
		    } else {
		        return false;
		    }
		},
        /**
         *加载压缩脚本的类库
         */
		loadCompressLib: function () {
		    var tag = "rawdeflateScript";
		    if (!document.getElementById(tag)) {
		        M139.core.utilCreateScriptTag({
		            id: tag,
		            src: "/m2012/js/richmail/compose/rawdeflate.js",
		            charset: "utf-8"
		        });
		    }
		}
    }));
})(jQuery,Backbone,_,M139);
﻿/**
* @fileOverview 写信附件列表视图层.
* @namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Compose.View.HtmlEditor', superClass.extend(
        /**
        *@lends M2012.Compose.View.prototype
        */
    {
        el: "body",
        name : "htmlEditor",
        events: {
        },
        initialize: function (options) {
        	this.model = options.model;
            this.groupmailModel = options.groupmailModel;
        	var self = this;
        	this.editorView = M2012.UI.HTMLEditor.create({
		        contaier:$("#htmlEdiorContainer"),
		        blankUrl:"/m2012/html/groupmail/editor_message.htm?sid="+top.sid,
                isShowSetDefaultFont:true,
                placeHolder : '说点什么吧...',
		        uploadForm:{
	                getUploadUrl: function(callback){
                        /**
	                    self.model.requestComposeId(function(){
	                    	var url = utool.getControlUploadUrl(true);
	                    	setTimeout(function(){
		                        callback(url);
		                    },0);
	                    });*/
	                },
	                //fieldName: "uploadInput",
	                getResponseUrl: function(responseText){
                        /**
	                	var imageUrl = '';
	                	var returnObj = self.model.getReturnObj(responseText);
                        returnObj.insertImage = true;
                        upload_module.model.composeAttachs.push(returnObj);
                        uploadManager.refresh();
	                	if(returnObj){
	                		imageUrl = self.model.getAttachUrl(returnObj.fileId, returnObj.fileName, false);
	                	}

	                    return imageUrl;*/
                        return ["http://" + window.location.host + '/mw2/groupmail/s?func=gom:uploadFile',
                            '&groupNumber=' + self.groupmailModel.get("groupNumber"),
                            //'&transId=', Math.random() + '' + new Date().getTime(),
                            '&transId=' + Math.random().toString(),
                            '&sid=' + top.sid,
                            '&comefrom=2'
                        ].join('');
	                }
	            },
                showButton : ['Face', 'InsertImage']
		    });

		    this.editorView.on("buttonclick", function(e){
		        switch (e.command ) {
		            case "ScreenShot":
		                // 保存当前页签名称
		                self.model.tabName = top.$App.getCurrentTab().name;
		                //console.log("截屏");
		                self.screenShot();
		                break;
		            case "Voice":
		                if (!self.EditorVoiceInstance) {
		                    self.EditorVoiceInstance=VoiceInput.create({
		                        autoCreate: true,
		                        button: $(e.target),
		                        from: "editor",
		                        onComplete: function (text) {
		                            self.insertHTML(text);
		                            setTimeout(function () {
		                                self.setFocus();
		                            }, 200);
		                        }
		                    });
		                    
		                } else {
		                    self.EditorVoiceInstance.render();
		                }
		                break;
		        }
		    });

		    this.editorView.editor.on("before_send_mail", function(e){
			    var editorDoc = self.editorView.editor.editorDocument;
			    var insertedMarks = $(editorDoc).find(".inserted_Mark");
			    insertedMarks.hide();
		    });

            // 是否显示占位提示语, 群邮件新增
            // 根据是否有发送内容来决定是否要显示
            function isShowPlaceHolder() {
                self.groupmailModel && self.groupmailModel.trigger("isShowPlaceHolder", function (hasSendContent) {
                    self.editorView.isShowPlaceHolder(!hasSendContent); // 显示占位符
                });
            }

            // 输入邮件信息时触发
            this.editorView.editor.on("keyup keydown", function(e){
                self.groupmailModel && self.groupmailModel.trigger("changeGroupMailContent");
                setTimeout(function() {
                    self.groupmailModel && self.groupmailModel.trigger("changeGroupMailWriteMessageWinHeight");
                    isShowPlaceHolder();
                }, 50);
            });

            // 插入图片时触发
            this.editorView.editor.on("insertImage", function(e){
                self.groupmailModel && self.groupmailModel.trigger("changeGroupMailContent"); // 触发输入框内容改变事件
                setTimeout(function() {
                    self.groupmailModel && self.groupmailModel.trigger("changeGroupMailWriteMessageWinHeight");
                }, 500);
                isShowPlaceHolder(); // 隐藏占位符
            });

            // 输入焦点时触发
            this.editorView.editor.on("focus", function(e){
                self.editorView.isShowPlaceHolder(false); // 隐藏占位符
            });

            // 移除焦点时触发
            this.editorView.editor.on("blur", function(e){
                isShowPlaceHolder();
            });

            this.editorView.editor.on("mousedown", function (e) {
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
            
            this.editorView.editor.on("paste", function (e) {
                if(self.isRight){
                    paste(e); //右键粘贴
                }
            });

		    this.editorView.editor.on("keydown", function (e) {
		        if (e.ctrlKey && e.keyCode == M139.Event.KEYCODE.V) {
                    paste(e);
		        }else if(e.ctrlKey && e.keyCode == M139.Event.KEYCODE.ENTER){
		        	$("#topSend").click();
		        }else if(e.keyCode == M139.Event.KEYCODE.BACKSPACE){ //ie浏览器选中图片时，按退格会退出到登录页，但实际是想删除图片
                    if(self.ieImgel){
                        self.ieImgel.remove();
                        self.ieImgel = null;
                        return false;
                    }
                    if(self.ieTableEl){
                        self.ieTableEl.remove();
                        self.ieTableEl = null;
                        return false;
                    }
		        }
		    });
		    // todo 绑定鼠标移动事件，隐藏上传附件提示语
		    this.editorView.editor.on("mousemove", function (e) {
		        attachListView.hideUploadTip();
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
                    var content = self.getEditorContent() || '';
                    setTimeout(function(){
                        var newContent = self.getEditorContent() || '';
                        if(content == newContent && $B.is.windows && window.navigator.platform != "Win64"){
                            M139.Plugin.ScreenControl.isScreenControlSetup(true);
                        }

                        self.editorView.editor.resetTextSizeForIe();
                    },50);
                }
            }
            this.initUploadImageMenu();  // 初始化绑定事件
            return superClass.prototype.initialize.apply(this, arguments);
        },
        // 渲染编辑器 
        render : function(pageType, dataSet){
        	var self = this;
        	// 编辑器空白iframe添加tabindex属性
        	self.editorView.editor.frame.tabIndex = 5;
        	// 自适应 初始化编辑器高度
        	self._initEditorHeight();
        	$(window).resize(function(){
        	    self._initEditorHeight();
        	    self._initRightContactHeight();
        	    $("#divLetterPaper").is(":visible") && mainView.showPaperFrame();
			});
        	
            self._initRightContactHeight();
            
        	// todo 该判断是否可移到组件内部？
        	if(self.editorView.editor.isReady){
        		try{
        			renderEditor(pageType, dataSet);
                    if(pageType != self.model.pageTypes.VCARD && pageType != self.model.pageTypes.CUSTOM) {
	        			self.editorView.editor.setDefaultFont(top.$User.getDefaultFont());
	        		}
                    self.model.autoSaveTimer['subMailInfo']['content'] = self.getEditorContent();
                    self.model.defaultContent = self.getEditorContent();
                    registerEvent();
        		}catch(e){}
        	}else{
        		self.editorView.editor.on("ready", function(e){
        			try{
		        		renderEditor(pageType, dataSet);
                        if(pageType != self.model.pageTypes.VCARD && pageType != self.model.pageTypes.CUSTOM) {
	        				self.editorView.editor.setDefaultFont(top.$User.getDefaultFont());
	        			}
                        self.model.autoSaveTimer['subMailInfo']['content'] = self.getEditorContent();
                        self.model.defaultContent = self.getEditorContent();
                        registerEvent();
	        		}catch(e){}
	        	});
        	}
        	function renderEditor(pageType, dataSet){
        		if (dataSet.content || dataSet.html || dataSet.text) {
		        	var htmlContent = dataSet.content || (dataSet.html && dataSet.html.content) || (dataSet.text && dataSet.text.content);
			       // console.debug(htmlContent);
			        if (Number(dataSet.isHtml) == 0) {
			            htmlContent = top.$T.Utils.htmlEncode(htmlContent).replace(/\r?\n/g, "<br />");
			        }
			        if (pageType == "reply" || pageType == "replyAll" || pageType == "forward") {
			            htmlContent = htmlContent;
			        }
			        if (pageType == "compose" || pageType == "draft" || pageType == "resend") {
			        	self.setEditorContent(htmlContent);
			        } else {
			            self.editorView.editor.addReplyContent(htmlContent);
			        }
			    }else{ //会话邮件回复切换到写信
			    	var htmlContent = top.$App.getSessionDataContent();
					self.setEditorContent(htmlContent);
			    }

			    // 加载指定信纸
			    if(dataSet.letterPaperId){
			    	mainView.showPaperFrame();
			    	var readyStr = "$('#frmLetterPaper')[0].contentWindow && $('#frmLetterPaper')[0].contentWindow.letterPaperView";
			    	M139.Timing.waitForReady(readyStr, function(){
			    		$('#frmLetterPaper')[0].contentWindow.letterPaperView.setPaper('', null, dataSet.letterPaperId);
		        	});
			    }
			    // 加载邮件模板
			    if(dataSet.template){
			    	setContentByTemplate(dataSet.template, dataSet.content);
			    }
			    // 加载签名
			    self._loadSign(pageType);
			    if(pageType == 'uploadLargeAttach'){
			    	$("#aLargeAttach").click();
			    }
			    //根据邮件模板设置邮件正文
	        	function setContentByTemplate(template, content){
					var url = "/m2012/js/compose/template/" + template + ".js";
					M139.core.utilCreateScriptTag(
                        {
                            id: template,
                            src: url,
                            charset: "utf-8"
                        },
                        function () {
                            var templateHtml = top.$App.composeTemplate;
							content = $T.format(templateHtml, {content: content || ""});
							self.setEditorContent(content);
                        }
                    );
	        	}
        	}
        	//使编辑区也支持拖放文件
        	function registerEvent(){
        		var editorDoc = self.editorView.editor.editorDocument;
        		var body = editorDoc.documentElement;
	            body.addEventListener("dragenter", _dragenter, false);
	            body.addEventListener("dragover", _dragover, false);
	            body.addEventListener("drop", _drop, false);
	            // 显示图片小工具
	            var jEditorBody = $(editorDoc).find('body');
				top.$App.showImgEditor(jEditorBody);
        	}
        },

        _getEditorBody:function(){
            if (!this.divEdBody) {
                this.divEdBody = $("#htmlEdiorContainer div.eidt-body");
            }
            return this.divEdBody;
        },
        // 给发送群邮件窗口的图片绑定事件
        initUploadImageMenu:function(){
            var uploadBtn = $('#i_groupIco_picture');
            var faceBtn = $('#i_groupIco_face');
            var that = this;

            // 上传图标绑定事件
            uploadBtn.click(function(){
                that.editorView.showMenu({
                    name:'InsertImage_Menu',
                    dockElement:uploadBtn[0]
                });
                // 展示列表时重新定位下上传组件
                top.groupmailFileUpload.dock();
                // 展示列表时显示上传组件
                top.groupmailFileUpload.isShow(true);
            });

            // 表情图标绑定事件
            faceBtn.click(function(){
                that.editorView.showMenu({
                    name:'Face_Menu',
                    dockElement:faceBtn[0]
                });
            });
        },
        // 自适应 初始化编辑器高度
        _initEditorHeight : function(){
        	var self = this;
        	var composeIframe = window.frameElement;
        	var extraHeight = 59 + 26 + 10;		// 底部按钮栏高度 + 编辑工具栏高度 + 空白误差
        	if ($("#moreOptions").is(":visible")) {
        		extraHeight += 28;
        	}
        	var divEdBody = this._getEditorBody();
        	var height = parseInt(composeIframe.style.height) - divEdBody.offset().top - extraHeight;
        	if(height < self.model.editorMinHeight){
        		height = self.model.editorMinHeight;
        	}
        	divEdBody.height(height);
        },
        //右侧通讯录与写信页齐高
        _initRightContactHeight: function () {
            var divAddr = $("#divAddressList");
            // 使用了fix定位，必须通过iframe高度来计算
            var composeIframe = window.frameElement;
            var mainHeight = $(composeIframe).height();
            var height;
            //if (!top.$App.isNewWinCompose()) {
            //} else {
	            height = mainHeight - 144 - 35;
            //}

            var groupList = divAddr.find('.GroupList');
  
            if (groupList.height() != height) {
                groupList.height(height);
                divAddr.find('.searchEnd').height(height);	// 搜索结果列表
            }
        },

        // 加载签名
        _loadSign : function(pageType){
        	var self = this;
        	var signTypes = "|compose|uploadLargeAttach|reply|replyAll|forward|forwardAsAttach|forwardAttachs|forwardMore";
		    if (signTypes.indexOf('|'+pageType+'|') >= 0) {
		        self._setDefaultSign();
		    }
        },
        // 设置默认签名
        _setDefaultSign : function(){
        	var self = this;
		    var signList = top.$App.getSignList();
	        for (var i = 0,len = signList.length; i < len; i++) {
	            var signItem = signList[i];
	            if (signItem.isDefault) {
	                if(signItem.type == 1){ //我的电子名片签名需获取最新的用户信息
	                    self.createVcardSign(3, signItem.id, signItem.isDefault,signItem.isAutoDate);
	                }else{
	                    self.editorView.editor.setSign(M139.Text.Html.decode(signItem.content));
	                }
	                break;
	            }
	        }
		},
		//生成我的电子名片签名
		createVcardSign : function(opType,id,isDefault,isAutoDate){
			var self = this;
			//top.M139.UI.TipMessage.show('正在获取电子名片信息');
		    M2012.Contacts.getModel().getUserInfo({}, function(result){
		    	var userInfo = {};
		    	if(result.code === 'S_OK'){
		    		userInfo = result['var'];
		    	}else{
		    		console.log("M2012.Contacts.getModel().getUserInfo 获取用户信息失败！result.code:"+result.code);
		    		top.M139.UI.TipMessage.hide();
		    		/*
		    		userInfo = {
			        	name : 'helloworld',
			        	FavoWord : '自强不息，奋斗不止！',
			        	UserJob : 'web前端开发',
			        	CPName : '彩讯科技',
			        	CPAddress : '长虹大厦',
			        	FamilyEmail : 'tkh@139.com',
			        	MobilePhone : '1500000000',
			        	OtherPhone : '1510000000',
			        	BusinessFax : '458788',
			        	CPZipCode : '1546'
			        };*/
		    	}
		        //top.M139.UI.TipMessage.show('正在生成电子名片');
		        var items = ['user:signatures']; //添加电子签名
		        items[1]  = {
		            'opType'     : opType, //opType，1:增加，2:删除，3:修改
		            'id'         : id,
		            'title'      : '我的电子名片',//签名名称
		            'content'    : self._getVcardContent(userInfo,isAutoDate),//签名内容 
		            'isHtml'     : 1,//是否是HTML格式
		            'isDefault'  : isDefault,//是否是默认签名档
		            'isAutoDate' : 0,//1：自动加入 0：不加入默认为0，不自动加入写信日期
		            'isSMTP'     : 0,//是否在smtp信件中追加签名   1:是 0:否默认为0，不在smtp中追加签名
		            'type'       : 1 //签名的类型，0：用户自定义的签名   1: 我的电子名片签名(通讯录)
		        };
		        items[2] = 'user:getSignatures';
		        items[3] = null;
		        self.editorView.editor.setSign(items[1].content);
		        //top.M139.UI.TipMessage.hide();
		        
		        self.model.autoSaveTimer['subMailInfo']['content'] = self.getEditorContent();
		        self.model.defaultContent = self.getEditorContent();
		    });
		},
		//我的电子名片签名内容
		_getVcardContent : function(userInfo,isAutoDate){
		    var imgSrc = this._getContactImage(userInfo.ImageUrl);
		    var encode = M139.Text.Html.encode;
		    var contentArr = [
		        '<table border="0" style="width:auto;font-family:\'宋体\';font-size:12px;border:1px solid #b5cbdd;-webkit-border-radius:5px;line-height:21px;background-color:#f8fcff;flaot:left;">',
		        '<tbody>',
		        '<tr>'
		    ];
		    contentArr.push('<td style="vertical-align:top;padding:5px;"><img rel="signImg" width="96" height="96" src="'+imgSrc+'"></td>');
		    contentArr.push('<td style="padding:5px;">');
		    contentArr.push('<table style="font-size:12px;line-height:19px;table-layout:auto;">');
		    contentArr.push('<tbody>');
		    if(userInfo.AddrFirstName) contentArr.push('<tr><td colspan="2"><strong id="dzmp_unm" style="font-size:14px;">'+encode(userInfo.AddrFirstName)+'</strong></td></tr>');
		    if(userInfo.FavoWord) contentArr.push('<tr><td colspan="2" style="padding-bottom:5px;">'+encode(userInfo.FavoWord)+'</td></tr>');
		    if(userInfo.UserJob) contentArr.push('<tr><td>职务：</td><td>'+encode(userInfo.UserJob)+'</td></tr>');
		    if(userInfo.CPName) contentArr.push('<tr><td >公司：</td><td>'+encode(userInfo.CPName)+'</td></tr>');
		    if(userInfo.CPAddress) contentArr.push('<tr><td >地址：</td><td>'+encode(userInfo.CPAddress)+'</td></tr>');
		    if(userInfo.FamilyEmail) contentArr.push('<tr><td >邮箱：</td><td>'+encode(userInfo.FamilyEmail)+'</td></tr>');
		    if(userInfo.MobilePhone) contentArr.push('<tr><td >手机：</td><td>'+encode(userInfo.MobilePhone)+'</td></tr>');
		    if(userInfo.OtherPhone) contentArr.push('<tr><td >电话：</td><td>'+encode(userInfo.OtherPhone)+'</td></tr>');
		    if(userInfo.BusinessFax) contentArr.push('<tr><td >传真：</td><td>'+encode(userInfo.BusinessFax)+'</td></tr>');
		    if(userInfo.CPZipCode) contentArr.push('<tr><td >邮编：</td><td>'+encode(userInfo.CPZipCode)+'</td></tr>');
		    if(isAutoDate) contentArr.push('<tr><td >日期：</td><td>'+$Date.format("yyyy年MM月dd日 星期w",new Date())+'</td></tr>');
		    contentArr.push('</tbody>');
		    contentArr.push('</table>');
		    contentArr.push('</td>');
		    contentArr.push('</tr>');
		    contentArr.push('</tbody>');
		    contentArr.push('</table>');
		    return contentArr.join('');
		},
		//获取联系人头像地址
		_getContactImage : function(imgurl){
			var self = this;
		    var result='';
		    var sysImgPath = self.model.sysImgPath;
		    if(imgurl && imgurl.toLowerCase() != sysImgPath[0] && imgurl.toLowerCase() != sysImgPath[1]){
		        result = top.getDomain('resource') + $T.Html.encode(imgurl);
		    }else{
		        result = "/m2012/images/global/face.png";
		    }
		    return result;
		},
        // todo 直接获取内容
        getEditorContent : function () {
	        if (this.editorView.editor.isHtml) {
	            return this.editorView.editor.getHtmlContent();
	        } else {
	            return this.editorView.editor.getTextContent();
	        }
	    },
        //得到编辑器内容(纯文本)
        getTextContent: function () {
            return this.editorView.editor.isHtml ? this.editorView.editor.getHtmlToTextContent() : this.editorView.editor.getTextContent();
        },
	    setEditorContent : function (content) {
	        if (this.editorView.editor.isHtml) {
	            return this.editorView.editor.setHtmlContent(content);
	        } else {
	            return this.editorView.editor.setTextContent(content);
	        }
	    },
	    insertHTML: function (content) {
	        return this.editorView.editor.insertHTML(content);
	    },
	    setFocus : function(){
	    	this.editorView.editor.editorWindow.focus();
	    },
        // 用户未上传附件验证正文/主题是否提到附件
        checkContent : function(event){
        	var self = this;
        	var isContinue = false;
        	var noAttach = uploadManager.fileList.length == 0 && Arr_DiskAttach.length == 0;
        	if(noAttach){
        		var content = self.getEditorContent() || '';
        		content = content.split("replySplit")[0];
                
                var subject = self.model.autoSaveTimer['subMailInfo']['subject'];
                var newSubject = $("#txtSubject").val();
                
	        	if (content.indexOf("附件") >= 0 || (subject != newSubject && newSubject.indexOf("附件") >= 0)) {
			        if(M139.UI.Popup.currentPopup){
			        	M139.UI.Popup.currentPopup.close();
			        }
			        var target = subjectView.getPopupTarget(event);
			        var popup = M139.UI.Popup.create({
						target : target,
						icon : "i_ok",
						width : 300,
						buttons : [{
							text : "确定",
							cssClass : "btnSure",
							click : function() {
								mainView.sendMail();
								popup.close();
							}
						}, {
							text : "取消",
							click : function() {
								popup.close();
							}
						}],
						content : self.model.tipWords['LACK_ATTACHMENTS']
					});
					popup.render();
			        
				}else{
					isContinue = true;
				}
        	}else{
        		isContinue = true;
        	}
        	return isContinue;
        },
        // 解决ie6编辑器bug
        solveIeBugForEditor : function(){
        	if($.browser.msie && $.browser.version == 6){
		        setTimeout(function() {
		            $("#HtmlEditor").css("margin", "0"); //边框bug
		        }, 100);
		    }
        },
        // 截屏
        screenShot : function(){
        	//if($B.is.firefox){  
	            //top.$Msg.alert('对不起，您的浏览器暂不支持截屏功能',{
			       // onclose : function(e){
			           // e.cancel = true;//撤销关闭
			       // }
			    //});
	            //return false;
	        //}
	        this.captureScreen();
        },
        /**
         * 向下兼容
         * 有可能打开页面时不支持，但是后来安装了。
         * 如果控件成功被创建，则该函数会被覆盖掉
         */
        captureScreen : function(){
        	//if($B.is.ie){
		        if(upload_module_multiThread.isSupport() || M139.Plugin.ScreenControl.isScreenControlSetup(true)){
		            upload_module_multiThread.init(true);
		            if(captureScreen != arguments.callee){
		                captureScreen();
		            }
		        }
		    //}else{
		    	//console.log('captureScreen captureScreen!'+upload_module_multiThread.isSupport());
		       // if(!upload_module_multiThread.isSupport()){
		           // $T.Utils.isScreenControlSetup(false, false, true);
		       // }
		   // }
        }
    }));
})(jQuery, _, M139);


