/**
* @fileOverview 会话邮件视图
* code by sukunwei
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;

       
    M139.namespace('M2012.ReadMail.Conversation.View', superClass.extend({

    events:{
        "click #covmore": "onConversationMoreClick", //更多会话邮件
        "click [name=readMailContactsDropdown]": "showContactsDialog", //联系人浮层
        "click i[name=conversation_star]": "onStarClick", //星标
        "click i[name=title_star]": "onStarClick", //批量星标
        "click i[name=itemStatus]": "onItemStatusClick", //单项邮件状态修改
        "click i[name=title_ico]": "onItemStatusClick", //批量已读未读
		"click strong[email], h2[email], em[email]": "onContactsNameClick",//联系人页卡 
		"click span.cov-tdr-span": "onContactsNameClick",//联系人页卡
        "click #safelock": "showUnlock", //验证安全锁
        "click a.i_u_close": "hideInboxTips" //关闭提示层
    },

    name:"M2012.ReadMail.Conversation",

        /**
        * 读信页会话邮件内容加载模板
        */
        template:{

            toolbar:['<div class="bgMargin"><div class="toolBar" id="toolbar_{mid}">{content}</div></div>'].join(''),
            
            covMailSubject:[ '<div class="inboxTips" style="display:none"></div>',
                    '<div class="covv-title clearfix">',
                         '<div class="covv-i-w">',
                             '<input type="checkbox" id="checkAll" class="mail-select" style="{checkboxDisplay}">',
                             '<i class="{star}" name="title_star" style="cursor: pointer;" title="全部标为星标"></i>',
                         '</div>',
                         '<div class="covv-t-s">',
                             '<span class="covv-t-t">{title}&nbsp;</span>',
                             '<span class="covv-t-date" name="count"></span>',
                             '<span class="covv-t-m">由{from}发起了会话，{to}参与了讨论</span>',
                         '</div>',
                     '</div>'].join(""),

            covMailSummary: [ '<div id="covMail_summary_{mid}" name="covMail_summary"  data-read ="0" data-mid="{mid}" class="covv-tab-title" style="{display}">',
                             '<div class="covv-i-w">',
                                '<input type="checkbox" name="covMail_summary_checkbox" class="mail-select" style="{checkboxDisplay}">',
                             '</div>',
                             '<div class="covv-tab-warp">',
                                 '<table class="covv-tab innerboxshadow">',
                                     '<tbody>',
                                         '<tr class="{statusTr}">',
                                             '<td class="td1">',
                                                 '<span>{time}</span>',
                                             '</td>',
                                             '<td class="td2">',
                                                 '<div class="covv-tdr">',
                                                     '<span class="covv-tdr-span" title="{title}" email="{email}" {nameStyle}>{name}</span>',
                                                     '<a class="{vipicon}"></a>',
                                                 '</div>',
                                             '</td>',
                                             '<td class="td3">',
                                                 '<div class="mittle-warp">',
                                                     '<div class="star-warp">{starIco}</div>',
                                                     '{summary}',
                                                     '<div class="TagDiv">{labels}</div>',
                                                 '</div>',
                                             '</td>',
                                             '<td class="td4">',
                                                 '<div id="list_ico_210725d326bfe9c700000002" style="_zoom:1;">',
                                                 '{attachIco}',
                                                 '{remindhtml}',
                                                 '<a href="javascript:;" name="covTagMenu" class="i_tagfor_n"></a>',
                                                 '</div>',
                                             '</td>',
                                         '</tr>',
                                     '</tbody>',
                                 '</table>',
                             '</div>',
                         '</div>'].join(""),

            covMailMainbody: [ '',
                '<div id="covcur_{mid}" name="covMail_mainbody" mid="{mid}" class="covv-details-warp on">',
                     '<div name="loading" style="text-align:center;padding:50px"><img src="/m2012/images/global/loading.gif">&nbsp;正在加载中...</div>',
                     '<div class="covv-i-w" name="checkboxDiv" style="display: none">',
                        '<input type="checkbox" class="mail-select" style="{checkboxDisplay}">',
                     '</div>',
                     '<div class="covv-min-warp innerboxshadow" name="covMail_mainbody_content" style="display:none;">',
                         '<div id="mainbodyHeader" name="mainbody_header" class="covv-mintitle">',
                             
                         '</div>',
                         '<div class="covv-mincontent">',
                             
                             '<div class="covv-mailtextwarp">',
                               '<div id="attachs" class="covv-accessorywarp"></div>',
                               '<div class="mailtext">{contentInfo}</div>',
                               '<a class="go-top go-pack" name="go_top" href="javascript:;" bh="cMail_tab_packup_rightTop"><span class="triangle-top"></span><span class="triangle-w"></span><span class="go-top-text">收起</span></a>',
                               '<a id="goTop" name="go_top" class="go-top" href="javascript:;" bh="cMail_tab_packup">',
                                 '<span class="triangle-top"></span>',
                                 '<span class="triangle-w"></span>',
                                 '<span class="go-top-text">收起</span>',
                               '</a>',
                             '</div>',
                         '</div>',
                         '<div class="covv-minbottom" name="covMail_bottom">',
                             
                         '</div>',
                     '</div>',
             '</div>'].join(""),

             mainbodyHeader: ['<div class="hTitle">',
                               '{from}',
                               '<div class="starwarp">{vipicon}</div>',
                               '<span class="stardel" name="tag_starmail">',
                                 '<a href="javascript:;">{starIco}</a>',
                               '</span>',
                               '{foldername}',
                               '<span class="readTagdiv" style="">{labels}</span>',
                               '<div class="adjunct">',
                                     '{remindhtml}',
                                     '<a href="javascript:;" name="covTagMenu" class="i_tagfor_n"></a>',
                                '</div>',
                                '<div class="covv-inber-warp">',
                                        '<div id="receiver_to" class="inber-warp rMList">',
                                            '<span class="rMl">于<span class="data">{yyyyMMdd}</span><span class="time">{hhmmss}</span>发送至</span>',
                                            '{to}',
                                            '<a class="covv-sj-xhwrap" name="readMailContactsDropdown" mid="{mid}">',
                                                '<span class="covv-sj-xh"></span>',
                                            '</a>',
                                        '</div>',
                                 '</div>',
                            '</div>'].join(""),           

            covMailSummaryOmissioned:[ '<div id="covmore" class="covv-details-warp on"><a class="covv-more innerboxshadow" href="javascript:;">还有<span>{0}</span>封邮件</a></div>'].join(""),
            
            itemContactInfo:['<div class="cov-inber" style="height:12px;overflow:hidden;">',
                                '<span>发送至 {namelist}</span><span class="sj-xh" style="cursor:pointer" mid="{mid}"></span>', //<span class="sj-xh"></span><span class="sj-xs"></span>
                            '</div>'].join(""),

            itemContactDialog:['<div class="menuPop shadow cov-more" id="conversationDialog" style="position:absolute;left:{left}px;top:{top}px;z-index:100;{height}">',
                                    '<table class="cov-more-talbe">',
                                        '<tbody>', 
                                            '{data}',
                                        '</tbody>',
                                    '</table>',
                                '</div>'].join(""),

            itemContactTr:['<tr>',
                                '<td class="td1">{title}：</td>',
                                '<td>{namelist}</td>', //'<div class="cov-ad">蔡冠冕<span>&lt;franyu@139.com&gt;</span></div>
                            '</tr>'].join(''),

            inboxTips:['<a href="javascript:;" class="i_u_close" ></a>{0}'].join("")
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
        this.getNameCache = {};
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
        this.covCon = this.$el.find('#covMailSummaryList');
        this.toolBarCon = this.$el.find("div.toolBar");
        this.titleCon = this.$el.find("div.covv-title");
        this.titleParentCon = this.titleCon.parent();
        this.titleCountCon = this.titleCon.find("span[name='count']");
        this.titleStarCon = this.titleCon.find("i[name='title_star']");
        this.titleIcoCon = this.titleCon.find("i[name='title_ico']");
        this.tagsCon = this.titleCon.find("span.readTagdiv");
    },

    /** 数据改动事件定义 */
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

        //记录修改重要标签
        this.model.on("change:importantCount",function(){
            self.changeImportantFlag();
        });
    },

    /** 定义标题属性 */
    initTitleAttr:function(){
        this.renderTitleCount(); //状态图标和邮件数量
        this.changeTitleStar(); //星标
        this.initTitleTags(); //标签
        this.changeImportantFlag(); //重要标记
    },

    /** 标题数量变化 */
    renderTitleCount:function(){
        var countStr = this.getTitleCount();
        this.titleCountCon.html(countStr); 
        this.changeTitleIco();
    },

    /** 
     * 标题区域高度设置 
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
                //self.onResize();
            });
            //this.onResize();
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
        // 分栏模式下需要同步更新收件箱列表里邮件的星标
        if ($App.getLayout() != 'list') {
            var mid = this.model.get('mid');
            $('#div_maillist').find('tr[mid='+mid+'] i[name=list_starmail]').removeClass(delClass).addClass(starClass);
        }
    },

    /** 
     * 用于生成会话主题的标签（该需求现已取消）
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

    getMailLabels: function(labels){
        if (labels && labels.length) {
            return this.readmailview.getTagHtml(labels);
        } else {
            return '';
        }
    },

    /** 
     * 重要标记 
     * 会话集里只要有一封邮件是重要邮件就显示重要标志
     */
    changeImportantFlag:function(){
        var count = this.model.get("importantCount");
        if( count > 0){
            !this.titleCon.find("i.i_exc")[0]  &&  this.titleCon.find("span.cov-t-s").prepend('<i class="i_exc mr_5" title="重要邮件"></i>');
        }else{
            this.titleCon.find("i.i_exc").remove();
        }
    },

    /** 事件初始化 */
    initEvents:function(){
        var self = this;
        var sessionData = self.model.get("sessionData");
        var isRendered = this.model.get('isRendered');

        // 设置el
        this.el && this.setElement(this.el);

        // 缓存常用DOM节点
        this.initContainer();

        //工具栏定义
        if(self.toolbarview){
            self.toolbarview.el = "#toolbar_" + self.model.get('mid');
            self.renderToolBarMenu();
            self.toolbarview.initEvents();
        }

        //标题属性定义
        this.initTitleAttr();

        // 关闭其他已打开标签页，详见函数规则
        self.closeOtherTabs();

        // 代办任务
        appView.getView("remind").addEvent(this.$el);   

        // 标签
        self.$el.find('a[name=covTagMenu]').die('click').live('click', function(e) {self.oncovTagMenuClick(e);})     
        
        //监听model数据改动
        this.initModelChangeEvent();

        $App.off('changeCovMailSetting');
        $App.on("changeCovMailSetting", function() {
            self.model.getDataSource(function(result,error){
                if(result){
                    // 处理会话邮件数据，存储在model中方便后续调用
                    self.setCovModel(result);
                    var html = self.getCovMailListDOM();
                    self.$el.find('#covMailSummaryList').html(html);
                    // 尝试展开第一封邮件
                    self.expandFirstMail();
                }else{
                    self.readmailview.readMailError();
                    self.logger.error("readSessionMail letterInfo returndata error", "[view:readSessionMessage]", error); //日志上报
                }
            });            
        });

        //联系人浮层绑定
        $('body').delegate('#conversationDialog','click',function(e){
            M139.Event.stopEvent(e); //阻止冒泡
        });

        //全局点击判断            
        top.$GlobalEvent.on("click", function (e) {
            $('#conversationDialog').remove();
        });

        // 鼠标划过列表添加hover样式
        this.$el.find('[name=covMail_summary] table').live('mouseover', function() {
            $(this).closest('[name=covMail_summary]').addClass('on').find('a.check-mail').show();
        }).live('mouseout', function() {
            $(this).closest('[name=covMail_summary]').removeClass('on').find('a.check-mail').hide();
        });
        
        //标题点击
        this.$el.undelegate("div[name='covMail_summary']","click"); //避免分栏读信重复绑定
        this.$el.delegate("div[name='covMail_summary']","click",function(e){
            var target = e.target || e.srcElement;
            var mid = $(this).attr('data-mid');
            var titleId = $(this).attr('id');
            var data = self.model.get('sessionData')[mid];
            var conContainer = self.$el.find('#covcur_' + mid);
            var firstFlag = $(this).attr("data-first");
            // 判断是否需要打开邮件（点击标签代办等节点时无需展开）
            var needExpandMail = function(target) {
                // 星标、VIP等操作
                if (/sj-xh|i_star|i_star_y|i_m_o|i_m_n|mail-select/i.test(target.className)) {
                    return false;
                }
                // 标签操作
                if ($(target).closest('[name=tag_span]').length || $(target).closest('[name=cl_tag]').length || $(target).closest('[name=mailtask]').length || $(target).closest('[name=covTagMenu]').length) {
                    return false;
                }
                return true;
            }(target);

            if(needExpandMail){
                // 关闭其他展开邮件（全部展开时除外）
                !self.loadIng && $(this).siblings('div[name=covMail_mainbody]:visible').each(function() {
                    if ($(this).attr('mid') != mid) {
                        $(this).find('a[name=go_top]:first').click();    
                    }                    
                });
                !self.loadIng && $(this).siblings('div[name=covMail_summary]').removeClass('click-on').find('[name=covMail_summary_checkbox]').attr('checked', false);
                !self.loadIng && self.$el.find('#checkAll').attr('checked', false);

                // 选中当前邮件
                var $curCheckbox = $(this).find(':checkbox[name=covMail_summary_checkbox]');
                if (!$curCheckbox.attr('checked')) {
                    $curCheckbox.attr('checked', true);
                    $curCheckbox.closest('div[name=covMail_summary]')['addClass']('click-on');
                }

                if(!conContainer[0] && data){
                    var currInfo = self.getCurrTabInfo(data);
                    var html = currInfo.html;
                    if(html === ''){ return; }
                    $(this).after(html).attr("data-flag",1);
                    conContainer = self.$el.find('#covcur_' + mid);
                    if(!self.loadIng){
                        self.scrollToCurrTab(mid);
                    }
                    self.refreshFolder(currInfo.options);
                }

                if(titleId){
                    $(this).hide();

                    // 如果邮件正文已经完全加载过（通过邮件头部是否填充判断），需要将可能隐藏的结构取消隐藏（存在写信且修改未保存的情况）
                    if (conContainer.find('#mainbodyHeader').html()) {
                        conContainer.find('div[name=covMail_mainbody_content], div.covv-i-w, #bottombar-cur-pos').show();    
                    }                    
                    // 如果邮件正文完全隐藏（不存在对外暴露的写信卡片），可以滑动下拉展开，否则直接显示（暴露的写信卡会破坏动画效果）
                    if (!conContainer.find('[name=covMail_bottom_compose]:visible')[0]) {
                        conContainer.slideDown('normal')
                    }
                                        
                    conContainer.find(':checkbox').attr('checked', true);   // 选中当前邮件正文的checkbox

                    if (data && data.flags && data.flags.read == 1) {
                        self.markHasReaded($(this), mid);
                        data.flags.read = 0;
                    }
                    
                    if(!firstFlag){ //第一次和全部展开不显示蓝色边框
                        !self.loadIng && conContainer.addClass("on");
                    }else{
                        $(this).removeAttr("data-first");
                    }

                    $App.trigger('showBottomBar',{ mid: mid});
                    
                    if(!self.loadIng){
                        self.scrollToCurrTab(mid);
                    }
                }

                //点击iframe
                var contentIframe = self.$el.find('#mid_' + mid);
                contentIframe.load(function(){
					try{
						$(this).contents().click(function(){
						});
					}catch(e){}
                });

                //样式调整
                self.changePreviousStyle(mid);
                self.checkIsAllMailCardShow();
                self.onResize();
				BH('cMail_read');
            }
        });
        
        // 展开第一封邮件
        this.expandFirstMail();

        //内容点击
        this.$el.undelegate("div[name=mainbody_header], a[name=go_top]", "click"); //避免分栏读信重复绑定
        this.$el.delegate("div[name=mainbody_header], a[name=go_top]", "click",function(e){
            var target = e.target || e.srcElement;
            var pContainer = $(this).closest('div[name=covMail_mainbody]');
            var mid = pContainer.attr('mid');
            var composeView = self['compose'+ mid];
            if(!/sj-xh|inber-name|cov-tdr-span|i_starM|i_starM_y|i_cl_w|i_m_o|send-name|i_m_n|i_tx_n|i_tx_nb|i_tx_ng|user_vip|i_tagfor_n/i.test(target.className)){
                //self.removeCurrentTabBorder();
                // pContainer.addClass('hide');
                if (pContainer.find('[name=covMail_bottom_compose]')[0] && composeView && composeView.isDataChanged()) {
                    pContainer.find('div[name=covMail_mainbody_content], div.covv-i-w, #bottombar-cur-pos').hide();    
                } else {
                    pContainer.hide();
                }
                
                //$('#covMail_summary_' + mid).removeClass('hide').addClass("cov-cur-blue");
				self.$el.find('#covMail_summary_' + mid).show()//.addClass("cov-cur-blue");
				//样式调整
                self.removeItemBorderStyle();
                self.changePreviousStyle(mid);
                self.checkIsAllMailCardShow();
                BH('cov_slideup');				
            }
        });


        //滚动条
        this.covCon.scroll(function(){
            var _this = this;
			if(!self.addBgClass){
				// self.titleParentCon.addClass("cov-title-bg").removeClass("cov-title-bb");
				self.addBgClass = true;
			}
			clearTimeout(self.scrollTimer);
			self.scrollTimer = setTimeout(function(){
				if( $(_this).scrollTop()=== 0 ){ //出现标题背景
					// self.titleParentCon.addClass("cov-title-bb").removeClass("cov-title-bg");
					self.addBgClass = false;
				}
			},200);
			$('#conversationDialog')[0] && $('#conversationDialog').remove();
		});

        // 监听事件
        this.initMailCardTriggerEvent();        
        
        //加锁提示（仅提示一次）
        //因为会话下邮件的真实数量是在收件箱列表点击时注入的，删除不会同步更新，所以这里不再进行解锁提示
        if ( this.getInboxTips ) {
            var inboxTipsHtml = this.getInboxTips();
            inboxTipsHtml!=='' && this.$el.find("div.inboxTips").html(inboxTipsHtml).show();
            this.getInboxTips = null;
        }

        //自适应高度
        this.onResize();

        function closeTabCallback(args) {
            if (self.hasUnsavedComposeframe()) {
                if(window.confirm('关闭写信页，未保存的内容将会丢失，是否关闭？')){
                    args.cancel = false;
                    $App.off("closeTab", arguments.callee);
                }else{
                    args.cancel = true;
                }
            }
        }
        if (!this.hasInitEvents) {
            $(window).resize(function(){
                self.onResize();
            });
            
            $App.on("closeTab", closeTabCallback);
            
            this.hasInitEvents = true;
        }

        // 收起按钮浮动效果
        if (!$B.is.ie || $B.getVersion() >= 7) {
            this.$el.find('#covMailSummaryList').scroll(function() {self.collapseBtnCSSControl()});
        }        

        //切换时高度调整
        var mid = this.model.get('mid'),
            thisTabName = 'readmail_' + mid;
        $App.on("showTab", function (tab) {
            if(tab.name === thisTabName){
                self.onResize();
            }
        });
		
		//hover联系人行为统计
        this.$el.undelegate("a.inber-name","mouseover");
		this.$el.delegate("a.inber-name","mouseover",function(e){
			BH('cov_contacthover');
		});

        this.$el.undelegate("div[name='covMail_mainbody'] span.cov-tdr-span","mouseover");
        this.$el.delegate("div[name='covMail_mainbody'] span.cov-tdr-span","mouseover",function(){
            BH('cov_contacthover');
            $(this).addClass("cov-tdr-spanhover");
        });

        this.$el.undelegate("div[name='covMail_mainbody'] span.cov-tdr-span","mouseout");
        this.$el.delegate("div[name='covMail_mainbody'] span.cov-tdr-span","mouseout",function(){
            $(this).removeClass("cov-tdr-spanhover");
        });

        // 复选框事件
        this.addCheckBoxEvent();

        $App.on('deleteCovMailTag', function(args){
            var mid = args.mid;
            var tagId = args.tagId;
            var sessionData = self.model.get('sessionData') || {};
            var mailData = sessionData[mid];
            var labels = mailData && mailData.label || [];
            for (var i = 0, len = labels.length; i < len; i++) {
                if (labels[i] == tagId) {
                    labels.splice(i, 1);
                }
            }
            // 摘要和正文的标签都要移除
            self.$el.find('div[name=covMail_summary][data-mid='+ mid +'] span[tagid='+ tagId +']').remove();
            self.$el.find('div[name=covMail_mainbody][mid='+ mid +'] span[tagid='+ tagId +']').remove();
        });//{mid: mid, tagId: tagId}

        // 触发会话邮件待办图标及DOM属性（status/taskDate/class）更新
        $App.on('covMailRemindRender', function(args){
            var mid = args.mid;
            var taskFlag = args.taskFlag;
            var taskDate = args.taskDate;
            var status = ['add','update','finish'][taskFlag]; //任务状态
            var map = { //样式
                'add':'i_tx_n',
                'update':'i_tx_nb',
                'finish':'i_tx_ng'
            };

            var covMailSummary = self.$el.find('div[name=covMail_summary][data-mid='+ mid +'] a[name=mailtask]');
            var covMailMainbody = self.$el.find('div[name=covMail_mainbody][mid='+ mid +'] a[name=mailtask]');
            covMailSummary.removeClass('i_tx_n i_tx_nb i_tx_ng').addClass(map[status]);
            covMailSummary.find('span').attr('taskdate', taskDate).attr('status', status);
            covMailMainbody.removeClass('i_tx_n i_tx_nb i_tx_ng').addClass(map[status]);
            covMailMainbody.find('span').attr('taskdate', taskDate).attr('status', status);
        });

        /*
         *
         * 实现删除邮件/标记/转移操作的异步刷新
         *
         */
        $App.off('delCovMails');
        $App.on('delCovMails', function(args) {
            var mids = args.mids || [];
            var len = mids.length;
            var mid;
            var count = 0;
            while (mid = mids.pop()) {
                var summary = self.$el.find('[name=covMail_summary][data-mid='+ mid +']');
                var mainbody = self.$el.find('[id=covcur_'+ mid +']');
                var covMails = self.model.get('sessionData');
                var mail = covMails[mid];
                if (mail && mail.flags && mail.flags.read == 1) count++;

                summary.remove();
                if (mainbody[0]) {
                    var frame = mainbody.find('[name=covMail_bottom_compose]');
                    var composeView = self['compose'+mid];
                    if (frame[0] && composeView && composeView.isDataChanged()) {
                        mainbody.find('div[name=covMail_mainbody_content], div.covv-i-w, #bottombar-cur-pos').remove();
                    } else {
                        mainbody.remove();
                    }
                }
            }

            // 修改未读和星标数量
            var unReadedCount = 0;
            var starCount = 0;
            var sessionMails = self.model.get('dataSource') && self.model.get('dataSource').sessionMails || [];
            $.each(sessionMails,function(i,val){
                if(val.flags){
                    if(val.flags.read === 1){
                        unReadedCount++; 
                    }
                    if(val.flags.starFlag){
                        starCount++;
                    }
                }
            });

            var total = self.model.get('total');
            total -= len;
            var composeiframes = self.$el.find('[name=covMail_bottom_compose]:visible');
            // 邮件全部删除且不存在写信frame关闭标签
            if (total == 0 && composeiframes.length == 0){
                $App.close();
            // 更新邮件数量
            } else {
                self.model.set({
                    total: total,
                    unReadedCount: unReadedCount,
                    starCount:starCount
                });
            }
        });

        $App.off('moveCovMails');
        $App.on('moveCovMails', function(args) {

            var sessionData = self.model.get("sessionData") || {};
            // var sessionMails = self.model.get('dataSource') && self.model.get('dataSource').sessionMails || [];
            var fid = args.fid;//fromFolderName
            var midArr = args.mids;
            var mid;
            var mail;

            while (mid = midArr.pop()) {

                // 更新sessionData
                sessionData[mid] && (sessionData[mid].fid = fid);

                // 更新dataSource.sessionMails
                // for (var i = 0, len = sessionMails.length; i < len; i++) {
                //     mail = sessionMails[i];
                //     if (mail.mid == mid) {
                //         mail.fid = fid;
                //     }
                // }

                // 局部刷新页面
                var originDOM = self.$el.find('#covcur_'+ mid +' [name=covMailFolderName]');
                if (originDOM[0]) {
                    var folderNameHTML = self.fromFolderName(fid);
                    originDOM.replaceWith(folderNameHTML);
                }
            }
        });

        $App.off('markCovMails');
        $App.on('markCovMails', function(args) {

            var sessionData = self.model.get("sessionData") || {};
            // var sessionMails = self.model.get('dataSource') && self.model.get('dataSource').sessionMails || [];            
            var midArr = args.mids;
            var type = args.type;
            var val = args.value;
            var mid;
            var mail;

            while (mid = midArr.pop()) {

                mail = sessionData[mid] || {};
                mail.flags[type] = val;

                if (type === 'read') {
                    var mailSummaryDOM = self.$el.find('#covMail_summary_'+ mid);
                    mailSummaryDOM.find('tr:first')[val === 1 ? 'addClass' : 'removeClass']('on');

                    // 如果标记为未读，则移除之前已经存在的正文（因为读信会依赖正文是否存在做判断）
                    if (val === 1) {
                        mailSummaryDOM.show();
                        self.$el.find('#covcur_'+ mid).remove();
                    }
                } else if (type === 'starFlag') {
                    if( val === 0 ){
                        var title = "标记星标";
                        self.covCon.find("i.i_star_y[mid=" + mid + "]").removeClass("i_star_y").addClass("i_star").attr("title",title);
                        self.covCon.find("i.i_starM_y[mid=" + mid + "]").removeClass("i_starM_y").addClass("i_starM").attr("title",title);
                        // self.model.set({starCount:--count});
                    }else{
                        var title = "取消星标";
                        self.covCon.find("i.i_star[mid=" + mid + "]").addClass("i_star_y").removeClass("i_star").attr("title",title);
                        self.covCon.find("i.i_starM[mid=" + mid + "]").addClass("i_starM_y").removeClass("i_starM").attr("title",title);
                        // self.model.set({starCount:++count});
                    }
                    
                } else if (type === 'top') {
                    // 置顶在会话邮件列表没有任何标识，暂不处理
                }
            }

            // 修改未读和星标数量
            var unReadedCount = 0;
            var starCount = 0;
            var sessionMails = self.model.get('dataSource') && self.model.get('dataSource').sessionMails || [];
            $.each(sessionMails,function(i,val){
                if(val.flags){
                    if(val.flags.read === 1){
                        unReadedCount++; 
                    }
                    if(val.flags.starFlag){
                        starCount++;
                    }
                }
            });
            self.model.set({
                unReadedCount:unReadedCount,
                starCount:starCount
            });
        });

        $App.off('tagCovMails');
        $App.on('tagCovMails', function(args) {

            var sessionData = self.model.get("sessionData") || {};
            // var sessionMails = self.model.get('dataSource') && self.model.get('dataSource').sessionMails || [];
            var labelId = args.labelId;//fromFolderName
            var midArr = args.mids;
            var mid;
            var mail;
            var labelArr;

            while (mid = midArr.pop()) {

                // 更新sessionData
                mail = sessionData[mid] || {};
                labelArr = mail.label || [];

                if (labelArr.length >= 10) {
                    $Msg.alert("标签数量已经超过上限!");
                    return false;
                }

                if (labelArr && $.inArray(labelId, labelArr) == -1) {
                    labelArr.push(labelId);
                    var labelHTML = self.getMailLabels(labelArr);
                    // 如果摘要和正文都存在，DOM都要更新
                    self.$el.find('div[name=covMail_summary][data-mid='+mid+'] div.TagDiv').html(labelHTML);
                    self.$el.find('div[name=covMail_mainbody][mid='+mid+'] span.readTagdiv').html(labelHTML);
                }

                // 更新dataSource.sessionMails
                // for (var i = 0, len = sessionMails.length; i < len; i++) {
                //     mail = sessionMails[i] || {};
                //     if (mail.mid == mid) {
                //         labelArr = mail.label || [];
                //         if (labelArr && $.inArray(labelId, labelArr) == -1) {
                //             labelArr.push(labelId);
                //         }
                //     }
                // }
            }
        });
    },

    //展开第一封邮件
    expandFirstMail: function() {
        var covMaiSet = $App.getUserCustomInfo('covsetting') || '10';
        var expand = covMaiSet.slice(1, 2) == 1;
        var currMailMid = this.model.get('lastMailMid');
        if(expand && currMailMid){
            $('#covMail_summary_' + currMailMid).attr("data-first",1).trigger("click");
        }
    },

    addCheckBoxEvent: function(){
        var self = this;
        // 摘要checkbox
        this.$el.find(':checkbox[name=covMail_summary_checkbox]').live('click',function(){
            //$Event.stopEvent();
            var that = this;
            // 通过.click（）触发click事件，事件会在复选框被选中或取消选中前执行，因此要加上延时
            // setTimeout(function(){
            var status = !!$(that).attr('checked');
            BH(status ? 'cMail_checkOne' : 'cMail_uncheckOne');
            var isAllCheckBoxSameStatus = function(status) {
                var flag = true;
                self.$el.find(':checkbox[name=covMail_summary_checkbox]').each(function(i){
                    var itemStatus = !!$(this).attr('checked');
                    if ( itemStatus != status) {
                        return flag = false;
                    }
                });
                return flag;
            }(status);
            var p = $(that).closest('div[name=covMail_summary]');
            var mid = p.attr('data-mid');
            $(that).closest('div[name=covMail_summary]')[status ? 'addClass' : 'removeClass']('click-on');
            self.$el.find('#covcur_'+ mid)[status ? 'addClass' : 'removeClass']('on');
            self.$el.find('#checkAll').attr('checked', isAllCheckBoxSameStatus && status);
            // }, 100);            
        });
        // 全选checkbox
        this.$el.find('#checkAll').live('click',function() {
            var status = !!$(this).attr('checked');
            BH(status ? 'cMail_checkAll' : 'cMail_uncheckAll');
            self.$el.find(':checkbox[name=covMail_summary_checkbox]').attr('checked', status);
            self.$el.find('div[name=covMail_summary]')[status ? 'addClass' : 'removeClass']('click-on');
            self.$el.find('[name=covMail_mainbody] :checkbox').attr('checked', status);
            self.$el.find('[name=covMail_mainbody]')[status ? 'addClass' : 'removeClass']('on');
        });
        // 正文checkbox
        this.$el.find('div[name=covMail_mainbody] :checkbox').live('click', function() {
            var status = !!$(this).attr('checked');
            var isAllCheckBoxSameStatus = function(status) {
                var flag = true;
                self.$el.find(':checkbox[name=covMail_summary_checkbox]').each(function(i){
                    var itemStatus = !!$(this).attr('checked');
                    if ( itemStatus != status) {
                        return flag = false;
                    }
                });
                return flag;
            }(status);
            var mid = $(this).closest('div[name=covMail_mainbody]').attr('mid');
            $(this).closest('div[name=covMail_mainbody]')[status ? 'addClass': 'removeClass']('on');
            self.$el.find('#covMail_summary_'+ mid)[status ? 'addClass': 'removeClass']('click-on').find('[name=covMail_summary_checkbox]').attr('checked', status);
            self.$el.find('#checkAll').attr('checked', isAllCheckBoxSameStatus && status);
        });
    },

    // 返回被选中邮件的mid数组
    getCheckedMidArr: function() {
        var arr = [];
        this.$el.find(':checkbox[name=covMail_summary_checkbox]').each(function() {
            var mid = $(this).closest('div[name=covMail_summary]').attr('mid');
            mid && arr.push(mid);
        });
        return arr.length ? arr : null;
    },

    oncovTagMenuClick:function(e){
        var self = this;
        var tagItems = [];
        BH('cMail_tab_addTag');

        tagItems = tagItems.concat($App.getView('mailbox').model.getTagMenuItems());
        if(tagItems.length<4){ //变态需求，无标签时只显示新建标签，有标签时去掉新建和管理
            tagItems.pop();tagItems.shift();
        }else{
            tagItems.splice(tagItems.length-3);
        }
        M2012.UI.PopMenu.create({
            dockElement: e.target,
            direction: "auto",
            items: tagItems,
            onItemClick: function (item) {
                var args = item.args || {};
                args.bh && BH(args.bh);
                var curMailCon = $(e.target).closest('div[name=covMail_summary]')[0] || $(e.target).closest('div[name=covMail_mainbody]')[0];
                var $curMailCon = $(curMailCon);
                //var inCovMainbody = $curMailCon.attr('name') == 'covMail_summary' ? false : true;
                var mid = $curMailCon.attr("data-mid") || $curMailCon.attr('mid');
                if (item.command) {
                    args.command = item.command;
                    args.mids = [mid];
                    args.callback = function() {

                        $App.trigger('tagCovMails', {mids: [mid], labelId: args.labelId});

                        // var sessionData = self.model.get('sessionData') || {};
                        // var mailData = sessionData[mid];
                        // var labels = mailData && mailData.label || [];
                        // if (labels.length >= 10) {
                        //     $Msg.alert("标签数量已经超过上限!");
                        //     return false;
                        // }
                        // if ($.inArray(args.labelId, labels) == -1) {
                        //     mailData.label.push(args.labelId);
                        //     var labelsDOM = self.getMailLabels(mailData.label);
                        //     // 如果摘要和正文都存在，DOM都要更新
                        //     self.$el.find('div[name=covMail_summary][data-mid='+mid+'] div.TagDiv').html(labelsDOM);
                        //     self.$el.find('div[name=covMail_mainbody][mid='+mid+'] span.readTagdiv').html(labelsDOM);
                        // }
                    };
                    // args.inCovMainbody = true;
                    $App.trigger("mailCommand", args);
                    M139.Event.stopEvent();
                }
            }
        });
    },

    /** 定位到当前邮件 */
    scrollToCurrTab:function(mid){
        var conContainer = $('#covcur_' + mid);
        if(!conContainer[0]){return}
        var currTop = conContainer.offset().top || 0,
            fristContainer = this.getFirstContainer(),
            toTop;
        
		if($(fristContainer).offset()){
            toTop = currTop - $(fristContainer).offset().top;
            this.covCon.animate({scrollTop:toTop - 2}, this.scrollTime);
        }
    },
	
	/** 查找第1个显示的节点 */
	getFirstContainer:function(){
		var firstContainer  =  this.covCon.children("div:lt(2)");
        firstContainer = $.grep(firstContainer,function(val){
            return  $(val).css("display") !== "none";
        })[0];
		return firstContainer;
	},	
	
	/** 固定编辑器位置 */
    scrollToEditorPos:function(mid, areaHeight){
        var conContainer = $('#covcur_' + mid),
            currTop = conContainer.offset().top || 0,
            fristContainer = this.getFirstContainer(),
            toTop;
     
		if($(fristContainer).offset()){
            toTop = currTop + conContainer.height() - $(fristContainer).offset().top - areaHeight - 60;
            this.covCon.animate({scrollTop:toTop},300);
        }
    },
	

    /** 
     * 滚动条定位
     * @param {number} 滚动高度
     */
    scrollToPosition:function(height){
        var scrolltop = this.covCon.scrollTop();
        this.covCon.animate({scrollTop:scrolltop + height}, 50);
    },
    
    /** 移除当前邮件边框 */
    removeCurrentTabBorder:function(){
        this.$el.find("div.cov-cur-blue").removeClass("cov-cur-blue");
    },

    /** 删除无边框的样式 */
    removeItemBorderStyle:function(){
         this.$el.find("div[name='covMail_summary']").removeClass("cov-cur-b0");
    },

    /** 修改上一封邮件样式  */
    changePreviousStyle:function(mid){
        var previousCon = $('#covMail_summary_' + mid).prev();
        if(previousCon && previousCon.attr("mid")){
            previousCon = previousCon.prev();
        }
        previousCon.addClass("cov-cur-b0");
    },

    /** 
     * 验证安全锁 
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
        clearTimeout(self.resizeTimer);
        self.resizeTimer = setTimeout(function(){
            self.bContainer = self.$el.find('#covMailSummaryList');
            var containerH = self.body.height() - self.bContainer.offset().top - 15;// 15为外层容器的上下边距
            self.bContainer.height(containerH).css({'overflow-x':'hidden','overflow-y':'auto','position':'relative'});
        },200)

        // 保证收件人不换行
        this.sliceContactsText($(self.el).find('[id^=covcur_] #receiver_to:visible')[0]);
    },

    /** 
     * 同步文件夹
     * 逻辑同邮件列表
     */
    refreshFolder:function(mail){
        if (mail && mail.flags && mail.flags.read == 1) {
            var isStar = (mail.flags && mail.flags.starFlag) ? true : false;
            var isVip = $App.getView("mailbox").model.isVipMail(mail.from);
            $App.trigger("reduceFolderMail", { fid: mail.fid, isStar: isStar, isVip: isVip });//文件夹未读邮件减少
            if (mail.label && mail.label.length > 0) {//有标签，标签未读邮件减少
                $App.trigger("reduceTagMail", { label: mail.label });
            }
        }         
    },
    
    /** 界面渲染 */
    render:function(isRendered){
        var self = this;

        this.model.set('isRendered', !!isRendered);
        !isRendered && self.model.getDataSource(function(result,error){
            if(result){
                // 处理会话邮件数据，存储在model中方便后续调用
                self.setCovModel(result);
                // 渲染整体DOM
                html = self.getContainerDOM(result);
                $(self.el).html(html);
                // 绑定事件
                self.initEvents();
            }else{
                self.readmailview.readMailError();
                self.logger.error("readSessionMail letterInfo returndata error", "[view:readSessionMessage]", error); //日志上报
            }
        });
    },

    setCovModel: function(result) {
        var self = this;
        var sessionMails = result.sessionMails || [];   // 接口输出按降序排列
        var slen = sessionMails.length;
        var sessionData = {};                           // 保存mail数据，便于后续通过mid直接调用
        var lastMailMid = sessionMails[0].mid;          // 最新一封信mid
        var firstCurrMailMid;
        var unReadedCount = 0;
        var starCount = 0;
        var lockCount = 0;
        var importantCount = 0;
        var mids = [];
        var html;


        $.each(sessionMails,function(i,val){ 
            sessionData[val.mid] = val;
            mids.push(val.mid);
            if(val.priority === 1){
                importantCount++;
            }
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
        });
    
        try{ 
            lockCount = self.model.get("mailListData").mailNum - slen;            
        }catch(e){

        }  

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
    },

    // 截取收件人列表，保证一行显示
    sliceContactsText: function(con) {
        if (!con) return;

        con = $(con);
        con.find('strong').hide();
        var reg = /，$/;
        var strong;
        var text;
        while (!con.find('strong:visible').length || con.height() < 30 && con.find('strong:hidden').length) {
            strong = con.find('strong:hidden:first').show();
            text = strong.text();
            !reg.test(text) && strong.text(text+ '，');
        }

        if (con.height() > 30 && con.find('strong:visible').length > 1) {
            con.find('strong:visible:last').hide();
        }

        var last = con.find('strong:visible:last');
        text = last.text().replace(reg, '');
        last.text(text);
    },

    /** 
     * 关闭其他已打开标签页  
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

    /** 
     * 获取容器数据 
     * 1、有未读邮件时，不折叠；
     * 2、无未读邮件时，超过7封时折叠；
     */
    getContainerDOM:function(data){
        var self = this;
        var html = [];
        var currCoversation;
        var moreInfo; 
        var content; 
        // 会话工具栏
        var toolbar = this.getToolBarHtml();
        html.push(toolbar);
        // 会话主题
        var subject = this.getTitleHtml(data);
        html.push(subject);
        // 会话邮件列表
        var covlist = this.getCovMailListDOM();
        html.push($T.Utils.format('<div class="covv-list" id="covMailSummaryList">{0}</div>',[covlist]));

        return html.join('');
    },

    getCovMailListDOM: function() {
        var self = this;
        var sessionMails = this.model.get('dataSource') && this.model.get('dataSource').sessionMails || [];
        var hasUnreadMail = this.model.get('firstCurrMailMid') ? true : false;
        var html = [];

        var covMaiSet = $App.getUserCustomInfo('covsetting') || '10';
        var sort = covMaiSet.slice(0, 1);
        var expand = covMaiSet.slice(1, 2);
        sessionMails = sort == 1 ? sessionMails : sessionMails.reverse();
        $.each(sessionMails,function(i,val){
            val.index = i;
            val.sort = sort;
            html.push(self.getConversationItem(val));
        });
        // 因为sessionMails.reverse()之后会影响保存在dataSource里的原始数据
        // 这里要再次反转回来
        if (sort == 0) sessionMails.reverse();

        // 不包含未读邮件且大于7封时对列表进行折叠,隐藏的邮件显示为“更多邮件”
        var len = sessionMails.length;
        var spliceIndex = sort == 0 ? 1 : len - 1;
        if(!hasUnreadMail && len > 7){
            moreInfo = this.getMoreMailInfo(len);
            content = html.splice(spliceIndex, 0, moreInfo);
        }

        this.moreInfoData = sessionMails;

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
                isSessionMail:true,
                parentview: self
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

    /** 
     * 标题邮件数量 
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

    /** 
     * 获取邮件标题 
     */
    getTitleHtml:function(options){
        var self = this;
        var mails = this.model.get('dataSource').sessionMails || [];
        var sponsor = mails[mails.length - 1].from;
        var temp = this.template.covMailSubject;
        var formatobj = {
            title:$T.Utils.htmlEncode($TextUtils.getTextOverFlow(options.subject, 200, true)),
            sessionId:this.model.get("sessionId"),
            mid:options.omid,
            from: this.getCovMailContactsText({to: sponsor, tag: 'em'}),
            to: this.getSessionContactsText(),
            star: options.flag && options.flag.starFlag ? 'i_star_y' : 'i_star',
            checkboxDisplay: $App.getLayout() == 'list' ? '' : 'display: none'
        };
        return $T.Utils.format(temp,formatobj) || '';
    },

    /** 获取摘要 */
    getSummary:function(summary, isCurrTab){
        if(isCurrTab){
            return '';
        }
        return '<div class="sov-tdt"><span class="title-text">' + ( $T.Utils.htmlEncode(summary) || '&nbsp;') + '</span></div><a class="check-mail" href="javascript:;" bh="cMail_tab_readMailLink" style="display:none;">查看正文</a>';
    },

    /** 获取会话列表 */
    getConversationItem:function(options){
        var self = this;
        var hasUnreadMail = this.model.get('firstCurrMailMid') ? true : false;
        var len = this.model.get('total');
        var index = options.index;
        var sort = options.sort;
        var isHiddenItem = false;
        if (!hasUnreadMail && len > 7) {
            if (sort == 1 && (index > 3 && index < len - 1)) {
                isHiddenItem = true;
            }
            if (sort == 0 && (index > 0 && index < len - 4)) {
                isHiddenItem = true;
            }
        }

        if(options && options.from && options.sendDate){
            var temp = this.template.covMailSummary;
            var html = $T.Utils.format(temp,{
                    mid:options.mid,
                    tabAttr:'',
                    statusTr:self.getStatusTrClass(options),
                    status:self.getStatus(options),
                    title:$T.Utils.htmlEncode($Email.getEmail(options.from)),
                    email:$T.Utils.htmlEncode(options.from),
					name:$T.Utils.htmlEncode(self.getMailName(options.from)),
                    summary:self.getSummary(options.summary), //已经encode
                    attachIco:self.getAttachIco(options),
                    starIco:self.getStarIco(options),
                    time:self.getMailDate(options.sendDate), //$Date.format("yyyy-MM-dd hh:mm:ss",new Date(options.sendDate * 1000))
                    vipicon: $App.getView("mailbox").model.isVipMail(options.from) ? 'user_vip' : '',
                    labels: self.getMailLabels(options.label),
                    remindhtml: self.getRemindHtml(options, true),
                    display: isHiddenItem ? 'display: none' : '',
                    checkboxDisplay: $App.getLayout() == 'list' ? '' : 'display: none',
                    nameStyle: self.getNameStyle(options.from)
                });
            return html;
        }
        return '';       
    },

    getNameStyle: function(name) {
        if (!$B.is.ie || $B.getVersion() > 7) return '';
        name = this.getMailName(name);
        return $TextUtils.getTextOverFlow2(name,16) == name ? 'style="width:auto;"' : '';
    },

    getRemindHtml: function(dataSource, inCovMaiSummary){
        var temp = '<a href="javascript:;" class="{aclass}" name="mailtask"><span mid="{mid}" status="{status}" taskdate="{taskdate}" from="{from}" senddate="{senddate}" subject="{subject}"></span></a>';
        
        // 会话列表和读信接口返回taskFlag/taskDate数据结构不同
        if (inCovMaiSummary) {
            var taskFlag = dataSource.flags && dataSource.flags.taskFlag || 0;
        } else {
            var taskFlag = dataSource.flag && dataSource.flag.taskFlag || 0;
        }
        // 读信页的taskDate存储在dataSource.headers中
        // 列表页存储在dataSource
        var taskDate = dataSource.headers && dataSource.headers.taskDate || dataSource.taskDate || 0;
        var status = ['add','update','finish'][taskFlag]; //任务状态
        var map = { //样式
            'add':'i_tx_n',
            'update':'i_tx_nb',
            'finish':'i_tx_ng'
        };
        var data = {
            aclass: map[status],
            mid: dataSource.mid||dataSource.omid,
            status: status,
            taskdate: taskDate,
            from: $T.Html.encode(dataSource.from||dataSource.account),
            senddate: dataSource.sendDate,
            subject: $T.Html.encode(dataSource.subject)
        };
        return $T.Utils.format(temp,data);
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

    /** 
     * 获取邮件姓名
     * 是本人显示‘我’，其他根据通讯录优先级规则显示 
     */
    getMailName:function(account){
        var name = '',
            self = this;
        if(!this.getNameCache){
            this.getNameCache = {};
        }
        if(this.getNameCache && this.getNameCache[account]){
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
        if(this.getNameCache){
            this.getNameCache[account] = name;
        }
        return name;
    },

    /** 获取更多邮件 */
    getMoreMailInfo:function(len){
        var temp = this.template.covMailSummaryOmissioned;
        return len > 7 ? $T.Utils.format(temp,[len-5]) : '';
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
        if ($B.is.ie && $B.getVersion() < 9) {
            this.$el.find('div[name=covMail_summary]').show();
        } else {
            this.$el.find('div[name=covMail_summary]').slideDown('slow');
        }
        
        this.$el.find('#covmore').remove();
        BH('cov_showmoremail');
    },

    /** 
     * 获取当前邮件信息 
     * @param {Object} options 邮件数据
     * @param {Bollean} isCurrTab 是否当前邮件
     */
    getCurrTabInfo:function(options, isCurrTab){

        var self = this;
        var temp = this.template.covMailMainbody;
        
        //为了重用函数，做参数兼容处理
        if(isCurrTab){
            options.summary = '';
            options.from = options.account;
            options.mid = options.omid;
            options.flags = options.flag;
        }

        var formatobj = {
            contentInfo:self.getContentInfo(options),
            mid:options.mid,
            checkboxDisplay: $App.getLayout() == 'list' ? '' : 'display: none'
        };
        var html = $T.Utils.format(temp,formatobj) || '';

        return {
            html:html,
            options:options
        };
    },

    /** 
     * 获取附件图标 
     * @param {Number} options.attachmentNum 
     */
    getAttachIco:function(options){
        return options.attachmentNum > 0 ?'<i class="i_atta"></i>' : '';
    },
    
    getMailDate:function(d){
        var mailDate = new Date(Number(d) * 1000),
            day = $Date.format("d", mailDate),
            yyMM = $Date.format("yyyy/M", mailDate),

            yyyyMMdd = $Date.format("yyyyMMdd", mailDate),
            today = $Date.format("yyyyMMdd",new Date);
        
        if(yyyyMMdd == today){
            return '<span class="covv-time">' + $Date.format("hh:mm", mailDate) + '</span>';
        }else{
            return ['<div class="covv-date">',
                          '<p class=""><span class="num">'+ day +'</span><span>日</span></p>',
                          '<p class="year"><span>'+ yyMM +'</span></p>',
                    '</div>'].join("");
        }
    },

    /** 
     * 获取星标图标 
     * @param {Object} flag  读取options.flags.starFlag
     */
    getStarIco:function(options, inCovMainbody){
        
        var temp = '<i class="{starclass}" style="cursor:pointer" mid="{mid}" name="conversation_star" data-val="{val}" title="{title}"></i>';
        if (inCovMainbody) {
            var starVal = options.flag && options.flag.starFlag;
        } else {
            var starVal = options.flags && options.flags.starFlag;
        }
        
        
        if(starVal == 1){
            var starClass = inCovMainbody ? 'i_starM_y' : 'i_star_y';
        } else {
            var starClass = inCovMainbody ? 'i_starM' : 'i_star';
        }

        return $T.Utils.format(temp,{
            mid:options.mid || options.omid,
            starclass: starClass,
            val: starVal || 0,
            title: starVal == 1 ? '取消星标':'标记星标'
        });
    },

    /** 
     * 标记星标 
     * @param {Object} 事件
     */
    onStarClick:function(e){
        var self = this,
            $target = $(e.target || e.srcElement),
            mid = $target.attr("mid"),
            name = $target.attr("name"),
            isTitleFlag = name === "title_star" ? true : false,
            isSummaryStar = $target.closest('div[name=covMail_summary]')[0] ? true : false;// 根据父元素区分星标所在位置
            value = $target.hasClass(isTitleFlag || isSummaryStar ? "i_star_y" : "i_starM_y") ? 0 : 1,
            count = self.model.get('starCount'),
            options = {
                type:'starFlag',
                value:value
            };

        var midArr = isTitleFlag ? self.model.get('mids').concat() : [mid];    // 此处之所以用concat()是为了返回一个副本作为参数，防止后续对这个数组的操作影响model中数据的准确性
        var thisCallBack = function() {
            $App.trigger('markCovMails', {mids: midArr, type: 'starFlag', value: value});
            M139.UI.TipMessage.show("邮件标记成功",{ delay:2000});
            BH(isTitleFlag ? 'cov_markallstar' : 'cov_markstar');
        };

            /*if(isTitleFlag){
                options.sessionIds = [this.model.get('sessionId')];
                //starCon = self.$el.find("i[name='conversation_star']");
                var thisCallBack = function(){
                    self.allStarChange({
                        $target:$target,
                        value:value
                    });

                    M139.UI.TipMessage.show("邮件标记成功",{ delay:2000});
                };      
                BH('cov_markallstar');      
            }else{ //需要区分是点击子标题还是内容
                options.mids = [mid];
                var thisCallBack = function(){
                    if( value === 0 ){
                        var title = "标记星标";
                        self.covCon.find("i.i_star_y[mid=" + mid + "]").removeClass("i_star_y").addClass("i_star").attr("title",title);
                        self.covCon.find("i.i_starM_y[mid=" + mid + "]").removeClass("i_starM_y").addClass("i_starM").attr("title",title);
                        self.model.set({starCount:--count});
                    }else{
                        var title = "取消星标";
                        self.covCon.find("i.i_star[mid=" + mid + "]").addClass("i_star_y").removeClass("i_star").attr("title",title);
                        self.covCon.find("i.i_starM[mid=" + mid + "]").addClass("i_starM_y").removeClass("i_starM").attr("title",title);
                        self.model.set({starCount:++count});
                    }
                    M139.UI.TipMessage.show("邮件标记成功",{ delay:2000});
                }; 
                BH('cov_markstar');
            }*/

            if (isTitleFlag) {
                options.sessionIds = [this.model.get('sessionId')];
            } else {
                options.mids = [mid];
            }
            $App.trigger('changeCovStar',{ options:options,callback:thisCallBack});
    },

    /** 
     * 星标批量修改 
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
            this.$el.find("div[name=covMail_summary] i[name='conversation_star']").removeClass("i_star_y").addClass("i_star");
            this.$el.find("div[name=covMail_mainbody] i[name='conversation_star']").removeClass("i_starM_y").addClass("i_starM");
            title = "全部标记星标";
            tit = "标记星标";
            count = 0;
        }else{
            $target.removeClass("i_star").addClass("i_star_y");
            this.$el.find("div[name=covMail_summary] i[name='conversation_star']").removeClass("i_star").addClass("i_star_y");
            this.$el.find("div[name=covMail_mainbody] i[name='conversation_star']").removeClass("i_starM").addClass("i_starM_y");
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
			name,
            title,
            email,
			info = [];
        
        //获取名称，发件人名称最多显示20个字符，超过则截取，截取后最后一个字符用半省略后代替
        $.each(accounts,function(i,val){
			name = $T.Utils.htmlEncode(self.getMailName(val));
            title = $T.Utils.htmlEncode($Email.getEmail(val));
            email = $T.Utils.htmlEncode(val);
			info.push('<a class="inber-name" title=\"' + title + '\" email=\"' + email + '\" >' + name + '</a>');
        })

        var formatobj = {
            mid:options.mid,
            namelist:info.join(", ")  //英文逗号加空格
        };

        return $T.Utils.format(temp,formatobj);
    },

    // 参与人为剔除了最旧一封外的其他所有发件人
    getSessionContactsText: function() {
        var mails = this.model.get('dataSource').sessionMails || [];
        var len = mails.length;
        var oldest = mails[len - 1];
        var contacts = [];
        for (var i = len; len--;) {
            var mail = mails[len];
            var from = mail && mail.from && mail.from;
            contacts.push(from);
        }

        contacts = contacts.join(',').split(/,|;/);
        // 排除最老一封邮件的发件人（即发起人）
        contacts.shift();

        var exsitedObj = {};
        var uniqueArr = [];
        for (var i = contacts.length; i--;) {
            var contact = contacts[i];
            var name = $Email.getAccount(contact);
            if (name != '' && !exsitedObj[name]) {
                exsitedObj[name] = true;
                uniqueArr.push(contact);
            }
        }

        uniqueArr.reverse();

        return this.getCovMailContactsText({to: uniqueArr});
    },

    getCovMailContactsText: function(options) { 
        var self = this;
        var accounts = [];
        if (options) {            
            options.to && accounts.push(options.to);
            options.cc && accounts.push(options.cc);
            options.bcc && accounts.push(options.bcc);
        }
        accounts = accounts.join(',').split(",");
        var info = [];
        var len = accounts.length;
        $.each(accounts,function(i,val){
            var name = $T.Utils.htmlEncode(self.getMailName(val));
            var title = $T.Utils.htmlEncode($Email.getEmail(val));
            var email = $T.Utils.htmlEncode(val);
            var tagName = options && options.tag || 'strong';
            var className = tagName != 'strong' ? ' class="send-name" style="cursor: pointer;"' : '';
            var frag = '<'+ tagName + className +' title=\"' + title + '\" email=\"' + email + '\">' + name;
            info.push(i < len - 1 ? frag + '，</'+tagName+'>' : frag + '</'+tagName+'>');
        });

        return info.join("");
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

            /*M139.Dom.bindAutoHide({
                action: "click",
                element: $('#conversationDialog')
            });*/

            BH('cov_showmorecontacts');
        }
    },

    /** 
     * 获取所有邮件帐号 
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
            changePcon = $('#covMail_summary_' + mid + ", #covcur_" + mid);
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
	
	/**
	 * 联系人页卡绑定
	 */
	onContactsNameClick:function(e){
        $Event.stopEvent(e);
		var self = this,
			target = e.target || e.srcElement,
			email = target.getAttribute("email");
        
		if(email){
			M2012.UI.Widget.ContactsCard.show({
				dockElement:$(target),
				email:email
			});
		}
		BH('cov_contactclick');
	},

    /** 
     * 展开时标记为已读状态 
     * el为折叠的标题
     */
    markHasReaded:function(el, mid){
        //var unReadIcon = el.find("i.i_m_n"),
        var unReadedCount = this.model.get('unReadedCount');
        
        /*if(unReadIcon[0]){
            unReadIcon.addClass("i_m_o").removeClass("i_m_n").attr("title","已读"); //标题
            $('#covcur_' + mid).find("i[name=itemStatus]").addClass("i_m_o").removeClass("i_m_n").attr("title","已读");*/
        el.find("tr").removeClass("on");
        $('#covcur_' + mid).find("tr").removeClass("on");
        unReadedCount > 0 && unReadedCount--;
        this.model.set({unReadedCount:unReadedCount});
        // }

    },

    /** 获取正文信息 */
    getContentInfo:function(options){
        return this.readmailcontentview.getMailContentIframe(options.mid,true,'cov');
    },         

    /** 渲染邮件卡片头 */
    renderMailCardHeader:function(options){
        var self = this;
        var mid = options.omid;
        var thisEl = $('#covcur_' + mid);
        var len = thisEl.find("div.cov-inber").length;
		if( len > 0 ){ return } //防止局部刷新
        // 填充头部信息
        var headerDOM = this.getMailHeaderDOM(options);//this.template.mailHeader
        thisEl.find('#mainbodyHeader').html(headerDOM); //渲染DOM
        appView.getView("remind").addEvent(thisEl);             //绑定代办事件
        // 生成附件列表
        var attachsInfo = this.getAttachsInfo(options);
        if (attachsInfo) {
            thisEl.find('#attachs').append(attachsInfo);
        }
        // 移除“加载中”，显示正文
        thisEl.find("div[name=loading]").remove();
        thisEl.find('div[name=checkboxDiv]').show();
        thisEl.find('div[name=covMail_mainbody_content]').slideDown('normal');

        //附件事件绑定
        this.readmailview.filepreview.isSessionMail = true;
        this.readmailview.filepreview.el = thisEl.find('div.covv-accessory')[0];
        this.readmailview.filepreview.initEvents(options,mid);

        //底部工具栏
        if(!top.M139.PageApplication.getTopApp().sessionCompose){
            top.M139.PageApplication.getTopApp().sessionCompose = {};
        }

        var options = {
            el:thisEl.find('div[name=covMail_bottom]')[0],
            parentview:self,
            mid:mid,
            data:self.model.get('dataSource')
        };

        top.M139.PageApplication.getTopApp().sessionCompose[mid] = options;       
        this.bottomview = new M2012.ReadMail.ConversationBottomBar.View(options);
        this.bottomview.initEvents();
        
        //标记这封邮件单元加载完毕
        $('#covMail_summary_' + mid).attr("data-read",1);
        this.onResize();
        M139.UI.TipMessage.hide();

    },

    fromFolderName: function(fid) {

        var curFid = this.model.get('currFid');
        
        if (fid && curFid != fid) {
            var folder =  $App.getFolderById(fid);
            if (folder && folder.name) {
                return '<span class="filesource" name="covMailFolderName">(来自 '+ folder.name +')</span>'
            }          
        }
        return '<span class="filesource" name="covMailFolderName"></span>';
    },

    // 获取单封邮件的头部信息（在读信接口返回数据后渲染）
    getMailHeaderDOM: function(options) {
        var self = this;
        var temp = this.template.mainbodyHeader;  
        var mails = self.model.get('sessionData') || {};
        var fid = mails[options.omid] && mails[options.omid].fid || null;
        var html = $T.Utils.format(temp, {
                        from: this.getCovMailContactsText({to: options.account, tag: 'h2'}),
                        attachIco:options.attachments.length ?'<i class="i_atta" title="带附件"></i>' : '',
                        vipicon: $App.getView("mailbox").model.isVipMail(options.account) ? '<span class="user_vip"></span>' : '',
                        labels: self.getMailLabels(options.label),
                        yyyyMMdd: $Date.format("yyyy-MM-dd",new Date(options.sendDate * 1000)),
                        hhmmss: $Date.format("hh:mm:ss",new Date(options.sendDate * 1000)),
                        to: this.getCovMailContactsText(options),
                        mid:options.omid,
                        remindhtml: self.getRemindHtml(options),
                        foldername: self.fromFolderName(fid),
                        starIco: self.getStarIco(options, true)
                    });
        return html;
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
                            var loadContainer = self.$el.find("div[name=covMail_summary][data-read='0']:eq(0)");
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
        //this.removeCurrentTabBorder();
        this.removeItemBorderStyle();
        this.covCon.find("div[name='covMail_summary']").addClass('hide');
        this.covCon.find("div[name=covMail_mainbody]").removeClass('hide');
        //this.covCon.find("div.cov-cur:eq(0)").addClass("cov-cur-blue"); //第一封邮件标记
        if( this.model.get('unReadedCount') > 0){
            this.titleIcoCon.trigger("click");
        }
        this.covCon.animate({scrollTop:0}, this.scrollTime);
    },

    /** 全部收起样式 */
    hideAllMailCardChangeStyle:function(){
        //this.removeCurrentTabBorder();
        this.removeItemBorderStyle();
        this.covCon.find("div[name='covMail_summary']").removeClass('hide');
        this.covCon.find("div[name=covMail_mainbody]").addClass('hide');
        this.covCon.animate({scrollTop:0}, this.scrollTime);
    },

    /** 判断是否全部展开 */
    checkIsAllMailCardShow:function(){
        var hideTitleCon = this.covCon.find("div.hide[name='covMail_summary']"),
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
    },

    // 获取当前会话下选择的邮件
    getCheckedMidArr:function() {
        var arr = [];
        var $checkboxs = this.$el.find('#covMailSummaryList :checkbox:checked');
        $checkboxs.each(function() {
            var mid = $(this).closest('div[name=covMail_summary]').attr('data-mid');
            if(mid) arr.push(mid);            
        });
        return arr.length ? arr : null;
    },

    // 根据底部工具条的top值来控制底部收起按钮的样式
    collapseBtnCSSControl: function() {
        var curMainbody = this.$el.find('[name=covMail_mainbody_content]:visible:first').parent();
        if (!curMainbody.length) return;

        var btn1 = curMainbody.find('[name=go_top]:first');
        var btn2 = curMainbody.find('[name=go_top]:last');
        var left = btn1.offset().left;
        var top = btn1.offset().top;
        var documentH = $D.getWinHeight();
        var bottomBarH = curMainbody.find('[name=covMail_bottom]').offset().top;
        var btnH = btn2.height();
        var FLOAT_H = 50;
        if (bottomBarH > documentH - FLOAT_H && top < documentH - FLOAT_H - 3*btnH) {
            btn2.addClass('go-fixed');
            btn2.css({'bottom': FLOAT_H, 'left': left});
        } else {
            btn2.removeClass('go-fixed');
            btn2.css({'bottom': '', 'left': ''});
        }
    },

    hasUnsavedComposeframe: function() {
        var frames = this.$el.find('[name=covMail_bottom_compose]:visible');
        var frame;
        frames = [].slice.call(frames);
        while(frame = frames.pop()) {
            var mid = $(frame).find('iframe').attr('id').split('_')[1];
            var composeView = this['compose'+ mid];//.isDataChanged()
            if (composeView && composeView.isDataChanged()) {
                return true;
            }
        }
        return false;
    }
}));    
    
})(jQuery, _, M139);