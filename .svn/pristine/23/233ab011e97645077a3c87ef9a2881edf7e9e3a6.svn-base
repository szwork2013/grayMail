/**
 * 精品订阅，云邮局，日历，彩云链接
 * @example
 * M139.UI.TipMasslinkView.show();
 */
M139.core.namespace("M139.UI.TipMasslinkView", Backbone.View.extend({
    initialize: function () {
        if (!top.SiteConfig.tipsMassLink) {
            return;
        }
        this.render();

    },

    render: function () {
        var self = this;

        //帐单的TIPS
        setTimeout(function () {
            var showed = top.$App.getUserCustomInfo(50); //从一百开始
            if (showed != '1') {
                top.$App.setUserCustomInfo(50, 1, function () {
                    $App.on("showMailbox",
                        function () {
                            if (top.massLinkBill) {
                                return;
                            }
                            top.massLinkBill = true;
                            self.showBill();
                        });
                }); 
                
            }
        }, 1000)

        //精品订阅的TIPS
        setTimeout(function () {
            var isShow = self.isShowPosition()
            if (isShow) {
                var now = top.M139.Date.getServerTime();
                var year = now.getFullYear();
                var month = now.getMonth();
                if (month < 10) {
                    month = "0" + month;
                }
                var date = now.getDate();
                if (date < 10) {
                    date = "0" + date;
                }
                now = '' + year + month + date;
                top.$App.setUserCustomInfoNew({ 48: now }, function () {
                    self.showPosion('web_058');
                });
            }
        }, 30 * 1000);
    },

    isShowPosition: function () {
        var time = top.$App.getUserCustomInfo(48);
        if (!time || time.length < 8) {
            var now = top.M139.Date.getServerTime();
            var year = now.getFullYear();
            var month = now.getMonth();
            if (month < 10) { month = "0" + month; }
            var date = now.getDate();
            if (date < 10) { date = "0" + date; }
            now = '' + year + month + date;
            top.$App.setUserCustomInfoNew({ 48: now });
            return false;
        }
        time = new Date(time.slice(0, 4), time.slice(4, 6), time.slice(6, 8));
        time.setDate(time.getDate() + 3)
        var now = top.M139.Date.getServerTime();
        return time < now;
    },

    showPosion: function (postionId) {
        var htmlContent;
        top.M139.RichMail.API.call("unified:getUnifiedPositionContent", { positionCodes: postionId }, function (response) {
            if (response.responseData.code && response.responseData.code == "S_OK") {
                htmlContent = response.responseData["var"];
                htmlContent = htmlContent[postionId][0].content;

                $BTips.addTask({
                    width: 350,
                    title: '为您推荐的精品服务',
                    content: htmlContent,
                    bhClose: '关闭',
                    timeout: 10 * 1000
                });
            }
        });

        
    },

    showBill: function () {
        var content = ['<div class="imgInfo imgInfo-rb">',
                 '<dl class="events mt_10">',
                     '<dd class="gray"><a href="http://mail.10086.cn/upInbox/upInbox.html" target="_blank">尊敬的用户您好，为了让您更便捷的查看账单和订阅邮件，您现在还可以在收件箱里查看。也可以根据需要，设置成将邮件分拣到自定义目录中。</a></dd>',
                 '</dl>',
             '</div>',
             '<div class="boxIframeBtn">',
                 '<span class="bibBtn">',
                     '<a href="http://mail.10086.cn/upInbox/upInbox.html" target="_blank" class="btnSure"><span>更多详情</span></a>',
                 '</span>',
             '</div>'].join('');
        $BTips.addTask({
            width: 350,
            title: '温馨提示',
            content: content,
            bhClose: '关闭',
            timeout: 10000
        });
    }
}));

$(function () {
    setTimeout(function(){
        var tipMasslinkView = new top.M139.UI.TipMasslinkView();
    },10 * 1000)
});