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
