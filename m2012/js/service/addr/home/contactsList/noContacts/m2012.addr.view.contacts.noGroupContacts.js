(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Contacts.NoGroupContacts";

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        logger : new M139.Logger({ name: _class }),

        template : _.template($('#tpl-no-group-contacts').html()),

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);
        },

        render : function() {
            this.$el.html(this.template());

            this.ui = {};
            this.ui.btnCopyContact = this.$('#btnCopyContact');
            this.ui.btnCreateContact = this.$('#btnCreateContact');

            this.initEvents();

            return this;
        },

        initEvents: function(){
            var _this = this;
            this.ui.btnCopyContact.click(function(){                
                if(window.$Addr){                
                    var master = window.$Addr;
                    master.trigger(master.EVENTS.REDIRECT, {key: 'addr_editGroup', groupId: _Groups.selected()[0].get('id')});
                    top.BH('addr_groupNone_copyToGroup');
                }               
            });

            this.ui.btnCreateContact.click(function(){
                if(window.$Addr){ 
                    var group = _Groups.selected()[0];
                    var groupId = group.get("id");               
                    var master = window.$Addr;
                    master.trigger(master.EVENTS.REDIRECT, {key: 'addr_groupNone_create', groupId: groupId});                    
                }
            });
        },

        dispose : function() {

        }
    }));

})(jQuery, _, M139);
