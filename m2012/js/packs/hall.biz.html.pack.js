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
    var $Msg = top.$Msg;
    var _$ = top.jQuery;
    /**
     * 邮箱营业厅-视图
     */
    M139.namespace("M2012.Hall.View", {
        /**
         * 办理业务视图
         */
        Business: superClass.extend({
            el: "body",
            events: {
                "click .i_2trid": "toggleBizDetails",
                "click .hallBizOrderBtn.btnNormal:not(.btnGrayn)": "makeOrder"
            },
            template: {
                sendSMSDialogBody: ['<div class="boxIframeText">',
                    '<p class="pl_20 mt_20">为了您的账户安全，{0}业务时，我们需要先进行短信验证。</p>',
                    '<p class="pl_20 gray">短信验证码已发送到您的手机，请注意查收。</p>',
                    '<form>', '<fieldset class="boxIframeText">',
                    '<ul class="form">', '<li class="formLine">',
                    '<label class="label">短信验证码：</label>',
                    '<div class="element">', '<div>',
                    '<input type="text" id="hall_validation_input" class="iText" style="width:201px">',
                    '<div class="red" id="hall_validation_tips" style="display:none;">验证码错误</div>',
                    '</div>', '<div style="margin-top:5px;">',
                    '<a href="javascript:void(0)" id="hall_validation_sms" class="btnNormal">',
                    '<span>重新获取短信验证码<em id="hall_validation_time_container">(<em class="red" id="hall_validation_time">60s</em>)</em></span></a>',
                    '</div>', '</div>', '</li>', '</ul>', '</fieldset>', '</form>', '</div>'
                ].join('')
            },
            initialize: function () {
                superClass.prototype.initialize.apply(this, arguments);
                this.model = new M2012.Hall.Model();
                top.M139.UI.TipMessage.show("数据加载中....");
                this.getDataSource();                
                top.M139.UI.TipMessage.hide();
                M2012.Hall.View.adaptHeight();
                return this;
            },

            loading: {
                smsSend:false
            },

            bisiBehavior: {
                '1':104364, //基础业务
                '2':104489, //短信
                '3':104487, //GPRS
                '4':104707  //增值
                },
            // 渲染选项卡页
            renderTabs: function (type, refresh) {
                var self = this;
                top.brand = '';
                if (this["hasLoaded" + type] && !refresh) {
                    //已加载过数据且非刷新数据时则直接显示
                    this.showTabs(type);
                } else {
                    this["hasLoaded" + type] = false;
                    //发送请求，请求当前套餐类型下的套餐数据
                    this.model.getBusinessList(type, top.hallPhoneBrand, function (data) {
                        self["hasLoaded" + type] = true;
                        switch (type) {
                            case "1":
                            case "2":
                            case "3":
                                //通用套餐页渲染，包括基础、短信、上网等类型
                                self.renderBasicPackage(type, data);
                                break;
                            case "4":
                                //增值业务Tab页渲染
                                self.renderVASPackage(type, data);
                                break;
                        }

                        //显示TABS的当前的套餐页
                        self.showTabs(type);

                        //显示本月套餐，下月套餐，并置灰
                        self.showMyBusiness();
                    });
                }
            },
            //显示本月套餐，下月套餐，并置灰
            showMyBusiness: function () {
                if (top.hallMyBusiness) {
                    window.showMyBusiness = top.hallMyBusiness;
                    top.hallMyBusiness = null;
                }
                if (window.showMyBusiness) {
                    var bizid = window.showMyBusiness;
                    for (var i = 0; i < bizid.length; i++) {
                        $('a[bizid="' + bizid[i].businessId + '"]').unbind('click').addClass('btnGrayn')
                    }

                } else {
                    this.model.getMonthBusiness(function (data) {
                        if (data && data.businessInfo && data.businessInfo.buinessInfoList) {
                            var bizid = window.showMyBusiness= data.businessInfo.buinessInfoList;
                            for (var i = 0; i < bizid.length; i++) {
                                $('a[bizid="' + bizid[i].businessId + '"]').unbind('click').addClass('btnGrayn')
                            }
                        }

                    });
                }

            },
            // 增值业务渲染
            renderVASPackage: function (type, data) {
                if (!document.getElementById("biz_type_" + type)) {
                    $("div.hall-body").append($('<div class="mt_10 dl-appre" id="biz_type_' + type + '" name="tabpage_container"></div>'));
                }
                var rp = new Repeater($("#template_vas_body").val());
                rp.Element = document.getElementById("biz_type_" + type);
                rp.Functions = {
                    getBtnName: function (ordered) {
                        return "办理" //!ordered ? "办 理" : "退 订";
                    },
                    getBizType: function (ordered) {
                        return "1"//!ordered ? "1" : "0";
                    }
                };
                rp.DataBind(data.list);
            },
            // 通用套餐类别渲染（基础、短信、上网）
            renderBasicPackage: function (type, data) {
                if (!document.getElementById("biz_type_" + type)) {
                    //获取模板并渲染
                    $("div.hall-body").append($(M139.Text.format($("#template_basic_packages").val(), [type])));
                }
                // 设置当前套餐类型
                var curr = $("#current_pack_" + type);
                if (data["currName"]) {
                    curr.html('<span class="ml_15">您的当前套餐&nbsp;' + this.setColor(data["currName"]) + '</span><span class="ml_15">下月套餐&nbsp;' + this.setColor(data["nextName"] || "无") + '</span>');
                } else {
                    curr.hide();
                }
                //渲染套餐列表
                //var nextId = data["nextId"];
                var rp = new Repeater($("#template_basic_packages_body").val()),
                    list;
                rp.Element = list = document.getElementById("basic_packages_list_" + type);
                rp.Functions = {
                    getBtnStyle: function (id) {
                        // 基础套餐时，下月套餐类型对应的业务不能再办理（变灰色按钮）
                        return "";//(type === "0" && nextId === id) ? "btnGrayn" : "";
                    },
                    getBtnName: function (id) {
                        // 基础套餐时，不能退订该业务
                        return "办 理";//(type === "0" || nextId !== id) ? "办 理" : "退 订";
                    },
                    getBizType: function (id) {
                        return "1";//(type === "0" || nextId !== id) ? "1" : "0";
                    }
                };
                rp.DataBind(data["list"]);
                //展开第一个套餐列表项
                $(list).find("a.i_2trid:first").click();
            },
            //把含money的文本标记为彩色
            setColor: function (text) {
                return (text || "").replace(/(\d+元)/g, '<strong class="c_009900">$1 </strong>');
            },
            //显示指定的标签页
            showTabs: function (type) {
                //记录当前所在套餐页的类型
                this.currentTabs = type;
                $("div[name='tabpage_container']").hide();
                $("#biz_type_" + type).show();
            },
            //显示或隐藏业务详情
            toggleBizDetails: function (e) {
                var target = e.currentTarget,
                    row = $(target).parents(".hall-dl-list");
                row[target._expanded ? "removeClass" : "addClass"]("hall-dl-on");
                target.title = target._expanded ? "展开" : "折叠";
                target._expanded = !target._expanded;
            },
            //显示发送短信验证码的对话框
            showSendSMSDialog: function (target) {
                var self = this,
                    $target = $(target),
                    bizType = parseInt($target.attr("biztype"), 10),
                    timer, type = bizType ? "办理" : "退订";
                if (!target._smsDialog) {
                    target._smsDialog = $Msg.showHTML(M139.Text.format(this.template.sendSMSDialogBody, [type]), function (e) {
                        // 确定按钮点击操作，进行短信验证码校验
                        var input = _$("#hall_validation_input");
                        var tips = _$("#hall_validation_tips");
                        var code = (input.val() || "").trim();
                        if (!code) {
                            tips.text("请输入验证码").show();
                            input.val("").focus();
                        } else {
                            target._smsDialog.close();
                            top.M139.UI.TipMessage.show("短信验证码校验中....");
                            self.model.checkValidationCode({
                                'id': $target.attr('bizid'),
                                'verifyCode': code,
                                'productName': $target.attr('bizname')
                            }, function (data) {
                                switch(data.productOperateResultCode){
                                    case "5":  //成功办理
                                        self.doBusiness($target.attr("bizid"), $target.attr("bizname"), bizType);     // 发送业务办理请求
                                        break;
                                    case "2": //验证码错误
                                        top.FloatingFrame.alert('短信验证码输入错误，请重试');
                                        break;
                                    case "3":  //手机停机
                                        top.FloatingFrame.alert('您的手机已停机，暂不能办理业务');
                                        break;
                                    case "4"://系统错误
                                        top.FloatingFrame.alert('请求失败，请稍后重试');
                                        break;
                                    case "1": //业务已经办理
                                        top.FloatingFrame.alert('该业务已经办理！');
                                        break;
                                    case "6": //业务已经办理
                                        top.FloatingFrame.alert('您未办理此业务或已经退订成功！');
                                        break;
                                    default:
                                        top.FloatingFrame.alert('服务器出错，请稍后重试！');
                                }
                            });
                        }
                        // 阻止弹出窗口关闭
                        e.cancel = true;
                    }, {
                        dialogTitle: "业务" + type,
                        buttons: ["确定", "取消"]
                    });
                    target._smsDialog.on("close", function () {
                        // 取消按钮点击操作
                        window.clearInterval(timer);
                        target._smsDialog = null;
                    });
                    //绑定重新获取验证码按钮的点击事件
                    _$("#hall_validation_sms").click(function () {
                        if (!$(this).hasClass("btnGrayn")) {
                            //重新进入业务订单申请流程
                            top.$('#hall_validation_tips').hide();
                            self.makeOrder(target);
                        }
                    });
                }
                //重发短信验证码倒计时
                timer = this.setValidateTimer();
            },
            // 办理业务操作（短信验证码通过后操作）
            doBusiness: function (bizId, bizName, bizType) {
                var self = this;
                window.showMyBusiness = false;
                $('a[bizid="' + bizId + '"]').unbind('click').addClass('btnGrayn')
                


                var type, title = "业务" + (type = bizType ? "办理" : "退订");
                
                $Msg.alert('<dt class="norTipsTitle">您已成功' + type + bizName + '。</dt>', {
                    dialogTitle: title,
                    icon: "ok",
                    isHtml: true
                });
                // 重新加载并渲染当前套餐页
                //self.renderTabs(self.currentTabs, true);
                    

            },
            // 申请办理业务（页面办理按钮点击事件）
            makeOrder: function (e) {
                if (window.loadingSmsSend) {
                    top.FloatingFrame.alert('业务办理中，请耐心等待');
                    return;

                }
                var behaId = this.bisiBehavior[this.currentTabs];
                top.addBehaviorExt({ actionId: behaId, thingId: 1 });
                window.loadingSmsSend = true;
                var self = this,
                    target = e.currentTarget || e;
                // 发送短信验证码
                top.M139.UI.TipMessage.show("短信验证码获取中....");
                this.model.gainValidateCode(function (response) {
                    window.loadingSmsSend = false;
                    top.M139.UI.TipMessage.hide();
                    self.showSendSMSDialog(target);
                });
            },
            // 重新发送短信验证码的计时器
            setValidateTimer: function () {
                var time = 60,
                    timer;
                var container = _$("#hall_validation_time_container").show();
                var counter = _$("#hall_validation_time").text("60s");
                var sms = _$("#hall_validation_sms").addClass("btnGrayn");
                return (timer = window.setInterval(function () {
                    counter.text((time--) === -1 ? "60s" : time + "s");
                    if (time === -1 || window.reSendValidata) {
                        window.clearInterval(timer);
                        window.reSendValidata = false;
                        container.hide();
                        sms.removeClass("btnGrayn");
                    }
                }, 1000));
            },
            //取数据源
            getDataSource: function () {
                var self = this;
                if (top.hallPhoneBrand) {
                    self.initTabs(top.hallPhoneBrand); //1 :全球通 2: 动感地带 3: 神州行
                } else {
                    this.model.getBusinessType(function (data) {
                        if (data && data.phoneStateInfo && data.phoneStateInfo.brand) {
                            top.hallPhoneBrand = data.phoneStateInfo.brand
                            self.initTabs(data.phoneStateInfo.brand); //1 :全球通 2: 动感地带 3: 神州行
                        }
                    });
                }
            },
            // 初始业务类别选项卡
            initTabs: function (brandType) {
                var brandStore = [
                    [], //空
                    //1. 全球通
                    [{ id: "1", name: "基础套餐" }, { id: "2", name: "短信套餐" }, { id: "3", name: "上网套餐" }, { id: "4", name: "增值业务" }],
                    //2. 神州行
                    [{ id: "2", name: "短信套餐" }, { id: "3", name: "上网套餐" }, { id: "4", name: "增值业务" }] ,
                    //3. 动感地带
                    [{ id: "3", name: "上网套餐" }, { id: "4", name: "增值业务" }]
                ];


                var brand = brandStore[brandType];

                var self = this,
                    html = [];
                for (var i = 0, item; item = brand[i++];) {
                    html.push('<li><a><span name="' + item.id + '">' + item.name + '</span></a></li>');
                }
                var tab = $("#biz_type").html(html.join('')).find("span").click(function (e) {
                    var elem = $(e.currentTarget),
                        type = elem.attr("name");
                    $("#biz_type").find("li.on").removeClass("on");
                    elem.parents("li").addClass("on");
                    self.renderTabs(type);
                }), hash = window.location.hash,
                    curr = /^#[^#]+$/.test(hash) ? tab.filter("[name='" + hash.substring(1) + "']") : "";
                (curr.length ? curr : tab.eq(0)).click();

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
