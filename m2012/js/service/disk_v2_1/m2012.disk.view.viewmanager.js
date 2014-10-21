; (function ($, _, M139) {

    var superClass = M139.View.ViewBase;
    var _class = "M2012.Disk.View.ViewManager";

    M139.namespace(_class, superClass.extend({

        name: _class,

        el: "#outArticle",

        logger: new M139.Logger({ name: _class }),

        viewMaps: {
            doc: { url: "/disk/disk_doc_async.html.pack.js", type: "module" },
            pic: { url: "/disk/disk_pic_async.html.pack.js", type: "module" },
            music: { url: "/disk/disk_music_async.html.pack.js", type: "module" },
            vedio: { url: "/disk/disk_vedio_async.html.pack.js", type: "module" },
            sharerec: { url: "/disk/disk_recived_async.html.pack.js", type: "module" },
            shareto: { url: "/disk/disk_shared_async.html.pack.js", type: "module" },
            recycle: { url: "/disk/disk_recycle_async.html.pack.js", type: "module" }
        },

        master: null,

        cacheViews: null,

        /**
         * 构造方法
        **/
        initialize: function (args) {
            var self = this;
            self.master = args.master;
            self.cacheViews = {};
            self.initEvents();

            return superClass.prototype.initialize.apply(self, arguments);
        },

        /**
         * 初始化事件
        **/
        initEvents: function () {
            var self = this;
            var master = self.master;

            //注册路由事件，页面视图跳转都是通过该事件完成
            //@param {String} args.path //视图跳转地址, 例：main/index 标示主视图的index模块视图
            master.on(master.EVENTS.NAVIGATE, function (args) {
                if (!args || !args.path)
                    return;

                var path = args.path.toLowerCase();
                var matchs = path.match(/^([^/]+)\/([^/]+)$/);
                if (!matchs || !matchs[1] || !matchs[2])
                    return;
                //视图类型
                var type = matchs[1];
                //视图名称
                var view = matchs[2];

                //如果是主视图
                if (type === "main") {
                    self.show(view, args);
                }
            });
        },

        /**
         *  显示视图
         *  @param {String} name //视图名称
         *  @param {Object} args //视图显示相关参数
        **/
        show: function (name, args) {
            if (!name)
                return;

            var self = this;
            var master = self.master;
            var view = self.cacheViews[name];

            //首先从缓存里取当前视图
            //缓存中没有找到则需要异步创建新的视图
            if (_.isUndefined(view)) {
                self.createViewAsync(name, args);
                return;
            }

            //显示已经缓存的视图
            self.showCacheView(name);
            //触发视图显示事件
            master.trigger(master.EVENTS.VIEW_SHOW, {
                //视图名称
                name: name,
                //当前视图的容器
                container: view.container,
                //该参数标示此视图已经缓存过
                cache: true,
                //携带参数
                args: args
            });
        },

        /**
         *  创建新视图
         *  @param {String} name //视图名称
         *  @param {Object} args //视图携带参数
        **/
        createView: function (name, args) {
            var self = this;
            var master = self.master;
            var EVENTS = master.EVENTS;

            //为该模块创建一个DIV区域
            var html = $T.format(self.template.main, {
                cid: self.cid, name: name
            });
            var container = $(html).appendTo(self.$el);

            //缓存当前视图
            self.cacheViews[name] = {
                name: name,
                container: container
            };

            //显示已经缓存的视图
            self.showCacheView(name);
            //触发视图创建事件
            master.trigger(EVENTS.VIEW_CREATED, {
                name: name,
                container: container,
                args: args,
                onshow: function () {
                    master.trigger(EVENTS.VIEW_SHOW, {
                        name: name,
                        cache: false,
                        container: container,
                        args: args
                    });
                }
            });
        },

        /**
        *  异步创建视图
        *  @param {String} name //视图名称
       **/
        createViewAsync: function (name, args) {
            var self = this;
            var map = self.viewMaps[name];

            if (_.isUndefined(map))
                return;

            M139.core.utilCreateScriptTag({
                id: "disk_" + name + "_pack",
                src: top.getDomain('resource') + '/m2012/js/packs' + map.url + '?sid=' + top.sid,
                charset: "utf-8"
            }, function () {

                self.createView(name, args);
            });
        },

        /**
         *  显示已经缓存的视图，隐藏其他视图
         *  @param {String} name //视图名称
        **/
        showCacheView: function (name) {
            var self = this;
            var view = null;
            for (var key in self.cacheViews) {
                view = self.cacheViews[key];
                if (view.name === name) {
                    view.container.show();
                    continue;
                }
                view.container.hide();
            }
        },

        template: {
            main: '<div class="outArticle" id="{cid}_{name}" style="height: 100%;"></div>'
            // main: '<div class="outArticleMain" id="{cid}_{name}" style="height: 100%;"></div>'
        }

    }));



})(jQuery, _, M139);