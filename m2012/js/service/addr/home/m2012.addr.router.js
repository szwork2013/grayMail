;
(function ($, _, M) {



     //

    var _class = "M2012.Addr.Router";
    M.namespace(_class, Backbone.Router.extend({

        routes:{
            "/posts/:id": "getPost", //"http://localhost/#/posts/121
            "/download/*path": "downloadFile",
            "*actions": "defaultRoute",
            "/:route/:action": "loadView" //"http://localhost/#/search/txl
        },

        initialize: function(options) {
            this.master = options.master;
        },

        loadView:function(route, action) {
            alert(route,action);
        },

        defaultRoute:function(actions){
            console.log(actions);
        }

    }));

})(jQuery, _, M139);
