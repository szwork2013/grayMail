
/**
* @fileOverview 标签管理
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;

    /**
    * @namespace 
    * 标签管理
    */

    M139.namespace('M2012.TabManage.View', superClass.extend({

        /**
        *@lends M2012.TabManage.View.prototype
        */
		
		events:{
		    "click input": "changeSetting"
				},
		
		template: {

		    entryTab: _.template(['<div class="dropDownA" href="javascript:void(0)"><i class="i_triangle_d"></i></div>',
                        '<div class="dropDownText"><%= entrytab %></div>'].join("")),
			
            box: ['<div class="defaultLabelBox"><span class="labelTxt fz_12 fw_b">登录后默认进入的标莶：</span>',
                    '<div id="entryTabArea" class="dropDown p_relative">',
                        
                    '</div>',
                '</div>',
                '<div class="p_relative">',
                    '<p class="boxIframeText_label">可将以下页面设置为固定标莶：</p>',
 					'<ul class="diytabset clearfix">',
						'<li class="gray">',
 							'<input type="checkbox" checked="checked" value="welcome" disabled="disabled">',
 							'<label >欢迎页(默认)</label>',
 						'</li>',
 						'<li>',
 							'<input type="checkbox" id="tab_input_addr" value="addr" {addr} >',
 							'<label for="tab_input_addr">通讯录</label>',
 						'</li>',
 						'<li>',
 							'<input type="checkbox" id="tab_input_calendar" value="calendar" {calendar} >',
 							'<label for="tab_input_calendar">日历</label>',
 						'</li>',
 						'<li>',
 							'<input type="checkbox" id="tab_input_googSubscription" value="googSubscription" {googSubscription} >',
 							'<label for="tab_input_googSubscription">云邮局</label>',
 						'</li>',
 						//'<li>',
 							//'<input type="checkbox" id="tab_input_attachlist" value="attachlist" {attachlist}>',
 							//'<label for="tab_input_attachlist">附件夹</label>',
 						//'</li>',
 						'<li>',
 							'<input type="checkbox" id="tab_input_mms" value="mms" {mms} >',
 							'<label for="tab_input_mms">发彩信</label>',
 						'</li>',
 						'<li>',
 							'<input type="checkbox" id="tab_input_greetingcard" value="greetingcard" {greetingcard}>',
 							'<label for="tab_input_greetingcard">贺卡</label>',
 						'</li>',
 						'<li>',
 							'<input type="checkbox" id="tab_input_postcard" value="postcard" {postcard}>',
 							'<label for="tab_input_postcard">明信片</label>',
 						'</li>',
 						'<li>',
 							'<input type="checkbox" id="tab_input_mailbox_1" value="mailbox_1" {mailbox_1} >',
 							'<label for="tab_input_mailbox_1">收件箱</label>',
 						'</li>',
 					'</ul>',
					'<p class="bibtextp">最多可添加{maxTab}项为固定标签，添加满时，需要取消一项再添加另一项</p>',
					'<input type="hidden" id="mOldTabs" value="{oldTabs}" />',
				'</div>'].join(""),
				
            internetUserBox: ['<div class="defaultLabelBox"><span class="labelTxt fz_12 fw_b">登录后默认进入的标莶：</span>',
                                    '<div id="entryTabArea" class="dropDown p_relative">',

                                    '</div>',
                                '</div>',
                '<div class="p_relative">',
                    '<p class="boxIframeText_label">可将以下页面设置为固定标莶：</p>',
 					'<ul class="diytabset clearfix">',
						'<li class="gray">',
 							'<input type="checkbox" checked="checked" value="mailbox_1" disabled="disabled">',
 							'<label >收件箱(默认)</label>',
 						'</li>',
 						'<li>',
 							'<input type="checkbox" id="tab_input_addr" value="addr" {addr} >',
 							'<label for="tab_input_addr">通讯录</label>',
 						'</li>',
 						'<li>',
 							'<input type="checkbox" id="tab_input_googSubscription" value="googSubscription" {googSubscription} >',
 							'<label for="tab_input_googSubscription">云邮局</label>',
 						'</li>',
 						//'<li>',
 						//	'<input type="checkbox" id="tab_input_attachlist" value="attachlist" {attachlist}>',
 						//	'<label for="tab_input_attachlist">附件夹</label>',
 						//'</li>',
 						'<li>',
 							'<input type="checkbox" id="tab_input_greetingcard" value="greetingcard" {greetingcard}>',
 							'<label for="tab_input_greetingcard">贺卡</label>',
 						'</li>',						
 						'<li>',
 							'<input type="checkbox" id="tab_input_postcard" value="postcard" {postcard}>',
 							'<label for="tab_input_postcard">明信片</label>',
 						'</li>',
 					'</ul>',
					'<p class="bibtextp">最多可添加{maxTab}项为固定标签，添加满时，需要取消一项再添加另一项</p>',
					'<input type="hidden" id="mOldTabs" value="{oldTabs}" />',
				'</div>'].join(""),
			
			nothing: ''
		},

        /** 登陆后默认进入的页签*/
		defaultEntryTab: '',

        /**选中的页签对象数组，用于生成默认页签下拉*/
		selectedFixedTabs: [{
		    text: '欢迎页',
		    value: 'welcome',
		    myData: 0
		}],

		fixTabObj: {
		    'welcome': '欢迎页',
		    'addr': '通讯录',
		    'calendar': '日历',
		    'googSubscription': '云邮局',
		    'mms': '发彩信',
		    'greetingcard': '贺卡',
		    'postcard': '明信片',
		    'mailbox_1': '收件箱'
		},

        initialize: function () {
            var self = this;
            this.model = new TabPageModel();
			this.maxLen = this.model.get('maxTab');
			this.tagPageView = appView.getView("tabpage");
			this.isChinaMobileUser = $User.isChinaMobileUser() ? true : false;
            return superClass.prototype.initialize.apply(this, arguments);
        },
		
		getInitTabsObj: function(){  //移动用户
			return {
					"addr": '', 
					"calendar": '',
					"googSubscription": '',
					"mailbox_1": '', 
					"mms": '', 
					"greetingcard": '', 
					"postcard": ''
			}
		},
		
		getInitInternetUserTabsObj:function(){ //互联网用户
			return {
				"addr": '', 
				"googSubscription": '',
				"greetingcard": '',
				"postcard":''
			}
		},
		
		/** 复选框选择判断 */
		changeSetting: function () {
		    var self = this;
		    var checkeds = this.$el.find('input:checked');
		    var len = checkeds.length;
		    var tipsContainer = this.$el.find('p.bibtextp');
		    var isDefaultEntryTagCanceled = true;
			if(len > this.maxLen){
				tipsContainer.addClass('red');
			}else{
				tipsContainer.removeClass('red');
			}

		    // 同步更改默认页签下拉选项
			this.selectedFixedTabs = [];
			checkeds.each(function (i, k) {
			    
			    if ($(this).val() == self.defaultEntryTab) { isDefaultEntryTagCanceled = false; }
			    self.selectedFixedTabs.push({
			        text: self.fixTabObj[$(this).val()],
			        value: $(this).val(),
			        myData: i
			    })
			});
		    // 如果默认选项被勾掉，同步更改默认标签
			if (isDefaultEntryTagCanceled) {
			    this.defaultEntryTab = 'welcome';
			    this.$el.find('#entryTabArea').html(this.template.entryTab({ entrytab: self.fixTabObj[self.defaultEntryTab] }));
			}
		},
		
		/** 输出固定页签*/
		showFixedTabs:function(options){
			var self = this;
			var frameView = new FrameView({ parent: self.tagPageView });
			options && options[0] && self.tagPageView.createOrignTabs(options, frameView, true);
		},
		
		
		/** 关闭所有固定标签，避免顺序错乱 
		* 设置的固定标签 + 已选择的固定标签
		*/
		closeAllOrignTabs:function(selectedTabs, alltabs){
			var self = this;
			var allOpenTabs = appView.getView("tabpage").model.pages;
			var closeTabs = selectedTabs.concat(alltabs);
			closeTabs = $.unique(closeTabs);
			if(!closeTabs[0] || $.trim(closeTabs[0]) == "/>" || $App.getCustomAttrs('hasSetFixedTabs')!="1"){
				closeTabs = ['addr','calendar','googSubscription'];
			}
			$.each(closeTabs,function(i,val){
				allOpenTabs[val] && $App.trigger('delOrignTab_' + val,{});
			});
		},		
		
		/** 获取所有固定标签 */
		getAllOrignTabs:function(){
			var obj = this.getFormatObj(),
				tabs = [];
			$.each(obj,function(i){
				tabs.push(i);
			});
			return tabs;
		},
		
		/** 设置成功处理 */
		callSettingSuccess:function(selectedTabs, alltabs, oldtabs){
			var self = this;
			var str = selectedTabs.join(',');
			M139.UI.TipMessage.show("固定标签处理中...");
			self.closeAllOrignTabs(selectedTabs, alltabs); //关闭固定标签	
			this.model.markSetFixedTabs(); //标签设置过固定标签
			setTimeout(function(){ //打开新固定标签
			    self.showFixedTabs(str.split(',').reverse()); //注意打开顺序
			    self.defaultEntryTab == "mailbox_1" ? $App.showMailbox(1) : $App.show(self.defaultEntryTab);
			},100);
			this.showInMyapp(selectedTabs, oldtabs); //特色应用设置
			M139.UI.TipMessage.show("固定标签设置成功", { delay:3000 });
		},
		
		/** 获取formatObj */
		getFormatObj:function(){
			if(!this.formatObj){
				this.formatObj = this.isChinaMobileUser ? this.getInitTabsObj(): this.getInitInternetUserTabsObj();
			}
			return this.formatObj;
		},
		
		/** （通讯录、日历、精品订阅）取消时在特色应用显示 
		* 注：上一次是设置固定标签的，这次取消了才算
		*/
		showInMyapp:function(selecttabs, oldtabs){		
			
			if(oldtabs === ''){return}
			
			var map = {
				'addr':'16',
				'calendar':'17', //日历
				'googSubscription':'18'
			};
			
			//找出取消的选项 ['addr','calendar']
			var oldtabs = oldtabs.split(",");
			var result = [];

			$.each(oldtabs,function(i,val){
				if($.inArray(val, selecttabs) == -1 && map[val]){
					result.push(map[val]);
					top.BH('tab_cancel_' + map[val]);
				}
			});

			result[0] && $App.trigger('setMyApp',{keys:result});

		},
				
		/** 渲染弹出框 */
		render: function () {
		    var self = this,
				html = this.isChinaMobileUser ? this.template.box : this.template.internetUserBox,
				checkArray = this.model.getFixedTabsData() || this.model.get('initTabsData'),
				formatObj = this.getFormatObj(),
				selectedTabs = []; //缺省勾选
                
		    // 如果用户还没有设置默认进入的页签
		    // 核心用户和飞移动用户进入收件箱
		    // 非核心移动用户进入欢迎页
		    this.defaultEntryTab = $App.getUserConfigInfo("defaultentrytab");
		    if (!this.defaultEntryTab) {
		        this.defaultEntryTab = $User.isChinaMobileUser() ? 'welcome' : 'mailbox_1';
		    }
		    // 初始化默认页签下拉选项
		    this.selectedFixedTabs = $User.isChinaMobileUser() ?
                            [{
		                        text: '欢迎页',
		                        value: 'welcome',
		                        myData: 0
                            }] : 
		                    [{
		                        text: '收件箱',
		                        value: 'mailbox_1',
		                        myData: 0
		                    }];
		    for (var i = 0, len = checkArray.length; i < len ; i++) {

				formatObj[checkArray[i]] = 'checked="checked"';
				$.trim(checkArray[i]) !== '' && selectedTabs.push(checkArray[i]);

                // 过滤掉非固定标签
				if (this.fixTabObj[checkArray[i]] == undefined) continue;
                // 过滤掉预设固定标签
				if (checkArray[i] == ($User.isChinaMobileUser() ? 'welcome' : 'mailbox_1')) continue;
				this.selectedFixedTabs.push({
				    text: this.fixTabObj[checkArray[i]],
				    value: checkArray[i],
				    myData: i + 1
				});
			}
			
			formatObj['maxTab'] = this.maxLen;
			formatObj['oldTabs'] = checkArray.join(",");

			var dialog = $Msg.showHTML(
				
				$T.Utils.format(html,formatObj),
				
				function(e){
					var selects = self.$el.find('input:checked'); 
					var allInput = self.$el.find('input');
					if( selects.length > self.maxLen){
						e.cancel = true;
						return;
					}
					var checkSelects = []; //选择后勾选的
					
					allInput.each(function(){
						if(this.value !== 'welcome'){
							if($(this).attr('checked') === 'checked'){
								checkSelects.push(this.value);
								top.BH('tab_add_' + this.value);
							}
						}
					});
					var alltabs = $App.getCustomAttrs('fixedtabs').split(","); //修改前的标签
					var oldtabs = $('#mOldTabs').val();
					self.model.setFixedTabsData(checkSelects.join(','), function () {
					    if (window.location.href.indexOf("tab=") > 0) {

					    }
						self.callSettingSuccess(checkSelects, alltabs, oldtabs);
					});
				    // 设置登陆后打开的页签
					$App.setUserConfigInfo("defaultentrytab", self.defaultEntryTab, function () {
					    var orignTab = $T.Url.queryString("tab");
					    if (orignTab && orignTab != self.defaultEntryTab) {
					        window.location.replace(window.location.href.replace(/tab=[^&$]+/, "tab="+self.defaultEntryTab));
					    }
					    //先记录在cookie, 这样不用重新登录就能取到最新值
					    $Cookie.set({
					        name: "defaultTab" + $App.getSid(),
					        value: self.defaultEntryTab
					    });
					    if (!$App.getConfig("UserData").mainUserConfig.defaultentrytab) {
					        $App.getConfig("UserData").mainUserConfig.defaultentrytab = [];
					    }
					    $App.getConfig("UserData").mainUserConfig.defaultentrytab[1] = self.defaultEntryTab;
					});
				},
				function () {
				    dialog = null;
                    // 如果默认页签下拉框没有收回，在取消时移除
				    if (self.menuDefaultEntryTab) {
				        $(self.menuDefaultEntryTab.el).remove();
				    }
				},
				{
					width:540,
					dialogTitle:"固定标签管理",
					buttons: ["确定", "取消"]
				}
			);
			
		    // 设置默认标签页
			var entryTabArea = $(dialog.el).find('#entryTabArea');
			entryTabArea.html(self.template.entryTab({ entrytab: self.fixTabObj[self.defaultEntryTab] }));
		    // 选择默认进入页签
		    (function () {		        
			    entryTabArea.click(function () {
			        self.menuDefaultEntryTab = M2012.UI.PopMenu.create({
			            selectMode: true,
			            width: 102,
			            dockElement: entryTabArea,
			            items: self.selectedFixedTabs,
			            onItemClick: function (item) {
			                self.defaultEntryTab = item.value;
			                BH('set_defaultentrytab_' + item.value);
			                entryTabArea.html(self.template.entryTab({ entrytab: self.fixTabObj[self.defaultEntryTab] }));
			                //self.menuDefaultEntryTab = false;
			            }
			        });
			        var selectItem = $.grep(self.selectedFixedTabs, function (i) {
			            return i.value === self.defaultEntryTab;
			        });
			        self.menuDefaultEntryTab.selectItem(selectItem[0] ? selectItem[0].myData : 0);
			    });
			})();


			this.setElement(dialog.el);           
		}


    }));

	$(function(){
		new M2012.TabManage.View().render();
	});
	
})(jQuery, _, M139);