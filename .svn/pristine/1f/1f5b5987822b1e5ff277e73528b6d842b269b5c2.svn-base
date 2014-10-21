/**
 * @fileOverview 超大附件主视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.UI.SelectFile.View.Main', superClass.extend(
	/**
	 *@lends M2012.UI.Dialog.SelectFile.View
	 */
	{
		el : "body",
		name : "M2012.UI.Dialog.SelectFile.View",
        fileListTemplate : '<iframe frameborder="0" scrolling="no" style="width:{width};border:0;height:{height};display:block" src="{url}" id="{id}"></iframe>',
		events:{
			"click #localFile" : "showLocalFile",
			"click #disk" : "showDisk",
			"click #cabinet" : "showCabinet",
			"click #confirm" : "confirm"
		},
		initialize : function(options) {
			this.model = options.model;
			return superClass.prototype.initialize.apply(this, arguments);
		},
		initEvents : function(){
        	var self = this;
        	self.model.on("change:viewType", function(){
        		var viewType = self.model.get('viewType');
        		if(viewType === self.model.viewTypes['LOCAL_FILE']){
        			self.switchLocalFileView();
        		}
    			self.rebuildDialog();
		    });
		    self.model.on("change:localFileType", function(){
		    	self.switchLocalFileView();
		    	self.rebuildDialog();
		    });
		    
		    // todo 打开用户上次打开的目录，并选中用户上传选中的文件
		    top.$App.off('selectNetdiskFiles');
        	top.$App.on('selectNetdiskFiles', function(){
	    		var selectedFids = self.model.getDiskFids();
	    		
	    		// 该事件在  m2012.compose.view.netdisk.js 中绑定
	    		if(top && top.$App){
	    			top.$App.trigger('reselectNetdiskFiles', {diskDir : self.model.get('diskDir'), selectedFids : selectedFids});
	    		}
	    	});
	    	
	    	top.$App.off('toggleDiskFiles');
	    	top.$App.on('toggleDiskFiles', function(file){
	    		self.model.toggleDiskFiles(file);
	    		window.diskFileList = self.model.get('diskFileList');
	    	});
	    	
	    	top.$App.off('toggleDiskDir');
	    	top.$App.on('toggleDiskDir', function(dir){
	    		self.model.set('diskDir', dir);
	    		window.diskDir = self.model.get('diskDir');
	    		
	    		self.model.get('diskFileList').length = 0;
	    	});
	    	
	    	// 选中用户上次选中的文件
        	top.$App.on('selectStoragecabinetFiles', function(){
	    		var selectedFids = self.model.getCabinetFids();
	    		if(selectedFids.length == 0){
	    			return;
	    		}
	    		
	    		// 该事件在  m2012.compose.view.storagecabinet.js 中绑定
	    		if(top && top.$App){
	    			top.$App.trigger('reselectStoragecabinetFiles', {selectedFids : selectedFids});
	    		}
	    	});
	    	top.$App.on('toggleSelectedFiles', function(obj){
	    		self.model.toggleSelectedFiles(obj);
	    	});
        },
        
        // 调整选择文件弹出层
        rebuildDialog : function(){
        	var height = $(document.body).height();
    		top.$App.trigger('rebuildSelectFileDialog', {height : height, display : 'block'});
        },
		render : function (){
		    var self = this;
		    self.model.set('localFileType', self.model.localFileTypes['LOCAL_FILE_DEFAULT']);
		    //self.model.set('viewType', self.model.viewTypes['LOCAL_FILE']);
            this.$el.find(".textgray").text(this.model.tipWords["UPLOAD_LARGEATTACH"].format(this.model.maxUploadLargeAttach));
		},
        showLocalFile : function(event) {
        	var self = this;
        	$("#localFile").addClass('on').siblings().removeClass('on');
        	var container = $("#localFileContainer");
        	$("#filesContainer").hide();
        	container.show();
        	
        	self.model.set('viewType', self.model.viewTypes['LOCAL_FILE']);
        	self.switchLocalFileView();
		},
		switchLocalFileView : function(){
			var self = this;
			var localFileType = self.model.get('localFileType');
			var localFileTypes = self.model.localFileTypes;
        	if(localFileType === localFileTypes['LOCAL_FILE_DEFAULT']){
        		
	    		// 为‘添加文件’创建上传组件 ，仅初始化一次
	    		if(!self.model.isCreateBtnUpload){
	    			try{
	    				self.createBtnUpload();
	    				self.model.isCreateBtnUpload = true;
	    			}catch(ex){
	    				console.log('上传组件初始化报错！switchLocalFileView:'+ex);
	    			}
	    		}
	    		
	    		cloneJUploadToMiddle();
    		}
    		if(localFileType === localFileTypes['LOCAL_FILE_LIST']){
    			cloneJUploadToTop();
    		};
    		
    		// 将上传组件克隆到中间
    		function cloneJUploadToMiddle(){
    			var jMiddleUpload = $("#attachList > .addFilesTips");
	    		var jMiddleUploadInput = jMiddleUpload.find('#uploadFileInput');
	    		if(jMiddleUploadInput.size() === 0){
	    			var jUpload = $("#localFileContainer div.topBtn").contents();
	    			jUpload.appendTo("#attachList > .addFilesTips");
	    			$("#localFileContainer div.floatLoadDivTop").attr('class', 'floatLoadDiv');
	    			$("#localFileContainer div.topBtn").removeClass('topBtnOn');
	    		}
	    		
	    		$("#localFileContainer div.topBtn").hide();
	    		jMiddleUpload.show().siblings('.attaListLi').hide();
    		};
    		
    		// 将上传组件克隆到顶部
    		function cloneJUploadToTop(){
    			var jTopUpload = $("#localFileContainer div.topBtn");
    			var jTopUploadInput = jTopUpload.find('#uploadFileInput');
    			if(jTopUploadInput.size() === 0){
    				var jUpload = $("#attachList > .addFilesTips").contents();
	    			jUpload.appendTo("#localFileContainer div.topBtn");
	    			$("#localFileContainer div.floatLoadDiv").attr('class', 'floatLoadDivTop');
	    			$("#localFileContainer div.topBtn").addClass('topBtnOn');
    			}
    			
    			jTopUpload.show();
				$("#attachList > .addFilesTips").hide().siblings('.attaListLi').show();
    		};
		},
		showDisk : function(event) {
        	var self = this;
        	$("#disk").addClass('on').siblings().removeClass('on');
        	
        	var container = $("#filesContainer");
        	var width = container.css('width');
        	var html = $T.Utils.format(self.fileListTemplate, {width : width, height : '345px', url : self.model.urls['DISK_URL'], id : 'diskFiles'});
        	container.html(html);
        	$("#localFileContainer").hide();
        	container.show();
        	
        	// 隐藏暂存柜页面底部的确认按钮
        	// top.$App.trigger('hideNetdiskBtn');
        	
        	self.model.set('viewType', self.model.viewTypes['DISK']);
		},
		showCabinet : function(event) {
        	var self = this;
        	$("#cabinet").addClass('on').siblings().removeClass('on');
        	
        	var container = $("#filesContainer");
        	var width = container.css('width');
        	var html = $T.Utils.format(self.fileListTemplate, {width : width, height : '345px', url : self.model.urls['CABINET_URL'], id : 'cabinetFiles'});
        	container.html(html);
        	$("#localFileContainer").hide();
        	container.show();
        	
        	// 隐藏暂存柜页面底部的确认按钮
        	//top.$App.trigger('hideStoragecabinetBtn');
        	
        	self.model.set('viewType', self.model.viewTypes['CABINET']);
		},
		
		// 创建上传组件
		createBtnUpload : function(){
        	var self = this;
            var UploadModel = new M2012.Fileexpress.Cabinet.Model.Upload({type:"file"});

            self.UploadApp = new UploadFacade({
                btnUploadId: "uploadFileInput",//上传按钮dom元素的id
                fileNamePre: "filedata",
                model: UploadModel
            });
            var UploadApp = self.UploadApp;

            UploadApp.on("select", function (options) {
                var fileList = options.fileList;
				var uploadType = this.currentUploadType;
                if (this.model.filterFile(fileList, uploadType)) {
                    this.model.trigger("renderList", {fileList: fileList});
                    this.setFileList(fileList);

                    if (this.currentUploadType != this.uploadType.FLASH) {
                        self.model.set('localFileType', self.model.localFileTypes['LOCAL_FILE_LIST']);
                    }
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
                var currentFile = this.model.get("currentFile");
                var clientTaskno = currentFile.clientTaskno;
                var responseText = currentFile.responseText;

                this.model.completeHandle(clientTaskno, responseText, function(){//上传成功
                    self.model.trigger("complete");

                    self.uploadHandle(function(){//继续传下个文件
                        self.model.trigger("error");
                    }, function(){
                        self.model.trigger("getFileMd5");
                    });
                }, function(msg){//上传失败
                    self.model.trigger("error");
                }, self);
            });

            UploadApp.on("error", function(){
                var currentFile = this.model.get("currentFile");
                var clientTaskno = currentFile.clientTaskno;
                var state = currentFile.isContinueUpload;

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

            self.uploadFileListView = new M2012.UI.SelectFile.View.UploadFileList({
                selector: "#attachList",
                controler: UploadApp,
                model: UploadModel
            });
            self.uploadFileListView.render();
        },
		confirm : function(){
			try{
				var self = this;
	    		self.model.set('localFileList', self.UploadApp.model.fileUploadSuc.concat());
	    		
	    		self.model.setComeFrom(self.model.get('localFileList'), self.model.viewTypes['LOCAL_FILE']);
	    		self.model.setComeFrom(self.model.get('diskFileList'), self.model.viewTypes['DISK']);
	    		self.model.setComeFrom(self.model.get('cabinetFileList'), self.model.viewTypes['CABINET']);
	    		
	    		var files = self.model.get('localFileList').concat(self.model.get('diskFileList')).concat(self.model.get('cabinetFileList'));
	    		top.$App.trigger('obtainSelectedFiles', files);
	    		
	    		if(self && self.model){
		    		self.model.get('localFileList').length=0;
	    			self.model.get('diskFileList').length = 0;
	    			self.model.get('cabinetFileList').length = 0;
	    		}
			}catch(ex){
				console.log('选择文件报错！confirm:'+ex);
			}
		}
	}));
})(jQuery, _, M139);
