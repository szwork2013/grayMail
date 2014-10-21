/**
 * @fileOverview 定义彩云文件时间轴视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Disk.View.FileThumbnailImageView', superClass.extend(
	/**
	 *@lends M2012.Disk.View.prototype
	 */
	{
		el : "#diskPicModle",
		name : "M2012.Disk.View.FileThumbnailImageView",
        template: ['<li>',
					'<input fileid="{id}" name="checkbox" filetype="file" style="display:none;" type="checkbox" />',
					'<img src="{images}" filetype="file" fileid="{id}" style="width: 120px; height:120px;" />',
				'</li>'].join(""),
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
		events:{
		},
		initialize : function(options) {
			this.model = options.model;
			return superClass.prototype.initialize.apply(this, arguments);
		},
		initEvents : function(){
            var self = this;
            var $lis = $("#diskPicModle ul > li");
			$lis.mouseenter(function(){
				$(this).find("input").show();
			}).mouseleave(function(){
				var target = $(this);
				var isSelected=target.find("input").attr("checked");
				if(!isSelected){
					target.find("input").hide();
				}
			});
			
			 // 图片加载出错
        	$("#diskPicModle img").error(function(event){
        		var defaultImage = self.model.imagePath + 'fail.jpg';
        		this.src = defaultImage;
        	});
        },
        initClickEvents:function(){
            var self = this;
            $("#fileList,#diskPicModle").unbind("click").click(function(event){//todoe 当前view el来代替 fileList
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
				//如果点了图片，处理复选框
				if(target[0].nodeName.toLowerCase() == "img"){
					var inputCheckbox = target.prev("input[name='checkbox']");
					if(inputCheckbox.attr("checked") != "checked"){
						inputCheckbox.attr("checked","checked");
					}else{
						inputCheckbox.removeAttr("checked");
					}
					self.selectEvent(inputCheckbox);
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
                        self.model.trigger("previewFile",id);
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
                if(fid == self.model.sysDirIds.ALBUM_ID || fid == self.model.sysDirIds.MUSIC_ID){
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
		createDateRange: function(){
			this.dateRange = [];
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
		},
		render : function (){
		    var self = this;
		//	debugger;
		//    var pageData=self.model.getPageData(self.model.get("pageIndex"));
			var pageData = self.model.get("fileList"); //数据源已变化
            var imageList = self.model.get('imageList');
            var curDirType = self.model.get('curDirType');
			var fileListOBJ = {};//数据对象，key-value：日期和当前日期对应数据
			var dateArr = [];
			for(var i = 0, len = pageData.length; i < len; i++){
				var pageDataItem = pageData[i];
				var modifyTime = pageDataItem["modifyTime"];
				var serverTime = $Date.parse(modifyTime);
				var today = new Date();
				var year = serverTime.getFullYear();
				var month = serverTime.getMonth() + 1;
				var day = serverTime.getDate();
				var ymd = year+ '-' + month + '-' + day;
				var ym = year+ '-' + month;
				if(today.getFullYear() == year && today.getMonth() + 1 == month && today.getDate() == day){
					if(!fileListOBJ[ymd]){
						fileListOBJ[ymd] = [pageDataItem];
						dateArr.push(ymd);
					}else{
						fileListOBJ[ymd].push(pageDataItem);
					}
				}else{
					if(!fileListOBJ[ym]){
						fileListOBJ[ym] = [pageDataItem];
						dateArr.push(ym);
					}else{
						fileListOBJ[ym].push(pageDataItem);
					}					
				}
				
				
			}
		//	debugger;
            var html= [];
			dateArr.sort().reverse();//日期排序+反转
		//	debugger;
            if(pageData.length>0){
				for(var t = 0,leng = dateArr.length; t < leng; t++){
					var key =  dateArr[t];
					var keyArr = key.split("-");
					var dateZh = "";
					if(keyArr.length == 3){
						dateZh = "今天";
					}else{
						dateZh = keyArr[0] + "年" + keyArr[1] + "月";
					}
					html.push("<h2>"+ dateZh +"</h2>");
					var fileListOBJItems = fileListOBJ[key];
					var lis = [];
					for(var j = 0, length = fileListOBJItems.length; j < length; j++){
						var fileListOBJItem = fileListOBJItems[j];
						lis.push(self.template.replace("{images}",fileListOBJItem.thumbnailURL).replace(/\{id\}/g,fileListOBJItem.id));
					}
					html.push("<ul class='diskPicShow clearfix'>" +lis.join("")+ "</ul>");
				}
			//	debugger;
				var clickToGetMore = ['<div class="diskPicModle2" id="clickToGetMore" style="display:none;">',
										'<a href="javascript:void(0);" id="aclickToGetMore">点击查看更多</a>',
									'</div>'].join("");
				$("#diskPicModle").html(html.join("") + clickToGetMore);
			//	console.log(html.join(""));
				//hideOrShow(true);
				if(self.model.get("totalSize") >= 30){
					$("#clickToGetMore").show();
				}else{
					$("#clickToGetMore").hide();
				}
				
				if(top.secondSSS){
					$("#clickToGetMore").hide();
				}
				$("#aclickToGetMore").click(function(){
					self.model.set('pageSize', 60);
					top.leftbarView.showImages();
					top.secondSSS = true;
					$(this).hide();
					self.model.set('pageSize', 30,{ slient: true});
				});
            //    self.repeater=new Repeater(self.template);
            //    self.repeater.dataModel = self.model;
            //    self.repeater.Functions=self.model.renderFunctions;
            //    html=self.repeater.DataBind(pageData);
            }else{
                if(!self.model.get('curDirId')){ // 获取根目录下的文件列表前curDirId还未赋值
                    html = '';
					
                }else{
                    html = "";
				//	$("#toolBar").hide();
					//hideOrShow(false);
                }
            }
			function hideOrShow(flag){
				if(flag){
					$("#download").show();
					$("#sendFile").show();
					$("#delete").show();
					//$("#more").show();关闭显示更多按钮
				}else{
					$("#download").hide();
					$("#sendFile").hide();
					$("#delete").hide();
					//$("#more").hide();关闭显示更多按钮
				}
			}
			//if(self.model.get("currentShowType")){关闭显示更多按钮
				//$("#more").hide();
			//}else{
				//$("#more").show();
			//}
            //$("#fileList").html(html);
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
        //    self.hideOperates();    // 根据文件类型 屏蔽操作链接
            
            //self.initRenameEvents();    //重命名事件
            self.reselectFiles();   //翻页记忆选中文件
    //        self.model.trigger("renderSelectAll", pageData);
            
            self.initEvents();
            self.initClickEvents();

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
            var selectedDirIds = model.get("selectedDirIds");
            var selectedDirAndFileIds = model.get("selectedDirAndFileIds");
            var shareFileId = model.get("shareFileId");
            // 保存 / 清除 选中文件的ID
            model.toggle(fid, type == model.dirTypes.FILE ? selectedFids : selectedDirIds);
            model.toggle(fid, selectedDirAndFileIds);
            model.toggle(fid, shareFileId);
            // 渲染文件数量
            self.model.trigger("renderSelectCount");
            //改变li的样式
            var isSelected=target.attr("checked");
            if(isSelected){
                target.parents('li').attr('class', 'listViewHoverAddBorder');
            }else{
                target.parents('li').attr('class', '');
            }

        },
        reselectFiles : function(){
            var self = this;
            $("#diskPicModle input[type='checkbox']").each(function(i){
                var fid = $(this).attr('fileid');
            //    if(!self.model.isUploadSuccess(fid)){
			//		$(this).attr('disabled', true);
			//	}
                
                var selectedFids = self.model.get('selectedDirAndFileIds');
                if($.inArray(fid, selectedFids) != -1){
                    $(this).attr('checked', true);
                    
                    var target = $(this).parents('li');     //给翻回去的那也之前选中的Li添加样式
                    target.addClass('listViewHoverAddBorder');
                    target.find('input').show();
                //    self.showOperatesTable(target);
                }else{
                	$(this).attr('checked', false);
                	var target = $(this).parents('li');
					target.removeClass('listViewHoverAddBorder');
					target.find('input').hide();
				//	self.showSizeTable(target);
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
