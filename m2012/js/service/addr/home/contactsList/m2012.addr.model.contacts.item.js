(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.Contacts.Item";

    M.namespace(_class, superClass.extend({

        name : _class,

        idAttribute : "SerialId",

        defaults : {
            selected : false
        },

        initialize : function(contact) {
            superClass.prototype.initialize.apply(this, arguments);
            this.set(contact);
            this.set("id", contact.SerialId);
        },

        getId : function() {
            return this.get("SerialId");
        },

        select : function() {
            this.set("selected", true);
        },

        isSelected : function() {
            return this.get("selected");
        },

        unselect : function() {
            this.set("selected", false);
        },

        hasInitialLetter : function(initialLetter) {
            var mInitialLetter = this.get("FirstNameword");
            return mInitialLetter && (mInitialLetter == initialLetter);
        },

        firstEmail : function() {
            var emails = this.get("emails");
            return emails && emails[0] ? emails[0] : "";
        },

        firstMobile : function() {
            var mobiles = this.get("mobiles");
            return mobiles && mobiles[0] ? mobiles[0] : "";
        },

        search : function(keyword) {
            var _this = this;
            var searchFields = ["name", "emails", "mobiles", "faxes", "Quanpin", "Jianpin", "UserJob", "CPName"];
            var arraySearchText = [];
            _.each(searchFields, function(field) {
                var value = _this.get(field);
                if (value) {
                    arraySearchText.push(value);
                }
            });

            var searchText = arraySearchText.join(",");
            return searchText.toLowerCase().indexOf(keyword.toLowerCase()) != -1;
        },

        destroy : function() {
            _Log("contacts item model destroy " + this.get("name") + this.get("SerialId"));
            this.trigger("destroy", this);
            // 注销所有监听的事件
            this.off();
        }
    }));

})(jQuery, _, M139);
