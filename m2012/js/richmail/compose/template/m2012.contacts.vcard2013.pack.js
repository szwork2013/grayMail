
(function(){

var prefix = ['<p style="margin:0; padding:0; font-size:12px;">你好！</p>',
            '<p style="margin:0; padding:0; font-size:12px; text-indent:2em; margin-bottom:20px;" class="td-2 mb-20">这是',
            '<span style="font-weight: bold;color: #1E6900;">{name}</span>的电子名片。',
            '<a hideFocus="1" id="btnsavebusiness" style="width:94px;height:28px;overflow:hidden;display:none;background:url({srchost}/images/sing_sg2.png) no-repeat -57px -0px;vertical-align:middle;margin-left:10px;"></a>',
            '</p>'].join("");

function getVCard(param){
    var self = this;

    var data = {
        sd: "",
        tempName: "SelfCard"
    };

    if(param.sd){
        data.sd = param.sd;
    }

    top.M139.RichMail.API.call("addr:getVCard", data, function (e) {
        param.success(e.responseText);
    });
}

$composeApp.on('extmailload', function(args) {

    getVCard({
        sd: args.param.sd,
        success: function(html){
            if(!html){
                top.M139.UI.TipMessage.hide();
                top.M139.UI.TipMessage.show('电子名片加载失败', { delay: 2000 });
                return;
            }

            var contactname = $(html).find('#dzmp_unm').html();
            var srchost = top.$App.getResourcePath();
            var content = html.replace('unknow_s','');  //个性签名没有的话，结果中会带有unknow_s字段
            
            var htmlPrefix = M139.Text.Utils.format(prefix, {
                name: contactname,
                srchost: srchost
            });

            content = htmlPrefix + content + '<div style="clear:both;"><br></div>';
            $composeApp.trigger("mailcontentload", {
                'content': content
            });

            if (args.param.receiver) {
                $composeApp.trigger("mailreceiverload", {
                    "to": args.param.receiver
                });
            }
            
            $composeApp.trigger("mailsubjectload", {
                subject: M139.Text.Html.decode(contactname) + '的电子名片'
            });

            if (args.param.sd) {
                $composeApp.trigger("mailsignload", {
                    onsign: function(htmlEditorView, mainView) {
                        htmlEditorView._setDefaultSign();
                    }
                });
            }

            if (args.param.receiver) {
                $composeApp.trigger("mailreceiverload", {
                    "to": args.param.receiver
                });
            }

        }
    });

});

}());

