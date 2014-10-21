;(function ($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.PersonInfo";  
    M.namespace(_class, M.View.ViewBase.extend({

        name: _class,

        el: "#main-from",

        events:{},

        STATE: {
            EDIT: 'edit',
            READY: 'ready'
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
            HomeAddress: 'o-address',
            CPAddress: 'o-address',
            ZipCode: 'o-code',
            CPZipCode: 'o-code',
            OtherIm: 'o-im',
            OICQ: 'o-im',
            MSN: 'o-im',
            PersonalWeb: 'o-im',
            CompanyWeb: 'o-im',
            Character: 'o-more',
            FavoPeople: 'o-more',
            MakeFriend: 'o-more',
            Brief: 'o-more',
            FavoBook: 'o-more',
            FavoMusic: 'o-more',
            FavoMovie: 'o-more',
            FavoTv: 'o-more',
            FavoSport: 'o-more',
            FavoGame: 'o-more'
        },


        TIP: {
            TITLE_EDIT: '编辑个人资料',
            TITLE_READY: '查看个人资料',
            SUCCESS : "保存成功",
            FAILURE : "保存失败"
        },

        template: '',

        logger: new M139.Logger({ name: _class }),

        initialize: function (options) {
            var _this = this;
            _this.kit = options.kit;
            _this.model = options.model;
            _this.master = options.master;
            _this.contactsModel = top.M2012.Contacts.getModel();

            _this.initUI();
            _this.initEvents();
            _this.render();
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
            this.ui.btnEdit = $('#tool-edit');
            this.ui.btnBack = this.$el.find('#btn-back');
            this.ui.btnSave = this.$el.find('#btn-save');
            this.ui.btnCancel= this.$el.find('#btn-cancel');

            //模版
            this.ui.tempEdit = $('#temp-edit');
            this.ui.tempReady = $('#temp-ready');
            this.ui.tempLoad = $('#temp-load');
        },
        initEvents: function () {
            var _this = this;
            var ui = this.ui;

            //当状态发生改变时,进行初始化
            this.model.on('change:state',function(){
                var state = this.get('state');
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

            this.model.on('invalid', function(model, error){
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
                top.BH('addr_basicInfo_cancel');
            });

            ui.btnSave.click(function(){
                //统一验证
                if(_this.model.isValid()){
                    var state = _this.model.get('state');                    
                    _this[state].update.call(_this);
                }

                top.BH('addr_basicInfo_save');
            });

            ui.btnEdit.click(function(){
                top.BH('addr_basicInfo_edit');
                _this.model.set({state: _this.STATE.EDIT});
            });

            $(window).resize(function () {
                var marginTop = 11;
                var headHeight = _this.$el.find('.main-rows').height() * 2;
                var winHeight = $(window).height() - headHeight - marginTop;
                
                ui.main.css({ height: winHeight });
            });

            $(window).resize();
        },
        render: function () {
            this.model.set({state: this.STATE.READY});
        },
        regMainEvent: function(){
            var _this = this;
            var ui = this.ui;

            //自动截手机号为邮箱
            ui.main.find('#MobilePhone').change(function(e){
                //手机号支持分隔符“-”,输入手机号 自动填充移动手机邮箱时过滤掉手机号分隔符10.9
                var email = ui.main.find('#FamilyEmail');
                var mobile = e.target.value.replace(/\D/g, "");
                var domain = top.mailDomain || top.coremailDomain;
                var isFix = ($Mobile.isMobile(mobile) && email.val().trim().length);

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
                    && mobile.val().trim().length);

                if (isFix) {
                    mobile.val(email.name);
                }
            });

            ui.main.find('input[type=text],textarea').blur(function(){
                var obj = {};
                var name = $(this).attr('name');
                var value = $(this).val().trim();

                obj[name] = value;
                _this.model.set(obj, {validate: true, target: name});
            });

            ui.main.find('input[type=text]').focus(function(){
                var name = $(this).attr('name');
                _this.kit.hideTip(name);
            });

            ui.main.find('input[name=UserSex]').click(function(){
                _this.model.set({UserSex: this.value});
            });

            ui.main.find('#btn-more').click(function(){
                _this.model.set({isShowMore: true}, {silent: true});
                _this.model.trigger('change:isShowMore');
                top.BH('addr_basicInfo_more');
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
                _this.model.set(obj);

                //ui操作
                $(this).closest('li').hide();
                $(this).closest('li').find('input').val('');
                element.eq(0).find('.btn-create').show();
            });

            ui.main.find('#btn-file').click(function(){
                top.BH('addr_basicInfo_upload');
            });
        },
        regWidget: function(){
            var _this = this;
                _this.widget = {};

            //初始化头像组件    
            var upLoad = {
                serialId: 0,
                image: $('#face'),
                upLoadFile: $('#btn-file'),
                callback: function(result) {
                    _this.model.set({ImageUrl: result.imagePath});
                    _this.model.set({ImagePath: result.imagePath});
                    top.BH('addr_basicInfo_uploadSuccess');
                }
            };
            this.widget.ImageUrl = new M2012.Addr.ImageUpload(upLoad);    

             //初始化日期组件
            var birDay = {
                button: $('#btn-calender'),
                callback: function(date) {
                    var strDate = date.format('yyyy-MM-dd');
                    _this.ui.main.find('#BirDay').val(strDate);
                    _this.model.set({BirDay: strDate}, {validate: true, target: 'BirDay'}); 
                }
            };
            this.widget.birDay = new M2012.Addr.View.CalenderChoose(birDay);
        },
        startCodeMenu : function () {
                var _this = this;
                var defaultText = this.model.get('StartCode');

                var menuItems = [{
                        text : "--",
                        value : ""
                    }, {
                        text : "白羊座",
                        value : "白羊座"
                    }, {
                        text : "金牛座",
                        value : "金牛座"
                    }, {
                        text : "双子座",
                        value : "双子座"
                    }, {
                        text : "巨蟹座",
                        value : "巨蟹座"
                    }, {
                        text : "狮子座",
                        value : "狮子座"
                    }, {
                        text : "处女座",
                        value : "处女座"
                    }, {
                        text : "天秤座",
                        value : "天秤座"
                    }, {
                        text : "天蝎座",
                        value : "天蝎座"
                    }, {
                        text : "射手座",
                        value : "射手座"
                    }, {
                        text : "摩羯座",
                        value : "摩羯座"
                    }, {
                        text : "水瓶座",
                        value : "水瓶座"
                    }, {
                        text : "双鱼座",
                        value : "双鱼座"
                    }
                ];

                var dropMenu = M2012.UI.DropMenu.create({
                    defaultText: defaultText || "--",
                    menuItems: menuItems,
                    container: $('#start-code')
                }).on("change", function (e) {
                    _this.model.set("StartCode", e.value);
                });

                dropMenu.$el.width(138);
        },
        bloodCodeMenu : function () {
            var _this = this;
            var defaultText = this.model.get('BloodCode');

            var items = [{
                    text : "-- ",
                    value : ""
                }, {
                    text : "A型 ",
                    value : "A型"
                }, {
                    text : "B型 ",
                    value : "B型"
                }, {
                    text : "AB型 ",
                    value : "AB型"
                }, {
                    text : "O型 ",
                    value : "O型"
                }
            ];

            var dropMenu = M2012.UI.DropMenu.create({
                    defaultText : defaultText || "--",
                    menuItems : items,
                    container : $('#blood-code')
                }).on("change", function (e) {
                    _this.model.set("BloodCode", e.value);
                });

                dropMenu.$el.width(138);

        },
        marriageMenu : function () {
            var _this = this;
            var defaulttext = "";
            var value = this.model.get('Marriage');

            var itmes = [{
                    text : "--",
                    value : "0"
                }, {
                    text : "已婚 ",
                    value : "1"
                }, {
                    text : "未婚 ",
                    value : "2"
                }
            ];
            
            var dropMenu = M2012.UI.DropMenu.create({
                    defaultText : "--",
                    menuItems : itmes,
                    container : $('#marriage')
                }).on("change", function (e) {
                    _this.model.set("Marriage", e.value);
                });

            dropMenu.$el.width(138);    
            dropMenu.setSelectedValue(value);            
        },
        initAction: function() {
            var _this = this;
            var ui = this.ui;
            var showAll = true; //非基础字段全部有值
            var hideAll = true; //非基础字段全部为空

            //便利可扩展字段, 判断是否可继续扩展
            ui.main.find('.btn-create').each(function(index, dom){
                var isHide = true;
                var key = $(this).data('key');
                var clas = 'li.{0}:gt(0)'.format(_this.ACTION[key]);

                ui.main.find(clas).each(function(num){
                    if($(this).data('value').length <= 0){
                        isHide = false;
                        $(this).hide();
                    }else{
                        $(this).show();
                    }
                });

                if(isHide){
                    $(this).hide();
                }
            });

            //便利非基础字段,有值就显示, 为空就隐藏
            ui.main.find('#contacts-more li').each(function(){
                var value = $.trim($(this).data('value'));

                if(value.length > 0){
                    $(this).show();
                    if($(this).hasClass('default')){
                        hideAll = false;
                    }
                }else{
                    $(this).hide();
                    if($(this).hasClass('default')){
                        showAll = false;
                    }
                }
            });

            //两种特殊情况, 1.全部为空, 2.全部有值
            if(hideAll){
                _this.model.set({isShowMore: false}, {silent: true});
                _this.model.trigger('change:isShowMore');
            }

            if(showAll){
                _this.model.set({isShowMore: true}, {silent: true});
                _this.model.trigger('change:isShowMore');
            }
 
        },        
        byName: function(name){
            return this.ui.main.find('input[name=' + name + ']');
        },
        back: function() {
            this.master.trigger(this.master.EVENTS.LOAD_MAIN);
        },
        edit: {
            render: function() {
                var _this = this;
                this.ui.tool.hide();
                this.ui.mainButton.show();
                this.ui.title.text(this.TIP.TITLE_EDIT);

                this.model.getContacts(function(contacts){
                    var info = _this.model.getInfo();
                    var html = _this.ui.tempEdit.html();
                    var template = _.template(html, info);

                    _this.ui.mainBody.html(template);

                    //事件和组件注册
                    _this.regWidget();
                    _this.initAction();
                    _this.regMainEvent();

                    //初始化星座,血型,婚姻
                    _this.startCodeMenu();
                    _this.bloodCodeMenu();
                    _this.marriageMenu();

                    $(window).resize();
                });

                top.BH('addr_basicInfo_loadEdit');
            },
            update: function() {
                var _this = this;
                var options = {};
                    options.data = this.model.getInfoByWrite();

                options.success = function() {
                    _this.model.set({state: _this.STATE.READY});
                    top.M139.UI.TipMessage.show(_this.TIP.SUCCESS, { delay: 2000});
                    top.BH('addr_basicInfo_EditSuccess');
                };

                options.error = function() {
                    top.M139.UI.TipMessage.show(_this.TIP.FAILURE, { delay: 2000, className: 'msgRed'});
                };

                this.model.modifyUserInfo(options);
            },
            back: function() {
                this.model.set({state: this.STATE.READY});
            }
        },
        ready: {
            render: function() {
                var _this = this;
                this.ui.tool.show();                
                this.ui.mainButton.hide();
                this.ui.title.text(this.TIP.TITLE_READY);

                this.model.getContacts(function(contacts){
                    var html = _this.ui.tempReady.html();
                    var template = _.template(html, contacts);

                     _this.ui.mainBody.html(template);
                     _this.model.set(_this.model.getInfo(), {silent: true});
                });

                top.BH('addr_basicInfo_loadReady');
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
        var model = new M2012.Addr.Model.PersonInfo();
        var view = new M2012.Addr.View.PersonInfo({model: model, master: top.$Addr, kit: kit});        
    });

})(jQuery, _, M139);