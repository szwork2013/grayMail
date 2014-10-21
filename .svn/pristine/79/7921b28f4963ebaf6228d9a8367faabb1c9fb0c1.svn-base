/**
* @fileOverview 会话模式读信
* to do: 转发，回复，解锁，回执
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    
    /**
    * @namespace 
    * 会话模式读信
    */   
         
    M139.namespace('M2012.ReadMail.SessionMail.View', superClass.extend({

        /**
        *@lends M2012.SessionMail.View.prototype
        */
        
        el:"",
        
        /**
        * 读信页会话邮件内容加载模板
        * loading:内容预载等待图标
        * toolbar:工具栏容器模板
        * attachItem:附件列表单项模板
        * sesContainer:会话列表容器模板
        * sliceUp:展开收缩更多项
        * sessionItem:会话列表单项模板
        */
        template:{
        loading:['<div style="text-align:center;padding:20px"><img src="/m2012/images/global/loading.gif" />&nbsp;内容加载中...</div>'].join(''),
        toolbar:['<div class="toolBar" id="toolbar_{0}">{1}</div>'].join(''),
      inboxTips:['<div class="inboxTips">',
 	             '<a href="javascript:;" class="i_u_close" style="display:none"></a>',
 	             '{0}',
                 '</div>'].join(""),        
     attachItem:['<li><i class="i_file_16 {0}"></i><span>{1}{2} | {3} | {4}</span></li>'].join(''),        
   sesContainer:['{inboxtips}',
                '<div class="mailSectionWrap" id="mailSectionWrap_{mid}">',
                    '<div class="readMail">',
                        '<div class="hTitle">',
                            '<h2 style="{titleColor}">{titleIco}{title}</h2>',
                            '<span class="readTagdiv" style="display:none">{tagHtml}</span>',
                        '</div>',
                    '</div>',
                    '<div class="mailSection">{sessionList}</div>',
                '</div>'].join(''),
        sliceUp:[' | <a  href="javascript:;" class="js_slice" ><i class="i_2tridd"></i></a>'].join(''),
    sessionItem:[
            '<div class="mailSectionList {bgClass}" {display} id="con_index_{index}" index="{index}" mid="{mid}" fid="{fid}" rel="{rel}" >',
                '<div class="mailSectionListTitle clearfix">',
                    '<h3 class="fl fz_14">{email}</h3>',
                    '<span class="fr time">{date}{remindIco}</span>',
                '</div>',
           '<div class="tips">',
                '<div class="tips-text">',
                    '<div class="mailSectionTitle p_relative">',
                        '<div class="rMList">',
                            '<span class="rMl">主&#12288;题：</span>',
                            '<div class="rMr">{title}</div>',
                        '</div>',
                        '{to}',
                        '{cc}',
                        '{bcc}',
                        '{attach}',
                        '<div id="readremark_{mid}" class="rMList jstoggle" name="remark" style="display:none"></div>',
                        //'{remind}',
                        //'{delivery}',
                        '<span class="readmialTool" >',
                            '<a href="javascript:;" bh="readmail_star"><i {starAttribute} mid="{mid}" id="rsm_star_{mid}"></i></a> | ',
                            '<a href="javascript:;" name="remark_add" bh="readmail_addremark"><i class="i_note {remarkClass}"></i></a> | ',
                            '{newWinUrl}',  
                        '</span>',
                   '</div>',     
                   '<div class="mailText p_relative">',
                     '<span class="fontZoom" id="fontzoom_{mid}" style="display:none" > <a href="javascript:;" rel="increase"  title="放大字号" bh="readmail_bigfont"><span>A</span><sup>+</sup></a><a href="javascript:;" title="原来字号大小" rel="normal" bh="readmail_normalfont">原</a><a href="javascript:;" title="缩小字号" rel="reduce" bh="readmail_smallfont"><span style="font-size:10px;">A</span><sub>-</sub></a> </span> ',
                     '<div class="pl_5 pr_5 c_666 js_content" >',
                     '{content}</div>',
                   '</div>',
                   '<div class="mailSectionOperate p_relative" id="bottomtoolbar_{mid}"></div>',
                '</div>',
                '<div class="tipsTop diamond"></div>',
            '</div>',    
         '</div>'].join('')
        },
        
        events:{},
        
        initialize: function(){
            var self = this;
            self.list = [];
            self.model = new M2012.ReadMail.SessionMail.Model();
            self.readmailview = new M2012.ReadMail.Normal.View();
			self.getTagHtml = self.readmailview.getTagHtml;
            self.renderTag = self.readmailview.renderTag;
            self.filepreviewview = new M2012.ReadMail.View.FilePreview();
            self.remindview = appView.getView("remind");
            this.appOn(this);
        },
        
        initEvents:function(){
            var self = this;
            appView.trigger('reloadFolder',{ reload: true }); //会话邮件读信刷新文件夹                        
            //self.readmailview.el = self.el;
            
            self.onResize();
            $(self.el).scrollTop(0);
            $(window).resize(function(){
                self.onResize();
            });    
            //验证安全锁        
            $(self.el).find('.inboxTips a#safelock').click(function(){
                $App.showUnlock(1,$App.getCurrMailMid());
            });
            self.remindview.addEvent($(self.el).find('.mailSection'));
        },
        
         //监听事件
        appOn:function(self){
            var self = this;
            //var tagContainer = $(self.el).find('.readTagdiv');
            appView.on("readmailControl",function(e){   
                var thismid = self.model.get('mid');
                if(e.mids && $.inArray(thismid,e.mids)>-1){    
                    //标签同步处理
                    if( e.command == 'tag'){
                        var labelIds = $App.getMailDataByMid(thismid).label;
                        var tagContainer = $(self.el).find('.readTagdiv');
                        if (tagContainer.find("[tagid=" + e.args.labelId + "]").length==0) {
                            labelIds.push(e.args.labelId);
                            var newTag = self.getTagHtml(labelIds);
                            self.renderTag(tagContainer, newTag);
                        }
                        appView.trigger("mailboxDataChange",{render:true});                 
                    } 
                }
            });
            
            //解锁成功后从新加载邮件
            $App.on("unLockOk",function(){
                var thismid = self.model.get('mid');
                $App.validateTab("readmail_" + thismid);
            }); 

        },
    
        /** 
        * 获取提醒图标 
        */
        getRemindIco:function(dataSource){
            var taskFlag = dataSource.flags.taskFlag || 0;
            
            var status = ['add','update','finish'][taskFlag]; //任务状态
            var map = {
                'add':'i_tx',
                'update':'i_tx_y',
                'finish':'i_tx_b'
            };
            var data = {
                classname: map[status],
                mid: dataSource.mid,
                status: status,
                taskdate: dataSource.taskDate || 0,
                from: $T.Html.encode(dataSource.from),
                senddate: dataSource.sendDate,
                subject: $T.Html.encode(dataSource.subject)
            };
            var temp = [''
                ,'<a href="javascript:;" class="{classname} ml_5" rel="read" name="mailtask">'
                ,'<span mid="{mid}" status="{status}" taskdate="{taskdate}" from=\'{from}\' senddate="{senddate}" subject="{subject}"></span>'
                ,'</a>'
                ,''].join('');
                
            return $T.Utils.format(temp,data);
        },
        
        /**
        * 会话邮件星标属性
        * @param {Object} flag  读取flag.starFlag
        */
        starAttribute:function(flag){
            var isHasStar = flag.starFlag == 1 ? 1 : 0 ;
	        var temp = 'name="read_starmail" class = "i_star {0}" val = "{1}" title="{2}" ';
	        var starClass = isHasStar ? 'i_star_y':'';
	        var title = isHasStar ? '取消星标':'标记星标';
	        return $T.Utils.format(temp,[starClass,isHasStar,title]);
        },
        
        /**
        * 会话邮件备注图标
        * @param {Object} flag  读取flag.memoFlag
        */
        remarkClass:function(flag){
            return flag.memoFlag == 1 ? "i_note_y" : ""; 
        },
 
        /**
        * 会话邮件打开新窗口读信路径
        * @param {string} mid 
        */             
        newWinUrl:function(mid,fid){
            var url = '<a  href="javascript:;" name="newwin" id="newwin" mid="{0}" title="新窗口读信" bh="readmail_newwin"><i class="i_2win"></i></a>';
            return $T.Utils.format(url,[mid]);
        },
    
        
        /**
        * 会话邮件mid集
        */
        midArray:[],
        
        /** 
        * 滚动加载内容
        * 执行条件：滚动到邮件位置且前一封邮件加载完
        */
        loadSessionContent:function(){
            var self = this;
            var firstContainer = $(self.el).find(".mailSectionList[rel='']:first");
            if(firstContainer.length > 0){
                var index = parseInt(firstContainer.attr('index'));
                var top = firstContainer.offset().top;
                var prevItemContainer = $(self.el).find("#con_index_" + (index - 1));
                var thisready = false;
                if( index == 0 ){
                    thisready = true;  
                }                
                if(index > 0 && $(self.el).scrollTop() + $(window).height() > top && prevItemContainer.attr("rel")=='loaded'){
                    thisready = true;
                }
		        if(thisready){
                    firstContainer.attr('rel','loading');
                    var mid = firstContainer.attr("mid");
                    var fid = firstContainer.attr("fid");
                    self.initSessionItem(firstContainer,mid,fid,index);
  		        	if(mid==self.midArray[self.midArray.length-1]){
                    	self.loadOver = true;       
                    }
				}
  		            
            }             
             //最后一封加载判断
             var lastContainer = $(self.el).find(".mailSectionList:last");
             var lastIndex = parseInt(lastContainer.attr('index'));
             var lastRel = lastContainer.attr('rel');
             var lasttop = lastContainer.offset().top;
             if(lastRel == 'loaded' && $(self.el).scrollTop() + $(window).height() > lasttop && lastIndex + 1 < self.list.length){
                 self.loadNextItem(lastIndex + 1);
             }
        },
        
        /**
        * 初始化会话单元
        */
        initSessionItem:function(This,mid,fid,n){

            //生成单元备注视图
            var self = this;
            var wrapId = $(self.el).find('.mailSectionWrap').attr('id');
            var remarkEl = $T.Utils.format('#{0} #con_index_{1}',[wrapId,n]);
            var remarkview = new M2012.Remark.View({el:remarkEl});
            if(self.rsmFlagsArray[n] && self.rsmFlagsArray[n].memoFlag == 1){
                remarkview.model.set({opType:'get',showtype:'sessionmail',mid:mid});
                remarkview.render();
            }else{
                remarkview.model.set({mid:mid});
            }
            remarkview.initEvents();
                
            //生成单元读信视图
            var sessionrm = self.readmailview;
            sessionrm.model.set({ mid: mid, fid: fid });
            //M139.UI.TipMessage.show("正在加载中...");
            sessionrm.model.getDataSource(function (dataSource) {
                if(dataSource.headers){
                    var taskdate = dataSource.headers.taskDate || 0;
                    var span = $(This).find('a[name=mailtask] span');
                    if(span.length > 0){
                        span.attr('taskdate',taskdate);
                    }
                }
                
                //收件，发件，抄送 注意：会话接口不提供数据所以要从读信取
                var storeObj = {};
                var receiverHtml = [];
                storeObj.getFromHtml =  self.readmailview.getReceiverHtml('发件人',dataSource.account);
                storeObj.getDateHtml = '';
                storeObj.getTitle = '';

                if(dataSource.to){
                    var tohtml = self.readmailview.getReceiverHtml('收件人',dataSource.to);
                    receiverHtml.push(tohtml);		            
		            storeObj.getToHtml = tohtml;
                }
		        if(dataSource.cc){
                    var cchtml = self.readmailview.getReceiverHtml('抄　送',dataSource.cc);
                    receiverHtml.push(cchtml);		
                    storeObj.getCcHtml = cchtml;            
                }
                if(dataSource.bcc){
                    var bcchtml = self.readmailview.getReceiverHtml('密　送',dataSource.bcc);
                    receiverHtml.push(bcchtml);		            
		        }

                $(This).find('.rMList:first').after(receiverHtml.join(''));

                if(dataSource.attachments && dataSource.attachments.length > 0){
                    var attach = sessionrm.filepreview.getSessionAttach(dataSource.subject,dataSource.attachments,dataSource.omid);
                    storeObj.getAttachHtml = attach;
                    $(This).find("#attachList").html(attach).show();
                }
                
                var content = sessionrm.readmailcontentview.getMailContentIframe(mid);
                $(This).find(".js_content").html(content);
                sessionrm.readmailcontentview.el= $(This).find("iframe");
                sessionrm.readmailcontentview.getMailContentHtml(mid,dataSource);
                $(This).attr('rel','loaded');

                //附件交互（存彩云）
                sessionrm.filepreview.el = $(This).find('.convattrlist')[0];
                sessionrm.filepreview.initEvents(dataSource,mid);  
                
                //底部工具栏视图
                var bottomtoolbarview = new M2012.ReadMail.SessionMail.View.BottomToolBar({
                    el:"#bottomtoolbar_" + mid,
                    mid:mid,
                    account:dataSource.account,
                    tabmid:self.tabmid,
                    parentview:self    
                });
                bottomtoolbarview.render();    
                
                //联系人卡片                            
			    self.readmailview.showContactCard(This);
			    
			    //字体缩放
			    $(This).find('.mailText').hover(function(){
			        $(This).find('.fontZoom').show()
			    },function(){
			        $(This).find('.fontZoom').hide()
			    });
			    
			    
			    $(This).find('a[name=newwin]').click(function(){
                    var mid = $(this).attr('mid');
                    $App.openNewWin(mid);
                });
			                      
            });

        },
        
        
        /**
        * 容器自适应高度
        */
        onResize:function(){
            var self = this;
            var containerH = $("body").height() - $(self.el).offset().top;
            containerH = Math.max(200,containerH);

            if($(self.el).attr('id') != 'readWrap'){ //普通读信
                var toolBarH = 0;
                var tipsBoxH = 0;
                if( $(self.el).find('.toolBar')[0] ){
                    toolBarH = $(self.el).find('.toolBar').height();
                }
                if( $(self.el).find('.inboxTips')[0] ){
                    tipsBoxH = $(self.el).find('.inboxTips').height();
                }                 
                $(self.el).height(containerH + 2);
                var mailSectionWrap = $(self.el).find('.mailSectionWrap');
                if(mailSectionWrap[0] && $B.is.ie && $B.getVersion() < 7){
                    mailSectionWrap.width($(self.el).width() - 40); //IE6特殊处理
                }
                mailSectionWrap.height(containerH - toolBarH - tipsBoxH - 18).css({'overflow-x':'hidden','overflow-y':'auto','position':'relative'});
            }else{ //分栏读信
                $(self.el).height(containerH + 2).css({'overflow-x':'hidden','overflow-y':'auto','position':'relative'});
            }

        },
        
        /** 顶部邮件提示 */
        getInboxTips:function(lockNum,deleteNum){
            var temp = this.template.inboxTips;
            var text = '';
            if(lockNum > 0 && deleteNum > 0){
                text = '本会话集有'+ lockNum +'封邮件需要<a href="javascript:;" id="safelock">验证安全锁</a>查看，<span id="deletenum_'+this.tabmid+'">'+ deleteNum +'</span>封邮件需要到<a href="javascript:$App.showMailbox(4)">已删除</a>文件夹查看。';
            }else if(deleteNum > 0){
                text = '你删除了本会话集中的<span id="deletenum_'+this.tabmid+'">'+ deleteNum +'</span>封邮件，如需查看请进入<a href="javascript:$App.showMailbox(4)">已删除</a>文件夹。';
            }else if(lockNum > 0){
                text = '本会话集里有' + lockNum + '封邮件已加锁，如需查看，请先<a href="javascript:;" id="safelock">验证安全锁</a>。';
            }
            return text == '' ? '' : $T.Utils.format(temp,[text]);
        },
        
        /**
        * 组装会话单元数据列表(注意：第一封邮件可能是已删除里面的)
        * @param {string} firstContent 第一封会话内容
        * @param {object} sessionMails 数据源
        */
        getSessionItem:function(firstContent,sessionMails){
            var self = this;
            var list = [];
            var result = [];
            var firstIndex = ''; //第一封信（非已删除的)
            var rsmMidsArray = [];
            var sessiontemp = self.template.sessionItem;
            var loadingtemp = self.template.loading;
		    var userAgent = $User.getAccountListArray() || '';
		    var i = 0;
		    var deleteNum = 0; //删除的数量
		    var lockNum = 0; //加锁数量
		    var deleteArray = []; //已删除的邮件
		    try{ 
		        lockNum = self.model.get("mailListData").mailNum - sessionMails.length;
		    }catch(e){}		    
		    self.model.set({lockNum:lockNum});
            
		    $.each(sessionMails,function(n,val){
 		        if(val.fid == 4 ){
		            deleteNum++;
		            deleteArray.push(val.mid);
		        }
				if( n==0 ){
                	self.tabmid = val.mid;
                }
	            if(val.fid && val.fid!=4){
	                i++;
	                //console.log('i:'+i);
	                if(firstIndex==''){
	                    firstIndex = n;
	                }
	                //console.log(firstIndex);
	                var from = val.from;
	                from = $T.Html.encode(from); //encode 防xss
	                var summary = val.summary;
	                var mid = val.mid;
	                var bgClass = '';
                    rsmMidsArray.push(mid);
                    self.rsmFlagsArray.push(val.flags);
	                if($.inArray(M139.Text.Email.getAccount(val.from),userAgent)>-1){
	                    bgClass = 'mailSectionListOn';
	                }
                    var getAttach = ""; 
                    if( val.attachmentNum && val.attachmentNum > 0){
                        getAttach = '<div class="rMList" id="attachList" style="display:none" ></div>';                     
                    } 
	                var attachmentNum = val.attachmentNum>0?'attachs':'';
	                //var remind = '';
	                //var delivery = '';
	                
	                //console.log('index:');
	                //console.log(i-1);
	                var formatObj = {
	                    email:$App.getAddrNameByEmail(from),
	                    index:i-1,
	                    mid:mid,
	                    fid:val.fid,
	                    bgClass:bgClass,
	                    display:$T.Utils.format("style='display:;z-index:{0};'",[300-n]),
	                    rel:'',
	                    date:$Date.format("yyyy-MM-dd hh:mm:ss",new Date(val.sendDate * 1000)),
	                    title: M139.Text.Utils.htmlEncode(val.subject),
	                    content:n==0 ? firstContent : loadingtemp,
		                attach:getAttach,
                        remindIco:self.getRemindIco(val),
                        //remind:'',
                        //delivery:'',
                        remarkClass:self.remarkClass(val.flags),
                        newWinUrl:self.newWinUrl(mid,val.fid),
                        starAttribute:self.starAttribute(val.flags)
	                    };
	                self.midArray.push(mid);	
	                n < sessionMails.length && self.list.push($T.Utils.format(sessiontemp,formatObj));
	                n == firstIndex && list.push($T.Utils.format(sessiontemp,formatObj)); //n<1就是默认显示第一个
	            }
	        });	
	        if(deleteNum>0){
	            self.model.set({deleteNum:deleteNum,deleteArray:deleteArray});
	        }
	        return list;
        },
        
        /**
        * 加载下一个会话单元容器
        * @param {number} index 会话单元索引
        */
        loadNextItem:function(index){
            $(this.el).find('.mailSection').append(this.list[index]);                    
        },
        
        /**
        * 加载控制
        */
        loadItemControl:function(){  
            var self = this;    
            var currmid = $App.getCurrMailMid();
            if(currmid != self.tabmid){
                //首封邮件加锁
                $(self.el).find(".toolBar,.mailSectionWrap").hide();
            }
            var timer = M139.Timing.setInterval('sessionmail', function(){
				if(!self.loadOver &&  currmid &&  currmid == self.tabmid){ 
				    var test = self.tabmid;
					var curr = $App.getCurrMailMid();
					self.loadSessionContent();                
				}else{
					M139.Timing.clearInterval(timer);
				}
            },1000);      
        },
        
        /**
        * 会话列表输出
        */
        render:function(isRendered){
            var self = this;
            var sessiontemp = self.template.sessionItem;
            var toolbartemp = self.template.toolbar;
            var sescontainertemp = self.template.sesContainer;
            var loadingtemp = self.template.loading;
            var html = [];
            var list = [];
            var rsmMidsArray = [];
            self.rsmFlagsArray = []; //保存flag数据，方便异步调用
			!self.loadOver && self.loadItemControl(); 
            !isRendered && self.model.getDataSource(function(data){
                if(data.code === 'S_OK' && data['var']){
                    var result = data['var'];
                    var mid  =  result.omid;
                    var title = result.subject == "" ? "(无)" : result.subject;  
                    
                    var showToolBar = true;
                    var clearMyself = false;
    		        if($(self.el).attr('id')== 'readWrap' || $App.isNewWin()){
    		            showToolBar = false;
    		            clearMyself = true;
    		        }

                    //保存数据                    
                    self.readmailview.model.savePrintData(result); //保存数据

                    //获取工具栏
                    var gettoolbarview = new M2012.ReadMail.ToolBar.View({el:"#toolbar_" + mid,dataSource:result,currFid:self.model.get('currFid')}); 
                    if(showToolBar){
    		            var toolbar = $T.Utils.format(toolbartemp,[mid,gettoolbarview.render()]);
    		            html.push(toolbar);
        		    }
                    
    		        //会话单元列表
    		        var firstContent  = self.readmailview.readmailcontentview.getMailContentIframe(mid);
    			    var list = self.getSessionItem(firstContent,result["sessionMails"]);
                    
			        var deleteNum = self.model.get('deleteNum');
			        var lockNum = self.model.get('lockNum');
			        var inboxTipsHtml = self.getInboxTips(lockNum,deleteNum);
                    
                    
			        var mailListD = $App.getMailDataByMid(mid);
                    var label = null;
                    if(mailListD && mailListD.label){
                        label =mailListD.label;
                    }           
                    self.model.set({label:label});
			        var formatObj = {
			            inboxtips:inboxTipsHtml,
			            mid:mid, 
			            titleIco:self.readmailview.getTitleIco(mid),
			            titleColor:self.readmailview.getColor(mid),
				        title:M139.Text.Utils.htmlEncode(title),
				        tagHtml:self.readmailview.getTagHtml(label),
					    sessionList:list.join('')
					    };
			        var sescontainerHtml = $T.Utils.format(sescontainertemp,formatObj);
			        html.push(sescontainerHtml);
			        $(self.el).html(html.join(''));
		            self.onResize();
		            $(self.el).scrollTop(0);
                    
                    //显示我的标签
		            self.readmailview.renderTag($(self.el).find('.readTagdiv'));
		    
    			    //输出顶部工具栏内容
    			    if(showToolBar){
    			        gettoolbarview.el="#toolbar_" + mid;
	                    gettoolbarview.initEvents();
    			    }else{
    			        $("#toolbar_" + mid).hide();
    			    }
			        
	                var readmailOption = {
	                    mid:mid,
	                    mail:self.model.get("mailListData")
	                };
	                if ($App.getCurrentTab().name.indexOf("readmail") >= 0) {
	                    var menu = new M2012.Mailbox.View.MailMenu({ el: "#toolbar_" + mid + " .toolBarUl", model: new M2012.Mailbox.Model.Mailbox, readmail: readmailOption });
	                    menu.render();
	                }
                    
			        /*计时器监控加载会话单元*/
			        self.loadItemControl();
                    self.initEvents();
                    
                }
            })
            
        }
        
}));
    
    
})(jQuery, _, M139);    