String.prototype.trim = function(){
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
