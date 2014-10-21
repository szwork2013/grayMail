(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Contacts.NoContacts";

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        logger : new M139.Logger({ name: _class }),

        template : _.template($('#tpl-no-contacts').html()),

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);
        },

        render : function() {
            this.$el.html(this.template());

            this.ui = {};
            this.ui.btnImport = this.$('#btnImport');
            this.ui.btnCreateContact = this.$('#btnCreateContact');

            this.initEvents();

            return this;
        },

        initEvents: function(){
            var _this = this;

            this.ui.btnImport.click(function(){
                if(window.$Addr){                
                    var master = window.$Addr;
                    master.trigger(master.EVENTS.REDIRECT, {key: 'addr_allNone_import'});                    
                }
            });

            this.ui.btnCreateContact.click(function(){
                if( window.$Addr){                
                    var master = window.$Addr;
                    master.trigger(master.EVENTS.REDIRECT, {key: 'addr_allNone_create'});                    
                }
            });
        },

        dispose : function() {

        }
    }));

})(jQuery, _, M139);
