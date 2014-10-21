
(function ($, _, M) {

var superClass = M.Model.ModelBase;
var _class = "M2012.Addr.Model.Import.Common";

function getDelay() {
    return Math.floor(Math.random() * 4500) + 1500;
}

/**
* 导入公共模型
*/
M.namespace(_class, M.Model.ModelBase.extend({

    name: _class,
    timer: false,

    initialize: function() {
        return superClass.prototype.initialize.apply(this, arguments);
    },

    eventHandler : function(result, options) {
        function onload() {
            options.success.call(options, { batchid: options.batchid });
            top.$App.off("contactLoad", onload);
        }

        function onerror() {
            if (_.isFunction(options.error)) {
                options.error.call(options, result);
            }
        }

        var _this = this;
        var batchOperId = options.batchid;
        _this.logger.debug("querystatus", result);

        if (result.status !== 200) {
            onerror();
            return;
        }

        var responseData = result.responseData;

        if (responseData.ResultCode == "0") {
            //0:完成1:处理中2:失败 3:超时失效 5 批次不存在 32769 处理中
            var status = responseData["LoadStatus"];
            var isCancel = false;

            if (_.isFunction(options.process)) {
                isCancel = options.process.call(options, status, responseData, batchOperId);
            }

            if (isCancel) {
                window.clearTimeout(_this.timer);
                return;
            }

            if (status === "0") {
                window.clearTimeout(_this.timer);

                top.$App.on("contactLoad", function () {
                    //重新点击导入按键时，原window已被删除，此时window对象应做判断，防止出现undefined
                    if (window) {
                        setTimeout(function () {
                            onload();
                        }, 2000);
                    }
                });
                top.$App.trigger("change:contact_maindata");
                
            } else if (status === "1" || status === "32769") {
                //使用setTimeout是为了做到第一个请求回来后，才延时下一个请求，而且每次请求的间隔都是随机的
                _this.timer = window.setTimeout(function() {
                    _this.getStatus({ batchid: options.batchid, callback: function(result) {
                        _this.eventHandler(result, options);
                    }});
                }, getDelay());

            } else {
                onerror();
            }
        } else {
            onerror();
        }
    },

    queryStatus: function(options) {
        var _this = this;
        _this.getStatus({batchid: options.batchid, callback: function(result) {
            _this.eventHandler(result, options);
        }});
    },


    getStatus: function(options) {
        var api = "/addrsvr/GetBatchOperStatus";
        var params = {
            sid: top.sid,
            formattype: "json",
            rnd: Math.random()
        };

        var url = top.$Url.makeUrl(api, params);
        var data = {
            GetBatchOperStatus: {
                BatchOperId: options.batchid
            }
        };

        top.M2012.Contacts.API.call(url, data, function(result){
             options.callback(result);
        });
    }

}));

})(jQuery, _, M139);
