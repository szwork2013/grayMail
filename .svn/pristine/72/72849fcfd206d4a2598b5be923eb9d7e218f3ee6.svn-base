/**
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