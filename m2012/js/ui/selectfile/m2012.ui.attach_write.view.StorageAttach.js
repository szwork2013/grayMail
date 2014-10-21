/**
 * @fileOverview 附件夹视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.UI.SelectFile.View.StorageAttach', superClass.extend(
	/**
	 *@lends M2012.UI.Dialog.SelectFile.View.StorageCabinet.prototype
	 */
	{
		el : "body",
		name : "M2012.UI.Dialog.SelectFile.View.StorageAttach",
		template: ['<!--[if lt ie 8]>',
				   '<div style="+zoom:1;"><![endif]-->', 
				'<table class="listHead newShareTable" cellpadding="0" cellspacing="0">',
                     '<tbody>',
                     	 '<!--item start-->',
                         '<tr uid="$uid">',
                         '<td class="wh1"><input fid="$mid" type="checkbox"></td>',
                         '<td class="" title="@getFullFileName()"><i class="@getFileIconClass() mr_5"></i> @getShortFileName()</td>',
                         '<td class="wh6 gray">@getFileSize()</td>',
                         '</tr>',
                         '<!--item end-->',
                 '</tbody></table>',
                 '<!--[if lt ie 8]></div><![endif]-->'].join(""),
        listTemplate:['<!--item start-->',
        				'<tr uid="$uid">',
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
                    fileSource: "attach",
                    isAllChecked: checked,
                    dataSource : self.model.dataSource
                });
        	});
        	// 绑定表头排序单击事件
        	/*$("#aFileName").click(function(event){
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
        		self.sort({jEle : target, field : 'expiryDate', dataSource : self.model.dataSource});
        		
        		$("#aFileName > i").attr('class','');
        		$("#aFileSize > i").attr('class','');
        	});*/
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
        			if(selectedCount == self.model.dataSource.length){
        				$("#allOrNone").attr('checked', true);
        			}else{
        				$("#allOrNone").attr('checked', false);
        			}
        			
        			// todo 该方法在  M2012.UI.Dialog.SelectFile.View 中绑定
        			var fid =  $(target).parent().parent().attr("uid")
        			var file = self.model.getFileById(fid);
        			top.$App.trigger('toggleSelectedFilesC', {
                        fileSource: "attach",
                        dataSource: [file]
                    });
        		}
        	});
        	top.$App.on('reselectFiles', function(args){////////////////////////////////////////////
	    		var selectedFids = args.dataSource;
	    		$("#fileList input[type='checkbox']").each(function(i){
					var fid = $(this).parent().parent().attr("uid"),This = this;
					$.each(selectedFids,function(i,item){
						if(item.uid == fid){
							$(This).attr('checked', true);
						}
					})
				});
	    	});
			
			$("#cancel").click(function(){
				top.selectFileDialog4.close();
			});
			self.model.on('change:startNum',function(){
				self.getAttachList();
			});
			self.bindScroll();
        },
        //绑定滚动事件
        bindScroll :function() {
	        var self = this;
			$('#fileList').bind('scroll',function(){
				if(($(this).find('table').height() - $(this).scrollTop()) <= 350){
					self.model.set('startNum',self.model.get('startNum')+30);
					$('#fileList').unbind('scroll');
					setTimeout(self.bindScroll(), 1000);
				}
			})
        },
        removeUid:function(uid){
	        var self = this;
			var cacheList = self.model.cacheList ;
			var addList = [];
			
			for(var i=0,len=cacheList.length; i<len; i++) {
				if(cacheList[i] == uid){
					continue;
				}
				addList.push(cacheList[i]);

			}

			self.model.cacheList = addList;
        },
        //滑动滚动条获取数据
        getAttachList:function(){
	        var self = this;
		    self.getDataSource(function(dataSource){
			    if(dataSource.length == 0){
					return;
				} 
		    	self.model.dataSource = _.union(self.model.dataSource,dataSource);
		        self.AddRepeater.Functions = self.model.renderFunctions;
	    		$('#allOrNone').attr('checked',false);
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
	        	top.$App.trigger('reselectFiles', {
	                    dataSource:self.model.get('attachFileList')
	                });		 		//top.$App.trigger('selectStoragecabinetFiles');
		 		
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
		// 渲染附件夹
		render : function (){
		    var self = this;
		    // 设置搜索框默认值
		    //$("#keywords").val(self.model.defaultInputValue);
		    // 加载文件列表
		    self.getDataSource(function(dataSource){
		    	self.model.dataSource = _.union(self.model.dataSource,dataSource);
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
		    /*function reselectFiles(){
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
*/		    
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
			var checkedList = this.model.get('attachFileList');
            divFileList.find("input:checkbox:checked[fid]").each(function() {
                checkedList.push($(this).parent().parent().attr("uid"));
            });
            return checkedList;
		},
		// 还原文件列表
		restore : function(){
			var self = this;
			$("#keywords").val(self.model.defaultInputValue);
			$("#keywords").attr('class', 'iText gray');
			$("#searchDiv").removeClass('savefile-search-on');
			
		    	self.model.dataSource = _.union(self.model.dataSource,dataSource);
			self.reflush(self.model.dataSource);
			
			$("#searchResunt").hide();
			self._resetCheckbox();
		},
		// 获取附件夹文件
		getDataSource : function(callback){
			var self = this,item;
			self.model.fetchStorageFiles(function(result){
				var fileList = [];
				if(result.responseData.code && result.responseData.code == 'S_OK'){
					fileList = result.responseData['var'];
				}else{
					console.log('获取附件夹失败！');
				}
                //self.model.removeFailFile(fileList);
				// 格式化过期时间方便排序,将文件列表保存至model层供排序，查询使用
				//self.model.dataSource = self.model.formatExpireDate(fileList);
				for(var i = 0;i<fileList.length;i++){
					 item = fileList[i];
					item.uid = item.mid + "_" + item.attachOffset;
					self.model.dataSource.push(item);
				}
				
				//self.model.set('endNum',fileList.length)
				//self.model.sort({field : 'sendDate', dataSource : self.model.dataSource});
				callback(fileList);
		    });
		},
		// 将用户选择的文件列表插入写信页附件列表
		addFilesToCompose : function(event){
			var self = this
				,totalSize = 0
				,composeWinId = top.mainView.model.tabName
				,composeWindow = top.window.document.getElementById(composeWinId).contentWindow
			    ,selectedFids = self.getSelectedFids()
			    ,files = [];
            for(var i = 0,len = self.model.dataSource.length;i < len;i++){
            	var file = self.model.dataSource[i];
            	if(selectedFids.length != 0 &&$.inArray(file.uid, selectedFids) != -1){
                	files.push(file);
                	totalSize += file.attachRealSize;
                	for(var o = 0; o < selectedFids.length;o++){
	                	if(file.uid == selectedFids[o]){
		                	selectedFids.splice(o,1);
		                	o--;
	                	}
                	}
                }
            }
			if(files.length == 0){
				top.$Msg.alert("请选择附件。");
				return ;
			} else if(!composeWindow.utool.checkSizeSafe(totalSize)){
				top.$Msg.alert("附件总数据量大小超限（50M），请减少附件后重试");
				return ;
			}
            // 统一数据格式
            files = $.map(files, function(n) {
                    return {
                        fileId: n.mid,
			            fileName: n.attachName,
			            state: "success",
			            fileRealSize: n.attachRealSize,
			            fileSize: n.attachSize,
						comeFrom: "attach",
						encoding: '1',
						fileOffSet:n.attachOffset
                    }
                });
                
			this.forwardAttaches(files);
            //top.$App.trigger('obtainAttachFiles', files);
		},
		forwardAttaches: function(dataList) {
			
			//var data = this.getSelectedAttachListData();
			//var dataList = data.file;

			if(dataList.length == 0){
				top.$Msg.alert("请选择附件。");
				return ;
			} //else if(data.totalSize > 1024 * 1024 * 50){
				//$Msg.alert("附件总数据量大小超限（50M），请减少附件后重试");
				//return ;
			//}

			for(var i=0, len=dataList.length; i<len; i++){
				dataList[i].type = "attach";
			}

			this.renameConflict(dataList);
			//top.FORWARDATTACHS = {
				//attachments: dataList
			//};
			this.model.forwardAttach(dataList, function(res){
			//	top.$App.show('compose', {type:"forwardAttachs"});
				if(res.responseData.code === "S_OK"){
					var attachments = res.responseData["var"].attachments;
					var itemTemp = '<li rel="largeAttach" objId="{objId}" filetype="i_attachmentS"><i class="i_attachmentS"></i>\
					<span class="ml_5">{prefix}<span class="gray">{suffix}</span></span>\
					<span class="gray ml_5">({fileSizeText})<span class="tiquma pl_5 black" style="display:none;"></span></span>\
					<a hideFocus="1" class="ml_5" href="javascript:void(0)" removeLargeAttach="{objId}">删除</a></li>';
					var htmlStr = '';
					var fileName = '';
					for(var i = 0, len = attachments.length; i < len; i++){
						var item = attachments[i];
						fileName = item.fileName;
						var prefix = fileName.split(".")[0];
						var suffix = fileName.split(".")[1];
						var data = {
							objId : item.fileId,
							prefix: prefix+'.',
							suffix: suffix,
							fileSizeText: M139.Text.Utils.getFileSizeText(item.fileSize)
						};
						htmlStr += top.$T.Utils.format(itemTemp, data);
					}
					//debugger;
					//console.log(uploadManager.jContainer)
					//console.log(uploadManager)
					//uploadManager.jContainer.append(htmlStr);					//console.log(htmlStr)
					//uploadManager.jContainer.show();
					//$("#attachContainer").html(htmlStr)
					/*top.$Evocation.create({
						type : "compose",
						subject : decodeURIComponent(fileName),
						content : "",
						whereFrom : "attach",
						diskContent : htmlStr,
						attachContentJSON : attachments,
						attachmentsid : res.responseData["var"]["id"]
					});
*/					
				for(var i=0, len=dataList.length; i<len; i++){
					dataList[i].composeId = res.responseData["var"].id;
				}


				top.$App.trigger('obtainAttachFiles', dataList);

				}else{
					console.log("fail");
				}
				
				top.addBehavior("attach_forward_batch");
			});
		},
	    getCompleteHTML: function () {
	        //附件预览{
	        var FilePreview = new top.M2012.ReadMail.View.FilePreview();
	        var previewType = FilePreview.checkFile(this.fileName, this.fileSize);
	        var showFilePreview = this.fileType != "largeAttach" && FilePreview.isRelease();
	        var imgUrl = "";
	        showFilePreview &= previewType > 0;
	        var previewHtml = "";
	        var insertImgHtml = "";
	        if (showFilePreview) {
	            var downloadUrl = upload_module.model.getAttachUrl(this.fileId, encodeURIComponent(this.fileName), true),
	            	pageType = upload_module.model.get('pageType');

	            var comefrom = "compose";
	            if (pageType && (pageType == "draft" || pageType == "forward" || pageType == "reply" || pageType == "replyAll" || pageType == "resend")) {//草稿箱打开，需要用读信地址
	                comefrom = "draftresend";
	                var files = upload_module.model.get('initDataSet').attachments;
	                for (var i = 0, fLen = files.length; i < fLen; i++) {	//从restoreDraft的报文中找到这个附件
	                    if (this.fileId == files[i].fileId) {
	                        downloadUrl = top.$T.Utils.format("http://" + location.host + "/RmWeb/view.do?func=attach:download&type=attach&encoding=1&sid={0}&mid={1}&offset={2}&size={3}&name={4}",
	            			[upload_module.model.getSid(), upload_module.model.get('mid'), files[i].fileOffSet, files[i].base64Size, encodeURIComponent(files[i].fileName)]);
	                        downloadUrl = encodeURIComponent(downloadUrl)
	                        imgUrl = FilePreview.getImgUrl({
	                            fileSize: this.fileSize,
	                            fileOffSet: files[i].fileOffSet,
	                            fileName: $T.Html.encode(this.fileName),
	                            type: "email"
	                        }, upload_module.model.get('mid'));
	                        if (pageType == "draft" || pageType == "resend") {
	                            imgUrl = "";
	                        }
	                        break;
	                    }
	                }
	            }
	            var isImg = /(?:\.jpg|\.gif|\.png|\.ico|\.jfif|\.bmp|\.jpeg|\.jpe)$/i.test(this.fileName);
	            var previewUrl = FilePreview.getUrl({
	                fileName: encodeURIComponent(this.fileName),
	                fileSize: this.fileSize,
	                type: "email",
	                downloadUrl: downloadUrl,
	                contextId: this.fileId,
	                comefrom: comefrom,
	                composeId: upload_module.model["composeId"]
	            });
	            var target = "_blank";
	            var clickEvent = "";
	            //if (previewType == 1) {
	                //if (isImg) {
	                  //  previewUrl = 'javascript:;';
	                   // target = "_self";
	                   // clickEvent = "onclick = 'UploadFileItem.prototype.srcollImgPreview(this)'";
	                  //  downloadUrl = decodeURIComponent(downloadUrl);
	                    /*var tempImg = "<a class='ml_5' href='javascript:;' hideFocus='1' imgUrl='{0}' command='InsertImgFile'>插入正文</a>"
	                    insertImgHtml = top.$T.Utils.format(tempImg, [downloadUrl]);*/
	                //}
	            //}
	            var tempStr = "<a {6} hideFocus='1' imgUrl='{3}' fileName='{5}' class='ml_5' behavior='{0}' ext='2' href=\"{1}\" target='{7}' title='预览文件' downloadurl='{4}' >{2}</a>";
	            var option1 = previewType == 1 ? "预览-在线预览" : "预览-预览压缩包";
	            var option3 = previewType == 1 ? "预览" : "打开";
	            var tempArr = [option1, previewUrl, option3, imgUrl, downloadUrl, $T.Html.encode(this.fileName), clickEvent, target];
	            previewHtml = top.$T.Utils.format(tempStr, tempArr);
	        } //}附件预览

	        //{insertImgHtml}\ //屏蔽插入正文功能，后台与内联图片冲突
			//下面的i 原来的class为{fileIconClass} 
	        var htmlCode = '<i class="i_attachmentS"></i>\
							<span class="ml_5" fileid="{fileId}">{prefix}<span class="gray">{suffix}</span></span>\
							<span class="gray ml_5">({fileSizeText})</span>\
							{previewHtml}\
							<a hideFocus="1" class="ml_5" href="javascript:void(0)" fileid="{fileId}" filetype="{fileType}" command="DeleteFile">删除</a>';
	        var shortName = utool.shortName(this.fileName),
				prefix = shortName.substring(0, shortName.lastIndexOf('.') + 1),
				suffix = shortName.substring(shortName.lastIndexOf('.') + 1, shortName.length);
	        var fileIconClass = $T.Utils.getFileIcoClass(0, this.fileName);
	        var data = {
	            fileIconClass: "i_attachmentS",
	            prefix: prefix,
	            suffix: suffix,
	            fileSizeText: this.fileType == "largeAttach" ? this.fileSize : top.$T.Utils.getFileSizeText(this.fileSize, { maxUnit: "K", comma: true }),
	            fileId: this.fileId,
	            fileType: this.fileType,
	            previewHtml: previewHtml
	           /* ,insertImgHtml : insertImgHtml*/
	        };
	        htmlCode = top.$T.Utils.format(htmlCode, data);
	        return htmlCode;
	    },
		// 解决附件重名问题
		renameConflict: function(list){
			var repeat, fname, idx;

			list.sort(function(a, b){
				return a.fileName.localeCompare(b.fileName);
			});

			for(var i=0, len=list.length; i<len-1; i++){
				repeat = 1;
				fname = list[i].fileName;
				idx = fname.lastIndexOf('.');
				if(idx < 0) idx = fname.length;
				while(i+repeat < len && fname == list[i+repeat].fileName){
					list[i+repeat].fileName = fname.substr(0, idx) + '(' + repeat + ')' + fname.substr(idx);
					repeat++;
				}
			}
		},
		searchFiles : function(){
			var self = this;
			var keywords = $.trim($("#keywords").val());
			if(!keywords){
				return;
			}
			self.model.dataSource = self.model.search(keywords);
			self.reflush(self.model.dataSource);
			
			$("#searchResunt").show();
			self._resetCheckbox();
		},
		closeSearchTip : function(event){
			var self = this;
			$(".nosearchend").hide();
			// self.restore();
		}
	}));
	top.BH({key : "compose_addAttach_attachment"})
	storageAttachModel = new M2012.UI.SelectFile.Model.StorageAttach();
    storageAttachView = new M2012.UI.SelectFile.View.StorageAttach({model : storageAttachModel});
})(jQuery, _, M139);
