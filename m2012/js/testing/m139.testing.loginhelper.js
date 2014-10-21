/**
 * @fileOverview 此文件定义便于自动化测试使用的类库.
 */

 (function (){

 /**定义登录测试类
*@namespace
*@name M139.Testing.LoginHelper
*/
 var LoginHelper = Backbone.Model.extend(
  /**@lends M139.Testing.LoginHelper*/
 {
    /**
    *登录
    */
    login:function(options,callback){
        var This = this;
        //选择环境：研发、测试线、生产线
        for(var i=0;i<options.length;i++){
            var line = options[i];
            if(location.host.indexOf(line.site) > -1){
                options = options[i];
                break;
            }
        }

        var successUrl = "http://" + location.host + "/m2012/js/testing/loginsuccess.html";
        var loginUrl = "http://" + location.host.replace(/\w+\.(mail\.10086)/,"$1")+"/login/login.ashx?";
        loginUrl += "&UserName=" + encodeURIComponent(options.id);
        loginUrl += "&Password=" + encodeURIComponent(options.password);
        loginUrl += "&VerifyCode=&auto=0";
        loginUrl += "&loginSuccessUrl=" + encodeURIComponent(successUrl);

        $("<iframe style='display:none' name='loginproxy' id='loginproxy'></iframe>").appendTo(document.body).load(function(){
            var win = this.contentWindow;
            var m = win.location.href.match(/sid=([^&]+)/);
            if(m){
                var sid = m[1];
                if(callback)callback();
                This.trigger("login",sid);
            }
        }).attr("src",loginUrl);
    }
 });

M139.namespace("M139.Testing.LoginHelper",new LoginHelper());

})();