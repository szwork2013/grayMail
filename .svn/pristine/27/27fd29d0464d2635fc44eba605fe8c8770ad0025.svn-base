var OLDDOMAIN="139.com",NEWDOMAIN="10086.cn",LIGHTSERVERDOMAIN="images.139cm.com";//配置信息 资源服务器域名
var BehaviorLog = "http://smsrebuild1.mail." + NEWDOMAIN + "/weather/weather?func=user:logBehaviorAction";
var https_Url = "https://mail." + NEWDOMAIN;


var imagesCodeDomain="imagecode.mail." + NEWDOMAIN;//图片验证码域名，包括端口

var localhref = window.location.href;
if (/.*rd\./.test(localhref)) {
    NEWDOMAIN = "10086rd.cn";
    https_Url = "http://mail." + NEWDOMAIN;
    BehaviorLog = "http://app.mail." + NEWDOMAIN + "/mw2/weather/weather?func=user:logBehaviorAction";
    imagesCodeDomain = "imagescode.mail." + NEWDOMAIN + ":10080";

} else if (/.*ts\./.test(localhref)) {
    NEWDOMAIN = "10086ts.cn";
    https_Url = "http://mail." + NEWDOMAIN;
    BehaviorLog = "http://rm.mail." + NEWDOMAIN + "/mw2/weather/weather?func=user:logBehaviorAction";
    imagesCodeDomain = "pvcnew.mail." + NEWDOMAIN + ":20080";
   
} else if (/login\./.test(localhref)) {
    https_Url = "http://login.mail." + NEWDOMAIN;
} else if (/rd139cm\./.test(localhref)) {
    NEWDOMAIN = "rd139cm.com";
    https_Url = "http://mail." + NEWDOMAIN;
    BehaviorLog = "http://rm.mail." + NEWDOMAIN + "/mw2/weather/weather?func=user:logBehaviorAction";
    imagesCodeDomain = "pvcnew.mail." + NEWDOMAIN + ":20080";
}
    
imagesCodeDomain += "/getimage?clientid=1&r=";

if(typeof(rm) =="undefined"){
	rm={};
}

if(typeof(rm.ui) =="undefined"){
	rm.ui={};
}
//短信密码登录功能
(function () {
    //window.isSmsStatus = function() {
       // return !toggleStatus;
    //};
	
    window.closeImgCodeWin = function(iscancel) {
		btnSend = $('#btnBlue'),btnDisable = $('#btnTimer');
        if (window.msgBox) {
            window.msgBox.close();
        }

        if (iscancel) {
            return;
        }
        //灰按钮并倒数
        btnSend.hide();
        btnDisable.show();
        btnDisable.val('重试');
        timer = setInterval(countdown, 1000);
    };

    var count = 59;
    function countdown() {
	    //debugger;
        count--;
		LoginPopModel.getSMSstate = true;
        if (count < 1) {
            clearInterval(timer);
            btnDisable.hide();
            btnSend.show();
            //if (toggleStatus) {
              //  btnSend.val("免费获取");
            //} else {
               // btnSend.show();
            //}
            LoginPopModel.getSMSstate = false;
            count = 59;
            timer = -1;
        }
        btnDisable.val(count + "秒后重试");
    }
}());
function showErrorMsg(msg,isShow){
	var obj=document.getElementById('loginErrMark');
	obj.innerHTML = "<b></b>"+msg;
	if(msg.indexOf("发送")>-1){
		obj.className="complate";
		//$E("divErrorMessage").className="tips bdgreen"; 
	}else{
		obj.className="error";
		//$E("divErrorMessage").className="tips";
	}
	obj.style.display = isShow?"block":"none"; 
}
function openImgCodeWin(){
    window.msgBox = new rm.ui.messageBox({title:"获取短信密码",
            width: "310px", height: "250px",
            target:https_Url+"/ImageCode.aspx?client=login&u=" 
            + document.getElementById("txtUserName").value 
            + "&rnd=" + Math.random()
            });
    window.msgBox.show();
}
function stateClickTimes(){};
function contentload(sender){
    var bar = document.getElementById("loadingBar");
    if (bar) {
        bar.parentNode.removeChild(bar);
    }
    sender.style.width = "100%";
    sender.style.height = "100%";
}
//打开对话框

rm.ui.messageBox=function(opt){
	//debugger;
    opt = opt || {};

    this.title = opt.title || "";
    this.target = opt.target || "about:blank";
    this.height = opt.height || "300px";
    this.width = opt.width || "400px";

    this.top=opt.top?opt.top:(document.body.offsetHeight - parseInt(this.height, 10))/2;
    this.top=this.top>0?this.top:0;

    var HTMLCONTAINER = [
    '<div class="opacity_bg" style="display:block;"></div>'
    ,'<div id="j_msgwindow" class="popup pop_active">'
        ,'<div class="hd">'
            ,'<h3><a href="#" title="" hidefocus="true">×</a>', this.title, '</h3>'
        ,'</div>'
        ,'<div class="msgbox_body" style="height:'+this.height+'">'
        ,'<table id="loadingBar" align="center" height="250px"><tr><td valign="center"><img src="http://'+LIGHTSERVERDOMAIN+'/m/coremail/images/loading2.gif" /></td></tr></table>'
        ,'<iframe scrolling="no" frameborder="0" style="width:0;height:0" src="'
        , this.target
        ,'"></iframe>'
        ,'</div>'
    ,'</div>'].join('');

    this.close = function() {
        document.body.removeChild(document.body.lastChild);
        document.body.removeChild(document.body.lastChild);
    }

    this.show = function() {
        var node = document.createElement("div");
        node.innerHTML = HTMLCONTAINER;
        document.body.appendChild(node.firstChild);
        document.body.appendChild(node.lastChild);

        var win = document.getElementById("j_msgwindow");
        win.style.width = this.width;

        win.style.top = this.top + "px";
        win.style.marginLeft = 0-parseInt(this.width)/2 + "px";

        this.container = document.body.lastChild;
        var _this = this;
        
        var ifms = this.container.getElementsByTagName("iframe");
        var ifr = ifms[0];


        if (ifr.attachEvent){
            ifr.attachEvent("onload", function(){
                contentload(ifr);
            });
        } else {
            ifr.onload = function(){
                contentload(ifr);
            };
        }

        var archors = this.container.getElementsByTagName("a");
        for (var i = archors.length; i--; ) {
            if (archors[i].innerHTML == "×") {
                archors[i].onclick = function() {
                    document.body.removeChild(document.body.lastChild);
                    document.body.removeChild(document.body.lastChild);
                };
            }
        }
    }
};


var LoginPopModel = {
	urls: {
		actionUrl: "",
		successUrl: "",
		failUrl: ""
	},
	msg: {
		USERNAME: "手机/别名",
		loginTitle:{
			"0": "帐号登录",
			"1": "短信登录"
		},
		tipsPassword:{
			'0':'密码',
			'1':'短信密码'
		},
		IMGTITLE: "请输入正确答案对应的字母或数字，不区分大小写看不清，换一张",
		ERRMSG: {
			"1": "您输入的用户名或密码错误，请重新输入",
			"2": "别名或手机号码不存在，请重新输入",
			"3": "您的帐户已注销，如果要继续使用邮箱，请重新注册",
			"4": "您的账户还没有开通邮箱，请通过注册入口注册",
			"5": "由于手机号码欠费停机或者其它原因，您的139邮箱账号已被暂时冻结",
			"6": "操作错误次数达到了系统限制，请在30分钟后再试",
			"7": "系统繁忙，请稍候重试！",
			"10": "由于手机号码欠费停机或者其它原因，您的139邮箱账号已被暂时冻结",
			"11": "输错次数过多，请输入图片验证码",
			"100": "请输入别名或手机号码",
			"101": "请输入邮箱密码",
			"102": "邮箱密码不能超过30个字符",
			"103": "您输入的验证码不正确，请重新输入",
			"104": "请输入短信密码",
			"999": "系统繁忙，请稍候重试"
		}
	},
	loginState: false,
	getSMSstate:false,
	loginFail: false,
	lgoinBtnId: "",
	getUrl: function (url, isSid) {
		var newUrl = url;
		isSid && (newUrl += (url.indexOf("?") != -1 ? "&sid=" : "?sid=") + Utils.queryString("sid"));
		newUrl += (newUrl.indexOf("?") != -1 ? "&rnd=" : "?rnd=") + Math.random();
		return newUrl;
	},
	isErrHide: function(){
		return !Utils.queryString("m");
	},
	getErrTxt: function(){
		return Utils.queryString("m") ? this.msg.ERRMSG[Utils.queryString("m")] : "";
	},
	isHideVerifyCode: function(){
		return !Number(Utils.queryString("v"));
	},
	getImgRndUrl: function(){
		return "{0}&rnd={1}".format(fsConfig.imgRndUrl, Math.random());
	},
	getLoginName: function(){
		//edit by zsc
	//	toGetData.setData(function(){
			if(!alias){
				return name.encode() + "@139.com";
			}
			return alias.encode(); //+ "@139.com";
	//	})
	//	var name = UserData.userNumber.replace(/^86/, ""),
	//		alias = UserData.uidList[0];

	//	alias != undefined && (alias !== "") && !alias.match(/^\d+$/) && (name = alias);
	//	return name.encode() + "@139.com";
	},
	deleteUserData: function(){
		window.UserData = {};
	},
	autoLogin: function(autoLoginStr, callback){
		var view = LoginPopView,
			model = this;
		//访问自动登录接口，失败后会返回mail.10086.cn#return，防止死循环访问
		//if (window.location.hash) return;
		var cavl = unescape(autoLoginStr);
		try {
			//存储在cookie的值格式为 [过期时间]|[密文]
			var arr = cavl.split("|");
			if (arr.length != 2) {
				callback();
				return;
			}
			var currTime = +new Date;
			var expire = arr[0];//读出cookie中的过期时间
			if (expire != "" && !isNaN(expire) && (expire > currTime)) {
				var url = fsConfig.autoLoginUrl + "?d" + new Date;
				this.tool.requestByImg(url, function(){
					var str = model.tool.getCookie("UserData");
					if (!str) {
						window.UserData = {};
						callback();
						return;
					}
					model.loginState = true;
					window.UserData = eval("(" + unescape(str) + ")");
					callback();
				});
			}
			callback();
		} catch (ex) {}
	},
	validateSSO: function (callback) {
		var model = this;
		
		this.tool.requestByImg(this.getUrl(fsConfig.ssoUrl, true), function(){
		//	if (Utils.getCookie("Login_UserNumber")) {
			if (Utils.queryString("sid")) {
				model.loginState = true;
			} else {
				window.UserData.ssoSid = "";
			}
			callback();
		});/*
		var formOption = {
			actionUrl: this.getUrl(this.urls.ssoUrl, true) + "&loginSuccessUrl=" + encodeURIComponent(this.urls.successUrl) + "&loginFailureUrl=" + encodeURIComponent(this.urls.failUrl)
		};
		this.tool.createAjaxForm(formOption);*/
	},
	tool: {
		getElementOffset: function (ele) {
			var currOffsetLeft = ele.offsetLeft,
				currOffsetTop = ele.offsetTop,
				parent = ele.offsetParent;

			while (parent != null) {
				currOffsetLeft += parent.offsetLeft;
				currOffsetTop += parent.offsetTop;
				parent = parent.offsetParent;
			}
			return {
				left: currOffsetLeft,
				top: currOffsetTop
			}
		},
		getSidByUrl: function(){
			return Utils.queryString("sid");
		},
		trim: function (str) {
			return str.replace(/^\s*/, "").replace(/\s*$/, "");
		},
		stopPropagation: function (e) {
			window.event ? (event.cancelBubble = true) : e.stopPropagation();
		},
		deleteCookie: function (name, path, domain) {
			document.cookie = "{0}=;expires={1};path={2};domain={3}".format(name ? name : "",
				(new Date(0)).toGMTString(),
				path ? path : "",
				domain ? domain : "");
		},
		getCookie: function (name) {
			var match = document.cookie.match(new RegExp("(^|\\W)" + name + "=([^;]*)(;|$)"));
			if (match) {
				return match[2];
			}
		},
		requestByImg: function (url, callback) {
			var img = new Image;
			img.src = url;
			img.style.display = "none";
			document.body.appendChild(img);
			callback && setTimeout(function(){callback();}, 500);
		},
		createAjaxForm: function (o) {
			var model = LoginPopModel, 
				doc = document,
				div = doc.createElement("div"),
				ajaxFormEle = doc.getElementById("ajaxForm");
			
			if (!ajaxFormEle) {
				var formHtml = ['<form id="ajaxForm" target="targetFrame" action="{0}" method="{1}">',
										'</form>',
										'<iframe id="targetFrame" name="targetFrame" style="display:none;"></iframe>'].join("");

				div.innerHTML = formHtml.format(o.actionUrl, o.method || "get");
				doc.body.appendChild(div);
				var ajaxFormEle = doc.getElementById("ajaxForm");
			}
			ajaxForm.submit();
		}
	}
};

var LoginPopView = {
    id: "body",
    el: function () {
        return document.body;
    },
    loginPop: {},
    form: {},
    loginToolbar: {},
    loginBtn: {},
    /*template: ['<form action="{0}" method="post">',
						'<span class="comTip_dir"><i class="b">◆</i><i class="o">◆</i></span>',
						'<fieldset class="tipLayerLogin" style="background:#fff;">',
							'<ul>',
								'<li id="loginErrMark" class="errow{3}">{4}</li><!--hide隐藏-->',
								'<li class="p_relative"><input type="text" class="urTxt c_BEBEBE" value="手机/别名" name="UserName" tabindex="1"><label class="mLabel">@139.com</label></li><!--内容为空时加上c_BEBEBE-->',
								'<li><input type="password" class="pwTxt c_BEBEBE" name="Password" tabindex="2"></li><!--内容为空时加上c_BEBEBE-->',
								'<li class="{5}"><input type="text" name="VerifyCode" class="pwTest pwTxt c_BEBEBE mr_5 fl" tabindex="3"><img{6} alt="{7}" title="{7}" style="cursor:pointer;"></li>',
								'<li><input type="checkbox" name="auto" id="cbauto" class="mr_5" tabindex="4"><label>两周内自动登录</label><a href="http://mail.10086.cn/webmail/password/" target="_blank" style="margin-left:100px; ">忘记密码</a></li>',
								'<li class="tac"><a id="loginSubmitBtn" href="javascript:;" class="fz_16 fw_b btn bigBtn">登 录</a></li>',
							'</ul>',
							'<input type="hidden" id="loginFailureUrl" name="loginFailureUrl" value="{1}"/>',
							'<input type="hidden" id="loginSuccessUrl" name="loginSuccessUrl" value="{2}"/>',
						'</fieldset>',
					'</form>'].join(""),
*/
	template:[	'<form action="{0}" method="post">',
				'<a href="javascript:void(0);" class="close" id="close"></a>',
				'<p class="loginEntrance clearfix" id="loginEntrance"><a href="javascript:void(0);" class="on fl">账号登录</strong><a href="javascript:void(0);" class="fr">短信登录</a></p>',
				'<fieldset class="tipLayerLogin" style="background:#fff;">',
				'<ul class="loginInput" id="emailLogin">',
				'	<li class="prompt red errow{3}" id="loginErrMark" >{4}</li>',
				'	<li>',
				'		<div class="input clearfix">',
				'			<input type="text" id="txtUserName" name="UserName" class="inputCon" value="手机/别名" /><strong>@139.com</strong>',
				'		</div>',
				'	</li>',
				'	<li class="clearfix">',
				'		<div class="input clearfix inputPassword fl">',
				'			<input type="password" name="Password" class="inputCon inputPassword" value="" />',
				'		</div>',
				'		<a href="javascript:void(0);" class="btnBlue fr getSMS" id="btnBlue">免费获取</a>',
				'		<input type="button" class="retry" id="btnTimer" disabled="disabled" style="display: none;" value="59秒后重试">',
				'	</li>',
				'	<li class="{5}">',
				'		<p>请输入答案前的<span class="orange">数字或字母：</span></p>',
				'		<div class="input clearfix mt_5">',
				'			<input type="text" name="VerifyCode" class="inputCon inputPassword" value="" />',
				'		</div>',
				'		<div class="verify clearfix">',
				'			<img {6} alt="{7}" title="{7}" style="cursor:pointer;" id="imgVerifyEle"/>',
				'			<div class="verifyR">',
				'				<p>请填入图片对应的字母或数字</p>',
				'				<a href="#">看不清,换一张</a>',
				'			</div>',
				'		</div>',
				'	</li>',
				'	<li><a href="javascript:void(0);" class="btnGreen" id="loginSubmitBtn">登 录</a></li>',
				'</ul>',
				'<input type="hidden" id="loginFailureUrl" name="loginFailureUrl" value="{1}"/>',
				'<input type="hidden" id="loginSuccessUrl" name="loginSuccessUrl" value="{2}"/>',
				'</fieldset>',
				'</form>'].join(""),				
    loginedTemplate: '<span style="color:#a8d6ff;">{0}</span><em class="c_white pd10">|</em><a id="loginOutBtn" href="javascript:;"  class="c_white">退出</a>',
    loginToolbarTemplate: "",
    /**
    * @param {Object} o 参数集,包含{actionUrl: 登录表单地址, successUrl: 登录成功返回地址, failUrl: 失败返回地址}
    */
    bindEvent: function () {
        var view = this,
			doc = document,
			submitBtn = doc.getElementById("loginSubmitBtn"),
			loginBOxClose = doc.getElementById("close"),
			userNameInput = this.form["UserName"],
			passwordInput = this.form["Password"],
			verifyCodeEle = this.form["VerifyCode"],
			imgVerifyEle = doc.getElementById("imgVerifyEle"),
			btnBlue = doc.getElementById("btnBlue");
			

        Utils.addEvent(submitBtn, "onclick", function () { view.formSubmitHandler(); });
        Utils.addEvent(userNameInput, "onfocus", function () {
            userNameInput.value == view.model.msg.USERNAME && (userNameInput.value = "");
        });
        Utils.addEvent(userNameInput, "onblur", function () {
            userNameInput.value == "" && (userNameInput.value = view.model.msg.USERNAME);
        });
        //Utils.addEvent(imgVerifyEle, "onclick", function () { view.refreshImgVerify(imgVerifyEle); });
        Utils.addEvent(userNameInput, "onkeydown", function (e) { view.formInputSubmit(e); });
        Utils.addEvent(passwordInput, "onkeydown", function (e) { view.formInputSubmit(e); });
        //Utils.addEvent(verifyCodeEle, "onkeydown", function (e) { view.formInputSubmit(e); });
        //Utils.addEvent(doc, "onclick", function () { view.hideLoginPop();});
        Utils.addEvent(loginBOxClose, "onclick", function () {  view.hideLoginPop(); });
        //Utils.addEvent(this.loginPop, "onclick", function (e) { view.model.tool.stopPropagation(e); });
        Utils.addEvent(window, "onresize", function () { view.fixLoginPop(); });
        Utils.addEvent(this.aLoginBtn[1], "onclick", function () { view.showLoginChange() });
        Utils.addEvent(btnBlue, "onclick", function () {view.showImgDialog() });
    },
    init: function (o) {
        var view = this;
		if(Utils.queryString("sid")){
			toGetData.setData(function(){
				view.model = LoginPopModel;
				view.el = view.el();
				view.initParam(o);
				view.checkLogin(function () {
					view.render();
				});
			})
		
		}else{
		view.model = LoginPopModel;
				view.el = view.el();
				view.initParam(o);
				view.checkLogin(function () {
					view.render();
				});
		}

        
    },
    initParam: function (o) {
        var urls = this.model.urls;
        urls.actionUrl = o.actionUrl;
        urls.successUrl = o.successUrl;
        urls.failUrl = o.failUrl;

        this.loginToolbar = document.getElementById(o.loginToolbarId);
        this.loginBtn = document.getElementById(o.loginBtnId);
        this.model.loginToolbarTemplate = this.loginToolbar.innerHTML;
    },
    checkLogin: function (callback) {
        if (Utils.queryString("m")) {//登录失败
            this.model.loginFail = true;
            callback();
            return;
        }
        if (Utils.queryString("sid")) {//登录成功
            this.model.loginState = true;
            callback();
            return;
        }
        if (!UserData.ssoSid) {//未登录
            callback();
            return;
        }
        //校验是否自动登录
        //存储自动登录id, key为a_l
        //var autoLoginStr = this.model.tool.getCookie("a_l");
        //if (autoLoginStr) {
           // this.autoLogin(autoLoginStr, callback);
            //return;
        //}
        //sso校验sid是否过期
        this.model.validateSSO(callback);
    },
    render: function () {
        this.bindLoginToolbarEvent();
        if (this.model.loginState) {
            this.renderLoginedToolbar();
            return;
        }
       if (this.model.loginFail) {
            this.renderLoginPop();
        }
    },
    renderLoginPop: function () {
	    //debugger;
        var doc = document,
			loginPopDom = doc.createElement("div");

        loginPopDom.id = "loginPop";
        loginPopDom.className = 'loginBox';
        //loginPopDom.style.cssText = "position:absolute;width:310px;background-color: rgb(231, 231, 233); padding: 4px; z-index: 5; background-position: initial initial; background-repeat: initial initial;";

        var urls = this.model.urls;
        var imgSrc = this.model.isHideVerifyCode() ? '' : ' src="{0}"'.format(this.model.getImgRndUrl());
        loginPopDom.innerHTML = this.template.format(urls.actionUrl,
													urls.failUrl,
													urls.successUrl,
													this.model.isErrHide() ? ' hide' : '',
													this.model.getErrTxt(),
													this.model.isHideVerifyCode() ? 'hide' : '',
													imgSrc,
													this.model.msg.IMGTITLE);
        this.el.appendChild(loginPopDom);
        this.loginPop = doc.getElementById("loginPop");
        this.loginMark = doc.getElementById("backgroundBG");
        this.fixLoginPop();
		this.loginMark.style.display = "block";
        this.form = this.loginPop.getElementsByTagName("form")[0];
		this.logBoxCurIndex = 0;
		this.isEmailLogin = true;
		this.aLoginBtn = $('#loginEntrance').find('a');
		this.logginBox = $('#emailLogin');
		this.passwordBox = $('#emailLogin');
		this.bindEvent();
    },
    renderLoginedToolbar: function () {
        var view = this;
        this.loginToolbar.innerHTML = this.loginedTemplate.format(this.model.getLoginName());
        Utils.addEvent(document.getElementById("loginOutBtn"), "onclick", function () { view.loginOutHandler() });
    },
    renderLoginToolbar: function () {
        this.loginToolbar.innerHTML = this.model.loginToolbarTemplate;
        this.loginBtn = document.getElementById("loginBtn");
        this.bindLoginToolbarEvent();
    },
    loginOutHandler: function () {
	/*	var pos = location.href.indexOf("&sid");
		location.replace($T.Html.encode(location.href.substring(0,pos)));
        this.model.tool.deleteCookie("UserData", "/", fsConfig.cookieHost);
        this.model.tool.deleteCookie("a_l", "/", fsConfig.cookieHost);
        this.model.deleteUserData();
        this.renderLoginToolbar();*/
		var index = location.href.indexOf("sid") - 1;
		location.href = location.href.substr(0,index) + "&loginOut=1";
    },
    bindLoginToolbarEvent: function () {
        var view = this;
        Utils.addEvent(this.loginBtn, "onclick", function (e) {
            view.model.tool.stopPropagation(e);
            view.loginPop.nodeType ? view.showLoginPop() : view.renderLoginPop();
        });
    },
    showLoginPop: function () {
        this.loginPop.style.display = "block";
        this.loginMark.style.display = "block";
    },
    hideLoginPop: function () {
        this.loginPop.style.display = "none";
        this.loginMark.style.display = "none";
    },
    showLoginChange:function(){
	    var num = ++this.logBoxCurIndex;
		var btnSend = $('#btnBlue'),btnDisable = $('#btnTimer');
	    if(num%2 == 0){
		    this.isEmailLogin = false;
		    this.aLoginBtn[0].innerHTML = this.model.msg.loginTitle[0];
		    this.aLoginBtn[1].innerHTML = this.model.msg.loginTitle[1];
			this.logginBox.removeClass('phoneNumLogin');
		    btnSend.hide();
		    btnDisable.hide();
			if(this.form['Password'].value ==""||this.form['Password'].value ==this.model.msg.tipsPassword[1]){
				this.form['Password'].value ==this.model.msg.tipsPassword[0];
			}
	    }else{
		    this.isEmailLogin = true;
		    this.aLoginBtn[0].innerHTML = this.model.msg.loginTitle[1];
		    this.aLoginBtn[1].innerHTML = this.model.msg.loginTitle[0];		    
			this.logginBox.addClass('phoneNumLogin');
			if(this.form['Password'].value =="" ||this.form['Password'].value ==this.model.msg.tipsPassword[0]){
				this.form['Password'].value ==this.model.msg.tipsPassword[1];
			}
			if(this.model.getSMSstate){
			    btnSend.hide();
			    btnDisable.show();
			}else{
			    btnSend.show();
			    btnDisable.hide();
			}
	    }				
    },
	showImgDialog: function (){
		try{
	        if (!this.validateForm(true)) return;
			openImgCodeWin();//打开图片验证码对话框
		}catch(e){}
		
	},
    fixLoginPop: function () {
        var offset = this.model.tool.getElementOffset(this.loginBtn);
        //this.loginPop.style.left = offset.left - this.loginPop.offsetWidth + 73 + "px";
        //this.loginPop.style.top = offset.top + this.loginBtn.offsetHeight + 15 + "px";
    },
    refreshImgVerify: function (ele) {
        ele.src = this.model.getImgRndUrl();
    },
    formInputSubmit: function (e) {
        (e || event).keyCode == 13 && this.formSubmitHandler();
    },
    formSubmitHandler: function () {
        if (!this.validateForm()) return;
        this.form.submit();
    },
    isNullInput: function () {
        return this.model.tool.trim(this.form["UserName"].value) == "" ||
			this.form["UserName"].value == this.model.msg.USERNAME 
    },
    validateLogin: function() {
	    return true;
	  	//return this.model.tool.trim(this.)  
    },
    isNullPassword :function(){
	    return this.model.tool.trim(this.form['Password'].value) == "";
    },
    validateForm: function (flag) {
        var errEle = document.getElementById("loginErrMark"),
			userNameEle = this.form["UserName"],
			passwordEle = this.form["Password"];

        userNameEle.value = this.model.tool.trim(userNameEle.value);
        passwordEle.value = this.model.tool.trim(passwordEle.value);

        if (this.isNullInput()) {
            this.errTip(errEle, this.model.msg.ERRMSG["100"]);
            return false;
        }
        //if(this.validateLogin()){
	        
        //}
        if (!flag && this.isNullPassword()) {
	        if(this.isEmailLogin){
		       this.errTip(errEle, this.model.msg.ERRMSG["104"]);
		       return false; 
	        }
            this.errTip(errEle, this.model.msg.ERRMSG["101"]);
            return false;
        }
        return true;
    },
    errTip: function (ele, msg) {
        ele.className = "prompt red errow";
        ele.innerHTML = msg;
    },
    setAutoLogin: function () {
        var autoInput = this.form["auto"];
        autoInput.value = autoInput.checked ? 1 : 0;
    }
};
//add by zsc
toGetData = {
	cookiepartid :'',
	url:'',
	getcookiepartid :function(){
		this.cookiepartid = $T.Cookie.get("cookiepartid");
	},
	getUrl : function(){
		this.getcookiepartid();
		var host = location.host;
		var condition = "";
		if(location.host.indexOf("appmail3") > -1 || location.href.indexOf("share0") > -1 || location.href.indexOf("share20") > -1){
			this.url = 'http://smsrebuild0.mail.10086.cn/setting/s?';
		} else if (host.indexOf("10086ts") > -1) {
            this.url = "http://rm.mail.10086ts.cn/setting/s?";
        } else if (host.indexOf("10086rd") > -1) {
            this.url = "http://mw.mail.10086rd.cn/setting/s?";
        } else {
			this.url = 'http://smsrebuild1.mail.10086.cn/setting/s?';
		}
	},
	getdata: function(callback){
		this.getUrl();
		var urlAll = this.url + "func=info:getInfoSet&sid=" + Utils.queryString("sid");
		M139.Timing.waitForReady("frames['proxy']._ajax", function(){
				frames['proxy']._ajax.SendRequest("post",urlAll,null,callback);
			});
	},
	setData: function(callback){
		var self = this;
		userNumber ='';
		alias ='';
		self.getdata(function(res){
			var data = eval('('+ res +')');
		//	console.log(data);
			if(data.code != 'S_ERROR'){
				var userMainData = data["var"]["userMainData"];
				userNumber = $T.Mobile.remove86(userMainData["UID"]);
				alias = userNumber;
				var aliass = userMainData["uidList"];
				for(var i =0;i<aliass.length;i++){
					if(aliass[i].type == 0){
						alias = aliass[i].name.split("@")[0];
					}
				}
			callback && callback();
			}else{
				location.href = location.href.split("&")[0];//复制的地址存在sid，去掉sid重新获取
			}
		});
	}
}