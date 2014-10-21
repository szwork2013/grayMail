/**   
* @fileOverview 普通模式读信
*/

(function (jQuery, _, M139) {

/**
*@namespace 
*普通模式读信
*/

M139.namespace("M2012.ReadMail.Normal.Model",Backbone.Model.extend({
   
    defaults:{  
    	fid:null,
		mid:null,
		win:false,
		mailListData:null,
		currFid:null,
		showToolBar:true,
		popup: null
	},
	
	logger: new M139.Logger({name: "M2012.ReadMail"}),
	
	//打印页面数据存储
    savePrintData:function(dataSource){
        var topSessionData = $App.getTopPageApp().sessionMail,
        	mid = dataSource.omid;

        if(!M139.PageApplication.getTopApp().print){
            M139.PageApplication.getTopApp().print = {}
        }
        if(!M139.PageApplication.getTopApp().print[mid]){ //防止覆盖
            M139.PageApplication.getTopApp().print[mid] = dataSource;        	
        }

        if(topSessionData && topSessionData[mid] && !this.get('win')){
        	var parentmid = topSessionData[mid].parentmid;
        	mid !== parentmid && this.closeSessionTab(parentmid);
        }
    },

    //关闭其他已打开的会话邮件
    closeSessionTab:function(mid){
    	var tabName = 'readmail_' + mid;
    	$App.getTabByName(tabName) && $App.closeTab(tabName);
    },
    isFromMyself:function(dataSource){
    	var email=$Email.getEmail(dataSource.account);
    	var result=false;
    	$($User.getAccountList()).each(function(i,n){
    		if(n.name==email){
    			result=true;
    		}
    	});
    	return result;

    },

    /** 保存添加提醒数据 
	 * 暂时保持和旧版一致，只给自己发短信和邮件提醒
    */
    saveCalendarData:function(options){
    	var self = this; 
    	top.calendar_mailInfo = {
    		email:'',
    		mobile:'',
    		title:options.title
    	}; //传给打开窗口
    },
	
	getDataSource:function(callback){//获取邮件列表
	    var self = this;
	    var fid = this.get('currFid');
	    var sessionInterface = this.get('sessionInterface');
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
				returnAntispamInfo:1
		};
		
		if(sessionInterface){
		    data.sessionId = this.get("mailListData").mailSession;
			data.readFlag = 0;
			data.start=0;
			data.total=199;
			data.folderPass='';
            data.mode='html';
            data.currFid=fid;
		}
		
		function errortips(){
            $Msg.alert('读取信件失败，请稍后再试。');
            M139.UI.TipMessage.hide();
            $App.close();
		}
		
		//会话模式下，普通读信也需要读取会话邮件接口
		if(sessionInterface){
		    $RM.readSessionMail(data,function(result){
	            if(result.code && result.code == 'S_OK'){
	                
	                callback && callback(result["var"]);
	                self.savePrintData(result["var"]);
	            }else{
                    errortips();
	                self.logger.error("readsessionmail returndata error", "[mbox:readSessionMail]", result);
	            }
	        });
        }else{	        
	        $RM.readMail(data,function(result){
	            if(result.code && result.code == 'S_OK'){
	                callback && callback(result["var"]);
	                self.savePrintData(result["var"]);
	            }else{
                    errortips();
	                self.logger.error("readmail returndata error", "[mbox:readMail]", result);
	            }
	        });
	    }

	}

	

}));

})(jQuery, _, M139);
