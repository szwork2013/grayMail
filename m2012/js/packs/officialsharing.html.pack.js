/**
 * @fileOverview 定义彩云模块彩云页面模型层
 */
(function(jQuery, Backbone, _, M139) {
	var $ = jQuery;
	M139.namespace("M2012.Officialsharing.Model", Backbone.Model.extend({
		defaults : {
			pageSize : 30,//每页显示文件数
			pageIndex : 1,//当前页
			listMode : 1,// 列表模式：0 列表 1 图标
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
			totalSize : 0 //当前目录总数据
		},
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
			DOCUMENT : 'document', // 文档，新窗口预览
			AUDIO : 'audio',	// 音频
			VIDEO : 'video'		// 视频
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
		audioExts : "/mp3/wav/ogg/wma/m4a/",
		videoExts : "/avi/flv/mp4/rm/rmvb/wmv/3gp/mov/webm/mpg/mpeg/asf/mkv/",
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

        },

        // 命令调用
        doCommand: function(command, args) {
            !args && (args = {});
            args.command = command;
            top.$App.trigger("diskCommandMock", args);
        },
		//第一次进入的时候三个接口合并返回数据
		getIndexDisk : function(callback){
			var self = this;
            self.callApi("disk:indexMock", null, function(res) {
                if(callback) {
                    callback(res);
                }
            },{mock:true});
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
            self.callApi("disk:fileListPageMock", getData(), function(res) {
				if(callback) {
					callback(res);
				}
			},{mock:true});
			
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
			self.callApi("disk:downloadMock", getData(), function(res) {
				if(callback) {
					callback(res);
				}
			},{mock:true});
			
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
				}else if(rowName == "世界杯"){
					return 'm-footerBall i-m-footerBall';
				}else if(rowName == "精彩视频"){
					return 'm-footerBall i-m-footerballMV';
				}else if(rowName == "精美壁纸"){
					return 'm-footerBall i-m-footerballStar';
				}else if(rowName == "世界杯主题曲"){
					return 'm-footerBall i-m-footerballMisic';
				}else if(rowName == "手机图片"){
					return 'i-file-smalIcion i-f-sJpg';
				}else if(rowName == "我的音乐"){
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
                        return '<i class="i_file_16 i_m_hand"></i>';
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
		   				selectedDirIds.push(fid);
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
	   		}else if(self.videoExts.indexOf("/"+ext+"/") != -1){
		   		return self.previewTypes['VIDEO'];
	   		}else if(self.audioExts.indexOf("/"+ext+"/") != -1){
		   		return self.previewTypes['AUDIO'];
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
		getOutLinkHtml: function (data, callback) {
			top.M139.RichMail.API.call("disk:getOutLink", data, callback);
		},
		popupComposeSmallPop: function(fileList, data){
			var self = this;
			var itemTemp = '<li rel="largeAttach" objId="{objId}" filetype="i_cloudS"><i class="i_cloudS"></i>\
					<span class="ml_5">{prefix}<span class="gray">{suffix}</span></span>\
					<span class="gray ml_5">({fileSizeText})<span class="tiquma pl_5 black" style="display:none;">提取码：{tiquma}</span></span>\
					<a hideFocus="1" class="ml_5" href="javascript:void(0)" removeLargeAttach="{objId}">删除</a></li>';
			if (!this.filterFile(fileList)) {
	            top.$Msg.alert(this.model.tipWords.LIMIT_SIZE_SEND);
	            return ;
            }
			function getShortName(fileName) {
						if (fileName.length <= 30) return fileName;
						var point = fileName.lastIndexOf(".");
						if (point == -1 || fileName.length - point > 5) return fileName.substring(0, 28) + "…";
						return fileName.replace(/^(.{26}).*(\.[^.]+)$/, "$1…$2");
			}
			self.getOutLinkHtml(data, function(res){
				
				if(res.responseData.code === "S_OK"){
					var data = res.responseData["var"];
					var linkBeans = data.linkBeans;
					for(var i = 0; i < fileList.length; i++){
						var fileListItem = fileList[i];
						for(var j = 0, len = linkBeans.length; j < len; j++){
							var linkBeansItem = linkBeans[j];
							if(fileListItem.id === linkBeansItem.objID){
								fileListItem.linkUrl = linkBeansItem.linkUrl;
								fileListItem.passwd = linkBeansItem.passwd;
								break;
							}
						}
					}
					var htmlCode = "";
					var firstFileName = "";
					firstFileName = fileList[0].name;
					for(t = 0 ; t < fileList.length; t++){
						var item = fileList[t];
						var shortName = getShortName(item.name),
							prefix = shortName.substring(0, shortName.lastIndexOf('.') + 1),
							suffix = shortName.substring(shortName.lastIndexOf('.') + 1, shortName.length);
						var data = {
								objId : item.id,
								prefix: prefix,
								suffix: suffix,
								fileSizeText: M139.Text.Utils.getFileSizeText(item.file.fileSize),
								fileId: item.fileId
						};
						htmlCode += top.$T.Utils.format(itemTemp, data);
					}	
					top.$Evocation.create({type: "compose", subject: "【139邮箱-彩云网盘】" + firstFileName, content: "", whereFrom: "disk", diskContent: htmlCode, diskContentJSON:fileList});
				}else{
					top.M139.UI.TipMessage.show("获取文件链接失败", {className: "msgRed", delay:3000});
				}
			});
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
											'<img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" contentEditable="false" style="display:inline-block;vertical-align:middle;display: inline-block;margin-right: 5px;width: 32px;height: 32px;background: url(/m2012/images/global/disk-small-icon.png) no-repeat;background-position:' + getFileIcoBgPos($Url.getFileExtName(source.name)) + '">',
											'<span contentEditable="false" title="'+source.name+'">'+$TextUtils.getTextOverFlow(source.name, 18, true)+'</span>',
											'<span contentEditable="false" style="color:#ccc"> (' + $TextUtils.getFileSizeText(source.file.fileSize) + ')</span>',
											'<a contentEditable="false" href="' + item.linkUrl + '" target="_blank" style="margin-left: 15px;color: #1a75ca;text-decoration: none;">查看</a>',
										'</dd>'].join("");
					}
					outLinkHtml += '<dd contentEditable="false" style="margin:10px 0; padding-top:10px; border-top: 1px dashed #d7d7d7; color:#ccc;user-select:none;-webkit-user-select:none;-moz-userselect:none;">来自139邮箱 - 彩云网盘的分享</dd></dl><br><br>';
					top.$Evocation.create({type: "compose", subject: "【139邮箱-彩云网盘】" + firstFileName, content: outLinkHtml});
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
                music = 'mp3/wma/wav/mod/m4a',
				vedio = 'mp4,wmv,flv,rmvb,3gp,avi,mpg,mkv,asf,mov,rm',
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
            if(dirName == "世界杯"){
            	imagePath=self.imagePath+"footerBal.png";
            }else if(dirName == "精彩视频"){
            	imagePath=self.imagePath+"footerballMV.png";
            }else if(dirName == "精美壁纸"){
            	imagePath=self.imagePath+"footerbalStar.png";
            }else if(dirName == "世界杯主题曲"){
            	imagePath=self.imagePath+"footerBalMisic.png";
            }else if(dirName == "手机视频"){
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
	    	self.set('selectedFids', []);
	    	self.set('selectedDirIds', []);
	    	self.set('selectedDirAndFileIds', []);
	    	self.set('shareFileId', []);
        },
        // 获取初始化目录ID
        getInitializeDirid : function(){
        	var self = this;
			if(self.inputPara.dirId){
				top.firstEnterNet = false;
                return self.inputPara.dirId + '';
            }
			
			if(self.get("139MailId")){
				return self.get("139MailId");
			}
            
			var rootId = self.getRootDir();
			return rootId + '';
            

        },
        // 判断用户是否安装邮箱小工具
        isSetupMailTool : function(){
    //        return M139.Plugin.ScreenControl.isScreenControlSetup();
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
        }
	}));
})(jQuery, Backbone, _, M139);


/**
 * @fileOverview 彩云状态栏视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Officialsharing.View.Statusbar', superClass.extend(
	/**
	 *@lends M2012.Disk.View.prototype
	 */
	{
		el : "body",
		name : "M2012.Officialsharing.View.Statusbar",
        template : ['<div class="netdiskfl">',
			             '<div class="netdiskfldiv" id="navContainer">',
				             '<a href="javascript:;">官方共享</a>',
//				             '<span class="f_st">&gt;</span>',
//				             '<a href="javascript:void(0)">我的照片</a>',
//				             '<span class="f_st">&gt;</span>',
//				             '<span>阳朔旅游</span>',
			             '</div>',
		            '</div>', 
        			'<div class="netdiskfr">',
        				'<span class="viewTipPic fr mr_10">',
				             '<a href="javascript:void(0)" class="mr_5" id="listMode"><i class="i_view"></i>',
				             '</a>',
				             '<a href="javascript:void(0)" id="iconMode">',
				                 '<i class="i_list_checked"></i>',
				             '</a>',
				         '</span>',
				         '<div class="fileSearchBar fr mr_10">',
                             '<div class="fileSearchDiv hide">',
				                 '<input type="text" class="text gray" value="搜索彩云网盘" id="keywords">',
                             '</div>',
				             '<a bh="diskv2_search" href="javascript:void(0)" class="fileSearchBtn" id="search">',
				                 '<i class="i_g-search"></i>',
				             '</a>',
				         '</div>',
			             '<span class="mr_10">',
			                 '<a href="javascript:void(0)" onclick="top.$App.showOrderinfo()" id="upgrade" class="c_0066cc fr ml_10 mr_10">升级</a>',
			                 '<span class="diskprogressBarBlue fr"> <em class="growsBlow" style="width: {usedPercent}%;"></em> <em class="growFont">{usedSize}/{totalSize}</em>',
			                 '</span>',
			                 '<em class="fr">容量：</em>',
			             '</span>',
		          	 '</div>'].join(""),
		capacityTemplate : ['<span class="progressBarDiv viewtProgressBar">',
								'<span class="progressBar"></span>',
								'<span class="progressBarCur" role="progressbar">',
									'<span class="progressCenter" style="width: {usedPercent}%;"></span>',
								'</span>',
							'</span>',
							'<p>网盘容量：{usedSize}/{totalSize}<a href="javascript:void(0)" onclick="top.$App.showOrderinfo()" id="upgrade" class="ml_10">升级</a></p>'].join(""),
		listModeTemplate : ['<span class="viewTipPic fr mr_10 ml_10">',
				             '<a href="javascript:void(0)" class="mr_5" id="listMode"><i class="i_view_checked"></i>',
				             '</a>',
				             '<a href="javascript:void(0)" id="iconMode">',
				                 '<i class="i_list"></i>',
				             '</a>',
				         '</span>'].join(""),
		logger : new top.M139.Logger({name: "M2012.Disk.View.Statusbar"}),
		events : {
		},
		initialize : function(options) {
			this.model = options.model;
			return superClass.prototype.initialize.apply(this, arguments);
		},
		initEvents : function(){
        	var self = this;
        	// 文件搜索
        	$("#keywords").blur(function(){
        		var text = $(this).val();
        		if(!text){
        			text = self.model.defaultInputValue;
        		}
        		$(this).val(text);
        	}).focus(function(){
        		var text = $(this).val();
        		if(text == self.model.defaultInputValue){
        			$(this).val('');
        		}
        	});
        	$("#search").click(function(event){
				self.searchFiles();
				return;
				/*
        		var jKeywords = $("#keywords");
                var jKeywordsParent = jKeywords.parent();

        		if(jKeywordsParent.hasClass('hide')){
                    jKeywordsParent.removeClass('hide');
                    var keyword = self.model.inputPara.keyword;
                    if(keyword && keyword != self.model.defaultInputValue){
                        jKeywords.val(keyword);
                        self.searchFiles();
                    }

                }else{
        			var text = jKeywords.val();
	        		if(!text || text === self.model.defaultInputValue){
                        jKeywordsParent.addClass('hide');
	        		}else{
	        			self.searchFiles();
	        		}
        		}*/
        	});
        	// 文件搜索支持回车事件
			if($B.is.ie && $B.getVersion() == 6){
				$("#keywords").bind('keydown', function(event){
					if(event.keyCode == M139.Event.KEYCODE.ENTER){
						$("#search").click();
					}
				}).bind('keypress', function(event){
					if(event.keyCode == M139.Event.KEYCODE.ENTER){
						$("#search").click();
					}
				});
			}else{
				$("#keywords").bind('keydown', function(event){
					if(event.keyCode == M139.Event.KEYCODE.ENTER){
						$("#search").click();
					}
				});
			};

        	// 列表模式切换
        	$("#listMode").click(function(event){
                var target = $(this);

                self.changeViewTip(function(){
                    self.model.set('listMode', 0);
                    $("#iconMode i").attr('class', 'i_list_checked');
                    target.find('i').attr('class', 'i_view');
                });
				BH("disk3_list");
				$("#fileName2").show();
				$(".diskTableList.onScollTable").show();
        	});
        	$("#iconMode").click(function(event){
                var target = $(this);

        		self.changeViewTip(function(){
                    self.model.set('listMode', 1);
                    $("#listMode i").attr('class', 'i_view_checked');
                    target.find('i').attr('class', 'i_list');
                });
				BH("disk3_filethumbnail");
				$("#fileName2").hide();
				$(".diskTableList.onScollTable").hide();
        	});
        },
		render : function(){
		    var self = this;
		    $("#keywords").val(self.model.defaultInputValue);
		    var html = $T.Utils.format(self.template, self.model.getStatusObj());
			var htmlcap = $T.Utils.format(self.capacityTemplate, self.model.getStatusObj());
		 	$("#diskStatus").html(html);
			$("#capacityTemplate").html(htmlcap);
			$("#listModeContainer").html(self.listModeTemplate);
		 	$("#pcClientSetup").html(top.SiteConfig["pcClientSetupHtml"]);

		 	// 根据用户套餐信息显示升级链接
		 	if(self.model.isServiceItem()){
		 		var jUpgrade = $("#upgrade");
		 	//	$(".diskprogressBarBlue").addClass('mr_10');
		 	//	jUpgrade.hide();
		 	}
			self.navigatorContainer = {};//面包屑缓存
		},
		// 渲染目录导航 
		renderNavigation : function(dirid){
			var self = this;
			$("#navContainer").html(self.getNavHtml(dirid));
			self.initNavEvents();
		},
		// 获取目录导航html
		getNavHtml : function(dirid){
			var self = this;
		//	debugger;
            var rootId = self.model.getRootDir();
			if(!dirid){
				dirid = self.model.get('curDirId');
			}
			if(self.navigatorContainer[dirid]){
				return self.navigatorContainer[dirid];
			}
			var curDirObj = self.model.getDirById(dirid);

			self.showHref(curDirObj);
			self.model.set('parentDirs', []);
			self.model.setParentDirs(curDirObj);
			var parentDirs = self.model.getParentDirs();
			var navHtml = [];
			if(parentDirs && parentDirs.length > 0){
				$(parentDirs).each(function(i){
					if(this.directoryName && this.directoryName.length > 10){
						this.directoryName = this.directoryName.substring(0,10) + "...";
					}
					if(curDirObj.directoryName && curDirObj.directoryName.length > 10){
						curDirObj.directoryName = curDirObj.directoryName.substring(0,10) + "...";
					}
					if(i == 0){
						navHtml.push('<a href="javascript:;" fileid="');
						navHtml.push(rootId);
						navHtml.push('" filetype="0');
						navHtml.push('">官方共享</a>');
					}else{
						navHtml.push('<span class="f_st">&nbsp;&gt;&nbsp;</span>');
						navHtml.push('<a href="javascript:void(0)" fileid="');
						navHtml.push(this.directoryId);
						navHtml.push('" filetype="');
						navHtml.push(this.dirType);
						navHtml.push('">');
						navHtml.push(this.directoryName);
						navHtml.push('</a>&nbsp;');
					}
				});
				navHtml.push('<span class="f_st">&nbsp;&gt;&nbsp;</span>');
				navHtml.push('<span>');
				navHtml.push(curDirObj.directoryName);
				navHtml.push('</span>');
			}else{
				navHtml.push('<a href="javascript:;" fileid="');
                navHtml.push(rootId);
				navHtml.push('" filetype="0">官方共享</a>');
				//navHtml.push(curDirObj.directoryId);
                ///navHtml.push(10);
                //navHtml.push('" filetype="0');
				//navHtml.push('');
			}
			self.navigatorContainer[dirid] = navHtml.join('');
			return navHtml.join('');
		},
		// 为导航添加单击事件
		initNavEvents : function(){
			var self = this;
            var curDirLevel = self.model.get('curDirLevel');
            var userDirLimit = self.model.dirLevelLimit.USER_DIR;
			$("#navContainer a").click(toggleDirHandle);
			$("#navContainer strong").click(toggleDirHandle);

            function toggleDirHandle(){
				top.firstEnterNet = false;
                var dirId = $(this).attr('fileid');
                var dirType = $(this).attr('filetype');
                var dirObj = self.model.getDirById(dirId);
                var dirLevel = dirObj.directoryLevel;
                self.model.set('curDirType', dirType);
				var curDirId = self.model.get("curDirId");
				if(curDirId == self.model.getRootDir()){
					self.model.trigger('openDir', curDirId);
					return;
				}
				var curDirObj = self.model.getDirById(curDirId);
				self.showHref(dirObj);
                self.model.set('curDirId', dirId);
                self.model.set("curDirLevel", dirLevel);
                self.model.set("selectedFids", []);
                self.model.set("selectedDirIds", []);
                self.model.set("selectedDirAndFileIds", []);

                self.model.trigger("changeFileTypeUpload");
                //todo
                if(dirLevel != userDirLimit){   //当用户从自定义文件夹第四级目录下的文件点击当前位置菜单第四级需要用到
                    self.model.set("curDirLevel", 1);
                }
            }
		},
        //切换视图提示
        changeViewTip: function (callback) {
        	/*

            var self = this;
            var isUploading = mainView.uploadModel.isUploading();

            if (isUploading) {
                if (window.confirm(self.model.tipWords["UPLOADING_CHANGE_VIEW"])) {
                    callback && callback();
                }
            } else {
                callback && callback();
            }
            */
            callback && callback();
        },
    	showHref:function(curDirObj){//导航为大画体坛时候显示链接
			if(curDirObj.directoryName == "大画体坛"){
				$("#subNav").show();
			}else{
				$("#subNav").hide();
			}
    	},
		// 搜索文件
		searchFiles : function(){
			var self = this;
		//	var keywords = $.trim($("#keywords").val());
			var keywords = $T.Html.encode($Url.getQueryObj()["keyword"]) || "";//从URL获取搜索的内容
			self.model.search(function(result){
				if(result.responseData.code && result.responseData.code == 'S_OK'){
					var files = result.responseData['var'].files;
                    self.model.selectNone();//解决 选中文件之后 在搜索中输入关键字搜索后，还会显示之前的已选中多少文件
					self.model.set('fileList', files);
					
					$("#navContainer").html('搜索包含“'+keywords+'”的彩云网盘文件，共'+files.length+'个');
					self.model.set('searchStatus', -self.model.get('searchStatus'));
    			}else{
    				self.logger.error("search returndata error", "[disk:search]", result);
    			}
			}, keywords);
		}
	}));
})(jQuery, _, M139);



﻿M139.namespace("M2012.Officialsharing.View", {// todo 类的用途，从model继承
	Command: Backbone.View.extend({
		el: "",
		initialize: function(options) {
            this.model = options.model;

            var self = this;
            top.$App.unbind("diskCommandMock")
                .on("diskCommandMock", function (args) {//监听其他模块发起的菜单命令
                self.doCommand(args.command, args);
            });
		},
        doCommand: function (command, args) {
            var self = this,
                model = self.model,
                dataSend = args.data,
                isLineCommand = args.isLineCommand,
                commands = model.commands;

            var isSelected = this.isSelected(dataSend);

            switch (command) {
                case commands.UPLOAD:
                    //alert("上传文件");
                    break;
                case commands.CREATE_DIR:
                    model.trigger("createDir", dataSend);
                    break;
                case commands.DOWNLOAD:
                    if (isSelected) {
                        model.trigger("download", dataSend);
                    } else {
                        top.$Msg.alert(model.tipWords.NO_FILE);
                    }
                    break;
                case commands.PLAY:
                    if (isSelected) {
                        model.trigger("play");
                    } else {
                        top.$Msg.alert(model.tipWords.NO_FILE);
                    }
                    break;    
                case commands.SHARE:
                    if (isSelected) {
                        model.trigger("share");
                        self.model.sendLogger({file : 'diskv2_sharefile', dir : 'diskv2_sharefolder'});
                    } else {
                        top.$Msg.alert(model.tipWords.NO_FILE);
                    }
                    break;
                case commands.SEND_TO_MAIL:
                    self.commandSend(dataSend, self.model.sendTypes["MAIL"], isLineCommand);
                    break;
                case commands.SEND_TO_PHONE:
                    self.commandSend(dataSend, self.model.sendTypes["MOBILE"]);
                    break;
                case commands.REMOVE:
                    self.commandRemove(dataSend);
                    break;
				case commands.DRAG:
                    self.commandDragMove(dataSend);
                    break;
                case commands.SET_COVER:
                    if (isSelected) {
                        self.commandSetCover(dataSend);
                    }else{
                        top.$Msg.alert(model.tipWords.NO_FILE);
                    }
                    break;
                case commands.POSTCARD:
                    if (isSelected) {
                        self.commandPsotcard(dataSend);
                    }else{
                        top.$Msg.alert(model.tipWords.NO_FILE);
                    }
                    break;
                case commands.RENAME:
                    if (isSelected) {
                        model.trigger("renameDirAndFile", dataSend);
                        model.sendLogger({file : 'diskv2_renamefile', dir : 'diskv2_renamefolder'});
                    } else {
                        top.$Msg.alert(model.tipWords.NO_FILE);
                    }
                    break;
                case "savetodisk":
                    if (isSelected) {
                        model.trigger("savetodisk", dataSend);
                    } else {
                        top.$Msg.alert(model.tipWords.NO_FILE);
                    }
                    break;
                case commands.DELETE:
                    if (isSelected){
                        self.commandDelete(dataSend, args.filename);
                        self.model.sendLogger({file : 'diskv2_deletefile', dir : 'diskv2_deletefolder'});

                    }else{
                        top.$Msg.alert(model.tipWords.NO_FILE);
                    }
                    break;
				case "open":
					var fileids = self.model.get("selectedDirAndFileIds");
					if(fileids.length != 1){
						return;
					}
					var folder = $("em[fileid='"+ fileids[0] +"']");
					if(folder.length == 0){
						folder = $("img[fileid='"+ fileids[0] +"']");
					}
					folder[0].click();
            }
        },
        commandDelete: function (data, filename) {
            var self = this;
            var model = self.model;
//            var selectedDirAndFileLen = model.getSelectedDirAndFileOverflowNames(filename).length;
//            var selectedDirAndFileNames = model.getSelectedDirAndFileOverflowNames(filename).join(",");
            var tipContent;
            var selectedDirAndFileLen = model.get('selectedDirAndFileIds').length;
            var selectedFidLen = model.get('selectedFids').length;
            var selectedDirLen = model.get('selectedDirIds').length;
            var extName = $T.Url.getFileExtName(filename);
            if(filename){
                if(extName){
                    tipContent = model.tipWords.DELETE_FILE.format(1);
                }else{
                    tipContent = model.tipWords.DELETE_DIR.format(1);
                }
            }else if(selectedFidLen>0 && selectedDirLen>0){
                tipContent = model.tipWords.DELETE_FILEANDDIR.format(selectedDirLen, selectedFidLen);
            }else if(selectedFidLen>0){
                tipContent = model.tipWords.DELETE_FILE.format(selectedFidLen);
            }else if(selectedDirLen>0){
                tipContent = model.tipWords.DELETE_DIR.format(selectedDirLen);
            }
            top.$Msg.confirm(tipContent, function(){
                model.trigger("deleteDirsAndFiles", data);

            }, function(){
                //cancel
            }, {
                buttons: ["是", "否"]
            });
        },
        commandSetCover : function(data){
            var self = this;
            self.model.trigger("setCover", data);
        },
        commandPsotcard : function(){
            var self = this,
                model = self.model;
            self.model.trigger("postCard"); 
        },
        // isLineCommand 代表是否直接点击列表中的发送链接
        commandSend: function (data, type, isLineCommand) {
            if (!this.isSelected(data) && !isLineCommand) {
                top.$Msg.alert(this.model.tipWords.NO_FILE);
            } else if (this.isSelectedDir(data)) {
                top.$Msg.alert(this.model.tipWords.CANT_SEND_FOLDER);
            } else {
                this.sendFiles(type, data);
            }
        },
		commandDragMove: function(dataSend){
			//拖拽移动
			function getData(){
                var data = {
                    fileIds: model.get("selectedFids").join(","),
                    directoryIds: model.get("selectedDirIds").join(","),
                    srcDirType: model.getDirTypeForServer()
                };
                return data;
            }
			console.log(getData());
		},
        commandRemove: function (dataSend) {
        	var self = this;
            var isSelected = this.isSelected(dataSend);
            var model = this.model;

            if (isSelected) {
                var moveToDiskview = new top.M2012.UI.Dialog.SaveToDisk({
                    fileName: model.getSelectedDirAndFileNames().join(","),
                    data : getData(),
                    type : 'diskFileMove'
                });
                moveToDiskview.render().on("success", function () {
                    self.model.trigger('refresh', null);
                });
            } else {
                top.$Msg.alert(model.tipWords.NO_FILE);
            }

            function getData(){
                var data = {
                    fileIds: model.get("selectedFids").join(","),
                    directoryIds: model.get("selectedDirIds").join(","),
                    srcDirType: model.getDirTypeForServer()
                };
                return data;
            }
        },
        
        sendFiles: function (type, data) {
	        var model = this.model;
            var fileList = [];

			var requestData = {
				linkType: 0,
				encrypt: 0,
				pubType: 1,
				fileIds: ""
			};

            if (data) {
                var fids = data.fileIds;
                requestData.fileIds = data.fileIds.join(",");
                for (var i = 0, len = fids.length; i < len; i++) {
                    var fileItem = model.getFileById(fids[i]);
                    fileList.push(fileItem);
                }
            } else {
                fileList = model.getSelectedFiles();
                requestData.fileIds = _.pluck(fileList, "id").join(",");
            }

            if(model.get("isMcloud") == "0"){
            	model.gotoSendPage({fileList : fileList, type: type});
            } else {
	            model.popupComposeSmallPop(fileList, requestData);
            }
        },

        //是否选择了目录或者文件
        isSelected: function (data) {
            var value;

            if (data) {
                value = data.fileIds || data.directoryIds ? true : false;
            } else {
                value = this.getSelectedFileId() || this.getSelectedDirId() ? true : false;
            }

            return value;
        },
        isSelectedDir: function (data) {
            var value;

            if (data) {
                value = data.directoryId ? true : false;
            } else {
                value = this.getSelectedDirId() ? true : false;
            }

            return value;
        },
        getSelectedFileId: function(){
            return this.model.get("selectedFids").join(",");
        },
        getSelectedDirId: function(){
            return this.model.get("selectedDirIds").join(",");
        },
        getFileAndDirIds: function(){
            var ids = this.model.get("selectedFids").concat(this.model.get("selectedDirIds"));

            return ids.join(",");
        }
	})
});

/**
 * @fileOverview 彩云工具栏视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Officialsharing.View.Toolbar', superClass.extend(
	/**
	 *@lends M2012.Disk.View.prototype
	 */
	{
		el : "body",
		name : "M2012.Officialsharing.View.Toolbar",
		events : {
            "click #createDir"  : "createDir",
            "click #download"   : "download",
            "click #play"   	: "play",
            "click #rename"     : "rename",
            "click #share"      : "share",
			"click #delete"     : "deleteDirsAndFiles",
            "click #setCover"   : "setCover",
            "click #postcard"   : "postcard",
            "click #remove"     : "remove",
			"click #sortDock"   : "showSortTable",
			"click #sendFile"   : "sendToMail",
            "click #savetodisk" : "savetodisk"
		},
		initialize : function(options) {
			var self = this;
			this.model = options.model;
            this.parentView = options.parentView;
            this.initEvents();
			return superClass.prototype.initialize.apply(this, arguments);
		},
		initMoreBtns : function(flag){
			var self = this;
			$("#more").html("");
			var menuItems = [
					{
                        text: "分享给好友",
                        onClick: function(){ self.share();}
                    },
                    {
                        text: "移动到",
                        onClick: function(){ self.remove();}
                    },
                    {
                        text: "重命名",
                        onClick: function(){ self.rename();}
                    }
                ];
			if(!flag){
				menuItems = [menuItems[1]];
			}else{
				menuItems = menuItems;
			}
			M2012.UI.MenuButton.create({
				text:"更多",
				container:$("#more"),
				leftSibling:true, //左边还有按钮，影响样式
				rightSibling:false, //右边还有按钮，影响样式
				menuItems:menuItems
			});
			//修改样式 默认的button已经修改
		//	$("#more > a").removeClass("btnTb").addClass("btn ml_10");
		//	$("#more span").replaceWith('<em>更多</em><i class="triangle t_globalDown"></i>');
		},
        initEvents:function () {
            var self = this;
			//顶部按钮
			this.initMoreBtns(1);
            // 关闭小工具引导层
            $("#closeSetupTool").click(function(event){
                $("#setupToolContainer").hide();
            });

            // 绑定排序菜单单击事件
            var sortTypes = self.model.sortTypes;
            $("#sortMenus li[name='fileName']").click(function (event) {
                self.model.set('sortType', sortTypes['FILE_NAME']);
                self.model.set('sortIndex', -self.model.get('sortIndex'));

                $("#sortMenus").hide();
            });
            $("#sortMenus li[name='uploadTime']").click(function (event) {
                self.model.set('sortType', sortTypes['UPLOAD_TIME']);
                self.model.set('sortIndex', -self.model.get('sortIndex'));

                $("#sortMenus").hide();
            });
            $("#sortMenus li[name='fileSize']").click(function (event) {
                self.model.set('sortType', sortTypes['FILE_SIZE']);
                self.model.set('sortIndex', -self.model.get('sortIndex'));

                $("#sortMenus").hide();
            });

            //上传按钮初始化
            this.createBtnUpload();

            self.model.on("change:sortType", function(){// 排序类型
                self.parentView.fileListView.sortByType(); // 排序model层数据
                self.model.trigger("renderFileList");// 重新渲染文件列表
                self.renderSortMenu();// 重新渲染排序菜单
            });
            self.model.on("change:sortIndex", function(){// 排序方式 升序或者降序
                self.parentView.fileListView.sortByType();
                self.model.trigger("renderFileList");
                self.renderSortMenu();
            });
            self.model.on("renderBtns", function () {// 重新渲染工具栏按钮
                self.renderBtns();
            });
            self.model.on("change:isRenameActivate", function(){//工具栏重命名按钮是否激活
				  var isActivate = self.model.get('isRenameActivate');
            //    var jRename = $("#rename");
                if(isActivate){
                    self.initMoreBtns(1); //有 重命名和共享
                }else{
                    self.initMoreBtns(0); //无 重命名和共享
                }
            });
			self.model.on("change:hasSysFolders", function(){//工具栏重命名按钮是否激活
				  var isActivate = self.model.get('hasSysFolders');
            //    var jRename = $("#rename");
                if(isActivate){
                //    $("#sendFile").show(); //有 重命名和共享
				//	$("#delete").show();
				//	$("#more").show();
                }else{
                    $("#sendFile").hide(); //有 重命名和共享
					$("#delete").hide();
					$("#more").hide();
                }
            });
            self.model.on("change:isShareActivate", function(){//工具栏分享按钮是否激活
                var isActivate = self.model.get('isShareActivate');
				if(isActivate){
                    self.initMoreBtns(1); //有 重命名和共享
                }else{
                    self.initMoreBtns(0); //无 重命名和共享
                }
			/*
                var jShare = $("#share");
                if(isActivate){
                    jShare.find('a').show();
                }else{
                    jShare.find('a').hide();
                }
			*/	
            });
			self.model.on("change:hasFolders", function(){//工具栏重命名按钮是否激活
				  var isActivate = self.model.get('hasFolders');
            //    var jRename = $("#rename");
                if(isActivate){
            //        $("#sendFile").show(); //有 重命名和共享
                }else{
                    $("#sendFile").hide(); //有 重命名和共享
                }
            });
            self.model.on("change:isSetCoverActivate", function(){// 工具栏设为封面按钮是否激活
                var isActivate = self.model.get('isSetCoverActivate');
                var jsetCover = $("#setCover");
                if(isActivate){
                    jsetCover.find('a').show();
                }else{
                    jsetCover.find('a').hide();
                }
            });
            self.model.on("change:isPostCardActivate", function(){// 工具栏明信片按钮是否激活
                var isActivate = self.model.get('isPostCardActivate');
                var jPostCard = $("#postcard");
                if(isActivate){
                    jPostCard.find('a').show();
                }else{
                    jPostCard.find('a').hide();
                }
            });
            self.model.on("change:isPlayActivate", function(){// 工具栏明信片按钮是否激活
                var isActivate = self.model.get('isPlayActivate');
                var jPlay = $("#play");
                if(isActivate){
                    jPlay.find('a').show();
                }else{
                    jPlay.find('a').hide();
                }
            });
            self.model.on('change:isCreateBtnShow', function(){// 工具栏新建文件夹按钮是否显示
                var isShow = self.model.get('isCreateBtnShow');
                var jCreateDirBtn = $('#createDir');
                if(isShow){
                    jCreateDirBtn.css('display','none');
                }else{
                    jCreateDirBtn.css('display','block');
                }
            });
        },
		showAll: function(e){
			BH("disk3_getAll");
			$("#disk-main").show();
			$("#iframe-main").hide();
			$("#all").click();
		},
        createBtnUpload: function(){
            
        },
		render : function() {
			var self = this;
			
            var model = self.model;
            if(!model.isSetupMailTool() && model.get('isMailToolShow')){
                //$("#maxUploadSize").html(self.model.getMaxUploadSize());
                model.set('isMailToolShow', 0);// 只提示一次
            }
			model.trigger("createPager", null);
		},
		// 渲染工具栏按钮状态
		renderBtns : function(){
			var self = this,
                model = self.model;
			var selectedCount = self.model.get('selectedDirAndFileIds').length;
			var selectedFolders = self.model.get("selectedDirIds");
			var hasSysFolders = false;
			$.each(selectedFolders, function(){
				if(self.model.isRootDir(this)){
					hasSysFolders = true;
					return false;
				}
			});
			$("#savetodisk").hide();
			if(selectedFolders.length > 0){
				self.model.set('hasFolders', 0);
				 $("#download").hide();
			}else{
				self.model.set('hasFolders', 1);
				$("#download").show();
			}
			if(hasSysFolders){
				self.model.set('hasSysFolders', 0);
			}else{
				self.model.set('hasSysFolders', 1);
			}
        	if(selectedCount > 1){
				self.model.set('isRenameActivate', 0);
				self.model.set('isShareActivate', 0);
                self.model.set('isSetCoverActivate', 0);
                self.model.set('isPostCardActivate', 0);
			}else{
				self.model.set('isRenameActivate', 1);
				self.model.set('isShareActivate', 1);
                self.model.set('isSetCoverActivate', 1);
                
                if(selectedCount === 1 && self.model.get('selectedDirIds').length === 1){ // 目录不支持明信片
                	self.model.set('isPostCardActivate', 0);
                }else{
                	self.model.set('isPostCardActivate', 1);
                }
			}
			var selectedDirCount = self.model.get('selectedDirIds').length;
			if(selectedDirCount > 1){
				self.model.set('isPlayActivate', 0);
			}else{
				self.model.set('isPlayActivate', 1);
			}

            //是否显示新建文件夹按钮
            var curDirLevel = model.get('curDirLevel'),
                curDirType = model.get('curDirType'),
                userDirLimit = model.dirLevelLimit.USER_DIR,
                sysDirLimit = model.dirLevelLimit.SYS_DIR,
                userDirType = model.dirTypes.USER_DIR,
                albumDirType = model.dirTypes.ALBUM,
                musicDirType = model.dirTypes.MUSIC;

            if((curDirLevel >= userDirLimit && curDirType == userDirType) || (curDirLevel == sysDirLimit && curDirType == albumDirType) || (curDirLevel==sysDirLimit && curDirType == musicDirType)){
                self.model.set('isCreateBtnShow', 1);
            }else{
                self.model.set('isCreateBtnShow', 0);
            }
            var $uplaodTxt = $('#upload label');
            var $floatLoadDiv = $('#floatLoadDiv');
            //toolbar根据是相册or音乐or普通目录所显示的工具栏不同
			/*
			if(curDirType == model.dirTypes.ALBUM){
                $('#createDir span').html('新建相册');
                $uplaodTxt.html('上传照片');
                $('#play').hide();
                if(curDirLevel == sysDirLimit){
                    $('#setCover').show();
                }else{
                    $('#setCover').hide();
                    $('#postcard').show();
                    $floatLoadDiv.find('input[name="uploadInput"]').css('width','160px').end().css('width','160px');
                }
            }else if(curDirType == model.dirTypes.MUSIC){
                $('#createDir span').html('新建专辑');
                $uplaodTxt.html('上传歌曲');
                $('#postcard').hide();
//                $('#play').show();
                $floatLoadDiv.find('input[name="uploadInput"]').css('width','160px').end().css('width','160px');
            }else{
                $('#createDir span').html('新建文件夹');
                $('#postcard,#setCover,#play').hide();
                $uplaodTxt.html('上&nbsp;传');
                $floatLoadDiv.find('input[name="uploadInput"]').css('width','160px').end().css('width','160px');
            }
			*/
            
        },
		upload : function(event) {
			var self = this;
			self.doCommand(self.model.commands.UPLOAD);
		},
        download : function(event) {
			var self = this;
			self.doCommand(self.model.commands.DOWNLOAD);
		},
		play : function(play){
			var self = this;
			if(self.model.get('isPlayActivate')){
				self.doCommand(self.model.commands.PLAY);
			}
		},
        createDir : function(event) {
            var self = this;
            self.doCommand(self.model.commands.CREATE_DIR);
            BH({key : "diskv2_createfolder"});
            return false;
        },
        share: function (event) {
            var self = this;

            if (self.model.get('isShareActivate')) {
                self.doCommand(self.model.commands.SHARE);
            }
            return false;
        },
        savetodisk: function(){
            this.doCommand("savetodisk");
        },
		sendToMail : function() {
			var self = this;
			BH("disk3_send");
			self.doCommand(self.model.commands.SEND_TO_MAIL);
		},
		sendToPhone : function() {
			var self = this;
			self.doCommand(self.model.commands.SEND_TO_PHONE);
		},
		remove : function(event) {
			var self = this;
			self.doCommand(self.model.commands.REMOVE);
		},
        setCover : function(event){
            var self = this;
            if(self.model.get('isSetCoverActivate')){
                self.doCommand(self.model.commands.SET_COVER);
            }
        },
        postcard : function(event){
            var self = this;
            if(self.model.get('isPostCardActivate')){
				self.doCommand(self.model.commands.POSTCARD);
			}
        },
		rename : function(event) {
			var self = this;
			BH('caiyunRename');
			if(self.model.get('isRenameActivate')){
				self.doCommand(self.model.commands.RENAME);
			}
            return false;
		},
        deleteDirsAndFiles : function(event) {
			var self = this;
			BH('caiyunDel');
			self.doCommand(self.model.commands.DELETE);
		},
		doCommand : function(command, args) {
            !args && (args = {});
            args.command = command;
            top.$App.trigger("diskCommandMock", args);
		},
		showSortTable : function(event){
			var jSortMenus = $("#sortMenus"),_self = this;;
			jSortMenus.css({width : 125});
			BH('caiyunSort');
			jSortMenus.show();
			M139.Dom.bindAutoHide({
                action: "click",
                element: jSortMenus[0],
                stopEvent: true,
                callback: function () {
                    jSortMenus.hide();
                    _self.model.trigger("renderBtns", null);
                    M139.Dom.unBindAutoHide({ action: "click", element: jSortMenus[0]});
                }
            });
            top.$Event.stopEvent(event);
		},
        // 根据排序类型渲染排序菜单
		renderSortMenu : function(){
			var self = this;
        	var sortType = self.model.get('sortType');
        	var selector = "#sortMenus li[name="+sortType+"]";
	    	var jSortType = $(selector);
	    	
	    	$("#sortMenus li.cur").removeClass('cur').find('em').remove('.downRinking');
	    	
	    	var sortState = self.model.get('sortIndex') == 1?'↑':'↓';
        	jSortType.addClass('cur').find('span').append('<em class="downRinking">'+sortState+'</em>');
		},
		createPager : function() {
			var self = this;
			var pagerContainer = $("#filelist_pager");
			pagerContainer.html("");
			//先清除
			var pageCount = this.model.getPageCount();
			//生成分页
			this.pager = M2012.UI.PageTurning.create({
				styleTemplate : 2,
				container : pagerContainer,
				pageIndex : this.model.get("pageIndex"),
				maxPageButtonShow : 5,
				pageCount : pageCount
			});
			this.pager.on("pagechange", function(index) {
				self.model.set("pageIndex", index);
			});
		}
	}));
})(jQuery, _, M139);

/**
 * @fileOverview 定义彩云文件列表视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Officialsharing.View.Filelist', superClass.extend(
	/**
	 *@lends M2012.Fileexpress.Cabinet.View.prototype
	 */
	{
		el : "body",
		name : "M2012.Officialsharing.View.Filelist",
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
		// 渲染官方共享
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
				//	$("#sendFile").show();
				//	$("#delete").show();
				//	$("#more").show();
				}else{
					$("#download").hide();
					$("#sendFile").hide();
					$("#delete").hide();
					$("#more").hide();
				}
			}
		 	$("#fileList").html(html);
			//空模板 上传事件
			$("#noFileAndUpload").click(function(){
				$("#uploadFileInput").click();
			});
			self.fixList();
            self.hideOperates();
		 	self.reselectFiles();
		 	self.renderSelectAll(pageData);
		 	self.initClickEvents();
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
				var filetype = target.attr('filetype');
				var id = target.attr('fileid');
				if(name === 'fname'){
					if(filetype == self.model.dirTypes['FILE'] || !filetype){// 预览文件
						self.previewFile(id, target);
						BH({key : "diskv2_preview"});
					}else{// 打开文件夹
					
						var dirObj = self.model.getDirById(id);
						var dirLevel = dirObj.directoryLevel;
						if(dirObj.directoryName == "大画体坛"){//导航为大画体坛时候显示链接
							$("#subNav").show();
						}else{
							$("#subNav").hide();
						}
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
            console.log("dataSend="+dataSend)
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
	        top.$App.trigger("diskCommandMock", args);
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
				presentURL = fileArea.presentURL || fileArea.presentLURL || fileArea.presentHURL;
			}
			//if(!presentURL) return ;

			url += "&id=" + fileObj.id;
			url += "&name=" + encodeURIComponent(fileObj.name);
			url += "&curDirType=" + this.model.get("curDirType");
			//url += "&parentDirectoryId=" + fileObj.file.directoryId;
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
			
			$.each(fileList, function(i, item){
				var ext = $Url.getFileExtName(item.name).toLowerCase();
				if(musicTypes.indexOf("|"+ext+"|") >= 0){
					playList.push({
						id: item.id,
						url: item.file && item.file.presentURL,
						text: item.name
					});
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
			var fsize = fileObj.file.fileSize;
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
				return;
			}

			var options = {fileIds : fid, dirType : dirType, isFriendShare: 0};
			self.model.download(function(result){
				var result = result[0];
				if(result.code && result.code == 'S_OK'){
					var downloadUrl = result['var'].url;
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
						thumbnailURL: item.file.thumbnailURL,
						bigthumbnailURL: item.file.bigthumbnailURL,
						presentURL: item.file.bigthumbnailURL,
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

/**
 * @fileOverview 定义彩云文件缩略图视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Officialsharing.View.Filethumbnail', superClass.extend(
	/**
	 *@lends M2012.Disk.View.prototype
	 */
	{
		el : "#fileList",
		name : "M2012.Officialsharing.View.Filethumbnail",
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
            /*
            */
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
                    //屏蔽鼠标移动上去小弹窗tips
					if(fileType == "file" && 0){
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
						var top1 = offset.top + 117;
						if(offset.top + 114 + self.currentHtml.height() > $(window).height()){
							top1 = top1 - self.currentHtml.height() - 127;
							self.currentHtml.find(".diamond").addClass("tipsBottom").removeClass("tipsTop");
						}else{
							self.currentHtml.find(".diamond").addClass("tipsTop").removeClass("tipsBottom");
						}
						self.currentHtml.css({top: top1, left: offset.left}).show();
					//	}, 50);
					}
				
				
            });

            $lis.live("mouseleave", function(e){
                var target = $(this);
                var isSelected=target.find(".chackPbar input").attr("checked");
				var fileid = target.find("a[fileid]").attr("fileid");
                //屏蔽
					if(fileid in self.containter && 0){
						self.currentHtml = self.containter[fileid];
					//	setTimeout(function(){
							self.currentHtml.hide();
					//	}, 50);
					}
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
        		var defaultImage = self.model.imagePath + 'fail.png';
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
						if(dirObj.directoryName == "大画体坛"){//导航为大画体坛时候显示链接
							$("#subNav").show();
						}else{
							$("#subNav").hide();
						}
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
		render : function (){
		    var self = this;
		//    var pageData=self.model.getPageData(self.model.get("pageIndex"));
			var pageData = self.model.get("fileList"); //数据源已变化
            var imageList = self.model.get('imageList');
            var curDirType = self.model.get('curDirType');
            var html="";
            if(pageData.length>0){
			//	$("#toolBar").show();
				hideOrShow(true);
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
					hideOrShow(false);
                }
            }
			function hideOrShow(flag){
				if(flag){
					$("#download").show();
				//	$("#sendFile").show();
				//	$("#delete").show();
				//	$("#more").show();
				}else{
					$("#download").hide();
					$("#sendFile").hide();
					$("#delete").hide();
					$("#more").hide();
				}
			}
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
                top.$App.trigger("diskCommandMock", args);
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
                if($.inArray(fid, selectedFids) != -1){
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

/**
* @fileOverview 彩云主视图层.
*@namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Officialsharing.View.Main', superClass.extend(
        /**
        *@lends M2012.Disk.View.prototype
        */
    {
        el: "body",
        name : "M2012.Officialsharing.View.Main",
        logger: new top.M139.Logger({name: "M2012.Officialsharing.View.Main"}),
		first : true,
        events: {
        },
        initialize: function (options) {
        	this.model = options.model;
            this.initParams();
			setTimeout(function(){
				$("#outArticle").height($(top.document.body).height() - 47 - 29 - 8).css("over-flow","hidden");; //减去多余4像素
			},0);
			window.onresize = function(){
				$("#outArticle").height($(top.document.body).height() - 47 - 29 - 8);
			}
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initEvents : function(){
        	var self = this;

            /*window.onbeforeunload = function(e){
                var p=$("object").parent().parent();
                var node=$("object").parent();
                $("object").parent().remove();
                setTimeout(function(){
                    p.append(node);
                    insertFlashCode();
//                    self.toolbarView.createBtnUpload();
                },500);
                //document.body.innerHTML="";

                *//*var isRemoveFlash = self.model.get("isRemoveFlash");

                if (isRemoveFlash) { // 页面卸载或跳转前先移除掉flash，防止ie8报错
                    $("object").parent().remove();
                    document.body.innerHTML="<div></div>";
                } else { // 下载时触发是不需要移除flash的
                    self.model.set("isRemoveFlash", true);
                }*//*
            };*/

        	// 监听model层数据变化
			self.model.on("change:pageIndex", function(){// 翻页
				var curDirid = self.model.get('curDirId');
				var curDirtype = self.model.get('curDirType');
				var options = {dirid : curDirid, dirType : curDirtype};
				self.getFiles(function(){
							self.model.trigger('createPager');
							self.model.trigger("renderFileList");
				}, options);
		    });
		    self.model.on("change:listMode", function(){// 视图切换
		    	self.model.trigger("renderFileList");
		    });
			//pageCount变化，说明切换了目录，分页要变化
			self.model.on("change:PageCount", function(){
				self.model.trigger("createPager");
			});
		    self.model.on("change:searchStatus", function(){// 搜索状态
		    	self.model.set('pageIndex', 1);
				self.model.trigger("createPager");
		    	
				self.model.trigger("renderFileList");
		    });

		    self.model.on("change:curDirId", function(){// 打开目录
				if(!top.firstEnterNet){
					self.model.trigger('openDir', self.model.get('curDirId'));
				}else{
					var curDirType = self.model.get('curDirType');
					self.statusView.renderNavigation(self.model.get('curDirId'));
					self.model.trigger('renderBtns');


					self.model.resetProperties();
					self.model.trigger('renderSelectCount');
					var curDirid = self.model.get('curDirId');
					var curDirtype = self.model.get('curDirType');
					var options = {dirid : curDirid, dirType : curDirtype};
					if(!top.firstEnterNet){
						self.getFiles(function(){
							self.model.trigger('createPager');
							self.model.trigger("renderFileList");
						}, options);
					}else{
							self.model.trigger('createPager');
							self.model.trigger("renderFileList");
					}
					
				}
		    });

            self.model.on("change:curDirLevel", function(){
                self.toolbarView.renderBtns();
            });
		    self.model.on("change:selectedDirAndFileIds", function(){//选择的文件及目录个数显示
                self.fileListView.renderSelectCount();
            });
		    // 绑定事件供其他view调用
		    self.model.on("createPager", function () {// 重新创建分页组件
	            self.toolbarView.createPager();
	        });
	        self.model.on("deleteDirsAndFiles", function (dataSend) {// 删除文件
	    		self.model.deleteDirsAndFiles(function(result, dataSend){
	    			if(result.responseData && result.responseData.code == 'S_OK'){

	    				top.M139.UI.TipMessage.show(self.model.tipWords['DELETE_SUC'], {delay : 1000});

                        var dirIds = dataSend.directoryIds;
                        var fileIds = dataSend.fileIds;

                        dirIds && (dirIds.length > 0) && delFileDataByIds(dirIds.split(","));
                        fileIds && (fileIds.length > 0) && delFileDataByIds(fileIds.split(","));

                        self.getDiskInit(function(){
                            self.statusView.render();
                            self.statusView.renderNavigation(self.model.get('curDirId'));
                            self.statusView.initEvents();
                            self.toolbarView.render();
//                            self.model.trigger('openDir', self.model.get('curDirId'));
                            self.model.trigger('switchModeStyle');
                            self.model.set("pageIndex", 1); //防止删除一整页文件后页面空白
                            self.model.trigger("createPager");
                        });

	    			} else if (result.responseData && result.responseData.code == "JOIN_MCLOUD") {//正在接入彩云
                        self.model.confirmMcloudUpgrade();
                    } else {
	    				top.M139.UI.TipMessage.show(self.model.tipWords['DELETE_ERR'], {delay : 1000});
	    				self.logger.error("delete returnData error", "[disk:delDiskDirsAndFiles]", result);
	    			}
	    		}, dataSend);

                function delFileDataByIds (ids) {
                    self.model.delFileById(ids);
                    delDomByIds(ids);
                }

                function delDomByIds (ids) {
                    var container = $("#fileList");
                    var fileEles = self.model.get("listMode") == 0 ? container.find("tr") : container.find("li");

                    for (var i = 0, len = ids.length; i < len; i++) {
                        var id = ids[i];

                        for (var j = 0, l = fileEles.length; j < l; j++) {
                            var item = fileEles.eq(j);
                            if (item.find("input").eq(0).attr("fileid") == id) {
                                item.remove();
                                break;
                            }
                        }
                        //刷新用户选中文件数量
                        var selectedDirAndFileIds = self.model.get('selectedDirAndFileIds');
                        var selectedDirIds = self.model.get('selectedDirIds');
                        var selectedFids = self.model.get('selectedFids');
                        var allSelectedIndex = $.inArray(id, selectedDirAndFileIds);
                        var dirSelectedIndex = $.inArray(id, selectedDirIds);
                        var fileSelectedIndex = $.inArray(id, selectedFids);
                        if(allSelectedIndex != -1){
                            if(dirSelectedIndex != -1){
                            selectedDirIds.splice(dirSelectedIndex, 1);
                            }else if(fileSelectedIndex != -1){
                                selectedFids.splice(fileSelectedIndex, 1);
                            }
                            selectedDirAndFileIds.splice(allSelectedIndex, 1);
                            self.model.trigger("renderSelectCount");
                        }
                    }
                }
	        });

            self.model.on('setCover',function(dataSend){
                self.model.setCover(function(result){
                    var responseData = result.responseData;
                    if(responseData && responseData.code == 'S_OK'){
                        top.M139.UI.TipMessage.show(self.model.tipWords['SETCOVER_SUC'], {delay : 1000});
                    }else{
                        top.M139.UI.TipMessage.show(self.model.tipWords['SETCOVER_ERR'], {delay : 1000});
                        self.logger.error("setCover returnData error", "[disk:setCover]", result);
                    }
                }, dataSend)
            });
            self.model.on("savetodisk", function (dataSend) {// 存网盘
                self.model.download(function(result){
                //    var responseData = result.responseData;
                    var error = result.summary;
                    if(result && result.code == 'S_OK'){
                        var data = result["var"];
                        var url = "http://" + top.location.host + data.url;
                    //    $("#downloadFrame").attr('src', url);
                    saveToDiskRequest({
                        url:url, 
                        fileName:data.fileName,
                        fileSize:data.fileSize || 0
                    });
                    }else{
                        downloadErr();
                    }

                    function downloadErr(){
                        top.M139.UI.TipMessage.show(error, {delay: 1000});
                        self.logger.error("download returnData error", "[disk:download]", result);
                    }
                    function saveToDiskRequest(options) {
                        var saveToDiskview = new top.M2012.UI.Dialog.SaveToDisk({
                            fileSize :options.fileSize,
                            fileName: options.fileName || '附件.zip',
                            downloadUrl: options.url || null,
                            saveToMcloud:options.saveToMcloud || null,
                            isreadmail:true

                        });
                        if(options.saveToMcloud){
                            //存彩云
                            saveToDiskview.repareSaveToMcloud().on("success", function () {

                            });
                        } else {
                            saveToDiskview.render().on("success", function () {
                            });         
                        }

                    }
                }, dataSend);
            });
	        self.model.on("download", function (dataSend) {// 下载文件
	    		self.model.download(function(result){
                //    var responseData = result.responseData;
                	var i = 0,l=result.length;
                	$('.objIframe').remove();
					for(var i = 0 ;i< l;i++){
	                    var error = result[i].summary;
	                    if(result[i] && result[i].code == 'S_OK'){
	                        var data = result[i]["var"];
	                        var url = "http://smsrebuild0.mail.10086.cn" + data.url;
	                        var objIframe = $("<iframe class='objIframe' style='display: none;' src=" + url + "></iframe>")
							$("#outArticle").append(objIframe);
	                        //$("#downloadFrame2").attr('src', url);
	                        //window.open(data.url,$("#downloadFrame2"));
	                        //document.execCommand('Saveas',false,url)
		    			}else{
	                        downloadErr();
	                        return;
	                    }
					}
                    function downloadErr(){
                        top.M139.UI.TipMessage.show(error, {delay: 1000});
                        self.logger.error("download returnData error", "[disk:download]", result);
                    }
	    		}, dataSend);
	        });
	        
            self.model.on("createDir", function (dataSend) {//新建文件夹
                self.createDirView.render();
            });
            self.model.on("share", function(){
                self.model.showShareDialog();
            });
	        self.model.on("renameDirAndFile", function () {// 文件重命名
                self.renameView.render();
	        });
	        self.model.on("renderFileList", function () {// 渲染文件列表
	        	var listMode = self.model.get('listMode');
		    	if(!listMode){//列表模式
		    		self.fileListView.render();
					$("#fileList").css("margin-top","0");
		    	}else{
		    		self.fileThumbnailView.render(); //图标模式
					$("#fileList").css("margin-top","14px");
                    self.resizeFileListHeight();
		    	}
		    	self.model.trigger("renderBtns", null);
	        });
	        self.model.on("renderSelectCount", function () {// 渲染用户选中的文件数量
	        	self.fileListView.renderSelectCount();
	        });
	        self.model.on("renderSelectAll", function (pageData) {// 渲染全选按钮
	        	self.fileListView.renderSelectAll(pageData);
	        });
	        self.model.on("reselectIconFiles", function () {// 缩略图模式的重新选中文件事件
	        	self.fileThumbnailView.reselectFiles();
	        });

	        self.model.on("previewFile", function (fid, target) {// 文件预览
	        	self.fileListView.previewFile(fid, target);
	        });
	        self.model.on("openDir", function (dirid) {// 打开文件夹
                //var model = self.model;
                var curDirType = self.model.get('curDirType');
                self.statusView.renderNavigation(dirid);
                self.model.trigger('renderBtns');


                self.model.resetProperties();
				self.model.trigger('renderSelectCount');
                var curDirid = self.model.get('curDirId');
                var curDirtype = self.model.get('curDirType');
                var options = {dirid : curDirid, dirType : curDirtype};
				self.getFiles(function(){
					self.model.trigger('createPager');
			    	self.model.trigger("renderFileList");
				}, options);
	        });
	        self.model.on("refresh", function () {// 刷新数据源，刷新界面
	        	// self.model.resetProperties();
	        	// self.fileListView.renderSelectCount();
	        	
	        	self.getDirectorys(function(){
	    			self.statusView.render();
	    			self.statusView.initEvents();
	    			self.toolbarView.render();
	    			self.model.trigger('openDir', self.model.get('curDirId'));
                    self.model.trigger('switchModeStyle');
			    });
	        });

            self.model.on('switchModeStyle', function(){
                var listMode = self.model.get('listMode');
                if(!listMode){
                    $("#listMode i").attr('class', 'i_view_checked');
                    $('#iconMode i').attr('class', 'i_list');
                }else{
                    $("#listMode i").attr('class', 'i_view');
                    $('#iconMode i').attr('class', 'i_list_checked');
                }
            });
            
            self.model.on("postCard", function () {// 制作明信片
	        	self.model.postCard();
	        });
	        
	        $(window).resize(function(){
        		self.resizeFileListHeight();
	        });

	        $(window).unload(function () {
	            $("object").parent().remove();//页面卸载或跳转前先移除掉flash，防止ie8报错  
	        });
			
			// 安装彩云PC客户端
			/*$("#setupDiskTool").click(function(event){
				var isrm = 0;
				if (top.isRichmail) {
                    isrm = 1;
                } else {
                    isrm = 0;
                }
                var diskResourcePath = 'http://images.139cm.com/rm/newnetdisk4/';
                var path = top.SiteConfig.disk;
                //window.open(path+"/wp.html?jsres=" + escape(diskResourcePath) + "&res=" + 'http://images.139cm.com/rm/richmail' + "&isrm=" + isrm, "virtualDiskHome");
				//彩云页面下载，需要统计积分，带sid过去
				var url = path+"/wp.html?jsres=" + $T.Html.encode(diskResourcePath) + "&res=" + 'http://images.139cm.com/rm/richmail' + "&isrm=" + isrm;
				url = url + "&sid=" + ($T.Url.queryString("sid") || top.sid);
                window.open(url, "virtualDiskHome");
			});*/

            this.registerCloseTabEvent();
        },
		render: function(){
			var self = this;

            self.getIndexDisk(function(){
    			self.statusView = new M2012.Officialsharing.View.Statusbar({model : self.model});
    			self.statusView.render();
    			self.statusView.initEvents();
    			
    			self.commandView = new M2012.Officialsharing.View.Command({model : self.model});
				
				//顶部导航
    			self.toolbarView = new M2012.Officialsharing.View.Toolbar({model : self.model, parentView: self});
    			self.toolbarView.render();

		    	self.fileListView = new M2012.Officialsharing.View.Filelist({model : self.model, parentView: self});// 列表模式
		    //	self.fileListView.render();
			//	self.model.trigger('createPager');
                self.fileThumbnailView = new M2012.Officialsharing.View.Filethumbnail({model : self.model});// 缩略图模式
                self.fileThumbnailView.render();
     
                /*self.musicView = new M2012.Disk.View.Music({model: self.model}); // 音乐播放视图层
                self.musicView.render();*/
                
                self.resizeFileListHeight();

            });
		},

        // 初始化一些参数，比如model中的一些提示语
        initParams: function(){
            var textTip = top.M139.Text.Utils.getFileSizeText(this.model.limitSizeSend);

            this.model.tipWords.LIMIT_SIZE_SEND = top.M139.Text.Utils.format(this.model.tipWords.LIMIT_SIZE_SEND, [textTip]);
        },

        registerCloseTabEvent: function(){
            top.$App.on("closeTab", this.closeTabCallback);
        },

        closeTabCallback: function (args) {
            if (!top || !top.$App) return;
            if (args.name && args.name.indexOf("diskDev") > -1) {
                var isUploading = mainView.uploadModel.isUploading();

                if (isUploading) {
                    if (window.confirm(mainView.model.tipWords["UPLOADING"])) {
                        args.cancle = false;
                        top.$App.off("closeTab", mainView.closeTabCallback);
                    } else {
                        args.cancel = true;
                    }
                } else {
                    args.cancel = false;
                    top.$App.off("closeTab", mainView.closeTabCallback);
                }
            }
        },

        // 动态设置 fileList 高度避免出现两根滚动条
        resizeFileListHeight : function(){
            var fileList = $("#fileList");
            try {
                $iframe = $("#fileList");
                $iframe.height($(top.document.body).height() - 175); //减去多余4像素
                if ($.browser.msie && $.browser.version < 8) {
                //    $iframe.width($(top.document.body).width());
                }

            } catch (e) { }

        //    var listOffset = fileList.offset();
        //    var iframeHeight = $("#outArticle").height();
        //    var listTop = listOffset.top;
        //    $("#fileList").height(iframeHeight - listTop);
        },
		showGuidefirstTime : function(){
			var bgB = '<div class="backgroundBlock" id="bgB"></div>';
			var firstGuideTips = '<span class="promptOne" id="firstGuideTips"><a href="javascript:void(0);" id="firstGuideTipsClose"></a></span>';
						//为undefined的时候说明是第一次 为1的时候说明弹出过，不弹了。
						if(0 && !top.$App.getUserCustomInfo("sfgt")){ //屏蔽
							$(bgB).appendTo(top.document.body);
							$(firstGuideTips).appendTo(top.document.body);
							top.$("#firstGuideTipsClose").click(function(){
								top.$("#bgB").hide();
								top.$("#firstGuideTips").hide();
								top.$("#scContainer").hide();
								top.$App.setUserCustomInfoNew({"sfgt":1})
							});	
			}
		},
		getIndexDisk : function(callback){
            var self = this;
			top.firstEnterNet = true;
			top.M139.UI.TipMessage.show("正在加载中...");
            self.model.getIndexDisk(function(result){
                var responseData = result.responseData;
			//	var responseData = eval("(" + result.responseText + ")");
                if(responseData && responseData.code == 'S_OK'){
					top.M139.UI.TipMessage.hide();
                    var dataInit = responseData['var']["init"];
                    var baseInfo = dataInit.baseInfo;

                    self.model.set('diskInfo', baseInfo);
                    self.model.set('isMcloud', dataInit.isMcloud || "0");
					self.model.set('isShareSiChuan', dataInit.isShareSiChuan || "0");
					self.model.set('totalSize',baseInfo.fileNum);
					if(baseInfo["139MailId"]){
					//	self.model.set('139MailId', baseInfo["139MailId"]);
					//	self.model.set('curDirType','1');
					}
                    if(!self.model.get('curDirType')){
                        self.model.set('curDirType',baseInfo.rootDirType+'');
                    }
					/*
					if(self.model.get("isShareSiChuan") == "1"){
					//	alert("我是四川用户");
						var guideTips = ['<div id="layer_mask01" class="layer_mask" style="overflow: hidden; z-index: 5009; opacity: 0.5;"></div>',
											'<div class="shareLay" id="guideTips">',
											'<div class="container">',
												'<img src="/m2012/images/module/FileExtract/f.png">',
												'<a href="javascript:void(0);" id="guideTipsClose" class="closeBtn" title="关闭">x</a>',
												'<a href="javascript:void(0);" id="guideTipsEnter" class="txtInfoClick">云享四川 专享资源</a>',
											'</div>',
										'</div>'].join("");
						//为undefined的时候说明是第一次 为1的时候说明弹出过，不弹了。
						if(!top.$App.getUserCustomInfo("yunxiangsc")){
							$(guideTips).appendTo(top.document.body);
								top.$("#guideTipsClose").click(function(){
									top.$("#guideTips").hide();
									top.$("#layer_mask01").hide();
									top.$App.setUserCustomInfoNew({"yunxiangsc":1})
								});
								top.$("#guideTipsEnter").click(function(){
									top.$("#guideTips").hide();
									top.$App.setUserCustomInfoNew({"yunxiangsc":1});
									top.$("#layer_mask01").hide();
									top.$App.show('diskShare');
								});		
						}
						
					}*/
					self.model.diskAllInfo = result.responseData['var'];
					self.model.set('fileList', self.model.diskAllInfo.fileList);
                    callback && callback();
                    self.showGuidefirstTime();
                    // 判断是否从其他模块接收keyword参数，如果有则进入搜索界面
                    if(self.model.inputPara.keyword){
                    	$("#search").click();
                    	return;
                    }
                    
                    // 判断是否从其他模块接收dirId参数，如果有则进入指定目录，没有则进入彩云根目录
                    if(!self.model.get('curDirId')){
                        var initializeDirid = self.model.getInitializeDirid();
                        if(initializeDirid && initializeDirid != self.model.getRootDir()){
							if(!top.firstEnterNet){
								self.getDirectorys(function(){
									self.model.set('curDirId', initializeDirid);
								});
							}else{
								self.model.directorys = responseData['var']["allDirectorys"];
								self.model.setDirProperties(self.model.directorys);
								self.model.set('curDirId', initializeDirid);
							}
                            
                        }else{
							self.model.directorys = responseData['var']["allDirectorys"];
							self.model.setDirProperties(self.model.directorys);
                            self.model.set('curDirId', initializeDirid);
                        }
                    }
                }else{
					top.M139.UI.TipMessage.show("加载失败",{delay: 1000});
                    self.logger.error("getDiskInit returndata error", "[disk:init]", result);
                }
//                self.getDirectorys();
            });


        },
        // 获取彩云信息（容量，文件数量等）
        getDiskInit : function(callback){
            var self = this;
			top.M139.UI.TipMessage.show("正在加载中...");
            self.model.getDiskInit(function(result){
                var responseData = result.responseData;
                if(responseData && responseData.code == 'S_OK'){
					top.M139.UI.TipMessage.hide();
                    var dataInit = responseData['var'];
                    var baseInfo = dataInit.baseInfo;

                    self.model.set('diskInfo', baseInfo);
                    self.model.set('isMcloud', dataInit.isMcloud || "0");
					self.model.set('isShareSiChuan', dataInit.isShareSiChuan || "0");
					if(baseInfo["139MailId"]){
					//	self.model.set('139MailId', baseInfo["139MailId"]);
					//	self.model.set('curDirType','1');
					}
                    if(!self.model.get('curDirType')){
                        self.model.set('curDirType',baseInfo.rootDirType+'');
                    }/*
					if(self.model.get("isShareSiChuan") == "1"){
					//	alert("我是四川用户");
						var guideTips = ['<div id="layer_mask01" class="layer_mask" style="overflow: hidden; z-index: 5009; opacity: 0.5;"></div>',
											'<div class="shareLay" id="guideTips">',
											'<div class="container">',
												'<img src="/m2012/images/module/FileExtract/f.png">',
												'<a href="javascript:void(0);" id="guideTipsClose" class="closeBtn" title="关闭">x</a>',
												'<a href="javascript:void(0);" id="guideTipsEnter" class="txtInfoClick">云享四川 专享资源</a>',
											'</div>',
										'</div>'].join("");
						//为undefined的时候说明是第一次 为1的时候说明弹出过，不弹了。
						if(!top.$App.getUserCustomInfo("yunxiangsc")){
							$(guideTips).appendTo(top.document.body);
								top.$("#guideTipsClose").click(function(){
									top.$("#guideTips").hide();
									top.$("#layer_mask01").hide();
									top.$App.setUserCustomInfoNew({"yunxiangsc":1})
								});
								top.$("#guideTipsEnter").click(function(){
									top.$("#guideTips").hide();
									top.$App.setUserCustomInfoNew({"yunxiangsc":1});
									top.$("#layer_mask01").hide();
									top.$App.show('diskShare');
								});		
						}
						
					}*/
                    callback && callback();
                    self.showGuidefirstTime();
                    // 判断是否从其他模块接收keyword参数，如果有则进入搜索界面
                    if(self.model.inputPara.keyword){
                    	$("#search").click();
                    	return;
                    }
                    
                    // 判断是否从其他模块接收dirId参数，如果有则进入指定目录，没有则进入彩云根目录
                    if(!self.model.get('curDirId')){
                        var initializeDirid = self.model.getInitializeDirid();
                        if(initializeDirid && initializeDirid != self.model.getRootDir()){
                            self.getDirectorys(function(){
                                self.model.set('curDirId', initializeDirid);
                            });
                        }else{
                            self.model.set('curDirId', initializeDirid);
                        }
                    }
                }else{
					top.M139.UI.TipMessage.show("加载失败",{delay: 1000});
                    self.logger.error("getDiskInit returndata error", "[disk:init]", result);
                }
//                self.getDirectorys();
            });


        },

        // 初始化模型层数据
        getDirectorys : function(callback){
			var self = this;
            self.model.getDirectorys(function(result){
             if(result.responseData && result.responseData.code == 'S_OK'){
					self.model.directorys = result.responseData['var'].directorys;
                    self.model.setDirProperties(self.model.directorys);
                    callback && callback();
				}else{
					self.logger.error("getDirectorys returndata error", "[disk:getDirectorys]", result);
				}
		    });
        },
		// 取目录下的子文件夹及文件
		getFiles : function(callback, options){
			var self = this;
		    var options = {dirid : options.dirid, dirType : options.dirType};
		    self.model.getDirFilesByPage(function(result){
				if(result.code == 'S_OK'){
                    self.model.diskAllInfo = result['var'];
					var toPage = self.model.get("pageIndex");
					var pageSize = self.model.get("pageSize");
					var startNum = (toPage-1)*pageSize;
					var endNum = toPage*pageSize;
                    self.model.diskAllInfo.pagefiles = self.model.diskAllInfo.files.slice(startNum,endNum)
					/*
					var data = self.model.diskAllInfo.files;
					var currentId = "";
					var currentObj = null;
					if(self.first){
						$.each(data, function(){
							if(this.name == "139邮箱"){
								currentId = this.id;
								currentObj = this;
								return false;
							}	
						});
						self.first = false;
						if(currentId){
							options = {dirid : currentId, dirType : 1};
							self.model.set('curDirId', currentId); //当前目录
							$("#navContainer").append('<span class="f_st">&nbsp;&gt;&nbsp;</span><span>139邮箱</span>');
							currentObj.parentDirectoryId = options.dirid;//需要父目录
							self.model.setParentDirs(currentObj);
							self.getFiles(callback, options);
						}
						return;
					}*/
					self.model.set('fileList', self.model.diskAllInfo.pagefiles);
					self.model.set('totalSize', self.model.diskAllInfo.totalSize);
                    callback && callback();
                //   self.getDirectorys();   //调目录接口（用户操作当前位置）
				}else{
					self.logger.error("getFiles returndata error", "[disk:fileList]", result);
				}
		    }, options);
		}
    }));
})(jQuery, _, M139);


﻿/**
 * @fileOverview 定义彩云页面App对象
 */
(function(jQuery, Backbone, _, M139) {
	var $ = jQuery;
	var superClass = M139.PageApplication;
	M139.namespace("M2012.Officialsharing.Application", superClass.extend(
	/**@lends M2012.MainApplication.prototype*/
	{
		/**
		 *彩云页App对象
		 *@constructs M2012.Disk.Application
		 *@extends M139.PageApplication
		 *@param {Object} options 初始化参数集
		 *@example
		 */
		initialize : function(options) {
			superClass.prototype.initialize.apply(this, arguments);
		},
		defaults : {
			/**@field*/
			name : "M2012.Disk.Application"
		},
		/**主函数入口*/
		run : function() {
			var diskModel = new M2012.Officialsharing.Model();
			var options = {
				model : diskModel
			};
			mainView = new M2012.Officialsharing.View.Main(options);
			mainView.initEvents();
			mainView.render();
			BH({key : "diskv2_load"});
			BH({key : "officialsharing_onload"});
		}
	}));
	$diskApp = new M2012.Officialsharing.Application();
	$diskApp.run();
})(jQuery, Backbone, _, M139);

