(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.AndAddr.Model.Contacts.Item";

    M.namespace(_class, superClass.extend({

        name : _class,

        defaults : {
            selected : false,
            id : "",
            name : "",
            email : "",
            mobile : ""
        },

        initialize : function(contact) {
            superClass.prototype.initialize.apply(this, arguments);
        },

        /**
         * 获取联系人id
         * @returns {*}
         *    联系人id
         */
        getId : function() {
            return this.get("id");
        },

        /**
         * 判断联系人是否已选中
         * @returns {*}
         *     联系人是否已经选中
         */
        isSelected : function() {
            return this.get("selected");
        },

        /**
         * 选中联系人
         */
        select : function() {
            this.set("selected", true);
        },

        /**
         * 取消选中联系人
         */
        unselect : function() {
            this.set("selected", false);
        }
    }));

})(jQuery, _, M139);
