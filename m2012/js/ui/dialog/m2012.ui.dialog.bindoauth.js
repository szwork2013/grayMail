(function ($, _, M) {
    var superClass = M.View.ViewBase;
    var namespace = "M2012.UI.Dialog.BindOauth";

    M.namespace(namespace, superClass.extend(
        /**@lends M2012.UI.Dialog.RecentMail.prototype*/
        {
            /**
             *@constructs M2012.UI.Dialog.BindOauth
             *@extends M139.View.ViewBase
             *@param {Object} options 初始化参数集
             *@param {String} options.template 模板
             *@example
             */
            initialize: function (options) {
                options = options || {};
                this.bindOauthfunc = options.func;
                return superClass.prototype.initialize.apply(this, arguments);
            },
            template:  _.template([
                '<div class="norTips clearfix" style="padding-left:30px;">',
                    '<span class="norTipsIco"><i class="i_evernote"></i></span>',
                    '<dl class="norTipsContent">',
                        '<dt class="norTipsLine fz_16">印象笔记</dt>',
                        '<dd>未绑定</dd>',
                        '<dd class="gray mt_3">绑定印象笔记后，您在139邮箱的和笔记内容，可选择以纯文本方式保存到您的印象笔记中</dd>',
                    '</dl>',
                '</div>',
                '<div class="boxIframeBtn">',
                    '<span class="bibText">',
                        '<a id="btn_enter" href="https://app.yinxiang.com/Login.action" class="ml_15" target="_blank">进入印象笔记</a>',
                    '</span>',
                    '<span class="bibBtn">',
                        '<a class="btnSure" id="btn_bind" href="javascript:;" bh="evernote_bind"><span>立即绑定</span></a>',
                        '<a class="btnNormal" id="btn_close" href="javascript:;"><span>以后再说</span></a>',
                    '</span>',
                '</div>'].join('')),

            /**构建dom函数*/
            render: function () {
                var self = this;
                this.dialog = $Msg.showHTML(self.template,{
                    width: "485px",
                    dialogTitle: "保存到印象笔记",
                    onClose: function() {
                        self.dialog = null;
                        self.trigger('remove');
                    }
                });
                this.initEvents();
                return superClass.prototype.render.apply(this, arguments);
            },

            initEvents: function(){
                var self = this;
                $('#btn_bind').click(function(){
                    self.bindOauth();
                });
                $('#btn_enter, #btn_close').click(function(){
                    self.dialog.close();
                });
            },

            bindOauth: function(){
                var self = this;
                M139.RichMail.API.call("evernote:oauth", {}, function (res) {
                    if(res.responseData && res.responseData["code"]){
                        self.bindOauthfunc(res.responseData["code"]);
                       /*if($('#bindOauthLink').length == 0){
                            $('body').append('<form id="bindOauthLink" target="_blank" action="' + encodeURI(res.responseData["var"]["url"]) + '"></form>');
                        }
                        $('#bindOauthLink').submit();*/
                        window.open(res.responseData["var"]["url"] , "newwindow");
                        self.dialog.close();
                    }
                });
            }
        }));
})(jQuery, _, M139);