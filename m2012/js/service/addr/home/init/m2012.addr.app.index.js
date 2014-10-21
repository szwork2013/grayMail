(function($, _, M) {
    /**
     * 通讯录初始化加载方法。
     */
    $(function() {
        // 配置信息
        window._CFG = new M2012.Addr.Base.Config.Global();
        // 全局方法和属性
        new M2012.Addr.Base.Utils.Global();

        /**
         *  测试专用，可忽略
         */
        var isTestMode = false;
        if (isTestMode) {
            new M2012.Addr.Test.Data.SynGC().testSynGC();
        }
        if (_Local_And_Addr) {
            new M2012.Addr.Test.Data.SynGC().testAndAddrShow(5, 300);
        }

        function initAddr() {

            _EA_C.off();
            _EA_G.off();
            _EA_AND_C.off();
            _EA_AND_G.off();

            // initialize global data
            window._DataBuilder = new M2012.Addr.Tool.Data.Builder();
            
            var groups = window._Groups = _DataBuilder.buildAllGroups();
            groups.listenBroadcastEvents();
            
            window.$Addr = top.$Addr = new M2012.Addr.Model.LinkHelper();

            window._ContactsCache = new M2012.Addr.Cache.Contacts();
            window._GroupsCache = new M2012.Addr.Cache.Groups();
            window._GCMapCache = new M2012.Addr.Cache.MapGC();

            // 拖拽model
            var mDragdrop = new M2012.Addr.Model.Dragdrop();

            /************start(toolbar)************/
            new M2012.Addr.View.Events({
                master : top.$Addr
            });
            
            new M2012.Addr.View.AddrContacts({
                master : top.$Addr
            });

            new M2012.Addr.View.Remind({
                master : top.$Addr
            });

            new M2012.Addr.View.ToolBar({
                master : top.$Addr
            });

            new M2012.Addr.View.PimToolBar({
                master : top.$Addr
            });
            /************end(toolbar)************/

            var mGroupsManager = new M2012.Addr.Model.GroupsManager();
            new M2012.Addr.View.GroupsManager({
                model : mGroupsManager
            });

            // 组导航视图
            new M2012.Addr.View.Groups.Nav.List({
                collection : groups,
                mDragdrop : mDragdrop,
                mGroupsManager : mGroupsManager
            }).render();

            // 联系人列表视图
            var contacts = window._Contacts = new M2012.Addr.Collection.Contacts.List();
            contacts.listenBroadcastEvents();
            // 分页
            var mPaging = new M2012.Addr.Model.Contacts.Paging({
                totalRecords : contacts.length,
                pageSize : 100
            });
            // 跨页选择
            var mSelector = new M2012.Addr.Model.Contacts.Selector({
                totalRecords : contacts.length
            });
            // 搜索
            var mSearch = new M2012.Addr.Model.Contacts.Search();
            // 首字母过滤
            var mInitialLetterFilter = new M2012.Addr.Model.Contacts.Filter.InitialLetter();
            // 排序
            var mSort = new M2012.Addr.Model.Contacts.Sort();
            var contactsView = new M2012.Addr.View.Contacts.List({
                collection : contacts,
                mSearch : mSearch,
                mPaging : mPaging,
                mInitialLetterFilter : mInitialLetterFilter,
                mSelector : mSelector,
                mSort : mSort,
                mDragdrop : mDragdrop
            });

            // search view
            new M2012.Addr.View.Contacts.Search({
                model : mSearch
            });

            // paging view
            new M2012.Addr.View.Contacts.Paging({
                model : mPaging
            }).render();

            // initial letter filter
            new M2012.Addr.View.Contacts.Filter.InitialLetter({
                model : mInitialLetterFilter
            });

            // contacts selector
            new M2012.Addr.View.Contacts.Selector({
                mSelector : mSelector,
                mSort : mSort
            });

            // and addr
            var isAndAddrUser = true;
            if (_Show_And_Addr && isAndAddrUser) {
                $("#andAddr-groups-container").show();

                var andGroups = window._AndGroups = new M2012.AndAddr.Collection.Groups.List();
                var mUmcUser = new M2012.Addr.Model.UmcUser();
                new M2012.AndAddr.View.Groups.List({
                    collection : andGroups,
                    mUmcUser : mUmcUser,
                    mGroupsManager : mGroupsManager
                });
                var andContacts = window._AndContacts = new M2012.AndAddr.Collection.Contacts.List();
				
                // 兼容360
                var $andAddrContactsRoot = $("#and-contacts-list");

                // 分页
                var mAndPaging = new M2012.AndAddr.Model.Contacts.Paging({
                    totalRecords : andContacts.length,
                    pageSize : 100
                });
                // 跨页选择
                var mAndSelector = new M2012.AndAddr.Model.Contacts.Selector({
                    el : $andAddrContactsRoot.find("#contacts-header"),
                    totalRecords : andContacts.length
                });
                new M2012.AndAddr.View.Contacts.List({
                    el : $andAddrContactsRoot.find("#contacts-list"),
                    collection: andContacts,
                    mPaging : mAndPaging,
                    mSelector : mAndSelector
                });
                // paging view
                new M2012.AndAddr.View.Contacts.Paging({
                    el : $andAddrContactsRoot.find("#contactsPagingBar"),
                    model : mAndPaging
                }).render();

                // contacts selector
                new M2012.AndAddr.View.Contacts.Selector({
                    el: $andAddrContactsRoot.find("#contacts-header"),
                    mSelector : mAndSelector
                });
            }

            /**
            * 群组, 加载主model, 点击时再进行群组初始化
            */
            top.$Addr.GomModel = new M2012.GroupMail.Model.Manage();
            new M2012.GroupMail.View.Manage.Main({ model: top.$Addr.GomModel });

            // 修改通讯录加载状态
            window._LoadStatus = 1;
            
            // 初始化路由
            new M2012.Addr.Router.Index().route();
            
            top.BH("addr_load_index");

            // 显示通讯录页面
            showAddrMain();

            /**
             *  测试专用，可忽略
             */
            var isTestMode = false;
            if (isTestMode) {
                new M2012.Addr.Test.Data.SynGC();
            }            
        }

        /**
         * 显示通讯录页面
         */
        function showAddrMain() {
            $("#addr-loading-box").hide();
            $(".outArticle").show();
            $(".inAside").show();
            
            var fnSetSkin = top.$App.setModuleSkinCSS;
            if (fnSetSkin) {
                fnSetSkin(document);
            }
            
//            _EA_G.keyTrigger("RESET_GROUPS_LIST_HEIGHT");
            _EA_G.keyTrigger("AUTO_LOCATE_NAV");
            _EA_C.keyTrigger("RESET_CONTACTS_LIST_HEIGHT");
        }

        // 初始化加载。 0:加载成功 1:加载成功 -1:加载失败
        window._LoadStatus = 0;
        setTimeout(function() {
            if (_LoadStatus == 0) {
                $("#addr-loading").hide();
                $("#addr-loadError").show();
                window._LoadStatus = -1;
            }
        }, 10000);

        // 获取通讯录数据，异步加载页面。
        top.M2012.Contacts.getModel().requireData(function() {
            try {
                initAddr();            
            } catch (error) {
                // 如果top层联系人数据没有构建完成，则定时去重新获取数据，直到成功或者超时失败。
                var intervalId = setInterval(function() {
                    _Log("addr reloading...");
                    if (_LoadStatus != 0) {
                        clearInterval(intervalId);
                        _Log("addr reloading end!");
                        return;
                    }
                    try {
                        initAddr();
                    } catch(intervalError) {
                        // 不处理，等待下次重试。
                        _Log(intervalError);
                    }
                }, 500);
            }            
        });
    });

})(jQuery, _, M139);
