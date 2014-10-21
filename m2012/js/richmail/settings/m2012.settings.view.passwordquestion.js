(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.View.Passwordquestion', superClass.extend({
        messages: {
            OS_PWD_BUSY: "系统繁忙，请稍后再试",
            
            PWD_ISNULL: "密码不能为空，请输入邮箱密码",
            PWD_ERROR: "密码不正确，区分大小写",
            
            QUESTION_ISNULL: "请选择密保问题",
            PWDANSWER_ISNULL: "请输入密保答案",
            PWDANSWER_LENGTH: "限1-20个字符"
        },
        status: {
            OK: "S_OK",         //成功
            SESSION_TIMEOUT: "S_FALSE",  //登录超时
            PWD_ERROR: "2035",   //密码错误
            ERROR: "ERROR"       //错误？？？
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

            this.txtQuestion = $("#txtQuestion");
            this.passwordAnswer = $("#passwordAnswer");
            
            this.choosedQuestion = '请选择密保问题';
            
            this.countdownEl = $("#countdown");
            
            //邮箱密码验证 step1
            this.verifyEmailPwdArea = $("#verifyEmailPwdArea");
            //设置密保问题 step 2
            this.setPasswordQuestionArea = $("#setPasswordQuestionArea");
            //设置密保问题成功 step3
            this.setPasswordQuestionSuccArea = $("#setPasswordQuestionSuccArea");
            
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
            }else if(This.step == 'setPasswordQuestion'){
                This.setPasswordQuestion();
            }else if(This.step == 'setPasswordQuestionSucc'){
                This.goBack(); //返回设置页
            }
        },
        verifyEmailPassword : function () {
            var This = this;
            var model = This.model;
            var messages = This.messages;
            if(This.checkMailPwd()){
                var pwd = $.trim(This.mailPwd.val());
                model.verifyEmailPassword({ password: pwd }, function(result){
                    var code = result.code || null;
                    if (code) {
                        if (code == This.status.OK) { //正确
                            This.getPasswordQuestion();
                        }else{ //失败
                            var msg = messages[code] || result.msg || messages["OS_PWD_BUSY"];
                            parent.$Msg.alert(msg);
                        }
                    }
                });
            }
        },
        initPasswordQuestion : function(questions){
            var This = this;
            This.verifyEmailPwdArea.addClass('hide')
            This.setPasswordQuestionSuccArea.addClass('hide');
            This.setPasswordQuestionArea.removeClass('hide');
            $('ul.passwordStep').find('li').removeClass('on');
            $('ul.passwordStep').find('li[for="setPasswordQuestionArea"]').addClass('on');
            
            if(questions && questions.length>0){
                var menuItems = [];
                for(var i = 0, len = questions.length; i < len; i++){
                    var question = questions[i];
                    var item = {text:question,myData:question};
                    menuItems.push(item);
                }
                var dropMenu = M2012.UI.DropMenu.create({
                    defaultText : "请选择密保问题",
                    width : 220,
                    menuItems   : menuItems,
                    container   : This.txtQuestion
                });
                dropMenu.on("change",function(item){
                    if(item.myData && item.myData != '请选择密保问题'){
                        This.hideTip(This.txtQuestion);
                        This.choosedQuestion = item.myData;
                    }
                });
            }
            This.step = "setPasswordQuestion";
        },
        getPasswordQuestion : function(){
            var This = this;
            var model = This.model;
            model.getPasswordQuestion({},function(result){
                var questions = result["var"] || [];
                This.initPasswordQuestion(questions);
            });
        },
        setPasswordQuestion : function(){
            var This = this;
            var model = This.model;
            var messages = This.messages;
            if(This.checkQuestion() && This.checkAnswer()){
                var data = {
                    question : $.trim(This.choosedQuestion),
                    answer   : $.trim(This.passwordAnswer.val()),
                    type     : '1'
                };
                model.setPasswordProtect(data,function(result){
                    var code = result.code || null;
                    if(code){
                        if (code == This.status.OK){
                            top.$App.config._configs.UserData.mainUserConfig.externalquestion = ["0",data.question];
                            top.$App.config._configs.UserData.mainUserConfig.externalanswer = ["0",data.answer];
                            This.setPasswordQuestionSucc();
                        }else{
                            var msg = messages[code] || result.msg || messages["OS_PWD_BUSY"];
                            parent.$Msg.alert(msg);
                        }
                    }
                });
            }
        },
        setPasswordQuestionSucc : function(){
            var This = this;
            This.verifyEmailPwdArea.addClass('hide')
            This.setPasswordQuestionArea.addClass('hide');
            This.setPasswordQuestionSuccArea.removeClass('hide');
            This.step = "setPasswordQuestionSucc";
            $('ul.passwordStep').find('li').removeClass('on');
            $('ul.passwordStep').find('li[for="setPasswordQuestionSuccArea"]').addClass('on');
            This.countDown(2);
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
                This.showTip(This.mailPwd, messages.PWD_ISNULL);
                return false;
            } else {
                This.hideTip(This.mailPwd);
                return true;
            }
        },
        checkQuestion : function(){
            var This = this;
            var model = This.model;
            var messages = This.messages;
            
            var question = This.choosedQuestion;
            if(model.isNullOrEmpty(question) || question == '请选择密保问题'){
                This.showTip(This.txtQuestion, messages.QUESTION_ISNULL);
                return false;
            }else{
                This.hideTip(This.txtQuestion);
                return true;
            }
        },
        checkAnswer : function(){
            var This = this;
            var model = This.model;
            var messages = This.messages;
            
            var answer = This.passwordAnswer.val();
            if(model.isNullOrEmpty(answer)){
                This.showTip(This.passwordAnswer, messages.PWDANSWER_ISNULL);
                return false;
            }else if(!This.checkStrLen(answer,1,20)){
                This.showTip(This.passwordAnswer, messages.PWDANSWER_LENGTH);
                return false;
            } else {
                This.hideTip(This.passwordAnswer);
                return true;
            }
        },
        checkStrLen : function(str,min,max){
            var str = $.trim(str), minLen = min || 0, maxLen = max || 0;
            if(str.length < minLen || str.length > maxLen){
                return false;
            }
            return true;
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
            var This = this;
            setTimeout(function(){
                location.assign("account.html?sid=" + parent.$App.getSid());
                if(This.countDownTime){
                    clearInterval(This.countDownTime);
                }
            }, 0);
            return false;
        },
        countDown: function(time){
            var This = this;
            This.countdownEl.html(time);
            This.countDownTime = setInterval(function(){
                time--;
                This.countdownEl.html(time);
                if(time <= 0){
                    This.goBack();
                }
            },1000);
        }
    }));
    $(function () {
        var passwordquestionView = new M2012.Settings.View.Passwordquestion();
    });
})(jQuery, _, M139);