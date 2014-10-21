(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Groups.Nav.List";
    if (window.ADDR_I18N) {
        var PageMsg = ADDR_I18N[ADDR_I18N.LocalName].home;
    }

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        el : "#groups-nav-list",

        logger : new M139.Logger({
            name : _class
        }),

        initialize : function(options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);

            _this.mDragdrop = options.mDragdrop;
            _this.mGroupsManager = options.mGroupsManager;
            _this.childrenView = {};
            // TODO 统一切换成-->EventsAggr.Groups.keyOn("GROUPS_RESET", _this.onGroupsCreated, _this);
            // _this.collection.on("reset", _this.onGroupsReset, _this);

            EventsAggr.Groups.keyOn("GROUPS_CREATED", _this.onGroupsCreated, _this);
            EventsAggr.Groups.keyOn("GROUPS_UPDATED", _this.onGroupsUpdated, _this);
            EventsAggr.Groups.keyOn("GROUPS_DELETED", _this.onGroupsDeleted, _this);

            _EA_G.keyOn("GROUP_ADDED", _this.onGroupAdded, _this);
            _EA_G.keyOn("GROUP_EDITED", _this.onGroupEdited, _this);
            _EA_G.keyOn("GROUP_DELETED", _this.onGroupDeleted, _this);

            _EA_G.keyOn("RENDER_GROUPS", _this.renderGroups, _this);

            _EA_G.keyOn("GROUP_SELECTED", _this.onGroupSelected, _this);

            _EA_G.keyOn("LOCATE_SELECTED_GROUP", _this.locateSelectedGroup, _this);
            _EA_G.keyOn("EDIT_SEL_GROUP", _this.editSelectedGroup, _this);
            _EA_G.keyOn("DELETE_SEL_GROUP", _this.deleteSelectedGroup, _this);
        },

        editSelectedGroup: function () {
            var selGid = _Groups.selectedGroupId();
            this.childrenView[selGid].editGroup();
        },

        deleteSelectedGroup: function () {
            var selGid = _Groups.selectedGroupId();
            this.childrenView[selGid].deleteGroup();
        },

        onGroupSelected : function(data, options) {
            this.mGroupsManager.activeM139Addr();
            if (this.mGroupsManager.get("showAndAddr")) {
                this.mGroupsManager.set("showAndAddr", false);
            } else {
                this.locateSelectedGroup();
            }
        },

        locateSelectedGroup : function() {
            var $p = $("#groups-nav-list").parent();
            var itemHeight = this.$el.find("li:first").outerHeight(true);

            var scrollTop = $p.scrollTop();
            var minShowIndex = Math.ceil(scrollTop / itemHeight);
            var maxShowIndex = Math.floor((scrollTop + $p.height()) / itemHeight);

            var selectedGroupIndex = _Groups.selectedGroupIndex();
            if (selectedGroupIndex < 0) {
                selectedGroupIndex = 0;
            }
            if (selectedGroupIndex < minShowIndex || selectedGroupIndex >= maxShowIndex) {
                $p.scrollTop(selectedGroupIndex * itemHeight);
            }
        },

        onGroupAdded : function(data, options) {
            var rgc = options.renderGC;
            if (rgc == _CFG.getRenderGC("CG")) {
                var groupId = data.groupId;
                _EA_G.keyTrigger("RENDER_GROUPS", {
                    groupsId : _Groups.getGroupsId()
                });
                _EA_G.keyTrigger("SELECT_GROUP", {
                    groupId : groupId
                }, options);
            } else if (rgc == _CFG.getRenderGC("CG_Silent")) {
                _EA_G.keyTrigger("RENDER_GROUPS", {
                    groupsId : _Groups.getGroupsId()
                }, options);
            }
        },

        onGroupEdited : function(data, options) {
            var rgc = options.renderGC;
            if (rgc == _CFG.getRenderGC("UG")) {
                var groupId = data.groupId;
                _EA_G.keyTrigger("RENDER_GROUPS", {
                    groupsId : [groupId]
                }, options);
                _EA_G.keyTrigger("SELECT_GROUP", {
                    groupId : groupId
                }, options);
            }
        },

        onGroupDeleted : function(data, options) {
            var rgc = options.renderGC;
            if (rgc == _CFG.getRenderGC("DG")) {
                var groupId = data.groupId;      
                if (groupId == _Groups.selectedGroupId()) {
                    $Addr.trigger($Addr.EVENTS.LOAD_MAIN);
                }

                _EA_G.keyTrigger("RENDER_GROUPS", {
                    groupsId : [groupId]
                }, options);
                _EA_G.keyTrigger("SELECT_GROUP", {
                    groupId : _DataBuilder.allContactsGroupId()
                }, options);
            }
        },

        /**
         * 数据源重置时，重绘页面。
         */
        onGroupsReset : function() {
            this.render();
        },

        renderGroups : function(data, options) {
            _Groups.mergeGroups(_DataBuilder.buildAllGroups().toArray());
            if (options && options.renderGC) {
                var rgc = options.renderGC;
                var groupsId = data && data.groupsId;
                if (rgc == _CFG.getRenderGC("DG")) {
                    if (groupsId) {
                        this.removeChildren(groupsId);
                        return;
                    }
                }
                var rgcReset = [_CFG.getRenderGC("IC"), _CFG.getRenderGC("MC"), _CFG.getRenderGC("SC")];
                var isReset = _.contains(rgcReset, rgc);
                if (!isReset) {
                    if (groupsId) {
                        this.renderChildren(groupsId);
                        return;
                    }
                }
            }
            this.render();
        },

        removeChildren : function(groupsId) {
            var _this = this;
            _.each(groupsId, function(groupId) {
                _this.childrenView[groupId].remove();
                delete _this.childrenView[groupId];
            });
        },

        renderChildren : function(groupsId) {
            var _this = this;
            _.each(groupsId, function(gid) {
                var groupView = _this.childrenView[gid];
                var groupModel = _Groups.get(gid);
                if (!groupView) {
                    var childView = _this.childrenView[gid] = new M2012.Addr.View.Groups.Nav.Item({
                        model : groupModel,
                        id : "group-" + gid,
                        mDragdrop : _this.mDragdrop
                    });
                    var index = _Groups.indexOf(groupModel);
                    if (index > 0) {
                        _this.childrenView[_Groups.at(index - 1).get("id")].$el.after(childView.render().el);
                    } else {
                        _this.$el.prepend(childView.render().el);
                    }
                } else {
                    groupView.model = groupModel;
                    groupView.render();
                }
            });
        },

        /**
         * 有新组创建后，页面重绘
         *
         * @param {Object} data 数据
         * @param {Object} options 控制项
         */
        onGroupsCreated : function(data, options) {
            // TODO optimize: 局部刷新，无需重绘整个列表区.
            var groupId = _.last(data.groupsId) || this.collection.getSelectedGroupId();
            // EventsAggr.Groups.keyTrigger("SELECT_GROUP", _Promise.GRP_ID_ALL);
            EventsAggr.Groups.keyTrigger("SELECT_GROUP", {
                groupId : groupId
            });
            this.render();
        },

        onGroupsUpdated : function(data, options) {
            var groupId = _.last(data.groupsId) || this.collection.getSelectedGroupId();
            EventsAggr.Groups.keyTrigger("SELECT_GROUP", {
                groupId : groupId
            });
            this.render();
        },

        onGroupsDeleted : function(data, options) {
            if (this.collection.selected().length == 0) {
                EventsAggr.Groups.keyTrigger("SELECT_GROUP", {
                    groupId : _CFG.getAllContactsGid()
                });
            }

            this.render();
        },

        render : function() {
            var _this = this;
            _this.$el.empty();

            _this.childrenView = {};
            _this.collection.each(_this.addGroup, _this);

            if (_this.collection.length > 2) {
                var $noGroup = this.$("#group--2");
                var $separation = $('<li class="addr-ul-line"></li>');
                $separation.insertAfter($noGroup);
            }

            _EA_G.keyTrigger("AUTO_LOCATE_NAV");

            return _this;
        },

        addGroup : function(model) {
            var gid = model.get("id");
            var childView = this.childrenView[gid] = new M2012.Addr.View.Groups.Nav.Item({
                model : model,
                id : "group-" + gid,
                mDragdrop : this.mDragdrop
            });
            this.$el.append(childView.render().el);
        },

        dispose : function() {

        }
    }));

})(jQuery, _, M139);
