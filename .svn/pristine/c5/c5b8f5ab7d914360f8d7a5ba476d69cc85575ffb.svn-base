(function($, _, M) {

    EventsAggr = window.EventsAggr || {};

    if (!EventsAggr.AndAddrContacts) {
        var _this = window._EA_AND_C = EventsAggr.AndAddrContacts = {
            events : {
                RENDER_CONTACTS : "render:contacts",

                NO_CONTACTS_RENDER : "noContacts:render",
                CONTACTS_RENDERED : "contacts:rendered",

                // contacts list control events
                SELECT_PAGE : "select:page",
                UNSELECT_PAGE : "unselect:page",
                UNSELECT_ALL : "unselect:all",

                RESET_CONTACTS_LIST_HEIGHT : "reset:contactsListHeight",
                END : "END"
            }
        };

        _this.eventName = function(eventKey) {
            return _this.events[eventKey];
        };

        _this.keyTrigger = function(eventKey, data, options) {
            _this.trigger(_this.eventName(eventKey), data, options);
        };

        _this.keyOn = function(eventKey, callback, context) {
            _this.on(_this.eventName(eventKey), callback, context);
        };

        _.extend(_this, Backbone.Events);
    }

})(jQuery, _, M139);
