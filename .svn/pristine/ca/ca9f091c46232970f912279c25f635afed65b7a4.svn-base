/**   
* @fileOverview 飞信同窗
*/
(function (jQuery, _, M139) {

    /**
    * @namespace 
    * g3通话
    */

    M139.namespace("M2012.G3.Model", Backbone.Model.extend({

        defaults: {
            param: {}

        },
        getParam: function (newSkin) {
            var skinName = newSkin || $T.Cookie.get("SkinPath") || $App.getUserConfigInfo("skin") || "skin_xmas"; //当前皮肤
            var environment = 2; //默认环境研发线,0研发、1测试、其它生产
            if (top.location.href.indexOf("rd") > -1)
                environment = 0;
            if (top.location.href.indexOf("ts") > -1)
                environment = 1;
            var cookiepartid = $User.getPartid(); //0灰度
            cookiepartid = "undefined" == typeof cookiepartid || cookiepartid == null ? "0" : cookiepartid;
            var netSpeedServerType = $T.Cookie.get("netSpeedServerType"); //多链路
            netSpeedServerType = "undefined" == typeof netSpeedServerType || netSpeedServerType == null ? "" : netSpeedServerType;
            this.set({
                param: {
                    environment: environment,
                    partId: cookiepartid,
                    path: netSpeedServerType,
                    skin: skinName.replace("skin_", "")
                }
            })
        },
        getUrl: function (key, newSkin) {
            var url =  LinkConfig[key]["url"];
            return url +  "?sid=" + $App.getSid() + this.getParam(newSkin);
        }

    }));

})(jQuery, _, M139);
