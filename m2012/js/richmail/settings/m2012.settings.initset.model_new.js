/**
* @fileOverview 定义设置页基本参数的文件.
*/


    (function (jQuery, _, M139) {
        /**
        *@namespace 
        *设置页基本参数
        */
        M139.namespace('M2012.Settings.Initset.Model_New', Backbone.Model.extend(
        /**
        *@lends M2012.Settings.Initset.Model.prototype
        */
    {
    defaults: {
    },
    callApi: M139.RichMail.API.call,
	getUserinfo: function (callback) {
        this.callApi("guide:getUserinfo", {}, function (result) {
            if (callback) { callback(result.responseData); }
        });
    },
    gotoMail: function () {
        location.href = domainList.global.mail+"/login/sso.aspx?sid="+sid;
    },
    serverCheckAlias: function (alias, callback) {
        var data = { "alias": alias };
        M139.RichMail.API.call("user:checkAliasAction", data, function (response) {
            callback(response.responseData);
        });
    },
    clientCheckStr: function (text) {
        var message = this.messages.cantEdit;
        var resultCode = 0;
    //    console.log($.trim(text)=="");
        if ($.trim(text) == "") {
            message = this.messages.aliasStrLength; //空是允许的
            resultCode = 0;
        }else if (/\s/.test(text) ||                 //空格
                /[^A-Za-z0-9_\-\.]/.test(text)) {  //其他字符
            message = this.messages.aliasStrRange;
            resultCode = 1;
        }else if (/^[^A-Za-z]\w*/.test(text)) {
            message = this.messages.aliasEnStart; //开头非字母
            resultCode = 2;
        }else if (text.length < 5 || text.length > 15) {
            message = this.messages.aliasStrLength;
            resultCode = 3;
        }
        if (resultCode == 0) {
            return { code: "S_OK", msg: message, resultCode: resultCode };
        }else {
            return { code: "FA_FALSE", msg: message, resultCode: resultCode };
        };
    },
    setUserinfo: function (options, callback) {
        this.callApi("guide:setUserinfo", options, function (result) {
            if (callback) { callback(result.responseData); }
        });
    },
    messages: {
        saveSuccess: "您的设置已保存",
        saveError: "服务器繁忙，请稍后再试",
        aliasCanUse: "保护我的手机隐私",
        aliasStrRange: "别名支持字符范围：0~9,a~z,“.”,“_”,“-”",
        aliasEnStart: "必须以英文字母开头",
        aliasStrLength: "别名帐号为5-15个字符，以英文字母开头",
        sendNameError: "让发件人知道我是谁",
        picFormatError: "头像上传失败，支持小于1M的jpg、jpeg、gif、bmp、png图片",
        cantEdit: "只能设置一次，保存后不能修改",
        defaultAlias: "例:zhangsan"
    }
}))
    })(jQuery, _, M139);