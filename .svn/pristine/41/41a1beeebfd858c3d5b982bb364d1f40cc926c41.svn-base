/**
 * @fileOverview 定义彩云文件列表视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Disk.View.Filelist', superClass.extend(
	/**
	 *@lends M2012.Fileexpress.Cabinet.View.prototype
	 */
	{
		el : "body",
		name : "M2012.Disk.View.Filelist",
        template: [ '<!--[if lt ie 8]>',
				         '<div style=\'+zoom:1;\'><![endif]-->',
				         '<table cellpadding="0" cellspacing="0" class="listHead newShareTable" id="fileList2">',
				             '<tbody>',
				             '<!--item start-->',
				 	    	 '<tr fileid="$id">',
				                 '<td class="wh1"><input fileid="$id" filetype="@getFileType" @setDisabled type="checkbox"></td>',
				                 '<td>',
									'<div class="fl p_relative">',
										'<a href="javascript:void(0);" name="fname" class="@getFileIconClass()"></a>',
										'@isShare()',
									'</div>',
				                    '<a hidefocus="true" href="javascript:void(0)" name="fname" class="attchName" title="@getFullFileName()" style="padding-top:6px;">',
										'<span name="nameContainer">',
											'<em fileid="$id" fsize="@getFileIntSize()" filetype="@getFileType" name="fname">@getShortName(22)</em>',
											'<input type="text" fname="@getFullName()" exname="@getExtendName()" value="@getFullName()" maxlength="255" size="30" style="display:none;" />',
											'<em fileid="$id" fsize="@getFileIntSize()" filetype="@getFileType" name="fname">@getExtendName()</em>',
										'</span>',
									'</a>',
				                    '<div class="attachment" style="display: none;">@getOperateHtml()</div>',
				                 '</td>',
				                 '<td class="wh5 gray" style="display: none;">$createTime</td>',
				                 '<td class="wh6 gray" name="fname">@getFileSize()</td>',
				             '</tr>',
				             '<!--item end-->',
				           '</tbody>',
				 	 '</table>',
				     '<!--[if lt ie 8]></div><![endif]-->'].join(""),
		templateNoFile: [ '<!--[if lt ie 8]>',
				         '<div style=\'+zoom:1;\'><![endif]-->',
				         '<table cellpadding="0" cellspacing="0" class="listHead">',
				             '<tbody class="dir_no_file">',
				             '<tr><td width="5px" style="border-bottom:none;"></td><td class="" style="border-bottom: 0px;">',
								//    '<div class="imgInfo addr-imgInfo ta_c">',
								//		'<dl>',
								//			'<dt><img src="../../images/module/networkDisk/fileNo.jpg" /></dt>',
											'<p class="fz_14" style="text-align: center;">暂无文件</p>',
								//			'<dd><p>请点击左上角“上传”按钮添加</p></dd>',
								//		'</dl>',
								//	'</div>',
							 '</td><td width="5px" style="border-bottom:none;"></td></tr>',
				           '</tbody>',
				 	 '</table>',
				     '<!--[if lt ie 8]></div><![endif]-->'].join(""),		     
		events:{
			"click #selectAll" : "allOrNone"
		},
        defaults:{
            startEle : ''
        },
		allOrNone : function(event){
			var self = this;
			var checked = $("#selectAll").attr('checked')?true:false;
        	if(checked){
        		self.model.selectAll();
        	}else{
        		self.model.selectNone();
        	}

            self.model.set('startEle', '');
        	
        	if(self.model.get('listMode')){
        		self.model.trigger('reselectIconFiles');
        	}else{
        		self.reselectFiles();
        	}
        	
        	self.renderSelectCount();
		},
		initialize : function(options) {
			this.model = options.model;
            this.parentView = options.parentView;
			this.initEvents();
			return superClass.prototype.initialize.apply(this, arguments);
		},
		initEvents : function(){
        	var self = this;
        	var sortTypes = self.model.sortTypes;
        	// 绑定表头排序单击事件
        	var sortTypeMap = {
        		fileName : 'FILE_NAME',
        		uploadTime : 'UPLOAD_TIME',
        		fileSize : 'FILE_SIZE'
        	};
        	$("#fileName,#uploadTime,#fileSize").click(function(event){
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
		//    var pageData = self.model.getPageData(self.model.get("pageIndex"));
			var pageData = self.model.get("fileList"); //数据源已变化
		    var html = '';
		    if(pageData.length > 0){
			//	$("#toolBar").show();
				hideOrShow(true);
		    	self.repeater = new Repeater(self.template);
                self.repeater.dataModel = self.model;
		        self.repeater.Functions = self.model.renderFunctions;
		    	html = self.repeater.DataBind(pageData);
		    }else{
		    	if(!self.model.get('curDirId')){ // 获取根目录下的文件列表前curDirId还未赋值
		    		html = '';
		    	}else{
		    		html = self.templateNoFile;
				//	$("#toolBar").hide();
					hideOrShow(false);
		    	}
		    }
			function hideOrShow(flag){
				if(flag){
					$("#download").show();
					$("#sendFile").show();
					$("#delete").show();
					$("#more").show();
				}else{
					$("#download").hide();
					$("#sendFile").hide();
					$("#delete").hide();
					$("#more").hide();
				}
			}
		 	$("#fileList").html(html);
			$("#fileList tr").each(function(){
				var tr = $(this);
				if(tr.find("em").attr("filetype") === "file"){
					tr.find("a").css("cursor","default");
					tr.find("td").css("cursor","default");
				}else{
					tr.css("cursor","pointer");
				}
			});
			//空模板 上传事件
			$("#noFileAndUpload").click(function(){
				$("#uploadFileInput").click();
			});
            self.hideOperates();
		 	self.reselectFiles();
		 	self.renderSelectAll(pageData);
		 	self.initClickEvents();
			

           /* $("a").click(function(e){
                e.preventDefault();
            })*/
		},

        //根据文件类型 屏蔽操作链接
        hideOperates: function(){
            var self = this;
            // 显示表头列
            $(".diskTableList").find("th:gt(2)").show();
            if (self.model.get("fileList").length == 0) return;//空文件夹则返回
            // 根据文件类型 屏蔽操作链接
            $("#fileList tr").each(function (i) {
                var target = $(this);
                var filetype = target.find('td:eq(0)').find('input').attr('filetype') || self.model.dirTypes['FILE'];
                var fileid = target.find('td:eq(0)').find('input').attr('fileid');
                var jOperates = target.find('div.attachment');
                var isRootDir = self.model.isRootDir(fileid);

//                     if((filetype == self.model.dirTypes['ALBUM'] && self.model.isRootDir(fileid)) || (filetype == self.model.dirTypes['MUSIC'] && self.model.isRootDir(fileid)) ){  //系统目录
                if (isRootDir) {
                    jOperates.find('a[name="download"]').siblings().hide();
                } else if (filetype == self.model.dirTypes['USER_DIR'] || (filetype == self.model.dirTypes['ALBUM'] && !self.model.isRootDir(fileid)) || (filetype == self.model.dirTypes['MUSIC'] && !self.model.isRootDir(fileid))) {  //自定义文件夹
                    var jSend = jOperates.find('a[name="send"]');
                    jSend.hide();
                    jSend.prev('span').hide();
                }

                if (filetype != self.model.dirTypes['FILE']) {    //目录文件不显示大小
                    target.find('td:eq(3)').html('');
                }

//                    if(fileid == self.model.sysDirIds.ALBUM_ID || fileid == self.model.sysDirIds.MUSIC_ID){   //系统文件夹不显示上传时间
                if (isRootDir) {
                    target.find('td:eq(2)').html('');
                }
//                    if(fileid == self.model.sysDirIds.ALBUM_ID || fileid == self.model.sysDirIds.MUSIC_ID){//灰色显示我的相册+我的音乐复选框
                if (isRootDir) {
                //    target.find('td:eq(0)').find('input').attr('disabled', 'disabled');//系统的也可以选中
                }
            });
        },

		// 翻页需要选中上次选中的文件
		reselectFiles : function(){
			var self = this;
			$("#fileList input[type='checkbox']").each(function(i){
				var fid = $(this).attr('fileid');
				if(!self.model.isUploadSuccess(fid)){
					$(this).attr('disabled', true);
				}
				if($(this).attr("disabled") == "disabled"){
					return;
				}
				var selectedFids = self.model.get('selectedDirAndFileIds');
				if($.inArray(fid, selectedFids) != -1){
					$(this).attr('checked', true);
				}else{
					$(this).attr('checked', false);
				}
			});
		},
		
		// 渲染全选按钮
		renderSelectAll : function(pageData){
			var self = this;
			var selectedCount = $("#fileList input:checked").size();
			var uploadFailureCount = $("#fileList input:disabled").size(); // 包括系统文件夹数量
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
                    self.selectEvent(target, event);
        		}else if(target.is("a[name='download']")){
        			self.downloadEvent(target);
                    var fid = target.attr('fileid');
                    self.model.downloadLogger(fid);
        		}else if(target.is("a[name='share']")){
        			self.shareEvent(target);
        		}else if(target.is("a[name='send']")){
        			self.sendEvent(target);
        		}else if(target.is("a[name='delete']")){
        			self.deleteEvent(target);
                    var filetype = target.parents('tr').find('.wh1 input').attr('filetype');
                    if(filetype != self.model.dirTypes.FILE){
                        BH({key : "diskv2_deletefolder"});
                    }else{
                        BH({key : "diskv2_deletefile"});
                    }
        		}
        		
        		previewOrOpenFile(target);


        		toggleSelect(target);
        	});
        	// 预览文件 / 打开文件夹
        	function previewOrOpenFile(target){
        		var name = target.attr('name');
        		var filetype = target.attr('filetype') || target.closest("tr").find("input").eq(0).attr("filetype");
                var id = target.attr('fileid') || target.closest("tr").attr('fileid');
        		if(name === 'fname'){
        			if(filetype == self.model.dirTypes['FILE'] || !filetype){// 预览文件
        			//	self.previewFile(id);
                    //    BH({key : "diskv2_preview"});
        			}else{// 打开文件夹
                        var dirObj = self.model.getDirById(id);
                        var dirLevel = dirObj.directoryLevel;
                        self.model.set("curDirType", filetype);
						top.firstEnterNet = false;
                        self.model.set('curDirId', id);
                        self.model.set("curDirLevel", dirLevel);

                        self.model.set("selectedFids", []);
                        self.model.set("selectedDirIds", []);
                        self.model.set("selectedDirAndFileIds", []);

                        self.model.trigger("changeFileTypeUpload");
        			}
        		}
        	};
        	// 点击复选框以外的某些区域也可以 选中/取消 文件
        	function toggleSelect(target){
        		if(target.is("td") || target.is("em") || target.is("a.attchName") || target.is("div.attachment")){
					var JCheckBox = target.parents('tr').find('input[type="checkbox"]');
					if(JCheckBox.is(':disabled')){
						return;
					}
					
                    var fid = JCheckBox.attr('fileid');
                    if(fid == self.model.sysDirIds.ALBUM_ID || fid == self.model.sysDirIds.MUSIC_ID){
                        return ;
                    }else{
                        setTimeout(function(){
                            var isSelected = JCheckBox.attr('checked');
                            JCheckBox.attr('checked', isSelected?false:true);
                            self.selectEvent(JCheckBox);
                        }, 100);
                    }
	        	}
        	};
        },
        // 复选框单击事件
        selectEvent : function(target, event){
        	var self = this;
            var model = self.model;
    		var fid = target.attr('fileid');
            var type = target.attr("filetype");
			var selectedFids = model.get('selectedFids');
            var selectedDirIds = model.get("selectedDirIds");
            var selectedDirAndFileIds = model.get("selectedDirAndFileIds");
            var selectedDirType = model.get("selectedDirType");
            var shareFileId = model.get("shareFileId");
            //var startEle = model.get('startEle');

            // 保存 / 清除 选中文件或者目录的ID
            model.toggle(fid, type == model.dirTypes.FILE ? selectedFids : selectedDirIds);
            model.toggle(fid, selectedDirAndFileIds);
            model.toggle(fid, shareFileId);
            //记录当前选择的目录类型
            if (type !== model.dirTypes.FILE) {
                model.changeDirType(type);
            }
			var isSelected=target.attr("checked");
            if(isSelected){
                target.parents('tr').attr('class', 'trClick');
            }else{
                target.parents('tr').attr('class', '');
            }
			self.renderSelectCount();// 渲染文件数量
        },
        // 渲染用户选中文件数量
        renderSelectCount : function(){
        	var self = this;
        	var selectedCount = self.model.get('selectedDirAndFileIds').length;
            var selectedFids = self.model.get('selectedFids').length;
            var selectedDirIds = self.model.get('selectedDirIds').length;
        //    var curPageData = self.model.getPageData(self.model.get('pageIndex'));
			var curPageData = self.model.get("fileList"); //数据源已变化
            var curPageCount = curPageData.length;
			if(selectedCount > 0){
                if(selectedFids > 0 && selectedDirIds > 0){
                    $("#selectCount b:eq(0)").text(selectedFids);
                    $("#selectCount b:eq(1)").text(selectedDirIds);
                    $("#selectCount span").show();
                }else if(selectedFids > 0){
                    $("#selectCount b:eq(0)").text(selectedFids);
					$("#selectFile b").text(selectedFids);
                    $("#selectCount span:eq(0)").show();
                    $("#selectCount span:eq(1)").hide();
                    $("#selectCount span:eq(2)").hide();

                }else if(selectedDirIds > 0){
                    $("#selectCount b:eq(1)").text(selectedDirIds);
                    $("#selectCount span:eq(0)").hide();
                    $("#selectCount span:eq(1)").hide();
                    $("#selectCount span:eq(2)").show();

                }
    			$("#fileName").show();
				$("#selectFile").show();
    			$("#selectCount").hide();
                if(selectedCount == curPageCount || ((selectedCount+2) == curPageCount)){   //+2是加上我的音乐和我的相册两项
    				$("#selectAll").attr('checked', true);
    			}else{
    				$("#selectAll").attr('checked', false);
    			}
			}else{
				$("#selectAll").attr('checked', false);
				$("#selectFile").hide();
				$("#selectCount").hide();
				$("#fileName").show();
			}
			self.model.trigger("renderBtns");// 重新渲染工具栏按钮
			
		//	var pageData = self.model.getPageData(self.model.get("pageIndex"));
			var pageData = self.model.get("fileList"); //数据源已变化
    		self.renderSelectAll(pageData);
        },
    	downloadEvent : function(target){
    		var self = this,
                dataSend = {},
                fid = target.attr('fileid'),
                fileObj = self.model.getFileById(fid);
	        if(fileObj.type != self.model.dirTypes['FILE']){
	        	dataSend.directoryIds = fid;
                dataSend.dirType = fileObj.directory.dirType;
	        }else{
	        	dataSend.fileIds = fid;
                dataSend.dirType = fileObj.type;
	        }
            dataSend.isFriendShare = '0';   //后台做了判断，彩云列表下载此参数都为0
            self.model.trigger("download", dataSend);
    	},
    	sendEvent : function(target){
    		var self = this;
    		var fid = target.attr('fileid');

            self.model.doCommand(self.model.commands.SEND_TO_MAIL, {
                data: {fileIds: [fid]},
                isLineCommand: true
            });
    	},
    	shareEvent : function(target){
    		var self = this;
    		var fid = target.attr('fileid');
    		self.model.set('shareFileId', [fid]);
	        self.model.showShareDialog(self.model.shareTypes['SINGLE']);
    	},
    	deleteEvent : function(target){
    		var self = this,
                dirType = '',
                fid = target.attr('fileid'),
                filename = target.attr('fname'),
                fileObj = self.model.getFileById(fid);
                if(fileObj.directory && fileObj.directory.dirType){
                    dirType =fileObj.directory.dirType;
                }else{
                    dirType =fileObj.type;
                }
                //filename用于用户没有选中而是直接点击删除的，因为没有选中则弹出框提示删除时无法在selectedFids取得删除文件名
                var args = {command : self.model.commands['DELETE'], data : {}, filename:filename};
	        if(dirType != self.model.dirTypes['FILE']){
	        	args.data.directoryIds = fid;
	        }else{
	        	args.data.fileIds = fid;
	        }
	        args.data.dirType = dirType;
	        top.$App.trigger("diskCommand", args);
    	},

        //新建目录
        createDir: function () {
            var self = this,
                model = self.model,
                curDirType = model.get("curDirType"),
                fileListItem = $("#fileList tbody > tr"),
                itemAppend = $(this.templateItem),
                inputTxtEle = itemAppend.find("input[type=text]");
                inputCheckEle = itemAppend.find("input[type=checkbox]");

            if (curDirType == model.dirTypes.ROOT) {//根目录下在"我的音乐"目录后添加目录
                fileListItem.eq(1).after(itemAppend);
            } else {
                fileListItem.eq(0).before(itemAppend);
            }

            var createDirType = model.getDirTypeForServer();
            inputTxtEle.select();
            inputTxtEle.prev().attr("filetype", createDirType);
            inputCheckEle.attr("filetype", createDirType);

            this.createDirEvent(itemAppend);
        },

    	// 文件预览
    	previewFile : function(fid){
    		//console.log('previewFile previewFile previewFile previewFile previewFile!!');
    		if(!fid){
    			return;
    		}
    		var self = this;
    		if(!self.model.isUploadSuccess(fid)){
    			console.log('sorry, 上传失败的文件不支持预览！！');
    			return;
			}
    		
    		var fileObj = self.model.getFileById(fid);
            var dirType = fileObj.type;
    		var fsize = fileObj.file.fileSize;
    		if(!self.model.isOverSize(parseInt(fsize))){
    			console.log('sorry, 文件太大不支持预览！！');
    			return;
    		}
    		var fname = fileObj.name;
    		var previewType = self.model.getPreviewType(fname);
    		if(!previewType){
    			console.log('sorry, 文件类型不支持预览！！');
    			return;
    		}


            var options = {fileIds : fid, dirType : dirType, isFriendShare: 0};
    		self.model.download(function(result){
    			if(result.responseData.code && result.responseData.code == 'S_OK'){
                    var downloadUrl = result.responseData['var'].url;
    				if(downloadUrl){
    					if(previewType === self.model.previewTypes['DOCUMENT']){
    						// 预览文档
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
    		}, options);
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
			jIntr.find('p:eq(1)').show();
			jIntr.find('p:eq(2)').hide();
        },
        // 显示操作栏段落
        showOperatesTable : function(target){
        	var jIntr = target.find('div.viewIntroduce');
			jIntr.find('p:eq(1)').hide();
			jIntr.find('p:eq(2)').show();
        },
        // 显示重命名input
        showRenameTable : function(){
        	var self = this;
        	var selectedDirAndFileId = self.model.get('selectedDirAndFileIds')[0];
        	$("#fileList input[type='checkbox']").each(function(i){
        		var fid = $(this).attr('fileid');
        		if(selectedDirAndFileId == fid){
        			var nameContainer = [], parentsName = '';
        			nameContainer = $(this).parents('tr').find('span[name="nameContainer"]');
        			nameContainer.find('em:eq(0)').hide();
        			nameContainer.find('input').show().select();
        			return;
        		}
        	});
        }
	}));
})(jQuery, _, M139);
