; (function ($, _, M139) {

    var _super = M139.View.ViewBase;
    var _class = "M2012.Disk.View.NavigateBar";

    M139.namespace(_class, _super.extend({

        name: _class,

        logger: new M139.Logger({ name: _class }),
        //视图模型数据
        model: null,
        //视图主控
        master: null,
        //当前控件父容器
        container: null,

        /**
         *  面包屑效果导航
         *  @param {Object} args.master //视图主控
         *  @param {Object} args.container //控件父容器
         *  @param {Object} args.master //视图主控
        **/
        initialize: function (args) {
            var self = this;

            _super.prototype.initialize.apply(self, arguments);

            args = args || {};
            self.master = args.master || window.$Disk;
            self.container = args.container;
            self.model = new M2012.Disk.Model.NavigateBar({
                master: master
            });
            self.initEvents();
            self.render();
            return
        },

        initEvents: function () {
            var self = this;

            //初始化数据
            self.on("init", function (args) {
                self.model.setNavigate(args);
            });

            self.model.on("change", function () {

                if (self.model.hasChanged("navs")) {
                    self.render();
                }
            });
        },

        render: function () {
            var self = this;
            var html = self.template;
            var template = _.template(html);
            var data = self.model.get("navs");
            self.container.html(template(data));
        },

        template: [
            '<a href="javascript:;">全部文件</a>',
            '<% _.each(obj, function(i){ %>',
            '<span class="f_st">&nbsp;&gt;&nbsp;</span>',
            '<a href="javascript:;" data-path="<%=_.escape(i.path)%>" data-system="<%=i.isSystem%>" data-dirid="<%=_.escape(i.dirId)%>">',
                '<%=_.escape(i.dirName)%>',
            '</a>',
            '<% }) %>'
        ].join("")

    }));

    (function () {

        var base = M139.Model.ModelBase;
        var current = "M2012.Disk.Model.NavigateBar";

        M139.namespace(current, base.extend({

            name: current,

            master: null,

            defaults: {
                //访问的导航路径
                navs: null
            },

            /**
              *  构造函数
              *  @param {Object} args.master     //日历视图主控
              *  @param {Date} args.date         //指定的时间(可选)
             **/
            initialize: function (args) {
                var self = this;
            },


            /**
             *  将当要访问的文件夹信息存贮在访问导航列表中
             *  @param {String}  args.dirId  //文件夹ID      
             *  @param {String}  args.path   //文件夹路径信息 
             *  @param {String}  args.dirName //文件夹路径信息 
             *  @param {Number}  args.isSystem //是否系统文件夹 1:是，0：否
            **/
            setNavigate: function (args) {
                var self = this;
                var navs = [];
                var value = self.get("navs") || [];

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
                }

                //只有导航信息发生变化后才去重设对象值
                if (!_.isEqual(navs, value)) {
                    self.set({ navs: navs });
                }
            }

        }));

    })();

})(jQuery, _, M139);