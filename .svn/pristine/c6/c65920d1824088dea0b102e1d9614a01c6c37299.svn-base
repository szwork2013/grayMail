/**
 * 邮箱营业厅-模型
 */
M139.namespace("M2012.Hall.Model", Backbone.Model.extend({
    initialize : function(options) {

    },
    // 获取用户通信及业务状态数据
    getUserData : function(callback) {
        var self = this;
        
        if (top.businessHall_getUserConsumption && !top.hallReload) { //更新少，每次登录请求一次接口
            self.set("data", top.businessHall_getUserConsumption);
            callback(top.businessHall_getUserConsumption);
        } else {
            M139.RichMail.API.call("businessHall:getUserConsumption", {}, function (result) {
                var resp = result.responseData;
                if (resp && resp.code === "S_OK") {
                    self.set("data", resp["var"]);
                    top.businessHall_getUserConsumption = resp["var"];
                    top.hallReload = false;
                    callback(resp["var"]);
                } else {
                    $('#loading').hide();
                    $('#loadFail').show();
                }
            });
        }
    },
    //获取积分兑换数据
    getPointsInfo : function(callback) {
        var self = this;
        M139.RichMail.API.call("hall:getPointsInfo", {}, function(result) {
            var resp = result.responseData;
            if (resp && resp.code === "S_OK") {
                var data = resp["var"];
                self.set("currentPoints", data.currPoints);
                self.set("exchangeList", data.list);
                callback(data);
            }
        });
    },
    // 兑换积分
    redeemPoints : function(data, callback) {
        M139.RichMail.API.call("hall:redeemPoints", data, function(result) {
            var resp = result.responseData;
            if (resp && resp.code === "S_OK") {
                callback(true);
            }
        });
    },
    //办业务页面，获取自己的套餐
    getMonthBusiness: function (callback) {
        var self = this;
        M139.RichMail.API.call("businesshall:queryBusinessInfo", {}, function (result) {
            var resp = result.responseData;
            if (resp && resp.code === "S_OK") {
                callback(resp["var"]);
            }
        });
    
    },
    //获取业务类型
    getBusinessType : function(callback) {
        var self = this;
        M139.RichMail.API.call("businesshall:userStateQuery", {}, function (result) {
            var resp = result.responseData;
            if (resp && resp.code === "S_OK") {
                callback(resp["var"]);
            }
        });
    },
    // 获取可办理的业务列表
    getBusinessList : function(type, brand,callback) {
        M139.RichMail.API.call("businessHall:queryProductInfo", {
            type: type,
            brand:brand
        }, function(result) {
            var resp = result.responseData;
            if (resp && resp.code === "S_OK") {
                callback(resp["var"]);
            }
        });
    },
    //发送短信获取校验码
    gainValidateCode: function (callback) {
        M139.RichMail.API.call("businesshall:sendSmsAuthCode", {}, function (result) {
            top.M139.UI.TipMessage.hide();
            var resp = result.responseData;
            if (resp && resp.code == "S_OK" ) {
                callback();
            } else {
                window.loadingSmsSend = false;
                if (resp && resp.summary) {
                    top.FloatingFrame.alert(resp.summary)
                } else {
                    top.FloatingFrame.alert('验证码请求失败，请稍后重试！')
                }
            }
        });
    },
    //校验短信验证码
    checkValidationCode : function(code, callback) {
        setTimeout(function () {
            M139.RichMail.API.call("businesshall:productOrder", code, function (result) {
                top.M139.UI.TipMessage.hide();
                var resp = result.responseData;
                if (resp && resp.code == "S_OK") {
                    callback(resp['var']);
                } else if (resp && resp.summary) {
                    top.FloatingFrame.alert(resp.summary)
                } else {
                    top.FloatingFrame.alert('系统出错，请稍后重试')
                }
            });
        }, 200);
    },
    //办理业务
    doBusiness : function(bizId, bizType, callback) {
        setTimeout(function() {
            callback({
                result : 1
            });
        }, 2000);
    },
    // 获取我的业务列表
    getMyBusiness : function(callback) {
        M139.RichMail.API.call("hall:getMyBusiness", {}, function(result) {
            var resp = result.responseData;
            if (resp && resp.code === "S_OK") {
                var datas = resp["var"], basic = [], vas = [], data, type;
                while ( data = datas.shift()) {
                    type = data.typeId;
                    ((type == "0" || type == "1" || type == "2") ? basic : vas).push(data);
                }
                datas = {};
                datas.basic = basic;
                if (vas.length) {
                    datas.vas = vas[0].list;
                    datas.vas.typeId = vas[0].typeId;
                }
                callback(datas);
            }
        });
    }
}));
