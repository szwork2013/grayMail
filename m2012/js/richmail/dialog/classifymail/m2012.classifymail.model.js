/**
* @fileOverview 列表页工具栏历史邮件分类功能
*/

(function (jQuery, _, M139) {

/**
*@namespace 
*列表页工具栏历史邮件分类
*/

M139.namespace("M2012.ClassifyMail.Model",Backbone.Model.extend({
        
        defaults:{  
		    startTime:0,
		    endTime:null,
		    minSendNumber:2,
		    total:20,
		    filterOption:null,
		    from:[],
		    dialog:null,
		    filterItems:null,
		    addFilterItems:null    
	    },
	    
	    tips:{
            fail: '历史邮件分类失败',    
            noselect: '请选择分类的邮件',
            sucess: '历史邮件分类成功！你选择的邮件已成功分拣到指定文件夹。'
	    },

	    /**
	    * 邮件分拣接口批量处理
        * @param {callback} function 回调函数
	    */
	    filterHistory:function(callback){
	        var self = this;
	        var filterItems = self.get("filterItems");
	        var addFilterItems = self.get("addFilterItems");
	        var thisItems = [];
	        
	        if(filterItems!=null){
	            for(var i = 0; i < filterItems.length; i++){
	                thisItems.push({
	                    func: "user:filterHistoryMail139",
	                    "var":filterItems[i]
	                }); 
	            }
	        }

	        if(addFilterItems!=null){
	            for(var i = 0; i < addFilterItems.length; i++){
	                thisItems.push({
	                    func: "user:setFilter_139",
	                    "var":addFilterItems[i]
	                }); 
	            }
	        }
	        
            M139.RichMail.API.call("global:sequential2", 
            { items: thisItems }, function (res){
                callback(res);
            }); 
	    },
    
	    /**获取top10数据*/
	    getItemListData:function(callback){
	        var now = new Date();
		    var options = {
			    startTime: this.get("startTime"),
			    endTime: now.getTime(),
			    minSendNumber: this.get("minSendNumber"),
			    total:this.get("total")
		    };
	        M139.RichMail.API.call("user:statMessages",options,function(result){
                if(result.responseData.code && result.responseData.code == 'S_OK'){
                    callback && callback(result.responseData["var"]);
                }else{
                    callback && callback(result);
                }
            });    
	    }
	    
}));

})(jQuery, _, M139);