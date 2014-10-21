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

(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Router.Index";

    M.namespace(_class, superClass.extend({

        name : _class,

        defaults : {

        },

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);
        },

        route : function() {
            var routeId = $Url.queryString("homeRoute");

            if(routeId){
                routeId = parseInt(routeId);
            }

            if(_CFG.getHomeRoute("MAILBOX_MANAGE_VIP") != routeId){
                this.routeDefault();
            }

            switch(routeId) {
                case _CFG.getHomeRoute("MAILBOX_MANAGE_VIP"):
                    this.routeMailboxManageVip();
                    break;
                case _CFG.getHomeRoute("REDIRECT"):                    
                    this.routeRedirect();
                    break;
                case _CFG.getHomeRoute("SEARCH"):
                    this.search();
                    break;
                default:

                    break;
            }
           
        },

        routeDefault : function() {
            EventsAggr.Groups.keyTrigger("SELECT_GROUP", {
                groupId : _DataBuilder.allContactsGroupId()
            });
        },

        routeMailboxManageVip : function() {
            EventsAggr.Groups.keyTrigger("SELECT_GROUP", {
                groupId : _DataBuilder.vipGroupId()
            });
        },

        routeRedirect: function () {
           $Addr.trigger($Addr.EVENTS.INIT_REDIRECT, {});
        },
        search: function() {
            var keyword =  $Url.queryString("keyword");
            top.$App.trigger("searchkeywordChange", {type: "addr", keyword: keyword});
        },
        end : function() {

        }
    }));

})(jQuery, _, M139);

﻿(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Test.Data.SynGC";

    M.namespace(_class, superClass.extend({

        name : _class,

        defaults : {

        },

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);

            // this.initTestFunctions();
            // this.initTestProperties();
        },

        testSynGC : function() {
            window.T_CreateGroups = function(options) {
                var groups = top.Contacts.data.groups;
                var size = top.Contacts.data.groups.length;
                var group = _.clone(groups[size - 1]);
                groups.push(group);
                var groupId = parseInt(Math.random() * 1000000);
                group.GroupName = "添加分组（测试）";
                group.GroupId = groupId;
                //EventsAggr.Groups.keyTrigger("CREATE_GROUPS", {
                //    groupsId : [groupId]
                //});
                EventsAggr.Groups.keyTrigger("ADD_GROUP", {
                    groupId : groupId
                }, options);
            };

            window.T_UpdateGroups = function(options) {
                var groups = top.Contacts.data.groups;
                var size = top.Contacts.data.groups.length;
                var group = groups[size - 1];
                var groupId = group.GroupId;
                group.GroupName = "更新分组（测试）";
                EventsAggr.Groups.keyTrigger("EDIT_GROUP", {
                    groupId : groupId
                }, options);
            };

            window.T_DeleteGroups = function(options) {
                var groups = top.Contacts.data.groups;
                var group = groups.pop();
                var groupId = group.GroupId;
                EventsAggr.Groups.keyTrigger("DELETE_GROUP", {
                    groupId : groupId
                }, options);
            };

            window.T_CreateContacts = function(options) {
                var contacts = top.Contacts.data.contacts;
                var contactsNum = 1;
                var ids = [];
                for (var i = 0; i < contactsNum; i++) {
                    var contact = _.clone(contacts[i]);
                    var id = generateId();
                    contact.SerialId = id;
                    contact.AddrFirstName = "联系人-" + id;
                    contacts.push(contact);
                    top.Contacts.data.TotalRecord++;

                    ids.push(id);
                }
                EventsAggr.Contacts.keyTrigger("ADD_CONTACT", {
                    contactId : ids[0]
                }, options);
            };

            window.T_UpdateContacts = function(options) {
                var contacts = top.Contacts.data.contacts;
                var contactsNum = 1;
                var ids = [];
                for (var i = 0; i < contactsNum; i++) {
                    var contact = contacts[i];
                    var id = contact.SerialId;
                    contact.AddrFirstName += "1";
                    contact.name += "1";
                    contact.lowerName += "1";
                    ids.push(id);
                }
                EventsAggr.Contacts.keyTrigger("EDIT_CONTACT", {
                    contactId : ids[0]
                }, options);
            };

            window.T_DeleteContacts = function(options) {
                var contacts = top.Contacts.data.contacts;
                var contactsNum = 10;
                var ids = [];
                for (var i = 0; i < contactsNum; i++) {
                    var contact = contacts.pop();
                    top.Contacts.data.TotalRecord--;

                    var id = contact.SerialId;
                    ids.push(id);
                }
                EventsAggr.Contacts.keyTrigger("DELETE_CONTACTS", {
                    contactsId : ids
                }, options);
            };

            window.T_MoveToGroup = function(options) {
                var groups = top.Contacts.data.groupMember;
                var srcGroupIndex = 0;
                var srcGroupId = null;
                var dstGroupIndex = 1;
                var dstGroupId = null;
                var index = 0;
                var contactsId = null;
                $.each(groups, function(groupId, membersId) {
                    if (index == srcGroupIndex) {
                        srcGroupId = groupId;
                        contactsId = membersId;
                        groups[groupId] = [];
                    } else if (index == dstGroupIndex) {
                        dstGroupId = groupId;
                        _.each(contactsId, function(contactId) {
                            membersId.push(contactId);
                        });
                    }

                    index++;
                });
                var groupMap = top.Contacts.data.groupsMap;
                var msg = "Move " + contactsId.length + " contacts from group" + groupMap[srcGroupId].GroupName + " to group " + groupMap[dstGroupId].GroupName;
                alert(msg);
                _EA_C.keyTrigger("MOVE_TO_GROUP", {
                    contactsId : contactsId,
                    srcGroupId : srcGroupId,
                    dstGroupId : dstGroupId
                }, options);
                // return msg; // for console debug
            };

            window.T_CopyToGroup = function(options) {
                var contacts = top.Contacts.data.contacts;
                var contactsNum = 30;
                var contactsId = [];
                for (var i = 0; i < contactsNum; i++) {
                    var contact = contacts[i];
                    var id = contact.SerialId;
                    contactsId.push(id);
                }
                var dstGroup = top.Contacts.data.groups[0];
                var dstGroupId = dstGroup.GroupId;
                top.Contacts.data.groupMember[dstGroupId] = contactsId;
                var msg = "Copy first " + contactsNum + " contacts to group " + dstGroup.GroupName;
                alert(msg);
                _EA_C.keyTrigger("COPY_TO_GROUP", {
                    contactsId : contactsId,
                    dstGroupId : dstGroupId
                }, options);
            };

            function generateId() {
                return parseInt(Math.random() * 1000000);
            }


            window.T_CreateComplexContacts = function(num) {
                var t1 = _Now();
                var template = top.Contacts.data.contacts[0];
                var contacts = new M2012.Addr.Collection.Contacts.List();
                for (var i = 0; i < num; i++) {
                    var contact = new M2012.Addr.Model.Contacts.Item(template);
                    contacts.add(contact);
                };
                var t2 = _Now();
                alert(t2 - t1);
                return contacts;
            };

            window.T_CreateSimpleContacts = function(num) {
                var t1 = _Now();
                var template = top.Contacts.data.contacts[0];
                var contacts = new M2012.Addr.Collection.Contacts.List();
                for (var i = 0; i < num; i++) {
                    var contact = new M2012.Addr.Model.Contacts.Item({
                        id : template.SerialId
                    });
                    contacts.add(contact);
                };
                var t2 = _Now();
                alert(t2 - t1);
                return contacts;
            };
        },

        testAndAddrShow: function (gNum, cMaxNum) {
            var allGid = 9999;
            var noneGid = 0;
            window._T_Load_And_Groups = function (success, error, options) {
                var context = options.context;
                var isSucceed = options.isSucceed;
                var succeed = isSucceed != undefined ? isSucceed : true;

                var responseData =
                {
                    "metadata": {
                        "resultCode": "0",
                        "resultMsg": "操作成功"
                    },
                    "data": {
                        "totalNum": gNum + 2,
                        "dataList": [
                            {
                                "id": allGid,
                                "name": "全部",
                                "membersNum": 320
                            },
                            {
                                "id": noneGid,
                                "name": "未分组",
                                "membersNum": 30
                            }
                        ]
                    }
                };

                var groupsList = responseData.data.dataList;
                var totalNum = groupsList[1].membersNum;
                for (var i = 1; i <= gNum; i++) {
                    var num = Math.floor(Math.random() * cMaxNum);
                    if (i == 3) {
                        num = 0;
                    }
                    var cGroup = {
                        "id": i,
                        "name": "我的分组" + i,
                        "membersNum": num
                    };
                    totalNum += num;
                    groupsList.push(cGroup);
                }
                groupsList[0].membersNum = totalNum;

                if (succeed) {
                    if ($.isFunction(success)) {
                        success.apply(context, [responseData]);
                    }
                } else {
                    if ($.isFunction(error)) {
                        error();
                    }
                }
            };

            window._T_Load_And_Contacts = function (success, error, options) {
                var gid = options.groupId;
                var pageIndex = options.pageIndex;
                var pageSize = 100;
                var context = options.context;
                var isSucceed = options.isSucceed;
                var succeed = isSucceed != undefined ? isSucceed : true;

                var mGroup = _AndGroups.get(gid);
                var totalNum = mGroup.get("membersNum");

                var responseData =
                {
                    "metadata": {
                        "resultCode": "0",
                        "resultMsg": "操作成功"
                    },
                    "data": {
                        "totalNum": totalNum,
                        "dataList": []
                    }
                };

                var contactsList = responseData.data.dataList;
                var cStart = (pageIndex-1) * pageSize;
                var pageEnd = cStart + pageSize;
                var cEnd = pageEnd > totalNum ? totalNum : pageEnd;
                for (var i = cStart; i < cEnd; i++) {
                    var mobile = "139" + new String(gid + 10000).substring(1) + new String(i + 10000).substring(1);
                    var email = mobile + "@139.com";
                    var name = mGroup.get("name") + "-" + "联系人" + i;
                    var contact = {
                        "id": "g" + gid + "-c" + i,
                        "name": name,
                        "email": email,
                        "mobile": mobile,
                        "groupsId": [gid]
                    };
                    contactsList.push(contact);
                }

                if (succeed) {
                    if ($.isFunction(success)) {
                        success.apply(context, [responseData]);
                    }
                } else {
                    if ($.isFunction(error)) {
                        error();
                    }
                }
            };
        },


        initTestProperties : function() {

        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.UmcUser";

    M.namespace(_class, superClass.extend({

        name : _class,

        defaults : {
//            isUmcUser : null, // 是否是互联网通信证用户：null 未知 true 是 false 不是
            regStatus : 10 // 注册行为状态：10 未点击注册 20 注册中 30 注册结束
        },

        initialize : function(contact) {
            superClass.prototype.initialize.apply(this, arguments);
        },

        setRegisterComplete : function() {
            this.set("regStatus", 30);
        },

        setRegistering : function() {
            this.set("regStatus", 20);
        },

        isRegistering : function() {
            return this.get("regStatus") == 20;
        },

        checkUmcUser : function(cbUmc, context) {
            var _this = this;

            top.$User.isUmcUserAsync(function(isUmcUser) {
               // TODO test only
//               isUmcUser = false;
               if (isUmcUser)  {
                   cbUmc.apply(context, arguments);
               } else {
                   if (_this.isRegistering()) {
                       _this.setRegisterComplete();

                       // 从后台重新获取用户状态
                       var data = top.$App.getConfig("UserData");
                       data.isumcuser = undefined;
                       top.$App.trigger("userAttrChange");

                       _this.checkUmcUser(cbUmc, context);
                   } else {
                       // pop up register page
                       var content = "想拥有“和通讯录”吗？<br/>升级互联网通行证，即刻拥有";
                       var dialog = top.$Msg.confirm(content, function () {
                           top.BH("addr_addr_registerUMC");
                           _this.setRegistering();
                           _this.registerLicense();
                       }, "", "", {
                           isHtml : true,
                           buttons : ["升级互联网通行证", "关 闭"]
                       });
                   }
               }
            });
        },

        registerLicense: function () {
            var TO_UPDATE = 1;
            var reqData = { optype: TO_UPDATE };
            var url = top.M139.HttpRouter.getUrl("umc:rdirectCall").replace("/setting/", "/mw2/setting/");
            url = $Url.makeUrl(url, reqData);
            window.open(url);
        },

        end : function() {

        }
    }));

})(jQuery, _, M139);

(function($, _, M) {
    /**
     * 通讯录初始化加载方法。
     */
    $(function() {
        // 配置信息
        window._CFG = new M2012.Addr.Base.Config.Global();
        // 全局方法和属性
        new M2012.Addr.Base.Utils.Global();

        /**
         *  测试专用，可忽略
         */
        var isTestMode = false;
        if (isTestMode) {
            new M2012.Addr.Test.Data.SynGC().testSynGC();
        }
        if (_Local_And_Addr) {
            new M2012.Addr.Test.Data.SynGC().testAndAddrShow(5, 300);
        }

        function initAddr() {

            _EA_C.off();
            _EA_G.off();
            _EA_AND_C.off();
            _EA_AND_G.off();

            // initialize global data
            window._DataBuilder = new M2012.Addr.Tool.Data.Builder();
            
            var groups = window._Groups = _DataBuilder.buildAllGroups();
            groups.listenBroadcastEvents();
            
            window.$Addr = top.$Addr = new M2012.Addr.Model.LinkHelper();

            window._ContactsCache = new M2012.Addr.Cache.Contacts();
            window._GroupsCache = new M2012.Addr.Cache.Groups();
            window._GCMapCache = new M2012.Addr.Cache.MapGC();

            // 拖拽model
            var mDragdrop = new M2012.Addr.Model.Dragdrop();

            /************start(toolbar)************/
            new M2012.Addr.View.Events({
                master : top.$Addr
            });
            
            new M2012.Addr.View.AddrContacts({
                master : top.$Addr
            });

            new M2012.Addr.View.Remind({
                master : top.$Addr
            });

            new M2012.Addr.View.ToolBar({
                master : top.$Addr
            });

            new M2012.Addr.View.PimToolBar({
                master : top.$Addr
            });
            /************end(toolbar)************/

            var mGroupsManager = new M2012.Addr.Model.GroupsManager();
            new M2012.Addr.View.GroupsManager({
                model : mGroupsManager
            });

            // 组导航视图
            new M2012.Addr.View.Groups.Nav.List({
                collection : groups,
                mDragdrop : mDragdrop,
                mGroupsManager : mGroupsManager
            }).render();

            // 联系人列表视图
            var contacts = window._Contacts = new M2012.Addr.Collection.Contacts.List();
            contacts.listenBroadcastEvents();
            // 分页
            var mPaging = new M2012.Addr.Model.Contacts.Paging({
                totalRecords : contacts.length,
                pageSize : 100
            });
            // 跨页选择
            var mSelector = new M2012.Addr.Model.Contacts.Selector({
                totalRecords : contacts.length
            });
            // 搜索
            var mSearch = new M2012.Addr.Model.Contacts.Search();
            // 首字母过滤
            var mInitialLetterFilter = new M2012.Addr.Model.Contacts.Filter.InitialLetter();
            // 排序
            var mSort = new M2012.Addr.Model.Contacts.Sort();
            var contactsView = new M2012.Addr.View.Contacts.List({
                collection : contacts,
                mSearch : mSearch,
                mPaging : mPaging,
                mInitialLetterFilter : mInitialLetterFilter,
                mSelector : mSelector,
                mSort : mSort,
                mDragdrop : mDragdrop
            });

            // search view
            new M2012.Addr.View.Contacts.Search({
                model : mSearch
            });

            // paging view
            new M2012.Addr.View.Contacts.Paging({
                model : mPaging
            }).render();

            // initial letter filter
            new M2012.Addr.View.Contacts.Filter.InitialLetter({
                model : mInitialLetterFilter
            });

            // contacts selector
            new M2012.Addr.View.Contacts.Selector({
                mSelector : mSelector,
                mSort : mSort
            });

            // and addr
            var isAndAddrUser = true;
            if (_Show_And_Addr && isAndAddrUser) {
                $("#andAddr-groups-container").show();

                var andGroups = window._AndGroups = new M2012.AndAddr.Collection.Groups.List();
                var mUmcUser = new M2012.Addr.Model.UmcUser();
                new M2012.AndAddr.View.Groups.List({
                    collection : andGroups,
                    mUmcUser : mUmcUser,
                    mGroupsManager : mGroupsManager
                });
                var andContacts = window._AndContacts = new M2012.AndAddr.Collection.Contacts.List();
				
                // 兼容360
                var $andAddrContactsRoot = $("#and-contacts-list");

                // 分页
                var mAndPaging = new M2012.AndAddr.Model.Contacts.Paging({
                    totalRecords : andContacts.length,
                    pageSize : 100
                });
                // 跨页选择
                var mAndSelector = new M2012.AndAddr.Model.Contacts.Selector({
                    el : $andAddrContactsRoot.find("#contacts-header"),
                    totalRecords : andContacts.length
                });
                new M2012.AndAddr.View.Contacts.List({
                    el : $andAddrContactsRoot.find("#contacts-list"),
                    collection: andContacts,
                    mPaging : mAndPaging,
                    mSelector : mAndSelector
                });
                // paging view
                new M2012.AndAddr.View.Contacts.Paging({
                    el : $andAddrContactsRoot.find("#contactsPagingBar"),
                    model : mAndPaging
                }).render();

                // contacts selector
                new M2012.AndAddr.View.Contacts.Selector({
                    el: $andAddrContactsRoot.find("#contacts-header"),
                    mSelector : mAndSelector
                });
            }

            /**
            * 群组, 加载主model, 点击时再进行群组初始化
            */
            top.$Addr.GomModel = new M2012.GroupMail.Model.Manage();
            new M2012.GroupMail.View.Manage.Main({ model: top.$Addr.GomModel });

            // 修改通讯录加载状态
            window._LoadStatus = 1;
            
            // 初始化路由
            new M2012.Addr.Router.Index().route();
            
            top.BH("addr_load_index");

            // 显示通讯录页面
            showAddrMain();

            /**
             *  测试专用，可忽略
             */
            var isTestMode = false;
            if (isTestMode) {
                new M2012.Addr.Test.Data.SynGC();
            }            
        }

        /**
         * 显示通讯录页面
         */
        function showAddrMain() {
            $("#addr-loading-box").hide();
            $(".outArticle").show();
            $(".inAside").show();
            
            var fnSetSkin = top.$App.setModuleSkinCSS;
            if (fnSetSkin) {
                fnSetSkin(document);
            }
            
//            _EA_G.keyTrigger("RESET_GROUPS_LIST_HEIGHT");
            _EA_G.keyTrigger("AUTO_LOCATE_NAV");
            _EA_C.keyTrigger("RESET_CONTACTS_LIST_HEIGHT");
        }

        // 初始化加载。 0:加载成功 1:加载成功 -1:加载失败
        window._LoadStatus = 0;
        setTimeout(function() {
            if (_LoadStatus == 0) {
                $("#addr-loading").hide();
                $("#addr-loadError").show();
                window._LoadStatus = -1;
            }
        }, 10000);

        // 获取通讯录数据，异步加载页面。
        top.M2012.Contacts.getModel().requireData(function() {
            try {
                initAddr();            
            } catch (error) {
                // 如果top层联系人数据没有构建完成，则定时去重新获取数据，直到成功或者超时失败。
                var intervalId = setInterval(function() {
                    _Log("addr reloading...");
                    if (_LoadStatus != 0) {
                        clearInterval(intervalId);
                        _Log("addr reloading end!");
                        return;
                    }
                    try {
                        initAddr();
                    } catch(intervalError) {
                        // 不处理，等待下次重试。
                        _Log(intervalError);
                    }
                }, 500);
            }            
        });
    });

})(jQuery, _, M139);

