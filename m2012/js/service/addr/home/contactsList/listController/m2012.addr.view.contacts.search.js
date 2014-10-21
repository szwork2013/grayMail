(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Contacts.Search";

    M.namespace(_class, superClass.extend({

        name : _class,

        el : "#m139-contacts-list #contacts-search-title",

        logger : new M139.Logger({ name: _class }),

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);

            _this.model.on("change:totalRecords", _this.changeContactsNum, _this);
            _this.model.on("change:searchStatus", _this.changeSearchingMode, _this);

            top.$App.off("searchkeywordChange");
            // top.$App.trigger("searchkeywordChange", {type:"addr",keyword:"hello,world"});
            top.$App.on("searchkeywordChange", function(params) {
                // 如果通讯录页面未加载完成，则不处理搜索。
                if (!window || !window._LoadStatus || window._LoadStatus != 1) {
                    return;
                }
                var type = params.type;
                var keyword = params.keyword;
                if ("addr" == type) {
                    _this.model.openSearchMode(keyword);
                }
            });
        },

        changeContactsNum : function() {
            var $contactsNum = this.$("#searched-contacts-num");
            $contactsNum.text(this.model.get("totalRecords"));
        },

        changeSearchingMode : function() {
            if (this.model.isStatusReset()) {
                this.$el.hide();
            } else {
                this.$el.show();
            }
        },

        render : function() {

        },

        dispose : function() {

        }
    }));

})(jQuery, _, M139);
