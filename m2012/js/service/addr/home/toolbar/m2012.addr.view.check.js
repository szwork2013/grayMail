;
(function ($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.View.Check";

    if (window.ADDR_I18N) {
        var message = ADDR_I18N[ADDR_I18N.LocalName];
        var vipMsg = message.vip;
        var pageMsg = message.home;        
    }

    M.namespace(_class, M.Model.ModelBase.extend({

        name: _class,

        initialize: function (options) {
            var _this = this;            
            superClass.prototype.initialize.apply(_this, arguments);

            _this.options = options;
            _this.tool = options.tool;;
            _this.model = options.model;
        },

        init: function(){
            this.checkContact();
        },

        checkContact: function(){

            var serviceItem = this.tool.getServiceItem();
            var msg = {
                lang_01: pageMsg['warn_emailover'] + ', ' + pageMsg['warn_emailoverreducetip'],
                lang_02: pageMsg['warn_emailover'] + ', ' + pageMsg['warn_emailovergradetip'],
                lang_03: pageMsg["warn_noneselect"]

            };  

            if (this.options.len == 0) {                
                top.M139.UI.TipMessage.show(msg.lang_03, { delay: 2000, className: 'msgYellow'});
            } else if (this.options.maxSend && this.options.len > this.options.maxSend) {                    
                var tip = serviceItem == '0017' ? msg.lang_01 : msg.lang_02;                
                this.tool.alert(tip.replace('$maxsend$', this.options.maxSend), { isHtml: true });
            } else {
                this.onCheck(this.options.len);
            }            
        },

        checkType: function(type){

            var contact = this.options.selContact;
            var msg = {
                lang_01: '邮箱地址',
                lang_02: '邮箱',
                lang_03: '手机号码'
            };

            if (type == "e") {
                if ((!contact.FamilyEmail || $.trim(contact.FamilyEmail) == "") &&
                    (!contact.BusinessEmail || $.trim(contact.BusinessEmail) == "")) {
                    this.showNext(msg.lang_01, msg.lang_02, type);
                    return false;
                }
            }
            else if (type == "m") {
                //如果已在通讯录，则检测完善手机号步骤
                //如果没在通讯录，则是未保存的最近联系人，这时就还需要添加联系人操作
                if (!contact) {
                    this.showNext(msg.lang_03, msg.lang_03, type);
                    return false;
                }

                if ((!contact.MobilePhone || $.trim(contact.MobilePhone) == "") &&
                    (!contact.BusinessMobile || $.trim(contact.BusinessMobile) == "")) {
                    this.showNext(msg.lang_03, msg.lang_03, type); //请输入手机号码
                    return false;
                }
            }

            return true;
        },
        showNext:function(title, name, type){
            var _this, options, msg, ui, dialog;

            _this = this;
            options = {};
            this.nextHtml = this.tool.getNextHtml(name);

            msg = {
                lang_01: '联系人资料没有' + title,
                lang_02: title + '不能为空'
            };

            this.dialog = this.tool.showHTML(this.nextHtml, msg.lang_01);            

            ui = {};
            ui.el = this.dialog.$el;
            ui.message = ui.el.find("#txtMessage");
            ui.btnNext = ui.el.find("#btnNext");
            ui.txtValue = ui.el.find("#txtValue");
            ui.message.css({'width': '240px', 'padding-left': '111px'});

            ui.btnNext.click(function () {
                var inputValue = ui.txtValue.val().trim();

                if (inputValue == "") {
                    ui.message.text(msg.lang_02);
                    return false;
                }

                if (!_this.checkInput(inputValue)) {
                    ui.message.text(top.Contacts.validateAddContacts.error);
                    return false;
                }

                if(type == "m"){
                    top.BH('addr_null_mobli');
                }else{
                    top.BH('addr_null_mail');
                }

                options.error = function(result){
                    _this.tool.alert(result.msg);
                };

                options.inputV = inputValue;
                _this.toNext(options);


            });

            if(type == "m"){
                top.BH('addr_pageLoad_leadMobli');
            }else{
                top.BH('addr_pageLoad_leadEmail');
            }
        },
        toNext:function (options) {
            /*
            类型验证type:
            Mail表示发邮件,
            PCard表示明信片,
            GCard表示发贺卡,
            MMS表示发彩信，
            SMS表示发短信，
            Fax表示发传真
            */
            switch (this.options.sendType) {
                case "Mail":
                    this.sendMail(options);
                    break;
                case "GCard":                        
                    this.sendCard(options);
                    break;
                case "MMS":
                    this.sendMMS(options);
                    break;
                case "SMS":
                    this.sendSMS(options);
                    break;
            }
        },
        checkInput: function(inputValue){

            var options = this.options;
            var msg = {
                lang_01: top.frameworkMessage['warn_contactMobileToolong'],
                lang_02: pageMsg['error_emailIllegal'],
                lang_03: top.frameworkMessage['warn_contactEmailToolong']
            };

            if (options.sendType == "MMS" || options.sendType == "SMS") {
                if (inputValue && !top.Validate.test("mobile", inputValue)) {
                    top.Contacts.validateAddContacts.error = top.Validate.error;
                    return false;
                }
                if (inputValue && inputValue.getByteCount() > 100) {
                    top.Contacts.validateAddContacts.error = msg.lang_01;
                    return false;
                }
            } else if (options.sendType == "Fax") {
                if (inputValue && !top.Validate.test("fax", inputValue)) {
                    top.Contacts.validateAddContacts.error = top.Validate.error;
                    return false;
                }
            } else {
                if (!top.Validate.test("email", inputValue)) {
                    top.Contacts.validateAddContacts.error = msg.lang_02;
                    return false;
                }
                if (inputValue && inputValue.getByteCount() > 60) {
                    top.Contacts.validateAddContacts.error = msg.lang_03;
                    return false;
                }
            }

            return true;
        },
        sendMail: function(options){
            var _this = this;
            var msg = {
                lang_01: '成功编辑通讯录联系人_发邮件'
            };

            options.selContact = _this.options.selContact;
            options.success = function(result){
                _this.options.selContact.FamilyEmail = options.inputV;
                _this.options.selContact.emails.push(options.inputV);                
                var composeParms = '"{0}"<{1}>'.format(options.selContact.name, options.inputV);

                top.$Evocation.create({
                    'to':'4',
                    'type': '1',
                    'specify': composeParms
                });

                top.BH(msg.lang_01);
                _this.dialog.close();
                _this.onSuccess(_this.options.selContact);
            };
            
            _this.model.sendMail(options);
        },
        sendCard: function(options){
            var _this = this;
            var msg = {
                lang_01: '成功编辑通讯录联系人_发贺卡'
            };

            options.selContact = _this.options.selContact;
            options.success = function (result){
                _this.options.selContact.FamilyEmail = options.inputV;
                _this.options.selContact.emails.push(options.inputV);

                top.$Evocation.create({
                    'to':'4',
                    'type': '4',
                    'specify': options.inputV
                });

                top.BH(msg.lang_01);
                _this.dialog.close();
                _this.onSuccess(_this.options.selContact);                
            };

            _this.model.sendCard(options);
        },
        sendMMS: function(options){
            var _this, receiver, msg;

            _this = this;
            msg = {
                lang_01: '成功编辑通讯录联系人_发彩信'
            };

            options.selContact = _this.options.selContact;
            options.success = function(result){
                _this.options.selContact.MobilePhone = options.inputV;
                _this.options.selContact.mobiles.push(options.inputV);

                if(_this.tool.checkAvaibleForMobile()){                    
                    receiver = options.inputV.replace(/\D/g, "");
                    top.$Evocation.create({
                        'to':'4',
                        'type': '3',
                        'specify': receiver
                    });
                }

                top.BH(msg.lang_01);
                _this.dialog.close();
                _this.onSuccess(_this.options.selContact);                
            };

            _this.model.sendMMS(options);
        },
        sendSMS: function(options){
            var _this, receiver, msg;

            _this = this;
            msg = {
                lang_01: '成功编辑通讯录联系人_发短信'
            };

            options.selContact = _this.options.selContact;
            options.success = function(result){
                _this.options.selContact.MobilePhone = options.inputV;
                _this.options.selContact.mobiles.push(options.inputV);

                if(_this.tool.checkAvaibleForMobile()){
                    receiver = options.inputV.replace(/\D/g, "");
                    top.$Evocation.create({
                        'to':'4',
                        'type': '2',
                        'specify': receiver
                    });
                }

                top.BH(msg.lang_01);
                _this.dialog.close();
                _this.onSuccess(_this.options.selContact);                
            };

            _this.model.sendMMS(options);
        },
        onCheck: function(){

        },
        onSuccess: function(){

        }
}));

})(jQuery, _, M139);
