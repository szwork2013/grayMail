/**
* @fileOverview 邮件风险预警提醒
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;

    /**
    * @namespace 
    * 邮件风险预警提醒功能
    */

    M139.namespace('M2012.ReadMail.RiskTips.View', superClass.extend({

    /**
    *@lends M2012.ReadMail.RiskTips.View.prototype
    */
    
    template:{
        tips:['<div id="risktips" class="rMList {colorStyle}">',
                   '<span class="rMl">提　醒：</span>',
                   '<div class="rMr">',
                        '{tips}',
                   '</div>',
              '</div>'].join(""),
        line:'<span class="line"> | </span>',      
        trust:'<a href="javascript:;" id="trust" key="white">信任此人</a>',
        refuse:'<a href="javascript:;" id="refuse" key="black" >拒收此人</a>', 
        showpic:'<a href="javascript:;" id="showpic" >显示图片</a>',
        spam:'<a href="javascript:;" id="spam" key="spam">点击举报</a>'
    },

    initialize: function (data) {
        var self = this;
        this.model = new M2012.ReadMail.RiskTips.Model();
        return superClass.prototype.initialize.apply(this, arguments);
    },

    //显示图片
    showContentImg: function() {
        var self = this;
        var data = this.model.get('dataSource');
        var fid = this.model.get('fid');
        var text = self.model.config[fid][0].text;
        var thismid = 'mid_' + data.omid;
        $($T.Utils.format('iframe[id={0}]',[thismid])).contents().find("img").each(function () {
            var original = $(this).attr('original');
            original && $(this).attr('src', original);
        });
        var rmr = $(self.el).find('#risktips .rMr');
        rmr.find('em').html(text);
        rmr.find('a:eq(0)').remove();
        rmr.find('.line:eq(0)').remove();
    },
    
    //添加黑白名单
    addBlackAndWhite:function(e,callback){
        var response = this.model.get('dataSource');
        var account = $Email.getEmail(response.account);
        if(account){
            var options = {
                name:account,
                comefrom:'readmail'
            };
            $App.addBlackWhite(e,options,callback);
        }
    },


    //拒收此人
    refuse: function (e,options) {
        var self = this;
        var response = this.model.get('dataSource');
        var from = M139.Text.Email.getEmail(response.account);
        top.$App.trigger("mailCommand", { command: "refuseMail", email: from });
        
        /*var tipsText = "系统会将此邮件地址添加到黑名单，并将此邮件移到垃圾邮件文件夹。您将不会再收到来自此地址的邮件。<br/>您确定要<span style='color:blue'>拒收此发件人的邮件</span>吗?";
        var callback = function(){
            self.moveMessage(5); //移到垃圾箱
        };
        $Msg.confirm(
            tipsText,
            function(){
                self.addBlackAndWhite(e,callback);
            },
            {
                dialogTitle:'拒收此人',
                icon:'warn',
                isHtml:true
            }
        );*/
    },
    
    //举报
    spam: function(){
        var self = this;
        $App.trigger("mailCommand", {
            command:"spam",
            mids:[self.model.get('dataSource').omid],
            comefrom:'risktips_spam'
        });
    },
    
    //移动邮件
    moveMessage:function(fid){
        var self = this;
        $App.trigger("mailCommand", {
            command:"move",
            fid:fid,
            mids:[self.model.get('dataSource').omid]
        });
    },
    
    //信任此人
    trust: function(e,options) {
        var self = this;
        top.$App.trigger("mailCommand", { command: "unSpam"});
        
        /*var tipsText = "系统会将此邮件地址添加到白名单，并将此邮件移动到收件箱。<br/>您确定<span style='color:blue'>要信任此发件人</span>吗？";
        var callback = function(){
            self.moveMessage(1); //移到收件箱
            $Msg.alert('操作成功，邮件已被还原到收件箱中。');
        };
        $Msg.confirm(
            tipsText,
            function(){
                self.addBlackAndWhite(e,callback);
            },
            {
                dialogTitle:'信任此人',
                icon:'warn',
                isHtml:true
            }
        );*/
    },

    /** 定义点击事件--拒收，信任，显示图片 */
    initEvents: function () {
        var self = this;
        var tipsContainer = $(self.el).find('#risktips .rMr');
        tipsContainer.find('a[id=trust]').click(function(e){
            self.trust(e);
        });
        tipsContainer.find('a[id=refuse]').click(function(e){
            self.refuse(e);
        });
        tipsContainer.find('a[id=showpic]').click(function(){
            self.showContentImg();
        });
        tipsContainer.find('a[id=spam]').click(function(e){
            self.spam(e);
        });
    },

    /** 是否有图片 */
    hasImg: function () {
        var data = this.model.get('dataSource');
        return /src=|original=/gi.test(data.html.content);
    },

    /** 是否有附件 */
    hasAttach: function () {
        var data = this.model.get('dataSource');
        return data.attachments.length > 0;
    },
    
    /** 预警提示输出 */
    render: function() {
        var self = this;
        var fid = this.model.get('fid');
        var config = this.model.config;
        var html = '';
        if(self.model.isEnable()){
            if(fid == 5 || fid == 11) { //垃圾文件夹，广告文件夹
                if (self.hasImg()) { //有图片
                    html = self.getItemHtml(config[fid][1]);
                } else if (self.hasAttach()) { //有附件
                    html = self.getItemHtml(config[fid][2]);
                } else { //无图无附件
                    html = self.getItemHtml(config[fid][0]);
                }
            }else if(fid == 6 || fid == 9){
                html = self.getItemHtml(config[fid][0]);
            }else if(self.model.isPropertySafe()){
                top.BH('readmail_showpropertysafetip');
                html = self.getItemHtml(config['propertySafe'][0]); //涉及财产安全提示
            }else if(fid == 1){ //收件箱
                if(self.model.isBcc()){
                    html = self.getItemHtml(config[fid][0]);
                }
            }
        }
        return html;
    },
    
    /** 返回单项信息 */
    getItemHtml:function(obj){
        var self = this;
        var temp = self.template.tips;
        var refuseLink = self.template.refuse;
        var trustLink = self.template.trust;
        var showPicLink = self.template.showpic;
        var spamLink = self.template.spam;
        var line = self.template.line;
        var tips = [];
        tips.push('<em>' + obj.text + '</em>');
        if(obj.showpic){
            tips.push(showPicLink);
        }
        if(obj.trust){
            obj.showpic ? tips.push(line + trustLink) : tips.push(trustLink);
        }
        if(obj.refuse){
            obj.trust ? tips.push(line + refuseLink) : tips.push(refuseLink);
        }
        if(obj.spam){
            tips.push(spamLink);
        }
        var formatObj = {
            colorStyle:obj.style,
            tips:tips.join('')
        };
        return $T.Utils.format(temp,formatObj);
    }

}));

})(jQuery, _, M139);


