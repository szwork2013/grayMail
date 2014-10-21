(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Contacts.Filter.InitialLetter";

    M.namespace(_class, superClass.extend({

        name : _class,

        el : "#m139-contacts-list #initial-letter-filter",

        events : {
            "click a" : "doFilter"
        },

        logger : new M139.Logger({ name: _class }),

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);

            EventsAggr.Contacts.keyOn("NO_CONTACTS_RENDER", _this.onNoContactsRender, _this);
            EventsAggr.Contacts.keyOn("CONTACTS_RENDERED", _this.onContactsRedered, _this);

            _this.model.on("change:initialLetter", _this.changeLetter, _this);
        },

        onNoContactsRender : function() {
            this.$el.toggle(false);
        },

        onContactsRedered : function() {
            this.$el.toggle(true);
        },

        doFilter : function(ev) {
            top.BH("addr_contacts_initialLetterFilter");

            var $el = $(ev.target);
            var newInitialLetter = $el.text().trim().toLowerCase();
            this.model.set("initialLetter", newInitialLetter);
        },

        changeLetter : function(model) {
            // var eventsAggr = EventsAggr.Contacts;
            // eventsAggr.keyTrigger("FILTER_INITIAL_LETTER", model.get("initialLetter"));
            this.render();
        },

        render : function() {
            var initialLetter = this.model.get("initialLetter");
            this.$("a").each(function(i, el) {
                var $el = $(el);
                var isMatch = $el.text().trim().toLowerCase() == initialLetter;
                $el.toggleClass("on", isMatch);
            });
        },

        dispose : function() {

        }
    }));

})(jQuery, _, M139);
