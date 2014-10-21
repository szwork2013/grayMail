(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.GroupsManager";

    M.namespace(_class, superClass.extend({

        name : _class,

        el : "div.addr-p-list",

        logger : new M139.Logger({ name: _class }),

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);

            this.model.on("change:activeGroupType", this.changeActive, this);
            // 因为页面是动态滑动，导航高度需要等滑动完成之后再计算。
//            this.model.on("change:showAndAddr", this.changeShowAndAddr, this);
            _EA_G.keyOn("AUTO_LOCATE_NAV", this.changeShowAndAddr, this);

            var _this = this;
            $(window).resize(function() {
                _this.changeShowAndAddr();
            });
        },

        changeShowAndAddr : function() {
            var slideDown = this.model.get("showAndAddr");
            var $rootPanel = this.$el;
            var $innerPanel = this.$("div.addr-ul-list");
            if (slideDown) {
				// 兼容360
                //var navHeight = $("#addr-groups-nav").height();
                $rootPanel.css({
                    "overflow-y": "",
                    "height" : ""
                });
                $innerPanel.css({
                    "overflow-y": "",
                    "height" : ""
                });
                this.autoAdaptRootHeight($rootPanel);
            } else {
                $rootPanel.css({
                    "overflow-y": "",
                    "height" : ""
                });
                $innerPanel.css({
                    "overflow-y": "",
                    "height" : ""
                });
                this.autoAdaptInnerHeight($innerPanel);
            }
        },

        autoAdaptRootHeight : function($target) {
            var $parent = $target;
            //$parent.css("height", "");

            var maybeKnownHeight = 0;
            if ($("#wam_container").is(":visible")) {
                maybeKnownHeight = $("#wam_container").height() + 20;
            }
            var navHeight = $("#addr-groups-nav").height();
            var totalHeight = $("#addr-left-btns").height() + navHeight + maybeKnownHeight + 30;
            // 兼容全网、灰度群组的代码，群组全网后，删除判断
            if ($(".addr-p-tab").length > 0) {
                totalHeight += $(".addr-p-tab").height();
            }
            var windowHeight = $(window).height();
            if (totalHeight > windowHeight) {
                // var parentHeight = $parent.height();
				var parentHeight = navHeight;
                var newHeight = parentHeight - (totalHeight - windowHeight);
                $parent.height(newHeight);
                $parent.css({
                    "overflow-y": "auto"
                });
//                var itemHeight = $("#groups-nav-list").find("li:first").height();
                var footHeight = $(".addr-ul-list").height() + $("#btn-create-group").height()
                    + ($("#andAddr-title").height() + 20) + $("#andAddrGroups-nav-list").find("li:first").height()*3;
                $parent.animate({scrollTop: footHeight - newHeight + 8}, 300);
            }
        },

        autoAdaptInnerHeight : function($target) {
            var $parent = $target;
            //$parent.css("height", "");

            var maybeKnownHeight = 0;
            if ($("#wam_container").is(":visible")) {
                maybeKnownHeight = $("#wam_container").height();// + 20;
            }
            var totalHeight = $("#addr-left-btns").height() + $("#addr-groups-nav").height() + maybeKnownHeight + 38;
            var windowHeight = $(window).height();
            if (totalHeight > windowHeight) {
                var parentHeight = $parent.height();
                $parent.height(parentHeight - (totalHeight - windowHeight));
                $parent.css({
                    "overflow-y": "auto"
                });

                _EA_G.keyTrigger("LOCATE_SELECTED_GROUP");
            } else {
                $parent.css({
                    "overflow-y": "visible"
                });
            }
        },

        changeActive : function() {
            if (this.model.isM139Addr()) {
                $("#m139-contacts-list").show();
                $("#and-contacts-list").hide();

                _AndGroups.unselectAll();
            } else {
                $("#m139-contacts-list").hide();
                $("#and-contacts-list").show();

                _Groups.unselectAll();
            }
        }
    }));

})(jQuery, _, M139);
