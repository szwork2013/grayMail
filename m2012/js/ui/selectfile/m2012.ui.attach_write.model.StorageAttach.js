/**
 * @fileOverview 附件夹页模型层
 */
 (function(jQuery,Backbone,_,M139){
    var $ = jQuery;
    M139.namespace("M2012.UI.SelectFile.Model.StorageAttach",Backbone.Model.extend({
		defaults : {
			startNum:1, //获取附件的起始位置
			endNum : 0, //获取附件的结束位置
			attachFileList:[]
		},
    	name : 'M2012.UI.SelectFile.Model.StorageAttach',
        callApi: M139.RichMail.API.call,
        sortIndex : -1,// 记录当前排序状态1 升序 -1 降序
        initialize : function(options){
        	this.dataSource = [];
        	//this.dataSource = [];
        	//this.createUploadManager();
        },
        
        //获取附件夹文件
        fetchStorageFiles : function(callback){
        	var self = this;
        	var start = this.get('startNum');
			var options = {
				start: start,
				total: 30,
				order: "receiveDate",
				desc: 1,
				stat: 1,
				isSearch: 1,
				filter: {
					attachType: 0
				}
			};
        	//self.callApi("attach:listAttachments", data, function(res) {
        		//if(callback){
        		//	callback(res);
        		//}
	        //});
			M139.RichMail.API.call("attach:listAttachments", options, function (result) {
				callback && callback(result);
			});
        },
        renderFunctions : {
        	getFullFileName : function () {
            	var row = this.DataRow;
            	return row.attachName;
            },
            getShortFileName : function () {
            	var row = this.DataRow;
            	var name = row.attachName;
            	var point = name.lastIndexOf(".");
        		if (point == -1 || name.length - point > 5) return name.substring(0, 18) + "…";
            	return name.replace(/^(.{11}).*(\.[^.]+)$/, "$1…$2");
            	//return row.fileName.length > 20?row.fileName.substr(0, 20):row.fileName;
            },
            getFileSize : function(){
            	var row = this.DataRow;
            	return $T.Utils.getFileSizeText(row.attachRealSize);
            },
            getFileIconClass : function(){
            	var row = this.DataRow;
            	return $T.Utils.getFileIcoClass2(0, row.attachName);
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
                    case "sendDate": sorter = function(a, b) { return (a.sendDate - b.sendDate) * self.sortIndex; };
                        break;
                }
                options.dataSource.sort(sorter);
                self.sortIndex *= -1;
            }
        },
 		//转发获取地址
		forwardAttach: function(attachments, callback) {
			//var rid = Math.random();
			this.callApi("mbox:forwardAttachs", {
				attachments: attachments
			}, callback,
			{urlParam:"&composeId="+$T.Url.queryString("composeId")}
			);
		},

        getFileById : function(id){
        	if(!id){
        		return;
        	}
        	var self = this;
        	for(var i = 0,len = self.dataSource.length;i < len;i++){
            	var file = self.dataSource[i];
            	if(file.uid == id){
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
		createUploadManager: function () {
		    uploadManager = new UploadManager({
		        container: document.getElementById("attachContainer")
		    });
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
                self.set('attachFileList', checked ? obj.dataSource : []);
                return;
            }

            //单选文件
            var selectedFiles = self.get('attachFileList');
			if(!selectedFiles){
				return;
			}
            var currentFile = obj.dataSource[0];
            for(var i = 0, len = selectedFiles.length; i < len; i++){
                var fileItem = selectedFiles[i];
                if (currentFile.uid === fileItem.uid) {
                    selectedFiles.splice(i, 1);
                    return;
                }
            }
            selectedFiles.push(currentFile);
		}
    }));
})(jQuery,Backbone,_,M139);