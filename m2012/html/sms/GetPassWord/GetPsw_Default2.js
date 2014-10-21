function pwRegular(value)
{
	var returnValue = true;
	var msg  = "";
	if (value == "")
	{		
		msg = "密码不允为空";
		returnValue = false;
		
		return [returnValue,msg];		
	}
	
	if (value.length < 6)
	{		
		msg = "请输入6位至16位字符或数字组成的密码";
		returnValue = false;
		
		return [returnValue,msg];		
	}
	
	var chars = value.split('');
	if (!value.replace(/\d/g,''))
	{		
		msg = "密码不能是纯数字组合";	
		
		returnValue = false;		
		return [returnValue,msg];	
	}
	
	if (value.replace(/[A-Za-z0-9_~@#$\^]/g,'') != "")
	{			
		msg = "密码中包含不合法字符，可支持字母、数字、及_~@#$^符号";	
		
		returnValue = false;		
		return [returnValue,msg];	
	}
	
	var chEqual = true;
	
	var reg ;
	if(chars[0]=='^')
	{
		reg = new RegExp('[\\' + chars[0] + ']','g')
	}
	else
	{
		reg = new RegExp('[' + chars[0] + ']','g')
	}
	
	if (value.replace(reg,'') == '')
	{
		msg = "密码不能是字符串联，如aaaaaa、ABCDEF、FEDCBA";
		returnValue = false;
		return [returnValue,msg];
	}
	
	var arUC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	var arLC = 'abcdefghijklmnopqrstuvwxyz'
	
	var arUCR = "ZYXWVUTSRQPONMLKJIHGFEDCBA";
	var arLCR = "zyxwvutsrqponmlkjihgfedcba";
	
	var arUN = new Array();
	var arLN = new Array();
	
	if (arUC.indexOf(value) >= 0 || arLC.indexOf(value) >= 0 || arUCR.indexOf(value) >= 0 || arLCR.indexOf(value) >= 0)
	{
		msg = "密码不能是字符串联，如aaaaaa、ABCDEF、FEDCBA";
		returnValue = false;
		return [returnValue,msg];
	}
	return [returnValue,msg];
}
 
//hugb add
//CharMode函数
//测试某个字符是属于哪一类.
function CharMode(iN){
if (iN>=48 && iN <=57) //数字
return 1; 
if (iN>=65 && iN <=90) //大写字母
return 2;
if (iN>=97 && iN <=122) //小写
return 4;
else
return 8; //特殊字符
}

//bitTotal函数
//计算出当前密码当中一共有多少种模式
function bitTotal(num){
modes=0;
for (i=0;i<4;i++){
if (num & 1) modes++;
num>>>=1;
}
return modes;
}

//checkStrong函数
//返回密码的强度级别

function checkStrong(sPW){
if (sPW.length<=4)
return 0; //密码太短
Modes=0;
for (i=0;i<sPW.length;i++){
//测试每一个字符的类别并统计一共有多少种模式.
Modes|=CharMode(sPW.charCodeAt(i));
}

return bitTotal(Modes);

} 

//pwStrength函数
//当用户放开键盘或密码输入框失去焦点时,根据不同的级别显示不同的颜色
function pwStrength(pwd){
	if (pwd==null||pwd=="")
	{
	    showPswStrong(1);
	} 
	else
	{
		var S_level=checkStrong(pwd);
		switch(S_level) {
		    case 0:
		    showPswStrong(1);
		    case 1:
		    showPswStrong(1);
		    break;
		    case 2:
		    showPswStrong(2);
		    break;
		    default:
		    showPswStrong(3);
	    }
    } 
    return;
}
 
function showPswStrong(level)
{
    if(level<1 || level>3)
    {
        level = 1; 
    } 
    $("#dvSafe0").show();
    $("#dvSafe1").hide();
    $("#dvSafe2").hide();
    $("#dvSafe3").hide();
    $("#dvSafe"+level).show();
} 
function checkPsw()
{
    var newpsw = $("#txtNewPwd").val();
    pwStrength(newpsw); 
    if(newpsw.length == 0)
    {
        $("#spErrorNewPswArea").show(); 
        $("#spErrorNewPswInfo").html("请输入新的密码。");
        return false;          
    }
    var result =  pwRegular(newpsw);
    if(!result)
    {
        $("#spErrorNewPswArea").show(); 
        $("#spErrorNewPswInfo").html("请输入新的密码。"); 
        return false;
    } 
   
     if(!result[0])
     {
        $("#spErrorNewPswArea").show(); 
        $("#spErrorNewPswInfo").html(result[1]); 
        return false;
     }
     $("#spErrorNewPswArea").hide();
     $("#spErrorNewPswInfo").html("");     
     return true;
}
 
function initErrorState()
{
    if($("#hdErrorNewPswInfo").val().length >0)
   {
        $("#spErrorNewPswArea").show(); 
        $("#spErrorNewPswInfo").html($("#hdErrorNewPswInfo").val());
   }
    
   if($("#hdErrorReNewPswInfo").val().length >0)
   {
        $("#spErrorReNewPswArea").show();
        $("#spErrorReNewPswInfo").html($("#hdErrorReNewPswInfo").val());
   } 
} 

function checkRePsw()
{
    var reNewpsw = $("#txtReNewPwd").val();
    if(reNewpsw.length == 0)
    { 
        $("#spErrorReNewPswArea").show();
        $("#spErrorReNewPswInfo").html("请再次输入新密码。");
        return false;
    }
    if($("#txtNewPwd").val() != reNewpsw)
    {
        $("#spErrorReNewPswArea").show();
        $("#spErrorReNewPswInfo").html("两次输入的新密码不一致，请重新输入。");
        return false;
    } 
     $("#spErrorReNewPswArea").hide();
     $("#spErrorReNewPswInfo").html("");
     return true;
}

function CheckFrom()
{

    var tempPassword=$("#txtNewPwd").val();

var result=Password.checkPassword(tempPassword,[top.uid]); 
     if(result.success==true)
        return true;
     else
        return false;
//    var r1= checkPsw();
//    var r2= checkRePsw();
//    if(!r1 || !r2)
//    return false;
//    var newpsw = $("#txtNewPwd").val();
//    var reNewpsw = $("#txtReNewPwd").val(); 
//    if(reNewpsw != newpsw) 
//    {
//        return false; 
//    } 
//    var result =  pwRegular(newpsw);
//    if(!result)
//    {
//        return false;
//    }
//    return result[0];
}
function txtpwdKeyPress()
{
    var checkvalue = CheckFrom();
    if(checkvalue==true)
    {
        __doPostBack('btnNextServer','');
    }
    else
    {
        return;
    }
}

$(function(){
document.domain=window.location.host.match(/([^.]+\.[^.:]+):?\d*$/)[1]
//    $("#txtNewPwd").click(function(){
//        $("#trMsg") .show();        
//    });
//    $("#txtNewPwd").keyup(function(){
//         checkPsw();
//         if($("#txtReNewPwd").val().length>0)
//        {
//            $("#txtReNewPwd").val("");
//            $("#txtReNewPwd").keyup(); 
//        } 
//    });
    
     var passowrd1=$("#txtNewPwd").val();
     var opts;
     if(typeof(top.version)=="undefined")//简洁版
     {
         opts={
                "label1":"新密码：",//第一个密码框标签
                "txtPaswordID":"txtNewPwd",//第一个密码框ID
                "repeatlabel":"确认新密码：",//第一个密码框标签
                "txtrepeatPaswordID":"txtReNewPwd",//第一个密码框ID            
                "pwdTdLeft":80,
                 "width":400
            };  
        }
        else   //标准版
        {
           opts={
            "label1":"新密码：",//第一个密码框标签
            "txtPaswordID":"txtNewPwd",//第一个密码框ID
            "repeatlabel":"确认新密码：",//第一个密码框标签
            "txtrepeatPaswordID":"txtReNewPwd",//第一个密码框ID            
            "pwdTdLeft":100,
             "width":550
           };
        }
       var obs={"container":document.getElementById("formAreas")};
     
       Password.bindUI(obs,opts);
       $("#txtNewPwd").val(passowrd1);

    $("#aFileUpload").click(function(){
		top.Links.show('quicklyShare');
	});
	 $("#aOpenCalendar").click(function(){
        top.Links.show('calendar',"&from=superman",false);
    });
//    $("#txtReNewPwd").keyup(function(){
//         checkRePsw();
//    });
    //回车触发按钮 
//    $("#txtReNewPwd").keypress(function(e){
//          if(e.keyCode == 13)
//          {
//                if(CheckFrom())
//                {
//                    __doPostBack('btnNextServer','');
//                }
//          }
//    });
//    $("#txtNewPwd").keypress(function(e){
//          if(e.keyCode == 13)
//          {
//                
//                if(CheckFrom())
//                {
//                    __doPostBack('btnNextServer','');
//                }
//          }
//    }); 
     
    //默认聚焦  
    if($("#txtReNewPwd").val().length == 0) 
    {
         $("#txtReNewPwd").focus();
    }
    if($("#txtNewPwd").val().length == 0) 
    {
         $("#txtNewPwd").focus();
    }
     
    initErrorState(); 
});
