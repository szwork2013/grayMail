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
