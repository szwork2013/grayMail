(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.UmcUser";

    M.namespace(_class, superClass.extend({

        name : _class,

        defaults : {
//            isUmcUser : null, // 是否是互联网通信证用户：null 未知 true 是 false 不是
            regStatus : 10 // 注册行为状态：10 未点击注册 20 注册中 30 注册结束
        },

        initialize : function(contact) {
            superClass.prototype.initialize.apply(this, arguments);
        },

        setRegisterComplete : function() {
            this.set("regStatus", 30);
        },

        setRegistering : function() {
            this.set("regStatus", 20);
        },

        isRegistering : function() {
            return this.get("regStatus") == 20;
        },

        checkUmcUser : function(cbUmc, context) {
            var _this = this;

            top.$User.isUmcUserAsync(function(isUmcUser) {
               // TODO test only
//               isUmcUser = false;
               if (isUmcUser)  {
                   cbUmc.apply(context, arguments);
               } else {
                   if (_this.isRegistering()) {
                       _this.setRegisterComplete();

                       // 从后台重新获取用户状态
                       var data = top.$App.getConfig("UserData");
                       data.isumcuser = undefined;
                       top.$App.trigger("userAttrChange");

                       _this.checkUmcUser(cbUmc, context);
                   } else {
                       // pop up register page
                       var content = "想拥有“和通讯录”吗？<br/>升级互联网通行证，即刻拥有";
                       var dialog = top.$Msg.confirm(content, function () {
                           top.BH("addr_addr_registerUMC");
                           _this.setRegistering();
                           _this.registerLicense();
                       }, "", "", {
                           isHtml : true,
                           buttons : ["升级互联网通行证", "关 闭"]
                       });
                   }
               }
            });
        },

        registerLicense: function () {
            var TO_UPDATE = 1;
            var reqData = { optype: TO_UPDATE };
            var url = top.M139.HttpRouter.getUrl("umc:rdirectCall").replace("/setting/", "/mw2/setting/");
            url = $Url.makeUrl(url, reqData);
            window.open(url);
        },

        end : function() {

        }
    }));

})(jQuery, _, M139);
