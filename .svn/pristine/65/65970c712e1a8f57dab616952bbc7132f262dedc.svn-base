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
