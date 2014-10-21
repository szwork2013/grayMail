
(function ($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.PimToolBar";

    M.namespace(_class, M.View.ViewBase.extend({

        name: _class,

        el: "#pim_tool_bar",

        EVOCATION_TO: "4",

        EVOCATION_TYPE: {
            EMAIL: "1",
            SMS: "2",
            SMM: "3",
            CARD: "4"
        },

        caiyunUrl:{
            baseUrl:"http://pim.10086.cn/",
            formatUrl: 'http://mail.10086.cn/s?func=login:jumpToSSO&sid={0}&extContent={1}',
            page:{
                sso: true,
                channel:"139mail",                
                extContent:'sourceid%3D3%26to%3D6%26optype%3D3'
            }
        },

        toolConfig: [            
            {text:'发邮件', id: 'pim_tool_email', command:'send_email', click:'post_email', type: "EMAIL", action: 'addr_toolPim_postMail', key: 'addr_toolPim_triangleMail',
            menuItems: [
                {text: '发邮件', type: "EMAIL", action: 'addr_toolPim_sendMail' }, 
                {text: '发贺卡', type: "CARD" , action: 'addr_toolPim_sendCard'}
            ]},
            {text:'发短信', id: 'pim_tool_sms', command:'send_sms', click:'post_sms', type: "SMS", action: 'addr_toolPim_postSms', key: 'addr_toolPim_triangleSms',
            menuItems: [
                {text: '发短信', type: "SMS", action: "addr_toolPim_sendSms"}, 
                {text: '发彩信', type: "SMM", action: "addr_toolPim_sendMms"}
            ]},
            {text:'导入到邮箱通讯录', id: 'pim_tool_import', command:'import_contacts', action: 'addr_toolPim_import'},
            {text:'管理"和通讯录"', id: 'pim_tool_manage', command:'manage_pim', action: 'addr_toolPim_managePim'}
        ],  

        command: {},

        logger: new M139.Logger({ name: _class }),

        initialize: function (options) {
            var _this = this;
            _this.master = options.master;
            _this.initUI();
            _this.initEvents();
            return superClass.prototype.initialize.apply(_this, arguments);
        },

        initEvents: function () {
            var _this = this;
            
            _this.command.post_email = function (args) {
                _this.sendMail(args);
            };

            _this.command.post_sms = function (args) {
                _this.sendSms(args);
            };

            _this.command.send_email = function (args) {
                _this.sendMail(args);
            };

            _this.command.send_sms = function (args) {
                _this.sendSms(args);
            };

            _this.command.import_contacts = function (args) {                
                _this.master.trigger(_this.master.EVENTS.REDIRECT, {
                    key: 'addr_pim'
                });
            };

            _this.command.manage_pim = function (args) {
                _this.redirectTo();
            };

        },
        initUI: function(){

            this.ui = {};
            this.ui.body = $('body');
            this.ui.toolSms = this.$el.find('#pim_tool_sms');
            this.ui.toolEmail = this.$el.find('#pim_tool_email');
            this.ui.toolImport = this.$el.find('#pim_tool_import');
            this.ui.toolManage = this.$el.find('#pim_tool_manage');

            this.createTool();
        },
        createTool: function(){
            var _this, config, i, len, options;

            _this = this;          
            config = this.toolConfig;
            len = config.length;            

            for(i = 0; i < len; i++){                
                options = _this.setOptions(config[i]);
                M2012.UI.MenuButton.create(options);
            }           
        },
        byID: function(id){
            return document.getElementById(id);
        },
        setOptions: function(item){
            var _this, options;

            _this = this;
            options = {
                text: item.text,
                action: item.action,
                type: item.type,
                container: this.byID(item.id),
                leftSibling:false,
                rightSibling:false,
                menuItems:item.menuItems                    
            };

            if(item.html){
                options.html = item.html;
            }
            
            if(item.menuItems){
                options.onItemClick = function(obj){
                    top.BH(obj.action);
                    _this.command[item.command](obj);
                };

                if(item.click){
                    options.onClick = function(obj){
                        top.BH(item.action);
                        _this.command[item.click](options);                        
                    };

                    options.onClickBefore = function(e){
                        if(item.key && item.key.length){
                            top.BH(item.key);
                        } 
                        _this.ui.body.click();                        
                        return false;
                    };
                }
            }

            if(!item.menuItems){
                options.onClick = function(obj){         
                    top.BH(item.action);           
                    _this.command[item.command](options);
                };
            }            

            return options;
        },
        sendMail: function(args){
            var _this = this;
            var options = {};
            options.type = _this.EVOCATION_TYPE[args.type];
            options.specify = _this.getData('email').join(';');
            
            _this.evocation(options);
        },
        sendSms: function(args){
            var _this = this;
            var options = {};
            options.type = _this.EVOCATION_TYPE[args.type];
            options.specify = _this.getData('mobile').join(',');            
            
            _this.evocation(options);
        },
        evocation: function(args){
            var _this = this;
            var options = {
                'to': _this.EVOCATION_TO,
                'type': args.type,
                'specify': args.specify
            };

            options.sucCallback = function(){
                if(args.callback){
                    args.callback();
                }
            };

            top.$Evocation.create(options);
        },
        getData: function(type){
            var arr = [];
            $.each(_AndContacts.selected(), function(i, obj){
                arr.push(this.get(type));
            });

            return arr;
        },
        redirectTo: function(){
            var sid = top.$App.getSid();
            var extContent = this.caiyunUrl.page.extContent;
            var url = this.caiyunUrl.formatUrl.format(sid, extContent);
            
            window.open(url);
        }
    }));

})(jQuery, _, M139);