jQuery(function() {

    //第一个参数是通讯录的容器,第二个是手机号码文本框
    var div = $("#divLinkManSearch")[0];
    var txt = $("#txtMobile")[0];
    AddressBook.createTelStyle(div, txt);

    function setIframeSize() {
        //修复IE6页面宽度
        jQuery("body").width(jQuery(window).width());
    }
    if (jQuery.browser.msie && jQuery.browser.version < 7) {
        setIframeSize();
        jQuery(window.parent.document).find("#content").resize(setIframeSize);
        jQuery(window).resize(setIframeSize);
    }
    //a标签点击失去焦点
    jQuery("a").click(function() {
        jQuery(this).blur();
    });
    //焦点
    $("#txtMobile").focus();
    //联系人伸缩
    jQuery("#addressSwitch").click(function() {
        var toggleArea = jQuery(".addressList");
        toggleArea.toggle();
        if (toggleArea.is(":visible")) {
            jQuery(".writeWrapper").css("margin-left", "-170px");
            jQuery(".writeContent").css("margin-left", "170px");
            jQuery(this).addClass("addressSwitchOn");
            jQuery(this).removeClass("addressSwitchOff");
        }
        else {
            jQuery(".writeWrapper").css("margin-left", "0");
            jQuery(".writeContent").css("margin-left", "0");
            jQuery(this).removeClass("addressSwitchOn");
            jQuery(this).addClass("addressSwitchOff");
        }
    });
    //联系人列表伸缩
    jQuery(".addressList").find("dt").click(function() {
        var answer = jQuery(this).next();
        //jQuery(".addressList dd").hide();
        if (answer.is(":visible")) {
            answer.hide();
            jQuery(this).addClass("on");
        }
        else {
            answer.show();
            jQuery(this).removeClass("on");
        }
    });
    //右侧及细线高度自适应
    function setAddressListHeight() {
        var sizeTo = jQuery(window).height() - jQuery(".toolBar").height();
        //var sizeTo = 500;

        jQuery("#pageCompose").height(sizeTo);
        jQuery(".writeWrapper").height(sizeTo);
        jQuery(".addressSwitchWrapper").height(sizeTo);
        jQuery(".s_AddressListContent1 dl").height(sizeTo - 55);
        jQuery(".addressListContent2 iframe").height(sizeTo - 30);
        jQuery(".addressList").height(sizeTo);
    }
    setAddressListHeight();
    jQuery(window).resize(setAddressListHeight);
    $("#linkSend").click(function() {
        if (checkData()) {
            var mbs = top.SiteConfig.smsMiddleware + "sms";

            $.ajax({
                type: "post",
                contentType: "application/xml;charset:utf-8",
                url: "/mw2/sms/sms?func=sms:smsFreesend&sid=" + sid + "&rnd=" + Math.random(),
                data: String.format(PostXML["Freesend_Xml"], smsid, $("#txtMobile").val(), top.encodeXML($("#txtSignature").val())),
                dataType: "json",
                error: function(err) { top.FloatingFrame.alert(err.statusText); },
                success: function(result) {
                    if (result.code == "S_OK") {
                        setTimeout(function () {
                            location.href = String.format("sms_free_sendsuccess.html?sid={0}&rnd={1}&smsid={2}&sign={3}&iday={4}&imonth={5}&m={6}", window.top.UserData.ssoSid, Math.random(), smsid, escape($("#txtSignature").val()), result["var"].dayCanSend, result["var"].monthCanSend, escape(result["var"].mobiles));
                        }, 0);
                    } else {
                        $("#txtMobile").val(result["var"].errMobile);
                        top.FloatingFrame.alert(result.summary);
                    }
                }
            });
        }
        else {
            alert("请输入接收方手机号码！");
        }
        return false;
    });
    $("#linkBack").click(function() {
        var mb = "";
        if (top.isRichmail) {
            mb = "/sms";
        }
        location.href = top.getDomain("rebuildDomain") + mb + "/uploads/html/NewFreeSms/index.html";
        return false;
    });
});

function checkData() {
    var txtMobile = document.getElementById("txtMobile");
    if (!(txtMobile && txtMobile.value.length > 0)) {
        return false;
    }
    else {
        return true;
    }
}

//============begin CreateInputMobileChecker============
function CreateInputMobileChecker(inputMobiles, mobileNum, interval) {
    var This = this;
    var checkTimer;
    var oldVal = "";

    function getMoblieByLen(mobileList, len) {
        var mobileVal = "";
        if (mobileList.length == 0) {
            return mobileVal;
        }
        var mbolieLength = 0;
        for (var i = 0; i < mobileList.length; i++) {
            if ($.trim(mobileList[i]).length > 0) {
                mobileVal += mobileList[i];
                mbolieLength++;
                if (mbolieLength >= len) {
                    //mobileVal = $().trim(mobileVal, ",");
                    break;
                }
                mobileVal += ",";
            }
        }
        return mobileVal;
    }

    function checkInputMobile() {
        if ($.trim($(inputMobiles).val()).length > 0) {
            var mobileVal = $(inputMobiles).val();
            mobileVal = $.trim(mobileVal);
            var regex = /，/gi;
            mobileVal = mobileVal.replace(regex, ",");
            regex = /;/gi;
            mobileVal = mobileVal.replace(regex, ",");
            regex = /；/gi;
            mobileVal = mobileVal.replace(regex, ",");
            regex = /\r/gi;
            mobileVal = mobileVal.replace(regex, "");
            regex = /\n/gi;
            mobileVal = mobileVal.replace(regex, "");
            //mobileVal = $().trim(mobileVal, ",");
            var mobileList = mobileVal.split(",");
            var mbolieLength = 0;
            for (var i = 0; i < mobileList.length; i++) {
                if ($.trim(mobileList[i]).length > 0) {
                    mbolieLength++;
                }
            }

            if (mbolieLength > mobileNum) {
                oldVal = getMoblieByLen(mobileList, mobileNum);
                $(inputMobiles).val(oldVal);
                top.FloatingFrame.alert("您最多可同时发送给<span class=\"notice_font\">" + mobileNum + "</span>人，请不要超出限制，谢谢！", function() {
                    This.satrt();
                }
                    );
            }
            else {
                oldVal = $(inputMobiles).val();
                This.satrt();
            }
        }
        else {
            This.satrt();
        }
    }

    this.satrt = function() {
        if (checkTimer) {
            clearTimeout(checkTimer);
        }
        checkTimer = setTimeout(checkInputMobile, interval);
    }
}
//============end CreateInputMobileChecker============
