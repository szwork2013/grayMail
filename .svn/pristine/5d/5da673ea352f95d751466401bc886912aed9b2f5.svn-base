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