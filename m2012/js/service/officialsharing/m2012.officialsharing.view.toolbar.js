/**
 * @fileOverview 彩云工具栏视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Officialsharing.View.Toolbar', superClass.extend(
	/**
	 *@lends M2012.Disk.View.prototype
	 */
	{
		el : "body",
		name : "M2012.Officialsharing.View.Toolbar",
		events : {
            "click #createDir"  : "createDir",
            "click #download"   : "download",
            "click #play"   	: "play",
            "click #rename"     : "rename",
            "click #share"      : "share",
			"click #delete"     : "deleteDirsAndFiles",
            "click #setCover"   : "setCover",
            "click #postcard"   : "postcard",
            "click #remove"     : "remove",
			"click #sortDock"   : "showSortTable",
			"click #sendFile"   : "sendToMail",
            "click #savetodisk" : "savetodisk"
		},
		initialize : function(options) {
			var self = this;
			this.model = options.model;
            this.parentView = options.parentView;
            this.initEvents();
			return superClass.prototype.initialize.apply(this, arguments);
		},
		initMoreBtns : function(flag){
			var self = this;
			$("#more").html("");
			var menuItems = [
					{
                        text: "分享给好友",
                        onClick: function(){ self.share();}
                    },
                    {
                        text: "移动到",
                        onClick: function(){ self.remove();}
                    },
                    {
                        text: "重命名",
                        onClick: function(){ self.rename();}
                    }
                ];
			if(!flag){
				menuItems = [menuItems[1]];
			}else{
				menuItems = menuItems;
			}
			M2012.UI.MenuButton.create({
				text:"更多",
				container:$("#more"),
				leftSibling:true, //左边还有按钮，影响样式
				rightSibling:false, //右边还有按钮，影响样式
				menuItems:menuItems
			});
			//修改样式 默认的button已经修改
		//	$("#more > a").removeClass("btnTb").addClass("btn ml_10");
		//	$("#more span").replaceWith('<em>更多</em><i class="triangle t_globalDown"></i>');
		},
        initEvents:function () {
            var self = this;
			//顶部按钮
			this.initMoreBtns(1);
            // 关闭小工具引导层
            $("#closeSetupTool").click(function(event){
                $("#setupToolContainer").hide();
            });

            // 绑定排序菜单单击事件
            var sortTypes = self.model.sortTypes;
            $("#sortMenus li[name='fileName']").click(function (event) {
                self.model.set('sortType', sortTypes['FILE_NAME']);
                self.model.set('sortIndex', -self.model.get('sortIndex'));

                $("#sortMenus").hide();
            });
            $("#sortMenus li[name='uploadTime']").click(function (event) {
                self.model.set('sortType', sortTypes['UPLOAD_TIME']);
                self.model.set('sortIndex', -self.model.get('sortIndex'));

                $("#sortMenus").hide();
            });
            $("#sortMenus li[name='fileSize']").click(function (event) {
                self.model.set('sortType', sortTypes['FILE_SIZE']);
                self.model.set('sortIndex', -self.model.get('sortIndex'));

                $("#sortMenus").hide();
            });

            //上传按钮初始化
            this.createBtnUpload();

            self.model.on("change:sortType", function(){// 排序类型
                self.parentView.fileListView.sortByType(); // 排序model层数据
                self.model.trigger("renderFileList");// 重新渲染文件列表
                self.renderSortMenu();// 重新渲染排序菜单
            });
            self.model.on("change:sortIndex", function(){// 排序方式 升序或者降序
                self.parentView.fileListView.sortByType();
                self.model.trigger("renderFileList");
                self.renderSortMenu();
            });
            self.model.on("renderBtns", function () {// 重新渲染工具栏按钮
                self.renderBtns();
            });
            self.model.on("change:isRenameActivate", function(){//工具栏重命名按钮是否激活
				  var isActivate = self.model.get('isRenameActivate');
            //    var jRename = $("#rename");
                if(isActivate){
                    self.initMoreBtns(1); //有 重命名和共享
                }else{
                    self.initMoreBtns(0); //无 重命名和共享
                }
            });
			self.model.on("change:hasSysFolders", function(){//工具栏重命名按钮是否激活
				  var isActivate = self.model.get('hasSysFolders');
            //    var jRename = $("#rename");
                if(isActivate){
                //    $("#sendFile").show(); //有 重命名和共享
				//	$("#delete").show();
				//	$("#more").show();
                }else{
                    $("#sendFile").hide(); //有 重命名和共享
					$("#delete").hide();
					$("#more").hide();
                }
            });
            self.model.on("change:isShareActivate", function(){//工具栏分享按钮是否激活
                var isActivate = self.model.get('isShareActivate');
				if(isActivate){
                    self.initMoreBtns(1); //有 重命名和共享
                }else{
                    self.initMoreBtns(0); //无 重命名和共享
                }
			/*
                var jShare = $("#share");
                if(isActivate){
                    jShare.find('a').show();
                }else{
                    jShare.find('a').hide();
                }
			*/	
            });
			self.model.on("change:hasFolders", function(){//工具栏重命名按钮是否激活
				  var isActivate = self.model.get('hasFolders');
            //    var jRename = $("#rename");
                if(isActivate){
            //        $("#sendFile").show(); //有 重命名和共享
                }else{
                    $("#sendFile").hide(); //有 重命名和共享
                }
            });
            self.model.on("change:isSetCoverActivate", function(){// 工具栏设为封面按钮是否激活
                var isActivate = self.model.get('isSetCoverActivate');
                var jsetCover = $("#setCover");
                if(isActivate){
                    jsetCover.find('a').show();
                }else{
                    jsetCover.find('a').hide();
                }
            });
            self.model.on("change:isPostCardActivate", function(){// 工具栏明信片按钮是否激活
                var isActivate = self.model.get('isPostCardActivate');
                var jPostCard = $("#postcard");
                if(isActivate){
                    jPostCard.find('a').show();
                }else{
                    jPostCard.find('a').hide();
                }
            });
            self.model.on("change:isPlayActivate", function(){// 工具栏明信片按钮是否激活
                var isActivate = self.model.get('isPlayActivate');
                var jPlay = $("#play");
                if(isActivate){
                    jPlay.find('a').show();
                }else{
                    jPlay.find('a').hide();
                }
            });
            self.model.on('change:isCreateBtnShow', function(){// 工具栏新建文件夹按钮是否显示
                var isShow = self.model.get('isCreateBtnShow');
                var jCreateDirBtn = $('#createDir');
                if(isShow){
                    jCreateDirBtn.css('display','none');
                }else{
                    jCreateDirBtn.css('display','block');
                }
            });
        },
		showAll: function(e){
			BH("disk3_getAll");
			$("#disk-main").show();
			$("#iframe-main").hide();
			$("#all").click();
		},
        createBtnUpload: function(){
            
        },
		render : function() {
			var self = this;
			
            var model = self.model;
            if(!model.isSetupMailTool() && model.get('isMailToolShow')){
                //$("#maxUploadSize").html(self.model.getMaxUploadSize());
                model.set('isMailToolShow', 0);// 只提示一次
            }
			model.trigger("createPager", null);
		},
		// 渲染工具栏按钮状态
		renderBtns : function(){
			var self = this,
                model = self.model;
			var selectedCount = self.model.get('selectedDirAndFileIds').length;
			var selectedFolders = self.model.get("selectedDirIds");
			var hasSysFolders = false;
			$.each(selectedFolders, function(){
				if(self.model.isRootDir(this)){
					hasSysFolders = true;
					return false;
				}
			});
			$("#savetodisk").hide();
			if(selectedFolders.length > 0){
				self.model.set('hasFolders', 0);
				 $("#download").hide();
			}else{
				self.model.set('hasFolders', 1);
				$("#download").show();
			}
			if(hasSysFolders){
				self.model.set('hasSysFolders', 0);
			}else{
				self.model.set('hasSysFolders', 1);
			}
        	if(selectedCount > 1){
				self.model.set('isRenameActivate', 0);
				self.model.set('isShareActivate', 0);
                self.model.set('isSetCoverActivate', 0);
                self.model.set('isPostCardActivate', 0);
			}else{
				self.model.set('isRenameActivate', 1);
				self.model.set('isShareActivate', 1);
                self.model.set('isSetCoverActivate', 1);
                
                if(selectedCount === 1 && self.model.get('selectedDirIds').length === 1){ // 目录不支持明信片
                	self.model.set('isPostCardActivate', 0);
                }else{
                	self.model.set('isPostCardActivate', 1);
                }
			}
			var selectedDirCount = self.model.get('selectedDirIds').length;
			if(selectedDirCount > 1){
				self.model.set('isPlayActivate', 0);
			}else{
				self.model.set('isPlayActivate', 1);
			}

            //是否显示新建文件夹按钮
            var curDirLevel = model.get('curDirLevel'),
                curDirType = model.get('curDirType'),
                userDirLimit = model.dirLevelLimit.USER_DIR,
                sysDirLimit = model.dirLevelLimit.SYS_DIR,
                userDirType = model.dirTypes.USER_DIR,
                albumDirType = model.dirTypes.ALBUM,
                musicDirType = model.dirTypes.MUSIC;

            if((curDirLevel >= userDirLimit && curDirType == userDirType) || (curDirLevel == sysDirLimit && curDirType == albumDirType) || (curDirLevel==sysDirLimit && curDirType == musicDirType)){
                self.model.set('isCreateBtnShow', 1);
            }else{
                self.model.set('isCreateBtnShow', 0);
            }
            var $uplaodTxt = $('#upload label');
            var $floatLoadDiv = $('#floatLoadDiv');
            //toolbar根据是相册or音乐or普通目录所显示的工具栏不同
			/*
			if(curDirType == model.dirTypes.ALBUM){
                $('#createDir span').html('新建相册');
                $uplaodTxt.html('上传照片');
                $('#play').hide();
                if(curDirLevel == sysDirLimit){
                    $('#setCover').show();
                }else{
                    $('#setCover').hide();
                    $('#postcard').show();
                    $floatLoadDiv.find('input[name="uploadInput"]').css('width','160px').end().css('width','160px');
                }
            }else if(curDirType == model.dirTypes.MUSIC){
                $('#createDir span').html('新建专辑');
                $uplaodTxt.html('上传歌曲');
                $('#postcard').hide();
//                $('#play').show();
                $floatLoadDiv.find('input[name="uploadInput"]').css('width','160px').end().css('width','160px');
            }else{
                $('#createDir span').html('新建文件夹');
                $('#postcard,#setCover,#play').hide();
                $uplaodTxt.html('上&nbsp;传');
                $floatLoadDiv.find('input[name="uploadInput"]').css('width','160px').end().css('width','160px');
            }
			*/
            
        },
		upload : function(event) {
			var self = this;
			self.doCommand(self.model.commands.UPLOAD);
		},
        download : function(event) {
			var self = this;
			self.doCommand(self.model.commands.DOWNLOAD);
		},
		play : function(play){
			var self = this;
			if(self.model.get('isPlayActivate')){
				self.doCommand(self.model.commands.PLAY);
			}
		},
        createDir : function(event) {
            var self = this;
            self.doCommand(self.model.commands.CREATE_DIR);
            BH({key : "diskv2_createfolder"});
            return false;
        },
        share: function (event) {
            var self = this;

            if (self.model.get('isShareActivate')) {
                self.doCommand(self.model.commands.SHARE);
            }
            return false;
        },
        savetodisk: function(){
            this.doCommand("savetodisk");
        },
		sendToMail : function() {
			var self = this;
			BH("disk3_send");
			self.doCommand(self.model.commands.SEND_TO_MAIL);
		},
		sendToPhone : function() {
			var self = this;
			self.doCommand(self.model.commands.SEND_TO_PHONE);
		},
		remove : function(event) {
			var self = this;
			self.doCommand(self.model.commands.REMOVE);
		},
        setCover : function(event){
            var self = this;
            if(self.model.get('isSetCoverActivate')){
                self.doCommand(self.model.commands.SET_COVER);
            }
        },
        postcard : function(event){
            var self = this;
            if(self.model.get('isPostCardActivate')){
				self.doCommand(self.model.commands.POSTCARD);
			}
        },
		rename : function(event) {
			var self = this;
			BH('caiyunRename');
			if(self.model.get('isRenameActivate')){
				self.doCommand(self.model.commands.RENAME);
			}
            return false;
		},
        deleteDirsAndFiles : function(event) {
			var self = this;
			BH('caiyunDel');
			self.doCommand(self.model.commands.DELETE);
		},
		doCommand : function(command, args) {
            !args && (args = {});
            args.command = command;
            top.$App.trigger("diskCommandMock", args);
		},
		showSortTable : function(event){
			var jSortMenus = $("#sortMenus"),_self = this;;
			jSortMenus.css({width : 125});
			BH('caiyunSort');
			jSortMenus.show();
			M139.Dom.bindAutoHide({
                action: "click",
                element: jSortMenus[0],
                stopEvent: true,
                callback: function () {
                    jSortMenus.hide();
                    _self.model.trigger("renderBtns", null);
                    M139.Dom.unBindAutoHide({ action: "click", element: jSortMenus[0]});
                }
            });
            top.$Event.stopEvent(event);
		},
        // 根据排序类型渲染排序菜单
		renderSortMenu : function(){
			var self = this;
        	var sortType = self.model.get('sortType');
        	var selector = "#sortMenus li[name="+sortType+"]";
	    	var jSortType = $(selector);
	    	
	    	$("#sortMenus li.cur").removeClass('cur').find('em').remove('.downRinking');
	    	
	    	var sortState = self.model.get('sortIndex') == 1?'↑':'↓';
        	jSortType.addClass('cur').find('span').append('<em class="downRinking">'+sortState+'</em>');
		},
		createPager : function() {
			var self = this;
			var pagerContainer = $("#filelist_pager");
			pagerContainer.html("");
			//先清除
			var pageCount = this.model.getPageCount();
			//生成分页
			this.pager = M2012.UI.PageTurning.create({
				styleTemplate : 2,
				container : pagerContainer,
				pageIndex : this.model.get("pageIndex"),
				maxPageButtonShow : 5,
				pageCount : pageCount
			});
			this.pager.on("pagechange", function(index) {
				self.model.set("pageIndex", index);
			});
		}
	}));
})(jQuery, _, M139);
