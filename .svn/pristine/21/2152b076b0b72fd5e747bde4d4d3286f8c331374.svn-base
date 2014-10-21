; (function ($, _, M139) {
    var superClass = M139.Model.ModelBase;
    var _class = "M2012.Disk.Model.ShareRecive";

    M139.namespace(_class, superClass.extend({
        name: _class,
        common: null,
        defaults: {
            //当前视图页码
            pageIndex: 1,
            //页数
            pageCount: 0,
            //每页显示信息条数
            pageSize: 20,
            //访问的导航路径
            navs: null,
            //当前目录下所有共享数据
            cacheData: new Array(),
            //缓存数据索引，
            //主要用来将文件和类型对应起来
            //方便后续操作检索文件类型
            cacheIndexs: null,
            //选中的项
            checkData: new Array(),
            //当前目录的根目录
            curRootDir: null,
            //排序表达式
            sortExp: "",
            //共享人
            reciveNum: ""
        },

        EVENTS: {
            SHOW_TIPS: "share#tips:show"
        },

        TIPS: {
            FETCH_DATA_ERROR: "网络异常，请稍后重试",
            DATA_FETCHING: "数据加载中",
            OPERATE_ERROR: "操作失败，请稍后再试",
            SUBDIR_CANNOTDEL: "子目录下不能进行删除操作",
            MUST_CHECKFILE: "请至少选择一个文件或文件夹",
            DELETE_FILE: '删除操作无法恢复，您确定要删除{0}个文件吗？？', // 提示待刪除文件數量
            DELETE_DIR: '删除文件夹将同时删除其中的文件，您确定要删除{0}个文件夹吗？', // 提示待刪除文件數量
            DELETE_FILEANDDIR: '删除操作无法恢复，您确定要删除{0}个文件夹，{1}个文件吗？' // 提示待刪除文件數量
        },

        initialize: function (args) {
            var self = this;

            self.common = args.common;
            //从url中获取共享人信息
            self.set({
                reciveNum: $Url.queryString("RN") || ""
            });
        },

        /**
         * 初始化数据
         */
        initData: function (data) {
            var self = this;
            var count = 0;
            var index = 0;

            //对文件和文件夹分开处理，文件夹放到文件之上
            if (data && data.length > 0) {
                var dirs = $.grep(data, function (n, i) {
                    return n.shareObj == self.common.shareObjTypes.DIR;
                });
                dirs.sort(function (first, second) {
                    var firFlag = self.common.isSystemFile(first) ? 1 : 0;
                    var secFlag = self.common.isSystemFile(second) ? 1 : 0;
                    return secFlag - firFlag;
                });
                var files = $.grep(data, function (n, i) {
                    return n.shareObj == self.common.shareObjTypes.FILE;
                });
                data = dirs.concat(files);
            }

            self.set({ cacheData: data }, {
                silent: true
            });
            self.setCacheIndexs();

            //对数据进行一次排序
            //默认按时排列
            self.sortData();

            if (data && data.length > 0) {
                var total = data.length;
                var size = self.get("pageSize");
                count = (function () {
                    var val = total % size;
                    if (val == 0) return total / size;
                    return (total - val) / size + 1;
                })();
                index = 1;
            }

            self.set({
                pageIndex: index,
                pageCount: count
            }, { silent: true });

        },

        /**
         * 对数据进行排序
        */
        sortData: function () {
            var self = this;
            var compare = 0;
            var data = self.get("cacheData");

            if (!data || data.length == 0)
                return;

            var sort = self.get("sortExp");
            if (!sort)
                return;

            var field = sort.split("-")[0];
            var isAsc = sort.split("-")[1] == "asc";

            var sortFunc = function (first, second) {
                switch (field) {
                    //名称                     
                    case "name":
                        compare = first.shareObjName.localeCompare(second.shareObjName);
                        break;
                        //类型
                    case "type":
                        var firExt = self.common.getFileExt(first.shareObjName);
                        var secExt = self.common.getFileExt(second.shareObjName);
                        compare = firExt.localeCompare(secExt);
                        break;
                        //时间
                    case "date":
                        compare = first.shareTime.localeCompare(second.shareTime);
                        break;
                        //大小
                    case "size":
                        var firSize = first.shareFileSize || 0;
                        var secSize = second.shareFileSize || 0;
                        compare = firSize - secSize;
                        break;
                }
                return compare * (isAsc ? 1 : -1);
            };

            //取出所有文件夹单独排序
            var dirs = $.grep(data, function (n, i) {
                return n.shareObj == self.common.shareObjTypes.DIR;
            });
            dirs.sort(sortFunc);

            //取出所有文件单独排序
            var files = $.grep(data, function (n, i) {
                return n.shareObj == self.common.shareObjTypes.FILE;
            });
            files.sort(sortFunc);

            self.set({
                cacheData: dirs.concat(files)
            }, { silent: true });
        },

        /**
         * 过滤出分页数据，并增加部分属性值
        **/
        filterData: function () {
            var self = this;
            var data = self.get("cacheData");
            var index = self.get("pageIndex");
            var size = self.get("pageSize");
            var result = new Array();

            if (data && data.length > 0) {
                data = data.concat();
                var start = size * (index - 1);
                var end = size * index;
                result = data.slice(start, Math.min(end, data.length));
            }

            //首先判断当前目录下是否是子目录，我们可以从导航信息中判断
            //子目录信息里由于没有共享人的信息
            //所以要取其父根目录的对应信息
            var shareDesc = "";
            var curRootDir = self.get("curRootDir");
            if (curRootDir) {
                shareDesc = self.getSharerName(curRootDir);
            }

            if (result && result.length > 0) {

                for (var i = 0; i < result.length; i++) {
                    var file = result[i];

                    //计算文件大小
                    file.size = "";
                    if (_.isNumber(file.shareFileSize)) {
                        file.size = self.common.getFileSizeText(file.shareFileSize);
                    }

                    file.name = file.shareObjName;
                    //是否系统文件(夹)
                    file.isSystem = self.common.isSystemFile(file) ? "1" : "";
                    file.hideClass = file.isSystem ? "hide" : "";

                    //获取文件类型图片
                    file.fileIcon = self.common.getFileIconClass(file);
                    //共享人
                    file.sharer = shareDesc ? shareDesc : self.getSharerName(file);
                }

                return result;
            }
        },

        /**
         *  获取共享人名称
         *  @param {Object}  file  //共享文件信息      
        **/
        getSharerName: function (file) {
            var self = this;

            if (!(file && file.sharer))
                return self.get("reciveNum");

            var name = self.common.getContactName(file.sharer);
            return name || file.sharer;
        },

        /**
         *  将当要访问的文件夹信息存贮在访问导航列表中
         *  @param {String}  args.dirId  //文件夹ID      
         *  @param {String}  args.path   //文件夹路径信息 
         *  @param {String}  args.dirName //文件夹路径信息 
        **/
        setNavigate: function (args) {
            var self = this;
            var navs = [];
            var value = self.get("navs") || [];
            var hasDir = false;

            if (args) {
                //此处先查询下目前的导航信息，如果已经存在该目录
                //说明导航可能是回到上级目录，所以需要去掉当前目录的子目录
                $.each(value, function (i, n) {
                    if (n.dirId == args.dirId)
                        return false;
                    navs.push(n);
                });
                //加入当前目录
                navs.push({
                    dirId: args.dirId,
                    path: args.path,
                    dirName: args.dirName,
                    isSystem: args.isSystem || 0
                });

                //存储根目录
                if (!self.get("curRootDir")) {
                    self.set({
                        curRootDir: self.getShareObj(args.dirId)
                    }, { silent: true });
                }
            } else {
                //参数为空说明我们要回到根目录
                //所以此时相应的要清除根目录信息
                self.set({ curRootDir: null }, { silent: true });
            }

            //只有导航信息发生变化后才去重设对象值
            if (!_.isEqual(navs, value)) {
                self.set({ navs: navs });
            }
        },

        //设置列表选中项

        /**
         *  将当要访问的文件夹信息存贮在访问导航列表中
         *  @param {String}  args.data  //文件夹ID      
         *  @param {String}  args.isChecked   //文件夹路径信息 
         *  @param {Boolean}  args.silent //数据更新时是否保持沉默
        **/
        setCheckedData: function (args) {
            var self = this;
            var checkeds = (self.get("checkData") || []).concat();

            var items = [];
            if (args.isChecked) {
                //将选择项合并到数组中
                items = _.union(checkeds, args.data);
            } else {
                //从选择列表中移除指定的选择项
                items = _.difference(checkeds, args.data);
            }

            var silent = false;
            if (_.isBoolean(args.silent))
                silent = args.silent;

            if (!_.isEqual(checkeds, items)) {
                self.set({ checkData: items }, { silent: silent });
            }

        },

        /**
         *  根据文件Id从数据列表中查找对应的文件信息
         *  @param {String}  id //共享信息内容ID 
        **/
        getShareObj: function (id) {
            var self = this;
            var data = self.get("cacheData");

            if (!data)
                return null;

            var objs = $.grep(data, function (n, i) {
                return n.shareObjId == id;
            });

            if (objs && objs.length > 0)
                return objs[0];
            return null;
        },

        /**
         *  获取选择的文件（夹）信息
        **/
        getCheckedFiles: function () {
            var self = this;
            var checks = self.get("checkData") || [];
            var indexs = self.get("cacheIndexs");

            if (checks.length == 0 || indexs.length == 0)
                return null;

            checks = checks.concat();

            var dirs = [];
            var files = [];

            $.each(checks, function (i, n) {
                var type = indexs[n];
                if (type == self.common.shareObjTypes.DIR)
                    dirs.push(n);
                else if (type == self.common.shareObjTypes.FILE)
                    files.push(n);
            });

            return {
                checkedDirIds: dirs,
                checkedFids: files
            };

        },

        /**
         * 获取拷贝到彩云的所有文件（夹）路径信息
        **/
        getCopyToFiles: function () {

            var self = this;
            var checks = self.getCheckedFiles();

            if (!checks) {
                return null;
            }

            var data = {};
            //获取所有已选择的文件夹路径
            if (checks.checkedDirIds.length > 0) {
                data.catalogInfos = [];
                $.each(checks.checkedDirIds, function (i, n) {
                    var obj = self.getShareObj(n);
                    if (obj && obj.path) {
                        data.catalogInfos.push(obj.path);
                    }
                });
            }
            //获取所有已选择的文件路径
            if (checks.checkedFids.length > 0) {
                data.contentInfos = [];
                $.each(checks.checkedFids, function (i, n) {
                    var obj = self.getShareObj(n);
                    if (obj && obj.path) {
                        data.contentInfos.push(obj.path);
                    }
                });
            }
            return data;
        },

        /**
         *  缓存数据索引，
         *  主要用来将文件和类型对应起来
         *  方便后续操作检索文件类型
        **/
        setCacheIndexs: function () {
            var self = this;
            var data = self.get("cacheData") || [];
            var indexs = null;

            if (data.length > 0) {
                indexs = {};
                $.each(data, function (i, n) {
                    if (n.shareObjId && n.shareObj) {
                        indexs[n.shareObjId] = n.shareObj;
                    }
                });
            }

            self.set({ cacheIndexs: indexs }, { silent: true });

        },

        /**
         *  从服务器获取数据
         *  @param {Function}  fnSuccess //数据访问成功后的处理函数   
         *  @param {Function}  fnError   //数据访问失败后的处理函数   
        **/
        fetch: function (fnSuccess, fnError) {
            var self = this;
            var result = null;
            var options = {};
            //从导航信息中获取查询条件
            var navs = self.get("navs") || [];

            if (navs.length > 0) {
                var nav = navs[navs.length - 1];
                $.extend(options, {
                    directoryId: nav.dirId,
                    path: nav.path
                });
            }

            top.$RM.call("disk:friendShareList", options, function (res) {
                if (res && res.responseData && res.responseData.code == "S_OK") {
                    var data = res.responseData["var"];
                    if (data && data.shareList)
                        res = data.shareList;

                    self.initData(res);
                    fnSuccess && fnSuccess(res);
                    return;
                }

                self.initData(null);
                fnError && fnError();

            }, function (e) {
                self.initData(null);
                fnError && fnError();

            });
        },

        /**
         *  下载文件
         *  @param {Array}     args.directoryIds //选择的文件夹id列表 
         *  @param {Array}     args.fileIds   //选择的文件id列表 
         *  @param {Function}  success //操作成功
         *  @param {Function}  error //操作失败
        **/
        download: function (args) {
            args = args || {};
            var self = this;
            var data = {
                directoryIds: args.directoryIds.join(","),
                fileIds: args.fileIds.join(","),
                isFriendShare: 1
            };
            data.path = self.getCurDirPath();
            top.$RM.call("disk:download", data, function (res) {
                if (res.responseData && res.responseData.code == 'S_OK') {
                    var data = res.responseData["var"];
                    if (data && data.url)
                        args.success && args.success(data.url);

                    return;
                }
                var errCode = "";
                if (res.responseData && res.responseData.code)
                    errCode = res.responseData.code;

                args.error && args.error(errCode);

            }, function () {
                args.error && args.error();
            });

        },

        /**
         * 获取当前文件夹的路径
         */
        getCurDirPath: function () {
            var self = this;
            var navs = self.get("navs");
            var deep = navs ? navs.length : 0;

            //此时是根目录
            if (deep == 0)
                return "";
            //获取当前路径对应文件夹信息
            var dir = navs[deep - 1];
            //当前目录为系统文件夹目录并是第一级时
            //文件夹的路径要特殊处理
            if (dir.isSystem && deep == 1)
                return self.common.sharePath;

            return dir.path;
        },

        /**
         *  从服务器获取数据
         *  @param {Array}     args.checkedDirIds //选择的文件夹id列表 
         *  @param {Array}     args.checkedFids //选择的文件id列表 
         *  @param {Function}  success //操作成功
         *  @param {Function}  error //操作失败
        **/
        delFiles: function (args) {
            args = args || {};
            var self = this;
            var data = {
                dirIds: args.checkedDirIds.join(","),
                fileIds: args.checkedFids.join(",")
            };
            top.$RM.call("disk:delShare", data, function (res) {
                if (res.responseData && res.responseData.code == 'S_OK') {
                    args.success && args.success();
                    return;
                }
                var errCode = "";
                if (res.responseData && res.responseData.code)
                    errCode = res.responseData.code;
                args.error && args.error(errCode);

            }, function () {
                args.error && args.error();
            });

        }

    }));

})(jQuery, _, M139);
