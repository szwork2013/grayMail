/**
 * @fileOverview 暂存柜视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.UI.SelectFile.View.StorageCabinet', superClass.extend(
	/**
	 *@lends M2012.UI.Dialog.SelectFile.View.StorageCabinet.prototype
	 */
	{
		el : "body",
		name : "M2012.UI.Dialog.SelectFile.View.StorageCabinet",
		template: ['<!--[if lt ie 8]>',
				   '<div style="+zoom:1;"><![endif]-->', 
				'<table class="savefiletab">',
                     '<tbody>',
                     	 '<!--item start-->',
                         '<tr>',
                         '<td class="td1"><input fid="$fid" type="checkbox"></td>',
                         '<td class="td2" title="@getFullFileName()"><i class="@getFileIconClass()"></i>@getShortFileName()</td>',
                         '<td class="td3">@getFileSize()</td>',
                         '<td class="td4">$remain</td></tr>',
                         '<!--item end-->',
                 '</tbody></table>',
                 '<!--[if lt ie 8]></div><![endif]-->'].join(""),
		events:{
			"click #confirm":"addFilesToCompose",
			"click #search":"searchFiles",
			"click .i_u_close":"closeSearchTip"
		},
		initialize : function(options) {
			this.model = options.model;
			this.repeater = new Repeater(this.template);
			this.initEvents();
			this.render();
			return superClass.prototype.initialize.apply(this, arguments);
		},
		initEvents : function(){
        	var self = this;
        	// 绑定搜索框焦点事件
        	$("#keywords").blur(function(){
        		var text = $(this).val();
        		if(!text){
        			$(this).attr('class', 'iText gray');
        			text = self.model.defaultInputValue;
        		}
        		if(text == self.model.defaultInputValue){
        			$("#searchDiv").removeClass('savefile-search-on');
        		}
        		
        		$(this).val(text);
        	}).focus(function(){
        		$("#searchDiv").addClass('savefile-search-on');
        		$(this).removeClass('gray');
        		
        		var text = $(this).val();
        		if(text == self.model.defaultInputValue){
        			$(this).val('');
        		}
        	});
        	// 绑定搜索框键盘事件
        	/*$("#keywords").bind('keyup', function(event){
				var keywords = $(this).val();
				if(keywords && keywords != self.model.defaultInputValue){
					$("#searchDiv").addClass('savefile-search-on');
				}else{
					$(this).blur();
					$("#searchDiv").removeClass('savefile-search-on');
					self.closeSearchTip();
					self.restore();
				}
			});*/
			// 清除输入值的图标绑定单击事件
			$(".i_c-search").click(function(event){
				self.closeSearchTip();
				self.restore();
			});
        	// 绑定全选/反选事件
        	$("#allOrNone").click(function(event){
        		var checked = $(this).attr('checked')?true:false;
            	$("#fileList input:checkbox").attr("checked", checked);
            	
            	var selectedCount = $("#fileList").find("input:checkbox:checked[fid]").size();
        		$("#fileCount").html(selectedCount);

                top.$App.trigger('toggleSelectedFiles', {
                    fileSource: parent.selectFileModel.fileSource["CABINET"],
                    isAllChecked: checked,
                    dataSource : self.model.dataSource
                });
        	});
        	// 绑定表头排序单击事件
        	$("#aFileName").click(function(event){
        		var target = $(event.target);
        		self.sort({jEle : target, field : 'fileName', dataSource : self.model.currentDataSource});
        		
        		$("#aFileSize > i").attr('class','');
        		$("#aFileExpire > i").attr('class','');
        	});
        	$("#aFileSize").click(function(event){
        		var target = $(event.target);
        		self.sort({jEle : target, field : 'fileSize', dataSource : self.model.currentDataSource});
        		
        		$("#aFileName > i").attr('class','');
        		$("#aFileExpire > i").attr('class','');
        	});
        	$("#aFileExpire").click(function(event){
        		var target = $(event.target);
        		self.sort({jEle : target, field : 'expiryDate', dataSource : self.model.currentDataSource});
        		
        		$("#aFileName > i").attr('class','');
        		$("#aFileSize > i").attr('class','');
        	});
        	// 为所有的单选框绑定单击事件
        	$("#fileList").click(function(event){
        		var target = $(event.target);
        		if(target.is("input[type='checkbox']")){
        			var selectedCount = $("#fileList").find("input:checkbox:checked[fid]").size();
        			$("#fileCount").html(selectedCount);
        			if(selectedCount == self.model.currentDataSource.length){
        				$("#allOrNone").attr('checked', true);
        			}else{
        				$("#allOrNone").attr('checked', false);
        			}
        			
        			// todo 该方法在  M2012.UI.Dialog.SelectFile.View 中绑定
        			var fid =  target.attr('fid');
        			var file = self.model.getFileById(fid);
        			top.$App.trigger('toggleSelectedFiles', {
                        fileSource: parent.selectFileModel.fileSource["CABINET"],
                        dataSource: [file]
                    });
        		}
        	});
        	
        	top.$App.on('reselectStoragecabinetFiles', function(args){////////////////////////////////////////////
	    		var selectedFids = args.selectedFids;
	    		$("#fileList input[type='checkbox']").each(function(i){
					var fid = $(this).attr('fid');
					if($.inArray(fid, selectedFids) != -1){
						$(this).attr('checked', true);
					}
				});
				if(top){
	    			top.$App.off('reselectStoragecabinetFiles');
	    		}
	    	});
        },
        /*
         * 表头排序
         * @param options.jEle 表头项对应的JQuery对象
         * @param options.field 表头项对应的排序字段
         * @param options.dataSource 排序数据源
         */
        sort : function(options){
        	var self = this;
        	var jI = getJI(options.jEle);
    		self.model.sort({field : options.field, dataSource : options.dataSource});
    		self.reflush(options.dataSource);
    		
    		var sortClass = jI.attr('class');
    		sortClass = (self.model.sortIndex == 1)?'i_th0':'i_th1';
    		jI.attr('class', sortClass);
    		
    		function getJI(jEle){
    			if(jEle[0].nodeName.toLowerCase() == 'i'){
    				return jEle;
    			}else if(jEle[0].nodeName.toLowerCase() == 'span'){
    				return jEle.siblings('i');
    			}else{
    				return jEle.find('i');
    			}
    		}
        },
		// 渲染暂存柜
		render : function (){
		    var self = this;
		    // 设置搜索框默认值
		    $("#keywords").val(self.model.defaultInputValue);
		    // 加载文件列表
		    self.getDataSource(function(dataSource){
		    	self.model.currentDataSource = dataSource;
		        self.repeater.Functions = self.model.renderFunctions;
		        var html = self.repeater.DataBind(dataSource);
		 		$("#fileList").html(html);
		 		
		 		//top.$App.trigger('selectStoragecabinetFiles');
		 		
		 		reselectFiles();
		 		rebuildCabinetFrame();
		    });
		    
		    // 选中上次选中的文件
		    function reselectFiles(){
		    	// todo 耦合代码
		 		var selectedFiles = parent.cabinetFileList;
		 		var selectedFids = [];
		 		for(var i = 0;i < selectedFiles.length;i++){
		 			selectedFids.push(selectedFiles[i].fid);
		 		}
	    		$("#fileList input[type='checkbox']").each(function(i){
					var fid = $(this).attr('fid');
					if($.inArray(fid, selectedFids) != -1){
						$(this).attr('checked', true);
					}
				});
		    };
		    
		    function rebuildCabinetFrame(){
		    	var jBtn = $("div.boxIframeBtn");
		    	var jBtnHeight = jBtn.height();
		    	jBtn.addClass('hide');
		    	
		    	var jFileList = $("#fileList");
		    	var height = jFileList.height() + jBtnHeight;
		    	jFileList.height(height);
		    };
		},
		// 重置单选按钮，提示文本
		_resetCheckbox : function(){
			$("#allOrNone").attr("checked", false);
        	$("#fileList input:checkbox").attr("checked", false);
    		$("#fileCount").html(0);
		},
		// 刷新界面
		reflush : function(files){
			if(files && files.length == 0){
				$(".nosearchend").show();
			}else{
				$(".nosearchend").hide();
			}
			var self = this;
	        self.repeater.Functions = self.model.renderFunctions;
	        var html = self.repeater.DataBind(files);
	        var divFileList = $("#fileList");
	        var selectedFiles = self.getSelectedFids();
	 		divFileList.html(html);
	 		selectFiles(selectedFiles);
	 		function selectFiles(checkedList){
	 			if (checkedList.length > 0) {
	                $(checkedList).each(function() {
	                    divFileList.find("input:checkbox[fid='{0}']".format(this)).attr("checked", true);
	                });
	            }
	 		}
		},
		// 获取用户选择的文件fid
		getSelectedFids : function(){
			var divFileList = $("#fileList");
			var checkedList = [];
            divFileList.find("input:checkbox:checked[fid]").each(function() {
                checkedList.push(this.getAttribute("fid"));
            });
            return checkedList;
		},
		// 还原文件列表
		restore : function(){
			var self = this;
			$("#keywords").val(self.model.defaultInputValue);
			$("#keywords").attr('class', 'iText gray');
			$("#searchDiv").removeClass('savefile-search-on');
			
			self.model.currentDataSource = self.model.dataSource;
			self.reflush(self.model.currentDataSource);
			
			$("#searchResunt").hide();
			self._resetCheckbox();
		},
		// 获取暂存柜文件
		getDataSource : function(callback){
			var self = this;
			self.model.fetchStorageFiles(function(result){
				var fileList = [];
				if(result.responseData.code && result.responseData.code == 'S_OK'){
					fileList = result.responseData['var']['fileList'];
				}else{
					console.log('获取暂存柜文件失败！');
				}
                self.model.removeFailFile(fileList);
				// 格式化过期时间方便排序,将文件列表保存至model层供排序，查询使用
				self.model.dataSource = self.model.formatExpireDate(fileList);
				// 默认按照过期时间排序
				self.model.sort({field : 'expiryDate', dataSource : self.model.dataSource});
				callback(self.model.dataSource);
		    });
		},
		// 将用户选择的文件列表插入写信页附件列表
		addFilesToCompose : function(event){
			var self = this;
			var selectedFids = self.getSelectedFids();
			var files = [];
            for(var i = 0,len = self.model.dataSource.length;i < len;i++){
            	var file = self.model.dataSource[i];
            	if($.inArray(file.fid, selectedFids) != -1){
                	files.push(file);
                }
            }
            // 统一数据格式
            files = $.map(files, function(n) {
                    return {
                        fileId: n.fid,
			            fileName: n.fileName,
			            state: "success",
			            fileSize: n.fileSize,
			            fileType: "keepFolder"
                    }
                });
            top.$App.trigger('obtainCabinetFiles', files);
		},
		searchFiles : function(){
			var self = this;
			var keywords = $.trim($("#keywords").val());
			if(!keywords){
				return;
			}
			self.model.currentDataSource = self.model.search(keywords);
			self.reflush(self.model.currentDataSource);
			
			$("#searchResunt").show();
			self._resetCheckbox();
		},
		closeSearchTip : function(event){
			var self = this;
			$(".nosearchend").hide();
			// self.restore();
		}
	}));
	storageCabinetModel = new M2012.UI.SelectFile.Model.StorageCabinet();
    storageCabinetView = new M2012.UI.SelectFile.View.StorageCabinet({model : storageCabinetModel});
})(jQuery, _, M139);
