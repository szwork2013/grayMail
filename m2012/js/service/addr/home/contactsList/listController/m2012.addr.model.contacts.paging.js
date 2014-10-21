(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.Contacts.Paging";

    M.namespace(_class, superClass.extend({

        name : _class,

        defaults : {
            pageIndex : 0,
            totalRecords : 0,
            pageSize : 20
        },

        initialize : function(options) {
            superClass.prototype.initialize.apply(this, arguments);
            if (options) {
                this.set(options);
            }
            this.buildData();

//            _this.on("change", function(model, attr) {
//                _this.synData();
//            });
            this.on("change:totalRecords change:pageSize", this.setMaxIndex, this);
            this.on("change:pageIndex", this.setFirstPage, this);
            this.on("change:pageIndex change:maxIndex", this.setLastPage, this);
        },

        /**
         * 同步model的数据
         */
        buildData : function() {
            this.setMaxIndex();
            this.setFirstPage();
            this.setLastPage();
        },

        hasContacts : function() {
            return this.get("totalRecords") > 0;
        },

        setMaxIndex : function() {
            this.set("maxIndex", Math.ceil(this.get("totalRecords") / this.get("pageSize")));
        },

        setFirstPage : function() {
            this.set("firstPage", this.get("pageIndex") == 1);
        },

        setLastPage : function() {
            this.set("lastPage", this.get("pageIndex") == this.get("maxIndex"));
        }
    }));

})(jQuery, _, M139);
