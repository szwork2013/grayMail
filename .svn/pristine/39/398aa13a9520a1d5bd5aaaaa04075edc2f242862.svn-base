/**
 * @fileOverview 彩云页模型层
 */
 (function(jQuery,Backbone,_,M139){
    var $ = jQuery;
    M139.namespace("M2012.UI.SelectFile.Model.NetDisk",Backbone.Model.extend({
    	name : 'M2012.UI.SelectFile.Model.NetDisk',
        callApi: M139.RichMail.API.call,
        defaultInputValue : '搜索彩云',// 搜索框默认值
        sortIndex : -1,// 记录当前排序状态
        /** 
        *彩云公共代码
        *@constructs M2012.Compose.Model.NetDisk
        *@param {Object} options 初始化参数集
        *@example
        */
        initialize : function(options){
        	this.dataSource = [];// 当前显示的文件
        	this.currentDir = {}; // 当前目录
        },
        // 获取文件夹目录
        getDirs : function(callback){
        	var self = this;
        	self.callApi("disk:getDirectorys", null, function(res) {
        		if(callback){
        			callback(res);
        		}
	        });
        },
        /*
         * 获取彩云文件
         * @param dir.id 目录ID
         * @param dir.type 目录类型
         * @param callback 回调
         */
        fetchDiskFiles : function(dir, callback){
        	this.callApi("disk:fileList", getData(), function(res) {
        		if(callback){
        			callback(res);
        		}
	        });
	        
	        function getData(){
				var data = {
                    directoryId : dir.id,
					dirType : dir.type
				};
				return data;
			}
        },
        /**
         * 搜索彩云
         * @param options.directoryId 搜索目录ID
         * @param options.keyword 搜索关键字
         * @param options.includeChild 是否搜索子目录
         */
        search : function(options, callback){ // todo 搜索接口也需要重构
        	var self = this;
        	var data = {
        		directoryId : options.directoryId,
        		keyword : options.keyword,
        		includeChild : options.includeChild
        	};
        	self.callApi("disk:search", data, function(res) {
        		if(callback){
        			callback(res);
        		}
	        });
        },
        renderFunctions : {
            getShortFileName : function () {
            	var row = this.DataRow;
            	var name = row.name || row.srcfilename;
            	//return name.length > 20?name.substr(0, 20):name;
            	var point = name.lastIndexOf(".");
        		//if (point == -1 || name.length - point > 5) return name.substring(0, 16) + "…";
            	//return name.replace(/^(.{16}).*(\.[^.]+)$/, "$1…$2");
            	
            	if (point == -1 || name.length - point > 5) return name.substring(0, 15) + "…";
            	return name.replace(/^(.{15}).*(\.[^.]+)$/, "$1…$2");
            },
            getFullFileName : function () {
            	var row = this.DataRow;
            	var name = row.name || row.srcfilename;
            	return name;
            },
            getFileSize : function(){
            	var row = this.DataRow;
            	if(row.type != 'file'){
					return 0;
				}
            	return $T.Utils.getFileSizeText(row.file.fileSize);
            },
            getFileIconClass : function(){
            	var row = this.DataRow;
            	var name = row.name || row.srcfilename;
            	return $T.Utils.getFileIcoClass(0, name);
            },
            getUploadDate : function(){
            	var row = this.DataRow;
            	var date = row.createTime;
            	return $Date.format("yyyy-MM-dd", date);
            }
        },
        /*
         * 表头排序  disk:search返回srcfilename 
         * 		disk:getFiles返回filename
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
                    case "fileSize": sorter = function(a, b) { return (a.file.fileSize - b.file.fileSize) * self.sortIndex; };
                        break;
                    case "fileName": 
	                    sorter = function(a, b) {
	                    	var aName = a.name || a.srcfilename;
	                    	var bName = b.name || b.srcfilename;
	                    	return (aName.localeCompare(bName)) * self.sortIndex;
	                    };
	                    break;
                    case "uploadDate": sorter = function(a, b) { return (a.createTime - b.createTime) * self.sortIndex; };
                        break;
                }
                options.dataSource.sort(sorter);
                self.sortIndex *= -1;
            }
        },
        // 格式化上传时间.disk:search 返回时间格式：yyyy-MM-dd hh:mm 
        // disk:getFiles 返回时间格式 yyyy-MM-dd hh:mm:ss
        formatUploadDate : function(dataSource){
        	var self = this;
    		$(dataSource).each(function() {
                if (typeof (this.createTime) == "string") {
                	var createTime = this.createTime;
                	if(createTime.indexOf('.0') !== -1){
                		createTime = createTime.substring(0, createTime.length - 2);
                	}
                	this.createTime = self.parse(createTime);
                }
            });
            return dataSource;
        },
        // 格式化时间 支持两种格式：1.yyyy-MM-dd hh:mm:ss 2.yyyy-MM-dd hh:mm
        parse : function(str){
        	var date = $Date.parse(str);
        	if(date){
        		return date;
        	}else{
        		var reg = /^(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2})$/;
	            var m = str.match(reg);
	            if (m) {
	                var year = m[1];
	                var month = parseInt(m[2] - 1, 10);
	                var day = parseInt(m[3], 10);
	                var hour = parseInt(m[4], 10);
	                var minutes = parseInt(m[5], 10);
	                var seconds = 0;
	                return new Date(year, month, day, hour, minutes, seconds);
	            } else {
	                return null;
	            }
        	}
        },
        // 接口返回的数据源需要做以下处理：1.过滤出type=2的文件  2.格式化上传时间
        setDataSource : function(fileList){
        	var self = this;
        	fileList = $.grep(fileList, function(n, i) {
                return (n.type == 'file' || n.filetype == 0) && n.file.fileSize > 0;
            });
            // 格式化上传时间方便排序,将文件列表保存至model层供排序使用
			self.dataSource = self.formatUploadDate(fileList);
        },
        getSysdirs : function(dirs){
        	/*var rootDir = {directoryId : 10, directoryName : '彩云网盘', dirType : 1};
        	var photoDir = {directoryId : 20, directoryName : '我的相册', dirType : 3};
        	var musicDir = {directoryId : 30, directoryName : '我的音乐', dirType : 4};*/
            var self = this;
            var sysDirs = [];

            this.set("rootId", dirs[0].parentDirectoryId);

            for (var i = 0, len = dirs.length; i < len; i++) {
                var dir = dirs[i];
                (dir.dirFlag == 0) && sysDirs.push(dir);
            }

            sysDirs.unshift({directoryId : self.get("rootId"), directoryName : '彩云网盘', dirType : "0"});
            return sysDirs;
//        	return [rootDir, photoDir, musicDir];
        },
        getPhotodirs : function(dirs){
        	var photoDirs = [];
        	for(var i = 0,len = dirs.length;i < len;i++){
        		if(dirs[i].dirType == 3 && dirs[i].directoryLevel != 1){
        			photoDirs.push(dirs[i]);
        		}
        	}
        	return photoDirs;
        },
        getMusicdirs : function(dirs){
        	var musicDirs = [];
        	for(var i = 0,len = dirs.length;i < len;i++){
        		if(dirs[i].dirType == 4 && dirs[i].directoryLevel != 1){
        			musicDirs.push(dirs[i]);
        		}
        	}
        	return musicDirs;
        },
        getUserdirs : function(dirs){
        	var userDirs = [];
        	for(var i = 0,len = dirs.length;i < len;i++){
        		if(dirs[i].dirType == 1 && dirs[i].directoryLevel != 0){
        			userDirs.push(dirs[i]);
        		}
        	}
        	return userDirs;
        },
        getFileById : function(id){
        	if(!id){
        		return;
        	}
        	var self = this;
        	for(var i = 0,len = self.dataSource.length;i < len;i++){
            	var file = self.dataSource[i];
            	if(file.id == id){
            		return file;
            	}
            }
        },
        /**
        *获取SID值
        */
        getSid: function () {
            var sid = top.sid;
            return sid;
        }
    }));
})(jQuery,Backbone,_,M139);