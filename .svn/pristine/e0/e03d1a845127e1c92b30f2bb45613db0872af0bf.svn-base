if (!window.console) {
    console = {
        assert: function () { },
        count: function () { },
        debug: function () { },
        dir: function () { },
        dirxml: function () { },
        error: function () { },
        group: function () { },
        groupCollapsed: function () { },
        groupEnd: function () { },
        info: function () { },
        log: function () { },
        markTimeline: function () { },
        profile: function () { },
        profileEnd: function () { },
        time: function () { },
        timeEnd: function () { },
        timeStamp: function () { },
        trace: function () { },
        warn: function () { }
    }
}

/**
*framework用到的提示信息配置
*/
var UtilsMessage = 
{
		//Mail139_Matrix_F2010\trunk\src\html\m\coremailServer\options\forward.htm begin
		ForwardEmptyError:"邮箱地址不能为空",
		ForwardOneError:"很抱歉，只能转发到一个邮箱地址。",
		ForwardRightError:"请输入正确的邮箱地址（例：example@139.com）",
		ForwardSelfError:"转发用户不能填写自己的邮箱地址",
		//Mail139_Matrix_F2010\trunk\src\html\m\coremailServer\options\forward.htm end	
		
		//Mail139_Matrix_F2010\trunk\src\html\m\coremailServer\popfolder.htm begin
		PopfolderFulledError:"邮箱容量已满, 请清理过期邮件",
		PopfolderFullError:"邮箱容量将满,请及时清理",
		//Mail139_Matrix_F2010\trunk\src\html\m\coremailServer\popfolder.htm end
		
		//Mail139_Matrix_F2010\trunk\src\html\m\coremailServer\folder_sms.htm begin
		Folder_smsNoError:"您还未获取短信验证码，请点击上方的按钮获取。",
		Folder_smsError:"短信验证码输入错误，请重新输入!",
		Folder_smsNotice:"正在获取短信验证码",
		//Mail139_Matrix_F2010\trunk\src\html\m\coremailServer\folder_sms.htm end
		
		//Mail139_Matrix_F2010\trunk\src\html\m\coremailServer\foldermanage.htm begin
		FoldermanageError:"排序操作失败！",
		//Mail139_Matrix_F2010\trunk\src\html\m\coremailServer\foldermanage.htm end	
		
		//Mail139_Matrix_F2010\trunk\src\html\m\coremailServer\checksecretfolderpwd.htm begin
		ChecksecretfolderpwdError:"密码错误",
		//Mail139_Matrix_F2010\trunk\src\html\m\coremailServer\checksecretfolderpwd.htm end	
		
		//Mail139_Matrix_F2010\trunk\src\html\m\coremailServer\addsendcontacts.htm begin
		AddsendcontactsTeamError:"请输入组名",
		AddsendcontactsOneError:"请至少选中一行!",
		AddsendcontactsAddSuccess:"添加成功!",
		AddsendcontactsAddError:"添加失败!",
		AddsendcontactsNotice:"正在添加联系人...",
		//Mail139_Matrix_F2010\trunk\src\html\m\coremailServer\addsendcontacts.htm end
		
		//utils.js begin
    UtilsScreenError:"截屏功能仅能在IE浏览器下使用",
    UtilsDebugError:"调试器错误",
    UtilsInvalidError:"Passing invalid object: {0}",
    UtilsTimeoutError:" <b>登录超时，可能由于以下原因：</b><br/>1、您同时使用多个帐号或多次登录邮箱<br/>2、您的网络链接长时间断开<br/>3、当前页面闲置太久",
    UtilsRequestError:"请求出错:",
    UtilsNoloadError:"数据未加载成功，可能的原因是登录超时了。",
    UtilsUploadConfirm:"上传文件必须安装139邮箱控件,是否安装?",
    UtilsUpdateConfirm:"您安装的上传控件已经不能使用,是否更新?",
    UtilsScreenInstallConfirm:"使用截屏功能必须安装139邮箱控件,是否安装?",
    UtilsUpgradeConfirm:"当前的截屏控件需要升级才可继续使用",
    //utils.js end      
    
    //Mail139_Matrix_F2010\trunk\src\html\m\coremailServer\addcontact.htm begin
		AddcontactSuccess:"添加成功!",
    AddcontactEmptyError:"分组名称不能为空。",
    AddcontactSpecialError:"组名中不能包含特殊字符。",
		//Mail139_Matrix_F2010\trunk\src\html\m\coremailServer\addcontact.htm end
	//vip notice information
	//vipNoPermissionNotice:"{0}{1}仅供{2}元版用户使用，立刻升级{2}元版！升级后重新登录即可生效！"
	vipNoPermissionNotice:"VIP{0}{2}为{0}元版{1}邮箱专属{2}。<br/>立即升级，重新登录后即可使用。"
}
window.FF = window.FloatingFrame = top.FF;
/**
 * 工具类，使用的方法是,页面引用:资源服务器m\matrix_for_nwf\coremail\js\utils_controls.js。
 */
Utils = {
    isM2012:true,
    getAddrWinUrl: function () {
        return "http://" + top.location.host + "/m2012/html/addrwin.html";
    },
	/**
	 * 移动当前元素到目标元素的某个边，注意当前元素的style设置position:absolute，页目标元素不能绝对定位<br>
	 * <pre>
	 * <br>示例：<br>
	 * <br>var h=document.getElementById("host");<br>
	 * <br>var t=document.getElementById("elem");<br>
	 * <br>Utils.offsetHost(h,t,"top");<br>
	 * </pre>
	 * @param {Object} host 必选参数，目标DOM对象
	 * @param {Object} elem 必选参数，当前要移动的DOM对象
	 * @param {string} position 可选参数，要移动方向：top、left、right、bootom，默认为bootom。
	 * @return {无返回值}
	 */
    offsetHost: function(host, elem, position)
    {
        var offset = $(host).offset();
        var left = offset.left;
        var top = offset.top;
        switch (position)
        {
            case "top":
                {
                    elem.style.left = left + "px";
                    elem.style.top = top - elem.offsetHeight + "px";
                    break;
                }
            case "left":
                {
                    elem.style.left = left - elem.offsetWidth + "px";
                    elem.style.top = top + "px";
                    break;
                }
            case "right":
                {
                    elem.style.left = left + host.offsetWidth + "px";
                    elem.style.top = top + "px";
                    break;
                }
            default:
                {
                    var elP = left + elem.offsetWidth;
                    var PWidth = elem.parentNode.offsetWidth;
                    if(elP > PWidth) {
                        elem.style.left = left - (elP - PWidth) + 'px';
                    }else{
                        elem.style.left = left + "px";
                    }

                    Utils.fixElementOutOfView(elem);
                    
                    elem.style.top = top + host.offsetHeight + "px";
                    break;
                }
        }
    },

    /**
     处理浮动层溢出屏幕
     */
    fixElementOutOfView:function(element){
        var j = $(element);
        var offset = j.offset();
        var fLeft = offset.left + j.width() > $(document.body).width();
        if(fLeft > 0){
            j.css({
                left:offset.left - fLeft + "px"
            });
        }
    },

	/**
	 * 编码html标签字符
	 * <pre>示例：<br>
	 * <br>Utils.htmlEncode("&lt;div&gt;内容&lt;div/&gt;");
	 * </pre>
	 * @param {string} str 必选参数，要编码的html标签字符串
	 * @return {编码后的字符串}
	 */
    htmlEncode: function(str)
    {
        if (typeof str == "undefined") return "";
        str = str.replace(/&/g, "&amp;");
        str = str.replace(/</g, "&lt;");
        str = str.replace(/>/g, "&gt;");
        str = str.replace(/\"/g, "&quot;");
        //str = str.replace(/\'/g, "&apos;"); //IE不支持apos
        str = str.replace(/ /g, "&nbsp;");
        str = str.replace(/&amp;#([^\;]+);/ig, "&#$1;"); //将&#20117;转成相应的汉字“井”
        return str;
    },
	/**
	 * 解码html标签字符
	 * <pre>示例：<br>
	 * <textarea rows="2" cols="40">Utils.htmlDecode("<div>内容</div>");</textarea>
	 * </pre>
	 * @param {string} str 必选参数，要解码的字符串
	 * @return {解码后的字符串}
	 */
    htmlDecode: function(str)
    {
        if (typeof str == "undefined") return "";
        str = str.replace(/&lt;/g, "<");
        str = str.replace(/&gt;/g, ">");
        str = str.replace(/&quot;/g, "\"");
        str = str.replace(/&apos;/g, "'");
        str = str.replace(/&nbsp;/g, " ");
        str = str.replace(/&amp;/g, "&");
        return str;
    },
	/**
	 * 编码xml标签字符(与html不同之处在于：空格不需要转码)
	 * <pre>示例：<br>
	 * <br>Utils.xmlEncode("&lt;div&gt;内容&lt;div/&gt;");
	 * </pre>
	 * @param {string} str 必选参数，要编码的xml标签字符串
	 * @return {编码后的字符串}
	 */
    xmlEncode: function(str)
    {
        if (typeof str == "undefined") return "";
        str = str.replace(/&/g, "&amp;");
        str = str.replace(/</g, "&lt;");
        str = str.replace(/>/g, "&gt;");
        str = str.replace(/\"/g, "&quot;");
        str = str.replace(/&amp;#([^\;]+);/ig, "&#$1;"); //将&#20117;转成相应的汉字“井”
        return str;
    },
	/**
	 * 取路径中的文件名
	 * <pre>示例：<br>
	 * <br>Utils.getFileNameByPath("C:\abc\test.txt");
	 * </pre>
	 * @param {string} path 必选参数，路径字符串
	 * @return {文件名} 
	 */
    getFileNameByPath: function(path)
    {
        var fileName = "";
        var charIndex = path.lastIndexOf("\\");
        if (charIndex != -1)
        {
            fileName = path.substr(charIndex + 1);
        }
        return fileName;
    },
	/**
	 * 添加script元素到dom中,常用来异步加载资源<br>
	 * <pre>示例：<br>
	 * <br>Utils.requestByScript(<br>
	 * "loadAScript",<br>
	 * "sample-requestByScript.js",<br>
	 * function(){ 运行加载脚本文件的方法... });
	 * </pre>
	 * @param {string} scriptId script标签的id,该参数其实意义不大,可以无视。
	 * @param {string} dataHref script标签的路径,即src属性。
	 * @param {function} callback script onload后的回调函数。
	 * @param {string} charset 标记的charset属性
	 * @param {Object} retry 重试的次数,间隔,如{times:5,timeout:10000},如果没加载成功,则重试5次,每次间隔10秒(不建议使用)。
	 * @return {无返回值}
	 */
    requestByScript: function(scriptId, dataHref, callback, charset, retry)
    {
        var isReady = false;
        if (callback)
        {
            if (typeof (callback) == "string")
            {
                charset = callback;
                callback = null;
            }
        }
        var head = document.getElementsByTagName("head")[0];
        var objScript = document.getElementById(scriptId);
		//是否移出脚本DOM(非IE9时处理)
		var isRemoveScriptDom=!document.all && true || false,
		browserVersion=["msie 9.0","chrome","firefox"],
		i=0,bvLenght=browserVersion.length-1
		currVersion=window.navigator.userAgent.toLowerCase()||"";
		//IE9、chrome、firefox时处理
		while(i<=bvLenght){
			isRemoveScriptDom=currVersion.indexOf(browserVersion[i])>-1 && true || false;
			if (isRemoveScriptDom) {
				break;
			}
			i++;
		}
		browserVersion=null;

        try {
            if (objScript && isRemoveScriptDom) {
                objScript.src = "";
                objScript.parentNode.removeChild(objScript);
                objScript = null;
            }
        } 
        catch (e) {}        
        if (objScript != null)
        {
            if (dataHref.indexOf("?") == -1) dataHref += "?";
            dataHref += "&" + Math.random();
            objScript.src = dataHref;
            var dataScript = objScript;
        } else
        {
            var dataScript = document.createElement("script");
            dataScript.id = scriptId;
            if (charset)
            {
                dataScript.charset = charset;
            } else
            {
                dataScript.charset = "GB2312";
            }
            dataScript.src = dataHref;
            dataScript.defer = true;
            dataScript.type = "text/javascript";
            head.appendChild(dataScript);
        }
        if (document.all)
        {
            dataScript.onreadystatechange = function()
            {
                if (dataScript.readyState == "loaded" || dataScript.readyState == "complete")
                {
                    isReady = true;
                    if (callback) callback();
                }
            }
        } else
        {
            dataScript.onload = function()
            {
                isReady = true;
                if (callback) callback();
            }
        }

        if (retry)
        {
            setTimeout(function()
            {
                if (retry.times > 0 && !isReady)
                {
                    retry.times--;
                    if (dataHref.indexOf("?") == -1) dataHref += "?";
                    dataHref += "&" + Math.random();
                    Utils.requestByScript(scriptId, dataHref, callback, charset, retry);
                }
            }, retry.timeout);
        }
    },
	/**
	 * 发送日志上报的方法
	 * @param {Object} obj 必选 包含了上报参数
	 * @param {Number} serviceId 可选   业务编号：默认10
	 * @param {Number} mouduleId 必选   模块编号
	 * @param {Number} action 必选   行为编号
	 * @param {Number} pageId 可选   页面id：默认12
	 * @param {Number} channelId 可选   渠道id：默认 12
	 * @param {Number} thingId 可选   行为对象编号：默认 0
	 * @param {String} thing 必选   行为描述
	 * @param {Number} ext1 可选   扩展字段1：默认 0
	 * @param {Number} ext2 可选   扩展字段2：默认 0
	 * @param {Number} comeFrom 可选   来源ID：默认1002
	 * @param {String} outUrl 必选   所属页面url
	 * @param {String} userIp 必选    用户IP
	 */
	logReports:function(obj){
		var dataJson = {
			serviceId: 10 || obj.serviceId,
			mouduleId: obj.mouduleId,
			action: obj.action,
			pageId: obj.pageId || 12,
			channelId: obj.channelId || 12,
			thingId: obj.thingId || 0,
			thing: obj.thing,
			ext1: obj.ext1 || 0,
			ext2: obj.ext2 || 0,
			comeFrom: obj.comeFrom || 1002,
			outUrl: location.href.replace(/\?(\S)*$/, ""),
			userIp: top.UserData.lastLoginIp
		};
		var dataXml = namedVarToXML("", dataJson, "");
		var url = this.getAddedSiteUrl("logInterface");
		//发送
		try{
		    top.M139.RichMail.API.call(url, dataXml);
		}catch(e){}
	},
	/**
	 * 获取增值站点URL
	 * @param {string} param 接口参数名称
	 * @return {string} url
	 */
	getAddedSiteUrl:function(param){
		// merge note: 灰度接口
	    var interFace = "/mw2/mms/s?func=mms:";
        var host = location.host;

	    return interFace + param + "&sid=" + top.$App.getSid();
	}
}
/**
 * /异步等待对象可用，然后执行回调函数
 * <pre>示例：<br>
 * <br>Utils.waitForReady("window.top.UserData['PresentSmsCount'].toString()", function() {<br>
 * <br>&nbsp;&nbsp;&nbsp;&nbsp;updateSmsCount();<br>
 * <br>});
 * </pre>
 * @param {Object} query 必选参数，要调用的对象。
 * @param {Object} callback 必选参数,回调函数。
 * @param {Object} win window对象
 * @return {无返回值}
 */
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
/**
 * 取得url中的get参数
 * <pre>示例：<br>
 * <br>Utils.queryString("sid","http://mail.139.com/?sid=456");
 * </pre>
 * @param {string} param 必选参数，要获取的参数名
 * @param {string} url 可选参数，从哪个url中获取。缺省状态下取当前页面url
 * @return {获取的参数值}
 */
Utils.queryString = function (param, url) {
    if (!url) {
        url = location.search;
    }
    if (top.M139) {
        return top.M139.Text.Url.queryString(param, url);
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
/**
 * 获取event对象,主要用于兼容firefox
 * <pre>示例：<br>
 * Utils.getEvent(event);
 * </pre>
 * @param {Object} A 必选参数，在firefox中调用函数时传入的事件对象。
 * @return {事件对象}
 */
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
/**
 * 停止事件冒泡
 * <pre>示例：<br>
 * <br>Utils.stopEvent(event);
 * </pre>
 * @param {Object} e 可选参数，在firefox中调用函数时传入的事件对象。
 * @return {无返回值}
 */
Utils.stopEvent=function(e){
  if(!e){
    e=this.getEvent();
  }
  if (e) {
  	if (e.stopPropagation) {
  		e.stopPropagation();
  		e.preventDefault();
  	}
  	else {
  		e.cancelBubble = true;
  		e.returnValue = false;
  	}
  }
}
/**
 * 添加事件监听
 * <pre>示例：<br>
 * <br>Utils.addEvent(document.getElementById('imgID'),"onClick",function(){doing...});
 * </pre>
 * @param {Object} obj 必选参数，监听目标对象
 * @param {string} eventName 必选参数，监听事件名称
 * @param {function} func 必选参数，触发监听事件函数
 * @return {无返回值}
 */
Utils.addEvent=function(obj,eventName,func){
	if(obj.attachEvent){
		obj.attachEvent(eventName,func)
	}else{
		obj.addEventListener(eventName.substring(2),func,false);
	}
}
/**
 * 删除事件监听
 * <pre>示例：<br>
 * <br>Utils.removeEvent(document.getElementById('imgID'),"onClick",function(){doing...});
 * </pre>
 * @param {Object} obj 必选参数，监听目标对象
 * @param {string} eventName 必选参数，监听事件名称
 * @param {function} func 必选参数，触发监听事件函数
 * @return {无返回值}
 */
Utils.removeEvent=function(obj,eventName,func){
	if(obj.detachEvent){
		obj.detachEvent(eventName,func)
	}else{
		obj.removeEventListener(eventName.substring(2),func,false);
	}
}

/**
 * 获取object对象的长度
 * <pre>示例：<br>
 * <br>Utils.getLength(new Object());
 * </pre>
 * @param {Object} obj 必选参数，目标对象。
 * @return {无返回值}
 */
Utils.getLength=function(obj){
var i=0;
for(elem in obj){
	i++;
}
return i;
}
/**
 * 将object转换为数组
 * <pre>示例1：<br>
 * <br>var o1=document.getElementByID("img");
 * <br>Utils.toArray(o1,true);   //o1[0],o1[1]...<br>
 * <br>var o2=document.getElementByID("img");
 * <br>Utils.toArray(o2);   //o1[0],o1.1   ...<br>
 * </pre>
 * @param {Object} obj 必选参数，目标对象。
 * @param {Boolean} nameFlag 可选参数，转换后的值是否按下标存放。
 * @return {Array} 转换后的数组。
 */
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
/**
 * 查找父节点
 * <pre>示例：<br>
 * <br>Utils.findParent(document.getElementById("td"),"div");
 * </pre>
 * @param {Object} obj 必选参数，当前DOM对象。
 * @param {string} tagName 必选参数，父节点标签名称。
 * @return {父节点DOM对象或当前对象}
 */
Utils.findParent=function(obj,tagName){
	while(obj.parentNode){
		if(obj.tagName.toLowerCase()==tagName.toLowerCase()){
			return obj;
		}
		obj=obj.parentNode;
	}
}
/**
 * 得到元素的绝对坐标
 * <pre>示例：<br>
 * <br>Utils.findPosition(document.getElementById("div"));
 * </pre>
 * @param {Object} obj 必选参数，当前DOM对象。
 * @return {坐标数组}
 */
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
/**
 * 递归遍历查找属性值等于特定值的子节点
 * <pre>示例：<br>
 * <br>Utils.findChild(document.body,"div","claas","abc");
 * </pre>
 * @param {Object} node 必选参数，节点对象。
 * @param {Object} tagName 必选参数，节点标签名称。
 * @param {Object} attrName 必选参数，属性名称。
 * @param {Object} attrValue 必选参数，属性值。
 * @return {子节点对象}
 */
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
/**
 * 预加载图片
 * <pre>示例：<br>
 * <br>Utils.preloadImages();
 * </pre>
 * @return {无返回值}
 */
Utils.preloadImages=function(){
	var imgs=[];
	for(var i=0;i<arguments.length;i++){
	    imgs[i]=new Image();
	    imgs[i].src=arguments[i];
	}
}
/**
 * 按参数格式化日期
 * <pre>示例：<br>
 * <br>Date.format("yyyy-MM-dd");
 * </pre>
 * @param {string} format 必选参数，日期格式。如：yyyy-MM-dd
 * @return {格式化后的日期}
 */
Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds(), //millisecond
        "w": "日一二三四五六".charAt(this.getDay())
    }
    format = format.replace(/y{4}/, this.getFullYear())
    .replace(/y{2}/, this.getFullYear().toString().substring(2))

    for (var k in o) {
        var reg = new RegExp(k);
        format = format.replace(reg, match);
    }
    function match(m) {
        return m.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length);
    }
    return format;
}
/**
 * 计算两个日期之间天数的差值
 * <pre>示例：<br>
 * <br>Utils.dayDiff(new Date(),new Date());
 * </pre>
 * @param {Date} date1 必选参数，日期1。
 * @param {Date} date2 必选参数，日期2。
 * @return {相差的天数}
 */
Utils.dayDiff=function(date1,date2){
		var t = date2.getTime() - date1.getTime();//相差毫秒
		var day=Math.round(t/1000/60/60/24);
		if(day==0 || day==1){
			day=date1.getDate()==date2.getDate()?0:1;
		}
		return day;
}
/**
 * 将coremail日期字符串转化为Date类型 
 * <pre>示例：<br>
 * <br>Utils.parseDate(coremail日期字符串);
 * </pre>
 * @param {string} str 必选参数，日期字符串
 * @return {日期对象}
 */
Utils.parseDate=function(str){
    //这个已经没人用了？
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
		return new Date(iYear,iMonth - 1,iDate,iHour,iMinute);
}
/**
 * 转换带有日间的日期字符串成日期对象。
 * <pre>示例：<br>
 * <br>parseDateString('2001-01-01 00:00:00');
 * </pre>
 * @param {Object} str 必选参数，日期格式的字符串。如：2001-01-01 00:00:00
 * @return {日期对象或null}
 */
Utils.parseDateString = function(str) {
    str = str.trim();
    var reg = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
    var m = str.match(reg);
    if (m) {
        var year = m[1];
        var month = m[2] - 1;
        var day = m[3];
        var hour = m[4];
        var minutes = m[5];
        var seconds = m[6];
        return new Date(year,month,day,hour,minutes,seconds);
    } else {
        return null;
    }
}

/**
 * 将rm常见的毫秒时间转成Date对象。
 * <pre>示例：<br>
 * <br>sentDate.toDate();
 * </pre>
 * @return {日期对象或null}
 */
Number.prototype.toDate = function(){
	return new Date(this * 1000);
}

/**
 * 得到Cookie值
 * <pre>示例：<br>
 * <br>Utils.getCookie("userName");
 * </pre>
 * @param {Object} name 必选参数，Cookie名称。
 * @return {Cookie值}
 */
Utils.getCookie=function(name) {
 var arr = document.cookie.match(new RegExp("(^|\\W)"+name+"=([^;]*)(;|$)"));
 if(arr != null)return unescape(arr[2]);
 return "";
}
/**
 * 设置Cookie值
 * @param {Object} name 必选参数，Cookie名称。
 * @param {Object} value 必选参数，Cookie值。
 * @param {Object} expires 必选参数，Cookie超时时间。
 * @return {无返回值}
 */
Utils.setCookie = function(name, value, expires,domain) {
    if (!expires) {
        expires = new Date();
        expires.setYear(expires.getFullYear() + 10);
    }
    document.cookie = name + " = " + escape(value) + "; path=/; "+(domain && "domain="+domain+";" ||"")
     + " expires=" + expires.toGMTString();
}
/**
 * 格式化字符串,支持array和object两种数据源
 * <pre>示例：<br>
 * String.format("src=《0》 width:《1》;height:《2》",[src, width, height])
 * </pre>
 * @param {string} str 必选参数，格式化的目标模板。
 * @param {Object} arr 必选参数，填充模板的集合。
 * @return {格式化后的字符串}
 */
String.format = function(str, arr) {
    var tmp;
    if (arr.constructor == Array) {
        for (var i = 0; i < arr.length; i++) {
            var re = new RegExp('\\{' + (i) + '\\}', 'gm');
            tmp = String(arr[i]).replace(/\$/g, "$$$$");
            str = str.replace(re, tmp);
        }
    } else {
        for (var elem in arr) {
            var re = new RegExp('\\{' + elem + '\\}', 'gm');
            tmp = String(arr[elem]).replace(/\$/g, "$$$$");
            str = str.replace(re, tmp);
        }
    }
    return str;
}
/**
 * 得到字符串长度
 * <pre>示例：<br>
 * <br>alert("123".getBytes());
 * </pre>
 * @return {字符长度]
 */
String.prototype.getBytes = function() {   
    var cArr = this.match(/[^\x00-\xff]/ig);   
    return this.length + (cArr == null ? 0 : cArr.length);   
}
  
/**
 * utf8专用得到字符串长度
 * <pre>示例：<br>
 * <br>alert("123".getByteCount());
 * </pre>
 * @return {字符字节长度]
 */
String.prototype.getByteCount = function() {
    var n = this.length, c, s=0;
    while(n--){
        c=this.charCodeAt(n);
        switch(true){
            case c<=0x7F: s+=1; break;
            case c<=0x7FF: s+=2; break;
            case c<=0xFFFF: s+=3; break;
            case c<=0x1FFFF: s+=4; break;
            case c<=0x7FFFFFFFF: s+=5; break;
        }
    }
    return s;
}
/**
 * 清除字符串前后空字符。
 * <pre>示例：<br>
 * <Br>alert("  空格没了。  ".trim());
 * </pre>
 * @return {除前后空格的字符串}
 */
String.prototype.trim = function(){
	return this.replace(/^\s+|\s+$/g, "");
}
/**
 * 以当前字符串为模板，格式化
 * <pre>示例：<br>
 * <br>"《0》 哈哈 《1》".format("我","了");
 * </pre>
 * @param {Array} arguments 可选参数 模板中的内容。
 * @return {格式化后的字符串或null}
 */
String.prototype.format = function() {
    var str = this;
    var tmp;
    for (var i = 0; i < arguments.length; i++) {
        tmp = String(arguments[i]).replace(/\$/g, "$$$$");
        str = str.replace(eval("/\\{" + i + "\\}/g"), tmp);
    }
    return str;
}

/**
 * 得到字符串的前n个字符（1个汉字相当于两个字符，一个英文字母相当于1个字符）
 * <pre>示例：<br>
 * <br>alert("abcdefg".getLeftStr(3));
 * </pre>
 * @param {int} len 必选参数，得到字符的长度。
 * @param {Object} showSymbol 可选参数，是否显示站位字符。
 * @return {字符串}
 */
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
/**
 * 显示字符的重复后的值
 * <pre>示例：<br>
 * <br>alert("abc".$(0,3));
 * </pre>
 * @param {int} from 可选参数,重复的起始下标
 * @param {int} to 可选参数,重复的结束下标
 * @return {字符串}
 */
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

/**
 * 验证邮箱地址是否正确
 * <pre>示例：<br>
 * <br>Utils.checkEmail("abc@abc.abc");
 * </pre>
 * @param {string} email 必选参数，邮箱地址
 * @return {true|false}
 */
Utils.checkEmail = function (email) {
    var mt = window.MailTool || top.MailTool;
    return mt.checkEmail(email);
}
/**
 * 从邮箱地址中提取邮件地址和姓名
 * <pre>示例：<br>
 * <br>Utils.getEmail("abc@abc.com");
 * </pre>
 * @param {Object} email 必须参数，邮箱地址。
 * @return {数组}
 */
Utils.getEmail = function (email) {
    var mt = window.MailTool || top.MailTool;
    return [
        mt.getName(email),
        mt.getAddr(email)
    ];
}
/**
 * 加载皮肤样式
 * <pre>示例：<br>
 * <br>Utils.loadSkinCss("/abc/sss/",document,目录);
 * </pre>
 * @param {string} path 必选参数，样式文件名称。
 * @param {Object} doc 必选参数，document对象。
 * @param {string} prefix 可选参数，是否替换path中的标记字符串。
 * @param {string} dir 可选参数，目录字符串。
 * @return {无返回值}
 */
Utils.loadSkinCss = function(path, doc, prefix, dir) {
	var isNewSkin=false;

    //获取2.0皮肤映射的1.0值,给内嵌的老页面用
	path = (top.$User.getSkinNameMatrix && top.$User.getSkinNameMatrix()) || 'skin_shibo';

    if (prefix) {
        path = path.replace("skin", prefix + "_skin");
    }
    if (!doc) {
        doc = document;
    }
    
    //加清皮肤样式缓存的版本号
    var version = "";
    if (top.SiteConfig && top.SiteConfig.skinCSSCacheVersion) {
        version = "?v=" + top.SiteConfig.skinCSSCacheVersion;
    }

	if (path.indexOf("new_") > -1){//判断是新皮肤，则启用新路径
		isNewSkin=true;
		path=path.replace(/new_/gi,"");
		if(prefix=="player"){//彩云硬编码，清空彩云皮肤路径。从新皮肤目录请求样式文件
			dir="";
		}
	}
	//alert("Path:"+path);
	var linkHref=top.rmResourcePath + "/css/" + path + ".css",skinFolder="";
    if (isNewSkin){//得到新皮肤文件夹，并替换路径
		skinFolder=path.replace(/\S*skin_(\S+)/gi,"$1");
		linkHref=linkHref.replace(/css/, "theme/"+skinFolder);
	}
	//alert("linkHref:"+linkHref);
    if (doc == top.document) {
        if (!window.cssTag) {
            document.write('<link id="skinLink" rel="stylesheet" type="text/css" href="{0}" />'.format(linkHref+ version));
            window.cssTag = document.getElementById("skinLink");
        } else {
            window.cssTag.href = linkHref + version;
        }
    } else {



        var links = doc.getElementsByTagName("link");
        for (var i = 0; i < links.length; i++) {
            var l = links[i];
            if (l.getAttribute("skinnew"))
                l.href = top.rmResourcePath + "/theme/" + path.replace("skin_", "") + "/skin.css" + version;
            else if (!l.href) {
                    if (dir)
                    l.href = dir + path + ".css";
                    else
						l.href = linkHref + version;
                }
                else{
                	if (l.href.match(/skin_\w+.css(?:\?v=\d+)?$/)) {
                        var tempHref = l.href.replace(/skin_\w+/, path);
                        if (tempHref.indexOf(".css") == -1)
                            tempHref = tempHref + ".css";
                        //alert("tempHref_be:"+tempHref);
                        tempHref=tempHref.replace(/theme\/\S+\//gi, "theme/"+path.replace("skin_", "")+"/");//得到第后一次使用的皮肤路径
                        if (isNewSkin)//新皮肤路径
                        {
							tempHref = tempHref.replace(/\/css\//, "/theme/" + skinFolder + "/");
							if(doc.location.href.toLowerCase().indexOf("musicplayer")>-1)//播放器皮肤替换成新路径
							{
								tempHref = tempHref.replace(/newnetdisk3/gi, "coremail");
							}
						}   
                        else//旧皮肤路径
                        {
							tempHref = tempHref.replace(/\/theme\/\S+\//gi, "/css/");
							if(doc.location.href.toLowerCase().indexOf("musicplayer")>-1)//播放器替换成旧皮肤
							{
								tempHref = tempHref.replace(/\/coremail\/\S+\//gi, "/newnetdisk3/css/");
							}
						}
                        //alert("tempHref_af:" + tempHref);
                        l.href = tempHref;
          			 }
				}
            /*
            if(!l.href||/\w+_\w+.css$/.test(l.href)){
            if(window==window.top){
            l.href=top.rmResourcePath+"/css/"+path+".css";
            }else{
            if(l.href)
            l.href=top.cssTag.href;
            }
            break;
            }*/
        }
    }
}
/**
 * 设置当前窗口的domain属性
 * <pre>示例：<br>
 * <br>Utils.setDomain();
 * </pre>
 * @return{无返回值}
 */
Utils.setDomain=function(){
    document.domain = window.location.host.match(/([^.]+\.[^.:]+):?\d*$/)[1];
}

/**
 * 文本框获得焦点并定位光标到末尾
 * <pre>示例：<br>
 * <br>Utils.focusTextBox(document.getElementById("text"));
 * </pre>
 * @param {Object} objTextBox 必选参数，文档框对象。
 * @return{无返回值}
 */
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

/**
 * 解析email地址成数组对象
 * <pre>示例：<br>
 * <br>Utils.parseEmail("abc@abc.com");
 * </pre>
 * @param {string} text 必须参数，邮箱地址。
 * @return {数组对象}
 */
Utils.parseEmail=function(text){
    var reg=/(?:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}|(?:"[^"]*")?\s?<[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}>)\s*(?=;|,|，|；|$)/gi;
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
/**
 * 验证邮箱地址是否正确
 * <pre>示例：<br>
 * <br>Utils.parseEmail("abc@abc.com");
 * </pre>
 * @param {string} txt 必选参数，邮箱地址字符串。
 * @return {true|false}
 */
Utils.testEmail=function(txt){
    var mailReg=/^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
    var mailRegExt=/^<[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}>$/i;
    txt=txt.replace(/"[^"]*"(?=\s*<)/g,"");
    var arr = txt.split(/[;,；，]/);
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
/**
 * 设置当前文档高度等于内嵌框架高度。
 * <pre>示例：<br>
 * <br>Utils.setBodyFixToFrame();
 * </pre>
 * @return{无返回值}
 */
Utils.setBodyFixToFrame=function(){
    document.body.style.height=window.frameElement.offsetHeight+"px";
}
/**
 * html编码
 * <pre>示例：<br>
 * <br>"abc".encode();
 * </pre>
 * @return {string}
 */
String.prototype.encode=function(){
    return Utils.htmlEncode(this);
}
/**
 * xml编码
 * <pre>示例：<br>
 * <br>"abc".encodeXML();
 * </pre>
 * @return {string}
 */
String.prototype.encodeXML=function(){
    return Utils.xmlEncode(this);
}
/**
 * html解码
 * <pre>示例：<br>
 * <br>"abc".decode();
 * </pre>
 * @return {string}
 */
String.prototype.decode=function(){
    return Utils.htmlDecode(this);
}
/**
 * gb2312编码
 * <pre>示例：<br>
 * <br>Utils.getGB2312("aaaa",function(){doing...});
 * </pre>
 * @param {Object} str 必选参数，要编码的字符串。
 * @param {Object} callback 必选参数，回调函数。
 * @return{string}
 */
Utils.getGB2312=function(str,callback){
	var i,c,ret="",strSpecial="!\"#$%&'()*+,/:;<=>?@[\]^`{|}~%";
	var url=rmResourcePath+"/js/gb2312.js"
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

/**
 * 从Cookie中得到用户数据
 * <pre>示例：<br>
 * <br>Utils.getUserDataFromCookie();
 * </pre>
 * @return{UserData对象}
 */
Utils.getUserDataFromCookie=function(){
	var cookiesString=Utils.getCookie("UserData");
	var chinaMobiles = "134|135|136|137|138|139|147|150|151|152|157|158|159|178|182|183|184|187|188";
    if(cookiesString!=""){
 	    try{
		    UserData=eval("("+cookiesString+")");
		    UserData_bak=UserData;
            if(top.SiteConfig && SiteConfig.MobileRegex){
                UserData.regex = SiteConfig.MobileRegex;
            }else if(top.SiteConfig && SiteConfig.SMSOpenRelease){
                UserData.regex = "^86("+chinaMobiles+"|130|131|132|155|156|185|186|145|176|133|153|177|180|181|189)\\d{8}$";
            }else{
                UserData.regex = "^86("+chinaMobiles+")\\d{8}$";
            }
	    }catch(ex){

	    }
     }
}

/**
 * 得到xml对象
 * <pre>示例：<br>
 * <br>Utils.getXmlDoc(xmlStr);
 * </pre>
 * @param {Object} xml 必选参数，xml字符串。
 * @return {xml对象}
 */
Utils.getXmlDoc = function(xml) {
    if (document.all) {
        var ax = Utils.createIEXMLObject();
        ax.loadXML(xml);
        return ax;
    }
    var parser = new DOMParser();
    return parser.parseFromString(xml, "text/xml");
}
Utils.createIEXMLObject = function() {
    var XMLDOC = ["Microsoft.XMLDOM","MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0", "MSXML.DOMDocument"];
    if (window.enabledXMLObjectVersion) return new ActiveXObject(enabledXMLObjectVersion);
    for (var i = 0; i < XMLDOC.length; i++) {
        try {
            var version = XMLDOC[i];
            var obj = new ActiveXObject(version);
            if (obj) {
                enabledXMLObjectVersion = version;
                return obj;
            }
        } catch (e) { }
    }
    return null;
}


/**
 * 文档对象点击事件监听
 * <pre>示例：<br>
 * <br>Utils.addEvent();
 * @param {Object} e 可选参数，firefox中的事件对象。
 * @return{无返回值}
 */
Utils.addEvent(document,"onclick",function (e){
    e=e||event;
    var target=e.srcElement || e.target;
    try{
        behaviorClick(target);
    }catch(e){}
});

function behaviorClick(target,win){
    if (window != top) {
        return top.behaviorClick(target, win);
    }
}
//key改为在/m2012/conf/behavior.xml定义key
function addBehavior(key, thingId) {
    if (window != top) {
        return top.addBehavior(key, thingId);
    }
}
//适配到新版
function addBehaviorExt(param) {
    if (window != top) {
        return top.addBehaviorExt(param);
    }
}
function sendBehavior(){}


/**
 * 调试类
 */
Debug = {
    write: function(message, color) {},
    init: function() {},
    start: function() {}
}
/**
 * 在是firefox下，验证是否安装了flash插件。
 * <pre>示例：<br>
 * <br>Utils.isUploadControlSetupExt();
 * </pre>
 * @return{true|false}
 */
Utils.isUploadControlSetupExt=function(){
    if (/firefox/i.test(navigator.userAgent.toString())) {
       var mimetype = navigator.mimeTypes["application/x-shockwave-flash"];
       if(mimetype && mimetype.enabledPlugin){
           return true;
       }
       return false;
    } else {
       return false;
    }
}
/**
 * 安装上传控件是否成功
 * <pre>示例：<br>
 * <br>Utils.isUploadControlSetup(true);
 * </pre>
 * @param {Boolean} showTip 可选参数，是否显示提示消息。
 * @return{true|false}
 */
Utils.isUploadControlSetup = function(showTip) {
    if (top.isUploadControlSetup) return true;
    var setup = false;
    Utils.checkUploadControlResult = 0;
    try {
        var obj = new ActiveXObject("Cxdndctrl.Upload");
        if (obj) setup = true;
    } catch (e) {

    }
    if (!setup && showTip) {
        ___openWin("上传文件必须安装139邮箱控件,是否安装?");
    } else if (setup && obj.getversion() < (top.SiteConfig.leastUploadControlVersion || 0)) {
        if (showTip) {
            ___openWin("您安装的上传控件已经不能使用,是否更新?");
        }
        return false;
    }
    top.isUploadControlSetup = setup;
    return setup;
}
function ___openWin(msg) {
    var view = top.$Msg.confirm(msg);
    view.$el.find(".YesButton")
    .unbind("click")
    .attr("href", top.ucDomain + "/LargeAttachments/html/control139.htm")
    .attr("target", "_blank")
    .click(function() {
        setTimeout(function() {
            try{
                top.FF.close(true);
                top.FF.close(true);
            }catch(e){}
        }, 0);
    });
}
/**
 * 安装截屏控件是否成功
 * <pre>示例：<br>
 * <br>Utils.isScreenControlSetup(ture,true);
 * </pre>
 * @param {Boolean} showTip 可选参数，是否显示提示消息。
 * @param {Boolean} cacheResult 是否使用父级窗口控件。
 * @return{true|false}
 */
Utils.isScreenControlSetup = function(showTip, cacheResult, isShowDialog) {
    if (isShowDialog) return showDialog();
    if (top.isScreenControlSetup != undefined && cacheResult) {
        return top.isScreenControlSetup;
    }
    if (!document.all) {
        if (showTip) alert("截屏功能仅能在IE浏览器下使用");
        return false;
    }
    var setup = false;
    try {
        if (window.ActiveXObject) {
            var obj = new ActiveXObject("ScreenSnapshotCtrl.ScreenSnapshot.1");
            if (obj) setup = true;
        } else if (navigator.mimeTypes) {
            var mimetype = navigator.mimeTypes["application/x-richinfo-mailtoolautoupdate"];
            if (mimetype && mimetype.enabledPlugin) {
                setup = true;
            }
        }
    } catch (e) {

    }
    if (!setup && showTip) {
        //___openWin("使用截屏功能必须安装139邮箱控件,是否安装?");
        showDialog();
    } else if (setup && showTip && top.SiteConfig.screenControlVersion && document.all) {
        var version = obj.GetVersion();
        if (version < top.SiteConfig.screenControlVersion || (location.host.indexOf("10086") >= 0 && version == 16777477)) {
            setup = false;
            //___openWin("使用截屏功能必须安装139邮箱控件,是否安装?");
            showDialog();
        }
    }

    function showDialog() {
        var exeFileUrl = top.ucDomain + "/ControlUpdate/mail139_tool_setup.exe";
        var htmlCode = "<p style='padding:10px 0 30px 10px;font-weight:bold;'>使用截屏功能必须安装139邮箱控件,是否安装?</p>\
        <p style='padding:0 20px 0 30px'><a id='aInstallOnline' class='but' href='javascript:;' onclick='setTimeout(function(){FF.close()},0);Utils.openControlDownload();return false;' target='_blank'>在线安装</a>\
        <a class='but' behavior='安装邮箱小工具' ext='7' href='{0}' onclick='setTimeout(function(){FF.close()},0);' target='_blank'>手动下载</a>\
        <a class='but' href='javascript:FF.close();'>取消</a></p>".format(exeFileUrl);
        FF.show(htmlCode, "系统提示");
        top.$("#aInstallOnline").focus();
    }

    delete obj;
    top.isScreenControlSetup = setup;
    return setup;
}

/**
 * 打开使用控件下载的页面
 * <pre>示例：<br>
 * <br>Utils.openControlDownload(true);
 * </pre>
 * @param {Boolean} removeUploadproxy 可选参数，使用后是否移动窗口
 */
Utils.openControlDownload = function(removeUploadproxy) {
    var win = window.open(top.ucDomain + "/LargeAttachments/html/control139.htm");
    setTimeout(function() { win.focus(); }, 0);
    top.addBehavior("文件快递-客户端下载");
}


Utils.addEvent(document, "onkeydown", function(e) {
    e = e || event;
    try {
        if (window.top.globalKeyDownEvent) {
            return window.top.globalKeyDownEvent(e, window);
        }
    } catch (e) { }
});
Utils.addEvent(document, "onclick", function(e) {
    e = e || event;
    try {
        if (window.top.globalClickEvent) {
            window.top.globalClickEvent(e, window);
        }
    } catch (e) { }
});
/**
 * 验证是否为移动的号码
 * <pre>示例：<br>
 * <br>Utils.isChinaMobileNumber(手机号码);
 * </pre>
 * @param {string} num 必选参数，手机号码
 * @return {true|false}
 */
Utils.isChinaMobileNumber = function(num) {
    if(window.NumberTool)return NumberTool.isChinaMobileNumber(num);
    if (num.length != 13 && num.length != 11) return false;
    if (num.length == 11) {
        num = "86" + num;
    }
    var reg = new RegExp(top.UserData.regex);
    return reg.test(num);
}

/**
 * 日志类
 */
ScriptErrorLog = {
	/**
	 * 增加日志
	 * <pre>示例：<br>
	 * ScriptErrorLog.addLog("我要写日志！");
	 * </pre>
	 * @param {string} log 必选参数，日志内容。
	 * @return {无返回值}
	 */
    addLog: function(log) {
        this.sendLog(log);
    },
    sendLog: function(log) {
        SendScriptLog(log);//老接口调新接口
    }
}
/**
 * 异常处理函数
 * <pre><br>
 * <br>window_onerror("异常","index.html",30);
 * </pre>
 * @param {string} msg 必选参数，异常内容。
 * @param {string} fileName 必选参数，所属文件名。
 * @param {Object} lineNumber 必选参数，异常行号。
 * @return {void}
 */
function window_onerror(msg, fileName, lineNumber) {
    if (typeof msg != "string") return;
    var stack = [];
    var caller = arguments.callee.caller;
    var reg_getFunName = /function (\w*\([^(]*\))/;
    while (caller) {
        var funCode = caller.toString();
        var match = funCode.match(reg_getFunName);
        stack.push((match && match[1]) || funCode);
        caller = caller.caller;
    }
    //上报日志
    Utils.Logger.sendClientLog({
        level: "ERROR",
        name: "SCRIPTERROR",
        file: fileName,
        errorMsg: msg,
        lines: lineNumber,
        stack: stack.join("").substring(0, 200)
    });
}
function _logScriptError_(){
    //研发测试线不捕获
    if (location.host.indexOf("10086.cn")==-1) return;
    window.onerror = window_onerror;
}
_logScriptError_();
/**
 * 随机排序数组
 * <pre>示例：<br>
 * <br>randomSortArray([9,5,32,65]);
 * </pre>
 * @param {Array} arr 必选参数，要排序的数组。
 * @return {排序后的数组}
 */
function randomSortArray(arr){   
    var B,C;   
    var X = [];   
  var j=0;   
  var A=[];
  for(i=0;i<arr.length;i++){   
    A[i]=arr[i];
  }
  
  for(i=A.length;i>=1;i--){   
   C=Math.floor(Math.random() * A.length);   
    X[j] = A[C];   
     A.splice(C,1)   
     j++;   
   }   
    return X   
} 


//------------这里是分隔线，CM3.5版本新增函数------------
/**
 * 转换文件大小显示方式
 * <pre>示例：<br>
 * <br>Utils.getDisplaySize(511623,"字节");
 * </pre>
 * @param {int} fileSize 必选参数，文件大小。
 * @param {Boolean} byteText 可选参数，是否显示单位成“字节”。
 * @return{文件大小字符串}
 */
Utils.getDisplaySize = function(fileSize, byteText) {
    if (!byteText) { byteText = "字节" }
    if (fileSize < 1024) {
        fileSize = Math.round(fileSize).toString() + byteText;
    }
    else if (fileSize < 1024 * 1024) {
        fileSize = (Math.round(fileSize * 100 / 1024) / 100).toString() + "K";
    }
    else if(fileSize < 1024 * 1024* 1024){
        fileSize = (Math.round(fileSize * 100 / 1024 / 1024) / 100).toString() + "M";
    }else{
		fileSize = (Math.round(fileSize * 100 / 1024 / 1024 /1024) / 100).toString() + "G";
	}
    return fileSize;

}
/**
 * 编码xml
 * <pre>示例：<br>
 * <br>encodeXML2(xml);
 * </pre>
 * @param {Object} text 必选参数，xml字符串
 * @return{string}
 */
function encodeXML2(text) {
	
		return text.toString().replace(/&/g, "&amp;")
	    .replace(/</g, "&lt;")
	    .replace(/>/g, "&gt;")
	    .replace(/"/g, "&quot;")
	    .replace(/'/g, "&apos;");
	
    
}

function varToXML(obj) {
    return namedVarToXML(null, obj, "\n").substr(1);
}
function namedVarToXML(name, obj, prefix) {
    if (obj == null) {
        return prefix + tagXML("null", name);
    }
    //var type = obj.constructor;
	var type=Utils.getDataType(obj);
    if (type == "String") {
		var xml=textXML(obj);
		if (RequestBuilder.needEncoding) {
			xml = encodeXML2(xml)
		};
        return prefix + tagXML("string", name, xml);
    } else {
        if (type == "Object") {
            if (obj.nodeType) {                
                top.FloatingFrame.alert(UtilsMessage["UtilsInvalidError"].format(Object.inspect(obj)));
                return "";
            }
            var s = "";
            for (var i in obj) {
                s += namedVarToXML(i, obj[i], prefix + "  ");
            }
            return prefix + tagXML("object", name, s + prefix);
        } else {
            if (type == "Array") {
                var s = "";
                for (var i = 0; i < obj.length; i++) {
                    s += namedVarToXML(null, obj[i], prefix + "  ");
                }
                return prefix + tagXML("array", name, s + prefix);
            } else {
                if (type == "Boolean" || type == "Number") {
                    var s = obj.toString();
                    return prefix + tagXML(getVarType(obj, s), name, s);
                } else {
                    if (type == "Date") {
                        var s = "" + obj.getFullYear() + "-" + (obj.getMonth() + 1) + "-" + obj.getDate();
                        if (obj.getHours() > 0 || obj.getMinutes() > 0 || obj.getSeconds() > 0) {
                            s += " " + obj.getHours() + ":" + obj.getMinutes() + ":" + obj.getSeconds();
                        }
                        return prefix + tagXML(getVarType(obj, s), name, s);						
                    } else {
                        top.FloatingFrame.alert(UtilsMessage["UtilsInvalidError"].format(Object.inspect(obj)));
                        return "";
                    }
                }
            }
        }
    }
}
/**
 * 得到对象的类型
 * @param {Object} obj 必选参数，要验证的对象。
 * @param {Object} stringValue 可先参数，当对象为Number时的对象值。
 * @return {}
 */
function getVarType(obj, stringValue) {
    if (obj == null) {
        return "null";
    }
    var type = obj.constructor;
    if (type == String) {
        return "string";
    } else {
        if (type == Object) {
            return "object";
        } else {
            if (type == Array) {
                return "array";
            } else {
                if (type == Date) {
                    return "date";
                } else {
                    if (type == Boolean) {
                        return "boolean";
                    } else {
                        if (type == Number) {
                            var s = stringValue ? stringValue : obj.toString();
                            if (s.indexOf(".") == -1) {
                                if (obj >= -2 * 1024 * 1024 * 1024 & obj < 2 * 1024 * 1024 * 1024) {
                                    return "int";
                                } else {
                                    if (!isNaN(obj)) {
                                        return "long";
                                    }
                                }
                            }
                            return "number";
                        }
                    }
                }
            }
        }
    }
}
function tagXML(dataType, name, val) {
	//在高级搜索时出现<undefined name="read">false</undefined>的错误，无法定位原因，暂时做个兼容；	 
	if(typeof(dataType)=="undefined" || dataType =="undefined"){
		return "";
	}
	
    var s = "<" + dataType;
    if (name) {
        s += " name=\"" + textXML(name) + "\"";
    }
    if (val) {
        s += ">" + val;
        if (val.charAt(val.length - 1) == ">") {
            s += "\n";
        }
        return s + "</" + dataType + ">";
    } else {
        return s + "></" + dataType + ">";
    }
}
function textXML(s) {
    //s=s.htmlencode();
    s = s.replace(/[\x00-\x08\x0b\x0e-\x1f]/g, "");
    return s;
}
/**
 * 按数组替换xml节点内容。在读取数据内容时，为了方便构造出:&lt;boolean&gt;isHtml&lt;/boolean&gt; 这样格式，采取<br>
 * 替换方式实现，由原来的&lt;boolean&gt;true&lt;/boolean&gt;替换成&lt;boolean&gt;isHtml&lt;/boolean&gt;
 * <pre>示例：<br>
 * <br>replaceDataType([《type:'true',replaceTxt:'isHtml'》],xml);
 * </pre>
 * @param {Array} arr 必选参数，替换规格对象。如：[《type:'true',replaceTxt:'isHtml'》]。
 * @param {string} xml 必选参数，替换目标xml字符串。
 * @return{格式化后的xml字符串}
 */
function replaceDataType(arr, xml) {
    var count = arr.length;
    for (var i = 0; i < count; i++) {
        xml = xml.replace(arr[i].type, arr[i].replaceTxt);
    }
    return xml;
}

 /**
  * 异步请求类
  */
var RequestBuilder = {
	/**
	 * 异步请求方法
	 * <pre>示例：<br>
	 * <br>RequestBuilder.call(func, data, callback, arrDataType);
	 * </pre>
	 * @param {Object} func 必选参数，请求地址。
	 * @param {Object} data 必选参数，提交的数据。
	 * @param {Object} callback 必选参数，回调函数。
	 * @param {Object} arrDataType 可选参数，特殊数据类型处理：主要应用在设置时读取数据，如：&lt;boolean&gt;isHtml&lt;/boolean&gt;
	 * @return {无返回值}
	 */
	needEncoding:true,
    call: function(func, data, callback, arrDataType) {
		//如果已经超时，则不需要再请求
        if(typeof(top.SessionTimeOut) != "undefined" && top.SessionTimeOut ){          
            return;
        }
		

        if(!top.wmsvrPath || top.wmsvrPath=="path_wmsvr"){
          top.wmsvrPath="/coremail/s";
        }
        if(typeof(rmkey) == "undefined"){
            rmkey=Utils.getCookie("RMKEY");	
        }        
		 
        var url = top.wmsvrPath+"?func=" + func + "&sid=" + top.sid + "&RMKEY="+rmkey;
        var aj=_ajax;
		if(data && typeof(data.targetServer)!="undefined" && data.targetServer==1){
			delete data.targetServer;
            url = "mail?func=" + func + "&sid=" + top.sid;
        }else if(data && typeof(data.targetServer)!="undefined" && data.targetServer==2){
			delete data.targetServer;
            //当发现webapp与appmail同域名，则不再通过iframe代理发请求
            if(top.wmsvrPath2.indexOf(location.host) == -1){
			    aj=top.window["frmProxy"]._ajax;
            }    
            url = top.wmsvrPath2+"/mail?func=" + func + "&sid=" + top.sid;
        }else if(data && typeof(data.targetServer)=="string"){
			
			aj=data.ajax;
            url = data.targetServer;
            
            delete data.targetServer;
            delete data.ajax;
        }
        if(data!=null && typeof(data.targetServer) !="undefined")
            delete data.targetServer;
            
		if(func.indexOf(".jsp")>=0){
			var prefix=func.indexOf("?")>=0?"&":"?";
			 url = func + prefix+"sid=" + top.sid;
		}
        var postData = namedVarToXML(null, data, "\r\n")
        if (typeof (arrDataType) != "undefined") {
            postData = replaceDataType(arrDataType, postData);
        }

        aj.post(url, postData, function (strResponse) {
            /*
			if(strResponse==""){
				return ;
			}
            */
		
			//eval("var response=" + strResponse);
            var response = Utils.tryEval(strResponse);

            if(response == null || response == undefined){
                //json解析异常
                Utils.Logger.jsonError({
                    url:url,
                    response:strResponse
                });
            }


            //response.code="unnkow" ;
            //response.errorCode='2012';
            top.SessionTimeOut=false;//默认session不超时  
            //如果返回超时 
            try{
                if(response.code.toLowerCase() =="fa_invalid_session"){               
                    response.errorCode=2012;
                }
            } catch (e) { }

            if (response && response.code != "S_OK"){
                //业务未成功上报
                Utils.Logger.unsuccess({
                    url:url,
                    response:strResponse
                });
            }


            if (response && response.code != "S_OK" && response.errorCode ) {

                var errorMsg="",isRedirct=false;  
                switch(response.errorCode.toString().toUpperCase()){
                    case '2012':
                          errorMsg="操作超时。<br>由于您长时间没有操作，<a  style='text-decoration:underline' href=\"javascript:document.location.href=\'" +url+"\'\">请重新登录</a>。"; 
                          isRedirct=true;                      
                          break;
                    case '2011':
                          errorMsg="操作超时。<br>由于您长时间没有操作，<a  style='text-decoration:underline' href=\"javascript:document.location.href=\'" +url+"\'\">请重新登录</a>。";     
                          isRedirct=true; 
                          break;                     
                    default:
                        errorMsg=UtilsMessage["UtilsRequestError"] + response.errorCode
                    
                }
               
                if(isRedirct){
		            top.SessionTimeOut=true;                     
                    Utils.showTimeoutDialog();
                }else{
					if(top.SiteConfig.isDev){	//研发环境
						top.FloatingFrame.alert(errorMsg);
					}
                    
                }
            }
            
            //如果是请求文件夹，则对文件夹的数据进行排序
            try {
                if (func == MS.getMailFoldersParam.func) {
                    top.FM.sortfolderByKey(response["var"], 'location');
                }
            } catch (e) { }
            if (callback) callback(response);

        });
    },
    /*
    serverType:可选参数；默认为0，用于判断访问那台服务器
    */
    sequential: function(arr, callback,serverType) {
        var cmdConfig="user:signatures,mbox:readMessage,mbox:readSessionMessage,user:setFilter,user:setWhiteBlackList,";//不支持序列化的，在这里进行统一转化
        //目前只有发件箱那才用到读取邮件
        if(typeof(serverType)=="undefined")
            serverType=0;
        
        var o = { items: [] };
        o.targetServer=serverType;
        for (var i = 0; i < arr.length; i += 2) {
            o.items[i / 2] = { func: arr[i], "var": arr[i + 1] };

        }
        //特殊处理代收； 
        var isSingRequest=false;
        if(cmdConfig.indexOf(o.items[0].func+",")>-1)
            isSingRequest=true;                 
       
        function _handler(orignResult) {
            //通过判断是否存在着key:result存在来区分是访问哪台服务器；如果不存在，则返回的是标准的CM3.5格式，否则需要单独组装成CM3.5
            var isCM35=false;
            var result = orignResult["var"];
            
            if(typeof(orignResult.result)=="undefined"){
                isCM35=true;
            }
            if(!isCM35){
                var ret=Utils.isRequestOK(orignResult,arr.length/2);
                var result={code:ret.result,"var":[]};
                var l=parseInt(arr.length/2);
                
                //为了减少开发工作量，封装把返回数据的格式和CM3.5的一致 
                switch(ret.result.toUpperCase()){
                    case 'S_OK': //全部成功                    
                        for(var i=0;i<l;i+=1){
                             var ob=new Object();
                             ob["code"]="S_OK"; 
                              //序列化指令，只返回最后一条指令的数据
                              if(i==l-1){   
                                 ob["var"]=orignResult["var"];                             
                              }else{
                                ob["var"]={};                         
                              }                          
                              result["var"].push(ob);
                        }                    
                        break;
                    case 'S_PARTIAL_OK'://部分成功
                        for(var i=0;i<l;i+=1){
                          var ob=new Object();
						  if(typeof(ret[i])=="undefined"){//表示成功                                 
								 ob["var"]= {};
								 ob.code="S_OK";
                                 try{
									 if(i==l-1){//最后一个指令执行成功,才返回var的知
										ob["var"]=orignResult["var"];
									 }else{
										ob["var"]={};     
									 }
								 }catch(e){
									 ob["var"]={};  
								 }
                          }else{
                            //失败							
							 ob["var"]= {};
							 ob.code="S_FAIL";
						     ob["var"].errorCode =ret[i];
							 ob["var"].summary ="";
                          }
                          result["var"].push(ob);
                        }        
                        break;
                    case 'S_FAIL'://全部失败
						 for(var i=0;i<l;i+=1){
                             var ob=new Object();
                             ob["code"]="S_FAIL";
							 ob["var"]= {};
							 ob["var"].errorCode =ret[i];
							 ob["var"].summary ="";
                             result["var"].push(ob);
                        }                    
                        break; 
                    default:               
                }   
                result = result["var"];
            } 
                     
            
                    
            if (callback) {
                callback(result, orignResult.code);
            }
        }
        
        if(!isSingRequest){
            this.call("global:sequential", o, _handler);
        }else{	
           	 
			if(o.items[0]["var"]!=null){
                if( typeof(o.items[0]["var"]["targetServer"])== "undefined")
                   	o.items[0]["var"]["targetServer"]=serverType;
			}else{
				o.items[0]["var"]={};				
				o.items[0]["var"]["targetServer"]=serverType;
			}
			if(o.items[1]["var"]!=null){
			     if( typeof(o.items[0]["var"]["targetServer"])== "undefined")
            	       o.items[1]["var"]["targetServer"]=serverType;
			}else{
				o.items[1]["var"]={};
				o.items[1]["var"]["targetServer"]=serverType;
			}
            //先请求第一个指令
            this.call(o.items[0].func,o.items[0]["var"],function(result){            
                //再请求第二个指令	
                //如果第一个请求成功的情况下，才请求第二个；否则直接返回对应的出错信息；
                var callback=_handler;
                
                var ret;
                if(result["code"].toUpperCase()!="S_OK"){
  				   ret={
                           "code" : result["code"], 
                           'var': [
                                {
                                    "code" : result["code"],
                                    'var' : result["var"]
                                }
                           ]
                        };
                }else{
                    
    				ret={code:'S_OK','var':[{code:'S_OK','var':result["var"]}]};    				
                    RequestBuilder.call(o.items[1].func,o.items[1]["var"],function(result){
    					if(result.code.toUpperCase()!="S_OK" && typeof(result["var"])=="undefined"){
                            ret["var"].push({'code':result.errorCode,'var':{"errorCode":result.errorCode}}); 
			                  
    					}else{
    					   ret["var"].push({'code':result.code,'var':result["var"]});
    					}
                        
    					
    					
    					callback(ret);
    				});   
                }             
            })				
		}
    }
}
/*
实现Ajax功能
_ajax.SendRequest('GET', url, null, recall, "addtohome");
_ajax.SendRequest('GET', url, null, null);
obj.responseText;
*/
var _ajax = {
    _objPool: [],
    _getInstance: function() {
        for (var i = 0; i < this._objPool.length; i++) {
            if (this._objPool[i].readyState == 0 || this._objPool[i].readyState == 4) {
                return this._objPool[i];
            }
        }
        this._objPool[this._objPool.length] = this._createObj();
        return this._objPool[this._objPool.length - 1];
    },
    _createObj: function() {
        if (window.XMLHttpRequest) {
            var objXMLHttp = new XMLHttpRequest();
        }
        else {
            var MSXML = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0','Microsoft.XMLHTTP'];
            for (var n = 0; n < MSXML.length; n++) {
				try {
                    var objXMLHttp = new ActiveXObject(MSXML[n]);
                    break;
                }
                catch (e) {
                }
            }
        }
        if (objXMLHttp.readyState == null) {
            objXMLHttp.readyState = 0;
            objXMLHttp.addEventListener("load", function() {
                objXMLHttp.readyState = 4;
                if (typeof objXMLHttp.onreadystatechange == "function") {
                    objXMLHttp.onreadystatechange();
                }
            }, false);
        }
        return objXMLHttp;
    },
    post: function(url, data, callback,options) {
        if (typeof data == "string") {
            data = data.trim();
        }

        this.SendRequest("post", url, data, callback,options)
    },
    get: function(url, data, callback,options) {
        this.SendRequest("get", url, data, callback,options)
    },
    /// 开始发送请求    
    SendRequest: function(method, url, data, callback,options) {
        options = options || {};

        var objXMLHttp = this._getInstance();

        with (objXMLHttp) {
            try {
                if (url.indexOf("?") > 0) {
                    url += "&randnum=" + Math.random();
                }else {
                    url += "?randnum=" + Math.random();
                }

                open(method, url, true);
                setRequestHeader("Content-Type", "application/xml");
                setRequestHeader("Accept", "text/javascript");
                send(data);	
                //监听超时
                var watchId = Utils.createWatch({
                    url:url,
                    requestData:data
                });
                onreadystatechange = function() {
                    if (objXMLHttp.readyState == 4){
                        Utils.stopWatch(watchId);

                        if (objXMLHttp.status > 199 && objXMLHttp.status < 300){
                            callback(responseText);
                        } else if (objXMLHttp.status == 304){
                            callback(responseText);
                        } else {

                            //上报异常
                            Utils.Logger.httpError({
                                url:url,
                                httpStatus:objXMLHttp.status
                            });

                            if(options.error){
                                options.error({
                                    method:method,
                                    requestData:data,
                                    url:url,
                                    xhr:objXMLHttp
                                });
                            }
                        }
                    }
                }
            } catch (e) {
                top.FloatingFrame.alert(UtilsMessage["UtilsNoloadError"]);
            }
        }
    }
};

if (typeof caixun == "undefined") {
    caixun = cx = {};
};
/**
 * 增加下拉框Option节点
 * <pre>示例：<br>
 * <br>cx.addOption(document.getElementById("selectID"),"哈哈",1,true);
 * </pre>
 * @param {Object} obj 必选参数，下拉框对象。
 * @param {Object} txtlabel 必选参数，Option.text。
 * @param {Object} optionValue 必选参数，Option.value。
 * @param {Boolean} selected 可选参数，是否选择当前Option。
 * @return{无返回值}
 */
cx.addOption = function(obj, txtlabel, optionValue, selected) {
    var newOption = document.createElement("option");
    obj.options.add(newOption);
    newOption.text = txtlabel; 
    newOption.value = optionValue;
    if (typeof (selected) != "undefined" && selected) {
        newOption.selected = selected;
    }
};
/**
 * 绑定下拉框数据
 * <pre>示例：<br>
 * <br>var _data=[[《text:"哈哈",value：1》],[《text:"呵呵",value：2》]];<br>
 * <br>cx.bindOptionData(document.getElemenetById("selectID"), _data, "text", "value", "2");
 * </pre>
 * @param {Object} obj 必选参数，下拉框对象。
 * @param {Array} _data 必选参数，绑定的数据。
 * @param {string} nameKey 必选参数，option.text的键值。如：_data[i][nameKey]
 * @param {string} valueKey 必选参数，option.value的键值。如：_data[i][valueKey]
 * @param {string} selectedValue 必选参数，要选择的option.value值。
 * @param {Function} fnFilter  可选参数 需要过滤的哪些数据不需要填充,参数为文件夹对象
 * @return {无返回值}
 */
cx.bindOptionData = function(obj, _data, nameKey, valueKey, selectedValue,fnFilter) {
    var l = _data.length;
    var isSelected = false,isAdded=true;
    
    for (var i = 0; i < l; i++) {
        isSelected = false,isAdded=true;
        if (_data[i][valueKey] == selectedValue)
            isSelected = true;
            
        //判断哪些需要进行数据符合条件添加到下拉框    
        if(typeof(fnFilter)=="function"){
            if(!fnFilter(_data[i])){
                isAdded=false;
            }
        }
        if(isAdded)
            cx.addOption(obj, _data[i][nameKey], _data[i][valueKey], isSelected)
        
    }
};
/**
* 根据value选择select控件中的某一项
* <pre>示例：<br>
* <br>cx.setSelectCtlSelected
* </pre>
* @param {string} id 必选参数，下拉框对象ID。
* @param {string} value 可选参数，下拉框Option的值。
* @return{无返回值}
*/
cx.setSelectCtlSelected = function(id, value) {
    var obCtl = document.getElementById(id);
    for (var i = 0; i < obCtl.options.length; i++) {
        if (obCtl.options[i].value == value) {
            obCtl.selectedIndex = i;
            break;
        }
    }
};
/**
 * 转换文件大小显示方式
 * <pre>示例：<br>
 * <br>Utils.getFileSizeText()
 * </pre>
 * @param {int} length 必选参数，文件大小
 * @return {string}
 */
Utils.getFileSizeText = function(length) {
    var unit = "B";
    if (length > 1024) {
        unit = "K";
        length = length / 1024;
        if (length > 1024) {
            unit = "M";
            length = length / 1024;
            if (length > 1024) {
                unit = "G";
                length = length / 1024;
            }
        }
        length = Math.ceil(length * 100) / 100;
    }
    return length + unit;
}
/**
 * 转换签名邮箱成对象。
 * <pre>示例：<br>
 * <br>Utils.parseSingleEmail('"签名"<帐号@139.com>');
 * </pre>
 * @param {Object} text 必选参数，邮箱地址。如："签名"<帐号@139.com> 或 帐号@139.com
 * @return {Object 如result.addr,result.name,result.all}
 */
Utils.parseSingleEmail = function(text) {
    text = text.trim();
    var result = {};
    var reg = /^([\s\S]*?)<([^>]+)>$/;
    if (text.indexOf("<") == -1) {
        result.addr = text;
        result.name = text.split("@")[0];
        result.all = text;
    } else {
        var match = text.match(reg);
        if (match) {
            result.name = match[1].trim().replace(/^"|"$/g, "");
            result.addr = match[2];
            //姓名特殊处理,某些客户端发信,姓名会多带一些引号或斜杠
            result.name = result.name.replace(/\\["']/g, "").replace(/^["']+|["']+$/g, "");
            result.all = "\"" + result.name.replace(/"/g, "") + "\"<" + result.addr + ">";
        } else {
            result.addr = text;
            result.name = text;
            result.all = text;
        }
    }
	if(result.addr){
		result.addr=result.addr.encode();
	}
    return result;
}
//基础类型判断,如:Utils.isDate(new Date())
var _BaseTypes = ["Array", "Boolean", "Date", "Number", "Object", "RegExp", "String", "Function"];
for (var i = 0; i < _BaseTypes.length; i++) {
    Utils["is" + _BaseTypes[i]] = (function(type) {
        return (function(obj) {
            return Object.prototype.toString.call(obj) == "[object " + type + "]";
        });
    })(_BaseTypes[i]);
}
/**
 * 得到对象类型
 * <pre>示例：<br>
 * <br>Utils.getDataType(new Date());
 * </pre>
 * @param {Object} obj 必选参数，对象
 * @return {string,对象类型}
 */
Utils.getDataType = function(obj) {
    return Object.prototype.toString.call(obj).replace(/^\[object (\w+)\]$/, "$1");
};
/**
 * 加载样式
 * <pre>示例：<br>
 * <br>Utils.requestCSS(请求样式的URL);
 * </pre>
 * @param {string} cssURL 必选参数，请求样式的URL。
 * @return {无返回值}
 */
Utils.requestCSS=function(cssURL)
{   
    var new_style = document.createElement("link");			
	new_style.rel = "stylesheet";
	new_style.href = cssURL;
	document.getElementsByTagName("head")[0].appendChild(new_style);
};

 
/**
 * 判断哪些用户是否开放了投递查询功能
 * <pre>示例：<br>
 * <br>Utils.isDeliverStausQueryRelease()
 * </pre>
 * @return{true|false}
 */
Utils.isDeliverStausQueryRelease=function(){
    return true;
};
/**
 * 判断哪些用户是否开放了邮件撤回功能
 * <pre>示例：<br>
 * <br>Utils.isDRecallMailRelease();
 * </pre>
 * @return{true|false}
 */
Utils.isDRecallMailRelease=function(){
    return true;
};
/**
 * 判断哪些用户是否开放邮件主题颜色功能
 * <pre>示例：<br>
 * <br>Utils.isSubjectColorRelease();
 * </pre>
 * @return{true|false}
 */
Utils.isSubjectColorRelease=function(){
    return true;
};

/**
 * 判断页面是否超时
 * <pre>示例：<br>
 * <br>Utils.PageisTimeOut();
 * </pre>
 * @param {boolean} isShowMsg 可选参数，当超时时，是否弹出系统对话框
 * @return{true|false}
 */
Utils.PageisTimeOut=function(isShowMsg){
    return top.$App.checkSessionOut();
};

/*统一判断请求是否OK,cmdCount:顺序指令个数,返回值:
ret={result:"S_OK"},
ret.result="S_PARTIAL_OK"; 
ret.result="S_FAIL"*/
Utils.isRequestOK=function(result,cmdCount){
	   if(typeof(cmdCount)=="undefined")
	       cmdCount=2;
	       
        //处理边界值
        if(cmdCount>5)
            cmdCount=5;
            
        //定义返回值：全部成功    
        var ret={result:"S_OK"};
        var k=0;
		
        if(result.code.toUpperCase()!="S_OK"){
            var arr=result.result;
            for(var i=0;i<cmdCount;i++){
                if(arr[i]!=0){
                    ret[i]=arr[i];
					k++;
                }
            }
        }
		
		if(k==cmdCount){
			ret.result="S_FAIL"; //全部失败   
		}
		else{
           ret.result="S_PARTIAL_OK"; //部分成功            
        }

        
        return ret;
	}

/**
 * 显示超时对话框
 * <pre>
 * <br>示例：<br>
 * <br>Utils.showTimeoutDialog()<br>
 * </pre>
 * @return {无返回值}
 */
Utils.showTimeoutDialog = function() {
    top.$App.showSessionOutDialog();
};

/**
 * 新的选择通讯录联系人对话框,浮动式
 * <pre>
 * <br>示例：<br>
 * <br>Utils.openAddressWindow({selectedList:["lifl@richinfo.cn"],receverTitle:"收件人"},callback:function(list){}})<br>
 * </pre>
 * @param {object} param 属性可扩展,selectedList表示已选的联系人，receverTitle表示右边框的标题，callback是点确定后的回调函数
 * @return {无返回值}
 */
Utils.openAddressWindow = function(param) {
    Utils.openAddressWindow.param = param;
    var title = (param && param.title) || "从联系人中添加";
    var url = top.wmsvrPath2+ "/add-from-address.html?rnd="+Math.random();
    FF.open(title, url, 430, 430, true);
}
/**
 * 获得flash播放器的版本号，version是检测支持的版本号，不传参数则会返回当前的版本，没安装会返回0
 * <pre>
 * <br>示例：<br>
 * <br>Utils.flashPlayerVersion(9)<br>
 * </pre>
 * @param {int} version 检测要支持的播放器版本号
 * @return {int|Boolean}
 */
Utils.flashPlayerVersion = function(version) {
    var isIE = Boolean(window.ActiveXObject);
    if (version) {
        if (isIE) {
            return isIESupport();
        } else {
            return isOthersSupport();
        }
    } else {
        if (isIE) {
            return getVersionInIE();
        } else {
            return getVersionInOthers();
        }
    }
    function isIESupport() {
        try {
            var obj = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + version);
            if (obj) return true;
        } catch (e) {
            return false;
        }
    }
    function isOthersSupport() {
        return getVersionInOthers() >= version;
    }
    function getVersionInIE() {
        var v = 0;
        for (var i = 11; i >= 6; i--) {
            try {
                var obj = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + i);
                if (obj) {
                    v = i;
                    break;
                }
            } catch (e) { }
        }
        return v;
    }
    function getVersionInOthers() {
        var v = 0;
        if (navigator.plugins && navigator.plugins.length > 0 && navigator.plugins["Shockwave Flash"]) {
            var plugins = navigator.plugins["Shockwave Flash"];
            for (var i = 0; i < plugins.length; i++) {
                var swf = plugins[i];
                if (swf.enabledPlugin && (swf.suffixes.indexOf("swf") != -1) && navigator.mimeTypes["application/x-shockwave-flash"]) {
                    var match = plugins.description.match(/ (\d+(?:\.\d+)?)/);
                    if (match) {
                        var v = parseInt(match[1]);
                        break;
                    }
                }
            }
        }
        return v;
    }
}

/**
*用户自定义over,当鼠标移上去时显示对应DIV，当鼠标移开后DIV延迟消失
*@targetId (string) 激发事件控件ID
*@contentID (string) 被显示容器ID
*@delayTime (int) 容器延迟消失时间，单位为毫秒
*@onShow (Function) 当容器显示时的调用的函数
*@onHidden (Function) 容器延迟消失时调用的函数
**/ 
Utils.hover=function(targetId,contentID,delayTime,onShow,onHidden){
 var showTimer;
 $("#"+targetId).hover(function() {
	            infoOver = true;
	            if(contentID!="")
    	            $("#"+contentID).show();
	            if(typeof(onShow)=="function"){
	               onShow();
	            }
	            //绑定鼠标移开事件
	            if(!isBindHoverEvent){	               
    	            $("#"+contentID).hover(function() {
                                    infoOver = true;
                                    }, function() {
                                        infoOver = false;
                                        hideInfo();
                                    })
                    isBindHoverEvent=true;
                }
	        }, function() {
	            infoOver = false;
	            hideInfo();
                })
                
var infoOver = false;
var isBindHoverEvent=false;
 
function hideInfo() {
	clearTimeout(showTimer);
    showTimer=setTimeout(function() {
        if (!infoOver) {
            if(contentID!="")
                $("#"+contentID).hide();
      	     
            if(typeof(onHidden)=="function"){
	               onHidden();
	            }   
        }
        }, delayTime);
    } 
}
//修复一个flash的bug
if(window.attachEvent){
    window.attachEvent("onunload", function() {
        __flash__removeCallback = function(instance, name) {
            try {
                if (instance) {
                    instance[name] = null;
                }
            } catch (e) { }
        }
    });
}

Utils.UI={};
 /**
  *发送邮件，包含贺卡明信片等发件人地址下拉框UI组件，如果需要初始化时，绑定某一个选项，请通过URL传递参数from；如from=15017908320@rd139.com，必须要要包含域名，同时绑定了默认的onchange，
调用方式:
<pre>
Utils.UI.selectSender("selFrom",true,document);
</pre>
  * @param {string} id 必填  select 控件ID
  * @param {boolean} isAddPop 可选 默认是false 是否需要填充代收账号到发件人下拉列表
  * @param {Object} doc document对象 可选 默认是顶层窗口document
  */
Utils.UI.selectSender = function(id, isAddPop, doc) {

    var from = Utils.queryString("from");
    if (typeof (doc) == "undefined")
        doc = document;

    if (typeof (isAddPop) == "undefined")
        isAddPop = false;

    var selFrom = doc.getElementById(id);
    UserData = window.top.UserData;
    var mailAccount = top.$User.getDefaultSender();

    var trueName = top.$User.getTrueName();
    var arr = top.$User.getAccountListArray();
    addItem(mailAccount);
    for (var i = 0; i < arr.length; i++) {
        var mail = arr[i];
        if (mailAccount != mail) addItem(mail);
    }

    //添加代收账号地址  
    if (isAddPop) {
        $(top.$App.getPopList()).each(function () {
            for (var i = 0; i < selFrom.options.length; i++) {
                if (this == selFrom[i].value) return;
            }
            addItem(this.email);
        })
    }
    selFrom.options.add(new Option("发信设置", "0"));

    //发件人地址下拉框切换事件
    var selFromOnChange = function(id) {
        var selFrom = doc.getElementById(id);            
        if (selFrom.value == "0") {
            selFrom[0].selected = true;
            top.$App.show("account");
			top.addBehavior("写信页_别名设置");
        } 
        selFrom=null; 
    }
   
    selFrom.onchange = function() { selFromOnChange(id) };

    function addItem(addr) {
        addr = addr.trim();
        var text = trueName ? '"{0}"<{1}>'.format(trueName.replace(/"|\\/g, ""), addr) : addr; //发件人姓名替换双引号和末尾的斜杠
        var item = new Option(text, addr);
        selFrom.options.add(item);
        item.innerHTML = item.innerHTML.replace(/\&amp\;#/ig, "&#");
        if (item.value == from) item.selected = true;
    }
}

/**
 * 50个颜色数据源（不和任何业务有关系）
 * @param {Number} i 获取第N个颜色的值
 * @return {Array} 如果没有提供参数i,则返回数据，否则返回具体颜色值
 */		
Utils.getColor=function(i){
	//暂时用临时数据
	var color="#FF0000,#FF9900,#C19A00,#00A301,#009898,#CCCC99,#FF6633,#CC6666,#AD33AD,#9900FF,#99CC66,#66CCCC,#3399FF,#2B8787,#855C85,#6699FF,#3385D6,#335CAD,#5F27B3,#262ED7,#D5D2C0,#B5BFCA,#999999,#666666,#333333,#729C3B,#58A8B4,#5883BF,#6D72BA,#E3A325,#DA8A22,#B34731,#BB4C91,#995AAE,#CC0000,#FCD468,#FF9966,#CC99CC,#CC9999,#AD855C";
	var arr=color.split(",");

	//做容错处理
	
	if(typeof(i)!="undefined" ){
	    i=i % arr.length;
		if(i<0)
			i=0;
		else if(i>=arr.length){
			i=arr.length-1;
		}	
		return arr[i]
	}
	return arr;	
}


/**
 * 检测功能开放标志
 * @param {String} func 功能的键名
 * @return {Boolean} 
 */		
Utils.isRelease = function(func) {
    if (!top.ReleaseConfig){
        return false;
    }

    var config = top.ReleaseConfig[func];
    if (typeof(config) == "undefined") {
        return false;
    }

    if (!config.enable) {
        return false;
    }

    if (config.enableProv && config.enableProv.splice) {
        var _prov = Number(top.UserData.provCode);
        var isProv = false;
        for(var i = config.enableProv.length; i--;){
            if (config.enableProv[i] == _prov) {
                isProv = true;
            }
        }
        return isProv;
    }

    if (config.enableServiceItem && config.enableServiceItem.splice) {
        var _svc = Number(top.UserData.serviceItem);
        var isSvc = false;
        for(var i = config.enableServiceItem.length; i--;){
            if (config.enableServiceItem[i] == _svc) {
                isSvc = true;
            }
        }
        return isSvc;
    }

    if (config.enablePartition && config.enablePartition.splice) {
        var _part = getCookie("cookiepartid");
        var isPart = false;
        for(var i = config.enablePartition.length; i--;){
            if (config.enablePartition[i] === _part) {
                isPart = true;
            }
        }
        return isPart;
    }

    return !!config.enable;
}


/**
 * 进行复杂的排重，根据isEquals来判断两个对象是否相同。
 * @param {Array} a 对象组
 * @param {Function} isEquals 判断两对象相同的函数。
 * @return {Array} 
 */
Utils.unique = function(a, isEquals){
    var c = [];
    try{
        for(var i=0,length=a.length; i<length; i++){
            var b = a[i];
            
            var isExists = false;
            for (var j=0, m = c.length; j < m; j++){
                if (isEquals(c[j], b)) {
                    isExists = true;
                    break;
                }
            }

            if( !isExists ){
                c.push(a[i])
            }
        }
    }catch(e){
        c=a
    }
    return c;
};


//去掉webkit文本框边框高亮
if(!document.all){
    document.write("<style>input,textarea{outline:none;}</style>");
}
//跨窗口事件帮手
var GlobalDomEvent = {
		events:{
			"mousemove":[],
			"click":[],
			"keyup":[],
			"keydown":[],
			"mouseup":[]
		},
		on:function(eventName,func){
			var arr= GlobalDomEvent.events[eventName];
			if(arr){
				arr.push(func);
			}
		},
		un:function(eventName,func){
			var arr= GlobalDomEvent.events[eventName];
			if(arr){
				for(var i=0;i<arr.length;i++){
					if(func==arr[i]){
						arr.splice(i,1);
						i--;
					}
				}
			}
		},
		fire:function(eventName,targetWin,event){
			var arr = GlobalDomEvent.events[eventName];
			if(arr){
				for(var i=0;i<arr.length;i++){
					var func = arr[i];
					try{
						func(targetWin,event);
					}catch(e){}
				}
			}
		},
		init:function(win){
			var doc = (win || window).document;
			for(var eventName in GlobalDomEvent.events){
				(function(eventName){
					Utils.addEvent(doc,"on" + eventName,function(e){
						try{
							if(top.GlobalDomEvent)top.GlobalDomEvent.fire(eventName,window,e);
						}catch(e){}
					});
				})(eventName);
			}
		},
		initFrame:function(win){
			GlobalDomEvent.init(win);
		}
};
GlobalDomEvent.init();

//保证iframe能够正确加载,通常用在ajax代理的iframe
//每3秒检查一次，如果不对，则替换src重新加载
Utils.makeSureIframeReady = function (conf) {
    var iframe = conf.iframe;
    var retryTimes = conf.retryTimes || 3;
    var interval = conf.interval || 3000;
    var query = conf.query;
    var check = function () {
        try {
            if (query) {
                if (iframe.contentWindow[query]) {
                    return true;
                }
            } else if (iframe.contentWindow.document.domain == document.domain) {
                return true;
            }
        } catch (e) {
            return false;
        }
    }
    var timer = setInterval(function () {
        retryTimes--;
        if (!check()) {
            var url = iframe.src;
            if (url.indexOf("?") == -1) {
                url += "?";
            }
            url += "&" + Math.random();
            iframe.src = url;
        } else {
            clearInterval(timer);
        }
        if (retryTimes <= 0) {
            clearInterval(timer);
            if (!check()) {
                ScriptErrorLog.sendLog("retry iframe but not sure ready:" + iframe.src);
            }
        }
    }, interval);
}

//切换标签隐藏元素的时候，一些浏览器会重置滚动条位置，这里需要主动记住
Utils.watchDomScroll = function (dom) {
    //IE8以下没必要
    if ($.browser.msie && $.browser.version < 8) return;
    dom.lastScrollTop = dom.scrollTop;
    var hasHidden = false;
    var timer = setInterval(function () {
        if (isRemove(dom)) {
            clearInterval(timer); //如果元素已被移除，则取消监控
            return;
        }
        if (isShow(dom)) {
            if (hasHidden) {
                //重置高度
                dom.scrollTop = dom.lastScrollTop;
                hasHidden = false;
            } else {
                //记住当前滚动位置
                dom.lastScrollTop = dom.scrollTop;
            }
        } else {
            hasHidden = true; //元素被隐藏过了
        }
    }, 500);
    function isShow(dom) {
        while (dom) {
            if (dom.style && dom.style.display == "none") return false;
            dom = dom.parentNode;
        }
        return true;
    }
    function isRemove(dom) {
        try {
            while (dom) {
                if (dom.tagName == "BODY") return false;
                dom = dom.parentNode;
            }
        } catch (e) {
            return true;
        }
        return true;
    }
	
}
/*
 *创建代理页面并请求
 *proxyPage 代理页http://gfile90.mail.10086ts.cn/operate12/proxy.htm
 *func 真实请求  function(T){T.post[get]('http://gfile90.mail.10086ts.cn/operate12/xx?func=tt',data,callback)}
 *name 创建请求iframe名 tourchIfame
 */
Utils.apiProxyReady = function (proxyPage, func, name) {
    var ele = frames[name];
    if (ele === undefined) {
        ele = document.createElement("IFRAME");
        ele.id = name;
        ele.name = name;

        if (/\/proxy.htm$/.test(proxyPage)) {
            ele.src = proxyPage
        } else {
            ele.src = proxyPage + 'proxy.htm';
        }

        ele.style.display = "none";
        if (ele.attachEvent) {
            ele.attachEvent("onload", function () {
                if (frames[name]._ajax) {
                    func(frames[name]._ajax);
                }
            });
        } else {
            ele.onload = function () {
                if (frames[name]._ajax) {
                    func(frames[name]._ajax);
                }
            };
        }
        document.body.appendChild(ele);
        Utils.makeSureIframeReady({
            iframe: ele,
            query: "_ajax"
        });
    } else {
        if (frames[name]._ajax) {//防同时发出请求时
            func(frames[name]._ajax);
        } else {
            Utils.waitForReady("frames['" + name + "']._ajax", function () { func(frames[name]._ajax) });
        }

    }
}
//获取代理请求地址
Utils.getRequestUrl=function(func,face){
   var proxyPage =  top.SiteConfig['billMiddleware']+"/",
       middleWare = proxyPage+face+"?func=user:"+func+"&sid="+top.UserData.ssoSid,
       part = Utils.getCookie("cookiepartid");
	   
   if(part=="0"||part=="11"){//灰度
      middleWare += ("&userNumber="+top.UserData.userNumber);
   }
   return {middleWare:middleWare,proxyPage:proxyPage}; 
 }
 //解析json
 Utils.parseJson=function(data,errorMsg){
   var result = {};
   try {
	  if(window.JSON && JSON.parse) {
		   result = JSON.parse(data);
				
	  }else{
		   result  = window.eval("("+data+")");
	  }
	  return result;
	} catch (ex) {
			top.ScriptErrorLog.sendLog(errorMsg);
    }
  }
 //获取用户名，别名，号码
  Utils.getUserName=function(){
	var name  = top.UserData.userName;//姓名
	  if(!name){//别名
		   if(top.UserData.uidList.length>0){
			 name = top.UserData.uidList[0];
		   }else{//电话号码
			 name = top.UserData.userNumber.replace(/^86/,"");
		   }
	   }
	   return name.replace(/</g,"&lt;");
 }
 //统一加载js
 Utils.loadJS = function(scriptId, jsName,isNew, callback, charset, retry){
    var  part = Utils.getCookie("cookiepartid"),requestJS = top.rmResourcePath;
	if(part =='0'||part=='11'){//cm
	 var requestJS = top.resourcePath;
	}
	requestJS += "/js/"+jsName;
	if(isNew){
	    requestJS+="?sid="+top.sid;
	}
    Utils.requestByScript(scriptId, requestJS, callback, charset, retry);
 }
 //获取用户头像
Utils.getImageSrc = function(ImageUrl){
	  if(ImageUrl){
	   return top.SiteConfig["net"] + "/addr/apiserver/httpimgload.ashx?sid=" + top.sid + "&path=" + encodeURIComponent(ImageUrl) + "&rnd=" + Math.random();
	  }else{
	   return top.rmResourcePath+"/images/face.png";
	  }
}
 //加载flash
 Utils.getFlashHtml = function(objectId,width,height,src){
    var flashHtml = "";
    if ($.browser.msie){
	   flashHtml =  "<object id='"+objectId+"' name='"+objectId+"' wmode='transparent' "+
				     " classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'"+
				     "codebase='http://download.macrCUedia.cCU/pub/shockwave/cabs/flash/swflash.cab#version=7,0,19,0'"+
				     "width='"+width+"' height='"+height+"' >"+
                     "<param name='movie' value='"+src+"'>"+
                     "<param name='wmode' value='transparent'>"+
					 "<param name='AllowScriptAccess' value='always'/>"+
                     "<param name='quality' value='high'>"+
				     "</object>";
	}else{
	  flashHtml = "<embed name='"+objectId+"' id='"+objectId+"' wmode='transparent' src='"+src+"' quality='high' pluginspage='http://www.macrCUedia.cCU/go/getflashplayer' type='application/x-shockwave-flash' width='"+width+"px' height='"+height+"px'  allowscriptaccess='always'></embed>";
	}
	return flashHtml;
 }
/**
 * 使用form进行post请求，解决ajax无法处理二进制流的问题
 * @param {Object} 必填 包含以下参数
 *		@param {String} 可填 formName 表单名称
 *		@param {String} 必填 url 
 *		@param {String} 必填 inputName
 *		@param {String} 必填 data 传送数据，为xml格式字符串
 *		@param {String} 必填 iframeName
 */
Utils.ajaxForm = function (o){
	var doc = document,
		body = doc.body,
		form = doc.createElement("form"),
		input = createInput(o.inputName, o.data);

		form.name = o.formName;
		form.method = "post";
		form.action = o.url;
		if (form.encoding) {
			form.setAttribute("encoding", "multipart/form-data");
		}
		form.setAttribute("enctype", "multipart/form-data");
		if (!document.getElementById(o.iframeName)) {
			body.appendChild(createIframe(o.iframeName));
		}
		form.target = o.iframeName;
		form.appendChild(input);
		body.appendChild(form);
		form.submit();
		body.removeChild(form);

	function createInput(name, value){
		var input = document.createElement("input");
		input.value = value;
		input.name = name;
		input.type = "hidden";
		return input;
	}
	function createIframe(name){
		var iframe;
		try{
			iframe = document.createElement('<iframe name="'+name+'"></iframe>');	
		}catch(ex){
			iframe = document.createElement("iframe");
			iframe.name = name;
		}
		iframe.id = name;
		iframe.style.display = "none";
		return iframe;
	}
};

(function(Utils){
	/*
	 * json字符串转json对象
	 * @param {String} str json字符串
	 * @param {String} url 接口地址
	 * return {Object} json对象
	 */
	Utils.strToJson = function(res, url){
		var obj = false;
		if (!res) {
			Utils.Logger.jsonError({url: url, response: "服务器返回空报文"});
			return {
				"code":"evalJsonFail",
				"summary":"服务器返回空报文"
			};
		}

		if (window.JSON && JSON.parse) {
			try {
				obj = JSON.parse(res);
			} catch (ex) {
				//Utils.Logger.jsonError({url: url, response: res});
			}
		}

		if (!obj) {
			try {
				obj = eval("(" + res + ")");
			} catch (ex) {//在后台返回错误时前端进行日志记录
				Utils.Logger.jsonError({url: url, response: res});
				obj = {
					"code":"evalJsonFail",
					"summary":"服务器返回报文不合法"
				};
			}
		}

		return obj;
	}
})(Utils);

//请求中间件
(function(Utils){
	Utils.middlewareHttpClient = {
		/**
		 * @param {Object} o 参数集合
		 * @param {Boolean} isFullUrl 是否为完成的请求地址 选填
		 * @param {String} url 请求接口地址
		 * @param {String} params 请求数据 选填 
		 */
	    request: function (o) {
	        var url = o.url;			
			if (o.isFullUrl) {
				url = M139.Text.Url.removeHost(url);
			    //TODO mw
				url = url.replace(/^(\/mw\/)?/, "/mw/");
			} else {
			    url = M139.Text.Url.removeHost(url);
                //TODO mw2
			    url = url.replace(/^(\/mw2\/)?/, "/mw2/");
			}
			top.M139.RichMail.API.call(url, o.params, function (e) {
			    if (o.callback) {
			        o.callback(e.responseData, e.responseText);
			    }
			});
		}
	}	
})(Utils);

//服务端接口监控代码
(function(Utils){
    
    var LogLevel = {
        Error:"ERROR",
        Info:"INFO"
    };

    var LogType = {
        Http:"HTTPClient",
        Script:"SCRIPTERROR"
    };
    var sendLog = function (options) {
        Utils.Logger.sendClientLog(options);
    };
    var getDefaultOptions = function(){
        return {
            level:LogLevel.Error,
            name:LogType.Http
        }
    }
    
    Utils.Logger = {
        /**
         *上报接口超时
         *@param {Object} options 参数集合
         *@param {String} options.url 出错的接口地址
         *@param {Number} options.time 超时时间(单位：毫秒）
         */
        timeout:function(options){
            var o = getDefaultOptions();
            o.errorMsg = "TIMEOUT";
            o.url = options.url;
            o.times = options.time;
            sendLog(o);
        },

        /**
         *上报接口响应慢
         *@param {Object} options 参数集合
         *@param {String} options.url 出错的接口地址
         *@param {Number} options.time 已经过了多长时间接口还没响应(单位：毫秒）
         */
        delay:function(options){
            var o = getDefaultOptions();
            o.errorMsg = "DELAY";
            o.url = options.url;
            o.time = options.time;
            sendLog(o);
        },

        /**
         *上报接口返回错误
         *@param {Object} options 参数集合
         *@param {String} options.url 出错的接口地址
         *@param {Number} options.httpStatus 错误的http返回编号
         */
        httpError:function(options){
            var o = getDefaultOptions();
            o.errorMsg = "HTTPERROR";
            o.url = options.url;
            o.status = options.httpStatus;
            sendLog(o);
        },
        /**
         *上报接口返回报文非法
         *@param {Object} options 参数集合
         *@param {String} options.url 出错的接口地址
         *@param {String} options.response 不合法的报文
         */
        jsonError:function(options){
            var o = getDefaultOptions();
            o.errorMsg = "JSONERROR";
            o.url = options.url;
            o.responseText = options.response;
            sendLog(o);
        },
        /**
         *除了以上异常，正常情况下的业务不成功
         *@param {Object} options 参数集合
         *@param {String} options.url 出错的接口地址
         *@param {String} options.response 不是预期结果的报文
         */
        unsuccess:function(options){
            var o = getDefaultOptions();
            o.subType = "UNSUCCESS";
            o.url = options.url;
            o.responseText = options.response;
            sendLog(o);
        },



        clientLogSendCount: 0,
        clientLogSendMax: 50, //最多50条日志，防止无限制刷
        /**
        *发送客户端日志：如脚本报错，HTTP接口异常
        *@param {Object} options参数集合
        *@param {String} options.level 日志级别：一般为INFO、ERROR，默认为ERROR
        *@param {String} options.name 日志名称
        */
        sendClientLog: function (options) {
            top.M139.Logger.sendClientLog(options);
        }
    };

    //覆盖main.htm中的老接口
    window.SendScriptLog = function (log) {
        var reg = /\[(\d+)\]LOGINSUCCESS/;
        var m = log.match(reg);
        var obj = {
            level: "INFO",
            name: "COMMONLOG"
        };
        if (m) {
            obj.time = m[1];
            obj.name = "LOGINSUCCESS";
        } else {
            obj.commonlog = log;
        }
        Utils.Logger.sendClientLog(obj);
    }

    /**
     *使用try{}catch(e){}进行捕获，解析json，解析错误返回null
     */
    Utils.tryEval = function(str){
        var result = null;
        if(typeof str =="string" && /^\s*\{/.test(str)){
            str = "("+str+")";
        }
        try{
            result = eval(str);
        }catch(e){}
        return result;
    }
})(Utils);

//实现Utils.createWatch
(function(){
    var WatchManager = {};
    /**
    *监控接口响应时间，如果长时间不返回，则上报日志
    *@param {Object} options 参数集合
    *@param {String} options.url 监控的接口地址
    *@param {Array} options.times 可选参数，监控的时间点,默认是10秒，20秒：[10000,20000]
    *@param {String} options.requestData 可选参数，请求该接口提交的数据
    *@returns {String} 返回一个watchId，可以供Utils.stopWatch使用
    *@example
    var watchId = Utils.createWatch({
        url:"xxxx",
        requestData:"<xml>xxxx</xml>",
        times:[10000,20000]
    });

    //当接口响应以后，停止监控
    Utils.stopWatch(watchId);

    */
    Utils.createWatch = function(options){
        var watchId = "Watch_" + Math.random();

        WatchManager[watchId] = {
            startTime:new Date,
            times:options.times || [10000,20000],
            url:options.url,
            requestData:options.requestData
        };

        return watchId;
    };
    /**
     *清除Utils.createWatch产生监控对象
     */
    Utils.stopWatch = function(watchId){
        delete WatchManager[watchId];
    };
    //轮询监控队列
    setInterval(function(){
        var now = new Date();
        for(var p in WatchManager){
            var w = WatchManager[p];
            for(var i=0;i<w.times.length;i++){
                if(now - w.startTime > w.times[i]){
                    log(w,w.times.shift());
                    i--;
                }
            }
            if(w.times.length == 0){
                Utils.stopWatch(p);
            }
        }
    },1000);
    //上报服务端，接口长时间不响应
    function log(item,time){
        Utils.Logger.delay({
            url:item.url,
            requestData:item.requestData,
            time:time
        });
    }
})();



(function ($) {
    if (!$) { return; }
    //top.Utils = Utils;
    //适配jquery的ajax通讯，但只处理中间件请求
    $._ajax_ = $.ajax;
    $.ajax = function (options) {
        if (/^\/+(mw|mw2|g2|addrsvr)\//.test(options.url)) {
            var conf = {
                headers: {},
                method: options.method,
                error: options.error,
                async: options.async
            };

            if (typeof options.data == "object") {
                if(!options.contentType){
                    options.contentType = "application/x-www-form-urlencoded"
                }
            }

            if (options.contentType) {
                conf.headers["Content-Type"] = options.contentType;
            }

            return top.M139.RichMail.API.call(options.url, options.data, function (e) {
                var isJson = options.dataType && options.dataType.toLowerCase() == "json";
                var result;
                if (isJson) {
                    result = e.responseData;
                } else {
                    result = e.responseText;
                }
                if (options.success) {
                    options.success(result);
                }
            }, conf);
        } else {
            return doJQAJAX();
        }
        function doJQAJAX() {
            return $._ajax_(options);
        }
    };
    $._get_ = $.get;
    $.get = function (url, data, callback) {
        if (/^\/+(mw|mw2|g2|addrsvr)\//.test(url)) {
            if (top._.isFunction(data)) {
                callback = data;
                data = null;
            }
            
            return top.M139.RichMail.API.call(url, data, function (e) {
                var isJson = false;
                var result;
                if (isJson) {
                    result = e.responseData;
                } else {
                    result = e.responseText;
                }
                if (callback) {
                    callback(result);
                }
            }, {
                method:"get"
            });
        } else {
            return doJQAJAX();
        }
        function doJQAJAX() {
            return $._get_.apply($, arguments);
        }
    }
})(window.jQuery);