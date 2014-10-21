/**   
* @fileOverview 注销
*/
(function (jQuery, _, M139) {
    /**
    *@namespace 
    *注销MODEL层
    */

    M139.namespace("M2012.Service.Logoff.Model", Backbone.Model.extend({

        defaults: {
    },
    message: {
        pwdError: "密码错误",
        savaError:"服务器繁忙，请稍后再试"
    },
    callApi: M139.RichMail.API.call,
    submitData: function (opitions, callback) {
        this.callApi("user:cancelMailboxAction", opitions, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    getUrlObj: function () {
        var urlObj = $T.Url.getQueryObj();
        return urlObj;
    }


}));

})(jQuery, _, M139);

﻿
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Service.Logoff.View', superClass.extend({
        initialize: function () {
            this.model = new M2012.Service.Logoff.Model();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        render: function () {
            var obj = this.model.getUrlObj();
            this.initEvents(obj);
            $("#daysCount").text(obj.daysCount);
            $("#addrsCount").text(obj.addrsCount);
            $("#mailsCount").text(obj.mailsCount);
            $("#mailAddr").text(obj.mailAddr);
            $("#aliasAddr").text(obj.aliasAddr);
        },
        initEvents: function (obj) {//初始化事件
            var self = this;
            this.submitData(obj);
            this.mainBoxEvent();
        },
        submitData: function (obj) {
            var self = this;
            $("#btnSure").click(function () {
                var radio = $("#mainBox input[name=radioLogout]");
                var input = $.grep(radio, function (n, i) {
                    return $(n).attr("checked")
                })
                var perennially = $(input).attr("perennially")
                var pwd = $("#verifyPassword").val();
                if (pwd == "") {
                    top.$Msg.alert("请输入密码",
                                {
                                    dialogTitle: "系统提示",
                                    icon: "warn"
                                });
                    return;
                }
                var options = {
                    comefrom: "2",
                    password: pwd,
                    perennially: perennially
                }
                self.model.submitData(options, function (result) {
                    var code = result.code;
                    if (code == "S_OK") {
                        var img = new Image();
                        img.src = getDomain("webmail") + '/logout/Logout.aspx?sid=' + sid;
                        $("#mainBox").removeClass("canceldiv").addClass("canceldiv2").html(self.templateLogoffSuccess());

                    } else {
                        top.$Msg.alert(self.model.message.savaError,
                                {
                                    dialogTitle: "系统提示",
                                    icon: "warn"
                                });

                    }
                });
            });
        },
        mainBoxEvent: function () {
            var self = this;
            $("#mainBox").click(function (e) {
                var target = e.target;
                if (target.id == "sendFeedback") {
                    console.log($("#otherReason").val());
                    $(this).find("#mainInfo").html(self.templateFeedback());
                }
                if (target.id == "closeWindow") {
                    window.close();
                }
            });
        },
        templateLogoffSuccess: function () {
            var html = ['<div id="mainInfo"><div class="imgInfo cencelokinfo">',
            '<span class="imgLink"><i class=" i_ok"></i></span>',
            '<dl>  ',
            '<dt>您的注销申请已受理</dt>',
            '<dd>成功后，信息将通过短信发送到您的手机<br />',
            '<a href="javascript:;" id="closeWindow">关闭该页</a>',
            '</dd>',
            '</dl>',
            '</div>',
            '<div class="cancelso hide">',
            '<p>请选择您注销的原因，以便我们改进：</p>',
            '<p><input type="checkbox" key="0" value="" id="reason1" class="mr_5" /><label for="reason1" class="mr_15">速度慢</label>  <input type="checkbox" value="" key="1" id="reason2" class="mr_5" /><label for="reason2" class="mr_15">垃圾邮件多</label> <input key="2" type="checkbox" value="" class="mr_5" id="reason3" /><label for="reason3">界面不友好</label></p>',
            '<p>其他：<input type="text" value="" id="otherReason" class="verify_txt" style="height:22px;" /></p>',
            '<div class="cancelsofoot"><a href="javascript:;" id="sendFeedback" class="bntmin">确 定</a></div>',
            '</div></div>',
            '<div class="btnfooter">',
            '<br /><span class="fz_14">重新开通邮箱：</span>访问 <a target="_blank" href="http://mail.10086.cn">http://mail.10086.cn</a> 开通 ;  发短信 KTYX 到 1065 8139<br />&nbsp;</div>'].join("");
            return html;
        },
        templateFeedback: function () {
            var html = ['<div class="cancelso pb_20" style="padding-top:20px;">',
            '<p class="fz_14"><i class=" i_ok mr_5"></i>感谢您的反馈，我们会努力</p>',
            '</div>'].join("");
            return html;
        }
    }));
    var logoffView = new M2012.Service.Logoff.View();
    logoffView.render();

})(jQuery, _, M139);
