(function($, _, M) {

    var superClass = M.Model.ModelBase;

    /**
     * 通讯录 - 联系人的缓存模型
     * @type {string}
     * @private
     */
    var _class = "M2012.Addr.Cache.Groups";
    M.namespace(_class, M.Model.ModelBase.extend({

        name : _class,

        defaults : {
        },

        initialize : function(options) {
            superClass.prototype.initialize.apply(this, arguments);
            this.initCache();

            _EA_G.keyOn("ADD_GROUP", this.addGroup, this);
            _EA_G.keyOn("EDIT_GROUP", this.editGroup, this);
            _EA_G.keyOn("DELETE_GROUP", this.deleteGroup, this);
        },

        initCache : function() {
            this.groupsCache = _DataBuilder.buildAllGroups2();
            _Groups.mergeGroups(_DataBuilder.buildAllGroups().toArray());
        },

        addGroup : function(data, options) {
            this.initCache();
            var hasContacts = data.contactsId && data.contactsId.length > 0;
            if (hasContacts) {
                _GCMapCache.initCache();
            }
            _EA_G.keyTrigger("GROUP_ADDED", data, options);
        },

        editGroup : function(data, options) {
            this.initCache();
            _GCMapCache.initCache();
            _EA_G.keyTrigger("GROUP_EDITED", data, options);
        },

        deleteGroup : function(data, options) {
            this.initCache();
            _GCMapCache.initCache();
            if (options && options.deleteGroupContacts) {
                _ContactsCache.initCache();
            }
            _EA_G.keyTrigger("GROUP_DELETED", data, options);
        },

        getGroup : function(groupId) {
            return _.find(this.groupsCache, function(groupCache) {
                return groupCache.GroupId == groupId;
            });
        },

        getAllGroups : function() {
            return this.groupsCache;
        }
    }));

})(jQuery, _, M139);
