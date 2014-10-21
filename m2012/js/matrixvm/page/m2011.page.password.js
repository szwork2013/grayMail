Password = {
    //弱:0,中:1,强:2
    getStrongLevel: function(pwd) {
        if (pwd.length < 6) return 0;

        var modes = Password.countCharMode(pwd);

        //弱
        //6-8位,且仅包含数字,字母,特殊符号中的1种
        //6-8位,且仅包含数字,字母,特殊符号中的2种
        //9-30位,且仅包含数字,字母,特殊符号中的1种
        if (pwd.length <= 8 && modes <= 2) {
            return 0;
        } else if (pwd.length > 8 && modes == 1) {
            return 0;
        }

        //中
        //6-8位,且仅包含数字,字母,特殊符号中的3种
        //9-30位,且仅包含数字,字母,特殊符号中的2种
        if (pwd.length <= 8 && modes >= 3) {
            return 1;
        } else if (pwd.length > 8 && modes == 2) {
            return 1;
        }
        //强
        //9-30位,且仅包含数字,字母,特殊符号中的3种
        if (pwd.length > 8 && modes >= 3) {
            return 2;
        }

        return 0;
    },
    //测试某个字符是属于哪一类
    getCharMode: function(c) {
        if (/^\d$/.test(c)) return 1;
        if (/^[A-Z]$/.test(c)) return 2;
        if (/^[a-z]$/.test(c)) return 4;
        return 8;
    },
    //计算出当前密码当中一共有多少种模式
    countCharMode: function(str) {
        var mode = 0;
        for (var i = 0; i < str.length; i++) {
            var c = str.charAt(i);
            mode |= Password.getCharMode(c);
        }
        return mode.toString(2).match(/1/g).length;
    },
    //判断字符串是否为连续的字母或者数字
    // 234,111,aaa,abc
    isSimpleString: function(str) {
        //相同串
        function same(s) {
            var reg = new RegExp("^" + s.charAt(0).replace(/([^a-zA-Z0-9])/, "\\$1") + "+$");
            return reg.test(s);
        }
        //连续串
        function continuous(s) {
            if (!window._cacheCharsList) {
                var s1 = "abcdefghijklmnopqrstuvwxyz";
                var s2 = s1.toUpperCase();
                var s3 = "0123456789";
                var s4 = "9876543210";
                var s5 = "zyxwvutsrqponmlkjihgfedcba";
                var s6 = s5.toUpperCase();
                var s7 = "$#";
                var s8 = "#$";
                window._cacheCharsList = [s1, s2, s3, s4, s5, s6, s7, s8];
            }
            var list = window._cacheCharsList;
            for (var i = 0; i < list.length; i++) {
                if (list[i].indexOf(s) >= 0) return true;
            }
            return false;
        }
        if (same(str)) return true;
        if (continuous(str)) return true;
        return false;
    },
	/**
	 * 检查密码是否检查通过
	 * @param {String} pwd 
	 * @param {Array} disList  选填 账号列表，包括飞信账号、别名、手机号
	 */
    checkPassword: function(pwd, disList) {
		//处理默认参数的值
	   if(typeof(disList)=="undefined"){
   	 	 var arr=top.UserData.uidList.concat(top.uid);
         disList=arr;   
         
	   }
	   
        var min = 6;
        var max = 30;
        var errorCode = 0;
        var len = pwd.length;
        if (len == 0) {//为空
            errorCode = 1;
        } else if (len < min) {//太短
            errorCode = 2;
        } else if (len > max) {//太长
            errorCode = 3;
        } else if (/[^A-Za-z0-9_~@#$\^]/.test(pwd)) {//包含特殊字符
            errorCode = 5;
        } else if (isError6()) {
            errorCode = 6;
        } else if (isError7()) {
            errorCode = 7;
        } else if (isError8()) {
            errorCode = 8;
        } else if(!Password.checkPassMatch()){
             errorCode = 9;
        }
        		 
        if (errorCode == 0) {
            return { success: true, strongLevel: Password.getStrongLevel(pwd) };
        } else {
            var errorMsg = {
                "1": "密码不能为空",
                "2": "密码必须为6-30位",
                "3": "密码必须为6-30位",
                "4": "密码不能为纯数字",//已经去掉了
                "5": "密码不支持_~@#$^以外的特殊符号",
                "6": "密码不能有太多字符串联",
                "7": "密码不能为字符串联块",
                "8": "密码不能为手机帐号",
                "9": "两 次输入的密码不一致"
            }
			//如果用户没有输入任何字符，直接点提交按钮，则显示出错信息
			var elem=document.getElementById("divStrong");		
			if(errorCode==1){
				document.getElementById("_trTip").style.display="";
				 
				Password.showErrorText("<span style='color:red;font-weight:bold'>×</span><span style='color:red;'>" + errorMsg[errorCode] + "</span>");
				Password.showStrongLevel(0);
			}
            return { success: false, errorCode: errorCode, errorMsg: errorMsg[errorCode], strongLevel: Password.getStrongLevel(pwd) };
        }
        function isError6() {
            return Password.isSimpleString(pwd.substring(1)) ||
                Password.isSimpleString(pwd.substring(0, pwd.length - 1));
        }
        function isError7() {
            for (var i = 1; i < pwd.length; i++) {
                var strBegin = pwd.substring(0, i);
                if (Password.isSimpleString(strBegin)) {
                    var strEnd = pwd.substring(i, pwd.length);
                    if (Password.isSimpleString(strEnd)) {
                        return true;
                    }
                }
            }
            return false;
        }
        function isError8() {
            if (!disList) return false;
            for (var i = 0; i < disList.length; i++) {
                var uid = disList[i];
                if (uid == pwd) {
                    return true;
                }
            }
        }
    },
    //设置默认属性
    setOptions:function(){
        this.options={
            "label1":"设置密码",//第一个密码框标签
            "txtPaswordID":"txtPwd",//第一个密码框ID
            "txtPWDTabIndex":1,//第一个密码框的tabIndex
            "repeatlabel":"确认密码",//第二个密码框标签
            "txtrepeatPaswordID":"txtPwd2",//第二个密码框ID
            "txtrepPWDTabIndex":2,//第二个密码框的tabIndex 
            "pwdTdLeft":100,//td 标签内左侧的宽度
            "width": 600//宽度
        } 
    },

    /**
     * 密码输入框:调用方法：
     * <pre>
     * 	var opt={
            "label1":"设置安全锁密码",//第一个密码框标签
            "txtPaswordID":"txtPassword",//第一个密码框ID
            "repeatlabel":"再次输入新密码",//第一个密码框标签
            "txtrepeatPaswordID":"txtPasswordAgain",//第一个密码框ID             
            "pwdTdLeft":195,
             "width":800 
        };	  
	   var ob={"container":document.getElementById("tdPassword")}
	   Password.bindUI(ob,opt)
	   
	 //在提交数据时，先检查密码的实时监测是否通过
	 var result=Password.checkPassword(password);	 
	 return result.success;
	 
	 //在成功提交数据后，如果需要对原来的密码框重置，可以调用下面的方法
	 Password.reset();
	 * 
     * </pre>
     * @param {Object} p 容器对象，属性如下：
     * @param {HTMLElement} container 必填 密码框放置的容器
     * @param {Array} disList 选填 账号列表，包括飞信账号、别名、手机号
     * 
     * @param {Object} options 参数属性如下：
     * <pre>
     *  "label1":"设置密码：",//第一个密码框标签
        "txtPaswordID":"txtPwd",//第一个密码框ID
         "txtPWDTabIndex":1,//第一个密码框的tabIndex
        "repeatlabel":"确认密码：",//第二个密码框标签
        "txtrepeatPaswordID":"txtPwd2",//第二个密码框ID 
         "txtrepPWDTabIndex":2,//第二个密码框的tabIndex 
        "pwdTdLeft":100,//标签所在td的宽度
        "width": 600//密码框容器宽度
     * </pre>
     */
    bindUI: function(p,options) {
      //获取默认属性
      this.setOptions();     
       
       //获取用户设置过的属性
       for (var property in options)
       {
          this.options[property] = options[property];
       }
	   //处理默认参数的值
	   if(typeof(p.disList)=="undefined"){
	   	 var arr=top.UserData.uidList.concat(top.uid);   
   		 arr.push(top.uid)
		 p.disList=arr;   
	   }
       
        //组织HTML         
        var This = this;  
		    
        var htmlCode = "<table class='tabPwdInput' style='width:"+This.options["width"]+"px' border='0'>\
        <tr><td class='pwdTdLeft' style='width:"+ This.options["pwdTdLeft"]+"px'>"+this.options["label1"]+"</td>\
        <td>\
            <input maxLength='30' type='password' tabindex='"+this.options["txtPWDTabIndex"]+"' id='"+this.options["txtPaswordID"]+"'  name='"+this.options["txtPaswordID"]+"' />\
            <div id='divResult' class='divResult'>密码不能为空</div>\
        </td></tr>\
        <tr id='_trTip' style='display:none'><td class='pwdTdLeft'></td>\
        <td style='color:red'>6-30个字符，且区分大小写，支持字母、数字、及_~@#$^符号。不能是字符串联，如aaaaaa、123456、ABCDEF</td></tr>\
        <tr id='trTipStrongLevel' style='display:none'><td class='pwdTdLeft'></td><td>\
            <div style='color:#999'>密码安全性检验：</div>\
            <div id='divStrong'></div>\
        </td></tr>\
        <tr><td class='pwdTdLeft' style='width:"+ This.options["pwdTdLeft"]+"px'>"+this.options["repeatlabel"]+"</td><td>\
        <input maxLength='30' type='password' tabindex='"+this.options["txtrepPWDTabIndex"]  +"'  id='"+this.options["txtrepeatPaswordID"]+"' name='"+this.options["txtrepeatPaswordID"]+"' />\
        <div id='spMakeSure' class='divResult'></div>\
        </td></tr></table>";        
    
         
        p.container.innerHTML = htmlCode;

        var divResult = document.getElementById("divResult");
        var txtPwd = document.getElementById(this.options["txtPaswordID"]);
        var txtPwd2 = document.getElementById(this.options["txtrepeatPaswordID"]);

        txtPwd.onfocus = function() {
            showTipText();
        }

        txtPwd.onkeydown = txtPwd.onkeyup = txtPwd.onblur = function() {
            var text = txtPwd.value;
			//var result = This.checkPassword(text, p.disList);
			var result = This.checkPassword(text, [This.remove86(top.UserData.userNumber)]||[]);
            if (result.success) {
                Password.showErrorText("<span style='color:green;font-weight:bold'>√</span>");
                Password.showStrongLevel(result.strongLevel + 1);
            } else {
                    Password.showErrorText("<span style='color:red;font-weight:bold'>×</span><span style='color:red;'>" + result.errorMsg + "</span>");
                    Password.showStrongLevel(0);
            }
            Password.checkPassMatch();
        }
        txtPwd2.onkeydown = txtPwd2.onkeyup = txtPwd2.onblur = function() {
            Password.checkPassMatch();
        }
        function showTipText() {
            var div = document.getElementById("_trTip");
            div.style.display = "";
        }
        
                
        this.hasBindUI = true;
    },
    //检查输入的两次密码是否一样
    checkPassMatch:function(){
            var spMakeSure = document.getElementById("spMakeSure");
            var html = "";
            var txtPwd = document.getElementById(this.options["txtPaswordID"]);
            var txtPwd2 = document.getElementById(this.options["txtrepeatPaswordID"]);
            var isMatch=true;

            if (txtPwd.value != "" && txtPwd2.value != "") {
                if (txtPwd.value == txtPwd2.value) {
                    html = "<span style='color:green;font-weight:bold'>√</span>";
                    isMatch=true;
                } else {
                    html = "<span style='color:red;font-weight:bold'>×</span><span style='color:red;'>两次输入的密码不一致</span>";
                    isMatch=false;
                }
            }
            spMakeSure.innerHTML = html;
            if (html == "") {                
                spMakeSure.style.display = "none";                
            } else {
                spMakeSure.style.display = "block";                 
            }
            return isMatch;
    },  
    showStrongLevel:function(level){
         var div = document.getElementById("divStrong");
            var levelHtml = [
            "<div class=\"innerBlock\" style='width:45px;background-color:red;'>不安全</div>",
            "<div class=\"innerBlock\" style='width:45px;background-color:#FF7900;'>弱</div>",
            "<div class=\"innerBlock\" style='width:105px;background-color:#FFD92E;color:#000000'>普通</div>",
            "<div class=\"innerBlock\" style='width:166px;background-color:#28C901;'>安全</div>"];
            div.innerHTML = levelHtml[level];
            document.getElementById("trTipStrongLevel").style.display = "";
    },
    getPassword: function() {
        if (this.hasBindUI) {
            return document.getElementById("txtPwd").value;
        }
    },
    //重置回到默认状态
    reset:function(){
		var doc=document;
		doc.getElementById("_trTip").style.display="none";
		doc.getElementById("trTipStrongLevel").style.display="none";
		doc.getElementById("divResult").style.display="none";
		doc.getElementById("spMakeSure").style.display="none";  
		      
    },
	showErrorText:function(html){
		var divResult=document.getElementById("divResult");                         
        divResult.style.display = "block";
        divResult.innerHTML = html;
    },
        remove86: function(number) {
        if (typeof number != "string") number = number.toString();
        return number.trim().replace(/^86(?=\d{11}$)/, "");
    }
};
   
    
document.write("<style>\
.tabPwdInput{width:600px;font-size:12px;}\
.tabPwdInput .pwdTdLeft{width:100px;text-align:right;}\
.tabPwdInput td{line-height:25px;}\
.tabPwdInput input{float:left;width:200px;float:left;}\
#divStrong div{text-align:center;}\
#divStrong{height:17px;width:186px;float:left;border:1px solid silver;line-height:16px;}\
#divStrong .innerBlock{color:#FFFFFF;font-size:12px;height:17px;line-height:17px;padding:0 10px;text-align:center;}\
#trTipStrongLevel td div{float:left;}\
.divResult{border:1px solid orange;padding:1px;margin-left:3px;padding:0 5px 0 5px;float:left;display:none;}\
</style>");

//安全锁密码服务端验证错误信息：
Password.mssage={
	serverCheckPwdInvalid1:"密码不能为空",
	serverCheckPwdInvalid2:"密码不能为手机帐号",
	serverCheckPwdInvalid3:"密码不支持_~@#$^以外的特殊符号",
	serverCheckPwdInvalid4:"密码长度不能少于6位大于30位",
	serverCheckPwdInvalid5:"密码不能为字符串联块",
	serverCheckPwdInvalid6:"该密码不安全，请使用其他密码"
}
