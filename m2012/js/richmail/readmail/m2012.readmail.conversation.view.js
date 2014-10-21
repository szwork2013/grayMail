/**
* @fileOverview 会话邮件视图
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;

       
    M139.namespace('M2012.ReadMail.Conversation.View', superClass.extend({

    events:{
        "click #covmore": "onConversationMoreClick", //更多会话邮件
        "click span.sj-xh": "showContactsDialog", //联系人浮层
        "click i[name=conversation_star]": "onStarClick", //星标
        "click i[name=title_star]": "onStarClick", //批量星标
        "click i[name=itemStatus]": "onItemStatusClick", //单项邮件状态修改
        "click i[name=title_ico]": "onItemStatusClick", //批量已读未读
        "click #safelock": "showUnlock", //验证安全锁
        "click a.i_u_close": "hideInboxTips" //关闭提示层
          
    },

    name:"M2012.ReadMail.Conversation",

        /**
        * 读信页会话邮件内容加载模板
        */
        template:{

            toolbar:['<div class="bgMargin"><div class="toolBar" id="toolbar_{mid}">{content}</div></div>'].join(''),
            
            title:['',
            '<div class="inboxTips" style="display:none"></div>',
            '<div class="cov-title-bb">',
                '<div class="cov-title clearfix">',
                    '<i class="cov-t-io" name="title_ico"  style="cursor:pointer;display:none"></i>',
                    '<i class="i_star fr" name="title_star"  style="cursor:pointer;display:none"></i>',
                    '<span class="cov-t-s">{title} <span name="count"></span></span>',
                    '<span class="readTagdiv" data-sessionId="{sessionId}" id="readTag_{mid}"></span>',
                '</div>',
                '<div class="cov-spance"></div>',
            '</div>'].join(""),

            itemCovTab:['',
            '<div {tabAttr} data-mid="{mid}" >',
                '<!--[if lt ie 8]><div style="+zoom:1;"><![endif]-->',
                    '<table class="cov-tab">',
                        '<tbody>',
                            '<tr class="{statusTr}">',
                                '<td class="td1">{status}</td>',
                                '<td class="td2"><div class="cov-tdr" title="{name}">{name}</div></td>',
                                '{summary}',
                                '<td class="td4">{attachIco}{date}</td>',
                                '<td class="td5">{starIco}</td>',
                            '</tr>',
                        '</tbody>',
                    '</table>',
                '<!--[if lt ie 8]></div><![endif]-->',
            "</div>"].join(""),

            itemCurrTab:['',
            '<div class="cov-cur" mid="{mid}" id="covcur_{mid}" style="display:">',
                '<div name="loading" style="text-align:center;padding:50px"><img src="/m2012/images/global/loading.gif">&nbsp;正在加载中...</div>',
                '<div class="cov-text hide" style="*zoom:1">', //IE6,IE7
                    '{contentInfo}',
                '</div>',
                '<div class="cov-rep p_relative" id="bottomBar_{mid}">',
                '</div>',
            '</div>'].join(""),

            itemCovMore:['',
            '<div class="cov-show" id="covmore">',
                '<a href="javascript:;">+ 还有{0}封邮件</a>',
            '</div>'].join(""),

            itemContactInfo:['',
            '<div class="cov-inber" style="height:12px;overflow:hidden;">',
                '<span>发送至 {namelist}</span><span class="sj-xh" style="cursor:pointer" mid="{mid}"></span>', //<span class="sj-xh"></span><span class="sj-xs"></span>
            '</div>'].join(""),

            itemContactDialog:['',
            '<div class="menuPop shadow cov-more" id="conversationDialog" style="position:absolute;left:{left}px;top:{top}px;z-index:100;{height}">',
                '<table class="cov-more-talbe">',
                    '<tbody>', 
                        '{data}',
                    '</tbody>',
                '</table>',
            '</div>'].join(""),

            itemContactTr:['',
            '<tr>',
                '<td class="td1">{title}：</td>',
                '<td>{namelist}</td>', //'<div class="cov-ad">蔡冠冕<span>&lt;franyu@139.com&gt;</span></div>
            '</tr>'].join(''),

            inboxTips:['',
                '<a href="javascript:;" class="i_u_close" ></a>',
                '{0}'].join("")
        },

    initialize: function(){
       
        var self = this;
        this.body = $("body");
        this.useraccounts = $User.getAccountListArray();
        this.model= new M2012.ReadMail.Conversation.Model();
        this.mid = this.model.get('mid');
        this.sessionId = this.model.get('sessionId');
        this.readmailview = new M2012.ReadMail.Normal.View();
        this.readmailcontentview = this.readmailview.readmailcontentview;
        this.getTagHtml = this.readmailview.getTagHtml;
        this.renderTag = this.readmailview.renderTag;
        this.setElement(this.el);
        this.list = [];
        this.getNameCache = {}; //
        this.scrollTime = 300;
        if(M139.PageApplication.getTopApp().print){
            this.print = M139.PageApplication.getTopApp().print;
        }else{
            this.print = M139.PageApplication.getTopApp().print = {};
        }
        return superClass.prototype.initialize.apply(this, arguments);
    },

    /** 先搭桥 */
    initContainer:function(){
        this.covCon = this.$el.find('#cov-list');
        this.toolBarCon = this.$el.find("div.toolBar");
        this.titleCon = this.$el.find("div.cov-title");
        this.titleParentCon = this.titleCon.parent();
        this.titleCountCon = this.titleCon.find("span[name='count']");
        this.titleStarCon = this.titleCon.find("i[name='title_star']");
        this.titleIcoCon = this.titleCon.find("i[name='title_ico']");
        this.tagsCon = this.titleCon.find("span.readTagdiv");
    },

    initModelChangeEvent:function(){
        var self = this;
        
        //记录修改已读数量
        this.model.on("change:unReadedCount", function () { 
            self.renderTitleCount();
        });

        //修改总数
        this.model.on("change:total", function () { 
            var countStr = self.getTitleCount();
            self.titleCountCon.html(countStr);
        }); 

        //记录修改星标
        this.model.on("change:starCount", function () { 
            self.changeTitleStar();
        });

        //记录修改标签
        this.model.on("change:sessionLabel",function(){
            self.showTitleTags();
        });

        //记录修改重要标签
        this.model.on("change:importantCount",function(){
            self.changeImportantFlag();
        });

        //会话邮件mid数据更新
        this.model.on("change:labelMids",function(){
            self.changeSessionMids();
        });

    },

    /** 定义标题属性 */
    initTitleAttr:function(){
        this.renderTitleCount(); //状态图标和邮件数量
        this.changeTitleStar(); //星标
        this.initTitleTags(); //标签
        this.changeTitleHeight(); //高度
        this.changeImportantFlag(); //重要标记
    },

    /** 标题数量变化 */
    renderTitleCount:function(){
        var countStr = this.getTitleCount();
        this.titleCountCon.html(countStr); 
        this.changeTitleIco();
    },

    /** 标题区域高度设置 
    * 主题+标签不超过4行，超过4行后折叠显示，点击小三角展开
    */
    changeTitleHeight:function(){
        var self = this;
        var showMoreTags;
        if(this.titleCon.height() > 84){
            this.titleCon.addClass("cov-title-over");
            this.tagsCon.append('<span class="g-down" title="点击展开更多" style="cursor:pointer;position:absolute;bottom:5px;right:15px"></span>') 
            showMoreTags = this.tagsCon.find("span.g-down");
            showMoreTags.click(function(){
                self.titleCon.removeClass("cov-title-over"); //75px
                $(this).remove();
                self.onResize();
            });
            this.onResize();
        }
    },

    /** 标题图标 */
    changeTitleIco:function(){
        var unReadedCount = this.model.get("unReadedCount"),
            icoClass = 'i_m_n',
            delClass = 'i_m_o',
            icoTitle = '全部标为已读';
        
        if(unReadedCount < 1){
            icoTitle = '全部标为未读';
            icoClass = 'i_m_o';
            delClass = 'i_m_n';
        }

        this.titleIcoCon.removeClass(delClass).addClass(icoClass).attr("title",icoTitle).show();
    },

    /** 标题星标 */
    changeTitleStar:function(){
        var starCount = this.model.get('starCount'),
            starClass = 'i_star_y',
            delClass = 'i_star',
            starTitle = '全部取消星标';
        if(starCount <= 0 ){
            starTitle = '全部标为星标';
            starClass = 'i_star';
            delClass = 'i_star_y';
        }
        this.titleStarCon.removeClass(delClass).addClass(starClass).attr("title",starTitle).show();

    },

    /** 标记标签 
    * model:sessionData, labels
    * 是所有邮件标签集合
    */
   initTitleTags:function(){
        var self = this,
        sessionData = this.model.get('sessionData'),
        labels = [],
        resultLabels = [],
        map = {},
        labelMids = [];
        $.each(sessionData,function(i,val){
            if(val.label && val.label[0]){
                labels = labels.concat(val.label);
            }
            labelMids.push(i);
        });
        
        //排重处理
        $.each(labels,function(i,val){
            if(!map[val]){
                map[val] = val;
                resultLabels.push(val);
            }
        });

        this.model.set({labelMids:labelMids,sessionLabel: resultLabels});

    },

    /** 修改会话mids */
    changeSessionMids:function(){
        var mids = this.model.get('labelMids');
        mids[0] && this.tagsCon.attr('data-mids',mids.join(','));
    },

    /** 删除会话mids */
    delSessionMids:function(delmid){
        var mids = this.model.get('labelMids'),
            newMids = [];
        $.each(mids,function(i,val){
            if(val !== delmid){
                newMids.push(val);
            }
        });
        this.model.set({ labelMids:newMids });
    },

    /** 邮件标签 */
    showTitleTags:function(){
        var tagsStr,
            labels = this.model.get('sessionLabel'), //这数据只用一次
            labelMids = this.model.get('labelMids');
        tagsStr = this.readmailview.getTagHtml(labels);
        tagsStr && this.tagsCon.html(tagsStr);
        this.tagsCon.attr("data-mids",labelMids.join(","));
    },

    /** 重要标记 
    * 会话集里只要有一封邮件是重要邮件就显示重要标志
    */
    changeImportantFlag:function(){
        var count = this.model.get("importantCount");
        if( count > 0){
            this.titleCon.find("span.cov-t-s").prepend('<i class="i_exc mr_5" title="重要邮件"></i>');
        }else{
            this.titleCon.find("i.i_exc").remove();
        }
    },

    initEvents:function(){
        var self = this,
            sessionData = self.model.get("sessionData");

        if(this.el){this.setElement(this.el)}

        //搭桥
        this.initContainer();

        //工具栏定义
        if(self.toolbarview){
            self.toolbarview.el = "#toolbar_" + this.model.get('mid');
            self.renderToolBarMenu();
            self.toolbarview.initEvents();
        }

        //监听model数据改动
        this.initModelChangeEvent();

        //标题属性定义
        this.initTitleAttr();

        //刷新左侧导航
        appView.trigger('reloadFolder',{ reload: true }); //会话邮件读信刷新文件夹  

        //联系人浮层绑定
        $('body').delegate('#conversationDialog','click',function(e){
            M139.Event.stopEvent(e); //阻止冒泡
        });

        //全局点击判断            
        top.$GlobalEvent.on("click", function (e) { 
            $('#conversationDialog').remove();
        });
        
        //标题点击
        this.$el.delegate("div[name='cov-tab-title']","click",function(e){
            var target = e.target || e.srcElement;
            var className = target.className;       
            var flag = true;
            var mid = $(this).attr('data-mid');
            var titleId = $(this).attr('id');
            var data = self.model.get('sessionData')[mid];
            var conContainer = self.$el.find('#covcur_' + mid);
            var firstFlag = $(this).attr("data-first");
            if(/sj-xh|i_star|i_star_y|i_m_o|i_m_n/i.test(className)){
                flag = false;
            }
            if(flag){
                
                self.removeCurrentTabBorder();

                if(!conContainer[0]){
                    if(data){
                        var currInfo = self.getCurrTabInfo(data);
                        var html = currInfo.html;
                        if(html === ''){ return; }
                        $(this).after(html).attr("data-flag",1);
                        conContainer = self.$el.find('#covcur_' + mid);
						//conContainer.find('div[name=loading]').remove();
                        if(!self.loadIng){
                            self.scrollToCurrTab(mid);
                        }
                        
                        self.refreshFolder(currInfo.options);
                    }
                }
                if(titleId){
                    $(this).addClass('hide');
                    conContainer.removeClass('hide');
                    self.markHasReaded($(this), mid);
                    if(!firstFlag){ //第一次和全部展开不显示蓝色边框
                        !self.loadIng && conContainer.addClass("cov-cur-blue");
                    }else{
                        $(this).removeAttr("data-first");
                    }
                    $App.trigger('showBottomBar',{ mid: mid});
                }

                //点击iframe
                var contentIframe = self.$el.find('#mid_' + mid);
                contentIframe.load(function(){
					try{
						$(this).contents().click(function(){
							self.removeCurrentTabBorder();
							conContainer.addClass("cov-cur-blue");
						});
					}catch(e){}
                    self.onResize();
                });

                //样式调整
                self.removeItemBorderStyle();
                self.changePreviousStyle(mid);
                self.checkIsAllMailCardShow();
                self.onResize();
            }
        });

        //内容点击
        this.$el.delegate("div[name='cov-tab-content'], div.cov-inber","click",function(e){
            var target = e.target || e.srcElement;
            var className = target.className;
            var pContainer = $(this).parent();
            var mid = pContainer.attr('mid');
            var flag = true;
            if(/sj-xh|i_star|i_star_y|i_m_o|i_m_n/i.test(className)){
                flag = false;
            }
            if(flag){
                self.removeCurrentTabBorder();
                pContainer.addClass('hide');
                //$('#cov-tab-title_' + mid).removeClass('hide').addClass("cov-cur-blue");
				self.$el.find('#cov-tab-title_' + mid).removeClass('hide').addClass("cov-cur-blue");
				//样式调整
                self.removeItemBorderStyle();
                self.changePreviousStyle(mid);
                self.checkIsAllMailCardShow();
                self.onResize();
            }
        });


        //滚动条
        this.covCon.scroll(function(){
            var _this = this;
			if(!self.addBgClass){
				self.titleParentCon.addClass("cov-title-bg").removeClass("cov-title-bb");
				self.addBgClass = true;
			}
			clearTimeout(self.scrollTimer);
			self.scrollTimer = setTimeout(function(){
				if( $(_this).scrollTop()=== 0 ){ //出现标题背景
					self.titleParentCon.addClass("cov-title-bb").removeClass("cov-title-bg");
					self.addBgClass = false;
				}
			},200);
			$('#conversationDialog')[0] && $('#conversationDialog').remove();
		});

        //监听事件
        this.initMailCardTriggerEvent();

        //展开第一封邮件
        var currMailMid = this.model.get('firstCurrMailMid') || this.model.get('lastMailMid');
        if(currMailMid){
            $('#cov-tab-title_' + currMailMid).attr("data-first",1).trigger("click");
        }
        
        //加锁提示
        var inboxTipsHtml = this.getInboxTips();
        inboxTipsHtml!=='' && this.$el.find("div.inboxTips").html(inboxTipsHtml).show();



        //自适应高度
        self.onResize();
        $(window).resize(function(){
            self.onResize();
        });    
    },

    //定位到当前邮件
    scrollToCurrTab:function(mid){
        var conContainer = $('#covcur_' + mid),
            currTop = conContainer.offset().top || 0,
            fristContainer,
            toTop;
        
        this.findContainer  = this.findContainer || this.covCon.children("div:lt(2)");  //找到第一个节点
        fristContainer = $.grep(this.findContainer,function(val){
            return  $(val).css("display") !== "none";
        })[0];
        
        if($(fristContainer).offset()){
            toTop = currTop - $(fristContainer).offset().top;
            this.covCon.animate({scrollTop:toTop - 50}, this.scrollTime);            
        }
    },
    
    /** 移除当前邮件边框 */
    removeCurrentTabBorder:function(){
        this.$el.find("div.cov-cur-blue").removeClass("cov-cur-blue");
    },

    /** 删除无边框的样式 */
    removeItemBorderStyle:function(){
         this.$el.find("div[name='cov-tab-title']").removeClass("cov-cur-b0");
    },

    /** 修改上一封邮件样式  */
    changePreviousStyle:function(mid){
        var previousCon = $('#cov-tab-title_' + mid).prev();
        if(previousCon && previousCon.attr("mid")){
            previousCon = previousCon.prev();
        }
        previousCon.addClass("cov-cur-b0");
    },

    /** 验证安全锁 
    * 可能第一封邮件是加锁的
    */
    showUnlock:function(){
        var mid = $App.getCurrentTab().name.split("_")[1] || this.model.get('mid');
        var fid = $('#sb_h i.i_lock:eq(0)').parent().parent().attr('fid');
        if( fid && mid ){
            $App.showUnlock(fid, mid);
        }else{
            $App.show('account');
        }
    },
        
    /** 顶部提示条 */
    getInboxTips:function(){
        var lockNum = 0,
            lockCount = this.model.get("lockCount"),
            temp = this.template.inboxTips,
            lockFlag = $('#sb_h i.i_lock')[0],
            text = '';
        if(lockFlag && lockCount > 0){
            text = '本会话邮件有' + lockCount + '封邮件已加锁，如需查看，请先<a href="javascript:;" id="safelock">验证安全锁</a>。';
        }
        return text === '' ? '' : $T.Utils.format(temp,[text]);
    },

    /** 隐藏提示条 */
    hideInboxTips:function(){
        this.$el.find("div.inboxTips").remove();
        this.onResize();
    },
    
    /**
    * 大容器自适应高度
    */
    onResize:function(){
        var self = this;
        this.bContainer = this.bContainer || this.$el.find('#cov-list');
        var containerH = this.body.height() - this.bContainer.offset().top - 5;
        this.bContainer.height(containerH).css({'overflow-x':'hidden','overflow-y':'auto','position':'relative'});
    },

    /** 同步文件夹
    * 逻辑同邮件列表
    */
    refreshFolder:function(mail){
        var isStar = (mail.flags && mail.flags.starFlag) ? true : false;
        var isVip = $App.getView("mailbox").model.isVipMail(mail.from);
        $App.trigger("reduceFolderMail", { fid: mail.fid, isStar: isStar, isVip: isVip });//文件夹未读邮件减少
        if (mail.label && mail.label.length > 0) {//有标签，标签未读邮件减少
            $App.trigger("reduceTagMail", { label: mail.label });
        }  
    },
    
    render:function(isRendered){
        var self = this,
            sessionData = {},
            sessionMails,
            firstCurrMailMid, //第一封展开的未读邮件
            lastMailMid, //最后一封邮件
            unReadedCount = 0,
            slen = 0,
            starCount = 0,
            lockCount = 0,
            importantCount = 0,
            mids = [],
            html;

        !isRendered && self.model.getDataSource(function(result,error){
            if(result){
                sessionMails = result.sessionMails || []; //按时间从老到新输出
                slen = sessionMails.length;
                lastMailMid = sessionMails[0].mid; //最后一封信mid
                sessionMails = sessionMails.reverse(); //顺序排列

                $.each(sessionMails,function(i,val){ 
                    sessionData[val.mid] = val;
                    mids.push(val.mid);
                    if(val.flags){
                        if(val.flags.read === 1){
                            unReadedCount++; 
                            if(!firstCurrMailMid){
                                firstCurrMailMid = val.mid; 
                            }
                        }
                        if(val.flags.starFlag){
                            starCount++;
                        }
                    }
                    if(val.priority === 1){
                        importantCount++;
                    }
                });
            
                try{ 
                    lockCount = self.model.get("mailListData").mailNum - slen;
                }catch(e){}  

                self.model.set({
                    dataSource:result,
                    mid:result.omid,
                    mids:mids,
                    sessionData:sessionData,
                    unReadedCount:unReadedCount,
                    starCount:starCount,
                    total:slen,
                    lockCount:lockCount,
                    importantCount:importantCount,
                    firstCurrMailMid:firstCurrMailMid,
                    lastMailMid:lastMailMid,
                    sessionId:sessionMails[0].mailSession
                });

                html = self.getContainerHtml(result);
                $(self.el).html(html);
                self.closeOtherTabs();
                self.initEvents();
            }else{
                self.readmailview.readMailError();
                self.logger.error("readSessionMail letterInfo returndata error", "[view:readSessionMessage]", error); //日志上报
            }
        });
    },

    /** 关闭其他已打开标签页  
    * 规则：
    * 如果会话邮件聚合了(A:收件箱，B:已发送)，从收件箱打开Tab_AB,再从已发送打开B,需要关闭Tab_AB.
    * 首先打开会话邮件Tab_ABC,删除B和C,快捷回复A,收件箱打开Tab_ADE,由于新的会话邮件包含A,需要关闭Tab_ABC.
    * $App.getTopPageApp().sessionMail['mailmid'] = { mid:val, parentmid:currmid };
    */
    closeOtherTabs:function(){
        var mids = this.model.get('mids'),
            currmid = $App.getCurrMailMid(),
            tabName,
            topSessionData;

        if(!$App.getTopPageApp().sessionMail){
            $App.getTopPageApp().sessionMail = {};
        }

        $.each(mids,function(i,val){
            tabName = "readmail_" + val;
            if( val !== currmid ){
                 _closeTab(tabName);
            }
            topSessionData = $App.getTopPageApp().sessionMail[val];
            if(topSessionData && topSessionData.parentmid !== currmid ){ //已经有会话邮件读取数据且不是本邮件打开
                 _closeTab('readmail_' + topSessionData.parentmid);
            }
            $App.getTopPageApp().sessionMail[val] = { mid:val, parentmid:currmid }; //保存最新数据
        });

        function _closeTab(tabName){
            $App.getTabByName(tabName) && $App.closeTab(tabName);
        }
    },

    /** 获取容器数据 
    * 1、有未读邮件时，定位显示最老的未读邮件，不折叠；
    * 2、无未读邮件时，定位显示最后一封邮件，超过9封时折叠；
    */
    getContainerHtml:function(data){
        var self = this;
        var html = [];
        var title = this.getTitleHtml(data);
        var sessionMails = data.sessionMails || [];
        var sessionData = this.model.get('sessionData');
        var sessionLen = sessionMails.length;
        var toolbar = this.getToolBarHtml();
        var firstConversation;
        var currCoversation; 
        var lastConversation;
        var moreInfo; 
        var content; 
        var firstCurrMailMid = this.model.get('firstCurrMailMid');
        var list = [];

        //有未读邮件时或少于9封时
        if(firstCurrMailMid || sessionLen < 9){
            $.each(sessionMails,function(i,val){
                list.push(self.getConversationItem(val));
            });
            content = list.join('');
        }else{ //大于9封时
            firstConversation = this.getConversationItem(sessionMails[0]);
            lastConversation = this.getConversationItem(sessionMails[sessionLen-1]);
            moreInfo = this.getMoreMailInfo(sessionLen);
            content = [firstConversation,moreInfo,lastConversation].join('');
        }

        this.moreInfoData = sessionMails;

        html.push(toolbar);
        html.push(title);
        html.push($T.Utils.format('<div class="cov-list" id="cov-list">{0}</div>',[content]));
        return html.join('');

    },

    /** 获取工具栏 */
    getToolBarHtml:function(){
        var self = this,
            flag = true,
            dataSource = self.model.get('dataSource'),
            mid = this.model.get('mid'),
            temp = this.template.toolbar;
        
        if($(self.el).attr('id')== 'readWrap' || $App.isNewWin()){
            flag = false;
        }

        if(flag){
            self.toolbarview = new M2012.ReadMail.ToolBar.View({
                el:"#toolbar_" + mid,
                dataSource:dataSource,
                currFid:self.model.get('currFid'),
                isSessionMail:true
            });

            return $T.Utils.format(temp,{
                mid:dataSource.omid, 
                content:self.toolbarview.render()
            });       

        }else{
            return '';
        }
    },

    /** 输出工具栏按钮 */
    renderToolBarMenu:function(){
        var self = this,
            mid = this.model.get('mid');

        var readmailOption = {
                mid:mid,
                mail:self.model.get("mailListData")
            };
         
        if( $App.getCurrentTab().name.indexOf("readmail") >= 0 ) {
            new M2012.Mailbox.View.MailMenu({ 
                el: "#toolbar_" + mid + " .toolBarUl", 
                model: new M2012.Mailbox.Model.Mailbox, 
                readmail:{
                    mid:mid,
                    isSessionMail:true,
                    total:self.model.get('total'),
                    mail:self.model.get("mailListData")
                }
            }).render();
        }
    },

    /** 标题邮件数量 
    * 有未读：显示（1/3)
    * 无未读：显示（3）
    * 只有一封：不显示
    */
    getTitleCount:function(){
        var unReadedCount = this.model.get('unReadedCount');
        var total = this.model.get('total');
        var temp = '({0}/{1})';
        if(unReadedCount > 0){
            return $T.Utils.format(temp,[unReadedCount,total]);
        }else{
            return total > 1 ? '(' + total + ')' : '';
        }
    },

    /** 获取邮件标题 
    * test:pass
    */
    getTitleHtml:function(options){
        var self = this;
        var temp = this.template.title;
        var formatobj = {
            title:$T.Utils.htmlEncode(options.subject),
            sessionId:this.model.get("sessionId"),
            mid:options.omid
        };
        return $T.Utils.format(temp,formatobj) || '';
    },

    /** 获取摘要 
    * test:pass
    */
    getSummary:function(summary, isCurrTab){
        if(isCurrTab){
            return '';
        }
        return '<td><div class="sov-tdt">' + ( $T.Utils.htmlEncode(summary) || '&nbsp;') + '</div></td>';
    },

    /** 获取会话列表 
    */
    getConversationItem:function(options, isCurrTab){
        var self = this;
        if(isCurrTab){
            options.summary = '';
            options.from = options.account;
            options.mid = options.omid;
            options.flags = options.flag;
            if(options.flags.read){
               options.flags.read = 0; //标记为已读 
            }
            if(options.attachments && options.attachments[0]){
                options.attachmentNum = options.attachments.length;
            }
        }
        if(options && options.from && options.sendDate){
            var temp = this.template.itemCovTab;
            var html = $T.Utils.format(temp,{
                    mid:options.mid,
                    tabAttr:isCurrTab ? 'name ="cov-tab-content" ' : 'id="cov-tab-title_' + options.mid + '" name="cov-tab-title"  data-read ="0" ',
                    statusTr:self.getStatusTrClass(options),
                    status:self.getStatus(options),
                    name:$T.Utils.htmlEncode(self.getMailName(options.from)),
                    summary:self.getSummary(options.summary, isCurrTab), //已经encode
                    attachIco:self.getAttachIco(options),
                    starIco:self.getStarIco(options),
                    date:self.getMailDate(options.sendDate) //$Date.format("yyyy-MM-dd hh:mm:ss",new Date(options.sendDate * 1000))
                });
            return html;
        }
        return '';       
    },

    /** 获取邮件阅读状态 */
    getStatusTrClass:function(options){
        if(options.flags && options.flags.read == 1){
         return 'on';
        }
        return '';
    },

    /** 获取邮件阅读状态 */
    getStatus:function(options){
        if(options.flags && options.flags.read == 1){
            return '<i class="i_m_n" mid="' + options.mid + '" name="itemStatus" style="cursor:pointer" title="未读"></i>';
        }
        return '<i class="i_m_o" mid="' + options.mid + '" name="itemStatus" style="cursor:pointer" title="已读"></i>';        
    },

    /** 获取邮件姓名
    * 是本人显示‘我’，其他根据通讯录优先级规则显示 
    */
    getMailName:function(account){
        var name = '',
            self = this;
        if(!this.getNameCache){
            this.getNameCache = {};
        }
        if(this.getNameCache[account]){
            return this.getNameCache[account];
        }    
        if($.inArray($Email.getEmail(account),self.useraccounts) > -1){
            name = '我';
        }else{
            name = $App.getAddrNameByEmail(account);
            if(name.length > 10 && $T.Utils.getBytes(name) > 20){
                name = $T.Utils.getTextOverFlow2(name,20) + '...' 
            }
        }
        this.getNameCache[account] = name;
        return name;
    },

    /** 获取更多邮件 */
    getMoreMailInfo:function(len){
        var temp = this.template.itemCovMore;
        return len > 2 ? $T.Utils.format(temp,[len-2]) : '';
    },

    /** 更多会话邮件信息 */
    getMoreTabHtml:function(){
        var self = this;
        var data = this.moreInfoData;
        var len = data.length;
        var html = [];
        $.each(data,function(i,val){
            if(i > 0 && i < len - 1){
                html.push(self.getConversationItem(val));                
            }
        })
        return html.join('');
    },

    /** 显示更多会话邮件 */
    onConversationMoreClick:function(){
        var self = this;
        var container = $(this.el).find('div.cov-show');
        var html = this.getMoreTabHtml();
        container.hide().after(html);
        container.remove();
        BH('cov_showmoremail');
    },

    /** 获取当前邮件信息
    */
    getCurrTabInfo:function(options, isCurrTab){

        var self = this;
        var temp = this.template.itemCurrTab;
        
        //为了重用函数，做参数兼容处理
        if(isCurrTab){
            options.summary = '';
            options.from = options.account;
            options.mid = options.omid;
            options.flags = options.flag;
        }

        var formatobj = {
            contentInfo:self.getContentInfo(options),
            mid:options.mid
        };
        var html = $T.Utils.format(temp,formatobj) || '';

        return {
            html:html,
            options:options
        };
    },

    /** 获取附件图标 
    * @param {Number} options.attachmentNum 
    */
    getAttachIco:function(options){
        return options.attachmentNum > 0 ?'<i class="i_atta" title="带附件"></i>' : '';
    },

    /** 获取时间
    * @param {Number} 时间,
    * 需要判断是否今年,今年不显示年份
    */
    getMailDate:function(d){
        var date = new Date(Number(d) * 1000),
            year = $Date.format("yyyy",date),
            nowYear = new Date().getFullYear(),
            result = $Date.format("M-dd(w) hh:mm",date);
        
        if(nowYear == year){
            return result;
        }else{
            return year + "-" + result;
        }

        
    },

    /** 获取星标图标 
    * @param {Object} flag  读取options.flags.starFlag
    */
    getStarIco:function(options){
        
        var temp = '<i class="i_star {starclass}" style="cursor:pointer" mid="{mid}" name="conversation_star" data-val="{val}" title="{title}"></i>',
            isHasStar;
        
        if(options.flags && options.flags.starFlag === 1){
            isHasStar = true;
        }

        return $T.Utils.format(temp,{
            mid:options.mid,
            starclass: isHasStar ? 'i_star_y':'',
            val: isHasStar ? '1':'0',
            title: isHasStar ? '取消星标':'标记星标'
        });
    },

    /** 标记星标 
    * @param {Object} 事件
    */
    onStarClick:function(e){
        var self = this,
            target = e.target || e.srcElement,
            $target = $(target),
            mid = $target.attr("mid"),
            name = $target.attr("name"),
            value = $target.hasClass("i_star_y") ? 0 : 1,
            thisCallBack,
            isTitleFlag = name === "title_star" ? true : false,
            targets,
            title,
            tit,
            starCon,
            count = self.model.get('starCount'),
            options = {
                type:'starFlag',
                value:value
            };

            if(isTitleFlag){
                options.sessionIds = [this.model.get('sessionId')];
                starCon = self.$el.find("i[name='conversation_star']");
                thisCallBack = function(){
                    self.allStarChange({
                        $target:$target,
                        value:value
                    });

                    M139.UI.TipMessage.show("邮件标记成功",{ delay:2000});
                };      
                BH('cov_markallstar');      
            }else{ //需要区分是点击子标题还是内容
                options.mids = [mid];
                if(value === 1){
                    targets = this.covCon.find("i.i_star[mid=" + mid + "]");
                }else{
                    targets = this.covCon.find("i.i_star_y[mid=" + mid + "]");
                }
                thisCallBack = function(){
                    if( value === 0 ){
                        targets.removeClass("i_star_y").addClass("i_star");
                        title = "标记星标";
                        self.model.set({starCount:--count});
                    }else{
                        targets.addClass("i_star_y").removeClass("i_star");
                        title = "取消星标";
                        self.model.set({starCount:++count});
                    }
                    $target.attr("title",title);
                    M139.UI.TipMessage.show("邮件标记成功",{ delay:2000});
                }; 
                BH('cov_markstar');
            }

            $App.trigger('changeCovStar',{ options:options,callback:thisCallBack});
    },

    /** 星标批量修改 
    * @param {Object} options  数据对象
    */
    allStarChange:function(options){
        var self = this,
            value = options.value,
            $target = options.$target || this.titleStarCon,
            total = this.model.get('total'),
            title,
            tit,
            count,
            starCon = this.$el.find("i[name='conversation_star']");

        if( value === 0 ){
            $target.removeClass("i_star_y").addClass("i_star");
            starCon.removeClass("i_star_y").addClass("i_star");
            title = "全部标记星标";
            tit = "标记星标";
            count = 0;
        }else{
            $target.removeClass("i_star").addClass("i_star_y");
            starCon.removeClass("i_star").addClass("i_star_y");
            title = "全部取消星标";
            tit = "取消星标";
            count = total;
        }
        self.model.set({starCount:count});
        $target.attr("title",title);
        starCon.attr("title",tit);

        //同时要修改缓存数据
        var isShowMore = $(this.el).find('div.cov-show');
        if(isShowMore.length > 0){
            $.each(this.moreInfoData,function(i,val){
                val.flags.starFlag = value;
            });
        }

    },

    /** 获取发信人抄送人等相关信息 */
    getContactsInfo:function(options){
        if(options && options.from){ delete options.from} //不显示发件人
        var self = this,
            temp = this.template.itemContactInfo,
            accounts = this.getMailAllAccounts(options),
            info = [];
        
        //获取名称，发件人名称最多显示20个字符，超过则截取，截取后最后一个字符用半省略后代替
        $.each(accounts,function(i,val){
           info.push($T.Utils.htmlEncode(self.getMailName(val)));
        })

        var formatobj = {
            mid:options.mid,
            namelist:info.join(", ")  //英文逗号加空格
        };

        return $T.Utils.format(temp,formatobj);

    },

    /** 联系人事件绑定 */
    initContactsInfoEvent:function(thisEl){
        var container = thisEl.find('div.cov-inber:eq(0)');
        var span = container.find('span:eq(0)');
        var w1 = container.width();
        var w2 = span.width();
        var w3 = w1 - 45;
        var spanHeight = span.height();
        if( (w1 - w2 < 42) || spanHeight > 20 ){        
            span.attr("style","float:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:inline-block;");
            span.width(w3);
        }
    },

    /** 联系人弹层单项数据 */
    getContactItem:function(d){
        var self = this,
            name = '',
            email = '',
            html = [],
            item = '<div class="cov-ad">{name}<span>&lt;{email}&gt;</span></div>';
        
        $.each(d,function(i,val){
            name = self.getMailName(val);
            email = $Email.getEmail(val);
            html.push($T.Utils.format(item,{
                name:$T.Utils.htmlEncode(name),
                email:email
            }));
        })

        return html.join('');
    },    

    /** 联系人弹层 */
    showContactsDialog:function(e){
        var self = this,
            $target = $(e.target || e.srcElement),
            mid = $target.attr('mid');
            if(!mid){return}
        var sessionData = this.model.get('sessionData'),
            temp = this.template.itemContactDialog,
            tr = this.template.itemContactTr,
            html = [],
            count = 0,
            data = sessionData && sessionData[mid].dataSource;
        
        $('#conversationDialog').remove();
        
        if(data){

            var showdata = [
                {
                    title:'发件人',
                    d:data.account
                },
                {
                    title:'收件人',
                    d:data.to
                },
                {
                    title:'抄送人',
                    d:data.cc
                },
                {
                    title:'密送人',
                    d:data.bcc
                }                                
            ];

            $.each(showdata,function(i,val){
                if(val.d){
                    var item = val.d.split(",");
                    count += item.length;
                    html.push($T.Utils.format(tr,{
                        title:val.title,
                        namelist:self.getContactItem(item)
                    }));
                }
            });

            html = html.join('');

            var left = $target.offset().left;
            if(this.body.width() - left < 400){
                left -= 320;
            }

            var formatobj = {
                left:left,
                top:$target.offset().top + 10,
                height: count > 12 ? 'height:245px;overflow-y:auto;overflow-x:hidden' : '',
                data:html
            };

            setTimeout(function(){
                !$('#conversationDialog')[0] && $('body').append($T.Utils.format(temp,formatobj));                 
            },200);

            BH('cov_showmorecontacts');
        }
    },

    /** 获取所有邮件帐号 
    * 发信人，收件人，抄送人，密送人
    */
    getMailAllAccounts:function(options){
        var options = options || this.model.get('dataSource');
        var accounts = [];
        if(options){
            options.from && accounts.push(options.from);
            options.to && accounts.push(options.to);
            options.cc && accounts.push(options.cc);
            options.bcc && accounts.push(options.bcc);
        }
        accounts = accounts.join(',').split(",");
        return $.unique(accounts);
    },

    /** 获取附件信息 */
    getAttachsInfo:function(options){
        if(options.attachments && options.attachments.length > 0){
            var attach = this.readmailview.filepreview.getConversationAttach(options.subject,options.attachments,options.omid);
            return attach;
        }
        return '';
    },

    /** 阅读状态修改 */
    onItemStatusClick:function(e){
        var self = this,
            target = e.target || e.srcElement,
            $target = $(target),
            mid = $target.attr("mid"),
            sessionId = this.model.get('sessionId'),
            value = $target.hasClass("i_m_n") ? 0 : 1,
            unReadedCount = this.model.get('unReadedCount'),
            changeCon,
            changePcon,
            _callback,
            args;
        if($target.hasClass("cov-t-io")){ //点击标题
            isTitleFlag = true;
            _callback = function(){
                self.allReadStatusChange({ value:value });
            };
             
            args = {
                sessionIds:[sessionId],
                command:'mark',
                type:'read',
                value: value,
                callback:_callback
            };

            BH('cov_markallread');

        }else{  //点击子项
            changePcon = $('#cov-tab-title_' + mid + ", #covcur_" + mid);
            changeCon = changePcon.find("i[name='itemStatus']");
            _callback = function(){
                if( value === 0 ){
                    changeCon.removeClass("i_m_n").addClass("i_m_o").attr("title","已读");
                    changePcon.find("tr").removeClass("on");
                    self.model.set({unReadedCount:--unReadedCount});
                }else{
                    changeCon.removeClass("i_m_o").addClass("i_m_n").attr("title","未读");
                    changePcon.find("tr").addClass("on");
                    self.model.set({unReadedCount:++unReadedCount});
                }
            };
            args = {
                mids:[mid],
                command:'mark',
                type:'read',
                comefrom:'singleSessionMail',
                value: value,
                callback:_callback
            };
            BH('cov_markread');
        }
        $App.trigger("mailCommand", args);
    },

    /** 批量修改阅读状态 */
    allReadStatusChange:function(options){
        var self = this,
            value = options.value,
            $target = this.titleIcoCon,
            changeCon,
            changeTr;
        if( value === 0 ){ 
            changeCon = self.$el.find("i.i_m_n");
            changeTr = self.$el.find("tr.on");
            changeCon.removeClass("i_m_n").addClass("i_m_o").attr("title","已读");
            changeTr.removeClass("on");
            $target.attr("title","全部标为未读");
            self.model.set({unReadedCount:0});
        }else{ //标为未读
            changeCon = self.$el.find("i.i_m_o");
            changeTr = self.$el.find("tr");
            changeCon.removeClass("i_m_o").addClass("i_m_n").attr("title","未读");
            changeTr.addClass("on");
            $target.attr("title","全部标为已读");
            self.model.set({unReadedCount:self.model.get("total")});
        }

        //同时要修改缓存数据
        var isShowMore = $(this.el).find('div.cov-show');
        if(isShowMore.length > 0){
            $.each(this.moreInfoData,function(i,val){
                val.flags.read = value;
            });
        }
    },

    /** 展开时标记为已读状态 
    * el为折叠的标题
    */
    markHasReaded:function(el, mid){
        var unReadIcon = el.find("i.i_m_n"),
            unReadedCount = this.model.get('unReadedCount');
        
        if(unReadIcon[0]){
            unReadIcon.addClass("i_m_o").removeClass("i_m_n").attr("title","已读"); //标题
            $('#covcur_' + mid).find("i[name=itemStatus]").addClass("i_m_o").removeClass("i_m_n").attr("title","已读");
            el.find("tr").removeClass("on");
            $('#covcur_' + mid).find("tr").removeClass("on");
            unReadedCount > 0 && unReadedCount--;
            this.model.set({unReadedCount:unReadedCount});
        }

    },

    /** 获取正文信息 */
    getContentInfo:function(options){
        return this.readmailcontentview.getMailContentIframe(options.mid,true);
    },         

    /** 渲染邮件卡片头 */
    renderMailCardHeader:function(options){
        var self = this;
        var mid = options.omid;
        var thisEl = $('#covcur_' + mid);
        var len = thisEl.find("div.cov-inber").length;
		if( len > 0 ){ return } //防止局部刷新
		var headerInfo = this.getConversationItem(options,true); //从读信接口取数据
        var contactsInfo = this.getContactsInfo(options);
        var attachsInfo = this.getAttachsInfo(options);
        var html = [headerInfo,contactsInfo,attachsInfo].join('');
        thisEl.find("div[name=loading]").remove();
        thisEl.find("div.cov-text").removeClass("hide");
        thisEl.prepend(html); //渲染DOM
        this.initContactsInfoEvent(thisEl); //绑定联系人信息

        //附件事件绑定
        this.readmailview.filepreview.isSessionMail = true;
        this.readmailview.filepreview.el = thisEl.find('div.convattrlist')[0];
        this.readmailview.filepreview.initEvents(options,mid);

        //底部工具栏
        this.bottomview = new M2012.ReadMail.ConversationBottomBar.View({
            el:thisEl.find('div.cov-rep')[0],
            parentview:self,
            mid:mid,
            data:self.model.get('dataSource')
        }).initEvents();

        //标记这封邮件单元加载完毕
        $('#cov-tab-title_' + mid).attr("data-read",1);
        this.onResize();
        M139.UI.TipMessage.hide();

    },


    /** 邮件广播事件 */
    initMailCardTriggerEvent:function(){
        var self = this;
        var errorFlag = false;
        var total = self.model.get('total');
        var mid = self.model.get('mid');
        var toggleCon = self.toolBarCon.find("li[name=cov-toggle]");
		var sessionData = this.model.get('sessionData');
		var currMid = $App.getCurrMailMid();
        

        //邮件正文
        $App.off('letterDomReady').on('letterDomReady',function(win){

            if(win && win.letterInfo && win.letterInfo.errorCode){
                errorFlag = true;
            }
            if(!errorFlag && win.letterInfo && win.letterInfo.omid){
                
                self.print[win.letterInfo.omid] = win.letterInfo;
                
                //保存正文内容
                var content = win.document.body.innerHTML;
                self.print[win.letterInfo.omid].html = {content:content}; 
                win.letterInfo.html = {content:content};
                self.readmailcontentview.mailDomReady(win.letterInfo,win);
                _letterInlineScript(win);
            }
            
        });

        //邮件头
        $App.off('letterInfoReady').on('letterInfoReady',function(data){
            
            if(data && (data.errorCode || data.errorCode == 0)){ 
                self.logger.error("read conversationmail letterInfo returndata error", "[view:readMessage]", data);
                self.readmailview.readMailError(data); //异常处理
            }else{
                self.model.saveData(data); //保存数据
                self.renderMailCardHeader(data);
            }
        });

        //全部展开折叠
        //1、先展开更多的
        //2、要一封封展开，计时器检测
        $App.off('conversationToggle').on('conversationToggle',function(options){
           
            var doAction = options.doAction;
            var readedLen = self.covCon.find("div[data-read='1']").length;
            if( options && options.sessionId !== self.model.get('sessionId')){
                return;
            }

            if(doAction === 'showConversation'){  //全部展开
                if(!self.loadOver || readedLen < total){

                    total > self.model.get('showStopBtn') && M139.UI.TipMessage.showMiddleTip("会话邮件展开中，请稍后...");
                    self.$el.find('#covmore').trigger("click"); //先展开更多
                    self.loadAllCovTimer = setInterval(function(){
                        var len = self.covCon.find("div[data-read='1']").length;
                        total = self.model.get('total'); //取最新的
                        if( len < total){
                            self.loadIng = true;
                            var loadContainer = self.$el.find("div[data-read='0']:eq(0)");
                            if(!loadContainer.attr("data-flag")){
                                loadContainer.trigger("click");
                            }
                        }else{
                            clearInterval(self.loadAllCovTimer);
                            self.loadAllCovTimer = null;
                            self.loadOver = true;
                            self.loadIng = false;
                            M139.UI.TipMessage.hideMiddleTip();
                            self.showAllMailCardChangeStyle();
                            options.callBack && options.callBack(); //执行回调
                        }      
                    },1000);
                }else{
                    self.showAllMailCardChangeStyle();
                    options.callBack && options.callBack(); //执行回调
                }
                BH('cov_showhistorycontent');
            }else if(doAction === 'stopConversation'){ //停止展开
                M139.UI.TipMessage.hideMiddleTip();
                clearInterval(self.loadAllCovTimer);
                options.callBack && options.callBack(); //执行回调

            }else{ //全部收起
                self.hideAllMailCardChangeStyle();
                options.callBack && options.callBack(); //执行回调
                BH('cov_hidehistorycontent');
            }
            
        });

        //解锁成功后从新加载邮件
        $App.off("unLockOk").on("unLockOk",function(){
            var thismid = self.mid;
            $App.validateTab("readmail_" + thismid);
        }); 

        //同步标记
        this.markTriggerEvent();

        //标签同步
        this.tagsTriggerEvent();

    },

    /** 标记事件广播 */
    markTriggerEvent:function(){
        
        var self = this;

        //工具栏标记重要
        $App.on("mailimportant",function(args){
            
            var count;
            if( args && args.sessionId && args.sessionId === self.model.get('sessionId')) {                
                args.value === 1 ? count = self.model.get('total') : count = 0;
                self.model.set({ importantCount: count});
            }
        });

        //工具栏标记星标
        $App.on("markstar",function(args){
            var count;
            if( args && args.sessionId && args.sessionId === self.model.get('sessionId')) {
                args.value === 1 ? count = self.model.get('total') : count = 0;
                self.model.set({ starCount: count});
                self.allStarChange({value:args.value});
            }
        });

        //工具栏标记已读/未读
        $App.on("mailread",function(args){
            var count;
            if( args && args.sessionId && args.sessionId === self.model.get('sessionId')) {
                args.value === 1 ? count = self.model.get('total') : count = 0;
                self.model.set({ unReadedCount: count});
                self.allReadStatusChange({value:args.value});
            }
        });

    },

    /** 标签事件 */
    tagsTriggerEvent:function(){
        var self = this;
        var mid = $App.getCurrMailMid();

        //增加标签
        $App.on("mailtagschange",function(args){
            var labelId;
            
            var sessionLabel = self.model.get('sessionLabel');
            if( args && args.mids && $.inArray(mid, args.mids) !== -1){    
                labelId = args.labelId;
                if($.inArray(labelId, sessionLabel) === -1){
                    sessionLabel.push(labelId);
                    self.model.set({sessionLabel: sessionLabel});
                    self.showTitleTags();
                }
            }
        });

        //删除标签
        $App.on("removeTag", function(args){
            if(args){
                var sessionLabel = self.model.get('sessionLabel');
                var currmid = args.currMid;
                if( mid === currmid && args.labelId){
                    $.each(sessionLabel,function(i,val){
                        val == args.labelId && sessionLabel.splice(i,1);        
                    });
                    self.model.set({ sessionLabel: sessionLabel});
                }                
            }
        });
        
    },

    /** 全部展开样式 */
    showAllMailCardChangeStyle:function(){
        this.removeCurrentTabBorder();
        this.removeItemBorderStyle();
        this.covCon.find("div[name='cov-tab-title']").addClass('hide');
        this.covCon.find("div.cov-cur").removeClass('hide');
        this.covCon.find("div.cov-cur:eq(0)").addClass("cov-cur-blue"); //第一封邮件标记
        if( this.model.get('unReadedCount') > 0){
            this.titleIcoCon.trigger("click");
        }
        this.onResize();
        this.covCon.animate({scrollTop:0}, this.scrollTime);
    },

    /** 全部收起样式 */
    hideAllMailCardChangeStyle:function(){
        this.removeCurrentTabBorder();
        this.removeItemBorderStyle();
        this.covCon.find("div[name='cov-tab-title']").removeClass('hide');
        this.covCon.find("div.cov-cur").addClass('hide');
        this.onResize();
        this.covCon.animate({scrollTop:0}, this.scrollTime);
    },

    /** 判断是否全部展开 */
    checkIsAllMailCardShow:function(){
        var hideTitleCon = this.covCon.find("div.hide[name='cov-tab-title']"),
            contentLength = this.covCon.find("div.cov-cur").length,
            total = this.model.get('total');

        this.showAllBtn =  this.showAllBtn || this.toolBarCon.find("li[name=cov-toggle] span");
        
        if( contentLength === total ){
            if(hideTitleCon.length === total){ //全部展开
                this.showAllBtn.text('全部收起').attr("data-flag", 2);
                this.loadOver = true;
            }
            if(hideTitleCon.length === 0){ //全部收起
                this.showAllBtn.text('全部展开');
            }
        }
    }

  

}));
    
    
})(jQuery, _, M139);    


