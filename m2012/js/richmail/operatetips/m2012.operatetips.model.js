/**   
 * @fileOverview 运营tips
 */

(function(jQuery, _, M139) {

    /**
     * @namespace
     * 运营tips
     */

    M139.namespace("M2012.OperateTips.Model", Backbone.Model.extend({

		logger: new top.M139.Logger({
            name: "OperateTips"
        }),

        getTipsData: function(){
            return SiteConfig["unifiedPositionStatic"] ? top.NewAdLink["web_061"] : top.$App.getConfig("AdLink").tips;
        },

        /** 关闭tips请求 */
        closeRequest: function(mailid, success, error) {
            var tipsData = this.getTipsData();
            if (tipsData) {
                tipsData = tipsData[0];
            } else {
                // PNS和智能运营对接数据没有保存，关闭不用做处理
                return;
            }
            var api = "unified:updatePositionContent";
            var data = {
                //seqId: mailid,
                //type: 2
				positionCodes: "web_061",
                contentId: tipsData.contentId
            };

            var options = {
                onrouter: function (router) {
                    router.addRouter("setting", [api]);
                }
            };

            $RM.call(api, data, callback, options);

            function callback(result) {
                if (result && result.responseData) {
                    result = result.responseData;
                    if (result.code === "S_OK") {
                        if (success) success(result);
                        return true;
                    }
                }
                if (error) error(result);
                return false;
            }
        }

    }));

})(jQuery, _, M139);