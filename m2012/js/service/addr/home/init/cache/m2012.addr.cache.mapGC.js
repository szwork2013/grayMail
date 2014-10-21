(function($, _, M) {

    var superClass = M.Model.ModelBase;

    /**
     * 通讯录 - 联系人的缓存模型
     * @type {string}
     * @private
     */
    var _class = "M2012.Addr.Cache.MapGC";
    M.namespace(_class, M.Model.ModelBase.extend({

        name : _class,

        defaults : {
        },

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);
            this.initCache();

            _EA_C.keyOn("MOVE_TO_GROUP", this.moveToGroup, this);
            _EA_C.keyOn("COPY_TO_GROUP", this.copyToGroup, this);
        },

        moveToGroup : function(data, options) {
            this.initCache();
            _GCMapCache.initCache();
            _GroupsCache.initCache();
            
            _EA_C.keyTrigger("GROUP_MOVED_TO", data, options);
        },

        copyToGroup : function(data, options) {
            this.initCache();
            _GCMapCache.initCache();
            _GroupsCache.initCache();
            
            _EA_C.keyTrigger("GROUP_COPIED_TO", data, options);
        },

        initCache : function() {
            this.gcMapCache = _DataBuilder.buildGCMap();
        },

        getGroupContacts : function(groupId) {
            var contacts = _ContactsCache.getAllContacts();
            var groupContactsId = this.gcMapCache.mapG2C[groupId];

//            var result = _.filter(contacts, function(contact) {
//                return _.contains(groupContactsId, contact.SerialId);
//            });
            var result = [];
            var indexMap = contacts.indexMap;
            _.each(groupContactsId, function(cid) {
                var index = indexMap[cid];
                result.push(contacts[index]);
            });

            return result;
        },

        getContactGroups : function(contactId) {
            var groups = _GroupsCache.getAllGroups();
            var contactGroupsId = this.gcMapCache.mapC2G[contactId];
            var result = _.filter(groups, function(group) {
                return _.contains(contactGroupsId, group.GroupId);
            });
            return result;
        }
    }));

})(jQuery, _, M139);
