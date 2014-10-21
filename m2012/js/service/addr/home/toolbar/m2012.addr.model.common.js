;
(function ($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.Common";


    M.namespace(_class, M.Model.ModelBase.extend({

        name: _class,

        initialize: function () {
            var _this = this;            
            superClass.prototype.initialize.apply(_this, arguments);            
            _this.initEvent();
        },

        initEvent: function(){

        },
        fetch: function(options) {
          top.M2012.Contacts.API.call(options.name, options.data, function(e) {
                var rs = e.responseText;
                if (/^(.*?)=/.test(rs)) {
                    rs = rs.match(/^(.*?)=/)[1];
                } else {
                    rs = "GetNumWaitForCleaningResp";
                }
                if (rs) {
                    var result = {};
                    result[rs] = e.responseData;
                    options.success(result);
                }else{
                    options.error(e);
                }
            }, {});
        },
        getImportStatus: function(options){
            var _this = this;

            if (top.Contacts && top.Contacts.getColorCloudInfoData) {
                top.Contacts.getColorCloudInfoData(function (result) {
                    if (result && result.ResultCode == "0") {
                        options.success(result.ColorCloudInfo);
                    }else{
                        options.error(result);
                    }
                });
            }
        },
        GetRepeatContactsNew: function(options){
            var request = '<GetRepeatContactsNew></GetRepeatContactsNew>';

            top.M2012.Contacts.API.call('GetRepeatContactsNew', request, function(result){
                var data = result.responseData;
                if(data && data.ResultCode == "0"){
                   options.success(data);
                }else{
                   options.error(result);
                }
            }, options);
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
