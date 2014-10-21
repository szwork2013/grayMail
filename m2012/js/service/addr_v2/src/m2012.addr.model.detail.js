;
(function ($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.Detail";
    M.namespace(_class, M.Model.ModelBase.extend({

        name: _class,
        defaults: {
            state: '', //当前页面状态
            isShowMore: '', //控制非基础字段显示
            SerialId: ''                    
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
        addContacts: function(options) {
            var data = new top.M2012.Contacts.ContactsInfo(options.data);
            if(/nopic/.test(data.ImageUrl) || /nopic/.test(data.ImagePath)){
                data.ImageUrl = "";
                data.ImagePath = "";
            }
            top.Contacts.addContactDetails(data, function(result){
                if(result.success){
                    options.success(result);
                }else{
                    options.error(result);
                }
            });            
        },
        editContacts: function(options) {
            var data = new top.M2012.Contacts.ContactsInfo(options.data);
            if(/nopic/.test(data.ImageUrl) || /nopic/.test(data.ImagePath)){
                data.ImageUrl = "";
                data.ImagePath = "";
            }
            top.Contacts.editContactDetails(data, function(result){
                if(result.success){
                    options.success(result);
                }else{
                    options.error(result);
                }
            });
        },
        removeContacts: function(options){
            top.Contacts.deleteContacts(options.serialId, function(result){
                if(result.success){
                    options.success(result);
                }else{
                    options.error(result);
                }
            });
        },
        modContacts: function(options){
            top.Contacts.execContactDetails(options.data, function (result) {
                if (result.success) {
                    options.success(result);
                } else {
                    options.error(result);                    
                }
            });
        },
        addVip: function(options) {
            top.Contacts.addSinglVipContact(options); 
        },
        removeVip: function(options){
            top.Contacts.delSinglVipContact2(options); 
        }
    }));

})(jQuery, _, M139);
