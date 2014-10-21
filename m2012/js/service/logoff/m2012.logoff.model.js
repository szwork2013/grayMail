/**   
* @fileOverview 注销
*/
(function (jQuery, _, M139) {
    /**
    *@namespace 
    *注销MODEL层
    */

    M139.namespace("M2012.Service.Logoff.Model", Backbone.Model.extend({

        defaults: {
    },
    message: {
        pwdError: "密码错误",
        savaError:"服务器繁忙，请稍后再试"
    },
    callApi: M139.RichMail.API.call,
    submitData: function (opitions, callback) {
        this.callApi("user:cancelMailboxAction", opitions, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    getUrlObj: function () {
        var urlObj = $T.Url.getQueryObj();
        return urlObj;
    }


}));

})(jQuery, _, M139);
