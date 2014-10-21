/**
*framework用到的提示信息配置
*Mail139_Matrix_F2010\trunk\src\html\m\lighttpServer\js\controls
*/
var ControlsMessage = 
{
		//Mail139_Matrix_F2010\trunk\src\html\m\coremailServer\options\timeset.htm begin
		TimesetError:"您确定要删除这条定时发信记录吗？",
		//Mail139_Matrix_F2010\trunk\src\html\m\coremailServer\options\timeset.htm end	

		//Mail139_Matrix_F2010\trunk\src\html\m\coremailServer\selectimage\disk_img_3.htm begin		
		Disk_img_3ImgError:"请输入图片地址",
		Disk_img_3RightError:"请输入正确格式的图片地址",
		//Mail139_Matrix_F2010\trunk\src\html\m\coremailServer\selectimage\disk_img_3.htm end
		
		//Mail139_Matrix_F2010\trunk\src\html\m\coremailServer\selectimage\disk_img_1.htm begin
		Disk_img_1SelError:"请选择jpg、jpeg、gif、png、bmp格式的图片",
		Disk_img_1ImgError:"请选择图片",
		Disk_img_1InsertError:"插入图片失败，请重试",
		//Mail139_Matrix_F2010\trunk\src\html\m\coremailServer\selectimage\disk_img_1.htm end	
		
		//Mail139_Matrix_F2010\trunk\src\html\m\coremailServer\weather.htm begin
		WeatherSetSuccess:"设置成功",
		WeatherCityError:"请选择城市!",
		//Mail139_Matrix_F2010\trunk\src\html\m\coremailServer\weather.htm end
		
		//Mail139_Matrix_F2010\trunk\src\html\m\coremailServer\customfun.htm begin
		CustomfunRetainError:"请至少保留一项应用",
		//Mail139_Matrix_F2010\trunk\src\html\m\coremailServer\customfun.htm end
	
		//Mail139_Matrix_F2010\trunk\src\html\m\coremailServer\addfolder.htm begin
		AddfolderDirEmptyError:"文件夹名称不能为空",
		AddfolderDirOverError:"对不起，自定义文件夹个数不能超过{0}个",
		AddfolderMailError:"请填写邮箱地址",
		AddfolderWrongfulError:"邮件地址不合法，请重新填写！",
		AddfolderAddNotice:"正在添加...",
		//Mail139_Matrix_F2010\trunk\src\html\m\coremailServer\addfolder.htm end

    //ContactsAttrCard.js begin
    ContactWhiteError:"该帐号已经在白名单中",
    ContactTryError:"服务器繁忙,请稍后再试",
    ContactBlackError:"该帐号已经在黑名单中",
    ContactAddSuccess:"添加成功!",
    ContactSaveSuccess:"保存成功",
    ContactMobileEmpty:"请输入手机号码",
    ContactMobileError:"手机号码格式不正确，请重新填写！",
    ContactWhiteConfirm:"<div style='font-size:12px'>添加到手机邮件<span style='color:rgb(246,110,33)'>白名单</span>，此联系人来信通知<br/><span style='color:rgb(246,110,33)'>发送到手机</span><br />\
    您可以<a href='javascript:;' onclick='top.Links.show(\"mailnotify\",\"&whiteList=true\");FF.close();return false;'>添加多个地址到白名单</a></div>",
    ContactBlackConfirm:"<div style='font-size:12px'>添加到手机邮件<span style='color:rgb(246,110,33)'>黑名单</span>，此联系人来信通知<br/><span style='color:rgb(246,110,33)'>不发送到手机</span><br />\
    您可以<a href='javascript:;' onclick='top.Links.show(\"mailnotify\",\"&whiteList=true\");FF.close();return false;'>添加多个地址到黑名单</a></div>",
    ContactLoading:"加载中...",
    //ContactsAttrCard.js end
    
    //screenshot.js begin
    ScreenshotLoading:"文件上传中,请稍候...",
    //screenshot.js end
    
    //utils.js begin
    UtilsScreenError:"截屏功能仅能在IE浏览器下使用",
    UtilsDebugError:"调试器错误",
    UtilsInvalidError:"Passing invalid object: ",
    UtilsTimeoutError:"操作超时。<br>由于您长时间没有操作，<a  style='text-decoration:underline' href=\"javascript:document.location.href=\'{0}\'\">请重新登录</a>。",
    UtilsRequestError:"请求出错:",
    UtilsNoloadError:"数据加载失败，请稍后再试。",
    UtilsUploadConfirm:"上传文件必须安装139邮箱控件,是否安装?",
    UtilsUpdateConfirm:"您安装的上传控件已经不能使用,是否更新?",
    UtilsScreenInstallConfirm:"使用截屏功能必须安装139邮箱控件,是否安装?",
    UtilsUpgradeConfirm:"当前的截屏控件需要升级才可继续使用"
    //utils.js end
    
}
﻿if (!window.console) {
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
/**
 * ģ����࣬ʵ��������asp.net�����ݰ󶨣�ģ���л��ơ�
 * <pre>ʾ����<br>
 * <br>Repeater(document.getElementById('TemplateID'));
 * </pre>
 * @param {Object} obj ��ѡ������ģ�����������ID
 * @return {�޷���ֵ}
 */
function Repeater(obj){	
	this.HtmlTemplate=null;
	this.HeaderTemplate=null;
	this.FooterTemplate=null;
	this.ItemTemplate;
	this.ItemTemplateOrign;
	this.SeparateTemplate;
	this.Functions=null;
	this.DataSource=null;
	this.ItemContainer;
	this.ItemDataBound=null;
	this.RenderMode=0;	//0��ͬ����Ⱦ������һ������װ��1.�첽��Ⱦ��50��������һ��
	this.RenderCallback=null;
	this.Element;	
	RP=this;
	this.Instance=null;
	this.DataRow=null;	//��ǰ������
	if (typeof(obj) != undefined) {
		if (typeof(obj) == "string") {
			this.Element = document.getElementById(obj);
		}
		else {
			this.Element = obj;
		}
		//n=findChild(obj,"name","item");
		

	}

	this.DataBind = function() {
	    if (this.DataSource.length == 0) {
	        return;
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

	    reg1 = /\$\w+\s?/ig;
	    reg2 = /\@(\w+)\s?\((.*?)\)/ig;
	    var result = new Array();
	    for (var i = 0; i < this.DataSource.length; i++) {
	        var dataRow = this.DataSource[i];
	        dataRow["index"] = i;//׷������
	        this.DataRow = dataRow; //���õ�ǰ������
	        var row = this.ItemTemplate;

	        row = row.replace(reg2, function($0, $1, $2) { //�滻����
	            var name = $1.trim();
	            var paramList = $2.split(",");
	            var param = new Array();
	            for (var i = 0; i < paramList.length; i++) {
	                param.push(dataRow[paramList[i]]);
	            }
	            if (RP.Functions[name]) {
	                //return RP.Functions[name](param);
	                var context = RP;
	                if (RP.Instance) {
	                    RP.Instance.DataRow = dataRow;
	                    context = RP.Instance;
	                }
	                return RP.Functions[name].apply(context, param)
	            }


	        });
	        row = row.replace(reg1, function($0) { //�滻����
	            m = $0.substr(1).trim();
				if(dataRow[m]!=undefined){
					return dataRow[m];
				}else{
					return "$"+m;
				}
	            

	        });

	        var itemArgs = {	//�¼�����
	            index: i,
	            data: dataRow,
	            html: row
	        };
	        if (this.ItemDataBound) {	//�Ƿ��������а��¼�
	            var itemRet = this.ItemDataBound(itemArgs);
	            if (itemRet) {
	                row = itemRet;
	            }
	        }
	        result.push(row);
	    }
	    this.Render(result);



	};

	this.Render = function(result) {
	    if (!this.RenderCallback) {
            var str = result.join("");

            //��Ϊjscript 5.5���� String.prototype.replace(pattern, replacement)
            //���pattern��������ʽ, replacement�����е�$&��ʾ���ʽ��ƥ����ַ���
            //��: replace(/\d/g, "$&cm") �ͱ�ʾ��ÿһ������׷����cm��
            //��������Ķ�html��replace���ͻ���str���� $& ��λ�ò���������ItemTemplateOrign
            //������Ҫ��$��ת�� $$ ��ʾһ�� $������ʱ���Է��ʼ�����Ϊ $<b>$ test</b> ������
            if ('0'.replace('0',"$&")==='0'){
                str = str.replace(/\$/ig,"$$$$");
            }

	        var html = "";
	        if (this.HtmlTemplate) {
	            html = this.HtmlTemplate.replace(this.ItemTemplateOrign, str);
	        } else {
	            html = this.ItemTemplate.replace(this.ItemTemplateOrign, str);
	        }
	        if (this.HeaderTemplate)
	            html = this.HeaderTemplate + html;
	        if (this.FooterTemplate) {
	            html = html + this.FooterTemplate;
	        }
	        if(this.onRender){
	        	this.onRender(this.Element,html);
	        }else{
	        	this.Element.innerHTML = html;
	        }
	    } else {
	        var n = 0;
	        var el = this.Element;
	        var rowObj = null;
	        var args = { index: 0, element: el, html: "", rowCount: result.length };
            function exeCallBack(){
                //el.innerHTML=RP.HtmlTemplate.replace(RP.ItemTemplate,result[0]);
                args.index = n;
                args.element = el;
                args.html = result[n];
                RP.RenderCallback(args);
            }
			/*oldMode
	        var intervalId = setInterval(function() {
	            if (n < result.length) {
	                //el.innerHTML=RP.HtmlTemplate.replace(RP.ItemTemplate,result[0]);
	                args.index = n;
	                args.element = el;
	                args.html = result[n];
	                RP.RenderCallback(args);
	                n++;
	            } else {
	                clearInterval(intervalId);
	            }
	        }, 50);*/
            if (RP.Instance.RenderMode) {
                var intervalId = setInterval(function(){
                    if (n < result.length) {
                        exeCallBack();
                        n++;
                    }
                    else {
                        clearInterval(intervalId);
                    }
                }, 50);
            }
            else {
                while (n < result.length) {
                    exeCallBack();
                    n++;
                }
            }
	    }
	}		
}

Object.extend = function(A, $) {
    for (var _ in $) {
        A[_] = $[_];
    }
    return A;
};
//Object.extend(Repeater.prototype,DataList)
/**
 * DataList�ؼ��࣬������Repeater
 * <pre>ʾ����<br>
 * <br>DataList(document.getElementById('ListID'));
 * </pre>
 * @param {Object} obj ��ѡ������ģ�����������ID
 * @return {�޷���ֵ}
 */
function DataList(obj){
	this.Layout=1;	// 0Ϊʹ��div���ַ�ʽ, 1Ϊʹ��table���ַ�ʽ��
	this.RepeatColumns=5;
	this.ItemTemplate=null;
	this.id="table_list";
	this.Style_Cell=null;
	this.ulClassName="";
	this.RenderMode=0;//��Ⱦģʽ��0ͬ����1�첽50����
	var rp=new Repeater(obj),
	DL=this,
	table=document.createElement("table"),
	tr=null,
	ul=null;
	this.DataSource=null;
	this.Functions=null;
	this.DataRow=null;	//��ǰ������
	function renderTable(arg){
		var td = document.createElement("td");
	    td.innerHTML = arg.html;
	    if (DL.Style_Cell) {
	        td.className = DL.Style_Cell;
	    }
	    if (arg.index == 0) {	//��һ������
	        var table = document.createElement("table");
	        var tbody = document.createElement("tbody");
	        tr = document.createElement("tr");
	        table.appendChild(tbody);
	        tbody.appendChild(tr);
	        rp.Element.appendChild(table);
	        table.id = DL.id;
	        tr.appendChild(td);
	    } else if (arg.index == arg.rowCount - 1) {	//���һ������
	        tr.appendChild(td);
	    } else if (arg.index % DL.RepeatColumns == 0) {	//����
	        tbody = tr.parentNode;
	        tr = document.createElement("tr");
	        tbody.appendChild(tr);
	        tr.appendChild(td);
	    } else {
	        tr.appendChild(td);
	    }
	}
	function renderLiList(arg){
		if(arg.index==0)
		{
			ul=document.createElement("ul");
			ul.className=DL.ulClassName||"dataUl";
			rp.Element.appendChild(ul);
			ul.innerHTML=arg.html;
		}
		else
		{
			var html=ul.innerHTML;
			ul.innerHTML=html+arg.html;
		}
	}
	rp.RenderCallback = function(arg) {
		if(DL.Layout)
		{
			renderTable(arg);
		}
		else{
			renderLiList(arg);
		}
	    /*
var td = document.createElement("td");
	    td.innerHTML = arg.html;
	    if (DL.Style_Cell) {
	        td.className = DL.Style_Cell;
	    }

	    if (arg.index == 0) {	//��һ������
	        var table = document.createElement("table");
	        var tbody = document.createElement("tbody");
	        tr = document.createElement("tr");
	        table.appendChild(tbody);
	        tbody.appendChild(tr);
	        rp.Element.appendChild(table);
	        table.id = DL.id;
	        tr.appendChild(td);
	    } else if (arg.index == arg.rowCount - 1) {	//���һ������
	        tr.appendChild(td);
	    } else if (arg.index % DL.RepeatColumns == 0) {	//����
	        tbody = tr.parentNode;
	        tr = document.createElement("tr");
	        tbody.appendChild(tr);
	        tr.appendChild(td);
	    } else {
	        tr.appendChild(td);
	    }
*/


	};
	this.DataBind = function() {
	    var arr = new Array();
	    //arr.push("<table>");
	    arr.push("<!--item start-->");
	    arr.push(this.ItemTemplate);
	    arr.push("<!--item end-->");
	    //arr.push("</table>");
	    rp.HtmlTemplate = arr.join("");

	    rp.DataSource = this.DataSource;
	    rp.Functions = DL.Functions;
	    rp.Instance = DL;
	    rp.DataBind();

	};
	
	
}


﻿/**
 * 邮箱工具类
 */
MailTool = {
    /**
    * 验证邮箱地址是否合法
    * <pre>示例：<br>
    * MailTool.checkEmail('account@139.com');
    * </pre>
    * @param {string} text 验证的邮箱地址字符串
    * @return {Boolean}
    */
    checkEmail: function (text) {
        if (typeof text != "string") return false;
        text = $.trim(text);
        //RFC 2822
        var reg = new RegExp("^[a-z0-9\.!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$", "i");
        var result = reg.test(text);
        return result;
    },
    /**
    * 验证邮箱地址是否合法(另一种形式)
    * <pre>示例：<br>
    * MailTool.checkEmailText('"人名"&lt;account@139.com&gt;');
    * </pre>
    * @param {string} text 验证的邮箱地址字符串，如："人名"&lt;account@139.com&gt;
    * @return {Boolean}
    */
    checkEmailText: function (text) {//单个
        if (typeof text != "string") return false;
        text = $.trim(text);
        //无签名邮件地址
        if (this.checkEmail(text)) {
            return true;
        }
        //完整格式
        var r1 = new RegExp('^(?:"[^"]*"\\s?|[^<>;,，；"]*)<([^<>\\s]+)>$');
        var match = text.match(r1);
        if (match) {
            if (this.checkEmail(match[1])) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    },
    /**
    * 得到邮箱地址字符中的域名部分。
    * <pre>示例：<br>
    * MailTool.getDomain('account@domain.com');<br>rusult is "domain.com"
    * </pre>
    * @param {string} email 邮件地址字符串
    * @return {域字符串}
    */
    getDomain: function (email) {
        if (typeof email != "string") return "";
        email = $.trim(email);
        if (this.checkEmail(email)) {
            return email.split("@")[1].toLowerCase();
        } else if (this.checkEmailText(email)) {
            return email.match(/@([^@]+)>$/)[1].toLowerCase();
        } else {
            return "";
        }
    },
    /**
    * 返回邮箱地址的前缀部分。
    * <pre>示例：<br>
    * MailTool.getAccount('account@domain.com');<br>rusult is "account"
    * </pre>
    * @param {string} email 邮箱地址字符串
    * @return {邮箱前缀字符串}
    */
    getAccount: function (email) {
        if (typeof email != "string") return "";
        email = $.trim(email);
        if (this.checkEmail(email)) {
            return email.split("@")[0];
        } else if (this.checkEmailText(email)) {
            return email.match(/<([^@<>]+)@[^@<>]+>$/)[1];
        } else {
            return "";
        }
    },
    /**
    * 得到人名+邮箱中的人名部分。
    * <pre>示例1：<br>
    * <br>MailTool.getName('"人名"&lt;account@domain.com&gt;');<br>
    * rusult is "人名"<br>
    * <br>示例2：<br>
    * <br>MailTool.getName('account@domain.com');<br>
    * rusult is "account"
    * </pre>
    * @param {string} email 复合邮箱地址。
    * @return {人名部分字符串}
    */
    getName: function (email) {
        if (typeof email != "string") return "";
        email = $.trim(email);
        if (this.checkEmail(email)) {
            return email.split("@")[0];
        } else if (this.checkEmailText(email)) {
            var name = email.replace(/<[^@<>]+@[^@<>]+>$/, "");
            name = $.trim(name.replace(/"/g, ""));
            if (name == "") return MailTool.getAccount(email);
            return name;
        } else {
            return "";
        }
    },
    /**
    * 得到邮箱地址
    * <pre>示例：<br>
    * MailTool.getAddr('"人名"&lt;account@139.com&gt;');<br>
    * rusult is "account@139.com";
    * </pre>
    * @param {string} email 邮箱地址，如："人名"&lt;account@139.com&gt;。
    * @return {邮箱地址字符串}
    */
    getAddr: function (email) {
        if (MailTool.checkEmailText(email)) {
            return MailTool.getAccount(email) + "@" + MailTool.getDomain(email);
        }
        return "";
    },
    /**
    * 比对2个邮件地址是否相同
    * <pre>示例：<br>
    * MailTool.compareEmail(emailaddr1,emailaddr2);
    * </pre>
    * @param {string} mail1 邮箱1
    * @param {string} mail2 邮箱2
    * @return {Boolean}
    */
    compareEmail: function (mail1, mail2) {
        var m1 = MailTool.getAddr(mail1).toLowerCase();
        if (m1 && m1 == MailTool.getAddr(mail2).toLowerCase()) {
            return true;
        }
        return false;
    },
    /**
    * 验证多种形式的邮箱地址。
    * <pre>示例：<br>MailTool.parse('"人名"&lt;account@139.com&gt;;account@139.com;account@139.com');</pre>
    * @param {Object} mailText 邮箱地址字符串，如："人名"&lt;account@139.com&gt;;account@139.com;account@139.com
    * @return {Boolean}
    */
    parse: function (mailText) {
        var result = {};
        result.error = "";
        if (typeof mailText != "string") {
            result.error = "参数不合法";
            return result;
        }
        /*
        简单方式处理,不覆盖签名里包含分隔符的情况
        */
        var lines = mailText.split(/[;,，；]/);
        var resultList = result.emails = [];
        for (var i = 0; i < lines.length; i++) {
            var text = $.trim(lines[i]);
            if (text == "") continue;
            if (this.checkEmail(text)) {
                resultList.push(text);
            } else if (this.checkEmailText(text)) {
                resultList.push(text);
            } else {
                result.error = "邮件地址不合法:“" + text + "”";
            }
        }
        if (!result.error) {
            result.success = true;
        } else {
            result.success = false;
        }
        return result;
    },
    /**
    * 验证邮箱地址是否是139邮箱。
    * <pre>示例：<br>
    * MailTool.is139Email('account@139.com');
    * </pre>
    * @param {Object} 邮箱地址字符串。
    * @return {Boolean}
    */
    is139Email: function (email) {
        var domain = this.getDomain(email);
        if (domain === (top.mailDomain || "139.com")) return true;
        return false;
    },
    /**
    * 验证邮箱地址是否是带手机号的139邮箱。
    */
    is139NumberEmail: function (email) {
        var is139 = this.is139Email(email);
        if (is139) {
            return /^\d{11}$/.test(this.getAccount(email));
        }
        return false;
    },
    /**
    * 格式化发件人地址，传入"name","account@domain.com",返回"name"<account@domain.com>
    * <pre>示例：<br>
    * MailTool.getSendText('李福拉','lifula@139.com');
    * @return {String}
    * </pre>
    */
    getSendText: function (name, addr) {
        if (!Utils.isString(name) || !Utils.isString(addr)) return "";
        return "\"" + name.replace(/[\s;,；，<>"]/g, " ") + "\"<" + addr.replace(/[\s;,；，<>"]/g, "") + ">";
    },
    /**
    * 智能分割以字符串形式存在的多个邮件地址
    * <pre>示例：<br>
    * MailTool.splitAddr('李福拉<lifula@139.com>;lifl@richinfo.cn');
    * @return {Array}
    * </pre>
    */
    splitAddr: function (text) {
        var list = text.split(/[,;；，]/);
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            //如果分割完了以后前后2个地址都存在一个双引号，说明是因为人名当中有分隔符，所以得前后2个值合并成一个
            //if (item.indexOf("\"") == 0 && item.lastIndexOf("\"") == 0) {
            if (item.indexOf("\"") > -1 && item.indexOf("\"") == item.lastIndexOf("\"")) {
                var nextItem = list[i + 1];
                if (nextItem && nextItem.indexOf("\"") == nextItem.lastIndexOf("\"")) {
                    list[i] = item + " " + nextItem;
                    list.splice(i + 1, 1);
                    i--;
                }
            }
        }
        return list;
    }
}
/**
 * 号码工具类
 */
NumberTool = {
    /**
    * 加86前缀
    * <pre>示例：<br>
    * NumberTool.add86(手机号码);
    * </pre>
    * @param {Object} number 号码字符串或数字。
    * @return {加86前缀的号码}
    */
    add86: function(number) {
        if (typeof number != "string") number = number.toString();
        return number.trim().replace(/^(?:86)?(?=\d{11}$)/, "86");
    },
    /**
    * 去86前缀
    * <pre>示例：<br>
    * NumberTool.add86(86手机号码);
    * </pre>
    * @param {Object} number 号码字符串或数字。
    * @return {去86前缀的号码}
    */
    remove86: function(number) {
        if (typeof number != "string") number = number.toString();
        return number.trim().replace(/^86(?=\d{11}$)/, "");
    },
    isChinaMobileNumber: function(num) {
        num = num.toString();
        if (num.length != 13 && num.length != 11) return false;
        if (num.length == 11) {
            num = "86" + num;
        }
        var reg = new RegExp("^86(134|135|136|137|138|139|147|150|151|152|157|158|159|178|182|183|187|188|184)\\d{8}$");
		return reg.test(num);
    },
    isChinaMobileNumberText: function(text) {
        if (/^\d+$/.test(text)) {
            return this.isChinaMobileNumber(text);
        }
        var reg = /^(?:"[^"]*"|[^"<>;,；，]*)\s*<(\d+)>$/;
        var match = text.match(reg);
        if (match) {
            var number = match[1];
            return this.isChinaMobileNumber(number);
        } else {
            return false;
        }
    },
    getName: function(numberText) {
        if (this.isChinaMobileNumberText(numberText)) {
            if (numberText.indexOf("<") == -1) {
                return "";
            } else {
                return numberText.replace(/<\d+>$/, "").replace(/^["']|["']$/g, "");
            }
        }
        return "";
    },
    getNumber: function(numberText) {
        if (this.isChinaMobileNumberText(numberText)) {
            if (numberText.indexOf("<") == -1) {
                return numberText;
            } else {
                var reg = /<(\d+)>$/;
                var match = numberText.match(reg);
                if (match) {
                    return match[1];
                } else {
                    return "";
                }
            }
        }
        return "";
    },
    compareNumber: function(m1, m2) {
        if ( typeof(m1) === "undefined" || typeof(m2) === "undefined" ) {
            return false
        }

        m1 = m1.toString();
        m2 = m2.toString();
        m1 = this.remove86(this.getNumber(m1));
        m2 = this.remove86(this.getNumber(m2));
        if (m1 && m1 == m2) return true;
        return false;
    },
    parse: function(inputText) {
        var result = {};
        result.error = "";
        if (typeof inputText != "string") {
            result.error = "参数不合法";
            return result;
        }
        /*
        简单方式处理,不覆盖签名里包含分隔符的情况
        */
        var lines = inputText.split(/[;,，；]/);
        var resultList = result.numbers = [];
        for (var i = 0; i < lines.length; i++) {
            var text = $.trim(lines[i]);
            if (text == "") continue;
            if (this.isChinaMobileNumberText(text)) {
                resultList.push(text);
            } else {
                result.error = "该号码不是正确的移动手机号码：“" + text + "”";
            }
        }
        if (!result.error) {
            result.success = true;
        } else {
            result.success = false;
        }
        return result;
    },
    getSendText: function (name, number) {
        if (!Utils.isString(name) || !Utils.isString(number)) return "";
        return "\"" + name.replace(/[\s;,；，<>"]/g, " ") + "\"<" + number.replace(/\D/g,"") + ">";
    }
}


var __DateTool = {
    //获得月份的天数，不传参数默认返回本月天数
    daysOfMonth: function(d) {
        if (!d) d = new Date();
        var isLeapYear = this.isLeapYear(d.getFullYear());
        return [31, (isLeapYear ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][d.getMonth()];
    },
    //年份是否闰年
    isLeapYear: function(y) {
        if (!y) y = new Date();
        if (y.getFullYear) y = y.getFullYear();
        return (y % 400 == 0 || (y % 4 == 0 && y % 100 != 0));
    },
    //获得星期几
    WEEKDAYS: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    getWeekDayText: function(d) {
        if (!d) d = new Date();
        return this.WEEKDAYS[d.getDay()];
    }
};
if(!window.DateTool){
    //防止命名冲突
    DateTool = __DateTool;
}


/**
 * 新的选择组带新建组的控件。
 * <pre>示例：<br>
 * var chkGroup = new GroupCheckbox($('#group')[0], document);
 * chkGroup.check(['556465','98989','65656']);
 * var groupid = chkGroup.check();
 * </pre>
 * @param {Object} parent 父容器
 * @param {string} context 上下文document
 * @return {Object}
 */
function GroupCheckbox(parent, context){
    if (!parent) return;
    context = context || document;
    parent.style.visibility="hidden";
    parent.innerHTML = '<ul class="group"></ul><a href="javascript:;"><i class="plus"></i>新建分组</a>';
    var container = parent.firstChild;

    var lbl = context.createElement("LABEL");
    var ele = context.createElement("INPUT");
    ele.type = "checkbox";
    lbl.appendChild(ele);
    lbl.appendChild(context.createTextNode(" "));
    ele = context.createElement("LI");
    ele.appendChild(lbl);
    lbl = null;

    var row2 = context.createElement("LI");
    row2.innerHTML = "<span>默认保存到 &quot;未分组&quot;</span>";
    container.appendChild(row2);

    var groups = top.Contacts.data.groups;
    for (var i = groups.length - 1, k=groups[i]; i >= 0; k=groups[--i]){
        var gid = "Chk_" + k.GroupId;
        row2 = ele.cloneNode(true); //li
        lbl = row2.firstChild; //label
        lbl['for'] = gid;
        lbl.replaceChild(context.createTextNode(k.GroupName), lbl.lastChild);

        lbl = lbl.firstChild; //input
        lbl.id = gid;
        lbl.value = k.GroupId;

        container.appendChild(row2);
    }
    ele = null; row2 = null; lbl = null;
    parent.style.visibility = "visible";

    //加下方的新建组
    var btnAdd = parent.lastChild;
    btnAdd.onclick = function(){
        var Contacts = top.Contacts;
        var frameworkMessage = top.frameworkMessage;
        var FF = top.FF;
        var txtGName = context.createElement('INPUT');
        var btnOk = context.createElement('A');
        var btnCanel = context.createElement('A');
        var tip = frameworkMessage.addGroupTitle;
    
        btnAdd.style.display = "none"; 
        txtGName.value = tip;
        txtGName.maxLength=16;
        txtGName.className = "text gp def";
        
        btnOk.href = "javascript:void(0)";
        btnCanel.href = "javascript:void(0)";
        btnCanel.style.marginLeft = ".5em";
        btnOk.innerHTML = "添加";
        btnCanel.innerHTML = "取消";
    
        txtGName.onfocus = function(){
            if(this.value==tip){
                this.value = "";
                this.className = "text gp";
            } else {
                this.select();
            }
        };
        txtGName.onblur = function(){
            if (this.value.length==0){
               this.value = tip;
               this.className = "text def gp";
            }
        };
    
        btnOk.onclick = function(){
            var gpName = txtGName.value;
            if (gpName.length>0 && gpName != tip) {
                var _this = this;
                Contacts.addGroup(gpName,function(result){
                    if(result.success){
                        var p = _this.parentNode;
                        var lst = p.getElementsByTagName('UL')[0];
                        var li = context.createElement('LI');
                        li.innerHTML = "<label for='Chk_" + result.groupId + "'><input id='Chk_" + result.groupId + "' value='" + result.groupId + "' type='checkbox' checked='checked' />" + htmlEncode(gpName) + "</label>";
                        lst.appendChild(li);
                        lst.scrollTop=lst.scrollHeight;
                        btnCanel.onclick();
                    }else{
                        FF.alert(result.msg);
                    }
                });
            }
        };
        
        btnCanel.onclick = function(){
            parent.removeChild(txtGName);
            parent.removeChild(btnOk);
            parent.removeChild(btnCanel);
            btnAdd.style.display = "inline";
        };
    
        parent.appendChild(txtGName);
        parent.appendChild(btnOk);
        parent.appendChild(btnCanel);
    }

    this.container = container;
    this.check = function(checkedGroup){
        var chks = this.container.getElementsByTagName("INPUT");
        if (checkedGroup) {
            each(chks, function(i){
                i.checked = contain(i.value)
            });
        } else {
            var buff = [];
            each(chks, function(i){
                i.checked && buff.push(i.value);
            })
            return buff;
        }
        function each(arr, callback){
            for (var j=0, m=arr.length; j<m; j++){
                callback(arr[j]);
            }
        }
        function contain(v){
            for (var j=0, m=chks.length; j<m; j++){
                if (chks[j]==v) return true;
            }
            return false;
        }
    }

    function htmlEncode(str){
        return str.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;").replace(/\'/g, "&#39;")
        .replace(/ /g, "&nbsp;");       
    }
}
﻿/**
 * 自动完成菜单类
 * <pre>示例：<br>
 * <br>AutoCompleteMenu(document.getElementById("inputText"),inputCallback(),itemClickHandler());
 * </pre>
 * @param {Object} host 必选参数，宿主对象，如：文本框。
 * @param {Object} inputCallback 必选参数，输入框改变回调函数。
 * @param {Object} itemClickHandler 必选参数，搜索出的下拉列表点击回调函数。
 * @return {无返回值}
 */
function AutoCompleteMenu(host,inputCallback,itemClickHandler) 
{
    var This = this;
    var key = {
        up: 38,
        down: 40,
        enter: 13,
        space: 32,
        tab: 9,
        left: 37,
        right: 39
    };
    var isIE9 = top.$.browser.msie && top.$.browser.version > 8;
    var isShow = false;
    var doc = host.ownerDocument;
    var itemFocusColor = "#3399FE";
    var menuCSSText = "position:absolute;z-index:101;display:none;border:1px solid #99ba9f;height:200px;overflow:auto;overflow-x:hidden;background:white";
    var itemCSSText = "width:100%;line-height:20px;text-indent:3px;cursor:pointer;display:block;";
    var bgIframe = doc.createElement("iframe");
    with (bgIframe.style) {
        position = "absolute";
        zIndex = 100;
        display = "none";
    }
    var items = [];
    var container = doc.createElement("div");
    container.onclick = function(e) {
        Utils.stopEvent(e);
    }
    container.onmousedown = function(e) {
        Utils.stopEvent(e);
    }
    if (document.all) {
        $(document).click(hide);
    }
    function clear() {
        items.length = 0;
        container.innerHTML = "";
    }
    this.addItem = function(value, title) {
        if (typeof value == "object") {
            var span = value;
        } else {
            var span = doc.createElement("span");
            span.value = value;
            span.innerHTML = title;
        }
        if (document.all) {
            span.style.cssText = itemCSSText;
        } else {
            span.setAttribute("style", itemCSSText);
        }

        span.onmousedown = function() {
            itemClickHandler(this);
            hide();
            var key = host.getAttribute("setvaluehandler");
            if (key && window[key]) {
                window[key]();
            }
        }
        span.onmouseover = function() { selectItem(this); }
        span.menu = this;
        span.selected = false;
        items.push(span);
        container.appendChild(span);
    }
    function getSelectedItem() {
        var index = getSelectedIndex();
        if (index >= 0) return items[index];
        return null;
    }
    function getSelectedIndex() {
        for (var i = 0; i < items.length; i++) {
            if (items[i].selected) return i;
        }
        return -1;
    }
    //设置选中行
    function selectItem(item) {
        var last = getSelectedItem();
        if (last != null) blurItem(last);
        item.selected = true;
        item.style.backgroundColor = itemFocusColor;
        item.style.color = "white";
        menuScroll(item, container); //如果选中的项被遮挡的话则滚动滚动条
        function menuScroll(element, container) {
            var elementView = {
                //top:      element.offsetTop,这样写ff居然跟ie的值不一样
                top: getSelectedIndex() * element.offsetHeight,
                bottom: element.offsetTop + element.offsetHeight
            };
            var containerView = {
                top: container.scrollTop,
                bottom: container.scrollTop + container.offsetHeight
            };
            if (containerView.top > elementView.top) {
                container.scrollTop -= containerView.top - elementView.top;

            } else if (containerView.bottom < elementView.bottom) {
                container.scrollTop += elementView.bottom - containerView.bottom;
            }
        }
    }
    //子项失去焦点
    function blurItem(item) {
        item.selected = false;
        item.style.backgroundColor = "";
        item.style.color = "";
    }
    function show() {
        if (isShow) return;
        if (container.parentNode != doc.body) {
            doc.body.appendChild(container);
            doc.body.appendChild(bgIframe);
        }
        with (container.style) {
            //Utils.offsetHost(host, container);
            display = "block";
            width = Math.max(host.offsetWidth,400) + "px";
            Utils.offsetHost(host, container);  //为了能获取到container的宽度，放置此
            if (items.length < 7) {
                height = items[0].offsetHeight * items.length + 10 + "px";
            } else {
                height = items[0].offsetHeight * 7 + "px";
            }
        }
        var showBGIframe = false;
        if(document.all && !isIE9)showBGIframe = true;
        if(navigator.userAgent.indexOf("Chrome")>0){
            showBGIframe = true;
        }
        with (bgIframe.style) {
            left = container.style.left;
            top = container.style.top;
            width = Math.max(0, container.offsetWidth - 3) + "px";
            height = Math.max(0,container.offsetHeight - 3) + "px";
            if (showBGIframe) display = "";
        }
        selectItem(items[0]); //显示的时候选中第一项
        isShow = true;
    }
    function hide() {
        if (!isShow) return;
        container.style.display = "none";
        bgIframe.style.display = "none";
        clear();
        isShow = false;
    }
    if (document.all) {
        container.style.cssText = menuCSSText;
        host.attachEvent("onkeyup", host_onkeyup);
        host.attachEvent("onblur", host_onblur);
        host.attachEvent("onkeydown", host_onkeydown);
    } else {
        container.setAttribute("style", menuCSSText);
        host.addEventListener("keyup", host_onkeyup, true);
        host.addEventListener("blur", host_onblur, true);
        host.addEventListener("keydown", host_onkeydown, true);
    }
    //优化使用输入法无法捕获输入事件时，用计时器监听
    var listenTextChangeTimer = setInterval(function(){
        try{
            if(host.value && host.getAttribute("last_handler_value") != host.value){
                host_onkeyup({});
            }
        }catch(e){
            clearInterval(listenTextChangeTimer);
        }
    },1000);

    function host_onkeyup(evt) {
        switch ((evt || event).keyCode) {
            case key.enter:
            case key.up:
            case key.down:
            case key.left:
            case key.right: return;
        }
        hide();

        host.setAttribute("last_handler_value",host.value);

        inputCallback(This, evt || event);
        if (items.length > 0) show();
    }
    function host_onblur() {
        if (!document.all) hide();
    }
    function host_onkeydown(evt) {
        evt = evt || event;
        switch (evt.keyCode) {
            case key.space:
            case key.tab:
            case key.enter: doEnter(); break;
            case key.up: doUp(); break;
            case key.down: doDown(); break;
            case key.right:
            case key.left: hide(); break;
            default: return;
        }
        function doEnter() {
            var item = getSelectedItem();
            if (item != null) item.onmousedown();
            if (evt.keyCode == key.enter) {
                Utils.stopEvent(evt);
            }
        }
        function doUp() {
            var index = getSelectedIndex();
            if (index >= 0) {
                index--;
                index = index < 0 ? index + items.length : index;
                selectItem(items[index]);
            }
        }
        function doDown() {
            var index = getSelectedIndex();
            if (index >= 0) {
                index = (index + 1) % items.length;
                selectItem(items[index]);
            }
        }
    }
}


AutoCompleteMenu.createAddrMenu_compose = function(host, userAllEmailText) {}
AutoCompleteMenu.createAddrMenu = function(host, userAllEmailText, dataSource, splitLetter) {
    if (typeof userAllEmailText == "undefined") {
        userAllEmailText = true;
    }
    splitLetter = splitLetter || ";";
    var getMailReg = /^([^@]+)@(.+)$/
    var getInput = /(?:[;,；，]|^)\s*([^;,；，\s]+)$/;
    function autoLinkMan(menu) {
        var match = host.value.match(getInput);
        if (!match) return false;
        var txt = match[1].trim().toLowerCase();
        if (txt == "") return false;
        try {
            if (Utils.isChinaMobileNumber(txt) && txt.length == 11) {
                host.value = host.value.replace(/([;,；，]|^)\s*([^;,；，\s]+)$/, "$1" + txt + "@139.com;");
                return;
            }
        } catch (e) { }
        var inputLength = txt.length;
        var items = top.M2012.Contacts.getModel().getInputMatch({
            keyword: txt,
            filter: "email"
        });
        for (var i = 0; i < items.length; i++) {
            var matchInfo = items[i];
            var obj = matchInfo.info;
            var value = userAllEmailText ? "\"" + obj.name.replace(/\"/g, "") + "\"<" + obj.addr + ">" : obj.addr;
            var addrText = "";
            if (matchInfo.matchAttr == "addr") {
                matchText = obj.addr.substring(matchInfo.matchIndex, matchInfo.matchIndex + inputLength);
                addrText = obj.addr.replace(matchText, "[b]" + matchText + "[/b]");
                addrText = "\"" + obj.name.replace(/\"/g, "") + "\"<" + addrText + ">";
                addrText = addrText.encode().replace("[b]", "<span style='font-weight:bold'>").replace("[/b]", "</span>");
            } else if (matchInfo.matchAttr == "name") {
                matchText = obj.name.substring(matchInfo.matchIndex, matchInfo.matchIndex + inputLength);
                addrText = obj.name.replace(matchText, "[b]" + matchText + "[/b]");
                addrText = "\"" + addrText.replace(/\"/g, "") + "\"<" + obj.addr + ">";
                addrText = addrText.encode().replace("[b]", "<span style='font-weight:bold'>").replace("[/b]", "</span>");
            } else {
                addrText = "\"" + obj.name.replace(/\"/g, "") + "\"<" + obj.addr + ">";
                addrText = addrText.encode();
            }
            menu.addItem(value, addrText);
        }
    }
    if(!host.getAttribute("backspacedeleteoff")){
        $(host).keydown(function(e) {
            if (e.keyCode == 8 && !e.ctrlKey && !e.shiftKey) {
                var p = getTextBoxPos(this);
                if (!p || p.start != p.end || p.start == 0 || p.start < this.value.length) return;
                var lastValue = this.value;
                var deleteChar = lastValue.charAt(p.start - 1);
                if (/[;,；，>]/.test(deleteChar)) {
                    var leftText = lastValue.substring(0, p.start);
                    var rightText = lastValue.substring(p.start, lastValue.length);
                    var cutLeft = leftText.replace(/(^|[;,；，])[^;,；，]+[;,；，>]$/, "$1$1");
                    this.value = cutLeft + rightText;
                }
            }
        });
    }
    function isRepeat(arr, item) {
        for (var i = arr.length - 1; i >= 0; i--) {
            if (item.id && item.id == arr[i].id) return true;
        }
        return false;
    }
    function linkManItemClickHandler(item) {
        host.value = host.getAttribute('last_handler_value');
        host.value = host.value.replace(/；/g, ";").replace(/，/g, ",");
        host.value = host.value.replace(/([;,]|^)\s*([^;,\s]+)$/, "$1" + item.value + splitLetter);
    }
    init();
    function init() {
        new AutoCompleteMenu(host, autoLinkMan, linkManItemClickHandler);
    }
}

function getTextBoxPos(textBox) {
    var start = 0;
    var end = 0;
    if (typeof (textBox.selectionStart) == "number") {
        start = textBox.selectionStart;
        end = textBox.selectionEnd;
    }
    else if (document.selection) {
        textBox.focus();
        var workRange = document.selection.createRange();
        var selectLen = workRange.text.length;
        if (selectLen > 0) return null;
        textBox.select();
        var allRange = document.selection.createRange();
        workRange.setEndPoint("StartToStart", allRange);
        var len = workRange.text.length;
        workRange.collapse(false);
        workRange.select();
        start = len;
        end = start + selectLen;
    }
    return { start: start, end: end };
}

/**
 * 创建产生后后缀的工菜单
 * <pre>示例：<br>
 * <br>AutoCompleteMenu.createPostfix(document.getElementById("inputText"));
 * </pre>
 * @param {Object} host 必选参数，文本框。
 * @return{无返回值}
 */

AutoCompleteMenu.createPostfix = function(host) {
    new AutoCompleteMenu(
		host,
		function(menu) {
		    var arr = ["@sina.com", "@sohu.com", "@21cn.com", "@tom.com", "@yahoo.com.cn", "@yahoo.cn"];
		    var txt = host.value;
		    if ($.trim(txt) == "") return;
		    var match = txt.match(/\w+(@[\w.]*)/);
		    for (var i = 0; i < arr.length; i++) {
		        if (match) {
		            if (arr[i].indexOf(match[1]) == 0 && arr[i] != match[1]) {
		                var value = txt.match(/^([^@]*)@/)[1];
		                menu.addItem(value + arr[i], value + arr[i]);
		            }
		        } else {
		            menu.addItem(txt + arr[i], txt + arr[i]);
		        }
		    }
		},
		function(item) {
		    host.value = item.value;
		}
	)
}

/**
 * 包装自动完成菜单实例,从集合中找出联系人然后显示手机菜单
 * <pre>示例：<br>
 * <br>AutoCompleteMenu.createPhoneNumberMenuFromLinkManList(document.getElementById("inputText"),"张三",["张三","李四"])
 * @param {Object} host 必选参数，文本框。
 * @param {string} withAddrName 必选参数，联系人。
 * @param {Object} data 必选参数，联系人集合。
 * @return {自动完成菜单实例}
 */

AutoCompleteMenu.createPhoneNumberMenuFromLinkManList = function (host, withAddrName, data) {
    var regMatchPhoneNumber = /(?:^|[;,])\s*([^;,]+)$/;
    var randomName = "randomName" + Math.random();//生成一个用于缓存数据的随机变量名
    function textChanged(menu) {
        var match = host.value.match(regMatchPhoneNumber);
        var inputNumber = "";
        if (match) {
            inputNumber = match[1].toLowerCase();
        } else {
            return false;
        }
        var matchedCount = 0;

        var items = top.M2012.Contacts.getModel().getInputMatch({
            keyword: inputNumber,
            filter: "mobile"
        });

        var mapForRep = {}; //用来排除重复的哈希表

        for (var i = 0, j = items.length; i < j; i++) {
            var theinfo = items[i].info;

            var num = theinfo.addr.replace(/\D/g, "");
            var pname = theinfo.name.replace(/[<>"']/g, "");
            var nameIndex;

            if (num.indexOf(inputNumber) >= 0) {
                var str = num.replace(inputNumber, "<span style='color:Red'>" + inputNumber + "</span>")
                if (pname) str = "\"" + pname + "\"<" + str + ">";
                if (withAddrName) {
                    addMenuItem("\"" + pname + "\"<" + num + ">", str, num);
                } else {
                    addMenuItem(num, str, num);
                }
            } else if ((nameIndex = pname.toLowerCase().indexOf(inputNumber)) >= 0) {
                var _inputNumber = pname.substring(nameIndex, nameIndex + inputNumber.length);
                var str = pname.replace(_inputNumber, "<span style='color:Red'>" + _inputNumber + "</span>")
                if (pname) str = "\"" + str + "\"<" + num + ">";
                if (withAddrName) {
                    addMenuItem("\"" + pname + "\"<" + num + ">", str, num);
                } else {
                    addMenuItem(num, str, num);
                }
            } else if ((theinfo.quanpin && theinfo.quanpin.indexOf(inputNumber) >= 0) || (theinfo.jianpin && theinfo.jianpin.indexOf(inputNumber) >= 0)) {
                var str = "\"" + pname + "\"<" + num + ">";
                if (withAddrName) {
                    addMenuItem(str, str, num);
                } else {
                    addMenuItem(num, str, num);
                }
            }
            if (matchedCount >= 50) break;
        }
        function addMenuItem(value, text, number) {
            if (!mapForRep[number]) {
                menu.addItem(value, text);
                matchedCount++;
                mapForRep[number] = true;
            }
        }
        return !(matchedCount == 0);
    }
    function itemClick(item) {
        host.value = host.getAttribute('last_handler_value');
        host.value = host.value.replace(/([;,]|^)\s*([^;,\s]+)$/, "$1" + item.value + ",");
    }

    new AutoCompleteMenu(host, textChanged, itemClick, withAddrName);

}

/**
 * 包装自动完成菜单实例,根据输入手机号码显示搜索菜单
 * <pre>示例：<br>
 * <br>AutoCompleteMenu.createPhoneNumberMenuForSearchByMobile(document.getElementById("inputText"));
 * </pre>
 * @param {Object} host 必选参数，文本框。
 * @return{自动完成菜单实例}
 */

AutoCompleteMenu.createPhoneNumberMenuForSearchByMobile = function(host) {
    var regMatchPhoneNumber = /(?:^|[;,])\s*(\d+)$/;
    function textChanged(menu) {
        var match = host.value.match(regMatchPhoneNumber);
        var inputNumber = "";
        if (match) {
            inputNumber = match[1];
        } else {
            return false;
        }
        var matchedCount = 0;
        for (var i = 0, j = LinkManList.length; i < j; i++) {
            if (!LinkManList[i].addr) continue;
            var num = LinkManList[i].addr.toString();
            var pname = LinkManList[i].name;
            if (host.value.indexOf(num) >= 0) continue;
            if (num.indexOf(inputNumber) == 0) {
                var str = num.replace(inputNumber, "<span style='color:Red'>" + inputNumber + "</span>")
                if (pname) str = "(" + pname + ")" + str;
                menu.addItem(num, str);
                matchedCount++;
            }
            if (matchedCount >= 50) break;
        }
        return !(matchedCount == 0);
    }
    function itemClick(item) {
        host.value = host.getAttribute('last_handler_value');
        host.value = host.value.replace(/([;,]|^)\s*([^;,\s]+)$/, "$1" + item.value);
    }
    new AutoCompleteMenu(host, textChanged, itemClick);
}

/**
 * 包装自动完成菜单实例,根据输入提示手机号码集合显示搜索菜单
 * <pre>示例：<br>
 * <br>AutoCompleteMenu.createPhoneNumberMenu(document.getElementById("inputText"),手机1,手机2,手机3);
 * </pre>
 * @param {Object} host 必选参数，文本框。
 * @param {array} numbers 必选参数，手机号码数组。
 * @return {自动完成菜单实例}
 */

AutoCompleteMenu.createPhoneNumberMenu = function(host,numbers) {
    var regMatchPhoneNumber = /(?:^|[;,])\s*(\d+)$/;
    function textChanged(menu) {
        var match = host.value.match(regMatchPhoneNumber);
        var inputNumber = "";
        if (match) {
            inputNumber = match[1];
        } else {
            return false;
        }
        var matchedCount = 0;
        for (var i = 0, j = numbers.length; i < j; i++) {
            if (!numbers[i].number) continue;
            var num = numbers[i].number.toString();
            if (host.value.indexOf(num) >= 0) continue;
            if (num.indexOf(inputNumber) == 0) {
                var str = num.replace(inputNumber, "<span style='color:Red'>" + inputNumber + "</span>")
                if (numbers[i].name) str = "(" + numbers[i].name + ")" + str;
                menu.addItem(num, str);
                matchedCount++;
            }
            if (matchedCount >= 50) break;
        }
        return !(matchedCount == 0);
    }
    function itemClick(item) {
        host.value = host.getAttribute('last_handler_value');
        host.value = host.value.replace(/([;,]|^)\s*([^;,\s]+)$/, "$1" + item.value + ",");
    }
    new AutoCompleteMenu(host, textChanged, itemClick);
}

﻿/**
 * 提示消息类
 */
var Balloon = {
	/**
	 * 按目标元素指定的方向浮动消息框
	 * <pre><br>示例：<br>
	 * <br>Balloon.show(<br>
	 * <br>"消息内容",<br>
	 * <br>"right",<br>
	 * <br>100,<br>
	 * <br>{ x: 5, y: 10 }<br>
	 * <br>);<br>
	 * </pre>
	 * @param {string } text 可选参数，消息内容。
	 * @param {string} direction 必选参数，相对elem显示消息框的位置。如top,left,right,bottom。
	 * @param {Object} elem 必选参数，DOM对象。
	 * @param {int} width 必选参数，消息框宽度，整形。
	 * @param {Object} offset 可选参数，JSON对象，相对elem的偏移像素集合。如：{ x: 0, y: 0 }。
	 * @return {无返回值}
	 */
    show: function(text, direction, elem, width, offset) {
        var div = document.createElement("div");
        div.className = "FTUTip";
        var template = "<BLOCKQUOTE style='WIDTH: {width}px'>{text}</BLOCKQUOTE><BUTTON class='wsSmallCoolCloseButton' onclick='Balloon.close(this)'></BUTTON><DIV class='balloonArrow {direction}'></DIV></DIV>";

        var s = String.format(template, {
            text: text,
            direction: direction,
            width: width
        });

        div.innerHTML = s;

        var pos = Utils.findPosition(elem);
        document.body.appendChild(div);
        if (!offset) {
            offset = { x: 0, y: 0 };
        }

        switch (direction) {
            case "left":
                div.style.left = (pos[0] + Number(elem.offsetWidth) + offset["x"]) + "px";
                div.style.top = (pos[1] + offset["y"] - 15) + "px";
                break;
            case "right":
                div.style.left = (pos[0] - div.offsetWidth + offset["x"]) + "px";
                div.style.top = (pos[1] + offset["y"] - 15) + "px";
                break;
            case "top":
                div.style.left = pos[0] + "px";
                div.style.top = (pos[1] + elem.offsetHeight + 10 + offset["y"]) + "px";
                break;
            case "bottom":
                div.style.left = pos[0] + "px";
                div.style.top = (pos[1] - div.offsetHeight - 10 + offset["y"]) + "px";
                break;

        }



    },
	/**
	 * 关闭浮动消息框，实际上是从document中移除浮动消息框。
	 * <pre>示例：<br>
	 * Balloon.close(this);
	 * </pre>
	 * @param {Object} sender 必选参数，事件触法对象，如：点击关闭的按扭&lt;BUTTON onclick='Balloon.close(this)'/&gt;
	 * @return {无返回值}
	 */
    close: function(sender) {
        document.body.removeChild(sender.parentNode);
    }

};

/**
 * 提示工具类
 */
var Tooltip={
	tip:null,
	/**
	 * 以注册方式使用提示工具。提示内容为目标DOM对象的title属性。
	 * <pre>示例：<br>
	 * Tooltip.register(document.getElementById("tool"),window);
	 * </pre>
	 * @param {Object} target 必选参数，要加提示的目标DOM对象
	 * @param {Object} win 可选参数，当前window对象
	 * @return {无返回值}
	 */
	register:function(target,win){
		if(!win){
			win=window;
		}
	    var title=target.title;
	    target.title="";
	    var div=win.$("<div style='display:none' class='tooltip'></div>");
	    div.html(title);
	    $(target).hover(showTip,hideTip);
	    $(target).click(hideTip);
	    function showTip(){
	        Tooltip.show(div,target,win);
	    }
	    function hideTip(){
	        Tooltip.hide(div);
	    }
	},
	show:function(div,target,win){
		if(!win){
			win=window;
		}
		div.appendTo(win.document.body);
	        var offset=win.$(target).offset();
	        div.show();
			var left=offset.left;
			var top=offset.top-div.height()-win.$(target).height();
			if(offset.top<300){
				top=offset.top+win.$(target).height();
			}
			if(offset.left>400){
				left=offset.left-div.width()
			}
	        div.css({
	            left:left,
	            top:top
	        });
	},
	hide: function(div){
		div.hide();
	},
	/**
	 * 直接使用提示工具
	 * <pre>示例：
	 * Tooltip.guide(document.getElementById("tool"),"提示内容",window);
	 * </pre>
	 * @param {Object} target 必选参数，要加提示的目标DOM对象。
	 * @param {Object} text 可选参数，显示的提示内容。
	 * @param {Object} win 可选参数，当前window对象。
	 * @return {无返回值}
	 */
	guide:function(target,text,win){
		if(!win){
			win=window;
		}
		var div=win.$("<div style='display:none' class='tooltip'></div>");
	    div.html(text);
		Tooltip.show(div,target,win);
	}
};

﻿/*本类实现对元素的拖放，通用代码,依赖于工具类Utils.js(为了兼容firefox的event)*/
/**
 * 拖放管理类。通用代码,依赖于工具类Utils.js(为了兼容firefox的event)。
 * <pre>示例：<br>
 * <br>DragManager(document.getElementById("o"),document.getElementById("h"));
 * </pre>
 * @param {Object} o 必选参数，拖放的对象。
 * @param {Object} handleObj 必选参数，拖放手柄对象。
 * @return {无返回值}
 */
	function DragManager(o,handleObj){
		this.onDragStart=null;
		this.onDragMove=null;
		this.onDragEnd=null;
		this.orignX=0;
		this.orignY=0;
		var min_x=0,min_y=0,
		max_x=$(document.body).width()-$(o).width(),
		max_y=$(document.body).height()-$(o).height();
		var manager=this;
		var offset=[];
		//o.attachEvent("onmousedown",drag_mouseDown);
		if(handleObj){
		    handleObj.onmousedown=drag_mouseDown;
		}else{
		    o.onmousedown=drag_mouseDown;
		}
		this.startDrag=function(e){
			var x,y;
			e=Utils.getEvent();
			if(window.event){
				x=event.clientX+document.body.scrollLeft;
				y=event.clientY+document.body.scrollTop;
			}else{
				x=e.pageX;
				y=e.pageY;
			}
	
	
			if (o.setCapture) {	//在窗口以外也能响应鼠标事件
				o.setCapture();
			}else if (window.captureEvents) {
				window.captureEvents(Event.MOUSEDOWN | Event.MOUSEMOVE | Event.MOUSEUP);
			}
					
			var postion=Utils.findPosition(o);
			if(postion[0]==0){
				offset=[0,0];
			}else{
				offset=[x-postion[0],y-postion[1]];
			}

			//window.status=x+","+y;
			if(manager.onDragStart){
				manager.onDragStart({x:x,y:y});
			}
			Utils.addEvent(document,"onmousemove",drag_mouseMove);
			Utils.addEvent(document,"onmouseup",drag_mouseUp);
			Utils.stopEvent(e);//阻止事件泡冒
		}
		this.stopDrag=function(){
			if (o.releaseCapture){
				o.releaseCapture();
			}
			else if (window.captureEvents) {
				window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
			}

			if(manager.onDragEnd){
				manager.onDragEnd();
			}
			
			Utils.removeEvent(document,"onmousemove",drag_mouseMove);
			Utils.removeEvent(document,"onmouseup",drag_mouseUp);

		}
		
		function drag_mouseMove(e){
			var newX,newY;
			if(window.event){
				newX=event.clientX+document.body.scrollLeft;
				newY=event.clientY+document.body.scrollTop;
			}else{
				newX=e.pageX;
				newY=e.pageY;
			}
			var _x=newX-offset[0];
			var _y=newY-offset[1];
			if(_x<0){
			    _x=0;
			}else if(_x>max_x){
			    _x=max_x;
			}
			if(_y<0){
			    _y=0;
			}else if(_y>max_y){
			    _y=max_y;
			}
			o.style.left = _x+"px";
			o.style.top = _y+"px";
			
			if(manager.onDragMove){
				manager.onDragMove({x:newX,y:newY});
			}
		}
		function drag_mouseDown(e){
			manager.startDrag(e);
		}
		function drag_mouseUp(e){
			manager.stopDrag(e);
		}
		this.getOffset=function(o,isPoint){
			var w=isPoint?1:o.offsetWidth;//是1个像素的点
			var h=isPoint?1:o.offsetHeight;
			for(var r = {l: o.offsetLeft, t: o.offsetTop, r: w, b:h};
				o = o.offsetParent; r.l += o.offsetLeft, r.t += o.offsetTop);
				return r.r += r.l, r.b += r.t, r;
		}
		
		//碰撞检测
		this.hitTest=function(o, l){
			for(var b, s, r = [], a = this.getOffset(o), j = isNaN(l.length), i = (j ? l = [l] : l).length; i;
			b = this.getOffset(l[--i],true), (a.l == b.l || (a.l > b.l ? a.l <= b.r : b.l <= a.r))
			&& (a.t == b.t || (a.t > b.t ? a.t <= b.b : b.t <= a.b)) && (r[r.length] = l[i]));
			return j ? !!r.length : r;
		};
		
	};
﻿/**
 * 在线编辑器类
 */
EditorManager = {};
/**
 * 创建编辑器
 * <pre>示例：<br>
 * <br>EditorManager.create(param);
 * </pre>
 * @param {Object} param 必选参数，创建编辑的属性集合参数。
 * @return {无返回值}
 */
EditorManager.create = function(param) {
    if (!param.container) return;
    var editorUrl = "";
    editorUrl ="http://"+ top.location.host;
    if (param.version == 2) {
        editorUrl += "/m2012/html/oldeditor/editor2.0.htm?";
    } else {
        editorUrl += "/m2012/html/oldeditor/editor.htm?";
    }
    try{
        editorUrl += "sid=" + top.$App.getSid();
    } catch (e) { }
    if (param.hidToolBar) {
        editorUrl += "&hidToolBar=true";
    }
    if (param.onload) {
        this.onload = param.onload;
    }
    if (param.imageButtonOnClick) {
        window["_imageButtonOnClick"] = param.imageButtonOnClick;
        editorUrl += "&imageButtonOnClick=_imageButtonOnClick";
    }
    if (param.screenShotButtonOnClick) {
        window["_screenShotButtonOnClick"] = param.screenShotButtonOnClick;
        editorUrl += "&screenShotButtonOnClick=_screenShotButtonOnClick";
    }
    if (param.showFace) {
        editorUrl += "&showFace=true";
    }
    if(param.onload){
        this.onload = param.onload;
    }
    var htmlCode = "<iframe name='theEditorFrame' id='theEditorFrame' style='width:100%;height:100%' frameBorder='0' scrolling='no' src='" + editorUrl + "'></iframe>";
    if (param.width) {
        htmlCode = htmlCode.replace("width:100%", "width:" + param.width.toString().replace(/(\d+)$/, "$1px"));
    }
    if (param.height) {
        htmlCode = htmlCode.replace("height:100%", "height:" + param.height.toString().replace(/(\d+)$/, "$1px"));
    }
    param.container.innerHTML = htmlCode;
    EditorManager.param = param;
}
/**
 * 得到编辑器html格式的内容
 * <pre>示例：<br>
 * <br>EditorManager.getHtmlContent();
 * </pre>
 * @return {string}
 */
EditorManager.getHtmlContent = function() {
    return window.frames["theEditorFrame"].theEditorBox.getHtmlContent();
}
/**
 * 写入编辑器内容
 * <pre>示例：<br>
 * <br>EditorManager.setHtmlContent();
 * </pre>
 * @param {string} content 可选参数，写入内容。
 * @return {string}
 */
EditorManager.setHtmlContent = function(content) {
   if(window.frames["theEditorFrame"].theEditorBox&&window.frames["theEditorFrame"].theEditorBox.setHtmlContent){
       return window.frames["theEditorFrame"].theEditorBox.setHtmlContent(content);
	}
}
/**
 * 写入编辑器图片地址
 * @param {string} url 必选参数，图片链接地址。
 * @return {无返回值}
 */
EditorManager.insertImage = function(url) {
    window.frames["theEditorFrame"].theEditorBox.insertImage(url);
}
/**
 * 重置编辑器
 * <pre>示例：<br>
 * <br>EditorManager.toggleToolBar();
 * </pre>
 * @return{无返回值}
 */
EditorManager.toggleToolBar = function() {
    var win = window.frames["theEditorFrame"];
    if (win.toggleToolBar) {
        win.toggleToolBar();
    } else {
        win.$("#toolbar").toggle();
    }
    win.resizeAll();
}
EditorManager.getHtmlToTextContent = function() {
    return window.frames["theEditorFrame"].theEditorBox.getHtmlToTextContent();
}
/**
 * 设置编辑器高度
 * <pre>示例：<br>
 * <br>EditorManager.setHeight(800);
 * </pre>
 * @param {Object} height 必选参数
 * @return {无返回值}
 */
EditorManager.setHeight = function(height) {
    height = height.toString().replace(/(?:px)?$/, "px");
    var container = EditorManager.param.container;
    var iframe = container.getElementsByTagName("iframe")[0];
    container.style.heigth = height;
    iframe.style.height = height;
    try {
        iframe.contentWindow.resizeAll();
    } catch (e) { }
}
EditorManager.onload=function(){}
﻿/**
 * 格式化文件框组件，必须引用jquery1.2以上版本
 * <pre>示例：<br>
 * <br>FormatTextarea(<'input':文本框对象,'splitStr':',','maxHeight':188>);
 * </pre>
 * @author sunsc
 * @param {Object} param 参数对象
 * @param {Object} param.input 必选属性 要格式化的textarea对象。jquery格式
 * @param {string} param.splitStr 可选参数 格式化分割符
 * @param {int} param.maxHeight 可选参数 文本框最大高度
 * @param {int} param.whichCode 可选参数 键盘ascii码
 */
var FormatTextarea = window.FormatTextarea = function(param){
    return param ? new FormatTextarea.fn.mainInit(param) : null;
};
FormatTextarea.fn = FormatTextarea.prototype = {
    /**
     * 构造方法
     * @param {Object} param 参数对象
     * @param {Object} param.input 必选属性 要格式化的textarea对象。jquery格式
     */
    mainInit: function(param){
        if (!param || !param.input || !(param.input instanceof Object)) {
            return this;
        }
        var inputHeight = param.input[0].scrollHeight;//输入框内行高度
        inputHeight = $.browser.msie ? inputHeight : inputHeight - 1;//初始化、调整高度
        //inputHeight = inputHeight >= 18 ? 18 : inputHeight;
        this.inputHeight = inputHeight;//默认输入框高度
        this.formatHanlder = null;
        this.whichCode = param.whichCode ? parseInt(param.whichCode, 10) : (param.input.attr("which").trim() == "" ? 188 : parseInt(param.input.attr("which").trim(), 10));//ascii码
        this.whichCode = isNaN(this.whichCode) ? 188 : this.whichCode;
        this.maxHeight = param.maxHeight ? parseInt(param.maxHeight, 10) : (param.input.attr("maxHeight").trim() == "" ? 188 : parseInt(param.input.attr("maxHeight").trim(), 10));//最大高度
        this.maxHeight = isNaN(this.maxHeight) ? 188 : this.maxHeight;
        this.splitStr = param.splitStr ? param.splitStr : param.input.attr("whichChr").trim() == "" ? "," : param.input.attr("whichChr").trim();//分割符
        this.regEvent(param);//事件绑定
        return this;
    },
    /**
     * 注册事件
     * <pre>示例：<br>
     * <br/>var ft=FormatTextarea(<'input':文本框对象>);
     * <br/>ft.regEvent(<'input':文本框对象>);
     * </pre>
     * @param {Object} param 参数对象
     * @param {Object} param.input 必选属性 要格式化的textarea对象。jquery格式
     */
    regEvent: function(param){
        if (!param || !param.input || !(param.input instanceof Object)) {
            return this;
        }
        var theThis = this;
        var shiftDown = false;//shift键是否按下
        param.input.keyup(function(e){//输入框键按起
            if (e.which == 13) {//回车事件
                if (param.input.val().replace(/\n/g, "") == "") {//输入框没有值
                    param.input.val("");
                    return false;
                }
                param.onlyEnter = true;
                theThis.calcTheHeigth(param);//计算输入框高度
                return false;
            }
            if (e.which != 16) {//shift事件
                if (e.which == theThis.whichCode && !shiftDown) {
                    theThis.foramtContents({
                        "input": $(this),
                        "errList": [],
                        "eventCode": e.which
                    });
                }
                shiftDown = false;
            }
            else {
                shiftDown = true;
            }
        });
        /**
         * 粘贴事件
         */
        param.input[0].onpaste = function(){
            theThis.foramtContents({
                "input": $(this),
                "errList": []
            });
        }
        return this;
    },
    /**
     * 格式化内容
     * <pre>示例：<br>
     * <br/>var ft=FormatTextarea(<'input':文本框对象>);
     * <br/>ft.foramtContents(<"input":文本框对象>);
     * </pre>
     * @param {Object} param 参数对象
     * @param {Object} param.input 必选属性 要格式化的textarea对象。jquery格式
     */
    foramtContents: function formatLine(param){
        if (!param || !param.input || !(param.input instanceof Object)) {
            return this;
        }
        var theThis = this;
        if (this.formatHanlder) {
            clearTimeout(formatHanlder);
        }
        formatHanlder = setTimeout(function(){
            var oldValue = param.input.val().trim();//得到输入框值
            if (param.errList && param.errList.length > 0) {
                oldValue = param.errList.join(theThis.splitStr);//错误的格式内容
            }
            if (oldValue != "") {
                var arrValue = oldValue.replace(/\n/gi, "").split(theThis.splitStr);//转换成数组
                var l = arrValue.length;//长度
                var arrTemp = [];//临时数组，保存格式化后的值
                $.each(arrValue, function(i, data){
                    if (i == (l - 1))//最后一个值不加逗号和回车
                        arrTemp.push($.trim(data));
                    else 
                        arrTemp.push($.trim(data) + theThis.splitStr + "\n");
                });
                param.input.val(arrTemp.join(""));//赋值到输入框
                param.count = l;//格式化后行数
                param.onlyEnter = false;//内容是否只有回车
                theThis.calcTheHeigth(param);//计算高度
                arrValue = arrTemp = null;
            }
            if (param.callback) {
                callback.call(theThis);
            }
        }, 800);
        return this;
    },
    /**
     * 计算高度
     * @param {Object} param 参数对象
     * @param {Object} param.input 必选属性 要格式化的textarea对象。jquery格式
     * @param {int} param.count 可选属性 格式化后的行数
     * @param {Boolean} param.onlyEnter 可选属性 内容是否只有回车字符
     */
    calcTheHeigth: function(param){
        if (!param || !param.input || !(param.input instanceof Object)) {
            return this;
        }
        var currHeight = this.maxHeight;
        try {
            if (param.onlyEnter) {
                currHeight = param.input[0].scrollHeight;
                var currVal = param.input.val().replace(/\n\n/g, "\n");
                param.input.val(currVal);
            }
            else {//计算行高
                if (param.count) 
                    currHeight = parseInt(param.count > 1 ? $.browser.msie ? this.inputHeight * param.count - (param.count * 3) : this.inputHeight * param.count : this.inputHeight, 10);
            }
            if (currHeight >= this.maxHeight) {
                param.input.css({//超过最大高度，显示滚动条
                    "overflow": "scroll",
                    "overflow-y": "scroll",
                    "overflow-x": "hidden"
                }).height(this.maxHeight);
            }
            else {
                param.input.height(currHeight);//只调高度
            }
        } 
        catch (e) {
            return this;
        }
        return this;
    }
};
FormatTextarea.fn.mainInit.prototype = FormatTextarea.fn;

﻿/**
 * 图片缩放编辑菜单类
 * <pre>示例：<br>
 * <br>ImgEditorMenu.init(el,pDoc,ImgDoc,ImgEditorMenuBarHtml,options);
 * </pre>
 *@param {obj} el 控制的对象
 *@param {obj} pDoc  控件放置的父对象
 *@param {obj} ImgDoc 图片所在的父对象
 *@param {string} ImgEditorMenuBarHtml  控件html
 *@param {obj} options 可选 控件的配置
 */
ImgEditorMenu = {};

//显示
ImgEditorMenu.show = function(){
    var that = this;
    clearTimeout(that.hideTimer);
    that.slider.attr('title' , that.sliderTitle).css({ 'width':that.sliderLen , 'left':that.sliderLeft });
    that.setOffset();
    that.element.show();
}

//计算浮层的位置
ImgEditorMenu.setOffset = function(){
    var that = this;

    var offset            = that.controlEl.offset();
    var elLeft            = offset.left;
    var elTop             = offset.top;

    var ImgDocScrollLeft  = that.ImgDoc.scrollLeft();
    var ImgDocScrollTop   = that.ImgDoc.scrollTop();

    elLeft                = (elLeft - ImgDocScrollLeft) < 0 ? 0 : (elLeft - ImgDocScrollLeft);
    elTop                 = (elTop - ImgDocScrollTop) < 0 ? 0 : (elTop - ImgDocScrollTop);

    elLeft                = elLeft + that.options.left;
    elTop                 = elTop + that.options.top;

    var pDocScrollLeft    = that.pDoc.scrollLeft();
    var pDocScrollTop     = that.pDoc.scrollTop();

    that.left             = pDocScrollLeft > elLeft ? pDocScrollLeft : elLeft;
    that.top              = pDocScrollTop > elTop ? pDocScrollTop : elTop;
    
    that.element.css({ 'left':that.left , 'top':that.top });
}

//隐藏浮层
ImgEditorMenu.hide = function(delay){
    var that = this;
    if(that.element){
        if(delay){
            that.hideTimer = setTimeout(function(){
                if(that.element){
                    that.element.hide();
                    that.remove();
                }
            },300)
        }else{
            that.element.hide();
            that.remove();
        }
    }
}

//移除浮层
ImgEditorMenu.remove = function(){
    this.element.remove();
    delete this.element;
}

//点击
ImgEditorMenu.click = function(e) {
    var func = e.target.getAttribute("func");
    if (func && ImgEditorMenu[func]) {
        ImgEditorMenu[func](e);
        return false;
    }
}
//点击放大按钮
ImgEditorMenu.zoomout = function(){
    var that = this;
    that.zoomCur--;
    that.zoomCur = that.zoomCur < that.zoomMin ? that.zoomMin : that.zoomCur;
    that.zoommove();
}
//点击缩小按钮
ImgEditorMenu.zoomin = function(){
    var that = this;
    that.zoomCur++;
    that.zoomCur = that.zoomCur > that.zoomMax ? that.zoomMax : that.zoomCur;
    that.zoommove();
}
//1:1 原始尺寸
ImgEditorMenu.zoomratio = function(e){
    var that = this;
    that.zoomCur = that.zoomMax/2;
    $(e.target).removeClass('menubaRatio').addClass('menubarall').attr('title','最佳尺寸').attr('func','zoombarall');
    that.zoommove();
}
//zoombarall 最佳尺寸
ImgEditorMenu.zoombarall = function(e){
    var that = this;
    var bestSize = that.ImgDoc.width();
    var imgW = that.controlElW;
    that.zoomCur = (bestSize/imgW/that.scale)*100;
    that.zoomCur = Math.round(that.zoomCur * 10)/10; //精确到小数点后1位
    that.zoomCur = that.zoomCur > that.zoomMax ? that.zoomMax : that.zoomCur;
    $(e.target).removeClass('menubarall').addClass('menubaRatio').attr('title','原始尺寸').attr('func','zoomratio');
    that.zoommove();
}

ImgEditorMenu.zoommove = function(){
    var that = this;
    that.sliderTitle = that.zoomCur * that.scale + '%';
    that.sliderLeft = (that.zoomCur - that.zoomMin) * that.mark + that.sliderLeftMin;
    that.slider.attr('title',that.sliderTitle).css({'left':that.sliderLeft});
    that.controlEl.attr('sliderTitle',that.sliderTitle).attr('sliderLeft',that.sliderLeft);
    that.controlEl.css({ 'width' : that.zoomCur * that.scale * that.controlElW/100 , 'height': that.zoomCur * that.scale * that.controlElH/100 });
    that.setOffset();
}

ImgEditorMenu.mousedown = function(e){
    var that = ImgEditorMenu;
    var id = e.target.id;
    if(id && id == 'zoomhandle'){
        that.moveStart = true;
        that.startX = e.clientX;
    }
}

ImgEditorMenu.mouseover = function(e){
    var that = ImgEditorMenu;
    clearTimeout(that.hideTimer);
}

ImgEditorMenu.mousemove = function(e){
    var that = ImgEditorMenu;
    if(that.moveStart){
        that.moveX = e.clientX - that.startX;
        that.startX = e.clientX;
        that.move();
    }
}

ImgEditorMenu.mouseup = function(e){
    var that = ImgEditorMenu;
    if(that.moveStart){
        that.moveX = e.clientX - that.startX;
        that.startX = e.clientX;
        that.moveStart = false;
        that.move();
    }
}

ImgEditorMenu.mouseout = function(e){
    var that = ImgEditorMenu;
    if(that.moveStart && (e.clientY < that.top || e.clientY > that.top + that.height)){
        that.moveStart = false;
        that.move();
    }
    that.hide(true);
}

ImgEditorMenu.move = function(){
    var that = this;
    that.sliderLeft = that.sliderLeft + that.moveX;
    if(that.sliderLeft < that.sliderLeftMin){
        that.sliderLeft = that.sliderLeftMin;
    }else if(that.sliderLeft > that.sliderLeftMax){
        that.sliderLeft = that.sliderLeftMax;
    }
    var scaleNum =(that.sliderLeft - that.sliderLeftMin + that.mark ) * that.scalePerPx;
    that.zoomCur = scaleNum/that.scale;
    that.sliderTitle =  scaleNum + '%';
    that.slider.attr('title',that.sliderTitle).css({'left':that.sliderLeft});
    if(!that.moveStart){
        that.controlEl.attr('sliderTitle',that.sliderTitle).attr('sliderLeft',that.sliderLeft);
        that.controlEl.css({'width' : scaleNum * that.controlElW/100, 'height': scaleNum * that.controlElH/100});
        that.setOffset();
    }
}

//删除图片
ImgEditorMenu.del = function(){
    this.hide();
    this.controlEl.remove();
}


ImgEditorMenu.init = function(el,pDoc,ImgDoc,ImgEditorMenuBarHtml,options){
    var that = this;
    that.options = {
        zoomMin: 1,  //最小缩放比例 25%
        zoomMax: 8,  //最大缩放比例 200%
        scale: 25, //
        mark: 10,
        sliderLen: 10,
        top: 0,
        left: 0,
        minWidth: 400,  //图片显示缩放条的最小值
        minHeight: 300
    }
    
    for(i in options) that.options[i] = options[i];

    that.moveStart = false;
    
    that.controlEl     = el;
    that.pDoc          = pDoc;
    that.ImgDoc        = ImgDoc;
    
    that.zoomMax       = that.options.zoomMax;
    that.zoomMin       = that.options.zoomMin;
    that.mark          = that.options.mark;
    that.scale         = that.options.scale;
    that.sliderLen     = that.options.sliderLen;
    
    that.minWidth      = that.options.minWidth;
    that.minHeight     = that.options.minHeight;
    
    that.zoom          = that.zoomMax - that.zoomMin;
    that.slideLen      = that.zoom * that.mark;
    that.scalePerPx    = that.scale / that.mark;
    that.sliderLeftMin = -that.sliderLen/2;
    that.sliderLeftMax = that.slideLen + that.sliderLeftMin;

    that.sliderTitle   = el.attr('sliderTitle') || '100%';                                      //默认为100%
    that.scaleCur      = parseFloat(that.sliderTitle);
    that.scaleCur      = isNaN(that.scaleCur)? 100 : that.scaleCur;
    that.zoomCur       = that.scaleCur/that.scale;
    var sliderLeft     = el.attr('sliderLeft')/1;
    sliderLeft         = isNaN(sliderLeft) ? null : sliderLeft;
    that.sliderLeft    = sliderLeft || (that.zoomCur - that.zoomMin) * that.mark + that.sliderLeftMin;  //滑块位置
    
    that.controlElW    = el.width()/that.scaleCur*100; //原图大小
    that.controlElH    = el.height()/that.scaleCur*100;
    
    if (!that.element || !pDoc.find('div#divImgEditorMenuBar')) {
        pDoc.append(ImgEditorMenuBarHtml);   //用appendTo，IE6下报错
        that.element = $(pDoc.find('div#divImgEditorMenuBar'));
        that.height = that.element.outerHeight(true);
        that.width  = that.element.outerWidth(true);
        that.slider = that.element.find('a#zoomhandle');
        that.slider.parent().width(that.slideLen);
        
        //连写，ie上有的事件响应不了，故分开写
        that.element.click(that.click);
        that.element.mouseover(that.mouseover);
        that.element.mousedown(that.mousedown);
        that.element.mousemove(that.mousemove);
        that.element.mouseup(that.mouseup);
        that.element.mouseout(that.mouseout);
    }
    if(that.controlElW < that.minWidth || that.controlElH < that.minHeight) return;   // 若图片不够大，则不显示
    that.show();
}
﻿if (window.$) {
	/**
	 * 以get方式请求服务器得到xml格式的数据
	 * <pre>示例：<br>
	 * <br>$.loadXML('page.jsp',jsonData,fun);
	 * </pre>
	 * @param {string} _url 必选参数，请求地址。
	 * @param {Object} _data 可选参数，请求数据。
	 * @param {function} _callback 必选参数，回调函数。
	 * @return {无返回值}
	 */
	$.loadXML = function(_url, _data, _callback){
		$.ajax({
			type: "get",
			url: _url,
			data: _data,
			async: true,
			dataType: "html",
			success: function(xml){
				var retObj = parseXML(xml);
				_callback(retObj);
			}
		});
		
	}
	/**
	 * 以post方式请求服务器
	 * @param {string} _url 必选参数，请求地址。
	 * @param {Object} form 可选参数，请求数据。
	 * @param {Object} _callback 必选参数，回调函数。
	 * @return {无返回值}
	 */
	$.postForm = function(_url, form, _callback){
		var formData = getForm(form);
		$.post(_url, formData, _callback, null);
	}
}
/**
 * 加载xml，反加xml对象
 * <pre>示例：<br>
 * <br>parseXML(xmlstr);
 * </pre>
 * @param {string} xml 必选参数，xml字符串。
 * @return {xml对象}
 */
function parseXML(xml){
		var oXmlDom,oXmlElement;
			/*去除非法的xml注释部分
			 *当xml包含头部声明时<?xml version="1.0" encoding="UTF-8"?>需要下面这行代码
			 *xml = xml.replace(/\<\!\-\-[\s\S]+\-\-\>/,"");*/	
			//xml=xml.replace(/＜/ig,"<").replace(/＞/ig,">");//为适应coremail模板我不得不把尖括号<>转换为全角字符，在这里要替换回来成为xml格式
			xml=xml.replace(/[^\]]\]><!--a-->/ig,"]]><!--a-->");//解决coremail截断字符的bug
			
			if(jQuery.browser.msie){
				//var oXmlDom = new ActiveXObject("Microsoft.XMLDOM");
				var oXmlDom = new ActiveXObject("MSXML.DOMDocument")
				oXmlDom.loadXML(xml);
			}else{	//firefox,opera,safari
				//xml = xml.replace(/\<\!\-\-\sCoreMail[\s\S]+?\-\-\>/,"");
				//xml="<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n"+xml;
				//xml=xml.replace(/[\u001b-\u001f]/ig,"-");//替换打印字符
				var oParser = new DOMParser();
				var oXmlDom = oParser.parseFromString(xml,"text/xml");
			}
			oXmlElement= oXmlDom.documentElement;
			if(oXmlElement!=null){
				var retObj;
				if(oXmlElement.nodeName=="parsererror" || oXmlElement.nodeName=="html"){
					retObj=new Object;
					retObj.error=xml;
					if(checkLogout(xml)){return null};
				}else{
					retObj=xml2array(oXmlElement);
				}
				return retObj;
			}else{
				var retObj=new Object;
				retObj.error=xml;
				if(checkLogout(xml)){return null};
				return retObj;
			}
}
/**
 * 检验退出
 * <pre>示例：<br>
 * <br>checkLogout('default.html')
 * </pre>
 * @param {string} page 必选参数，页面名称。
 * @return {true||null}
 */
function checkLogout(page){
	if(page.indexOf("登录超时")>0 || page.indexOf("重新登录")>0){
		window.top.document.write(page);
		window.top.document.close();
		return true;
	}else if(page.indexOf("非法请求")>0){
		//alert("您似乎闲置太久，请刷新页面或重新登录");
		//return true;
	}
}
/**
 * xml转换数组
 * <pre>示例：<br>
 * <br>xml2array(xmlDoc);
 * </pre>
 * @param {string} xmlDoc 必选参数，xml字符串。
 * @return {Array}
 */
function xml2array(xmlDoc){
	var resultObj=new Array();	//dataset
	for(var i=0; i<xmlDoc.childNodes.length; i++) {
		var tableNode=xmlDoc.childNodes[i];
		if(tableNode.nodeName.charAt(0)  != "#" ){
			var arr=new Array();	//用于存放datatable
			resultObj[tableNode.nodeName]=arr;
			for(var j=0; j<tableNode.childNodes.length; j++) {
				var rowNode=tableNode.childNodes[j];	
				if(rowNode.nodeName.charAt(0)  != "#" ){
					var arr_row=new Array();//存放datarow
					arr.push(arr_row);
					for(var k=0; k<rowNode.childNodes.length; k++) {
						var colNode=rowNode.childNodes[k];
						if(colNode.nodeName.charAt(0)  != "#" ){
							if(colNode.childNodes.length>0){
								var secName=colNode.childNodes[0].nodeName;
								var colValue;
								if(secName=="#text" || secName=="#cdata-section"){
									colValue=colNode.childNodes[0].nodeValue;
									arr_row[colNode.nodeName]=colValue;
								}else if(secName="#comment"){
									colValue=colNode.childNodes[0].nodeValue.replace(/\[CDATA\[/ig,"").replace(/\]\]/ig,"")
									arr_row[colNode.nodeName]=colValue;
								}
							}else{
								arr_row[colNode.nodeName]=null;
							}
							
						}
					}
				}
			}
			
		}
	}
	return resultObj;
}

/**
 * 提交到隐藏iframe请求
 * <pre>示例：<br>
 * <br>postByFrame('page.jsp',jsonData,fun);
 * </pre>
 * @param {string} url 必选参数，请求地址。
 * @param {Object} data 可选参数，请求数据。
 * @param {function} callback 必选参数，回调函数。
 * @return {无返回值}
 */
function postByFrame(url,data,callback){
    var form=$("<form method='post' action='{0}' target='iframe_post'></form>".format(url)).appendTo(document.body);
    var iframe=$("#iframe_post");
    if(iframe.length==0){
	    iframe=$("<iframe style='display:none' name='iframe_post' id='iframe_post'></iframe>").appendTo(document.body);
	}
	for(var elem in data){
		var obj=document.createElement("input");
		obj.name=elem;
		obj.type="hidden";
		obj.value=data[elem];
		form.append(obj)
	}
	iframe.load(doCallback);
	try{
	    form[0].submit();//可能出现"拒绝访问"
	}catch(e){
	    iframe.unbind("load",doCallback);
	    iframe.load(function(){
	        iframe.unbind("load",arguments.callee);
	        iframe.load(doCallback);
	        form[0].submit();
	    });
	    iframe.attr("src",top.stylePath+"/empty.htm");
	}
	function doCallback(){
	    iframe.unbind("load",arguments.callee);
	    var response="";
	    try{
	        //目标页未必是同域的
	        response=iframe[0].contentWindow.document.documentElement.innerHTML;
	    }catch(e){}
	    if(callback)callback(response);
	    form.remove();
	}
}

/**
 * 获取表单数据，目前只支持text hidden checkbox
 * <pre>示例：<br>
 * <br>getForm(window.document.form);
 * </pre>
 * @param {Object} form 必选参数，当前表单对象。
 * @return{Object}
 */
function getForm(form){
var arr=form.getElementsByTagName("input");
var arr2=form.getElementsByTagName("textarea");
var formData=new Object;
formData=getTagValue(formData,arr);
formData=getTagValue(formData,arr2);
return formData;
};

/**
 * 得到每组表单集合的值
 * <pre>示例：<br>
 * <br>getTagValue(formData,window.document.form.getElementsByTagName("input"));
 * </pre>
 * @param {Object} formData 必选参数，表单数据对象。
 * @param {Object} arr 必选参数，表单元素对象数组，如：input,textarea。
 * @return{Object}
 */
function getTagValue(formData,arr){
	for(elem in arr){
		var obj=arr[elem];
		if(obj.tagName==undefined){
			continue;
		}
		
		if(obj.tagName.toLowerCase()=="input"){
			var key=obj.name;
			if(obj.type=="text" ||  obj.type=="hidden"){
				formData[key]=obj.value;
			}else if(obj.type=="checkbox"){
				if(obj.checked){
					formData[key]=obj.value;
				}
			}
		}else if(obj.tagName.toLowerCase()=="textarea"){
			formData[key]=obj.value;
		}
	}
	return formData;

}
﻿/**
 * 页面跳转类，默认调用无样式
 * <pre>示例：<br>
 * PageTurnner(10,1);
 * </pre>
 * @param {int} pageCount 必选参数，总页数。
 * @param {int} pageIndex 必选参数，当前页。
 * @retrun {无返回值}
 */
function PageTurnner(pageCount, pageIndex) {
    var thePageTurnner = this;
    this.pageIndex = pageIndex;

    this.fristPage = function() {
        this.turnPage(1);
    };
    this.lastPage = function() {
        this.turnPage(pageCount);
    };
    this.nextPage = function() {
        this.turnPage(thePageTurnner.pageIndex + 1);
    };
    this.previousPage = function() {
        this.turnPage(thePageTurnner.pageIndex - 1);
    };
    this.turnPage = function(index) {
        if (index < 1 || index > pageCount || index == this.pageIndex) return;
        this.pageIndex = index;
        this.callPageChangeHandler(index);
    };
    this.pageChangeHandlers = [];
    this.addPageChangeListener = function(handler) {
        this.pageChangeHandlers.push(handler);
    };
    this.callPageChangeHandler = function(pageIndex) {
        for (var i = 0; i < this.pageChangeHandlers.length; i++) {
            this.pageChangeHandlers[i](pageIndex);
        }
    };
}
/**
 * 创建带有样式的页面跳转组件
 * <pre>示例：<br>
 * <br>PageTurnner.createStyleNew(10,1,"containerId",function(){doing...});
 * </pre>
 * @param {int} pageCount 必选参数，总页数。
 * @param {int} pageIndex 必选参数，当前页。
 * @param {Object} containerId 必选参数，跳转组件容器.ID或DOM对象。
 * @param {function} callback 必选参数，回调函数。
 * @return {无返回值}
 */
PageTurnner.createStyleNew = function(pageCount, pageIndex, containerId, callback) {
    var container = Utils.isString(containerId) ? document.getElementById("containerId") : containerId;
    var obj = $("#ulPageTurner").css("marginTop","-5px");	
    if (obj.length == 0) {
        obj = $("<ul class='toolBar139_main' id='ulPageTurner' style='float:right;margin-right:10px; margin-top:-5px;'></ul>").appendTo(container.parentNode.parentNode);
    }
    obj.html("");
    btnPrevious = SimpleMenuButton.create({
    	text:"上一页",
    	click:function(){
    		thePageTurnner.previousPage(); 
    		return false;
    	}
    });
    btnNext = SimpleMenuButton.create({
    	text:"下一页",
    	click:function(){
    		thePageTurnner.nextPage(); 
    		return false;
    	}
    });
    //第x页
    var pageMenuItem = [];
    var renderPages = Math.min(pageCount, 300);
    for (var i = 1; i <= renderPages; i++) {
    	pageMenuItem.push({
    		text:i + "/" + pageCount + "页",
    		data:i
    	});
    }
    btnTurnPage = SimpleMenuButton.create({
    	text:"$page$",
    	menu:pageMenuItem,
		css : true,
    	itemClick:function(data){
    		thePageTurnner.turnPage(parseInt(data));
    	}
    });
    $(btnTurnPage).find("ul").css("left","-50px");
    obj.append(btnPrevious);
    obj.append(btnNext);
    obj.append(btnTurnPage);
    
    var thePageTurnner = new PageTurnner(pageCount, pageIndex);
    SimpleMenuButton.changeButtonText(btnTurnPage,pageIndex + "/" + pageCount + "页");
    thePageTurnner.addPageChangeListener(
        function(index) {
        	SimpleMenuButton.changeButtonText(btnTurnPage,index + "/" + pageCount + "页");
        }
    );
    thePageTurnner.addPageChangeListener(disabledButton);
    thePageTurnner.addPageChangeListener(callback);
    disabledButton(pageIndex);
    function disabledButton(index) {
        setLinkDisabled(btnPrevious, false);
        setLinkDisabled(btnNext, false);
        if (index == 1) {
            setLinkDisabled(btnPrevious, true);
        }
        if (index == pageCount) {
            setLinkDisabled(btnNext, true);
        }
    }
    function setLinkDisabled(link, value) {
        if (value) {
            link.style.display = "none";
        } else {
            link.style.display = "";
        }
    }
}
/**
 * 创建页面跳转组件，可选是否创建样式。
 * <pre>示例：<br>
 * <br>PageTurnner.createStyle(10,1,"containerId",function(){doing...},true);
 * </pre>
 * @param {int} pageCount 必选参数，总页数。
 * @param {int} pageIndex 必选参数，当前页。
 * @param {Object} containerId 必选参数，跳转组件容器.ID或DOM对象。
 * @param {function} callback 必选参数，跳转组件容器.ID或DOM对象。
 * @param {Boolean} newStyle 可选参数，是否创建样式。如：newStyle==true则返回调用createStyleNew函数来创建组件。
 * @return {无返回值}
 */
PageTurnner.createStyle = function(pageCount, pageIndex, containerId, callback, newStyle) {
    if(newStyle)return PageTurnner.createStyleNew(pageCount, pageIndex, containerId, callback);

    var thePageTurnner = new PageTurnner(pageCount, pageIndex);
    var btnNext = createLink("下一页");
    var btnPrevious = createLink("上一页");
    var btnFrist = createLink("首页");
    var btnLast = createLink("末页");
    function createLink(text) {
        var a = document.createElement("a");
        a.innerHTML = text;
        a.href = "javascript:void(0)";
        return a;
    }
    btnFrist.onclick = function() { thePageTurnner.fristPage(); this.blur(); return false; };
    btnPrevious.onclick = function() { thePageTurnner.previousPage(); this.blur(); return false; };
    btnNext.onclick = function() { thePageTurnner.nextPage(); this.blur(); return false; };
    btnLast.onclick = function() { thePageTurnner.lastPage(); this.blur(); return false; };
    var select = document.createElement("select");
    for (var i = 1; i <= pageCount; i++) {
        var item = new Option(i.toString() + "/" + pageCount + "页", i);
        select.options.add(item);
        if (i == pageIndex) {
            item.selected = true;
        }
    }
    select.onchange = function() { thePageTurnner.turnPage(this.selectedIndex + 1); };
    thePageTurnner.addPageChangeListener(
        function(index) {
            select.options[index - 1].selected = true;
        }
    );
    setLinkDisabled(btnFrist, true);
    setLinkDisabled(btnPrevious, true);
    thePageTurnner.addPageChangeListener(disabledButton);
    thePageTurnner.addPageChangeListener(callback);
    var container;
    if (typeof (containerId) == "string") {
        container = document.getElementById(containerId);
    } else {
        container = containerId;
    }
    //container.appendChild(document.createTextNode("[ "));
    container.appendChild(btnPrevious);
    container.appendChild(document.createTextNode(" "));
    container.appendChild(btnNext);
    container.appendChild(document.createTextNode(" "));
    container.appendChild(select);

    disabledButton(pageIndex);
    function disabledButton(index) {
        setLinkDisabled(btnFrist, false);
        setLinkDisabled(btnPrevious, false);
        setLinkDisabled(btnNext, false);
        setLinkDisabled(btnLast, false);
        if (index == 1) {
            setLinkDisabled(btnFrist, true);
            setLinkDisabled(btnPrevious, true);
        }
        if (index == pageCount) {
            setLinkDisabled(btnNext, true);
            setLinkDisabled(btnLast, true);
        }
    }
    function setLinkDisabled(link, value) {
        if (value) {
            //link.style.color="silver";
            link.style.display = "none";
        } else {
            //link.style.color="";
            link.style.display = "";
        }
    }
};
﻿/**
 * 弹出菜单类
 * <pre>示例：<br>
 * <br>PopMenu("mnueCss");
 * </pre>
 * @param {Object} containerClass 必选参数，样式名
 * @return {无返回值}
 */
function PopMenu(containerClass){
    Utils.stopEvent();
    var theMenu=this;
    var container=document.createElement("div");
    this.container=container;
    container.id="popMenu";
    container.className=containerClass||"popMenu";

    with(container.style){
        display="none";zIndex=999;lineHeight="20px";border="1px solid #F7E5B5";backgroundColor="#FFFDF6";padding="5px 15px";
    }
    var documentClick=null;
    this.show = function(host) {
        if (PopMenu.current) PopMenu.current.hide();
        PopMenu.current = theMenu;
        document.body.appendChild(container);
        var offset = $(host).offset();
        container.style.left = offset.left + "px";
        container.style.top = offset.top + $(host).height() + "px";
        container.style.display = "block";
        container.style.position = "absolute";
        documentClick = function() {
            $(this).unbind("click", arguments.callee);
            if (PopMenu.current) PopMenu.current.hide();
        };
        $(document).click(documentClick);
        Utils.stopEvent();
    };
    container.onclick = function(e) {
        Utils.stopEvent();
    };
    this.hide = function() {
        if (!PopMenu.current) return;
        if (container.parentNode) container.parentNode.removeChild(container);
        if (theMenu.onHide) theMenu.onHide();
        $(document).unbind("click", documentClick);
        PopMenu.current = null;
    };
    this.addItem = function(title, clickHandler) {
        var item;
        if (typeof (title) == "string") {
            item = document.createElement("a");
            item.innerHTML = title;
        } else {
            item = title;
        }
        item.href = "javascript:void(0)";
        item.onclick = function(evt) {
            if (clickHandler) clickHandler(this);
            theMenu.hide();
        };
        container.appendChild(item);
    };
    this.setContent = function(obj) {
        if (typeof obj == "string") {
            container.innerHTML = obj;
        } else {
            container.innerHTML = "";
            container.appendChild(obj);
        }
    };
} 
 
﻿//截屏控件封装
ScreenShotControl = {
	/**
	 * 写控件
	 * <pre>示例：<br>
	 * <br>ScreenShotControl.writeHtml();
	 * </pre>
	 * @return {无返回值}
	 */
    writeHtml: function(){
        var htmlCode = "<script language=\"JavaScript\" for=\"ScreenSnapshotctrl\" event=\"ScreenSnapshotCtrlOnStart(id)\">\
            ScreenShotControl._onStart(id);\
        </script>\
        <script language=\"JavaScript\" for=\"ScreenSnapshotctrl\" event=\"ScreenSnapshotCtrlOnProgress(id, nProgress, nTotalSize, nUsedTime)\">\
            ScreenShotControl._onProgress(id,nProgress, nTotalSize, nUsedTime);\
        </script>\
        <script language=\"JavaScript\" for=\"ScreenSnapshotctrl\" event=\"ScreenSnapshotCtrlOnStop(id, nResult, strResponse)\">\
            ScreenShotControl._onStop(id, nResult, strResponse);\
        </script>\
        <script language=\"JavaScript\" for=\"ScreenSnapshotctrl\" event=\"SSCUploadClipboardFileOnStart(id, nFileCount, iFileIndex, strFileName)\">\
            ScreenShotControl._uploadClipboardFileOnStart(id, nFileCount, iFileIndex, strFileName);\
        </script>\
        <script language=\"JavaScript\" for=\"ScreenSnapshotctrl\" event=\"SSCUploadClipboardFileOnProgress(id, nFileCount, iFileIndex, strFileName,nProgress,nTotalSize, nTime)\">\
            ScreenShotControl._uploadClipboardFileOnProgress(id, nFileCount, iFileIndex, strFileName,nProgress,nTotalSize, nTime);\
        </script>\
        <script language=\"JavaScript\" for=\"ScreenSnapshotctrl\" event=\"SSCUploadClipboardFileOnStop(id, nFileCount,iFileIndex,strFileName, nResult, strResponse)\">\
            ScreenShotControl._uploadClipboardFileOnStop(id, nFileCount,iFileIndex,strFileName, nResult, strResponse);\
        </script>"
        if ($.browser.msie) {
            htmlCode += "<OBJECT ID=\"ScreenSnapshotctrl\" name=\"ScreenSnapshotctrl\" \
             CLASSID=\"CLSID:E58FEC7E-D43F-40B3-8747-196105D8CF93\"></OBJECT>";
        }
        else {
            htmlCode += " <embed name=\"ScreenSnapshotctrl\" id=\"ScreenSnapshotctrl\" \
             type=\"application/x-richinfo-screensnaphot\" width=\"600\" height=\"40\">";
            window.ScreenSnapshotCtrlOnStart = function(){
                ScreenShotControl._onStart.apply(ScreenShotControl, arguments)
            };
            window.ScreenSnapshotCtrlOnProgress = function(){
                ScreenShotControl._onProgress.apply(ScreenShotControl, arguments)
            };
            window.ScreenSnapshotCtrlOnStop = function(){
                ScreenShotControl._onStop.apply(ScreenShotControl, arguments)
            };
            window.SSCUploadClipboardFileOnStart = function(){
                ScreenShotControl._uploadClipboardFileOnStart.apply(ScreenShotControl, arguments)
            };
            window.SSCUploadClipboardFileOnProgress = function(){
                ScreenShotControl._uploadClipboardFileOnProgress.apply(ScreenShotControl, arguments)
            };
            window.SSCUploadClipboardFileOnStop = function(){
                ScreenShotControl._uploadClipboardFileOnStop.apply(ScreenShotControl, arguments)
            };
        }
        document.write(htmlCode);
    },
    uploading: false,
    _onStart: function(taskId){
        ScreenShotControl.uploading = true;
        if (this.onStart) {
            this.onStart(taskId)
        }
    },
    _onProgress: function(taskId, progress, totalSize, usedTime){
        if (this.onProgress) {
            var result = {};
            result.taskId = taskId;
            result.progress = progress;
            result.totalSize = totalSize;
            result.usedTime = usedTime;
            this.onProgress(result)
        }
    },
    _onStop: function(taskId, resultCode, responseText){
        ScreenShotControl.uploading = false;
        if (this.onStop) {
            var result = {
                resultCode: resultCode,
                responseText: responseText
            };
            this.onStop(result);
        }
    },
	/**
	 * 从剪贴板开始上传的事件
	 * @param {Object} taskId 必选参数，文件id。
	 * @param {Object} fileCount 必选参数，文件数。
	 * @param {Object} fileIndex 必选参数，下标(第几个文件)。
	 * @param {Object} fileName 必选参数，文件名。
	 * @return {无返回值}
	 */
    _uploadClipboardFileOnStart: function(taskId, fileCount, fileIndex, fileName){
        ScreenShotControl.uploading = true;
        if (this.onStart) {
            this.onStart({
                taskId: taskId,
                fileCount: fileCount,
                fileIndex: fileIndex,
                fileName: fileName
            });
        }
    },
    _uploadClipboardFileOnProgress: function(taskId, fileCount, fileIndex, fileName, progress, totalSize, usedTime){
        if (this.onProgress) {
            this.onProgress({
                taskId: taskId,
                fileCount: fileCount,
                fileIndex: fileIndex,
                fileName: fileName,
                progress: progress,
                totalSize: totalSize,
                usedTime: usedTime
            });
        }
    },
    _uploadClipboardFileOnStop: function(taskId, fileCount, fileIndex, fileName, resultCode, responseText){
        ScreenShotControl.uploading = false;
        if (this.onStop) {
            this.onStop({
                taskId: taskId,
                resultCode: resultCode,
                fileCount: fileCount,
                fileIndex: fileIndex,
                fileName: fileName,
                responseText: responseText
            });
        }
    },
    getObj: function(){
        var obj = document.getElementById("ScreenSnapshotctrl");
        if (obj) {
            this.getObj = function(){
                return obj;
            }
            return obj;
        }
        return null;
    },
    enable: function(){
        try {
            var version = this.getObj().GetVersion();
            if (top.SiteConfig && top.SiteConfig.screenControlVersion && top.SiteConfig.screenControlVersion > version) {
                return false;
            }
            return true;
        } 
        catch (e) {
            return false;
        }
    },
    /**
     * 是否需要升级
     * <pre>示例：<br>
     * <br>ScreenShotControl.needToUpdate();
     * </pre>
     * @return{true||false}
     */
    needToUpdate: function(){
        try {
            var version = this.getObj().GetVersion();
            if (top.SiteConfig && top.SiteConfig.screenControlVersion && top.SiteConfig.screenControlVersion > version) {
                return true;
            }
            return false;
        } 
        catch (e) {
            return false;
        }
    },
    /**
     * 得到上传ID
     * <pre>示例：<Br>
     * <br>ScreenShotControl.getUploadId();
     * </pre>
     * @return {int}
     */
    getUploadId: function(){
        if (this.randomUploadId) {
            this.randomUploadId++;
        }
        else {
            this.randomUploadId = 1;
        }
        return this.randomUploadId;
    },
    
	shot: function(param){
        var taskId = this.getUploadId();
        if (this.enable() && this.enable()) {
            if (!this.isUploading()) {
                this.getObj().GetScreenSnapshotImg(taskId, param.uploadUrl, param.cookie || document.cookie);
                return true;
            }
            else {
                alert(top.ControlsMessage["ScreenshotLoading"]);
                return false;
            }
        }
        else {
            return false;
        }
    },
    /**
     * 设置限传文件大小
     * <pre>示例：<br>
     * <br>ScreenShotControl.setUploadFileSizeLimit(1000);
     * </pre>
     * @param {Object} limit 必选参数，文件大小。
     * @return {无返回值}
     */
    setUploadFileSizeLimit: function(limit){
        if (typeof limit == "number") {
            this.getObj().SetUploadFileSizeLimit(limit);
        }
        else {
            this.getObj().SetUploadFileSizeLimit(limit());
        }
    },
    /**
     * 上传剪贴板的文件
     * <pre>示例：<br>
     * <br>ScreenShotControl.uploadClipboardFile(param);
     * </pre>
     * @param {Object} param 必选参数，json格式，上传的地址、cookie信息
     * @return {无返回值}
     */
    uploadClipboardFile: function(param){
        if (this.enable() && !this.isUploading()) {
            var taskId = this.getUploadId();
            this.getObj().UploadClipboardFile(taskId, param.uploadUrl, param.cookie || document.cookie);
        }
    },
    /**
     * 上传剪贴板的图片
     * <pre>示例：<br>
     * <br>ScreenShotControl.uploadClipboardImg(param);
     * </pre>
     * @param {Object} param 必选参数，json格式，上传的地址、cookie信息
     * @return {无返回值}
     */
    uploadClipboardImg: function(param){
        if (this.enable() && !this.isUploading()) {
            var taskId = this.getUploadId();
            this.getObj().UploadClipboardFile(taskId, param.uploadUrl, param.cookie || document.cookie);
        }
    },
    /**
     * 停止请求
     * <pre>示例：<br>
     * <br>ScreenShotControl.stop(taskId);
     * </pre>
     * @param {string} taskId 必选参数，要停止任务ID
     * @return {无返回值}
     */
    stop: function(taskId){
        this.getObj().StopUpload(taskId || this.randomUploadId);
    },
    /**
     * 是否正在上传,每次限制只能传一个
     * <pre>示例：<br>
     * <br>ScreenShotControl.isUploading();
     * </pre>
     * @return{无返回值}
     */
    isUploading: function(){
        return this.uploading;
    }
}

﻿
/**
 * 下拉列表类
 */
Utils.waitForReady("jQuery", function(){

/**
 * 给选择出来的元素加上空白文本。
 * @param {String} text 设置的空白文本，如果为空则取消空白文本逻辑
 * @return {Void}
 */
(function($){
    $.fn.blankText = function() {
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
    };
})(jQuery);

/**
 * 兼容html5的 custom data attributes 新特性
 * 注意：当针对单个元素取值时，直接返回value，不需要[0]
 */
(function($){  
    $.fn.dataset = function() {
        if (this.length <1) return "";

        var key = arguments[0];
        var value = arguments[1];

        var _support = !!window.DOMStringMap;
        var _item = null;
        var _prefix = "data-";

        if (value !== undefined){
            if (_support) {
                for (var i = 0; i < this.length; i++) {
                    this[i].dataset[key] = String(value);
                }
            } else {
                for (var i = 0; i < this.length; i++) {
                    this[i].setAttribute(_prefix + key, String(value));
                }
            }
            value = this;
        } else {
            value = [];

            for(var i=0; i<this.length; i++){
                _item = this[i];

                if (_support){
                    value.push(_item.dataset[key]);
                    continue;
                }

                value.push(_item.getAttribute(_prefix + key));
            }

            if (value.length == 1){
                value = value[0];
            }
        }
        return value;
    };
})(jQuery);

});

(function(UI){

    /**
     * 下拉列表类
     */
    var selectlist = function(param) {
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
            $(this).dataset("value", buff.shift());
        });

        if (typeof(param.defaultValue) != "undefined") {
            _.textField.innerHTML = param.defaultValue;
        }

        $(_.listContainer.childNodes).click(function(e){
            _.textField.innerHTML = this.textContent || this.innerText;
            _.onItemClick(this, e);
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
                    if ($(this).dataset("value") == value){
                        _.textField.innerHTML = value;
                    }
                });
            }
        };
    };

    UI.selectlist = selectlist;

})(Utils.UI);

﻿
///////////////////////////////
//     联系人，双列，选择控件
//     主要用于：写信页、通讯录组编辑页、导出联系人页。
///////////////////////////////
function DualAddrList(param){
    this.id = Math.floor(Math.random()*0xefffffff + 0x10000000).toString(16);

    var _default = DualAddrList.DEFAULT_CFG;
    var _param = {};
    _param.height = param.height || _default.height;
    _param.width = param.width || _default.width;
    _param.height = param.height || _default.height;
    _param.model = param.model || _default.model;
    _param.limit = param.limit || _default.limit;

    this.param = _param;
}

//组件的呈现模式：
DualAddrList.MODELS_CONTACT = 0;
DualAddrList.MODELS_EMAIL = 1;
DualAddrList.MODELS_FAX = 2;
DualAddrList.MODELS_MOBILE = 3;

//组件的默认参数
DualAddrList.DEFAULT_CFG = {

    height: "100%",
    width: "100%",

    model: DualAddrList.MODELS_EMAIL,

    //可选择到右侧的最大联系人数。
    limit: Number.MAX_VALUE 
};

(function(_){
    var _location = top.location;
    var TEMPLATE_URL = _location.protocol + "//" + _location.host + (_location.port ? ":" + _location.port : "");

    if (top.rmResourcePath) {
        TEMPLATE_URL = TEMPLATE_URL + "/dualAddrList.htm";
    } else {
        TEMPLATE_URL = TEMPLATE_URL + top.stylePath + "/dualAddrList.htm";
    }

    _.create = function(container){
        var _param = this.param;
        
        var _url = TEMPLATE_URL + "?a=a"
            + "&model=" + _param.model;

        if (_param.limit < Number.MAX_VALUE) {
            _url += "&limit=" + _param.limit;
        }

        var htmlCode = [
            "<iframe name=\"dualAddrList_",
            this.id,
            "\" id=\"dualAddrList_",
            this.id,
            "\" style=\"border:none;width:",
            _param.width,
            ";height:",
            _param.height,
            "\" frameBorder=\"0\" scrolling=\"no\" src=\"",
            _url,
            "&sid=",
            top.UserData.ssoSid ? top.UserData.ssoSid : "",
            "\"></iframe>"
        ].join("");

        container.innerHTML = htmlCode;
        _param.container = container;
    }

    _.getCurrent = function(){
        var domEle = document.getElementById("dualAddrList_" + this.id);
        return domEle;
	}

    _.ready = function(callback){
        var domEle = this.getCurrent();
        var timer = setInterval(function(){
            try {
                callback.call(domEle.contentWindow.AddressBook);
                clearInterval(timer);
            } catch(ex){
                //重试
            }
        }, 250);
    }

    _.getSelection = function(callback){
        this.ready(function(){
            if($.isFunction(callback)){
                callback(this.GetSelection());
            }
        });
    }

    //给通讯录编辑组用的，一次选择整组
    _.groupby = function(groupid){
        this.ready(function(){
            this.GroupBy(groupid);
        });
    }

    /**
     * 给通讯录编辑组用的，取已选择的sid串
     * @param {Function} callback(sids)
     * @return {String} sid1,sid2,sid3样的sid串。
     */
    _.getSelectionString = function(callback){
        this.getSelection(function(list){
            var buff = [];
            for(var i=0, m=list.length; i<m; i++){
                buff.push(list[i].SerialId);
            }

            if($.isFunction(callback)){
                callback(buff.join(","));
            }
        });
    }

    /**
     * 清空已选择的联系人。
     */
    _.empty = function(){
        this.ready(function(){
            this.Empty();
        });
    }

    /**
     * 一次选择所有的联系人到右侧。
     */
    _.selectAll = function(){
        this.ready(function(){
            this.SelectAll();
        });
    }

})(DualAddrList.prototype);

﻿function tips(){
	this.init.apply(this,arguments);
};

tips.list = {};

tips.prototype = {
	options :{
		//tip里面的内容
		content   : '无内容',
		//tip的最小宽度
		width     : 220,
		maxHeight : 60,
		direction : 'deflaut',
		howShow   : true 
	},
	init : function(options,win){
		$.extend(this,this.options,options);
		this.win = win || window;
		this.elem = typeof this.id==="string" 
			? $(win.document.getElementById(this.id))
			: this.id;
		
		var elem = this.elem[0]
		if(!elem)
			return;
			
		if(elem&&(!('nodeName' in elem)))
			return;

		var url = top.resourcePath; 
		//生成tips里面的内容

		this.tipsContainer = $('<div style="height:auto;border:1px solid #e6d650;position:absolute;font-size:12px;margin-top:15px;zoom:1;"></div>')
			.hide()
			.css({
				width : (this.width || this.options.width) + 'px' 
			});
		this.tipsContainer = $(win.document.createElement('div'))
			.hide()
			.css({
				 'height'     : 'auto',
				 'border'     : '1px solid #e6d650',
				 'position'   : 'absolute',
				 'font-size'  : '12px',
				 'margin-top' : '15px',
				 'zoom'       : 1,
				 'width'      : (this.width || this.options.width) + 'px',
				 'z-index'    : 1000
			})
		win.document.body.appendChild(this.tipsContainer[0]);
		this.tipsContainer.html('<div style="border:1px solid #fff;padding:10px;background:#fefddf"><div style="position:absolute;left:12px;top:-6px;height:6px;width:9px;line-height:1px;font-size:1px;background:url('+url+'/images/arrow.gif) no-repeat;cursor:pointer;"></div><div style="position:absolute;background:url('+url+'/images/cls.gif) no-repeat 0 0;top:6px;right:7px;height:8px;width:7px;line-height:12px;cursor:pointer">&nbsp;</div><table height="'+this.maxHeight+'" border="0"><tr><td width="30" style="text-align:center;vertical-align:middle;"></td><td valign="top" style="padding-left:5px;line-height:16px;padding-top:10px;"></td></tr></table></div>');

		var divs = this.tipsContainer.find('div'),
			self = this;
		this.icoJ = divs.eq(1);
		this.icoC = divs.eq(2);

		this.imgSrc
			&&this.tipsContainer.find('td').eq(0).html('<img src="'+top.resourcePath+this.imgSrc +'" />');
		
		this.htmlContainer = this.tipsContainer.find('td').eq(1);
		this.htmlContainer.html(this.content);
		!this.howShow
			&&this.elem.bind('mouseover.tips',function(){self.show();});
		
		var behaviorKey = 'tips_' + [0,'功能提醒类','功能设置类','功能引导类'][self.data.type]; 		
		
		this.icoC.bind('click',function(){
			self.tipsContainer[0].parentNode.removeChild(self.tipsContainer[0]);
			self.request();
			self.unbind();
			
			behaviorKey = behaviorKey +'2';
			//功能提醒类 功能设置类 功能引导类
			top.addBehavior
				&&jQuery.isFunction(top.addBehavior)
				&&top.addBehavior(behaviorKey,2);
		});

		this.htmlContainer.bind('click.tips',function(e){
			var elem = e.target,
				name = e.target.nodeName.toLocaleLowerCase();
				if(name === 'a'){
					self.unbind();
					self.request();
				behaviorKey = behaviorKey +'1';
				top.addBehavior
					&&jQuery.isFunction(top.addBehavior)
					&&top.addBehavior(behaviorKey,1);					
					var resourcePath = top.resourcePath;
					if('operate' in self.data){
						var action = {
							'0' : function(){
								return;
							},
							'1' : function(){
								LinksConfig.mailnotifyTips.url =webmailDomain+LinksConfig.mailnotifyTips.url+'?stype=tips';
								Links.show("mailnotifyTips");
							},
							'2' : function(){
								LinksConfig.safeTips.url = webmailDomain+LinksConfig.safeTips.url+'?stype=tips';
								Links.show("safeTips");	
							},
							'3' : function(){
								Links.show("smtpsave");
								var win =document.getElementById('smtpsave').contentWindow
								var time = setInterval(function(){
									if(win.isReady === true){
										win.document.getElementById('r1').checked = true;
										clearTimeout(time);
									}
								},200);
							},
							'4' : function(){
								Links.show("autoSaveContact");
								var win =document.getElementById('autoSaveContact').contentWindow
								var time = setInterval(function(){
									if(win.isReady === true){
										win.document.getElementById('autoSave').checked = true;
										clearTimeout(time);
									}
								},200);
							},
							'5' : function(){
								LinksConfig.billdeliverTips.url = webmailDomain+ LinksConfig.billdeliverTips.url+'?stype=tips';

								Links.show("billdeliverTips");	
							}
						}
						action[self.data.operate]();
					}
				}		
		});
	
		this.howShow
			&&this.show();
	},

	//new tips({id:"header", data:{type:2,id:188}}, window).request()
	request : function(){
        var self = this;
        var api = "user:hitGuide";
        var mailid = self.data.id;
        var data = {
            seqId: mailid,
            type: 2
        };

        var options = {
            onrouter: function (router) {
                router.addRouter("setting", [api]);
            }
        };

        top.$RM.call(api, data, callback, options);

        function callback(result) {
            if (result && result.responseData) {
                result = result.responseData;
                if (result.code === "S_OK") {
                    delete tips.list[mailid];
                    var target = null;
                    $.each(top.AdLink.tips, function(i,o){
                        if(mailid===o.id){
                            target = i;
                            return false;
                        }
                    });
                    if(target!==null){
                        top.AdLink.tips.splice(target,1);
                    }
                    return true;
                }
            }
            return false;
        }
	},
	show : function(){	
	
	    if(this.showFlag != 1){
	        top.addBehavior("功能引导tips触发量");
	        this.showFlag = 1;
	    }
		var pos       = this.elem.offset(),
			left      = pos.left,
			elemWidth = this.elem[0].offsetWidth,
		   elemHeight = this.elem[0].offsetHeight,
			win       = this.win,
			direction = this.direction;
		
		if(pos.top > 0){ this.top = pos.top }
		if(pos.left > 0){ 
		this.left = pos.left 
		left = this.left;
		}
		
		
		if(elemHeight > 0){
		this.offsetHeight = elemHeight;
		};
		
		//根据浏览器 自己判断如何偏移
		if(direction==='deflaut'||(direction==='left'&&direction==='right')){
			if(this.left<20){
				left = 0;
				this.icoJ.css({marginLeft:this.left+'px'});
				
			}else{
				var dWidth = Math.min(win.document.body.clientWidth, win.document.documentElement.clientWidth),
					sWidth = dWidth -(left + elemWidth);
	
				if(sWidth>this.width+5){ 
					left = left -18;
					this.icoJ.css({marginLeft:18+'px'});
				}
				else{
					left = left - this.width + elemWidth + 5;//-18
					this.icoJ.css({marginLeft:this.width-5-elemWidth/2-18+'px'});//-30
				}
			}		
		}

		this.tipsContainer.css({
			top     : this.top  + this.offsetHeight -10 + 'px',
			left    : left + 'px',
			display :'block'
		});		
	},
	unbind : function(){
		this.elem.unbind('mouseover.tips');
		this.htmlContainer.unbind('click.tips');
		this.tipsContainer[0].parentNode
			&&this.tipsContainer[0].parentNode.removeChild(this.tipsContainer[0]);
	}
}

function setTips(){
	if(!top.AdLink){
		return
	}
	var data = top.AdLink.tips;	
	if(!data)
		return;
	if(Object.prototype.toString.call(data)!=="[object Array]"){
		return;
	}
	var	reg  =/([^\/]*?\.[a-z]+)\?.*$/i;	
			
	setInterval(function(){
		var iframes = document.body.getElementsByTagName('iframe');				

		//首页的比较特殊 单独拿出来判断
		$.each(top.AdLink.tips,function(i,obj){
			if($.trim(obj.pageurl)==="main.htm"){
				var id = obj.id;
				if(id in tips.list&&window['caiXunTip'+id]){
					window['caiXunTip'+id].show();
				}else{
					tips.list[id] = 1
					var elem = document.getElementById($.trim(obj.elementid));
					if(elem){
						window['caiXunTip'+id] = new tips({
							imgSrc    : obj.imageurl,
							id        : $.trim(obj.elementid),
							content   : obj.content,
							data      : obj
						},window);
					}
				}								
			}			 
		});

		$.each(iframes,function(i,iframe){
			//判断他的父元素是不是隐藏的 如果隐藏的 就不会计算位置了 计算了也找不到位置的
			if(iframe.parentNode.style.display === 'none'){
				return;	
			}					
			var urls = reg.exec(iframe.src);
			if(!urls)
				return;
			
			var name = urls[1];
			$.each(data,function(i,obj){
				if($.trim(obj.pageurl) === $.trim(name)){						
					var win = iframe.contentWindow,
						id  = obj.id;
					
					if(!(tips.list[id])||(id in tips.list&&!win['caiXunTip'+id])){
						tips.list[id] = 1;
						(function(win,obj){		
							var time = setInterval(function(){						
								if(win.document&&win.document.getElementById(obj.elementid)&&win.jQuery){
									win['caiXunTip'+id] = new tips({
										imgSrc    : obj.imageurl,
										id        : obj.elementid,
										content   : obj.content,
										data      : obj
									},win);
									clearTimeout(time);				
								}																										
							},500);	  
						})(iframe.contentWindow,obj);
					}else{
						if(tips.list[id]&&win['caiXunTip'+id]){
							win['caiXunTip'+id].show();
						}
					}						
				 }
			});
		});
	},1000);
}

﻿;
/**
 * 下拉列表类
 */
Utils.waitForReady("jQuery", function(){

/**
 * 给选择出来的元素加上空白文本。
 * @param {String} text 设置的空白文本，如果为空则取消空白文本逻辑
 * @return {Void}
 */
(function($){
    $.fn.blankText = function() {
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
    };
})(jQuery);

/**
 * 兼容html5的 custom data attributes 新特性
 * 注意：当针对单个元素取值时，直接返回value，不需要[0]
 */
(function($){  
    $.fn.dataset = function() {
        if (this.length <1) return "";

        var key = arguments[0];
        var value = arguments[1];

        var _support = !!window.DOMStringMap;
        var _item = null;
        var _prefix = "data-";

        if (value !== undefined){
            if (_support) {
                for (var i = 0; i < this.length; i++) {
                    this[i].dataset[key] = String(value);
                }
            } else {
                for (var i = 0; i < this.length; i++) {
                    this[i].setAttribute(_prefix + key, String(value));
                }
            }
            value = this;
        } else {
            value = [];

            for(var i=0; i<this.length; i++){
                _item = this[i];

                if (_support){
                    value.push(_item.dataset[key]);
                    continue;
                }

                value.push(_item.getAttribute(_prefix + key));
            }

            if (value.length == 1){
                value = value[0];
            }
        }
        return value;
    };
})(jQuery);

});

(function(UI){

    /**
     * 下拉列表类
     */
    var selectlist = function(param) {
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
            $(this).dataset("value", buff.shift());
        });

        if (typeof(param.defaultValue) != "undefined") {
            _.textField.innerHTML = param.defaultValue;
        }

        $(_.listContainer.childNodes).click(function(e){
            _.textField.innerHTML = this.textContent || this.innerText;
            _.onItemClick(this, e);
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
                    if ($(this).dataset("value") == value){
                        _.textField.innerHTML = value;
                    }
                });
            }
        };
    };

    UI.selectlist = selectlist;

})(Utils.UI);

