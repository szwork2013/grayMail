(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.Contacts.Filter.InitialLetter";

    M.namespace(_class, superClass.extend({

        name : _class,

        defaults : {
            initialLetter : "all"
        },

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);
        },

        isFiltering : function() {
            return this.get("initialLetter") != "all";
        }
    }));

})(jQuery, _, M139);
