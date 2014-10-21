/**   
* @fileOverview 邮件备注
*/
(function (jQuery, _, M139) {
    
    /**
    * @namespace 
    * 邮件备注,列表页备注,读信页备注
    */

    M139.namespace("M2012.Remark.Model",Backbone.Model.extend({
    
        defaults:{
             max:50,  
	      opType:null,  
		     mid:null,
	        memo:null  
	    },

	    remarkDataSource:function(callback){
	     
		    var options={
			    opType:this.get("opType"),
			       mid:this.get("mid")			  
		    }
    		
		    if(options.opType != 'get' ){
		        options.memo = this.get("memo") //add,update
		    }
		    
            M139.RichMail.API.call("mbox:mailMemo",options,function(result){
                if(result.responseData.code && result.responseData.code == 'S_OK'){
                    callback(result.responseData["var"]);
                }else{
                    //alert('接口异常');
                }
            });
            
	    }

}));

})(jQuery, _, M139);