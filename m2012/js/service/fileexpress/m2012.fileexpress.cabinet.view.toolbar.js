/**
 * @fileOverview 文件快递暂存柜状态栏视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Fileexpress.Cabinet.View.Toolbar', superClass.extend(
	/**
	 *@lends M2012.Fileexpress.Cabinet.View.prototype
	 */
	{
		el : "body",
		name : "M2012.Fileexpress.Cabinet.View.Toolbar",
		events : {
			"click #download" : "download", 
			"click #sendToMail" : "sendToMail", 
			"click #sendToPhone" : "sendToPhone", 
			"click #renew" : "renew", 
			"click #saveToDisk" : "saveToDisk", 
			"click #rename" : "rename", 
			"click #deleteFile" : "deleteFile",
			"click #sortDock": "showSortTable"
		},
		initialize : function(options) {
			var self = this;
			this.model = options.model;
			this.initEvents();
			return superClass.prototype.initialize.apply(this, arguments);
		},
		initMoreBtns : function(flag){ //已关闭更多按钮
			var self = this;
			$("#more").html("");
			var menuItems = [
					{
                        text: "发送到手机",
                        onClick: function(){ self.sendToPhone();}
                    },
                    {
                        text: "重命名",
                        onClick: function(){ self.rename();}
                    },
                    {
                        text: "删除",
                        onClick: function(){ self.deleteFile();}
                    }
                ];
			if(!flag){
				menuItems = [menuItems[2]];
			}else{
				menuItems = [menuItems[1],menuItems[2]];
			}
			M2012.UI.MenuButton.create({
				text:"更多",
				container:$("#more"),
				leftSibling:false, //左边还有按钮，影响样式
				rightSibling:false, //右边还有按钮，影响样式
				menuItems:menuItems
			});
			//修改样式 默认的button已经修改
		//	$("#more > a").removeClass("btnTb").addClass("btn ml_10");
		//	$("#more span").replaceWith('<em>更多</em><i class="triangle t_globalDown"></i>');
		},
		initEvents : function() {
			var self = this;
			$("#sendToPhone").hide();
			//$("#rename").hide();
			//$("#deleteFile").hide();
			$("#more").hide();
			//this.initMoreBtns(1);
			// 关闭小工具引导层
			$("#closeSetupTool").click(function(event){
				$("#setupToolContainer").hide();
			});

			// 绑定排序菜单单击事件 todo
			var sortTypes = self.model.sortTypes;
        	$("#sortMenus li[name='fileName']").click(function(event){
        		self.model.set('sortType', sortTypes['FILE_NAME']);
        		self.model.set('sortIndex', -self.model.get('sortIndex'));
        		
        		$("#sortMenus").hide();
        	});
        	$("#sortMenus li[name='createTime']").click(function(event){
        		self.model.set('sortType', sortTypes['CREATE_TIME']);
        		self.model.set('sortIndex', -self.model.get('sortIndex'));
        		
        		$("#sortMenus").hide();
        	});
        	$("#sortMenus li[name='expiryDate']").click(function(event){
        		self.model.set('sortType', sortTypes['EXPIRY_DATE']);
        		self.model.set('sortIndex', -self.model.get('sortIndex'));
        		
        		$("#sortMenus").hide();
        	});
        	$("#sortMenus li[name='downloadTimes']").click(function(event){
        		self.model.set('sortType', sortTypes['DOWNLOAD_TIMES']);
        		self.model.set('sortIndex', -self.model.get('sortIndex'));
        		
        		$("#sortMenus").hide();
        	});
        	$("#sortMenus li[name='fileSize']").click(function(event){
        		self.model.set('sortType', sortTypes['FILE_SIZE']);
        		self.model.set('sortIndex', -self.model.get('sortIndex'));
        		
        		$("#sortMenus").hide();
        	});

            //上传按钮初始化
//            try {
                this.createBtnUpload();
//            } catch (ex) {}
		},
        createBtnUpload: function(){
            var This = this;
            mainView.uploadModel = new M2012.Fileexpress.Cabinet.Model.Upload({type:"file"});
        //    parent.$("#floatLoadDiv").html("");//clear
            window.isCabinet = true;
            window.UploadApp = new UploadFacade({
                containerWindow:parent,
                btnUploadId: parent.document.getElementById("uploadFileInput") || parent.document.getElementById("floatLoadDiv"),//上传按钮dom元素的id
                fileNamePre: "filedata",
                model: mainView.uploadModel
            });
            
            parent.InstanceUpload = window.InstanceUpload;

            UploadApp.on("select", function (options) {
                var fileList = options.fileList;
                var uploadType = this.currentUploadType;

                if (this.model.filterFile(fileList, uploadType)) {
                    this.model.trigger("renderList", {fileList:fileList});
                    this.setFileList(fileList);
                }
            });

            UploadApp.on("prepareupload", function(){
                var self = this;

                this.uploadHandle(function(){
                    self.model.trigger("error");
                }, function(){
                    self.model.trigger("getFileMd5");
                });
            });

            UploadApp.on("loadstart", function(){
                this.model.trigger("loadstart");
            });

            UploadApp.on("progress", function(){
                this.model.trigger("progress");
            });

            UploadApp.on("md5progress", function(){
                this.model.trigger("md5Progress");
            });

            UploadApp.on("complete", function(){
                var self = this;
                var UploadModel = self.model;
                var currentFile = UploadModel.get("currentFile");
                var clientTaskno = currentFile.clientTaskno;
                var responseText = currentFile.responseText;

                UploadModel.completeHandle(clientTaskno, responseText, function (thumbUrl) {//上传成功
                    thumbUrl && (UploadModel.get("currentFile").thumbUrl = thumbUrl);
                    UploadModel.trigger("complete");
                    UploadModel.trigger("autoSaveDisk");
                    self.uploadHandle(function(){//继续传下个文件
                        UploadModel.trigger("error");
                    }, function(){
                        UploadModel.trigger("getFileMd5");
                    });
                }, function(msg){//上传失败
                    self.model.trigger("error");
                }, self);
				$("#toolBar").show();
            });

            UploadApp.on("error", function(){
                var self = this;
                var currentFile = this.model.get("currentFile");
                var clientTaskno = currentFile.clientTaskno;
                var state = currentFile.isContinueUpload;

                behaviorUploadErr();
                if (!state) {
                    this.model.trigger("error");
                    return;
                }

                this.uploadHandle(function(){//续传
                    self.model.trigger("error");
                }, function(){
                    self.model.trigger("getFileMd5");
                }, clientTaskno);
            });

            This.uploadFileListView = new M2012.Fileexpress.Cabinet.View.UploadFileList({
                listSelector: "#fileList tbody",
			//	listSelector : frames["ifbg"].document.getElementById("fileList").getElementsByTagName("tbody")[0],
                iconSelector: "#fileList ul",
			//	iconSelector : frames["ifbg"].document.getElementById("fileList").getElementsByTagName("ul")[0],
                controler: UploadApp,
                model: mainView.uploadModel,
                subModel: This.model,
                scrollSelector: "#fileList"
            });
            This.uploadFileListView.render();

            function behaviorUploadErr(){
                mainView.uploadModel.logger.error(mainView.uploadModel.curConditionType + " upload distributed error", "[fastuploadsvr.fcg]");
            }
        },
		render : function() {
			var self = this;
			if(!self.model.isSetupMailTool() && self.model.get('isMailToolShow')){
				//$("#maxUploadSize").html(self.model.getMaxUploadSize());
		 		$("#setupToolContainer").show();
		 		self.model.set('isMailToolShow', 0);// 只提示一次
		 		// setTimeout(function(){
		 			// $("#setupToolContainer").hide();
		 		// }, 5000);
		 	}
		 	self.model.trigger("createPager", null);
		},
		upload : function(event) {
			var self = this;
			self.doCommand(self.model.commands.UPLOAD);
		},
		download : function(event) {
			var self = this;
			BH({key : "fileexpress_cabinet_download"});
			
			self.doCommand(self.model.commands.DOWNLOAD);
		},
		sendToMail : function(event) {
			var self = this;
			self.doCommand(self.model.commands.SEND_TO_MAIL);
			event.preventDefault();
		},
		sendToPhone : function(event) {
			var self = this;
			self.doCommand(self.model.commands.SEND_TO_PHONE);
			event.preventDefault();
		},
		renew : function(event) {
			var self = this;
			self.doCommand(self.model.commands.RENEW);
		},
		saveToDisk : function(event) {
			var self = this;
			self.doCommand(self.model.commands.SAVE_TO_DISK);
		},
		rename : function(event) {
			var self = this;
			if(self.model.get('isBtnActivate')){
				self.doCommand(self.model.commands.RENAME);
			}else{
				top.M139.UI.TipMessage.show(self.model.tipWords.ONLY_RENAME_ONE, { delay: 3000, className: "msgYellow" }); 
			}
		},
		deleteFile : function(event) {
			var self = this;
			self.doCommand(self.model.commands.DELETE_FILE);
		},
		doCommand : function(command, args) {
			if(!args) {
				args = {};
			}
			args.command = command;
			top.$App.trigger("cabinetCommand", args);
		},
        // todo
		showSortTable : function(event){
			var jSortMenus = $("#sortMenus");
			jSortMenus.css({width : 125});
			
			jSortMenus.show();
			M139.Dom.bindAutoHide({
                action: "click",
                element: jSortMenus[0],
                stopEvent: true,
                callback: function () {
                    jSortMenus.hide();
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
