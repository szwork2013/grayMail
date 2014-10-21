(function ($, _, M139, undefined) {

    var superClass = M139.View.ViewBase;
    var $Msg = top.$Msg;
    /**
     * 邮箱营业厅-视图
     */
    M139.namespace("M2012.Hall.View", {
        /**
         * 积分兑换页视图
         */
        Points: superClass.extend({
            el: "body",
            events: {
                "click a.ui-button.ui-button-sgreen": "onBtnClick"
            },
            initialize: function () {
                superClass.prototype.initialize.apply(this, arguments);
                this.model = new M2012.Hall.Model();
                this.getDataSource();
                M2012.Hall.View.adaptHeight();
                return this;
            },
            render: function (data) {
                //当前积分
                var currPoints = data["currPoints"];
                $("#points").text(currPoints);
                var rp = new Repeater($("#template_fee").val());
                rp.Element = document.getElementById("fee_list");
                rp.Functions = {
                    getBtnStyle: function (needPoints) {
                        return needPoints > currPoints ? "" : "ui-button-sgreen";
                    }
                };
                rp.DataBind(data["list"]);
            },
            getDataSource: function () {
                var self = this;
                this.model.getPointsInfo(function (data) {
                    self.render(data);
                });
            },
            onBtnClick: function (e) {
                var self = this,
                    elem = $(e.target),
                    name = e.target.name,
                    quota = elem.attr("quota"),
                    points = elem.attr("points");
                $Msg.confirm('<dt class="norTipsLine">确定要使用<strong class="c_ff6600">' + points + '</strong>积分兑换<strong class="c_ff6600">' + quota + '</strong>元话费吗?</dt><dd class="norTipsLine gray">兑换成功后，积分不能退还，兑换的话费将直接为您充到手机上。</dd>', function () {
                    self.model.redeemPoints({
                        name: name,
                        points: points,
                        quota: quota
                    }, function (succ) {
                        if (succ) {
                            $Msg.alert('<dt class="norTipsTitle">兑换话费成功！</dt><dd class="norTipsLine gray">您兑换的话费将在一日内充到您的手机上。</dd>', {
                                icon: "ok",
                                dialogTitle: "积分兑换话费",
                                isHtml: true
                            });
                            //重新载入数据刷新当前页
                            self.getDataSource();
                        } else {
                        	$Msg.alert("积分兑换失败，请您稍后重试。", {
                        		dialogTitle: "积分兑换话费",
                        		icon : "fail"
                        	});
                        }
                    });
                }, {
                    dialogTitle: "积分兑换话费",
                    icon: "warn",
                    isHtml: true
                });
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