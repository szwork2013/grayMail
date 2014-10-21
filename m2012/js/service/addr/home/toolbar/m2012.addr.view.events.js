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
