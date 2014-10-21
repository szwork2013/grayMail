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

(function ($, _, M139, undefined) {

    var superClass = M139.View.ViewBase;
    /**
     * 邮箱营业厅-视图
     */
    M139.namespace("M2012.Hall.View", {
        /**
         * index页视图
         */
        Main: superClass.extend({

            initialize: function () {
                var self = this;
                superClass.prototype.initialize.apply(this, arguments);
                self.model = new M2012.Hall.Model();

                top.M139.UI.TipMessage.show("数据加载中....");
                self.model.getUserData(function (rsp) {
                    $('#loading').remove();
                    $('#body').show();
                    self.render(rsp);
                    top.M139.UI.TipMessage.hide();
                });

                return this;
            },

            provinceShowDif: function (code) {
                switch (code) {
                    case "1":
                        $('#bill').show().attr('href', 'javascript:top.$App.showMailbox(8);');
                        $('#exchangeFee').hide();    //隐藏兑换话费
                        top.addBehaviorExt({ actionId: 104346, thingId: 1 });
                        break;
                    case "17":  //湖南省
                        $('#doBusiness').hide();     //隐藏办业务
                        $('#look_favorable').hide(); //隐藏看优惠
                        $('#exchangeFee').hide();    //隐藏兑换话费
                        //$('#biz').hide();     //隐藏我的业务
                        top.addBehaviorExt({ actionId: 104639, thingId: 1 });
                        break;
                }
                $('#bill').click(function () { top.addBehaviorExt({ actionId: 104348, thingId: 1 }); }); //历史帐单
                $('#myBusiness').click(function () { top.addBehaviorExt({ actionId: 104349, thingId: 1 }); }); //我的业务 -- > 查看详情
                $('#exchangeFee').click(function () { top.addBehaviorExt({ actionId: 104351, thingId: 1 }); }); //兑换话费
                $('#doBusiness').click(function () { top.addBehaviorExt({ actionId: 104355, thingId: 1 }); }); //办业务
                $('#payFee,#fullFee').click(function () { top.addBehaviorExt({ actionId: 104352, thingId: 1 }); }); //充话费
                $('#look_favorable').click(function () { top.addBehaviorExt({ actionId: 104356, thingId: 1 }); }); //看优惠
            },


            render: function (rsp) {
                var self = this;
                var data = rsp //this.model.get("data");  //总数据
                if (data.phoneStateInfo && data.phoneStateInfo.phoneState && data.phoneStateInfo.phoneState.brand) {
                    top.hallPhoneBrand = data.phoneStateInfo.phoneState.brand;
                }
                setTimeout(function () {
                    self.showTotalBalance(data)         //话费余额渲染
                    self.showIntegral(data)             //积分余额渲染
                    self.showServicePackages(data)      //渲染套餐余量
                    self.showBusiness(data)             //渲染我的业务
                    self.doBussiness(data)              //右侧办业务
                    self.provinceShowDif(top.$User.getProvCode());   //省份差异
                }, 200);

                M2012.Hall.View.adaptHeight();
            },


            //话费余额渲染
            showTotalBalance: function (data) {
                var totalBalance = data["availBalance"];
                if (totalBalance == "S_ERROR" || totalBalance === "") {
                    $("#balance").parent().html('话费余额获取失败');
                } else {
                    $("#balance").text(totalBalance);
                    if (totalBalance < 5) {
                        $('#fullFee').show();
                        $("#balance").css('color', 'red');
                    }
                }
            },

            //积分余额渲染
            showIntegral: function (data) {
                var integral = data['integral'];
                var point = data['phoneStateInfo'].brand == '3' ? 'M值' : '积分';
                if (integral == "S_ERROR" || integral === "") {
                    $("#points").parent().html('积分（M值）获取失败');
                } else {
                    $("#points").parent().html('我的' + point + ':<strong class="c_009900 c_jf" id="points">' + integral + '</strong>');
                }
            },

            //渲染套餐余量
            showServicePackages: function (data) {
                var packageList = data["packageInformationBean"];

                if (packageList && packageList['list'] && packageList['list'].length != 0) {
                    $("#packages").parent().show();

                    var packages = packageList['list'];
                    var imageType = [
                        { img: "sj.png", unit: '分钟' },
                        { img: "gprs.png", unit: 'MB' },
                        { img: "mes.png", unit: '条' },
                        { img: "wlan.png", unit: 'MB' }
                    ];
                    var html = [""];
                    var listType;
                    for (var i = 0; i < packages.length; i++) {
                        listType = packages[i]['type'];
                        html.push([
                            '<tr>',
                                '<td>',
                                    '<img src="../../images/module/hall/' + imageType[listType].img + '" alt="' + imageType[listType].text + '" /> ',
                                    packages[i]['currName'],
                                '</td>',
                                '<td> ',
                                    '剩余 <span class="fz_18 c_009900">' + packages[i]['leftFlow'] + '</span>',
                                    imageType[listType]['unit'],
                                 '</td>',
                            '</tr>'].join(''));
                    }
                    $("#packages").html(html.join(''));
                }

            },

            //渲染我的业务
            showBusiness: function (data) {
                var infoBean = data["businessInfoBean"];
                if (infoBean && infoBean.retcode == "S_OK") {
                    if (infoBean && infoBean.packageList && infoBean.packageList.length != 0) {
                        var business = infoBean["packageList"];
                        top.hallMyBusiness = business;
                        if (business[0].businessType) {
                            var bizList = {
                                "1": "",
                                "2": "",
                                "3": "",
                                "4": ""
                            }
                            for (var i = 0; i < business.length; i++) {
                                var j = business[i].businessType || '0';
                                bizList[j] += '<p>';
                                bizList[j] += business[i].businessName;
                                if (business[i].businessPrice) {
                                    bizList[j] += business[i].businessPrice;
                                }
                                bizList[j] += '</p>';

                            }
                            var typeName = ['', '<b>基础套餐</b>', '<b>服务功能</b>', '<b>梦网增值</b>', '<b>其他</b>']
                            for (i in bizList) {
                                if (bizList[i]) {
                                    $('#bizShow').append('<tr><td colspan="2">' + typeName[i] + '</td></tr>')
                                    $('#bizShow').append('<tr><td colspan="2">' + bizList[i] + '</td></tr>');
                                }
                            }
                        } else {
                            var item = ''
                            for (var i = 0; i < business.length; i++) {
                                item += ('<p>' + business[i].businessName + '</p>');
                                if (i && i%2) {
                                    $('#bizShow').append('<tr><td colspan="2">' + item + '</td></tr>');
                                    item = ''
                                }
                            }
                        }
                        
                    } else {
                        $('#bizShow').html('<tr><td colspan="2">尊敬的用户，目前您还未办理任何业务。</td></tr>')
                    }
                } else {
                    $('#bizShow').html('<tr><td colspan="2">我的业务数据获取失败，请稍后重试！</td></tr>')
                }
            },

            //右侧办业务
            doBussiness: function (data) {
                //手机状态有返回
                if (data['phoneStateInfo'] && data['phoneStateInfo']['retcode'] == "S_OK") {
                    top.hallPhoneBrand = data['phoneStateInfo']['phoneState']['brand'];
                    if (data['phoneStateInfo'] && data['phoneStateInfo']['phoneState'] && data['phoneStateInfo']['phoneState']['status'] == 1) {//我滴个乖乖，这报文设计得也忒冗余了
                        $('#doBusiness').attr('href', 'business.html');
                    }else{
                        $('#doBusiness').click(function () {
                            $(this).replaceWith('<span class="ad-b">您的余额不足或已<br>停机，暂时无法办<br>理业务</span>')
                        });
                    }
                //手机状态返回失败
                } else {
                    if (data['availBalance'] > 0) {
                        $('#doBusiness').attr('href', 'business.html');
                    }else{
                        $('#doBusiness').click(function () {
                            $(this).replaceWith('<a title="" class="ad-a"><img src="../../images/module/hall/no.png" width="142" height="96" alt="" /></a>')
                        });
                    }
                }
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
