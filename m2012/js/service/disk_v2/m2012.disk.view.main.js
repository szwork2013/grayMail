/**
* @fileOverview 彩云主视图层.
*@namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Disk.View.Main', superClass.extend(
        /**
        *@lends M2012.Disk.View.prototype
        */
    {
        el: "body",
        name : "M2012.Disk.View.Main",
        logger: new top.M139.Logger({name: "M2012.Disk.View.Main"}),
		first : true,
        events: {
        },
        initialize: function (options) {
        	this.model = options.model;
            this.initParams();
			setTimeout(function(){
				$("#outArticle").height($(top.document.body).height() - 47 - 29 - 8).css("over-flow","hidden");; //减去多余4像素
			},0);
			window.onresize = function(){
				$("#outArticle").height($(top.document.body).height() - 47 - 29 - 8);
			}
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initEvents : function(){
        	var self = this;

            /*window.onbeforeunload = function(e){
                var p=$("object").parent().parent();
                var node=$("object").parent();
                $("object").parent().remove();
                setTimeout(function(){
                    p.append(node);
                    insertFlashCode();
//                    self.toolbarView.createBtnUpload();
                },500);
                //document.body.innerHTML="";

                *//*var isRemoveFlash = self.model.get("isRemoveFlash");

                if (isRemoveFlash) { // 页面卸载或跳转前先移除掉flash，防止ie8报错
                    $("object").parent().remove();
                    document.body.innerHTML="<div></div>";
                } else { // 下载时触发是不需要移除flash的
                    self.model.set("isRemoveFlash", true);
                }*//*
            };*/

        	// 监听model层数据变化
			self.model.on("change:pageSize", function(){
				self.model.trigger("renderFileList");
			});
			self.model.on("change:pageIndex", function(){// 翻页
				if(self.model.get("currentShowType")){
					self.leftbarView.showDifferentDoc();
					return;
				}
				var curDirid = self.model.get('curDirId');
				var curDirtype = self.model.get('curDirType');
				var options = {dirid : curDirid, dirType : curDirtype};
				self.getFiles(function(){
							self.model.trigger('createPager');
							self.model.trigger("renderFileList");
				}, options);
		    });
		    self.model.on("change:listMode", function(){// 视图切换
		    	self.model.trigger("renderFileList");
		    });
			self.model.on("change:isImagesMode",function(){
				var isImagesMode = self.model.get("isImagesMode");
				if(isImagesMode){
					$("#listModeContainer").hide();
					$("#isimagesModel").show();
				}else{
					$("#listModeContainer").show();
					$("#isimagesModel").hide();
				}
				
			});
			//pageCount变化，说明切换了目录，分页要变化
			self.model.on("change:PageCount", function(){
				self.model.trigger("createPager");
			});
		    self.model.on("change:searchStatus", function(){// 搜索状态
		    	self.model.set('pageIndex', 1);
				self.model.trigger("createPager");
		    	
				self.model.trigger("renderFileList");
		    });

		    self.model.on("change:curDirId", function(){// 打开目录
				if(!top.firstEnterNet){
					self.model.trigger('openDir', self.model.get('curDirId'));
				}else{
					var curDirType = self.model.get('curDirType');
					self.statusView.renderNavigation(self.model.get('curDirId'));
					self.model.trigger('renderBtns');


					self.model.resetProperties();
					self.model.trigger('renderSelectCount');
					var curDirid = self.model.get('curDirId');
					var curDirtype = self.model.get('curDirType');
					var options = {dirid : curDirid, dirType : curDirtype};
					if(!top.firstEnterNet){
						self.getFiles(function(){
							self.model.trigger('createPager');
							self.model.trigger("renderFileList");
						}, options);
					}else{
							self.model.trigger('createPager');
							self.model.trigger("renderFileList");
					}
					
				}
		    });

            self.model.on("change:curDirLevel", function(){
                self.toolbarView.renderBtns();
            });
		    self.model.on("change:selectedDirAndFileIds", function(){//选择的文件及目录个数显示
                self.fileListView.renderSelectCount();
            });
		    // 绑定事件供其他view调用
		    self.model.on("createPager", function () {// 重新创建分页组件
	            self.toolbarView && self.toolbarView.createPager();
	        });
	        self.model.on("deleteDirsAndFiles", function (dataSend) {// 删除文件
	    		self.model.deleteDirsAndFiles(function(result, dataSend){
	    			if(result.responseData && result.responseData.code == 'S_OK'){

	    				top.M139.UI.TipMessage.show(self.model.tipWords['DELETE_SUC'], {delay : 1000});

                        var dirIds = dataSend.directoryIds;
                        var fileIds = dataSend.fileIds;

                        dirIds && (dirIds.length > 0) && delFileDataByIds(dirIds.split(","));
                        fileIds && (fileIds.length > 0) && delFileDataByIds(fileIds.split(","));
                
                        self.getDiskInit(function () {
                            self.statusView.render();
                            self.statusView.renderNavigation(self.model.get('curDirId'));
                            self.statusView.initEvents();
                            self.toolbarView.render();
                            //                            self.model.trigger('openDir', self.model.get('curDirId'));
                            self.model.trigger('switchModeStyle');
                            self.model.set("pageIndex", 1); //防止删除一整页文件后页面空白
                            self.model.trigger("createPager");
                        }, { notips: true });

	    			} else if (result.responseData && result.responseData.code == "JOIN_MCLOUD") {//正在接入彩云
                        self.model.confirmMcloudUpgrade();
                    } else {
	    				top.M139.UI.TipMessage.show(self.model.tipWords['DELETE_ERR'], {delay : 1000});
	    				self.logger.error("delete returnData error", "[disk:delDiskDirsAndFiles]", result);
	    			}
	    		}, dataSend);

                function delFileDataByIds (ids) {
                    self.model.delFileById(ids);
                    delDomByIds(ids);
                }

                function delDomByIds (ids) {
                    var container = $("#fileList");
                    var listMode = self.model.get("listMode");
					var fileEles = null;
					if(listMode == 0){
						fileEles = container.find("tr"); 
					}else if(listMode == 1){
						fileEles = container.find("li");
					}else if(listMode == 2){
						fileEles = $("#diskPicModle").find("li");
					}
                //    var fileEles = self.model.get("listMode") == 0 ? container.find("tr") : container.find("li");

                    for (var i = 0, len = ids.length; i < len; i++) {
                        var id = ids[i];

                        for (var j = 0, l = fileEles.length; j < l; j++) {
                            var item = fileEles.eq(j);
                            if (item.find("input").eq(0).attr("fileid") == id) {
                                item.remove();
                                break;
                            }
                        }
                        //刷新用户选中文件数量
                        var selectedDirAndFileIds = self.model.get('selectedDirAndFileIds');
                        var selectedDirIds = self.model.get('selectedDirIds');
                        var selectedFids = self.model.get('selectedFids');
                        var allSelectedIndex = $.inArray(id, selectedDirAndFileIds);
                        var dirSelectedIndex = $.inArray(id, selectedDirIds);
                        var fileSelectedIndex = $.inArray(id, selectedFids);
                        if(allSelectedIndex != -1){
                            if(dirSelectedIndex != -1){
                            selectedDirIds.splice(dirSelectedIndex, 1);
                            }else if(fileSelectedIndex != -1){
                                selectedFids.splice(fileSelectedIndex, 1);
                            }
                            selectedDirAndFileIds.splice(allSelectedIndex, 1);
                            self.model.trigger("renderSelectCount");
                        }
                    }
                }
	        });

            self.model.on('setCover',function(dataSend){
                self.model.setCover(function(result){
                    var responseData = result.responseData;
                    if(responseData && responseData.code == 'S_OK'){
                        top.M139.UI.TipMessage.show(self.model.tipWords['SETCOVER_SUC'], {delay : 1000});
                    }else{
                        top.M139.UI.TipMessage.show(self.model.tipWords['SETCOVER_ERR'], {delay : 1000});
                        self.logger.error("setCover returnData error", "[disk:setCover]", result);
                    }
                }, dataSend)
            });
	        self.model.on("download", function (dataSend) {// 下载文件
	    		self.model.download(function(result){
                    var responseData = result.responseData;
                    var error = result.responseData.summary;
                    if(responseData && responseData.code == 'S_OK'){
                        var data = result.responseData["var"];
                        $("#downloadFrame").attr('src', data.url);
	    			}else{
                        downloadErr();
                    }

                    function downloadErr(){
                        top.M139.UI.TipMessage.show(error, {delay: 1000});
                        self.logger.error("download returnData error", "[disk:download]", result);
                    }
	    		}, dataSend);
	        });
	        
            self.model.on("createDir", function (dataSend) {//新建文件夹
                self.createDirView.render();
            });
            self.model.on("share", function(){
                self.model.showShareDialog();
            });
	        self.model.on("renameDirAndFile", function () {// 文件重命名
                self.renameView.render();
	        });
	        self.model.on("renderFileList", function () {// 渲染文件列表
				self.render = true;
				//当不是搜索图片模式，但是当前为时间轴视图时
				if(self.model.get('currentShowType') != 1 && self.model.get('listMode') == 2){
					self.model.set('listMode',1);
					//$("#rename").show();
				}
				//当为搜索图片，且为时间轴视图时
				if(self.model.get('currentShowType') == 1 && self.model.get('listMode') == 2){
					$("#fileList").hide();
					$("#diskPicModle").show();
					$("#clickToGetMore").show();
					$("#sortDock").hide();
					$("#filelist_pager").hide();
					$(".diskTableList.onScollTable").hide();
					//$("#rename").hide();
				}else{
					$("#fileList").show();
					$("#diskPicModle").hide();
					$("#clickToGetMore").hide();
					$("#sortDock").show();
					$("#filelist_pager").show();
				//	$("#rename").show();
				}
				if(self.model.get('currentShowType') == 1 && self.model.get('listMode') == 0){
					$(".diskTableList.onScollTable").show();
				}
	        	var listMode = self.model.get('listMode');
				switch (listMode){
					case 0 :
						self.fileListView.render();
						$("#fileList").css("margin-top","0");
						break;
					case 1 :
						self.fileThumbnailView.render();
						$("#fileList").css("margin-top","14px");
						break;
					case 2 :
						self.fileThumbnailImageView.render();
						self.render = false;
						$("#fileList").css("margin-top","14px");
						$("#diskPicModle").css("margin-top","14px");
						break;
				}
				window.setTimeout(function(){
					self.resizeFileListHeight();
				},0xff);
	        });
	        self.model.on("renderSelectCount", function () {// 渲染用户选中的文件数量
	        	self.fileListView.renderSelectCount();
	        });
	        self.model.on("renderSelectAll", function (pageData) {// 渲染全选按钮
	        	self.fileListView.renderSelectAll(pageData);
	        });
	        self.model.on("reselectIconFiles", function () {// 缩略图模式的重新选中文件事件
	        	self.fileThumbnailView.reselectFiles();
	        });

	        self.model.on("previewFile", function (fid, target) {// 文件预览
	        	self.fileListView.previewFile(fid, target);
	        });
	        self.model.on("openDir", function (dirid) {// 打开文件夹
                //var model = self.model;
                var curDirType = self.model.get('curDirType');
                self.statusView.renderNavigation(dirid);
                self.model.trigger('renderBtns');


                self.model.resetProperties();
				self.model.trigger('renderSelectCount');
                var curDirid = self.model.get('curDirId');
                var curDirtype = self.model.get('curDirType');
                var options = {dirid : curDirid, dirType : curDirtype};
				self.getFiles(function(){
					self.model.trigger('createPager');
			    	self.model.trigger("renderFileList");
				}, options);
	        });
	        self.model.on("refresh", function () {// 刷新数据源，刷新界面
	        	// self.model.resetProperties();
	        	// self.fileListView.renderSelectCount();
	        	$(".inboxHeader.bgMargin").show();
	        	self.getDirectorys(function(){
	    			self.statusView.render();
	    			self.statusView.initEvents();
	    			self.toolbarView.render();
	    			self.model.trigger('openDir', self.model.get('curDirId'));
                    self.model.trigger('switchModeStyle');
			    });
	        });

            self.model.on('switchModeStyle', function(){
                var listMode = self.model.get('listMode');
                if(!listMode){
                    $("#listMode i").attr('class', 'i_view_checked');
                    $('#iconMode i').attr('class', 'i_list');
                }else{
                    $("#listMode i").attr('class', 'i_view');
                    $('#iconMode i').attr('class', 'i_list_checked');
                }
            });
            
            self.model.on("postCard", function () {// 制作明信片
	        	self.model.postCard();
	        });
	        
	        $(window).resize(function(){
        		self.resizeFileListHeight();
	        });

	        $(window).unload(function () {
	            $("object").parent().remove();//页面卸载或跳转前先移除掉flash，防止ie8报错  
	        });
			
			// 安装彩云PC客户端
			/*$("#setupDiskTool").click(function(event){
				var isrm = 0;
				if (top.isRichmail) {
                    isrm = 1;
                } else {
                    isrm = 0;
                }
                var diskResourcePath = 'http://images.139cm.com/rm/newnetdisk4/';
                var path = top.SiteConfig.disk;
                //window.open(path+"/wp.html?jsres=" + escape(diskResourcePath) + "&res=" + 'http://images.139cm.com/rm/richmail' + "&isrm=" + isrm, "virtualDiskHome");
				//彩云页面下载，需要统计积分，带sid过去
				var url = path+"/wp.html?jsres=" + $T.Html.encode(diskResourcePath) + "&res=" + 'http://images.139cm.com/rm/richmail' + "&isrm=" + isrm;
				url = url + "&sid=" + ($T.Url.queryString("sid") || top.sid);
                window.open(url, "virtualDiskHome");
			});*/

            this.registerCloseTabEvent();
        },
		render: function(){
			var self = this;
				//左边导航
			self.leftbarView = new M2012.Disk.View.Leftbar({model : self.model});
			top.leftbarView = self.leftbarView;
			if(self.model.get("break")){
				//	return;
			}
            self.getIndexDisk(function(){
    			self.statusView = new M2012.Disk.View.Statusbar({model : self.model});
    			self.statusView.render();
    			self.statusView.initEvents();
    			
    			self.commandView = new M2012.Disk.View.Command({model : self.model});
				
				//顶部导航
    			self.toolbarView = new M2012.Disk.View.Toolbar({model : self.model, parentView: self});
				top.toolbarView = self.toolbarView;
    			self.toolbarView.render();

		    	self.fileListView = new M2012.Disk.View.Filelist({model : self.model, parentView: self});// 列表模式
		    //	self.fileListView.render();
			//	self.model.trigger('createPager');
		    	self.fileThumbnailView = new M2012.Disk.View.Filethumbnail({model : self.model});// 缩略图模式
				self.fileThumbnailView.render();
				
				self.fileThumbnailImageView = new M2012.Disk.View.FileThumbnailImageView({model : self.model});

                self.renameView = new M2012.Disk.View.Rename({model: self.model});//重命名视图

                self.createDirView = new M2012.Disk.View.CreateDir({model: self.model});//创建文件夹视图
                
                /*self.musicView = new M2012.Disk.View.Music({model: self.model}); // 音乐播放视图层
                self.musicView.render();*/
                
                self.resizeFileListHeight();
				new M2012.Disk.View.ContextMenu({model: self.model, fileListView : self.fileListView});//鼠标右键
				self.model.getisShareSiChuan(function(res){
					console.log(res);
				});
            });
		},

        // 初始化一些参数，比如model中的一些提示语
        initParams: function(){
            var textTip = top.M139.Text.Utils.getFileSizeText(this.model.limitSizeSend);

            this.model.tipWords.LIMIT_SIZE_SEND = top.M139.Text.Utils.format(this.model.tipWords.LIMIT_SIZE_SEND, [textTip]);
        },

        registerCloseTabEvent: function(){
            top.$App.on("closeTab", this.closeTabCallback);
        },

        closeTabCallback: function (args) {
            if (!top || !top.$App) return;
            if (args.name && args.name.indexOf("diskDev") > -1) {
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
            var fileList = $("#fileList");

            if (fileList.length == 0) {
                return;
            }

            var listOffset = fileList.offset();
            var iframeHeight = $("#outArticle").height();
            var listTop = listOffset.top;
            $("#fileList").height(iframeHeight - listTop);
			$("#diskPicModle").height(iframeHeight - 63);
        },
		showGuidefirstTime : function(){
			var bgB = '<div class="backgroundBlock" id="bgB"></div>';
			var firstGuideTips = '<span class="promptOne" id="firstGuideTips"><a href="javascript:void(0);" id="firstGuideTipsClose"></a></span>';
						//为undefined的时候说明是第一次 为1的时候说明弹出过，不弹了。
						if(0 && !top.$App.getUserCustomInfo("sfgt")){ //屏蔽
							$(bgB).appendTo(top.document.body);
							$(firstGuideTips).appendTo(top.document.body);
							top.$("#firstGuideTipsClose").click(function(){
								top.$("#bgB").hide();
								top.$("#firstGuideTips").hide();
								top.$("#scContainer").hide();
								top.$App.setUserCustomInfoNew({"sfgt":1})
							});	
			}
		},
		getIndexDisk : function(callback){
            var self = this;
			top.firstEnterNet = true;
			top.M139.UI.TipMessage.show("正在加载中...");
            self.model.getIndexDisk(function(result){
                var responseData = result.responseData;
				var responseData = eval("(" + result.responseText + ")");
                if(responseData && responseData.code == 'S_OK'){
					top.M139.UI.TipMessage.hide();
                    var dataInit = responseData['var']["init"];
                    var baseInfo = dataInit.baseInfo;

                    self.model.set('diskInfo', baseInfo);
                    self.model.set('isMcloud', dataInit.isMcloud || "0");
					self.model.set('isShareSiChuan', dataInit.isShareSiChuan || "0");
					self.model.set('totalSize',baseInfo.fileNum);
					if(baseInfo["139MailId"]){
						self.model.set('139MailId', baseInfo["139MailId"]);
						self.model.set('curDirType','1');
					}
                    if(!self.model.get('curDirType')){
                        self.model.set('curDirType',baseInfo.rootDirType+'');
                    }
					/*
					if(self.model.get("isShareSiChuan") == "1"){
					//	alert("我是四川用户");
						var guideTips = ['<div id="layer_mask01" class="layer_mask" style="overflow: hidden; z-index: 5009; opacity: 0.5;"></div>',
											'<div class="shareLay" id="guideTips">',
											'<div class="container">',
												'<img src="/m2012/images/module/FileExtract/f.png">',
												'<a href="javascript:void(0);" id="guideTipsClose" class="closeBtn" title="关闭">x</a>',
												'<a href="javascript:void(0);" id="guideTipsEnter" class="txtInfoClick">云享四川 专享资源</a>',
											'</div>',
										'</div>'].join("");
						//为undefined的时候说明是第一次 为1的时候说明弹出过，不弹了。
						if(!top.$App.getUserCustomInfo("yunxiangsc")){
							$(guideTips).appendTo(top.document.body);
								top.$("#guideTipsClose").click(function(){
									top.$("#guideTips").hide();
									top.$("#layer_mask01").hide();
									top.$App.setUserCustomInfoNew({"yunxiangsc":1})
								});
								top.$("#guideTipsEnter").click(function(){
									top.$("#guideTips").hide();
									top.$App.setUserCustomInfoNew({"yunxiangsc":1});
									top.$("#layer_mask01").hide();
									top.$App.show('diskShare');
								});		
						}
						
					}*/
					self.model.diskAllInfo = result.responseData['var'];
					self.model.set('fileList', self.model.diskAllInfo.fileList);
                    callback && callback();
                    self.showGuidefirstTime();
                    // 判断是否从其他模块接收keyword参数，如果有则进入搜索界面
                    if(self.model.inputPara.keyword){
                    	$("#search").click();
                    	return;
                    }
                    
                    // 判断是否从其他模块接收dirId参数，如果有则进入指定目录，没有则进入彩云根目录
                    if(!self.model.get('curDirId')){
                        var initializeDirid = self.model.getInitializeDirid();
                        if(initializeDirid && initializeDirid != self.model.getRootDir()){
							if(!top.firstEnterNet){
								self.getDirectorys(function(){
									self.model.set('curDirId', initializeDirid);
								});
							}else{
								self.model.directorys = responseData['var']["allDirectorys"];
								self.model.setDirProperties(self.model.directorys);
								self.model.set('curDirId', initializeDirid);
							}
                            
                        }else{
							self.model.directorys = responseData['var']["allDirectorys"];
							self.model.setDirProperties(self.model.directorys);
                            self.model.set('curDirId', initializeDirid);
                        }
                    }
                }else{
					top.M139.UI.TipMessage.show("加载失败",{delay: 1000});
                    self.logger.error("getDiskInit returndata error", "[disk:init]", result);
                }
//                self.getDirectorys();
            });


        },
        // 获取彩云信息（容量，文件数量等）
        getDiskInit : function(callback,args){
            var self = this;
            args = args || {};
            if (!args.notips) {
                top.M139.UI.TipMessage.show("正在加载中...");
            }
            self.model.getDiskInit(function(result){
                var responseData = result.responseData;
                if(responseData && responseData.code == 'S_OK'){
					top.M139.UI.TipMessage.hide();
                    var dataInit = responseData['var'];
                    var baseInfo = dataInit.baseInfo;

                    self.model.set('diskInfo', baseInfo);
                    self.model.set('isMcloud', dataInit.isMcloud || "0");
					self.model.set('isShareSiChuan', dataInit.isShareSiChuan || "0");
					if(baseInfo["139MailId"]){
						self.model.set('139MailId', baseInfo["139MailId"]);
						self.model.set('curDirType','1');
					}
                    if(!self.model.get('curDirType')){
                        self.model.set('curDirType',baseInfo.rootDirType+'');
                    }/*
					if(self.model.get("isShareSiChuan") == "1"){
					//	alert("我是四川用户");
						var guideTips = ['<div id="layer_mask01" class="layer_mask" style="overflow: hidden; z-index: 5009; opacity: 0.5;"></div>',
											'<div class="shareLay" id="guideTips">',
											'<div class="container">',
												'<img src="/m2012/images/module/FileExtract/f.png">',
												'<a href="javascript:void(0);" id="guideTipsClose" class="closeBtn" title="关闭">x</a>',
												'<a href="javascript:void(0);" id="guideTipsEnter" class="txtInfoClick">云享四川 专享资源</a>',
											'</div>',
										'</div>'].join("");
						//为undefined的时候说明是第一次 为1的时候说明弹出过，不弹了。
						if(!top.$App.getUserCustomInfo("yunxiangsc")){
							$(guideTips).appendTo(top.document.body);
								top.$("#guideTipsClose").click(function(){
									top.$("#guideTips").hide();
									top.$("#layer_mask01").hide();
									top.$App.setUserCustomInfoNew({"yunxiangsc":1})
								});
								top.$("#guideTipsEnter").click(function(){
									top.$("#guideTips").hide();
									top.$App.setUserCustomInfoNew({"yunxiangsc":1});
									top.$("#layer_mask01").hide();
									top.$App.show('diskShare');
								});		
						}
						
					}*/
                    callback && callback();
                    self.showGuidefirstTime();
                    // 判断是否从其他模块接收keyword参数，如果有则进入搜索界面
                    if(self.model.inputPara.keyword){
                    	$("#search").click();
                    	return;
                    }
                    
                    // 判断是否从其他模块接收dirId参数，如果有则进入指定目录，没有则进入彩云根目录
                    if(!self.model.get('curDirId')){
                        var initializeDirid = self.model.getInitializeDirid();
                        if(initializeDirid && initializeDirid != self.model.getRootDir()){
                            self.getDirectorys(function(){
                                self.model.set('curDirId', initializeDirid);
                            });
                        }else{
                            self.model.set('curDirId', initializeDirid);
                        }
                    }
                }else{
					top.M139.UI.TipMessage.show("加载失败",{delay: 1000});
                    self.logger.error("getDiskInit returndata error", "[disk:init]", result);
                }
//                self.getDirectorys();
            });


        },

        // 初始化模型层数据
        getDirectorys : function(callback){
			var self = this;
            self.model.getDirectorys(function(result){
             if(result.responseData && result.responseData.code == 'S_OK'){
					self.model.directorys = result.responseData['var'].directorys;
                    self.model.setDirProperties(self.model.directorys);
                    callback && callback();
				}else{
					self.logger.error("getDirectorys returndata error", "[disk:getDirectorys]", result);
				}
		    });
        },
		// 取目录下的子文件夹及文件
		getFiles : function(callback, options){
			var self = this;
		    var options = {dirid : options.dirid, dirType : options.dirType};
		    self.model.getDirFilesByPage(function(result){
				if(result.responseData && result.responseData.code == 'S_OK'){
                    self.model.diskAllInfo = result.responseData['var'];
					/*
					var data = self.model.diskAllInfo.files;
					var currentId = "";
					var currentObj = null;
					if(self.first){
						$.each(data, function(){
							if(this.name == "139邮箱"){
								currentId = this.id;
								currentObj = this;
								return false;
							}	
						});
						self.first = false;
						if(currentId){
							options = {dirid : currentId, dirType : 1};
							self.model.set('curDirId', currentId); //当前目录
							$("#navContainer").append('<span class="f_st">&nbsp;&gt;&nbsp;</span><span>139邮箱</span>');
							currentObj.parentDirectoryId = options.dirid;//需要父目录
							self.model.setParentDirs(currentObj);
							self.getFiles(callback, options);
						}
						return;
					}*/
					self.model.set('fileList', self.model.diskAllInfo.files);
					self.model.set('totalSize', self.model.diskAllInfo.totalSize);
                    callback && callback();
                //    self.getDirectorys();   //调目录接口（用户操作当前位置）
				}else{
					self.logger.error("getFiles returndata error", "[disk:fileList]", result);
				}
		    }, options);
		}
    }));
})(jQuery, _, M139);

