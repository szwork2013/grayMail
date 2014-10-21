(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Base.Config.Global";

    M.namespace(_class, superClass.extend({

        name : _class,

        defaults : {

        },

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);

            this.Config = {};

            this.addCfg(this.configGroup()).addCfg(this.configRenderGC()).addCfg(this.configHomeRoute());

        },

        addCfg : function(config) {
            _.extend(this.Config, config);
            return this;
        },

        configGroup : function() {
            var groupId = {
                allContacts : -1,
                noGroup : -2
            };

            var group = {
                groupId : groupId
            };

            return {
                group : group
            };
        },

        getGroupId : function(key) {
            return this.Config.group.groupId[key];
        },

        configRenderGC : function() {
            var renderGC = {
                None : 0,
                Home : 10000,
                CG : 10100,
                CG_Silent : 10150,
                UG : 10200,
                DG : 10300,
                CC : 20100,
                CC_Silent : 20150,
                UC : 20200,
                DC : 20300,
                MC2G : 20400,
                CC2G : 20401,
                IC : 20500,
                MC : 20600,
                SC : 20700
            };

            return {
                renderGC : renderGC
            };
        },

        getRenderGC : function(key) {
            return this.Config.renderGC[key];
        },

        configHomeRoute : function() {
            var homeRoute = {
                MAILBOX_MANAGE_VIP : 10100,
                REDIRECT: 10200,
                SEARCH: 10300,
                END : -1 // 占位用，防止多谢逗号
            };

            return {
                homeRoute : homeRoute
            };
        },

        getHomeRoute : function(key) {
             return this.Config.homeRoute[key];
        },

        getAllContactsGid : function() {
            return this.getGroupId("allContacts");
        },

        getNoGroupGid : function() {
            return this.getGroupId("noGroup");
        }
    }));

})(jQuery, _, M139);
