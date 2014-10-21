/**
 * 主视图管理器
 * Created by lizy on 14-4-1.
 */

(function ($, _, M139, top) {

    //{ #region 模板变量

    var container = $("#pnlView");
    var viewCache = {};
    viewCache['main'] = $("#viewpage_main");

    var tplPage = [
        '<div id="viewpage_$name$" class="js_viewpage">',
            '<div id="divTable" class="table_content" style="height:700px">',
                '<div id="divWaiting">',
                    '<div class="bg-cover"></div>',
                    '<div class="noflashtips inboxloading loading-pop" id="">',
                        '<!--[if lte ie 7]><i></i><![endif]-->',
                        '<img src="../../images/global/load.gif" alt="" style="vertical-align:middle">正在载入中，请稍候.....',
                    '</div>',
                '</div>',
            '</div>',
        '</div>'].join("");

    var tplFrame = '<iframe scrolling="auto" class="cal-iframe" name="calpage" frameborder="no" width="100%" id="cal_page_$name$" ></iframe>'; //onload="cal_page_$name$_loaded"

    var mapPagePack = {
        'main': { type: 'view' },
        'discovery': { type: 'module', url: '/calendar/cal_index_discovery_async.html.pack.js' },
        'subsc_act': { type: 'module', url: '/calendar/cal_special_activity_async.html.pack.js' },
        'invite_share_act': { type: 'module', url: '/calendar/cal_special_activity_async.html.pack.js' },
        'detail': { type: 'module', useContact: true, url: '/calendar/cal_edit_activity_async.html.pack.js' },
        'search': { type: 'module', url: '/calendar/cal_index_search_async.html.pack.js' },
        'message': { type: 'module', url: '/calendar/cal_index_message_async.html.pack.js' },
        'labelmgr': { type: 'module', url: '/calendar/cal_labelmanage.html.pack.js' },
        'label': { type: 'module', useContact: true, url: '/calendar/cal_edit_label.html.pack.js' },    // 编辑,创建日历
        'sharelabel': { type: 'module', url: '/calendar/cal_edit_sharelabel.html.pack.js' },    // 编辑共享日历
        'grouplabel': { type: 'module', useContact: true, url: '/calendar/cal_grouplabel.html.pack.js' },
        "groupactivity": { type: 'module', useContact: true, url: '/calendar/cal_index_groupactivity_async.html.pack.js' }
    };

    var _class = "M2012.Calendar.View.ViewManager";
    /**
     * 视图管理器
     */
    M139.namespace(_class, function (args) {
        var master = args && args.master || window.$Cal;
        this.logger = new M139.Logger({ name: _class });

        /**
      * 获取视图配置信息
      * @param name
      * @param args
      * @returns {boolean}
      */
        this.getPackView = function (name, args) {
            var pack = mapPagePack[name];
            if (_.isUndefined(pack)) {
                this.logger.error('page not found', name);
                return null;
            }
            return pack;
        };

        /**
        * 显示缓存中的视图
        * @param name
        * @param args
        * @returns {boolean}
        */
        this.showInCache = function (name, args) {
            var self = this;
            var EVENTS = master.EVENTS;
            var viewObj = viewCache[name];
            var isCache = !!viewObj;
            args = args || {};

            if (isCache) {

                var type = viewObj.data("type");
                var isPage = type == "page";
                if (viewObj.is(":visible") && !isPage) { //iframe刷新一下,否则可能会保留原先的数据
                    master.trigger(EVENTS.VIEW_SHOW, { name: name, container: viewObj, status: 'change:args', args: args });
                    return true;
                }
                container.find('.js_viewpage').hide();
                viewObj.show();

                if (isPage) {
                    //如果是内嵌页，兼容旧有逻辑，通过url传递参数
                    var url = viewObj.data("url");
                    var param = $.extend(args, { r: Math.random() }); //加个随机数，强制刷
                    url = $Url.makeUrl(url, param);
                    var frame = viewObj.find("iframe");
                    frame.attr('src', url);
                    master.trigger(EVENTS.VIEW_SHOW, { name: name, container: viewObj, status: 'change:src', args: args });

                } else {
                    master.trigger(EVENTS.VIEW_SHOW, { name: name, container: viewObj, status: 'change:visible', args: args });
                }
            }

            return isCache;
        };

        this.show = function (name, args) {
            var self = this;
            var view = self.getPackView(name, args);

            if (!view) {
                return;
            }

            //如果视图已经被创建则取缓存视图展示
            if (self.showInCache(name, args)) {
                return;
            }

            var EVENTS = master.EVENTS;
            var url = "", param = {};
            var newPage = $(tplPage.replace('$name$', name));

            args = args || {};        

            //以下是创建新的视图
            (function (func) {
                //判断当前视图依赖的Js文件是否已经被加载
                //因为一个打包的js文件中可能存在多个视图
                //对于这种情况我们只要判断有一个视图存在则说明该Js已经被加载过
                if (self.isJsResLoaded(name)) {
                    func();
                    return;
                }
                var map = mapPagePack[name];
                master.loadJsResAsync({
                    id: name,
                    url: map.url,
                    useContact: map.useContact,
                    onload: function () {
                        func();
                    }
                });

            })(function () {
                //隐藏所有展示的视图
                container.find('.js_viewpage').hide();
                //将新创建的视图容器DIV添加到页面中并存储
                container.append(newPage);
                viewCache[name] = newPage;

                var EVENTS = master.EVENTS;
                var pageContainer = container.find('#viewpage_' + name);

                //通知页面该视图已经被创建
                master.trigger(EVENTS.VIEW_CREATED, {
                    name: name,
                    container: pageContainer,
                    params: args.params || {}, //新加的传递参数,查看订阅日历活动时需要传递参数
                    onshow: function () {
                        master.trigger(EVENTS.VIEW_SHOW, {
                            name: name,
                            container: pageContainer,
                            args: args
                        });
                    }
                });
            });

        };

        /**
         *  判断视图对应的脚本资源是否已经加载
         *  @param {String}  name //视图名称
        **/
        this.isJsResLoaded = function (name) {
            var self = this;
            var url = mapPagePack[name].url;
            //遍历所有已经创建的视图
            //如果其视图依赖的js和当前视图依赖的js一致
            //说明该js已经加载，无需继续加载
            for (var view in viewCache) {
                if (mapPagePack[view].url === url)
                    return true;
            }
            return false;
        }

    });

})(jQuery, _, M139, window._top || window.top);
