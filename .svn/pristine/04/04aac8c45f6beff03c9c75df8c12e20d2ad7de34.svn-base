(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Contacts.Selector";
    if (window.ADDR_I18N) {
        var PageMsg = ADDR_I18N[ADDR_I18N.LocalName].home;
    }

    M.namespace(_class, superClass.extend({

        name : _class,

        el : "#m139-contacts-list #contacts-header",

        events : {
            "click #toggle-all-contacts" : "toggleAllContacts",
            "click #toggle-page-contacts" : "togglePageContacts",
            "click #clean-selected-contacts" : "cleanSelectedContacts",
            "click .sort" : "sortContacts"
        },

        logger : new M139.Logger({ name: _class }),

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);

            _this.mSelector = options.mSelector;
            _this.mSort = options.mSort;

            _this.listenEvents();
        },

        listenEvents : function() {
            EventsAggr.Contacts.keyOn("CONTACT_TOGGLED", this.onContactToggled, this);
            _EA_C.keyOn("CHANGE_SELECTED_CONTACTS", this.onChangeSelectedContacts, this);

            this.mSelector.on("change", this.onSelectorChanged, this);
            this.mSort.on("change", this.onSortChanged, this);
        },

        sortContacts : function(ev) {
            top.BH("addr_contacts_sort");

            var idPrefix = "title-";
            var $el = $(ev.target).closest("div.sort-container");
            var sortKey = $el.attr("id").slice(idPrefix.length);
            var currentOrder = this.mSort.get(sortKey);
            this.mSort.resetAll();
            this.mSort.set(sortKey, this.switchSortOrder(currentOrder));

            // EventsAggr.Contacts.keyTrigger("SORT_CONTACTS", this.mSort);
        },

        switchSortOrder : function(order) {
            var result = -order;
            if (result == 0) {
                result = 1;
            }
            return result;
        },

        onSelectorChanged : function(model) {
            if (model.noneSelected()) {
                this.$("#title-name").removeClass("hide");
                this.$("#title-selected").addClass("hide");
            } else {
                this.$("#title-name").addClass("hide");
                this.$("#title-selected").removeClass("hide");
            }

            if (model.get("pageSelected")) {
                this.$("#toggle-page-contacts").prop("checked", true);
            } else {
                this.$("#toggle-page-contacts").prop("checked", false);
            }

            this.$("#selected-num").text(model.get("selectedNum"));
        },

        onSortChanged : function(model) {
            this.setSortHeaderStyle(this.$("#title-name"), model.get("name"));
            this.setSortHeaderStyle(this.$("#title-email"), model.get("email"));
            this.setSortHeaderStyle(this.$("#title-mobile"), model.get("mobile"));
        },

        setSortHeaderStyle : function($target, order) {
            var $el = $target.find("span.order");
            $el.removeClass("i-d-up i-d-down");
            if (order == 1) {
                $el.addClass("i-d-up");
            } else if (order == -1) {
                $el.addClass("i-d-down");
            }
        },

        render : function() {
            // this.$el.html(this.template(this.mSelector.toJSON()));
            return this;
        },

        toggleAllContacts : function(ev) {
            // do not add this code, or you cannot toggle the checkbox as you want.
            // ev.preventDefault();

            var checked = $(ev.target).prop("checked");
            var key = checked ? "SELECT_ALL" : "UNSELECT_ALL";
            EventsAggr.Contacts.keyTrigger(key);
        },

        togglePageContacts : function(ev) {
            top.BH("addr_contacts_multiPageSelect");

            var checked = $(ev.target).prop("checked");
            var key = checked ? "SELECT_PAGE" : "UNSELECT_PAGE";
            EventsAggr.Contacts.keyTrigger(key);
        },

        cleanSelectedContacts : function(ev) {
            ev.preventDefault();

            top.BH("addr_contacts_multiPageUnselect");

            EventsAggr.Contacts.keyTrigger("UNSELECT_ALL");
        },

        // { Inner events handlers }

        // { Outer events handlers }
        onContactToggled : function(select) {
            var selectedNum = this.mSelector.get("selectedNum");
            if (select) {
                selectedNum += 1;
            } else {
                selectedNum -= 1;
            }

            this.mSelector.set("selectedNum", selectedNum);
        },

        onChangeSelectedContacts : function() {
            this.mSelector.set("selectedNum", _Contacts.getSelectedContactsNum());
        },

        dispose : function() {

        }
    }));

})(jQuery, _, M139);
