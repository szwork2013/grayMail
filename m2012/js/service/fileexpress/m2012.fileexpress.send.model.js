/**
 * @
 */
(function (jQuery, Backbone, _, M139) {
    var $ = jQuery;
    M139.namespace("M2012.FileExpress.Send.Model", Backbone.Model.extend({
        defaults: {
            sendType: "", //发送类型
            fileList: [], //已选文件
            dataSource: {}
        },
        callApi: M139.RichMail.API.call,
        maxsend: 0, //接口调最大发送文件的数据[发邮件]
        maxusers: 0,
        initialize: function (options) {
            var pageApp = new M139.PageApplication({ name: 'sendSuccess' });
			if(pageApp.inputData){
				this.set("dataSource", pageApp.inputData);
			}
            if (this.get("dataSource") == null) {
                this.set("sendType", "email");
            } else {
                this.set("sendType", this.get("dataSource").type);
            }
            this.getDataMaxSend();
        },
        //接口调最大发送文件的数据[发邮件+发短信]
        getDataMaxSend: function (callback) {
            var self = this;
            self.callApi("file:fSharingInitData", {}, function (res) {
                if (res.responseData) {
                    self.maxsend = res.responseData.fileSendCount;
                }
                if (callback) {
                    callback(res);
                }
            });
        },
        //删除文件
        deleteFile: function (fileId) {
            var data = this.get("dataSource").fileList;
            for (var i = 0; i < data.length; i++) {
                if (data[i]["fid"] == fileId || data[i]["businessId"] == fileId || data[i]["id"] == fileId) {
                    data.splice(i, 1);
                    return;
                }
            }
        },
        //删除文件
        deleteFileAll: function () {
            var data = this.get("dataSource").fileList;
            data.length = 0;
            console.log(this.get("dataSource"));
        },
        //获取文件总大小
        getTotalFileSize: function () {
            if (this.get("dataSource").fileList == null) {
                return "0B";
            }
            var data = this.get("dataSource").fileList;
            var total = 0;
            for (var i = 0; i < data.length; i++) {
                total += parseInt(data[i]["fileSize"] || data[i]["size"] || data[i]["file"]["fileSize"]);
            }
            return $T.Utils.getFileSizeText(total);
        },
        //获取文件个数
        getNumOfFile: function () {
            if (this.get("dataSource").fileList == null) {
                return 0;
            }
            var data = this.get("dataSource").fileList;
            return data.length;
        },
        //若选取文件大于10，提示删除多余的文件
        promptDelAfterTen: function () {
            var self = this;
            self.getDataMaxSend(function (res) {
                var selectNum = self.getNumOfFile();
                var num = 0;
                var tmp = "";
                if (res.responseData) {
                    self.maxusers = res.responseData.fileSendCount;
                }
                if (selectNum > self.maxusers) {
                    num = selectNum - self.maxusers;
                    tmp = "一次最多可发送" + self.maxusers + "个文件，请删除" + num + "个";
                } else {
                    tmp = "";
                }
                $("#promptDelAfterTen").html(tmp);
            })
        },
        isLocal: function(){
            return top == window;
        },
        //执行异常处理
        tryCatch: function(exec, errors) {
            try {
                if (exec) { exec(); }
            } catch (e) {
                if (errors) { errors(e); }
            }
        },
        //获取xml文档操作对象
        getXmlDoc: function(text) {
            var doc = new ActiveXObject("Microsoft.XMLDOM");
            doc.loadXML(text);
            return doc;
        },
        // 向变量dataSource.fileList 添加文件对象 add by tkh
        addFiles: function (files) {
            var self = this;
            if (!files) {
                files = [];
            }
			if(self.get("dataSource") && self.get("dataSource").fileList){
				var fileList = self.get("dataSource").fileList;
			}else{
				self.get("dataSource").fileList = [];
				var fileList = self.get("dataSource").fileList;
			}
          //  var fileList = (self.get("dataSource") && self.get("dataSource").fileList) || [];
            for (var i = 0, len = files.length; i < len; i++) {
                var file = files[i];
                fileList.unshift(file);
            }
        }
    }));
})(jQuery, Backbone, _, M139);
