(function($, _, M) {

    var superClass = M2012.Addr.Collection.Base;
    var _class = "M2012.AndAddr.Collection.Groups.List";

    M.namespace(_class, superClass.extend({

        name : _class,

        model : M2012.AndAddr.Model.Groups.Item,

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);
        },

        /**
         * 获取当前选中的组 
         */
        selected : function() {
            return this.where({
                selected : true
            });
        },

        unselectAll : function() {
            _.each(this.selected(), function(contact) {
                contact.set("selected", false);
            });
        },

        selectedGroup : function() {
            return this.selected()[0];
        },

        /**
         * 获取选中组的下标，从0开始 
         */
        selectedGroupIndex : function() {
            return this.indexOf(this.selectedGroup());
        },

        /**
         * 获取选中组的id 
         */
        selectedGroupId : function() {
            return this.selectedGroup().getId();
        },

        /**
         * 获取所有组id 
         */
        getGroupsId : function() {
            var ids = [];
            this.each(function(item) {
                ids.push(item.getId());
            });
            return ids;
        }
    }));

})(jQuery, _, M139);
