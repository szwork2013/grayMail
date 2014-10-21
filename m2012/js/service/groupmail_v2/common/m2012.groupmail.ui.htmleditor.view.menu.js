;(function (jQuery, _, M139) {
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
