(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Base.Utils.Global";

    M.namespace(_class, superClass.extend({

        name : _class,

        defaults : {

        },

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);

            this.initGlobalFunctions();
            this.initGlobalProperties();
        },

        initGlobalFunctions : function() {
            window._Now = function() {
                return new Date().getTime();
            };

            window._AlertMsg = function() {
                top.$Msg.alert.apply(top.$Msg, arguments);
            };

            window._ShowTipMsg = function(msg, options) {
                top.M139.UI.TipMessage.show(msg, options);
            };

            window._HideTipMsg = function() {
                top.M139.UI.TipMessage.hide();
            };

            window._IsAddrOpen = function() {
                return top.$App.getCurrentTab().name == "addr";
            };

            window._Log = function(msg) {
                if (window.console) {
                    console.log(msg);
                }
            };
        },

        initGlobalProperties : function() {
            // test only
            window.parent._Child = window;
            window._New_EA = true;
            window._Show_And_Addr = true;
            window._Local_And_Addr = false;
        }
    }));

})(jQuery, _, M139);
