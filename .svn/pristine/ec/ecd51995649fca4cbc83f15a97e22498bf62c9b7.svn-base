(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.Contacts.Search";

    M.namespace(_class, superClass.extend({

        name : _class,

        defaults : {
            keyword : "", // 搜索关键字
            totalRecords : 0, // 搜索结果的联系人数量
            searchStatus : 0 // 0 初始化 1 搜索中 2 搜索完成
        },

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);
        },

        openSearchMode : function(keyword) {
            this.set({
                keyword : keyword,
                searchStatus : 1
            });
            // 强制触发change事件，用户可以重复检索同一关键字
            this.trigger("change:keyword");
        },

        resetSearchStatus : function() {
            this.set("searchStatus", 0);
            this.set({
                keyword : "",
                totalRecords : 0
            }, {
                silent : true
            });
        },

        setSearchingStatus : function() {
            this.set("searchStatus", 1);
        },

        setSearchCompleted : function() {
            this.set("searchStatus", 2);
        },

        isStatusReset : function() {
            return this.get("searchStatus") == 0;
        },

        isSearching : function() {
            return this.get("searchStatus") == 1;
        },

        isSearchCompleted : function() {
            return this.get("searchStatus") == 2;
        }
    }));

})(jQuery, _, M139);
