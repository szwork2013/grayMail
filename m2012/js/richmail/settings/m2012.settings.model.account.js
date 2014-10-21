(function (jQuery, _, M139) {
    var $ = jQuery;
    M139.namespace('M2012.Settings.Model.Account', Backbone.Model.extend({
        defaults: {
            defaultAccount: "", //默认发件人帐号
            accounts: [],       //帐号列表
            userName: "",        //发件人姓名
            alias: "",          //别名
            fetionAlias: "",      //飞信别名

            isAliasSet: false    //是否已经设置过别名，设置过之后不能重新设
        },
        type: {
            bind: "1",
            unbind: "2"
        },
        accountType: {
            Mobile: "mobile",
            Alias: "common",
            Fetion: "fetion"
        },
        initialize: function () {

        },
        getUserData: function () {
            this.initData();
            return this.attributes;
        },
        initData: function () {
            var user = top.$User;
            if (user) {
                try {
                    var type = this.accountType;
                    var accounts = [];
                    var accountList = user.getAccountList() || [];           //获取帐号列表
                    var defaultAccount = user.getDefaultSender() || "";      //获取默认帐号
                    var alias = user.getAliasName() || "";                   //获取别名
                    var userName = user.getTrueName() || "";                 //获取发件人姓名
                    var fetionAlias = user.getAliasName(type.Fetion) || "";  //获取飞信别名
                    var typeMap = { common: 1, mobile: 2, fetion: 3 }
                    for (var index in accountList) {
                        var mail = accountList[index].name;
                        var accountType = accountList[index].type;
                        accountType = typeMap[accountType];
                        accounts.push({
                            text: mail,
                            myData: index,
                            type: accountType
                        });
                    }

                    this.set({
                        "defaultAccount": defaultAccount,
                        "userName": userName,
                        "alias": alias,
                        "fetionAlias": fetionAlias,
                        "accounts": accounts,

                        "isAliasSet": alias ? true : false //是否已经设置过别名
                    });
                }
                catch (e) {
                    e.cancel = true;
                }
            }
        },
        clientCheckAlias: function (alias) {
            var resultCode = 0;
            var userLevel = top.$User.getUserLevel();
            userLevel = userLevel == "0010" ? "0015" : userLevel; //兼容广东免费版用户 0010
            if (top.SiteConfig.moreAlias) {
                var obj = [
                { userLevel: "0015", text: "5" }, //免费版
                {userLevel: "0016", text: "4" }, //5元版
                {userLevel: "0017", text: "3"}//20元版
            ]
            } else {
                var obj = [
                { userLevel: "0015", text: "5" }, //免费版
                {userLevel: "0016", text: "5" }, //5元版
                {userLevel: "0017", text: "5"}//20元版
            ]
            };
            for (var i = 0; i < obj.length; i++) {
                if (userLevel == obj[i].userLevel) {
                    if ($.trim(alias) == "") {
                        resultCode = 0; //空是允许的
                    }
                    else if (/\s/.test(alias) ||                 //空格
                /[^A-Za-z0-9_\-\.]/.test(alias)) {  //其他字符
                        resultCode = 1;
                    }
                    else if (/^[^A-Za-z]\w*/.test(alias)) {
                        resultCode = 2; //开头非字母
                    }
                    else if (alias.length < parseInt(obj[i].text) || alias.length > 15) {
                        resultCode = 3;
                    }
                    var text = "别名帐号为" + obj[i].text + "-15个字符，以英文字母开头";
                }
            }
            var message = [
                    "您自定义的别名可以使用",
                    "别名支持字符范围：0~9,a~z,“.”,“_”,“-”",
                    "必须以英文字母开头",
                    text
            ];
            if(!parent.$User.isChinaMobileUser()){
            	message = [
                    "您自定义的邮箱帐号可以使用",
                    "邮箱帐号支持字符范围：0~9,a~z,“.”,“_”,“-”",
                    "必须以英文字母开头",
                    text
            	];
            }

            if (resultCode == 0) {
                return { code: "S_OK", msg: message[resultCode] };
            }
            else {
                return { code: "FA_FALSE", msg: message[resultCode] };
            }
        },
        serverCheckAlias: function (alias, callback) {
            var data = { "alias": alias };
            M139.RichMail.API.call("user:checkAliasAction", data, function (response) {
                callback(response.responseData);
            });
        },
        setDefaultAccount: function (account, type, callback) {
            parent.$User.setDefaultSender(account, type, callback);
            this.set("defaultAccount", account);
        },
        update: function (data, callback) {
            var _this = this;
            var isSet = this.get("isAliasSet");     //是否已经设置过别名
            // todo tkh
            //isSet = false;
            var alias = $.trim(this.get("alias"));
            var isNull = alias.length <= 0 ? true : false; //检查别名是否未填写
            M139.RichMail.API.call("user:updateAliasAction", data, function (response) {
                callback(response.responseData);
                //window.console && console.log(data, isSet, alias, response);
                //_this.setDefaultAccount( parent.$App.getAccountWithLocalDomain(alias) );
            });
        },
        fail: function(errObj) {
            this.set({"serverexception": errObj});
        }
    })
    );

})(jQuery, _, M139);