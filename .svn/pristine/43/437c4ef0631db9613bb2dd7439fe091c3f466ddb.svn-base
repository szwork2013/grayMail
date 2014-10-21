(function (jQuery, Backbone, _, M139) {
    var $ = jQuery;
    var superClass = M2012.GroupMail.Model.Base;
    M139.namespace("M2012.Album.Model", superClass.extend({
        defaults: {
            //上传是否批量上传
            isBatchUpload: false,
            //上传事物id
            batchTransId: '0',
            //选中相片id，并且是当前用户上传，删除专用
            selectedIds: [],

            //除删除之外（下载、发送、存彩云用）
            commonIdS: [],

            //当前用户id
            curUserId: 0,

            //当前用户姓名
            curUserName: '',

            //当前用户email
            curEmail: '',

            //当前用户是否群管理员
            isAdmin: false,

            //当前页数
            point: 1,

            //每页记录数
            pointSize: 5,

            pageCount: 0,

            // 时间轴对应下的所有图片的下载地址
            downloadUrlList : {},

            // 预览图片对象
            focusImagesView : {},

            //
            uploadFileList : {}
        },
        imageExts: "jpg/gif/png/ico/jfif/tiff/tif/bmp/jpeg/jpe", // 图片类拓展名
        thumbnailSize: "80*80", //缩略图大小
        capacity: 1, //相册容量，单位GB
        tipWords: {
            DELETE_SUC: "图片已删除",
            DELETE_FAIL: "图片删除失败",
            DELETE_CONFIRM: "图片删除后不可恢复，确定删除图片？",
            DOWNLOAD_FAIL: "图片下载失败"
        },
        name: "M2012.Album.Model",
        logger: new top.M139.Logger({
            name: "M2012.Album.Model"
        }),
        callApi: M139.RichMail.API.call,

        albumEvent: {
            GET_ALBUM_LIST: "gom:photoGallery",
            GET_SPACE_SIZE: "gom:spaceSize",
            DOWNLOAD: "gom:preDownloadFile",
            DELETE: "gom:deleteFile",
            UPLOAD: "gom:uploadFile"
        },

        initialize: function (options) {
            this.initEvent();
            return superClass.prototype.initialize.apply(this, arguments);
        },

        initEvent: function () {

            
        },

        // 获取文件拓展名
        getExtName: function (fileName) {
            if (fileName) {
                var reg = /\.([^.]+)$/;
                var results = fileName.match(reg);
                return results ? results[1].toLowerCase() : "";
            } else {
                return "";
            }
        },

        formatDate: function (d) {
            var D = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
            with (d || new Date)
                return [D[getHours()] || getHours(), D[getMinutes()] || getMinutes()].join(' : ');
        },

        //群相册列表
        getAlbumList: function (callback, opt) {
            var self = this;
            self.callApi("gom:photoGallery", { groupNumber: opt.groupNumber, point: opt.point, pointSize: 5 }, function (result) {
                callback && callback(result);
            });
        },

        //群相册获取相册容量
        getSpaceSize: function (callback, opt) {
            var self = this;
            self.callApi("gom:spaceSize", { groupNumber: opt.groupNumber }, function (result) {
                callback && callback(result.responseData["var"]);
            });
        },

        //群相册删除相片
        deletePics: function (callback, opt) {
            var self = this;
            self.callApi("gom:deleteFile", { groupNumber: opt.groupNumber, fileId: opt.picArr }, function (result) {
                callback && callback(result);
            });
        },

        //群相册下载相片
        downloadPics: function (callback, opt) {
            var self = this;
            self.callApi("gom:preDownloadFile", { groupNumber: opt.groupNumber, fileId: opt.picArr }, function (result) {
                callback && callback(result.responseData["var"]);
            });
        },

        //上传
        uploadPics: function (callback, opt) {
            var self = this;
            self.callApi("gom:uploadFile", { groupNumber: opt.groupNumber, transId: opt.transId, comefrom: 1 }, function (result) {
                callback && callback(result.responseData["var"]);
            });
        },

        // 批量下载接口
        batchPreDownload: function (callback, opt) {
            var self = this;
            self.callApi("gom:batchPreDownload", { groupNumber: opt.groupNumber, operateType: 2, fileId : opt.fileId}, function (result) {
                callback && callback(result.responseData["var"]);
            });
        },

        //存彩云
        saveCaiyunbatchPreDownload: function (callback, opt) {
            var self = this;
            self.callApi("gom:batchPreDownload", { groupNumber: opt.groupNumber, operateType: 2, fileId: opt.fileId }, function (result) {
                callback && callback(result);
            });
        }

    }));
})(jQuery, Backbone, _, M139);
