/**   
* @fileOverview 会话模式读信
*/
// to do 1. folderpassword
(function (jQuery, _, M139) {

/**
* @namespace 
* 会话模式读信
*/
M139.namespace("M2012.ReadMail.SessionMail.Model",Backbone.Model.extend({
        
        defaults:{ 
		    fid:null,
		    mid:null,
		    sessionId:null,
		    folderPass:null,
		    currFid:null,
		    mailListData:null,
		    showToolBar:true		    
	    },
	    
	    /**
        * 判断是否为会话邮件: mailnum > 1
        */
        isSessionMid:function(){
            return this.get("mailListData").mailnum > 1  
        },
        
        /**
        * 判断是否会话文件夹
        * 非会话文件夹：已发送(3),草稿箱（2）已删除（4）垃圾邮件（5）保留文件夹（10）
        * 非会话文件夹：我的标签
        */
        isSessionFid:function(){
            var fid = this.get("fid");
            var notSessionFids = [2,3,4,5,10];
            var flag = true;
            
            if($.inArray(fid,notSessionFids)>-1){
	            flag = false;
	        }
	        
	        if(flag && $App.getFolders('tag')){
	            var tagsFolders = $App.getFolders('tag');
	            $.each($App.getFolders('tag'),function(index,val){
	                if(tagsFolders[index].fid == fid){
	                    flag = false;
	                    return false;
	                }
	            });    
	        }
	         
	        return flag;
        },
        
	    /**
	    * 获取数据接口
	    */
	    getDataSource:function(callback){
	        var fid = this.get('currFid');
	        if(fid!=0 && this.get("mailListData") && this.get("mailListData").fid){
	            fid = this.get("mailListData").fid;
	        }
		    var data = {
				    fid: fid,
				    mid: this.get("mid"),
				    autoName: 1, //有些附件会没有文件名，此属性自动命名附件
				    markRead: 1,
				    returnHeaders:{Sender:"","X-RICHINFO":""},//为订阅平台增加参数
				    filterStylesheets: 0,
				    filterImages: 0,
				    filterLinks: 0,
				    keepWellFormed: 0,
				    header:1,
				    supportTNEF:1,
				    returnAntispamInfo:1,
				    sessionId: this.get("mailListData").mailSession,
			        readFlag:0,
			        start:0,
			        total:199,
			        folderPass: this.get("folderPass"),
                    mode:'html',
                    currFid:this.get('currFid')
		    };
    		
	        $RM.readSessionMail(data,function(result){
	    	    callback && callback(result);
	        });
	    }
	    
 
}));

})(jQuery, _, M139);