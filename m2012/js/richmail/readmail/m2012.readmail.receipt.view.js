/**
* @fileOverview 已读回执功能
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    
    /**
    * @namespace 
    * 已读回执功能
    */   
         
    M139.namespace('M2012.Receipt.View', superClass.extend({

        /**
        *@lends M2012.Receipt.View.prototype
        */

    el:"body",

    events:{},
    
    template:{
        poptips:['<div class="norTips">',
                    '<span class="norTipsIco">',
                        '<i style="display:none" class="MB_Icon">',
                        '</i>',
                    '</span>',
                    '<dl class="norTipsContent">',
                        '<dd class="norTipsLine MB_MessageBox_Content">',
                            "对方要求发送已读回执,是否发送?<br />",
                            "<label for='returnReceipt'>",
                            "<input id='returnReceipt'  type='checkbox' />",
                            "&nbsp;以后都按本次操作",
                            "</label>",
                        '</dd>',
                    '</dl>',
                '</div>']
    },
    
    initialize: function(){
        var self = this;
        this.model = new M2012.Receipt.Model();
        var readReceipt = self.model.get("readReceipt");
        return superClass.prototype.initialize.apply(this, arguments);
    },
    
    
    initEvents:function(){
        var self = this;
        var fid = self.model.get("mailListData").fid;
        self.model.getAttrs(function(result){           
            var action = result.preference_receipt;
            if (action == self.model.get("askMe") || action === null) {
                self.render();
            }
            if (action == self.model.get("alwaysSend")) {
                window.setTimeout(function(){
                    self.model.sendMDN();
                },500);
            }
                
        });
    },
    
    //输出对话框
    render:function (){
        var self = this;
        var html = self.template.poptips.join('');
        $Msg.showHTML(
            html,
            function(e){
                if($("#returnReceipt").attr("checked")){
                    //设置以后都发送
                    self.model.setAlwaysSend(function(result){ 
                         //两个提示冲突，这里不再设置提示
                    })
                }
                self.model.sendMDN(function(result){
                    M139.UI.TipMessage.show("发送回执成功",{delay:3000});      
                });
                
               
            },
            function(){
                if($("#returnReceipt").attr("checked")){
                    //设置以后不发送
                    self.model.setNotSend(function(result){ 
                        M139.UI.TipMessage.show("发送回执设置成功",{delay:3000});
                    })
                }
            },
            {
                buttons:["确定","取消"],
                dialogTitle:'发送回执',
                icon:"warn" //showhtml不支持icon?
            }
        );
   
    }


}));
    
})(jQuery, _, M139);    


