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
