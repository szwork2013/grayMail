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
	        if(this.flashLoaded === undefined && typeof supportUploadType !== "undefined") {
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
	        var commonButtons = DefaultStyle.buttons_Common;
	        var moreButtons = DefaultStyle.buttons_More;
            if ($(options.contaier)[0].ownerDocument != document) {
                this.setWindow(window.parent);//解决在top窗口创建编辑器的问题
            }
            //要隐藏的按钮
            if (options.hideButton) {
                $(options.hideButton).each(function (index, menuName) {
	                var i, name;
                    for (i = 0; i < commonButtons.length; i++) {
                        name = commonButtons[i].name;
                        if (name == menuName || name == menuName + "_Menu") {
                            commonButtons.splice(i, 1);
                            i--;
                        }
                    }
                    for (i = 0; i < moreButtons.length; i++) {
                        name = moreButtons[i].name;
                        if (name == menuName || name == menuName + "_Menu") {
                            moreButtons.splice(i, 1);
                            i--;
                        }
                    }
                });
            } else if (options.showButton) {
                var showButtons = [];
                $(options.showButton).each(function (index, menuName) {
                    for (var i = 0; i < commonButtons.length; i++) {
                        var name = commonButtons[i].name;
                        if (name == menuName || name == menuName + "_Menu") {
                            showButtons.push(commonButtons[i]);
                        }
                    }
                });
                commonButtons = showButtons;
                if(!options.showMoreButton){
                    DefaultStyle.buttons_More = null;
                }
            } else if (options.combineButton) {
                var showButtons = [];
                var combineButtons = commonButtons.concat( DefaultStyle.buttons_More );
                $(options.combineButton).each(function (index, menuName) {
                    for (var i = 0; i < combineButtons.length; i++) {
                        var name = combineButtons[i].name;
                        if (name == menuName || name == menuName + "_Menu") {
                            showButtons.push(combineButtons[i]);
                        }
                    }
                });
                commonButtons = showButtons;
                DefaultStyle.toolBarPath_Common = DefaultStyle.toolBarPath_Session;
                DefaultStyle.buttons_More = null;
            }
            
            if(options.userDefinedToolBarContainer){
                DefaultStyle.toolBarPath_Common = options.userDefinedToolBarContainer;
            }

            var view = new M2012.UI.HTMLEditor.View.Editor({
                template: DefaultStyle.template,
                buttons_Common: commonButtons,
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