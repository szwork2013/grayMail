/*********************************浏览器检查*************************************/
	
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
//swfobject.js

function SWFObject(swf, id, w, h, ver, c){
	this.params = new Object();
	this.variables = new Object();
	this.attributes = new Object();
	this.setAttribute("id",id);
	this.setAttribute("name",id);
	this.setAttribute("width",w);
	this.setAttribute("height",h);
	this.setAttribute("version",ver);
	this.setAttribute("swf",swf);	
	this.setAttribute("classid","clsid:D27CDB6E-AE6D-11cf-96B8-444553540000");
	this.addParam("bgcolor",c);
}
SWFObject.prototype.addParam = function(key,value){
	this.params[key] = value;
}
SWFObject.prototype.getParam = function(key){
	return this.params[key];
}
SWFObject.prototype.addVariable = function(key,value){
	this.variables[key] = value;
}
SWFObject.prototype.getVariable = function(key){
	return this.variables[key];
}
SWFObject.prototype.setAttribute = function(key,value){
	this.attributes[key] = value;
}
SWFObject.prototype.getAttribute = function(key){
	return this.attributes[key];
}
SWFObject.prototype.getVariablePairs = function(){
	var variablePairs = new Array();
	for(key in this.variables){
		variablePairs.push(key +"="+ this.variables[key]);
	}
	return variablePairs;
}
SWFObject.prototype.getHTML = function(){
	var con = '';
	if (navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) {
		con += '<embed type="application/x-shockwave-flash" wmode="transparent" pluginspage="http://www.macromedia.com/go/getflashplayer" src="'+ this.getAttribute('swf') +'" width="'+ this.getAttribute('width') +'" height="'+ this.getAttribute('height') +'"';
		con += ' id="'+ this.getAttribute('id') +'" name="'+ this.getAttribute('id') +'" ';
		for(var key in this.params){ 
			con += [key] +'="'+ this.params[key] +'" '; 
		}
		var pairs = this.getVariablePairs().join("&");
		if (pairs.length > 0){ 
			con += 'flashvars="'+ pairs +'"'; 
		}
		con += '/>';
	}else{
		con = '<object id="'+ this.getAttribute('id') +'" classid="'+ this.getAttribute('classid') +'"  codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version='+this.setAttribute("version")+',0,0,0" width="'+ this.getAttribute('width') +'" height="'+ this.getAttribute('height') +'">';
		con += '<param name="movie" value="'+ this.getAttribute('swf') +'" />';
		for(var key in this.params) {
		 con += '<param name="'+ key +'" value="'+ this.params[key] +'" />';
		}
		var pairs = this.getVariablePairs().join("&");
		if(pairs.length > 0) {con += '<param name="flashvars" value="'+ pairs +'" />';}
		con += "</object>";
	}
	return con;
}
SWFObject.prototype.write = function(elementId){	
	if(typeof elementId == 'undefined'){
		document.write(this.getHTML());
	}else{
		var n = (typeof elementId == 'string') ? document.getElementById(elementId) : elementId;
		n.innerHTML = this.getHTML();
	}
}


//--------------------------------------------------------
//postcard.js


//公共提示语
var ShowMsg = {
    CardName                :"为您制作的明信片",  
    Screenshot              :"正在截屏中,请稍后再操作",
    PicMsg                  :"只允许上传gif,jpg,jpeg,png格式，大小不能超过5M的图片，请修改后重新上传！",
    GetPicFail              :"文件上传或读取失败,请重试！",
    NoLogin                 :"您还未登录或者登录已过期，请重新登录",
    NoFile                  :"截图失败，请重试。",
    NetWorkBusy             :"网络繁忙，请稍后再试！",
    SystemBusy              :"系统繁忙，请稍后再试！",
    BigPic1                 :"放大文字后会超出文字编辑框，超出部分将不会显示在明信片上！",
    BigPic2                 :"您编辑的文字超出了明信片的文字编辑框，超出部分将不会显示在明信片上！",
    MaxTextNum              :"最多可输入200个文字！",
    SendingCard             :"正在发送明信片...",
    CreateingPic            :"正在生成图片...",
    NoCardData              :"没有明信片数据",
    PreviewCard             :"明信片预览",
    SendMMSCard             :"彩信发送明信片",
    NoRecNumber             :"请填写收件人地址。",
    RecNumberError          :"请正确填写接收人的邮箱地址:",
    MaxRecNum               :"收件人已超过上限{0}人",
    NoTitle                 :"未填写邮件主题，您确定发送吗？",
    HidTitle                :"隐藏主题",
    ChangeTitle             :"更改主题",
    Combo                   :"VIP5皮肤为5元版、20元版邮箱特供皮肤。立即升级，重新登录后即可使用。",
    ValidCodeTip            :"请点击获取验证码",
    ValidCodeIsEmpty        :"请输入图片验证码",
    ValidCodeError          :"图片验证码错误",
	ComboUpgradeMsg: '，<a href="javascript:top.$App.showOrderinfo();" style="color:#0344AE">升级邮箱</a>可添加更多！',
	PromptMsg: "可填入{0}个收件人，每个人收到的是单独发给他/她的明信片"
};

var currentTempId = 0;
var currentPhotoId = 0;
var currentStampId = 0;
var currentPostmarkId = 0;
var currentCate = 1;
var changePhoto = false;
var changeStamp = false;
var changePostmark = false;
var richInput=new Object();
var topGroupID=0;
var holidayID=0;
var pageSize = 8;
var pageIndex = 1;
var diskImageUrl="";
var maxReceiverNum = 50;
//var initFlashOver=false;

/*********************20110120添加(明信片调彩云需求)**************************/
function diskImgBtnClick()
{	
	top.OpenDisk({restype:1,width:450,height:350,callback:function(o)
	{
		//FloatingFrame.close();
		if (o.code == 0) {
			var url = o.rows[0].url;
			var objParam = {
				width: "450",
				height: "350",
				id: "0",
				thumb: url,
				url: url
			}
			var flash = GetFlashObj();
			try {
				flash.setPhoto(objParam)
			} 
			catch (e) {
			}
		}
		else
		{
			top.FloatingFrame.alert(o.info);
		}	
	}});
}
/***********************************************************/

//通讯录相关 Start
$(function() {
	getMaxRec();		//得到最大接收人
	initShowMsg();		//初始化提示语, 依赖getMaxRec

    $("#aContact").prev().css("cursor","pointer").click(function() {
        $("#aContact").click();
        return false;
    });
    $("#aContact").click(function() {
        var addrFrame = $("#addrFrame");
        if (addrFrame.length == 0) {
            var url = "http://{0}{1}/addrwin.htm?type=email&callback=AddrCallback&useNameText=true"
                .format(top.location.host,
                    top.isRichmail ? '' : top.stylePath);
            if (Utils.getAddrWinUrl) {
                url = Utils.getAddrWinUrl() + "?type=email&callback=AddrCallback&useNameText=true";
            }
            addrFrame = $("<iframe frameBorder='0' style='z-index:2048;display:none;border:1px solid #b1b1b1;height:350px;width:170px;position:absolute;' id='addrFrame' src='"+url+"'></iframe>");
            addrFrame.appendTo(document.body);
            $(document).click(function() {
                $("#addrFrame").hide();
            });
        }
        var jLink = $(this);
        var offset = jLink.offset();
        addrFrame.css({ top: offset.top + jLink.height(), left: offset.left - addrFrame.width() + jLink.width() });
        addrFrame.show();
        return false;
    });
    //地址自动匹配
    var param={
		container:document.getElementById("txtTo"),
		autoHeight:true,
		plugins: [RichInputBox.Plugin.AutoComplete]
	}
	richInput=new RichInputBox(param);
    richInput.setTipText(ShowMsg.PromptMsg);
    //richInput.focus();
	var email = $("#hdnRecNumber").val();
    if(email)
    {
        richInput.insertItem(email);
    } 
    
    //检查是否需要输入验证码
    /*var params = {};
	url = "http://" + window.location.host + "/Card/PostCard/SendMail.ashx";
	//Get请求的参数
	param = 
	{
		sid: window.top.UserData.ssoSid,
		type: 1,
		rnd: Math.random(),
		ActID:-1
	};
	$.getJSON(url, param, function(msg)
	{   	
	        alert(msg.isShowValidImg);
	}); */	
	if($("#hidisShowValidImg").val()=="0")
	{
	   $("#pnlVerfyCode").hide();
	   //RefreshImgRndCode();
	    //不显示图片验证码
	}else if($("#hidisShowValidImg").val()=="1")
	{
	    //显示图片验证码
	    $("#pnlVerfyCode").show();
	    $("#txtValidCode").val(ShowMsg.ValidCodeTip);
	    RefreshImgRndCode();
	}	
	
	//点击看不清
	$("#aValidCodeRefresh").click(function(){
	    RefreshImgRndCode();
	    return false;
	});
	
	//单周验证码输入框
	$("#txtValidCode").click(function(){
	
	     if(this.value=="ShowMsg.ValidCodeTip")
			{ 
				this.value="";
				$("#spValidCode").css("display","block");  
				//显示验证码
				RefreshImgRndCode(); 
			} 
	});
    
});

//刷新图片验证码
function RefreshImgRndCode ()
	{   
		try
		{
		    //debugger;
		    $("#txtValidCode").val('');
			document.getElementById("imgValidate").src = $("#hidImgCodePath").val() + Math.random();
			return false;
		}
		catch(e)
		{
		}
	}

function setTextAreaSize(txt) {
    if (!document.all) return;
    var height = txt.scrollHeight;
    if (height < 40) {
        txt.style.height = (height > 12 ? height : 12) + "px";
        txt.style.overflowY = "hidden";
    } else {
        txt.style.height = "45px";
        txt.style.overflowY = "scroll";
    }
    if (txt.lastHeight != txt.style.height) {
        txt.lastHeight = txt.style.height;
    }
}
function isLocal(){
    return false;
}
function AddrCallback(addr){
    richInput.insertItem(addr);
}
//通讯录相关End

function getMaxRec(){
	window.maxReceiverNum = top.$User.getCapacity("mailgsendlimit") || 400;
}

function initShowMsg(){
	ShowMsg.MaxRecNum = ShowMsg.MaxRecNum.format(window.maxReceiverNum);
	if (top.SiteConfig.comboUpgrade && !is20Version()) {//非20元套餐
		ShowMsg.MaxRecNum += ShowMsg.ComboUpgradeMsg;
	}
	
	ShowMsg.PromptMsg = ShowMsg.PromptMsg.format(window.maxReceiverNum);
}

function is20Version(){
	return top.$User.getServiceItem() == top.$User.getVipStr("20");
}

$(function() {
      //初始化收件人
      initAddrList();      
      if(document.getElementById("ulBoxList").style.display == "none") ShowMsg.PromptMsg = ""; 
      if(jsonData == null)
      {
          var dataStr = $("#hdnData").val();
          if(dataStr.length > 0)
             jsonData = eval('(' + dataStr + ')');
      }      
      //初始化主题内容
      SetSubject();      
      //发送/预览鼠标划过样式
      $(".toolbar li").hover(function(event){ $(this).addClass("current"); }, function(event){ $(this).removeClass("current"); });
      //模板/邮票/邮戳TAB切换
      $("#ulTab li").bind("click", function(event){
          $("#ulTab li").removeClass("current");
          $(".tabContent").hide();
          $(event.target).addClass("current");            
          var idNum = $(event.target).attr("id").substr(3,1);
          $("#divTab_"+idNum).show();           
          if($.trim($("#ulTab_"+idNum).html()) == "") ShowType(1, idNum);
      });      
     
      //显示分类
      var groupStr = $("#hidGroup").val();
      if(groupStr.length > 0)
      {
             groupjson = eval('(' + groupStr + ')');             
             ShowGroup(groupjson);
      }
      //设置选中某一个默认的系统模版      
      CheckDefaultTemp(); 
      //按页码显示素材      
      ShowType(pageIndex, "1");
      //换肤事件
      top.GlobalEvent.add("change_skin", function(skin) {
            var flashObject= GetFlashObj();   
           try
           {       
               flashObject.changeSkin(GetColorBySkin(skin));
           }
           catch(e)
           {
           } 
         
      });
      //设置初始化接收人
      if(Utils.queryString("to")!=null)
      {
        richInput.insertItem(Utils.queryString("to"));  
      }   
     var senddate = Utils.queryString("sendDate") || "";         
     if(senddate!=null&&senddate.length>0)
     {
         $("#chkDefiniteTime").attr("checked", true);          
         chkDefiniteTimeOnClick(senddate);
     }
     else
     {
        $("#chkDefiniteTime").attr("checked", false);
     }  	
      //设置分类
      if(Utils.queryString("classid")!=null)
      {
        var param = Utils.queryString("classid");
        topGroupID = param;
        holidayID = param;
        var tempArray = GetTempArray();
        if(tempArray.length>0)currentTempId = tempArray[0].id
        ChangeGroup(2, param, param, 1)
      }
      //SetDefaultSize();
      $("#hidTolist").val("");
	  //$(window).resize(SetDefaultSize);
	  
	  //查看是否为彩云照片页点击制作明信片需求 行为统计改造第二期 2011-07-26 add by 刘江
	  if($.trim(Utils.queryString("diskimage")).length>0)
	  {
	      top.addBehaviorExt({
            actionId:7020,
            thingId:0,
            moduleId:11
            });  
	  }
     
});

//选中指定的某个系统模版
function CheckDefaultTemp()
{
    var index = 0;
    if(Utils.queryString("tempid")!=null)
    {
        var defaultTemp=Utils.queryString("tempid");         
        var tempArray = GetTempArray();       
        if(tempArray.length > 0)
        {        
            for(var i=0;i<tempArray.length;i++)
            {
                if(tempArray[i].id == defaultTemp)
                {
                index = i;break;
                }
            }
            //计算此模版在第几页，页码从1开始
            pageIndex = parseInt(index/pageSize)+1;       
        } 
    }
    return index; 
}


//显示分类
function ShowGroup(groupjson)
{
    var vhtml = new Array();
    for(var i=0; i<groupjson.group.length; i++)
    {
        if(groupjson.group[i].Id == 1)
        {
            vhtml.push("<li id=\"liGroupId_" + groupjson.group[i].Id + "\"><a href=\"javascript:;\" onclick=\"ChangeGroup(2, 1, 0, 1); return false;\">" + groupjson.group[i].Name + "</a>");
            if(groupjson.group[i].Child.length>0)
            {
                vhtml.push("<ul  class=\"sub-category\" id=\"ulChildGroupId_"+groupjson.group[i].Id+"\" style=\"display:none\" >");//
                for(var j=0;j<groupjson.group[i].Child.length; j++)
                {
                    vhtml.push("<li><a href=\"javascript:;\" onclick=\"ChangeGroup(2, '"+groupjson.group[i].Id+"', '"+groupjson.group[i].Child[j].Id+"', 1); return false;\">" + groupjson.group[i].Child[j].Name + "</a></li>");
                }
                vhtml.push("</ul>");
            }
            vhtml.push("</li>");
        }
        else
        {
            vhtml.push("<li id=\"liGroupId_" + groupjson.group[i].Id + "\"><a href=\"javascript:;\" onclick=\"ChangeGroup(2, '"+groupjson.group[i].Id+"', '"+groupjson.group[i].Id+"', 1); return false;\">" + groupjson.group[i].Name + "</a></li>");
        }
    }		
	$("#divGroup").html(vhtml.join(""));
	
	//显示或不显示子分类
	$("#divGroup li").hover( 
        function(){$(this).find("ul").show()}, 
        function(){$(this).find("ul").hide()} 
    ); 
    //子分类样式
    $("#divGroup li ul").find("li").hover( 
        function(){$(this).addClass("on")}, 
        function(){$(this).removeClass("on")} 
    ); 
}

//选择分类
//newHot : 0=最新，1=最热, 2=按分类
//groupId:分类 如果topGroupId：0-所有分类；1-节日；2-生日；3-情感；4-祝福；5-其他。
//holidayid：节日   当前分类ID， 如果topGroupId=1，groupId=0 选择全部节日，否则为节日ID
//pageIndex：页码
function ChangeGroup(newHot, topgroup, group, pageIndex)
{
   topGroupID = topgroup;
   holidayID = group;
    //显示当前分类样式
    //$("#divTab_1 ul li").removeClass("current");    
    $("#divGroup li").removeClass("current");
    if(newHot==2) $("#liGroupId_" + topgroup).addClass("current");
    else if(newHot==0) $("#liNew").addClass("current");
    else if(newHot==1) $("#liHot").addClass("current");
    //隐藏子分类
    $("#ulChildGroupId_"+topgroup).hide();
    
   if(topGroupID!=""&&topGroupID!="0")
   {
      $(".category>li:gt(0)").show();
   }
   else
   {
      $(".category>li:gt(0)").hide(); 
   }
   ShowType(pageIndex, "1");
}

//根据样式获得FLASH颜色
function GetColorBySkin(skin)
{
    var color = "0xf7f7f7";
    switch(skin)
    {        
        case "skin_blue": color = "0xd3effb"; break;
        case "skin_green": color = "0xeefae3"; break;
        case "skin_mZone": color = "0xfbf9db"; break;
        case "skin_2010": color = "0xf7f7f7"; break;
        case "skin_xmas": color = "0xfff6e3"; break;
        case "skin_newYear": color = "0xfff6e3"; break;
        case "skin_pink": color = "0xfff6e3"; break;
        case "skin_snow": color = "0xf4f9fd"; break;
        case "skin_g1": color = "0xeefae2"; break;
        case "skin_love": color = "0xf4f9fd"; break;
        case "skin_shibo": color = "0xf4f9fd"; break;
        default : color = "0xf7f7f7"; break;
    }    
    return color;
}

////设置页面大小
//function SetDefaultSize() 
//{
//    var w = $(window);    
//    var H = w.height();
//    var headerHeight = $('.toolbar').height();
//    var commonHeight = H - headerHeight;
//    $("#container").height(commonHeight);
//}

//初始化主题内容
function SetSubject()
{
    var name = window.top.trueName;
    var uid = top.UserData.userNumber;
    if(name == ""||name == undefined)
    {
        if (top.$User && $User.isChinaMobileNumber()) {
            name = NumberTool.remove86(uid)
        } else {
            name = top.$User.getSendName();
        }
    }   
    $("#txtSubject").val(name + ShowMsg.CardName);
}

//显示Tab
function ShowType(pageIndex, id)
{
    if(jsonData == null) return;

    var vhtml = new Array();  
    var pageCount = 1;
    var startIndex = (pageIndex-1)*pageSize;
    var endIndex = pageIndex*pageSize;
    if(startIndex<0) startIndex = 0;

    switch(id)
    {
        //模板
        case "1":
            var tempArray = GetTempArray();
            if(endIndex > tempArray.length) endIndex=tempArray.length; 
            pageCount = parseInt((tempArray.length + pageSize - 1)/pageSize);      
            for(var i=startIndex; i<endIndex; i++)
            {
                var vip="";
                /*if(tempArray[i].combo==1)
                {
                    vip="<em class='v5'></em>";
                }
                else if(tempArray[i].combo==2)
                {
                   vip="<em class='v20'></em>";
                }*/
                if(tempArray[i].id == currentTempId)
                {
                    vhtml.push("<li id=\"liTemp_"+ i +"\" class=\"current\"><a href=\"javascript:;\" onclick=\"TempClick("+ i +");return false;\"><img alt=\"\" src=\""+ GetFullUrl(tempArray[i].thumb) +"\">"+vip+"</a></li>");
                }
                else
                    vhtml.push("<li id=\"liTemp_"+ i +"\"><a href=\"javascript:;\" onclick=\"TempClick("+ i +"); return false;\"><img alt=\"\" src=\""+ GetFullUrl(tempArray[i].thumb) +"\">"+vip+"</a></li>");
            }  
            break;
        
        //照片
        case "2":
            if(endIndex > jsonData.photo.length) endIndex=jsonData.photo.length; 
            pageCount = parseInt((jsonData.photo.length + pageSize - 1)/pageSize);      
            for(var i=startIndex; i<endIndex; i++)
            {
                if(jsonData.photo[i].id == currentPhotoId)
                    vhtml.push("<li id=\"liPhoto_"+ i +"\" class=\"current\"><a href=\"javascript:;\" onclick=\"PhotoClick("+ i +"); return false;\"><img alt=\"\" src=\""+ GetFullUrl(jsonData.photo[i].thumb) +"\"></a></li>")
                else
                    vhtml.push("<li id=\"liPhoto_"+ i +"\"><a href=\"javascript:;\" onclick=\"PhotoClick("+ i +"); return false;\"><img alt=\"\" src=\""+ GetFullUrl(jsonData.photo[i].thumb) +"\"></a></li>");
            }              
            break;
        
        //邮票
        case "3":            
            if(endIndex > jsonData.stamp.length) endIndex=jsonData.stamp.length; 
            pageCount = parseInt((jsonData.stamp.length + pageSize - 1)/pageSize);      
            for(var i=startIndex; i<endIndex; i++)
            {
                if(jsonData.stamp[i].id == currentStampId)
                    vhtml.push("<li id=\"liStamp_"+ i +"\" class=\"current\"><a href=\"javascript:;\" onclick=\"StampClick("+ i +"); return false;\"><img alt=\"\" src=\""+ GetFullUrl(jsonData.stamp[i].url) +"\"></a></li>");
                else
                    vhtml.push("<li id=\"liStamp_"+ i +"\"><a href=\"javascript:;\" onclick=\"StampClick("+ i +"); return false;\"><img alt=\"\" src=\""+ GetFullUrl(jsonData.stamp[i].url) +"\"></a></li>");
            }              
            break;
            
        //邮戳
        case "4":            
            if(endIndex > jsonData.postmark.length) endIndex=jsonData.postmark.length; 
            pageCount = parseInt((jsonData.postmark.length + pageSize - 1)/pageSize);      
            for(var i=startIndex; i<endIndex; i++)
            {
                if(jsonData.postmark[i].id == currentPostmarkId)
                    vhtml.push("<li id=\"liPostmark_"+ i +"\" class=\"current\"><a href=\"javascript:;\" onclick=\"PostmarkClick("+ i +"); return false;\"><img alt=\"\" src=\""+ GetFullUrl(jsonData.postmark[i].url) +"\"></a></li>");
                else
                    vhtml.push("<li id=\"liPostmark_"+ i +"\"><a href=\"javascript:;\" onclick=\"PostmarkClick("+ i +"); return false;\"><img alt=\"\" src=\""+ GetFullUrl(jsonData.postmark[i].url) +"\"></a></li>")
            }              
            break;
    }
    //更新素材样式
    $("#ulTab_1 li").removeClass("current");
    $("#liTemp_"+i).addClass("current");
    
   // $("#ulTab_"+id).html(vhtml.join("")); 
    
    /*******************处理图片中载两次代码****************************/
	
	  var dom=$("#ulTab_"+id)[0];
	  var temphtml=vhtml.join("");
       //为了防耻IE6两次
		if(Sys.ie)
        {
           
            dom.innerHTML="<div style=\"margin:0 auto;line-height:130px;width:60px;\">加载中...</div>";           
            //获取到请求下来的图片           
            var imgs=document.createElement("div");
            imgs.innerHTML=temphtml;          
            var images=imgs.getElementsByTagName("img");
          
            //等待图片加载完成
            var isComplete=true;
            
            var curinterval=window.setInterval(function(){
                for(var i=0;i<images.length;i++)
                {
                    //如果还有未加载完成的，不能翻页
                    if(!images[i].complete)
                    {
                        isComplete=false;
                        break;
                    }
                    isComplete=true;
                }
                if(isComplete)
                {
                    	
                    dom.innerHTML=imgs.innerHTML;
                    window.clearInterval(curinterval);
                    var pageHtml= PageNav(pageIndex, pageCount, id);
                    $("#ulPage_"+id).html(pageHtml);  
                    $("#ulPageTop_"+id).html(pageHtml);  
                    if(pageCount<2) 
                    {
                        $("#ulPage_"+id).hide();
                        $("#ulPageTop_"+id).hide();
                    }
                    else
                    {
                        $("#ulPage_"+id).show();
                        $("#ulPageTop_"+id).show();
                    }
                    
			         	
                }
            },10);
        }
        else
        {
                dom.innerHTML=temphtml;
                var pageHtml= PageNav(pageIndex, pageCount, id);
                $("#ulPage_"+id).html(pageHtml);  
                $("#ulPageTop_"+id).html(pageHtml);  
                if(pageCount<2) 
                {
                    $("#ulPage_"+id).hide();
                    $("#ulPageTop_"+id).hide();
                }
                else
                {
                    $("#ulPage_"+id).show();
                    $("#ulPageTop_"+id).show();
                }
        }
	/*******************结束处理图片中载两次代码****************************/
	
    
   /* var pageHtml= PageNav(pageIndex, pageCount, id);
    $("#ulPage_"+id).html(pageHtml);  
    $("#ulPageTop_"+id).html(pageHtml);  
    if(pageCount<2) 
    {
        $("#ulPage_"+id).hide();
        $("#ulPageTop_"+id).hide();
    }
    else
    {
        $("#ulPage_"+id).show();
        $("#ulPageTop_"+id).show();
    }*/
}

//获得全路径URL
function GetFullUrl(s)
{    
    if(s.indexOf(CardResAddress) == -1) s = CardResAddress + s;
    return s;
}

//获得摸板列表数组
function GetTempArray()
{
    var type = topGroupID;
    var cate = $("#hdnTempCate").val();
    if(type == ""||type == "0")
    {//全部
        if(cate == "0")
        {//最新
           return jsonData.style.newTemp;
        }
        else
        {//最热
           return jsonData.style.hotTemp;
        }
    }
    else
    {
        var tempArray = new Array();
        //debugger;
        for(var i=0; i<jsonData.style.newTemp.length; i++)
        {
            if(jsonData.style.newTemp[i].groupid == parseInt(type))
            {
                if(parseInt(type)==1&&parseInt(holidayID)!=0)//详细节日
                {
                    if(jsonData.style.newTemp[i].holidayid == parseInt(holidayID))
                        tempArray.push(jsonData.style.newTemp[i]);
                }
                else
                {
                    tempArray.push(jsonData.style.newTemp[i]);
                }
            }
        }
        return tempArray;
    }  
}


//翻页条
function PageNav(pageIndex, pageCount, id)
{
    pageIndex=parseInt(pageIndex);
    pageCount=parseInt(pageCount);
    var prevClass = "previous";
    var nextClass = "next";
    if(pageIndex<1) pageIndex = 1;
    if(pageIndex>pageCount) pageIndex = pageCount; 
    if(pageIndex == 1) prevClass = "previous-disabled";
    if(pageIndex == pageCount) nextClass = "next-disabled";    
    var prevIndex = pageIndex - 1;
    var nextIndex = pageIndex + 1;  
    var pageStr = "";
    if(prevIndex < 1) pageStr +="";// "<li><a title=\"上一页\">上一页</a></li>";
    else pageStr += "<li><a href=\"javascript:;\" title=\"上一页\" onclick=\"javascript:ShowType("+ prevIndex + ", '" + id + "');\">上一页</a></li>";
    if(nextIndex > pageCount) pageStr += "";//"<li><a  title=\"下一页\">下一页</a></li>";
    else pageStr += "<li><a href=\"javascript:;\"  title=\"下一页\" onclick=\"javascript:ShowType("+ nextIndex + ", '" + id + "');\">下一页</a></li>";

    pageStr += "<li><select id=\"selPage\" onchange=\"ShowType(this.value, '" + id + "')\">";
    for(var i=1; i<=pageCount; i++)
    {
        if(pageIndex==i)
            pageStr+="<option value="+i+" selected>"+i+"/"+pageCount+"页</option>";
        else
            pageStr+="<option value="+i+">"+i+"/"+pageCount+"页</option>";
    }
    pageStr+="</select></li>";  
    return pageStr;
}

//获得FLASH对象
function GetFlashObj()
{
    return document.getElementById("Postcard");
}

var preableCard=null;
//摸板点击事件
function TempClick(index)
{   
    top.addBehaviorExt({
            actionId:10572,
            thingId:0,
            moduleId:14
        });  

    var tempArray = GetTempArray();    
    if(tempArray.length > index)
    {     
    // currentTempId=tempArray[index].id;  
        //if(tempArray[index].id == currentTempId) return;
        ChangeTempSetCss(tempArray, index); 

            var currentUserCombo=parseInt(top.UserData.vipInfo.MAIL_2000009);
            if(currentUserCombo>=tempArray[index].combo)
            {
                //用户套餐可用的
                preableCard=tempArray[index];
               
            }
            else
            {
                //用户套餐不可以发送对应的明信片
                var msg=""
                switch (tempArray[index].combo) {
                    case 1:
                        msg= top.UtilsMessage.vipNoPermissionNotice.format("5", "、20元版", "明信片");
                        msg=msg.substring(0,20)+msg.substring(23);
                       
                        break;
                    case 2:
                        msg= top.UtilsMessage.vipNoPermissionNotice.format("20", "", "明信片");
                        break;
                    default:
                        msg= top.UtilsMessage.vipNoPermissionNotice.format("5", "、20元版", "明信片");
                         msg=msg.substring(0,20)+msg.substring(23);
                        break;
                 }
                
                top.FloatingFrame.confirm(msg, function(){
                                //单击确认,调整到套餐页,返回到上一张可用的
                               
                                 try
                                   {     
                                        GetFlashObj().setTemplate(preableCard);
                                         currentTempId=preableCard.id;
                                   } 
                                   catch(e)
                                   {
                                    }  
                                    
                                     top.Links.show('upgradeGuide');
									 top.addBehaviorExt({
										actionId: 102327,
										moduleId: 14
									});
                            }, function(){
                                 //单击取消,返回到上一张可用的
                                 try
                                   {     
                                        GetFlashObj().setTemplate(preableCard);
                                         currentTempId=preableCard.id;
                                   } 
                                   catch(e)
                                   {
                                    }
                            });
                             (function(){
                                 if (top.$(".clR\\ CloseButton").length > 0) {
                                     top.$(".clR\\ CloseButton")[0].onclick = function () {
                                         GetFlashObj().setTemplate(preableCard);
                                         currentTempId = preableCard.id;
                                     }
                                 } else if (top.$Msg) {
                                     var dialog = top.$Msg.getCurrent();
                                     dialog.on("close", function () {
                                         GetFlashObj().setTemplate(preableCard);
                                         currentTempId = preableCard.id;
                                     });
                                 }
                            })();
            }
           
       try
       {     
            GetFlashObj().setTemplate(tempArray[index]);
             currentTempId=tempArray[index].id;
       } 
       catch(e)
       {
       }
    }
}

//更换默板设置当前使用照片/邮票/邮戳样式
function ChangeTempSetCss(tempArray, index)
{
    if(tempArray.length > index)
    {
        currentTempId = tempArray[index].id;
        var flashWidth = tempArray[index].template.mask!=null&&tempArray[index].template.mask.width!=null?tempArray[index].template.mask.width:0;
        var flashHeight = tempArray[index].template.mask!=null&&tempArray[index].template.mask.height!=null?tempArray[index].template.mask.height:0;
        if(flashWidth<486) flashWidth=486;//flash最小宽度为486
        if(flashHeight<378) flashHeight=378;//flash最小高度为378
        GetFlashObj().width = flashWidth;
        GetFlashObj().height = flashHeight + 42;//42为flash头的高度
        //设置全url
        if(tempArray[index].thumb!=null)
        {
            tempArray[index].thumb = GetFullUrl(tempArray[index].thumb); 
        }
        if(tempArray[index].template.photo!=null&&tempArray[index].template.photo.url!=null)
        {
            tempArray[index].template.photo.url = GetFullUrl(tempArray[index].template.photo.url); 
        }
        if(tempArray[index].template.mask!=null&&tempArray[index].template.mask.url!=null)
        {
            tempArray[index].template.mask.url = GetFullUrl(tempArray[index].template.mask.url); 
        }
        if(tempArray[index].template.stamp!=null&&tempArray[index].template.stamp.url!=null)
        {
            tempArray[index].template.stamp.url = GetFullUrl(tempArray[index].template.stamp.url); 
        }
        if(tempArray[index].template.postmark!=null&&tempArray[index].template.postmark.url!=null)
        {
            tempArray[index].template.postmark.url = GetFullUrl(tempArray[index].template.postmark.url); 
        }
        $("#ulTab_1").find(".current").removeClass("current");
        $("#liTemp_"+index).addClass("current");  
        if(!changePhoto)
        {
            if(tempArray[index].template.photo!=null&&tempArray[index].template.photo.id!=null)currentPhotoId = tempArray[index].template.photo.id;
            $("#ulTab_2").find(".current").removeClass("current");
            for(var i=0; i<jsonData.photo.length; i++)
            {
                if(jsonData.photo[i].id == currentPhotoId)
                {
                    $("#liPhoto_"+i).addClass("current"); 
                    break
                }
            }
        }
        if(!changeStamp)
        {
            if(tempArray[index].template.stamp!=null&&tempArray[index].template.stamp.id!=null)currentStampId = tempArray[index].template.stamp.id;
            $("#ulTab_3").find(".current").removeClass("current");
            for(var i=0; i<jsonData.stamp.length; i++)
            {
                if(jsonData.stamp[i].id == currentStampId)
                {
                    $("#liStamp_"+i).addClass("current"); 
                    break
                }
            }
        }
        if(!changePostmark)
        {
            if(tempArray[index].template.postmark!=null&&tempArray[index].template.postmark.id!=null)currentPostmarkId = tempArray[index].template.postmark.id;
            $("#ulTab_4").find(".current").removeClass("current");
            for(var i=0; i<jsonData.postmark.length; i++)
            {
                if(jsonData.postmark[i].id == currentPostmarkId)
                {
                    $("#liPostmark_"+i).addClass("current"); 
                    break
                }
            }
        }
    }
}

//照片点击事件
function PhotoClick(index)
{
    top.addBehaviorExt({
            actionId:10572,
            thingId:0,
            moduleId:14
        });

    if(jsonData.photo.length > index)
    {
        if(jsonData.photo[index].id == currentPhotoId) return;
        currentPhotoId = jsonData.photo[index].id;
        changePhoto = true;
        $("#ulTab_2").find(".current").removeClass("current");    
        $("#liPhoto_"+index).addClass("current"); 
        jsonData.photo[index].url = GetFullUrl(jsonData.photo[index].url); 
        GetFlashObj().setPhoto(jsonData.photo[index]);
    }
}

//邮票点击事件
function StampClick(index)
{
    top.addBehaviorExt({
            actionId:10572,
            thingId:0,
            moduleId:14
        });

    if(jsonData.stamp.length > index)
    {
        if(jsonData.stamp[index].id == currentStampId) return;
        currentStampId = jsonData.stamp[index].id;
        changeStamp = true;
        $("#ulTab_3").find(".current").removeClass("current");
        $("#liStamp_"+index).addClass("current"); 
        jsonData.stamp[index].url = GetFullUrl(jsonData.stamp[index].url); 
        GetFlashObj().setStamp(jsonData.stamp[index]);
    }
}

//邮戳点击事件
function PostmarkClick(index)
{
    top.addBehaviorExt({
            actionId:10572,
            thingId:0,
            moduleId:14
        });

    if(jsonData.postmark.length > index)
    {
        if(jsonData.postmark[index].id == currentPostmarkId) return;
        currentPostmarkId = jsonData.postmark[index].id;
        changePostmark = true;
        $("#ulTab_4").find(".current").removeClass("current");
        $("#liPostmark_"+index).addClass("current");
        jsonData.postmark[index].url = GetFullUrl(jsonData.postmark[index].url);
        GetFlashObj().setPostmark(jsonData.postmark[index]);
    }
}

//改变模板分类
function ChangeType(obj)
{
   var type = obj.value;
   if(type=="")
   {
      $(".category>li:gt(0)").show();
   }
   else
   {
      $(".category>li:gt(0)").hide(); 
   }
   ShowType(1, "1");
}

//最新/最热
function ChangeCate(type)
{
    //显示当前分类样式
    $("#divTab_1 ul li").removeClass("current");    
    $("#divGroup li").removeClass("current");
    if(type==0)$("#liNew").addClass("current");
    else $("#liHot").addClass("current");
    currentCate=type;
    $("#hdnTempCate").val(type);
   topGroupID="0";//最新最热默认显示全部分类
   ShowType(1, "1");
}

//调用摄像头
function InvokeCamera()
{
     GetFlashObj().invokeCamera();
}

//改变Tab，供Flash调用
//type: 1=模板，2=照片，3=邮票，4=邮戳
function ChangeTab(type)
{
    if(type == 1 || type == 2) return;
    $("#li_"+type).click();
}

//初始化FLASH，供Flash调用
function InitFlash()
{
    currentTempId = 0;
    currentPhotoId = 0;
    currentStampId = 0;
    currentPostmarkId = 0;
    changePhoto = false;
    changeStamp = false;
    changePostmark = false;
    
    var tempArray = GetTempArray();
    if(tempArray.length > 0)
    {
        var index=CheckDefaultTemp();      
        ChangeTempSetCss(tempArray, index); 
         //初始化上一张可用套餐
        preableCard=tempArray[index];
        GetFlashObj().setTemplate(tempArray[index]);
       
         
         
        if(Utils.queryString("diskimage")!=null)
          {
            diskImageUrl=Utils.queryString("diskimage");
            diskImageUrl=decodeURIComponent(diskImageUrl);   
            
            if(diskImageUrl.indexOf("sid={sid}")>0){
                diskImageUrl=diskImageUrl.replace("{sid}",ssoid)
            }                   
           // window.location = diskImageUrl;
            var objParam = {
                width:"450",
                height:"350",
                id:"0",
                thumb: diskImageUrl,
                url:diskImageUrl
            }
            GetFlashObj().setPhoto(objParam);
          }      
        return tempArray[index]
    }
    else
    {
        return null;
    }
}

//获得用户本次登录上传的照片,供Flash调用
function UserUploadPhoto()
{
    var photoJson = null;
    var photoDataStr = $("#hdnPhotoData").val();
    if(photoDataStr.length > 0)
        photoJson = eval('(' + photoDataStr + ')');
    
    return photoJson;        
}

//FLASH加载时获得当前样式color
function GetCurrentSkin()
{
    var skin = top.Utils.getCookie("SkinPath");//获取当前皮肤
    return GetColorBySkin(skin);
}

//获得SID，供Flash调用
function getSID()
{
    if(sso_sid.length == 0)
    {
          //获取COOKIE值
          sso_sid = ssoid + "&coremailSid="+sid + "&ASP.NET_SessionId="+sessionId;          
    }
    return sso_sid;
}

//获得sid和userNumber， 供Flash调用
function getUserNumber()
{
    return "&ssoid=" + ssoid + "&usernumber=" + top.UserData.userNumber;
}

//flash点击函数
function FlashClick(){
    $(document).click();
}

//判断是否可以上传图片
function IsAllowUpload(){
    if(top.ComposeCaptureing!=undefined && top.ComposeCaptureing==true){
        alert(ShowMsg.Screenshot);
        return false;
    }    
    return true;
}

//弹出错误提示，供Flash调用
function AlertMsg(msg, callFunc)
{
    var isOpen = top.FloatingFrame.current && !top.FloatingFrame.current.isDisposed;
    if(!isOpen) top.FloatingFrame.alert(msg, callFunc); 
} 

//弹出错误码提示，供Flash调用
function AlertMsgCode(code)
{
    //1=文件格式错误，2=文件大小超过，3=保存文件失败，4=未登陆，5=没有文件, 7=网络问题，8=安全问题， 9=系统错误
    //101=小字放大超出编辑区域, 102=输入超出编辑区,103=超过200字不能再输入
    top.WaitPannel.hide();//关闭
    SetSendClick();
    var msg = "";
    var callFunc = null;
    switch(code)
    {
        case "1": msg=ShowMsg.PicMsg; break; //文件格式错误
        case "2": msg=ShowMsg.PicMsg; break; //文件大小超过
        case "3": msg=ShowMsg.GetPicFail; break;
        case "4": msg=ShowMsg.NoLogin; break;
        case "5": msg=ShowMsg.NoFile; break;
        case "7": msg=ShowMsg.NetWorkBusy; break;
        case "8": msg=ShowMsg.NetWorkBusy; break;
        case "9": msg=ShowMsg.SystemBusy; break;
        case "101": msg=ShowMsg.BigPic1; callFunc = function(){try{GetFlashObj().focus();}catch(e){}}; break;
        case "102": msg=ShowMsg.BigPic2; callFunc = function(){try{GetFlashObj().focus();}catch(e){}}; break;
        case "103": msg=ShowMsg.MaxTextNum; callFunc = function(){try{GetFlashObj().focus();}catch(e){}}; break;
    }
    if(code == "4") window.location.href = "http://" + window.location.host + "/Error/systemTip4.html";
    else if(msg.length>0) AlertMsg(msg, callFunc);
}

//截屏， 供Flash调用
function ScreenSnap()
{
    if(Utils.isScreenControlSetup(true))
    {        
        var ret =  ScreenSnapshotctrl.GetScreenSnapshotImg(10, "http://" + window.location.host + "/Card/FileUploads.ashx?sid="+ssoid, "");  
    }
}

//截屏回调
function ScreenSnapCallBack(id, nResult, strResponse)
{
    window.focus();
    top.MM.activeModule("postcard");
    top.WaitPannel.hide();//关闭
    
    if(nResult == 0)
    {
        var code = parseInt(strResponse);
        
        if(code > 0) AlertMsgCode(code+"");
        else
        {
            ClearCurrentPhotoId();
            GetFlashObj().captureScreen(strResponse);               
        }
    }
}

//清除当前照片ID
function ClearCurrentPhotoId()
{
    currentPhotoId = 0;
    changePhoto = true;
    $("#ulTab_2").find(".current").removeClass("current");  
}

//调用FLASH预览/发送明信片
//type: 0=预览,1=发送，2=发彩信
function FlashPostcard(type)
{
    if(Utils.PageisTimeOut(true))return false;
    
    if(jsonData != null && jsonData.style.hotTemp.length > 0)
    {       
        if(type !=2)//非彩信发送，验证合法性
        {
            if(!validate()) return;
        }       
       
        var spanSend=document.getElementById("spanSend");
        var spanMmsSend=document.getElementById("spanMmsSend");
        var spanPreSend=document.getElementById("spanPreSend");
        var spanSend1=document.getElementById("spanSend1");
        var spanMmsSend1=document.getElementById("spanMmsSend1");
        var spanPreSend1=document.getElementById("spanPreSend1");        
        click1=spanSend.onclick;
        click2=spanMmsSend.onclick;
        click3=spanPreSend.onclick;
        click1=spanSend1.onclick;
        click2=spanMmsSend1.onclick;
        click3=spanPreSend1.onclick;
        spanSend.onclick=spanSend1.onclick=null;
        spanMmsSend.onclick=spanMmsSend1.onclick=null;
        spanPreSend.onclick=spanPreSend1.onclick=null; 
        $("#hidTolist").val(getEmailstr());
        
        window.top.PostCardValid=$("#txtValidCode").val();
        
        if(type == 1){
            top.WaitPannel.show(ShowMsg.SendingCard);
            //查检是否需要输入验证码
	        if($("#pnlVerfyCode").css("display")=="block")
	        {
	            if($("#txtValidCode").val()=="" || $("#txtValidCode").val()==ShowMsg.ValidCodeTip)
	            {
	                 top.FloatingFrame.alert(ShowMsg.ValidCodeIsEmpty);
	                 return ;
	            }
	        }
            
            SendMail();
        }
        else{ 
            top.WaitPannel.show(ShowMsg.CreateingPic);
            try{
                GetFlashObj().snapshot(type);
            }catch(e){
                top.WaitPannel.hide();//关闭
                SetSendClick();
            }
        }
    }
    else
    {
        top.FloatingFrame.alert(ShowMsg.NoCardData);
    }
}

//恢复按钮事件
function SetSendClick()
{
    if(typeof(click1) == "undefined" || click1 == null) return;
    if(typeof(click2) == "undefined" || click2 == null) return;
    if(typeof(click3) == "undefined" || click3 == null) return;
    var spanSend=document.getElementById("spanSend");
    var spanMmsSend=document.getElementById("spanMmsSend");
    var spanPreSend=document.getElementById("spanPreSend");
    var spanSend1=document.getElementById("spanSend1");
    var spanMmsSend1=document.getElementById("spanMmsSend1");
    var spanPreSend1=document.getElementById("spanPreSend1");
    spanSend.onclick=click1;
    spanMmsSend.onclick=click2;
    spanPreSend.onclick=click3;   
    spanSend1.onclick=click1;
    spanMmsSend1.onclick=click2;
    spanPreSend1.onclick=click3;   
    
}

//弹出预览层
function PopPreviewDiv()
{      
    var url = "http://" + window.location.host + "/Card/PostCard/Preview.aspx?sid=" + ssoid;
    FloatingFrame.open(ShowMsg.PreviewCard, url, 540, 360, true);
}

//弹出发彩信层
function PopMmsDiv(param)
{      
    var url = "http://" + window.location.host + "/Card/PostCard/Sendmms.aspx?sid=" + ssoid + param;    
    var actid = $("#hidActID").val();
    if(actid.length>0){
        url=url+"&actid="+actid;
    }
    FloatingFrame.open(ShowMsg.SendMMSCard, url, 730, 365, true);
}

//明信片预览/发送,FLASH调用
//photoId：0=自制照片， 其他为系统照片
//type=我传给snapshot的参数
function preview(type, url, tempId, photoId, stampId, postmarkId, text)
{    
    if(Utils.PageisTimeOut(true))return false;
    top.WaitPannel.hide();//关闭
    SetSendClick();
    window.top.postcardWindow = window;    
    if(type == 0)
    {//预览        
        PopPreviewDiv();//弹出预览层
        var iframeObj = top.FloatingFrame.current.jContent[0].getElementsByTagName("iframe")[0];
        $(iframeObj).load(function(){
            var imgObj = iframeObj.contentWindow.document.getElementById("imgPreview");
            var aSendObj = iframeObj.contentWindow.document.getElementById("aSend");  
            $(imgObj).load(function(){ 
                if(this.height<=500) top.FloatingFrame.setHeight(this.height + 40);
                else
                {
                    top.FloatingFrame.setHeight(540);
                    $(imgObj).height(500);
                }
                top.FloatingFrame.setWidth(this.width + 30);
            });
            imgObj.src = url;  
            aSendObj.href = "javascript:window.top.postcardWindow.SendPostCard(" + type + ",'" + url + "'," + tempId + "," + photoId + "," + stampId + "," + postmarkId + ");";
        });
    }
    else if(type == 1)
    {//发送
        SendPostCard(type, url, tempId, photoId, stampId, postmarkId);
    }
    else if(type == 2)
    {//彩信      
        if(text == null) text = "";
        var mobile = GetToMobile();
        var title = $("#txtSubject").val();
        var param = "&mobile=" + escape(mobile) + "&cardtitle=" + escape(title) + "&cardcontent=" + escape(text) + "&cardimagepath="+ escape(url)+"&validId="+currentTempId;
        PopMmsDiv(param);//弹出彩信层
    }
}

//获得收件人邮箱中的手机号码，多个用逗号分割
function GetToMobile()
{
    var arrEmail=richInput.getRightEmails();
    var result="";
    if(arrEmail.length>0)
    {
        for(var i=0;i<arrEmail.length;i++)
        {
            var email = top.MailTool.getAccount(arrEmail[i]);
            if(Utils.isChinaMobileNumber(email))
            {
                result+=email+";";           
            }
        }
    }  
    if(result.length > 0) result = result.substr(0, result.length-1);
    return result;
}

//彩信发送成功回调
function MmsSendCallback(re)
{
    top.FloatingFrame.close();
    top._postcard_re = re;
    var url = "http://" + window.location.host + "/Card/PostCard/Success.aspx?sid="+ssoid+"&type=1"+"&tempid="+currentTempId;  
    var actid = $("#hidActID").val();
    if(actid.length>0){
        url=url+"&actid="+actid;
    }    
    window.location.href = url;
}

//预览发送明信片
function SendPostCard(type, url, tempId, photoId, stampId, postmarkId)
{
    if(Utils.PageisTimeOut(true))return false;

    if(type == 0)
    {//预览
       //关闭预览窗口
       top.FloatingFrame.close();
       if(!validate()) return;
    }

    top.WaitPannel.show(ShowMsg.SendingCard);
    
    $("#hdnUrl").val(url);
    $("#hdnTempId").val(tempId);
    $("#hdnPhotoId").val(photoId);
    $("#hdnStampId").val(stampId);
    $("#hdnPostmarkId").val(postmarkId);
   
    var url = "SendMail.ashx?sid="+ssoid+"&coremailSid="+sid+"&vaildiCode="+window.top.PostCardValid+"&type=1";
    var actid = $("#hidActID").val();
    if(actid.length>0){
        url=url+"&actid="+actid;
    }
    $("#frmSend").attr("action", url);
    $("#frmSend").submit();
}


function getEmailstr()
{
    var arrEmail=richInput.getRightEmails();
    var emaillist='';
    if(arrEmail.length>0)
    {
        for(var i=0;i<arrEmail.length;i++)
        {
           emaillist+=top.MailTool.getAddr(arrEmail[i])+";";           
        }
    }
    return emaillist;
}

//直接发送明信片
function SendMail()
{       
    if(Utils.PageisTimeOut(true))return false;
    
    var paramObj = new Object();
    paramObj["account"] = $("#selFrom").val();
    paramObj["txtTo"] = getEmailstr();
    paramObj["txtCc"] = "";
    paramObj["txtBcc"] = "";
    paramObj["txtSubject"] = $("#txtSubject").val();
    paramObj["priority"] = document.getElementById("chkUrgent").checked ? "1" : "";
    paramObj["return_receipt"] = document.getElementById("chkReceipt").checked ? "1" : "";
    paramObj["chkSaveToSentBox"] = document.getElementById("chkSaveToSentBox").checked ? "1" : "";
    paramObj["chkDefiniteTime"] = document.getElementById("chkDefiniteTime").checked ? "1" : "";
    paramObj["vaildiCode"]=$("#txtValidCode").val();
  
    if(paramObj["chkDefiniteTime"] == "1"){
        paramObj["selYear"] = $("#selYear").val();
        paramObj["selMonth"] = $("#selMonth").val();
        paramObj["selDay"] = $("#selDay").val();
        paramObj["selHour"] = $("#selHour").val();
        paramObj["selMinute"] = $("#selMinute").val();
    }else{
        paramObj["selYear"] = "";
        paramObj["selMonth"] = "";
        paramObj["selDay"] = "";
        paramObj["selHour"] = "";
        paramObj["selMinute"] = "";
    }
    paramObj["actid"] = $("#hidActID").val();
   
    try{
        GetFlashObj().sendCard(paramObj);
    }catch(e){
        top.WaitPannel.hide();//关闭
        SetSendClick();
    }
}

//发送完成flash回调
function SendMailResponse(ret)
{
    top.WaitPannel.hide();//关闭
    SetSendClick();
    var retJson = eval('(' + ret + ')');
    
    if(retJson.retCode == false)
    {
        if(retJson.msg==-100)
        {
            AlertMsg(ShowMsg.ValidCodeError);
            RefreshImgRndCode();
            return;
        }
        if(retJson.type == "alert") AlertMsg(retJson.msg);
        else location.href = retJson.url;
    }
    else
    {
        top._postcard_un = retJson.un;
        top._postcard_re = retJson.re;
        top._postcard_et = retJson.et;
        location.href = retJson.url;
    }
}

//------------------------------------------------------------

/* 初始化发件人下拉框 */
function initAddrList(){
    /*var from=Utils.queryString("from");
    var selFrom=document.getElementById("selFrom");
    UserData=window.top.UserData;
    var mailAccount=uid+"@"+coremailDomain;
    var trueName=window.top.UserData.userName;
    addItem(mailAccount);
    for(var i=0;i<UserData.uidList.length;i++){
        var mail=UserData.uidList[i]+"@"+coremailDomain;
        if(mailAccount!=mail)addItem(mail);
    }
    selFrom.options.add(new Option("别名设置","0"));
    selFrom.options.add(new Option("发件人设置","1"));
    function addItem(addr){
        var text=trueName?'"{0}"<{1}>'.format(trueName,addr):addr;
        var item=new Option(text,addr);
        selFrom.options.add(item);
	item.innerHTML = item.innerHTML.replace(/\&amp\;/ig, "&");
        if(item.value==from)item.selected=true;
    }*/

	top.Utils.UI.selectSender("selFrom",true,document);

}

//发件人select onchange的时候
function selFromOnChange(){
    var selFrom=document.getElementById("selFrom");
    if(selFrom.value=="0"){
        selFrom[0].selected=true;
        window.top.Links.show("alias");//发件人下拉框里点击"设置别名"
    }else if(selFrom.value=="1"){
        selFrom[0].selected=true;
        window.top.Links.show("sendername");//发件人下拉框里点击"设置发件人姓名"
    }
}


//修改主题
function aAddSubjectOnClick(link){
    var txt=document.getElementById("txtSubject");
    var container=txt.parentNode.parentNode;
    if(container.style.display=="none"){
        container.style.display="";
        link.innerHTML=ShowMsg.HidTitle;
        link.titleBak=link.title;
        link.title="";
        Utils.focusTextBox(txt);
    }else{
        container.style.display="none";
        link.innerHTML=ShowMsg.ChangeTitle;
        link.title=link.titleBak;
        _LastFocusAddressBox=document.getElementById("txtTo");
    }
}

//点击定时发信
function chkDefiniteTimeOnClick(setTime){
    var chk=document.getElementById("chkDefiniteTime");
    var container=document.getElementById("spanDefiniteTime");
    if(chk.checked){
        $(container).show();
        var now=new Date();
        var htmlCode="";
        htmlCode+='<label><select id="selYear" name="selYear">';
        htmlCode+="<option value='$i'>$i</option>".$(now.getFullYear(),now.getFullYear()+5).join("");
        htmlCode+='</select>年</label>'
		htmlCode+='<label><select id="selMonth" name="selMonth">';
		htmlCode+="<option value='$i'>$i</option>".$(1,12).join("");
		htmlCode+='</select>月</label>'
		htmlCode+='<label><select id="selDay" name="selDay">';
		htmlCode+="<option value='$i'>$i</option>".$(1,31).join("");
		htmlCode+='</select>日</label>'
		htmlCode+='<label><select id="selHour" name="selHour">';
		htmlCode+="<option value='$i'>$i</option>".$(0,23).join("");
		htmlCode+='</select>时</label>'
		htmlCode+='<label><select id="selMinute" name="selMinute">';
		htmlCode+="<option value='$i'>$i</option>".$(0,59).join("");
		htmlCode+='</select>分</label>'
		container.innerHTML=htmlCode;
		var selYear=$("#selYear")[0],
		    selMonth=$("#selMonth")[0],
		    selDay=$("#selDay")[0],
		    selHour=$("#selHour")[0],
		    selMinute=$("#selMinute")[0];
		$("#selMonth").change(function(){
		    var date = new Date();
            date.setFullYear($("#selYear").val());
            date.setDate(1);
            date.setMonth($("#selMonth").val());
            date.setDate(0);
            var days = date.getDate();
            date.setDate(1);
            var weekDays = ["日 星期天", "日 星期一", "日 星期二", "日 星期三", "日 星期四", "日 星期五", "日 星期六"];
            var startWeekDay = date.getDay();
            selDay.options.length = 0;
            for (var i = 1; i <= days; i++) {
                var wd = (startWeekDay + i - 1) % 7;
                var op = new Option(i + weekDays[wd], i);
                if (wd == 0 || wd == 6) {
                    op.style.color = "red";
                }
                selDay.options.add(op);
            }
		});
		$("#selYear").change(function(){$("#selMonth").change()});
		if(setTime!=null&&setTime.length>0)
        {
            var defaultTime = Utils.parseDateString(setTime)
             //默认初始化后选中当前日期
		    for(var i=0;i<selYear.length;i++)if(selYear[i].value==defaultTime.getFullYear())selYear[i].selected=true;
		    selMonth[defaultTime.getMonth()].selected=true;
		    $("#selMonth").change();
		    selDay[defaultTime.getDate()-1].selected=true;
		    selHour[defaultTime.getHours()].selected=true;
		    selMinute[defaultTime.getMinutes()].selected=true;
        }
        else
        {
		    //默认初始化后选中当前日期
		    for(var i=0;i<selYear.length;i++)if(selYear[i].value==now.getFullYear())selYear[i].selected=true;
		    selMonth[now.getMonth()].selected=true;
		    $("#selMonth").change();
		    selDay[now.getDate()-1].selected=true;
		    selHour[now.getHours()].selected=true;
		    selMinute[now.getMinutes()].selected=true;
		}
    }else{
        cancelDefiniteTime();
    }
    //document.getElementById("container").scrollTop=10000;
    $("#selYear").focus();
}

//取消定时邮件
function cancelDefiniteTime(){
    var chk=document.getElementById("chkDefiniteTime");
    var container=document.getElementById("spanDefiniteTime");
    chk.checked=false;
     $(container).hide();
}

//检查收件人地址合法性
function checkInputData()
{    
    var error = richInput.getErrorText();
    if(error)
    {        
        checkInputData.errorAddr=error.encode();
        return false;;
    }
    return true;
}
//验证输入数据
function validate()
{
    if(!richInput.hasItem()){
        top.FloatingFrame.alert(ShowMsg.NoRecNumber, function(){richInput.focus(); });
        return false;
    }
    if(!checkInputData()){
        top.FloatingFrame.alert(ShowMsg.RecNumberError+checkInputData.errorAddr, function(){richInput.focus(); });
        return false;
    } 
    //计算收件人个数
    var Emails=richInput.getRightEmails();
    if(Emails.length>maxReceiverNum){
		top.$Msg.confirm(ShowMsg.MaxRecNum, function(){
			is20Version() ? richInput.focus() : top.$App.showOrderinfo();
		}, function(){
			//
		})
    }
    
    if ($("#txtSubject").val() == "") {
		if(window.confirm(ShowMsg.NoTitle)){
			$("#txtSubject").val("来自"+$("#selFrom").val()+"的来信");
		}else{
			return false;
		}
	}
	
	
	
	return true;
}
$(function(){
    $("#txtTo").width(475);
});