/**
    * @fileOverview 定义设置页安全锁Model层的文件.
*/


(function (jQuery, _, M139) {

    /**
    *@namespace 
    *设置页安全锁Model层
    */
    M139.namespace('M2012.Settings.SafeLock.Model', Backbone.Model.extend(
    /**
    *@lends M2012.Settings.SafeLock.Model.prototype
    */
        {
        defaults: {
            //userFolderstats: [],
            //popFolderstats: [],
            type: 1,
            ids: [],
            newPass: "",
            oldPass: "",
            checkSuccess: false,
            hasLockedFolder: false,
            firstPass: false
        },
        callApi: M139.RichMail.API.call,
        /**
        *获取我的文件夹的数据
        *@param {String} folder：文件夹类型
        */
        getUserFolder: function (callback) {
            $RM.getFolderList(function (result) {
                callback(result["var"]);
            });
        },
        getTop: function () {
            return M139.PageApplication.getTopAppWindow();
        },
        /**
        *获取代收文件夹的数据
        *@param {String} folder:文件夹类型
        */
        getPopFolder: function (callback) {
            var options = [{
                fid: 1,
                order: "receiveDate",
                desc: 1,
                start: 1,
                total: 1,
                topFlag: "top"
            }];
            $RM.getMailList(options, function (result) {
                callback(result["var"]);
            });
        },
        checkBillSub: function (customData) {
            var folders = this.getTop().$App.getFolders();
            var foldLen = folders.length;
            var bill = false;
            var sub = false;
            $.each(customData, function (i, e) {
                if (e.fid == 8) {
                    bill = true;
                }
                if (e.fid == 9) {
                    sub = true;
                }
            })
            for (var n = 0; n < foldLen; n++) {
                if (folders[n].fid == 8 && bill == false) { //订阅中心和帐单中心
                    customData.push(folders[n]);
                }
                if (folders[n].fid == 9 && sub == false) { //订阅中心和帐单中心
                    customData.push(folders[n]);
                }
            };
            return customData;
        },
		getImageCode: function(callback){
			this.callApi("user:getImageCode",{},function(res){
				callback && callback(res);
			})
		
		},
        /**
        *检查是否为加锁文件夹
        */
        checkLockFolder: function () {
            var self = this;
            var customData = this.getTop().$App.getFolders("custom");
            customData = this.checkBillSub(customData);
            var popData = this.getTop().$App.getFolders("pop");
            var popLen = popData.length;
            var customLen = customData.length;
            var data = [];
            for (var i = 0; i < popLen; i++) {
                data.push(popData[i])
            }
            for (var i = 0; i < customLen; i++) {
                data.push(customData[i])
            }
            if (!data) {
                return;
            } else {
                var max = 0;
                $.each(data, function (i, o) {
                    max = Math.max(max, o.folderPassFlag);
                });
                if (max == 1) {
                    return true
                } else {
                    return false
                }
            };
        },
        /**
        *保存安全锁文件夹和密码
        *@param {String} folder:文件夹类型
        */
        saveData: function (callback) {
            var self = this;
            this.callApi("global:sequential", { items: [
                        { func: "mbox:setFolderPass", "var": { oldPass: this.get("oldPass"), type: 3} },
                        { func: "mbox:setFolderPass", "var": { newPass: this.get("newPass"), type: 1, ids: this.get("ids")} }
                    ]
            }, function (res) {
                callback(res.responseData)
                self.getTop().appView.trigger('reloadFolder', { reload: true });
            });
        },
        /**
        *没有加锁文件夹时，第一次设置安全锁
        */
        firstLock: function (callback) {
            var self = this;
            var options = {
                type: this.get("type"),
                newPass: this.get("newPass"),
                ids: this.get("ids")
            };
            $RM.setFolderPass(options, function (result) {
                callback(result);
                self.getTop().appView.trigger('reloadFolder', { reload: true });
            });
        },
        /**
        *修改安全锁密码
        */
        editPassword: function (callback) {
            var self = this;
            var options = {
                type: 2,
                oldPass: this.get("oldPass"),
                newPass: this.get("newPass")
            };
            if (options.newPass == "") {
                this.alertMessages(this.getMessages.passwordNull)
                return
            }
            $RM.setFolderPass(options, function (result) {
                callback(result);
                self.getTop().appView.trigger('reloadFolder', { reload: true });
            });
        },
        /**
        *解锁
        */
        unLock: function (callback) {
            var self = this;
            var options = {
                type: 3,
                oldPass: this.get("newPass")
            };
            $RM.setFolderPass(options, function (result) {
                callback(result);
                self.getTop().appView.trigger('reloadFolder', { reload: true });
                top.$App.trigger("unLockOk", {from:"setLock"});
            });
        },
        getMessages: {
            passwordNull: "密码不能为空",
            serverBusy: "服务器繁忙，请稍后再试。",
            passwordLength: "密码长度不能少于6位大于30位",
            passwordNotSame: "两次输入的密码不一致",
            passwordIsSimple: "不能是字符串联，如aaaaaa、123456、ABCDEF",
            capsLock: "大写已锁定",
            passowrdError: "密码不正确，区分大小写",
            selectLockFolder: "请选择要加锁的文件夹",
            setSafeLockFail: "设置失败！",
            sendCodeFail: "获取验证码失败，请稍后重试"

        },
        alertMessages: function (message) {
            this.getTop().$Msg.alert(
                message,
                {
                    dialogTitle: "系统提示",
                    icon: "warn"
                }
            );
        },
        unLockHtml: function () {
            var html = ['<span class="pl_20"><a href="javascript:void(0)" class="btnSetG" id="doOk"><span>确 定</span></a> <a href="javascript:void(0)" class="btnSet" id="doCancel"><span>取 消</span></a></span>'].join("");
            return html;
        },
        editSuccessHtml: function () {
            var html = ['<div class="norTips norTips-min"> <span class="norTipsIco"><i class="i_ok_min"></i></span>',
            '<div class="norTipsContent">',
            '<p class="norTipsTitle">修改成功</p>',
            '<p class="norTipsLine"> <a class="btnNormal" href="javascript:void(0)" id="goBackAccount"><span>返回“帐户与安全”</span></a></p>',
            '</div>',
            '</div>'].join("");
            return html;
        },
        errorTips: function (text) {
            var html = ' <span class="formError v-visible">' + text + '</span>';
            return html;
        }
    })
    );

})(jQuery, _, M139);
/**
* @fileOverview 定义安全锁View层的文件.
*/
/**
*@namespace 
*设置页安全锁View层
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.SafeLock.View.Submit', superClass.extend(
    /**
    *@lends M2012.Settings.SafeLock.View.Submit.prototype
    */
        {
        el: "body",
        events: {
            "click #useSmsPass": "useSmsPass"
        },
        template: "",
        initialize: function () {
            this.model = new M2012.Settings.SafeLock.Model();
            this.initEvents();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        getTop: function () {
            return M139.PageApplication.getTopAppWindow();
        },
        render: function () {
            var type = $T.Url.queryString("type");
            if (type == "editPassword") {
                $("#oldPassword").focus();
            }
            if (type == "unlock") {
                $("#setBtn").html(this.model.unLockHtml());
            }
            if (!this.getTop().$User.isChinaMobileUser()) {
                $("#useSmsPass").hide();
            } 
            return superClass.prototype.render.apply(this, arguments);
        },
        /**
        *数据提交 第一次设置安全锁
        */
        renderSaveData: function () {
            var self = this;
            this.model.firstLock(function (dataSource) {
                if (dataSource["code"] == "S_OK") {
                    location.href = "account_lock.html?type=normal&sid=" + $T.Url.queryString("sid") + "&v=" + Math.random();
                    top.BH("set_lock_save_success");
                } else {
                    var message = self.model.getMessages.setSafeLockFail;
                    self.model.alertMessages(message);
                }
            })
        },
        checkIsCapsLock: function () {
            var self = this;
            $("#oldPassword").live("focus", function () {
                var This = $(this);
                This.next().remove();
            });
        },
        checkPassword: function (pwd, phone) {
            return M2012.Settings.PasswordCheck.checkPassword(pwd, phone).errorMsg;

        },
        inputKeyup: function () {
            var self = this;
            var newPwdObj = $("#setPass");
            var confirmPwdObj = $("#comfirmPass");
            var verifyPass = $("#verifyPass");
            var phone = top.$User.getUid();
            phone = $T.Mobile.remove86(phone);
            var arr = [phone];
            verifyPass.live("blur", function (event) {
                var This = $(this);
                var newVal = This.val();
                var text = self.checkPassword(newVal);
                if (newVal == "") {
                    This.next().remove();
                    This.after(self.model.errorTips(text));
                    return
                } else {
                    This.next().remove();
                }
            });
            newPwdObj.live("focus",function(){
            	if($(this).next().length == 0){
            		$(this).after(self.model.errorTips('6-30 字符，区分大小写，不支持字符串联')); 
            	}   	
            });
            newPwdObj.live("keypress",function(){
            	$(this).next().remove();
            });
            newPwdObj.live("blur", function (event) {
                var This = $(this);
                var newVal = This.val();
                var text = self.checkPassword(newVal, arr);
                if (text) {
                    This.next().remove();
                    This.after(self.model.errorTips(text));
                } else {
                    This.next().remove();
                }
            });
            confirmPwdObj.live("blur", function (event) {
                var This = $(this);
                var confirmVal = This.val();
                var password = $("#setPass").val();
                if (password == confirmVal) {
                    var code = $("#comfirmPass").val();
                    This.next().remove();
                } else {
                    This.next().remove();
                    This.after(self.model.errorTips("两次输入密码不一致"));
                }
            });
        },
        /**
        *数据提交 修改安全锁密码
        */
        renderEditPassword: function () {
            var self = this;
            this.model.editPassword(function (dataSource) {
                if (dataSource["code"] == "S_OK") {
                    top.BH("set_lock_save_success");
                    $("#setBtn").remove();
                    $("#setEditPassword ul").remove();
                    $("#setEditPassword").append(self.model.editSuccessHtml());
                }
                else {
                    var message = self.model.getMessages.passowrdError;
                    $("#oldPassword").next().remove();
                    $("#oldPassword").after(self.model.errorTips(message));
                }
            })
        },
        /**
        *数据提交 取消安全锁
        */
        renderUnlock: function () {
            var self = this;
            this.model.unLock(function (dataSource) {
                if (dataSource["code"] == "S_OK") {
                    location.href = "account_lock.html?type=normal&sid=" + $T.Url.queryString("sid") + "&v=" + Math.random();
                    top.BH("set_lock_save_success");
                }
                else {
                    var message = self.model.getMessages.passowrdError;
                    $("#verifyPass").next().remove();
                    $("#verifyPass").after(self.model.errorTips(message));
                }
            })
        },
        /**
        *数据提交 编辑安全锁
        */
        renderEdit: function () {
            var self = this;
            this.model.saveData(function (dataSource) {
                if (dataSource["code"] == "S_OK") {
                    location.href = "account_lock.html?type=normal&sid=" + $T.Url.queryString("sid") + "&v=" + Math.random();
                    top.BH("set_lock_save_success");
                }
                else {
                    var message = self.model.getMessages.setSafeLockFail;
                    self.model.alertMessages(message);
                }
            })
        },
        /**
        *跳转到验证短信密码页面
        */
        useSmsPass: function () {
            var sid = $T.Url.queryString("sid");
            if (M139.Browser.is.ie) {
                window.event.returnValue = false;
            }
            location.href = "account_lock_verifycode.html?sid=" + sid;
        },
        /**
        *链接跳转取消安全锁
        */
        unLock: function () {
            $("#unLock").live("click", function () {
                var sid = $T.Url.queryString("sid");
                if (M139.Browser.is.ie) {
                    window.event.returnValue = false;
                }
                location.href = "account_lock.html?type=unlock&sid=" + sid;
            })
        },
        /**
        *链接跳转修改加锁范围
        */
        editPassword: function () {
            $("#editPassword").live("click", function () {
                var sid = $T.Url.queryString("sid");
                if (M139.Browser.is.ie) {
                    window.event.returnValue = false;
                }
                location.href = "account_lock_edit_password.html?type=editPassword&sid=" + sid;
            })
        },
        /**
        *点击确定提交数据
        */
        submitData: function () {
            var self = this;
            $("#doOk").live("click", function () {
                var val = $("#verifyPass").val();
                var type = $T.Url.queryString("type");
                var selectedLen = self.getCheckbox().length;
                switch (type) {
                    case "editPassword":
                        if ($("#setPass").val() == "" || $("#comfirmPass").val() == "") {
                            var message = self.model.getMessages.passwordNull;
                            self.model.alertMessages(message);
                            return
                        }
                        if ($(".formError").length > 0) {
                            return
                        } else {
                            self.model.set({ "oldPass": $("#oldPassword").val(), "newPass": $("#comfirmPass").val() })
                            self.renderEditPassword();
                        };
                        break
                    case "unlock":
                        if (val == "") {
                            return
                        }
                        self.model.set({ "newPass": val })
                        self.renderUnlock();
                        break
                    case "edit":
                        if (val == "") {
                            return
                        }
                        if (selectedLen == 0) {
                            var message = self.model.getMessages.selectLockFolder;
                            self.model.alertMessages(message);
                            return
                        }
                        self.model.set({
                            "ids": self.getCheckbox(),
                            "newPass": val,
                            "oldPass": val
                        })
                        self.renderEdit();
                        break
                    case "normal":
                        val = $("#comfirmPass").val();
                        if ($("#setPass").val() == "" || $("#comfirmPass").val() == "") {
                            var message = self.model.getMessages.passwordNull;
                            self.model.alertMessages(message);
                            return
                        }
                        self.model.set({
                            "ids": self.getCheckbox(),
                            "newPass": val

                        })
                        if ($(".formError").length > 0) {
                            return
                        }
                        if (selectedLen == 0) {
                            var message = self.model.getMessages.selectLockFolder;
                            self.model.alertMessages(message);
                            return
                        }
                        self.renderSaveData();
                        break

                }
            })
        },
        /**
        *判断密码的输入正不正确，确定和取消按钮的事件响应，提交AJAX请求
        */
        initEvents: function () {
            this.selectAll("allUser", "userTable");
            this.selectAll("allPop", "popTable");
            this.editArea();
            this.goBack();
            this.unLock();
            this.submitData();
            this.editPassword();
            this.inputKeyup();
            this.checkIsCapsLock();
        },
        editArea: function () {
            var self = this;
            $("#editArea").live("click", function () {
                var sid = $T.Url.queryString("sid");
                if (M139.Browser.is.ie) {
                    window.event.returnValue = false;
                }
                location.href = "account_lock.html?type=edit&sid=" + sid;
            })
        },
        /**
        *获取选中的复选框fid，拼成数组
        */
        getCheckbox: function () {
            var findInput = $("#lockAreaLi").find("input[name=checkbox]:checked");
            var len = findInput.length;
            var arrFid = [];
            for (var i = 0; i < len; i++) {
                var input = findInput.eq(i)
                arrFid.push(parseInt(input.attr("fid")))
            }
            return arrFid;
        },
        goBack: function () {
            var self = this;
            $("#goBack,#goBackAccount,#doCancel").live("click", function () {
                var sid = $T.Url.queryString("sid");
                if (M139.Browser.is.ie) {
                    window.event.returnValue = false;
                }
                location.href = "account.html?sid=" + sid + "&anchor=lock";
            })
        },
        /**
        *全选
        */
        selectAll: function (objAll, objTable) {
            $("#" + objAll).click(function () {
                var userInput = $("#" + objTable).find("input");
                if ($(this).attr("checked")) {
                    userInput.attr("checked", "true")
                } else {
                    userInput.removeAttr("checked")
                }

            });
        }
    })
    );

    lockViewSubmit = new M2012.Settings.SafeLock.View.Submit();
    lockViewSubmit.render();

})(jQuery, _, M139);



﻿(function (jQuery, _, M139) {
    var $ = jQuery;
    /**
     *@namespace
     *@name M2012.Settings.Model.Password
     */
    M139.namespace('M2012.Settings.Model.Password', Backbone.Model.extend({
        defaults: {
            verifyType: 1, //验证类型:1,邮箱密码；2，手机验证码
            updated: false  //是否修改成功
        },
        initialize: function () {

        },
        sendMessage: function (callback) {
            //发送短信验证码
            M139.RichMail.API.call("user:sendPasswordAction", {}, function (response) {
                //console.log("发送短信的返回码：" + JSON.stringify(response.responseData));
                callback(response.responseData); //验证
            });
        },
        /**
        *检查2个密码是否一致,一般用于新密码和确认密码
        */
        checkPassword: function (password, passwordConfirm) {
            return password == passwordConfirm;
        },
        isMatch: function (pwd, pwdConfirm) {
            return pwd == pwdConfirm;
        },
        isMatchRule: function (password) {
            if (!/^[a-zA-Z0-9]{6,15}$/.test(password)) {
                return false;
            }
            return true; //测试，直接返回
        },
        /**
        *更新密码
        *@param {Object} data 旧密码（验证码）、新密码、密码类型
        *@returns {Object} 返回的结果
        */
        updatePassword: function (data, callback) {
            var This = this;
            if (This.busy) {
                return;
            }

            M139.RichMail.API.call("user:updatePasswordAction", data, function (response) {
                callback(response.responseData); //验证
                This.busy = false;
            });
            This.busy = true;
        },
        getMobile: function () {
            return parent.$User.getShortUid();
        },
        /**
        *检查字符串是否为空（去掉头尾空格）
        */
        isNullOrEmpty: function (str) {
            if (str) {
                if (typeof (str) != "string") {
                    throw "验证的内容非字符串";
                }
                return $.trim(str) == "";
            }
            return true;
        }
    })
    );
})(jQuery, _, M139);
﻿(function (jQuery, _, M139) {
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
﻿/**
 * @fileOverview 定义弱密码规则检查组件
 */

(function (jQuery, _, M139) {
    var $ = jQuery;

    //密码强度
    var StrongLevel = {
        WEAK: 1,
        MIDDLE: 2,
        HIGH: 3
    };
    //字符类型：数字、小写字母、大写字母、特殊字符
    var CharType = {
        NUMBER: 1,
        LOWERLETTER: 2,
        UPPERLETTER: 4,
        Spechars: 8
    };

    //密码错误类型
    var PasswordError = {
        Empty:"1",//"密码不能为空",
        Length_Less:"2",// "密码必须为6-30位",
        Length_More:"3", //"密码必须为6-30位",
        AllNumber: "4",//"密码不能为纯数字",//已经去掉了
        Spechars:"5",//"密码不支持_~@#$^以外的特殊符号",
        SimpleString:"6",//"密码不能有太多字符串联",
        MoreSimpleString:"7",//"密码不能为字符串联块",
        UnsafeList: "8", //"密码不能为用户帐号
        AllNumberMinLength:"9" //纯数字密码必须为8-30位
    };

    /**
     *@namespace
     *@name M2012.Settings.PasswordCheck
     */
    M139.namespace("M2012.Settings.PasswordCheck",
       /**
        *@lends M2012.Settings.PasswordCheck
        */
        {
            /**
             *判断密码强度等级：强、中、弱、不合法（分别对应3,2,1,0）
             *@param {String} pwd 要检查的密码
             *@inner
             *@returns {Number} 返回密码的等级0表示不合法，3表示强
             */
            getStrongLevel: function (pwd) {
                if (pwd.length < 6) return StrongLevel.WEAK;

                var modes = this.countCharMode(pwd);

                //弱
                //6-8位,且仅包含数字,字母,特殊符号中的1种
                //6-8位,且仅包含数字,字母,特殊符号中的2种
                //9-30位,且仅包含数字,字母,特殊符号中的1种
                if (pwd.length <= 8 && modes <= 2) {
                    return StrongLevel.WEAK;
                } else if (pwd.length > 8 && modes == 1) {
                    return StrongLevel.WEAK;
                }

                //中
                //6-8位,且仅包含数字,字母,特殊符号中的3种
                //9-30位,且仅包含数字,字母,特殊符号中的2种
                if (pwd.length <= 8 && modes >= 3) {
                    return StrongLevel.MIDDLE;
                } else if (pwd.length > 8 && modes == 2) {
                    return StrongLevel.MIDDLE;
                }
                //强
                //9-30位,且仅包含数字,字母,特殊符号中的3种
                if (pwd.length > 8 && modes >= 3) {
                    return StrongLevel.HIGH;
                }

                return StrongLevel.WEAK;
            },
            /**
             *测试某个字符是属于哪一类
             *@inner
             */
            getCharMode: function (c) {
                if (/^\d$/.test(c)) return CharType.NUMBER;
                if (/^[A-Z]$/.test(c)) return CharType.UPPERLETTER;
                if (/^[a-z]$/.test(c)) return CharType.LOWERLETTER;
                return CharType.Spechars;
            },
            /*
             *用位运算计算出当前密码当中一共有多少种模式
             *@inner
             */
            countCharMode: function (str) {
                var mode = 0;
                for (var i = 0; i < str.length; i++) {
                    var c = str.charAt(i);
                    mode |= this.getCharMode(c);
                }
                return mode.toString(2).match(/1/g).length;
            },
            /**
             *判断字符串是否为简单组合：234,111,aaa,abc
             *@inner
             */
            isSimpleString: function (str) {
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
             *检查密码的安全性
             *@param {String} pwd 要检查的密码
             *@param {Array} disList 密码不允许的值（通常是该用户的手机号、别名）
             *@returns {Object} 返回的结果
             返回值：
             .success表示是否成功，
             .strongLevel表示密码等级，
             errorCode和errorMsg分别表示密码不允许的原因
             */
            checkPassword: function (pwd, disList) {
                var This = this;
                if (typeof pwd != "string") {
                    throw "checkPassword密码必须为字符串";
                }
                var min = 6;
                var max = 30;
                var errorCode = 0;
                var len = pwd.length;
                if (len == 0) {//为空
                    errorCode = PasswordError.Empty;
                } else if (len < min) {//太短
                    errorCode = PasswordError.Length_Less;
                } else if (len > max) {//太长
                    errorCode = PasswordError.Length_More;
                } else if (/[^A-Za-z0-9_~@#$\^]/.test(pwd)) {//包含特殊字符
                    errorCode = PasswordError.Spechars;
                } else if (isError6()) {
                    errorCode = PasswordError.SimpleString;
                } else if (isError7()) {
                    errorCode = PasswordError.MoreSimpleString;
                } else if (isError8()) {
                    errorCode = PasswordError.UnsafeList;
                } else if (isError9()) {
                    errorCode = PasswordError.AllNumberMinLength;
                }
                if (errorCode == 0) {
                    return { success: true, errorCode:0, strongLevel: This.getStrongLevel(pwd) };
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
                        "9": "纯数字密码必须为8-30位"//新增纯数字密码长度要求
                    }
                    return { success: false, errorCode: errorCode, errorMsg: errorMsg[errorCode], strongLevel: This.getStrongLevel(pwd) };
                }
                function isError6() {
                    return This.isSimpleString(pwd.substring(1)) ||
                        This.isSimpleString(pwd.substring(0, pwd.length - 1));
                }
                function isError7() {
                    for (var i = 1; i < pwd.length; i++) {
                        var strBegin = pwd.substring(0, i);
                        if (This.isSimpleString(strBegin)) {
                            var strEnd = pwd.substring(i, pwd.length);
                            if (This.isSimpleString(strEnd)) {
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
                        if (uid == pwd) return true;
                    }
                }
                function isError9() {
                    var strNumber = pwd.replace(/[^0-9]/gi, "");
                    var minLength = 8;//新增，纯数字密码长度要求为8位及以上
                    if (strNumber.length == pwd.length) {
                        return pwd.length < minLength;
                    } else {
                        return false;
                    }
                }
            }
        });
})(jQuery, _, M139);
