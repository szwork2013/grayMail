(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.View.Passwordquestion', superClass.extend({
        messages: {
            OS_PWD_BUSY: "系统繁忙，请稍后再试",
            
            PWD_ISNULL: "密码不能为空，请输入邮箱密码",
            PWD_ERROR: "密码不正确，区分大小写",
            
            EMAIL_ISNULL: "请输入密保邮箱",
            EMAIL_FORMAT_ERROR: "请输入正确的邮件地址",
            EMAIL_SELF_ERROR: "不能输入本帐号邮箱",
            EMAIL_FETION_ERROR: "不能输入飞信邮箱"
        },
        status: {
            OK: "S_OK",         //成功
            SESSION_TIMEOUT: "S_FALSE",  //登录超时
            PWD_ERROR: "2035",   //密码错误
            ERROR: "ERROR"       //错误
        },
        templete: {
            pwdTip: '<span class="formError ml_5 v-visible">{errTip}</span>'
        },
        initialize: function () {
            this.model = new M2012.Settings.Model.Passwordprotection();
            
            //输入框控件
            this.mailPwd = $("#mailPassword"); //邮箱密码输入框
            
            //按钮
            this.btnSet = $("#btnSet"); //下一部按钮
            
            //提示
            $("span.formError").remove(); //输入框错误提示语
            
            //忘记密码按钮
            this.gotoForgetPwd = $("#forgetPwd"); //跳转到忘记密码页面
            
            //返回“账户设置”
            this.goback = $("#goback"); //返回设置首页
            
            this.passwordEmail = $("#passwordEmail");
            
            //邮箱密码验证 step1
            this.verifyEmailPwdArea = $("#verifyEmailPwdArea");
            //设置密保问题 step 2
            this.setPasswordEmailArea = $("#setPasswordEmailArea");
            //设置密保问题成功 step3
            this.setPasswordEmailSuccArea = $("#setPasswordEmailSuccArea");
            
            this.setBtn = $(".setBtn");
            
            //步骤
            this.step = "verifyEmailPassword";
            
            this.render();
        },
        render: function () {
            var This = this;
            var model = This.model;
            var messages = This.messages;
            
            This.initEvents();
            This.mailPwd.focus(); //开始聚焦邮箱密码输入框
        },
        initEvents: function () {
            var This = this;
            var model = This.model;
            var messages = This.messages;
            
            //邮箱密码输入框失焦事件
            This.mailPwd.on("blur", function () {
                This.checkMailPwd();
            });
            //下一步
            This.btnSet.on("click", function () {
                This.submitData();
            });
            $(document).keypress(function(e){
                if(e.keyCode == 13){
                    This.submitData();
                }
            });
            //忘记密码，跳转到忘记密码首页
            This.gotoForgetPwd.on("click", function (){
                this.href = 'http://mail.'+ document.domain +'/webmail/password/?mobile='+top.$User.getLoginName();
                this.target = "_blank";
            });
            //返回设置首页
            This.goback.on("click", function () {
                This.goBack();
            });
        },
        submitData : function(){
            var This = this;
            if(This.step == 'verifyEmailPassword'){
                This.verifyEmailPassword();
            }else if(This.step == 'setPasswordEmail'){
                This.setPasswordEmail();
            }else if(This.step == 'setPasswordEmailSucc'){
                This.goBack(); //返回设置页
            }
        },
        verifyEmailPassword : function () {
            var This = this;
            var model = This.model;
            var messages = This.messages;
            if(This.checkMailPwd()){
                var pwd = This.mailPwd.val();
                model.verifyEmailPassword({ password: pwd }, function(result){
                    var code = result.code || null;
                    if (code) {
                        if (code == This.status.OK) { //正确
                            This.initPasswordEmail();
                        }else{ //失败
                            var msg = messages[code] || result.msg || messages["OS_PWD_BUSY"];
                            parent.$Msg.alert(msg);
                        }
                    }
                });
            }
        },
        initPasswordEmail : function(){
            var This = this;
            This.verifyEmailPwdArea.addClass('hide')
            This.setPasswordEmailSuccArea.addClass('hide');
            This.setPasswordEmailArea.removeClass('hide');
            $('ul.passwordStep').find('li').removeClass('on');
            $('ul.passwordStep').find('li[for="setPasswordEmailArea"]').addClass('on');
            This.passwordEmail.focus();
            This.step = "setPasswordEmail";
        },
        setPasswordEmail : function(){
            var This = this;
            var model = This.model;
            var messages = This.messages;
            
            if(This.checkEmail()){
                var data = {
                    email    : $.trim(This.passwordEmail.val()),
                    type     : '2'
                };
                model.setPasswordProtect(data,function(result){
                    var code = result.code || null;
                    if(code){
                        if (code == This.status.OK){
                            top.$App.config._configs.UserData.mainUserConfig.externalemail = ["0",data.email];
                            $('#pwdEmail').html(data.email);
                            This.setPasswordEmailSucc();
                        }else{
                            var msg = messages[code] || result.msg || messages["OS_PWD_BUSY"];
                            parent.$Msg.alert(msg);
                        }
                    }
                });
            }
        },
        setPasswordEmailSucc : function(){
            var This = this;
            This.step = "setPasswordEmailSucc";
            This.verifyEmailPwdArea.addClass('hide')
            This.setPasswordEmailArea.addClass('hide');
            This.setPasswordEmailSuccArea.removeClass('hide');
            $('ul.passwordStep').find('li').removeClass('on');
            $('ul.passwordStep').find('li[for="setPasswordEmailSuccArea"]').addClass('on');
            This.btnSet.html('<span>完 成</span>');
            var type = top.$T.Url.queryString('type',window.location.href);
            top.BH(type + '_success');
        },
        checkMailPwd : function () {
            var This = this;
            var model = This.model;
            var messages = This.messages;

            var pwd = This.mailPwd.val();
            if (model.isNullOrEmpty(pwd)) {
                var msg = messages.PWD_ISNULL;
                This.showTip(This.mailPwd, msg);
                return false;
            } else {
                This.hideTip(This.mailPwd);
                return true;
            }
        },
        checkEmail : function(){
            var This = this;
            var model = This.model;
            var messages = This.messages;
            
            var email = This.passwordEmail.val();
            if(model.isNullOrEmpty(email)){
                This.showTip(This.passwordEmail, messages.EMAIL_ISNULL);
                return false;
            }else if(!top.$T.Email.isEmail(email)){
                This.showTip(This.passwordEmail, messages.EMAIL_FORMAT_ERROR);
                return false;
            }else if(This.isSelfEmail(email)){
                return false;
            }else {
                This.hideTip(This.passwordEmail);
                return true;
            }
        },
        isSelfEmail : function(email){
            var This = this;
            var messages = This.messages;
            
            var selfEmails = top.$User.getAccountList();
            for(var i = 0,len = selfEmails.length; i<len; i++){
                var selfEmail = selfEmails[i];
                if($.trim(email) == selfEmail.name){
                    if(selfEmail.type == 'fetion'){
                        This.showTip(This.passwordEmail, messages.EMAIL_FETION_ERROR);
                    } else {
                        This.showTip(This.passwordEmail, messages.EMAIL_SELF_ERROR);
                    }
                    return true;
                }
            }
            return false;
        },
        showTip: function (dom, tip) {
            var html = this.templete.pwdTip.replace("{errTip}", tip);
            dom.next("span").remove();
            dom.after(html);
        },
        hideTip: function (dom) {
            dom.next("span").remove();
        },
        goBack: function(){
            setTimeout(function(){
                location.assign("account.html?sid=" + parent.$App.getSid());
            }, 0);
            return false;
        }
    }));
    $(function () {
        var passwordquestionView = new M2012.Settings.View.Passwordquestion();
    });
})(jQuery, _, M139);