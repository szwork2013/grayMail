/**
 * @fileOverview 定义用管中心升级提示的组件
 */

;(function ($, _, M139) {

    var superClass = M139.View.ViewBase;

    M139.namespace("M2012.UI.Tip.UmcUpgradeTip.View", superClass.extend({

        initialize: function (options) {
            return superClass.prototype.initialize.apply(this, arguments);
        },
        
        template: ['<div class="upload_tips_body">',
        '<p class="upload_tips_txtDescribe">恭喜您已获得<span class="orange">5</span>福分，升级互联网通行证领取吧，更有机会拿<span class="orange">100元话费</span>好礼</p>',
        '<p class="txt_uploadBtn">',
          '<em class="look_long_btn">',
            '<em>',
              '<a id="btnUpgrade" href="javascript:void(0)" style="height:35px;line-height:35px" class="look_mail">马上领取</a>',
            '</em>',
          '</em>',
        '</p>',
      '</div>'].join(''),


        initEvents: function () {
            var _this = this;
        },

        render: function () {
            var _this = this;
            if (top.UmcUpgradeTip) {
                return;
            }
         //   top.UmcUpgradeTip = true;
            $BTips.addTask({
                title: "玩邮箱账号，升安全达人",
                content: this.template,
                //bhShow:{ actionId: 102421, thingId: 3, moduleId: 19 },
                //bhClose:'上线tips关闭',
                timeout: 1000 * 20,

                onclick: function(event, instance) {
                    if (event && event.target && event.target.id == "btnUpgrade") {
                        _this.upgrade();
                    }
                }

            });

            _this.initEvents();
            return _this;
        },

        upgrade: function () {
            var TO_UPDATE = 1;
            var reqData = { optype: TO_UPDATE };
            var url = M139.HttpRouter.getUrl("umc:rdirectCall").replace("/setting/", "/mw2/setting/");
            url = $Url.makeUrl(url, reqData);
            window.open(url);
        }
    }));

})(jQuery, _, M139);