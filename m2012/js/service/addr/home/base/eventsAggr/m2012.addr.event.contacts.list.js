(function($, _, M) {

    EventsAggr = window.EventsAggr || {};

    if (!EventsAggr.Contacts) {
        var _this = window._EA_C = top.$Addr_EA_C = EventsAggr.Contacts = {
            events : {
                // contacts CRUD events
                // CREATE_CONTACTS : "create:contacts",
                // CONTACTS_CREATED : "contacts:created",
                // UPDATE_CONTACTS : "update:contacts",
                // CONTACTS_UPDATED : "contacts:updated",
                // DELETE_CONTACTS1 : "delete:contacts1",
                // CONTACTS_DELETED1 : "contacts:deleted1",

                ADD_CONTACT : "add:contact",
                CONTACT_ADDED : "contact:added",
                EDIT_CONTACT : "edit:contact",
                CONTACT_EDITED : "contact:edited",
                DELETE_CONTACTS : "delete:contacts",
                CONTACTS_DELETED : "contacts:deleted",

                MOVE_TO_GROUP : "moveTo:group",
                GROUP_MOVED_TO : "group:movedTo",
                COPY_TO_GROUP : "copyTo:group",
                GROUP_COPIED_TO : "group:copiedTo",
                
                RENDER_CONTACTS : "render:contacts",
                
                // TODO
                SYN_CONTACTS : "syn:contacts", // 更新联系人
                CONTACTS_SYNED : "contacts:syned",
                MERGE_CONTACTS : "merge:contacts", // 合并联系人
                CONTACTS_MERGED : "contacts:merged",
                IMPORT_CONTACTS : "import:contacts",
                CONTACTS_IMPORTED : "contacts:imported",

                NO_CONTACTS_RENDER : "noContacts:render",
                CONTACTS_RENDERED : "contacts:rendered",

                // contacts list control events
                SELECT_ALL : "select:all",
                UNSELECT_ALL : "unselect:all",
                SELECT_PAGE : "select:page",
                UNSELECT_PAGE : "unselect:page",
                CONTACT_TOGGLED : "contact:toggled",
                CHANGE_SELECTED_CONTACTS : "change:selectedContacts",

                RESET_CONTACTS_LIST_HEIGHT : "reset:contactsListHeight",
                // contact(s) behavior events
                // SEND_EMAIL : "send:email",
                // SEND_SM : "send:shortMessage"
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
