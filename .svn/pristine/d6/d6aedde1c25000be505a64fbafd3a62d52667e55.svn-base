
(function(){

var html1 = [ '<table width="510" align="center" style="border-collapse:collapse;">',
    '<tr>',
        '<td bgcolor="#4F7CBF" height="43" style="margin;0;padding:0;border-radius:3px 3px 0 0"><img src="{srcpath}/mail_invite_01.png" alt="139邮箱" style="margin-left:20px;display:block;" ></td>',
    '</tr>',
    '<tr>',
        '<td bgcolor="#FFFFFF" height="43" style="border:1px solid #DDD;">',
            '<div style="padding:25px">',
            '<div style="color:#333;margin:0 0 15px 0;padding:0;font-size:12px; line-height: 20px;">hi，我已经添加您为通讯录好友了，{mytip}有空常联系哦~</div>',
            '<table leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" style="border-collapse: collapse;">',
                '<tr>',
                    '<td><img rel="signImg" style="width:52px;height:52px" width="52" height="52" src="{myphoto}" alt="{myname}"></td>',
                    '<td><p style="color:#333;font-size:12px;padding-top:5px;margin:0 0 0 10px;">{myname}<br><a href="mailto:{myemail}" style="color:#0464c6;text-decoration:none;display:block;margin-top:10px;">{myemail}</a></p></td>',
                '</tr>',
            '</table>',
            '</div>',
        '</td>',
    '</tr>'].join("");

var html2 = [ '<tr>',
        '<td bgcolor="#F9F9F9" height="43" style="border:1px solid #ddd;"><div style="padding:25px">',
            '<span style="color:#333;margin:0;padding:0;line-height:22px;font-size:12px"> 139邮箱具有电信级安全保证，提供更安全、更稳定的通讯保障，让您随时随地享受更多贴心服务，您值得拥有！</span>',
            '<table leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width="100%" style="border-collapse: collapse;margin-top:10px;">',
                '<tr>',
                    '<td height="70" style="border-top:1px dashed #DDDDDD"><img src="{srcpath}/mail_invite_02.png" alt="手机号就是邮箱号"></td>',
                    '<td height="70" style="border-top:1px dashed #DDDDDD"><p style="color:#333;font-size:14px;padding-top:5px;margin:0 0 0 5px;">手机号就是邮箱号<br><span style="color:#666;display:block;margin-top:7px;font-size:12px;">省去记忆长串字母数字邮箱地址的烦恼。</span></p></td>',
                '</tr>',
                '<tr>',
                    '<td height="70" style="border-top:1px dashed #DDDDDD"><img src="{srcpath}/mail_invite_03.png" alt="邮件到达，免费短信通知" ></td>',
                    '<td height="70" style="border-top:1px dashed #DDDDDD"><p style="color:#333;font-size:14px;padding-top:5px;margin:0 0 0 5px;">邮件到达，免费短信通知<br><span style="color:#666;display:block;margin-top:7px;font-size:12px;">新邮件到达免费短信通知，更可通过回复短信直接回复邮件。</span></p></td>',
                '</tr>',
                '<tr style="">',
                    '<td height="70" style="border-top:1px dashed #DDDDDD;border-bottom:1px dashed #DDDDDD;"><img src="{srcpath}/mail_invite_04.png" alt="移动话费账单，免费送达" ></td>',
                    '<td height="70" style="border-top:1px dashed #DDDDDD;border-bottom:1px dashed #DDDDDD;"><p style="color:#333;font-size:14px;padding-top:5px;margin:0 0 0 5px;">移动话费账单，免费送达<br><span href="javascript:;" style="color:#666;display:block;margin-top:7px;font-size:12px;">每月免费投递移动话费账单到139邮箱，让您明白消费，轻松理财。</span></p></td>',
                '</tr>',
            '</table>',
            '<table leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width="100%" style="border-collapse: collapse;margin-top:10px;border-radius:0 0 3px 3px;">',
                '<tr>',
                    '<td><p style="font-size:12px;color:#333;margin:0;padding:0;line-height:22px;">139邮箱开通方式：<br>方式一：短信注册开通（发送 <span style="color:#e70000">KTYX</span> 到 <span style="color:#115ac7">10086</span> 即可免费开通）<br>方式二：登录 <span style="color:#115ac7">mail.10086.cn</span> 免费注册</p></td>',
                '</tr>',
                '<tr>',
                    '<td style="text-align:center;"><center><a target="_blank" href="http://mail.10086.cn/s?func=umc:rdirectTo&_fv=5&optype=2" style="border:0;background:#5381C5;border-radius:3px;color:white;font-size:14px;width:90px;height:28px;font-weight:bold;margin-top:20px;cursor:pointer;display: block;line-height: 28px;text-decoration: none;">立即体验</a><center></td>',
                '</tr>',
            '</table>',
        '</div></td>',
    '</tr>'].join("");

$composeApp.on('extmailload', function(args) {

    top.M2012.Contacts.getModel().getUserInfo({}, function(result) {
        var srchost = top.$App.getResourceHost();
        var srcpath = srchost + '/m2012/images/module/addr';

        var defPhoto = top.$App.getResourcePath() + '/images/face.png';
        var photo = result['var']['ImageUrl'];

        if (_.isEmpty(photo)) {
            photo = defPhoto;
        } else {
            photo = srchost + photo;
        }

        var email = args.param.contactemail;
        var name = args.param.contactname;
        var html = html1;
        var viewdata = {
            myname: M139.Text.Utils.htmlEncode(top.$User.getSendName()),
            myemail: M139.Text.Utils.htmlEncode(top.$User.getDefaultSender()),
            myphoto: M139.Text.Utils.htmlEncode(photo),
            mytip: "",
            srcpath: srcpath
        };

        //非139本域联系人，增加注册引导
        if (top.$App.getMailDomain() != top.$Email.getDomain(email)) {
            viewdata.mytip = "推荐您使用139邮箱，";
            html += html2;
        }

        html = M139.Text.Utils.format(html, viewdata);

        $composeApp.trigger("mailcontentload", {
            content: html + "</table>"
        });

        $composeApp.trigger("mailreceiverload", {
            "to": top.$Email.getSendText(name, email)
        });

        $composeApp.trigger("mailsubjectload", {
            subject: "新朋友的来信，请及时查收"
        });
    
    });

});

}());

