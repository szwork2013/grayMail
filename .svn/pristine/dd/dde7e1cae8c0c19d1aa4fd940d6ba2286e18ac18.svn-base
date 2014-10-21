﻿/**   
* @fileOverview 会话邮件模型
* code by sukunwei
*/

(function (jQuery, _, M139) {

M139.namespace("M2012.ReadMail.Conversation.Model",Backbone.Model.extend({
   
    defaults:{ 
	    fid:null,
	    mid:null,
        mids:null,
	    sessionId:null,
	    folderPass:null,
	    currFid:null,
	    mailListData:null,
	    showToolBar:true,
        dataSource:null,
        showStopBtn:10, //出现停止展开按钮
        lockCount:0, //加锁邮件数
        importantCount:0, //重要邮件总数
        unReadedCount:0, //未读邮件数
        starCount:0, //星标邮件数
        total:0, //邮件总数
        allReaded:false, //标识已读完
        firstCurrMailMid:null, //第一封展示邮件的mid
        lastMailMid:null,
        isShowMore:false, //是否点击过展示更多
        labelMids:null, //带标签的邮件
        sessionLabel:[], //会话邮件标签
        sessionData:{} //'mid':{ accounts: 'xxx', data: 'xxx'}		    
    },

    /** 从读信获取数据保存 */
    saveData:function(data){
        var sessionData = this.get('sessionData');
        if(data && data.omid){
            if(sessionData[data.omid]){
                sessionData[data.omid].dataSource = data; 
            }
        }
    },

	/**
    * 判断是否为会话邮件: mailnum > 1
    */
    isSessionMid:function(){
        return this.get("mailListData").mailnum > 1  
    },

   /**
    * 判断是否会话文件夹
    * 非会话文件夹：草稿箱（2）已删除（4）垃圾邮件（5）保留文件夹（10）病毒文件夹
    * 非会话文件夹：我的标签，星标邮件，搜索邮件
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
            $.each($App.getFolders('tag'), function (index, val) {
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
        var self = this;
        var fid = this.get('currFid');
        if(fid!=0 && this.get("mailListData") && this.get("mailListData").fid){
            fid = this.get("mailListData").fid;
        }
	    var data = {
			    fid: fid,
			    mid: this.get("mid"),
			    autoName: 1, //有些附件会没有文件名，此属性自动命名附件
			    markRead: 0, //请求会话邮件接口不标为已读，从普通读信标记已读
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
                showhtml:0, // 0 - 不显示正文 
                currFid:this.get('currFid')
	    };

		M139.UI.TipMessage.show("正在加载中,请稍后...");
        $RM.readSessionMail(data,function(result){
            M139.UI.TipMessage.hide();
            if(result.code === 'S_OK' && result['var']){
                callback && callback(result['var']);
            }else{

                //超时处理
                if(result && result.code === "FA_INVALID_SESSION"){
                    top.$App.showSessionOutDialog();
                    return;
                }

                callback && callback(null,result); //接口报文异常
            }
        });
    }    
    

}));

})(jQuery, _, M139);
