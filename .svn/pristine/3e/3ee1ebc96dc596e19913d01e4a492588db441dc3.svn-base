/**   
* @fileOverview 读信页往来邮件会话
*/

(function (jQuery, _, M139) {

/**
* @namespace 
* 读信页往来邮件会话
*/

    M139.namespace("M2012.ReadMail.SessionContactsMail.Model",Backbone.Model.extend({
        
        defaults:{
            email:null, //往来邮件帐号
            mailListData: null
        },

		/**
		* 获取邮件列表
		*/
        searchContactsMail: function(callback){
            var self = this,
				keyword = this.get('email'),
				option = {
					fid: 0,
					recursive: 0,
					isSearch: 1,
					start: 1,
					total: 21,
					limit: 20
				},
				_options = {
					condictions: [ //往来邮件条件
						{
							field: "from",
							operator: "contains",
							value: keyword
						},
						{
							field: "to",
							operator: "contains",
							value: keyword
						},
						{
							field: "cc",
							operator: "contains",
							value: keyword
						}
					]
				};
			option = $.extend(option,_options);
		    this.set("searchContactsMailOptions", _options); //查看等多
			M139.RichMail.API.call("mbox:searchMessages", option, function (result) {
				callback && callback(result.responseData);
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


