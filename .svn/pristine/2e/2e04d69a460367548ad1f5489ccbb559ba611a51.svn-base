(function($, _, M) {

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
