(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Contacts.List";
    if (window.ADDR_I18N) {
        var PageMsg = ADDR_I18N[ADDR_I18N.LocalName].home;
    }

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        el : "#m139-contacts-list #contacts-list",

        logger : new M139.Logger({
            name : _class
        }),

        renderFrozen : false, // 绘制页面render的开关 true:冻结render,false:解冻render

        // emptyGroupContactsTemplate : _.template($('#tpl-group-no-contacts').html()),

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);

            // 无联系人时的消息显示区
            _this.$msgPanel = $("#contacts-list-msg");
            // 联系人显示区
            _this.$listContainer = $("#contacts-list-container");

            // 首字母过滤
            _this.mInitialLetterFilter = options.mInitialLetterFilter;
            _this.mInitialLetterFilter.on("change:initialLetter", _this.onFilterInitialLetterChanged, _this);

            // 跨页选择
            _this.mSelector = options.mSelector;
            _this.collection.on("change:selected", _this.onToggleContactSelect, _this);
            // 取消选择
            EventsAggr.Contacts.keyOn("UNSELECT_ALL", _this.onAllContactsUnselected, _this);
            // 当页全选择
            EventsAggr.Contacts.keyOn("SELECT_PAGE", _this.onSelectPageContacts, _this);
            // 当页取消选择
            EventsAggr.Contacts.keyOn("UNSELECT_PAGE", _this.onUnselectPageContacts, _this);

            // 排序
            _this.mSort = options.mSort;
            _this.mSort.on("change", _this.onContactsSort, _this);

            // 搜索
            _this.mSearch = options.mSearch;
            _this.mSearch.on("change:keyword", _this.onContactsSearch, _this);

            // 分页
            _this.mPaging = options.mPaging;
            _this.mPaging.on("change:pageIndex change:pageSize", _this.onPaged, _this);

            // 拖拽
            _this.mDragdrop = options.mDragdrop;
            _this.dragdropView = new M2012.Addr.View.Dragdrop({
                model : _this.mDragdrop,
                dragStartView : _this
            });
            _this.dragdropView.makeDragable();

            _this.itemModels = {};

            // 选择组时，刷新联系人列表
            EventsAggr.Groups.keyOn("GROUP_SELECTED", _this.onGroupSelected, _this);

            // 联系人C/(R)/U/D
            _EA_C.keyOn("CONTACT_ADDED", _this.onContactAdded, _this);
            _EA_C.keyOn("CONTACT_EDITED", _this.onContactEdited, _this);
            _EA_C.keyOn("CONTACTS_DELETED", _this.onContactsDeleted, _this);

            _EA_C.keyOn("GROUP_MOVED_TO", _this.onContactsMovedToGroup, _this);
            _EA_C.keyOn("GROUP_COPIED_TO", _this.onContactsCopiedToGroup, _this);

            // 导入联系人
            _EA_C.keyOn("CONTACTS_IMPORTED", _this.onContactsImported, _this);
            // 合并联系人
            _EA_C.keyOn("CONTACTS_MERGED", _this.onContactsMerged, _this);
            // 更新联系人
            _EA_C.keyOn("CONTACTS_SYNED", _this.onContactsSyned, _this);

            // 重设列表区高度
            _EA_C.keyOn("RESET_CONTACTS_LIST_HEIGHT", _this.setContactsListHeight, _this);
            
            // 刷新联系人列表
            _EA_C.keyOn("RENDER_CONTACTS", _this.renderContacts, _this);

            // 页面窗口大小调整时，重设列表区高度
            $(window).resize(function() {
                _this.setContactsListHeight();
            });
        },
        
        /**
         *  移动联系人到组后，刷新列表
         */
        onContactsMovedToGroup : function(data, options) {
            var rgc = options.renderGC;
            if (rgc == _CFG.getRenderGC("MC2G")) {
                // TODO move groups-operating to groups-view
                _EA_G.keyTrigger("RENDER_GROUPS", {
                    groupsId : _Groups.getGroupsId()
                }, options);
                _EA_C.keyTrigger("RENDER_CONTACTS", {
                }, options);
            }

        },

        /**
         *  复制联系人到组后，刷新列表
         */
        onContactsCopiedToGroup : function(data, options) {
            var rgc = options.renderGC;
            if (rgc == _CFG.getRenderGC("CC2G")) {
                _EA_G.keyTrigger("RENDER_GROUPS", {
                    groupsId : _Groups.getGroupsId()
                }, options);
                _EA_C.keyTrigger("RENDER_CONTACTS", {
                }, options);
            }
        },

        /**
         * 保持现有的分页，重绘联系人列表 
         */
        keepPageRender : function() {
            var forceFrozen = this.isRenderFrozen();
            this.renderFrozen = true;

            this.setGroupedContacts();

            var totalRecords = this.filteredContacts.length;

            this.mPaging.set("totalRecords", this.filteredContacts.length);
            var maxIndex = this.mPaging.get("maxIndex");
            var pageIndex = this.mPaging.get("pageIndex");
            if (pageIndex > maxIndex) {
                this.mPaging.set("pageIndex", maxIndex);
            }

            this.renderFrozen = forceFrozen;
            this.render();
        },

        /**
         * 重绘联系人列表。
         */
        renderContacts : function(data, options) {
            var rgc = options && options.renderGC;
            var keepPageRender = [_CFG.getRenderGC("DC"), _CFG.getRenderGC("CC2G"), _CFG.getRenderGC("MC2G")];
            if (rgc && _.contains(keepPageRender, rgc)) {
                this.keepPageRender();
            } else {
                this.render();
            }
        },

        /**
         * 添加联系人后，刷新联系人列表。 
         */
        onContactAdded : function(data, options) {
            var rgc = options.renderGC;
            if (rgc == _CFG.getRenderGC("CC")) {
                var groupId = _Groups.selectedGroupId();
                _EA_G.keyTrigger("RENDER_GROUPS", {
                    groupsId : _Groups.getGroupsId()
                }, options);
                _EA_G.keyTrigger("SELECT_GROUP", {
                    groupId : groupId
                }, options);
            } else if (rgc == _CFG.getRenderGC("CC_Silent")) {
                _EA_G.keyTrigger("RENDER_GROUPS", {
                    groupsId : _Groups.getGroupsId()
                }, options);
            }
        },
        
       /**
         * 编辑联系人后，刷新联系人列表。 
         */
        onContactEdited : function(data, options) {
            var rgc = options.renderGC;
            if (rgc == _CFG.getRenderGC("UC")) {
                var groupId = _Groups.selectedGroupId();
                _EA_G.keyTrigger("RENDER_GROUPS", {
                    groupsId : _Groups.getGroupsId()
                }, options);
                _EA_G.keyTrigger("SELECT_GROUP", {
                    groupId : groupId
                }, options);
            }
        },

       /**
         * 删除联系人后，刷新联系人列表。 
         */
        onContactsDeleted : function(data, options) {
            var rgc = options.renderGC;
            if (rgc == _CFG.getRenderGC("DC")) {
                _EA_G.keyTrigger("RENDER_GROUPS", {
                    groupsId : _Groups.getGroupsId()
                }, options);
                // 初始化搜索状态
                if (this.mSearch.isSearchCompleted()) {
                    this.mSearch.resetSearchStatus();
                    if (data && data.contactsId && data.contactsId.length > 0) {
                        this.mSearch.set("totalRecords", this.mSearch.get("totalRecords") - data.contactsId.length);
                    }
                }
                _EA_C.keyTrigger("RENDER_CONTACTS", {
                }, options);
            }
            this.collection.removeSelectedContacts(data.contactsId);
        },

        /**
         * 计算并设置联系人列表高度 
         */
        setContactsListHeight : function() {
            // 动态计算列表区的高度
            var $rootPanel = $("#m139-contacts-list");
            var $target = $rootPanel.find(".addr-list");

            // 搜索头部区高度
            var $searchTitle = $rootPanel.find("#contacts-search-title");
            var searchTitleHeight = $searchTitle.is(":visible") ? $searchTitle.height() : 0;
            // 工具栏区高度
            var toolbarHeight = $rootPanel.find("div.addr-btngroup").height();
            // 首字母过滤区高度
            var initLetterHeight = $rootPanel.find("#initial-letter-filter").height();
            // 联系人列表头高度
            var contactsHeaderHeight = $rootPanel.find("#contacts-header").height();

            // 页面固定占用的高度
            var fixedHeight = searchTitleHeight + toolbarHeight + initLetterHeight + contactsHeaderHeight + 30;

            var windowHeight = $(window).height();
            $target.height(windowHeight - fixedHeight);

            // 判断是否有滚动条。如果有，调整联系人列表样式
            var lastScrollTop = $target.scrollTop();
            if (lastScrollTop == 0) {
                $target.scrollTop(1);
            }
            if ($target.scrollTop() > 0) {
                $target.removeClass().addClass("addr-list bgPadding_left");
                $target.scrollTop(lastScrollTop);
            } else if ($target.scrollTop() == 0) {
                $target.removeClass().addClass("addr-list bgPadding");
            }
        },

        render : function() {
            var _this = this;

            var allow = _this.isRenderFrozen() ? "X" : "O";
            _Log(allow + " --- render contacts list");

            if (_this.isRenderFrozen()) {
                return _this;
            }

            _this.$el.empty();

            var listToRender = _this.listToRender();
            if (listToRender.length == 0) {// 列表区没有联系人的情况
                var selectedGroup = _Groups.selectedGroup();
                var noContactsView = null;
                if (_this.mInitialLetterFilter.isFiltering()) {
                    noContactsView = new M2012.Addr.View.Contacts.NoFilterContacts().render();
                } else {
                    if (selectedGroup.isAllContactsGroup()) {// 所有联系人
                        if (_this.mSearch.isSearching()) {
                            noContactsView = new M2012.Addr.View.Contacts.NoSearchContacts().render();
                        } else {
                            noContactsView = new M2012.Addr.View.Contacts.NoContacts().render();
                        }
                    } else if (selectedGroup.isVipGroup()) {// vip联系人
                        noContactsView = new M2012.Addr.View.Contacts.NoVipContacts().render();
                    } else {// 自定义联系人
                        noContactsView = new M2012.Addr.View.Contacts.NoGroupContacts().render();
                    }
                    EventsAggr.Contacts.keyTrigger("NO_CONTACTS_RENDER");
                }
                _this.$msgPanel.html(noContactsView.el);

                _this.$msgPanel.show();
                _this.$listContainer.hide();
            } else {// 列表区有联系人
                EventsAggr.Contacts.keyTrigger("CONTACTS_RENDERED");

                _this.checkPageSelected();

                var itemModels = _this.itemModels = {};
                _.each(listToRender, function(contact) {
                    var contactId = contact.SerialId;
                    var model = new M2012.Addr.Model.Contacts.Item(contact);
                    var selected = _this.collection.isSelected(model.get("SerialId"));
                    model.set("selected", selected, {
                        silent : true
                    });
                    itemModels[contactId] = model;
                    var itemView = new M2012.Addr.View.Contacts.Item({
                        model : model,
                        collection : _this.collection,
                        id : "contact-" + contactId,
                        mSearch : _this.mSearch,
                        dragdropView : _this.dragdropView,
                        parentView : _this
                    });
                    _this.$el.append(itemView.render().el);
                });

                _this.$msgPanel.hide();
                _this.$msgPanel.empty();
                _this.$listContainer.show();

                _this.setContactsListHeight();
            }

            return _this;
        },

        /**
         * 选择/取消联系人切换
         */
        onToggleContactSelect : function() {
            this.checkPageSelected();
        },

        /**
         *  检查当页联系人是否已经全部选中
         */
        checkPageSelected : function() {
            var cdm = this.collectionDataManager();
            var pageSelected = _.every(this.pagedContacts, function(contact) {
                return cdm.isSelected(contact.SerialId);
            });

            this.mSelector.set("pageSelected", pageSelected);
        },

        onContactsImported : function(data, options) {
            var groupId = _Groups.selectedGroupId();
            _EA_G.keyTrigger("RENDER_GROUPS", data, options);
            EventsAggr.Groups.keyTrigger("SELECT_GROUP", {
                groupId : groupId
            }, {
                showMain : false
            });
        },

        onContactsMerged : function(data, options) {
            var groupId = _Groups.selectedGroupId();
            _EA_G.keyTrigger("RENDER_GROUPS", data, options);
            EventsAggr.Groups.keyTrigger("SELECT_GROUP", {
                groupId : groupId
            }, {
                showMain : false
            });
        },

        onContactsSyned : function(data, options) {
            var groupId = _Groups.selectedGroupId();
            _EA_G.keyTrigger("RENDER_GROUPS", data, options);
            EventsAggr.Groups.keyTrigger("SELECT_GROUP", {
                groupId : groupId
            }, {
                showMain : false
            });
        },

        /**
         * 取消选择全部选中的联系人
         */
        onAllContactsUnselected : function() {
            var _this = this;
            _.each(this.pagedContacts, function(contact) {
                var contactId = contact.SerialId;
                if (_this.collection.isSelected(contactId)) {
                    _this.itemModels[contactId].set("selected", false);
                }
            });

            this.collection.cleanSelectedContacts();
            this.mSelector.set({
                selectedNum : 0,
                pageSelected : false
            });
        },

        /**
         * 选择整页联系人
         */
        onSelectPageContacts : function() {
            var _this = this;
            var contactsToSelect = [];
            _.each(this.pagedContacts, function(contact) {
                var contactId = contact.SerialId;
                if (!_this.collection.isSelected(contactId)) {
                    contactsToSelect.push(contactId);
                    _this.itemModels[contactId].set("selected", true);
                }
            });
            this.mSelector.set({
                pageSelected : true
            });
        },

        /**
         * 取消选择整页联系人
         */
        onUnselectPageContacts : function() {
            var _this = this;
            _.each(this.pagedContacts, function(contact) {
                var contactId = contact.SerialId;
                if (_this.collection.isSelected(contactId)) {
                    _this.itemModels[contactId].set("selected", false);
                }
            });
            this.mSelector.set({
                pageSelected : false
            });
        },

        /**
         * 显示组联系人
         *
         * @param {Object} groupId
         */
        onGroupSelected : function(data, options) {
            this.renderFrozen = true;

            // 显示主列表区
            var showMain = (options && options.showMain) || false;
            if (showMain && window.$Addr) {
                var master = window.$Addr;
                master.trigger(master.EVENTS.LOAD_MAIN);
            }

            // 取消选择联系人
            this.collection.unselectAll();
            // 初始化搜索状态
            if (this.mSearch.isSearchCompleted()) {
                this.mSearch.resetSearchStatus();
            }
            // 首字母初始化
            this.mInitialLetterFilter.set("initialLetter", "all");
            // 分页初始化
            this.mPaging.set("pageIndex", 1);
            // 排序初始化
            this.mSort.resetAll();
            this.mSort.set("name", 1);
            // 设置组联系人
            this.setGroupedContacts();
            // 设置组联系人数量
            var totalRecords = this.groupedContacts.length;
            this.mPaging.set("totalRecords", totalRecords);

            this.mSelector.set({
                selectedNum : 0,
                pageSelected : false,
                totalRecords : totalRecords
            });

            this.renderFrozen = false;
            this.render();
        },

        /**
         * 搜索联系人
         */
        onContactsSearch : function() {
            if (window.$Addr) {
                var master = window.$Addr;
                master.trigger(master.EVENTS.LOAD_MAIN);

                //强制回到通讯录联系人首页
                master.GomModel.set({mainState: 'contacts'});
            }

            var keyword = this.mSearch.get("keyword");
            // _Log("searching " + keyword); // This code won't work when debugging in Browser console mode.

            var forceFrozen = this.isRenderFrozen();
            if (forceFrozen) {
                return;
            }
            this.renderFrozen = true;

            this.mSearch.setSearchingStatus();
            EventsAggr.Groups.keyTrigger("SELECT_GROUP", {
                groupId : _CFG.getAllContactsGid()
            });
            // setSearchedContacts();

            // 设置搜索的联系人数量
            var totalRecords = this.searchedContacts.length;
            this.mPaging.set("totalRecords", totalRecords);
            // 设置联系人选择区
            this.mSelector.set("totalRecords", totalRecords);
            this.mSearch.set("totalRecords", totalRecords);

            this.renderFrozen = forceFrozen;
            this.render();
            this.mSearch.setSearchCompleted();

            top.BH("addr_contacts_searchSucceed");
        },

        /**
         * 按照首字母过滤联系人
         *
         * @param {Object} model
         */
        onFilterInitialLetterChanged : function(model) {
            // forzen by parent caller.
            // if forceFrozen = true, means the parent handler wanna render the list by itself.
            var forceFrozen = this.isRenderFrozen();
            if (forceFrozen) {
                return;
            }
            this.renderFrozen = true;

            this.mPaging.set("pageIndex", 1);
            this.setFilteredContacts();
            this.mPaging.set("totalRecords", this.filteredContacts.length);

            this.renderFrozen = forceFrozen;
            this.render();
        },

        /**
         * 联系人排序
         *
         * @param {Object} model
         */
        onContactsSort : function(model) {
            var forceFrozen = this.isRenderFrozen();
            if (forceFrozen) {
                return;
            }
            this.renderFrozen = true;

            this.mPaging.set("pageIndex", 1);
            this.setSortedContacts();

            this.renderFrozen = forceFrozen;
            this.render();
        },

        /**
         * 是否冻结页面render操作
         */
        isRenderFrozen : function() {
            return this.renderFrozen || false;
        },

        /**
         * 联系人分页。
         *
         * @param {Object} pageIndex
         * @param {Object} pageSize
         */
        onPaged : function(pageIndex, pageSize) {
            _Log("paging..." + _.keys(this.mPaging.toJSON()) + "/" + _.values(this.mPaging.toJSON()));
            var forceFrozen = this.isRenderFrozen();
            if (forceFrozen) {
                return;
            }
            this.renderFrozen = true;

            this.setPagedContacts();
            // this.checkPageSelected();

            this.renderFrozen = forceFrozen;
            this.render();
        },

        /**
         * 获取联系人列表区需要显示的联系人
         */
        listToRender : function() {
            return this.pagedContacts;
        },

        collectionDataManager : function() {
            return this.collection;
        },

        /**
         * 联系人按组过滤
         */
        setGroupedContacts : function() {
            var cdm = this.collectionDataManager();

            var groupId = _Groups.selectedGroupId();
            this.groupedContacts = cdm.filterByGroup(groupId);

            this.setSearchedContacts();
        },

        setSearchedContacts : function() {
            var cdm = this.collectionDataManager();
            if (this.mSearch.isSearching()) {
                var listToSearch = this.groupedContacts;
                var keyword = this.mSearch.get("keyword");
                this.searchedContacts = cdm.search(listToSearch, keyword);
            } else {
                this.searchedContacts = _.clone(this.groupedContacts);
            }

            this.setFilteredContacts();
        },

        /**
         * 联系人按照首字母过滤
         */
        setFilteredContacts : function() {
            var cdm = this.collectionDataManager();
            var listToFilter = this.searchedContacts;

            var initialLetter = this.mInitialLetterFilter.get("initialLetter");
            this.filteredContacts = cdm.filterByInitialLetter(listToFilter, initialLetter);

            this.setSortedContacts();
        },

        /**
         *  联系人排序
         */
        setSortedContacts : function() {
            var cdm = this.collectionDataManager();
            var listToSort = this.filteredContacts;

            if (!listToSort) {
                return;
            }

            var sortedContacts = listToSort;
            var nameSort = this.mSort.get("name");
            if (nameSort != 0) {
                sortedContacts = cdm.sortByName(listToSort, nameSort);
            }
            var emailSort = this.mSort.get("email");
            if (emailSort != 0) {
                sortedContacts = cdm.sortByEmail(listToSort, emailSort);
            }
            var mobileSort = this.mSort.get("mobile");
            if (mobileSort != 0) {
                sortedContacts = cdm.sortByMobile(listToSort, mobileSort);
            }

            this.sortedContacts = sortedContacts;

            this.setPagedContacts();
        },

        /**
         * 联系人分页
         */
        setPagedContacts : function() {
            var cdm = this.collectionDataManager();
            var listToPage = this.sortedContacts;

            var pageIndex = this.mPaging.get("pageIndex");
            var pageSize = this.mPaging.get("pageSize");
            this.pagedContacts = cdm.page(listToPage, pageIndex, pageSize);
        },

        dispose : function() {

        }
    }));

})(jQuery, _, M139);
