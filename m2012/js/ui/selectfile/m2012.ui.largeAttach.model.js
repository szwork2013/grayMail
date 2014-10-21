﻿/**
 * @
 */
(function (jQuery, Backbone, _, M139) {
    var $ = jQuery;
    M139.namespace("M2012.UI.SelectFile.Model", Backbone.Model.extend({
        defaults: {
        	viewType : 'localFile',
        	localFileType : '',
        	localFileList : [], // 本地文件列表
        	cabinetFileList : [], // 暂存柜文件列表
        	diskFileList : [], // 彩云文件列表
        	diskDir : {} // 彩云目录
        },
        viewTypes : {
        	LOCAL_FILE : 'localFile',
        	DISK : 'disk',
        	CABINET : 'cabinet'
        },
        localFileTypes : {
        	LOCAL_FILE_DEFAULT : 'localFileDefault',
        	LOCAL_FILE_LIST : 'localFileList'
        },
        tipWords: {
            UPLOADING: "关闭超大附件，当前正在上传的文件会失败，是否关闭？",
            UPLOAD_LARGEATTACH: "(单个文件最大{0}G)"
        },
        urls : {// 跳转到其它页面的URL
			DISK_URL : '/m2012/html/selectfile/diskframe.html?sid='+top.sid,
			CABINET_URL : '/m2012/html/selectfile/cabinetframe.html?sid='+top.sid
		},
        fileSource: {//文件来源于彩云或者暂存柜
            DISK: "disk",
            CABINET: "cabinet"
        },
        callApi: M139.RichMail.API.call,
        initialize: function (options) {
        	// todo 迫不得已用了耦合代码
        	window.cabinetFileList = this.get('cabinetFileList');
        	window.diskFileList = this.get('diskFileList');
        	window.diskDir = this.get('diskDir');
            this.maxUploadLargeAttach = Math.floor(top.$User.getCapacity("maxannexsize") / 1024) || 4;
        },
        getCabinetFids : function(){
        	var self = this;
        	var fids = [];
        	var cabinetFileList = self.get('cabinetFileList');
        	for(var i = 0,len = cabinetFileList.length;i < len;i++){
        		fids.push(cabinetFileList[i].fid);
        	}
        	return fids;
        },
        getDiskFids : function(){
        	var self = this;
        	var fids = [];
        	var diskFileList = self.get('diskFileList');
        	for(var i = 0,len = diskFileList.length;i < len;i++){
        		fids.push(diskFileList[i].id+'');
        	}
        	return fids;
        },
        /*
         * 遍历数组，存在某项则删除，不存在则添加
         * @param {Object} obj 文件对象/是否全选及文件列表{fileSource: disk/cabinet, isAllChecked: true/false, dataSource: [file]}
         */
		toggleSelectedFiles: function (obj) {
            if (!obj) return;

            var self = this;
            var checked = obj.isAllChecked;
            var fileSource = obj.fileSource;

            if (checked != undefined) {//全选/反选
                if (fileSource == self.fileSource["DISK"]) {
                    self.set('diskFileList', checked ? obj.dataSource : []);
                } else {
                    self.set('cabinetFileList', checked ? obj.dataSource : []);
                }
                return;
            }

            //单选文件
            var selectedFiles = obj.fileSource == self.fileSource["DISK"] ? self.get('diskFileList') : self.get('cabinetFileList');
            var currentFile = obj.dataSource[0];
            for(var i = 0, len = selectedFiles.length; i < len; i++){
                var fileItem = selectedFiles[i];
                if (currentFile.fid === fileItem.fid) {
                    selectedFiles.splice(i, 1);
                    return;
                }
            }
            selectedFiles.push(currentFile);
		},
        // 遍历数组，存在某项则删除，不存在则添加
		toggleDiskFiles : function(file){
			if(!file){
				return;
			}
			var self = this;
			var diskFiles = self.get('diskFileList');
			for(var i = 0,len = diskFiles.length;i < len;i++){
				var diskFile = diskFiles[i];
				if(file.id === diskFile.id){
					diskFiles.splice(i, 1);
					return;
				}
			}
			diskFiles.push(file);
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
		}
    }));
})(jQuery, Backbone, _, M139);
