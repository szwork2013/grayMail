/**
* @fileOverview 信纸成功页视图层--发件人改名设置
* @namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Compose.View.Success.SaveContact', superClass.extend(
    {
        elModule: $("#addContact"),
        Temple: ['<strong class="writeOk_box_title">{title}</strong>',
                '<ul id="writeOKBoxList" class="writeOk_box_list" style="{height}">',
                '{list}',
                '</ul>',
                '{isAuto}'].join(""),
        ItemTemple:'<li email="{email}">{isAuto}<span type="name">{name}</span>&lt;<span type="email">{email}</span>&gt;</li>',
        saveTemple:['<div class="writeOk_box_btn clearfix">',
                    '<a href="javascript:top.BH(\'wOk_sContacts_save\');" id="manualSave" class="btnSetG"><span>确 定</span></a>',
                    '<a href="javascript:top.BH(\'wOk_sContacts_openauto\');" id="openAndSave" class="writeOk_box_a">开启自动保存</a>',
                    '</div>'].join(""),
        onlySaveTemple:[ '<div class="writeOk_boxOther clearfix">',
                '<i class="i_ok_min"></i>',
                '<div class="writeOk_boxOther_right">',
                    '<strong>保存成功</strong>',
                    '<p>您还可以 <a href="javascript:top.BH(\'wOk_sContacts_openauto1\');">开启自动保存</a> 下次将自动保存联系人到通讯录</p>',
                '</div>',
                '</div>'].join(""),
        onlyOpenTemple : [ '<div class="writeOk_boxOther clearfix">',
                '<i class="i_ok_min"></i>',
                '<div class="writeOk_boxOther_right">',
                    '<strong>开启成功</strong>',
                    '<p>将自动保存联系人到通讯录</p>',
                '</div>',
                '</div>'].join(""),
        failTemple: [ '<div class="writeOk_boxOther clearfix">',
                    '<i class="i_warn_min"></i>',
                    '<div class="writeOk_boxOther_right">',
                        '<strong>网页君开小差啦，保存不成功</strong>',
                        '<p class="mt_10"><a class="btnSetG" href="javascript:;"><span>重新保存</span></a></p>',
                    '</div>',
                    '</div>'].join(""),
        savedTemple: '<div class="writeOk_boxOther_bottom">已保存{name}到通讯录</div>',

      
        initialize: function () {
            this.initData();
            this.render();
            return superClass.prototype.initialize.apply(this, arguments);
        }, 
        
        initData:function(){
            var isAuto = top.Contacts.isAutoSaveContact();
            var list = this.model.getReceversArray();
            list = this._filterUnSave(list);
            this.model.set({
                list:list,
                currentItem:null,
                isAuto:isAuto
            });
        },

        render:function(){ 

            //如果是空的，则不执行下去
            var list = this.model.get('list');
            if(!list.length){return;}

            this.setHtml();
            this.eventInit();
        },

        setHtml:function(){
            var self = this;
            var listHtml = "";
            var ulHtml = "";
            var isAuto = self.model.get('isAuto')
            var list = self.model.get('list');
            var input = isAuto?'':'<input type="checkbox" checked="true" class="checkbox">';
            var isAutoHtml = isAuto?'':self.saveTemple;
            var height = list.length>5?'height:150px':'';
            var title = (isAuto?'已':'') + '保存联系人（'+list.length+'人）到通讯录'

            for(var i in list){
                listHtml += $T.format(self.ItemTemple,{
                    isAuto:input,
                    name:'"'+ list[i].name + '"',
                    email:list[i].email
                });
            }
            html = $T.format(self.Temple,{
                title:title,
                list:listHtml,
                height:height,
                isAuto:isAutoHtml
            });
            self.elModule.html(html).show().find('li:even').addClass('writeOk_hover');
            isAuto && self._aotoSave();
            var bh = isAuto?'wOk_sContacts_showauto':'wOk_sContacts_show';
            top.BH(bh);
        },

        eventInit:function(){
            var self = this;
            this.liDazzle(); 
            this.model.on('change:currentItem',function(){
                var item = self.model.get('currentItem');
                var obj = top.Contacts.getSingleContactsByEmail(item.email);
                if(obj){
                    var info = {
                        name:item.name,
                        email:item.email,
                        mobile:"",
                        groupId:[]
                    }
                    top.M2012.Contacts.API.editContacts(obj.SerialId, info, function (result) {
                        if (result.success) {                        
                            top.M139.UI.TipMessage.show("修改成功", { delay: 3000 });
                        } 
                    });
                }
            });
            $('#manualSave').click(function(){
                self._aotoSave(function(e){
                    if(e.success == true){
                        self.sucOnlySave();
                    }
                });
            });
            $('#openAndSave').click(function(){
                self._aotoSave(function(e){
                    if(e.success == true){
                        self.openAndSave(e);
                    }
                });                
            });

            $('input:checkbox').bind({
                'click':function(){
                    top.BH('wOk_sContacts_checked');
                }
            });
        },

        openAndSave:function(e){
            var self = this;
            var list = e.list;
            var name = [];
            for(var i in list){
                var nameStr = '“<span>'+list[i].AddrFirstName+'</span>”'
                name.push(nameStr);
            }
            var names = name[0];
            if(name.length>1){
                names +='等'+name.length+'位联系人';
            }
            var html = $T.format(self.savedTemple,{name:names})

            self.openAuto(function(){
                self.elModule.append(html);
            })
        },

        sucOnlySave:function(){
            var self = this;
            self.elModule.html(self.onlySaveTemple).find('a').click(function(){
                self.openAuto();
            });
        },

        openAuto:function(callback){
            var self = this;
            top.$App.setUserCustomInfoNew({9:1},function(){
                self.elModule.html(self.onlyOpenTemple);
                callback && callback();
            });
        },

        _aotoSave:function(callback){
            var self = this;
            self.liOut();
            var Domlist = self.elModule.find('li');
            var list = [];
            if(self.elModule.has('input:checkbox').length){
                Domlist = Domlist.filter(function(){return $(this).has('input:checked').length});
                if(Domlist.length == 0){
                    offset = $("#writeOKBoxList").offset();
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
            }
            list = Domlist.map(function(e){return $(this).text()}).get();
            var subject = this.model.getSubject();
            top.M2012.Contacts.API.addSendContacts({
                type: "email",
                from: 0,
                list: list,
                subject: subject,
                autoSave: true
            }, function (result) {
                console.log(result);
                callback && callback(result);
            });
        },

        liHover:function(li){
            var locked = this.model.get('lock');
            var isAuto = this.model.get('isAuto');
            if(locked){return;}
            var dom = li || this.elModule.find('li');
            var input = '<input type="text" maxlength="16" class="writeOk_box_input" value="{value}">';
            $(dom).find('span[type=name]').replaceWith(function(){
                var value = $(this).text().slice(1,-1);
                return $T.format(input,{value:value});
            });
            
            var bh = isAuto?'wOk_sContacts_hoverauto':'wOk_sContacts_hover';
            top.BH(bh);

        },

        liOut:function(li,name){
            var dom = li || this.elModule.find('li');
            var span = '<span type="name">{text}</span>';
            var input =  $(dom).find('input:text');
            input.replaceWith(function(){
                var text = '"' + (name || $(this).val()) + '"';
                return $T.format(span,{text:text});
            });
        },

        liDazzle:function(){
            var self = this;
            self.elModule.find('li').bind({
                'mouseenter':function(){
                    var locked = self.model.get('lock');
                    if(!locked){
                       self.liHover(this);
                    }
                },
                'mouseleave':function(){   
                    var locked = self.model.get('lock');
                    if(!locked){
                       self.liOut(this);
                    }
                },
                'click':function(){   
                    self.model.set('lock',true);
                    var li = this;
                    var email = $(this).attr('email');
                    if(!$(li).find('input:text').length){
                        var input = '<input type="text" maxlength="16" class="writeOk_box_input" value="{value}">';
                        $(li).find('span[type=name]').replaceWith(function(){
                            var value = $(this).text().slice(1,-1);
                            return $T.format(input,{value:value});
                        });
                    }
                    var dom   = $(this).find('input:text').addClass('writeOk_box_inputFocus').focus();
                    var name  = dom.val();  
                    var isAuto= self.model.get('isAuto');
                    var bh = 'wOk_sContacts_edite' + (isAuto?'auto':'');
                    top.BH(bh);
                    dom.bind({
                        'blur':function(){

                            self.model.set('lock',false);
                            var modifiedName = $(this).val();
                            if(name != modifiedName && isAuto){
                                self.model.set('currentItem',{email:email,name:modifiedName});
                            }
                            if($.trim(modifiedName) == ''){
                                self.liOut(li,name);
                            }else{
                                self.liOut(li);
                            }

                        },
                        'keyup':function(e){
                            if(e.keyCode == 13){

                                self.model.set('lock',false);
                                var modifiedName = $(this).val();
                                if(name != modifiedName && isAuto){
                                    self.model.set('currentItem',{email:email,name:modifiedName});
                                }
                                
                                if($.trim(modifiedName) == ''){
                                    self.liOut(li,name);
                                }else{
                                    self.liOut(li);
                                }

                            }
                        }
                    })
                }
            });
        },
        

        _filterUnSave:function(list){
            var i=0, newArr = [], email = '';
            for(i in list){
                email = this._formatEmail(list[i]);
                if(!top.Contacts.isExistEmail(email)){
                    newArr.push({
                        email:email,
                        //name:email.split('@')[0]
                        name: $TextUtils.htmlEncode($Email.getName(list[i]))
                    });
                }
            }
            return newArr;
        },

        _formatEmail:function(email){
            //return email.match(/<?([\d\w\-\.]+@[\d\w\.]+)>?/).pop();
            return email.match(/<?([^<@>]+@[\d\w\.]+)>?/).pop();
        }
    }));
})(jQuery, _, M139);

