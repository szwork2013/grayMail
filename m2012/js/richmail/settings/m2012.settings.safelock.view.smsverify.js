/**
* @fileOverview 定义安全锁验证短信密码View层的文件.
*/
/**
*@namespace 
*设置页安全锁验证短信密码View层
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.SafeLock.View.Smsverify', superClass.extend(
    /**
    *@lends M2012.Settings.SafeLock.View.Smsverify.prototype
    */
        {
        el: "body",
        events: {
    },
    template: "",

    initialize: function () {
        this.model = new M2012.Settings.SafeLock.Model();
		this.initYanzhengma();
        this.initEvents();
        return superClass.prototype.initialize.apply(this, arguments);
    },
    getTop: function () {
        return M139.PageApplication.getTopAppWindow();
    },
    render: function () {
        var mobile = this.getTop().$User.getUid().replace("86", "")
        $("#mobileNumber").html(mobile);
        return superClass.prototype.render.apply(this, arguments);
    },
	initYanzhengma: function(){
		var self = this;
		this.model.getImageCode(function(res){
		//	console.log(res);
			if(res.responseData && res.responseData.code){
				self.yangzhengmaUrl = res.responseData["var"]["imageUrl"];
				$("#yangzhengmaImg").attr("src",self.yangzhengmaUrl + "&r=" + Math.random());				
			}
			
			var imgCodeOffset = $("#yangzhengmaValue").offset();
			$("#yangzhengmaValue").blur(function(){

			}).focus(function(){
				showYangzhengmaKuang();
			}).click(function(event){
				showYangzhengmaKuang();
				event.stopPropagation();
			});
			$("#yzm").click(function(){
				return false;
			});
			$(document).click(function(){
				$("#yzm").hide();
			});
			function showYangzhengmaKuang(){
				var imgCodeOffset = $("#yangzhengmaValue").offset();
				$("#yzm").css({left: imgCodeOffset.left, top: imgCodeOffset.top - $("#yzm").height() - 18}).show();
			}
		});
	},
    /**
    *判断密码的输入正不正确，确定和取消按钮的事件响应，提交AJAX请求
    */
    initEvents: function () {

		var self = this;
        this.goBack();
        this.getCode();
        this.submitData();
		$("#yangzhengmaTips").click(function(){
			$("#yangzhengmaImg").attr("src",self.yangzhengmaUrl + "&r=" + Math.random());
		});
    },
    /**
    *返回账户设置页面
    */
    goBack: function () {
        var self = this;
        $("#goBack,#goBackAccount,#doCancel").live("click", function () {
            var sid = $T.Url.queryString("sid");
            if (M139.Browser.is.ie) {
                window.event.returnValue = false;
            }
            location.href = "account_lock_edit_password.html?type=editPassword&sid=" + sid;
        })
    },

    callapi: function (api, data, callback) {
        var options = {
            onrouter: function (router) {
                router.addRouter("setting", [api]);
            }
        };

        $RM.call(api, data, callback, options);
    },

    submitData: function () {
        var self = this, btn1 = $("#setBtn1");
        btn1.find(".btnSetG").click(function () {

            var data, code, pwd, txtCode, txtPwd1, txtPwd2;

            txtCode = $("#smsCode");
            code = txtCode.val();

            if (code == "") {
                if (!txtCode.parent().find("span").text("验证码不能为空").length) {
                    txtCode.after(self.errorHtml("验证码不能为空"));
                }
                txtCode.focus();
                return;
            } else {
                txtCode.next().remove();
            }

            txtPwd1 = $("#setPass");
            txtPwd2 = $("#comfirmPass");

            pwd = $.trim(txtPwd1.val());
            if (pwd.length == 0) {
                if (!txtPwd1.parent().find("span").text("密码不能为空").length) {
                    txtPwd1.after(self.errorHtml("密码不能为空"));
                }
                txtPwd1.focus();
                return
            }

            if (pwd != $.trim(txtPwd2.val())) {
                txtPwd2.focus();
                return;
            }

            if ($(".formError").length > 0) {
                return;
            }

            data = {
                smsCode: code,
                newPwd: pwd
            };

            self.callapi("user:resetLock", data, function (result){
                if (result && result.responseData) {
                    result = result.responseData;
                    if (result.code === "S_OK") {
                        $("#smsVerifySet").html(self.thirdStepHtml());
                        btn1.hide();
                        $("#setBtn3").show();
                        return true;
                    } else if (result.code == "ER_PWD_UNPASS") {
                        txtCode.focus();
                        txtCode.after(self.errorHtml("验证码错误，请重新输入"));
                        return false;
                    }
                }

                var tipContent = $("#resetTips");
                setTimeout(function(){tipContent.addClass("hide")}, 3000);
                tipContent.removeClass("hide").find(".tips-text");
                tipContent.html('<i class="i_fail_min mr_5"></i>' + self.model.getMessages.setSafeLockFail);

                return false;
            });
        });

        $("#setBtn3 .btnSetG").click(function () {
            var sid = $T.Url.queryString("sid");
            if (M139.Browser.is.ie) {
                window.event.returnValue = false;
            }
            location.href = "account_lock_edit_password.html?type=editPassword&sid=" + sid;
        })
    },

    getCode: function () {
        var self = this;

        $("#getCode").click(function () {
			var yangzhengmaValue = $("#yangzhengmaValue").val();
			if(yangzhengmaValue == ""){
				M139.Dom.flashElement($("#yangzhengmaValue")[0]);
				return;
			}
        //    top.M139.UI.TipMessage.show("正在验证图片验证码，并获取短信验证码", { delay: 3000});
            self.callapi("user:sendLockCode", {"imageCode": $("#yangzhengmaValue").val()}, function (result) {
                self.onSendCode(result);
        //        top.M139.UI.TipMessage.hide();
            });
        });
    },

    onSendCode: function (result) {
        var self = this, message;

    //    $("#blackbanner").remove();
        if (result && result.responseData) {
			$("#yangzhengmaImg").attr("src",self.yangzhengmaUrl + "&r=" + Math.random());
            result = result.responseData;
            if (result.code === "S_OK") {
				top.M139.UI.TipMessage.show("正在验证图片验证码，并获取短信验证码", { delay: 3000});
				$("#blackbanner").remove();
                var timeSecond = $("#timeSecond");
                timeSecond.html("60");
                $("#sendedTips").removeClass("hide");
                $("#passwordStep li:eq(1)").addClass('on');
                $(".j_tbox").removeAttr("disabled");

                var i = 60;
                var setTime = setInterval(function () {
                    timeSecond.html(i);
                    i--;
                    if (i == -1) {
                        clearInterval(setTime);
                        $("#getCode").removeClass("hide").find("span").html("重新获取短信验证码");
                        $("#reGetCode").addClass("hide");
                    }
                    if (i == 57) {
                        $("#sendedTips").addClass("hide");
                        $("#getCode").addClass("hide");
                        $("#reGetCode").removeClass("hide");
                    }
                }, 1000);
                return;
            } else if (result.code == "Frequency_Limited_Error") {
                message = "获取短信验证码的次数过多，您可30分钟后再试!";
            } else if(result.code == "S_ERROR" && result.errorCode == 1){
				top.$Msg.alert("错误的图片验证码，请重试！");
				self.initYanzhengma();
				$("#yangzhengmaValue").val("");
				return;
			}
        }

        if (!message) {
            message = self.model.getMessages.sendCodeFail;
        }

        $(".formError").remove();
        $("#smsCode").after(self.errorHtml(message));
    },

    checkPassword: function (pwd, This) {
        return M2012.Settings.PasswordCheck.checkPassword(pwd, This).errorMsg;
    },
    errorHtml: function (text) {
        return ' <span class="formError v-visible">' + text + '</span>';
    },

    thirdStepHtml: function () {
        var html = ['<h2>修改安全锁密码 <span class="line">|</span> <a class="fanghui" href="javascript:;" id="goBack">&lt;&lt;返回</a></h2>',
        '<div class="setArea-content changepassowrd1" id="thirdStep">',
        '<ul class="passwordStep passwordStep3"><!-- passwordStep2 passwordStep3 -->',
        '<li class="on">1.填写短信验证码</li>',
        '<li class="on">2.修改安全锁密码</li>',
        '<li class="on">3.成功</li>',
        '</ul>',
        '<div class="norTips norTips-min ml_20"><span class="norTipsIco"><i class="i_ok_min"></i></span>',
        '<div class="norTipsContent">',
        '<p class="norTipsTitle">安全锁密码修改成功</p>                 ',
        '</div>',
        '</div>',
        '</div>'].join("");
        return html;
    }
})
    );

    new M2012.Settings.SafeLock.View.Smsverify().render();

})(jQuery, _, M139);


