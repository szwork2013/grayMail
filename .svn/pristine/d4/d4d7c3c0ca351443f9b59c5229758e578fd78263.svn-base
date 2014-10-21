
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;

    M139.namespace('Evocation.Main.View', superClass.extend({
        
        initialize: function (option) {
            this.model = new Evocation.Main.Model();
            this.initEvents(option);
        },

        initEvents: function (option) {
            var items = option || {};
            this.model.set(items);
            this.render(option);
        },

        render: function (option) {  //根据类别new不同的类
            var type = this.model.get('type');
            switch (type + "") {
                case "compose":
                case "1":
                    this.popupEvent = new Evocation.Compose.View({ model: this.model });
                    break;
                case "sms":
                    if(!top.$User.isChinaMobileUser()){
                        top.$Msg.alert("短信功能仅针对对移动手机用户");
                        return;
                    }
                    this.popupEvent = new Evocation.Smsnew.View({ model: this.model });
                    break;
                case "2":
                    if(!top.$User.isChinaMobileUser()){
                        top.$Msg.alert("短信功能仅针对对移动手机用户");
                        return;
                    }
                    this.popupEvent = new Evocation.Sms.View({ model: this.model });
                    break;
                case "3":
                    if(!top.$User.isChinaMobileUser()){
                        top.$Msg.alert("短信功能仅针对对移动手机用户");
                        return;
                    }
                    this.popupEvent = new Evocation.Mms.View({ model: this.model });
                    break;
                case "4":
                    this.popupEvent = new Evocation.Greetingcard.View({ model: this.model });
                    break;
                case "5":
                    top.$App.show('account_setname');
                    break;
                case "6":
                    this.popupEvent = new Evocation.SetAliasName.View({ model: this.model });
                    break;
                case "remind":
                    option.type = "evocationRemind";
                    $App.trigger("evocationRemind", option);
                    break;
            }
        }
    }));


})(jQuery, _, M139);


