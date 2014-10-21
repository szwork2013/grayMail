(function (jQuery, _, M139) {
    var $ = jQuery;
    /**
     *@namespace
     *@name M2012.Settings.Model.Passwordprotection

     */
    M139.namespace('M2012.Settings.Model.Passwordprotection', Backbone.Model.extend({
        /**
        *初始化
        */
        initialize: function () {

        },
        /**
        *验证邮箱密码
        *@param {Object} data {passwordVal}
        *@returns {Object} 返回的结果
        */
        verifyEmailPassword: function(data,callback){
            var This = this;
            M139.RichMail.API.call("user:checkPassword", data, function (response) {
                if(callback) callback(response.responseData); 
                This.busy = false;
            });
            This.busy = true;
        },
        /**
        *获取密保问题
        *@param {Object} data {}
        *@returns {Object} 返回的结果
        */
        getPasswordQuestion: function(data,callback){
            M139.RichMail.API.call("user:getQuestion", data, function (response) {
                if(callback) callback(response.responseData);
            });
        },
        /**
        *设置密保
        *@param {Object} data {question:'',answer:'',type:'1'},{email:'',type:'2'}
        *@returns {Object} 返回的结果
        */
        setPasswordProtect: function(data,callback){
            M139.RichMail.API.call("user:setPasswordProtect", data, function (response) {
                if(callback) callback(response.responseData);
            });
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
    }));
})(jQuery, _, M139);