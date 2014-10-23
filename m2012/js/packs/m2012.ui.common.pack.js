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
		//$App.show(this.items[index].key);
		var key = this.items[index].key;
		setTimeout(function(){	// IE6, 7下页面加载空白
			$App.show(key);
		}, 0);
		
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

