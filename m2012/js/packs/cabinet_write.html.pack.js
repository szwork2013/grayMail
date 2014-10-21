/**
 * @fileOverview 暂存柜页模型层
 */
 (function(jQuery,Backbone,_,M139){
    var $ = jQuery;
    M139.namespace("M2012.UI.SelectFile.Model.StorageCabinet",Backbone.Model.extend({
		defaults : {
			startNum:0, //获取附件的起始位置
			endNum : 0 //获取附件的结束位置
		},
    	name : 'M2012.UI.SelectFile.Model.StorageCabinet',
        callApi: M139.RichMail.API.call,
        defaultInputValue : '搜索暂存柜',// 搜索框默认值
        sortIndex : -1,// 记录当前排序状态
        /** 
        *暂存柜公共代码
        *@constructs M2012.UI.Dialog.SelectFile.Model.StorageCabinet
        *@param {Object} options 初始化参数集
        *@example
        */
        initialize : function(options){
        	this.dataSource = [];
        	this.currentDataSource = [];
        },
        //获取暂存柜文件
        fetchStorageFiles : function(callback){
        	var self = this;
        	var startNum = self.get('startNum')
        	var data = {actionId : startNum};
        	self.callApi("file:getFiles", data, function(res) {
        		if(callback){
        			callback(res);
        		}
	        });
        },
        renderFunctions : {
			remain : function(){
				var row = this.DataRow;
				var remain = row.remain;
				var arr = remain.split(/天|小时/);
				if(arr[1]){
					return (++arr[0]) + "天";
				}else{
					return arr[0] + "天";
				}
			},
        	getFullFileName : function () {
            	var row = this.DataRow;
            	return row.fileName;
            },
            getShortFileName : function () {
            	var row = this.DataRow;
            	var name = row.fileName;
            	var point = name.lastIndexOf(".");
        		if (point == -1 || name.length - point > 5) return name.substring(0, 18) + "…";
            	return name.replace(/^(.{11}).*(\.[^.]+)$/, "$1…$2");
            	//return row.fileName.length > 20?row.fileName.substr(0, 20):row.fileName;
            },
            getFileSize : function(){
            	var row = this.DataRow;
            	return $T.Utils.getFileSizeText(row.fileSize);
            },
            getFileIconClass : function(){
            	var row = this.DataRow;
            	return $T.Utils.getFileIcoClass2(0, row.fileName);
            }
        },
        // 过滤文件列表
        search : function(keywords){
        	var self = this;
        	var files = self.dataSource.concat();
        	return $.grep(files, function(obj, i){
        		return obj.fileName.toLocaleLowerCase().indexOf(keywords.toLocaleLowerCase()) > -1;
        	});
        },
        /*
         * 表头排序
         * @param options.field 排序字段
         * @param options.dataSource 排序数据源
         * @return 排完序后的文件列表
         */ 
        sort : function(options){
        	var self = this;
        	//设置排序规则
            if (options.field) {
                var sorter = null;
                switch (options.field) {
                    case "fileSize": sorter = function(a, b) { return (a.fileSize - b.fileSize) * self.sortIndex; };
                        break;
                    case "fileName": sorter = function(a, b) { return (a.fileName.localeCompare(b.fileName)) * self.sortIndex; };
                        break;
                    case "remainTimes": sorter = function(a, b) { return (a.sendCount - b.sendCount) * self.sortIndex; };
                        break;
                    case "expiryDate": sorter = function(a, b) { return (a.expiryDate - b.expiryDate) * self.sortIndex; };
                        break;
                }
                options.dataSource.sort(sorter);
                self.sortIndex *= -1;
            }
        },
        // 格式化过期时间
        formatExpireDate : function(dataSource){
    		$(dataSource).each(function() {
                if (typeof (this.expiryDate) == "string") {
                	this.expiryDate = $Date.parse(this.expiryDate);
                }
            });
            return dataSource;
        },
        getFileById : function(id){
        	if(!id){
        		return;
        	}
        	var self = this;
        	for(var i = 0,len = self.dataSource.length;i < len;i++){
            	var file = self.dataSource[i];
            	if(file.fid == id){
            		return file;
            	}
            }
        },
        // 判断文件是否上传成功
        isUploadSuccess: function(fileObj){
            var self = this;
            if(!fileObj){
                return false;
            }
            if(fileObj.state == '0'){ // 旧文件state 0 表示上传成功 ，新文件fileUploadSize == fileSize 表示上传成功
                return true;
            }

            var fileSize = parseInt(fileObj.fileSize, 10);
            var fileUploadSize = parseInt(fileObj.fileUploadSize, 10);
            return fileSize === fileUploadSize ? true : false;
        },
        //去掉上传失败的文件
        removeFailFile: function (fileList) {
            for (var i = 0; i < fileList.length; i++) {
                var item = fileList[i];

                if (!this.isUploadSuccess(item)) {
                    fileList.splice(i, 1);
                    i--;
                }
            }
        },
        /**
        *获取SID值
        */
        getSid: function () {
            var sid = top.$T.Url.queryString("sid");
            return sid;
        },
		toggleSelectedFiles: function (obj) {
            if (!obj) return;

            var self = this;
            var checked = obj.isAllChecked;
            var fileSource = obj.fileSource;

            if (checked != undefined) {//全选/反选
                self.set('cabinetFileList', checked ? obj.dataSource : []);
                return;
            }

            //单选文件
            var selectedFiles = self.get('cabinetFileList');
			if(!selectedFiles){
				return;
			}
            var currentFile = obj.dataSource[0];
            for(var i = 0, len = selectedFiles.length; i < len; i++){
                var fileItem = selectedFiles[i];
                if (currentFile.fid === fileItem.fid) {
                    selectedFiles.splice(i, 1);
                    return;
                }
            }
            selectedFiles.push(currentFile);
		}
    }));
})(jQuery,Backbone,_,M139);
﻿/**
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
				'<table class="listHead newShareTable" cellpadding="0" cellspacing="0">',
                     '<tbody>',
                     	 '<!--item start-->',
                         '<tr>',
                         '<td class="wh1"><input fid="$fid" type="checkbox"></td>',
                         '<td class="" title="@getFullFileName()"><i class="@getFileIconClass() mr_5"></i> @getShortFileName()</td>',
                         '<td class="wh6 gray">@getFileSize()</td>',
                         '<td class="wh6 gray">@remain</td></tr>',
                         '<!--item end-->',
                 '</tbody></table>',
                 '<!--[if lt ie 8]></div><![endif]-->'].join(""),
        listTemplate:['<!--item start-->',
        				'<tr>',
                         '<td class="wh1"><input fid="$mid" type="checkbox"></td>',
                         '<td class="" title="@getFullFileName()"><i class="@getFileIconClass() mr_5"></i> @getShortFileName()</td>',
                         '<td class="wh6 gray">@getFileSize()</td>',
                         '</tr>',
                         '<!--item end-->'].join(""),
		events:{
			"click #confirm":"addFilesToCompose",
			"click #search":"searchFiles",
			"click .i_u_close":"closeSearchTip"
		},
		initialize : function(options) {
			this.model = options.model;
			this.repeater = new Repeater(this.template);
			this.AddRepeater = new Repeater(this.listTemplate);
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
			top.$App.on('toggleSelectedFilesC', function(obj){
	    		self.model.toggleSelectedFiles(obj);
	    	});
        	// 绑定全选/反选事件
        	$("#allOrNone").click(function(event){
        		var checked = $(this).attr('checked')?true:false;
            	$("#fileList input:checkbox").attr("checked", checked);
            	
            	var selectedCount = $("#fileList").find("input:checkbox:checked[fid]").size();
        		$("#fileCount").find("b").html(selectedCount).end().show();
				if(selectedCount == 0){
					$("#fileCount").hide();
				}
                top.$App.trigger('toggleSelectedFilesC', {
                    fileSource: "cabinet",
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
					if(selectedCount !== 0){
						$("#fileCount").find("b").html(selectedCount).end().show();
					}else{
						$("#fileCount").hide();
					}
        			if(selectedCount == self.model.currentDataSource.length){
        				$("#allOrNone").attr('checked', true);
        			}else{
        				$("#allOrNone").attr('checked', false);
        			}
        			
        			// todo 该方法在  M2012.UI.Dialog.SelectFile.View 中绑定
        			var fid =  target.attr('fid');
        			var file = self.model.getFileById(fid);
        			top.$App.trigger('toggleSelectedFilesC', {
                        fileSource: "cabinet",
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
			
			$("#cancel").click(function(){
				top.selectFileDialog3.close();
			});
			self.model.on('change:startNum',function(){
				self.getAttachList();
			});
			//self.bindScroll();
        },
        //绑定滚动事件
        bindScroll :function() {
	        var self = this;
			$('#fileList').bind('scroll',function(){
				if(($(this).find('table').height() - $(this).scrollTop()) <= 350){
					self.model.get('startNum')+30;
					self.model.set('startNum',self.model.get('startNum')+30);
					$('#fileList').unbind('scroll');
					setTimeout(self.bindScroll(), 1000);
				}
			})
        },
        //滑动滚动条获取数据
        getAttachList:function(){
	        var self = this;
		    self.getDataSource(function(dataSource){
			    if(dataSource.length == 0){
					return;
				} 
		    	self.model.currentDataSource = dataSource;
		        self.AddRepeater.Functions = self.model.renderFunctions;
		        var tBody = $("#fileList").find('tBody');
		        if(tBody.length != 0){
			        var html = tBody.html()+self.AddRepeater.DataBind(dataSource);
			 		tBody.html(html);
		        }else{
			        var html = self.repeater.DataBind(dataSource);
			 		$("#fileList").html(html);
		        }
		 		$(".listHead.newShareTable").each(function(){
					var tr = $(this);
					tr.find("td").css("cursor","default");
					tr.find("td").eq(1).css("width","273px");
				});
		 		//top.$App.trigger('selectStoragecabinetFiles');
		 		
		 	//	reselectFiles();
		 	//	rebuildCabinetFrame();
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
		        var tBody = $("#fileList").find('tBody');
		        if(tBody.length != 0){
			        var html = tBody.html()+self.repeater.DataBind(dataSource);
			 		tBody.html(html);
		        }else{
			        var html = self.repeater.DataBind(dataSource);
			 		$("#fileList").html(html);
		        }
		 		$(".listHead.newShareTable").each(function(){
					var tr = $(this);
					tr.find("td").css("cursor","default");
					tr.find("td").eq(1).css("width","273px");
				});
		 		//top.$App.trigger('selectStoragecabinetFiles');
		 		
		 	//	reselectFiles();
		 	//	rebuildCabinetFrame();
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
				//self.model.dataSource = self.model.formatExpireDate(fileList);
				for(var i = 0;i<fileList.length;i++){
					self.model.dataSource.push(fileList[i]);
				}
				
				//self.model.set('endNum',fileList.length)
				//self.model.sort({field : 'sendDate', dataSource : self.model.dataSource});
				callback(fileList);
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
			            fileType: "keepFolder",
						comeFrom: "cabinet"
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

