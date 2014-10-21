/**
* @fileOverview 实现设置页的显示，点链接跳到相应的设置页面，设置页8个tab选项的切换和相应iframe的关联。
*/
/**
*@namespace 
*实现设置页的显示，点链接跳到相应的设置页面，设置页8个tab选项的切换和相应iframe的关联。
*/


(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.Main.View', superClass.extend(
        /**
        *@lends SetView.prototype
        */
        {
            el: "body",
            events: {
                "click #btn_set": "gotoSet",
                "click #main_toolbar li": "gotoSet",
                "click #btn_account": "gotoSet",
                "click #btn_skin": "gotoSet"
            },
            initialize: function () {
                //alert("hello");
                var self = this;
                var dataSet = setModel.linkData();
                var frameModel = new FrameModel();
                setModel.on("change:tabid", function (model, tabid) {
                    frameModel.addLink(tabid, dataSet[tabid]);
                });
                return superClass.prototype.initialize.apply(this, arguments);
            },
            getTop: function () {
                return M139.PageApplication.getTopAppWindow();
            },
            gotoSet: function (type) {
                var model = $(type.currentTarget).attr("name") || type;
                this.getTop().setModel.set({ "tabid": model });
                this.getTop().$App.show(model);
                var tab = this.getTop().$("#main_toolbar").find(".tabTitle").find("li");
                var group = setModel.linkData()[model]["setgroup"];
                var len = tab.length;
                for (var i = 0; i < len; i++) {
                    if (tab.eq(i).attr("name") == group) {
                        tab.removeClass("on");
                        tab.eq(i).addClass("on");
                    }
                }
            }
        })
    );
    setView = new M2012.Settings.Main.View();
})(jQuery, _, M139);


