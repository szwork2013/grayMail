var topLabel = null;


function checkDataDefaultNext()
{
	if(!checkUserNumber())
	{
		return false;
	}
	if(isUpdate)//设置密码
	{
	    return checkData();
	}
	return true;
}

function checkUserNumber()
{
	if(topLabel == null)
	{
		topLabel = document.getElementById("LabelMsg");
	}
	topLabel.innerText = "";
	var objUserNumber = document.getElementById("txtUserNumber");
	if(objUserNumber.value.length == 0)
	{
		ShowMsg("txtUserNumber","请填写您的手机号码！",0);
		return false;
	}
	var regex = /^(\d{11})$|^(\d{13})$/;
	if(!regex.test(objUserNumber.value))
	{
		ShowMsg("txtUserNumber","手机号码错误，请重新输入！",0);
		return false;
	}
	return true;
}


function ShowMsg()
{
	var targetLabel = null;
	if(arguments.length == 3)
	{
		targetLabel = document.getElementById("LabelMsg")
	}
	else if(arguments.length == 2)
	{
		targetLabel = document.getElementById("LabelMsg1")
	}
	targetLabel.innerHTML = arguments[1];	
	var target = document.getElementById(arguments[0]);
	if(target)
	{
		target.focus();
	}
}

var bottomLabel;
function checkData()
{	
	if(!checkUserNumber())
	{
		return false;
	}
	if(bottomLabel == null)
	{
		bottomLabel = document.getElementById("LabelMsg1");
	}
	bottomLabel.innerText = "";
	
	var objVerifyCode = document.getElementById("txtVerifyCode");
	if(objVerifyCode.value.length == 0)
	{
		ShowMsg("txtVerifyCode","请填写下发到您手机的校验码！");
		return false;
	}
	
	var objNewPwd = document.getElementById("txtNewPwd");
	if(objNewPwd.value.length == 0)
	{
		ShowMsg("txtNewPwd","请填写邮箱的新密码！");
		return false;
	}
	if(objNewPwd.value.length > 16 || objNewPwd.value.length < 6)
	{
		ShowMsg("txtNewPwd","密码必须是6-16个字符，请重新填写您的密码！");
		return false;
	}
	
	var objReNewPwd = document.getElementById("txtReNewPwd");
	if(objReNewPwd.value.length == 0)
	{
		ShowMsg("txtReNewPwd","请再次确认您邮箱的新密码！");
		return false;
	}
	
	if(objNewPwd.value != objReNewPwd.value)
	{
		ShowMsg("txtNewPwd","两次输入密码不一致，请检查！");
		return false;
	}
	
	var reMsg = pwRegular(objNewPwd.value)
	if (reMsg[0] == false)
	{
		ShowMsg("",reMsg[1]);
		return false;
	}
	
	var objRndCode = document.getElementById("txtRndCode");
	if(objRndCode.value.length == 0)
	{
		ShowMsg("txtRndCode","请填写图片校验码！");
		return false;
	}
	return true;
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
	var O_color="#eeeeee";
	var L_color="#FF0000";
	var M_color="#FF9900";
	var H_color="#33CC00";
	var Lcolor="";
	var Mcolor="";
	var Hcolor="";
	if (pwd==null||pwd=="")
	{
	 var Lcolor=Mcolor=Hcolor=O_color;
	} 
	else{
		var S_level=checkStrong(pwd);
		switch(S_level) {
		case 0:
		Lcolor=Mcolor=Hcolor=O_color; 
		case 1:
		Lcolor=L_color;
		Mcolor=Hcolor=O_color;
		break;
		case 2:
		Lcolor=Mcolor=M_color;
		Hcolor=O_color;
		break;
		default:
		Lcolor=Mcolor=Hcolor=H_color;
	}
} 
document.getElementById("strength_L").style.background=Lcolor;
document.getElementById("strength_M").style.background=Mcolor;
document.getElementById("strength_H").style.background=Hcolor;
return;
}

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


