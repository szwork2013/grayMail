/*   迷你贺卡页   */
(function (jQuery, Backbone, _, M139) {

    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace("Evocation.SetAliasName.View", superClass.extend(
    {

        popHtml:['<div class="boxIframeText" id="evocation_boxIframeText">',
                 '<div class="setname-box">',
                     '<h3>想发信时不让别人看到手机号码？</h3>',
                     '<p>您尚未设置邮箱别名。</p>',
                     '<p>',
                         '您的邮箱地址为：',
                         '<span class="c_009900 fw_b" id="evocation_email"></span>',
                     '</p>',
                     '<p >',
                         '您可以设置形如',
                         '<span class="red fw_b">example@139.com</span>',
                         '这样的邮箱别名，这样您发送邮件时，可以避免手机号码被别人看到。',
                     '</p>',
                     '<div class="pt_10">',
                         '<p class="red v-visible" id="evocation_occupy">&nbsp</p>',
                         '设置邮箱别名：',
                         '<input class="iText" id="evocation_name" type="text" />',
                         '@139.com',
                         '<p class="red v-visible" id="evocation_occupy" style="color: blue;">温馨提示：别名只能设置一次，取名要谨慎哦！</p>',
                     '</div>',
                 '</div>',
             '</div>',
             '<div class="boxIframeBtn" id="evocation_boxIframeBtn">',
                 '<span class="bibText"></span>',
                 '<span class="bibBtn">',
                     '<a href="javascript:void(0)" class="btnSure" style="margin-right:5px"  id="evocation_ok"><span>确定</span></a>',
                     '<a href="javascript:void(0)" class="btnNormal" id="evocation_cancel"><span>取 消</span></a>',
                 '</span>',
             '</div>'].join(""),

        setSuccess: [ '<div class="boxIframeText">',
                 '<div class="norTips"><span class="norTipsIco"><i class="i_ok"></i></span>',
                     '<dl class="norTipsContent">',
                         '<dt class="norTipsTitle">恭喜，邮箱别名设置成功！</dt>',
                         '<dd class="norTipsLine">您的别名邮箱地址为：<span id="evocation_setedName" class="c_009900 fw_b"></span></dd>',
                         '<dd class="norTipsLine gray">您可以使用以上邮箱地址发信，这样您就可以避免手机号码被别人看到。</dd>',
                         '<dd class="norTipsLine"><a href="javascript:$App.show(\'account\');$App.evoctionPop.close();" bh="evocation_setaliasnamesuc_more">更多设置</a></dd>',
                     '</dl>',
                 '</div>',
             '</div>',
             '<div class="boxIframeBtn">',
                 '<span class="bibText"></span><span class="bibBtn">',
                 '<a href="javascript:top.$App.evoctionPop.close();" bh="evocation_setaliasnamesuc_close" class="btnSure"><span>关 闭</span></a> ',
                 '</span>',
             '</div>'].join(""),

        setFail: ['<div class="boxIframeText">',
                 '<div class="norTips"><span class="norTipsIco"><i class="i_warn"></i></span>',
                     '<dl class="norTipsContent">',
                         '<dt class="norTipsTitle">已经设置了邮箱别名。</dt>',
                         '<dd class="norTipsLine">您的别名邮箱地址为：<span id="evocation_setedName" class="c_009900 fw_b"></span></dd>',
                         '<dd class="norTipsLine gray">您可以使用以上邮箱地址发信，这样您就可以避免手机号码被别人看到。</dd>',
                         '<dd class="norTipsLine"><a href="javascript:$App.show(\'account\');$App.evoctionPop.close();" bh="evocation_setaliasnamesuc_more">更多设置</a></dd>',
                     '</dl>',
                 '</div>',
             '</div>',
             '<div class="boxIframeBtn">',
                 '<span class="bibText"></span><span class="bibBtn">',
                 '<a href="javascript:top.$App.evoctionPop.close();" bh="evocation_setaliasnamesuc_close" class="btnSure"><span>关 闭</span></a> ',
                 '</span>',
             '</div>'].join(""),


        initialize: function (options) {
            this.issetAliasName();           //弹窗
            this.initEvents();          //初始化事件
        },

        initEvents: function () {
            var self = this;
            $('#evocation_name').bind('keyup', function () {
                $('#evocation_occupy').html('&nbsp ');
                var name = $(this).val();
                var count = name.length;
                var firstABC = /^[a-z]/;
                if (!firstABC.test(name) && name != '') {
                    $('#evocation_occupy').text('别名帐号为5-15个字符，以英文字母开头');
                } else if (count > 15 || count < 5) {
                    $('#evocation_occupy').text('别名帐号为5-15个字符，以英文字母开头');
                    name = name.slice(0, 15)
                    $(this).val(name);
                }
                if (count > 15) {
                    name = name.slice(0, 15)
                    $(this).val(name);
                }

            })

            var email = top.$User.getLoginName() + '@139.com';
            $('#evocation_email').text(email);

            $('#evocation_cancel').click(function () {
                top.BH('evocation_setaliasname_close');
                top.$App.evoctionPop.close();
            })

            $('#evocation_ok').click(function () {
                top.BH('evocation_setaliasname_ok');
                var aliseName = $('#evocation_name').val();
                var unaccess = /[^\.a-z\_\-0-9]/g;
                var firstABC = /[a-z]/;
                if (unaccess.test(aliseName)) {
                    $('#evocation_occupy').text('别名支持字符范围：0~9,a~z,“.”,“_”,“-”');
                    return;
                }else if (aliseName.length < 5 || aliseName.length > 15) {
                    $('#evocation_occupy').text('别名帐号为5-15个字符');
                    return;
                } else if (!firstABC.test(aliseName)) {
                    $('#evocation_occupy').text('必须以英文字母开头');
                    return;
                }

                self.setAliseName(aliseName);
            })

        },

        setAliseName: function (aliseName) {
            var self = this;

            M139.RichMail.API.call("user:checkAliasAction", { "alias": aliseName }, function (response) {
                if (response && response.responseData && response.responseData.code) {
                    var code = response.responseData.code;

                    if (code == "S_OK") {

                        M139.RichMail.API.call("user:updateAliasAction", { "alias": aliseName }, function (response) {
                            if (response && response.responseData) {
                                if (response.responseData.code == 'S_OK') {
                                    top.$App.trigger("userAttrChange");
                                    var content = $('#evocation_boxIframeText').parent();
                                    content.empty().append(self.setSuccess);
                                    $("#evocation_setedName").text(aliseName + "@139.com");
                                } else {
                                    $('#evocation_occupy').text(response.responseData.msg)
                                }
                            }
                        });
                        

                    } else if (code == "S_FALSE") {
                        top.M139.UI.TipMessage.show("登录超时，请重新登录", { delay: 3000 });
                    } else if (code == "967") {
                        parent.$Msg.alert(This.messages.ALIAS_USED);
                    } else {
                        var msg = response.responseData.msg || response.responseData["var"].msg || "系统繁忙，请稍后再试。";
                        $('#evocation_occupy').text(msg)
                        $('#evocation_occupy').focus();
                    }
                }
            });

        },


        /*******     别名是否存在    *********/
        issetAliasName: function () {
            var aliasName = top.$User.getAliasName();
            if (aliasName) {

                top.$App.evoctionPop = top.$Msg.showHTML(this.setFail, {
                    dialogTitle: "设置邮箱别名",
                    width: 500
                });
                $("#evocation_setedName").text(aliasName);
                $('#evocation_setedName').parents('.boxIframe').eq(0).find('a.CloseButton').click(function () {
                    top.BH('evocation_setaliasnamesuc_close')
                });
            } else {
                this.popWindow();
                $('#evocation_boxIframeText').parents('.boxIframe').eq(0).find('a.CloseButton').click(function () {
                    top.BH('evocation_setaliasname_close');
                })
            }

        },

        /*******     弹窗           *********/
        popWindow: function () {
            top.$App.evoctionPop = top.$Msg.showHTML(this.popHtml, {
                dialogTitle: "设置邮箱别名",
                width: 500
            });
        }

    }));
  
})(jQuery,Backbone,_,M139);