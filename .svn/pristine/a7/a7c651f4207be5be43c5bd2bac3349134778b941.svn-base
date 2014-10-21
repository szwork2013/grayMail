(function ($, _, M) {

    EventsAggr = window.EventsAggr || {};

    if (!EventsAggr.AndAddrGroups) {
        var _this = window._EA_AND_G = EventsAggr.AndAddrGroups = {
            events: {
                SELECT_AND_GROUP: "select:group",
                AND_GROUP_SELECTED: "group:selected",

                RENDER_GROUPS : "render:groups",
                
//                RESET_GROUPS_LIST_HEIGHT : "reset:groupListHeight",

                END : "END"
            }
        };
        _this.eventName = function (eventKey) {
            return _this.events[eventKey];
        };
        _this.keyTrigger = function (eventKey, data, options) {
            _this.trigger(_this.eventName(eventKey), data, options);
        };
        _this.keyOn = function (eventKey, callback, context) {
            _this.on(_this.eventName(eventKey), callback, context);
        };
        _.extend(_this, Backbone.Events);
    }

})(jQuery, _, M139);
