/******************************* **************************************************************
 通讯录联系人详情页, 工具栏
 2014.08.06
 AeroJin 
 ***********************************************************************************************/
 ;
 (function ($, _, M139) {
    M139.namespace("M2012.Addr.ToolBar", function (options) {

        var _this = this;
        this.config = options.config;
        this.command = options.command;
        this.callback = options.callback;
        this.serialId = options.serialId;
        this.contactsModel = top.M2012.Contacts.getModel();

        this.TYPE = {
            moblie: '手机号码',
            email: '邮箱'
        }

        this.init = function(){
            this.createTool();
        };

        this.createTool = function(){
            var len = this.config.length;

            for(var i = 0; i < len; i++){                
                var options = this.setOptions(this.config[i]);
                M2012.UI.MenuButton.create(options);
            }
        };

        this.setOptions = function(item){
            var _this, options;

            _this = this;
            options = $.extend({}, item);
            options.eftSibling = false;
            options.rightSibling = false;
            options.container = this.byID(item.id);

            if(item.html){
                options.html = item.html;
            }
            
            if(item.menuItems){
                options.onItemClick = function(obj){
                    if(obj.action){
                        top.BH(obj.action);
                    }
                    _this.command[item.command](obj);
                };

                if(item.click){
                    options.onClick = function(obj){
                        if(options.action){
                            top.BH(options.action);
                        }                        
                        _this.command[item.click](options);                        
                    };

                    options.onClickBefore = function(e){                        
                        if(item.actionKey && item.actionKey.length){
                            top.BH(item.actionKey);
                        }

                        $('body').click();                        
                        return false;
                    };
                }else{
                    options.onClickShow = function(e){                        
                        if(options.action && options.action.length){
                            top.BH(options.action);
                        }                      
                    };
                }
            }

            if(!item.menuItems){
                options.onClick = function(obj){                    
                    _this.command[item.command](options);
                };
            }            

            return options;
        };

        this.byID = function(id){
            return document.getElementById(id);
        };

        this.next = function(type, callback) {
            var name = this.TYPE[type];
            var msg = {
                lang_01: '联系人资料没有{0}'.format(name)
            };

            this.dialog =  top.$Msg.showHTML(this.getHtml(name), msg.lang_01);            

            this.ui = {};
            this.ui.el = this.dialog.$el;
            this.ui.btnNext = this.ui.el.find("#btn-next");
            this.ui.txtValue = this.ui.el.find("#txt-value");
            this.ui.message = this.ui.el.find("#txt-message");

            this.ui.btnNext.click(function () {
                var value = _this.ui.txtValue.val().trim();
                if(_this.check(value, type)){
                    _this.save(value, type, callback);
                }
            });
        };

        this.save = function(value, type, callback){
            var options = {};
            var master = top.$Addr;
            var key = type == 'email' ? 'FamilyEmail' : 'MobilePhone';
            var groupId = _this.contactsModel.getContactsGroupById(this.serialId);

            //需要获取联系人组数据, 否则组数据会丢失
            options.data = _this.contactsModel.getContactsById(this.serialId);
            options.data[key] = value;
            options.data['GroupId'] = groupId.join(',');
            
            options.success = function(){
                _this.dialog.close();
                master.trigger(master.EVENTS.LOAD_MODULE, {
                    key: 'events:contacts',
                    actionKey: '120',
                    contactId: _this.serialId
                });

                callback && callback(value);
            };

            options.error = function(result){
                _this.ui.message.text(result.msg);
            };

            top.Contacts.execContactDetails(options.data, function (result) {
                if (result.success) {
                    options.success(result);
                } else {
                    options.error(result);                    
                }
            });                                
        };

        this.check = function(value, type) {
            var name = this.TYPE[type];

            if(value.length == 0){
                this.ui.message.text('{0}不能为空'.format(name));
                return false;
            }

            if(type == 'moblie' && !top.Validate.test("mobile", value)){
                this.ui.message.text('手机号码格式不正确，请输入3-20位数字');
                return false;
            }

            if(type == 'email' && !top.Validate.test("email", value)){
                this.ui.message.text('邮箱地址格式不正确。应如zhangsan@139.com，长度6-90位');
                return false;
            }

            return true;
        };

        this.getHtml = function(name){
            return '<div class="boxIframeMain">\
                        <ul class="form ml_20">\
                            <li class="formLine">\
                                <label class="label" style="width:28%;"><strong>请输入{0}</strong>：</label>\
                                <div class="element" style="width:70%;">\
                                    <input type="text" class="iText"  id="txt-value" maxlength="90" style="width:170px;">\
                                </div>\
                            </li>\
                            <li><div id="txt-message" name="divError" style="width:240xp;color:Red;padding-left:111px"></div></li>\
                        </ul>\
                    <div class="boxIframeBtn">\
                        <span class="bibBtn">\
                            <a href="javascript:void(0)"  id="btn-next"  class="btnSure"><span>下一步</span></a>\
                        </span>\
                    </div>\
                </div>\
            </div>'.format(name);        
        };

        this.init();
    });
})(jQuery, _, M139);
;
(function ($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.Detail";
    M.namespace(_class, M.Model.ModelBase.extend({

        name: _class,
        defaults: {
            state: '', //当前页面状态
            isShowMore: '', //控制非基础字段显示
            SerialId: ''                    
        },        
        initialize: function (options) {
            superClass.prototype.initialize.apply(this, arguments);
        },
        getContactsInfoById: function(options){
            top.M2012.Contacts.API.getContactsInfoById(options.serialId, function(result){
                if(result.success){
                    options.success(result.contactsInfo)
                }else{
                    options.error(result);
                }
            }, options);
        },
        addContacts: function(options) {
            var data = new top.M2012.Contacts.ContactsInfo(options.data);
            if(/nopic/.test(data.ImageUrl) || /nopic/.test(data.ImagePath)){
                data.ImageUrl = "";
                data.ImagePath = "";
            }
            top.Contacts.addContactDetails(data, function(result){
                if(result.success){
                    options.success(result);
                }else{
                    options.error(result);
                }
            });            
        },
        editContacts: function(options) {
            var data = new top.M2012.Contacts.ContactsInfo(options.data);
            if(/nopic/.test(data.ImageUrl) || /nopic/.test(data.ImagePath)){
                data.ImageUrl = "";
                data.ImagePath = "";
            }
            top.Contacts.editContactDetails(data, function(result){
                if(result.success){
                    options.success(result);
                }else{
                    options.error(result);
                }
            });
        },
        removeContacts: function(options){
            top.Contacts.deleteContacts(options.serialId, function(result){
                if(result.success){
                    options.success(result);
                }else{
                    options.error(result);
                }
            });
        },
        modContacts: function(options){
            top.Contacts.execContactDetails(options.data, function (result) {
                if (result.success) {
                    options.success(result);
                } else {
                    options.error(result);                    
                }
            });
        },
        addVip: function(options) {
            top.Contacts.addSinglVipContact(options); 
        },
        removeVip: function(options){
            top.Contacts.delSinglVipContact2(options); 
        }
    }));

})(jQuery, _, M139);

(function ($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Detail";  
    M.namespace(_class, M.View.ViewBase.extend({

        name: _class,

        el: "#main-from",

        events:{},

        STATE: {
            CREATE: 'create',
            EDIT: 'edit',
            READY: 'ready'
        },

        TIP: {
            TITLE_CREATE: '新建联系人',
            TITLE_EDIT: '编辑联系人',
            TITLE_READY: '查看联系人',
            IS_COVER: '{0}，是否覆盖？',
            IS_SAVE: '{0}，是否仍要保存？',
            SERVER_ERROR: '服务器连接超时!',
            SAVE_SUCCESS: '保存成功',
            SERVER_BUSY: '系统繁忙, 请稍后再试',
            CONFIRM_REMOVE: '确定删除当前联系人？',
            REMOVE_SUCCESS: '联系人删除成功',
            REMOVE_VIP_TIP: '确定取消“VIP联系人”？<br>其邮件将同时取消“VIP邮件”标记。'
        },
        //展开隐藏项需要配置class
        ACTION: {
            FamilyEmail: 'o-email',
            BusinessEmail: 'o-email',
            MobilePhone: 'o-moblie',
            BusinessMobile: 'o-moblie', 
            FamilyPhone: 'o-phone',
            BusinessPhone: 'o-phone',
            BusinessFax: 'o-phone',
            FamilyAddress: 'o-address',
            CompanyAddress: 'o-address'
        },

        toolConfig: [
            {text:'发邮件', id: 'tool-email', command:'post_handle', action: 'addr_contacts_mail', actionKey: 'addr_contacts_moreMail', evocation: '1', click:'post_email',
            menuItems: [
                {text: '发邮件', type: 'email', evocation: '1', action: 'addr_contacts_sendMail'}, 
                {text: '发贺卡', type: 'email', evocation: '4', action: 'addr_contacts_sendCard'}
            ]},
            {text:'发短信', id: 'tool-sms', command:'post_handle', action: 'addr_contacts_sms', actionKey: 'addr_contacts_moreSms', evocation: '2', click:'post_sms',
            menuItems: [
                {text: '发短信', type: 'moblie', evocation: '2', action: 'addr_contacts_sendSms'}, 
                {text: '发彩信', type: 'moblie', evocation: '3', action: 'addr_contacts_sendMms'}
            ]}            
        ],

        command: {}, //工具栏事件容器

        logger: new M139.Logger({ name: _class }),

        initialize: function (options) {
            var _this = this;
            _this.kit = options.kit;
            _this.model = options.model;
            _this.master = options.master;
            _this.contactsModel = top.M2012.Contacts.getModel();
            _this.singleModel = new M2012.Addr.Model.ContactsSingle();

            _this.initUI();
            _this.initEvents();
            _this.render();
            this.createTool();
            superClass.prototype.initialize.apply(_this, arguments);
        },
        initUI: function(){

            this.ui = {};
            this.ui.el = this.$el;
            this.ui.body = $('body');

            //容器
            this.ui.tool = this.$el.find('#tool');
            this.ui.title = this.$el.find('#title');
            this.ui.main = this.$el.find('#main-content');
            
            this.ui.mainBody = this.$el.find('#main-body');
            this.ui.mainButton = this.$el.find('#main-button');

            //按钮
            this.ui.btnBack = this.$el.find('#btn-back');
            this.ui.btnSave = this.$el.find('#btn-save');
            this.ui.btnCancel= this.$el.find('#btn-cancel');
            this.ui.btnEdit = $('#tool-edit');
            this.ui.btnRemove = $('#tool-remove');
            this.ui.btnAddVip = $('#tool-add-vip');
            this.ui.btnRemoveVip = $('#tool-remove-vip');

            //模版
            this.ui.tempEdit = $('#temp-edit');
            this.ui.tempReady = $('#temp-ready');
            this.ui.tempLoad = $('#temp-load');
        },
        //初始化事件
        initEvents: function () {
            var _this = this;
            var ui = this.ui;

            this.model.on('change:state',function(){
                var state = this.get('state');
                var html = ui.tempLoad.html();

                ui.mainBody.html(html);
                _this[state].render.call(_this);
            });

            this.model.on('change:isShowMore', function(){
                //控制非基础字段显示隐藏                
               if(this.get('isShowMore')){
                    ui.main.find('#contacts-more').show();
                    ui.main.find('#btn-more').parent().hide();
                    ui.main.find('#contacts-more li.default').show();
                }else{
                    ui.main.find('#contacts-more').hide();
                    ui.main.find('#btn-more').parent().show();
                }
            });

            this.model.on('change:SerialId',function(){
                var serialId = this.get('SerialId');
                if(serialId && top.Contacts.IsVipUser(serialId)){
                    ui.btnAddVip.hide();
                    ui.btnRemoveVip.show();
                }else{
                    ui.btnAddVip.show();
                    ui.btnRemoveVip.hide();
                }
            });

            this.singleModel.on('invalid', function(model, error){
                for(var key in error){
                    var input = _this.byName(key);
                    var tops =  input.offset().top;
                    var min = ui.main.offset().top;
                    var max = ui.main.height() + min;                    
                    if(tops < min || tops > max){
                        ui.main.scrollTop(tops + 20);
                    }

                    _this.kit.showTip(error[key], input, {delay: 3000});    
                }                
            });

            ui.btnBack.click(function(){
                var state = _this.model.get('state');
                _this[state].back.call(_this);
            });

            ui.btnCancel.click(function(){
                var state = _this.model.get('state');
                _this[state].back.call(_this);
            });

            ui.btnSave.click(function(){
                //统一验证
                var state = _this.model.get('state');
                if(_this.singleModel.isValid()){
                    _this[state].update.call(_this);
                }

                _this.behavior({
                    add: 'addr_addContact_save',
                    edit: 'addr_editContact_save'
                });
            });

            ui.btnEdit.click(function(){
                top.BH('addr_readyContact_edit');
                _this.model.set({state: _this.STATE.EDIT});
            });

            ui.btnRemove.click(function(){
                //删除联系人
                top.BH('addr_readyContact_delete');
                _this.remove();            
            });

            ui.btnAddVip.click(function(){
                //添加vip联系人
                _this.addVip();
                top.BH('addr_readyContact_addVip');
            });

            ui.btnRemoveVip.click(function(){
                //取消vip联系人
                _this.removeVip();
                top.BH('addr_readyContact_removeVip');
            });

            $(window).resize(function () {
                var marginTop = 0;
                var headHeight = _this.$el.find('.main-rows').height() * 2;
                var winHeight = $(window).height() - headHeight - marginTop;
                
                ui.main.css({ height: winHeight });
            });

            $(window).resize();
        },
        //初始化编辑状态各种事件
        regMainEvent: function(){
            var _this = this;
            var ui = this.ui;

            //自动截手机号为邮箱
            ui.main.find('#MobilePhone').change(function(e){
                //手机号支持分隔符“-”,输入手机号 自动填充移动手机邮箱时过滤掉手机号分隔符10.9
                var email = ui.main.find('#FamilyEmail');
                var mobile = e.target.value.replace(/\D/g, "");
                var domain = top.mailDomain || top.coremailDomain;
                var isFix = ($Mobile.isMobile(mobile) && email.val().trim().length == 0);

                if (isFix) {
                    email.val(mobile + "@" + domain); 
                }
            });

            //自动截手机帐号为手机号
            ui.main.find("#FamilyEmail").change(function(e){
                var mobile = ui.main.find("#MobilePhone");
                var email = top.Utils.parseSingleEmail(e.target.value);
                var isFix = ( email != null 
                    && $Mobile.isMobile(email.name)
                    && mobile.val().trim().length == 0);

                if (isFix) {
                    mobile.val(email.name);
                }
            });

            ui.main.find('input[type=text],textarea').blur(function(){
                var obj = {};
                var name = $(this).attr('name');
                var value = $(this).val().trim();

                obj[name] = value;
                _this.singleModel.set(obj, {validate: true, target: name});
            });

            ui.main.find('input[type=text]').focus(function(){
                var name = $(this).attr('name');
                _this.kit.hideTip(name);
            });

            ui.main.find('input[name=UserSex]').click(function(){
                _this.singleModel.set({UserSex: this.value});
            });

            ui.main.find('#btn-more').click(function(){
                _this.model.set({isShowMore: true}, {silent: true});
                _this.model.trigger('change:isShowMore');

                _this.behavior({
                    add: 'addr_addContact_more',
                    edit: 'addr_editContact_more'
                });
            });

            ui.main.find('.btn-create').click(function(){
                var selector = 'li.{0}:hidden';
                var key = $(this).data('key');
                var clas = _this.ACTION[key];
                var element = ui.main.find(selector.format(clas));
                var len = element.length;

                if( len > 0){
                    element.eq(0).show();
                    if(--len <= 0){
                        $(this).hide();
                    }
                }
            });

            ui.main.find('.btn-remove').click(function(){
                var obj = {};
                var selector = 'li.{0}';
                var key = $(this).data('key');
                var clas = _this.ACTION[key];
                var element = ui.main.find(selector.format(clas));
                var len = element.length;

                //清空对象的数据
                obj[key] = '';
                _this.singleModel.set(obj, {silent: true});

                //ui操作
                $(this).closest('li').hide();
                $(this).closest('li').find('input').val('');
                element.eq(0).find('.btn-create').show();
            });

            ui.main.find('#btn-file').click(function(){
                _this.behavior({
                    add: 'addr_addContact_upload',
                    edit: 'addr_editContact_upload'
                });
            });

             //备注检测
            ui.main.find("#Memo").keydown(function(){
                if(this.value.length > 100){
                    this.value = this.value.substring(0,100);
                }
            });

            ui.main.find("#Memo").keyup(function(){
                if(this.value.length > 100){
                    this.value = this.value.substring(0,100);
                }
            });
        },
        render: function () {
            var serialId = $Url.queryString('id') || 0;
            var state = $Url.queryString('state') || this.STATE.CREATE;
            
            this.model.set({SerialId: serialId, state: state});
        },
        //初始化各种组件
        regWidget: function(obj){
            var _this = this;
                _this.widget = {};
            var serialId = this.model.get('SerialId');
            


            //初始化头像组件    
            var upLoad = {
                image: $('#face'),
                upLoadFile: $('#btn-file'),
                serialId: $.trim(serialId) == "0" ? "1" : serialId,
                callback: function(result) {
                    _this.singleModel.set({ImageUrl: result.imagePath});
                    _this.singleModel.set({ImagePath: result.imagePath});

                    _this.behavior({
                        add: 'addr_addContact_uploadSuccess',
                        edit: 'addr_editContact_uploadSuccess'
                    });
                }
            };
            this.widget.ImageUrl = new M2012.Addr.ImageUpload(upLoad);

            //初始化分组组件
            var group = {
                width: '138px',
                container: $('#box-group'),
                group: this.singleModel.get('GroupId').split(','),
                callback: function(result) {
                    _this.singleModel.set({GroupId: result.join(',')});
                }
            };

            group.onChange = function(){
                _this.behavior({
                    add: 'addr_addContact_groupSelect',
                    edit: 'addr_editContact_groupSelect'
                });
            };

            group.onRemove = function(){
                _this.behavior({
                    add: 'addr_addContact_groupRemove',
                    edit: 'addr_editContact_groupRemove'
                });
            };

            this.widget.GroupId = new M2012.Addr.GroupWidget(group);

            //初始化日期组件
            var birDay = {
                button: $('#btn-calender'),
                callback: function(result) {
                    var strDate = result.format('yyyy-MM-dd');
                    _this.ui.main.find('#BirDay').val(strDate);
                    _this.singleModel.set({BirDay: strDate}, {validate: true, target: 'BirDay'}); 
                }
            };
            this.widget.birDay = new M2012.Addr.View.CalenderChoose(birDay);

            //初始化家庭地址
            var fAddress = {
                provCode: this.singleModel.get('ProvCode'),
                cityCode: this.singleModel.get('CityCode'),
                address: this.singleModel.get('HomeAddress'),
                container: $('#home-address'),
                callback: function(result) {
                    _this.singleModel.set({ProvCode: result.provCode});
                    _this.singleModel.set({CityCode: result.cityCode});
                    _this.singleModel.set({HomeAddress: result.address});
                }
            };
            this.widget.FamilyAddress = new M2012.Addr.Address(fAddress);

            //初始化公司地址
            var cAddress = {
                provCode: this.singleModel.get('CPProvCode'),
                cityCode: this.singleModel.get('CPCityCode'),
                address: this.singleModel.get('CPAddress'),
                container: $('#cp-address'),
                callback: function(result) {
                    _this.singleModel.set({CPProvCode: result.provCode});
                    _this.singleModel.set({CPCityCode: result.cityCode});
                    _this.singleModel.set({CPAddress: result.address});
                }
            };
            this.widget.CompanyAddress = new M2012.Addr.Address(cAddress);
        },
        //创建顶部工具栏
        createTool: function(){
            var _this = this;
            var options = {
                command: this.command,
                config: this.toolConfig,
                serialId: this.model.get('SerialId')
            };            

            var open = function(type, value){
                top.$Evocation.create({
                    'to':'4',
                    'type': type,
                    'specify': value
                });
            };

            var send = function(obj, type){
                var specify = _this.getSpecify(type);
                if(specify.length > 0){
                    open(obj.evocation, specify);
                }else{
                    _this.tool.next(type, function(value){
                        open(obj.evocation, value);
                        _this.model.trigger('change:state');
                    });
                }
            };

            _this.command.post_email = function(obj){
               send(obj, 'email');
            };

            _this.command.post_sms = function(obj){
                send(obj, 'moblie');
            };

            _this.command.post_handle = function(obj){
                send(obj, obj.type);
            };

           this.tool = new M2012.Addr.ToolBar(options);
        },
        //顶部工具栏, 发邮件, 发短信, 根据类型获取数据, email,moblie
        getSpecify: function(type){
            var specify = '';

            if(type == 'email'){
                specify = this.singleModel.get('FamilyEmail')
                specify = specify.length > 0 ? specify : this.singleModel.get('BusinessEmail');
            }

            if(type == 'moblie'){
                specify = this.singleModel.get('MobilePhone')
                specify = specify.length > 0 ? specify : this.singleModel.get('BusinessMobile');
            }

            return specify;
        },
        //删除联系人
        remove: function(){
            //删除联系人
            var _this = this;

            var fun = function(){
                var options = {
                    serialId: _this.model.get('SerialId')
                };

                options.success = function(result) {
                    if(top.Contacts.IsVipUser(options.serialId)){
                        top.Contacts.updateCache("delVipContacts", options.serialId);
                    }

                    top.M139.UI.TipMessage.show(_this.TIP.REMOVE_SUCCESS, { delay: 2000});
                    _this.master.trigger(_this.master.EVENTS.LOAD_MODULE, {
                        key: 'events:contacts',
                        actionKey: '30',
                        contactId: [options.serialId]
                    });
                    _this.back();
                };

                options.error = function(result) {
                    top.M139.UI.TipMessage.show(result.msg, { delay: 2000, className: 'msgYellow'});
                };


                _this.model.removeContacts(options);               
            };

            top.$Msg.confirm(this.TIP.CONFIRM_REMOVE, fun);
        },
        //添加vip
        addVip: function(){
            //添加vip联系人
            var _this = this;
            var email = this.getSpecify('email');
            var vipInfo = top.Contacts.getVipInfo();
            var options = {
                serialId: this.model.get('SerialId')
            };

            options.success = function() {
                setTimeout(function(){                    
                    _this.model.trigger('change:SerialId');
                    _this.master.trigger(_this.master.EVENTS.LOAD_MODULE, {
                        key: 'events:contacts',
                        actionKey: '120',
                        contactId: [options.serialId],
                        groupId: vipInfo.vipGroupId
                    });
                },500);
            };

            if(email.length <= 0){
                _this.tool.next('email', function(value){
                    _this.model.addVip(options);
                    _this.model.trigger('change:state');
                });
            }else{
                this.model.addVip(options);
            }
        },
        //取消VIP联系人
        removeVip: function(){
            //删除vip联系人
            var _this = this;            
            var vipInfo = top.Contacts.getVipInfo();
            var options = {
                serialId: this.model.get('SerialId')
            };

            options.success = function() {
                setTimeout(function(){
                    _this.model.trigger('change:SerialId');
                    _this.master.trigger(_this.master.EVENTS.LOAD_MODULE, {
                        key: 'events:contacts',
                        actionKey: '120',
                        contactId: [options.serialId],
                        groupId: vipInfo.vipGroupId
                    });
                },500);
            };

            
            top.$Msg.confirm(this.TIP.REMOVE_VIP_TIP, function () {
                _this.model.removeVip(options);
            }, "", "", {isHtml:true});            
        },
        //日志上报, 判断当前状态(新增和编辑)分别上报日志
        behavior: function(bh){
            var state = this.model.get('state');

            switch(state){
                case this.STATE.CREATE:
                    top.BH(bh.add);
                break;
                case this.STATE.EDIT: 
                    top.BH(bh.edit);
                break;
                case this.STATE.READY: 
                    top.BH(bh.ready);
                break;
            }
        }, 
        byName: function(name){
            return this.ui.main.find('input[name=' + name + ']');
        },
        back: function(gotoHome) {
            if(gotoHome){//回到首页并选中所有联系人
                this.master.trigger(this.master.EVENTS.LOAD_MAIN);
                this.master.trigger(this.master.EVENTS.LOAD_MODULE, {
                    key: 'events:selectGroup',
                    command: 'SELECT_GROUP',
                    data: {
                        groupId: 0
                    }
                });
            }else{
                this.master.trigger(this.master.EVENTS.LOAD_MAIN);    
            }            
        },
        //编辑和保存时,刷新主页数据
        refresh: function(result){
            var groupsId = [];
            var master = this.master;
            var state = this.model.get('state');
            var actionKey = state == this.STATE.CREATE ? '10' : '20';

            if(result.newGroupId && result.newGroupId.length){
                groupsId = result.newGroupId.split(','); 
            }

            if(result.addGroupId){
                groupsId.push(result.addGroupId);            
                master.trigger(master.EVENTS.LOAD_MODULE, {
                    key: 'events:group',
                    actionKey: '140',
                    groupId: result.addGroupId
                });
            }
            
            master.trigger(master.EVENTS.LOAD_MODULE, {
                key: 'events:contacts',
                actionKey: actionKey,
                contactId: result.SerialId,
                groupId: groupsId
            });

            master.trigger(master.EVENTS.LOAD_MODULE, {
                key: 'remind:getMergeData'
            });                    
        
        },
        //新建时对象, 
        create: {
            render: function() {
                var _this = this;
                this.ui.tool.hide();
                this.ui.mainButton.show();
                this.ui.title.text(this.TIP.TITLE_CREATE);

                var options = {};
                    options.callback = function(contacts){
                        var info = _this.singleModel.getInfo();
                        var html = _this.ui.tempEdit.html();
                        var template = _.template(html, info);

                        _this.ui.mainBody.html(template);
                        _this.model.set({isShowMore: false}, {silent: true});
                        _this.model.trigger('change:isShowMore');

                        //事件和组件注册
                        _this.regMainEvent();
                        _this.regWidget();

                        var txtName = $('#AddrFirstName');
                        var value = txtName.val();
                        txtName.val('').focus().val(value);
                    };

                this.singleModel.getContacts(options);

                top.BH('addr_addContact_load');
            },
            update: function() {
                var _this = this;
                var options = {};

                options.data = _this.singleModel.getInfoByWrite();

                options.success = function(result) {
                    top.BH('addr_addContact_success');
                    top.M139.UI.TipMessage.show(_this.TIP.SAVE_SUCCESS, {delay: 1000});

                    _this.refresh(result);                    
                    _this.back(true);
                };

                options.error = function(result) {
                    switch(result.resultCode){
                        case "224" :
                        case "225" :
                        case "226" :
                        case "227" :{
                            var state = _this.STATE.EDIT;
                            var msg =  _this.TIP.IS_COVER.format(result.msg);
                            top.$Msg.confirm(msg, function(){
                                options.data['OverWrite'] = '1';
                                options.data['newRewrite'] = true;
                                options.data['SerialId'] = result.SerialId;

                                //编辑前设置状态, 但不触发change
                                _this.model.set({state: state}, {silent: true});
                                _this[state].update.call(_this, options.data);
                            });
                            break;
                        }
                        default:{
                            top.$Msg.alert(result.msg || this.TIP.SERVER_ERROR, {isHtml: true});
                            break;
                        }
                    }
                };

                this.model.addContacts(options);
            },
            back: function(){
                top.BH('addr_addContact_cancel');
                this.back();
            }
        },
        //编辑时对象
        edit: {
            render: function() {
                var _this = this;
                this.ui.tool.hide();
                this.ui.mainButton.show();
                this.ui.title.text(this.TIP.TITLE_EDIT);

                var options = {
                    serialId: this.model.get('SerialId')
                };

                options.callback = function(contacts){
                    var info = _this.singleModel.getInfo();
                    var html = _this.ui.tempEdit.html();
                    var template = _.template(html, info);

                    _this.ui.mainBody.html(template);

                    //事件和组件注册
                    _this.regMainEvent();
                    _this.regWidget();

                    var more = _this.ui.main.find('#contacts-more');
                    if(more.find('li.default:hidden').length == 0){
                        _this.model.set({isShowMore: true}, {silent: true});
                        _this.model.trigger('change:isShowMore');
                    }else if(more.find('li.default:visible').length == 0){
                        _this.model.set({isShowMore: false}, {silent: true});
                        _this.model.trigger('change:isShowMore');
                    }

                    $(window).resize();

                    var txtName = $('#AddrFirstName');
                    var value = txtName.val();
                    txtName.val('').focus().val(value);
                };

                this.singleModel.getContactsById(options);   

                top.BH('addr_editContact_load');             
            },
            update: function(data) {
                var _this = this;
                var options = {};

                options.data = data ? data : _this.singleModel.getInfoByWrite();
                
                options.success = function(result){
                    top.BH('addr_editContact_success');
                    top.M139.UI.TipMessage.show(_this.TIP.SAVE_SUCCESS, {delay: 1000});

                    //更新VIP邮件
                    if(top.Contacts.IsVipUser(result.serialId)){
                        top.Contacts.updateCache("editVipContacts",result.serialId);
                    }

                    _this.refresh(result);
                    _this.model.set({SerialId: result.serialId});
                    _this.model.set({state: _this.STATE.READY});
                };

                options.error = function(result){
                    switch(result.resultCode){
                        case "224" :
                        case "225" :
                        case "226" :
                        case "227" :{
                            var state = _this.model.get('state');
                            var msg = _this.TIP.IS_SAVE.format(result.msg);
                            top.$Msg.confirm(msg, function(){
                                options.data['OverWrite'] = '1';
                                options.data['newRewrite'] = false;
                                options.data['SerialId'] = options.data.SerialId;
                                _this[state].update.call(_this, options.data);
                            });
                            break;
                        }
                        default:{
                            top.$Msg.alert(result.msg || this.TIP.SERVER_ERROR, {isHtml: true});
                            break;
                        }
                    }
                };

                this.model.editContacts(options);
            },
            back: function(){
                top.BH('addr_editContact_cancel');
                this.model.set({state: this.STATE.READY});
            }
        },
        //只读状态时对象
        ready: {
            render: function() {
                var _this = this;

                this.ui.tool.show();                
                this.ui.mainButton.hide();
                this.ui.title.text(this.TIP.TITLE_READY);

                var options = {
                    serialId: this.model.get('SerialId')
                };

                options.callback = function(contacts){
                    var html = _this.ui.tempReady.html();
                    var template = _.template(html, contacts);

                    _this.ui.mainBody.html(template);                    
                };

                this.singleModel.getContactsById(options);

                top.BH('addr_readyContact_load');
            },
            update: function() {

            },
            back: function() {
                this.back();
            }
            
        }
    }));
    
    $(function(){
        var kit = new M2012.Addr.View.Kit();
        var model = new M2012.Addr.Model.Detail();
        var view = new M2012.Addr.View.Detail({model: model, master: top.$Addr, kit: kit});        
    });

})(jQuery, _, M139);
