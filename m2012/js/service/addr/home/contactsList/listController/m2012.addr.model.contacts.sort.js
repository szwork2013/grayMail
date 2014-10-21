(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.Contacts.Sort";

    M.namespace(_class, superClass.extend({

        name : _class,

        defaults : {
            name : 1,
            email : 0,
            mobile : 0
        },

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);
        },

        resetAll : function() {
            this.set({
                name : 0,
                email : 0,
                mobile : 0
            }, {
                silent : true
            });
        }
    }));

})(jQuery, _, M139);
