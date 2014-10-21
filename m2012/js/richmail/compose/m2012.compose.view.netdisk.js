/**
 * @fileOverview 彩云视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Compose.View.NetDisk', superClass.extend(
	/**
	 *@lends M2012.Compose.View.prototype
	 */
	{
		el : "body",
		name : "netDisk",
		template: ['<!--[if lt ie 8]>',
				   '<div style="+zoom:1;"><![endif]-->', 
				'<table class="savefiletab">',
                     '<tbody>',
                     	 '<!--item start-->',
                         '<tr>',
                         '<td class="td1"><input fid="$fileid" type="checkbox"></td>',
                         '<td class="td2" title="@getFullFileName()"><i class="@getFileIconClass()"></i>@getShortFileName()</td>',
                         '<td class="td3">@getFileSize()</td>',
                         '<td class="td4">@getUploadDate()</td></tr>',
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
        	});
        	// 绑定表头排序单击事件
        	$("#aFileName").click(function(event){
        		var target = $(event.target);
        		self.sort({jEle : target, field : 'fileName', dataSource : self.model.dataSource});
        		
        		$("#aFileSize > i").attr('class','');
        		$("#aFileExpire > i").attr('class','');
        	});
        	$("#aFileSize").click(function(event){
        		var target = $(event.target);
        		self.sort({jEle : target, field : 'fileSize', dataSource : self.model.dataSource});
        		
        		$("#aFileName > i").attr('class','');
        		$("#aFileExpire > i").attr('class','');
        	});
        	$("#aFileExpire").click(function(event){
        		var target = $(event.target);
        		self.sort({jEle : target, field : 'uploadDate', dataSource : self.model.dataSource});
        		
        		$("#aFileName > i").attr('class','');
        		$("#aFileSize > i").attr('class','');
        	});
        	// 为所有的单选框绑定单击事件
        	$("#fileList").click(function(event){
        		var target = $(event.target);
        		if(target.is("input[type='checkbox']")){
        			var selectedCount = $("#fileList").find("input:checkbox:checked[fid]").size();
        			$("#fileCount").html(selectedCount);
        			if(selectedCount == self.model.dataSource.length){
        				$("#allOrNone").attr('checked', true);
        			}else{
        				$("#allOrNone").attr('checked', false);
        			}
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
    		self.reflush(self.model.dataSource);
    		
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
		// 渲染彩云
		render : function (){
		    var self = this;
		    // 设置搜索框默认值
		    $("#keywords").val(self.model.defaultInputValue);
		    var defaultDir = {};
		    // 加载文件夹
		    self.model.getDirs(function(result){
		    	if(result.responseData.code && result.responseData.code == 'S_OK'){
		    		var data = result.responseData['var'];
		    		var dirs = data.sysdirs;
		    		var items = [];
		    		for (var i = 0, len = dirs.length; i < len; i++) {
	                    var dir = dirs[i];
	                    if (dir.dirid == 10) {
	                    	defaultDir = dir;
	                        dir.dirname = "我的彩云";
	                    }
	                    var type = dir.type;
	                    if (type == 1) {// 我的文件夹
							var folderItemsObj = getItemsObj(dir, data.dirs);
							items.push(folderItemsObj);
	                    }else if (type == 3) {//相册
							var photoItemsObj = getItemsObj(dir, data.photodirs);
							items.push(photoItemsObj);
	                    }else if (type == 4) {//音乐
	                    	var musicItemsObj = getItemsObj(dir, data.musicdirs);
							items.push(musicItemsObj);
	                    }
	                }
	                var width = $("#diskDirs").css("width");
	                // 创建菜单
	                M2012.UI.PopMenu.createWhenClick({
						target : $("#diskDirs"),
			            width : width,
			            items : items,
			            top : "200px",
			            left : "200px",
			            onItemClick : function(item){
			                //alert("子项点击");
			            }
			        });
			        self.model.currentDir = defaultDir;
			        // 加载默认文件夹下的文件列表
				    self.getDataSource({id : defaultDir.dirid, type : defaultDir.type}, function(dataSource){
				    	self._renderFileList(dataSource);
				    });
				}else{
					console.log('获取彩云文件夹失败！');
				}
				function getSubDirItems(dirs){
					var subDirItems = [];
					for(var i = 0, len = dirs.length; i < len; i++) {
						var dir = dirs[i];
						var dirItem = {
							text : dir.dirname,
							directoryid : dir.directoryid,
							dirid : dir.dirid,
							type : dir.type,
							onClick : function() {
								self.model.currentDir = this;
								$("#currentDirName").html(this.text);
								self.getDataSource({id : this.dirid, type : this.type}, function(dataSource){
									self._renderFileList(dataSource);
							 		self._resetCheckbox();
							    });
							}
						};
						subDirItems.push(dirItem);
					}
					return subDirItems;
				}
				function getItemsObj(superDir, subDirs){
					var itemsObj = {};
                	if(subDirs.length > 0){
                		var myDirItems = getSubDirItems(subDirs);
                        itemsObj = {
							text : superDir.dirname,
							items : myDirItems,
							onClick : function() {
								self.model.currentDir = superDir;
								$("#currentDirName").html(this.text);
								self.getDataSource({id : superDir.dirid, type : superDir.type}, function(dataSource){
									self._renderFileList(dataSource);
							 		self._resetCheckbox();
							    });
							}
						}
                	}else{
                		itemsObj = {
							text : superDir.dirname,
							onClick : function() {
								self.model.currentDir = superDir;
								$("#currentDirName").html(this.text);
								self.getDataSource({id : superDir.dirid, type : superDir.type}, function(dataSource){
									self._renderFileList(dataSource);
							 		self._resetCheckbox();
							    });
							}
						}
                	}
                	return itemsObj;
				}
		    });
		},
		// 渲染文件列表
		_renderFileList : function(dataSource){
			var self = this;
			if(dataSource && dataSource.length == 0){
				$("#fileList").html('<div class="pt_20 ta_c">该文件夹下没有文件</div>');
			}else{
				self.repeater.Functions = self.model.renderFunctions;
		        var html = self.repeater.DataBind(dataSource);
		 		$("#fileList").html(html);
			}
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
			var curdir = self.model.currentDir;
		    self.getDataSource({id : curdir.dirid, type : curdir.type}, function(dataSource){
		    	self._renderFileList(dataSource);
		    });
		    
		    $("#searchResunt").hide();
		    self._resetCheckbox();
		},
		// 获取指定目录下的彩云文件
		getDataSource : function(dir ,callback){
			var self = this;
			self.model.fetchDiskFiles(dir, function(result){
				var fileList = [];
				if(result.responseData.code && result.responseData.code == 'S_OK'){
					fileList = result.responseData['var']['files'];
				}else{
					console.log('获取彩云文件失败！');
				}
				// 过滤文件并格式化上传时间
				self.model.setDataSource(fileList);
				// 默认按照上传时间排序
				self.model.sort({field : 'uploadDate', dataSource : self.model.dataSource});
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
            	if($.inArray(file.fileid + '', selectedFids) != -1){
                	files.push(file);
                }
            }
            // 统一数据格式
            files = $.map(files, function(n) {
                    return {
                        fileId: n.fileid,
			            fileName: n.filename || n.srcfilename,
			            state: "success",
			            fileSize: n.filesize,
			            fileType: "netDisk",
			            fileGUID: n.filerefid
                    }
                });
            top.$App.trigger('obtainDiskFiles', files);
		},
		searchFiles : function(){
			var self = this;
			var keywords = $.trim($("#keywords").val());
			if(!keywords){
				return;
			}
			var options = {
				directoryId : self.model.currentDir.dirid,
				keyword : keywords,
				includeChild : 1
			}
			self.model.search(options, function(result){
				var fileList = [];
				if(result.responseData.code && result.responseData.code == 'S_OK'){
					fileList = result.responseData['var']['files'];
				}else{
					console.log('搜索彩云文件失败！');
				}
				// 过滤文件并格式化上传时间
				self.model.setDataSource(fileList);
				self.reflush(self.model.dataSource);
			});
			
			$("#searchResunt").show();
			self._resetCheckbox();
		},
		closeSearchTip : function(event){
			var self = this;
			$(".nosearchend").hide();
			// self.restore();
		}
	}));
	netDiskModel = new M2012.Compose.Model.NetDisk();
    netDiskView = new M2012.Compose.View.NetDisk({model : netDiskModel});
})(jQuery, _, M139);
