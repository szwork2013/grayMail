/**
* @fileOverview 读信页工具栏
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    
    /**
    * @namespace 
    * 读信页工具栏
    */   
         
    M139.namespace('M2012.ReadMail.ToolBar.View', superClass.extend({

    /**
    *@lends M2012.ReadMail.ToolBar.View.prototype
    */

    el:"",

    events:{},

    template:{
        toolbar:[
            '<ul class="toolBarUl">',
            '</ul>',
            '<div class="toolBarSet p_relative">',
                '<span class="toolBarArray" style="display:{1};">',
                    '<a class="one rdCl mr_5" href="javascript:void(0)"></a>',
                '</span>',
                '<span class="toolBarPaging">{0}</span>',
            '</div>'].join('')
    },
    
    initialize: function(data){
        this.dataSource = data.dataSource;
        this.parentview = data.parentview;
        this.currFid = data.currFid;
        this.searchMode = data.searchMode;
        this.isSessionMail = data.isSessionMail; //会话邮件读信
        this.getSessionPrevNextMail = data.getSessionPrevNextMail; //普通邮件读信
        this.mailListData = data.mailListData;
        return superClass.prototype.initialize.apply(this, arguments);
    },
    
    initEvents: function(){ 
        var self = this;
        var currMid = self.dataSource.omid;
        var prevCon = $(self.el).find("a.up");
        var nextCon = $(self.el).find("a.down");
        var pageCon = $(self.el).find("span.toolBarPaging");

        //更多操作
        $(self.el).find(".toolBarArray").click(function(){
            self.createMoreToolMenu(currMid,$(self.el).find(".toolBarSet"));
        });

        /*var shouldCheckBeforeJump = function() {
            var composeiframes = $App.getCurrentTab().view.$el.find('div[name=covMail_bottom_compose]:visible');
            if ($App.isReadSessionMail() && composeiframes.length) {
                return true;
            } else {
                return false;
            }
        };   */     
        //上一封
        $(self.el).delegate("a.up", "click", function(){
            if (self.parentview && self.parentview.hasUnsavedComposeframe()) {
                if(window.confirm('未保存的内容将会丢失，是否跳转？')){
                    BH('cMail_toolbar_prev');
                    self.goToPrevMail();
                }
            } else {
                BH($App.isReadSessionMail() ? 'cMail_toolbar_prev' : 'toolbar_premail');
                self.goToPrevMail();
            }
        });
        
        //下一封
        $(self.el).delegate("a.down", "click", function(){
            if (self.parentview && self.parentview.hasUnsavedComposeframe()) {
                if(window.confirm('未保存的内容将会丢失，是否跳转？')){
                    BH('cMail_toolbar_next');
                    self.goToNextMail();
                }
            } else {
                BH($App.isReadSessionMail() ? 'cMail_toolbar_next' : 'toolbar_nextmail');
                self.goToNextMail();
            }
            
        });

        // 设置会话
        $(self.el).find('#btn_setting').click( function() {
            $Event.stopEvent()
            new M2012.ReadMail.View.ConversationSetting({el: self.el}).render();
            BH('cMail_toolbar_set');
        });
        //会话模式下的普通邮件需要重置上下封数据
        if($App.isSessionMode() && $App.isSessionFid(this.currFid) && !this.searchMode && !this.isSessionMail ){

            this.getSessionPrevNextMailData(function(data){
                var prev,next,html;
                if(data){
                    if(data.prev){
                        self.dataSource.prev = data.prev;
                    }
                    if(data.next){
                        self.dataSource.next = data.next;  
                    }
                    this.getSessionPrevNextMail = false;
                    html = self.getPrevNextMailHtml();
                    pageCon.html(html);
                }
            });
        }


        $App.on('readNextMail',function(data){
            if(data.mid &&  data.mid == currMid ){
                setTimeout(function(){
                    self.goToNextMail();
                },200);
            }
        });
    },
    
    /**
    * 更多操作菜单
    */
    createMoreToolMenu:function(mid,container){
        var self = this;
        var sid = $App.getSid();
        M2012.UI.PopMenu.create({
            items:[
                {
                    text:"新窗口打开",
                    onClick:function(){
  		       	        $App.openNewWin(mid);
                        BH('toolbar_newwin');
                    }
                },
                {
                    isLine:true
                },

                {
                    text: "保存到和笔记",
                    onClick: function () {
                        top.addBehaviorExt({ actionId: 104705, thingId: 1 });
                        var mailObj = M139.PageApplication.getTopApp().print[mid];
                        if (mailObj && mailObj.html) {
                            var title = mailObj.subject || "";
                            title = title.slice(0, 65);
                            var content = mailObj.html.content || "";
                        }
                        //content = content.replace(/\\/ig, "\\\\").replace(/(\r)?\n/ig, "\\n").replace(/\"/ig, "\\\"").replace(/\//ig, "\\\/"); //转义
                        var options = {
                            title: title || '邮件标题',
                            content: content || '邮件内容',
                            attachmentDirId: ""
                        }
                        top.M139.RichMail.API.call("mnote:createNote", options, function (res) {       //创建笔记
                            if (res.responseData && res.responseData["code"] == "S_OK") {
                                M139.UI.TipMessage.show("邮件已转存至和笔记 <a href='javascript:top.$App.show(\"note\")'>查看</a>");
                                //var noteId = res.responseData["var"]["noteid"];         //返回新建的noteId
                            } else {
                                M139.UI.TipMessage.show("保存失败，请重试");
                            }
                            setTimeout(function () {
                                M139.UI.TipMessage.hide();
                            }, 5000);
                        });
                    }
                },

                {
                    text:"导出邮件",
                    onClick:function(){
                        var wmsvrPath2 =  domainList.global.wmsvrPath2;
                        var downloadUrl = wmsvrPath2 + "/mail?func=mbox:downloadMessages&sid={0}&mid={1}";
                        window.open($T.Utils.format(downloadUrl,[sid,mid]));
                        BH('toolbar_export');
                    }
                },
                {
                    text:"打印",
                    onClick:function(){
                        window.open("/m2012/html/printmail.html?mid=" + mid);
                        BH('toolbar_print');
                    }
                },
                {
                    text:"显示邮件原文",
                    onClick:function(){
                        var orignUrl = "/RmWeb/view.do?func=mbox:getMessageData&mode=text&part=0&sid={0}&mid={1}";
                        window.open($T.Utils.format(orignUrl,[sid,mid]));
                        BH('toolbar_mailcode');
                    }
                },
                {
                    text:"邮件有乱码？",
                    onClick:function(){
                        var orignUrl = "/m2012/html/newwinreadmail.html?t=newwin&sid={0}&mid={1}&messycode=1";
                        window.open($T.Utils.format(orignUrl,[sid,mid]));
                    }
                }
            ],
            container:container,
            top:"22px",
            left:"-115px",    
            onItemClick:function(item){
               // alert("子项点击");
            }
        });
    },
    
    /**
	* 上一封邮件
	*/
	goToPrevMail:function(){
	    var data = this.dataSource;
	    var normalTabName = "readmail_" + data.omid;
         setTimeout(function () {
             $App.closeTab(normalTabName);
         }, 200);
	    if(data.prev && data.prev.mid){
			$App.readMail(data.prev.mid, false, this.currFid, { searchMode: this.searchMode });
			function callback_readmail() {
			    $App.trigger("reloadFolder", { reload: true });
			    $App.off("reloadFolder", callback_readmail);//只执行一次
			}
			$App.on('letterInfoReady', callback_readmail);//读信成功后再刷新
	    }
	},
	
	/**
	* 下一封邮件
	*/
	goToNextMail:function(){
	    var data = this.dataSource;
        var normalTabName = "readmail_" + data.omid;
        setTimeout(function () {
            $App.closeTab(normalTabName);
        }, 200);
	  
        if(data.next && data.next.mid){
			$App.readMail(data.next.mid, false, this.currFid, { searchMode: this.searchMode });
        	function callback_readmail() {
        	    $App.trigger("reloadFolder", { reload: true });
        	    $App.off("reloadFolder", callback_readmail);//只执行一次
        	}
        	$App.on('letterInfoReady', callback_readmail);//读信成功后再刷新
		}
	},
    
    /**
    * 工具栏更多操作菜单，上下封邮件输出，注意会话邮件上下封
    */
    getPrevNextMailHtml:function(){
        var data = this.dataSource;
        var prevnextTemp = '<a class="{0}" href="javascript:;" onClick="return false;" mid="{1}" title="{2}"  ></a>';
        var prevnextHtml = [];
        var prevTitle = "";
        var nextTitle = "";
        
		if(data.prev && data.prev.subject){
            prevTitle = "上一封：" + $T.Utils.htmlEncode(data.prev.subject);
        }
        if(data.next && data.next.subject){
            nextTitle = "下一封：" + $T.Utils.htmlEncode(data.next.subject);
        }

        //飞信也支持上下封读信                                                                 
        data.prev && data.prev.mid && prevnextHtml.push($T.Utils.format(prevnextTemp,['up',data.prev.mid,prevTitle]));
        data.next && data.next.mid && prevnextHtml.push($T.Utils.format(prevnextTemp,['down',data.next.mid,nextTitle]));          
        
		return prevnextHtml.join(''); 
    },

    /** 获取上下封数据 */
    getSessionPrevNextMailData:function(callback){
        var dataSource = this.dataSource,
            mid = this.dataSource.omid,
            sessionId;

        if(this.mailListData){
            sessionId = this.mailListData.mailSession;
        }

        var options = {
            fid: this.currFid,
            mid: mid,
            sessionId:sessionId,
            readFlag:0,
            start:0,
            total:1,
            folderPass:'',
            showhtml:0, // 0 - 不显示正文 
            currFid:this.currFid
        };

        
        $RM.readSessionMail(options,function(result){
            if(result.code === 'S_OK' && result['var']){
                callback && callback(result['var']);
            }else{
               callback && callback(null,result); //接口报文异常
            }
        });

    },


    /**
    * 工具栏更多操作菜单和上下封邮件输出
    */
    render:function(){
       var hideFlag = this.getSessionPrevNextMail;
       var PrevNextMailHtml = this.getPrevNextMailHtml(hideFlag);
       var html = this.template.toolbar;
       if ( $App.isReadSessionMail() ) {
            html += '<div style="margin-top:0px;" class="toolBarArray fr mr_5 p_relative"> <a href="javascript:" id="btn_setting" class="two"></a></div>';
       }
       // 【需求调整】读信页隐藏更多操作菜单
       var display = 'none';
       return $T.Utils.format(html,[PrevNextMailHtml, display]);
    }

}));
    
    
})(jQuery, _, M139);    


