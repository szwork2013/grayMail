(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.View.Notice', superClass.extend({
        messages: {
            FA_DEFAULT: "系统繁忙，请稍后重试",
            FA_GET_DATA: "获取数据用户设置失败",
            FA_UPDATE: "更新失败，请重试",
            FA_TIMEOUT: "登录超时，请重新登录",
            S_UPDATE: "您的设置已保存"
        },
        initialize: function () {
            
            var _this = this;
            _this.cancel = $("#btnCancel");
            _this.cancel.on("click", function () {
                _this.MM.close("notice", { exec: "back" });
            });
        
            _this.radio = $("#loginNotice :radio");

            if (top.$User) {
                if (top.$User.isNotChinaMobileUser()) {
                    _this.disable();
                    return;
                }
            } else {
                if (',81,82,83,84,'.indexOf("," + top.UserData.provCode + ",") > -1) {
                    _this.disable();
                    return;
                }
            }

            _this.model = new M2012.Settings.Model.Notice();
            _this.lastLogin = $("#lastLogin");
            _this.submit = $("#btnSubmit");

            _this.render();
        },
        WaitPanel: (new M2012.MatrixVM()).createWaitPanel(),
        MM: (new M2012.MatrixVM()).createModuleManager(),
        render: function () {
            var This = this;
            var model = This.model;
            var messages = This.messages;

            top.BH({key: "notify_load"});

            This.radio.on("click", function () {
                var val = This.radio.filter(":checked").val();
                model.set("noticeType", val);
            })

            model.on("change", function () {
                var val = model.get("noticeType");
                This.radio.removeAttr("checked");
                This.radio.filter("[value=" + val + "]").attr("checked", true); //标记选中

                var lastTime = model.get("lastLogin");
                This.lastLogin.html(lastTime);
            });

            //暂时写在这里，等邮件到达通知等全部完成之后，修改到主View中实现
            This.submit.on("click", function () {
				if(top.$User && !top.$User.isNotChinaMobileUser() || ',81,82,83,84,'.indexOf("," + top.UserData.provCode + ",") == -1) {//edit by zsx
                    This.update();
                }  
            });

            model.getSettings(function (result) {
                //获取设置并赋值
                var data = result["var"];
                if (result.code == "S_OK" && data) {
                    model.set({
                        "lastAddr": data.lastLoginAddr,
                        "noticeType": data.notifyType,
                        "lastLogin": data.lastLoginDate,
                        "lastNoticeType": data.notifyType
                    });
                }
                else if (result.code == "S_FALSE") {

                    //取消事件绑定
                    This.submit.off("click");
                    model.off("change");
                }
                else {
                    This.WaitPanel.show(messages.FA_GET_DATA, { delay: 2000 });
                }
            });
        },

        update: function () {
            var This = this;
            This.model.update(function (result) {
                var messages = This.messages;
                var tip = messages[result];
                This.WaitPanel.show(tip, { delay: 2000 });
            });
        }

        ,disable: function() {
            this.radio.attr("disabled", "disabled");
            $(".setArea:eq(0)").hide();
        }
    })
    );

    $(function () {
        var noticeView = new M2012.Settings.View.Notice();
    });
})(jQuery, _, M139);