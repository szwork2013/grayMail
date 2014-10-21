/**
* @fileOverview 定义设置页基本参数的文件.
*/
(function (jQuery, _, M139) {
    /**
    *@namespace 
    *设置页基本参数
    */
    M139.namespace('M2012.Settings.Pop.Model', Backbone.Model.extend(
    /**
    *@lends M2012.Settings.Pop.Model.prototype
    */
    {
    defaults: {
        folder: null, //保存初始状态下的文件夹名字 用于和修改后的文件夹名进行对比
        num: 0,
        server: null,
        port: 110,
        username: "",
        password: null,
        timeout: 90,
        isSSL: 0,
        leaveOnServer: 1,
        folderName: null,
        opType: null, //check  验证 
        id: null,
        fid: null,
        popType: 0,
        obj: null, //修改设置时用来还原初始数据
        autoReceive: 1, //add by zhangsixue 0为手动 1为自动.
        flag: 0 // 代收邮件范围0 全部,1 7天内,2 30天内.

    },
    callApi: M139.RichMail.API.call,
    getTop: function () {
        return M139.PageApplication.getTopAppWindow();
    },
    /**
    *主流邮箱信息
    */
    mainstreamMail: [
            { mail: "163.com" },
            { mail: "126.com" },
            { mail: "yeah.net" },
            { mail: "139.com" },
            { mail: "sohu.com", pop: "Pop3.sohu.com" },
            { mail: "tom.com" },
            { mail: "189.com" },
            { mail: "gmail.com" },
            { mail: "sina.com.cn" },
            { mail: "sina.cn" },
            { mail: "sina.com" },
            { mail: "hotmail.com" },
            { mail: "sougou.com" },
            { mail: "qq.com" },
            { mail: "yahoo.com" },
            { mail: "yahoo.cn", pop: "Pop.mail.yahoo.cn", imap: "imap.mail.yahoo.cn" },
            { mail: "yahoo.com.cn", pop: "Pop.mail.yahoo.com.cn", imap: "imap.mail.yahoo.com" },
            { mail: "eyou.com" },
            { mail: "263.com" },
            { mail: "263.net", pop: "263.net" },
            { mail: "263.net.cn", pop: "263.net.cn" },
            { mail: "wo.com.cn" }

        ],
    //支持迁移通讯录的邮箱 add by zhangsixue
    contactCanBeImport: ["163.com", "126.com", "yeah.net", "21cn.com", "yahoo.com.cn", "yahoo.cn"],
    isContactCanBeImport: function (pop) {
        if ($.inArray(pop, this.contactCanBeImport) > -1) {
            return true;
        }
        return false;
    },
    /**
    *是否主流邮箱的判断
    */
    isMainstream: function (pop) {
        var len = this.mainstreamMail.length;
        for (var i = 0; i < len; i++) {
            var mail = this.mainstreamMail[i]["mail"];
            if (pop == mail) {
                return true;
            }
        }
    },
    /**
    *邮件代收提示文字
    */
    messages: {
        usernameError: "格式错误，如：test@example.com",
        portError: "端口为正整数",
        usernameNull: "代收邮件帐号不能为空，请重新输入",
        passwordNull: "密码不能为空",
        popNull: "不能为空",
        delPOPSuccess: "{0}代收邮箱已删除",
        delPOPFail: "代收邮箱删除失败，请重试",
        portNull: "端口不能为空",
        loadingText: '<div class="loadingtext"><img class="mr_5" src="/m2012/images/global/loading.gif" width="16" height="16" />正在验证代收邮箱帐户...</div>',
        btnGray: '<a href="javascript:void(0)" id="btn_first_step" class="btnNormal btngray"><span>确 定</span></a>',
        btnGrayAndPrevStep: '<a href="javascript:void(0)" id="btn_sure" class="btnNormal btngray"><span>确 定</span></a> <a href="javascript:void(0)" class="btnNormal" id="prevStep"><span>上一步</span></a>',
        usernameAndPasswordNotMatch: "验证失败，邮箱地址和密码<strong>不匹配",
        maybeDueTo: '<strong>验证失败</strong>，原因可能是：<br>1.邮箱地址和密码不匹配；<br>2.pop地址不正确或端口打不开；<br>3.需要在代收邮箱的设置中手动开启POP功能。',
        autoForwardText: '建议您在要代收的邮箱设置“自动转发”，<br>把邮件转发到139邮箱。',
        getMailHtml: '<img src="/m2012/images/global/loading.gif" width="16" height="16" /> 收取中{0}/{1}',
        waitForReceive: '等待收取',
        getingMailHtml: '<a href="javascript:;">收取</a>',
        lockedFolder: '您要删除的是加锁文件夹，请解除加锁后再进行删除',
        getCode: '获取短信验证码',
        reGetCode: '60秒后可重新获取',
        maxsMailsNum: '代收邮箱不能超过8个',
        mailAddrExist: '代收邮箱地址已经存在'
    },
    createFolderName: function (usernameVal) {//有重复代收文件夹名字时在后面自动加上数字   xx   xx1   xx2  xx3
        var folderName = top.$Email.getDomain(usernameVal);
        folderName = folderName.split(".")[0];
        folderName = folderName + "邮箱";
        var data = top.$App.getFolders("pop");
        var len = data.length;
        var arrFolder = [];
        for (var i = 0; i < len; i++) {
            arrFolder.push(data[i].name);
        }
        arrFolder.sort();
        for (var i = 0; i < len; i++) {
            if (arrFolder[i] == folderName) {
                var arr = folderName.match(/\D|\d*/g);
                console.log(arr)
                var arrLen = arr.length;
                var num = arr[arrLen - 2];
                var m = isNaN(num) ? 0 : parseInt(num);
                var n = m + 1;
                if (isNaN(num)) {
                    arr[arrLen - 1] = 1;
                } else {
                    arr[arrLen - 2] = n;
                }
                folderName = arr.join("");

            }
        }
        return folderName
    },
    /**
    *邮件代收提示框
    */
    getTips: function (text) {
        var html = ['<div class="tips yellowtips" style="left:214px;top:0px;">',
            '<div class="tips-text">',
            text,
            '</div>',
            '<div class="tipsLeft diamond"></div>',
            '</div>'].join("");
        return html;
    },
    /**
    *端口格式不对的判断和提示
    */
    portIsError: function (This, portVal, btn) {
        var isNum = /^\d+$/.test(portVal);
        if (!isNum) {
            var text = this.messages.portError;
            This.after(this.getTips(text));
            btn.addClass("btngray");
            return
        }
    },
    /**
    *邮箱地址格式不对的判断和提示
    */
    usernameIsError: function (This, usernameVal, btn) {
        if (!$Email.isEmail(usernameVal)) {
            var text = this.messages.usernameError;
            This.after(this.getTips(text));
            btn.addClass("btngray");
            return
        }
    },
    /**
    *输入框为空的判断和提示
    */
    inputIsNull: function (This, val, text, btn) {
        if (val == "") {
            This.after(this.getTips(text));
            btn.addClass("btngray");
            return
        }
    },
    getPOPAccounts: function (callback) {
        var self = this;
        var options = {
            status: 1
        };
        $RM.getPOPAccounts(options, function (result) {
            callback(result);
        });
    },
    // add by zhangsixue 根据id回调账户
    getPOPAccountsById: function (options, callback) {
        $RM.getPOPAccounts(options, function (result) {
            callback(result);
        });
    },
    /**
    *获取代收文件夹的数据
    */
    setPOPAccount: function (callback) {
        var self = this;
        var options = {
            item: {
                opType: this.get("opType"),
                popType: this.get("popType"),
                server: this.get("server"),
                port: this.get("port"),
                username: this.get("username"),
                password: this.get("password"),
                timeout: this.get("timeout"),
                isSSL: this.get("isSSL"),
                folderName: this.get("folderName"),
                fid: 0,
                id: -1,
                isAutoPOP: this.get("autoReceive"),
                leaveOnServer: 1,
                flag: this.get("flag")
            },
            updateDelegatedSend: true,
            autoCreate: true
        }
        $RM.setPOPAccount(options, function (result) {
            callback(result);
        });
    },
    refreshPopList: function (options, type, result) {
        if (result["code"] == "S_OK") {
            var self = this;
            var popId = result["var"]["popId"] || options.id;
            var obj = {
                email: (options["item"] && options["item"]["username"]) ? options["item"]["username"] : "",
                fid: "",
                location: "",
                popId: popId
            }
            self.getPopList(obj, type, function (data) {
                top.$App.registerConfig("PopList", data);
            });
        }
    },
    getPopList: function (obj, type, callback) {
        var self = this;
        self.getPOPAccounts(function (datasource) {
            var popList = top.$App.getConfig("PopList");
            var len = popList.length;
            var max = 0;
            var fid;
            if (type == "add") {
                $.each(popList, function (i, o) {
                    max = Math.max(max, o.location)
                });
                max = max + 200;
                $.each(datasource, function (i, o) {
                    if (obj.popId == o.id) {
                        fid = o.fid;
                    }
                });
                obj.fid = fid;
                obj.location = max;
                popList.push(obj)
            }
            if (type == "set") {
                $.each(popList, function (i, o) {
                    if (obj.popId == o.popId) {
                        popList[i].email = obj.email;
                    }
                });
            }
            if (type == "del") {
                $.each(popList, function (i, o) {
                    if (obj.popId == o.popId) {
                        popList.splice(o, 1)
                    }
                });
            }
            callback(popList)
        })
    },
    /**
    *收取代收邮件
    */
    syncPOPAccount: function (options, callback) {
        var self = this;
        $RM.syncPOPAccount(options, function (result) {
            callback(result);
            self.getTop().appView.trigger('reloadFolder', { reload: true });
        });
    },
    /**
    *修改代收邮件
    */
    modPOPAccount: function (options, callback) {
        var self = this;
        $RM.setPOPAccount(options, function (result) {
            callback(result);
            self.refreshPopList(options, "set", result);
        });
    },
    searchMessages: function (options, callback) {
        var self = this;
        this.callApi("global:sequential", { items: [
                { func: "mbox:searchMessages", "var": options },
                { func: "mbox:getSearchResult", "var": {} }
            ]
        }, function (res) {
            callback(res.responseData);
        });
    },
    //删除文件夹，将邮件移动到收件箱
    moveMessages: function (options, callback) {
        var self = this;
        $RM.moveMessages(options, function (result) {
            callback(result);
        });
    },
    /**
    *删除代收邮件
    */
    delPOPAccount: function (options, callback) {
        var self = this;
        $RM.setPOPAccount(options, function (result) {
            self.getTop().appView.trigger('reloadFolder', { reload: true });
            callback(result);
            self.refreshPopList(options, "del", result);
        });
    },
    /**
    *验证失败时显示的信息 首页和第三步验证都要用到
    */
    getThirdStepHtml: function (obj) {
        var popChecked = "";
        var imapChecked = "";
        var popText = "";
        var port = "";
        var sslChecked = "";
        var popType = this.get("popType");
        var isSSL = this.get("isSSL");
        var auto = obj.autoReceive == 1 ? "checked ='checked'" : '';
        sslChecked = isSSL == 1 ? "checked" : "";
        if (popType == 1) {
            imapChecked = "checked";
            popText = "IMAP：";
            port = isSSL == 1 ? 993 : 143;
        } else {
            popChecked = "checked";
            popText = "POP：";
            port = isSSL == 1 ? 995 : 110;
        }
        var html = ['<li class="formLine">',
            '<label class="label">要代收的邮箱：</label>',
            '<div class="element p_relative">',
            '<input type="text" id="popUsername" value="" class="iText">	',
            '</div>',
            '</li>',
            '<li class="formLine ">',
            '<label class="label">邮箱密码：</label>',
            '<div class="element p_relative">',
            '<input type="password" id="popPassword" value="" class="iText">		',
            '</div>',
            '</li>',
            '<li class="formLine">',
            '<label class="label" >代收方式：</label>',
            '<div class="element">',
            '<label for="pop" class="mr_10" id="popSelect"><input type="radio" name="server" id="pop" value="" ' + popChecked + ' class="mr_5" />POP</label> <label for="imap" id="imapSelect"><input class="mr_5" name="server"' + imapChecked + ' type="radio" id="imap" value="" />IMAP</label>',
            '</div>',
            '</li>',
            '<li class="formLine formLinebot">',
            '<label class="label" id="popText">' + popText + '</label>',
            '<div class="element p_relative">',
            '<input type="text"  id="popPop" value="' + obj.server + '" class="iText">',
            '</div>',
            '</li>	',
            '<li class="formLine">',
            '<label class="label">端口：</label>',
            '<div class="element p_relative">',
            '<input type="text" id="popPort" value="' + port + '" class="iText">',
            '</div>',
            '</li>	',
            '<li class="formLine">',
                '<label class="label">收取设置：</label>',
                '<div class="element">',
                   '<input type="checkbox" value="1" id="checkboxGet" ' + auto + ' class="mr_5"><label for="checkboxGet" class="mr_10">自动收取</label>',
                '</div>',
            '</li>',
            '<li class="formLine">',
            '<label class="label"></label>',
            '<div class="element">',
            '<div class="gray">标准端口号为110</div>',
            '<div><label hidefocus=true for="isSsl"><input type="checkbox"' + sslChecked + ' id="isSsl" class="mr_5" value="">此服务器要求加密连接(SSL)</label></div>',
            '<a class="btnNormal btngray" href="javascript:void(0)" id="btn_third_step"><span>确 定</span></a>	',
            '</div>',
            '</li>'].join("");
        return html;
    },
    getFolderName: function () {

    },
    /**
    *添加代收邮件成功HTML edit by zhangsixue
    */
    addSuccessHtml: function (username, folderName, inPutContacts) {
        var html = ['<div class="setWrap">	', '<div class="setArea">	',
            '<h2><i class="i_ok mr_5"></i><span class="c355c91"> ' + username + ' 设置成功</span></h2>',
            '<ul class="form setForm">',
            '<li class="formLine">',
            '<label class="label">收取邮件：</label>',
            '<div class="element ">',
            '<input maxlength="16" type="text" id="folderName" class="iText" value="' + folderName + '" style="width:100px;"> 文件夹',
            '</div>',
            '</li>',
            '<li class="formLine">',
                    '<label class="label">收取范围：</label>',
                    '<div class="element ">',
                        '<input type="radio" name="range1" checked="checked" value="0"  id="allMail">',
                         '<label for="allMail">全部邮件</label>',
                    '</div>',
                    '<div class="element ">',
                        '<input type="radio" name="range1" value="2" id="oneMonth">',
                         '<label for="oneMonth">最近一个月</label>',
                    '</div>',
                    '<div class="element ">',
                        '<input type="radio" name="range1" value="1" id="seven">',
                        '<label for="seven">最近七天</label>',
                   '</div>',
                '</li>',
                inPutContacts,
            '</ul>',
            '</div>',
            '</div>', '</div>',
            '<div class="setBtn">',
            '<span class="pl_20"><a href="javascript:void(0)" class="btnSetG" id="saveAndReceive"><span style="_width:100px;">保存并收取邮件</span></a></span>'].join("");
        return html;
    },
    //如果是163.com     126.com    yeah.net    sohu.com    21cn.com    yahoo.com.cn    yahoo.cn    ，则添加提示导入通讯录。 add by zhangsixue
    inputContacts: function () {
        var html = ['<li class="formLine">',
                    '<label class="label">导入通讯录：</label>',
                    '<div class="element ">',
                        '<input type="checkbox" name="checkbox" value="1" id="friend" checked="checked">',
                         '<label for="friend">导入联系人</label><span class="gray ml_20">保存至代收邮箱命名的新联系人分组</span>',
                    '</div>',
                '</li>'].join("");
        return html;
    },
    /**
    *修改文件夹命名
    */
    updateFolders: function (options, callback) {
        $RM.updateFolders(options, function (result) {
            callback(result);
        });
    }
})
);
})(jQuery, _, M139);

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



