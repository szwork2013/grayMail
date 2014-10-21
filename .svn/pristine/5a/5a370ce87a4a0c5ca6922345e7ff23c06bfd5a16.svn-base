/**
 *当鼠标移出下拉菜单区域时,左键弹出组件关闭
 *不修改父类公共的组件,使用继承覆盖的方式
 */
;(function ($, _, M139, top) {
    var superClass = M2012.UI.PopMenu;
    var _class = "M2012.Calendar.View.CalendarPopMenu";//我的地盘
    M139.namespace(_class, superClass.extend({
        initialize: function (options) {
        },
        create : function (options) {
            var menu = M2012.UI.PopMenu.create(options);
            this.initEvents(menu);
        },
        initEvents: function(menu) {
            $(menu.el).hover(function() {
            },function() {
                // 移出事件
                menu.remove();
            });
        }
    }));
})(jQuery, _, M139, window._top || window.top);

/**公共的提醒方式组件**/
(function ($, _, M139, top) {
    var superClass = M2012.UI.DropMenu;
    var _class = "M2012.Calendar.View.CalendarDropMenu";//我的地盘
    M139.namespace(_class, superClass.extend({
        initialize: function (options) {
        },
        create : function (options) {
            // create方法中调用了M2012.UI.PopMenu.create(options)
            var that = M2012.UI.DropMenu.create(options);
            this.initEvents(that);
            return that;
        },
        initEvents: function(that) {
            // 父类方法中点击图标之后,menu对象才会赋值
            that.$el.click(function(){
                $(that.menu.el).hover(function() {
                },function() {
                    // 移出事件,that.menu表示popmenu
                    that.menu.remove();
                });
            });
        }
    }));
})(jQuery, _, M139, window._top || window.top);
