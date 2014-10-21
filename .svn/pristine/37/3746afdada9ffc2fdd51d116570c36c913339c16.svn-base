/**工具类
 * @tiexg
 */
Utils={
	offsetHost:function(host,elem,position){//这个函数依赖jquery
	    var offset=$(host).offset();
	    var left=offset.left;
	    var top=offset.top;
	    switch(position){
	        case "top":{
	            elem.style.left=left+"px";
	            elem.style.top=top-elem.offsetHeight+"px";
	            break;
	        }
	        case "left":{
	            elem.style.left=left-elem.offsetWidth+"px";
	            elem.style.top=top+"px";
	            break;
	        }
	        case "right":{
	            elem.style.left=left+host.offsetWidth+"px";
	            elem.style.top=top+"px";
	            break;
	        }
	        default:{
	            elem.style.left=left+"px";
	            elem.style.top=top+host.offsetHeight+"px";
	            break;
	        }
	    }
	},
	htmlEncode:function(str){
		str = str.replace(/&/g,"&amp;");
		str = str.replace(/</g,"&lt;");
		str = str.replace(/>/g,"&gt;");
		str = str.replace(/\"/g,"&quot;");
		str = str.replace(/ /g,"&nbsp;");
		return str;
	},
	htmlDecode:function(str){
		str = str.replace(/&amp;/g,"&");
		str = str.replace(/&lt;/g,"<");
		str = str.replace(/&gt;/g,">");
		str = str.replace(/&quot;/g,"\"");
		str = str.replace(/&nbsp;/g," ");
		return str;
	},
	
	getFileNameByPath:function(path){
		var fileName = "";
		var charIndex = path.lastIndexOf("\\");
		if(charIndex != -1)
		{
			fileName = path.substr(charIndex + 1);
		}
		return fileName;
	},		
	requestByScript:function(scriptId,dataHref,callback,charset,retry){
        var isReady=false;
        if(callback){
            if(typeof(callback)=="string"){
                charset=callback;
                callback=null;
            }
        }
	    var head = document.getElementsByTagName("head")[0];
	    var objScript = document.getElementById(scriptId);
	    if(objScript && !document.all){
	        objScript.src="";
	        objScript.parentNode.removeChild(objScript);
	        objScript=null;
	    }
	    if(objScript != null){
	        if(dataHref.indexOf("?")==-1)dataHref+="?";
            dataHref+="&"+Math.random();
	        objScript.src=dataHref;
		    var dataScript =objScript;
	    }else{
	        var dataScript = document.createElement("script");
	        dataScript.id		= scriptId;
	        if(charset){
	            dataScript.charset=charset;
	        }else{
	            dataScript.charset	= "GB2312";
	        }
	        dataScript.src		= dataHref;
	        dataScript.defer	= true;
	        dataScript.type		= "text/javascript";
	        head.appendChild(dataScript);
	    }
	    if(document.all){
		    dataScript.onreadystatechange=function(){
			    if(dataScript.readyState == "loaded" || dataScript.readyState == "complete"){
			        isReady=true;
				    if(callback)callback();
			    }
		    }
	    }else{
		    dataScript.onload = function(){
		        isReady=true;
			    if(callback)callback();
		    }
	    }
	    
	    if(retry){
            setTimeout(function(){
                if(retry.times>0 && !isReady){
                    retry.times--;
                    if(dataHref.indexOf("?")==-1)dataHref+="?";
                    dataHref+="&"+Math.random();
                    Utils.requestByScript(scriptId,dataHref,callback,charset,retry);
                }
            },retry.timeout);
	    }
    }
}
//异步等待对象可用，然后执行回调
Utils.waitForReady=function(query,callback,win){
	var tryTimes=0;
	var done=false;
	checkReady();
	if(!done){
	    var intervalId=setInterval(checkReady,300);
	}
	function checkReady(){
		tryTimes++;
		try{
			var result;
			if(win!=undefined){
				result=win.document.getElementById(query);
			}else{
				result=eval(query);
			}
			
			if(result || tryTimes>200){
			    done=true;
				if(intervalId)clearInterval(intervalId);
				callback();
			}
		}catch(ex){
			//对象尚不可用
		}
	}
	
}
Utils.queryString = function(param, url) {
    if (!url) {
        url = location.search;
    }
    var reg = new RegExp("[?#&]" + param + "=([^&]*)", "i");
    var svalue = url.match(reg);
    var result = svalue ? unescape(svalue[1]) : null;
    if (!result && location.hash) {
        svalue = location.hash.match(reg);
        result = svalue ? unescape(svalue[1]) : null;
    }
    return result;
}
//获取event对象,主要用于兼容firefox
Utils.getEvent=function(A){
  var evt=A||window.event;
  if(!evt){
    var arr=[],C=this.getEvent.caller;
    while(C){
      evt=C.arguments[0];
      if(evt && (evt.constructor.target || evt.srcElement)){
	  //if(evt && evt.constructor==Event){
        break ;
      }
      var B=false;
      for(var D=0;D<arr.length;D++){
        if(C==arr[D]){
          B=true;
          break ;
        }
      }
      if(B){
        break ;
      }else {
        arr.push(C);
      }
      C=C.caller;
    }
  }
  return evt;
}
//停止事件冒泡
Utils.stopEvent=function(e){
  if(!e){
    e=this.getEvent();
  }
  if(e.stopPropagation){
    e.stopPropagation();
    e.preventDefault();
  }else {
    e.cancelBubble=true;
	e.returnValue=false;
  }
}
//添加事件
Utils.addEvent=function(obj,eventName,func){
	if(obj.attachEvent){
		obj.attachEvent(eventName,func)
	}else{
		obj.addEventListener(eventName.substring(2),func,false);
	}
}
//删除事件
Utils.removeEvent=function(obj,eventName,func){
	if(obj.detachEvent){
		obj.detachEvent(eventName,func)
	}else{
		obj.removeEventListener(eventName.substring(2),func,false);
	}
}

//获取object对象的长度
Utils.getLength=function(obj){
var i=0;
for(elem in obj){
	i++;
}
return i;
}
//将object转换为数组
Utils.toArray=function(obj,nameFlag){
var arr=new Array();
for(elem in obj){
	if(nameFlag){
		arr.push(elem);
	}else{
		arr.push(obj[elem]);
	}
	
}
return arr;
}
//查找父节点
Utils.findParent=function(obj,tagName){
	while(obj.parentNode){
		if(obj.tagName.toLowerCase()==tagName.toLowerCase()){
			return obj;
		}
		obj=obj.parentNode;
	}
}
//得到元素的绝对坐标
Utils.findPosition=function(obj) {
	var curleft = 0;
	var curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
	}
	/*while(obj.offsetParent){
		obj=obj.offsetParent;
		curleft += obj.offsetLeft;
		curtop += obj.offsetTop;
	}*/
	return [curleft,curtop];
}
//递归遍历查找属性值等于特定值的子节点
Utils.findChild=function(node,tagName,attrName,attrValue){
	var result=null;
	for (var i = 0; i < node.childNodes.length; i++) {
		var n = node.childNodes[i];
		if (n.nodeType == 1) {
			if(n.tagName.toLowerCase()==tagName.toLowerCase()){
				if(attrName){
					if (n.getAttribute(attrName) == attrValue) {
						return n;
					}
				}else{
					return n;	
				}
				
			}
			
			result=this.findChild(n,tagName,attrName, attrValue);
		}
	}
	return result;
}
//预加载图片
Utils.preloadImages=function(){
	var imgs=[];
	for(var i=0;i<arguments.length;i++){
	    imgs[i]=new Image();
	    imgs[i].src=arguments[i];
	}
}

//格式化日期，如yyyy-MM-dd
Date.prototype.format = function(format){
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format)) {
        format=format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }

    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
}
//判断天数的差值
Utils.dayDiff=function(date1,date2){
		var t = date2.getTime() - date1.getTime(); 	//相差毫秒
		var day=Math.round(t/1000/60/60/24);
		if(day==0 || day==1){
			day=date1.getDate()==date2.getDate()?0:1;
		}
		return day;
}
//将coremail的字符串表示的日期转化为Date类型，
Utils.parseDate=function(str){
        
           
        /*
		var tmpArr		= str.split(" ");
		var dateStr		= tmpArr[0];
		var tmpDateArr	= dateStr.split(".");
		var iYear		= tmpDateArr[0];
		var iMonth		= tmpDateArr[1];
		var iDate		= tmpDateArr[2];
		var timeStr		= tmpArr[1];
		var	tmpTimeArr	= timeStr.split(":");
		var iHour		= tmpTimeArr[0];
		var iMinute		= tmpTimeArr[1];
		*/
		var iYear		= str.getYear();
		var iMonth		= str.getMonth();
		var iDate		= str.getDate();
		var iHour		= str.getHours();
		var iMinute		= str.getMinutes();
	
		return new Date(iYear,iMonth - 1,iDate,iHour,iMinute);
}
Utils.getCookie=function(name) {
 var arr = document.cookie.match(new RegExp("(^|\\W)"+name+"=([^;]*)(;|$)"));
 if(arr != null)return unescape(arr[2]);
 return "";
}
Utils.setCookie=function(name,value)
{
document.cookie = name + " = " + escape ( value ) + "; path=/; "
//+window.location.host.match(/[^.]+\.[^.]+$/);
 +  " expires=" +    ( new Date ( 2099 , 12 , 31 ) ) . toGMTString();
 

}

//格式化字符串,支持array和object两种数据源
String.format = function(str,arr)
{
	if (arr.constructor == Array) {
		for (var i = 0; i < arr.length; i++) {
			var re = new RegExp('\\{' + (i) + '\\}', 'gm');
			str = str.replace(re, arr[i]);
		}
	}else{
		for(elem in arr) {
			var re = new RegExp('\\{' + elem + '\\}', 'gm');
			str = str.replace(re, arr[elem]);
		}
	}
    return str;
}

String.prototype.getBytes = function() {   
    var cArr = this.match(/[^\x00-\xff]/ig);   
    return this.length + (cArr == null ? 0 : cArr.length);   
}    

String.prototype.trim = function(){
	return this.replace(/^\s+|\s+$/g, "");
}
String.prototype.format=function(){
    var str=this;
    for(var i=0;i<arguments.length;i++){
        str=str.replace(eval("/\\{"+i+"\\}/g"),arguments[i]);
    }
    return str;
}

//得到字符串的前n个字符（1个汉字相当于两个字符，一个英文字母相当于1个字符）
String.prototype.getLeftStr = function(len,showSymbol){
	var leftStr = this;
	var curLen  = 0;
	for(var i=0;i<this.length;i++){
		curLen += this.charCodeAt(i)>255 ? 2 : 1;
		if(curLen > len){
			leftStr = this.substring(0,i);
			break;
		}else if(curLen == len){
			leftStr = this.substring(0,i + 1);
			break;
		}
	}
	if(showSymbol){
		if(leftStr != this){
			leftStr += "..."; 
		}
	}
	return leftStr;
}
String.prototype.$=function(from,to){
    if(!to){
        to=from;
        from=0;
    }
    var arr=[];
    for(var i=from;i<=to;i++){
        arr.push(this.replace(/\$i/g,i));
    }
    return arr;
}


Utils.checkEmail=function(email){
	var m=email.match(/^(\w+|-|\.)+@(\w+|-|\.)+[a-z]{2,3}$/);
	if(m){
		return true;
	}else{
		return false;
	}
}

Utils.getEmail=function(email){//从发件人中提取邮件地址和姓名
	var result=[];
	email=this.htmlDecode(email);
	var m=email.match(/"(.+?)"\W+<(\w+([.-]?\w)*@\w+([.-]?\w)*\.\w+([.-]?\w)*)>/i);
	if(m){
		result[0]=m[1];
		result[1]=m[2];
	}else{
		var idx=email.indexOf("@");
		result[0]=email.substr(0,idx);
		result[1]=email;
	}
	return result;
} 

Utils.loadSkinCss=function(path,doc,prefix,dir){
	if(!path){
		var skinCookie=Utils.getCookie("SkinPath");
		path=skinCookie||top.UserConfig["skinPath"]||"skin_xmas";
	}
	if(prefix){
		path=path.replace("skin",prefix+"_skin");
	}
	if(!doc){
		doc=document;
	}
	if(doc==top.document){
	    if(!window.cssTag){
	        document.write('<link id="skinLink" rel="stylesheet" type="text/css" href="{0}" />'.format(resourcePath+"/css/"+path+".css"));
	        window.cssTag=document.getElementById("skinLink");
	    }else{
	        window.cssTag.href=top.resourcePath+"/css/"+path+".css";
	    }
	}else{
	    var links=doc.getElementsByTagName("link");
	    for(var i=0;i<links.length;i++){
		    var l=links[i];
			if(!l.href){
				if(dir){
					l.href=dir+path+".css";
				}else{
					l.href=top.resourcePath+"/css/"+path+".css";
				}
				
			}else if(l.href.match(/skin_\w+.css$/)){
				l.href=l.href.replace(/skin_\w+/,path);
			}
			/*
		    if(!l.href||/\w+_\w+.css$/.test(l.href)){
		        if(window==window.top){
		            l.href=top.resourcePath+"/css/"+path+".css";
		        }else{
					if(l.href)
		            l.href=top.cssTag.href;
		        }
			    break;
		    }*/
	    }
	}
}

Utils.setDomain=function(){
    document.domain = window.location.host.match(/([^.]+\.[^.:]+):?\d*$/)[1];
}


//文本框获得焦点并定位光标到末尾
Utils.focusTextBox=function(objTextBox){
    try{
        if(document.all){
            var r =objTextBox.createTextRange();
            r.moveStart("character",objTextBox.value.length);
            r.collapse(true);
            r.select();
        }else{
            objTextBox.setSelectionRange(objTextBox.value.length,objTextBox.value.length);
            objTextBox.focus();
        }
    }catch(e){}
}

//解析email地址
Utils.parseEmail=function(text){
    var reg=/(?:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}|"[^"]*"\s?<[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}>)(?=;|,|$)/gi;
    var regName=/^"([^"]+)"|^([^<]+)</;
    var regAddr=/<?([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})>?/i;
    var matches=text.match(reg);
    var result=[];
    if(matches){
        for(var i=0,len=matches.length;i<len;i++){
            var item={};
            item.all=matches[i];
            var m=matches[i].match(regName);
            if(m)item.name=m[1];
            m=matches[i].match(regAddr);
            if(m)item.addr=m[1];
            if(item.addr){
                item.account=item.addr.split("@")[0];
                item.domain=item.addr.split("@")[1];
                if(!item.name)item.name=item.account;
                result.push(item);
            }
        }
    }
    return result;
}
Utils.testEmail=function(txt){
    var mailReg=/^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
    var mailRegExt=/^<[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}>$/i;
    txt=txt.replace(/"[^"]*"(?=\s*<)/g,"");
    var arr=txt.split(/[;,]/);
    for(var i=0;i<arr.length;i++){
        arr[i]=arr[i].trim();
        if(arr[i]=="")continue;
        if(mailReg.test(arr[i])||mailRegExt.test(arr[i])){
            continue;
        }else{
            Utils.testEmail.error=arr[i];
            return false;
        }
    }
    return true;
}
Utils.toogle=function(element,btn,cls1,cls2){
	element.style.display=element.style.display=="none"?"":"none";
	btn.className=btn.className==cls1?cls2:cls1;
}
Utils.setBodyFixToFrame=function(){
    document.body.style.height=window.frameElement.offsetHeight+"px";
}

String.prototype.encode=function(){
    return Utils.htmlEncode(this);
}
String.prototype.decode=function(){
    return Utils.htmlDecode(this);
}
Utils.getGB2312=function(str,callback){
	var i,c,ret="",strSpecial="!\"#$%&'()*+,/:;<=>?@[\]^`{|}~%";
	var url=resourcePath+"/js/gb2312.js"
	this.requestByScript("script_gb2312data",url,function(){
		for (i = 0; i < str.length; i++) {
			if (str.charCodeAt(i) >= 0x4e00) {
				c = Arr_GB2312[str.charCodeAt(i) - 0x4e00];
				ret += "%" + c.slice(0, 2) + "%" + c.slice(-2);
			}
			else {
				c = str.charAt(i);
				if (c == " ") 
					ret += "%20";
				else 
					if (strSpecial.indexOf(c) != -1) 
						ret += "%" + str.charCodeAt(i).toString(16);
					else 
						ret += c;
			}
		}
		callback(ret);
	})


}


Utils.getUserDataFromCookie=function(){
	var cookiesString=Utils.getCookie("UserData");
    if(cookiesString!=""){
 	    try{
		    UserData=eval("("+cookiesString+")");
		    UserData_bak=UserData;
	    }catch(ex){

	    }
     }
}
Utils.getXmlDoc=function(xml){
    if(document.all){
        var ax=new ActiveXObject("Microsoft.XMLDOM");
        ax.loadXML(xml);
        return ax;
    }
	var parser = new DOMParser();
	return parser.parseFromString(xml, "text/xml");
}


//2008-12-4 行为统计(首页和欢迎页)
var behaviorList=[];
var behaviorTimer;
Utils.addEvent(document,"onclick",function (e){
    e=e||event;
    var target=e.srcElement || e.target;
    try{
        behaviorClick(target);
    }catch(e){}
});
//首页加载代理页面
if(Utils.queryString("funcid")=="main"){
    Utils.setDomain();
    var htmlCode="<iframe id='webmailProxy' name='webmailProxy' onload='this.isReady=true' \
    style='display:none' src='{0}/proxy.htm' ></iframe>\
    <iframe id='ucProxy' name='ucProxy' onload='this.isReady=true' \
    style='display:none' src='{1}/proxy.htm' ></iframe>".format(webmailDomain,ucDomain);
    document.write(htmlCode);
}
function behaviorClick(target,win){
    if(window!=top){
        top.behaviorClick(target,window);
        return;
    }
    var behavior;
    var ext;
    if(target.getAttribute("behavior")){
        behavior=target.getAttribute("behavior");
        ext=target.getAttribute("ext");
    }else if(target.parentNode && target.parentNode.getAttribute && target.parentNode.getAttribute("behavior")){
        target=target.parentNode;
        behavior=target.getAttribute("behavior");
        ext=target.getAttribute("ext");
    }else if(target.tagName=="A" || (target.parentNode && target.parentNode.tagName=="A")){
        while(target){
            if(target.id=="adHolder1" || target.id=="adHolder2"){
                behavior=target.id=="adHolder1"?"最新活动":"邮箱公告";
                break;
            }
            if(win && win.document.title=="写信" && (target.id=="btnSMS" || target.id=="btnMMS")){
                behavior=target.id=="btnSMS"?"短信发送":"彩信发送";
                break;
            }
            target=target.parentNode;
        }
    }
    if(behavior){
        top.addBehavior(behavior,ext);
    }
}

function addBehavior(behaviorKey,extendKey){
    var bid,mid,extendID,behaviorNode,moduleKey;
    if(!window.behaviorCongfigDoc){
        behaviorCongfigDoc=$(Utils.getXmlDoc(BehaviorConfig));//先把配置xml转化成jquery托管的xml文档
    }
    //behavior节点
    var behaviorNode=behaviorCongfigDoc.find("behavior[@key='{0}']".format(behaviorKey));
    
    if(behaviorNode.length==0){
        Debug.write("[行为统计]捕获点击:【{0}】,找不到该元素的配置编号,可能已移除".format(behaviorKey),"blue");
        return;
    }
    extendID=behaviorNode.attr("extendID");
    //如果有扩展项
    if(extendKey){
        //extend节点
        var extendNode=behaviorNode.find("extend[@key='{0}']".format(extendKey));
        if(extendNode.length==0){
            extendNode=behaviorCongfigDoc.find("behavior[@key='{0}']".format(extendKey));
            if(extendNode.length==0){
                extendNode=behaviorCongfigDoc.find("extend[@key='{0}']".format(extendKey));
                if(extendNode.length==0){
                    Debug.write("[行为统计]捕获点击:【{0}】,找不到该元素的配置编号,可能已移除".format(extendKey),"blue");
                    return;
                }
            }
        }
        extendID=extendNode.attr("extendID");
        bid=extendNode.attr("id");
        moduleKey=extendNode.attr("module");
    }else{
        bid=behaviorNode.attr("id");
        moduleKey=behaviorNode.attr("module");
    }
    mid=behaviorCongfigDoc.find("module[@key='{0}']".format(moduleKey)).attr("id");
    if(!extendID){
        extendID=parseInt(behaviorCongfigDoc.find("behaviorConfig").attr("baseExtendID"));
    }else{
        extendID=parseInt(extendID)+parseInt(behaviorCongfigDoc.find("behaviorConfig").attr("baseExtendID"));
    }

    if (top.BH) {
        top.BH({
            actionId: bid,
            thingId: extendID,
            moduleId: mid
        });
    }
}

BehaviorConfig='<behaviorConfig timespan="60000" baseExtendID="8000">\
  <modules>\
    <module key="成功阅读邮件" id="11" />\
    <module key="成功变更邮箱设置" id="12" />\
    <module key="点击邮箱营销链接等行为" id="13" />\
    <module key="基础邮箱其它行为" id="14" />\
    <module key="使用邮箱增值服务功能" id="25" />\
  </modules>\
  <behaviors>\
    <behavior id="1101" module="成功变更邮箱设置" key="发件人姓名" />\
    <behavior id="1102" module="点击邮箱营销链接等行为" key="积分等级" />\
    <behavior id="1103" module="点击邮箱营销链接等行为" key="积分" />\
    <behavior id="1104" module="成功变更邮箱设置" key="登录短信通知" />\
    <behavior id="1115" module="成功阅读邮件" key="未读邮件" />\
    <behavior id="1105" module="成功变更邮箱设置" key="一键搬家" />\
    <behavior id="1106" module="成功变更邮箱设置" key="一键搬家-下一步" />\
    <behavior key="特色推荐" >\
      <extend id="1160" key="到达通知" module="点击邮箱营销链接等行为" />\
      <extend id="1161" key="通讯录同步" module="点击邮箱营销链接等行为" />\
      <extend id="1162" key="获取wap地址" module="点击邮箱营销链接等行为" />\
      <extend id="1163" key="PushEmail" module="点击邮箱营销链接等行为" />\
      <extend id="1164" key="日程提醒" module="点击邮箱营销链接等行为" />\
      <extend id="1165" key="邮件传真" module="点击邮箱营销链接等行为" />\
      <extend id="1166" key="网络书签" module="点击邮箱营销链接等行为" />\
      <extend id="1167" key="资讯中心" module="点击邮箱营销链接等行为" />\
      <extend id="1168" key="娱乐专区" module="点击邮箱营销链接等行为" />\
      <extend id="1169" key="短信百宝箱" module="点击邮箱营销链接等行为" />\
      <extend id="1170" key="彩信仓库" module="点击邮箱营销链接等行为" />\
      <extend id="1171" key="手机网盘" module="点击邮箱营销链接等行为" />\
      <extend id="1172" key="民生家园" module="点击邮箱营销链接等行为" />\
      <extend id="1173" key="一起玩吧" module="点击邮箱营销链接等行为" />\
      <extend id="1174" key="家庭邮箱" module="点击邮箱营销链接等行为" />\
      <extend id="1175" key="魔信" module="点击邮箱营销链接等行为" />\
      <extend id="1176" key="祝福贺卡" module="点击邮箱营销链接等行为" />\
      <extend id="1176" key="音乐贺卡" module="点击邮箱营销链接等行为" />\
      <extend id="1177" key="网上营业厅" module="点击邮箱营销链接等行为" />\
      <extend id="1178" key="设置相关" module="点击邮箱营销链接等行为" />\
      <extend id="1179" key="自写短信" module="点击邮箱营销链接等行为" />\
      <extend id="1180" key="自写彩信" module="点击邮箱营销链接等行为" />\
      <extend id="1181" key="春节信纸" module="点击邮箱营销链接等行为" />\
      <extend id="1114" key="中国移动" module="点击邮箱营销链接等行为" />\
      <extend id="1137" extendID="2" key="COCO客户端" module="点击邮箱营销链接等行为" />\
      <extend id="1185" extendID="1" key="找工作快人一步" module="点击邮箱营销链接等行为" />\
      <extend id="1185" extendID="2" key="手机报" module="点击邮箱营销链接等行为" />\
      <extend id="1185" extendID="3" key="手机证券" module="点击邮箱营销链接等行为" />\
      <extend id="1185" extendID="4" key="12530彩铃" module="点击邮箱营销链接等行为" />\
      <extend id="1185" extendID="5" key="飞信" module="点击邮箱营销链接等行为" />\
      <extend id="1185" extendID="6" key="无线音乐" module="点击邮箱营销链接等行为" />\
      <extend id="1185" extendID="7" key="号簿管家" module="点击邮箱营销链接等行为" />\
      <extend id="1185" extendID="8" key="账本" module="点击邮箱营销链接等行为" />\
	  <extend id="1185" extendID="9" key="开箱有礼" module="点击邮箱营销链接等行为" />\
	  <extend id="1185" extendID="10" key="节日营销1" module="点击邮箱营销链接等行为" />\
	  <extend id="1185" extendID="11" key="节日营销2" module="点击邮箱营销链接等行为" />\
	  <extend id="1185" extendID="12" key="节日营销3" module="点击邮箱营销链接等行为" />\
	  <extend id="1185" extendID="13" key="节日营销4" module="点击邮箱营销链接等行为" />\
	  <extend id="1185" extendID="14" key="节日营销5" module="点击邮箱营销链接等行为" />\
	  <extend id="1185" extendID="15" key="139社区" module="点击邮箱营销链接等行为" />\
	  <extend id="1185" extendID="16" key="实用工具" module="点击邮箱营销链接等行为" />\
	  <extend id="1185" extendID="17" key="都来玩吧" module="点击邮箱营销链接等行为" />\
    </behavior>\
    <behavior id="1174" key="家庭邮箱" module="点击邮箱营销链接等行为" />\
    <behavior id="1107" module="点击邮箱营销链接等行为" key="最新活动"/>\
    <behavior id="1108" module="点击邮箱营销链接等行为" key="邮箱公告"/>\
    <behavior id="1109" module="成功变更邮箱设置" key="天气城市" />\
    <behavior id="1110" module="基础邮箱其它行为" key="日期" />\
    <behavior id="1111" module="基础邮箱其它行为" key="农历黄历" />\
    <behavior id="1112" module="基础邮箱其它行为" key="邮箱容量" />\
    <behavior id="1113" module="点击邮箱营销链接等行为" key="推荐好友" />\
    <behavior id="1114" module="点击邮箱营销链接等行为" key="中国移动" />\
    <behavior id="1206" module="基础邮箱其它行为" key="反馈" />\
    <behavior key="点亮图标" >\
      <extend id="1130" key="邮箱类型" module="点击邮箱营销链接等行为" />\
      <extend id="1131" key="邮箱伴侣" module="点击邮箱营销链接等行为" />\
      <extend id="1132" key="自写短信" module="点击邮箱营销链接等行为" />\
      <extend id="1133" key="自写彩信" module="点击邮箱营销链接等行为" />\
      <extend id="1134" key="账单投递" module="点击邮箱营销链接等行为" />\
      <extend id="1135" key="邮件到达通知" module="点击邮箱营销链接等行为" />\
      <extend id="1136" key="PushEmail" module="点击邮箱营销链接等行为" />\
      <extend id="1137" extendID="1" key="COCO客户端" module="点击邮箱营销链接等行为" />\
      <extend id="1138" key="短信百宝箱" module="点击邮箱营销链接等行为" />\
      <extend id="1139" key="彩信仓库" module="点击邮箱营销链接等行为" />\
      <extend id="1185" extendID="8" key="账本" module="点击邮箱营销链接等行为" />\
      <extend id="1166" key="网络书签" module="点击邮箱营销链接等行为" />\
    </behavior>\
    <behavior id="1201" module="成功变更邮箱设置" key="设置" />\
    <behavior id="1202" module="成功变更邮箱设置" key="换肤" />\
    <behavior id="1203" module="基础邮箱其它行为" key="邮件搜索" />\
    <behavior id="1204" module="基础邮箱其它行为" key="高级搜索" />\
    <behavior id="1205" extendID="1" module="点击邮箱营销链接等行为" key="帮助" />\
    <behavior id="1230" module="成功阅读邮件" key="收信" />\
    <behavior id="1005" module="基础邮箱其它行为" key="写信" />\
    <behavior id="1003" module="成功阅读邮件" key="收件箱" />\
    <behavior id="1231" module="基础邮箱其它行为" key="草稿箱" />\
    <behavior id="1008" module="基础邮箱其它行为" key="已发送" />\
    <behavior id="1007" module="基础邮箱其它行为" key="已删除" />\
    <behavior id="1232" module="基础邮箱其它行为" key="已删除-清空" />\
    <behavior id="1233" module="基础邮箱其它行为" key="垃圾邮件" />\
    <behavior id="1234" module="基础邮箱其它行为" key="垃圾邮件-清空" />\
    <behavior id="1235" module="基础邮箱其它行为" key="病毒邮件" />\
    <behavior id="1236" module="基础邮箱其它行为" key="病毒邮件-清空" />\
    <behavior id="1237" module="基础邮箱其它行为" key="定时邮件" />\
    <behavior id="1244" module="基础邮箱其它行为" key="账单投递" />\
    <behavior id="1245" module="使用邮箱增值服务功能" key="精品订阅" />\
    <behavior id="1012" module="基础邮箱其它行为" key="我的文件夹" />\
    <behavior id="1238" module="成功变更邮箱设置" key="新建文件夹" />\
    <behavior id="1025" module="成功阅读邮件" key="代收邮件" />\
    <behavior id="1006" module="成功变更邮箱设置" key="通讯录" />\
    <behavior id="1019" module="成功变更邮箱设置" key="PushEmail" />\
    <behavior id="1010" module="使用邮箱增值服务功能" key="发短信" />\
    <behavior id="1009" module="使用邮箱增值服务功能" key="发彩信" />\
    <behavior id="1016" module="使用邮箱增值服务功能" key="手机网盘" />\
    <behavior id="1240" module="使用邮箱增值服务功能" key="移动助理" />\
    <behavior id="1239" module="使用邮箱增值服务功能" key="飞信操作" />\
    <behavior id="1241" module="使用邮箱增值服务功能" key="发传真" />\
    <behavior id="1462" module="使用邮箱增值服务功能" key="短信发送" />\
    <behavior id="1464" module="使用邮箱增值服务功能" key="彩信发送" />\
    <behavior id="1468" module="成功变更邮箱设置" key="写信页通讯录" />\
    <behavior id="1205" extendID="2" module="基础邮箱其它行为" key="传真-帮助中心链接" />\
    <behavior id="1243" module="基础邮箱其它行为" key="传真-预览发送" />\
    <behavior id="1173" extendID="2" module="基础邮箱其它行为" key="娱乐专区-一起玩吧" />\
    <behavior id="1182" extendID="2" module="基础邮箱其它行为" key="娱乐专区-商务社区" />\
    <behavior id="1172" extendID="2" module="基础邮箱其它行为" key="娱乐专区-民生家园" />\
    <behavior id="1184" extendID="2" module="基础邮箱其它行为" key="娱乐专区-动感舞台" />\
    <behavior id="1175" extendID="2" module="基础邮箱其它行为" key="娱乐专区-魔信" />\
  </behaviors>\
</behaviorConfig>';



//调试器
Debug={
    write:function(message,color){
        if(!top.Debug.isDebugging)return;
        if(window!=window.top){
            window.top.Debug.write(message,color);
            return;
        }
        try{
            this.content.find("li").css("background-color","white");
            var li=$("<li></li>").text(message).css("background-color","silver").appendTo(this.content);
            if(color)li.css("color",color);
            this.content.append("<hr />");
            this.content[0].scrollTop=1000000;
        }catch(e){
            alert("调试器错误");
        }
    },
    init:function(){
        if(this.inited)return;
        this.inited=true;
        this.container=$("<div style='position:absolute;left:10px;top:10px;\
        width:300px;background:white;z-index:99999;\
        border:1px solid black;'><p style='margin:0;padding:3px;\
        width:100%;background:skyblue;color:white'>调试窗口</p><ul style='height:300px;overflow-x:hidden;overflow-y:auto;'></ul></div>")
        .appendTo(document.body);
        this.content=this.container.find("ul").eq(0);
        new DragManager(this.container[0],this.container.find("p")[0]);
    },
    start:function(){
        this.init();
        this.isDebugging=true;
    }
}
