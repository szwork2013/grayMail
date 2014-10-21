/**
 *左键弹出组件
 */
;(function ($, _, M139, top) {
    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.MenuMgr";

   // CalendarReminder.createClass('MenuMgr', {
    M139.namespace(_class, superClass.extend({

    }, {
        menus: {},
        r: function (name, menu) {

            if (!this.menus[name]) {
                this.menus[name] = menu;
            }

        },
        ur: function (name) {
            if (this.menus[name]) {
                this.menus[name] = null;
            }
        },
        closeExcept: function (cid) {
            var menus = this.menus, cid = null;
            for (var item in menus) {
                if (menus[item].cid !== cid) {
                    menus[item].hide();
                }
            }
        }
    }));


})(jQuery, _, M139, window._top || window.top);