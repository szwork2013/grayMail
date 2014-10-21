; (function ($, _, M139) {

    var superClass = M2012.Disk.Model.listTemplate;
    var _class = "M2012.Disk.Model.Recycle";

    M139.namespace(_class, superClass.extend({
        name: _class,

        logger: new M139.Logger({ name: _class }),

        master: null,

        /**
         *  详细活动编辑
         *  @param {Object} args.master //视图主控
        */
        initialize: function (args) {
            var self = this;
            args = args || {};
            self.master = args.master;
            superClass.prototype.initialize.apply(self, arguments);

        },

        /**
         *  从服务器获取数据
         *  @param {Function}  fnSuccess //数据访问成功后的处理函数   
         *  @param {Function}  fnError   //数据访问失败后的处理函数   
        **/
        fetch: function (fnSuccess, fnError) {
            var self = this;
            var result = null;
            var options = { toPage: 0 };
            //从导航信息中获取查询条件
            var navs = self.get("navs") || [];

            if (navs.length > 0) {
                var nav = navs[navs.length - 1];
                $.extend(options, {
                    directoryId: nav.dirId,
                    path: nav.path
                });
            }

            self.master.commApi.getVirDirInfo(options, function (data) {

                data = data && data.virDirInfoList ? data.virDirInfoList : [];
                var hash = [];
                //给数据增加一个标示是否为文件夹的标示
                $.each(data, function (i, item) {
                    item["isDir"] = (item.type === -1);
                    //hash缓存数据便于快速查找数据
                    hash[item.itemID] = item;
                });

                //缓存hash数据
                self.set({ cacheHash: hash }, { silent: true });
                self.initData(data);
                fnSuccess && fnSuccess(data);

            }, function (e) {
                self.initData(null);
                fnError && fnError(e);
            });
        },


        /**
         *  还原操作
         *  @param {Object}  data //要还原的信息
         *  @param {Function}  fnSuccess //数据访问成功后的处理函数   
         *  @param {Function}  fnError   //数据访问失败后的处理函数   
        **/
        restore: function (data, fnSuccess, fnError) {
            var self = this;
            var dirIds = data.checkedDirIds || [];
            var fileIds = data.checkedFids || [];
            var options = {
                opr: 1,
                directoryIds: dirIds.join(","),
                fileIds: fileIds.join(",")
            };

            self.master.commApi.mgtVirDirInfo(options, fnSuccess, fnError);
        },

        /**
         *  还原操作
         *  @param {Object}  data //要还原的信息
         *  @param {Function}  fnSuccess //数据访问成功后的处理函数   
         *  @param {Function}  fnError   //数据访问失败后的处理函数   
        **/
        realDel: function (data, fnSuccess, fnError) {
            var self = this;
            var dirIds = data.checkedDirIds || [];
            var fileIds = data.checkedFids || [];
            var options = {
                dirType: 1,
                directoryIds: dirIds.join(","),
                fileIds: fileIds.join(",")
            };
            self.master.commApi.delFiles(options, fnSuccess, fnError);
        },

        /**
         *  清空回收站   
         *  @param {Function}  fnSuccess //数据访问成功后的处理函数   
         *  @param {Function}  fnError   //数据访问失败后的处理函数   
        **/
        clearAll: function (fnSuccess, fnError) {
            var self = this;
            var options = { opr: 3 };
            self.master.commApi.mgtVirDirInfo(options, fnSuccess, fnError);
        },

        /**
        *  转换文件信息以便填充数据到页面模板
        *  @param {Object}  data //要转换的文件信息
       **/
        parseData: function (data) {
            var self = this;
            var common = self.master.common;
            data.fileIcon = common.getFileIconClass({
                size: 0,
                name: data.name,
                isDir: data.isDir
            });
            data.fileThumb = common.getThumbImage(data);
            data.shortName = common.getShortName(data.name, 15, data.isDir);

            data.size = "";
            if (!data.isDir && _.isNumber(data.itemSize)) {
                data.size = common.getFileSizeText(data.itemSize);
            }
        },

        /**
         *  排序方法
         *  @param {Object}  first //要排序的数据
         *  @param {Object}  second //要排序的数据
        **/
        sortFunc: function (first, second) {
            var field = this.field;
            var isAsc = this.isAsc;
            var compare = 0;
            switch (field) {
                //名称                     
                case "name":
                    compare = first.name.localeCompare(second.name);
                    break;
                    //时间
                case "date":
                    compare = first.deleteTime.localeCompare(second.deleteTime);
                    break;
                    //大小
                case "size":
                    var firSize = first.itemSize || 0;
                    var secSize = second.itemSize || 0;
                    compare = firSize - secSize;
                    break;
            }
            return compare * (isAsc ? 1 : -1);
        }

    }));

})(jQuery, _, M139);