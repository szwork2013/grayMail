/**
* @fileOverview 定义设置页添加代收邮件第三步.
*/
/**
*@namespace 
*设置页代收邮件第三步
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.Pop.View.Step3', superClass.extend(
    /**
    *@lends PopStep3View.prototype
    */
        {
        initialize: function () {
            var sid = $T.Url.queryString("sid");
            $("#goBack").attr("href", function () {
                return "pop.html?sid=" + sid;
            })
            this.model = new M2012.Settings.Pop.Model();
            this.initEvents();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        /**
        *非主流邮箱添加代收的操作
        */
        setPopThirdStep: function (thisParent, obj) {
            var self = this;
            this.model.setPOPAccount(function (dataSource) {
                if (dataSource["code"] == "S_OK") {
                    obj.popId = dataSource["var"]["popId"];
                    top.$App.trigger("userAttrChange", { callback: function () {
                        top.$App.trigger('reloadFolder', { reload: true });
                    }
                    })
                    $("body").html(self.model.addSuccessHtml(obj.username, obj.folderName));
                    M139.registerJS("M2012.Settings.Pop.View.Success", "richmail/settings/m2012.settings.pop.view.success.js?v=" + Math.random());
                    M139.requireJS(['M2012.Settings.Pop.View.Success'], function () {
                        var popSuccessView = new M2012.Settings.Pop.View.Success(obj);
                    });
                } else {
                    var num = self.model.get("num");
                    thisParent.find(".loadingtext").remove();
                    thisParent.find(".btnNormal").show().eq(0).addClass("btngray");
                    if (num < 3) {//前三次验证不成功提示的文字信息
                        var text = self.model.messages.maybeDueTo;
                    } else {//3次验证不成功之后提示的文字信息
                        var text = self.model.messages.autoForwardText;
                    }
                    $("#popUsername").val(obj.username);
                    $("#popUsername").after(self.model.getTips(text));
                    thisParent.parent().parent().find("input").removeAttr("disabled");
                    $("#popStep li:last").removeClass("on");
                    $("#popStep li:first").addClass("on");
                }
            })
        },
        /**
        *获取组装报文的数据
        *判断出错的类型显示提示信息
        */
        checkPopThirdStep: function () {
            var self = this;
            $("#btn_third_step").live("click", function () {
                var username = $("#popUsername");
                var password = $("#popPassword");
                var usernameVal = username.val();
                var passwordVal = password.val();
                var usernameText = self.model.messages.usernameNull;
                var passwordText = self.model.messages.passwordNull;
                var num = self.model.get("num");
                var pop = $("#popPop");
                var port = $("#popPort");
                var thisParent = $(this).parent();
                var popVal = pop.val();
                var portVal = port.val();
                var popText = self.model.messages.popNull;
                var portText = self.model.messages.portNull;
                var ssl = $("#isSsl").attr("checked") ? 1 : 0;
                var popType = $("#imap").attr("checked") ? 1 : 0;
                thisParent.parent().parent().find(".yellowtips").remove();
                self.model.inputIsNull(pop, popVal, popText, $(this));
                self.model.inputIsNull(port, portVal, portText, $(this));
                self.model.inputIsNull(username, usernameVal, usernameText, $(this));
                self.model.inputIsNull(password, passwordVal, passwordText, $(this));
                self.model.usernameIsError(username, usernameVal, $(this));
                self.model.portIsError(port, portVal, $(this));

                if ($(this).hasClass("btngray")) {
                    return
                }
                $(this).next().hide();
                $(this).hide();
                thisParent.append(self.model.messages.loadingText);
                var folderName = self.model.createFolderName(usernameVal);
                var obj = {
                    "num": self.model.get("num") + 1,
                    "opType": "add",
                    "server": popVal,
                    "port": parseInt(portVal),
                    "isSSL": ssl,
                    "username": usernameVal,
                    "password": passwordVal,
                    "folderName": folderName,
                    "popType": popType
                }
                self.model.set(obj)

                self.setPopThirdStep(thisParent, obj);
            })
        },
        /**
        *事件处理
        */
        initEvents: function () {
            this.checkPopThirdStep();
        }
    })
    );
})(jQuery, _, M139);

