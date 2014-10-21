(function($, _, M) {

    EventsAggr = window.EventsAggr || {};

    if (!EventsAggr.AndAddrContacts) {
        var _this = window._EA_AND_C = EventsAggr.AndAddrContacts = {
            events : {
                RENDER_CONTACTS : "render:contacts",

                NO_CONTACTS_RENDER : "noContacts:render",
                CONTACTS_RENDERED : "contacts:rendered",

                // contacts list control events
                SELECT_PAGE : "select:page",
                UNSELECT_PAGE : "unselect:page",
                UNSELECT_ALL : "unselect:all",

                RESET_CONTACTS_LIST_HEIGHT : "reset:contactsListHeight",
                END : "END"
            }
        };

        _this.eventName = function(eventKey) {
            return _this.events[eventKey];
        };

        _this.keyTrigger = function(eventKey, data, options) {
            _this.trigger(_this.eventName(eventKey), data, options);
        };

        _this.keyOn = function(eventKey, callback, context) {
            _this.on(_this.eventName(eventKey), callback, context);
        };

        _.extend(_this, Backbone.Events);
    }

})(jQuery, _, M139);

(function ($, _, M) {

    EventsAggr = window.EventsAggr || {};

    if (!EventsAggr.AndAddrGroups) {
        var _this = window._EA_AND_G = EventsAggr.AndAddrGroups = {
            events: {
                SELECT_AND_GROUP: "select:group",
                AND_GROUP_SELECTED: "group:selected",

                RENDER_GROUPS : "render:groups",
                
//                RESET_GROUPS_LIST_HEIGHT : "reset:groupListHeight",

                END : "END"
            }
        };
        _this.eventName = function (eventKey) {
            return _this.events[eventKey];
        };
        _this.keyTrigger = function (eventKey, data, options) {
            _this.trigger(_this.eventName(eventKey), data, options);
        };
        _this.keyOn = function (eventKey, callback, context) {
            _this.on(_this.eventName(eventKey), callback, context);
        };
        _.extend(_this, Backbone.Events);
    }

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.AndAddr.Model.Groups.Item";

    M.namespace(_class, superClass.extend({

        name : _class,

        defaults : {
            id : 0, // 组id
            membersNum : 0, // 组成员数
            name : '', // 组名称
            selected : false
        },

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);
        },

        getId : function() {
            return this.get("id");
        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M2012.Addr.Collection.Base;
    var _class = "M2012.AndAddr.Collection.Groups.List";

    M.namespace(_class, superClass.extend({

        name : _class,

        model : M2012.AndAddr.Model.Groups.Item,

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);
        },

        /**
         * 获取当前选中的组 
         */
        selected : function() {
            return this.where({
                selected : true
            });
        },

        unselectAll : function() {
            _.each(this.selected(), function(contact) {
                contact.set("selected", false);
            });
        },

        selectedGroup : function() {
            return this.selected()[0];
        },

        /**
         * 获取选中组的下标，从0开始 
         */
        selectedGroupIndex : function() {
            return this.indexOf(this.selectedGroup());
        },

        /**
         * 获取选中组的id 
         */
        selectedGroupId : function() {
            return this.selectedGroup().getId();
        },

        /**
         * 获取所有组id 
         */
        getGroupsId : function() {
            var ids = [];
            this.each(function(item) {
                ids.push(item.getId());
            });
            return ids;
        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.AndAddr.View.Groups.Item";

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        tagName : "li",

        logger : new M139.Logger({ name: _class }),

        template : _.template($('#tpl-andAddr-groups-item').html()),

        events : {
            "click" : "selectGroup",
            "mouseenter" : "enterGroup",
            "mouseleave" : "leaveGroup"
        },

        initialize : function(options) {
            superClass.prototype.initialize.apply(this, arguments);

            this.model.on("change:selected", this.changeSelected, this);
        },

        /**
         * 选择组 
         */
        selectGroup : function(ev) {
            ev.preventDefault();

            this.model.set("selected", true);
        },

        /**
         * 组选中状态改变时，进行样式处理 
         */
        changeSelected : function() {
            var selected = this.model.get("selected");
            this.$el.toggleClass("on", selected);

            if (selected) {
                // 因为鼠标移上的样式hover和选中的样式on放在一起有冲突，选中组时，需要移除hover的样式
                this.$el.removeClass("hover");
            }
        },

        /**
         * 鼠标移入组
         */
        enterGroup : function(ev) {
            if (!this.model.get("selected")) {
                this.$el.toggleClass("hover", true);
            }
        },

        /**
         * 鼠标移出组
         */
        leaveGroup : function(ev) {
            this.$el.toggleClass("hover", false);
        },

        /**
         * 渲染组 
         */
        render : function() {
            this.$el.html(this.template(this.model.toJSON()));

            return this;
        },

        /**
         * 销毁视图
         */
        remove: function () {
            superClass.prototype.remove.apply(this, arguments);
        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.AndAddr.View.Groups.List";
    if (window.ADDR_I18N) {
        var PageMsg = ADDR_I18N[ADDR_I18N.LocalName].home;
    }

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        el : "#andAddr-groups-container",

        events : {
          "click #andAddr-title" : "toggleAndAddr",
          "mouseenter #andAddr-title>li" : "enterSwitch",
          "mouseleave #andAddr-title>li" : "leaveSwitch"
        },

        logger : new M139.Logger({
            name : _class
        }),

        initialize : function(options) {
            superClass.prototype.initialize.apply(this, arguments);

            this.mGroupsManager = options.mGroupsManager;
            this.mUmcUser = options.mUmcUser;

            this.$groupsList = this.$("#andAddrGroups-nav-list");
            this.$title = this.$("#andAddr-title");

            this.collection.on("reset", this.render, this);
            this.collection.on("change:selected", this.changeSelected, this);
            this.mGroupsManager.on("change:showAndAddr", this.changeShowAndAddr, this);
        },

        initGroups : function() {
            var _this = this;
            top.$User.isUmcUserAsync(function(isUmcUser) {
                if (isUmcUser)  {
                    _this.loadGroups(_this.loadGroupsSuccess, _this.loadGroupsError);
                }
            });
        },

        loadGroups : function(success, error) {
            if (_Local_And_Addr) {
                _T_Load_And_Groups(success, error, {
                    context : this,
                    isSucceed : true
                });
            } else {
                _ShowTipMsg("正在加载...");
                top.M2012.Contacts.API.call("andAddr:readGroups", {}, success, {
                    scope : this,
                    httpMethod : "get",
                    error : error
                });
            }
        },

        loadGroupsSuccess : function(response) {
            var respData = response.responseData;
//            respData = null;
            if (respData && respData.code && respData.code == "S_OK") {
                var data = respData["var"];
                var groupsList = data.dataList;
                this.collection.reset(groupsList);
                this.toggleAndAddrStyle();
                _HideTipMsg();
            } else {
                // TODO log error
                this.loadGroupsError();
            }
        },

        loadGroupsError : function() {
            _HideTipMsg();
            _AlertMsg('暂时无法处理该请求，请您稍后再试。');
        },

        changeSelected : function(mContact) {
            if (mContact.get("selected")) {
                this.mGroupsManager.activeAndAddr();
                _.each(this.collection.selected(), function(mItem) {
                    if (mItem != mContact) {
                        mItem.set("selected", false);
                    }
                })
                _EA_AND_G.keyTrigger("AND_GROUP_SELECTED");
            }
        },

        toggleAndAddr : function() {
            top.BH("addr_andAddr_toggleEntrance");
            this.mUmcUser.checkUmcUser(this.onUmcUser, this);
        },

        toggleAndAddrStyle : function() {
            var toggleShow = !this.mGroupsManager.get("showAndAddr");
            this.mGroupsManager.set("showAndAddr", toggleShow);
            if (!toggleShow) {
                _EA_G.keyTrigger("SELECT_GROUP", {
                    groupId: _DataBuilder.allContactsGroupId()
                });
            }
        },

        onUmcUser : function() {
            if (this.collection.length == 0) {
                this.initGroups();
            } else {
                this.toggleAndAddrStyle();
            }
        },

        changeShowAndAddr : function() {
            var $triangle = this.$title.find(".triangle");
            $triangle.toggleClass("t_globalDown t_globalRight");
            this.$groupsList.slideToggle("fast", function() {
                _EA_G.keyTrigger("AUTO_LOCATE_NAV");
            });
        },

        /**
         * 鼠标移入组
         */
        enterSwitch : function(ev) {
            $(ev.currentTarget).toggleClass("hover", true);
        },

        /**
         * 鼠标移出组
         */
        leaveSwitch : function(ev) {
            $(ev.currentTarget).toggleClass("hover", false);
        },

        render : function() {
            var _this = this;
            _this.$groupsList.empty();

            _this.childrenView = {};
            _this.collection.each(_this.addGroup, _this);

//            _this.setGroupsListHeight();

            return _this;
        },

        addGroup : function(mGroup) {
            var gid = mGroup.get("id");
            var childView = new M2012.AndAddr.View.Groups.Item({
                model : mGroup,
                id : "and-group-" + gid
            });
             this.$groupsList.append(childView.render().el);
        },

        dispose : function() {

        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M2012.Addr.Model.Contacts.Paging;
    var _class = "M2012.AndAddr.Model.Contacts.Paging";

    M.namespace(_class, superClass.extend({

        name : _class
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.AndAddr.View.Contacts.Paging";

    M.namespace(_class, superClass.extend({

        name : _class,

        // el : "#and-contacts-list #contactsPagingBar",

        events : {
            "click a.next" : "nextPage",
            "click a.prev" : "prevPage",
            "click #page-index-caller" : "assignPageIndex"
        },

        logger : new M139.Logger({ name: _class }),

        template : _.template($('#contacts-paging').html()),

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);

            this.model.on("change:pageIndex", this.changePageIndex, this);
            this.model.on("change:maxIndex", this.changeMaxIndex, this);
            this.model.on("change:firstPage", this.changeFirstPage, this);
            this.model.on("change:lastPage", this.changeLastPage, this);
        },

        changePageIndex : function() {
            this.$("label.page-index").text(this.model.get("pageIndex"));
        },

        changeMaxIndex : function() {
            this.$("label.max-index").text(this.model.get("maxIndex"));
            this.$el.toggle(this.model.hasContacts());
        },

        changeFirstPage : function() {
            var firstPage = this.model.get("firstPage");
            var $prev = this.$("a.prev");
            $prev.toggleClass("up-gray", firstPage);
        },

        changeLastPage : function() {
            var firstPage = this.model.get("lastPage");
            var $next = this.$("a.next");
            $next.toggleClass("down-gray", firstPage);
        },

        nextPage : function(ev) {
            ev.preventDefault();
            var pageIndex = this.model.get("pageIndex");
            var maxIndex = this.model.get("maxIndex");
            if (pageIndex < maxIndex) {
                this.model.set("pageIndex", pageIndex + 1);
            }
        },

        prevPage : function(ev) {
            ev.preventDefault();
            var pageIndex = this.model.get("pageIndex");
            var maxIndex = this.model.get("maxIndex");
            if (pageIndex > 1) {
                this.model.set("pageIndex", pageIndex - 1);
            }
        },

        /**
         * 指定分页的页码。
         *
         * @param ev
         */
        assignPageIndex : function(ev) {
            ev.preventDefault();

            var _this = this;
            //显示下拉菜单
            var popup = M139.UI.Popup.create({
                target : this.$("#page-index-caller"),
                width : 135,
                buttons : [{
                    text : "确定",
                    cssClass : "btnNormal",
                    click : function() {
                        var $inputIndex = popup.contentElement.find("input:text");
                        var index = new Number($inputIndex.val());
                        var maxIndex = new Number(_this.model.get("maxIndex"));
                        if (index > maxIndex) {
                            index = maxIndex;
                        } else if (index < 1) {
                            index = 1;
                        }
                        $inputIndex.val(index);
                        _this.model.set("pageIndex", index);

                        popup.close();
                    }
                }],
                content : '<div style="padding-top:15px;">跳转到第 <input type="text" style="width:30px;"/> 页</div>'
            });
            popup.render();
            popup.contentElement.find("input:text").keyup(function(e) {
                this.value = this.value.replace(/\D/g, "");
            }).focus();
            M139.Dom.bindAutoHide({
                element : popup.contentElement[0],
                stopEvent : true,
                callback : function() {
                    popup.contentElement.remove();
                }
            });
        },

        render : function() {
            this.$el.html(this.template(this.model.toJSON()));
            if (this.model.get("totalRecords") === 0) {
                this.$el.hide();
            }
            return this;
        },

        dispose : function() {

        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M2012.Addr.Model.Contacts.Selector;
    var _class = "M2012.AndAddr.Model.Contacts.Selector";

    M.namespace(_class, superClass.extend({

        name : _class
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.AndAddr.View.Contacts.Selector";

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        // el : "#and-contacts-list #contacts-header",

        events : {
            "click #toggle-page-contacts" : "togglePageContacts",
            "click #clean-selected-contacts" : "cleanSelectedContacts"
        },

        logger : new M139.Logger({ name: _class }),

        initialize : function(options) {
            superClass.prototype.initialize.apply(this, arguments);

            this.mSelector = options.mSelector;

            this.listenEvents();
        },

        listenEvents : function() {
            this.mSelector.on("change:selectedNum", this.changeSelectedNum, this);
            this.mSelector.on("change:pageSelected", this.changePageSelected, this);
        },

        changeSelectedNum : function() {
            this.$("#selected-num").text(this.mSelector.get("selectedNum"));
            var hasSelected = !this.mSelector.noneSelected();
            this.$("#title-name").toggle(!hasSelected);
            this.$("#title-selected").toggle(hasSelected);
        },

        changePageSelected : function() {
            var hasPageSelected = this.mSelector.get("pageSelected");
            this.$("#toggle-page-contacts").prop("checked", hasPageSelected);
        },

        render : function() {
            // The content has preloaded.
            return this;
        },

        togglePageContacts : function(ev) {
//            top.BH("addr_contacts_multiPageSelect");

            var checked = $(ev.target).prop("checked");
            var key = checked ? "SELECT_PAGE" : "UNSELECT_PAGE";
            _EA_AND_C.keyTrigger(key);
        },

        cleanSelectedContacts : function(ev) {
            ev.preventDefault();

//            top.BH("addr_contacts_multiPageUnselect");

            _EA_AND_C.keyTrigger("UNSELECT_ALL");
        },

        dispose : function() {

        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.AndAddr.View.Contacts.NoContacts";

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        logger : new M139.Logger({ name: _class }),

        template : _.template($('#tpl-no-andAddr-contacts').html()),

        events : {
            "click #btnDownloadAndAddrClient" : "downloadAndAddrClient"
        },

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);
        },

        render : function() {
            this.$el.html(this.template());
            return this;
        },

        downloadAndAddrClient : function(){
            top.BH("addr_andAddr_downloadClient");
        },

        dispose : function() {

        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.AndAddr.Model.Contacts.Item";

    M.namespace(_class, superClass.extend({

        name : _class,

        defaults : {
            selected : false,
            id : "",
            name : "",
            email : "",
            mobile : ""
        },

        initialize : function(contact) {
            superClass.prototype.initialize.apply(this, arguments);
        },

        /**
         * 获取联系人id
         * @returns {*}
         *    联系人id
         */
        getId : function() {
            return this.get("id");
        },

        /**
         * 判断联系人是否已选中
         * @returns {*}
         *     联系人是否已经选中
         */
        isSelected : function() {
            return this.get("selected");
        },

        /**
         * 选中联系人
         */
        select : function() {
            this.set("selected", true);
        },

        /**
         * 取消选中联系人
         */
        unselect : function() {
            this.set("selected", false);
        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M2012.Addr.Collection.Base;
    var _class = "M2012.AndAddr.Collection.Contacts.List";

    M.namespace(_class, superClass.extend({

        name : _class,

        model : M2012.AndAddr.Model.Contacts.Item,

        selectedMap : {},

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);
        },

        /**
         * 选中联系人
         *
         * @param contacts
         *     新选中的联系人列表
         */
        selectContacts : function(contacts) {
            var _this = this;
            _.each(contacts, function(contact) {
                var id = contact.getId();
                _this.selectedMap[id] = contact;
            });
        },

        /**
         * 取消选中联系人
         *
         * @param contacts
         *     取消选中的联系人列表
         */
        unselectContacts : function(contacts) {
            var _this = this;
            _.each(contacts, function(contact) {
                var id = contact.getId();
                delete _this.selectedMap[id];
            });
        },

        /**
         * 清空选中的所有联系人
         */
        cleanSelected : function() {
            this.selectedMap = {};
        },

        /**
         * 获取当前选中的联系人数目。
         * @returns {Number}
         *     当前选中的联系人数。
         */
        getSelectedNum : function() {
            return _.keys(this.selectedMap).length;
        },

        /**
         * 当前选中的联系人列表
         * @returns {*}
         *     当前选中的联系人列表。
         */
        selected : function() {
            return _.values(this.selectedMap);
        },

        /**
         * 获取当前选中的联系人id列表
         * @returns {Array}
         *     当前选中的联系人id列表
         */
        selectedIds : function() {
            return _.keys(this.selectedMap);
        },

        /**
         * 获取已选中联系人对象
         * @returns {*}
         *     已选中联系人对象
         */
        getSelectedMap : function() {
            return this.selectedMap;
        },

        /**
         * 根据联系人id判断当前联系人是否已经选中。
         * @param contactId
         *     联系人id
         * @returns {boolean}
         *     联系人是否选中
         */
        isSelected : function(contactId) {
            return this.selectedMap[contactId] != undefined;
        },

        /**
         * 取消选择所有已选中的联系人。
         */
        unselectAll : function() {
            this.cleanSelected();
        }
    }));

})(jQuery, _, M139);

(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.AndAddr.View.Contacts.Item";
    if (window.ADDR_I18N) {
        var PageMsg = ADDR_I18N[ADDR_I18N.LocalName].home;
    }

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        tagName : "tr",

        logger : new M139.Logger({ name: _class }),

        template : _.template($('#tpl-andAddr-contact-item').html()),

        events : {
            "click div.Edit-link" : "showContactDetail", // 编辑联系人详情
            "mouseenter" : "enterView", // 鼠标移入联系人
            "mouseleave" : "leaveView", // 鼠标移出联系人
            "click input[:checkbox].toggle-contact" : "toggleContact" // 切换联系人选中状态
        },

        initialize : function(options) {
            superClass.prototype.initialize.apply(this, arguments);

            this.model.on("change:selected", this.changeSelected, this);
        },

        /**
         * 切换联系人选中状态。
         *        当联系人选中时，退出编辑状态
         *
         * @param {Object} model
         */
        changeSelected : function() {
            var selected = this.model.get("selected");
            this.$selector().prop("checked", selected);
            this.$el.toggleClass("on", selected);
        },

        /**
         * 选择联系人checkbox元素的jQuery对象 
         */
        $selector : function() {
            return this.$("input[:checkbox].toggle-contact");
        },

        /**
         * 设置鼠标移上时样式
         *
         * @param {Object} ev
         */
        enterView : function(ev) {
            ev.preventDefault();
            this.$el.addClass("hover");
        },

        /**
         * 设置鼠标移出时样式
         *
         * @param {Object} ev
         */
        leaveView : function(ev) {
            ev.preventDefault();
            this.$el.removeClass("hover");
        },

        showContactDetail : function(ev) {
            ev.stopPropagation();

            top.BH("addr_andAddr_clickContact");

            $Addr.trigger('redirect', {
                key : 'andAddr_showContactDetail',
                contactId : this.model.getId()
            });
        },

        /**
         * 切换联系人选择状态。
         *
         * @param {Object} ev
         */
        toggleContact : function(ev) {
//            top.BH("addr_contacts_multiPageSelect");

            var checked = $(ev.target).prop("checked");
            this.model.set("selected", checked);
        },

        /**
         * 渲染页面视图
         */
        render : function() {
            var renderObj = _.extend(this.model.toJSON());
            var groups = renderObj.groups = [];
            _.each(this.model.get("groupsId"), function(groupId) {
                groups.push(_AndGroups.get(groupId).get("name"));
            });

            this.$el.html(this.template(renderObj));

            // 设置联系人的选中样式
            this.$el.toggleClass("on", this.model.get("selected"));

            return this;
        },

        /**
         * 销毁视图
         */
        remove : function() {
            superClass.prototype.remove.apply(this, arguments);
        }
    }));

})(jQuery, _, M139);

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

