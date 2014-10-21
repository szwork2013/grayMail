/* @fileOverview 定义设置第三方授权View层的文件.
*/
/**
*@namespace 
*设置第三方授权View层
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;

    M139.namespace('M2012.Settings.SsoLogin.View', superClass.extend(
    /**
    *@lends M2012.Settings.SsoLogin.View.prototype
    */
        {
        initialize: function () {
            this.model = new M2012.Settings.Account.Model();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initEvents: function () {
        },
        ssoLogin: function () {
            if (top.SiteConfig.ssoLogin) {
                this.getSsoLogin();
            }
        },
        getSsoUrl: function (type, obj) {
            var mobile = top.$App.getConfig("UserData").UID;
            mobile = top.$Mobile.remove86(mobile);
            var options = {
                opertype: "1",
                account: mobile,
                sid: top.sid,
                comefrom: "",
                timestamp: +new Date(),
                key: ""
            }
            if (type == "get") {
                options.comefrom = "Authorize";
            } else {
                options.comefrom = obj.clientid;
                options.opertype = "0";
            }
            var md5 = options.timestamp + options.opertype + options.account + options.sid + options.comefrom;
            md5 = hex_md5(md5);
            options.key = md5.toUpperCase();
            var url = top.SiteConfig.ssoInterface + "/GetOrCancelUserOrder";
            url = M139.Text.Url.makeUrl(url, options);
            return url;
        },
        getSsoLogin: function () {
            var self = this;
            var url = this.getSsoUrl("get");
            self.model.loadResource(url, function () {
                if (typeof (getSsoLogin) != "undefined" && getSsoLogin.code == "S_OK") {
                    if (getSsoLogin["var"]) {
                        var data = getSsoLogin["var"];
                        if (data.length > 0) {
                            $("#ssoLogin").removeClass("hide");
                            self.getTemplate(data);
                            self.submitSsoLogin();
                        } 
                    }
                } 
            });
        },
        setSsoLogin: function (obj) {
            var self = this;
            var url = this.getSsoUrl("set", obj);
            var tr = $("#ssoLogin tr").length;
            self.model.loadResource(url, function () {
                if (typeof (setSsoLogin) != "undefined" && setSsoLogin.code == "S_OK") {
                    console.log(setSsoLogin)
                    top.M139.UI.TipMessage.show(self.model.messages.cancelSsoOrder, { delay: 2000 });
                    if (tr < 3) {
                        $("#ssoLogin").remove();
                    } else {
                        $(obj.target).parents("tr").remove();
                    }
                }
            });
        },
        submitSsoLogin: function () {
            var self = this;
            $("#ssoLogin").click(function (e) {
                var target = e.target;
                var type = $(target).attr("clientid");
                var obj = {
                    target: target,
                    clientid: type

                }
                if (type) {
                    self.setSsoLogin(obj);
                }
            });
        },
        render: function () {
            this.ssoLogin();
            return superClass.prototype.render.apply(this, arguments);
        },
        getTemplate: function (data) {
            var len = data.length;
            var arr = [];
            for (var i = 0; i < len; i++) {
                var html = ['<tr>',
                '<td class="td1">' + data[i].clientname + '</td>',
                '<td>',
                '<a clientid="' + data[i].clientid + '" href="javascript:;" title="取消授权">取消授权</a>',
                '</td>',
                '</tr>'].join("");
                arr.push(html);
            }
            var template = arr.join("");
            $("#ssoLogin tr:first").siblings().remove();
            $("#ssoLogin tr:first").after(template);
        }
    })
        );

    ssoLoginView = new M2012.Settings.SsoLogin.View();
    ssoLoginView.render();
})(jQuery, _, M139);

