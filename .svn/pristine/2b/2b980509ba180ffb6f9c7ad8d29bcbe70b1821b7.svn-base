;
(function ($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.Merge";
    M.namespace(_class, M.Model.ModelBase.extend({

        name: _class,
        defaults: {
            index: -1, //当前合并的组
            pageCount: 0, //总共有几组
            state: '', //当前页面状态
            stateEmpty: '', //数据为空时的状态
            currRep: [], //当前状态所对应的数据
            nameRep: [], //姓名重复的联系人
            eAndmRep: [], //手机和email重复的联系人
            isShowMore: false  //控制非基础字段显示
        },
        initialize: function (options) {            
            
            superClass.prototype.initialize.apply(this, arguments);
        },
        getContactsInfoById: function(options){
            top.M2012.Contacts.API.getContactsInfoById(options.serialId, function(result){
                if(result.success){
                    options.success(result.contactsInfo)
                }else{
                    options.error(result);
                }
            }, options);

        },        
        mergeContacts: function(options){
            top.Contacts.MergeContacts(options.serialId, options.info, function(result){
                if(result.success){
                    options.success(result);
                }else{
                    options.error(result);
                }
            });
        },
        autoMergeContacts: function(options){
            top.Contacts.AutoMergeContacts(function(result){
                if(result.success){
                    options.success(result);
                }else{
                    options.error(result);
                }
            }, options.type);
        }

    }));

})(jQuery, _, M139);
