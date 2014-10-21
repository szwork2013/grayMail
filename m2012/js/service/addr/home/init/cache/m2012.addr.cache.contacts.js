(function($, _, M) {

    var superClass = M.Model.ModelBase;

    /**
     * 通讯录 - 联系人的缓存模型
     * @type {string}
     * @private
     */
    var _class = "M2012.Addr.Cache.Contacts";
    M.namespace(_class, M.Model.ModelBase.extend({

        name : _class,

        defaults : {
        },

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);
            this.initCache();

            _EA_C.keyOn("ADD_CONTACT", this.addContact, this);
            _EA_C.keyOn("EDIT_CONTACT", this.editContact, this);
            _EA_C.keyOn("DELETE_CONTACTS", this.deleteContacts, this);

            _EA_C.keyOn("IMPORT_CONTACTS", this.importContacts, this);
            _EA_C.keyOn("SYN_CONTACTS", this.synContacts, this);
            _EA_C.keyOn("MERGE_CONTACTS", this.mergeContacts, this);
        },

        initCache : function() {
            this.contactsCache = _DataBuilder.buildAllContacts();
        },

        initAllCache : function() {
            _ContactsCache.initCache();
            _GroupsCache.initCache();
            _GCMapCache.initCache();
        },

        importContacts : function(data, options) {
            this.initAllCache();

            _EA_C.keyTrigger("CONTACTS_IMPORTED", data, options);
        },

        synContacts : function(data, options) {
            this.initAllCache();

            _EA_C.keyTrigger("CONTACTS_SYNED", data, options);
        },

        mergeContacts : function(data, options) {
            this.initAllCache();

            _EA_C.keyTrigger("CONTACTS_MERGED", data, options);
        },

        addContact : function(data, options) {
            this.initCache();
            var hasGroups = data.groupsId && data.groupsId.length > 0;
            if (hasGroups) {
                _GCMapCache.initCache();
            }
            _EA_C.keyTrigger("CONTACT_ADDED", data, options);
        },

        editContact : function(data, options) {
            this.initCache();
            // 这里传入的是新分组，难以判断用户的分组是否发生变化，故统一更新缓存
            // var hasGroups = data.groupsId && data.groupsId.length > 0;
            // if (hasGroups) {
            _GCMapCache.initCache();
            // }
            _EA_C.keyTrigger("CONTACT_EDITED", data, options);
        },

        deleteContacts : function(data, options) {
            this.initCache();
            _GCMapCache.initCache();
            _EA_C.keyTrigger("CONTACTS_DELETED", data, options);
        },

        getContacts : function(contactsId) {
            var result = [];
            var contactsMap = _DataBuilder.getContactsMap();
            _.each(contactsId, function(cid) {
                result.push(contactsMap[cid]);
            });
            return result;
        },

        getNoGroupContacts : function() {
            var ids = _DataBuilder.getNoGroupContactsId();
            return this.getContacts(ids);
        },

        getAllContacts : function() {
            return this.contactsCache;
        }
    }));

})(jQuery, _, M139);
