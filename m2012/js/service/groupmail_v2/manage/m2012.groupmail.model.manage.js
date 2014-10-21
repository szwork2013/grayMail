
(function (jQuery, _, M139) {

var superClass=M2012.GroupMail.Model.Base;

M139.namespace("M2012.GroupMail.Model.Manage",superClass.extend({

    defaults: {
    	mainState: 'contacts', //首页视图状态
        groupNumber: 0,  //首页当前选择的群ID
        groupName: '', //首页当前选中的群名称
        refreshMain: '', //刷新群组主视图
        refreshNotice: '', //刷新喇叭数量
        pageIndex: 1, //群组列表区当前页码数
        pageSize: 50 //每页显示数（群组人员上限）
    },
    REFRESH_STATE:{
    	DEFAULT: 'defaults', //默认,默认选中第一个群组
    	NEW_GROUP: 'newGroup',//创建群组
    	NOTIFY: 'notify', //状态消息
    	REFRESH: 'refresh' //只刷新不做额外操作
    },
	initialize:function(options){
      	return superClass.prototype.initialize.apply(this, arguments);
	},
	getInviteList:function(callback){
		var groupNumber=this.get("groupNumber");
		superClass.prototype.queryInvitedRecord.call(this,{},function(result){
		    result=$.grep(result,function(n,i){ //筛选当前分组的
				return (n["groupNumber"]==groupNumber)
				
			});
			callback(result);

		})
	},
	createGom: function(options){
	    superClass.prototype.createGom.call(this, options, function (result) {
	        if (result.code == 'S_OK') {
	            options.success(result);
	        } else {
	            options.error(result);
	        }
	    });
	},
	updateGom: function(options){
	    superClass.prototype.updateGom.call(this, options, function (result) {
	        if (result.code == 'S_OK') {
	            options.success(result);
	        } else {
	            options.error(result);
	        }	        
	    });
	},
	getUserList: function (options) {
	    superClass.prototype.getUserList.call(this, options, function (result) {
	        if (result.code == 'S_OK') {
	            options.success(result);
	        } else {
	            options.error(result);
	        }
	    });
	},
	getGroupList: function (opts) {
	    var that = this,
	    	syn = that.dataEvent["QUERY_GROUP"],
	    	params = that.toJSON();

	    try {
	        params = _.extend(params, opts.param);
	    } catch (e) {
	        
	    }
	    
	    M139.RichMail.API.call(syn, params, function (result) {
	        switch (result.responseData["code"]) {
	            case "S_OK":
                    opts.success(result);
	                break;
                case "S_ERROR":
	            	opts.error(result);
	            	break;
	        }

	    });
	},
	getNoticeCount: function (callback, opts) {
	    var that = this,
	    	syn = "gom:queryInvitedRecord",
	    	params = {
	    	    type: 1,
	    	    pageSize: 5,
	    	    pageIndex: 10
	    	};

	    M139.RichMail.API.call(syn, params, function (result) {
	        //var count = result.responseData["totalRecord"];
	        switch (result.responseData["code"]) {
	            case "S_OK":
	                callback && callback(result);
	                that.trigger(syn, result);
	                break;
	            default:
	                break;
	        }

	    });
	},
	exitGroup: function (options) {
	    superClass.prototype.exitGroup.call(this, options, function (result) {
	        if (result.code == 'S_OK') {
	            options.success(result);
	        } else {
	            options.error(result);
	        }
	    });
	},
	validate: function () {
	    
	}
}));

})(jQuery, _, M139);