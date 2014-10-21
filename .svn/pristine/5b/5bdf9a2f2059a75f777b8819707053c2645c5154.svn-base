(function($, _, M) {

    var superClass = M2012.Addr.Collection.Base;
    var _class = "M2012.Addr.Collection.Contacts.List";

    M.namespace(_class, superClass.extend({

        name : _class,

        model : M2012.Addr.Model.Contacts.Item,

        selectedMap : {},

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);
        },

        listenBroadcastEvents : function() {
            EventsAggr.Contacts.keyOn("DELETE_CONTACTS", this.deleteContacts, this);
        },

        addSelectedContacts : function(contactsId) {
            var _this = this;
            _.each(contactsId, function(contactId) {
                _this.selectedMap[contactId] = true;
            });
            _EA_C.keyTrigger("CHANGE_SELECTED_CONTACTS");
        },

        removeSelectedContacts : function(contactsId) {
            var _this = this;
            _.each(contactsId, function(contactId) {
                delete _this.selectedMap[contactId];
            });
            _EA_C.keyTrigger("CHANGE_SELECTED_CONTACTS");
        },

        cleanSelectedContacts : function() {
            this.selectedMap = {};
            _EA_C.keyTrigger("CHANGE_SELECTED_CONTACTS");
        },

        getSelectedContactsNum : function() {
            return _.keys(this.selectedMap).length;
        },

        deleteContacts : function(data, options) {
            _Log("delete Contacts");
            var _this = this;

            var contactsId = data.contactsId;
            _.each(contactsId, function(contactId) {
                var contact = _this.get(contactId);
                if (contact) {
                    if (contact.isSelected()) {
                        EventsAggr.Contacts.keyTrigger("CONTACT_TOGGLED", false);
                    }
                    contact.destroy();
                    _this.remove(contact);
                }
            });

            EventsAggr.Contacts.keyTrigger("CONTACTS_DELETED", data, options);
        },

        selected : function() {
            var contactsCache = this.getContactsCache();
            var selectedIds = this.selectedIds();
            return contactsCache.getContacts(selectedIds);
        },

        selectedIds : function() {
            return _.keys(this.selectedMap);
        },

        getSelectedMap : function() {
            return this.selectedMap;
        },

        isSelected : function(contactId) {
            return this.selectedMap[contactId] || false;
        },

        selectAll : function() {
            this.each(function(model) {
                model.select();
            });
        },

        unselectAll : function() {
            this.cleanSelectedContacts();
        },

        /**
         * 按照名称排序联系人
         *
         * @param {Object} order 1 : asc, -1: desc
         */
        sortByName : function(srcContacts, order) {
            var contacts = _.clone(srcContacts);
            if (order == -1) {
                return contacts.reverse();
            } else {
                return contacts;
            }
        },

        /**
         * 按照邮件排序联系人
         *
         * @param {Object} order
         */
        sortByEmail : function(srcContacts, order) {
            var contacts = _.clone(srcContacts);
            if (order == 0) {
                return contacts;
            }

            contacts.sort(function(a, b) {
                if (!a.getFirstEmail() && b.getFirstEmail()) {
                    return 1;
                }
                if (a.getFirstEmail() && !b.getFirstEmail()) {
                    return -1;
                }
                if (!a.getFirstEmail() && !b.getFirstEmail()) {
                    return 0;
                }
                return a.getFirstEmail().localeCompare(b.getFirstEmail()) * order;
            });

            var breakIndex = -1;
            for (var i = contacts.length - 1; i >= 0; i--) {
                if (contacts[i].getFirstEmail() != "") {
                    break;
                } else {
                    breakIndex = i;
                }
            }
            if (breakIndex > -1) {//邮件为空的部分-按姓名排序
                var sortByEmail = contacts.slice(0, breakIndex);
                var sortByName = contacts.slice(breakIndex, contacts.length);
                sortByName.sort(function(a, b) {
                    return b.name.localeCompare(a.name);
                });
                contacts = [];
                contacts = sortByEmail.concat(sortByName);
            }

            return contacts;
        },

        /**
         *  按照手机排序联系人
         *
         * @param {Object} order
         */
        sortByMobile : function(srcContacts, order) {
            var contacts = _.clone(srcContacts);
            if (order == 0) {
                return contacts;
            }

            contacts.sort(function(a, b) {
                if (!a.getFirstMobile() && b.getFirstMobile()) {
                    return 1;
                }
                if (a.getFirstMobile() && !b.getFirstMobile()) {
                    return -1;
                }
                if (!a.getFirstMobile() && !b.getFirstMobile()) {
                    return 0;
                }
                return a.getFirstMobile().localeCompare(b.getFirstMobile()) * order;
            });

            var breakIndex = -1;
            for (var i = contacts.length - 1; i >= 0; i--) {
                if (contacts[i].getFirstMobile() != "") {
                    break;
                } else {
                    breakIndex = i;
                }
            }
            if (breakIndex > -1) {//手机为空的部分-按姓名排序
                var sortByMobile = contacts.slice(0, breakIndex);
                var sortByName = contacts.slice(breakIndex, contacts.length);
                sortByName.sort(function(a, b) {
                    return b.name.localeCompare(a.name);
                });
                contacts = [];
                contacts = sortByMobile.concat(sortByName);
            }

            return contacts;
        },

        /**
         * 按照首字母过滤联系人
         *
         * @param {Object} initialLetter
         */
        filterByInitialLetter : function(srcContacts, initialLetter) {
            var _this = this;
            var contacts = _.clone(srcContacts);
            var result = null;
            if (initialLetter === "all") {
                result = contacts;
            } else {
                result = _.filter(contacts, function(contact) {
                    var contactInitLetter = contact.FirstNameword;
                    return contactInitLetter && contactInitLetter.toLowerCase() == initialLetter;
                });
            }
            return result;
        },

        /**
         * 按照组过滤联系人
         *
         * @param {Object} groupId
         */
        filterByGroup : function(groupId) {
            var result = null;
            var contactsCache = this.getContactsCache();
            var group = _Groups.get(groupId);
            if (group.isAllContactsGroup()) {
                result = contactsCache.getAllContacts();
            } else if (group.isNoGroup()) {
                result = contactsCache.getNoGroupContacts();
            } else {
                result = _GCMapCache.getGroupContacts(groupId);
            }
            return result;
        },

        search : function(srcContacts, keyword) {
            var _this = this;
            return _.filter(srcContacts, function(contact) {
                return _this.searchContact(contact, keyword);
            });
        },

        searchContact : function(contact, keyword) {
            var searchFields = ["name", "emails", "mobiles", "faxes", "Quanpin", "Jianpin", "UserJob", "CPName"];
            var arraySearchText = [];
            _.each(searchFields, function(field) {
                var value = contact[field];
                if (value) {
                    arraySearchText.push(value);
                }
            });

            var searchText = arraySearchText.join(",");
            return searchText.toLowerCase().indexOf(keyword.toLowerCase()) != -1;
        },

        /**
         * 联系人分页
         *
         * @param {Object} pageIndex
         * @param {Object} pageSize
         */
        page : function(srcContacts, pageIndex, pageSize) {
            var intPageIndex = parseInt(pageIndex);
            var intPageSize = parseInt(pageSize);
            var iStart = (intPageIndex - 1) * intPageSize;
            var iEnd = iStart + intPageSize;
            var max = srcContacts.length;
            iEnd = iEnd > max ? max : iEnd;
            // return this.slice(iStart, iEnd); // not supported by this backbone version

            return srcContacts.slice(iStart, iEnd);
        },

        getContactsCache : function() {
            //return _DataBuilder.buildAllContacts2();
            return _ContactsCache;
        }
    }));

})(jQuery, _, M139);
