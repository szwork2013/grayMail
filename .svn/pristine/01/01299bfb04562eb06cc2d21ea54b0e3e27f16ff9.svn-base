(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.View.Account', superClass.extend({
        DEFAULT_ALIAS_TIP: "例:bieming",
        template: {
            popUpdateUser: '<h3 class="nametipsico">现在升级邮箱可享有更多超短别名！</h3><p class="nametipsicop">升级还可享有其他VIP特权：<br>更大的彩云容量，更长的文件保存时间，更个性的专属皮肤……</p>',
            alias: '<span>{0}</span><span id="aliasTip" class="gray ml_10">(第二个邮箱地址)</span>',
            aliasDefaultTip: '(第二个邮箱地址，<span class="red">设置后不可修改</span>)',
            confirmAlias: ['<div class="norTips"><span class="norTipsIco"><i class="i_warn"></i></span>',
                                 '<dl class="norTipsContent">',
                                     '<dt class="norTipsLine">您要设置的别名是：{alias}</dt>',
                                     '<dd class="norTipsLine gray"> 别名只能设置一次，且之后无法修改。</dd>',
                                     '<dd class="norTipsLine gray"> 您确定要设置这个别名吗？</dd>',
                                 '</dl>',
                             '</div>'].join("")
        },
        messages: {
            unbindTip: "您将不能在邮箱聊飞信，是否解绑？",
            systemError: "系统繁忙，请稍后再试。",
            sessionTimeout: "登录超时，请重新登录",
            unknowError: "未知错误",

            ALIAS_OK: "您自定义的别名可以使用",
            ALIAS_HOLDEN: "系统已保留此别名，请设置其他别名",
            ALIAS_IS_SYSTEM_REMAIN:"系统已保留此别名，请设置其他别名",
            ALIAS_USED: "该别名已被别人占用",
            ALIAS_ACCEPT_SYMBOL: "支持字符签名：0~9,a~z,“.”,“_”，“-”",
            ALIAS_ACCEPT_CONTENT: "支持字符签名：0~9,a~z,“.”,“_”，“-”",
            ALIAS_RULE_1: "必须以英文字母开头",
            ALIAS_NOT_ALLOW: "您的输入有误，请重新输入。别名帐号为5-15个字符，以英文字母开头，支持字符范围：0~9,a~z,“.”,“_”,“-”。"
        },

        status: {
            SUCCESS: "S_OK",            //成功
            SESSION_TIMEOUT: "S_FALSE", //验证失败，检查SID和RMKEY
            SYS_ERROR: "999",           //系统错误
            UN_ACTIVE: "1",             //未开通飞信
            ALIAS_HAS_USED: "967",      //别名已被占用
            ALIAS_NOT_ALLOW: "3144",    //别名不符合规范
            ALIAS_SET_ERROR: "1999",    //别名设置失败
            ALIAS_LIMIT: "3124",        //别名个数限制
            FAILURE: "0",                //失败
            ALIAS_IS_SYSTEM_REMAIN: "ALIAS_IS_SYSTEM_REMAIN"//别名被占用
        },
        initialize: function () {
            this.model = new M2012.Settings.Model.Account();
            this.sender = $("#txtSenderName");
            this.divAlias = $("#aliasDiv");
            this.txtAlias = $("#txtAlias");
            this.userName = $("#txtUserName"); //账户信息>>姓名

            this.alterTipMessages();// add by tkh
            this.render();
        },
        // add by tkh 非移动用户提示：邮箱账号
        alterTipMessages : function(){
        	var self = this;
        	if(!parent.$User.isChinaMobileUser()){
        		self.divAlias.siblings('label').text('邮箱帐号：');
        		self.messages.ALIAS_OK = '您自定义的邮箱帐号可以使用';
        		self.messages.ALIAS_HOLDEN = '系统已保留此邮箱帐号，请设置其他邮箱帐号';
        		self.messages.ALIAS_USED = '该邮箱帐号已被别人占用';
        		self.messages.ALIAS_NOT_ALLOW = '您的输入有误，请重新输入。邮箱帐号为5-15个字符，以英文字母开头，支持字符范围：0~9,a~z,“.”,“_”,“-”。';
        		
        		self.template.confirmAlias = ['<div class="norTips"><span class="norTipsIco"><i class="i_warn"></i></span>',
                                 '<dl class="norTipsContent">',
                                     '<dt class="norTipsLine">您要设置的邮箱帐号是：{alias}</dt>',
                                     '<dd class="norTipsLine gray"> 邮箱帐号只能设置一次，且之后无法修改。</dd>',
                                     '<dd class="norTipsLine gray"> 您确定要设置这个邮箱帐号吗？</dd>',
                                 '</dl>',
                             '</div>'].join("");
        	}
        },
        render: function () {
            var self = this;
            var model = self.model;
            //获取初始化数据
            var data = model.getUserData();
            var accountfield = $("#accountDiv");

			self.menuDefaultSender = M2012.UI.DropMenu.create({
                selectMode : true,
                width: "220px",
                container: accountfield,
                menuItems: data.accounts,
                defaultText: data.defaultAccount,
                hideInsteadOfRemove: true
            });
            self.menuDefaultSender.on("change", function (item, index) {
                model.setDefaultAccount(item.text, item.type, function (source) {
                    if (source.code != "S_OK") {
                        top.$Msg.alert("系统繁忙，请稍后再试");
                        return;
                    }
                    self.menuDefaultSender.menu.selectItem(index);
                    top.M139.UI.TipMessage.show("默认发信帐号设置成功", { delay: 2000 });
                });
            });
            
			// 初始化，勾选当前发信帐号
			self.menuDefaultSender.on("menuCreate", function(menu){
				_.each(data.accounts, function(item, index){
					if(item.text === data.defaultAccount){
						menu.selectItem(index);
					}
				});
			});

            //绑定发件人姓名控件
            self.sender.val(data.userName);
            self.sender.on("blur", function () {
                var userName = $.trim(self.sender.val());
                model.set("userName", userName);
            });

            //绑定别名
            if (data.alias) {
                var alias = data.alias;
                if (alias && !parent.$T.Email.isEmail(alias)) { //仅是别名，则加上邮箱后缀
                    alias = parent.$App.getAccountWithLocalDomain(alias);
                }
                var html = self.template.alias.replace("{0}", alias);
                self.divAlias.html(html);
            } else {
                self.txtAlias.on("blur", function () {
                    self.checkAlias(self);
                });
                self.txtAlias.on("focus", function () {
                    var alias = $.trim(self.txtAlias.val());
                    if (alias == "" || alias == self.DEFAULT_ALIAS_TIP) {
                        self.txtAlias.val("").removeClass("gray"); //清空内容和状态
                    }
                });
                self.divAlias.find("#aliasTip").html(self.template.aliasDefaultTip);
            }

            model.trigger("change:fetionAlias"); //显示飞信

            model.on("change:userName", function () { //记录一下值被修改的经过
                var userName = model.get("userName");
                self.sender.val(userName); //用于同步用户名
            });
        },
        checkAlias: function (self) {
            var model = self.model;
            var txtAlias = self.txtAlias;
            var status = self.status;
            var alias = txtAlias.val();
            model.set("alias", alias); //先设置，异步检查不可用时清空
            var aliasTip = $("#aliasTip");
            if (alias == "" || alias == self.DEFAULT_ALIAS_TIP) { //检验内容
                txtAlias.val(self.DEFAULT_ALIAS_TIP).addClass("gray");
                self.model.set("alias", "");

                aliasTip.removeClass("red").html(self.template.aliasDefaultTip);
                return false;
            } else {
                txtAlias.removeClass("gray");

                //客户端检查
                var clientResult = model.clientCheckAlias(alias);
                if (clientResult.code != self.status.SUCCESS) {
                    self.model.set("alias", "");
                    aliasTip.addClass("red").html(clientResult.msg);
                    return false;
                }

                //服务端检查
                model.serverCheckAlias(alias, function (result) {
                    var code = result.code;
                    if (code == status.SUCCESS) {
                        //别名可用。
                        model.set("alias", alias);

                        var msg = self.messages.ALIAS_OK;
                        aliasTip.removeClass("red").html(msg);
                    } else if (code == status.SESSION_TIMEOUT) {
                        top.M139.UI.TipMessage.show(self.messages.sessionTimeout, { delay: 3000 });
                    }
                    else {
                        var msg = result.msg || result["var"].msg || self.messages.systemError;
                        //self.showPopup(self.txtAlias, msg);
                        aliasTip.addClass("red").html(msg);
                    }
                });
                return true;
            }
        },

        setUserName: function (name) {
            this.model.set("userName", name); //供main调用，因为账户信息设置可以修改发件人姓名
        },
        showPopup: function (dom, tip) {
            var popup = M139.UI.Popup.create({
                name: "tip_alias_check",
                target: dom[0],
                icon: "i_fail",
                content: tip
            });
            popup.render();

            if (window.setAliasTimer) {
                clearTimeout(window.setAliasTimer);
            }
            window.setAliasTimer = setTimeout(function () {
                if (popup) {
                    try {
                        popup.close();
                    } catch (e) { }
                }
            }, 3000); //3s后隐藏
        },
        update: function (callback, alias) {
            //此方法给main方法调用，更新别名
            var This = this;
            var isFromAccountAdmin = alias?true:false;
            var model = This.model;
            var status = This.status;
            var messages = This.messages;
            var alias = alias || This.txtAlias.val();
            alias = alias == This.DEFAULT_ALIAS_TIP ? "" : alias; //默认提示语，清理为空

            //客户端预检查
            var clientResult = model.clientCheckAlias(alias);
            if (clientResult.code != This.status.SUCCESS) {
            	This._setFocus();// 设置页面焦点
                parent.$Msg.alert(clientResult.msg);
                return;
            }

            if (alias != "") {
                //服务端检查
                model.serverCheckAlias(alias, function (result) {
                    var code = result.code;

                    if (code == status.SUCCESS) {
                        updateAccount();

                    } else if (code == status.SESSION_TIMEOUT) {
                        top.M139.UI.TipMessage.show(This.messages.sessionTimeout, { delay: 3000 });
                    } else if (code == status.ALIAS_HAS_USED) {
                        // add by tkh别名被占用
                        parent.$Msg.alert(This.messages.ALIAS_USED);
                    } else {
                        var msg = result.msg || result["var"].msg || This.messages.systemError;
                        parent.$Msg.alert(msg);
                        This._setFocus();// 设置页面焦点
                    }
                });
            } else {
                updateAccount();
            }

            function updateAccount() {
                var data = { "alias": alias };
                This.model.update(data, function (result) {
                    var code = result.code;
                    var msg = "";
                    if (code == status.SUCCESS) {
                        if (callback && typeof (callback) == "function") {
                            callback(result);
                        }
                        return;
                    } else if (code == status.SESSION_TIMEOUT) {
                        //登录超时
                        msg = messages.sessionTimeout;

                        //直接弹出提示框
                        parent.$Msg.alert(msg);
                        return;
                    } else if (code == status.ALIAS_IS_SYSTEM_REMAIN) {
                        //别名被占用
                        msg = messages.ALIAS_IS_SYSTEM_REMAIN;

                        //直接弹出提示框
                        parent.$Msg.alert(msg);
                        return
                    } else if (code == status.ALIAS_SET_ERROR) {
                        //设置失败：如已设置过再次设置等
                    } else {
                        msg = messages.systemError;
                    }
                    var msg = result.msg || msg || messages.systemError;
                    //$(document).scrollTop(0); //设置滚动条
					This._setFocus(isFromAccountAdmin);// 设置页面焦点 add by tkh
                    parent.$Msg.alert(msg);
                });
            }
        },
        /*
         *设置页面焦点 add by tkh
         *@param isFromAccountAdmin 是否在账号管理里设置邮箱账号
         */
        _setFocus : function(isFromAccountAdmin){
        	var This = this;
        	//var anchor = $T.Url.queryString("anchor");
            if(isFromAccountAdmin){
            	$("#aliasAccount").focus();
            }else{
            	$(document).scrollTop(0);
            	if(This.txtAlias){
            		This.txtAlias.focus();
            	}
            }
        }
    })
    );

})(jQuery, _, M139);