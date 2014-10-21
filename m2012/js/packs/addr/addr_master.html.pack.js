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

;
(function ($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.Common";


    M.namespace(_class, M.Model.ModelBase.extend({

        name: _class,

        initialize: function () {
            var _this = this;            
            superClass.prototype.initialize.apply(_this, arguments);            
            _this.initEvent();
        },

        initEvent: function(){

        },
        fetch: function(options) {
          top.M2012.Contacts.API.call(options.name, options.data, function(e) {
                var rs = e.responseText;
                if (/^(.*?)=/.test(rs)) {
                    rs = rs.match(/^(.*?)=/)[1];
                } else {
                    rs = "GetNumWaitForCleaningResp";
                }
                if (rs) {
                    var result = {};
                    result[rs] = e.responseData;
                    options.success(result);
                }else{
                    options.error(e);
                }
            }, {});
        },
        getImportStatus: function(options){
            var _this = this;

            if (top.Contacts && top.Contacts.getColorCloudInfoData) {
                top.Contacts.getColorCloudInfoData(function (result) {
                    if (result && result.ResultCode == "0") {
                        options.success(result.ColorCloudInfo);
                    }else{
                        options.error(result);
                    }
                });
            }
        },
        GetRepeatContactsNew: function(options){
            var request = '<GetRepeatContactsNew></GetRepeatContactsNew>';

            top.M2012.Contacts.API.call('GetRepeatContactsNew', request, function(result){
                var data = result.responseData;
                if(data && data.ResultCode == "0"){
                   options.success(data);
                }else{
                   options.error(result);
                }
            }, options);
        },
        getWhoAddMePageData: function(options) {
            top.M2012.Contacts.API.getWhoAddMePageData(options.info, function(result){
                if(result.success){
                    options.success(result);
                }else{
                    options.error(result);
                }
            });
        }
    }));

})(jQuery, _, M139);

;
(function ($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.AddrContacts";

    M.namespace(_class, M.Model.ModelBase.extend({

        name: _class,

        initialize: function () {
            var _this = this;            
            superClass.prototype.initialize.apply(_this, arguments);            
            _this.initEvent();
        },

        initEvent: function(){

        },
        sendMail: function(options){
            var _this, request;
            
            _this = this;
            request = "<ModContactsField><SerialId>{0}</SerialId><FamilyEmail>{1}</FamilyEmail></ModContactsField>";
            request = request.format(
                options.selContact.SerialId,
                top.encodeXML(options.inputV)
            );
            
            request = _this.getRequest(request, 'FamilyEmail', options);

            top.Contacts.execContactDetails(request, function (result) {
                if (result.success) {
                    options.success(result);
                } else {
                    options.error(result);                    
                }
            });
        },
        sendCard: function(options){
            var _this, request;

            _this = this;
            request = "<AddContactsField><SerialId>{0}</SerialId><FamilyEmail>{1}</FamilyEmail></AddContactsField>";
            request = request.format(
                options.selContact.SerialId,
                top.encodeXML(options.inputV)
            );
            
            request = _this.getRequest(request, 'FamilyEmail', options);

            top.Contacts.execContactDetails(request, function (result) {
                if (result.success) {
                    options.success(result);
                } else {
                    options.error(result);                    
                }
            });
        },
        modContactsField: function(options){
            top.Contacts.ModContactsField(options.serialID, options.info, false, function(result) {
                if (result.success) {                    
                    options.success(options.value);
                } else {
                    options.error(result);
                }
            });
        },
        addContacts: function(options){
            top.M2012.Contacts.API.addContacts(options.info, function (result) {
                if (result.success) {
                    options.success(result);
                } else {
                    options.error(result);                    
                }
            });
        },
        realDelete: function(options){
            top.Contacts.deleteContacts(options.serialId, function(result) {
                if (result.success) {                   
                    options.success(result);
                    
                } else {
                    options.error(result);
                }
            });
        },
        deleteFromGroup: function(options){
            top.Contacts.deleteContactsFromGroup(options.groupId, options.serialId, function(result) {
                if (result.success) {
                    options.success(result);
                } else {
                    options.error(result);
                }
            });
        },
        sendMMS: function(options){
            var _this, request;

            _this = this;
            request = _this.getRequest(request, 'MobilePhone', options);

            top.Contacts.execContactDetails(request, function (result) {
                if (result.success) {
                    options.success(result);
                } else {
                    options.error(result);                    
                }
            });
        },
        moveContactsToGroup: function(options){
            top.Contacts.moveContactsToGroup(options.serialID, options.formGroupID, options.toGroupID, function(result) {
                if (result.success) {                   
                   options.success(result);
                } else {
                   options.error(result);
                }
            });
        },
        copyContactsToGroup: function(options){
            top.Contacts.copyContactsToGroup(options.groupID, options.serialID, function(result) {
                if (result.success) {
                    options.success(result);
                } else {
                    options.error(result);
                }
            });
        },
        getRequest: function(request, params, options){
            //[FIXED] 接口改变，需要传所有的信息
            var contacts = top.Contacts.getContactsById(options.selContact.SerialId);
            var groupID = top.Contacts.getContactsGroupById(options.selContact.SerialId);
            if (contacts) {
                contacts['GroupId'] = groupID.join(',');
                contacts[params] = top.encodeXML(options.inputV);                
                request = contacts;
            }
            
            return request;
        },
        editGroupList: function(options){
            window.top.Contacts.editGroupList({ groupName: options.groupName, serialId: options.serialId }, function(result) {
                if (result.ResultCode == "0") {
                   options.success(result);
                } else {
                    options.error(result);
                }
            });
        }
    }));

})(jQuery, _, M139);

;
(function ($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.View.Tool";

    M.namespace(_class, M.Model.ModelBase.extend({

        name: _class,

        initialize: function () {
            var _this = this;            
            superClass.prototype.initialize.apply(_this, arguments);
        },
        alert: function () {
            return top.$Msg.alert.apply(top.$Msg, arguments);
        },
        confirm: function () {
            return top.$Msg.confirm.apply(top.$Msg, arguments);
        },

        showHTML: function (){
            return top.$Msg.showHTML.apply(top.$Msg, arguments);
        },

        getSid: function () {
            return top.$App.getSid();
        },
        
        getMaxSend: function () {
            return top.$User.getMaxSend();
        },
        
        getServiceItem: function () {
            return top.$User.getServiceItem();
        },

        updateVipMail:function(){
            if(top.Main.searchVipEmailCount){
                top.Main.searchVipEmailCount();
            }
        },

        checkAvaibleForMobile: function(receiver, params, scontent){            
            // 检测对应功能是否对互联网用户开放
            return !(top.$User && !top.$User.checkAvaibleForMobile());            
        },

        getEmail: function (contacts) {
            var tmp, map, len, receiver;

            map = {};
            receiver = [];
            len = contacts.length;
            tmp = len > 20 ? '{0}' : '{1}<{0}>';

            $(contacts).each(function() {                
                var email = this.getFirstEmail();
                if (email && !map[email]){
                    map[email] = true;                    
                    receiver.push(tmp.format(email, this.name.replace(/"/g, "")));                    
                }
            });

            return receiver.join(';');
        },
        getMoblie: function(contacts){
            var map, receiver;

            map = {};
            receiver = [];

            $(contacts).each(function() {
                var mobile = this.getFirstMobile().replace(/\D/g, "");
                if (mobile && !map[mobile]){
                    map[mobile] = true;
                    receiver.push(mobile);
                }
            });

            return receiver.join(',');
        },
        getNextHtml: function(name){
            return '<div class="boxIframeMain">\
                        <ul class="form ml_20">\
                            <li class="formLine">\
                                <label class="label" style="width:28%;"><strong>请输入{0}</strong>：</label>\
                                <div class="element" style="width:70%;">\
                                    <input type="text" class="iText"  id="txtValue" maxlength="40" style="width:170px;">\
                                </div>\
                            </li>\
                            <li><div id="txtMessage" name="divError"  style="color:Red;padding-left:113px"></div></li>\
                        </ul>\
                    <div class="boxIframeBtn"><span class="bibBtn"> <a href="javascript:void(0)"  id="btnNext"  class="btnSure"><span>下一步</span></a>&nbsp;<!-- a href="javascript:void(0)" class="btnNormal"><span>取 消</span></a--> </span></div>\
                </div>\
            </div>'.format(name);
        }
    }));

})(jQuery, _, M139);

;
(function ($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.View.Events";


    M.namespace(_class, M.Model.ModelBase.extend({

        name: _class,

        module: 'events',

        initialize: function (options) {
            var _this = this;
            superClass.prototype.initialize.apply(_this, arguments);

            _this.master = options.master;
            _this.initEvent();
        },

        initEvent: function(){
            var _this = this;

            var master = _this.master;
            var EVENTS = master.EVENTS;
            _this.loadStatus = false;

            master.bind(this.module, function(data){
                _this[data.fun](data);
            });

            _EA_G.keyOn("GROUP_SELECTED", function(data){
                master.trigger(EVENTS.LOAD_MODULE, {key: 'toolbar:groupChange', data: data.groupId});
            });

            _EA_G.keyOn("ADD_GROUP", function(args){                
                master.trigger(EVENTS.LOAD_MODULE, _.extend(args, {key: 'toolbar:setGroupData'}));
            });

            _EA_G.keyOn("EDIT_GROUP", function(args){
                master.trigger(EVENTS.LOAD_MODULE, _.extend(args, {key: 'toolbar:setGroupData'}));
            });

            _EA_G.keyOn("DELETE_GROUP", function(args){
                master.trigger(EVENTS.LOAD_MODULE, _.extend(args, {key: 'toolbar:setGroupData'}));
            });

            _EA_C.keyOn("NO_CONTACTS_RENDER", function (args) {
                master.trigger(EVENTS.LOAD_MODULE, {key: 'toolbar:toolHide'});
            });

            _EA_C.keyOn("CONTACTS_RENDERED", function (args) {
                master.trigger(EVENTS.LOAD_MODULE, {key: 'toolbar:toolShow'});
            });


            top.$App.on("GlobalContactLoad", function(e){
                _this.loadStatus = true;
            });

            _this.setConfig();
        },
        group: function(args){
            //通讯录数据不能及时更新, 延迟刷数据
            var config = this.getConfig(args);
            _EA_G.keyTrigger(config.command, config.data, config.param);
            /*args = {
                    command: 'DELETE_GROUP',
                    data: {
                        groupId: '123456',
                        contactsId['12', '12'] 
                    },
                    param: {
                        selectGroupType: 20
                    }
                };
            */
        },
        selectGroup: function (args) {
             var data = args.data;
            
            if(data.groupId == 0){
                data.groupId = _DataBuilder.allContactsGroupId();
            }


            _EA_G.keyTrigger(args.command, data, args.param);
        },
        contacts: function(args){
            //通讯录数据不能及时更新, 延迟刷数据
             /*
                    args = {
                        command: 'COPY_TO_GROUP',
                        data: {
                            contactsId: ['123456','456789'],
                            dstGroupId: '123' 
                        },
                        param: {
                            selectGroupType: 20
                        }
                    };
                */

            var config = this.getConfig(args);
            if(config.cache){                
                /*var _this = this;
                var num = 100; 
                var interval = setInterval(function(){
                    if(_this.loadStatus || !num){
                        _this.loadStatus = false;
                        clearInterval(interval);
                        _EA_C.keyTrigger(config.command, config.data, config.param);
                    }
                    num--;
                }, 50);*/
                setTimeout(function(){
                    _EA_C.keyTrigger(config.command, config.data, config.param);
                },6000);
            }else{
                _EA_C.keyTrigger(config.command, config.data, config.param); 

            }

        },
        resetLeftbar: function (argument) {
//            _EA_G.keyTrigger("RESET_GROUPS_LIST_HEIGHT");
            _EA_G.keyTrigger("AUTO_LOCATE_NAV");
        },        
        getConfig: function(args){  
            var config, group, contact;

            config = this.config[args.actionKey];
            config.data = {};
            config.param = {};

            if(config.renderGC){
                config.param['renderGC'] = _CFG.getRenderGC(config.renderGC);
            }

            if(args.groupId){
                group = typeof(args.groupId) == 'string' ? 'groupId' : 'groupsId';
                config.data[group] = args.groupId;
            }

            if(args.contactId){
                contact = typeof(args.contactId) == 'string' ? 'contactId' : 'contactsId';
                config.data[contact] = args.contactId;                
            }

            if(args.srcGroupId){
                config.data['srcGroupId'] = args.srcGroupId;
            }

            if(args.dstGroupId){
                config.data['dstGroupId'] = args.dstGroupId;
            }


            return config;
        },
        setConfig: function(){
            this.config = {};
            this.arrArgs = [];

            this.arrArgs.push([10, 'CC', 'ADD_CONTACT', '添加联系人', {}]);
            this.arrArgs.push([20, 'UC', 'EDIT_CONTACT', '编辑联系人', {}]);
            this.arrArgs.push([30, 'DC', 'DELETE_CONTACTS', '删除联系人', {}]);

            this.arrArgs.push([40, 'CG', 'ADD_GROUP', '添加组', {}]);
            this.arrArgs.push([50, 'UG', 'EDIT_GROUP', '编辑组', {}]);
            this.arrArgs.push([60, 'DG', 'DELETE_GROUP', '删除组', {}]);

            this.arrArgs.push([110, 'CC', 'ADD_CONTACT', '添加联系人', {}]);
            this.arrArgs.push([120, 'UC', 'EDIT_CONTACT', '编辑联系人', {}]);
            this.arrArgs.push([130, 'DC', 'DELETE_CONTACTS', '删除联系人', {}]);

            this.arrArgs.push([140, 'CG_Silent', 'ADD_GROUP', '添加组', {}]);
            this.arrArgs.push([150, 'UG', 'EDIT_GROUP', '编辑组', {}]);            
            this.arrArgs.push([160, 'DG', 'DELETE_GROUP', '删除组', {}]);


            this.arrArgs.push([210, 'MC2G', 'MOVE_TO_GROUP', '移动到组', {}]);
            this.arrArgs.push([220, 'CC2G', 'COPY_TO_GROUP', '复制到组', {}]);
            this.arrArgs.push([230, '', 'UNSELECT_ALL', '取消选中', {}]);
            
            this.arrArgs.push([310, 'MC', 'IMPORT_CONTACTS', '导入', {}]);//批量导入
            this.arrArgs.push([320, 'SC', 'SYN_CONTACTS', '更新', {}]);
            this.arrArgs.push([321, 'SC', 'SYN_CONTACTS', '更新', {}]); //批量更新
            this.arrArgs.push([330, 'MC', 'MERGE_CONTACTS', '合并', {}]);
            this.arrArgs.push([331, 'MC', 'MERGE_CONTACTS', '合并', {}]);//批量合并

            this.arrArgs.push([340, '', 'RESET_CONTACTS_LIST_HEIGHT', '设置高度', {}]);

            this.arrArgs.push([350, null, 'EDIT_SEL_GROUP', '工具栏编辑分组', {}]);
            this.arrArgs.push([360, null, 'DELETE_SEL_GROUP', '工具栏删除分组', {}]);

            

            for(var i = 0, len = this.arrArgs.length; i < len; i++){
                this.createConfig(this.arrArgs[i]);
            }
        },
        createConfig: function(item){
            this.config[item[0]] = {
                renderGC: item[1],
                command: item[2]                                
            };

            if(item[0] == 331 || item[0] == 321){
                this.config[item[0]].cache = true;
            }
        }        

    }));

})(jQuery, _, M139);

;(function ($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.View.AddrContacts";

    if (window.ADDR_I18N) {
        var message = ADDR_I18N[ADDR_I18N.LocalName];
        var vipMsg = message.vip;
        var pageMsg = message.home;        
    }

    M.namespace(_class, M.Model.ModelBase.extend({

        name: _class,

        module: 'contact',

        template: '<div class="boxIframeMain">\
                            <div class="boxIframeText boxIframeText_btton">\
                                <em><a href="javascript:void(0);" id="btnMergeName" class="btnSure"><span>按姓名合并({0})</span></a></em>\
                                <p>合并“姓名”相同的联系人</p>\
                                <span class="boxIframeText_btton_line"></span>\
                                <em><a href="javascript:void(0)" id="btnMergeEmail" class="btnSure"><span>按邮箱/手机合并({1})</span></a></em>\
                                <p>合并“邮箱相同”或“手机相同”的联系人</p>\
                            </div>\
                        </div>',

        retryTime: 0,

        initialize: function (options) {
            var _this = this;

            _this.master = options.master;
            _this.tool = new M2012.Addr.View.Tool();
            _this.model = new M2012.Addr.Model.AddrContacts();
            _this.contModel = top.M2012.Contacts.getModel();
            superClass.prototype.initialize.apply(_this, arguments);            
            _this.initEvent();
        },
        initEvent: function(){
            var _this = this;
            var master = this.master;

            master.bind(_this.module, function(data){
                _this[data.fun](data);
            });
        },
        sendMail: function(args){
            var _this, contacts, options, check, email;

            _this = this;            
            contacts = _this.getContacts(args);               

            options = {
                sendType: 'Mail',
                tool: _this.tool,
                model: _this.model,
                len: contacts.length,
                selContact: contacts[0],
                maxSend: _this.tool.getMaxSend()
            };

            check = new M2012.Addr.View.Check(options);
            check.onCheck = function(len){
                if(len == 1 && !this.checkType("e")){
                    return false;
                }

                email = this.tool.getEmail(contacts);
                top.$Evocation.create({
                    'to':'4',
                    'type': '1',
                    'specify': email
                });

                _this.master.trigger(_this.master.EVENTS.LOAD_MODULE, {
                    key: 'events:contacts',
                    actionKey: '230'
                });
            };

            check.onSuccess = function(selContact){
                _this.master.trigger(_this.master.EVENTS.LOAD_MODULE, {
                    key: 'events:contacts',
                    actionKey: '120',
                    contactId: selContact.SerialId
                });

                _this.master.trigger(_this.master.EVENTS.LOAD_MODULE, {
                    key: 'events:contacts',
                    actionKey: '230'
                });

                top.BH('addr_editTool_email');
            };

            check.init();
        },
        sync: function(){                
            top.$App.show("syncguide");  
        },
        sendCard: function(args){
            var _this, contacts, options, check, email;

            _this = this;
            contacts = _this.getContacts(args);

            options = {
                sendType: 'GCard',
                tool: _this.tool,
                model: _this.model,
                len: contacts.length,
                selContact: contacts[0],
                maxSend: _this.tool.getMaxSend()
            }; 

            check = new M2012.Addr.View.Check(options);
            check.onCheck = function(len){
                if(len == 1 && !this.checkType("e")){
                    return false;
                }

                email = this.tool.getEmail(contacts);
                top.$Evocation.create({
                    'to':'4',
                    'type': '4',
                    'specify': email
                });

                _this.master.trigger(_this.master.EVENTS.LOAD_MODULE, {
                    key: 'events:contacts',
                    actionKey: '230'
                });
            };

            check.onSuccess = function(selContact){
                _this.master.trigger(_this.master.EVENTS.LOAD_MODULE, {
                    key: 'events:contacts',
                    actionKey: '120',
                    contactId: selContact.SerialId
                });

                _this.master.trigger(_this.master.EVENTS.LOAD_MODULE, {
                    key: 'events:contacts',
                    actionKey: '230'
                });

                top.BH('addr_editTool_card');
            };

            check.init();
        },
        sendSMS: function(args){
            var _this, contacts, options, check, params, moblie;

            _this = this;
            params = args.params;
            contacts = _this.getContacts(args);

            options = {
                sendType: 'SMS',
                tool: _this.tool,
                model: _this.model,
                len: contacts.length,
                selContact: contacts[0],
                maxSend: _this.tool.getMaxSend()
            };

            check = new M2012.Addr.View.Check(options);
            check.onCheck = function(len){
                if(len == 1 && !this.checkType("m")){                    
                    return false;
                }

                moblie = this.tool.getMoblie(contacts);
                top.$Evocation.create({
                    'to':'4',
                    'type': '2',
                    'specify': moblie
                });

                _this.master.trigger(_this.master.EVENTS.LOAD_MODULE, {
                    key: 'events:contacts',
                    actionKey: '230'
                });
            };

            check.onSuccess = function(selContact){
                _this.master.trigger(_this.master.EVENTS.LOAD_MODULE, {
                    key: 'events:contacts',
                    actionKey: '120',
                    contactId: selContact.SerialId
                });

                _this.master.trigger(_this.master.EVENTS.LOAD_MODULE, {
                    key: 'events:contacts',
                    actionKey: '230'
                });

                top.BH('addr_editTool_sms');
            };

            check.init();
        },
        sendMMS: function(args){
            var _this, contacts, params, options, check, moblie;

            _this = this;
            contacts = _this.getContacts(args);

            options = {
                sendType: 'MMS',
                tool: _this.tool,
                model: _this.model,
                len: contacts.length,
                selContact: contacts[0],
                maxSend: _this.tool.getMaxSend()
            };

            check = new M2012.Addr.View.Check(options);
            check.onCheck = function(len){
                if(len == 1 && !this.checkType("m")){
                    return false;
                }

                if(this.tool.checkAvaibleForMobile()){
                    moblie = this.tool.getMoblie(contacts);
                    top.$Evocation.create({
                        'to':'4',
                        'type': '3',
                        'specify': moblie
                    });
                }

                _this.master.trigger(_this.master.EVENTS.LOAD_MODULE, {
                    key: 'events:contacts',
                    actionKey: '230'
                });
            };

            check.onSuccess = function(selContact){
                _this.master.trigger(_this.master.EVENTS.LOAD_MODULE, {
                    key: 'events:contacts',
                    actionKey: '120',
                    contactId: selContact.SerialId
                });

                _this.master.trigger(_this.master.EVENTS.LOAD_MODULE, {
                    key: 'events:contacts',
                    actionKey: '230'
                });

                top.BH('addr_editTool_mms');
            };

            check.init();                               
        },
        remove: function(args){

            if (top.Utils.PageisTimeOut(true)) {
                return;
            }
            
            //联系人在编辑状态下所有操作无效
            //if (mail139.addr.home.isediting) return;
            
            var _this, serialId, msg, groupID, ui, group, dialog;

            msg = {
                lang_01: pageMsg['warn_noneselect'],
                lang_02: pageMsg['warn_delcontact'] || "",
                lang_03: pageMsg['warn_delContactsHasVip'],
                lang_04: pageMsg['warn_delVipContact'],
                lang_05: pageMsg['warn_delInGroup'] || "",
                lang_06: ''

            };

            ui = {};
            _this = this;
            ui.cboxTmpl  = "<br>\
                            <label for='yesDeleteContactsFromGroup'>\
                                <input id='chkRemove' type='checkbox'/>\
                            </label>";
            
            serialId = _this.getSID(args);            
            groupID = _Groups.selectedGroupId();

            if (serialId.length == 0) {
                top.M139.UI.TipMessage.show(msg.lang_01, { delay: 2000, className: 'msgYellow'});
                return;
            }

            if (groupID && groupID > 0) {                   
                msg.lang_06 = msg.lang_05.replace("$checkbox$", ui.cboxTmpl);

                dialog = _this.tool.confirm(msg.lang_06, function(){
                    ui.chkRemove = dialog.$el.find("#chkRemove");

                    if (!!ui.chkRemove.attr("checked")) {
                        _this.realDelete(serialId);
                    } else {
                        if(_Groups.selectedGroup().isVipGroup()){
                           _this.removeVip(args, true);
                        }else{
                           _this.deleteFromGroup(serialId);
                        }
                    }
                }, "", "", {isHtml:true});

            } else {
                var tipMsg = msg.lang_02;
                var hasVip = top.Contacts.FilterVip(serialId);

                if(hasVip.length > 0){
                    tipMsg = serialId.length > 1 ? msg.lang_03 : msg.lang_04;
                }

                _this.tool.confirm(tipMsg, function(){ 
                    _this.realDelete(serialId);
                }, "", "", {isHtml:true});
            }                                
        },
        realDelete: function(serialId){
            var _this, options;

            _this = this;                
            options = {serialId: serialId};

            options.success = function(result){

                top.$App.trigger("change:contact_maindata");
                //更新vip联系人信息
                var vipList = top.Contacts.FilterVip(serialId);
                if(vipList.length > 0){
                    vipList = vipList.join(",");
                    top.Contacts.updateCache("delVipContacts",vipList);
                }
                
                _this.master.trigger(_this.master.EVENTS.LOAD_MODULE, {
                    key: 'events:contacts',
                    actionKey: '230'
                });


                _this.master.trigger(_this.master.EVENTS.LOAD_MODULE, {
                    key: 'events:contacts',
                    actionKey: '130',
                    contactId: options.serialId
                });

                top.BH('addr_delContacts_toolbar');
            };

            options.error = function(result){
                _this.tool.alert(result.msg);
            };
            
            _this.model.realDelete(options);              
        },
        deleteFromGroup: function(serialId){
            var _this, options;

            _this = this;
            options = {
                groupId: _Groups.selectedGroupId(),
                serialId: serialId
            };

            options.success = function(result){                   
                //更新缓存
                _this.master.trigger(_this.master.EVENTS.LOAD_MODULE, {
                    key: 'events:contacts',
                    actionKey: '230'
                });

                _this.master.trigger(_this.master.EVENTS.LOAD_MODULE, {
                    key: 'events:contacts',
                    actionKey: '130',
                    contactId: options.serialId,
                    groupId: options.groupId
                });

                top.BH('addr_delContacts_toolbar');
            };

            options.error = function(result){
                _this.tool.alert(result.msg);
            };
            
            _this.model.deleteFromGroup(options);
        },
        copyGroup: function(args){
            var _this, msg, options;

            _this = this;
            options = {
                groupID: args.data.GroupId,
                serialID: this.getSID(args)
            }               

            msg = {
                lang_01: pageMsg['warn_hasgrouped'],
                lang_02: pageMsg['warn_noneselect'],
                lang_03: pageMsg['info_success_copy']
            };

            if (!options.groupID.length) {
                top.M139.UI.TipMessage.show(msg.lang_01, { delay: 2000, className: 'msgYellow'});
                return;
            }               

            if (options.serialID.length == 0) {
                top.M139.UI.TipMessage.show(msg.lang_02, { delay: 2000, className: 'msgYellow'});
                return;
            }

            options.success = function(result){
                _this.master.trigger(_this.master.EVENTS.LOAD_MODULE, {
                    key: 'events:contacts',
                    actionKey: '220',
                    contactId: options.serialID,
                    dstGroupId: options.groupID
                    
                });

                _this.master.trigger(_this.master.EVENTS.LOAD_MODULE, {
                    key: 'events:contacts',
                    actionKey: '230'
                });

                _this.tool.alert(msg.lang_03);
                top.BH('addr_copyGroup_success');
            };

            options.error = function(result){
                _this.tool.alert(result.msg);
            };

            _this.model.copyContactsToGroup(options);
        },
        newGroup: function(args){
            var _this, ui, serialID, MAXLENGTH_GROUP, msg, options, nextHtml, dialog;                
            
            ui = {};
            _this = this;
            MAXLENGTH_GROUP = 16;

            msg = {
                lang_01: '分组名称',
                lang_02: '新建组',
                lang_03: '分组名称不能为空',
                lang_04: '组名重复，请尝试其它组名',
                lang_05: '复制成功',
                lang_06: '复制失败',
                lang_07: pageMsg['warn_noneselect'],
                lang_08: pageMsg['warn_groupoverflow'].replace("$maxlength$", MAXLENGTH_GROUP)
            }

            serialID = _this.getSID(args);

            if (serialID.length == 0) {
                top.M139.UI.TipMessage.show(msg.lang_07, { delay: 2000, className: 'msgYellow'});
                return;
            }
            
            dialog = this.tool.showHTML(_this.tool.getNextHtml(msg.lang_01), msg.lang_02);            

            
            ui.el = dialog.$el;
            ui.message = ui.el.find("#txtMessage");
            ui.btnNext = ui.el.find("#btnNext");
            ui.txtValue = ui.el.find("#txtValue");

            ui.btnNext.click(function() {
                var groupName = ui.txtValue.val().trim();

                if (!groupName.length) {
                    ui.message.text(msg.lang_03);
                    return false;
                }

                if (top.Contacts.isExistsGroupName(groupName)) {
                    ui.message.text(msg.lang_04);
                    return false;
                }

                if (groupName.length > MAXLENGTH_GROUP) {
                    ui.message.text(msg.lang_08);
                    return false;
                }

                options = { 
                    groupName: groupName,
                    serialId: serialID
                 };

                options.success = function(result){
                    var param = {
                        "groupName": groupName,
                        "serialId": serialID.join(","),
                        "groupId": result.GroupInfo[0].GroupId
                    }

                    top.Contacts.updateCache("AddGroup", param);
                    top.Contacts.updateCache("CopyContactsToGroup", param);
                    _this.master.trigger(_this.master.EVENTS.LOAD_MODULE, {
                        key: 'events:group',
                        actionKey: '140',
                        contactId: options.serialId,
                        groupId: param.groupId
                    });

                    dialog.close();
                    _this.tool.alert(msg.lang_05);
                };

                options.error = function(result){
                    top.M139.UI.TipMessage.show(msg.lang_06, { delay: 2000, className: 'msgYellow'});
                };

                _this.model.editGroupList(options);
                
            });
        },
        moveGroup: function(args){
            var _this, msg, options;

            _this = this;
            options = {                    
                serialID: _this.getSID(args),
                toGroupID: args.data.GroupId,
                formGroupID: _Groups.selectedGroupId()
            };

            msg = {
                lang_01: pageMsg['warn_hasgrouped'],
                lang_02: pageMsg['error_notarget'],
                lang_03: pageMsg['warn_noneselect'],
                lang_04: '移动成功'
            };

            if (options.toGroupID == options.formGroupID) {
                top.M139.UI.TipMessage.show(msg.lang_01, { delay: 2000, className: 'msgYellow'});
                return;
            } 

            if(!options.toGroupID || !options.formGroupID){
                throw msg.lang_02;
            }

            if (options.serialID.length == 0) {
                top.M139.UI.TipMessage.show(msg.lang_03, { delay: 2000, className: 'msgYellow'});
                return;
            }               

            options.success = function(result){                
                top.M139.UI.TipMessage.show(msg.lang_04, { delay: 2000});
                //更新左边组数据
                _this.master.trigger(_this.master.EVENTS.LOAD_MODULE, {
                    key: 'events:contacts',
                    actionKey: '210',
                    contactId: options.serialID,
                    srcGroupId: options.formGroupID,
                    dstGroupId: options.toGroupID
                });

                _this.master.trigger(_this.master.EVENTS.LOAD_MODULE, {
                    key: 'events:contacts',
                    actionKey: '230'
                });

                top.BH('addr_moveGroup_success');
            };

            options.error = function(result){
                _this.tool.alert(result.msg);
            };

            this.model.moveContactsToGroup(options);
        },
        addVip: function(args){
            var _this = this;
            var groupID = _Groups.selectedGroupId();
            top.Contacts.addVIPContact(function(param){
                _this.master.trigger(_this.master.EVENTS.LOAD_MODULE, {
                    key: 'events:group',
                    actionKey: '150',
                    contactId: param,
                    groupId: groupID
                });
            });                
        },
        removeVip: function(args, isShowTip){
            var _this, serialID, msg, ui, params;

            _this = this;
            serialID = this.getSID(args);
            msg = {
                lang_01: pageMsg["warn_noneselect"],
                lang_02: vipMsg["cancelVipText"]
            };

            if(serialID.length == 0){
                top.M139.UI.TipMessage.show(msg.lang_01, { delay: 2000, className: 'msgYellow'});
                return false;
            }
            
            params = {
                serialId :serialID.join(',')
            }

            if(isShowTip){
                _this.removeVipInCard(params);
            }else{
                _this.tool.confirm(msg.lang_02, function () {
                    _this.removeVipInCard(params);
                }, "", "", {isHtml:true});
            }                
        },
        removeVipInCard: function(params){
            var _this, msg, vips, requestData, callback, ui, vipCount, alert;

            ui = {};
            msg = {};
            _this = this;
            

            msg.lang_01 = '正在保存...';
            msg.lang_02 = vipMsg['syserror'];
            msg.lang_03 = vipMsg['sysBusy'];
            msg.lang_04 = vipMsg['opSuc'];
            
            ui.retry = '<a href="javascript:void(0);" id="btnRetry">重试</a>';

            if(!params.serialId){
                return false;
            }

            //top.WaitPannel.show(msg.lang_01);
            top.M139.UI.TipMessage.show(msg.lang_01);
            if(!top.Contacts.IsExitVipGroup){
                return false; //不存在vip联系人组
            }
            
            vips = top.Contacts.data.vipDetails;
            requestData = {
                groupId : vips.vipGroupId,
                serialId: params.serialId
            }

            //回调
            callback = function(res){
                top.M139.UI.TipMessage.hide();                
                
                if(res.ResultCode != 0){
                    if(_this.retryTime >=3){
                        _this.retryTime = 0;                        
                        top.M139.UI.TipMessage.show(msg.lang_02, { delay: 2000, className: 'msgYellow'});
                    }else{ //重试3次                        
                        alert = _this.tool.alert(msg.lang_03 + ui.retry);
                        alert.$el.find('#btnRetry').click(function(){
                            _this.retryTime++;
                            _this.removeVipInCard(params);
                            alert.close();
                        });
                    }
                    return false;
                }
                
                top.M139.UI.TipMessage.show(msg.lang_04, { delay: 2000});
                top.Contacts.updateCache("delVipContacts", params.serialId);
                top.$App.trigger("change:contact_maindata");

                _this.master.trigger(_this.master.EVENTS.LOAD_MODULE, {
                    key: 'events:contacts',
                    actionKey: '130',
                    contactId: requestData.serialId.split(','),
                    groupId: requestData.groupId
                });

                _this.retryTime = 0;
                _this.tool.updateVipMail(); 
                top.BH('addr_delContacts_toolbar');                   
            }

            top.Contacts.DelGroupList(requestData, callback);
        },
        merge: function(){

            var _this = this;
            var ui = {};
            var data = this.master.get('repeatData');
            var options = {dialogTitle: '合并联系人'};
            var template = this.template.format(data.NameNum, data.InfoNum);
            var dialog = this.tool.showHTML(template, '','','', options);

            ui.el = dialog.$el;
            ui.btnMergeName = ui.el.find('#btnMergeName');
            ui.btnMergeEmail = ui.el.find('#btnMergeEmail');

            ui.btnMergeName.click(function(){
                dialog.close();
                top.BH('addr_merge_tip_name');
                _this.master.trigger(_this.master.EVENTS.REDIRECT, {key: 'addr_merge', state: 'name'});
            });

            ui.btnMergeEmail.click(function(){
                dialog.close();
                top.BH('addr_merge_tip_email');
                _this.master.trigger(_this.master.EVENTS.REDIRECT, {key: 'addr_merge', state: 'email'});
            });

            top.BH('addr_merge_success_tip');
        },
        getContacts: function(args){
            var model, contact, list, len, data;

            list = [];
            data = args ? args.data : {};

            //单个处理, 优先级要高于多选操作
            if(data && data.sids && data.sids.length){
                contact = data.sids;                
            }else{
               contact = _Contacts.selectedIds(); 
            }

            for(var i = 0, len = contact.length; i < len; i++){
                var item = this.contModel.getContactsById(contact[i]);
                list.push(item);
            }            

            return list;
        },
        getSID: function(args){
            var contact, data;

            data =  args ? args.data : {};            

            //单个处理, 优先级要高于多选操作
            if(data && data.sids && data.sids.length){
                contact = data.sids;
            }else {
                contact = _Contacts.selectedIds();
            }

            return contact;
        }
    }));
})(jQuery, _, M139);

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


(function ($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Remind";

    M.namespace(_class, M.View.ViewBase.extend({

        name: _class,

        el: "body",

        module: 'remind',

        addMeData: [], //缓存可能认识的人

        WHO_TYPE: {
            ONCE: 'once',
            BIS: 'bis'
        },

        template:'<li class="clearfix">\
                    <a href="javascript:void(0);" data-index="<%=index%>" class="btn-photo"><img src="<%=url%>" width="36px" height="36px"></a>\
                    <span><%=showName%></span>\
                    <a href="javascript:void(0);" data-index="<%=index%>" class="btn-add add-btns">添加</a>\
                </li>',

        REMIND_MAX: 2,

        logger: new M139.Logger({ name: _class }),

        initialize: function (options) {
            var _this = this;

            _this.master = options.master;
            _this.model = new M2012.Addr.Model.Common();
            _this.initUI();
            _this.initEvents();            
            return superClass.prototype.initialize.apply(_this, arguments);
        },

        initEvents: function () {
            var _this = this;
            var master = this.master;

            _this.on("print", function () {
                
            }); 

            master.bind(_this.module, function(data){
                _this[data.fun](data);
            });

            master.on(master.EVENTS.LOAD_WHO_ADD_ME, function(data) {
                _this.append(data);
            });
           
			_this.getWhoAddMe();
			_this.getMergeData();
			_this.getImportData();
			_this.getUpdateData();                    
        },
        initUI: function(){
            this.ui = {};
            this.ui.wamNum = $('#wam_num');
            this.ui.wamBox = $('#wam_box');
            this.ui.toolMove = $('#tool_move');
            this.ui.wamContainer = $('#wam_container');            
        },
        getWhoAddMe: function(info){
            var _this, options;

            _this = this;
            var options = {
                    info: {
                        isRand: 1,
                        pageSize: 2,
                        pageIndex: 1
                    }
                };            

            options.success = function(result){
                top.BH('addr_whoAddMe_loadRemind');
                _this.setWhoAddMeUI(result.list);
            };

            options.error = function(result){
                _this.ui.wamContainer.hide();
            };

            this.model.getWhoAddMePageData(options);
        },
        append: function(info){
            var _this = this;
            var user = null;
            var type = '';
            var isAppend = false;

            //查找被添加的人在不在当前存量里面,如果在,剔除,重新弄请求一条数据
            if(info && this.addMeData){
                for(var i = 0; i < this.addMeData.length; i++){
                    var list = this.addMeData[i];
                    if(list.UserNumber == info.UserNumber){
                        isAppend = true;
                        type = list.RelationId.length == 0 ? this.WHO_TYPE.BIS : this.WHO_TYPE.ONCE;
                        this.addMeData.splice(i, 1);                        
                        break
                    }
                }
            }

            if(isAppend){
                var options = {
                        info: {
                            isRand: 1,
                            pageSize: 2,
                            pageIndex: 1
                        }
                    };

                var fun = {
                   bis: function (len) {
                        return len == 0; 
                   },
                   once: function (len) {
                        return len > 0;
                   } 
                };

                options.success = function(result) {
                    var list = [];
                    var current = _.pluck(_this.addMeData, 'UserNumber');
                    var map = info.UserNumber + ',' + current.join(',');

                    //首先去重
                    for(var i = 0; i < result.list.length; i++){
                        var item = result.list[i];
                        if(map.indexOf(item.UserNumber) < 0){
                            list.push(item);
                        }
                    }

                    if(list.length > 0){

                        //根据被剔除的数据类型,获取相应的数据类型
                        for(var i = 0; i < list.length; i++){
                            var len = list[i].RelationId.length;

                            if(fun[type](len)){
                                user = list[i];
                                break;
                            }
                            
                            user = list[0];
                        }

                        if(user){
                            _this.addMeData.push(user);
                        }                        
                    }

                    _this.setWhoAddMeUI(_this.addMeData);
                };

                options.error = function() {

                };  

                this.model.getWhoAddMePageData(options);   
            }
            
        },
        setWhoAddMeUI: function(list){
            var buff = [];
            var _this = this;
            var len = list.length > _this.REMIND_MAX ? _this.REMIND_MAX : list.length;

           for(var i = 0; i < len; i++){
                var item = list[i];
                if(item.DealStatus == "0"){
                    item.index = i;
                    item.url = (new top.M2012.Contacts.ContactsInfo(item)).ImageUrl;
                    item.showName = M139.Text.Html.encode(_this.replaceStar(item.Name));
                    buff.push(_.template(_this.template, item));
                }

                list[i] = item;
            }

            if(buff.length){
                _this.ui.wamBox.html(buff.join('\n'));
                _this.ui.wamContainer.show();

                _this.ui.wamBox.find('.btn-add').click(function(){
                    _this.setDailog($(this));
                    top.BH('addr_remind_add');
                });

                _this.ui.wamBox.find('.btn-photo').click(function(){
                    _this.setDailog($(this));
                    top.BH('addr_remind_photo');
                });
            }else{
                this.ui.wamContainer.hide();
            }

            _this.addMeData = list;
            _this.master.trigger(_this.master.EVENTS.LOAD_MODULE, {
                key: 'events:resetLeftbar'
            });
        },
        setDailog: function(dom){
            var _this = this;
            var list = _this.addMeData;
            var index = parseInt(dom.data('index'));
            var dialog = new M2012.Addr.View.MaybeknownDialog({data: list[index]});
                dialog.onSuccess = function(info) {
                    _this.master.trigger(_this.master.EVENTS.LOAD_WHO_ADD_ME, info);
                };
        },
        getImportData: function(){
            var _this, options, master, obj;

            _this = this;
            options = {};            
            master = this.master;

            options.success = function(result){
                obj = new Object(result);                      
                obj.sum = parseInt(result.Update);
                master.set({pimData: obj});
            };

            options.error = function(result){

            };

            this.model.getImportStatus(options);
        },
        getMergeData: function(){
            var _this, options, info, master, obj;
            
            _this = this;
            master = this.master;

            options = {};
            options.success = function(result){
                obj = new Object(result);                
                obj.InfoNum = parseInt(obj.InfoNum);
                obj.NameNum = parseInt(obj.NameNum);
                obj.sum = obj.InfoNum + obj.NameNum;

                master.set({repeatData: obj});
            };

            options.error = function () {
                
            };

            this.model.GetRepeatContactsNew(options);
        },
        getUpdateData: function(){
            var _this, options, info, master, obj;

            _this = this;            
            master = this.master;

            options = {
                data: {
                    GetUpdatedContactsNum: {}
                },
                name: 'GetUpdatedContactsNum'
            };

            options.success = function(result){                
                info = result.GetUpdatedContactsNumResp;                
                if(info){
                    obj = new Object(info);
                    obj.sum = parseInt(info.UpdatedContactsNum);

                    master.set({updateData: obj});   
                }               
            };

            options.error = function(result){

            };

            this.model.fetch(options);
        },
        replaceStar: function (name) {
            //手机号变星星。
            var showName = name;
            if (name.length == 11 && /^\d+$/.test(name)) {
                showName = name.replace(/(?:^86)?(\d{3})\d{5}/, "$1*****");
            }
            return showName;
        }
    }));

})(jQuery, _, M139);


(function ($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.ToolBar";

    M.namespace(_class, M.View.ViewBase.extend({

        name: _class,

        el: "body",

        toolConfig: [            
            {text:'发邮件', id: 'tool_email', command:'post_handle', action: 'addr_post_mail', key: 'addr_more_mail', click:'post_email',
            menuItems: [
                {text: '发邮件', key: 'contact:sendMail', type: 'model', action: 'addr_send_mail'}, 
                {text: '发贺卡', key: 'contact:sendCard', type: 'model', action: 'addr_send_card'}
            ]},
            {text:'发短信', id: 'tool_sms', command:'post_handle', action: 'addr_post_sms', key: 'addr_more_sms', click:'post_sms',
            menuItems: [
                {text: '发短信', key: 'contact:sendSMS', type: 'model', action: 'addr_send_sms'}, 
                {text: '发彩信', key: 'contact:sendMMS', type: 'model', action: 'addr_send_mms'}
            ]},
            {text:'复制到组', id: 'tool_copy', command:'copy_group', action: 'addr_copy_group', menuItems: [{}]},
            {text:'移动到组', id: 'tool_move', command:'move_group', action: 'addr_move_group', menuItems: [{}]},
            {text:'删除', id: 'tool_delete', command:'remove', action: 'addr_remove'},
            {text:'编辑分组', id: 'tool_group_edit', command:'group_edit'},
            {text:'删除分组', id: 'tool_group_delete', command:'group_delete'},
            {html:'<em>更多</em>', id: 'tool_more', action: 'addr_more', command:'more',
            menuItems: [
                {text: '同步', key: 'contact:sync', type: 'model', action: 'addr_sync'}, 
                {text: '导出通讯录', key: 'addr_export', type: 'redirect'}, 
                {isLine: true},
                {text: '个人资料', key: 'addr_info_basic', type:'redirect'}
                //{text: '隐私设置', key: 'addr_setprivacy', type: 'redirect'}
            ]},
            { html: '<em>更新</em>', id: 'tool_update', action: 'addr_update_toggle', command: 'update', menuItems: [] }
        ],

        vipConfig: [
            {text: '添加vip联系人', id: 'tool_add_vip', command: 'add_vip', action: 'addr_add_vip', menuItems: undefined},
            {text: '取消vip联系人', id: 'tool_remove_vip', command: 'remove_vip', action: 'addr_remove_vip', menuItems: undefined}
        ],

        moreData: {
            repeat: {text: '', format: '可能重复({0})', command:'merge', obServer: 'repeat', key: 'contact:merge', type: 'model'},
            update: {text: '', format: '待更新({0})', obServer: 'update', key: 'addr_update', type: 'redirect'},
            pim: {text: '', format: '"和通讯录"更新({0})', obServer: 'pim', key: 'addr_pim', type: 'redirect'}
        },

        newGroup: {text: '新建分组...', key: 'contact:newGroup', type: 'model', action: 'addr_copy_new_group'},       

        command: {},

        obServer: [],

        obGroup: [],

        isUpdateShow: false,

        module: 'toolbar',

        logger: new M139.Logger({ name: _class }),

        initialize: function (options) {
            var _this = this;

            _this.master = options.master;
            _this.model = new M2012.Addr.Model.ToolBar();
            _this.initUI();
            _this.initEvents();
            return superClass.prototype.initialize.apply(_this, arguments);
        },

        initEvents: function () {
            var _this = this;
            var master = _this.master;
            var EVENTS = master.EVENTS;

            _this.command.add_vip = function(obj){
                master.trigger(EVENTS.LOAD_MODULE, {
                    key: 'contact:addVip',
                    action: obj.action
                });
            };

            _this.command.remove_vip = function(obj){
                master.trigger(EVENTS.LOAD_MODULE, {
                    key: 'contact:removeVip',
                    action: obj.action
                });
            };

            _this.command.post_email = function(obj){
                master.trigger(EVENTS.LOAD_MODULE, {
                    key: 'contact:sendMail',
                    action: obj.action
                });
            };

            _this.command.post_sms = function(obj){
                master.trigger(EVENTS.LOAD_MODULE, {
                    key: 'contact:sendSMS',
                    action: obj.action
                });
            };

            _this.command.post_handle = function(obj){
                master.trigger(EVENTS.LOAD_MODULE, obj);   
            };

            _this.command.copy_group = function(obj){
               master.trigger(EVENTS.LOAD_MODULE, obj);   
            };

            _this.command.move_group = function(obj){
               master.trigger(EVENTS.LOAD_MODULE, obj);   
            };

            _this.command.remove = function(obj){
               master.trigger(EVENTS.LOAD_MODULE, {
                    key: 'contact:remove',
                    action: obj.action
                });
            };

            _this.command.group_edit = function(obj){               
               master.trigger(master.EVENTS.LOAD_MODULE, {
                    actionKey: '350',
                    key: 'events:group'
                });  

            };

            _this.command.group_delete = function(obj){
               master.trigger(master.EVENTS.LOAD_MODULE, {
                    actionKey: '360',
                    key: 'events:group'
                }); 
            };

            _this.command.more = function(obj){
                var type = obj.type == 'model' ? EVENTS.LOAD_MODULE : EVENTS.REDIRECT;

                master.trigger(type, obj);               
            };

            _this.command.update = function (obj) {
                if(obj.type == 'model'){
                    master.trigger(EVENTS.LOAD_MODULE, obj);
                }else{
                    master.trigger(EVENTS.REDIRECT, obj);
                }
            };            

            master.bind(_this.module, function(data){
                _this[data.fun](data.data);
            });

            this.obServer.push({update: function(result){
                _this.initGroup(result);
            }});

            this.obServer.push({update: function(result) {
                _this.initMoveGroup(result);
            }});            

            this.obGroup.push({update: function(result) {
                _this.groupSelect(result);
            }});

            this.obGroup.push({update: function(result) {
                _this.initMoveGroup(result);
            }});

            master.on('change:repeatData', function(){
                var data = this.get('repeatData');
                _this.moreOptions({key: 'repeat', num: data.sum});
            });

            master.on('change:pimData', function(){
                var data = this.get('pimData');
                _this.moreOptions({key: 'pim', num: data.sum});
            });

            master.on('change:updateData', function(){
                var data = this.get('updateData');
                _this.moreOptions({key: 'update', num: data.sum});
            });
               
            this.setGroupData();
        },
        initUI: function(){

            this.ui = {};
            this.ui.body = $('body');
            this.ui.tooBar = $('#too_bar');
            this.ui.toolSync = $('#tool_sync');
            this.ui.toolMore = $('#tool_more');
            this.ui.toolMove = $('#tool_move');
            this.ui.toolEmail = $('#tool_email');
            this.ui.toolUpdate = $('#tool_update');
            this.ui.toolAddVip = $('#tool_add_vip');            
            this.ui.toolRemoveVip = $('#tool_remove_vip');
            this.ui.toolGroupEdit = $('#tool_group_edit');
            this.ui.toolGroupDelete = $('#tool_group_delete');

            this.createTool();
            this.initVip();            
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
                    _this.command[item.command](obj);
                };

                if(item.click){
                    options.onClick = function(obj){                        
                        _this.command[item.click](options);                        
                    };

                    options.onClickBefore = function(e){                        
                        if(item.key && item.key.length){
                            top.BH(item.key);
                        }                        
                        _this.ui.body.click();                        
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
        },
        moreOptions: function(data){
            var result, obj, more, config, len, menuItems, updateConfig, pimData, repeatData, updateData, sum;

            more = this.moreData;                       
            config = this.toolConfig;
            len = config.length;
            updateConfig = config[len - 1];
            menuItems = updateConfig.menuItems;

            pimData = this.master.get('pimData');
            repeatData = this.master.get('repeatData');
            updateData = this.master.get('updateData');
            sum = (pimData.sum || 0) + (repeatData.sum || 0) + (updateData.sum || 0);
            sum = sum > 99 ? 99: sum;
            
            this.ui.addrDot = $('#span_addr_dot');

            for(var i = 0; i < menuItems.length; i++){
                if(menuItems[i].key == more[data.key].key){
                    menuItems.splice(i, 1);
                    break;
                }
            }
			
			if(sum > 0){
				this.ui.addrDot.text(sum).show();
			}else{
				this.ui.addrDot.hide();
			}
			
            if(data.num > 0){
                more[data.key].text = more[data.key].format.format(data.num);
                menuItems.push(more[data.key]);                
            }

            if(menuItems.length == 0){
                this.ui.toolUpdate.hide();
                this.ui.addrDot.text('0').hide();
                this.isUpdateShow = false;
            }else{
                this.isUpdateShow = true;
                this.ui.toolUpdate.show();
            }
        },
        setGroupData: function(){
            var _this, options;

            _this = this;
            options = {};
            
            options.success = function(result){
                 _this.groupData = result;

                for(var i = 0, len = _this.obServer.length; i < len; i++){
                    if(_this.obServer[i].update){
                        _this.obServer[i].update(result);
                    }
                }
            };

            options.error = function () {
                
            };

            this.model.fetch(options);
        },
        initGroup: function(result){
            var _this, len;

            _this = this;            
            len = this.groupData.length;
            config = this.toolConfig[2];

            while(config.menuItems.length){
                config.menuItems.pop();
            }

            for(var i = 0; i < len; i++){                    
                var item = {                    
                    data: this.groupData[i],
                    key: 'contact:copyGroup',
                    text: this.groupData[i].GroupName
                };                 

                config.menuItems.push(item);                    
            }

            if(len > 0){
                config.menuItems.push({isLine: true});                
            }

            config.menuItems.push(_this.newGroup);
        }, 
        initMoveGroup: function(groupId){
            var _this, group, move;

            _this = this;
            _this.ui.toolMove.hide();
            move = this.toolConfig[3];
            group = _Groups.selectedGroup();
            groupId = groupId || _Groups.selectedGroupId();

            if(group && !group.isVipGroup() && !group.isAllContactsGroup() && !group.isNoGroup()){
                while(move.menuItems.length){
                    move.menuItems.pop();
                }            

                for(var i = 0; i < this.groupData.length; i++){
                    if(this.groupData[i].GroupId == groupId){
                        continue;
                    }

                    var item = {
                        data: this.groupData[i],
                        key: 'contact:moveGroup',
                        text: this.groupData[i].GroupName
                    };

                    move.menuItems.push(item);                    
                }

                if(move.menuItems.length){
                    _this.ui.toolMove.show();                    
                }
            }            
        },
        initVip: function(groupId){
            var _this, vip, len, i, options;

            _this = this;
            vip = this.vipConfig;
            len = vip.length;
            
            for(i = 0; i < len; i++){
                options = _this.setOptions(vip[i]);
                M2012.UI.MenuButton.create(options);
            }
        },
        groupSelect: function () {
            var group = _Groups.selectedGroup();
            if(group.isVipGroup()){
                this.ui.toolSync.hide();
                this.ui.toolMore.hide();
                this.ui.toolUpdate.hide();
                this.ui.toolAddVip.show();
                this.ui.toolRemoveVip.show();
                this.ui.toolEmail.find('a').addClass('ml_6'); 
                this.ui.toolAddVip.find('a').removeClass('ml_6');
            }else{
                this.ui.toolSync.show();
                this.ui.toolMore.show();                
                this.ui.toolAddVip.hide();
                this.ui.toolRemoveVip.hide();
                this.ui.toolEmail.find('a').removeClass('ml_6'); 

                if(this.isUpdateShow){
                   this.ui.toolUpdate.show();  
                }
            }

            if(group.isVipGroup() || group.isAllContactsGroup() || group.isNoGroup()){
                this.ui.toolGroupEdit.hide();
                this.ui.toolGroupDelete.hide();
            }else{
                this.ui.toolGroupEdit.show();
                this.ui.toolGroupDelete.show();
            }
        },
        groupChange: function (data) {
            for(var i = 0, len = this.obGroup.length; i < len; i++){
                if(this.obGroup[i].update){
                    this.obGroup[i].update(data);
                }
            }
        },
        toolShow: function () {
            this.ui.tooBar.show();
        },
        toolHide: function () {
            //this.ui.tooBar.hide();
        }
    }));

})(jQuery, _, M139);


;(function ($, _, M) {

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.ToolBar";


    M.namespace(_class, M.Model.ModelBase.extend({

        name: _class,

        initialize: function () {            
            superClass.prototype.initialize.apply(this, arguments);            
        },
        fetch: function(options) {
            var result = top.$App.getModel("contacts").getGroupList();

            options.success(result);
        }
    }));

})(jQuery, _, M139);



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
