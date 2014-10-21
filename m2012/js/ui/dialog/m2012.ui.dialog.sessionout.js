/**
 * @fileOverview 定义登录超时，要求重新登录的对话框
 */

 (function(jQuery,_,M139){
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.Dialog.SessionOut";

    M139.namespace(namespace,superClass.extend(
    /**@lends M2012.UI.Dialog.SessionOut.prototype*/
    {
       /** 定义通讯录地址本组件代码
        *@constructs M2012.UI.Dialog.SessionOut
        *@extends M139.View.ViewBase
        *@param {Object} options 初始化参数集
        *@example
        */
        initialize: function (options) {
            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: namespace,
        template:['<div class="loginlogntime">',
 			'<h3><i class="i_warn mr_5"></i>离开太久啦，请重新登录！</h3>',
 			'<form method="post">',
 				'<fieldset class="boxIframeText">',
 					'<legend class="hide">重新登录</legend>',
 				'<ul class="form">',
 					'<li class="formLine">',
 						'<label class="label">帐号：</label>',
                        '<input id="sessionOutAccount" type="hidden" name="UserName" />',
                        '<input type="hidden" name="VerifyCode" />',
 						'<div class="element">',
 							'<div class="name Account">',
 							'</div>',
 						'</div>',
 					'</li>',
 					'<li class="formLine">',
 						'<label class="label" for="sessionOutPwd">密码：</label>',
 						'<div class="element">',
 						'<input name="Password" id="sessionOutPwd" maxlength="30" type="password" class="iText" value="" />',
 						'<div class="red ErrorTip" style="display:none">密码不能为空</div>',
 						'</div>',
 					'</li>',
 				'</ul>',
 				'</fieldset>',
 			'</form>',
 		'</div>'].join(""),

        /**构建dom函数*/
        render:function(){
            var This = this;
            var options = this.options;

            this.dialog = $Msg.showHTML(this.template,function(e){
                This.onLoginClick(e);
            },{
                width:"385px",
                buttons:["登录"],
                onClose: function() {
                    This.trigger('remove');
                }
            });

            this.setElement(this.dialog.el);

            this.initForm();
            this.setAccount();

            return superClass.prototype.render.apply(this, arguments);
        },

        setAccount: function () {
            var uid = "";
            try{
                uid = $User.getLoginName();
            } catch (e) { }
            if (uid) {
                this.$(".Account").text(uid + "@" + $App.getMailDomain());
                this.$("#sessionOutAccount").val(uid);
            } else {
                //取不到用户名，直接跳转到登录页
                //访问自动登录接口，失败后会返回mail.10086.cn#return，防止死循环访问
                location.replace("http://mail." + document.domain + "/#return");
                this.remove();
            }
        },

        initForm: function () {
            var url = "http://mail." + document.domain + "/login/login.ashx";
            this.$("form").attr("action", url);
        },

        onLoginClick: function (e) {
            if (this.$("input:password").val() == "") {
                this.$(".ErrorTip").show();
            } else {
                this.$("form").submit();
            }
            e.cancel = true;
        }
    }));
 })(jQuery,_,M139);