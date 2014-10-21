
(function (jQuery, Backbone, _, M139) {

    M139.namespace("Evocation.Main.Model", Backbone.Model.extend(

    {
        initialize:function(){
            
        },
        defaults: {
            /*****    运营邮件传过来的参数      *******/
            type:0,                     //是哪种类型的运营唤出  letter | sms | mms | greetingcard
            to: 0,                      //是哪种类型的收件人    1. lastest | 2. clostest | 3. birthdayWeek | 4. specified
            specify:"",                 //指定收件人
            email: "",                  //收件人地址
            subject: "",                //发送预设主题， 用于写信页
            content: "",                //发送内容
            contentEditable: true,      //可编辑
            cardId: "",                 //贺卡ID，用户贺卡发送
            sendTime: '',               //定时发送时间
            showZoomSize: true,             //弹窗是否显示缩放按钮, 默认显示
            showZoomIn: false,             //弹窗是否默认放大, 默认显示

            isEdit: true,

            /*****    短信参数      *******/
            smsSending:0,

            /*****    贺卡参数      *******/
            curCardIndex: "",
            curCardObject: {},

            /*****    验证码参数      *******/
            validImage: '',

            /*****    彩信参数      *******/
            smsSending: 0,
            mmsIndex:'',
            mmsObject: {},
            validAgain:0,
			fromDisk: false,
			whereFrom : '',
            diskContent : "",
			diskContentJSON : [],
			fileContentJSON : [],
			attachContentJSON : [],
			attachmentsid : "",
            sucCallback: function(){}  //发送成功回调函数

        },

       letterSuccess: function () {
            var sucCallback = this.get('sucCallback');
            if(sucCallback) sucCallback();
            top.BH('evocation_compose_send_success');
            M139.UI.TipMessage.show("邮件已经发送", { delay: 2000 });
            top.$App.evoctionPop.close();
            try{
                var callback = this.get('callback');
                callback && callback();                
            }catch(e){
                console.log(e); 
            }
        },
        smsSuccess: function () {
            top.BH('evocation_sms_send_success');
            M139.UI.TipMessage.show("短信发送完成", { delay: 2000 });
            top.$App.evoctionPop.close();
            try{
                var callback = this.get('callback');
                callback && callback();                
            }catch(e){
                console.log(e);
            }
        },

        mmsSuccess: function () {
            top.BH('evocation_mms_send_success');
            M139.UI.TipMessage.show("彩信发送完成", { delay: 2000 });
            top.$App.evoctionPop.close();
            try{
                var callback = this.get('callback');
                callback && callback();                
            }catch(e){
                console.log(e);
            }
        },

        cardSuccess: function () {
            top.BH('evocation_card_send_success');
            M139.UI.TipMessage.show("贺卡已经发送", { delay: 2000 });
            top.$App.evoctionPop.close();
            try{
                var callback = this.get('callback');
                callback && callback();                
            }catch(e){
                console.log(e);
            }
        },
        getReiceiver: function (type) {
            var reciverType = this.get('to');

            if (!reciverType)
                return '';

            var contacts = []; 
            var receiver = []; 

            switch (reciverType + "") {
                case "1":
                    contacts = top.Contacts.data.lastestContacts;
                    break;
                case "2":
                    contacts = top.Contacts.data.closeContacts;
                    break;
                case "3":
                    contacts = top.Contacts.data.birthdayContacts;
                    break;
                case "4":
                    return this.get("specify");
                default:
                    return '';
            }

            //如果是生日，取FamilyEmail(邮件)，MobilePhone（短彩信）字段
            //如果是最近联系人、紧密联系人，取AddrContent字段            
            if (reciverType == 3) { 
                if(type == 'email'){
                    for(var i =0; i<contacts.length; i++){
                        receiver.push(contacts[i].FamilyEmail);
                    }                    
                }else if(type == 'mobile'){
                    for(var i =0; i<contacts.length; i++){
                        receiver.push(contacts[i].MobilePhone);
                    }                     
                }           
            }else{
                if(type == 'email'){
                    for(var i =0; i<contacts.length; i++){
                        if (contacts[i].AddrContent.indexOf('@') >= 0){
                            receiver.push(contacts[i].AddrContent);
                        }
                    }                    
                }else if(type == 'mobile'){
                    for(var i =0; i<contacts.length; i++){
                        if (contacts[i].AddrContent.indexOf('@') < 0){
                            receiver.push(contacts[i].AddrContent);
                        }
                    }     
                } 
            }

            //取前3位
            receiver = receiver.length > 3 ? receiver.slice(0, 3) : receiver;
            return receiver.join(',');
        },

        setcontent: function () {
            var val = this.get("content");
            $('#evocation_content').val(val);
        },

        /*******    设置定时邮件显示  *********/
        setLetterSendTime: function (name) {
            var name = name || '';
            var sendTime = this.get('sendTime');
            if (name == '邮件' || name == '贺卡') {
                if (sendTime) {  //有定时
                    var printTime = top.$Date.parse(sendTime);
                    var now = new Date();
                    var time = printTime.getTime();
                    if (now.getTime() < time) {  //定时邮件没有过时
                        time = printTime.getTime() / 1000;
                        this.set('sendTime', time);
                        printTime = top.$Date.format("yyyy年MM月dd日 hh:mm", printTime);
                        $('#evocation_sendTime').show().text("本" + name + "将于" + printTime + "发送");
                    } else {
                        this.set('sendTime', 0);
                    }
                } else {
                    this.set('sendTime', 0);
                }
            }else if (name == '短信' || name == '彩信') {
                if (sendTime) {  //有定时
                    var printTime = top.$Date.parse(sendTime);
                    var now = new Date();
                    var time = printTime.getTime();
                    if (now.getTime() < time) {  //定时邮件没有过时
                        this.set('sendTime', sendTime);
                        printTime = top.$Date.format("yyyy年MM月dd日 hh:mm", printTime);
                        $('#evocation_sendTime').show().text("本" + name + "将于" + printTime + "发送");
                    } else {
                        this.set('sendTime', '');
                    }
                }else {
                    this.set('sendTime', '');
                }
            }
        },

        setNumberOfSend: function (length) {//返回发送条数数据
            if (typeof length == 'undefined') {
                var nowLength = this.model.get('content').length;
            } else {
                var nowLength = length;
            };
            var left = 350 - nowLength;
            
            var num;
            if (nowLength == 0) {
                num = 0;
            } else if (nowLength > 70) {
                num = (nowLength % 67) == 0 ? parseInt(nowLength / 67) : parseInt(nowLength / 67) + 1;
            } else if (nowLength <= 70) {
                num = 1;
            }
            var num_send = this.richInput;
            if (num_send) {
                num_send = num_send.getAddrItems();
                num = num_send.length * num;
            }
            $('#evocation_sendNum b').eq(0).text(left);
            $('#evocation_sendNum b').eq(1).text(num);
        },

        /*******    通信录组件接入    *********/
        addContacts: function (contactType, sms) {
            var self = this;
            var first =0;
            var type = contactType || 'email';
            var maxSend;
            if(type == 'email'){
                maxSend = top.$User.getMaxSend();
            } else if (sms == 'sms' || sms == 'mms') {
                maxSend = self.get("groupLength") || 10;
            }
            var option = {
                container: document.getElementById('evocationContainer'),
                maxSend: maxSend,
                preventAssociate: true,
                type: type,
                highlight: false,
                border:'1px #fff solid',
                heightLime:120,
                errorfun: function () { }
            }
            if (sms == 'sms' || sms == 'mms') {
                option.errorfun = function (o, allText) {
                    if (o.addr && !$Mobile.isMobile(o.addr)) {
                        o.error = true;
                    } else if (o.addr && !$T.Mobile.isChinaMobile(o.addr)) {
                        //o.$el.css('color','#00f')
                        o.$el.attr("class", "addrBase addrBaseNew btnOther");
                    }
                };
                option.noUpgradeTips = true;
            }
            /*if (sms == 'mms') {
                option.errorfun = function (o, allText) {
                    if (o.addr && !$T.Mobile.isChinaMobile(o.addr)) {
                        o.error = true;
                    }
                };
                option.noUpgradeTips = true;
            }*/
            M139.core.utilCreateScriptTag({ src: "/m2012/js/packs/richinput.html.pack.js", charset: "utf-8" }, function () {
                self.richInput = M2012.UI.RichInput.create(option);
                self.richInput.render();

                if (sms == 'sms' || sms == 'mms') {
                    self.richInput.on("itemchange", function () {
                        var address = self.richInput.getAddrItems();
                        var length = $('#evocation_content').val().length;
                        if (sms == 'sms') {
                            self.setNumberOfSend(length);
                        }
                        var feeUsers = [];
                        for (var i = 0; i < address.length; i++) {
                            var reg = top.$T.Mobile.isChinaMobile(address[i]);
                            if (!reg) {
                                feeUsers.push(address[i]);
                            }
                        }
                        if (feeUsers.length > 0 && sms == 'sms') {
                            $('#tips strong').text(feeUsers.length);
                            var hasshow = $('#tips').attr('hasshow');
                            if(hasshow == '0'){
                                $('#tips').show();
                            }
                        }else if(feeUsers.length == 0 && sms == 'sms'){
                            $('#tips').hide();
                        }
                    });
                    
                    if(sms == 'sms'){
                        $('#tipsClose').bind('click', function () {
                            $('#tips').attr('hasshow','1').hide();
                        });
                    }
                }


                var receiver = self.getReiceiver(type);  //model层返回收件人字符串, 
                self.richInput.insertItem(receiver);
                
                /*******    通信录组件绑定  *********/
                $('#evocation_contacts').bind('click', function () {
                    var items = self.richInput.getValidationItems(self.richInput);
                    var view = top.M2012.UI.Dialog.AddressBook.create({
                        filter: type,
                        items: items
                    });
                    view.on("select", function (e) {
                        self.richInput.insertItem(e.value.join(";"));
                    });
                });
            });
        }
    }));
})(jQuery,Backbone,_,M139);