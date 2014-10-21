(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.GroupMail.View.GroupEdit', superClass.extend(
    {
        el: "body",
        DEFAULT_TIP: {
            TITLE_CREATE: '新建群组',
            TITLE_DEIT: '编辑群组',
            FAIL: '暂时无法处理该请求，请稍后再试',
            CREATE_SUCCESS: '新建成功，已向新增成员发送邮件邀请',            
            SAVE_SUCCESS: '保存成功',
            SAVE_SUCCESS_MAIL: '保存成功，已向新增成员发送邮件邀请',
            PAY_TIP: '群组已达上限{0}个。<br/>您可以升级套餐，享受{1}个群组及更多权益。',
            MAX_TIP: '群组已达上限{0}个',
            UPDATE_MEAL: '升级套餐',
            CLOSE: '关闭'
        },
        GOM_STATE: {
            CREATE: 'create',
            UPDATE: 'update',
            OTHER: 'other'
        },
        groupName: '',
        template: '<a class="lia <%=edit%>" href="javascript:void(0);" data-cid="<%=cid%>" title="<%=receiverEmail%>" hidefocus="1"><i class="i_del"></i><span><%=receiverName%></span></a>',
        events: {
        },
        initialize: function (options) {

            this.model = new M2012.GroupMail.Model.GroupEdit(options);
            this.contactsModel = top.M2012.Contacts.getModel()
            this.collection = new Backbone.Collection;            
            this.addMember = new Backbone.Collection;
            this.delMember = new Backbone.Collection;

            this.initUI();            
            this.initEvents();
            this.render();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initUI: function () {
            this.ui = {};
            
            this.ui.title = $('#title');            
            this.ui.btnSave = $('#btnSave');
            this.ui.btnCancel = $('#btnCancel');
            this.ui.lnkEmpty = $('#lnkEmpty');
            this.ui.gomUserTip = $('#gomUserTip');
            this.ui.txtGroupName = $('#txtGroupName');
            this.ui.selectedNum = $('#selectedNum');            
            this.ui.selection = $('#divSelection');
            this.ui.gomNullTip = $('#gomNullTip');
            this.ui.mainContent = $('#mainContent');
            this.ui.gomMemberMax = $('#gomMemberMax');
            this.ui.container = $('#divContainer').get(0);
            this.ui.main = $('#main');
            this.ui.newHead = $('#newHead');
            this.ui.editHead = $('#editHead');
            this.ui.goBack = $('#goBack');


            var colate = this.getColate();
            this.widget = new top.M2012.UI.Widget.Contacts.View({
                container: this.ui.container,
                width: "210px",
                colate: colate,
                receiverText: '',
                showLastAndCloseContacts: false,
                showVIPGroup: false,
                showSelfAddr: false,
                selectMode: true
            });
        },
        initEvents: function () {
            var _this = this;
            var ui = this.ui;
            var widget = this.widget;
            var collection = this.collection;

            widget.on('additem', function (e) {
                _this.addItem(e);
            });

            ui.btnSave.click(function () {
                if (_this.validate() && !_this.enabled) {
                    _this.enabled = true;
                    _this[_this.model.get('gomState')].update(_this);
                }
            });

            ui.goBack.click(function(){
                _this.back();
            });

            ui.btnCancel.click(function () {
                _this.back();
                _this[_this.model.get('gomState')].cancel(_this);
            });

            ui.lnkEmpty.click(function () {                
                while (collection.length) {
                    collection.pop();
                }
            });

            ui.selection.click(function (e) {
                var cid = $(e.target).parent().data("cid");
                var model = collection.get(cid);
                if (model) {
                    collection.remove(model);                    
                }
            });

            ui.txtGroupName.change(function () {
                _this.groupName = $(this).val().trim();
            });

            ui.txtGroupName.focus(function () {
                _this.hideTip();
            });

            collection.on('add', function (e) {                
                _this.add(e);
            });

            collection.on('remove', function (e) {
                _this.remove(e);
            });

            this.model.on("change:gomState", function () {                
                _this[_this.model.get('gomState')].render(_this);
            });

            $(window).resize(function () {
                var marginTop = 11;
                var winHeight = $(window).height() - 85;
                var conHeight = _this.ui.mainContent.height() + marginTop;
                var height = winHeight > conHeight ? conHeight : winHeight;
                                
                ui.main.css({ height: height });
            });

            $(window).resize();
        },
        render: function () {           

            var curUser = {};
            var groupNumber = $Url.queryString('groupNumber');
            var gomState = !!groupNumber ? this.GOM_STATE.UPDATE : this.GOM_STATE.CREATE;

            this.groupNumber = groupNumber;            
            this.model.set({ gomState: gomState });            
        },
        getColate: function(){
            var colate = '@139.com';
            var url = location.host;

            if (url.indexOf("10086ts") > -1) {
                colate = "@hmg1.rd139.com";
            }

            return colate;
        },
        showTip: function () {
            this.ui.gomNullTip.show();
        },
        hideTip: function () {
            this.ui.gomNullTip.hide();
        },
        add: function (e) {
            var _this = this;           

            var cls = e.get('isEdit') ? '' : 'on';
            var template = _.template(_this.template);
            var item = template({
                cid: e.cid,
                edit: cls,
                receiverName: M139.Text.Html.encode(e.get('receiverName')),
                receiverEmail: e.get('receiverEmail'),
                serialId: e.get('serialId')
            });

            this.ui.selection.append(item);
            this.changeLen(this.collection.length);
            this.ui.selection.scrollTop(this.ui.selection.height());

            if (this.model.get('gomState') != this.GOM_STATE.CREATE && e.get('isNew')) {
                var isAdd = true;

                this.delMember.each(function (d) {
                    if (d.get('serialId') == e.get('serialId')) {
                        isAdd = false;
                        _this.delMember.remove(d);
                        return false;
                    }
                });

                if (isAdd) {
                    this.addMember.add(e.toJSON());
                }
            }

        },
        remove: function (e) {
            var _this = this;         

            if (e.get('isEdit')) {
                this.widget.removeSelectedAddr(e.get('serialId'));
                this.ui.selection.find('[data-cid="' + e.cid + '"]').remove();
                this.changeLen(this.collection.length);
                this.ui.gomMemberMax.hide();
            }

            if (_this.model.get('gomState') != this.GOM_STATE.CREATE) {
                if (e.get('isNew')) {
                    this.addMember.each(function (o) {
                        if (o.get('serialId') == e.get('serialId')) {
                            _this.addMember.remove(o);
                            return false;
                        }
                    });
                } else {
                    this.delMember.add(e.toJSON());
                }
            }
        },
        addItem: function (e) {
            var _this = this;
            var addr = !e.isGroup ? [$.extend(e, { SerialId: e.serialId })] : e.value;

            _.each(addr, function (o) {
                if (_this.collection.length < _this.model.get('maxMember')) {
                    var c = _this.contactsModel.getContactsById(o.SerialId);
                    var item = {
                        userId: o.userId || 0
                    };

                    if(c){
                        item.serialId = c.SerialId;
                        item.receiverName = c.name;
                        item.receiverEmail = c.getFirstEmail();
                        item.receiverMobile = c.getFirstMobile();                        
                    }else{
                        item.serialId = o.SerialId;
                        item.receiverName = o.name;
                        item.receiverEmail = o.email;
                        item.receiverMobile = o.mobile;
                    }

                    item.isNew = o.isNew == undefined ? true : o.isNew;
                    item.isEdit = o.isEdit == undefined ? true : o.isEdit;

                    _this.collection.add(item);
                } else {
                    _this.ui.gomMemberMax.show();
                    setTimeout(function () { _this.ui.gomMemberMax.hide(); }, 3000);
                    if(!!o.SerialId){
                        _this.widget.removeSelectedAddr(o.SerialId); 
                    }
                    return false;
                }
            });
        },
        validate: function () {
            if (!this.groupName.length) {
                this.showTip();
                return false;
            }

            return true;
        },
        getContactsByEmail: function (email) {
            var item = {};
            var contacts = this.contactsModel.getContactsByEmail(email);

            if(contacts && contacts.length > 0){
                item = {
                    receiverEmail: contacts[0].getFirstEmail(),
                    receiverMobile: contacts[0].getFirstMobile(),
                    receiverName: contacts[0].name,
                    serialId: contacts[0].SerialId
                };
            }

            return item;
        },
        changeLen: function (len) {
            this.ui.selectedNum.text(len);
        },
        back: function(){
            if (top.$Addr) {
                var master = top.$Addr;
                master.trigger(master.EVENTS.LOAD_MAIN);
            }                        
        },
        create: {
            render: function (self) {
                var curUser = {
                        receiverEmail: top.$User.getDefaultSender(),
                        receiverMobile: top.$User.getShortUid(),
                        receiverName: top.$User.getSendName(),
                        serialId: '',
                        isEdit: false
                    };
                    
                    //self.ui.newHead.show()
                    //self.ui.editHead.hide();

                    self.collection.add(curUser);
                    self.ui.title.text(self.DEFAULT_TIP.TITLE_CREATE);

                    top.BH('gom_load_create_group_success');
            },
            update: function (self) {
                var _this = this;
                var options = {
                    groupName: self.groupName,
                    contactInfos: self.collection.toJSON()
                }

                options.success = function (result) {
                    //刷新主视图
                    self.enabled = false;
                    var groupNumber = result['var'] ? result['var'].groupNumber : 0;

                    top.BH('gom_creare_success');
                    top.BH('gom_send_mail_success');                    

                    self.model.set({ refreshMain: self.model.REFRESH_STATE.NEW_GROUP}, { groupNumber: groupNumber});
                    top.M139.UI.TipMessage.show(self.DEFAULT_TIP.CREATE_SUCCESS, { delay: 1000 });
                    self.back();
                };

                options.error = function (result) {
                    if (result.code == "PML10406001") {
                        var confirm;
                        var param = [];
                        var update = _this.updatePay;
                        var max = result.currLimitGroupCount;
                        var upMax = result.upgradeLimitGroupCount;
                        var close = function(){ confirm.close(); };
                        
                        if(result.upgrade == "true"){
                            param.push(self.DEFAULT_TIP.PAY_TIP.format(max, upMax));
                            param.push(update);
                            param.push(close);
                            param.push('');
                            param.push({ buttons: [self.DEFAULT_TIP.UPDATE_MEAL, self.DEFAULT_TIP.CLOSE], isHtml: true });
                        }else{
                            param.push(self.DEFAULT_TIP.MAX_TIP.format(max));
                            param.push(close);
                            param.push('');
                            param.push('');
                            param.push({ buttons: [self.DEFAULT_TIP.CLOSE], isHtml: true });
                        }

                        confirm = M2012.UI.DialogBase.confirm.apply(confirm, param);
                    } else {
                        top.$Msg.alert(result.summary || self.DEFAULT_TIP.FAIL);
                    }

                    self.enabled = false;
                }

                top.BH('gom_add_group_save');
                self.model.create(options);
            },
            cancel: function () {
                top.BH('gom_add_group_cancel');
            },
            updatePay: function(){
                top.BH('gom_group_update_meal'); 
                top.$App.show('mobile'); 
            }
        },
        update: {
            render: function (self) {
                
                //self.ui.newHead.hide()
                //self.ui.editHead.show();

                this.getUserList(self);
                self.ui.title.text(self.DEFAULT_TIP.TITLE_DEIT);
                top.BH('gom_load_edit_group_success');
            },
            update: function (self) {
                var options = {
                    userIds: this.getDelId(self),
                    groupNumber: self.groupNumber,
                    groupName: self.groupName,
                    contactInfos: self.addMember.toJSON()
                };

                options.success = function (result) {
                    //刷新主视图
                    self.model.set({ refreshMain: self.model.REFRESH_STATE.REFRESH });
                    var tip = !!options.contactInfos.length ? self.DEFAULT_TIP.SAVE_SUCCESS_MAIL : self.DEFAULT_TIP.SAVE_SUCCESS;

                    top.BH('gom_edit_success');
                    if (!!options.contactInfos.length) {
                        top.BH('gom_send_mail_success');
                    }

                    top.M139.UI.TipMessage.show(tip, { delay: 1000 });
                    self.back();
                    self.enabled = false;
                };

                options.error = function (result) {
                    self.enabled = false;
                    top.$Msg.alert(result.summary || self.DEFAULT_TIP.FAIL);
                }

                top.BH('gom_edit_group_save');
                self.model.update(options);
            },
            cancel: function () {
                top.BH('gom_edit_group_cancel');
            },
            getUserList: function (self) {
                var options = {
                    groupNumber: self.groupNumber,
                    pageSize: 100,
                    pageIndex: 1
                };

                options.success = function (result) {                    
                    var isEdit = true;

                    if (result.isOwner != 1) {
                        isEdit = false;
                        self.model.set({ gomState: self.GOM_STATE.OTHER });
                    }

                    _.each(result['var'].users, function (o) {
                        var edit = o.owner == 1 ? false : isEdit;
                        var item = self.getContactsByEmail(o.email);
                            item.name = o.name;
                            item.email = o.email;
                            item.mobile = o.mobile;
                            item.isEdit = edit;
                            item.isNew = false;
                            item.userId = o.userId;
                            item.SerialId = item ? item.serialId : 0;

                        self.widget.trigger('additem', item);
                        //self.collection.add(o);
                    });

                    self.ui.txtGroupName.val(result.gomName);
                    self.ui.txtGroupName.change();
                };

                options.error = function (result) {
                    top.$Msg.alert(result.summary || self.DEFAULT_TIP.FAIL);
                };

                self.model.getUserList(options);
            },
            getDelId: function (self) {
                var list = [];
                self.delMember.each(function (e) {
                    list.push(e.get('userId'));
                });

                return list.join(',');
            },
            getAdd: function (self) {
                /*
                var addMember = [];
                var delMember = [];
                _.each(self.collection, function (o) {
                    var isAdd = false;
                    var isRemove = false;
                    var isNew = o.get('isNew');
                    var member = self.member.toJSON();
                    var serialId = o.get('serialId');
                    
                    for(var i = 0, len = member.length; i < len; i++){
                        if (isNew && serialId == member[i].serialId) {
                            isAdd = false;
                            isRemove = false;
                            return false;
                        } else if (!isNew && serialId == member[i].serialId) {
                            isAdd = false;
                            isRemove = false;
                            return false;
                        }
                    }
                    _.each(self.member, function (e) {
                        
                    });

                    if (isAdd) {
                        addMember.push(o.toJSON());
                    }

                    if(isRemove)

                });

                */
            }
        },
        other: {
            render: function (self) {
                self.ui.gomUserTip.show();
                top.BH('gom_load_edit_group_success');
            },
            update: function (self) {
                self[self.GOM_STATE.UPDATE].update(self);
            },
            cancel: function (self) {                
                self[self.GOM_STATE.UPDATE].cancel(self);
            }
        }


    }));
    
    $(function () {        
        var main = new M2012.GroupMail.View.GroupEdit({ model: top.$Addr.GomModel });
    });

})(jQuery, _, M139);


(function (jQuery, _, M139) {
    var $ = jQuery;
    var _class = "M2012.GroupMail.Model.GroupEdit";
    var superClass = M139.Model.ModelBase;
    M139.namespace(_class, superClass.extend({
        name: _class,

        defaults: {
            gomState: '', //详情页当前状态
            maxMember: 50, //详情页群组成员上限
            refreshMain: ''
        },
        initialize: function (options) {

            this.model = options.model;
            this.REFRESH_STATE = this.model.REFRESH_STATE;
            
            this.initEvent();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initEvent: function () {
            var _this = this;

            this.on('change:refreshMain', function (e, o, v) {
                _this.model.set({ refreshMain: o}, v);
            });
        },
        getUserList: function (options) {
            this.model.getUserList(options);
        },
        create: function (options) {
            this.model.createGom(options);
        },
        update: function (options) {
            this.model.updateGom(options);
        }
    }));
})(jQuery, _, M139);



