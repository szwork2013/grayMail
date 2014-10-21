var m_1 = "您输入的用户名或密码错误，请重新输入";
var m_2 = "别名或手机号码不存在，请重新输入";
var m_3 = "您的帐户已注销，如果要继续使用邮箱，请重新注册";
var m_4 = "您的账户还没有开通邮箱，请通过注册入口注册";
var m_5 = "由于手机号码欠费停机或者其它原因，您的139邮箱账号已被暂时冻结";
var m_6 = "登录操作错误次数达到了系统限制，请在30分钟后再试";
var m_7 = "登录出现故障，请稍候重试！";
var m_10 = "由于手机号码欠费停机或者其它原因，您的139邮箱账号已被暂时冻结";
var m_100 = "请输入别名或手机号码";
var m_101 = "请输入邮箱密码";
var m_102 = "邮箱密码不能超过16个字符";
var m_103 = "您登录次数过于频繁，为保障安全，请输入图片验证码。";
var m_104 = "您输入的验证码不正确,请重新输入";
var m_999 = "系统繁忙，请稍候重试";
var m_10000 = "短信登录密码已发送到您的手机，请注意查收";


var msHost = repwd.match(/http:\/\/[^\/]+/i).toString();
var m_pickUp_0="手机号不能为空，请输入。";
var m_pickUp_1="提取码不能为空，请输入。";
var m_pickUp_2="请输入验证码";
var m_pickUp_3="您输入的手机号不是中国移动号码！";

var m_pickUp_4="验证码错误，请重新输入";
var m_pickUp_41="验证码错误，请重新输入";
var m_pickUp_42="验证码不正确，请重新输入";
var m_pickUp_43="对不起，系统繁忙，请重试";
var m_pickUp_44="验证码操作太过频繁，请稍后再试";
var m_pickUp_45="验证码已失效，请重新输入";
var m_pickUp_46="请输入验证码";

var m_pickUp_5="您输入的提取码有误！";
var m_pickUp_6="您输入的提取码已失效！";
var m_pickUp_7="无法下载，您提取的文件可能已被共享者取消了";
var m_pickUp_8="最大长度50个字";
var m_pickUp_9="您输入的手机号与提取码不匹配！";
var m_defaultname="请输入您的手机号码";
var m_defaultsharecode="请输入短信中的提取码";
var m_defaultcode="点击此处输入图片验证码";

function checkData() {
    if ($("#txtUserName").val() == "") {
        showErrorMsg($("#hidMsg100").val(), true);
        $("#txtUserName").focus();
        return false;
    }
    if ($("#txtPassword").val() == "") {
        showErrorMsg($("#hidMsg101").val(), true);
        $("#txtPassword").focus();
        return false;
    }
    if ($("#txtPassword").val().length > 16) {
        showErrorMsg($("#hidMsg102").val(), true);
        $("#txtPassword").focus();
        return false;
    }
    showErrorMsg("", false);
}
function showErrorMsg(msg, isShow) {
     $("#sp_login_error").html(msg);
     if(isShow)
        $("#divErrorMessage").show();
     else
        $("#divErrorMessage").hide();
}

function labelControl(){
    var input = $(".input_txt");

    input.keypress(function(){
        $(this).siblings(".base_word").hide();
    }).blur(function(){
        this.value.length == 0 && $(this).siblings(".base_word").show();
    })

	input.each(function(){
		this.value.length > 0 && $(this).siblings(".base_word").hide();
	})
};

window.onload = function() {
	//设定访问中间件的iframe的代理src
	//$("#iframeserver").attr("src", DiskConf.proxyInterIp + "proxy.htm");
	$("#sp_login_complate").empty();
    $("#divComplate").hide();
    DiskTool.notUseWait();
    var form = jQuery('#loginForm');
	jQuery(form).attr('action', $("#hidFormAction").val());
    var objUserName = $("#txtUserName");
    var objPwd = $("#txtPassword");
    window.document.body.keypress = function(e) {
        if (e.keyCode == 13) {
            $("#btnLogin").click();
            return false;
        }
    };
	if (objUserName.value == "") {
        objUserName.focus();
    } else if (objPwd.value == "") {
        objPwd.focus();
    }
    labelControl();
	$("#spanMsgPwd").click(function(event) {
        var mobileNum = jQuery("#txtUserName").val();
        if (mobileNum.length == 0) {
            $("#sp_login_error").html(m_100);
            $("#divErrorMessage").show();
            $("#txtUserName").focus();
            return;
        }
        if (window.proxyWindowOnLoad) {
            send();
        } else {
            $("#iframepwd").attr("src", msHost + "/proxy.htm").load(send);
        }
        function send() {
            proxyWindowOnLoad = true;
            document.getElementById("iframepwd").contentWindow.$.ajax({
                type: "GET",
                url: repwd + '?num=' + mobileNum + '&rd=' + Math.random(),
                success: function(msg) {
                    $("#sp_login_complate").empty();
                    $("#divComplate").hide();
                    $("#sp_login_error").empty();
                    $("#divErrorMessage").hide();
                    if (msg.length > 5) {
                        msg = msg.substring(7, msg.length);
                        msg = msg.substring(0, msg.length - 2);
                    }
                    if (m_10000 == msg) {
                        $("#sp_login_complate").html(msg);
                        $("#divComplate").show();
                    } else {
                        $("#sp_login_error").html(msg);

                    }
                }
            });
        }		
    });
	$("#iframeserver").load(function() {
		$("#a_download").click(function() {
            var winbits = "32";
            if ($("#version-classic")[0].checked) {
                winbits = "64";
            }
            this.href = getVdUrl(winbits);
        });
        //document.getElementById("aDownLoadVd").href = getVdUrl();
	});
	
	function getVdUrl(winbit) {
		var url = "javascript:void(0)";
        var data = { chnnl: "3", frm: "10348", winBit: "32" };
        var isWin64 = navigator.platform && navigator.platform.indexOf("64") > -1;
        if (!winbit) {
            winbit = isWin64 ? "64" : "32";
        }
        data.winBit = winbit;
		document.getElementById("iframeserver").contentWindow.$.ajax({
            url: DiskTool.resolveUrl("getVirtualExe", false, true),
			type: "POST",
			contentType: "text/xml",
			dataType: "text",
            data: XmlUtility.parseJson2Xml(data),
            async: false,
            success: function(result) {
				try {
					var data = eval("(" + result + ")");
				} catch (ex) {
					var data = {
						code: "S_Error",
						summary: "请求服务器出错"
					};
				}
                if (data.code == DiskConf.isOk) {
                    var value = data["var"];
                    if (value && value.url) {
                        url = value.url;
                    }
                }
            },
            error: function(error) { url = "javascript:void(0)"; }
        });
        return url;
	}
	
	//文件提取
    $("#div_Code").hide();
    $("#ImgPickUp").hide();  
    //ImagePickUp();
    $("#ImgPickUp").click(function(){
         ImagePickUp();
    });
    $("#aChangeImg").click(function(){
         ImagePickUp();
    });
	$("#aClose").click(function(){
        document.getElementById("overlay").style.display='none'
		document.getElementById("lightbox").style.display='none'});
    $("#i-lb-close").click(function(){
        document.getElementById("overlay").style.display='none'
		document.getElementById("lightbox").style.display='none'});
	$("#txtCode").focus(function() { 
        if($("#ImgPickUp").css("display")=="none")  
            ImagePickUp();//赋值提取文件的验证码
        $("#div_Code").show();
        $("#ImgPickUp").show();        
        $("#imgRnd").hide(); 
        $("#aloginchange").hide();      
        $("#ploginRndCodeTips").hide();       
    });
     $("#txtVerifyCode").focus(function() {  
        if($("#imgRnd").css("display")=="none")  
            refreshImgRndCode();//赋值登录的验证码
        $("#imgRnd").show();
        $("#aloginchange").show();  
        $("#ploginRndCodeTips").show();     
        $("#div_Code").hide();  
        $("#ImgPickUp").hide();     
    });
	//回车键操作
    $("#txtUserNumber").keyup(function(e) {
        if (e.keyCode == 13) {
            $("#txtShareCode").focus();
        }
    });
    $("#txtShareCode").keyup(function(e) {
        if (e.keyCode == 13) {
            $("#txtCode").focus();
        }
    });
    $("#txtCode").keyup(function(e) {
        if (e.keyCode == 13) {
           $("#btnFetch").click();
        }
    });    
    $("#hidShareCode").val("");
	
	//文件提取
    $("#btnFetchNew").click(function(){
        $("#sp_error").empty();
        $("#d_PickUpError").hide();
        var ShareCode = $.trim($("#txtShareCode").val());
        if(ShareCode == "" || ShareCode == m_defaultsharecode) {
            showPickUpError(m_pickUp_1);
            $("#txtShareCode").focus();
            return;
        } else if (ShareCode.length > 50) {              
            showPickUpError(m_pickUp_8);
            $("#txtCode").focus();
            return;
        }        
        $("#hidShareCode").val(ShareCode);
		
		///////////////////////////////////////////////////
		document.getElementById("iframeserver").contentWindow.$.ajax({
            type: "POST",
			contentType: "text/xml",
			dataType: "text",
            url: DiskTool.resolveUrl("getPickUpFile", false, true),
			data: XmlUtility.parseJson2Xml({                   
                shareCode: ShareCode
            }),
            success: function(msg) {
				try {
					var data = eval("(" + msg + ")");
				} catch (ex) {
					var data = {
						code: "S_Error",
						summary: "请求服务器出错"
					};
				}
				if(data.code != "S_OK") {
					showPickUpError(data.summary);
				} else {
					if(data != null && data['var'].shareFileList != null) {
						if(data['var'].shareFileList.length == 0) {
                            showPickUpError(m_pickUp_7);
                            return;
                        }                            
                        $("#tbsharefile").empty();
                         
                        $.each(data['var'].shareFileList, function() {
                            var imageCss = "";                            
                            var ext = DiskTool.getFileExtName(this.fileName);    
                            var fileid = this.fileId;
                            var sender = this.shareUserNumber;
                            var isFolder = false;
                            if(sender != null && sender.length > 0){
                                sender = sender.substring(2, sender.length);
                            }                                    
                            if(ext != "" && ext != null && ext != undefined){
                                imageCss = DiskTool.getFileImageClass(ext);    
                            } else {
                                imageCss = "folder"; 
                                isFolder=true;
                            }       
                            if(this.fileName == "精彩相册")this.fileName = "我的相册";
                            if(this.fileName == "精彩音乐")this.fileName = "我的音乐";
                           
                            var fragment = $("\ <tr> \
		                                            <td class='col-type'><i class='{3}'></i></td>\
		                                            <td class='col-name'>{0}</td>\
		                                            <td class='col-size'>{2}</td>\
		                                            <td class='col-owner'>{1}</td>\
		                                            <td class='col-act'><a href='#'>下载</a></td>\
	                                            </tr>".format(this.fileName
                                                    , sender
                                                    , isFolder==true?"--":DiskTool.getFileSizeText(parseFloat(this.fileSize))
                                                    , imageCss
                                                    , this.fileId)
                                                );  
                                 
                            var a = fragment.find("td.col-act>a");
                            var id = this.fileId;
                            var shareid=this.shareUserNumber;
                            var filename = this.fileName;
                            a.click(function(e){
                                if(isFolder)
                                    download("", fileid, shareid, filename, "sharecodenorecv");
                                else
                                    download(fileid, "", shareid, filename, "sharecodenorecv");
                            }); 
                            $("#tbsharefile").append(fragment);                               
                        });  
                        document.getElementById("overlay").style.display='block';                           
                        document.getElementById("lightbox").style.display='block';
					}
                }
            },
			error: function(error){
                showPickUpError(error);
            }
        });
    });
}
//为兼容两个版本，将ajaxtype参数化
function download(fileid, folderid, sharenumber, filename, ajaxtype) {
    if(typeof(ajaxtype) == "undefined") {
		ajaxtype = "sharecode";
	}
    //更新共享下载次数    
	var updateUrl = DiskTool.resolveUrl("updatePickUpTimes", false, true);
	document.getElementById("iframeserver").contentWindow.$.ajax({
		type: "POST",
		contentType: "text/xml",
		dataType: "text",
        url : updateUrl,
        data: XmlUtility.parseJson2Xml({                   
            shareCode: $("#hidShareCode").val(),
			fileId: fileid.toString()
        }),
		async: false,
        success: function(msg){
			try {
				var data = eval("(" + msg + ")");
			} catch (ex) {
				var data = {
					code: "S_Error",
					summary: "请求服务器出错"
				};
			}
			if(data.code == "S_OK") {}
		}
	});
	
	/*
    var ShareURL = "/ajax/getUserInfo.aspx?ajaxtype="+ajaxtype+"&sc=" + $("#hidShareCode").val()+"&rec="+$("#txtUserNumber").val()+"&fileid="+fileid;
    $.ajax({ url:ShareURL, async: false }).responseText; 
	*/
    //获取下载的URL
	var getDownUrl = DiskTool.resolveUrl("pickUpDown", false, true);
	document.getElementById("iframeserver").contentWindow.$.ajax({
		type: "POST",
		contentType: "text/xml",
		dataType: "text",
        url : getDownUrl,
        data: XmlUtility.parseJson2Xml({                   
            fileid: fileid.toString(),
			folderid: folderid.toString(),
			downname: escape(filename)
        }),
		async: false,
        success: function(msg){
			try {
				var data = eval("(" + msg + ")");
			} catch (ex) {
				var data = {
					code: "S_Error",
					summary: "请求服务器出错"
				};
			}
			if(data.code == "S_OK") {
				var downurl = data['var'].url;
				if(downurl.indexOf("NotAllSuccess|") >= 0) {
					if(confirm("有部分文件未成功打包，是否继续下载完成打包的其他文件?")) {
						downurl=downurl.replace("NotAllSuccess|","");
						$("#iframecgi").attr("src",downurl);    
					}
				}
				if(downurl!=null&&downurl.length>0){
					$("#iframecgi").attr("src",downurl);    
				 } else {               
					alert(m_pickUp_7);
					return;
				 }
			} else {
				alert(data.summary);
			}
		}
	});
}
function ImagePickUp() {
    $("#ImgPickUp").attr("src",imgPickUpRndUrl + Math.random()); 
}

function refreshImgRndCode() {
    $("#imgRnd").attr("src", imgLoginRndUrl + Math.random());
}
    
function showPickUpError(msg) {
    $("#sp_error").html(msg);
    $("#d_PickUpError").show();
}

try {
    var base64DecodeChars = new Array(
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
        -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
        -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

    //客户端Base64解码
    function base64decode(str) {
        var c1, c2, c3, c4;
        var i, len, out;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            // c1 
            do {
                c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c1 == -1);
            if (c1 == -1)
                break;

            // c2 
            do {
                c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c2 == -1);
            if (c2 == -1)
                break;

            out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

            // c3 
            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if (c3 == 61)
                    return out;
                c3 = base64DecodeChars[c3];
            } while (i < len && c3 == -1);
            if (c3 == -1)
                break;

            out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

            // c4 
            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if (c4 == 61)
                    return out;
                c4 = base64DecodeChars[c4];
            } while (i < len && c4 == -1);
            if (c4 == -1)
                break;
            out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
        return out;
    }
}
catch (e) { }

try {
    $("#hidMsg100").val(m_100);
    $("#hidMsg101").val(m_101);
    $("#hidMsg102").val(m_102);
    $("#hidMsg103").val(m_103);
    $("#hidFormAction").val(FormAction);
    function getPram() {
        var args = new Object();
        var query = location.search.substring(1); //获取查询串   
        var pairs = query.split("&"); //在&处断开   
        for (var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('='); //查找name=value   
            if (pos == -1) continue; //如果没有找到就跳过   
            var argname = pairs[i].substring(0, pos); //提取name   
            var value = pairs[i].substring(pos + 1); //提取value   
            args[argname] = unescape(value); //存为属性   
        }
        return args; //返回对象   
    }

    function GetCookieVal(offset) {//获得Cookie解码后的值    
        var endstr = document.cookie.indexOf(";", offset);
        if (endstr == -1)
            endstr = document.cookie.length;
        return unescape(document.cookie.substring(offset, endstr));
    }

    function GetCookie(name) {//获得Cookie的原始值
        var arg = name + "=";
        var alen = arg.length;
        var clen = document.cookie.length;
        var i = 0;
        while (i < clen) {
            var j = i + alen;
            if (document.cookie.substring(i, j) == arg)
                return GetCookieVal(j);
            i = document.cookie.indexOf(" ", i) + 1;
            if (i == 0) break;
        }
        return null;
    }
    var Pram = getPram();
    //验证码显示
    if (Pram["v"] == "1") {
        $("#liVerifyCode").show();
        refreshImgRndCode();
		$("#sp_login_error").html(m_3).show();
    }
    if (Pram["u"] != "" && Pram["u"] != undefined) {
        $("#txtUserName").val(base64decode(Pram["u"]));
    } else {
        if (null != GetCookie("Login_UserNumber")) {
            $("#txtUserName").val(GetCookie("Login_UserNumber"));
        }
    }
    //显示 是否保存用户选择项
    if (Pram["s"] == "" || Pram["s"] == undefined) {
        //从cookes 中获取
        if (GetCookie("Login_IsSaveUserNumber") == "1") {
            $("#cbauto")[0].checked = true;
        } else {
            $("#cbauto")[0].checked = false;
        }
    } else {
        if (Pram["s"] == "1") {
            $("#cbauto")[0].checked = true;
        } else {
            $("#cbauto")[0].checked = false;
        }
    }

    switch (Pram["m"]) {
        case "1":
                $("#sp_login_error").html(m_1).show();
                $("#txtPassword").focus();
            break;
        case "2":
                $("#sp_login_error").html(m_2).show();
            break;
        case "3":
                $("#sp_login_error").html(m_3).show();
            break;
        case "4":
                $("#sp_login_error").html(m_4).show();
            break;
        case "5":
                $("#sp_login_error").html(m_5).show();
            break;
        case "6":
                $("#sp_login_error").html(m_6).show();
            break;
        case "7":
                $("#sp_login_error").html(m_7).show();
            break;
        case "10":
                $("#sp_login_error").html(m_10).show();
            break;

        case "100":
                $("#sp_login_error").html(m_100).show();
            break;
        case "101":
                $("#sp_login_error").html(m_101).show();
            break;
        case "102":
                $("#sp_login_error").html(m_102).show();
            break;
        case "11":
                $("#sp_login_error").html(m_103).show();
                $("#txtPassword").focus();                            
            break;
        case "103":
                $("#sp_login_error").html(m_103).show();
                $("#txtPassword").focus();             
            break;
        case "104":
            $("#sp_login_error").html(m_104).show();
            break;
        case "999":
            $("#sp_login_error").html(m_999).show();
            break;
    }

} catch (e) { }