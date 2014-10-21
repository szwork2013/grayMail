/**
* @fileOverview 定义设置页基本参数的文件.
*/


(function (jQuery, _, M139) {
    /**
    *@namespace 
    *设置页基本参数
    */
    M139.namespace('M2012.Settings.Spam.Model', Backbone.Model.extend(
    /**
    *@lends M2012.Settings.Spam.Model.prototype
    */
        {
        defaults: {
            spam_level: null,
            spam_deal: null,
            virus_status: null,
            virus_sucess: null,
            virus_fail: null,
            virus_doubt: null,
            virus_notify_me: 0,
            virus_notify_send: 0,
            type: null, //1 黑名单   0白名单
            opType: null//delete  删除黑白名单   add 新增黑白名单
        },
        /**
        *获取代收文件夹的数据
        */
        getWaste: function (callback) {
            var options = {
                attrIds: [
                    ]
            }
            $RM.getAttrs(options, function (result) {
                callback(result["var"]);
            });
        },
        getWhiteBlackList: function (options, callback) {
            $RM.getWhiteBlackList(options, function (result) {
                if (result && result["var"]) {
                    callback(result["var"]);
                }
            });
        },
        setWhiteBlackList: function (options, callback) {
            $RM.setWhiteBlackList(options, function (result) {
                callback(result);
            });
        },
        setPreference: function (callback) {
            var options = {
                attrs: {
                    spam_level: this.get("spam_level"),
                    spam_deal: this.get("spam_deal"),
                    virus_status: this.get("virus_status"),
                    virus_sucess: this.get("virus_sucess"),
                    virus_fail: this.get("virus_fail"),
                    virus_doubt: this.get("virus_doubt"),
                    virus_notify_me: this.get("virus_notify_me"),
                    virus_notify_send: this.get("virus_notify_send")
                }
            }
            $RM.setAttrs(options, function (result) {
                callback(result);
            });
        },
        getMessages: {
            operateSuccess: "您的设置已保存",
            spamSaveError: "服务器繁忙，请稍后再试",
            confirmDel: "确定将 {0} 从名单中删除？",
            delAll: "确定要删除选中的邮件地址？",
            mailAddrError: '格式错误，如：test@example.com',
            domainAddrError: '格式错误，如：*@example.com',
            selectMailToDel:'请选择之后再删除',
            mailAddrExist:'输入框有已经设置过的邮件地址',
            addSuccess:'{0}名单添加成功',
            delSuccess:'{0}名单删除成功'

        }
    })
    );

})(jQuery, _, M139);