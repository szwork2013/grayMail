;
(function ($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.Maybeknown";
    M.namespace(_class, M.Model.ModelBase.extend({

        name: _class,
        defaults: {
            list: [], //存放数据的容器
            pageIndex: 0, //当前页数, 后台需要
            pageSize: 0, //每页请求个数, 后台需要
            pageCount: 1, //总页数            
            currentIndex: 0 //当前加载的联系人

        },       
        initialize: function (options) {
            superClass.prototype.initialize.apply(this, arguments);
        },
        getWhoAddMePageData: function(options) {
            top.M2012.Contacts.API.getWhoAddMePageData(options.info, function(result){
                if(result.success){
                    options.success(result);
                }else{
                    options.error(result);
                }
            });
        }
    }));

})(jQuery, _, M139);
