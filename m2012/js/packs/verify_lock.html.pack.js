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



