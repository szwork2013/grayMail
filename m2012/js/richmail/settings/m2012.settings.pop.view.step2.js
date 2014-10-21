/**
* @fileOverview 定义设置页添加代收邮件第二步.
*/
/**
*@namespace 
*设置页代收邮件第二步
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.Pop.View.Step2', superClass.extend(
    /**
    *@lends PopStep2View.prototype
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
    setPopPort: function (thisParent, obj) {
        var self = this;
        this.model.setPOPAccount(function (dataSource) {
            if (dataSource["code"] == "S_OK") {
                top.BH("set_add_pop_save_success");
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
                $("#addPopForm").html(self.model.getThirdStepHtml(obj));
                M139.registerJS("M2012.Settings.Pop.View.Step3", "richmail/settings/m2012.settings.pop.view.step3.js");
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
    *判断出错的类型显示提示信息
    */
    checkPopPort: function () {
        var self = this;
        $("#btn_second_step").live("click", function () {
            var num = self.model.get("num");
            var pop = $("#popPop");
            var port = $("#popPort");
            var thisParent = $(this).parent();
            var popVal = pop.val();
            var portVal = port.val();
            portVal = parseInt(portVal);
            var popText = self.model.messages.popNull;
            var portText = self.model.messages.portNull;
            var ssl = $("#isSsl").attr("checked") ? 1 : 0;
            var popType = $("#imap").attr("checked") ? 1 : 0;
            thisParent.parent().parent().find(".yellowtips").remove();
            self.model.inputIsNull(pop, popVal, popText, $(this));
            self.model.inputIsNull(port, portVal, portText, $(this));
            self.model.portIsError(port, portVal, $(this));
            if ($(this).hasClass("btngray")) {
                return
            }
            $(this).next().remove();
            $(this).remove();
            thisParent.append(self.model.messages.loadingText);
            thisParent.parent().parent().find("input").attr("disabled", "disabled");
            $("#popStep li:first").removeClass("on");
            $("#popStep li:last").addClass("on");
            var usernameVal = $("#mailAddr").text();
            var passwordVal = $("#popPassword").val();
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
            self.setPopPort(thisParent, obj);
        })
    },
    /**
    *上一步
    */
    prevStep: function () {
        var self = this;
        var username = $("#mailAddr").text();
        $("#prevStep").live("click", function () {
            var port = $("#popPort").val();
            var pop = $("#pop").attr("checked") ? "checked" : "";
            var imap = $("#imap").attr("checked") ? "checked" : "";
            var autoReceive = $("#checkboxGet").attr("checked") ? "checked" : "";
            var json = {
                username: username,
                port: port,
                pop: pop,
                imap: imap,
                autoReceive: autoReceive
            }
            $("#addPopForm").html(self.getUsernameAndPassHtml(json) + self.getSureHtml());
            self.model.set({
                "num": 0
            })
        })
    },
    /**
    *事件处理
    */
    initEvents: function () {
        this.checkPopPort();
        this.prevStep();
    },
    /**
    *邮箱和密码输入框HTML
    */
    getUsernameAndPassHtml: function (json) {
        var html = ['<li class="formLine">',
            '<label class="label">要代收的邮箱：</label>',
            '<div class="element p_relative">',
            '<input type="text" id="popUsername" value="',
            json.username,
            '" class="iText">',
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
            '<label hidefocus=true for="pop" class="mr_10" id="popSelect"><input type="radio" name="server"'+json.pop+' id="pop" value="" class="mr_5" />POP</label> <label hidefocus=true for="imap" id="imapSelect"><input class="mr_5" name="server"'+json.imap+' type="radio" id="imap" value="" />IMAP</label>',
            '</div>',
            '</li>',
            '<li class="formLine">',
            '<label class="label">&nbsp;</label>',
            '<div class="element">',
            '<a href="javascript:void(0)" hidefocus=true id="setPort"><span class="mr_5">端口设置</span><i class="i_th0"></i><!-- i_th1 --></a>',
            '</div>',
            '</li>',
            '<li class="formLine">',
                '<label class="label">收取设置：</label>',
                '<div class="element">',
                   '<input type="checkbox" value="1" id="checkboxGet" ' + json.autoReceive + ' class="mr_5"><label for="checkboxGet" class="mr_10">自动收取</label>',
                '</div>',
            '</li>',
            '<li class="formLine hide" id="portLine">',
            '<label class="label">端口：</label>',
            '<div class="element">',
            '<input id="popPort" type="text" class="iText" value="'+json.port+'"/>',
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
    changeOptions: function () {

    }
})
    );
})(jQuery, _, M139);

