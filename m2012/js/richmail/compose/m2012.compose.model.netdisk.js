/**
 * @fileOverview 彩云页模型层
 */
 (function(jQuery,Backbone,_,M139){
    var $ = jQuery;
    M139.namespace("M2012.Compose.Model.NetDisk",Backbone.Model.extend({
    	name : 'netDisk',
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
        	self.callApi("disk:getdiskallinfo", null, function(res) {
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
        	var self = this;
        	var data = {dirid : dir.id, dirType : dir.type};
        	self.callApi("disk:getdirfiles", data, function(res) {
        		if(callback){
        			callback(res);
        		}
	        });
        },
        /**
         * 搜索彩云
         * @param options.directoryId 搜索目录ID
         * @param options.keyword 搜索关键字
         * @param options.includeChild 是否搜索子目录
         */
        search : function(options, callback){
        	var self = this;
        	var data = {
        		directoryId : options.directoryId,
        		keyword : options.keyword,
        		includeChild : options.includeChild
        	}
        	self.callApi("disk:search", data, function(res) {
        		if(callback){
        			callback(res);
        		}
	        });
        },
        renderFunctions : {
            getShortFileName : function () {
            	var row = this.DataRow;
            	var name = row.filename || row.srcfilename;
            	//return name.length > 20?name.substr(0, 20):name;
            	var point = name.lastIndexOf(".");
        		//if (point == -1 || name.length - point > 5) return name.substring(0, 16) + "…";
            	//return name.replace(/^(.{16}).*(\.[^.]+)$/, "$1…$2");
            	
            	if (point == -1 || name.length - point > 5) return name.substring(0, 15) + "…";
            	return name.replace(/^(.{15}).*(\.[^.]+)$/, "$1…$2");
            },
            getFullFileName : function () {
            	var row = this.DataRow;
            	var name = row.filename || row.srcfilename;
            	return name;
            },
            getFileSize : function(){
            	var row = this.DataRow;
            	return $T.Utils.getFileSizeText(row.filesize);
            },
            getFileIconClass : function(){
            	var row = this.DataRow;
            	var name = row.filename || row.srcfilename;
            	return $T.Utils.getFileIcoClass(0, name);
            },
            getUploadDate : function(){
            	var row = this.DataRow;
            	var date = row.uploadtime;
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
                    case "fileSize": sorter = function(a, b) { return (a.filesize - b.filesize) * self.sortIndex; };
                        break;
                    case "fileName": 
	                    sorter = function(a, b) {
	                    	var aName = a.filename || a.srcfilename;
	                    	var bName = b.filename || b.srcfilename;
	                    	return (aName.localeCompare(bName)) * self.sortIndex; 
	                    };
	                    break;
                    case "remainTimes": sorter = function(a, b) { return (a.sendCount - b.sendCount) * self.sortIndex; };
                        break;
                    case "uploadDate": sorter = function(a, b) { return (a.uploadtime - b.uploadtime) * self.sortIndex; };
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
                if (typeof (this.uploadtime) == "string") {
                	this.uploadtime = self.parse(this.uploadtime);
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
                return (n.type == 2 || n.filetype == 0) && n.filesize > 0;
            });
            // 格式化上传时间方便排序,将文件列表保存至model层供排序使用
			self.dataSource = self.formatUploadDate(fileList);
        },
        /**
        *获取SID值
        */
        getSid: function () {
            var sid = top.$T.Url.queryString("sid");
            return sid;
        }
    }));
})(jQuery,Backbone,_,M139);