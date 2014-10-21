/**
 * @fileOverview 文件快递暂存柜视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Fileexpress.Cabinet.View.Filelist', superClass.extend(
	/**
	 *@lends M2012.Fileexpress.Cabinet.View.prototype
	 */
	{
		el : "body",
		name : "M2012.Fileexpress.Cabinet.View.Filelist",
        template: [ '<!--[if lt ie 8]>',
				         '<div style=\'+zoom:1;\'><![endif]-->',
				         '<table cellpadding="0" cellspacing="0" class="listHead newShareTable" id="fileList2">',
				             '<tbody>',
				             '<!--item start-->',
				 	    	 '<tr>',
				                 '<td class="wh1 t-check"><input fid="$fid" type="checkbox"></td>',
				                 '<td>',
									'<div class="fl p_relative">',
										'<a href="javascript:void(0);" class="@getFileIconClass()"></a>',
								//		'@isShare()',
									'</div>',
				                    '<a hideFocus="1" href="javascript:void(0)" class="attchName" title="@getFullFileName()" style="">',
								//	'<i class="@getFileIconClass()"></i>',
									'<span name="nameContainer">',
										'<em fid="$fid" fsize="$fileSize" name="fname">@getShortName(30)</em>',
										'<input type="text" fname="@getFullName()" exname="@getExtendName()" value="@getFullName()" maxlength="255" size="30" style="display:none;"></input>','<em fid="$fid" fsize="$fileSize" name="fname">@getExtendName()</em>',
									'</span>',
									'</a>',
				                    '<div class="attachment" style="display: none;">@getOperateHtml()</div>',
				                 '</td>',
				                 '<td class="wh4 gray">$createTime</td>',
				                 '<td class="wh4 gray">$remain</td>',
				                 '<td class="wh5 gray">$downloadTimes</td>',
				                 '<td class="wh6 gray">@getFileSize()</td>',
				             '</tr>  ',
				             '<!--item end-->',
				           '</tbody>',
				 	 '</table>',
				       '<!--[if lt ie 8]></div><![endif]-->'].join(""),
		templateIcon : [ '<ul>',
							 '<!--item start-->',
							 '<li class="listItem">',
					         	'<p class="chackPbar"><input fid="$fid" type="checkbox" class="checkView" style="display:none;"/></p>',
					     		'<a hideFocus="1" href="javascript:void(0)" class="@getPicClass()"><img fid="$fid" fsize="$fileSize" name="fname" src="@getThumbnailUrl()" style="width: 65px; height: 65px;"></a>',
					             '<div class="viewIntroduce" style="padding: 0 3px;">',
					             	'<p title="@getFullFileName()"><span class="itemName" name="nameContainer"><em><a hideFocus="1" fid="$fid" fsize="$fileSize" href="javascript:void(0)" name="fname">@getShortName(15)</a></em><input type="text" fname="@getFullName()" exname="@getExtendName()" value="@getFullName()" maxlength="255" size="30" style="display:none; width:110px;"></input></span><span fid="$fid" fsize="$fileSize" name="fname" style="cursor:pointer">@getExtendName()</span></p>',
					                '<p class="gray" style="display: none;">@getFileSize()</p>',
					                '@getOperateHtml()',
					             '</div>',
					 		 '</li>',
					 		 '<!--item end-->',
						'</ul>'].join(""),
		templateNoFile : [ '<!--[if lt ie 8]>',
				         '<div style=\'+zoom:1;\'><![endif]-->',
				         '<table cellpadding="0" cellspacing="0" class="listHead">',
				             '<tbody>',
				             '<tr><td style="border-bottom: 0;">',
								'<div class="imgInfo addr-imgInfo ta_c">',
										'<dl>',
											'<dt><img src="../../images/module/networkDisk/cabinet.jpg" /></dt>',
											'<dd><p class="fz_14">暂无文件</p></dd>',
											'<dd><p>临时文件存在暂存柜，绿色环保，点击左上角“上传”按扭添加！</p></dd>',
										'</dl>',
								'</div>',
							 '</td></tr>',
				           '</tbody>',
				 	 '</table>',
				     '<!--[if lt ie 8]></div><![endif]-->'].join(""),
		events:{
			"click #selectAll" : "allOrNone"
		},
		allOrNone : function(event){
			var self = this;
			var checked = $("#selectAll").attr('checked')?true:false;
        	if(checked){
        		self.model.selectAll();
        	}else{
        		self.model.selectNone();
        	}
        	
        	self.reselectFiles();
        	self.renderSelectCount();
		},
		initialize : function(options) {
			this.model = options.model;
			this.toolbarView = options.toolbarView;
			this.initEvents();
			return superClass.prototype.initialize.apply(this, arguments);
		},
		initEvents : function(){
        	var self = this;
        	var sortTypes = self.model.sortTypes;
        	// 绑定表头排序单击事件 todo
        	var sortTypeMap = {
        		fileName : 'FILE_NAME',
        		createTime : 'CREATE_TIME',
        		expiryDate : 'EXPIRY_DATE',
        		downloadTimes : 'DOWNLOAD_TIMES',
        		fileSize : 'FILE_SIZE'
        	};
        	$("#fileName,#createTime,#expiryDate,#downloadTimes,#fileSize").click(function(event){
        		var id = $(this).attr('id');
        		self.model.set('sortType', sortTypes[sortTypeMap[id]]);
        		self.model.set('sortIndex', -self.model.get('sortIndex'));
        	});
        },
        // 根据排序类型执行排序操作
        sortByType : function(){
        	var self = this;
        	var sortType = self.model.get('sortType');
	    	var jSortType = $("#"+sortType);
	    	self.sort({jEle : jSortType, field : sortType, dataSource : self.model.get('fileList')});
	    	if(sortType === self.model.sortTypes['FILE_NAME']){
	    		jSortType.siblings().find("i").attr('class', '');
	    	}else{
	    		jSortType.parent().siblings().find("i").attr('class', '');
	    	}
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
    		self.render();
    		
    		var sortClass = jI.attr('class');
    		sortClass = (self.model.get('sortIndex') === -1)?'i_th0':'i_th1';
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
		    var pageData = self.model.getPageData(self.model.get("pageIndex"));
		    var html = '';
		    if(pageData.length > 0){
		    	self.repeater = new Repeater(self.getTemplate());
		    	self.repeater.dataModel = self.model;
		        self.repeater.Functions = self.model.renderFunctions;
		    	html = self.repeater.DataBind(pageData);
				$("#toolBar").show();
		    }else{
		    	html = self.templateNoFile;
				$("#toolBar").hide();
		    }
		 	$("#fileList").html(html);
		 	self.fixList();
		 	self.reselectFiles(pageData);
		 	self.renderSelectAll(pageData);
		 	if(pageData.length > 0){
			 	self.initClickEvents();
		 	}
		 	self.initRenameEvents();
		 	var mode = self.model.get('listMode');
		 	if(mode){
		 		self.initIconEvents();
		 		
		 		//self.loadThumbImage();// todo 通过model.renderFunctions 替换缩略图 该行可注释掉
		 		
		 		$("#cabinetSortHeader th:gt(2)").hide();
		 	}else{
		 		$("#cabinetSortHeader th:gt(2)").show();
		 	}
		},
		// 翻页需要选中上次选中的文件
		reselectFiles : function(){
			var self = this;
			$("#fileList input[type='checkbox']").each(function(i){
				var fid = $(this).attr('fid');
				if(!self.model.isUploadSuccess(fid)){
					$(this).attr('disabled', true);
				}
				
				var selectedFids = self.model.get('selectedFids');
				if($.inArray(fid, selectedFids) != -1){
					$(this).attr('checked', true);
					// 图标模式还需要给li添加选中样式
					var mode = self.model.get('listMode');
					if(mode){
						var target = $(this).parents('li');
						target.addClass('listViewHover listViewChecked');
						target.find("p.chackPbar").find('input').show();
						self.showOperatesTable(target);
					}
				}else{
					$(this).attr('checked', false);
					// 图标模式需要去掉li选中样式
					var mode = self.model.get('listMode');
					if(mode){
						var target = $(this).parents('li');
						target.removeClass('listViewHover listViewChecked');
						target.find("p.chackPbar").find('input').hide();
						self.showSizeTable(target);
					}
				}
			});
		},
		// 渲染全选按钮
		renderSelectAll : function(pageData){
			var self = this;
			var selectedCount = $("#fileList input:checked").size();
			var uploadFailureCount = $("#fileList input:disabled").size();
			var pageCount = selectedCount + uploadFailureCount;
			if(pageCount == pageData.length && selectedCount !== 0){
				$("#selectAll").attr('checked', true);
			}else{
				$("#selectAll").attr('checked', false);
			}
		},
		// 列表模式，图标模式共用以下单击事件
        initClickEvents : function(){
        	var self = this;
			$("#fileList tr").hover(function(){
				$(this).addClass("trHover");
			},function(){
				$(this).removeClass("trHover");
			});
        	$("#fileList").unbind('click').click(function(event){
        		var target = $(event.target);
        		if(target.is("input[type='checkbox']")){
        			self.selectEvent(target);
        		}else if(target.is("a[name='download']")){
        			self.downloadEvent(target);
        		}else if(target.is("a[name='send']")){
        			self.sendEvent(target);
        		}else if(target.is("a[name='renew']")){
        			self.renewEvent(target);
        		}else if(target.is("a[name='delete']")){
        			self.deleteEvent(target, true);
        		}else if(target.is("a[name='deleteUpload']")){
        			self.deleteEvent(target, true);
                }
        		// 预览文件
        		var name = target.attr('name');
        		if(name === 'fname'){
        			self.previewFile(target);
        		}
        		
        		toggleSelect(target);
        	});
        	
        	// 点击复选框以外的某些区域也可以 选中/取消 文件
        	function toggleSelect(target){
        		var mode = self.model.get('listMode');
				if(mode){
		        	if(!target.is("p") && !target.is("li")){
	                	return;
	                }
					var JCheckBox = getJCheckBox(target);
					if(JCheckBox.is(':disabled')){
						return;
					}
					
					var isSelected = JCheckBox.attr('checked');
					JCheckBox.attr('checked', isSelected?false:true);
					self.selectEvent(JCheckBox);
				}else{
					if(target.is("td") || target.is("a.attchName") || target.is("div.attachment")){
						var JCheckBox = target.parents('tr').find('input[type="checkbox"]');
						if(JCheckBox.is(':disabled')){
							return;
						}
						
						var isSelected = JCheckBox.attr('checked');
						JCheckBox.attr('checked', isSelected?false:true);
						self.selectEvent(JCheckBox);
		        	}
				}
        	};
        	
        	// 获取复选框JQuery对象
	        function getJCheckBox(target){
	        	var tagName = target[0].tagName.toLowerCase();
	        	if(tagName === 'li'){
	        		return target.find('input[type="checkbox"]');
	        	}else{
	        		return target.parents('li').find('input[type="checkbox"]');
	        	}
	        };
        },
        // 列表模式，图标模式共用，响应重命名操作
        initRenameEvents : function(){
        	var self = this;
        	$("#fileList input[type='text']").blur(function(i){
        		var target = $(this);
        		rename(target);
        	});
        	// 重命名支持回车事件
			if($B.is.ie && $B.getVersion() == 6){
				$("#fileList input[type='text']").bind('keydown', function(event){
					if(event.keyCode == M139.Event.KEYCODE.ENTER){
						var target = $(this);
						rename(target);
					}
				}).bind('keypress', function(event){
					if(event.keyCode == M139.Event.KEYCODE.ENTER){
						var target = $(this);
						rename(target);
					}
				});
			}else{
				$("#fileList input[type='text']").bind('keydown', function(event){
					if(event.keyCode == M139.Event.KEYCODE.ENTER){
						var target = $(this);
						rename(target);
					}
				});
			};
			function rename(target){
        		var oldName = $.trim(target.attr('fname'));
        		var newName = $.trim(target.val());
        		if(oldName === newName){
        			self.hideRenameTable(target);
        			return;
        		}
        		var errorMsg = self.model.getErrorMsg(newName);
        		if(errorMsg){
        			top.$Msg.alert(errorMsg).on("close", function(args){
                        setTimeout(function(){//解决ie中会失去焦点，导致重复提示
                            target.focus();
                        }, 100);
                    });
        		}else{
        			var ids = self.model.get('selectedFids').join(',');
        			var exName = $.trim(target.attr('exname'));// 拓展名
        			var options = {fileId : ids, name : newName+exName};
        			self.model.renameFile(function(result){
        				if(result.responseData.code && result.responseData.code == 'S_OK'){
		    				
		    				self.model.trigger("refresh");
							top.M139.UI.TipMessage.show(self.model.tipWords['RENAME_SUC'], {delay : 1000});
		    			}else{
		    				top.M139.UI.TipMessage.show(self.model.tipWords['RENAME_FAI'], {delay : 1000});
		    				self.hideRenameTable(target);
		    				self.logger.error("renameFiles returndata error", "[disk:renameFiles]", result);
		    			}
        			}, options);
        		}
			}
        },
        // 初始化文件列表（图标模式）事件
        initIconEvents : function(){
        	var self = this;
        	// 鼠标悬浮事件
			self.containter = {};
			var hoverTipsTemplate = ['<div class="tips netpictips pl_10" style="width:220px; top: 336px;left: 590px; z-index: 1000; background:#fff; border:1px solid #cecece;">',
								'<div class="tips-text">',
									'<div class="imgInfo" style="overflow: hidden;">',
										'<p>文件名称：{fileName}</p>',
										'<p>文件大小：{fileSize}</p>',
										'<p>上传时间：{fileTime}</p>',
									'</div>',
								'</div>',
								'<div class="tipsTop diamond" style=""></div>',
							'</div>'].join("");
        	$("#fileList li").live("mouseenter", function(event){
        		var target = $(this);
    			target.addClass('listViewHover');
    			target.find("p.chackPbar").find('input').show();
    		//	self.showOperatesTable(target);
				var fileid = target.find("img").attr("fid");
				var file = self.model.getFileById(fileid);
			//	console.log(file);
				var offset = target.offset();
				self.currentHtml = "";
				if(!file){
					fileid = Math.random().toString(); //刚上传的问题没有fileid，虚拟一个，并保存在dom，以便mouseleave的时候消失
					target.find("a[fileid]").attr("fileid", fileid);
				}
				if(fileid in self.containter){
					self.currentHtml = self.containter[fileid];
				}else{
					var formatString = $T.Utils.format(hoverTipsTemplate,{
						fileName : file.fileName,
						fileSize : $T.Utils.getFileSizeText(file.fileSize),
						fileTime : file.createTime
					});
					file.name = target.find(".viewIntroduce p").eq(0).attr("title");
					//self.currentHtml = $(formatString);
					//self.currentHtml.appendTo(document.body)
					self.currentHtml = '文件名称：'+file.name+'\n'+'文件大小：'+$T.Utils.getFileSizeText(file.fileSize)+'\n'+'上传时间：'+file.createTime;
					//self.containter[fileid] = self.currentHtml;
				}
				target.attr('title',self.currentHtml)
					//	setTimeout(function(){
				//var top1 = offset.top + 115;
				//if(offset.top + 112 + self.currentHtml.height() > $(window).height()){
					//top1 = top1 - self.currentHtml.height() - 125;
					//self.currentHtml.find(".diamond").addClass("tipsBottom").removeClass("tipsTop");
				//}else{
					//self.currentHtml.find(".diamond").addClass("tipsTop").removeClass("tipsBottom");
				//}
				//self.currentHtml.css({top: top1, left: offset.left}).show();
        	});
        	$("#fileList li").live("mouseleave", function(event){
        		var target = $(this);
        		var isSelected = target.find('input:checkbox').attr("checked");
				var fileid = target.find("img").attr("fid");
				//if(fileid in self.containter){
						//self.currentHtml = self.containter[fileid];
					//	setTimeout(function(){
							//self.currentHtml.hide();
					//	}, 50);
				//}
        		if(isSelected){
        			return;
        		}
    			target.removeClass('listViewHover listViewChecked');
    			target.find("p.chackPbar").find('input').hide();
    		//	self.showSizeTable(target);
        	});
        	
        	// 图片加载出错
        	$("#fileList img").error(function(event){
        		if(this.error){
        			this.alt = "加载有误";
        		}else{
        			this.error = 1;
        			var defaultImage = self.model.imagePath + 'default.jpg';
        			this.src = defaultImage;
        		}
        	});
        },
        // 加载缩略图  todo 若文件列表接口返回：thumbnailImage 则废弃改方法
        loadThumbImage : function(){
        	var self = this;
        	$("#fileList img").each(function(i){
        		var fid = $(this).attr('fid');
        		var fileObj = self.model.getFileById(fid);
        		var imageName = fileObj.fileName;
        		if(self.model.isImage(imageName)){
        			self.model.get('imageList').push(fileObj);
        		}else{
        			var imagePath = self.model.getThumbImagePath(imageName);
        			$(this).attr('src', imagePath);
        		}
        	});
        	// todo 从接口取图片文件的缩略图
        },
        // 复选框单击事件
        selectEvent : function(target){
        	var self = this;
    		var fid = target.attr('fid');
			var selectedFids = self.model.get('selectedFids');
			// 保存 / 清除 选中文件的ID 遍历数组，存在某项则删除，不存在则添加
			self.model.toggle(fid, selectedFids);
			// 渲染文件数量
			self.renderSelectCount();
			// 图标模式还需改变li的class属性
			var mode = self.model.get('listMode');
			if(mode){
				var isSelect = target.attr('checked');
				if(isSelect){
					target.parents('li').attr('class', 'listItem listViewHover listViewChecked');
				}else{
					target.parents('li').attr('class', 'listItem listViewHover');
				}
			}else{
				var isSelect = target.attr('checked');
				if(isSelect){
					target.parents('tr').attr('class', 'trClick');
				}else{
					target.parents('tr').attr('class', '');
				}
				
			}
        },
        // 渲染用户选中文件数量
        renderSelectCount : function(){
        	var self = this;
        	var selectedCount = self.model.get('selectedFids').length;
        	var jRename = $("#rename");
			$("#cleanSelected").click(function(){
				self.model.selectNone();
				self.reselectFiles();//渲染未选中
				self.renderSelectCount();
				$("#selectAll").attr("checked",false);
			});
			if(selectedCount > 0){
				$("#selectCount b").text(selectedCount);
    			$("#fileName").hide();
    			$("#selectCount").show();
    			
    			// 选中多个文件，重命名按钮置灰
    			if(selectedCount > 1){
					//self.toolbarView.initMoreBtns(0); 关闭更多按钮操作
    				//jRename.find('a').hide();
				//	$("ul span:contains('重命名')").closest("li").hide();//按钮在另外的视图，用dom查找隐藏起来
    				self.model.set('isBtnActivate', 0);
    			}else{
					//self.toolbarView.initMoreBtns(1); 关闭更多按钮操作
    				//jRename.find('a').show();
				//	$("ul span:contains('重命名')").closest("li").show();//
    				self.model.set('isBtnActivate', 1);
    			}
			}else{
				$("#selectCount").hide();
				$("#fileName").show();
				
				//jRename.find('a').show();
    			self.model.set('isBtnActivate', 1);
			}
			
			var pageData = self.model.getPageData(self.model.get("pageIndex"));
    		self.renderSelectAll(pageData);
        },
    	downloadEvent : function(target){
    		var self = this;
    		BH({key : "fileexpress_cabinet_download"});
    		
    		var ids = target.attr('fid');
	        self.model.trigger("downloadFiles", ids);
    	},
    	sendEvent : function(target){
    		var self = this;
    		var fid = target.attr('fid');
            self.model.gotoSendPage({fileList : [self.model.getFileById(fid)]});
    	},
    	renewEvent : function(target){
    		var self = this;
    		var ids = target.attr('fid');
	        self.model.trigger("renewFiles", ids);
    	},
    	deleteEvent : function(target, isNoRefresh){
    		var self = this;
    		var fname = target.attr('fname');
    		var tip = $T.Utils.format(self.model.tipWords['DELETE_FILE_NAME'], [fname]);
    		top.$Msg.confirm(
	            tip,
	            function(){
	                deleteFiles();
	            },
	            function(){
	            },
	            {
	                buttons:["确定", "取消"],
	                title:""
	            }
	        );
	        function deleteFiles(){
	        	var ids = target.attr('fid');
	        	self.model.trigger("deleteFiles", ids, target, isNoRefresh);
	        }
    	},
    	// 文件预览
    	previewFile : function(target){
    		var self = this;
    		var fid = target.attr('fid');
    		if(!self.model.isUploadSuccess(fid)){
    			console.log('sorry, 上传失败的文件不支持预览！！');
    			return;
			}
    		
    		var fileObj = self.model.getFileById(fid);
    		var fsize = fileObj.fileSize;
    		if(!self.model.isOverSize(parseInt(fsize))){
    			console.log('sorry, 文件太大不支持预览！！');
    			return;
    		}
    		var fname = fileObj.fileName;
    		var previewType = self.model.getPreviewType(fname);
    		if(!previewType){
    			console.log('sorry, 文件类型不支持预览！！');
    			return;
    		}
    		self.model.downloadFiles(function(result){
    			if(result.responseData.code && result.responseData.code == 'S_OK'){
    				var downloadUrl = result.responseData.imageUrl;
    				if(downloadUrl){
    					if(previewType === self.model.previewTypes['DOCUMENT']){
    						// 预览文档  todo
    						var url = self.model.getPreviewUrlTemplate();
		                    url = url.format(
								top.sid,
								top.uid,
								fid,
								encodeURIComponent(downloadUrl),
								encodeURIComponent(fname),
								top.UserConfig.skinPath,
								encodeURIComponent(self.model.getResource()),
								encodeURIComponent(top.SiteConfig.diskInterface),
								fsize,
								top.SiteConfig.disk
							);
		                    window.open(url);
    					}else{
    						// 预览图片
    						var previewObj = {
		                        imgUrl: "",
		                        fileName : fname,
		                        downLoad : downloadUrl,
		                        singlePreview : true
		                    };
		                    self.previewImage(previewObj);
    					}
    				}
    			}else{
    				self.logger.error("preDownload returndata error", "[disk:preDownload]", result);
    			}
    		}, fid);
    	},
    	// 图片单击事件，打开图片预览层
    	previewImage : function (previewObj) {
            if (typeof (top.focusImagesView) != "undefined") {
                top.focusImagesView.render({ data: [previewObj], index : 0 });
            }else{
                top.M139.registerJS("M2012.OnlinePreview.FocusImages.View", "packs/focusimages.html.pack.js?v=" + Math.random());
                top.M139.requireJS(['M2012.OnlinePreview.FocusImages.View'], function () {
                    top.focusImagesView = new top.M2012.OnlinePreview.FocusImages.View();
                    top.focusImagesView.render({ data: [previewObj], index : 0});
                });
            }
	    },
    	// 显示文件大小段落
        showSizeTable : function(target){
        	var jIntr = target.find('div.viewIntroduce');
		//	jIntr.find('p:eq(1)').show();
		//	jIntr.find('p:eq(2)').hide();
        },
        // 显示操作栏段落
        showOperatesTable : function(target){
        	var jIntr = target.find('div.viewIntroduce');
		//	jIntr.find('p:eq(1)').hide();
		//	jIntr.find('p:eq(2)').show();
        },
        // 显示重命名input
        showRenameTable : function(){
        	var self = this;
        	var selectedFid = self.model.get('selectedFids')[0];
        	$("#fileList input[type='checkbox']").each(function(i){
        		var fid = $(this).attr('fid');
        		if(selectedFid === fid){
        			var nameContainer = [],parentsName = '';
        			if(!self.model.get('listMode')){
        				parentsName = 'tr';
        			}else{
        				parentsName = 'li';
        			}
        			nameContainer = $(this).parents(parentsName).find('span[name="nameContainer"]');
        			nameContainer.find('em:eq(0)').hide();
        			nameContainer.find('input').show().select();
        			return;
        		}
        	});
        },
        // 隐藏重命名input
        hideRenameTable : function(target){
        	var self = this;
        	target.siblings('em').show();
        	target.hide();
        },
		getTemplate : function(){
			var self = this;
			var mode = self.model.get('listMode');
			if(!mode){
				return self.template;
			}else{
				return self.templateIcon;
			}
		},
		fixList:function(){ //修正列表形式滚动条增加宽度问题
			console.log($("#fileList2").height());
			console.log($("#fileList").height());
			if($("#fileList2").height() == null){
				$("#fileList").css("margin-right","0px")
			}else{
				if($("#fileList2").height()<$("#fileList").height()){
					$("#fileList").css("margin-right","14px")
				}else{
					$("#fileList").css("margin-right","0px")	
				}
			}	
		}
	}));
})(jQuery, _, M139);
