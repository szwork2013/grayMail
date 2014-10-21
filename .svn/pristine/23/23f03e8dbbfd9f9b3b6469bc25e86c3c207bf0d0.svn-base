/*
 标准版页面公用Js
 */
 
  
 jQuery.fn.trim = function(s, o){
    var sNos = s;
    var sBegin = sNos.substring(0, 1);
    if (sBegin == o) {
        sNos = sNos.substring(1, sNos.length);
    }
    if (sNos == "") {
        return sNos;
    }
    var sEnd = sNos.substring(sNos.length - 1, sNos.length);
    if (sEnd == o) {
        sNos = sNos.substring(0, sNos.length - 1);
    }
    return sNos;
}
jQuery.fn.getParmByUrl = function(o){
    var url = window.location.toString();
    var tmp;
    if (url && url.indexOf("?")) {
        var arr = url.split("?");
        var parms = arr[1];
        if (parms && parms.indexOf("&")) {
            var parmList = parms.split("&");
            jQuery.each(parmList, function(key, val){
                if (val && val.indexOf("=")) {
                    var parmarr = val.split("=");
                    if (o) {
                        if (typeof(o) == "string" && o == parmarr[0]) {
                            tmp = parmarr[1] == null ? '' : parmarr[1];
                        }
                    }
                    else {
                        tmp = parms;
                    }
                }
            });
        }
    }
    return tmp;
}

jQuery.fn.getUrlPath = function(){
    var url = window.location.toString();
    var tmp;
    if (url && url.lastIndexOf("/")) {
        tmp = url.substring(0, url.lastIndexOf("/"));
    }
    return tmp;
}

String.format = function() {
    if( arguments.length == 0 )
        return null; 

    var str = arguments[0]; 
    for(var i=1;i<arguments.length;i++) {
        var re = new RegExp('\\{' + (i-1) + '\\}','gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
}

window.alert = function(str){
    top.FloatingFrame.alert(str);
}
//============begin UCIdiograph.ascx==================
function SelectedIdiograph(obj)
{
	var selIdiographValue = obj.options[obj.selectedIndex].value;
	
	if (obj.selectedIndex == obj.options.length -1 && selIdiographValue == "＝＝设置短信签名＝＝")
	{
	    window.location.href = idiographediturl;
	    return;
	}
	if (obj.selectedIndex != 0)
	{
	    var objContent = document.getElementById(inputId);
	    objContent.focus();
	    setTimeout(function(){
		    objContent.value = objContent.value+"【"+obj.options[obj.selectedIndex].value+"】";		
		    //光标定位
		    try
		    {
		        //IE
                var r =objContent.createTextRange();
                r.moveStart("character",objContent.value.length);
                r.collapse(true);
                r.select();
            }
            catch(e)
            {
                try
                {
                    //FireFox
                    objContent.setSelectionRange(objContent.value.length,objContent.value.length);
                    objContent.focus();
                }
                catch(e){}
            }
        },0);
	}
}
//============end UCIdiograph.ascx===============

//============begin DateDropDownList.ascx===========
function dateChange(pName)
{
 var selYear=eval("document.getElementById('"+pName+"_lsdYear')");
 var year=selYear.options[selYear.selectedIndex].value;
 var selMonth=eval("document.getElementById('"+pName+"_lsdMonth')");
 var month=selMonth.options[selMonth.selectedIndex].value;
 if (year==''||month=='')
 {
    return true;
 }
 else
 {
   var date=new Date(year,month,0);
   var day=date.getDate();
   var selDay=eval("document.getElementById('"+pName+"_lsdDay')"); 
   var m=selDay.options[selDay.length-1].value;
   var tmp=selDay.options[selDay.selectedIndex].value;
   if (m>day)
   {
    for (i=selDay.length-1;i>0;i--)
    {
	   m=selDay.options[i].value;
	   if (m>day)
	   {
	      selDay.length--;
	   }
	   else
	   {
	      break;
	   }
    }
    if (tmp>day)
    {
     selDay.selectedIndex=selDay.length-1;
    }
   }
   else if (m<day)
   {
	for(i=1;i<=day-m;i++)
	{
		j=selDay.length++;
		selDay.options[j].value=parseInt(m)+i;
		selDay.options[j].text=parseInt(m)+i;
	}
   }
   return true; 
 }
}  
//============end DateDropDownList.ascx=============

//============begin Send.aspx=================
var groupLength = 2;
var smsLength = 350;
var TJ_IsNote = true;
var TJ_Total = 0;
var TJ_Sended = 0;
var TJ_CanSend = 0;
var TJ_FeeValue = 0.1;
var validateUrl = "";
var isUserPartner = false;
var isSetPartner = false;
//文本提示语是否存在
var isContentTip = false;
function initSend(){

   
    //界面调整
    setCommonPage();
    setAddressHeight();
    $(window).resize(setAddressHeight);
    if(window!=window.top){
        //联系人自动完成
        AutoCompleteMenu.createPhoneNumberMenuFromLinkManList($("#txtMobile")[0],true);
        //第一个参数是通讯录的容器,第二个是手机号码文本框
        AddressBook.createTelStyle($("#divLinkManSearch")[0], $("#txtMobile")[0],true);
    }
    if (!$.browser.msie) {
        //非IE绑定字数检查
        changeInspector("txtContent");
        $(".addressList .tab li").removeClass("on");
        $(".addressList .tab .li1").addClass("on");
        $(".addressListContent2").hide();
        $(".addressListContent1").show();
    }
    //字数检查
    CheckInputWord(0);
    //焦点
    $("#txtMobile").focus();
    //内容提示语
	setContentTip();
	//验证码提示语
	$("#tbValidate").val("请点击获取验证码");
    //是否已经加载了短信基地
    var isLoadSmsList = false;
    //邮箱伴侣(仅广东和辽宁开通邮箱伴侣)
    if (!isUserPartner && !isSetPartner && (ProvCode == "1" || ProvCode == "7") && TJ_CanSend <= 0) {
        top.FloatingFrame.open("免费条数已超出", $().getUrlPath() + "/ShowPartner.aspx?Money=" + TJ_FeeValue + "&rnd=" + Math.random(), 480, 325);
    }
	//定时短信
	if ($(".definiteTime input:eq(2)").attr("checked"))	{
		$(".definite").css("display", "inline");
	}
   //浙江套餐
    if (isDayLimit=="True")
    {
        var statinfo =  $("#divEMail").find("p")[0].innerHTML;
        var freeinfo = statinfo.split("|")[0];
        var feeinfo = statinfo.split("|")[1];
        $("#divEMail").find("p")[0].innerHTML= freeinfo;
        $("#tbPonit input:eq(0)").click(function()
        {
            $("#divEMail").find("p")[0].innerHTML= freeinfo;
        })
        $("#tbPonit input:eq(1)").click(function(){
           $("#divEMail").find("p")[0].innerHTML= feeinfo;
        }); 
        $("#tbPonit")[0].style.display="";      
    }
    else
    {
        $("#trPonit")[0].style.display=""; 
    }
    $("#divEMail")[0].style.display="";
    //启动手机号码检查器
    new CreateInputMobileChecker("#txtMobile",groupLength,300).satrt();
        
    //事件放在一起
    //定时发送启用
    $(".definiteTime input:eq(2)").click(function(){
        $(".definite").css("display", "inline");
    });
    //定时发送关闭
    $(".definiteTime input:eq(1)").click(function(){
        $(".definite").hide();
    });
    //显示验证码区域
    jQuery(".rnd").focus(function(){
        if (!$(".rndNum span").is(":visible")) {
			$("#tbValidate").val("");
            $(".rndNum span").css("display", "block");
            refreshValidate();
            return false;
        }
    });
    
    
    //换一个验证码
    $(".rndNum p a").click(function(){
        refreshValidate();
        return false;
    });
    //联系人与其他栏目切换
    $(".addressList .tab .li1").click(function(){
        $(".addressList .tab li").removeClass("on");
        $(this).addClass("on");
        $(".addressListContent2").hide();
        $(".addressListContent1").show();
    });
    $(".addressList .tab .li2").click(function(){
        $(".addressList .tab li").removeClass("on");
        $(this).addClass("on");
        $(".addressListContent2").show();
        $(".addressListContent1").hide();
        if (!isLoadSmsList)
        {
			$(".headerMS").html("<div style='text-align:center'>加载中...</div>");
			$.post(
				"SmsListBar.aspx",
				{sid:window.top.UserData.ssoSid},
				function (data){
					$(".headerMS").html(data);
					bindPage();
				}
			);
        	isLoadSmsList = true;
        }
    });
    //短信基地换页
	$("#ddlFirst").livequery("change",function(){
		bindPage();
	});
	$("#ddlPager").livequery("change",function(){
		var param = $("#ddlFirst").selectedValues().toString();
		var classId = param.split(",")[0];
		var subClassId = param.split(",")[1];
		var page = $(this).selectedValues().toString().split("/")[0];
		if (classId > 0) {
			$(".addressListContent2 iframe").attr("src", "/uploads/html/SmsListBar/SmsList_" + classId + "_" + subClassId + "-" + page +".html");
		}
		else {
			$(".addressListContent2 iframe").attr("src", "SmsList.aspx?ClassId=" + classId + "&SubClassId=" + subClassId + "&page=" + page);
		}
	});
//    //联系人伸缩
//    $("#addressSwitch").click(function(){
//        var toggleArea = $(".addressList");
//        toggleArea.toggle();
//        if (toggleArea.is(":visible")) {
//            $(".writeWrapper").css("margin-left", "-170px");
//            $(".writeContent").css("margin-left", "170px");
//            $(this).addClass("addressSwitchOn");
//            $(this).removeClass("addressSwitchOff");
//        }
//        else {
//            $(".writeWrapper").css("margin-left", "0");
//            $(".writeContent").css("margin-left", "0");
//            $(this).removeClass("addressSwitchOn");
//            $(this).addClass("addressSwitchOff");
//        }
//    });
        $("#addressSwitch").click(function()
            {
                $("#pageComposeSMS").toggleClass("hideSidebar");
            });

    //联系人列表伸缩
    $(".addressList").find("dt").click(function(){
        var answer = $(this).next();
        if (answer.is(":visible")) {
            answer.hide();
            $(this).addClass("on");
        }
        else {
            answer.show();
            $(this).removeClass("on");
        }
    });
    //发送
    $("#btnSendButtom").click(function(){
        if (CheckSms()) {
            __doPostBack("btnSend", "");
        }
        return false;
    });
    //焦点事件
    $("#txtMobile").focus(function(){
        $(".addressList .tab .li1").click();
    });
	$("#txtMobile").blur(function(){
		var result = new Array();
		var mobilestr = $.trim($("#txtMobile").val());		
		//var regex = /，/gi;
		//mobilestr = mobilestr.replace(regex,",");
		//regex = /;/gi;
		//mobilestr = mobilestr.replace(regex,","); 
		//regex = /；/gi;
		//mobilestr = mobilestr.replace(regex,",");  
        var mobiles = mobilestr.split(/,|，|;|；/);		
		for(i=0;i<mobiles.length;i++)
		{
			var isRepeat = false;
			for(j=0;j<result.length;j++)
			{
				if (Get86Mobile(mobiles[i]) == Get86Mobile(result[j].value))
				{
					isRepeat = true;
					break;
				}
			}
			if (!isRepeat)
			{
				result.push({index:result.length,value:mobiles[i]});
			}
		}
		var arr = new Array(result.length);
		for(i=0;i<result.length;i++)
		{
			arr[i] = result[i].value;
		}
		$("#txtMobile").val(arr.join(","));
    });
    $("#txtContent").focus(function(){
        clearContentTip();
        $(".addressList .tab .li2").click();
    });
    //字数检查
    $("#txtContent").bind("propertychange", CheckInputWordCount);
	$("input[name='rblSendType']").click(CheckInputWordCount);	
    //短信追尾
    $(".sms-content p").hover(function(){$(this).addClass("hover");},
                    function(){ $(this).removeClass("hover"); 
                  });
    if(ProvCode=="1" || ProvCode=="2")
    {
        $("#smsFrom").css("display","");
    }
	//打开通讯录
	$(".addressMore").click(function(){
		var menu=new PopMenu();
	    menu.addItem("打开通讯录",function(){top.Links.show("addr");top.addBehavior("发短信页通讯录");});
	    menu.show(this);
	}) 
}

//右侧及细线高度自适应
function setAddressHeight(){
    var sizeTo = jQuery(window).height() - jQuery(".toolBar").height() - 6;
    //var sizeTo = 500;
    
    //jQuery("#pageCompose").height(sizeTo);
    //jQuery(".writeWrapper").height(sizeTo);
    jQuery("#pageComposeSMS").height(sizeTo);
    jQuery(".addressSwitchWrapper").height(sizeTo);
    jQuery(".addressListContent1 dl").height(sizeTo - 55);
    jQuery(".addressListContent2 iframe").height(sizeTo - 30 - 55);
    jQuery(".addressList").height(sizeTo);
}

//设置文本提示语
function setContentTip(){
	if ($("#txtContent").text().length == 0) {
		//$("#txtContent").text(contenttip);
		window.top.loadAD(201,$("#txtContent")[0]);
		contenttip = $("#txtContent").text();
		$("#txtContent")[0].style.color="#808080";
		isContentTip = true;
	}
}

//清除文本提示语
function clearContentTip(){
	if (isContentTip){
		$("#txtContent").text("");
		$("#txtContent")[0].style.color="";
		isContentTip = false;
	}
}

//得到带86的手机号码
function Get86Mobile(thismobile){
	var reg = /(<)([\w|+]+)(>)/;
	var re = new RegExp(reg);
	if (re.test(thismobile))
	{
		var c = re.exec(thismobile);
		thismobile=c[2];
	}
	if ($.trim(thismobile).length == 11)
	{
		thismobile = "86"+thismobile;
	}
	if (thismobile.length == 14 && thismobile.substr(0, 1) == "+")
	{
		thismobile = thismobile.replace("+","");
	}
	return thismobile;
}

//检查短信合法性
function CheckSms(){
    //手机号码检查
    if ($.trim($("#txtMobile").val()).length == 0) {
        $("#txtMobile").focus();
        alert("请输入接收方手机号码！");
        return false;
    }
    var mobileList = $.trim($("#txtMobile").val()).split(/,|，|;|；/);
    var mobileCount = mobileList.length;
    if (mobileCount > groupLength) {
        $("#txtMobile").focus();
        alert("很抱歉，您每次最多可同时发送" + groupLength + "个号码，请您删除多余号码再试！");
        return false;
    }
    var regMobile =new RegExp(window.top.UserData.regex); // /^8613[4-9]\d{8}$|^13[4-9]\d{8}$|^8615[01789]\d{8}$|^15[01789]\d{8}$/;
	var unionError = "";
	var mobileError = "";
    for (var i=0;i<mobileCount;i++){
        if ($.trim(mobileList[i]).length > 0){
			var thismobile = Get86Mobile(mobileList[i]);
            if (!regMobile.test(thismobile)){
					mobileError += mobileList[i] + ",";
			}
        }
    }
	if (mobileError.length>0)
	{
		mobileError = String.format(mobileErrorMsg,mobileError.substr(0,mobileError.length-1));
		$("#txtMobile").focus();
		alert(mobileError.encode());		
		return false;
	}
    //短信内容检查
    if (typeof(contenttip) == "undefined")
	{
		contenttip = "";
	}
	if ($("#txtContent").val() == contenttip && contenttip.length>0)
	{
		alert("短信内容不能为："+contenttip+"");
		return false;
	}
    if ($("#txtContent").attr("value").length == 0 || $("#txtContent").attr("value").length > smsLength) {
        $("#txtContent").focus();
        alert("短信内容不能为空，或多于" + smsLength + "个字符！");
        return false;
    }
    //验证码检查
    if ($("#tbValidate").val().length == 0 || $("#tbValidate").val() == "请点击获取验证码") {
        $("#tbValidate").focus();
        alert("请输入验证码！");
        return false;
    }
    //免费条数检查
    if (TJ_IsNote && isDayLimit=="False" && TJ_Total > 0 && TJ_CanSend <= 0) {
        var iCount = $("#txtContent").val().length / 70;
        var jCount = parseInt(iCount);
        if (iCount > jCount) {
            jCount = jCount + 1;
        }
        jCount = mobileCount * jCount;
        if (TJ_CanSend < jCount) {
            var obj = new Object();
            obj.url = "SMSConfirm.aspx";
            obj.objWindow = window;
            obj.title = "确认对话框";
            obj.feeValue = TJ_FeeValue;
            var result = window.showModalDialog("SMSConfirm.aspx", obj, "dialogWidth:350px;dialogHeight:220px;status:no;");
            if (typeof(result) != "undefined") {
                if (result == null) {
                    return false;
                }
                if (result == "1") {
                    try {
                        event.srcElement.style.display = "none";
                    } 
                    catch (e) {
                    }
                    return true;
                }
                if (result == "2") {
                    return false;
                }
                if (result == "6") {
                    try {
                        event.srcElement.style.display = "none";
                    } 
                    catch (e) {
                    }
                    TJ_IsNote = false;
                    return true;
                }
                if (result == "7") {
                    return false;
                }
            }
            return false;
        }
    }
    return true;
}

//绑定分页
function bindPage(){
	var param = $("#ddlFirst").selectedValues().toString();
		var classId = param.split(",")[0];
		var subClassId = param.split(",")[1];
		if (classId > 0) {
			$(".addressListContent2 iframe").attr("src", "/uploads/html/SmsListBar/SmsList_" + classId + "_" + subClassId +".html");
		}
		else{
			$(".addressListContent2 iframe").attr("src", "SmsList.aspx?ClassId=" + classId + "&subClassId=" + subClassId);			
		}
		if (classId > 0) {
			$.get(
				"/Uploads/Html/SmsListBar/SmsListCount_"+classId+"_"+subClassId+".html",
				function (data){
					$("#ddlPager").removeOption(/./);
					for (var i = 1; i <= data; i++) {
						$("#ddlPager").addOption(i, i + "/" + data);
					}
					$("#ddlPager").selectOptions("1");
					return;
				}
			);
		}
		else{
			$.post(
				"SmsListCount.aspx?ClassId="+classId+"&SubClassId="+subClassId,
				{},
				function (data){
					$("#ddlPager").removeOption(/./);
					for (var i = 1; i <= data; i++) {
						$("#ddlPager").addOption(i, i + "/" + data);
					}
					$("#ddlPager").selectOptions("1");
					return;
				}
			);
		}
}
//==============end Send.aspx=================

//============begin Config.aspx===============
function initConfig(){
    setCommonPage();
    PassWordVisible(1);
    //实现红色单选框
    var o = $("#rdoltNeedPassword > label").get(1);
    $(o).addClass("lbl2");
    o = $("#rdoltIsNote > label").get(1);
    $(o).addClass("lbl2");
    //按钮事件
    $("#btnCancel").click(function(){
        window.location.href = "Send.aspx";
    });
    $("#rdoltNeedPassword_0").click(function(){
        PassWordVisible(0);
    });
    $("#rdoltNeedPassword_1").click(function(){
        PassWordVisible(1);
    });
    $("#btnSmsConfigSave").click(function(){
        if ($("#rdoltNeedPassword_1").attr("checked")) {
            if ($("#txtPassword").val().length == 0) {
                alert("请输入您要设置的密码！");
                return false;
            }
            else {
                //是否相同
                if ($("#txtPassword").val() != $("#txtPasswordConfirm").val()) {
                    alert("两次输入的密码不一致，请确认您的输入！");
                    return false;
                }
            }
        }
    });
}

function PassWordVisible(type){
    if ($("#rdoltNeedPassword_1").attr("checked")) {
        $("#rdoltNeedPassword ~p").show();
    }
    else {
        $("#rdoltNeedPassword ~p").hide();
    }
}

//==============end Config.aspx===============

//============begin Idiograph.aspx============
function initIdiograph(){
    setCommonPage();
    //按钮事件
    $("#btnSave").click(function(){
        if (CheckInput())
        {
            __doPostBack("btnIdiographSave","");
        }
    });
    $("#btnCancel").click(function(){
        window.location.href = "Send.aspx";
    });
    //删除
    $(".formArea a[id^='delete']").click(function(){
        var deleteid = this.id.replace('delete', '');
        DeleteIdiograph(deleteid);
        return false;
    });
    //修改
    $(".formArea input[id^='btnSave']").click(function(){
        var tag = this.id.replace('btnSave', '');
        var taginfo = tag.split("_");
        var index = taginfo[0];
        var modifyid = taginfo[1];
        ModifyIdiograph(index, modifyid);
        return false;
    });
    //折叠
    $(".formArea a").click(function(){
        var index = this.id.replace('link', '').replace('title', '');
        for (var i = 0; i < idiographCount; i++) {
            if (i == index) {
                $("#editTable" + i).toggle();
                if ($("#link" + i).text() == "修改") {
                    $("#link" + i).text("折叠");
                }
                else {
                    $("#link" + i).text("修改");
                }
            }
            else {
                $("#editTable" + i).hide();
                $("#link" + i).text("修改");
            }
        }
        return false;
    });
}

function CheckInput(){
    if ($("#txtIdiographName").val() == "" || $("#txtContent").val() == "") {
        alert("签名名称和内容都不能为空！");
        //window.event.returnValue = false;
        return false;
    }
    else {
        //if (checklength($("#txtIdiographName").val()) > 32) {
        //    alert("每个签名名称不要超过32个字！");
        //    return false;
        //}
        //else {
            if ($("#txtIdiographContent").val().length > 128) {
                alert("每个签名内容不要超过128个字！");
                //window.event.returnValue = false;
                return false;
            }
        //}
    }
    return true;
}

function ModifyIdiograph(idx, id){
    var name = $("#tbName_" + idx).val();
    //if (checklength(name) > 32) {
    //    alert("每个签名名称不要超过32个字！");
    //    return false;
    //}
    var content = $("#tbContent_" + idx).val();
    if (content.length > 128) {
        alert("每个签名内容不要超过128个字！");
        //window.event.returnValue = false;
        return false;
    }
    else {
        if (name != "" && name != "") {
            $("#hidIdiographId").val(id);
            $("#hidIdiographName").val(name);
            $("#hidIdiographContent").val(content);
            
            __doPostBack("btnIdiographEdit", "");
        }
        else {
            alert("签名名称和内容都不能为空！");
        }
    }
}

function DeleteIdiograph(id){
    if (window.confirm("确认要删除该签名吗？")) {
        $("#hidIdiographId").val(id);
        __doPostBack("btnIdiographDelete", "");
    }
}

function checklength(strTemp){
    var i, sum;
    sum = 0;
    for (i = 0; i < strTemp.length; i++) {
        if ((strTemp.charCodeAt(i) >= 0) && (strTemp.charCodeAt(i) <= 255)) 
            sum = sum + 1;
        else 
            sum = sum + 2;
    }
    return sum;
}

//==============end Idiograph.aspx============

//============begin ImmediatelyList.aspx============
function initImmediatelyList(){
    //界面调整
    setCommonPage();
    //联系人自动完成
    AutoCompleteMenu.createPhoneNumberMenuFromLinkManList($("#txtMobile")[0]);
    var isOpentxtMobile = true;
    //搜索按钮样式切换
    if (jQuery.browser.msie && jQuery.browser.version < 7) {
        $(".search button").hover(function(){
            $(this).addClass("on")
        }, function(){
            $(this).removeClass("on")
        });
    };
    //查询号码
    var paramMobile = jQuery().getParmByUrl("Mobile");
    if (typeof(paramMobile) != "undefined") {
        $("#txtMobile").val(unescape(paramMobile));
    }
    if (recordCount == 0) {
        $('.noList').show();
        $('#AspNetPager1').hide();
        $('.listBody').hide();
    }
    else {
        $('.noList').hide();
        $('#AspNetPager1').show();
        $('.listBody').show();
    }
    //选中样式改变
    $(".listBody input").click(function(){
        if ($(this).attr("checked")) {
            $(this).parents("tr").addClass("on");
        }
        else {
            $(this).parents("tr").removeClass();
        }
    });
    //全选样式改变
    $(".allDetele input").click(function(){
        if ($(this).attr("checked")) {
            $(".listBody tr").addClass("on");
        }
        else {
            $(".listBody tr").removeClass();
        }
    });
    //查询框
    $("#txtMobile").mouseover(function(){
        ClearTextBox();
    });
    $("#txtMobile").mouseout(function(){
        if (isOpentxtMobile) {
            SetTextBox();
        }
    });
    $("#txtMobile").keypress(function(){
        ClearTextBox();
    });
    $("#txtMobile").focus(function(){
        isOpentxtMobile = false;
    });
    $("#txtMobile").blur(function(){
        isOpentxtMobile = true;
        if (isOpentxtMobile) {
            SetTextBox();
        }
    });
    $("#txtMobile").click(function(){
        ClearTextBox();
    });
    //查询按钮
    $("#btnSearchByMobile").click(function(){
        SearchByMobile();
        return false;
    });
    $("#btnSearchByDate").click(function(){
        SearchByDate();
        return false;
    });
    //发送内容
    $(".subject span").click(function(){
        GoSendPage(this.id.replace('content_', ''));
        return false;
    });
    //全选
    $("#Checkbox1").click(function(){
        SelectAllCheckBox(this, 'sList');
    });
    //删除    
    $("#btnDeleteSms").click(function(){
        DleteCalendarList();
    });
}

//==============end ImmediatelyList.aspx============

//============begin SendSuccess.aspx============
function initSendSuccess(){
    setCommonPage();
	var isHideDivAddress = true;
	var mobiles = sendSuccessMobiles.split(",");
	linmansHTML = $("#divAddress table").html();
	for (var i=0;i<mobiles.length;i++)
	{
		if (!window.top.Contacts.isExistMobile(mobiles[i]) && mobiles[i].length>0)
		{
			isHideDivAddress = false;
			linmansHTML = linmansHTML + "<td class=\"check\"><input name=\"rptAddress$ctl00$chkIsSave\" type=\"checkbox\" /></td><td class=\"name\"><input name=\"rptAddress$ctl00$txtName\" type=\"text\" maxlength=\"20\" class=\"textfiled\" /></td><td class=\"email\"><input name=\"rptAddress$ctl00$txtEmail\" type=\"text\" maxlength=\"40\" class=\"textfiled\" /></td><td class=\"mobile on\"><input name=\"rptAddress$ctl00$txtMobileReadOnly\" type=\"text\" value=\"" + mobiles[i] + "\" readonly=\"readonly\" class=\"textfiled\" /></td></tr>";
		}
	}
	if (!isHideDivAddress)
	{
		$("#divAddress").show();
	}
	$("#divAddress table").html(linmansHTML);
	window.top.loadAD(202,$("#flack")[0]);
    //按钮事件
    $("#btnGoOn").click(function(){
        window.location.href = "Send.aspx";
        return false;
    });
    $("#btnGoSee").click(function(){
        window.open("../index.aspx?id=10", "_blank");
    });
	$("#chkSelectAll").click(function(){
		SelectAllCheckBox(this,"rptAddress$ctl00$chkIsSave");
	});
	$("#btnSaveSmsStoreAddress").click(function(){
	    //检查是否选择保存选项
	    var isrblSmsStoreClassNull = true;
	    $("input[name='rblSmsStoreClass']").each(function(i){
			if (this.checked)
			{
			    isrblSmsStoreClassNull = false;
			    return false;
			}
		});
		if (isrblSmsStoreClassNull)
		{
		    $("input[name='rptAddress$ctl00$chkIsSave']").each(function(i){
			    if (this.checked)
			    {
			        isrblSmsStoreClassNull = false;
			        return false;
			    }
		    });
		}
		if (isrblSmsStoreClassNull)
		{
		    alert("请填写您要保存的内容！");
		    return false;
		}
		//保存联系人
		var linkmans=[];
		var linkmanerro=true;
		$("input[name='rptAddress$ctl00$chkIsSave']").each(function(i){
			if (this.checked)
			{
				var newlinkman=new top.ContactsInfo();
				newlinkman.name = $("input[name='rptAddress$ctl00$txtName']")[i].value;
				newlinkman.email = $("input[name='rptAddress$ctl00$txtEmail']")[i].value;
				newlinkman.mobile = $("input[name='rptAddress$ctl00$txtMobileReadOnly']")[i].value;
				if (newlinkman.validate()) {
					linkmans.push(newlinkman);
				}
				else{
					alert(newlinkman.error);
					linkmanerro = false;
					return false;
				}
			}
		});
		if (linkmanerro) {
			if (linkmans.length > 0) {
				window.top.Contacts.addContacts(linkmans, addContactsCallback);
			}
			else{
				$("#hid").val("true");//通讯录保存成功，通知后台
				__doPostBack("btnSaveSmsStoreAddress", "");
			}			
		}
		return false;
	});
}

function addContactsCallback(result){
    if(result.success){
         //alert("添加成功!");
		 __doPostBack("btnSaveSmsStoreAddress", "");
    }else{
         alert(result.msg);
    }
}
//==============end SendSuccess.aspx============

//============begin SignIn.aspx============
function initSignIn(){
    setCommonPage();
}

//==============end SignIn.aspx============

//============begin SmsList.aspx============
function initSmsList(){
    setCommonPage();
    //表格隔行换色
    $(".contentMS p:even").addClass("even");
    //为光标定位做准备
//    $(window.parent.document).find("#txtContent").setCaret();
    //事件
    $(".contentMS p").click(function(){
        ClickToOpener($(this));
    });
}

function IsNull(o){
    return ("undefined" == typeof(o) || "unknown" == typeof(o) || null == o)
}

function ClickToOpener(obj){
    //为光标定位做准备
    $(window.parent.document).find("#txtContent").setCaret();
    window.parent.clearContentTip();
    var content = obj.text();
    if (content.length > 0) {
        //返回值给父页面
        var objContent = $(window.parent.document).find("#txtContent");
        if (objContent.length > 0) {
            objContent.insertAtCaret(content);
        }
        else
        {
            objContent = $(window.parent.document).find("#tbContent");
            if (objContent.length > 0) {
                objContent.insertAtCaret(content);
            }
        }
        /*
         objContent = objContent[0];
         //光标定位
         try {
         //IE
         var r = objContent.createTextRange();
         r.moveStart("character", objContent.value.length);
         r.collapse(true);
         r.select();
         }
         catch (e) {
         try {
         //FireFox
         objContent.setSelectionRange(objContent.value.length, objContent.value.length);
         objContent.focus();
         }
         catch (e) {
         }
         }*/
    }
    else {
        alert("请选择短信！");
    }
}

//==============end SmsList.aspx============

//============begin SmsNotifyFriends.aspx============
//兼容firefox的自动折行
javascript: (function(){
    var D = document;
    F(D.body);
    function F(n){
        var u, r, c, x;
		if (n)
		{
			if (n.nodeType == 3) {
				u = n.data.search(/\S{10}/);
				if (u >= 0) {
					r = n.splitText(u + 10);
					n.parentNode.insertBefore(D.createElement("WBR"), r);
				}
			}
			else 
				if (n.tagName != "STYLE" && n.tagName != "SCRIPT") {
					for (c = 0; x = n.childNodes[c]; ++c) {
						F(x);
					}
				}
		}
    }
})();

function initSmsNotifyFriends(){
    setCommonPage();
    setAddressListHeight();
    $(window).resize(setAddressListHeight);
    //添加通讯录
    AddressBook.createTelStyle($("#addressList")[0], $("#txtMobile")[0]);
    //隐藏验证码
    $(".rndNum span").hide();	
	//验证码提示语
	$("#tbValidate").val("请点击获取验证码");
    try {
        var mailString = frameElement.receivers;
        var mobiles = AddressBook.getMobilesByEmailString(mailString, top.LinkManList, LinkManList);
        $("#txtMobile").val(mobiles.join(","))
    } 
    catch (e) {
    }
    $("#divEMail").html($("#divEMail").html().replace("|",""));
    
    //联系人伸缩
//    $("#addressSwitch").click(function(){
//        var toggleArea = $(".addressList");
//        toggleArea.toggle();
//        if (toggleArea.is(":visible")) {
//            $(".writeWrapper").css("margin-left", "-170px");
//            $(".writeContent").css("margin-left", "170px");
//            $(this).addClass("addressSwitchOn");
//            $(this).removeClass("addressSwitchOff");
//        }
//        else {
//            $(".writeWrapper").css("margin-left", "0");
//            $(".writeContent").css("margin-left", "0");
//            $(this).removeClass("addressSwitchOn");
//            $(this).addClass("addressSwitchOff");
//        }
//    });
     $("#addressSwitch").click(function(){
	    $("#pageComposeSMS").toggleClass("hideSidebar");
        });

    //联系人列表伸缩
    $(".addressList").find("dt").click(function(){
        var answer = $(this).next();
        //jQuery(".addressList dd").hide();
        if (answer.is(":visible")) {
            answer.hide();
            $(this).addClass("on");
        }
        else {
            answer.show();
            $(this).removeClass("on");
        }
    });
    //显示验证码区域
    $(".rnd").focus(function(){
        if (!$(".rndNum span").is(":visible")) {
			$("#tbValidate").val("");
            $(".rndNum span").css("display", "block");
            refreshValidate();
            return false;
        }
    });
    $(".rndNum p a").click(function(){
        refreshValidate();
		$("#tbValidate").val("");
		$("#tbValidate").focus();
        return false;
    });
    //取消
    $("#linkCancel").click(function(){
        top.MM.close();
        return false;
    });
    $("#btnCancel").click(function(){
        top.MM.close();
    });
    //发送
    $("#btnSmsNotifyFriends").click(function(){
        if ($.trim($("#txtMobile").val()).length == 0) {
            alert("请输入接收方手机号码！");
            return false;
        }
        if ($.trim($("#tbValidate").val()).length == 0) {
            alert("请输入验证码！");
            return false;
        }
		var mbs = top.SiteConfig.smsMiddleware+"sms";

        $.ajax({
            type: "post",
            contentType: "application/xml;charset:utf-8",
            dataType: "json",
            url: "/mw2/sms/sms?func=sms:smsNotifyInit&sid=" + sid + "&rnd=" + Math.random(),
            data: String.format(PostXML["SmsNotify_Xml"], 1,$("#txtMobile").val(),top.encodeXML(userName),top.encodeXML(receiveEMail),top.encodeXML(emailTitle),top.encodeXML($("#tbValidate").val())),
            error: function(err){top.FloatingFrame.alert(err.statusText);},
            success: function(data){
                top.FloatingFrame.alert(data.summary);
            }
        });
    });
    $("#aSend").click(function(){
        $("#btnSmsNotifyFriends").click();
        return false;
    });
}

//右侧及细线高度自适应
function setAddressListHeight(){
    var sizeTo = jQuery(window).height() - jQuery(".toolBar").height();
    //var sizeTo = 500;
    
    jQuery("#pageCompose").height(sizeTo);
    jQuery(".writeWrapper").height(sizeTo);
    jQuery(".addressSwitchWrapper").height(sizeTo);
    jQuery(".addressListContent1 dl").height(sizeTo - 55);
    jQuery(".addressListContent2 iframe").height(sizeTo - 30);
    jQuery(".addressList").height(sizeTo);
}

//==============end SmsNotifyFriends.aspx============

//=============begin SmsConfirm.aspx======================
function doReturn(flag,sid){
    flag = parseInt(flag, 10);
    if ($("#NeverLater").attr("checked")) {
        flag = flag + 5;
    }
    if (flag == 6) {
        $.post("Ajax.aspx", {
			sid: sid,
            action: "SaveSmsConfig"
        }, function(data){
        });
    }
    window.returnValue = flag;
    window.close();
}

//===============end SmsConfirm.aspx======================

//============begin TimingList.aspx============
function initTimingList(){
    //界面调整
    setCommonPage();
    AutoCompleteMenu.createPhoneNumberMenuFromLinkManList($("#txtMobile")[0]);
    var isOpentxtMobile = true;
    //搜索按钮样式切换
    if ($.browser.msie && $.browser.version < 7) {
        $(".search button").hover(function(){
            $(this).addClass("on")
        }, function(){
            $(this).removeClass("on")
        });
    };
    //查询号码
    var paramMobile = $().getParmByUrl("Mobile");
    if (typeof(paramMobile) != "undefined") {
        $("#txtMobile").val(unescape(paramMobile));
    }
    if (recordCount == 0) {
        $('.noList').show();
        $('.listBody').hide();
    }
    else {
        $('.noList').hide();
        $('.listBody').show();
    }
    //选中样式改变
    $(".listBody input").click(function(){
        if ($(this).attr("checked")) {
            $(this).parents("tr").addClass("on");
        }
        else {
            $(this).parents("tr").removeClass();
        }
    });
    //全选样式改变
    $(".allDetele input").click(function(){
        if ($(this).attr("checked")) {
            $(".listBody tr").addClass("on");
        }
        else {
            $(".listBody tr").removeClass();
        }
    });
    //查询框
    $("#txtMobile").mouseover(function(){
        ClearTextBox();
    }).mouseout(function(){
        if (isOpentxtMobile) {
            SetTextBox();
        }
    }).keypress(function(){
        ClearTextBox();
    }).focus(function(){
        isOpentxtMobile = false;
    }).blur(function(){
        isOpentxtMobile = true;
        if (isOpentxtMobile) {
            SetTextBox();
        }
    }).click(function(){
        ClearTextBox();
    });
    //查询按钮
    $("#btnSearchByMobile").click(function(){
        SearchByMobile();
        return false;
    });
    $("#btnSearchByDate").click(function(){
        SearchByDate();
        return false;
    });
    //发送内容
    $(".subject span").click(function(){
        GoSendPage(this.id.replace('content_', ''));
        return false;
    });
    //全选
    $("#Checkbox1").click(function(){
        SelectAllCheckBox(this, 'sList');
    });
    //删除    
    $("#btnDeleteSms").click(function(){
        DleteCalendarList();
    });
}

//==============end TimingList.aspx============

//======begin ImmediatelyList.aspx & TimingList.aspx============
function ClearTextBox(){
    //去掉对用户的提示
    if ($("#txtMobile").val() == "按手机号码查询") {
        $("#txtMobile").val("");
    }
}

function SetTextBox(){
    //加上对用户的提示    
    if ($("#txtMobile").val() == "") {
        $("#txtMobile").val("按手机号码查询");
    }
}

function SearchByMobile(){
    var text = $("#txtMobile").val();
    if (text == "按手机号码查询") {
        alert("请输入要查询的手机号码！");
    }
    else {
        window.location.href = window.location.toString().split("?")[0] + "?Mobile=" + escape(text);
    }
}

function SearchByDate(){
    var day = $("#ucddlDate_lsdYear").selectedValues() + "-" + $("#ucddlDate_lsdMonth").selectedValues() + "-" + $("#ucddlDate_lsdDay").selectedValues();
    window.location.href = window.location.toString().split("?")[0] + "?StartDate=" + escape(day);
}

function DleteCalendarList(){
    var str = "";
    var chk = $("input[name='sList']");
    
    for (var i = 0; i < chk.length; i++) {
        if (chk[i].checked) {
            if (str.length > 0) {
                str += "," + chk[i].value;
            }
            else {
                str = chk[i].value;
            }
        }
    }
    if (str == "") {
        alert("请选择要删除的记录！");
        window.event.returnValue = false;
    }
    else {
    
        if (window.confirm("确定要删除这些记录吗？")) {
            $("#hid").val(str);
        }
        else {
            window.event.returnValue = false;
        }
    }
}

function GoSendPage(id){
    window.location.href = "Send.aspx?sendsmsid=" + id;
}

/*
 全选，反选
 */
function SelectAllCheckBox(obj, name){
    if (name.length > 0) {
        var chk = $("input[name='" + name + "']");
        for (var i = 0; i < chk.length; i++) {
            chk[i].checked = obj.checked;
        }
    }
}

//======end ImmediatelyList.aspx & TimingList.aspx============

//======begin Send.aspx,SmsList.aspx 整合compatible.js=========
//兼容非IE
if (!$.browser.msie) {
    //firefox innerText define
    HTMLElement.prototype.__defineGetter__("innerText", function(){
        var anyString = "";
        var childS = this.childNodes;
        for (var i = 0; i < childS.length; i++) {
            if (childS[i].nodeType == 1) 
                anyString += childS[i].tagName == "BR" ? '\n' : childS[i].innerText;
            else 
                if (childS[i].nodeType == 3) 
                    anyString += childS[i].nodeValue;
        }
        return anyString;
    });
    HTMLElement.prototype.__defineSetter__("innerText", function(sText){
        this.textContent = sText;
    });
    
    //firefox onpropertychange define
    var insObj = new Array();
    var timer = null;
    function changeInspector(id){
        insObj[id] = $("#" + id).val();
        timer = setInterval("inspector('" + id + "')", 100);
    }
    function inspector(sid){
        if ($("#" + sid).val() != insObj[sid]) {
            //alert("property changed"); 
            CheckInputWordCount();
            insObj[sid] = $("#" + sid).val();
        }
    }
}
//======end Send.aspx,SmsList.aspx 整合compatible.js==========

//======begin Send.aspx 整合smssendbase.js===========
function CheckInputWordCount(){
    //检查短信字数
    CheckInputWord(1);
}

//检查短信字数
function CheckInputWord(needAlert){
	if ($("#txtContent")[0].style.color=="#808080")
	{
		$("#fontInputed").text(0);
		$("#fontSmsNum").text(0);
		return;
	}
    var num = $("#txtContent").attr("value").length;
    $("#fontInputed").text(num);
	var smsSize = 70;
	if ($("#rblSendType_1").attr("checked"))
		smsSize = 67;
	var add = 1;
	if (num%smsSize == 0)
		add = 0;
	$("#fontSmsNum").text((num/smsSize|0)+add);
    //$("#fontLeaved").text(smsLength - num);
    if (num > smsLength) {
        //去掉该汉字
        $("#txtContent").attr("value",$.trim($("#txtContent").attr("value")).substring(0, smsLength));
        //清掉caretPos
        //$("#txtContent").attr("caretPos", null);
        if ($("#fontInputed").length > 0) 
            $("#fontInputed").text(smsLength);
        $("#fontLeaved").text(0);
        if (needAlert == 1) {
            //对象失去焦点，同时弹出(setTimeout是兼容IE检查超出规定字数粘贴的时候焦点blur不了的bug)
            setTimeout(function(){
                $("#txtContent").blur();
                alert("您最多只能输入" + smsLength + "个字！");
            }, 0);
        }
    }
}

function refreshValidate(){
    $("#imgValidate").attr("src", validateUrl + Math.random());
}

//======end Send.aspx 整合smssendbase.js=============

//============begin CreateInputMobileChecker============
function CreateInputMobileChecker(inputMobiles,mobileNum,interval)
{
        var This = this;
        var checkTimer;
        var oldVal = ""; 
        
        function getMoblieByLen(mobileList,len)
        {
            var mobileVal = ""; 
            if(mobileList.length == 0)
            {
                return mobileVal;
            }
            var mbolieLength = 0;
            for(var i=0; i<mobileList.length; i++)
            {
                if($.trim(mobileList[i]).length>0)
                {
                    mobileVal += mobileList[i]+","; 
                    mbolieLength++;
                    if(mbolieLength>=len)
                    {
                        mobileVal = $().trim(mobileVal, ",");
                        break; 
                    }
                } 
            } 
            return mobileVal;
        }
          
        function checkInputMobile()
        {
            if($.trim($(inputMobiles).val()).length > 0)
            {                  
                var mobileVal =  $(inputMobiles).val();                    
                mobileVal = $.trim(mobileVal);
                var regex = /，/gi;
                mobileVal = mobileVal.replace(regex,",");
                regex = /;/gi;
                mobileVal = mobileVal.replace(regex,","); 
                regex = /；/gi;
                mobileVal = mobileVal.replace(regex,",");  
                mobileVal = $().trim(mobileVal, ",");
                var mobileList = mobileVal.split(",");
                var mbolieLength = 0;
                for(var i=0; i<mobileList.length; i++)
                {
                    if($.trim(mobileList[i]).length>0)
                    {
                        mbolieLength++;
                    } 
                } 
                
                if (mbolieLength > mobileNum) 
                {                         
                    oldVal = getMoblieByLen(mobileList,mobileNum);
                    $(inputMobiles).val(oldVal);
                    top.FloatingFrame.alert("您最多可同时发送给<span class=\"notice_font\">"+mobileNum+"</span>人，请不要超出限制，谢谢！",function()
                    {
                        This.satrt();
                    }
                    );
                }
                else
                {
                     oldVal = $(inputMobiles).val();
                     This.satrt();
                }
            }
            else
            {
                This.satrt(); 
            } 
       }             
        
        this.satrt = function()
        {
            if(checkTimer)
            {
                clearTimeout(checkTimer);     
            } 
            checkTimer = setTimeout(checkInputMobile,interval);
        } 
}
//============end CreateInputMobileChecker============