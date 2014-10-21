/**
* @fileOverview 读信页快捷回复
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    
    /**
    * @namespace 
    * 读信页快捷回复
    */   
         
    M139.namespace('M2012.ReadMail.View.QuickReply', superClass.extend({

    /**
    *@lends M2012.ReadMail.View.QuickReply.prototype
    */
        
    el:"",
    
    template:{
        replyAreaHtml:[
            '<table width="100%">',
                '<tbody><tr>',
                    '<td width="100" valign="top" id="quickReplyMenu">',
                    '</td>',
                    '<td valign="top">',
                        '<div class="readMailReplyMes-w">',
                        '<textarea class="readMailReplyMes" id="reply_textarea">来信已阅，我会尽快回复！</textarea>',
                        '</div>',
                    '</td>',
                    '<td align="right" valign="top" width="60" ><a id="quickreply_send" href="javascript:;" bh="readmail_quicksend" class="btnTb ml_5"><span>发 送</span></a></td>',
					
				'</tr>',
                '</tbody>',
            '</table>'
            ]
    },
    
    events:{
        "click #quickreply_send":"replySend"
    },
    
    initialize: function(){
       var self=this;
       this.model = new M2012.ReadMail.Model.QuickReply();  
       return superClass.prototype.initialize.apply(this, arguments);
    },
    
    initEvents:function(){
        var self = this;
        
        //监控输入框变化
        var textArea = $(self.el).find(".readMailReplyMes");
        textArea.focus(function(){
            $(this).addClass("focus-on");
        }).blur(function(){
            $.trim(textArea.val())=='' &&  $(this).removeClass("focus-on");
        });
        try{
            M139.Timing.watchInputChange(textArea[0], function () {
                if($.trim(textArea.val())!=''){
                    textArea.addClass("focus-on");
                }else{
                    textArea.removeClass("focus-on");
                }
            });   
        }catch(e){};
        var replyall = self.model.get("replyAll");
        
        var menuItems = [{text:"回复发件人",myData:0}];
        
        //if(replyall.indexOf(',')>-1){
            menuItems.push({text:"回复全部",myData:1});
        //}  
        
        var replyContainer = $(self.el).find("#quickReplyMenu");
             
        var dropMenu = M2012.UI.DropMenu.create({
            defaultText:"回复发件人",
            //selectedIndex:1,
            menuItems:menuItems,
            container:replyContainer
        });
        $(self.el).find("#quickReplyMenu>div").width(100);
        $(self.el).find(".dropDownText").attr("rel",'0');
        dropMenu.on("change",function(item){
            $(self.el).find(".dropDownText").attr("rel",item.myData);
            item.myData == '0' ? BH('readmail_quickreply') : BH('readmail_quickreplyall');
        });

        //发送
        /*$(self.el).find("#quickreply_send").click(function(){
            self.replySend();
        })*/
    },
	
	//回复邮件
    replySend: function (){
        var self = this;
		var mid = self.model.get("mid");
		var sender = self.model.get("sender"); //发件人
		var replyall = self.model.get("replyAll"); //回复全部人（已过滤不必要帐号）
		var content = $(self.el).find("#reply_textarea").val();
		var type = $(self.el).find(".dropDownText").attr("rel");
		var replyMessageData = {mid:mid};
		
		if($.trim(content) == ""){
		    $Msg.alert(self.model.tips.replyContentError);                     
		    return;
		}
		
		//省略验证邮件地址格式
		var enableQuote = $App.getConfig("UserAttrs").replyWithQuote == 1 ? true : false; //是否引用原文
		content = M139.Text.Utils.htmlEncode(content);
        content = content.replace(/\r/gm, '').replace(/\n/gm, '<br>');
		
		if(enableQuote){
            content += "<br/><br/><br/><br/><hr id=\"replySplit\"/>";
        }
        var postData = {
		    list:type == 0 ? sender : replyall, // 0 - 回复发件人  1- 回复所有
		    mid:mid,
		    content:content
		};
		var replyMessageData = {
		    mid:mid
		};
		
        M139.UI.TipMessage.show("正在发送邮件...");
		self.model.replyMessage(postData,replyMessageData,function(sendMailRequest){
            if(!enableQuote){
                sendMailRequest.attrs.content = content; //不带引文
            }else{
                
                //处理引文结构，引文内容加<div id="replyContent">引文内容</div>
                var replyCon = sendMailRequest.attrs.content,
                    splitflagstr = '<hr id="replySplit"/>';
                
                if(replyCon.indexOf(splitflagstr) > -1){
                    replyCon = replyCon.replace(splitflagstr, splitflagstr + '<div id="reply139content">');
                    replyCon += "</div>";
                    sendMailRequest.attrs.content = replyCon;        
                }
            }
            sendMailRequest && self.model.compose(sendMailRequest,function(flag){
                if(flag){
                    self.showSuccessBar();
                }else{
                    var failText = self.model.tips.replyFail;
                    M139.UI.TipMessage.show(failText, { delay:3000 });
                }
            });
        });
        
    },

    //快捷回复成功提示
    showSuccessBar:function(){
        var self = this;
        var replyContainer = $(self.el);
        var replyDoneContainer = replyContainer.siblings(".readMailReplyDone");
        var text = self.model.tips.replySuccess;

        replyContainer.hide();
        setTimeout(function(){
            M139.UI.TipMessage.show(text, { delay:3000 });
        },500);
        replyDoneContainer.show().find('a:eq(0)').click(function(){
            replyContainer.show();
            replyDoneContainer.hide();
        });

    },

    render: function () {
        var self = this;
        var sender = $Email.getEmail(this.model.get("sender")); //发件人
        if ($.inArray(sender, $App.getSysAccount()) > -1) { //系统邮件不显示快捷回复
            $(self.el).removeClass().html("");
        } else {
            var thisCode = self.template.replyAreaHtml.join('');
            $(self.el).html(thisCode);
        }
    }

}));
    
    
})(jQuery, _, M139);   


