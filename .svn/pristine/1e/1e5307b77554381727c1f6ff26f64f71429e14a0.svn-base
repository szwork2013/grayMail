
/**
* @fileOverview 标签菜单
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;

    /**
    * @namespace 
    * 标签菜单
    */

    M139.namespace('M2012.TabMenu.View', superClass.extend({

        /**
        *@lends M2012.TabMenu.View.prototype
        */		
		
		events:{
			"click #orignTabsManage": "onOrignTabsManage" //管理标签		
		},
		
        template: {
			
			menu:[ '<div id="tabsMenuList" class="tab-menu shadow" style="position:absolute;left:{left}px;top:{top}px;background:white;z-index:999">',
				'<ul class="tab-top">',
					'<li id="closeAllTabs" onClick="appView.closeAllTab()">',
						'<a href="javascript:;"> <i class="i-tab i-tab-c"></i>',
							'<span class="title">关闭所有标签</span>',
						'</a>',
					'</li>',
				'</ul>',
				'<div id="otherTabsMenu" class="sweb tab-ullist" style="display:none">',
					'<ul class="tab-list">',
					'</ul>',
				'</div>',
			'</div>'].join(""),
			
			item:['<li tabid="{tabid}" class="{css}" data-curr="{flag}" bh="tab_menulist_other">',
						'<span class="tab-text" title="{title}">{name}</span>',
						'<span class="i-tab i-tab-x" name="close" style="{display}" title="关闭"></span>',
				  '</li>'].join(''),
				  
			nothing: ''
        },

        initialize: function () {
            var self = this;
			this.model = appView.getView("tabpage").model;
			this.isChinaMobileUser = $User.isChinaMobileUser();
			this.initEvents();			
			return superClass.prototype.initialize.apply(this, arguments);
        },

		/** 定义Dom节点 */
		initContainer:function(){
			this.mainTab = this.mainTab || $('#divTab'); //标签容器
			this.tabsMenuList = this.tabsMenuList || $('#tabsMenuList'); //下拉菜单
			this.fixedTabsUl = this.fixedTabsUl || $('#fixedTabsUl'); //固定标签区域
			this.otherTabsMenu = this.otherTabsMenu || $('#otherTabsMenu'); //非固定标签区域
		},		
		
		/** 标签管理 */
		onOrignTabsManage:function(){
			M139.UI.TipMessage.show("数据加载中...");
			
			setTimeout(function(){
				if(M2012.TabManage){
					new M2012.TabManage.View().render();
					M139.UI.TipMessage.hide();
				}else{
					M139.core.utilCreateScriptTag({
						id: 'tabsmanagescript', 
						src: '/m2012/js/richmail/main/tabmanage.view.js', 
						charset: "utf-8"
					},function(){
						M139.UI.TipMessage.hide();
					})					
				}
			},500)
		},		
		
		/** 点击下拉菜单按钮 */
		onShowMenuClick:function(){	
			var self = this;
			var html = this.template.menu;
			this.container = $('#tabsMenuIco');
			var left = this.container.offset().left - 112;
			var top = this.container.offset().top + 31;
			html = $T.Utils.format(html,{
				left:left,
				top:top
			});
			
			if(!$('#tabsMenuList')[0]){
				$('body').append(html);
				this.setElement('#tabsMenuList');
				this.initContainer();
				this.onFixedTabsEvent();
				this.hoverTabsEvent();
			}else{
				this.$el.css({'left':left + 'px','top':top + 'px','display':''});
			}
			
			/*if(this.mainTab.find("li[tabid]:visible").length === 1){ //一个页签时比较特殊，要调整位置
				this.$el.css({'left':(left + 138) + 'px'});
			}*/
			
			this.showOtherTabsList();
			this.initFixCurrTab();
			
			BH('tab_menulist');
		},
		
		/** 当前固定标签 */
		initFixCurrTab:function(){
			var flag = true;
			var currTab = $App.getCurrentTab();
			var tabName = currTab.name;
			this.fixedTabsUl.find("li").removeClass('sel').removeAttr("data-curr");
			if(tabName === 'myCloudSubscribe'){ //云邮局统一
				tabName = 'googSubscription';
			}
			if(tabName === 'mailbox_1' && currTab.title !== '收件箱'){
				flag = false;
			}
			if(/calendar|addr|welcome|googSubscription|mailbox_1/i.test(tabName)){
				flag && this.fixedTabsUl.find("li[rel="+tabName+"]").addClass('sel').attr("data-curr",'1');
			}
		},		
		
		/** 其他非固定标签显示 */
		showOtherTabsList:function(){
			//var alltabs = appView.getView("tabpage").model.pages; //obj 顺序不对
			var self = this;
			var alltabs = [];
			var tabName = '';
			var tabTitle = '';
			//从节点里获取所有标签页
			this.mainTab.find('li:visible').each(function(i,val){
				tabName = $(this).attr('tabid') || '';
				tabTitle = $(this).attr('title') || '';
				if(/mailbox_/.test(tabName) && !self.isChinaMobileUser){ //非移动号不关闭邮件列表
					tabName = null; 
				}
				tabName && tabTitle && alltabs.push({
					name:tabName,
					title:tabTitle
				});
			});			
			var item = this.template.item;
			var fixedtabs = this.model.getFixedTabsData();
			var htmlstr = [];
			var closeTabsLen = 0;
			var str = '';
			var fixedRegs = /calendar/i; //日历
			fixedtabs = fixedtabs.concat(this.model.getInitTabsData());
			
			$.each(alltabs,function(i,val){	
				
				if( $.inArray(val.name, fixedtabs) == -1 && !fixedRegs.test(val.name)){
					closeTabsLen++;
					var isCurrTab = $App.getCurrentTab().name === val.name;
					str = $T.Utils.format(item,{
						tabid:val.name,
						css: isCurrTab ? 'sel' : '',
						title:$T.Utils.htmlEncode(val.title),
						flag: isCurrTab ? '1' : '',
						name:$T.Utils.htmlEncode(val.title),
						display: isCurrTab ? '' : 'display: none;'
					}); //防xss

					htmlstr.push(str);
				}
			});
			htmlstr = htmlstr.join('');
			
			var thisCon = this.otherTabsMenu;
			if(htmlstr){
				if(closeTabsLen > 7 ){
					thisCon.addClass("tab-ullist-h"); //滚动条
				}else{
					thisCon.removeClass("tab-ullist-h");				
				}
				thisCon.find('ul').html(htmlstr);
				thisCon.show();
				this.onOtherTabsEvent();
			}else{
				thisCon.find('ul').html('');
				thisCon.hide();
			}
			
			this.hoverTabsEvent(thisCon);
		},

		/** 鼠标hover事件 */
		hoverTabsEvent:function(container){
			var container = container || this.tabsMenuList;
			container.find("li").hover(function(){
				$(this).addClass('sel');
				$(this).find('.i-tab-x').show();
			},function(){
				if (!$(this).attr("data-curr")) {
					$(this).removeClass('sel');
					$(this).find('.i-tab-x').hide();
				}
			});
		},
		
		/** 固定标签绑定 */
		onFixedTabsEvent:function(){
			
			this.fixedTabsUl.delegate('li','click',function(){
				var key = $(this).attr('rel');
				var clickTab = $App.getTabByName(key);
				
				if(!key){return}
				if(clickTab){ //已打开标签
					if(clickTab.group === 'mailbox' && clickTab.title !== '收件箱'){
						$App.showMailbox(1);
						return;
					}
					$App.getView("tabpage").activeTab(key); //切换
				}else{ //未打开标签
					if(key === 'mailbox_1'){
						$App.showMailbox(1);
					}else{
						$App.show(key);					
					}
				}
			});
			
		},
		
		/** 非固定标签绑定 */
		onOtherTabsEvent:function(){		
			this.otherTabsMenu.find('li').bind('click',function(e){
				var tabid = $(this).attr('tabid'),
					jTarget = $(e.target);
					
				if(jTarget.attr('name') === 'close'){ //关闭
					$App.close(tabid);
				}
				
				$App.getView("tabpage").activeTab(tabid); //切换
			});
		},
		
		initEvents:function(){
			var self = this;
			
			//下拉按钮点击
			$('#divTab').delegate('#tabsMenuIco','click',function(){     
				self.onShowMenuClick();
			});
			//点击云邮局
			$('#divTab').delegate('li[tabid="googSubscription"]','click',function(){     
				top.BH("clickYUNmail");
			});
			//全局点击判断			
			top.$GlobalEvent.on("click", function (e) {
				var event = e.event;
				var element= (event.srcElement || event.target);
				if($(element).attr('id') === 'tabsMenuIco' || $(element).attr('class') === 'closeAll'){
				}else{
					self.tabsMenuList.hide();
				}
			});
			
		}

    }));


})(jQuery, _, M139);