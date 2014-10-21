/**
* @fileOverview 邮件撤回功能
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;

    /**
    * @namespace 
    * 邮件撤回功能
    */

        M139.namespace('M2012.ReadMail.Recall.View', superClass.extend({

        /**
        *@lends M2012.ReadMail.Recall.View.prototype
        */

        el: "",

        template:{
            list:[
                '<p class="pl_20 pt_10" {style}>仅支持撤回发往@{domain}的邮件</p>',
 		        '<div class="chexiaoBox" id="recallbox">',
 				    '<table>',
 				        '<tbody>',
 				            '{listData}',
 				        '</tbody>',
 				    '</table>',
 		        '</div>'
            ].join(''),
            itemStart:'<tr><td colspan="2"><input type="checkbox" checked="checked" value="{val}" class="mr_5" id="{id}"><label for="{id}">{email}</label></td></tr>',
            itemResult:'<tr><td class="td1"><div>{email}</div></td><td class="td2"><span class="{color}">{tips}</span></td></li>',
            
            link:'<a href="javascript:;" id="recall">撤回邮件</a>'
        
        },

        initialize: function (options) {
            var self = this;
            this.model = new M2012.ReadMail.Recall.Model();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        
        
        /** 入口 */
        render:function(){
            var recallable = false;
            var fid = this.model.get('fid');
            var data = this.model.get('dataSource');
            var html = '';
            if(fid == 3){ //是否加开关？
                var recallText = '<a href="javascript:;" id="recall" class="che">[撤回邮件]</a>';
                if (data.flag && data.flag.recallok) {
                    html = "<a style='color:silver' title='邮件已经撤回' class='che'>[已撤回]</a>";
                }else if(data.flag && data.flag.recall) {
                    html = recallText;
                }
            }
            return html;
        },
        
        
        /** 打开列表 */
        showStartList:function(){
            
            var self = this;
            var temp = self.template.list;
            var itemTemp = self.template.itemStart;
            var listData = self.model.getReceiveAddrList();
            var list = [];
            self.model.set({receiveAddr:listData}); //所有地址数组
            
            for(var i = 0; i<listData.length; i++){
                list.push($T.Utils.format(itemTemp,{
                    id:'recall_' + i,
                    email:listData[i]
                }));
            }
            
            var html = $T.Utils.format(temp,{
                    style:'',
                    domain:$App.getMailDomain(),
                    listData:list.join('')
                });
                
            var dialog = $Msg.showHTML(
                html,
                function(){
                    self.submit();
                },
                function(){
                },
                {   
                    onClose:function(e){
                        e.cancel = false;
                        if( /确定/gi.test(e.event.target.innerText) && $('#recallbox').find('input:checked').length == 0){
                            e.cancel = true;//撤销关闭                        
                        }
                    },
                    width:480,
                    buttons:["确定","取消"],
                    dialogTitle:'请选择要撤回的邮件地址'
                }
            );
            
        },
        
        /** 结果列表 */
        showResultList:function(data){
            var self = this;
            var temp = self.template.list;
            var itemTemp = self.template.itemResult;
            var list = [];
            var msg = self.model.recallMsg;
            var color = 'red';
            for(var i in data){ //data是object
                var stat = $.trim(data[i]);
                if( stat == "2"){
                    color = 'c_009900';
                }
                list.push($T.Utils.format(itemTemp,{
                    color:color,
                    tips:msg[stat] || '',
                    email:i
                }));            
            }
            var html = $T.Utils.format(temp,{
                style:'style="display:none"',
                domain:'',
                listData:list.join('')
            });
            $Msg.showHTML(html,{
                width:480,
                dialogTitle:'撤回结果',
                buttons:["确定"]
            }); 
        },
        
        //确定操作
        submit:function(){
            var self = this;
            var checkedEmail = [];
            var receiveList = self.model.get('receiveAddr');
            $('#recallbox').find('input:checked').each(function(){
                var index = parseInt($(this).attr('id').split('_')[1]);
                checkedEmail.push(receiveList[index]); 
            })
            //console.log(checkedEmail);
            if(checkedEmail.length > 0 ){
                var options = {
                    mid:self.model.get('dataSource').omid,
                    rcpts:checkedEmail
                };
                self.model.callDataSource(options,function(data){
                    var msg = '';
                    if(data && data.code == 'S_OK'){
                        var okList = data['var'];
                        self.showResultList(okList);
                        return;
                    }else if(data.code == "FA_MAIL_NOT_FOUND"){
                        msg = self.model.tips.error1;
                    }else if(data.code == "FA_UNSUPPORT_RECALL"){
                        msg = self.model.tips.error2;
                    }else if(data.code == "FA_MAIL_EXPIRED"){
                        msg = self.model.tips.error3;
                    }
                    $Msg.alert(msg);                    
                });
            }else{
                $Msg.alert('请至少选择一个收件人帐号！');
            }
        },

        initEvents: function(){
            var self = this;
            $(self.el).click(function(){
                self.showStartList();
            }); 
        }

    }));
    

})(jQuery, _, M139);


