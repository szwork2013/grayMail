﻿/**
* @fileOverview 信纸成功页视图层--发件人改名设置
* @namespace 
*/
(function ($, _, M139) {
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Compose.View.Success.Addvip', superClass.extend(
    {
        elModule: $("#randomModule"),
        vipTipTemple:[ '<div class="writeOk_vip clearfix">',
                    '<img src="../images/global/vipNew.png" alt="" title="">',
                    '<div class="writeOk_vip_right">',
                        '<strong>设置VIP，轻松管理TA的邮件</strong>',
                        '<ul id="writeOKVipList" class="writeOk_vip_list">',
                            '{vipTipsList}',
                        '</ul>',
                        '<p class="writeOk_vip_btn"><a id="addvip" class="btnSetG" href="javascript:;"><span>添加为VIP联系人</span></a></p>',
                    '</div>',
                '</div>'].join(""),
        vipListTemple:['<li>',
                       '<input type="checkbox" name="checkbox" id="{serialId}" vipName="{name}" checked="true" class="checkbox">',
                       '“<span>{name}</span>”&lt;{email}&gt;',
                       '</li>'].join(''),
        SucTemple:[ '<div class="writeOk_boxOther clearfix">',
                    '<i class="i_ok_min"></i>',
                    '<div class="writeOk_boxOther_right">',
                        '<strong>{vipName}已成为VIP联系人</strong>',
                        '<p>去“VIP邮件”<a href="javascript:top.appView.searchVip();">查看TA的邮件&gt;</a></p>',
                    '</div>',
                '</div>'].join(""),
        initialize: function () {
            this.render();
            this.eventInit();
            return superClass.prototype.initialize.apply(this, arguments);
        }, 
        render:function(){ //别名设置          
            var self = this;  

            var vips = self.model.get('vip');
            var vip = {}, html = '', vipTipsList = [], listHtml = '';
            for(var i=0; i<vips.length; i++){
                vip = vips[i];
                listHtml = M139.Text.Utils.format(self.vipListTemple,{
                    serialId : vip.serialId,
                    name : $TextUtils.htmlEncode(vip.name),
                    email : vip.email
                });
                vipTipsList.push(listHtml);
            }
            html = M139.Text.Utils.format(self.vipTipTemple,{
                vipTipsList : vipTipsList.join(''),
                clickEvent : "vipSuccessView.addVip();"
            });
            self.elModule.html(html).show();
        },

        eventInit:function(){
            var self = this;
            self.elModule.find('a').click(function(){
	            var checked, offset;

                top.addBehaviorExt({ actionId: 105761});
                top.$App.closeNewWinCompose();
                checked = self.elModule.find("input:checked");

                if(checked.length == 0){
                    offset = $("#writeOKVipList").offset();
                    $("#tipsBox").css({
	                    top: offset.top - 30 + "px",
	                    left: offset.left + "px"
                    }).show();
                    clearTimeout(this.tipsTimer);
                    this.tipsTimer = setTimeout(function(){
	                    $("#tipsBox").hide();
	                }, 3000);
                    return;
                }
                var serialIds = [], vipNames = [];
                $.each(checked,function(i,n){
                    serialIds.push(n.id);
                    vipNames.push(n.getAttribute('vipName'));
                });
                var options = {type:"add",notAlert:true};
                top.Contacts.submitVipContact(serialIds,function(){
                    self.sucRender(vipNames);
                },options);
            })
        },
        sucRender:function(name){
            var self = this;
            for(var i=0; i<name.length; i++){
                name[i] = '“<span class="green">' + name[i] + '</span>”';
            }
            var name = name.join(',');
            var html = $T.format(self.SucTemple,{vipName:name});
            self.elModule.html(html);
        },

        failRender:function(){
            var self = this;
            self.elModule.html(self.trueNameFailTemple).find('a').click(function(){
                self.render();
            })
        }
    }));
})(jQuery, _, M139);
