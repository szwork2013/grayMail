
; (function (jQuery, _, M139, top) {
    var className = "M2012.Calendar.Model.BlackWhiteList";
    M139.namespace(className, Backbone.Model.extend({
        defaults: {
            blackList: [],
            whiteList:[]
        },
        initialize: function (options) {
            this.api = M2012.Calendar.API;
        },
        callAPI: function (funcName, data, callback, onfail, onerror) {
            var _this = this;
            data = $.extend({
                comeFrom: 0 //加上默认来源
            }, data);

            var param = {
                data: data,
                success: function (responseObj, responseText) {
                    if (responseObj && responseObj.code != "S_OK") {
                        onfail && onfail(responseObj);
                    } else {
                        callback && callback(responseObj["var"], responseObj);
                    }
                },
                error: onerror
            };

            _this.api.request(funcName, param);

            //this.api(funcName, data,
            //    function (response,json) { //success
            //        if (typeof callback == 'function') {
            //            callback(response);
            //        }
            //    }, function (code, json) { //onfail, eg. code or resultcode incorrect
            //        _this.trigger("onfail");
            //        if (typeof onfail == 'function') {
            //            onfail(json);
            //        }
            //    }, function () { //onfail, eg. response is null or empty
            //        _this.trigger("onerror");
            //        if (typeof onerror == 'function') {
            //            onerror();
            //        }
            //    });
        },

        //#region 黑白名单

        //新增黑白名单
        addBlackWhiteItem: function (data, callback) {
            this.callAPI("calendar:addBlackWhiteItem", data, callback);
        },
        //删除黑白名单
        delBlackWhiteItem: function (data, callback) {
            if (typeof data == 'string') data = { uin: data };
            this.callAPI("calendar:delBlackWhiteItem", data, callback,callback);
        },
        //获取黑白名单项
        //@param {Array} uins 需要删除的uin数组
        getBlackWhiteItem: function (uins, callback) {
            if (typeof data == 'string') data = { uin: uins.join(",") };
            this.callAPI("calendar:getBlackWhiteItem", data, callback,callback);
        },
        //获取黑白名单列表
        getBlackWhiteList: function (callback) {
            var _this = this;
            _this.callAPI("calendar:getBlackWhiteList", {}, function (result, json) {
                var data = {};
                if (result) {
                    data = {
                        blacklist: result.black || [],
                        whitelist: result.white || []
                    };

                    _this.set("blacklist", data.blacklist);
                    _this.set("whitelist", data.whitelist);
                }
                callback(data);
            });
        }

        //#endregion
    }));
})(jQuery, _, M139, window._top || window.top);