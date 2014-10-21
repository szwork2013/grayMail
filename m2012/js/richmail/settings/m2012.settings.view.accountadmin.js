/**
 * @fileOverview 定义账号管理视图层
 */
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.View.AccountAdmin', superClass.extend({
        initialize: function () {
            this.model = new M2012.Settings.Model.AccountAdmin();
            this.accountModel = new M2012.Settings.Model.Account();
            this.alterTipMessages();
            this.render();
        },
        alterTipMessages: function () {
            var self = this;
            if (parent.$User.isChinaMobileUser()) {
                $("#applyAlias p.mb_5").html('<a href="javascript:void(0)" class="btnNormal"><span>申请别名帐号</span></a><span class="c_999">（使用别名帐号发邮件，保护手机号码隐私）</span>');
                $("#aliasAccount").siblings('label').text('别名帐号：');
                $("#setOnlyOneTime").text('别名帐号仅能设置一次，不可修改。');

            }
        },
        render: function () {
            var self = this;
            M139.Timing.waitForReady("top.$User.getAccountList().length", function () {
                self.model.initData();
                var accountType = self.model.accountType;
                // 根据用户拥有的账号类型呈现不同的UI
                function renderAccountList(id) {
                    //$("#"+id).show().siblings('li').hide();
                    if (id == 'noAliasAccount') {
                        $("#noAliasAccount").show();
                        $("#noMobileAccount").hide();
                        $("#hasAllAccount").hide();
                    } else if (id == 'noMobileAccount') {
                        $("#noMobileAccount").show();
                        $("#noAliasAccount").hide();
                        $("#hasAllAccount").hide();
                    } else {
                        $("#hasAllAccount").show();
                        $("#noMobileAccount").hide();
                        $("#noAliasAccount").hide();
                    }
                    $("#" + id + " tr:eq(0)").siblings().remove();
                    $("#" + id + " tr:eq(0)").after(self.getAccountsHtml());
                }
                switch (accountType) {
                    case 'noAliasAccount':
                        renderAccountList('noAliasAccount');
                        $("#applyAlias").prev('tr').find('td').addClass('bNone');
                        break;
                    case 'noMobileAccount':
                        renderAccountList('noMobileAccount');
                        break;
                    case 'hasAllAccount':
                        renderAccountList('hasAllAccount');
                        break;
                    default:
                        console.log('账号类型异常！accountType:' + accountType);
                        break;
                }
                // 为不同的UI界面绑定事件
                self.initEvents(accountType);
            });
        },
        initEvents: function (accountType) {
            var self = this;
            self._bindEventForPublic();
            if (accountType == 'hasAllAccount') {
            } else if (accountType == 'noMobileAccount') {
                self._bindEventForNoMobile();
            } else if (accountType == 'noAliasAccount') {
                self._bindEventForNoAlias();
            }
        },
        // 刷新界面 供顶部添加别名或者换号成功后调用 M2012.Settings.View.Account.Main
        reflush : function(){
            var self = this;
            self.model.initData();
            $("#hasAllAccount tr:gt(0)").remove();
            self.render();
        },
        showUpdateUser: function (target) {
            var popup = M139.UI.Popup.create({
                target: target,
                icon: "i_warn",
                //width: 300,
                buttons: [{
                    text: "立即查看详情", click: function () {
                        popup.close();
                    }
                },
                    { text: "取消", click: function () { popup.close(); } }
                ],
                content: accountSetting.account.template.popUpdateUser
            });
            popup.render();
            var btnNormal = popup.contentElement.find(".btnNormal:first");
            btnNormal.attr("href", "/m2012/html/set/feature_meal_guide/index.html?sid=" + top.$App.getSid());
            btnNormal.attr("target", "_blank");
        },
        getNewDate: function (str) {
            try {
                str = str.split('-');
                var date = new Date();
                date.setUTCFullYear(str[0], str[1] - 1, str[2].slice(0, 2));
                date.setUTCHours(0, 0, 0, 0);
                return date;
            } catch (e) {
                return new Date();
            }
        },
        getLogoutUrl: function () {
            var userdata = top.$App.getConfig('UserData');
            var registDate = top.$App.getConfig("UserData").registDate;

            var daysCount = top.$Date.getDaysPass(this.getNewDate(registDate), new Date());
            var mailsCount = top.$User.getMessageInfo().messageCount;
            var addrsCount = top.Contacts.getContactsCount();
            var mailType = top.$User.getServiceItem();
            var uid = $T.Mobile.remove86(top.uid);
            var domain = top.$App.getMailDomain();
            var accountList = top.$User.getAccountList();
            var sid = top.$App.getSid();
            var len = accountList.length;
            var accountArray = [];
            for (var i = 0; i < len; i++) {
                if (accountList[i].type != "mobile") {
                    accountArray.push(accountList[i].name);
                }
            }
            var aliasAddr = accountArray.join(",");
            var url = $T.Url.makeUrl("/m2012/html/set/feature_meal_cancellation.html", {
                daysCount: daysCount,
                mailsCount: mailsCount,
                addrsCount: addrsCount || 0,
                mailAddr: uid + "@" + domain,
                aliasAddr: aliasAddr,
                mailType: mailType,
                uid: uid,
                sid: sid
            });
            return url;
        },
        getUserLevelObj: function () {
            var userLevel = top.$User.getUserLevel();
            var accountList = top.$User.getAccountList();
            var len = accountList.length;
            var accountArr = [];
            for (var i = 0; i < len; i++) {
                if (accountList[i].type == "common") {
                    accountArr.push(i)
                }
            }
            var commonLen = accountArr.length;
            var obj = {
                userLevel: userLevel,
                commonLen: commonLen
            }
            return obj;
        },
        // 公共类型绑定事件
        _bindEventForPublic: function () {
            var self = this;
            $("#mailType").text(top.$User.getPackage());
            if (!top.SiteConfig.newLogoff) {
                $("#logoutLi").hide();
            }
            $("#logoutMailbox").attr("href", self.getLogoutUrl());
            var useObj = self.getUserLevelObj();
            if (useObj.commonLen > 0) {
                $("#applyAlias").hide();
            }
            $("#applyAlias a.btnNormal").bind('click', function (event) {
                var useObj = self.getUserLevelObj();
                var userLevel = useObj.userLevel;
                var commonLen = useObj.commonLen;
                if ((userLevel == "0017" && commonLen > 3)) {
                    $("#applyAlias").hide();
                }
                userLevel = userLevel == "0010" ? "0015" : userLevel;
                if (top.SiteConfig.moreAlias) {
                    var obj = [
                { userLevel: "0015", text: "5-15" },
                { userLevel: "0016", text: "4-15" },
                { userLevel: "0017", text: "3-15" }
            ]
                } else {
                    var obj = [
                { userLevel: "0015", text: "5-15" },
                { userLevel: "0016", text: "5-15" },
                { userLevel: "0017", text: "5-15" }
            ]
                }
                var This = $(this);
                if ((userLevel == "0015" && commonLen > 0) || (userLevel == "0016" && commonLen > 1)) {
                    if ($(".delmailTips").length < 1) {
                    //    self.showUpdateUser(This);
                    }
                    return
                }
                var jInputAlias = $("#inputAlias");
                if (jInputAlias.is(':visible')) {
                    return;
                }
                for (var i = 0; i < obj.length; i++) {
                    if (userLevel == obj[i].userLevel) {
                        $("#stringNum").text(obj[i].text);
                    }
                }
                jInputAlias.show();

                BH({ key: "set_account_accountadmin_replyalias" });
            });
            $("#inputAlias > a.i_u_close").bind('click', function (event) {
                $("#inputAlias").hide().find(".red").html("");
                $("#aliasAccount").val("例:bieming");
            });
            // 绑定确定按钮单击事件
            $("#confirmApplyAlias").bind('click', function (event) {
                self.applyAlias();
            });
            // 绑定键盘松开事件
            $("#aliasAccount").keyup(function (event) {
                var status = "keyup";
                self.applyAlias(status);
            });
            // 绑定取消按钮单击事件
            $("#cancelApplyAlias").bind('click', function (event) {
                $("#inputAlias").hide().find(".red").html("");
                $("#aliasAccount").val("例:bieming");
            });
            // 绑定邮箱账号输入框焦点事件
            $("#aliasAccount").blur(function () {
                var status = "blur";
                var text = $(this).val();
                if (!text) {
                    text = self.model.defaultAliasValue;
                }
                self.applyAlias(status);
                $(this).val(text);
            }).focus(function () {
                var text = $(this).val();
                if (text == self.model.defaultAliasValue) {
                    $(this).val('');
                }
            });
        },
        // 为无手机账号UI类型绑定事件
        _bindEventForNoMobile: function () {
            var self = this;
            $("#bindMobile a").bind('click', function (event) {
                var jInputMobile = $("#inputMobile");
                if (jInputMobile.parent('td').is(':visible')) {
                    return;
                }
                jInputMobile.parent('td').show();
                jInputMobile.show();

                BH({ key: "set_account_accountadmin_bindmobile" });
            });
            $("#inputMobile > a.i_u_close").bind('click', function (event) {
                $("#inputMobile").parent('td').hide();
            });
            $("#waitBind > a.i_u_close").bind('click', function (event) {
                $("#inputMobile").parent('td').hide();
            });
            $("#sucBind > a.i_u_close").bind('click', function (event) {
                $("#inputMobile").parent('td').hide();
            });
            $("#sucBind a.btnNormal ").bind('click', function (event) {
                $("#inputMobile").parent('td').hide();
            });
            // 绑定手机号码输入框焦点事件
            $("#mobile").blur(function () {
                var text = $(this).val();
                if (!text) {
                    text = self.model.defaultMobileValue;
                }
                $(this).val(text);
            }).focus(function () {
                var text = $(this).val();
                if (text == self.model.defaultMobileValue) {
                    $(this).val('');
                }
            });
            // 获取验证码
            $("#obtainCheckCode").bind('click', function (event) {
                self.obtainCheckCode();
            });
            // 绑定确定按钮单击事件
            $("#confirmBindMobile").bind('click', function (event) {
                self.bindMobile();
            });
            // 绑定取消按钮单击事件
            $("#cancelBindMobile").bind('click', function (event) {
                $("#inputMobile").parent('td').hide();
            });
        },
        // 为无邮箱账号UI类型绑定事件
        _bindEventForNoAlias: function () {
            var self = this;
            // 邮箱账号申请成功单击确定
            $("#confirmApplyAliasSuc").bind('click', function () {
                //$("#applyAliasSuc").hide();
            });
        },
        // todo 调接口获取验证码
        obtainCheckCode : function(){
            var self = this;
            var jPassword = $("#accountPassword");
            var jMobile = $("#mobile");
            var span = $("#obtainCheckCode > span");
            var mobileNum = $.trim(jMobile.val());
            function validate(){
                if(!jPassword.val()){
                    parent.$Msg.alert(self.model.tipMessage['LACK_PASSWORD']);
                    //jPassword.focus();
                    return false;
                }
                if(!mobileNum || mobileNum == self.model.defaultMobileValue){
                    parent.$Msg.alert(self.model.tipMessage['LACK_MOBILE']);
                    jMobile.focus();
                    return false;
                }
                if (!(/[^\d]/.test(jMobile.val())) && jMobile.val().length != 11) {
                    parent.$Msg.alert(self.model.tipMessage['MOBILE_LENGTHRROR']);
                    jMobile.select();
                    return false;
                }
                if(!$Mobile.isMobile(mobileNum)){
                    parent.$Msg.alert(self.model.tipMessage['MOBILE_FORMATERROR']);
                    jMobile.select();
                    return false;
                }
                return true;
            }
            if(!validate()){
                return;
            }
            // 服务端校验手机号码是否可用,可用服务端将下发验证码
            self.model.verifyNumber(self.getVerifyNumberData(), function(result){
                if (result && result.code == self.model.responseCode['S_OK']) {
                    // 保存事物ID
                    self.model.changeNumberData['transId'] = result['var']['transId'];
                    self.showCountDown(span);
                    var num = self.getMobileWithStar(mobileNum);
                    parent.$Msg.alert($T.Utils.format(self.model.tipMessage['SEND_PASSWORDSUC'], [num]));
                }else if(result.code == self.model.responseCode['FA_NEWPHONE_REGISTTED']){
                    parent.$Msg.alert(self.model.responseMsg['FA_NEWPHONE_REGISTTED']);
                }else if(result.code == self.model.responseCode['FA_OLDPHONE_CHANGING']){
                    parent.$Msg.alert(self.model.responseMsg['FA_OLDPHONE_CHANGING']);
                }else if(result.code == self.model.responseCode['FA_NEWPHONE_TOLIMITED']){
                    parent.$Msg.alert(self.model.responseMsg['FA_NEWPHONE_TOLIMITED']);
                }else if(result.code == self.model.responseCode['FA_NEWPHONE_CHANGING']){ 
                    parent.$Msg.alert(self.model.responseMsg['FA_NEWPHONE_CHANGING']);
                }else if(result.code == self.model.responseCode['FA_NEWPHONE_EMPTY']){
                    parent.$Msg.alert(self.model.responseMsg['FA_NEWPHONE_EMPTY']);
                }else if(result.code == self.model.responseCode['S_ERROR']){
                    parent.$Msg.alert(self.model.responseMsg['S_ERROR']);
                }else if(result.code == self.model.responseCode['FA_PWD_EMPTY']){
                    parent.$Msg.alert(self.model.responseMsg['FA_PWD_EMPTY']);
                }else if(result.code == self.model.responseCode['FA_PWD_ERROR']){
                    parent.$Msg.alert(self.model.responseMsg['FA_PWD_ERROR']);
                }else if(result.code == self.model.responseCode['FA_IS_NOT_PHONE']){
                    parent.$Msg.alert(self.model.responseMsg['FA_IS_NOT_PHONE']);
                }else if(result.code == self.model.responseCode['FA_SEND_ERROR']){
                    parent.$Msg.alert(self.model.responseMsg['FA_SEND_ERROR']);
                }else if(result.code == self.model.responseCode['FA_Frequency_Limited']){
                    parent.$Msg.alert(self.model.responseMsg['FA_Frequency_Limited']);
                }else{
                    parent.$Msg.alert(self.model.tipMessage['SEND_PASSWORDFAI']);
                }
            });
        },
        // 绑定手机号码
        bindMobile : function(){
            var self = this;
            var jPassword = $("#accountPassword");
            var jMobile = $("#mobile");
            var jCheckCode = $("#checkCode");
            function validate(){
                if(!jPassword.val()){
                    parent.$Msg.alert(self.model.tipMessage['LACK_PASSWORD']);
                    //jPassword.focus();
                    return false;
                }
                if(!$.trim(jMobile.val()) || $.trim(jMobile.val()) == self.model.defaultMobileValue){
                    parent.$Msg.alert(self.model.tipMessage['LACK_MOBILE']);
                    jMobile.select();
                    return false;
                }
                if (!(/[^\d]/.test(jMobile.val())) && jMobile.val().length != 11) {
                    parent.$Msg.alert(self.model.tipMessage['MOBILE_LENGTHRROR']);
                    jMobile.select();
                    return false;
                }
                if(!$Mobile.isMobile($.trim(jMobile.val()))){
                    parent.$Msg.alert(self.model.tipMessage['MOBILE_FORMATERROR']);
                    jMobile.select();
                    return false;
                }
                if(!jCheckCode.val()){
                    parent.$Msg.alert(self.model.tipMessage['LACK_CHECKCODE']);
                    return false;
                }
                if(/\s/.test($.trim(jCheckCode.val()))){
                    parent.$Msg.alert(self.model.tipMessage['CHECKCODE_FORMATERROR']);
                    return false;
                }
                return true;
            }
            if(!validate()){
                return;
            }
            var data = self.model.changeNumberData;
            if(!data['transId']){
                parent.$Msg.alert(self.model.responseMsg['S_ERROR']);
                return;
            }

            data['smsValidateCode'] = $.trim(jCheckCode.val());
            self.disabledButton('confirmBindMobile', 3000);
            self.model.bindMobile(data, function(result){
                if(result && result.code == self.model.responseCode['S_OK']){
                    BH({key : "set_account_accountadmin_bindmobile_success"});

                    $("#inputMobile").hide();
                    $("#waitBindTip").html(self.getMobileWithStar($.trim(jMobile.val())));
                    $("#waitBind").show();
                    
                    $("#bindMobile").hide();
                    $("#bindMobile").prev('tr').find('td').removeClass('bNone');

                    // 刷新数据
                    parent.$App.trigger("userAttrChange", {
                        callback: function () {
                            accountSetting.account.render();
                        }
                    });
                }else if(result.code == self.model.responseCode['S_ERROR']){
                    parent.$Msg.alert(self.model.responseMsg['S_ERROR']);
                }else if(result.code == self.model.responseCode['FA_SMS_EMPTY']){
                    parent.$Msg.alert(self.model.responseMsg['FA_SMS_EMPTY']);
                }else if(result.code == self.model.responseCode['FA_PWD_EXPIRE']){
                    parent.$Msg.alert(self.model.responseMsg['FA_PWD_EXPIRE']);
                }else if(result.code == self.model.responseCode['FA_SMS_UNPASS']){
                    parent.$Msg.alert(self.model.responseMsg['FA_SMS_UNPASS']);
                }else if(result.code == self.model.responseCode['FA_SMS_OVERFLOW']){
                    parent.$Msg.alert(self.model.responseMsg['FA_SMS_OVERFLOW']);
                }else{
                    $("#waitBind").hide();
                    $("#waitBind").parent('td').hide();
                    parent.$Msg.alert(self.model.tipMessage['BIND_MOBILEFAI']);
                }
            });
        },
        checkAlias: function (alias) {
            var model = this.accountModel;
            var errorAlias = $("#inputAlias .red");
            //服务端检查
            model.serverCheckAlias(alias, function (result) {
                var code = result.code;
                console.log(code)
                if (code == "S_OK") {
                    //别名可用。
                    model.set("alias", alias);
                    errorAlias.html("");
                } else if (code == "S_FALSE") {
                    top.M139.UI.TipMessage.show("登录超时，请重新登录", { delay: 3000 });
                }
                else {
                    var msg = result.msg || result["var"].msg;
                    errorAlias.html(msg);
                }
            });
        },
        addAlias: function (alias, callback) {
            var self = this;
            // 调接口申请邮箱账号(设置别名)
            accountSetting.account.update(function (result) {
                var SUCCESS = "S_OK";
                if (!result || result.code != SUCCESS) {
                    parent.$Msg.alert(self.model.tipMessage.ACCOUNT_TEXT+'设置失败！');
                    return;
                } else {
                    BH({ key: "set_account_accountadmin_replyalias_success" });

                    $("#inputAlias").hide();
                    var aliasAccount = alias + '@' + top.$App.getMailDomain();
                    //年终”邮”福利,百万豪礼过大年活动 显示 add By QZJ
                    self.showYearLottory();
                    top.M139.UI.TipMessage.show("别名 " + aliasAccount + " 添加成功", { delay: 2000 });
                    // 账号列表新增邮箱账号
                    var account = { name: aliasAccount, type: 'common', text: self.model.tipMessage['ACCOUNT_TEXT'] };
                    $("#applyAlias").siblings("table:visible").find("tr:first").after(self.getAccountHtml(account));
                    // 重新渲染顶部别名区域
                    var html = accountSetting.account.template.alias.replace("{0}", aliasAccount);
                    accountSetting.account.divAlias.html(html);

                    // 刷新数据
                    parent.$App.trigger("userAttrChange", {
                        callback: function () {
                            accountSetting.account.render();
                        }
                    });
                    if (callback) { callback() }
                }
            }, alias);
        },

        showYearLottory: function () {
            var postionId = 'web_064',
                validTime = new Date(2013, 11, 30),
                now = top.M139.Date.getServerTime() || new Date(),
                isCM = top.$User.isChinaMobileUser();  //是否移动用户
            if (top.SiteConfig.yearLottery && validTime > now && isCM) {
                top.M139.RichMail.API.call("unified:getUnifiedPositionContent", { positionCodes: postionId }, function (response) {
                    if (response.responseData && response.responseData.code && response.responseData.code == "S_OK") {
                        var htmlContent = response.responseData["var"];
                        var showHtml = '';
                        //链接地址参数
                        hrefLink = [
                            '&sid=' + top.sid,
                            '&rnd=' + Math.random().toFixed(8),
                            '&originID=' + '0',
                            '&tid=' + Math.random().toFixed(8),
                            '&versionID=0',
                            'v=2'
                        ].join('');


                        //获取展示的html
                        if (htmlContent[postionId] && htmlContent[postionId][0].content && htmlContent[postionId][0].content.length > 50) {
                            showHtml = htmlContent[postionId][0].content;
                        } else {
                            //如果统一位置未返回内容
                            var html = ['<div class="boxIframe_box">',
                                '<div>',
                                '<div class="boxIframe_box_fl">',
                                '<strong class="boxIframe_box_h">别名设置成功</strong><br>',
                                '<span class="boxIframe_box_sp">恭喜您获得一次抽奖机会！  </span>',
                                '</div>',
                                '<div class="boxIframe_box_div"><a class="boxIframe_box_btn" target="_blank" id="LotteryLink" href="' + hrefLink + '">点击抽奖</a></div>',
                                '<div class="boxIframe_box_clear"></div>',
                                '</div>',
                                '<p class="boxIframe_box_info">（抽奖机会不累计，离开此页面视为自动放弃本次抽奖）</p>',
                                '<div class="boxIframe_box_height"></div>',
                                '<p class="boxIframe_box_p">2013岁末100万感恩回馈，凡于活动期间登录139邮箱，每使用发邮件、发贺卡、别名设置功能，即可获得一次抽奖机会，使用越多，抽奖机会越多，中奖率超高！</p>',
                                '</div>'].join("");
                        }

                        var popL = top.$Msg.showHTML(showHtml, {
                            dialogTitle: "系统提示",
                            height: 170,
                            width: 390
                        });
                        
                        top.$('#LotteryLink').attr('href', "javascript:top.$App.show('lottery', '" + hrefLink + "')").click(function () {
                            popL.close()
                        })
                    }
                });
            }

        },
        // 申请邮箱账号
        applyAlias: function (status, callback) {
            var self = this;
            var aliasAccount = $("#aliasAccount");
            var errorAlias = $("#inputAlias .red");
            var alias = aliasAccount.val();
            if (alias == "" || alias == self.model.defaultAliasValue) {
                errorAlias.html("请输入" + self.model.tipMessage.ACCOUNT_TEXT + "!")
                return;
            }
            var clientResult = accountSetting.account.model.clientCheckAlias(alias);
            if (clientResult.code != 'S_OK') {
                if (!status) {
                    aliasAccount.select();
                    aliasAccount.focus();
                }
                errorAlias.html(clientResult.msg)
                return;
            }
            else {
                errorAlias.html("")
            }
            if (status) {//blur和keyup事件验证别名   不进行到设置别名这一步
                return
            }
            this.addAlias(alias, callback)
        },
        // 拼装账号列表html段
        getAccountsHtml: function () {
            var self = this;
            var accountList = self.model.accountList;
            var html = [];

            for (var i = 0, aLen = accountList.length; i < aLen; i++) {
                var account = accountList[i];
                html.push(self.getAccountHtml(account));
            }

            return html.join('');
        },
        /**
        * 单独拼装某一个账号的html段 
        * @param account {name : 'zhumy@rd139.com',type : 'common',text : '邮箱账号'}
        * return String 
        */
        getAccountHtml: function (account) {
            if (!account) {
                return '';
            }

            return ['<tr><td class="td1">',
            account.name,
            '</td><td class="td2">',
            account.text,
            '</td></tr>'].join('');
        },
        changeMobile : function(){
            $("#changeMobile").click();
        },
        // 获取验证手机号码请求数据
        getVerifyNumberData : function(){
            var self = this;
            var data = self.model.verifyNumberData;
            data['newNumber'] = $.trim($("#mobile").val());
            data['password'] = $("#accountPassword").val();
            return data;
        },
        // 将部分数字替换为*号
        getMobileWithStar : function(mobile){
            if(!mobile){
                return '';
            }
            return mobile.substr(0, 3)+'****'+mobile.substring(7, 11);
        },
        // 将某按钮失效一段时间再恢复
        disabledButton : function(id, time){
            $("#"+id).attr("disabled", true);
            setTimeout(function () {
                $("#"+id).attr("disabled", null);
            }, time);
        },
        showCountDown: function (dom, time) {
            var self = this;
            if (!dom) return;
            if (!time) {
                time = self.model.SENDMSG_INTERVAL || 60;
                $("#obtainCheckCode").off("click");
                dom.addClass("gray");
            }
            if (self.timer) clearTimeout(self.timer);
            var messages = self.model.tipMessage;
            if (time > 0) {
                dom.html(time + messages.MSG_WAIT_TEXT);
                var next = time - 1;
                next = next || -1;
                self.timer = setTimeout(function () {
                    self.showCountDown(dom, next);
                }, 1000);
            } else {
                dom.removeClass("gray").html(messages.MSG_RESEND_TEXT);
                // 重新绑定单击事件
                $("#obtainCheckCode").bind('click', function(event){
                    self.obtainCheckCode();
                });
            }
        }
    })
);

    $(function () {
        accountAdminView = new M2012.Settings.View.AccountAdmin();
        var anchor = $T.Url.queryString("anchor");
        if (anchor == 'accountAdmin') {
            if ($("#noAliasAccount").is(":visible")) {
                $("#applyAlias").click();
            } else if ($("#noMobileAccount").is(":visible")) {
                $("#bindMobile a.btnNormal").click();
            }
        }
    });
})(jQuery, _, M139);