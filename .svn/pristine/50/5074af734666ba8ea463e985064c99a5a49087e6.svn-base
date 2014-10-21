(function ($, _, M139) {

    var _class = "M2012.Disk.CommApi";

    M139.namespace(_class, function () { });

    //添加属性、方法
    M2012.Disk.CommApi.prototype = {

        callApi: function (api, options, fnSuccess, fnError) {
            top.$RM.call(api, options, function (res) {
                if (res && res.responseData) {
                    if (res.responseData.code == "S_OK") {
                        var data = res.responseData["var"];
                        fnSuccess && fnSuccess(data);
                    } else {
                        fnError && fnError(res.responseData);
                    }
                    return;
                }
                fnError && fnError();

            }, function (e) {
                fnError && fnError(e);
            });
        },

        /**
        * 管理回收站文件信息
        * @param {Number}    options.dirType //目录类型: 1为普通类型 3 相册类型 4音乐类型。
        * @param {String}    options.directoryIds //待操作目录ID，多个的时候用“,”隔开。
        * @param {Number}    options.fileIds //待操作文件ID，多个的时候用“,”隔开
        * @param {Function}  fnSuccess //数据访问成功后的处理函数   
        * @param {Function}  fnError   //数据访问失败后的处理函数   
       **/
        delFiles: function (options, fnSuccess, fnError) {
            this.callApi("disk:delete", options, fnSuccess, fnError);            
        },

        /**
         * 获取回收站列表信息
         * @param {Number}    options.toPage //需要跳转到的页码，默认第1页，当小于1时，pageSize忽略，返回全部列表。
         * @param {Number}    options.pageSize //每页显示记录数 ，默认获取30条记录。
         * @param {Number}    options.sortDirection //文件的排序方向。默认按正序。1：正序 0：反序
         * @param {Number}    options.contentSortType //排序类型
         * @param {Function}  fnSuccess //数据访问成功后的处理函数   
         * @param {Function}  fnError   //数据访问失败后的处理函数   
        **/
        getVirDirInfo: function (options, fnSuccess, fnError) {
            this.callApi("disk:getVirDirInfo", options, fnSuccess, fnError);
        },

        /**
         * 管理回收站文件信息
         * @param {Number}    options.opr //操作类型 1：还原 2：逻辑删除 3：清空回收站。
         * @param {String}    options.directoryIds //待操作目录ID，多个的时候用“,”隔开。
         * @param {Number}    options.fileIds //待操作文件ID，多个的时候用“,”隔开
         * @param {Function}  fnSuccess //数据访问成功后的处理函数   
         * @param {Function}  fnError   //数据访问失败后的处理函数   
        **/
        mgtVirDirInfo: function (options, fnSuccess, fnError) {
            this.callApi("disk:mgtVirDirInfo", options, fnSuccess, fnError);
        }
    };
})(jQuery, _, M139);