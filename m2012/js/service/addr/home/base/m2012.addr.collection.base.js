(function($, _, M) {

    var superClass = Backbone.Collection;
    var _class = "M2012.Addr.Collection.Base";

    M.namespace(_class, superClass.extend({

        name : _class,

        EVENT_KEYS : {
            // REMOVE_CONTACTS : "remove:contacts"
        },

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);
        },

        keyTrigger : function(eventKey, args) {
            this.trigger(this.EVENT_KEYS[eventKey], args);
        },

        keyOn : function(eventKey, callbalck, context) {
            this.on(this.EVENT_KEYS[eventKey], callbalck, context);
        }
    }));

})(jQuery, _, M139);
