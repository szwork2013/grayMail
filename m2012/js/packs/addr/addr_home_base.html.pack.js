(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Base.Config.Global";

    M.namespace(_class, superClass.extend({

        name : _class,

        defaults : {

        },

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);

            this.Config = {};

            this.addCfg(this.configGroup()).addCfg(this.configRenderGC()).addCfg(this.configHomeRoute());

        },

        addCfg : function(config) {
            _.extend(this.Config, config);
            return this;
        },

        configGroup : function() {
            var groupId = {
                allContacts : -1,
                noGroup : -2
            };

            var group = {
                groupId : groupId
            };

            return {
                group : group
            };
        },

        getGroupId : function(key) {
            return this.Config.group.groupId[key];
        },

        configRenderGC : function() {
            var renderGC = {
                None : 0,
                Home : 10000,
                CG : 10100,
                CG_Silent : 10150,
                UG : 10200,
                DG : 10300,
                CC : 20100,
                CC_Silent : 20150,
                UC : 20200,
                DC : 20300,
                MC2G : 20400,
                CC2G : 20401,
                IC : 20500,
                MC : 20600,
                SC : 20700
            };

            return {
                renderGC : renderGC
            };
        },

        getRenderGC : function(key) {
            return this.Config.renderGC[key];
        },

        configHomeRoute : function() {
            var homeRoute = {
                MAILBOX_MANAGE_VIP : 10100,
                REDIRECT: 10200,
                SEARCH: 10300,
                END : -1 // 占位用，防止多谢逗号
            };

            return {
                homeRoute : homeRoute
            };
        },

        getHomeRoute : function(key) {
             return this.Config.homeRoute[key];
        },

        getAllContactsGid : function() {
            return this.getGroupId("allContacts");
        },

        getNoGroupGid : function() {
            return this.getGroupId("noGroup");
        }
    }));

})(jQuery, _, M139);

﻿(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Base.Utils.Global";

    M.namespace(_class, superClass.extend({

        name : _class,

        defaults : {

        },

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);

            this.initGlobalFunctions();
            this.initGlobalProperties();
        },

        initGlobalFunctions : function() {
            window._Now = function() {
                return new Date().getTime();
            };

            window._AlertMsg = function() {
                top.$Msg.alert.apply(top.$Msg, arguments);
            };

            window._ShowTipMsg = function(msg, options) {
                top.M139.UI.TipMessage.show(msg, options);
            };

            window._HideTipMsg = function() {
                top.M139.UI.TipMessage.hide();
            };

            window._IsAddrOpen = function() {
                return top.$App.getCurrentTab().name == "addr";
            };

            window._Log = function(msg) {
                if (window.console) {
                    console.log(msg);
                }
            };
        },

        initGlobalProperties : function() {
            // test only
            window.parent._Child = window;
            window._New_EA = true;
            window._Show_And_Addr = true;
            window._Local_And_Addr = false;
        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = Backbone.Collection;
    var _class = "M2012.Addr.Collection.Base";

    M.namespace(_class, superClass.extend({

        name : _class,

        EVENT_KEYS : {
            // REMOVE_CONTACTS : "remove:contacts"
        },

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);
        },

        keyTrigger : function(eventKey, args) {
            this.trigger(this.EVENT_KEYS[eventKey], args);
        },

        keyOn : function(eventKey, callbalck, context) {
            this.on(this.EVENT_KEYS[eventKey], callbalck, context);
        }
    }));

})(jQuery, _, M139);

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

