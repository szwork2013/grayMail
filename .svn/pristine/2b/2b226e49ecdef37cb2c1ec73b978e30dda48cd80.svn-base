(function (jQuery, _, M139) {
    var $ = jQuery;
    /**
     *@namespace
     *@name M2012.Settings.Model.Password
     */
    M139.namespace('M2012.Settings.Model.Password', Backbone.Model.extend({
        defaults: {
            verifyType: 1, //验证类型:1,邮箱密码；2，手机验证码
            updated: false  //是否修改成功
        },
        initialize: function () {

        },
        sendMessage: function (callback) {
            //发送短信验证码
            M139.RichMail.API.call("user:sendPasswordAction", {}, function (response) {
                //console.log("发送短信的返回码：" + JSON.stringify(response.responseData));
                callback(response.responseData); //验证
            });
        },
        /**
        *检查2个密码是否一致,一般用于新密码和确认密码
        */
        checkPassword: function (password, passwordConfirm) {
            return password == passwordConfirm;
        },
        isMatch: function (pwd, pwdConfirm) {
            return pwd == pwdConfirm;
        },
        isMatchRule: function (password) {
            if (!/^[a-zA-Z0-9]{6,15}$/.test(password)) {
                return false;
            }
            return true; //测试，直接返回
        },
        /**
        *更新密码
        *@param {Object} data 旧密码（验证码）、新密码、密码类型
        *@returns {Object} 返回的结果
        */
        updatePassword: function (data, callback) {
            var This = this;
            if (This.busy) {
                return;
            }

            M139.RichMail.API.call("user:updatePasswordAction", data, function (response) {
                callback(response.responseData); //验证
                This.busy = false;
            });
            This.busy = true;
        },
        getMobile: function () {
            return parent.$User.getShortUid();
        },
        /**
        *检查字符串是否为空（去掉头尾空格）
        */
        isNullOrEmpty: function (str) {
            if (str) {
                if (typeof (str) != "string") {
                    throw "验证的内容非字符串";
                }
                return $.trim(str) == "";
            }
            return true;
        }
    })
    );
})(jQuery, _, M139);