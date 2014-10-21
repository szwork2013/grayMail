(function ($, _, M) {

    EventsAggr = window.EventsAggr || {};

    if (!EventsAggr.Groups) {
        var _this = window._EA_G = top.$Addr_EA_G = EventsAggr.Groups = {
            events: {
                SELECT_GROUP: "select:group",
                GROUP_SELECTED: "group:selected",

                ADD_GROUP: "add:group",
                GROUP_ADDED: "group:added",
                EDIT_GROUP: "edit:group",
                GROUP_EDITED: "group:edited",
                DELETE_GROUP: "delete:group",
                GROUP_DELETED: "group:deleted",

                RENDER_GROUPS : "render:groups",
                
//                RESET_GROUPS_LIST_HEIGHT : "reset:groupListHeight",

                EDIT_SEL_GROUP: "selectedGroup:edit",
                DELETE_SEL_GROUP: "selectedGroup:delete",
                AUTO_LOCATE_NAV: "autoLocate:groupsNav",

                LOCATE_SELECTED_GROUP: "locateSelectedGroup",

                // CREATE_GROUPS: "create:groups",
                // GROUPS_CREATED: "groups:created",
                // UPDATE_GROUPS: "update:groups",
                // GROUPS_UPDATED: "groups:updated",
                // DELETE_GROUPS: "delete:groups",
                // GROUPS_DELETED: "groups:deleted",
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
