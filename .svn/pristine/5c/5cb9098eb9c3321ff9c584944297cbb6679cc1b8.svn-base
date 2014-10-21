/**
 * @fileOverview 定义文件快递（超大附件）快速上传模型
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.Model.ModelBase;
    var namespace = "M2012.UI.LargeAttach.FastUploadModel";

    M139.namespace(namespace, superClass.extend(
    /**@lends M2012.UI.LargeAttach.FastUploadModel.prototype*/
    {
        /** 定义文件快递（超大附件）模型
         *@constructs M2012.UI.LargeAttach.FastUploadModel
         *@extends M139.Model.ModelBase
         *@param {Object} options 初始化参数集
         *@example
         
         */
        initialize: function (options) {
            return superClass.prototype.initialize.apply(this, arguments);
        },

        name: namespace,

        getSid: function () {
            return top.$App.getSid();
        },
        getUserNumber: function () {
            return top.$User.getUid();
        },
        //todo flash调用请求上传地址URL，flash里使用的，要用完整路径
        serverPath: "http://" + location.host + "/mw2/disk/disk",
        
        UploadStyle: 1,//类型 1:文件快递 2.彩云上传
        prjtype: 1,//？？？
        MaxUploadingCount:1,
        /**
         *获取新上传文件随机id,如果是断点续传的文件，则不通过这个生成
         *@inner
         */
        getNewUploadFileId: function () {
            var rnd = parseInt(Math.random() * 100000000);
            return rnd;
        },

        //预上传
        getPreUploadUrl: function () {
            return this.resolveUrl("disk:preUpload");
        },
        //上传成功
        getUploadSuccessUrl: function () {
            return this.resolveUrl("disk:uploadSuccess");
        },
        //获取分布式上传信息
        getUploadKeyUrl: function () {
            return this.resolveUrl("disk:getUploadKey");
        },
        //断点续传
        getBreakPFileUrl: function () {
            return this.resolveUrl("disk:breakPFile");
        },
        //删除
        getDeleteFileUrl: function () {
            return this.resolveUrl("disk:delFiles");
        },
        //组装url
        resolveUrl: function (name) {
            return M139.Text.Url.makeUrl(this.serverPath, {
                func: name,
                sid: $App.getSid(),
                rnd: Math.random()
            });
        },

        //服务器请求
        //改变文件状态
        changeFileState: function (options, callback) {
            var This = this;
            var url = this.getPreUploadUrl();
            if (options.state == 0) {
                url = this.getUploadSuccessUrl();
            }
            var data = {
                fileName: options.fileName,
                fileSize: options.fileSize,
                status: options.state,
                fileRefId: options.storageId,
                type: 1,//小工具2
                action: 1
            };
            M139.RichMail.API.call(url, data, function (response) {
                var json = response.responseData;
                var result = {};
                result.success = false;
                result.code = json.code;
                result.message = json.summary;
                if (json.code == This.ResponseCode.isOk) {
                    result.success = true;
                    result.uploadId = json["var"].fileId;
                } else if (json.code == This.ResponseCode.overMaxSize) {//文件大小超过容量
                    result.overMaxSize = true;
                } else if (json.code == This.ResponseCode.fileNameError) {//文件名非法
                    result.fileNameError = true;
                }
                if (callback) callback(result);
            });
        },

        //获取分布式上传地址
        getUploadKey: function (file, callback) {
            var This = this;
            var url = this.getUploadKeyUrl();
            var data = {};
            if (file.storageId) {
                data.fileId = file.storageId;
                url = this.getBreakPFileUrl();
            } else {
                data.fileName = file.fileName;
                data.fileSize = file.fileSize;
            }
            //发送请求
            M139.RichMail.API.call(
                url,
                M139.Text.Xml.obj2xml(data),
                function (response) {
                    var result = {};
                    try {
                        var json = response.responseData;
                        result.code = json.code;
                        result.message = json.summary;
                        if (json.code == This.ResponseCode.isOk) {
                            result.serverInfo = json["var"];
                            result.success = true;
                        }
                    } catch (e) {
                        result.success = false;
                    }
                    if (callback) callback(result);
                }
            );
        },
        deleteFile: function (storageId,callback) {
            var This = this;
            M139.RichMail.API.call(
                this.getDeleteFileUrl(),
                {
                    fileIds: storageId,
                    type: 1 //本地小工具上传2,web1
                },
                function (response) {
                    var json = response.responseData;
                    if (json && json.code == This.ResponseCode.isOk) {
                        if (callback) callback({ success: true });
                    } else {
                        if (callback) callback({ success: false });
                    }
                }
            );
        },


        ResponseCode: {
            //服务器返回标识_成功
            isOk: "S_OK",
            //务器返回标识_失败
            isError: "S_ERROR",
            //服务器返回标识_文件明非法
            fileNameError: "FILE_NAME_ERROR",
            //服务器返回标识_超出最大容量
            overMaxSize: "FREE_SIZE_ERROR"

        }
    }));
})(jQuery, _, M139);