/**
* @fileOverview 文件快递暂存柜主视图层.
*@namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Fileexpress.Cabinet.View.Main', superClass.extend(
        /**
        *@lends M2012.Compose.View.prototype
        */
    {
        el: "body",
        name : "M2012.Fileexpress.Cabinet.View.Main",
        logger: new top.M139.Logger({name: "M2012.Fileexpress.Cabinet.View.Main"}),
        events: {
        },
        initialize: function (options) {
        	this.model = options.model;
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initEvents : function(){
        	var self = this;
        	// 监听model层数据变化
			self.model.on("change:pageIndex", function(){// 翻页
				self.fileListView.render();
		    });
		    self.model.on("change:listMode", function(){// 视图切换
				self.fileListView.render();
		    });
		    self.model.on("change:searchStatus", function(){// 搜索状态
		    	self.model.set('pageIndex', 1);
		    	self.model.set('selectedFids', []);
				self.model.trigger("createPager");
		    	
		    	$("#fileName").show();
    			$("#selectCount").hide();
		    	
				self.fileListView.render();
		    });
		    self.model.on("change:sortType", function(){// 排序类型
		    	self.fileListView.sortByType();
		    	self.toolbarView.renderSortMenu();
		    });
		    self.model.on("change:sortIndex", function(){// 排序方式 升序或者降序
		    	self.fileListView.sortByType();
		    	self.toolbarView.renderSortMenu();
		    });
		    
		    // 绑定事件供其他view调用
		    self.model.on("createPager", function () {// 重新创建分页组件
	            self.toolbarView.createPager();
	        });
	        self.model.on("deleteFiles", function (ids, target, isNoRefresh) {// 删除文件
	    		self.model.deleteFiles(function(result){
	    			if(result.responseData && result.responseData.code == 'S_OK'){
	    				BH({key : "fileexpress_cabinet_deletesuc"});
	    				
	    				

                        if (!isNoRefresh) {
	    				    self.model.trigger("refresh", null);
                        }
		top.M139.UI.TipMessage.show(self.model.tipWords['DELETE_SUC'], {delay : 1000});
                        //文件上传中，删除已上传完的文件
                        if (self.model.get("listMode") == 0) {
                            target.parents("tr").remove();
                        } else {
                            target.parents("li").remove();
                        }
                        self.model.deleteFileFromModel(ids);//从model层删除文件
	    			}else{
	    				self.logger.error("delFiles returndata error", "[file:delFiles]", result);
	    			}
	    		}, ids);
	        });
	        self.model.on("downloadFiles", function (ids) {// 下载文件
	        	top.M139.UI.TipMessage.show(self.model.tipWords['DOWNLOAD_WAITING'], {delay : 2000});
	    		self.model.downloadFiles(function(result){
	    			if(result.responseData.code && result.responseData.code == 'S_OK'){
	    				BH({key : "fileexpress_cabinet_downloadsuc"});
	    				
	    				var downloadUrl = result.responseData.imageUrl;
	    				// window.open(downloadUrl);
	    				$("#downloadFrame").attr('src', downloadUrl);
	    			}else{
	    				self.logger.error("preDownload returndata error", "[file:preDownload]", result);
	    			}
	    		}, ids);
	        });
	        self.model.on("renewFiles", function (ids) {// 文件续期
	    		self.model.renewFiles(function(result){
	    			if(result.responseData.code && result.responseData.code == 'S_OK'){
	    				BH({key : "fileexpress_cabinet_renewsuc"});
	    				
	    				
	    				self.model.trigger("refresh");
						top.M139.UI.TipMessage.show(self.model.tipWords['RENEW_SUC'], {delay : 1000});
	    			}else{
	    				self.logger.error("continueFiles returndata error", "[file:continueFiles]", result);
	    			}
	    		}, ids);
	        });
	        self.model.on("renameFile", function () {// 文件重命名
	        	self.fileListView.showRenameTable();
	        });
	        self.model.on("refresh", function () {// 刷新数据源，刷新界面
	        	self.model.set('pageIndex', 1);
	        	self.model.set('selectedFids', []);
	        	
	        	self.fileListView.renderSelectCount();
	        	
	        	self.getDataSource(function(){
	    			self.statusView.render();
	    			self.statusView.initEvents();
	    			
	    			self.toolbarView.render();
	    			
			    	self.fileListView.render();
			    });
	        });
	        
	        $(window).resize(function(){
        		self.resizeFileListHeight();
	        });
	        $(window).unload(function () {
	            $("object").remove();//页面卸载或跳转前先移除掉flash，防止ie8报错  
	        });
	        
			
			// 安装彩云PC客户端 todo 地址写死了
			/*$("#setupDiskTool").click(function(event){
				var isrm = 0;
				if (top.isRichmail) {
                    isrm = 1;
                } else {
                    isrm = 0;
                }
                var diskResourcePath = 'http://images.139cm.com/rm/newnetdisk4/';
                var path = top.SiteConfig.disk;
                window.open(path+"/wp.html?jsres=" + escape(diskResourcePath) + "&res=" + 'http://images.139cm.com/rm/richmail' + "&isrm=" + isrm, "virtualDiskHome");
			});*/

            this.registerCloseTabEvent();
        },
		render : function(){
			var self = this;
    		self.getDataSource(function(){
    			self.statusView = new M2012.Fileexpress.Cabinet.View.Statusbar({model : self.model});
    			self.statusView.render();
    			self.statusView.initEvents();
    			
    			self.commandView = new M2012.Fileexpress.Cabinet.View.Command({model : self.model});
    			self.toolbarView = new M2012.Fileexpress.Cabinet.View.Toolbar({model : self.model});
    			self.toolbarView.render();
    			
		    	self.fileListView = new M2012.Fileexpress.Cabinet.View.Filelist({model : self.model,toolbarView: self.toolbarView});//视图层监听toolbar状态栏
		    	self.fileListView.render();
		    	
		    	self.resizeFileListHeight();
				new M2012.Fileexpress.View.ContextMenu({model: self.model, fileListView : self.fileListView});//鼠标右键
		    });
		},

        registerCloseTabEvent: function(){
            top.$App.on("closeTab", this.closeTabCallback);
        },

        closeTabCallback: function (args) {
            if (!top || !top.$App) return;
            if (args.name && args.name.indexOf("quicklyShare") > -1) {
                var isUploading = mainView.uploadModel.isUploading();

                if (isUploading) {
                    if (window.confirm(mainView.model.tipWords["UPLOADING"])) {
                        args.cancle = false;
                        top.$App.off("closeTab", mainView.closeTabCallback);
                    } else {
                        args.cancel = true;
                    }
                } else {
                    args.cancel = false;
                    top.$App.off("closeTab", mainView.closeTabCallback);
                }
            }
        },

		// 动态设置 fileList 高度避免出现两根滚动条
		resizeFileListHeight : function(){
		
			try {
                $iframe = $("#fileList");
				$iframe.height($(top.document.body).height() - 175); //减去多余4像素
                if ($.browser.msie && $.browser.version < 8) {
                //    $iframe.width($(top.document.body).width());
                }

            } catch (e) { }
			/*
		    var listOffset = $("#fileList").offset();

            if (!listOffset) {
                return;
            }

            var listTop = listOffset.top;
            var jQuick = getJquicklyShare();
		    var iframeHeight = jQuick.height();
		    $("#fileList").height(iframeHeight - listTop);
		    
		    function getJquicklyShare(){
			    var jQuicklyShare = top.$("iframe#quicklyShare");
			    if(jQuicklyShare.size() === 0){
			    	var mainIFrames = top.$(".main-iframe");
			    	for(var i = 0;i < mainIFrames.length;i++){
				    	if(mainIFrames[i].id === 'quicklyShare'){
				    		jQuicklyShare = top.$(mainIFrames[i]);
				    		break;
				    	}
				    }
			    }
			    return jQuicklyShare;
		    };*/
		},
		showGuidefirstTime : function(){
			var bgB = '<div class="backgroundBlock" id="bgB2"></div>';
			var firstGuideTipsCab = '<span class="promptTwo" id="firstGuideTipsCab"><a href="javascript:void(0);" id="firstGuideTipsCloseCab"></a></span>';
						//为undefined的时候说明是第一次 为1的时候说明弹出过，不弹了。
						if(0 && !top.$App.getUserCustomInfo("sfgt2")){ //屏蔽
							$(bgB).appendTo(top.document.body);
							$(firstGuideTipsCab).appendTo(top.document.body);
							top.$("#firstGuideTipsCloseCab").click(function(){
								top.$("#bgB2").hide();
								top.$("#firstGuideTipsCab").hide();
								top.$("#wpContainer").hide();
								top.$("#wpContainer").hide();
								top.$App.setUserCustomInfoNew({"sfgt2":1})
							});	
			}
		},
		// 初始化模型层数据
		getDataSource : function(callback){
			var self = this;
			top.M139.UI.TipMessage.show("正在加载中...");
			self.model.getDataSource(function(result){
				if(result.responseData && result.responseData.code == 'S_OK'){
					top.M139.UI.TipMessage.hide();
					self.model.dataSource = result.responseData['var'];
					var fileList = self.model.dataSource.fileList.concat();
					fileList = self.model.formatExpireDate(fileList);// 格式化过期时间
					self.model.sort({field : 'createTime', dataSource : fileList});// 默认按照上传时间排序
					
					self.model.set('fileList', fileList);
					self.model.set('originalList', fileList.concat());
					if(callback){
						callback();
					}
					if(fileList.length > 0){
						self.showGuidefirstTime();
					}
					// 判断是否从其他模块接收keyword参数，如果有则进入搜索界面
                    if($T.Url.queryString("keyword")){
                    	$("#search").click();
                    	return;
                    }
				}else{
					top.M139.UI.TipMessage.show("加载失败",{delay: 1000});
					self.logger.error("getFiles returndata error", "[file:getFiles]", result);
				}
		    });
		}
    }));
})(jQuery, _, M139);

