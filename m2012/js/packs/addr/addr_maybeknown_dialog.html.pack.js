/******************************* **************************************************************
 通讯录联系人详情页, 组控件
 2014.07.22
 AeroJin 
 ***********************************************************************************************/
;
(function ($, _, M139) {
    M139.namespace("M2012.Addr.GroupWidget", function (options) {
       
       var _this = this;
       this.width = options.width;
       this.group = options.group || [];
       this.isTopMenu = options.isTopMenu;
       this.groupMap = this.group.join(',');
       this.container = options.container || $('body');
       this.callback = options.callback || function(){};
       this.onChange = options.onChange || function(){};
       this.onRemove = options.onRemove || function(){};

       this.template = {
            list: '<li class="clearfix" data-value="<%=value%>">\
                    <span><%=html%></span>\
                    <a href="javascript:void(0)" class="closeMin btn-close"></a>\
                </li>',
            listBox: '<ul class="boxIframeAddr_list clearfix  pb_0" style="display:none;"></ul>'
        };

        this.init = function(){

            this.ui = {};
            this.ui.container = this.container;            
            this.ui.listBox = $(this.template.listBox);

            //存放选中组数据
            this.items = {};
            this.menuItems = [];

            //注册组件,绑定事件, 设置默认值
            this.regMenu();
            this.regEvent();
            this.setDefault();

            //填充UI
            this.ui.container.append(this.ui.listBox);
        };

        this.regMenu = function() {
            var model = top.M2012.Contacts.getModel();
            var data = model.getGroupList();
            var DropMenu = this.isTopMenu ? top.M2012.UI.DropMenu : M2012.UI.DropMenu;

            this.menuItems = [{
                value: '',
                html: '选择分组'
            }];

            for(var i = 0; i < data.length; i++){
                var item = {
                    value: data[i].id,
                    html: M139.Text.Html.encode(data[i].name)
                };

                this.menuItems.push(item);
            }

            this.dropMenu = DropMenu.create({
                selectedIndex: 0,
                menuItems : this.menuItems,
                container : this.ui.container
            });

            if(this.width){
                this.dropMenu.$el.width(this.width);
            }
        };

        this.regEvent = function() {
            this.dropMenu.on("change", function (e) {
                _this.add(e);
            });

            this.ui.listBox.delegate('a.btn-close', 'click', function() {
                var li = $(this).parent();
                var value = li.data('value');

                _this.remove(value, li);                
            });
        };

        this.setDefault = function() {
            if(this.groupMap.length > 0){
                for(var i = 1; i < this.menuItems.length; i++){
                    var items = this.menuItems[i];
                    if(this.groupMap.indexOf(items.value) > -1 && items.value.length > 0){
                        this.add(items);
                    }
                }
            }
        };

        this.add = function(e) {
            if(e.value.length > 0 && !this.items[e.value]){
                var template = _.template(this.template.list, e);

                this.items[e.value] = e;
                this.ui.listBox.append(template); 

                if(this.callback){
                    this.callback(this.getData().groups, e);
                }

                this.ui.listBox.show();
            }

            this.onChange(e);
            this.dropMenu.setSelectedIndex(0);
        };

        this.remove = function(id, li) {
            var item = this.items[id];

            if(item){
                li.remove();                
                delete this.items[id];

                if(this.callback){
                    this.callback(this.getData().groups, item);
                }
            }

            if(this.getData().groups.length <= 0){
                this.ui.listBox.hide();
            }

            this.onRemove(item || {});
        };

        this.getData = function(){
            var data = {
                groups: []
            };

            for(var key in this.items){
                data.groups.push(this.items[key].value);
            }

            return data;
        };       
       
       this.init();
    });

})(jQuery, _, M139);

(function ($, _, M) {

    //通讯录公共组件类
    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.MaybeknownDialog";  
    M.namespace(_class, M.View.ViewBase.extend({

        name: _class,

        STATE: {
            ONCE: 'once',
            BIS: 'bis'
        },

        TIP: {
            NAME_EMPTY: '请输入姓名',
            MOBLIE_ERROR: '手机格式错误,请输入3-20位数字',
            CONTACTS_MAX: '保存失败，联系人数量已达上限',
            ADD_FAIL: '添加失败',
            ADD_SUCCESS: '添加成功',
            ADD_CONTACTS: '添加联系人'
        },

        EL_WIDTH: '360px',

        MAX_HEIGHT: 160,

        el: '<div class="boxIframeMain">\
                <div class="boxIframeAddr clearfix">\
                    <img src="" id="may-image" width="70px" height="70px" />\
                    <div class="boxIframeAddr_ul" id="may-content">\
                        <ul class="form">\
                            <li class="clearfix">\
                                <label class="label">姓名：</label>\
                                <div class="element" style="position: relative;">\
                                    <input type="text" value="" name="name" id="may-name" class="iText" style="width:177px;">\
                                    <div class="tipsOther" id="may_tip" hidefocus="true" style="position: absolute; outline: none; left: 0; top: 0; z-index: 9999;display:none;">\
                                        <div class="tips-text" id="may_tip_content"></div>\
                                        <div class="tipsBottom  diamond" style="left:10px"></div>\
                                    </div>\
                                </div>\
                            </li>\
                            <li class="clearfix">\
                                <label class="label">邮箱：</label>\
                                <div class="element">\
                                    <input type="text" value="" name="email" class="iText" id="may-email" style="width:177px;">\
                                </div>\
                            </li>\
                            <li class="clearfix">\
                                <label class="label">手机：</label>\
                                <div class="element" style="position: relative;">\
                                    <input type="text" value="" name="moblie" class="iText" id="may-moblie" style="width:177px;">\
                                </div>\
                            </li>\
                            <li class="clearfix p_relative">\
                                <label class="label">分组：</label>\
                                <div class="element" id="may-group"></div>\
                            </li>\
                        </ul>\
                    </div>\
                </div>\
                <div class="boxIframeBtn">\
                    <span class="bibText"></span>\
                    <span class="bibBtn">\
                        <a class="btnSure" id="may-sbumit" href="javascript:void(0)"><span>确 定</span></a>\
                        <a class="btnNormal" id="may-cancel" href="javascript:void(0)"><span>取 消</span></a>\
                    </span>\
                </div>\
            </div>',

        logger: new M139.Logger({ name: _class }),

        initialize: function (options) {

            this.data = options.data;
            this.model = new M2012.Addr.Model.MaybeknownDialog();

            this.initUI();
            this.initEvents();
            this.render();
            superClass.prototype.initialize.apply(this, arguments);
        },
        initUI: function(){
            var _this = this;

            this.ui = {};
            this.ui.el = this.$el;
            this.ui.image = this.ui.el.find('#may-image');
            this.ui.input = this.ui.el.find('input');
            this.ui.txtName = this.ui.el.find('#may-name');
            this.ui.txtEmail = this.ui.el.find('#may-email');
            this.ui.txtMoblie = this.ui.el.find('#may-moblie');
            this.ui.btnSubmit = this.ui.el.find('#may-sbumit');
            this.ui.btnCancel = this.ui.el.find('#may-cancel');
            this.ui.groupBox = this.ui.el.find('#may-group');
            this.ui.content = this.ui.el.find('#may-content');
            this.ui.tip = this.ui.el.find('#may_tip');
            this.ui.tipContent = this.ui.el.find('#may_tip_content');           
            

            //注册组件
            this.regWidget();
        },
        initEvents: function () {
            var _this = this;
            var ui = this.ui;

            this.model.on('change:state', function(){
                var state = this.get('state');
                
                _this[state].render.call(_this);
            });

            ui.input.blur(function(){
                var obj = {};
                var name = $(this).attr('name');

                obj[name] = $.trim($(this).val());
                _this.model.set(obj);
            });

            ui.btnSubmit.click(function() {
                if(_this.check() && _this.isExist()){
                    var state = _this.model.get('state');
                    _this[state].update.call(_this);
                }

                top.BH('addr_whoAddMe_confirm');
            });

            ui.btnCancel.click(function() {
                _this.dialog.close();
                top.BH('addr_whoAddMe_cancel');
            });            
        },
        regWidget: function() {
            //初始化分组组件
            var _this = this;
            var group = {
                width: '120',
                isTopMenu: true,
                container: this.ui.groupBox,
                callback: function(result) {
                    _this.model.set({groupId: result.join(',')});
                }
            };

            group.onChange = function(){
                var height = _this.ui.groupBox.height();
                if(height > _this.MAX_HEIGHT && !_this.ui.content.hasClass('boxIframeAddr_ulHeight')){
                    _this.ui.content.addClass('boxIframeAddr_ulHeight');
                }                
                top.BH('addr_whoAddMe_select');
            };

            group.onRemove = function(){
                var height = _this.ui.groupBox.height();
                if(height <= _this.MAX_HEIGHT && _this.ui.content.hasClass('boxIframeAddr_ulHeight')){
                    _this.ui.content.removeClass('boxIframeAddr_ulHeight');
                }
                top.BH('addr_whoAddMe_remove');
            };

            this.group = new M2012.Addr.GroupWidget(group);
        },
        check: function(){
            var renVal = true;
            var ui = this.ui;
            var name = $.trim(ui.txtName.val());
            var moblie = $.trim(ui.txtMoblie.val());
            
            if(name.length <= 0){
                renVal = false;
                this.showTip(this.TIP.NAME_EMPTY, ui.txtName);
            }

            if(renVal && moblie.length > 0 && !/^\d{3,20}$/.test(moblie)){
                renVal = false;
                this.showTip(this.TIP.MOBLIE_ERROR, ui.txtMoblie);
            }

            return renVal;
        },
        isExist: function() {
            var state = this.model.get('state');
            var email = this.model.get('email');
            var mobile = this.model.get('mobile');

            if (top.Contacts.isExistEmail(email) || top.Contacts.isExistMobile(mobile)) {
                this[state].exist.call(this);
                return false;
            }

            return true;
        },
        render: function () {
            var state = this.data.RelationId.length == 0 ? this.STATE.BIS : this.STATE.ONCE;
             
             this.model.set({url: this.data.url});
             this.model.set({uin: this.data.UIN});
             this.model.set({name: this.data.Name});
             this.model.set({email: this.data.Email});             
             this.model.set({imageUrl: this.data.ImageUrl});
             this.model.set({relationId: this.data.RelationId});
             this.model.set({whoAddMeSetting: this.data.WhoAddMeSetting});
             this.model.set({mobile: this.data.UserNumber.replace(/^86/,"")});
             this.model.set({state: state});

             top.BH('addr_whoAddMe_loadDailog');
        },
        getContactsInfoById: function(info){
            var _this = this;
             var options = {
                serialId: info.SerialId
            }

            options.success = function(result) {
                var info = new top.M2012.Contacts.ContactsInfo();

                for (var key in result) {
                    info[key] = result[key];
                }

                info.name = _this.model.get('name');
                info.AddrFirstName = info.name;
                info.FamilyEmail = _this.model.get('email');
                info.MobilePhone = _this.model.get('mobile');
                info.GroupId = _this.model.get('groupId');
                info.OverWrite = _this.model.get('overWrite');
                info.ImageUrl = _this.model.get('imageUrl');

                _this.editContactDetails(info);
            };

            options.error = function() {

            };

            _this.model.getContactsInfoById(options);
        },
        editContactDetails: function(info) {
            var _this = this;
            var options = {
                info: info
            };

            options.success = function() {
                _this.closeDialog();
                _this.refresh(info);
                _this.onSuccess(_this.data);
                top.BH('addr_whoAddMe_add_success');
                top.M139.UI.TipMessage.show(_this.TIP.ADD_SUCCESS, {delay: 1000});
            };

            options.error = function(result) {
                top.M139.UI.TipMessage.show(_this.TIP.ADD_FAIL, {delay: 1000, className: 'msgRed'});
            };

            _this.model.editContactDetails(options);
        },
        refresh: function(info) {
            //更新缓存数据            
            if(info){
                top.Contacts.updateCache("DeleteContacts", { 'serialId': info.SerialId });
                top.Contacts.updateCache("AddContactsDetails", { info: info });
            }

            var _this = this;
            setTimeout(function(){
                if(top.$Addr){
                    var master = top.$Addr;
                    master.trigger(master.EVENTS.LOAD_MODULE, {
                        key: 'events:contacts',
                        actionKey: '110',
                        contactId: _this.model.get('serialId'),
                        groupId: _this.model.get('groupId').split(',')
                    });
                }
            }, 1500);
        },
        showTip: function(text, dom){
            var _this = this;
            var sTop = -36;
            var wrap = dom.parent();

            this.ui.tipContent.text(text);
            this.ui.tip.show().css({top: sTop}).appendTo(wrap);

            if(this.timer){
                clearTimeout(this.timer);
            }

            this.timer = setTimeout(function(){
                _this.ui.tip.hide();
            }, 3000);
        },
        hideTip: function(){
            this.ui.tip.hide();
        },
        closeDialog: function() {
            this.dialog.close();
        },
        onSuccess: function(){

        },
        once: {
            render: function() {
                //填充数据
                this.ui.txtName.val(this.model.get('name'));
                this.ui.txtEmail.val(this.model.get('email'));
                this.ui.txtMoblie.val(this.model.get('mobile'));
                this.ui.image.attr({src: this.model.get('url')});                

                //ui操作
                if(this.model.get('email').length > 0){
                    this.ui.txtEmail.attr('disabled', 'disabled');
                }

                if(this.model.get('mobile').length > 0){
                    this.ui.txtMoblie.attr('disabled', 'disabled');
                }

                var options = {
                    width : this.EL_WIDTH,
                    dialogTitle : this.TIP.ADD_CONTACTS
                }

                this.dialog = top.$Msg.showHTML(this.$el, options);                
            },
            update: function() {
                var _this = this;
                var options = {};
                options.info = { 
                    relationId: this.model.get('relationId'), 
                    dealStatus: "1", 
                    groupId: "", 
                    reqMsg: "", 
                    replyMsg: "", 
                    operUserType: "2", 
                    name: this.model.get('name')
                };

                options.success = function(result) {
                    _this.model.set({serialId: result.info.SerialId});
                    _this.getContactsInfoById(result.info);
                };                 

                options.error = function(result) {
                    var info = result.info;
                    var msg = result.msg || _this.TIP.ADD_FAIL;                    
                    if(info.ResultCode =="21"){
                        msg = _this.TIP.CONTACTS_MAX;
                    }
                    top.M139.UI.TipMessage.show(msg, {delay: 1000, className: 'msgYellow'});
                };

                this.model.modDealStatus(options);               
            },
            exist: function() {
                var _this = this;
                var options = {};
                    options.info = {
                        reqMsg: '',
                        replyMsg: "",
                        dealStatus: "3",
                        operUserType: "2",
                        groupId: this.model.get('groupId'),
                        relationId: this.model.get('relationId')
                    };

                options.success = function () {
                    _this.closeDialog();
                    _this.onSuccess(_this.data);
                    top.BH('addr_whoAddMe_add_success');
                    top.M139.UI.TipMessage.show(_this.TIP.ADD_SUCCESS, {delay: 1000});
                };

                options. error = function() {
                    top.M139.UI.TipMessage.show(_this.TIP.ADD_FAIL, {delay: 1000, className: 'msgRed'});
                };

                this.model.modDealStatus(options);
            }
        },
        bis: {
            render: function() {
                this[this.STATE.ONCE].render.call(this);
            },
            update: function() {
                var _this = this;
                var options = {};

                options.info = new top.M2012.Contacts.ContactsInfo();
                options.info.name = _this.model.get('name');
                options.info.email = _this.model.get('email');
                options.info.mobile = _this.model.get('mobile');
                options.info.groupId = _this.model.get('groupId');
                options.info.SecondUIN = _this.model.get('uin');
                options.info.DealStatus = _this.model.get('whoAddMeSetting');

                options.success = function(result) {
                    _this.closeDialog();
                    _this.refresh(result.contacts[0]);
                    _this.onSuccess(_this.data);
                    top.BH('addr_whoAddMe_add_success');
                    top.M139.UI.TipMessage.show(_this.TIP.ADD_SUCCESS, {delay: 1000});
                };

                options.error = function() {
                    top.M139.UI.TipMessage.show(_this.TIP.ADD_FAIL, {delay: 1000, className: 'msgRed'});
                };

                _this.model.addContacts(options);
            },
            exist: function(){
                this.model.set({'whoAddMeSetting': 2});
                this[this.STATE.BIS].update.call(this);
            }
        }
    }));
})(jQuery, _, M139);


;
(function ($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.MaybeknownDialog";


    M.namespace(_class, M.Model.ModelBase.extend({

        name: _class,

        defaults: {
            state: '', //状态, 一度, 二度关系
            url: '',
            name: '',
            email: '',
            mobile: '',
            groupId: '',
            overWrite: '1',
            imageUrl: '',
            relationId: '',
            serialId: ''
        },

        isMoblie: /^\d{3,20}$/,

        initialize: function () {
            superClass.prototype.initialize.apply(this, arguments);
        },
        modDealStatus: function(options) {
            top.M2012.Contacts.API.modDealStatus(options.info, function(result) {
                if (result.success) {
                    options.success(result);
                } else {
                    options.error(result);
                }
            });
        },
        getContactsInfoById: function(options) {
            top.M2012.Contacts.API.getContactsInfoById(options.serialId, function(result){
                if(result.success){
                    options.success(result.contactsInfo)
                }else{
                    options.error(result);
                }
            }, options);
        },
        editContactDetails: function(options) {
            top.Contacts.editContactDetails(options.info, function(result) {
                if (result.success) {
                    options.success(result);
                } else {
                    options.error(result);
                }
            });
        },
        addContacts: function(options) {
            top.M2012.Contacts.API.addContacts(options.info, function(result){
                if (result.success) {
                    options.success(result);
                } else {
                    options.error(result);                    
                }
            });

        }
    }));

})(jQuery, _, M139);

