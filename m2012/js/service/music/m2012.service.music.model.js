/**
* @fileOverview 定义设置页基本参数的文件.
*/

(function (jQuery, _, M139) {
    /**
    *@namespace 
    *我的应用-无线音乐
    */
    M139.namespace('M2012.Service.Music.Model', Backbone.Model.extend(
    /**
    *@lends M2012.Settings.Spam.Model.prototype
    */
    {
        defaults: {},
        getAdvData: function (callback) {
            var self = this;
            var options = {
                positionCodes: 'web_040,web_041,web_042,web_043'
            };
            top.M139.RichMail.API.call("unified:getUnifiedPositionContent", options, function (response) {
                if (response.responseData.code && response.responseData.code == "S_OK") {
                    var data = response.responseData["var"];
                    callback(data);
                }
            });
        }
    }));
})(jQuery, _, M139);