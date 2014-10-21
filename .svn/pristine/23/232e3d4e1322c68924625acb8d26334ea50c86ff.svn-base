
(function ($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Merge";  
    M.namespace(_class, M.View.ViewBase.extend({

        name: _class,

        el: "body",

        events:{
            'click #goBack': 'back',
            'click #tabMenu li': 'changeState'
        },

        STATE: {
            NAME: 'name',
            EMAIL: 'email',
            EMPTY: 'empty'
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

        TIP: {
            NAME: '姓名',
            ALL_MERGE: '全部合并({0})',
            EMAIL_AND_MOBLIE: '邮箱/手机',
            MERGE_SUCCESS: '第{0}组合并成功',
            SKIP_LAST_TIP:'已跳过最后一组重复联系人',
            MERFE_FAIL: '暂时无法处理该请求，请稍后再试',
            MERFE_ALL_TIP: '确定全部合并？<br/> “姓名、性别、头像、生日”将保存较新的资料，其他信息全部保存。',
            MERFE_ALL_SUCCESS: '合并联系人成功'
        },

        template: '<div role="tooltip" class="tips mergeToolTip">\
                        <div class="tips-text">您还有 <span class="red">{0}</span> 组“{1}相同”的联系人待合并</div>\
                        <div style="left:35px;" class="tipsTop2  diamond"></div>\
                    </div>',

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
            superClass.prototype.initialize.apply(_this, arguments);
        },
        initUI: function(){

            this.ui = {};
            this.ui.el = this.$el;

            //容器
            this.ui.pageNum = $('#pageNum');
            this.ui.pageTip = $('#pageTip');
            this.ui.mergeTip = $('#mergeTip');
            this.ui.tabMenu = $('#tabMenu');
            this.ui.mergeItem = $('#mergeItem');
            this.ui.mergeEmpty = $('#mergeEmpty');            
            this.ui.mergeLoading = $('#mergeLoading');
            this.ui.leftContainer = $('#leftContainer');
            this.ui.rightContainer = $('#rightContainer');
            this.ui.mergeContainer = $('#mergeContainer');
            this.ui.mergeEmptyState = $('#mergeEmptyState');

            //按钮
            this.ui.btnMenu = $('#tabMenu li');
            this.ui.btnSkip = $('#btnSkip');
            this.ui.btnMerge = $('#btnMerge');
            this.ui.btnMergeAll = $('#btnMergeAll');

            //模版
            this.ui.tempEdit = $('#temp-edit');
        },
        initEvents: function () {
            var _this = this;
            var ui = this.ui;

            this.model.on('change:state', function(){
                _this[this.get('state')].render.call(_this);
            });

            this.model.on('change:stateEmpty', function(){
                _this[_this.STATE.EMPTY].render.call(_this);
            });

            this.model.on('change:index', function(obj, index){
                _this.setPageNum();
                _this[this.get('state')].show.call(_this, index);                
            });

            this.model.on('change:isShowMore', function(){
                //控制非基础字段显示隐藏                
               if(this.get('isShowMore')){
                    ui.rightContainer.find('#contacts-more').show();
                    ui.rightContainer.find('#btn-more').parent().hide();
                    ui.rightContainer.find('#contacts-more li.default').show();
                }else{
                    ui.rightContainer.find('#contacts-more').hide();
                    ui.rightContainer.find('#btn-more').parent().show();
                }
            });

            this.singleModel.on('invalid', function(model, error){
                for(var key in error){
                    var input = _this.byName(key);
                    var tops =  input.offset().top;
                    var min = ui.mergeContainer.offset().top;
                    var max = ui.mergeContainer.height() + min;
                    if(tops < min || tops > max){
                        ui.mergeContainer.scrollTop(tops + 20);
                    }
                    _this.kit.showTip(error[key], input, {delay: 3000});    
                }                
            });

            this.master.on('change:repeatData', function(){
                var data = this.get('repeatData');            
                _this.model.set({
                    nameRep: data.NameRep,
                    eAndmRep:data.EAndMRep
                });
            });

            this.ui.pageNum.mouseenter(function(){
                _this.ui.pageTip.show();
                top.BH('addr_merge_move_page');
            });

            this.ui.pageNum.mouseleave(function(){
               _this.ui.pageTip.hide(); 
            });

            this.ui.btnSkip.click(function(){
                var index = _this.model.get('index') + 1;                
                var pageCount = _this.model.get('pageCount');                
                var noLast = index < pageCount;
                var args = noLast ? {index: index} : {stateEmpty: new Date()};
                
                if(!noLast){
                    top.M139.UI.TipMessage.show(_this.TIP.SKIP_LAST_TIP, { delay: 2000 });
                }

                top.BH('addr_merge_skip');
                _this.model.set(args);                
            });

            this.ui.btnMerge.click(function(){
                if(_this.singleModel.isValid()){
                    var state = _this.model.get('state');
                    _this[state].update.call(_this);
                }

                top.BH('addr_merge_operNext');
            });

            this.ui.btnMergeAll.click(function(){
                _this.mergeAll();
                top.BH('addr_merge_mergeAll');
            });

            $(window).resize(function () {
                var marginTop = 5;
                var offset = ui.mergeContainer.offset();
                var winHeight = $(window).height() - offset.top - marginTop;
                
                ui.mergeContainer.css({ height: winHeight });
            });

            $(window).resize();
        },
        render: function () {
            var state = $Url.queryString('state');
                state = !!state ? state : this.STATE.NAME;

            var data = this.master.get('repeatData');
            
            this.model.set({
                state: state,
                nameRep: data.NameRep,
                eAndmRep:data.EAndMRep
            });
        },
        changeState: function(e) {
            var state = $(e.currentTarget).data('state');
            
            this.model.set({state: state});
        },
        setPageNum: function(){
            var data = this.model.get('currRep');
            var index = this.model.get('index') + 1;
            var pageCount = data.length;

            this.model.set({pageCount: pageCount});
            this.ui.pageNum.text(index + '/' + pageCount);

            this.ui.pageTip.find('.pageIndex').text(index);
            this.ui.pageTip.find('.pageCount').text(pageCount);
            this.ui.btnMergeAll.find('span').text(this.TIP.ALL_MERGE.format(pageCount));
        },
        regMainEvent: function(){
            var _this = this;
            var main = this.ui.rightContainer;

            //自动截手机号为邮箱
            main.find('#MobilePhone').change(function(e){
                //手机号支持分隔符“-”,输入手机号 自动填充移动手机邮箱时过滤掉手机号分隔符10.9
                var email = main.find('#FamilyEmail');
                var mobile = e.target.value.replace(/\D/g, "");
                var domain = top.mailDomain || top.coremailDomain;
                var isFix = ($Mobile.isMobile(mobile) && email.val().trim().length);

                if (isFix) {
                    email.val(mobile + "@" + domain); 
                }
            });

            //自动截手机帐号为手机号
            main.find("#FamilyEmail").change(function(e){
                var mobile = main.find("#MobilePhone");
                var email = top.Utils.parseSingleEmail(e.target.value);
                var isFix = ( email != null 
                    && $Mobile.isMobile(email.name)
                    && mobile.val().trim().length);

                if (isFix) {
                    mobile.val(email.name);
                }
            });

            main.find('input[type=text],textarea').blur(function(){
                var obj = {};
                var name = $(this).attr('name');
                var value = $(this).val().trim();

                obj[name] = value;
                _this.singleModel.set(obj, {validate: true, target: name});
            });

            main.find('input[type=text]').focus(function(){
                var name = $(this).attr('name');
                _this.kit.hideTip(name);
            });

            main.find('input[name=UserSex]').click(function(){
                _this.singleModel.set({UserSex: this.value});
            });

            main.find('#btn-more').click(function(){
                _this.model.set({isShowMore: true}, {silent: true});
                _this.model.trigger('change:isShowMore');
                top.BH('addr_merge_more');
            });

            main.find('.btn-create').click(function(){
                var selector = 'li.{0}:hidden';
                var key = $(this).data('key');
                var clas = _this.ACTION[key];
                var element = main.find(selector.format(clas));
                var len = element.length;

                if( len > 0){
                    element.eq(0).show();
                    if(--len <= 0){
                        $(this).hide();
                    }
                }
            });

            main.find('.btn-remove').click(function(){
                var obj = {};
                var selector = 'li.{0}';
                var key = $(this).data('key');
                var clas = _this.ACTION[key];
                var element = main.find(selector.format(clas));
                var len = element.length;

                //清空对象的数据
                obj[key] = '';
                _this.singleModel.set(obj, {silent: true});

                //ui操作
                $(this).closest('li').hide();
                $(this).closest('li').find('input').val('');
                element.eq(0).find('.btn-create').show();
            });

            main.find('#btn-file').click(function(){
                top.BH('addr_merge_upload');
            });

            //备注检测
            main.find("#Memo").keydown(function(){
                if(this.value.length > 100){
                    this.value = this.value.substring(0,100);
                }
            });
            
            main.find("#Memo").keyup(function(){
                if(this.value.length > 100){
                    this.value = this.value.substring(0,100);
                }
            });
        },
        showRight: function() {
            var _this = this;
            var options = {
                contacts: this.group.getInfo()
            };

            options.callback = function(contacts){
                var info = _this.singleModel.getInfo();
                var html = _this.ui.tempEdit.html();
                var template = _.template(html, info);

                _this.ui.rightContainer.html(template);

                _this.regWidget();
                _this.regMainEvent();
            };

            this.singleModel.getContacts(options);
        },
        regWidget: function(){
            var _this = this;
            var main = this.ui.rightContainer;
                _this.widget = {};

            //初始化头像组件    
            var upLoad = {
                serialId: 0,
                image: main.find('#face'),
                upLoadFile: main.find('#btn-file'),
                callback: function(result) {
                    _this.singleModel.set({ImageUrl: result.imagePath});
                    _this.singleModel.set({ImagePath: result.imagePath});
                    top.BH('addr_merge_uploadSuccess');
                }
            };
            this.widget.ImageUrl = new M2012.Addr.ImageUpload(upLoad);

            //初始化分组组件
            var group = {
                width: '138px',
                container: $('#box-group'),
                group: this.singleModel.get('GroupId').split(','),
                callback: function(groups) {
                    _this.singleModel.set({GroupId: groups.join(',')});
                }
            };

            group.onChange = function(){
                top.BH('addr_merge_selectGroup');
            };

            group.onRemove = function(){
                top.BH('addr_merge_removeGroup');
            };
            this.widget.GroupId = new M2012.Addr.GroupWidget(group);

            //初始化日期组件
            var birDay = {
                button: main.find('#btn-calender'),
                callback: function(date) {
                    var strDate = date.format('yyyy-MM-dd');
                    main.find('#BirDay').val(strDate);
                    _this.singleModel.set({BirDay: strDate}, {validate: true, target: 'BirDay'}); 
                }
            };
            this.widget.birDay = new M2012.Addr.View.CalenderChoose(birDay);

            //初始化家庭地址
            var fAddress = {
                dropWidth: 126,
                inputWidth: 250,
                provCode: this.singleModel.get('ProvCode'),
                cityCode: this.singleModel.get('CityCode'),
                address: this.singleModel.get('HomeAddress'),
                container: main.find('#home-address'),
                callback: function(result) {
                    _this.singleModel.set({ProvCode: result.provCode});
                    _this.singleModel.set({CityCode: result.cityCode});
                    _this.singleModel.set({HomeAddress: result.address});
                }
            };
            this.widget.FamilyAddress = new M2012.Addr.Address(fAddress);

            //初始化公司地址
            var cAddress = {
                dropWidth: 126,
                inputWidth: 250,
                provCode: this.singleModel.get('CPProvCode'),
                cityCode: this.singleModel.get('CPCityCode'),
                address: this.singleModel.get('CPAddress'),
                container: main.find('#cp-address'),
                callback: function(result) {
                    _this.singleModel.set({CPProvCode: result.provCode});
                    _this.singleModel.set({CPCityCode: result.cityCode});
                    _this.singleModel.set({CPAddress: result.address});
                }
            };
            this.widget.CompanyAddress = new M2012.Addr.Address(cAddress);
        },
        mergeAll: function() {
            var _this = this;
            var param = [];
            var options = {};
            var state = _this.model.get('state');
            var callback = function(){
                _this.model.autoMergeContacts(options);
            };

            options.type = state == this.STATE.NAME ? 1 : 2;
            options.success = function(result) {
                var master = _this.master;

                top.BH('addr_merge_success_all');
                top.$App.trigger("change:contact_maindata");
                top.M139.UI.TipMessage.show(_this.TIP.MERFE_ALL_SUCCESS, { delay: 2000 });

                master.trigger(master.EVENTS.LOAD_MODULE, {
                    key: 'events:contacts',
                    actionKey: '331'
                });
                
                master.trigger(master.EVENTS.LOAD_MODULE, {
                    key: 'remind:getMergeData'
                });                

                _this.model.set({stateEmpty: new Date()});              
            };

            options.error = function(result) {
                top.$Msg.alert(this.TIP.MERFE_FAIL);
            };

            param.push(this.TIP.MERFE_ALL_TIP);
            param.push(callback);
            param.push('');
            param.push('');
            param.push({isHtml: true});

            top.M2012.UI.DialogBase.confirm.apply(window, param);
        },
        byName: function(name){
            return this.ui.rightContainer.find('input[name=' + name + ']');
        },        
        back: function() {
            this.master.trigger(this.master.EVENTS.LOAD_MAIN);
        },
        name: {
            render: function(){
                this.ui.mergeItem.show();
                this.ui.mergeEmpty.hide();

                this.ui.btnMenu.removeClass('on');
                this.ui.btnMenu.eq(0).addClass('on');

                this.$el.find('.mergeToolTip').remove();

                this.nameRep = this.model.get('nameRep');

                this.model.set({currRep: this.nameRep});

                if(!this.nameRep.length){
                    this.model.set({stateEmpty: new Date()});
                }else{
                    this.model.set({index: 0}, {silent: true});
                    this.model.trigger('change:index'); 
                }

                top.BH('addr_merge_tab_name');
            },
            show: function(){
                var _this = this;
                var index = this.model.get('index');
                var data = this.model.get('currRep');
                var currentData = data[index];
                var options = {
                    model: this.model,
                    contactsModel: this.contactsModel,
                    serialId: currentData.sd.split(','),
                    ui: {
                        loading: this.ui.mergeLoading,
                        mergeContainer: this.ui.mergeContainer
                    }
                    
                };

                options.onChange = function(){
                    _this.showRight();
                };

                this.group = new M2012.Addr.View.Merge.Group(options);
            },
            showTip: function(){
                var paddingTop = 7;
                var num = this.model.get('eAndmRep').length;

                if(num > 0){                    
                    var sLeft = this.ui.btnMenu.eq(1).offset().left;
                    var template = $(this.template.format(num, this.TIP.EMAIL_AND_MOBLIE));
                    var sTop = this.ui.tabMenu.height() + this.ui.tabMenu.offset().top + paddingTop;

                    this.ui.mergeEmptyState.text(this.TIP.NAME);
                    this.$el.append(template.css({top: sTop, left: sLeft}));
                }else{                    
                    this.back();
                }

                top.BH('addr_merge_empty_name');
            },
            update: function() {
                var _this = this;
                var data = this.model.get('currRep');
                var index = this.model.get('index');                
                var pageCount = this.model.get('pageCount');

                var options = {
                    serialId: data[index].sd,
                    info: this.singleModel.getInfoByWrite()
                };
                
                options.success = function(result) {
                    var master = _this.master;
                    var tip = _this.TIP.MERGE_SUCCESS.format(index + 1);
                    var args = index + 1 < pageCount ? {index: index + 1} : {stateEmpty: new Date()};

                    top.BH('addr_merge_success');
                    top.BH('addr_merge_success_alert');
                    top.M139.UI.TipMessage.show(tip, { delay: 2000 });

                    master.trigger(master.EVENTS.LOAD_MODULE, {
                        key: 'events:contacts', 
                        actionKey: '330'
                    });
                    
                    master.trigger(master.EVENTS.LOAD_MODULE, {
                        key: 'remind:getMergeData'
                    });

                    _this.model.set(args);                   
                };

                options.error = function(result) {
                    top.$Msg.alert(_this.TIP.MERFE_FAIL);
                };

                console.log('options:', options);
                this.model.mergeContacts(options);
            }
        },
        email: {
            render: function(){
                this.ui.mergeItem.show();
                this.ui.mergeEmpty.hide();

                this.ui.btnMenu.removeClass('on');
                this.ui.btnMenu.eq(1).addClass('on');

                this.$el.find('.mergeToolTip').remove();
                
                this.eAndmRep = this.model.get('eAndmRep');
                this.model.set({currRep: this.eAndmRep});

                if(!this.eAndmRep.length){
                    this.model.set({stateEmpty: new Date()});
                }else{
                    this.model.set({index: 0}, {silent: true});
                    this.model.trigger('change:index');
                }

                top.BH('addr_merge_tab_email');
            },
            show: function(){
                var _this = this;
                var index = this.model.get('index');
                var data = this.model.get('currRep');
                var currentData = data[index];
                var options = {
                    model: this.model,
                    contactsModel: this.contactsModel,
                    serialId: currentData.sd.split(','),
                    ui: {
                        loading: this.ui.mergeLoading,
                        mergeContainer: this.ui.mergeContainer
                    }
                };

                options.onChange = function(){
                    _this.showRight();
                };

                this.group = new M2012.Addr.View.Merge.Group(options);              
            },
            showTip: function(){                
                var paddingTop = 7;
                var num = this.model.get('nameRep').length;
                
                if(num > 0){
                    var sLeft = this.ui.btnMenu.eq(0).offset().left;
                    var template = $(this.template.format(num, this.TIP.NAME));
                    var sTop = this.ui.tabMenu.height() + this.ui.tabMenu.offset().top + paddingTop;

                    this.ui.mergeEmptyState.text(this.TIP.EMAIL_AND_MOBLIE);
                    this.$el.append(template.css({top: sTop, left: sLeft}));
                }else{
                    this.back();
                }

                top.BH('addr_merge_empty_email');
            },
            update: function(){
                this[this.STATE.NAME].update.call(this);
            }
        },
        empty: {
            render: function(){
                
                this.ui.mergeItem.hide();
                this.ui.mergeEmpty.show();

                var state = this.model.get('state');
                var data = this.master.get('repeatData');
            
                this.model.set({
                    nameRep: data.NameRep,
                    eAndmRep:data.EAndMRep
                }, {silent: true});

                this[state].showTip.call(this);
            }

        }
    }));
    
    $(function(){
        var kit = new M2012.Addr.View.Kit();
        var model = new M2012.Addr.Model.Merge();
        var view = new M2012.Addr.View.Merge({model: model, master: top.$Addr, kit: kit});
        top.BH('addr_merge_load_success');
    });

})(jQuery, _, M139);


(function ($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Merge.Group";
    M.namespace(_class, M.View.ViewBase.extend({

        name: _class,

        collection: {},

        el: "#leftContainer",
        
        SPECIAL: 'FamilyEmail,BusinessEmail,MobilePhone,BusinessMobile,BirDay,UserSex, GroupName',

        template: '<div class="peopleList <%=marign%>">\
                        <ul class="form">\
                            <li class="formLine">\
                                <label class="label"><img src="<%=ImageUrl%>" /></label>\
                                <div class="element">\
                                    <div>\
                                       <h2><%=M139.Text.Html.encode(Name)%></h2>\
                                    </div>\
                                </div>\
                            </li>\
                            <%=other%>\
                        </ul>\
                        <%=button%>\
                    </div>',
        itemTmpl: '<li class="formLine">\
                        <label class="label"><%=key%>：</label>\
                        <div class="element">\
                            <div><%=value%></div>\
                        </div>\
                    </li>',
        buttonTmpl: '<div class="peopleListBotoom">\
                        <a href="javascript:void(0);" class="btnBan2 btnDisabled hide"><span>使用该联系人信息</span></a>\
                        <a href="javascript:void(0);" class="btnNormal btnSubmit"><span>使用该联系人信息</span></a>\
                    </div>',

        logger: new M139.Logger({ name: _class }),

        initialize: function (options) {            
            
            this.collection = {};
            this.model = options.model;
            this.serialId = options.serialId;            
            this.contactsModel = options.contactsModel;
            this.onChange = options.onChange || this.onChange;
            this.ui = options.ui;

            this.render();            
            superClass.prototype.initialize.apply(this, arguments);
        },
        render: function(){
            var _this = this;
            var count = this.serialId.length;

            var options = {
                group: this,                
                model: this.model,
                contactsModel: this.contactsModel
            };

            //显示加载中...
            this.showLoading();

            options.onReady = function(isReadySuccess, newSingle){
                count--;
                if(isReadySuccess){
                    _this.renderUI(newSingle);                    
                }
                
                if(!count){
                    _this.defSingle.handleClick();
                }
            };

            _.each(this.serialId, function(e) {
                var single;
                options.serialId = e;
                single = new M2012.Addr.View.Merge.Single(options);
                single.onClick = function(self){
                    _this.change(self);
                    top.BH('addr_merge_useThisContactInfo');
                };
            });
        },
        renderUI: function(single){
            var cid = single.cid;
            
            //默认选中第一个,第一个要去掉顶部的外间距
            if(!this.defSingle){               
               this.defSingle = single;
               this.defSingle.html.removeClass('mt_10');
            }

            this.$el.append(single.html);
            this.collection[single.cid] = single;                     
        },
        format: function(currData, otherData){

            var array = [];
            var info = currData.otherInfo;
            var other = otherData.otherInfo;
            var currMore = currData.moreInfo;
            var otherMore = otherData.moreInfo;
            var appendMemo = function(obj){
                array.push(obj.key + ':' + obj.value);
            };

            var special = function() {
                var email = [];
                var moblie = [];

                email.push(info.FamilyEmail.value);
                email.push(info.BusinessEmail.value);
                email.push(other.FamilyEmail.value);
                email.push(other.BusinessEmail.value);
                
                moblie.push(info.MobilePhone.value);
                moblie.push(info.BusinessMobile.value);
                moblie.push(other.MobilePhone.value);
                moblie.push(other.BusinessMobile.value);

                //合并去重
                email = _.union(email);
                moblie = _.union(moblie);

                //去重之后,
                for(var i = email.length; i--; i > 0){
                    if(email[i].length <= 0){
                        email.splice(i, 1);
                    }
                }

                for(var i = moblie.length; i--; i > 0){
                    if(moblie[i].length <= 0){
                        moblie.splice(i, 1);
                    }
                }

                //重新赋值
                info.FamilyEmail.value = email[0] || '';
                info.BusinessEmail.value = email[1] || '';
                other.FamilyEmail.value = email[2] || '';
                other.BusinessEmail.value = email[3] || '';

                info.MobilePhone.value = moblie[0] || '';
                info.BusinessMobile.value = moblie[1] || '';
                other.MobilePhone.value = moblie[2] || '';
                other.BusinessMobile.value = moblie[3] || '';

                other.GroupName.value = '';
                info.GroupName.value = _.union(info.GroupName.value, other.GroupName.value);
            };

            //处理差异化需求
            special();

            for(var key in info){
                var n = info[key];
                var o = other[key];
                if(!n.value.length){
                    n.value = o.value;
                }else if(n.value != o.value && o.value.length){
                    appendMemo(o);                      
                }
            }

            for(var s in currMore){
                var cur = currMore[s];
                var oth = otherMore[s];

                if(!cur.value.length){
                    cur.value = oth.value;
                }else if(s == 'GroupId'){
                    var arr1 = cur.value.split(',');
                    var arr2 = oth.value.split(',');
                    cur.value = _.union(arr1, arr2).join(',');
                }
            }

            info.Memo.value += array.join('\n');
            this.formatBase(currData, otherData);

            return currData;
        },
        formatBase: function(info, other){
            var baseInfo = info.baseInfo;
            var baseOther = other.baseInfo;
            var isNoPic = /nopic/.test(baseInfo.ImagePath);

            if(!baseInfo.Name.length){
                baseInfo.Name = baseOther.Name;                
            }

            if(isNoPic){
                baseInfo.ImageUrl = baseOther.ImageUrl;
                baseInfo.ImagePath = baseOther.ImagePath;
            }            
        },
        change: function(self) {
            var _this = this;            
            var other = {};
            var cid = self.cid;
            var info = $.extend(true, {}, self.contacts);

            _.each(this.collection, function(e){
                if(e.cid != cid){
                    e.enabled();
                    other = $.extend(true, {}, e.contacts);

                    info = _this.format(info, other);
                }
            });

            this.info = info;
            //this.showRight(this.info, cid)
            this.hideLoading();
            this.onChange(this.info);
        },
        getHtml: function(contacts, isTop, showButton) {
            var _this = this;
            
            var other = [];
            var baseInfo = _.clone(contacts.baseInfo);
            var otherInfo = _.clone(contacts.otherInfo);
            var info = _.clone(baseInfo);
            var template = _.template(this.template);
            var button = showButton ? this.buttonTmpl : '';
            var groupTmpl = '<span class="addr-s-t">{0}</span>';

            for(var o in otherInfo){
                var tmpl = _.template(this.itemTmpl);
                if(o == 'GroupName'){
                    var group = []; 
                    var item = otherInfo[o]['value']; 
                    var gObj =  {key: otherInfo[o].key};
                    for(var i = 0; i < item.length; i++){                        
                        group.push(groupTmpl.format(item[i]));
                    }

                    if(group.length){
                        gObj.value = group.join('\n');
                        other.push(tmpl(gObj));
                    }
                }else if(otherInfo[o] && otherInfo[o].value.length > 0){
                    otherInfo[o].value = M139.Text.Html.encode(otherInfo[o].value);
                    other.push(tmpl(otherInfo[o]));
                }
            }

            info.button = button;
            info.other = other.join('\n');
            info.marign = isTop ? 'mt_10' : '';
            
            return $(template(info));
        },
        getInfo: function(){
            var obj = {};
            var info = this.info;
            var isNoPic = /nopic/.test(info.baseInfo.ImagePath);

            obj.name = info.baseInfo.Name;
            obj.ImageUrl = isNoPic ? '' : info.baseInfo.ImageUrl;
            obj.ImagePath = isNoPic ? '' : info.baseInfo.ImagePath;

            for(var c in info.otherInfo){
                if(info.otherInfo[c].value.length){
                    obj[c] = info.otherInfo[c].value;
                }
            }

            for(var s in info.moreInfo){
                if(info.moreInfo[s].value.length){
                    obj[s] = info.moreInfo[s].value;
                }
            }

            return obj;
        },
        showRight: function(info, cid) {
            var html = this.getHtml(info, false, false);

            this.ui.rightContainer.html('');
            this.ui.rightContainer.append(html); 

            this.hideLoading();
        },
        showLoading: function(){            
            this.$el.html('');
            this.ui.loading.show();
            this.ui.mergeContainer.hide();
        },
        hideLoading: function(){
            this.ui.loading.hide();
            this.ui.mergeContainer.show();
        },
        onChange: function(info){
            
        }
    }));

})(jQuery, _, M139);


(function ($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Merge.Single";
    M.namespace(_class, M.View.ViewBase.extend({

        name: _class,

        el: "body",

        TIP: {
           MALE: '男',
           WOMAN: '女',
           PRIVARY: '保密'
        },
        
        logger: new M139.Logger({ name: _class }),

        initialize: function (options) {
            var _this = this;

            _this.model = options.model;
            _this.group = options.group;
            _this.serialId = options.serialId;            
            _this.contactsModel = options.contactsModel;
            _this.onReady = options.onReady || _this.onReady;
            
            this.render();
            superClass.prototype.initialize.apply(_this, arguments);
        },
        render: function() {  
            var _this = this;

            this.ui = {};
            this.getContacts(function(contacts){
                _this.contacts = contacts;
                _this.html = _this.group.getHtml(_this.contacts, true, true);

                _this.initEvents(); 
                _this.onReady(true, _this);
            });          
        },
        initEvents: function(){
            var _this = this;

            this.html.find('a.btnSubmit').click(function(){
                _this.handleClick();
            });
        },
        getContacts: function(callback){
            var _this = this;
            var serialId = this.serialId;

            var contacts = {
                baseInfo: {
                    Name: '',
                    ImageUrl: '',
                    ImagePath: ''
                },
                otherInfo: {                
                    FamilyEmail: {key: '电子邮箱', value: ''},
                    BusinessEmail: {key: '商务邮箱', value: ''},
                    MobilePhone: {key: '手机号码', value: ''},
                    BusinessMobile: {key: '商务手机', value: ''},
                    BirDay: {key: '生日', value:''},
                    GroupName: {key: '分组',value:''},
                    SexText: {key: '性别', value:''},
                    FamilyPhone: {key: '常用固话', value: ''} ,
                    BusinessPhone: {key: '公司固话', value: ''},
                    BusinessFax: {key: '传真号码', value: ''},
                    FamilyAddress: {key: '家庭地址', value: ''},
                    CompanyAddress: {key: '公司地址', value: ''},
                    CPName: {key: '公司名称', value: ''},
                    UserJob: {key: '职务', value: ''},
                    CPZipCode: {key: '公司邮编', value: ''},
                    OtherIm: {key: '飞信号', value: ''},
                    Memo: {key: '备注', value: ''}
                },
                moreInfo: {
                   ProvCode: {key: '省份', value: ''},
                   CityCode: {key: '城市', value: ''},
                   HomeAddress: {key: '家庭地址', value: ''},
                   CPProvCode: {key: '省份', value: ''},
                   CPCityCode: {key: '城市', value: ''},
                   CPAddress: {key: '公司地址', value: ''},
                   UserSex: {key: '性别', value: ''},
                   GroupId: {key: '分组', value: ''}
                }
            };

            var success = function(e){
                var data = _this.format(e);
                var baseInfo = contacts.baseInfo;
                var moreInfo = contacts.moreInfo;
                var otherInfo = contacts.otherInfo;

                for(var c in otherInfo){
                    if(data[c] && data[c].length){
                       otherInfo[c].value =  data[c];
                    }                    
                }

                for(var m in moreInfo){
                    if(data[m] && data[m].length){
                       moreInfo[m].value =  data[m];
                    } 
                }

                baseInfo.Name = data.Name;
                baseInfo.ImageUrl = data.ImageUrl;
                baseInfo.ImagePath = data.ImagePath;
                

                contacts.baseInfo = baseInfo;
                contacts.moreInfo = moreInfo;
                contacts.otherInfo = otherInfo;

                if(callback){
                    callback(contacts);
                }
            };

            this.getContactsById(success);
        },
        getContactsById: function(callback){
            var _this = this;
            var options = {
                serialId: this.serialId
            };

            options.success = function(e){
                if(e){
                    callback && callback(e);
                }else{
                    _this.onReady(false, _this);
                }
            };

            options.error = function(e){
                switch(e.ResultCode){
                    case '214':
                    case '215':
                    case '216':
                    case '217':
                    case '218':{
                        $App.showSessionOutDialog();
                        break;
                    }
                    default: {
                        top.M139.UI.TipMessage.show(e.msg, {delay: 1000, className: 'msgRed'});
                    }
                }

                _this.onReady(false, _this);
            };

            this.model.getContactsInfoById(options);
        },
        format: function(data){
            var GroupId = [];
            var GroupName = [];
            var FamilyAddress = [];
            var CompanyAddress = [];
            var sex = data.UserSex ? data.UserSex : '';
            var gMap = data.GroupId ? data.GroupId.split(',') : [];
            var fMap = ['ProvCode', 'CityCode', 'HomeAddress'];
            var cMap = ['CPProvCode', 'CPCityCode', 'CPAddress'];

            for(var i = 0; i < fMap.length; i++){
                var fk = fMap[i];
                if(data[fk] && data[fk].length){
                    FamilyAddress.push(data[fk]);
                }
            }

            for(var j = 0; j < cMap.length; j++){
                var ck = cMap[j];
                if(data[ck] && data[ck].length){
                    CompanyAddress.push(data[ck]);
                }
            }

            for(var k = 0; k < gMap.length; k++){
                var group = this.contactsModel.getGroupById(gMap[k]);

                if(group){//防止分组被删除引发错误
                    GroupId.push(gMap[k]);
                    GroupName.push(group.name || group.GroupName);
                }
            }

            switch(data.UserSex){
                case "0":
                    data.SexText = this.TIP.MALE;
                    break;
                case "1": 
                    data.SexText = this.TIP.WOMAN;
                    break;
                case "2": 
                    data.SexText = this.TIP.PRIVARY;
                    break;
                default:
                    data.SexText = '';
                    break;
            }

            
            data.Name = data.name;
            data.GroupName = GroupName;
            data.GroupId = GroupId.join(',');
            data.FamilyAddress = FamilyAddress.join(' ');
            data.CompanyAddress = CompanyAddress.join(' ');

            return data;
        },
        disabled: function(html){
            this.html.find('.btnSubmit').addClass('hide');
            this.html.find('.btnDisabled').removeClass('hide');
        },
        enabled: function(){
            this.html.find('.btnSubmit').removeClass('hide');
            this.html.find('.btnDisabled').addClass('hide');
        },
        handleClick: function(){
            this.disabled();
            this.onClick(this);
        },
        onClick: function(self){

        },
        onReady: function(isReadySuccess) {

        }
    }));

})(jQuery, _, M139);

