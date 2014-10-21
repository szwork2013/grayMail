(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Tool.Data.Builder";

    /**
     *  构建通讯录基础数据.
     */
    M.namespace(_class, superClass.extend({

        name : _class,

        defaults : {

        },

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);
        },

        getContactsData : function() {
            return top.Contacts.data;
        },

        /**
         *  构建所有联系人。
         *     考虑到性能问题，不为每个联系人创建backbone model，直接使用top缓存的联系人数组。
         */
        buildAllContacts : function() {
            var cachedContacts = this.getContactsData().contacts;
            var indexMap = {};
            for (var i = 0; i < cachedContacts.length; i++) {
                var cid = cachedContacts[i].SerialId;
                indexMap[cid] = i;
            };
            cachedContacts.indexMap = indexMap;
            return cachedContacts;
        },

        getContactsMap : function() {
            return this.getContactsData().contactsMap;
        },

        getNoGroupContactsId : function() {
            return this.getContactsData().noGroup;
        },

        /**
         * 构建所有组。
         *      使用backbone collection构建
         */
        buildAllGroups : function() {
            var cachedData = this.getContactsData();
            var cachedGroups = cachedData.groups;

            // depends
            var groups = new M2012.Addr.Collection.Groups.List();

            var allContactsGroup = new M2012.Addr.Model.Groups.Item({
                members : cachedData.TotalRecord,
                name : "所有联系人",
                id : _CFG.getAllContactsGid(),
                selected : false,
                dropable : false
            });
            groups.add(allContactsGroup);

            if (_Show_And_Addr) {
                var noGroup = new M2012.Addr.Model.Groups.Item({
                    members : cachedData.noGroup.length,
                    name : "未分组",
                    id : _CFG.getNoGroupGid(),
                    selected : false,
                    dropable : false
                });
                groups.add(noGroup);
            }

            var vipDetails = this.getContactsData().vipDetails;
            var vipContactsGroup = new M2012.Addr.Model.Groups.Item({
                members : vipDetails.vipn,
                name : "VIP联系人",
                id : vipDetails.vipGroupId,
                dropable : false
            });
            groups.add(vipContactsGroup);

            var readMailContactsIndex = groups.length;
            var readMailContactsFound = false;
            $.each(cachedGroups, function(i, cachedGroup) {
                var groupId = cachedGroup.GroupId;
                var members = 0;
                var membersId = cachedData.groupMember[groupId];
                if (membersId) {
                    members = membersId.length;
                }
                var groupInfo = {
                    id : groupId,
                    members : members,
                    name : cachedGroup.GroupName
                };
                var group = new M2012.Addr.Model.Groups.Item(groupInfo);
                if (!readMailContactsFound && group.isReadMailContacts()) {
                    readMailContactsFound = true;
                    groups.add(group, {
                        at : readMailContactsIndex
                    });
                } else {
                    groups.add(group);
                }
            });

            return groups;
        },

        /**
         *  构建所有组。
         *        以数组的形式构建， 用于创建联系人和组的关系映射。
         */
        buildAllGroups2 : function() {
            var cachedData = this.getContactsData();
            var cachedGroups = cachedData.groups;
            var groups = [];
            var allContactsGroup = {
                CntNum : cachedData.TotalRecord,
                GroupId : _CFG.getAllContactsGid(),
                GroupName : "所有联系人",
                count : cachedData.TotalRecord,
                id : _CFG.getAllContactsGid(),
                name : "所有联系人"
            };
            groups.push(allContactsGroup);

            var vipDetails = this.getContactsData().vipDetails;
            var vipContactsGroup = {
                CntNum : vipDetails.vipn,
                GroupId : vipDetails.vipGroupId,
                GroupName : "VIP联系人",
                count : vipDetails.vipn,
                id : vipDetails.vipGroupId,
                name : "VIP联系人"
            };
            groups.push(vipContactsGroup);

            var readMailContactsIndex = groups.length;
            var readMailContactsFound = false;
            $.each(cachedGroups, function(i, cachedGroup) {
                if (!readMailContactsFound && cachedGroup.GroupName == "读信联系人") {
                    readMailContactsFound = true;
                    groups.splice(readMailContactsIndex, 0, cachedGroup);
                } else {
                    groups.push(cachedGroup);
                }
            });
            return groups;
        },

        /**
         *  构建联系人和组的关系映射。
         */
        buildGCMap : function() {
            var _this = this;
            var map = {
                mapC2G : {}, // 联系人所在组关系
                mapG2C : {} // 组的联系人关系
            };

            // 映射vip联系人组
            var vipDetails = this.getContactsData().vipDetails;
            if (vipDetails) {
                var vipGroupId = vipDetails.vipGroupId;

                var vipContactsId = [];
                if (vipDetails.vipSerialIds) {
                    vipContactsId = vipDetails.vipSerialIds.split(",");
                }
                _.each(vipContactsId, function(vipContactId) {
                    _this.mapGCPair(map, vipGroupId, vipContactId);
                });
            }

            // 映射自定义组
            var groupMembers = this.getContactsData().groupMember || {};
            _.each(_.keys(groupMembers), function(key) {
                var groupId = key;
                var groupContactsId = groupMembers[key];
                _.each(groupContactsId, function(contactId) {
                    _this.mapGCPair(map, groupId, contactId);
                });
            });

            return map;
        },

        /**
         *  构建联系人和组的映射关系。
         *
         * @param {Object} map 映射关系
         * @param {Object} groupId 组id
         * @param {Object} contactId 联系人id
         */
        mapGCPair : function(map, groupId, contactId) {
            var contactGroups = map.mapC2G[contactId];
            if (!contactGroups) {
                contactGroups = map.mapC2G[contactId] = [];
            }
            contactGroups.push(groupId);

            var groupContacts = map.mapG2C[groupId];
            if (!groupContacts) {
                groupContacts = map.mapG2C[groupId] = [];
            }
            groupContacts.push(contactId);
        },

        /**
         * vip联系人组id
         */
        vipGroupId : function() {
            return this.getContactsData().vipDetails.vipGroupId;
        },

        /**
         * 所有联系人组id
         */
        allContactsGroupId : function() {
            return _CFG.getAllContactsGid();
        }
    }));

})(jQuery, _, M139);
