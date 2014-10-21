/**
 * @fileOverview 暂存柜页模型层
 */
 (function(jQuery,Backbone,_,M139){
    var $ = jQuery;
    M139.namespace("M2012.Compose.Model.StorageCabinet",Backbone.Model.extend({
    	name : 'storageCabinet',
        callApi: M139.RichMail.API.call,
        defaultInputValue : '搜索暂存柜',// 搜索框默认值
        sortIndex : -1,// 记录当前排序状态
        /** 
        *暂存柜公共代码
        *@constructs M2012.Compose.Model.StorageCabinet
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
        	var data = {actionId : 0};
        	self.callApi("disk:getFiles", data, function(res) {
        		if(callback){
        			callback(res);
        		}
	        });
        },
        renderFunctions : {
        	getFullFileName : function () {
            	var row = this.DataRow;
            	return row.fileName;
            },
            getShortFileName : function () {
            	var row = this.DataRow;
            	var name = row.fileName;
            	var point = name.lastIndexOf(".");
        		if (point == -1 || name.length - point > 5) return name.substring(0, 11) + "…";
            	return name.replace(/^(.{11}).*(\.[^.]+)$/, "$1…$2");
            	//return row.fileName.length > 20?row.fileName.substr(0, 20):row.fileName;
            },
            getFileSize : function(){
            	var row = this.DataRow;
            	return $T.Utils.getFileSizeText(row.fileSize);
            },
            getFileIconClass : function(){
            	var row = this.DataRow;
            	return $T.Utils.getFileIcoClass(0, row.fileName);
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
        /**
        *获取SID值
        */
        getSid: function () {
            var sid = top.$T.Url.queryString("sid");
            return sid;
        }
    }));
})(jQuery,Backbone,_,M139);