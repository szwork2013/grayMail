(function ($, _, M139, undefined) {

    var superClass = M139.View.ViewBase;
    /**
     * 邮箱营业厅-视图
     */
    M139.namespace("M2012.Hall.View", {
        /**
         * 我的业务视图
         */
        MyBusiness: superClass.extend({
            el: "body",
            events: {
                "click .hall_title_bar": "showDetails",
                "click .i_u_close": "hideDetails",
                "click .hallBizReorderBtn.btnNormal": "reorder"
            },
            initialize: function (options) {
                superClass.prototype.initialize.apply(this, arguments);
                this.model = new M2012.Hall.Model();
                this.getDataSource();
                M2012.Hall.View.adaptHeight();
                return this;
            },
            render: function (data) {
                //通用套餐类别渲染
                var rp = new Repeater($("#template_basic").val()),
                    list;
                rp.Element = list = document.getElementById("basic");
                rp.DataBind(data.basic);
                if (data.vas) {
                    //增值业务渲染
                    rp = new Repeater($("#template_vas").val());
                    rp.Element = document.getElementById("vas");
                    rp.DataBind(data.vas);
                    $(rp.Element).show().find("a.hallBizReorderBtn").attr("name", data.vas.typeId);
                }
                var hash = window.location.hash;
                if (/^#[^#]+$/.test(hash)) {
                    //展开指定的业务详情并滚动滚动条至当前处
                    var position = $("div.hall_title_bar[name='" + hash.substring(1) + "']:first").click().parents(".hall-dl-list").position() || {};
                    $("#body").scrollTop(position.top);
                } else {
                    //展开位置排在最前面的业务详情
                    $(list).find("div.hall_title_bar:first").click();
                }
            },
            getDataSource: function () {
                var self = this;
                this.model.getMyBusiness(function (data) {
                    self.render(data);
                });
            },
            //更换套餐
            reorder: function (e) {
                //跳转到办理业务页面
                window.location.href = "business.html#" + e.currentTarget.name;
            },
            //展开业务详情
            showDetails: function (e) {
                $(e.currentTarget).css("cursor", "default").parent().addClass("union-dd-on").find("div.tips.union-tips").show();
            },
            //隐藏业务详情
            hideDetails: function (e) {
                var row = $(e.currentTarget).parents(".union-dd");
                row.find("div.tips.union-tips").hide();
                row.find("div.hall_title_bar").removeClass("union-dd-on").css("cursor", "pointer");
            }
        }),
        // 自适应调节高度
        adaptHeight: function () {
            // 设置内容区域高度
            $("#body").height($(document.body).height() - $("#title").outerHeight(true));
            $(window).resize(function () {
                $("#body").height($(document.body).height() - $("#title").outerHeight(true));
            });
        }
    });

})(jQuery, _, M139)