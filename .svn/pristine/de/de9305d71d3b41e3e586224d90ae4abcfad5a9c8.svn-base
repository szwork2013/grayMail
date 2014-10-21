/**   
* @fileOverview 读信页往来邮件
*/

(function (jQuery, _, M139) {

/**
* @namespace 
* 读信页往来邮件
*/

    M139.namespace("M2012.ReadMail.Contactsmail.Model",Backbone.Model.extend({
        
        defaults:{
            email:null, //往来邮件帐号
            mailListData: null
        },


        searchContactsMail: function(options,callback){
            var self = this;
            var option = {
	            fid: 0,
	            recursive: 0,
	            isSearch: 1,
	            start: 1,
	            total: 15,
	            limit: 20
	        };
            option = $.extend(option,options);
            /*for(var key in options){  //压缩有问题
                option[key] = options[key];
            }*/
	        M139.RichMail.API.call("mbox:searchMessages", option, function (res) {
	            callback( res.responseData["var"]);
	        });
        },
	    /**
	    * 获取附件列表数据
	    */
	    getAttachData:function(options,callback){
	        var self = this;
            M139.RichMail.API.call("attach:listAttachments",options,function(result){
                callback && callback(result.responseData);
            });   
	    }

}));

})(jQuery, _, M139);


