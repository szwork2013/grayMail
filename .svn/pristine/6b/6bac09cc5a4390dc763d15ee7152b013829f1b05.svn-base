/**
* @fileOverview 信纸成功页视图层--主视图
* @namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Compose.View.Success.MailNotify', superClass.extend(
    {
        elModule: $("#randomModule"),
        
        mailNotifyTemple: [ '<div class="writeOk_vip clearfix">',
                    '<img src="../images/global/arrivalsNew.png" alt="" title="">',
                    '<div class="writeOk_vip_right">',
                        '<strong>有新邮件时，免费短信通知</strong>',
                        '<p class="writeOk_vip_btn"><a class="btnSetG" href="javascript:;"><span>立即开启</span></a></p>',
                    '</div>',
                '</div>'].join(""),
        mailNotifySucTemple:[ '<div class="writeOk_boxOther clearfix">',
                    '<i class="i_ok_min"></i>',
                    '<div class="writeOk_boxOther_right">',
                        '<strong>开启成功</strong>',
                        '<p>有新邮件时，{number}将收到短信提醒</p>',
                    '</div>',
                '</div>'].join(""),
        mailNotifyFailTemple:[ '<div class="writeOk_boxOther clearfix">',
                    '<i class="i_warn_min"></i>',
                    '<div class="writeOk_boxOther_right">',
                        '<strong>网页君开小差啦，保存不成功</strong>',
                        '<p class="mt_10"><a href="javascript:;" class="btnSetG"><span>重新开启</span></a></p>',
                    '</div>',
                '</div>'].join(""),
        initialize: function () {
            this.render();
            return superClass.prototype.initialize.apply(this, arguments);
        }, 
        render:function(){ //别名设置          
            var self = this;             
            self.elModule.html(self.mailNotifyTemple).show().find('a').click(function(){
                top.BH('send_email_notify');
                self.openMailNotify();
            });           
        },
        
        openMailNotify:function(){
            //恶心的发送数据，没有文档，todo
            var self = this;
            var data = [{
                notifyid:2,
                enable:true,
                notifytype:1,
                fromtype:0,
                supply:false,
                timerange:[{
                    begin:8,
                    end:22,
                    weekday:'1,2,3,4,5,6,7',
                    discription:'每天，8:00 ~ 22:00',
                    tid:'tid_0_0_0'
                }],
                emaillist:[]
            },
            {
                notifyid:1,
                enable:true,
                notifytype:1,
                fromtype:1,
                supply:false,
                timerange:[{
                    begin:8,
                    end:22,
                    weekday:'1,2,3,4,5,6,7',
                    discription:'每天，8:00 ~ 22:00',
                    tid:'tid_1_1_0'
                }],
                emaillist:[]
            }];

            top.M139.RichMail.API.call("user:updateMailNotify", { "mailnotify": data }, function (response) {
                var res = response.responseData;
                if(res.code == "S_OK"){
                    top.$App.closeNewWinCompose();
                    var html = $T.format(self.mailNotifySucTemple,{number:top.UserData.userNumber.slice(-11)})
                    self.elModule.html(html);
                }else{
                    self.elModule.html(self.mailNotifyFailTemple).find('a').click(function(){
                        self.openMailNotify();
                    });
                }
            });
        }
    }));
})(jQuery, _, M139);

