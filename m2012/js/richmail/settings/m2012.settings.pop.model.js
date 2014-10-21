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
