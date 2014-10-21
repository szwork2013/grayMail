(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.View.Password', superClass.extend({
        messages: {
            MODIFY_PWD_ERROR: "系统繁忙，请稍后再试",
            SESSTION_TIMEOUT: "登录超时，请重新登录",

            OLDPWD_ISNULL: "原密码不能为空，请输入邮箱密码",
            OLDPWD_ERROR: "密码不正确，区分大小写",
            PHONEPWD_ISNULL: "请输入短信验证码",
            PHONEPWD_ERROR: "手机验证码不正确，请重新输入",
            NEWPWD_ISNULL: "新密码不能为空，请输入新密码",
            NEWPWD_NOT_MATCH: "两次输入密码不一致",
            NEWPWD_NOT_ALLOW: "密码是由a-z,A-Z,0-9组成，长度在6-16位之间",
            NEWPWD_SAMEAS_OLDPWD: "新旧密码一致，请使用别的密码",

            ER_PWD_NOTFOUND:        "短信密码不正确，请重新输入",
            ER_PWD_UNPASS:          "短信密码不正确，请重新输入",
            ER_PWD_EXPIRE:          "短信密码已超过30分钟",
            ER_PWD_OVERFLOW:        "短信密码输错超过3次，请重新获取",

            ER_PWD_EMPTY:           "原密码不能为空，请输入邮箱密码",
            ER_PWD_UNSUPPORT_SIZE:  "密码是由a-z,A-Z,0-9组成，长度在6-16位之间",
            ER_PWD_HAS_UNSUPPORT_CHAR: "密码是由a-z,A-Z,0-9组成，长度在6-16位之间",
            ER_PHONE_PLACE_DO_NOT_EXIST: "接收手机号所属号段不存在",
            ER_PHONE_VERIFY_FAIL:   "接收手机号不合法",
            ER_OLD_PWD_UNPASS:      "密码不正确，区分大小写",
            ER_PWD_TOO_SIMPLE:      "密码是由a-z,A-Z,0-9组成，长度在6-16位之间",

            ER_PWD_IS_ACCOUNT:       "密码不能为手机帐号",

            MSG_SEND_FAILURE: "系统繁忙，请稍后再试",
            MSG_SENT: "验证码已发送",
            MSG_WAIT_TEXT: "秒后可重新获取",
            MSG_DEFAULT_TEXT: "获取短信验证码",
            MSG_RESEND_TEXT: "重新获取短信验证码"
        },
        status: {
            OK: "S_OK",         //成功
            SESSION_TIMEOUT: "S_FALSE",  //登录超时
            PWD_ERROR: "2035",   //旧密码错误
            NOT_ALLOW_SAME_PWD: "50",    //新旧密码一样，不允许
            ERROR: "ERROR"       //错误？？？
        },
        type: {
            VerifyMail: 1,
            VerifyPhone: 2
        },
        templete: {
            pwdTip: '<span class="formError ml_5 v-visible">{errTip}</span>',
            pwdLevel: '<span class="{class} ml_5">{tip}</span>'
        },
        SENDMSG_INTERVAL: 60,
        initialize: function () {
            this.model = new M2012.Settings.Model.Password();
            this.pwdChecker = M2012.Settings.PasswordCheck;

            //输入框控件
            this.mailPwd = $("#mailPassword");
            this.phonePwd = $("#phonePassword");
            this.oldPwd = null; //这个用来保存旧密码或者手机验证码，当修改视图时，将当前使用的input赋值即可
            this.newPwd = $("#newPassword");
            this.newPwdConfirm = $("#newPwdConfirm");

            //按钮
            this.btnMsg = $("#aGetValidateCode");
            this.btnSet = $("#btnSet");
            this.btnCancel = $("#btnCancel");

            //提示
            $("span.formError").remove();

            //忘记密码按钮
            this.gotoPhonePwd = $("#forgetPwd");
            this.gotoMailPwd = $("#forgetPwd2");
            this.goback = $("#goback,#goBack"); //返回“账户设置”

            //手机号码
            this.mobile = $("#spanMobile");

            //邮箱密码验证，手机验证码验证
            this.verifyMailPwd = $("#ulVerifyMail");
            this.verifyPhonePwd = $("#ulVerifyPhone");

            //修改密码以及成功对应的DIV
            this.modify = $("#modifyPwd");
            this.success = $("#modifySuccess");

            this.setBtn = $(".setBtn");

            this.oldPwd = this.mailPwd; //默认是邮箱密码验证
            this.render();
        },
        render: function () {
            var This = this;
            var model = This.model;
            var messages = This.messages;

            This.initEvents();
            This.bindSendMsg();
            This.oldPwd.focus();
        },
        initEvents: function () {
            var This = this;
            var model = This.model;
            var messages = This.messages;
            var checker = This.pwdChecker;

            This.mailPwd.on("blur", function () {
                This.checkOldPwd();
            });
            This.phonePwd.on("blur", function () {
                This.checkOldPwd();
            });
            This.newPwd.on("blur", function () {
                This.checkNewPwd();
            });
            This.newPwdConfirm.on("blur", function () {
                This.checkNewPwd();
            });

            //输入框事件
            This.btnSet.on("click", function () {
                This.updatePassword();
            });
            This.btnCancel.on("click", function () {
                setTimeout(function(){
                    location.assign("account.html?sid=" + parent.$App.getSid());
                }, 0);
                return false;
            });
            This.gotoPhonePwd.on("click", function () {
                var isChinaMobileUser = top.$User.isChinaMobileUser()
                if(isChinaMobileUser){
                    This.model.set("verifyType", This.type.VerifyPhone);
                } else {
                    this.href = 'http://mail.'+ document.domain +'/webmail/password/?mobile='+top.$User.getLoginName();
                    this.target = "_blank";
                }
            });
            This.gotoMailPwd.on("click", function () {
                This.model.set("verifyType", This.type.VerifyMail);
            });
            This.goback.on("click", function () {
                setTimeout(function(){
                    location.assign("account.html?sid=" + parent.$App.getSid());
                }, 0);
                return false;
            });
            This.model.on("change:verifyType", function () {
                var verifyType = This.model.get("verifyType");
                if (verifyType == This.type.VerifyPhone) {
                    This.verifyMailPwd.removeClass("show").addClass("hide");
                    This.verifyPhonePwd.removeClass("hide").addClass("show");

                    This.oldPwd = This.phonePwd; //防止下面的语句挂了
                    This.mobile.html(This.model.getMobile()); //显示手机号码
                    This.hideTip(This.oldPwd);
                    This.phonePwd.val("").focus();
                } else {
                    This.verifyMailPwd.removeClass("hide").addClass("show");
                    This.verifyPhonePwd.removeClass("show").addClass("hide");

                    This.oldPwd = This.mailPwd;
                    This.hideTip(This.oldPwd);
                    This.oldPwd.val("").focus();
                }
            });
        },
        bindSendMsg: function () {
            var This = this;
            This.btnMsg.on("click", function () {
                var span = $("span", $(this));
                This.model.sendMessage(function (data) {
                    var status = This.status;
                    if (data.code == status.OK) {
                        This.showCountDown(span);
                        This.showTip($(this), This.messages.MSG_SENT);
                    } else {
                        This.showFailure(span);
                        This.hideTip(This.phonePwd);
                    }
                });
            });
        },
        checkInput: function (This, dom, msg) {
            var model = This.model;
            var pwd = dom.val();

            if (model.isNullOrEmpty(pwd)) {
                This.showTip(dom, msg);
            } else {
                This.hideTip(dom);
            }
        },
        checkOldPwd: function () {
            var This = this;
            var model = This.model;
            var messages = This.messages;

            var verifyType = This.model.get("verifyType");
            var isVerifyMailPwd = verifyType == This.type.VerifyMail ? true : false; //是否验证邮箱密码,写完整点，好理解
            var pwd = This.oldPwd.val();
            if (model.isNullOrEmpty(pwd)) {
                var msg = isVerifyMailPwd ? messages.OLDPWD_ISNULL : messages.PHONEPWD_ISNULL;
                This.showTip(This.oldPwd, msg);
                return false;
            } else {
                //检测旧密码规则
                /*
                var checker = This.pwdChecker;
                var chkResult = checker.checkPassword(pwd);
                console.log("旧密码检测返回",chkResult);
                if (chkResult && !chkResult.success) {
                    var errorCode = chkResult.errorCode;
                    var Length_Less = 2,//密码太短
                        Spechars = 5;   //不允许的特殊字符
                    if (errorCode == Length_Less || errorCode == Spechars) {
                        This.showTip(This.oldPwd, messages.OLDPWD_ERROR);
                        return false;
                    }
                }
                */

                This.hideTip(This.oldPwd);
                return true;
            }
        },
        checkNewPwd: function () {
            var This = this;
            var model = This.model;
            var messages = This.messages;

            var checker = This.pwdChecker;
            var oldPwd = This.oldPwd.val();
            var pwd = This.newPwd.val();
            var confirmPwd = This.newPwdConfirm.val();
            var isVerifyMail = This.model.get("verifyType") == This.type.VerifyMail; //是否验证邮箱密码

            //隐藏旧提示
            This.hideTip(This.newPwd);
            This.hideTip(This.newPwdConfirm);

            if (model.isNullOrEmpty(pwd)) {
                This.showTip(This.newPwd, messages.NEWPWD_ISNULL);
                return false;
            }

            // 新旧密码一致,中间件自己加的规则，前端暂不过滤此情况,代码保留
            /*
            if (!model.isNullOrEmpty(oldPwd) &&
                !model.isNullOrEmpty(pwd) &&
                model.isMatch(oldPwd, pwd)) {
                This.showTip(This.newPwd, messages.NEWPWD_SAMEAS_OLDPWD);
                return false;
            }
            //*/

            var pwdResult = checker.checkPassword(pwd);
            var code = pwdResult.success;
            if (!code) {
                //不符合规范
                var msg = pwdResult.errorMsg || messages.NEWPWD_NOT_ALLOW;
                This.showTip(This.newPwd, msg);
                return false;
            }
            else {
                This.showPwdLevel(This.newPwd, pwdResult.strongLevel); //无提示语时，显示密码强度

                if (model.isNullOrEmpty(confirmPwd)) {
                    return false;
                } else {
                    if (!model.isMatch(pwd, confirmPwd)) {
                        This.showTip(This.newPwdConfirm, messages.NEWPWD_NOT_MATCH);
                        return false;
                    }
                }
            }

            return true;
        },
        showCountDown: function (dom, time) {
            var This = this;
            if (!dom) return;
            if (!time) {
                time = This.SENDMSG_INTERVAL || 60; //60秒
                This.btnMsg.removeAttr("href").off("click");
                dom.addClass("gray");
            }

            if (This.timer) clearTimeout(This.timer);
            var messages = this.messages;
            if (time > 0) {
                dom.html(time + messages.MSG_WAIT_TEXT).parent().removeAttr("disabled");
                var next = time - 1;
                next = next || -1; //为0时，标记为-1，if(!time)才不会触发
                This.timer = setTimeout(function () {
                    This.showCountDown(dom, next);
                }, 1000);
            } else {
                dom.removeClass("gray").html(messages.MSG_RESEND_TEXT);
                This.bindSendMsg();
            }
        },
        showTip: function (dom, tip) {
            var html = this.templete.pwdTip.replace("{errTip}", tip);
            dom.next("span").remove();
            dom.after(html);
        },
        hideTip: function (dom) {
            dom.next("span").remove();
        },
        showPwdLevel: function (dom, level) {
            var pwdLevel = [
                { "class": "pasNosafe", "tip": "不安全" },
                { "class": "pasLow", "tip": "弱" },
                { "class": "pasMid", "tip": "中" },
                { "class": "pasHign", "tip": "强" }
            ];

            var html = this.templete.pwdLevel;
            html = parent.$T.Utils.format(html, pwdLevel[level]);
            dom.next("span").remove();
            dom.after(html);
        },
        hidePwdLevel: function (dom) {
            this.hideTip(dom);
        },
        showFailure: function (dom, msg) {
            msg = msg || this.messages.MSG_SEND_FAILURE
            var tipName = "tipSendFailure"; //单例
            var popup = M139.UI.Popup.create({
                name: tipName,
                containerClass: "",
                mainClass: "tips delmailTips passydztips",
                noClose: false,
                autoHide: true,
                target: dom[0],
                width: "auto",
                icon: "i_fail_min",
                content: '<i class="i_fail_min mr_5"/>' + msg
            });
            popup.render();
        },
        clearInput: function () {
            var This = this;
            This.oldPwd.val(""); //密码置空
            This.newPwd.val("");
            This.newPwdConfirm.val("");
            This.hideTip(This.newPwd);
            This.hideTip(This.newPwdConfirm);
        },
        updatePassword: function (This) {
            var This = this;
            var model = This.model;
            var messages = This.messages;
            var oldPwd = $.trim(This.oldPwd.val());
            var newPwd = $.trim(This.newPwd.val());
            var passwordType = model.get("verifyType");

            if (!This.checkOldPwd()) {
                This.oldPwd.focus();
                return false;
            }

            if (This.checkNewPwd()) {
                var data = {
                    "oldpwd": oldPwd,
                    "newpwd": newPwd,
                    "passwordType": passwordType.toString() //字符串。。。
                };
                model.updatePassword(data, function (result) {
                    var code = result.code || null;

                    var msg = "";
                    if (code) {
                        if (code == This.status.OK) {
                            top.BH('set_modify_password_success'); //修改密码成功，行为上报
                            This.modify.removeClass("show").addClass("hide");
                            This.success.removeClass("hide").addClass("show");
                            This.clearInput();
                            This.setBtn.addClass("hide");
                            return;
                        } else {

                            switch(code) {
                                case "ER_PWD_UNPASS":
                                    msg = messages.ER_PWD_UNPASS;
                                    break;
                                case "ER_PWD_EXPIRE":
                                    msg = messages.ER_PWD_EXPIRE;
                                    break;
                                case "ER_PWD_OVERFLOW":
                                    msg = messages.ER_PWD_OVERFLOW;
                                    break;
                                case "ER_PWD_NOTFOUND":
                                    msg = messages.ER_PWD_NOTFOUND;
                                    break;
                                case "ER_PWD_EMPTY":
                                case "7001":
                                    msg = messages.ER_PWD_EMPTY;
                                    break;
                                case "ER_PWD_UNSUPPORT_SIZE":
                                case "7002":
                                    msg = messages.ER_PWD_UNSUPPORT_SIZE;
                                    break;
                                case "ER_PWD_HAS_UNSUPPORT_CHAR":
                                case "7003":
                                    msg = messages.ER_PWD_HAS_UNSUPPORT_CHAR;
                                    break;
                                case "ER_PHONE_PLACE_DO_NOT_EXIST":
                                case "7004":
                                    msg = messages.ER_PHONE_PLACE_DO_NOT_EXIST;
                                    break;
                                case "ER_PHONE_VERIFY_FAIL":
                                case "7005":
                                    msg = messages.ER_PHONE_VERIFY_FAIL;
                                    break;
                                case "ER_OLD_PWD_UNPASS":
                                case "2035":
                                    msg = messages.ER_OLD_PWD_UNPASS;
                                    break;
                                case "ER_OLD_PWD_UNPASS":
                                case "2035":
                                    msg = messages.ER_OLD_PWD_UNPASS;
                                    break;
                                case "ER_PWD_TOO_SIMPLE":
                                case "3078":
                                    msg = messages.ER_PWD_TOO_SIMPLE;
                                    break;
                                case "ER_PWD_IS_ACCOUNT":
                                    msg = messages.ER_PWD_IS_ACCOUNT;
                                    break;
                                default:
                                    msg = messages.MODIFY_PWD_ERROR;
                                    break;
                            }
                        }
                    } else {
                        msg = messages.MODIFY_PWD_ERROR;
                    }
                    parent.$Msg.alert(msg);
                    This.clearInput();
                    return;
                });
            }
        }
    })
    );

    $(function () {
    	// update by tkh 该view变为全局变量，供其他地方调用方法如：
        var passwordView = new M2012.Settings.View.Password();
    });
})(jQuery, _, M139);