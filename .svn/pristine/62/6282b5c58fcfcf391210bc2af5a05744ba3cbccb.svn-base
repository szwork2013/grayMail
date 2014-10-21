; (function ($, _, M139) {

    var superClass = M139.Model.ModelBase;
    var _class = "M2012.Disk.Model.listTemplate";

    M139.namespace(_class, superClass.extend({
        name: _class,
        defaults: {
            //当前视图页码
            pageIndex: 1,
            //页数
            pageCount: 0,
            //每页显示信息条数
            pageSize: 30,
            //访问的导航路径
            navs: null,
            //当前目录下所有共享数据
            cacheData: new Array(),
            //hash缓存数据便于快速查找
            cacheHash: null,
            //选中的项
            checkData: new Array(),
            //当前目录的根目录
            curRootDir: null,
            //排序表达式
            sortExp: "date-desc"
        },

        logger: new M139.Logger({ name: _class }),

        master: null,

        EVENTS: {

        },

        TIPS: {
            FETCH_DATA_ERROR: "网络异常，请稍后重试",
            DATA_FETCHING: "数据加载中",
            OPERATE_ERROR: "操作失败，请稍后再试",
            MUST_CHECKFILE: "请至少选择一个文件或文件夹",
            RESTORE_SUCCESS: "还原成功",
            DEL_CONFIRM: "确认彻底删除文件（夹）？删除后，文件将无法恢复",
            DEL_SUCCESS: "删除成功",
            CLEAR_CONFIRM: "确认清空回收站？清空后，文件将无法恢复。",
            CLEAR_SUCCESS: "清空回收站成功",
            RECYCLE_NOTIFY: "回收站不占用网盘容量，保留60天后将自动删除。"
        },

        /**
         *  详细活动编辑
         *  @param {Object} args.master //视图主控
        */
        initialize: function (args) {
            var self = this;
            args = args || {};
            self.master = args.master;
        },

        /**
         * 初始化数据
         */
        initData: function (data) {
            var self = this;
            var count = 0;
            var index = 0;

            self.set({ cacheData: data }, {
                silent: true
            });

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
         *  将当要访问的文件夹信息存贮在访问导航列表中
         *  @param {String}  args.dirId  //文件夹ID      
         *  @param {String}  args.path   //文件夹路径信息 
         *  @param {String}  args.dirName //文件夹路径信息 
         *  @param {Number}  args.isSystem //是否系统文件夹 1:是，0：否
        **/
        setNavigation: function (args) {
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

            var params = {
                field: sort.split("-")[0],
                isAsc: sort.split("-")[1] == "asc"
            };



            //取出所有文件夹单独排序
            var dirs = $.grep(data, function (n, i) {
                return n.isDir === true;
            });

            dirs.sort(function (first, second) {
                return self.sortFunc.call(params, first, second);
            });

            //取出所有文件单独排序
            var files = $.grep(data, function (n, i) {
                return n.isDir === false;
            });
            files.sort(function (first, second) {
                return self.sortFunc.call(params, first, second);
            });

            self.set({
                cacheData: dirs.concat(files)
            }, { silent: true });
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
            var checks = (self.get("checkData") || []).concat();

            var items = [];
            if (args.isChecked) {
                //将选择项合并到数组中
                items = _.union(checks, args.data);
            } else {
                //从选择列表中移除指定的选择项
                items = _.difference(checks, args.data);
            }

            var silent = false;
            if (_.isBoolean(args.silent))
                silent = args.silent;

            if (!_.isEqual(checks, items)) {
                self.set({ checkData: items }, { silent: silent });
            }
        },

        /**
         * 获取已经选择的项数据
        **/
        getCheckedData: function () {
            var self = this;
            var checks = self.get("checkData") || [];
            var hash = self.get("cacheHash");

            if (!checks.length || !hash) {
                return null;
            }

            var dirs = [];
            var files = [];

            $.each(checks, function (i, n) {
                var data = hash[n];
                if (!data)
                    return true;

                if (data.isDir)
                    dirs.push(n);
                else
                    files.push(n);
            });

            return {
                checkedDirIds: dirs,
                checkedFids: files
            };
        },


        /**
         * 过滤出分页数据，并对数据做转换
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

            //对数据进行转换
            if (result && result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    self.parseData(result[i]);
                }
            }
            return result;
        },

        /**
         * @virtual 转换数据以便填充数据到页面模板
         *  此方法一般需要子类去重写
         *  @param {Object}  data //要转换的数据项
        **/
        parseData: function (data) {

        },

        /**
        * @virtual 排序方法
        *  此方法一般需要子类去重写
        *  @param {Object}  first //要排序的数据
        *  @param {Object}  second //要排序的数据
        **/
        sortFunc: function (first, second) {
            return 0;
        }

    }));

})(jQuery, _, M139);