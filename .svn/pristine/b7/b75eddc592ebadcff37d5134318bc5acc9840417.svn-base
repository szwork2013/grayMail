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
