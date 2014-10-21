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
				                 '<td class="wh1 t-check"><input fileid="$id" filetype="@getFileType" type="checkbox"></td>',
				                 '<td>',
									'<div class="fl p_relative">',
										'<a href="javascript:void(0);" class="@getFileIconClass()"></a>',
										'@isShare()',
									'</div>',
				                    '<a hidefocus="true" href="javascript:void(0)" class="attchName" title="@getFullFileName()" style="">',
										'<span name="nameContainer">',
											'<em fileid="$id" fsize="@getFileIntSize()" filetype="@getFileType" name="fname">@getShortName(30)</em>',
											'<input type="text" fname="@getFullName()" exname="@getExtendName()" value="@getFullName()" maxlength="255" size="30" style="display:none;" />',
											'<em fileid="$id" fsize="@getFileIntSize()" filetype="@getFileType" name="fname">@getExtendName()</em>',
										'</span>',
									'</a>',
				                    '<div class="attachment" style="display: none;">@getOperateHtml()</div>',
				                 '</td>',
				                 '<td class="wh5 gray">$createTime</td>',
				                 '<td class="wh6 gray">@getFileSize()</td>',
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
								    '<div class="imgInfo addr-imgInfo ta_c">',
										'<dl>',
											'<dt><img src="../../images/module/networkDisk/fileNo.jpg" /></dt>',
											'<dd><p class="fz_14">暂无文件</p></dd>',
											'<dd><p>请点击左上角“上传”按钮添加</p></dd>',
										'</dl>',
									'</div>',
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
		// 渲染列表
		render : function (){
		    var self = this;
		//    var pageData = self.model.getPageData(self.model.get("pageIndex"));
			var pageData = self.model.get("fileList"); //数据源已变化
		    var html = '';
		    if(pageData.length > 0){
			//	$("#toolBar").show();
				//hideOrShow(true);
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
			/*if(self.model.get("currentShowType")){
				$("#more").hide();
			}else{
				$("#more").show();
			}
*/		 	$("#fileList").html(html);
			//空模板 上传事件
			$("#noFileAndUpload").click(function(){
				$("#uploadFileInput").click();
			});
			self.fixList();
            self.hideOperates();
		 	self.reselectFiles();
		 	self.renderSelectAll(pageData);
		 	self.initClickEvents();
			//网盘拖动
			var diskDrag = M2012.Disk.View.Drag.prototype.createInstance(self,{model : self.model});
			//debugger;
			diskDrag.render();

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
				
				var selectedFids = self.model.get('selectedDirAndFileIds');
				if($.inArray(fid, selectedFids) != -1){
					if(self.model.isRootDir(fid)){
						$(this).attr('checked', false);
					}else{
						$(this).attr('checked', true);
					}
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
			var pageCount = selectedCount+ uploadFailureCount ;
			var isRootDir = 0;
			$.each(pageData,function(i,item){
				if(self.model.isRootDir(item.id)){
					isRootDir++
				}
			})
			if(pageCount == (pageData.length-isRootDir) && selectedCount !== 0){
				$("#selectAll").attr('checked', true);
			}else{
				$("#selectAll").attr('checked', false);
			}
		},
		
		// 列表模式用以下单击事件
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
				var filetype = target.attr('filetype');
				var id = target.attr('fileid');
				if(name === 'fname'){
					if(filetype == self.model.dirTypes['FILE'] || !filetype){// 预览文件
						self.previewFile(id, target);
						BH({key : "diskv2_preview"});
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
        		if(target.is("td") || target.is("a.attchName") || target.is("div.attachment")){
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
            var shareFileId = model.get("shareFileId");
            var isRootDir = self.model.isRootDir(fid);
            var SelectSysDir = self.model.get("SelectSysDir");
            var selectedDirIds = model.get("selectedDirIds");
            var selectedDirAndFileIds = model.get("selectedDirAndFileIds");
            //var startEle = model.get('startEle');

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
			
			/*$.each(selectedDirIds,function(i,item){
				if(!self.model.isRootDir(item.id)){
					var dIndex = $.inArray(item.id, selectedDirIds);
					selectedDirIds.splice(dIndex,1);
					self.model.set('selectedDirAndFileIds', selectedFids.concat(selectedDirIds));
					self.model.set("selectedDirIds",selectedDirIds)
					self.model.set("SelectSysDir",false)
			        selectedDirAndFileIds = model.get("selectedDirAndFileIds");
				}
			})
*/			var curPageData = self.model.get("fileList"); //数据源已变化
            var curPageCount = curPageData.length;
            //列表渲染选中
			$("#cleanSelected").click(function(){
				self.model.selectNone();
				if(self.model.get('listMode')){
						self.model.trigger('reselectIconFiles');
					}else{
						self.reselectFiles();//渲染未选中
				}
				$("#selectAll").attr("checked",false);
			});
			if(selectedCount > 0){
                if(selectedFids > 0 && selectedDirIds > 0){
                    $("#selectCount b:eq(0)").text(selectedFids);
                    $("#selectCount b:eq(1)").text(selectedDirIds);
                    $("#selectCount span").show();
                }else if(selectedFids > 0){
                    $("#selectCount b:eq(0)").text(selectedFids);
                    $("#selectCount span:eq(0)").show();
                    $("#selectCount span:eq(1)").hide();
                    $("#selectCount span:eq(2)").hide();

                }else if(selectedDirIds > 0){
                    $("#selectCount b:eq(1)").text(selectedDirIds);
                    $("#selectCount span:eq(0)").hide();
                    $("#selectCount span:eq(1)").hide();
                    $("#selectCount span:eq(2)").show();

                }
    			$("#fileName").hide();
    			$("#selectCount").show();
                if(selectedCount == curPageCount || ((selectedCount+2) == curPageCount)){   //+2是加上我的音乐和我的相册两项
    				$("#selectAll").attr('checked', true);
    			}else{
    				$("#selectAll").attr('checked', false);
    			}
			}else{
				$("#selectAll").attr('checked', false);
				
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

		// 播放视频（新窗口）
		playVideo : function(fileObj, target){
			//var link;
			var url = "/m2012/html/onlinepreview/video.html?sid=" + top.sid;
			var presentURL = "";
			var fileArea = fileObj.file;
			if(fileArea) {
				presentURL = fileArea.presentURL || fileArea.presentLURL || fileArea.presentHURL || fileObj.presentURL || fileObj.presentLURL || fileObj.presentHURL;
			}
			//if(!presentURL) return ;

			url += "&id=" + fileObj.id;
			url += "&name=" + encodeURIComponent(fileObj.name);
			url += "&curDirType=" + this.model.get("curDirType");
			//url += "&parentDirectoryId=" + fileObj.file.directoryId;

			// >>> start
			var isCheckEnv = /rd139cm/.test(location.host);
			var fakeData = {
				"1.mp4":"http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D985&root=/mnt/wfs9&pt=/527/38&fileid=8P52738f9a863cbbbd6494bdecc754e7ba.mp4&type=5&ui=15817256763&ci=1A11V6cCz1QD005201405161456198z2&cn=1&ct=3&time=1405910796&exp=32545&code=8936DD6FC6E87F0505ADE43C04AE7F80A9A29D2339BAFD0BE719FEF24D841830&ec=0",
				"1.mpg":"http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/eb5/c1&fileid=7meb5c1ad53f42f69058c5ef304433c6e6.wmv&type=51&ui=15817256763&ci=1A11V6cCz1QD31420140721104500usi&cn=1&ct=3&time=1405910796&exp=32545&code=ADF828DB0975DECF5BD0C08DC2A0ECD82422B81A0A9C73D83582E0432C5A5C51&ec=0",
				"苦爱.wmv":"http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/eb5/c1&fileid=7meb5c1ad53f42f69058c5ef304433c6e6.wmv&type=51&ui=15817256763&ci=1A11V6cCz1QD31420140721104500usi&cn=1&ct=3&time=1405910796&exp=32545&code=ADF828DB0975DECF5BD0C08DC2A0ECD82422B81A0A9C73D83582E0432C5A5C51&ec=0",
				"2014.03.28 你不是真正的快乐 邓紫棋.rmvb":"http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/f2d/11&fileid=7Uf2d11caffa544e5226e4e77f8e84c558.rmvb&type=5&ui=15817256763&ci=1A11V6cCz1QD00520140721104539yb9&cn=2014.03.28+%E4%BD%A0%E4%B8%8D%E6%98%AF%E7%9C%9F%E6%AD%A3%E7%9A%84%E5%BF%AB%E4%B9%90+...&ct=3&time=1405910796&exp=32545&code=0DF23563FC201009BDF387EED2F0DE370D1B1637A71F00607DA1867E40FB63CF&ec=0",
				"05.avi":"http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/5e2/bd&fileid=7C5e2bdda00fd13ec09c9008ed853f6b62.avi&type=5&ui=15817256763&ci=1A11V6cCz1QD31420140721104615utg&cn=05&ct=3&time=1405910796&exp=32545&code=9F09777E3E8BD716B516C5EB9BEEA2868445E0E12FC7FEABCB2242FA0A26C70A&ec=0",
				"一位挪威攝影師七天不眠不休之作_让你感动到落泪.mov":"http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/6e5/a0&fileid=7M6e5a0d2608cee6b35ba3b17ab1a72fdf.mp4&type=5&ui=15817256763&ci=1A11V6cCz1QD00520140531091838whx&cn=%E4%B8%80%E4%BD%8D%E6%8C%AA%E5%A8%81%E6%94%9D%E5%BD%B1%E5%B8%AB%E4%B8%83%E5%A4%A9%E4%B8%8D%E7%9C%A0%E4%B8%8D%E4%BC%91%E4%B9%8B%E4%BD%9C_%E8%AE%A9%E4%BD%A0%E6%84%9F%E5%8A%A8...&ct=3&time=1405911006&exp=32545&code=08B88EB43FC720E08F25CF318634478925849C97B67DDA44D2A84998019CA79E&ec=0",
				"1zsgx.mp4":"http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/1dd/6f&fileid=7h1dd6f56891e6ba601f066897d6ac59c9.mp4&type=51&ui=15817256763&ci=1A11V6cCz1QD3142014072119441665y&cn=1zsgx&ct=3&time=1405943091&exp=32545&code=AB76FB9890F643543E57B17AAAFFB92E117484084696FFD7D23B3FF6B8065C80&ec=0",
				"俞敏洪一分钟励志演讲.flv":"http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/e1c/0c&fileid=7Me1c0cc97c615c38ccaba9486c741827f.flv&type=51&ui=15817256763&ci=1A11V6cCz1QD31420140721104601ut8&cn=%E4%BF%9E%E6%95%8F%E6%B4%AA%E4%B8%80%E5%88%86%E9%92%9F%E5%8A%B1%E5%BF%97%E6%BC%94%E8%AE%B2&ct=3&time=1405943281&exp=32545&code=F91591E39702CDE8FC939426EDE3623E3B71A38EDF7C2A687D785EAA9F66CF1A&ec=0"
			};

			if(isCheckEnv && fakeData[fileObj.name]){
				presentURL = fakeData[fileObj.name];
			}
			// <<< end

			url += "&presentURL=" + encodeURIComponent(presentURL);

			/*if(this.model.get("listMode") == 0){
				link = target.closest("tr").find("a");
			} else {
				link = target.closest("li").find("a");
			}*/
			top.addBehavior("disk_video_play");
			console.log("play video");
			//link.attr({"href":url, "target":"_blank"});//[0].click();
			window.open(url, "_blank");
		},

		/**
		* 添加当前目录内歌曲到音乐播放器
		*/
		addToAudioPlayer : function(fileObj){
			var fileList = this.model.get("fileList");
			var playList = [];
			var musicTypes = "|mp3|wav|wma|m4a|ogg|webm|";
			
			var isCheckEnv = /rd139cm/.test(location.host);
			var fakeData = {
				"很有味道\u00A0-\u00A0格格.mp3": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/d31/2e&fileid=7bd312e176d5bc170e8fe62e942807f5b5.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD00520140718151600r8b&cn=%E5%BE%88%E6%9C%89%E5%91%B3%E9%81%93+-+%E6%A0%BC%E6%A0%BC&ct=2&time=1405667788&exp=32539&code=93ECFECF6E076B4660090D8EAD984B5CE43C29DDBAB39A68971698A3B2BDA33E&ec=0",
				"还是要幸福.wma": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/445/0c&fileid=7X4450cb95c1cd2e9f03012f703c20ebbf.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD31420140718151554oj8&cn=%E8%BF%98%E6%98%AF%E8%A6%81%E5%B9%B8%E7%A6%8F&ct=2&time=1405668444&exp=32539&code=2076B6386EA81D82C3368B5F540A18234852AB788E579AA007F44F519B45A616&ec=0",
				"草原的姑娘\u00A0-\u00A0哈琪.wav": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/477/78&fileid=7i477789d40d9fa8e6e114977e048ed069.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD00520140718151533r7u&cn=%E8%8D%89%E5%8E%9F%E7%9A%84%E5%A7%91%E5%A8%98+-+%E5%93%88%E7%90%AA&ct=2&time=1405667788&exp=32539&code=7B595832C1BE4441EF8469363C9C7E1247C2995FE8B13936055E76FE577A170A&ec=0",
				"风吹麦浪\u00A0-\u00A0李健+孙俪.mp3": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/ad4/81&fileid=79ad48139cc6aa80e3eca28a1038660109.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD31420140718151505oid&cn=%E9%A3%8E%E5%90%B9%E9%BA%A6%E6%B5%AA+-+%E6%9D%8E%E5%81%A5%2B%E5%AD%99%E4%BF%AA&ct=2&time=1405667788&exp=32539&code=2D41034E188AFACF7F43B4BB499C4FE595B7AF2942DEECDF8A04F7A8FA323C81&ec=0",
				"一万个舍不得\u00A0-\u00A0庄心妍.mp3": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/100/66&fileid=7Y10066053adb236d10bef757dc9d23a54.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD00520140718151454r7a&cn=%E4%B8%80%E4%B8%87%E4%B8%AA%E8%88%8D%E4%B8%8D%E5%BE%97+-+%E5%BA%84%E5%BF%83%E5%A6%8D&ct=2&time=1405668444&exp=32539&code=183C716E2D340BE1112F413912F3E48A01E26AC2E788476A5566CE404517544E&ec=0",
				"春风沉醉的晚上.mp3": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/dee/17&fileid=70dee17512e4891a613def4a40c5a716db.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD00520140718151441r70&cn=%E6%98%A5%E9%A3%8E%E6%B2%89%E9%86%89%E7%9A%84%E6%99%9A%E4%B8%8A&ct=2&time=1405667788&exp=32539&code=4E4D08F8863792EE6305994D240A77F804BB7821C6FBCF0751794A83EF826812&ec=0",
				"徐千雅\u00A0-\u00A0蓝色海风.mp3": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/344/6b&fileid=7g3446bc5f7124dc7b0bc3bd4e8cecea97.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD31420140718151425ohx&cn=%E5%BE%90%E5%8D%83%E9%9B%85+-+%E8%93%9D%E8%89%B2%E6%B5%B7%E9%A3%8E&ct=2&time=1405667788&exp=32539&code=24905D98656C3BD2C8B9EF9E446232CE745CD04DAECAB8CE366C5ECE6E629E68&ec=0",
				"祁隆、庄心妍\u00A0-\u00A0一万个舍不得.ape": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/8c2/e9&fileid=7I8c2e92452915399a4ee93ee050ae6ed1.ape&type=3&ui=15817256763&ci=1A11V6cCz1QD00520140718151410r6l&cn=%E7%A5%81%E9%9A%86%E3%80%81%E5%BA%84%E5%BF%83%E5%A6%8D+-+%E4%B8%80%E4%B8%87%E4%B8%AA%E8%88%8D%E4%B8%8D%E5%BE%97&ct=2&time=1405667788&exp=32539&code=729BD420D99E57D667406457E56F817107A5E2E8F7EFF9826E21C855CDECA568&ec=0",
				"万树繁花\u00A0-\u00A0格格.mp3": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/004/7c&fileid=7A0047c8fdcb331919b36a5aa6ce4790d2.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD31420140529094608kc5&cn=%E4%B8%87%E6%A0%91%E7%B9%81%E8%8A%B1+-+%E6%A0%BC%E6%A0%BC&ct=2&time=1405667788&exp=32539&code=D8E320590ECC2FEC97A2E0F151FA0E7AF8140406E207EA1E5CB3F0E4033E13EC&ec=0",
				"李欣汝\u00A0-\u00A0欣赏.ogg": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/8a9/22&fileid=7g8a922c0836690d2d75070e8432c1cd7f.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD00520140529094558kmu&cn=%E6%9D%8E%E6%AC%A3%E6%B1%9D+-+%E6%AC%A3%E8%B5%8F&ct=2&time=1405667788&exp=32539&code=70AAA7323D9A11BCD65719578A50D10A3168CD96E5BD5D89B83C5C4120CB8D9E&ec=0",
				"My\u00A0Love.mp3": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D984&root=/mnt/wfs8&pt=/53f/65&fileid=7Q53f6502c2f9794bf8cd65881b75eb147.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD31420140529094542kc1&cn=My+Love&ct=2&time=1405667788&exp=32539&code=ED73B787477A23E10A6AC71CF6897E775CD1730CB9D367D249E5431C4FA3823F&ec=0",
				"越单纯越幸福\u00A0-\u00A0王筝.wma": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D985&root=/mnt/wfs9&pt=/625/da&fileid=8S625dab71b45ad7cd798b099204f614a3.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD00520140523113921fpn&cn=%E8%B6%8A%E5%8D%95%E7%BA%AF%E8%B6%8A%E5%B9%B8%E7%A6%8F+-+%E7%8E%8B%E7%AD%9D&ct=2&time=1405667788&exp=32539&code=1FD97DE45F617E2FA9FC8471C6773BBC7B66ECE5652D53E3457FB48B20713C77&ec=0",
				"他.mp3": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D985&root=/mnt/wfs9&pt=/f2b/a2&fileid=8Of2ba2637867c91003bdcab98079f6327.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD00520140523113756fnd&cn=%E4%BB%96&ct=2&time=1405667788&exp=32539&code=70BF332B84AD3C70E348D3F5565E7FD18CDC29CED8F2C421439F0B5E80DBC830&ec=0",
				"卡通人生.mp3": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D985&root=/mnt/wfs9&pt=/6ba/6d&fileid=8B6ba6d2f68603ba6046efab0f84326cac.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD00520140523114041ftw&cn=%E5%8D%A1%E9%80%9A%E4%BA%BA%E7%94%9F&ct=2&time=1405667788&exp=32539&code=EA1E3DC57A21D904AE222B327CFB98165DC1754B126B59EB714894F45D6F16F8&ec=0",
				"蓝色海风\u00A0-\u00A0徐千雅.ogg": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D985&root=/mnt/wfs9&pt=/911/84&fileid=8R911847ff0bfee5f54bc025c18d128381.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD31420140516183225bw5&cn=%E8%93%9D%E8%89%B2%E6%B5%B7%E9%A3%8E+-+%E5%BE%90%E5%8D%83%E9%9B%85&ct=2&time=1405667788&exp=32539&code=771F577B2D0905FDD4EC4CDAC7E9EA48C230B73B3D690507E61DF3F5BE23CD66&ec=0",
				"1.m4a": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D985&root=/mnt/wfs9&pt=/54d/a9&fileid=8R54da9b72063c54d8306dca915d7c5a79.m4a&type=3&ui=15817256763&ci=1A11V6cCz1QD314201405161456248ze&cn=1&ct=2&time=1405667788&exp=32539&code=78B21E9CA88851544042E1D275339B708E548C8BF337C051A36710AD54ED1BBB&ec=0",
				"彩云之南\u00A0-\u00A0徐千雅.wma": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D985&root=/mnt/wfs9&pt=/747/e7&fileid=8D747e7f34bbb685f0be76673ee46dd5cf.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD005201405161427428ny&cn=%E5%BD%A9%E4%BA%91%E4%B9%8B%E5%8D%97+-+%E5%BE%90%E5%8D%83%E9%9B%85+&ct=2&time=1405667788&exp=32539&code=4B7D537C70599B8DE0D926A7DBF6E0F7E847DEF454A16A494CD7D28E2D279460&ec=0",
				"Stars.mp3": "http://media.caiyun.feixin.10086.cn:80/StorageWeb/servlet/GetFileByURLServlet?dm=D985&root=/mnt/wfs9&pt=/7b3/ee&fileid=8E7b3ee58cc6666fea38bb44651714f12b.mp3&type=3&ui=15817256763&ci=1A11V6cCz1QD005201405161427388nx&cn=Stars&ct=2&time=1405667788&exp=32539&code=E80EFF7FB5A6915F59204C5C03BC9B6E0A914368198470ABA5275C2427A3DADB&ec=0"
			};
			
			$.each(fileList, function(i, item){
				var ext = $Url.getFileExtName(item.name).toLowerCase();
				if(musicTypes.indexOf("|"+ext+"|") >= 0){
					playList.push({
						id: item.id,
						url: isCheckEnv && fakeData[item.name] || item.file && item.file.presentURL || item.presentURL,
						text: item.name
					});
					/*
					M139.RichMail.API.call("disk:getFile", {fileId: item.id}, function (result) {
						var data = null;
						if(result && (data = result.responseData)){
							top.MusicBox.addMusic(fileObj.id, playList);
						}
					});
					*/
				}
			});

			top.MusicBox.addMusic(fileObj.id, playList);
			top.MusicBox.show();
		},

		// 文件预览
		previewFile : function(fid, target){
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
			var fsize = fileObj.file.fileSize || fileObj.fileSize;
			var fname = fileObj.name;
			var previewType = self.model.getPreviewType(fname);

			if(previewType === self.model.previewTypes['AUDIO']){
				this.addToAudioPlayer(fileObj);
				return ;
			} else if(previewType === self.model.previewTypes['VIDEO']){
				this.playVideo(fileObj, target);
				return ;
			}

			if(!previewType){
				console.log('sorry, 文件类型不支持预览！！');
				return;
			}

			if(!self.model.isOverSize(parseInt(fsize))){
				console.log('sorry, 文件太大不支持预览！！');
				top.$Msg.alert("该文件超出了在线预览支持的文件大小，请下载后查看");
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
							self.previewImage(fileObj);
						}
					}
				}else{
					self.logger.error("preDownload returndata error", "[disk:preDownload]", result);
				}
			}, options);
		},
		
		/**
		* 图片单击事件，打开图片预览层
		* 并添加当前目录内的图片到幻灯片列表
		*/
		previewImage : function (fileObj) {

			var fileList = this.model.get("fileList");
			var index = 0;
			var imgList = [];
			var imgTypes = "|jpg|gif|png|ico|jfif|tiff|tif|bmp|jprg|jpe|";
			
			$.each(fileList, function(i, item){
				var ext = $Url.getFileExtName(item.name).toLowerCase();
				if(item.file === fileObj.file){
					index = imgList.length;
				}
				if(imgTypes.indexOf("|"+ext+"|") >= 0){
					// 坑，gif缩略图转换成静态图了，只能用presentURL
					imgList.push({
						thumbnailURL: item.file.thumbnailURL || item.thumbnailURL,
						bigthumbnailURL: item.file.presentURL || item.presentURL,
						presentURL: item.file.presentURL || item.presentURL,
						fileName: item.name
					});
				}
			});

			if (typeof (top.focusImagesView) != "undefined") {
				top.focusImagesView.render({ data: imgList, index : index });
			}else{
				top.M139.registerJS("M2012.OnlinePreview.FocusImages.View", "packs/focusimages.html.pack.js?v=" + Math.random());
				top.M139.requireJS(['M2012.OnlinePreview.FocusImages.View'], function () {
					top.focusImagesView = new top.M2012.OnlinePreview.FocusImages.View();
					top.focusImagesView.render({ data: imgList, index : index});
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
        },
		fixList:function(){
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
