(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.AndAddr.View.Contacts.List";
    if (window.ADDR_I18N) {
        var PageMsg = ADDR_I18N[ADDR_I18N.LocalName].home;
    }

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        // el : "#and-contacts-list #contacts-list",

        logger : new M139.Logger({
            name : _class
        }),

        templateLoadContactsMsg : _.template($('#tpl-load-and-contacts-msg').html()),

        initialize : function(options) {
            superClass.prototype.initialize.apply(this, arguments);

            var _this = this;
            
            this.mPaging = options.mPaging;
            this.mSelector = options.mSelector;

            // 无联系人时的消息显示区
            this.$msgPanel = $("#and-contacts-list").find("#contacts-list-msg");
            // 联系人显示区
            this.$listContainer = $("#and-contacts-list").find("#contacts-list-container");

            this.collection.on("reset", this.resetContacts, this);
            this.collection.on("change:selected", this.changeSelected, this);

//            // 无联系人时的消息显示区
//            _this.$msgPanel = $("#contacts-list-msg");
//            // 联系人显示区
//            _this.$listContainer = $("#contacts-list-container");
//
            // 跨页选择
            // 取消选择
            _EA_AND_C.keyOn("UNSELECT_ALL", this.unselectAll, this);
            // 当页全选择
            _EA_AND_C.keyOn("SELECT_PAGE", this.selectPage, this);
            // 当页取消选择
            _EA_AND_C.keyOn("UNSELECT_PAGE", this.unselectPage, this);

            // 分页
            this.mPaging.on("change:pageIndex", this.pageContacts, this);

            // 选择组时，刷新联系人列表
            _EA_AND_G.keyOn("AND_GROUP_SELECTED", this.onGroupSelected, this);

            // 重设列表区高度
            _EA_AND_C.keyOn("RESET_CONTACTS_LIST_HEIGHT", this.setContactsListHeight, this);


            // 页面窗口大小调整时，重设列表区高度
            $(window).resize(function() {
                _this.setContactsListHeight();
            });
        },

        changeSelected : function(mContact, selected) {
            if (selected) {
                this.collection.selectContacts([mContact]);
            } else {
                this.collection.unselectContacts([mContact]);
            }

            this.mSelector.set("selectedNum", this.collection.getSelectedNum());

            this.checkPageSelected();
        },

        /**
         * 计算并设置联系人列表高度 
         */
        setContactsListHeight : function() {
            // 动态计算列表区的高度
            var $rootPanel = $("#and-contacts-list");
            var $target = $rootPanel.find(".addr-list");

            // 工具栏区高度
            var toolbarHeight = $rootPanel.find("div.addr-btngroup").height();
            // 联系人列表头高度
            var contactsHeaderHeight = $rootPanel.find("#contacts-header").height();

            // 页面固定占用的高度
            var fixedHeight = toolbarHeight + contactsHeaderHeight + 20;

            var windowHeight = $(window).height();
            $target.height(windowHeight - fixedHeight);

            // 判断是否有滚动条。如果有，调整联系人列表样式
            $target.scrollTop(1);
            if ($target.scrollTop() > 0) {
                $target.removeClass().addClass("addr-list bgPadding_left");
                $target.scrollTop(0);
            } else if ($target.scrollTop() == 0) {
                $target.removeClass().addClass("addr-list bgPadding");
            }
        },

        resetContacts : function() {
            var _this = this;
            var pageContactsNum = this.collection.length;
            var num = 0;
            $.each(this.collection.selectedIds(), function(i, cid) {
                var mContact = _this.collection.get(cid);
                if (mContact) {
                    mContact.set("selected", true);
                    num++;
                }
                if (num >= pageContactsNum) {
                    // break;
                    return false;
                }
            });

            this.render();
        },

        render : function() {
            this.$el.empty();

            if (this.collection.length == 0) {// 列表区没有联系人的情况
                _EA_AND_C.keyTrigger("NO_CONTACTS_RENDER");

                var noContactsView = new M2012.AndAddr.View.Contacts.NoContacts().render();
                this.$msgPanel.html(noContactsView.el);
                this.$msgPanel.show();
                this.$listContainer.hide();
            } else {// 列表区有联系人
                _EA_AND_C.keyTrigger("CONTACTS_RENDERED");

                this.checkPageSelected();

                this.collection.each(this.addContact, this);

                this.$msgPanel.hide();
                this.$msgPanel.empty();
                this.$listContainer.show();

                this.setContactsListHeight();
            }

            return this;
        },

        addContact : function(mContact) {

            var vContact = new M2012.AndAddr.View.Contacts.Item({
                model : mContact,
//                mSelector : this.mSelector,
//                collection : this.collection,
//                parentView : this,
                id : "and-contact-" + mContact.get("id")
            });
            this.$el.append(vContact.render().el);
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
            var _this = this;
            var pageSelected = this.collection.every(function(contact) {
                return _this.collection.isSelected(contact.getId());
            });

            this.mSelector.set("pageSelected", pageSelected);
        },

        /**
         * 取消选择全部选中的联系人
         */
        unselectAll : function() {
            var _this = this;
            this.collection.each(function(contact) {
                var contactId = contact.getId();
                if (_this.collection.isSelected(contactId)) {
                    contact.set("selected", false);
                }
            });

            this.collection.unselectAll();

            this.mSelector.set({
                selectedNum : 0,
                pageSelected : false
            });
        },

        /**
         * 选择整页联系人
         */
        selectPage : function() {
            var _this = this;
            this.collection.each(function(contact) {
                var contactId = contact.getId();
                if (!_this.collection.isSelected(contactId)) {
                    contact.set("selected", true);
                }
            });
//            this.mSelector.set({
//                pageSelected : true
//            });
        },

        /**
         * 取消选择整页联系人
         */
        unselectPage : function() {
            var _this = this;
            this.collection.each(function(contact) {
                var contactId = contact.getId();
                if (_this.collection.isSelected(contactId)) {
                    contact.set("selected", false);
                }
            });
//            this.mSelector.set({
//                pageSelected : false
//            });
        },

        /**
         * 显示组联系人
         *
         * @param {Object} groupId
         */
        onGroupSelected : function(data, options) {
            _EA_AND_C.keyTrigger("UNSELECT_ALL");
            this.mPaging.set("pageIndex", 0, {silent : true});
            this.mPaging.set("pageIndex", 1);
//            this.loadContacts(this.loadContactsSuccess, this.loadContactsError);
        },

        loadContacts: function (success, error) {
            if (_Local_And_Addr) {
                _T_Load_And_Contacts(success, error, {
                    context : this,
                    isSucceed : true,
                    groupId : _AndGroups.selectedGroupId(),
                    pageIndex : this.mPaging.get("pageIndex")
                });
            } else {
                this.loadingContacts();
                var url = top.$Url.makeUrl("andAddr:readGroupContacts", {
                    groupId : _AndGroups.selectedGroupId(),
                    pageIndex : this.mPaging.get("pageIndex"),
                    pageSize : this.mPaging.get("pageSize")
                });
                top.M2012.Contacts.API.call(url, {}, success, {
                    scope : this,
                    httpMethod : "get",
                    error : error
                });
            }
        },

        loadContactsSuccess : function(response) {
            var respData = response.responseData;
//            respData = null;
            if (respData && respData.code && respData.code == "S_OK") {
                // 显示主列表区
                if (window.$Addr) {
                    var master = window.$Addr;
                    master.trigger(master.EVENTS.LOAD_MAIN);
                }

                var data = respData["var"];
                var totalNum = data.totalNum;
                var contactsList = data.dataList;
                this.collection.reset(contactsList);
                this.mPaging.set("totalRecords", totalNum);
            } else {
                // TODO log error
                this.loadContactsError();
            }
        },

        loadingContacts : function() {
            this.$msgPanel.html(this.templateLoadContactsMsg());
            this.$msgPanel.find("#and-contacts-loading").show();
            this.$msgPanel.find("#and-contacts-loadError").hide();
            this.$msgPanel.show();
            this.$listContainer.hide();
        },

        loadContactsError : function() {
            this.$msgPanel.html(this.templateLoadContactsMsg());
            this.$msgPanel.find(".Reload-andGroups").on("click", function() {
                // reselect the selected group
                var group = _AndGroups.selectedGroup();
                group.set("selected", false, {silent : true});
                group.set("selected", true);
            });
            this.$msgPanel.show();
            this.$listContainer.hide();
        },

        pageContacts : function() {
            this.loadContacts(this.loadContactsSuccess, this.loadContactsError);
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

        dispose : function() {

        }
    }));

})(jQuery, _, M139);
