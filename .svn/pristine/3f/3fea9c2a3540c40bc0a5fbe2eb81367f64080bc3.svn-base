function checkImageCode()
{
    var objSmsCode = document.getElementById("txtSmsCode");
    if(objSmsCode.value.length == 0)
    {
        $("#spSuccCode").hide(); 
        $("#spErrorCode").show();
        $("#spErrorCodeInfo").html("请输入短信验证码。");
        return false;
    }
    
    if (objSmsCode.value.replace(/[A-Za-z0-9]/g,'') != "")
    {
        $("#spSuccCode").hide(); 
        $("#spErrorCode").show();
        $("#spErrorCodeInfo").html("短信验证码格式不正确。"); 
        return false;
    } 
    $("#spSuccCode").show();  
    $("#spErrorCode").hide();
    $("#spErrorCodeInfo").html("");
    return true;
}

function initErrorState()
{
    //alert($("#hdErrorInfo").val());
    if($("#hdErrorInfo").val().length >0)
   {
        $("#spErrorCode").show(); 
        $("#spErrorCodeInfo").html($("#hdErrorInfo").val());
       
   }
    
   if($("#hdErrorCodeInfo").val().length >0)
   {
        $("#spSuccCode").hide(); 
        $("#spErrorCode").show();
        $("#spErrorCodeInfo").html($("#hdErrorCodeInfo").val());
   } 
} 


var totalSecconds = 0;
function GetLeftTime()
{
    totalSecconds--;
    if(totalSecconds == 0)
    {
        $("#btnLeftTime").hide();
        $("#btnGetSms")[0].value="重新获取短信验证码";
        $("#btnGetSms").show();
    }
     else
     {
         $("#btnLeftTime").val(totalSecconds+"秒后可重新获取短信验证码");
         setTimeout(GetLeftTime,1000);  
     }
}

function ShowLeftTime()
{
    $("#btnLeftTime").show();
    $("#btnGetSms").hide();
    totalSecconds = 60; 
    setTimeout(GetLeftTime,1000); 
}

function CheckCode()
{
   return  checkImageCode();  
}

function txtSmsCodeKeyPress()
{
    $("#btnNext").click();
} 
 
$(function(){
   
    $("#aFileUpload").click(function(){
		top.Links.show('quicklyShare');
	}); 
	 $("#aOpenCalendar").click(function(){
        top.Links.show('calendar',"&from=superman",false);;
    });
    //默认聚焦  
    if($("#txtSmsCode").val().length == 0) 
    {
         $("#txtSmsCode").focus();
    }
    //初始化  
    initErrorState();
});
