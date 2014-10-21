/**
    * @fileOverview 定义设置页验证安全锁密码Model层的文件.
*/

(function (jQuery, _, M139) {

    /**
        *@namespace 
        *设置页验证安全锁密码Model层
    */
    M139.namespace('M2012.Settings.VerifyLock.Model', Backbone.Model.extend(
        /**
        *@lends M2012.Settings.VerifyLock.Model.prototype
        */
        {
            defaults: {
                num: 3, // 一行显示三个文件夹
                userFolderstats: [],
                popFolderstats: []
            },
            /**
            *获取代收文件夹的数据
            *@param {String} folder:文件夹类型
            */
            setFolderPass: function (callback) {
                var password = $("#verifyPass").val();
                var options = [{
                    type: 3,
                    oldpass: password
                }];
                $RM.setFolderPass(options, function (result) {
                    callback(result);
                });
            }
        })
    );

})(jQuery, _, M139);

