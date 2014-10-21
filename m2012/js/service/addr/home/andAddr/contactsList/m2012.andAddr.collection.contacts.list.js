(function($, _, M) {

    var superClass = M2012.Addr.Collection.Base;
    var _class = "M2012.AndAddr.Collection.Contacts.List";

    M.namespace(_class, superClass.extend({

        name : _class,

        model : M2012.AndAddr.Model.Contacts.Item,

        selectedMap : {},

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);
        },

        /**
         * 选中联系人
         *
         * @param contacts
         *     新选中的联系人列表
         */
        selectContacts : function(contacts) {
            var _this = this;
            _.each(contacts, function(contact) {
                var id = contact.getId();
                _this.selectedMap[id] = contact;
            });
        },

        /**
         * 取消选中联系人
         *
         * @param contacts
         *     取消选中的联系人列表
         */
        unselectContacts : function(contacts) {
            var _this = this;
            _.each(contacts, function(contact) {
                var id = contact.getId();
                delete _this.selectedMap[id];
            });
        },

        /**
         * 清空选中的所有联系人
         */
        cleanSelected : function() {
            this.selectedMap = {};
        },

        /**
         * 获取当前选中的联系人数目。
         * @returns {Number}
         *     当前选中的联系人数。
         */
        getSelectedNum : function() {
            return _.keys(this.selectedMap).length;
        },

        /**
         * 当前选中的联系人列表
         * @returns {*}
         *     当前选中的联系人列表。
         */
        selected : function() {
            return _.values(this.selectedMap);
        },

        /**
         * 获取当前选中的联系人id列表
         * @returns {Array}
         *     当前选中的联系人id列表
         */
        selectedIds : function() {
            return _.keys(this.selectedMap);
        },

        /**
         * 获取已选中联系人对象
         * @returns {*}
         *     已选中联系人对象
         */
        getSelectedMap : function() {
            return this.selectedMap;
        },

        /**
         * 根据联系人id判断当前联系人是否已经选中。
         * @param contactId
         *     联系人id
         * @returns {boolean}
         *     联系人是否选中
         */
        isSelected : function(contactId) {
            return this.selectedMap[contactId] != undefined;
        },

        /**
         * 取消选择所有已选中的联系人。
         */
        unselectAll : function() {
            this.cleanSelected();
        }
    }));

})(jQuery, _, M139);
