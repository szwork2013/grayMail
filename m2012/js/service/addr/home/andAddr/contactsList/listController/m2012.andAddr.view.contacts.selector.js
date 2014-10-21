(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.AndAddr.View.Contacts.Selector";

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        // el : "#and-contacts-list #contacts-header",

        events : {
            "click #toggle-page-contacts" : "togglePageContacts",
            "click #clean-selected-contacts" : "cleanSelectedContacts"
        },

        logger : new M139.Logger({ name: _class }),

        initialize : function(options) {
            superClass.prototype.initialize.apply(this, arguments);

            this.mSelector = options.mSelector;

            this.listenEvents();
        },

        listenEvents : function() {
            this.mSelector.on("change:selectedNum", this.changeSelectedNum, this);
            this.mSelector.on("change:pageSelected", this.changePageSelected, this);
        },

        changeSelectedNum : function() {
            this.$("#selected-num").text(this.mSelector.get("selectedNum"));
            var hasSelected = !this.mSelector.noneSelected();
            this.$("#title-name").toggle(!hasSelected);
            this.$("#title-selected").toggle(hasSelected);
        },

        changePageSelected : function() {
            var hasPageSelected = this.mSelector.get("pageSelected");
            this.$("#toggle-page-contacts").prop("checked", hasPageSelected);
        },

        render : function() {
            // The content has preloaded.
            return this;
        },

        togglePageContacts : function(ev) {
//            top.BH("addr_contacts_multiPageSelect");

            var checked = $(ev.target).prop("checked");
            var key = checked ? "SELECT_PAGE" : "UNSELECT_PAGE";
            _EA_AND_C.keyTrigger(key);
        },

        cleanSelectedContacts : function(ev) {
            ev.preventDefault();

//            top.BH("addr_contacts_multiPageUnselect");

            _EA_AND_C.keyTrigger("UNSELECT_ALL");
        },

        dispose : function() {

        }
    }));

})(jQuery, _, M139);
