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

function Repeater(container,options){	
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
		if(!datasource || datasource.length==0){
			this.Render([]);
			return ;
		}
		var self=this;
	    this.DataSource=datasource;
	    if(this.DataSource.constructor!=Array){
	    	this.DataSource=[this.DataSource];//如果是object,转化为数组
	    }
	    if (this.HtmlTemplate == null) {
	        this.HtmlTemplate = this.Element.innerHTML;
	    }
	    //this.ItemTemplate=this.HtmlTemplate.match(/(<!--item\s+start-->)([\r\n\w\W]+)(<!--item\s+end-->)/ig)[0];
	    var re = /(<!--item\s+start-->)([\r\n\w\W]+)(<!--item\s+end-->)/i;
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
	                param.push(dataRow[paramList[i]]);
	            }
	            if (self.Functions[name]) {
	                //return self.Functions[name](param);
	                var context = self;
	                if (self.Instance) {
	                    self.Instance.DataRow = dataRow;
	                    context = self.Instance;
	                }
	                return self.Functions[name].apply(context, param);

	            }


	        });
	        row = row.replace(reg1, function($0) { //替换变量
	            m = $0.substr(1).trim();
				if(dataRow[m]!=undefined){
					//一级变量
					return dataRow[m]; 
				}else{
					if(m.indexOf(".")>=0){// //多级变量
						var arr=m.split(".");
						var temp=dataRow;//多级变量暂存器
						for(var i=0;i<arr.length;i++){
							if(temp[arr[i]]!=undefined){
								temp=temp[arr[i]]
							}else{//变量不存在
								return "";
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

        return html;
	    
	}		
}
String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, "");
    }



var TabPageModel = Backbone.Model.extend({
	/**
	 * 
	 */
    initialize: function(options){
    	//console.debug(options)
		if(options){
		
			this.container=options.container;
			//this.container=c;
			//alert("hello");
			
			this.toolbar=document.createElement("div");
			this.toolbar.id="main_toolbar";
			$(this.toolbar).addClass('bgMargin');
			this.toolbar.style.display="none";
			this.container.appendChild(this.toolbar);
		}
	},
    moduleConfig :{	//模块配置，用于工厂模式创建相应的模块
    //welcome:{moduleClass:window.Welcome,groupType:1},//欢迎页
    simpleframe: { model: "SimpleIframeModel", view:"SimpleIframeView" }, //大小通吃的框架页
    readmail: { model: "ReadModel", view:"ReadView"  }, //读邮件
    mailbox: { model: "MailboxModel", view:"MailboxView" }, //收件箱
    compose: { model: "ComposeModel", view:"ComposeView"} //写邮件
	},
    pages: {}, //标签页集合，用于遍历
	TabpageModel:[],	//模块列表
	moduleCount:0,
	prevModule:null,//上一模块
	defaults:{  //默认数据
	    currentModule:null,//当前模块
	    container:null,
	    moduleConfig:{},//模块配置
	    prevModule:null,//上一个模块
		maxTab: 5,//最大限制5个固定标签
		maxTabsNum: 25, //所有标签最大值为25个，打开第26个标签时关闭第25个
		myapptabs: ['addr', 'calendar', 'googSubscription'], //固定标签取消时显示在特色应用
		initTabsData: ['welcome', 'mailbox_1', 'addr', 'calendar', 'diskDev', 'googSubscription'], //移动用户默认固定标签(首页， 邮件， 通讯录，日历， 彩云网盘， 云邮局），不可关闭
		initInternetUserTabsData: ['mailbox_1', 'addr', 'diskDev', 'googSubscription'], //非移动用户默认固定标签(邮件， 通讯录，彩云网盘， 云邮局），不可关闭
		channelState:{},
		selected: []
	},
	topFixTabObj: {
	    'welcome': '首页',
	    'mailbox_1': '邮件',
	    'addr': '通讯录',
	    'calendar': '日历',
	    'diskDev': '彩云网盘',
	    'googSubscription': '云邮局'
	},
	
	/**
	 * 创建module,module是实体数据{name:"模块名",
	 * isload:false //是否加载过
	 * type:"mailbox" //表示模块类型，如mailbox,welcome,readmail
	 * title:"" 表示模块标题
	 * element:null 模块容器dom
	 */
	createModule:function (module){
	    if (module.mutiple) { // 多实例
	        module.orignName = module.name;
	        var key = Math.random();
	        if (module.data && module.data.key) {
	            key = module.data.key;
	        }
	        module.name = module.name + "_" + key;
	    }
			//module.type=module.name;
		if(!module.group){  module.group=module.name;};
		if(!module.title){module.title=module.name;};
		
		var existModule = this.getModule(module.name);
		if(existModule){//已存在则直接返回
			
			//  add by tkh 已存在覆盖  module.data.inputData 的属性后再返回 
			try{
				if(existModule.data.inputData){
					_.extend(existModule.data.inputData, module.data.inputData);
				}
			}catch(e){
				console.log('Function:createModule 覆盖inputData属性时报错。');
			}
			
		    return existModule;
		}
		
		if(!module.data){
			module.data=new Object();
		}

		//从模块配置表获取模块处理类
		//module.model=this.moduleConfig["model"];	
		//module.view=this.moduleConfig["view"];
		
		//为模块创建div容器
		var divContent = document.createElement("div");
		if (module["deactive"]) {
		    divContent.innerHTML = "";
		} else {
		    divContent.className = "gload";
		    divContent.innerHTML = "<span class='gloadbg'></span>";
		}

		//divContent.style.display="none";
		this.container.appendChild(divContent);
		

		module.element = divContent;	//模块的容器元素,主要方便做切换显示隐藏
		module.view.el = divContent; //设置当前view的el
		
		
		this.pages[module.name]=module;//加入模块队列
		//this.createTab(module.name);
		return module;
	},
	//将模块从内存中清除
	deleteModule:function(moduleName){
		var m=this.pages[moduleName];
		//m.element.parentNode.removeChild(m.element); //移除此元素 ，对于收件箱会出状况，先留着@_@
	    delete this.pages[moduleName];
	},
	existModule:function(name){
		if(this.getModule(name)){
			return true;
		}else{
			return false;
		}
	},
	//得到模块
	getModule: function(module){
		if (typeof(module) == "string") {
			return this.pages[module];
		}else{
			return this.pages[module.name];
		}
		
	},
	getCurrent: function () {
	    var name = this.get("currentModule");
	    if (name) {
	        return this.getModule(name);
	    } else {
	        return null;
	    }
	},
	/**
	 * 显示模块，如果不存在则创建
	 */
	showModule:function(moduleName){
		var module=this.getModule(moduleName);
		if(!module){
		    module = this.getModule("welcome"); //容错
		}
	    if(this.prevModule!=null && this.prevModule!=module){
    
		    this.prevModule.element.style.display="none";    //隐藏上一个模块
		}
		module.element.style.display="";
		module.view.el=module.element;//设置当前view的el
	    //获取模块正文区域
		if (module.view && module.view.render) {
		    var isRendered = module.isRendered ? true : false;//当前模块是否已经显示过
            
			var result = module.view.render(isRendered); //执行当前模块的render
			module.isRendered=true;//表示已显示过

		}
		//获取工具栏，工具栏是所有标签页共用的
		if (module.view && module.view.getToolbar) {
			if(module.group!=this.prevModule.group){ //非常重要：如果是同一分组的不需要重新生成toolbar，避免页面刷新，避免递归导致的死循环
				var tb=module.view.getToolbar();
				if(typeof(tb)=="string"){
					this.toolbar.innerHTML=tb;
				}else if(this.toolbar.childNodes.length==0){ //如果生成过，避免重复生成
					this.toolbar.appendChild(tb);
				}
				
				this.toolbar.style.display="";
			}
			
		}else{
			this.toolbar.style.display="none";
		}
		
		
		this.prevModule=module;
		return module;
	},
	
	/** 获取初始化固定标签 */
	getInitTabsData:function(){
		return $User.isChinaMobileUser() ? this.get('initTabsData') : this.get('initInternetUserTabsData');
	},
	
	/** 设置固定标签 */
	setFixedTabsData:function(options,callback){ //保存值只能是string类型
		$App.setCustomAttrs('fixedtabs', options, callback);
	},
	
	/** 获取固定标签 */
	getFixedTabsData:function(){ //这里需要判断是否设置过,主要获取时间问题，可能数据还未加载
		var fixedtabs = null;
		/*if(this.hasSetFixedTabs()){
			var fixedtabs = $App.getCustomAttrs('fixedtabs');
			fixedtabs = fixedtabs.split(",");
		}else{*/
			fixedtabs = this.getInitTabsData();
		// }
		return fixedtabs;
	},
	
	/** 标记设置过固定标签 */
	markSetFixedTabs:function(callback){
		if(!this.hasSetFixedTabs()){
			$App.setCustomAttrs('hasSetFixedTabs', "1", callback);
		}
	},
	saveChannelState: function (channelName,name) {
	     
	    var channelState = this.get("channelState");
	    if (!channelName || channelName == "groupMail") {//群邮件特殊处理
	        channelName = "mail";
	    }
	    channelState[channelName] = { current: name };
	},
	
	/** 是否设置过固定标签 */
	hasSetFixedTabs:function(){
		return $App.getCustomAttrs('hasSetFixedTabs');
	}
	
});
﻿TabPageView =Backbone.View.extend({
    initialize: function(options){
        var model=new TabPageModel(options);
        this.model=model;
        this.el=options.container;
        var self = this;
        model.on("change:currentModule", function (model, val, group) {
            if (val != null) { //为了触发onchange，先设为null再设为null再设为目标值，所以会触发两次
                var currentModule = val;      //找到当前模块，执行当前模块的render
                try {
                    this.showModule(currentModule);
                    self.activeTab(currentModule);
                    self.renderChannel(currentModule);
                    // 控制标签管理菜单显示隐藏
                    if ($App.getView('tabpage').tab.count > 5) {
                        $('#tabsMenuIco').show();
                    } else {
                        $('#tabsMenuIco').hide();
                    }
                    // 【云邮寄模块】需要隐藏下拉三角、语音输入
                    $App.getView('top').setSearchBox(currentModule);
                    // 切换模块时改变搜索框的默认提示语
                    $App.getView('top').switchSearchBoxTips();
                    // 除欢迎页和邮件列表，其他模块的高度有调整，需要触发iframe变化
                    if ($('#' + currentModule).length) {
                        $('#' + currentModule).resize();
                    } else if (typeof group == 'string') {
                        $('#' + group).resize()
                    }

                    /*
                     * 子模块支持透明皮肤
                     */
                    var moduleName = $App.getCurrentTab().name;
                    var module = {
                        'addr': true,
                        'calendar': true,
                        'diskDev': true,
                        'googSubscription': true
                    }
                    var allowMailbox = function (name) {
                        var layout = $App.getMailboxView().model.get('layout');
                        return (name === 'mailbox_1' || name.indexOf('mailsub_') > -1) && layout === 'list';
                    }

                    // 欢迎页、收件箱透明化处理
                    // 欢迎页透明化处理需要2步：1-容器div_main背景透明化；2-iframe内引用皮肤样式
                    if (moduleName === 'welcome' || allowMailbox(moduleName)) {
                        $('#div_main').addClass('TransparentBg');
                    } else {
                        $('#div_main').removeClass('TransparentBg');
                    }

                    // 子模块透明化处理
                    // 1-移除容器div_main背景色；2-iframe内引用皮肤样式；3-调整左样式边栏（云邮局除外，因为云邮局iframe的高度没有变化）
                    if (module[moduleName]) {
                        $('#div_main').addClass('mainIframeBg_noBg');

                        if (moduleName !== 'googSubscription') {
                            $('#skinBgSub').addClass('skin_not');
                        } else {
                            $('#skinBgSub').removeClass('skin_not');
                        }
                    } else {
                        $('#div_main').removeClass('mainIframeBg_noBg');
                        $('#skinBgSub').removeClass('skin_not');
                    }

                    $App.onResize();
                } catch (ex) {
                    console.error(ex.message);
                }
                
                this.lastModule = currentModule;
                $App.closeWriteOkPage();
            }

        });
	
        this.tab=new TabLabel(document.getElementById("divTab"),this);
        this.tab.call = [this.onTabDelete, this.onTabActive, this.onTabClose];

        this.watchScrollbar();
	
    },
    el:null,//声明自己的容器
    template: "",
    orignTabs:null,
    events: {
        // "click .itemTitle":"changeTitle"
    },
    render:function (){
        var self=this;
    
        var currentModule = this.model.get("currentModule");
        if (currentModule) {
            this.activeTab(currentModule);
        }
    
   
    },
    setTitle:function(title,moduleName){
        //title=title.encode();
        if(!moduleName){
            moduleName=this.model.get("currentModule");
        }
        this.tab.title(moduleName,title);
        this.model.getModule(moduleName).title=title;
	
    },
    getVisibleCount: function () {
        return $("#divTab ul").find("li[tabid]:visible").length;
    },
    renderCloseAllButton: function () {
        var self = this;

	
    },

    /** 标签管理按钮 */
    renderMenuListButton:function(){
        var self = this;
        if($("#tabsMenuIco")[0]){
		
            return;
        }
        //setTimeout(function () {//异步执行
        $("#divTab ul").append('<li id="tabsMenuIco" class="noAll" tabindex="0"><a href="javascript:;" class="closeAll" title="点击查看更多"></a></li>');
        //},0);
    },
    //激活tab,会重复执行，以后优化
    //激活tab,会重复执行，以后优化
    activeTab: function (moduleName) {
        //alert("active:"+moduleName);
        if (this.tab.exist(moduleName)) {
            this.tab.active(moduleName);
        } else {	//如果tab不存在则创建
            this.createTab(moduleName);
        }
        try {
            $App.trigger("showTab", this.model.getModule(moduleName));
        } catch (ex) {
            //避免showtab事件中有异常，影响整个标签页切换
        }

    },
    replace:function(tabOld,tabNew){
        this.tab.replace(tabOld, tabNew);
    },
    //关闭指定标签页
    close:function(tabName){
        if(!tabName){
            tabName=this.model.get("currentModule");
        }
        this.tab.close(tabName);
    },
    //关闭全部标签页
    closeAllTab:function(){
        for (elem in this.model.pages) {
            if (elem != "welcome") {
                this.close(elem);
            }
        }
    },
    resize:function(){
        this.tab.size();
    },
    fixFlashRemove: function (tabName) {
        // 控制标签显示隐藏
        if ($.browser.msie && (tabName.indexOf("compose") >= 0 || tabName == "account"
                   || tabName == "mms" || tabName == "postcard") || tabName == "greetingcard" || tabName=="activityInvite"
                   || tabName == "quicklyShare" || tabName == "diskDev") { //特殊处理销毁flash时引发的异常__flash__removeCallback
            var module = this.model.getModule(tabName);
            if (module) {
                var elem = module.element;
                if($(elem).find("iframe")[0]){ //有些iframe还未打开
                    var flash = $("object", $(elem).find("iframe")[0].contentWindow.document);
                    if (flash.attr("classid") == "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000") {
                        flash.remove();
                    }
                }
            }
        
        }
    },
    //关闭当前标签页时触发的事件
    onCloseTab:function(tabName){
        var module = this.model.getModule(tabName);
        if (module) {
            this.fixFlashRemove(tabName);
            var elem = module.element;
            this.model.deleteModule(tabName);
            var iframe = $(elem).find("iframe");
            if (iframe.length > 0) {//释放iframe内存
                var frm = iframe.get(0);
                
                if (tabName.indexOf("compose_") >= 0) {
                    var childFrm = $("iframe", frm.contentWindow.document);
                    $(childFrm).each(function (i,n) {
                        n.src="about:blank";
                        $(n).remove();
                    });
                    
                }
                /*try {
                    frm.contentWindow.document.write('');
                    frm.contentWindow.document.clear();
                } catch (e) { };*/
                frm.src = "about:blank";
                frm.parentNode.removeChild(frm);
            }
            $(elem).remove(); //关闭标签时，清空dom内容回收内存
 
        
        

        }
	
        //    this.renderCloseAllButton();
        //this.renderMenuListButton(); //关闭时不用再调用了，因为是固定显示的
	
        /*var module;
            if(moduleName){
                module=this.modules[moduleName];
            }else{
                module=this.currentModule;
            }
            
            module.close=true;
            module.element.style.display="none";
            if (module.group != this.prevModule.group) {
                if(module==MM.currentModule){	//关闭的模块当前处于激活状态
                    //this.showModule(this.prevModule.name);
                }
                
            }
            return true;*/
    },
    clearTabCache:function(tabName){
        for (elem in this.model.pages) {
            var current = this.model.pages[elem];
            if (current.name.indexOf(tabName) >= 0) {
                current.isRendered = false;
            }
        }
    },
    createOrignTabs: function (orignTabs, view, isHeaderTab) {
        for (var i = 0; i < orignTabs.length; i++) {
            var key = orignTabs[i];
            if (key == "mailbox_1") {
                this.model.createModule({ view: $App.getView("mailbox"), name: "mailbox_1", title: "收件箱", group: "mailbox", deactive: true });
                this.createTab(key, true, isHeaderTab);
            } else {
                var link = window.LinkConfig[key];
                var obj = { name: key, view: view, title: link["title"], group: link["group"], mutiple: link["mutiple"], deactive: true }
                this.model.createModule(obj);
                this.createTab(key, true, isHeaderTab);
            }
        }

    },
    watchScrollbar: function () {
        if (($.browser.msie && $.browser.version < 8) || !$.browser.msie) {//只有IE8以上浏览器存在滚动条复位问题
            return;
        }
        var watchList = ["#sidebar", "#div_maillist", "#readmail_container", "#covMailSummaryList"]
        M139.Timing.setInterval("watchScrollbar", function () {
            for (var i = 0; i < watchList.length; i++) {
                var elems = $(watchList[i]);
                if (elems.length > 0) {
                    elems.each(function (i, n) {
                        if (!n.getAttribute("hasWatched")) {
                            console.log("start watch........",n);
                            M139.Timing.watchElementScroll(n);
                            n.setAttribute("hasWatched",true);
                        }

                    });
               
                }
            }
        },1000);
    },
channelOptions: {},
showChannel:function(channelName){
	
	// add by tkh 点击云邮局频道，如果有‘红点’触发更新消息状态的事件
	if(top.$App.pushMpostMsg){
		top.$App.trigger('updateMpostMsgStatus');
	}
	
	// add by tkh 邮箱顶层保留现场之后进入云邮局页面不会刷新，触发云邮局内部的事件刷新数据
	if(channelName === 'subscribe'){
		top.$App.trigger('renderMpostMailnotify');
	}
	
    var targetTab = "mail";
    if (this.channelOptions[channelName]) {
        targetTab=this.channelOptions[channelName].defaultTab;
    }
    var state=this.model.get("channelState");
    if (state[channelName] && state[channelName].current) {
        targetTab = state[channelName].current;
        if (this.tab.exist(targetTab)) {
            $App.activeTab(targetTab);
        } else { //容错，标签可能被自动关闭 
            if (this.channelOptions[channelName] && this.channelOptions[channelName].defaultTab) {
                $App.show(this.channelOptions[channelName].defaultTab);
            } else {
                $App.showMailbox(1);
            }
        }
    } else {    //未打开过该频道
        if (targetTab == "mail") { //邮件频道不用 app.show打开，要特殊处理下
            $App.showMailbox(1);
        } else {
            $App.show(targetTab);
        }
    }

},
registerChannel: function (name, options) {
    //renderFunc = (options && options.renderFunc) || "none";
    this.channelOptions[name] = options;

},
renderChannel: function (name) {
    var self = this;
    var folderLeft = $("#sub");
    function showMainFolder(show, remainWidth) {
        if (show) {
            $("#leftOther").hide();
            !$App.isNewWinCompose() && folderLeft.show();
            $("#main").css("left", "200px");
            var fv = $App.getView("folder");
            if (fv) {
                fv.resizeSideBar();//隐藏再显示后滚动条会重置，重设滚动条高度
            }
        } else {
            $("#leftOther").show();
            !$App.isNewWinCompose() && folderLeft.hide();
            var left = remainWidth ? "200px" : "0px";
            $("#main").css("left", left);
        }
    }
    function setTabVisible(channel) {
        // 控制顶部导航模块选中样式
        $("#toFixTabs [class=on]").removeClass();
        $("#toFixTabs [channel="+channel+"]").addClass("on");
        
        // 通讯录、日历、网盘模块高度需要调整
        /*
        if (channel == 'addr' || channel == 'calendar' || channel == 'disk') {
            $('#main').addClass('main_not');
            $('#divTab').addClass('mainTop_not');
        } else {
            $('#main').removeClass('main_not');
            $('#divTab').removeClass('mainTop_not');
        }*/

        var op = self.channelOptions[channel];
        if (op && op.withinMail) { //在邮件频道显示
            $("#toFixTabs [channel=mail]").addClass("on");
        }
        if (op && op.hideTab) {
            $("#divTab ul").hide();
            $('#main').addClass('main_not');
            $('#divTab').addClass('mainTop_not');
        } else {
            $("#divTab ul").show();
            $('#main').removeClass('main_not');
            $('#divTab').removeClass('mainTop_not');
        }
        for (elem in self.tab.tabs) {
            var t = self.tab.tabs[elem];
            var m = self.model.getModule(elem);
            if (!m) continue;

            var currentOp = self.channelOptions[m.group] ? self.channelOptions[m.group]:self.channelOptions[m.channel];//循环取频道设置
            if (channel == "mail" || (op && op.withinMail)) { //邮件模块
                if (currentOp) {//隐藏其它频道的标签
                    if (currentOp.hideTab == false) {
                        $(t).show();
                    } else {
                        $(t).hide();
                    }
                } else {
                    $(t).show();
                }
            } else if (channel == 'welcome' || channel == 'subscribe' || channel == "note") { // 为在欢迎页显示“收件箱”入口做的特殊处理
                channel = channel == 'welcome' ? 'mailbox' : channel;
                if (m.group == channel || m.channel == channel) {
                    $(t).show();
                } else {
                    $(t).hide();
                }
            } else {//其它的全隐藏。
                $(t).hide();
            }

        }
        // 调整tablabel数目为显示标签的数目
        self.tab.count = $('#divTab li:visible').not('#tabsMenuIco').length;
        if (self.prevChannel && self.prevChannel != channel) {//切换频道时因为时序问题，无法判断当前频道有几个标签，所以要再次调用resize。prevChannel是为了提高性能减少重复计算
            self.tab.size();
        }
        
        self.prevChannel = channel;
    }
    var module = this.model.getModule(name);
    var channelName = module.channel || module.group;//取模块的group或channel作为channel名称 
    
    if (this.channelOptions[channelName]) {
        this.model.saveChannelState(channelName,name);
        var leftNav = this.channelOptions[channelName].leftNav;
        if (leftNav == "none") { //iframe全部内容实现，不需要顶层的左侧导航
            showMainFolder(false);
            setTabVisible(channelName);
        } else if (leftNav == "mail") { //共用邮件channel的左侧导航
            showMainFolder(true, true);
            setTabVisible(channelName);
        } else {    //由top窗口创建左侧导航,目前暂未使用，未来预留
            showMainFolder(false, true);
            if (folderLeft.prev().attr("class") == "sub") {//已创建过
                folderLeft.prev().html(leftNav());
            } else {
                folderLeft.before("<div class=\"sub\" id=\"leftOther\">" + leftNav() + "</div>");
            }
        }

    } else {
        var visibleChannel = (name == "welcome" ? "welcome" : "mail");
        this.model.saveChannelState(visibleChannel,name);
        showMainFolder(true);

        setTabVisible(visibleChannel);
    }
},
//达到最大标签数处理,打开第26个标签时关闭第25个
maxTabHandler:function(){
    var maxTabsNum = this.model.get('maxTabsNum') || 23; //26 = 25 + 管理标签
    var lastTab;
    var lastTabId;
    this.tabContainer = this.tabContainer || $('#divTab ul');
    var $visibleTabs = this.tabContainer.find('li:visible').not('#tabsMenuIco');
    if( $visibleTabs.length >= maxTabsNum){
        lastTab = this.tabContainer[0].lastChild.previousSibling; //最后一个标签页
        lastTabId = lastTab.getAttribute('tabid');
        lastTabId && $App.closeTab(lastTabId);
    }
},

createTab: function (tabName, deactivate, isHeaderTab) {
    var mod = this.tab.exist(tabName);
    if (mod) {
        //this.tab.active(tabName);
        return;
    }

    try{
        this.maxTabHandler();        
    }catch(e){
        console.log(e);
    }


	var title=this.model.pages[tabName].title;
    var t = {
        name: tabName,
        text: title,
        group: this.model.pages[tabName].group
    };
    if (tabName == "welcome") {
        t.close = true;
    }	
    this.tab.add(t, deactivate, isHeaderTab);
},
//tab标签页点击叉号时触发，用于清除当前模块
onTabDelete:function(tabName){
	//因为同分组的tab替换时也会触发onTabDelete，所以只有未分组的module，才能直接删除模块
	/*var module=this.model.getModule(tabName);
    if(module.group==module.name){	//未分组的module
    	this.model.deleteModule(tabName);
    }else{	//分组的module，不做处理
    	
    }*/
    return ;
},
onTabActive:function(tabName){
//返回true表示激活tab成功
    this.model.set("currentModule",tabName);//设置当前模块，重要
    //this.model.showModule(tabName);
    return true;
},
onTabClose: function (name) { 
    var args = { cancel: false, name: name };
    try{
        $App.trigger("closeTab", args);
    } catch (ex) { }


    if (!args.cancel) { 
        this.onCloseTab(name);
        return true;
    } else {//取消关闭
        return false;
    }
}

});
﻿;(function () {
    var FrameModel = Backbone.Model.extend({
        /**
        * 
        */
        initialize: function (options) {
            if (!window.LinkConfig) {	//只执行一次，避免子类重复执行
                window.LinkConfig = {	//模块配置，用于工厂模式创建相应的模块
                    welcome: { url: "welcome_v2.html", site: "", title: "首页", tab: "welcome",group:"welcome"},
                    compose: { url: "compose.html", site: "", title: "写信", mutiple: true },
                    activityInvite: { url: "activityinvite/invite.html", site: "", title: "会议邀请", mutiple: false },
                    account:             {group: "setting", title: "设置", url: "set/account.html", site: "", tab: "account" },
                    account_setname:     {group: "setting", title: "设置", url: "set/account.html?bubble=txtSenderName", site: "", tab: "account" },
                    account_accountSafe: {group: "setting", title: "设置", url: "set/account.html?anchor=accountSafe", site: "", tab: "account" },
                    account_secSafe:     {group: "setting", title: "设置", url: "set/account.html?anchor=secSafe", site: "", tab: "account" },
                    account_areaSign:    {group: "setting", title: "设置", url: "set/account.html?anchor=areaSign", site: "", tab: "account" },
                    account_userInfo:    {group: "setting", title: "设置", url: "set/account.html?anchor=userInfo", site: "", tab: "account" },
                    accountLock:         {group: "setting", title: "设置", url: "set/account_lock.html", site: "", tab: "account" },
                    lockForget:          {group: "setting", title: "设置", url: "set/account_lock_verifycode.html", site: "", tab: "account" },
                    editLockPass:        {group: "setting", title: "设置", url: "set/mobile.html", site: "", tab: "account" },
                    preference:          {group: "setting", title: "设置", url: "set/preference.html", site: "", tab: "preference" },
                    preference_replySet: {group: "setting", title: "设置", url: "set/preference.html?anchor=replySet", site: "", tab: "preference" },
                    preference_forwardSet: {group: "setting", title: "设置", url: "set/preference.html?anchor=forwardSet", site: "", tab: "preference" },
                    preference_autoDelSet: {group: "setting", title: "设置", url: "set/preference.html?anchor=clearFolders", site: "", tab: "preference" },
                    preference_onlinetips: {group: "setting", title: "设置", url: "set/preference.html?anchor=onlinetips", site: "", tab: "preference" },
                    preference_clientSend: {group: "setting", title: "设置", url: "set/preference.html?anchor=clientSend", site: "", tab: "preference" },
                    preference_popReceiveMail: {group: "setting", title: "设置", url: "set/preference.html?anchor=popReceiveMail", site: "", tab: "preference" },
                    preference_autoSavaContact: {group: "setting", title: "设置", url: "set/preference.html?anchor=autoSavaContact", site: "", tab: "preference" },
                    popmail:    {group: "setting", title: "设置", url: "set/pop.html", site: "", tab: "popmail" },
                    addpop:     {group: "setting", title: "设置", url: "set/add_pop.html", site: "", tab: "popmail" },
                    addpopok:   {group: "setting", title: "设置", url: "set/add_pop_ok.html", site: "", tab: "popmail" },
                    type:       {group: "setting", title: "设置", url: "set/sort.html", site: "", tab: "type_new" },
                    type_new:   {group: "setting", title: "设置", url: "set/sort_new.html", site: "", tab: "type_new" },
                    createType: {group: "setting", title: "设置", url: "set/create_sort.html", site: "", tab: "type_new" },
                    tags:              {group: "setting", title: "设置", url: "set/tags.html", site: "", tab: "tags" },
                    tags_customerTags: {group: "setting", title: "设置", url: "set/tags.html?anchor=forwardSet", site: "", tab: "tags" },
                    tags_systemFolder: {group: "setting", title: "设置", url: "set/tags.html?anchor=systemFolder", site: "", tab: "tags" },
                    spam:               {group: "setting", title: "设置", url: "set/spam.html", site: "", tab: "spam" },
                    spam_whiteListArea: {group: "setting", title: "设置", url: "set/spam.html?anchor=forwardSet", site: "", tab: "spam" },
                    spam_spamMailArea:  {group: "setting", title: "设置", url: "set/spam.html?anchor=spamMailArea", site: "", tab: "spam" },
                    spam_antivirusArea: {group: "setting", title: "设置", url: "set/spam.html?anchor=antivirusArea", site: "", tab: "spam" },
                    mobile:          {group: "setting", title: "设置", url: "set/mobile.html", site: "", tab: "mobile" },
                    partner:         {group: "setting", title: "设置", url: "set/mobile.html", site: "", tab: "mobile" }, //兼容旧版，多写一个key
                    notice: {group: "setting", title: "设置", url: "set/notice.html", site: "", tab: "notice" },
                    set_addr: {group: "setting", title: "设置", url: "set_v2/set_addr.html", site: "", tab: "settingsaddr" },
                    set_calendar: {group: "setting", title: "设置", url: "set_v2/set_calendar.html", site: "", tab: "settingscalendar" },
                    set_disk: {group: "setting", title: "设置", url: "set_v2/set_disk.html", site: "", tab: "settingsdisk" },
                    set_mpost: {group: "setting", title: "设置", url: "/mpost2014/html/columnmanager.html?sid=" + top.sid, site: "", tab: "settingsmpost" },

                    pushEmail: { url: "/pushmail/default.aspx", site: "webmail", title: "pushEmail", tab: "pushemail" }, //pushemail地址
                    G3Phone: { url: top.SiteConfig.ssoInterface + "/GetUserByKeyEncrypt?url=" + encodeURIComponent("http://auth.weibo.10086.cn/sso/139mailframe.php?a=g3&environment=2&partId=1&path=&skin=shibo&sid=") + "&comeFrom=weibo&sid=" + top.sid, title: "G3通话", tab: "G3Phone" },
                    fetion: { url: "http://i2.feixin.10086.cn/home/indexpart", site: "", title: "飞信同窗", tab: "fetion" },
                    shequ: { url: top.SiteConfig.ssoInterface + "/GetUserByKeyEncrypt?url=" + encodeURIComponent("http://auth.weibo.10086.cn/sso/139mailframe.php?sid=") + "&comeFrom=weibo&sid=" + top.sid, comefrom: "weibo", title: "移动微博", group: "移动微博", tab: "shequ" },
                    cancelPackage: { url: "/userconfig/matrix/MailUpgrade.aspx?page=MailUpgrade.aspx", site: "webmail", title: "套餐信息", tab: "cancelpackage" },
                    syncguide: { url: "/rm/richmail/page/sync_guide_inner.html", site: "", title: "手机同步邮箱", tab: "syncguide" },
                    pay139: { url: top.SiteConfig.ssoInterface + "/GetUserByKeyEncrypt?url=" + encodeURIComponent(domainList.global.pay139+"&sid=") + "&comeFrom=weibo&sid=" + top.sid, site: "", title: "手机支付", tab: "pay139" },
                    note: { url: "note/note.html", site: "", title: "和笔记", tab: "note" },
					heyuedu: { url: top.SiteConfig.ssoInterface + "/GetUserByKeyEncrypt?url="+ encodeURIComponent("http://read.10086.cn/email139/index?Sid=") +"&comeFrom=weibo&sid=" + top.sid, comeFrom:"weibo", site: "", title: "和阅读", tab: "heyuedu" },
                    sms: { url: "sms/sms_send.html", group: "sms", title: "发短信", homeUrl: "sms_send.html" },
                    mms: { url: "mms/mmsRedirect.html", group: "mms", title: "发彩信" },
                    diskDevOld: { url: "disk/disk_jump.html", site: "", group: "disk", title: "彩云网盘", homeUrl: "disk_default.html" },
                    diskDev: { url: "disk_v2/disk2.html", site: "", group: "disk", title: "彩云", homeUrl: "disk_v2/disk2.html" },// update by tkh 重构彩云
                    diskShare: { url: "disk_v2/disk_share.html", site: "", group: "disk", title: "彩云网盘", homeUrl: "disk_v2/disk_share.html" },// update by chenzhuo 移植彩云共享功能
                    greetingcard: { url: "card/card_sendcard.html", site: "", title: "贺卡" },
                    card_success: { url: "card/card_success.html", site: "", title: "贺卡" },
                    quicklyShareOld: { url: "largeattach/largeattach_welcome.html", site: "", title: "文件快递" },
                    quicklyShare: { url: "fileexpress/cabinet.html", site: "", group: "disk", title: "彩云网盘" },// update by tkh 重构文件快递默认打开暂存柜页面
                    postcard: { url: "/Card/PostCard/Default.aspx", group: "postcard", site: "webmail", title: "明信片", homeUrl: "Default.aspx" },
                    attachlist: { url: "mailattach/mailattach_attachlist.html", site: "", group: "disk", title: "彩云网盘" },
                    calendar: { url: "calendar_v2/cal_index.html", homeUrl: "cal_index.html", title: "日历", group: "calendar" },
                    addMyCalendar: { url: "calendar_v2/mod/cal_mod_schedule_v1.html", homeUrl: "cal_index.html", title: "添加活动", group: "calendar" },
					vipEmpty: { url: "mail/vipmail_empty.html", site: "", title: "VIP邮件" },
                    clientPc: { url: getDomain("rebuildDomain") + "/disk/netdisk/wp.html?jsres=http%3A//images.139cm.com/rm/newnetdisk4//&res=http://images.139cm.com/rm/richmail&isrm=1", site: "", title: "pc客户端", target: "_blank"},
                    smallTool: { url: "/m2012/html/control139.htm", site: "", title: "pc客户端/小工具", target: "_blank" },
                    smallToolSetup: { url: "/m2012/controlupdate/mail139_tool_setup.exe", site: "", title: "小工具安装", target: "_blank" },
                    pcClientSetup: { url: "/m2012/html/disk_v2/wp.html", site: "", title: "pc客户端", target: "_blank" },
					health: { url: "health.html", group: "health", title: "邮箱健康度"},

                    //用户中心
					userCenter: { url: " http://zone.mail.10086.cn/api/sso/ssoformail.ashx?to=CN201204A1&flag=6", site: "", title: "用户中心" },
					voiceSetting: { url: "/m2012/html/voiceMail/redirect.html", site: "", title: "语音信箱" },


                    //通讯录块
                    addrvipgroup:     { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?v=20120620&homeRoute=10100", site: "" },
                    addrhome:         { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html", site: "" },
                    addrinputhome:    { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_import_clone", site: "" },
                    addroutput:       { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_export", site: "" },
                    addrWhoAddMe:     { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_whoaddme", site: "" },
                    addrWhoWantAddMe: { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_request", site: "" },
                    updateContact:    { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_update", site: "" },
                    addrshare:        { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr/addr_share_home.html?check=1", site: "" },
                    addrshareinput:   { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "/addr/matrix/share/ShareAddrInput.aspx", site: "webmail" },
                    addrbaseData:     { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_info_basic", site: "" },
                    dyContactUpdate:  { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "/addr/matrix/updatecontactinfo.htm", site: "webmail" },
                    addrImport:       { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_import_pim", site: "" },
                    addrImportFile: { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_import_file", site: "" },
                    addrMcloudImport: { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_import_pim", site: "" },
                    addrAdd:         { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_add_contacts", site: "" },
					addrEdit:         { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_editContact", site: "" },
                    addrMyVCard:      { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr/addr_businesscard.html?type=mybusinesscard&pageId=0", site: "" },
                    addr:             { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html", site: "" },
                    setPrivate:       { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_setprivacy", site: "" },
                    baseData:         { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_info_basic", site: "" },
                    teamCreate: { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_team_create", site: "" },
                    teamNotify: { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_team_notify", site: "" },
                    syncGuide:        { url: "/rm/richmail/page/sync_guide_inner.html", site: "", title: "手机同步邮箱", tab: "syncguide" },

                    groupMail: { url: "/m2012/html/groupmail/list.html",site: "", title: "群邮件", group: "groupMail"  },
                    writeGroupMail: { url: "/m2012/html/groupmail/list.html?redirect=writeGroupMail", site: "", title: "群邮件", group: "groupMail" },
                    //groupMail: { url: "GroupMail/groupEmailList.htm", site: "webmail", title: "群邮件" },
                    groupMailWrite: { url: "GroupMail/GroupMail/ComposeGroupmail.aspx?action=write", site: "webmail", group: "groupMailCompose", title: "写群邮件" },
                    groupMailSetting: { url: "/GroupMail/GroupOper/GroupManager.aspx", site: "webmail", group: "groupMail", title: "群邮件", refresh: true },
                    groupMailFindGroup: { url: "/GroupMail/GroupOper/FindGroup.aspx", site: "webmail", group: "groupMail", title: "群邮件", refresh: true },
                    groupMailCreateGroup: { url: "/GroupMail/GroupOper/CreateGroup.aspx", site: "webmail", group: "groupMail", title: "群邮件", refresh: true },
                    groupMailAddGroupUser: { url: "/GroupMail/GroupOper/AddUserGroup.aspx", site: "webmail", group: "groupMail", title: "群邮件", refresh: true },
                    groupMailEditGroup: { url: "/GroupMail/GroupOper/EditGroupNickName.aspx", site: "webmail", group: "groupMail", title: "群邮件", refresh: true },

                    myrings: { url: "set/myrings.html", site: "", title: "咪咕音乐" },
                    billManager: { url: "bill/billmanager.htm", site: "", group: "mailsub_0", title: "服务邮件" },
                    billLife: { url: "/handler/bill/goto.ashx?lc=main", site: "billLife", group: "mailsub_0", title: "服务邮件" },
                    billLifeNew: { url: "/handler/bill/goto.ashx", site: "billLife", group: "mailsub_0", title: "服务邮件" },
                    billLifeSsoIndex: { url: "/handler/bill/goto.ashx?lc=main&provcode=0&areacode=0&from=1&fromtype=1 ", site: "billLife", group: "mailsub_0", title: "账单生活" },
                    billLifeSsoWater: { url: "/handler/bill/goto.ashx?lc=pay.waterselect&provcode=0&areacode=0&from=1&fromtype=1 ", site: "billLife", group: "mailsub_0", title: "账单生活" },
                    billLifeSsoElectric: { url: "/handler/bill/goto.ashx?lc=pay.electricselect&provcode=0&areacode=0&from=1&fromtype=1 ", site: "billLife", group: "mailsub_0", title: "账单生活" },
                    billLifeSsoGass: { url: "/handler/bill/goto.ashx?lc=pay.gasselect&provcode=0&areacode=0&from=1&fromtype=1 ", site: "billLife", group: "mailsub_0", title: "账单生活" },
                    billLifeTraffic: { url: "/handler/bill/goto.ashx?lc=pay.trafficselect&provcode=0&areacode=0&from=1&fromtype=1", site: "billLife", group: "mailsub_0", title: "账单生活" },
                    //uecLab: { url: "/LabsServlet.do", site: "uec", title: "实验室" },
                    uecLab: { url: "uec/lab.html", title: "实验室" },
                    selfSearch: { url: 'set/selfsearch.html', title: '自助查询' },

                    fax: { url: "fax/sso.aspx?style=3&id=2", site: "webmail", title: "收发传真" },
                    pushemail: { url: "/pushmail/default.aspx", site: "webmail", title: "手机客户端" },
                    smsnotify: { url: "sms/notifyfriends.html", group: "sms", title: "短信提醒" },
                    mobileGame: { url: "http://g.10086.cn/s/139qr/", group: "mobileGame", title: "手机游戏" },

                    // 主题运营活动
                    earth2013: { url: "topicality/earth2013/indexearth.html", site: "", title: "地球一小时" },
                    addcalendar: { url: "calendar/calendar_editcalendar.html", homeUrl: "calendar_view.html", title: "日历", group: "calendar" },

                    //每月任务
                    //myTask: { url: "taskmain/taskmain.html", site: "", title: "我的任务" },

                    myTask: { url: 'http://zone.mail.10086.cn/api/sso/ssoformail.ashx?to=CN201306B1', site: "", title: "我的积分任务" },
                    sportLottery: { url: "http://3g.weicai.com/139mail/index.php", type: "sso", comefrom: "weibo" },
                    
                    changeSkin: {url: "changeskin.html", site: "", title: "换皮肤"}, // add by tkh 设置皮肤
                    

                    //邮箱营业厅
                    mailHall: { url: "hall/index.html", site: "", title: "邮箱营业厅" },//邮箱营业厅

                    //年终“邮”
                    lottery: { url: top.getDomain('lotteryRequest') + '/setting/s?func=setting:examineUserStatus&versionID=1', site: "", title: "开箱邮礼" },
                    //lotteryDetail: { url: 'https://happy.mail.10086.cn/web/act/cn/fuli/Rule.aspx', site: "", title: "活动详情" },//年终“邮”
                    //lotteryDetail: { url: 'http://happy.mail.10086.cn/web/act/cn/lottery/detail.aspx', site: "", title: "活动详情" },//年终“邮”
                    //lotteryad: { url: 'http://happy.mail.10086.cn/web/act/cn/lottery/index.aspx', site: "", title: "马上邮奖" },//年终“邮”
                    blueSky: { url: 'http://zone.mail.10086.cn/api/sso/ssoformail.ashx?to=CN201403A1', site: "", title: "蓝天自造" },
                    billCharge: { url: top.SiteConfig.billChargeUrl, site: "", title: "邮箱营业厅" },
                    colorfulEgg: { url: 'http://zone.mail.10086.cn/api/sso/ssoformail.ashx?to=CN201403D1', site: '', title: '生日彩蛋' },
                    smartLife: { url: top.getDomain('happyMailUrl') + '/api/sso/ssoformail.ashx?to=CN201407B1', site: "", title: "拥抱智能生活" },
                    nothing: {} //结尾
                };
                //window.LinksConfig = window.LinkConfig; //兼容旧版
                if (!domainList["global"]["billLife"]) {
                    domainList["global"]["billLife"] = "http://bill.mail.10086.cn";
                }
                this.addSubscribeLinks();
                this.fixlinks();//提供新开关动态修改链接入口
            }

        },
        modules: [], //模块列表
        defaults: {  //默认数据
            currentLink: null, //当前模块
            container: null
        },
        /***
        * 通过key值获取links配置
        */
        getLinkByKey: function (key) {
            return window.LinkConfig[key];
        },
        /***
        * 通过model取到当前的标签页id，再取到相应的links配置
        */

        getLink: function (moduleModel) {

            var currentModuleName = moduleModel.get("currentModule"); //模块管理model

            var key = currentModuleName;
            var module = moduleModel.getModule(currentModuleName);
            if (module.orignName) { //多实例，name已经加了guid，取orignName
                key = module.orignName;
            }
            var config = window.LinkConfig[key]; //为了适应写信页多实例，不能直接取module.name，而是取分组名称
            if (module.view && module.view.inputData && module.view.inputData.categroyId) {
                config.categroyId = module.view.inputData.categroyId;
            }
            return config;
            //alert(config.url);
        },

        /**
        * 创建module,module是实体数据{name:"模块名",
        * isload:false //是否加载过
        * type:"mailbox" //表示模块类型，如mailbox,welcome,readmail
        * title:"" 表示模块标题
        * element:null 模块容器dom
        */
        addLink: function (key, data) {
            window.LinkConfig[key] = data;
        },

        /** 添加我的订阅相关页面连接 */
        addSubscribeLinks: function () {
            //var host = getDomain('dingyuezhongxin'); // update by tkh
            var host = "http://" + top.location.host;
            var homemailhost = getDomain('homemail');
            this.addLink('goodMag', { url: host + "/inner/magazine_list_main.action", group: "subscribe", title: "云邮局" });
            this.addLink('googSubscription', { url: host + "/mpost2014/html/mpost.html", group: "subscribe", title: "云邮局" }); // 云邮局主页面
            this.addLink('mpostOnlineService', { url: host + "/mpost2014/html/onlineservice.html", channel: "subscribe", mutiple:true,refresh:true,title: "云邮局" }); // 云邮局在线服务（新页签）
            this.addLink('mpostOnlineRead', { url: host + "/mpost2014/html/mymagazine.html", group: "subscribe", title: "云邮局" }); // 云邮局在线阅读
            this.addLink('myMag', { url: host + "/inner/magazine_list_main.action", group: "subscribe", title: "云邮局" });
            this.addLink('myCollect', { url: host + "/inner/show_favorite.action", group: "subscribe", title: "云邮局" });
            this.addLink('myCloudSubscribe', { url: host + "/inner/mysubscribe.action", group: "subscribe", title: "云邮局" }); // add by tkh 新版精品订阅‘我的订阅’
            this.addLink('setSubscription', { url: host + "/inner/to_subscribe_manager.action", group: "subscribe", title: "云邮局" });
            this.addLink('myBookshelf', { url: host + "/inner/magazine_list_main.action", group: "subscribe", title: "云邮局" });
            this.addLink('dingyuezhongxin', { url: host + "/mpost2014/html/mpost.html", group: "subscribe", title: "云邮局" });
            this.addLink('dingyueDownload', { url: "http://jpdyapp.mail.10086.cn/?21", group: "subscribe", title: "云邮局" });

        },
        fixlinks :function(){
        	
            if(top.SiteConfig.calendarRemind){//修改日程提醒
           	
           	    if(top.SiteConfig.isLoadingCalendarRemind){
           	    	
           	    	this.addLink('calendar',{ url: "calendar_reminder/loading.html", homeUrl: "month.html", title: "日历", group: "calendar" });
           	    	
           	    }else{
           	    	
           	    	this.addLink('calendar',{ url: "calendar_v2/cal_index.html", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
           	    	this.addLink('createCalendar', { url: "calendar_v2/cal_index.html?redirect=addlabel", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
           	    	this.addLink('addcalendar', { url: "calendar_v2/cal_index.html?redirect=addact", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
           	    	this.addLink('addBirthcalendar', { url: "calendar_v2/cal_index.html?redirect=addbirthact", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
           	    	this.addLink('calendar_act_view', { url: "calendar_v2/cal_index.html?redirect=actview", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
           	    	this.addLink('calendar_msg', { url: "calendar_v2/cal_index.html?redirect=msg", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
           	    	this.addLink('calendar_search', { url: "calendar_v2/cal_index.html?redirect=search", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
           	    	this.addLink('calendar_square', { url: "calendar_v2/cal_index.html?redirect=discovery", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
           	    	this.addLink('calendar_manage', { url: "calendar_v2/cal_index.html?redirect=labelmgr", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
                    this.addLink('calendar_viewlabel', { url: "calendar_v2/cal_index.html?redirect=viewlabel", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
           	    	var lstSpecial = [{labelId:6,name:'birth',page:'list_system.html'},{labelId:1,name:'appointment',page:'list_system.html'},{labelId:2,name:'pay',page:'list_system.html'},
           	    					{labelId:3,name:'special',page:'list_system.html'},{labelId:5,name:'sport',page:'list_system.html'},{name:'baby',page:'list_baby.html'}
           	    				  ];
           	    	var item = null ,url = null , homeUrl = null;
           	    	for(var i = 0 ;i < lstSpecial.length; i++){
           	    		
           	    		item = lstSpecial[i];
           	    		homeUrl = item.page;
           	    		url = "calendar_v2/" + item.page;
           	    		if(item.labelId){
           	    			
           	    			url +=  ("?labelId=" + item.labelId);
           	    		}
           	    		
           	    		this.addLink('specialCalendar_'+item.name,{url: url,homeUrl: homeUrl,title: "日历",group: "calendar"});
           	    	}
           	    }
           		
           	
           }
            if (SiteConfig.m2012NodeServerRelease) {
                LinkConfig.welcome.url = "/m2012server/welcome";
            }
        }

    }, {
	    getLinkByKey: function (key) {
            return window.LinkConfig[key];
        }
    });

    window.FrameModel = FrameModel;

})();
var FrameView = Backbone.View.extend({
    initialize: function (options) {
        this.parentView = options.parent;
        this.model = new FrameModel();
        this.param = options.param;//页面参数（如果有的话）
        this.url = options.url;//如果传递url直接打开，可以不需要配置
        this.html = options.html;//如果传递html直接可以不通过iframe创建标签页
        this.title = options.title;//如果传递url直接打开，可以不需要配置
        this.inputData = options.inputData;
        var self = this;
        $(window).resize(function () {
            self.onResize();
        });

    },
    render: function (isRendered) {//isRendered:表示是否显示过，用于强制刷新
        var self = this;
        var pm = this.parentView.model; //父view的model，即模块管理类
        var currentModule = pm.get("currentModule");//当前模块
        var config = this.model.getLink(pm);//获取链接配置

        var errorTip = ['<div class="bodyerror ErrorTips" style="display:none">',
 		    '<img src="../images/global/smile.png" width="73" height="72">',
 		    '<p>没加载出来，再试一次吧</p>',
 		    '<a class="btnTb" href="javascript:"><span class="p_relative">重新加载</span></a>',
 	    '</div><div class="gtips NoCompleteTips" style="display:none">',
            '<span class="ml_5">由于网络原因，当前页面未完全加载，是否<a class="Retry" style="text-decoration: underline;" href="javascript:">重新加载</a>？</span>',
            '<a href="javascript:" class="i_u_close Close"></a>',
        '</div>'].join("");


        if (config) { //有配置
            //this.el=pm.getModule(currentModule).element;//显示容器
            this.parentView.setTitle(pm.getModule(currentModule).title || config.title); //设置标题 

            if ($(this.el).html() == "" || !isRendered || config.refresh) {   //没有创建过，或需要强制刷新时才重新加载
                var prefix = config.url.indexOf("?") >= 0 ? "&" : "?";//是问号还是&符号
                var url = config.url ;
                if (!config.clearSid) { //有不需要sid的情况
                    url = url + prefix + "sid=" + sid;
                }
                if (config.categroyId) {
                    url += '&categroyId=' + config.categroyId;
                }
                if (config.site) {
                    url = getDomain(config.site) + "/" + url;
                }
                if (this.param) {
                    if (typeof (this.param) == "string") {
                        if (this.param.indexOf("urlReplace") >= 0) {
                            url = this.param.match("urlReplace=(.+)")[1];
                            var m_domain = config.url.match(/http:\/\/.+?\//);
                            if (m_domain) {
                                url = m_domain + url;
                            }
                        } else {
                            url = url + this.param
                        }
                    } else {
                        url = M139.Text.Url.makeUrl(url, this.param);
                    }
                }

                if (this.inputData) {
                    url = $App.inputDataToUrl(url, this.inputData);
                }

                var id = currentModule;
                if (config.tab) {
                    id = config.tab;
                }
                $(this.el).html("<iframe scrolling=\"auto\" class=\"main-iframe\" name=\"ifbg\" frameborder=\"no\" width=\"100%\" id=\"" + id + "\" src=\"" + url + "\" allowtransparency=\"true\"></iframe>" + errorTip);
            }
        } else if (this.url) {
            this.parentView.setTitle(this.title); //设置标题
            $(this.el).html("<iframe scrolling=\"auto\" class=\"main-iframe\" name=\"ifbg\" frameborder=\"no\" width=\"100%\" src=\"" + this.url + "\" allowtransparency=\"true\"></iframe>" + errorTip);
        } else if (this.html) {
            this.parentView.setTitle(this.title); //设置标题
            $(this.el).html(this.html);
        }
        this.onResize();

        if (!isRendered) {
            setTimeout(function () {
                self.watchIframeStatus(pm.getModule(currentModule));
            }, 0);
        }
    },
    /**
     * 获取工具栏，此函数由tabpageView自动调用。
     */
    onResize: function () {

        if (this.el) {
            try {
                var iframe = this.el.childNodes[0];
                var currentModule = $App.getCurrentTab && $App.getCurrentTab() && $App.getCurrentTab().name;
                // 切换到其他模块会触发欢迎页iframe高度的改变
                // 欢迎页iframe高度变化会影响$App.getBodyHeight()取值
                if (iframe.id == 'welcome' && currentModule != 'welcome') {
                    return;
                }
                $iframe = $(iframe);
                var height = $(document.body).height() - $("#div_main").offset().top;
                $iframe.height(height - 4);//减去多余4像素
                //console.log(iframe.id)
                if ($.browser.msie && $.browser.version < 8) {
                    // 针对ie67的优化
                    
                    var idAttr = iframe.id; // add by tkh 与网盘一样，云邮局的页签不需要设置宽度
                    if ((idAttr && idAttr.indexOf('mpostOnlineService') !== -1) ||
                        idAttr === 'googSubscription' ||
                        idAttr == "diskDev" ||
                        idAttr == "calendar" || idAttr == "createCalendar" || idAttr == "addcalendar" || idAttr.toLowerCase().indexOf("calendar_") > -1 ||
                        idAttr == "addr" ||
                        idAttr === 'jpdy_topic_1'||
                        idAttr == "billCharge") {
                        return; 
                    }
                    
                    if ($App.isNewWinCompose()) {
                        // 不操作
                    } else {
                        $iframe.width($(document.body).width() - 214);
                    }
                }

            } catch (e) { }
        }
    },

    getIframe: function(){
        return this.el.firstChild || null;
    },

    /**
     *设置标题栏左侧图标状态
     *@param status {string} loading|error|hide
     */
    setTabStatus: function (status) {
        //console.log("setTabStatus:" + status);
        var iframe = this.getIframe();
        if (iframe.id) {
            $App.getView("tabpage").tab.setStateIcon(iframe.id, status);
        }
        
        this.model.set("tabStatus", status);
    },

    getTabStatus: function(){
        return this.model.get("tabStatus");
    },

    /**
     *根据iframe的状态显示如loading图标
     */
    watchIframeStatus: function (module) {
        if (!SiteConfig.labelIframeLoadingRelease) {
            return;
        }
        if ($B.is.ie && $B.getVersion() < 9) {
            return;
        }
        var self = this;
        var iframe = this.getIframe();
        if (!iframe || iframe.id == "welcome") return;
        setTimeout(function () {
            checkFinish("settimeout");//防止类似ie11超快加载，来不及捕获onload
        }, 100);
        setTimeout(function () {
            if (self.getTabStatus()=="error") {
                module.isRendered = false;
            }
        }, 10000);
        var win = iframe.contentWindow;
        iframe.onload = function () {//bind load会触发2次
            checkFinish("onload");
        };
        if (isLocalPage()) {
            $Timing.waitForReady(function () {
                return win.document.domain === document.domain
            }, function () {
                $(win.document).ready(checkFinish);
            });
        }
        function isLocalPage() {
            //要确保非本域iframe 不检查同域（如飞信，微博等）
            var url = iframe.src;
            if (/^\/|http:\/\/(appmail\d+|rm|app|smsrebuild\d+|subscribe\d+|html5)\.mail\./.test(url) && url.indexOf('/m2012') > -1) {
                if (url.indexOf("inner/reader/index") >= 0 || url.indexOf("voiceMail") >= 0) {//云邮局的页面没加domain，特殊处理下
                    return false;
                }
                return true;
            } else {
                return false;
            }
        }
        function checkFinish(type) {
            var notCompleteTimer;
            if (isLocalPage()) {
                //定制的页面要检查对象可用而不是脚本有可访问性
                if ($Iframe.isAccessAble(iframe)) {
                    //html页中的健康检查代码
                    if (win.LoadStatusCheck) {
                        notCompleteTimer = setTimeout(showNotCompleteTip, 3000);
                        $Timing.waitForReady(function () {
                            return win.LoadStatusCheck.isComplete() && self.checkIframeHealth(iframe);
                        }, function () {
                            clearTimeout(notCompleteTimer);
                            showOK();
                        });
                    } else {
                        if (self.checkIframeHealth(iframe)) {
                            showOK();
                        } else {
                            setTimeout(function () {
                                if (self.checkIframeHealth(iframe)) {
                                    showOK();
                                } else {
                                    showNotCompleteTip();
                                }
                            }, 3000);
                        }
                    }
                } else {
                    if (type == "onload") {
                        showError();
                    }
                }
            } else {
                //非同域名无法检测页面完成性
                showOK();
            }
        }
        function showOK() {
            self.setTabStatus("hide");
            $(self.el).find("div.ErrorTips,div.NoCompleteTips").hide();
            iframe.style.visibility = "";
        }
        function showError() {
            self.setTabStatus("error");
            $(self.el).find("div.ErrorTips").show().find("a").click(function () {
                $(this).unbind("click");
                reload();
            });
            iframe.style.visibility = "hidden";
            $App.trigger("httperror", {
                loadResourceError: true
            });
        }
        function showNotCompleteTip(){
            self.setTabStatus("error");
            var container = $(self.el).find("div.NoCompleteTips").show();
            container.find("a.Retry").click(function () {
                $(this).unbind("click");
                reload();
            });
            container.find("a.Close").click(function () {
                container.hide();
            });
            iframe.style.visibility = "";
            $App.trigger("httperror", {
                loadResourceError: true
            });
            if (self.iframeErrorLog) {
                M139.Logger.sendClientLog(self.iframeErrorLog);
            }
        }
        function reload() {
            iframe.src = iframe.src;
            $(self.el).find("div.ErrorTips,div.NoCompleteTips").hide();
        }
    },
    /**
     *检测iframe里的js和css加载正常
     */
    checkIframeHealth: function (iframe) {
        var self = this;
        var result = true;
        //高级浏览器才支持script onload,在index.html中loadScript的时候加的
        if (($B.is.ie && $B.getVersion() >= 9) || !!window.FormData) {
            (function () {
                var scripts = iframe.contentWindow.document.getElementsByTagName("script");
                for (var i = 0; i < scripts.length; i++) {
                    var js = scripts[i];
                    if (js.getAttribute("jsonload") === "0") {
                        result = false;
                        self.iframeErrorLog = { level: "ERROR", name: "JSLoadError", url: js.src };
                        return;
                    }
                }
                //windows下的safari，以及低版本的chrome和firefox不支持 css文件的onload事件，会产生误判 
                if (($B.is.chrome && $B.getVersion() < 25) || ($B.is.safari) || ($B.is.firefox && $B.getVersion() < 25)) {
                    return;
                }
                var links = iframe.contentWindow.document.getElementsByTagName("link");
                for (var i = 0; i < links.length; i++) {
                    var css = links[i];
                    if (css.parentNode && css.parentNode.tagName !== "HEAD") continue;
                    if (css.getAttribute("cssonload") === "0") {
                        result = false;
                        self.iframeErrorLog = { level: "ERROR", name: "CSSLoadError", url: css.href };
                        return;
                    }
                }
            })();
        }
        return result;
    }
});
﻿String.prototype.trim = function(){
	return this.replace(/^\s+|\s+$/g, "");
}

function TabLabel(container,context){
    this.win = window;
    this.doc = this.win.document;
    this.context=context;  //modelview的引用，避免依赖
    //this.id = "divTab";
	var ul=document.createElement("ul");
	//ul.className="tab";
	
	ul.innerHTML = '<li id="tabsMenuIco" class="noAll" tabindex="0" style="display:none"><a href="javascript:;" hidefocus="true" class="closeAll" title="点击查看更多"></a></li>';

	container.innerHTML="";
	container.appendChild(ul);
    this.main = ul;
    this.cur = null;
    this.tabs = [];
    this.group = [];
    this.count = 0;
    this.width = -1;
    this.max = 124;
    this.min = 90;
	this.playerWidth=0;
    this.history = [];
    this.call = [];
    this.init();
    //拖动初始化
    //DropAbledTabLabel.init(this);
}

TabLabel.prototype.init=fTabLabelInit;
TabLabel.prototype.add=fTabLabelAdd;
TabLabel.prototype.exist=fTabLabelExist;
TabLabel.prototype.del=fTabLabelDel;
TabLabel.prototype.active=fTabLabelActive;
TabLabel.prototype.title=fTabLabelTitle;
TabLabel.prototype.close=fTabLabelClose;
TabLabel.prototype.change=fTabLabelChange;
TabLabel.prototype.replace=fTabLabelReplace;
TabLabel.prototype.size=fTabLabelSize;
TabLabel.prototype.update=fTabLabelUpdate;
TabLabel.prototype.showPlayer = fTabLabelShowPlayer;
TabLabel.prototype.setStateIcon = fTabLabelSetStateIcon;

function fTabLabelSetStateIcon(id, state) {
    var classes = {
        "loading": "error-loading",
        "error": "error-tab",
        "cluster": "i_m_rss",
	    "uploading": "write-loading"
    }
    var el = this.tabs[id] && this.tabs[id].firstChild;
    if (el && el.tagName == "I") {
        if (state == "hide") {
            el.style.display = "none";
        } else {
            el.className = classes[state];
            if (state == "cluster") {
                $(el).css({ left: "3px", top: "9px" });
            }
            el.style.display = "";
        }
    }
}
function fTabLabelShowPlayer(show){
	if(show){
		this.playerWidth=240;
		
	}else{
		this.playerWidth=0;
	}
	if(top.MM){
		top.MM.resize();
		top.MM.onShow();
	}
	
	
	
}
function fTabLabelInit(){
    try {
        //this.main = this.doc.getElementById(this.id);
        var w = 720; // 208 130
        //this.main.style.width  = w+30+"px";    
        this.width = w; 
    } 
    catch (e) {
        alert(frameworkMessage.TablabelError, e);
    }
}


function specialTreatments(ao,tab,_this) {
    /* 标签的特殊处理 */

    //#region 日历calendar
    if (ao.name == "calendar") {
        var key = "calendar_version";
        var oldVer = $Cookie.get(key) || "",
            newVer = top.SiteConfig[key] || "";
        if (!!newVer && oldVer != newVer) {
            //有更新
            $(tab).append('<i class="i_newsL" key="' + key + '" value="' + newVer + '"></i>');
        }
    }
    //#endregion
}

function fTabLabelAdd(ao, deactivate, isHeaderTab) {
    var v = this;
    var win = this.win;
    var id = ao.name;
    var tab, dvl, dvm, dvr, a;
	//ao.text=Utils.htmlEncode(ao.text);
	tab = this.doc.createElement('li');
	tab.setAttribute("tabid", id);
    tab.setAttribute("role","tab");
    tab.setAttribute("tabindex","0");

	var text = $T.Html.encode(ao.text);
	var orignTabsData = this.context.model.getFixedTabsData();
	
	function noClose(){ //是否可以关闭

		//特殊业务，移动用户固定标签收件箱可以关闭，非移动用户不能关闭
	    if (id === 'welcome' || id === 'mailbox_1' || $.inArray(id, orignTabsData) > -1) {
			return true;
		}
	}
	//如果是云邮件，加图标
//	if(id == "googSubscription"){
//		icon2 = '<i class="i_m_rss"></i>';
//	}
    if (noClose()) {
        tab.className = deactivate ? "" : "on";
        tab.setAttribute("aria-selected", deactivate ? "false" : "true");
	    tab.innerHTML = "<i style='display:none;' class=\"error-loading\"></i><span>" + text + "</span>";
        
    }else{
        tab.className = deactivate?"":"on";
        tab.setAttribute("aria-selected", deactivate ? "false" : "true");
	    tab.innerHTML = "<i style='display:none;' class=\"error-loading\"></i>\
            <span>"+text+"</span>\
            <a href=\"javascript:;\" class=\"i_close\" title=\"关闭\"></a>";
    }

	tab.onmousedown = function (e) {
	    e = e || window.event;
	    var target = e.target || e.srcElement;
	    if (target.tagName == "A") return;
        var id = this.getAttribute("tabid");
        if (v.exist(id) == v.cur) {
            return;
        }
		
        v.active(id);
    }
  
	ao.text = ao.text || "";
    tab.title = ao.text;//.stripTags();
	
	if (!ao.close) {
	    var a_close = tab.getElementsByTagName("a")[0];
		tab.ondblclick = function(){
            if (a_close) {
                $(a_close).trigger("click");
            }
    	};
		if (a_close) {
		    a_close.onclick = function (e) {
		        //var id = this.parentNode.parentNode.getAttribute("tabid"); //找到标签上保存的模块id
		         var id = this.parentNode.getAttribute("tabid");
				//延迟移除 否则无法触发document的click事件
				_delTab(id);
		    };
		}
	}
	
	
	
	//删除固定标签
	var delTabId = 'delOrignTab_' + id;
	$App.off(delTabId).on(delTabId ,function(){
		var flag = true;
		if(id === 'welcome'){
			flag = false;
		}
		if(id.indexOf("mailbox_") > -1 && !$User.isChinaMobileUser()){
			flag = false;
		}
		
		flag && _delTab(id);
		console.log(id);
	});
	
	function _delTab(id){
		setTimeout(function () {
			if (v.call[2].call(v.context, id)) {
				v.del(id);
			}
		}, 0);
	}

	/** 
	* 插入标签有两种情况：
	* 1、普通在尾部插入节点 
	* 2、固定标签设置时在头部插入节点 
	*/
    if(!isHeaderTab){
		$('#tabsMenuIco').before(tab);
	}else{
		$(this.main).find('li:eq(0)').after(tab); //固定标签显示,这里无问题
	}
	$('#tabsMenuList').hide(); //隐藏下拉菜单

	this.tabs[id] = tab;
    if (!deactivate) {
        this.active(id);
    }
    this.count++;
    this.size();
	
	//特殊切换
	var replaceReg = /myMag|myCollect|googSubscription|myCloudSubscribe/i;
	if(replaceReg.test(ao.name)){
		ao.group = "subscribe";
		ao.name = "精品订阅";
	}
	
    if (ao.group) { //存在分组的情况，进行替换
		
        var group = this.group[ao.group];
        if (group && group != id && this.exist(group)) {
        	this.call[2].call(this.context, group);
            this.replace(group, id);
        }
        this.group[ao.group] = id;
    }
    //扩展标签页支持拖拽
    //DropAbledTabLabel.bindItemBehavior(tab);

    //标签的特殊处理
    specialTreatments(ao, tab, this);
}

//这个对象让标签页支持拖动
var DropAbledTabLabel = {
	//绑定容器
	init:function(tabObj){
		this.tabObj = tabObj;
		var ul = tabObj.main;
		this.majia_ul = ul.cloneNode(false);
		this.majia_ul.style.position = "absolute";
		this.jMajia_ul = $(this.majia_ul);
		ul.parentNode.appendChild(this.majia_ul);
	},
	//处理标签页行为
	bindItemBehavior:function(li){
		var This = this;
		$(li).mousedown(function(e){
			if(e.target.tagName=="A")return;
			This.onMouseDown(this,e);
	    });
	},
	onMouseDown:function(sender,e){
		var This = this;
		//将马甲ul清空
    	this.majia_ul.innerHTML = "";
    	//复制被点击的标签页元素li并添加到马甲ul中
    	var node = sender.cloneNode(true);
    	this.majia_ul.appendChild(node);
    	//$(node).find("p").html("哈哈哈哈");
    	
    	//复制被点击的li的x坐标
    	//因为ul是相对父元素定位的，所以left要减去父元素的left
    	var parentLeft = $(this.tabObj.main).offset().left;
    	var startLeft = $(sender).offset().left-parentLeft;
    	$(this.majia_ul).css("left",startLeft);
    	
    	this.majia_ul.style.visibility = "hidden";
    	this.current_li = sender;
    	
    	//鼠标移动的拖动效果
    	var startX = e.clientX;
    	var lastX = e.clientX;
    	$(document).mousemove(onMouseMove);
    	$(document).mouseup(onMouseUp);
    	GlobalDomEvent.on("mouseup",onGlobalMouseUp);
    	function clearEvents(){
    		$(document).unbind("mousemove",onMouseMove).unbind("mouseup",onMouseUp);
    		GlobalDomEvent.un("mouseup",onGlobalMouseUp)
    	}
    	function onGlobalMouseUp(e){
    		clearEvents();
    		This.moveEnd();
    	}
    	function onMouseUp(e){
    		clearEvents();
    		This.moveEnd();
    	}
    	function onMouseMove(e){
    		//当开始拖动的时候，隐藏被点击的li，显示马甲li
    		sender.style.visibility = "hidden";
    		This.majia_ul.style.visibility = "";
    		var newX = e.clientX;
    		//x轴平移
    		This.jMajia_ul.css("left",parseInt(This.majia_ul.style.left) + newX - lastX);
    		lastX = newX;
    		Utils.stopEvent(e);
    		This.testTabResort();
    		
    		if($.browser.msie && e.clientY<10){
    			clearEvents();
        		This.moveEnd();
    		}
    		
    		return false;
    	}
	},
	moveEnd:function(){
		this.majia_ul.innerHTML = "";
		//恢复被隐藏的li
		if(this.current_li)this.current_li.style.visibility = "";
	},
	//测试标签页是否重新排序
	testTabResort:function(){
		var changeX = this.jMajia_ul.offset().left - $(this.current_li).offset().left;
		//console.log("changeX:"+changeX);
		var count = Math.round(changeX / $(this.current_li).width());//可优化性能
		//console.log("count:"+count);
		if(count==0)return;
		if(count>0){
			var obj = this.current_li;
			for(var i=0;i<count && obj.nextSibling;i++){
				obj = obj.nextSibling;
			}
			$(obj).after(this.current_li);
		}else{
			count = -count;
			var obj = this.current_li;
			for(var i=0;i<count && obj.previousSibling;i++){
				obj = obj.previousSibling;
			}
			$(obj).before(this.current_li);
		}
	}
}


function fTabLabelExist(id){
    var tab = this.tabs[id];
    if (tab && tab.nodeType && tab.getAttribute("tabid")) {
        return tab;
    }
    return null;
}

function fTabLabelDel(id){
    var tab = this.exist(id);
    if (!tab) {
        //ch("Tab Del Error", null);
        return;
    }
    if (this.cur == tab) {
        this.cur = null;
    }
    this.main.removeChild(tab);
    delete this.tabs[id];
    this.count--;
    this.size();
    if (this.call[0]) {
        this.call[0].call(this.context,id);
    }
    this.update(id, false);
    if (!this.cur && this.history.length) {
        tab = this.history[this.history.length - 1];
        this.history.length--;
        if (tab == "welcome") { tab = "mailbox_1";}
        this.active(tab);
    }   
    // 控制标签管理菜单显示隐藏
    if ($App.getView('tabpage').tab.count > 5) {
        $('#tabsMenuIco').show();
    } else {
        $('#tabsMenuIco').hide();
    }
}

function fTabLabelActive(id,raiseEvent){

    var tab = this.exist(id);
    if (!tab) {
        //ch("Tab Active Error", null);
		//alert(frameworkMessage.TablabelNoTabError);
        return;
    }
    if (this.call[1]) {
        if (!this.call[1].call(this.context,id)) { //执行modelview.onActive
            return false;
        }
    }    
    if (this.cur) {    
        setActive(this.cur, false);
    }
    this.cur = tab;
    setActive(tab, true);
    this.update(id, true);
	
    function setActive(tab, visible)
    {
        if (visible)	//获得焦点
        {
            var id = tab.getAttribute("tabid");
            tab.className = "on";
            tab.setAttribute("aria-selected","true");
        
            if (id == "welcome")            
            { 
				tab.className = "home on";
            }else{
                tab.className = "on";
            }
        }
        else	//失去焦点
        {
            var id1 = tab.getAttribute("tabid");
            if (id1 == "welcome")
            {
				tab.className = "home";
    
            }else{
				tab.className = "";
            }
			tab.setAttribute("aria-selected","false");
            
        }
    }
}

function fTabLabelTitle(id, title){
    var tab = this.exist(id);
    if (!tab) {
        //ch("Tab Title Error", null);
        return;
    }
    var txt = tab.getElementsByTagName("span")[0];

    if (title) {
        txt.innerHTML = $T.Html.encode(title);
        tab.title = title;//.stripTags();
    }
    else {
        var t = $T.Html.decode(txt.innerHTML);
        return t;//.stripTags();
    }
}

function fTabLabelClose(id){
    var tab = this.exist(id);
    if (tab) {
        $(tab).find(".i_close").trigger("click");
       
    }
    else {
        //ch("Tab Close Error", null);
    }
}

function fTabLabelChange(id, title, name){
    var tab = this.exist(id);
    if (!tab) {
        //ch("Tab Change Error", null);
        return;
    }
    if (title) {
        this.title(id, title);
    }
    delete this.tabs[id];
    tab.setAttribute("tabid", name);
    this.tabs[name] = tab;
    var i, l = this.history.length;
    for (i = 0; i < l; i++) {
        if (this.history[i] == id) {
            this.history[i] = name;
            break;
        }
    }
}

function fTabLabelReplace(oldId, newId){
    var tab = this.exist(oldId) && this.exist(newId);
    if (!tab) {
        //ch("Tab Replace Error", null);
        return;
    }
    var title = this.title(newId);
    this.cur = this.exist(oldId);
    this.del(newId);
    this.change(oldId, title, newId);
    this.active(newId);
}

function fTabLabelSize(w){
    var tab, i, k = 7;
    if (w) {
        this.width = w;
    }else{
        var searchBarWidth=30; //275=搜索栏+关闭全部按钮的宽度
        this.width = $D.getWinWidth() - searchBarWidth - this.max;//210=左侧 文件夹的宽度
    }
    if ((this.count - 1) * this.max > this.width) {
        this.min =Math.floor(this.width/(this.count - 1));
        //this.min = Math.floor((this.width - this.count * k) / this.count);
    }
    else {
        this.min = this.max;
    }
    for (i in this.tabs) {
        tab = this.exist(i);
        if (tab){
            //tab.style.width=this.min-21+"px";
            var m= $(tab).text() == '收件箱' ? (this.max - 33) : (this.min-33); //33=标签页左右两边之和
            if(m<0.5){m=0;} //最小宽度为0，标签再多的话会溢出显示区域，无解
            //if(tab.getAttribute("tabid")!="welcome"){
                tab.style.width=m+"px";
            //}
        
        }
    }
}

function fTabLabelUpdate(id, flag){
    var i, l = this.history.length;
    var t, a = [];
    for (i = 0; i < l; i++) {
        t = this.history[i];
        if (t != id) {
            a[a.length] = t;
        }
    }
    if (flag) {
        a[a.length] = id;
    }
    this.history = a;
}

var appView = null;//主视图
$App={};
$(function(){

    appView = $App = new M2012.MainApplication();
    $App.run();
});





