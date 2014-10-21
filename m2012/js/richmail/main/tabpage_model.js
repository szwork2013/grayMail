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