/**
* @fileOverview 定义设置页添加代收邮件第一步.
*/
/**
*@namespace 
*设置页代收邮件第一步
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.Pop.View.Step1', superClass.extend(
    /**
    *@lends PopStep1View.prototype
    */
    {
    initialize: function () {
        this.model = new M2012.Settings.Pop.Model();
        this.initEvents();
        return superClass.prototype.initialize.apply(this, arguments);
    },
    getTop: function () {
        var topWindow = M139.PageApplication.getTopAppWindow();
        return topWindow;
    },
    goBack: function () {
        var sid = $T.Url.queryString("sid");
        $("#goBack").live("click", function () {
            location.href = "pop.html?sid=" + sid;
            return false;
        })
    },
    /**
    *主流邮箱添加代收的操作
    */
    setPOPAccount: function (thisParent, obj) {
        var self = this;
        this.model.setPOPAccount(function (dataSource) {
            if (dataSource["code"] == "S_OK") {
                top.BH("set_add_pop_save_success");
                //读取邮箱的域，判断是否显示显示下面的导入通讯录html add by zhangsixue
                var domain = top.$Email.getDomain(obj.username);
                // console.log(domain + "123" + obj.username + "a" + obj.flag);
                var htmlContact = "";
                //暂时不要通讯录，所以不用判断是否需要加入导入通讯录的问题
                /* if (self.model.isContactCanBeImport(domain)) {
                htmlContact = self.model.inputContacts();
                }*/
                obj.popId = dataSource["var"]["popId"];
                top.$App.trigger("userAttrChange", { callback: function () {
                    top.$App.trigger('reloadFolder', { reload: true });
                }
                })
                $("body").html(self.model.addSuccessHtml(obj.username, obj.folderName, htmlContact));
                M139.registerJS("M2012.Settings.Pop.View.Success", "richmail/settings/m2012.settings.pop.view.success.js?v=" + Math.random());
                M139.requireJS(['M2012.Settings.Pop.View.Success'], function () {
                    var popSuccessView = new M2012.Settings.Pop.View.Success(obj);
                });
            }
            if (dataSource["code"] == "FA_XXXX_EXISTS" || dataSource["code"] == "FA_ACCOUNT_EXISTS") {
                self.getTop().$Msg.alert(
                        self.model.messages.mailAddrExist,
                        {
                            dialogTitle: "系统提示",
                            icon: "warn",
                            onclose: function () {
                                $("#addPopForm").html(self.getUsernameAndPassHtml() + self.getSureHtml());
                                $("#popUsername").focus();
                            }
                        })
                return;
            } else {
                //var text = self.model.messages.maybeDueTo;
                //thisParent.html(self.model.messages.btnGray);
                //$("#popUsername").after(self.model.getTips(text));
                //thisParent.parent().parent().find("input").removeAttr("disabled");
                //$("#popStep li:last").removeClass("on");
                //$("#popStep li:first").addClass("on");
                $("#addPopForm").html(self.model.getThirdStepHtml(obj));
                M139.registerJS("M2012.Settings.Pop.View.Step3", "richmail/settings/m2012.settings.pop.view.step3.js?v=" + Math.random());
                M139.requireJS(['M2012.Settings.Pop.View.Step3'], function () {
                    var popStep3View = new M2012.Settings.Pop.View.Step3();
                });
                var num = self.model.get("num");
                thisParent.find(".btnNormal").eq(0).addClass("btngray");
                var text = self.model.messages.maybeDueTo;
                $("#popUsername").val(obj.username);
                $("#popPassword").focus();
                $("#popUsername").after(self.model.getTips(text));
                thisParent.parent().parent().find("input").removeAttr("disabled");
                $("#popStep li:last").removeClass("on");
                $("#popStep li:first").addClass("on");
            }
        })
    },
    /**
    *获取组装报文的数据
    *主流邮箱和非主流邮箱的判断和对应的逻辑处理
    */
    checkPopAccount: function () {
        var self = this;
        $("#btn_first_step").live("click", function () {
            var username = $("#popUsername");
            var password = $("#popPassword");
            var thisParent = $(this).parent();
            var usernameVal = username.val();
            var passwordVal = password.val();
            var autoReceive = $("#checkboxGet").attr("checked") == "checked" ? 1 : 0; //add by zhangsixue
            var usernameText = self.model.messages.usernameNull;
            var passwordText = self.model.messages.passwordNull;
            var domain = top.$Email.getDomain(usernameVal);
            var folderName = self.model.createFolderName(usernameVal);
            self.model.inputIsNull(username, usernameVal, usernameText, $(this));
            self.model.inputIsNull(password, passwordVal, passwordText, $(this));
            self.model.usernameIsError(username, usernameVal, $(this));
            var accountList = top.$User.getAccountList();
            for (var i = 0; i < accountList.length; i++) {
                if (usernameVal == accountList[i]["name"]) {
                    self.getTop().$Msg.alert(
                        "您不能设置当前邮箱的帐户！",
                        {
                            dialogTitle: "系统提示",
                            icon: "warn"
                        });
                    return;
                }
            }
            if ($(this).hasClass("btngray")) {
                return;
            }
            thisParent.parent().parent().find(".yellowtips").remove();
            thisParent.html(self.model.messages.loadingText);
            thisParent.parent().parent().find("input").attr("disabled", "disabled");
            $("#popStep li:first").removeClass("on");
            $("#popStep li:last").addClass("on");
            var pop = $("#imap").attr("checked") ? "imap" : "pop";
            if(top.publicKey){
				//产生密码。
				var key	= new RSAKeyPair("10001", '', top.publicKey); 
				//对密码加密。
				passwordVal = encryptedString(key, passwordVal);	
            }
            var obj = {
                "opType": "add",
                "server": pop + "." + domain,
                "username": usernameVal,
                "password": passwordVal,
                "folderName": folderName,
                "autoReceive": autoReceive,
                "flag": self.model.get("flag")
            };
            var mainstreamMail = self.model.mainstreamMail;
            var mainstreamLen = mainstreamMail.length;
            for (var n = 0; n < mainstreamLen; n++) {
                var mail = mainstreamMail[n]["mail"];
                if (domain == mail) {
                    if (mainstreamMail[n][pop]) {
                        obj.server = mainstreamMail[n][pop];
                    }
                }
            }
            switch (domain) {
                case "sohu.com":
                    obj.server = "Pop3.sohu.com";
                    break;
                case "yahoo.cn":
                    obj.server = "Pop.mail.yahoo.cn";
                    break;
                case "yahoo.com.cn":
                    obj.server = "Pop.mail.yahoo.com.cn";
                    break;
                case "263.net":
                    obj.server = "263.net";
                    break;
                case "263.net.cn":
                    obj.server = "263.net.cn";
                    break;
            }
            self.model.set(obj);
            if (autoReceive == 1) {
                BH({ key: 'set_pop_auto' });
            }
            if (self.model.isMainstream(domain)) {//主流邮箱
                self.setPOPAccount(thisParent, obj);
            } else {//非主流邮箱
                $("#addPopForm").html(self.getNonmainstreamHtml(usernameVal, passwordVal, autoReceive));
                $("#popPop").focus();
                M139.registerJS("M2012.Settings.Pop.View.Step2", "richmail/settings/m2012.settings.pop.view.step2.js?v=" + (+new Date()));
                M139.requireJS(['M2012.Settings.Pop.View.Step2'], function () {
                    var popStep2View = new M2012.Settings.Pop.View.Step2();
                });
            }
        });
    },
    /**
    *检验用户输入的信息
    */
    checkForm: function (obj, messages) {
        var self = this;
        obj.live("blur", function () {
            var username = $("#popUsername");
            var usernameId = username.attr("id");
            var port = $("#popPort");
            var portId = port.attr("id");
            var objId = $(this).attr("id");
            var This = $(this);
            var btn = This.parent().parent().parent().find(".btnNormal").eq(0);
            var val = This.val();
            var thisParent = $(this).parent().parent().parent();
            $("#addPopForm").find(".btnNormal").removeClass("btngray");
            thisParent.find(".yellowtips").remove();
			var poporimap = $("#popText").text().replace("：","");
			var messages2 = poporimap + messages;
            self.model.inputIsNull(This, val, messages2, btn);
            if (username.length > 0) {
                if (usernameId == objId) {
                    self.model.usernameIsError(This, val, btn);
                }
            }
            if (port.length > 0) {
                if (portId == objId) {
                    self.model.portIsError(This, val, btn);
                }
            }
        })
    },
    /**
    *事件处理
    */
    initEvents: function () {
        this.goBack();
        var username = $("#popUsername");
        var password = $("#popPassword");
        var pop = $("#popPop");
        var port = $("#popPort");
        var usernameText = this.model.messages.usernameNull;
        var passwordText = this.model.messages.passwordNull;
        var popText = this.model.messages.popNull;
        var portText = this.model.messages.portNull;
        this.checkPopAccount();
        this.checkForm(username, usernameText);
        this.checkForm(password, passwordText);
        this.checkForm(pop, popText);
        this.checkForm(port, portText);
        this.getPortCon();
        this.getPortText("popSelect", 110, 0);
        this.getPortText("imapSelect", 143, 1);
        this.getSsl();
    },
    getPortCon: function () {
        $("#setPort").live("click", function () {
            var This = $(this);
            var hasClass = $("#portLine").hasClass("hide");
            var portLine = $("#portLine");
            //点击了存储方式后不能移除灰色 edit by zhangsixue
            //    $(".btnNormal").removeClass("btngray");
            if (hasClass) {
                This.find("i").attr("class", "i_th1");
                portLine.removeClass("hide");
            } else {
                This.find("i").attr("class", "i_th0");
                portLine.addClass("hide");
            }
        })
    },
    getPortText: function (obj, port, type) {
        var self = this;
        $("#" + obj).live("click", function () {
            var mailAddr = $("#mailAddr");
            var popUsername = $("#popUsername");
            var popPop = $("#popPop");
            var popPort = $("#popPort");
            var popText = $("#popText");
            var isSsl = $("#isSsl");
            var domain1 = top.$Email.getDomain(mailAddr.text());
            var domain2 = top.$Email.getDomain(popUsername.val());
            $(".btnNormal").removeClass("btngray");
            popPort.val(port);
            if (isSsl.attr("checked")) {
                port = type == 1 ? 993 : 995;
                popPort.val(port);
            };
            var value = type == 1 ? "IMAP：" : "POP：";
            var text = type == 1 ? "imap." : "pop.";
            if (domain1 != "") {
                popPop.val(text + domain1);
            }
            if (domain2 != "") {
                popPop.val(text + domain2);
            }
            if (popText) {
                popText.text(value);
            }
            self.model.set({
                "port": port,
                "popType": type
            });
        })
    },
    getSsl: function () {
        $("#isSsl").live("click", function () {
            var popText = $("#popText");
            var isSsl = $("#isSsl");
            var objImap = $("#imap");
            var type = objImap.attr("checked") ? 1 : 0;
            if (isSsl.attr("checked")) {
                var port = type == 1 ? 993 : 995;
                $("#popPort").val(port);
            } else {
                var port = type == 1 ? 143 : 110;
                $("#popPort").val(port);
            }
        })
    },
    /**
    *邮箱和密码输入框HTML
    */
    getUsernameAndPassHtml: function () {
        var html = ['<li class="formLine">',
            '<label class="label">要代收的邮箱：</label>',
            '<div class="element p_relative">',
            '<input type="text" id="popUsername" focus value="" class="iText">',
            '</div>',
            '</li>',
            '<li class="formLine ">',
            '<label class="label">邮箱密码：</label>',
            '<div class="element p_relative">',
            '<input type="password" id="popPassword" value="" class="iText">',
            '</div>',
            '</li>',
            '<li class="formLine">',
            '<label class="label" >代收方式：</label>',
            '<div class="element">',
            '<label hidefocus=true for="pop" class="mr_10" id="popSelect"><input type="radio" name="server" id="pop" value="" checked class="mr_5" />POP</label> <label hidefocus=true for="imap" id="imapSelect"><input class="mr_5" name="server" type="radio" id="imap" value="" />IMAP</label>',
            '</div>',
            '</li>',
            '<li class="formLine">',
            '<label class="label">&nbsp;</label>',
            '<div class="element">',
            '<a href="javascript:void(0)" hidefocus=true id="setPort"><span class="mr_5">端口设置</span><i class="i_th0"></i><!-- i_th1 --></a>',
            '</div>',
            '</li>',
            '<li class="formLine hide" id="portLine">',
            '<label class="label">端口：</label>',
            '<div class="element p_relative">',
            '<input id="popPort" type="text" class="iText" value="110"/>',
            '</div>',
            '</li>',
            '<li class="formLine">',
                '<label class="label">收取设置：</label>',
                '<div class="element">',
                   '<input type="checkbox" value="1" id="checkboxGet" class="mr_5"><label for="checkboxGet" class="mr_10">自动收取</label>',
                '</div>',
            '</li>'].join("");
        return html;
    },
    /**
    *确定按钮HTML
    */
    getSureHtml: function () {
        var html = ['<li class="formLine">',
            '<label class="label"></label>',
            '<div class="element">',
            '<a class="btnNormal " href="javascript:void(0)" id="btn_first_step"><span>确 定</span></a>',
            '</div>',
            '</li>'].join("");
        return html;
    },
    /**
    *非主流邮箱代收设置的初始HTML
    */
    getNonmainstreamHtml: function (username, password, autoReceive) {
        var popChecked = "";
        var imapChecked = "";
        var port = "";
        var popText = "";
        var popType = this.model.get("popType");
        var autoReceive = autoReceive == 1 ? "checked = 'checked'" : "";
        if (popType == 1) {
            imapChecked = "checked";
            popText = "IMAP：";
            port = 143;
        } else {
            popChecked = "checked";
            popText = "POP：";
            port = 110;
        }
        var html = ['<li class="formLine">',
            '<label class="label">要代收的邮箱：</label>',
            '<div class="element p_relative" id="mailAddr">',
            username,
            '<input type="hidden" id="popPassword" value="',
            password,
            '" />',
            '</div>',
            '</li>',
            '<li class="formLine">',
            '<label class="label" >代收方式：</label>',
            '<div class="element">',
            '<label for="pop" class="mr_10" id="popSelect"><input type="radio" name="server" id="pop" value="" ' + popChecked + ' class="mr_5" />POP</label> <label for="imap" id="imapSelect"><input class="mr_5" name="server"' + imapChecked + ' type="radio" id="imap" value="" />IMAP</label>',
            '</div>',
            '</li>',
            '<li class="formLine">',
            '<label class="label" id="popText">' + popText + '</label>',
            '<div class="element p_relative">',
            '<input type="text" name="pop"  id="popPop" class="iText" value="" />',
            '</div>',
            '</li>	',
            '<li class="formLine">',
            '<label class="label">端口：</label>',
            '<div class="element p_relative">',
            '<input type="text" id="popPort"  class="iText" value="' + port + '" />',
            '</div>',
            '</li>	',
            '<li class="formLine">',
                '<label class="label">收取设置：</label>',
                '<div class="element">',
                   '<input type="checkbox" value="1" id="checkboxGet" '+ autoReceive +' class="mr_5"><label for="checkboxGet" class="mr_10">自动收取</label>',
                '</div>',
            '</li>',
            '<li class="formLine">',
            '<label class="label"></label>',
            '<div class="element">',
            '<div class="gray">标准端口号为110</div>',
            '<div ><label hidefocus=true for="isSsl"><input type="checkbox" value="" id="isSsl" class="mr_5" />此服务器要求加密连接(SSL)</label></div>',
            '<a href="javascript:void(0)" class="btnNormal" id="btn_second_step"><span>确 定</span></a> <a href="javascript:void(0)" class="btnNormal" id="prevStep"><span>上一步</span></a>					',
            '</div>',
            '</li>'].join("");
        return html;
    },
    changeOptions: function () {

    }
})
    );
popStep1View = new M2012.Settings.Pop.View.Step1();
})(jQuery, _, M139);


