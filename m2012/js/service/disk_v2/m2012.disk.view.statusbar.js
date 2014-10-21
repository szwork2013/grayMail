/**
 * @fileOverview 彩云状态栏视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Disk.View.Statusbar', superClass.extend(
	/**
	 *@lends M2012.Disk.View.prototype
	 */
	{
		el : "body",
		name : "M2012.Disk.View.Statusbar",
        template : ['<div class="netdiskfl">',
			             '<div class="netdiskfldiv" id="navContainer">',
				             '<a href="javascript:;">全部文件</a>',
//				             '<span class="f_st">&gt;</span>',
//				             '<a href="javascript:void(0)">我的照片</a>',
//				             '<span class="f_st">&gt;</span>',
//				             '<span>阳朔旅游</span>',
			             '</div>',
		            '</div>', 
        			'<div class="netdiskfr">',
        				'<span class="viewTipPic fr mr_10">',
				             '<a href="javascript:void(0)" class="mr_5" id="listMode"><i class="i_view"></i>',
				             '</a>',
				             '<a href="javascript:void(0)" id="iconMode">',
				                 '<i class="i_list_checked"></i>',
				             '</a>',
				         '</span>',
				         '<div class="fileSearchBar fr mr_10">',
                             '<div class="fileSearchDiv hide">',
				                 '<input type="text" class="text gray" value="搜索彩云网盘" id="keywords">',
                             '</div>',
				             '<a bh="diskv2_search" href="javascript:void(0)" class="fileSearchBtn" id="search">',
				                 '<i class="i_g-search"></i>',
				             '</a>',
				         '</div>',
			             '<span class="mr_10">',
			                 '<a href="javascript:void(0)" onclick="top.$App.showOrderinfo()" id="upgrade" class="c_0066cc fr ml_10 mr_10">升级</a>',
			                 '<span class="diskprogressBarBlue fr"> <em class="growsBlow" style="width: {usedPercent}%;"></em> <em class="growFont">{usedSize}/{totalSize}</em>',
			                 '</span>',
			                 '<em class="fr">容量：</em>',
			             '</span>',
		          	 '</div>'].join(""),
		capacityTemplate : ['<span class="progressBarDiv viewtProgressBar">',
								'<span class="progressBar"></span>',
								'<span class="progressBarCur" role="progressbar">',
									'<span class="progressCenter" style="width: {usedPercent}%;"></span>',
								'</span>',
							'</span>',
							'<p>网盘容量：{usedSize}/{totalSize}<a href="javascript:void(0)" onclick="top.$App.showOrderinfo()" id="upgrade" class="ml_10">升级</a></p>'].join(""),
		listModeTemplate : ['<span class="viewTipPic fr mr_10 ml_10">',
				             '<a href="javascript:void(0)" class="mr_5" id="listMode"><i class="i_view_checked"></i>',
				             '</a>',
				             '<a href="javascript:void(0)" id="iconMode">',
				                 '<i class="i_list"></i>',
				             '</a>',
				         '</span>'].join(""),
		logger : new top.M139.Logger({name: "M2012.Disk.View.Statusbar"}),
		events : {
		},
		initialize : function(options) {
			this.model = options.model;
			return superClass.prototype.initialize.apply(this, arguments);
		},
		initEvents : function(){
        	var self = this;
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
                var jKeywordsParent = jKeywords.parent();

        		if(jKeywordsParent.hasClass('hide')){
                    jKeywordsParent.removeClass('hide');
                    var keyword = self.model.inputPara.keyword;
                    if(keyword && keyword != self.model.defaultInputValue){
                        jKeywords.val(keyword);
                        self.searchFiles();
                    }

                }else{
        			var text = jKeywords.val();
	        		if(!text || text === self.model.defaultInputValue){
                        jKeywordsParent.addClass('hide');
	        		}else{
	        			self.searchFiles();
	        		}
        		}*/
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
				BH("disk3_list");
				$("#fileName2").show();
				$(".diskTableList.onScollTable").show();
        	});
        	$("#iconMode").click(function(event){
                var target = $(this);

        		self.changeViewTip(function(){
                    self.model.set('listMode', 1);
                    $("#listMode i").attr('class', 'i_view_checked');
                    target.find('i').attr('class', 'i_list');
                });
				BH("disk3_filethumbnail");
				$("#fileName2").hide();
				$(".diskTableList.onScollTable").hide();
        	});
			$("#sortMenus2 li[name='uploadTime']").click(function(){
				self.model.set('listMode', 1);
				$("#sortMenus2").hide();
				return false;
			});
			$("#sortMenus2 li[name='fileSize']").click(function(){
				self.model.set('listMode', 0);
				$("#sortMenus2").hide();
				$("#fileName2").show();
				return false;
			});
			$("#sortMenus2 li[name='fileName']").click(function(){
				self.model.set('listMode', 2); //时间轴视图
				$("#sortMenus2").hide();
				return false;
			});
			$(document).click(function(){
				$("#sortMenus2").hide();
			});
        },
		render : function(){
		    var self = this;
		    $("#keywords").val(self.model.defaultInputValue);
		    var html = $T.Utils.format(self.template, self.model.getStatusObj());
			var htmlcap = $T.Utils.format(self.capacityTemplate, self.model.getStatusObj());
		 	$("#diskStatus").html(html);
			$("#capacityTemplate").html(htmlcap);
			$("#listModeContainer").html(self.listModeTemplate);
		 	$("#pcClientSetup").html(top.SiteConfig["pcClientSetupHtml"]);

		 	// 根据用户套餐信息显示升级链接
		 	if(self.model.isServiceItem()){
		 		var jUpgrade = $("#upgrade");
		 	//	$(".diskprogressBarBlue").addClass('mr_10');
		 	//	jUpgrade.hide();
		 	}
			self.navigatorContainer = {};//面包屑缓存
		},
		// 渲染目录导航 
		renderNavigation : function(dirid){
			var self = this;
			$("#navContainer").html(self.getNavHtml(dirid));
			self.initNavEvents();
		},
		// 获取目录导航html
		getNavHtml : function(dirid){
			var self = this;
		//	debugger;
            var rootId = self.model.getRootDir();
			if(!dirid){
				dirid = self.model.get('curDirId');
			}
			if(self.navigatorContainer[dirid]){
				return self.navigatorContainer[dirid];
			}
			var curDirObj = self.model.getDirById(dirid);
			self.model.set('parentDirs', []);
			self.model.setParentDirs(curDirObj);
			var parentDirs = self.model.getParentDirs();
			var navHtml = [];
			if(parentDirs && parentDirs.length > 0){
				$(parentDirs).each(function(i){
					if(this.directoryName && this.directoryName.length > 10){
						this.directoryName = this.directoryName.substring(0,10) + "...";
					}
					if(curDirObj.directoryName && curDirObj.directoryName.length > 10){
						curDirObj.directoryName = curDirObj.directoryName.substring(0,10) + "...";
					}
					if(i == 0){
						navHtml.push('<a href="javascript:;" fileid="');
						navHtml.push(rootId);
						navHtml.push('" filetype="0');
						navHtml.push('">全部文件</a>');
					}else{
						navHtml.push('<span class="f_st">&nbsp;&gt;&nbsp;</span>');
						navHtml.push('<a href="javascript:void(0)" fileid="');
						navHtml.push(this.directoryId);
						navHtml.push('" filetype="');
						navHtml.push(this.dirType);
						navHtml.push('">');
						navHtml.push(this.directoryName);
						navHtml.push('</a>&nbsp;');
					}
				});
				navHtml.push('<span class="f_st">&nbsp;&gt;&nbsp;</span>');
				navHtml.push('<span>');
				navHtml.push(curDirObj.directoryName);
				navHtml.push('</span>');
			}else{
				navHtml.push('<a href="javascript:;" fileid="');
                navHtml.push(rootId);
				navHtml.push('" filetype="0">全部文件</a>');
				//navHtml.push(curDirObj.directoryId);
                ///navHtml.push(10);
                //navHtml.push('" filetype="0');
				//navHtml.push('');
			}
			self.navigatorContainer[dirid] = navHtml.join('');
			return navHtml.join('');
		},
		// 为导航添加单击事件
		initNavEvents : function(){
			var self = this;
            var curDirLevel = self.model.get('curDirLevel');
            var userDirLimit = self.model.dirLevelLimit.USER_DIR;
			$("#navContainer a").click(toggleDirHandle);
			$("#navContainer strong").click(toggleDirHandle);

            function toggleDirHandle(){
				top.firstEnterNet = false;
                var dirId = $(this).attr('fileid');
                var dirType = $(this).attr('filetype');
                var dirObj = self.model.getDirById(dirId);
                var dirLevel = dirObj.directoryLevel;
                self.model.set('curDirType', dirType);
				var curDirId = self.model.get("curDirId");
				if(curDirId == self.model.getRootDir()){
					self.model.trigger('openDir', curDirId);
					return;
				}
                self.model.set('curDirId', dirId);
                self.model.set("curDirLevel", dirLevel);
                self.model.set("selectedFids", []);
                self.model.set("selectedDirIds", []);
                self.model.set("selectedDirAndFileIds", []);

                self.model.trigger("changeFileTypeUpload");
                //todo
                if(dirLevel != userDirLimit){   //当用户从自定义文件夹第四级目录下的文件点击当前位置菜单第四级需要用到
                    self.model.set("curDirLevel", 1);
                }
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
		searchFiles : function(){
			var self = this;
		//	var keywords = $.trim($("#keywords").val());
			var keywords = $T.Html.encode($Url.getQueryObj()["keyword"]) || "";//从URL获取搜索的内容
			self.model.search(function(result){
				if(result.responseData.code && result.responseData.code == 'S_OK'){
					var files = result.responseData['var'].files;
                    self.model.selectNone();//解决 选中文件之后 在搜索中输入关键字搜索后，还会显示之前的已选中多少文件
					self.model.set('fileList', files);
					
					$("#navContainer").html('搜索包含“'+keywords+'”的彩云网盘文件，共'+files.length+'个');
					self.model.set('searchStatus', -self.model.get('searchStatus'));
    			}else{
    				self.logger.error("search returndata error", "[disk:search]", result);
    			}
			}, keywords);
		}
	}));
})(jQuery, _, M139);


