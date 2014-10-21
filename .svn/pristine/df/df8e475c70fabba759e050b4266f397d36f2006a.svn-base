
var picWidth = 0;
var picHeight = 0;
var MaxReceiverMobile = 200;
var MaxDaySend = 1000;
var MaxMonthSend = 10000;

//公共提示语
var ShowMsg = {
    GetMMSInfoFail          :"获取赠送彩信使用情况失败，请稍后再试。",
    SendingCard             :"正在发送...",
    SystemBusy              :"彩信发送失败，请稍后再试。",
    NoRecNumber             :"请填写接收手机号码后再发送",  
    NoCode                  :"请输入验证码",
    WrongRecNumber          :"请正确填写接收手机号码:",
    MaxRecNumber            :"可同时发给{0}人，手机号以分号“;”隔开，可向全国移动用户发送",
    LoadingPicFail          :"图片加载失败，请关闭弹出窗后重试！",
    NoSendCard              :"确定不发送此明信片吗?",
    RecNumberLength         :"发送人数超过上限：{0}人",
	ComboUpgradeMsg: '，升级邮箱可添加更多！'
};

var richInput=new Object();
//
var templeteId=-1;

$(function(){
    if(Utils.PageisTimeOut(true))return false;
    top.Contacts.init("mobile", window);
    //地址自动匹配
    var param={
		container:document.getElementById("txtTo"),		
		type:"mobile",		
		plugins: [RichInputBox.Plugin.AutoCompleteMobile]
	}
	richInput=new RichInputBox(param);	
	//richInput.setTipText(GetMaxReceiverInfo());
	richInput.focus(); 
    $("#imgPreview").load(function(){
       picWidth = this.width;
       picHeight = this.height;    
       ChangeArea(); 
    });
    
        //隐藏验证码输入框
    $("#trControlValidCodeShow").css("display","none");
    //获得彩信赠送信息
    GetMmsInfo();    
    
    //接收参数
    var mobile = $.trim(Utils.queryString("mobile"));
    if(mobile.length > 0) 
    {
        richInput.insertItem(mobile);
    }
    var tonumber = $.trim(Utils.queryString("to"));
    if(tonumber.length > 0) 
    {
        richInput.insertItem(tonumber);
    }
    
    $("#tbTitle").val(Utils.queryString("cardtitle"));
    
    //模板ID
    templeteId=Utils.queryString("validId")
    if(Utils.queryString("cardimagepath") != "") $("#imgPreview").attr("src", Utils.queryString("cardimagepath"));
    if($.trim(Utils.queryString("cardcontent")).length<=0)
    {
        $("#spPageCount").html("1");
    }
    $("#pCardText").html(TextValue2Html(HtmlEncode(Utils.queryString("cardcontent"))));
    $("#hdnContent").val(Utils.queryString("cardcontent"));
    
    $("#hdnPic").val(Utils.queryString("cardimagepath"));    
    
    
    if($("#hdnContent").val().replace(/\s/ig, "").replace(/\r/ig, "").replace(/\n/ig, "").replace(/\r\n/ig, "").length > 0){
        document.getElementById("aPreviewNext").href = "javascript:ChangeMobileScreen(0);";
        $("#aPreviewNext").attr("className", "next-1");
        $(".page").show();
    }
           
    //绑定手机品牌
    BindMobileBrand();
    //点击获得验证码
    $("#txtCode").bind("focus", function(event){
         if(typeof($("#imgRnd").attr("src")) == "undefined" || $("#imgRnd").attr("src") == "") refreshImgRndCode();    
         $("#divCodeImg").show();
         var txtCodeObj = document.getElementById("txtCode");
         if(txtCodeObj.value == txtCodeObj.defaultValue)  txtCodeObj.value = "";      
    });  
    $(document).click(function(e){
        if(e.target.id != "imgCode" && e.target!=document.getElementById("txtCode")){
            $("#divCodeImg").hide();
        }
    })      
});

// 对Html进行编码
function HtmlEncode(s)
{
    s = s.replace(/&/g, "&amp;");	    
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/\"/g, "&quot;");
    return s;
}

function TextValue2Html(s)
{	    
    s = s.replace(/\r/ig, "<br />");
    s = s.replace(/\n/ig, "<br />");
    return s.replace(/\r\n/ig, "<br />");
}

$("body").append("<script></" + "scrip>");

var jqueryPath = "http://images.139cm.com/m/coremail/js/jquery.js";

//获得彩信赠送信息
function GetMmsInfo()
{
	//初始化公共数据
	var param = {
		fromType: 1
	};
	var dataXml = top.namedVarToXML("", param, "");

	if(top.isRichmail){//rm环境
		$("body").append("<iframe src=\""+top.SiteConfig.mmsMiddleware+"mms/proxy.htm\" id=\"proxyIframe\" name=\"proxyIframe\" style=\"display:none;\"></iframe>");
		
		Utils.waitForReady("frames['proxyIframe'].$", function(){
			getMmsInfoAjax(frames['proxyIframe'].$, dataXml);
		});
	}else{//cm环境
		getMmsInfoAjax($, dataXml);
	}
}

function getInterfaceUrl(key) {
    var url = Utils.getAddedSiteUrl(key);
    //兼容新版
    return url.replace("/mw2/","/");
}
/**
 * 获得彩信信息初始化ajax
 * @param {Object} s 不同环境的$
 * @param {String} data 发送的请求数据
 */
function getMmsInfoAjax(s, data) {
     s.ajax({
		type:"POST",
		url: getInterfaceUrl("mmsInitData"),
		dataType:"json",
		data:data,
		cache:false,
		contentType:"application/xml;charset:utf-8",
		success:function(msg){
			if(msg.code == "S_OK"){
				if (Number(msg.groupNumHint)) {//获取群发条数
					MaxReceiverMobile = Number(msg.groupNumHint);
				}

				//组装发送人数超过上限的提示语
				ShowMsg.RecNumberLength = ShowMsg.RecNumberLength.replace("{0}", MaxReceiverMobile);
				if (top.SiteConfig.comboUpgrade && !is20Version()) {//非20元套餐
					ShowMsg.RecNumberLength += ShowMsg.ComboUpgradeMsg;
				}

				getMaxDayMonthSend(msg.chargeHint);

				richInput.setTipText(GetMaxReceiverInfo());
				//验证码输入框的显示隐藏控制
				if(msg.validateUrl==""){
					$("#trControlValidCodeShow").css("display","none");
				}else{
					$("#trControlValidCodeShow").css("display","");
				}

				function showPartnerTip() {
				    if (top.$App) { //向后兼容，只在新版添加此功能
				        if (top.$User.needMailPartner()) {
				            $("#divMsg2").append("<br><br><div><a href='javascript:top.$App.show(\"mobile\");FF.close();'>*开通邮箱伴侣</a>享受更多彩信优惠</div>");
				            if (top.BH) {
				                top.BH("partner_guide3");
				            }
				        }
				        
				    }
				}
				
				//获得每月赠送彩信信息
				var tipMsg = msg.chargeHint;
				if(tipMsg.length > 0){
					tipMsg = tipMsg.replace(/class="style12font-ff0000"/g, "").replace(/限发/g, '限发<span>').replace(/条/g, '</span>条');
					var arrmsg = tipMsg.split("。");
					$("#divMsg").html(arrmsg[0]);
					$("#divMsg2").html(arrmsg[1]);

					showPartnerTip();
				}
			}
		},
		error:function(XmlHttpRequest, textStatus, errorThrown){
			//错误处理
			alert(ShowMsg.GetMMSInfoFail);
			AjaxErrorLog("/Mms/Support.ashx?type=4", XmlHttpRequest.responseText);
		}
    });
 }
/*
//获得每月赠送彩信信息
function GetPresentMmsInfo(data)
{
    var s = data.FreeInfo.replace("class=\"style12font-ff0000\"", "");
    var arrmsg = s.split("。");
    $("#divMsg").html(arrmsg[0]);
    var msg2 = arrmsg[1].replace(new RegExp('限发', 'g'),'限发<span>').replace(new RegExp('条', 'g'),'</span>条');
    $("#divMsg2").html(msg2);
}*/

function is20Version(){
	return top.$User.getServiceItem() == top.$User.getVipStr("20");
}

function getMaxDayMonthSend (str) {
	if (str == "") return;

	var dayMatch = str.match(/每天限发(\d*)/),
		monthMatch = str.match(/每月限发(\d*)/);

	dayMatch && (MaxDaySend = dayMatch[1]);
	monthMatch && (MaxMonthSend = monthMatch[1]);
}

/**
 * @param {Boolean} isMonth 必填 true 为月封顶
 */
function tipMaxDayMonthSend (isMonth) {
	var self = this,
		txt = "发送彩信超过{0}封顶上限：{1}条{2}",
		txt1 = "，升级邮箱可提高每{0}发送上限。",
		day = "日",
		month = "月";

	if (isMonth) {
		txt1 = txt1.format(month);
		txt = txt.format(month, MaxMonthSend, is20Version() ? "" : txt1);
	} else {
		txt1 = txt1.format(day);
		txt = txt.format(day, MaxDaySend, is20Version() ? "" : txt1);
	}

	top.$Msg.confirm(txt, function(){
		!is20Version() && top.$App.showOrderinfo();
	}, function(){
		//
	})
}

//获得最多发送人数信息
function GetMaxReceiverInfo()
{
    return ShowMsg.MaxRecNumber.replace("{0}", MaxReceiverMobile);
}

//绑定手机品牌
function BindMobileBrand()
{
    var selBrandObj = document.getElementById("selBrand");
    for(var i=0; i<brandArray.length; i++)
    {
        selBrandObj.options.add(new Option(brandArray[i], i)); 
    }
}

//改变手机品牌事件
function ChangeBrand()
{
    var selModelObj = document.getElementById("selModel");
    selModelObj.options.length = 0;    
    selModelObj.options.add(new Option("型号", "128,128"));
    
    var brandId = document.getElementById("selBrand").value;
    if(brandId.length == 0) return;
    
    var arr = $.grep(modelArray, function(n, i){
            return n[0] == brandId;
    });
    for (var i = 0; i < arr.length; i++) {
        var mobileWidth = arr[i][2];
        var mobileHeight = arr[i][3];
        if (mobileWidth == 0) {
            mobileWidth = 128;
        }
        if (mobileHeight == 0) {
            mobileHeight = 128;
        }
        selModelObj.options.add(new Option(arr[i][1], mobileWidth + "," + mobileHeight)); 
    }
}

//radio点击
function RadioClick(obj)
{
    obj.checked = true;
    if(obj.value == "1"){
        $("#selBrand").removeAttr("disabled");
        $("#selModel").removeAttr("disabled");
        $("#selAreaCommon").attr("disabled", "disabled");
    }else{
        $("#selAreaCommon").removeAttr("disabled");
        $("#selBrand").attr("disabled", "disabled");
        $("#selModel").attr("disabled", "disabled");         
    }
}

//改变手机尺寸
function ChangeArea()
{    
    if(picWidth > picHeight){
        $("#divPicScreen").attr("className", "screen1"); 
        if(picWidth/224 > picHeight/168){ $("#imgPreview").width(224); $("#imgPreview").height(224*picHeight/picWidth); }
        else{ $("#imgPreview").height(168); $("#imgPreview").width(168*picWidth/picHeight); } 
    }else{
        $("#divPicScreen").attr("className", "screen2");
        if(picWidth/168 > picHeight/224){ $("#imgPreview").width(168); $("#imgPreview").height(168*picHeight/picWidth); }
        else{ $("#imgPreview").height(224); $("#imgPreview").width(224*picWidth/picHeight); }
    }
    $("#pCardPic").attr("className", "resolution3");        
    
    $("#divTextScreen").attr("className", "screen2");
    $("#pCardText").attr("className", "resolution4");    
}

//改变手机屏幕
function ChangeMobileScreen(type)
{
    if(type==0){
        $("#trText").show();
        $("#trPic").hide();
    }else{
        $("#trText").hide();
        $("#trPic").show();
    }	        
}
function getNumber(numberText) {
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
//获得收件人邮箱中的手机号码，多个用逗号分割
function GetToMobile()
{
    var arrEmail=richInput.getRightNumbers();
    var result="";
    if(arrEmail.length>0)
    {
        for(var i=0;i<arrEmail.length;i++)
        {
            var email = getNumber(arrEmail[i]);
            if(Utils.isChinaMobileNumber(email))
            {
                result+=email+",";           
            }
        }
    }
    if(result.length > 0) result = result.substr(0, result.length-1);
    return result;
}

//发送彩信
function SendMms()
{
    if(Utils.PageisTimeOut(true))return false;
    
    if(!validate()) return;
    var actid= $("#hidactid").val();
    var aSend=document.getElementById("aSendMms");
    var click1=aSend.onclick;
    aSend.onclick=null;    
      
    var selZoom = "240,320";
    if(document.getElementById("telC1").checked)
    {
        selZoom = $("#selModel").val();
    }
    else
    {
        selZoom = $("#selAreaCommon").val();
    }
    var zoomArray = selZoom.split(",");
    var zoomWidth = parseInt(zoomArray[0]);
    var zoomHeight = parseInt(zoomArray[1]);    
    var r = 0;
    var h = zoomHeight;
    var w = zoomWidth;
    var z = 1;
    /***不做旋转,不丢失图片等比缩放*****/
        if(picWidth/zoomWidth > picHeight/zoomHeight){
            z = zoomWidth/picWidth;                       
        }else{
            z = zoomHeight/picHeight;
        }
  /**************************/
    /*if(picWidth>picHeight){    
        r = 90;      
        if(picWidth/zoomHeight > picHeight/zoomWidth){
            z = zoomHeight/picWidth;                        
        }else{
            z = zoomWidth/picHeight;
        } 
 
    }else{
        r = 0; 
        if(picWidth/zoomWidth > picHeight/zoomHeight){
            z = zoomWidth/picWidth;                       
        }else{
            z = zoomHeight/picHeight;
        }
    }*/

    var mobilelist = GetToMobile();
	var validateValue = $("#txtCode").val();
	if(validateValue == "点击查看图片验证码"){
		validateValue = "";
	}
    //如果修改彩信记录日志。需要MMS配合。
	var dataJson = {
		imageUrl:$("#hdnPic").val(),
		content:escape($("#hdnContent").val()), 
		validate:validateValue,
		materialId:templeteId,
		title:escape($("#tbTitle").val()), 
		receiverNumber:mobilelist,
		width:w,
		height:h,
		round:r,
		zoom:z,
		fromType:"web",
		actionId:1
	}
	var dataXml = top.namedVarToXML("",dataJson,"");

	if(top.isRichmail){//rm环境		
		Utils.waitForReady("frames['proxyIframe'].$", function(){
			getSendMmsAjax(frames['proxyIframe'].$, dataXml);
		});
	}else{//cm环境
		getSendMmsAjax($, dataXml);
	}

	/**
	 * 获得彩信发送ajax
	 * @param {Object} s 不同环境的$
	 * @param {String} data 发送的请求数据
	 */
	function getSendMmsAjax(s, data){
		s.ajax({
			type:"POST",
			url: getInterfaceUrl("mmsPCard"),
			dataType:"json",
			cache:false,
			data:data,
			contentType:"application/xml;charset:utf-8",
			beforeSend:function(XMLHttpRequest)
				{
					top.WaitPannel.show(ShowMsg.SendingCard);
				},
			success:function(msg)
				{
					aSend.onclick=click1;
					top.WaitPannel.hide();
					if (msg.code == "S_OK") {//成功
						//统计活动发彩信成功清单
						if(actid!=null&&actid!="0"){                    
							var acturl = "ActivityStat.ashx?sid="+ssoid+"&actid="+actid+"&mobile="+mobilelist;//$("#tbMobile").val();    
							$.ajax({url: acturl,async: false});
						}
						var re = mobilelist.replace(/(")([ \S\t]*?)("\s*<)/g,"");
						re = re.replace(/<|>/g, "").replace(/[;；，]/g, ",");
						window.top.postcardWindow.MmsSendCallback(re);
						//记录统计成功发送彩信明信片的接收人数
						WriteSuccessLog(richInput.getRightNumbers().length);	
					} else if (msg.code == "VALIDATE_ERR" || msg.code == "MMS_VALIDATE_INPT") {
						$("#txtCode").val($("#txtCode")[0].defaultValue);
						refreshImgRndCode();
						$("#trControlValidCodeShow").show();
						alert(msg.resultMsg);
					} else if (msg.code == "MMS_DAY_LIMIT" && top.SiteConfig.comboUpgrade) {
						tipMaxDayMonthSend();
					} else if (msg.code == "MMS_MONTH_LIMIT" && top.SiteConfig.comboUpgrade) {
						tipMaxDayMonthSend(true);
					} else{
						alert(msg.resultMsg || ShowMsg.SystemBusy);
					}
				},  
			complete:function(XMLHttpRequest,textStatus)
				{                 
					aSend.onclick=click1;
					top.WaitPannel.hide();  
				},
			error:function(XmlHttpRequest, textStatus, errorThrown)
				{
					//错误处理
					alert(ShowMsg.SystemBusy);
					AjaxErrorLog("/Mms/Support.ashx?type=3", XmlHttpRequest.responseText);
				}
		});
	}
}

//成功写日志上报
function WriteSuccessLog(receivers)
{  
   if(receivers==0)return;
   $.ajax({
        type:"POST",
        url:"SuccessBehavior.ashx?rnd="+Math.random(),
        cache:false,
        data:{
                sid:ssoid,
                count:receivers
             },            
        success:function(data)
            {                       
                //成功处理
            },            
        error:function()
            {
                //错误处理
            }
   });
}


function getajax(url) 
{
    var result = "";
    try {
        result = $.ajax({
            url: url,
            async: false
        }).responseText;
    }
    catch (e) {
        result = "";
    }
    return result;
}
            

//Ajax调用错误记录日志
function AjaxErrorLog(requesturl, msg)
{      
   $.ajax({
        type:"POST",
        url:"/Card/AjaxErrorLog.ashx?rnd="+Math.random(),
        cache:false,
        data:{
                sid:ssoid,
                requesturl:requesturl,
                msg:msg
             },            
        success:function(data)
            {                          
                //成功处理
            },            
        error:function()
            {
                //错误处理
            }
   });
}

//检查收件人手机合法性
function checkMobileData(){
    var error = richInput.getErrorText();
    if(error)
    {        
        checkMobileData.errorAddr=error.decode();
        return false;
    }
    return true;
}
//验证输入数据
function validate(){
    if(picWidth == 0 || picHeight == 0)
    {
        top.FloatingFrame.alert(ShowMsg.LoadingPicFail);
        return false;
    }   
    if(!richInput.hasItem()){        
         top.FloatingFrame.alert(ShowMsg.NoRecNumber);
         richInput.focus();
        return false;
    } 
   
     if($("#trControlValidCodeShow").css("display")!="none")
    {
        if($.trim($("#txtCode").val())=="" || $("#txtCode").val() == $("#txtCode")[0].defaultValue){
            top.FloatingFrame.alert(ShowMsg.NoCode);
            $("#txtCode").focus();
            return false;
        }    
    }
    if(!checkMobileData()){
        alert(ShowMsg.WrongRecNumber+checkMobileData.errorAddr);
        richInput.focus();//$("#tbMobile").focus();
        return false;
    }
    //计算收件人个数    
    var Emails=richInput.getRightNumbers();
    if(Emails.length>MaxReceiverMobile){
        //top.FloatingFrame.alert(ShowMsg.RecNumberLength.replace("{0}", MaxReceiverMobile));
		top.$Msg.confirm(ShowMsg.RecNumberLength, function(){
			!is20Version() && top.$App.showOrderinfo();

		}, function(){
			richInput.focus();
		})
        return false;
    } 
	return true;
}

//关闭弹出框提示
function onFloatingFrameClose(){
    return window.confirm(ShowMsg.NoSendCard);
}

//通讯录 start
function AddrCallback(addr){
     richInput.insertItem(addr);
}
$(function() {
    $("#aAddrBook").prev().css("cursor","pointer").click(function() {
        $("#aAddrBook").click();
        return false;
    });
    $("#aAddrBook").click(function() {
        var addrFrame = $("#addrFrame");
        if (addrFrame.length == 0) {
         //兼容RM
            var url = "http://{0}{1}/m2012/html/addrwin.html?type=mobile&callback=AddrCallback&useNameText=true"
                .format(top.location.host,
                    top.isRichmail ? '' : top.stylePath);

            addrFrame = $("<iframe frameBorder='0' style='z-index:2048;display:none;border:1px solid #b1b1b1;height:310px;width:170px;position:absolute;' id='addrFrame' src='"+url+"'></iframe>");
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
    
    //AutoCompleteMenu.createPhoneNumberMenuFromLinkManList(document.getElementById("tbMobile"), true);
    //@2014-7-1 add by wn 隐藏手机类型
    var tb = $(".mmsInfo").find("table")[0];
    $(tb).find("tr").each(function( order , item ){
        if( order === 2){
            $(item).hide();
        }
        if( order === 3 ){
            $(item).hide();
        }
    });
});
//end

