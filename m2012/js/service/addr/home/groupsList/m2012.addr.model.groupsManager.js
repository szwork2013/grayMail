(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.GroupsManager";

    M.namespace(_class, superClass.extend({

        name : _class,

        defaults : {
            activeGroupType : 10, // 当前激活的联系人。10：139联系人 20：和通讯录联系人
            showAndAddr : false // 和通讯录组的显示状态。
        },

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);
            this.on("change:showAndAddr", this.onChangeShowAndAddr, this);
        },

        /**
         * 设置为139联系人组
         */
        activeM139Addr : function() {
            this.set("activeGroupType", 10);
        },

        isM139Addr : function() {
            return this.get("activeGroupType") == 10;
        },

        onChangeShowAndAddr : function() {
            if (!this.get("showAndAddr")) {
                this.activeM139Addr();
            }
        },

        /**
         * 设置为和通讯录联系人组
         */
        activeAndAddr : function() {
            this.set("activeGroupType", 20);
        },

        isAndAddr : function() {
            return this.get("activeGroupType") == 20;
        }
    }));

})(jQuery, _, M139);
