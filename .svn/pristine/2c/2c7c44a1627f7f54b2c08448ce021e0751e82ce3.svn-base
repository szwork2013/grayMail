
(function (jQuery, _, M139) {
var superClass=M2012.GroupMail.Model.Base;

M139.namespace("M2012.GroupMail.Model.Session.MemberList",superClass.extend({

    defaults:{  
	},
	initialize : function(options){
	},
    /**
     * 如果该联系人在通讯录内, 并且使用的不是电话号码作为邮件地址, 需更新通讯录
     * @param param
     * @param fnSuccess
     * @param fnFail
     */
    updateAddress: function(param, fnSuccess, fnFail){
        top.Contacts.execContactDetails(param, function (result) {
            if (result.success) {
                fnSuccess(result);
            } else {
                fnFail(result);
            }
        });
    },
    /**
     * 如果该用户不在通讯录内, 需将这个联系人加入到通讯录
     * @param contact
     * @param fnSuccess
     * @param fnError
     */
    addAddress : function (contact, fnSuccess, fnError) {
        var contactInfo = new top.M2012.Contacts.ContactsInfo();
        contactInfo.name = contact.name;
        contactInfo.email = contact.email;
        contactInfo.mobile = contact.MobilePhone;

        top.M2012.Contacts.API.addContacts(contactInfo, function(response){
            console.log(response);
            if (response.success) {
                _.isFunction(fnSuccess) && fnSuccess(response);
            }else{
                _.isFunction(fnError) && fnError(response);
            }
        });
    }
}));

})(jQuery, _, M139);