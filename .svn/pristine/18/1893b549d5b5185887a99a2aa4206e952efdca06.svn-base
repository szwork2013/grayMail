//短信分批发送
var smsBatch = function() {
    var message = {
        TipTextMobile: "可同时发给{0}人,以逗号“,”隔开,支持向移动、联通、电信用户发送！",
        MustInputMobile: "请填写接受手机！",
        NoBatchInfo: "没有要分批发送的信息，系统将转到发送页面！",
        BatchMuchSender: "您一次最多只能发送给{0}人，{2}本次短信将分成以下{1}批发送！",
        BatchAndOthers: "第{0}批短信已经发送给{1}个人！",
        BatchSendSuccess: "第{0}批短信发送完成！",
        MobileErrorMsg: "格式错误，格式：13500001111",
        NumberAllOthers: "很抱歉，暂不支持向非移动号码发送短信",
        SmsSendUserLimit: "很抱歉，您每次最多可同时发送{0}个号码，请您删除多余号码再试！",
        InputValidateCode: "请输入图片验证码！",
        GetValidateCode: "请点击获取验证码",
        SmsSendNotComplete: "短信尚未发送完成，确定要离开此界面吗？",
        /*SaveToRecord: "您已设置自动保存往来记录",
        NotSaveToRecord: "该记录尚未自动保存",
        ConfirmSaveRecord: "您确定要自动保存自写短信往来记录吗？",*/
        SendFailure: "信息发送失败，请重试！",
		ComboUpgradeMsg: '<a href="javascript:top.$App.showOrderinfo();" style="color:#0344AE">升级邮箱</a>可添加更多！'
    };
    var me = this;
    var validateUrl = "";
    this.objRichInputBox = null;
    this.batchInfo = null;
    this.load = function() {
        if (top.Utils.PageisTimeOut(true)) {
            return;
        }
        //判断分批信息是否存在
        if (!window.top.SmsMobileNumberkind) {
            this.toSendPage();
            return;
        }
        this.batchInfo = window.top.SmsMobileNumberkind;
        if (!(this.batchInfo.all && this.batchInfo.sendData)) {
            this.toSendPage();
            return;
        }
        //呈现输入框
        this.loadRichInputBox();
        //初始化批次
        this.initBatchData();
        var map = {
            "btnSmsSend": me.sendBatchSms,
            "btnReturn": me.back,
            "btnSendMobiles": me.sendMobilesToMe,
            "btnSendContent": me.sendContentToMe,
            "aSaveBox": me.saveBox
        };
        $.each(map, function(i, f) {
            $("#" + i).click(function(e) {
                if (f) f.apply(this, arguments);
            });
        })
    }
    //呈现发送成功提示
    this.showSuccessTips = function() {
        var divSuccess = $("#successTips");
        var successTitle = $("#successTitle");
        var resultTips = "";
        var batch = Utils.queryString("batch");
        //设置发送成功提示语言
        var tipClass = "i-small-fail";
        var resultTips = "";
		this.resetBatchMuchSender();
        //批发送成功后的提示
        if (batch) {
            tipClass = "i-small-succ";
            resultTips = message.BatchSendSuccess.format(batch);
        } else {//首次分批
            tipClass = "i-small-fail";
            resultTips = message.BatchMuchSender;
        }
        //呈现结果提示信息
        $("#container>i:eq(0)").removeClass().addClass(tipClass);
        $("#successTitle").html(resultTips).show();
        divSuccess.show();
    }
	//组装发送人数超过上限的提示语
	this.resetBatchMuchSender = function(){
	    var str = "";
	    //垃圾短信过滤，屏蔽邮箱升级引导
		if (false && top.SiteConfig.comboUpgrade && top.$User.getServiceItem() != top.$User.getVipStr("20")) {//非20元套餐
			str = message.ComboUpgradeMsg;
		}
		message.BatchMuchSender = message.BatchMuchSender.format(me.batchInfo.sendData.groupLength, me.batchInfo.batch.length, str);
	}
    /*
    发送短信
    params ={ data: 发送的报文内容
    btn: 发送按钮
    container：验证码所在容器
    actionId: 行为id
    mobiles: 接收人
    successHandler: 请求成功后的回调函数
    }
    */
    this.sendSms = function(params) {
        top.addBehaviorExt({
            actionId: params.actionId,
            thingId: 0,
            moduleId: 14,
            actionType: 20
        });
        var data = params.data;
        var btn = params.btn;
        var container = params.container;
        var mobiles = params.mobiles;

        if (top.Utils.PageisTimeOut(true)) {
            return;
        }
        btn.attr({ "disabled": true, "sending": "1" });
        btn.find("span").text("发送中...");
        //验证码输入框
        var txtValidate = container.find("input:text");
        //接收号码
        mobiles = mobiles && mobiles.length > 0 ? mobiles.join(",") : top.UserData.userNumber;
        mobiles = new CommonPage().getFormatMobile(mobiles);
        data = data.replace(/<string name="validImg">(.*)<\/string>/, '<string name="validImg">{0}</string>'.format($.trim(txtValidate.val())));
        data = data.replace(/<string name="receiverNumber">[\d,]+<\/string>/, '<string name="receiverNumber">{0}</string>'.format(mobiles));
        Common.postXml({
            url: Common.getUrl("send"),
            data: data,
            error: function(err, textStatus, errorThrown) {
                btn.find("span").text("发送");
                btn.removeAttr("disabled");
                btn.removeAttr("sending");
                top.FloatingFrame.alert(message.SendFailure);
                return;
            },
            success: function(data) {
                if (data.code == "S_TIMEOUT") {
                    new CommonPage().goErrorPage();
                    return;
                }
                if (data.code == "S_OK") {
                    hideValidateArea();
                    txtValidate.attr("rel", "");
                    if (params.successHandler) {
                        params.successHandler(data);
                    }
                } else if (data.code == "FA_INVALID_PARAMETER" && data["var"].validateUrl) {
                    hideValidateArea();
                    validateUrl = data["var"].validateUrl;
                    me.batchInfo.sendData.isShowValidImg = true;
                    me.batchInfo.sendData.validateUrl = validateUrl;
                    if (txtValidate.attr("rel")) {
                        top.FloatingFrame.alert(data.summary);
                    }
                    me.showValidate(container, validateUrl);
                    me.refreshValidate(container, validateUrl);
                    me.refreshValidate(container, validateUrl);
                    txtValidate.attr("rel", "1").focus();
                } else if (top.SiteConfig.comboUpgrade && data.code ==  "SMS_DATE_LIMIT") {//日封顶
					Common.tipMaxDayMonthSend();
                } else if (top.SiteConfig.comboUpgrade && data.code == "SMS_MONTH_LIMIT") {//月封顶
					Common.tipMaxDayMonthSend(true);
                } else {
                    var doc = document;
                    top.FF.alert(data.summary, function() {
                        if (me.batchInfo.sendData && me.batchInfo.sendData.isShowValidImg) {
                            me.showValidate(container, validateUrl);
                        }
                    });

                }
                btn.removeAttr("disabled");
                btn.find("span").text("发送");
                btn.removeAttr("sending");
                //隐藏验证码
                function hideValidateArea() {
                    container.removeClass("show-rnd-code");
                    container.find(".msg-helper").hide();

                }
            }
        });
    }

    this.sendBatchSms = function(e) {
        var txtMobiles = $("#txtMobiles");
        var ddl = $("#ddlBatch");
        var btnSmsSend = $(this);
        //正在发送中不允许再次发送
        if (btnSmsSend.attr("sending") == "1") {
            return;
        }
        //全部输入号码
        var items = me.objRichInputBox.getItems();
        //正确号码
        var mobiles = [];

        //接收人为空校验
        if (items.length == 0) {
            me.tools.showFloatTips({
                container: txtMobiles.parent(),
                target: txtMobiles,
                message: message.MustInputMobile,
                handler: {
                    onFadeIn: function() {
                        ddl.css({ "visibility": "hidden" });
                    }, onFadeOut: function() {
                        ddl.css({ "visibility": "visible" });
                    }
                }
            });
            return;
        }
        //接收人格式校验
        var regMobile = new RegExp(Common.regex);
        for (var i = 0, len = items.length; i < len; i++) {
            var mobile = new CommonPage().getFormatMobile(items[i].allText);
            if (items[i].error) {
                if (!regMobile.test(mobile)) {
                    me.tools.showFloatTips({
                        container: txtMobiles.parent(),
                        target: txtMobiles,
                        message: message.MobileErrorMsg,
                        handler: {
                            onFadeIn: function() {
                                ddl.css({ "visibility": "hidden" });
                            }, onFadeOut: function() {
                                ddl.css({ "visibility": "visible" });
                            }
                        }
                    });
                    return;
                }
            }
            mobiles.push(mobile);
        }
        //至少包含一个号码
        if (mobiles.length == 0) {
            me.tools.showFloatTips({
                container: txtMobiles.parent(),
                target: txtMobiles,
                message: message.NumberAllOthers,
                handler: {
                    onFadeIn: function() {
                        ddl.css({ "visibility": "hidden" });
                    }, onFadeOut: function() {
                        ddl.css({ "visibility": "visible" });
                    }
                }
            });
            return;
        }
        //发送人数限制
        var limit = me.batchInfo.sendData.groupLength;
        if (items.length > limit) {
            me.tools.showFloatTips({
                container: txtMobiles.parent(),
                target: txtMobiles,
                message: message.SmsSendUserLimit.format(limit),
                handler: {
                    onFadeIn: function() {
                        ddl.css({ "visibility": "hidden" });
                    }, onFadeOut: function() {
                        ddl.css({ "visibility": "visible" });
                    }
                }
            });
            return;
        }
        //验证码
        var txtValidate = $("#txtValidate1");
        var code = top.encodeXML(txtValidate.val());
        if (code == message.GetValidateCode) {
            code = "";
        }
        if (!code && txtValidate.attr("rel")) {
            top.FloatingFrame.alert(message.InputValidateCode, function() {
                txtValidate.focus();
            });
            txtValidate.focus();
            return;
        }

        //开始发送
        var batchs = me.batchInfo.batch.length;
        me.sendSms({
            data: window.top.SmsMobileNumberkind.postData,
            btn: btnSmsSend,
            container: $("#trValide1"),
            actionId: 100366,
            mobiles: mobiles,
            successHandler: function() {
                //保存接收人以方便发送成功页面自动保存联系人
                if (!me.batchInfo.senders || me.batchInfo.senders.length == 0) {
                    me.batchInfo.senders = new top.Array();
                }
                var common = new CommonPage();
                $.each(mobiles, function(i, n) {
                    me.batchInfo.senders.push(common.getNoNameMobile(n));
                });
                //发送电子名片成功行为上报
                var vCard = Utils.queryString("vCard");
                if (vCard == 'myVcard') {
                    top.addBehavior("我的电子名片页-短信发送成功");
                } else if (vCard == 'contactVcard') {
                    top.addBehavior("联系人的电子名片页-短信发送成功");
                }
                //删除当前发送批次
                var selectedVal = $("#ddlBatch").val();
                for (var i = 0, len = me.batchInfo.batch.length; i < len; i++) {
                    if (me.batchInfo.batch[i].indexs == selectedVal) {
                        me.batchInfo.batch.splice(i, 1);
                        break;
                    }
                }
                //若当前批次为最后一批，则跳转到发送成功页面
                //否则继续发送下一批
                var url = window.location.href;
                if (me.batchInfo.batch.length == 0) {
                    window.location.href = "http://" + location.host + "/m2012/html/sms/sms_Success.html{0}".format(window.location.search);
                    return;
                }
                //发送下一批
                var pn = /batch=\d*/i;
                var pn1 = /sender=\d*/i;
                if (pn.test(url) || pn1.test(url)) {
                    url = url.replace(pn, "batch={0}".format(selectedVal));
                    url = url.replace(pn1, "sender={0}".format(mobiles.length));
                } else {
                    url = "{0}&batch={1}&sender={2}&batchs={3}".format(url, selectedVal, mobiles.length, batchs);
                }
                window.location.href = url;
            }
        });
    }
    //返回到发送页面
    this.back = function() {
        var win = window;
        top.FloatingFrame.confirm(message.SmsSendNotComplete, function() {
            me.batchInfo.batch = null;
            win.location.href = "/m2012/html/sms/sms_send.html?sid={0}".format(top.UserData.ssoSid);
        });
    }

    this.showSaveRecord = function() {
	    
        //首次进入分批不显示自动保存提示
        if (!Utils.queryString("batch")) {
			$("#saveRecords").parent().hide();
			return ;
        }
		var saveRecord = /saveRecord=(\d)/.exec(location.href);

        if (saveRecord && saveRecord[1] == 1) {
			$("#saveRecords").html('本批已保存到往来记录 <a href="#" id="aRecordSetting" href="javascript:void(0);">立即查看</a>');
        }
        else {
	        $("#saveRecords").html('本批记录未自动保存 <a href="#" id="aRecordSetting" href="javascript:void(0);">查看记录</a>');
        }
        $("#aRecordSetting").click(function () {
			top.FloatingFrame.confirm(message.SmsSendNotComplete, function() {
				me.batchInfo.batch = null;
				Common.openRecord(0, "sms_Record.html");
				top.FloatingFrame.close();
			});
        });
    }

    //保存到珍藏记录
    this.saveBox = function() {
        top.FloatingFrame.open("短信存到珍藏记录", "/m2012/html/sms/sms_SaveSmsToBox.html?type=1", 433, 300);
    }
    //显示验证码
    this.showValidate = function(container, url) {
        var txtValidate = container.find("input:text");
        var divValidate = container.find(".msg-helper");
        var divValidateLayer = container.find(".rnd-tip");
        var imageValidate = container.find("img");
        var linkValidate = container.find("a");
        var lineValidate = container.find("p");
        var spanValidate = container.find("span");
        var tips = message.GetValidateCode;
        if (container.html()) {
            if (container.hasClass("show-rnd-code")) {
                txtValidate.val(tips);
                txtValidate.addClass("input-default");
                return;
            }
        } else if (container.find(".msg-helper:visible").html() != null) {
            txtValidate.val(tips);
            txtValidate.addClass("input-default");
            return;
        }
        validateUrl = url;
        //刷新验证码
        me.refreshValidate(container, url);
        container.addClass("show-rnd-code");
        divValidate.show();
        txtValidate.val(tips).focus(function() {
            window.setTimeout(function() {
                if (txtValidate.val() == tips) {
                    txtValidate.val("");
                    txtValidate.removeClass("input-default");
                }
                container.addClass("show-rnd-img");
                divValidateLayer.css({ display: "block" });
                //绑定document事件
                if (!txtValidate.attr("bind")) {
                    txtValidate.attr("bind", "1");
                    $(document).click(function(e) {
                        var doms = [divValidateLayer, imageValidate, linkValidate, txtValidate, lineValidate, spanValidate];
                        var isHide = true;
                        $.each(doms, function(i, n) {
                            if (n.get(0).id == e.target.id) {
                                isHide = false;
                                return false;
                            }
                        });
                        if (isHide) {
                            $(document).unbind("click");
                            txtValidate.removeAttr("bind");
                            container.removeClass("show-rnd-img");
                            divValidateLayer.css({ display: "none" });
                        }
                    });
                }
            }, 200);
        }).blur(function() {
            if (!$(this).val()) {
                $(this).val(tips);
            }
        });
        //刷新验证码
        linkValidate.click(function() {
            me.refreshValidate(container, url);
            txtValidate.val("");
            return false;
        });
    }
    //刷新验证码
    this.refreshValidate = function(container, url) {
        if ($.trim(url).length == 0) {
            return;
        }
        validateUrl = url;
        var pn = /&rnd=\d*/;
        if (pn.test(validateUrl)) {
            validateUrl = validateUrl.replace(pn, "&rnd=" + Math.random());
        } else {
            validateUrl = validateUrl + "&rnd=" + Math.random();
        }
        container.find("img").attr("src", validateUrl);
        container.find("input:text").val("").focus();
    }
    //初始化分批信息
    this.initBatchData = function() {
        if (!Utils.queryString("batch")) {
            if (!this.batchInfo.all.length) {
                this.toSendPage();
                return;
            }
            this.batchInfo.batch = new top.Array();
            var mobiles = this.batchInfo.all;
            var maxSend = this.batchInfo.sendData.groupLength;
            var start = 0;
            var end = 0;
            var i = 0;
            maxSend = maxSend ? maxSend : 10;
            while (true) {
                start = end;
                end += maxSend;
                i++;
                if (start >= mobiles.length) {
                    break;
                }
                this.batchInfo.batch.push({ indexs: i, mobiles: mobiles.slice(start, end) });
            }
        }
        if (me.batchInfo.batch.length == 0) {
            me.toSendPage();
            return;
        }
        //呈现发送提示信息
        me.showSuccessTips();
        //呈现自动保存提示
        me.showSaveRecord();
        //初始化分批发送下拉列表
        var ddlBatch = $("#ddlBatch");
        var html = "";
        $.each(me.batchInfo.batch, function(i, o) {
            html += '<option value="{0}">第{0}批</option>'.format(o.indexs);
        });
        ddlBatch.html(html).change(function() {
            insertInputItem($(this).val());
        });
        insertInputItem(ddlBatch.val());
        //往richInputBox中插入接收人
        function insertInputItem(selectedVal) {
            me.objRichInputBox.clear();
            var batchInfo = $.grep(me.batchInfo.batch, function(o, i) {
                return o.indexs == selectedVal;
            });
            if (batchInfo && batchInfo[0] && batchInfo[0].mobiles.length > 0) {
                me.objRichInputBox.repeatable = true;
                $.each(batchInfo[0].mobiles, function(i, n) {
                    me.objRichInputBox.insertItem(n);
                });
                me.objRichInputBox.repeatable = false;
            }
        }
        //验证码显示
        if (me.batchInfo.sendData && me.batchInfo.sendData.isShowValidImg) {
            validateUrl = me.batchInfo.sendData.validateUrl;
            var container = $("#trValide1");
            var txtValidate = container.find("input:text");
            txtValidate.attr("rel", "1");
            me.showValidate(container, validateUrl);
        }
    }
    this.loadRichInputBox = function() {
        var param = {
            type: "mobile",
            container: document.getElementById("txtMobiles"),
            autoHeight: true,
            autoDataSource: true
        };
        var richBox = new RichInputBox(param);
        richBox.setTipText(message.TipTextMobile.format(me.batchInfo.sendData.groupLength));
        this.objRichInputBox = richBox;
        //去掉重复的易网号码
        richBox.change = function() {
            var hash = {};
            var number = "";
            var reg = new RegExp(Common.regex);
            var page = new CommonPage();
            $(".error").each(function() {
                number = "";
                if ($(this).html()) {
                    number = page.getNumber($(this).html().decode());
                }
                if (!number) { return false };
                if (!hash[number]) {
                    hash[number] = this;
                    return true;
                }
                $(this).parent().remove();
            });
            for (var key in hash) {
                if (reg.test(key)) {
                    $(hash[key]).css({ color: "#0000ff" });
                }
            }          
        }
    }
    //返回发送页面
    this.toSendPage = function() {
        var win = window;
        top.FloatingFrame.alert(message.NoBatchInfo, function() {
            try {
                me.batchInfo.batch = null;
            } catch (ex) { }
            win.location.href = "/m2012/html/sms/sms_send.html?sid={0}".format(top.UserData.ssoSid);
        });
    }
    this.tools = {
        getNumber: function(text) {
            var mobile = "";
            if (/(?:86)?\d{11}|/.test(text)) {
                if (text.indexOf("<") == -1) {
                    mobile = text;
                } else {
                    var reg = /<(\d+)>$/;
                    var match = text.match(reg);
                    if (match) {
                        mobile = match[1];
                    }
                }
            }
            if (mobile.length == 11) {
                mobile = "86" + mobile;
            }
            return mobile;
        },
        /*
        显示提示信息
        parm = {container:null,target:null,message:""}
        */
        showFloatTips: function(parm) {
            parm.container.css({ 'position': 'relative' });
            var handler = null;
            if (parm.handler) {
                handler = parm.handler;
            }
            var ft = new floatTips(parm.container, handler);
            ft.tips(parm.message);
            var obj = parm.target.parent();
            RichInputBox.Tool.blinkBox(obj, 'comErroTxt');
            parm.target.bind('focus', function() {
                if (ft.timeOut) {
                    ft.fadeOut(200);
                    clearTimeout(ft.timeOut);
                }
                parm.target.unbind('focus');
            });
        },
        //获取相对路径
        getRelativeUrl: function(path) {
            var url = window.location.href;
            var pn = /http(s)?:\/\//i;
            var protocol = url.match(pn)[0];
            url = url.replace(pn, "");
            url = url.lastIndexOf("/") > 0 ? url.substring(0, url.lastIndexOf("/")) : url;
            while (path.substr(0, 3) == "../") {
                path = path.substring(3);
                url = url.lastIndexOf("/") > 0 ? url.substring(0, url.lastIndexOf("/")) : url;
            }
            return protocol + url + "/" + path;
        }
    }
}
