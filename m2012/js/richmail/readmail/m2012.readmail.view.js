/**   
* @fileOverview 读信入口
*/

(function (jQuery, _, M139) {

/**
* @namespace 
* 读信入口： 普通模式读信，新窗口读信，会话模式读信
*/

M139.namespace("M2012.ReadMail.Model",Backbone.Model.extend({
    
    defaults:{  
    	fid:null, //所在文件夹fid
		mid:null,
		win:false,
		currFid:null, //当前文件夹fid,因会话邮件聚合的，fid 不一定等于 currFid
		el:null
	}
	    
}));

})(jQuery, _, M139);


/**
* @fileOverview 读信入口
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    
    /**
    * @namespace 
    * 读信路由，分发普通模式读信，新窗口读信，会话模式读信
    */
         
    M139.namespace('M2012.ReadMail.View', superClass.extend({

        /**
        *@lends M2012.ReadMail.View.prototype
        */
        initialize: function(){
            this.model = new M2012.ReadMail.Model();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        
        /** 标题过滤处理 */
        filterSubject:function(subject){
            if(subject==''){
                subject = '(无)';
            }
            subject = subject.replace(/(&<{)|(}>&)/g,'');
            return subject;
        },

		/** 请求读信 */
        callReadMail:function(mid, win, currFid, options){
			var self = this;
			var searchMode = false;
			var win = win || false;
			var currFid = currFid;
			var fromSource = '';
			var isSearchList = $App.getMailboxView().model.get("isSearchMode"); //是否搜索列表
			if ( isSearchList || (options && options.searchMode) ) {
			   currFid = 0;
			   searchMode = true;
			}
			if (options && options.source) {
			   fromSource = options.source;
			}
			var setData = { mid: mid, win: win, currFid: currFid, searchMode: searchMode, source: fromSource };
			if (options && options.mailData) { setData.mailData = options.mailData }
			self.model.set(setData);

			var returnObj = self.render();


			if (win || fromSource != '') { //新窗口读信处理
			   return returnObj;
			}

			if(returnObj.view.model.get('mailListData')){
			    showReadMail(returnObj);
			}else{
			    var ids = [mid];
			    $RM.getMessageInfo(ids,function(response){
			        if(response.code == 'S_OK' && response['var']){
			            var mailListData = response['var'][0];  
			            setData.mailData = mailListData;
			            self.model.set(setData);
			            returnObj = self.render();
			            showReadMail(returnObj);                                                  
			        }
			    });
			}

			function showReadMail(returnObj){
			    if (returnObj) {
			       $App.showPage({ name: returnObj.name, view: returnObj.view });
			       $App.setTitle(returnObj.subject);
			    }
			}
        },
        
        render:function(){
	        var self = this;
	        var win = self.model.get("win");
	        var mid = self.model.get("mid");
	        var fid = self.model.get("fid");
	        var el = self.model.get("el");
	        var currFid = self.model.get('currFid');
	        var searchMode = self.model.get('searchMode');
            var source = self.model.get('source');
	        if( el == null ){ el = ''}
	        var routerObj = {};
	        var mailData = $App.getMailDataByMid(mid) || self.model.get('mailData'); //兼容往来邮件读信

	        if(!win && source != 'interface' && mailData){	        	
	            //会话读信入口需要加判断
	            var sessionInterface = false;
	            if(!currFid){
	            	currFid = $App.getCurrentFid();
	        	}
	            if(searchMode){
	                currFid = 0;
	                fid = 0;
	            }
	            if(mailData && mailData.mailSession && $App.isSessionMode() && $App.isSessionFid(currFid)){
	                sessionInterface = true;
	            }
	            if(sessionInterface && mailData.mailNum > 1 && mailData.sendId == 0){ //会话邮件模式读信
	            	BH('cMail_read');
	                var readSessionMailView = new M2012.ReadMail.Conversation.View({el:el});
		            readSessionMailView.model.set({mid:mid,mailListData:mailData,currFid:currFid,sessionInterface:sessionInterface});
		            routerObj.name = 'readmail_' + mid;
		            routerObj.view = readSessionMailView; 
		            routerObj.subject = self.filterSubject(mailData.subject);
	            }else{ //普通读信
		            var readmailView = new M2012.ReadMail.Normal.View({el:el});
		            readmailView.model.set({mid:mid,mailListData:mailData,currFid:currFid,sessionInterface:sessionInterface});
		            routerObj.name = 'readmail_' + mid; 
		            routerObj.view = readmailView; 
					
		            routerObj.subject = self.filterSubject(mailData.subject);
	            }
	        }
	        
	        if(win || source == 'interface' || !mailData){
	            //新窗口读信或飞信读信
	            var readmailView = new M2012.ReadMail.Normal.View({el:el});
	            readmailView.model.set({mid:mid,mailListData:null,win:true,currFid:0,source:source});
	            routerObj.name = 'readmail_' + mid; 
	            routerObj.view = readmailView;
	            routerObj.subject = ''; //不依靠邮件列表,暂时取不到，需要在读信时设置
	        }
	        this._readMailNormalView = readmailView;
	        this._readMailSessionView = readSessionMailView;

	        var flags = {};
	        if (mailData) {
	            flags = $.extend({}, mailData.flags, {
	                'billFlag': mailData.billFlag,
	                'subscriptionFlag': mailData.subscriptionFlag,
	                'mailFlag': mailData.mailFlag,
	                'rcptFlag': mailData.rcptFlag
	            });
	        }
	        $App.trigger('readmail', {
                mid: mid,
                fid: currFid,
                flags: flags
            });
	        return routerObj;
	        
        },
		
		/** 
		 * 销毁视图绑定事件
         * 防止分栏读信重复绑定
		 */
        disposeView: function () {
            if (this._readMailNormalView) {
                this._readMailNormalView.undelegateEvents();
            }
            if(this._readMailSessionView) {
            	this._readMailSessionView.undelegateEvents();
            }
        }
	    
    }));
    
    
})(jQuery, _, M139);