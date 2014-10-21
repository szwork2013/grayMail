(function ($, _, M139) {

    M139.namespace('M2012.Settings.Model.Notice', Backbone.Model.extend({
        defaults: {
            lastAddr:"",
            noticeType: 0, //0，每次发送；1，不发送；2，异常时发送；
            lastLogin: ""
        },
        func: {
            getNotice: "user:getLoginNotify",
            setNotice: "user:setLoginNotify"
        },
        initialize: function () {
            
        },
        getSettings:function(callback){
            var This = this;
            M139.RichMail.API.call(This.func.getNotice, {}, function (response) {
                var respData = response.responseData;
                if (callback && respData) {
                    callback(respData);
                }
            });
        },

        hasChange: function() {
            return this.get("noticeType") != this.get("lastNoticeType");
        },

        update: function (callback) {
            var This = this;

            if (!This.hasChange()) {
                return;
            }

            var data = { configValue: This.get("noticeType").toString() };
            M139.RichMail.API.call(This.func.setNotice, data, function (response) {
                var respData = response.responseData;
                if (callback && respData) {
                    var result = "FA_DEFAULT";

                    if (respData.code == "S_OK") {
                        result = "S_UPDATE";
                        This.set({
                            "lastNoticeType": This.get("noticeType")
                        });

                    } else if (result.code == "S_FALSE") {
                        result = "FA_TIMEOUT";

                    }

                    callback(result);
                }
            });
        }
    })
    );
})(jQuery, _, M139);