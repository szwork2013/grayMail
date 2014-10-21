/**������
 * @tiexg
 */
Utils={
	offsetHost:function(host,elem,position){//�����������jquery
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
//�첽�ȴ�������ã�Ȼ��ִ�лص�
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
			//�����в�����
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
//��ȡevent����,��Ҫ���ڼ���firefox
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
//ֹͣ�¼�ð��
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
//����¼�
Utils.addEvent=function(obj,eventName,func){
	if(obj.attachEvent){
		obj.attachEvent(eventName,func)
	}else{
		obj.addEventListener(eventName.substring(2),func,false);
	}
}
//ɾ���¼�
Utils.removeEvent=function(obj,eventName,func){
	if(obj.detachEvent){
		obj.detachEvent(eventName,func)
	}else{
		obj.removeEventListener(eventName.substring(2),func,false);
	}
}

//��ȡobject����ĳ���
Utils.getLength=function(obj){
var i=0;
for(elem in obj){
	i++;
}
return i;
}
//��objectת��Ϊ����
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
//���Ҹ��ڵ�
Utils.findParent=function(obj,tagName){
	while(obj.parentNode){
		if(obj.tagName.toLowerCase()==tagName.toLowerCase()){
			return obj;
		}
		obj=obj.parentNode;
	}
}
//�õ�Ԫ�صľ�������
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
//�ݹ������������ֵ�����ض�ֵ���ӽڵ�
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
//Ԥ����ͼƬ
Utils.preloadImages=function(){
	var imgs=[];
	for(var i=0;i<arguments.length;i++){
	    imgs[i]=new Image();
	    imgs[i].src=arguments[i];
	}
}

//��ʽ�����ڣ���yyyy-MM-dd
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
//�ж������Ĳ�ֵ
Utils.dayDiff=function(date1,date2){
		var t = date2.getTime() - date1.getTime(); 	//������
		var day=Math.round(t/1000/60/60/24);
		if(day==0 || day==1){
			day=date1.getDate()==date2.getDate()?0:1;
		}
		return day;
}
//��coremail���ַ�����ʾ������ת��ΪDate���ͣ�
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

//��ʽ���ַ���,֧��array��object��������Դ
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

//�õ��ַ�����ǰn���ַ���1�������൱�������ַ���һ��Ӣ����ĸ�൱��1���ַ���
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

Utils.getEmail=function(email){//�ӷ���������ȡ�ʼ���ַ������
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


//�ı����ý��㲢��λ��굽ĩβ
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

//����email��ַ
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


//2008-12-4 ��Ϊͳ��(��ҳ�ͻ�ӭҳ)
var behaviorList=[];
var behaviorTimer;
Utils.addEvent(document,"onclick",function (e){
    e=e||event;
    var target=e.srcElement || e.target;
    try{
        behaviorClick(target);
    }catch(e){}
});
//��ҳ���ش���ҳ��
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
                behavior=target.id=="adHolder1"?"���»":"���乫��";
                break;
            }
            if(win && win.document.title=="д��" && (target.id=="btnSMS" || target.id=="btnMMS")){
                behavior=target.id=="btnSMS"?"���ŷ���":"���ŷ���";
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
        behaviorCongfigDoc=$(Utils.getXmlDoc(BehaviorConfig));//�Ȱ�����xmlת����jquery�йܵ�xml�ĵ�
    }
    //behavior�ڵ�
    var behaviorNode=behaviorCongfigDoc.find("behavior[@key='{0}']".format(behaviorKey));
    
    if(behaviorNode.length==0){
        Debug.write("[��Ϊͳ��]������:��{0}��,�Ҳ�����Ԫ�ص����ñ��,�������Ƴ�".format(behaviorKey),"blue");
        return;
    }
    extendID=behaviorNode.attr("extendID");
    //�������չ��
    if(extendKey){
        //extend�ڵ�
        var extendNode=behaviorNode.find("extend[@key='{0}']".format(extendKey));
        if(extendNode.length==0){
            extendNode=behaviorCongfigDoc.find("behavior[@key='{0}']".format(extendKey));
            if(extendNode.length==0){
                extendNode=behaviorCongfigDoc.find("extend[@key='{0}']".format(extendKey));
                if(extendNode.length==0){
                    Debug.write("[��Ϊͳ��]������:��{0}��,�Ҳ�����Ԫ�ص����ñ��,�������Ƴ�".format(extendKey),"blue");
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
    <module key="�ɹ��Ķ��ʼ�" id="11" />\
    <module key="�ɹ������������" id="12" />\
    <module key="�������Ӫ�����ӵ���Ϊ" id="13" />\
    <module key="��������������Ϊ" id="14" />\
    <module key="ʹ��������ֵ������" id="25" />\
  </modules>\
  <behaviors>\
    <behavior id="1101" module="�ɹ������������" key="����������" />\
    <behavior id="1102" module="�������Ӫ�����ӵ���Ϊ" key="���ֵȼ�" />\
    <behavior id="1103" module="�������Ӫ�����ӵ���Ϊ" key="����" />\
    <behavior id="1104" module="�ɹ������������" key="��¼����֪ͨ" />\
    <behavior id="1115" module="�ɹ��Ķ��ʼ�" key="δ���ʼ�" />\
    <behavior id="1105" module="�ɹ������������" key="һ�����" />\
    <behavior id="1106" module="�ɹ������������" key="һ�����-��һ��" />\
    <behavior key="��ɫ�Ƽ�" >\
      <extend id="1160" key="����֪ͨ" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1161" key="ͨѶ¼ͬ��" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1162" key="��ȡwap��ַ" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1163" key="PushEmail" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1164" key="�ճ�����" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1165" key="�ʼ�����" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1166" key="������ǩ" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1167" key="��Ѷ����" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1168" key="����ר��" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1169" key="���Űٱ���" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1170" key="���Ųֿ�" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1171" key="�ֻ�����" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1172" key="������԰" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1173" key="һ�����" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1174" key="��ͥ����" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1175" key="ħ��" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1176" key="ף���ؿ�" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1176" key="���ֺؿ�" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1177" key="����Ӫҵ��" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1178" key="�������" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1179" key="��д����" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1180" key="��д����" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1181" key="������ֽ" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1114" key="�й��ƶ�" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1137" extendID="2" key="COCO�ͻ���" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1185" extendID="1" key="�ҹ�������һ��" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1185" extendID="2" key="�ֻ���" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1185" extendID="3" key="�ֻ�֤ȯ" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1185" extendID="4" key="12530����" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1185" extendID="5" key="����" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1185" extendID="6" key="��������" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1185" extendID="7" key="�Ų��ܼ�" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1185" extendID="8" key="�˱�" module="�������Ӫ�����ӵ���Ϊ" />\
	  <extend id="1185" extendID="9" key="��������" module="�������Ӫ�����ӵ���Ϊ" />\
	  <extend id="1185" extendID="10" key="����Ӫ��1" module="�������Ӫ�����ӵ���Ϊ" />\
	  <extend id="1185" extendID="11" key="����Ӫ��2" module="�������Ӫ�����ӵ���Ϊ" />\
	  <extend id="1185" extendID="12" key="����Ӫ��3" module="�������Ӫ�����ӵ���Ϊ" />\
	  <extend id="1185" extendID="13" key="����Ӫ��4" module="�������Ӫ�����ӵ���Ϊ" />\
	  <extend id="1185" extendID="14" key="����Ӫ��5" module="�������Ӫ�����ӵ���Ϊ" />\
	  <extend id="1185" extendID="15" key="139����" module="�������Ӫ�����ӵ���Ϊ" />\
	  <extend id="1185" extendID="16" key="ʵ�ù���" module="�������Ӫ�����ӵ���Ϊ" />\
	  <extend id="1185" extendID="17" key="�������" module="�������Ӫ�����ӵ���Ϊ" />\
    </behavior>\
    <behavior id="1174" key="��ͥ����" module="�������Ӫ�����ӵ���Ϊ" />\
    <behavior id="1107" module="�������Ӫ�����ӵ���Ϊ" key="���»"/>\
    <behavior id="1108" module="�������Ӫ�����ӵ���Ϊ" key="���乫��"/>\
    <behavior id="1109" module="�ɹ������������" key="��������" />\
    <behavior id="1110" module="��������������Ϊ" key="����" />\
    <behavior id="1111" module="��������������Ϊ" key="ũ������" />\
    <behavior id="1112" module="��������������Ϊ" key="��������" />\
    <behavior id="1113" module="�������Ӫ�����ӵ���Ϊ" key="�Ƽ�����" />\
    <behavior id="1114" module="�������Ӫ�����ӵ���Ϊ" key="�й��ƶ�" />\
    <behavior id="1206" module="��������������Ϊ" key="����" />\
    <behavior key="����ͼ��" >\
      <extend id="1130" key="��������" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1131" key="�������" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1132" key="��д����" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1133" key="��д����" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1134" key="�˵�Ͷ��" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1135" key="�ʼ�����֪ͨ" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1136" key="PushEmail" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1137" extendID="1" key="COCO�ͻ���" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1138" key="���Űٱ���" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1139" key="���Ųֿ�" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1185" extendID="8" key="�˱�" module="�������Ӫ�����ӵ���Ϊ" />\
      <extend id="1166" key="������ǩ" module="�������Ӫ�����ӵ���Ϊ" />\
    </behavior>\
    <behavior id="1201" module="�ɹ������������" key="����" />\
    <behavior id="1202" module="�ɹ������������" key="����" />\
    <behavior id="1203" module="��������������Ϊ" key="�ʼ�����" />\
    <behavior id="1204" module="��������������Ϊ" key="�߼�����" />\
    <behavior id="1205" extendID="1" module="�������Ӫ�����ӵ���Ϊ" key="����" />\
    <behavior id="1230" module="�ɹ��Ķ��ʼ�" key="����" />\
    <behavior id="1005" module="��������������Ϊ" key="д��" />\
    <behavior id="1003" module="�ɹ��Ķ��ʼ�" key="�ռ���" />\
    <behavior id="1231" module="��������������Ϊ" key="�ݸ���" />\
    <behavior id="1008" module="��������������Ϊ" key="�ѷ���" />\
    <behavior id="1007" module="��������������Ϊ" key="��ɾ��" />\
    <behavior id="1232" module="��������������Ϊ" key="��ɾ��-���" />\
    <behavior id="1233" module="��������������Ϊ" key="�����ʼ�" />\
    <behavior id="1234" module="��������������Ϊ" key="�����ʼ�-���" />\
    <behavior id="1235" module="��������������Ϊ" key="�����ʼ�" />\
    <behavior id="1236" module="��������������Ϊ" key="�����ʼ�-���" />\
    <behavior id="1237" module="��������������Ϊ" key="��ʱ�ʼ�" />\
    <behavior id="1244" module="��������������Ϊ" key="�˵�Ͷ��" />\
    <behavior id="1245" module="ʹ��������ֵ������" key="��Ʒ����" />\
    <behavior id="1012" module="��������������Ϊ" key="�ҵ��ļ���" />\
    <behavior id="1238" module="�ɹ������������" key="�½��ļ���" />\
    <behavior id="1025" module="�ɹ��Ķ��ʼ�" key="�����ʼ�" />\
    <behavior id="1006" module="�ɹ������������" key="ͨѶ¼" />\
    <behavior id="1019" module="�ɹ������������" key="PushEmail" />\
    <behavior id="1010" module="ʹ��������ֵ������" key="������" />\
    <behavior id="1009" module="ʹ��������ֵ������" key="������" />\
    <behavior id="1016" module="ʹ��������ֵ������" key="�ֻ�����" />\
    <behavior id="1240" module="ʹ��������ֵ������" key="�ƶ�����" />\
    <behavior id="1239" module="ʹ��������ֵ������" key="���Ų���" />\
    <behavior id="1241" module="ʹ��������ֵ������" key="������" />\
    <behavior id="1462" module="ʹ��������ֵ������" key="���ŷ���" />\
    <behavior id="1464" module="ʹ��������ֵ������" key="���ŷ���" />\
    <behavior id="1468" module="�ɹ������������" key="д��ҳͨѶ¼" />\
    <behavior id="1205" extendID="2" module="��������������Ϊ" key="����-������������" />\
    <behavior id="1243" module="��������������Ϊ" key="����-Ԥ������" />\
    <behavior id="1173" extendID="2" module="��������������Ϊ" key="����ר��-һ�����" />\
    <behavior id="1182" extendID="2" module="��������������Ϊ" key="����ר��-��������" />\
    <behavior id="1172" extendID="2" module="��������������Ϊ" key="����ר��-������԰" />\
    <behavior id="1184" extendID="2" module="��������������Ϊ" key="����ר��-������̨" />\
    <behavior id="1175" extendID="2" module="��������������Ϊ" key="����ר��-ħ��" />\
  </behaviors>\
</behaviorConfig>';



//������
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
            alert("����������");
        }
    },
    init:function(){
        if(this.inited)return;
        this.inited=true;
        this.container=$("<div style='position:absolute;left:10px;top:10px;\
        width:300px;background:white;z-index:99999;\
        border:1px solid black;'><p style='margin:0;padding:3px;\
        width:100%;background:skyblue;color:white'>���Դ���</p><ul style='height:300px;overflow-x:hidden;overflow-y:auto;'></ul></div>")
        .appendTo(document.body);
        this.content=this.container.find("ul").eq(0);
        new DragManager(this.container[0],this.container.find("p")[0]);
    },
    start:function(){
        this.init();
        this.isDebugging=true;
    }
}
