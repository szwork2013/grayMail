(function($, _, M) {

    var superClass = M2012.Addr.Collection.Base;
    var _class = "M2012.Addr.Collection.Groups.List";

    M.namespace(_class, superClass.extend({

        name : _class,

        model : M2012.Addr.Model.Groups.Item,

        initialize : function() {
            // tips: Bind gloal events here will hanlder n(= instance numbers) times.
            //         so gloal events register in listenBroadcastEvents()
            superClass.prototype.initialize.apply(this, arguments);
            this.selectedId = null;
        },

        /**
         * 监听全局事件。 
         */
        listenBroadcastEvents : function() {
            EventsAggr.Groups.keyOn("SELECT_GROUP", this.selectGroup, this);
        },

        /**
         * 选择组操作。 
         */
        selectGroup : function(data, options) {
            this.unselectAll();
            var groupId = data.groupId;
            this.selectedId = groupId;
            this.get(groupId).set("selected", true);
            EventsAggr.Groups.keyTrigger("GROUP_SELECTED", data, options);
        },

        /**
         * 合并组。 
         */
        mergeGroups : function(mergeGroups) {
            var _this = this;
            $.each(mergeGroups, function(index, mergeGroup) {
                var gid = mergeGroup.get("id");
                if (_this.selectedId == gid) {
                    mergeGroup.set("selected", true, {
                        silent : true
                    });
                }
                var group = _Groups.get(gid);
                if (group) {
                    group.set(mergeGroup.toJSON());
                } else {
                    _Groups.add(mergeGroup, {
                        at : index
                    });
                }
            });
            var groupIds = this.getModelsId(_Groups.models);
            var mergeIds = this.getModelsId(mergeGroups);
            var deleteIds = _.difference(groupIds, mergeIds);
            $.each(deleteIds, function (index, delId) {
                _Groups.remove(_Groups.get(delId));
            });
        },

        getModelsId : function(models) {
            return _.map(models, function (model) {
                return model.get("id");
            });
        },

        /**
         * 获取所有选择的组 
         */
        selected : function() {
            return this.where({
                selected : true
            });
        },

        /**
         * 获取当前选中的组 
         */
        selectedGroup : function() {
            return this.get(this.selectedId);
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
            return this.selectedId;
        },

        /**
         * 取消所有选择的组 
         */
        unselectAll : function() {
            _.each(this.selected(), function(model) {
                model.set("selected", false);
            });
            this.selectedId = null;
        },

        /**
         * 获取所有组id 
         */
        getGroupsId : function() {
            var ids = [];
            this.each(function(model) {
                ids.push(model.get("id"));
            });
            return ids;
        },

        /**
         * 获取所有联系人组id 
         */
        allContactsGroup : function() {
            return this.get(_DataBuilder.allContactsGroupId());
        },

        /**
         * 获取vip联系人组id 
         */
        vipGroup : function() {
            return this.get(_DataBuilder.vipGroupId());
        }
    }));

})(jQuery, _, M139);
