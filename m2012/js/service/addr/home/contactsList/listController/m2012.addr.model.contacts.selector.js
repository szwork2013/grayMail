(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.Contacts.Selector";

    M.namespace(_class, superClass.extend({

        name : _class,

        defaults : {
            selectedNum : 0,
            totalRecords : -1,
            pageSelected : false // 当前页是否全选择
        },

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);

            // this.on("change:selectedNum", this.onSelectedNumChanged, this);
        },

        allSelected : function() {
            var selectedNum = this.get("selectedNum");
            return selectedNum > 0 && selectedNum == this.get("totalRecords");
        },

        noneSelected : function() {
            return this.get("selectedNum") == 0;
        }
    }));

})(jQuery, _, M139);
