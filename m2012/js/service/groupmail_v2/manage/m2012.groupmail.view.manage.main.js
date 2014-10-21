(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.GroupMail.View.Manage.Main', superClass.extend(
    {
        el: "body",
        template:"",
        MAIN_STATE: {
            GROUP: 'group',
            CONTACTS: 'contacts',
            GROUP_NOTIFY: 'groupNotify'            
        },
        events: {
            "click #btn-create": "createClick"
        },
        initialize: function (options) {
            this.model = options.model;
            var self = this;
            
            this.ui = {};
            this.ui.groupsNav = $('#addr-tab  .groups-nav');
            this.ui.btnCreate = $('#btn-create');
            this.ui.listBody = $('#main_container .addr-list-body');
            this.ui.m139GroupList = $('#group-contacts-list');
            this.ui.m139ContactsList = $('#m139-contacts-list');
            this.ui.mainIframe = $('#main_iframe');
            this.ui.mainContainer = $('#main_container');

            this.ui.leftbarGroup = $('#leftbar-group');
            this.ui.leftbarContacts = $('#leftbar-contacts');            

            this.initEvents();
            this.render();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initEvents: function () {            
            var _this = this;
            var ui = this.ui;

            this.model.on('change:mainState', function (args) {
                var state = _this.model.get('mainState');
                _this[state].render(_this, args.target);
            });

            ui.groupsNav.click(function (e) {
                var state = $(this).data('state');

                _this.model.set({ mainState: state }, {silent: true});
                _this.model.trigger("change:mainState",{target: $(this)});
            });
        },
        createClick: function () {
            var key = this.model.get('mainState') == this.MAIN_STATE.CONTACTS ? 'addr_add_contacts' : 'addr_team_create';

            if (key == 'addr_team_create') {
                top.BH('gom_create_group')
            }

            $Addr.trigger('redirect', { key: key });
        },
		render : function(){
		    this.groupPanel = new M2012.GroupMail.View.GroupPanel({ model: this.model });
		    this.memberListView = new M2012.GroupMail.View.MemberList({ model: this.model });
		    this.model.set({ refreshNotice: new Date() });
		},	
		// 初始化模型层数据
		getDataSource : function(callback){
		
		},
        contacts:{
            render: function(self, target){
                var ui = self.ui;

                ui.groupsNav.parent().removeClass('liline on');
                ui.groupsNav.eq(0).parent().addClass('liline on');

                ui.listBody.hide();
                ui.leftbarGroup.hide();                

                ui.leftbarContacts.show();
                ui.m139ContactsList.show();

                /*强制刷新通讯录*/
               /*
                _EA_G.keyTrigger("SELECT_GROUP", {
                    groupId: _DataBuilder.allContactsGroupId()
                }, { showMain: true });
                */
               
                $Addr.trigger($Addr.EVENTS.LOAD_MODULE, {
                    key: 'events:selectGroup',
                    command: 'SELECT_GROUP',
                    data: {
                        groupId: 0                        
                    },
                    param: {
                        showMain: true
                    }
                });

                $Addr.trigger($Addr.EVENTS.LOAD_MODULE, {
                     key: 'events:resetLeftbar'
                });
                
                top.BH('gom_tab_contacts');
            }
        },
        group: {
            render: function (self, target) {
                var ui = self.ui;
                var height = $(window).height();

                ui.groupsNav.parent().removeClass('liline on');
                ui.groupsNav.eq(1).parent().addClass('liline on');

                /*强制刷新通讯录*/
                $Addr.trigger($Addr.EVENTS.LOAD_MODULE, {
                    key: 'events:selectGroup',
                    command: 'SELECT_GROUP',
                    data: {
                        groupId: 0                        
                    },
                    param: {
                        showMain: true
                    }
                });

                ui.listBody.hide();                
                ui.leftbarContacts.hide();                                

                ui.leftbarGroup.show();                
                ui.m139GroupList.show().height(height);
                self.model.set({ refreshMain: self.model.REFRESH_STATE.DEFAULT });
                top.BH('gom_tab_group');
            }
        },
        groupNotify:{
            render: function (self, target) {
                var ui = self.ui;
                var height = $(window).height();

                ui.groupsNav.parent().removeClass('liline on');
                ui.groupsNav.eq(1).parent().addClass('liline on');

                ui.listBody.hide();
                ui.leftbarContacts.hide();

                ui.leftbarGroup.show();                
                ui.m139GroupList.show().height(height);

                if (!self.memberListView) {
                    self.render();
                }

                top.BH('gom_tab_notify');
                self.model.set({ refreshMain: self.model.REFRESH_STATE.NOTIFY });
                $Addr.trigger('redirect', { key: 'addr_team_notify' });
            }
        }
    }));
})(jQuery, _, M139);

