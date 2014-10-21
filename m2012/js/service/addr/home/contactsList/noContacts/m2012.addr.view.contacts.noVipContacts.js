(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Contacts.NoVipContacts";

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        logger : new M139.Logger({ name: _class }),

        template : _.template($('#tpl-no-vip-contacts').html()),

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);
        },

        render : function() {
            this.$el.html(this.template());           

            this.ui = {};
            this.ui.btnAddVip = this.$('#btnAddVip');

            this.initEvents();

            return this;
        },

        initEvents: function(){
            var _this = this;

            this.ui.btnAddVip.click(function(){
                if(window.$Addr){                
                    var master = window.$Addr;
                    master.trigger(master.EVENTS.LOAD_MODULE, {
                        key: 'contact:addVip',
                        type: 'model',
                        action: 'addr_vipNone_addVip'
                    });
                }
            });
        },

        dispose : function() {

        }
    }));

})(jQuery, _, M139);
