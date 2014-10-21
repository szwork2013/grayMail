/**
 * @fileOverview 文件快递暂存柜状态栏视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Fileexpress.Cabinet.View.Statusbar', superClass.extend(
	/**
	 *@lends M2012.Fileexpress.Cabinet.View.prototype
	 */
	{
		el : "body",
		name : "M2012.Fileexpress.Cabinet.View.Statusbar",
		template : ['<div class="inboxHeaderfr clearfix">',
					    '<span class="mr_10">',
							'<span class="diskprogressBarBlue fr">',
								'<em class="growsBlow" style="width: {usedPercent}%;"></em>',
								'<em class="growFont">{usedSize}/{folderSize}</em>',
							'</span>',
							'<span class="fr"></span>',
						'</span>',
						'<span class="fl ml_10" id="navContainer">暂存柜容量：</span>',
					 '</div>'].join(""),
		template2 : ['<dl class="clearfix mt_15" id="">',
									'<dt><a href="javascript:void(0)" onclick="top.$App.showOrderinfo()" class="fr">升级</a>暂存柜容量：</dt>',
									'<dd>',
										'<span>',
											'<span class="diskprogressBarBlue fr">',
												'<em class="growsBlow" style="width: {usedPercent}%;"></em>',
												'<em class="growFont">{usedSize}/{folderSize}</em>',
											'</span>',
										'</span>',
									'</dd>',
								'</dl>',
								'<dl class="clearfix mt_10 mb_5" id="">',
									'<dt>过期提醒：</dt>',
									'<dd>',
										'<input type="checkbox" id="tipMail"/><label for="tipMail">&nbsp;到期前两天邮件提醒</label>',
										'<span style="display:none;"><input type="checkbox" id="tipMobile"> 短信提醒</span>',
									'</dd>',
								'</dl>',
								'<div class="line"></div>'].join(""),
		listModeTemplate : ['<span class="viewTipPic fr mr_10 ml_10">',
					     '<a href="javascript:void(0)" class="mr_5" id="listMode"> ',
					 	'<!--不选中时候添加"i_view_checked"-->',
					 	'<i class="i_view_checked"></i>',
					     '</a>',
					     '<a href="javascript:void(0)" id="iconMode">',
					 	'<!--选中时候添加"i_list_checked"-->',
					 	'<i class="i_list"></i>',
					     '</a>',
					 '</span>'].join(""),
		logger : new top.M139.Logger({name: "M2012.Fileexpress.Cabinet.View.Statusbar"}),
		events : {
		},
		initialize : function(options) {
			this.model = options.model;
			return superClass.prototype.initialize.apply(this, arguments);
		},
		initEvents : function(){
        	var self = this;
        	// 过期提醒弹出层
        	var jTip = $("#popup_maillist_set");
		//	$("#fileList").css("margin-top","14px");
		//	$("#btn_setting").click(function(){
		//		jTip.show();
		//	});
        	$("#btn_setting").click(function(event){
        		var left = $(this).offset().left - jTip.width()/2 - 70;
        		jTip.css('left', left);
				jTip.show();
				
				M139.Dom.bindAutoHide({
	                action: "click",
	                element: jTip[0],
	                stopEvent: true,
	                callback: function () {
	                    jTip.hide();
	                    M139.Dom.unBindAutoHide({ action: "click", element: jTip[0]});
	                }
	            });
	            top.$Event.stopEvent(event);
        	});
        	// 关闭过期提醒弹出层
        	$("#closeSetTip, #cancelSetTip").click(function(event){
        		jTip.hide();
        	});
        	$("#setTipSure").click(function(event){
        		self.model.setTipMode(function(result){
        			if(result.responseData.code && result.responseData.code == 'S_OK'){
        				BH({key : "fileexpress_cabinet_settipsuc"});
        				
        				top.M139.UI.TipMessage.show(self.model.tipWords['SET_SUC'], {delay : 1000});
        			}else{
        				self.logger.error("setFiles returndata error", "[file:setFiles]", result);
        			}
        			jTip.hide();
        		});
        	});
        	// 文件搜索
        	$("#keywords").blur(function(){
        		var text = $(this).val();
        		if(!text){
        			text = self.model.defaultInputValue;
        		}
        		$(this).val(text);
        	}).focus(function(){
        		var text = $(this).val();
        		if(text == self.model.defaultInputValue){
        			$(this).val('');
        		}
        	});
        	$("#search").click(function(event){
				self.searchFiles();
				return;
				/*
        		var jKeywords = $("#keywords");
        		if(jKeywords.hasClass('hide')){
        			jKeywords.removeClass('hide');
        		}else{
        			var text = jKeywords.val();
	        		if(!text || text === self.model.defaultInputValue){
	        			$("#keywords").addClass('hide');
	        		}
	        		self.searchFiles(event);
        		}
				*/
        	});
        	// 文件搜索支持回车事件
			if($B.is.ie && $B.getVersion() == 6){
				$("#keywords").bind('keydown', function(event){
					if(event.keyCode == M139.Event.KEYCODE.ENTER){
						$("#search").click();
					}
				}).bind('keypress', function(event){
					if(event.keyCode == M139.Event.KEYCODE.ENTER){
						$("#search").click();
					}
				});
			}else{
				$("#keywords").bind('keydown', function(event){
					if(event.keyCode == M139.Event.KEYCODE.ENTER){
						$("#search").click();
					}
				});
			};
        	// 列表模式切换
        	$("#listMode").click(function(event){
                var target = $(this);

                self.changeViewTip(function(){
                    self.model.set('listMode', 0);
                    $("#iconMode i").attr('class', 'i_list_checked');
                    target.find('i').attr('class', 'i_view');
                });
				$(".wh3,.wh4,.wh5,.wh6").show();
				$(".diskTableList.onScollTable").show();
				$("#fileList").css("margin-top","0");
        	});
        	$("#iconMode").click(function(event){
                var target = $(this);

                self.changeViewTip(function(){
                    self.model.set('listMode', 1);
        		    $("#listMode i").attr('class', 'i_view_checked');
        		    target.find('i').attr('class', 'i_list');
                });
				$(".wh3,.wh4,.wh5,.wh6").hide();
				$(".diskTableList.onScollTable").hide();
				$("#fileList").css("margin-top","14px");
        	});
        },
		render : function(){
		    var self = this;
            var dataSource = self.model.dataSource;

		    $("#keywords").val(self.model.defaultInputValue);
		    var html = $T.Utils.format(self.template2, self.model.getStatusObj());
		 	$("#layout").html(html);
			$("#listModeContainer").html(self.listModeTemplate);
        //    $("#pcClientSetup").html(top.SiteConfig["pcClientSetupHtml"]);
		 	
		 	// 根据用户套餐信息显示升级链接
		 	if(self.model.isServiceItem()){
		 		var jUpgrade = $("#upgrade");
		 	//	jUpgrade.prev('em.gray').hide();
		 	//	jUpgrade.hide();
		 	}

            // 根据getFiles接口中的emailRemind来设置邮件提醒的勾选状态
            $("#tipMail").attr('checked', !!Number(dataSource.emailRemind));
            $("#tipMobile").attr('disabled', true);
		 	if(!self.model.isSetupMailTool()){
		 		$("#setupMailtool").show();
		 	}
		 	
		 	var mode = self.model.get('listMode');
			if(mode){
				$("#listMode i").attr('class', 'i_view_checked');
        		$("#iconMode").find('i').attr('class', 'i_list');
			}else{
				$("#iconMode i").attr('class', 'i_list_checked');
        		$("#listMode").find('i').attr('class', 'i_view');
			}
		},
        //切换视图提示
        changeViewTip: function (callback) {
            var self = this;
            var isUploading = mainView.uploadModel.isUploading();

            if (isUploading) {
                if (window.confirm(self.model.tipWords["UPLOADING_CHANGE_VIEW"])) {
                    callback && callback();
                }
            } else {
                callback && callback();
            }
        },
		// 搜索文件
		searchFiles : function(event){
			var self = this;
		//	var keywords = $.trim($("#keywords").val());
			var keywords = $T.Html.encode($T.Url.queryString("keyword")) || "";//从URL获取搜索的内容
			if(!keywords || keywords === self.model.defaultInputValue){
				self.model.set('fileList', self.model.get('originalList'));
			}else{
				self.model.set('fileList', self.model.search(keywords));
			}
			$("#navContainer").html('搜索包含“'+keywords+'”的暂存柜文件，共'+self.model.get('fileList').length+'个');
			self.model.set('searchStatus', -self.model.get('searchStatus'));// 重新加载第一页文件列表
		}
	}));
})(jQuery, _, M139);


