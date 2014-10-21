;
(function ($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.LinkHelper";

    M.namespace(_class, M.Model.ModelBase.extend({

        name: _class,

        defaults: {
            pimData: {},   //和通讯录数据
            repeatData: {}, //重复联系人数据
            updateData: {} //待更新的数据            
        },

        EVENTS: {
            REDIRECT: "redirect",
            INIT_REDIRECT: 'initredirect',
            LOAD_MODULE: "loadmodule",
            LOAD_MAIN: 'loadmain',
            UPDATE_MODULE: 'updatemodule',
            LOAD_DATA: 'loaddata',
            LOAD_WHO_ADD_ME: 'loadWhoAddMe'

        },
        MIN_HEIGHT: 300,
        initialize: function(){
            this.initUI();
            this.bindEvent();
            this.render();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        bindEvent: function() {
            var _this = this;

            this.bind(this.EVENTS.INIT_REDIRECT, function(args){
                _this.initRedirect(args);
                return false;
            });

            this.bind(this.EVENTS.REDIRECT, function(args){
                _this.redirect(args);
                return false;
            });

            this.bind(this.EVENTS.LOAD_MODULE, function(args){
                _this.loadModule(args);
                return false;
            });

            this.bind(this.EVENTS.LOAD_MAIN, function(args){
                _this.loadMain(args);
                return false;
            });

            $(window).resize(function(){
                _this.setResize && clearTimeout(_this.setResize);

                _this.setResize = setTimeout(function(){
                    var winHeight = $(window).height() - 2;
                    var height = winHeight < _this.MIN_HEIGHT ? 
                                _this.MIN_HEIGHT : winHeight;

                   _this.ui.iframe.css({height: height});                  
                }, 100);

            });

            $(window).resize();            
        },
        render: function(){

        },
        initUI: function(){
            this.ui = {};
            this.ui.iframe = $('#addr_main');
            this.ui.mainIframe = $('#main_iframe');            
            this.ui.mainContainer = $('#main_container');
        },
        redirect: function(args) {
            this.ui.iframe.attr({"src": this.getUrl(args.key, args)});
            this.ui.mainContainer.hide();
            this.ui.mainIframe.show();
            $('body').click();
        },
        loadModule: function(args) {
            var _this = this;
            var key = args.key.split(':');

            if(key.length >= 2){
                var model = key[0].trim();
                var fun = key[1].trim();
                _this.trigger(model, _.extend(args, {fun: fun})); 
            }

            if(args.action && args.action.length){
                top.BH(args.action);
            }
        },
        loadMain: function(args){
            this.ui.mainIframe.hide()
            this.ui.mainContainer.show();
            this.ui.iframe.attr({'src': ''});

            this.trigger(this.EVENTS.LOAD_MODULE, {
                    key: 'events:contacts',
                    actionKey: '340'
            });            
        },
        getUrl: function(key, args){
            var renValue = '';
            var path = "../addr";
            var links = {
                "addr_pim": path + "/addr_import_pim.html?sid={0}",
                "addr_merge": "../addr_v2/addr_merge.html?sid={0}&state={1}",
                "addr_update": path + "/addr_updatecontact.html?sid={0}",
                "addr_export": path + "/addr_export.html?sid={0}",
                "addr_add_contacts": "../addr_v2/addr_detail.html?state=create",
                "addr_allNone_create": "../addr_v2/addr_detail.html?state=create",
                "addr_groupNone_create": "../addr_v2/addr_detail.html?state=create&groupid={0}",
                "addr_import_pim": path + "/addr_import_pim.html?sid={0}",
                "addr_import_file": path + "/addr_import_file.html?sid={0}",
                "addr_import_clone": path + "/addr_import_clone.html?sid={0}",
                "addr_allNone_import": path + "/addr_import_clone.html?sid={0}",
                "addr_info_basic": "../addr_v2/addr_personinfo.html?sid={0}",
                "addr_setprivacy": path + "/addr_setprivacy.html?sid={0}",
                "addr_whoaddme": "../addr_v2/addr_maybeknown.html?sid={0}&r={1}",
                "addr_request": path + "/addr_request.html?sid={0}{1}",
                "addr_editGroup" : path + "/addr_group.html?id={0}&r={1}",
                "addr_create_group": path + "/addr_group.html?sid={0}",                
                "addr_editContact" : "../addr_v2/addr_detail.html?state=ready&id={0}&r={1}&pageId=0",
                "andAddr_showContactDetail" : "addr_pim.html?contactId={0}&r={1}",
                "addr_team_create": "../groupmail/group_detail.html?sid={0}",
                "addr_team_edit": "../groupmail/group_detail.html?sid={0}&groupNumber={1}",
                "addr_team_notify": "../groupmail/group_notify.html?sid={0}"
            };

            switch(key){
                case 'addr_whoaddme':
                {
                    renValue = links[key].format(top.$App.getSid(), Math.random());
                    break;
                }
                case 'addr_editGroup':
                {
                    renValue = links[key].format(args.groupId, Math.random());
                    break;
                }
                case 'addr_editContact':
                {
                    renValue = links[key].format(args.contactId, Math.random());
                    break;
                }
                case 'addr_groupNone_create':
                {
                    renValue = links[key].format(args.groupId, Math.random());
                    break;
                }
                case 'addr_request':
                {
                    renValue = links[key].format(top.$App.getSid(), args.params || '');
                    break;
                }
                case "andAddr_showContactDetail":
                {
                    renValue = links[key].format(args.contactId, Math.random());
                    break;
                }
                case 'addr_team_edit':
                {
                    renValue = links[key].format(top.$App.getSid(), args.groupNumner);
                    break;
                }
                case 'addr_merge':
                {   
                    renValue = links[key].format(top.$App.getSid(), args.state);
                    break;
                }
                default :{
                    renValue = links[key].format(top.$App.getSid());                    
                }
            }

            top.BH(key);
            return renValue;
        },
        initRedirect: function(){
            var key = '';
            var params = '';
            var request = this.getRequest();
            if(request['redirect']){
                key = request['redirect'];
                delete request['sid'];
                delete request['redirect'];
                delete request['homeRoute'];
                for(var req in request){
                    params += '&' + req + '=' + request[req];
                }

                if (key == "addr_team_create" || key == "addr_team_notify") {
                    top.$Addr.GomModel.set({ mainState: 'group' });
                }

                this.redirect({key: key, params: params});
            }
        },
        getRequest: function (url) {
            url = url || window.location.search;
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        }

    }));

})(jQuery, _, M139);
