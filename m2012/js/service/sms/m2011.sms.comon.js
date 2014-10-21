var samedomain = window.location.host.substring(window.location.host.substring(0,window.location.host.lastIndexOf(".")).lastIndexOf(".")+1);
var TopDomain = samedomain;
if(!window.isComposePage){// 判断是否为写信页面
    document.domain = samedomain;
}

//设置页面样式
function setCommonPage() {    
    if (jQuery.browser.msie && jQuery.browser.version < 7) {
	    setIframeSize();
	    try {
	        jQuery(window.parent.document).find("#content").resize(setIframeSize);
	        document.execCommand("BackgroundImageCache", false, true);//缓存图片
	    }catch(e){}
	    jQuery(window).resize(setIframeSize);
    }    
    //IE6按钮样式切换
    if (jQuery.browser.msie && jQuery.browser.version < 7) {
        jQuery(".search button").hover(function(){
            jQuery(this).addClass("on")
        }, function(){
            jQuery(this).removeClass("on")
        });
        
        jQuery(".btnStrong").hover(function(){
            jQuery(this).removeClass("btnStrong");
            jQuery(this).addClass("btnOver");
            jQuery(this).css("font-weight", "bold");
        }, function(){
            jQuery(this).removeClass("btnOver");
            jQuery(this).addClass("btnStrong");
        });
        
        jQuery(".btnNormal").hover(function(){
            jQuery(this).addClass("btnOver")
        }, function(){
            jQuery(this).removeClass("btnOver")
        });
    };
    //a标签和button按钮点击失去焦点
    jQuery("a").click(function(){jQuery(this).blur();});
    jQuery("button").click(function(){jQuery(this).blur();});
    //功能按钮样式切换
    if (jQuery.browser.msie && jQuery.browser.version < 7) {
        jQuery(".btnFunction").hover(function(){jQuery(this).addClass("btnFunctionOn")}, function(){jQuery(this).removeClass("btnFunctionOn")});
    }
}
//修复IE6页面宽度
function setIframeSize(){
   	jQuery("body").width(jQuery(window).width());
}
//在输入框中显示一个提示信息，点击后隐藏
function showTipMessage(oCtrl,msg) {
    try{
	    jQuery("body").append("<span name='" + oCtrl + "' style='position:absolute;display:none;color:#A9A9A9;margin:0px;padding-top:5px;padding-left:2px;text-align:left;vertical-align:bottom '>" + msg + "</span>");
	    var txtOffset = jQuery("#" + oCtrl).offset();
	    var txtOffsetTop = txtOffset.top;
	    if(jQuery.browser.safari || jQuery.browser.mozilla) {
	        txtOffsetTop -= 2;
	    }
	    jQuery("span[name='" + oCtrl + "']").css({"left":txtOffset.left,"top":txtOffsetTop,"width":jQuery("#" + oCtrl).width(),"height":jQuery("#" + oCtrl).height(),"cursor":"text"});
	    if(jQuery("#" + oCtrl).val() == "") {
		    jQuery("span[name='" + oCtrl + "']").css("display","block").click(function(){jQuery(this).css("display","none");jQuery("#" + oCtrl).focus();});
		    jQuery("#" + oCtrl).click(function(){jQuery("span[name='" + oCtrl + "']").css("display","none");jQuery("#" + oCtrl).focus();return false;});
	    }
	}catch(e){}
}

function getUrlParamValue(url,param) {
	url = url.replace(/&amp;/g,"&");
	var intPos = url.indexOf("?");
	var strRight = url.substr(intPos + 1);
	var arrTmp = strRight.split("&");
	for(var i = 0; i < arrTmp.length; i++ ){
		var dIntPos = arrTmp[i].indexOf("=");
		var paraName= arrTmp[i].substr(0,dIntPos);
		var paraData= arrTmp[i].substr(dIntPos+1);
	    if(paraName.toUpperCase() == param.toUpperCase()) {
			return paraData;
		}
	}
	return "";
}

function getCookie(name)   {   
    var arr = document.cookie.match(new RegExp("(^|)"+name+"=([^;]*)(;|$)"));
    if(arr != null)return unescape(arr[2]);
    return "";   
}

function getByteLength(str) {
	var l = str.length;
	var n = l;
	for(var i = 0; i < l; i++){
		if(str.charCodeAt(i) > 255){
			n++;
		}
	}
	return n;
}

function requestByScript(scriptId,dataHref,callback){
	var head = document.getElementsByTagName("head")[0];
	var objScript = document.getElementById(scriptId);
	if(objScript != null){
		objScript.parentNode.removeChild(objScript);
	}
	var dataScript = document.createElement("script");
	if(document.all){
		dataScript.onreadystatechange=function(){
			if(dataScript.readyState == "loaded" || dataScript.readyState == "complete"){
				if(callback)callback();
			}
		}
	}else{
		dataScript.onload = function(){
			if(callback)callback();
		}
	}
	dataScript.id		= scriptId;
	dataScript.charset	= "GB2312";
	dataScript.src		= dataHref;
	dataScript.defer	= true;
	dataScript.type		= "text/javascript";
	head.appendChild(dataScript);
}
//手机获取WAP地址
function getWapAddr(){
    var getWapAddrUrl = top.webmailDomain +"/businessmailservice/getwapaddr.aspx?num="+ top.UserData.userNumber + "&rnd="+ Math.random();
    requestByScript("WapAddrScriptID",getWapAddrUrl, function(){ 
        alert("139邮箱WAP访问地址已经发送到您的手机，请查收。"); 
    });
}