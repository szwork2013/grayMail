
(function ($, _, M) {

var superClass = M.Model.ModelBase;
var _class = "M2012.Addr.Model.Import.Pim";

M.namespace(_class, M.Model.ModelBase.extend({

    name: _class,

    initialize: function() {
        this.model = new M2012.Addr.Model.Import.Common();    
        return superClass.prototype.initialize.apply(this, arguments);
    },

    fetch: function(options) {
        var _this, url, api, params, data;

        _this = this;
        api = "/sharpapi/addr/apiserver/iContactService.ashx";
        params = {
            sid: top.$App.getSid(),
            APIType: "sendsync",
            rnd: Math.random(),
            sourceType: options.sourceType,
            importtype: options.importType
        };
    
        url = top.$Url.makeUrl(api, params);     

        top.M2012.Contacts.API.call(url, {}, function(result){
            //result = {code:000,summary:'-1',batch:'8613926572774201402171121575037923276'}; 
            if(result && result.responseData){
                data = result.responseData;
                if(typeof(result.responseData) != 'object') data = eval(result.responseData);
            }else if(result && result.responseText){
                data = result.responseText;
                if(typeof(result.responseText) != 'object') data = eval(result.responseText);
            }      
            
        	options.success(data);
        }, options);
    },

    querySyncStatus: function(options){
        this.model.queryStatus(options);
    },

    getImportStatus: function(options){
        var _this = this;

        if (top.Contacts && top.Contacts.getColorCloudInfoData) {
            top.Contacts.getColorCloudInfoData(function (result) {
                if (result && result.ResultCode == "0") {
                    options.success(result.ColorCloudInfo);
                } else {
                    options.error(result);
                }
            }, function (result) {
               options.error(result);
            });
        }
    }



}));

})(jQuery, _, M139);
