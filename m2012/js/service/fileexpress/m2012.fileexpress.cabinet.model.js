/**
 * @fileOverview 定义文件快递暂存柜模型层
 */
(function(jQuery, Backbone, _, M139) {
	var $ = jQuery;
	M139.namespace("M2012.Fileexpress.Cabinet.Model", Backbone.Model.extend({
		defaults : {
			pageSize : 30,//每页显示文件数
			pageIndex : 1,//当前页
			listMode : 0,// 列表模式：0 列表 1 图标
			fileList : [],// 当前使用的数据
			imageList : [],// 当前页图片列表
			originalList : [],// 原始数据（过期时间排序）
			selectedFids : [],// 被选中的文件fid
			searchStatus : 0, // 搜索状态
			isBtnActivate : 1, // 按钮是否为激活状态（重命名按钮会使用该属性）
			isMailToolShow : 1, // 是否提示用户安装小工具
			maxLengthName : 255, // 文件名最大长度 
			sortType : 'fileUpload', // 排序类型 'fileName' 'fileUpload' 'fileExpire' 'downloadCount' 'fileSize'
			sortIndex : -1 // 当前排序状态  1 升序 -1 降序
		},
		commands : {// 定义工具栏所有命令
			UPLOAD : 'upload',
			DOWNLOAD : 'download',
			SEND_TO_MAIL : 'sendToMail', // 发送到邮箱
			SEND_TO_PHONE : 'sendToPhone', // 发送到手机
			RENEW : 'renew', // 续期
			SAVE_TO_DISK : 'saveToDisk', // 存彩云
			RENAME : 'rename', // 重命名
			DELETE_FILE : 'deleteFile'// 删除
		},
		sendTypes : {// 发送类型
			MAIL : 'mail', // 邮件
			MOBILE : 'mobile' // 手机
		},
		previewTypes : {// 预览类型
			IMAGE : 'image', // 图片，当前页面弹出遮罩层预览
			DOCUMENT : 'document'// 文档，新窗口预览
		},
		sortTypes : {// 排序类型
			FILE_NAME : 'fileName',
			CREATE_TIME : 'createTime', // 上传时间
			EXPIRY_DATE : 'expiryDate', // 有效时间
			DOWNLOAD_TIMES : 'downloadTimes', // 下载次数
			FILE_SIZE : 'fileSize' // 大小
		},
		fileClass : {
			IMAGE : 'viewPic',
		//	DOCUMENT : 'viewPicN'
			DOCUMENT : 'viewPic'
		},
		urls : {// 跳转到其它页面的URL
			SEND_URL : '/m2012/html/fileexpress/send.html?sid='+top.sid,
			PREVIEW_URL : '/m2012/html/onlinepreview/online_preview.html?src=disk&sid={0}&mo={1}&id={2}&dl={3}&fi={4}&skin={5}&resourcePath={6}&diskservice={7}&filesize={8}&disk={9}'
		},
		imagePath : '../../images/module/FileExtract/',
		previewSize : 1024 * 1024 * 20, // 预览支持的文件大小20M
		downloadSize : 1024 * 1024 * 500, // 打包下载限制为500M todo
		thumbnailSize : '80*90', // 缩略图尺寸
		documentExts : "doc/docx/pdf/txt/htm/html/ppt/pptx/xls/xlsx/rar/zip/7z", // 可预览的文档拓展名
		imageExts : "jpg/gif/png/ico/jfif/tiff/tif/bmp/jpeg/jpe", // 图片类拓展名
		tipWords : {
        	DELETE_FILE_NAME : '确定删除文件：{0}？', // 显示待删除文件名
        	DELETE_FILE_COUNT : '文件删除后接收方将无法下载，您确认删除这 {0} 个文件吗？', // 显示待删除文件数量
        	EMPTY_NAME: "文件名称不能为空",
        	OVER_NAME: "最大长度不能超过{0}个字符",
        	INVALID_NAME: "不能有以下特殊字符 \\/:*?\"<>|",
        	DELETE_SUC : "删除成功!",
        	RENEW_SUC : "文件续期成功!",
        	RENAME_SUC : "文件重命名成功!",
        	RENAME_FAI : "文件重命名失败!",
        	SET_SUC : '设置成功!',
        	SELECTED_EMPTY : '未选中任何文件!',
        	OVER_SIZE: "文件总大小已超过500M，无法批量下载！",
        	DOWNLOAD_WAITING : "请等待...",
            UPLOADING: "关闭暂存柜，当前正在上传的文件会失败，是否关闭？",
            UPLOADING_CHANGE_VIEW: "切换视图，当前正在上传的文件会失败，是否切换？",
            SELECTEDFILE_TO_MANY :"文件个数超出套餐限制，请重新选择",
            ONLY_RENAME_ONE:"只能对单个文件（夹）重命名。"
        },
		logger : new top.M139.Logger({
			name : "M2012.Fileexpress.Cabinet.Model"
		}),
		name : 'M2012.Fileexpress.Cabinet.Model',
		callApi : M139.RichMail.API.call,
		defaultInputValue : '搜索暂存柜', // 搜索框默认值
		serviceItem : '0017', // 20元版
		/**
		 *暂存柜公共代码
		 *@constructs M2012.Compose.Model.StorageCabinet
		 *@param {Object} options 初始化参数集
		 *@example
		 */
		initialize : function(options) {
			this.dataSource = {};// 接口返回的原始数据
		},
		//获取暂存柜文件
		getDataSource : function(callback) {
			var self = this;
			var data = {
				actionId : 0,
				imageSize : self.thumbnailSize
			};
			self.callApi("file:getFiles", data, function(res) {
				if(callback) {
					callback(res);
				}
			});
		},
		//设置提醒方式
		setTipMode : function(callback) {
			var self = this;
			self.callApi("file:setFiles", getData(), function(res) {
				if(callback) {
					callback(res);
				}
			});
			
			function getData(){
				var isEmail = $("#tipMail")[0].checked ? 1 : 0;
				var isMobile = $("#tipMobile")[0].checked ? 1 : 0;
				var data = {
					mobileRemind : isMobile,
					emailRemind : isEmail
				};
				return data;
			}
		},
		//删除文件,多个fid用逗号隔开
		deleteFiles : function(callback, ids) {
			var self = this;
			self.callApi("file:delFiles", getData(), function(res) {
				if(callback) {
					callback(res);
				}
			});
			
			function getData(){
				var data = {
					fileIds : ids
				};
				return data;
			}
		},
		//下载文件,多个fid用逗号隔开
		downloadFiles : function(callback, ids) {
			var self = this;
			self.callApi("file:preDownload", getData(), function(res) {
				if(callback) {
					callback(res);
				}
			});
			
			function getData(){
				var data = {
					fileIds : ids
				};
				return data;
			}
		},
		//文件续期,多个fid用逗号隔开
		renewFiles : function(callback, ids) {
			var self = this;
			self.callApi("file:continueFiles", getData(), function(res) {
				if(callback) {
					callback(res);
				}
			});
			
			function getData(){
				var data = {
					fileIds : ids
				};
				return data;
			}
		},
		//重命名文件
		renameFile : function(callback, options) {
			var self = this;
			self.callApi("file:renameFiles", getData(), function(res) {
				if(callback) {
					callback(res);
				}
			});
			
			function getData(){
				var data = {
					fileId : options.fileId,
					name : options.name
				};
				return data;
			}
		},
		// 供 repeater 调用
		renderFunctions : {
			getFullFileName : function() {// 带拓展名
				var row = this.DataRow;
				return $T.Html.encode(row.fileName);
			},
			getShortFileName : function() {// 带拓展名
				var row = this.DataRow;
				var name = row.fileName;
				var point = name.lastIndexOf(".");
				if(point == -1 || name.length - point > 5){
					return $T.Html.encode(name.substring(0, 15)) + "…";
				}
				return $T.Html.encode(name.replace(/^(.{15}).*(\.[^.]+)$/, "$1…$2"));
				//return row.fileName.length > 20?row.fileName.substr(0, 20):row.fileName;
			},
			getFullName : function() {// 不带拓展名
				var row = this.DataRow;
				var name = row.fileName;
				var point = name.lastIndexOf(".");
				if(point == -1){
					return $T.Html.encode(name);
				}else{
					return $T.Html.encode(name.substring(0, point));
				}
			},
			getShortName : function(max){// 不带拓展名
				var row = this.DataRow;
				var name = row.fileName;
				var point = name.lastIndexOf(".");
				var keywords = $T.Html.encode($Url.getQueryObj()["keyword"]) || "";//从URL获取搜索的内容
				if(point != -1){
					name = name.substring(0, point);
				}
				if(name.length > max){
					name =  $T.Html.encode(name.substring(0, max)) + "…";
				}else{
					name =  $T.Html.encode(name);
				}
				//如果是来自搜索，替换搜索的关键字为红色
				if(keywords){
					name = name.replace(new RegExp("("+keywords+")"),"<font color='red'>$1</font>");
				}
				return name;
			},
			getExtendName : function(){// 仅返回拓展名
				var row = this.DataRow;
				var fileName = row.fileName;
				if(fileName.indexOf('.') == -1){
					return '';
				}
				
				var length = fileName.split(".").length;
            	return $T.Html.encode('.' + fileName.split(".")[length-1].toLowerCase());
			},
			getFileSize : function() {
				var row = this.DataRow;
				return $T.Utils.getFileSizeText(row.fileSize);
			},
			getFileIconClass : function() {
				var row = this.DataRow;
				return $T.Utils.getFileIcoClass2(0, row.fileName);
			},
			getThumbnailUrl : function(){
                var self = this;
                var row = this.DataRow;
                var model = self.dataModel;
				var thumbnailUrl = '';
				if(row.thumbnailImage && row.fileSize <= 1024 * 1024 * 6){
                	thumbnailUrl = row.thumbnailImage;
				//	thumbnailUrl = model.getThumbImagePath(row.fileName);
                }else{
                	thumbnailUrl = model.getThumbImagePath(row.fileName);
                }
                return thumbnailUrl;
			},
			getOperateHtml : function(){
				var self = this;
                var row = this.DataRow;
                var model = self.dataModel;
                return model.getOperateTemplate(row);
			},
			getPicClass : function(){
				var self = this;
                var row = this.DataRow;
                var model = self.dataModel;
                var fileName = row.fileName;
                if(model.isImage(fileName)){
                	return model.fileClass['IMAGE'];
                }else{
                	return model.fileClass['DOCUMENT'];
                }
			}
		},
		
		// 获取操作按钮html代码 todo
		getOperateTemplate : function(row){
			var self = this;
			var templates = {
				commonOperateTemplete : ['<a hideFocus="1" href="javascript:void(0)" name="download" fid="{fid}" target="_self">下载</a>',
										'<span>|</span>',
										'<a hideFocus="1" href="javascript:void(0)" name="send" fid="{fid}"> 发送 </a>',
										'<span>|</span>',
										'<a hideFocus="1" href="javascript:void(0)" name="renew" fid="{fid}"> 续期 </a>',
										'<span>|</span>',
										'<a hideFocus="1" href="javascript:void(0)" name="delete" fid="{fid}" fname="{shortFileName}"> 删除</a>'].join(""),
				errorOperateTemplete : ['<i class="i_warn_min"></i>',
						            '<span class="red">上传失败！</span>',
						            '<a hideFocus="1" href="javascript:void(0)" name="delete" fid="{fid}" fname="{shortFileName}">删除</a>'].join(""),
				commonIconTemplete : ['<p style="display:none;">',
										'<a hideFocus="1" href="javascript:void(0)" name="download" fid="{fid}" target="_self">下载</a>',
										'<span class="line">|</span>',
										'<a hideFocus="1" href="javascript:void(0)" name="send" fid="{fid}">发送</a>',
										'<span class="line">|</span>',
										'<a hideFocus="1" href="javascript:void(0)" name="renew" fid="{fid}">续期</a>',
										'<span class="line">|</span>',
										'<a hideFocus="1" href="javascript:void(0)" name="delete" fid="{fid}" fname="{shortFileName}">删除</a>',
									'</p>'].join(""),		            
				errorIconTemplete : ['<p class="gray failTips">',
							                '<i class="i_warn_min"></i>',
							                '<span class="red">上传失败！</span>',
							                '<a hideFocus="1" href="javascript:void(0)" name="delete" fid="{fid}" fname="{shortFileName}">删除</a>',
							            '</p>'].join("")		            
			};
			var mode = self.get('listMode');
            var isUploadSuccess = self.isUploadSuccess(row.fid);
			if(mode){
				if(!isUploadSuccess){
                	return $T.Utils.format(templates['errorIconTemplete'], {fid : row.fid, shortFileName : getShortFileName(row.fileName)});
                }else{
                	return $T.Utils.format(templates['commonIconTemplete'], {fid : row.fid, shortFileName : getShortFileName(row.fileName)});
                }
			}else{
				if(!isUploadSuccess){
                	return $T.Utils.format(templates['errorOperateTemplete'], {fid : row.fid, shortFileName : getShortFileName(row.fileName)});
                }else{
                	return $T.Utils.format(templates['commonOperateTemplete'], {fid : row.fid, shortFileName : getShortFileName(row.fileName)});
                }
			};
			
			function getShortFileName(name){
				var point = name.lastIndexOf(".");
				if(point == -1 || name.length - point > 5){
					return $T.Html.encode(name.substring(0, 15)) + "…";
				}
				return $T.Html.encode(name.replace(/^(.{15}).*(\.[^.]+)$/, "$1…$2"));
			}
		},
		
		// 过滤文件列表
		search : function(keywords) {
			var self = this;
			var files = self.get('originalList').concat();
			return $.grep(files, function(obj, i) {
				return obj.fileName.toLocaleLowerCase().indexOf(keywords.toLocaleLowerCase()) > -1;
			});
		},
		/*
		 * 表头排序
		 * @param options.field 排序字段
		 * @param options.fileList 排序数据源
		 * @return 排完序后的文件列表
		 */
		sort : function(options) {
			var self = this;
			//设置排序规则
			if(options.field) {
				var sorter = null;
				var sortIndex = self.get('sortIndex');
				switch (options.field) {
					case "fileSize":
						sorter = function(a, b) {
							return (a.fileSize - b.fileSize) * sortIndex;
						};
						break;
					case "fileName":
						sorter = function(a, b) {
							return (a.fileName.localeCompare(b.fileName)) * sortIndex;
						};
						break;
					case "remainTimes":
						sorter = function(a, b) {
							return (a.sendCount - b.sendCount) * sortIndex;
						};
						break;
					case "expiryDate":
						sorter = function(a, b) {
							return (a.expiryDate - b.expiryDate) * sortIndex;
						};
						break;
					case "createTime":
						sorter = function(a, b) {
							return ($Date.parse(a.createTime) - $Date.parse(b.createTime)) * sortIndex;
						};
						break;
					case "downloadTimes":
						sorter = function(a, b) {
							return (a.downloadTimes - b.downloadTimes) * sortIndex;
						};
						break;	
				}
				options.dataSource.sort(sorter);
			}
		},
		// 格式化过期时间
		formatExpireDate : function(dataSource) {
			$(dataSource).each(function() {
				if( typeof (this.expiryDate) == "string") {
					this.expiryDate = $Date.parse(this.expiryDate);
				}
			});
			return dataSource;
		},
		// 状态栏视图层模板相对应的对象，用户替换模板中的变量
		getStatusObj : function() {
			var self = this;
			var data = self.dataSource;
			var usedPercent = Math.ceil(data.usedSize / data.folderSize * 100);
			usedPercent = usedPercent > 100 ? 100 : usedPercent;
			var formatObj = {
				filesCount : data.fileList.length, // 文件数量
				usedPercent : usedPercent,
				usedSize : $T.Utils.getFileSizeText(data.usedSize),
				folderSize : $T.Utils.getFileSizeText(data.folderSize),
				keepDays : data.keepDays
			}
			return formatObj;
		},
		// 获取总页数
		getPageCount : function() {
			var messageCount = this.get('fileList').length;
			var result = Math.ceil(messageCount / this.get("pageSize"));
			if(result <= 0) {
				result = 1
			};//最小页数为1
			return result;
		},
		// 获取第N页的文件列表
		getPageData : function(nPage){
			var start = (nPage - 1) * this.get("pageSize");
			var end = 0;
			var pageCount = this.getPageCount();
			if(nPage < pageCount){
				end = start + this.get("pageSize");
			}else{
				end = this.get('fileList').length;
			}
			var pageData = this.get('fileList').slice(start, end);
			// this.setImageIndex(pageData); // 接口无法同时返回多张图片的下载地址，先做单张预览
			return pageData;
		},
		//  设置图片序数属性，方便图片预览 ，如果不是图片imageIndex赋值-1
		loadFileImageIndex : function(fileList){
			if(!fileList || !$.isArray(fileList)){
				return;
			}
			var self = this;
			var index = 0;
			$(fileList).each(function(i){
				var fileName = this.fileName;
				if(self.isImage(fileName)){
					this.imageIndex = index++;
					self.get('imageList').push(this);
				}else{
					this.imageIndex = -1;
				}
	   		});
		},
		// 判断用户是否安装邮箱小工具
		isSetupMailTool : function(){
			return M139.Plugin.ScreenControl.isScreenControlSetup();
		},
		//验证文件名
        getErrorMsg : function(name) {
        	var self = this;
            if (!name) {
                return self.tipWords['EMPTY_NAME'];
            }
            if (name.length > self.get('maxLengthName')) {
                return $T.Utils.format(self.tipWords['OVER_NAME'], [self.get('maxLengthName')]);
            }
            if (!self.isRightName(name)) {
                return self.tipWords['INVALID_NAME'];
            }
            return '';
        },
		//判断文件名是否正确
        isRightName: function(name) {
            var reg = /[*|:"<>?\\/]/;
            return !reg.test(name);
        },
		// 遍历数组，存在某项则删除，不存在则添加
		toggle : function(item, array){
			if(!item || !$.isArray(array)){
				return;
			}
			var index = $.inArray(item, array);
			if(index != -1){
				array.splice(index, 1);
			}else{
				array.push(item);
			}
		},
		// 根据fid清除数据
		clearFiles : function(fids, array){
			var self = this;
			if(!fids || !$.isArray(fids) || !$.isArray(array)){
				return;
			}
			$(fids).each(function(i){
				self.toggle(this, array);
			});
		},
		getResource : function () {
	        var resourcePath = window.top.resourcePath;
	        if (top.isRichmail) {//rm环境,返回rm变量
	            resourcePath = window.top.rmResourcePath;
	        }
	        return resourcePath;
	   },
	   // 获取用户选中的文件列表
	   getSelectedFiles : function(){
	   		var self = this;
	   		var files = [];
	   		var fileList = self.get('originalList');
	   		var selectedFids = self.get('selectedFids');
	   		$(fileList).each(function(i){
	   			var fid = this.fid;
	   			if($.inArray(fid, selectedFids) != -1){
	   				files.push(this);
	   			}
	   		});
	   		return files;
	   },
	   // 全选
	   selectAll : function(){
	   		var self = this;
	   		//var fileList = self.get('fileList');
	   		var fileList = self.getPageData(self.get("pageIndex"));
	   		var selectedFids = self.get('selectedFids');
	   		$(fileList).each(function(i){
	   			var fid = this.fid;
	   			if($.inArray(fid, selectedFids) == -1){
	   				if(self.isUploadSuccess(fid)){
						selectedFids.push(fid);
					}
	   			}
	   		});
	   },
	   // 全不选
	   selectNone : function(){
	   		var self = this;
	   		var fileList = self.getPageData(self.get("pageIndex"));
	   		var selectedFids = self.get('selectedFids');
	   		$(fileList).each(function(i){
	   			var fid = this.fid;
	   			var index = $.inArray(fid, selectedFids);
				if(index != -1){
					selectedFids.splice(index, 1);
				}
	   			
	   		});
	   },
	   // 判断当前页有没有文件被选中
	   hasFileSelected : function(){
	   		var self = this;
	   		var hasFile = false;
	   		var fileList = self.getPageData(self.get("pageIndex"));
	   		var selectedFids = self.get('selectedFids');
	   		$(fileList).each(function(i){
	   			var fid = this.fid;
	   			var index = $.inArray(fid, selectedFids);
				if(index != -1){
					hasFile = true;
					return false;
				}
	   		});
	   },
	   // 根据文件ID返回文件对象(从model中originalList获取)
	   getFileById : function(fid){
	   		if(!fid){
	   			return;
	   		}
	   		var self = this;
	   		var file = {};
	   		var originalList = self.get('originalList');
	   		$(originalList).each(function(i){
	   			var fileId = this.fid;
	   			if(fileId === fid){
	   				file = this;
	   				return false;
	   			}
	   		});
	   		return file;
	   },

        // 根据文件ID返回文件对象(从model中fileList获取)
        getFileByIdFromFileList : function(fid){
            if(!fid){
                return;
            }
            var self = this;
            var file = {};
            var fileList = self.get('fileList');
            $(fileList).each(function(i){
                var fileId = this.fid;
                if(fileId === fid){
                    file = this;
                    return false;
                }
            });
            return file;
        },

        //从model中fileList 及 originalList删除文件
        deleteFileFromModel: function (fid) {
            var originalList = this.get("originalList");
            var fileList = this.get("fileList");
            var curFileFromOriginalList = this.getFileById(fid);
            var curFileFromFileList = this.getFileByIdFromFileList(fid);

            console.log("originalList删除前有文件个数：" + originalList.length + "");
            console.log("fileList删除前有文件个数：" + originalList.length + "");
            this.toggle(curFileFromOriginalList, originalList);
            this.toggle(curFileFromFileList, fileList);
            console.log("originalList删除后有文件个数：" + originalList.length + "");
            console.log("fileList删除后有文件个数：" + originalList.length + "");
        },
	   
	   // 判断文件是否上传成功
	   isUploadSuccess : function(fid){
	   		var self = this;
	   		var fileObj = self.getFileById(fid);
	   		if(!fileObj){
	   			return false;
	   		}
	   		if(fileObj.state == '0'){ // 旧文件state 0 表示上传成功 ，新文件fileUploadSize == fileSize 表示上传成功
	   			return true;
	   		}
	   		
	   		var fileSize = parseInt(fileObj.fileSize, 10);
	   		var fileUploadSize = parseInt(fileObj.fileUploadSize, 10);
	   		return fileSize === fileUploadSize?true : false;
	   },
	   
	   // 根据文件ID返回文件名
	   getNameList : function(ids){
	   		if(!$.isArray(ids)){
	   			return;
	   		}
	   		var self = this;
	   		var names = [];
	   		for(var i = 0,len = ids.length;i < len;i++){
	   			var fileObj = self.getFileById(ids[i]);
	   			names.push(fileObj.fileName);
	   		}
	   		return names;
	   },
	   // 获取文件拓展名
	   getExtname : function(fileName) {
	        if (fileName) {
	            var reg = /\.([^.]+)$/;
	            var results = fileName.match(reg);
	            return results ? results[1].toLowerCase() : "";
	        } else {
	            return "";
	        }
	    },
	    // 判断文件是否超过预览支持的最大尺寸
	   isOverSize : function(fileSize){
	   		if(!fileSize){
	   			return;
	   		}
	   		var self = this;
	   		if(fileSize <= self.previewSize){
	   			return true;
	   		}else{
	   			return false;
	   		}
	   },
	    // 根据文件名获取预览类型 
	   getPreviewType : function(fileName){
	   		var self = this;
	   		var ext = self.getExtname(fileName);
	   		if(self.documentExts.indexOf(ext) != -1){
	   			return self.previewTypes['DOCUMENT'];
	   		}else if(self.imageExts.indexOf(ext) != -1){
	   			return self.previewTypes['IMAGE'];
	   		}
	   },
	   // 获取完整的附件预览地址模板
	   getPreviewUrlTemplate : function(){
			var self = this;
			return "http://" + top.location.host + self.urls['PREVIEW_URL'];
	   },
	   // 获取暂存柜允许上传的最大附件
	   getMaxUploadSize : function(){
	   		var maxSize = 1;
            if (top.SiteConfig.comboUpgrade) {
                maxSize = Math.floor(top.$User.getCapacity("maxannexsize") / 1024) || 4;
            }
            return maxSize;
	   },
	   // 根据文件名获取文件缩略图路径
	   getThumbImagePath : function(fileName){
	   		if(!fileName){
	   			return;
	   		}
	   		var self = this;
	   		var path = '';
	   		return self.imagePath + self.getThumbImageName(fileName);
	   },
	   // 根据文件名获取文件缩略图名称（非图片）
	   getThumbImageName : function(fileName){
	   		var doc = 'doc/docx',
	   			html = 'htm/html',
	   			ppt = 'ppt/pptx',
	   			xls = 'xls/xlsx',
	   			rar = 'rar/zip/7z',
				music = 'mp3/wma/wav/mod/m4a/',
				vedio = 'mp4,wmv,flv,rmvb,3gp,avi,mpg,mkv,asf,mov,rm',
	   			other = 'pdf/ai/cd/dvd/psd/fla/swf/txt/exe';
			var	img = 'bmp/jpeg/jpg/png/gif/tif';
	   		var extName = $T.Url.getFileExtName(fileName);
			if(extName == "") {
                    return 'default.png';
			}
			if(img.indexOf(extName) != -1){
				return 'jpg.png';
			}
			if("eml".indexOf(extName) != -1){
					return 'eml.png';
			}
	   		if(doc.indexOf(extName) != -1){
	   			return 'doc.png';
	   		}
	   		if(html.indexOf(extName) != -1){
	   			return 'html.png';
	   		}
	   		if(ppt.indexOf(extName) != -1){
	   			return 'ppt.png';
	   		}
	   		if(xls.indexOf(extName) != -1){
	   			return 'xls.png';
	   		}
	   		if(rar.indexOf(extName) != -1){
	   			return 'rar.png';
	   		}
			if(music.indexOf(extName) != -1){
                    return 'music.png';
			}
			if(vedio.indexOf(extName) != -1){
					return 'rmvb.png';
			}
	   		if(other.indexOf(extName) != -1){
	   			return extName + '.png';
	   		}
	   		return 'default.jpg';
	   },
	   // 根据文件名判断文件是否为图片(且支持预览)
	   isImage : function(fileName){
	   		if(!fileName){
	   			return;
	   		}
	   		var self = this;
	   		var extName = $T.Url.getFileExtName(fileName);
	   		return self.imageExts.indexOf(extName) == -1?false:true;
	   },
	   
	   // 获取用户选中的文件总容量
	   getSelectedFileSize : function(){
	   		var self = this;
	   		var selectedFiles = self.getSelectedFiles();
	   		var totalSize = 0;
	   		$(selectedFiles).each(function(i){
	   			var fid = this.fid;
	   			totalSize += parseInt(this.fileSize, 10);
	   		});
	   		return totalSize;
	   },
	   
	   // 判断用户选中的文件总大小是否支持打包下载
	   isSupportDownload : function(){
	   		var self = this;
	   		var selectedFiles = self.get('selectedFids');
	   		if(selectedFiles.length === 1){
	   			return true;
	   		}
	   		return self.getSelectedFileSize() > self.downloadSize?false : true;
	   },
	   popupComposeSmallPop: function(fileList){
			var self = this;
			var itemTemp = '<li rel="largeAttach" objId="{objId}" filetype="i_cloudS"><i class="i_bigAttachmentS"></i>\
					<span class="ml_5">{prefix}<span class="gray">{suffix}</span></span>\
					<span class="gray ml_5">({fileSizeText})<span class="tiquma pl_5 black" style="display:none;">提取码：{tiquma}</span></span>\
					<a hideFocus="1" class="ml_5" href="javascript:void(0)" removeLargeAttach="{objId}">删除</a></li>';
			if (fileList.length === 0) {
	            return ;
            }
			function getShortName(fileName) {
						if (fileName.length <= 30) return fileName;
						var point = fileName.lastIndexOf(".");
						if (point == -1 || fileName.length - point > 5) return fileName.substring(0, 28) + "…";
						return fileName.replace(/^(.{26}).*(\.[^.]+)$/, "$1…$2");
			}

					var mailfileList = fileList;
					var htmlCode = "";
					var firstFileName = "";
					
					firstFileName = mailfileList[0].fileName;
					for(t = 0 ; t < mailfileList.length; t++){
						var item = mailfileList[t];
						var shortName = getShortName(item.fileName),
							prefix = shortName.substring(0, shortName.lastIndexOf('.') + 1),
							suffix = shortName.substring(shortName.lastIndexOf('.') + 1, shortName.length);
						var data = {
								objId : item.fid,
								prefix: prefix,
								suffix: suffix,
								fileSizeText: M139.Text.Utils.getFileSizeText(item.fileSize),
								fileId: item.fid
						};
						htmlCode += top.$T.Utils.format(itemTemp, data);
					}	
					console.log(htmlCode);
					top.$Evocation.create({type: "compose", subject: "【139邮箱-暂存柜】" + firstFileName, content: "", whereFrom: "file", diskContent: htmlCode, fileContentJSON:mailfileList});
		},
	   // 跳转到文件发送页
	   gotoSendPage : function(options){
	   		var self = this;
			var fileList = options.fileList;
	   		var data = {
				fileList : fileList,
				type : options.type || self.sendTypes['MAIL'],
				from : "cabinet"
			};
		//	var url = self.urls['SEND_URL'];
        //    url = $cabinetApp.inputDataToUrl(url, data);
        //    location.href = url;
		//debugger;
			this.popupComposeSmallPop(fileList);
	   },
	   
	   // 判断用户是否为20元版
	   isServiceItem : function(){
	   		var self = this;
	   		return top.$User.getServiceItem() === self.serviceItem?true:false;
	   }
	}));
})(jQuery, Backbone, _, M139);
