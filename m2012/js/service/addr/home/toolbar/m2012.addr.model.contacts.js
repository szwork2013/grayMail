;
(function ($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.AddrContacts";

    M.namespace(_class, M.Model.ModelBase.extend({

        name: _class,

        initialize: function () {
            var _this = this;            
            superClass.prototype.initialize.apply(_this, arguments);            
            _this.initEvent();
        },

        initEvent: function(){

        },
        sendMail: function(options){
            var _this, request;
            
            _this = this;
            request = "<ModContactsField><SerialId>{0}</SerialId><FamilyEmail>{1}</FamilyEmail></ModContactsField>";
            request = request.format(
                options.selContact.SerialId,
                top.encodeXML(options.inputV)
            );
            
            request = _this.getRequest(request, 'FamilyEmail', options);

            top.Contacts.execContactDetails(request, function (result) {
                if (result.success) {
                    options.success(result);
                } else {
                    options.error(result);                    
                }
            });
        },
        sendCard: function(options){
            var _this, request;

            _this = this;
            request = "<AddContactsField><SerialId>{0}</SerialId><FamilyEmail>{1}</FamilyEmail></AddContactsField>";
            request = request.format(
                options.selContact.SerialId,
                top.encodeXML(options.inputV)
            );
            
            request = _this.getRequest(request, 'FamilyEmail', options);

            top.Contacts.execContactDetails(request, function (result) {
                if (result.success) {
                    options.success(result);
                } else {
                    options.error(result);                    
                }
            });
        },
        modContactsField: function(options){
            top.Contacts.ModContactsField(options.serialID, options.info, false, function(result) {
                if (result.success) {                    
                    options.success(options.value);
                } else {
                    options.error(result);
                }
            });
        },
        addContacts: function(options){
            top.M2012.Contacts.API.addContacts(options.info, function (result) {
                if (result.success) {
                    options.success(result);
                } else {
                    options.error(result);                    
                }
            });
        },
        realDelete: function(options){
            top.Contacts.deleteContacts(options.serialId, function(result) {
                if (result.success) {                   
                    options.success(result);
                    
                } else {
                    options.error(result);
                }
            });
        },
        deleteFromGroup: function(options){
            top.Contacts.deleteContactsFromGroup(options.groupId, options.serialId, function(result) {
                if (result.success) {
                    options.success(result);
                } else {
                    options.error(result);
                }
            });
        },
        sendMMS: function(options){
            var _this, request;

            _this = this;
            request = _this.getRequest(request, 'MobilePhone', options);

            top.Contacts.execContactDetails(request, function (result) {
                if (result.success) {
                    options.success(result);
                } else {
                    options.error(result);                    
                }
            });
        },
        moveContactsToGroup: function(options){
            top.Contacts.moveContactsToGroup(options.serialID, options.formGroupID, options.toGroupID, function(result) {
                if (result.success) {                   
                   options.success(result);
                } else {
                   options.error(result);
                }
            });
        },
        copyContactsToGroup: function(options){
            top.Contacts.copyContactsToGroup(options.groupID, options.serialID, function(result) {
                if (result.success) {
                    options.success(result);
                } else {
                    options.error(result);
                }
            });
        },
        getRequest: function(request, params, options){
            //[FIXED] 接口改变，需要传所有的信息
            var contacts = top.Contacts.getContactsById(options.selContact.SerialId);
            var groupID = top.Contacts.getContactsGroupById(options.selContact.SerialId);
            if (contacts) {
                contacts['GroupId'] = groupID.join(',');
                contacts[params] = top.encodeXML(options.inputV);                
                request = contacts;
            }
            
            return request;
        },
        editGroupList: function(options){
            window.top.Contacts.editGroupList({ groupName: options.groupName, serialId: options.serialId }, function(result) {
                if (result.ResultCode == "0") {
                   options.success(result);
                } else {
                    options.error(result);
                }
            });
        }
    }));

})(jQuery, _, M139);
