
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

