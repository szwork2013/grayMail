/*   迷你写信页   */
(function (jQuery, Backbone, _, M139) {

    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace("Evocation.Letter.View", superClass.extend(
    {

        popHtml: 
            ['<div class="quicksend-box">',
                '<h3>现在，您可以通过本对话框快速发邮件啦！</h3> ',
                '<table class="writeTable">',
                    '<tbody>',
                        '<tr>',
                            '<th scope="row" width="65" style="padding-right:5px;" class="ta_r" valign="top">',
                                '收件人：',
                            '</th>',
                            '<td>',
                                '<div class="p_relative" style="z-index:3;">',
                                    '<div id="evocationContainer"></div>',
                                '</div>',
                            '</td>',
                            '<td width="30">',
                                '<a href="javascript:top.addBehaviorExt({ actionId: 104576 });" id="evocation_contacts" class="quick-add"><span class="heng"></span><span class="shu"></span></a>',
                            '</td>',
                        '</tr>',
                        '<tr>',
                            '<th scope="row" width="65" style="padding-right:5px;" class="ta_r" valign="top">                          ',
                            '发送内容：', //sdkfg sdfoiysdfkys
                            '</th>',
                            '<td >',
                                '<div  style="width:366px" class="textarea-qiucksend"><textarea id="evocation_content"></textarea></div>',
                            '</td>   ',
                            '<td width="30"> &nbsp;',
                            '</td> ',
                        '</tr>',
                        '<tr>',
                            '<th scope="row" width="65" style="padding-right:5px;" class="ta_r" valign="top">                          ',
                            '&nbsp;',
                            '</th>',
                            '<td colspan="2">',
                                '<p class="pb_5" style="display:none" id="evocation_sendTime"></p>',
                                '<p><a class="btnTb" id="evocation_send" href="javascript:void(0)" ><span>立即发送</span></a></p>',
                            '</td> ',
                        '</tr>',
                    '</tbody>',
                '</table>',
             '</div>'].join(""),


        initialize: function (options) {
            this.popWindow();
            this.initEvents();     //初始化事件
        },

        initEvents: function () {
            this.model.setLetterSendTime('邮件');
            this.model.addContacts('email');          //通信录组件接入            
            this.model.setcontent();     //设置预设内容
            this.letterSend();           //邮件发送事件绑定          
            $('#evocationContainer').parents('.boxIframe').eq(0).find('a.CloseButton').click(function () {
                top.addBehaviorExt({ actionId: 104577 });
                $(".menuPop.shadow").hide();
            })
        },

        /*******    写信页--弹窗           *********/
        popWindow:function(){        
            top.$App.evoctionPop = top.$Msg.showHTML(this.popHtml, {
                dialogTitle: "快速发送邮件",
                width: 500
            });
        },

        /*******    写信页--发送邮件事件绑定  *********/
        letterSend: function () {
            var self = this;
            $('#evocation_send').bind('click', function () {
                top.addBehaviorExt({ actionId: 104575 });
                if (self.model.richInput.getErrorText()) {
                    self.model.richInput.showEmptyTips("请正确填写收件人的邮箱地址");
                    return;
                }
                var address = self.model.richInput.getValidationItems(self.model.richInput);
                if (address.length == 0) {
                    self.model.richInput.showEmptyTips("请填写收件人")
                    return;
                }

                address = address.join(',')
                var mailInfo = {
                    email: address,
                    content: self.getcontent(),
                    subject: self.model.get("subject"),
                    showOneRcpt: 0,
                    callback: self.model.tips.letterSuccess,
                    scheduleDate: self.model.get('sendTime')
                }
                top.$PUtils.sendMail(mailInfo);

            })
        
        },

        /*******    写信页--设置预设内容  *********/
        setcontent: function () {
            var val = this.model.get("content");
            $('#evocation_content').val(val);    
        },
        
        /*******    写信页--获取邮件内容  *********/
        getcontent: function () {
            var content = $('#evocation_content').val();
            content = content.replace(/\n|\r/g, "<br />");
            return content;
        }
    }));
  
})(jQuery,Backbone,_,M139);