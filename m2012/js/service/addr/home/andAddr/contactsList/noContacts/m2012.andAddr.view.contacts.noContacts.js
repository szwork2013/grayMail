(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.AndAddr.View.Contacts.NoContacts";

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        logger : new M139.Logger({ name: _class }),

        template : _.template($('#tpl-no-andAddr-contacts').html()),

        events : {
            "click #btnDownloadAndAddrClient" : "downloadAndAddrClient"
        },

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);
        },

        render : function() {
            this.$el.html(this.template());
            return this;
        },

        downloadAndAddrClient : function(){
            top.BH("addr_andAddr_downloadClient");
        },

        dispose : function() {

        }
    }));

})(jQuery, _, M139);
