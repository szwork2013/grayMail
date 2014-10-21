/**
 * @fileOverview 我的应用
 */
(function (jQuery, _, M139) {

    /**
     * @namespace
     * 我的应用
     */

    M139.namespace("M2012.Health.Model",Backbone.Model.extend({
        defaults:{
            HealthyHistory: {
                'totalScore': '',
                'isTrustForwardMail': '',
                'isTrustAutoLogin':'',
                'lastUpdateTime':""
            },
            HealthyInfo: {
                "userNumber":"13557539290",
                "passwordStrength":"-1",
                "passwordStrengthScore":"10",
                "passwdProtect":"-1",
                "passwdProtectScore":"10",
                "pilferDate":"-1",
                "pilferDateScore":"5",
                "loginException":"-1",
                "loginExceptionScore":"5",
                "forwardMail":"-1",
                "forwardMailScore":"-1",
                "trustForwardMail":"-1",
                "virusScan":"-1",
                "virusScanScore":"-1",
                "autoLogin":"-1",
                "autoLoginScore":"-1",
                "trustAutoLogin":"-1",
                "umcUser":"-1",
                "umcUserScore":"-1",
                "limitCapacity":"-1",
                "limitCapacityScore":"-1",
                "limitAllMail":"-1",
                "limitAllMailScore":"-1",
                "limitUnread":"-1",
                "limitUnreadScore":"-1",
                "limitAdvert":"-1",
                "limitAdvertScore":"-1",
                "limitDraft":"-1",
                "limitDraftScore":"-1",
                "limitDiskCapacity":"-1",
                "limitDiskCapacityScore":"-1",
                "expireLargeattach":"-1",
                "expireLargeattachScore":"-1",
                "setAlias":"-1",
                "setAliasScore":"-1",
                "setSendName":"-1",
                "setSendNameScore":"-1",
                "setBirthday":"-1",
                "setBirthdayScore":"-1",
                "setImage":"-1",
                "setImageScore":"-1",
                "bindingPhone":"-1",
                "bindingPhoneScore":"-1",
                "totalScore":"-1",
                "isLoad":"-1"
            }
        },
        initialize: function(){
            var self = this;
            M139.RichMail.API.call("healthy:getHealthyHistory", {},function(data){
                var msg = data.responseData;
                if(msg['code'] == 'S_OK'){
                    self.set('HealthyHistory', msg['var']);
                }else{
                    top.$App.showSessionOutDialog();
                }
            });
        }
    }));

})(jQuery, _, M139);


/**
 * @fileOverview 我的应用
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;

    /**
     * @namespace
     * 我的应用
     */

    M139.namespace('M2012.Health.View', superClass.extend({

        /**
         *@lends M2012.Myapp.View.prototype
         */
        el: '#healthyHistory',
        initialize: function () {
            var self = this;
            top.LinkConfig.health = { url: "health.html", group: "health", title: "邮箱健康度"};
            this.model = new M2012.Health.Model();
            //$(this.el).append(this.config.fourTest());
            this.first = true;
            self.model.on('change:HealthyHistory',function(){
                if(self.first != true){
                    self.render();
                }else{
                    self.first = false;
                }
            });
            (function autoTest(){
                if(typeof healthView != 'undefined'){
                    healthView.testHealth();
                }else{
                    setTimeout(autoTest, 300);
                }
            })();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        config: {
            fourTest : function(){
                return ['<p class="mtInfoTxt">139邮箱体检从四大维度进行扫描评分，帮助用户提升操作体验。建议定期体检。</p>',
                    '<ul class="mtOption clearfix mt_20">',
                    '<li><i class="i-safeTest"></i><p>安全检测</p></li>',
                    '<li><i class="i-riskTest"></i><p>风险检测</p></li>',
                    '<li><i class="i-saveTest"></i><p>存储检测</p></li>',
                    '<li><i class="i-dataTest"></i><p>个人资料检测</p></li></ul>'].join('');
            },
            statusText: ['邮箱君整体健康状况不错，杠杠滴！',
                '邮箱君整体健康状况一般般，请立即根据提示进行相关修复！',
                '邮箱君存在严重的健康隐患，请立即根据提示进行相关修复！'],
            testing: {
                'passwordStrength': [
                    {'text': '密码强度为高。', 'btn': '修改密码', 'js': 'healthView.password();', 'bh' : 'health_changepwd'},
                    {'text': '密码强度为中。建议定期更改密码，高强度的密码能有效降低被盗号风险。', 'btn': '修改密码', 'js': 'healthView.password();', 'bh' : 'health_changepwd'},
                    {'text': '密码强度为低。邮箱存在严重安全隐患，建议更改密码，高强度的密码能有效降低被盗号风险。', 'btn': '修改密码', 'js': 'healthView.password();', 'bh' : 'health_changepwd'},
                    {'text': '邮箱密码存在严重安全隐患。建议升级互联网通行证，提升邮箱密码安全系数。', 'btn': '升级通行证', 'js': 'healthView.UpgradePass();', 'bh' : 'health_umc'}
                ],
                'passwdProtect': [
                    {'text': '已设置密保问答。', 'btn': '修改密保', 'js': 'healthView.pswProtect();', 'bh' : 'health_protectpwd'},
                    {'text': '未设置密保问答。如果您以后忘记通行证密码，可以凭密保问答找回通行证密码。', 'btn': '设置密保', 'js': 'healthView.pswProtect();', 'bh' : 'health_protectpwd'},
                    {'text': '未设置密保问答。邮箱密码存在严重安全隐患。建议升级互联网通行证，并设置密码问答。', 'btn': '升级通行证', 'js': 'healthView.UpgradePass();', 'bh' : 'health_umc'}
                ],
                'loginException': [
                    {'text': '近期未发现登录异常。', 'btn': '查看登录详情', 'js': 'top.$App.show("selfSearch")', 'bh' : 'health_checklogin'},
                    {'text': '近期出现异常登录情况。邮箱存在严重安全隐患，建议立即修改密码，保障邮箱安全。', 'btn': '修改密码', 'js': 'healthView.password();', 'bh' : 'health_changepwd',
                    'btn1': '查看登录详情', 'js1': 'top.$App.show("selfSearch")', 'bh1': 'health_checklogin'}
                ],
                'pilferDate': [
                    {'text': '您的帐户未发现被盗风险。', 'btn': '修改密码', 'js': 'healthView.password();', 'bh' : 'health_changepwd'},
                    {'text': '您的账户存在被盗风险，邮箱资料有可能会泄漏。建议立即更改密码，并妥善保护账户及密码信息。', 'btn': '修改密码', 'js': 'healthView.password();', 'bh' : 'health_changepwd'}
                ],
                'forwardMail': [
                    {'text': '未开启自动转发。', 'btn': '设置', 'js': 'top.$App.show("preference_forwardSet")', 'bh': 'health_forwardmail'},
                    {'text': '已开启自动转发。', 'btn': '信任', 'js': 'healthView.setTrustForward()', 'btn1': '设置', 'js1': 'top.$App.show("preference_forwardSet")'},
                    {'text': '已开启自动转发。', 'btn': '取消信任', 'js': 'healthView.setTrustForward()', 'btn1': '设置', 'js1': 'top.$App.show("preference_forwardSet")'}
                ],
                'virusScan': [
                    {'text': '已开启扫描来信病毒。', 'btn': '设置', 'js': 'top.$App.show("spam_antivirusArea")', 'bh' : 'health_virusscan'},
                    {'text': '未开启扫描来信病毒。', 'btn': '设置', 'js': 'top.$App.show("spam_antivirusArea")', 'bh' : 'health_virusscan'}
                ],
                'autoLogin' :[
                    {'text': '未勾选两周内自动登录。', 'btn': '', 'js': ''},
                    {'text': '已勾选了两周内自动登录。', 'btn': '信任', 'js': 'healthView.setTrustAutoLogin();', 'bh' : 'health_cancelautologin'},
                    {'text': '已勾选了两周内自动登录。', 'btn': '取消信任', 'js': 'healthView.setTrustAutoLogin();', 'bh' : 'health_cancelautologin'}
                ],
                'umcUser':  [
                    {'text': '已升级互联网通行证。', 'btn': '', 'js': ''},
                    {'text': '未升级互联网通行证。升级互联网可以避免换号带来文件、资料遗失的风险，建议立即升级。', 'btn': '升级通行证', 'js': 'healthView.UpgradePass();', 'bh' : 'health_umc'}
                ],
                /*'limitCapacity':  [
                    {'text': '邮箱还有较多的剩余容量。', 'btn': '查看', 'js': 'top.$App.showMailbox(1);', 'bh' : 'health_allmail',
                     'btn1': '升级', 'js1': 'top.$App.show("partner")','bh1': 'health_checkupdate'},
                    {'text': '邮箱剩余容量较少，建议定期清理，以避免邮件过多影响使用。 ', 'btn': '查看', 'js': 'top.$App.showMailbox(1);', 'bh' : 'health_allmail',
                     'btn1': '升级', 'js1': 'top.$App.show("partner")','bh1': 'health_checkupdate'}
                ],*/
                'limitAllMail':  [
                    {'text': '收件箱没有过多的邮件。', 'btn': '查看', 'js': 'top.$App.showMailbox(1);', 'bh' : 'health_allmail'},
                    {'text': '收件箱邮件封数过多。可能会影响邮箱性能，建议及时处理。', 'btn': '邮件归档', 'js': 'top.$App.showMailbox(1);top.$App.getView("mailbox").toolbarView.onFileMailClick();', 'bh': 'health_filemail'}
                ],
                'limitUnread':  [
                    {'text': '没有过多的未读邮件。', 'btn': '查看', 'js': 'top.$App.trigger("mailCommand", { command: "viewUnread", fid: 0 });', 'bh': 'health_unread'},
                    {'text': '您的未读邮件较多，建议及时阅读。', 'btn': '查看', 'js': 'top.$App.trigger("mailCommand", { command: "viewUnread", fid: 0 });', 'bh': 'health_unread'}
                ],
                'limitAdvert':  [
                    {'text': '没有过多的广告邮件。', 'btn': '查看', 'js': 'top.$App.showMailbox(11);', 'bh': 'health_advert'},
                    {'text': '您的广告邮件较多，建议及时清理。', 'btn': '查看', 'js': 'top.$App.showMailbox(11);', 'bh': 'health_advert'}
                ],
                'limitDraft': [
                    {'text': '没有过多的草稿邮件。  ', 'btn': '查看', 'js': 'top.$App.showMailbox(2);', 'bh': 'health_draft'},
                    {'text': '您的草稿邮件较多，建议及时处理。', 'btn': '查看', 'js': 'top.$App.showMailbox(2);', 'bh': 'health_draft'}
                ],
                'limitDiskCapacity': [
                    {'text': '网盘还有较多的剩余容量。', 'btn': '查看', 'js': 'top.$App.show("diskDev");', 'bh': 'health_diskcapacity',
                     'btn1': '升级', 'js1': 'top.$App.show("partner")','bh1': 'health_checkupdate'},
                    {'text': '网盘剩余容量较少。', 'btn': '查看', 'js': 'top.$App.show("diskDev");','bh': 'health_checkupdate',
                     'btn1': '升级', 'js1': 'top.$App.show("partner")','bh1': 'health_checkupdate'}
                ],
                'expireLargeattach': [
                    {'text' : '暂存柜中无即将到期文件。', 'btn': '查看', 'js': 'top.$App.show("diskDev", {from:"cabinet"});', 'bh': 'health_expirelargeattach'},
                    {'text' : '暂存柜中有即将到期文件。', 'btn': '查看', 'js': 'top.$App.show("diskDev", {from:"cabinet"});', 'bh': 'health_expirelargeattach'}
                ],
                'setAlias': [
                    {'text': '您已设置邮箱别名帐号。', 'btn': '', 'js': ''},
                    {'text': '您未设置邮箱别名帐号。别名能有效提高个人私隐，建议立即设置。', 'btn': '设置', 'js': 'top.$Evocation.create("type=6");','bh': 'health_alias'}
                ],
                'setSendName': [
                    {'text': '您已设置姓名。', 'btn': '设置', 'js': 'top.$App.show("account_userInfo")', 'bh': 'health_sendname'},
                    {'text': '您未设置姓名。', 'btn': '设置', 'js': 'top.$App.show("account_userInfo")', 'bh': 'health_sendname'}
                ],
                'setBirthday': [
                    {'text': '您已设置生日。', 'btn': '设置', 'js': 'top.$App.show("account_userInfo")', 'bh': 'health_birthday'},
                    {'text': '您未设置生日。', 'btn': '设置', 'js': 'top.$App.show("account_userInfo")', 'bh': 'health_birthday'}
                ],
                'setImage': [
                    {'text': '您已设置头像。', 'btn': '设置', 'js': 'top.$App.show("account_userInfo")', 'bh': 'health_image'},
                    {'text': '您未设置头像。', 'btn': '设置', 'js': 'top.$App.show("account_userInfo")', 'bh': 'health_image'}
                ],
                'bindingPhone': [
                    {'text': '您已绑定了手机号码。', 'btn': '设置', 'js': 'top.$App.show("account")', 'bh': 'health_bindingphone'},
                    {'text': '您未绑定手机号码。绑定手机号不仅可以通过手机号码登录邮箱，且享有免费的来信通知短信，建议立即绑定。', 'btn': '设置', 'js': 'top.$App.show("account")', 'bh': 'health_bindingphone'}
                ]
            }
        },
        template: function(HealthyHistory){
            var self = this, data = {},
                lastUpdateDay = HealthyHistory.lastUpdateTime.toString().substring(0, HealthyHistory.lastUpdateTime.toString().indexOf(' ')),
                timeArr = lastUpdateDay.split('-');
            data.type = HealthyHistory.totalScore == 0 ? 0 :
                (((new Date().getTime() - new Date(timeArr[0], timeArr[1]-1, timeArr[2]).getTime()) >= 72 * 3600 * 1000) ? 1 : 2);
            data.stateImg = data.type == 0 ? 'i-mtBlue' : (data.type == 1 ? 'i-mtRed'
                : (HealthyHistory.totalScore >= 90 ? 'i-mtGreen' : (HealthyHistory.totalScore >= 50 ? 'i-mtYellow' : 'i-mtRed')));

            if(data.type == 1){
                data.day = Math.floor((new Date().getTime() - new Date(timeArr[0], timeArr[1]-1, timeArr[2]).getTime()) / (24 * 3600 * 1000));
            }else if(data.type == 2){
                data.stateText = HealthyHistory.totalScore >= 90 ? self.config.statusText[0] : (HealthyHistory.totalScore >= 50 ? self.config.statusText[1] : self.config.statusText[2]);
            }
            return [
                '<div class="stateImg ' + data.stateImg + ' fl">',
                data.type == 0 ? '' : (data.type == 1 ? '<i class="i-mtYelowWarn"></i>' : '<var>' + HealthyHistory.totalScore + '</var>'),
                '</div><dl class="fl ml_20 pt_20"><dt>',
                data.type == 0  ? '邮箱君可能存在隐患，建议立即体检！':(data.type == 1 ?
                    '邮箱君已经超过<var class="c_ff5907"> '+ data.day +' </var>天没有体检，建议立即体检！'
                    : '体验得分：<var class="bigNub ' + (HealthyHistory.totalScore >= 90 ? 'c_008e11' : 'c_de0202') + '">' + HealthyHistory.totalScore+'</var>'),
                '</dt>' + (data.type == 0 ? '<dd><p class="c_999">养成定期体检的良好习惯，才能使邮箱君更好的为您服务。</p>'
                    : (data.type == 1 ? '<dd><p class="c_999">上次体检时间是<var class="c_ff5907"> ' + lastUpdateDay + ' </var>,建议每周一次体检。</p>'
                    : '<dd style="margin-top:-5px;"><p class="c_de0202">' + data.stateText + '</p>')),
                (data.type == 0 || data.type == 1) ? '<p class="mt_15"><a hidefocus="1" class="btnG" href="javascript:healthView.testHealth();" title="" id="bottomSend" bh="health_test"><span>立即体检</span></a></p></dd></dt>'
                    :'<p class="mt_15"><a hidefocus="1" class="btnG" href="javascript:healthView.testHealth();" title="" id="bottomSend" bh="health_test"><span>重新体检</span></a></p></dd></dl>',
                ''
            ].join('');
        },
        render: function(){
            var self = this;
            if($('#healthTab #bottomSend').length == 0){
                $(this.el).removeClass('none').prepend(self.template(self.model.get('HealthyHistory')));
            }
            return this;
        },
        testHealth: function(){
            var self = this;
            $('#healthyHistory').html('').addClass('none');
            $('#healthTexting .percentageEd').css('width', '0%');
            $('#healthTexting .stateImg').html('<var>0</var>');
            $('#healthTexting dt').html('正在进行邮箱体检···');
            $('#healthTexting').removeClass('none');
            $('#HealthyInfo .mtTitle a').addClass('none');
            $('#HealthyInfo .mtTitle i').removeClass();
            $('#HealthyInfo .mtMain').remove();
            $('#HealthyInfo').append(_.template($('#health_table_template').html())());
            $('#HealthyInfo').removeClass('none');
            $('.mailTestingBox_head_options i').removeClass().addClass('i-mtPassing').eq(0).removeClass().addClass('i-mtNotPass');

            $('.mtMain th a').on('click',function(){
                $(this).parents('.mtMain').find('tbody tr').toggle();
            }).toggle(function(){
                $(this).find('i').removeClass().addClass('i-mtDown');
            },function(){
                $(this).find('i').removeClass().addClass('i-mtUp');
            });
            var times = 1;
            this.model.on('change:HealthyInfo',function(){
                self.testing();
                bindEvent();
            });
            function bindEvent(){
                bindEvent = function(){};
                $('#cancelTest').on('click',function(){
                    clearTimeout(cpTimer);
                    finishTest();
                    $('#healthTab .mailTestingBox_head dt').html('体检已取消！建议您重新进行体检！').addClass('pt_10');
                    $('.mailTestingBox_head p:eq(0)').removeClass().addClass('c_999').html('本次体检未完成，已发现<var class="c_ff5907"> ' + $('tr[got=2]').length +' </var>个问题')
                    $('#bottomSend').html('<span>重新体检</span>');
                });
            }
            var cpTimer;
            function callAPI(){
                M139.RichMail.API.call("healthy:getHealthyInfo", {},function(data){
                    var msg = data.responseData;
                    if(msg['code'] == "S_OK"){
                        self.model.set('HealthyInfo', msg['var']);
                        if(msg['var'].isLoad != 1){
                            cpTimer = setTimeout(function(){
                                callAPI();
                            },1800);
                        }else{
                            finishTest();
                        }
                    }
                });
            }
            function finishTest(){
                self.model.set('HealthyHistory',{'totalScore': self.model.get('HealthyInfo')['totalScore'], 'lastUpdateTime' : new Date().getTime()})
                $('#healthyHistory').removeClass('none');
                $('#healthTexting').addClass('none');
                $('#cancelTest').off();
                M139.RichMail.API.call("healthy:getHealthyHistory", {},function(data){
                    var msg = data.responseData;
                    if(msg['code'] == 'S_OK'){
                        top.$App.setConfig('healthyHistory', 'totalScore', msg['var']['totalScore']);
                        top.$App.setConfig('healthyHistory', 'lastUpdateTime', msg['var']['lastUpdateTime']);
                        top.$App.trigger("userAttrChange", {
                            callback: function () { }
                        });
                    }
                });
            }
            callAPI();
        },
        testing: function(){
            var self = this,
                hi = self.model.get('HealthyInfo'),
                oTr = $('tr[got=0]'),
                percent = 0;
            for(var i = 0; i < oTr.length; i++){
                var tid = $(oTr[i]).attr('tid');
                if(hi[tid] == -1){
                    break;
                }else{
                    if((tid == 'passwordStrength' || tid == 'passwdProtect') && hi['umcUser'] == '1'){
                        hi[tid] = (tid == 'passwordStrength') ?  3 : 2;
                    }else if((tid == 'autoLogin' && hi[tid] == '1' && hi['trustAutoLogin'] == '1')|| (tid == 'forwardMail' && hi[tid] == '1' && hi['trustForwardMail'] == '1')){
                        hi[tid] = 2;
                    }
                    $(oTr[i]).attr('got',(hi[tid] == 0 ? '1' : '2')).find('td:eq(1) i').addClass(hi[tid] == 0 ? 'i-mtOk' : 'i-mtWarning');
                    $(oTr[i]).find('td:eq(1)').addClass(hi[tid] == 0 ? '' : 'c_ff5907').find('i').after(self.config.testing[tid][hi[tid]].text);
                    if((tid == 'autoLogin' && hi[tid] == '2' && hi['trustAutoLogin'] == '1')|| (tid == 'forwardMail' && hi[tid] == '2' && hi['trustForwardMail'] == '1')){
                        $(oTr[i]).attr('got', '1').find('td:eq(1)').removeClass().find('i').removeClass().addClass('i-mtOk');
                    }
                    if(self.config.testing[tid][hi[tid]].btn != ''){
                        $(oTr[i]).find('.btnNormal').removeClass('none').html('<span>' + self.config.testing[tid][hi[tid]].btn + '</span>')
                            .attr('bh', self.config.testing[tid][hi[tid]].bh)
                            .on('click',(function(tid){return function(){eval(self.config.testing[tid][hi[tid]].js);}})(tid));
                        if(self.config.testing[tid][hi[tid]].btn1){
                            $(oTr[i]).find('td').eq(2).append('<a href=\'javascript:' + self.config.testing[tid][hi[tid]].js1
                                + '\' class="btnNormal mr_10" bh="' + self.config.testing[tid][hi[tid]].bh1 + '"><span>' + self.config.testing[tid][hi[tid]].btn1  + '</span></a>')
                        }
                    }
                }
            }
            var status = hi['totalScore'] >= 90 ? 'i-mtGreening' : hi['totalScore'] >= 50 ? 'i-mtYellowing' : 'i-mtReding';
            $('#healthTexting .stateImg').html('<var>' + hi['totalScore'] + '</var>').removeClass('i-mtGreening i-mtYellowing i-mtReding').addClass(status);
            var len_ok = $('tr[got=1]').length,
                len_warn = $('tr[got=2]').length;
            $('#healthTab .percentageEd').css('width', Math.floor((len_ok + len_warn)/19 * 100) + '%');
            $('.mtTitle var:eq(0)').html(len_ok + len_warn);
            $('.mtTitle var:eq(1)').html(len_warn);
            for(var j = 0; j < $('.mailTestingBox_table .mtMain').length; j++){
                if($($('.mailTestingBox_table .mtMain')[j]).find('tbody tr[got=0]').length == 0 && $('#HealthyInfo .mtTitle a').eq(j).is('.none')){
                    $('.mtTitle a').eq(j).removeClass('none');
                    $('.mailTestingBox_head_options i').eq(j).removeClass().addClass('i-mtPass');
                    $('.mailTestingBox_head_options i').eq(j + 1).removeClass().addClass('i-mtNotPass');
                    if($($('.mailTestingBox_table .mtMain')[j]).find('tbody tr[got=2]').length != 0){
                        $('.mtTitle a').eq(j).removeClass('riskCheck, safetyCheck').addClass('riskCheck').find('i').addClass('i-mtWarning');
                    }else{
                        $('.mtTitle a').eq(j).removeClass('riskCheck, safetyCheck').addClass('safetyCheck').find('i').addClass('i-mtOk');
                    }
                }
            }
        },
        setTrustForward: function(){
            var self = this,
                trust  = $('tr[tid=forwardMail] a span').html() == '信任' ? 1 : 2;
            M139.RichMail.API.call("healthy:setTrustForward", {trust : trust},function(data){
                var msg = data.responseData;
                if(msg['code'] == "S_OK"){
                    $('tr[tid=forwardMail] a span').eq(0).html($('tr[tid=forwardMail] a span').eq(0).html() == '信任' ? '取消信任' : '信任');
                }
            });
        },
        setTrustAutoLogin: function(){
            var self = this,
                trust  = $('a[bh=health_cancelautologin] span').html() == '信任' ? 1 : 2;
            M139.RichMail.API.call("healthy:setTrustAutoLogin", {trust : trust},function(data){
                var msg = data.responseData;
                if(msg['code'] == "S_OK"){
                    $('a[bh=health_cancelautologin] span').html($('a[bh=health_cancelautologin] span').html() == '信任' ? '取消信任' : '信任');
                }
            });
        },
        UpgradePass:function(){
            var TO_UPDATE = 1;
            var reqData = { optype: TO_UPDATE };
            var url = M139.HttpRouter.getUrl("umc:rdirectCall").replace("/setting/", "/mw2/setting/");
            url = $Url.makeUrl(url, reqData);
            window.open(url);
        },
        password: function(){
            top.BH('set_modify_password'); //点击修改密码，上报
            var TO_UPDATE = 1;
            var TO_MOD_PWD = 12;
            var reqData = { optype: TO_MOD_PWD, rnd: Math.random() };
            var url = M139.HttpRouter.getUrl("umc:rdirectCall").replace("/setting/", "/mw2/setting/");

            top.$User.isUmcUserAsync(function(isumcuser){
                if (!isumcuser) {
                    reqData.to = reqData.optype;
                    reqData.optype = TO_UPDATE;
                }

                url = $Url.makeUrl(url, reqData);
                top.$Msg.open({ url: url, dialogTitle: "修改密码", width: 601, height: 432,hideTitleBar:true });
            });
        },
        pswProtect: function(){

            var TO_UPDATE = 1;
            var TO_SET_ANSWER = 13;
            var TO_CHANG_ANSWER = 14;

            var reqData = { optype: TO_SET_ANSWER, rnd: Math.random() };

            if($('a[bh=health_protectpwd] span').html() ==  '修改密保'){
                reqData.optype = TO_CHANG_ANSWER;
            }

            var url = M139.HttpRouter.getUrl("umc:rdirectCall").replace("/setting/", "/mw2/setting/");

            top.$User.isUmcUserAsync(function(isumcuser){
                if (!isumcuser) {
                    reqData.to = reqData.optype;
                    reqData.optype = TO_UPDATE;
                }

                url = $Url.makeUrl(url, reqData);
                window.open(url);
            });
        }

    }));
    $(function () {
        window.healthView = new M2012.Health.View();
    });
})(jQuery, _, M139);
/**
 * @fileOverview 我的应用
 */
(function (jQuery, _, M139) {

    /**
     * @namespace
     * 我的应用
     */

    M139.namespace("M2012.Health.Update.Model", Backbone.Model.extend({
        initialize: function(){

        },
        defaults: {
            "autoSaveContact" : [0, 0],
            "loginNotify" : [0, 0],
            "mailNotify" : [0, 0],
            "loginDirectly" : [0, 0],
            "smtpSaveSended" : [0, 0],
            "POPReaded": [0, 0]
        }
    }));
})(jQuery, _, M139);
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;

    /**
     * @namespace
     * 我的应用
     */

    M139.namespace('M2012.Health.Update.View', superClass.extend({
        initialize: function(){
            this.model = new M2012.Health.Update.Model();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        id : 'updateTab',
        len : 4,
        template: {
            'title': _.template('<% if(num == 0){ %><p class="c_008e11 fz_16 mt_15">邮箱君的设置已是最佳状态，不需要优化</p>' +
                '<% }else{ %><p class="c_999">发现<var class="c_ff5907"> <%= num %> </var>个可优化选项</p>' +
                '<p class="mt_15"><a hidefocus="1" class="btnG" href="javascript:updateView.oneClick();" title="" id="bottomSend" bh="health_oneclick"><span>立即优化</span></a></p> <% }%>'),
            'result_ok': _.template('<p class="c_008e11 fz_16 mt_15">一键优化完成！共完成<%= num %>个可优化项</p>'),
            'result_error': _.template('<p class="c_008e11 fz_16 mt_10">已完成<var><%= num %></var>个可优化项，' +
                '<span class="c_de0202"><var><%= err %></var>个失败</span>' +
                '<a hidefocus="1" class="btnG ml_15" href="javascript:updateView.oneClick();;" title="" bh="health_oneclick"><span>重新优化</span></a></p>')
        },
        content: function(){
            if( $('#updateTab .mtMain').length != 0)return;
            var self = this,
                model = self.model.attributes;
            var text = [
                    {
                        'name' : '联系人设置',
                        'rid' : 'contact',
                        'op' : [{'id': 'autoSaveContact', 'text': '邮件、短信发送成功后，是否自动保存联系人', 'bh': 'health_autosavecontact', '2' : ['未保存', '建议保存']}]
                    },{
                        'name' : '手机通知',
                        'rid' : 'mobile',
                        'op' : [
                            {'id': 'loginNotify', 'text' : '登录短信通知', 'bh': 'health_loginnotify', '0' : ['每次都发送', '建议异常时发送'] , '1' : ['不发送', '建议异常时发送']},
                            {'id' : 'mailNotify', 'text' : '邮件到达通知', 'bh': 'health_mailnotify', '0': ['未开启', '建议开启']}
                        ]
                    },{
                        'name' : '手机登录设置',
                        'rid' : 'addr',
                        'op' : [{'id' : 'loginDirectly', 'text' : '通过移动GPRS、3G、4G网络访问139邮箱手机版本时', 'bh': 'health_logindirectly', '2' : ['输入密码登录', '建议免密码直接登录']}]
                    },{
                        'name': '客户端收发邮件设置',
                        'rid' : 'proxy',
                        'op' : [{'id' : 'POPReaded', 'text' : '使用POP方式收邮件时，未读邮件状态是否自动标记为已读', 'bh': 'health_POPreaded', '0' : ['未读邮件自动标记为已读', '建议未读邮件状态不变']}]
                    }],
                tpl_th = _.template(['<table class="mtMain" rid="<%= rid %>"><thead><tr><th width="150" class="fz_14">',
                    '<%= name %></th><th width="210" class="fw_n">共<%= num %>项</th>',
                    '<th width="" class="ta_r" colspan="2"><a href="javascript:;" class="mr_10 cArare"><i class="i-mtUp"></i></a></th></tr></thead></table>'].join('')),
                tpl_tr = _.template(['<tr class="current"><td width="17"><input type="checkbox" name="" id="<%= id %>" checked="" /></td>',
                    '<td class="pl_5"><label for="<%= id %>"><%= text %></label></td>',
                    '<td width="20%"><%= explain[0] %></td><td width="20%"><%= explain[1] %></td>',
                    '<td width="85" class="ta_r"><a id="btn_<%= id %>" href="javascript:;" bh="<%= bh %>" class="btnNormal mr_10"><span>优化</span></a></td></tr>'].join(''));
            self.len = 6;
            for(var i in model){
                var index = {'autoSaveContact': 0, 'loginNotify': 1, 'mailNotify': 1, 'loginDirectly' : 2 , 'POPReaded' : 3}[i],
                    temp = text[index];
                if(model[i][0] == 1){
                    continue;
                }
                self.len--;
                if(temp == null || temp.op.length == 1){
                    temp = null;
                }else{
                    temp.op[0] = temp.op[i == 'loginNotify' ? 1 : 0];
                    temp.op.length = 1;
                }
                text[index] = temp;
            }
            //console.log('new text',text);

            var ret = '', ex = '';

            for(var j = 0; j < text.length; j++){
                if(text[j] != null){
                    text[j].num = text[j].op.length;
                    ret += tpl_th(text[j]);
                    ret += '<table class="mtMain" rid="' + text[j]['rid'] + '"><tbody>';
                    for(var k = 0; k < text[j].op.length; k++){
                        //console.log(text[j].op[k], model, model[text[j].op[k].id]);
                        ex = text[j].op[k][model[text[j].op[k].id][1]];
                        text[j].op[k].explain = ex;
                        ret += tpl_tr(text[j].op[k]);
                    }
                    ret += '</tbody></<table>';
                }
            }
            return ret;
        },
        render: function(){
            var self = this;
            $('#updateTab .mailTestingBox_table').remove('.mtMain').append(self.content());
            $('#updateTab .mailTestingBox_head dd').eq(0).addClass('none');
            $('#updateTab .mailTestingBox_head dd').eq(1).html(self.template.title({'num' : self.len})).removeClass('none');
            $('#updateTab .mailTestingBox_head .stateImg').removeClass('i-mtGreenYhing').addClass('i-mtGreen');
            if(self.len == 0){
                $('#updateTab .mailTestingBox_table').addClass('none');
            }else{
                $('#updateTab .mailTestingBox_table').removeClass('none');
                $('#updateTab th a').on('click',function(){
                    var rid  = $(this).parents('.mtMain').attr('rid');
                    $('.mtMain[rid=' + rid + ']').eq(1).toggle();
                }).toggle(function(){
                    $(this).find('i').removeClass().addClass('i-mtDown');
                },function(){
                    $(this).find('i').removeClass().addClass('i-mtUp');
                });
                $('#allTest').on('click',function(){
                    if($(this).attr('checked') == 'checked'){
                        $('input').not('#allTest').attr('checked', 'checked');
                    }else{
                        $('input').not('#allTest').attr('checked', false);
                    }
                }).attr('checked', 'checked');
                $('#updateTab .mailTestingBox_table a').on('click', function(){
                    var id = $(this).attr('id');
                    id = id.substring(4);
                    M139.RichMail.API.call("healthy:oneClickUpdate", {updateKey: id},function(data){
                        var msg = data.responseData;
                        if(msg['code'] == "S_OK"){
                            var para = {};
                            para[id] = msg['var'][id];
                            self.updateOp(para);
                        }
                    });
                });
            }
        },
        checking: function(){
            var self = this,
                recommend = {
                    "autoSaveContact":"1",
                    "loginNotify":"2",
                    "mailNotify":"9",
                    "loginDirectly":"1",
                    "POPReaded":"1"
                };
            $('#updateTab .percentageEd').css('width', '0%');
            $('#updateTab .mailTestingBox_head dd').eq(1).addClass('none');
            $('#updateTab .mailTestingBox_head dd').eq(0).removeClass('none');
            $('#updateTab .mailTestingBox_head .stateImg').addClass('i-mtGreenYhing').removeClass('i-mtGreen');
            $("#updateTab .percentageEd").animate({
                width: "60%"
            }, 600 );
            function isOp(data){
                var temp = 0;
                for(var i in data){
                    temp = data[i] != recommend[i] ? 1 : 0;
                    self.model.set(i, [temp, data[i]]);
                }
            }
            M139.RichMail.API.call("healthy:getOneClickUpdateInfo", {},function(data){
                var msg = data.responseData;
                if(msg['code'] == "S_OK"){
                    $("#updateTab .percentageEd").animate({
                        width: "100%"
                    },500 );
                    isOp(msg['var']);
                    self.render();
                }
            });
        },
        oneClick: function(){
            var self = this,
                oChecked = $('td :checkbox:checked'),
                para = [];
            for(var i = 0; i < oChecked.length; i++){
                para[i] = oChecked.eq(i).attr('id');
            }
            if(para.length == 0 && ($('#updateTab .i-mtErrow').length == 0 || ($('#updateTab .i-mtErrow').length != 0 && $('#allTest:checked').length == 0) )){
                top.$Msg.alert(
                    '请勾选优化项',
                    function () {return false;},
                    {
                        dialogTitle: '提示',
                        icon: "warn"
                    }
                );
                return;
            }
            if(para.length == 0){
                var oAId = $('#updateTab .i-mtErrow').parents('tr').find('a').attr('id');
                oAId = oAId.substring(4);
                para = [oAId];
            }
            M139.RichMail.API.call("healthy:oneClickUpdate", {updateKey: para.join(',')},function(data){
                var msg = data.responseData;
                if(msg['code'] == "S_OK"){
                    self.updateOp(msg['var']);
                }
            });
        },
        updateOp: function(options){
            var num = 0, err = 0 ,oTr;
            for(var i in options){
                oTr = $('#' + i).parents('tr');
                if(options[i] == 'S_OK'){
                    oTr.find('td').eq(0).addClass('ta_r').html('<i class="i-mtOk"></i>');
                    oTr.find('td').eq(4).html('<span class="c_008e11 mr_10">已优化</span>');
                    oTr.removeClass();
                    if(i == 'POPReaded'){
                        top.$App.getConfig("UserAttrs").unallow_pop3_change_mail_state = 1;
                    }else if(i == 'loginDirectly'){
                        top.$App.getConfig('UserData').mainUserConfig["checkloginway"] && (top.$App.getConfig('UserData').mainUserConfig["checkloginway"][0] = '1');
                    }else if(i == 'autoSaveContact'){
                        top.$App.setUserCustomInfoNew({ '9': 1, "readAutoSave": top.$App.getUserCustomInfo("readAutoSave")});
                    }
                }else if(options[i] == 'S_ERROR'){
                    err++;
                    oTr.find('td').eq(0).addClass('ta_r').html('<i class="i-mtErrow"></i>');
                    oTr.find('a').eq(0).html('<span>重新优化</span>');
                    oTr.removeClass().addClass('mtErrow');
                }
            }
            if($('#updateTab .i-mtOk').length != 0 || $('#updateTab .i-mtErrow').length != 0){
                num = $('#updateTab .i-mtOk').length;
                err = $('#updateTab .i-mtErrow').length
                if(err == 0){
                    $('#updateTab .mailTestingBox_head dd').eq(1).html(this.template.result_ok({'num' : num}));
                }else{
                    $('#updateTab .mailTestingBox_head dd').eq(1).html(this.template.result_error({'num' : num, 'err' : err}));
                }
            }
        },
        unload:function(){
            $('#updateTab .mtMain').remove();
            $('#updateTab .percentageEd').css('width', '0%');
        }
    }));
    $(function () {
        window.updateView = new M2012.Health.Update.View();
    });
})(jQuery, _, M139);
