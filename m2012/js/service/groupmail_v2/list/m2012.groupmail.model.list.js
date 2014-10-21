
(function (jQuery, _, M139) {
var superClass=M2012.GroupMail.Model.Base;

M139.namespace("M2012.GroupMail.Model.List",superClass.extend({

    defaults:{  
       groupNumber:null, //群号码
       pageSize:20, //每页显示条数
       pageIndex:1,  //当前页码
       hasSendContent : false, //  发信窗口中是否有内容,默认为false
       dataSum : {},  // 数据数目, 包括群邮件和群会话, 用于标签页切换
       currentView : "groupSession", // 默认当前视图为会话视图
       currentGroupLoadComplete : true,  // 当前群组的群消息是否已经加载完成, 默认加载完成
       currentAlbumLoadComplete : true,  // 当前群组的群相册是否已经加载完成, 默认加载完成
       isFirstAlbumInit : true,  // 判断是否是第一次创建Album,默认是
       cacheScrollTop : {} // 保存缓存的滚动条滚动的高度, 切换tab页时需要回填
	},
	initialize : function(options){
      return superClass.prototype.initialize.apply(this, arguments);
	},
	getGroupList : function ( callback , opts ) {
	    var that = this ,
	    	syn = that.dataEvent["QUERY_GROUP"] ,
	    	options ,
	    	params = that.toJSON() ;

    	if( typeof callback !== "function" ){
    		opts = callback ;
    		callback = undefined ;
    	}
		try{
			//params = _.extend( params , opts.param );
		}catch(e){
			//console.warn(e);
		}
	    options = opts || {};
	    /**
	     * 当silent为true时，不触发事件
	     */
	    if(!options.silent){
	    	that.trigger( that.dataEvent["BEFORE_QUERY_GROUP"] );
	    }
	    this.request( syn , {
	    	params:params
	    } , function (result) {
	    	var data = result.responseData["var"],
	    		gNumber = that.get("groupNumber");
	    		try{
	    			/**
	    			 * 有可能数据为空，抛出异常
	    			 */
			    	if(!gNumber){
			    		that.set("groupNumber" , data[0]["groupNumber"]);
			    		that.set("totalRecord" , data[0]["totalMsgCount"]);
                        // 将userId保存
                        that.set("currentUserId", data[0].userId);
			    		data[0]["unreadCount"] =  0;
			    	}
		    	}catch(e){
		    		// throw {
		    		// 	msg:""
		    		// }
		    		//console.warn(e);
		    	}
		    switch(result.responseData["code"]){
		    	case "S_OK":
			    	that.set( "groups" , data );
			    	callback && callback(result.responseData["var"]);
			        that.trigger( syn , result );
			        if(!options.silent){
			       		that.trigger( that.dataEvent["AFTER_QUERY_QROUP"] );
			    	}
			        break;
			    case "FS_UNKNOWN":
			    	that.trigger( that.dataEvent["ERROR_QUERY_GROUP"] , result );
			    	break;
			    default:
			    	break;
	        }
	   
	     });
	} ,
	getMessageList : function( callback ,  opts ){
		var params = {
		        groupNumber : this.get("groupNumber") , 
		        pageSize : this.get("pageSize") , 
		        pageIndex : this.get("pageIndex")
		        //此接口还需要以下数据
		        // userId
		        // userName
		        // groupName
	    	} , 
	    	options ,
	    	that = this ,
	    	syn = that.dataEvent["QUERY_MSG"];
    	if( typeof callback !== "function" ){
    		opts = callback ;
    		callback = undefined ;
    	}
		try{
			params = _.extend( params , opts.param );
		}catch(e){

		}
    	options = opts || {};
        if(!options.silent){
       		that.trigger(that.dataEvent["BEFORE_QUERY_MSG"]);
    	}
    	this.request( syn , {
    		params : params
    	}, function (result) {
            that.set("totalRecord" , parseInt(result.responseData["var"].totalRecord ) );
	    	callback&&callback(result.responseData["var"]);
	        that.trigger( syn , result );
	       if(!options.silent){
	       		that.trigger(that.dataEvent["AFTER_QUERY_MSG"]);
	    	}
	    });
	} ,
	queryGroupDetail : function( gNumber , callback ){
		this.request( "gom:getGroupInfo" , {
			events : {
				typeName : "DetailGroupInfo" 
			} ,
			params : {
				groupNumber : gNumber
			}
		} );

	}
}));

})(jQuery, _, M139);