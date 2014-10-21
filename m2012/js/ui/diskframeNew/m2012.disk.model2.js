/**
 * @fileOverview 定义彩云模块彩云页面模型层
 */
(function(jQuery, Backbone, _, M139) {
	var $ = jQuery;
	M139.namespace("M2012.Disk.Model", Backbone.Model.extend({
		defaults : {
			pageSize : 30,//每页显示文件数
			pageIndex : 1,//当前页
			listMode : 0,// 列表模式：0 列表 1 图标
			diskInfo : {},// 彩云信息
            isMcloud: "0",//是否存彩云：0 否；1 是
			sysDirList : [],// 系统文件夹列表
            sysDirListObj : {},// 系统文件夹列表转存为jason格式
            directorys : [],    //彩云所有目录列表
			curDirId : '',// 当前目录ID
            //curDirType: 0,//父文件夹类型
            curDirType: '',//当前目录类型
			curDirInfo : {},// 当前目录信息
			fileList : [],// 当前目录下的文件列表(包含子目录)
			imageList : [],// 当前页图片列表
            imageListObj : {},// 当前页缩略图
            thumbnailList : [],// 当前页缩略图列表
            thumbnailListObj : {},// 当前页缩略图列表
            coverList : [],// 当前页封面列表
			selectedFids : [],// 被选中的文件fid
            selectedDirIds : [], //当前选中的所有目录id
            selectedDirAndFileIds : [], //当前选中的目录和文件id
            selectedDirType: 1,//当前选中的目录类型
			searchStatus : 0, // 搜索状态
			hasSysFolders : 1,// 按钮是否为激活状态（选中系统文件夹使用该属性，除了下载按钮，其他的隐藏）
			hasFolders : 1,
			isRenameActivate : 1, // 按钮是否为激活状态（重命名按钮会使用该属性）
            isShareActivate : 1, // 按钮是否为激活状态（分享按钮会使用该属性）
            isSetCoverActivate : 1, //设为封面是否为激活状态
            isPostCardActivate : 1, // 制作明信片是否为激活状态
            isPlayActivate : 1, // 播放是否为激活状态
            isCreateBtnShow : 0,    //新建文件夹按钮是否为显示状态（我的相册+我的音乐到第二级目录，自定义文件夹可到4级目录）
            curDirLevel : '',   //当前是第几级目录
			isMailToolShow : 1, // 是否提示用户安装小工具
			maxLengthName : 255, // 文件名最大长度
			sortType : 'fileUpload', // 排序类型 'fileName' 'fileUpload' 'fileExpire' 'downloadCount' 'fileSize'
			sortIndex : -1, // 当前排序状态  1 升序 -1 降序
			parentDirs : [], // 当前目录的所有父辈目录(包括祖父辈)
            isMailToolShow : 1, // 是否提示用户安装小工具
            isRemoveFlash: true, // 是否删除flash，在onbeforeunload中使用，卸载页面前需要去掉flash
			shareFileId : [], // 共享文件
			totalSize : 0, //当前目录总数据
			diskFileList :[]
		},
		viewTypes : {
        	LOCAL_FILE : 'localFile',
        	DISK : 'disk',
        	CABINET : 'cabinet'
        },
		totalCurDirId : [],//所有打开过的目录id
		totalFileList : [],
		commands : {// 定义工具栏所有命令
			UPLOAD : 'upload',
			DOWNLOAD : 'download',
			PLAY : 'play',
			SEND_TO_MAIL : 'sendToMail', // 发送到邮箱
			SEND_TO_PHONE : 'sendToPhone', // 发送到手机
            SET_COVER : 'setCover', //设为封面
            POSTCARD : 'postcard', //明信片
			RENAME : 'rename', // 重命名
            DELETE: 'deleteDirsAndFiles',// 删除目录和文件
            REMOVE: 'remove',//移动
            SHARE: 'share',//共享
            CREATE_DIR: 'createDir',//新建文件夹
			DRAG : 'dragMove' //拖拽移动
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
			UPLOAD_TIME : 'uploadTime', // 上传时间 CREATE_TIME
			FILE_SIZE : 'fileSize' // 大小
		},
		dirTypes : {// 文件类型
            ROOT: 0,//根目录 此值是前端定义，用以将根目录和其他目录进行区分，服务端定义为1
            USER_DIR : 1, // 自定义文件夹
            FILE : 'file', // 文件
            DIRECTORY : 'directory', // 文件
            ALBUM : 3, // 我的相册
            MUSIC : 4 // 我的音乐
        },
        dirFlag: {//是否系统文件夹
            SYS_DIR: "0",//系统目录
            NO_SYS_DIR: "1"//非系统目录
        },
        shareTypes : {// 分享类型
        	SINGLE : 'single', // 单击文件列表超链接分享的是单个文件
        	BATCH : 'batch' // 单击工具栏命令按钮分享的是批量选中的文件
        },
        dirLevelLimit : {   //新建文件夹创建级数限制
            USER_DIR : 4,   //自定义文件夹总共可以出现五级，允许新建到第四级
            SYS_DIR : 2     //系统文件夹下到第二级，包含第二级
        },
        sysDirIds :{
           ALBUM_ID : 20,
           MUSIC_ID : 30
        },
        fileClass : {
			IMAGE : 'viewPic',
		//	DOCUMENT : 'viewPicN'
			DOCUMENT : 'viewPic'
		},
		urls : {// 跳转到其它页面的URL
			SEND_URL : '/m2012/html/fileexpress/send.html?sid='+top.sid,
            SHARE_URL: '/m2012/html/disk/disk_dialogsharefile.html?sid='+top.sid,
			PREVIEW_URL : '/m2012/html/onlinepreview/online_preview.html?src=disk&sid={0}&id={2}&dl={3}&fi={4}&skin={5}&resourcePath={6}&diskservice={7}&filesize={8}&disk={9}'
		},
		previewSize : 1024 * 1024 * 20, // 预览支持的文件大小
        thumbnailSize :'65*65',
        postCardThumbnailSize : '450*350',
        limitSizeSend: 200 * 1024 * 1024,
        imagePath : '../../images/module/FileExtract/',
        imageGlobalPath : '../../images/global/',
		documentExts : "doc/docx/xls/xls/ppt/pdf/txt/htm/html/pptx/xlsx/rar/zip/7z", // 可预览的文档拓展名
		imageExts : "jpg/gif/png/ico/jfif/tiff/tif/bmp/jpeg/jpe", // 图片类拓展名
		tipWords : {
        	DELETE_FILEANDDIR : '删除操作无法恢复，您确定要删除{0}个文件夹，{1}个文件吗？', // 提示待刪除文件數量
        	DELETE_FILE : '删除操作无法恢复，您确定要删除{0}个文件吗？？', // 提示待刪除文件數量
        	DELETE_DIR : '删除文件夹将同时删除其中的文件，您确定要删除{0}个文件夹吗？', // 提示待刪除文件數量
        	DELETE_FILE_COUNT : '文件删除后接收方将无法下载，您确认删除这 {0} 个文件吗？', // 显示待删除文件数量
        	EMPTY_NAME: "文件名称不能为空",
        	OVER_NAME: "最大长度不能超过{0}个字符",
        	INVALID_NAME: "不能有以下特殊字符 \\/:*?\"<>|&",
        	DELETE_SUC : "删除成功!",
        	DELETE_ERR : "删除失败!",
            DOWNLOAD_ERR: "下载文件失败!",
            NO_FILE: "请选择文件",
            NO_Play: "目前音乐播放器仅支持IE浏览器！",
            CANT_SEND_FOLDER: "只能发送文件，暂不支持文件夹发送!",
            CREATE_DIR_SUC: "新建文件夹成功!",
            CREATE_DIR_ERR: "新建文件夹失败!",
            RENAME_SUC: "文件重命名成功!",
            RENAME_ERR: "文件重命名失败!",
            SETCOVER_SUC:"封面设定成功",
            SETCOVER_ERR:"封面设定失败",
            THUMBNAIL_ERR : "获取封面失败！",
            THUMBNAIL_ERR : "缩略图加载失败",
            UPLOADING: "关闭彩云网盘，当前正在上传的文件会失败，是否关闭？",
            LIMIT_SIZE_SEND: "彩云网盘暂不能发送{0}以上的文件，超大文件请使用暂存柜上传并发送！",
            UPLOADING_CHANGE_VIEW: "切换视图，当前正在上传的文件会失败，是否切换？"
        },
		logger : new top.M139.Logger({
			name : "M2012.Disk.Model"
		}),
		name : 'M2012.Disk.Model',
		callApi : M139.RichMail.API.call,
		defaultInputValue : '搜索彩云网盘', // 搜索框默认值
		serviceItem : '0017', // 20元版
        inputPara : {},

        /**
		 *彩云公共代码
		 *@constructs M2012.Compose.Model.StorageCabinet
		 *@param {Object} options 初始化参数集
		 *@example
		 */
		initialize : function(options) {
			this.diskAllInfo = {};// 彩云详细信息（包括彩云信息及文件夹列表）
			//this.curDirAllInfo = {};// 当前目录详细信息（包括目录信息及文件列表）
			this.inputData = $diskApp.inputData;// 其它页面传递过来的数据对象
            this.keyword = $T.Url.queryString('keyword');
            this.dirId = $T.Url.queryString('id');
            if(this.inputData){
                this.inputPara.inputData = this.inputData;
            }else if(this.keyword){
                this.inputPara.keyword = this.keyword;
            }else if(this.dirId){
                this.inputPara.dirId = this.dirId;
            }
			top.selectedFids = this.get("selectedFids");
        },

        // 命令调用
        doCommand: function(command, args) {
            !args && (args = {});
            args.command = command;
            top.$App.trigger("diskCommand", args);
        },
		//第一次进入的时候三个接口合并返回数据
		getIndexDisk : function(callback){
			var self = this;
            self.callApi("disk:index", null, function(res) {
                if(callback) {
                    callback(res);
                }
            });
		},
		//云享四川
		getisShareSiChuan : function(callback){
			var self = this;
            self.callApi("disk:isShareSiChuan", null, function(res) {
                if(callback) {
                    callback(res);
                }
            });
		},
        //获取彩云初始化信息
        getDiskInit : function(callback){
            var self = this;
            self.callApi("disk:init", null, function(res) {
                if(callback) {
                    callback(res);
                }
            });
        },
		//获取彩云信息(所有目录信息)
        getDirectorys : function(callback) {
			var self = this;
            self.callApi("disk:getDirectorys", null, function(res) {
				if(callback) {
					callback(res);
				}
			});
		},
		//分类搜索 文件扩展名称 如 jpg,MP3 等，中间以逗号隔开,不区分大小写，此参数为空时返回所有文件
		getCategorySearch : function(callback, options){
			var self = this;
			self.callApi("disk:searchbyexts", getData(), function(res){
				callback && callback(res);
			});
			
			function getData(){
				var data = {
					exts : options.exts
				};
				return data;
			}
		},
		//todo 获取某目录下的所有文件（包括子文件夹）
		getDirFiles : function(callback, options) {
			var self = this;
            self.callApi("disk:fileList", getData(), function(res) {
				if(callback) {
					callback(res);
				}
			});
			
			function getData(){
				var data = {
                    directoryId : options.dirid,
					dirType : options.dirType,
                    thumbnailSize  : self.thumbnailSize
				};
				return data;
			}
		},
		// 分页获取目录所有文件夹和文件信息
		getDirFilesByPage : function(callback, options){
			var self = this;
            self.callApi("disk:fileListPage", getData(), function(res) {
				if(callback) {
					callback(res);
				}
			});
			
			function getData(){
				var data = {
                    directoryId : options.dirid,
					dirType : options.dirType,
                    thumbnailSize  : self.thumbnailSize,
					toPage : self.get("pageIndex"),
					pageSize : self.get("pageSize"),
					catalogSortType : 0,
					contentSortType : 0
				};
				return data;
			}
		},
		//删除目录和文件
        deleteDirsAndFiles : function(callback, dataSend) {
			var self = this;
			self.callApi("disk:delete", getData(), function(res) {
				if(callback) {
					callback(res, dataSend);
				}
			});
			
			function getData(){
				if (!dataSend) {
                    dataSend = {
                        directoryIds: self.get("selectedDirIds").join(","),
                        fileIds: self.get("selectedFids").join(","),
                        dirType: self.getDirTypeForServer()
                    }
                }
				return dataSend;
			}
		},
		//下载目录和文件
		download : function(callback, dataSend) {
			var self = this;
			self.callApi("disk:download", getData(), function(res) {
				if(callback) {
					callback(res);
				}
			});
			
			function getData(){
                if (!dataSend) {
                    var fileIds = self.get("selectedFids"),
                        dirIds = self.get("selectedDirIds");
                    var fileObj = self.getFileById(dirIds[0] || fileIds[0]);
                    var parentDirectoryId = dirIds.length?fileObj.directory.parentDirectoryId:fileObj.file.directoryId;
                    var parentDirType = self.get('curDirType');

                    dataSend = {
                        directoryIds : dirIds.join(","),
                        fileIds : fileIds.join(","),
                        parentDirectoryId : parentDirectoryId,
                        parentDirType : parentDirType,
                        dirType : parentDirType,
                        isFriendShare : 0
                    };
                }
				return dataSend;
			}
		},
        //新建目录
        createDir: function (callback, options) {
            var self = this;
            self.callApi("disk:createDirectory", getData(), function (result) {
                callback && callback(result);
            });
            function getData(){
                if (!options.parentId) {
                    options.parentId = self.get("curDirId");
                    options.dirType = self.getDirTypeForServer();
                }
                return options;
            }
        },
        //设为封面
        setCover : function(callback, dataSend){
            var self = this;
            self.callApi('disk:setCover', getData(), function(result){
                callback && callback(result);
            });

            function getData(){
                if(!dataSend){
                    var fileId = self.get('selectedFids')[0]+'';
                    dataSend = {
                        fileId : fileId
                    }
                }
                return dataSend;
            }
        },
        
        // 发送明信片 
        postCard : function(){
        	var self = this;
        	var selectedFids = self.get('selectedFids');
        	self.getThumbImage(function(result){
        		var responseData = result.responseData;
        		if(responseData && responseData.code == 'S_OK'){
        			// todo
        			var imgUrl = responseData['var'].url;
    				top.Links.show('postcard', "&diskimage=" + encodeURIComponent(imgUrl));
    			}else{
    				top.$Msg.alert(self.tipWords.THUMBNAIL_ERR);
    				self.logger.error("postCard returnData error", "[disk:thumbnail]", result);
    			}
        	}, {fileId : selectedFids[0]});
        },
        
		//重命名文件
        renameDirAndFile : function(callback, options) {
			var self = this;
			self.callApi("disk:rename", getData(), function(res) {
                callback && callback(res);
			});

            function getData(){
                if (!options.fileId && !options.directoryId) {
                    var fileId = self.get("selectedFids")[0];
                    var dirId = self.get("selectedDirIds")[0];
                    var dirObj = self.getFileById(dirId || fileId);
                    var filetype = dirObj.directory.dirType;

                    if (fileId) {//选择文件
                        options.fileId = fileId;
                    } else {//选择目录
                        options.directoryId = dirId;
                        options.dirType = filetype;
                    }
                }

                return options;
            }
		},
		// 搜索文件列表
		search : function(callback, keywords) {
			var self = this;
			self.callApi("disk:search", getData(), function(res) {
				if(callback) {
					callback(res);
				}
			});
			
			function getData(){
				var data = {
					keyword : keywords
				};
				return data;
			}
		},
		//按照文件类型搜索 文件类型，取值范围(0:图片;1:音乐;2:多媒体)
		searchFileType : function(callback, filetype){
			var self = this;
			self.callApi("disk:search", getData(), function(res) {
				callback && callback(res);
			});
			
			function getData(){
				var data = {
					filetype : filetype
				};
				return data;
			}
		},
		// todo 获取图片文件缩略图
		getThumbImageList : function(callback, options){
			var self = this;
			self.callApi("disk:thumbnails", getData(), function(result) {
				if(callback) {
					callback(result);
				}
			});
			
			function getData(){
				var data = {
                    directoryId : self.get('curDirId'),
                    dirType : self.get('curDirType'),
					thumbnailSize : self.thumbnailSize
				};
				return data;
			}
		},
		
		// 获取缩略图   发送明信片时调用该方法
		getThumbImage : function(callback, options){
			var self = this;
			self.callApi("disk:thumbnail", getData(), function(result) {
				if(callback) {
					callback(result);
				}
			});
			
			function getData(){
				var data = {
					fileId : options.fileId,
					thumbnailSize : self.postCardThumbnailSize
				};
				return data;
			}
		},
		// 供 repeater 调用
		renderFunctions : {
			getFullFileName : function() {// 带拓展名
				var row = this.DataRow;
				return $T.Html.encode(row.name);
			},
			getShortFileName : function() {// 带拓展名
				var row = this.DataRow;
				var name = row.name;
				var point = name.lastIndexOf(".");
				if(point == -1 || name.length - point > 5){
                    //return name.substring(0, 15) + "…";
                    return name.substring(0, 15);
                }

				return $T.Html.encode(name.replace(/^(.{15}).*(\.[^.]+)$/, "$1…$2"));
				//return row.fileName.length > 20?row.fileName.substr(0, 20):row.fileName;
			},
            getFileType :function() {
                var row = this.DataRow;
                var filetype = '';
                if(row.type == 'directory'){    //目录类型
                    filetype = row.directory.dirType;
                }else{      //文件类型
                    filetype = row.type;
                }
                return filetype;
            },
			setDisabled :function(){
				var row = this.DataRow;
                var disabled = '';
                if(row.type == 'directory'){    //目录类型
                    disabled = "disabled ";
                }else{      //文件类型
                    disabled = "";
                }
                return disabled;
			},
			getFullName : function() {// 不带拓展名
				var row = this.DataRow;
				var name = row.name;
				var point = name.lastIndexOf(".");
                if(row.directory.dirFlag){
                    return $T.Html.encode(name);
                }
				if(point == -1){
					return $T.Html.encode(name);
				}else{
					return $T.Html.encode(name.substring(0, point));
				}
			},

			getShortName : function(max){// 不带拓展名
				var row = this.DataRow;
				var name = row.name;
				var point = name.lastIndexOf(".");
				var keywords = $T.Html.encode($Url.getQueryObj()["keyword"]) || "";//从URL获取搜索的内容
				if(point != -1 && !row.directory.dirFlag){
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
                if(row.type === 'directory'){
					return '';
				}
				if(row.file.ext){
					return '.' + $T.Html.encode(row.file.ext.toLowerCase());
				}
				var fileName = row.name;
				if(fileName.indexOf('.') == -1){
					return '';
				}

				var length = fileName.split(".").length;
            	return '.' + $T.Html.encode(fileName.split(".")[length-1].toLowerCase());
			},
			getFileSize : function() {
                var self = this;
                var model = self.dataModel;
				var row = this.DataRow;
				if(row.type != model.dirTypes.FILE){
					return 0;
				}
				return $T.Utils.getFileSizeText(row.file.fileSize);
			},

			getFileIconClass : function() {
                var self = this,
                    model = self.dataModel,
                    row = this.DataRow,
					rowName = row.name;
				//添加if 配置新新图标模板
				if(rowName == "手机视频"){
					return 'i-file-smalIcion i-f-smv';
				}else if(rowName == "手机图片"){
					return 'i-file-smalIcion i-f-sJpg';
				}else if(rowName == "我的音乐1"){
					return 'i-file-smalIcion i-f-smic';
				}else if(rowName == "我的相册1"){
					return 'i-file-smalIcion i-f-sJpg';
				}
                if((row.id != model.sysDirIds.ALBUM_ID) && (row.id != model.sysDirIds.MUSIC_ID) && (row.type == model.dirTypes.FILE)){
                    return $T.Utils.getFileIcoClass2(0, row.name);
                }else if((row.id != model.sysDirIds.ALBUM_ID) && (row.id != model.sysDirIds.MUSIC_ID) && (row.type != model.dirTypes.FILE)){
                    return 'i-file-smalIcion i-f-sys';
                }else if(row.id == model.sysDirIds.ALBUM_ID){
                    return 'i_file_16 i_m_album';
                }else if(row.id == model.sysDirIds.MUSIC_ID){
                    return 'i_file_16 i_m_music';
                }

			},
			getThumbnailUrl : function(){
                var self = this,
                    model = self.dataModel,
                    row = this.DataRow,
                    thumbnailUrl = '',
                    dirType = row.directory.dirType,
					dirName = row.name,
                    name = row.name,
                    extName = row.file.ext;

				if(row.type != model.dirTypes["FILE"]){    //目录文件
                    if(row.directory.dirType == model.dirTypes.ALBUM && row.id != model.sysDirIds.ALBUM_ID){
                            thumbnailUrl = model.imagePath+'norSys.png';
                    }else{
                        thumbnailUrl = model.getIconByType(dirType, dirName);
                    }
                }else{
                    if(model.isImage(name)){  //图片文件
                              thumbnailUrl =  model.imageGlobalPath + 'load1.gif';
							  if(row.file.thumbnailURL){
								thumbnailUrl = row.file.thumbnailURL;
							  }
							  
                    }else{
                        thumbnailUrl = model.getThumbImagePath(extName);
                    }
                }
                return thumbnailUrl;
			},
			getFileIntSize : function(){
                var self = this;
                var row = this.DataRow;
                var model = self.dataModel;
				var row = this.DataRow;
                if(row.dirType != model.dirTypes.FILE){
					return 0;
				}
				return row.file.fileSize;
			},
            isShare : function(){
                var self = this;
                var row = this.DataRow;
                var model = self.dataModel;
                var listMode = model.get('listMode');
                if(listMode == 1){  //图标模式
                    if(row.isShare == 1 && row.type == model.dirTypes.FILE){
                    //    return '<i class="hand"></i>';
							return '<i class="cShare"></i>';
                    }else if(row.isShare == 1){
                    //    return '<i class="systemHand"></i>';
							return '<i class="cShare"></i>';
                    }
                }else if(listMode == 0){    //列表模式
                    if(row.isShare == 1){
                    //    return '<i class="i_file_16 i_m_hand"></i>';
						return "";
                    }
                }
                return '';
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
                if(row.type !== model.dirTypes.FILE){
                	return model.fileClass['DOCUMENT'];
                }
                var fileName = row.name;
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
				commonOperateTemplete : ['<a hideFocus="1" href="javascript:void(0)" onclick="return false;" name="download" fileid="{fid}" target="_self">下载 </a>',
										'<span>|</span>',
										'<a hideFocus="1" href="javascript:void(0)" name="share" fileid="{fid}"> 共享 </a>',
										'<span>|</span>',
										'<a hideFocus="1" href="javascript:void(0)" onclick="return false;" name="send" fileid="{fid}"> 发送 </a>',
										'<span>|</span>',
										'<a hideFocus="1" href="javascript:void(0)" onclick="return false;" name="delete" fileid="{fid}" fname="{shortFileName}"> 删除</a>'].join(""),
				errorOperateTemplete : ['<i class="i_warn_min"></i>',
						            	'<span class="red">上传失败！</span>',
						            	'<a hideFocus="1" href="javascript:void(0)" onclick="return false;" name="delete" fileid="{fid}" fname="{shortFileName}">删除</a>'].join(""),
				commonIconTemplete : ['<p style="display:none;">',
										'<a hideFocus="1" href="javascript:void(0)" onclick="return false;" name="download" fileid="{fid}" target="_self">下载 </a>',
										'<span class="line">|</span>',
										'<a hideFocus="1" href="javascript:void(0)" name="share" fileid="{fid}"> 共享 </a>',
										'<span class="line">|</span>',
										'<a hideFocus="1" href="javascript:void(0)" onclick="return false;" name="send" fileid="{fid}"> 发送 </a>',
										'<span class="line">|</span>',
										'<a hideFocus="1" href="javascript:void(0)" onclick="return false;" name="delete" fileid="{fid}" fname="{shortFileName}"> 删除</a>',
									'</p>'].join(""),
				errorIconTemplete : ['<p class="gray failTips">',
						                '<i class="i_warn_min"></i>',
						                '<span class="red">上传失败！</span>',
						                '<a hideFocus="1" href="javascript:void(0)" onclick="return false;" name="delete" fileid="{fid}" fname="{shortFileName}">删除</a>',
						            '</p>'].join("")
			};
			var mode = self.get('listMode');
            var isUploadSuccess = self.isUploadSuccess(row.id);
			if(mode){
				if(row.type !== self.dirTypes.FILE){
					return $T.Utils.format(templates['commonIconTemplete'], {fid : row.id, shortFileName : getShortFileName(row.name)}); 
				}
				
				if(!isUploadSuccess){
                	return $T.Utils.format(templates['errorIconTemplete'], {fid : row.id, shortFileName : getShortFileName(row.name)});
                }else{
                	return $T.Utils.format(templates['commonIconTemplete'], {fid : row.id, shortFileName : getShortFileName(row.name)});
                }
			}else{
				if(row.type !== self.dirTypes.FILE){
					return $T.Utils.format(templates['commonOperateTemplete'], {fid : row.id, shortFileName : getShortFileName(row.name)}); 
				}
				
				if(!isUploadSuccess){
                	return $T.Utils.format(templates['errorOperateTemplete'], {fid : row.id, shortFileName : getShortFileName(row.name)});
                }else{
                	return $T.Utils.format(templates['commonOperateTemplete'], {fid : row.id, shortFileName : getShortFileName(row.name)});
                }
			};
			
			function getShortFileName(name){
				var point = name.lastIndexOf(".");
				if(point == -1 || name.length - point > 5){
                    //return name.substring(0, 15) + "…";
                    return name.substring(0, 15);
                }

				return $T.Html.encode(name.replace(/^(.{15}).*(\.[^.]+)$/, "$1…$2"));
				//return row.fileName.length > 20?row.fileName.substr(0, 20):row.fileName;
			}
		},
		
		/*
		 * 表头排序
		 * type 3 我的相册  4 我的音乐  1 自定义文件夹  2 文件
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
					case self.sortTypes['FILE_SIZE']:
						sorter = function(a, b) {
							if (judgeType(a, b)) return sortFolder(a, b) || 0;
							return (a.file.fileSize - b.file.fileSize) * sortIndex || 0;
						};
						break;
					case self.sortTypes['FILE_NAME']:
						sorter = function(a, b) {
                            if (judgeType(a, b)) return sortFolder(a, b);
							return (a.name.localeCompare(b.name)) * sortIndex;
						};
						break;
					case self.sortTypes['UPLOAD_TIME']:
						sorter = function(a, b) {
                            if (judgeType(a, b)) return sortFolder(a, b);
							return ($Date.parse(a.createTime) - $Date.parse(b.createTime)) * sortIndex;
						};
						break;
				}
				options.dataSource.sort(sorter);
			}
            function judgeType (a, b) {
                return a.directory.dirType != b.directory.dirType || a.type != b.type || a.directory.dirFlag != b.directory.dirFlag;
            }
			// 文件夹排在前面
			function sortFolder(a, b){
                if (a.type == self.dirTypes['FILE']) {
                    return 1;
                } else  if (b.type == self.dirTypes['FILE']) {
                    return -1;
                }
                if (a.directory.dirFlag == self.dirFlag['SYS_DIR']) {
                    return -1;
                } else if (b.directory.dirFlag == self.dirFlag['SYS_DIR']) {
                    return 1;
                }
                if (a.directory.dirType == self.dirTypes['USER_DIR']) {
                    return 1;
                } else if (b.directory.dirType == self.dirTypes['USER_DIR']) {
                    return -1;
                }
                return a.directory.dirType == self.dirTypes['ALBUM'] ? -1 : 1;
			}
		},
		// 状态栏视图层模板相对应的对象，用户替换模板中的变量 
		getStatusObj : function() {
			var self = this;
			var data = self.get('diskInfo');
			var usedPercent = Math.ceil(data.useSize / data.totalSize * 100);
			usedPercent = usedPercent > 100 ? 100 : usedPercent;
			var formatObj = {
				filesCount : data.fileNum, // 文件数量
				usedPercent : usedPercent,
				usedSize : $T.Utils.getFileSizeText(data.useSize),
				totalSize : $T.Utils.getFileSizeText(data.totalSize)
			}
			return formatObj;
		},
		// 获取总页数
		getPageCount : function() {
			return Math.ceil(this.get("totalSize") / this.get("pageSize")) || 1;// at least one
			// delete below
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
            for(var i= 0,l=pageData.length; i<l; i++){
                if(pageData[i].type == this.dirTypes.FILE){
                    this.set('imageList', this.getImageList(pageData));
                }
            }
            var imageList = this.get('imageList');
            var imageListObj = {};
            for(var i= 0, l=imageList.length; i<l; i++){
                imageListObj[imageList[i].id] = true;
            }
            this.set('imageListObj', imageListObj);
			return pageData;
		},
        //获取是图片的数据 todo 该方法可废弃
        getImageList:function(pageData){
            var self=this;
            var imgData=[];
            for(var i= 0,l=pageData.length; i<l; i++){
                //var fileName = pageData[i]["name"] || pageData[i]["srcfilename"];
                var fileName = pageData[i]["name"];
                if(self.isImage(fileName)){
                	imgData.push(pageData[i]);
                }
            }
            return imgData;
        },
        //根据图片数据返回图片的fid todo 该方法可废弃
        getImageFileds:function(imgData){
            var fileds="";
            for(var i= 0,l=imgData.length; i<l; i++){
                fileds +=","+imgData[i]["fileid"];
            }
            fileds=fileds.substr(1);
            return fileds;
        },
		// 判断用户是否安装邮箱小工具
		isSetupMailtool : function(){
		//	return M139.Plugin.ScreenControl.isScreenControlSetup();
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
            var reg = /[*|:"<>?\\/&]/;
            return !reg.test(name);
        },
		//添加数据，不存在则添加
		addOne: function(item, array){
			if(!item || !$.isArray(array)){
				return;
			}
			var index = $.inArray(item, array);
			if(index == -1){
				array.push(item);
			}
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
        //如果当前选择的目录类型存在则不做处理，不存在则改变当前选择目录类型
        changeDirType: function (dirType) {
            if (this.selectedDirType !== dirType) {
                this.selectedDirType = dirType;
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
       // 获取当前目录类型,提供给服务端的根目录type为1
        getDirTypeForServer: function(){
            var curDirType = this.get("curDirType");
            return curDirType == this.dirTypes.ROOT ? this.dirTypes.USER_DIR : curDirType;
        },
	   // 获取用户选中的文件列表
	   getSelectedDirAndFiles : function(){
	   		var self = this;
	   		var files = [];
	   		var fileList = self.get('fileList');
	   		var selectedFids = self.get('selectedDirAndFileIds');
	   		$(fileList).each(function(i){
	   			var fid = this.id;
	   			if($.inArray(fid, selectedFids) != -1){
	   				files.push(this);
	   			}
	   		});
	   		return files;
	   },
	   // 获取要共享的文件及文件夹
	   getShareFile: function(){
           var self = this;
           var fileIds = self.get('shareFileId');
           var files = [];

           for (var i = 0, len = fileIds.length; i < len; i++) {
           	   var fileObj = self.getFileById(fileIds[i]);
           	   if(fileObj.id){
           	       files.push(fileObj);
           	   }
           }

           return files;
	   },
	   
	   //共享
        showShareDialog: function(shareType){
            if (top.$User && !top.$User.checkAvaibleForMobile()) return; //非移动用户，屏闭共享 todo 非移动用户直接屏蔽次功能入口
			
			var self = this;
			if(!shareType){
				shareType = self.shareTypes['BATCH'];
			}
			
			var dirType = self.get('curDirType');
            var shareUrl = self.urls.SHARE_URL+'&shareType='+shareType+'&dirType='+dirType;
            top.$Msg.open({
                dialogTitle: "分享给好友",
                url: shareUrl,
                width: 565,
                height: 440
            });
        },
	   
	   // 全选
	   selectAll : function(){
	   		var self = this;
        //    var curPageData = self.getPageData(self.get('pageIndex'));
			var curPageData = self.get("fileList"); //数据源已变化
	   		var selectedFids = self.get('selectedFids');
	   		var selectedDirIds = self.get('selectedDirIds');
			/*
	   		$(curPageData).each(function(i){
	   			var fid = this.id;
	   			var fileType = this.type;
	   			if(fileType == self.dirTypes.FILE){
	   				if($.inArray(fid, selectedFids) == -1){
	   					if(self.isUploadSuccess(fid)){
							selectedFids.push(fid);
						}
		   			}
	   			}else if(this.directory.dirFlag != 0){ // dirFlag 0 系统目录  1 自定义目录
	   				if($.inArray(fid, selectedDirIds) == -1){
		   				selectedDirIds.push(fid);
		   			}
	   			}
	   		});*/
			$(curPageData).each(function(i){
	   			var fid = this.id;
	   			var fileType = this.type;
	   			if(fileType == self.dirTypes.FILE){
	   				if($.inArray(fid, selectedFids) == -1){
	   					if(self.isUploadSuccess(fid)){
							selectedFids.push(fid);
						}
		   			}
	   			}else{ // dirFlag 0 系统目录  1 自定义目录
	   				if($.inArray(fid, selectedDirIds) == -1){
		   			//	selectedDirIds.push(fid);
		   			}
	   			}
	   		});
	   		self.set('selectedDirAndFileIds', selectedFids.concat(selectedDirIds));
	   },
	   // 全不选
	   selectNone : function(){
	   		var self = this;
	   	//	var fileList = self.getPageData(self.get("pageIndex"));
			var fileList = self.get("fileList"); //数据源已变化
	   		var selectedFids = self.get('selectedFids');
	   		var selectedDirIds = self.get('selectedDirIds');
	   		$(fileList).each(function(i){
	   			var fid = this.id;
	   			var fileType = this.type;
	   			if(fileType == self.dirTypes.FILE){
	   				var fIndex = $.inArray(fid, selectedFids);
					if(fIndex != -1){
						selectedFids.splice(fIndex, 1);
					}
	   			}else{
	   				var dIndex = $.inArray(fid, selectedDirIds);
	   				if(dIndex != -1){
						selectedDirIds.splice(dIndex, 1);
					}
	   			}
	   		});
	   		self.set('selectedDirAndFileIds', selectedFids.concat(selectedDirIds));
	   },
	   // 根据文件ID返回文件对象
	   getFileById : function(fid){
	   		if(!fid){
	   			return;
	   		}
	   		var self = this;
	   		var file = {};
	   		var fileList = self.get('fileList');
	   		$(fileList).each(function(i){
	   			var fileId = this.id;
	   			if(fileId == fid){
	   				file = this;
	   				return false;
	   			}
	   		});
	   		return file;
	   },
	   //从所有中选数据
	   getFileByIdFromAll : function(fid){
			if(!fid){
	   			return;
	   		}
	   		var self = this;
	   		var file = {};
	   		var fileList = self.totalFileList;
	   		$.each(fileList, function(index,value){
	   			var fileId = value.id;
	   			if(fileId == fid){
	   				file = value;
	   				return false;
	   			}
	   		});
	   		return file;
	   },
	   // 判断文件是否上传成功, 仅判断文件，文件夹无需判断
	   isUploadSuccess : function(fid){
	   		var self = this;
	   		var fileObj = self.getFileById(fid);
	   		if(!fileObj){
	   			return false;
	   		}
	   		if(fileObj.type === 'directory'){
	   			return true;
	   		}
	   		if(fileObj.uploadState === 'false'){
	   			return false;
	   		}
	   		
	   		var fileSize = parseInt(fileObj.file.fileSize, 10);
	   		var fileUploadSize = parseInt(fileObj.file.rawSize, 10);
	   		return fileSize === fileUploadSize?true : false;
	   },
	   
       getSelectedDirAndFileNames: function(filename){
            var selectedDirAndFileIds = this.get("selectedDirAndFileIds");
            var selectedDirAndFileNames = [];

            for (var i = 0; i < selectedDirAndFileIds.length; i++) {
                var file = this.getFileById(selectedDirAndFileIds[i]);

                selectedDirAndFileNames.push(file.name || filename);
            }

            return selectedDirAndFileNames;
        },
        getSelectedDirAndFileOverflowNames: function(newName, filename){
            var originNames = this.getSelectedDirAndFileNames(filename);
            var overflowNames = [];
            if(!newName){
                for (var i = 0; i < originNames.length; i++) {
                    overflowNames.push(M139.Text.Url.getOverflowFileName(originNames[i], 30));
                }
            }else{  //重命名文件名截取
                overflowNames.push(M139.Text.Url.getOverflowFileName(newName, 15));
            }
            return overflowNames;
        },
	   // 获取根目录
	   getRootDir : function(){
	   		var self = this;
            var baseInfo = self.get('diskInfo');
           return baseInfo.rootId;
	   },
	   // 判断当前目录或文件是否系统目录_20130613_xx
	   isRootDir : function(fileid){
	   		var self = this;
           var fileObj = self.getFileById(fileid);
		//   if(!fileObj.directory.dirFlag){
		//		return false;
		//  }
			if(!fileObj){
				return false;
			}
			if(!fileObj.directory){
				return false;
			}
           return fileObj.directory.dirFlag == 0 ? true : false;
	   },
	   // 判断用户是否选中了系统文件夹
	   isSelectedSysDir : function(){
            var self = this,
                isSysDir = false,
                selectedDirIds = self.get('selectedDirIds'),
                sysDirListObj = self.get('sysDirListObj');
           for(var i= 0,l=selectedDirIds.length; i<l; i++){
               if(sysDirListObj[selectedDirIds[i]]){
                   isSysDir = true;
                   break;
               }
           }
	   		return isSysDir;
	   },
	   // 根据dirid返回文件夹对象
	   getDirById : function(dirid){
	   		if(!dirid && dirid != 0){
	   			return;
	   		}
	   		var self = this;
	   		var dirObj = {};
	   		//var dirs = self.get('sysDirList').concat(self.get('userDirList')).concat(self.get('photoDirList')).concat(self.get('musicDirList'));
            var dirs = self.get('directorys');
	   		$(dirs).each(function(i){
	   			if(this.directoryId == dirid){
	   				dirObj = this;
	   				return false;
	   			}
	   		});
	   		return dirObj;
	   },
	   setParentDirs : function(dirObj){
	   		var self = this;
	   		if(!dirObj){
	   			self.logger.error("param error", "[setParentDirs]", dirObj);
	   			return;
	   		}
	   		
	   		if(dirObj.parentDirectoryId == 0){
	   			return;
	   		}else{
	   			var parentDir = self.getDirById(dirObj.parentDirectoryId);
	   			if(parentDir){
	   				self.get('parentDirs').unshift(parentDir);
	   				self.setParentDirs(parentDir);
	   			}
	   		}
	   },
	   getParentDirs : function(){
	   		var self = this;
	   		return self.get('parentDirs');
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
	   // 跳转到文件发送页
	   gotoSendPage : function(options){
	   		// 为文件列表中的每一个文件对象添加额外属性标识文件来源:彩云
			function setComeFrom(files, comeFrom){
				if(!$.isArray(files)){
					return files;
				}
				for(var i = 0,len = files.length;i < len;i++){
					var file = files[i];
					file.comeFrom = comeFrom;
				}
			}
	   	
	   		var self = this;
	   		setComeFrom(options.fileList, 'disk');
	   		
	   		var data = {
				fileList : options.fileList,
				type : "mail",
				from : "netdisk"
			};
			$("#disk-main").hide();
			$("#iframe-main").show();
			var url = self.urls['SEND_URL'];
            url = $diskApp.inputDataToUrl(url, data);
			$("#netRightFrame").attr("src", url);
	    },

	    popupCompose: function(fileList, data){

            if (this.filterFile(fileList) == false) {
	            top.$Msg.alert(this.model.tipWords.LIMIT_SIZE_SEND);
	            return ;
            }

			// 获取外链，并插入链接内容到写信弹窗 (xiaoyu, 2014/03/26)
			M139.RichMail.API.call("disk:getOutLink", data, function(res) {
				var outLinkHtml = '<br><br><br><dl class="writeOk" style="dcolor: #444;font: 12px/1.5 \'Microsoft YaHei\',Verdana; display: inline-block; padding:5px 50px 5px 0px;">';
				var list, source;
				var firstFileName = "";

				function getFileIcoBgPos(ext) {
					var bgPos = "|ai|{0 0;}\
								|doc|docx|{0 -34px;}\
								|exe|msi|{0 -67px;}\
								|fla|{0 -100px;}\
								|html|htm|{0 -133px;}\
								|pdf|{0 -168px;}\
								|ppt|pptx|{0 -201px;}\
								|psd|{0 -234px;}\
								|swf|{0 -268px;}\
								|txt|log|ini|{0 -301px;}\
								|xls|xlsx|{0 -335px;}\
								|rm|rmvb|avi|mov|wmv|flv|mp4|ogg|{0 -369px;}\
								|rar|zip|tar|gz|{0 -403px;}\
								|mp3|wma|wav|midi|{0 -437px;}\
								|jpg|bmp|png|gif|{0 -471px;}\
								|none|{0 -504px;}";

					var reg = new RegExp("\\|" + ext + "\\|[^{]*{(.*?)}", "i");
					var match = reg.exec(bgPos);
					return match ? match[1] : "";
				}

				function getFileItemById(fileId) {
					var i, item = null;
					for (i = fileList.length - 1; i >= 0; --i) {
						item = fileList[i];
						if (item.id == fileId) break;
					}
					return i >= 0 ? item : null;
				}

				// 搞全局TMD坑， IE11 function item() [native code]
				var item = null;
				if (res.responseData && res.responseData["code"] == "S_ERROR") {
					// todo: 变为error
					top.M139.UI.TipMessage.show("获取文件链接失败", {className: "msgRed", delay:3000});
				} else {
					list = res.responseData["var"].linkBeans;
					for (var i = 0, l = list.length; i < l; i++) {
						item = list[i];
						source = getFileItemById(item.objID);
						if(!source) continue;
						if(firstFileName == ""){
							firstFileName = source.name;
						}

						outLinkHtml += ['<dd style="margin: 0;padding: 0;display: block;height:37px;">',
											'<img contentEditable="false" style="display:inline-block;vertical-align:middle;display: inline-block;margin-right: 5px;width: 32px;height: 32px;background: url(/m2012/images/global/disk-small-icon.png) no-repeat;background-position:' + getFileIcoBgPos($Url.getFileExtName(source.name)) + '"></i>',
											'<span contentEditable="false" title="'+source.name+'">'+$TextUtils.getTextOverFlow(source.name, 18, true)+'</span>',
											'<span contentEditable="false" style="color:#ccc"> (' + $TextUtils.getFileSizeText(source.file.fileSize) + ')</span>',
											'<a contentEditable="false" href="' + item.linkUrl + '" target="_blank" style="margin-left: 15px;color: #1a75ca;text-decoration: none;">查看</a>',
										'</dd>'].join("");
					}
					outLinkHtml += '<dd contentEditable="false" style="margin:10px 0; padding-top:10px; border-top: 1px dashed #d7d7d7; color:#ccc;user-select:none;-webkit-user-select:none;-moz-userselect:none;">来自139邮箱 - 彩云网盘的分享</dd></dl><br><br>';
					top.$Evocation.create({type: "compose", subject: "【139邮箱-彩云网盘】" + firstFileName, isEdit: 0, content: outLinkHtml});

					var counter = 0;
					var timer = setInterval(function(){
						var composeWin = top.$("#evocation_content");
						if(composeWin.length > 0 || counter++ > 10){
							composeWin.attr("contentEditable", "true").css("outline", "none");
							top.$("#evocation_contacts").css("color", "#1a75ca");
							clearInterval(timer);
						}
					}, 200);
				}
			});
	    },

        // 根据文件名判断文件是否为图片(且支持预览)
        isImage : function(fileName){
            if(!fileName){
                return;
            }
            var self = this;
            var extName = $T.Url.getFileExtName(fileName);

            if (extName == "") {
                return false;
            }
            return self.imageExts.indexOf(extName) == -1?false:true;
        },
        // 根据文件名获取文件缩略图路径
        getThumbImagePath : function(extName){
            /*if(!extName){
                return;
            }*/
            var self = this;
            return self.imagePath + self.getThumbImageName(extName);
        },
        // 根据文件名获取文件缩略图名称（非图片）
        getThumbImageName : function(extName){
            var doc = 'doc/docx',
                html = 'htm/html',
                ppt = 'ppt/pptx',
                xls = 'xls/xlsx',
                rar = 'rar/zip/7z',
                music = 'mp3/wma/wav/mod',
				vedio = 'mp4,wmv,flv,rmvb,3gp',
                other = 'pdf/ai/cd/dvd/psd/fla/swf/txt';
            //var extName = $T.Url.getFileExtName(fileName);
                if(extName == "") {
                    return 'default.png';
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
				if("exe".indexOf(extName) != -1){
					return 'exe.png';
				}
            return 'default.png';
        },
        getIconByType:function(filetype,dirName){
            var self=this;
            var imagePath="";
            if(filetype == self.dirTypes["ALBUM"]){  //相册
            //    imagePath=self.imagePath+"album.png";
				imagePath=self.imagePath+"norSys.png";
            }else if(filetype == self.dirTypes["MUSIC"]){    //音乐
            //    imagePath=self.imagePath+"phmic.png"; 音乐也是普通文件
				imagePath=self.imagePath+"norSys.png";
            }else if(filetype == self.dirTypes["USER_DIR"]){    //自定义文件夹
                imagePath=self.imagePath+"norSys.png";
            }
			if(dirName == "手机视频"){
				imagePath=self.imagePath+"video.png";
			}else if(dirName == "手机图片"){
				imagePath=self.imagePath+"phJpg.png";
			}else if(dirName == "我的相册1"){
				imagePath=self.imagePath+"phJpg.png";
			}
            return imagePath;
        },
        // 保存接口返回的目录信息
        setDirProperties : function(directorys){
        	var self = this;
            self.set('directorys', directorys);
            var tempSysDir = [],
                fileList = self.get('fileList');
            for(var i=0, l=fileList.length; i<l; i++){
                if(fileList[i].directory.dirFlag == 0){ //0代表系统目录
                    tempSysDir.push(fileList[i]);
                }
            }
            self.set('sysDirList', tempSysDir);
            var sysDirListObj = {};
            for(var i= 0,l=tempSysDir.length; i<l; i++){
                sysDirListObj[tempSysDir[i].id] = true;
            }
            self.set('sysDirListObj', sysDirListObj);
        },
        // 重置某些属性，重新打开当前目录或者触发refresh方法时调用该方法
        resetProperties : function(){
        	var self = this;
        	self.set('pageIndex', 1);
	    //	self.set('selectedFids', []);
	    //	self.set('selectedDirIds', []);
	    //	self.set('selectedDirAndFileIds', []);
	    //	self.set('shareFileId', []);
        },
        // 获取初始化目录ID
        getInitializeDirid : function(){
        	var self = this;
			if(top.dirid){
				return top.dirid;
			}
			if(self.get("139MailId")){
				return self.get("139MailId");
			}
            if(self.inputPara.dirId){
                return self.inputPara.dirId + '';
            }else{
                var rootId = self.getRootDir();
                return rootId + '';
            }

        },
        // 判断用户是否安装邮箱小工具
        isSetupMailTool : function(){
        //    return M139.Plugin.ScreenControl.isScreenControlSetup();
        },
        // 获取用户选中的文件列表
        getSelectedFiles : function(){
            var self = this;
            var files = [];
            var fileList = self.get('fileList');
            var selectedFids = self.get('selectedFids');
            $(fileList).each(function(i){
                var fid = this.id;
                if($.inArray(fid, selectedFids) != -1){
                    files.push(this);
                }
            });
            return files;
        },
        // 获取当前目录下上传文件类型
        getFileTypeUpload: function(){
            var curDirType = this.get("curDirType");
            var fileTypeUpload = "";

            if (curDirType == this.dirTypes.ALBUM) {//相册目录
                fileTypeUpload = "image";
            } else if (curDirType == this.dirTypes.MUSIC) {//音乐目录
                fileTypeUpload = "music";
            }

            return fileTypeUpload;
        },
        // 根据文件ID返回缩略图对象
        getThumbnailById : function(fid){
            if(!fid){
                return;
            }
            var self = this;
            var file = {};
            var thumbImageList = self.get('thumbnailList');
            $(thumbImageList).each(function(i){
                var fileId = this.fileId;
                if(fileId == fid){
                    file = this;
                    return false;
                }
            });
            return file;
        },
        // 根据文件ID返回封面对象
        getCoverById : function(fid){
            if(!fid){
                return;
            }
            var self = this;
            var file = {};
            var coverList = self.get('coverList');
            $(coverList).each(function(i){
                var fileId = this.directoryId;
                if(fileId == fid){
                    file = this;
                    return false;
                }
            });
            return file;
        },
        
        // 判断用户是否为20元版
	   isServiceItem : function(){
	   		var self = this;
	   		return top.$User.getServiceItem() === self.serviceItem?true:false;
	   },
	   
	   // 获取文件名不带拓展名
	   getFileName : function(name){
	   		if(!name){
	   			return '';
	   		}
			var point = name.lastIndexOf(".");
			if(point == -1){
				return name;
			}else{
				return name.substring(0, point);
			}
	   },

        //从fileList中及dom中删除文件或文件夹
        delFileById: function (ids) {
            var fileList = this.get("fileList");
            for (var i = 0, len = ids.length; i < len; i++) {
                var id = ids[i];

                for (var j = 0, l = fileList.length; j < l; j++) {
                    if (id == fileList[j].id) {
                        fileList.splice(j, 1);
                        break;
                    }
                }
            }
        },

        //获取当前目录文件夹个数
        getFolderNumByCurDir: function(){
            var fileList = this.get("fileList");
            var folderNum = 0;

            for (var i = 0, len = fileList.length; i < len; i++) {
                fileList[i].type == this.dirTypes['DIRECTORY'] && folderNum++;
                if (fileList[i].type != this.dirTypes['DIRECTORY']) break;
            }

            return folderNum;
        },

        // 彩云文件大于200M时，将提示无法发送，服务端原因导致
        filterFile: function (fileList) {
            var fileList = fileList || this.getSelectedFiles();

            for (var i = 0, len = fileList.length; i < len; i++) {
                var item = fileList[i];
                if (item.file.fileSize >= this.limitSizeSend) {
                    return false;
                }
            }

            return true;
        },

        //接入彩云提示
        confirmMcloudUpgrade: function(){
            $Msg.confirm(
                "尊敬的用户，彩云网盘正在进行系统升级，暂时无法进行该操作，请稍后再试!",
                function(){},
                function(){},
                {
                    buttons: ["确定"]
                }
            ).setDialogTitle("彩云网盘系统升级");
        },

        //上报日志
        sendLogger : function(args){
            var self = this;
            if(!args){
                return ;
            }
            var selectedFid = self.get('selectedFids');
            var selectedDirId = self.get('selectedDirIds');
            var selectedDirAndFileId = self.get('selectedDirAndFileId');
            if((selectedFid.length > 0) && (selectedDirId.length > 0)){
                BH({key : args.file});
                BH({key : args.dir});
            }else if(selectedDirId.length > 0){
                BH({key : args.dir});
            }else if(selectedFid.length > 0){
                BH({key : args.file});
            }
        },
        //下载单个文件行为日志上报
        downloadLogger : function(fid){
            var self = this,
                doc = 'doc/docx/xls/xlsx/ppt/pptx',
                pic = 'jpg/gif/png/ico/jfif/tiff/tif/bmp/jpeg/jpe',
                music = 'mp3/wma/wav/mod/mid/cda',
                exe = 'exe/msi',
                rar = 'rar/zip/7z',
                pdf = 'pdf',
                txt = 'txt',
                video = 'avi/wmv/wmp/rm/ram//rmvb/ra/mpg/mpeg/mp4',
                html = 'htm/html',
                other = 'ai/cd/dvd/psd/fla/swf';
            var fidObj = self.getFileById(fid);
            var extname = fidObj.file.ext;
            if(doc.indexOf(extname) != -1){
                BH({key : "diskv2_download_office"});
            }else if(pic.indexOf(extname) != -1){
                BH({key : "diskv2_download_image"});
            }else if(music.indexOf(extname) != -1){
                BH({key : "diskv2_download_music"});
            }else if(exe.indexOf(extname) != -1){
                BH({key : "diskv2_download_exe"});
            }else if(rar.indexOf(extname) != -1){
                BH({key : "diskv2_download_zip"});
            }else if(pdf.indexOf(extname) != -1){
                BH({key : "diskv2_download_pdf"});
            }else if(txt.indexOf(extname) != -1){
                BH({key : "diskv2_download_txt"});
            }else if(video.indexOf(extname) != -1){
                BH({key : "diskv2_download_vedio"});
            }else if(html.indexOf(extname) != -1){
                BH({key : "diskv2_download_html"});
            }else if(fidObj.type != self.dirTypes.FILE || other.indexOf(extname) != -1){
                BH({key : "diskv2_download_other"});
            }
        },
		// 为文件列表中的每一个文件对象添加额外属性标识文件来源:本地，暂存柜，彩云
		setComeFrom : function(files, comeFrom){
			if(!$.isArray(files)){
				return files;
			}
			for(var i = 0,len = files.length;i < len;i++){
				var file = files[i];
				file.comeFrom = comeFrom;
			}
		},
		// 选择文件组件返回的文件列表统一数据结构
		transformFileList : function(fileList){
			if(!$.isArray(fileList)){
				return fileList;
			}
			var self = this;
			var files = [];
			for(var i = 0,len = fileList.length;i < len;i++){
				var file = fileList[i];
				files.push(self.getFileByComeFrom(file));
			}
			return files;
		},
		// 根据文件来源返回调整数据结构后的文件对象，为了满足largeAttach.js中的方法 setNetLink的需求
		getFileByComeFrom : function(fileObj){
			var comeFrom = fileObj.comeFrom;
			var newfile = {};
			var behavior_flag = {local:false, disk: false, cabinet: false};
			if(comeFrom == 'localFile'){
				newfile.fileId = fileObj.businessId;
				newfile.fileName = fileObj.name;
				newfile.filePath = fileObj.name;
				newfile.fileSize = fileObj.size;
				newfile.fileType = 'keepFolder';
				newfile.state = 'success';
				behavior_flag.local = true;
			}else if(comeFrom == 'disk'){
				newfile.fileGUID = fileObj.filerefid;
				
				newfile.fileId = fileObj.id;
				newfile.fileName = fileObj.name;
				newfile.filePath = fileObj.name;
				newfile.fileSize = fileObj.file.fileSize;
				newfile.fileType = 'netDisk';
				newfile.state = 'success';
				behavior_flag.disk = true;
			}else if(comeFrom == 'cabinet'){
				newfile.fileId = fileObj.fid;
				newfile.fileName = fileObj.fileName;
				newfile.filePath = fileObj.fileName;
				newfile.fileSize = fileObj.fileSize;
				newfile.fileType = 'keepFolder';
				newfile.state = 'success';
				behavior_flag.cabinet = true;
			}else{
				console.log('不支持的文件来源！comeFrom:'+comeFrom);
			}
			// comeFrom信息源到此断了，在此添加行为统计(add by xiaoyu)
			behavior_flag.local && BH({key : "compose_largeattach_local"});
			behavior_flag.disk && BH({key : "compose_largeattach_disk"});
			behavior_flag.cabinet && BH({key : "compose_largeattach_cabinet"});
			return newfile;
		}
	}));
})(jQuery, Backbone, _, M139);
