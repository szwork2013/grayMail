(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Router.Index";

    M.namespace(_class, superClass.extend({

        name : _class,

        defaults : {

        },

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);
        },

        route : function() {
            var routeId = $Url.queryString("homeRoute");

            if(routeId){
                routeId = parseInt(routeId);
            }

            if(_CFG.getHomeRoute("MAILBOX_MANAGE_VIP") != routeId){
                this.routeDefault();
            }

            switch(routeId) {
                case _CFG.getHomeRoute("MAILBOX_MANAGE_VIP"):
                    this.routeMailboxManageVip();
                    break;
                case _CFG.getHomeRoute("REDIRECT"):                    
                    this.routeRedirect();
                    break;
                case _CFG.getHomeRoute("SEARCH"):
                    this.search();
                    break;
                default:

                    break;
            }
           
        },

        routeDefault : function() {
            EventsAggr.Groups.keyTrigger("SELECT_GROUP", {
                groupId : _DataBuilder.allContactsGroupId()
            });
        },

        routeMailboxManageVip : function() {
            EventsAggr.Groups.keyTrigger("SELECT_GROUP", {
                groupId : _DataBuilder.vipGroupId()
            });
        },

        routeRedirect: function () {
           $Addr.trigger($Addr.EVENTS.INIT_REDIRECT, {});
        },
        search: function() {
            var keyword =  $Url.queryString("keyword");
            top.$App.trigger("searchkeywordChange", {type: "addr", keyword: keyword});
        },
        end : function() {

        }
    }));

})(jQuery, _, M139);
