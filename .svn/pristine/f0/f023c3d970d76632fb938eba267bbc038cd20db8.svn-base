/**
 * @fileOverview 暂存柜页模型层
 */
 (function(jQuery,Backbone,_,M139){
    var $ = jQuery;
    M139.namespace("M2012.UI.SelectFile.Model.StorageCabinet",Backbone.Model.extend({
		defaults : {
			startNum:0, //获取附件的起始位置
			endNum : 0 //获取附件的结束位置
		},
    	name : 'M2012.UI.SelectFile.Model.StorageCabinet',
        callApi: M139.RichMail.API.call,
        defaultInputValue : '搜索暂存柜',// 搜索框默认值
        sortIndex : -1,// 记录当前排序状态
        /** 
        *暂存柜公共代码
        *@constructs M2012.UI.Dialog.SelectFile.Model.StorageCabinet
        *@param {Object} options 初始化参数集
        *@example
        */
        initialize : function(options){
        	this.dataSource = [];
        	this.currentDataSource = [];
        },
        //获取暂存柜文件
        fetchStorageFiles : function(callback){
        	var self = this;
        	var startNum = self.get('startNum')
        	var data = {actionId : startNum};
        	self.callApi("file:getFiles", data, function(res) {
        		if(callback){
        			callback(res);
        		}
	        });
        },
        renderFunctions : {
			remain : function(){
				var row = this.DataRow;
				var remain = row.remain;
				var arr = remain.split(/天|小时/);
				if(arr[1]){
					return (++arr[0]) + "天";
				}else{
					return arr[0] + "天";
				}
			},
        	getFullFileName : function () {
            	var row = this.DataRow;
            	return row.fileName;
            },
            getShortFileName : function () {
            	var row = this.DataRow;
            	var name = row.fileName;
            	var point = name.lastIndexOf(".");
        		if (point == -1 || name.length - point > 5) return name.substring(0, 18) + "…";
            	return name.replace(/^(.{11}).*(\.[^.]+)$/, "$1…$2");
            	//return row.fileName.length > 20?row.fileName.substr(0, 20):row.fileName;
            },
            getFileSize : function(){
            	var row = this.DataRow;
            	return $T.Utils.getFileSizeText(row.fileSize);
            },
            getFileIconClass : function(){
            	var row = this.DataRow;
            	return $T.Utils.getFileIcoClass2(0, row.fileName);
            }
        },
        // 过滤文件列表
        search : function(keywords){
        	var self = this;
        	var files = self.dataSource.concat();
        	return $.grep(files, function(obj, i){
        		return obj.fileName.toLocaleLowerCase().indexOf(keywords.toLocaleLowerCase()) > -1;
        	});
        },
        /*
         * 表头排序
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
                    case "fileSize": sorter = function(a, b) { return (a.fileSize - b.fileSize) * self.sortIndex; };
                        break;
                    case "fileName": sorter = function(a, b) { return (a.fileName.localeCompare(b.fileName)) * self.sortIndex; };
                        break;
                    case "remainTimes": sorter = function(a, b) { return (a.sendCount - b.sendCount) * self.sortIndex; };
                        break;
                    case "expiryDate": sorter = function(a, b) { return (a.expiryDate - b.expiryDate) * self.sortIndex; };
                        break;
                }
                options.dataSource.sort(sorter);
                self.sortIndex *= -1;
            }
        },
        // 格式化过期时间
        formatExpireDate : function(dataSource){
    		$(dataSource).each(function() {
                if (typeof (this.expiryDate) == "string") {
                	this.expiryDate = $Date.parse(this.expiryDate);
                }
            });
            return dataSource;
        },
        getFileById : function(id){
        	if(!id){
        		return;
        	}
        	var self = this;
        	for(var i = 0,len = self.dataSource.length;i < len;i++){
            	var file = self.dataSource[i];
            	if(file.fid == id){
            		return file;
            	}
            }
        },
        // 判断文件是否上传成功
        isUploadSuccess: function(fileObj){
            var self = this;
            if(!fileObj){
                return false;
            }
            if(fileObj.state == '0'){ // 旧文件state 0 表示上传成功 ，新文件fileUploadSize == fileSize 表示上传成功
                return true;
            }

            var fileSize = parseInt(fileObj.fileSize, 10);
            var fileUploadSize = parseInt(fileObj.fileUploadSize, 10);
            return fileSize === fileUploadSize ? true : false;
        },
        //去掉上传失败的文件
        removeFailFile: function (fileList) {
            for (var i = 0; i < fileList.length; i++) {
                var item = fileList[i];

                if (!this.isUploadSuccess(item)) {
                    fileList.splice(i, 1);
                    i--;
                }
            }
        },
        /**
        *获取SID值
        */
        getSid: function () {
            var sid = top.$T.Url.queryString("sid");
            return sid;
        },
		toggleSelectedFiles: function (obj) {
            if (!obj) return;

            var self = this;
            var checked = obj.isAllChecked;
            var fileSource = obj.fileSource;

            if (checked != undefined) {//全选/反选
                self.set('cabinetFileList', checked ? obj.dataSource : []);
                return;
            }

            //单选文件
            var selectedFiles = self.get('cabinetFileList');
			if(!selectedFiles){
				return;
			}
            var currentFile = obj.dataSource[0];
            for(var i = 0, len = selectedFiles.length; i < len; i++){
                var fileItem = selectedFiles[i];
                if (currentFile.fid === fileItem.fid) {
                    selectedFiles.splice(i, 1);
                    return;
                }
            }
            selectedFiles.push(currentFile);
		}
    }));
})(jQuery,Backbone,_,M139);