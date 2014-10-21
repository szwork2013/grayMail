/**
 * @fileOverview 定义彩云文件缩略图视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Disk.View.Filethumbnail', superClass.extend(
	/**
	 *@lends M2012.Disk.View.prototype
	 */
	{
		el : "#fileList",
		name : "M2012.Disk.View.Filethumbnail",
        template: [ '<ul>',
                '<!--item start-->',
                '<li class="listItem" fileid="$id">',
                    '<p class="chackPbar"><input fileid="$id" name="checkbox" filetype="@getFileType" type="checkbox" class="checkView" style="display:none;"/></p>',
                    '<a hidefocus="true" href="javascript:void(0)" class="@getPicClass()">',
                        '<span class="spanimg"><img src="@getThumbnailUrl()" title="@getFullFileName()" filetype="@getFileType" fileid="$id" fsize="$filesize" name="fname" style="width: 65px; height:65px;" /></span>',
                    '@isShare()</a>',
                    '<div class="viewIntroduce" style="">',
                        '<p title="@getFullFileName()">',
                            '<span class="itemName" name="nameContainer">',
                                '<a fileid="$id" filetype="@getFileType" fsize="$filesize" href="javascript:void(0)" name="fname">@getShortName(15)</a>',
                                '<input type="text" filetype="@getFileType" fname="@getFullName()" exname="@getExtendName()" value="@getFullName()" maxlength="255" size="30" style="display:none; width:100px; overflow: hidden;"></input>',
                            '</span>',
                            '<span fileid="$id" fsize="$filesize" filetype="@getFileType" name="fname" style="cursor:pointer">@getExtendName()</span>',
                        '</p>',
                        '<p class="gray"><span style="display: none;">@getFileSize()</span></p>',
                        '@getOperateHtml()',
                    '</div>',
                '</li>',
                '<!--item end-->',
            '</ul>'].join(""),
        templateNoFileTmp: [
            '<ul class="dir_no_file">',
				'<li class="">',
					'<div class="imgInfo addr-imgInfo">',
						'<i class="imgLink i-addr-smile"></i>',
						'<dl style="text-align: left;">',
							'<dt>暂无文件，您可以</dt>',
							'<dd><a id="noFileAndUpload" href="javascript:">上传文件</a></dd>',
						'</dl>',
					'</div>',
				'</li>',
            '</ul>'].join(""),
		templateNoFile :['<ul class="dir_no_file">',
				'<li class="">',
		'<div class="imgInfo addr-imgInfo ta_c">',
			'<dl>',
				'<dt><img src="../../images/module/networkDisk/fileNo.jpg" /></dt>',
				'<dd>',
					'<p class="fz_14">暂无文件</p>',
				'</dd>',
				'<dd>',
					'<p>请点击左上角“上传”按钮添加</p>',
				'</dd>',
			'</dl>',
		'</div></li></ul>'].join(""),
		hoverTipsTemplate : ['<div class="tips netpictips pl_10" style="width:220px; top: 336px;left: 590px; z-index: 1000;  background:#fff; border:1px solid #cecece;">',
								'<div class="tips-text">',
									'<div class="imgInfo" style="overflow: hidden;">',
										'<p>文件名称：{fileName}</p>',
										'<p>文件大小：{fileSize}</p>',
										'<p>上传时间：{fileTime}</p>',
									'</div>',
								'</div>',
								'<div class="tipsTop diamond"></div>',
							'</div>'].join(""),
		events:{
		},
		initialize : function(options) {
			this.model = options.model;
			return superClass.prototype.initialize.apply(this, arguments);
		},
		initEvents : function(){
            var self = this;
            var $lis = $("#fileList ul > li");
			self.containter = {};
			//	$(".viewPic,.viewPicN").mouseover(function(){return false;}).mouseout(function(){return false;});
			/*
				$lis.hover(function(){
					var fileType = $(this).find("span[fileid]").attr("filetype");
					var fileid = $(this).find("span[fileid]").attr("fileid");
					var fileObject = self.model.getFileById(fileid);
					if(fileType == "file"){
						var offset = $(this).offset();
						self.currentHtml = "";
						if(fileid in self.containter){
							self.currentHtml = self.containter[fileid];
						}else{
							var formatString = $T.Utils.format(self.hoverTipsTemplate,{
								fileName : fileObject.name,
								fileSize : $T.Utils.getFileSizeText(fileObject.file.fileSize),
								fileTime : fileObject.createTime
							});
							self.currentHtml = $(formatString);
							self.currentHtml.appendTo(document.body)
							self.containter[fileid] = self.currentHtml;
						}
					//	setTimeout(function(){
							self.currentHtml.css({top: offset.top + 150, left: offset.left}).show();
					//	}, 50);
					}				
				},function(){
					var fileid = $(this).find("span[fileid]").attr("fileid");
					if(fileid in self.containter){
						self.currentHtml = self.containter[fileid];
					//	setTimeout(function(){
							self.currentHtml.hide();
					//	}, 50);
					}
				});
				*/	
            //初始化文件列表（图标模式）事件
            $lis.live("mouseenter", function(e){
                var target = $(this);
				if($(this).closest("ul").hasClass("dir_no_file")){
					return;
				}
				
                target.addClass("listViewHover");
                target.find(".chackPbar input").show();
				if($(this).attr("rel") == "uploadFile"){
					return;
				}
            //    self.showOperatesTable(target);
			//如果是文件，显示tips
			
					var fileType = target.find("a[fileid]").attr("filetype");
					var fileid = target.find("a[fileid]").attr("fileid");
					var fileObject = self.model.getFileById(fileid);
					if(fileType == "file"){
						var offset = target.offset();
						self.currentHtml = "";
						if(!fileObject){
							fileObject ={
								name : target.find("a[filetype]").text() + target.find("span.itemSuffix").text(),
								file : {
									fileSize : target.find("p.gray").text()
								},
								createTime : ''
							};
							fileid = Math.random().toString(); //刚上传的问题没有fileid，虚拟一个，并保存在dom，以便mouseleave的时候消失
							target.find("a[fileid]").attr("fileid", fileid);
						}
						
						if(fileid in self.containter){
							//self.currentHtml = self.containter[fileid];
							
						}else{
							var formatString = $T.Utils.format(self.hoverTipsTemplate,{
								fileName : fileObject.name,
								fileSize : $T.Utils.getFileSizeText(fileObject.file.fileSize || fileObject.fileSize),
								fileTime : fileObject.createTime
							});
							fileObject.name = target.find("img").attr("title");
							//self.currentHtml = $(formatString);
							//self.currentHtml.appendTo(document.body)
							self.currentHtml = '文件名称：'+fileObject.name+'\n'+'文件大小：'+$T.Utils.getFileSizeText(fileObject.file.fileSize || fileObject.fileSize)+'\n'+'上传时间：'+fileObject.createTime;
							//self.containter[fileid] = self.currentHtml;
							
						}
						target.attr('title',self.currentHtml)
					//	setTimeout(function(){
						//var top1 = offset.top + 117;
						//if(offset.top + 114 + self.currentHtml.height() > $(window).height()){
						//	top1 = top1 - self.currentHtml.height() - 127;
							//self.currentHtml.find(".diamond").addClass("tipsBottom").removeClass("tipsTop");
						//}else{
							//self.currentHtml.find(".diamond").addClass("tipsTop").removeClass("tipsBottom");
						//}
						//self.currentHtml.css({top: top1, left: offset.left}).show();
					//	}, 50);
					}
				
				
            });

            $lis.live("mouseleave", function(e){
                var target = $(this);
                var isSelected=target.find(".chackPbar input").attr("checked");
				var fileid = target.find("a[fileid]").attr("fileid");
					//if(fileid in self.containter){
						//self.currentHtml = self.containter[fileid];
					//	setTimeout(function(){
							//self.currentHtml.hide();
					//	}, 50);
					//}
                if(isSelected){
                    return;
                }else{
                    target.removeClass('listViewHover listViewChecked');
                    target.find("p.chackPbar").find('input').hide();
                    self.showSizeTable(target);
                }
            });
			$(document).mousemove(function(e){
			//	if(!$(e.target).is("li")){
			//		console.log(123);
			//		$(".tips").hide(); //防止拖动时tips无法消失
			//	}
			});
            //去掉缩略图模式表头列  “上传时间”    "大小"
            $(".diskTableList").find("th:gt(2)").hide();
			$("#fileName2").hide();
			$(".diskTableList.onScollTable").hide();
            
            // 图片加载出错
        	$("#fileList img").error(function(event){
        		var defaultImage = self.model.imagePath + 'fail.jpg';
        		this.src = defaultImage;
        	});
        },
        initClickEvents:function(){
            var self = this;
            $("#fileList").unbind("click").click(function(event){//todoe 当前view el来代替 fileList
                var target=$(event.target);
                var name = target.attr('name');
                if(name == 'checkbox'){    //选中
                    self.selectEvent(target);
                }else if(name == 'download'){  //下载
                    self.downloadEvent(target);
                    var fid = target.attr('fileid');
                    self.model.downloadLogger(fid);
                }else if(name == 'share'){   //共享
                    self.shareEvent(target);
                }else if(name == 'send'){ //发送
                    self.sendEvent(target);
                }else if(name == 'delete'){  //删除
                    self.deleteEvent(target);
                    var filetype = target.parents('li').find('.chackPbar input').attr('filetype');
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
            	var name=target.attr("name");
                var filetype=target.attr("filetype");
                var id = target.attr('fileid');
                if(name == "fname"){
                    if(filetype == self.model.dirTypes["FILE"] || !filetype){   //文件预览
                        self.model.trigger("previewFile",id, target);
                        BH({key : "diskv2_preview"});
                    }else{  // 打开文件夹
                        var dirObj = self.model.getDirById(id);
                        var dirLevel = dirObj.directoryLevel;
                        self.model.set("curDirType", filetype);
						top.firstEnterNet = false;
                        self.model.set('curDirId', id);
                        self.model.set("curDirLevel", dirLevel);

                        self.model.set("selectedFids", []);
                        self.model.set("selectedDirIds", []);
                        self.model.set("selectedDirAndFileIds", []);
                    }
                }
            };
            // 点击复选框以外的某些区域也可以 选中/取消 文件
            function toggleSelect(target){
                if(!target.is("p") && !target.is("li")){//
                	return;
                }

                var JCheckBox = getJCheckBox(target);
                if(JCheckBox.is(':disabled')){
					return;
				}
                
                var fid = JCheckBox.attr('fileid');
                var isRootDir = self.model.isRootDir(fid);
                if(fid == self.model.sysDirIds.ALBUM_ID || fid == self.model.sysDirIds.MUSIC_ID || isRootDir){
                    return ;
                }else{
                    setTimeout(function(){
                        var isSelected = JCheckBox.attr('checked');
                        JCheckBox.attr('checked', isSelected?false:true);
                        self.selectEvent(JCheckBox);
                    }, 100);
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
		render : function (){
		    var self = this;
		//    var pageData=self.model.getPageData(self.model.get("pageIndex"));
			var pageData = self.model.get("fileList"); //数据源已变化
            var imageList = self.model.get('imageList');
            var curDirType = self.model.get('curDirType');
            var html="";
            if(pageData.length>0){
			//	$("#toolBar").show();
				//hideOrShow(true);
                self.repeater=new Repeater(self.template);
                self.repeater.dataModel = self.model;
                self.repeater.Functions=self.model.renderFunctions;
                html=self.repeater.DataBind(pageData);
            }else{
                if(!self.model.get('curDirId')){ // 获取根目录下的文件列表前curDirId还未赋值
                    html = '';
					
                }else{
                    html = self.templateNoFile;
				//	$("#toolBar").hide();
					//hideOrShow(false);
                }
            }
			function hideOrShow(flag){
				if(flag){
					$("#download").show();
					$("#sendFile").show();
					$("#delete").show();
					//$("#more").show();
				}else{
					$("#download").hide();
					$("#sendFile").hide();
					$("#delete").hide();
					//$("#more").hide();
				}
			}
			//if(self.model.get("currentShowType")){ //关闭显示更多按钮
			//	$("#more").hide();
			//}else{
			//	$("#more").show();
			//}
            $("#fileList").html(html);
			$(".tips").hide(); //防止拖动时tips无法消失
			
			//空模板 上传事件
		//	$("#noFileAndUpload").click(function(){
		//		$("#uploadFileInput").click();
		//	});
			
            if(imageList.length > 0 || curDirType == self.model.dirTypes.ALBUM){
			//割接的账户不需要
				if(self.model.get("isMcloud") == "0"){
					self.showThumb();   //是图片显示缩略图
				}
            }
            self.hideOperates();    // 根据文件类型 屏蔽操作链接
            
            //self.initRenameEvents();    //重命名事件
            self.reselectFiles();   //翻页记忆选中文件
            self.model.trigger("renderSelectAll", pageData);
            
            self.initEvents();
            self.initClickEvents();
			//网盘拖动
			var diskDrag2 = M2012.Disk.View.Drag.prototype.createInstance(self,{model : self.model});
			//debugger;
			diskDrag2.render();
        },
        
        //图片列表显示缩略图
        showThumb : function(){
            var self=this;
            var isMcloud = this.model.get("isMcloud");
            //是图片显示缩略图
            self.model.getThumbImageList(function(result){
            	if(result.responseData && result.responseData.code == 'S_OK'){
                    var thumbnailList = result.responseData['var'].files;
                    var coverList = result.responseData['var'].covers;
                    self.model.set('thumbnailList', thumbnailList);
                    self.model.set('coverList', coverList);

                    $(".listItem img").each(function(){
                        var $curImg = $(this);
                        var fileid = $curImg.attr("fileid");
                        var filetype = $curImg.attr("filetype");
                        if(filetype == self.model.dirTypes.ALBUM && (fileid != self.model.sysDirIds.ALBUM_ID)){
                            var coverObj = self.model.getCoverById(fileid);
                            $curImg.attr("src", coverObj.coverUrl);
                        }else if(filetype == self.model.dirTypes.FILE){
                            var thumbObj = self.model.getThumbnailById(fileid);
                            if (thumbObj.thumbnailUrl != "") {
                                $curImg.attr("src", thumbObj.thumbnailUrl);

                                if (isMcloud == "1") {//存彩云，修改图片尺寸 todo 用委派
                                    $curImg.bind("load", function(){
                                        $curImg.css({width: "65px", height: "65px"});
                                    });
                                }
                            }
                        }
                    });
    			}else{
                    top.M139.UI.TipMessage.show(self.model.tipWords["THUMBNAIL_ERR"], {delay: 1000});
    				self.logger.error("fileListImg returnData error", "[disk:fileListImg]", result);
    			}
            });
        },
        
        // 根据文件类型 屏蔽操作链接
        hideOperates : function (){
            var self=this;

            if (self.model.get("fileList").length == 0) return;//空文件夹则返回

            $("#fileList li").each(function(i){
                var target=$(this);
                var filetype=target.find("p.chackPbar input").attr("filetype") || self.model.dirTypes['FILE'];
                var fileid = target.find('.chackPbar').find('input').attr('fileid');
                var isRootDir = self.model.isRootDir(fileid);

                if(filetype != self.model.dirTypes['FILE']){    //若是文件夹则不显示文件大小
                    target.find(".gray").html('');
                }

//                if(fileid == self.model.sysDirIds.ALBUM_ID || fileid == self.model.sysDirIds.MUSIC_ID){
                if (isRootDir) {//灰色显示我的相册+我的音乐复选框 系统的也可以选中
                //    target.find('.chackPbar').find('input').attr('disabled','disabled'); 
                }
                var jOperates = target.find('div.viewIntroduce p:eq(2)');

                if(isRootDir){  //系统目录
                    jOperates.find('a[name="download"]').siblings().hide();
                }else if(filetype == self.model.dirTypes['USER_DIR'] || (filetype == self.model.dirTypes['ALBUM'] && !isRootDir) || (filetype == self.model.dirTypes['MUSIC'] && !isRootDir)){  //自定义文件夹
                    var jSend = jOperates.find('a[name="send"]');
                    jSend.hide();
                    jSend.prev('span').hide();
                }
            });
        },
        // 显示操作栏段落
        showOperatesTable : function(target){
            var jIntr = target.find('div.viewIntroduce');
        //    jIntr.find('p:eq(1)').hide();
        //    jIntr.find('p:eq(2)').show();
        },
        // 显示文件大小段落
        showSizeTable : function(target){
            var jIntr = target.find('div.viewIntroduce');
            jIntr.find('p:eq(1)').show();
            jIntr.find('p:eq(2)').hide();
        },
        downloadEvent:function(target){
            var self = this,
                fid = target.attr('fileid');
            var dataSend = {};
            var fileObj = self.model.getFileById(fid);
            if(fileObj.type != self.model.dirTypes['FILE']){
                dataSend.directoryIds = fid;
                dataSend.dirType = fileObj.directory.dirType;
            }else{
                dataSend.fileIds = fid;
                dataSend.dirType = fileObj.type;
            }
            dataSend.isFriendShare = '0';//后台做了判断，彩云列表下载此参数都为0
            self.model.trigger("download", dataSend);
        },
        shareEvent : function(target){
            var self = this;
            var fid = target.attr('fileid');
    		self.model.set('shareFileId', [fid]);
	        self.model.showShareDialog(self.model.shareTypes['SINGLE']);
        },
        sendEvent:function(target){
            var self=this;
            var fid=target.attr("fileid");

            self.model.doCommand(self.model.commands.SEND_TO_MAIL, {
                data: {fileIds: [fid]},
                isLineCommand: true
            });
        },
        deleteEvent:function(target){
            var self = this,
                dirType = '',
                fid = target.attr('fileid'),
                filename = target.attr('fname'),
                fileObj = self.model.getFileById(fid);
                if(fileObj.directory && fileObj.directory.dirFlag){
                    dirType =fileObj.directory.dirFlag;
                }else{
                    dirType =fileObj.type;
                }

                var args = {command : self.model.commands['DELETE'], data : {}, filename:filename};  //filename用于用户没有选中而是直接点击删除的
                if(dirType != self.model.dirTypes['FILE']){
                    args.data.directoryIds = fid;
                }else{
                    args.data.fileIds = fid;
                }
                args.data.dirType = dirType;
                top.$App.trigger("diskCommand", args);
        },
        selectEvent:function(target){
            var self = this;
            var model = self.model;
            var fid = target.attr('fileid');
            var type = target.attr("filetype");
            var selectedFids = model.get('selectedFids');
            var shareFileId = model.get("shareFileId");
            var isRootDir = self.model.isRootDir(fid);
            var SelectSysDir = self.model.get("SelectSysDir");
            var selectedDirIds = model.get("selectedDirIds");
            var selectedDirAndFileIds = model.get("selectedDirAndFileIds");
            //避免系统文件夹选中
            if(SelectSysDir){
				var dIndex = $.inArray(SelectSysDir, selectedDirIds);
				selectedDirIds.splice(dIndex,1);
				self.model.set('selectedDirAndFileIds', selectedFids.concat(selectedDirIds));
				self.model.set("selectedDirIds",selectedDirIds)
				self.model.set("SelectSysDir",false)
		        selectedDirAndFileIds = model.get("selectedDirAndFileIds");
            }
            if(isRootDir){
	            target.attr("checked",false);
				top.M139.UI.TipMessage.show(self.model.tipWords.SYS_NO_SEL, { delay: 1500, className: "msgYellow" }); 
	            return false;
            }
            
            // 保存 / 清除 选中文件的ID
            model.toggle(fid, type == model.dirTypes.FILE ? selectedFids : selectedDirIds);
            model.toggle(fid, selectedDirAndFileIds);
            model.toggle(fid, shareFileId);
            // 渲染文件数量
            self.model.trigger("renderSelectCount");
            //改变li的样式
            var isSelected=target.attr("checked");
            if(isSelected){
                target.parents('li').attr('class', 'listItem listViewHover listViewChecked');
            }else{
                target.parents('li').attr('class', 'listItem listViewHover');
            }

        },
        reselectFiles : function(){
            var self = this;
            $("#fileList input[type='checkbox']").each(function(i){
                var fid = $(this).attr('fileid');
                if(!self.model.isUploadSuccess(fid)){
					$(this).attr('disabled', true);
				}
                
                var selectedFids = self.model.get('selectedDirAndFileIds');
                if($.inArray(fid, selectedFids) != -1 && !self.model.isRootDir(fid)){
                    $(this).attr('checked', true);
                    
                    var target = $(this).parents('li');     //给翻回去的那也之前选中的Li添加样式
                    target.addClass('listViewHover listViewChecked');
                    target.find("p.chackPbar").find('input').show();
                    self.showOperatesTable(target);
                }else{
                	$(this).attr('checked', false);
                	
                	var target = $(this).parents('li');
					target.removeClass('listViewHover listViewChecked');
					target.find("p.chackPbar").find('input').hide();
					self.showSizeTable(target);
                }
            });
        },

        // 隐藏重命名input
        hideRenameTable : function(target, newName){
            newName && target.prev("em").find("a").html(newName);
            target.prev('em').show();
            target.hide();
        },
        //显示重命名input
        showRenameTable : function(){
            var self = this;
            var selectedDirAndFileId = self.model.get('selectedDirAndFileIds')[0];
            $("#fileList input[type='checkbox']").each(function(i){
                var fid = $(this).attr('fileid');
                if(selectedDirAndFileId == fid){
                    var nameContainer = [];
                    nameContainer = $(this).parents('li').find('span[name="nameContainer"]');
                    nameContainer.find('em').hide();
                    nameContainer.find('input').show().select();
                    return;
                }
            });
        }
	}));
})(jQuery, _, M139);
