/**
* @fileOverview 欢迎页好友生日提醒
* 第一期邮件到达通知是否不要？
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    
    /**
    * @namespace 
    * 欢迎页好友生日提醒
    */
    M139.namespace('M2012.Welcome.FriendBirthday.View', superClass.extend({

        /**
        *@lends M2012.Welcome.FriendBirthday.View.prototype
        */
        
        initialize:function(){
            this.model = new M2012.Welcome.FriendBirthday.Model();
            return superClass.prototype.initialize.apply(this, arguments);           
        },
        
        template:{
        
            birthday:['<div class="leftText2"><span class="texta">消息：',
                    '<i class="i_dg"></i>',
                    '你有<b>{count}</b>位好友即将过生日:&nbsp;<span>{friends}</span>',
                    '</span>',
                    '<a href="javascript:top.$App.jumpTo(\'greetingcard\',{birthday:1})" class="sendzf" bh="welcome_message">送祝福&gt;&gt;</a>',
                    '</div>'].join(''),
                  
            smsNotify:['<a href="javascript:;" id="testSmsnotify" bh="welcome_message">',
                            '<i class="i_lab"></i>立即测试邮件到达通知&gt;&gt;',
                       '</a>'].join('')
                  },

        render:function(){
            var self = this;           
            //top.M139.Timing.waitForReady('top.$App.getConfig("ContactData")',function(){
            top.$App.getModel("contacts").requireData(function () {
                if(self.model.get('isBirthdayLinkExist')){return}
                
                if(top.$App.getConfig("ContactData").birthdayContacts){
                    self.model.set({birthdayData:top.$App.getConfig("ContactData").birthdayContacts});
                    var data = self.model.get('birthdayData');
				    dataLength = data && data.length || 0;
    			    var birthdayNum = 0;
    			    
			        if (dataLength > 0) {//如果有好友过生日
				        self.model.set({isBirthdayLinkExist:true}); //标记提醒已经存在
				        var temp = self.template.birthday;
				        var friends = [];
				        
				        //console.log(data);
				        self.model.getCardRemind(function(carddata){
				            
                            if(carddata && carddata.mobiles.length>0){ //过滤已经发过贺卡的
                                for(var i=0; i<dataLength; i++){
				                    var mobilePhone = $.trim(top.$T.Mobile.remove86(data[i].MobilePhone));
				                    if(carddata.mobiles.join(',').indexOf(mobilePhone)==-1){
				                        var name = top.$App.getAddrNameByEmail(data[i].FamilyEmail) || top.$T.Utils.htmlEncode(data[i].AddrName);
				                        friends.push(name);    
				                        birthdayNum++;
				                    }
				                }
                            }else{ //没有发过贺卡的
                                for(var i=0; i<dataLength; i++){
				                    var name = top.$App.getAddrNameByEmail(data[i].FamilyEmail) || top.$T.Utils.htmlEncode(data[i].AddrName);
				                    friends.push(name); 
				                    birthdayNum++;
				                }
                            }
                            if (birthdayNum > 0) {
                                $(self.el).html(top.$T.Utils.format(temp, {
                                    count: birthdayNum,
                                    friends: friends.join('、')
                                }));
                            }
                            
                        })

			        } else {
				        //显示测试到达通知(暂时不做)
				        //$(self.el).html(self.template.smsNotify);
			        }
                }
            })
        }
}));
    
})(jQuery, _, M139);    