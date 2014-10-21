(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.Groups.Item";

    M.namespace(_class, superClass.extend({

        name : _class,

        defaults : {
            id : 0, // 组id
            members : 0, // 组成员数
            name : '', // 组名称
            selected : false, // 是否被选中
            dropable : true // 是否允许拖拽联系人到改组
        },

        initialize : function(group) {
            superClass.prototype.initialize.apply(this, arguments);
            this.set(group);
        },

        /**
         * 是否是VIP组
         */
        isVipGroup : function() {
            return this.get("id") == _DataBuilder.vipGroupId();
        },

        /**
         * 是否是所有联系人组
         */
        isAllContactsGroup : function() {
            return this.get("id") == _CFG.getAllContactsGid();
        },

        isReadMailContacts : function() {
            return this.get("name") == "读信联系人";
        },

        isNoGroup : function() {
            return this.get("id") == _CFG.getNoGroupGid();
        },

        /**
         * 添加组成员数
         * 【注意】：这里需要先转换成数字再加，防止出现3+"5"=35的情况。
         *
         * @param {Object} step 添加的组成员数
         */
        addMembersNum : function(step) {
            this.set("members", new Number(this.get("members")) + new Number(step));
        },

        minusMembersNum : function(step) {
            this.set("members", new Number(this.get("members")) - new Number(step));
        }
    }));

})(jQuery, _, M139);
