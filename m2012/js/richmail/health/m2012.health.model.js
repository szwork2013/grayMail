/**
 * @fileOverview 我的应用
 */
(function (jQuery, _, M139) {

    /**
     * @namespace
     * 我的应用
     */

    M139.namespace("M2012.Health.Model",Backbone.Model.extend({
        defaults:{
            HealthyHistory: {
                'totalScore': '',
                'isTrustForwardMail': '',
                'isTrustAutoLogin':'',
                'lastUpdateTime':""
            },
            HealthyInfo: {
                "userNumber":"13557539290",
                "passwordStrength":"-1",
                "passwordStrengthScore":"10",
                "passwdProtect":"-1",
                "passwdProtectScore":"10",
                "pilferDate":"-1",
                "pilferDateScore":"5",
                "loginException":"-1",
                "loginExceptionScore":"5",
                "forwardMail":"-1",
                "forwardMailScore":"-1",
                "trustForwardMail":"-1",
                "virusScan":"-1",
                "virusScanScore":"-1",
                "autoLogin":"-1",
                "autoLoginScore":"-1",
                "trustAutoLogin":"-1",
                "umcUser":"-1",
                "umcUserScore":"-1",
                "limitCapacity":"-1",
                "limitCapacityScore":"-1",
                "limitAllMail":"-1",
                "limitAllMailScore":"-1",
                "limitUnread":"-1",
                "limitUnreadScore":"-1",
                "limitAdvert":"-1",
                "limitAdvertScore":"-1",
                "limitDraft":"-1",
                "limitDraftScore":"-1",
                "limitDiskCapacity":"-1",
                "limitDiskCapacityScore":"-1",
                "expireLargeattach":"-1",
                "expireLargeattachScore":"-1",
                "setAlias":"-1",
                "setAliasScore":"-1",
                "setSendName":"-1",
                "setSendNameScore":"-1",
                "setBirthday":"-1",
                "setBirthdayScore":"-1",
                "setImage":"-1",
                "setImageScore":"-1",
                "bindingPhone":"-1",
                "bindingPhoneScore":"-1",
                "totalScore":"-1",
                "isLoad":"-1"
            }
        },
        initialize: function(){
            var self = this;
            M139.RichMail.API.call("healthy:getHealthyHistory", {},function(data){
                var msg = data.responseData;
                if(msg['code'] == 'S_OK'){
                    self.set('HealthyHistory', msg['var']);
                }else{
                    top.$App.showSessionOutDialog();
                }
            });
        }
    }));

})(jQuery, _, M139);
