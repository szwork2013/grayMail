/**
* @fileOverview 会话邮件读信页底部工具栏
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    
    /**
    * @namespace 
    * 会话邮件读信页底部工具栏
    */   
         
    M139.namespace('M2012.ReadMail.SessionMail.View.BottomToolBar', superClass.extend({

        /**
        *@lends M2012.ReadMail.SessionMail.View.BottomToolBar.prototype
        */
        
        template:{
            reply:[ '<a href="javascript:" id="reply" bh="toolbar_reply">回复</a>',
                    '<span class="line">|</span>',
                    '<a href="javascript:;" id="replyall" bh="toolbar_replyall">回复全部</a>',
                    '<span class="line">|</span>'].join(''),
            toolbar:[
                    '<a href="javascript:;" id="forward" bh="toolbar_forward">转发</a>',
                    '<span class="line">|</span>',
                    '<a href="javascript:;" id="delete" bh="toolbar_delete">删除</a>',
                    '<span class="line">|</span>',
                    '<a href="javascript:;" id="more">更多 <i class="i_triangle_d"></i></a>'].join('')
        },
        
        
        initialize: function(data){
            var self = this;
            this.parentview = data.parentview;
            this.mid = data.mid;
            this.account = data.account;
            this.tabmid = data.tabmid;
            return superClass.prototype.initialize.apply(this, arguments);
        },
        
        
        initEvents: function(){
            var self = this;
            var mid = this.mid;
            $(self.el).find("#more").click(function(){
                var left = $(this).offset().left - $(self.el).offset().left;
                self.createMoreToolMenu(self,left);
            });
            
            $(self.el).find("#reply").click(function(){
                $App.reply(0,mid,false);
            });
            
            $(self.el).find("#replyall").click(function(){
                $App.reply(1,mid,false);
            });
            
            $(self.el).find("#forward").click(function(){
                $App.forward(mid);
            });
            
            if(mid == self.tabmid){ //首封邮件没有删除操作
                $(self.el).find("#delete").next('.line').remove();
                $(self.el).find("#delete").remove();
            }
            
            $(self.el).find("#delete").click(function(){
                var args={};
                args.command = 'move';
                args.fid = 4;
                args.mids = [mid];
                args.comefrom = 'moveSingleSessionMail'; //会话邮件单封删除
                $App.trigger("mailCommand", args);
                //隐藏对应节点
                $($T.Utils.format('div[mid={0}]',[mid])).fadeOut('slow').attr('hide',1); //不能用remove
                var deleteNumC = $('#deletenum_'+self.tabmid);
                
                if(deleteNumC[0]){
                    var num = parseInt(deleteNumC.text());
                    deleteNumC.text(num+1);
                }else{
                    var inboxTipsHtml = self.parentview.getInboxTips(0,1); //只有第一次删除才执行
                    $(self.parentview.el).find('.toolBar').after(inboxTipsHtml);
                }
            });
            
        },
        
        /**
        * 更多操作菜单
        */
        createMoreToolMenu:function(This,offsetLeft){
            var self = This;
            var mid = this.mid;
            var lastFlag = false; //最后一封邮件向上弹菜单
            if(mid == $(self.parentview.el).find('.mailSectionList:last[hide!=1]').attr('mid')){
                lastFlag = true;
            }
            M2012.UI.PopMenu.create({
                items:[
                    {
                        text:"新窗口打开",
                        onClick:function(){
                            $App.openNewWin(mid);
                            BH('readmail_newwin');
                        }
                    },
                    {
                        text:"导出邮件",
                        onClick:function(){
                            var wmsvrPath2 =  domainList.global.wmsvrPath2;
                            var sid = $App.getSid();
                            var downloadUrl = wmsvrPath2 + "/mail?func=mbox:downloadMessages&sid={0}&mid={1}&";
                            window.open($T.Utils.format(downloadUrl,[sid,mid]));
                            BH('toolbar_export');
                        }
                    },
                    
                    {
                        text:"打印",
                        onClick:function(){
                        window.open("/m2012/html/printmail.html?mid=" + mid);
                        BH('toolbar_print');
                    }
                    },
                    {
                        text:"显示邮件原文",
                        onClick:function(){
                            var orignUrl = "/RmWeb/view.do?func=mbox:getMessageData&mode=text&part=0&sid={0}&mid={1}&";
                            window.open($T.Utils.format(orignUrl,[sid,mid]));
                            BH('toolbar_mailcode');
                        }
                    }
                ],
                container:$(self.el),
                top:lastFlag ? '-100px' : '30px', //区分最后一封邮件
                left: offsetLeft + "px"
            });
        },
        
        /*判断发件人是否自己*/
        isMe:function(){
            var account = $Email.getEmail(this.account);
            return $.inArray(account,$User.getAccountListArray()) > -1;
        },

        /**
        * 工具栏更多操作菜单
        * 发件人是自己时不需要回复按钮
        */
        render:function(){
           var self = this;
           var html = '';
           var reply = this.template.reply; // 回复
           var toolbar = this.template.toolbar; 
           if(self.isMe()){
                html = toolbar;     
           }else{
                html = reply + toolbar;
           }
           $(self.el).html(html);
           self.initEvents();
        }

    }));
    
    
})(jQuery, _, M139);     
  

